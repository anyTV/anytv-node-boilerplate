'use strict';


module.exports = (grunt) => {

    grunt.initConfig({
        jshint: {
            files: [
                'Gruntfile.js',
                'server.js',
                'controllers/**/*.js',
                'helpers/**/*.js',
                'lib/**/*.js',
                'models/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        mochaTest: {
            test: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'spec',
                    timeout: 5000
                }
            }
        },

        express: {
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },

        watch: {
          express: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'express'],
            options: {
                spawn: false
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('serve', ['express']);
    grunt.registerTask('default', ['jshint', 'express', 'watch']);

};
