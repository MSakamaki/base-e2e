/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */
'use strict';

/**
* [Angular Fullstack](https://github.com/DaftMonk/generator-angular-fullstack) start page
* @abstract
*/
export default class BaseApp {
  constructor() {
    if (this.constructor.name === 'BaseApp') {
      throw new TypeError('Cannot construct BaseApp instances directly');
    }

    /** app page Allo Allo string */
    this.lblAlloAllo = element(by.css('#banner > div > h1'));

    /** Features list */
    this.repeatFeatuer = element.all(by.repeater('thing in awesomeThings'));
  }
 /**
  * 画面が描画されたかを確認する。
  * @example
  * // promise chain.
  *   .then(()=> e2eTestHelper.po.iaas.fomation.verification())
  *
  * @return {Promise}
  */
  verification() {
    return e2eTestHelper.helper.po.createVerification([
        this.lblAlloAllo,
      ]);
  }

 /**
  * Featuresをクリック。
  * @example
  * // promise chain.
  *   .then(()=> e2eTestHelper.po.iaas.fomation.clickFeatures([Features row number]))
  *
  * @param {Number} rowNumber FeatuersのX番目(ゼロ開始)
  * @return {Promise}
  */
  clickFeatures(rowNumber) {
    return this.repeatFeatuer
      .then(featuers=> featuers[rowNumber].element(by.css('a[href="#"]')))
      .then(link => link.click());
  }
}
