"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_password = exports.update_profile = exports.login_user = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import createError from "http-errors";
const User_1 = __importDefault(require("../Models/User"));
const UserValidation_1 = require("../Validations/UserValidation");
// import { JWT_SECRET } from "../config"; // Ensure this is your JWT secret
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        throw new Error("Password hashing failed");
    }
};
const createToken = async (id, role, email) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT secret is not defined in environment variables");
        }
        const token = await jsonwebtoken_1.default.sign({ _id: id, role, email }, secret, {
            expiresIn: "1h",
        });
        return token;
    }
    catch (error) {
        throw new Error("Token creation failed");
    }
};
const registerUser = async (req, role, res, next) => {
    try {
        // Validate user input
        const validatedData = await UserValidation_1.UserValidation.validateAsync(req.body);
        console.log(req.body, "hiii");
        // Check if the mobile number already exists
        const existingUser = await User_1.default.findOne({ mobile: validatedData.mobile });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This mobile is already in use",
            });
        }
        // Hash the password
        const hashedPassword = await securePassword(validatedData.password);
        // Create a new user instance
        const newUser = new User_1.default({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            image: req.file?.filename, // Assumes image upload is handled separately
            mobile: validatedData.mobile,
            gender: validatedData.gender,
            role: role, // default role or set based on req.body if needed
        });
        // Save the new user to the database
        const savedUser = await newUser.save();
        // Generate a JWT token for the user
        const token = await createToken(savedUser._id.toString(), savedUser.role, savedUser.email);
        return res.status(201).json({
            success: true,
            data: savedUser,
            token: `Bearer ${token}`,
        });
    }
    catch (error) {
        if (error.isJoi) {
            return res.status(400).json({
                success: false,
                message: "Invalid details provided",
            });
        }
        return next(error); // Add "return" to ensure the function returns here
    }
};
exports.registerUser = registerUser;
const login_user = async (req, role, res, _next) => {
    try {
        const { email, password } = req.body;
        const userData = await User_1.default.findOne({ email });
        if (userData) {
            if (userData.role !== role) {
                res.status(403).json({
                    success: false,
                    message: `You are not allowed to access this page`,
                });
                return;
            }
            if (!userData.password) {
                res.status(400).json({ success: false, message: "Password not found" });
                return;
            }
            const passwordMatch = await bcryptjs_1.default.compare(password, userData.password);
            if (passwordMatch) {
                const tokenData = await createToken(userData._id.toString(), userData.role, userData.email);
                const userResult = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    mobile: userData.mobile,
                    image: userData.image,
                    role: userData.role,
                    token: `Bearer ${tokenData}`,
                };
                res.status(200).json({
                    success: true,
                    message: "User details",
                    data: userResult,
                });
            }
            else {
                res.status(400).json({ success: false, message: "Login details are incorrect" });
            }
        }
        else {
            res.status(400).json({ success: false, message: "Login details are incorrect" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }
};
exports.login_user = login_user;
const update_profile = async (req, role, res, _next) => {
    try {
        const user = req.user; // Cast req.user to IUser or undefined
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const user_id = user._id; // Now user is guaranteed to be defined
        // Find the user by their ID
        const userData = await User_1.default.findOne({ _id: user_id });
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "User with this ID does not exist",
            });
        }
        if (userData.role !== role) {
            return res.status(403).json({
                success: false,
                message: `You are not allowed to access this page`,
            });
        }
        // Update the user's information
        userData.name = req.body.name;
        userData.mobile = req.body.mobile;
        userData.gender = req.body.gender;
        // Check if a file is uploaded
        if (req.file) {
            userData.image = req.file.filename;
        }
        // Save the updated user data
        await userData.save();
        return res.status(200).json({
            success: true,
            message: "Successfully updated your profile",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "An error occurred",
        });
    }
};
exports.update_profile = update_profile;
const update_password = async (req, _role, res, _next) => {
    try {
        const user = req.user; // Cast req.user to IUser or undefined
        if (!user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const user_id = user._id;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        if (!newPassword || !oldPassword) {
            return res.status(400).json({
                success: false,
                message: "Both new and old passwords must be provided",
            });
        }
        // Find the user by ID
        const data = await User_1.default.findOne({ _id: user_id });
        if (!data) {
            return res.status(400).json({ success: false, message: "User ID not found" });
        }
        // Ensure data.password is defined
        if (!data.password) {
            return res.status(400).json({ success: false, message: "Password not set for user" });
        }
        // Compare old password
        const passwordMatch = await bcryptjs_1.default.compare(oldPassword, data.password);
        if (passwordMatch) {
            const newpassword = await securePassword(newPassword); // Assume securePassword hashes the new password
            // Update the user's password
            await User_1.default.findByIdAndUpdate(user_id, {
                $set: {
                    password: newpassword,
                },
            });
            return res.status(200).json({
                success: true,
                message: "Password Updated Successfully!",
            });
        }
        else {
            return res.status(400).json({ success: false, message: "Your old password is incorrect" });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }
};
exports.update_password = update_password;
