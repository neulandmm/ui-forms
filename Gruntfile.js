'use strict';

module.exports = function (grunt) {

  require('jit-grunt')(grunt, {
    // add deps here
  });

  grunt.initConfig({
    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n',
    concat: {
      options: {
        separator: ';\n',
        banner: '(function () { \n"use strict";\n',
        footer: '\n}());'
      },
      dist: {
        src: ['src/ui-forms.js'],
        dest: 'dist/ui-forms.js',
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('build-scripts', [
    'concat'
  ]);

  grunt.registerTask('build', [
    'build-scripts'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
}
