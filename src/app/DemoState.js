define(['Tatsu/Console', 'Tatsu/Game', 'Tatsu/Keyboard', 'Tatsu/ResourceLoader'], function (console, Game, Keyboard, Resources) {
	"use strict";

	var textX,
		character = { x: 0, y: 0 };

	return Game.createState({
		preload: {
			tileset: 'images/Tileset.png',
			map: 'maps/test.map'
		},
		onEnter: function (game) {
			textX = game.size().width;

			// TODO: Setup key bindings for this state.
		},
		onExit: function (game) {
			// TODO: Tear down key bindings for this state.
		},
		onUpdate: function (game, dt) {
			var speed = game.keyboard.isKeyDown('shift') ? 2 : 1;

			// TODO: Replace with key bindings
			if (game.keyboard.isKeyDown('left')) {
				character.x -= 3 * speed;
			}
			if (game.keyboard.isKeyDown('right')) {
				character.x += 3 * speed;
			}

			if (game.keyboard.isKeyDown('up')) {
				character.y -= 3 * speed;
			}
			if (game.keyboard.isKeyDown('down')) {
				character.y += 3 * speed;
			}

			character.x = Math.max(Math.min(character.x, game.size().width), 0);
			character.y = Math.max(Math.min(character.y, game.size().height), 0);
		},
		onPreDraw: function (game) {
			var ctx = game.graphics.context2D();

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(character.x, character.y, 20, 0, Math.PI * 2, true);
			ctx.fill();
		},
		onPostDraw: function (game) {
			// Overlay drawing.
			var ctx = game.graphics.context2D(),
				textWidth,
				img = this.resources.tileset;

			ctx.drawImage(this.resources.tileset, 0, 0);

			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(0, game.size().height - 24, game.size().width, game.size().height);

			ctx.font = '11pt "Source Sans Pro"';
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillText('Tatsu Demo', textX, game.size().height - 8);

			textWidth = ctx.measureText('Tatsu Demo').width;
			textX -= 2;
			if (textX <= -textWidth) {
				textX = game.size().width;
			}
		}
	});
})