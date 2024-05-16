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
      throw new BadRequestError("Please Enter the CategoryName");
    }
    const uniqueCategory = await categoryServices.categoryFindOne({
      categoryName: categoryName,
    });

    if (uniqueCategory) {
      return sendResponse(res, 400, "User Already Exists");
    }

    const newCategory = await categoryServices.createCategory(categoryName);
    if (!newCategory) {
      return res
        .status(400)
        .json({ sucess: true, message: "Falied to create a category" });
    }
    res
      .status(200)
      .json({ success: true, message: "categorycratde", newCategory });

    return sendResponse(res, 200, "categoryCreated", newCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const categoryList = await categoryServices.getAllCategory();
    if (!categoryList) {
      throw new BadRequestError("Empty Category List");
    }
    return sendResponse(res, 200, "Category List", categoryList);
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
      throw new NotFoundError("Category Not Found");
    }

    return sendResponse(res, 200, "Category Detail", singleCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const checkCategoryId = await categoryServices.categoryFindOne({
      id: req.params.id,
    });
    if (!checkCategoryId || checkCategoryId.length == 0) {
      throw new NotFoundError("Category Not Found");
    }

    const updatedCategory = await categoryServices.updateCategory(
      { id: req.params.id },
      "and",
      req.body
    );
    if (updatedCategory.rowCount == 0) {
      throw new BadRequestError("Category Not Updated Something went Wrong");
    }

    return sendResponse(res, 200, "Category Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const checkCategoryId = await categoryServices.categoryFindOne({
      id: req.params.id,
    });
    if (!checkCategoryId || checkCategoryId.length == 0) {
      throw new NotFoundError("Category Not Found");
    }

    const deletedCategory = await categoryServices.deleteCategory(
      { id: req.params.id },
      "and"
    );
    if (deletedCategory.rowCount == 0) {
      throw new BadRequestError("Category Not Updated Something went Wrong");
    }

    return sendResponse(res, 200, "Successfully Deleted");
  } catch (error) {
    next(error);
  }
};
