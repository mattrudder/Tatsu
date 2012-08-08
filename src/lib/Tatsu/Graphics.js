define('Tatsu/Graphics', ['Utility/Utility'], function (Util) {
	'use strict';

	var defaults = {
            scaleMode: 'pixel'
        },
		ctx2d,
        imageSmoothingDisabled = false;

	function Graphics(options) {
        var i, vendors = ['moz', 'webkit', 'o', 'ms'];

        this.options = Util.extend({}, defaults, options);
		ctx2d = this.options.canvas.getContext('2d');

        if (this.options.scaleMode === 'pixel') {
            (function () {
                if (ctx2d.imageSmoothingEnabled) {
                    imageSmoothingDisabled = true;
                    ctx2d.imageSmoothingEnabled = false;
                    return;
                }
                else
                {
                    for (i = 0; i < vendors.length; ++i) {
                        if (ctx2d[vendors[i] + 'ImageSmoothingEnabled']) {
                            imageSmoothingDisabled = true;
                            ctx2d[vendors[i] + 'ImageSmoothingEnabled'] = false;
                            return;
                        }
                    }
                }

                //this.options.scaleMode = 'stretch';
                if (console) {
                    console.warn('scaleMode "pixel" is not supported on this browser! Defaulting to "stretch".');
                }
            }());
        }
	}

	// NOTE: In 3D mode, context2D should be able to emulate canvas rendering above/below 3D content
	Graphics.prototype.context2D = function () {
		return ctx2d;
	};

	Graphics.prototype.clear = function (clearColor) {
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.rect(0, 0, this.options.screenSize.width, this.options.screenSize.height);
        ctx2d.clip();

		ctx2d.fillStyle = clearColor || 'black';
		ctx2d.fillRect(0, 0, this.options.screenSize.width, this.options.screenSize.height);
	};

    Graphics.prototype.present = function () {
        var srcWidth = this.options.screenSize.width,
            srcHeight = this.options.screenSize.height,
            destWidth = this.options.canvas.width,
            destHeight = this.options.canvas.height,
            zoomX, zoomY, imgData;

        ctx2d.restore(); // end clip

        if (destWidth !== srcWidth || destHeight !== srcHeight) {
            if (this.options.scaleMode !== 'pixel' || imageSmoothingDisabled) {
                ctx2d.drawImage(this.options.canvas, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
            }
            else {
                ctx2d.drawImage(this.options.canvas, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight);

                // Fallback image resize. (read: sloooooooooow!)
//                zoomX = destWidth / srcWidth;
//                zoomY = destHeight / srcHeight;
//
//                imgData = new Uint8ClampedArray(ctx2d.getImageData(0, 0, srcHeight, srcHeight).data);
//
//                for (var y = 0; y < srcHeight; ++y) {
//                    for (var x = 0; x < srcWidth; ++x) {
//                        // Find the starting index in the one-dimensional image data
//                        var i = (y * srcWidth + x) * 4;
//                        var r = imgData[i + 0];
//                        var g = imgData[i + 1];
//                        var b = imgData[i + 2];
//                        var a = imgData[i + 3];
//
//                        if (x > 0) {
//                            var i2 = (y * srcWidth + x - 1) * 4;
//                            var r2 = imgData[i + 0];
//                            var g2 = imgData[i + 1];
//                            var b2 = imgData[i + 2];
//                            var a2 = imgData[i + 3];
//                        }
//
//                        ctx2d.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
//                        ctx2d.fillRect(x * zoomX, y * zoomY, zoomX, zoomY);
//                    }
//                }
            }
        }

    };

	return Graphics;
});