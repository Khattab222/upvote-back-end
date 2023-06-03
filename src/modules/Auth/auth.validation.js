import joi from 'joi'

export const signupSchema = {
    body:joi.object().required().keys({
        firstName:joi.string().required().min(3).max(8),
        lastName:joi.string().required().min(3).max(8),
        email:joi.string().email({tlds:{allow:['com','net']}}).required(),
        password:joi.string().required(),
        cpass:joi.string().valid(joi.ref('password')).required(),
      
    })
}

export const loginSchema = {
    body:joi.object().required().keys({
        email:joi.string().required().email({tlds:{allow:['com','net']}}),
        password:joi.string().required()
    })
}
export const resetpassSchema = {
    body:joi.object().required().keys({
        newPass:joi.string().required(),

    })
}

