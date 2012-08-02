define(['jquery', 'Tatsu/Console', 'Utility/Path'], function ($, console, Path) {
	"use strict";

	var defaults = {
		resourceRoot: '/',
		resourceTypes: []
	};

	function ResourceLoader (options) {
		var self = this,
			resources = {};

		function fetchResource(url) {
			var resource = resources[url];

			if (resource && resource.status === 'ready') {
				//onReady(url, resource.data);
			}
			else if (url.length > 0) {

				// Prepend root to relative paths
				if (url.substring(0, 1) !== '/')
					url = self.options.resourceRoot + url;

				resources[url] = {
					url: url,
					status: 'loading',
					data: null
				};
			}
		}

		this.loadResources = function (resourceList) {
			var i, url;

			for (i = 0; i < resourceList.length; ++i) {
				url = resourceList[i];

				if (typeof url !== 'string') {
					console.warn('Resource list contains a non-string value.');
					continue;
				}

				fetchResource(Path.combine(this.options.resourceRoot, url));
			}

			// HACKS: Testing.
			setTimeout(this.options.complete, 1500);
		};

		this.options = $.extend({}, defaults, options);

        this.options.resourceRoot = Path.resolve(this.options.resourceRoot);
	}

	return ResourceLoader;
});