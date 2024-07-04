// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {parsedJson} = require('../helpers/utilities')
const {
  notFoundHandler,
} = require("../handlers/routesHandler/notfoundHandler");


// scafolding:
const handle = {};

handle.handleRequest = (req, res) => {
  // handling request
  // getting the parsedURl
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  //   trimming the path
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //   assuring that the method will always be lowercase
  const method = req.method.toLowerCase();
  //   getting the query object
  const queryObj = parsedUrl.query;
  //   getting the headers for that url
  const headersObj = req.headers;
  const decoder = new StringDecoder("utf-8");
  // all the necessary varaibles in one object
  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryObj,
    headersObj,
  };

  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperties.body = parsedJson(realData)

    chosenHandler(requestProperties, (statuscode, payload) => {
      statuscode = typeof statuscode === "number" ? statuscode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadStr = JSON.stringify(payload);

      //return the response
      //setting header
      res.setHeader("Content-Type", "application/json");

      res.writeHead(statuscode);
      res.end(payloadStr);
    });
  });
};

module.exports = handle;
