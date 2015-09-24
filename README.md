E2Eテスト専用のリポジトリ
====

 + [ ] yeoman generatorにしたい！

## 概要

 + 外部ドキュメント
   + ページオブジェクト作成方法
     + `COMPONENTS.md`参照

### モジュールのアップデート

[`npm-check-updates`](https://github.com/tjunnone/npm-check-updates)を使用する

```sh
# チェック
ncu 
# npmのアップデート
ncu -u
```

### セットアップ

##### 初期構築

+ [node-canvas](https://github.com/Automattic/node-canvas/wiki/installation---osx)の初期設定を行う。

```sh

git clone [repository] e2e
cd e2e

# if you have not install jspm
npm i -g jspm

npm install
jspm install

```

### grunt


```sh

grunt --help

```

##### コマンドの例

```sh

grunt func:view --capture=true --sfile=./cenario/functional/app/main.spec.js 

```


### publicフォルダのドキュメントメンテナンスルール

 + `public/app`直下に以下のルールでファイルを作成します。
   + コントローラー名でフォルダを作成
   + `[コントローラー名].controller.js` でコントローラーファイルを作成する。
 + `public/app.js`に自動的にcontrollerファイルをInjectしてくれます。
 + factoryやdirectiveなども追加したい場合、タスクを`config/injector.js`にあたらしく定義してください。

```sh
public/app
├── func                   # コントローラ名
│   ├── func.controller.js # コントローラファイル
│   └── func.html
└── ...
```

### 新しくテストを追加するには

 + `protractor.conf/`フォルダに新しく定義を追加します。(protractor.conf/functional.js参照)
 + `Gruntfile.js`へgruntにコマンドを追加します。
 + gruntの設定である`config/`以下のファイルにも設定を追加します。
   + protractor.js
   + merge-json.js
   + babel.js
 + `cenario/`フォルダに新しくテストシナリオファイルを作成します。
 + レポートも作成する場合は、`public`フォルダのアプリケーションに新しくタブを追加してください。

##### example

```javascript

'use strict';

var conf = require('./default.js');
var Q = require('q');

// ユーザー独自設定
conf.config.originalConfig = {
  // テストタイプ名
  TYPE: 'functional',
  // テスト前に実行される処理(`protractor.conf.onPrepare()`に処理を追加したい場合に書いてください。)
  Initialize: function() {
    // q.promise ベースです、必ず`resolve`してください。
    return Q.Promise(function(resolve, reject, notify) {
      console.log('functionalテスト、はっじまっるよ〜〜〜〜！');
      resolve();
    });
  },
};

conf.config.specs = [
  '../.tmp/functional/**/*.spec.js',
];

module.exports = conf;


```

### e2eTestHelperテストの基本的な書き方

#### functionalテストの場合

 + Page Objectの動作検証を行う事が目的です。
 + だいたいがpage objectと対になる形で作成されます。

##### `browser.get('http://localhost:9000/')`でダミーログイン処理を行う

##### `e2eTestHelper.capture.take('テスト開始')`でテスト開始時のキャプチャーを行う。

##### 新しい振る舞いが有る場合

 + なるべくPageObjectのServiceとする。

##### 別のページオブジェクトが生成されるようなユースケースの場合

 + 生成されるページオブジェクトの`verification()`を用いて検証する。
 + `verification()`が無い場合は新しく定義する事

##### より見やすくする為に

 + 一つの操作が終るタイミングで`e2eTestHelper.capture.take('[コメント]')`を挿入する。
 + `e2eTestHelper.capture.take('[コメント]')`一つ上の行は開ける。

##### Example

_よりよい記述になった場合、ココもメンテ。_

```javascript
  beforeEach(()=> browser.get('http://localhost:9000/'));

  it('click Features', done=> {

    return e2eTestHelper.capture.take('テスト開始')
      .then(()=> browser.wait(()=> e2eTestHelper.po.app.main.verification()))
      .then(()=> expect(e2eTestHelper.po.app.main.lblAlloAllo.getText()).toBe('\'Allo, \'Allo!'))
 
      .then(()=> e2eTestHelper.capture.take('トップ画面が表示される'))
      .then(()=> e2eTestHelper.po.app.main.clickFeatures(1))
 
      .then(()=> e2eTestHelper.capture.take('Features２行目をクリックした', 'ココでテストが完了する。'))
      .then(()=> done());
  });
```

### e2eTestHelper

e2eテスト、またはコンポーネント系処理ので使える追加機能

 + `e2eTestHelper` : 共通テスト部品
   + `po` : ページオブジェクト
   + `helper` ヘルパ系オブジェクト
     + `link` リンク操作関連のヘルパ
   + `testEnvironment` 共通変数
   + `capture` スクリーンキャプチャ機能
   + `drive` ドライブ回り
     + `base` プロジェクトの絶対パス

### e2eTestHelperテストのキャプチャ

 + テストのスクリーンショットは`e2eTestHelper.capture.take('[スクリーンショット名]', '[キャプチャーの説明]');`にて取得する。
 + 第三匹数には以下のように設定すると図形描画が可能。

キャプチャーを見る場合、以下のコマンドでレポート画面を開き、「画面キャプチャー」タブで確認する。

```sh

grunt report

```

### e2eTestHelper専用の環境を作りたい


 1. `config/env.js` フォルダに環境を追加する
 1. 参照するときは node内で`process.env.[環境]`の用に参照可能になる。
 1. 実行時に`grunt func --env=[環境名]`のように実行する


### e2eTestHelpervertual boxを用いたリモートテスト

#### 1. vertual box初期設定

 1. vertualboxに仮想マシンを構築し、`node`をインストール`protractor`をグローバルインストールする。
 1. vertualboxのネットワーク設定で、アダプターを追加しホストと仮想マシンの相互接続を可能にする。


#### 2. vertual boxを起動し、webdriver-managerを起動する。

 + consoleから`webdriver-manager start`を実行する。  
   (versionが対応していれば、selenium-standaloneでも問題無し)

#### 3. `protractor.conf/default.js`に

 + `baseUrl` をvagrantからローカルを見た場合のアドレスにする(デフォルトでは`http://10.0.2.2:9000/`)。
 + `seleniumAddress` (vagrantに立ち上げたwebdriver-managerのアドレス)

```javascript

  // example 
  seleniumAddress: 'http://192.168.70.1:4445/wd/hub',
  baseUrl: 'http://10.0.2.2:9000/',

```



