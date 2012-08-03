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
			game;

        game = new Game({
            canvas: $c[0],
            initialState: demoState,
            resourceRoot: '/src/app/',
            //screenSize: { width: 320, height: 240 },
            //clearColor: 'rgb(255,99,71)'
		});
	});
});