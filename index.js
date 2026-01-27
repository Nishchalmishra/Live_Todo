import express from "express"
import dotenv from "dotenv"
import dbConnect from "./src/db/db.js"
import router from "./src/routes/todo.route.js"
import userRouter from "./src/routes/user.route.js"
import redis from './redisClient.js';

dotenv.config()
dbConnect()

const app = express()

app.use((req,res,next)=>{
    const timeStamp = Date.now()
    res.on('finish', () => { console.log(`Request Finished in ${Date.now() - timeStamp} ms`) })
    next()
})

const rateLimiter = async (req, res, next) => {
    try {
        // const ip = req.ip;
        // const key = `rate:${ip}`;

        // const current = await redis.incr(key);

        // if (current === 1) {
        //     // first request → set window
        //     await redis.expire(key, 60); // 10 seconds
        // }

        // if (current > 5) {
        //     return res.status(429).json({
        //         message: 'Too many requests. Slow down.',
        //     });
        // }
        const ip = req.ip
        const key = `rate:${ip}`

        const current = await redis.incr(key)

        if (current === 1) {
            await redis.expire(key, 60)
        }

        if (current > 5) {
            return res.status(429).json({message:"Too many requests. Slow down."})
        }

        next();
    } catch (err) {
        next(err);
    }
};


app.use(express.json())
app.use("/api/v1/todo", rateLimiter, router)
app.use("/api/v1/user", userRouter)

// app.get("/", (req, res) => {
//     res.send("Hello World")
// })

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`)
// })
export default app