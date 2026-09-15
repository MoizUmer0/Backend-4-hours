const express = require("express")
const app = express()

app.use(express.json())

// Route Imports
const productRouter =require('./routes/productRoute')

app.use('/api/v1',productRouter)

module.exports = app