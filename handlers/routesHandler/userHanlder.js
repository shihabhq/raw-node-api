//dependencies
const data = require("../../lib/data");
const { hashPass } = require("../../helpers/utilities");
const { parsedJson } = require("../../helpers/utilities");

// scaffolding module
const handler = {};

// handler to handle user related routes
handler.userHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

// private scaffolding:
handler._user = {};

handler._user.post = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const agreement =
    typeof requestProperties.body.agreement === "boolean" &&
    requestProperties.body.agreement
      ? true
      : false;

  if (firstName && lastName && phone && password && agreement) {
    //check whether the user already exists
    data.read("users", phone, (err) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hashPass(password),
          agreement,
        };
        //store the user to db
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callBack(200, {
              message: "user created successfully",
            });
          } else {
            callBack(500, { error: "could not create user" });
          }
        });
      } else {
        callBack(500, {
          error: "there was an error in server side. file may already exist",
        });
      }
    });
  } else {
    callBack(400, {
      error: `There was a problem in creating your request`,
    });
  }
};

//TODO: authentication left
handler._user.get = (requestProperties, callBack) => {
  //check whether the phone number is valid
  const phone =
    typeof requestProperties.queryObj.phone === "string" &&
    requestProperties.queryObj.phone.trim().length === 11
      ? requestProperties.queryObj.phone
      : false;

  if (phone) {
    //look up the user
    data.read("users", phone, (err, u) => {
      const user = { ...parsedJson(u) };
      if (!err && user) {
        delete user.password;
        callBack(200, user);
      } else {
        callBack(404, {
          error: "requested user not found",
        });
      }
    });
  } else {
    callBack(404, {
      error: "requested user not found",
    });
  }
};

handler._user.put = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      //check if the file of this user esists or not
      data.read("users", phone, (err, uData) => {
        const userData = { ...parsedJson(uData) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hashPass(password);
          }
          //update database
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callBack(200, {
                error: "User updated successfully",
              });
            } else {
              callBack(400, {
                message: "error while updating user",
              });
            }
          });
        } else {
          callBack(400, {
            error: "user not found",
          });
        }
      });
    } else {
      callBack(400, {
        error: "invalid credentials2",
      });
    }
  } else {
    console.log(requestProperties);
    callBack(400, {
      error: "invalid credentials1",
    });
  }
};
handler._user.delete = (requestProperties, callBack) => {
  //check whether the phone number is valid
  const phone =
    typeof requestProperties.queryObj.phone === "string" &&
    requestProperties.queryObj.phone.trim().length === 11
      ? requestProperties.queryObj.phone
      : false;
  if(phone){
    data.read('users',phone,(err,userData)=>{
     if(!err && userData){
      data.delete('users',phone,(err)=>{
        if(!err){
          callBack(200,{
            'message':'user was successfully deleted'
          })
        }else{
          callBack(500,{
            'error':'there was an error while deleting user'
          })
        }
      })
     }else{
      callBack(500,{
        'error':'error on the server side or user doesn`t exist'
      })
     } 
    })
  }else{
    callBack(400,{
      "error":"there was an error while deleting the user"
    })
  }
};

module.exports = handler;
