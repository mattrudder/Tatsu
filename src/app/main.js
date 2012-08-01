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
            resources,
			game;

        resources = [
            'images/Tileset.png',
            'maps/test.map'
        ];

        game = new Game({
            canvas: $c[0],
            initialState: demoState,
            resourceRoot: '/src/app/',
            resources: resources
            //screenSize: { width: 320, height: 240 },
            //clearColor: 'rgb(255,99,71)'
		});
	});
});