(function() {
  'use strict';

  module.exports = {
    options: {
      keepAlive: true, // If false, the grunt process stops when the test fails.
      noColor: false, // If true, protractor will not use colors in its output.
    },
    functional: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: 'protractor.conf/functional.js',
      },
    },
    chk: {
      options:{
        configFile: 'protractor.conf/checkspec.js',
      },
    },
  };
})();
