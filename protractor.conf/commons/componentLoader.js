
(function() {
  'use strict';
  var Q = require('q');
  var fs = require('fs');
  var path = require('path');
  var _ = require('lodash');
  function camelCase(input) {
    return input.toLowerCase().replace(/\.(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }
  /**
   * ページオブジェクトの自動ロードとGlobal.e2eTestHelperへの登録を行う
   * @class ComponentLoader
   * @constructor
   */
  function componentLoader() {
    var base = './.tmp/components/';
    var PageObject = {};
    global.e2eTestHelper = global.e2eTestHelper || {};
    global.e2eTestHelper.po = {};

    /**
     * PAGE OBJECT LOAD
    **/
    return Q.Promise(function(_finish, _exeption, notify) {

      fs.readdir(base, function(err, subSystems) {
        if (err) {
          _exeption(err);
        }

        var tasks = [];
        subSystems.forEach(function(subsystem) {
          //set process
          tasks.push(Q.Promise(function(resolve, reject, notify) {//(function(_subSystem) {
            fs.readdir(base + subsystem + '/', function(err, files) {
              if (err) _exeption(err);
              return resolve({subsystem: subsystem, files: files});
            });
          }));
        });

        return Q.all(tasks)
          .then(function(components) {
            var loadComponent = [];
            components.forEach(function(component) {
              component.files.filter(function(file) {
                return fs.lstatSync(base + component.subsystem + '/' + file).isDirectory();
              }).forEach(function(file) {
                loadComponent.push(Q.Promise(function(loadfix, componentReject, notify) {//(function(_subSystem) {
                  fs.readdir(base + component.subsystem + '/', function(err, files) {
                    if (err) componentReject(err);
                    var Component = require(path.join(__dirname, '../../', '.tmp/components', component.subsystem, file, file + '.po'));
                    if (_.isFunction(Component)) {
                      Component = new Component();
                    }

                    return loadfix({ name: file, po:Component, sub: component.subsystem});
                  });
                }));
              });
            });

            return Q.all(loadComponent).then(function(pos) {
              pos.forEach(function(_po) {
                global.e2eTestHelper.po[_po.sub] = global.e2eTestHelper.po[_po.sub] || {};
                global.e2eTestHelper.po[_po.sub][_po.name] = _po.po;
              });

              _finish();
            });
          });
      });
    }).then(function() {
      console.log(' == PAGE OBJECT LOAD FINISH! == ');
    }).delay(1000);
  }

  module.exports = componentLoader;
})();
