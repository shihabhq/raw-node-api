// handles the token of the user

//dependencies
const data = require("../../lib/data");
const { hashPass } = require("../../helpers/utilities");
const { createRandStr, parsedJson } = require("../../helpers/utilities");

//const { hashPass } = require("../../helpers/utilities");

// scaffolding module
const handler = {};

// handler to handle user related routes
handler.tokenHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

// private scaffolding:
handler._token = {};

handler._token.post = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hashPass(password);
      if (hashedPassword === parsedJson(userData).password) {
        let tokenId = createRandStr(20);
        let expireToken = Date.now() * 60 * 60 * 1000;
        const tokenObj = {
          phone,
          id: tokenId,
          expireToken,
        };

        //store the tokens
        data.create("tokens", tokenId, tokenObj, (err) => {
          if (!err) {
            callBack(200, tokenObj);
          } else {
            callBack(500, {
              error: "there was a problem serverside",
            });
          }
        });
      } else {
        callBack("400", {
          error: "invalid password or user was not found",
        });
      }
    });
  } else {
    callBack("400", {
      error: "You have a problem in your request",
    });
  }
};

//TODO: authentication left
handler._token.get = (requestProperties, callBack) => {
  //check whether the id is valid
  const id =
    typeof requestProperties.queryObj.id === "string" &&
    requestProperties.queryObj.id.trim().length === 20
      ? requestProperties.queryObj.id
      : false;

  if (id) {
    //look up the token
    data.read("tokens", id, (err, tData) => {
      const token = { ...parsedJson(tData) };
      if (!err && token) {
        callBack(200, token);
      } else {
        callBack(404, {
          error: "requested token not found",
        });
      }
    });
  } else {
    callBack(404, {
      error: "requested token not found1",
    });
  }
};

handler._token.put = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend
      ? requestProperties.body.id
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObj = parsedJson(tokenData);
      if (tokenObj.expireToken > Date.now()) {
        tokenObj.expireToken = Date.now() * 60 * 60 * 1000;

        //store the updated token;
        data.update("tokens", id, tokenObj, (err) => {
          if (!err) {
            callBack(200);
          } else {
            callBack(500, {
              message: "there was a server side error",
            });
          }
        });
      } else {
        callBack(400, {
          message: "token has been expired already",
        });
      }
    });
  } else {
    callBack(400, {
      message: "there was a problem in your request",
    });
  }
};
handler._token.delete = (requestProperties, callBack) => {
  //check whether the token is valid
  const id =
    typeof requestProperties.queryObj.id === "string" &&
    requestProperties.queryObj.id.trim().length === 20
      ? requestProperties.queryObj.id
      : false;
  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callBack(200, {
              message: "token was successfully deleted",
            });
          } else {
            callBack(500, {
              error: "there was an error while deleting token",
            });
          }
        });
      } else {
        callBack(500, {
          error: "error on the server side or user doesn`t exist",
        });
      }
    });
  } else {
    callBack(400, {
      error: "there was an error while deleting the user",
    });
  }
};

handler._token.verify = (id, phone, callBack) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parsedJson(tokenData).phone === phone &&
        parsedJson(tokenData).expireToken > Date.now()
      ) {
        callBack(true);
      } else {
        callBack(false);
      }
    } else {
      callBack(false);
    }
  });
};

module.exports = handler;
