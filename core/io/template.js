let config = require("../../config/default");
let Errors = require("../errors").Errors;

class Template {
    constructor(page = config.www.index) {
        this.page = page;
        this.path = `../../${config.www.path}/`;
        this.index_page_path = this.path + this.page;
    }

    static test(html, va) {
        let reg = /{\w+}/g;
        //匹配到的变量数组
        let arr = html.match(reg);
        if (arr === null) {
            return html;
        }
        let k = [];
        for (let p in va) {
            if (va.hasOwnProperty(p))
                k.push(`{${p}}`);
        }
        if (k.sort().toString() !== arr.sort().toString()) {
            Errors.report("参数匹配错误");
        }
        arr = [];
        for (let p1 in va) {
            arr.push(p1)
        }
        let ht = null;
        arr.map((val, index) => {
            let reg = new RegExp("{" + val + "}");
            ht = html.replace(reg, va[val]);
        });
        return ht;
    }
}

exports.Template = Template;