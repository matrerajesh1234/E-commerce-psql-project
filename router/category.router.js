import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import * as validation from "../validation/categorySchemas.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

router.post(
  "/insertcategory",
  validation.validateCategory,
  validateRequest(),
  categoryController.createCategory
);

router.get("/listcategory", categoryController.getAllCategories);
router.get(
  "/editcategory/:id",
  validation.validateCategoryId,
  validateRequest(),
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  validation.validateUpdateCategory,
  validateRequest(),
  categoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  validation.validateCategoryId,
  validateRequest(),
  categoryController.deleteCategory
);

export default router;
