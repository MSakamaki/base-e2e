(function() {
  'use strict';
  var path = require('path');
  function camelCase(input) {
    return input.toLowerCase().replace(/\.js$/, '').replace(/\.(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }

  function generateInjectorObject(type) {
    return {
      options: {
        transform: function(filePath) {
          var fileName = path.basename(filePath);
          var prefix = fileName.replace('.' + type + '.js', '');
          var camelCaseName = camelCase(fileName);
          filePath = filePath.replace('/public/', '');
          return 'import ' + camelCaseName + ' from \'' + filePath + '\';\n' +
                 'app.' + type + '(\'' + camelCaseName + '\', ' + camelCaseName + ');';
        },

        starttag: '/* ' + type + ':start */',
        endtag:   '/* ' + type + ':end */',
      },
      files: {
        'public/app.js': [
            'public/app/**/*.' + type + '.js',
        ],
      },
    };
  }

  /**
   * public/index.html用のInjector
   **/
  module.exports = {
    options: { },
    /**
     * public/app/直下にあるコンポーネントを自動Injectする。
     *
     * ルール: public/app/[Class名]/[Class名].controller.js である事
     **/
    controller: generateInjectorObject('controller'),
    /**
     * public/app/直下にあるfactoryコンポーネントを自動Injectする。
     *
     * ルール: public/app/[Class名]/[Class名].factory.js である事
     **/
    factory: generateInjectorObject('factory'),
  };
})();
