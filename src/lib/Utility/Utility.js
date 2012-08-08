define('Utility/Utility', function () {
	"use strict";

	var class2type = {},
		extend,
		each,
		isArray,
		isFunction,
		noop,
		type;

		extend = function() {
			var i,
				name, src, copy,
				options,
				target = arguments[0] || {},
				length = arguments.length;

			if (typeof target !== 'object') {
				target = {};
			}

			for (i = 1; i < length; ++i) {
				options = arguments[i];
				if (options != null) {
					for (name in options) {
						src = target[name];
						copy = options[name];

						if (target === copy) {
							continue;
						}

						if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			return target;
		};

		each = function (obj, callback) {
			var i = 0,
				name,
				length = obj.length,
				isObject = length === undefined || isFunction(obj);

			if (isObject) {
				for (name in obj) {
					if (callback.call(obj[name], name, obj[name]) === false) {
						break;
					}
				}
			}
			else {
				for (i = 0; i < length; ++i) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		};

		isArray = function (obj) {
			return type(obj) === 'array';
		};

		isFunction = function (obj) {
			return type(obj) === 'function';
		};

		noop = function () {};

		type = function (obj) {
			return obj == null ?
				String(obj) :
				class2type[Object.prototype.toString.call(obj)] || 'object';
		};

	each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object'], function (i, name) {
		class2type['[object ' + name + ']'] = name.toLowerCase();
	});
	
	return {
		extend: extend,
		each: each,
		isArray: isArray,
		isFunction: isFunction,
		noop: noop,
		type: type
	};
});