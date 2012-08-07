/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/**\n' +
        '* Tatsu v<%= meta.version %> (Built ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Matt Rudder\n' +
        '* http://tatsujs.com/\n*/'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    requirejs: {
      baseUrl: "src/lib",
      name: 'Tatsu',
      out: 'dist/tatsu.js',
      uglify: false
    },
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:dist/tatsu.js>'],
        dest: 'dist/tatsu.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/tatsu.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        define: true,
        require: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-requirejs');

  // Default task
  grunt.registerTask('default', 'requirejs concat min');

};
