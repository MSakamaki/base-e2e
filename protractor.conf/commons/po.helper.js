

/**
 * ページオブジェクト操作に関わるヘルパ
 * @class PageObjectHelper
 * @constructor
 */
var PageObjectHelper = function() {
  'use strict';

  /**
   * 新規ウィンドウをひらき、ウィンドウが正常に開かれたかを確認する。
   * @method clickNextPO
   * @params {element} element クリックするボタンエレメント
   * @params {String} nextPageObject 遷移先が予想されるページオブジェクト
   * @return {Promise}
   **/
  this.clickNextPO = function(element, nextPageObject) {
    return browser
      .wait(function() {
        return element.isPresent();
      }, 10000, 'ボタンが見つからない。').then(function() {
        return element.click();
      }).then(function() {
        return browser.wait(function() {
          return nextPageObject.verification();
        }, 10000, '遷移に失敗しました');
      });
  };

  /**
   * Page Objectが表示された事を確認するVerification作成用のヘルパ。
   * @method createVerification
   * @params {Array} element[] Page Object表示時に検証したいelementのArray
   * @return {Promise}
   **/
  this.createVerification = function(elements) {
    return Promise.all(elements.map(function(element) {
      return browser.wait(function() {
        return element.isPresent();
      }, 10000);
    }));
  };
};

module.exports = new PageObjectHelper();
