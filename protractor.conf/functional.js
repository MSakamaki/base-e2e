'use strict';

var conf = require('./default.js');
var Q = require('q');

conf.config.originalConfig = {
  TYPE: 'functional',
  Initialize: function() {
    return Q.Promise(function(resolve, reject, notify) {
      console.log('functionalテスト、はっじまっるよ〜〜〜〜！');
      resolve();
    });
  },
};

conf.config.specs = [
  '../.tmp/functional/**/*.spec.js',
];

module.exports = conf;
