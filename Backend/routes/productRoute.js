const express = require("express");
const { getAllProducts,createProducts,updateProduct,deleteProducts, getProductDetails} = require("../controller/product");

const router = express.Router();

router.route("/products").get(getAllProducts)
router.route("/product/new").post(createProducts)
router.route("/product/:id").put(updateProduct).delete(deleteProducts).get(getProductDetails)




module.exports = router