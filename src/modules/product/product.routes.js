import { Router } from "express";
const router = Router();
import * as prod_controller from './product.controller.js'

import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from './../../middleware/auth.js';
import { multerFunctionCoudinary, validationObject } from "../../services/multer.js";
import { endPoints } from "./product.endPonts.js";
import { addProductSchema } from "./product.validation.js";


router.post('/add',auth(),multerFunctionCoudinary({filevalidation:validationObject.image}).single('pic'),validation(addProductSchema),asyncHandler(prod_controller.addProduct) );
router.get('/',asyncHandler(prod_controller.getAllProducts));
router.get('/allposts',asyncHandler(prod_controller.getAllProductsForAdmin));
router.get('/:id',auth(),asyncHandler(prod_controller.getsingleproduct));
router.patch('/like/:productId',auth(),asyncHandler(prod_controller.likeProduct));
router.post('/:id',auth(),multerFunctionCoudinary({filevalidation:validationObject.image}).single('pic'),asyncHandler(prod_controller.updateprod) );

router.delete('/delete/:prodId',auth(endPoints.SOFT_DELETE),asyncHandler(prod_controller.softDeleteProduct))





export default router 