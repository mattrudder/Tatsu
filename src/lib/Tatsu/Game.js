define(['require', 'jquery', 'Tatsu/Console', 'Tatsu/Graphics', 'Tatsu/Keyboard', 'Tatsu/ResourceLoader'], function(r, $, console, Graphics, Keyboard, Resources) {
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
        },
        screenSize,
        incomingState = null,
        outgoingState = null;

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

        screenSize = this.options.screenSize || {
            width: this.options.canvas.width,
            height: this.options.canvas.height
        };

		this.graphics = new Graphics({
            screenSize: screenSize,
            canvas: this.options.canvas
        });

		this.stateStack = [];

		// TODO: Add built-in preloader state.
        if (this.options.initialState) {
            this.pushState(this.options.initialState);
        }

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
            self.graphics.present();
		}

		function setupDrawTimer() {
			var lastFrame = +new Date();

			function loop(now) {
				var dt;

				self.timerId = window.requestAnimationFrame(loop, self.graphics.canvasElem);
				dt = now - lastFrame;

				// TODO: Investigate best value for stopping render.
				if (dt < 150) {
                    if (incomingState) {
                        // TODO: Support transitions between states.
                        currentState(self).onExit.call(self);
                        self.stateStack.push(incomingState);
                        incomingState.onEnter.call(self);

                        incomingState = null;
                    }

					onUpdate(dt);
					draw();

                    if (outgoingState) {
                        // TODO: Support transitions between states.
                        outgoingState.onExit.call(self);
                        self.stateStack.pop();
                        currentState(self).onEnter.call(self);

                        outgoingState = null;
                    }
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

    Game.prototype.size = function () {
        return screenSize;
    };

	Game.createState = function (state) {
		return $.extend(defaultState, state);
	};

	Game.prototype.pushState = function (state) {
        incomingState = state;
	};

	Game.prototype.popState = function () {
        outgoingState = currentState(this);
	};

	initializeOnce();
	
	return Game;
});