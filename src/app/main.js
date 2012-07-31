require.config({
	// For file:// debugging...
	baseUrl: '/src/lib',
	paths: {
		'app': '../app'
	}
});

require(['jquery', 'Tatsu/Game', 'app/DemoState'], function($, Game, demoState) {
	'use strict';

	$(function () {
		var $c = $('canvas'),
			game = new Game({
				canvas: $c[0],
				clearColor: 'rgb(255,99,71)'
			});

		game.pushState(demoState);
	});
});