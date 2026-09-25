const app = require('./app')
const dotenv = require("dotenv")
const { connectDatabase } = require('./config/database')

// handling UNcaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to Uncaugth exception")
    process.exit(1)
})


// config
dotenv.config({path:"Backend/config/config.env"})

// Connect Database

connectDatabase()

const server = app.listen(process.env.PORT,()=>console.log(`Server is working on http://localhost:${process.env.PORT}`))


// unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1)
    })
})