define(['jquery'], function ($) {
	var canvasElem,
		ctx2d;

	function getContext2D() {
		return ctx2d;
	}

	return function (elem) {
		ctx2d = elem.getContext('2d');

		this.context2d = getContext2D;
	};
});