const ErrorHandler = require("../utils/errorhandler")

module.exports = (err ,req ,res ,next)=>{
    err.statuscode = err.statuscode || 500
    err.message =err.message || "Internal Server Error"


    // wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resourse not Found. Invalid: ${err.path}`
        err = new ErrorHandler(message,400)
    }   

    // mongoose duplicate key error 
    if(err.code === 11000){
        const message = `this ${Object.keys(err.keyValue)} is already registered`
        err = new ErrorHandler(message,400)
    }
    // Wrong JWT error
        if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid , try again `
        err = new ErrorHandler(message,400)
    }
    // JWT expire error
            if(err.name === "TokenExpiredError"){
        const message = `Json Web Token  is Expired , try again `
        err = new ErrorHandler(message,400)
    }

    res.status(err.statuscode).json({
        success:false,
        message: err.message,
        error:err.statuscode,
        // location:err.stack
    })
}