const express = require("express")
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUserDetails, updateProfilebyAdmin, DeleteProfile} = require("../controller/user")
const { isAuthenticatedUser ,authorizedRoles} = require("../middleware/auth");

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUsers)
router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUserDetails)
.put(isAuthenticatedUser,authorizedRoles("admin"),updateProfilebyAdmin)
.delete(isAuthenticatedUser,authorizedRoles("admin"),DeleteProfile)





module.exports = router