import express from "express";
const router = express();
import * as productController from "../controller/product.controller.js";

router.post("/createproduct", productController.createProduct);
router.get("/listproducts", productController.listAllProduct);
router.get("/editproduct/:id", productController.editProduct);
router.put("/updateproduct/:id", productController.updateProduct);
router.delete("/deleteproduct/:id", productController.deleteProduct);

export default router;
