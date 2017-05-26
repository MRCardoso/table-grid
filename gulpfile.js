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
  return gulp.src(['src/js/table-grid.js', 'build/table-grid.tpl.js'])
    .pipe(concat('table-grid.tpl.js'))
    .pipe(rename('table-grid.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('table-grid.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('template', function() {
  return gulp.src('src/templates/**/*.html')
    .pipe(ngTemplates({ module: 'table.grid' }))
    .pipe(rename('table-grid.tpl.js'))
    .pipe(gulp.dest('dist'));
});
/*
| --------------------------------------------------------------------
| GENERATE CSS FILE
| --------------------------------------------------------------------
*/
gulp.task('css-prod', function(){
    return gulp.src('src/css/table-grid.css')
        .pipe(gulp.dest('dist'))
        .pipe(minifyCss())
        .pipe(rename('table-grid.min.css'))
        .pipe(gulp.dest('dist'));
})

/*
| --------------------------------------------------------------------
| DFAULT TASK  
| --------------------------------------------------------------------
*/
gulp.task('default', ['scripts-prod', 'css-prod']);