
(function() {
  'use strict';

  function getLocalIp() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var result;

    Object.keys(ifaces).forEach(function(ifname) {
      if (ifname === 'en0') { /* mac os only */
        ifaces[ifname].forEach(function(iface) {
          console.log('SET LOCAL IP ADDRESS:', iface.address);
          result = iface.address;
        });
      }
    });

    return result;
  }

  module.exports = {
  options: {
  //Shared Options Hash
  },

  /**********************************************
   *  テスト用のアカウントや接続先等の設定
   **********************************************/
  /** 検証環境 */
  verification:{
    /** 検証ログインページURL */
    LOGIN_URL: 'https://192.168.0.1/',
  },
  /**********************************************
   *  テスト時に行うSeleniumサーバーの設定
   **********************************************/
  /** vertual box Selenium接続環境の設定 */
  remote: {
    SELENIUM_URL: 'http://localhost:4445/wd/hub',
    HTTP_HOST: '10.0.2.2',
  },
  /** ie server ip address */
  ie: {
    TEST_BROWSER_NAME: 'internet explorer',
    SELENIUM_URL: 'http://255.255.255.255:4444/wd/hub',
    HTTP_HOST: getLocalIp(),
  },
  /**********************************************
   *  --capture スクリーンショット機能の有効化オプション
   **********************************************/
  capture:{
    SELENIUM_CAPTURE: 1, // default undefined
  },
};
})();

