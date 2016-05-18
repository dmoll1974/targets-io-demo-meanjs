'use strict';

/**
 * Module dependencies.
 */

require("babel-core/register");

var app = require('./config/lib/app');
var server = app.start();

