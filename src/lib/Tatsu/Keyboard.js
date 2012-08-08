define('Tatsu/Keyboard', function () {
	'use strict';

	var KeyNames = {
			8: 'backspace', 9: 'tab', 13: 'enter',
			16: 'shift', 17: 'ctrl', 18: 'alt',
			20: 'caps_lock',
			27: 'esc',
			32: 'space',
			33: 'page_up', 34: 'page_down',
			35: 'end', 36: 'home',
			37: 'left', 38: 'up', 39: 'right', 40: 'down',
			45: 'insert', 46: 'delete',
			48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
			65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
			91: 'super',
			96: 'num_0', 97: 'num_1', 98: 'num_2', 99: 'num_3', 100: 'num_4', 101: 'num_5', 102: 'num_6', 103: 'num_7', 104: 'num_8', 105: 'num_9', 106: 'num_star', 107: 'num_plus', 109: 'num_minus', 110: 'num_del', 111: 'num_divide',
			112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',
			144: 'num_lock',
			187: 'minus', 189: 'equals',
			192: 'grave'
		},
		KeyCodes = {},
		Modifiers = ['shift', 'ctrl', 'alt'];

	// Static initializer
	(function () {
		// Generate inverse lookup table from KeyNames -> KeyCodes
		for (var key in KeyNames) {
			if (Object.prototype.hasOwnProperty.call(KeyNames, key)) {
				KeyCodes[KeyNames[key]] = +key;
			}
		}
	}());

	function Keyboard() {
		var i,
			self = this,
			onKeyUp,
			onKeyDown;

		function createKeyHandler(upDown) {
			return function (e) {
				var i, keyName;

				e = e || window.event;

				self.lastKeyCode = e.keyCode;
				keyName = KeyNames[self.lastKeyCode];

				// Update modifiers
				for (i = 0; i < Modifiers.length; ++i)
					self.lastModifiers[Modifiers[i]] = e[Modifiers[i] + 'Key'];

				if (Modifiers.indexOf(keyName) !== -1)
					self.lastModifiers[keyName] = true;

				self.lastState[keyName] = upDown === 'Down';

				// TODO: Handle keys registered for events.
				// TODO: preventDefault on keys who's handlers return false.
			};
		}

		onKeyUp = createKeyHandler('Up');
		onKeyDown = createKeyHandler('Down');

		this.lastKeyCode = -1;
		this.lastModifiers = {};
		for (i = 0; i < Modifiers.length; ++i)
			this.lastModifiers[Modifiers[i]] = false;

		this.lastState = {};
		for (i = 0; i < KeyNames.length; ++i)
			this.lastState[KeyNames[i]] = false;

		window.addEventListener('keydown', onKeyDown, false);
		window.addEventListener('keyup', onKeyUp, false);
		window.addEventListener('unload', function onUnload() {
			window.removeEventListener('keydown', onKeyDown, false);
			window.removeEventListener('keyup', onKeyUp, false);
			window.removeEventListener('unload', onUnload, false);
		}, false);
	}

	Keyboard.prototype.isKeyDown = function (keyName) {
		return this.lastState[keyName];
	};

	Keyboard.prototype.isKeyUp = function (keyName) {
		return !this.lastState[keyName];
	};

	return Keyboard;
});