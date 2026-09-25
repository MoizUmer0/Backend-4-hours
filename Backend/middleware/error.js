const ErrorHandler = require("../utils/errorhandler")

module.exports = (err ,req ,res ,next)=>{
    err.statuscode = err.statuscode || 500
    err.message =err.message || "Internal Server Error"


    // wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resourse not Found. Invalid: ${err.path}`
        err = new ErrorHandler(message,400)
    }   

    res.status(err.statuscode).json({
        success:false,
        message: err.message,
        error:err.statuscode,
        // location:err.stack
    })
}