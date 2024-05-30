import express from "express";
const router = express();
import { productController } from "../controller/index.js";

import * as validation from "../validation/productSchemas.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

router.post(
  "/createproduct",
  validation.validateCategoryCreation,
  validateRequest(),
  productController.createProduct
);

router.get(
  "/listproducts",
  validation.validateQueryParams,
  validateRequest(),
  productController.listAllProduct
);
router.get(
  "/editproduct/:id",
  validation.validateProductId,
  validateRequest(),
  productController.editProduct
);

router.put(
  "/updateproduct/:id",
  validation.validateUpdateProduct,
  validateRequest(),
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  validation.validateProductId,
  validateRequest(),
  productController.deleteProduct
);

export default router;
