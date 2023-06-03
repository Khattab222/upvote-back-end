import { Router } from 'express';
import * as user_controller from './user.controller.js'
import { auth } from './../../middleware/auth.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import { multerFunctionCoudinary } from './../../services/multer.js';
import { endPoints } from './user.endpoints.js';
const router = Router()


router.get('/profile/:id', auth(),asyncHandler(user_controller.getUserProfile))
router.post('/profile',auth(),multerFunctionCoudinary().single('pic'),asyncHandler(user_controller.userprofile))
router.post('/covers',auth(),multerFunctionCoudinary().array('pic',2),asyncHandler(user_controller.cover))
router.patch('/updatepass',auth(),asyncHandler(user_controller.updatepass))
router.patch('/updateprofile',auth(),asyncHandler(user_controller.updatUserProfile))
router.get('/',auth(endPoints.GET_ALL_USER),asyncHandler(user_controller.getAllUsers))
router.delete('/:id',auth(endPoints.GET_ALL_USER),asyncHandler(user_controller.deleteUser))
export default router;

