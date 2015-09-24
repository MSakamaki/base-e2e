
(function() {
  'use strict';

  module.exports = {
    functionalReport:{
      src: ['report/functional/*.json'],
      dest: 'report/functional/functional.json',
    },
    functionalReportCapture:{
      src: ['report/functional/capture/*.json'],
      dest: 'report/functional/capture/photo.json',
    },
  };
})();
