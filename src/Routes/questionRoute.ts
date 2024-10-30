import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { createQuestion, questionCategoryWise, addQuestionInBulk } from '../Controllers/questionController';

const question_route = express();

question_route.use(bodyParser.urlencoded({ extended: true }));
question_route.use(bodyParser.json());
question_route.use(express.static(path.resolve(__dirname, "../public"))); // Use resolve for static files

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

question_route.post("/createQuestion", (req: Request, res: Response) =>
    createQuestion(req, res)
);
question_route.get("/questionCategoryWise/:category", (req: Request, res: Response) =>
    questionCategoryWise(req, res)
);
question_route.post("/questions/bulk", upload.single('file'), (req: Request, res: Response) =>
    addQuestionInBulk(req, res)
);

export default question_route;
