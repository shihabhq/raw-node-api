// title:Workers library
// creator:Shihab
// date:July 12,2024

// dependencise:
const data = require('./data')

// worker object - module Scaffolding
const worker = {};

//lookup all the checks

//@TODO 
worker.gatherAllChecks = ()=>{
    //get all the checks
}


//timer to execute the worker process
worker.loop = ()=>{
    setInterval(() => {
        worker.gatherAllChecks()
    }, 1000);
}

worker.init = () => {
  //execute all the checks
  worker.gatherAllChecks()

  //call the loops so that checks continue

  worker.loop()
};

//export worker
module.exports = worker;
