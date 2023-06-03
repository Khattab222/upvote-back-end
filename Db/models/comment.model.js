import {  model,Schema } from "mongoose";


const commentSchema = new Schema({
commentBody:{
    type:String,
    required:true
},


commBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
productId:{
    type:Schema.Types.ObjectId,
    ref:'Product'
},
replies:[{
    type:Schema.Types.ObjectId,
    ref:'Reply'
}]

},{
    timestamps:true
});


const CommentModel = model.Comment ||  model('Comment',commentSchema);
export default CommentModel;