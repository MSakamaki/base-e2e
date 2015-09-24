
(function() {
  'use strict';

  module.exports = {
    src: 'cenario/**/*.js',
    options: {
      config: '.jscsrc',
      esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
      verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
      requireCurlyBraces: [ ],
      fix:true,
    },
    functional:{
      src: 'cenario/functional/**/*.js',
    },
    others:{
      src:[
        'Gruntfile.js',
        'public/app.js',
        'public/app/**/*.js',
        'public/config/**/*.js',
        'config/**/*.js',
        'protractor.conf/**/*.js',
        'components/**/*.js',
      ],
    },
  };
})();
