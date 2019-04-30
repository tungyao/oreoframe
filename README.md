# This is OreoFrame;
I recommend using the following directory structure <br>
***
|dir<br>
|--src<br>
|----controller<br>
|------route.js<br>
|--app.js<br>
|--config<br>
|----default.json<br>
***

## app.js
``` 
const {Server} = require("oreoframe");
const route = require("./src/controller/route");
const ser = new Server(route);
ser.init().noredis();
ser.start();
```
## route.js
```
const {Route} = require("oreoframe");
const index = require("./IndexController"); //this is 
Route.Route.get("/",new index());
```
## IndexController
```
const Controller = require("oreoframe").Controller;

class IndexController extends Controller{
    args() {
        super.args();
    }

    view(){
        return "index.html"
    }
}

module.exports = IndexController;
```

