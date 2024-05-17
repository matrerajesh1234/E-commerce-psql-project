import express from "express";
const router = express();
import * as productController from "../controller/product.controller.js";
import uploadMiddlware from "../middleware/multer.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { productSchemas } from '../validation/index.js'

router.post(
  "/createproduct",
  uploadMiddlware.array("imageUrl", 5),
  validationMiddleware(productSchemas.body.ValidCreateProduct, "body"),
  validationMiddleware(productSchemas.filesSchema),
  productController.createProduct
);
router.get(
  "/listproducts",
  validationMiddleware(productSchemas.query.ValidListRequest, "query"),
  productController.listAllProduct
);
router.get(
  "/editproduct/:id",
  validationMiddleware(productSchemas.params.ValidProductId, "params"),
  productController.editProduct
);
router.put(
  "/updateproduct/:id",
  validationMiddleware(productSchemas.body.ValidUpdateProduct, "body"),
  validationMiddleware(productSchemas.params.ValidProductId, "params"),
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  validationMiddleware(productSchemas.params.ValidProductId, "params"),
  productController.deleteProduct
);

export default router;
