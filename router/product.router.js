import express from "express";
const router = express.Router();
import { productController } from "../controller/index.js";
import { productSchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authentication } from "../middleware/user.auth.js";
import { Role } from "../constant/enum.js";

router.post(
  "/createproduct",
  authentication([Role.admin]),
  productSchemas.validateProductCreation,
  validateRequest(),
  productController.createProduct
);

router.get(
  "/listproducts",
  authentication([Role.admin, Role.user]),
  productSchemas.validateQueryParams,
  validateRequest(),
  productController.listAllProduct
);

router.get(
  "/editproduct/:id",
  authentication([Role.admin]),
  productSchemas.validateProductId,
  validateRequest(),
  productController.editProduct
);

router.put(
  "/updateproduct/:id",
  authentication([Role.admin]),
  productSchemas.validateUpdateProduct,
  validateRequest(),
  productController.updateProduct
);

router.delete(
  "/deleteproduct/:id",
  authentication([Role.admin]),
  productSchemas.validateProductId,
  validateRequest(),
  productController.deleteProduct
);

export default router;
