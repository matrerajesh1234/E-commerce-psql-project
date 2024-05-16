import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import * as categoryServices from "../services/category.services.js";
import { sendResponse } from "../utils/services.js";

export const createCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.categoryName;
    if (!categoryName) {
      throw new BadRequestError("Please provide a category name");
    }
    const uniqueCategory = await categoryServices.categoryFindOne({
      categoryName: categoryName,
    });

    if (uniqueCategory) {
      throw new NotFoundError("Category already exists");
    }

    const newCategory = await categoryServices.createCategory(categoryName);
    if (!newCategory) {
      throw new BadRequestError(
        "Falied to create a category. Please try again later"
      );
    }
    return sendResponse(res, 200, "categoryCreated", newCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const categoryList = await categoryServices.getAllCategory();

    return sendResponse(res, 200, "Category list", categoryList);
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const singleCategory = await categoryServices.categoryFindOne(
      {
        id: req.params.id,
      },
      "and"
    );
    if (!singleCategory || singleCategory.length == 0) {
      throw new NotFoundError("Category not found");
    }

    return sendResponse(res, 200, "Category Detail", singleCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const checkCategory = await categoryServices.categoryFindOne({
      id: req.params.id,
    });

    const updatedCategory = await categoryServices.updateCategory(
      { id: req.params.id },
      "and",
      req.body
    );
    if (updatedCategory.rowCount == 0) {
      throw new BadRequestError("Category not found or could not be updated");
    }

    return sendResponse(res, 200, "Category updated");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const checkCategory = await categoryServices.categoryFindOne({
      id: req.params.id,
    });
    if (!checkCategory || checkCategory.length == 0) {
      throw new NotFoundError("Category not found");
    }

    const deletedCategory = await categoryServices.deleteCategory(
      { id: req.params.id },
      "and"
    );
    if (deletedCategory.rowCount == 0) {
      throw new BadRequestError("Category not found or could not be deleted");
    }

    return sendResponse(res, 200, "Delete category successfully");
  } catch (error) {
    next(error);
  }
};
