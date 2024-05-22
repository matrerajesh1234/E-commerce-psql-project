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

    if (!newProduct) {
      throw new BadRequestError("Product Not Found");
    }

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

    if (paginatedData.list.length == 0) {
      throw new NotFoundError("Product Not Found");
    }
    return sendResponse(res, 200, "Product list", paginatedData);
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const [editProduct] = await productServices.getProducts({
      id: req.params.id,
    });
    console.log(editProduct);
    if (!editProduct) {
      throw new NotFoundError("Product not found.");
    }

    return sendResponse(res, 200, "Product detail", editProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const [checkProduct] = await productServices.getProducts({
      id: req.params.id,
    });
    if (!checkProduct) {
      throw new NotFoundError("Product not found.");
    }

    const updatedProduct = await productServices.updateProduct(
      { id: req.params.id },
      req.body
    );

    if (req.files && req.files.length > 0) {
      await productServices.updateImage(req.files, req.params.id);
    } else {
      throw new BadRequestError("Image is required");
    }

    if (req.body.categoryId) {
      await productServices.updateProductRelation(req.body, req.params.id);
    } else {
      throw new BadRequestError("Category is required");
    }
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
