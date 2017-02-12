'use strict'

var path = require('path');

exports.getLibsFiles = function (SRC_JS_LIBS_FILES) {
    return [
        path.join(SRC_JS_LIBS_FILES + '/jquery/dist/jquery-3.1.0.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/bootstrap.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/angular.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/angular-route.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/angular-sanitize.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/angular-resource.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/angular-ui-router.min.js'),
        path.join(SRC_JS_LIBS_FILES + '/angular/ui-bootstrap-tpls-2.5.0.min.js')
    ];
};

exports.getAppFiles = function (SRC_JAVASCRIPT_BASE) {
    return [
        path.join(SRC_JAVASCRIPT_BASE + '/utils.js'),
        path.join(SRC_JAVASCRIPT_BASE + '/lazyUtils.js'),
        path.join(SRC_JAVASCRIPT_BASE + '/app.js'),
        path.join(SRC_JAVASCRIPT_BASE + '/directives.js'),
        path.join(SRC_JAVASCRIPT_BASE + '/**/*.js')
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