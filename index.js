// title:Uptime monitoring App
// creator:Shihab
// date:July 2,2024

// dependencise:
const server = require("./lib/server");
const workers = require("./lib/workers");

// app object - module Scaffolding
const app = {};

app.init = () => {
  //start the server
  server.init();
  //start the workers
  workers.init();
};

app.init()
