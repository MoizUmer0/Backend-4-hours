const express = require("express")
const app = express()

app.set("query parser", "extended");
const errorMiddleware = require("../Backend/middleware/error")

app.use(express.json())

// Route Imports
const productRouter =require('./routes/productRoute')
const error = require("./middleware/error")

app.use('/api/v1',productRouter)

// Middleware for errors
app.use(errorMiddleware)

module.exports = app