import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const mongoUrl = process.env.MONG_URL || 'mongodb://localhost:27017/chai_aur_redis';
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json("{Server is up & running !}")
})

app.get('/redis', async (req, res) => {
    const reply = await redis.ping();
    res.json({ message : `Redis replied with ${reply}`});
})

app.get('/mongo', async (req, res) => {
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(mongoUrl)    
    }
    res.json({ mongo: "connected", database: mongoose.connection.name})
})

app.listen(port, () => {
    console.log(`Server is up & running on ${port}`)
})