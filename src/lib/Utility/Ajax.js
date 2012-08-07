define(['Utility/Utility'], function (Util) {
	var get,
		getJson;

	ajax = function (url, options) {
		var xhr = new XMLHttpRequest(),
			settings;

		if (options === undefined) {
			options = url;
			url = null;
		}

		settings = Util.extend({
			type: 'GET',
			dataType: null,
			success: null,
			error: null,
			complete: Util.noop
		}, options);

		function parseResponse() {
			if (settings.dataType) {
				if (settings.dataType === 'json') {
					return JSON.parse(xhr.reponseText);
				}
			}
			else if (xhr && xhr.responseType) {
				if (xhr.responseType === 'json') {
					return JSON.parse(xhr.reponseText);
				}
			}

			return xhr.responseText;
		}

		xhr.onreadystatechange = function() {
			var res;

			if (xhr.readyState === 4) {
				res = parseResponse();

				if (settings.success && xhr.status === 200) {
					settings.success(xhr, res);
				}
				else if (settings.error) {
					settings.error(xhr, res);
				}

				settings.complete(xhr, res);
			}
		};

		xhr.open(url || settings.url, url, true);
		xhr.send();
	};

	getJSON = function (url, callback) {
		ajax(url, {
			complete: function (xhr, responseText) {
				var json = null;

				if (xhr.status === 200) {
					json = JSON.parse(responseText);
				}

				callback(json, xhr.status);
			}
		})
	};

	return {
		ajax: ajax,
		getJSON: getJSON
	};
});