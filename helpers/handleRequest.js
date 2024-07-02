// dependencies
const { parse } = require("path");
const url = require("url");
const {StringDecoder} = require('string_decoder')

// scafolding:
const handle = {}

handle.handleRequest = (req, res) => {
    // handling request
    // getting the parsedURl
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
  
    //   trimming the path
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    //   assuring that the method will always be lowercase
    const method = req.method.toLowerCase();
    //   getting the query object
    const queryObj = parsedUrl.query;
    //   getting the headers for that url
    const headersObj = req.headers;
    const decoder = new StringDecoder('utf-8')
    let realData = '';
  
    req.on('data',(buffer)=>{
      realData += decoder.write(buffer)
    })
    req.on('end',()=>{
      realData += decoder.end()
      console.log(realData)
      res.end('hello world')
    })
  
  };
  
  module.exports = handle;
  