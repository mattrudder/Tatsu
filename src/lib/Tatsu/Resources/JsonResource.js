define('Tatsu/JsonResource', ['Utility/Utility', 'Utility/Ajax'], function (Util, Ajax) {
	"use strict";

	function JsonResource (fileUrl, loader) {
		var self = this,
			request = null,
			retObject = {};

		function onLoad(json) {
			Util.extend(retObject, json);
			loader.onLoad(self);
		}

		function onError() {
			loader.onError(self);
		}

		// Public interface.
		this.start = function () {
			request = Ajax.ajax({
				url: fileUrl,
				type: 'GET',
				dataType: 'json',
				success: onLoad,
				error: onError
			});
		};

		this.checkStatus = function () {
			if (request && request.readyState === 4) {
				loader.onLoad(self);
			}
		};

		this.onTimeout = function () {
			if (request && request.readyState === 4) {
				loader.onLoad(self);
			}
			else {
				request.abort();
				loader.onTimeout(self);
			}

			request = null;
		};

		this.url = function () {
			return fileUrl;
		};

		this.data = function () {
			return retObject;
		};
	}

	return {
		extensions: ['js', 'json', 'map'],
		create: function (url, loader) {
			return new JsonResource(url, loader);
		}
	};
});