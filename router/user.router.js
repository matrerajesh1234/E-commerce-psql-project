import express from "express";
const router = express.Router();
import { userController } from "../controller/index.js";
import { userSchemas } from "../validation/index.js";
import { authentication } from "../middleware/user.auth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { Role } from "../constant/enum.js";

router.post(
  "/insertuser",
  userSchemas.validateUserCreation,
  validateRequest(),
  userController.registerUser
);

router.get(
  "/listuser",
  authentication([Role.admin, Role.user]),
  userController.getAllUser
);

router.put(
  "/update/:id",
  userSchemas.validateUpdateUser,
  validateRequest(),
  authentication(Role.admin),
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
  authentication([Role.admin]),
  userSchemas.validateUserId,
  validateRequest(),
  userController.editUser
);

router.delete(
  "/delete/:id",
  userSchemas.validateUserId,
  validateRequest(),
  authentication([Role.admin]),
  userController.deleteUser
);

export default router;
