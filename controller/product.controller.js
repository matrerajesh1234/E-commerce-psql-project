import pool from "../config/database.js";
import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import * as productServices from "../services/product.services.js";
import {
  paginationAndSorting,
  sendResponse,
  paginatedResponse,
} from "../utils/services.js";
import { search } from "../utils/services.js";

export const createProduct = async (req, res, next) => {
  try {
    const { productName, productDetails, price, color } = req.body;

    if (!productName || !productDetails || !price || !color) {
      throw new BadRequestError("Please provide require field");
    }

    const { description, rating, reviews, brand } = req.body;

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

    const imageString = req.files
      .map((file, index) => {
        return `($${index * 2 + 1},$${index * 2 + 2})`;
      })
      .join(", ");

    const imageParams = req.files
      .map((file) => {
        return [newProduct[0].id, file.path];
      })
      .flat();

    const imageQueryString = `insert into imageProducts("productId","imageUrl") values ${imageString}`;
    const imageProduct = await pool.query(imageQueryString, imageParams);

    if (!imageProduct) {
      throw new BadRequestError("Failed to store image please try again later");
    }

    const productCategoryId = Array.isArray(req.body.categoryId)
      ? req.body.categoryId
      : [req.body.categoryId];

    const categoryValues = productCategoryId
      .map((categoryid, index) => {
        return `($${index * 2 + 1},$${index * 2 + 2})`;
      })
      .join(", ");

    const categoryParams = productCategoryId
      .map((categoryid) => {
        return [newProduct[0].id, categoryid];
      })
      .flat();

    const productCategoryString = `insert into productcategoryrelation("productId","categoryId") values ${categoryValues}`;

    const productCategoryQuery = await pool.query(
      productCategoryString,
      categoryParams
    );

    if (!productCategoryQuery) {
      throw new BadRequestError("Failed to store the productCategoy");
    }

    return sendResponse(res, 200, "Product Created Successfully", newProduct);
  } catch (error) {
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
      throw new NotFoundError("Product Not Found");
    }

    if (productResult.length === 0) {
      return sendResponse(res, 200, "Product Not Found");
    }

    const paginatedData = paginatedResponse(
      productResult,
      pagination.pageCount,
      pagination.limitCount,
      totalResultCount
    );

    return sendResponse(res, 200, "Product List", paginatedData);
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
    const checkProduct = await productServices.productFindOne(
      { id: req.params.id },
      "and"
    );
    if (!checkProduct || checkProduct.length == 0) {
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
