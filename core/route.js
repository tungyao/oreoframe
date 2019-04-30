let urls = [];
let Mideware = require("./midware").Midware;
class Route extends Mideware {
    filter(...args) {
        if (args.length > !2) return;
        if (typeof args[2] === "function") {
           return  args[2]();
        } else if (typeof args[2] === "object") {
            return  args[2].filter();
        } else if (typeof args[2] === "string") {
            return args[2];
        }
    }

    static get(url, callback=()=>{}, middleware=new Mideware()) {
        urls.push({url, callbacktype: typeof callback, callback, middleware});
    }
    static post(url, callback) {

    }

    static redirect(url, ctx) {
        for (let i = 0; i <urls.length ; i++) {
            if (url=== urls[i].url){
                ctx.response.redirect("/");
                return "red";
            }
        }
    }
    static error(token, callback) {
    }
}

module.exports ={
    Url:urls,
    Route:Route
}