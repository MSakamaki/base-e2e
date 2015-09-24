ページオブジェクトについて
===


### ドキュメント作成

```sh

# generate document
grunt doc

# generate and view document
grunt doc:view

```

### PageObject作成ルール

 + ディレクトリ以下のようなルールになっています。

```sh
components/
├── common               # サブシステム名
│   ├── errors           # ページオブジェクト
│   │   └── errors.po.js # ページオブジェクトファイル
│   ├── footer
│   │   └── footer.po.js
│   └── ....
└── admin
    └── user
        └── user.po.js

```

 + このように定義すると、以下のようにProtractorのテストで使用できます
 + **注意：** ファイル名には`.po.js`以外に`.`(ドット)による区切りをしないでください。

```javascript
  // e2eTestHelper.po.[サブシステム].[ページオブジェクト].[エレメント/サービス].[メソッド]
  e2eTestHelper.po.common.errors.lblErrorMessage.getText();
  e2eTestHelper.po.admin.user.lblUserName.getText();
```

 + コメントは[esdoc](https://esdoc.org/)を使用しています。
 + タグについては[APIのTags](https://esdoc.org/tags.html)を参照してください。

