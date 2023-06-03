import userModel from "../../Db/models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { tokenDecode } from "../utils/tokenfunction.js";

 export const auth = (accessRoles) => {
  return async (req, res, next) => {
  try {
    const { authorization } = req.headers;
  
    if (!authorization) {
      return next(new Error("please login .......", { cause: 400 }));
    }
    if (!authorization.startsWith("khaled__")) {
      return next(new Error("wrong prefix ", { cause: 400 }));
    }
    const sepratedtoken = authorization.split("khaled__")[1];
    const decoded = tokenDecode({ payload: sepratedtoken });
    if (!decoded?._id) {
      return next(new Error("decoded fail", { cause: 400 }));
    }
    const user = await userModel.findById(decoded._id).select('firstName email role _id');
    if (!user) {
      return next(new Error("user not exist any more", { cause: 400 }));
    }
    if (accessRoles) {
      if (!accessRoles.includes(user.role)) {
          return next(new Error('Not authorized',{cause:400}))
          
      }
  }
    req.user = user;
  
    next();
  } catch (error) {
    return res.json({ message: "Catch error in auth" , err:error?.message })
  }
  };
}





