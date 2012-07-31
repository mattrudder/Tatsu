define([], function () {
	'use strict';

	var canvasElem,
		ctx2d;

	function Graphics(elem) {
		ctx2d = elem.getContext('2d');
	}

	// NOTE: In 3D mode, context2D should be able to emulate canvas rendering above/below 3D content
	Graphics.prototype.context2D = function () {
		return ctx2d;
	};

	Graphics.prototype.clear = function (clearColor) {
		ctx2d.fillStyle = clearColor || 'black';
		ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
	};

	return Graphics;
});