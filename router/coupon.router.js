import express from "express";
import { couponController } from "../controller/index.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { couponSchemas } from "../validation/index.js";

const router = express.Router();

router.post(
  "/add",
  validateRequest(couponSchemas.validateCreateCoupon),
  couponController.createCoupon
);
router.get("/checkout", couponController.listCoupon);
router.get('/:id',couponController.editCoupon)
router.put("/update/:id", couponController.updateCoupon);

export default router;
