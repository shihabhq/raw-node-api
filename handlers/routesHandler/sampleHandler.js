// scaffolding module
const handler = {};

handler.sampleHandler = (requestProperties, callBack) => {
  console.log("its working");
  callBack(200, {
    message: "this is a sample message",
  });
};

module.exports = handler;
