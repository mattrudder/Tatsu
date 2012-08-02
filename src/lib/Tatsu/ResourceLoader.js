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
			var i,
                extension,
                resource,
                createFunc = null,
                resource = resources[url];

			if (resource && resource.status === 'ready') {
				//onReady(url, resource.data);
			}
			else if (url.length > 0) {

                extension = Path.parseUri(url).file;
                extension = extension.substr(extension.lastIndexOf('.') + 1);

                for (i = 0; i < self.options.resourceTypes.length; ++i) {
                    if (self.options.resourceTypes[i].extensions.indexOf(extension) !== -1) {
                        createFunc = self.options.resourceTypes[i].create;
                    }
                }

                resource = {
                    url: url,
                    status: 'loading',
                    data: null
                };

                if (createFunc) {
                    createFunc(url, $.noop, function (data) {
                        resource.status = 'ready';
                        resource.data = data;
                    });
                }
                else {
                    resource.status = 'error';
                }

				resources[url] = resource;
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