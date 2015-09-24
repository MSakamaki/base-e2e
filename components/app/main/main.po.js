/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

import BaseApp from '../app.base';

'use strict';

/**
* [Angular Fullstack](https://github.com/DaftMonk/generator-angular-fullstack) start page インタフェース
* @extends {BaseApp}
* @example
* e2eTestHelper.po.app.main;
*/
export default class Main extends BaseApp {
  constructor() {
    super();
  }
}
