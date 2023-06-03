import {  model,Schema } from "mongoose";


const categorySchema = new Schema({
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
},
title:{
    type:String,
    required:true,
    trim:true
}


},{
    timestamps:true
});


const categoryModel = model.Category ||  model('Category',categorySchema);
export default categoryModel;