import express from "express";
const router = express();
import { productController } from "../controller/index.js";
import uploadMiddlware from "../middleware/multer.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { productSchemas } from "../validation/index.js";

router.post(
  "/createproduct",
  uploadMiddlware.array("imageUrl", 5),
  validationMiddleware({ body: productSchemas.body }),
  productController.createProduct
);

router.get(
  "/listproducts",
  validationMiddleware({ query: productSchemas.query }),
  productController.listAllProduct
);
router.get(
  "/editproduct/:id",
  validationMiddleware({ params: productSchemas.params }),
  productController.editProduct
);

router.put(
  "/updateproduct/:id",
  uploadMiddlware.array("imageUrl", 5),
  validationMiddleware({
    body: productSchemas.body,
    params: productSchemas.params,
  }),
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  validationMiddleware({ params: productSchemas.params }),
  productController.deleteProduct
);

export default router;
