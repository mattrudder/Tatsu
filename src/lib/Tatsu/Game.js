define('Tatsu/Game', ['require', 'jquery', 'Tatsu/Graphics'], function(r, $) {
	'use strict';

	var Graphics = r('Tatsu/Graphics'),
		defaults = {

		};

	function initializeOnce() {
		// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		var lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];

		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
				window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currentTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currentTime - lastTime)),
					id;

				id = window.setTimeout(function() {
					callback(currentTime + timeToCall);
				}, timeToCall);

				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}

	// private
	function draw() {
		var ctx = this.graphics.context2d();

		ctx.fillStyle = 'rgb(255,99,71)';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	function setupDrawTimer() {
		var self = this;

		this.timerId = window.requestAnimationFrame(function () {
			draw.call(self);
			setupDrawTimer.call(self);
		}, this.graphics.canvasElem);
	}

	function tearDownDrawTimer() {
		window.cancelAnimationFrame(this.timerId);
	}

	function Game(options) {
		this.options = $.extend(defaults, options);
		this.graphics = new Graphics(this.options.canvas);

		setupDrawTimer.call(this);
	};
	
	initializeOnce();
	
	return Game;
});