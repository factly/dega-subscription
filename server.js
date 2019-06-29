'use strict';
var logger = require('logger').createLogger();
var app = require('./index');
var http = require('http');


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8081);
server.on('listening', function () {
    logger.info('Server listening on http://localhost:'+this.address().port);
});
