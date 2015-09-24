var webServerDefaultPort = 9000;

/**
 * Ptoractorの基礎環境変数の設定を行う。
 * @class Environment Settings
 * @constructor
 */
module.exports = {
  /**
   * SeleniumサーバーのURL
   * 環境変数`SELENIUM_URL`で上書き可能
   * @property seleniumAddress
   * @type String
   * @default "http://localhost:4444/wd/hub"
   **/
  seleniumAddress:
    (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),

  capabilities: {
    /**
     * テストで使用するブラウザ
     * 環境変数`TEST_BROWSER_NAME`で上書き可能
     * @property capabilities.browserName
     * @type String
     * @default "chrome"
     **/
    browserName:
        (process.env.TEST_BROWSER_NAME || 'chrome'),
    /**
     * テストで使用するブラウザのバージョン
     * 環境変数`TEST_BROWSER_VERSION`で上書き可能
     * @property capabilities.version
     * @type String
     * @default "ANY"
     **/
    version:
        (process.env.TEST_BROWSER_VERSION || 'ANY'),
  },

  /**
   * テスト先サーバーのデフォルトポート
   * 環境変数`HTTP_PORT`で上書き可能
   * @property webServerDefaultPort
   * @type Number
   * @default "9000"
   **/
  webServerDefaultPort: process.env.HTTP_PORT || webServerDefaultPort,

  // Protractor interactive tests
  interactiveTestPort: 6969,
  /**
   * ログイン処理時の待ち時間(トップページレンダリングが終る迄の待機時間)
   * @property loginWait
   * @type Number
   * @default "3000"
   **/
  loginWait: 3000,

  /**
   * Protractor起動時のベースURL
   * 環境変数`HTTP_HOST`でURLの上書きは可能
   * @property baseUrl
   * @type Number
   * @default "localhost"
   **/
  baseUrl:
    'http://' + (process.env.HTTP_HOST || 'localhost') +
          ':' + (process.env.HTTP_PORT || webServerDefaultPort),

};
