


import joi from "joi";




export const addCommentSchema = {
    body:joi.object().required().keys({
        commentBody:joi.string().min(3).max(200).required(),
        productId:joi.string()

    })
}
export const updateCommentSchema = {
    body:joi.object().required().keys({
        commentBody:joi.string().min(3).max(200).required(),
        productId:joi.string()

    })
}