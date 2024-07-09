//dependencies
const data = require("../../lib/data");
const { hashPass } = require("../../helpers/utilities");
const { parsedJson } = require("../../helpers/utilities");
const tokenHanlder = require("./tokenHandler");

// scaffolding module
const handler = {};

// handler to handle user related routes
handler.checkHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

// private scaffolding:
handler._check = {};

handler._check.post = (requestProperties, callBack) => {
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > 0
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.length > -1
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timoutSeconds =
    typeof requestProperties.body.timoutSeconds === "number" &&
    requestProperties.body.timoutSeconds % 1 === 0 &&
    requestProperties.body.timoutSeconds >= 1 &&
    requestProperties.body.timoutSeconds <= 5
      ? requestProperties.body.timoutSeconds
      : false;

  if (protocol && url && method && successCodes && timoutSeconds) {
    let token =
      typeof requestProperties.headersObj.token === "string"
        ? requestProperties.headersObj.token
        : false;
    //lookup the user phone by checking the token
  } else {
    callBack(400, {
      message: "there was a problem in your request",
    });
  }
};

//TODO: authentication left
handler._check.get = (requestProperties, callBack) => {};

handler._check.put = (requestProperties, callBack) => {};
handler._check.delete = (requestProperties, callBack) => {};

module.exports = handler;
