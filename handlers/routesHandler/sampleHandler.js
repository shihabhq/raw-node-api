// title: random sample handling page
// des: a page that is made to test the handling routes success

// scaffolding module
const handler = {};

handler.sampleHandler = (requestProperties, callBack) => {
  console.log("its working");
  callBack(200, {
    message: "this is a sample message",
  });
};

module.exports = handler;
