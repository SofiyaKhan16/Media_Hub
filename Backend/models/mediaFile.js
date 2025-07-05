import { Schema, model } from 'mongoose';
import baseSchema from './baseSchema.js';

const mediaFileSchema = new Schema({
  ...baseSchema.obj,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'audio', 'pdf']
  },
  cloudinaryUrl: {
    type: String,
    required: true,
    trim: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: false
});

mediaFileSchema.index({
  fileName: 'text',
  tags: 'text',
  description: 'text',
  createdBy: 'text',
  modifiedBy: 'text',
  fileType: 'text'
}, { name: 'text_search_index' });

mediaFileSchema.index({ viewCount: -1 }, { name: 'view_count_index' });
mediaFileSchema.index({ createdOn: -1 }, { name: 'created_on_index' });
mediaFileSchema.index({ fileType: 1 }, { name: 'file_type_index' });
mediaFileSchema.index({ createdBy: 1 }, { name: 'created_by_index' });

mediaFileSchema.add({
  createdBy: {
    type: String,
    required: true,
    trim: true,
    default: 'system',
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}|system)$/, 'Please provide a valid email address or "system"']
  },
  modifiedBy: {
    type: String,
    trim: true,
    default: null,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}|system|null)$/, 'Please provide a valid email address, "system", or null']
  }
});

export default model('MediaFile', mediaFileSchema);