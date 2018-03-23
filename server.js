const http = require('http');
const init = require('./index.js');
const port = 3000;

const requestHandler = (request, response) => {
  init();

  response.end('Checkot firebase for app data');
}

const server = http.createServer(requestHandler)

server.listen(process.env.port || port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});