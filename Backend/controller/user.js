const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const sendTOken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")


// register a User

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is sample id",
            url: "profilepicUrl"
        }
    })
    sendTOken(user, 201, res)
})
// login a User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email or Password", 400))
    }
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid Email or PAassword", 401))
    }
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or PAassword", 401))
    }

    sendTOken(user, 200, res)
})


// logout a user

exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    // get reset passsword token
    const resetToken = user.getResetPassword()
    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your Password reset token is :- \n\n${resetPasswordUrl} if you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message

        })
        res.status(200).json({
            success: true,
            message: `email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler("Reset passowrd token is invalid or has been expired", 400))
    }
    if (req.body.password !== req.body.confirmedPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined


    await user.save()

    sendTOken(user, 200, res)
})
// get user details 
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user,
    })

})
// Update user Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldpassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 401))
    }
    if (req.body.newPassword !== req.body.confirmedPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendTOken(user, 200, res)

})
// update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        returnDocument: "after",
        runValidators: true
    })
    res.status(200).json({
        success: true
    })

})

// get all users --admin

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find()

    res.status(200).json({
        success: true,
        user
    })
})

// get single user Details --admin

exports.getSingleUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`user doesnt exist with id:${req.params.id}`, 400))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// update user profile --admin
exports.updateProfilebyAdmin = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        returnDocument: "after",
        runValidators: true
    })
    res.status(200).json({
        success: true
    })

})

// delete user profile --admin
exports.DeleteProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`user doesnt exist with id:${req.params.id}`, 400))
    }
    
    res.status(200).json({
        success: true
    })

})