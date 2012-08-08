define('Tatsu/Resources/ImageResource', function () {
	"use strict";

	function ImageResource (fileUrl, loader) {
		var self = this;

		function bind(name, handler) {
			if (self.image.addEventListener) {
				self.image.addEventListener(name, handler, false);
			}
			else if (self.image.attachEvent) {
				self.image.attachEvent('on' + name, handler);
			}
		}

		function unbind(name, handler) {
			if (self.image.removeEventListener) {
				self.image.removeEventListener(name, handler, false);
			}
			else if (self.image.removeEventListener) {
				self.image.removeEventListener('on' + name, handler);
			}
		}

		function removeEventHandlers() {
			unbind('load', onLoad);
			unbind('readystatechange', onReadyStateChange);
			unbind('error', onError);
		}

		function onReadyStateChange() {
			if (self.image.readyState === 'complete') {
				removeEventHandlers();
				loader.onLoad(self);
			}
		}

		function onLoad() {
			removeEventHandlers();
			loader.onLoad(self);
		}

		function onError() {
			removeEventHandlers();
			loader.onError(self);
		}

		// Public interface.
		this.image = new Image();

		this.start = function () {
			bind('load', onLoad);
			bind('readystatechange', onReadyStateChange);
			bind('error', onError);

			self.image.src = fileUrl;
		};

		this.checkStatus = function () {
			if (self.image.complete) {
				removeEventHandlers();
				loader.onLoad(self);
			}
		};

		this.onTimeout = function () {
			removeEventHandlers();
			if (self.image.complete) {
				loader.onLoad(self);
			}
			else {
				loader.onTimeout(self);
			}
		};

		this.url = function () {
			return fileUrl;
		};

		this.data = function () {
			return self.image;
		};
	}

	return {
		extensions: ['png', 'jpeg', 'jpg', 'gif', 'bmp'],
		create: function (url, loader) {
			return new ImageResource(url, loader);
		}
	};
});