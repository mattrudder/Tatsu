define(['require', 'jquery', 'Tatsu/Graphics', 'Tatsu/Keyboard'], function(r, $, Graphics, Keyboard) {
	'use strict';

	var defaults = {
			clearColor: 'black'
		},
		defaultState = {
			onEnter: $.noop,
			onPreDraw: $.noop,
			onPostDraw: $.noop,
			onUpdate: $.noop,
			onExit: $.noop
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

				lastTime = currentTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}

	function Game(options) {
		var self = this;

		this.options = $.extend(defaults, options);
		this.graphics = new Graphics(this.options.canvas);
		this.stateStack = [];

		function onPreDraw() {
			currentState(self).onPreDraw.call(self);
		}

		function onPostDraw() {
			currentState(self).onPostDraw.call(self);
		}

		function onUpdate(dt) {
			currentState(self).onUpdate.call(self, dt);
		}

		function draw() {
			self.graphics.clear(self.options.clearColor || 'black');

			onPreDraw();

			// TODO: Draw retained mode elements here (environment, sprites, etc).

			onPostDraw();
		}

		function setupDrawTimer() {
			var lastFrame = +new Date();

			function loop(now) {
				var dt;

				self.timerId = window.requestAnimationFrame(loop, self.graphics.canvasElem);
				dt = now - lastFrame;

				// TODO: Investigate best value for stopping render.
				if (dt < 150) {
					onUpdate(dt);
					draw();
				}

				lastFrame = now;
			}

			loop(lastFrame);
		}

		function tearDownDrawTimer() {
			window.cancelAnimationFrame(self.timerId);
		}

		setupDrawTimer();
	}

	function currentState(self) {
		return self.stateStack.length ? self.stateStack[self.stateStack.length - 1] : defaultState;
	}

	Game.createState = function (state) {
		return $.extend(defaultState, state);
	};

	Game.prototype.pushState = function (state) {
		// TODO: Support transitions between states.
		currentState(this).onExit.call(this);
		this.stateStack.push(state);
		state.onEnter.call(this);
	};

	Game.prototype.popState = function () {
		// TODO: Support transitions between states.
		currentState(this).onExit.call(this);
		this.stateStack.pop();
		currentState(this).onEnter.call(this);
	};

	initializeOnce();
	
	return Game;
});