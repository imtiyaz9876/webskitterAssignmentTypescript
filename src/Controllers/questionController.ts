import { Request, Response } from 'express';
import Question from '../Models/questionModel';
import fs from 'fs';
import csv from 'csv-parser';

export const createQuestion = async (req: Request, res: Response) => {
    const { question, categories } = req.body;

    try {
        const newQuestion = new Question({
            question,
            categories,
        });
        await newQuestion.save();

        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion,
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating question",
        });
    }
};

export const questionCategoryWise = async (req: Request, res: Response) => {
    const { category } = req.params;

    try {
        const questions = await Question.find({ categories: category });

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
    } catch (error) {
        console.error("Error fetching questions by category:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching questions",
        });
    }
};

export const addQuestionInBulk = async (req: Request, res: Response): Promise<Response> => {
    const results: any[] = [];
    console.log("Adding Question");

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }

    // Create a readable stream from the uploaded file
    const stream = fs.createReadStream(req.file.path);

    // Pipe the CSV data to the parser
    stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                // Save all questions to the database
                const savePromises = results.map(async (item) => {
                    const { question, categories } = item;
                    const newQuestion = new Question({
                        question,
                        categories: categories.split(",").map((cat: string) => cat.trim()),
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
            } catch (error) {
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


