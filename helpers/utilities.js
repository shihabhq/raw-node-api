// necessary utilities
const crypto = require('crypto')
const environments = require('./environments')


//scaffolding module
const utilities = {};

utilities.parsedJson = (jsonStr) => {
  let output;
  try {
    output = JSON.parse(jsonStr);
  } catch(e) {
    console.log('Failed to parse:', e.message); // Add this log
    output = {};
  }
  return output;
}
utilities.hashPass = (password) =>{
   if (typeof(password) === 'string' && password.length>0){
    const hash = crypto
      .createHmac('sha256',environments.secretKey)
      .update(password)
      .digest('hex')
      return hash
  }else{
    return false
  }
 
}


module.exports = utilities;
