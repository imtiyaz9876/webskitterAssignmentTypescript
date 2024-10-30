"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuestionInBulk = exports.questionCategoryWise = exports.createQuestion = void 0;
const questionModel_1 = __importDefault(require("../Models/questionModel"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const createQuestion = async (req, res) => {
    const { question, categories } = req.body;
    try {
        const newQuestion = new questionModel_1.default({
            question,
            categories,
        });
        await newQuestion.save();
        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion,
        });
    }
    catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating question",
        });
    }
};
exports.createQuestion = createQuestion;
const questionCategoryWise = async (req, res) => {
    const { category } = req.params;
    try {
        const questions = await questionModel_1.default.find({ categories: category });
        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this category",
            });
        }
        return res.status(200).json({
            success: true,
            questions,
        });
    }
    catch (error) {
        console.error("Error fetching questions by category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching questions",
        });
    }
};
exports.questionCategoryWise = questionCategoryWise;
const addQuestionInBulk = async (req, res) => {
    const results = [];
    console.log("Adding Question");
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }
    // Create a readable stream from the uploaded file
    const stream = fs_1.default.createReadStream(req.file.path);
    // Pipe the CSV data to the parser
    stream
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
        try {
            // Save all questions to the database
            const savePromises = results.map(async (item) => {
                const { question, categories } = item;
                const newQuestion = new questionModel_1.default({
                    question,
                    categories: categories.split(",").map((cat) => cat.trim()),
                });
                return await newQuestion.save();
            });
            // Wait for all questions to be saved
            await Promise.all(savePromises);
            // Send success response after all questions are processed
            return res.status(201).json({
                success: true,
                message: "Questions uploaded successfully",
            });
        }
        catch (error) {
            console.error("Error uploading questions:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while uploading questions",
            });
        }
    })
        .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        return res.status(500).json({
            success: false,
            message: "Error reading CSV file",
        });
    });
    // Ensure to return a response for the case where the stream fails before 'end'
    return new Promise((resolve, reject) => {
        stream.on('close', () => resolve(res));
        stream.on('error', () => reject(res));
    });
};
exports.addQuestionInBulk = addQuestionInBulk;
