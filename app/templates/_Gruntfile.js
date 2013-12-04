module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
        ' * <%%= pkg.name %> - v<%%= pkg.version %> - <%%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>; Licensed MIT\n' +
        ' */\n\n',
        meta: {
            version: '0.0.0'
        },

        concat: {
            options: {
                banner: '<%%= banner %>',
                separator: ';'
            },
            dist: {
                src: ['js/src/**/*.js'],
                dest: 'js/dist/<%%= pkg.name %>.js'
            }
        },
        <% if (props.basicsToInstall.indexOf('jshint') > -1) { %>
        jshint: {
            files: ['Gruntfile.js', 'js/src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        <% } if (props.testFramework === 'jasmine') { %>
        jasmine: {
            src: 'js/src/**/*.js',
            options: {
                specs: 'tests/test_*.js',
                helpers: 'tests/helpers/helper_*.js',
                vendor: 'vendor/**/*.js'
            }
        },
        <% } if (props.cssFramework === 'less') { %>
        less: {
            production: {
                options: {
                    banner: '<%%= banner %>',
                    // paths for @import directives
                    paths: [
                        'css/src'
                    ],
                    outputSourceFiles: true
                },
                files: {
                    'css/dist/global.css': 'css/src/global.less'
                }
            }
        },
        <% } if (props.cssFramework === 'sass') { %>
        sass: {
            production: {
                options: {
                    banner: '<%%= meta.banner %>',
                    // paths for @import directives
                    loadPath: [
                        'css/src'
                    ],
                    style: 'expanded'
                    // sourcemap: true  // only available with sass 3.3.0
                },
                files: {
                    'css/dist/global.css': 'css/src/global.scss'
                }
            }
        },
        <% } %>
        watch: {
            files: ['<%%= jshint.files %>'],
            tasks: <%= JSON.stringify(testTasks).replace(/,/g, ', ' ).replace(/"/g, '\'') %> // templates here
        }
    });
    
    
    // basics
    <% if (props.basicsToInstall.indexOf('jshint') > -1) { %>grunt.loadNpmTasks('grunt-contrib-jshint');<% } %>
    <% if (props.testFramework === 'jasmine') { %>grunt.loadNpmTasks('grunt-contrib-jasmine');<% } %>
    
    // css framework
    <% if (props.cssFramework === 'less') { %>grunt.loadNpmTasks('grunt-contrib-less');<% } %>
    <% if (props.cssFramework === 'sass') { %>grunt.loadNpmTasks('grunt-contrib-sass');<% } %>

    // default
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // tasks
    <% if (props.testFramework) { %>grunt.registerTask('test', <%= JSON.stringify(testTasks).replace(',', ', ' ).replace(/"/g, '\'') %>);<% } %>
    grunt.registerTask('default', ['concat']);

};