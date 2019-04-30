let crypto = require('crypto');

class Crypt {
    static md5(item){
        let md = crypto.createHash('md5');
        let result = md.update(item).digest('hex');
        return result;
    }
}
exports.Crypt = Crypt;
