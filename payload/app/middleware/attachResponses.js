'use strict'
module.exports = function*(req, res, next) {
    let bluebird = require('bluebird');
    let fs = bluebird.promisifyAll(require('fs'));
    let path = require('path');
    
    var files = yield fs.readdirAsync('./app/responses');
    
    files.forEach(function(file){
       
       res[file.replace('.js', '')] = bluebird.coroutine(require(path.resolve(`./app/responses/${file}`)));
        
    });
    
    next();
    
}