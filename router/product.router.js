import express from "express";
const router = express();
import { productController } from "../controller/index.js";
import { productSchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authentication } from "../Middleware/user.auth.js";

router.post(
  "/createproduct",
  productSchemas.validateCategoryCreation,
  validateRequest(),
  authentication,
  productController.createProduct
);

router.get(
  "/listproducts",
  productSchemas.validateQueryParams,
  validateRequest(),
  authentication,
  productController.listAllProduct
);
router.get(
  "/editproduct/:id",
  productSchemas.validateProductId,
  validateRequest(),
  authentication,
  productController.editProduct
);

router.put(
  "/updateproduct/:id",
  productSchemas.validateUpdateProduct,
  validateRequest(),
  authentication,
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  productSchemas.validateProductId,
  validateRequest(),
  authentication,
  productController.deleteProduct
);

export default router;
