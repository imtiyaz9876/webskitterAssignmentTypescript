
import Joi from "joi";

// Define Joi validation schema for user creation
export const UserValidation = Joi.object({
  name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobile: Joi.string().length(10).required(),
    gender: Joi.string().valid('Male', 'Female', 'other').required(),
});

// Define validation for user ID (e.g., in routes that require a user ID)
export const UserIdValidation = Joi.string().alphanum().required();
