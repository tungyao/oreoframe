//TODO 把所有静态资源全部加载进内存，释放时保存
const fs = require("fs");

const join = require('path').join;
const dirpath = "./src/view/";
const Crypt = require("./crypt").Crypt;


class Static_cache {
    constructor() {
        this.components = []

    }

    async cacheAll(redisPool) {
        let a = this.readDirSync(dirpath);
        for (let i = 0; i < a.length; i++) {
            let json = JSON.stringify({path: a[i].path, data: fs.readFileSync(a[i].path, "utf-8")});

            // await redisPool.redis.set(a[i].name, json)
            await redisPool.set(a[i].name,json);
        }
        // redisPool.get("c19446cb255bbca24452dd39886c66e5", (err, reply) => {
        //     console.log(JSON.parse(reply));
        // });
    }

    readDirSync(path) {
        let jsonFiles = [];
        function findJsonFile(path) {
            let files = fs.readdirSync(path);
            files.forEach(function (item, index) {
                let fPath = join(path, item);
                let stat = fs.statSync(fPath);
                if (stat.isDirectory() === true) {
                    findJsonFile(fPath);
                }

                let result = Crypt.md5(item);
                if (stat.isFile() === true) {
                    jsonFiles.push({
                        path: fPath,
                        name: result
                    });
                }
            });
        }

        findJsonFile(path);
        return jsonFiles;
    }
}

// new Static_cache().readDirSync("../"+dirpath);

exports.StaticCache = Static_cache;

