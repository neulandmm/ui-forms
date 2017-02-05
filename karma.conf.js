// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'misc/test-lib/helpers.js',
      'dist/ui-forms.js',
      'src/**/*.spec.js'
    ],
    port: 9876,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
