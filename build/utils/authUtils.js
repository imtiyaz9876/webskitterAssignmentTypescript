"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.serializeUser = exports.user_auth = void 0;
const passport_1 = __importDefault(require("passport"));
// Passport middleware
const user_auth = passport_1.default.authenticate("jwt", { session: false });
exports.user_auth = user_auth;
// Serialize user function
const serializeUser = (user, req) => {
    const imageUrl = user.image
        ? `${req.protocol}://${req.get("host")}/public/userImages/${user.image}`
        : null;
    return {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        image: imageUrl, // Include the image URL here
    };
};
exports.serializeUser = serializeUser;
/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user; // Ensure req.user is defined before casting
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: `You are not allowed to access this page`,
            });
        }
        // Call next() if the user has the required role
        return next();
    };
};
exports.checkRole = checkRole;
