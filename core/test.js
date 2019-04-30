const koa = require("koa2");
const Koa = new koa();
const RedisPool = require("ioredis");
const redis = new RedisPool({
    host: '127.0.0.1',//安装好的redis服务器地址
    port: 6379,　//端口
    db: 0
});


Koa.use(async (ctx, next) => {
    const doc = await
        redis.get("eacf331f0ffc35d4b482f1d15a887d3b", async (err, res) => {
            return res;
        });
    ctx.body = JSON.parse(doc).data;
});
Koa.listen(80);

