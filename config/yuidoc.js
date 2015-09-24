
(function() {
  'use strict';

  module.exports = {
    compile: {
      name: 'grunt config',
      description: 'grunt config',
      version: '1',
      url: '/',
      options: {
        paths: ['protractor.conf'],
        outdir: 'doc/protractor',
        parseOnly: false,
      },
    },
  };
})();

