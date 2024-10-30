"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
// import session from "express-session";
const UserController_1 = require("../Controllers/UserController");
const authUtils_1 = require("../utils/authUtils");
const user_route = (0, express_1.default)();
// Middleware setup
user_route.use(body_parser_1.default.urlencoded({ extended: true }));
user_route.use(body_parser_1.default.json());
user_route.use(express_1.default.static(path_1.default.resolve(__dirname, "../public/userImages"))); // Resolve for static files
user_route.use(passport_1.default.initialize());
// user_route.use(passport.session());
// Multer configuration for image upload
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        const destPath = path_1.default.resolve(__dirname, "../public/userImages");
        cb(null, destPath);
    },
    filename: function (_req, file, cb) {
        const name = Date.now() + "_" + file.originalname;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({ storage });
// Register user
user_route.post("/register", upload.single("image"), (req, res, next) => (0, UserController_1.registerUser)(req, "user", res, next));
// Login user
user_route.post("/login", (req, res, next) => (0, UserController_1.login_user)(req, "user", res, next));
// Profile route
user_route.get("/profile", authUtils_1.user_auth, (req, res) => {
    const serializedUser = (0, authUtils_1.serializeUser)(req.user, req);
    if (!serializedUser) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    return res.status(200).json(serializedUser);
});
// Update the profile route accordingly
user_route.post("/update-profile-user", upload.single("image"), authUtils_1.user_auth, (req, res, next) => (0, UserController_1.update_profile)(req, "user", res, next));
user_route.post("/update-password", authUtils_1.user_auth, (req, res, next) => (0, UserController_1.update_password)(req, "user", res, next));
exports.default = user_route;
