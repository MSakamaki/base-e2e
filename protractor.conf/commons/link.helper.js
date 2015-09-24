

/**
 * 新規ウィンドウやファイルダウンロード等のテストを補佐するヘルパ
 * @class UriHelper
 * @constructor
 */
var UriHelper = function() {
  'use strict';

  /**
   * 新規ウィンドウをひらき、ウィンドウが正常に開かれたかを確認する。
   * @method clickAndExpectUriWithNewWindow
   * @params {browser.element} クリックするボタンエレメント
   * @params {String} 遷移先が予想されるURL
   * @return {Promise}
   **/
  this.clickAndExpectUriWithNewWindow = function(element, uri) {

    var handles;
    return element.click()
      .then(function() {
        return browser.wait(function() {
          return browser.getAllWindowHandles().then(function(handle) {
            handles = handle;
            return handle[1];
          });
        }, 4000); })
      .then(function(newWindow) { return browser.switchTo().window(newWindow); })
      .then(function() {
        if (e2eTestHelper.capture.isCapture()) {
          browser.driver.sleep(1000);
          return e2eTestHelper.capture.take('新規ウィンドウを開きました。', 'URL:[' + uri + ']をOPEN');
        }else {
          return void 0;
        }
      })
      .then(function() { return expect(browser.driver.getCurrentUrl()).toBe(uri); })
      .then(function() { return browser.driver.close(); })
      .then(function() { return browser.switchTo().window(handles[0]); });
  };

  /**
   * 指定したボタンを押した後、ファイルがダウンロードされた事を確認する。
   * @method clickAndDownloadFile
   * @params {browser.element} クリックするボタンエレメント
   * @params {String} ダウンロードが予想されるファイルのパス
   * @return {Promise}
   **/
  this.clickAndDownloadFile = function(element, uri) {
    var fs = require('fs');

    if (fs.existsSync(uri)) {
      // Make sure the browser doesn't have to rename the download.
      fs.unlinkSync(uri);
    }

    element.click();

    browser.driver.wait(function() {
      // Wait until the file has been downloaded.
      // We need to wait thus as otherwise protractor has a nasty habit of
      // trying to do any following tests while the file is still being
      // downloaded and hasn't been moved to its final location.
      return fs.existsSync(uri);
    }, 30000).then(function() {
      // Do whatever checks you need here.  This is a simple comparison;
      // for a larger file you might want to do calculate the file's MD5
      // hash and see if it matches what you expect.
      // expect(fs.readFileSync(filename, {
      //     encoding: 'utf8'
      // })).toEqual(
      //     "A,B,C\r\n"
      // );
    });
  };

  /**
   * 指定したボタンを押した後、ファイルがダウンロードされた事を確認する。(glob版)
   * @method clickAndDownloadFile
   * @params {browser.element} クリックするボタンエレメント
   * @params {String} ダウンロードが予想されるファイルのパス
   * @return {Promise}
   **/
  this.clickAndDownloadFileGlob = function(element, uri) {
    var fs = require('fs');
    var glob = require('glob');

    glob.sync(uri).forEach(function(filename) {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
    });

    element.click();

    return browser.driver.wait(function() {
      return glob.sync(uri)[0];
    }, 30000);
  };
};

module.exports = new UriHelper();
