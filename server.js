const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors());

// Default middlewares
server.use(middlewares);

// Route for JSON Server
server.use(router);

module.exports = server;