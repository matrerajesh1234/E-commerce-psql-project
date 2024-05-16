import pool from "../config/database.js";
import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import * as productServices from "../services/product.services.js";
import { sendResponse } from "../utils/services.js";

export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productDetails,
      description,
      price,
      color,
      rating,
      reviews,
      brand,
    } = req.body;

    const checkProductExits = await productServices.productFindOne({
      productName: productName,
    });

    if (checkProductExits) {
      throw new BadRequestError("Product Already Exists");
    }

    const newProduct = await productServices.createNewProduct(
      productName,
      productDetails,
      description,
      price,
      color,
      rating,
      reviews,
      brand
    );

    if (!newProduct) {
      throw new BadRequestError("Product Creation Failed");
    }
  } catch (error) {
    next(error);
  }
};

export const listAllProduct = async (req, res, next) => {
  try {
    const listUser = await productServices.productList();
    if (!listUser) {
      throw new BadRequestError("Product Not Found");
    }
    return sendResponse(res, 200, "Product List", listUser);
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const singleProduct = await productServices.productFindOne({
      id: req.params.id,
    });
    if (!singleProduct || singleProduct.length == 0) {
      throw new NotFoundError("Product Not Found");
    }

    return sendResponse(res, 200, "Product Detail", singleProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const checkProductId = await productServices.productFindOne(
      { id: req.params.id },
      "and"
    );
    if (!checkProductId || checkProductId.length == 0) {
      throw new NotFoundError("Product Not Found");
    }

    const updatedProduct = await productServices.updateProduct(
      { id: req.params.id },
      "and",
      req.body
    );
    if (updatedProduct.rowCount == 0) {
      throw new BadRequestError("Product Not Updated Something went Wrong");
    }

    return sendResponse(res, 200, "Product Updated Successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const checkProductId = await productServices.productFindOne(
      { id: req.params.id },
      "and"
    );
    if (!checkProductId || checkProductId.length == 0) {
      throw new NotFoundError("Product Not Found");
    }

    const deletedProduct = await productServices.deleteProduct(
      { id: req.params.id },
      "and"
    );
    if (deletedProduct.rowCount == 0) {
      throw new BadRequestError("Product Not Deleted Something went Wrong");
    }

    return sendResponse(res, 200, "Product Successfully Deleted");
  } catch (error) {
    next(error);
  }
};
