define(['jquery', 'Tatsu/Console'], function ($, console) {
	"use strict";

	var resources = {};

	function getResource(url, onReady) {
		var resource = resources[res.url];

		if (resource && resource.status === 'ready') {
			onReady(url, resource.data);
		}
		else {
			resources[url] = {
				url: url,
				status: 'loading',
				data: null
			};
		}
	}

	return {
		loadResources: function (resourceList, onReady) {
			var i, resource, url;

			for (i = 0; i < resourceList.length; ++i) {
				url = resourceList[i];

				if (typeof resource !== 'string') {
					console.warn('Resource list contains a non-string value.');
					continue;
				}

				getResource(url, onReady);
			}
		}
	};
});