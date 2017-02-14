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
	ngAnnotate 		= require('gulp-ng-annotate'),
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
	SRC_JS_LIBS_FILES 	= 'js/lib',
	HTML_FILES_WATCH;

var FILES_SASS_GLOBAL 	= SRC_SASS_BASE + '/**/*.scss',
	FILES_JS_BASE = [path.join(SRC_JAVASCRIPT_BASE, '**/*.js'), 
					'!' + path.join(SRC_JAVASCRIPT_BASE, 'concat/**/*'),
					'!' + path.join(SRC_JAVASCRIPT_BASE, 'lib/**/*')],

	FILES_JS_BASE_WATCH = path.join(SRC_JAVASCRIPT_BASE, 'concat/**/*');

var SRC_PROJECT, MODULE_NAME, SASS_FILES_PROJECT, MODULE_JS_FILES, MODULE_JS_FILES_WATCH, INDEX_SERVER_FILE;
	//JS_EXTERNAL_FILES = SRC_JAVASCRIPT_BASE + '/*.js',
	//IMAGES_FILES 		= SRC_IMAGES_BASE + '/**/*',
	//ICON_FILES 			= SRC_FONTS_BASE + '/**/*',
	//DATA_FILES 			= SRC_DATA_BASE + '/**/*.json',
	//INDEX_SERVER_FILE 	= '';


function setProjectVars(){
		SASS_FILES_PROJECT 		= SRC_PROJECT + '/style/**/*.scss',
		MODULE_JS_FILES 		= [SRC_PROJECT+'/js/**/*', '!'+SRC_PROJECT+'/js/concat/**/*'],
		MODULE_JS_FILES_WATCH 	= SRC_PROJECT + '/js/concat/**/*.js';
		HTML_FILES_WATCH 		= [ENVIRONMENT + '/inicio.html', SRC_PROJECT + '/**/*.html' ]
		//IMAGES_FILES = SRC_IMAGES_BASE + '/**/*',
		//ICON_FILES = SRC_FONTS_BASE + '/**/*',
		//DATA_FILES = SRC_DATA_BASE + '/**/*.json',
}

var JS_FILES_EXTERNAL_ORDER = configFiles.getLibsFiles(BOWER_COMPONENTS),
	JS_GLOBAL_APP_ORDER 	= configFiles.getGlobalAppFiles(SRC_JAVASCRIPT_BASE),
	CSS_FILES_EXTERNAL_ORDER = configFiles.getCssLibsFiles(SRC_CSS_BASE),
	PROJECTS_NAMES			= configProject.getProjects(),
	uglifyOptions 			= configFiles.getUglifySettings;

gulp.task("run-dev", gulp.series(start, cleanAllJs, gulp.parallel(sassFunctionGlobal, sassFunctionModule, jsConcatLibsFunction, jsConcatGlobalFunction, jsConcatAppFunction, copyBowerStyles, cssConcatLibs), connectServer));

gulp.task("deploy-run", gulp.series(cleanBuild, copyBowerStyles, cssConcatLibs, gulp.parallel(sassFunctionGlobal, copyFunctionDeployModules, jsConcatLibsFunction, jsConcatGlobalFunction)));

gulp.task("deploy-run-server", gulp.series(start, cleanBuild, copyBowerStyles, cssConcatLibs, gulp.parallel(sassFunctionGlobal, copyFunctionDeployModules, jsConcatLibsFunction, jsConcatGlobalFunction), connectServerDeploy));


gulp.task("watch", function (done) {
	gulp.watch(FILES_SASS_GLOBAL, gulp.series(sassFunctionGlobal));
	gulp.watch(SASS_FILES_PROJECT, gulp.series(sassFunctionModule));
	gulp.watch(FILES_JS_BASE, gulp.series(jsConcatGlobalFunction));
	gulp.watch(MODULE_JS_FILES, gulp.series(cleanJsModule, jsConcatAppFunction));
	gulp.watch([MODULE_JS_FILES_WATCH, FILES_JS_BASE_WATCH, HTML_FILES_WATCH]).on('change', browserSync.reload);
	//gulp.watch(ICON_FILES, gulp.series('copyIcons'));
	//gulp.watch(IMAGES_FILES, gulp.series("copyImg"));
	//gulp.watch(DATA_FILES, gulp.series('copyData'));
	return done();
});


function setEnvironmentEnv(done) {
	ENVIRONMENT = FOLDER_DEV;
	done();
};

function setEnvironmentProd(done) {
	ENVIRONMENT = FOLDER_BUILD;
	done();
};

function cleanAllJs() {
	return del([path.join(ENVIRONMENT, SRC_JS_LIBS_FILES), 
					path.join(ENVIRONMENT, 'js/concat'),
					path.join(SRC_PROJECT, '/js/concat') ]);
};

function cleanJsGlobal() {
	return del([path.join(SRC_JAVASCRIPT_BASE, 'concat')]);
};

function cleanJsModule() {
	return del([SRC_PROJECT + '/js/concat']);
};

function cleanBuild() {
	return del([FOLDER_BUILD]);
}

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

function sassFunctionModule() {
	showComment('Changed SASS File');
	return gulp.src(SRC_PROJECT + '/style/style.scss')
		.pipe(sourcemaps.init())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sass()))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, sass({ outputStyle: 'compressed' })))
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, cleanCSS()))
		.pipe(gulp.dest(path.join(SRC_PROJECT, 'css')))
		.pipe(browserSync.stream()).on('error', gutil.log);
};

