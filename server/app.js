/**
 * restES gets query responses from simple routes 
 * Gets its data from ElasticSearch
 */

require('./response');

// Expressjs include
var express = require('express');

// Express Application declaration
var app = express();

// Conf loading
var conf = require('./conf/conf.json');
var packageInfo = require('./package.json');

// Logger
var logger = require('./logger.js');

// Routing module
var routes = require('./routes');

// Set the ElasticSearch Client
var elasticsearch = require('elasticsearch');
var es = elasticsearch.Client(conf.elasticsearch);

//SomkeTest module loading
var SmokeTest = require ('./app/smokeTest');

app.use(express.bodyParser());
app.use(app.router);
app.use(express.json());

// Allow CORS
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Application routes
routes(app, es, conf.elasticsearch.index, packageInfo);

// Disable Express header
app.disable('x-powered-by');

// Listening port defined in conf file
app.listen(conf.port);

