const express = require("express");
const { getAllProducts,createProducts,updateProduct,deleteProducts, getProductDetails, createProductReview} = require("../controller/product");
const { isAuthenticatedUser ,authorizedRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProducts)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProducts)

router.route("/product/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatedUser,createProductReview)


module.exports = router