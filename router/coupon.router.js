import express from "express";
import { couponController } from "../controller/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { couponSchemas } from "../validation/index.js";
import { authentication } from "../middleware/user.auth.js";
import { Role } from "../constant/enum.js";
const router = express.Router();

router.post(
  "/add",
  validateRequest(couponSchemas.validateCoupon),
  authentication([Role.admin]),
  couponController.createCoupon
);
router.get(
  "/checkout",
  authentication([Role.admin, Role.user]),
  couponController.listCoupon
);
router.get("/edit/:id", couponController.editCoupon);
router.put(
  "/update/:id",
  validateRequest(couponSchemas.validateCoupon),
  authentication([Role.admin, Role.user]),
  couponController.updateCoupon
);
router.delete(
  "/delete/:id",
  authentication([Role.admin, Role.user]),
  couponController.deleteCoupon
);
// router.get(
//   "/apply",
//   authentication([Role.admin, Role.user]),
//   couponController.applyCoupon
// );

export default router;
