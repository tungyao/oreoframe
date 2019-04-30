const Template = require("./io/template").Template;
let fs = require("fs");
const Crypt = require("./io/crypt").Crypt;

class Controller {
    constructor(...args) {
        this.arg = args;
        this.index_html = null;
    }

    args() {
    };

    view() {
        return "index.html";
    }

     tem() {
        this.index_html = this.view();
        return  Crypt.md5(this.index_html);
    }
   async notem(){
        let path = `./src/view/${this.view()}`
        return await fs.readFileSync(path,"utf-8");
    }
}


exports.Controller = Controller;