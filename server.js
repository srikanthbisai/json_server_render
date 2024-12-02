const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);

// Custom route to handle mutations
server.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      // Read current data
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      
      // Perform operation based on route and method
      switch(req.method) {
        case 'POST':
          const newItem = req.body;
          const collection = req.path.split('/')[1];
          newItem.id = Date.now().toString();
          data[collection].push(newItem);
          break;
        case 'DELETE':
          const id = req.path.split('/').pop();
          const collectionName = req.path.split('/')[1];
          data[collectionName] = data[collectionName].filter(item => item.id !== id);
          break;
      }

      // Write back to file
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      return res.status(500).json({ error: 'Unable to modify data' });
    }
  }
  next();
});

server.use(router);

module.exports = server;