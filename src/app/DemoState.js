define(['Tatsu/Game', 'Tatsu/Keyboard'], function (Game, Keyboard) {
	"use strict";

	var textX,
		character = { x: 0, y: 0 },
		keys = new Keyboard();

	return Game.createState({
		onEnter: function () {
			var ctx = this.graphics.context2D();

			textX = ctx.canvas.width;

			// TODO: Setup key bindings for this state.
		},
		onExit: function () {
			// TODO: Tear down key bindings for this state.
		},
		onUpdate: function (dt) {
			var ctx = this.graphics.context2D(),
				speed = keys.isKeyDown('shift') ? 2 : 1;

			// TODO: Replace with key bindings
			if (keys.isKeyDown('left')) {
				character.x -= 3 * speed;
			}
			if (keys.isKeyDown('right')) {
				character.x += 3 * speed;
			}

			if (keys.isKeyDown('up')) {
				character.y -= 3 * speed;
			}
			if (keys.isKeyDown('down')) {
				character.y += 3 * speed;
			}

			character.x = Math.max(Math.min(character.x, ctx.canvas.width), 0);
			character.y = Math.max(Math.min(character.y, ctx.canvas.height), 0);
		},
		onPreDraw: function () {
			var ctx = this.graphics.context2D();

			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(character.x, character.y, 20, 0, Math.PI * 2, true);
			ctx.fill();
		},
		onPostDraw: function () {
			// Overlay drawing.
			var ctx = this.graphics.context2D(),
				textWidth;



			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(0, ctx.canvas.height - 24, ctx.canvas.width, ctx.canvas.height);

			ctx.font = '8pt Tahoma';
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillText('Tatsu Demo', textX, ctx.canvas.height - 8);

			textWidth = ctx.measureText('Tatsu Demo').width;
			textX -= 2;
			if (textX <= -textWidth) {
				textX = ctx.canvas.width;
			}
		}
	});
})