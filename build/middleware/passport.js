"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
// src/middleware/passport.ts
const passport_jwt_1 = require("passport-jwt");
const User_1 = __importDefault(require("../Models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret, // Ensure this is a string
};
const initializePassport = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, async (payload, done) => {
        try {
            const user = await User_1.default.findById(payload._id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }
        catch (err) {
            return done(err, false);
        }
    }));
};
exports.initializePassport = initializePassport;
