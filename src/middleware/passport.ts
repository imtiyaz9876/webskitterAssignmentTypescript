// src/middleware/passport.ts
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";
import { PassportStatic } from "passport";
import User from "../Models/User";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret, // Ensure this is a string
};

export const initializePassport = (passport: PassportStatic) => {
  passport.use(
    new Strategy(opts, async (payload: { _id: string }, done: VerifiedCallback) => {
      try {
        const user = await User.findById(payload._id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
