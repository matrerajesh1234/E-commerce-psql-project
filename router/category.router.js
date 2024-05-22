import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { categorySchemas } from "../validation//index.js";
router.post(
  "/insertcategory",
  validationMiddleware({ body: categorySchemas.body }),
  categoryController.createCategory
);

router.get("/listcategory", categoryController.getAllCategories);
router.get(
  "/editcategory/:id",
  validationMiddleware({ params: categorySchemas.params }), // Param validation
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  validationMiddleware({
    body: categorySchemas.body,
    params: categorySchemas.params,
  }),
  categoryController.updateCategory
);
router.delete(
  "/deletecategory/:id",
  validationMiddleware({ params: categorySchemas.params }), // Params validation
  categoryController.deleteCategory
);

export default router;
