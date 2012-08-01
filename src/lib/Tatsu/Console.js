define([], function () {
	"use strict";

	var i,
		noOp = function () {},
		consoleFallback = function(name) { return console ? console[name] || noOp : noOp; },
		wrappedMethods = ['log', 'info', 'warn', 'error', 'group', 'groupEnd', 'time', 'trace'],
		wrapper = {};

	for (i = 0; i < wrappedMethods.length; ++i) {
		wrapper[wrappedMethods[i]] = consoleFallback(wrappedMethods[i]);
	}

	return wrapper;
});