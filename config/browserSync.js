(function() {
  'use strict';

  //var historyApiFallback = require('connect-history-api-fallback');
  //var proxyMiddleware = require('http-proxy-middleware');
  //var proxy = proxyMiddleware('/api', {target: 'http://localhost:8000/'});

  module.exports = {
    options: {
      notify: true,
      background: false,
    },
    dev: {
      options: {
        files: [
          'public/{,*/}*.{html,js,css}',
          'report/{,*/}*.json',
        ],
        server: {
          baseDir: ['report', 'public'],
        },
      },
    },
    doc: {
      options: {
        server: {
          baseDir: ['doc'],
        },
      },
    },
  };
})();
