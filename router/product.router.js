import express from "express";
const router = express();
import { productController } from "../controller/index.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { productSchemas } from "../validation/index.js";

router.post(
  "/createproduct",
  validationMiddleware({
    body: productSchemas.body,
    // files: productSchemas.filesSchema
  }),
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
  validationMiddleware({
    body: productSchemas.body,
    params: productSchemas.params,
    //  files: productSchemas.filesSchema,
  }),
  productController.updateProduct
);
router.delete(
  "/deleteproduct/:id",
  validationMiddleware({ params: productSchemas.params }),
  productController.deleteProduct
);

export default router;
