const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

// Create Product --ADMIN
exports.createProducts = catchAsyncError(async (req,res,next)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

// Get all products
exports.getAllProducts =catchAsyncError(async (req,res)=>{
    const apifeature = new ApiFeatures(Product.find(),req.query).search().filter()
    const products = await apifeature.query
    res.status(200).json({
        success:true,
        products
    })
})

// get Product details

exports.getProductDetails =catchAsyncError( async (req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
             return  next(new ErrorHandler("Product not Found",404))
                }
        res.status(201).json({
        success:true,
        product,
    })
}
)
// update product -- Admin

exports.updateProduct = catchAsyncError(async (req,res)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
             return  next(new ErrorHandler("Product not Found",404))
                }
    
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({
        success:true,
        product
    })
})

// delete Product  -- Admin

exports.deleteProducts = catchAsyncError( async (req,res)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
             return  next(new ErrorHandler("Product not Found",404))
                }
    await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })

})

