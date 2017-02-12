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

var SRC_CSS_BASE 		= path.join(FOLDER_ASSETS, 'css'),
	SRC_SASS_BASE 		= path.join(FOLDER_ASSETS, 'style'), // ver
	SRC_IMAGES_BASE 	= path.join(FOLDER_ASSETS, 'img/shared'),
	SRC_JAVASCRIPT_BASE = path.join(FOLDER_ASSETS, 'js'),
	SRC_MODULES_BASE 	= path.join(FOLDER_ASSETS, 'modules'),
	SRC_VIEWS_BASE 		= path.join(FOLDER_ASSETS, 'views'),
	SRC_FONTS_BASE 		= path.join(FOLDER_ASSETS, 'icons'),
	SRC_DATA_BASE 		= path.join(FOLDER_ASSETS, 'data'),
	SRC_JS_LIBS_FILES 	= path.join(SRC_JAVASCRIPT_BASE, 'lib');

var SRC_PROJECT, MODULE, SASS_FILES_PROJECT, MODULE_JS_FILES, INDEX_SERVER_FILE;
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

var JS_FILES_EXTERNAL_ORDER = configFiles.getLibsFiles(SRC_JS_LIBS_FILES),
	JS_FILES_APP_ORDER 		= configFiles.getAppFiles(SRC_JAVASCRIPT_BASE);

var ENVIRONMENT = FOLDER_DEV,
	runFirstTime = true;

var uglifyOptions = configFiles.getUglifySettings;

gulp.task("sass", gulp.series(sassFunction));

function start (done){
	var projectElement 	= configProject.selectProject(process); //Envio como parámetro a los argumentos del comando.
	if (projectElement) {
		SRC_PROJECT = path.join(SRC_MODULES_BASE, projectElement.module); //Genero la ruta del proyecto.
		INDEX_SERVER_FILE = projectElement.clearIndex; //Almaceno el index de la página como global
		MODULE = projectElement.module; //Almaceno el Módulo a trabajar como global
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

function connectServer(done) {
	browserSync.init({
		port: serverPort,
		server: {
			baseDir: ENVIRONMENT,
			middleware: [{
				route: "/",
				handle: function (req, res, next) {
					res.writeHead(302, { 'Location': 'inicio.html#/' + MODULE + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080' });
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


function showComment(string) {
	if (runFirstTime) { return; }
	log('');
	log('------------------------------------------------');
	log(string);
	log('------------------------------------------------');
	return;
};


gulp.task("run", gulp.series(start, sassFunction, connectServer));