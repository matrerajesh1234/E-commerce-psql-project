import express from "express";
import { cartController } from "../controller/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { cartSchemas } from "../validation/index.js";
const router = express.Router();
import { authentication } from "../middleware/user.auth.js";
import { Role } from "../constant/enum.js";

router.post(
  "/add",
  authentication([Role.admin, Role.user]),
  validateRequest(cartSchemas.validateAddToCart),
  cartController.addToCart
);
router.get(
  "/checkout",
  authentication([Role.admin, Role.user]),
  cartController.cartList
);

router.delete(
  "/editcart/:id",
  authentication([Role.admin, Role.user]),
  validateRequest(cartSchemas.validateCartId),
  cartController.editCart
);

router.delete(
  "/clear-cart",
  authentication([Role.admin, Role.user]),
  cartController.clearCart
);

export default router;
