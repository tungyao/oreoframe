const koa = require("koa2");
const url = require("./route");
// const route = require("../../../src/controller/index");
const Template = require("./io/template").Template;
const StaticCache = require("./io/static_cache").StaticCache;
const Crypt = require("./io/crypt").Crypt;
const numCPUs = require('os').cpus().length;
const rediss = require("redis");
const cluster = require("cluster");
const contrnoller = require("./controller");
const error = require("./errors");
const midware = require("./midware");


class Server {
    constructor(Route) {
        this.url = url;
        this.redi =null;
        this.IsInits = [];
        this.Koa = new koa();
        this.isredis = false;
        this.RedisPool = ()=>{};
    }

    noredis() {
        this.isredis = false;
    }

    redis() {
        this.RedisPool = require("koa-2-ioredis");

        if (this.IsInits.length === 0) {
            this.redi =  rediss.createClient();;
            let Staticcache = new StaticCache();
            Staticcache.cacheAll(this.redi);
            this.IsInits.push(0);
        }
        this.isredis = true;
    }

    init() {
        return this;
    }

    start() {
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                console.log('worker' + worker.id + 'died');
            });
        } else {
            if(this.isredis===true){
                this.Koa.use(this.RedisPool());
                console.log(1);
            }
            this.Koa.use(async (ctx, next) => {
                let l = ctx.url.toString().length - (ctx.querystring === "" ? 0 : `?${ctx.querystring}`.length);
                let trueUrl = "";
                for (let i = 0; i < l; i++) {
                    trueUrl += ctx.url[i];
                }
                for (let i = 0; i < this.url.Url.length; i++) {
                    let val = url.Url[i];
                    if (trueUrl === val.url) {
                        {
                            val.middleware.filter({
                                method: ctx.method,
                                url: ctx.url,
                                host: ctx.header.host
                            }).next();
                            switch (val.callbacktype) {
                                case "function":
                                    if (typeof val.callback(ctx) === "string") {
                                        ctx.body = val.callback(ctx);
                                    }
                                    break;
                                case "string":
                                    ctx.body = val.callback;
                                    break;
                                case "object":
                                    let ht = val.callback.view();
                                    if (this.isredis) {
                                        const doc = await ctx.redis.get(val.callback.tem());
                                        
                                        const temp = Template.test(JSON.parse(doc).data, val.callback.args());
                                        ctx.body = temp;
                                    } else {
                                        val.callback.notem().then(value => ctx.body = Template.test(value,val.callback.args()))
                                    }
                                    break;

                            }

                        }
                    }


                }
                await next();
            });
            this.Koa.use(async (ctx, next) => {
                if (/\w+(.css)/.test(ctx.path)) {
                    let str = ctx.path.match(/\w+(.css)/);
                    const doc = await ctx.redis.get(Crypt.md5(str[0]));
                    ctx.response.type = "text/css";
                    ctx.response.body = JSON.parse(doc).data;
                }
            });
            this.Koa.listen(80);
        }
    }
}

module.exports = {
    Server: Server,
    Controller: contrnoller.Controller,
    Errors: error.Errors,
    Midware: midware.Midware,
    Route: url
}


