'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var FrontEndBasicGenerator = module.exports = function FrontEndBasicGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FrontEndBasicGenerator, yeoman.generators.Base);


FrontEndBasicGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            type: 'input',
            name: 'author',
            message: 'Author Name:',
            default: 'myself <myself@foo.com>'
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Project Name:',
            default: 'my project'
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: 'Project Description:',
            default: 'my project'
        },
        {
            type: 'input',
            name: 'license',
            message: 'License:',
            default: 'MIT'
        },
        {
            type: 'checkbox',
            name: 'basicsToInstall',
            message: 'Choose what basic grunt tasks to install.',
            choices: [
                {
                    name: 'jshint',
                    value: 'jshint',
                    checked: true
                },
                {
                    name: 'grunt watch task',
                    value: 'watch',
                    checked: true
                },
                {
                    name: 'grunt concat task',
                    value: 'concat',
                    checked: true
                }
            ]
        },
        {
            type: 'list',
            name: 'testFramework',
            message: 'Choose a unit test framework.',
            default: 0,
            choices: [
                {
                    name: 'jasmine',
                    value: 'jasmine'
                }
            ]
        },
        {
            type: 'list',
            name: 'cssFramework',
            message: 'Choose what CSS framework to install.',
            default: 0,
            choices: [
                {
                    name: 'LESS',
                    value: 'less'
                },
                {
                    name: 'SASS',
                    value: 'sass'
                }
            ]
        }
    ];

    this.prompt(prompts, function (props) {
        this.props = props;
        this.testTasks = (function () {
            var ret = [];

            //  task: jshint
            if (props.basicsToInstall.indexOf('jshint') > -1) {
                ret.push('jshint');
            }

            //  task: jasmine
            if (props.testFramework) {
                ret.push(props.testFramework);
            }

            return ret;
        }());
        this.devDependencies = (function () {
            var optionalDependencies = {
                jshint: '"grunt-contrib-jshint": "~0.7.2"',
                jasmine: '"grunt-contrib-jasmine": "~0.5.1"',
                less: '"grunt-contrib-less": "~0.8.2"',
                sass: '"grunt-contrib-sass": "~0.5.1"'
            },
                devDependencies = [
                    '"grunt": "~0.4.2"',
                    '"grunt-contrib-watch": "~0.5.3"',
                    '"grunt-contrib-concat": "~0.3.0"'
                ];

            // jshint
            if (props.basicsToInstall.indexOf('jshint') > -1) {
                devDependencies.push(optionalDependencies.jshint);
            }

            // jasmine
            if (props.testFramework === 'jasmine') {
                devDependencies.push(optionalDependencies.jasmine);
            }

            // less
            if (props.cssFramework === 'less') {
                devDependencies.push(optionalDependencies.less);
            }

            // sass
            if (props.cssFramework === 'sass') {
                devDependencies.push(optionalDependencies.sass);
            }

            return devDependencies;

        }());

        cb();
    }.bind(this));
};


/**
 * Create basic scaffolding folders
 * @return {undefined}
 */
FrontEndBasicGenerator.prototype.createFolders = function () {
    // css
    this.mkdir('css');
    this.mkdir('css/src');
    this.mkdir('css/dist');

    // js
    this.mkdir('js');
    this.mkdir('js/src');
    this.mkdir('js/dist');

    // images
    this.mkdir('images');

    // vendor libs
    this.mkdir('vendor');

    // unit tests
    this.mkdir('tests');
};


/**
 * Copy over project files.
 * @return {undefined}
 */
FrontEndBasicGenerator.prototype.projectfiles = function projectfiles() {
    var props = this.props,
        self = this;

    // basics
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    
    // templates
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');

    // optional installs
    if (props.basicsToInstall.indexOf('jshint') > -1) {
        this.copy('jshintrc', '.jshintrc');
    }

    // javascripts
    this.copy('js/main.js', 'js/src/main.js');

    // test suite
    if (this.props.testFramework === 'jasmine') {
        this.copy('tests/test_main.js', 'tests/test_main.js');
    }

    // css framework
    // copies over either less or sass base scaffold files.
    (function () {
        var cssFramework = props.cssFramework,
            ext = cssFramework === 'sass' ? 'scss' : cssFramework,
            cssFilenames = [
                'global',
                'screen',
                'utils'
            ],
            i = 0,
            len = cssFilenames.length,
            fn;

        if (cssFramework) {
            for (i; i < len; i += 1) {
                fn = cssFilenames[i];
                self.copy(cssFramework + '/' + fn + '.' + ext, 'css/src/' + fn + '.' + ext);
            }
        }
    }());

};
