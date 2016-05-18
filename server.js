'use strict';

/**
 * Module dependencies.
 */

require("babel/register");

var app = require('./config/lib/app');
var server = app.start();

