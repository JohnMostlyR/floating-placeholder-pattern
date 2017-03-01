module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  const path = require('path');

  const sourceFolder = path.join(__dirname, 'src');
  const buildFolder = path.join(__dirname, 'build');
  const subFolder = {
    images: path.join('assets', 'images'),
    stylesheets: path.join('assets', 'stylesheets'),
    scripts: path.join('assets', 'scripts')
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Load AWS configuration
    aws: grunt.file.readJSON('aws-keys.json'),
    aws_s3: { // https://github.com/MathieuLoutre/grunt-aws-s3
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
        region: '<%= aws.AWSRegion %>',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5, // 5 simultaneous downloads
      },
      staging: {
        options: {
          bucket: 'my-wonderful-staging-bucket',
          differential: true, // Only uploads the files that have changed
          gzipRename: 'ext' // when uploading a gz file, keep the original extension
        },
        files: [
          {
            dest: 'app/',
            cwd: 'backup/staging/',
            action: 'download'
          },
          {
            src: 'app/',
            cwd: 'copy/',
            action: 'copy'
          },
          {
            expand: true,
            cwd: 'build/staging/scripts/',
            src: ['**'],
            dest: 'app/scripts/'
          },
          {
            expand: true,
            cwd: 'build/staging/styles/',
            src: ['**'],
            dest: 'app/styles/'
          },
          {
            dest: 'src/app',
            action: 'delete'
          },
        ]
      },
      production: {
        options: {
          bucket: 'my-wonderful-production-bucket',
          differential: true, // Only uploads the files that have changed
          gzipRename: 'ext', // when uploading a gz file, keep the original extension
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['*'],
            dest: '/'
          },
          {
            expand: true,
            cwd: 'build/assets/',
            src: ['**'],
            dest: 'assets/',
            params: {
              CacheControl: '2000',
              ContentEncoding: 'gzip'
            }
          },
          // CacheControl only applied to the assets folder
          // LICENCE inside that folder will have ContentType equal to 'text/plain'
        ]
      },
      clean_production: {
        options: {
          bucket: 'my-wonderful-production-bucket',
          debug: true // Doesn't actually delete but shows log
        },
        files: [
          {
            dest: '/',
            action: 'delete'
          },
          {
            dest: 'assets/',
            exclude: '**/*.tgz',
            action: 'delete'
          }, // will not delete the tgz
          {
            dest: 'assets/large/',
            exclude: '**/*copy*',
            flipExclude: true,
            action: 'delete'
          }, // will delete everything that has copy in the name
        ]
      },
      download_production: {
        options: {
          bucket: 'my-wonderful-production-bucket'
        },
        files: [
          {
            dest: '/',
            cwd: 'backup/',
            action: 'download'
          }, // Downloads the content of app/ to backup/
          {
            dest: 'assets/',
            cwd: 'backup/assets/',
            exclude: '**/*copy*',
            action: 'download'
          }, // Downloads everything which doesn't have copy in the name
        ]
      },
      secret: {
        options: {
          bucket: 'my-wonderful-private-bucket',
          access: 'private'
        },
        files: [
          {
            expand: true,
            cwd: 'secret_garden/',
            src: ['*.key'],
            dest: 'secret/'
          },
        ]
      }
    },

    // Transpile ES6 to ES5
    babel: {
      options: {
        sourceMap: true,
        presets: ['babel-preset-es2015'],
        plugins: ['babel-plugin-transform-runtime']
      },
      dev: {
        files: [{
          expand: true,
          cwd: path.join(sourceFolder, subFolder.scripts),
          src: ['**/*.js'],
          dest: path.join(buildFolder, subFolder.scripts),
          ext: '.min.js'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: path.join(sourceFolder, subFolder.scripts),
          src: ['**/*.js'],
          dest: path.join(buildFolder, subFolder.scripts),
          ext: '.min.js'
        }]
      }
    },

    // Clean folder(s)
    clean: {
      preBuild: [path.join(buildFolder, '**'), `!${buildFolder}`],
      postProduction: [
        path.join(buildFolder, subFolder.stylesheets, '**', '*.css'),
        `!${path.join(buildFolder, subFolder.stylesheets, '**', '*.min.css')}`,
        path.join(buildFolder, subFolder.scripts, '**', '*.js'),
        `!${path.join(buildFolder, subFolder.scripts, '**', '*.min.js')}`,
        path.join(buildFolder, '**', '*.map')
      ]
    },

    // Compile handlebars
    'compile-handlebars': {
      static: {
        files: [{
          expand: true,
          cwd: sourceFolder,
          src: '*.hbs',
          dest: buildFolder,
          ext: '.html'
        }],
        //helpers: 'src/helpers/*.js',
        partials: 'src/partials/*.hbs',
        registerFullPath: true,
        templateData: 'src/data/en.json'
      },
    },

    // Compress assets
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: path.join(buildFolder, 'assets'),
        src: ['**/*'],
        dest: path.join(buildFolder, 'assets')
      }
    },

    // Copy files and folders
    copy: {
      main: {
        files: [

          // includes files within path
          {
            expand: true,
            cwd: sourceFolder,
            src: ['browserconfig.xml', 'manifest.json'],
            dest: buildFolder,
            filter: 'isFile'
          },
        ],
      },
    },

    // Extract and inline critical-path CSS to HTML
    critical: {
      options: {
        base: path.join(buildFolder),
        minify: true,
        width: 1440,
        height: 900,
        ignore: [
          '@font-face',
          '@import'
        ]
      },
      pages: {
        expand: true,
        cwd: path.join(buildFolder),
        src: '{,**/}*.html',
        dest: path.join(buildFolder),
      }
    },

    // Minify CSS files
    cssnano: {
      options: {
        sourcemap: false,
        safe: true
      },
      subtask1: {
        files: {
          'build/assets/stylesheets/main.css': 'build/assets/stylesheets/main.css',
          'build/assets/stylesheets/web-fonts.css': 'build/assets/stylesheets/web-fonts.css',
        }
      },
      subtask2: {
        options: {
          safe: false
        },
        files: {
          'build/assets/stylesheets/font-awesome.min.css': 'build/assets/stylesheets/font-awesome.css',
        }
      },
      subtask3: {
        files: {
          'build/assets/stylesheets/above-the-fold.min.css': 'build/assets/stylesheets/above-the-fold.css',
        }
      }
    },

    // JavaScript linting
    eslint: {
      options: {},
      target: ['**/*.js']
    },

    // Express web server
    express: {
      all: {
        options: {
          port: 3000,
          hostname: 'localhost',
          bases: ['./build'],
          livereload: true,
        }
      },
    },

    // Minify HTML files
    htmlmin: {
      prod: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: buildFolder,
          src: ['*.html'],
          dest: buildFolder
        }]
      }
    },

    // Minify images
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: path.join(sourceFolder, subFolder.images),
            src: ['*.{png,jpg,gif,svg}'],
            dest: path.join(buildFolder, subFolder.images)
          },
          {
            expand: true,
            cwd: path.join(sourceFolder, 'assets', 'icons'),
            src: ['*.{ico,png,svg}'],
            dest: buildFolder
          }
        ],
      }
    },

    // Postprocessing for CSS files
    postcss: {
      options: {
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: path.join(buildFolder, subFolder.stylesheets), // ...to the specified directory
        },
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer'), // add vendor prefixes
        ]
      },
      dist: {
        src: path.join(buildFolder, subFolder.stylesheets, '*.css')
      }
    },

    // Purify CSS
    purifycss: {
      options: {
        minify: false,
        rejected: true, // Logs out removed selectors.
        whitelist: [],  // Array of selectors to always leave in.
      },
      target: {
        src: [
          path.join(buildFolder, '*.html'),
          path.join(buildFolder, subFolder.scripts, '**', '*.js')
        ],
        css: [path.join(buildFolder, subFolder.stylesheets, '**', 'main.css')],
        dest: path.join(buildFolder, subFolder.stylesheets, 'main.css')
      },
    },

    // Compile SASS files
    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: path.join(sourceFolder, subFolder.stylesheets),
          src: '*.{scss, sass}',
          dest: path.join(buildFolder, subFolder.stylesheets),
          ext: '.css'
        }]
      },
      prod: {
        options: {
          sourceMap: false,
        },
        files: [{
          expand: true,
          cwd: path.join(sourceFolder, subFolder.stylesheets),
          src: '*.{scss, sass}',
          dest: path.join(buildFolder, subFolder.stylesheets),
          ext: '.css'
        }]
      }
    },

    // Minify JavaScript files
    uglify: {
      prod: {
        options: {
          sourceMap: false,
          preserveComments: 'some'
        },
        files: [{
          expand: true,
          cwd: path.join(buildFolder, subFolder.scripts),
          src: '**/*.js',
          dest: path.join(buildFolder, subFolder.scripts),
          ext: '.min.js'
        }]
      }
    },

    // Watch for changes
    watch: {
      options: {
        livereload: true,
      },
      imagemin: {
        files: [path.join(sourceFolder, subFolder.images, '**', '*.{png,jpg,gif,svg}')],
        tasks: ['imagemin'],
      },
      babel: {
        files: [
          path.join(sourceFolder, subFolder.scripts, '**', '*.js'),
          `!${path.join(sourceFolder, subFolder.scripts, '**', '*lint_tmp*.js')}`
        ],
        tasks: ['babel:dev'],
      },
      files: ['./build/**'],
      tasks: [],
      sass: {
        files: [
          path.join(sourceFolder, subFolder.stylesheets, '**', '*.{scss, sass}')
        ],
        tasks: [
          'sass:dev',
          'purifycss',
          'postcss'
        ],
      },
      handlebars: {
        files: [
          path.join(sourceFolder, '*.{hbs,handlebars}'),
          path.join(sourceFolder, '**', '*.{hbs,handlebars}')
        ],
        tasks: [
          'compile-handlebars:static'
        ],
      },
    },
  });

  // Register tasks

  // this would be run by typing "grunt dev" on the command line
  grunt.registerTask(
    'dev',
    [
      'clean:preBuild',             // Clean build folders
      'copy:main',                  // Copy some files and folders
      'imagemin',                   // Minify images
      'babel:dev',                  // Transpile ES6 to ES5
      'sass:dev',                   // Compile SASS to CSS
      'compile-handlebars:static',  // Compile handlebar templates
      'purifycss',                  // Remove unused style selectors from CSS files
      'postcss',                    // Perform PostCSS tasks on CSS files
      'express',                    // Start web server
      'watch'                       // Watch for any changes and perform tasks when needed
    ]
  );

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask(
    'default',
    [
      'clean:preBuild',             // Clean build folders
      'copy:main',                  // Copy some files and folders
      'imagemin',                   // Minify images
      'babel:prod',                 // Transpile ES6 to ES5
      'uglify:prod',                // Minify all JavaScript
      'sass:prod',                  // Compile SASS to CSS
      'compile-handlebars:static',  // Compile handlebar files
      'purifycss',                  // Remove unused style selectors from CSS files
      'postcss',                    // Perform PostCSS tasks on css files
      'cssnano:subtask1',           // Minify CSS with the 'safe' option
      'cssnano:subtask2',           // Minify CSS
      'critical',                   // Extract and inline critical-path CSS to HTML
      'htmlmin:prod',               // Minify all HTML files
      'clean:postProduction'        // Clean folder(s) of left over files
    ]
  );

  // Backup current S3 bucket, compress and publish to S3 bucket
  grunt.registerTask(
    'publish',
    [
      'compress',
      'aws_s3:production'
    ]
  );

  // Download from S3
  grunt.registerTask(
    'backup',
    [
      'aws_s3:download_production'
    ]
  );
};
