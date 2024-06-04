import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import { categorySchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authentication } from "../middleware/user.auth.js";
import { Role } from "../constant/enum.js";

router.post(
  "/insertcategory",
  authentication([Role.admin]),
  validateRequest(categorySchemas.validateCategory),
  categoryController.createCategory
);

router.get(
  "/listcategory",
  authentication([Role.admin, Role.user]),
  categoryController.getAllCategories
);
router.get(
  "/editcategory/:id",
  authentication([Role.admin]),
  validateRequest(categorySchemas.validateCategoryId),
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  authentication([Role.admin]),
  validateRequest(categorySchemas.validateUpdateCategory),
  categoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  authentication([Role.admin]),
  validateRequest(categorySchemas.validateCategoryId),
  categoryController.deleteCategory
);

export default router;
