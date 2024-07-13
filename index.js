// title:Uptime monitoring App
// creator:Shihab
// date:July 2,2024

// dependencise:
const http = require("http");
const { handleRequest } = require("./helpers/handleRequest");
const environment = require('./helpers/environments')
const data = require('./lib/data')
// testing the data


// app object - module Scaffolding
const app = {};

app.handleRequest = handleRequest;

// establishing external server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(environment.port, () => {
    console.log("listening from the code " + environment.port);
  });
};


// managing response of that server
app.createServer();
