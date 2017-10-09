// secretSanta.js ~ Copyright 2017 Manchester Makerspace ~ MIT License

var route = {
    santa: function(){
        return function(req, res){
            if(req.body){
                res.status(200).send('OK');res.end();             // ACK notification
                console.log(JSON.stringify(req.body, null, 4));
            }
        };
    }
};

var serve = {                                                // handles express server setup
    express: require('express'),                             // server framework library
    parse: require('body-parser'),                           // middleware to parse JSON bodies
    theSite: function(){                                     // method call to serve site
        serve.app = serve.express();                         // create famework object
        var http = require('http').Server(serve.app);        // http server for express framework
        serve.app.use(serve.parse.json());                   // support JSON bodies
        serve.app.use(serve.parse.urlencoded({extended: true})); // idk, something was broken maybe this fixed it
        serve.router = serve.express.Router();               // create express router object to add routing events to
        serve.router.post('/santa', route.santa());          // Don't ask
        serve.app.use(serve.router);                         // get express to user the routes we set
        return http;
    }
};

var http = serve.theSite();
http.listen(process.env.PORT);
// slack.init();
