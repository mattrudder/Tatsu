require.config({
	baseUrl: '/src/lib',
	paths: {
		'app': '../app'
	}
});

require(['jquery', 'Tatsu'], function($, Tatsu) {
	$(function () {
		var $c = $('canvas'),
			game = new Tatsu.Game({ canvas: $c[0] });


	});
});