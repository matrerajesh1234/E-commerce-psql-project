import express from "express";
import { couponController } from "../controller/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { couponSchemas } from "../validation/index.js";
import { authentication } from "../middleware/user.auth.js";
import { Role } from "../constant/enum.js";
const router = express.Router();

router.post(
  "/add",
  validateRequest(couponSchemas.validateCreateCoupon),
  couponController.createCoupon
);
router.get("/checkout", couponController.listCoupon);
router.get("/edit/:id", couponController.editCoupon);
router.put("/update/:id", couponController.updateCoupon);
router.delete("/delete/:id", couponController.deleteCoupon);
router.get(
  "/apply",
  authentication([Role.admin]),
  couponController.applyCoupon
);

export default router;
