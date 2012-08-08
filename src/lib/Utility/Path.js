/**
 * Includes parseUri regular expressions
 * http://blog.stevenlevithan.com/archives/parseuri
 * Copyright 2007, Steven Levithan
 * Released under the MIT license.
 */
define('Utility/Path', function () {
	"use strict";

	var anchor = document.createElement('a'), // Phony anchor used to resolve relative paths.
        parseUri = function (str) {
		    var	o   = {
                    strictMode: true,
                    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                    q:   {
                        name:   "queryKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                    },
                    parser: {
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                    }
			    },
                m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i   = 14;

			while (i--) uri[o.key[i]] = m[i] || "";

			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2;
			});

			return uri;
		},
        resolve = function (path) {
            anchor.href = path;
            return anchor.href;
        },
		isAbsolute = function (path) {
			var uri = path;

			if (typeof uri === 'string')
				uri = parseUri(uri);

			return uri.protocol.length > 0 || uri.path.substring(0, 1) === '/';
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
		combine = function (paths) {
			var i, currentPath = null, lastPath = null;

			if (!paths)
				throw 'Invalid paths';

			if (typeof paths === 'string')
				paths = Array.prototype.slice.call(arguments, 0);

			for (i = 0; i < paths.length; ++i) {
				lastPath = currentPath;
				currentPath = paths[i];

				if (typeof currentPath !== 'string')
					throw 'Invalid path at index ' + i;

				currentPath = parseUri(currentPath);

				if (currentPath && lastPath && isRelative(currentPath)) {
					currentPath = parseUri(toString(lastPath) + (lastPath.relative.substr(lastPath.relative.length - 1) === '/' ? '' : '/') + currentPath.relative);
				}
			}

			return toString(currentPath);
		};

	return {
        parseUri: parseUri,
		isAbsolute: isAbsolute,
		isRelative: isRelative,
        resolve: resolve,
		combine: combine
	};
});