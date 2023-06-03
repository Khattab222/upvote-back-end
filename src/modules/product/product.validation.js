import joi from "joi";




export const addProductSchema = {
    body:joi.object().required().keys({
        title:joi.string().min(3).max(15).required(),
        caption:joi.string().min(3).max(400).required(),
        category:joi.string().min(3).max(400).required(),
       
    })
}
export const updateProductSchema = {
    body:joi.object().required().keys({
        title:joi.string().min(3).max(8),
        caption:joi.string().min(3).max(400),
        category:joi.string().min(3).max(400),
       
    })
}
