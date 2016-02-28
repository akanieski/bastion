#!/usr/bin/env node

/* global process */
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
var _ = require('lodash');
var info = require('../package.json');
  
process.argv = _.map(process.argv, function(arg) {
  return (arg === '-V') ? '-v' : arg;
});

program
  .version('Bastion v' + info.version, '-v, --version')
  .command('version')
  .description('')
  .action(program.versionInformation);
  
program
  .command('new')
  .description('Generates a new bastion project')
  .action(function(){
     console.log('New'); 
  });
  
  
program.parse(process.argv);