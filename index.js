
const server = require("./core/server");

// let options = process.argv0;
// console.log(options);
module.exports = {
    Server:server.Server,
    Controller:server.Controller,
    Errors:server.Errors,
    Midware:server.Midware,
    Route:server.Route
};