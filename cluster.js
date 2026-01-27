import redis from './redisClient.js';
import cluster from "cluster"
import os from "os"

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    for(let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on("exit", (worker, code, signal)=>{
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`)
        cluster.fork()
    })

} else {
    const { default: app } = await import("./index.js")

    app.get("/", (req, res) => {
        res.send("Hello World")
    })

    app.get('/test-redis', async (req, res) => {
        await redis.set('name', 'Nishchal', 'EX', 60);
        const value = await redis.get('name');

        res.json({ value });
    });

    app.listen(process.env.PORT, () => {
        console.log(`Worker ${process.pid} is running`);
    })
}