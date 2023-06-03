import ProductModel from "../../../Db/models/product.model.js";
import CommentModel from './../../../Db/models/comment.model.js';
import ReplyModel from './../../../Db/models/reply.model.js';


// get all comments 
export const getAllComments = async (req,res,next) => {
  const comments = await CommentModel.find({}).populate([{path:'commBy' , select:'profile_pic firstName lastName '}]);
  if (!comments.length) {
    return res.status(404).json({message:'no comments'})
  }
  res.status(200).json({message:'done', comments})
}

// add comment 
export const addComment = async (req,res,next) =>{
    const {commentBody} = req.body;
    const {postId}= req.params
    const {_id} = req.user;
    const product = await ProductModel.findById({_id: postId});
    if (!product) {
        return next(new Error(`invalid product id`,{cause:400}))
    }
    const newComment = new CommentModel({commentBody,commBy:_id,postId});
    const savedCommment = await newComment.save();
    if (!savedCommment ) {
        return next(new Error(`fail try again later`))   
    }

    const update = await ProductModel.updateOne({_id:postId},{
        $push:{
            comments:newComment._id
        }
    })
    if (!update.modifiedCount) {
        return next(new Error(`fail`))
        
    }
    const newcomment = await CommentModel.findById(newComment.id).populate('commBy') 

    res.status(201).json({message:'success',newcomment})

}

// delete comment
export const deleteComment =async (req,res,next) => {
  const {commentId} = req.params;
 
  const {_id} = req.user;

const comment = await CommentModel.findById(commentId);
if (!comment) {
  return next(new Error(`invalid comment id`,{cause:400}))
}

if (comment.commBy.toString() !=_id  ) {
  if (req.user.role === 'Admin') {
    const deletedComment = await CommentModel.findOneAndDelete(commentId);
    const check = await ProductModel.updateOne({_id:deletedComment.productId},{
      $pull:{
          comments:deletedComment._id
      }
    });

   return res.status(200).json({message:'done',commentId})
  }
  return next(new Error(`you can not delete this comment `,{cause:400}))
  
}
const deletedComment = await CommentModel.findOneAndDelete({_id:commentId,commBy:_id});
  if (!deletedComment) {
    return next(new Error(`delete fail`,{cause:400}))
  }


  const check = await ProductModel.updateOne({_id:deletedComment.productId},{
    $pull:{
        comments:deletedComment._id
    }
  });
  if (!check) {
    return next(new Error(`pulling fail`,{cause:400}))
  }
  res.status(200).json({message:'done',commentId})
}

// update comment 
export const updateComent =async (req,res,next) => {
  const {commentId} = req.params;
  const {commentBody} = req.body
  const {_id} = req.user;


const updatedComment = await CommentModel.findOneAndUpdate({_id:commentId,commBy:_id},{
  commentBody
},{new:true}).populate('commBy');


  if (!updatedComment) {
    return next(new Error(`pulling fail`,{cause:400}))
  }
  res.status(200).json({message:'done',updatedComment })
}



// add reply 
export const addReply = async (req,res,next)=> {
  const {commentId,replyBody} = req.body;
  const {_id} = req.user;
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    return next(new Error('invalid comment id', {cause:400}))
  }
  const newReply = new ReplyModel({replyBody,commentId,replyBy:_id});
  const savedReply =await newReply.save()
  const check = await CommentModel.updateOne({_id:commentId},{
    $push:{
      replies:newReply._id
    }
  })
  if (!check.modifiedCount) {
    return next(new Error('pushing fail'))  
  }

  res.status(200).json({message:"done",newReply})
}

// add reply on reply 
export const addreplyonreply =async (req,res,next) => {
    const {replyId,replyBody}= req.body;
    const {_id}= req.user;
    const reply = await ReplyModel.findById(replyId);
    if (!reply) {
    return next(new Error('invalid reply id', {cause:400})) 
    }
    const newreply = new ReplyModel({replyBody,commentId:replyId,replyBy:_id});
    const savedReply =await newreply.save();
    const update = await ReplyModel.updateOne({_id:replyId},{
      $push:{
        replies:newreply._id
      }
    })
    if (!update.modifiedCount) {
    return next(new Error('pushing fail'))  
    }
    res.status(200).json({message:"done",newreply})

}

