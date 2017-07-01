/*
| --------------------------------------------------------------------
| REQUIRED  
| --------------------------------------------------------------------
*/
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat       = require('gulp-concat'),
    ngTemplates  = require('gulp-angular-templatecache'),
    minifyCss    = require('gulp-minify-css');

/*
| --------------------------------------------------------------------
| GENERATE SCRIPTS WITH TEMPLATES
| --------------------------------------------------------------------
*/
gulp.task('scripts-prod', ['template'], function() {
  return gulp.src([
      'src/**/*.js',
      '!src/**/*.backup.js',
    ])
    .pipe(concat('table-grid.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('table-grid.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('template', function() {
  return gulp.src('src/templates/**/*.html')
    .pipe(ngTemplates({ module: 'table.grid' }))
    .pipe(rename('table-grid.tpl.js'))
    .pipe(gulp.dest('src/js'));
});
/*
| --------------------------------------------------------------------
| GENERATE CSS FILE
| --------------------------------------------------------------------
*/
gulp.task('css-prod', function(){
    return gulp.src(['src/css/table-grid.css', 'src/**/*.css'])
        .pipe(concat('table-grid.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifyCss())
        .pipe(rename('table-grid.min.css'))
        .pipe(gulp.dest('dist/css'));
})

/*
| --------------------------------------------------------------------
| DFAULT TASK  
| --------------------------------------------------------------------
*/
gulp.task('default', ['scripts-prod', 'css-prod']);