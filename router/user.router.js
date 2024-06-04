import express from "express";
const router = express.Router();
import { userController } from "../controller/index.js";
import { userSchemas } from "../validation/index.js";
import { authentication } from "../middleware/user.auth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { Role } from "../constant/enum.js";

router.post(
  "/insertuser",
  validateRequest(userSchemas.validateUserCreation),
  userController.registerUser
);

router.get(
  "/listuser",
  authentication([Role.admin, Role.user]),
  userController.getAllUser
);

router.put(
  "/update/:id",
  validateRequest(userSchemas.validateUpdateUser),
  authentication([Role.admin]),
  userController.updateUser
);

router.post(
  "/login",
  validateRequest(userSchemas.validationUserLogin),
  userController.loginUser
);

router.get(
  "/edituser/:id",
  authentication([Role.admin]),
  validateRequest(userSchemas.validateUserId),
  userController.editUser
);

router.delete(
  "/delete/:id",
  validateRequest(userSchemas.validateUserId),
  authentication([Role.admin]),
  userController.deleteUser
);

export default router;
