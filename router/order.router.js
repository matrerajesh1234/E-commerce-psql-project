import express from "express";
import { orderController } from "../controller/index.js";
const router = express.Router();
import { Role } from "../constant/enum.js";

import { authentication } from "../middleware/user.auth.js";

router.post("/add", authentication([Role.admin,Role.user]), orderController.orderPlace);
router.get('/list',authentication([Role.admin,Role.user]),orderController.getOrderList);


export default router;
