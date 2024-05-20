import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import * as productServices from "../services/product.services.js";
import {
  paginationAndSorting,
  sendResponse,
  paginatedResponse,
  search,
} from "../utils/services.js";

export const createProduct = async (req, res, next) => {
  try {
    const [existingProduct] = await productServices.getProducts({
      productName: req.body.productName,
    });

    if (existingProduct) {
      throw new BadRequestError("Product already exists.");
    }

    const newProduct = await productServices.createNewProduct(req.body);

    const productImage = await productServices.uploadImage(
      req.files,
      newProduct[0].id
    );

    const productCategoryRelation = await productServices.productRelation(
      req.body,
      newProduct[0].id
    );

    return sendResponse(res, 200, "Product created successfully", newProduct);
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
      throw new NotFoundError("Product not found.");
    }

    const paginatedData = paginatedResponse(
      productResult,
      pagination.pageCount,
      pagination.limitCount,
      totalResultCount
    );

    return sendResponse(res, 200, "Product list", paginatedData);
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const [singleProduct] = await productServices.getProducts({
      id: req.params.id,
    });
    if (!singleProduct) {
      throw new NotFoundError("Product not found.");
    }

    return sendResponse(res, 200, "Product detail", singleProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const [checkProduct] = await productServices.getProducts(
      { id: req.params.id },
      "and"
    );
    if (!checkProduct) {
      throw new NotFoundError("Product not found.");
    }

    const updatedProduct = await productServices.updateProduct(
      { id: req.params.id },
      req.body,
      "and"
    );

    return sendResponse(res, 200, "Product updated successfully");
  } catch (error) {
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

    const deletedProduct = await productServices.deleteProduct(
      { id: req.params.id },
      "and"
    );

    return sendResponse(res, 200, "Product successfully deleted");
  } catch (error) {
    next(error);
  }
};