function copyFunctionDeployModules(done) {
	PROJECTS_NAMES.forEach(function (moduleName) {
		var rootModule = FOLDER_DEV + '/modules/' + moduleName;
		sassFunctionDeploy(rootModule + '/style/', moduleName);
		
		jsConcatAppFunctionDeploy(
			[rootModule + '/js/**/*js', '!' + rootModule + '/js/concat' ], 
			path.join(ENVIRONMENT + '/sales/modules/' + moduleName + '/js/concat'), 
			"scriptApp.js"
		);

		var filesToCopy = configFiles.getModuleFiles(rootModule),
			destination = ENVIRONMENT + '/sales/modules/' + moduleName;
		copyModuleFiles(filesToCopy, destination);
	});
	copySalesFiles();
	copyRootFiles();
	return done();
};

function sassFunctionGlobal() {
	showComment('Changed SASS File');
	return gulp.src(FOLDER_ASSETS + '/styles/style.scss')
		.pipe(sourcemaps.init())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sass()))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, sass({ outputStyle: 'compressed' })))
		.pipe(autoprefixer())
		.pipe(rename('globalStyle.css'))
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, cleanCSS()))
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, gulp.dest(path.join(ENVIRONMENT, 'css'))))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gulp.dest(path.join(ENVIRONMENT, '/sales/css'))))
		.pipe(browserSync.stream()).on('error', gutil.log);
};

function cssConcatLibs(done) {

	gulp.src(CSS_FILES_EXTERNAL_ORDER)
		.pipe(concat('libs-concat.min.css')) // concat pulls all our files together before minifying them
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, gulp.dest(path.join(ENVIRONMENT, 'css/'))))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gulp.dest(path.join(ENVIRONMENT, 'sales/css/'))))
		.on('error', gutil.log);
	done();
}

function jsConcatLibsFunction(done) {
	gulp.src(JS_FILES_EXTERNAL_ORDER)
		.pipe(concat('libs.js')) // concat pulls all our files together before minifying them
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, gulp.dest(path.join(ENVIRONMENT, SRC_JS_LIBS_FILES))))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gulp.dest(path.join(ENVIRONMENT, 'sales/' + SRC_JS_LIBS_FILES))))
		.on('error', gutil.log);
	done();
};

function jsConcatGlobalFunction(done) {
	var destination = path.join(ENVIRONMENT, 'js/concat');
	if(ENVIRONMENT == FOLDER_BUILD){
		destination = path.join(ENVIRONMENT, 'sales/js/concat');
	}
	return jsFunction(JS_GLOBAL_APP_ORDER, destination, "scriptGlobalApp.js", done);
}

function jsConcatAppFunction(done) {
	return jsFunction(SRC_PROJECT + '/js/**/*js', path.join(SRC_PROJECT, '/js/concat'), "scriptApp.js", done);
}

function jsFunction(source, destination, nameFile, done){
	gulp.src(source)
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.init()))
		.pipe(concat(nameFile)) // concat pulls all our files together before minifying them
		.pipe(ngAnnotate())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gpUglify(uglifyOptions)))
		.pipe(gulp.dest(destination))
		.on('error', gutil.log);
	done();
}

function connectServer(done) {
	browserSync.init({
		port: serverPort,
		server: {
			baseDir: './',
			middleware: [{
				route: '/',
				handle: function (req, res, next) {
					res.writeHead(302, { 'Location': 'sales/inicio.html#/' + MODULE_NAME + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080' });
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

/*DEPLOY *********************************************************/

function sassFunctionDeploy(stylePath, moduleName) {
	return gulp.src(stylePath + '/style.scss')
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest(ENVIRONMENT + '/sales/modules/' + moduleName + '/css'))
		.on('error', gutil.log);
};

function jsConcatAppFunctionDeploy(source, destination, nameFile) {
	gulp.src(source)
		.pipe(concat(nameFile)) // concat pulls all our files together before minifying them
		.pipe(ngAnnotate())
		.pipe(gpUglify(uglifyOptions))
		.pipe(gulp.dest(destination))
		.on('error', gutil.log);
}

function copyModuleFiles(filesToCopy, destination) {
	gulp.src(filesToCopy)
		.pipe(gulp.dest(destination).on('error', gutil.log));
};

function copySalesFiles() {
	gulp.src(configFiles.getSalesFiles())
		.pipe(gulp.dest(ENVIRONMENT + '/sales').on('error', gutil.log));
};

function copyRootFiles() {
	gulp.src(['.settings/**/*', 'fbin/**/*'], { base: "." })
		.pipe(gulp.dest(ENVIRONMENT).on('error', gutil.log));
};


function connectServerDeploy(done) {
	browserSync.init({
		port: serverPort,
		server: {
			baseDir: './build',
			middleware: [{
				route: '/',
				handle: function (req, res, next) {
					res.writeHead(302, { 'Location': 'sales/inicio.html#/' + MODULE_NAME + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080' });
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

function finishMsg(msg) {
	setTimeout(function () {
		showComment(msg);
		log(' GOOD CODE...');
		log('');
	}, 100);
}


gulp.task('run', gulp.series(setEnvironmentEnv, 'run-dev', 'watch', function runDev() {
	runFirstTime = false;
	finishMsg('YOU CAN START YOUR WORK in http://localhost:' + serverPort + '/sales/inicio.html#/' + MODULE_NAME + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080');
}));

gulp.task('run-deploy-server', gulp.series(setEnvironmentProd, 'deploy-run-server', function runDeployServer() {
	runFirstTime = false;
	finishMsg('YOU CAN SEE YOUR WORK in http://localhost:' + serverPort + '/sales/inicio.html#/' + MODULE_NAME + '/' + INDEX_SERVER_FILE + '?targetHost=http://localhost:8080');
}));

gulp.task('run-deploy', gulp.series(setEnvironmentProd, 'deploy-run', function runDeploy(done) {
	runFirstTime = false;
	finishMsg('IS DEPLOYED in "' + FOLDER_BUILD + '" folder');
	return done();
}));