
import CommentModel from '../../../Db/models/comment.model.js';
import ProductModel from '../../../Db/models/product.model.js';
import userModel from './../../../Db/models/user.model.js';
import cloudinary from './../../utils/cloudinary.js';
import bc from 'bcryptjs'



// get user profile
export const getUserProfile = async (req,res,next) => {
  const user = await userModel.findById(req.params.id).select('-password').populate([
    {
        path:'products',
        populate:[{path:'createdBy',ref:'User'}]
    }
  ])

  if (!user) {
    return next(new Error('invalid id', {cause:400}))
  }
  res.status(200).json({message:'done',user})   
}


// update user profile photo 
export const userprofile = async (req,res,next) => {
    const {_id,firstName} = req.user;

    const existUser = await userModel.findById(_id);
    if(!existUser) return next(new Error('invalid id', {cause:400}))

    if (!req.file) {
        return next(new Error('picture required'),{cause:400})
    }
    const { secure_url,public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder:`profiles/${firstName}`
    })

    const user = await userModel.findByIdAndUpdate({_id},{
        profile_pic:secure_url,
        profilePicPublicId:public_id
    },{new:true}).select('-password')
    if(!user){
        return next(new Error('please login '),{cause:400})

    }
    if (existUser.profilePicPublicId) {
       await cloudinary.uploader.destroy(existUser.profilePicPublicId)

   return res.status(200).json({message:'updated done',user})

    }
   return res.status(200).json({message:'done',user})

  
   
}


export const cover = async (req,res,next) => {
    const {_id,firstName} = req.user;


    if (!req.files.length) {
        return next(new Error('pictures required'),{cause:400})
    }

    let images = [];
    let publicids = [];
    for (const file of req.files) {
        const { secure_url,public_id} = await cloudinary.uploader.upload(file.path, {
            folder:`covers/${firstName}`
        })
        images.push(secure_url)
        publicids.push(public_id)
    }
    const user = await userModel.findByIdAndUpdate(_id,{
        covers:images,
        coverpublicId:publicids
    })
    if(!user){
        return next(new Error('please login '),{cause:400})

    }
    if (user.coverpublicId.length) {
        const deleted = await cloudinary.api.delete_resources(user.coverpublicId)

   return res.status(200).json({message:'updated done'})

    }
    return res.status(200).json({message:' done'})


}


// =====================update password=============================
export const updatepass = async (req,res,next) => {
  const {_id} = req.user;
  const {oldpass,newpass} = req.body;
  const user = await userModel.findById({_id});
  if (!user) {
    return next(new Error('user not exist or not login ',{cause:400}))
  }

const match = bc.compareSync(oldpass,user.password);

if (!match) {
    return next(new Error('wrong old password',{cause:400}))   
}
const hashedPass = bc.hashSync(newpass,+process.env.SALT_ROUNDS);
const update = await userModel.findByIdAndUpdate({_id},{
    password:hashedPass
})
if (!update) {
    return next(new Error('fail try again later'))    
}
res.status(200).json({message:'done try to login ', })

}


// update user profile
// =====================update password=============================
export const updatUserProfile = async (req,res,next) => {
  
    const {firstName,lastName,bio,password} = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return next(new Error('user not exist or not login ',{cause:400}))
    }
  

  const hashedPass = bc.hashSync(password,+process.env.SALT_ROUNDS);
  const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
    firstName,
    lastName,
    bio,
      password:hashedPass
  },{
    new:true
  }).select('-password').populate([
    {
        path:'products',
        populate:[{path:'createdBy',ref:'User'}]
    }
  ])
  if (!updateUser) {
      return next(new Error('fail try again later'))    
  }
  res.status(200).json({message:'success',updateUser })
  
  }


  //  get all users 
  export const getAllUsers = async(req,res,next) =>{
    const allUsers = await userModel.find({}).select('-password');

    if (!allUsers.length) {
      res.status(200).json({message:'no users',allUsers })

    }
    res.status(200).json({message:'success',allUsers })


  }

  //  delete users 
  export const deleteUser = async(req,res,next) =>{
    const {id} = req.params
    const {_id,role} = req.user



    const user = await userModel.findById(id);

    if (!user) {
      return next(new Error('invalid id ',{cause:400}))
    }
    if ( role == 'Admin' || user._id.toString() == _id.toString()) {

        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
          return next(new Error('delete fail ',{cause:401}));
        }
    
        await ProductModel.deleteMany({createdBy:deletedUser._id})
        await CommentModel.deleteMany({commBy:deletedUser._id})
    return  res.status(200).json({message:'delete success',id })
    }
   
    return next(new Error('you are not authorized to delete this user ',{cause:401}))

  }



