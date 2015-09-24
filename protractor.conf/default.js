
'use strict';

var path = require('path');
var env = require('./commons/environment.js');
var Repotrer = require('./commons/reporter');
var componentLoader = require('./commons/componentLoader');
var linkHelper = require('./commons/link.helper');
var poHelper = require('./commons/po.helper');
var Capture = require('./commons/capture.js');
var Q = require('q');

var config = {
  // remote test settings
  // 将来的にはDockerにしたい、ローカルのブラウザ立ち上げる場合は以下をコメントアウトする
  baseUrl: env.baseUrl,

  //directConnect: false,
  //chromeOnly: true,

  // capabilities: {
  //   browserName: 'chrome',
  // },
  multiCapabilities:[
  /* 複数一括実行の例 */

    // {
    //   browserName: 'chrome',
    //   shardTestFiles:true,
    //   maxInstances: 2,
    //   chromeOptions: {
    //     // Get rid of --ignore-certificate yellow warning
    //     // args: ['--no-sandbox', '--test-type=browser'],
    //     // Set download path and avoid prompting for download even though
    //     // this is already the default on Chrome but for completeness
    //     prefs: {
    //       download: {
    //         // jscs:disable
    //         prompt_for_download: false,
    //         default_directory: '/tmp/downloads',

    //         // jscs:enable
    //       },
    //     },
    //   },
    // },
  /* シングルランテストの設定 */ 

    {
      directConnect: false,
      browserName: env.capabilities.browserName,
      seleniumAddress: env.seleniumAddress,
      chromeOptions: {
        // Get rid of --ignore-certificate yellow warning
        // args: ['--no-sandbox', '--test-type=browser'],
        // Set download path and avoid prompting for download even though
        // this is already the default on Chrome but for completeness
        // PDF ダウンロードさせる方法
        // http://stackoverflow.com/questions/29795160/chrome-webdriver-pdf-documents-downloading-and-not-opening-in-new-tab
        prefs: {
          // jscs:disable
          'download': {
            'directory_upgrade': true,
            'prompt_for_download': false,
            'default_directory': '/tmp/downloads',
          },

          // jscs:enable
        },
      },
    },
  /* リモートテストの設定(IE) */ 

  // {
  //     'browserName': 'internet explorer',
  //     seleniumAddress: 'http://27.93.201.8:4444/wd/hub'
  // }
  ],

  allScriptsTimeout: 110000,

  specs: [// DEFAULT ALL TESTS
    '../.tmp/**/*.spec.js',
  ],
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
  },

  // テスト初期設定
  originalConfig: {
    TYPE: 'default',
  },
  onPrepare: function() {
    var baseDir = path.join(__dirname, '../');
    global.e2eTestHelper = global.e2eTestHelper || {};
    global.e2eTestHelper.helper = {};
    global.e2eTestHelper.helper.link = linkHelper;
    global.e2eTestHelper.helper.po = poHelper;
    global.e2eTestHelper.testEnvironment = env;
    global.e2eTestHelper.capture = new Capture(config.originalConfig, baseDir, 1000);
    global.e2eTestHelper.drive = {
      base: baseDir,
    };

    jasmine.getEnv().addReporter(new Repotrer(config.originalConfig));
    browser.driver.manage().window().setSize(1024, 768);

    var qTasks = [componentLoader()];
    if (config.originalConfig.Initialize) {
      qTasks.push(config.originalConfig.Initialize());
    }

    return Q.all(qTasks);
  },
};

// SELENIUM_URLの環境変数が無い場合、seleniumAddressを除去する。
if (!process.env.SELENIUM_URL) {
  delete config.seleniumAddress;
  config.multiCapabilities.forEach(function(value) {
    delete value.seleniumAddress;
  });
}

exports.config = config;
