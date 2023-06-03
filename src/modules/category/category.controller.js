import categoryModel from "../../../Db/models/category.model.js";


// creat Category
export const creatCategory =async (req,res,next) => {
  const {title}= req.body;

  const iSTitleExist = await categoryModel.findOne({title:title.toLowerCase()});
  if (iSTitleExist) {
    return next(new Error('title must be unique ',{cause:400}))
  }

  const newCategory = await categoryModel.create({
    title:title.toLowerCase(),
    createdBy:req.user._id
  })
  if (!newCategory) {
    return next(new Error('fail create'))
  }
  res.status(201).json({message:'done',newCategory})
}


// get all category

export const getAllCategory =async (req,res,next) => {


  const category = await categoryModel.find({});
  
  if (!category.length) {
    res.status(200).json({message:'empty'})

  }
  res.status(201).json({message:'done',category})
}

// delete category
export const deleteCategory =async (req,res,next) => {

     const {categoryId}= req.params

  const category = await categoryModel.findByIdAndDelete(categoryId);
  
  if (!category) {
    return next(new Error('invalid id',{cause:400}))


  }
  res.status(200).json({message:'delete done',categoryId})
}