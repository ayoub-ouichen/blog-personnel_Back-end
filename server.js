const http = require('http');
const app = require('./index');
const server = http.createServer(app);
const port = 6523;
server.listen(port);