var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./server/config/config')[env];

var HaloAPI = require('haloapi');
var h5 = new HaloAPI('344c56ed814d4418820f0c59e4f9d4da');

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config);

require('./server/config/routes')(app, config, h5);

require('./server/config/data-dispatch')(config, h5);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');