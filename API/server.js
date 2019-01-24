// Check config file
const dotenv = require('dotenv').config();
if (dotenv.error) {
    throw dotenv.error;
}


// Load modules
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    morgan = require('morgan'),
    bodyParser = require('body-parser');


// Config API
if (process.env.NODE_ENV !== 'test')
    app.use(morgan('combined'))
    
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));


// Load routes & 404
var routes = require('./api/routes/visionRoutes'); //importing route
routes(app); //register the route

var routes = require('./api/routes/textRoutes'); //importing route
routes(app); //register the route

var routes = require('./api/routes/faceRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});


// Start API
app.listen(port);
console.log('Second EYE RESTful API server started on: ' + port);


// Export app for testings
module.exports = app;
