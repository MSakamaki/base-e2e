'use strict';
/**
 * すべてのテストを空振りさせます。
 **/

var conf = require('./default.js');
var Q = require('q');

conf.config.originalConfig = {
  TYPE: 'checkspec',
  Initialize: function() {
    return Q.Promise(function(resolve, reject, notify) {
      console.log(' == SPECの確認 == ');
      it = xit;
      resolve();
    });
  },
};

conf.config.specs = [
  '../.tmp/**/*.spec.js',
];

module.exports = conf;
