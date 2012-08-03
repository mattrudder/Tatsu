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

			// Demoing on the fly resource loading.
			if (!this.resources.characterSprite) {
				this.resources.characterSprite = game.loader.load('images/Character.png');
			}
			else {
				ctx.drawImage(this.resources.characterSprite, character.x, character.y);
			}
		},
		onPostDraw: function (game) {
			// Overlay drawing.
			var ctx = game.graphics.context2D(),
				textWidth,
				img = this.resources.tileset,
				imgAlt;

			ctx.drawImage(this.resources.tileset, 0, 0);

			ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
			ctx.fillRect(0, game.size().height - 24, game.size().width, game.size().height);

			ctx.font = '400 12pt "Source Sans Pro"';
			textWidth = ctx.measureText('Tatsu Demo').width
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillText('Tatsu Demo', game.size().width / 2 - textWidth / 2, game.size().height - 7);

			textX -= 2;
			if (textX <= -textWidth) {
				textX = game.size().width;
			}
		}
	});
})