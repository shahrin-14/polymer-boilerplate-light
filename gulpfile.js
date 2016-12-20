var gulp = require('gulp')

var vulcanize = require('gulp-vulcanize')
var crisper = require('gulp-crisper')
var babel = require('gulp-babel')
var serve = require('gulp-serve')
var clean = require('gulp-clean')
var tap = require('gulp-tap')

gulp.task('clean', function () {
    //This cleans out all the contents of the Dist folder except for the VendorComponents folder
    return gulp.src(['dist/*','!dist/VendorComponents'], {read: false})
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(clean());
});
gulp.task('cleanCopy',['clean'],function(){
    //This will copy anything in the src folder except for CustomComponents folder and VendorComponents folder
    //The custom components will be built by Babel
    return gulp.src(['src/**/*', '!src/CustomComponents/**/*','!src/VendorComponents/**/*'])
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(gulp.dest('dist'));
})

gulp.task('copy-VendorComponents',function(){
    //This will copy anything in the src folder except for CustomComponents folder and VendorComponents folder
    //The custom components will be built by Babel
    return gulp.src(['src/VendorComponents/**/*'])
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(gulp.dest('dist/VendorComponents'));
})

gulp.task('crisper',['cleanCopy'], function() {
  return gulp.src('src/CustomComponents/*.html')
    .pipe(tap(function(file,t) { console.log(file.path) }))
    .pipe(crisper({
        scriptInHead: false, // true is default 
        onlySplit: false
    }))
    .pipe(gulp.dest('dist/CustomComponents'));
});

var babeilfy = 

gulp.task('babelify',['crisper'], function() {
    return gulp.src('dist/CustomComponents/*.js')
    .pipe(tap(function(file,t) { console.log(file.path) }))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/CustomComponents'));
});

gulp.task('vulcanize',['crisper','babelify'], function() {
    //Vulcanize selected files for optimization
    return gulp.src(['dist/CustomComponents/icon-toggle.html'])
        .pipe(vulcanize({
            excludes: ['dist/VendorComponents/polymer/polymer.html'],
            stripExcludes: false,
            stripComments : true,
            inlineScripts: true
            //abspath: '',
            //excludes: [],
            //stripExcludes: false,
            //inlineScripts: false
        }))
        .pipe(gulp.dest('dist/CustomComponents'))
        .pipe(tap(function(file,t) {
            //Remove associating javascript file
            var javascriptPath = file.path.replace('.html','.js')
            console.log(javascriptPath)
            return gulp.src(javascriptPath, {read: false}).pipe(clean())
        }));
});

gulp.task('build', ['crisper','babelify','vulcanize']);
gulp.task('serve', serve({root: ['dist']}));