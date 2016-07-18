;
(function() {
	var vueLazy = {};

	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');

	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;

	var prefix;
	for (var i = 0; i < prefixes.length; i++) {
		if (requestAnimationFrame && cancelAnimationFrame) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
		cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
	}

	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function(id) {
			window.clearTimeout(id);
		};
	}

	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;

	var cntr = 0
	var lastCntr = 0
	var diff = 0
	var scrollEnd = document.createEvent('HTMLEvents');
	scrollEnd.initEvent('scrollEnd', true, false)
	scrollEnd.eventType = 'message'

	function enterFrame() {
		if (cntr != lastCntr) {
			diff++
			if (diff == 5) {
				window.dispatchEvent(scrollEnd)
				cntr = lastCntr
			}
		}
		window.requestAnimationFrame(enterFrame);
	}
	window.requestAnimationFrame(enterFrame)
	document.addEventListener('scroll', function() {
		lastCntr = cntr
		diff = 0
		cntr++
	}, true)

	if (!Object.assign) {
		Object.defineProperty(Object, "assign", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: function(target, firstSource) {
				"use strict";
				if (target === undefined || target === null)
					throw new TypeError("Cannot convert first argument to object");
				var to = Object(target);
				for (var i = 1; i < arguments.length; i++) {
					var nextSource = arguments[i];
					if (nextSource === undefined || nextSource === null) continue;
					var keysArray = Object.keys(Object(nextSource));
					for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
						var nextKey = keysArray[nextIndex];
						var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
						if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
					}
				}
				return to;
			}
		});
	}

	vueLazy.install = function(Vue, options) {

		options = options || {}

		var DEFAULT_URL = 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';

		var obj = {
			error: DEFAULT_URL,
			loading: DEFAULT_URL
		}

		Object.assign(obj, options);

		Vue.directive('lazy', {
			update: function(value) {
				var el = this.el;
				el.setAttribute('class', 'vue-lazy-init')
				el.src = obj.loading;
				el.style.opacity = .5
				el.style.transition = 'opacity .3s'
				el.style.webkitTransition = 'opacity .3s'

				function loadImg() {
					el.src = value;
					el.setAttribute('class', 'vue-lazy-loading')
					el.addEventListener('error', onloadError, false)
					el.addEventListener('load', onloadSuccess, false)
					window.removeEventListener('scrollEnd', compute, false)
					window.removeEventListener('resize', compute, false)
				}

				function compute() {
					var rect = el.getBoundingClientRect();
					var clientheight = document.documentElement.clientHeight;
					var clientWidth = document.documentElement.clientWidth;
					if (el.src === value) {
						return
					}
					if (rect.top >= 0 && rect.top <= clientheight) {
						loadImg();
					} else if (rect.bottom >= 0 && rect.top <= clientheight && rect.right >= 0 && rect.left <= clientWidth) {
						loadImg()
					}
				}

				function onLoad() {
					compute();
					el.removeEventListener('load', onLoad, false)
					window.addEventListener('scrollEnd', compute, false)
					window.addEventListener('resize', compute, false)
				}

				function onloadSuccess() {
					el.style.opacity = 1
					el.setAttribute('class', 'vue-lazy-load-success')
					el.removeEventListener('load', onloadSuccess, false)
				}

				function onloadError() {
					el.style.opacity = 1
					el.src = obj.error
					el.setAttribute('class', 'vue-lazy-load-error')
					el.removeEventListener('error', onloadError, false)
				}

				el.addEventListener('load', onLoad, false)
				el.addEventListener('error', onloadError, false)

			}
		});
	};
	if (typeof exports === "object") {
		module.exports = vueLazy;
	} else if (typeof define === "function" && define.amd) {
		define([], function() {
			return vueLazy
		})
	} else if (window.Vue) {
		window.vueLazy = vueLazy;
		Vue.use(vueLazy);
	}
})();