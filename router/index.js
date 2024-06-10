import express from "express";
const router = express.Router();

import categoryRouter from "./category.router.js";
import productRouter from "./product.router.js";
import userRouter from "./user.router.js";
import cartRouter from "./cart.router.js";
import couponRouter from './coupon.router.js'

router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use('/coupon',couponRouter)

export default router;
