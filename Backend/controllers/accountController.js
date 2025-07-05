import BaseController from './baseController.js';
import User from '../models/user.js';
import { generateJwtToken } from '../utils/index.js';
import dotenv from 'dotenv';
import AppError from '../utils/appError.js';
dotenv.config();

const baseAccountController = new BaseController(User);

export const getAllAccounts = baseAccountController.getAll;
export const getAccount = baseAccountController.getById;

export const verifyGoogleToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return next(new AppError('ID token is required', 400));
        }

        const googleTokenInfoUrl = `${process.env.GOOGLE_TOKENINFO_URL}${token}`;
        const tokenInfoResponse = await fetch(googleTokenInfoUrl);
        
        if (!tokenInfoResponse.ok) {
            return next(new AppError('Invalid ID token', 401));
        }

        const tokenInfo = await tokenInfoResponse.json();

        if (!tokenInfo || !tokenInfo.email) {
            return next(new AppError('Token does not belong to this app', 401));
        }

        const email = tokenInfo.email;
        let username = email.split('@')[0];
        username = username.replace(/[^a-zA-Z0-9_.]/g, '_');
        const profilePicture = tokenInfo.picture || null;

        let user = await User.findOne({ email: email });

        if (!user) {
            user = new User({
                username: username,
                email: email,
                profilePicture: profilePicture
            });

            try {
                await user.save();
            } catch (error) {
                return next(new AppError('Error creating user: ' + error.message, 400));
            }
        } else {
            if (profilePicture && user.profilePicture !== profilePicture) {
                user.profilePicture = profilePicture;
                await user.save();
            }
        }

        const jwtToken = generateJwtToken(user);

        return res.status(200).json({
            message: 'Token is valid',
            token: jwtToken
        });

    } catch (error) {
        return next(new AppError('Error verifying token: ' + error.message, 500));
    }
};