require('dotenv').config();

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

var routes = require('./api/routes/visionRoutes'); //importing route
routes(app); //register the route

var routes = require('./api/routes/textRoutes'); //importing route
routes(app); //register the route

var routes = require('./api/routes/faceRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Second EYE RESTful API server started on: ' + port);
