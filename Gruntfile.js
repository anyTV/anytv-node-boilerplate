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
                    timeout: 5000,
                    clearRequireCache: true,
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
                    spawn: false,
                },
            },
            test: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'mochaTest'],
                options: {
                    spawn: false,
                },
            }
        },

        env: {
            dev: {
                NODE_ENV: 'development'
            },
            prod: {
                NODE_ENV: 'production'
            },
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest']);
    grunt.registerTask('dev-tests', ['env:dev', 'jshint', 'mochaTest', 'watch:test']);
    grunt.registerTask('default', ['env:dev', 'jshint', 'express', 'watch:express']);

};
