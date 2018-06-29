/*!
 * Title: jQuery Flyout
 *
 * @requires: jQuery library
 * @reference link: http://vast-engineering.github.com/jquery-popup-overlay/
 */
;(function($) {

var $window = $(window);
var options = {};
var opensuffix = '_open';
var closesuffix = '_close';
var backgroundsuffix = '_background';
var visiblePopupsArray = [];
var opentimer;
var scrollbarwidth;
var bodymarginright = null;
var $backgroundElm;
var methods = {

	_init: function(el) {
		var $el = $(el);
		var options = $el.data('popupoptions');

		if(!$el.data('popup-initialized')) {
			$el.attr('data-popup-initialized', 'true');
			methods._initonce(el);
		}
	},

	_initonce: function (el) {
		var $el = $(el);
		var $body = $('body');
		var $wrapper;
		var options = $el.data('popupoptions');
		var css;

			bodymarginright = parseInt($body.css('margin-right'), 10);
		var backgroundIdName = (options.backgroundelement) ? options.backgroundelement : ('#' + el.id + backgroundsuffix)
		if( !$('.jq_flyout_background').length) {
			$body.append('<div id="' + backgroundIdName + '" class="jq_flyout_background"></div>');
		}
		$backgroundElm = $('#'+backgroundIdName);
		var openelement = (options.openelement) ? options.openelement : ('.' + el.id + opensuffix);

		// Wrap element in wrapper

		$body.append(el);

		$el.wrap('<div id="' +el.id + '_wrapper" class="jq_flyout_wrapper" />');

		$wrapper = $('#' + el.id + '_wrapper');

		$wrapper.css({
			opacity:0,
			visibility: 'hidden'

		})

		if(options.transition) { // add css for transition
			$backgroundElm.css('transition', options.transition);
			$el.css('transition', options.transition);
			$wrapper.css('transition', options.transition);
		}
		// CSS vertical align helper
    	$wrapper.append('<div class="jq_flyout_align" />');

		// align left/right and slide direction
		methods.reposition(el);
		// lock scrolling barckground

		if(options.scrolllock) {
			// Calculate the browser's scrollbar width dynamically
			var parent;
			var child;
			if(typeof scrollbarwidth === 'undefined') {
				parent = $('<div style="width:50px;height: 50px; overflow:auto"><div/></div>').appendTo('body');
				child = parent.children();
				scrollbarwidth = child.innerWidth() - child.height(99).innerWidth();
				parent.remove();
			}
		}
		$(document).on('click', openelement, function(event) {
			methods.show(el);
		});

	},
	show: function(el) {
		var $el = $(el);
		var $body = $('body');
		var options = $el.data('popupoptions');
		var cssShow = {};
		var $wrapper = $('#' + el.id + '_wrapper');
		cssShow = {
				opacity:1,
				visibility: 'visible'
			};
		opentimer = setTimeout(function() {
			$wrapper.css(cssShow);
		}, 20);
		$el.css(cssShow);
		$backgroundElm.css({'visibility': 'visible', 'opacity': options.opacity});

		// Add popup id to visiblePopupsArray
		setTimeout(function() {
			visiblePopupsArray.push(el.id);
		}, 0);
		// Position popup
		if (options.slideDirection) {
			$el.css({'transform': 'translateX(0) translateY(0)'})
		}

		if(options.scrolllock) {
			$body.css({'overflow': 'hidden'});
			if($body.height() > $window.height()) {
				//$body.css('margin-right', bodymarginright+scrollbarwidth);
			}
		}
		// `beforeopen` callback event
    callback(el, options.beforeopen);
		// trigger when flyout is open
		callback(el, options.onopen);

	},
	hide: function(el, outerClick) {
		var $el = $(el);
		var $body = $('body');
		var options = $el.data('popupoptions');
		var $wrapper = $('#' + el.id + '_wrapper');

		var cssHide = {
				opacity: 0,
				visibility: 'hidden'
			};
		if(opentimer) clearTimeout(opentimer);
		// Get index of popup ID inside of visiblePopupsArray
		var popupIdIndex = $.inArray(el.id, visiblePopupsArray);

		// If popup is not opened, ignore the rest of the function
		if(popupIdIndex === -1) {
			return;
		}

		// Hide pop in mentioned direction
		if (options.slideDirection) {
			methods.reposition(el);

			//$wrapper.one('transitionend', function() {
					$el.css(cssHide);
					$wrapper.css(cssHide);
					$backgroundElm.css(cssHide);
	        //});
		} else {
			$el.css(cssHide);
			$wrapper.css(cssHide);
			$backgroundElm.css(cssHide);
		}
		// Re-enable scrolling of background layer
		if(options.scrolllock) {
			setTimeout(function() {
				$body.css({
					'overflow': 'visible',
					'margin-right': bodymarginright
				});
			}, 100);
		}

			visiblePopupsArray.splice(popupIdIndex, 1);
		// trigger when flyout is close
		callback(el, options.onclose);

	},
	reposition: function(el) {
		var $el = $(el);
		var options = $el.data('popupoptions');
		var $wrapper = $('#' + el.id + '_wrapper');
		var cssHide = {
				opacity:0,
				visibility: 'hidden'
			};
		// Horizontal position for overlay
		if (options.horizontal) {
			$wrapper.css('text-align', options.horizontal);
		}

		// Vertical position for overlay
		if(options.vertical) {
			$el.css('vertical-align', options.vertical);
		}
		// Slide direction / hide container in left/right/top/bottom
		if(options.slideDirection) {
			var containerW = $el.outerWidth();
			var containerH = $el.outerHeight();
			var offsetLeft = $el.offset().left;
			var offsetTop = $el.offset().top;
			var moveTopFlyoutContainer = containerH+offsetTop;

			if(options.slideDirection === 'left') { // hide flyout in left outside view area
				var removeSpaceLeft = containerW+offsetLeft;

				$el.css({'transform': 'translateX(-'+removeSpaceLeft+'px) translateY(0)'});
			} else if(options.slideDirection === 'right') { // hide flyout in right outside view area
				var addSpaceRight = containerW + ($(window).width() - parseInt( (containerW+offsetLeft), 10) );

				$el.css({'transform': 'translateX('+addSpaceRight+'px) translateY(0)'});
			} else if(options.slideDirection === 'bottom') {
				$el.css({'transform': 'translateX(0) translateY('+moveTopFlyoutContainer+'px)'})
			} else if(options.slideDirection === 'top' ) {
				$el.css({'transform': 'translateX(0) translateY(-'+moveTopFlyoutContainer+'px)'})
			}
		}

	}
};

/**
 * Callback event calls
 * @param {object} el - popup instance DOM node
 * @param {function} func - callback function
 */
var callback = function (el, func) {
	var options = $(el).data('popupoptions');
	var openelement = (options.openelement) ? options.openelement : ('.' +el.id + opensuffix);
	var elementclicked = $(openelement);
	if(typeof func === 'function') {
		func.call($(el), el);
	}
	// Hide flyout on escape
	$(document).on('keydown', function (event) {
		if(visiblePopupsArray.length) {
			var $el = $(el);
			if($el.data('popupoptions').escape && event.keyCode == 27) {
				methods.hide(el)
			}
		}
	});
	// Hide popup on click
	$(document).on('click', function (event) {
		if(visiblePopupsArray.length) {

			var $el = $(el);
			var closeButton = ($el.data('popupoptions').closeelement) ? $el.data('popupoptions').closeelement : ('.' + el.id + closesuffix)
			// If close button clicked
			if($(event.target).closest(closeButton).length) {
				event.preventDefault();
				methods.hide(el);
			}
			// If clicked outside of popup
			if( $(el).data('popupoptions').blur && !$(event.target).closest('#' + el.id).length && $(event.target).is(':visible') ) {
					// If clicked on outer content
					methods.hide(el, true);
			}
		}
	});
}
/**
 * Plugin API
*/
$.fn.flyout = function (customoptions) {
	return this.each(function () {
		var $el = $(this);

		if(typeof customoptions === 'object') {
			var opt = $.extend({}, $.fn.flyout.defaults, $el.data('popupoptions'), customoptions );
			$el.data('popupoptions', opt);
			options = $el.data('popupoptions');
			methods._init(this);
		} else {
			if( !($el.data('popupoptions')) ) {
				$el.data('popupoptions', $.fn.flyout.defaults);
				options = $el.data('popupoptions');
			}
			methods._init(this);
		}

	});
};

/* Default options */

$.fn.flyout.defaults = {
	type: 'overlay',
	backgroundelement: 'jq_flyout_background', /* create a background element with specify name */
	blur: false, /* close the flyout when clicked outside of it. */
	horizontal: 'center', /* horizontal alignment of the flyout */
	vertical: 'middle', /* vertical alignment of the flyout */
	opacity: '0.5', /* opacity of the background */
	slideDirection: null, /* sliding direction of the flyout left, right, top, bottom */
	transition: 'all 0.4s', /* transition on flyout, wrapper and background */
	scrolllock: true, /* stop scrolling of background */
	escape: true, /* close flyout on keydown escape */
	//onopen: null, /* trigger when open flyout */
	onopen: function() {
		var input = $(this).find('.flyout_searchbox');
		setTimeout(function() {
			input.focus();
		}, 100);
	},
	beforeopen: null,
	onclose: null /* tirgger when close flyout */
}
})(jQuery)
