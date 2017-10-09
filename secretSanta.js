// secretSanta.js ~ Copyright 2017 Manchester Makerspace ~ MIT License

var slack = {
    webhook: require('@slack/client').IncomingWebhook,   // url to slack intergration called "webhook" can post to any channel as a "bot"
    init: function(webhook_URL){
        properties = {
            username: 'Santa',
            channel: 'santas_little_helper',
            iconEmoji: ':santa:'
        };
        slack.santa = new slack.webhook(webhook_URL, properties);
    },
    sendAsSanta: function(msg){
        slack.santa.webhook.send(msg);
    }
};

var route = {
    santa: function(){
        return function(req, res){
            if(req.body){
                res.status(200).send('Santa is comming!');res.end();             // ACK notification
                // console.log(JSON.stringify(req.body, null, 4));
                console.log(req.body.text);
                slack.sendAsSanta(req.body.text);
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
slack.init(process.env.SLACK_WEBHOOK_URL);
