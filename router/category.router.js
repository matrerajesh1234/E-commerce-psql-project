import express from "express";
const router = express.Router();
import { categoryController } from "../controller/index.js";
import { categorySchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authentication } from "../Middleware/user.auth.js";

router.post(
  "/insertcategory",
  categorySchemas.validateCategory,
  validateRequest(),
  authentication,
  categoryController.createCategory
);

router.get("/listcategory", categoryController.getAllCategories);
router.get(
  "/editcategory/:id",
  categorySchemas.validateCategoryId,
  validateRequest(),
  authentication,
  categoryController.editCategory
);
router.put(
  "/updatecategory/:id",
  categorySchemas.validateUpdateCategory,
  validateRequest(),
  authentication,
  categoryController.updateCategory
);

router.delete(
  "/deletecategory/:id",
  categorySchemas.validateCategoryId,
  validateRequest(),
  authentication,
  categoryController.deleteCategory
);

export default router;
