

import joi from "joi";




export const creatCategorySchema = {
    body:joi.object().required().keys({
        title:joi.string().min(3).max(200).required(),
      

    })
}