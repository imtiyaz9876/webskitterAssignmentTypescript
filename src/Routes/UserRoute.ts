import express, { Request, Response,NextFunction } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import passport from "passport";
import  { IUser } from "../Models/User";
// import session from "express-session";
import { registerUser,login_user,update_profile,update_password} from "../Controllers/UserController";
import { user_auth, serializeUser } from "../utils/authUtils";

const user_route = express();

// Middleware setup
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(bodyParser.json());
user_route.use(express.static(path.resolve(__dirname, "../public/userImages"))); // Resolve for static files


user_route.use(passport.initialize());
// user_route.use(passport.session());

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {  // Prefix unused variables with underscore
    const destPath = path.resolve(__dirname, "../public/userImages");
    cb(null, destPath);
  },
  filename: function (_req, file, cb) {  // Prefix unused 'req' with underscore
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage });



// Register user
user_route.post("/register", upload.single("image"), (req: Request, res: Response, next: NextFunction) =>
    registerUser(req,"user", res, next)
);

// Login user
  user_route.post("/login", (req: Request, res: Response, next: NextFunction) => 
    login_user(req, "user", res, next)
  );
  
// Profile route
user_route.get("/profile", user_auth, (req: Request, res: Response) => {
  const serializedUser = serializeUser(req.user as IUser, req);

  if (!serializedUser) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  return res.status(200).json(serializedUser);
});

// Update the profile route accordingly
  user_route.post(
    "/update-profile-user",
    upload.single("image"),
    user_auth,
    (req: Request, res: Response,next: NextFunction) => update_profile(req, "user", res,next)
);
  

user_route.post("/update-password",  user_auth,
    (req: Request, res: Response,next: NextFunction) => update_password(req, "user", res,next));



export default user_route;
