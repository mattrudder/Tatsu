define(['Tatsu/Console', 'Tatsu/Game', 'Tatsu/Keyboard', 'Tatsu/ResourceLoader'], function (console, Game, Keyboard, Resources) {
	"use strict";

	var textX,
		character = { x: 0, y: 0 };

	return Game.createState({
		preload: [
			'images/Tileset.png',
			'maps/test.map'
		],
		onEnter: function () {
			textX = this.size().width;

			// TODO: Setup key bindings for this state.
		},
		onExit: function () {
			// TODO: Tear down key bindings for this state.
		},
		onUpdate: function (dt) {
			var speed = this.keyboard.isKeyDown('shift') ? 2 : 1;

			// TODO: Replace with key bindings
			if (this.keyboard.isKeyDown('left')) {
				character.x -= 3 * speed;
			}
			if (this.keyboard.isKeyDown('right')) {
				character.x += 3 * speed;
			}

			if (this.keyboard.isKeyDown('up')) {
				character.y -= 3 * speed;
			}
			if (this.keyboard.isKeyDown('down')) {
				character.y += 3 * speed;
			}

			character.x = Math.max(Math.min(character.x, this.size().width), 0);
			character.y = Math.max(Math.min(character.y, this.size().height), 0);
		},
		onPreDraw: function () {
			var ctx = this.graphics.context2D();

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(character.x, character.y, 20, 0, Math.PI * 2, true);
			ctx.fill();
		},
		onPostDraw: function () {
			// Overlay drawing.
			var ctx = this.graphics.context2D(),
				textWidth,
				img = this.loader.load('images/Tileset.png');

			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(0, this.size().height - 24, this.size().width, this.size().height);

			ctx.font = '11pt "Source Sans Pro"';
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillText('Tatsu Demo', textX, this.size().height - 8);

			textWidth = ctx.measureText('Tatsu Demo').width;
			textX -= 2;
			if (textX <= -textWidth) {
				textX = this.size().width;
			}
		}
	});
})