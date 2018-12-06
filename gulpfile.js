const gulp = require('gulp');
const fs = require('fs');
const del = require('del');

// Flags
const minimist = require('minimist');
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};
const options = minimist(process.argv.slice(2), knownOptions);

// Plugins
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const data = require('gulp-data');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');

// Sass
gulp.task('sass', () => {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(concat('combined.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js', () => {
  const b = browserify({
    entries: './app/js/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist/js'));
});

// Images
gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe(newer('dist/images/'))
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('dist/images/'));
});

// Nunjucks
gulp.task('nunjucks', () => {
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() {
      return JSON.parse(fs.readFileSync('./app/data.json'));
    }))
    // Renders template with nunjucks
    .pipe(nunjucksRender({
      path: ['app/pages/templates']
    }))
    .pipe(gulp.dest('dist'));
});

// Minify
gulp.task('minify', () => {
  return gulp.src('dist/**/*')
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.html', htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })))
    .pipe(gulp.dest('dist'));
});

// Clean dist folder
gulp.task('build:clean', () => {
  return del.sync('dist/*');
})

// Basic dev build
gulp.task('build', (callback) => {
  runSequence(['sass', 'js', 'images', 'nunjucks'], callback);
});

// Build and reload
gulp.task('build:live', (callback) => {
  if (options.env === 'production') {
    runSequence('build', 'minify', () => {
      browserSync.reload();
      callback();
    });
  } else {
    runSequence('build', () => {
      browserSync.reload();
      callback();
    });
  }
});

// Production build with minification
gulp.task('build:production', (callback) => {
  runSequence('build:clean', 'build', 'minify', callback);
});

// Watch
gulp.task('serve', () => {
  runSequence('build:clean', 'build:live', () => {
    // Init Browsersync
    browserSync.init({
      server: 'dist'
    });

    // Sass
    gulp.watch('app/scss/**/*.scss', ['sass']);

    // Nunjucks
    gulp.watch('app/pages/**/*.nunjucks', ['build:live']);

    // Data file
    gulp.watch('app/data.json', ['build:live']);

    // JS
    gulp.watch('app/js/**/*.js', ['build:live']);

    // Images
    gulp.watch('app/images/**/*', ['build:live']);
  });
});
