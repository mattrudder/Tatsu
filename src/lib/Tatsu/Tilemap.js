define(['Utility/Utility', 'Utility/Ajax'], function (Util, Ajax) {
	"use strict";

	var defaults = {};

	function Tilemap (options) {
		this.options = Util.extend({}, defaults, options);

		Ajax.getJSON(this.options.url, function (data) {
			console.log(data);
		});
	}

	return Tilemap;
});