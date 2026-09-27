const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.set("query parser", "extended");
const errorMiddleware = require("../Backend/middleware/error")

app.use(express.json())
app.use(cookieParser())

// Route Imports
const productRouter =require('./routes/productRoute')
const userRouter = require("./routes/userRoutes")
const error = require("./middleware/error")

app.use('/api/v1',productRouter)
app.use('/api/v1',userRouter)
// Middleware for errors
app.use(errorMiddleware)

module.exports = app