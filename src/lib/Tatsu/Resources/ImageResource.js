define(['Tatsu/ResourceLoader'], function (Loader) {
	"use strict";

	function ImageHandler (url) {

	}

	return {
		extensions: ['png', 'jpeg', 'jpg', 'gif', 'bmp'],
		create: ImageHandler
	};
});