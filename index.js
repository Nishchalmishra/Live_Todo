import express from "express"
import dotenv from "dotenv"
import dbConnect from "./src/db/db.js"
import router from "./src/routes/todo.route.js"
import userRouter from "./src/routes/user.route.js"

dotenv.config()
dbConnect()

const app = express()

app.use(express.json())
app.use("/api/v1/todo", router)
app.use("/api/v1/user", userRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})