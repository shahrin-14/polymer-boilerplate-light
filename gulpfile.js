var gulp = require('gulp')

//var request = require('request')
var vulcanize = require('gulp-vulcanize')
var crisper = require('gulp-crisper')
var babel = require('gulp-babel')
var serve = require('gulp-serve')
var clean = require('gulp-clean')
var tap = require('gulp-tap')

gulp.task('clean', function () {
    //This cleans out all the contents of the Dist folder except for the StaticComponents folder
    return gulp.src(['dist/*','!dist/StaticComponents'], {read: false})
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(clean());
});
gulp.task('cleanCopy',['clean'],function(){
    //This will copy anything in the src folder except for CustomComponents folder and StaticComponents folder
    //The custom components will be built by Babel
    return gulp.src(['src/**/*', '!src/CustomComponents/**/*','!src/StaticComponents/**/*'])
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(gulp.dest('dist'));
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
            excludes: ['dist/StaticComponents/polymer/polymer.html'],
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

/*
Gulp tasks below are only used to maintain and build the StaticComponents folder
*/


var download = require('gulp-download-stream')
var ExternalResources = [
    { 
        url : 'https://polygit.org/components/polymer/polymer.html', 
        dest : "src/StaticComponents/polymer" 
    },{ 
        url : 'https://polygit.org/components/polymer/polymer-mini.html', 
        dest : "src/StaticComponents/polymer" 
    },{ 
        url : 'https://polygit.org/components/polymer/polymer-micro.html', 
        dest : "src/StaticComponents/polymer" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-flex-layout/master/iron-flex-layout.html', 
        dest : "src/StaticComponents/iron-flex-layout" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-icon/master/iron-icon.html', 
        dest : "src/StaticComponents/iron-icon" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-icons/master/iron-icons.html', 
        dest : "src/StaticComponents/iron-icons" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-iconset-svg/master/iron-iconset-svg.html', 
        dest : "src/StaticComponents/iron-iconset-svg" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-meta/master/iron-meta.html', 
        dest : "src/StaticComponents/iron-meta" 
    },{
        url : 'https://raw.githubusercontent.com/PolymerElements/iron-meta/master/iron-meta.html', 
        dest : "src/StaticComponents/iron-meta" 
    },{
        url : 'https://polygit.org/components/webcomponentsjs/webcomponents-lite.min.js', 
        dest : "src/StaticComponents/webcomponentsjs" 
    }
  ]

ExternalResources = ExternalResources.map(function(resource){ 
    gulp.task('download-'+resource.url,function(res){
        return download(resource.url, {
                //proxy : "http://<my-proxy-server>:<port-number>"
            })
            .pipe(gulp.dest(resource.dest));
            
    })
    return 'download-'+resource.url
})
gulp.task('initialize-ExternalResources',ExternalResources)

gulp.task('build-ExternalResources',function(){
    //This will copy anything in the src folder except for CustomComponents folder and StaticComponents folder
    //The custom components will be built by Babel
    return gulp.src(['src/StaticComponents/**/*'])
        .pipe(tap(function(file,t) { console.log(file.path) }))
        .pipe(gulp.dest('dist/StaticComponents'));
})

//https://github.com/PolymerElements/iron-flex-layout/archive/v1.3.1.zip