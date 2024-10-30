"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const questionController_1 = require("../Controllers/questionController");
const question_route = (0, express_1.default)();
question_route.use(body_parser_1.default.urlencoded({ extended: true }));
question_route.use(body_parser_1.default.json());
question_route.use(express_1.default.static(path_1.default.resolve(__dirname, "../public"))); // Use resolve for static files
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
question_route.post("/createQuestion", (req, res) => (0, questionController_1.createQuestion)(req, res));
question_route.get("/questionCategoryWise/:category", (req, res) => (0, questionController_1.questionCategoryWise)(req, res));
question_route.post("/questions/bulk", upload.single('file'), (req, res) => (0, questionController_1.addQuestionInBulk)(req, res));
exports.default = question_route;
