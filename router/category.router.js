import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { categorySchemas } from "../validation//index.js";

router.post(
  "/insertcategory",
  validationMiddleware(categorySchemas.body.validCategoryName, "body"),
  categoryController.createCategory
);
router.get("/listcategory", categoryController.getAllCategories);
router.get(
  "/editcategory/:id",
  validationMiddleware(categorySchemas.params.validCategoryId),
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  validationMiddleware(categorySchemas.params.validCategoryId, "params"),
  validationMiddleware(categorySchemas.body.validCategoryName, "body"),
  categoryController.updateCategory
);
router.delete(
  "/deletecategory/:id",
  validationMiddleware(categorySchemas.params.validCategoryId),
  categoryController.deleteCategory
);

export default router;
