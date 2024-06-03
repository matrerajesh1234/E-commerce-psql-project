import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import { categorySchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authentication } from "../Middleware/user.auth.js";

router.post(
  "/insertcategory",
  authentication,
  categorySchemas.validateCategory,
  validateRequest(),
  categoryController.createCategory
);

router.get("/listcategory", categoryController.getAllCategories);
router.get(
  "/editcategory/:id",
  authentication,
  categorySchemas.validateCategoryId,
  validateRequest(),
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  authentication,
  categorySchemas.validateUpdateCategory,
  validateRequest(),
  categoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  authentication,
  categorySchemas.validateCategoryId,
  validateRequest(),
  categoryController.deleteCategory
);

export default router;
