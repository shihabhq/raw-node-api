// title:utilities file
// creator:Shihab
// date:July 12,2024

// necessary utilities
const crypto = require("crypto");
const environments = require("./environments");

//scaffolding module
const utilities = {};

utilities.parsedJson = (jsonStr) => {
  let output;
  try {
    output = JSON.parse(jsonStr);
  } catch (e) {
    console.log("Failed to parse:", e.message); // Add this log
    output = {};
  }
  return output;
};
utilities.hashPass = (password) => {
  if (typeof password === "string" && password.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(password)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//create random string
utilities.createRandStr = (strlen) => {
  let len = typeof strlen === "number" && strlen > 0 ? strlen : false;

  if (len) {
    let possibleCh = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= len; i++) {
      let randomCh = possibleCh.charAt(Math.floor(Math.random() * len));
      output += randomCh;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
