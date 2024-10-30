import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../Models/categoryModel';
// import asyncErrorHandler from '../../utils/asyncErrorHandler';
import CustomError from '../Helper/error';


export const createCategory = 
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryData: Partial<ICategory> = req.body;
    console.log(categoryData)

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      return next(new CustomError('Category already exists', 400));
    }

    // Create and save the new category
    const newCategory = new Category(categoryData);
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
  }



  export const getAllCategory = 
  async (_req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    if (!categories.length) {
      return next(new CustomError('No categories found', 404));
    }

    res.status(200).json({
      success: true,
      categories,
    });
  };


