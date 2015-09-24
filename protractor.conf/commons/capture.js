(function() {
  'use strict';

  var fs = require('fs');
  var fsEx = require('fs.extra');
  var path = require('path');
  var Q = require('q');
  var Canvas = require('canvas');
  var _ = require('lodash');
  var Image = Canvas.Image;

  /**
   * テスト中画面のスクリーンショット撮影を行う
   * @class Capture
   * @constructor
   */
  module.exports = function capture(option, baseDir, timer) {

    // custom repotr setting
    var captureDir = 'capture';
    var cuurentSpec = {};
    var SpecStep = 0;
    var captureLists = {};
    var basePath = path.join(baseDir, 'report', option.TYPE);
    var photoDir = path.join(basePath, captureDir);
    var shutterTimer = timer || 0;

    /**
     * キャプチャー可否
     * @method isCapture
     * @return {Boolean} true: キャプチャーする, false: キャプチャーしない
     **/
    this.isCapture = function() {
      return new Boolean(process.env.SELENIUM_CAPTURE);
    };

    /**
     * スクリーンショットの取得
     * @method take
     * @param {String} スクリーンショット名
     * @param {String} 説明
     * @param {Array} キャプチャの編集内容
     * @return {Promise}
     **/
    this.take = function(name, description, writeGlaphics) {
      return enabled(function() {
        var fullHeight = 0;
        return browser.driver.sleep(shutterTimer)
          .then(function getScreeenSize() {
            return Q.all([
                browser.driver.executeScript('return window.innerHeight'),
                browser.driver.executeScript('return document.body.scrollHeight'),
              ]);
          }).then(function capturePlaning(Sizes) {
            var windowSize = Sizes[0];

            fullHeight = Sizes[1];
            var planSize = 0;
            var plan = [];
            do {
              plan.push({
                top: (fullHeight < planSize + windowSize) ? fullHeight - windowSize : planSize,
              });
              planSize += windowSize;
            }while (fullHeight > planSize);

            return plan;
          }).then(function takeCapture(plans) {
            var tasks = [];

            //var images = [];
            plans.forEach(function(plan, idx) {
              tasks.push((function() {
                return browser.driver.sleep(400 * idx)
                  .then(function scroll() {
                    return browser.driver.executeScript('window.scrollTo(0, ' + plan.top + ');');
                  }).then(function scrollWait() {
                    return browser.driver.sleep(100);
                  }).then(function capture() {
                    return {
                      png: browser.takeScreenshot(),
                      top: plan.top,
                    };
                  });
              })());
            });

            return Q.all(tasks);
          }).then(function takeCapture(captures) {
            var canvas = new Canvas(1024, fullHeight);
            var ctx = canvas.getContext('2d');
            var image = new Image();

            var tasks = [];
            captures.forEach(function(capture) {
              tasks.push((function() {
                return Q.Promise(function(resolve) {
                  var img = new Image;

                  img.onload = function(test) {
                    ctx.drawImage(img, 0, capture.top);
                    resolve();
                  };

                  img.src = new Buffer(capture.png.value_, 'base64');
                });
              })());
            });

            return Q.all(tasks)
              .then(function scrollRecover() {
                return browser.driver.executeScript('window.scrollTo(0, 0);');
              }).then(function fill() {
                /**********************************************
                * 第三匹数より指定される描画内容で画像を編集する機能。
                * [{
                *  type: 'text',
                *  text: 'A描画テスト。BC',
                *  position: [100,100],
                *},{
                *  type: 'rect',
                *  position: [200,100,100,50],
                *},]
                ***********************************************/
                if (_.isArray(writeGlaphics)) {
                  return Q.all(writeGlaphics.map(function(setting) {
                    return Q.Promise(function(resolve, reject) {
                      var context = canvas.getContext('2d');
                      switch (setting.type){
                        case 'text':
                          context.font = setting.font || '30px \'ＭＳ ゴシック\'';
                          context.fillStyle = setting.color || 'blue';
                          context.fillText(setting.text, setting.position[0], setting.position[1]);

                          resolve();
                          break;
                        case 'rect':
                          context.rect(setting.position[0], setting.position[1], setting.position[2], setting.position[3]);
                          context.strokeStyle = setting.color || '#ff0080';
                          context.lineWidth = setting.width || 7;
                          context.stroke();

                          resolve();
                          break;
                        default:
                          reject('未知のOption');
                          break;
                      }

                    });
                  }));
                }else {
                  return;
                }
              }).then(function pngMerge() {
                return canvas.toBuffer();
              });
          }).then(function dones(png) {
            return writeScreenShot({
              data: png,
              description: description,
              specName: cuurentSpec.fullName,
              step: SpecStep++,
              filename: name + '.png',
            });
          });
      });
    };

    // ---- private ----

    // キャプチャーを行う場合実行される。
    if (process.env.SELENIUM_CAPTURE) {
      jasmine.getEnv().addReporter({
        specStarted: function(result) {
          SpecStep = 0;
          cuurentSpec = result;
        },

        specDone: function(result) {
          SpecStep = 0;
        },

        jasmineDone: function() {
          fsEx.mkdirp(photoDir, function() {
            return fs.writeFileSync(path.join(photoDir,  +new Date().getTime() + '.photo.json'),
              JSON.stringify(captureLists, null, 4));
          });
        },
      });
    }

    /**
     * 環境変数 process.env.SELENIUM_CAPTURE によりテストの有効無効を調整する
     * @method enabled
     * @params {function} callback 実行を行うFunction
     * @private
     **/
    function enabled(callback) {
      if (process.env.SELENIUM_CAPTURE) {
        return callback();
      }else {
        return browser.driver.sleep(0);
      }
    }

    /**
     * 指定したテストケースによりキャプチャー保存するファイル名を作成し、キャプチャ処理を呼び出す
     * @method writeScreenShot
     * @private
     **/
    function writeScreenShot(options) {
      var savePath = path.join(photoDir, options.specName);
      var fileName = lpad(options.step) + '_' + options.filename;
      pushCaptureLists(fileName, options.description);
      return fs.exists(savePath, function(exists) {
        if (exists) {
          return saveFile(options.data, path.join(savePath, fileName));
        }else {
          fsEx.mkdirp(savePath, function(err) {
            if (err) {
              console.log('[./protractor.conf/commons/capture.jsでエラー] custom capture expeption ', err);
              throw err;
            }

            return saveFile(options.data, path.join(savePath, fileName));
          });
        }
      });
    }

    /**
     * 取得したスクリーンショット情報を格納(PUSH)する為のメソッド
     * @method pushCaptureLists
     * @private
     **/
    function pushCaptureLists(fileName, description) {
      try {
        captureLists[cuurentSpec.fullName] = captureLists[cuurentSpec.fullName] || [];
        captureLists[cuurentSpec.fullName].push({
          name: path.basename(fileName, '.png'),
          description: description || '',
          absPath: path.join(photoDir, cuurentSpec.fullName, fileName),
          path: path.join(option.TYPE, captureDir, cuurentSpec.fullName, fileName),
        });
      }catch (e) {
        console.log('[./protractor.conf/commons/capture.jsでエラー] pushCaptureLists Error', e);
      }
    }

    /**
     * 与えられた数値を左ゼロ詰めで返却する
     * @method lpad
     * @params {Number} num 左詰めしたい数値
     * @return {String} 左詰めされた文字列
     * @private
     **/
    function lpad(num) {
      var str = '' + num;
      var pad = '0000';
      return pad.substring(0, pad.length - str.length) + str;
    }

    /**
     * 指定フォルダにファイルを保存する
     * @method saveFile
     * @params {base64} data 保存対象データ
     * @params {string} savePath 保存先のパスとファイル名
     * @private
     **/
    function saveFile(data, savePath) {
      var stream = fs.createWriteStream(savePath);
      stream.write(data/*new Buffer(data, 'base64')*/);
      stream.end();
    }
  };
})();
