import BaseController from './baseController.js';
import mongoose from 'mongoose';
import MediaFile from '../models/mediaFile.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import AppError from '../utils/appError.js';

const baseMediaFileController = new BaseController(MediaFile);


const createMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }
    const filePath = req.file.path;
    let result;
    let resourceType = 'auto';
    let fileType = req.body.fileType || 'image';
    if (fileType.toLowerCase() === 'pdf' || req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      resourceType = 'raw';
      fileType = 'pdf';
    }
    try {
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
      });
    } catch (err) {
      fs.unlinkSync(filePath);
      return next(new AppError('Cloud upload failed: ' + err.message, 500));
    }
    fs.unlinkSync(filePath);
    const {
      tags = [],
      description = '',
      userId,
      createdBy = 'system',
    } = req.body;
    if (!userId) {
      return next(new AppError('userId is required', 400));
    }
    const mediaFile = new MediaFile({
      fileName: req.file.originalname,
      fileType,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileSize: req.file.size,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',') : [],
      description,
      userId,
      createdBy,
    });
    await mediaFile.save();
    res.status(201).json(mediaFile);
  } catch (error) {
    return next(new AppError('Error creating media: ' + error.message, 500));
  }
};

const getAll = async (req, res, next) => {
  try {
    const {
      fileType,
      tags,
      userId,
      createdBy,
      minSize,
      maxSize,
      dateFrom,
      dateTo,
      search,
      sortBy,
      order,
      page,
      limit
    } = req.query;


    const match = {};
    if (fileType) match.fileType = fileType;
    if (userId) {
      try {
        match.userId = new mongoose.Types.ObjectId(userId);
      } catch (e) {
        return next(new AppError('Invalid userId format', 400));
      }
    }
    if (createdBy) match.createdBy = createdBy;
    if (minSize) match.fileSize = { ...match.fileSize, $gte: Number(minSize) };
    if (maxSize) match.fileSize = { ...match.fileSize, $lte: Number(maxSize) };
    if (dateFrom || dateTo) {
      match.createdOn = {};
      if (dateFrom) match.createdOn.$gte = new Date(dateFrom);
      if (dateTo) match.createdOn.$lte = new Date(dateTo);
    }
    if (tags) {
      const tagsArr = Array.isArray(tags) ? tags : tags.split(',');
      match.tags = { $in: tagsArr };
    }
    match.isActive = true;

    const pipeline = [];

    if (search) {
      const regex = new RegExp(search, 'i');
      const words = search.split(/\s+/).filter(Boolean);
      const fuzzyRegexes = words.map(word => {
        if (word.length <= 2) return new RegExp(word, 'i');
        return new RegExp(word.split('').join('.?'), 'i');
      });
      pipeline.push({
        $match: {
          $or: [
            { fileName: { $regex: regex } },
            { description: { $regex: regex } },
            { createdBy: { $regex: regex } },
            { modifiedBy: { $regex: regex } },
            { fileType: { $regex: regex } },
            { tags: { $elemMatch: { $regex: regex } } },
            ...fuzzyRegexes.flatMap(fuzzy => ([
              { fileName: { $regex: fuzzy } },
              { description: { $regex: fuzzy } },
              { createdBy: { $regex: fuzzy } },
              { modifiedBy: { $regex: fuzzy } },
              { fileType: { $regex: fuzzy } },
              { tags: { $elemMatch: { $regex: fuzzy } } }
            ]))
          ]
        }
      });
      if (Object.keys(match).length > 0) {
        pipeline.push({ $match: match });
      }
    } else {
      pipeline.push({ $match: match });
    }

    pipeline.push({
      $addFields: {
        normViewCount: {
          $cond: [
            { $gt: ["$viewCount", 0] },
            { $divide: ["$viewCount", { $add: [1, "$viewCount"] }] },
            0
          ]
        },
        recencyScore: {
          $cond: [
            { $ifNull: ["$createdOn", false] },
            {
              $divide: [
                { $subtract: [new Date(), "$createdOn"] },
                1000 * 60 * 60 * 24 * 365
              ]
            },
            0
          ]
        }
      }
    });
    pipeline.push({
      $addFields: {
        customScore: {
          $add: [
            { $multiply: [0.5, { $ifNull: ["$textScore", 0] }] },
            { $multiply: [0.3, "$normViewCount"] },
            { $multiply: [0.2, { $subtract: [1, "$recencyScore"] }] }
          ]
        }
      }
    });

    let sortStage = {};
    if (sortBy) {
      let sortField = sortBy === "createdAt" ? "createdOn" : sortBy;
      if (["viewCount", "createdOn", "fileName", "fileSize"].includes(sortField)) {
        sortStage[sortField] = order === "asc" ? 1 : -1;
      } else if (sortBy === "relevance" || (search && !sortBy)) {
        sortStage = { customScore: -1 };
      }
    } else if (search) {
      sortStage = { customScore: -1 };
    } else {
      sortStage = { createdOn: -1 };
    }
    pipeline.push({ $sort: sortStage });

    let pageNum = 1;
    let limitNum = 0;
    if (page && limit && !isNaN(Number(page)) && !isNaN(Number(limit))) {
      pageNum = Math.max(Number(page), 1);
      limitNum = Math.max(Number(limit), 1);
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
    }

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId"
      }
    });
    pipeline.push({
      $unwind: {
        path: "$userId",
        preserveNullAndEmptyArrays: true
      }
    });
    pipeline.push({
      $project: {
        fileName: 1,
        fileType: 1,
        cloudinaryUrl: 1,
        cloudinaryPublicId: 1,
        fileSize: 1,
        tags: 1,
        viewCount: 1,
        description: 1,
        createdBy: 1,
        createdOn: 1,
        userId: { username: 1, email: 1, profilePicture: 1, _id: 1 },
        customScore: 1
      }
    });

    const mediaFiles = await MediaFile.aggregate(pipeline);
    res.json(mediaFiles);
  } catch (error) {
    return next(new AppError('Error fetching all media files: ' + error.message, 500));
  }
};


const getById = async (req, res, next) => {
  try {
    const doc = await MediaFile.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('userId', 'username email profilePicture');
    
    if (!doc) {
      return next(new AppError('Media file not found', 404));
    }
    
    res.json(doc);
  } catch (error) {
    return next(new AppError('Error fetching media file: ' + error.message, 500));
  }
};



const mediaFileController = {
  ...baseMediaFileController,
  createMedia,
  getAll,
  getById,
};

export default mediaFileController;
