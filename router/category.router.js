import express from "express";
const router = express.Router();
import * as categoryController from '../controller/category.controller.js'

router.post('/insertcategory',categoryController.createCategory);
router.get('/listcategory',categoryController.getAllCategory)
router.get('/editcategory/:id',categoryController.editCategory)
router.put('/updatecategory/:id',categoryController.updateCategory)
router.delete('/deletecategory/:id',categoryController.deleteCategory)

export default router;