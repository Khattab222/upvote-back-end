import { Router } from "express";
const router = Router();
import * as auth_controller from './auth.controller.js'
import { asyncHandler } from './../../utils/errorHandling.js';
import { validation } from "../../middleware/validation.js";
import * as validationSchema from '../Auth/auth.validation.js'
import { auth } from './../../middleware/auth.js';

router.post('/signup', validation(validationSchema.signupSchema),asyncHandler(auth_controller.signup));
router.get('/confirmLink/:token',asyncHandler(auth_controller.confirmEmail))
router.post('/login',validation(validationSchema.loginSchema),asyncHandler(auth_controller.login))
router.post('/logout',auth(),asyncHandler(auth_controller.logOut))
router.post('/forgetpass', asyncHandler(auth_controller.forgetPass))
router.post('/reset-password/:token', validation(validationSchema.resetpassSchema),asyncHandler(auth_controller.resetPass))


export default router 