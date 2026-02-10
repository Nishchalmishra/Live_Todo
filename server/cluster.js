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
    const { default: app } = await import("./app.js")

    app.get("/", (req, res) => {
        res.send("Hello World from India!!!")
    })

    app.listen(process.env.PORT, () => {
        console.log(`Worker ${process.pid} is running`);
    })
}