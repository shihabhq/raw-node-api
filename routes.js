// dependencies
const { sampleHandler } = require("./handlers/routesHandler/sampleHandler");
const { userHandler } = require("./handlers/routesHandler/userHanlder");
const {tokenHandler} = require('./handlers/routesHandler/tokenHandler')

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token:tokenHandler,
};

module.exports = routes;
