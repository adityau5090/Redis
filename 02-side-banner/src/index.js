import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const port = process.env.PORT || 3000;

const BANNER_KEY = "app:banner";

app.get('/', (req, res) => {
    res.json("{Server2 is up & running !}")
})

app.post("/banner", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to chai aur redis!");
    res.json({ success: true });
})  

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);

    if(message){
        res.json({ message : message})
    }else {
        res.json({ error: "Key not found"})
    }
})

app.get('/banner/exists', async (req,res) => {
    const exists = await redis.exists(BANNER_KEY)
    res.json({ exists: exists })
})

app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
})

 
app.listen(port, () => {
    console.log(`Server is up & running on ${port}`)
})