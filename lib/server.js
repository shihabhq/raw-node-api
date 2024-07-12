// title:Server library
// creator:Shihab
// date:July 12,2024

// dependencise:
const http = require("http");
const { handleRequest } = require("../helpers/handleRequest");

// server object - module Scaffolding
const server = {};

server.config = {
  port: 3000,
};

server.handleRequest = handleRequest;

// establishing external server
server.createServer = () => {
  const createServerVar = http.createServer(server.handleRequest);
  createServerVar.listen(server.config.port, () => {
    console.log("listening from the code " + server.config.port);
  });
};

server.init = () => {
  server.createServer();
};

//export server
module.exports = server;
