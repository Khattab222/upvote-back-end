import {  model,Schema } from "mongoose";
import bc from 'bcryptjs'
import { systemRoles } from './../../src/utils/systemRoles.js';
const userSchema = new Schema({
    firstName:{type:String,trim:true},
    lastName:String,
    email:{
        type:String,
        unique:true,
    },
    password:String,
  
    profile_pic:{type:String,default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'},
    profilePicPublicId:{type:String,default:''},
    covers:[String],
    coverpublicId:[String],
    isConfirmed:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:systemRoles.USER,
        enum:[systemRoles.USER,systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
    },
    bio:String

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
userSchema.pre('save',function(next,doc){
    this.password= bc.hashSync(this.password,+process.env.SALT_ROUNDS);
    next()
})

userSchema.virtual('products',{
    ref:'Product',
    foreignField:'createdBy',
    localField:'_id'
})


const userModel = model.User ||  model('User',userSchema);
export default userModel;