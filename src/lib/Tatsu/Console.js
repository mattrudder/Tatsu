define(function () {
	"use strict";

	var history = [],
		con = window.console,
		wrapper = {
			log: function() {
				history.push( arguments );

				con && con.log[ con.firebug ?
					'apply' : 'call']( con, Array.prototype.slice.call( arguments ) );
			}
		};

	return wrapper;
});