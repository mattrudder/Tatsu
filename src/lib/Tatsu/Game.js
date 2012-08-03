define([
	'require',
	'jquery',
	'Tatsu/Console',
	'Tatsu/Graphics',
	'Tatsu/Keyboard',
	'Tatsu/ResourceLoader',
	'Tatsu/Resources/ImageResource',
	'Tatsu/Resources/JsonResource'],
	function(r, $, console, Graphics, Keyboard, ResourceLoader) {
	'use strict';

	var defaults = {
			clearColor: 'black'
		},
		defaultState = {
			isLoaded: false,
			resources: {},
			onEnter: $.noop,
			onPreDraw: $.noop,
			onPostDraw: $.noop,
			onUpdate: $.noop,
			onExit: $.noop
		},
		knownStates = [];

	function setupRaf() {
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
		var self = this,
			screenSize,
			incomingState = null,
			outgoingState = null;

		this.size = function () {
			return screenSize;
		};

		this.pushState = function (state) {
			var i, compHandler = null, progHandler = null;

			if (incomingState !== null)
				throw 'Multiple transition states specified!';

			incomingState = state;

			function onProgress(e) {
				incomingState.progress = e.finishedCount / e.totalCount;
			}

			function onComplete(e) {
				incomingState.isLoaded = true;

				self.loader.removeProgressListener(progHandler);
				self.loader.removeCompletionListener(compHandler);
			}

			if (incomingState.preload) {
				progHandler = self.loader.addProgressListener(onProgress);
				compHandler = self.loader.addCompletionListener(onComplete);

				$.extend(incomingState.resources, self.loader.preload(incomingState.preload));
				self.loader.start();
			}
		};

		this.popState = function () {
			if (outgoingState !== null)
				throw 'Multiple transition states specified!';

			outgoingState = currentState(this);
		};

		this.options = $.extend({}, defaults, options);

		this.loader = new ResourceLoader({
			resourceRoot: this.options.resourceRoot,
			resourceTypes: [r('Tatsu/Resources/ImageResource'), r('Tatsu/Resources/JsonResource')]
		});

		screenSize = this.options.screenSize || {
			width: this.options.canvas.width,
			height: this.options.canvas.height
		};

		this.keyboard = new Keyboard();
		this.graphics = new Graphics({
			screenSize: screenSize,
			canvas: this.options.canvas
		});

		this.stateStack = [];

		function onPreDraw() {
			var state = currentState(self);
			state.onPreDraw.call(state, self);
		}

		function onPostDraw() {
			var ctx = self.graphics.context2D(),
				state = currentState(self);

			state.onPostDraw.call(state, self);

			if (incomingState && incomingState.progress) {
				// TODO: Allow states to provide progress drawing?
				ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
				ctx.fillRect(4, screenSize.height - 20, (screenSize.width - 8) * incomingState.progress, 16);
			}
		}

		function onUpdate(dt) {
			var state = currentState(self);
			state.onUpdate.call(state, self, dt);
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
				var dt, state;

				self.timerId = window.requestAnimationFrame(loop, self.graphics.canvasElem);
				dt = now - lastFrame;

				// TODO: Investigate best value for stopping render.
				if (dt < 250) {
					if (outgoingState) {
						// TODO: Support transitions between states.
						outgoingState.onExit.call(state, self);
						self.stateStack.pop();

						state = currentState(self);
						state.onEnter.call(state, self);

						outgoingState = null;
					}

					onUpdate(dt);
					draw();

					if (incomingState && incomingState.isLoaded) {
						// TODO: Support transitions between states.
						state = currentState(self);
						state.onEnter.call(state, self);

						self.stateStack.push(incomingState);
						incomingState.onEnter.call(incomingState, self);

						incomingState = null;
					}
				}

				lastFrame = now;
			}

			loop(lastFrame);
		}

		function tearDownDrawTimer() {
			window.cancelAnimationFrame(self.timerId);
		}

		if (self.options.initialState) {
			self.pushState(self.options.initialState);
		}

		setupDrawTimer();
	}

	function currentState(self) {
		return self.stateStack.length ? self.stateStack[self.stateStack.length - 1] : defaultState;
	}

	Game.createState = function (state) {
		state = $.extend({}, defaultState, state);
		knownStates.push(state);

		return state;
	};

	setupRaf();

	return Game;
});