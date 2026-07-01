import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const port = process.env.PORT || 3000;

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ success: true, message : "string data saved"})
})

app.get("/user/:id/json", async (req,res) => {
    const raw = await redis.get(`user:${req.params.id}:json`)
    // console.log(raw)
    res.json({ user: raw ? JSON.parse(raw) : null})
})

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ success: true, message : "object data saved"})
})

app.get("/user/:id/hash", async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({ user })
})

app.listen(port, () => {
    console.log(`Server is up & running on ${port}`)
})