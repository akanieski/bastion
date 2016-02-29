'use strict'
/* global bastion */
/* global global */
/* global process */
var colors = require('colors');
var path = require('path');
var packageInfo = require(path.join(process.cwd(), 'package.json'))

console.log('                                                     ');
console.log('                                                     ');
console.log('                           |=>                       ');
console.log('                           |                         ');
console.log('                           X                         ');
console.log('                 |=>      / \\      |=>              ');
console.log('                 |      =======    |                 ');
console.log('                 X      | .:  |    X                 ');
console.log('                / \\     | O   |   / \\              ');
console.log('               =====    |:  . |  =====               ');
console.log('               |.: |__| .   : |__| :.|               ');
console.log('               |  :|. :  ...   : |.  |               ');
console.log('           __   __W| .    .  ||| .      :|W__  --    ');
console.log('     -- __  W  WWWW______"""______WWWW   W -----  -- ');
console.log(' -  -     ___  ---    ____     ____----       --__  -');
console.log('    --__    --    --__     -___        __-   _       ');
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('     ____   ___    _____ ______ ____ ____   _   __   '.cyan);
console.log('    / __ ) /   |  / ___//_  __//  _// __ \\ / | / /  '.cyan);
console.log('   / __  |/ /| |  \\__ \\  / /   / / / / / //  |/ /  '.cyan); 
console.log('  / /_/ // ___ | ___/ / / /  _/ / / /_/ // /|  /     '.cyan);
console.log(' /_____//_/  |_|/____/ /_/  /___/ \\____//_/ |_/     '.cyan);
console.log('                                                     '.cyan);  
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('                                                     ');
console.log('Bastion server is starting up ..                     ');
console.log('                                                     ');


var bluebird = require("bluebird");
var express = require("express");
var _ = require("lodash");
var app = express();
var fs = require("fs");
var path = require("path");
var cwd = path.resolve(process.cwd());
var BastionApp = require(path.join(cwd, 'app/index'));
app.listenAsync = bluebird.promisify(app.listen);

bluebird.coroutine(function*(){
    /**
     * Setting up global for bastion
     */
    global.bastion = new BastionApp();
    
    let port = process.env.PORT || bastion.settings.port || 3000;
    
    /**
     * Load up middleware and routes
     */
    var middlewareConfig = require(path.join(cwd, 'config/middleware.js'));
    middlewareConfig.setup.forEach(function(func){
        if (func.indexOf('*') > -1) { 
            app.use(middlewareConfig[func.replace('*','')]);
        } else if (func == 'router') {
            bastion.routes = require('./config/routes');
            Object.keys(bastion.routes).forEach(function(key){
                if (_.isString(bastion.routes[key])) {
                    let controllerPath = bastion.routes[key].split('.')[0];
                    let controllerAction = bastion.routes[key].split('.')[1];
                    let routeMethod = key.split(' ')[0];
                    let routePath = key.split(' ')[1];
                    let actionConfig = require(`./app/controllers/${controllerPath}`)[controllerAction];
                    let actionFunc = actionConfig.action;
                    app[routeMethod.toLowerCase()](routePath, function(req, res, next){
                       req.config = actionConfig;
                       
                       // block requests coming from insecure sources
                       if (actionConfig.secure && !req.secure) {
                           res.status(401).send();
                           return;
                       }
                       
                       next();
                    });
                    app[routeMethod.toLowerCase()](routePath, bluebird.coroutine(actionFunc));
                } 
            });
        } else { 
            app.use(bluebird.coroutine(middlewareConfig[func]));
        }
    });

    
    
    var server = yield app.listenAsync(port);
    
    console.log(`Server listening on port ${port}`);

})();