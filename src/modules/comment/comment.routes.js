import { Router } from "express";
const router = Router();
import * as comment_controller from './comment.controller.js'

import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { addCommentSchema, updateCommentSchema } from "./comment.validation.js";



router.post('/add/:postId',auth(),validation(addCommentSchema),asyncHandler(comment_controller.addComment))
router.get('/',auth(),asyncHandler(comment_controller.getAllComments))
router.delete('/delete/:commentId',auth(),asyncHandler(comment_controller.deleteComment))
router.put('/:commentId',auth(),validation(updateCommentSchema),asyncHandler(comment_controller.updateComent))
router.post('/addreply', auth(),asyncHandler(comment_controller.addReply) )
router.post('/addreplyonreply', auth(),asyncHandler(comment_controller.addreplyonreply) )


export default router 