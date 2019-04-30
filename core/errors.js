class Errors {
    static report(...args){
        const err = new Error(args[0]);
        console.error(err.stack);
    }
}
exports.Errors = Errors;