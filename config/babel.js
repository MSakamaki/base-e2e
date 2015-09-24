
(function() {
  'use strict';

  function makePoFiles(ext) {
    return {
      expand: true,
      cwd: 'components',
      src: ['**/*.' + ext + '.js'],
      dest: '.tmp/components',
      ext: '.' + ext + '.js',
    };
  }

  module.exports = {
    options: {
      sourceMap: true,
    },
    functional: {
      files: [{
        expand: true,
        cwd: 'cenario/functional',
        src: ['**/*.spec.js'],
        dest: '.tmp/functional',
        ext: '.spec.js',
      },],
    },
    components: {
      files: [
        makePoFiles('po'),
        makePoFiles('base'),
      ],
    },
  };
})();

