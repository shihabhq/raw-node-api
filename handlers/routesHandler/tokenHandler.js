// handles the token of the user

//dependencies
const data = require("../../lib/data");
const { hashPass } = require("../../helpers/utilities");
const { createRandStr,parsedJson } = require("../../helpers/utilities");

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
      console.log('hi')
      if (hashedPassword === parsedJson(userData).password) {
        let tokenId = createRandStr(20);
        let expireToken = Date.now() * 60 * 60 * 1000;
        const tokenObj = {
          phone,
          'id':tokenId,
          expireToken,
        };

        //store the tokens
        data.create('tokens',tokenId,tokenObj,(err)=>{
            if(!err){
                callBack(200,tokenObj)
            }else{
                callBack(500,{
                    error:'there was a problem serverside'
                })
            }
        })
      } else {
        callBack("400", {
          error: "invalid password",
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

handler._token.put = (requestProperties, callBack) => {};
handler._token.delete = (requestProperties, callBack) => {};

module.exports = handler;
