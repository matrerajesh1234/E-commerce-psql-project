import express from "express";
const router = express.Router();

import categoryRouter from "./category.router.js";
import productRouter from './product.router.js'

router.use("/category", categoryRouter);
router.use("/product",productRouter)

export default router;
