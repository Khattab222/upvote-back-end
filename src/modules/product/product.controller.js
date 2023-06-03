import ProductModel from './../../../Db/models/product.model.js';
import CommentModel from './../../../Db/models/comment.model.js';
import { pagination } from "../../services/pagination.js";
import cloudinary from '../../utils/cloudinary.js';



// add product
export const addProduct = async(req,res,next) =>{
    const {title,caption,category} = req.body;
    const {firstName,_id} = req.user;
 
    if (!req.file) {
        return next(new Error('Please choose image' , {cause:400}))
    }

const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.PROJECT_FOLDER}/posts/${firstName}`
})

      
    const newPost = new ProductModel({title,caption,Image:secure_url,publicId:public_id,createdBy:_id,category});
    const savedPost = await newPost.save();
    if (!savedPost) {
        return next(new Error('fail try again later'))
    }
    res.status(201).json({message:'success',savedPost })
}

// update
export const updateprod = async (req,res,next) => {
    const {id} = req.params;
    const {title,caption,category} = req.body
    const product = await ProductModel.findById(id).populate([
        {path:'createdBy',select:'-password'},
        {path:'comments', populate:[{path:'commBy',select:'firstName profile_pic'}]
        }
    ]);
   
    if (!product) {
        return next(new Error('invalid id',{cause:400}))
    }
    if (product.createdBy._id.toString() != req.user.id) {
        return next(new Error('only owner can update',{cause:400})) 
    }
    // if (!Object.keys(req.body).length) {
    //     return next (new Error('please enter update fields',{cause:400}))
    //   }
        if (title) {
            product.title = title;
        }
        if (caption) {
            product.caption = caption
        }
        if (category) {
            product.category = category
        }
  
     
     
    if (req.file) {
       
        await cloudinary.uploader.destroy(product.publicId)
    const {public_id,secure_url}=     await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.PROJECT_FOLDER}/posts/${req.user.firstName}`
        });
        product.publicId = public_id;
        product.Image = secure_url
       
    }
  
const post = await product.save()
if (!post) {
    return next (new Error('fail',{cause:500}))

}
res.status(201).json({message:'succcess',post})

}
// get all products
// export const getAllProducts = async (req,res,next) =>{

//     const products = await ProductModel.find({});
//     if (!products) {
//          next(new Error('there is no  products'))
//         }
//         let arr = []
//     // for (const product of products) {
//     //     const comments = await CommentModel.find({productId:product._id}).populate([{
//     //         path:'commBy',
//     //         select:'email -_id'
//     //     }]);
//     //     arr.push({product,comments})
//     // }


//     const cursor = await ProductModel.find({ }).cursor();
//     for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//         const comments = await CommentModel.find({productId:doc._id}).populate([{
//             path:'commBy',
//             select:'email -_id'
//         }]);
//         const docs = doc.toObject();
//         docs.comments = comments
//         arr.push(docs)
//     }
//     res.status(201).json({message:'done',arr})
// }


// parent-child 
export const getAllProducts = async (req,res,next) =>{
    const {page,size,category} = req.query;
    const {  perPage,skip,nextPage,prePage,currentPage}= pagination({page,size})
   let allpostsCount = await ProductModel.count()
let posts = [];
if (category) {
    allpostsCount = await ProductModel.find({category}).count()
     posts = await ProductModel.find({category}).populate([{
       
        path:'comments',
        populate:[{
            path:'commBy',
            select:'firstName  email '
        }],
        // match:{
        //     commentBody:'bad ring'
        // }
    },{
        path:'createdBy',
        select:'firstName email  profile_pic _id'
    }]).limit(perPage).skip(skip).sort({createdAt:-1})
    const totalPages = Math.ceil( allpostsCount / perPage)
    if (!posts.length) {
     return   res.status(200).json({message:'there is no products',data:{posts}})

        }
 
 return   res.status(200).json({message:'done',data:{posts}, meta:{totalPages, perPage,skip,nextPage,prePage,currentPage}})


}
// if (page) {
     posts = await ProductModel.find({}).populate([{
       
        path:'comments',
        populate:[{
            path:'commBy',
            select:'firstName  email'
        }],
        // match:{
        //     commentBody:'bad ring'
        // }
    },{
        path:'createdBy',
        select:'firstName email _id profile_pic'
    }]).limit(perPage).skip(skip).sort({createdAt:-1})
// }
  

    const totalPages = Math.ceil( allpostsCount / perPage)
    if (!posts.length) {
     return   res.status(200).json({message:'there is no products',data:{posts}})

        }
 
    res.status(200).json({message:'done',data:{posts}, meta:{totalPages, perPage,skip,nextPage,prePage,currentPage}})
}


// get all posts for admin
export const getAllProductsForAdmin = async (req,res,next) =>{

   const  posts = await ProductModel.find({}).populate([{
       
        path:'comments',
        populate:[{
            path:'commBy',
            select:'firstName  email '
        }],
        // match:{
        //     commentBody:'bad ring'
        // }
    },{
        path:'createdBy',
        select:'firstName email _id profile_pic'
    }])

    if (!posts.length) {
     return   res.status(200).json({message:'there is no products',posts})

        }
 
    res.status(200).json({message:'done',posts})
}

// get single post by id
export const getsingleproduct = async (req,res,next) =>{
    const {id} = req.params;

   const post = await ProductModel.findById(id).populate([
    {path:'createdBy',select:'-password'},
    {path:'comments', populate:[{path:'commBy',select:'firstName profile_pic'}]

    }


]);

    if (!post) {
      return   next(new Error('invalid id',{cause:400}))
        }
 
    res.status(200).json({message:'done',post})
}
//************like product*************************** */

export const likeProduct = async(req,res,next) => {
  const {_id}= req.user;
  const {productId} = req.params;
  let  post = await ProductModel.findById(productId)
  if (!post) {
    next(new Error(`invalid id`))
}
const isuserliked = post.likes.find((user) => user.toString() ==_id );
if (isuserliked) {
    post = await ProductModel.findByIdAndUpdate(productId,{
        $pull:{likes:_id}
    },{new:true})
}else{
    post = await ProductModel.findByIdAndUpdate(productId,{
        $push:{likes:_id}
    },{new:true})
}

res.status(200).json({message:"done",post,id:_id})
}


// unlike product
export const unlikeProduct = async(req,res,next) => {
  const {_id}= req.user;
  const {productId} = req.params;
  const prod = await ProductModel.findOneAndUpdate({_id:productId},{
    $addToSet:{
       unlikes:_id
    },
    $pull:{
        likes:_id
    }
  },{new:true})
  if (!prod) {
    next(new Error(`fail`,{cause:400}))
}
prod.totalVotes = prod.likes.length - prod.unlikes.length;
await prod.save()
res.status(200).json({message:"done",prod})
}


// ============ soft delete ==============
export const softDeleteProduct = async (req,res,next) => {
    const {prodId} = req.params;
    const product = await ProductModel.findById(prodId);

   
    if (!product) {
     return   next (new Error('invalid product id ', {cause:400}))
    }
 
    if (req.user.role == "Admin" || product.createdBy.toString() == req.user.id  ) {
        await CommentModel.deleteMany({_id:product.comments});
        await cloudinary.uploader.destroy(product.publicId)
        // to do delete all comments belong to this post
      await ProductModel.findByIdAndDelete(prodId);
    
       
    return   res.status(200).json({messgae:'delete done',id:product._id})
    }
    

  return   next (new Error('you cannot delete this product', {cause:400}))

}




