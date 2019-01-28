'use strict';


module.exports = grunt => {

    grunt.initConfig({
        eslint: {
            src: [
                'Gruntfile.js',
                'server.js',
                'config/**/*.js',
                'controllers/**/*.js',
                'helpers/**/*.js',
                'lib/**/*.js',
                'models/**/*.js',
                'test/**/*.js',
            ],
            options: {
                configFile: '.eslintrc',
            },
        },

        mochaTest: {
            test: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'spec',
                    timeout: 5000,
                    clearRequireCache: true,
                },
            },
        },

        express: {
            dev: {
                options: {
                    script: 'server.js',
                },
            },
        },

        watch: {
            express: {
                files: ['<%= eslint.src %>'],
                tasks: ['eslint', 'express'],
                options: {
                    spawn: false,
                },
            },
            test: {
                files: ['<%= eslint.src %>'],
                tasks: ['eslint', 'mochaTest'],
                options: {
                    spawn: false,
                },
            },
        },

        env: {
            dev: {
                NODE_ENV: 'development',
            },
            prod: {
                NODE_ENV: 'production',
            },
            test: {
                NODE_ENV: 'test',
            },
        },
    });

    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('test', ['env:test', 'eslint', 'mochaTest']);
    grunt.registerTask('dev-tests', ['env:dev', 'eslint', 'mochaTest', 'watch:test']);
    grunt.registerTask('default', ['env:dev', 'eslint', 'express', 'watch:express']);

};
