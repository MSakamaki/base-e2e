(function() {
  'use strict';

  var fs = require('fs');
  var fsEx = require('fs.extra');
  var path = require('path');

  /**
   * テスト結果レポート(JSON)を生成する。
   * @class Reporter
   * @constructor
   */
  module.exports = function reporter(option) {

    var parentSpec = Object.create(null);
    var specResults = [];

    /**
     * suite (describe)が終ったタイミングで実行される
     * @method suiteDone
     **/
    this.suiteDone = function(suite) {
      // description === fullName は親SPEC
      // 親スペックを第一レベルオブジェクトに設定する
      if (suite.description === suite.fullName) {
        suite.specs = specResults;
        parentSpec[suite.description] = suite;
        specResults = [];
      }
    };

    /**
     * test (it)が終ったタイミングで実行される
     * @method specDone
     **/
    this.specDone = function(spec) {
      specResults.push(spec);
    };

    //
    /**
     * テストが全部終ったタイミングで実行される
     * @method jasmineDone
     **/
    this.jasmineDone = function() {
      var reportDir = path.join(e2eTestHelper.drive.base, 'report', option.TYPE);
      function writeReport() {
        // export E2E_USER=username
        return fs.writeFileSync(path.join(reportDir,  new Date().getTime() + '.json'),
              JSON.stringify(parentSpec, null, 4));
      }

      return fs.exists(reportDir, function(exists) {
        if (exists) {
          return writeReport();
        }else {
          fsEx.mkdirp(reportDir, function(err) {
            if (err) {
              console.log('jasmineDone ReportCreateException:', err);
            }

            return writeReport();
          });
        }
      });
    };
  };
})();

