module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws-keys.json'), // Read the file
    aws_s3: {
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
          bucket: 'sitterstar.com',
          differential: true, // Only uploads the files that have changed
          gzipRename: 'ext', // when uploading a gz file, keep the original extension
        },
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['*'],
            dest: '/'
          },
          {
            expand: true,
            cwd: 'public/assets/',
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
          bucket: 'sitterstar.com',
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
          bucket: 'sitterstar.com'
        },
        files: [
          {
            dest: '/',
            cwd: 'backup/',
            action: 'download'
          }, // Downloads the content of app/ to backup/
          {
            dest: 'assets/',
            cwd: 'backup-assets/',
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
          cwd: 'js',
          src: ['**/*.js'],
          dest: 'public/assets/js',
          ext: '.min.js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'js',
          src: ['**/*.js'],
          dest: 'public/assets/js',
          ext: '.js'
        }]
      }
    },
    clean: {  // Clean folder(s) of left over files
      css: ['public/assets/css/**/*.css', '!public/assets/css/**/*.min.css'],
      js: ['public/assets/js/**/*.js', '!public/assets/js/**/*.min.js'],
      allMap: ['public/assets/**/*.map']
    },
    'compile-handlebars': { // Compile handlebars files
      static: {
        files: [{
          expand: true,
          cwd: './views/',
          src: '*.hbs',
          dest: './public/',
          ext: '.html'
        }],
        helpers: '*.js',
        partials: 'views/partials/*.hbs',
        registerFullPath: true,
        templateData: 'views/mock_data/en.json'
      },
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'public/assets/',
        src: ['**/*'],
        dest: 'public/assets/'
      }
    },
    criticalcss: {  // Create above-the-fold CSS
      dev: {
        options: {
          url: 'http://localhost:3000/default.html',
          width: 1200,
          height: 900,
          outputfile: 'public/assets/css/sstar-above-the-fold.css',
          filename: 'public/assets/css/sstar-main.min.css', // Using path.resolve( path.join( ... ) ) is a good idea here
          buffer: 800 * 1024,
          ignoreConsole: false
        }
      },
      prod: {
        options: {
          url: 'http://localhost:3000',
          width: 1200,
          height: 900,
          outputfile: 'public/assets/css/sstar-above-the-fold.css',
          filename: 'public/assets/css/sstar-main.min.css', // Using path.resolve( path.join( ... ) ) is a good idea here
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
          'public/assets/css/sstar-main.min.css': 'public/assets/css/sstar-main.css',
          'public/assets/css/sstar-web-fonts.min.css': 'public/assets/css/sstar-web-fonts.css',
        }
      },
      subtask2: {
        options: {
          safe: false
        },
        files: {
          'public/assets/css/font-awesome.min.css': 'public/assets/css/font-awesome.css',
        }
      },
      subtask3: {
        files: {
          'public/assets/css/sstar-above-the-fold.min.css': 'public/assets/css/sstar-above-the-fold.css',
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
          cwd: 'public',
          src: ['**/*.html'],
          dest: 'public'
        }]
      },
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'public',
          src: ['**/*.html'],
          dest: 'public'
        }]
      }
    },
    imagemin: { // Minify images
      dynamic: {
        files: [{
          expand: true,
          cwd: 'images',
          src: ['*.{png,jpg,gif,svg}'],
          dest: 'public/assets/img/'
        }]
      }
    },
    postcss: {  // Postprocessing in CSS files
      options: {
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'public/assets/css/' // ...to the specified directory
        },
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: ['last 2 versions']}), // add vendor prefixes
        ]
      },
      dist: {
        src: 'public/assets/css/*.css'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    run: {
      server: { // Start http-server on port 3000
        cmd: 'node_modules\\.bin\\http-server.cmd',
        args: ['-p 3000'],
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
          cwd: 'sass',
          src: '*.scss',
          dest: 'public/assets/css',
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
          cwd: 'sass',
          src: '*.scss',
          dest: 'public/assets/css',
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
          cwd: 'public/assets/js',
          src: '**/*.js',
          dest: 'public/assets/js',
          ext: '.min.js'
        }]
      }
    },
    watch: {
      imagemin: {
        files: ['images/*.{png,jpg,gif,svg}'],
        tasks: ['imagemin']
      },
      babel: {
        files: ['js/**/*.js'],
        tasks: ['babel:dev']
      },
      sass: {
        files: ['sass/**/*.{scss,sass}', 'sass/_partials/**/*.{scss,sass}'],
        tasks: ['sass:dev', 'postcss']
      },
      handlebars: {
        files: ['views/**/*.{hbs,handlebars}'],
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
      // 'criticalcss:dev',            // Create critical 'above-the-fold' css in public/assets/css
      // 'cssnano:subtask3',           // Minify the above-the-fold css in public/assets/css
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
