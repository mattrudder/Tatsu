define(['jquery', 'Tatsu/Console'], function ($, console) {
	"use strict";

    var defaults = {
      resourceRoot: '/'
    };

    function ResourceLoader (options) {
        var self = this,
            resources = {};

        function fetchResource(url, onReady) {
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

        this.loadResources = function (resourceList, onReady) {
            var i, url;

            for (i = 0; i < resourceList.length; ++i) {
                url = resourceList[i];

                if (typeof url !== 'string') {
                    console.warn('Resource list contains a non-string value.');
                    continue;
                }

                fetchResource(url, onReady);
            }

            // HACKS: Testing.
            setTimeout(onReady, 5000);
        };

        this.options = $.extend({}, defaults, options);

        // Ensure root ends with a slash
        if (this.options.resourceRoot.length > 0 && this.options.resourceRoot.substring(this.options.resourceRoot.length - 1, this.options.resourceRoot.length) !== '/')
            this.options.resourceRoot = this.options.resourceRoot + '/';
    }

	return ResourceLoader;
});