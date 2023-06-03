
import {  model,Schema } from "mongoose";


const productSchema = new Schema({
title:String,
caption:String,
Image:{
    type:String,
    default:'',
 
},
publicId:{
    type:String,
    default:'',

},
likes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
}],

totalVotes:{
    type:Number,
    default:0
},
isDeleted:{
    type:Boolean,
    default:false
}
,
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
comments:[{
    type:Schema.Types.ObjectId,
    ref:'Comment'
}],
category:{
    type:String,
    required:true
}

},{
    timestamps:true
});




const ProductModel = model.Product ||  model('Product',productSchema);
export default ProductModel;