import express from "express";
const router = express.Router();
import * as categoryController from "../controller/category.controller.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { categorySchemas } from "../validation//index.js";

router.post(
  "/insertcategory",
  validationMiddleware(categorySchemas.body.ValidCreateCategory, "body"),
  categoryController.createCategory
);
router.get("/listcategory", categoryController.getAllCategory);
router.get(
  "/editcategory/:id",
  validationMiddleware(categorySchemas.params.ValidCategoryId),
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  validationMiddleware(categorySchemas.params.ValidCategoryId, "params"),
  validationMiddleware(categorySchemas.body.ValidUpdateCategory, "body"),
  categoryController.updateCategory
);
router.delete(
  "/deletecategory/:id",
  validationMiddleware(categorySchemas.params.ValidCategoryId),
  categoryController.deleteCategory
);

export default router;
