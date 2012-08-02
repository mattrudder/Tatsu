define(['Tatsu/ResourceLoader'], function (Loader) {
	"use strict";

	function ImageHandler (url, onProgress, onComplete) {
        var img = new Image();
        img.onload = function() {
            onComplete(img);
        };
        img.src = url;
	}

	return {
		extensions: ['png', 'jpeg', 'jpg', 'gif', 'bmp'],
		create: ImageHandler
	};
});