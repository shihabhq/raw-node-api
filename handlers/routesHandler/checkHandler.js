//dependencies
const data = require("../../lib/data");
const { createRandStr } = require("../../helpers/utilities");
const { parsedJson } = require("../../helpers/utilities");
const tokenHanlder = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

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
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.length > -1
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
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

    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parsedJson(tokenData).phone;

        //lookup the userData
        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            tokenHanlder._token.verify(token, userPhone, (tokenValid) => {
              if (tokenValid) {
                let userObj = parsedJson(userData);

                let userChecks =
                  typeof userObj.checks === "object" &&
                  userObj.checks instanceof Array
                    ? userObj.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandStr(20);
                  let checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timoutSeconds,
                  };

                  //save the object
                  data.create("checks", checkId, checkObj, (err) => {
                    if (!err) {
                      //add checkId to the user's object
                      userObj.checks = userChecks;
                      userObj.checks.push(checkId);

                      // save the new user
                      data.update("users", userPhone, userObj, (err) => {
                        if (!err) {
                          //return the data
                          callBack(200, checkObj);
                        } else {
                          callBack(500, {
                            error: "Serverside problem occured",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        error: "Serverside problem occured1",
                      });
                    }
                  });
                } else {
                  callBack(401, {
                    error: "User has already been registered!",
                  });
                }
              } else {
                callBack(403, {
                  error: "Token is not valid",
                });
              }
            });
          } else {
            callBack(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callBack(403, {
          error: "authentication Problem",
        });
      }
    });
  } else {
    callBack(400, {
      message: "there was a problem in your request",
    });
  }
};

//TODO: authentication left
handler._check.get = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.queryObj.id === "string" &&
    requestProperties.queryObj.id.trim().length === 20
      ? requestProperties.queryObj.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        let token =
          typeof requestProperties.headersObj.token === "string"
            ? requestProperties.headersObj.token
            : false;

        tokenHanlder._token.verify(
          token,
          parsedJson(checkData).userPhone,
          (tokenValid) => {
            if (tokenValid) {
              callBack(200, parsedJson(checkData));
            } else {
              callBack(403, {
                message: "Authentication Problem occured!",
              });
            }
          }
        );
      } else {
        callBack(500, {
          message: "You have a problem in your request!",
        });
      }
    });
  } else {
    callBack(404, {
      message: "You have a problem in your request!",
    });
  }
};

handler._check.put = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.length > -1
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
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

  if (id) {
    if (protocol || url || method || successCodes || timoutSeconds) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          const checkObj = parsedJson(checkData);
          let token =
            typeof requestProperties.headersObj.token === "string"
              ? requestProperties.headersObj.token
              : false;

          tokenHanlder._token.verify(
            token,
            checkObj.userPhone,
            (tokenValid) => {
              if (tokenValid) {
                //update the checkObject
                checkObj.protocol = protocol ? protocol : checkObj.protocol;
                checkObj.url = url ? url : checkObj.url;
                checkObj.method = method ? method : checkObj.method;
                checkObj.successCodes = successCodes
                  ? successCodes
                  : checkObj.successCodes;
                checkObj.timoutSeconds = timoutSeconds
                  ? timoutSeconds
                  : checkObj.timoutSeconds;

                //store the checkobject
                data.update("checks", id, checkObj, (err) => {
                  if (!err) {
                    callBack(200, checkObj);
                  } else {
                    callBack(500, {
                      message: "Serverside Problem occured Problem occured!",
                    });
                  }
                });
              } else {
                callBack(403, {
                  message: "Authentication Problem occured!",
                });
              }
            }
          );
        } else {
          callBack(500, {
            message: "there was a serverside problem",
          });
        }
      });
    } else {
      callBack(400, {
        message: "not enough information is given",
      });
    }
  } else {
    callBack(400, {
      message: "there was a problem in your request1",
    });
  }
};
handler._check.delete = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.queryObj.id === "string" &&
    requestProperties.queryObj.id.trim().length === 20
      ? requestProperties.queryObj.id
      : false;

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const checkObj = parsedJson(checkData);
        let token =
          typeof requestProperties.headersObj.token === "string"
            ? requestProperties.headersObj.token
            : false;

        tokenHanlder._token.verify(token, checkObj.userPhone, (tokenValid) => {
          if (tokenValid) {
            //delete the check data
            data.delete("checks", id, (err) => {
              if (!err) {
                data.read("users", checkObj.userPhone, (err, userData) => {
                  if (!err && userData) {
                    let userObj = parsedJson(userData);
                    let userChecks =
                      typeof userObj.checks === "object" &&
                      userObj.checks instanceof Array
                        ? userObj.checks
                        : [];

                    //remove the deleted checkId from the user checks
                    let checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);

                      //resave the data
                      userObj.checks = userChecks;
                      //update the user data
                      data.update("users", userObj.phone, userObj, (err) => {
                        if (!err) {
                          callBack(200);
                        } else {
                          callBack(500, {
                            message: "serverside error occured!",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        message: "check Id was not found in user!",
                      });
                    }
                  } else {
                    callBack(500, {
                      message: "serverside error occured!",
                    });
                  }
                });
              } else {
                callBack(500, {
                  message: "Serverside problem occured!",
                });
              }
            });
          } else {
            callBack(403, {
              message: "Authentication Problem occured!",
            });
          }
        });
      } else {
        callBack(500, {
          message: "You have a problem in your request!",
        });
      }
    });
  } else {
    callBack(404, {
      message: "You have a problem in your request1!",
    });
  }
};

module.exports = handler;
