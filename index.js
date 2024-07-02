// title:Uptime monitoring App
// creator:Shihab
// date:July 2,2024

// dependencise:
const http = require("http");
const {handleRequest} = require('./helpers/handleRequest')

// app object - module Scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

// establishing external server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(app.config.port, () => {
    console.log("listening from the code " + app.config.port);
  });
};

app.handleRequest = handleRequest;

// managing response of that server
app.createServer(3000)