"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdValidation = exports.UserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Define Joi validation schema for user creation
exports.UserValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    mobile: joi_1.default.string().length(10).required(),
    gender: joi_1.default.string().valid('Male', 'Female', 'other').required(),
});
// Define validation for user ID (e.g., in routes that require a user ID)
exports.UserIdValidation = joi_1.default.string().alphanum().required();
