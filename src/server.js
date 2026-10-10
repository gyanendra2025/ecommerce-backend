import app from "./app.js"
import env from "./config/env.js"

const server=app.listen(env.port,()=>{
    console.log(`server is running at ${env.port}`);
})

