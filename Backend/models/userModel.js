const mongoose =require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto =require("crypto")
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[20,"Name cannot exceed 20 characters"],
        minlength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter the valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your Password"],
        minlength:[8,"|Password should have more than 8 characters"],
        select:false,

    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"


    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return
    }
    this.password = await bcrypt.hash(this.password,10)
})
// Get JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

// compare password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return  await  bcrypt.compare(enteredPassword,this.password)
}

// Generate Password reset token
userSchema.methods.getResetPassword = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")


    // hashimg amd adding to user scheme
    this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire = Date.now()+15*60*1000

    return resetToken
}
module.exports = mongoose.model("User",userSchema)