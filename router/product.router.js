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

router.get("/listproducts", productController.listAllProduct);
router.get("/editproduct/:id", productController.editProduct);

router.put("/updateproduct/:id", productController.updateProduct);
router.delete("/deleteproduct/:id", productController.deleteProduct);

export default router;
