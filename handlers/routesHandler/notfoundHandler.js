// title: not found Handler
// des: not found handling: 404 not found

// scaffolding module
const handler = {};

handler.notFoundHandler = (requestProperties, callBack) => {
  callBack(404, {
    message: "requested URL is not found",
  });
};

module.exports = handler;
