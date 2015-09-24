'use strict';

var chalk = require('chalk');

var csl = {
  emInfo: function(msg) {
    return chalk.bgBlack.white.bold(' ' + msg + ' ');
  },

  info: function(msg) {
    return chalk.blue.underline(msg);
  },

  warn: function(msg) {
    return chalk.yellow.bold(msg);
  },

  error: function(msg) {
    return chalk.red.bold.underline(msg);
  },

  ok: function(msg) {
    return chalk.green(msg);
  },

  help: function(command, example, description, pattern) {
      var patternMsg = pattern ? csl.newLine + '            指定可能な引数：' + pattern.join(' ') : '';
      return csl.info(('        --' + command).slice(-10)) + ': ' +
             chalk.bgCyan.bold(example) + description + patternMsg;
    },

  newLine: '\n',
};

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-protractor-runner');

  var options = {
    // Configurable paths
    paths: {
      cenario: 'cenario',
      build: '.tmp',
    },
    pkg: grunt.file.readJSON('package.json'),
  };

  var configs = require('load-grunt-configs')(grunt, options);

  // Define the configuration for all the tasks
  grunt.initConfig(configs);

  /**************************************************/
  /***************  Task Setting    *****************/
  /**************************************************/

  // ドキュメント生成
  grunt.registerTask('doc',
    csl.info('ドキュメントを./docフォルダ以下に生成します。') + csl.newLine +
    csl.emInfo('doc:view') + csl.info('で生成したドキュメントの表示も行います。'),
    function(target) {
      var tasks = [
        'clean:doc',
        'yuidoc',
        'esdoc:components',
      ];
      console.log('target', target);
      if (target === 'view') {
        tasks.push('browserSync:doc');
      }

      return grunt.task.run(tasks);
    });

  // functional testing
  grunt.registerTask('func',
    csl.info('functonalテスト(ローカル開発用試験)を行います。') + csl.newLine +
    csl.emInfo('func:view') + csl.info('でテスト完了後にレポートも表示します。'),
    function(target) {
      var tasks = [
        'initializeTask',
        'jscs:functional',
        'babel:functional',
        'clean:report',
        'protractor:functional',
        'merge-json:functionalReport',
        'merge-json:functionalReportCapture',
      ];
      if (target === 'view') {
        tasks.push('report');
      }

      return grunt.task.run(tasks);
    });

  //grunt
  grunt.registerTask('report', csl.info('テストレポートの表示'), [
    'injector:controller',
    'browserSync:dev',
    ]);

  grunt.registerTask('check', csl.info('テストのSPECリストの表示を行います。'), [
    'initializeTask',
    'jscs',
    'clean',
    'babel',
    'protractor:chk',
  ]);

  /**************************************************/
  /*************** Private Commands *****************/
  /**************************************************/

  var descriptionInnerCommand = csl.warn('実行しないでください、内部処理用タスクです。');

  // Initialize tasks
  // Gruntコマンド実行時に必ず実行するタスク
  grunt.registerTask('initializeTask', descriptionInnerCommand, [
    'environment_option',
    'selenium_override',
    'caputre_option',
    'spec_override',
    'jscs:others',
    'clean:tmp',
    'babel:components',
    ]);

  /**
   * --environment パラメータが有る場合、その設定で実行する
   **/
  grunt.registerTask('environment_option', descriptionInnerCommand, function() {
    var environment = grunt.option('env');
    switch (environment){
      case 'verification':
        console.log(csl.info('SET ENV:'), environment);
        grunt.task.run(['env:verification']);
        break;
      default:
        break;
    }
  });

  /**
   * --caputreパラメータが有る場合、スクリーンショットを取る
   **/
  grunt.registerTask('caputre_option', descriptionInnerCommand, function() {
    if (grunt.option('capture')) {
      console.log(csl.info('SET SCREENSHOT:TRUE'));
      grunt.task.run(['env:capture']);
    }
  });

  /**
   * --selenium パラメータが有る場合、環境を変更する。
   **/
  grunt.registerTask('selenium_override', descriptionInnerCommand, function() {
    var _envName = grunt.option('selenium');
    switch (_envName){
      case 'remote':
        console.log(csl.info('SET ENV:'), _envName);
        grunt.task.run(['env:remote']);
        break;
      case 'ie':
        console.log(csl.info('SET ENV:'), _envName);
        grunt.task.run(['env:ie']);
        break;
      default:
        break;
    }
  });

  /**
   * テスト対象ファイルの変更を行える
   * --specsパラメータが有る場合、テスト対象ファイルを上書きする。
   **/
  grunt.registerTask('spec_override', descriptionInnerCommand, function() {
    var _specs = grunt.option('sfile');
    if (_specs) {
      console.log(csl.info('UPGRADE SPECFILE:'), _specs);

      // replace 'cenario' => '.tmp'
      var specs = _specs.replace('/cenario/', '/.tmp/');
      var config = grunt.config.get('protractor');
      for (var key in config) {
        if (key === 'options') {
          continue;
        }

        if (!config[key].options) {
          config[key].options = {};
        }

        if (!config[key].options.args) {
          config[key].options.args = {};
        }

        config[key].options.args.specs = [specs];
      }

      grunt.config.merge({
        protractor: config,
      });
    }
  });

  // 追加オプション説明用の空タスクです。(必ず末尾に記述)
  grunt.registerTask('customOptions', [
      csl.help('sfile', '--sfile=[ファイルパス]', 'のように指定するとテスト対象のファイルを絞れます'),
      csl.help('selenium', '--selenium=[引数]', 'のように指定するとテストで使用する環境を切り替えれます', ['remote', 'ie']),
      csl.help('capture', '--capture=true', 'のように指定するとスクリーンショットを取得します', ['true']),
      csl.help('env', '--env=[引数]', 'のように指定すると指定した環境の設定でテストを行います', ['verification']),
    ].join(csl.newLine), function() {});
};
