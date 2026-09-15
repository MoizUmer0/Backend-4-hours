const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    description:{
        type:String,
        required:[true,"please enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"please enter product Price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    Stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxLength:[4,"stock cannot exceed 8 characters"],
        default:1
    },
    numofReview:{
        type:Number,
        default:0    
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
               type:Number,
               required:true 
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Product",productSchema)

