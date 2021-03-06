'use strict'

var path = require('path');

exports.getLibsFiles = function (BOWER_COMPONENTS) {
    return [
        path.join(BOWER_COMPONENTS, 'jquery/dist/jquery.min.js'),
        path.join(BOWER_COMPONENTS, 'tether/dist/js/tether.min.js'),
        /*path.join(BOWER_COMPONENTS, 'bootstrap/dist/js/bootstrap.min.js'),*/
        path.join(BOWER_COMPONENTS, 'angular/angular.min.js'),
        path.join(BOWER_COMPONENTS, 'angular-route/angular-route.min.js'),
        path.join(BOWER_COMPONENTS, 'angular-sanitize/angular-sanitize.min.js'),
        path.join(BOWER_COMPONENTS, 'angular-resource/angular-resource.min.js'),
        path.join(BOWER_COMPONENTS, 'angular-ui-router/release/angular-ui-router.min.js'),
        path.join(BOWER_COMPONENTS, 'angular-bootstrap/ui-bootstrap-tpls.min.js')
    ];
};

exports.getGlobalAppFiles = function (SRC_JAVASCRIPT_BASE) {
    return [
        path.join(SRC_JAVASCRIPT_BASE, 'utils.js'),
        path.join(SRC_JAVASCRIPT_BASE, 'lazyUtils.js'),
        path.join(SRC_JAVASCRIPT_BASE, 'app.js'),
        path.join(SRC_JAVASCRIPT_BASE, 'directives.js'),
        path.join(SRC_JAVASCRIPT_BASE, '**/*.js'),
        '!' + path.join(SRC_JAVASCRIPT_BASE, 'lib/libs.js'),
        '!' + path.join(SRC_JAVASCRIPT_BASE, 'funciones_dataLayer.js'),
        '!' + path.join(SRC_JAVASCRIPT_BASE, 'datalayer.js'),
        '!' + path.join(SRC_JAVASCRIPT_BASE, 'concant/**/*')
    ];
};

exports.getCssLibsFiles = function (SRC_CSS_BASE) {
    return [
        path.join(SRC_CSS_BASE, 'lib/bootstrap.min.css'),
        path.join(SRC_CSS_BASE, 'lib/bootstrap-theme.min.css')
    ];
};

exports.getModuleFiles = function (rootModule) {
    return [
        rootModule + '/**/*',
        '!' + rootModule + '/css', '!' + rootModule + '/css/**/*',
        '!' + rootModule + '/js', '!' + rootModule + '/js/**/*',
        '!' + rootModule + '/style', '!' + rootModule + '/style/**/*'
    ];
};

exports.getSalesFiles = function () {
    return [
        'sales/**/*',
        '!sales/css', '!sales/css/**/*',
        '!sales/js', '!sales/js/**/*',
        '!sales/modules', '!sales/modules/**/*',
        '!sales/styles', '!sales/styles/**/*'
    ];
};

exports.getUglifySettings = {
    compress: {
        sequences: true,  // join consecutive statemets with the “comma operator”
        properties: true,  // optimize property access: a["foo"] → a.foo
        dead_code: true,  // discard unreachable code
        drop_debugger: true,  // discard “debugger” statements
        unsafe: false, // some unsafe optimizations (see below)
        conditionals: true,  // optimize if-s and conditional expressions
        comparisons: true,  // optimize comparisons
        evaluate: true,  // evaluate constant expressions
        booleans: true,  // optimize boolean expressions
        loops: true,  // optimize loops
        unused: true,  // drop unused variables/functions
        hoist_funs: true,  // hoist function declarations
        hoist_vars: false, // hoist variable declarations
        if_return: true,  // optimize if-s followed by return/continue
        join_vars: true,  // join var declarations
        cascade: true,  // try to cascade `right` into `left` in sequences
        side_effects: true,  // drop side-effect-free statements
        warnings: true,  // warn about potentially dangerous optimizations/code
        global_defs: {}     // global definitions
    }
}