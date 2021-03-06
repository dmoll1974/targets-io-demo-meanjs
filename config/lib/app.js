'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed'),
  winston = require('winston');




function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);

  });
};

module.exports.start = function start(callback) {
  var _this = this;

  //Better logging
  winston.remove(winston.transports.Console);
  //if (config.isDevelopment) {
  //  // only log to console in development environment
  //  winston.add(winston.transports.Console, {
  //    timestamp: true,
  //    colorize: !config.isProduction,
  //    level: config.logLevel
  //  });
  //}

  if (config.graylog.host !== undefined) {

    console.log ("graylog host: " + config.graylog.host + ':' + config.graylog.port );

    winston.add(require('winston-graylog2'), {
      name: 'Graylog',
      graylog: {
        servers: [{host: config.graylog.host, port: config.graylog.port}],
        facility: "MEAN"
      },
      //level: 'INFO'
      /*,
       staticMeta: {environment: config.environment, source: os.hostname()}*/
    });
  }else{

    console.log ("No graylog host:port provided " );
  }

  winston.info('Connected to Graylog!');


  _this.init(function (app, db, config) {


    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.meanjs.version));
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
      console.log('--');

      if (callback) callback(app, db, config);
    });

  });

};
