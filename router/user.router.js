import express from "express";
const router = express.Router();
import { userController } from "../controller/index.js";
import { authentication } from "../Middleware/user.auth.js";
import { userSchemas } from "../validation/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

router.post(
  "/insertuser",
  userSchemas.validateUserCreation,
  validateRequest(),
  userController.registerUser
);

router.get("/listuser", authentication, userController.getAllUser);

router.put(
  "/update/:id",
  userSchemas.validateUpdateUser,
  validateRequest(),
  authentication,
  userController.updateUser
);

router.post(
  "/login",
  userSchemas.validationUserLogin,
  validateRequest(),
  userController.loginUser
);

router.get(
  "/edituser/:id",
  userSchemas.validateUserId,
  validateRequest(),
  authentication,
  userController.editUser
);

router.delete(
  "/delete/:id",
  userSchemas.validateUserId,
  validateRequest(),
  authentication,
  userController.deleteUser
);

export default router;
