define(['jquery', 'Tatsu/Console', 'Utility/Path'], function ($, console, Path) {
	"use strict";

	var defaults = {
			resourceRoot: '/',
			resourceTypes: [],
			autoStart: true,
			statusInterval: 5000,
			loggingDelay: 20 * 1000,
			timeout: Infinity
		},
		ResourceState = {
			QUEUED: 0,
			WAITING: 1,
			LOADED: 2,
			ERROR: 3,
			TIMEOUT: 4
		};

	function ResourceLoader (options) {
		var self = this,
			entries = {},
			progressListeners = [],
			lastProgressChange = +new Date,
			timeStarted = null;

		function fetchResource(url, loadedOnly) {
			var i,
				extension,
				createFunc = null,
				entry = entries[url];

			loadedOnly = loadedOnly || false;

			if (entry) {
				return loadedOnly && entry.status !== ResourceState.LOADED ? null : entry.resource;
			}
			else if (url.length > 0) {
				extension = Path.parseUri(url).file;
				extension = extension.substr(extension.lastIndexOf('.') + 1);

				for (i = 0; i < self.options.resourceTypes.length; ++i) {
					if (self.options.resourceTypes[i].extensions.indexOf(extension) !== -1) {
						createFunc = self.options.resourceTypes[i].create;
					}
				}

				if (!createFunc)
					throw 'Resource loader not found for extension ".' + extension + '".';

				entry = {
					status: ResourceState.QUEUED,
					resource: createFunc(url, self)
				};

				entries[url] = entry;

				if (timeStarted === null && self.options.autoStart) {
					if (self.options.autoStart) {
						self.start();
					}
				}
				else {
					entry.status = ResourceState.WAITING;
					entry.resource.start();
				}



				if (!loadedOnly)
					return entry.resource;
			}

			return null;
		}

		this.preload = function (resourceList) {
			var i, url, resource, resourceMap = {};

			for (i = 0; i < resourceList.length; ++i) {
				url = resourceList[i];

				if (typeof url !== 'string') {
					console.warn('Resource list contains a non-string value.');
					continue;
				}

				resource = fetchResource(Path.combine(this.options.resourceRoot, url), false);
				resourceMap[url] = resource !== null ? resource.data() : null;
			}

			return resourceMap;
		};

		this.load = function (url) {
			var resource;

			if (typeof url !== 'string')
				throw 'Resource url is not a string.';

			url = Path.combine(this.options.resourceRoot, url);
			resource = fetchResource(url, true);

			return resource !== null ? resource.data() : null;
		};

		this.start = function () {
			var key, entry;

			if (timeStarted !== null)
				return;

			timeStarted = +new Date;

			for(key in entries) {
				entry = entries[key];

				if (entry.status === ResourceState.QUEUED) {
					entry.status = ResourceState.WAITING;
					entry.resource.start();
				}
			}

			// Quick status check, in case we have cached files.
			setTimeout(statusCheck, 100);
		};

		this.log = function(showAll) {
			var i = 1, key, entry, message,
				elapsedSeconds = Math.round((+new Date - timeStarted) / 1000);

			console.log('ResourceLoader elapsed: ' + elapsedSeconds + ' sec');

			for (key in entries) {
				entry = entries[key];

				if (!showAll && entry.status !== ResourceState.WAITING)
					continue;

				message = 'ResourceLoader #' + i + ' [' + entry.resource.url() + '] ';
				switch (entry.status) {
					case ResourceState.QUEUED:
						message += '(Not Started)';
						break;
					case ResourceState.WAITING:
						message += '(Waiting)';
						break;
					case ResourceState.LOADED:
						message += '(Loaded)';
						break;
					case ResourceState.ERROR:
						message += '(Error)';
						break;
					case ResourceState.TIMEOUT:
						message += '(Timeout)';
						break;
				}

				console.log(message);
				i++;
			}
		};

		function statusCheck() {
			var key, entry,
				checkAgain = false,
				deltaTime = (+new Date) - lastProgressChange,
				timedOut = (deltaTime >= self.options.timeout),
				shouldLog = (deltaTime >= self.options.loggingDelay);

			for(key in entries) {
				entry = entries[key];

				if (entry.status !== ResourceState.WAITING)
					continue;

				if (entry.resource.checkStatus)
					entry.resource.checkStatus();

				if (entry.status === ResourceState.WAITING) {
					if (timedOut) {
						entry.resource.onTimeout();
					}
					else {
						checkAgain = true;
					}
				}
			}

			if (checkAgain) {
				if (shouldLog)
					self.log();

				setTimeout(statusCheck, self.options.statusInterval);
			}
			else {
				onFinished();
			}
		}

		function onFinished() {
			self.log(true);

			timeStarted = null;
		}

		function sendProgress(globalData, updatedEntry, listener) {
			listener($.extend(globalData, {
				resource: updatedEntry.resource,
				loaded: (updatedEntry.status === ResourceState.LOADED),
				error: (updatedEntry.status === ResourceState.ERROR),
				timeout: (updatedEntry.status === ResourceState.TIMEOUT)
			}));
		}

		function onProgress (resource, statusType) {
			var i,
				key,
				entry = null,
				currentEntry = null,
				listener,
				finished = 0,
				total = 0,
				globalStatus;

			for (key in entries) {
				currentEntry = entries[key];
				if (currentEntry !== null && currentEntry.resource === resource) {
					entry = currentEntry;
				}

				total++;
				if (currentEntry.status === ResourceState.LOADED || currentEntry.status === ResourceState.ERROR || currentEntry.status === ResourceState.TIMEOUT) {
					finished++;
				}
			}

			if (entry === null || entry.status !== ResourceState.WAITING)
				return;

			entry.status = statusType;
			if (entry.status === ResourceState.LOADED || entry.status === ResourceState.ERROR || entry.status === ResourceState.TIMEOUT) {
				finished++;
			}

			lastProgressChange = +new Date();

			globalStatus = {
				finishedCount: finished,
				totalCount: total
			}

			for (i = 0; i < progressListeners.length; ++i) {
				listener = progressListeners[i];
				sendProgress(globalStatus, entry, listener);
			}
		}

		this.onLoad = function (resource) {
			onProgress(resource, ResourceState.LOADED);
		};

		this.onError = function (resource) {
			onProgress(resource, ResourceState.ERROR);
		};

		this.onTimeout = function (resource) {
			onProgress(resource, ResourceState.TIMEOUT);
		};

		this.addProgressListener = function (handler) {
			progressListeners.unshift(handler);

			return handler;
		};

		this.addCompletionListener = function (handler) {
			var wrapper = function (e) {
				if (e.finishedCount === e.totalCount) {
					handler();
				}
			};

			progressListeners.push(wrapper);

			return wrapper;
		};

		this.removeProgressListener = function (handler) {
			var i;

			for (i = 0; i < progressListeners.length; ++i) {
				if (progressListeners[i] === handler) {
					progressListeners.splice(i, 1);
					return;
				}
			}
		};

		this.removeCompletionListener = function (handler) {
			self.removeProgressListener(handler);
		};

		this.options = $.extend({}, defaults, options);
		this.options.resourceRoot = Path.resolve(this.options.resourceRoot);
	}

	return ResourceLoader;
});