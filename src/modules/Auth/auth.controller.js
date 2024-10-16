import userModel from "../../../Db/models/user.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { tokenDecode, tokenGenerator } from "../../utils/tokenfunction.js";
import bc from 'bcryptjs'

// sign up 
export const signup = async (req,res,next) => {
  const {firstName,email,lastName,password} = req.body;
  const usercheck = await userModel.findOne({email}).select('-_id email');
  if (usercheck) {
    return next(new Error('email already exists' ,{cause:409}))
  }
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password,
    isConfirmed:true
   
  })


  await newUser.save();
  res.status(201).json({message:'sign up success'})
}



// confirmation link // 
export const confirmEmail =async (req,res,next) => {
  const {token} = req.params;
  const decoded = tokenDecode({payload:token});
  if(!decoded?._id){
    return next(new Error('decode token fail' ))
  }
  const user = await userModel.findById(decoded._id,'-_id isConfirmed');
  if (user.isConfirmed) {
    return res.status(200).json({message:'user already confirmed'})
  }
  const updateuser = await userModel.findByIdAndUpdate({_id:decoded._id},{isConfirmed:true},{new:true});
  if (!updateuser) {
    return next (new Error('confirm fail', {cause:400}))
  }
  res.status(200).json({message:'email confirm successsfully', updateuser})
}


// login 
 export const login =async (req,res,next) => {
   const {email,password} = req.body;
   const isExist = await userModel.findOne({email});
   if (!isExist) {
    return next( new Error('invalid login information' , {cause:400}))
   }
   if (isExist.isConfirmed ==false) {
    return next( new Error('email not confirmed please confirm your email' , {cause:400}))
   }
   const passwordMatch = bc.compareSync(password,isExist.password);
   if (!passwordMatch) {
    return next( new Error('invalid login information' , {cause:400}))
   }
   const loggedUser = await userModel.findByIdAndUpdate(isExist._id,{isLoggedIn:true},{new:true}).select('-password');
   if (!loggedUser) {
    return next( new Error(' fail try to login again' , {cause:400}))
    
   }
   const token = tokenGenerator({payload:{_id:isExist._id,firstName:isExist.firstName,lastName:isExist.lastName,email:isExist.email,isloggedin:isExist.isLoggedIn,profile_pic:isExist.profile_pic,role:isExist.role}})
   res.status(200).json({message:'login success',token,user:loggedUser})

 }

 // log out 
 export const logOut =async (req,res,next) => {
  const {_id}= req.user
  const isExist = await userModel.findById(_id);
  if (!isExist) {
   return next( new Error('user' , {cause:400}))
  }
 
 
  const loggedUser = await userModel.findByIdAndUpdate(isExist._id,{isLoggedIn:false},{new:true});
  if (!loggedUser) {
   return next( new Error(' fail' , {cause:400}))
   
  }
  
  res.status(200).json({message:'logout success'})

}


 // forget password
 export const forgetPass = async (req,res,next) => {
   const {email}= req.body;
   const user = await userModel.findOne({email});
   if (!user) {
    return next(new Error('invalid email' , {cause:400}))
   }
   const token  = tokenGenerator({payload:{_id:user._id}});
   const resetLink = `${req.protocol}://localhost:3000/reset-password/${token}`;
   const message = `<a href=${resetLink}>click to reset password </a>`;

   const sentEmail = await sendEmail({
     to:email,
     subject:'reset your password',
     message
   })
   if(!sentEmail){
     return next(new Error('email sending fail',{cause:500}))
   }
   res.status(200).json({message:'please check your email to reset password'})
 }


 // reset password
 export const resetPass = async (req,res,next) => {
   const {token} = req.params;
   const {newPass} = req.body;
   const decoded = tokenDecode({payload:token});
   if (!decoded?._id) {
    return next(new Error('token decode fail' , {cause:400}))
   }
   const hashedPass = bc.hashSync(newPass,+process.env.SALT_ROUNDS);
   const user = await userModel.findByIdAndUpdate(decoded._id,{password:hashedPass});
   if (!user) {
    return next(new Error('fail to reset password',{cause:400}))
   }
   res.status(200).json({message:'success try to login' })
 }
 
 
  


