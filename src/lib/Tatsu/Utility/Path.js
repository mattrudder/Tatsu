/* Path.js: methods for manipulating paths used in Tatsu.
 *
 * Includes parseUri regular expressions
 * http://blog.stevenlevithan.com/archives/parseuri
 * Copyright 2007, Steven Levithan
 * Released under the MIT license.
 */
define(function () {
	"use strict";

	// TODO: Integrate a better regex:
	// '\b((?:[a-zA-Z0-9\-]+?://|[wW]{3}\d{0,3}[.]|[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,4}/?)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'"".,<>?«»“”‘’]))'
	var parseUri = function (str, strictMode) {
			var parsers = {
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				},
				keys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
				q = {
					name: "queryKey",
					parser: /(?:^|&)([^&=]*)=?([^&]*)/g
				},
				m = parsers[strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i = 14;

			while (i--) {
				uri[keys[i]] = m[i] || "";
			}

			uri[q.name] = {};
			uri[keys[12]].replace(q.parser, function ($0, $1, $2) {
				if ($1) {
					uri[q.name][$1] = $2;
				}
			});

			return uri;
		},
		isAbsolute = function (path) {
			var uri = path;

			if (typeof uri === 'string')
				uri = parseUri(uri, true);

			return uri.host.length > 0 || uri.path.substring(0, 1) === '/';
		},
		isRelative = function (path) {
			return !isAbsolute(path);
		},
		toString = function (uri) {
			var uriBuilder = '';

			if (uri.protocol.length > 0)
				uriBuilder = uri.protocol + '://';

			uriBuilder += uri.authority;
			uriBuilder += uri.relative;

			return uriBuilder;
		},
		normalize = function (path) {
			var uri = path;

			if (typeof uri === 'string')
				uri = parseUri(uri, true);

			return toString(uri);
		},
		combine = function (paths) {
			var i, currentPath = null, lastPath = null;

			if (!paths)
				throw 'Invalid paths';

			if (typeof paths === 'string')
				paths = arguments;

			for (i = 0; i < paths.length; ++i) {
				lastPath = currentPath;
				currentPath = paths[i];

				if (typeof currentPath !== 'string')
					throw 'Invalid path at index ' + i;

				currentPath = parseUri(normalize(currentPath));

				if (currentPath && lastPath && isRelative(currentPath)) {
					currentPath.path = lastPath.path + (lastPath.path.substr(lastPath.path.length - 1) === '/' ? '' : '/') + currentPath.path;
				}
			}

			console.log(toString(currentPath));
			return currentPath;
		};

	return {
		isAbsolute: isAbsolute,
		isRelative: isRelative,
		normalize: normalize,
		combine: combine
	};
});