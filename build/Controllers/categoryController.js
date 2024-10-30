"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategory = exports.createCategory = void 0;
const categoryModel_1 = __importDefault(require("../Models/categoryModel"));
// import asyncErrorHandler from '../../utils/asyncErrorHandler';
const error_1 = __importDefault(require("../Helper/error"));
const createCategory = async (req, res, next) => {
    const categoryData = req.body;
    console.log(categoryData);
    // Check if the category already exists
    const existingCategory = await categoryModel_1.default.findOne({ name: categoryData.name });
    if (existingCategory) {
        return next(new error_1.default('Category already exists', 400));
    }
    // Create and save the new category
    const newCategory = new categoryModel_1.default(categoryData);
    await newCategory.save();
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        category: newCategory,
    });
};
exports.createCategory = createCategory;
const getAllCategory = async (_req, res, next) => {
    const categories = await categoryModel_1.default.find();
    if (!categories.length) {
        return next(new error_1.default('No categories found', 404));
    }
    res.status(200).json({
        success: true,
        categories,
    });
};
exports.getAllCategory = getAllCategory;
