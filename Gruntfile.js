'use strict';


module.exports = (grunt) => {

    grunt.initConfig({
        jshint: {
            files: [
                'Gruntfile.js',
                'server.js',
                'config/**/*.js',
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
        },

        env: {
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest']);
    grunt.registerTask('serve', ['express']);
    grunt.registerTask('test-watch', ['env:test', 'jshint', 'mochaTest', 'watch']);
    grunt.registerTask('default', ['jshint', 'express', 'watch']);

};
