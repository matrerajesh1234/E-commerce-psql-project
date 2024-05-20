import express from "express";
const router = express();
import { productController } from "../controller/index.js";
import uploadMiddlware from "../middleware/multer.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { productSchemas } from "../validation/index.js";

router.post(
  "/createproduct",
  uploadMiddlware.array("imageUrl", 5),
  validationMiddleware(productSchemas.body.validProduct, "body"),
  validationMiddleware(productSchemas.filesSchema),
  productController.createProduct
);

router.get(
  "/listproducts",
  validationMiddleware(productSchemas.query.validListRequest, "query"),
  productController.listAllProduct
);
router.get(
  "/editproduct/:id",
  validationMiddleware(productSchemas.params.validProductId, "params"),
  productController.editProduct
);
router.put(
  "/updateproduct/:id",
  validationMiddleware(productSchemas.body.validProduct, "body"),
  validationMiddleware(productSchemas.params.validProductId, "params"),
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  validationMiddleware(productSchemas.params.validProductId, "params"),
  productController.deleteProduct
);

export default router;
