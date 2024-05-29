import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";

import { productServices } from "../services/index.js";
import {
  paginationAndSorting,
  sendResponse,
  paginatedResponse,
  search,
  beginTransition,
  commitTransition,
  rollBackTransition,
  uploadImages,
} from "../utils/services.js";
import fs from "fs";

export const createProduct = async (req, res, next) => {
  try {
    await beginTransition();

    const [existingProduct] = await productServices.getProducts({
      productName: req.body.productName,
    });

    if (existingProduct) {
      throw new BadRequestError("Product already exists.");
    }

    if (!req.files || !req.files.imageUrl) {
      throw new BadRequestError("Image is required");
    }

    const newProduct = await productServices.createNewProduct(req.body);

    if (!newProduct) {
      throw new BadRequestError("Product Not Found");
    }

    if (req.files && req.files.imageUrl) {
      const uploadFilePath = uploadImages(req.files, newProduct[0].id);
      const productImage = await productServices.uploadImage(
        uploadFilePath,
        newProduct[0].id
      );
    } else {
      throw new BadRequestError("Image is required");
    }

    if (req.body.categoryId) {
      const checkCategory = Array.isArray(req.body.categoryId)
        ? req.body.categoryId
        : [req.body.categoryId];

      const foundCategory = await productServices.getProductCategory(
        req.body.categoryId
      );

      if (foundCategory.length !== checkCategory.length) {
        throw new NotFoundError("Some category IDs are not found");
      }

      if (!foundCategory) {
        throw new NotFoundError("Category not found");
      }

      const productCategoryRelation = await productServices.productRelation(
        req.body,
        newProduct[0].id
      );
    } else {
      throw new BadRequestError("Category is required");
    }

    await commitTransition();

    sendResponse(res, 200, "Product created successfully", newProduct);
    next();
  } catch (error) {
    await rollBackTransition();
    next(error);
  }
};

export const listAllProduct = async (req, res, next) => {
  try {
    const pagination = paginationAndSorting(req.query);
    const searchField = ["productName", "description", "color", "categoryName"];
    const searchQuery = search(req.query.search, searchField);
    const totalResultCount = await productServices.filterPagination(
      searchQuery
    );
    const productResult = await productServices.paginateFilteredResults(
      pagination,
      searchQuery
    );
    if (!productResult) {
      throw new NotFoundError("Product not found.");
    }

    const paginatedData = paginatedResponse(
      productResult,
      pagination.pageCount,
      pagination.limitCount,
      totalResultCount
    );

    return sendResponse(
      res,
      200,
      "Product listing successfully",
      paginatedData
    );
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const [editProduct] = await productServices.getProducts({
      id: req.params.id,
    });
    if (!editProduct) {
      throw new NotFoundError("Product not found.");
    }

    return sendResponse(res, 200, "Found product detail", editProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    await beginTransition();
    const [checkProduct] = await productServices.getProducts({
      id: req.params.id,
    });
    if (!checkProduct) {
      throw new NotFoundError("Product not found.");
    }

    if (!req.files || !req.files.imageUrl) {
      throw new BadRequestError("Image is required");
    }

    const deletedImages = await productServices.productImages(checkProduct.id);
    for (let image of deletedImages) {
      const imagePath = image.imageUrl;
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        throw new BadRequestError("Error deleting file ");
      }
    }

    const updatedProduct = await productServices.updateProduct(
      { id: req.params.id },
      req.body
    );

    if (req.files && req.files.imageUrl) {
      const uploadFilePaths = uploadImages(req.files, req.params.id);
      await productServices.updateImage(uploadFilePaths, req.params.id);
    } else {
      throw new BadRequestError("Image is required");
    }

    if (req.body.categoryId) {
      const checkCategory = Array.isArray(req.body.categoryId)
        ? req.body.categoryId
        : [req.body.categoryId];

      const foundCategory = await productServices.getProductCategory(
        req.body.categoryId
      );

      if (foundCategory.length !== checkCategory.length) {
        throw new NotFoundError("Category not found");
      }

      if (!foundCategory) {
        throw new NotFoundError("Category not found");
      }

      await productServices.updateProductRelation(req.body, req.params.id);
    } else {
      throw new BadRequestError("Category is required");
    }

    await commitTransition();

    return sendResponse(res, 200, "Product updated successfully");
  } catch (error) {
    await rollBackTransition();
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const [checkProduct] = await productServices.getProducts(
      { id: req.params.id },
      "and"
    );
    if (!checkProduct) {
      throw new NotFoundError("Product not found.");
    }

    const deletedImages = await productServices.productImages(checkProduct.id);

    for (let image of deletedImages) {
      const imagePath = image.imageUrl;
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        throw new BadRequestError("Error deleting file");
      }
    }

    const deletedProduct = await productServices.deleteProduct(
      { id: req.params.id },
      "and"
    );

    return sendResponse(res, 200, "Product successfully deleted");
  } catch (error) {
    next(error);
  }
};
