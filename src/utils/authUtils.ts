import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../Models/User"; // Adjust the import according to your user model

// Passport middleware
const user_auth = passport.authenticate("jwt", { session: false });

// Serialize user function
const serializeUser = (user: IUser, req: Request) => {
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

/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser | undefined; // Ensure req.user is defined before casting
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

export {
  user_auth,
  serializeUser,
  checkRole
};
