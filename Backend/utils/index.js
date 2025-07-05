import jwt from 'jsonwebtoken';

export const generateJwtToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || ''
    };

    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: '24h' };
    return jwt.sign(payload, secretKey, options);
};
