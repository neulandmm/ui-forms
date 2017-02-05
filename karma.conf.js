// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
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
