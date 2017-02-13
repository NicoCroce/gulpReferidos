'use strict';

var  serverPort 	= 8089;

var configProject 	= require('./config/config-project'),
	configFiles		= require('./config/config-files'),
	gulp 			= require("gulp"),//http://gulpjs.com/
	gutil 			= require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass 			= require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer 	= require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	cleanCSS 		= require('gulp-clean-css'),//https://www.npmjs.com/package/gulp-clean-css
	rename 			= require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps 		= require('gulp-sourcemaps'), //Genera un mapa de referencias para los archivos. 
	path 			= require('path'), //Es de Node. Concatena.
	merge 			= require('merge-stream'),
	concat 			= require('gulp-concat'),
	del 			= require('del'),
	gpUglify 		= require('gulp-uglify'),
	gulpif 			= require('gulp-if'),
	browserSync 	= require('browser-sync').create(),
	log 			= gutil.log;

var FOLDER_ASSETS 		= 'sales',
	FOLDER_DEV 			= 'sales',
	FOLDER_BUILD 		= 'build',
	BOWER_COMPONENTS 	= 'bower_components';

var ENVIRONMENT 		= FOLDER_DEV,
	runFirstTime 		= true;

var SRC_CSS_BASE 		= path.join(FOLDER_ASSETS, 'css'),
	SRC_SASS_BASE 		= path.join(FOLDER_ASSETS, 'styles'),
	SRC_IMAGES_BASE 	= path.join(FOLDER_ASSETS, 'img/shared'),
	SRC_JAVASCRIPT_BASE = path.join(FOLDER_ASSETS, 'js'),
	SRC_MODULES_BASE 	= path.join(ENVIRONMENT, 'modules'),
	SRC_VIEWS_BASE 		= path.join(FOLDER_ASSETS, 'views'),
	SRC_FONTS_BASE 		= path.join(FOLDER_ASSETS, 'icons'),
	SRC_DATA_BASE 		= path.join(FOLDER_ASSETS, 'data'),
	SRC_JS_LIBS_FILES 	= 'js/lib';

var SRC_PROJECT, MODULE_NAME, SASS_FILES_PROJECT, MODULE_JS_FILES, INDEX_SERVER_FILE;
	//JS_EXTERNAL_FILES = SRC_JAVASCRIPT_BASE + '/*.js',
	//IMAGES_FILES 		= SRC_IMAGES_BASE + '/**/*',
	//ICON_FILES 			= SRC_FONTS_BASE + '/**/*',
	//DATA_FILES 			= SRC_DATA_BASE + '/**/*.json',
	//INDEX_SERVER_FILE 	= '';


function setProjectVars(){
	var SASS_FILES_PROJECT = SRC_PROJECT + 'style/**/*.scss';
		//MODULE_JS_FILES = SRC_MODULE_BASE + '/**/*.js',
		//JS_EXTERNAL_FILES = SRC_JAVASCRIPT_BASE + '/*.js',
		//IMAGES_FILES = SRC_IMAGES_BASE + '/**/*',
		//ICON_FILES = SRC_FONTS_BASE + '/**/*',
		//DATA_FILES = SRC_DATA_BASE + '/**/*.json',
		//INDEX_SERVER_FILE = '';
}

var JS_FILES_EXTERNAL_ORDER = configFiles.getLibsFiles(BOWER_COMPONENTS),
	JS_GLOBAL_APP_ORDER 	= configFiles.getGlobalAppFiles(SRC_JAVASCRIPT_BASE),
	CSS_FILES_EXTERNAL_ORDER = configFiles.getGlobalAppFiles(BOWER_COMPONENTS),
	uglifyOptions 			= configFiles.getUglifySettings;



gulp.task("sass", gulp.series(sassFunction));

function cleanAllJs() {
	return del([path.join(ENVIRONMENT, SRC_JS_LIBS_FILES), 
					path.join(ENVIRONMENT, 'js/concat'),
					path.join(SRC_PROJECT, '/js/concat') ]);
};

function start (done){
	var projectElement 	= configProject.selectProject(process); //Envio como parámetro a los argumentos del comando.
	if (projectElement) {
		SRC_PROJECT = path.join(SRC_MODULES_BASE, projectElement.module); //Genero la ruta del proyecto.
		INDEX_SERVER_FILE = projectElement.clearIndex; //Almaceno el index de la página como global
		MODULE_NAME = projectElement.module; //Almaceno el Módulo a trabajar como global
		setProjectVars();
	}
	return done();
};

function sassFunction() {
	showComment('Changed SASS File');
	return gulp.src(SRC_PROJECT + '/style/style.scss')
		.pipe(sourcemaps.init())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sass()))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, sass({ outputStyle: 'compressed' })))
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, cleanCSS()))
		.pipe(gulp.dest(path.join(SRC_PROJECT, 'css')));
		/*.pipe(browserSync.stream()).on('error', gutil.log);*/
};

function cssConcatLibs(done) {
	gulp.src(CSS_FILES_EXTERNAL_ORDER)
		.pipe(concat('libs.js')) // concat pulls all our files together before minifying them
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'js/min/'))).on('error', gutil.log);
	done();
}

function jsConcatLibsFunction(done) {
	gulp.src(JS_FILES_EXTERNAL_ORDER)
		.pipe(concat('libs.js')) // concat pulls all our files together before minifying them
		.pipe(gulp.dest(path.join(ENVIRONMENT, SRC_JS_LIBS_FILES))).on('error', gutil.log);
	done();
};

function jsConcatGlobalFunction(done) {
	return jsFunction(JS_GLOBAL_APP_ORDER, path.join(ENVIRONMENT, 'js/concat'), "scriptGlobalApp.js", done);
}

function jsConcatAppFunction(done) {
	return jsFunction(SRC_PROJECT + '/js/**/*js', path.join(SRC_PROJECT, '/js/concat'), "scriptApp.js", done);
}

function jsFunction(source, destination, nameFile, done){
	gulp.src(source)
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.init()))
		.pipe(concat(nameFile)) // concat pulls all our files together before minifying them
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gpUglify(uglifyOptions)))
		.pipe(gulp.dest(destination)).on('error', gutil.log);
	done();
}

function connectServer(done) {
	browserSync.init({
		port: serverPort,
		server: {
			baseDir: ENVIRONMENT,
			middleware: [{
				route: "/",
				handle: function (req, res, next) {
					res.writeHead(302, { 'Location': 'inicio.html#/' + MODULE_NAME + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080' });
					res.end();
					next();
				}
			}],
		},
		ui: {
			port: 2222,
		}
	});

	return done();
};

function copyBowerStyles() {
	var jeet = gulp.src('node_modules/jeet/scss/**/*')
		.pipe(gulp.dest(FOLDER_ASSETS + '/styles/libs/jeet'));
	var normalize = gulp.src(BOWER_COMPONENTS + '/normalize-scss/sass/**/*')
		.pipe(gulp.dest(FOLDER_ASSETS + '/styles/libs/normalize/'));
	return merge(jeet, normalize);
};

function showComment(string) {
	if (runFirstTime) { return; }
	log('');
	log('------------------------------------------------');
	log(string);
	log('------------------------------------------------');
	return;
};


gulp.task("run", gulp.series(start, cleanAllJs, gulp.parallel(sassFunction, jsConcatLibsFunction, jsConcatGlobalFunction, jsConcatAppFunction, copyBowerStyles)/*, connectServer*/ ));

/*gulp.task("nico", gulp.series(start, cleanAllJs));*/