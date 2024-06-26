import {Hono} from "hono"
import {handle} from "hono/vercel"
import {env} from "hono/adapter";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type EnvConfig = {
    UPSTASH_REDIS_REST_TOKEN:string
    UPSTASH_REDIS_REST_URL:string
}

app.get("/search",async(c)=>{
    try{
    const {UPSTASH_REDIS_REST_TOKEN,UPSTASH_REDIS_REST_URL} = env<EnvConfig>(c);
    
    const start = performance.now()
//  ----------------------
    
    const redis = new Redis({
    token:UPSTASH_REDIS_REST_TOKEN,
    url:UPSTASH_REDIS_REST_URL
    })
    const query = c.req.query("q")?.toUpperCase()
    if(!query){
        return  c.json({message:"Invalid Search Query"},{status:400})
    }
    const res = [];
    const rank = await redis.zrank("terms",query) 
    if(rank!==null && rank!==undefined){
    const temp = await redis.zrange<string[]>("terms",rank,rank+50)
    for(const x of temp){
        if(!x.startsWith(query)){
            break;
        }
        if(x.endsWith("*")){
            res.push(x.substring(0,x.length-1))
        }
    }
    
    }
    //  -> --------------------------------------
    const end = performance.now()
    return c.json({
        results:res,
        duration:end-start
    })
} 
catch(err){
    console.error(err);
    return c.json({
        results:[],
        message:"Something went wrong"
    },{status:500}
)
}
})  


export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export default app as never;