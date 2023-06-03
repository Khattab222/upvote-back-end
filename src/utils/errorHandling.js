
let stackvar ;
export const asyncHandler = (Api) => {
    return (req,res,next) => {
      Api(req,res,next).catch((err) => {
        if (err.code == 11000) {
        return    next(new Error('email already exist', {cause:409}))
        }
      
    
        stackvar = err.stack
       return next (new Error(err))
      })
    }
    
}

export const globalResponse = (err, req, res, next) => {
  if (err) {
      if (process.env.ENV_MODE == 'DEV') {
        
          return res
              .status(err['cause'] || 500)
              .json({ message: "Fail Response", Error: err.message, stack: stackvar })
      }
      return res
          .status(err['cause'] || 500)
          .json({ message: "Fail Response", Error: err.message })

  }
}

