import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import * as categoryServices from "../services/category.services.js";
import { sendResponse } from "../utils/services.js";

export const createCategory = async (req, res, next) => {
  try {
    const [checkUniqueCategory] = await categoryServices.categoryFindOne({
      categoryName: req.body.categoryName,
    });
    if (checkUniqueCategory) {
      throw new NotFoundError("Category already exists");
    }

    const newCategory = await categoryServices.createCategory(
      req.body.categoryName
    );

    return sendResponse(res, 200, "Category created successfully", newCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryServices.getCategories();

    return sendResponse(
      res,
      200,
      "Category list retrieved successfully",
      categories
    );
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const [foundCategory] = await categoryServices.getCategories(
      { id: req.params.id },
      "and"
    );
    console.log(foundCategory);

    if (!foundCategory) {
      throw new NotFoundError("Category not found");
    }

    return sendResponse(
      res,
      200,
      "Category details retrieved successfully",
      foundCategory
    );
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const [existingCategory] = await categoryServices.getCategories({
      id: req.params.id,
    });
    if (!existingCategory) {
      throw new BadRequestError("Category not found");
    }

    const updatedCategory = await categoryServices.updateCategory(
      { id: req.params.id },
      req.body,
      "and"
    );

    return sendResponse(res, 200, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const [existingCategory] = await categoryServices.getCategories({
      id: req.params.id,
    });

    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    const deletedCategory = await categoryServices.deleteCategory(
      { id: req.params.id },
      "and"
    );

    return sendResponse(res, 200, "Delete category successfully");
  } catch (error) {
    next(error);
  }
};
