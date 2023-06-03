

export const validation = (schema) => {
  return (req,res,next) => {
    const requestKeys = ['body','params','query','headers','file', 'files']
    let validationErrors = [];
    for (const key of requestKeys) {
        if (schema[key]) {
            const validationresult = schema[key].validate(req[key],{abortEarly:false});
            if(validationresult?.error?.details){
                validationErrors.push(validationresult.error.details)
            }
        }
    }
    if(validationErrors.length>0){
        return res.status(400).json({message:'validation error',validationErrors })
    }
    next()
  }
  
}

// export const validation = (schema) => {
//     return (req,res,next) => {
//       const requestkeys = ['body','params','query','headers','file', 'files'];
//       let validationErrors= [];
//       for (const key of requestkeys) {
//           if (schema[key] ) {
//               const validationresult = schema[key].validate(req[key],{abortEarly:false});
           
//               if (validationresult?.error?.details) {
//                   validationErrors.push(validationresult.error.details)
//               }
//               console.log(validationErrors)
//           }
//       }
  
//       if(validationErrors.length>0){
//           return res.status(400).json({message:'validation error',validationErrors })
//       }
//       next();
//     }
    
//   }
  