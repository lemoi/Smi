const gulp=require("gulp");
const babel=require('gulp-babel');
const csso=require("gulp-csso");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps=require('gulp-sourcemaps');
gulp.task('compressJS', function() {
  return gulp.src('src/smi_js/*.js')
 	.pipe(babel({presets:['es2015']}))
    .pipe(gulp.dest('babel'))
 	.pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});
gulp.task('compressCss', function() {
  return gulp.src("src/smi_css/*.css")
    .pipe(concat('smi.css'))
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
   
});
gulp.task('default',['compressJS','compressCss']);