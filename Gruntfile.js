module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws-keys.json'), // Read the file
    aws_s3: { // https://github.com/MathieuLoutre/grunt-aws-s3
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
        region: 'us-west-2',
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
            cwd: 'dist/staging/scripts/',
            src: ['**'],
            dest: 'app/scripts/'
          },
          {
            expand: true,
            cwd: 'dist/staging/styles/',
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
            cwd: 'dist/',
            src: ['*'],
            dest: '/'
          },
          {
            expand: true,
            cwd: 'dist/assets/',
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
    babel: {  // Compile ES6 to ES5
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'src/assets/scripts',
          src: ['**/*.js'],
          dest: 'dist/assets/scripts',
          ext: '.min.js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/assets/scripts',
          src: ['**/*.js'],
          dest: 'dist/assets/scripts',
          ext: '.min.js'
        }]
      }
    },
    clean: {  // Clean folder(s) of left over files
      css: ['dist/assets/stylesheets/**/*.css', '!dist/assets/stylesheets/**/*.min.css'],
      js: ['dist/assets/scripts/**/*.js', '!dist/assets/scripts/**/*.min.js'],
      allMap: ['dist/assets/**/*.map']
    },
    'compile-handlebars': { // Compile handlebars files
      static: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '*.hbs',
          dest: 'dist',
          ext: '.html'
        }],
        helpers: '*.js',
        partials: 'src/partials/*.hbs',
        registerFullPath: true,
        templateData: 'src/data/en.json'
      },
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'dist/assets/',
        src: ['**/*'],
        dest: 'dist/assets/'
      }
    },
    criticalcss: {  // Create above-the-fold CSS
      dev: {
        options: {
          url: 'http://localhost:3000/index.html',
          width: 1200,
          height: 900,
          outputfile: 'dist/assets/stylesheets/above-the-fold.css',
          filename: 'dist/assets/stylesheets/main.min.css', // Using path.resolve( path.join( ... ) ) is a good idea here
          buffer: 800 * 1024,
          ignoreConsole: false
        }
      },
      prod: {
        options: {
          url: 'http://localhost:3000/index.html',
          width: 1200,
          height: 900,
          outputfile: 'dist/assets/stylesheets/above-the-fold.css',
          filename: 'dist/assets/stylesheets/main.min.css', // Using path.resolve( path.join( ... ) ) is a good idea here
          buffer: 800 * 1024,
          ignoreConsole: false
        }
      }
    },
    cssnano: {  // Minify CSS files
      options: {
        sourcemap: false,
        safe: true
      },
      subtask1: {
        files: {
          'dist/assets/stylesheets/main.min.css': 'dist/assets/stylesheets/main.css',
          'dist/assets/stylesheets/web-fonts.min.css': 'dist/assets/stylesheets/web-fonts.css',
        }
      },
      subtask2: {
        options: {
          safe: false
        },
        files: {
          'dist/assets/stylesheets/font-awesome.min.css': 'dist/assets/stylesheets/font-awesome.css',
        }
      },
      subtask3: {
        files: {
          'dist/assets/stylesheets/above-the-fold.min.css': 'dist/assets/stylesheets/above-the-fold.css',
        }
      }
    },
    htmlmin: {  // Minify HTML files
      dev: {
        options: {
          removeComments: false,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.html'],
          dest: 'dist'
        }]
      },
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.html'],
          dest: 'dist'
        }]
      }
    },
    imagemin: { // Minify images
      dynamic: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/images',
            src: ['*.{png,jpg,gif,svg}'],
            dest: 'dist/assets/images'
          },
          {
            expand: true,
            cwd: 'src/assets/icons',
            src: ['*.{ico,png,svg}'],
            dest: 'dist'
          }
        ],
      }
    },
    postcss: {  // Postprocessing in CSS files
      options: {
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'dist/assets/stylesheets/' // ...to the specified directory
        },
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: ['last 2 versions']}), // add vendor prefixes
        ]
      },
      dist: {
        src: 'dist/assets/stylesheets/*.css'
      }
    },
    qunit: {
      files: ['src/test/**/*.html']
    },
    run: {
      server: { // Start http-server on port 3000
        cmd: 'node_modules\\.bin\\http-server.cmd',
        args: ['-p 3000', './dist'],
        options: {
          passArgs: []
        }
      }
    },
    sass: { // Compile SASS files
      dev: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'src/assets/stylesheets',
          src: '*.scss',
          dest: 'dist/assets/stylesheets',
          ext: '.min.css'
        }]
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/assets/stylesheets',
          src: '*.scss',
          dest: 'dist/assets/stylesheets',
          ext: '.css'
        }]
      }
    },
    uglify: { // Minify JavaScript files
      dist: {
        options: {
          sourceMap: false,
          preserveComments: 'some'
        },
        files: [{
          expand: true,
          cwd: 'dist/assets/scripts',
          src: '**/*.js',
          dest: 'dist/assets/scripts',
          ext: '.min.js'
        }]
      }
    },
    watch: {
      imagemin: {
        files: ['src/assets/images/*.{png,jpg,gif,svg}'],
        tasks: ['imagemin']
      },
      babel: {
        files: ['src/assets/scripts/**/*.js', '!src/assets/scripts/**/*scsslint_tmp*.js'],
        tasks: ['babel:dev']
      },
      sass: {
        files: ['src/assets/stylesheets/**/*.{scss,sass}', 'src/assets/stylesheets/_partials/**/*.{scss,sass}'],
        tasks: ['sass:dev', 'postcss']
      },
      handlebars: {
        files: ['./**/*.{hbs,handlebars}'],
        tasks: ['compile-handlebars:static', 'htmlmin:dev']
      }
    },
  });

  // Load plugins
  [
    'grunt-run',
    'grunt-babel',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-sass',
    'grunt-compile-handlebars',
    'grunt-contrib-htmlmin',
    'grunt-postcss',
    'grunt-criticalcss',
    'grunt-cssnano-plus',
    'grunt-contrib-clean',
    'grunt-contrib-imagemin',
    'grunt-newer',
    'grunt-contrib-compress',
    'grunt-aws-s3'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  // Register tasks

  // this would be run by typing "grunt dev" on the command line
  grunt.registerTask(
    'dev',
    [
      'newer:imagemin',             // Minify images in the images folder and copy to public/assets/img
      'babel:dev',                  // Compile ES6 to ES5 in the js folder and copy to public/assets/js
      'sass:dev',                   // Compile SASS to CSS in the sass folder and copy to public/assets/css
      'postcss',                    // Perform postcss tasks on css files in public/assets/css
      'compile-handlebars:static',  // Compile handlebar files in the views folder to the public folder
      'htmlmin:dev',                // Minify all HTML files in the public folder
      'watch'                       // Watch for any changes and perform tasks when needed
    ]
  );

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask(
    'default',
    [
      'imagemin',                   // Minify images in the images folder and copy to public/assets/img
      'babel:dist',                 // Compile ES6 to ES5 in the js folder and copy to public/assets/js
      'uglify:dist',                // Minify all JavaScript in the public/assets/js folder
      'sass:dist',                  // Compile SASS to CSS in the sass folder and copy to public/assets/css
      'postcss',                    // Perform postcss tasks on css files in public/assets/css
      'cssnano:subtask1',           // Minify css in public/assets/css
      'cssnano:subtask2',           // Minify css in public/assets/css with the 'safe' option set to 'false'
      'compile-handlebars:static',  // Compile handlebar files in the views folder to the public folder
      'htmlmin:dist',               // Minify all HTML files in the public folder
      'criticalcss:prod',           // Create critical 'above-the-fold' css in public/assets/css
      'cssnano:subtask3',           // Minify the above-the-fold css in public/assets/css
      'clean'                       // Clean folder(s) of left over files
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
    'download',
    [
      'aws_s3:download_production'
    ]
  );

  //  Run server with "grunt run:server"
};
