define(['jquery'], function ($) {
	"use strict";

	var defaults = {};

	function Tilemap (options) {
		this.options = $.extend(defaults, options);

		$.getJSON(this.options.url, function () {

		});
	}

	return Tilemap;
});