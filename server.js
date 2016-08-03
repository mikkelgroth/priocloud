var StaticServer = require('static-server');
var server = new StaticServer({
    rootPath: './app',
    port: 5000
});
 
server.start(function () {
    console.log('Server listening to', server.port);
});
