import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as category_controller from './category.controller.js'
import { auth } from "../../middleware/auth.js";
import { validation } from './../../middleware/validation.js';
import { creatCategorySchema } from "./category.validation.js";
import * as validators from './category.endPonts.js'
const router = Router();


router.post('/',auth(validators.endPoints.creat_cat),validation(creatCategorySchema),asyncHandler(category_controller.creatCategory))
router.get('/',auth(),asyncHandler(category_controller.getAllCategory))
router.delete('/:categoryId',auth(validators.endPoints.creat_cat),asyncHandler(category_controller.deleteCategory))







export default router 