// dependencies
const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

// base dir of the data folder

lib.basedir = path.join(`${__dirname}/../.data/`);

// write data to file
lib.create = function (dir, file, data, callback) {
  // open the file
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // converting the data to string
        const stringData = JSON.stringify(data)
        //write data to file and close it
        fs.writeFile(fileDescriptor,stringData,(err2)=>{
          if(!err2){
            fs.close(fileDescriptor,(error)=>{
              if(!error){
                callback(false)
              }else{
                callback('error closing the new file')
              }
            })
          }else{
            callback('Error writing to new file')
          }
        })
      } else {
        callback("could not open the file, file may already exists");
      }
    }
  );
};

// read data from file,
lib.read = (dir,file,callback)=>{
  fs.readFile(lib.basedir + dir + "/" + file + ".json",'utf-8',(err,data)=>{
    callback(err,data)
  })
}
// update existing file
lib.update = (dir,file,data,callback)=>{
  // file open for writing
  fs.open(lib.basedir + dir + "/" + file + ".json",'r+',(err,fileDescriptor)=>{
    if(!err && fileDescriptor){
      // convert the data to string
      const stringData = JSON.stringify(data)

      // truncate the file
      fs.ftruncate(fileDescriptor,(err)=>{
        if(!err){
          // write file and close it:
          fs.writeFile(fileDescriptor,stringData,(err)=>{
            if(!err){
              fs.close(fileDescriptor,(err)=>{
                if(!err){
                  callback(false)
                }else{
                  callback('error closing file')
                }
              })
            }else{
              callback('error writing to file')
            }
          })
        }else{
          callback('error truncating file')
        }
      })
    }else{
      callback('error updating file. it may not exist')
    }
  })
}
// delete the file
lib.delete = (dir,file,callback)=>{
  // unlink
  fs.unlink(lib.basedir + dir + "/" + file + ".json",(err)=>{
    if(!err){
      callback(false)
    }else{
      callback('error deleting file')
    }
  })
}

//@TODOlist all the items in a directory
lib.check = ()=>{
  
}
// export
module.exports = lib;