/*--Included  Js files in this order
 1-jQuery UI - v1.10.2 --- not included ---- 
 
 2-moment.js version : 2.9.0    --- not included ---- 
 
 3-FullCalendar v2.4.0 --- not included ---- 
 
 4-fullcalendar-rightclick v1.6  --- not included ---- 
 
 5-Autosize 3.0.14  --- not included ---- autosize
 6-Time entry js  ---  not included ---- jquery.timeentry
 7-nanoScrollerJS            ------ not included ---- jquery.nanoscroller
 8-SignIn.js  -- included
 9-signUp.js -- included
 10-autocomplete.js   ..... included ----jquery.autocomplete.min  in mindialogoue
 */

/*! jQuery UI - v1.10.2 -*/
(function ($, undefined) {

    var uuid = 0,
            runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
    $.ui = $.ui || {};

    $.extend($.ui, {
        version: "1.10.2",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });

// plugins
    $.fn.extend({
        focus: (function (orig) {
            return function (delay, fn) {
                return typeof delay === "number" ?
                        this.each(function () {
                            var elem = this;
                            setTimeout(function () {
                                $(elem).focus();
                                if (fn) {
                                    fn.call(elem);
                                }
                            }, delay);
                        }) :
                        orig.apply(this, arguments);
            };
        })($.fn.focus),
        scrollParent: function () {
            var scrollParent;
            if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                scrollParent = this.parents().filter(function () {
                    return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0);
            } else {
                scrollParent = this.parents().filter(function () {
                    return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0);
            }

            return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
        },
        zIndex: function (zIndex) {
            if (zIndex !== undefined) {
                return this.css("zIndex", zIndex);
            }

            if (this.length) {
                var elem = $(this[ 0 ]), position, value;
                while (elem.length && elem[ 0 ] !== document) {
                    // Ignore z-index if position is set to a value where z-index is ignored by the browser
                    // This makes behavior of this function consistent across browsers
                    // WebKit always returns auto if the element is positioned
                    position = elem.css("position");
                    if (position === "absolute" || position === "relative" || position === "fixed") {
                        // IE returns 0 when zIndex is not specified
                        // other browsers return a string
                        // we ignore the case of nested elements with an explicit value of 0
                        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                        value = parseInt(elem.css("zIndex"), 10);
                        if (!isNaN(value) && value !== 0) {
                            return value;
                        }
                    }
                    elem = elem.parent();
                }
            }

            return 0;
        },
        uniqueId: function () {
            return this.each(function () {
                if (!this.id) {
                    this.id = "ui-id-" + (++uuid);
                }
            });
        },
        removeUniqueId: function () {
            return this.each(function () {
                if (runiqueId.test(this.id)) {
                    $(this).removeAttr("id");
                }
            });
        }
    });

// selectors
    function focusable(element, isTabIndexNotNaN) {
        var map, mapName, img,
                nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false;
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img);
        }
        return (/input|select|textarea|button|object/.test(nodeName) ?
                !element.disabled :
                "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                isTabIndexNotNaN) &&
                // the element and all of its ancestors must be visible
                visible(element);
    }

    function visible(element) {
        return $.expr.filters.visible(element) &&
                !$(element).parents().addBack().filter(function () {
            return $.css(this, "visibility") === "hidden";
        }).length;
    }

    $.extend($.expr[ ":" ], {
        data: $.expr.createPseudo ?
                $.expr.createPseudo(function (dataName) {
                    return function (elem) {
                        return !!$.data(elem, dataName);
                    };
                }) :
                // support: jQuery <1.8
                        function (elem, i, match) {
                            return !!$.data(elem, match[ 3 ]);
                        },
                focusable: function (element) {
                    return focusable(element, !isNaN($.attr(element, "tabindex")));
                },
                tabbable: function (element) {
                    var tabIndex = $.attr(element, "tabindex"),
                            isTabIndexNaN = isNaN(tabIndex);
                    return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
                }
            });

// support: jQuery <1.8
    if (!$("<a>").outerWidth(1).jquery) {
        $.each(["Width", "Height"], function (i, name) {
            var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                    type = name.toLowerCase(),
                    orig = {
                        innerWidth: $.fn.innerWidth,
                        innerHeight: $.fn.innerHeight,
                        outerWidth: $.fn.outerWidth,
                        outerHeight: $.fn.outerHeight
                    };

            function reduce(elem, size, border, margin) {
                $.each(side, function () {
                    size -= parseFloat($.css(elem, "padding" + this)) || 0;
                    if (border) {
                        size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
                    }
                    if (margin) {
                        size -= parseFloat($.css(elem, "margin" + this)) || 0;
                    }
                });
                return size;
            }

            $.fn[ "inner" + name ] = function (size) {
                if (size === undefined) {
                    return orig[ "inner" + name ].call(this);
                }

                return this.each(function () {
                    $(this).css(type, reduce(this, size) + "px");
                });
            };

            $.fn[ "outer" + name] = function (size, margin) {
                if (typeof size !== "number") {
                    return orig[ "outer" + name ].call(this, size);
                }

                return this.each(function () {
                    $(this).css(type, reduce(this, size, true, margin) + "px");
                });
            };
        });
    }

// support: jQuery <1.8
    if (!$.fn.addBack) {
        $.fn.addBack = function (selector) {
            return this.add(selector == null ?
                    this.prevObject : this.prevObject.filter(selector)
                    );
        };
    }

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
    if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
        $.fn.removeData = (function (removeData) {
            return function (key) {
                if (arguments.length) {
                    return removeData.call(this, $.camelCase(key));
                } else {
                    return removeData.call(this);
                }
            };
        })($.fn.removeData);
    }





// deprecated
    $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

    $.support.selectstart = "onselectstart" in document.createElement("div");
    $.fn.extend({
        disableSelection: function () {
            return this.bind(($.support.selectstart ? "selectstart" : "mousedown") +
                    ".ui-disableSelection", function (event) {
                        event.preventDefault();
                    });
        },
        enableSelection: function () {
            return this.unbind(".ui-disableSelection");
        }
    });

    $.extend($.ui, {
        // $.ui.plugin is deprecated.  Use the proxy pattern instead.
        plugin: {
            add: function (module, option, set) {
                var i,
                        proto = $.ui[ module ].prototype;
                for (i in set) {
                    proto.plugins[ i ] = proto.plugins[ i ] || [];
                    proto.plugins[ i ].push([option, set[ i ]]);
                }
            },
            call: function (instance, name, args) {
                var i,
                        set = instance.plugins[ name ];
                if (!set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11) {
                    return;
                }

                for (i = 0; i < set.length; i++) {
                    if (instance.options[ set[ i ][ 0 ] ]) {
                        set[ i ][ 1 ].apply(instance.element, args);
                    }
                }
            }
        },
        // only used by resizable
        hasScroll: function (el, a) {

            //If overflow is hidden, the element might have extra content, but the user wants to hide it
            if ($(el).css("overflow") === "hidden") {
                return false;
            }

            var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
                    has = false;

            if (el[ scroll ] > 0) {
                return true;
            }

            // TODO: determine which cases actually cause this to happen
            // if the element doesn't have the scroll set, see if it's possible to
            // set the scroll
            el[ scroll ] = 1;
            has = (el[ scroll ] > 0);
            el[ scroll ] = 0;
            return has;
        }
    });

})(jQuery);

(function ($, undefined) {

    var uuid = 0,
            slice = Array.prototype.slice,
            _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("remove");
                // http://bugs.jquery.com/ticket/8235
            } catch (e) {
            }
        }
        _cleanData(elems);
    };

    $.widget = function (name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype,
                // proxiedPrototype allows the provided prototype to remain unmodified
                // so that it can be used as a mixin for multiple widgets (#8876)
                proxiedPrototype = {},
                namespace = name.split(".")[ 0 ];

        name = name.split(".")[ 1 ];
        fullName = namespace + "-" + name;

        if (!prototype) {
            prototype = base;
            base = $.Widget;
        }

        // create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function (elem) {
            return !!$.data(elem, fullName);
        };

        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function (options, element) {
            // allow instantiation without "new" keyword
            if (!this._createWidget) {
                return new constructor(options, element);
            }

            // allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };
        // extend with the existing constructor to carry over any static properties
        $.extend(constructor, existingConstructor, {
            version: prototype.version,
            // copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: $.extend({}, prototype),
            // track widgets that inherit from this widget in case this widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function (prop, value) {
            if (!$.isFunction(value)) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function () {
                var _super = function () {
                    return base.prototype[ prop ].apply(this, arguments);
                },
                        _superApply = function (args) {
                            return base.prototype[ prop ].apply(this, args);
                        };
                return function () {
                    var __super = this._super,
                            __superApply = this._superApply,
                            returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply(this, arguments);

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend(basePrototype, {
            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets that
        // are inheriting from it and redefine all of them so that they inherit from
        // the new version of this widget. We're essentially trying to replace one
        // level in the prototype chain.
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function (i, child) {
                var childPrototype = child.prototype;

                // redefine the child widget using the same prototype that was
                // originally used, but inherit from the new version of the base
                $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
            });
            // remove the list of existing child constructors from the old constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push(constructor);
        }

        $.widget.bridge(name, constructor);
    };

    $.widget.extend = function (target) {
        var input = slice.call(arguments, 1),
                inputIndex = 0,
                inputLength = input.length,
                key,
                value;
        for (; inputIndex < inputLength; inputIndex++) {
            for (key in input[ inputIndex ]) {
                value = input[ inputIndex ][ key ];
                if (input[ inputIndex ].hasOwnProperty(key) && value !== undefined) {
                    // Clone objects
                    if ($.isPlainObject(value)) {
                        target[ key ] = $.isPlainObject(target[ key ]) ?
                                $.widget.extend({}, target[ key ], value) :
                                // Don't extend strings, arrays, etc. with objects
                                $.widget.extend({}, value);
                        // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function (name, object) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function (options) {
            var isMethodCall = typeof options === "string",
                    args = slice.call(arguments, 1),
                    returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
                    $.widget.extend.apply(null, [options].concat(args)) :
                    options;

            if (isMethodCall) {
                this.each(function () {
                    var methodValue,
                            instance = $.data(this, fullName);
                    if (!instance) {
                        return $.error("cannot call methods on " + name + " prior to initialization; " +
                                "attempted to call method '" + options + "'");
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        return $.error("no such method '" + options + "' for " + name + " widget instance");
                    }
                    methodValue = instance[ options ].apply(instance, args);
                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue && methodValue.jquery ?
                                returnValue.pushStack(methodValue.get()) :
                                methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $.data(this, fullName);
                    if (instance) {
                        instance.option(options || {})._init();
                    } else {
                        $.data(this, fullName, new object(options, this));
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function ( /* options, element */ ) {};
    $.Widget._childConstructors = [];

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,
            // callbacks
            create: null
        },
        _createWidget: function (options, element) {
            element = $(element || this.defaultElement || this)[ 0 ];
            this.element = $(element);
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend({},
                    this.options,
                    this._getCreateOptions(),
                    options);

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();

            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function (event) {
                        if (event.target === element) {
                            this.destroy();
                        }
                    }
                });
                this.document = $(element.style ?
                        // element within the document
                        element.ownerDocument :
                        // element is window or document
                        element.document || element);
                this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
            }

            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,
        destroy: function () {
            this._destroy();
            // we can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                    .unbind(this.eventNamespace)
                    // 1.9 BC for #7810
                    // TODO remove dual storage
                    .removeData(this.widgetName)
                    .removeData(this.widgetFullName)
                    // support: jquery <1.6.3
                    // http://bugs.jquery.com/ticket/9413
                    .removeData($.camelCase(this.widgetFullName));
            this.widget()
                    .unbind(this.eventNamespace)
                    .removeAttr("aria-disabled")
                    .removeClass(
                            this.widgetFullName + "-disabled " +
                            "ui-state-disabled");

            // clean up events and states
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus");
        },
        _destroy: $.noop,
        widget: function () {
            return this.element;
        },
        option: function (key, value) {
            var options = key,
                    parts,
                    curOption,
                    i;

            if (arguments.length === 0) {
                // don't return a reference to the internal hash
                return $.widget.extend({}, this.options);
            }

            if (typeof key === "string") {
                // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[ key ] = $.widget.extend({}, this.options[ key ]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if (value === undefined) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if (value === undefined) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions(options);

            return this;
        },
        _setOptions: function (options) {
            var key;

            for (key in options) {
                this._setOption(key, options[ key ]);
            }

            return this;
        },
        _setOption: function (key, value) {
            this.options[ key ] = value;

            if (key === "disabled") {
                this.widget()
                        .toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value)
                        .attr("aria-disabled", value);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus");
            }

            return this;
        },
        enable: function () {
            return this._setOption("disabled", false);
        },
        disable: function () {
            return this._setOption("disabled", true);
        },
        _on: function (suppressDisabledCheck, element, handlers) {
            var delegateElement,
                    instance = this;

            // no suppressDisabledCheck flag, shuffle arguments
            if (typeof suppressDisabledCheck !== "boolean") {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // no element argument, shuffle and use this.element
            if (!handlers) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                // accept selectors, DOM elements
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element);
            }

            $.each(handlers, function (event, handler) {
                function handlerProxy() {
                    // allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if (!suppressDisabledCheck &&
                            (instance.options.disabled === true ||
                                    $(this).hasClass("ui-state-disabled"))) {
                        return;
                    }
                    return (typeof handler === "string" ? instance[ handler ] : handler)
                            .apply(instance, arguments);
                }

                // copy the guid so direct unbinding works
                if (typeof handler !== "string") {
                    handlerProxy.guid = handler.guid =
                            handler.guid || handlerProxy.guid || $.guid++;
                }

                var match = event.match(/^(\w+)\s*(.*)$/),
                        eventName = match[1] + instance.eventNamespace,
                        selector = match[2];
                if (selector) {
                    delegateElement.delegate(selector, eventName, handlerProxy);
                } else {
                    element.bind(eventName, handlerProxy);
                }
            });
        },
        _off: function (element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            element.unbind(eventName).undelegate(eventName);
        },
        _delay: function (handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[ handler ] : handler)
                        .apply(instance, arguments);
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        },
        _hoverable: function (element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function (event) {
                    $(event.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function (event) {
                    $(event.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function (element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function (event) {
                    $(event.currentTarget).addClass("ui-state-focus");
                },
                focusout: function (event) {
                    $(event.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function (type, event, data) {
            var prop, orig,
                    callback = this.options[ type ];

            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ?
                    type :
                    this.widgetEventPrefix + type).toLowerCase();
            // the original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.element[ 0 ];

            // copy original event properties over to the new event
            orig = event.originalEvent;
            if (orig) {
                for (prop in orig) {
                    if (!(prop in event)) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger(event, data);
            return !($.isFunction(callback) &&
                    callback.apply(this.element[0], [event].concat(data)) === false ||
                    event.isDefaultPrevented());
        }
    };

    $.each({show: "fadeIn", hide: "fadeOut"}, function (method, defaultEffect) {
        $.Widget.prototype[ "_" + method ] = function (element, options, callback) {
            if (typeof options === "string") {
                options = {effect: options};
            }
            var hasOptions,
                    effectName = !options ?
                    method :
                    options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = {duration: options};
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay);
            }
            if (hasOptions && $.effects && $.effects.effect[ effectName ]) {
                element[ method ](options);
            } else if (effectName !== method && element[ effectName ]) {
                element[ effectName ](options.duration, options.easing, callback);
            } else {
                element.queue(function (next) {
                    $(this)[ method ]();
                    if (callback) {
                        callback.call(element[ 0 ]);
                    }
                    next();
                });
            }
        };
    });

})(jQuery);

(function ($, undefined) {

    var mouseHandled = false;
    $(document).mouseup(function () {
        mouseHandled = false;
    });

    $.widget("ui.mouse", {
        version: "1.10.2",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var that = this;

            this.element
                    .bind("mousedown." + this.widgetName, function (event) {
                        return that._mouseDown(event);
                    })
                    .bind("click." + this.widgetName, function (event) {
                        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                            $.removeData(event.target, that.widgetName + ".preventClickEvent");
                            event.stopImmediatePropagation();
                            return false;
                        }
                    });

            this.started = false;
        },
        // TODO: make sure destroying one instance of mouse doesn't mess with
        // other instances of mouse
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName);
            if (this._mouseMoveDelegate) {
                $(document)
                        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            }
        },
        _mouseDown: function (event) {
            // don't let more than one widget handle mouseStart
            if (mouseHandled) {
                return;
            }

            // we may have missed mouseup (out of window)
            (this._mouseStarted && this._mouseUp(event));

            this._mouseDownEvent = event;

            var that = this,
                    btnIsLeft = (event.which === 1),
                    // event.target.nodeName works around a bug in IE 8 with
                    // disabled inputs (#7620)
                    elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }

            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function () {
                    that.mouseDelayMet = true;
                }, this.options.delay);
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }

            // Click event may never have fired (Gecko & Opera)
            if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, this.widgetName + ".preventClickEvent");
            }

            // these delegates are required to keep context
            this._mouseMoveDelegate = function (event) {
                return that._mouseMove(event);
            };
            this._mouseUpDelegate = function (event) {
                return that._mouseUp(event);
            };
            $(document)
                    .bind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                    .bind("mouseup." + this.widgetName, this._mouseUpDelegate);

            event.preventDefault();

            mouseHandled = true;
            return true;
        },
        _mouseMove: function (event) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
                return this._mouseUp(event);
            }

            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault();
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted =
                        (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }

            return !this._mouseStarted;
        },
        _mouseUp: function (event) {
            $(document)
                    .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
                    .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);

            if (this._mouseStarted) {
                this._mouseStarted = false;

                if (event.target === this._mouseDownEvent.target) {
                    $.data(event.target, this.widgetName + ".preventClickEvent", true);
                }

                this._mouseStop(event);
            }

            return false;
        },
        _mouseDistanceMet: function (event) {
            return (Math.max(
                    Math.abs(this._mouseDownEvent.pageX - event.pageX),
                    Math.abs(this._mouseDownEvent.pageY - event.pageY)
                    ) >= this.options.distance
                    );
        },
        _mouseDelayMet: function (/* event */) {
            return this.mouseDelayMet;
        },
        // These are placeholder methods, to be overriden by extending plugin
        _mouseStart: function (/* event */) {},
        _mouseDrag: function (/* event */) {},
        _mouseStop: function (/* event */) {},
        _mouseCapture: function (/* event */) {
            return true;
        }
    });

})(jQuery);

(function ($, undefined) {

    $.widget("ui.draggable", $.ui.mouse, {
        version: "1.10.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false,
            // callbacks
            drag: null,
            start: null,
            stop: null
        },
        _create: function () {

            if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
                this.element[0].style.position = "relative";
            }
            if (this.options.addClasses) {
                this.element.addClass("ui-draggable");
            }
            if (this.options.disabled) {
                this.element.addClass("ui-draggable-disabled");
            }

            this._mouseInit();

        },
        _destroy: function () {
            this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
            this._mouseDestroy();
        },
        _mouseCapture: function (event) {

            var o = this.options;

            // among others, prevent a drag on a resizable-handle
            if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
                return false;
            }

            //Quit if we're not on a valid handle
            this.handle = this._getHandle(event);
            if (!this.handle) {
                return false;
            }

            $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function () {
                $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
                        .css({
                            width: this.offsetWidth + "px", height: this.offsetHeight + "px",
                            position: "absolute", opacity: "0.001", zIndex: 1000
                        })
                        .css($(this).offset())
                        .appendTo("body");
            });

            return true;

        },
        _mouseStart: function (event) {

            var o = this.options;

            //Create and append the visible helper
            this.helper = this._createHelper(event);

            this.helper.addClass("ui-draggable-dragging");

            //Cache the helper size
            this._cacheHelperProportions();

            //If ddmanager is used for droppables, set the global draggable
            if ($.ui.ddmanager) {
                $.ui.ddmanager.current = this;
            }

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Store the helper's css position
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();

            //The element's absolute position on the page minus margins
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };

            $.extend(this.offset, {
                click: {//Where the click happened, relative to the element
                    left: event.pageX - this.offset.left,
                    top: event.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });

            //Generate the original position
            this.originalPosition = this.position = this._generatePosition(event);
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Set a containment if given in the options
            if (o.containment) {
                this._setContainment();
            }

            //Trigger event + callbacks
            if (this._trigger("start", event) === false) {
                this._clear();
                return false;
            }

            //Recache the helper size
            this._cacheHelperProportions();

            //Prepare the droppable offsets
            if ($.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(this, event);
            }


            this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

            //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
            if ($.ui.ddmanager) {
                $.ui.ddmanager.dragStart(this, event);
            }

            return true;
        },
        _mouseDrag: function (event, noPropagation) {

            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");

            //Call plugins and callbacks and use the resulting position if something is returned
            if (!noPropagation) {
                var ui = this._uiHash();
                if (this._trigger("drag", event, ui) === false) {
                    this._mouseUp({});
                    return false;
                }
                this.position = ui.position;
            }

            if (!this.options.axis || this.options.axis !== "y") {
                this.helper[0].style.left = this.position.left + "px";
            }
            if (!this.options.axis || this.options.axis !== "x") {
                this.helper[0].style.top = this.position.top + "px";
            }
            if ($.ui.ddmanager) {
                $.ui.ddmanager.drag(this, event);
            }

            return false;
        },
        _mouseStop: function (event) {

            //If we are using droppables, inform the manager about the drop
            var element,
                    that = this,
                    elementInDom = false,
                    dropped = false;
            if ($.ui.ddmanager && !this.options.dropBehaviour) {
                dropped = $.ui.ddmanager.drop(this, event);
            }

            //if a drop comes from outside (a sortable)
            if (this.dropped) {
                dropped = this.dropped;
                this.dropped = false;
            }

            //if the original element is no longer in the DOM don't bother to continue (see #8269)
            element = this.element[0];
            while (element && (element = element.parentNode)) {
                if (element === document) {
                    elementInDom = true;
                }
            }
            if (!elementInDom && this.options.helper === "original") {
                return false;
            }

            if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
                $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    if (that._trigger("stop", event) !== false) {
                        that._clear();
                    }
                });
            } else {
                if (this._trigger("stop", event) !== false) {
                    this._clear();
                }
            }

            return false;
        },
        _mouseUp: function (event) {
            //Remove frame helpers
            $("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this);
            });

            //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
            if ($.ui.ddmanager) {
                $.ui.ddmanager.dragStop(this, event);
            }

            return $.ui.mouse.prototype._mouseUp.call(this, event);
        },
        cancel: function () {

            if (this.helper.is(".ui-draggable-dragging")) {
                this._mouseUp({});
            } else {
                this._clear();
            }

            return this;

        },
        _getHandle: function (event) {
            return this.options.handle ?
                    !!$(event.target).closest(this.element.find(this.options.handle)).length :
                    true;
        },
        _createHelper: function (event) {

            var o = this.options,
                    helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

            if (!helper.parents("body").length) {
                helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
            }

            if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
                helper.css("position", "absolute");
            }

            return helper;

        },
        _adjustOffsetFromHelper: function (obj) {
            if (typeof obj === "string") {
                obj = obj.split(" ");
            }
            if ($.isArray(obj)) {
                obj = {left: +obj[0], top: +obj[1] || 0};
            }
            if ("left" in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ("right" in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ("top" in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ("bottom" in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },
        _getParentOffset: function () {

            //Get the offsetParent and cache its position
            this.offsetParent = this.helper.offsetParent();
            var po = this.offsetParent.offset();

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            //This needs to be actually done for all browsers, since pageX/pageY includes this information
            //Ugly IE fix
            if ((this.offsetParent[0] === document.body) ||
                    (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
                po = {top: 0, left: 0};
            }

            return {
                top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };

        },
        _getRelativeOffset: function () {

            if (this.cssPosition === "relative") {
                var p = this.element.position();
                return {
                    top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return {top: 0, left: 0};
            }

        },
        _cacheMargins: function () {
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"), 10) || 0),
                top: (parseInt(this.element.css("marginTop"), 10) || 0),
                right: (parseInt(this.element.css("marginRight"), 10) || 0),
                bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
            };
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function () {

            var over, c, ce,
                    o = this.options;

            if (o.containment === "parent") {
                o.containment = this.helper[0].parentNode;
            }
            if (o.containment === "document" || o.containment === "window") {
                this.containment = [
                    o.containment === "document" ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
                    o.containment === "document" ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                    (o.containment === "document" ? 0 : $(window).scrollLeft()) + $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
                    (o.containment === "document" ? 0 : $(window).scrollTop()) + ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            }

            if (!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor !== Array) {
                c = $(o.containment);
                ce = c[0];

                if (!ce) {
                    return;
                }

                over = ($(ce).css("overflow") !== "hidden");

                this.containment = [
                    (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0),
                    (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0),
                    (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderRightWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
                    (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderBottomWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom
                ];
                this.relative_container = c;

            } else if (o.containment.constructor === Array) {
                this.containment = o.containment;
            }

        },
        _convertPositionTo: function (d, pos) {

            if (!pos) {
                pos = this.position;
            }

            var mod = d === "absolute" ? 1 : -1,
                    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            return {
                top: (
                        pos.top + // The absolute mouse position
                        this.offset.relative.top * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.top * mod - // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)
                        ),
                left: (
                        pos.left + // The absolute mouse position
                        this.offset.relative.left * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.left * mod - // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod)
                        )
            };

        },
        _generatePosition: function (event) {

            var containment, co, top, left,
                    o = this.options,
                    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                    scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName),
                    pageX = event.pageX,
                    pageY = event.pageY;

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            if (this.originalPosition) { //If we are not dragging yet, we won't check for options
                if (this.containment) {
                    if (this.relative_container) {
                        co = this.relative_container.offset();
                        containment = [this.containment[0] + co.left,
                            this.containment[1] + co.top,
                            this.containment[2] + co.left,
                            this.containment[3] + co.top];
                    } else {
                        containment = this.containment;
                    }

                    if (event.pageX - this.offset.click.left < containment[0]) {
                        pageX = containment[0] + this.offset.click.left;
                    }
                    if (event.pageY - this.offset.click.top < containment[1]) {
                        pageY = containment[1] + this.offset.click.top;
                    }
                    if (event.pageX - this.offset.click.left > containment[2]) {
                        pageX = containment[2] + this.offset.click.left;
                    }
                    if (event.pageY - this.offset.click.top > containment[3]) {
                        pageY = containment[3] + this.offset.click.top;
                    }
                }

                if (o.grid) {
                    //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
                    top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
                    pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                    left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
                    pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
                }

            }

            return {
                top: (
                        pageY - // The absolute mouse position
                        this.offset.click.top - // Click offset (relative to the element)
                        this.offset.relative.top - // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.top + // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))
                        ),
                left: (
                        pageX - // The absolute mouse position
                        this.offset.click.left - // Click offset (relative to the element)
                        this.offset.relative.left - // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.left + // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()))
                        )
            };

        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging");
            if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
                this.helper.remove();
            }
            this.helper = null;
            this.cancelHelperRemoval = false;
        },
        // From now on bulk stuff - mainly helpers

        _trigger: function (type, event, ui) {
            ui = ui || this._uiHash();
            $.ui.plugin.call(this, type, [event, ui]);
            //The absolute position has to be recalculated after plugins
            if (type === "drag") {
                this.positionAbs = this._convertPositionTo("absolute");
            }
            return $.Widget.prototype._trigger.call(this, type, event, ui);
        },
        plugins: {},
        _uiHash: function () {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }

    });

    $.ui.plugin.add("draggable", "connectToSortable", {
        start: function (event, ui) {

            var inst = $(this).data("ui-draggable"), o = inst.options,
                    uiSortable = $.extend({}, ui, {item: inst.element});
            inst.sortables = [];
            $(o.connectToSortable).each(function () {
                var sortable = $.data(this, "ui-sortable");
                if (sortable && !sortable.options.disabled) {
                    inst.sortables.push({
                        instance: sortable,
                        shouldRevert: sortable.options.revert
                    });
                    sortable.refreshPositions();    // Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
                    sortable._trigger("activate", event, uiSortable);
                }
            });

        },
        stop: function (event, ui) {

            //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
            var inst = $(this).data("ui-draggable"),
                    uiSortable = $.extend({}, ui, {item: inst.element});

            $.each(inst.sortables, function () {
                if (this.instance.isOver) {

                    this.instance.isOver = 0;

                    inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
                    this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

                    //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
                    if (this.shouldRevert) {
                        this.instance.options.revert = this.shouldRevert;
                    }

                    //Trigger the stop of the sortable
                    this.instance._mouseStop(event);

                    this.instance.options.helper = this.instance.options._helper;

                    //If the helper has been the original item, restore properties in the sortable
                    if (inst.options.helper === "original") {
                        this.instance.currentItem.css({top: "auto", left: "auto"});
                    }

                } else {
                    this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
                    this.instance._trigger("deactivate", event, uiSortable);
                }

            });

        },
        drag: function (event, ui) {

            var inst = $(this).data("ui-draggable"), that = this;

            $.each(inst.sortables, function () {

                var innermostIntersecting = false,
                        thisSortable = this;

                //Copy over some variables to allow calling the sortable's native _intersectsWith
                this.instance.positionAbs = inst.positionAbs;
                this.instance.helperProportions = inst.helperProportions;
                this.instance.offset.click = inst.offset.click;

                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    innermostIntersecting = true;
                    $.each(inst.sortables, function () {
                        this.instance.positionAbs = inst.positionAbs;
                        this.instance.helperProportions = inst.helperProportions;
                        this.instance.offset.click = inst.offset.click;
                        if (this !== thisSortable &&
                                this.instance._intersectsWith(this.instance.containerCache) &&
                                $.contains(thisSortable.instance.element[0], this.instance.element[0])
                                ) {
                            innermostIntersecting = false;
                        }
                        return innermostIntersecting;
                    });
                }


                if (innermostIntersecting) {
                    //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
                    if (!this.instance.isOver) {

                        this.instance.isOver = 1;
                        //Now we fake the start of dragging for the sortable instance,
                        //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
                        //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
                        this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
                        this.instance.options.helper = function () {
                            return ui.helper[0];
                        };

                        event.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(event, true);
                        this.instance._mouseStart(event, true, true);

                        //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
                        this.instance.offset.click.top = inst.offset.click.top;
                        this.instance.offset.click.left = inst.offset.click.left;
                        this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

                        inst._trigger("toSortable", event);
                        inst.dropped = this.instance.element; //draggable revert needs that
                        //hack so receive/update callbacks work (mostly)
                        inst.currentItem = inst.element;
                        this.instance.fromOutside = inst;

                    }

                    //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
                    if (this.instance.currentItem) {
                        this.instance._mouseDrag(event);
                    }

                } else {

                    //If it doesn't intersect with the sortable, and it intersected before,
                    //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
                    if (this.instance.isOver) {

                        this.instance.isOver = 0;
                        this.instance.cancelHelperRemoval = true;

                        //Prevent reverting on this forced stop
                        this.instance.options.revert = false;

                        // The out event needs to be triggered independently
                        this.instance._trigger("out", event, this.instance._uiHash(this.instance));

                        this.instance._mouseStop(event, true);
                        this.instance.options.helper = this.instance.options._helper;

                        //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
                        this.instance.currentItem.remove();
                        if (this.instance.placeholder) {
                            this.instance.placeholder.remove();
                        }

                        inst._trigger("fromSortable", event);
                        inst.dropped = false; //draggable revert needs that
                    }

                }

            });

        }
    });

    $.ui.plugin.add("draggable", "cursor", {
        start: function () {
            var t = $("body"), o = $(this).data("ui-draggable").options;
            if (t.css("cursor")) {
                o._cursor = t.css("cursor");
            }
            t.css("cursor", o.cursor);
        },
        stop: function () {
            var o = $(this).data("ui-draggable").options;
            if (o._cursor) {
                $("body").css("cursor", o._cursor);
            }
        }
    });

    $.ui.plugin.add("draggable", "opacity", {
        start: function (event, ui) {
            var t = $(ui.helper), o = $(this).data("ui-draggable").options;
            if (t.css("opacity")) {
                o._opacity = t.css("opacity");
            }
            t.css("opacity", o.opacity);
        },
        stop: function (event, ui) {
            var o = $(this).data("ui-draggable").options;
            if (o._opacity) {
                $(ui.helper).css("opacity", o._opacity);
            }
        }
    });

    $.ui.plugin.add("draggable", "scroll", {
        start: function () {
            var i = $(this).data("ui-draggable");
            if (i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
                i.overflowOffset = i.scrollParent.offset();
            }
        },
        drag: function (event) {

            var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

            if (i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

                if (!o.axis || o.axis !== "x") {
                    if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
                        i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
                    } else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
                        i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
                    }
                }

                if (!o.axis || o.axis !== "y") {
                    if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
                        i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
                    } else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
                        i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
                    }
                }

            } else {

                if (!o.axis || o.axis !== "x") {
                    if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    } else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }
                }

                if (!o.axis || o.axis !== "y") {
                    if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    } else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }
                }

            }

            if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(i, event);
            }

        }
    });

    $.ui.plugin.add("draggable", "snap", {
        start: function () {

            var i = $(this).data("ui-draggable"),
                    o = i.options;

            i.snapElements = [];

            $(o.snap.constructor !== String ? (o.snap.items || ":data(ui-draggable)") : o.snap).each(function () {
                var $t = $(this),
                        $o = $t.offset();
                if (this !== i.element[0]) {
                    i.snapElements.push({
                        item: this,
                        width: $t.outerWidth(), height: $t.outerHeight(),
                        top: $o.top, left: $o.left
                    });
                }
            });

        },
        drag: function (event, ui) {

            var ts, bs, ls, rs, l, r, t, b, i, first,
                    inst = $(this).data("ui-draggable"),
                    o = inst.options,
                    d = o.snapTolerance,
                    x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
                    y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

            for (i = inst.snapElements.length - 1; i >= 0; i--) {

                l = inst.snapElements[i].left;
                r = l + inst.snapElements[i].width;
                t = inst.snapElements[i].top;
                b = t + inst.snapElements[i].height;

                //Yes, I know, this is insane ;)
                if (!((l - d < x1 && x1 < r + d && t - d < y1 && y1 < b + d) || (l - d < x1 && x1 < r + d && t - d < y2 && y2 < b + d) || (l - d < x2 && x2 < r + d && t - d < y1 && y1 < b + d) || (l - d < x2 && x2 < r + d && t - d < y2 && y2 < b + d))) {
                    if (inst.snapElements[i].snapping) {
                        (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {snapItem: inst.snapElements[i].item})));
                    }
                    inst.snapElements[i].snapping = false;
                    continue;
                }

                if (o.snapMode !== "inner") {
                    ts = Math.abs(t - y2) <= d;
                    bs = Math.abs(b - y1) <= d;
                    ls = Math.abs(l - x2) <= d;
                    rs = Math.abs(r - x1) <= d;
                    if (ts) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                    }
                    if (bs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b, left: 0}).top - inst.margins.top;
                    }
                    if (ls) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l - inst.helperProportions.width}).left - inst.margins.left;
                    }
                    if (rs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r}).left - inst.margins.left;
                    }
                }

                first = (ts || bs || ls || rs);

                if (o.snapMode !== "outer") {
                    ts = Math.abs(t - y1) <= d;
                    bs = Math.abs(b - y2) <= d;
                    ls = Math.abs(l - x1) <= d;
                    rs = Math.abs(r - x2) <= d;
                    if (ts) {
                        ui.position.top = inst._convertPositionTo("relative", {top: t, left: 0}).top - inst.margins.top;
                    }
                    if (bs) {
                        ui.position.top = inst._convertPositionTo("relative", {top: b - inst.helperProportions.height, left: 0}).top - inst.margins.top;
                    }
                    if (ls) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: l}).left - inst.margins.left;
                    }
                    if (rs) {
                        ui.position.left = inst._convertPositionTo("relative", {top: 0, left: r - inst.helperProportions.width}).left - inst.margins.left;
                    }
                }

                if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
                    (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {snapItem: inst.snapElements[i].item})));
                }
                inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

            }

        }
    });

    $.ui.plugin.add("draggable", "stack", {
        start: function () {
            var min,
                    o = this.data("ui-draggable").options,
                    group = $.makeArray($(o.stack)).sort(function (a, b) {
                return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
            });

            if (!group.length) {
                return;
            }

            min = parseInt($(group[0]).css("zIndex"), 10) || 0;
            $(group).each(function (i) {
                $(this).css("zIndex", min + i);
            });
            this.css("zIndex", (min + group.length));
        }
    });

    $.ui.plugin.add("draggable", "zIndex", {
        start: function (event, ui) {
            var t = $(ui.helper), o = $(this).data("ui-draggable").options;
            if (t.css("zIndex")) {
                o._zIndex = t.css("zIndex");
            }
            t.css("zIndex", o.zIndex);
        },
        stop: function (event, ui) {
            var o = $(this).data("ui-draggable").options;
            if (o._zIndex) {
                $(ui.helper).css("zIndex", o._zIndex);
            }
        }
    });

})(jQuery);

(function ($, undefined) {

    function isOverAxis(x, reference, size) {
        return (x > reference) && (x < (reference + size));
    }

    $.widget("ui.droppable", {
        version: "1.10.2",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect",
            // callbacks
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function () {

            var o = this.options,
                    accept = o.accept;

            this.isover = false;
            this.isout = true;

            this.accept = $.isFunction(accept) ? accept : function (d) {
                return d.is(accept);
            };

            //Store the droppable's proportions
            this.proportions = {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight};

            // Add the reference and positions to the manager
            $.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
            $.ui.ddmanager.droppables[o.scope].push(this);

            (o.addClasses && this.element.addClass("ui-droppable"));

        },
        _destroy: function () {
            var i = 0,
                    drop = $.ui.ddmanager.droppables[this.options.scope];

            for (; i < drop.length; i++) {
                if (drop[i] === this) {
                    drop.splice(i, 1);
                }
            }

            this.element.removeClass("ui-droppable ui-droppable-disabled");
        },
        _setOption: function (key, value) {

            if (key === "accept") {
                this.accept = $.isFunction(value) ? value : function (d) {
                    return d.is(value);
                };
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _activate: function (event) {
            var draggable = $.ui.ddmanager.current;
            if (this.options.activeClass) {
                this.element.addClass(this.options.activeClass);
            }
            if (draggable) {
                this._trigger("activate", event, this.ui(draggable));
            }
        },
        _deactivate: function (event) {
            var draggable = $.ui.ddmanager.current;
            if (this.options.activeClass) {
                this.element.removeClass(this.options.activeClass);
            }
            if (draggable) {
                this._trigger("deactivate", event, this.ui(draggable));
            }
        },
        _over: function (event) {

            var draggable = $.ui.ddmanager.current;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return;
            }

            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
                if (this.options.hoverClass) {
                    this.element.addClass(this.options.hoverClass);
                }
                this._trigger("over", event, this.ui(draggable));
            }

        },
        _out: function (event) {

            var draggable = $.ui.ddmanager.current;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return;
            }

            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
                if (this.options.hoverClass) {
                    this.element.removeClass(this.options.hoverClass);
                }
                this._trigger("out", event, this.ui(draggable));
            }

        },
        _drop: function (event, custom) {

            var draggable = custom || $.ui.ddmanager.current,
                    childrenIntersection = false;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return false;
            }

            this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
                var inst = $.data(this, "ui-droppable");
                if (
                        inst.options.greedy &&
                        !inst.options.disabled &&
                        inst.options.scope === draggable.options.scope &&
                        inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) &&
                        $.ui.intersect(draggable, $.extend(inst, {offset: inst.element.offset()}), inst.options.tolerance)
                        ) {
                    childrenIntersection = true;
                    return false;
                }
            });
            if (childrenIntersection) {
                return false;
            }

            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
                if (this.options.activeClass) {
                    this.element.removeClass(this.options.activeClass);
                }
                if (this.options.hoverClass) {
                    this.element.removeClass(this.options.hoverClass);
                }
                this._trigger("drop", event, this.ui(draggable));
                return this.element;
            }

            return false;

        },
        ui: function (c) {
            return {
                draggable: (c.currentItem || c.element),
                helper: c.helper,
                position: c.position,
                offset: c.positionAbs
            };
        }

    });

    $.ui.intersect = function (draggable, droppable, toleranceMode) {

        if (!droppable.offset) {
            return false;
        }

        var draggableLeft, draggableTop,
                x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
                y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height,
                l = droppable.offset.left, r = l + droppable.proportions.width,
                t = droppable.offset.top, b = t + droppable.proportions.height;

        switch (toleranceMode) {
            case "fit":
                return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
            case "intersect":
                return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half
                        x2 - (draggable.helperProportions.width / 2) < r && // Left Half
                        t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half
                        y2 - (draggable.helperProportions.height / 2) < b); // Top Half
            case "pointer":
                draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left);
                draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top);
                return isOverAxis(draggableTop, t, droppable.proportions.height) && isOverAxis(draggableLeft, l, droppable.proportions.width);
            case "touch":
                return (
                        (y1 >= t && y1 <= b) || // Top edge touching
                        (y2 >= t && y2 <= b) || // Bottom edge touching
                        (y1 < t && y2 > b)      // Surrounded vertically
                        ) && (
                        (x1 >= l && x1 <= r) || // Left edge touching
                        (x2 >= l && x2 <= r) || // Right edge touching
                        (x1 < l && x2 > r)      // Surrounded horizontally
                        );
            default:
                return false;
        }

    };

    /*
     This manager tracks offsets of draggables and droppables
     */
    $.ui.ddmanager = {
        current: null,
        droppables: {"default": []},
        prepareOffsets: function (t, event) {

            var i, j,
                    m = $.ui.ddmanager.droppables[t.options.scope] || [],
                    type = event ? event.type : null, // workaround for #2317
                    list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

            droppablesLoop: for (i = 0; i < m.length; i++) {

                //No disabled and non-accepted
                if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
                    continue;
                }

                // Filter out elements in the current dragged item
                for (j = 0; j < list.length; j++) {
                    if (list[j] === m[i].element[0]) {
                        m[i].proportions.height = 0;
                        continue droppablesLoop;
                    }
                }

                m[i].visible = m[i].element.css("display") !== "none";
                if (!m[i].visible) {
                    continue;
                }

                //Activate the droppable if used directly from draggables
                if (type === "mousedown") {
                    m[i]._activate.call(m[i], event);
                }

                m[i].offset = m[i].element.offset();
                m[i].proportions = {width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight};

            }

        },
        drop: function (draggable, event) {

            var dropped = false;
            // Create a copy of the droppables in case the list changes during the drop (#9116)
            $.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function () {

                if (!this.options) {
                    return;
                }
                if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {
                    dropped = this._drop.call(this, event) || dropped;
                }

                if (!this.options.disabled && this.visible && this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
                    this.isout = true;
                    this.isover = false;
                    this._deactivate.call(this, event);
                }

            });
            return dropped;

        },
        dragStart: function (draggable, event) {
            //Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
            draggable.element.parentsUntil("body").bind("scroll.droppable", function () {
                if (!draggable.options.refreshPositions) {
                    $.ui.ddmanager.prepareOffsets(draggable, event);
                }
            });
        },
        drag: function (draggable, event) {

            //If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
            if (draggable.options.refreshPositions) {
                $.ui.ddmanager.prepareOffsets(draggable, event);
            }

            //Run through all droppables and check their positions based on specific tolerance options
            $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function () {

                if (this.options.disabled || this.greedyChild || !this.visible) {
                    return;
                }

                var parentInstance, scope, parent,
                        intersects = $.ui.intersect(draggable, this, this.options.tolerance),
                        c = !intersects && this.isover ? "isout" : (intersects && !this.isover ? "isover" : null);
                if (!c) {
                    return;
                }

                if (this.options.greedy) {
                    // find droppable parents with same scope
                    scope = this.options.scope;
                    parent = this.element.parents(":data(ui-droppable)").filter(function () {
                        return $.data(this, "ui-droppable").options.scope === scope;
                    });

                    if (parent.length) {
                        parentInstance = $.data(parent[0], "ui-droppable");
                        parentInstance.greedyChild = (c === "isover");
                    }
                }

                // we just moved into a greedy child
                if (parentInstance && c === "isover") {
                    parentInstance.isover = false;
                    parentInstance.isout = true;
                    parentInstance._out.call(parentInstance, event);
                }

                this[c] = true;
                this[c === "isout" ? "isover" : "isout"] = false;
                this[c === "isover" ? "_over" : "_out"].call(this, event);

                // we just moved out of a greedy child
                if (parentInstance && c === "isout") {
                    parentInstance.isout = false;
                    parentInstance.isover = true;
                    parentInstance._over.call(parentInstance, event);
                }
            });

        },
        dragStop: function (draggable, event) {
            draggable.element.parentsUntil("body").unbind("scroll.droppable");
            //Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
            if (!draggable.options.refreshPositions) {
                $.ui.ddmanager.prepareOffsets(draggable, event);
            }
        }
    };

})(jQuery);

(function ($, undefined) {

    function num(v) {
        return parseInt(v, 10) || 0;
    }

    function isNumber(value) {
        return !isNaN(parseInt(value, 10));
    }

    $.widget("ui.resizable", $.ui.mouse, {
        version: "1.10.2",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: false,
            animate: false,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: false,
            autoHide: false,
            containment: false,
            ghost: false,
            grid: false,
            handles: "e,s,se",
            helper: false,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            // See #7960
            zIndex: 90,
            // callbacks
            resize: null,
            start: null,
            stop: null
        },
        _create: function () {

            var n, i, handle, axis, hname,
                    that = this,
                    o = this.options;
            this.element.addClass("ui-resizable");

            $.extend(this, {
                _aspectRatio: !!(o.aspectRatio),
                aspectRatio: o.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
            });

            //Wrap the element if it cannot hold child nodes
            if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

                //Create a wrapper element and set the wrapper to the new current internal element
                this.element.wrap(
                        $("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
                    position: this.element.css("position"),
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight(),
                    top: this.element.css("top"),
                    left: this.element.css("left")
                })
                        );

                //Overwrite the original this.element
                this.element = this.element.parent().data(
                        "ui-resizable", this.element.data("ui-resizable")
                        );

                this.elementIsWrapper = true;

                //Move margins to the wrapper
                this.element.css({marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom")});
                this.originalElement.css({marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

                //Prevent Safari textarea resize
                this.originalResizeStyle = this.originalElement.css("resize");
                this.originalElement.css("resize", "none");

                //Push the actual element to our proportionallyResize internal array
                this._proportionallyResizeElements.push(this.originalElement.css({position: "static", zoom: 1, display: "block"}));

                // avoid IE jump (hard set the margin)
                this.originalElement.css({margin: this.originalElement.css("margin")});

                // fix handlers offset
                this._proportionallyResize();

            }

            this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : {n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw"});
            if (this.handles.constructor === String) {

                if (this.handles === "all") {
                    this.handles = "n,e,s,w,se,sw,ne,nw";
                }

                n = this.handles.split(",");
                this.handles = {};

                for (i = 0; i < n.length; i++) {

                    handle = $.trim(n[i]);
                    hname = "ui-resizable-" + handle;
                    axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

                    // Apply zIndex to all handles - see #7960
                    axis.css({zIndex: o.zIndex});

                    //TODO : What's going on here?
                    if ("se" === handle) {
                        axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
                    }

                    //Insert into internal handles object and append to element
                    this.handles[handle] = ".ui-resizable-" + handle;
                    this.element.append(axis);
                }

            }

            this._renderAxis = function (target) {

                var i, axis, padPos, padWrapper;

                target = target || this.element;

                for (i in this.handles) {

                    if (this.handles[i].constructor === String) {
                        this.handles[i] = $(this.handles[i], this.element).show();
                    }

                    //Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

                        axis = $(this.handles[i], this.element);

                        //Checking the correct pad and border
                        padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

                        //The padding type i have to apply...
                        padPos = ["padding",
                            /ne|nw|n/.test(i) ? "Top" :
                                    /se|sw|s/.test(i) ? "Bottom" :
                                    /^e$/.test(i) ? "Right" : "Left"].join("");

                        target.css(padPos, padWrapper);

                        this._proportionallyResize();

                    }

                    //TODO: What's that good for? There's not anything to be executed left
                    if (!$(this.handles[i]).length) {
                        continue;
                    }
                }
            };

            //TODO: make renderAxis a prototype function
            this._renderAxis(this.element);

            this._handles = $(".ui-resizable-handle", this.element)
                    .disableSelection();

            //Matching axis name
            this._handles.mouseover(function () {
                if (!that.resizing) {
                    if (this.className) {
                        axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                    }
                    //Axis, default = se
                    that.axis = axis && axis[1] ? axis[1] : "se";
                }
            });

            //If we want to auto hide the elements
            if (o.autoHide) {
                this._handles.hide();
                $(this.element)
                        .addClass("ui-resizable-autohide")
                        .mouseenter(function () {
                            if (o.disabled) {
                                return;
                            }
                            $(this).removeClass("ui-resizable-autohide");
                            that._handles.show();
                        })
                        .mouseleave(function () {
                            if (o.disabled) {
                                return;
                            }
                            if (!that.resizing) {
                                $(this).addClass("ui-resizable-autohide");
                                that._handles.hide();
                            }
                        });
            }

            //Initialize the mouse interaction
            this._mouseInit();

        },
        _destroy: function () {

            this._mouseDestroy();

            var wrapper,
                    _destroy = function (exp) {
                        $(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
                                .removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
                    };

            //TODO: Unwrap at same DOM position
            if (this.elementIsWrapper) {
                _destroy(this.element);
                wrapper = this.element;
                this.originalElement.css({
                    position: wrapper.css("position"),
                    width: wrapper.outerWidth(),
                    height: wrapper.outerHeight(),
                    top: wrapper.css("top"),
                    left: wrapper.css("left")
                }).insertAfter(wrapper);
                wrapper.remove();
            }

            this.originalElement.css("resize", this.originalResizeStyle);
            _destroy(this.originalElement);

            return this;
        },
        _mouseCapture: function (event) {
            var i, handle,
                    capture = false;

            for (i in this.handles) {
                handle = $(this.handles[i])[0];
                if (handle === event.target || $.contains(handle, event.target)) {
                    capture = true;
                }
            }

            return !this.options.disabled && capture;
        },
        _mouseStart: function (event) {

            var curleft, curtop, cursor,
                    o = this.options,
                    iniPos = this.element.position(),
                    el = this.element;

            this.resizing = true;

            // bugfix for http://dev.jquery.com/ticket/1749
            if ((/absolute/).test(el.css("position"))) {
                el.css({position: "absolute", top: el.css("top"), left: el.css("left")});
            } else if (el.is(".ui-draggable")) {
                el.css({position: "absolute", top: iniPos.top, left: iniPos.left});
            }

            this._renderProxy();

            curleft = num(this.helper.css("left"));
            curtop = num(this.helper.css("top"));

            if (o.containment) {
                curleft += $(o.containment).scrollLeft() || 0;
                curtop += $(o.containment).scrollTop() || 0;
            }

            //Store needed variables
            this.offset = this.helper.offset();
            this.position = {left: curleft, top: curtop};
            this.size = this._helper ? {width: el.outerWidth(), height: el.outerHeight()} : {width: el.width(), height: el.height()};
            this.originalSize = this._helper ? {width: el.outerWidth(), height: el.outerHeight()} : {width: el.width(), height: el.height()};
            this.originalPosition = {left: curleft, top: curtop};
            this.sizeDiff = {width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height()};
            this.originalMousePosition = {left: event.pageX, top: event.pageY};

            //Aspect Ratio
            this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

            cursor = $(".ui-resizable-" + this.axis).css("cursor");
            $("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

            el.addClass("ui-resizable-resizing");
            this._propagate("start", event);
            return true;
        },
        _mouseDrag: function (event) {

            //Increase performance, avoid regex
            var data,
                    el = this.helper, props = {},
                    smp = this.originalMousePosition,
                    a = this.axis,
                    prevTop = this.position.top,
                    prevLeft = this.position.left,
                    prevWidth = this.size.width,
                    prevHeight = this.size.height,
                    dx = (event.pageX - smp.left) || 0,
                    dy = (event.pageY - smp.top) || 0,
                    trigger = this._change[a];

            if (!trigger) {
                return false;
            }

            // Calculate the attrs that will be change
            data = trigger.apply(this, [event, dx, dy]);

            // Put this in the mouseDrag handler since the user can start pressing shift while resizing
            this._updateVirtualBoundaries(event.shiftKey);
            if (this._aspectRatio || event.shiftKey) {
                data = this._updateRatio(data, event);
            }

            data = this._respectSize(data, event);

            this._updateCache(data);

            // plugins callbacks need to be called first
            this._propagate("resize", event);

            if (this.position.top !== prevTop) {
                props.top = this.position.top + "px";
            }
            if (this.position.left !== prevLeft) {
                props.left = this.position.left + "px";
            }
            if (this.size.width !== prevWidth) {
                props.width = this.size.width + "px";
            }
            if (this.size.height !== prevHeight) {
                props.height = this.size.height + "px";
            }
            el.css(props);

            if (!this._helper && this._proportionallyResizeElements.length) {
                this._proportionallyResize();
            }

            // Call the user callback if the element was resized
            if (!$.isEmptyObject(props)) {
                this._trigger("resize", event, this.ui());
            }

            return false;
        },
        _mouseStop: function (event) {

            this.resizing = false;
            var pr, ista, soffseth, soffsetw, s, left, top,
                    o = this.options, that = this;

            if (this._helper) {

                pr = this._proportionallyResizeElements;
                ista = pr.length && (/textarea/i).test(pr[0].nodeName);
                soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height;
                soffsetw = ista ? 0 : that.sizeDiff.width;

                s = {width: (that.helper.width() - soffsetw), height: (that.helper.height() - soffseth)};
                left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
                top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

                if (!o.animate) {
                    this.element.css($.extend(s, {top: top, left: left}));
                }

                that.helper.height(that.size.height);
                that.helper.width(that.size.width);

                if (this._helper && !o.animate) {
                    this._proportionallyResize();
                }
            }

            $("body").css("cursor", "auto");

            this.element.removeClass("ui-resizable-resizing");

            this._propagate("stop", event);

            if (this._helper) {
                this.helper.remove();
            }

            return false;

        },
        _updateVirtualBoundaries: function (forceAspectRatio) {
            var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
                    o = this.options;

            b = {
                minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
                maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
                minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
                maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
            };

            if (this._aspectRatio || forceAspectRatio) {
                // We want to create an enclosing box whose aspect ration is the requested one
                // First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
                pMinWidth = b.minHeight * this.aspectRatio;
                pMinHeight = b.minWidth / this.aspectRatio;
                pMaxWidth = b.maxHeight * this.aspectRatio;
                pMaxHeight = b.maxWidth / this.aspectRatio;

                if (pMinWidth > b.minWidth) {
                    b.minWidth = pMinWidth;
                }
                if (pMinHeight > b.minHeight) {
                    b.minHeight = pMinHeight;
                }
                if (pMaxWidth < b.maxWidth) {
                    b.maxWidth = pMaxWidth;
                }
                if (pMaxHeight < b.maxHeight) {
                    b.maxHeight = pMaxHeight;
                }
            }
            this._vBoundaries = b;
        },
        _updateCache: function (data) {
            this.offset = this.helper.offset();
            if (isNumber(data.left)) {
                this.position.left = data.left;
            }
            if (isNumber(data.top)) {
                this.position.top = data.top;
            }
            if (isNumber(data.height)) {
                this.size.height = data.height;
            }
            if (isNumber(data.width)) {
                this.size.width = data.width;
            }
        },
        _updateRatio: function (data) {

            var cpos = this.position,
                    csize = this.size,
                    a = this.axis;

            if (isNumber(data.height)) {
                data.width = (data.height * this.aspectRatio);
            } else if (isNumber(data.width)) {
                data.height = (data.width / this.aspectRatio);
            }

            if (a === "sw") {
                data.left = cpos.left + (csize.width - data.width);
                data.top = null;
            }
            if (a === "nw") {
                data.top = cpos.top + (csize.height - data.height);
                data.left = cpos.left + (csize.width - data.width);
            }

            return data;
        },
        _respectSize: function (data) {

            var o = this._vBoundaries,
                    a = this.axis,
                    ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
                    isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
                    dw = this.originalPosition.left + this.originalSize.width,
                    dh = this.position.top + this.size.height,
                    cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
            if (isminw) {
                data.width = o.minWidth;
            }
            if (isminh) {
                data.height = o.minHeight;
            }
            if (ismaxw) {
                data.width = o.maxWidth;
            }
            if (ismaxh) {
                data.height = o.maxHeight;
            }

            if (isminw && cw) {
                data.left = dw - o.minWidth;
            }
            if (ismaxw && cw) {
                data.left = dw - o.maxWidth;
            }
            if (isminh && ch) {
                data.top = dh - o.minHeight;
            }
            if (ismaxh && ch) {
                data.top = dh - o.maxHeight;
            }

            // fixing jump error on top/left - bug #2330
            if (!data.width && !data.height && !data.left && data.top) {
                data.top = null;
            } else if (!data.width && !data.height && !data.top && data.left) {
                data.left = null;
            }

            return data;
        },
        _proportionallyResize: function () {

            if (!this._proportionallyResizeElements.length) {
                return;
            }

            var i, j, borders, paddings, prel,
                    element = this.helper || this.element;

            for (i = 0; i < this._proportionallyResizeElements.length; i++) {

                prel = this._proportionallyResizeElements[i];

                if (!this.borderDif) {
                    this.borderDif = [];
                    borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
                    paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

                    for (j = 0; j < borders.length; j++) {
                        this.borderDif[ j ] = (parseInt(borders[ j ], 10) || 0) + (parseInt(paddings[ j ], 10) || 0);
                    }
                }

                prel.css({
                    height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
                    width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
                });

            }

        },
        _renderProxy: function () {

            var el = this.element, o = this.options;
            this.elementOffset = el.offset();

            if (this._helper) {

                this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() - 1,
                    height: this.element.outerHeight() - 1,
                    position: "absolute",
                    left: this.elementOffset.left + "px",
                    top: this.elementOffset.top + "px",
                    zIndex: ++o.zIndex //TODO: Don't modify option
                });

                this.helper
                        .appendTo("body")
                        .disableSelection();

            } else {
                this.helper = this.element;
            }

        },
        _change: {
            e: function (event, dx) {
                return {width: this.originalSize.width + dx};
            },
            w: function (event, dx) {
                var cs = this.originalSize, sp = this.originalPosition;
                return {left: sp.left + dx, width: cs.width - dx};
            },
            n: function (event, dx, dy) {
                var cs = this.originalSize, sp = this.originalPosition;
                return {top: sp.top + dy, height: cs.height - dy};
            },
            s: function (event, dx, dy) {
                return {height: this.originalSize.height + dy};
            },
            se: function (event, dx, dy) {
                return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
            },
            sw: function (event, dx, dy) {
                return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
            },
            ne: function (event, dx, dy) {
                return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
            },
            nw: function (event, dx, dy) {
                return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
            }
        },
        _propagate: function (n, event) {
            $.ui.plugin.call(this, n, [event, this.ui()]);
            (n !== "resize" && this._trigger(n, event, this.ui()));
        },
        plugins: {},
        ui: function () {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            };
        }

    });

    /*
     * Resizable Extensions
     */

    $.ui.plugin.add("resizable", "animate", {
        stop: function (event) {
            var that = $(this).data("ui-resizable"),
                    o = that.options,
                    pr = that._proportionallyResizeElements,
                    ista = pr.length && (/textarea/i).test(pr[0].nodeName),
                    soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height,
                    soffsetw = ista ? 0 : that.sizeDiff.width,
                    style = {width: (that.size.width - soffsetw), height: (that.size.height - soffseth)},
            left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null,
                    top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

            that.element.animate(
                    $.extend(style, top && left ? {top: top, left: left} : {}), {
                duration: o.animateDuration,
                easing: o.animateEasing,
                step: function () {

                    var data = {
                        width: parseInt(that.element.css("width"), 10),
                        height: parseInt(that.element.css("height"), 10),
                        top: parseInt(that.element.css("top"), 10),
                        left: parseInt(that.element.css("left"), 10)
                    };

                    if (pr && pr.length) {
                        $(pr[0]).css({width: data.width, height: data.height});
                    }

                    // propagating resize, and updating values for each animation step
                    that._updateCache(data);
                    that._propagate("resize", event);

                }
            }
            );
        }

    });

    $.ui.plugin.add("resizable", "containment", {
        start: function () {
            var element, p, co, ch, cw, width, height,
                    that = $(this).data("ui-resizable"),
                    o = that.options,
                    el = that.element,
                    oc = o.containment,
                    ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;

            if (!ce) {
                return;
            }

            that.containerElement = $(ce);

            if (/document/.test(oc) || oc === document) {
                that.containerOffset = {left: 0, top: 0};
                that.containerPosition = {left: 0, top: 0};

                that.parentData = {
                    element: $(document), left: 0, top: 0,
                    width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
                };
            }

            // i'm a node, so compute top, left, right, bottom
            else {
                element = $(ce);
                p = [];
                $(["Top", "Right", "Left", "Bottom"]).each(function (i, name) {
                    p[i] = num(element.css("padding" + name));
                });

                that.containerOffset = element.offset();
                that.containerPosition = element.position();
                that.containerSize = {height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1])};

                co = that.containerOffset;
                ch = that.containerSize.height;
                cw = that.containerSize.width;
                width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw);
                height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

                that.parentData = {
                    element: ce, left: co.left, top: co.top, width: width, height: height
                };
            }
        },
        resize: function (event) {
            var woset, hoset, isParent, isOffsetRelative,
                    that = $(this).data("ui-resizable"),
                    o = that.options,
                    co = that.containerOffset, cp = that.position,
                    pRatio = that._aspectRatio || event.shiftKey,
                    cop = {top: 0, left: 0}, ce = that.containerElement;

            if (ce[0] !== document && (/static/).test(ce.css("position"))) {
                cop = co;
            }

            if (cp.left < (that._helper ? co.left : 0)) {
                that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
                if (pRatio) {
                    that.size.height = that.size.width / that.aspectRatio;
                }
                that.position.left = o.helper ? co.left : 0;
            }

            if (cp.top < (that._helper ? co.top : 0)) {
                that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
                if (pRatio) {
                    that.size.width = that.size.height * that.aspectRatio;
                }
                that.position.top = that._helper ? co.top : 0;
            }

            that.offset.left = that.parentData.left + that.position.left;
            that.offset.top = that.parentData.top + that.position.top;

            woset = Math.abs((that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width);
            hoset = Math.abs((that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height);

            isParent = that.containerElement.get(0) === that.element.parent().get(0);
            isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

            if (isParent && isOffsetRelative) {
                woset -= that.parentData.left;
            }

            if (woset + that.size.width >= that.parentData.width) {
                that.size.width = that.parentData.width - woset;
                if (pRatio) {
                    that.size.height = that.size.width / that.aspectRatio;
                }
            }

            if (hoset + that.size.height >= that.parentData.height) {
                that.size.height = that.parentData.height - hoset;
                if (pRatio) {
                    that.size.width = that.size.height * that.aspectRatio;
                }
            }
        },
        stop: function () {
            var that = $(this).data("ui-resizable"),
                    o = that.options,
                    co = that.containerOffset,
                    cop = that.containerPosition,
                    ce = that.containerElement,
                    helper = $(that.helper),
                    ho = helper.offset(),
                    w = helper.outerWidth() - that.sizeDiff.width,
                    h = helper.outerHeight() - that.sizeDiff.height;

            if (that._helper && !o.animate && (/relative/).test(ce.css("position"))) {
                $(this).css({left: ho.left - cop.left - co.left, width: w, height: h});
            }

            if (that._helper && !o.animate && (/static/).test(ce.css("position"))) {
                $(this).css({left: ho.left - cop.left - co.left, width: w, height: h});
            }

        }
    });

    $.ui.plugin.add("resizable", "alsoResize", {
        start: function () {
            var that = $(this).data("ui-resizable"),
                    o = that.options,
                    _store = function (exp) {
                        $(exp).each(function () {
                            var el = $(this);
                            el.data("ui-resizable-alsoresize", {
                                width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
                                left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
                            });
                        });
                    };

            if (typeof (o.alsoResize) === "object" && !o.alsoResize.parentNode) {
                if (o.alsoResize.length) {
                    o.alsoResize = o.alsoResize[0];
                    _store(o.alsoResize);
                } else {
                    $.each(o.alsoResize, function (exp) {
                        _store(exp);
                    });
                }
            } else {
                _store(o.alsoResize);
            }
        },
        resize: function (event, ui) {
            var that = $(this).data("ui-resizable"),
                    o = that.options,
                    os = that.originalSize,
                    op = that.originalPosition,
                    delta = {
                        height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
                        top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
                    },
            _alsoResize = function (exp, c) {
                $(exp).each(function () {
                    var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
                            css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

                    $.each(css, function (i, prop) {
                        var sum = (start[prop] || 0) + (delta[prop] || 0);
                        if (sum && sum >= 0) {
                            style[prop] = sum || null;
                        }
                    });

                    el.css(style);
                });
            };

            if (typeof (o.alsoResize) === "object" && !o.alsoResize.nodeType) {
                $.each(o.alsoResize, function (exp, c) {
                    _alsoResize(exp, c);
                });
            } else {
                _alsoResize(o.alsoResize);
            }
        },
        stop: function () {
            $(this).removeData("resizable-alsoresize");
        }
    });

    $.ui.plugin.add("resizable", "ghost", {
        start: function () {

            var that = $(this).data("ui-resizable"), o = that.options, cs = that.size;

            that.ghost = that.originalElement.clone();
            that.ghost
                    .css({opacity: 0.25, display: "block", position: "relative", height: cs.height, width: cs.width, margin: 0, left: 0, top: 0})
                    .addClass("ui-resizable-ghost")
                    .addClass(typeof o.ghost === "string" ? o.ghost : "");

            that.ghost.appendTo(that.helper);

        },
        resize: function () {
            var that = $(this).data("ui-resizable");
            if (that.ghost) {
                that.ghost.css({position: "relative", height: that.size.height, width: that.size.width});
            }
        },
        stop: function () {
            var that = $(this).data("ui-resizable");
            if (that.ghost && that.helper) {
                that.helper.get(0).removeChild(that.ghost.get(0));
            }
        }

    });

    $.ui.plugin.add("resizable", "grid", {
        resize: function () {
            var that = $(this).data("ui-resizable"),
                    o = that.options,
                    cs = that.size,
                    os = that.originalSize,
                    op = that.originalPosition,
                    a = that.axis,
                    grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
                    gridX = (grid[0] || 1),
                    gridY = (grid[1] || 1),
                    ox = Math.round((cs.width - os.width) / gridX) * gridX,
                    oy = Math.round((cs.height - os.height) / gridY) * gridY,
                    newWidth = os.width + ox,
                    newHeight = os.height + oy,
                    isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
                    isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
                    isMinWidth = o.minWidth && (o.minWidth > newWidth),
                    isMinHeight = o.minHeight && (o.minHeight > newHeight);

            o.grid = grid;

            if (isMinWidth) {
                newWidth = newWidth + gridX;
            }
            if (isMinHeight) {
                newHeight = newHeight + gridY;
            }
            if (isMaxWidth) {
                newWidth = newWidth - gridX;
            }
            if (isMaxHeight) {
                newHeight = newHeight - gridY;
            }

            if (/^(se|s|e)$/.test(a)) {
                that.size.width = newWidth;
                that.size.height = newHeight;
            } else if (/^(ne)$/.test(a)) {
                that.size.width = newWidth;
                that.size.height = newHeight;
                that.position.top = op.top - oy;
            } else if (/^(sw)$/.test(a)) {
                that.size.width = newWidth;
                that.size.height = newHeight;
                that.position.left = op.left - ox;
            } else {
                that.size.width = newWidth;
                that.size.height = newHeight;
                that.position.top = op.top - oy;
                that.position.left = op.left - ox;
            }
        }

    });

})(jQuery);

(function ($, undefined) {

    $.widget("ui.selectable", $.ui.mouse, {
        version: "1.10.2",
        options: {
            appendTo: "body",
            autoRefresh: true,
            distance: 0,
            filter: "*",
            tolerance: "touch",
            // callbacks
            selected: null,
            selecting: null,
            start: null,
            stop: null,
            unselected: null,
            unselecting: null
        },
        _create: function () {
            var selectees,
                    that = this;

            this.element.addClass("ui-selectable");

            this.dragged = false;

            // cache selectee children based on filter
            this.refresh = function () {
                selectees = $(that.options.filter, that.element[0]);
                selectees.addClass("ui-selectee");
                selectees.each(function () {
                    var $this = $(this),
                            pos = $this.offset();
                    $.data(this, "selectable-item", {
                        element: this,
                        $element: $this,
                        left: pos.left,
                        top: pos.top,
                        right: pos.left + $this.outerWidth(),
                        bottom: pos.top + $this.outerHeight(),
                        startselected: false,
                        selected: $this.hasClass("ui-selected"),
                        selecting: $this.hasClass("ui-selecting"),
                        unselecting: $this.hasClass("ui-unselecting")
                    });
                });
            };
            this.refresh();

            this.selectees = selectees.addClass("ui-selectee");

            this._mouseInit();

            this.helper = $("<div class='ui-selectable-helper'></div>");
        },
        _destroy: function () {
            this.selectees
                    .removeClass("ui-selectee")
                    .removeData("selectable-item");
            this.element
                    .removeClass("ui-selectable ui-selectable-disabled");
            this._mouseDestroy();
        },
        _mouseStart: function (event) {
            var that = this,
                    options = this.options;

            this.opos = [event.pageX, event.pageY];

            if (this.options.disabled) {
                return;
            }

            this.selectees = $(options.filter, this.element[0]);

            this._trigger("start", event);

            $(options.appendTo).append(this.helper);
            // position helper (lasso)
            this.helper.css({
                "left": event.pageX,
                "top": event.pageY,
                "width": 0,
                "height": 0
            });

            if (options.autoRefresh) {
                this.refresh();
            }

            this.selectees.filter(".ui-selected").each(function () {
                var selectee = $.data(this, "selectable-item");
                selectee.startselected = true;
                if (!event.metaKey && !event.ctrlKey) {
                    selectee.$element.removeClass("ui-selected");
                    selectee.selected = false;
                    selectee.$element.addClass("ui-unselecting");
                    selectee.unselecting = true;
                    // selectable UNSELECTING callback
                    that._trigger("unselecting", event, {
                        unselecting: selectee.element
                    });
                }
            });

            $(event.target).parents().addBack().each(function () {
                var doSelect,
                        selectee = $.data(this, "selectable-item");
                if (selectee) {
                    doSelect = (!event.metaKey && !event.ctrlKey) || !selectee.$element.hasClass("ui-selected");
                    selectee.$element
                            .removeClass(doSelect ? "ui-unselecting" : "ui-selected")
                            .addClass(doSelect ? "ui-selecting" : "ui-unselecting");
                    selectee.unselecting = !doSelect;
                    selectee.selecting = doSelect;
                    selectee.selected = doSelect;
                    // selectable (UN)SELECTING callback
                    if (doSelect) {
                        that._trigger("selecting", event, {
                            selecting: selectee.element
                        });
                    } else {
                        that._trigger("unselecting", event, {
                            unselecting: selectee.element
                        });
                    }
                    return false;
                }
            });

        },
        _mouseDrag: function (event) {

            this.dragged = true;

            if (this.options.disabled) {
                return;
            }

            var tmp,
                    that = this,
                    options = this.options,
                    x1 = this.opos[0],
                    y1 = this.opos[1],
                    x2 = event.pageX,
                    y2 = event.pageY;

            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.helper.css({left: x1, top: y1, width: x2 - x1, height: y2 - y1});

            this.selectees.each(function () {
                var selectee = $.data(this, "selectable-item"),
                        hit = false;

                //prevent helper from being selected if appendTo: selectable
                if (!selectee || selectee.element === that.element[0]) {
                    return;
                }

                if (options.tolerance === "touch") {
                    hit = (!(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1));
                } else if (options.tolerance === "fit") {
                    hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
                }

                if (hit) {
                    // SELECT
                    if (selectee.selected) {
                        selectee.$element.removeClass("ui-selected");
                        selectee.selected = false;
                    }
                    if (selectee.unselecting) {
                        selectee.$element.removeClass("ui-unselecting");
                        selectee.unselecting = false;
                    }
                    if (!selectee.selecting) {
                        selectee.$element.addClass("ui-selecting");
                        selectee.selecting = true;
                        // selectable SELECTING callback
                        that._trigger("selecting", event, {
                            selecting: selectee.element
                        });
                    }
                } else {
                    // UNSELECT
                    if (selectee.selecting) {
                        if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
                            selectee.$element.removeClass("ui-selecting");
                            selectee.selecting = false;
                            selectee.$element.addClass("ui-selected");
                            selectee.selected = true;
                        } else {
                            selectee.$element.removeClass("ui-selecting");
                            selectee.selecting = false;
                            if (selectee.startselected) {
                                selectee.$element.addClass("ui-unselecting");
                                selectee.unselecting = true;
                            }
                            // selectable UNSELECTING callback
                            that._trigger("unselecting", event, {
                                unselecting: selectee.element
                            });
                        }
                    }
                    if (selectee.selected) {
                        if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
                            selectee.$element.removeClass("ui-selected");
                            selectee.selected = false;

                            selectee.$element.addClass("ui-unselecting");
                            selectee.unselecting = true;
                            // selectable UNSELECTING callback
                            that._trigger("unselecting", event, {
                                unselecting: selectee.element
                            });
                        }
                    }
                }
            });

            return false;
        },
        _mouseStop: function (event) {
            var that = this;

            this.dragged = false;

            $(".ui-unselecting", this.element[0]).each(function () {
                var selectee = $.data(this, "selectable-item");
                selectee.$element.removeClass("ui-unselecting");
                selectee.unselecting = false;
                selectee.startselected = false;
                that._trigger("unselected", event, {
                    unselected: selectee.element
                });
            });
            $(".ui-selecting", this.element[0]).each(function () {
                var selectee = $.data(this, "selectable-item");
                selectee.$element.removeClass("ui-selecting").addClass("ui-selected");
                selectee.selecting = false;
                selectee.selected = true;
                selectee.startselected = true;
                that._trigger("selected", event, {
                    selected: selectee.element
                });
            });
            this._trigger("stop", event);

            this.helper.remove();

            return false;
        }

    });

})(jQuery);

(function ($, undefined) {

    /*jshint loopfunc: true */

    function isOverAxis(x, reference, size) {
        return (x > reference) && (x < (reference + size));
    }

    function isFloating(item) {
        return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
    }

    $.widget("ui.sortable", $.ui.mouse, {
        version: "1.10.2",
        widgetEventPrefix: "sort",
        ready: false,
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000,
            // callbacks
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _create: function () {

            var o = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");

            //Get the items
            this.refresh();

            //Let's determine if the items are being displayed horizontally
            this.floating = this.items.length ? o.axis === "x" || isFloating(this.items[0].item) : false;

            //Let's determine the parent's offset
            this.offset = this.element.offset();

            //Initialize mouse events for interaction
            this._mouseInit();

            //We're ready to go
            this.ready = true;

        },
        _destroy: function () {
            this.element
                    .removeClass("ui-sortable ui-sortable-disabled");
            this._mouseDestroy();

            for (var i = this.items.length - 1; i >= 0; i--) {
                this.items[i].item.removeData(this.widgetName + "-item");
            }

            return this;
        },
        _setOption: function (key, value) {
            if (key === "disabled") {
                this.options[ key ] = value;

                this.widget().toggleClass("ui-sortable-disabled", !!value);
            } else {
                // Don't call widget base _setOption for disable as it adds ui-state-disabled class
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
        _mouseCapture: function (event, overrideHandle) {
            var currentItem = null,
                    validHandle = false,
                    that = this;

            if (this.reverting) {
                return false;
            }

            if (this.options.disabled || this.options.type === "static") {
                return false;
            }

            //We have to refresh the items data once first
            this._refreshItems(event);

            //Find out if the clicked node (or one of its parents) is a actual item in this.items
            $(event.target).parents().each(function () {
                if ($.data(this, that.widgetName + "-item") === that) {
                    currentItem = $(this);
                    return false;
                }
            });
            if ($.data(event.target, that.widgetName + "-item") === that) {
                currentItem = $(event.target);
            }

            if (!currentItem) {
                return false;
            }
            if (this.options.handle && !overrideHandle) {
                $(this.options.handle, currentItem).find("*").addBack().each(function () {
                    if (this === event.target) {
                        validHandle = true;
                    }
                });
                if (!validHandle) {
                    return false;
                }
            }

            this.currentItem = currentItem;
            this._removeCurrentsFromItems();
            return true;

        },
        _mouseStart: function (event, overrideHandle, noActivation) {

            var i, body,
                    o = this.options;

            this.currentContainer = this;

            //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
            this.refreshPositions();

            //Create and append the visible helper
            this.helper = this._createHelper(event);

            //Cache the helper size
            this._cacheHelperProportions();

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Get the next scrolling parent
            this.scrollParent = this.helper.scrollParent();

            //The element's absolute position on the page minus margins
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };

            $.extend(this.offset, {
                click: {//Where the click happened, relative to the element
                    left: event.pageX - this.offset.left,
                    top: event.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });

            // Only after we got the offset, we can change the helper's position to absolute
            // TODO: Still need to figure out a way to make relative sorting possible
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");

            //Generate the original position
            this.originalPosition = this._generatePosition(event);
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Cache the former DOM position
            this.domPosition = {prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0]};

            //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
            if (this.helper[0] !== this.currentItem[0]) {
                this.currentItem.hide();
            }

            //Create the placeholder
            this._createPlaceholder();

            //Set a containment if given in the options
            if (o.containment) {
                this._setContainment();
            }

            if (o.cursor && o.cursor !== "auto") { // cursor option
                body = this.document.find("body");

                // support: IE
                this.storedCursor = body.css("cursor");
                body.css("cursor", o.cursor);

                this.storedStylesheet = $("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(body);
            }

            if (o.opacity) { // opacity option
                if (this.helper.css("opacity")) {
                    this._storedOpacity = this.helper.css("opacity");
                }
                this.helper.css("opacity", o.opacity);
            }

            if (o.zIndex) { // zIndex option
                if (this.helper.css("zIndex")) {
                    this._storedZIndex = this.helper.css("zIndex");
                }
                this.helper.css("zIndex", o.zIndex);
            }

            //Prepare scrolling
            if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
                this.overflowOffset = this.scrollParent.offset();
            }

            //Call callbacks
            this._trigger("start", event, this._uiHash());

            //Recache the helper size
            if (!this._preserveHelperProportions) {
                this._cacheHelperProportions();
            }


            //Post "activate" events to possible containers
            if (!noActivation) {
                for (i = this.containers.length - 1; i >= 0; i--) {
                    this.containers[ i ]._trigger("activate", event, this._uiHash(this));
                }
            }

            //Prepare possible droppables
            if ($.ui.ddmanager) {
                $.ui.ddmanager.current = this;
            }

            if ($.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(this, event);
            }

            this.dragging = true;

            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
            return true;

        },
        _mouseDrag: function (event) {
            var i, item, itemElement, intersection,
                    o = this.options,
                    scrolled = false;

            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");

            if (!this.lastPositionAbs) {
                this.lastPositionAbs = this.positionAbs;
            }

            //Do scrolling
            if (this.options.scroll) {
                if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

                    if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
                    } else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
                    }

                    if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
                    } else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
                    }

                } else {

                    if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    } else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }

                    if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    } else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }

                }

                if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                    $.ui.ddmanager.prepareOffsets(this, event);
                }
            }

            //Regenerate the absolute position used for position checks
            this.positionAbs = this._convertPositionTo("absolute");

            //Set the helper position
            if (!this.options.axis || this.options.axis !== "y") {
                this.helper[0].style.left = this.position.left + "px";
            }
            if (!this.options.axis || this.options.axis !== "x") {
                this.helper[0].style.top = this.position.top + "px";
            }

            //Rearrange
            for (i = this.items.length - 1; i >= 0; i--) {

                //Cache variables and intersection, continue if no intersection
                item = this.items[i];
                itemElement = item.item[0];
                intersection = this._intersectsWithPointer(item);
                if (!intersection) {
                    continue;
                }

                // Only put the placeholder inside the current Container, skip all
                // items form other containers. This works because when moving
                // an item from one container to another the
                // currentContainer is switched before the placeholder is moved.
                //
                // Without this moving items in "sub-sortables" can cause the placeholder to jitter
                // beetween the outer and inner container.
                if (item.instance !== this.currentContainer) {
                    continue;
                }

                // cannot intersect with itself
                // no useless actions that have been done before
                // no action if the item moved is the parent of the item checked
                if (itemElement !== this.currentItem[0] &&
                        this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
                        !$.contains(this.placeholder[0], itemElement) &&
                        (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
                        ) {

                    this.direction = intersection === 1 ? "down" : "up";

                    if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
                        this._rearrange(event, item);
                    } else {
                        break;
                    }

                    this._trigger("change", event, this._uiHash());
                    break;
                }
            }

            //Post events to containers
            this._contactContainers(event);

            //Interconnect with droppables
            if ($.ui.ddmanager) {
                $.ui.ddmanager.drag(this, event);
            }

            //Call callbacks
            this._trigger("sort", event, this._uiHash());

            this.lastPositionAbs = this.positionAbs;
            return false;

        },
        _mouseStop: function (event, noPropagation) {

            if (!event) {
                return;
            }

            //If we are using droppables, inform the manager about the drop
            if ($.ui.ddmanager && !this.options.dropBehaviour) {
                $.ui.ddmanager.drop(this, event);
            }

            if (this.options.revert) {
                var that = this,
                        cur = this.placeholder.offset(),
                        axis = this.options.axis,
                        animation = {};

                if (!axis || axis === "x") {
                    animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
                }
                if (!axis || axis === "y") {
                    animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
                }
                this.reverting = true;
                $(this.helper).animate(animation, parseInt(this.options.revert, 10) || 500, function () {
                    that._clear(event);
                });
            } else {
                this._clear(event, noPropagation);
            }

            return false;

        },
        cancel: function () {

            if (this.dragging) {

                this._mouseUp({target: null});

                if (this.options.helper === "original") {
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
                } else {
                    this.currentItem.show();
                }

                //Post deactivating events to containers
                for (var i = this.containers.length - 1; i >= 0; i--) {
                    this.containers[i]._trigger("deactivate", null, this._uiHash(this));
                    if (this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", null, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            if (this.placeholder) {
                //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                if (this.placeholder[0].parentNode) {
                    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                }
                if (this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
                    this.helper.remove();
                }

                $.extend(this, {
                    helper: null,
                    dragging: false,
                    reverting: false,
                    _noFinalSort: null
                });

                if (this.domPosition.prev) {
                    $(this.domPosition.prev).after(this.currentItem);
                } else {
                    $(this.domPosition.parent).prepend(this.currentItem);
                }
            }

            return this;

        },
        serialize: function (o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                    str = [];
            o = o || {};

            $(items).each(function () {
                var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
                if (res) {
                    str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
                }
            });

            if (!str.length && o.key) {
                str.push(o.key + "=");
            }

            return str.join("&");

        },
        toArray: function (o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                    ret = [];

            o = o || {};

            items.each(function () {
                ret.push($(o.item || this).attr(o.attribute || "id") || "");
            });
            return ret;

        },
        /* Be careful with the following core functions */
        _intersectsWith: function (item) {

            var x1 = this.positionAbs.left,
                    x2 = x1 + this.helperProportions.width,
                    y1 = this.positionAbs.top,
                    y2 = y1 + this.helperProportions.height,
                    l = item.left,
                    r = l + item.width,
                    t = item.top,
                    b = t + item.height,
                    dyClick = this.offset.click.top,
                    dxClick = this.offset.click.left,
                    isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

            if (this.options.tolerance === "pointer" ||
                    this.options.forcePointerForContainers ||
                    (this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
                    ) {
                return isOverElement;
            } else {

                return (l < x1 + (this.helperProportions.width / 2) && // Right Half
                        x2 - (this.helperProportions.width / 2) < r && // Left Half
                        t < y1 + (this.helperProportions.height / 2) && // Bottom Half
                        y2 - (this.helperProportions.height / 2) < b); // Top Half

            }
        },
        _intersectsWithPointer: function (item) {

            var isOverElementHeight = (this.options.axis === "x") || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
                    isOverElementWidth = (this.options.axis === "y") || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
                    isOverElement = isOverElementHeight && isOverElementWidth,
                    verticalDirection = this._getDragVerticalDirection(),
                    horizontalDirection = this._getDragHorizontalDirection();

            if (!isOverElement) {
                return false;
            }

            return this.floating ?
                    (((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1)
                    : (verticalDirection && (verticalDirection === "down" ? 2 : 1));

        },
        _intersectsWithSides: function (item) {

            var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height / 2), item.height),
                    isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width / 2), item.width),
                    verticalDirection = this._getDragVerticalDirection(),
                    horizontalDirection = this._getDragHorizontalDirection();

            if (this.floating && horizontalDirection) {
                return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
            } else {
                return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
            }

        },
        _getDragVerticalDirection: function () {
            var delta = this.positionAbs.top - this.lastPositionAbs.top;
            return delta !== 0 && (delta > 0 ? "down" : "up");
        },
        _getDragHorizontalDirection: function () {
            var delta = this.positionAbs.left - this.lastPositionAbs.left;
            return delta !== 0 && (delta > 0 ? "right" : "left");
        },
        refresh: function (event) {
            this._refreshItems(event);
            this.refreshPositions();
            return this;
        },
        _connectWith: function () {
            var options = this.options;
            return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
        },
        _getItemsAsjQuery: function (connected) {

            var i, j, cur, inst,
                    items = [],
                    queries = [],
                    connectWith = this._connectWith();

            if (connectWith && connected) {
                for (i = connectWith.length - 1; i >= 0; i--) {
                    cur = $(connectWith[i]);
                    for (j = cur.length - 1; j >= 0; j--) {
                        inst = $.data(cur[j], this.widgetFullName);
                        if (inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
                        }
                    }
                }
            }

            queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, {options: this.options, item: this.currentItem}) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

            for (i = queries.length - 1; i >= 0; i--) {
                queries[i][0].each(function () {
                    items.push(this);
                });
            }

            return $(items);

        },
        _removeCurrentsFromItems: function () {

            var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

            this.items = $.grep(this.items, function (item) {
                for (var j = 0; j < list.length; j++) {
                    if (list[j] === item.item[0]) {
                        return false;
                    }
                }
                return true;
            });

        },
        _refreshItems: function (event) {

            this.items = [];
            this.containers = [this];

            var i, j, cur, inst, targetData, _queries, item, queriesLength,
                    items = this.items,
                    queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {item: this.currentItem}) : $(this.options.items, this.element), this]],
                    connectWith = this._connectWith();

            if (connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
                for (i = connectWith.length - 1; i >= 0; i--) {
                    cur = $(connectWith[i]);
                    for (j = cur.length - 1; j >= 0; j--) {
                        inst = $.data(cur[j], this.widgetFullName);
                        if (inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {item: this.currentItem}) : $(inst.options.items, inst.element), inst]);
                            this.containers.push(inst);
                        }
                    }
                }
            }

            for (i = queries.length - 1; i >= 0; i--) {
                targetData = queries[i][1];
                _queries = queries[i][0];

                for (j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
                    item = $(_queries[j]);

                    item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

                    items.push({
                        item: item,
                        instance: targetData,
                        width: 0, height: 0,
                        left: 0, top: 0
                    });
                }
            }

        },
        refreshPositions: function (fast) {

            //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
            if (this.offsetParent && this.helper) {
                this.offset.parent = this._getParentOffset();
            }

            var i, item, t, p;

            for (i = this.items.length - 1; i >= 0; i--) {
                item = this.items[i];

                //We ignore calculating positions of all connected containers when we're not over them
                if (item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
                    continue;
                }

                t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

                if (!fast) {
                    item.width = t.outerWidth();
                    item.height = t.outerHeight();
                }

                p = t.offset();
                item.left = p.left;
                item.top = p.top;
            }

            if (this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this);
            } else {
                for (i = this.containers.length - 1; i >= 0; i--) {
                    p = this.containers[i].element.offset();
                    this.containers[i].containerCache.left = p.left;
                    this.containers[i].containerCache.top = p.top;
                    this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
                    this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
                }
            }

            return this;
        },
        _createPlaceholder: function (that) {
            that = that || this;
            var className,
                    o = that.options;

            if (!o.placeholder || o.placeholder.constructor === String) {
                className = o.placeholder;
                o.placeholder = {
                    element: function () {

                        var nodeName = that.currentItem[0].nodeName.toLowerCase(),
                                element = $(that.document[0].createElement(nodeName))
                                .addClass(className || that.currentItem[0].className + " ui-sortable-placeholder")
                                .removeClass("ui-sortable-helper");

                        if (nodeName === "tr") {
                            // Use a high colspan to force the td to expand the full
                            // width of the table (browsers are smart enough to
                            // handle this properly)
                            element.append("<td colspan='99'>&#160;</td>");
                        } else if (nodeName === "img") {
                            element.attr("src", that.currentItem.attr("src"));
                        }

                        if (!className) {
                            element.css("visibility", "hidden");
                        }

                        return element;
                    },
                    update: function (container, p) {

                        // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                        // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                        if (className && !o.forcePlaceholderSize) {
                            return;
                        }

                        //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                        if (!p.height()) {
                            p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
                        }
                        if (!p.width()) {
                            p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
                        }
                    }
                };
            }

            //Create the placeholder
            that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

            //Append it after the actual current item
            that.currentItem.after(that.placeholder);

            //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
            o.placeholder.update(that, that.placeholder);

        },
        _contactContainers: function (event) {
            var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom, floating,
                    innermostContainer = null,
                    innermostIndex = null;

            // get innermost container that intersects with item
            for (i = this.containers.length - 1; i >= 0; i--) {

                // never consider a container that's located within the item itself
                if ($.contains(this.currentItem[0], this.containers[i].element[0])) {
                    continue;
                }

                if (this._intersectsWith(this.containers[i].containerCache)) {

                    // if we've already found a container and it's more "inner" than this, then continue
                    if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
                        continue;
                    }

                    innermostContainer = this.containers[i];
                    innermostIndex = i;

                } else {
                    // container doesn't intersect. trigger "out" event if necessary
                    if (this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", event, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            // if no intersecting containers found, return
            if (!innermostContainer) {
                return;
            }

            // move the item into the container if it's not there already
            if (this.containers.length === 1) {
                if (!this.containers[innermostIndex].containerCache.over) {
                    this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                    this.containers[innermostIndex].containerCache.over = 1;
                }
            } else {

                //When entering a new container, we will find the item with the least distance and append our item near it
                dist = 10000;
                itemWithLeastDistance = null;
                floating = innermostContainer.floating || isFloating(this.currentItem);
                posProperty = floating ? "left" : "top";
                sizeProperty = floating ? "width" : "height";
                base = this.positionAbs[posProperty] + this.offset.click[posProperty];
                for (j = this.items.length - 1; j >= 0; j--) {
                    if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
                        continue;
                    }
                    if (this.items[j].item[0] === this.currentItem[0]) {
                        continue;
                    }
                    if (floating && !isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height)) {
                        continue;
                    }
                    cur = this.items[j].item.offset()[posProperty];
                    nearBottom = false;
                    if (Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)) {
                        nearBottom = true;
                        cur += this.items[j][sizeProperty];
                    }

                    if (Math.abs(cur - base) < dist) {
                        dist = Math.abs(cur - base);
                        itemWithLeastDistance = this.items[j];
                        this.direction = nearBottom ? "up" : "down";
                    }
                }

                //Check if dropOnEmpty is enabled
                if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
                    return;
                }

                if (this.currentContainer === this.containers[innermostIndex]) {
                    return;
                }

                itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
                this._trigger("change", event, this._uiHash());
                this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
                this.currentContainer = this.containers[innermostIndex];

                //Update the placeholder
                this.options.placeholder.update(this.currentContainer, this.placeholder);

                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            }


        },
        _createHelper: function (event) {

            var o = this.options,
                    helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

            //Add the helper to the DOM if that didn't happen already
            if (!helper.parents("body").length) {
                $(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
            }

            if (helper[0] === this.currentItem[0]) {
                this._storedCSS = {width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left")};
            }

            if (!helper[0].style.width || o.forceHelperSize) {
                helper.width(this.currentItem.width());
            }
            if (!helper[0].style.height || o.forceHelperSize) {
                helper.height(this.currentItem.height());
            }

            return helper;

        },
        _adjustOffsetFromHelper: function (obj) {
            if (typeof obj === "string") {
                obj = obj.split(" ");
            }
            if ($.isArray(obj)) {
                obj = {left: +obj[0], top: +obj[1] || 0};
            }
            if ("left" in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ("right" in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ("top" in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ("bottom" in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },
        _getParentOffset: function () {


            //Get the offsetParent and cache its position
            this.offsetParent = this.helper.offsetParent();
            var po = this.offsetParent.offset();

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            // This needs to be actually done for all browsers, since pageX/pageY includes this information
            // with an ugly IE fix
            if (this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
                po = {top: 0, left: 0};
            }

            return {
                top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };

        },
        _getRelativeOffset: function () {

            if (this.cssPosition === "relative") {
                var p = this.currentItem.position();
                return {
                    top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return {top: 0, left: 0};
            }

        },
        _cacheMargins: function () {
            this.margins = {
                left: (parseInt(this.currentItem.css("marginLeft"), 10) || 0),
                top: (parseInt(this.currentItem.css("marginTop"), 10) || 0)
            };
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function () {

            var ce, co, over,
                    o = this.options;
            if (o.containment === "parent") {
                o.containment = this.helper[0].parentNode;
            }
            if (o.containment === "document" || o.containment === "window") {
                this.containment = [
                    0 - this.offset.relative.left - this.offset.parent.left,
                    0 - this.offset.relative.top - this.offset.parent.top,
                    $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
                    ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            }

            if (!(/^(document|window|parent)$/).test(o.containment)) {
                ce = $(o.containment)[0];
                co = $(o.containment).offset();
                over = ($(ce).css("overflow") !== "hidden");

                this.containment = [
                    co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left,
                    co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top,
                    co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left,
                    co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top
                ];
            }

        },
        _convertPositionTo: function (d, pos) {

            if (!pos) {
                pos = this.position;
            }
            var mod = d === "absolute" ? 1 : -1,
                    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                    scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            return {
                top: (
                        pos.top + // The absolute mouse position
                        this.offset.relative.top * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.top * mod - // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)
                        ),
                left: (
                        pos.left + // The absolute mouse position
                        this.offset.relative.left * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.left * mod - // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod)
                        )
            };

        },
        _generatePosition: function (event) {

            var top, left,
                    o = this.options,
                    pageX = event.pageX,
                    pageY = event.pageY,
                    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            // This is another very weird special case that only happens for relative elements:
            // 1. If the css position is relative
            // 2. and the scroll parent is the document or similar to the offset parent
            // we have to refresh the relative offset during the scroll so there are no jumps
            if (this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
                this.offset.relative = this._getRelativeOffset();
            }

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            if (this.originalPosition) { //If we are not dragging yet, we won't check for options

                if (this.containment) {
                    if (event.pageX - this.offset.click.left < this.containment[0]) {
                        pageX = this.containment[0] + this.offset.click.left;
                    }
                    if (event.pageY - this.offset.click.top < this.containment[1]) {
                        pageY = this.containment[1] + this.offset.click.top;
                    }
                    if (event.pageX - this.offset.click.left > this.containment[2]) {
                        pageX = this.containment[2] + this.offset.click.left;
                    }
                    if (event.pageY - this.offset.click.top > this.containment[3]) {
                        pageY = this.containment[3] + this.offset.click.top;
                    }
                }

                if (o.grid) {
                    top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
                    pageY = this.containment ? ((top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                    left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
                    pageX = this.containment ? ((left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
                }

            }

            return {
                top: (
                        pageY - // The absolute mouse position
                        this.offset.click.top - // Click offset (relative to the element)
                        this.offset.relative.top - // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.top + // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))
                        ),
                left: (
                        pageX - // The absolute mouse position
                        this.offset.click.left - // Click offset (relative to the element)
                        this.offset.relative.left - // Only for relative positioned nodes: Relative offset from element to offset parent
                        this.offset.parent.left + // The offsetParent's offset without borders (offset + border)
                        ((this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()))
                        )
            };

        },
        _rearrange: function (event, i, a, hardRefresh) {

            a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

            //Various things done here to improve the performance:
            // 1. we create a setTimeout, that calls refreshPositions
            // 2. on the instance, we have a counter variable, that get's higher after every append
            // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
            // 4. this lets only the last addition to the timeout stack through
            this.counter = this.counter ? ++this.counter : 1;
            var counter = this.counter;

            this._delay(function () {
                if (counter === this.counter) {
                    this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
                }
            });

        },
        _clear: function (event, noPropagation) {

            this.reverting = false;
            // We delay all events that have to be triggered to after the point where the placeholder has been removed and
            // everything else normalized again
            var i,
                    delayedTriggers = [];

            // We first have to update the dom position of the actual currentItem
            // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
            if (!this._noFinalSort && this.currentItem.parent().length) {
                this.placeholder.before(this.currentItem);
            }
            this._noFinalSort = null;

            if (this.helper[0] === this.currentItem[0]) {
                for (i in this._storedCSS) {
                    if (this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
                        this._storedCSS[i] = "";
                    }
                }
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
            } else {
                this.currentItem.show();
            }

            if (this.fromOutside && !noPropagation) {
                delayedTriggers.push(function (event) {
                    this._trigger("receive", event, this._uiHash(this.fromOutside));
                });
            }
            if ((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
                delayedTriggers.push(function (event) {
                    this._trigger("update", event, this._uiHash());
                }); //Trigger update callback if the DOM position has changed
            }

            // Check if the items Container has Changed and trigger appropriate
            // events.
            if (this !== this.currentContainer) {
                if (!noPropagation) {
                    delayedTriggers.push(function (event) {
                        this._trigger("remove", event, this._uiHash());
                    });
                    delayedTriggers.push((function (c) {
                        return function (event) {
                            c._trigger("receive", event, this._uiHash(this));
                        };
                    }).call(this, this.currentContainer));
                    delayedTriggers.push((function (c) {
                        return function (event) {
                            c._trigger("update", event, this._uiHash(this));
                        };
                    }).call(this, this.currentContainer));
                }
            }


            //Post events to containers
            for (i = this.containers.length - 1; i >= 0; i--) {
                if (!noPropagation) {
                    delayedTriggers.push((function (c) {
                        return function (event) {
                            c._trigger("deactivate", event, this._uiHash(this));
                        };
                    }).call(this, this.containers[i]));
                }
                if (this.containers[i].containerCache.over) {
                    delayedTriggers.push((function (c) {
                        return function (event) {
                            c._trigger("out", event, this._uiHash(this));
                        };
                    }).call(this, this.containers[i]));
                    this.containers[i].containerCache.over = 0;
                }
            }

            //Do what was originally in plugins
            if (this.storedCursor) {
                this.document.find("body").css("cursor", this.storedCursor);
                this.storedStylesheet.remove();
            }
            if (this._storedOpacity) {
                this.helper.css("opacity", this._storedOpacity);
            }
            if (this._storedZIndex) {
                this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
            }

            this.dragging = false;
            if (this.cancelHelperRemoval) {
                if (!noPropagation) {
                    this._trigger("beforeStop", event, this._uiHash());
                    for (i = 0; i < delayedTriggers.length; i++) {
                        delayedTriggers[i].call(this, event);
                    } //Trigger all delayed events
                    this._trigger("stop", event, this._uiHash());
                }

                this.fromOutside = false;
                return false;
            }

            if (!noPropagation) {
                this._trigger("beforeStop", event, this._uiHash());
            }

            //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

            if (this.helper[0] !== this.currentItem[0]) {
                this.helper.remove();
            }
            this.helper = null;

            if (!noPropagation) {
                for (i = 0; i < delayedTriggers.length; i++) {
                    delayedTriggers[i].call(this, event);
                } //Trigger all delayed events
                this._trigger("stop", event, this._uiHash());
            }

            this.fromOutside = false;
            return true;

        },
        _trigger: function () {
            if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
                this.cancel();
            }
        },
        _uiHash: function (_inst) {
            var inst = _inst || this;
            return {
                helper: inst.helper,
                placeholder: inst.placeholder || $([]),
                position: inst.position,
                originalPosition: inst.originalPosition,
                offset: inst.positionAbs,
                item: inst.currentItem,
                sender: _inst ? _inst.element : null
            };
        }

    });

})(jQuery);

(function ($, undefined) {

    var dataSpace = "ui-effects-";

    $.effects = {
        effect: {}
    };

    /*!
     * jQuery Color Animations v2.1.2
     * https://github.com/jquery/jquery-color
     *
     * Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * Date: Wed Jan 16 08:47:09 2013 -0600
     */
    (function (jQuery, undefined) {

        var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
                // plusequals test for += 100 -= 100
                rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
                // a set of RE's that can match strings and generate color tuples.
                stringParsers = [{
                        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        parse: function (execResult) {
                            return [
                                execResult[ 1 ],
                                execResult[ 2 ],
                                execResult[ 3 ],
                                execResult[ 4 ]
                            ];
                        }
                    }, {
                        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        parse: function (execResult) {
                            return [
                                execResult[ 1 ] * 2.55,
                                execResult[ 2 ] * 2.55,
                                execResult[ 3 ] * 2.55,
                                execResult[ 4 ]
                            ];
                        }
                    }, {
                        // this regex ignores A-F because it's compared against an already lowercased string
                        re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                        parse: function (execResult) {
                            return [
                                parseInt(execResult[ 1 ], 16),
                                parseInt(execResult[ 2 ], 16),
                                parseInt(execResult[ 3 ], 16)
                            ];
                        }
                    }, {
                        // this regex ignores A-F because it's compared against an already lowercased string
                        re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                        parse: function (execResult) {
                            return [
                                parseInt(execResult[ 1 ] + execResult[ 1 ], 16),
                                parseInt(execResult[ 2 ] + execResult[ 2 ], 16),
                                parseInt(execResult[ 3 ] + execResult[ 3 ], 16)
                            ];
                        }
                    }, {
                        re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                        space: "hsla",
                        parse: function (execResult) {
                            return [
                                execResult[ 1 ],
                                execResult[ 2 ] / 100,
                                execResult[ 3 ] / 100,
                                execResult[ 4 ]
                            ];
                        }
                    }],
                // jQuery.Color( )
                color = jQuery.Color = function (color, green, blue, alpha) {
                    return new jQuery.Color.fn.parse(color, green, blue, alpha);
                },
                spaces = {
                    rgba: {
                        props: {
                            red: {
                                idx: 0,
                                type: "byte"
                            },
                            green: {
                                idx: 1,
                                type: "byte"
                            },
                            blue: {
                                idx: 2,
                                type: "byte"
                            }
                        }
                    },
                    hsla: {
                        props: {
                            hue: {
                                idx: 0,
                                type: "degrees"
                            },
                            saturation: {
                                idx: 1,
                                type: "percent"
                            },
                            lightness: {
                                idx: 2,
                                type: "percent"
                            }
                        }
                    }
                },
        propTypes = {
            "byte": {
                floor: true,
                max: 255
            },
            "percent": {
                max: 1
            },
            "degrees": {
                mod: 360,
                floor: true
            }
        },
        support = color.support = {},
                // element for support tests
                supportElem = jQuery("<p>")[ 0 ],
                // colors = jQuery.Color.names
                colors,
                // local aliases of functions called often
                each = jQuery.each;

// determine rgba support immediately
        supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
        support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
        each(spaces, function (spaceName, space) {
            space.cache = "_" + spaceName;
            space.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            };
        });

        function clamp(value, prop, allowEmpty) {
            var type = propTypes[ prop.type ] || {};

            if (value == null) {
                return (allowEmpty || !prop.def) ? null : prop.def;
            }

            // ~~ is an short way of doing floor for positive numbers
            value = type.floor ? ~~value : parseFloat(value);

            // IE will pass in empty strings as value for alpha,
            // which will hit this case
            if (isNaN(value)) {
                return prop.def;
            }

            if (type.mod) {
                // we add mod before modding to make sure that negatives values
                // get converted properly: -10 -> 350
                return (value + type.mod) % type.mod;
            }

            // for now all property types without mod have min and max
            return 0 > value ? 0 : type.max < value ? type.max : value;
        }

        function stringParse(string) {
            var inst = color(),
                    rgba = inst._rgba = [];

            string = string.toLowerCase();

            each(stringParsers, function (i, parser) {
                var parsed,
                        match = parser.re.exec(string),
                        values = match && parser.parse(match),
                        spaceName = parser.space || "rgba";

                if (values) {
                    parsed = inst[ spaceName ](values);

                    // if this was an rgba parse the assignment might happen twice
                    // oh well....
                    inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
                    rgba = inst._rgba = parsed._rgba;

                    // exit each( stringParsers ) here because we matched
                    return false;
                }
            });

            // Found a stringParser that handled it
            if (rgba.length) {

                // if this came from a parsed string, force "transparent" when alpha is 0
                // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
                if (rgba.join() === "0,0,0,0") {
                    jQuery.extend(rgba, colors.transparent);
                }
                return inst;
            }

            // named colors
            return colors[ string ];
        }

        color.fn = jQuery.extend(color.prototype, {
            parse: function (red, green, blue, alpha) {
                if (red === undefined) {
                    this._rgba = [null, null, null, null];
                    return this;
                }
                if (red.jquery || red.nodeType) {
                    red = jQuery(red).css(green);
                    green = undefined;
                }

                var inst = this,
                        type = jQuery.type(red),
                        rgba = this._rgba = [];

                // more than 1 argument specified - assume ( red, green, blue, alpha )
                if (green !== undefined) {
                    red = [red, green, blue, alpha];
                    type = "array";
                }

                if (type === "string") {
                    return this.parse(stringParse(red) || colors._default);
                }

                if (type === "array") {
                    each(spaces.rgba.props, function (key, prop) {
                        rgba[ prop.idx ] = clamp(red[ prop.idx ], prop);
                    });
                    return this;
                }

                if (type === "object") {
                    if (red instanceof color) {
                        each(spaces, function (spaceName, space) {
                            if (red[ space.cache ]) {
                                inst[ space.cache ] = red[ space.cache ].slice();
                            }
                        });
                    } else {
                        each(spaces, function (spaceName, space) {
                            var cache = space.cache;
                            each(space.props, function (key, prop) {

                                // if the cache doesn't exist, and we know how to convert
                                if (!inst[ cache ] && space.to) {

                                    // if the value was null, we don't need to copy it
                                    // if the key was alpha, we don't need to copy it either
                                    if (key === "alpha" || red[ key ] == null) {
                                        return;
                                    }
                                    inst[ cache ] = space.to(inst._rgba);
                                }

                                // this is the only case where we allow nulls for ALL properties.
                                // call clamp with alwaysAllowEmpty
                                inst[ cache ][ prop.idx ] = clamp(red[ key ], prop, true);
                            });

                            // everything defined but alpha?
                            if (inst[ cache ] && jQuery.inArray(null, inst[ cache ].slice(0, 3)) < 0) {
                                // use the default of 1
                                inst[ cache ][ 3 ] = 1;
                                if (space.from) {
                                    inst._rgba = space.from(inst[ cache ]);
                                }
                            }
                        });
                    }
                    return this;
                }
            },
            is: function (compare) {
                var is = color(compare),
                        same = true,
                        inst = this;

                each(spaces, function (_, space) {
                    var localCache,
                            isCache = is[ space.cache ];
                    if (isCache) {
                        localCache = inst[ space.cache ] || space.to && space.to(inst._rgba) || [];
                        each(space.props, function (_, prop) {
                            if (isCache[ prop.idx ] != null) {
                                same = (isCache[ prop.idx ] === localCache[ prop.idx ]);
                                return same;
                            }
                        });
                    }
                    return same;
                });
                return same;
            },
            _space: function () {
                var used = [],
                        inst = this;
                each(spaces, function (spaceName, space) {
                    if (inst[ space.cache ]) {
                        used.push(spaceName);
                    }
                });
                return used.pop();
            },
            transition: function (other, distance) {
                var end = color(other),
                        spaceName = end._space(),
                        space = spaces[ spaceName ],
                        startColor = this.alpha() === 0 ? color("transparent") : this,
                        start = startColor[ space.cache ] || space.to(startColor._rgba),
                        result = start.slice();

                end = end[ space.cache ];
                each(space.props, function (key, prop) {
                    var index = prop.idx,
                            startValue = start[ index ],
                            endValue = end[ index ],
                            type = propTypes[ prop.type ] || {};

                    // if null, don't override start value
                    if (endValue === null) {
                        return;
                    }
                    // if null - use end
                    if (startValue === null) {
                        result[ index ] = endValue;
                    } else {
                        if (type.mod) {
                            if (endValue - startValue > type.mod / 2) {
                                startValue += type.mod;
                            } else if (startValue - endValue > type.mod / 2) {
                                startValue -= type.mod;
                            }
                        }
                        result[ index ] = clamp((endValue - startValue) * distance + startValue, prop);
                    }
                });
                return this[ spaceName ](result);
            },
            blend: function (opaque) {
                // if we are already opaque - return ourself
                if (this._rgba[ 3 ] === 1) {
                    return this;
                }

                var rgb = this._rgba.slice(),
                        a = rgb.pop(),
                        blend = color(opaque)._rgba;

                return color(jQuery.map(rgb, function (v, i) {
                    return (1 - a) * blend[ i ] + a * v;
                }));
            },
            toRgbaString: function () {
                var prefix = "rgba(",
                        rgba = jQuery.map(this._rgba, function (v, i) {
                            return v == null ? (i > 2 ? 1 : 0) : v;
                        });

                if (rgba[ 3 ] === 1) {
                    rgba.pop();
                    prefix = "rgb(";
                }

                return prefix + rgba.join() + ")";
            },
            toHslaString: function () {
                var prefix = "hsla(",
                        hsla = jQuery.map(this.hsla(), function (v, i) {
                            if (v == null) {
                                v = i > 2 ? 1 : 0;
                            }

                            // catch 1 and 2
                            if (i && i < 3) {
                                v = Math.round(v * 100) + "%";
                            }
                            return v;
                        });

                if (hsla[ 3 ] === 1) {
                    hsla.pop();
                    prefix = "hsl(";
                }
                return prefix + hsla.join() + ")";
            },
            toHexString: function (includeAlpha) {
                var rgba = this._rgba.slice(),
                        alpha = rgba.pop();

                if (includeAlpha) {
                    rgba.push(~~(alpha * 255));
                }

                return "#" + jQuery.map(rgba, function (v) {

                    // default to 0 when nulls exist
                    v = (v || 0).toString(16);
                    return v.length === 1 ? "0" + v : v;
                }).join("");
            },
            toString: function () {
                return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
            }
        });
        color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

        function hue2rgb(p, q, h) {
            h = (h + 1) % 1;
            if (h * 6 < 1) {
                return p + (q - p) * h * 6;
            }
            if (h * 2 < 1) {
                return q;
            }
            if (h * 3 < 2) {
                return p + (q - p) * ((2 / 3) - h) * 6;
            }
            return p;
        }

        spaces.hsla.to = function (rgba) {
            if (rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null) {
                return [null, null, null, rgba[ 3 ]];
            }
            var r = rgba[ 0 ] / 255,
                    g = rgba[ 1 ] / 255,
                    b = rgba[ 2 ] / 255,
                    a = rgba[ 3 ],
                    max = Math.max(r, g, b),
                    min = Math.min(r, g, b),
                    diff = max - min,
                    add = max + min,
                    l = add * 0.5,
                    h, s;

            if (min === max) {
                h = 0;
            } else if (r === max) {
                h = (60 * (g - b) / diff) + 360;
            } else if (g === max) {
                h = (60 * (b - r) / diff) + 120;
            } else {
                h = (60 * (r - g) / diff) + 240;
            }

            // chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
            // otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
            if (diff === 0) {
                s = 0;
            } else if (l <= 0.5) {
                s = diff / add;
            } else {
                s = diff / (2 - add);
            }
            return [Math.round(h) % 360, s, l, a == null ? 1 : a];
        };

        spaces.hsla.from = function (hsla) {
            if (hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null) {
                return [null, null, null, hsla[ 3 ]];
            }
            var h = hsla[ 0 ] / 360,
                    s = hsla[ 1 ],
                    l = hsla[ 2 ],
                    a = hsla[ 3 ],
                    q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                    p = 2 * l - q;

            return [
                Math.round(hue2rgb(p, q, h + (1 / 3)) * 255),
                Math.round(hue2rgb(p, q, h) * 255),
                Math.round(hue2rgb(p, q, h - (1 / 3)) * 255),
                a
            ];
        };


        each(spaces, function (spaceName, space) {
            var props = space.props,
                    cache = space.cache,
                    to = space.to,
                    from = space.from;

            // makes rgba() and hsla()
            color.fn[ spaceName ] = function (value) {

                // generate a cache for this space if it doesn't exist
                if (to && !this[ cache ]) {
                    this[ cache ] = to(this._rgba);
                }
                if (value === undefined) {
                    return this[ cache ].slice();
                }

                var ret,
                        type = jQuery.type(value),
                        arr = (type === "array" || type === "object") ? value : arguments,
                        local = this[ cache ].slice();

                each(props, function (key, prop) {
                    var val = arr[ type === "object" ? key : prop.idx ];
                    if (val == null) {
                        val = local[ prop.idx ];
                    }
                    local[ prop.idx ] = clamp(val, prop);
                });

                if (from) {
                    ret = color(from(local));
                    ret[ cache ] = local;
                    return ret;
                } else {
                    return color(local);
                }
            };

            // makes red() green() blue() alpha() hue() saturation() lightness()
            each(props, function (key, prop) {
                // alpha is included in more than one space
                if (color.fn[ key ]) {
                    return;
                }
                color.fn[ key ] = function (value) {
                    var vtype = jQuery.type(value),
                            fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName),
                            local = this[ fn ](),
                            cur = local[ prop.idx ],
                            match;

                    if (vtype === "undefined") {
                        return cur;
                    }

                    if (vtype === "function") {
                        value = value.call(this, cur);
                        vtype = jQuery.type(value);
                    }
                    if (value == null && prop.empty) {
                        return this;
                    }
                    if (vtype === "string") {
                        match = rplusequals.exec(value);
                        if (match) {
                            value = cur + parseFloat(match[ 2 ]) * (match[ 1 ] === "+" ? 1 : -1);
                        }
                    }
                    local[ prop.idx ] = value;
                    return this[ fn ](local);
                };
            });
        });

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
        color.hook = function (hook) {
            var hooks = hook.split(" ");
            each(hooks, function (i, hook) {
                jQuery.cssHooks[ hook ] = {
                    set: function (elem, value) {
                        var parsed, curElem,
                                backgroundColor = "";

                        if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
                            value = color(parsed || value);
                            if (!support.rgba && value._rgba[ 3 ] !== 1) {
                                curElem = hook === "backgroundColor" ? elem.parentNode : elem;
                                while (
                                        (backgroundColor === "" || backgroundColor === "transparent") &&
                                        curElem && curElem.style
                                        ) {
                                    try {
                                        backgroundColor = jQuery.css(curElem, "backgroundColor");
                                        curElem = curElem.parentNode;
                                    } catch (e) {
                                    }
                                }

                                value = value.blend(backgroundColor && backgroundColor !== "transparent" ?
                                        backgroundColor :
                                        "_default");
                            }

                            value = value.toRgbaString();
                        }
                        try {
                            elem.style[ hook ] = value;
                        } catch (e) {
                            // wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
                        }
                    }
                };
                jQuery.fx.step[ hook ] = function (fx) {
                    if (!fx.colorInit) {
                        fx.start = color(fx.elem, hook);
                        fx.end = color(fx.end);
                        fx.colorInit = true;
                    }
                    jQuery.cssHooks[ hook ].set(fx.elem, fx.start.transition(fx.end, fx.pos));
                };
            });

        };

        color.hook(stepHooks);

        jQuery.cssHooks.borderColor = {
            expand: function (value) {
                var expanded = {};

                each(["Top", "Right", "Bottom", "Left"], function (i, part) {
                    expanded[ "border" + part + "Color" ] = value;
                });
                return expanded;
            }
        };

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
        colors = jQuery.Color.names = {
            // 4.1. Basic color keywords
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            // 4.2.3. "transparent" color keyword
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        };

    })(jQuery);


    /******************************************************************************/
    /****************************** CLASS ANIMATIONS ******************************/
    /******************************************************************************/
    (function () {

        var classAnimationActions = ["add", "remove", "toggle"],
                shorthandStyles = {
                    border: 1,
                    borderBottom: 1,
                    borderColor: 1,
                    borderLeft: 1,
                    borderRight: 1,
                    borderTop: 1,
                    borderWidth: 1,
                    margin: 1,
                    padding: 1
                };

        $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (_, prop) {
            $.fx.step[ prop ] = function (fx) {
                if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
                    jQuery.style(fx.elem, prop, fx.end);
                    fx.setAttr = true;
                }
            };
        });

        function getElementStyles(elem) {
            var key, len,
                    style = elem.ownerDocument.defaultView ?
                    elem.ownerDocument.defaultView.getComputedStyle(elem, null) :
                    elem.currentStyle,
                    styles = {};

            if (style && style.length && style[ 0 ] && style[ style[ 0 ] ]) {
                len = style.length;
                while (len--) {
                    key = style[ len ];
                    if (typeof style[ key ] === "string") {
                        styles[ $.camelCase(key) ] = style[ key ];
                    }
                }
                // support: Opera, IE <9
            } else {
                for (key in style) {
                    if (typeof style[ key ] === "string") {
                        styles[ key ] = style[ key ];
                    }
                }
            }

            return styles;
        }


        function styleDifference(oldStyle, newStyle) {
            var diff = {},
                    name, value;

            for (name in newStyle) {
                value = newStyle[ name ];
                if (oldStyle[ name ] !== value) {
                    if (!shorthandStyles[ name ]) {
                        if ($.fx.step[ name ] || !isNaN(parseFloat(value))) {
                            diff[ name ] = value;
                        }
                    }
                }
            }

            return diff;
        }

// support: jQuery <1.8
        if (!$.fn.addBack) {
            $.fn.addBack = function (selector) {
                return this.add(selector == null ?
                        this.prevObject : this.prevObject.filter(selector)
                        );
            };
        }

        $.effects.animateClass = function (value, duration, easing, callback) {
            var o = $.speed(duration, easing, callback);

            return this.queue(function () {
                var animated = $(this),
                        baseClass = animated.attr("class") || "",
                        applyClassChange,
                        allAnimations = o.children ? animated.find("*").addBack() : animated;

                // map the animated objects to store the original styles.
                allAnimations = allAnimations.map(function () {
                    var el = $(this);
                    return {
                        el: el,
                        start: getElementStyles(this)
                    };
                });

                // apply class change
                applyClassChange = function () {
                    $.each(classAnimationActions, function (i, action) {
                        if (value[ action ]) {
                            animated[ action + "Class" ](value[ action ]);
                        }
                    });
                };
                applyClassChange();

                // map all animated objects again - calculate new styles and diff
                allAnimations = allAnimations.map(function () {
                    this.end = getElementStyles(this.el[ 0 ]);
                    this.diff = styleDifference(this.start, this.end);
                    return this;
                });

                // apply original class
                animated.attr("class", baseClass);

                // map all animated objects again - this time collecting a promise
                allAnimations = allAnimations.map(function () {
                    var styleInfo = this,
                            dfd = $.Deferred(),
                            opts = $.extend({}, o, {
                                queue: false,
                                complete: function () {
                                    dfd.resolve(styleInfo);
                                }
                            });

                    this.el.animate(this.diff, opts);
                    return dfd.promise();
                });

                // once all animations have completed:
                $.when.apply($, allAnimations.get()).done(function () {

                    // set the final class
                    applyClassChange();

                    // for each animated element,
                    // clear all css properties that were animated
                    $.each(arguments, function () {
                        var el = this.el;
                        $.each(this.diff, function (key) {
                            el.css(key, "");
                        });
                    });

                    // this is guarnteed to be there if you use jQuery.speed()
                    // it also handles dequeuing the next anim...
                    o.complete.call(animated[ 0 ]);
                });
            });
        };

        $.fn.extend({
            addClass: (function (orig) {
                return function (classNames, speed, easing, callback) {
                    return speed ?
                            $.effects.animateClass.call(this,
                                    {add: classNames}, speed, easing, callback) :
                            orig.apply(this, arguments);
                };
            })($.fn.addClass),
            removeClass: (function (orig) {
                return function (classNames, speed, easing, callback) {
                    return arguments.length > 1 ?
                            $.effects.animateClass.call(this,
                                    {remove: classNames}, speed, easing, callback) :
                            orig.apply(this, arguments);
                };
            })($.fn.removeClass),
            toggleClass: (function (orig) {
                return function (classNames, force, speed, easing, callback) {
                    if (typeof force === "boolean" || force === undefined) {
                        if (!speed) {
                            // without speed parameter
                            return orig.apply(this, arguments);
                        } else {
                            return $.effects.animateClass.call(this,
                                    (force ? {add: classNames} : {remove: classNames}),
                                    speed, easing, callback);
                        }
                    } else {
                        // without force parameter
                        return $.effects.animateClass.call(this,
                                {toggle: classNames}, force, speed, easing);
                    }
                };
            })($.fn.toggleClass),
            switchClass: function (remove, add, speed, easing, callback) {
                return $.effects.animateClass.call(this, {
                    add: add,
                    remove: remove
                }, speed, easing, callback);
            }
        });

    })();

    /******************************************************************************/
    /*********************************** EFFECTS **********************************/
    /******************************************************************************/

    (function () {

        $.extend($.effects, {
            version: "1.10.2",
            // Saves a set of properties in a data storage
            save: function (element, set) {
                for (var i = 0; i < set.length; i++) {
                    if (set[ i ] !== null) {
                        element.data(dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ]);
                    }
                }
            },
            // Restores a set of previously saved properties from a data storage
            restore: function (element, set) {
                var val, i;
                for (i = 0; i < set.length; i++) {
                    if (set[ i ] !== null) {
                        val = element.data(dataSpace + set[ i ]);
                        // support: jQuery 1.6.2
                        // http://bugs.jquery.com/ticket/9917
                        // jQuery 1.6.2 incorrectly returns undefined for any falsy value.
                        // We can't differentiate between "" and 0 here, so we just assume
                        // empty string since it's likely to be a more common value...
                        if (val === undefined) {
                            val = "";
                        }
                        element.css(set[ i ], val);
                    }
                }
            },
            setMode: function (el, mode) {
                if (mode === "toggle") {
                    mode = el.is(":hidden") ? "show" : "hide";
                }
                return mode;
            },
            // Translates a [top,left] array into a baseline value
            // this should be a little more flexible in the future to handle a string & hash
            getBaseline: function (origin, original) {
                var y, x;
                switch (origin[ 0 ]) {
                    case "top":
                        y = 0;
                        break;
                    case "middle":
                        y = 0.5;
                        break;
                    case "bottom":
                        y = 1;
                        break;
                    default:
                        y = origin[ 0 ] / original.height;
                }
                switch (origin[ 1 ]) {
                    case "left":
                        x = 0;
                        break;
                    case "center":
                        x = 0.5;
                        break;
                    case "right":
                        x = 1;
                        break;
                    default:
                        x = origin[ 1 ] / original.width;
                }
                return {
                    x: x,
                    y: y
                };
            },
            // Wraps the element around a wrapper that copies position properties
            createWrapper: function (element) {

                // if the element is already wrapped, return it
                if (element.parent().is(".ui-effects-wrapper")) {
                    return element.parent();
                }

                // wrap the element
                var props = {
                    width: element.outerWidth(true),
                    height: element.outerHeight(true),
                    "float": element.css("float")
                },
                wrapper = $("<div></div>")
                        .addClass("ui-effects-wrapper")
                        .css({
                            fontSize: "100%",
                            background: "transparent",
                            border: "none",
                            margin: 0,
                            padding: 0
                        }),
                        // Store the size in case width/height are defined in % - Fixes #5245
                        size = {
                            width: element.width(),
                            height: element.height()
                        },
                active = document.activeElement;

                // support: Firefox
                // Firefox incorrectly exposes anonymous content
                // https://bugzilla.mozilla.org/show_bug.cgi?id=561664
                try {
                    active.id;
                } catch (e) {
                    active = document.body;
                }

                element.wrap(wrapper);

                // Fixes #7595 - Elements lose focus when wrapped.
                if (element[ 0 ] === active || $.contains(element[ 0 ], active)) {
                    $(active).focus();
                }

                wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually lose the reference to the wrapped element

                // transfer positioning properties to the wrapper
                if (element.css("position") === "static") {
                    wrapper.css({position: "relative"});
                    element.css({position: "relative"});
                } else {
                    $.extend(props, {
                        position: element.css("position"),
                        zIndex: element.css("z-index")
                    });
                    $.each(["top", "left", "bottom", "right"], function (i, pos) {
                        props[ pos ] = element.css(pos);
                        if (isNaN(parseInt(props[ pos ], 10))) {
                            props[ pos ] = "auto";
                        }
                    });
                    element.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    });
                }
                element.css(size);

                return wrapper.css(props).show();
            },
            removeWrapper: function (element) {
                var active = document.activeElement;

                if (element.parent().is(".ui-effects-wrapper")) {
                    element.parent().replaceWith(element);

                    // Fixes #7595 - Elements lose focus when wrapped.
                    if (element[ 0 ] === active || $.contains(element[ 0 ], active)) {
                        $(active).focus();
                    }
                }


                return element;
            },
            setTransition: function (element, list, factor, value) {
                value = value || {};
                $.each(list, function (i, x) {
                    var unit = element.cssUnit(x);
                    if (unit[ 0 ] > 0) {
                        value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
                    }
                });
                return value;
            }
        });

// return an effect options object for the given parameters:
        function _normalizeArguments(effect, options, speed, callback) {

            // allow passing all options as the first parameter
            if ($.isPlainObject(effect)) {
                options = effect;
                effect = effect.effect;
            }

            // convert to an object
            effect = {effect: effect};

            // catch (effect, null, ...)
            if (options == null) {
                options = {};
            }

            // catch (effect, callback)
            if ($.isFunction(options)) {
                callback = options;
                speed = null;
                options = {};
            }

            // catch (effect, speed, ?)
            if (typeof options === "number" || $.fx.speeds[ options ]) {
                callback = speed;
                speed = options;
                options = {};
            }

            // catch (effect, options, callback)
            if ($.isFunction(speed)) {
                callback = speed;
                speed = null;
            }

            // add options to effect
            if (options) {
                $.extend(effect, options);
            }

            speed = speed || options.duration;
            effect.duration = $.fx.off ? 0 :
                    typeof speed === "number" ? speed :
                    speed in $.fx.speeds ? $.fx.speeds[ speed ] :
                    $.fx.speeds._default;

            effect.complete = callback || options.complete;

            return effect;
        }

        function standardAnimationOption(option) {
            // Valid standard speeds (nothing, number, named speed)
            if (!option || typeof option === "number" || $.fx.speeds[ option ]) {
                return true;
            }

            // Invalid strings - treat as "normal" speed
            if (typeof option === "string" && !$.effects.effect[ option ]) {
                return true;
            }

            // Complete callback
            if ($.isFunction(option)) {
                return true;
            }

            // Options hash (but not naming an effect)
            if (typeof option === "object" && !option.effect) {
                return true;
            }

            // Didn't match any standard API
            return false;
        }

        $.fn.extend({
            effect: function ( /* effect, options, speed, callback */ ) {
                var args = _normalizeArguments.apply(this, arguments),
                        mode = args.mode,
                        queue = args.queue,
                        effectMethod = $.effects.effect[ args.effect ];

                if ($.fx.off || !effectMethod) {
                    // delegate to the original method (e.g., .show()) if possible
                    if (mode) {
                        return this[ mode ](args.duration, args.complete);
                    } else {
                        return this.each(function () {
                            if (args.complete) {
                                args.complete.call(this);
                            }
                        });
                    }
                }

                function run(next) {
                    var elem = $(this),
                            complete = args.complete,
                            mode = args.mode;

                    function done() {
                        if ($.isFunction(complete)) {
                            complete.call(elem[0]);
                        }
                        if ($.isFunction(next)) {
                            next();
                        }
                    }

                    // If the element already has the correct final state, delegate to
                    // the core methods so the internal tracking of "olddisplay" works.
                    if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
                        elem[ mode ]();
                        done();
                    } else {
                        effectMethod.call(elem[0], args, done);
                    }
                }

                return queue === false ? this.each(run) : this.queue(queue || "fx", run);
            },
            show: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "show";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.show),
            hide: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "hide";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.hide),
            toggle: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option) || typeof option === "boolean") {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "toggle";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.toggle),
            // helper functions
            cssUnit: function (key) {
                var style = this.css(key),
                        val = [];

                $.each(["em", "px", "%", "pt"], function (i, unit) {
                    if (style.indexOf(unit) > 0) {
                        val = [parseFloat(style), unit];
                    }
                });
                return val;
            }
        });

    })();

    /******************************************************************************/
    /*********************************** EASING ***********************************/
    /******************************************************************************/

    (function () {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

        var baseEasings = {};

        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, name) {
            baseEasings[ name ] = function (p) {
                return Math.pow(p, i + 2);
            };
        });

        $.extend(baseEasings, {
            Sine: function (p) {
                return 1 - Math.cos(p * Math.PI / 2);
            },
            Circ: function (p) {
                return 1 - Math.sqrt(1 - p * p);
            },
            Elastic: function (p) {
                return p === 0 || p === 1 ? p :
                        -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
            },
            Back: function (p) {
                return p * p * (3 * p - 2);
            },
            Bounce: function (p) {
                var pow2,
                        bounce = 4;

                while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {
                }
                return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
            }
        });

        $.each(baseEasings, function (name, easeIn) {
            $.easing[ "easeIn" + name ] = easeIn;
            $.easing[ "easeOut" + name ] = function (p) {
                return 1 - easeIn(1 - p);
            };
            $.easing[ "easeInOut" + name ] = function (p) {
                return p < 0.5 ?
                        easeIn(p * 2) / 2 :
                        1 - easeIn(p * -2 + 2) / 2;
            };
        });

    })();

})(jQuery);

(function ($, undefined) {

    var uid = 0,
            hideProps = {},
            showProps = {};

    hideProps.height = hideProps.paddingTop = hideProps.paddingBottom =
            hideProps.borderTopWidth = hideProps.borderBottomWidth = "hide";
    showProps.height = showProps.paddingTop = showProps.paddingBottom =
            showProps.borderTopWidth = showProps.borderBottomWidth = "show";

    $.widget("ui.accordion", {
        version: "1.10.2",
        options: {
            active: 0,
            animate: {},
            collapsible: false,
            event: "click",
            header: "> li > :first-child,> :not(li):even",
            heightStyle: "auto",
            icons: {
                activeHeader: "ui-icon-triangle-1-s",
                header: "ui-icon-triangle-1-e"
            },
            // callbacks
            activate: null,
            beforeActivate: null
        },
        _create: function () {
            var options = this.options;
            this.prevShow = this.prevHide = $();
            this.element.addClass("ui-accordion ui-widget ui-helper-reset")
                    // ARIA
                    .attr("role", "tablist");

            // don't allow collapsible: false and active: false / null
            if (!options.collapsible && (options.active === false || options.active == null)) {
                options.active = 0;
            }

            this._processPanels();
            // handle negative values
            if (options.active < 0) {
                options.active += this.headers.length;
            }
            this._refresh();
        },
        _getCreateEventData: function () {
            return {
                header: this.active,
                panel: !this.active.length ? $() : this.active.next(),
                content: !this.active.length ? $() : this.active.next()
            };
        },
        _createIcons: function () {
            var icons = this.options.icons;
            if (icons) {
                $("<span>")
                        .addClass("ui-accordion-header-icon ui-icon " + icons.header)
                        .prependTo(this.headers);
                this.active.children(".ui-accordion-header-icon")
                        .removeClass(icons.header)
                        .addClass(icons.activeHeader);
                this.headers.addClass("ui-accordion-icons");
            }
        },
        _destroyIcons: function () {
            this.headers
                    .removeClass("ui-accordion-icons")
                    .children(".ui-accordion-header-icon")
                    .remove();
        },
        _destroy: function () {
            var contents;

            // clean up main element
            this.element
                    .removeClass("ui-accordion ui-widget ui-helper-reset")
                    .removeAttr("role");

            // clean up headers
            this.headers
                    .removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top")
                    .removeAttr("role")
                    .removeAttr("aria-selected")
                    .removeAttr("aria-controls")
                    .removeAttr("tabIndex")
                    .each(function () {
                        if (/^ui-accordion/.test(this.id)) {
                            this.removeAttribute("id");
                        }
                    });
            this._destroyIcons();

            // clean up content panels
            contents = this.headers.next()
                    .css("display", "")
                    .removeAttr("role")
                    .removeAttr("aria-expanded")
                    .removeAttr("aria-hidden")
                    .removeAttr("aria-labelledby")
                    .removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled")
                    .each(function () {
                        if (/^ui-accordion/.test(this.id)) {
                            this.removeAttribute("id");
                        }
                    });
            if (this.options.heightStyle !== "content") {
                contents.css("height", "");
            }
        },
        _setOption: function (key, value) {
            if (key === "active") {
                // _activate() will handle invalid values and update this.options
                this._activate(value);
                return;
            }

            if (key === "event") {
                if (this.options.event) {
                    this._off(this.headers, this.options.event);
                }
                this._setupEvents(value);
            }

            this._super(key, value);

            // setting collapsible: false while collapsed; open first panel
            if (key === "collapsible" && !value && this.options.active === false) {
                this._activate(0);
            }

            if (key === "icons") {
                this._destroyIcons();
                if (value) {
                    this._createIcons();
                }
            }

            // #5332 - opacity doesn't cascade to positioned elements in IE
            // so we need to add the disabled class to the headers and panels
            if (key === "disabled") {
                this.headers.add(this.headers.next())
                        .toggleClass("ui-state-disabled", !!value);
            }
        },
        _keydown: function (event) {
            /*jshint maxcomplexity:15*/
            if (event.altKey || event.ctrlKey) {
                return;
            }

            var keyCode = $.ui.keyCode,
                    length = this.headers.length,
                    currentIndex = this.headers.index(event.target),
                    toFocus = false;

            switch (event.keyCode) {
                case keyCode.RIGHT:
                case keyCode.DOWN:
                    toFocus = this.headers[ (currentIndex + 1) % length ];
                    break;
                case keyCode.LEFT:
                case keyCode.UP:
                    toFocus = this.headers[ (currentIndex - 1 + length) % length ];
                    break;
                case keyCode.SPACE:
                case keyCode.ENTER:
                    this._eventHandler(event);
                    break;
                case keyCode.HOME:
                    toFocus = this.headers[ 0 ];
                    break;
                case keyCode.END:
                    toFocus = this.headers[ length - 1 ];
                    break;
            }

            if (toFocus) {
                $(event.target).attr("tabIndex", -1);
                $(toFocus).attr("tabIndex", 0);
                toFocus.focus();
                event.preventDefault();
            }
        },
        _panelKeyDown: function (event) {
            if (event.keyCode === $.ui.keyCode.UP && event.ctrlKey) {
                $(event.currentTarget).prev().focus();
            }
        },
        refresh: function () {
            var options = this.options;
            this._processPanels();

            // was collapsed or no panel
            if ((options.active === false && options.collapsible === true) || !this.headers.length) {
                options.active = false;
                this.active = $();
                // active false only when collapsible is true
            }
            if (options.active === false) {
                this._activate(0);
                // was active, but active panel is gone
            } else if (this.active.length && !$.contains(this.element[ 0 ], this.active[ 0 ])) {
                // all remaining panel are disabled
                if (this.headers.length === this.headers.find(".ui-state-disabled").length) {
                    options.active = false;
                    this.active = $();
                    // activate previous panel
                } else {
                    this._activate(Math.max(0, options.active - 1));
                }
                // was active, active panel still exists
            } else {
                // make sure active index is correct
                options.active = this.headers.index(this.active);
            }

            this._destroyIcons();

            this._refresh();
        },
        _processPanels: function () {
            this.headers = this.element.find(this.options.header)
                    .addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all");

            this.headers.next()
                    .addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom")
                    .filter(":not(.ui-accordion-content-active)")
                    .hide();
        },
        _refresh: function () {
            var maxHeight,
                    options = this.options,
                    heightStyle = options.heightStyle,
                    parent = this.element.parent(),
                    accordionId = this.accordionId = "ui-accordion-" +
                    (this.element.attr("id") || ++uid);

            this.active = this._findActive(options.active)
                    .addClass("ui-accordion-header-active ui-state-active ui-corner-top")
                    .removeClass("ui-corner-all");
            this.active.next()
                    .addClass("ui-accordion-content-active")
                    .show();

            this.headers
                    .attr("role", "tab")
                    .each(function (i) {
                        var header = $(this),
                                headerId = header.attr("id"),
                                panel = header.next(),
                                panelId = panel.attr("id");
                        if (!headerId) {
                            headerId = accordionId + "-header-" + i;
                            header.attr("id", headerId);
                        }
                        if (!panelId) {
                            panelId = accordionId + "-panel-" + i;
                            panel.attr("id", panelId);
                        }
                        header.attr("aria-controls", panelId);
                        panel.attr("aria-labelledby", headerId);
                    })
                    .next()
                    .attr("role", "tabpanel");

            this.headers
                    .not(this.active)
                    .attr({
                        "aria-selected": "false",
                        tabIndex: -1
                    })
                    .next()
                    .attr({
                        "aria-expanded": "false",
                        "aria-hidden": "true"
                    })
                    .hide();

            // make sure at least one header is in the tab order
            if (!this.active.length) {
                this.headers.eq(0).attr("tabIndex", 0);
            } else {
                this.active.attr({
                    "aria-selected": "true",
                    tabIndex: 0
                })
                        .next()
                        .attr({
                            "aria-expanded": "true",
                            "aria-hidden": "false"
                        });
            }

            this._createIcons();

            this._setupEvents(options.event);

            if (heightStyle === "fill") {
                maxHeight = parent.height();
                this.element.siblings(":visible").each(function () {
                    var elem = $(this),
                            position = elem.css("position");

                    if (position === "absolute" || position === "fixed") {
                        return;
                    }
                    maxHeight -= elem.outerHeight(true);
                });

                this.headers.each(function () {
                    maxHeight -= $(this).outerHeight(true);
                });

                this.headers.next()
                        .each(function () {
                            $(this).height(Math.max(0, maxHeight -
                                    $(this).innerHeight() + $(this).height()));
                        })
                        .css("overflow", "auto");
            } else if (heightStyle === "auto") {
                maxHeight = 0;
                this.headers.next()
                        .each(function () {
                            maxHeight = Math.max(maxHeight, $(this).css("height", "").height());
                        })
                        .height(maxHeight);
            }
        },
        _activate: function (index) {
            var active = this._findActive(index)[ 0 ];

            // trying to activate the already active panel
            if (active === this.active[ 0 ]) {
                return;
            }

            // trying to collapse, simulate a click on the currently active header
            active = active || this.active[ 0 ];

            this._eventHandler({
                target: active,
                currentTarget: active,
                preventDefault: $.noop
            });
        },
        _findActive: function (selector) {
            return typeof selector === "number" ? this.headers.eq(selector) : $();
        },
        _setupEvents: function (event) {
            var events = {
                keydown: "_keydown"
            };
            if (event) {
                $.each(event.split(" "), function (index, eventName) {
                    events[ eventName ] = "_eventHandler";
                });
            }

            this._off(this.headers.add(this.headers.next()));
            this._on(this.headers, events);
            this._on(this.headers.next(), {keydown: "_panelKeyDown"});
            this._hoverable(this.headers);
            this._focusable(this.headers);
        },
        _eventHandler: function (event) {
            var options = this.options,
                    active = this.active,
                    clicked = $(event.currentTarget),
                    clickedIsActive = clicked[ 0 ] === active[ 0 ],
                    collapsing = clickedIsActive && options.collapsible,
                    toShow = collapsing ? $() : clicked.next(),
                    toHide = active.next(),
                    eventData = {
                        oldHeader: active,
                        oldPanel: toHide,
                        newHeader: collapsing ? $() : clicked,
                        newPanel: toShow
                    };

            event.preventDefault();

            if (
                    // click on active header, but not collapsible
                            (clickedIsActive && !options.collapsible) ||
                            // allow canceling activation
                                    (this._trigger("beforeActivate", event, eventData) === false)) {
                        return;
                    }

                    options.active = collapsing ? false : this.headers.index(clicked);

                    // when the call to ._toggle() comes after the class changes
                    // it causes a very odd bug in IE 8 (see #6720)
                    this.active = clickedIsActive ? $() : clicked;
                    this._toggle(eventData);

                    // switch classes
                    // corner classes on the previously active header stay after the animation
                    active.removeClass("ui-accordion-header-active ui-state-active");
                    if (options.icons) {
                        active.children(".ui-accordion-header-icon")
                                .removeClass(options.icons.activeHeader)
                                .addClass(options.icons.header);
                    }

                    if (!clickedIsActive) {
                        clicked
                                .removeClass("ui-corner-all")
                                .addClass("ui-accordion-header-active ui-state-active ui-corner-top");
                        if (options.icons) {
                            clicked.children(".ui-accordion-header-icon")
                                    .removeClass(options.icons.header)
                                    .addClass(options.icons.activeHeader);
                        }

                        clicked
                                .next()
                                .addClass("ui-accordion-content-active");
                    }
                },
                _toggle: function (data) {
                    var toShow = data.newPanel,
                            toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

                    // handle activating a panel during the animation for another activation
                    this.prevShow.add(this.prevHide).stop(true, true);
                    this.prevShow = toShow;
                    this.prevHide = toHide;

                    if (this.options.animate) {
                        this._animate(toShow, toHide, data);
                    } else {
                        toHide.hide();
                        toShow.show();
                        this._toggleComplete(data);
                    }

                    toHide.attr({
                        "aria-expanded": "false",
                        "aria-hidden": "true"
                    });
                    toHide.prev().attr("aria-selected", "false");
                    // if we're switching panels, remove the old header from the tab order
                    // if we're opening from collapsed state, remove the previous header from the tab order
                    // if we're collapsing, then keep the collapsing header in the tab order
                    if (toShow.length && toHide.length) {
                        toHide.prev().attr("tabIndex", -1);
                    } else if (toShow.length) {
                        this.headers.filter(function () {
                            return $(this).attr("tabIndex") === 0;
                        })
                                .attr("tabIndex", -1);
                    }

                    toShow
                            .attr({
                                "aria-expanded": "true",
                                "aria-hidden": "false"
                            })
                            .prev()
                            .attr({
                                "aria-selected": "true",
                                tabIndex: 0
                            });
                },
                _animate: function (toShow, toHide, data) {
                    var total, easing, duration,
                            that = this,
                            adjust = 0,
                            down = toShow.length &&
                            (!toHide.length || (toShow.index() < toHide.index())),
                            animate = this.options.animate || {},
                            options = down && animate.down || animate,
                            complete = function () {
                                that._toggleComplete(data);
                            };

                    if (typeof options === "number") {
                        duration = options;
                    }
                    if (typeof options === "string") {
                        easing = options;
                    }
                    // fall back from options to animation in case of partial down settings
                    easing = easing || options.easing || animate.easing;
                    duration = duration || options.duration || animate.duration;

                    if (!toHide.length) {
                        return toShow.animate(showProps, duration, easing, complete);
                    }
                    if (!toShow.length) {
                        return toHide.animate(hideProps, duration, easing, complete);
                    }

                    total = toShow.show().outerHeight();
                    toHide.animate(hideProps, {
                        duration: duration,
                        easing: easing,
                        step: function (now, fx) {
                            fx.now = Math.round(now);
                        }
                    });
                    toShow
                            .hide()
                            .animate(showProps, {
                                duration: duration,
                                easing: easing,
                                complete: complete,
                                step: function (now, fx) {
                                    fx.now = Math.round(now);
                                    if (fx.prop !== "height") {
                                        adjust += fx.now;
                                    } else if (that.options.heightStyle !== "content") {
                                        fx.now = Math.round(total - toHide.outerHeight() - adjust);
                                        adjust = 0;
                                    }
                                }
                            });
                },
                _toggleComplete: function (data) {
                    var toHide = data.oldPanel;

                    toHide
                            .removeClass("ui-accordion-content-active")
                            .prev()
                            .removeClass("ui-corner-top")
                            .addClass("ui-corner-all");

                    // Work around for rendering bug in IE (#5421)
                    if (toHide.length) {
                        toHide.parent()[0].className = toHide.parent()[0].className;
                    }

                    this._trigger("activate", null, data);
                }
            });

})(jQuery);

(function ($, undefined) {

// used to prevent race conditions with remote data sources
    var requestIndex = 0;

    $.widget("ui.autocomplete", {
        version: "1.10.2",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: false,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            // callbacks
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function () {
            // Some browsers only repeat keydown events, not keypress events,
            // so we use the suppressKeyPress flag to determine if we've already
            // handled the keydown event. #7269
            // Unfortunately the code for & in keypress is the same as the up arrow,
            // so we use the suppressKeyPressRepeat flag to avoid handling keypress
            // events when we know the keydown event was used to modify the
            // search term. #7799
            var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
                    nodeName = this.element[0].nodeName.toLowerCase(),
                    isTextarea = nodeName === "textarea",
                    isInput = nodeName === "input";

            this.isMultiLine =
                    // Textareas are always multi-line
                    isTextarea ? true :
                    // Inputs are always single-line, even if inside a contentEditable element
                    // IE also treats inputs as contentEditable
                    isInput ? false :
                    // All other element types are determined by whether or not they're contentEditable
                    this.element.prop("isContentEditable");

            this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
            this.isNewMenu = true;

            this.element
                    .addClass("ui-autocomplete-input")
                    .attr("autocomplete", "off");

            this._on(this.element, {
                keydown: function (event) {
                    /*jshint maxcomplexity:15*/
                    if (this.element.prop("readOnly")) {
                        suppressKeyPress = true;
                        suppressInput = true;
                        suppressKeyPressRepeat = true;
                        return;
                    }

                    suppressKeyPress = false;
                    suppressInput = false;
                    suppressKeyPressRepeat = false;
                    var keyCode = $.ui.keyCode;
                    switch (event.keyCode) {
                        case keyCode.PAGE_UP:
                            suppressKeyPress = true;
                            this._move("previousPage", event);
                            break;
                        case keyCode.PAGE_DOWN:
                            suppressKeyPress = true;
                            this._move("nextPage", event);
                            break;
                        case keyCode.UP:
                            suppressKeyPress = true;
                            this._keyEvent("previous", event);
                            break;
                        case keyCode.DOWN:
                            suppressKeyPress = true;
                            this._keyEvent("next", event);
                            break;
                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            // when menu is open and has focus
                            if (this.menu.active) {
                                // #6055 - Opera still allows the keypress to occur
                                // which causes forms to submit
                                suppressKeyPress = true;
                                event.preventDefault();
                                this.menu.select(event);
                            }
                            break;
                        case keyCode.TAB:
                            if (this.menu.active) {
                                this.menu.select(event);
                            }
                            break;
                        case keyCode.ESCAPE:
                            if (this.menu.element.is(":visible")) {
                                this._value(this.term);
                                this.close(event);
                                // Different browsers have different default behavior for escape
                                // Single press can mean undo or clear
                                // Double press in IE means clear the whole form
                                event.preventDefault();
                            }
                            break;
                        default:
                            suppressKeyPressRepeat = true;
                            // search timeout should be triggered before the input value is changed
                            this._searchTimeout(event);
                            break;
                    }
                },
                keypress: function (event) {
                    if (suppressKeyPress) {
                        suppressKeyPress = false;
                        event.preventDefault();
                        return;
                    }
                    if (suppressKeyPressRepeat) {
                        return;
                    }

                    // replicate some key handlers to allow them to repeat in Firefox and Opera
                    var keyCode = $.ui.keyCode;
                    switch (event.keyCode) {
                        case keyCode.PAGE_UP:
                            this._move("previousPage", event);
                            break;
                        case keyCode.PAGE_DOWN:
                            this._move("nextPage", event);
                            break;
                        case keyCode.UP:
                            this._keyEvent("previous", event);
                            break;
                        case keyCode.DOWN:
                            this._keyEvent("next", event);
                            break;
                    }
                },
                input: function (event) {
                    if (suppressInput) {
                        suppressInput = false;
                        event.preventDefault();
                        return;
                    }
                    this._searchTimeout(event);
                },
                focus: function () {
                    this.selectedItem = null;
                    this.previous = this._value();
                },
                blur: function (event) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return;
                    }

                    clearTimeout(this.searching);
                    this.close(event);
                    this._change(event);
                }
            });

            this._initSource();
            this.menu = $("<ul>")
                    .addClass("ui-autocomplete ui-front")
                    .appendTo(this._appendTo())
                    .menu({
                        // custom key handling for now
                        input: $(),
                        // disable ARIA support, the live region takes care of that
                        role: null
                    })
                    .hide()
                    .data("ui-menu");

            this._on(this.menu.element, {
                mousedown: function (event) {
                    // prevent moving focus out of the text field
                    event.preventDefault();

                    // IE doesn't prevent moving focus even with event.preventDefault()
                    // so we set a flag to know when we should ignore the blur event
                    this.cancelBlur = true;
                    this._delay(function () {
                        delete this.cancelBlur;
                    });

                    // clicking on the scrollbar causes focus to shift to the body
                    // but we can't detect a mouseup or a click immediately afterward
                    // so we have to track the next mousedown and close the menu if
                    // the user clicks somewhere outside of the autocomplete
                    var menuElement = this.menu.element[ 0 ];
                    if (!$(event.target).closest(".ui-menu-item").length) {
                        this._delay(function () {
                            var that = this;
                            this.document.one("mousedown", function (event) {
                                if (event.target !== that.element[ 0 ] &&
                                        event.target !== menuElement &&
                                        !$.contains(menuElement, event.target)) {
                                    that.close();
                                }
                            });
                        });
                    }
                },
                menufocus: function (event, ui) {
                    // support: Firefox
                    // Prevent accidental activation of menu items in Firefox (#7024 #9118)
                    if (this.isNewMenu) {
                        this.isNewMenu = false;
                        if (event.originalEvent && /^mouse/.test(event.originalEvent.type)) {
                            this.menu.blur();

                            this.document.one("mousemove", function () {
                                $(event.target).trigger(event.originalEvent);
                            });

                            return;
                        }
                    }

                    var item = ui.item.data("ui-autocomplete-item");
                    if (false !== this._trigger("focus", event, {item: item})) {
                        // use value to match what will end up in the input, if it was a key event
                        if (event.originalEvent && /^key/.test(event.originalEvent.type)) {
                            this._value(item.value);
                        }
                    } else {
                        // Normally the input is populated with the item's value as the
                        // menu is navigated, causing screen readers to notice a change and
                        // announce the item. Since the focus event was canceled, this doesn't
                        // happen, so we update the live region so that screen readers can
                        // still notice the change and announce it.
                        this.liveRegion.text(item.value);
                    }
                },
                menuselect: function (event, ui) {
                    var item = ui.item.data("ui-autocomplete-item"),
                            previous = this.previous;

                    // only trigger when focus was lost (click on menu)
                    if (this.element[0] !== this.document[0].activeElement) {
                        this.element.focus();
                        this.previous = previous;
                        // #6109 - IE triggers two focus events and the second
                        // is asynchronous, so we need to reset the previous
                        // term synchronously and asynchronously :-(
                        this._delay(function () {
                            this.previous = previous;
                            this.selectedItem = item;
                        });
                    }

                    if (false !== this._trigger("select", event, {item: item})) {
                        this._value(item.value);
                    }
                    // reset the term after the select event
                    // this allows custom select handling to work properly
                    this.term = this._value();

                    this.close(event);
                    this.selectedItem = item;
                }
            });

            this.liveRegion = $("<span>", {
                role: "status",
                "aria-live": "polite"
            })
                    .addClass("ui-helper-hidden-accessible")
                    .insertAfter(this.element);

            // turning off autocomplete prevents the browser from remembering the
            // value when navigating through history, so we re-enable autocomplete
            // if the page is unloaded before the widget is destroyed. #7790
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete");
                }
            });
        },
        _destroy: function () {
            clearTimeout(this.searching);
            this.element
                    .removeClass("ui-autocomplete-input")
                    .removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove();
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key === "source") {
                this._initSource();
            }
            if (key === "appendTo") {
                this.menu.element.appendTo(this._appendTo());
            }
            if (key === "disabled" && value && this.xhr) {
                this.xhr.abort();
            }
        },
        _appendTo: function () {
            var element = this.options.appendTo;

            if (element) {
                element = element.jquery || element.nodeType ?
                        $(element) :
                        this.document.find(element).eq(0);
            }

            if (!element) {
                element = this.element.closest(".ui-front");
            }

            if (!element.length) {
                element = this.document[0].body;
            }

            return element;
        },
        _initSource: function () {
            var array, url,
                    that = this;
            if ($.isArray(this.options.source)) {
                array = this.options.source;
                this.source = function (request, response) {
                    response($.ui.autocomplete.filter(array, request.term));
                };
            } else if (typeof this.options.source === "string") {
                url = this.options.source;
                this.source = function (request, response) {
                    if (that.xhr) {
                        that.xhr.abort();
                    }
                    that.xhr = $.ajax({
                        url: url,
                        data: request,
                        dataType: "json",
                        success: function (data) {
                            response(data);
                        },
                        error: function () {
                            response([]);
                        }
                    });
                };
            } else {
                this.source = this.options.source;
            }
        },
        _searchTimeout: function (event) {
            clearTimeout(this.searching);
            this.searching = this._delay(function () {
                // only search if the value has changed
                if (this.term !== this._value()) {
                    this.selectedItem = null;
                    this.search(null, event);
                }
            }, this.options.delay);
        },
        search: function (value, event) {
            value = value != null ? value : this._value();

            // always save the actual value, not the one passed as an argument
            this.term = this._value();

            if (value.length < this.options.minLength) {
                return this.close(event);
            }

            if (this._trigger("search", event) === false) {
                return;
            }

            return this._search(value);
        },
        _search: function (value) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = false;

            this.source({term: value}, this._response());
        },
        _response: function () {
            var that = this,
                    index = ++requestIndex;

            return function (content) {
                if (index === requestIndex) {
                    that.__response(content);
                }

                that.pending--;
                if (!that.pending) {
                    that.element.removeClass("ui-autocomplete-loading");
                }
            };
        },
        __response: function (content) {
            if (content) {
                content = this._normalize(content);
            }
            this._trigger("response", null, {content: content});
            if (!this.options.disabled && content && content.length && !this.cancelSearch) {
                this._suggest(content);
                this._trigger("open");
            } else {
                // use ._close() instead of .close() so we don't cancel future searches
                this._close();
            }
        },
        close: function (event) {
            this.cancelSearch = true;
            this._close(event);
        },
        _close: function (event) {
            if (this.menu.element.is(":visible")) {
                this.menu.element.hide();
                this.menu.blur();
                this.isNewMenu = true;
                this._trigger("close", event);
            }
        },
        _change: function (event) {
            if (this.previous !== this._value()) {
                this._trigger("change", event, {item: this.selectedItem});
            }
        },
        _normalize: function (items) {
            // assume all items have the right format when the first item is complete
            if (items.length && items[0].label && items[0].value) {
                return items;
            }
            return $.map(items, function (item) {
                if (typeof item === "string") {
                    return {
                        label: item,
                        value: item
                    };
                }
                return $.extend({
                    label: item.label || item.value,
                    value: item.value || item.label
                }, item);
            });
        },
        _suggest: function (items) {
            var ul = this.menu.element.empty();
            this._renderMenu(ul, items);
            this.isNewMenu = true;
            this.menu.refresh();

            // size and position menu
            ul.show();
            this._resizeMenu();
            ul.position($.extend({
                of: this.element
            }, this.options.position));

            if (this.options.autoFocus) {
                this.menu.next();
            }
        },
        _resizeMenu: function () {
            var ul = this.menu.element;
            ul.outerWidth(Math.max(
                    // Firefox wraps long text (possibly a rounding bug)
                    // so we add 1px to avoid the wrapping (#7513)
                    ul.width("").outerWidth() + 1,
                    this.element.outerWidth()
                    ));
        },
        _renderMenu: function (ul, items) {
            var that = this;
            $.each(items, function (index, item) {
                that._renderItemData(ul, item);
            });
        },
        _renderItemData: function (ul, item) {
            return this._renderItem(ul, item).data("ui-autocomplete-item", item);
        },
        _renderItem: function (ul, item) {
            return $("<li>")
                    .append($("<a>").text(item.label))
                    .appendTo(ul);
        },
        _move: function (direction, event) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, event);
                return;
            }
            if (this.menu.isFirstItem() && /^previous/.test(direction) ||
                    this.menu.isLastItem() && /^next/.test(direction)) {
                this._value(this.term);
                this.menu.blur();
                return;
            }
            this.menu[ direction ](event);
        },
        widget: function () {
            return this.menu.element;
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments);
        },
        _keyEvent: function (keyEvent, event) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) {
                this._move(keyEvent, event);

                // prevents moving cursor to beginning/end of the text field in some browsers
                event.preventDefault();
            }
        }
    });

    $.extend($.ui.autocomplete, {
        escapeRegex: function (value) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        filter: function (array, term) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
            return $.grep(array, function (value) {
                return matcher.test(value.label || value.value || value);
            });
        }
    });


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
    $.widget("ui.autocomplete", $.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (amount) {
                    return amount + (amount > 1 ? " results are" : " result is") +
                            " available, use up and down arrow keys to navigate.";
                }
            }
        },
        __response: function (content) {
            var message;
            this._superApply(arguments);
            if (this.options.disabled || this.cancelSearch) {
                return;
            }
            if (content && content.length) {
                message = this.options.messages.results(content.length);
            } else {
                message = this.options.messages.noResults;
            }
            this.liveRegion.text(message);
        }
    });

}(jQuery));

(function ($, undefined) {

    var lastActive, startXPos, startYPos, clickDragged,
            baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
            stateClasses = "ui-state-hover ui-state-active ",
            typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
            formResetHandler = function () {
                var buttons = $(this).find(":ui-button");
                setTimeout(function () {
                    buttons.button("refresh");
                }, 1);
            },
            radioGroup = function (radio) {
                var name = radio.name,
                        form = radio.form,
                        radios = $([]);
                if (name) {
                    name = name.replace(/'/g, "\\'");
                    if (form) {
                        radios = $(form).find("[name='" + name + "']");
                    } else {
                        radios = $("[name='" + name + "']", radio.ownerDocument)
                                .filter(function () {
                                    return !this.form;
                                });
                    }
                }
                return radios;
            };

    $.widget("ui.button", {
        version: "1.10.2",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: true,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function () {
            this.element.closest("form")
                    .unbind("reset" + this.eventNamespace)
                    .bind("reset" + this.eventNamespace, formResetHandler);

            if (typeof this.options.disabled !== "boolean") {
                this.options.disabled = !!this.element.prop("disabled");
            } else {
                this.element.prop("disabled", this.options.disabled);
            }

            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr("title");

            var that = this,
                    options = this.options,
                    toggleButton = this.type === "checkbox" || this.type === "radio",
                    activeClass = !toggleButton ? "ui-state-active" : "",
                    focusClass = "ui-state-focus";

            if (options.label === null) {
                options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
            }

            this._hoverable(this.buttonElement);

            this.buttonElement
                    .addClass(baseClasses)
                    .attr("role", "button")
                    .bind("mouseenter" + this.eventNamespace, function () {
                        if (options.disabled) {
                            return;
                        }
                        if (this === lastActive) {
                            $(this).addClass("ui-state-active");
                        }
                    })
                    .bind("mouseleave" + this.eventNamespace, function () {
                        if (options.disabled) {
                            return;
                        }
                        $(this).removeClass(activeClass);
                    })
                    .bind("click" + this.eventNamespace, function (event) {
                        if (options.disabled) {
                            event.preventDefault();
                            event.stopImmediatePropagation();
                        }
                    });

            this.element
                    .bind("focus" + this.eventNamespace, function () {
                        // no need to check disabled, focus won't be triggered anyway
                        that.buttonElement.addClass(focusClass);
                    })
                    .bind("blur" + this.eventNamespace, function () {
                        that.buttonElement.removeClass(focusClass);
                    });

            if (toggleButton) {
                this.element.bind("change" + this.eventNamespace, function () {
                    if (clickDragged) {
                        return;
                    }
                    that.refresh();
                });
                // if mouse moves between mousedown and mouseup (drag) set clickDragged flag
                // prevents issue where button state changes but checkbox/radio checked state
                // does not in Firefox (see ticket #6970)
                this.buttonElement
                        .bind("mousedown" + this.eventNamespace, function (event) {
                            if (options.disabled) {
                                return;
                            }
                            clickDragged = false;
                            startXPos = event.pageX;
                            startYPos = event.pageY;
                        })
                        .bind("mouseup" + this.eventNamespace, function (event) {
                            if (options.disabled) {
                                return;
                            }
                            if (startXPos !== event.pageX || startYPos !== event.pageY) {
                                clickDragged = true;
                            }
                        });
            }

            if (this.type === "checkbox") {
                this.buttonElement.bind("click" + this.eventNamespace, function () {
                    if (options.disabled || clickDragged) {
                        return false;
                    }
                });
            } else if (this.type === "radio") {
                this.buttonElement.bind("click" + this.eventNamespace, function () {
                    if (options.disabled || clickDragged) {
                        return false;
                    }
                    $(this).addClass("ui-state-active");
                    that.buttonElement.attr("aria-pressed", "true");

                    var radio = that.element[ 0 ];
                    radioGroup(radio)
                            .not(radio)
                            .map(function () {
                                return $(this).button("widget")[ 0 ];
                            })
                            .removeClass("ui-state-active")
                            .attr("aria-pressed", "false");
                });
            } else {
                this.buttonElement
                        .bind("mousedown" + this.eventNamespace, function () {
                            if (options.disabled) {
                                return false;
                            }
                            $(this).addClass("ui-state-active");
                            lastActive = this;
                            that.document.one("mouseup", function () {
                                lastActive = null;
                            });
                        })
                        .bind("mouseup" + this.eventNamespace, function () {
                            if (options.disabled) {
                                return false;
                            }
                            $(this).removeClass("ui-state-active");
                        })
                        .bind("keydown" + this.eventNamespace, function (event) {
                            if (options.disabled) {
                                return false;
                            }
                            if (event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER) {
                                $(this).addClass("ui-state-active");
                            }
                        })
                        // see #8559, we bind to blur here in case the button element loses
                        // focus between keydown and keyup, it would be left in an "active" state
                        .bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function () {
                            $(this).removeClass("ui-state-active");
                        });

                if (this.buttonElement.is("a")) {
                    this.buttonElement.keyup(function (event) {
                        if (event.keyCode === $.ui.keyCode.SPACE) {
                            // TODO pass through original event correctly (just as 2nd argument doesn't work)
                            $(this).click();
                        }
                    });
                }
            }

            // TODO: pull out $.Widget's handling for the disabled option into
            // $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
            // be overridden by individual plugins
            this._setOption("disabled", options.disabled);
            this._resetButton();
        },
        _determineButtonType: function () {
            var ancestor, labelSelector, checked;

            if (this.element.is("[type=checkbox]")) {
                this.type = "checkbox";
            } else if (this.element.is("[type=radio]")) {
                this.type = "radio";
            } else if (this.element.is("input")) {
                this.type = "input";
            } else {
                this.type = "button";
            }

            if (this.type === "checkbox" || this.type === "radio") {
                // we don't search against the document in case the element
                // is disconnected from the DOM
                ancestor = this.element.parents().last();
                labelSelector = "label[for='" + this.element.attr("id") + "']";
                this.buttonElement = ancestor.find(labelSelector);
                if (!this.buttonElement.length) {
                    ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
                    this.buttonElement = ancestor.filter(labelSelector);
                    if (!this.buttonElement.length) {
                        this.buttonElement = ancestor.find(labelSelector);
                    }
                }
                this.element.addClass("ui-helper-hidden-accessible");

                checked = this.element.is(":checked");
                if (checked) {
                    this.buttonElement.addClass("ui-state-active");
                }
                this.buttonElement.prop("aria-pressed", checked);
            } else {
                this.buttonElement = this.element;
            }
        },
        widget: function () {
            return this.buttonElement;
        },
        _destroy: function () {
            this.element
                    .removeClass("ui-helper-hidden-accessible");
            this.buttonElement
                    .removeClass(baseClasses + " " + stateClasses + " " + typeClasses)
                    .removeAttr("role")
                    .removeAttr("aria-pressed")
                    .html(this.buttonElement.find(".ui-button-text").html());

            if (!this.hasTitle) {
                this.buttonElement.removeAttr("title");
            }
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key === "disabled") {
                if (value) {
                    this.element.prop("disabled", true);
                } else {
                    this.element.prop("disabled", false);
                }
                return;
            }
            this._resetButton();
        },
        refresh: function () {
            //See #8237 & #8828
            var isDisabled = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");

            if (isDisabled !== this.options.disabled) {
                this._setOption("disabled", isDisabled);
            }
            if (this.type === "radio") {
                radioGroup(this.element[0]).each(function () {
                    if ($(this).is(":checked")) {
                        $(this).button("widget")
                                .addClass("ui-state-active")
                                .attr("aria-pressed", "true");
                    } else {
                        $(this).button("widget")
                                .removeClass("ui-state-active")
                                .attr("aria-pressed", "false");
                    }
                });
            } else if (this.type === "checkbox") {
                if (this.element.is(":checked")) {
                    this.buttonElement
                            .addClass("ui-state-active")
                            .attr("aria-pressed", "true");
                } else {
                    this.buttonElement
                            .removeClass("ui-state-active")
                            .attr("aria-pressed", "false");
                }
            }
        },
        _resetButton: function () {
            if (this.type === "input") {
                if (this.options.label) {
                    this.element.val(this.options.label);
                }
                return;
            }
            var buttonElement = this.buttonElement.removeClass(typeClasses),
                    buttonText = $("<span></span>", this.document[0])
                    .addClass("ui-button-text")
                    .html(this.options.label)
                    .appendTo(buttonElement.empty())
                    .text(),
                    icons = this.options.icons,
                    multipleIcons = icons.primary && icons.secondary,
                    buttonClasses = [];

            if (icons.primary || icons.secondary) {
                if (this.options.text) {
                    buttonClasses.push("ui-button-text-icon" + (multipleIcons ? "s" : (icons.primary ? "-primary" : "-secondary")));
                }

                if (icons.primary) {
                    buttonElement.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>");
                }

                if (icons.secondary) {
                    buttonElement.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>");
                }

                if (!this.options.text) {
                    buttonClasses.push(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only");

                    if (!this.hasTitle) {
                        buttonElement.attr("title", $.trim(buttonText));
                    }
                }
            } else {
                buttonClasses.push("ui-button-text-only");
            }
            buttonElement.addClass(buttonClasses.join(" "));
        }
    });

    $.widget("ui.buttonset", {
        version: "1.10.2",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
        },
        _create: function () {
            this.element.addClass("ui-buttonset");
        },
        _init: function () {
            this.refresh();
        },
        _setOption: function (key, value) {
            if (key === "disabled") {
                this.buttons.button("option", key, value);
            }

            this._super(key, value);
        },
        refresh: function () {
            var rtl = this.element.css("direction") === "rtl";

            this.buttons = this.element.find(this.options.items)
                    .filter(":ui-button")
                    .button("refresh")
                    .end()
                    .not(":ui-button")
                    .button()
                    .end()
                    .map(function () {
                        return $(this).button("widget")[ 0 ];
                    })
                    .removeClass("ui-corner-all ui-corner-left ui-corner-right")
                    .filter(":first")
                    .addClass(rtl ? "ui-corner-right" : "ui-corner-left")
                    .end()
                    .filter(":last")
                    .addClass(rtl ? "ui-corner-left" : "ui-corner-right")
                    .end()
                    .end();
        },
        _destroy: function () {
            this.element.removeClass("ui-buttonset");
            this.buttons
                    .map(function () {
                        return $(this).button("widget")[ 0 ];
                    })
                    .removeClass("ui-corner-left ui-corner-right")
                    .end()
                    .button("destroy");
        }
    });

}(jQuery));

(function ($, undefined) {

    $.extend($.ui, {datepicker: {version: "1.10.2"}});

    var PROP_NAME = "datepicker",
            dpuuid = new Date().getTime(),
            instActive;

    /* Date picker manager.
     Use the singleton instance of this class, $.datepicker, to interact with the date picker.
     Settings for (groups of) date pickers are maintained in an instance object,
     allowing multiple different settings on the same page. */

    function Datepicker() {
        this._curInst = null; // The current instance in use
        this._keyEvent = false; // If the last event was a key event
        this._disabledInputs = []; // List of date picker inputs that have been disabled
        this._datepickerShowing = false; // True if the popup picker is showing , false if not
        this._inDialog = false; // True if showing within a "dialog", false if not
        this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
        this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
        this._appendClass = "ui-datepicker-append"; // The name of the append marker class
        this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
        this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
        this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
        this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
        this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
        this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
        this.regional = []; // Available regional settings, indexed by language code
        this.regional[""] = {// Default regional settings
            closeText: "Done", // Display text for close link
            prevText: "Prev", // Display text for previous month link
            nextText: "Next", // Display text for next month link
            currentText: "Today", // Display text for current month link
            monthNames: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"], // Names of months for drop-down and formatting
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
            weekHeader: "Wk", // Column header for week of the year
            dateFormat: "mm/dd/yy", // See format options on parseDate
            firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
            isRTL: false, // True if right-to-left language, false if left-to-right
            showMonthAfterYear: false, // True if the year select precedes month, false for month then year
            yearSuffix: "" // Additional text to append to the year in the month headers
        };
        this._defaults = {// Global defaults for all the date picker instances
            showOn: "focus", // "focus" for popup on focus,
            // "button" for trigger button, or "both" for either
            showAnim: "fadeIn", // Name of jQuery animation for popup
            showOptions: {}, // Options for enhanced animations
            defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
            appendText: "", // Display text following the input box, e.g. showing the format
            buttonText: "...", // Text for trigger button
            buttonImage: "", // URL for trigger button image
            buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
            hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
            navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
            gotoCurrent: false, // True if today link goes back to current selection instead
            changeMonth: false, // True if month can be selected directly, false if only prev/next
            changeYear: false, // True if year can be selected directly, false if only prev/next
            yearRange: "c-10:c+10", // Range of years to display in drop-down,
            // either relative to today's year (-nn:+nn), relative to currently displayed year
            // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
            showOtherMonths: false, // True to show dates in other months, false to leave blank
            selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
            showWeek: false, // True to show week of the year, false to not show it
            calculateWeek: this.iso8601Week, // How to calculate the week of the year,
            // takes a Date and returns the number of the week for it
            shortYearCutoff: "+10", // Short year values < this are in the current century,
            // > this are in the previous century,
            // string value starting with "+" for current year + value
            minDate: null, // The earliest selectable date, or null for no limit
            maxDate: null, // The latest selectable date, or null for no limit
            duration: "fast", // Duration of display/closure
            beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
            beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
            onSelect: null, // Define a callback function when a date is selected
            onChangeMonthYear: null, // Define a callback function when the month or year is changed
            onClose: null, // Define a callback function when the datepicker is closed
            numberOfMonths: 1, // Number of months to show at a time
            showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
            stepMonths: 1, // Number of months to step back/forward
            stepBigMonths: 12, // Number of months to step back/forward for the big links
            altField: "", // Selector for an alternate field to store selected dates into
            altFormat: "", // The date format to use for the alternate field
            constrainInput: true, // The input is constrained by the current date format
            showButtonPanel: false, // True to show button panel, false to not show it
            autoSize: false, // True to size the input for the date format, false to leave as is
            disabled: false // The initial disabled state
        };
        $.extend(this._defaults, this.regional[""]);
        this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
    }

    $.extend(Datepicker.prototype, {
        /* Class name added to elements to indicate already configured with a date picker. */
        markerClassName: "hasDatepicker",
        //Keep track of the maximum number of rows displayed (see #7043)
        maxRows: 4,
        // TODO rename to "widget" when switching to widget factory
        _widgetDatepicker: function () {
            return this.dpDiv;
        },
        /* Override the default settings for all instances of the date picker.
         * @param  settings  object - the new settings to use as defaults (anonymous object)
         * @return the manager object
         */
        setDefaults: function (settings) {
            extendRemove(this._defaults, settings || {});
            return this;
        },
        /* Attach the date picker to a jQuery selection.
         * @param  target   element - the target input field or division or span
         * @param  settings  object - the new settings to use for this date picker instance (anonymous)
         */
        _attachDatepicker: function (target, settings) {
            var nodeName, inline, inst;
            nodeName = target.nodeName.toLowerCase();
            inline = (nodeName === "div" || nodeName === "span");
            if (!target.id) {
                this.uuid += 1;
                target.id = "dp" + this.uuid;
            }
            inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {});
            if (nodeName === "input") {
                this._connectDatepicker(target, inst);
            } else if (inline) {
                this._inlineDatepicker(target, inst);
            }
        },
        /* Create a new instance object. */
        _newInst: function (target, inline) {
            var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
            return {id: id, input: target, // associated target
                selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
                drawMonth: 0, drawYear: 0, // month being drawn
                inline: inline, // is datepicker inline or not
                dpDiv: (!inline ? this.dpDiv : // presentation div
                        bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
        },
        /* Attach the date picker to an input field. */
        _connectDatepicker: function (target, inst) {
            var input = $(target);
            inst.append = $([]);
            inst.trigger = $([]);
            if (input.hasClass(this.markerClassName)) {
                return;
            }
            this._attachments(input, inst);
            input.addClass(this.markerClassName).keydown(this._doKeyDown).
                    keypress(this._doKeyPress).keyup(this._doKeyUp);
            this._autoSize(inst);
            $.data(target, PROP_NAME, inst);
            //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
            if (inst.settings.disabled) {
                this._disableDatepicker(target);
            }
        },
        /* Make attachments based on settings. */
        _attachments: function (input, inst) {
            var showOn, buttonText, buttonImage,
                    appendText = this._get(inst, "appendText"),
                    isRTL = this._get(inst, "isRTL");

            if (inst.append) {
                inst.append.remove();
            }
            if (appendText) {
                inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
                input[isRTL ? "before" : "after"](inst.append);
            }

            input.unbind("focus", this._showDatepicker);

            if (inst.trigger) {
                inst.trigger.remove();
            }

            showOn = this._get(inst, "showOn");
            if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
                input.focus(this._showDatepicker);
            }
            if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
                buttonText = this._get(inst, "buttonText");
                buttonImage = this._get(inst, "buttonImage");
                inst.trigger = $(this._get(inst, "buttonImageOnly") ?
                        $("<img/>").addClass(this._triggerClass).
                        attr({src: buttonImage, alt: buttonText, title: buttonText}) :
                        $("<button type='button'></button>").addClass(this._triggerClass).
                        html(!buttonImage ? buttonText : $("<img/>").attr(
                                {src: buttonImage, alt: buttonText, title: buttonText})));
                input[isRTL ? "before" : "after"](inst.trigger);
                inst.trigger.click(function () {
                    if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
                        $.datepicker._hideDatepicker();
                    } else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
                        $.datepicker._hideDatepicker();
                        $.datepicker._showDatepicker(input[0]);
                    } else {
                        $.datepicker._showDatepicker(input[0]);
                    }
                    return false;
                });
            }
        },
        /* Apply the maximum length for the date format. */
        _autoSize: function (inst) {
            if (this._get(inst, "autoSize") && !inst.inline) {
                var findMax, max, maxI, i,
                        date = new Date(2009, 12 - 1, 20), // Ensure double digits
                        dateFormat = this._get(inst, "dateFormat");

                if (dateFormat.match(/[DM]/)) {
                    findMax = function (names) {
                        max = 0;
                        maxI = 0;
                        for (i = 0; i < names.length; i++) {
                            if (names[i].length > max) {
                                max = names[i].length;
                                maxI = i;
                            }
                        }
                        return maxI;
                    };
                    date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
                            "monthNames" : "monthNamesShort"))));
                    date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
                            "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
                }
                inst.input.attr("size", this._formatDate(inst, date).length);
            }
        },
        /* Attach an inline date picker to a div. */
        _inlineDatepicker: function (target, inst) {
            var divSpan = $(target);
            if (divSpan.hasClass(this.markerClassName)) {
                return;
            }
            divSpan.addClass(this.markerClassName).append(inst.dpDiv);
            $.data(target, PROP_NAME, inst);
            this._setDate(inst, this._getDefaultDate(inst), true);
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
            //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
            if (inst.settings.disabled) {
                this._disableDatepicker(target);
            }
            // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
            // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
            inst.dpDiv.css("display", "block");
        },
        /* Pop-up the date picker in a "dialog" box.
         * @param  input element - ignored
         * @param  date string or Date - the initial date to display
         * @param  onSelect  function - the function to call when a date is selected
         * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
         * @param  pos int[2] - coordinates for the dialog's position within the screen or
         *                  event - with x/y coordinates or
         *                  leave empty for default (screen centre)
         * @return the manager object
         */
        _dialogDatepicker: function (input, date, onSelect, settings, pos) {
            var id, browserWidth, browserHeight, scrollX, scrollY,
                    inst = this._dialogInst; // internal instance

            if (!inst) {
                this.uuid += 1;
                id = "dp" + this.uuid;
                this._dialogInput = $("<input type='text' id='" + id +
                        "' style='position: absolute; top: -100px; width: 0px;'/>");
                this._dialogInput.keydown(this._doKeyDown);
                $("body").append(this._dialogInput);
                inst = this._dialogInst = this._newInst(this._dialogInput, false);
                inst.settings = {};
                $.data(this._dialogInput[0], PROP_NAME, inst);
            }
            extendRemove(inst.settings, settings || {});
            date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
            this._dialogInput.val(date);

            this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
            if (!this._pos) {
                browserWidth = document.documentElement.clientWidth;
                browserHeight = document.documentElement.clientHeight;
                scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = // should use actual width/height below
                        [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
            }

            // move input on screen for focus, but hidden behind dialog
            this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
            inst.settings.onSelect = onSelect;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            if ($.blockUI) {
                $.blockUI(this.dpDiv);
            }
            $.data(this._dialogInput[0], PROP_NAME, inst);
            return this;
        },
        /* Detach a datepicker from its control.
         * @param  target   element - the target input field or division or span
         */
        _destroyDatepicker: function (target) {
            var nodeName,
                    $target = $(target),
                    inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            $.removeData(target, PROP_NAME);
            if (nodeName === "input") {
                inst.append.remove();
                inst.trigger.remove();
                $target.removeClass(this.markerClassName).
                        unbind("focus", this._showDatepicker).
                        unbind("keydown", this._doKeyDown).
                        unbind("keypress", this._doKeyPress).
                        unbind("keyup", this._doKeyUp);
            } else if (nodeName === "div" || nodeName === "span") {
                $target.removeClass(this.markerClassName).empty();
            }
        },
        /* Enable the date picker to a jQuery selection.
         * @param  target   element - the target input field or division or span
         */
        _enableDatepicker: function (target) {
            var nodeName, inline,
                    $target = $(target),
                    inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            if (nodeName === "input") {
                target.disabled = false;
                inst.trigger.filter("button").
                        each(function () {
                            this.disabled = false;
                        }).end().
                        filter("img").css({opacity: "1.0", cursor: ""});
            } else if (nodeName === "div" || nodeName === "span") {
                inline = $target.children("." + this._inlineClass);
                inline.children().removeClass("ui-state-disabled");
                inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                        prop("disabled", false);
            }
            this._disabledInputs = $.map(this._disabledInputs,
                    function (value) {
                        return (value === target ? null : value);
                    }); // delete entry
        },
        /* Disable the date picker to a jQuery selection.
         * @param  target   element - the target input field or division or span
         */
        _disableDatepicker: function (target) {
            var nodeName, inline,
                    $target = $(target),
                    inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            if (nodeName === "input") {
                target.disabled = true;
                inst.trigger.filter("button").
                        each(function () {
                            this.disabled = true;
                        }).end().
                        filter("img").css({opacity: "0.5", cursor: "default"});
            } else if (nodeName === "div" || nodeName === "span") {
                inline = $target.children("." + this._inlineClass);
                inline.children().addClass("ui-state-disabled");
                inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                        prop("disabled", true);
            }
            this._disabledInputs = $.map(this._disabledInputs,
                    function (value) {
                        return (value === target ? null : value);
                    }); // delete entry
            this._disabledInputs[this._disabledInputs.length] = target;
        },
        /* Is the first field in a jQuery collection disabled as a datepicker?
         * @param  target   element - the target input field or division or span
         * @return boolean - true if disabled, false if enabled
         */
        _isDisabledDatepicker: function (target) {
            if (!target) {
                return false;
            }
            for (var i = 0; i < this._disabledInputs.length; i++) {
                if (this._disabledInputs[i] === target) {
                    return true;
                }
            }
            return false;
        },
        /* Retrieve the instance data for the target control.
         * @param  target  element - the target input field or division or span
         * @return  object - the associated instance data
         * @throws  error if a jQuery problem getting data
         */
        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw "Missing instance data for this datepicker";
            }
        },
        /* Update or retrieve the settings for a date picker attached to an input field or division.
         * @param  target  element - the target input field or division or span
         * @param  name object - the new settings to update or
         *              string - the name of the setting to change or retrieve,
         *              when retrieving also "all" for all instance settings or
         *              "defaults" for all global defaults
         * @param  value   any - the new value for the setting
         *              (omit if above is an object or to retrieve a value)
         */
        _optionDatepicker: function (target, name, value) {
            var settings, date, minDate, maxDate,
                    inst = this._getInst(target);

            if (arguments.length === 2 && typeof name === "string") {
                return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
                        (inst ? (name === "all" ? $.extend({}, inst.settings) :
                                this._get(inst, name)) : null));
            }

            settings = name || {};
            if (typeof name === "string") {
                settings = {};
                settings[name] = value;
            }

            if (inst) {
                if (this._curInst === inst) {
                    this._hideDatepicker();
                }

                date = this._getDateDatepicker(target, true);
                minDate = this._getMinMaxDate(inst, "min");
                maxDate = this._getMinMaxDate(inst, "max");
                extendRemove(inst.settings, settings);
                // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
                if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
                    inst.settings.minDate = this._formatDate(inst, minDate);
                }
                if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
                    inst.settings.maxDate = this._formatDate(inst, maxDate);
                }
                if ("disabled" in settings) {
                    if (settings.disabled) {
                        this._disableDatepicker(target);
                    } else {
                        this._enableDatepicker(target);
                    }
                }
                this._attachments($(target), inst);
                this._autoSize(inst);
                this._setDate(inst, date);
                this._updateAlternate(inst);
                this._updateDatepicker(inst);
            }
        },
        // change method deprecated
        _changeDatepicker: function (target, name, value) {
            this._optionDatepicker(target, name, value);
        },
        /* Redraw the date picker attached to an input field or division.
         * @param  target  element - the target input field or division or span
         */
        _refreshDatepicker: function (target) {
            var inst = this._getInst(target);
            if (inst) {
                this._updateDatepicker(inst);
            }
        },
        /* Set the dates for a jQuery selection.
         * @param  target element - the target input field or division or span
         * @param  date Date - the new date
         */
        _setDateDatepicker: function (target, date) {
            var inst = this._getInst(target);
            if (inst) {
                this._setDate(inst, date);
                this._updateDatepicker(inst);
                this._updateAlternate(inst);
            }
        },
        /* Get the date(s) for the first entry in a jQuery selection.
         * @param  target element - the target input field or division or span
         * @param  noDefault boolean - true if no default date is to be used
         * @return Date - the current date
         */
        _getDateDatepicker: function (target, noDefault) {
            var inst = this._getInst(target);
            if (inst && !inst.inline) {
                this._setDateFromField(inst, noDefault);
            }
            return (inst ? this._getDate(inst) : null);
        },
        /* Handle keystrokes. */
        _doKeyDown: function (event) {
            var onSelect, dateStr, sel,
                    inst = $.datepicker._getInst(event.target),
                    handled = true,
                    isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

            inst._keyEvent = true;
            if ($.datepicker._datepickerShowing) {
                switch (event.keyCode) {
                    case 9:
                        $.datepicker._hideDatepicker();
                        handled = false;
                        break; // hide on tab out
                    case 13:
                        sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                                $.datepicker._currentClass + ")", inst.dpDiv);
                        if (sel[0]) {
                            $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                        }

                        onSelect = $.datepicker._get(inst, "onSelect");
                        if (onSelect) {
                            dateStr = $.datepicker._formatDate(inst);

                            // trigger custom callback
                            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                        } else {
                            $.datepicker._hideDatepicker();
                        }

                        return false; // don't submit the form
                    case 27:
                        $.datepicker._hideDatepicker();
                        break; // hide on escape
                    case 33:
                        $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                -$.datepicker._get(inst, "stepBigMonths") :
                                -$.datepicker._get(inst, "stepMonths")), "M");
                        break; // previous month/year on page up/+ ctrl
                    case 34:
                        $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                +$.datepicker._get(inst, "stepBigMonths") :
                                +$.datepicker._get(inst, "stepMonths")), "M");
                        break; // next month/year on page down/+ ctrl
                    case 35:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._clearDate(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // clear on ctrl or command +end
                    case 36:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._gotoToday(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // current on ctrl or command +home
                    case 37:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // -1 day on ctrl or command +left
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                    -$.datepicker._get(inst, "stepBigMonths") :
                                    -$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +left on Mac
                        break;
                    case 38:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, -7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // -1 week on ctrl or command +up
                    case 39:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // +1 day on ctrl or command +right
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                    +$.datepicker._get(inst, "stepBigMonths") :
                                    +$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +right
                        break;
                    case 40:
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, +7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // +1 week on ctrl or command +down
                    default:
                        handled = false;
                }
            } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
                $.datepicker._showDatepicker(this);
            } else {
                handled = false;
            }

            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        /* Filter entered characters - based on date format. */
        _doKeyPress: function (event) {
            var chars, chr,
                    inst = $.datepicker._getInst(event.target);

            if ($.datepicker._get(inst, "constrainInput")) {
                chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
                chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
                return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
            }
        },
        /* Synchronise manual entry and field/alternate field. */
        _doKeyUp: function (event) {
            var date,
                    inst = $.datepicker._getInst(event.target);

            if (inst.input.val() !== inst.lastVal) {
                try {
                    date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                            (inst.input ? inst.input.val() : null),
                            $.datepicker._getFormatConfig(inst));

                    if (date) { // only if valid
                        $.datepicker._setDateFromField(inst);
                        $.datepicker._updateAlternate(inst);
                        $.datepicker._updateDatepicker(inst);
                    }
                } catch (err) {
                }
            }
            return true;
        },
        /* Pop-up the date picker for a given input field.
         * If false returned from beforeShow event handler do not show.
         * @param  input  element - the input field attached to the date picker or
         *                  event - if triggered by focus
         */
        _showDatepicker: function (input) {
            input = input.target || input;
            if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
                input = $("input", input.parentNode)[0];
            }

            if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
                return;
            }

            var inst, beforeShow, beforeShowSettings, isFixed,
                    offset, showAnim, duration;

            inst = $.datepicker._getInst(input);
            if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
                $.datepicker._curInst.dpDiv.stop(true, true);
                if (inst && $.datepicker._datepickerShowing) {
                    $.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
                }
            }

            beforeShow = $.datepicker._get(inst, "beforeShow");
            beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
            if (beforeShowSettings === false) {
                return;
            }
            extendRemove(inst.settings, beforeShowSettings);

            inst.lastVal = null;
            $.datepicker._lastInput = input;
            $.datepicker._setDateFromField(inst);

            if ($.datepicker._inDialog) { // hide cursor
                input.value = "";
            }
            if (!$.datepicker._pos) { // position below input
                $.datepicker._pos = $.datepicker._findPos(input);
                $.datepicker._pos[1] += input.offsetHeight; // add the height
            }

            isFixed = false;
            $(input).parents().each(function () {
                isFixed |= $(this).css("position") === "fixed";
                return !isFixed;
            });

            offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
            $.datepicker._pos = null;
            //to avoid flashes on Firefox
            inst.dpDiv.empty();
            // determine sizing offscreen
            inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
            $.datepicker._updateDatepicker(inst);
            // fix width for dynamic number of date pickers
            // and adjust position before showing
            offset = $.datepicker._checkOffset(inst, offset, isFixed);
            inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
                        "static" : (isFixed ? "fixed" : "absolute")), display: "none",
                left: offset.left + "px", top: offset.top + "px"});

            if (!inst.inline) {
                showAnim = $.datepicker._get(inst, "showAnim");
                duration = $.datepicker._get(inst, "duration");
                inst.dpDiv.zIndex($(input).zIndex() + 1);
                $.datepicker._datepickerShowing = true;

                if ($.effects && $.effects.effect[ showAnim ]) {
                    inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
                } else {
                    inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
                }

                if (inst.input.is(":visible") && !inst.input.is(":disabled")) {
                    inst.input.focus();
                }
                $.datepicker._curInst = inst;
            }
        },
        /* Generate the date picker content. */
        _updateDatepicker: function (inst) {
            this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
            instActive = inst; // for delegate hover events
            inst.dpDiv.empty().append(this._generateHTML(inst));
            this._attachHandlers(inst);
            inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();

            var origyearshtml,
                    numMonths = this._getNumberOfMonths(inst),
                    cols = numMonths[1],
                    width = 17;

            inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            if (cols > 1) {
                inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
            }
            inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
                    "Class"]("ui-datepicker-multi");
            inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
                    "Class"]("ui-datepicker-rtl");

            // #6694 - don't focus the input if it's already focused
            // this breaks the change event in IE
            if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
                    inst.input.is(":visible") && !inst.input.is(":disabled") && inst.input[0] !== document.activeElement) {
                inst.input.focus();
            }

            // deffered render of the years select (to avoid flashes on Firefox)
            if (inst.yearshtml) {
                origyearshtml = inst.yearshtml;
                setTimeout(function () {
                    //assure that inst.yearshtml didn't change.
                    if (origyearshtml === inst.yearshtml && inst.yearshtml) {
                        inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
                    }
                    origyearshtml = inst.yearshtml = null;
                }, 0);
            }
        },
        /* Retrieve the size of left and top borders for an element.
         * @param  elem  (jQuery object) the element of interest
         * @return  (number[2]) the left and top borders
         */
        _getBorders: function (elem) {
            var convert = function (value) {
                return {thin: 1, medium: 2, thick: 3}[value] || value;
            };
            return [parseFloat(convert(elem.css("border-left-width"))),
                parseFloat(convert(elem.css("border-top-width")))];
        },
        /* Check positioning to remain on screen. */
        _checkOffset: function (inst, offset, isFixed) {
            var dpWidth = inst.dpDiv.outerWidth(),
                    dpHeight = inst.dpDiv.outerHeight(),
                    inputWidth = inst.input ? inst.input.outerWidth() : 0,
                    inputHeight = inst.input ? inst.input.outerHeight() : 0,
                    viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
                    viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

            offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
            offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
            offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

            // now check if datepicker is showing outside window viewport - move to a better place if so.
            offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
                    Math.abs(offset.left + dpWidth - viewWidth) : 0);
            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                    Math.abs(dpHeight + inputHeight) : 0);

            return offset;
        },
        /* Find an object's position on the screen. */
        _findPos: function (obj) {
            var position,
                    inst = this._getInst(obj),
                    isRTL = this._get(inst, "isRTL");

            while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
                obj = obj[isRTL ? "previousSibling" : "nextSibling"];
            }

            position = $(obj).offset();
            return [position.left, position.top];
        },
        /* Hide the date picker from view.
         * @param  input  element - the input field attached to the date picker
         */
        _hideDatepicker: function (input) {
            var showAnim, duration, postProcess, onClose,
                    inst = this._curInst;

            if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
                return;
            }

            if (this._datepickerShowing) {
                showAnim = this._get(inst, "showAnim");
                duration = this._get(inst, "duration");
                postProcess = function () {
                    $.datepicker._tidyDialog(inst);
                };

                // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
                if ($.effects && ($.effects.effect[ showAnim ] || $.effects[ showAnim ])) {
                    inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
                } else {
                    inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
                            (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
                }

                if (!showAnim) {
                    postProcess();
                }
                this._datepickerShowing = false;

                onClose = this._get(inst, "onClose");
                if (onClose) {
                    onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
                }

                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({position: "absolute", left: "0", top: "-100px"});
                    if ($.blockUI) {
                        $.unblockUI();
                        $("body").append(this.dpDiv);
                    }
                }
                this._inDialog = false;
            }
        },
        /* Tidy up after a dialog display. */
        _tidyDialog: function (inst) {
            inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
        },
        /* Close date picker if clicked elsewhere. */
        _checkExternalClick: function (event) {
            if (!$.datepicker._curInst) {
                return;
            }

            var $target = $(event.target),
                    inst = $.datepicker._getInst($target[0]);

            if ((($target[0].id !== $.datepicker._mainDivId &&
                    $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
                    !$target.hasClass($.datepicker.markerClassName) &&
                    !$target.closest("." + $.datepicker._triggerClass).length &&
                    $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))) ||
                    ($target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst)) {
                $.datepicker._hideDatepicker();
            }
        },
        /* Adjust one of the date sub-fields. */
        _adjustDate: function (id, offset, period) {
            var target = $(id),
                    inst = this._getInst(target[0]);

            if (this._isDisabledDatepicker(target[0])) {
                return;
            }
            this._adjustInstDate(inst, offset +
                    (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
                    period);
            this._updateDatepicker(inst);
        },
        /* Action for current link. */
        _gotoToday: function (id) {
            var date,
                    target = $(id),
                    inst = this._getInst(target[0]);

            if (this._get(inst, "gotoCurrent") && inst.currentDay) {
                inst.selectedDay = inst.currentDay;
                inst.drawMonth = inst.selectedMonth = inst.currentMonth;
                inst.drawYear = inst.selectedYear = inst.currentYear;
            } else {
                date = new Date();
                inst.selectedDay = date.getDate();
                inst.drawMonth = inst.selectedMonth = date.getMonth();
                inst.drawYear = inst.selectedYear = date.getFullYear();
            }
            this._notifyChange(inst);
            this._adjustDate(target);
        },
        /* Action for selecting a new month/year. */
        _selectMonthYear: function (id, select, period) {
            var target = $(id),
                    inst = this._getInst(target[0]);

            inst["selected" + (period === "M" ? "Month" : "Year")] =
                    inst["draw" + (period === "M" ? "Month" : "Year")] =
                    parseInt(select.options[select.selectedIndex].value, 10);

            this._notifyChange(inst);
            this._adjustDate(target);
        },
        /* Action for selecting a day. */
        _selectDay: function (id, month, year, td) {
            var inst,
                    target = $(id);

            if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
                return;
            }

            inst = this._getInst(target[0]);
            inst.selectedDay = inst.currentDay = $("a", td).html();
            inst.selectedMonth = inst.currentMonth = month;
            inst.selectedYear = inst.currentYear = year;
            this._selectDate(id, this._formatDate(inst,
                    inst.currentDay, inst.currentMonth, inst.currentYear));
        },
        /* Erase the input field and hide the date picker. */
        _clearDate: function (id) {
            var target = $(id);
            this._selectDate(target, "");
        },
        /* Update the input field with the selected date. */
        _selectDate: function (id, dateStr) {
            var onSelect,
                    target = $(id),
                    inst = this._getInst(target[0]);

            dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
            if (inst.input) {
                inst.input.val(dateStr);
            }
            this._updateAlternate(inst);

            onSelect = this._get(inst, "onSelect");
            if (onSelect) {
                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
            } else if (inst.input) {
                inst.input.trigger("change"); // fire the change event
            }

            if (inst.inline) {
                this._updateDatepicker(inst);
            } else {
                this._hideDatepicker();
                this._lastInput = inst.input[0];
                if (typeof (inst.input[0]) !== "object") {
                    inst.input.focus(); // restore focus
                }
                this._lastInput = null;
            }
        },
        /* Update any alternate field to synchronise with the main field. */
        _updateAlternate: function (inst) {
            var altFormat, date, dateStr,
                    altField = this._get(inst, "altField");

            if (altField) { // update alternate field too
                altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
                date = this._getDate(inst);
                dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
                $(altField).each(function () {
                    $(this).val(dateStr);
                });
            }
        },
        /* Set as beforeShowDay function to prevent selection of weekends.
         * @param  date  Date - the date to customise
         * @return [boolean, string] - is this date selectable?, what is its CSS class?
         */
        noWeekends: function (date) {
            var day = date.getDay();
            return [(day > 0 && day < 6), ""];
        },
        /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
         * @param  date  Date - the date to get the week for
         * @return  number - the number of the week within the year that contains this date
         */
        iso8601Week: function (date) {
            var time,
                    checkDate = new Date(date.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        /* Parse a string value into a date object.
         * See formatDate below for the possible formats.
         *
         * @param  format string - the expected format of the date
         * @param  value string - the date in the above format
         * @param  settings Object - attributes include:
         *                  shortYearCutoff  number - the cutoff year for determining the century (optional)
         *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
         *                  dayNames        string[7] - names of the days from Sunday (optional)
         *                  monthNamesShort string[12] - abbreviated names of the months (optional)
         *                  monthNames      string[12] - names of the months (optional)
         * @return  Date - the extracted date value or null if value is blank
         */
        parseDate: function (format, value, settings) {
            if (format == null || value == null) {
                throw "Invalid arguments";
            }

            value = (typeof value === "object" ? value.toString() : value + "");
            if (value === "") {
                return null;
            }

            var iFormat, dim, extra,
                    iValue = 0,
                    shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                    shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
                            new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
                    dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                    dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                    monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                    monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                    year = -1,
                    month = -1,
                    day = -1,
                    doy = -1,
                    literal = false,
                    date,
                    // Check whether a format character is doubled
                    lookAhead = function (match) {
                        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                        if (matches) {
                            iFormat++;
                        }
                        return matches;
                    },
                    // Extract a number from the string value
                    getNumber = function (match) {
                        var isDoubled = lookAhead(match),
                                size = (match === "@" ? 14 : (match === "!" ? 20 :
                                        (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                                digits = new RegExp("^\\d{1," + size + "}"),
                                num = value.substring(iValue).match(digits);
                        if (!num) {
                            throw "Missing number at position " + iValue;
                        }
                        iValue += num[0].length;
                        return parseInt(num[0], 10);
                    },
                    // Extract a name from the string value and convert to an index
                    getName = function (match, shortNames, longNames) {
                        var index = -1,
                                names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                                    return [[k, v]];
                                }).sort(function (a, b) {
                            return -(a[1].length - b[1].length);
                        });

                        $.each(names, function (i, pair) {
                            var name = pair[1];
                            if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                                index = pair[0];
                                iValue += name.length;
                                return false;
                            }
                        });
                        if (index !== -1) {
                            return index + 1;
                        } else {
                            throw "Unknown name at position " + iValue;
                        }
                    },
                    // Confirm that a literal character matches the string value
                    checkLiteral = function () {
                        if (value.charAt(iValue) !== format.charAt(iFormat)) {
                            throw "Unexpected literal at position " + iValue;
                        }
                        iValue++;
                    };

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        checkLiteral();
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            day = getNumber("d");
                            break;
                        case "D":
                            getName("D", dayNamesShort, dayNames);
                            break;
                        case "o":
                            doy = getNumber("o");
                            break;
                        case "m":
                            month = getNumber("m");
                            break;
                        case "M":
                            month = getName("M", monthNamesShort, monthNames);
                            break;
                        case "y":
                            year = getNumber("y");
                            break;
                        case "@":
                            date = new Date(getNumber("@"));
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case "!":
                            date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                checkLiteral();
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            checkLiteral();
                    }
                }
            }

            if (iValue < value.length) {
                extra = value.substr(iValue);
                if (!/^\s+/.test(extra)) {
                    throw "Extra/unparsed characters found in date: " + extra;
                }
            }

            if (year === -1) {
                year = new Date().getFullYear();
            } else if (year < 100) {
                year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                        (year <= shortYearCutoff ? 0 : -100);
            }

            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    dim = this._getDaysInMonth(year, month - 1);
                    if (day <= dim) {
                        break;
                    }
                    month++;
                    day -= dim;
                } while (true);
            }

            date = this._daylightSavingAdjust(new Date(year, month - 1, day));
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw "Invalid date"; // E.g. 31/02/00
            }
            return date;
        },
        /* Standard date formats. */
        ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y", // RFC 822
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd", // ISO 8601

        _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
                Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),
        /* Format a date object into a string value.
         * The format can be combinations of the following:
         * d  - day of month (no leading zero)
         * dd - day of month (two digit)
         * o  - day of year (no leading zeros)
         * oo - day of year (three digit)
         * D  - day name short
         * DD - day name long
         * m  - month of year (no leading zero)
         * mm - month of year (two digit)
         * M  - month name short
         * MM - month name long
         * y  - year (two digit)
         * yy - year (four digit)
         * @ - Unix timestamp (ms since 01/01/1970)
         * ! - Windows ticks (100ns since 01/01/0001)
         * "..." - literal text
         * '' - single quote
         *
         * @param  format string - the desired format of the date
         * @param  date Date - the date value to format
         * @param  settings Object - attributes include:
         *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
         *                  dayNames        string[7] - names of the days from Sunday (optional)
         *                  monthNamesShort string[12] - abbreviated names of the months (optional)
         *                  monthNames      string[12] - names of the months (optional)
         * @return  string - the date in the above format
         */
        formatDate: function (format, date, settings) {
            if (!date) {
                return "";
            }

            var iFormat,
                    dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                    dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                    monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                    monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                    // Check whether a format character is doubled
                    lookAhead = function (match) {
                        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                        if (matches) {
                            iFormat++;
                        }
                        return matches;
                    },
                    // Format a number, with leading zero if necessary
                    formatNumber = function (match, value, len) {
                        var num = "" + value;
                        if (lookAhead(match)) {
                            while (num.length < len) {
                                num = "0" + num;
                            }
                        }
                        return num;
                    },
                    // Format a name, short or long as requested
                    formatName = function (match, value, shortNames, longNames) {
                        return (lookAhead(match) ? longNames[value] : shortNames[value]);
                    },
                    output = "",
                    literal = false;

            if (date) {
                for (iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal) {
                        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                            literal = false;
                        } else {
                            output += format.charAt(iFormat);
                        }
                    } else {
                        switch (format.charAt(iFormat)) {
                            case "d":
                                output += formatNumber("d", date.getDate(), 2);
                                break;
                            case "D":
                                output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                                break;
                            case "o":
                                output += formatNumber("o",
                                        Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                                break;
                            case "m":
                                output += formatNumber("m", date.getMonth() + 1, 2);
                                break;
                            case "M":
                                output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                                break;
                            case "y":
                                output += (lookAhead("y") ? date.getFullYear() :
                                        (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                                break;
                            case "@":
                                output += date.getTime();
                                break;
                            case "!":
                                output += date.getTime() * 10000 + this._ticksTo1970;
                                break;
                            case "'":
                                if (lookAhead("'")) {
                                    output += "'";
                                } else {
                                    literal = true;
                                }
                                break;
                            default:
                                output += format.charAt(iFormat);
                        }
                    }
                }
            }
            return output;
        },
        /* Extract all possible characters from the date format. */
        _possibleChars: function (format) {
            var iFormat,
                    chars = "",
                    literal = false,
                    // Check whether a format character is doubled
                    lookAhead = function (match) {
                        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                        if (matches) {
                            iFormat++;
                        }
                        return matches;
                    };

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        chars += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                        case "m":
                        case "y":
                        case "@":
                            chars += "0123456789";
                            break;
                        case "D":
                        case "M":
                            return null; // Accept anything
                        case "'":
                            if (lookAhead("'")) {
                                chars += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            chars += format.charAt(iFormat);
                    }
                }
            }
            return chars;
        },
        /* Get a setting value, defaulting if necessary. */
        _get: function (inst, name) {
            return inst.settings[name] !== undefined ?
                    inst.settings[name] : this._defaults[name];
        },
        /* Parse existing date and initialise date picker. */
        _setDateFromField: function (inst, noDefault) {
            if (inst.input.val() === inst.lastVal) {
                return;
            }

            var dateFormat = this._get(inst, "dateFormat"),
                    dates = inst.lastVal = inst.input ? inst.input.val() : null,
                    defaultDate = this._getDefaultDate(inst),
                    date = defaultDate,
                    settings = this._getFormatConfig(inst);

            try {
                date = this.parseDate(dateFormat, dates, settings) || defaultDate;
            } catch (event) {
                dates = (noDefault ? "" : dates);
            }
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            inst.currentDay = (dates ? date.getDate() : 0);
            inst.currentMonth = (dates ? date.getMonth() : 0);
            inst.currentYear = (dates ? date.getFullYear() : 0);
            this._adjustInstDate(inst);
        },
        /* Retrieve the default date shown on opening. */
        _getDefaultDate: function (inst) {
            return this._restrictMinMax(inst,
                    this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
        },
        /* A date may be specified as an exact value or a relative one. */
        _determineDate: function (inst, date, defaultDate) {
            var offsetNumeric = function (offset) {
                var date = new Date();
                date.setDate(date.getDate() + offset);
                return date;
            },
                    offsetString = function (offset) {
                        try {
                            return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                                    offset, $.datepicker._getFormatConfig(inst));
                        } catch (e) {
                            // Ignore
                        }

                        var date = (offset.toLowerCase().match(/^c/) ?
                                $.datepicker._getDate(inst) : null) || new Date(),
                                year = date.getFullYear(),
                                month = date.getMonth(),
                                day = date.getDate(),
                                pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                                matches = pattern.exec(offset);

                        while (matches) {
                            switch (matches[2] || "d") {
                                case "d" :
                                case "D" :
                                    day += parseInt(matches[1], 10);
                                    break;
                                case "w" :
                                case "W" :
                                    day += parseInt(matches[1], 10) * 7;
                                    break;
                                case "m" :
                                case "M" :
                                    month += parseInt(matches[1], 10);
                                    day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                                    break;
                                case "y":
                                case "Y" :
                                    year += parseInt(matches[1], 10);
                                    day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                                    break;
                            }
                            matches = pattern.exec(offset);
                        }
                        return new Date(year, month, day);
                    },
                    newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
                            (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

            newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
            if (newDate) {
                newDate.setHours(0);
                newDate.setMinutes(0);
                newDate.setSeconds(0);
                newDate.setMilliseconds(0);
            }
            return this._daylightSavingAdjust(newDate);
        },
        /* Handle switch to/from daylight saving.
         * Hours may be non-zero on daylight saving cut-over:
         * > 12 when midnight changeover, but then cannot generate
         * midnight datetime, so jump to 1AM, otherwise reset.
         * @param  date  (Date) the date to check
         * @return  (Date) the corrected date
         */
        _daylightSavingAdjust: function (date) {
            if (!date) {
                return null;
            }
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },
        /* Set the date(s) directly. */
        _setDate: function (inst, date, noChange) {
            var clear = !date,
                    origMonth = inst.selectedMonth,
                    origYear = inst.selectedYear,
                    newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

            inst.selectedDay = inst.currentDay = newDate.getDate();
            inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
            inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
            if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
                this._notifyChange(inst);
            }
            this._adjustInstDate(inst);
            if (inst.input) {
                inst.input.val(clear ? "" : this._formatDate(inst));
            }
        },
        /* Retrieve the date(s) directly. */
        _getDate: function (inst) {
            var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
                    this._daylightSavingAdjust(new Date(
                            inst.currentYear, inst.currentMonth, inst.currentDay)));
            return startDate;
        },
        /* Attach the onxxx handlers.  These are declared statically so
         * they work with static code transformers like Caja.
         */
        _attachHandlers: function (inst) {
            var stepMonths = this._get(inst, "stepMonths"),
                    id = "#" + inst.id.replace(/\\\\/g, "\\");
            inst.dpDiv.find("[data-handler]").map(function () {
                var handler = {
                    prev: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(id, -stepMonths, "M");
                    },
                    next: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(id, +stepMonths, "M");
                    },
                    hide: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._hideDatepicker();
                    },
                    today: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._gotoToday(id);
                    },
                    selectDay: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
                        return false;
                    },
                    selectMonth: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(id, this, "M");
                        return false;
                    },
                    selectYear: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(id, this, "Y");
                        return false;
                    }
                };
                $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
            });
        },
        /* Generate the HTML for the current state of the date picker. */
        _generateHTML: function (inst) {
            var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
                    controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
                    monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
                    selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
                    cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
                    printDate, dRow, tbody, daySettings, otherMonth, unselectable,
                    tempDate = new Date(),
                    today = this._daylightSavingAdjust(
                            new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
                    isRTL = this._get(inst, "isRTL"),
                    showButtonPanel = this._get(inst, "showButtonPanel"),
                    hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
                    navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
                    numMonths = this._getNumberOfMonths(inst),
                    showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
                    stepMonths = this._get(inst, "stepMonths"),
                    isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
                    currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
                            new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
                    minDate = this._getMinMaxDate(inst, "min"),
                    maxDate = this._getMinMaxDate(inst, "max"),
                    drawMonth = inst.drawMonth - showCurrentAtPos,
                    drawYear = inst.drawYear;

            if (drawMonth < 0) {
                drawMonth += 12;
                drawYear--;
            }
            if (maxDate) {
                maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
                        maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
                maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
                while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                    drawMonth--;
                    if (drawMonth < 0) {
                        drawMonth = 11;
                        drawYear--;
                    }
                }
            }
            inst.drawMonth = drawMonth;
            inst.drawYear = drawYear;

            prevText = this._get(inst, "prevText");
            prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
                    this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
                    this._getFormatConfig(inst)));

            prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
                    "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
                    " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
                    (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

            nextText = this._get(inst, "nextText");
            nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
                    this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
                    this._getFormatConfig(inst)));

            next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
                    "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
                    " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
                    (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

            currentText = this._get(inst, "currentText");
            gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
            currentText = (!navigationAsDateFormat ? currentText :
                    this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

            controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
                    this._get(inst, "closeText") + "</button>" : "");

            buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
                    (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
                            ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

            firstDay = parseInt(this._get(inst, "firstDay"), 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);

            showWeek = this._get(inst, "showWeek");
            dayNames = this._get(inst, "dayNames");
            dayNamesMin = this._get(inst, "dayNamesMin");
            monthNames = this._get(inst, "monthNames");
            monthNamesShort = this._get(inst, "monthNamesShort");
            beforeShowDay = this._get(inst, "beforeShowDay");
            showOtherMonths = this._get(inst, "showOtherMonths");
            selectOtherMonths = this._get(inst, "selectOtherMonths");
            defaultDate = this._getDefaultDate(inst);
            html = "";
            dow;
            for (row = 0; row < numMonths[0]; row++) {
                group = "";
                this.maxRows = 4;
                for (col = 0; col < numMonths[1]; col++) {
                    selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
                    cornerClass = " ui-corner-all";
                    calender = "";
                    if (isMultiMonth) {
                        calender += "<div class='ui-datepicker-group";
                        if (numMonths[1] > 1) {
                            switch (col) {
                                case 0:
                                    calender += " ui-datepicker-group-first";
                                    cornerClass = " ui-corner-" + (isRTL ? "right" : "left");
                                    break;
                                case numMonths[1] - 1:
                                    calender += " ui-datepicker-group-last";
                                    cornerClass = " ui-corner-" + (isRTL ? "left" : "right");
                                    break;
                                default:
                                    calender += " ui-datepicker-group-middle";
                                    cornerClass = "";
                                    break;
                            }
                        }
                        calender += "'>";
                    }
                    calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
                            (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
                            (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
                            this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
                                    row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
                            "</div><table class='ui-datepicker-calendar'><thead>" +
                            "<tr>";
                    thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
                    for (dow = 0; dow < 7; dow++) { // days of the week
                        day = (dow + firstDay) % 7;
                        thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                                "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
                    }
                    calender += thead + "</tr></thead><tbody>";
                    daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                    if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                        inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                    }
                    leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                    curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                    numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
                    this.maxRows = numRows;
                    printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                    for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        calender += "<tr>";
                        tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
                                this._get(inst, "calculateWeek")(printDate) + "</td>");
                        for (dow = 0; dow < 7; dow++) { // create date picker days
                            daySettings = (beforeShowDay ?
                                    beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
                            otherMonth = (printDate.getMonth() !== drawMonth);
                            unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
                                    (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                            tbody += "<td class='" +
                                    ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                                    (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                                    ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
                                            (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                                            // or defaultDate is current printedDate and defaultDate is selectedDate
                                            " " + this._dayOverClass : "") + // highlight selected day
                                    (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") + // highlight unselectable days
                                    (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
                                            (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
                                            (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
                                    ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
                                    (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                                    (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
                                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                                                    (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                                    (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                                                    (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                                                    "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                            printDate.setDate(printDate.getDate() + 1);
                            printDate = this._daylightSavingAdjust(printDate);
                        }
                        calender += tbody + "</tr>";
                    }
                    drawMonth++;
                    if (drawMonth > 11) {
                        drawMonth = 0;
                        drawYear++;
                    }
                    calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
                            ((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                    group += calender;
                }
                html += group;
            }
            html += buttonPanel;
            inst._keyEvent = false;
            return html;
        },
        /* Generate the month and year header. */
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
                secondary, monthNames, monthNamesShort) {

            var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
                    changeMonth = this._get(inst, "changeMonth"),
                    changeYear = this._get(inst, "changeYear"),
                    showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
                    html = "<div class='ui-datepicker-title'>",
                    monthHtml = "";

            // month selection
            if (secondary || !changeMonth) {
                monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
            } else {
                inMinYear = (minDate && minDate.getFullYear() === drawYear);
                inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
                monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
                for (month = 0; month < 12; month++) {
                    if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                        monthHtml += "<option value='" + month + "'" +
                                (month === drawMonth ? " selected='selected'" : "") +
                                ">" + monthNamesShort[month] + "</option>";
                    }
                }
                monthHtml += "</select>";
            }

            if (!showMonthAfterYear) {
                html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
            }

            // year selection
            if (!inst.yearshtml) {
                inst.yearshtml = "";
                if (secondary || !changeYear) {
                    html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
                } else {
                    // determine range of years to display
                    years = this._get(inst, "yearRange").split(":");
                    thisYear = new Date().getFullYear();
                    determineYear = function (value) {
                        var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
                                (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
                                        parseInt(value, 10)));
                        return (isNaN(year) ? thisYear : year);
                    };
                    year = determineYear(years[0]);
                    endYear = Math.max(year, determineYear(years[1] || ""));
                    year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                    endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                    inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                    for (; year <= endYear; year++) {
                        inst.yearshtml += "<option value='" + year + "'" +
                                (year === drawYear ? " selected='selected'" : "") +
                                ">" + year + "</option>";
                    }
                    inst.yearshtml += "</select>";

                    html += inst.yearshtml;
                    inst.yearshtml = null;
                }
            }

            html += this._get(inst, "yearSuffix");
            if (showMonthAfterYear) {
                html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
            }
            html += "</div>"; // Close datepicker_header
            return html;
        },
        /* Adjust one of the date sub-fields. */
        _adjustInstDate: function (inst, offset, period) {
            var year = inst.drawYear + (period === "Y" ? offset : 0),
                    month = inst.drawMonth + (period === "M" ? offset : 0),
                    day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
                    date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            if (period === "M" || period === "Y") {
                this._notifyChange(inst);
            }
        },
        /* Ensure a date is within any min/max bounds. */
        _restrictMinMax: function (inst, date) {
            var minDate = this._getMinMaxDate(inst, "min"),
                    maxDate = this._getMinMaxDate(inst, "max"),
                    newDate = (minDate && date < minDate ? minDate : date);
            return (maxDate && newDate > maxDate ? maxDate : newDate);
        },
        /* Notify change of month/year. */
        _notifyChange: function (inst) {
            var onChange = this._get(inst, "onChangeMonthYear");
            if (onChange) {
                onChange.apply((inst.input ? inst.input[0] : null),
                        [inst.selectedYear, inst.selectedMonth + 1, inst]);
            }
        },
        /* Determine the number of months to show. */
        _getNumberOfMonths: function (inst) {
            var numMonths = this._get(inst, "numberOfMonths");
            return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
        },
        /* Determine the current maximum date - ensure no time components are set. */
        _getMinMaxDate: function (inst, minMax) {
            return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
        },
        /* Find the number of days in a given month. */
        _getDaysInMonth: function (year, month) {
            return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
        },
        /* Find the day of the week of the first of a month. */
        _getFirstDayOfMonth: function (year, month) {
            return new Date(year, month, 1).getDay();
        },
        /* Determines if we should allow a "next/prev" month display change. */
        _canAdjustMonth: function (inst, offset, curYear, curMonth) {
            var numMonths = this._getNumberOfMonths(inst),
                    date = this._daylightSavingAdjust(new Date(curYear,
                            curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

            if (offset < 0) {
                date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
            }
            return this._isInRange(inst, date);
        },
        /* Is the given date in the accepted range? */
        _isInRange: function (inst, date) {
            var yearSplit, currentYear,
                    minDate = this._getMinMaxDate(inst, "min"),
                    maxDate = this._getMinMaxDate(inst, "max"),
                    minYear = null,
                    maxYear = null,
                    years = this._get(inst, "yearRange");
            if (years) {
                yearSplit = years.split(":");
                currentYear = new Date().getFullYear();
                minYear = parseInt(yearSplit[0], 10);
                maxYear = parseInt(yearSplit[1], 10);
                if (yearSplit[0].match(/[+\-].*/)) {
                    minYear += currentYear;
                }
                if (yearSplit[1].match(/[+\-].*/)) {
                    maxYear += currentYear;
                }
            }

            return ((!minDate || date.getTime() >= minDate.getTime()) &&
                    (!maxDate || date.getTime() <= maxDate.getTime()) &&
                    (!minYear || date.getFullYear() >= minYear) &&
                    (!maxYear || date.getFullYear() <= maxYear));
        },
        /* Provide the configuration settings for formatting/parsing. */
        _getFormatConfig: function (inst) {
            var shortYearCutoff = this._get(inst, "shortYearCutoff");
            shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
                    new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
            return {shortYearCutoff: shortYearCutoff,
                dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
                monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
        },
        /* Format the given date for display. */
        _formatDate: function (inst, day, month, year) {
            if (!day) {
                inst.currentDay = inst.selectedDay;
                inst.currentMonth = inst.selectedMonth;
                inst.currentYear = inst.selectedYear;
            }
            var date = (day ? (typeof day === "object" ? day :
                    this._daylightSavingAdjust(new Date(year, month, day))) :
                    this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
            return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
        }
    });

    /*
     * Bind hover events for datepicker elements.
     * Done via delegate so the binding only occurs once in the lifetime of the parent div.
     * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
     */
    function bindHover(dpDiv) {
        var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return dpDiv.delegate(selector, "mouseout", function () {
            $(this).removeClass("ui-state-hover");
            if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                $(this).removeClass("ui-datepicker-prev-hover");
            }
            if (this.className.indexOf("ui-datepicker-next") !== -1) {
                $(this).removeClass("ui-datepicker-next-hover");
            }
        })
                .delegate(selector, "mouseover", function () {
                    if (!$.datepicker._isDisabledDatepicker(instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
                        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                        $(this).addClass("ui-state-hover");
                        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                            $(this).addClass("ui-datepicker-prev-hover");
                        }
                        if (this.className.indexOf("ui-datepicker-next") !== -1) {
                            $(this).addClass("ui-datepicker-next-hover");
                        }
                    }
                });
    }

    /* jQuery extend now ignores nulls! */
    function extendRemove(target, props) {
        $.extend(target, props);
        for (var name in props) {
            if (props[name] == null) {
                target[name] = props[name];
            }
        }
        return target;
    }

    /* Invoke the datepicker functionality.
     @param  options  string - a command, optionally followed by additional parameters or
     Object - settings for attaching new datepicker functionality
     @return  jQuery object */
    $.fn.datepicker = function (options) {

        /* Verify an empty collection wasn't passed - Fixes #6976 */
        if (!this.length) {
            return this;
        }

        /* Initialise the date picker. */
        if (!$.datepicker.initialized) {
            $(document).mousedown($.datepicker._checkExternalClick);
            $.datepicker.initialized = true;
        }

        /* Append datepicker main container to body if not exist. */
        if ($("#" + $.datepicker._mainDivId).length === 0) {
            $("body").append($.datepicker.dpDiv);
        }

        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
            return $.datepicker["_" + options + "Datepicker"].
                    apply($.datepicker, [this[0]].concat(otherArgs));
        }
        if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
            return $.datepicker["_" + options + "Datepicker"].
                    apply($.datepicker, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            typeof options === "string" ?
                    $.datepicker["_" + options + "Datepicker"].
                    apply($.datepicker, [this].concat(otherArgs)) :
                    $.datepicker._attachDatepicker(this, options);
        });
    };

    $.datepicker = new Datepicker(); // singleton instance
    $.datepicker.initialized = false;
    $.datepicker.uuid = new Date().getTime();
    $.datepicker.version = "1.10.2";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;

})(jQuery);

(function ($, undefined) {

    var sizeRelatedOptions = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    },
    resizableRelatedOptions = {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    };

    $.widget("ui.dialog", {
        version: "1.10.2",
        options: {
            appendTo: "body",
            autoOpen: true,
            buttons: [],
            closeOnEscape: true,
            closeText: "close",
            dialogClass: "",
            draggable: true,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: false,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                // Ensure the titlebar is always visible
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    if (topOffset < 0) {
                        $(this).css("top", pos.top - topOffset);
                    }
                }
            },
            resizable: true,
            show: null,
            title: null,
            width: 300,
            // callbacks
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        _create: function () {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            };
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            };
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;

            this._createWrapper();

            this.element
                    .show()
                    .removeAttr("title")
                    .addClass("ui-dialog-content ui-widget-content")
                    .appendTo(this.uiDialog);

            this._createTitlebar();
            this._createButtonPane();

            if (this.options.draggable && $.fn.draggable) {
                this._makeDraggable();
            }
            if (this.options.resizable && $.fn.resizable) {
                this._makeResizable();
            }

            this._isOpen = false;
        },
        _init: function () {
            if (this.options.autoOpen) {
                this.open();
            }
        },
        _appendTo: function () {
            var element = this.options.appendTo;
            if (element && (element.jquery || element.nodeType)) {
                return $(element);
            }
            return this.document.find(element || "body").eq(0);
        },
        _destroy: function () {
            var next,
                    originalPosition = this.originalPosition;

            this._destroyOverlay();

            this.element
                    .removeUniqueId()
                    .removeClass("ui-dialog-content ui-widget-content")
                    .css(this.originalCss)
                    // Without detaching first, the following becomes really slow
                    .detach();

            this.uiDialog.stop(true, true).remove();

            if (this.originalTitle) {
                this.element.attr("title", this.originalTitle);
            }

            next = originalPosition.parent.children().eq(originalPosition.index);
            // Don't try to place the dialog next to itself (#8613)
            if (next.length && next[0] !== this.element[0]) {
                next.before(this.element);
            } else {
                originalPosition.parent.append(this.element);
            }
        },
        widget: function () {
            return this.uiDialog;
        },
        disable: $.noop,
        enable: $.noop,
        close: function (event) {
            var that = this;

            if (!this._isOpen || this._trigger("beforeClose", event) === false) {
                return;
            }

            this._isOpen = false;
            this._destroyOverlay();

            if (!this.opener.filter(":focusable").focus().length) {
                // Hiding a focused element doesn't trigger blur in WebKit
                // so in case we have nothing to focus on, explicitly blur the active element
                // https://bugs.webkit.org/show_bug.cgi?id=47182
                $(this.document[0].activeElement).blur();
            }

            this._hide(this.uiDialog, this.options.hide, function () {
                that._trigger("close", event);
            });
        },
        isOpen: function () {
            return this._isOpen;
        },
        moveToTop: function () {
            this._moveToTop();
        },
        _moveToTop: function (event, silent) {
            var moved = !!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;
            if (moved && !silent) {
                this._trigger("focus", event);
            }
            return moved;
        },
        open: function () {
            var that = this;
            if (this._isOpen) {
                if (this._moveToTop()) {
                    this._focusTabbable();
                }
                return;
            }

            this._isOpen = true;
            this.opener = $(this.document[0].activeElement);

            this._size();
            this._position();
            this._createOverlay();
            this._moveToTop(null, true);
            this._show(this.uiDialog, this.options.show, function () {
                that._focusTabbable();
                that._trigger("focus");
            });

            this._trigger("open");
        },
        _focusTabbable: function () {
            // Set focus to the first match:
            // 1. First element inside the dialog matching [autofocus]
            // 2. Tabbable element inside the content element
            // 3. Tabbable element inside the buttonpane
            // 4. The close button
            // 5. The dialog itself
            var hasFocus = this.element.find("[autofocus]");
            if (!hasFocus.length) {
                hasFocus = this.element.find(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialogButtonPane.find(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialog;
            }
            hasFocus.eq(0).focus();
        },
        _keepFocus: function (event) {
            function checkFocus() {
                var activeElement = this.document[0].activeElement,
                        isActive = this.uiDialog[0] === activeElement ||
                        $.contains(this.uiDialog[0], activeElement);
                if (!isActive) {
                    this._focusTabbable();
                }
            }
            event.preventDefault();
            checkFocus.call(this);
            // support: IE
            // IE <= 8 doesn't prevent moving focus even with event.preventDefault()
            // so we check again later
            this._delay(checkFocus);
        },
        _createWrapper: function () {
            this.uiDialog = $("<div>")
                    .addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " +
                            this.options.dialogClass)
                    .hide()
                    .attr({
                        // Setting tabIndex makes the div focusable
                        tabIndex: -1,
                        role: "dialog"
                    })
                    .appendTo(this._appendTo());

            this._on(this.uiDialog, {
                keydown: function (event) {
                    if (this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                            event.keyCode === $.ui.keyCode.ESCAPE) {
                        event.preventDefault();
                        this.close(event);
                        return;
                    }

                    // prevent tabbing out of dialogs
                    if (event.keyCode !== $.ui.keyCode.TAB) {
                        return;
                    }
                    var tabbables = this.uiDialog.find(":tabbable"),
                            first = tabbables.filter(":first"),
                            last = tabbables.filter(":last");

                    if ((event.target === last[0] || event.target === this.uiDialog[0]) && !event.shiftKey) {
                        first.focus(1);
                        event.preventDefault();
                    } else if ((event.target === first[0] || event.target === this.uiDialog[0]) && event.shiftKey) {
                        last.focus(1);
                        event.preventDefault();
                    }
                },
                mousedown: function (event) {
                    if (this._moveToTop(event)) {
                        this._focusTabbable();
                    }
                }
            });

            // We assume that any existing aria-describedby attribute means
            // that the dialog content is marked up properly
            // otherwise we brute force the content as the description
            if (!this.element.find("[aria-describedby]").length) {
                this.uiDialog.attr({
                    "aria-describedby": this.element.uniqueId().attr("id")
                });
            }
        },
        _createTitlebar: function () {
            var uiDialogTitle;

            this.uiDialogTitlebar = $("<div>")
                    .addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix")
                    .prependTo(this.uiDialog);
            this._on(this.uiDialogTitlebar, {
                mousedown: function (event) {
                    // Don't prevent click on close button (#8838)
                    // Focusing a dialog that is partially scrolled out of view
                    // causes the browser to scroll it into view, preventing the click event
                    if (!$(event.target).closest(".ui-dialog-titlebar-close")) {
                        // Dialog isn't getting focus when dragging (#8063)
                        this.uiDialog.focus();
                    }
                }
            });

            this.uiDialogTitlebarClose = $("<button></button>")
                    .button({
                        label: this.options.closeText,
                        icons: {
                            primary: "ui-icon-closethick"
                        },
                        text: false
                    })
                    .addClass("ui-dialog-titlebar-close")
                    .appendTo(this.uiDialogTitlebar);
            this._on(this.uiDialogTitlebarClose, {
                click: function (event) {
                    event.preventDefault();
                    this.close(event);
                }
            });

            uiDialogTitle = $("<span>")
                    .uniqueId()
                    .addClass("ui-dialog-title")
                    .prependTo(this.uiDialogTitlebar);
            this._title(uiDialogTitle);

            this.uiDialog.attr({
                "aria-labelledby": uiDialogTitle.attr("id")
            });
        },
        _title: function (title) {
            if (!this.options.title) {
                title.html("&#160;");
            }
            title.text(this.options.title);
        },
        _createButtonPane: function () {
            this.uiDialogButtonPane = $("<div>")
                    .addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");

            this.uiButtonSet = $("<div>")
                    .addClass("ui-dialog-buttonset")
                    .appendTo(this.uiDialogButtonPane);

            this._createButtons();
        },
        _createButtons: function () {
            var that = this,
                    buttons = this.options.buttons;

            // if we already have a button pane, remove it
            this.uiDialogButtonPane.remove();
            this.uiButtonSet.empty();

            if ($.isEmptyObject(buttons) || ($.isArray(buttons) && !buttons.length)) {
                this.uiDialog.removeClass("ui-dialog-buttons");
                return;
            }

            $.each(buttons, function (name, props) {
                var click, buttonOptions;
                props = $.isFunction(props) ?
                        {click: props, text: name} :
                        props;
                // Default to a non-submitting button
                props = $.extend({type: "button"}, props);
                // Change the context for the click callback to be the main element
                click = props.click;
                props.click = function () {
                    click.apply(that.element[0], arguments);
                };
                buttonOptions = {
                    icons: props.icons,
                    text: props.showText
                };
                delete props.icons;
                delete props.showText;
                $("<button></button>", props)
                        .button(buttonOptions)
                        .appendTo(that.uiButtonSet);
            });
            this.uiDialog.addClass("ui-dialog-buttons");
            this.uiDialogButtonPane.appendTo(this.uiDialog);
        },
        _makeDraggable: function () {
            var that = this,
                    options = this.options;

            function filteredUi(ui) {
                return {
                    position: ui.position,
                    offset: ui.offset
                };
            }

            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function (event, ui) {
                    $(this).addClass("ui-dialog-dragging");
                    that._blockFrames();
                    that._trigger("dragStart", event, filteredUi(ui));
                },
                drag: function (event, ui) {
                    that._trigger("drag", event, filteredUi(ui));
                },
                stop: function (event, ui) {
                    options.position = [
                        ui.position.left - that.document.scrollLeft(),
                        ui.position.top - that.document.scrollTop()
                    ];
                    $(this).removeClass("ui-dialog-dragging");
                    that._unblockFrames();
                    that._trigger("dragStop", event, filteredUi(ui));
                }
            });
        },
        _makeResizable: function () {
            var that = this,
                    options = this.options,
                    handles = options.resizable,
                    // .ui-resizable has position: relative defined in the stylesheet
                    // but dialogs have to use absolute or fixed positioning
                    position = this.uiDialog.css("position"),
                    resizeHandles = typeof handles === "string" ?
                    handles :
                    "n,e,s,w,se,sw,ne,nw";

            function filteredUi(ui) {
                return {
                    originalPosition: ui.originalPosition,
                    originalSize: ui.originalSize,
                    position: ui.position,
                    size: ui.size
                };
            }

            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                minWidth: options.minWidth,
                minHeight: this._minHeight(),
                handles: resizeHandles,
                start: function (event, ui) {
                    $(this).addClass("ui-dialog-resizing");
                    that._blockFrames();
                    that._trigger("resizeStart", event, filteredUi(ui));
                },
                resize: function (event, ui) {
                    that._trigger("resize", event, filteredUi(ui));
                },
                stop: function (event, ui) {
                    options.height = $(this).height();
                    options.width = $(this).width();
                    $(this).removeClass("ui-dialog-resizing");
                    that._unblockFrames();
                    that._trigger("resizeStop", event, filteredUi(ui));
                }
            })
                    .css("position", position);
        },
        _minHeight: function () {
            var options = this.options;

            return options.height === "auto" ?
                    options.minHeight :
                    Math.min(options.minHeight, options.height);
        },
        _position: function () {
            // Need to show the dialog to get the actual offset in the position plugin
            var isVisible = this.uiDialog.is(":visible");
            if (!isVisible) {
                this.uiDialog.show();
            }
            this.uiDialog.position(this.options.position);
            if (!isVisible) {
                this.uiDialog.hide();
            }
        },
        _setOptions: function (options) {
            var that = this,
                    resize = false,
                    resizableOptions = {};

            $.each(options, function (key, value) {
                that._setOption(key, value);

                if (key in sizeRelatedOptions) {
                    resize = true;
                }
                if (key in resizableRelatedOptions) {
                    resizableOptions[ key ] = value;
                }
            });

            if (resize) {
                this._size();
                this._position();
            }
            if (this.uiDialog.is(":data(ui-resizable)")) {
                this.uiDialog.resizable("option", resizableOptions);
            }
        },
        _setOption: function (key, value) {
            /*jshint maxcomplexity:15*/
            var isDraggable, isResizable,
                    uiDialog = this.uiDialog;

            if (key === "dialogClass") {
                uiDialog
                        .removeClass(this.options.dialogClass)
                        .addClass(value);
            }

            if (key === "disabled") {
                return;
            }

            this._super(key, value);

            if (key === "appendTo") {
                this.uiDialog.appendTo(this._appendTo());
            }

            if (key === "buttons") {
                this._createButtons();
            }

            if (key === "closeText") {
                this.uiDialogTitlebarClose.button({
                    // Ensure that we always pass a string
                    label: "" + value
                });
            }

            if (key === "draggable") {
                isDraggable = uiDialog.is(":data(ui-draggable)");
                if (isDraggable && !value) {
                    uiDialog.draggable("destroy");
                }

                if (!isDraggable && value) {
                    this._makeDraggable();
                }
            }

            if (key === "position") {
                this._position();
            }

            if (key === "resizable") {
                // currently resizable, becoming non-resizable
                isResizable = uiDialog.is(":data(ui-resizable)");
                if (isResizable && !value) {
                    uiDialog.resizable("destroy");
                }

                // currently resizable, changing handles
                if (isResizable && typeof value === "string") {
                    uiDialog.resizable("option", "handles", value);
                }

                // currently non-resizable, becoming resizable
                if (!isResizable && value !== false) {
                    this._makeResizable();
                }
            }

            if (key === "title") {
                this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
            }
        },
        _size: function () {
            // If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
            // divs will both have width and height set, so we need to reset them
            var nonContentHeight, minContentHeight, maxContentHeight,
                    options = this.options;

            // Reset content sizing
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            });

            if (options.minWidth > options.width) {
                options.width = options.minWidth;
            }

            // reset wrapper sizing
            // determine the height of all the non-content elements
            nonContentHeight = this.uiDialog.css({
                height: "auto",
                width: options.width
            })
                    .outerHeight();
            minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
            maxContentHeight = typeof options.maxHeight === "number" ?
                    Math.max(0, options.maxHeight - nonContentHeight) :
                    "none";

            if (options.height === "auto") {
                this.element.css({
                    minHeight: minContentHeight,
                    maxHeight: maxContentHeight,
                    height: "auto"
                });
            } else {
                this.element.height(Math.max(0, options.height - nonContentHeight));
            }

            if (this.uiDialog.is(":data(ui-resizable)")) {
                this.uiDialog.resizable("option", "minHeight", this._minHeight());
            }
        },
        _blockFrames: function () {
            this.iframeBlocks = this.document.find("iframe").map(function () {
                var iframe = $(this);

                return $("<div>")
                        .css({
                            position: "absolute",
                            width: iframe.outerWidth(),
                            height: iframe.outerHeight()
                        })
                        .appendTo(iframe.parent())
                        .offset(iframe.offset())[0];
            });
        },
        _unblockFrames: function () {
            if (this.iframeBlocks) {
                this.iframeBlocks.remove();
                delete this.iframeBlocks;
            }
        },
        _allowInteraction: function (event) {
            if ($(event.target).closest(".ui-dialog").length) {
                return true;
            }

            // TODO: Remove hack when datepicker implements
            // the .ui-front logic (#8989)
            return !!$(event.target).closest(".ui-datepicker").length;
        },
        _createOverlay: function () {
            if (!this.options.modal) {
                return;
            }

            var that = this,
                    widgetFullName = this.widgetFullName;
            if (!$.ui.dialog.overlayInstances) {
                // Prevent use of anchors and inputs.
                // We use a delay in case the overlay is created from an
                // event that we're going to be cancelling. (#2804)
                this._delay(function () {
                    // Handle .dialog().dialog("close") (#4065)
                    if ($.ui.dialog.overlayInstances) {
                        this.document.bind("focusin.dialog", function (event) {
                            if (!that._allowInteraction(event)) {
                                event.preventDefault();
                                $(".ui-dialog:visible:last .ui-dialog-content")
                                        .data(widgetFullName)._focusTabbable();
                            }
                        });
                    }
                });
            }

            this.overlay = $("<div>")
                    .addClass("ui-widget-overlay ui-front")
                    .appendTo(this._appendTo());
            this._on(this.overlay, {
                mousedown: "_keepFocus"
            });
            $.ui.dialog.overlayInstances++;
        },
        _destroyOverlay: function () {
            if (!this.options.modal) {
                return;
            }

            if (this.overlay) {
                $.ui.dialog.overlayInstances--;

                if (!$.ui.dialog.overlayInstances) {
                    this.document.unbind("focusin.dialog");
                }
                this.overlay.remove();
                this.overlay = null;
            }
        }
    });

    $.ui.dialog.overlayInstances = 0;

// DEPRECATED
    if ($.uiBackCompat !== false) {
        // position option with array notation
        // just override with old implementation
        $.widget("ui.dialog", $.ui.dialog, {
            _position: function () {
                var position = this.options.position,
                        myAt = [],
                        offset = [0, 0],
                        isVisible;

                if (position) {
                    if (typeof position === "string" || (typeof position === "object" && "0" in position)) {
                        myAt = position.split ? position.split(" ") : [position[0], position[1]];
                        if (myAt.length === 1) {
                            myAt[1] = myAt[0];
                        }

                        $.each(["left", "top"], function (i, offsetPosition) {
                            if (+myAt[ i ] === myAt[ i ]) {
                                offset[ i ] = myAt[ i ];
                                myAt[ i ] = offsetPosition;
                            }
                        });

                        position = {
                            my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
                                    myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
                            at: myAt.join(" ")
                        };
                    }

                    position = $.extend({}, $.ui.dialog.prototype.options.position, position);
                } else {
                    position = $.ui.dialog.prototype.options.position;
                }

                // need to show the dialog to get the actual offset in the position plugin
                isVisible = this.uiDialog.is(":visible");
                if (!isVisible) {
                    this.uiDialog.show();
                }
                this.uiDialog.position(position);
                if (!isVisible) {
                    this.uiDialog.hide();
                }
            }
        });
    }

}(jQuery));

(function ($, undefined) {

    var rvertical = /up|down|vertical/,
            rpositivemotion = /up|left|vertical|horizontal/;

    $.effects.effect.blind = function (o, done) {
        // Create element
        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "height", "width"],
                mode = $.effects.setMode(el, o.mode || "hide"),
                direction = o.direction || "up",
                vertical = rvertical.test(direction),
                ref = vertical ? "height" : "width",
                ref2 = vertical ? "top" : "left",
                motion = rpositivemotion.test(direction),
                animation = {},
                show = mode === "show",
                wrapper, distance, margin;

        // if already wrapped, the wrapper's properties are my property. #6245
        if (el.parent().is(".ui-effects-wrapper")) {
            $.effects.save(el.parent(), props);
        } else {
            $.effects.save(el, props);
        }
        el.show();
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });

        distance = wrapper[ ref ]();
        margin = parseFloat(wrapper.css(ref2)) || 0;

        animation[ ref ] = show ? distance : 0;
        if (!motion) {
            el
                    .css(vertical ? "bottom" : "right", 0)
                    .css(vertical ? "top" : "left", "auto")
                    .css({position: "absolute"});

            animation[ ref2 ] = show ? margin : distance + margin;
        }

        // start at 0 if we are showing
        if (show) {
            wrapper.css(ref, 0);
            if (!motion) {
                wrapper.css(ref2, margin + distance);
            }
        }

        // Animate
        wrapper.animate(animation, {
            duration: o.duration,
            easing: o.easing,
            queue: false,
            complete: function () {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.bounce = function (o, done) {
        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "height", "width"],
                // defaults:
                mode = $.effects.setMode(el, o.mode || "effect"),
                hide = mode === "hide",
                show = mode === "show",
                direction = o.direction || "up",
                distance = o.distance,
                times = o.times || 5,
                // number of internal animations
                anims = times * 2 + (show || hide ? 1 : 0),
                speed = o.duration / anims,
                easing = o.easing,
                // utility:
                ref = (direction === "up" || direction === "down") ? "top" : "left",
                motion = (direction === "up" || direction === "left"),
                i,
                upAnim,
                downAnim,
                // we will need to re-assemble the queue to stack our animations in place
                queue = el.queue(),
                queuelen = queue.length;

        // Avoid touching opacity to prevent clearType and PNG issues in IE
        if (show || hide) {
            props.push("opacity");
        }

        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el); // Create Wrapper

        // default distance for the BIGGEST bounce is the outer Distance / 3
        if (!distance) {
            distance = el[ ref === "top" ? "outerHeight" : "outerWidth" ]() / 3;
        }

        if (show) {
            downAnim = {opacity: 1};
            downAnim[ ref ] = 0;

            // if we are showing, force opacity 0 and set the initial position
            // then do the "first" animation
            el.css("opacity", 0)
                    .css(ref, motion ? -distance * 2 : distance * 2)
                    .animate(downAnim, speed, easing);
        }

        // start at the smallest distance if we are hiding
        if (hide) {
            distance = distance / Math.pow(2, times - 1);
        }

        downAnim = {};
        downAnim[ ref ] = 0;
        // Bounces up/down/left/right then back to 0 -- times * 2 animations happen here
        for (i = 0; i < times; i++) {
            upAnim = {};
            upAnim[ ref ] = (motion ? "-=" : "+=") + distance;

            el.animate(upAnim, speed, easing)
                    .animate(downAnim, speed, easing);

            distance = hide ? distance * 2 : distance / 2;
        }

        // Last Bounce when Hiding
        if (hide) {
            upAnim = {opacity: 0};
            upAnim[ ref ] = (motion ? "-=" : "+=") + distance;

            el.animate(upAnim, speed, easing);
        }

        el.queue(function () {
            if (hide) {
                el.hide();
            }
            $.effects.restore(el, props);
            $.effects.removeWrapper(el);
            done();
        });

        // inject all the animations we just queued to be first in line (after "inprogress")
        if (queuelen > 1) {
            queue.splice.apply(queue,
                    [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        el.dequeue();

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.clip = function (o, done) {
        // Create element
        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "height", "width"],
                mode = $.effects.setMode(el, o.mode || "hide"),
                show = mode === "show",
                direction = o.direction || "vertical",
                vert = direction === "vertical",
                size = vert ? "height" : "width",
                position = vert ? "top" : "left",
                animation = {},
                wrapper, animate, distance;

        // Save & Show
        $.effects.save(el, props);
        el.show();

        // Create Wrapper
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        animate = (el[0].tagName === "IMG") ? wrapper : el;
        distance = animate[ size ]();

        // Shift
        if (show) {
            animate.css(size, 0);
            animate.css(position, distance / 2);
        }

        // Create Animation Object:
        animation[ size ] = show ? distance : 0;
        animation[ position ] = show ? 0 : distance / 2;

        // Animate
        animate.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function () {
                if (!show) {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.drop = function (o, done) {

        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
                mode = $.effects.setMode(el, o.mode || "hide"),
                show = mode === "show",
                direction = o.direction || "left",
                ref = (direction === "up" || direction === "down") ? "top" : "left",
                motion = (direction === "up" || direction === "left") ? "pos" : "neg",
                animation = {
                    opacity: show ? 1 : 0
                },
        distance;

        // Adjust
        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);

        distance = o.distance || el[ ref === "top" ? "outerHeight" : "outerWidth" ](true) / 2;

        if (show) {
            el
                    .css("opacity", 0)
                    .css(ref, motion === "pos" ? -distance : distance);
        }

        // Animation
        animation[ ref ] = (show ?
                (motion === "pos" ? "+=" : "-=") :
                (motion === "pos" ? "-=" : "+=")) +
                distance;

        // Animate
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function () {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.explode = function (o, done) {

        var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
                cells = rows,
                el = $(this),
                mode = $.effects.setMode(el, o.mode || "hide"),
                show = mode === "show",
                // show and then visibility:hidden the element before calculating offset
                offset = el.show().css("visibility", "hidden").offset(),
                // width and height of a piece
                width = Math.ceil(el.outerWidth() / cells),
                height = Math.ceil(el.outerHeight() / rows),
                pieces = [],
                // loop
                i, j, left, top, mx, my;

        // children animate complete:
        function childComplete() {
            pieces.push(this);
            if (pieces.length === rows * cells) {
                animComplete();
            }
        }

        // clone the element for each row and cell.
        for (i = 0; i < rows; i++) { // ===>
            top = offset.top + i * height;
            my = i - (rows - 1) / 2;

            for (j = 0; j < cells; j++) { // |||
                left = offset.left + j * width;
                mx = j - (cells - 1) / 2;

                // Create a clone of the now hidden main element that will be absolute positioned
                // within a wrapper div off the -left and -top equal to size of our pieces
                el
                        .clone()
                        .appendTo("body")
                        .wrap("<div></div>")
                        .css({
                            position: "absolute",
                            visibility: "visible",
                            left: -j * width,
                            top: -i * height
                        })

                        // select the wrapper - make it overflow: hidden and absolute positioned based on
                        // where the original was located +left and +top equal to the size of pieces
                        .parent()
                        .addClass("ui-effects-explode")
                        .css({
                            position: "absolute",
                            overflow: "hidden",
                            width: width,
                            height: height,
                            left: left + (show ? mx * width : 0),
                            top: top + (show ? my * height : 0),
                            opacity: show ? 0 : 1
                        }).animate({
                    left: left + (show ? 0 : mx * width),
                    top: top + (show ? 0 : my * height),
                    opacity: show ? 1 : 0
                }, o.duration || 500, o.easing, childComplete);
            }
        }

        function animComplete() {
            el.css({
                visibility: "visible"
            });
            $(pieces).remove();
            if (!show) {
                el.hide();
            }
            done();
        }
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.fade = function (o, done) {
        var el = $(this),
                mode = $.effects.setMode(el, o.mode || "toggle");

        el.animate({
            opacity: mode
        }, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: done
        });
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.fold = function (o, done) {

        // Create element
        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "height", "width"],
                mode = $.effects.setMode(el, o.mode || "hide"),
                show = mode === "show",
                hide = mode === "hide",
                size = o.size || 15,
                percent = /([0-9]+)%/.exec(size),
                horizFirst = !!o.horizFirst,
                widthFirst = show !== horizFirst,
                ref = widthFirst ? ["width", "height"] : ["height", "width"],
                duration = o.duration / 2,
                wrapper, distance,
                animation1 = {},
                animation2 = {};

        $.effects.save(el, props);
        el.show();

        // Create Wrapper
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        distance = widthFirst ?
                [wrapper.width(), wrapper.height()] :
                [wrapper.height(), wrapper.width()];

        if (percent) {
            size = parseInt(percent[ 1 ], 10) / 100 * distance[ hide ? 0 : 1 ];
        }
        if (show) {
            wrapper.css(horizFirst ? {
                height: 0,
                width: size
            } : {
                height: size,
                width: 0
            });
        }

        // Animation
        animation1[ ref[ 0 ] ] = show ? distance[ 0 ] : size;
        animation2[ ref[ 1 ] ] = show ? distance[ 1 ] : 0;

        // Animate
        wrapper
                .animate(animation1, duration, o.easing)
                .animate(animation2, duration, o.easing, function () {
                    if (hide) {
                        el.hide();
                    }
                    $.effects.restore(el, props);
                    $.effects.removeWrapper(el);
                    done();
                });

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.highlight = function (o, done) {
        var elem = $(this),
                props = ["backgroundImage", "backgroundColor", "opacity"],
                mode = $.effects.setMode(elem, o.mode || "show"),
                animation = {
                    backgroundColor: elem.css("backgroundColor")
                };

        if (mode === "hide") {
            animation.opacity = 0;
        }

        $.effects.save(elem, props);

        elem
                .show()
                .css({
                    backgroundImage: "none",
                    backgroundColor: o.color || "#ffff99"
                })
                .animate(animation, {
                    queue: false,
                    duration: o.duration,
                    easing: o.easing,
                    complete: function () {
                        if (mode === "hide") {
                            elem.hide();
                        }
                        $.effects.restore(elem, props);
                        done();
                    }
                });
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.pulsate = function (o, done) {
        var elem = $(this),
                mode = $.effects.setMode(elem, o.mode || "show"),
                show = mode === "show",
                hide = mode === "hide",
                showhide = (show || mode === "hide"),
                // showing or hiding leaves of the "last" animation
                anims = ((o.times || 5) * 2) + (showhide ? 1 : 0),
                duration = o.duration / anims,
                animateTo = 0,
                queue = elem.queue(),
                queuelen = queue.length,
                i;

        if (show || !elem.is(":visible")) {
            elem.css("opacity", 0).show();
            animateTo = 1;
        }

        // anims - 1 opacity "toggles"
        for (i = 1; i < anims; i++) {
            elem.animate({
                opacity: animateTo
            }, duration, o.easing);
            animateTo = 1 - animateTo;
        }

        elem.animate({
            opacity: animateTo
        }, duration, o.easing);

        elem.queue(function () {
            if (hide) {
                elem.hide();
            }
            done();
        });

        // We just queued up "anims" animations, we need to put them next in the queue
        if (queuelen > 1) {
            queue.splice.apply(queue,
                    [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        elem.dequeue();
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.puff = function (o, done) {
        var elem = $(this),
                mode = $.effects.setMode(elem, o.mode || "hide"),
                hide = mode === "hide",
                percent = parseInt(o.percent, 10) || 150,
                factor = percent / 100,
                original = {
                    height: elem.height(),
                    width: elem.width(),
                    outerHeight: elem.outerHeight(),
                    outerWidth: elem.outerWidth()
                };

        $.extend(o, {
            effect: "scale",
            queue: false,
            fade: true,
            mode: mode,
            complete: done,
            percent: hide ? percent : 100,
            from: hide ?
                    original :
                    {
                        height: original.height * factor,
                        width: original.width * factor,
                        outerHeight: original.outerHeight * factor,
                        outerWidth: original.outerWidth * factor
                    }
        });

        elem.effect(o);
    };

    $.effects.effect.scale = function (o, done) {

        // Create element
        var el = $(this),
                options = $.extend(true, {}, o),
                mode = $.effects.setMode(el, o.mode || "effect"),
                percent = parseInt(o.percent, 10) ||
                (parseInt(o.percent, 10) === 0 ? 0 : (mode === "hide" ? 0 : 100)),
                direction = o.direction || "both",
                origin = o.origin,
                original = {
                    height: el.height(),
                    width: el.width(),
                    outerHeight: el.outerHeight(),
                    outerWidth: el.outerWidth()
                },
        factor = {
            y: direction !== "horizontal" ? (percent / 100) : 1,
            x: direction !== "vertical" ? (percent / 100) : 1
        };

        // We are going to pass this effect to the size effect:
        options.effect = "size";
        options.queue = false;
        options.complete = done;

        // Set default origin and restore for show/hide
        if (mode !== "effect") {
            options.origin = origin || ["middle", "center"];
            options.restore = true;
        }

        options.from = o.from || (mode === "show" ? {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        } : original);
        options.to = {
            height: original.height * factor.y,
            width: original.width * factor.x,
            outerHeight: original.outerHeight * factor.y,
            outerWidth: original.outerWidth * factor.x
        };

        // Fade option to support puff
        if (options.fade) {
            if (mode === "show") {
                options.from.opacity = 0;
                options.to.opacity = 1;
            }
            if (mode === "hide") {
                options.from.opacity = 1;
                options.to.opacity = 0;
            }
        }

        // Animate
        el.effect(options);

    };

    $.effects.effect.size = function (o, done) {

        // Create element
        var original, baseline, factor,
                el = $(this),
                props0 = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
                // Always restore
                props1 = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
                // Copy for children
                props2 = ["width", "height", "overflow"],
                cProps = ["fontSize"],
                vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
                hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
                // Set options
                mode = $.effects.setMode(el, o.mode || "effect"),
                restore = o.restore || mode !== "effect",
                scale = o.scale || "both",
                origin = o.origin || ["middle", "center"],
                position = el.css("position"),
                props = restore ? props0 : props1,
                zero = {
                    height: 0,
                    width: 0,
                    outerHeight: 0,
                    outerWidth: 0
                };

        if (mode === "show") {
            el.show();
        }
        original = {
            height: el.height(),
            width: el.width(),
            outerHeight: el.outerHeight(),
            outerWidth: el.outerWidth()
        };

        if (o.mode === "toggle" && mode === "show") {
            el.from = o.to || zero;
            el.to = o.from || original;
        } else {
            el.from = o.from || (mode === "show" ? zero : original);
            el.to = o.to || (mode === "hide" ? zero : original);
        }

        // Set scaling factor
        factor = {
            from: {
                y: el.from.height / original.height,
                x: el.from.width / original.width
            },
            to: {
                y: el.to.height / original.height,
                x: el.to.width / original.width
            }
        };

        // Scale the css box
        if (scale === "box" || scale === "both") {

            // Vertical props scaling
            if (factor.from.y !== factor.to.y) {
                props = props.concat(vProps);
                el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
                el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
            }

            // Horizontal props scaling
            if (factor.from.x !== factor.to.x) {
                props = props.concat(hProps);
                el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
                el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
            }
        }

        // Scale the content
        if (scale === "content" || scale === "both") {

            // Vertical props scaling
            if (factor.from.y !== factor.to.y) {
                props = props.concat(cProps).concat(props2);
                el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
                el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
            }
        }

        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);
        el.css("overflow", "hidden").css(el.from);

        // Adjust
        if (origin) { // Calculate baseline shifts
            baseline = $.effects.getBaseline(origin, original);
            el.from.top = (original.outerHeight - el.outerHeight()) * baseline.y;
            el.from.left = (original.outerWidth - el.outerWidth()) * baseline.x;
            el.to.top = (original.outerHeight - el.to.outerHeight) * baseline.y;
            el.to.left = (original.outerWidth - el.to.outerWidth) * baseline.x;
        }
        el.css(el.from); // set top & left

        // Animate
        if (scale === "content" || scale === "both") { // Scale the children

            // Add margins/font-size
            vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
            hProps = hProps.concat(["marginLeft", "marginRight"]);
            props2 = props0.concat(vProps).concat(hProps);

            el.find("*[width]").each(function () {
                var child = $(this),
                        c_original = {
                            height: child.height(),
                            width: child.width(),
                            outerHeight: child.outerHeight(),
                            outerWidth: child.outerWidth()
                        };
                if (restore) {
                    $.effects.save(child, props2);
                }

                child.from = {
                    height: c_original.height * factor.from.y,
                    width: c_original.width * factor.from.x,
                    outerHeight: c_original.outerHeight * factor.from.y,
                    outerWidth: c_original.outerWidth * factor.from.x
                };
                child.to = {
                    height: c_original.height * factor.to.y,
                    width: c_original.width * factor.to.x,
                    outerHeight: c_original.height * factor.to.y,
                    outerWidth: c_original.width * factor.to.x
                };

                // Vertical props scaling
                if (factor.from.y !== factor.to.y) {
                    child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
                    child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
                }

                // Horizontal props scaling
                if (factor.from.x !== factor.to.x) {
                    child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
                    child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
                }

                // Animate children
                child.css(child.from);
                child.animate(child.to, o.duration, o.easing, function () {

                    // Restore children
                    if (restore) {
                        $.effects.restore(child, props2);
                    }
                });
            });
        }

        // Animate
        el.animate(el.to, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function () {
                if (el.to.opacity === 0) {
                    el.css("opacity", el.from.opacity);
                }
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                if (!restore) {

                    // we need to calculate our new positioning based on the scaling
                    if (position === "static") {
                        el.css({
                            position: "relative",
                            top: el.to.top,
                            left: el.to.left
                        });
                    } else {
                        $.each(["top", "left"], function (idx, pos) {
                            el.css(pos, function (_, str) {
                                var val = parseInt(str, 10),
                                        toRef = idx ? el.to.left : el.to.top;

                                // if original was "auto", recalculate the new value from wrapper
                                if (str === "auto") {
                                    return toRef + "px";
                                }

                                return val + toRef + "px";
                            });
                        });
                    }
                }

                $.effects.removeWrapper(el);
                done();
            }
        });

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.shake = function (o, done) {

        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "height", "width"],
                mode = $.effects.setMode(el, o.mode || "effect"),
                direction = o.direction || "left",
                distance = o.distance || 20,
                times = o.times || 3,
                anims = times * 2 + 1,
                speed = Math.round(o.duration / anims),
                ref = (direction === "up" || direction === "down") ? "top" : "left",
                positiveMotion = (direction === "up" || direction === "left"),
                animation = {},
                animation1 = {},
                animation2 = {},
                i,
                // we will need to re-assemble the queue to stack our animations in place
                queue = el.queue(),
                queuelen = queue.length;

        $.effects.save(el, props);
        el.show();
        $.effects.createWrapper(el);

        // Animation
        animation[ ref ] = (positiveMotion ? "-=" : "+=") + distance;
        animation1[ ref ] = (positiveMotion ? "+=" : "-=") + distance * 2;
        animation2[ ref ] = (positiveMotion ? "-=" : "+=") + distance * 2;

        // Animate
        el.animate(animation, speed, o.easing);

        // Shakes
        for (i = 1; i < times; i++) {
            el.animate(animation1, speed, o.easing).animate(animation2, speed, o.easing);
        }
        el
                .animate(animation1, speed, o.easing)
                .animate(animation, speed / 2, o.easing)
                .queue(function () {
                    if (mode === "hide") {
                        el.hide();
                    }
                    $.effects.restore(el, props);
                    $.effects.removeWrapper(el);
                    done();
                });

        // inject all the animations we just queued to be first in line (after "inprogress")
        if (queuelen > 1) {
            queue.splice.apply(queue,
                    [1, 0].concat(queue.splice(queuelen, anims + 1)));
        }
        el.dequeue();

    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.slide = function (o, done) {

        // Create element
        var el = $(this),
                props = ["position", "top", "bottom", "left", "right", "width", "height"],
                mode = $.effects.setMode(el, o.mode || "show"),
                show = mode === "show",
                direction = o.direction || "left",
                ref = (direction === "up" || direction === "down") ? "top" : "left",
                positiveMotion = (direction === "up" || direction === "left"),
                distance,
                animation = {};

        // Adjust
        $.effects.save(el, props);
        el.show();
        distance = o.distance || el[ ref === "top" ? "outerHeight" : "outerWidth" ](true);

        $.effects.createWrapper(el).css({
            overflow: "hidden"
        });

        if (show) {
            el.css(ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance);
        }

        // Animation
        animation[ ref ] = (show ?
                (positiveMotion ? "+=" : "-=") :
                (positiveMotion ? "-=" : "+=")) +
                distance;

        // Animate
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.easing,
            complete: function () {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };

})(jQuery);

(function ($, undefined) {

    $.effects.effect.transfer = function (o, done) {
        var elem = $(this),
                target = $(o.to),
                targetFixed = target.css("position") === "fixed",
                body = $("body"),
                fixTop = targetFixed ? body.scrollTop() : 0,
                fixLeft = targetFixed ? body.scrollLeft() : 0,
                endPosition = target.offset(),
                animation = {
                    top: endPosition.top - fixTop,
                    left: endPosition.left - fixLeft,
                    height: target.innerHeight(),
                    width: target.innerWidth()
                },
        startPosition = elem.offset(),
                transfer = $("<div class='ui-effects-transfer'></div>")
                .appendTo(document.body)
                .addClass(o.className)
                .css({
                    top: startPosition.top - fixTop,
                    left: startPosition.left - fixLeft,
                    height: elem.innerHeight(),
                    width: elem.innerWidth(),
                    position: targetFixed ? "fixed" : "absolute"
                })
                .animate(animation, o.duration, o.easing, function () {
                    transfer.remove();
                    done();
                });
    };

})(jQuery);

(function ($, undefined) {

    $.widget("ui.menu", {
        version: "1.10.2",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            // callbacks
            blur: null,
            focus: null,
            select: null
        },
        _create: function () {
            this.activeMenu = this.element;
            // flag used to prevent firing of the click handler
            // as the event bubbles up through nested menus
            this.mouseHandled = false;
            this.element
                    .uniqueId()
                    .addClass("ui-menu ui-widget ui-widget-content ui-corner-all")
                    .toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length)
                    .attr({
                        role: this.options.role,
                        tabIndex: 0
                    })
                    // need to catch all clicks on disabled menu
                    // not possible through _on
                    .bind("click" + this.eventNamespace, $.proxy(function (event) {
                        if (this.options.disabled) {
                            event.preventDefault();
                        }
                    }, this));

            if (this.options.disabled) {
                this.element
                        .addClass("ui-state-disabled")
                        .attr("aria-disabled", "true");
            }

            this._on({
                // Prevent focus from sticking to links inside menu after clicking
                // them (focus should always stay on UL during navigation).
                "mousedown .ui-menu-item > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-state-disabled > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-menu-item:has(a)": function (event) {
                    var target = $(event.target).closest(".ui-menu-item");
                    if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
                        this.mouseHandled = true;

                        this.select(event);
                        // Open submenu on click
                        if (target.has(".ui-menu").length) {
                            this.expand(event);
                        } else if (!this.element.is(":focus")) {
                            // Redirect focus to the menu
                            this.element.trigger("focus", [true]);

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if (this.active && this.active.parents(".ui-menu").length === 1) {
                                clearTimeout(this.timer);
                            }
                        }
                    }
                },
                "mouseenter .ui-menu-item": function (event) {
                    var target = $(event.currentTarget);
                    // Remove ui-state-active class from siblings of the newly focused menu item
                    // to avoid a jump caused by adjacent elements both having a class with a border
                    target.siblings().children(".ui-state-active").removeClass("ui-state-active");
                    this.focus(event, target);
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function (event, keepActiveItem) {
                    // If there's already an active item, keep it active
                    // If not, activate the first item
                    var item = this.active || this.element.children(".ui-menu-item").eq(0);

                    if (!keepActiveItem) {
                        this.focus(event, item);
                    }
                },
                blur: function (event) {
                    this._delay(function () {
                        if (!$.contains(this.element[0], this.document[0].activeElement)) {
                            this.collapseAll(event);
                        }
                    });
                },
                keydown: "_keydown"
            });

            this.refresh();

            // Clicks outside of a menu collapse any open menus
            this._on(this.document, {
                click: function (event) {
                    if (!$(event.target).closest(".ui-menu").length) {
                        this.collapseAll(event);
                    }

                    // Reset the mouseHandled flag
                    this.mouseHandled = false;
                }
            });
        },
        _destroy: function () {
            // Destroy (sub)menus
            this.element
                    .removeAttr("aria-activedescendant")
                    .find(".ui-menu").addBack()
                    .removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons")
                    .removeAttr("role")
                    .removeAttr("tabIndex")
                    .removeAttr("aria-labelledby")
                    .removeAttr("aria-expanded")
                    .removeAttr("aria-hidden")
                    .removeAttr("aria-disabled")
                    .removeUniqueId()
                    .show();

            // Destroy menu items
            this.element.find(".ui-menu-item")
                    .removeClass("ui-menu-item")
                    .removeAttr("role")
                    .removeAttr("aria-disabled")
                    .children("a")
                    .removeUniqueId()
                    .removeClass("ui-corner-all ui-state-hover")
                    .removeAttr("tabIndex")
                    .removeAttr("role")
                    .removeAttr("aria-haspopup")
                    .children().each(function () {
                var elem = $(this);
                if (elem.data("ui-menu-submenu-carat")) {
                    elem.remove();
                }
            });

            // Destroy menu dividers
            this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
        },
        _keydown: function (event) {
            /*jshint maxcomplexity:20*/
            var match, prev, character, skip, regex,
                    preventDefault = true;

            function escape(value) {
                return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            }

            switch (event.keyCode) {
                case $.ui.keyCode.PAGE_UP:
                    this.previousPage(event);
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    this.nextPage(event);
                    break;
                case $.ui.keyCode.HOME:
                    this._move("first", "first", event);
                    break;
                case $.ui.keyCode.END:
                    this._move("last", "last", event);
                    break;
                case $.ui.keyCode.UP:
                    this.previous(event);
                    break;
                case $.ui.keyCode.DOWN:
                    this.next(event);
                    break;
                case $.ui.keyCode.LEFT:
                    this.collapse(event);
                    break;
                case $.ui.keyCode.RIGHT:
                    if (this.active && !this.active.is(".ui-state-disabled")) {
                        this.expand(event);
                    }
                    break;
                case $.ui.keyCode.ENTER:
                case $.ui.keyCode.SPACE:
                    this._activate(event);
                    break;
                case $.ui.keyCode.ESCAPE:
                    this.collapse(event);
                    break;
                default:
                    preventDefault = false;
                    prev = this.previousFilter || "";
                    character = String.fromCharCode(event.keyCode);
                    skip = false;

                    clearTimeout(this.filterTimer);

                    if (character === prev) {
                        skip = true;
                    } else {
                        character = prev + character;
                    }

                    regex = new RegExp("^" + escape(character), "i");
                    match = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return regex.test($(this).children("a").text());
                    });
                    match = skip && match.index(this.active.next()) !== -1 ?
                            this.active.nextAll(".ui-menu-item") :
                            match;

                    // If no matches on the current filter, reset to the last character pressed
                    // to move down the menu to the first item that starts with that character
                    if (!match.length) {
                        character = String.fromCharCode(event.keyCode);
                        regex = new RegExp("^" + escape(character), "i");
                        match = this.activeMenu.children(".ui-menu-item").filter(function () {
                            return regex.test($(this).children("a").text());
                        });
                    }

                    if (match.length) {
                        this.focus(event, match);
                        if (match.length > 1) {
                            this.previousFilter = character;
                            this.filterTimer = this._delay(function () {
                                delete this.previousFilter;
                            }, 1000);
                        } else {
                            delete this.previousFilter;
                        }
                    } else {
                        delete this.previousFilter;
                    }
            }

            if (preventDefault) {
                event.preventDefault();
            }
        },
        _activate: function (event) {
            if (!this.active.is(".ui-state-disabled")) {
                if (this.active.children("a[aria-haspopup='true']").length) {
                    this.expand(event);
                } else {
                    this.select(event);
                }
            }
        },
        refresh: function () {
            var menus,
                    icon = this.options.icons.submenu,
                    submenus = this.element.find(this.options.menus);

            // Initialize nested menus
            submenus.filter(":not(.ui-menu)")
                    .addClass("ui-menu ui-widget ui-widget-content ui-corner-all")
                    .hide()
                    .attr({
                        role: this.options.role,
                        "aria-hidden": "true",
                        "aria-expanded": "false"
                    })
                    .each(function () {
                        var menu = $(this),
                                item = menu.prev("a"),
                                submenuCarat = $("<span>")
                                .addClass("ui-menu-icon ui-icon " + icon)
                                .data("ui-menu-submenu-carat", true);

                        item
                                .attr("aria-haspopup", "true")
                                .prepend(submenuCarat);
                        menu.attr("aria-labelledby", item.attr("id"));
                    });

            menus = submenus.add(this.element);

            // Don't refresh list items that are already adapted
            menus.children(":not(.ui-menu-item):has(a)")
                    .addClass("ui-menu-item")
                    .attr("role", "presentation")
                    .children("a")
                    .uniqueId()
                    .addClass("ui-corner-all")
                    .attr({
                        tabIndex: -1,
                        role: this._itemRole()
                    });

            // Initialize unlinked menu-items containing spaces and/or dashes only as dividers
            menus.children(":not(.ui-menu-item)").each(function () {
                var item = $(this);
                // hyphen, em dash, en dash
                if (!/[^\-\u2014\u2013\s]/.test(item.text())) {
                    item.addClass("ui-widget-content ui-menu-divider");
                }
            });

            // Add aria-disabled attribute to any disabled menu item
            menus.children(".ui-state-disabled").attr("aria-disabled", "true");

            // If the active item has been removed, blur the menu
            if (this.active && !$.contains(this.element[ 0 ], this.active[ 0 ])) {
                this.blur();
            }
        },
        _itemRole: function () {
            return {
                menu: "menuitem",
                listbox: "option"
            }[ this.options.role ];
        },
        _setOption: function (key, value) {
            if (key === "icons") {
                this.element.find(".ui-menu-icon")
                        .removeClass(this.options.icons.submenu)
                        .addClass(value.submenu);
            }
            this._super(key, value);
        },
        focus: function (event, item) {
            var nested, focused;
            this.blur(event, event && event.type === "focus");

            this._scrollIntoView(item);

            this.active = item.first();
            focused = this.active.children("a").addClass("ui-state-focus");
            // Only update aria-activedescendant if there's a role
            // otherwise we assume focus is managed elsewhere
            if (this.options.role) {
                this.element.attr("aria-activedescendant", focused.attr("id"));
            }

            // Highlight active parent menu item, if any
            this.active
                    .parent()
                    .closest(".ui-menu-item")
                    .children("a:first")
                    .addClass("ui-state-active");

            if (event && event.type === "keydown") {
                this._close();
            } else {
                this.timer = this._delay(function () {
                    this._close();
                }, this.delay);
            }

            nested = item.children(".ui-menu");
            if (nested.length && (/^mouse/.test(event.type))) {
                this._startOpening(nested);
            }
            this.activeMenu = item.parent();

            this._trigger("focus", event, {item: item});
        },
        _scrollIntoView: function (item) {
            var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
            if (this._hasScroll()) {
                borderTop = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
                paddingTop = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
                offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
                scroll = this.activeMenu.scrollTop();
                elementHeight = this.activeMenu.height();
                itemHeight = item.height();

                if (offset < 0) {
                    this.activeMenu.scrollTop(scroll + offset);
                } else if (offset + itemHeight > elementHeight) {
                    this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight);
                }
            }
        },
        blur: function (event, fromFocus) {
            if (!fromFocus) {
                clearTimeout(this.timer);
            }

            if (!this.active) {
                return;
            }

            this.active.children("a").removeClass("ui-state-focus");
            this.active = null;

            this._trigger("blur", event, {item: this.active});
        },
        _startOpening: function (submenu) {
            clearTimeout(this.timer);

            // Don't open if already open fixes a Firefox bug that caused a .5 pixel
            // shift in the submenu position when mousing over the carat icon
            if (submenu.attr("aria-hidden") !== "true") {
                return;
            }

            this.timer = this._delay(function () {
                this._close();
                this._open(submenu);
            }, this.delay);
        },
        _open: function (submenu) {
            var position = $.extend({
                of: this.active
            }, this.options.position);

            clearTimeout(this.timer);
            this.element.find(".ui-menu").not(submenu.parents(".ui-menu"))
                    .hide()
                    .attr("aria-hidden", "true");

            submenu
                    .show()
                    .removeAttr("aria-hidden")
                    .attr("aria-expanded", "true")
                    .position(position);
        },
        collapseAll: function (event, all) {
            clearTimeout(this.timer);
            this.timer = this._delay(function () {
                // If we were passed an event, look for the submenu that contains the event
                var currentMenu = all ? this.element :
                        $(event && event.target).closest(this.element.find(".ui-menu"));

                // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
                if (!currentMenu.length) {
                    currentMenu = this.element;
                }

                this._close(currentMenu);

                this.blur(event);
                this.activeMenu = currentMenu;
            }, this.delay);
        },
        // With no arguments, closes the currently active menu - if nothing is active
        // it closes all menus.  If passed an argument, it will search for menus BELOW
        _close: function (startMenu) {
            if (!startMenu) {
                startMenu = this.active ? this.active.parent() : this.element;
            }

            startMenu
                    .find(".ui-menu")
                    .hide()
                    .attr("aria-hidden", "true")
                    .attr("aria-expanded", "false")
                    .end()
                    .find("a.ui-state-active")
                    .removeClass("ui-state-active");
        },
        collapse: function (event) {
            var newItem = this.active &&
                    this.active.parent().closest(".ui-menu-item", this.element);
            if (newItem && newItem.length) {
                this._close();
                this.focus(event, newItem);
            }
        },
        expand: function (event) {
            var newItem = this.active &&
                    this.active
                    .children(".ui-menu ")
                    .children(".ui-menu-item")
                    .first();

            if (newItem && newItem.length) {
                this._open(newItem.parent());

                // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
                this._delay(function () {
                    this.focus(event, newItem);
                });
            }
        },
        next: function (event) {
            this._move("next", "first", event);
        },
        previous: function (event) {
            this._move("prev", "last", event);
        },
        isFirstItem: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length;
        },
        isLastItem: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length;
        },
        _move: function (direction, filter, event) {
            var next;
            if (this.active) {
                if (direction === "first" || direction === "last") {
                    next = this.active
                    [ direction === "first" ? "prevAll" : "nextAll" ](".ui-menu-item")
                            .eq(-1);
                } else {
                    next = this.active
                    [ direction + "All" ](".ui-menu-item")
                            .eq(0);
                }
            }
            if (!next || !next.length || !this.active) {
                next = this.activeMenu.children(".ui-menu-item")[ filter ]();
            }

            this.focus(event, next);
        },
        nextPage: function (event) {
            var item, base, height;

            if (!this.active) {
                this.next(event);
                return;
            }
            if (this.isLastItem()) {
                return;
            }
            if (this._hasScroll()) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.nextAll(".ui-menu-item").each(function () {
                    item = $(this);
                    return item.offset().top - base - height < 0;
                });

                this.focus(event, item);
            } else {
                this.focus(event, this.activeMenu.children(".ui-menu-item")
                [ !this.active ? "first" : "last" ]());
            }
        },
        previousPage: function (event) {
            var item, base, height;
            if (!this.active) {
                this.next(event);
                return;
            }
            if (this.isFirstItem()) {
                return;
            }
            if (this._hasScroll()) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.prevAll(".ui-menu-item").each(function () {
                    item = $(this);
                    return item.offset().top - base + height > 0;
                });

                this.focus(event, item);
            } else {
                this.focus(event, this.activeMenu.children(".ui-menu-item").first());
            }
        },
        _hasScroll: function () {
            return this.element.outerHeight() < this.element.prop("scrollHeight");
        },
        select: function (event) {
            // TODO: It should never be possible to not have an active item at this
            // point, but the tests don't trigger mouseenter before click.
            this.active = this.active || $(event.target).closest(".ui-menu-item");
            var ui = {item: this.active};
            if (!this.active.has(".ui-menu").length) {
                this.collapseAll(event, true);
            }
            this._trigger("select", event, ui);
        }
    });

}(jQuery));

(function ($, undefined) {

    $.ui = $.ui || {};

    var cachedScrollbarWidth,
            max = Math.max,
            abs = Math.abs,
            round = Math.round,
            rhorizontal = /left|center|right/,
            rvertical = /top|center|bottom/,
            roffset = /[\+\-]\d+(\.[\d]+)?%?/,
            rposition = /^\w+/,
            rpercent = /%$/,
            _position = $.fn.position;

    function getOffsets(offsets, width, height) {
        return [
            parseFloat(offsets[ 0 ]) * (rpercent.test(offsets[ 0 ]) ? width / 100 : 1),
            parseFloat(offsets[ 1 ]) * (rpercent.test(offsets[ 1 ]) ? height / 100 : 1)
        ];
    }

    function parseCss(element, property) {
        return parseInt($.css(element, property), 10) || 0;
    }

    function getDimensions(elem) {
        var raw = elem[0];
        if (raw.nodeType === 9) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {top: 0, left: 0}
            };
        }
        if ($.isWindow(raw)) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {top: elem.scrollTop(), left: elem.scrollLeft()}
            };
        }
        if (raw.preventDefault) {
            return {
                width: 0,
                height: 0,
                offset: {top: raw.pageY, left: raw.pageX}
            };
        }
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        };
    }

    $.position = {
        scrollbarWidth: function () {
            if (cachedScrollbarWidth !== undefined) {
                return cachedScrollbarWidth;
            }
            var w1, w2,
                    div = $("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                    innerDiv = div.children()[0];

            $("body").append(div);
            w1 = innerDiv.offsetWidth;
            div.css("overflow", "scroll");

            w2 = innerDiv.offsetWidth;

            if (w1 === w2) {
                w2 = div[0].clientWidth;
            }

            div.remove();

            return (cachedScrollbarWidth = w1 - w2);
        },
        getScrollInfo: function (within) {
            var overflowX = within.isWindow ? "" : within.element.css("overflow-x"),
                    overflowY = within.isWindow ? "" : within.element.css("overflow-y"),
                    hasOverflowX = overflowX === "scroll" ||
                    (overflowX === "auto" && within.width < within.element[0].scrollWidth),
                    hasOverflowY = overflowY === "scroll" ||
                    (overflowY === "auto" && within.height < within.element[0].scrollHeight);
            return {
                width: hasOverflowY ? $.position.scrollbarWidth() : 0,
                height: hasOverflowX ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function (element) {
            var withinElement = $(element || window),
                    isWindow = $.isWindow(withinElement[0]);
            return {
                element: withinElement,
                isWindow: isWindow,
                offset: withinElement.offset() || {left: 0, top: 0},
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: isWindow ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow ? withinElement.height() : withinElement.outerHeight()
            };
        }
    };

    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }

        // make a copy, we don't want to modify arguments
        options = $.extend({}, options);

        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
                target = $(options.of),
                within = $.position.getWithinInfo(options.within),
                scrollInfo = $.position.getScrollInfo(within),
                collision = (options.collision || "flip").split(" "),
                offsets = {};

        dimensions = getDimensions(target);
        if (target[0].preventDefault) {
            // force left top to allow flipping
            options.at = "left top";
        }
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        targetOffset = dimensions.offset;
        // clone to reuse original targetOffset later
        basePosition = $.extend({}, targetOffset);

        // force my and at to have valid horizontal and vertical positions
        // if a value is missing or invalid, it will be converted to center
        $.each(["my", "at"], function () {
            var pos = (options[ this ] || "").split(" "),
                    horizontalOffset,
                    verticalOffset;

            if (pos.length === 1) {
                pos = rhorizontal.test(pos[ 0 ]) ?
                        pos.concat(["center"]) :
                        rvertical.test(pos[ 0 ]) ?
                        ["center"].concat(pos) :
                        ["center", "center"];
            }
            pos[ 0 ] = rhorizontal.test(pos[ 0 ]) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test(pos[ 1 ]) ? pos[ 1 ] : "center";

            // calculate offsets
            horizontalOffset = roffset.exec(pos[ 0 ]);
            verticalOffset = roffset.exec(pos[ 1 ]);
            offsets[ this ] = [
                horizontalOffset ? horizontalOffset[ 0 ] : 0,
                verticalOffset ? verticalOffset[ 0 ] : 0
            ];

            // reduce to just the positions without the offsets
            options[ this ] = [
                rposition.exec(pos[ 0 ])[ 0 ],
                rposition.exec(pos[ 1 ])[ 0 ]
            ];
        });

        // normalize collision option
        if (collision.length === 1) {
            collision[ 1 ] = collision[ 0 ];
        }

        if (options.at[ 0 ] === "right") {
            basePosition.left += targetWidth;
        } else if (options.at[ 0 ] === "center") {
            basePosition.left += targetWidth / 2;
        }

        if (options.at[ 1 ] === "bottom") {
            basePosition.top += targetHeight;
        } else if (options.at[ 1 ] === "center") {
            basePosition.top += targetHeight / 2;
        }

        atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return this.each(function () {
            var collisionPosition, using,
                    elem = $(this),
                    elemWidth = elem.outerWidth(),
                    elemHeight = elem.outerHeight(),
                    marginLeft = parseCss(this, "marginLeft"),
                    marginTop = parseCss(this, "marginTop"),
                    collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
                    collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
                    position = $.extend({}, basePosition),
                    myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

            if (options.my[ 0 ] === "right") {
                position.left -= elemWidth;
            } else if (options.my[ 0 ] === "center") {
                position.left -= elemWidth / 2;
            }

            if (options.my[ 1 ] === "bottom") {
                position.top -= elemHeight;
            } else if (options.my[ 1 ] === "center") {
                position.top -= elemHeight / 2;
            }

            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            // if the browser doesn't support fractions, then round for consistent results
            if (!$.support.offsetFractions) {
                position.left = round(position.left);
                position.top = round(position.top);
            }

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.each(["left", "top"], function (i, dir) {
                if ($.ui.position[ collision[ i ] ]) {
                    $.ui.position[ collision[ i ] ][ dir ](position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ]],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem: elem
                    });
                }
            });

            if (options.using) {
                // adds feedback as second argument to using callback, if present
                using = function (props) {
                    var left = targetOffset.left - position.left,
                            right = left + targetWidth - elemWidth,
                            top = targetOffset.top - position.top,
                            bottom = top + targetHeight - elemHeight,
                            feedback = {
                                target: {
                                    element: target,
                                    left: targetOffset.left,
                                    top: targetOffset.top,
                                    width: targetWidth,
                                    height: targetHeight
                                },
                                element: {
                                    element: elem,
                                    left: position.left,
                                    top: position.top,
                                    width: elemWidth,
                                    height: elemHeight
                                },
                                horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                                vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                            };
                    if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
                        feedback.horizontal = "center";
                    }
                    if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
                        feedback.vertical = "middle";
                    }
                    if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
                        feedback.important = "horizontal";
                    } else {
                        feedback.important = "vertical";
                    }
                    options.using.call(this, props, feedback);
                };
            }

            elem.offset($.extend(position, {using: using}));
        });
    };

    $.ui.position = {
        fit: {
            left: function (position, data) {
                var within = data.within,
                        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                        outerWidth = within.width,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = withinOffset - collisionPosLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                        newOverRight;

                // element is wider than within
                if (data.collisionWidth > outerWidth) {
                    // element is initially over the left side of within
                    if (overLeft > 0 && overRight <= 0) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                        // element is initially over right side of within
                    } else if (overRight > 0 && overLeft <= 0) {
                        position.left = withinOffset;
                        // element is initially over both left and right sides of within
                    } else {
                        if (overLeft > overRight) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }
                    // too far left -> align with left edge
                } else if (overLeft > 0) {
                    position.left += overLeft;
                    // too far right -> align with right edge
                } else if (overRight > 0) {
                    position.left -= overRight;
                    // adjust based on position and margin
                } else {
                    position.left = max(position.left - collisionPosLeft, position.left);
                }
            },
            top: function (position, data) {
                var within = data.within,
                        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                        outerHeight = data.within.height,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = withinOffset - collisionPosTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                        newOverBottom;

                // element is taller than within
                if (data.collisionHeight > outerHeight) {
                    // element is initially over the top of within
                    if (overTop > 0 && overBottom <= 0) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                        // element is initially over bottom of within
                    } else if (overBottom > 0 && overTop <= 0) {
                        position.top = withinOffset;
                        // element is initially over both top and bottom of within
                    } else {
                        if (overTop > overBottom) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }
                    // too far up -> align with top
                } else if (overTop > 0) {
                    position.top += overTop;
                    // too far down -> align with bottom edge
                } else if (overBottom > 0) {
                    position.top -= overBottom;
                    // adjust based on position and margin
                } else {
                    position.top = max(position.top - collisionPosTop, position.top);
                }
            }
        },
        flip: {
            left: function (position, data) {
                var within = data.within,
                        withinOffset = within.offset.left + within.scrollLeft,
                        outerWidth = within.width,
                        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = collisionPosLeft - offsetLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                        myOffset = data.my[ 0 ] === "left" ?
                        -data.elemWidth :
                        data.my[ 0 ] === "right" ?
                        data.elemWidth :
                        0,
                        atOffset = data.at[ 0 ] === "left" ?
                        data.targetWidth :
                        data.at[ 0 ] === "right" ?
                        -data.targetWidth :
                        0,
                        offset = -2 * data.offset[ 0 ],
                        newOverRight,
                        newOverLeft;

                if (overLeft < 0) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if (newOverRight < 0 || newOverRight < abs(overLeft)) {
                        position.left += myOffset + atOffset + offset;
                    }
                } else if (overRight > 0) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function (position, data) {
                var within = data.within,
                        withinOffset = within.offset.top + within.scrollTop,
                        outerHeight = within.height,
                        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = collisionPosTop - offsetTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                        top = data.my[ 1 ] === "top",
                        myOffset = top ?
                        -data.elemHeight :
                        data.my[ 1 ] === "bottom" ?
                        data.elemHeight :
                        0,
                        atOffset = data.at[ 1 ] === "top" ?
                        data.targetHeight :
                        data.at[ 1 ] === "bottom" ?
                        -data.targetHeight :
                        0,
                        offset = -2 * data.offset[ 1 ],
                        newOverTop,
                        newOverBottom;
                if (overTop < 0) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if ((position.top + myOffset + atOffset + offset) > overTop && (newOverBottom < 0 || newOverBottom < abs(overTop))) {
                        position.top += myOffset + atOffset + offset;
                    }
                } else if (overBottom > 0) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if ((position.top + myOffset + atOffset + offset) > overBottom && (newOverTop > 0 || abs(newOverTop) < overBottom)) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function () {
                $.ui.position.flip.left.apply(this, arguments);
                $.ui.position.fit.left.apply(this, arguments);
            },
            top: function () {
                $.ui.position.flip.top.apply(this, arguments);
                $.ui.position.fit.top.apply(this, arguments);
            }
        }
    };

// fraction support test
    (function () {
        var testElement, testElementParent, testElementStyle, offsetLeft, i,
                body = document.getElementsByTagName("body")[ 0 ],
                div = document.createElement("div");

        //Create a "fake body" for testing based on method used in jQuery.support
        testElement = document.createElement(body ? "div" : "body");
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        if (body) {
            $.extend(testElementStyle, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
        }
        for (i in testElementStyle) {
            testElement.style[ i ] = testElementStyle[ i ];
        }
        testElement.appendChild(div);
        testElementParent = body || document.documentElement;
        testElementParent.insertBefore(testElement, testElementParent.firstChild);

        div.style.cssText = "position: absolute; left: 10.7432222px;";

        offsetLeft = $(div).offset().left;
        $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

        testElement.innerHTML = "";
        testElementParent.removeChild(testElement);
    })();

}(jQuery));

(function ($, undefined) {

    $.widget("ui.progressbar", {
        version: "1.10.2",
        options: {
            max: 100,
            value: 0,
            change: null,
            complete: null
        },
        min: 0,
        _create: function () {
            // Constrain initial value
            this.oldValue = this.options.value = this._constrainedValue();

            this.element
                    .addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all")
                    .attr({
                        // Only set static values, aria-valuenow and aria-valuemax are
                        // set inside _refreshValue()
                        role: "progressbar",
                        "aria-valuemin": this.min
                    });

            this.valueDiv = $("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>")
                    .appendTo(this.element);

            this._refreshValue();
        },
        _destroy: function () {
            this.element
                    .removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all")
                    .removeAttr("role")
                    .removeAttr("aria-valuemin")
                    .removeAttr("aria-valuemax")
                    .removeAttr("aria-valuenow");

            this.valueDiv.remove();
        },
        value: function (newValue) {
            if (newValue === undefined) {
                return this.options.value;
            }

            this.options.value = this._constrainedValue(newValue);
            this._refreshValue();
        },
        _constrainedValue: function (newValue) {
            if (newValue === undefined) {
                newValue = this.options.value;
            }

            this.indeterminate = newValue === false;

            // sanitize value
            if (typeof newValue !== "number") {
                newValue = 0;
            }

            return this.indeterminate ? false :
                    Math.min(this.options.max, Math.max(this.min, newValue));
        },
        _setOptions: function (options) {
            // Ensure "value" option is set after other values (like max)
            var value = options.value;
            delete options.value;

            this._super(options);

            this.options.value = this._constrainedValue(value);
            this._refreshValue();
        },
        _setOption: function (key, value) {
            if (key === "max") {
                // Don't allow a max less than min
                value = Math.max(this.min, value);
            }

            this._super(key, value);
        },
        _percentage: function () {
            return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min);
        },
        _refreshValue: function () {
            var value = this.options.value,
                    percentage = this._percentage();

            this.valueDiv
                    .toggle(this.indeterminate || value > this.min)
                    .toggleClass("ui-corner-right", value === this.options.max)
                    .width(percentage.toFixed(0) + "%");

            this.element.toggleClass("ui-progressbar-indeterminate", this.indeterminate);

            if (this.indeterminate) {
                this.element.removeAttr("aria-valuenow");
                if (!this.overlayDiv) {
                    this.overlayDiv = $("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv);
                }
            } else {
                this.element.attr({
                    "aria-valuemax": this.options.max,
                    "aria-valuenow": value
                });
                if (this.overlayDiv) {
                    this.overlayDiv.remove();
                    this.overlayDiv = null;
                }
            }

            if (this.oldValue !== value) {
                this.oldValue = value;
                this._trigger("change");
            }
            if (value === this.options.max) {
                this._trigger("complete");
            }
        }
    });

})(jQuery);

(function ($, undefined) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
    var numPages = 5;

    $.widget("ui.slider", $.ui.mouse, {
        version: "1.10.2",
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null,
            // callbacks
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        _create: function () {
            this._keySliding = false;
            this._mouseSliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();

            this.element
                    .addClass("ui-slider" +
                            " ui-slider-" + this.orientation +
                            " ui-widget" +
                            " ui-widget-content" +
                            " ui-corner-all");

            this._refresh();
            this._setOption("disabled", this.options.disabled);

            this._animateOff = false;
        },
        _refresh: function () {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue();
        },
        _createHandles: function () {
            var i, handleCount,
                    options = this.options,
                    existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                    handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                    handles = [];

            handleCount = (options.values && options.values.length) || 1;

            if (existingHandles.length > handleCount) {
                existingHandles.slice(handleCount).remove();
                existingHandles = existingHandles.slice(0, handleCount);
            }

            for (i = existingHandles.length; i < handleCount; i++) {
                handles.push(handle);
            }

            this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

            this.handle = this.handles.eq(0);

            this.handles.each(function (i) {
                $(this).data("ui-slider-handle-index", i);
            });
        },
        _createRange: function () {
            var options = this.options,
                    classes = "";

            if (options.range) {
                if (options.range === true) {
                    if (!options.values) {
                        options.values = [this._valueMin(), this._valueMin()];
                    } else if (options.values.length && options.values.length !== 2) {
                        options.values = [options.values[0], options.values[0]];
                    } else if ($.isArray(options.values)) {
                        options.values = options.values.slice(0);
                    }
                }

                if (!this.range || !this.range.length) {
                    this.range = $("<div></div>")
                            .appendTo(this.element);

                    classes = "ui-slider-range" +
                            // note: this isn't the most fittingly semantic framework class for this element,
                            // but worked best visually with a variety of themes
                            " ui-widget-header ui-corner-all";
                } else {
                    this.range.removeClass("ui-slider-range-min ui-slider-range-max")
                            // Handle range switching from true to min/max
                            .css({
                                "left": "",
                                "bottom": ""
                            });
                }

                this.range.addClass(classes +
                        ((options.range === "min" || options.range === "max") ? " ui-slider-range-" + options.range : ""));
            } else {
                this.range = $([]);
            }
        },
        _setupEvents: function () {
            var elements = this.handles.add(this.range).filter("a");
            this._off(elements);
            this._on(elements, this._handleEvents);
            this._hoverable(elements);
            this._focusable(elements);
        },
        _destroy: function () {
            this.handles.remove();
            this.range.remove();

            this.element
                    .removeClass("ui-slider" +
                            " ui-slider-horizontal" +
                            " ui-slider-vertical" +
                            " ui-widget" +
                            " ui-widget-content" +
                            " ui-corner-all");

            this._mouseDestroy();
        },
        _mouseCapture: function (event) {
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
                    that = this,
                    o = this.options;

            if (o.disabled) {
                return false;
            }

            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();

            position = {x: event.pageX, y: event.pageY};
            normValue = this._normValueFromMouse(position);
            distance = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function (i) {
                var thisDistance = Math.abs(normValue - that.values(i));
                if ((distance > thisDistance) ||
                        (distance === thisDistance &&
                                (i === that._lastChangedValue || that.values(i) === o.min))) {
                    distance = thisDistance;
                    closestHandle = $(this);
                    index = i;
                }
            });

            allowed = this._start(event, index);
            if (allowed === false) {
                return false;
            }
            this._mouseSliding = true;

            this._handleIndex = index;

            closestHandle
                    .addClass("ui-state-active")
                    .focus();

            offset = closestHandle.offset();
            mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
            this._clickOffset = mouseOverHandle ? {left: 0, top: 0} : {
                left: event.pageX - offset.left - (closestHandle.width() / 2),
                top: event.pageY - offset.top -
                        (closestHandle.height() / 2) -
                        (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
                        (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
                        (parseInt(closestHandle.css("marginTop"), 10) || 0)
            };

            if (!this.handles.hasClass("ui-state-hover")) {
                this._slide(event, index, normValue);
            }
            this._animateOff = true;
            return true;
        },
        _mouseStart: function () {
            return true;
        },
        _mouseDrag: function (event) {
            var position = {x: event.pageX, y: event.pageY},
            normValue = this._normValueFromMouse(position);

            this._slide(event, this._handleIndex, normValue);

            return false;
        },
        _mouseStop: function (event) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;

            this._stop(event, this._handleIndex);
            this._change(event, this._handleIndex);

            this._handleIndex = null;
            this._clickOffset = null;
            this._animateOff = false;

            return false;
        },
        _detectOrientation: function () {
            this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
        },
        _normValueFromMouse: function (position) {
            var pixelTotal,
                    pixelMouse,
                    percentMouse,
                    valueTotal,
                    valueMouse;

            if (this.orientation === "horizontal") {
                pixelTotal = this.elementSize.width;
                pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
            } else {
                pixelTotal = this.elementSize.height;
                pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
            }

            percentMouse = (pixelMouse / pixelTotal);
            if (percentMouse > 1) {
                percentMouse = 1;
            }
            if (percentMouse < 0) {
                percentMouse = 0;
            }
            if (this.orientation === "vertical") {
                percentMouse = 1 - percentMouse;
            }

            valueTotal = this._valueMax() - this._valueMin();
            valueMouse = this._valueMin() + percentMouse * valueTotal;

            return this._trimAlignValue(valueMouse);
        },
        _start: function (event, index) {
            var uiHash = {
                handle: this.handles[ index ],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values();
            }
            return this._trigger("start", event, uiHash);
        },
        _slide: function (event, index, newVal) {
            var otherVal,
                    newValues,
                    allowed;

            if (this.options.values && this.options.values.length) {
                otherVal = this.values(index ? 0 : 1);

                if ((this.options.values.length === 2 && this.options.range === true) &&
                        ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
                        ) {
                    newVal = otherVal;
                }

                if (newVal !== this.values(index)) {
                    newValues = this.values();
                    newValues[ index ] = newVal;
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger("slide", event, {
                        handle: this.handles[ index ],
                        value: newVal,
                        values: newValues
                    });
                    otherVal = this.values(index ? 0 : 1);
                    if (allowed !== false) {
                        this.values(index, newVal, true);
                    }
                }
            } else {
                if (newVal !== this.value()) {
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger("slide", event, {
                        handle: this.handles[ index ],
                        value: newVal
                    });
                    if (allowed !== false) {
                        this.value(newVal);
                    }
                }
            }
        },
        _stop: function (event, index) {
            var uiHash = {
                handle: this.handles[ index ],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values();
            }

            this._trigger("stop", event, uiHash);
        },
        _change: function (event, index) {
            if (!this._keySliding && !this._mouseSliding) {
                var uiHash = {
                    handle: this.handles[ index ],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    uiHash.value = this.values(index);
                    uiHash.values = this.values();
                }

                //store the last changed value index for reference when handles overlap
                this._lastChangedValue = index;

                this._trigger("change", event, uiHash);
            }
        },
        value: function (newValue) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, 0);
                return;
            }

            return this._value();
        },
        values: function (index, newValue) {
            var vals,
                    newValues,
                    i;

            if (arguments.length > 1) {
                this.options.values[ index ] = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, index);
                return;
            }

            if (arguments.length) {
                if ($.isArray(arguments[ 0 ])) {
                    vals = this.options.values;
                    newValues = arguments[ 0 ];
                    for (i = 0; i < vals.length; i += 1) {
                        vals[ i ] = this._trimAlignValue(newValues[ i ]);
                        this._change(null, i);
                    }
                    this._refreshValue();
                } else {
                    if (this.options.values && this.options.values.length) {
                        return this._values(index);
                    } else {
                        return this.value();
                    }
                }
            } else {
                return this._values();
            }
        },
        _setOption: function (key, value) {
            var i,
                    valsLength = 0;

            if (key === "range" && this.options.range === true) {
                if (value === "min") {
                    this.options.value = this._values(0);
                    this.options.values = null;
                } else if (value === "max") {
                    this.options.value = this._values(this.options.values.length - 1);
                    this.options.values = null;
                }
            }

            if ($.isArray(this.options.values)) {
                valsLength = this.options.values.length;
            }

            $.Widget.prototype._setOption.apply(this, arguments);

            switch (key) {
                case "orientation":
                    this._detectOrientation();
                    this.element
                            .removeClass("ui-slider-horizontal ui-slider-vertical")
                            .addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for (i = 0; i < valsLength; i += 1) {
                        this._change(null, i);
                    }
                    this._animateOff = false;
                    break;
                case "min":
                case "max":
                    this._animateOff = true;
                    this._refreshValue();
                    this._animateOff = false;
                    break;
                case "range":
                    this._animateOff = true;
                    this._refresh();
                    this._animateOff = false;
                    break;
            }
        },
        //internal value getter
        // _value() returns value trimmed by min and max, aligned by step
        _value: function () {
            var val = this.options.value;
            val = this._trimAlignValue(val);

            return val;
        },
        //internal values getter
        // _values() returns array of values trimmed by min and max, aligned by step
        // _values( index ) returns single value trimmed by min and max, aligned by step
        _values: function (index) {
            var val,
                    vals,
                    i;

            if (arguments.length) {
                val = this.options.values[ index ];
                val = this._trimAlignValue(val);

                return val;
            } else if (this.options.values && this.options.values.length) {
                // .slice() creates a copy of the array
                // this copy gets trimmed by min and max and then returned
                vals = this.options.values.slice();
                for (i = 0; i < vals.length; i += 1) {
                    vals[ i ] = this._trimAlignValue(vals[ i ]);
                }

                return vals;
            } else {
                return [];
            }
        },
        // returns the step-aligned value that val is closest to, between (inclusive) min and max
        _trimAlignValue: function (val) {
            if (val <= this._valueMin()) {
                return this._valueMin();
            }
            if (val >= this._valueMax()) {
                return this._valueMax();
            }
            var step = (this.options.step > 0) ? this.options.step : 1,
                    valModStep = (val - this._valueMin()) % step,
                    alignValue = val - valModStep;

            if (Math.abs(valModStep) * 2 >= step) {
                alignValue += (valModStep > 0) ? step : (-step);
            }

            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see #4124)
            return parseFloat(alignValue.toFixed(5));
        },
        _valueMin: function () {
            return this.options.min;
        },
        _valueMax: function () {
            return this.options.max;
        },
        _refreshValue: function () {
            var lastValPercent, valPercent, value, valueMin, valueMax,
                    oRange = this.options.range,
                    o = this.options,
                    that = this,
                    animate = (!this._animateOff) ? o.animate : false,
                    _set = {};

            if (this.options.values && this.options.values.length) {
                this.handles.each(function (i) {
                    valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
                    _set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                    $(this).stop(1, 1)[ animate ? "animate" : "css" ](_set, o.animate);
                    if (that.options.range === true) {
                        if (that.orientation === "horizontal") {
                            if (i === 0) {
                                that.range.stop(1, 1)[ animate ? "animate" : "css" ]({left: valPercent + "%"}, o.animate);
                            }
                            if (i === 1) {
                                that.range[ animate ? "animate" : "css" ]({width: (valPercent - lastValPercent) + "%"}, {queue: false, duration: o.animate});
                            }
                        } else {
                            if (i === 0) {
                                that.range.stop(1, 1)[ animate ? "animate" : "css" ]({bottom: (valPercent) + "%"}, o.animate);
                            }
                            if (i === 1) {
                                that.range[ animate ? "animate" : "css" ]({height: (valPercent - lastValPercent) + "%"}, {queue: false, duration: o.animate});
                            }
                        }
                    }
                    lastValPercent = valPercent;
                });
            } else {
                value = this.value();
                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = (valueMax !== valueMin) ?
                        (value - valueMin) / (valueMax - valueMin) * 100 :
                        0;
                _set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                this.handle.stop(1, 1)[ animate ? "animate" : "css" ](_set, o.animate);

                if (oRange === "min" && this.orientation === "horizontal") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({width: valPercent + "%"}, o.animate);
                }
                if (oRange === "max" && this.orientation === "horizontal") {
                    this.range[ animate ? "animate" : "css" ]({width: (100 - valPercent) + "%"}, {queue: false, duration: o.animate});
                }
                if (oRange === "min" && this.orientation === "vertical") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({height: valPercent + "%"}, o.animate);
                }
                if (oRange === "max" && this.orientation === "vertical") {
                    this.range[ animate ? "animate" : "css" ]({height: (100 - valPercent) + "%"}, {queue: false, duration: o.animate});
                }
            }
        },
        _handleEvents: {
            keydown: function (event) {
                /*jshint maxcomplexity:25*/
                var allowed, curVal, newVal, step,
                        index = $(event.target).data("ui-slider-handle-index");

                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                    case $.ui.keyCode.END:
                    case $.ui.keyCode.PAGE_UP:
                    case $.ui.keyCode.PAGE_DOWN:
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        event.preventDefault();
                        if (!this._keySliding) {
                            this._keySliding = true;
                            $(event.target).addClass("ui-state-active");
                            allowed = this._start(event, index);
                            if (allowed === false) {
                                return;
                            }
                        }
                        break;
                }

                step = this.options.step;
                if (this.options.values && this.options.values.length) {
                    curVal = newVal = this.values(index);
                } else {
                    curVal = newVal = this.value();
                }

                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                        newVal = this._valueMin();
                        break;
                    case $.ui.keyCode.END:
                        newVal = this._valueMax();
                        break;
                    case $.ui.keyCode.PAGE_UP:
                        newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
                        break;
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                        if (curVal === this._valueMax()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal + step);
                        break;
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        if (curVal === this._valueMin()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal - step);
                        break;
                }

                this._slide(event, index, newVal);
            },
            click: function (event) {
                event.preventDefault();
            },
            keyup: function (event) {
                var index = $(event.target).data("ui-slider-handle-index");

                if (this._keySliding) {
                    this._keySliding = false;
                    this._stop(event, index);
                    this._change(event, index);
                    $(event.target).removeClass("ui-state-active");
                }
            }
        }

    });

}(jQuery));

(function ($) {

    function modifier(fn) {
        return function () {
            var previous = this.element.val();
            fn.apply(this, arguments);
            this._refresh();
            if (previous !== this.element.val()) {
                this._trigger("change");
            }
        };
    }

    $.widget("ui.spinner", {
        version: "1.10.2",
        defaultElement: "<input>",
        widgetEventPrefix: "spin",
        options: {
            culture: null,
            icons: {
                down: "ui-icon-triangle-1-s",
                up: "ui-icon-triangle-1-n"
            },
            incremental: true,
            max: null,
            min: null,
            numberFormat: null,
            page: 10,
            step: 1,
            change: null,
            spin: null,
            start: null,
            stop: null
        },
        _create: function () {
            // handle string values that need to be parsed
            this._setOption("max", this.options.max);
            this._setOption("min", this.options.min);
            this._setOption("step", this.options.step);

            // format the value, but don't constrain
            this._value(this.element.val(), true);

            this._draw();
            this._on(this._events);
            this._refresh();

            // turning off autocomplete prevents the browser from remembering the
            // value when navigating through history, so we re-enable autocomplete
            // if the page is unloaded before the widget is destroyed. #7790
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete");
                }
            });
        },
        _getCreateOptions: function () {
            var options = {},
                    element = this.element;

            $.each(["min", "max", "step"], function (i, option) {
                var value = element.attr(option);
                if (value !== undefined && value.length) {
                    options[ option ] = value;
                }
            });

            return options;
        },
        _events: {
            keydown: function (event) {
                if (this._start(event) && this._keydown(event)) {
                    event.preventDefault();
                }
            },
            keyup: "_stop",
            focus: function () {
                this.previous = this.element.val();
            },
            blur: function (event) {
                if (this.cancelBlur) {
                    delete this.cancelBlur;
                    return;
                }

                this._stop();
                this._refresh();
                if (this.previous !== this.element.val()) {
                    this._trigger("change", event);
                }
            },
            mousewheel: function (event, delta) {
                if (!delta) {
                    return;
                }
                if (!this.spinning && !this._start(event)) {
                    return false;
                }

                this._spin((delta > 0 ? 1 : -1) * this.options.step, event);
                clearTimeout(this.mousewheelTimer);
                this.mousewheelTimer = this._delay(function () {
                    if (this.spinning) {
                        this._stop(event);
                    }
                }, 100);
                event.preventDefault();
            },
            "mousedown .ui-spinner-button": function (event) {
                var previous;

                // We never want the buttons to have focus; whenever the user is
                // interacting with the spinner, the focus should be on the input.
                // If the input is focused then this.previous is properly set from
                // when the input first received focus. If the input is not focused
                // then we need to set this.previous based on the value before spinning.
                previous = this.element[0] === this.document[0].activeElement ?
                        this.previous : this.element.val();
                function checkFocus() {
                    var isActive = this.element[0] === this.document[0].activeElement;
                    if (!isActive) {
                        this.element.focus();
                        this.previous = previous;
                        // support: IE
                        // IE sets focus asynchronously, so we need to check if focus
                        // moved off of the input because the user clicked on the button.
                        this._delay(function () {
                            this.previous = previous;
                        });
                    }
                }

                // ensure focus is on (or stays on) the text field
                event.preventDefault();
                checkFocus.call(this);

                // support: IE
                // IE doesn't prevent moving focus even with event.preventDefault()
                // so we set a flag to know when we should ignore the blur event
                // and check (again) if focus moved off of the input.
                this.cancelBlur = true;
                this._delay(function () {
                    delete this.cancelBlur;
                    checkFocus.call(this);
                });

                if (this._start(event) === false) {
                    return;
                }

                this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event);
            },
            "mouseup .ui-spinner-button": "_stop",
            "mouseenter .ui-spinner-button": function (event) {
                // button will add ui-state-active if mouse was down while mouseleave and kept down
                if (!$(event.currentTarget).hasClass("ui-state-active")) {
                    return;
                }

                if (this._start(event) === false) {
                    return false;
                }
                this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event);
            },
            // TODO: do we really want to consider this a stop?
            // shouldn't we just stop the repeater and wait until mouseup before
            // we trigger the stop event?
            "mouseleave .ui-spinner-button": "_stop"
        },
        _draw: function () {
            var uiSpinner = this.uiSpinner = this.element
                    .addClass("ui-spinner-input")
                    .attr("autocomplete", "off")
                    .wrap(this._uiSpinnerHtml())
                    .parent()
                    // add buttons
                    .append(this._buttonHtml());

            this.element.attr("role", "spinbutton");

            // button bindings
            this.buttons = uiSpinner.find(".ui-spinner-button")
                    .attr("tabIndex", -1)
                    .button()
                    .removeClass("ui-corner-all");

            // IE 6 doesn't understand height: 50% for the buttons
            // unless the wrapper has an explicit height
            if (this.buttons.height() > Math.ceil(uiSpinner.height() * 0.5) &&
                    uiSpinner.height() > 0) {
                uiSpinner.height(uiSpinner.height());
            }

            // disable spinner if element was already disabled
            if (this.options.disabled) {
                this.disable();
            }
        },
        _keydown: function (event) {
            var options = this.options,
                    keyCode = $.ui.keyCode;

            switch (event.keyCode) {
                case keyCode.UP:
                    this._repeat(null, 1, event);
                    return true;
                case keyCode.DOWN:
                    this._repeat(null, -1, event);
                    return true;
                case keyCode.PAGE_UP:
                    this._repeat(null, options.page, event);
                    return true;
                case keyCode.PAGE_DOWN:
                    this._repeat(null, -options.page, event);
                    return true;
            }

            return false;
        },
        _uiSpinnerHtml: function () {
            return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
        },
        _buttonHtml: function () {
            return "" +
                    "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
                    "<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
                    "</a>" +
                    "<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
                    "<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
                    "</a>";
        },
        _start: function (event) {
            if (!this.spinning && this._trigger("start", event) === false) {
                return false;
            }

            if (!this.counter) {
                this.counter = 1;
            }
            this.spinning = true;
            return true;
        },
        _repeat: function (i, steps, event) {
            i = i || 500;

            clearTimeout(this.timer);
            this.timer = this._delay(function () {
                this._repeat(40, steps, event);
            }, i);

            this._spin(steps * this.options.step, event);
        },
        _spin: function (step, event) {
            var value = this.value() || 0;

            if (!this.counter) {
                this.counter = 1;
            }

            value = this._adjustValue(value + step * this._increment(this.counter));

            if (!this.spinning || this._trigger("spin", event, {value: value}) !== false) {
                this._value(value);
                this.counter++;
            }
        },
        _increment: function (i) {
            var incremental = this.options.incremental;

            if (incremental) {
                return $.isFunction(incremental) ?
                        incremental(i) :
                        Math.floor(i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1);
            }

            return 1;
        },
        _precision: function () {
            var precision = this._precisionOf(this.options.step);
            if (this.options.min !== null) {
                precision = Math.max(precision, this._precisionOf(this.options.min));
            }
            return precision;
        },
        _precisionOf: function (num) {
            var str = num.toString(),
                    decimal = str.indexOf(".");
            return decimal === -1 ? 0 : str.length - decimal - 1;
        },
        _adjustValue: function (value) {
            var base, aboveMin,
                    options = this.options;

            // make sure we're at a valid step
            // - find out where we are relative to the base (min or 0)
            base = options.min !== null ? options.min : 0;
            aboveMin = value - base;
            // - round to the nearest step
            aboveMin = Math.round(aboveMin / options.step) * options.step;
            // - rounding is based on 0, so adjust back to our base
            value = base + aboveMin;

            // fix precision from bad JS floating point math
            value = parseFloat(value.toFixed(this._precision()));

            // clamp the value
            if (options.max !== null && value > options.max) {
                return options.max;
            }
            if (options.min !== null && value < options.min) {
                return options.min;
            }

            return value;
        },
        _stop: function (event) {
            if (!this.spinning) {
                return;
            }

            clearTimeout(this.timer);
            clearTimeout(this.mousewheelTimer);
            this.counter = 0;
            this.spinning = false;
            this._trigger("stop", event);
        },
        _setOption: function (key, value) {
            if (key === "culture" || key === "numberFormat") {
                var prevValue = this._parse(this.element.val());
                this.options[ key ] = value;
                this.element.val(this._format(prevValue));
                return;
            }

            if (key === "max" || key === "min" || key === "step") {
                if (typeof value === "string") {
                    value = this._parse(value);
                }
            }
            if (key === "icons") {
                this.buttons.first().find(".ui-icon")
                        .removeClass(this.options.icons.up)
                        .addClass(value.up);
                this.buttons.last().find(".ui-icon")
                        .removeClass(this.options.icons.down)
                        .addClass(value.down);
            }

            this._super(key, value);

            if (key === "disabled") {
                if (value) {
                    this.element.prop("disabled", true);
                    this.buttons.button("disable");
                } else {
                    this.element.prop("disabled", false);
                    this.buttons.button("enable");
                }
            }
        },
        _setOptions: modifier(function (options) {
            this._super(options);
            this._value(this.element.val());
        }),
        _parse: function (val) {
            if (typeof val === "string" && val !== "") {
                val = window.Globalize && this.options.numberFormat ?
                        Globalize.parseFloat(val, 10, this.options.culture) : +val;
            }
            return val === "" || isNaN(val) ? null : val;
        },
        _format: function (value) {
            if (value === "") {
                return "";
            }
            return window.Globalize && this.options.numberFormat ?
                    Globalize.format(value, this.options.numberFormat, this.options.culture) :
                    value;
        },
        _refresh: function () {
            this.element.attr({
                "aria-valuemin": this.options.min,
                "aria-valuemax": this.options.max,
                // TODO: what should we do with values that can't be parsed?
                "aria-valuenow": this._parse(this.element.val())
            });
        },
        // update the value without triggering change
        _value: function (value, allowAny) {
            var parsed;
            if (value !== "") {
                parsed = this._parse(value);
                if (parsed !== null) {
                    if (!allowAny) {
                        parsed = this._adjustValue(parsed);
                    }
                    value = this._format(parsed);
                }
            }
            this.element.val(value);
            this._refresh();
        },
        _destroy: function () {
            this.element
                    .removeClass("ui-spinner-input")
                    .prop("disabled", false)
                    .removeAttr("autocomplete")
                    .removeAttr("role")
                    .removeAttr("aria-valuemin")
                    .removeAttr("aria-valuemax")
                    .removeAttr("aria-valuenow");
            this.uiSpinner.replaceWith(this.element);
        },
        stepUp: modifier(function (steps) {
            this._stepUp(steps);
        }),
        _stepUp: function (steps) {
            if (this._start()) {
                this._spin((steps || 1) * this.options.step);
                this._stop();
            }
        },
        stepDown: modifier(function (steps) {
            this._stepDown(steps);
        }),
        _stepDown: function (steps) {
            if (this._start()) {
                this._spin((steps || 1) * -this.options.step);
                this._stop();
            }
        },
        pageUp: modifier(function (pages) {
            this._stepUp((pages || 1) * this.options.page);
        }),
        pageDown: modifier(function (pages) {
            this._stepDown((pages || 1) * this.options.page);
        }),
        value: function (newVal) {
            if (!arguments.length) {
                return this._parse(this.element.val());
            }
            modifier(this._value).call(this, newVal);
        },
        widget: function () {
            return this.uiSpinner;
        }
    });

}(jQuery));

(function ($, undefined) {

    var tabId = 0,
            rhash = /#.*$/;

    function getNextTabId() {
        return ++tabId;
    }

    function isLocal(anchor) {
        return anchor.hash.length > 1 &&
                decodeURIComponent(anchor.href.replace(rhash, "")) ===
                decodeURIComponent(location.href.replace(rhash, ""));
    }

    $.widget("ui.tabs", {
        version: "1.10.2",
        delay: 300,
        options: {
            active: null,
            collapsible: false,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            // callbacks
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _create: function () {
            var that = this,
                    options = this.options;

            this.running = false;

            this.element
                    .addClass("ui-tabs ui-widget ui-widget-content ui-corner-all")
                    .toggleClass("ui-tabs-collapsible", options.collapsible)
                    // Prevent users from focusing disabled tabs via click
                    .delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function (event) {
                        if ($(this).is(".ui-state-disabled")) {
                            event.preventDefault();
                        }
                    })
                    // support: IE <9
                    // Preventing the default action in mousedown doesn't prevent IE
                    // from focusing the element, so if the anchor gets focused, blur.
                    // We don't have to worry about focusing the previously focused
                    // element since clicking on a non-focusable element should focus
                    // the body anyway.
                    .delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function () {
                        if ($(this).closest("li").is(".ui-state-disabled")) {
                            this.blur();
                        }
                    });

            this._processTabs();
            options.active = this._initialActive();

            // Take disabling tabs via class attribute from HTML
            // into account and update option properly.
            if ($.isArray(options.disabled)) {
                options.disabled = $.unique(options.disabled.concat(
                        $.map(this.tabs.filter(".ui-state-disabled"), function (li) {
                            return that.tabs.index(li);
                        })
                        )).sort();
            }

            // check for length avoids error when initializing empty list
            if (this.options.active !== false && this.anchors.length) {
                this.active = this._findActive(options.active);
            } else {
                this.active = $();
            }

            this._refresh();

            if (this.active.length) {
                this.load(options.active);
            }
        },
        _initialActive: function () {
            var active = this.options.active,
                    collapsible = this.options.collapsible,
                    locationHash = location.hash.substring(1);

            if (active === null) {
                // check the fragment identifier in the URL
                if (locationHash) {
                    this.tabs.each(function (i, tab) {
                        if ($(tab).attr("aria-controls") === locationHash) {
                            active = i;
                            return false;
                        }
                    });
                }

                // check for a tab marked active via a class
                if (active === null) {
                    active = this.tabs.index(this.tabs.filter(".ui-tabs-active"));
                }

                // no active tab, set to false
                if (active === null || active === -1) {
                    active = this.tabs.length ? 0 : false;
                }
            }

            // handle numbers: negative, out of range
            if (active !== false) {
                active = this.tabs.index(this.tabs.eq(active));
                if (active === -1) {
                    active = collapsible ? false : 0;
                }
            }

            // don't allow collapsible: false and active: false
            if (!collapsible && active === false && this.anchors.length) {
                active = 0;
            }

            return active;
        },
        _getCreateEventData: function () {
            return {
                tab: this.active,
                panel: !this.active.length ? $() : this._getPanelForTab(this.active)
            };
        },
        _tabKeydown: function (event) {
            /*jshint maxcomplexity:15*/
            var focusedTab = $(this.document[0].activeElement).closest("li"),
                    selectedIndex = this.tabs.index(focusedTab),
                    goingForward = true;

            if (this._handlePageNav(event)) {
                return;
            }

            switch (event.keyCode) {
                case $.ui.keyCode.RIGHT:
                case $.ui.keyCode.DOWN:
                    selectedIndex++;
                    break;
                case $.ui.keyCode.UP:
                case $.ui.keyCode.LEFT:
                    goingForward = false;
                    selectedIndex--;
                    break;
                case $.ui.keyCode.END:
                    selectedIndex = this.anchors.length - 1;
                    break;
                case $.ui.keyCode.HOME:
                    selectedIndex = 0;
                    break;
                case $.ui.keyCode.SPACE:
                    // Activate only, no collapsing
                    event.preventDefault();
                    clearTimeout(this.activating);
                    this._activate(selectedIndex);
                    return;
                case $.ui.keyCode.ENTER:
                    // Toggle (cancel delayed activation, allow collapsing)
                    event.preventDefault();
                    clearTimeout(this.activating);
                    // Determine if we should collapse or activate
                    this._activate(selectedIndex === this.options.active ? false : selectedIndex);
                    return;
                default:
                    return;
            }

            // Focus the appropriate tab, based on which key was pressed
            event.preventDefault();
            clearTimeout(this.activating);
            selectedIndex = this._focusNextTab(selectedIndex, goingForward);

            // Navigating with control key will prevent automatic activation
            if (!event.ctrlKey) {
                // Update aria-selected immediately so that AT think the tab is already selected.
                // Otherwise AT may confuse the user by stating that they need to activate the tab,
                // but the tab will already be activated by the time the announcement finishes.
                focusedTab.attr("aria-selected", "false");
                this.tabs.eq(selectedIndex).attr("aria-selected", "true");

                this.activating = this._delay(function () {
                    this.option("active", selectedIndex);
                }, this.delay);
            }
        },
        _panelKeydown: function (event) {
            if (this._handlePageNav(event)) {
                return;
            }

            // Ctrl+up moves focus to the current tab
            if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
                event.preventDefault();
                this.active.focus();
            }
        },
        // Alt+page up/down moves focus to the previous/next tab (and activates)
        _handlePageNav: function (event) {
            if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP) {
                this._activate(this._focusNextTab(this.options.active - 1, false));
                return true;
            }
            if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN) {
                this._activate(this._focusNextTab(this.options.active + 1, true));
                return true;
            }
        },
        _findNextTab: function (index, goingForward) {
            var lastTabIndex = this.tabs.length - 1;

            function constrain() {
                if (index > lastTabIndex) {
                    index = 0;
                }
                if (index < 0) {
                    index = lastTabIndex;
                }
                return index;
            }

            while ($.inArray(constrain(), this.options.disabled) !== -1) {
                index = goingForward ? index + 1 : index - 1;
            }

            return index;
        },
        _focusNextTab: function (index, goingForward) {
            index = this._findNextTab(index, goingForward);
            this.tabs.eq(index).focus();
            return index;
        },
        _setOption: function (key, value) {
            if (key === "active") {
                // _activate() will handle invalid values and update this.options
                this._activate(value);
                return;
            }

            if (key === "disabled") {
                // don't use the widget factory's disabled handling
                this._setupDisabled(value);
                return;
            }

            this._super(key, value);

            if (key === "collapsible") {
                this.element.toggleClass("ui-tabs-collapsible", value);
                // Setting collapsible: false while collapsed; open first panel
                if (!value && this.options.active === false) {
                    this._activate(0);
                }
            }

            if (key === "event") {
                this._setupEvents(value);
            }

            if (key === "heightStyle") {
                this._setupHeightStyle(value);
            }
        },
        _tabId: function (tab) {
            return tab.attr("aria-controls") || "ui-tabs-" + getNextTabId();
        },
        _sanitizeSelector: function (hash) {
            return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
        },
        refresh: function () {
            var options = this.options,
                    lis = this.tablist.children(":has(a[href])");

            // get disabled tabs from class attribute from HTML
            // this will get converted to a boolean if needed in _refresh()
            options.disabled = $.map(lis.filter(".ui-state-disabled"), function (tab) {
                return lis.index(tab);
            });

            this._processTabs();

            // was collapsed or no tabs
            if (options.active === false || !this.anchors.length) {
                options.active = false;
                this.active = $();
                // was active, but active tab is gone
            } else if (this.active.length && !$.contains(this.tablist[ 0 ], this.active[ 0 ])) {
                // all remaining tabs are disabled
                if (this.tabs.length === options.disabled.length) {
                    options.active = false;
                    this.active = $();
                    // activate previous tab
                } else {
                    this._activate(this._findNextTab(Math.max(0, options.active - 1), false));
                }
                // was active, active tab still exists
            } else {
                // make sure active index is correct
                options.active = this.tabs.index(this.active);
            }

            this._refresh();
        },
        _refresh: function () {
            this._setupDisabled(this.options.disabled);
            this._setupEvents(this.options.event);
            this._setupHeightStyle(this.options.heightStyle);

            this.tabs.not(this.active).attr({
                "aria-selected": "false",
                tabIndex: -1
            });
            this.panels.not(this._getPanelForTab(this.active))
                    .hide()
                    .attr({
                        "aria-expanded": "false",
                        "aria-hidden": "true"
                    });

            // Make sure one tab is in the tab order
            if (!this.active.length) {
                this.tabs.eq(0).attr("tabIndex", 0);
            } else {
                this.active
                        .addClass("ui-tabs-active ui-state-active")
                        .attr({
                            "aria-selected": "true",
                            tabIndex: 0
                        });
                this._getPanelForTab(this.active)
                        .show()
                        .attr({
                            "aria-expanded": "true",
                            "aria-hidden": "false"
                        });
            }
        },
        _processTabs: function () {
            var that = this;

            this.tablist = this._getList()
                    .addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")
                    .attr("role", "tablist");

            this.tabs = this.tablist.find("> li:has(a[href])")
                    .addClass("ui-state-default ui-corner-top")
                    .attr({
                        role: "tab",
                        tabIndex: -1
                    });

            this.anchors = this.tabs.map(function () {
                return $("a", this)[ 0 ];
            })
                    .addClass("ui-tabs-anchor")
                    .attr({
                        role: "presentation",
                        tabIndex: -1
                    });

            this.panels = $();

            this.anchors.each(function (i, anchor) {
                var selector, panel, panelId,
                        anchorId = $(anchor).uniqueId().attr("id"),
                        tab = $(anchor).closest("li"),
                        originalAriaControls = tab.attr("aria-controls");

                // inline tab
                if (isLocal(anchor)) {
                    selector = anchor.hash;
                    panel = that.element.find(that._sanitizeSelector(selector));
                    // remote tab
                } else {
                    panelId = that._tabId(tab);
                    selector = "#" + panelId;
                    panel = that.element.find(selector);
                    if (!panel.length) {
                        panel = that._createPanel(panelId);
                        panel.insertAfter(that.panels[ i - 1 ] || that.tablist);
                    }
                    panel.attr("aria-live", "polite");
                }

                if (panel.length) {
                    that.panels = that.panels.add(panel);
                }
                if (originalAriaControls) {
                    tab.data("ui-tabs-aria-controls", originalAriaControls);
                }
                tab.attr({
                    "aria-controls": selector.substring(1),
                    "aria-labelledby": anchorId
                });
                panel.attr("aria-labelledby", anchorId);
            });

            this.panels
                    .addClass("ui-tabs-panel ui-widget-content ui-corner-bottom")
                    .attr("role", "tabpanel");
        },
        // allow overriding how to find the list for rare usage scenarios (#7715)
        _getList: function () {
            return this.element.find("ol,ul").eq(0);
        },
        _createPanel: function (id) {
            return $("<div>")
                    .attr("id", id)
                    .addClass("ui-tabs-panel ui-widget-content ui-corner-bottom")
                    .data("ui-tabs-destroy", true);
        },
        _setupDisabled: function (disabled) {
            if ($.isArray(disabled)) {
                if (!disabled.length) {
                    disabled = false;
                } else if (disabled.length === this.anchors.length) {
                    disabled = true;
                }
            }

            // disable tabs
            for (var i = 0, li; (li = this.tabs[ i ]); i++) {
                if (disabled === true || $.inArray(i, disabled) !== -1) {
                    $(li)
                            .addClass("ui-state-disabled")
                            .attr("aria-disabled", "true");
                } else {
                    $(li)
                            .removeClass("ui-state-disabled")
                            .removeAttr("aria-disabled");
                }
            }

            this.options.disabled = disabled;
        },
        _setupEvents: function (event) {
            var events = {
                click: function (event) {
                    event.preventDefault();
                }
            };
            if (event) {
                $.each(event.split(" "), function (index, eventName) {
                    events[ eventName ] = "_eventHandler";
                });
            }

            this._off(this.anchors.add(this.tabs).add(this.panels));
            this._on(this.anchors, events);
            this._on(this.tabs, {keydown: "_tabKeydown"});
            this._on(this.panels, {keydown: "_panelKeydown"});

            this._focusable(this.tabs);
            this._hoverable(this.tabs);
        },
        _setupHeightStyle: function (heightStyle) {
            var maxHeight,
                    parent = this.element.parent();

            if (heightStyle === "fill") {
                maxHeight = parent.height();
                maxHeight -= this.element.outerHeight() - this.element.height();

                this.element.siblings(":visible").each(function () {
                    var elem = $(this),
                            position = elem.css("position");

                    if (position === "absolute" || position === "fixed") {
                        return;
                    }
                    maxHeight -= elem.outerHeight(true);
                });

                this.element.children().not(this.panels).each(function () {
                    maxHeight -= $(this).outerHeight(true);
                });

                this.panels.each(function () {
                    $(this).height(Math.max(0, maxHeight -
                            $(this).innerHeight() + $(this).height()));
                })
                        .css("overflow", "auto");
            } else if (heightStyle === "auto") {
                maxHeight = 0;
                this.panels.each(function () {
                    maxHeight = Math.max(maxHeight, $(this).height("").height());
                }).height(maxHeight);
            }
        },
        _eventHandler: function (event) {
            var options = this.options,
                    active = this.active,
                    anchor = $(event.currentTarget),
                    tab = anchor.closest("li"),
                    clickedIsActive = tab[ 0 ] === active[ 0 ],
                    collapsing = clickedIsActive && options.collapsible,
                    toShow = collapsing ? $() : this._getPanelForTab(tab),
                    toHide = !active.length ? $() : this._getPanelForTab(active),
                    eventData = {
                        oldTab: active,
                        oldPanel: toHide,
                        newTab: collapsing ? $() : tab,
                        newPanel: toShow
                    };

            event.preventDefault();

            if (tab.hasClass("ui-state-disabled") ||
                    // tab is already loading
                    tab.hasClass("ui-tabs-loading") ||
                    // can't switch durning an animation
                    this.running ||
                    // click on active header, but not collapsible
                            (clickedIsActive && !options.collapsible) ||
                            // allow canceling activation
                                    (this._trigger("beforeActivate", event, eventData) === false)) {
                        return;
                    }

                    options.active = collapsing ? false : this.tabs.index(tab);

                    this.active = clickedIsActive ? $() : tab;
                    if (this.xhr) {
                        this.xhr.abort();
                    }

                    if (!toHide.length && !toShow.length) {
                        $.error("jQuery UI Tabs: Mismatching fragment identifier.");
                    }

                    if (toShow.length) {
                        this.load(this.tabs.index(tab), event);
                    }
                    this._toggle(event, eventData);
                },
                // handles show/hide for selecting tabs
                _toggle: function (event, eventData) {
                    var that = this,
                            toShow = eventData.newPanel,
                            toHide = eventData.oldPanel;

                    this.running = true;

                    function complete() {
                        that.running = false;
                        that._trigger("activate", event, eventData);
                    }

                    function show() {
                        eventData.newTab.closest("li").addClass("ui-tabs-active ui-state-active");

                        if (toShow.length && that.options.show) {
                            that._show(toShow, that.options.show, complete);
                        } else {
                            toShow.show();
                            complete();
                        }
                    }

                    // start out by hiding, then showing, then completing
                    if (toHide.length && this.options.hide) {
                        this._hide(toHide, this.options.hide, function () {
                            eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                            show();
                        });
                    } else {
                        eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                        toHide.hide();
                        show();
                    }

                    toHide.attr({
                        "aria-expanded": "false",
                        "aria-hidden": "true"
                    });
                    eventData.oldTab.attr("aria-selected", "false");
                    // If we're switching tabs, remove the old tab from the tab order.
                    // If we're opening from collapsed state, remove the previous tab from the tab order.
                    // If we're collapsing, then keep the collapsing tab in the tab order.
                    if (toShow.length && toHide.length) {
                        eventData.oldTab.attr("tabIndex", -1);
                    } else if (toShow.length) {
                        this.tabs.filter(function () {
                            return $(this).attr("tabIndex") === 0;
                        })
                                .attr("tabIndex", -1);
                    }

                    toShow.attr({
                        "aria-expanded": "true",
                        "aria-hidden": "false"
                    });
                    eventData.newTab.attr({
                        "aria-selected": "true",
                        tabIndex: 0
                    });
                },
                _activate: function (index) {
                    var anchor,
                            active = this._findActive(index);

                    // trying to activate the already active panel
                    if (active[ 0 ] === this.active[ 0 ]) {
                        return;
                    }

                    // trying to collapse, simulate a click on the current active header
                    if (!active.length) {
                        active = this.active;
                    }

                    anchor = active.find(".ui-tabs-anchor")[ 0 ];
                    this._eventHandler({
                        target: anchor,
                        currentTarget: anchor,
                        preventDefault: $.noop
                    });
                },
                _findActive: function (index) {
                    return index === false ? $() : this.tabs.eq(index);
                },
                _getIndex: function (index) {
                    // meta-function to give users option to provide a href string instead of a numerical index.
                    if (typeof index === "string") {
                        index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"));
                    }

                    return index;
                },
                _destroy: function () {
                    if (this.xhr) {
                        this.xhr.abort();
                    }

                    this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");

                    this.tablist
                            .removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")
                            .removeAttr("role");

                    this.anchors
                            .removeClass("ui-tabs-anchor")
                            .removeAttr("role")
                            .removeAttr("tabIndex")
                            .removeUniqueId();

                    this.tabs.add(this.panels).each(function () {
                        if ($.data(this, "ui-tabs-destroy")) {
                            $(this).remove();
                        } else {
                            $(this)
                                    .removeClass("ui-state-default ui-state-active ui-state-disabled " +
                                            "ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel")
                                    .removeAttr("tabIndex")
                                    .removeAttr("aria-live")
                                    .removeAttr("aria-busy")
                                    .removeAttr("aria-selected")
                                    .removeAttr("aria-labelledby")
                                    .removeAttr("aria-hidden")
                                    .removeAttr("aria-expanded")
                                    .removeAttr("role");
                        }
                    });

                    this.tabs.each(function () {
                        var li = $(this),
                                prev = li.data("ui-tabs-aria-controls");
                        if (prev) {
                            li
                                    .attr("aria-controls", prev)
                                    .removeData("ui-tabs-aria-controls");
                        } else {
                            li.removeAttr("aria-controls");
                        }
                    });

                    this.panels.show();

                    if (this.options.heightStyle !== "content") {
                        this.panels.css("height", "");
                    }
                },
                enable: function (index) {
                    var disabled = this.options.disabled;
                    if (disabled === false) {
                        return;
                    }

                    if (index === undefined) {
                        disabled = false;
                    } else {
                        index = this._getIndex(index);
                        if ($.isArray(disabled)) {
                            disabled = $.map(disabled, function (num) {
                                return num !== index ? num : null;
                            });
                        } else {
                            disabled = $.map(this.tabs, function (li, num) {
                                return num !== index ? num : null;
                            });
                        }
                    }
                    this._setupDisabled(disabled);
                },
                disable: function (index) {
                    var disabled = this.options.disabled;
                    if (disabled === true) {
                        return;
                    }

                    if (index === undefined) {
                        disabled = true;
                    } else {
                        index = this._getIndex(index);
                        if ($.inArray(index, disabled) !== -1) {
                            return;
                        }
                        if ($.isArray(disabled)) {
                            disabled = $.merge([index], disabled).sort();
                        } else {
                            disabled = [index];
                        }
                    }
                    this._setupDisabled(disabled);
                },
                load: function (index, event) {
                    index = this._getIndex(index);
                    var that = this,
                            tab = this.tabs.eq(index),
                            anchor = tab.find(".ui-tabs-anchor"),
                            panel = this._getPanelForTab(tab),
                            eventData = {
                                tab: tab,
                                panel: panel
                            };

                    // not remote
                    if (isLocal(anchor[ 0 ])) {
                        return;
                    }

                    this.xhr = $.ajax(this._ajaxSettings(anchor, event, eventData));

                    // support: jQuery <1.8
                    // jQuery <1.8 returns false if the request is canceled in beforeSend,
                    // but as of 1.8, $.ajax() always returns a jqXHR object.
                    if (this.xhr && this.xhr.statusText !== "canceled") {
                        tab.addClass("ui-tabs-loading");
                        panel.attr("aria-busy", "true");

                        this.xhr
                                .success(function (response) {
                                    // support: jQuery <1.8
                                    // http://bugs.jquery.com/ticket/11778
                                    setTimeout(function () {
                                        panel.html(response);
                                        that._trigger("load", event, eventData);
                                    }, 1);
                                })
                                .complete(function (jqXHR, status) {
                                    // support: jQuery <1.8
                                    // http://bugs.jquery.com/ticket/11778
                                    setTimeout(function () {
                                        if (status === "abort") {
                                            that.panels.stop(false, true);
                                        }

                                        tab.removeClass("ui-tabs-loading");
                                        panel.removeAttr("aria-busy");

                                        if (jqXHR === that.xhr) {
                                            delete that.xhr;
                                        }
                                    }, 1);
                                });
                    }
                },
                _ajaxSettings: function (anchor, event, eventData) {
                    var that = this;
                    return {
                        url: anchor.attr("href"),
                        beforeSend: function (jqXHR, settings) {
                            return that._trigger("beforeLoad", event,
                                    $.extend({jqXHR: jqXHR, ajaxSettings: settings}, eventData));
                        }
                    };
                },
                _getPanelForTab: function (tab) {
                    var id = $(tab).attr("aria-controls");
                    return this.element.find(this._sanitizeSelector("#" + id));
                }
            });

})(jQuery);

(function ($) {

    var increments = 0;

    function addDescribedBy(elem, id) {
        var describedby = (elem.attr("aria-describedby") || "").split(/\s+/);
        describedby.push(id);
        elem
                .data("ui-tooltip-id", id)
                .attr("aria-describedby", $.trim(describedby.join(" ")));
    }

    function removeDescribedBy(elem) {
        var id = elem.data("ui-tooltip-id"),
                describedby = (elem.attr("aria-describedby") || "").split(/\s+/),
                index = $.inArray(id, describedby);
        if (index !== -1) {
            describedby.splice(index, 1);
        }

        elem.removeData("ui-tooltip-id");
        describedby = $.trim(describedby.join(" "));
        if (describedby) {
            elem.attr("aria-describedby", describedby);
        } else {
            elem.removeAttr("aria-describedby");
        }
    }

    $.widget("ui.tooltip", {
        version: "1.10.2",
        options: {
            content: function () {
                // support: IE<9, Opera in jQuery <1.7
                // .text() can't accept undefined, so coerce to a string
                var title = $(this).attr("title") || "";
                // Escape title, since we're going from an attribute to raw HTML
                return $("<a>").text(title).html();
            },
            hide: true,
            // Disabled elements have inconsistent behavior across browsers (#8661)
            items: "[title]:not([disabled])",
            position: {
                my: "left top+15",
                at: "left bottom",
                collision: "flipfit flip"
            },
            show: true,
            tooltipClass: null,
            track: false,
            // callbacks
            close: null,
            open: null
        },
        _create: function () {
            this._on({
                mouseover: "open",
                focusin: "open"
            });

            // IDs of generated tooltips, needed for destroy
            this.tooltips = {};
            // IDs of parent tooltips where we removed the title attribute
            this.parents = {};

            if (this.options.disabled) {
                this._disable();
            }
        },
        _setOption: function (key, value) {
            var that = this;

            if (key === "disabled") {
                this[ value ? "_disable" : "_enable" ]();
                this.options[ key ] = value;
                // disable element style changes
                return;
            }

            this._super(key, value);

            if (key === "content") {
                $.each(this.tooltips, function (id, element) {
                    that._updateContent(element);
                });
            }
        },
        _disable: function () {
            var that = this;

            // close open tooltips
            $.each(this.tooltips, function (id, element) {
                var event = $.Event("blur");
                event.target = event.currentTarget = element[0];
                that.close(event, true);
            });

            // remove title attributes to prevent native tooltips
            this.element.find(this.options.items).addBack().each(function () {
                var element = $(this);
                if (element.is("[title]")) {
                    element
                            .data("ui-tooltip-title", element.attr("title"))
                            .attr("title", "");
                }
            });
        },
        _enable: function () {
            // restore title attributes
            this.element.find(this.options.items).addBack().each(function () {
                var element = $(this);
                if (element.data("ui-tooltip-title")) {
                    element.attr("title", element.data("ui-tooltip-title"));
                }
            });
        },
        open: function (event) {
            var that = this,
                    target = $(event ? event.target : this.element)
                    // we need closest here due to mouseover bubbling,
                    // but always pointing at the same event target
                    .closest(this.options.items);

            // No element to show a tooltip for or the tooltip is already open
            if (!target.length || target.data("ui-tooltip-id")) {
                return;
            }

            if (target.attr("title")) {
                target.data("ui-tooltip-title", target.attr("title"));
            }

            target.data("ui-tooltip-open", true);

            // kill parent tooltips, custom or native, for hover
            if (event && event.type === "mouseover") {
                target.parents().each(function () {
                    var parent = $(this),
                            blurEvent;
                    if (parent.data("ui-tooltip-open")) {
                        blurEvent = $.Event("blur");
                        blurEvent.target = blurEvent.currentTarget = this;
                        that.close(blurEvent, true);
                    }
                    if (parent.attr("title")) {
                        parent.uniqueId();
                        that.parents[ this.id ] = {
                            element: this,
                            title: parent.attr("title")
                        };
                        parent.attr("title", "");
                    }
                });
            }

            this._updateContent(target, event);
        },
        _updateContent: function (target, event) {
            var content,
                    contentOption = this.options.content,
                    that = this,
                    eventType = event ? event.type : null;

            if (typeof contentOption === "string") {
                return this._open(event, target, contentOption);
            }

            content = contentOption.call(target[0], function (response) {
                // ignore async response if tooltip was closed already
                if (!target.data("ui-tooltip-open")) {
                    return;
                }
                // IE may instantly serve a cached response for ajax requests
                // delay this call to _open so the other call to _open runs first
                that._delay(function () {
                    // jQuery creates a special event for focusin when it doesn't
                    // exist natively. To improve performance, the native event
                    // object is reused and the type is changed. Therefore, we can't
                    // rely on the type being correct after the event finished
                    // bubbling, so we set it back to the previous value. (#8740)
                    if (event) {
                        event.type = eventType;
                    }
                    this._open(event, target, response);
                });
            });
            if (content) {
                this._open(event, target, content);
            }
        },
        _open: function (event, target, content) {
            var tooltip, events, delayedShow,
                    positionOption = $.extend({}, this.options.position);

            if (!content) {
                return;
            }

            // Content can be updated multiple times. If the tooltip already
            // exists, then just update the content and bail.
            tooltip = this._find(target);
            if (tooltip.length) {
                tooltip.find(".ui-tooltip-content").html(content);
                return;
            }

            // if we have a title, clear it to prevent the native tooltip
            // we have to check first to avoid defining a title if none exists
            // (we don't want to cause an element to start matching [title])
            //
            // We use removeAttr only for key events, to allow IE to export the correct
            // accessible attributes. For mouse events, set to empty string to avoid
            // native tooltip showing up (happens only when removing inside mouseover).
            if (target.is("[title]")) {
                if (event && event.type === "mouseover") {
                    target.attr("title", "");
                } else {
                    target.removeAttr("title");
                }
            }

            tooltip = this._tooltip(target);
            addDescribedBy(target, tooltip.attr("id"));
            tooltip.find(".ui-tooltip-content").html(content);

            function position(event) {
                positionOption.of = event;
                if (tooltip.is(":hidden")) {
                    return;
                }
                tooltip.position(positionOption);
            }
            if (this.options.track && event && /^mouse/.test(event.type)) {
                this._on(this.document, {
                    mousemove: position
                });
                // trigger once to override element-relative positioning
                position(event);
            } else {
                tooltip.position($.extend({
                    of: target
                }, this.options.position));
            }

            tooltip.hide();

            this._show(tooltip, this.options.show);
            // Handle tracking tooltips that are shown with a delay (#8644). As soon
            // as the tooltip is visible, position the tooltip using the most recent
            // event.
            if (this.options.show && this.options.show.delay) {
                delayedShow = this.delayedShow = setInterval(function () {
                    if (tooltip.is(":visible")) {
                        position(positionOption.of);
                        clearInterval(delayedShow);
                    }
                }, $.fx.interval);
            }

            this._trigger("open", event, {tooltip: tooltip});

            events = {
                keyup: function (event) {
                    if (event.keyCode === $.ui.keyCode.ESCAPE) {
                        var fakeEvent = $.Event(event);
                        fakeEvent.currentTarget = target[0];
                        this.close(fakeEvent, true);
                    }
                },
                remove: function () {
                    this._removeTooltip(tooltip);
                }
            };
            if (!event || event.type === "mouseover") {
                events.mouseleave = "close";
            }
            if (!event || event.type === "focusin") {
                events.focusout = "close";
            }
            this._on(true, target, events);
        },
        close: function (event) {
            var that = this,
                    target = $(event ? event.currentTarget : this.element),
                    tooltip = this._find(target);

            // disabling closes the tooltip, so we need to track when we're closing
            // to avoid an infinite loop in case the tooltip becomes disabled on close
            if (this.closing) {
                return;
            }

            // Clear the interval for delayed tracking tooltips
            clearInterval(this.delayedShow);

            // only set title if we had one before (see comment in _open())
            if (target.data("ui-tooltip-title")) {
                target.attr("title", target.data("ui-tooltip-title"));
            }

            removeDescribedBy(target);

            tooltip.stop(true);
            this._hide(tooltip, this.options.hide, function () {
                that._removeTooltip($(this));
            });

            target.removeData("ui-tooltip-open");
            this._off(target, "mouseleave focusout keyup");
            // Remove 'remove' binding only on delegated targets
            if (target[0] !== this.element[0]) {
                this._off(target, "remove");
            }
            this._off(this.document, "mousemove");

            if (event && event.type === "mouseleave") {
                $.each(this.parents, function (id, parent) {
                    $(parent.element).attr("title", parent.title);
                    delete that.parents[ id ];
                });
            }

            this.closing = true;
            this._trigger("close", event, {tooltip: tooltip});
            this.closing = false;
        },
        _tooltip: function (element) {
            var id = "ui-tooltip-" + increments++,
                    tooltip = $("<div>")
                    .attr({
                        id: id,
                        role: "tooltip"
                    })
                    .addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " +
                            (this.options.tooltipClass || ""));
            $("<div>")
                    .addClass("ui-tooltip-content")
                    .appendTo(tooltip);
            tooltip.appendTo(this.document[0].body);
            this.tooltips[ id ] = element;
            return tooltip;
        },
        _find: function (target) {
            var id = target.data("ui-tooltip-id");
            return id ? $("#" + id) : $();
        },
        _removeTooltip: function (tooltip) {
            tooltip.remove();
            delete this.tooltips[ tooltip.attr("id") ];
        },
        _destroy: function () {
            var that = this;

            // close open tooltips
            $.each(this.tooltips, function (id, element) {
                // Delegate to close method to handle common cleanup
                var event = $.Event("blur");
                event.target = event.currentTarget = element[0];
                that.close(event, true);

                // Remove immediately; destroying an open tooltip doesn't use the
                // hide animation
                $("#" + id).remove();

                // Restore the title
                if (element.data("ui-tooltip-title")) {
                    element.attr("title", element.data("ui-tooltip-title"));
                    element.removeData("ui-tooltip-title");
                }
            });
        }
    });

}(jQuery));
/*End jQuery UI - v1.10.2 - 2013-03-14*/

/*Start moment.js version : 2.9.0*/
(function (a) {
    function b(a, b, c) {
        switch (arguments.length) {
            case 2:
                return null != a ? a : b;
            case 3:
                return null != a ? a : null != b ? b : c;
            default:
                throw new Error("Implement me")
        }
    }

    function c(a, b) {
        return Bb.call(a, b)
    }

    function d() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function e(a) {
        vb.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + a)
    }

    function f(a, b) {
        var c = !0;
        return o(function () {
            return c && (e(a), c = !1), b.apply(this, arguments)
        }, b)
    }

    function g(a, b) {
        sc[a] || (e(b), sc[a] = !0)
    }

    function h(a, b) {
        return function (c) {
            return r(a.call(this, c), b)
        }
    }

    function i(a, b) {
        return function (c) {
            return this.localeData().ordinal(a.call(this, c), b)
        }
    }

    function j(a, b) {
        var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
                f = a.clone().add(e, "months");
        return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
    }

    function k(a, b, c) {
        var d;
        return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
    }

    function l() {}

    function m(a, b) {
        b !== !1 && H(a), p(this, a), this._d = new Date(+a._d), uc === !1 && (uc = !0, vb.updateOffset(this), uc = !1)
    }

    function n(a) {
        var b = A(a),
                c = b.year || 0,
                d = b.quarter || 0,
                e = b.month || 0,
                f = b.week || 0,
                g = b.day || 0,
                h = b.hour || 0,
                i = b.minute || 0,
                j = b.second || 0,
                k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = vb.localeData(), this._bubble()
    }

    function o(a, b) {
        for (var d in b)
            c(b, d) && (a[d] = b[d]);
        return c(b, "toString") && (a.toString = b.toString), c(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function p(a, b) {
        var c, d, e;
        if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = b._pf), "undefined" != typeof b._locale && (a._locale = b._locale), Kb.length > 0)
            for (c in Kb)
                d = Kb[c], e = b[d], "undefined" != typeof e && (a[d] = e);
        return a
    }

    function q(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function r(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b; )
            d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }

    function s(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function t(a, b) {
        var c;
        return b = M(b, a), a.isBefore(b) ? c = s(a, b) : (c = s(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c
    }

    function u(a, b) {
        return function (c, d) {
            var e, f;
            return null === d || isNaN(+d) || (g(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = vb.duration(c, d), v(this, e, a), this
        }
    }

    function v(a, b, c, d) {
        var e = b._milliseconds,
                f = b._days,
                g = b._months;
        d = null == d ? !0 : d, e && a._d.setTime(+a._d + e * c), f && pb(a, "Date", ob(a, "Date") + f * c), g && nb(a, ob(a, "Month") + g * c), d && vb.updateOffset(a, f || g)
    }

    function w(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function x(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }

    function y(a, b, c) {
        var d, e = Math.min(a.length, b.length),
                f = Math.abs(a.length - b.length),
                g = 0;
        for (d = 0; e > d; d++)
            (c && a[d] !== b[d] || !c && C(a[d]) !== C(b[d])) && g++;
        return g + f
    }

    function z(a) {
        if (a) {
            var b = a.toLowerCase().replace(/(.)s$/, "$1");
            a = lc[a] || mc[b] || b
        }
        return a
    }

    function A(a) {
        var b, d, e = {};
        for (d in a)
            c(a, d) && (b = z(d), b && (e[b] = a[d]));
        return e
    }

    function B(b) {
        var c, d;
        if (0 === b.indexOf("week"))
            c = 7, d = "day";
        else {
            if (0 !== b.indexOf("month"))
                return;
            c = 12, d = "month"
        }
        vb[b] = function (e, f) {
            var g, h, i = vb._locale[b],
                    j = [];
            if ("number" == typeof e && (f = e, e = a), h = function (a) {
                var b = vb().utc().set(d, a);
                return i.call(vb._locale, b, e || "")
            }, null != f)
                return h(f);
            for (g = 0; c > g; g++)
                j.push(h(g));
            return j
        }
    }

    function C(a) {
        var b = +a,
                c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function D(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function E(a, b, c) {
        return jb(vb([a, 11, 31 + b - c]), b, c).week
    }

    function F(a) {
        return G(a) ? 366 : 365
    }

    function G(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function H(a) {
        var b;
        a._a && -2 === a._pf.overflow && (b = a._a[Db] < 0 || a._a[Db] > 11 ? Db : a._a[Eb] < 1 || a._a[Eb] > D(a._a[Cb], a._a[Db]) ? Eb : a._a[Fb] < 0 || a._a[Fb] > 24 || 24 === a._a[Fb] && (0 !== a._a[Gb] || 0 !== a._a[Hb] || 0 !== a._a[Ib]) ? Fb : a._a[Gb] < 0 || a._a[Gb] > 59 ? Gb : a._a[Hb] < 0 || a._a[Hb] > 59 ? Hb : a._a[Ib] < 0 || a._a[Ib] > 999 ? Ib : -1, a._pf._overflowDayOfYear && (Cb > b || b > Eb) && (b = Eb), a._pf.overflow = b)
    }

    function I(b) {
        return null == b._isValid && (b._isValid = !isNaN(b._d.getTime()) && b._pf.overflow < 0 && !b._pf.empty && !b._pf.invalidMonth && !b._pf.nullInput && !b._pf.invalidFormat && !b._pf.userInvalidated, b._strict && (b._isValid = b._isValid && 0 === b._pf.charsLeftOver && 0 === b._pf.unusedTokens.length && b._pf.bigHour === a)), b._isValid
    }

    function J(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function K(a) {
        for (var b, c, d, e, f = 0; f < a.length; ) {
            for (e = J(a[f]).split("-"), b = e.length, c = J(a[f + 1]), c = c ? c.split("-") : null; b > 0; ) {
                if (d = L(e.slice(0, b).join("-")))
                    return d;
                if (c && c.length >= b && y(e, c, !0) >= b - 1)
                    break;
                b--
            }
            f++
        }
        return null
    }

    function L(a) {
        var b = null;
        if (!Jb[a] && Lb)
            try {
                b = vb.locale(), require("./locale/" + a), vb.locale(b)
            } catch (c) {
            }
        return Jb[a]
    }

    function M(a, b) {
        var c, d;
        return b._isUTC ? (c = b.clone(), d = (vb.isMoment(a) || x(a) ? +a : +vb(a)) - +c, c._d.setTime(+c._d + d), vb.updateOffset(c, !1), c) : vb(a).local()
    }

    function N(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function O(a) {
        var b, c, d = a.match(Pb);
        for (b = 0, c = d.length; c > b; b++)
            d[b] = rc[d[b]] ? rc[d[b]] : N(d[b]);
        return function (e) {
            var f = "";
            for (b = 0; c > b; b++)
                f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function P(a, b) {
        return a.isValid() ? (b = Q(b, a.localeData()), nc[b] || (nc[b] = O(b)), nc[b](a)) : a.localeData().invalidDate()
    }

    function Q(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (Qb.lastIndex = 0; d >= 0 && Qb.test(a); )
            a = a.replace(Qb, c), Qb.lastIndex = 0, d -= 1;
        return a
    }

    function R(a, b) {
        var c, d = b._strict;
        switch (a) {
            case "Q":
                return _b;
            case "DDDD":
                return bc;
            case "YYYY":
            case "GGGG":
            case "gggg":
                return d ? cc : Tb;
            case "Y":
            case "G":
            case "g":
                return ec;
            case "YYYYYY":
            case "YYYYY":
            case "GGGGG":
            case "ggggg":
                return d ? dc : Ub;
            case "S":
                if (d)
                    return _b;
            case "SS":
                if (d)
                    return ac;
            case "SSS":
                if (d)
                    return bc;
            case "DDD":
                return Sb;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
                return Wb;
            case "a":
            case "A":
                return b._locale._meridiemParse;
            case "x":
                return Zb;
            case "X":
                return $b;
            case "Z":
            case "ZZ":
                return Xb;
            case "T":
                return Yb;
            case "SSSS":
                return Vb;
            case "MM":
            case "DD":
            case "YY":
            case "GG":
            case "gg":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "ww":
            case "WW":
                return d ? ac : Rb;
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
            case "w":
            case "W":
            case "e":
            case "E":
                return Rb;
            case "Do":
                return d ? b._locale._ordinalParse : b._locale._ordinalParseLenient;
            default:
                return c = new RegExp($(Z(a.replace("\\", "")), "i"))
        }
    }

    function S(a) {
        a = a || "";
        var b = a.match(Xb) || [],
                c = b[b.length - 1] || [],
                d = (c + "").match(jc) || ["-", 0, 0],
                e = +(60 * d[1]) + C(d[2]);
        return "+" === d[0] ? e : -e
    }

    function T(a, b, c) {
        var d, e = c._a;
        switch (a) {
            case "Q":
                null != b && (e[Db] = 3 * (C(b) - 1));
                break;
            case "M":
            case "MM":
                null != b && (e[Db] = C(b) - 1);
                break;
            case "MMM":
            case "MMMM":
                d = c._locale.monthsParse(b, a, c._strict), null != d ? e[Db] = d : c._pf.invalidMonth = b;
                break;
            case "D":
            case "DD":
                null != b && (e[Eb] = C(b));
                break;
            case "Do":
                null != b && (e[Eb] = C(parseInt(b.match(/\d{1,2}/)[0], 10)));
                break;
            case "DDD":
            case "DDDD":
                null != b && (c._dayOfYear = C(b));
                break;
            case "YY":
                e[Cb] = vb.parseTwoDigitYear(b);
                break;
            case "YYYY":
            case "YYYYY":
            case "YYYYYY":
                e[Cb] = C(b);
                break;
            case "a":
            case "A":
                c._meridiem = b;
                break;
            case "h":
            case "hh":
                c._pf.bigHour = !0;
            case "H":
            case "HH":
                e[Fb] = C(b);
                break;
            case "m":
            case "mm":
                e[Gb] = C(b);
                break;
            case "s":
            case "ss":
                e[Hb] = C(b);
                break;
            case "S":
            case "SS":
            case "SSS":
            case "SSSS":
                e[Ib] = C(1e3 * ("0." + b));
                break;
            case "x":
                c._d = new Date(C(b));
                break;
            case "X":
                c._d = new Date(1e3 * parseFloat(b));
                break;
            case "Z":
            case "ZZ":
                c._useUTC = !0, c._tzm = S(b);
                break;
            case "dd":
            case "ddd":
            case "dddd":
                d = c._locale.weekdaysParse(b), null != d ? (c._w = c._w || {}, c._w.d = d) : c._pf.invalidWeekday = b;
                break;
            case "w":
            case "ww":
            case "W":
            case "WW":
            case "d":
            case "e":
            case "E":
                a = a.substr(0, 1);
            case "gggg":
            case "GGGG":
            case "GGGGG":
                a = a.substr(0, 2), b && (c._w = c._w || {}, c._w[a] = C(b));
                break;
            case "gg":
            case "GG":
                c._w = c._w || {}, c._w[a] = vb.parseTwoDigitYear(b)
        }
    }

    function U(a) {
        var c, d, e, f, g, h, i;
        c = a._w, null != c.GG || null != c.W || null != c.E ? (g = 1, h = 4, d = b(c.GG, a._a[Cb], jb(vb(), 1, 4).year), e = b(c.W, 1), f = b(c.E, 1)) : (g = a._locale._week.dow, h = a._locale._week.doy, d = b(c.gg, a._a[Cb], jb(vb(), g, h).year), e = b(c.w, 1), null != c.d ? (f = c.d, g > f && ++e) : f = null != c.e ? c.e + g : g), i = kb(d, e, f, h, g), a._a[Cb] = i.year, a._dayOfYear = i.dayOfYear
    }

    function V(a) {
        var c, d, e, f, g = [];
        if (!a._d) {
            for (e = X(a), a._w && null == a._a[Eb] && null == a._a[Db] && U(a), a._dayOfYear && (f = b(a._a[Cb], e[Cb]), a._dayOfYear > F(f) && (a._pf._overflowDayOfYear = !0), d = fb(f, 0, a._dayOfYear), a._a[Db] = d.getUTCMonth(), a._a[Eb] = d.getUTCDate()), c = 0; 3 > c && null == a._a[c]; ++c)
                a._a[c] = g[c] = e[c];
            for (; 7 > c; c++)
                a._a[c] = g[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
            24 === a._a[Fb] && 0 === a._a[Gb] && 0 === a._a[Hb] && 0 === a._a[Ib] && (a._nextDay = !0, a._a[Fb] = 0), a._d = (a._useUTC ? fb : eb).apply(null, g), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[Fb] = 24)
        }
    }

    function W(a) {
        var b;
        a._d || (b = A(a._i), a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], V(a))
    }

    function X(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function Y(b) {
        if (b._f === vb.ISO_8601)
            return void ab(b);
        b._a = [], b._pf.empty = !0;
        var c, d, e, f, g, h = "" + b._i,
                i = h.length,
                j = 0;
        for (e = Q(b._f, b._locale).match(Pb) || [], c = 0; c < e.length; c++)
            f = e[c], d = (h.match(R(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && b._pf.unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), j += d.length), rc[f] ? (d ? b._pf.empty = !1 : b._pf.unusedTokens.push(f), T(f, d, b)) : b._strict && !d && b._pf.unusedTokens.push(f);
        b._pf.charsLeftOver = i - j, h.length > 0 && b._pf.unusedInput.push(h), b._pf.bigHour === !0 && b._a[Fb] <= 12 && (b._pf.bigHour = a), b._a[Fb] = k(b._locale, b._a[Fb], b._meridiem), V(b), H(b)
    }

    function Z(a) {
        return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
            return b || c || d || e
        })
    }

    function $(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function _(a) {
        var b, c, e, f, g;
        if (0 === a._f.length)
            return a._pf.invalidFormat = !0, void(a._d = new Date(0 / 0));
        for (f = 0; f < a._f.length; f++)
            g = 0, b = p({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._pf = d(), b._f = a._f[f], Y(b), I(b) && (g += b._pf.charsLeftOver, g += 10 * b._pf.unusedTokens.length, b._pf.score = g, (null == e || e > g) && (e = g, c = b));
        o(a, c || b)
    }

    function ab(a) {
        var b, c, d = a._i,
                e = fc.exec(d);
        if (e) {
            for (a._pf.iso = !0, b = 0, c = hc.length; c > b; b++)
                if (hc[b][1].exec(d)) {
                    a._f = hc[b][0] + (e[6] || " ");
                    break
                }
            for (b = 0, c = ic.length; c > b; b++)
                if (ic[b][1].exec(d)) {
                    a._f += ic[b][0];
                    break
                }
            d.match(Xb) && (a._f += "Z"), Y(a)
        } else
            a._isValid = !1
    }

    function bb(a) {
        ab(a), a._isValid === !1 && (delete a._isValid, vb.createFromInputFallback(a))
    }

    function cb(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c)
            d.push(b(a[c], c));
        return d
    }

    function db(b) {
        var c, d = b._i;
        d === a ? b._d = new Date : x(d) ? b._d = new Date(+d) : null !== (c = Mb.exec(d)) ? b._d = new Date(+c[1]) : "string" == typeof d ? bb(b) : w(d) ? (b._a = cb(d.slice(0), function (a) {
            return parseInt(a, 10)
        }), V(b)) : "object" == typeof d ? W(b) : "number" == typeof d ? b._d = new Date(d) : vb.createFromInputFallback(b)
    }

    function eb(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 1970 > a && h.setFullYear(a), h
    }

    function fb(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 1970 > a && b.setUTCFullYear(a), b
    }

    function gb(a, b) {
        if ("string" == typeof a)
            if (isNaN(a)) {
                if (a = b.weekdaysParse(a), "number" != typeof a)
                    return null
            } else
                a = parseInt(a, 10);
        return a
    }

    function hb(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function ib(a, b, c) {
        var d = vb.duration(a).abs(),
                e = Ab(d.as("s")),
                f = Ab(d.as("m")),
                g = Ab(d.as("h")),
                h = Ab(d.as("d")),
                i = Ab(d.as("M")),
                j = Ab(d.as("y")),
                k = e < oc.s && ["s", e] || 1 === f && ["m"] || f < oc.m && ["mm", f] || 1 === g && ["h"] || g < oc.h && ["hh", g] || 1 === h && ["d"] || h < oc.d && ["dd", h] || 1 === i && ["M"] || i < oc.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, hb.apply({}, k)
    }

    function jb(a, b, c) {
        var d, e = c - b,
                f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = vb(a).add(f, "d"), {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }

    function kb(a, b, c, d, e) {
        var f, g, h = fb(a, 0, 1).getUTCDay();
        return h = 0 === h ? 7 : h, c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : F(a - 1) + g
        }
    }

    function lb(b) {
        var c, d = b._i,
                e = b._f;
        return b._locale = b._locale || vb.localeData(b._l), null === d || e === a && "" === d ? vb.invalid({
            nullInput: !0
        }) : ("string" == typeof d && (b._i = d = b._locale.preparse(d)), vb.isMoment(d) ? new m(d, !0) : (e ? w(e) ? _(b) : Y(b) : db(b), c = new m(b), c._nextDay && (c.add(1, "d"), c._nextDay = a), c))
    }

    function mb(a, b) {
        var c, d;
        if (1 === b.length && w(b[0]) && (b = b[0]), !b.length)
            return vb();
        for (c = b[0], d = 1; d < b.length; ++d)
            b[d][a](c) && (c = b[d]);
        return c
    }

    function nb(a, b) {
        var c;
        return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), D(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a)
    }

    function ob(a, b) {
        return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
    }

    function pb(a, b, c) {
        return "Month" === b ? nb(a, c) : a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function qb(a, b) {
        return function (c) {
            return null != c ? (pb(this, a, c), vb.updateOffset(this, b), this) : ob(this, a)
        }
    }

    function rb(a) {
        return 400 * a / 146097
    }

    function sb(a) {
        return 146097 * a / 400
    }

    function tb(a) {
        vb.duration.fn[a] = function () {
            return this._data[a]
        }
    }

    function ub(a) {
        "undefined" == typeof ender && (wb = zb.moment, zb.moment = a ? f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", vb) : vb)
    }
    for (var vb, wb, xb, yb = "2.9.0", zb = "undefined" == typeof global || "undefined" != typeof window && window !== global.window ? this : global, Ab = Math.round, Bb = Object.prototype.hasOwnProperty, Cb = 0, Db = 1, Eb = 2, Fb = 3, Gb = 4, Hb = 5, Ib = 6, Jb = {}, Kb = [], Lb = "undefined" != typeof module && module && module.exports, Mb = /^\/?Date\((\-?\d+)/i, Nb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Ob = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Pb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, Qb = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Rb = /\d\d?/, Sb = /\d{1,3}/, Tb = /\d{1,4}/, Ub = /[+\-]?\d{1,6}/, Vb = /\d+/, Wb = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Xb = /Z|[\+\-]\d\d:?\d\d/gi, Yb = /T/i, Zb = /[\+\-]?\d+/, $b = /[\+\-]?\d+(\.\d{1,3})?/, _b = /\d/, ac = /\d\d/, bc = /\d{3}/, cc = /\d{4}/, dc = /[+-]?\d{6}/, ec = /[+-]?\d+/, fc = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, gc = "YYYY-MM-DDTHH:mm:ssZ", hc = [
        ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
        ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
        ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
        ["GGGG-[W]WW", /\d{4}-W\d{2}/],
        ["YYYY-DDD", /\d{4}-\d{3}/]
    ], ic = [
        ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
        ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
        ["HH:mm", /(T| )\d\d:\d\d/],
        ["HH", /(T| )\d\d/]
    ], jc = /([\+\-]|\d\d)/gi, kc = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }), lc = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        D: "date",
        w: "week",
        W: "isoWeek",
        M: "month",
        Q: "quarter",
        y: "year",
        DDD: "dayOfYear",
        e: "weekday",
        E: "isoWeekday",
        gg: "weekYear",
        GG: "isoWeekYear"
    }, mc = {
        dayofyear: "dayOfYear",
        isoweekday: "isoWeekday",
        isoweek: "isoWeek",
        weekyear: "weekYear",
        isoweekyear: "isoWeekYear"
    }, nc = {}, oc = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    }, pc = "DDD w W M D d".split(" "), qc = "M D H h m s w W".split(" "), rc = {
        M: function () {
            return this.month() + 1
        },
        MMM: function (a) {
            return this.localeData().monthsShort(this, a)
        },
        MMMM: function (a) {
            return this.localeData().months(this, a)
        },
        D: function () {
            return this.date()
        },
        DDD: function () {
            return this.dayOfYear()
        },
        d: function () {
            return this.day()
        },
        dd: function (a) {
            return this.localeData().weekdaysMin(this, a)
        },
        ddd: function (a) {
            return this.localeData().weekdaysShort(this, a)
        },
        dddd: function (a) {
            return this.localeData().weekdays(this, a)
        },
        w: function () {
            return this.week()
        },
        W: function () {
            return this.isoWeek()
        },
        YY: function () {
            return r(this.year() % 100, 2)
        },
        YYYY: function () {
            return r(this.year(), 4)
        },
        YYYYY: function () {
            return r(this.year(), 5)
        },
        YYYYYY: function () {
            var a = this.year(),
                    b = a >= 0 ? "+" : "-";
            return b + r(Math.abs(a), 6)
        },
        gg: function () {
            return r(this.weekYear() % 100, 2)
        },
        gggg: function () {
            return r(this.weekYear(), 4)
        },
        ggggg: function () {
            return r(this.weekYear(), 5)
        },
        GG: function () {
            return r(this.isoWeekYear() % 100, 2)
        },
        GGGG: function () {
            return r(this.isoWeekYear(), 4)
        },
        GGGGG: function () {
            return r(this.isoWeekYear(), 5)
        },
        e: function () {
            return this.weekday()
        },
        E: function () {
            return this.isoWeekday()
        },
        a: function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), !0)
        },
        A: function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), !1)
        },
        H: function () {
            return this.hours()
        },
        h: function () {
            return this.hours() % 12 || 12
        },
        m: function () {
            return this.minutes()
        },
        s: function () {
            return this.seconds()
        },
        S: function () {
            return C(this.milliseconds() / 100)
        },
        SS: function () {
            return r(C(this.milliseconds() / 10), 2)
        },
        SSS: function () {
            return r(this.milliseconds(), 3)
        },
        SSSS: function () {
            return r(this.milliseconds(), 3)
        },
        Z: function () {
            var a = this.utcOffset(),
                    b = "+";
            return 0 > a && (a = -a, b = "-"), b + r(C(a / 60), 2) + ":" + r(C(a) % 60, 2)
        },
        ZZ: function () {
            var a = this.utcOffset(),
                    b = "+";
            return 0 > a && (a = -a, b = "-"), b + r(C(a / 60), 2) + r(C(a) % 60, 2)
        },
        z: function () {
            return this.zoneAbbr()
        },
        zz: function () {
            return this.zoneName()
        },
        x: function () {
            return this.valueOf()
        },
        X: function () {
            return this.unix()
        },
        Q: function () {
            return this.quarter()
        }
    }, sc = {}, tc = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"], uc = !1; pc.length; )
        xb = pc.pop(), rc[xb + "o"] = i(rc[xb], xb);
    for (; qc.length; )
        xb = qc.pop(), rc[xb + xb] = h(rc[xb], 2);
    rc.DDDD = h(rc.DDD, 3), o(l.prototype, {
        set: function (a) {
            var b, c;
            for (c in a)
                b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b;
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function (a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function (a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function (a, b, c) {
            var d, e, f;
            for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
                if (e = vb.utc([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a))
                    return d;
                if (c && "MMM" === b && this._shortMonthsParse[d].test(a))
                    return d;
                if (!c && this._monthsParse[d].test(a))
                    return d
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function (a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function (a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function (a) {
            return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function (a) {
            var b, c, d;
            for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)
                if (this._weekdaysParse[b] || (c = vb([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a))
                    return b
        },
        _longDateFormat: {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        longDateFormat: function (a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (a) {
                return a.slice(1)
            }), this._longDateFormat[a] = b), b
        },
        isPM: function (a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function (a, b, c) {
            var d = this._calendar[a];
            return "function" == typeof d ? d.apply(b, [c]) : d
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function (a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function (a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function (a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        _ordinalParse: /\d{1,2}/,
        preparse: function (a) {
            return a
        },
        postformat: function (a) {
            return a
        },
        week: function (a) {
            return jb(a, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        },
        firstDayOfWeek: function () {
            return this._week.dow
        },
        firstDayOfYear: function () {
            return this._week.doy
        },
        _invalidDate: "Invalid date",
        invalidDate: function () {
            return this._invalidDate
        }
    }), vb = function (b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._i = b, g._f = c, g._l = e, g._strict = f, g._isUTC = !1, g._pf = d(), lb(g)
    }, vb.suppressDeprecationWarnings = !1, vb.createFromInputFallback = f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
    }), vb.min = function () {
        var a = [].slice.call(arguments, 0);
        return mb("isBefore", a)
    }, vb.max = function () {
        var a = [].slice.call(arguments, 0);
        return mb("isAfter", a)
    }, vb.utc = function (b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._useUTC = !0, g._isUTC = !0, g._l = e, g._i = b, g._f = c, g._strict = f, g._pf = d(), lb(g).utc()
    }, vb.unix = function (a) {
        return vb(1e3 * a)
    }, vb.duration = function (a, b) {
        var d, e, f, g, h = a,
                i = null;
        return vb.isDuration(a) ? h = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (h = {}, b ? h[b] = a : h.milliseconds = a) : (i = Nb.exec(a)) ? (d = "-" === i[1] ? -1 : 1, h = {
            y: 0,
            d: C(i[Eb]) * d,
            h: C(i[Fb]) * d,
            m: C(i[Gb]) * d,
            s: C(i[Hb]) * d,
            ms: C(i[Ib]) * d
        }) : (i = Ob.exec(a)) ? (d = "-" === i[1] ? -1 : 1, f = function (a) {
            var b = a && parseFloat(a.replace(",", "."));
            return (isNaN(b) ? 0 : b) * d
        }, h = {
            y: f(i[2]),
            M: f(i[3]),
            d: f(i[4]),
            h: f(i[5]),
            m: f(i[6]),
            s: f(i[7]),
            w: f(i[8])
        }) : null == h ? h = {} : "object" == typeof h && ("from" in h || "to" in h) && (g = t(vb(h.from), vb(h.to)), h = {}, h.ms = g.milliseconds, h.M = g.months), e = new n(h), vb.isDuration(a) && c(a, "_locale") && (e._locale = a._locale), e
    }, vb.version = yb, vb.defaultFormat = gc, vb.ISO_8601 = function () {}, vb.momentProperties = Kb, vb.updateOffset = function () {}, vb.relativeTimeThreshold = function (b, c) {
        return oc[b] === a ? !1 : c === a ? oc[b] : (oc[b] = c, !0)
    }, vb.lang = f("moment.lang is deprecated. Use moment.locale instead.", function (a, b) {
        return vb.locale(a, b)
    }), vb.locale = function (a, b) {
        var c;
        return a && (c = "undefined" != typeof b ? vb.defineLocale(a, b) : vb.localeData(a), c && (vb.duration._locale = vb._locale = c)), vb._locale._abbr
    }, vb.defineLocale = function (a, b) {
        return null !== b ? (b.abbr = a, Jb[a] || (Jb[a] = new l), Jb[a].set(b), vb.locale(a), Jb[a]) : (delete Jb[a], null)
    }, vb.langData = f("moment.langData is deprecated. Use moment.localeData instead.", function (a) {
        return vb.localeData(a)
    }), vb.localeData = function (a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a)
            return vb._locale;
        if (!w(a)) {
            if (b = L(a))
                return b;
            a = [a]
        }
        return K(a)
    }, vb.isMoment = function (a) {
        return a instanceof m || null != a && c(a, "_isAMomentObject")
    }, vb.isDuration = function (a) {
        return a instanceof n
    };
    for (xb = tc.length - 1; xb >= 0; --xb)
        B(tc[xb]);
    vb.normalizeUnits = function (a) {
        return z(a)
    }, vb.invalid = function (a) {
        var b = vb.utc(0 / 0);
        return null != a ? o(b._pf, a) : b._pf.userInvalidated = !0, b
    }, vb.parseZone = function () {
        return vb.apply(null, arguments).parseZone()
    }, vb.parseTwoDigitYear = function (a) {
        return C(a) + (C(a) > 68 ? 1900 : 2e3)
    }, vb.isDate = x, o(vb.fn = m.prototype, {
        clone: function () {
            return vb(this)
        },
        valueOf: function () {
            return +this._d - 6e4 * (this._offset || 0)
        },
        unix: function () {
            return Math.floor(+this / 1e3)
        },
        toString: function () {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function () {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function () {
            var a = vb(this).utc();
            return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : P(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : P(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function () {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function () {
            return I(this)
        },
        isDSTShifted: function () {
            return this._a ? this.isValid() && y(this._a, (this._isUTC ? vb.utc(this._a) : vb(this._a)).toArray()) > 0 : !1
        },
        parsingFlags: function () {
            return o({}, this._pf)
        },
        invalidAt: function () {
            return this._pf.overflow
        },
        utc: function (a) {
            return this.utcOffset(0, a)
        },
        local: function (a) {
            return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(this._dateUtcOffset(), "m")), this
        },
        format: function (a) {
            var b = P(this, a || vb.defaultFormat);
            return this.localeData().postformat(b)
        },
        add: u(1, "add"),
        subtract: u(-1, "subtract"),
        diff: function (a, b, c) {
            var d, e, f = M(a, this),
                    g = 6e4 * (f.utcOffset() - this.utcOffset());
            return b = z(b), "year" === b || "month" === b || "quarter" === b ? (e = j(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : q(e)
        },
        from: function (a, b) {
            return vb.duration({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b)
        },
        fromNow: function (a) {
            return this.from(vb(), a)
        },
        calendar: function (a) {
            var b = a || vb(),
                    c = M(b, this).startOf("day"),
                    d = this.diff(c, "days", !0),
                    e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse";
            return this.format(this.localeData().calendar(e, this, vb(b)))
        },
        isLeapYear: function () {
            return G(this.year())
        },
        isDST: function () {
            return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
        },
        day: function (a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = gb(a, this.localeData()), this.add(a - b, "d")) : b
        },
        month: qb("Month", !0),
        startOf: function (a) {
            switch (a = z(a)) {
                case "year":
                    this.month(0);
                case "quarter":
                case "month":
                    this.date(1);
                case "week":
                case "isoWeek":
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
        },
        endOf: function (b) {
            return b = z(b), b === a || "millisecond" === b ? this : this.startOf(b).add(1, "isoWeek" === b ? "week" : b).subtract(1, "ms")
        },
        isAfter: function (a, b) {
            var c;
            return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +this > +a) : (c = vb.isMoment(a) ? +a : +vb(a), c < +this.clone().startOf(b))
        },
        isBefore: function (a, b) {
            var c;
            return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +a > +this) : (c = vb.isMoment(a) ? +a : +vb(a), +this.clone().endOf(b) < c)
        },
        isBetween: function (a, b, c) {
            return this.isAfter(a, c) && this.isBefore(b, c)
        },
        isSame: function (a, b) {
            var c;
            return b = z(b || "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +this === +a) : (c = +vb(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))
        },
        min: f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function (a) {
            return a = vb.apply(null, arguments), this > a ? this : a
        }),
        max: f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function (a) {
            return a = vb.apply(null, arguments), a > this ? this : a
        }),
        zone: f("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", function (a, b) {
            return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
        }),
        utcOffset: function (a, b) {
            var c, d = this._offset || 0;
            return null != a ? ("string" == typeof a && (a = S(a)), Math.abs(a) < 16 && (a = 60 * a), !this._isUTC && b && (c = this._dateUtcOffset()), this._offset = a, this._isUTC = !0, null != c && this.add(c, "m"), d !== a && (!b || this._changeInProgress ? v(this, vb.duration(a - d, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, vb.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? d : this._dateUtcOffset()
        },
        isLocal: function () {
            return !this._isUTC
        },
        isUtcOffset: function () {
            return this._isUTC
        },
        isUtc: function () {
            return this._isUTC && 0 === this._offset
        },
        zoneAbbr: function () {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function () {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function () {
            return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(S(this._i)), this
        },
        hasAlignedHourOffset: function (a) {
            return a = a ? vb(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0
        },
        daysInMonth: function () {
            return D(this.year(), this.month())
        },
        dayOfYear: function (a) {
            var b = Ab((vb(this).startOf("day") - vb(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add(a - b, "d")
        },
        quarter: function (a) {
            return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
        },
        weekYear: function (a) {
            var b = jb(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == a ? b : this.add(a - b, "y")
        },
        isoWeekYear: function (a) {
            var b = jb(this, 1, 4).year;
            return null == a ? b : this.add(a - b, "y")
        },
        week: function (a) {
            var b = this.localeData().week(this);
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        isoWeek: function (a) {
            var b = jb(this, 1, 4).week;
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        weekday: function (a) {
            var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == a ? b : this.add(a - b, "d")
        },
        isoWeekday: function (a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        isoWeeksInYear: function () {
            return E(this.year(), 1, 4)
        },
        weeksInYear: function () {
            var a = this.localeData()._week;
            return E(this.year(), a.dow, a.doy)
        },
        get: function (a) {
            return a = z(a), this[a]()
        },
        set: function (a, b) {
            var c;
            if ("object" == typeof a)
                for (c in a)
                    this.set(c, a[c]);
            else
                a = z(a), "function" == typeof this[a] && this[a](b);
            return this
        },
        locale: function (b) {
            var c;
            return b === a ? this._locale._abbr : (c = vb.localeData(b), null != c && (this._locale = c), this)
        },
        lang: f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (b) {
            return b === a ? this.localeData() : this.locale(b)
        }),
        localeData: function () {
            return this._locale
        },
        _dateUtcOffset: function () {
            return 15 * -Math.round(this._d.getTimezoneOffset() / 15)
        }
    }), vb.fn.millisecond = vb.fn.milliseconds = qb("Milliseconds", !1), vb.fn.second = vb.fn.seconds = qb("Seconds", !1), vb.fn.minute = vb.fn.minutes = qb("Minutes", !1), vb.fn.hour = vb.fn.hours = qb("Hours", !0), vb.fn.date = qb("Date", !0), vb.fn.dates = f("dates accessor is deprecated. Use date instead.", qb("Date", !0)), vb.fn.year = qb("FullYear", !0), vb.fn.years = f("years accessor is deprecated. Use year instead.", qb("FullYear", !0)), vb.fn.days = vb.fn.day, vb.fn.months = vb.fn.month, vb.fn.weeks = vb.fn.week, vb.fn.isoWeeks = vb.fn.isoWeek, vb.fn.quarters = vb.fn.quarter, vb.fn.toJSON = vb.fn.toISOString, vb.fn.isUTC = vb.fn.isUtc, o(vb.duration.fn = n.prototype, {
        _bubble: function () {
            var a, b, c, d = this._milliseconds,
                    e = this._days,
                    f = this._months,
                    g = this._data,
                    h = 0;
            g.milliseconds = d % 1e3, a = q(d / 1e3), g.seconds = a % 60, b = q(a / 60), g.minutes = b % 60, c = q(b / 60), g.hours = c % 24, e += q(c / 24), h = q(rb(e)), e -= q(sb(h)), f += q(e / 30), e %= 30, h += q(f / 12), f %= 12, g.days = e, g.months = f, g.years = h
        },
        abs: function () {
            return this._milliseconds = Math.abs(this._milliseconds), this._days = Math.abs(this._days), this._months = Math.abs(this._months), this._data.milliseconds = Math.abs(this._data.milliseconds), this._data.seconds = Math.abs(this._data.seconds), this._data.minutes = Math.abs(this._data.minutes), this._data.hours = Math.abs(this._data.hours), this._data.months = Math.abs(this._data.months), this._data.years = Math.abs(this._data.years), this
        },
        weeks: function () {
            return q(this.days() / 7)
        },
        valueOf: function () {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * C(this._months / 12)
        },
        humanize: function (a) {
            var b = ib(this, !a, this.localeData());
            return a && (b = this.localeData().pastFuture(+this, b)), this.localeData().postformat(b)
        },
        add: function (a, b) {
            var c = vb.duration(a, b);
            return this._milliseconds += c._milliseconds, this._days += c._days, this._months += c._months, this._bubble(), this
        },
        subtract: function (a, b) {
            var c = vb.duration(a, b);
            return this._milliseconds -= c._milliseconds, this._days -= c._days, this._months -= c._months, this._bubble(), this
        },
        get: function (a) {
            return a = z(a), this[a.toLowerCase() + "s"]()
        },
        as: function (a) {
            var b, c;
            if (a = z(a), "month" === a || "year" === a)
                return b = this._days + this._milliseconds / 864e5, c = this._months + 12 * rb(b), "month" === a ? c : c / 12;
            switch (b = this._days + Math.round(sb(this._months / 12)), a) {
                case "week":
                    return b / 7 + this._milliseconds / 6048e5;
                case "day":
                    return b + this._milliseconds / 864e5;
                case "hour":
                    return 24 * b + this._milliseconds / 36e5;
                case "minute":
                    return 24 * b * 60 + this._milliseconds / 6e4;
                case "second":
                    return 24 * b * 60 * 60 + this._milliseconds / 1e3;
                case "millisecond":
                    return Math.floor(24 * b * 60 * 60 * 1e3) + this._milliseconds;
                default:
                    throw new Error("Unknown unit " + a)
            }
        },
        lang: vb.fn.lang,
        locale: vb.fn.locale,
        toIsoString: f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function () {
            return this.toISOString()
        }),
        toISOString: function () {
            var a = Math.abs(this.years()),
                    b = Math.abs(this.months()),
                    c = Math.abs(this.days()),
                    d = Math.abs(this.hours()),
                    e = Math.abs(this.minutes()),
                    f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
        },
        localeData: function () {
            return this._locale
        },
        toJSON: function () {
            return this.toISOString()
        }
    }), vb.duration.fn.toString = vb.duration.fn.toISOString;
    for (xb in kc)
        c(kc, xb) && tb(xb.toLowerCase());
    vb.duration.fn.asMilliseconds = function () {
        return this.as("ms")
    }, vb.duration.fn.asSeconds = function () {
        return this.as("s")
    }, vb.duration.fn.asMinutes = function () {
        return this.as("m")
    }, vb.duration.fn.asHours = function () {
        return this.as("h")
    }, vb.duration.fn.asDays = function () {
        return this.as("d")
    }, vb.duration.fn.asWeeks = function () {
        return this.as("weeks")
    }, vb.duration.fn.asMonths = function () {
        return this.as("M")
    }, vb.duration.fn.asYears = function () {
        return this.as("y")
    }, vb.locale("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (a) {
            var b = a % 10,
                    c = 1 === C(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), Lb ? module.exports = vb : "function" == typeof define && define.amd ? (define(function (a, b, c) {
        return c.config && c.config() && c.config().noGlobal === !0 && (zb.moment = wb), vb
    }), ub(!0)) : ub()
}).call(this);
/* End Moment.js version : 2.9.0*/


/*! Start FullCalendar v2.4.0 */
!function (a) {
    "function" == typeof define && define.amd ? define(["jquery", "moment"], a) : "object" == typeof exports ? module.exports = a(require("jquery"), require("moment")) : a(jQuery, moment)
}
(function (a, b) {
    function c(a) {
        return Q(a, Oa)
    }
    function d(b) {
        var c, d = {
            views: b.views || {}
        };
        return a.each(b, function (b, e) {
            "views" != b && (a.isPlainObject(e) && !/(time|duration|interval)$/i.test(b) && -1 == a.inArray(b, Oa) ? (c = null,
                    a.each(e, function (a, e) {
                        /^(month|week|day|default|basic(Week|Day)?|agenda(Week|Day)?)$/.test(a) ? (d.views[a] || (d.views[a] = {}),
                                d.views[a][b] = e) : (c || (c = {}),
                                c[a] = e)
                    }
                    ),
                    c && (d[b] = c)) : d[b] = e)
        }
        ),
                d
    }
    function e(a, b) {
        b.left && a.css({
            "border-left-width": 1,
            "margin-left": b.left - 1
        }),
                b.right && a.css({
                    "border-right-width": 1,
                    "margin-right": b.right - 1
                })
    }
    function f(a) {
        a.css({
            "margin-left": "",
            "margin-right": "",
            "border-left-width": "",
            "border-right-width": ""
        })
    }
    function g() {
        a("body").addClass("fc-not-allowed")
    }
    function h() {
        a("body").removeClass("fc-not-allowed")
    }
    function i(b, c, d) {
        var e = Math.floor(c / b.length)
                , f = Math.floor(c - e * (b.length - 1))
                , g = []
                , h = []
                , i = []
                , k = 0;
        j(b),
                b.each(function (c, d) {
                    var j = c === b.length - 1 ? f : e
                            , l = a(d).outerHeight(!0);
                    j > l ? (g.push(d),
                            h.push(l),
                            i.push(a(d).height())) : k += l
                }
                ),
                d && (c -= k,
                        e = Math.floor(c / g.length),
                        f = Math.floor(c - e * (g.length - 1))),
                a(g).each(function (b, c) {
            var d = b === g.length - 1 ? f : e
                    , j = h[b]
                    , k = i[b]
                    , l = d - (j - k);
            d > j && a(c).height(l)
        }
        )
    }
    function j(a) {
        a.height("")
    }
    function k(b) {
        var c = 0;
        return b.find("> *").each(function (b, d) {
            var e = a(d).outerWidth();
            e > c && (c = e)
        }
        ),
                c++,
                b.width(c),
                c
    }
    function l(a, b) {
        return a.height(b).addClass("fc-scroller"),
                a[0].scrollHeight - 1 > a[0].clientHeight ? !0 : (m(a),
                !1)
    }
    function m(a) {
        a.height("").removeClass("fc-scroller")
    }
    function n(b) {
        var c = b.css("position")
                , d = b.parents().filter(function () {
            var b = a(this);
            return /(auto|scroll)/.test(b.css("overflow") + b.css("overflow-y") + b.css("overflow-x"))
        }
        ).eq(0);
        return "fixed" !== c && d.length ? d : a(b[0].ownerDocument || document)
    }
    function o(a) {
        var b = a.offset();
        return {
            left: b.left,
            right: b.left + a.outerWidth(),
            top: b.top,
            bottom: b.top + a.outerHeight()
        }
    }
    function p(a) {
        var b = a.offset()
                , c = r(a)
                , d = b.left + u(a, "border-left-width") + c.left
                , e = b.top + u(a, "border-top-width") + c.top;
        return {
            left: d,
            right: d + a[0].clientWidth,
            top: e,
            bottom: e + a[0].clientHeight
        }
    }
    function q(a) {
        var b = a.offset()
                , c = b.left + u(a, "border-left-width") + u(a, "padding-left")
                , d = b.top + u(a, "border-top-width") + u(a, "padding-top");
        return {
            left: c,
            right: c + a.width(),
            top: d,
            bottom: d + a.height()
        }
    }
    function r(a) {
        var b = a.innerWidth() - a[0].clientWidth
                , c = {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: a.innerHeight() - a[0].clientHeight
                };
        return s() && "rtl" == a.css("direction") ? c.left = b : c.right = b,
                c
    }
    function s() {
        return null === Pa && (Pa = t()),
                Pa
    }
    function t() {
        var b = a("<div><div/></div>").css({
            position: "absolute",
            top: -1e3,
            left: 0,
            border: 0,
            padding: 0,
            overflow: "scroll",
            direction: "rtl"
        }).appendTo("body")
                , c = b.children()
                , d = c.offset().left > b.offset().left;
        return b.remove(),
                d
    }
    function u(a, b) {
        return parseFloat(a.css(b)) || 0
    }
    function v(a) {
        return 1 == a.which && !a.ctrlKey
    }
    function w(a, b) {
        var c = {
            left: Math.max(a.left, b.left),
            right: Math.min(a.right, b.right),
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom)
        };
        return c.left < c.right && c.top < c.bottom ? c : !1
    }
    function x(a, b) {
        return {
            left: Math.min(Math.max(a.left, b.left), b.right),
            top: Math.min(Math.max(a.top, b.top), b.bottom)
        }
    }
    function y(a) {
        return {
            left: (a.left + a.right) / 2,
            top: (a.top + a.bottom) / 2
        }
    }
    function z(a, b) {
        return {
            left: a.left - b.left,
            top: a.top - b.top
        }
    }
    function A(b) {
        var c, d, e = [], f = [];
        for ("string" == typeof b ? f = b.split(/\s*,\s*/) : "function" == typeof b ? f = [b] : a.isArray(b) && (f = b),
                c = 0; c < f.length; c++)
            d = f[c],
                    "string" == typeof d ? e.push("-" == d.charAt(0) ? {
                        field: d.substring(1),
                        order: -1
                    } : {
                        field: d,
                        order: 1
                    }) : "function" == typeof d && e.push({
                func: d
            });
        return e
    }
    function B(a, b, c) {
        var d, e;
        for (d = 0; d < c.length; d++)
            if (e = C(a, b, c[d]))
                return e;
        return 0
    }
    function C(a, b, c) {
        return c.func ? c.func(a, b) : D(a[c.field], b[c.field]) * (c.order || 1)
    }
    function D(b, c) {
        return b || c ? null == c ? -1 : null == b ? 1 : "string" === a.type(b) || "string" === a.type(c) ? String(b).localeCompare(String(c)) : b - c : 0
    }
    function E(a, b) {
        var c, d, e, f, g = a.start, h = a.end, i = b.start, j = b.end;
        return h > i && j > g ? (g >= i ? (c = g.clone(),
                e = !0) : (c = i.clone(),
                e = !1),
                j >= h ? (d = h.clone(),
                        f = !0) : (d = j.clone(),
                f = !1),
                {
                    start: c,
                    end: d,
                    isStart: e,
                    isEnd: f
                }) : void 0
    }
    function F(a, c) {
        return b.duration({
            days: a.clone().stripTime().diff(c.clone().stripTime(), "days"),
            ms: a.time() - c.time()
        })
    }
    function G(a, c) {
        return b.duration({
            days: a.clone().stripTime().diff(c.clone().stripTime(), "days")
        })
    }
    function H(a, c, d) {
        return b.duration(Math.round(a.diff(c, d, !0)), d)
    }
    function I(a, b) {
        var c, d, e;
        for (c = 0; c < Ra.length && (d = Ra[c],
                e = J(d, a, b),
                !(e >= 1 && ba(e))); c++)
            ;
        return d
    }
    function J(a, c, d) {
        return null != d ? d.diff(c, a, !0) : b.isDuration(c) ? c.as(a) : c.end.diff(c.start, a, !0)
    }
    function K(a, b, c) {
        var d;
        return N(c) ? (b - a) / c : (d = c.asMonths(),
                Math.abs(d) >= 1 && ba(d) ? b.diff(a, "months", !0) / d : b.diff(a, "days", !0) / c.asDays())
    }
    function L(a, b) {
        var c, d;
        return N(a) || N(b) ? a / b : (c = a.asMonths(),
                d = b.asMonths(),
                Math.abs(c) >= 1 && ba(c) && Math.abs(d) >= 1 && ba(d) ? c / d : a.asDays() / b.asDays())
    }
    function M(a, c) {
        var d;
        return N(a) ? b.duration(a * c) : (d = a.asMonths(),
                Math.abs(d) >= 1 && ba(d) ? b.duration({
            months: d * c
        }) : b.duration({
            days: a.asDays() * c
        }))
    }
    function N(a) {
        return Boolean(a.hours() || a.minutes() || a.seconds() || a.milliseconds())
    }
    function O(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }
    function P(a) {
        return /^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(a)
    }
    function Q(a, b) {
        var c, d, e, f, g, h, i = {};
        if (b)
            for (c = 0; c < b.length; c++) {
                for (d = b[c],
                        e = [],
                        f = a.length - 1; f >= 0; f--)
                    if (g = a[f][d],
                            "object" == typeof g)
                        e.unshift(g);
                    else if (void 0 !== g) {
                        i[d] = g;
                        break
                    }
                e.length && (i[d] = Q(e))
            }
        for (c = a.length - 1; c >= 0; c--) {
            h = a[c];
            for (d in h)
                d in i || (i[d] = h[d])
        }
        return i
    }
    function R(a) {
        var b = function () {}
        ;
        return b.prototype = a,
                new b
    }
    function S(a, b) {
        for (var c in a)
            U(a, c) && (b[c] = a[c])
    }
    function T(a, b) {
        var c, d, e = ["constructor", "toString", "valueOf"];
        for (c = 0; c < e.length; c++)
            d = e[c],
                    a[d] !== Object.prototype[d] && (b[d] = a[d])
    }
    function U(a, b) {
        return Va.call(a, b)
    }
    function V(b) {
        return /undefined|null|boolean|number|string/.test(a.type(b))
    }
    function W(b, c, d) {
        if (a.isFunction(b) && (b = [b]),
                b) {
            var e, f;
            for (e = 0; e < b.length; e++)
                f = b[e].apply(c, d) || f;
            return f
        }
    }
    function X() {
        for (var a = 0; a < arguments.length; a++)
            if (void 0 !== arguments[a])
                return arguments[a]
    }
    function Y(a) {
        return (a + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />")
    }
    function Z(a) {
        return a.replace(/&.*?;/g, "")
    }
    function $(b) {
        var c = [];
        return a.each(b, function (a, b) {
            null != b && c.push(a + ":" + b)
        }
        ),
                c.join(";")
    }
    function _(a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }
    function aa(a, b) {
        return a - b
    }
    function ba(a) {
        return a % 1 === 0
    }
    function ca(a, b) {
        var c = a[b];
        return function () {
            return c.apply(a, arguments)
        }
    }
    function da(a, b) {
        var c, d, e, f, g = function () {
            var h = +new Date - f;
            b > h && h > 0 ? c = setTimeout(g, b - h) : (c = null,
                    a.apply(e, d),
                    c || (e = d = null))
        }
        ;
        return function () {
            e = this,
                    d = arguments,
                    f = +new Date,
                    c || (c = setTimeout(g, b))
        }
    }
    function ea(c, d, e) {
        var f, g, h, i, j = c[0], k = 1 == c.length && "string" == typeof j;
        return b.isMoment(j) ? (i = b.apply(null, c),
                ga(j, i)) : O(j) || void 0 === j ? i = b.apply(null, c) : (f = !1,
                g = !1,
                k ? Wa.test(j) ? (j += "-01",
                c = [j],
                f = !0,
                g = !0) : (h = Xa.exec(j)) && (f = !h[5],
                g = !0) : a.isArray(j) && (g = !0),
                i = d || f ? b.utc.apply(b, c) : b.apply(null, c),
                f ? (i._ambigTime = !0,
                        i._ambigZone = !0) : e && (g ? i._ambigZone = !0 : k && (i.utcOffset ? i.utcOffset(j) : i.zone(j)))),
                i._fullCalendar = !0,
                i
    }
    function fa(a, c) {
        var d, e, f = !1, g = !1, h = a.length, i = [];
        for (d = 0; h > d; d++)
            e = a[d],
                    b.isMoment(e) || (e = Ma.moment.parseZone(e)),
                    f = f || e._ambigTime,
                    g = g || e._ambigZone,
                    i.push(e);
        for (d = 0; h > d; d++)
            e = i[d],
                    c || !f || e._ambigTime ? g && !e._ambigZone && (i[d] = e.clone().stripZone()) : i[d] = e.clone().stripTime();
        return i
    }
    function ga(a, b) {
        a._ambigTime ? b._ambigTime = !0 : b._ambigTime && (b._ambigTime = !1),
                a._ambigZone ? b._ambigZone = !0 : b._ambigZone && (b._ambigZone = !1)
    }
    function ha(a, b) {
        a.year(b[0] || 0).month(b[1] || 0).date(b[2] || 0).hours(b[3] || 0).minutes(b[4] || 0).seconds(b[5] || 0).milliseconds(b[6] || 0)
    }
    function ia(a, b) {
        return Za.format.call(a, b)
    }
    function ja(a, b) {
        return ka(a, pa(b))
    }
    function ka(a, b) {
        var c, d = "";
        for (c = 0; c < b.length; c++)
            d += la(a, b[c]);
        return d
    }
    function la(a, b) {
        var c, d;
        return "string" == typeof b ? b : (c = b.token) ? $a[c] ? $a[c](a) : ia(a, c) : b.maybe && (d = ka(a, b.maybe),
                d.match(/[1-9]/)) ? d : ""
    }
    function ma(a, b, c, d, e) {
        var f;
        return a = Ma.moment.parseZone(a),
                b = Ma.moment.parseZone(b),
                f = (a.localeData || a.lang).call(a),
                c = f.longDateFormat(c) || c,
                d = d || " - ",
                na(a, b, pa(c), d, e)
    }
    function na(a, b, c, d, e) {
        var f, g, h, i, j = "", k = "", l = "", m = "", n = "";
        for (g = 0; g < c.length && (f = oa(a, b, c[g]),
                f !== !1); g++)
            j += f;
        for (h = c.length - 1; h > g && (f = oa(a, b, c[h]),
                f !== !1); h--)
            k = f + k;
        for (i = g; h >= i; i++)
            l += la(a, c[i]),
                    m += la(b, c[i]);
        return (l || m) && (n = e ? m + d + l : l + d + m),
                j + n + k
    }
    function oa(a, b, c) {
        var d, e;
        return "string" == typeof c ? c : (d = c.token) && (e = _a[d.charAt(0)],
                e && a.isSame(b, e)) ? ia(a, d) : !1
    }
    function pa(a) {
        return a in ab ? ab[a] : ab[a] = qa(a)
    }
    function qa(a) {
        for (var b, c = [], d = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g; b = d.exec(a); )
            b[1] ? c.push(b[1]) : b[2] ? c.push({
                maybe: qa(b[2])
            }) : b[3] ? c.push({
                token: b[3]
            }) : b[5] && c.push(b[5]);
        return c
    }
    function ra() {}
    function sa(a, b) {
        return a || b ? a && b ? a.grid === b.grid && a.row === b.row && a.col === b.col : !1 : !0
    }
    function ta(a) {
        var b = va(a);
        return "background" === b || "inverse-background" === b
    }
    function ua(a) {
        return "inverse-background" === va(a)
    }
    function va(a) {
        return X((a.source || {}).rendering, a.rendering)
    }
    function wa(a) {
        var b, c, d = {};
        for (b = 0; b < a.length; b++)
            c = a[b],
                    (d[c._id] || (d[c._id] = [])).push(c);
        return d
    }
    function xa(a, b) {
        return a.eventStartMS - b.eventStartMS
    }
    function ya(c) {
        var d, e, f, g, h = Ma.dataAttrPrefix;
        return h && (h += "-"),
                d = c.data(h + "event") || null,
                d && (d = "object" == typeof d ? a.extend({}, d) : {},
                        e = d.start,
                        null == e && (e = d.time),
                        f = d.duration,
                        g = d.stick,
                        delete d.start,
                        delete d.time,
                        delete d.duration,
                        delete d.stick),
                null == e && (e = c.data(h + "start")),
                null == e && (e = c.data(h + "time")),
                null == f && (f = c.data(h + "duration")),
                null == g && (g = c.data(h + "stick")),
                e = null != e ? b.duration(e) : null,
                f = null != f ? b.duration(f) : null,
                g = Boolean(g),
                {
                    eventProps: d,
                    startTime: e,
                    duration: f,
                    stick: g
                }
    }
    function za(a, b) {
        var c, d;
        for (c = 0; c < b.length; c++)
            if (d = b[c],
                    d.leftCol <= a.rightCol && d.rightCol >= a.leftCol)
                return !0;
        return !1
    }
    function Aa(a, b) {
        return a.leftCol - b.leftCol
    }
    function Ba(a) {
        var b, c, d, e = [];
        for (b = 0; b < a.length; b++) {
            for (c = a[b],
                    d = 0; d < e.length && Ea(c, e[d]).length; d++)
                ;
            c.level = d,
                    (e[d] || (e[d] = [])).push(c)
        }
        return e
    }
    function Ca(a) {
        var b, c, d, e, f;
        for (b = 0; b < a.length; b++)
            for (c = a[b],
                    d = 0; d < c.length; d++)
                for (e = c[d],
                        e.forwardSegs = [],
                        f = b + 1; f < a.length; f++)
                    Ea(e, a[f], e.forwardSegs)
    }
    function Da(a) {
        var b, c, d = a.forwardSegs, e = 0;
        if (void 0 === a.forwardPressure) {
            for (b = 0; b < d.length; b++)
                c = d[b],
                        Da(c),
                        e = Math.max(e, 1 + c.forwardPressure);
            a.forwardPressure = e
        }
    }
    function Ea(a, b, c) {
        c = c || [];
        for (var d = 0; d < b.length; d++)
            Fa(a, b[d]) && c.push(b[d]);
        return c
    }
    function Fa(a, b) {
        return a.bottom > b.top && a.top < b.bottom
    }
    function Ga(c, d) {
        function e() {
            U ? h() && (k(),
                    i()) : f()
        }
        function f() {
            V = O.theme ? "ui" : "fc",
                    c.addClass("fc"),
                    O.isRTL ? c.addClass("fc-rtl") : c.addClass("fc-ltr"),
                    O.theme ? c.addClass("ui-widget") : c.addClass("fc-unthemed"),
                    U = a("<div class='fc-view-container'/>").prependTo(c),
                    S = N.header = new Ja(N, O),
                    T = S.render(),
                    T && c.prepend(T),
                    i(O.defaultView),
                    O.handleWindowResize && (Y = da(m, O.windowResizeDelay),
                            a(window).resize(Y))
        }
        function g() {
            W && W.removeElement(),
                    S.removeElement(),
                    U.remove(),
                    c.removeClass("fc fc-ltr fc-rtl fc-unthemed ui-widget"),
                    Y && a(window).unbind("resize", Y)
        }
        function h() {
            return c.is(":visible")
        }
        function i(b) {
            ca++,
                    W && b && W.type !== b && (S.deactivateButton(W.type),
                            H(),
                            W.removeElement(),
                            W = N.view = null),
                    !W && b && (W = N.view = ba[b] || (ba[b] = N.instantiateView(b)),
                            W.setElement(a("<div class='fc-view fc-" + b + "-view' />").appendTo(U)),
                            S.activateButton(b)),
                    W && (Z = W.massageCurrentDate(Z),
                            W.displaying && Z.isWithin(W.intervalStart, W.intervalEnd) || h() && (H(),
                            W.display(Z),
                            I(),
                            u(),
                            v(),
                            q())),
                    I(),
                    ca--
        }
        function j(a) {
            return h() ? (a && l(),
                    ca++,
                    W.updateSize(!0),
                    ca--,
                    !0) : void 0
        }
        function k() {
            h() && l()
        }
        function l() {
            X = "number" == typeof O.contentHeight ? O.contentHeight : "number" == typeof O.height ? O.height - (T ? T.outerHeight(!0) : 0) : Math.round(U.width() / Math.max(O.aspectRatio, .5))
        }
        function m(a) {
            !ca && a.target === window && W.start && j(!0) && W.trigger("windowResize", aa)
        }
        function n() {
            p(),
                    r()
        }
        function o() {
            h() && (H(),
                    W.displayEvents(ea),
                    I())
        }
        function p() {
            H(),
                    W.clearEvents(),
                    I()
        }
        function q() {
            !O.lazyFetching || $(W.start, W.end) ? r() : o()
        }
        function r() {
            _(W.start, W.end)
        }
        function s(a) {
            ea = a,
                    o()
        }
        function t() {
            o()
        }
        function u() {
            S.updateTitle(W.title)
        }
        function v() {
            var a = N.getNow();
            a.isWithin(W.intervalStart, W.intervalEnd) ? S.disableButton("today") : S.enableButton("today")
        }
        function w(a, b) {
            W.select(N.buildSelectRange.apply(N, arguments))
        }
        function x() {
            W && W.unselect()
        }
        function y() {
            Z = W.computePrevDate(Z),
                    i()
        }
        function z() {
            Z = W.computeNextDate(Z),
                    i()
        }
        function A() {
            Z.add(-1, "years"),
                    i()
        }
        function B() {
            Z.add(1, "years"),
                    i()
        }
        function C() {
            Z = N.getNow(),
                    i()
        }
        function D(a) {
            Z = N.moment(a),
                    i()
        }
        function E(a) {
            Z.add(b.duration(a)),
                    i()
        }
        function F(a, b) {
            var c;
            b = b || "day",
                    c = N.getViewSpec(b) || N.getUnitViewSpec(b),
                    Z = a,
                    i(c ? c.type : null)
        }
        function G() {
            return Z.clone()
        }
        function H() {
            U.css({
                width: "100%",
                height: U.height(),
                overflow: "hidden"
            })
        }
        function I() {
            U.css({
                width: "",
                height: "",
                overflow: ""
            })
        }
        function J() {
            return N
        }
        function K() {
            return W
        }
        function L(a, b) {
            return void 0 === b ? O[a] : void (("height" == a || "contentHeight" == a || "aspectRatio" == a) && (O[a] = b,
                    j(!0)))
        }
        function M(a, b) {
            var c = Array.prototype.slice.call(arguments, 2);
            return b = b || aa,
                    this.triggerWith(a, b, c),
                    O[a] ? O[a].apply(b, c) : void 0
        }
        var N = this;
        N.initOptions(d || {});
        var O = this.options;
        N.render = e,
                N.destroy = g,
                N.refetchEvents = n,
                N.reportEvents = s,
                N.reportEventChange = t,
                N.rerenderEvents = o,
                N.changeView = i,
                N.select = w,
                N.unselect = x,
                N.prev = y,
                N.next = z,
                N.prevYear = A,
                N.nextYear = B,
                N.today = C,
                N.gotoDate = D,
                N.incrementDate = E,
                N.zoomTo = F,
                N.getDate = G,
                N.getCalendar = J,
                N.getView = K,
                N.option = L,
                N.trigger = M;
        var P = R(Ia(O.lang));
        if (O.monthNames && (P._months = O.monthNames),
                O.monthNamesShort && (P._monthsShort = O.monthNamesShort),
                O.dayNames && (P._weekdays = O.dayNames),
                O.dayNamesShort && (P._weekdaysShort = O.dayNamesShort),
                null != O.firstDay) {
            var Q = R(P._week);
            Q.dow = O.firstDay,
                    P._week = Q
        }
        P._fullCalendar_weekCalc = function (a) {
            return "function" == typeof a ? a : "local" === a ? a : "iso" === a || "ISO" === a ? "ISO" : void 0
        }
        (O.weekNumberCalculation),
                N.defaultAllDayEventDuration = b.duration(O.defaultAllDayEventDuration),
                N.defaultTimedEventDuration = b.duration(O.defaultTimedEventDuration),
                N.moment = function () {
                    var a;
                    return "local" === O.timezone ? (a = Ma.moment.apply(null, arguments),
                            a.hasTime() && a.local()) : a = "UTC" === O.timezone ? Ma.moment.utc.apply(null, arguments) : Ma.moment.parseZone.apply(null, arguments),
                            "_locale" in a ? a._locale = P : a._lang = P,
                            a
                }
        ,
                N.getIsAmbigTimezone = function () {
                    return "local" !== O.timezone && "UTC" !== O.timezone
                }
        ,
                N.rezoneDate = function (a) {
                    return N.moment(a.toArray())
                }
        ,
                N.getNow = function () {
                    var a = O.now;
                    return "function" == typeof a && (a = a()),
                            N.moment(a)
                }
        ,
                N.getEventEnd = function (a) {
                    return a.end ? a.end.clone() : N.getDefaultEventEnd(a.allDay, a.start)
                }
        ,
                N.getDefaultEventEnd = function (a, b) {
                    var c = b.clone();
                    return a ? c.stripTime().add(N.defaultAllDayEventDuration) : c.add(N.defaultTimedEventDuration),
                            N.getIsAmbigTimezone() && c.stripZone(),
                            c
                }
        ,
                N.humanizeDuration = function (a) {
                    return (a.locale || a.lang).call(a, O.lang).humanize()
                }
        ,
                Ka.call(N, O);
        var S, T, U, V, W, X, Y, Z, $ = N.isFetchNeeded, _ = N.fetchEvents, aa = c[0], ba = {}, ca = 0, ea = [];
        Z = null != O.defaultDate ? N.moment(O.defaultDate) : N.getNow(),
                N.getSuggestedViewHeight = function () {
                    return void 0 === X && k(),
                            X
                }
        ,
                N.isHeightAuto = function () {
                    return "auto" === O.contentHeight || "auto" === O.height
                }
        ,
                N.initialize()
    }
    function Ha(b) {
        a.each(rb, function (a, c) {
            null == b[a] && (b[a] = c(b))
        }
        )
    }
    function Ia(a) {
        var c = b.localeData || b.langData;
        return c.call(b, a) || c.call(b, "en")
    }
    function Ja(b, c) {
        function d() {
            var b = c.header;
            return n = c.theme ? "ui" : "fc",
                    b ? o = a("<div class='fc-toolbar'/>").append(f("left")).append(f("right")).append(f("center")).append('<div class="fc-clear"/>') : void 0
        }
        function e() {
            o.remove(),
                    o = a()
        }
        function f(d) {
            var e = a('<div class="fc-' + d + '"/>')
                    , f = c.header[d];
            return f && a.each(f.split(" "), function (d) {
                var f, g = a(), h = !0;
                a.each(this.split(","), function (d, e) {
                    var f, i, j, k, l, m, o, q, r, s;
                    "title" == e ? (g = g.add(a("<h2>&nbsp;</h2>")),
                            h = !1) : ((f = (b.options.customButtons || {})[e]) ? (j = function (a) {
                        f.click && f.click.call(s[0], a)
                    }
                    ,
                            k = "",
                            l = f.text) : (i = b.getViewSpec(e)) ? (j = function () {
                        b.changeView(e)
                    }
                    ,
                            p.push(e),
                            k = i.buttonTextOverride,
                            l = i.buttonTextDefault) : b[e] && (j = function () {
                        b[e]()
                    }
                    ,
                            k = (b.overrides.buttonText || {})[e],
                            l = c.buttonText[e]),
                            j && (m = f ? f.themeIcon : c.themeButtonIcons[e],
                                    o = f ? f.icon : c.buttonIcons[e],
                                    q = k ? Y(k) : m && c.theme ? "<span class='ui-icon ui-icon-" + m + "'></span>" : o && !c.theme ? "<span class='fc-icon fc-icon-" + o + "'></span>" : Y(l),
                                    r = ["fc-" + e + "-button", n + "-button", n + "-state-default"],
                                    s = a('<button type="button" class="' + r.join(" ") + '">' + q + "</button>").click(function (a) {
                                s.hasClass(n + "-state-disabled") || (j(a),
                                        (s.hasClass(n + "-state-active") || s.hasClass(n + "-state-disabled")) && s.removeClass(n + "-state-hover"))
                            }
                            ).mousedown(function () {
                                s.not("." + n + "-state-active").not("." + n + "-state-disabled").addClass(n + "-state-down")
                            }
                            ).mouseup(function () {
                                s.removeClass(n + "-state-down")
                            }
                            ).hover(function () {
                                s.not("." + n + "-state-active").not("." + n + "-state-disabled").addClass(n + "-state-hover")
                            }
                            , function () {
                                s.removeClass(n + "-state-hover").removeClass(n + "-state-down")
                            }
                            ),
                                    g = g.add(s)))
                }
                ),
                        h && g.first().addClass(n + "-corner-left").end().last().addClass(n + "-corner-right").end(),
                        g.length > 1 ? (f = a("<div/>"),
                                h && f.addClass("fc-button-group"),
                                f.append(g),
                                e.append(f)) : e.append(g)
            }
            ),
                    e
        }
        function g(a) {
            o.find("h2").text(a)
        }
        function h(a) {
            o.find(".fc-" + a + "-button").addClass(n + "-state-active")
        }
        function i(a) {
            o.find(".fc-" + a + "-button").removeClass(n + "-state-active")
        }
        function j(a) {
            o.find(".fc-" + a + "-button").attr("disabled", "disabled").addClass(n + "-state-disabled")
        }
        function k(a) {
            o.find(".fc-" + a + "-button").removeAttr("disabled").removeClass(n + "-state-disabled")
        }
        function l() {
            return p
        }
        var m = this;
        m.render = d,
                m.removeElement = e,
                m.updateTitle = g,
                m.activateButton = h,
                m.deactivateButton = i,
                m.disableButton = j,
                m.enableButton = k,
                m.getViewsWithButtons = l;
        var n, o = a(), p = []
    }
    function Ka(c) {
        function d(a, b) {
            return !M || a.clone().stripZone() < M.clone().stripZone() || b.clone().stripZone() > N.clone().stripZone()
        }
        function e(a, b) {
            M = a,
                    N = b,
                    U = [];
            var c = ++S
                    , d = R.length;
            T = d;
            for (var e = 0; d > e; e++)
                f(R[e], c)
        }
        function f(b, c) {
            g(b, function (d) {
                var e, f, g, h = a.isArray(b.events);
                if (c == S) {
                    if (d)
                        for (e = 0; e < d.length; e++)
                            f = d[e],
                                    g = h ? f : s(f, b),
                                    g && U.push.apply(U, x(g));
                    T--,
                            T || O(U)
                }
            }
            )
        }
        function g(b, d) {
            var e, f, h = Ma.sourceFetchers;
            for (e = 0; e < h.length; e++) {
                if (f = h[e].call(L, b, M.clone(), N.clone(), c.timezone, d),
                        f === !0)
                    return;
                if ("object" == typeof f)
                    return void g(f, d)
            }
            var i = b.events;
            if (i)
                a.isFunction(i) ? (L.pushLoading(),
                        i.call(L, M.clone(), N.clone(), c.timezone, function (a) {
                            d(a),
                                    L.popLoading()
                        }
                        )) : a.isArray(i) ? d(i) : d();
            else {
                var j = b.url;
                if (j) {
                    var k, l = b.success, m = b.error, n = b.complete;
                    k = a.isFunction(b.data) ? b.data() : b.data;
                    var o = a.extend({}, k || {})
                            , p = X(b.startParam, c.startParam)
                            , q = X(b.endParam, c.endParam)
                            , r = X(b.timezoneParam, c.timezoneParam);
                    p && (o[p] = M.format()),
                            q && (o[q] = N.format()),
                            c.timezone && "local" != c.timezone && (o[r] = c.timezone),
                            L.pushLoading(),
                            a.ajax(a.extend({}, sb, b, {
                                data: o,
                                success: function (b) {
                                    b = b || [];
                                    var c = W(l, this, arguments);
                                    a.isArray(c) && (b = c),
                                            d(b)
                                },
                                error: function () {
                                    W(m, this, arguments),
                                            d()
                                },
                                complete: function () {
                                    W(n, this, arguments),
                                            L.popLoading()
                                }
                            }))
                } else
                    d()
            }
        }
        function h(a) {
            var b = i(a);
            b && (R.push(b),
                    T++,
                    f(b, S))
        }
        function i(b) {
            var c, d, e = Ma.sourceNormalizers;
            if (a.isFunction(b) || a.isArray(b) ? c = {
                events: b
            } : "string" == typeof b ? c = {
                url: b
            } : "object" == typeof b && (c = a.extend({}, b)),
                    c) {
                for (c.className ? "string" == typeof c.className && (c.className = c.className.split(/\s+/)) : c.className = [],
                        a.isArray(c.events) && (c.origArray = c.events,
                        c.events = a.map(c.events, function (a) {
                            return s(a, c)
                        }
                        )),
                        d = 0; d < e.length; d++)
                    e[d].call(L, c);
                return c
            }
        }
        function j(b) {
            R = a.grep(R, function (a) {
                return !k(a, b)
            }
            ),
                    U = a.grep(U, function (a) {
                        return !k(a.source, b)
                    }
                    ),
                    O(U)
        }
        function k(a, b) {
            return a && b && l(a) == l(b)
        }
        function l(a) {
            return ("object" == typeof a ? a.origArray || a.googleCalendarId || a.url || a.events : null) || a
        }
        function m(a) {
            a.start = L.moment(a.start),
                    a.end ? a.end = L.moment(a.end) : a.end = null,
                    y(a, n(a)),
                    O(U)
        }
        function n(b) {
            var c = {};
            return a.each(b, function (a, b) {
                o(a) && void 0 !== b && V(b) && (c[a] = b)
            }
            ),
                    c
        }
        function o(a) {
            return !/^_|^(id|allDay|start|end)$/.test(a)
        }
        function p(a, b) {
            var c, d, e, f = s(a);
            if (f) {
                for (c = x(f),
                        d = 0; d < c.length; d++)
                    e = c[d],
                            e.source || (b && (Q.events.push(e),
                                    e.source = Q),
                                    U.push(e));
                return O(U),
                        c
            }
            return []
        }
        function q(b) {
            var c, d;
            for (null == b ? b = function () {
                return !0
            }
            : a.isFunction(b) || (c = b + "",
                    b = function (a) {
                        return a._id == c
                    }
            ),
                    U = a.grep(U, b, !0),
                    d = 0; d < R.length; d++)
                a.isArray(R[d].events) && (R[d].events = a.grep(R[d].events, b, !0));
            O(U)
        }
        function r(b) {
            return a.isFunction(b) ? a.grep(U, b) : null != b ? (b += "",
                    a.grep(U, function (a) {
                        return a._id == b
                    }
                    )) : U
        }
        function s(d, e) {
            var f, g, h, i = {};
            if (c.eventDataTransform && (d = c.eventDataTransform(d)),
                    e && e.eventDataTransform && (d = e.eventDataTransform(d)),
                    a.extend(i, d),
                    e && (i.source = e),
                    i._id = d._id || (void 0 === d.id ? "_fc" + tb++ : d.id + ""),
                    d.className ? "string" == typeof d.className ? i.className = d.className.split(/\s+/) : i.className = d.className : i.className = [],
                    f = d.start || d.date,
                    g = d.end,
                    P(f) && (f = b.duration(f)),
                    P(g) && (g = b.duration(g)),
                    d.dow || b.isDuration(f) || b.isDuration(g))
                i.start = f ? b.duration(f) : null,
                        i.end = g ? b.duration(g) : null,
                        i._recurring = !0;
            else {
                if (f && (f = L.moment(f),
                        !f.isValid()))
                    return !1;
                g && (g = L.moment(g),
                        g.isValid() || (g = null)),
                        h = d.allDay,
                        void 0 === h && (h = X(e ? e.allDayDefault : void 0, c.allDayDefault)),
                        t(f, g, h, i)
            }
            return i
        }
        function t(a, b, c, d) {
            d.start = a,
                    d.end = b,
                    d.allDay = c,
                    u(d),
                    La(d)
        }
        function u(a) {
            v(a),
                    a.end && !a.end.isAfter(a.start) && (a.end = null),
                    a.end || (c.forceEventDuration ? a.end = L.getDefaultEventEnd(a.allDay, a.start) : a.end = null)
        }
        function v(a) {
            null == a.allDay && (a.allDay = !(a.start.hasTime() || a.end && a.end.hasTime())),
                    a.allDay ? (a.start.stripTime(),
                            a.end && a.end.stripTime()) : (a.start.hasTime() || (a.start = L.rezoneDate(a.start)),
                    a.end && !a.end.hasTime() && (a.end = L.rezoneDate(a.end)))
        }
        function w(b) {
            var c;
            return b.end || (c = b.allDay,
                    null == c && (c = !b.start.hasTime()),
                    b = a.extend({}, b),
                    b.end = L.getDefaultEventEnd(c, b.start)),
                    b
        }
        function x(b, c, d) {
            var e, f, g, h, i, j, k, l, m, n = [];
            if (c = c || M,
                    d = d || N,
                    b)
                if (b._recurring) {
                    if (f = b.dow)
                        for (e = {},
                                g = 0; g < f.length; g++)
                            e[f[g]] = !0;
                    for (h = c.clone().stripTime(); h.isBefore(d); )
                        (!e || e[h.day()]) && (i = b.start,
                                j = b.end,
                                k = h.clone(),
                                l = null,
                                i && (k = k.time(i)),
                                j && (l = h.clone().time(j)),
                                m = a.extend({}, b),
                                t(k, l, !i && !j, m),
                                n.push(m)),
                                h.add(1, "days")
                } else
                    n.push(b);
            return n
        }
        function y(b, c, d) {
            function e(a, b) {
                return d ? H(a, b, d) : c.allDay ? G(a, b) : F(a, b)
            }
            var f, g, h, i, j, k, l = {};
            return c = c || {},
                    c.start || (c.start = b.start.clone()),
                    void 0 === c.end && (c.end = b.end ? b.end.clone() : null),
                    null == c.allDay && (c.allDay = b.allDay),
                    u(c),
                    f = {
                        start: b._start.clone(),
                        end: b._end ? b._end.clone() : L.getDefaultEventEnd(b._allDay, b._start),
                        allDay: c.allDay
                    },
            u(f),
                    g = null !== b._end && null === c.end,
                    h = e(c.start, f.start),
                    c.end ? (i = e(c.end, f.end),
                            j = i.subtract(h)) : j = null,
                    a.each(c, function (a, b) {
                        o(a) && void 0 !== b && (l[a] = b)
                    }
                    ),
                    k = z(r(b._id), g, c.allDay, h, j, l),
                    {
                        dateDelta: h,
                        durationDelta: j,
                        undo: k
                    }
        }
        function z(b, c, d, e, f, g) {
            var h = L.getIsAmbigTimezone()
                    , i = [];
            return e && !e.valueOf() && (e = null),
                    f && !f.valueOf() && (f = null),
                    a.each(b, function (b, j) {
                        var k, l;
                        k = {
                            start: j.start.clone(),
                            end: j.end ? j.end.clone() : null,
                            allDay: j.allDay
                        },
                        a.each(g, function (a) {
                            k[a] = j[a]
                        }
                        ),
                                l = {
                                    start: j._start,
                                    end: j._end,
                                    allDay: d
                                },
                        u(l),
                                c ? l.end = null : f && !l.end && (l.end = L.getDefaultEventEnd(l.allDay, l.start)),
                                e && (l.start.add(e),
                                        l.end && l.end.add(e)),
                                f && l.end.add(f),
                                h && !l.allDay && (e || f) && (l.start.stripZone(),
                                l.end && l.end.stripZone()),
                                a.extend(j, g, l),
                                La(j),
                                i.push(function () {
                                    a.extend(j, k),
                                            La(j)
                                }
                                )
                    }
                    ),
                    function () {
                        for (var a = 0; a < i.length; a++)
                            i[a]()
                    }
        }
        function A(b) {
            var d, e = c.businessHours, f = {
                className: "fc-nonbusiness",
                start: "09:00",
                end: "17:00",
                dow: [1, 2, 3, 4, 5],
                rendering: "inverse-background"
            }, g = L.getView();
            return e && (d = a.extend({}, f, "object" == typeof e ? e : {})),
                    d ? (b && (d.start = null,
                            d.end = null),
                            x(s(d), g.start, g.end)) : []
        }
        function B(a, b) {
            var d = b.source || {}
            , e = X(b.constraint, d.constraint, c.eventConstraint)
                    , f = X(b.overlap, d.overlap, c.eventOverlap);
            return a = w(a),
                    E(a, e, f, b)
        }
        function C(a) {
            return E(a, c.selectConstraint, c.selectOverlap)
        }
        function D(b, c) {
            var d, e;
            return c && (d = a.extend({}, c, b),
                    e = x(s(d))[0]),
                    e ? B(b, e) : (b = w(b),
                    C(b))
        }
        function E(b, c, d, e) {
            var f, g, h, i, j, k;
            if (b = a.extend({}, b),
                    b.start = b.start.clone().stripZone(),
                    b.end = b.end.clone().stripZone(),
                    null != c) {
                for (f = I(c),
                        g = !1,
                        i = 0; i < f.length; i++)
                    if (J(f[i], b)) {
                        g = !0;
                        break
                    }
                if (!g)
                    return !1
            }
            for (h = L.getPeerEvents(e, b),
                    i = 0; i < h.length; i++)
                if (j = h[i],
                        K(j, b)) {
                    if (d === !1)
                        return !1;
                    if ("function" == typeof d && !d(j, e))
                        return !1;
                    if (e) {
                        if (k = X(j.overlap, (j.source || {}).overlap),
                                k === !1)
                            return !1;
                        if ("function" == typeof k && !k(e, j))
                            return !1
                    }
                }
            return !0
        }
        function I(a) {
            return "businessHours" === a ? A() : "object" == typeof a ? x(s(a)) : r(a)
        }
        function J(a, b) {
            var c = a.start.clone().stripZone()
                    , d = L.getEventEnd(a).stripZone();
            return b.start >= c && b.end <= d
        }
        function K(a, b) {
            var c = a.start.clone().stripZone()
                    , d = L.getEventEnd(a).stripZone();
            return b.start < d && b.end > c
        }
        var L = this;
        L.isFetchNeeded = d,
                L.fetchEvents = e,
                L.addEventSource = h,
                L.removeEventSource = j,
                L.updateEvent = m,
                L.renderEvent = p,
                L.removeEvents = q,
                L.clientEvents = r,
                L.mutateEvent = y,
                L.normalizeEventRange = u,
                L.normalizeEventRangeTimes = v,
                L.ensureVisibleEventRange = w;
        var M, N, O = L.reportEvents, Q = {
            events: []
        }, R = [Q], S = 0, T = 0, U = [];
        a.each((c.events ? [c.events] : []).concat(c.eventSources || []), function (a, b) {
            var c = i(b);
            c && R.push(c)
        }
        ),
                L.getBusinessHoursEvents = A,
                L.isEventRangeAllowed = B,
                L.isSelectionRangeAllowed = C,
                L.isExternalDropRangeAllowed = D,
                L.getEventCache = function () {
                    return U
                }
    }
    function La(a) {
        a._allDay = a.allDay,
                a._start = a.start.clone(),
                a._end = a.end ? a.end.clone() : null
    }
    var Ma = a.fullCalendar = {
        version: "2.4.0"
    }
    , Na = Ma.views = {};
    a.fn.fullCalendar = function (b) {
        var c = Array.prototype.slice.call(arguments, 1)
                , d = this;
        return this.each(function (e, f) {
            var g, h = a(f), i = h.data("fullCalendar");
            "string" == typeof b ? i && a.isFunction(i[b]) && (g = i[b].apply(i, c),
                    e || (d = g),
                    "destroy" === b && h.removeData("fullCalendar")) : i || (i = new nb(h, b),
                    h.data("fullCalendar", i),
                    i.render())
        }
        ),
                d
    }
    ;
    var Oa = ["header", "buttonText", "buttonIcons", "themeButtonIcons"];
    Ma.intersectionToSeg = E,
            Ma.applyAll = W,
            Ma.debounce = da,
            Ma.isInt = ba,
            Ma.htmlEscape = Y,
            Ma.cssToStr = $,
            Ma.proxy = ca,
            Ma.capitaliseFirstLetter = _,
            Ma.getClientRect = p,
            Ma.getContentRect = q,
            Ma.getScrollbarWidths = r;
    var Pa = null;
    Ma.intersectRects = w,
            Ma.parseFieldSpecs = A,
            Ma.compareByFieldSpecs = B,
            Ma.compareByFieldSpec = C,
            Ma.flexibleCompare = D,
            Ma.computeIntervalUnit = I,
            Ma.divideRangeByDuration = K,
            Ma.divideDurationByDuration = L,
            Ma.multiplyDuration = M,
            Ma.durationHasTime = N;
    var Qa = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
            , Ra = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
    Ma.log = function () {
        var a = window.console;
        return a && a.log ? a.log.apply(a, arguments) : void 0
    }
    ,
            Ma.warn = function () {
                var a = window.console;
                return a && a.warn ? a.warn.apply(a, arguments) : Ma.log.apply(Ma, arguments)
            }
    ;
    var Sa, Ta, Ua, Va = {}.hasOwnProperty, Wa = /^\s*\d{4}-\d\d$/, Xa = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/, Ya = b.fn, Za = a.extend({}, Ya);
    Ma.moment = function () {
        return ea(arguments)
    }
    ,
            Ma.moment.utc = function () {
                var a = ea(arguments, !0);
                return a.hasTime() && a.utc(),
                        a
            }
    ,
            Ma.moment.parseZone = function () {
                return ea(arguments, !0, !0)
            }
    ,
            Ya.clone = function () {
                var a = Za.clone.apply(this, arguments);
                return ga(this, a),
                        this._fullCalendar && (a._fullCalendar = !0),
                        a
            }
    ,
            Ya.week = Ya.weeks = function (a) {
                var b = (this._locale || this._lang)._fullCalendar_weekCalc;
                return null == a && "function" == typeof b ? b(this) : "ISO" === b ? Za.isoWeek.apply(this, arguments) : Za.week.apply(this, arguments)
            }
    ,
            Ya.time = function (a) {
                if (!this._fullCalendar)
                    return Za.time.apply(this, arguments);
                if (null == a)
                    return b.duration({
                        hours: this.hours(),
                        minutes: this.minutes(),
                        seconds: this.seconds(),
                        milliseconds: this.milliseconds()
                    });
                this._ambigTime = !1,
                        b.isDuration(a) || b.isMoment(a) || (a = b.duration(a));
                var c = 0;
                return b.isDuration(a) && (c = 24 * Math.floor(a.asDays())),
                        this.hours(c + a.hours()).minutes(a.minutes()).seconds(a.seconds()).milliseconds(a.milliseconds())
            }
    ,
            Ya.stripTime = function () {
                var a;
                return this._ambigTime || (a = this.toArray(),
                        this.utc(),
                        Ta(this, a.slice(0, 3)),
                        this._ambigTime = !0,
                        this._ambigZone = !0),
                        this
            }
    ,
            Ya.hasTime = function () {
                return !this._ambigTime
            }
    ,
            Ya.stripZone = function () {
                var a, b;
                return this._ambigZone || (a = this.toArray(),
                        b = this._ambigTime,
                        this.utc(),
                        Ta(this, a),
                        this._ambigTime = b || !1,
                        this._ambigZone = !0),
                        this
            }
    ,
            Ya.hasZone = function () {
                return !this._ambigZone
            }
    ,
            Ya.local = function () {
                var a = this.toArray()
                        , b = this._ambigZone;
                return Za.local.apply(this, arguments),
                        this._ambigTime = !1,
                        this._ambigZone = !1,
                        b && Ua(this, a),
                        this
            }
    ,
            Ya.utc = function () {
                return Za.utc.apply(this, arguments),
                        this._ambigTime = !1,
                        this._ambigZone = !1,
                        this
            }
    ,
            a.each(["zone", "utcOffset"], function (a, b) {
                Za[b] && (Ya[b] = function (a) {
                    return null != a && (this._ambigTime = !1,
                            this._ambigZone = !1),
                            Za[b].apply(this, arguments)
                }
                )
            }
            ),
            Ya.format = function () {
                return this._fullCalendar && arguments[0] ? ja(this, arguments[0]) : this._ambigTime ? ia(this, "YYYY-MM-DD") : this._ambigZone ? ia(this, "YYYY-MM-DD[T]HH:mm:ss") : Za.format.apply(this, arguments)
            }
    ,
            Ya.toISOString = function () {
                return this._ambigTime ? ia(this, "YYYY-MM-DD") : this._ambigZone ? ia(this, "YYYY-MM-DD[T]HH:mm:ss") : Za.toISOString.apply(this, arguments)
            }
    ,
            Ya.isWithin = function (a, b) {
                var c = fa([this, a, b]);
                return c[0] >= c[1] && c[0] < c[2]
            }
    ,
            Ya.isSame = function (a, b) {
                var c;
                return this._fullCalendar ? b ? (c = fa([this, a], !0),
                        Za.isSame.call(c[0], c[1], b)) : (a = Ma.moment.parseZone(a),
                        Za.isSame.call(this, a) && Boolean(this._ambigTime) === Boolean(a._ambigTime) && Boolean(this._ambigZone) === Boolean(a._ambigZone)) : Za.isSame.apply(this, arguments)
            }
    ,
            a.each(["isBefore", "isAfter"], function (a, b) {
                Ya[b] = function (a, c) {
                    var d;
                    return this._fullCalendar ? (d = fa([this, a]),
                            Za[b].call(d[0], d[1], c)) : Za[b].apply(this, arguments)
                }
            }
            ),
            Sa = "_d" in b() && "updateOffset" in b,
            Ta = Sa ? function (a, c) {
                a._d.setTime(Date.UTC.apply(Date, c)),
                        b.updateOffset(a, !1)
            }
    : ha,
            Ua = Sa ? function (a, c) {
                a._d.setTime(+new Date(c[0] || 0, c[1] || 0, c[2] || 0, c[3] || 0, c[4] || 0, c[5] || 0, c[6] || 0)),
                        b.updateOffset(a, !1)
            }
    : ha;
    var $a = {
        t: function (a) {
            return ia(a, "a").charAt(0)
        },
        T: function (a) {
            return ia(a, "A").charAt(0)
        }
    };
    Ma.formatRange = ma;
    var _a = {
        Y: "year",
        M: "month",
        D: "day",
        d: "day",
        A: "second",
        a: "second",
        T: "second",
        t: "second",
        H: "second",
        h: "second",
        m: "second",
        s: "second"
    }
    , ab = {};
    Ma.Class = ra,
            ra.extend = function (a) {
                var b, c = this;
                return a = a || {},
                        U(a, "constructor") && (b = a.constructor),
                        "function" != typeof b && (b = a.constructor = function () {
                            c.apply(this, arguments)
                        }
                        ),
                        b.prototype = R(c.prototype),
                        S(a, b.prototype),
                        T(a, b.prototype),
                        S(c, b),
                        b
            }
    ,
            ra.mixin = function (a) {
                S(a.prototype || a, this.prototype)
            }
    ;
    var bb = Ma.Emitter = ra.extend({
        callbackHash: null,
        on: function (a, b) {
            return this.getCallbacks(a).add(b),
                    this
        },
        off: function (a, b) {
            return this.getCallbacks(a).remove(b),
                    this
        },
        trigger: function (a) {
            var b = Array.prototype.slice.call(arguments, 1);
            return this.triggerWith(a, this, b),
                    this
        },
        triggerWith: function (a, b, c) {
            var d = this.getCallbacks(a);
            return d.fireWith(b, c),
                    this
        },
        getCallbacks: function (b) {
            var c;
            return this.callbackHash || (this.callbackHash = {}),
                    c = this.callbackHash[b],
                    c || (c = this.callbackHash[b] = a.Callbacks()),
                    c
        }
    })
            , cb = ra.extend({
                isHidden: !0,
                options: null,
                el: null,
                documentMousedownProxy: null,
                margin: 10,
                constructor: function (a) {
                    this.options = a || {}
                },
                show: function () {
                    this.isHidden && (this.el || this.render(),
                            this.el.show(),
                            this.position(),
                            this.isHidden = !1,
                            this.trigger("show"))
                },
                hide: function () {
                    this.isHidden || (this.el.hide(),
                            this.isHidden = !0,
                            this.trigger("hide"))
                },
                render: function () {
                    var b = this
                            , c = this.options;
                    this.el = a('<div class="fc-popover"/>').addClass(c.className || "").css({
                        top: 0,
                        left: 0
                    }).append(c.content).appendTo(c.parentEl),
                            this.el.on("click", ".fc-close", function () {
                                b.hide()
                            }
                            ),
                            c.autoHide && a(document).on("mousedown", this.documentMousedownProxy = ca(this, "documentMousedown"))
                },
                documentMousedown: function (b) {
                    this.el && !a(b.target).closest(this.el).length && this.hide()
                },
                removeElement: function () {
                    this.hide(),
                            this.el && (this.el.remove(),
                                    this.el = null),
                            a(document).off("mousedown", this.documentMousedownProxy)
                },
                position: function () {
                    var b, c, d, e, f, g = this.options, h = this.el.offsetParent().offset(), i = this.el.outerWidth(), j = this.el.outerHeight(), k = a(window), l = n(this.el);
                    e = g.top || 0,
                            f = void 0 !== g.left ? g.left : void 0 !== g.right ? g.right - i : 0,
                            l.is(window) || l.is(document) ? (l = k,
                            b = 0,
                            c = 0) : (d = l.offset(),
                            b = d.top,
                            c = d.left),
                            b += k.scrollTop(),
                            c += k.scrollLeft(),
                            g.viewportConstrain !== !1 && (e = Math.min(e, b + l.outerHeight() - j - this.margin),
                                    e = Math.max(e, b + this.margin),
                                    f = Math.min(f, c + l.outerWidth() - i - this.margin),
                                    f = Math.max(f, c + this.margin)),
                            this.el.css({
                                top: e - h.top,
                                left: f - h.left
                            })
                },
                trigger: function (a) {
                    this.options[a] && this.options[a].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            })
            , db = ra.extend({
                grid: null,
                rowCoords: null,
                colCoords: null,
                containerEl: null,
                bounds: null,
                constructor: function (a) {
                    this.grid = a
                },
                build: function () {
                    this.grid.build(),
                            this.rowCoords = this.grid.computeRowCoords(),
                            this.colCoords = this.grid.computeColCoords(),
                            this.computeBounds()
                },
                clear: function () {
                    this.grid.clear(),
                            this.rowCoords = null,
                            this.colCoords = null
                },
                getCell: function (b, c) {
                    var d, e, f, g = this.rowCoords, h = g.length, i = this.colCoords, j = i.length, k = null, l = null;
                    if (this.inBounds(b, c)) {
                        for (d = 0; h > d; d++)
                            if (e = g[d],
                                    c >= e.top && c < e.bottom) {
                                k = d;
                                break
                            }
                        for (d = 0; j > d; d++)
                            if (e = i[d],
                                    b >= e.left && b < e.right) {
                                l = d;
                                break
                            }
                        if (null !== k && null !== l)
                            return f = this.grid.getCell(k, l),
                                    f.grid = this.grid,
                                    a.extend(f, g[k], i[l]),
                                    f
                    }
                    return null
                },
                computeBounds: function () {
                    this.bounds = this.containerEl ? p(this.containerEl) : null
                },
                inBounds: function (a, b) {
                    var c = this.bounds;
                    return c ? a >= c.left && a < c.right && b >= c.top && b < c.bottom : !0
                }
            })
            , eb = ra.extend({
                coordMaps: null,
                constructor: function (a) {
                    this.coordMaps = a
                },
                build: function () {
                    var a, b = this.coordMaps;
                    for (a = 0; a < b.length; a++)
                        b[a].build()
                },
                getCell: function (a, b) {
                    var c, d = this.coordMaps, e = null;
                    for (c = 0; c < d.length && !e; c++)
                        e = d[c].getCell(a, b);
                    return e
                },
                clear: function () {
                    var a, b = this.coordMaps;
                    for (a = 0; a < b.length; a++)
                        b[a].clear()
                }
            })
            , fb = Ma.DragListener = ra.extend({
                options: null,
                isListening: !1,
                isDragging: !1,
                originX: null,
                originY: null,
                mousemoveProxy: null,
                mouseupProxy: null,
                subjectEl: null,
                subjectHref: null,
                scrollEl: null,
                scrollBounds: null,
                scrollTopVel: null,
                scrollLeftVel: null,
                scrollIntervalId: null,
                scrollHandlerProxy: null,
                scrollSensitivity: 30,
                scrollSpeed: 200,
                scrollIntervalMs: 50,
                constructor: function (a) {
                    a = a || {},
                            this.options = a,
                            this.subjectEl = a.subjectEl
                },
                mousedown: function (a) {
                    v(a) && (a.preventDefault(),
                            this.startListening(a),
                            this.options.distance || this.startDrag(a))
                },
                startListening: function (b) {
                    var c;
                    this.isListening || (b && this.options.scroll && (c = n(a(b.target)),
                            c.is(window) || c.is(document) || (this.scrollEl = c,
                            this.scrollHandlerProxy = da(ca(this, "scrollHandler"), 100),
                            this.scrollEl.on("scroll", this.scrollHandlerProxy))),
                            a(document).on("mousemove", this.mousemoveProxy = ca(this, "mousemove")).on("mouseup", this.mouseupProxy = ca(this, "mouseup")).on("selectstart", this.preventDefault),
                            b ? (this.originX = b.pageX,
                                    this.originY = b.pageY) : (this.originX = 0,
                            this.originY = 0),
                            this.isListening = !0,
                            this.listenStart(b))
                },
                listenStart: function (a) {
                    this.trigger("listenStart", a)
                },
                mousemove: function (a) {
                    var b, c, d = a.pageX - this.originX, e = a.pageY - this.originY;
                    this.isDragging || (b = this.options.distance || 1,
                            c = d * d + e * e,
                            c >= b * b && this.startDrag(a)),
                            this.isDragging && this.drag(d, e, a)
                },
                startDrag: function (a) {
                    this.isListening || this.startListening(),
                            this.isDragging || (this.isDragging = !0,
                                    this.dragStart(a))
                },
                dragStart: function (a) {
                    var b = this.subjectEl;
                    this.trigger("dragStart", a),
                            (this.subjectHref = b ? b.attr("href") : null) && b.removeAttr("href")
                },
                drag: function (a, b, c) {
                    this.trigger("drag", a, b, c),
                            this.updateScroll(c)
                },
                mouseup: function (a) {
                    this.stopListening(a)
                },
                stopDrag: function (a) {
                    this.isDragging && (this.stopScrolling(),
                            this.dragStop(a),
                            this.isDragging = !1)
                },
                dragStop: function (a) {
                    var b = this;
                    this.trigger("dragStop", a),
                            setTimeout(function () {
                                b.subjectHref && b.subjectEl.attr("href", b.subjectHref)
                            }
                            , 0)
                },
                stopListening: function (b) {
                    this.stopDrag(b),
                            this.isListening && (this.scrollEl && (this.scrollEl.off("scroll", this.scrollHandlerProxy),
                                    this.scrollHandlerProxy = null),
                                    a(document).off("mousemove", this.mousemoveProxy).off("mouseup", this.mouseupProxy).off("selectstart", this.preventDefault),
                                    this.mousemoveProxy = null,
                                    this.mouseupProxy = null,
                                    this.isListening = !1,
                                    this.listenStop(b))
                },
                listenStop: function (a) {
                    this.trigger("listenStop", a)
                },
                trigger: function (a) {
                    this.options[a] && this.options[a].apply(this, Array.prototype.slice.call(arguments, 1))
                },
                preventDefault: function (a) {
                    a.preventDefault()
                },
                computeScrollBounds: function () {
                    var a = this.scrollEl;
                    this.scrollBounds = a ? o(a) : null
                },
                updateScroll: function (a) {
                    var b, c, d, e, f = this.scrollSensitivity, g = this.scrollBounds, h = 0, i = 0;
                    g && (b = (f - (a.pageY - g.top)) / f,
                            c = (f - (g.bottom - a.pageY)) / f,
                            d = (f - (a.pageX - g.left)) / f,
                            e = (f - (g.right - a.pageX)) / f,
                            b >= 0 && 1 >= b ? h = b * this.scrollSpeed * -1 : c >= 0 && 1 >= c && (h = c * this.scrollSpeed),
                            d >= 0 && 1 >= d ? i = d * this.scrollSpeed * -1 : e >= 0 && 1 >= e && (i = e * this.scrollSpeed)),
                            this.setScrollVel(h, i)
                },
                setScrollVel: function (a, b) {
                    this.scrollTopVel = a,
                            this.scrollLeftVel = b,
                            this.constrainScrollVel(),
                            !this.scrollTopVel && !this.scrollLeftVel || this.scrollIntervalId || (this.scrollIntervalId = setInterval(ca(this, "scrollIntervalFunc"), this.scrollIntervalMs))
                },
                constrainScrollVel: function () {
                    var a = this.scrollEl;
                    this.scrollTopVel < 0 ? a.scrollTop() <= 0 && (this.scrollTopVel = 0) : this.scrollTopVel > 0 && a.scrollTop() + a[0].clientHeight >= a[0].scrollHeight && (this.scrollTopVel = 0),
                            this.scrollLeftVel < 0 ? a.scrollLeft() <= 0 && (this.scrollLeftVel = 0) : this.scrollLeftVel > 0 && a.scrollLeft() + a[0].clientWidth >= a[0].scrollWidth && (this.scrollLeftVel = 0)
                },
                scrollIntervalFunc: function () {
                    var a = this.scrollEl
                            , b = this.scrollIntervalMs / 1e3;
                    this.scrollTopVel && a.scrollTop(a.scrollTop() + this.scrollTopVel * b),
                            this.scrollLeftVel && a.scrollLeft(a.scrollLeft() + this.scrollLeftVel * b),
                            this.constrainScrollVel(),
                            this.scrollTopVel || this.scrollLeftVel || this.stopScrolling()
                },
                stopScrolling: function () {
                    this.scrollIntervalId && (clearInterval(this.scrollIntervalId),
                            this.scrollIntervalId = null,
                            this.scrollStop())
                },
                scrollHandler: function () {
                    this.scrollIntervalId || this.scrollStop()
                },
                scrollStop: function () {}
            })
            , gb = fb.extend({
                coordMap: null,
                origCell: null,
                cell: null,
                coordAdjust: null,
                constructor: function (a, b) {
                    fb.prototype.constructor.call(this, b),
                            this.coordMap = a
                },
                listenStart: function (a) {
                    var b, c, d, e = this.subjectEl;
                    fb.prototype.listenStart.apply(this, arguments),
                            this.computeCoords(),
                            a ? (c = {
                                left: a.pageX,
                                top: a.pageY
                            },
                            d = c,
                                    e && (b = o(e),
                                            d = x(d, b)),
                                    this.origCell = this.getCell(d.left, d.top),
                                    e && this.options.subjectCenter && (this.origCell && (b = w(this.origCell, b) || b),
                                            d = y(b)),
                                    this.coordAdjust = z(d, c)) : (this.origCell = null,
                            this.coordAdjust = null)
                },
                computeCoords: function () {
                    this.coordMap.build(),
                            this.computeScrollBounds()
                },
                dragStart: function (a) {
                    var b;
                    fb.prototype.dragStart.apply(this, arguments),
                            b = this.getCell(a.pageX, a.pageY),
                            b && this.cellOver(b)
                },
                drag: function (a, b, c) {
                    var d;
                    fb.prototype.drag.apply(this, arguments),
                            d = this.getCell(c.pageX, c.pageY),
                            sa(d, this.cell) || (this.cell && this.cellOut(),
                            d && this.cellOver(d))
                },
                dragStop: function () {
                    this.cellDone(),
                            fb.prototype.dragStop.apply(this, arguments)
                },
                cellOver: function (a) {
                    this.cell = a,
                            this.trigger("cellOver", a, sa(a, this.origCell), this.origCell)
                },
                cellOut: function () {
                    this.cell && (this.trigger("cellOut", this.cell),
                            this.cellDone(),
                            this.cell = null)
                },
                cellDone: function () {
                    this.cell && this.trigger("cellDone", this.cell)
                },
                listenStop: function () {
                    fb.prototype.listenStop.apply(this, arguments),
                            this.origCell = this.cell = null,
                            this.coordMap.clear()
                },
                scrollStop: function () {
                    fb.prototype.scrollStop.apply(this, arguments),
                            this.computeCoords()
                },
                getCell: function (a, b) {
                    return this.coordAdjust && (a += this.coordAdjust.left,
                            b += this.coordAdjust.top),
                            this.coordMap.getCell(a, b)
                }
            })
            , hb = ra.extend({
                options: null,
                sourceEl: null,
                el: null,
                parentEl: null,
                top0: null,
                left0: null,
                mouseY0: null,
                mouseX0: null,
                topDelta: null,
                leftDelta: null,
                mousemoveProxy: null,
                isFollowing: !1,
                isHidden: !1,
                isAnimating: !1,
                constructor: function (b, c) {
                    this.options = c = c || {},
                            this.sourceEl = b,
                            this.parentEl = c.parentEl ? a(c.parentEl) : b.parent()
                },
                start: function (b) {
                    this.isFollowing || (this.isFollowing = !0,
                            this.mouseY0 = b.pageY,
                            this.mouseX0 = b.pageX,
                            this.topDelta = 0,
                            this.leftDelta = 0,
                            this.isHidden || this.updatePosition(),
                            a(document).on("mousemove", this.mousemoveProxy = ca(this, "mousemove")))
                },
                stop: function (b, c) {
                    function d() {
                        this.isAnimating = !1,
                                e.removeElement(),
                                this.top0 = this.left0 = null,
                                c && c()
                    }
                    var e = this
                            , f = this.options.revertDuration;
                    this.isFollowing && !this.isAnimating && (this.isFollowing = !1,
                            a(document).off("mousemove", this.mousemoveProxy),
                            b && f && !this.isHidden ? (this.isAnimating = !0,
                                    this.el.animate({
                                        top: this.top0,
                                        left: this.left0
                                    }, {
                                        duration: f,
                                        complete: d
                                    })) : d())
                },
                getEl: function () {
                    var a = this.el;
                    return a || (this.sourceEl.width(),
                            a = this.el = this.sourceEl.clone().css({
                        position: "absolute",
                        visibility: "",
                        display: this.isHidden ? "none" : "",
                        margin: 0,
                        right: "auto",
                        bottom: "auto",
                        width: this.sourceEl.width(),
                        height: this.sourceEl.height(),
                        opacity: this.options.opacity || "",
                        zIndex: this.options.zIndex
                    }).appendTo(this.parentEl)),
                            a
                },
                removeElement: function () {
                    this.el && (this.el.remove(),
                            this.el = null)
                },
                updatePosition: function () {
                    var a, b;
                    this.getEl(),
                            null === this.top0 && (this.sourceEl.width(),
                                    a = this.sourceEl.offset(),
                                    b = this.el.offsetParent().offset(),
                                    this.top0 = a.top - b.top,
                                    this.left0 = a.left - b.left),
                            this.el.css({
                                top: this.top0 + this.topDelta,
                                left: this.left0 + this.leftDelta
                            })
                },
                mousemove: function (a) {
                    this.topDelta = a.pageY - this.mouseY0,
                            this.leftDelta = a.pageX - this.mouseX0,
                            this.isHidden || this.updatePosition()
                },
                hide: function () {
                    this.isHidden || (this.isHidden = !0,
                            this.el && this.el.hide())
                },
                show: function () {
                    this.isHidden && (this.isHidden = !1,
                            this.updatePosition(),
                            this.getEl().show())
                }
            })
            , ib = ra.extend({
                view: null,
                isRTL: null,
                cellHtml: "<td/>",
                constructor: function (a) {
                    this.view = a,
                            this.isRTL = a.opt("isRTL")
                },
                rowHtml: function (a, b) {
                    var c, d, e = this.getHtmlRenderer("cell", a), f = "";
                    for (b = b || 0,
                            c = 0; c < this.colCnt; c++)
                        d = this.getCell(b, c),
                                f += e(d);
                    return f = this.bookendCells(f, a, b),
                            "<tr>" + f + "</tr>"
                },
                bookendCells: function (a, b, c) {
                    var d = this.getHtmlRenderer("intro", b)(c || 0)
                            , e = this.getHtmlRenderer("outro", b)(c || 0)
                            , f = this.isRTL ? e : d
                            , g = this.isRTL ? d : e;
                    return "string" == typeof a ? f + a + g : a.prepend(f).append(g)
                },
                getHtmlRenderer: function (a, b) {
                    var c, d, e, f, g = this.view;
                    return c = a + "Html",
                            b && (d = b + _(a) + "Html"),
                            d && (f = g[d]) ? e = g : d && (f = this[d]) ? e = this : (f = g[c]) ? e = g : (f = this[c]) && (e = this),
                            "function" == typeof f ? function () {
                                return f.apply(e, arguments) || ""
                            }
                    : function () {
                        return f || ""
                    }
                }
            })
            , jb = Ma.Grid = ib.extend({
                start: null,
                end: null,
                rowCnt: 0,
                colCnt: 0,
                el: null,
                coordMap: null,
                elsByFill: null,
                externalDragStartProxy: null,
                colHeadFormat: null,
                eventTimeFormat: null,
                displayEventTime: null,
                displayEventEnd: null,
                cellDuration: null,
                largeUnit: null,
                constructor: function () {
                    ib.apply(this, arguments),
                            this.coordMap = new db(this),
                            this.elsByFill = {},
                            this.externalDragStartProxy = ca(this, "externalDragStart")
                },
                computeColHeadFormat: function () {},
                computeEventTimeFormat: function () {
                    return this.view.opt("smallTimeFormat")
                },
                computeDisplayEventTime: function () {
                    return !0
                },
                computeDisplayEventEnd: function () {
                    return !0
                },
                setRange: function (a) {
                    this.start = a.start.clone(),
                            this.end = a.end.clone(),
                            this.rangeUpdated(),
                            this.processRangeOptions()
                },
                rangeUpdated: function () {},
                processRangeOptions: function () {
                    var a, b, c = this.view;
                    this.colHeadFormat = c.opt("columnFormat") || this.computeColHeadFormat(),
                            this.eventTimeFormat = c.opt("eventTimeFormat") || c.opt("timeFormat") || this.computeEventTimeFormat(),
                            a = c.opt("displayEventTime"),
                            null == a && (a = this.computeDisplayEventTime()),
                            b = c.opt("displayEventEnd"),
                            null == b && (b = this.computeDisplayEventEnd()),
                            this.displayEventTime = a,
                            this.displayEventEnd = b
                },
                build: function () {},
                clear: function () {},
                rangeToSegs: function (a) {},
                diffDates: function (a, b) {
                    return this.largeUnit ? H(a, b, this.largeUnit) : F(a, b)
                },
                getCell: function (b, c) {
                    var d;
                    return null == c && ("number" == typeof b ? (c = b % this.colCnt,
                            b = Math.floor(b / this.colCnt)) : (c = b.col,
                            b = b.row)),
                            d = {
                                row: b,
                                col: c
                            },
                    a.extend(d, this.getRowData(b), this.getColData(c)),
                            a.extend(d, this.computeCellRange(d)),
                            d
                },
                computeCellRange: function (a) {
                    var b = this.computeCellDate(a);
                    return {
                        start: b,
                        end: b.clone().add(this.cellDuration)
                    }
                },
                computeCellDate: function (a) {},
                getRowData: function (a) {
                    return {}
                },
                getColData: function (a) {
                    return {}
                },
                getRowEl: function (a) {},
                getColEl: function (a) {},
                getCellDayEl: function (a) {
                    return this.getColEl(a.col) || this.getRowEl(a.row)
                },
                computeRowCoords: function () {
                    var a, b, c, d = [];
                    for (a = 0; a < this.rowCnt; a++)
                        b = this.getRowEl(a),
                                c = b.offset().top,
                                d.push({
                                    top: c,
                                    bottom: c + b.outerHeight()
                                });
                    return d
                },
                computeColCoords: function () {
                    var a, b, c, d = [];
                    for (a = 0; a < this.colCnt; a++)
                        b = this.getColEl(a),
                                c = b.offset().left,
                                d.push({
                                    left: c,
                                    right: c + b.outerWidth()
                                });
                    return d
                },
                setElement: function (b) {
                    var c = this;
                    this.el = b,
                            b.on("mousedown", function (b) {
                                a(b.target).is(".fc-event-container *, .fc-more") || a(b.target).closest(".fc-popover").length || c.dayMousedown(b)
                            }
                            ),
                            this.bindSegHandlers(),
                            this.bindGlobalHandlers()
                },
                removeElement: function () {
                    this.unbindGlobalHandlers(),
                            this.el.remove()
                },
                renderSkeleton: function () {},
                renderDates: function () {},
                unrenderDates: function () {},
                bindGlobalHandlers: function () {
                    a(document).on("dragstart sortstart", this.externalDragStartProxy)
                },
                unbindGlobalHandlers: function () {
                    a(document).off("dragstart sortstart", this.externalDragStartProxy)
                },
                dayMousedown: function (a) {
                    var b, c, d = this, e = this.view, f = e.opt("selectable"), i = new gb(this.coordMap, {
                        scroll: e.opt("dragScroll"),
                        dragStart: function () {
                            e.unselect()
                        },
                        cellOver: function (a, e, h) {
                            h && (b = e ? a : null,
                                    f && (c = d.computeSelection(h, a),
                                            c ? d.renderSelection(c) : g()))
                        },
                        cellOut: function (a) {
                            b = null,
                                    c = null,
                                    d.unrenderSelection(),
                                    h()
                        },
                        listenStop: function (a) {
                            b && e.triggerDayClick(b, d.getCellDayEl(b), a),
                                    c && e.reportSelection(c, a),
                                    h()
                        }
                    });
                    i.mousedown(a)
                },
                renderRangeHelper: function (a, b) {
                    var c = this.fabricateHelperEvent(a, b);
                    this.renderHelper(c, b)
                },
                fabricateHelperEvent: function (a, b) {
                    var c = b ? R(b.event) : {};
                    return c.start = a.start.clone(),
                            c.end = a.end ? a.end.clone() : null,
                            c.allDay = null,
                            this.view.calendar.normalizeEventRange(c),
                            c.className = (c.className || []).concat("fc-helper"),
                            b || (c.editable = !1),
                            c
                },
                renderHelper: function (a, b) {},
                unrenderHelper: function () {},
                renderSelection: function (a) {
                    this.renderHighlight(this.selectionRangeToSegs(a))
                },
                unrenderSelection: function () {
                    this.unrenderHighlight()
                },
                computeSelection: function (a, b) {
                    var c, d = [a.start, a.end, b.start, b.end];
                    return d.sort(aa),
                            c = {
                                start: d[0].clone(),
                                end: d[3].clone()
                            },
                    this.view.calendar.isSelectionRangeAllowed(c) ? c : null
                },
                selectionRangeToSegs: function (a) {
                    return this.rangeToSegs(a)
                },
                renderHighlight: function (a) {
                    this.renderFill("highlight", a)
                },
                unrenderHighlight: function () {
                    this.unrenderFill("highlight")
                },
                highlightSegClasses: function () {
                    return ["fc-highlight"]
                },
                renderFill: function (a, b) {},
                unrenderFill: function (a) {
                    var b = this.elsByFill[a];
                    b && (b.remove(),
                            delete this.elsByFill[a])
                },
                renderFillSegEls: function (b, c) {
                    var d, e = this, f = this[b + "SegEl"], g = "", h = [];
                    if (c.length) {
                        for (d = 0; d < c.length; d++)
                            g += this.fillSegHtml(b, c[d]);
                        a(g).each(function (b, d) {
                            var g = c[b]
                                    , i = a(d);
                            f && (i = f.call(e, g, i)),
                                    i && (i = a(i),
                                            i.is(e.fillSegTag) && (g.el = i,
                                            h.push(g)))
                        }
                        )
                    }
                    return h
                },
                fillSegTag: "div",
                fillSegHtml: function (a, b) {
                    var c = this[a + "SegClasses"]
                            , d = this[a + "SegCss"]
                            , e = c ? c.call(this, b) : []
                            , f = $(d ? d.call(this, b) : {});
                    return "<" + this.fillSegTag + (e.length ? ' class="' + e.join(" ") + '"' : "") + (f ? ' style="' + f + '"' : "") + " />"
                },
                headHtml: function () {
                    return '<div class="fc-row ' + this.view.widgetHeaderClass + '"><table><thead>' + this.rowHtml("head") + "</thead></table></div>"
                },
                headCellHtml: function (a) {
                    var b = this.view
                            , c = a.start;
                    return '<th class="fc-day-header ' + b.widgetHeaderClass + " fc-" + Qa[c.day()] + '">' + Y(c.format(this.colHeadFormat)) + "</th>"
                },
                bgCellHtml: function (a) {
                    var b = this.view
                            , c = a.start
                            , d = this.getDayClasses(c);
                    return d.unshift("fc-day", b.widgetContentClass),
                            '<td class="' + d.join(" ") + '" data-date="' + c.format("YYYY-MM-DD") + '"></td>'
                },
                getDayClasses: function (a) {
                    var b = this.view
                            , c = b.calendar.getNow().stripTime()
                            , d = ["fc-" + Qa[a.day()]];
                    return 1 == b.intervalDuration.as("months") && a.month() != b.intervalStart.month() && d.push("fc-other-month"),
                            a.isSame(c, "day") ? d.push("fc-today", b.highlightStateClass) : c > a ? d.push("fc-past") : d.push("fc-future"),
                            d
                }
            });
    jb.mixin({
        mousedOverSeg: null,
        isDraggingSeg: !1,
        isResizingSeg: !1,
        isDraggingExternal: !1,
        segs: null,
        renderEvents: function (a) {
            var b, c, d = this.eventsToSegs(a), e = [], f = [];
            for (b = 0; b < d.length; b++)
                c = d[b],
                        ta(c.event) ? e.push(c) : f.push(c);
            e = this.renderBgSegs(e) || e,
                    f = this.renderFgSegs(f) || f,
                    this.segs = e.concat(f)
        },
        unrenderEvents: function () {
            this.triggerSegMouseout(),
                    this.unrenderFgSegs(),
                    this.unrenderBgSegs(),
                    this.segs = null
        },
        getEventSegs: function () {
            return this.segs || []
        },
        renderFgSegs: function (a) {},
        unrenderFgSegs: function () {},
        renderFgSegEls: function (b, c) {
            var d, e = this.view, f = "", g = [];
            if (b.length) {
                for (d = 0; d < b.length; d++)
                    f += this.fgSegHtml(b[d], c);
                a(f).each(function (c, d) {
                    var f = b[c]
                            , h = e.resolveEventEl(f.event, a(d));
                    h && (h.data("fc-seg", f),
                            f.el = h,
                            g.push(f))
                }
                )
            }
            return g
        },
        fgSegHtml: function (a, b) {},
        renderBgSegs: function (a) {
            return this.renderFill("bgEvent", a)
        },
        unrenderBgSegs: function () {
            this.unrenderFill("bgEvent")
        },
        bgEventSegEl: function (a, b) {
            return this.view.resolveEventEl(a.event, b)
        },
        bgEventSegClasses: function (a) {
            var b = a.event
                    , c = b.source || {};
            return ["fc-bgevent"].concat(b.className, c.className || [])
        },
        bgEventSegCss: function (a) {
            var b = this.view
                    , c = a.event
                    , d = c.source || {};
            return {
                "background-color": c.backgroundColor || c.color || d.backgroundColor || d.color || b.opt("eventBackgroundColor") || b.opt("eventColor")
            }
        },
        businessHoursSegClasses: function (a) {
            return ["fc-nonbusiness", "fc-bgevent"]
        },
        bindSegHandlers: function () {
            var b = this
                    , c = this.view;
            a.each({
                mouseenter: function (a, c) {
                    b.triggerSegMouseover(a, c)
                },
                mouseleave: function (a, c) {
                    b.triggerSegMouseout(a, c)
                },
                click: function (a, b) {
                    return c.trigger("eventClick", this, a.event, b)
                },
                mousedown: function (d, e) {
                    a(e.target).is(".fc-resizer") && c.isEventResizable(d.event) ? b.segResizeMousedown(d, e, a(e.target).is(".fc-start-resizer")) : c.isEventDraggable(d.event) && b.segDragMousedown(d, e)
                }
            }, function (c, d) {
                b.el.on(c, ".fc-event-container > *", function (c) {
                    var e = a(this).data("fc-seg");
                    return !e || b.isDraggingSeg || b.isResizingSeg ? void 0 : d.call(this, e, c)
                }
                )
            }
            )
        },
        triggerSegMouseover: function (a, b) {
            this.mousedOverSeg || (this.mousedOverSeg = a,
                    this.view.trigger("eventMouseover", a.el[0], a.event, b))
        },
        triggerSegMouseout: function (a, b) {
            b = b || {},
                    this.mousedOverSeg && (a = a || this.mousedOverSeg,
                            this.mousedOverSeg = null,
                            this.view.trigger("eventMouseout", a.el[0], a.event, b))
        },
        segDragMousedown: function (a, b) {
            var c, d = this, e = this.view, f = e.calendar, i = a.el, j = a.event, k = new hb(a.el, {
                parentEl: e.el,
                opacity: e.opt("dragOpacity"),
                revertDuration: e.opt("dragRevertDuration"),
                zIndex: 2
            }), l = new gb(e.coordMap, {
                distance: 5,
                scroll: e.opt("dragScroll"),
                subjectEl: i,
                subjectCenter: !0,
                listenStart: function (a) {
                    k.hide(),
                            k.start(a)
                },
                dragStart: function (b) {
                    d.triggerSegMouseout(a, b),
                            d.segDragStart(a, b),
                            e.hideEvent(j)
                },
                cellOver: function (b, h, i) {
                    a.cell && (i = a.cell),
                            c = d.computeEventDrop(i, b, j),
                            c && !f.isEventRangeAllowed(c, j) && (g(),
                            c = null),
                            c && e.renderDrag(c, a) ? k.hide() : k.show(),
                            h && (c = null)
                },
                cellOut: function () {
                    e.unrenderDrag(),
                            k.show(),
                            c = null
                },
                cellDone: function () {
                    h()
                },
                dragStop: function (b) {
                    k.stop(!c, function () {
                        e.unrenderDrag(),
                                e.showEvent(j),
                                d.segDragStop(a, b),
                                c && e.reportEventDrop(j, c, this.largeUnit, i, b)
                    }
                    )
                },
                listenStop: function () {
                    k.stop()
                }
            });
            l.mousedown(b)
        },
        segDragStart: function (a, b) {
            this.isDraggingSeg = !0,
                    this.view.trigger("eventDragStart", a.el[0], a.event, b, {})
        },
        segDragStop: function (a, b) {
            this.isDraggingSeg = !1,
                    this.view.trigger("eventDragStop", a.el[0], a.event, b, {})
        },
        computeEventDrop: function (a, b, c) {
            var d, e, f = this.view.calendar, g = a.start, h = b.start;
            return g.hasTime() === h.hasTime() ? (d = this.diffDates(h, g),
                    c.allDay && N(d) ? (e = {
                start: c.start.clone(),
                end: f.getEventEnd(c),
                allDay: !1
            },
            f.normalizeEventRangeTimes(e)) : e = {
                start: c.start.clone(),
                end: c.end ? c.end.clone() : null,
                allDay: c.allDay
            },
            e.start.add(d),
                    e.end && e.end.add(d)) : e = {
                start: h.clone(),
                end: null,
                allDay: !h.hasTime()
            },
            e
        },
        applyDragOpacity: function (a) {
            var b = this.view.opt("dragOpacity");
            null != b && a.each(function (a, c) {
                c.style.opacity = b
            }
            )
        },
        externalDragStart: function (b, c) {
            var d, e, f = this.view;
            f.opt("droppable") && (d = a((c ? c.item : null) || b.target),
                    e = f.opt("dropAccept"),
                    (a.isFunction(e) ? e.call(d[0], d) : d.is(e)) && (this.isDraggingExternal || this.listenToExternalDrag(d, b, c)))
        },
        listenToExternalDrag: function (a, b, c) {
            var d, e, f = this, i = ya(a);
            d = new gb(this.coordMap, {
                listenStart: function () {
                    f.isDraggingExternal = !0
                },
                cellOver: function (a) {
                    e = f.computeExternalDrop(a, i),
                            e ? f.renderDrag(e) : g()
                },
                cellOut: function () {
                    e = null,
                            f.unrenderDrag(),
                            h()
                },
                dragStop: function () {
                    f.unrenderDrag(),
                            h(),
                            e && f.view.reportExternalDrop(i, e, a, b, c)
                },
                listenStop: function () {
                    f.isDraggingExternal = !1
                }
            }),
                    d.startDrag(b)
        },
        computeExternalDrop: function (a, b) {
            var c = {
                start: a.start.clone(),
                end: null
            };
            return b.startTime && !c.start.hasTime() && c.start.time(b.startTime),
                    b.duration && (c.end = c.start.clone().add(b.duration)),
                    this.view.calendar.isExternalDropRangeAllowed(c, b.eventProps) ? c : null
        },
        renderDrag: function (a, b) {},
        unrenderDrag: function () {},
        segResizeMousedown: function (a, b, c) {
            var d, e, f = this, i = this.view, j = i.calendar, k = a.el, l = a.event, m = j.getEventEnd(l);
            d = new gb(this.coordMap, {
                distance: 5,
                scroll: i.opt("dragScroll"),
                subjectEl: k,
                dragStart: function (b) {
                    f.triggerSegMouseout(a, b),
                            f.segResizeStart(a, b)
                },
                cellOver: function (b, d, h) {
                    e = c ? f.computeEventStartResize(h, b, l) : f.computeEventEndResize(h, b, l),
                            e && (j.isEventRangeAllowed(e, l) ? e.start.isSame(l.start) && e.end.isSame(m) && (e = null) : (g(),
                                    e = null)),
                            e && (i.hideEvent(l),
                                    f.renderEventResize(e, a))
                },
                cellOut: function () {
                    e = null
                },
                cellDone: function () {
                    f.unrenderEventResize(),
                            i.showEvent(l),
                            h()
                },
                dragStop: function (b) {
                    f.segResizeStop(a, b),
                            e && i.reportEventResize(l, e, this.largeUnit, k, b)
                }
            }),
                    d.mousedown(b)
        },
        segResizeStart: function (a, b) {
            this.isResizingSeg = !0,
                    this.view.trigger("eventResizeStart", a.el[0], a.event, b, {})
        },
        segResizeStop: function (a, b) {
            this.isResizingSeg = !1,
                    this.view.trigger("eventResizeStop", a.el[0], a.event, b, {})
        },
        computeEventStartResize: function (a, b, c) {
            return this.computeEventResize("start", a, b, c)
        },
        computeEventEndResize: function (a, b, c) {
            return this.computeEventResize("end", a, b, c)
        },
        computeEventResize: function (a, b, c, d) {
            var e, f, g = this.view.calendar, h = this.diffDates(c[a], b[a]);
            return e = {
                start: d.start.clone(),
                end: g.getEventEnd(d),
                allDay: d.allDay
            },
            e.allDay && N(h) && (e.allDay = !1,
                    g.normalizeEventRangeTimes(e)),
                    e[a].add(h),
                    e.start.isBefore(e.end) || (f = d.allDay ? g.defaultAllDayEventDuration : g.defaultTimedEventDuration,
                    this.cellDuration && this.cellDuration < f && (f = this.cellDuration),
                    "start" == a ? e.start = e.end.clone().subtract(f) : e.end = e.start.clone().add(f)),
                    e
        },
        renderEventResize: function (a, b) {},
        unrenderEventResize: function () {},
        getEventTimeText: function (a, b, c) {
            return null == b && (b = this.eventTimeFormat),
                    null == c && (c = this.displayEventEnd),
                    this.displayEventTime && a.start.hasTime() ? c && a.end ? this.view.formatRange(a, b) : a.start.format(b) : ""
        },
        getSegClasses: function (a, b, c) {
            var d = a.event
                    , e = ["fc-event", a.isStart ? "fc-start" : "fc-not-start", a.isEnd ? "fc-end" : "fc-not-end"].concat(d.className, d.source ? d.source.className : []);
            return b && e.push("fc-draggable"),
                    c && e.push("fc-resizable"),
                    e
        },
        getEventSkinCss: function (a) {
            var b = this.view
                    , c = a.source || {}
            , d = a.color
                    , e = c.color
                    , f = b.opt("eventColor");
            return {
                "background-color": a.backgroundColor || d || c.backgroundColor || e || b.opt("eventBackgroundColor") || f,
                "border-color": a.borderColor || d || c.borderColor || e || b.opt("eventBorderColor") || f,
                color: a.textColor || c.textColor || b.opt("eventTextColor")
            }
        },
        eventsToSegs: function (a, b) {
            var c, d = this.eventsToRanges(a), e = [];
            for (c = 0; c < d.length; c++)
                e.push.apply(e, this.eventRangeToSegs(d[c], b));
            return e
        },
        eventsToRanges: function (b) {
            var c = this
                    , d = wa(b)
                    , e = [];
            return a.each(d, function (a, b) {
                b.length && e.push.apply(e, ua(b[0]) ? c.eventsToInverseRanges(b) : c.eventsToNormalRanges(b))
            }
            ),
                    e
        },
        eventsToNormalRanges: function (a) {
            var b, c, d, e, f = this.view.calendar, g = [];
            for (b = 0; b < a.length; b++)
                c = a[b],
                        d = c.start.clone().stripZone(),
                        e = f.getEventEnd(c).stripZone(),
                        g.push({
                            event: c,
                            start: d,
                            end: e,
                            eventStartMS: +d,
                            eventDurationMS: e - d
                        });
            return g
        },
        eventsToInverseRanges: function (a) {
            var b, c, d = this.view, e = d.start.clone().stripZone(), f = d.end.clone().stripZone(), g = this.eventsToNormalRanges(a), h = [], i = a[0], j = e;
            for (g.sort(xa),
                    b = 0; b < g.length; b++)
                c = g[b],
                        c.start > j && h.push({
                            event: i,
                            start: j,
                            end: c.start
                        }),
                        j = c.end;
            return f > j && h.push({
                event: i,
                start: j,
                end: f
            }),
                    h
        },
        eventRangeToSegs: function (a, b) {
            var c, d, e;
            for (a = this.view.calendar.ensureVisibleEventRange(a),
                    c = b ? b(a) : this.rangeToSegs(a),
                    d = 0; d < c.length; d++)
                e = c[d],
                        e.event = a.event,
                        e.eventStartMS = a.eventStartMS,
                        e.eventDurationMS = a.eventDurationMS;
            return c
        },
        sortSegs: function (a) {
            a.sort(ca(this, "compareSegs"))
        },
        compareSegs: function (a, b) {
            return a.eventStartMS - b.eventStartMS || b.eventDurationMS - a.eventDurationMS || b.event.allDay - a.event.allDay || B(a.event, b.event, this.view.eventOrderSpecs)
        }
    }),
            Ma.dataAttrPrefix = "";
    var kb = jb.extend({
        numbersVisible: !1,
        bottomCoordPadding: 0,
        breakOnWeeks: null,
        cellDates: null,
        dayToCellOffsets: null,
        rowEls: null,
        dayEls: null,
        helperEls: null,
        constructor: function () {
            jb.apply(this, arguments),
                    this.cellDuration = b.duration(1, "day")
        },
        renderDates: function (a) {
            var b, c, d, e = this.view, f = this.rowCnt, g = this.colCnt, h = f * g, i = "";
            for (b = 0; f > b; b++)
                i += this.dayRowHtml(b, a);
            for (this.el.html(i),
                    this.rowEls = this.el.find(".fc-row"),
                    this.dayEls = this.el.find(".fc-day"),
                    c = 0; h > c; c++)
                d = this.getCell(c),
                        e.trigger("dayRender", null, d.start, this.dayEls.eq(c))
        },
        unrenderDates: function () {
            this.removeSegPopover()
        },
        renderBusinessHours: function () {
            var a = this.view.calendar.getBusinessHoursEvents(!0)
                    , b = this.eventsToSegs(a);
            this.renderFill("businessHours", b, "bgevent")
        },
        dayRowHtml: function (a, b) {
            var c = this.view
                    , d = ["fc-row", "fc-week", c.widgetContentClass];
            return b && d.push("fc-rigid"),
                    '<div class="' + d.join(" ") + '"><div class="fc-bg"><table>' + this.rowHtml("day", a) + '</table></div><div class="fc-content-skeleton"><table>' + (this.numbersVisible ? "<thead>" + this.rowHtml("number", a) + "</thead>" : "") + "</table></div></div>"
        },
        dayCellHtml: function (a) {
            return this.bgCellHtml(a)
        },
        computeColHeadFormat: function () {
            return this.rowCnt > 1 ? "ddd" : this.colCnt > 1 ? this.view.opt("dayOfMonthFormat") : "dddd"
        },
        computeEventTimeFormat: function () {
            return this.view.opt("extraSmallTimeFormat")
        },
        computeDisplayEventEnd: function () {
            return 1 == this.colCnt
        },
        rangeUpdated: function () {
            var a, b, c, d;
            if (this.updateCellDates(),
                    a = this.cellDates,
                    this.breakOnWeeks) {
                for (b = a[0].day(),
                        d = 1; d < a.length && a[d].day() != b; d++)
                    ;
                c = Math.ceil(a.length / d)
            } else
                c = 1,
                        d = a.length;
            this.rowCnt = c,
                    this.colCnt = d
        },
        updateCellDates: function () {
            for (var a = this.view, b = this.start.clone(), c = [], d = -1, e = []; b.isBefore(this.end); )
                a.isHiddenDay(b) ? e.push(d + .5) : (d++,
                        e.push(d),
                        c.push(b.clone())),
                        b.add(1, "days");
            this.cellDates = c,
                    this.dayToCellOffsets = e
        },
        computeCellDate: function (a) {
            var b = this.colCnt
                    , c = a.row * b + (this.isRTL ? b - a.col - 1 : a.col);
            return this.cellDates[c].clone()
        },
        getRowEl: function (a) {
            return this.rowEls.eq(a)
        },
        getColEl: function (a) {
            return this.dayEls.eq(a)
        },
        getCellDayEl: function (a) {
            return this.dayEls.eq(a.row * this.colCnt + a.col)
        },
        computeRowCoords: function () {
            var a = jb.prototype.computeRowCoords.call(this);
            return a[a.length - 1].bottom += this.bottomCoordPadding,
                    a
        },
        rangeToSegs: function (a) {
            var b, c, d, e, f, g, h, i, j, k, l = this.isRTL, m = this.rowCnt, n = this.colCnt, o = [];
            for (a = this.view.computeDayRange(a),
                    b = this.dateToCellOffset(a.start),
                    c = this.dateToCellOffset(a.end.subtract(1, "days")),
                    d = 0; m > d; d++)
                e = d * n,
                        f = e + n - 1,
                        i = Math.max(e, b),
                        j = Math.min(f, c),
                        i = Math.ceil(i),
                        j = Math.floor(j),
                        j >= i && (g = i === b,
                                h = j === c,
                                i -= e,
                                j -= e,
                                k = {
                                    row: d,
                                    isStart: g,
                                    isEnd: h
                                },
                        l ? (k.leftCol = n - j - 1,
                                k.rightCol = n - i - 1) : (k.leftCol = i,
                                k.rightCol = j),
                                o.push(k));
            return o
        },
        dateToCellOffset: function (a) {
            var b = this.dayToCellOffsets
                    , c = a.diff(this.start, "days");
            return 0 > c ? b[0] - 1 : c >= b.length ? b[b.length - 1] + 1 : b[c]
        },
        renderDrag: function (a, b) {
            return this.renderHighlight(this.eventRangeToSegs(a)),
                    b && !b.el.closest(this.el).length ? (this.renderRangeHelper(a, b),
                    this.applyDragOpacity(this.helperEls),
                    !0) : void 0
        },
        unrenderDrag: function () {
            this.unrenderHighlight(),
                    this.unrenderHelper()
        },
        renderEventResize: function (a, b) {
            this.renderHighlight(this.eventRangeToSegs(a)),
                    this.renderRangeHelper(a, b)
        },
        unrenderEventResize: function () {
            this.unrenderHighlight(),
                    this.unrenderHelper()
        },
        renderHelper: function (b, c) {
            var d, e = [], f = this.eventsToSegs([b]);
            f = this.renderFgSegEls(f),
                    d = this.renderSegRows(f),
                    this.rowEls.each(function (b, f) {
                        var g, h = a(f), i = a('<div class="fc-helper-skeleton"><table/></div>');
                        g = c && c.row === b ? c.el.position().top : h.find(".fc-content-skeleton tbody").position().top,
                                i.css("top", g).find("table").append(d[b].tbodyEl),
                                h.append(i),
                                e.push(i[0])
                    }
                    ),
                    this.helperEls = a(e)
        },
        unrenderHelper: function () {
            this.helperEls && (this.helperEls.remove(),
                    this.helperEls = null)
        },
        fillSegTag: "td",
        renderFill: function (b, c, d) {
            var e, f, g, h = [];
            for (c = this.renderFillSegEls(b, c),
                    e = 0; e < c.length; e++)
                f = c[e],
                        g = this.renderFillRow(b, f, d),
                        this.rowEls.eq(f.row).append(g),
                        h.push(g[0]);
            return this.elsByFill[b] = a(h),
                    c
        },
        renderFillRow: function (b, c, d) {
            var e, f, g = this.colCnt, h = c.leftCol, i = c.rightCol + 1;
            return d = d || b.toLowerCase(),
                    e = a('<div class="fc-' + d + '-skeleton"><table><tr/></table></div>'),
                    f = e.find("tr"),
                    h > 0 && f.append('<td colspan="' + h + '"/>'),
                    f.append(c.el.attr("colspan", i - h)),
                    g > i && f.append('<td colspan="' + (g - i) + '"/>'),
                    this.bookendCells(f, b),
                    e
        }
    });
    kb.mixin({
        rowStructs: null,
        unrenderEvents: function () {
            this.removeSegPopover(),
                    jb.prototype.unrenderEvents.apply(this, arguments)
        },
        getEventSegs: function () {
            return jb.prototype.getEventSegs.call(this).concat(this.popoverSegs || [])
        },
        renderBgSegs: function (b) {
            var c = a.grep(b, function (a) {
                return a.event.allDay
            }
            );
            return jb.prototype.renderBgSegs.call(this, c)
        },
        renderFgSegs: function (b) {
            var c;
            return b = this.renderFgSegEls(b),
                    c = this.rowStructs = this.renderSegRows(b),
                    this.rowEls.each(function (b, d) {
                        a(d).find(".fc-content-skeleton > table").append(c[b].tbodyEl)
                    }
                    ),
                    b
        },
        unrenderFgSegs: function () {
            for (var a, b = this.rowStructs || []; a = b.pop(); )
                a.tbodyEl.remove();
            this.rowStructs = null
        },
        renderSegRows: function (a) {
            var b, c, d = [];
            for (b = this.groupSegRows(a),
                    c = 0; c < b.length; c++)
                d.push(this.renderSegRow(c, b[c]));
            return d
        },
        fgSegHtml: function (a, b) {
            var c, d, e = this.view, f = a.event, g = e.isEventDraggable(f), h = !b && f.allDay && a.isStart && e.isEventResizableFromStart(f), i = !b && f.allDay && a.isEnd && e.isEventResizableFromEnd(f), j = this.getSegClasses(a, g, h || i), k = $(this.getEventSkinCss(f)), l = "";
            return j.unshift("fc-day-grid-event", "fc-h-event"),
                    a.isStart && (c = this.getEventTimeText(f),
                            c && (l = '<span class="fc-time">' + Y(c) + "</span>")),
                    d = '<span class="fc-title">' + (Y(f.title || "") || "&nbsp;") + "</span>",
                    '<a class="' + j.join(" ") + '"' + (f.url ? ' href="' + Y(f.url) + '"' : "") + (k ? ' style="' + k + '"' : "") + '><div class="fc-content">' + (this.isRTL ? d + " " + l : l + " " + d) + "</div>" + (h ? '<div class="fc-resizer fc-start-resizer" />' : "") + (i ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        },
        renderSegRow: function (b, c) {
            function d(b) {
                for (; b > g; )
                    k = (r[e - 1] || [])[g],
                            k ? k.attr("rowspan", parseInt(k.attr("rowspan") || 1, 10) + 1) : (k = a("<td/>"),
                            h.append(k)),
                            q[e][g] = k,
                            r[e][g] = k,
                            g++
            }
            var e, f, g, h, i, j, k, l = this.colCnt, m = this.buildSegLevels(c), n = Math.max(1, m.length), o = a("<tbody/>"), p = [], q = [], r = [];
            for (e = 0; n > e; e++) {
                if (f = m[e],
                        g = 0,
                        h = a("<tr/>"),
                        p.push([]),
                        q.push([]),
                        r.push([]),
                        f)
                    for (i = 0; i < f.length; i++) {
                        for (j = f[i],
                                d(j.leftCol),
                                k = a('<td class="fc-event-container"/>').append(j.el),
                                j.leftCol != j.rightCol ? k.attr("colspan", j.rightCol - j.leftCol + 1) : r[e][g] = k; g <= j.rightCol; )
                            q[e][g] = k,
                                    p[e][g] = j,
                                    g++;
                        h.append(k)
                    }
                d(l),
                        this.bookendCells(h, "eventSkeleton"),
                        o.append(h)
            }
            return {
                row: b,
                tbodyEl: o,
                cellMatrix: q,
                segMatrix: p,
                segLevels: m,
                segs: c
            }
        },
        buildSegLevels: function (a) {
            var b, c, d, e = [];
            for (this.sortSegs(a),
                    b = 0; b < a.length; b++) {
                for (c = a[b],
                        d = 0; d < e.length && za(c, e[d]); d++)
                    ;
                c.level = d,
                        (e[d] || (e[d] = [])).push(c)
            }
            for (d = 0; d < e.length; d++)
                e[d].sort(Aa);
            return e
        },
        groupSegRows: function (a) {
            var b, c = [];
            for (b = 0; b < this.rowCnt; b++)
                c.push([]);
            for (b = 0; b < a.length; b++)
                c[a[b].row].push(a[b]);
            return c
        }
    }),
            kb.mixin({
                segPopover: null,
                popoverSegs: null,
                removeSegPopover: function () {
                    this.segPopover && this.segPopover.hide()
                },
                limitRows: function (a) {
                    var b, c, d = this.rowStructs || [];
                    for (b = 0; b < d.length; b++)
                        this.unlimitRow(b),
                                c = a ? "number" == typeof a ? a : this.computeRowLevelLimit(b) : !1,
                                c !== !1 && this.limitRow(b, c)
                },
                computeRowLevelLimit: function (b) {
                    function c(b, c) {
                        f = Math.max(f, a(c).outerHeight())
                    }
                    var d, e, f, g = this.rowEls.eq(b), h = g.height(), i = this.rowStructs[b].tbodyEl.children();
                    for (d = 0; d < i.length; d++)
                        if (e = i.eq(d).removeClass("fc-limited"),
                                f = 0,
                                e.find("> td > :first-child").each(c),
                                e.position().top + f > h)
                            return d;
                    return !1
                },
                limitRow: function (b, c) {
                    function d(d) {
                        for (; d > x; )
                            e = u.getCell(b, x),
                                    k = u.getCellSegs(e, c),
                                    k.length && (n = g[c - 1][x],
                                            t = u.renderMoreLink(e, k),
                                            s = a("<div/>").append(t),
                                            n.append(s),
                                            w.push(s[0])),
                                    x++
                    }
                    var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = this, v = this.rowStructs[b], w = [], x = 0;
                    if (c && c < v.segLevels.length) {
                        for (f = v.segLevels[c - 1],
                                g = v.cellMatrix,
                                h = v.tbodyEl.children().slice(c).addClass("fc-limited").get(),
                                i = 0; i < f.length; i++) {
                            for (j = f[i],
                                    d(j.leftCol),
                                    m = [],
                                    l = 0; x <= j.rightCol; )
                                e = this.getCell(b, x),
                                        k = this.getCellSegs(e, c),
                                        m.push(k),
                                        l += k.length,
                                        x++;
                            if (l) {
                                for (n = g[c - 1][j.leftCol],
                                        o = n.attr("rowspan") || 1,
                                        p = [],
                                        q = 0; q < m.length; q++)
                                    r = a('<td class="fc-more-cell"/>').attr("rowspan", o),
                                            k = m[q],
                                            e = this.getCell(b, j.leftCol + q),
                                            t = this.renderMoreLink(e, [j].concat(k)),
                                            s = a("<div/>").append(t),
                                            r.append(s),
                                            p.push(r[0]),
                                            w.push(r[0]);
                                n.addClass("fc-limited").after(a(p)),
                                        h.push(n[0])
                            }
                        }
                        d(this.colCnt),
                                v.moreEls = a(w),
                                v.limitedEls = a(h)
                    }
                },
                unlimitRow: function (a) {
                    var b = this.rowStructs[a];
                    b.moreEls && (b.moreEls.remove(),
                            b.moreEls = null),
                            b.limitedEls && (b.limitedEls.removeClass("fc-limited"),
                                    b.limitedEls = null)
                },
                renderMoreLink: function (b, c) {
                    var d = this
                            , e = this.view;
                    return a('<a class="fc-more"/>').text(this.getMoreLinkText(c.length)).on("click", function (f) {
                        var g = e.opt("eventLimitClick")
                                , h = b.start
                                , i = a(this)
                                , j = d.getCellDayEl(b)
                                , k = d.getCellSegs(b)
                                , l = d.resliceDaySegs(k, h)
                                , m = d.resliceDaySegs(c, h);
                        "function" == typeof g && (g = e.trigger("eventLimitClick", null, {
                            date: h,
                            dayEl: j,
                            moreEl: i,
                            segs: l,
                            hiddenSegs: m
                        }, f)),
                                "popover" === g ? d.showSegPopover(b, i, l) : "string" == typeof g && e.calendar.zoomTo(h, g)
                    }
                    )
                },
                showSegPopover: function (a, b, c) {
                    var d, e, f = this, g = this.view, h = b.parent();
                    d = 1 == this.rowCnt ? g.el : this.rowEls.eq(a.row),
                            e = {
                                className: "fc-more-popover",
                                content: this.renderSegPopoverContent(a, c),
                                parentEl: this.el,
                                top: d.offset().top,
                                autoHide: !0,
                                viewportConstrain: g.opt("popoverViewportConstrain"),
                                hide: function () {
                                    f.segPopover.removeElement(),
                                            f.segPopover = null,
                                            f.popoverSegs = null
                                }
                            },
                    this.isRTL ? e.right = h.offset().left + h.outerWidth() + 1 : e.left = h.offset().left - 1,
                            this.segPopover = new cb(e),
                            this.segPopover.show()
                },
                renderSegPopoverContent: function (b, c) {
                    var d, e = this.view, f = e.opt("theme"), g = b.start.format(e.opt("dayPopoverFormat")), h = a('<div class="fc-header ' + e.widgetHeaderClass + '"><span class="fc-close ' + (f ? "ui-icon ui-icon-closethick" : "fc-icon fc-icon-x") + '"></span><span class="fc-title">' + Y(g) + '</span><div class="fc-clear"/></div><div class="fc-body ' + e.widgetContentClass + '"><div class="fc-event-container"></div></div>'), i = h.find(".fc-event-container");
                    for (c = this.renderFgSegEls(c, !0),
                            this.popoverSegs = c,
                            d = 0; d < c.length; d++)
                        c[d].cell = b,
                                i.append(c[d].el);
                    return h
                },
                resliceDaySegs: function (b, c) {
                    var d = a.map(b, function (a) {
                        return a.event
                    }
                    )
                            , e = c.clone().stripTime()
                            , f = e.clone().add(1, "days")
                            , g = {
                                start: e,
                                end: f
                            };
                    return b = this.eventsToSegs(d, function (a) {
                        var b = E(a, g);
                        return b ? [b] : []
                    }
                    ),
                            this.sortSegs(b),
                            b
                },
                getMoreLinkText: function (a) {
                    var b = this.view.opt("eventLimitText");
                    return "function" == typeof b ? b(a) : "+" + a + " " + b
                },
                getCellSegs: function (a, b) {
                    for (var c, d = this.rowStructs[a.row].segMatrix, e = b || 0, f = []; e < d.length; )
                        c = d[e][a.col],
                                c && f.push(c),
                                e++;
                    return f
                }
            });
    var lb = jb.extend({
        slotDuration: null,
        snapDuration: null,
        minTime: null,
        maxTime: null,
        colDates: null,
        labelFormat: null,
        labelInterval: null,
        dayEls: null,
        slatEls: null,
        slatTops: null,
        helperEl: null,
        businessHourSegs: null,
        constructor: function () {
            jb.apply(this, arguments),
                    this.processOptions()
        },
        renderDates: function () {
            this.el.html(this.renderHtml()),
                    this.dayEls = this.el.find(".fc-day"),
                    this.slatEls = this.el.find(".fc-slats tr")
        },
        renderBusinessHours: function () {
            var a = this.view.calendar.getBusinessHoursEvents();
            this.businessHourSegs = this.renderFill("businessHours", this.eventsToSegs(a), "bgevent")
        },
        renderHtml: function () {
            return '<div class="fc-bg"><table>' + this.rowHtml("slotBg") + '</table></div><div class="fc-slats"><table>' + this.slatRowHtml() + "</table></div>"
        },
        slotBgCellHtml: function (a) {
            return this.bgCellHtml(a)
        },
        slatRowHtml: function () {
            for (var a, c, d, e = this.view, f = this.isRTL, g = "", h = b.duration(+this.minTime); h < this.maxTime; )
                a = this.start.clone().time(h),
                        c = ba(L(h, this.labelInterval)),
                        d = '<td class="fc-axis fc-time ' + e.widgetContentClass + '" ' + e.axisStyleAttr() + ">" + (c ? "<span>" + Y(a.format(this.labelFormat)) + "</span>" : "") + "</td>",
                        g += "<tr " + (c ? "" : 'class="fc-minor"') + ">" + (f ? "" : d) + '<td class="' + e.widgetContentClass + '"/>' + (f ? d : "") + "</tr>",
                        h.add(this.slotDuration);
            return g
        },
        processOptions: function () {
            var c, d = this.view, e = d.opt("slotDuration"), f = d.opt("snapDuration");
            e = b.duration(e),
                    f = f ? b.duration(f) : e,
                    this.slotDuration = e,
                    this.snapDuration = f,
                    this.cellDuration = f,
                    this.minTime = b.duration(d.opt("minTime")),
                    this.maxTime = b.duration(d.opt("maxTime")),
                    c = d.opt("slotLabelFormat"),
                    a.isArray(c) && (c = c[c.length - 1]),
                    this.labelFormat = c || d.opt("axisFormat") || d.opt("smallTimeFormat"),
                    c = d.opt("slotLabelInterval"),
                    this.labelInterval = c ? b.duration(c) : this.computeLabelInterval(e)
        },
        computeLabelInterval: function (a) {
            var c, d, e;
            for (c = yb.length - 1; c >= 0; c--)
                if (d = b.duration(yb[c]),
                        e = L(d, a),
                        ba(e) && e > 1)
                    return d;
            return b.duration(a)
        },
        computeColHeadFormat: function () {
            return this.colCnt > 1 ? this.view.opt("dayOfMonthFormat") : "dddd"
        },
        computeEventTimeFormat: function () {
            return this.view.opt("noMeridiemTimeFormat")
        },
        computeDisplayEventEnd: function () {
            return !0
        },
        rangeUpdated: function () {
            var a, b = this.view, c = [];
            for (a = this.start.clone(); a.isBefore(this.end); )
                c.push(a.clone()),
                        a.add(1, "day"),
                        a = b.skipHiddenDays(a);
            this.isRTL && c.reverse(),
                    this.colDates = c,
                    this.colCnt = c.length,
                    this.rowCnt = Math.ceil((this.maxTime - this.minTime) / this.snapDuration)
        },
        computeCellDate: function (a) {
            var b = this.colDates[a.col]
                    , c = this.computeSnapTime(a.row);
            return b = this.view.calendar.rezoneDate(b),
                    b.time(c),
                    b
        },
        getColEl: function (a) {
            return this.dayEls.eq(a)
        },
        computeSnapTime: function (a) {
            return b.duration(this.minTime + this.snapDuration * a)
        },
        rangeToSegs: function (a) {
            var b, c, d, e, f = this.colCnt, g = [];
            for (a = {
            start: a.start.clone().stripZone(),
                    end: a.end.clone().stripZone()
            },
                    c = 0; f > c; c++)
                d = this.colDates[c],
                        e = {
                            start: d.clone().time(this.minTime),
                            end: d.clone().time(this.maxTime)
                        },
                b = E(a, e),
                        b && (b.col = c,
                                g.push(b));
            return g
        },
        updateSize: function (a) {
            this.computeSlatTops(),
                    a && this.updateSegVerticals()
        },
        computeRowCoords: function () {
            var a, b, c = this.el.offset().top, d = [];
            for (a = 0; a < this.rowCnt; a++)
                b = {
                    top: c + this.computeTimeTop(this.computeSnapTime(a))
                },
                a > 0 && (d[a - 1].bottom = b.top),
                        d.push(b);
            return b.bottom = b.top + this.computeTimeTop(this.computeSnapTime(a)),
                    d
        },
        computeDateTop: function (a, c) {
            return this.computeTimeTop(b.duration(a.clone().stripZone() - c.clone().stripTime()))
        },
        computeTimeTop: function (a) {
            var b, c, d, e, f = (a - this.minTime) / this.slotDuration;
            return f = Math.max(0, f),
                    f = Math.min(this.slatEls.length, f),
                    b = Math.floor(f),
                    c = f - b,
                    d = this.slatTops[b],
                    c ? (e = this.slatTops[b + 1],
                            d + (e - d) * c) : d
        },
        computeSlatTops: function () {
            var b, c = [];
            this.slatEls.each(function (d, e) {
                b = a(e).position().top,
                        c.push(b)
            }
            ),
                    c.push(b + this.slatEls.last().outerHeight()),
                    this.slatTops = c
        },
        renderDrag: function (a, b) {
            return b ? (this.renderRangeHelper(a, b),
                    this.applyDragOpacity(this.helperEl),
                    !0) : void this.renderHighlight(this.eventRangeToSegs(a))
        },
        unrenderDrag: function () {
            this.unrenderHelper(),
                    this.unrenderHighlight()
        },
        renderEventResize: function (a, b) {
            this.renderRangeHelper(a, b)
        },
        unrenderEventResize: function () {
            this.unrenderHelper()
        },
        renderHelper: function (b, c) {
            var d, e, f, g, h = this.eventsToSegs([b]);
            for (h = this.renderFgSegEls(h),
                    d = this.renderSegTable(h),
                    e = 0; e < h.length; e++)
                f = h[e],
                        c && c.col === f.col && (g = c.el,
                                f.el.css({
                                    left: g.css("left"),
                                    right: g.css("right"),
                                    "margin-left": g.css("margin-left"),
                                    "margin-right": g.css("margin-right")
                                }));
            this.helperEl = a('<div class="fc-helper-skeleton"/>').append(d).appendTo(this.el)
        },
        unrenderHelper: function () {
            this.helperEl && (this.helperEl.remove(),
                    this.helperEl = null)
        },
        renderSelection: function (a) {
            this.view.opt("selectHelper") ? this.renderRangeHelper(a) : this.renderHighlight(this.selectionRangeToSegs(a))
        },
        unrenderSelection: function () {
            this.unrenderHelper(),
                    this.unrenderHighlight()
        },
        renderFill: function (b, c, d) {
            var e, f, g, h, i, j, k, l, m, n;
            if (c.length) {
                for (c = this.renderFillSegEls(b, c),
                        e = this.groupSegCols(c),
                        d = d || b.toLowerCase(),
                        f = a('<div class="fc-' + d + '-skeleton"><table><tr/></table></div>'),
                        g = f.find("tr"),
                        h = 0; h < e.length; h++)
                    if (i = e[h],
                            j = a("<td/>").appendTo(g),
                            i.length)
                        for (k = a('<div class="fc-' + d + '-container"/>').appendTo(j),
                                l = this.colDates[h],
                                m = 0; m < i.length; m++)
                            n = i[m],
                                    k.append(n.el.css({
                                        top: this.computeDateTop(n.start, l),
                                        bottom: -this.computeDateTop(n.end, l)
                                    }));
                this.bookendCells(g, b),
                        this.el.append(f),
                        this.elsByFill[b] = f
            }
            return c
        }
    });
    lb.mixin({
        eventSkeletonEl: null,
        renderFgSegs: function (b) {
            return b = this.renderFgSegEls(b),
                    this.el.append(this.eventSkeletonEl = a('<div class="fc-content-skeleton"/>').append(this.renderSegTable(b))),
                    b
        },
        unrenderFgSegs: function (a) {
            this.eventSkeletonEl && (this.eventSkeletonEl.remove(),
                    this.eventSkeletonEl = null)
        },
        renderSegTable: function (b) {
            var c, d, e, f, g, h, i = a("<table><tr/></table>"), j = i.find("tr");
            for (c = this.groupSegCols(b),
                    this.computeSegVerticals(b),
                    f = 0; f < c.length; f++) {
                for (g = c[f],
                        this.placeSlotSegs(g),
                        h = a('<div class="fc-event-container"/>'),
                        d = 0; d < g.length; d++)
                    e = g[d],
                            e.el.css(this.generateSegPositionCss(e)),
                            e.bottom - e.top < 30 && e.el.addClass("fc-short"),
                            h.append(e.el);
                j.append(a("<td/>").append(h))
            }
            return this.bookendCells(j, "eventSkeleton"),
                    i
        },
        placeSlotSegs: function (a) {
            var b, c, d;
            if (this.sortSegs(a),
                    b = Ba(a),
                    Ca(b),
                    c = b[0]) {
                for (d = 0; d < c.length; d++)
                    Da(c[d]);
                for (d = 0; d < c.length; d++)
                    this.computeSlotSegCoords(c[d], 0, 0)
            }
        },
        computeSlotSegCoords: function (a, b, c) {
            var d, e = a.forwardSegs;
            if (void 0 === a.forwardCoord)
                for (e.length ? (this.sortForwardSlotSegs(e),
                        this.computeSlotSegCoords(e[0], b + 1, c),
                        a.forwardCoord = e[0].backwardCoord) : a.forwardCoord = 1,
                        a.backwardCoord = a.forwardCoord - (a.forwardCoord - c) / (b + 1),
                        d = 0; d < e.length; d++)
                    this.computeSlotSegCoords(e[d], 0, a.forwardCoord)
        },
        updateSegVerticals: function () {
            var a, b = (this.segs || []).concat(this.businessHourSegs || []);
            for (this.computeSegVerticals(b),
                    a = 0; a < b.length; a++)
                b[a].el.css(this.generateSegVerticalCss(b[a]))
        },
        computeSegVerticals: function (a) {
            var b, c;
            for (b = 0; b < a.length; b++)
                c = a[b],
                        c.top = this.computeDateTop(c.start, c.start),
                        c.bottom = this.computeDateTop(c.end, c.start)
        },
        fgSegHtml: function (a, b) {
            var c, d, e, f = this.view, g = a.event, h = f.isEventDraggable(g), i = !b && a.isStart && f.isEventResizableFromStart(g), j = !b && a.isEnd && f.isEventResizableFromEnd(g), k = this.getSegClasses(a, h, i || j), l = $(this.getEventSkinCss(g));
            return k.unshift("fc-time-grid-event", "fc-v-event"),
                    f.isMultiDayEvent(g) ? (a.isStart || a.isEnd) && (c = this.getEventTimeText(a),
                    d = this.getEventTimeText(a, "LT"),
                    e = this.getEventTimeText(a, null, !1)) : (c = this.getEventTimeText(g),
                    d = this.getEventTimeText(g, "LT"),
                    e = this.getEventTimeText(g, null, !1)),
                    '<a class="' + k.join(" ") + '"' + (g.url ? ' href="' + Y(g.url) + '"' : "") + (l ? ' style="' + l + '"' : "") + '><div class="fc-content">' + (c ? '<div class="fc-time" data-start="' + Y(e) + '" data-full="' + Y(d) + '"><span>' + Y(c) + "</span></div>" : "") + (g.title ? '<div class="fc-title">' + Y(g.title) + "</div>" : "") + '</div><div class="fc-bg"/>' + (j ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        },
        generateSegPositionCss: function (a) {
            var b, c, d = this.view.opt("slotEventOverlap"), e = a.backwardCoord, f = a.forwardCoord, g = this.generateSegVerticalCss(a);
            return d && (f = Math.min(1, e + 2 * (f - e))),
                    this.isRTL ? (b = 1 - f,
                            c = e) : (b = e,
                    c = 1 - f),
                    g.zIndex = a.level + 1,
                    g.left = 100 * b + "%",
                    g.right = 100 * c + "%",
                    d && a.forwardPressure && (g[this.isRTL ? "marginLeft" : "marginRight"] = 20),
                    g
        },
        generateSegVerticalCss: function (a) {
            return {
                top: a.top,
                bottom: -a.bottom
            }
        },
        groupSegCols: function (a) {
            var b, c = [];
            for (b = 0; b < this.colCnt; b++)
                c.push([]);
            for (b = 0; b < a.length; b++)
                c[a[b].col].push(a[b]);
            return c
        },
        sortForwardSlotSegs: function (a) {
            a.sort(ca(this, "compareForwardSlotSegs"))
        },
        compareForwardSlotSegs: function (a, b) {
            return b.forwardPressure - a.forwardPressure || (a.backwardCoord || 0) - (b.backwardCoord || 0) || this.compareSegs(a, b)
        }
    });
    var mb = Ma.View = ra.extend({
        type: null,
        name: null,
        title: null,
        calendar: null,
        options: null,
        coordMap: null,
        el: null,
        displaying: null,
        isSkeletonRendered: !1,
        isEventsRendered: !1,
        start: null,
        end: null,
        intervalStart: null,
        intervalEnd: null,
        intervalDuration: null,
        intervalUnit: null,
        isRTL: !1,
        isSelected: !1,
        eventOrderSpecs: null,
        scrollerEl: null,
        scrollTop: null,
        widgetHeaderClass: null,
        widgetContentClass: null,
        highlightStateClass: null,
        nextDayThreshold: null,
        isHiddenDayHash: null,
        documentMousedownProxy: null,
        constructor: function (a, c, d, e) {
            this.calendar = a,
                    this.type = this.name = c,
                    this.options = d,
                    this.intervalDuration = e || b.duration(1, "day"),
                    this.nextDayThreshold = b.duration(this.opt("nextDayThreshold")),
                    this.initThemingProps(),
                    this.initHiddenDays(),
                    this.isRTL = this.opt("isRTL"),
                    this.eventOrderSpecs = A(this.opt("eventOrder")),
                    this.documentMousedownProxy = ca(this, "documentMousedown"),
                    this.initialize()
        },
        initialize: function () {},
        opt: function (a) {
            return this.options[a]
        },
        trigger: function (a, b) {
            var c = this.calendar;
            return c.trigger.apply(c, [a, b || this].concat(Array.prototype.slice.call(arguments, 2), [this]))
        },
        setDate: function (a) {
            this.setRange(this.computeRange(a))
        },
        setRange: function (b) {
            a.extend(this, b),
                    this.updateTitle()
        },
        computeRange: function (a) {
            var b, c, d = I(this.intervalDuration), e = a.clone().startOf(d), f = e.clone().add(this.intervalDuration);
            return /year|month|week|day/.test(d) ? (e.stripTime(),
                    f.stripTime()) : (e.hasTime() || (e = this.calendar.rezoneDate(e)),
                    f.hasTime() || (f = this.calendar.rezoneDate(f))),
                    b = e.clone(),
                    b = this.skipHiddenDays(b),
                    c = f.clone(),
                    c = this.skipHiddenDays(c, -1, !0),
                    {
                        intervalUnit: d,
                        intervalStart: e,
                        intervalEnd: f,
                        start: b,
                        end: c
                    }
        },
        computePrevDate: function (a) {
            return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).subtract(this.intervalDuration), -1)
        },
        computeNextDate: function (a) {
            return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).add(this.intervalDuration))
        },
        massageCurrentDate: function (a, b) {
            return this.intervalDuration.as("days") <= 1 && this.isHiddenDay(a) && (a = this.skipHiddenDays(a, b),
                    a.startOf("day")),
                    a
        },
        updateTitle: function () {
            this.title = this.computeTitle()
        },
        computeTitle: function () {
            return this.formatRange({
                start: this.intervalStart,
                end: this.intervalEnd
            }, this.opt("titleFormat") || this.computeTitleFormat(), this.opt("titleRangeSeparator"))
        },
        computeTitleFormat: function () {
            return "year" == this.intervalUnit ? "YYYY" : "month" == this.intervalUnit ? this.opt("monthYearFormat") : this.intervalDuration.as("days") > 1 ? "ll" : "LL"
        },
        formatRange: function (a, b, c) {
            var d = a.end;
            return d.hasTime() || (d = d.clone().subtract(1)),
                    ma(a.start, d, b, c, this.opt("isRTL"))
        },
        setElement: function (a) {
            this.el = a,
                    this.bindGlobalHandlers()
        },
        removeElement: function () {
            this.clear(),
                    this.isSkeletonRendered && (this.unrenderSkeleton(),
                            this.isSkeletonRendered = !1),
                    this.unbindGlobalHandlers(),
                    this.el.remove()
        },
        display: function (b) {
            var c = this
                    , d = null;
            return this.displaying && (d = this.queryScroll()),
                    this.clear().then(function () {
                return c.displaying = a.when(c.displayView(b)).then(function () {
                    c.forceScroll(c.computeInitialScroll(d)),
                            c.triggerRender()
                }
                )
            }
            )
        },
        clear: function () {
            var b = this
                    , c = this.displaying;
            return c ? c.then(function () {
                return b.displaying = null,
                        b.clearEvents(),
                        b.clearView()
            }
            ) : a.when()
        },
        displayView: function (a) {
            this.isSkeletonRendered || (this.renderSkeleton(),
                    this.isSkeletonRendered = !0),
                    this.setDate(a),
                    this.render && this.render(),
                    this.renderDates(),
                    this.updateSize(),
                    this.renderBusinessHours()
        },
        clearView: function () {
            this.unselect(),
                    this.triggerUnrender(),
                    this.unrenderBusinessHours(),
                    this.unrenderDates(),
                    this.destroy && this.destroy()
        },
        renderSkeleton: function () {},
        unrenderSkeleton: function () {},
        renderDates: function () {},
        unrenderDates: function () {},
        renderBusinessHours: function () {},
        unrenderBusinessHours: function () {},
        triggerRender: function () {
            this.trigger("viewRender", this, this, this.el)
        },
        triggerUnrender: function () {
            this.trigger("viewDestroy", this, this, this.el)
        },
        bindGlobalHandlers: function () {
            a(document).on("mousedown", this.documentMousedownProxy)
        },
        unbindGlobalHandlers: function () {
            a(document).off("mousedown", this.documentMousedownProxy)
        },
        initThemingProps: function () {
            var a = this.opt("theme") ? "ui" : "fc";
            this.widgetHeaderClass = a + "-widget-header",
                    this.widgetContentClass = a + "-widget-content",
                    this.highlightStateClass = a + "-state-highlight"
        },
        updateSize: function (a) {
            var b;
            a && (b = this.queryScroll()),
                    this.updateHeight(a),
                    this.updateWidth(a),
                    a && this.setScroll(b)
        },
        updateWidth: function (a) {},
        updateHeight: function (a) {
            var b = this.calendar;
            this.setHeight(b.getSuggestedViewHeight(), b.isHeightAuto())
        },
        setHeight: function (a, b) {},
        computeScrollerHeight: function (a) {
            var b, c, d = this.scrollerEl;
            return b = this.el.add(d),
                    b.css({
                        position: "relative",
                        left: -1
                    }),
                    c = this.el.outerHeight() - d.height(),
                    b.css({
                        position: "",
                        left: ""
                    }),
                    a - c
        },
        computeInitialScroll: function (a) {
            return 0
        },
        queryScroll: function () {
            return this.scrollerEl ? this.scrollerEl.scrollTop() : void 0
        },
        setScroll: function (a) {
            return this.scrollerEl ? this.scrollerEl.scrollTop(a) : void 0
        },
        forceScroll: function (a) {
            var b = this;
            this.setScroll(a),
                    setTimeout(function () {
                        b.setScroll(a)
                    }
                    , 0)
        },
        displayEvents: function (a) {
            var b = this.queryScroll();
            this.clearEvents(),
                    this.renderEvents(a),
                    this.isEventsRendered = !0,
                    this.setScroll(b),
                    this.triggerEventRender()
        },
        clearEvents: function () {
            this.isEventsRendered && (this.triggerEventUnrender(),
                    this.destroyEvents && this.destroyEvents(),
                    this.unrenderEvents(),
                    this.isEventsRendered = !1)
        },
        renderEvents: function (a) {},
        unrenderEvents: function () {},
        triggerEventRender: function () {
            this.renderedEventSegEach(function (a) {
                this.trigger("eventAfterRender", a.event, a.event, a.el)
            }
            ),
                    this.trigger("eventAfterAllRender")
        },
        triggerEventUnrender: function () {
            this.renderedEventSegEach(function (a) {
                this.trigger("eventDestroy", a.event, a.event, a.el)
            }
            )
        },
        resolveEventEl: function (b, c) {
            var d = this.trigger("eventRender", b, b, c);
            return d === !1 ? c = null : d && d !== !0 && (c = a(d)),
                    c
        },
        showEvent: function (a) {
            this.renderedEventSegEach(function (a) {
                a.el.css("visibility", "")
            }
            , a)
        },
        hideEvent: function (a) {
            this.renderedEventSegEach(function (a) {
                a.el.css("visibility", "hidden")
            }
            , a)
        },
        renderedEventSegEach: function (a, b) {
            var c, d = this.getEventSegs();
            for (c = 0; c < d.length; c++)
                b && d[c].event._id !== b._id || d[c].el && a.call(this, d[c])
        },
        getEventSegs: function () {
            return []
        },
        isEventDraggable: function (a) {
            var b = a.source || {};
            return X(a.startEditable, b.startEditable, this.opt("eventStartEditable"), a.editable, b.editable, this.opt("editable"))
        },
        reportEventDrop: function (a, b, c, d, e) {
            var f = this.calendar
                    , g = f.mutateEvent(a, b, c)
                    , h = function () {
                        g.undo(),
                                f.reportEventChange()
                    }
            ;
            this.triggerEventDrop(a, g.dateDelta, h, d, e),
                    f.reportEventChange()
        },
        triggerEventDrop: function (a, b, c, d, e) {
            this.trigger("eventDrop", d[0], a, b, c, e, {})
        },
        reportExternalDrop: function (b, c, d, e, f) {
            var g, h, i = b.eventProps;
            i && (g = a.extend({}, i, c),
                    h = this.calendar.renderEvent(g, b.stick)[0]),
                    this.triggerExternalDrop(h, c, d, e, f)
        },
        triggerExternalDrop: function (a, b, c, d, e) {
            this.trigger("drop", c[0], b.start, d, e),
                    a && this.trigger("eventReceive", null, a)
        },
        renderDrag: function (a, b) {},
        unrenderDrag: function () {},
        isEventResizableFromStart: function (a) {
            return this.opt("eventResizableFromStart") && this.isEventResizable(a)
        },
        isEventResizableFromEnd: function (a) {
            return this.isEventResizable(a)
        },
        isEventResizable: function (a) {
            var b = a.source || {};
            return X(a.durationEditable, b.durationEditable, this.opt("eventDurationEditable"), a.editable, b.editable, this.opt("editable"))
        },
        reportEventResize: function (a, b, c, d, e) {
            var f = this.calendar
                    , g = f.mutateEvent(a, b, c)
                    , h = function () {
                        g.undo(),
                                f.reportEventChange()
                    }
            ;
            this.triggerEventResize(a, g.durationDelta, h, d, e),
                    f.reportEventChange()
        },
        triggerEventResize: function (a, b, c, d, e) {
            this.trigger("eventResize", d[0], a, b, c, e, {})
        },
        select: function (a, b) {
            this.unselect(b),
                    this.renderSelection(a),
                    this.reportSelection(a, b)
        },
        renderSelection: function (a) {},
        reportSelection: function (a, b) {
            this.isSelected = !0,
                    this.triggerSelect(a, b)
        },
        triggerSelect: function (a, b) {
            this.trigger("select", null, a.start, a.end, b)
        },
        unselect: function (a) {
            this.isSelected && (this.isSelected = !1,
                    this.destroySelection && this.destroySelection(),
                    this.unrenderSelection(),
                    this.trigger("unselect", null, a))
        },
        unrenderSelection: function () {},
        documentMousedown: function (b) {
            var c;
            this.isSelected && this.opt("unselectAuto") && v(b) && (c = this.opt("unselectCancel"),
                    c && a(b.target).closest(c).length || this.unselect(b))
        },
        triggerDayClick: function (a, b, c) {
            this.trigger("dayClick", b, a.start, c)
        },
        initHiddenDays: function () {
            var b, c = this.opt("hiddenDays") || [], d = [], e = 0;
            for (this.opt("weekends") === !1 && c.push(0, 6),
                    b = 0; 7 > b; b++)
                (d[b] = -1 !== a.inArray(b, c)) || e++;
            if (!e)
                throw "invalid hiddenDays";
            this.isHiddenDayHash = d
        },
        isHiddenDay: function (a) {
            return b.isMoment(a) && (a = a.day()),
                    this.isHiddenDayHash[a]
        },
        skipHiddenDays: function (a, b, c) {
            var d = a.clone();
            for (b = b || 1; this.isHiddenDayHash[(d.day() + (c ? b : 0) + 7) % 7]; )
                d.add(b, "days");
            return d
        },
        computeDayRange: function (a) {
            var b, c = a.start.clone().stripTime(), d = a.end, e = null;
            return d && (e = d.clone().stripTime(),
                    b = +d.time(),
                    b && b >= this.nextDayThreshold && e.add(1, "days")),
                    (!d || c >= e) && (e = c.clone().add(1, "days")),
                    {
                        start: c,
                        end: e
                    }
        },
        isMultiDayEvent: function (a) {
            var b = this.computeDayRange(a);
            return b.end.diff(b.start, "days") > 1
        }
    })
            , nb = Ma.Calendar = ra.extend({
                dirDefaults: null,
                langDefaults: null,
                overrides: null,
                options: null,
                viewSpecCache: null,
                view: null,
                header: null,
                loadingLevel: 0,
                constructor: Ga,
                initialize: function () {},
                initOptions: function (a) {
                    var b, e, f, g;
                    a = d(a),
                            b = a.lang,
                            e = ob[b],
                            e || (b = nb.defaults.lang,
                                    e = ob[b] || {}),
                            f = X(a.isRTL, e.isRTL, nb.defaults.isRTL),
                            g = f ? nb.rtlDefaults : {},
                            this.dirDefaults = g,
                            this.langDefaults = e,
                            this.overrides = a,
                            this.options = c([nb.defaults, g, e, a]),
                            Ha(this.options),
                            this.viewSpecCache = {}
                },
                getViewSpec: function (a) {
                    var b = this.viewSpecCache;
                    return b[a] || (b[a] = this.buildViewSpec(a))
                },
                getUnitViewSpec: function (b) {
                    var c, d, e;
                    if (-1 != a.inArray(b, Ra))
                        for (c = this.header.getViewsWithButtons(),
                                a.each(Ma.views, function (a) {
                                    c.push(a)
                                }
                                ),
                                d = 0; d < c.length; d++)
                            if (e = this.getViewSpec(c[d]),
                                    e && e.singleUnit == b)
                                return e
                },
                buildViewSpec: function (a) {
                    for (var d, e, f, g, h = this.overrides.views || {}, i = [], j = [], k = [], l = a; l; )
                        d = Na[l],
                                e = h[l],
                                l = null,
                                "function" == typeof d && (d = {
                                    "class": d
                                }),
                                d && (i.unshift(d),
                                        j.unshift(d.defaults || {}),
                                        f = f || d.duration,
                                        l = l || d.type),
                                e && (k.unshift(e),
                                        f = f || e.duration,
                                        l = l || e.type);
                    return d = Q(i),
                            d.type = a,
                            d["class"] ? (f && (f = b.duration(f),
                            f.valueOf() && (d.duration = f,
                            g = I(f),
                            1 === f.as(g) && (d.singleUnit = g,
                            k.unshift(h[g] || {})))),
                            d.defaults = c(j),
                            d.overrides = c(k),
                            this.buildViewSpecOptions(d),
                            this.buildViewSpecButtonText(d, a),
                            d) : !1
                },
                buildViewSpecOptions: function (a) {
                    a.options = c([nb.defaults, a.defaults, this.dirDefaults, this.langDefaults, this.overrides, a.overrides]),
                            Ha(a.options)
                },
                buildViewSpecButtonText: function (a, b) {
                    function c(c) {
                        var d = c.buttonText || {};
                        return d[b] || (a.singleUnit ? d[a.singleUnit] : null)
                    }
                    a.buttonTextOverride = c(this.overrides) || a.overrides.buttonText,
                            a.buttonTextDefault = c(this.langDefaults) || c(this.dirDefaults) || a.defaults.buttonText || c(nb.defaults) || (a.duration ? this.humanizeDuration(a.duration) : null) || b
                },
                instantiateView: function (a) {
                    var b = this.getViewSpec(a);
                    return new b["class"](this, a, b.options, b.duration)
                },
                isValidViewType: function (a) {
                    return Boolean(this.getViewSpec(a))
                },
                pushLoading: function () {
                    this.loadingLevel++ || this.trigger("loading", null, !0, this.view)
                },
                popLoading: function () {
                    --this.loadingLevel || this.trigger("loading", null, !1, this.view)
                },
                buildSelectRange: function (a, b) {
                    return a = this.moment(a),
                            b = b ? this.moment(b) : a.hasTime() ? a.clone().add(this.defaultTimedEventDuration) : a.clone().add(this.defaultAllDayEventDuration),
                            {
                                start: a,
                                end: b
                            }
                }
            });
    nb.mixin(bb),
            nb.defaults = {
                titleRangeSeparator: " — ",
                monthYearFormat: "MMMM YYYY",
                defaultTimedEventDuration: "02:00:00",
                defaultAllDayEventDuration: {
                    days: 1
                },
                forceEventDuration: !1,
                nextDayThreshold: "09:00:00",
                defaultView: "month",
                aspectRatio: 1.35,
                header: {
                    left: "title",
                    center: "",
                    right: "Today prev,next"
                },
                weekends: !0,
                weekNumbers: !1,
                weekNumberTitle: "W",
                weekNumberCalculation: "local",
                scrollTime: "06:00:00",
                lazyFetching: !0,
                startParam: "start",
                endParam: "end",
                timezoneParam: "timezone",
                timezone: !1,
                isRTL: !1,
                buttonText: {
                    prev: "prev",
                    next: "next",
                    prevYear: "prev year",
                    nextYear: "next year",
                    year: "year",
                    today: "Today",
                    month: "month",
                    week: "week",
                    day: "day"
                },
                buttonIcons: {
                    prev: "left-single-arrow",
                    next: "right-single-arrow",
                    prevYear: "left-double-arrow",
                    nextYear: "right-double-arrow"
                },
                theme: !1,
                themeButtonIcons: {
                    prev: "circle-triangle-w",
                    next: "circle-triangle-e",
                    prevYear: "seek-prev",
                    nextYear: "seek-next"
                },
                dragOpacity: .75,
                dragRevertDuration: 500,
                dragScroll: !0,
                unselectAuto: !0,
                dropAccept: "*",
                eventOrder: "title",
                eventLimit: !1,
                eventLimitText: "more",
                eventLimitClick: "popover",
                dayPopoverFormat: "LL",
                handleWindowResize: !0,
                windowResizeDelay: 200
            },
    nb.englishDefaults = {
        dayPopoverFormat: "dddd, MMMM D"
    },
    nb.rtlDefaults = {
        header: {
            left: "next,prev today",
            center: "",
            right: "title"
        },
        buttonIcons: {
            prev: "right-single-arrow",
            next: "left-single-arrow",
            prevYear: "right-double-arrow",
            nextYear: "left-double-arrow"
        },
        themeButtonIcons: {
            prev: "circle-triangle-e",
            next: "circle-triangle-w",
            nextYear: "seek-prev",
            prevYear: "seek-next"
        }
    };
    var ob = Ma.langs = {};
    Ma.datepickerLang = function (b, c, d) {
        var e = ob[b] || (ob[b] = {});
        e.isRTL = d.isRTL,
                e.weekNumberTitle = d.weekHeader,
                a.each(pb, function (a, b) {
                    e[a] = b(d)
                }
                ),
                a.datepicker && (a.datepicker.regional[c] = a.datepicker.regional[b] = d,
                        a.datepicker.regional.en = a.datepicker.regional[""],
                        a.datepicker.setDefaults(d))
    }
    ,
            Ma.lang = function (b, d) {
                var e, f;
                e = ob[b] || (ob[b] = {}),
                        d && (e = ob[b] = c([e, d])),
                        f = Ia(b),
                        a.each(qb, function (a, b) {
                            null == e[a] && (e[a] = b(f, e))
                        }
                        ),
                        nb.defaults.lang = b
            }
    ;
    var pb = {
        buttonText: function (a) {
            return {
                prev: Z(a.prevText),
                next: Z(a.nextText),
                today: Z(a.currentText)
            }
        },
        monthYearFormat: function (a) {
            return a.showMonthAfterYear ? "YYYY[" + a.yearSuffix + "] MMMM" : "MMMM YYYY[" + a.yearSuffix + "]"
        }
    }
    , qb = {
        dayOfMonthFormat: function (a, b) {
            var c = a.longDateFormat("l");
            return c = c.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ""),
                    b.isRTL ? c += " ddd" : c = "ddd " + c,
                    c
        },
        mediumTimeFormat: function (a) {
            return a.longDateFormat("LT").replace(/\s*a$/i, "a")
        },
        smallTimeFormat: function (a) {
            return a.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "a")
        },
        extraSmallTimeFormat: function (a) {
            return a.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "t")
        },
        hourFormat: function (a) {
            return a.longDateFormat("LT").replace(":mm", "").replace(/(\Wmm)$/, "").replace(/\s*a$/i, "a")
        },
        noMeridiemTimeFormat: function (a) {
            return a.longDateFormat("LT").replace(/\s*a$/i, "")
        }
    }
    , rb = {
        smallDayDateFormat: function (a) {
            return a.isRTL ? "D dd" : "dd D"
        },
        weekFormat: function (a) {
            return a.isRTL ? "w[ " + a.weekNumberTitle + "]" : "[" + a.weekNumberTitle + " ]w"
        },
        smallWeekFormat: function (a) {
            return a.isRTL ? "w[" + a.weekNumberTitle + "]" : "[" + a.weekNumberTitle + "]w"
        }
    };
    Ma.lang("en", nb.englishDefaults),
            Ma.sourceNormalizers = [],
            Ma.sourceFetchers = [];
    var sb = {
        dataType: "json",
        cache: !1
    }
    , tb = 1;
    nb.prototype.getPeerEvents = function (a, b) {
        var c, d, e = this.getEventCache(), f = [];
        for (c = 0; c < e.length; c++)
            d = e[c],
                    a && a._id === d._id || f.push(d);
        return f
    }
    ;
    var ub = mb.extend({
        dayGrid: null,
        dayNumbersVisible: !1,
        weekNumbersVisible: !1,
        weekNumberWidth: null,
        headRowEl: null,
        initialize: function () {
            this.dayGrid = new kb(this),
                    this.coordMap = this.dayGrid.coordMap
        },
        setRange: function (a) {
            mb.prototype.setRange.call(this, a),
                    this.dayGrid.breakOnWeeks = /year|month|week/.test(this.intervalUnit),
                    this.dayGrid.setRange(a)
        },
        computeRange: function (a) {
            var b = mb.prototype.computeRange.call(this, a);
            return /year|month/.test(b.intervalUnit) && (b.start.startOf("week"),
                    b.start = this.skipHiddenDays(b.start),
                    b.end.weekday() && (b.end.add(1, "week").startOf("week"),
                    b.end = this.skipHiddenDays(b.end, -1, !0))),
                    b
        },
        renderDates: function () {
            this.dayNumbersVisible = this.dayGrid.rowCnt > 1,
                    this.weekNumbersVisible = this.opt("weekNumbers"),
                    this.dayGrid.numbersVisible = this.dayNumbersVisible || this.weekNumbersVisible,
                    this.el.addClass("fc-basic-view").html(this.renderHtml()),
                    this.headRowEl = this.el.find("thead .fc-row"),
                    this.scrollerEl = this.el.find(".fc-day-grid-container"),
                    this.dayGrid.coordMap.containerEl = this.scrollerEl,
                    this.dayGrid.setElement(this.el.find(".fc-day-grid")),
                    this.dayGrid.renderDates(this.hasRigidRows())
        },
        unrenderDates: function () {
            this.dayGrid.unrenderDates(),
                    this.dayGrid.removeElement()
        },
        renderBusinessHours: function () {
            this.dayGrid.renderBusinessHours()
        },
        renderHtml: function () {
            return '<table><thead class="fc-head"><tr><td class="' + this.widgetHeaderClass + '">' + this.dayGrid.headHtml() + '</td></tr></thead><tbody class="fc-body"><tr><td class="' + this.widgetContentClass + '"><div class="fc-day-grid-container"><div class="fc-day-grid"/></div></td></tr></tbody></table>'
        },
        headIntroHtml: function () {
            return this.weekNumbersVisible ? '<th class="fc-week-number ' + this.widgetHeaderClass + '" ' + this.weekNumberStyleAttr() + "><span>" + Y(this.opt("weekNumberTitle")) + "</span></th>" : void 0
        },
        numberIntroHtml: function (a) {
            return this.weekNumbersVisible ? '<td class="fc-week-number" ' + this.weekNumberStyleAttr() + "><span>" + this.dayGrid.getCell(a, 0).start.format("w") + "</span></td>" : void 0
        },
        dayIntroHtml: function () {
            return this.weekNumbersVisible ? '<td class="fc-week-number ' + this.widgetContentClass + '" ' + this.weekNumberStyleAttr() + "></td>" : void 0
        },
        introHtml: function () {
            return this.weekNumbersVisible ? '<td class="fc-week-number" ' + this.weekNumberStyleAttr() + "></td>" : void 0
        },
        numberCellHtml: function (a) {
            var b, c = a.start;
            //          if(c.date() == 1){
            // return this.dayNumbersVisible ? (b = this.dayGrid.getDayClasses(c),
            //          b.unshift("fc-day-number"),

            // '<td class="' + b.join(" ") + '" data-date="' + c.format() + '">' +c.format("MMM") + " " + c.date() + "</td>") : "<td/>"
            // }else{
            return this.dayNumbersVisible ? (b = this.dayGrid.getDayClasses(c),
                    b.unshift("fc-day-number"),
                    '<td class="' + b.join(" ") + '" data-date="' + c.format() + '">' + c.date() + "</td>") : "<td/>"


            // }
        },
        weekNumberStyleAttr: function () {
            return null !== this.weekNumberWidth ? 'style="width:' + this.weekNumberWidth + 'px"' : ""
        },
        hasRigidRows: function () {
            var a = this.opt("eventLimit");
            return a && "number" != typeof a
        },
        updateWidth: function () {
            this.weekNumbersVisible && (this.weekNumberWidth = k(this.el.find(".fc-week-number")))
        },
        setHeight: function (a, b) {
            var c, d = this.opt("eventLimit");
            m(this.scrollerEl),
                    f(this.headRowEl),
                    this.dayGrid.removeSegPopover(),
                    d && "number" == typeof d && this.dayGrid.limitRows(d),
                    c = this.computeScrollerHeight(a),
                    this.setGridHeight(c, b),
                    d && "number" != typeof d && this.dayGrid.limitRows(d),
                    !b && l(this.scrollerEl, c) && (e(this.headRowEl, r(this.scrollerEl)),
                    c = this.computeScrollerHeight(a),
                    this.scrollerEl.height(c))
        },
        setGridHeight: function (a, b) {
            b ? j(this.dayGrid.rowEls) : i(this.dayGrid.rowEls, a, !0)
        },
        renderEvents: function (a) {
            this.dayGrid.renderEvents(a),
                    this.updateHeight()
        },
        getEventSegs: function () {
            return this.dayGrid.getEventSegs()
        },
        unrenderEvents: function () {
            this.dayGrid.unrenderEvents()
        },
        renderDrag: function (a, b) {
            return this.dayGrid.renderDrag(a, b)
        },
        unrenderDrag: function () {
            this.dayGrid.unrenderDrag()
        },
        renderSelection: function (a) {
            this.dayGrid.renderSelection(a)
        },
        unrenderSelection: function () {
            this.dayGrid.unrenderSelection()
        }
    })
            , vb = ub.extend({
                computeRange: function (a) {
                    var b, c = ub.prototype.computeRange.call(this, a);
                    return this.isFixedWeeks() && (b = Math.ceil(c.end.diff(c.start, "weeks", !0)),
                            c.end.add(6 - b, "weeks")),
                            c
                },
                setGridHeight: function (a, b) {
                    b = b || "variable" === this.opt("weekMode"),
                            b && (a *= this.rowCnt / 6),
                            i(this.dayGrid.rowEls, a, !b)
                },
                isFixedWeeks: function () {
                    var a = this.opt("weekMode");
                    return a ? "fixed" === a : this.opt("fixedWeekCount")
                }
            });
    Na.basic = {
        "class": ub
    },
    Na.basicDay = {
        type: "basic",
        duration: {
            days: 1
        }
    },
    Na.basicWeek = {
        type: "basic",
        duration: {
            weeks: 1
        }
    },
    Na.month = {
        "class": vb,
        duration: {
            months: 1
        },
        defaults: {
            fixedWeekCount: !0
        }
    };
    var wb = mb.extend({
        timeGrid: null,
        dayGrid: null,
        axisWidth: null,
        noScrollRowEls: null,
        bottomRuleEl: null,
        bottomRuleHeight: null,
        initialize: function () {
            this.timeGrid = new lb(this),
                    this.opt("allDaySlot") ? (this.dayGrid = new kb(this),
                    this.coordMap = new eb([this.dayGrid.coordMap, this.timeGrid.coordMap])) : this.coordMap = this.timeGrid.coordMap
        },
        setRange: function (a) {
            mb.prototype.setRange.call(this, a),
                    this.timeGrid.setRange(a),
                    this.dayGrid && this.dayGrid.setRange(a)
        },
        renderDates: function () {
            this.el.addClass("fc-agenda-view").html(this.renderHtml()),
                    this.scrollerEl = this.el.find(".fc-time-grid-container"),
                    this.timeGrid.coordMap.containerEl = this.scrollerEl,
                    this.timeGrid.setElement(this.el.find(".fc-time-grid")),
                    this.timeGrid.renderDates(),
                    this.bottomRuleEl = a('<hr class="fc-divider ' + this.widgetHeaderClass + '"/>').appendTo(this.timeGrid.el),
                    this.dayGrid && (this.dayGrid.setElement(this.el.find(".fc-day-grid")),
                            this.dayGrid.renderDates(),
                            this.dayGrid.bottomCoordPadding = this.dayGrid.el.next("hr").outerHeight()),
                    this.noScrollRowEls = this.el.find(".fc-row:not(.fc-scroller *)")
        },
        unrenderDates: function () {
            this.timeGrid.unrenderDates(),
                    this.timeGrid.removeElement(),
                    this.dayGrid && (this.dayGrid.unrenderDates(),
                            this.dayGrid.removeElement())
        },
        renderBusinessHours: function () {
            this.timeGrid.renderBusinessHours(),
                    this.dayGrid && this.dayGrid.renderBusinessHours()
        },
        renderHtml: function () {
            return '<table><thead class="fc-head"><tr><td class="' + this.widgetHeaderClass + '">' + this.timeGrid.headHtml() + '</td></tr></thead><tbody class="fc-body"><tr><td class="' + this.widgetContentClass + '">' + (this.dayGrid ? '<div class="fc-day-grid"/><hr class="fc-divider ' + this.widgetHeaderClass + '"/>' : "") + '<div class="fc-time-grid-container"><div class="fc-time-grid"/></div></td></tr></tbody></table>'
        },
        headIntroHtml: function () {
            var a, b;
            return this.opt("weekNumbers") ? (a = this.timeGrid.getCell(0).start,
                    b = a.format(this.opt("smallWeekFormat")),
                    '<th class="fc-axis fc-week-number ' + this.widgetHeaderClass + '" ' + this.axisStyleAttr() + "><span>" + Y(b) + "</span></th>") : '<th class="fc-axis ' + this.widgetHeaderClass + '" ' + this.axisStyleAttr() + "></th>"
        },
        dayIntroHtml: function () {
            return '<td class="fc-axis ' + this.widgetContentClass + '" ' + this.axisStyleAttr() + "><span>" + (this.opt("allDayHtml") || Y(this.opt("allDayText"))) + "</span></td>"
        },
        slotBgIntroHtml: function () {
            return '<td class="fc-axis ' + this.widgetContentClass + '" ' + this.axisStyleAttr() + "></td>";
        },
        introHtml: function () {
            return '<td class="fc-axis" ' + this.axisStyleAttr() + "></td>"
        },
        axisStyleAttr: function () {
            return null !== this.axisWidth ? 'style="width:' + this.axisWidth + 'px"' : ""
        },
        updateSize: function (a) {
            this.timeGrid.updateSize(a),
                    mb.prototype.updateSize.call(this, a)
        },
        updateWidth: function () {
            this.axisWidth = k(this.el.find(".fc-axis"))
        },
        setHeight: function (a, b) {
            var c, d;
            null === this.bottomRuleHeight && (this.bottomRuleHeight = this.bottomRuleEl.outerHeight()),
                    this.bottomRuleEl.hide(),
                    this.scrollerEl.css("overflow", ""),
                    m(this.scrollerEl),
                    f(this.noScrollRowEls),
                    this.dayGrid && (this.dayGrid.removeSegPopover(),
                            c = this.opt("eventLimit"),
                            c && "number" != typeof c && (c = xb),
                            c && this.dayGrid.limitRows(c)),
                    b || (d = this.computeScrollerHeight(a),
                            l(this.scrollerEl, d) ? (e(this.noScrollRowEls, r(this.scrollerEl)),
                            d = this.computeScrollerHeight(a),
                            this.scrollerEl.height(d)) : (this.scrollerEl.height(d).css("overflow", "hidden"),
                            this.bottomRuleEl.show()))
        },
        computeInitialScroll: function () {
            var a = b.duration(this.opt("scrollTime"))
                    , c = this.timeGrid.computeTimeTop(a);
            return c = Math.ceil(c),
                    c && c++,
                    c
        },
        renderEvents: function (a) {
            var b, c, d = [], e = [], f = [];
            for (c = 0; c < a.length; c++)
                a[c].allDay ? d.push(a[c]) : e.push(a[c]);
            b = this.timeGrid.renderEvents(e),
                    this.dayGrid && (f = this.dayGrid.renderEvents(d)),
                    this.updateHeight()
        },
        getEventSegs: function () {
            return this.timeGrid.getEventSegs().concat(this.dayGrid ? this.dayGrid.getEventSegs() : [])
        },
        unrenderEvents: function () {
            this.timeGrid.unrenderEvents(),
                    this.dayGrid && this.dayGrid.unrenderEvents()
        },
        renderDrag: function (a, b) {
            return a.start.hasTime() ? this.timeGrid.renderDrag(a, b) : this.dayGrid ? this.dayGrid.renderDrag(a, b) : void 0
        },
        unrenderDrag: function () {
            this.timeGrid.unrenderDrag(),
                    this.dayGrid && this.dayGrid.unrenderDrag()
        },
        renderSelection: function (a) {
            a.start.hasTime() || a.end.hasTime() ? this.timeGrid.renderSelection(a) : this.dayGrid && this.dayGrid.renderSelection(a)
        },
        unrenderSelection: function () {
            this.timeGrid.unrenderSelection(),
                    this.dayGrid && this.dayGrid.unrenderSelection()
        }
    })
            , xb = 5
            , yb = [{
                    hours: 1
                }, {
                    minutes: 30
                }, {
                    minutes: 15
                }, {
                    seconds: 30
                }, {
                    seconds: 15
                }];
    return Na.agenda = {
        "class": wb,
        defaults: {
            allDaySlot: !0,
            allDayText: "all-day",
            slotDuration: "00:30:00",
            minTime: "00:00:00",
            maxTime: "24:00:00",
            slotEventOverlap: !0
        }
    },
    Na.agendaDay = {
        type: "agenda",
        duration: {
            days: 1
        }
    },
    Na.agendaWeek = {
        type: "agenda",
        duration: {
            weeks: 1
        }
    },
    Ma
}
);
/*!End FullCalendar v2.4.0 */

/* start fullcalendar-rightclick v1.6 */
(function ($) {
    function monkeyPatchViewClass(View) {
        View = View.class || View;
        var renderFn = 'render' in View.prototype ? 'render' : 'renderDates';
        var originalRender = View.prototype[renderFn];
        View.prototype[renderFn] = function () {
            originalRender.call(this);
            if (!this.el.data('fullcalendar-rightclick')) {
                this.registerRightclickListener();
                this.el.data('fullcalendar-rightclick', true)
            }
        };
        View.prototype.registerRightclickListener = function () {
            var that = this;
            this.el.on('contextmenu', function (ev) {
                var eventElt = $(ev.target).closest('.fc-event');
                if (eventElt.length) {
                    var seg = eventElt.data('fc-seg');
                    return that.trigger('eventRightclick', this, seg.event, ev);
                } else {
                    // Users of this library may add custom content inside
                    // FullCalendar's DOM structure, eg. popovers. We don't want
                    // to catch rightclicks on these custom elements, so we
                    // check that the clicked element actually lies inside one
                    // of FullCalendars default containers:
                    var fcContainer = $(ev.target).closest(
                            '.fc-bg, .fc-slats, .fc-content-skeleton, ' +
                            '.fc-bgevent-skeleton'
                            );
                    if (fcContainer.length) {
                        that.coordMap.build();
                        var cell = that.coordMap.getCell(ev.pageX, ev.pageY);
                        if (cell)
                            return that.trigger(
                                    'dayRightclick', null, cell.start, ev
                                    );
                    }
                }
            });
        }
    }
    var fc = $.fullCalendar;
    monkeyPatchViewClass(fc.views.agenda);
    monkeyPatchViewClass(fc.views.basic);
})(jQuery);
/* End fullcalendar-rightclick v1.6 */

/*start Autosize 3.0.14 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.autosize = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var set = typeof Set === 'function' ? new Set() : (function () {
        var list = [];

        return {
            has: function has(key) {
                return Boolean(list.indexOf(key) > -1);
            },
            add: function add(key) {
                list.push(key);
            },
            'delete': function _delete(key) {
                list.splice(list.indexOf(key), 1);
            }};
    })();

    function assign(ta) {
        var _ref = arguments[1] === undefined ? {} : arguments[1];

        var _ref$setOverflowX = _ref.setOverflowX;
        var setOverflowX = _ref$setOverflowX === undefined ? true : _ref$setOverflowX;
        var _ref$setOverflowY = _ref.setOverflowY;
        var setOverflowY = _ref$setOverflowY === undefined ? true : _ref$setOverflowY;

        if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || set.has(ta))
            return;

        var heightOffset = null;
        var overflowY = null;
        var clientWidth = ta.clientWidth;

        function init() {
            var style = window.getComputedStyle(ta, null);

            overflowY = style.overflowY;

            if (style.resize === 'vertical') {
                ta.style.resize = 'none';
            } else if (style.resize === 'both') {
                ta.style.resize = 'horizontal';
            }

            if (style.boxSizing === 'content-box') {
                heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
            } else {
                heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
            }
            // Fix when a textarea is not on document body and heightOffset is Not a Number
            if (isNaN(heightOffset)) {
                heightOffset = 0;
            }

            update();
        }

        function changeOverflow(value) {
            {
                // Chrome/Safari-specific fix:
                // When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
                // made available by removing the scrollbar. The following forces the necessary text reflow.
                var width = ta.style.width;
                ta.style.width = '0px';
                // Force reflow:
                /* jshint ignore:start */
                ta.offsetWidth;
                /* jshint ignore:end */
                ta.style.width = width;
            }

            overflowY = value;

            if (setOverflowY) {
                ta.style.overflowY = value;
            }

            resize();
        }

        function resize() {
            var htmlTop = window.pageYOffset;
            var bodyTop = document.body.scrollTop;
            var originalHeight = ta.style.height;

            ta.style.height = 'auto';

            var endHeight = ta.scrollHeight + heightOffset;

            if (ta.scrollHeight === 0) {
                // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
                ta.style.height = originalHeight;
                return;
            }

            ta.style.height = endHeight + 'px';

            // used to check if an update is actually necessary on window.resize
            clientWidth = ta.clientWidth;

            // prevents scroll-position jumping
            document.documentElement.scrollTop = htmlTop;
            document.body.scrollTop = bodyTop;
        }

        function update() {
            var startHeight = ta.style.height;

            resize();

            var style = window.getComputedStyle(ta, null);

            if (style.height !== ta.style.height) {
                if (overflowY !== 'visible') {
                    changeOverflow('visible');
                }
            } else {
                if (overflowY !== 'hidden') {
                    changeOverflow('hidden');
                }
            }

            if (startHeight !== ta.style.height) {
                var evt = document.createEvent('Event');
                evt.initEvent('autosize:resized', true, false);
                ta.dispatchEvent(evt);
            }
        }

        var pageResize = function pageResize() {
            if (ta.clientWidth !== clientWidth) {
                update();
            }
        };

        var destroy = (function (style) {
            window.removeEventListener('resize', pageResize, false);
            ta.removeEventListener('input', update, false);
            ta.removeEventListener('keyup', update, false);
            ta.removeEventListener('autosize:destroy', destroy, false);
            ta.removeEventListener('autosize:update', update, false);
            set['delete'](ta);

            Object.keys(style).forEach(function (key) {
                ta.style[key] = style[key];
            });
        }).bind(ta, {
            height: ta.style.height,
            resize: ta.style.resize,
            overflowY: ta.style.overflowY,
            overflowX: ta.style.overflowX,
            wordWrap: ta.style.wordWrap});

        ta.addEventListener('autosize:destroy', destroy, false);

        // IE9 does not fire onpropertychange or oninput for deletions,
        // so binding to onkeyup to catch most of those events.
        // There is no way that I know of to detect something like 'cut' in IE9.
        if ('onpropertychange' in ta && 'oninput' in ta) {
            ta.addEventListener('keyup', update, false);
        }

        window.addEventListener('resize', pageResize, false);
        ta.addEventListener('input', update, false);
        ta.addEventListener('autosize:update', update, false);
        set.add(ta);

        if (setOverflowX) {
            ta.style.overflowX = 'hidden';
            ta.style.wordWrap = 'break-word';
        }

        init();
    }

    function destroy(ta) {
        if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA'))
            return;
        var evt = document.createEvent('Event');
        evt.initEvent('autosize:destroy', true, false);
        ta.dispatchEvent(evt);
    }

    function update(ta) {
        if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA'))
            return;
        var evt = document.createEvent('Event');
        evt.initEvent('autosize:update', true, false);
        ta.dispatchEvent(evt);
    }

    var autosize = null;

    // Do nothing in Node.js environment and IE8 (or lower)
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
        autosize = function (el) {
            return el;
        };
        autosize.destroy = function (el) {
            return el;
        };
        autosize.update = function (el) {
            return el;
        };
    } else {
        autosize = function (el, options) {
            if (el) {
                Array.prototype.forEach.call(el.length ? el : [el], function (x) {
                    return assign(x, options);
                });
            }
            return el;
        };
        autosize.destroy = function (el) {
            if (el) {
                Array.prototype.forEach.call(el.length ? el : [el], destroy);
            }
            return el;
        };
        autosize.update = function (el) {
            if (el) {
                Array.prototype.forEach.call(el.length ? el : [el], update);
            }
            return el;
        };
    }

    module.exports = autosize;
});
/*End Autosize 3.0.14 */

/* start Time entry for jQuery v1.5.1. */
(function ($) { // Hide scope, no $ conflict

    /* TimeEntry manager.
     Use the singleton instance of this class, $.timeEntry, to interact with the time entry
     functionality. Settings for (groups of) fields are maintained in an instance object,
     allowing multiple different settings on the same page. */
    function TimeEntry() {
        this._disabledInputs = []; // List of time entry inputs that have been disabled
        this.regional = []; // Available regional settings, indexed by language code
        this.regional[''] = {// Default regional settings
            show24Hours: false, // True to use 24 hour time, false for 12 hour (AM/PM)
            separator: ':', // The separator between time fields
            ampmPrefix: '', // The separator before the AM/PM text
            ampmNames: ['AM', 'PM'], // Names of morning/evening markers
            spinnerTexts: ['Now', 'Previous field', 'Next field', 'Increment', 'Decrement']
                    // The popup texts for the spinner image areas
        };
        this._defaults = {
            appendText: '', // Display text following the input box, e.g. showing the format
            showSeconds: false, // True to show seconds as well, false for hours/minutes only
            timeSteps: [1, 1, 1], // Steps for each of hours/minutes/seconds when incrementing/decrementing
            initialField: 0, // The field to highlight initially, 0 = hours, 1 = minutes, ...
            noSeparatorEntry: false, // True to move to next sub-field after two digits entry
            useMouseWheel: true, // True to use mouse wheel for increment/decrement if possible,
            // false to never use it
            defaultTime: null, // The time to use if none has been set, leave at null for now
            minTime: null, // The earliest selectable time, or null for no limit
            maxTime: null, // The latest selectable time, or null for no limit
            spinnerImage: 'spinnerDefault.png', // The URL of the images to use for the time spinner
            // Seven images packed horizontally for normal, each button pressed, and disabled
            spinnerSize: [20, 20, 8], // The width and height of the spinner image,
            // and size of centre button for current time
            spinnerBigImage: '', // The URL of the images to use for the expanded time spinner
            // Seven images packed horizontally for normal, each button pressed, and disabled
            spinnerBigSize: [40, 40, 16], // The width and height of the expanded spinner image,
            // and size of centre button for current time
            spinnerIncDecOnly: false, // True for increment/decrement buttons only, false for all
            spinnerRepeat: [500, 250], // Initial and subsequent waits in milliseconds
            // for repeats on the spinner buttons
            beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the time entry
            beforeSetTime: null // Function that runs before updating the time,
                    // takes the old and new times, and minimum and maximum times as parameters,
                    // and returns an adjusted time if necessary
        };
        $.extend(this._defaults, this.regional['']);
    }

    $.extend(TimeEntry.prototype, {
        /* Class name added to elements to indicate already configured with time entry. */
        markerClassName: 'hasTimeEntry',
        /* Name of the data property for instance settings. */
        propertyName: 'timeEntry',
        /* Class name for the appended content. */
        _appendClass: 'timeEntry_append',
        /* Class name for the time entry control. */
        _controlClass: 'timeEntry_control',
        /* Class name for the expanded spinner. */
        _expandClass: 'timeEntry_expand',
        /* Override the default settings for all instances of the time entry.
         @param  options  (object) the new settings to use as defaults (anonymous object)
         @return  (DateEntry) this object */
        setDefaults: function (options) {
            $.extend(this._defaults, options || {});
            return this;
        },
        /* Attach the time entry handler to an input field.
         @param  target   (element) the field to attach to
         @param  options  (object) custom settings for this instance */
        _attachPlugin: function (target, options) {
            var input = $(target);
            if (input.hasClass(this.markerClassName)) {
                return;
            }
            var inst = {options: $.extend({}, this._defaults, options), input: input, _field: 0,
                _selectedHour: 0, _selectedMinute: 0, _selectedSecond: 0};
            input.data(this.propertyName, inst).addClass(this.markerClassName).
                    bind('focus.' + this.propertyName, this._doFocus).
                    bind('blur.' + this.propertyName, this._doBlur).
                    bind('click.' + this.propertyName, this._doClick).
                    bind('keydown.' + this.propertyName, this._doKeyDown).
                    bind('keypress.' + this.propertyName, this._doKeyPress).
                    bind('paste.' + this.propertyName, function (event) { // Check pastes
                        setTimeout(function () {
                            plugin._parseTime(inst);
                        }, 1);
                    });
            this._optionPlugin(target, options);
        },
        /* Retrieve or reconfigure the settings for a time entry control.
         @param  target   (element) the control to affect
         @param  options  (object) the new options for this instance or
         (string) an individual property name
         @param  value    (any) the individual property value (omit if options
         is an object or to retrieve the value of a setting)
         @return  (any) if retrieving a value  */
        _optionPlugin: function (target, options, value) {
            target = $(target);
            var inst = target.data(this.propertyName);
            if (!options || (typeof options == 'string' && value == null)) { // Get option
                var name = options;
                options = (inst || {}).options;
                return (options && name ? options[name] : options);
            }

            if (!target.hasClass(this.markerClassName)) {
                return;
            }
            options = options || {};
            if (typeof options == 'string') {
                var name = options;
                options = {};
                options[name] = value;
            }
            var currentTime = this._extractTime(inst);
            $.extend(inst.options, options);
            inst._field = 0;
            if (currentTime) {
                this._setTime(inst, new Date(0, 0, 0, currentTime[0], currentTime[1], currentTime[2]));
            }
            // Remove stuff dependent on old settings
            target.next('span.' + this._appendClass).remove();
            target.parent().find('span.' + this._controlClass).remove();
            if ($.fn.mousewheel) {
                target.unmousewheel();
            }
            // And re-add if requested
            var spinner = (!inst.options.spinnerImage ? null :
                    $('<span class="' + this._controlClass + '" style="display: inline-block; ' +
                            'background: url(\'' + inst.options.spinnerImage + '\') 0 0 no-repeat; width: ' +
                            inst.options.spinnerSize[0] + 'px; height: ' + inst.options.spinnerSize[1] + 'px;"></span>'));
            target.after(inst.options.appendText ? '<span class="' + this._appendClass + '">' +
                    inst.options.appendText + '</span>' : '').after(spinner || '');
            // Allow mouse wheel usage
            if (inst.options.useMouseWheel && $.fn.mousewheel) {
                target.mousewheel(this._doMouseWheel);
            }
            if (spinner) {
                spinner.mousedown(this._handleSpinner).mouseup(this._endSpinner).
                        mouseover(this._expandSpinner).mouseout(this._endSpinner).
                        mousemove(this._describeSpinner);
            }
        },
        /* Enable a time entry input and any associated spinner.
         @param  target  (element) single input field */
        _enablePlugin: function (target) {
            this._enableDisable(target, false);
        },
        /* Disable a time entry input and any associated spinner.
         @param  target  (element) single input field */
        _disablePlugin: function (target) {
            this._enableDisable(target, true);
        },
        /* Enable or disable a time entry input and any associated spinner.
         @param  target   (element) single input field
         @param  disable  (boolean) true to disable, false to enable */
        _enableDisable: function (target, disable) {
            var inst = $.data(target, this.propertyName);
            if (!inst) {
                return;
            }
            target.disabled = disable;
            if (target.nextSibling && target.nextSibling.nodeName.toLowerCase() == 'span') {
                plugin._changeSpinner(inst, target.nextSibling, (disable ? 5 : -1));
            }
            plugin._disabledInputs = $.map(plugin._disabledInputs,
                    function (value) {
                        return (value == target ? null : value);
                    }); // Delete entry
            if (disable) {
                plugin._disabledInputs.push(target);
            }
        },
        /* Check whether an input field has been disabled.
         @param  target  (element) input field to check
         @return  (boolean) true if this field has been disabled, false if it is enabled */
        _isDisabledPlugin: function (target) {
            return $.inArray(target, this._disabledInputs) > -1;
        },
        /* Remove the time entry functionality from an input.
         @param  target  (element) the control to affect */
        _destroyPlugin: function (target) {
            target = $(target);
            if (!target.hasClass(this.markerClassName)) {
                return;
            }
            target.removeClass(this.markerClassName).removeData(this.propertyName).
                    unbind('.' + this.propertyName);
            if ($.fn.mousewheel) {
                target.unmousewheel();
            }
            this._disabledInputs = $.map(this._disabledInputs,
                    function (value) {
                        return (value == target[0] ? null : value);
                    }); // Delete entry
            target.siblings('.' + this._appendClass + ',.' + this._controlClass).remove();
        },
        /* Initialise the current time for a time entry input field.
         @param  target  (element) input field to update
         @param  time    (Date) the new time (year/month/day ignored) or null for now */
        _setTimePlugin: function (target, time) {
            var inst = $.data(target, this.propertyName);
            if (inst) {
                if (time === null || time === '') {
                    inst.input.val('');
                } else {
                    this._setTime(inst, time ? (typeof time == 'object' ?
                            new Date(time.getTime()) : time) : null);
                }
            }
        },
        /* Retrieve the current time for a time entry input field.
         @param  target  (element) input field to examine
         @return  (Date) current time (year/month/day zero) or null if none */
        _getTimePlugin: function (target) {
            var inst = $.data(target, this.propertyName);
            var currentTime = (inst ? this._extractTime(inst) : null);
            return (!currentTime ? null :
                    new Date(0, 0, 0, currentTime[0], currentTime[1], currentTime[2]));
        },
        /* Retrieve the millisecond offset for the current time.
         @param  target  (element) input field to examine
         @return  (number) the time as milliseconds offset or zero if none */
        _getOffsetPlugin: function (target) {
            var inst = $.data(target, this.propertyName);
            var currentTime = (inst ? this._extractTime(inst) : null);
            return (!currentTime ? 0 :
                    (currentTime[0] * 3600 + currentTime[1] * 60 + currentTime[2]) * 1000);
        },
        /* Initialise time entry.
         @param  target  (element) the input field or
         (event) the focus event */
        _doFocus: function (target) {
            var input = (target.nodeName && target.nodeName.toLowerCase() == 'input' ? target : this);
            if (plugin._lastInput == input || plugin._isDisabledPlugin(input)) {
                plugin._focussed = false;
                return;
            }
            var inst = $.data(input, plugin.propertyName);
            plugin._focussed = true;
            plugin._lastInput = input;
            plugin._blurredInput = null;
            $.extend(inst.options, ($.isFunction(inst.options.beforeShow) ?
                    inst.options.beforeShow.apply(input, [input]) : {}));
            plugin._parseTime(inst);
            setTimeout(function () {
                plugin._showField(inst);
            }, 10);
        },
        /* Note that the field has been exited.
         @param  event  (event) the blur event */
        _doBlur: function (event) {
            plugin._blurredInput = plugin._lastInput;
            plugin._lastInput = null;
        },
        /* Select appropriate field portion on click, if already in the field.
         @param  event  (event) the click event */
        _doClick: function (event) {
            var input = event.target;
            var inst = $.data(input, plugin.propertyName);
            if (!plugin._focussed) {
                var fieldSize = inst.options.separator.length + 2;
                inst._field = 0;
                if (input.selectionStart != null) { // Use input select range
                    for (var field = 0; field <= Math.max(1, inst._secondField, inst._ampmField); field++) {
                        var end = (field != inst._ampmField ? (field * fieldSize) + 2 :
                                (inst._ampmField * fieldSize) + inst.options.ampmPrefix.length +
                                inst.options.ampmNames[0].length);
                        inst._field = field;
                        if (input.selectionStart < end) {
                            break;
                        }
                    }
                } else if (input.createTextRange) { // Check against bounding boxes
                    var src = $(event.srcElement);
                    var range = input.createTextRange();
                    var convert = function (value) {
                        return {thin: 2, medium: 4, thick: 6}[value] || value;
                    };
                    var offsetX = event.clientX + document.documentElement.scrollLeft -
                            (src.offset().left + parseInt(convert(src.css('border-left-width')), 10)) -
                            range.offsetLeft; // Position - left edge - alignment
                    for (var field = 0; field <= Math.max(1, inst._secondField, inst._ampmField); field++) {
                        var end = (field != inst._ampmField ? (field * fieldSize) + 2 :
                                (inst._ampmField * fieldSize) + inst.options.ampmPrefix.length +
                                inst.options.ampmNames[0].length);
                        range.collapse();
                        range.moveEnd('character', end);
                        inst._field = field;
                        if (offsetX < range.boundingWidth) { // And compare
                            break;
                        }
                    }
                }
            }
            plugin._showField(inst);
            plugin._focussed = false;
        },
        /* Handle keystrokes in the field.
         @param  event  (event) the keydown event
         @return  (boolean) true to continue, false to stop processing */
        _doKeyDown: function (event) {
            if (event.keyCode >= 48) { // >= '0'
                return true;
            }
            var inst = $.data(event.target, plugin.propertyName);
            switch (event.keyCode) {
                case 9:
                    return (event.shiftKey ?
                            // Move to previous time field, or out if at the beginning
                            plugin._changeField(inst, -1, true) :
                            // Move to next time field, or out if at the end
                            plugin._changeField(inst, +1, true));
                case 35:
                    if (event.ctrlKey) { // Clear time on ctrl+end
                        plugin._setValue(inst, '');
                    } else { // Last field on end
                        inst._field = Math.max(1, inst._secondField, inst._ampmField);
                        plugin._adjustField(inst, 0);
                    }
                    break;
                case 36:
                    if (event.ctrlKey) { // Current time on ctrl+home
                        plugin._setTime(inst);
                    } else { // First field on home
                        inst._field = 0;
                        plugin._adjustField(inst, 0);
                    }
                    break;
                case 37:
                    plugin._changeField(inst, -1, false);
                    break; // Previous field on left
                case 38:
                    plugin._adjustField(inst, +1);
                    break; // Increment time field on up
                case 39:
                    plugin._changeField(inst, +1, false);
                    break; // Next field on right
                case 40:
                    plugin._adjustField(inst, -1);
                    break; // Decrement time field on down
                case 46:
                    plugin._setValue(inst, '');
                    break; // Clear time on delete
                default:
                    return true;
            }
            return false;
        },
        /* Disallow unwanted characters.
         @param  event  (event) the keypress event
         @return  (boolean) true to continue, false to stop processing */
        _doKeyPress: function (event) {
            var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
            if (chr < ' ') {
                return true;
            }
            var inst = $.data(event.target, plugin.propertyName);
            plugin._handleKeyPress(inst, chr);
            return false;
        },
        /* Increment/decrement on mouse wheel activity.
         @param  event  (event) the mouse wheel event
         @param  delta  (number) the amount of change */
        _doMouseWheel: function (event, delta) {
            if (plugin._isDisabledPlugin(event.target)) {
                return;
            }
            var inst = $.data(event.target, plugin.propertyName);
            inst.input.focus();
            if (!inst.input.val()) {
                plugin._parseTime(inst);
            }
            plugin._adjustField(inst, delta);
            event.preventDefault();
        },
        /* Expand the spinner, if possible, to make it easier to use.
         @param  event  (event) the mouse over event */
        _expandSpinner: function (event) {
            var spinner = plugin._getSpinnerTarget(event);
            var inst = $.data(plugin._getInput(spinner), plugin.propertyName);
            if (plugin._isDisabledPlugin(inst.input[0])) {
                return;
            }
            if (inst.options.spinnerBigImage) {
                inst._expanded = true;
                var offset = $(spinner).offset();
                var relative = null;
                $(spinner).parents().each(function () {
                    var parent = $(this);
                    if (parent.css('position') == 'relative' ||
                            parent.css('position') == 'absolute') {
                        relative = parent.offset();
                    }
                    return !relative;
                });
                $('<div class="' + plugin._expandClass + '" style="position: absolute; left: ' +
                        (offset.left - (inst.options.spinnerBigSize[0] - inst.options.spinnerSize[0]) / 2 -
                                (relative ? relative.left : 0)) + 'px; top: ' +
                        (offset.top - (inst.options.spinnerBigSize[1] - inst.options.spinnerSize[1]) / 2 -
                                (relative ? relative.top : 0)) + 'px; width: ' +
                        inst.options.spinnerBigSize[0] + 'px; height: ' +
                        inst.options.spinnerBigSize[1] + 'px; background: transparent url(' +
                        inst.options.spinnerBigImage + ') no-repeat 0px 0px; z-index: 10;"></div>').
                        mousedown(plugin._handleSpinner).mouseup(plugin._endSpinner).
                        mouseout(plugin._endExpand).mousemove(plugin._describeSpinner).
                        insertAfter(spinner);
            }
        },
        /* Locate the actual input field from the spinner.
         @param  spinner  (element) the current spinner
         @return  (element) the corresponding input */
        _getInput: function (spinner) {
            return $(spinner).siblings('.' + plugin.markerClassName)[0];
        },
        /* Change the title based on position within the spinner.
         @param  event  (event) the mouse move event */
        _describeSpinner: function (event) {
            var spinner = plugin._getSpinnerTarget(event);
            var inst = $.data(plugin._getInput(spinner), plugin.propertyName);
            spinner.title = inst.options.spinnerTexts[plugin._getSpinnerRegion(inst, event)];
        },
        /* Handle a click on the spinner.
         @param  event  (event) the mouse click event */
        _handleSpinner: function (event) {
            var spinner = plugin._getSpinnerTarget(event);
            var input = plugin._getInput(spinner);
            if (plugin._isDisabledPlugin(input)) {
                return;
            }
            if (input == plugin._blurredInput) {
                plugin._lastInput = input;
                plugin._blurredInput = null;
            }
            var inst = $.data(input, plugin.propertyName);
            plugin._doFocus(input);
            var region = plugin._getSpinnerRegion(inst, event);
            plugin._changeSpinner(inst, spinner, region);
            plugin._actionSpinner(inst, region);
            plugin._timer = null;
            plugin._handlingSpinner = true;
            if (region >= 3 && inst.options.spinnerRepeat[0]) { // Repeat increment/decrement
                plugin._timer = setTimeout(
                        function () {
                            plugin._repeatSpinner(inst, region);
                        },
                        inst.options.spinnerRepeat[0]);
                $(spinner).one('mouseout', plugin._releaseSpinner).
                        one('mouseup', plugin._releaseSpinner);
            }
        },
        /* Action a click on the spinner.
         @param  inst    (object) the instance settings
         @param  region  (number) the spinner "button" */
        _actionSpinner: function (inst, region) {
            if (!inst.input.val()) {
                plugin._parseTime(inst);
            }
            switch (region) {
                case 0:
                    this._setTime(inst);
                    break;
                case 1:
                    this._changeField(inst, -1, false);
                    break;
                case 2:
                    this._changeField(inst, +1, false);
                    break;
                case 3:
                    this._adjustField(inst, +1);
                    break;
                case 4:
                    this._adjustField(inst, -1);
                    break;
            }
        },
        /* Repeat a click on the spinner.
         @param  inst    (object) the instance settings
         @param  region  (number) the spinner "button" */
        _repeatSpinner: function (inst, region) {
            if (!plugin._timer) {
                return;
            }
            plugin._lastInput = plugin._blurredInput;
            this._actionSpinner(inst, region);
            this._timer = setTimeout(
                    function () {
                        plugin._repeatSpinner(inst, region);
                    },
                    inst.options.spinnerRepeat[1]);
        },
        /* Stop a spinner repeat.
         @param  event  (event) the mouse event */
        _releaseSpinner: function (event) {
            clearTimeout(plugin._timer);
            plugin._timer = null;
        },
        /* Tidy up after an expanded spinner.
         @param  event  (event) the mouse event */
        _endExpand: function (event) {
            plugin._timer = null;
            var spinner = plugin._getSpinnerTarget(event);
            var input = plugin._getInput(spinner);
            var inst = $.data(input, plugin.propertyName);
            $(spinner).remove();
            inst._expanded = false;
        },
        /* Tidy up after a spinner click.
         @param  event  (event) the mouse event */
        _endSpinner: function (event) {
            plugin._timer = null;
            var spinner = plugin._getSpinnerTarget(event);
            var input = plugin._getInput(spinner);
            var inst = $.data(input, plugin.propertyName);
            if (!plugin._isDisabledPlugin(input)) {
                plugin._changeSpinner(inst, spinner, -1);
            }
            if (plugin._handlingSpinner) {
                plugin._lastInput = plugin._blurredInput;
            }
            if (plugin._lastInput && plugin._handlingSpinner) {
                plugin._showField(inst);
            }
            plugin._handlingSpinner = false;
        },
        /* Retrieve the spinner from the event.
         @param  event  (event) the mouse click event
         @return  (element) the target field */
        _getSpinnerTarget: function (event) {
            return event.target || event.srcElement;
        },
        /* Determine which "button" within the spinner was clicked.
         @param  inst   (object) the instance settings
         @param  event  (event) the mouse event
         @return  (number) the spinner "button" number */
        _getSpinnerRegion: function (inst, event) {
            var spinner = this._getSpinnerTarget(event);
            var pos = $(spinner).offset();
            var scrolled = [document.documentElement.scrollLeft || document.body.scrollLeft,
                document.documentElement.scrollTop || document.body.scrollTop];
            var left = (inst.options.spinnerIncDecOnly ? 99 : event.clientX + scrolled[0] - pos.left);
            var top = event.clientY + scrolled[1] - pos.top;
            var spinnerSize = inst.options[inst._expanded ? 'spinnerBigSize' : 'spinnerSize'];
            var right = (inst.options.spinnerIncDecOnly ? 99 : spinnerSize[0] - 1 - left);
            var bottom = spinnerSize[1] - 1 - top;
            if (spinnerSize[2] > 0 && Math.abs(left - right) <= spinnerSize[2] &&
                    Math.abs(top - bottom) <= spinnerSize[2]) {
                return 0; // Centre button
            }
            var min = Math.min(left, top, right, bottom);
            return (min == left ? 1 : (min == right ? 2 : (min == top ? 3 : 4))); // Nearest edge
        },
        /* Change the spinner image depending on button clicked.
         @param  inst     (object) the instance settings
         @param  spinner  (element) the spinner control
         @param  region   (number) the spinner "button" */
        _changeSpinner: function (inst, spinner, region) {
            $(spinner).css('background-position', '-' + ((region + 1) *
                    inst.options[inst._expanded ? 'spinnerBigSize' : 'spinnerSize'][0]) + 'px 0px');
        },
        /* Extract the time value from the input field, or default to now.
         @param  inst  (object) the instance settings */
        _parseTime: function (inst) {
            var currentTime = this._extractTime(inst);
            if (currentTime) {
                inst._selectedHour = currentTime[0];
                inst._selectedMinute = currentTime[1];
                inst._selectedSecond = currentTime[2];
            } else {
                var now = this._constrainTime(inst);
                inst._selectedHour = now[0];
                inst._selectedMinute = now[1];
                inst._selectedSecond = (inst.options.showSeconds ? now[2] : 0);
            }
            inst._secondField = (inst.options.showSeconds ? 2 : -1);
            inst._ampmField = (inst.options.show24Hours ? -1 : (inst.options.showSeconds ? 3 : 2));
            inst._lastChr = '';
            inst._field = Math.max(0, Math.min(
                    Math.max(1, inst._secondField, inst._ampmField), inst.options.initialField));
            if (inst.input.val() != '') {
                this._showTime(inst);
            }
        },
        /* Extract the time value from a string as an array of values, or default to null.
         @param  inst   (object) the instance settings
         @param  value  (string) the time value to parse
         @return  (number[3]) the time components (hours, minutes, seconds)
         or null if no value */
        _extractTime: function (inst, value) {
            value = value || inst.input.val();
            var currentTime = value.split(inst.options.separator);
            if (inst.options.separator == '' && value != '') {
                currentTime[0] = value.substring(0, 2);
                currentTime[1] = value.substring(2, 4);
                currentTime[2] = value.substring(4, 6);
            }
            if (currentTime.length >= 2) {
                var isAM = !inst.options.show24Hours && (value.indexOf(inst.options.ampmNames[0]) > -1);
                var isPM = !inst.options.show24Hours && (value.indexOf(inst.options.ampmNames[1]) > -1);
                var hour = parseInt(currentTime[0], 10);
                hour = (isNaN(hour) ? 0 : hour);
                hour = ((isAM || isPM) && hour == 12 ? 0 : hour) + (isPM ? 12 : 0);
                var minute = parseInt(currentTime[1], 10);
                minute = (isNaN(minute) ? 0 : minute);
                var second = (currentTime.length >= 3 ?
                        parseInt(currentTime[2], 10) : 0);
                second = (isNaN(second) || !inst.options.showSeconds ? 0 : second);
                return this._constrainTime(inst, [hour, minute, second]);
            }
            return null;
        },
        /* Constrain the given/current time to the time steps.
         @param  inst    (object) the instance settings
         @param  fields  (number[3]) the current time components (hours, minutes, seconds)
         @return  (number[3]) the constrained time components (hours, minutes, seconds) */
        _constrainTime: function (inst, fields) {
            var specified = (fields != null);
            if (!specified) {
                var now = this._determineTime(inst.options.defaultTime, inst) || new Date();
                fields = [now.getHours(), now.getMinutes(), now.getSeconds()];
            }
            var reset = false;
            for (var i = 0; i < inst.options.timeSteps.length; i++) {
                if (reset) {
                    fields[i] = 0;
                } else if (inst.options.timeSteps[i] > 1) {
                    fields[i] = Math.round(fields[i] / inst.options.timeSteps[i]) *
                            inst.options.timeSteps[i];
                    reset = true;
                }
            }
            return fields;
        },
        /* Set the selected time into the input field.
         @param  inst  (object) the instance settings */
        _showTime: function (inst) {
            var currentTime = (this._formatNumber(inst.options.show24Hours ? inst._selectedHour :
                    ((inst._selectedHour + 11) % 12) + 1) + inst.options.separator +
                    this._formatNumber(inst._selectedMinute) +
                    (inst.options.showSeconds ? inst.options.separator +
                            this._formatNumber(inst._selectedSecond) : '') +
                    (inst.options.show24Hours ? '' : inst.options.ampmPrefix +
                            inst.options.ampmNames[(inst._selectedHour < 12 ? 0 : 1)]));
            this._setValue(inst, currentTime);
            this._showField(inst);
        },
        /* Highlight the current time field.
         @param  inst  (object) the instance settings */
        _showField: function (inst) {
            var input = inst.input[0];
            if (inst.input.is(':hidden') || plugin._lastInput != input) {
                return;
            }
            var fieldSize = inst.options.separator.length + 2;
            var start = (inst._field != inst._ampmField ? (inst._field * fieldSize) :
                    (inst._ampmField * fieldSize) - inst.options.separator.length +
                    inst.options.ampmPrefix.length);
            var end = start + (inst._field != inst._ampmField ? 2 : inst.options.ampmNames[0].length);
            if (input.setSelectionRange) { // Mozilla
                input.setSelectionRange(start, end);
            } else if (input.createTextRange) { // IE
                var range = input.createTextRange();
                range.moveStart('character', start);
                range.moveEnd('character', end - inst.input.val().length);
                range.select();
            }
            if (!input.disabled) {
                input.focus();
            }
        },
        /* Ensure displayed single number has a leading zero.
         @param  value  (number) current value
         @return  (string) number with at least two digits */
        _formatNumber: function (value) {
            return (value < 10 ? '0' : '') + value;
        },
        /* Update the input field and notify listeners.
         @param  inst   (object) the instance settings
         @param  value  (string) the new value */
        _setValue: function (inst, value) {
            if (value != inst.input.val()) {
                inst.input.val(value).trigger('change');
            }
        },
        /* Move to previous/next field, or out of field altogether if appropriate.
         @param  inst     (object) the instance settings
         @param  offset   (number) the direction of change (-1, +1)
         @param  moveOut  (boolean) true if can move out of the field
         @return  (boolean) true if exitting the field, false if not */
        _changeField: function (inst, offset, moveOut) {
            var atFirstLast = (inst.input.val() == '' || inst._field ==
                    (offset == -1 ? 0 : Math.max(1, inst._secondField, inst._ampmField)));
            if (!atFirstLast) {
                inst._field += offset;
            }
            this._showField(inst);
            inst._lastChr = '';
            return (atFirstLast && moveOut);
        },
        /* Update the current field in the direction indicated.
         @param  inst    (object) the instance settings
         @param  offset  (number) the amount to change by */
        _adjustField: function (inst, offset) {
            if (inst.input.val() == '') {
                offset = 0;
            }
            this._setTime(inst, new Date(0, 0, 0,
                    inst._selectedHour + (inst._field == 0 ? offset * inst.options.timeSteps[0] : 0) +
                    (inst._field == inst._ampmField ? offset * 12 : 0),
                    inst._selectedMinute + (inst._field == 1 ? offset * inst.options.timeSteps[1] : 0),
                    inst._selectedSecond +
                    (inst._field == inst._secondField ? offset * inst.options.timeSteps[2] : 0)));
        },
        /* Check against minimum/maximum and display time.
         @param  inst  (object) the instance settings
         @param  time  (Date) an actual time or
         (number) offset in seconds from now or
         (string) units and periods of offsets from now */
        _setTime: function (inst, time) {
            time = this._determineTime(time, inst);
            var fields = this._constrainTime(inst, time ?
                    [time.getHours(), time.getMinutes(), time.getSeconds()] : null);
            time = new Date(0, 0, 0, fields[0], fields[1], fields[2]);
            // Normalise to base date
            var time = this._normaliseTime(time);
            var minTime = this._normaliseTime(this._determineTime(inst.options.minTime, inst));
            var maxTime = this._normaliseTime(this._determineTime(inst.options.maxTime, inst));
            // Ensure it is within the bounds set
            time = (minTime && time < minTime ? minTime :
                    (maxTime && time > maxTime ? maxTime : time));
            // Perform further restrictions if required
            if ($.isFunction(inst.options.beforeSetTime)) {
                time = inst.options.beforeSetTime.apply(inst.input[0],
                        [this._getTimePlugin(inst.input[0]), time, minTime, maxTime]);
            }
            inst._selectedHour = time.getHours();
            inst._selectedMinute = time.getMinutes();
            inst._selectedSecond = time.getSeconds();
            this._showTime(inst);
        },
        /* A time may be specified as an exact value or a relative one.
         @param  setting  (Date) an actual time or
         (number) offset in seconds from now or
         (string) units and periods of offsets from now
         @param  inst     (object) the instance settings
         @return  (Date) the calculated time */
        _determineTime: function (setting, inst) {
            var offsetNumeric = function (offset) { // E.g. +300, -2
                var time = new Date();
                time.setTime(time.getTime() + offset * 1000);
                return time;
            };
            var offsetString = function (offset) { // E.g. '+2m', '-4h', '+3h +30m' or '12:34:56PM'
                var fields = plugin._extractTime(inst, offset); // Actual time?
                var time = new Date();
                var hour = (fields ? fields[0] : time.getHours());
                var minute = (fields ? fields[1] : time.getMinutes());
                var second = (fields ? fields[2] : time.getSeconds());
                if (!fields) {
                    var pattern = /([+-]?[0-9]+)\s*(s|S|m|M|h|H)?/g;
                    var matches = pattern.exec(offset);
                    while (matches) {
                        switch (matches[2] || 's') {
                            case 's' :
                            case 'S' :
                                second += parseInt(matches[1], 10);
                                break;
                            case 'm' :
                            case 'M' :
                                minute += parseInt(matches[1], 10);
                                break;
                            case 'h' :
                            case 'H' :
                                hour += parseInt(matches[1], 10);
                                break;
                        }
                        matches = pattern.exec(offset);
                    }
                }
                time = new Date(0, 0, 10, hour, minute, second, 0);
                if (/^!/.test(offset)) { // No wrapping
                    if (time.getDate() > 10) {
                        time = new Date(0, 0, 10, 23, 59, 59);
                    } else if (time.getDate() < 10) {
                        time = new Date(0, 0, 10, 0, 0, 0);
                    }
                }
                return time;
            };
            return (setting ? (typeof setting == 'string' ? offsetString(setting) :
                    (typeof setting == 'number' ? offsetNumeric(setting) : setting)) : null);
        },
        /* Normalise time object to a common date.
         @param  time  (Date) the original time
         @return  (Date) the normalised time */
        _normaliseTime: function (time) {
            if (!time) {
                return null;
            }
            time.setFullYear(1900);
            time.setMonth(0);
            time.setDate(0);
            return time;
        },
        /* Update time based on keystroke entered.
         @param  inst  (object) the instance settings
         @param  chr   (ch) the new character */
        _handleKeyPress: function (inst, chr) {
            if (chr == inst.options.separator) {
                this._changeField(inst, +1, false);
            } else if (chr >= '0' && chr <= '9') { // Allow direct entry of time
                var key = parseInt(chr, 10);
                var value = parseInt(inst._lastChr + chr, 10);
                var hour = (inst._field != 0 ? inst._selectedHour :
                        (inst.options.show24Hours ? (value < 24 ? value : key) :
                                (value >= 1 && value <= 12 ? value :
                                        (key > 0 ? key : inst._selectedHour)) % 12 +
                                (inst._selectedHour >= 12 ? 12 : 0)));
                var minute = (inst._field != 1 ? inst._selectedMinute :
                        (value < 60 ? value : key));
                var second = (inst._field != inst._secondField ? inst._selectedSecond :
                        (value < 60 ? value : key));
                var fields = this._constrainTime(inst, [hour, minute, second]);
                this._setTime(inst, new Date(0, 0, 0, fields[0], fields[1], fields[2]));
                if (inst.options.noSeparatorEntry && inst._lastChr) {
                    this._changeField(inst, +1, false);
                } else {
                    inst._lastChr = chr;
                }
            } else if (!inst.options.show24Hours) { // Set am/pm based on first char of names
                chr = chr.toLowerCase();
                if ((chr == inst.options.ampmNames[0].substring(0, 1).toLowerCase() &&
                        inst._selectedHour >= 12) ||
                        (chr == inst.options.ampmNames[1].substring(0, 1).toLowerCase() &&
                                inst._selectedHour < 12)) {
                    var saveField = inst._field;
                    inst._field = inst._ampmField;
                    this._adjustField(inst, +1);
                    inst._field = saveField;
                    this._showField(inst);
                }
            }
        }
    });

// The list of commands that return values and don't permit chaining
    var getters = ['getOffset', 'getTime', 'isDisabled'];

    /* Determine whether a command is a getter and doesn't permit chaining.
     @param  command    (string, optional) the command to run
     @param  otherArgs  ([], optional) any other arguments for the command
     @return  true if the command is a getter, false if not */
    function isNotChained(command, otherArgs) {
        if (command == 'option' && (otherArgs.length == 0 ||
                (otherArgs.length == 1 && typeof otherArgs[0] == 'string'))) {
            return true;
        }
        return $.inArray(command, getters) > -1;
    }

    /* Attach the time entry functionality to a jQuery selection.
     @param  options  (object) the new settings to use for these instances (optional) or
     (string) the command to run (optional)
     @return  (jQuery) for chaining further calls or
     (any) getter value */
    $.fn.timeEntry = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (isNotChained(options, otherArgs)) {
            return plugin['_' + options + 'Plugin'].
                    apply(plugin, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            if (typeof options == 'string') {
                if (!plugin['_' + options + 'Plugin']) {
                    throw 'Unknown command: ' + options;
                }
                plugin['_' + options + 'Plugin'].
                        apply(plugin, [this].concat(otherArgs));
            } else {
                // Check for settings on the control itself
                var inlineSettings = ($.fn.metadata ? $(this).metadata() : {});
                plugin._attachPlugin(this, $.extend({}, inlineSettings, options || {}));
            }
        });
    };

    /* Initialise the time entry functionality. */
    var plugin = $.timeEntry = new TimeEntry(); // Singleton instance

})(jQuery);
/*End Time entry for jQuery v1.5.1. */

/*start nanoScrollerJS - v0.8.5 - 2015 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        return define(['jquery'], function ($) {
            return factory($, window, document);
        });
    } else {
        return factory(jQuery, window, document);
    }
})(function ($, window, document) {
    "use strict";
    var BROWSER_IS_IE7, BROWSER_SCROLLBAR_WIDTH, DOMSCROLL, DOWN, DRAG, ENTER, KEYDOWN, KEYUP, MOUSEDOWN, MOUSEENTER, MOUSEMOVE, MOUSEUP, MOUSEWHEEL, NanoScroll, PANEDOWN, RESIZE, SCROLL, SCROLLBAR, TOUCHMOVE, UP, WHEEL, cAF, defaults, getBrowserScrollbarWidth, hasTransform, isFFWithBuggyScrollbar, rAF, transform, _elementStyle, _prefixStyle, _vendor;
    defaults = {
        /** 
         a classname for the pane element.
         @property paneClass
         @type String
         @default 'nano-pane'
         */
        paneClass: 'nano-pane',
        /**
         a classname for the slider element.
         @property sliderClass
         @type String
         @default 'nano-slider'
         */
        sliderClass: 'nano-slider',
        /**
         a classname for the content element.
         @property contentClass
         @type String
         @default 'nano-content'
         */
        contentClass: 'nano-content',
        /**
         a setting to enable native scrolling in iOS devices.
         @property iOSNativeScrolling
         @type Boolean
         @default false
         */
        iOSNativeScrolling: false,
        /**
         a setting to prevent the rest of the page being
         scrolled when user scrolls the `.content` element.
         @property preventPageScrolling
         @type Boolean
         @default false
         */
        preventPageScrolling: false,
        /**
         a setting to disable binding to the resize event.
         @property disableResize
         @type Boolean
         @default false
         */
        disableResize: false,
        /**
         a setting to make the scrollbar always visible.
         @property alwaysVisible
         @type Boolean
         @default false
         */
        alwaysVisible: false,
        /**
         a default timeout for the `flash()` method.
         @property flashDelay
         @type Number
         @default 1500
         */
        flashDelay: 1500,
        /**
         a minimum height for the `.slider` element.
         @property sliderMinHeight
         @type Number
         @default 20
         */
        sliderMinHeight: 20,
        /**
         a maximum height for the `.slider` element.
         @property sliderMaxHeight
         @type Number
         @default null
         */
        sliderMaxHeight: null,
        /**
         an alternate document context.
         @property documentContext
         @type Document
         @default null
         */
        documentContext: null,
        /**
         an alternate window context.
         @property windowContext
         @type Window
         @default null
         */
        windowContext: null
    };

    /**
     @property SCROLLBAR
     @type String
     @static
     @final
     @private
     */
    SCROLLBAR = 'scrollbar';

    /**
     @property SCROLL
     @type String
     @static
     @final
     @private
     */
    SCROLL = 'scroll';

    /**
     @property MOUSEDOWN
     @type String
     @final
     @private
     */
    MOUSEDOWN = 'mousedown';

    /**
     @property MOUSEENTER
     @type String
     @final
     @private
     */
    MOUSEENTER = 'mouseenter';

    /**
     @property MOUSEMOVE
     @type String
     @static
     @final
     @private
     */
    MOUSEMOVE = 'mousemove';

    /**
     @property MOUSEWHEEL
     @type String
     @final
     @private
     */
    MOUSEWHEEL = 'mousewheel';

    /**
     @property MOUSEUP
     @type String
     @static
     @final
     @private
     */
    MOUSEUP = 'mouseup';

    /**
     @property RESIZE
     @type String
     @final
     @private
     */
    RESIZE = 'resize';

    /**
     @property DRAG
     @type String
     @static
     @final
     @private
     */
    DRAG = 'drag';

    /**
     @property ENTER
     @type String
     @static
     @final
     @private
     */
    ENTER = 'enter';

    /**
     @property UP
     @type String
     @static
     @final
     @private
     */
    UP = 'up';

    /**
     @property PANEDOWN
     @type String
     @static
     @final
     @private
     */
    PANEDOWN = 'panedown';

    /**
     @property DOMSCROLL
     @type String
     @static
     @final
     @private
     */
    DOMSCROLL = 'DOMMouseScroll';

    /**
     @property DOWN
     @type String
     @static
     @final
     @private
     */
    DOWN = 'down';

    /**
     @property WHEEL
     @type String
     @static
     @final
     @private
     */
    WHEEL = 'wheel';

    /**
     @property KEYDOWN
     @type String
     @static
     @final
     @private
     */
    KEYDOWN = 'keydown';

    /**
     @property KEYUP
     @type String
     @static
     @final
     @private
     */
    KEYUP = 'keyup';

    /**
     @property TOUCHMOVE
     @type String
     @static
     @final
     @private
     */
    TOUCHMOVE = 'touchmove';

    /**
     @property BROWSER_IS_IE7
     @type Boolean
     @static
     @final
     @private
     */
    BROWSER_IS_IE7 = window.navigator.appName === 'Microsoft Internet Explorer' && /msie 7./i.test(window.navigator.appVersion) && window.ActiveXObject;

    /**
     @property BROWSER_SCROLLBAR_WIDTH
     @type Number
     @static
     @default null
     @private
     */
    BROWSER_SCROLLBAR_WIDTH = null;
    rAF = window.requestAnimationFrame;
    cAF = window.cancelAnimationFrame;
    _elementStyle = document.createElement('div').style;
    _vendor = (function () {
        var i, transform, vendor, vendors, _i, _len;
        vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
        for (i = _i = 0, _len = vendors.length; _i < _len; i = ++_i) {
            vendor = vendors[i];
            transform = vendors[i] + 'ransform';
            if (transform in _elementStyle) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }
        return false;
    })();
    _prefixStyle = function (style) {
        if (_vendor === false) {
            return false;
        }
        if (_vendor === '') {
            return style;
        }
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    };
    transform = _prefixStyle('transform');
    hasTransform = transform !== false;

    /**
     Returns browser's native scrollbar width
     @method getBrowserScrollbarWidth
     @return {Number} the scrollbar width in pixels
     @static
     @private
     */
    getBrowserScrollbarWidth = function () {
        var outer, outerStyle, scrollbarWidth;
        outer = document.createElement('div');
        outerStyle = outer.style;
        outerStyle.position = 'absolute';
        outerStyle.width = '100px';
        outerStyle.height = '100px';
        outerStyle.overflow = SCROLL;
        outerStyle.top = '-9999px';
        document.body.appendChild(outer);
        scrollbarWidth = outer.offsetWidth - outer.clientWidth;
        document.body.removeChild(outer);
        return scrollbarWidth;
    };
    isFFWithBuggyScrollbar = function () {
        var isOSXFF, ua, version;
        ua = window.navigator.userAgent;
        isOSXFF = /(?=.+Mac OS X)(?=.+Firefox)/.test(ua);
        if (!isOSXFF) {
            return false;
        }
        version = /Firefox\/\d{2}\./.exec(ua);
        if (version) {
            version = version[0].replace(/\D+/g, '');
        }
        return isOSXFF && +version > 23;
    };

    /**
     @class NanoScroll
     @param element {HTMLElement|Node} the main element
     @param options {Object} nanoScroller's options
     @constructor
     */
    NanoScroll = (function () {
        function NanoScroll(el, options) {
            this.el = el;
            this.options = options;
            BROWSER_SCROLLBAR_WIDTH || (BROWSER_SCROLLBAR_WIDTH = getBrowserScrollbarWidth());
            this.$el = $(this.el);
            this.doc = $(this.options.documentContext || document);
            this.win = $(this.options.windowContext || window);
            this.body = this.doc.find('body');
            this.$content = this.$el.children("." + this.options.contentClass);
            this.$content.attr('tabindex', this.options.tabIndex || 0);
            this.content = this.$content[0];
            this.previousPosition = 0;
            if (this.options.iOSNativeScrolling && (this.el.style.WebkitOverflowScrolling != null)) {
                this.nativeScrolling();
            } else {
                this.generate();
            }
            this.createEvents();
            this.addEvents();
            this.reset();
        }


        /**
         Prevents the rest of the page being scrolled
         when user scrolls the `.nano-content` element.
         @method preventScrolling
         @param event {Event}
         @param direction {String} Scroll direction (up or down)
         @private
         */

        NanoScroll.prototype.preventScrolling = function (e, direction) {
            if (!this.isActive) {
                return;
            }
            if (e.type === DOMSCROLL) {
                if (direction === DOWN && e.originalEvent.detail > 0 || direction === UP && e.originalEvent.detail < 0) {
                    e.preventDefault();
                }
            } else if (e.type === MOUSEWHEEL) {
                if (!e.originalEvent || !e.originalEvent.wheelDelta) {
                    return;
                }
                if (direction === DOWN && e.originalEvent.wheelDelta < 0 || direction === UP && e.originalEvent.wheelDelta > 0) {
                    e.preventDefault();
                }
            }
        };


        /**
         Enable iOS native scrolling
         @method nativeScrolling
         @private
         */

        NanoScroll.prototype.nativeScrolling = function () {
            this.$content.css({
                WebkitOverflowScrolling: 'touch'
            });
            this.iOSNativeScrolling = true;
            this.isActive = true;
        };


        /**
         Updates those nanoScroller properties that
         are related to current scrollbar position.
         @method updateScrollValues
         @private
         */

        NanoScroll.prototype.updateScrollValues = function () {
            var content, direction;
            content = this.content;
            this.maxScrollTop = content.scrollHeight - content.clientHeight;
            this.prevScrollTop = this.contentScrollTop || 0;
            this.contentScrollTop = content.scrollTop;
            direction = this.contentScrollTop > this.previousPosition ? "down" : this.contentScrollTop < this.previousPosition ? "up" : "same";
            this.previousPosition = this.contentScrollTop;
            if (direction !== "same") {
                this.$el.trigger('update', {
                    position: this.contentScrollTop,
                    maximum: this.maxScrollTop,
                    direction: direction
                });
            }
            if (!this.iOSNativeScrolling) {
                this.maxSliderTop = this.paneHeight - this.sliderHeight;
                this.sliderTop = this.maxScrollTop === 0 ? 0 : this.contentScrollTop * this.maxSliderTop / this.maxScrollTop;
            }
        };


        /**
         Updates CSS styles for current scroll position.
         Uses CSS 2d transfroms and `window.requestAnimationFrame` if available.
         @method setOnScrollStyles
         @private
         */

        NanoScroll.prototype.setOnScrollStyles = function () {
            var cssValue;
            if (hasTransform) {
                cssValue = {};
                cssValue[transform] = "translate(0, " + this.sliderTop + "px)";
            } else {
                cssValue = {
                    top: this.sliderTop
                };
            }
            if (rAF) {
                if (cAF && this.scrollRAF) {
                    cAF(this.scrollRAF);
                }
                this.scrollRAF = rAF((function (_this) {
                    return function () {
                        _this.scrollRAF = null;
                        return _this.slider.css(cssValue);
                    };
                })(this));
            } else {
                this.slider.css(cssValue);
            }
        };


        /**
         Creates event related methods
         @method createEvents
         @private
         */

        NanoScroll.prototype.createEvents = function () {
            this.events = {
                down: (function (_this) {
                    return function (e) {
                        _this.isBeingDragged = true;
                        _this.offsetY = e.pageY - _this.slider.offset().top;
                        if (!_this.slider.is(e.target)) {
                            _this.offsetY = 0;
                        }
                        _this.pane.addClass('active');
                        _this.doc.bind(MOUSEMOVE, _this.events[DRAG]).bind(MOUSEUP, _this.events[UP]);
                        _this.body.bind(MOUSEENTER, _this.events[ENTER]);
                        return false;
                    };
                })(this),
                drag: (function (_this) {
                    return function (e) {
                        _this.sliderY = e.pageY - _this.$el.offset().top - _this.paneTop - (_this.offsetY || _this.sliderHeight * 0.5);
                        _this.scroll();
                        if (_this.contentScrollTop >= _this.maxScrollTop && _this.prevScrollTop !== _this.maxScrollTop) {
                            _this.$el.trigger('scrollend');
                        } else if (_this.contentScrollTop === 0 && _this.prevScrollTop !== 0) {
                            _this.$el.trigger('scrolltop');
                        }
                        return false;
                    };
                })(this),
                up: (function (_this) {
                    return function (e) {
                        _this.isBeingDragged = false;
                        _this.pane.removeClass('active');
                        _this.doc.unbind(MOUSEMOVE, _this.events[DRAG]).unbind(MOUSEUP, _this.events[UP]);
                        _this.body.unbind(MOUSEENTER, _this.events[ENTER]);
                        return false;
                    };
                })(this),
                resize: (function (_this) {
                    return function (e) {
                        _this.reset();
                    };
                })(this),
                panedown: (function (_this) {
                    return function (e) {
                        _this.sliderY = (e.offsetY || e.originalEvent.layerY) - (_this.sliderHeight * 0.5);
                        _this.scroll();
                        _this.events.down(e);
                        return false;
                    };
                })(this),
                scroll: (function (_this) {
                    return function (e) {
                        _this.updateScrollValues();
                        if (_this.isBeingDragged) {
                            return;
                        }
                        if (!_this.iOSNativeScrolling) {
                            _this.sliderY = _this.sliderTop;
                            _this.setOnScrollStyles();
                        }
                        if (e == null) {
                            return;
                        }
                        if (_this.contentScrollTop >= _this.maxScrollTop) {
                            if (_this.options.preventPageScrolling) {
                                _this.preventScrolling(e, DOWN);
                            }
                            if (_this.prevScrollTop !== _this.maxScrollTop) {
                                _this.$el.trigger('scrollend');
                            }
                        } else if (_this.contentScrollTop === 0) {
                            if (_this.options.preventPageScrolling) {
                                _this.preventScrolling(e, UP);
                            }
                            if (_this.prevScrollTop !== 0) {
                                _this.$el.trigger('scrolltop');
                            }
                        }
                    };
                })(this),
                wheel: (function (_this) {
                    return function (e) {
                        var delta;
                        if (e == null) {
                            return;
                        }
                        delta = e.delta || e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail || (e.originalEvent && -e.originalEvent.detail);
                        if (delta) {
                            _this.sliderY += -delta / 3;
                        }
                        _this.scroll();
                        return false;
                    };
                })(this),
                enter: (function (_this) {
                    return function (e) {
                        var _ref;
                        if (!_this.isBeingDragged) {
                            return;
                        }
                        if ((e.buttons || e.which) !== 1) {
                            return (_ref = _this.events)[UP].apply(_ref, arguments);
                        }
                    };
                })(this)
            };
        };


        /**
         Adds event listeners with jQuery.
         @method addEvents
         @private
         */

        NanoScroll.prototype.addEvents = function () {
            var events;
            this.removeEvents();
            events = this.events;
            if (!this.options.disableResize) {
                this.win.bind(RESIZE, events[RESIZE]);
            }
            if (!this.iOSNativeScrolling) {
                this.slider.bind(MOUSEDOWN, events[DOWN]);
                this.pane.bind(MOUSEDOWN, events[PANEDOWN]).bind("" + MOUSEWHEEL + " " + DOMSCROLL, events[WHEEL]);
            }
            this.$content.bind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
        };


        /**
         Removes event listeners with jQuery.
         @method removeEvents
         @private
         */

        NanoScroll.prototype.removeEvents = function () {
            var events;
            events = this.events;
            this.win.unbind(RESIZE, events[RESIZE]);
            if (!this.iOSNativeScrolling) {
                this.slider.unbind();
                this.pane.unbind();
            }
            this.$content.unbind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
        };


        /**
         Generates nanoScroller's scrollbar and elements for it.
         @method generate
         @chainable
         @private
         */

        NanoScroll.prototype.generate = function () {
            var contentClass, cssRule, currentPadding, options, pane, paneClass, sliderClass;
            options = this.options;
            paneClass = options.paneClass, sliderClass = options.sliderClass, contentClass = options.contentClass;
            if (!(pane = this.$el.children("." + paneClass)).length && !pane.children("." + sliderClass).length) {
                this.$el.append("<div class=\"" + paneClass + "\"><div class=\"" + sliderClass + "\" /></div>");
            }
            this.pane = this.$el.children("." + paneClass);
            this.slider = this.pane.find("." + sliderClass);
            if (BROWSER_SCROLLBAR_WIDTH === 0 && isFFWithBuggyScrollbar()) {
                currentPadding = window.getComputedStyle(this.content, null).getPropertyValue('padding-right').replace(/[^0-9.]+/g, '');
                cssRule = {
                    right: -14,
                    paddingRight: +currentPadding + 14
                };
            } else if (BROWSER_SCROLLBAR_WIDTH) {
                cssRule = {
                    right: -BROWSER_SCROLLBAR_WIDTH
                };
                this.$el.addClass('has-scrollbar');
            }
            if (cssRule != null) {
                this.$content.css(cssRule);
            }
            return this;
        };


        /**
         @method restore
         @private
         */

        NanoScroll.prototype.restore = function () {
            this.stopped = false;
            if (!this.iOSNativeScrolling) {
                this.pane.show();
            }
            this.addEvents();
        };


        /**
         Resets nanoScroller's scrollbar.
         @method reset
         @chainable
         @example
         $(".nano").nanoScroller();
         */

        NanoScroll.prototype.reset = function () {
            var content, contentHeight, contentPosition, contentStyle, contentStyleOverflowY, paneBottom, paneHeight, paneOuterHeight, paneTop, parentMaxHeight, right, sliderHeight;
            if (this.iOSNativeScrolling) {
                this.contentHeight = this.content.scrollHeight;
                return;
            }
            if (!this.$el.find("." + this.options.paneClass).length) {
                this.generate().stop();
            }
            if (this.stopped) {
                this.restore();
            }
            content = this.content;
            contentStyle = content.style;
            contentStyleOverflowY = contentStyle.overflowY;
            if (BROWSER_IS_IE7) {
                this.$content.css({
                    height: this.$content.height()
                });
            }
            contentHeight = content.scrollHeight + BROWSER_SCROLLBAR_WIDTH;
            parentMaxHeight = parseInt(this.$el.css("max-height"), 10);
            if (parentMaxHeight > 0) {
                this.$el.height("");
                this.$el.height(content.scrollHeight > parentMaxHeight ? parentMaxHeight : content.scrollHeight);
            }
            paneHeight = this.pane.outerHeight(false);
            paneTop = parseInt(this.pane.css('top'), 10);
            paneBottom = parseInt(this.pane.css('bottom'), 10);
            paneOuterHeight = paneHeight + paneTop + paneBottom;
            sliderHeight = Math.round(paneOuterHeight / contentHeight * paneOuterHeight);
            if (sliderHeight < this.options.sliderMinHeight) {
                sliderHeight = this.options.sliderMinHeight;
            } else if ((this.options.sliderMaxHeight != null) && sliderHeight > this.options.sliderMaxHeight) {
                sliderHeight = this.options.sliderMaxHeight;
            }
            if (contentStyleOverflowY === SCROLL && contentStyle.overflowX !== SCROLL) {
                sliderHeight += BROWSER_SCROLLBAR_WIDTH;
            }
            this.maxSliderTop = paneOuterHeight - sliderHeight;
            this.contentHeight = contentHeight;
            this.paneHeight = paneHeight;
            this.paneOuterHeight = paneOuterHeight;
            this.sliderHeight = sliderHeight;
            this.paneTop = paneTop;
            this.slider.height(sliderHeight);
            this.events.scroll();
            this.pane.show();
            this.isActive = true;
            if ((content.scrollHeight === content.clientHeight) || (this.pane.outerHeight(true) >= content.scrollHeight && contentStyleOverflowY !== SCROLL)) {
                this.pane.hide();
                this.isActive = false;
            } else if (this.el.clientHeight === content.scrollHeight && contentStyleOverflowY === SCROLL) {
                this.slider.hide();
            } else {
                this.slider.show();
            }
            this.pane.css({
                opacity: (this.options.alwaysVisible ? 1 : ''),
                visibility: (this.options.alwaysVisible ? 'visible' : '')
            });
            contentPosition = this.$content.css('position');
            if (contentPosition === 'static' || contentPosition === 'relative') {
                right = parseInt(this.$content.css('right'), 10);
                if (right) {
                    this.$content.css({
                        right: '',
                        marginRight: right
                    });
                }
            }
            return this;
        };


        /**
         @method scroll
         @private
         @example
         $(".nano").nanoScroller({ scroll: 'top' });
         */

        NanoScroll.prototype.scroll = function () {
            if (!this.isActive) {
                return;
            }
            this.sliderY = Math.max(0, this.sliderY);
            this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
            this.$content.scrollTop(this.maxScrollTop * this.sliderY / this.maxSliderTop);
            if (!this.iOSNativeScrolling) {
                this.updateScrollValues();
                this.setOnScrollStyles();
            }
            return this;
        };


        /**
         Scroll at the bottom with an offset value
         @method scrollBottom
         @param offsetY {Number}
         @chainable
         @example
         $(".nano").nanoScroller({ scrollBottom: value });
         */

        NanoScroll.prototype.scrollBottom = function (offsetY) {
            if (!this.isActive) {
                return;
            }
            this.$content.scrollTop(this.contentHeight - this.$content.height() - offsetY).trigger(MOUSEWHEEL);
            this.stop().restore();
            return this;
        };


        /**
         Scroll at the top with an offset value
         @method scrollTop
         @param offsetY {Number}
         @chainable
         @example
         $(".nano").nanoScroller({ scrollTop: value });
         */

        NanoScroll.prototype.scrollTop = function (offsetY) {
            if (!this.isActive) {
                return;
            }
            this.$content.scrollTop(+offsetY).trigger(MOUSEWHEEL);
            this.stop().restore();
            return this;
        };


        /**
         Scroll to an element
         @method scrollTo
         @param node {Node} A node to scroll to.
         @chainable
         @example
         $(".nano").nanoScroller({ scrollTo: $('#a_node') });
         */

        NanoScroll.prototype.scrollTo = function (node) {
            if (!this.isActive) {
                return;
            }
            this.scrollTop(this.$el.find(node).get(0).offsetTop);
            return this;
        };


        /**
         To stop the operation.
         This option will tell the plugin to disable all event bindings and hide the gadget scrollbar from the UI.
         @method stop
         @chainable
         @example
         $(".nano").nanoScroller({ stop: true });
         */

        NanoScroll.prototype.stop = function () {
            if (cAF && this.scrollRAF) {
                cAF(this.scrollRAF);
                this.scrollRAF = null;
            }
            this.stopped = true;
            this.removeEvents();
            if (!this.iOSNativeScrolling) {
                this.pane.hide();
            }
            return this;
        };


        /**
         Destroys nanoScroller and restores browser's native scrollbar.
         @method destroy
         @chainable
         @example
         $(".nano").nanoScroller({ destroy: true });
         */

        NanoScroll.prototype.destroy = function () {
            if (!this.stopped) {
                this.stop();
            }
            if (!this.iOSNativeScrolling && this.pane.length) {
                this.pane.remove();
            }
            if (BROWSER_IS_IE7) {
                this.$content.height('');
            }
            this.$content.removeAttr('tabindex');
            if (this.$el.hasClass('has-scrollbar')) {
                this.$el.removeClass('has-scrollbar');
                this.$content.css({
                    right: ''
                });
            }
            return this;
        };


        /**
         To flash the scrollbar gadget for an amount of time defined in plugin settings (defaults to 1,5s).
         Useful if you want to show the user (e.g. on pageload) that there is more content waiting for him.
         @method flash
         @chainable
         @example
         $(".nano").nanoScroller({ flash: true });
         */

        NanoScroll.prototype.flash = function () {
            if (this.iOSNativeScrolling) {
                return;
            }
            if (!this.isActive) {
                return;
            }
            this.reset();
            this.pane.addClass('flashed');
            setTimeout((function (_this) {
                return function () {
                    _this.pane.removeClass('flashed');
                };
            })(this), this.options.flashDelay);
            return this;
        };

        return NanoScroll;

    })();
    $.fn.nanoScroller = function (settings) {
        return this.each(function () {
            var options, scrollbar;
            if (!(scrollbar = this.nanoscroller)) {
                options = $.extend({}, defaults, settings);
                this.nanoscroller = scrollbar = new NanoScroll(this, options);
            }
            if (settings && typeof settings === "object") {
                $.extend(scrollbar.options, settings);
                if (settings.scrollBottom != null) {
                    return scrollbar.scrollBottom(settings.scrollBottom);
                }
                if (settings.scrollTop != null) {
                    return scrollbar.scrollTop(settings.scrollTop);
                }
                if (settings.scrollTo) {
                    return scrollbar.scrollTo(settings.scrollTo);
                }
                if (settings.scroll === 'bottom') {
                    return scrollbar.scrollBottom(0);
                }
                if (settings.scroll === 'top') {
                    return scrollbar.scrollTop(0);
                }
                if (settings.scroll && settings.scroll instanceof $) {
                    return scrollbar.scrollTo(settings.scroll);
                }
                if (settings.stop) {
                    return scrollbar.stop();
                }
                if (settings.destroy) {
                    return scrollbar.destroy();
                }
                if (settings.flash) {
                    return scrollbar.flash();
                }
            }
            return scrollbar.reset();
        });
    };
    $.fn.nanoScroller.Constructor = NanoScroll;
});
/*End nanoScrollerJS - v0.8.5 - 2015 */

/*start signIn.js*/
function signInUser()
{

    var flag = true;
    var checkflag = "";
    var temp = true;
    var password = $("#signInForm #password").val();
    $(".login_form").each(function (i, k)
    {

        var data = $(this).val();
        var data = data.replace(/\'/, "\"");
        if (flag == true)
        {

            var fn = "";
            fn = $(this).attr('validate-data').split(";");
            var aa = [];

            for (i = 0; i < fn.length; i++)
            {
                aa.push(fn[i]);
            }

            aa.toString();
            $(aa).each(function (i, v)
            {
                var newStr = v;
                var valdata = data;
                if (valdata == "")
                {
                    var aaa = newStr.replace("this.value", "");
                } else
                {
                    var aaa = newStr.replace("this.value", data);
                }

                checkflag = eval(aaa);
                if (checkflag == false) {
                    temp = false;
                }
            });

            if (temp == false) {
                flag = false;
            } else {
                flag = true;
            }
        }
    });



    if (flag == true)
    {
        if (password == '')
        {
            $(".error_msg_signup").html("Please enter password.");
            return false;
        }
        $.post(domainUrlApi + 'code.php', {'data': $("#signInForm").serialize(), 'action': 'signin', 'sessId': sessId, 'domainName': userDomainName}, responseSignInUser, 'JSON');
    }
}

function responseSignInUser(data, source)
{
    if (parseInt(data.result) == 1)
    {
        $(".error_msg_signup").html(data.msg);
        $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();
    }

    if (parseInt(data.result) == 0)
    {
        $(".error_msg_signup").html('');
        $(".login_form").each(function (index) {
            $(this).val('');
        });

        //  var html = '<a href="#" class="logout-class" >'+data.user['first_name']+' '+data.user['last_name']+'</a><a class="logout-class" style="cursor:pointer" onclick="logoutUser();" >Logout</a><input class="logout-class" type="hidden" id="first_name" name="first_name" value="'+data.user['first_name']+'" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="'+data.user['last_name']+'" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="'+data.user['date_of_birth']+'" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="'+data.user['email_address']+'" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="'+data.user['node_id']+'" />';
        var html = '<input class="logout-class" type="hidden" id="first_name" name="first_name" value="' + data.user['first_name'] + '" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="' + data.user['last_name'] + '" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="' + data.user['date_of_birth'] + '" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="' + data.user['email_address'] + '" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="' + data.user['node_id'] + '" />';

        $(".log-class").hide();

        $(".user-action.dropdown").removeClass('hide');

        if ($('.links-box .logout-class').length == 0)
        {
            $('.user-action.dropdown .login-user-fullname').prepend(data.user['first_name'] + ' ' + data.user['last_name']);
            $('.user-action.dropdown').after(html);
        }
        $(".show-mini").show();

        setUsername = data.user['first_name'] + ' ' + data.user['last_name'];
        setUserID = data.user['node_id'];
        $(".connect_user_id").attr('value', setUserID);
        $(".close-flyout").trigger('click');
        if ($.trim(userComapnyName) == '')
            userComapnyName = 'Investible';

        if ($.trim(data.user['common_name']) == '')
            common_name = 'Guest';
        else
            common_name = data.user['common_name'];

        $(".changed-user-role").html(userComapnyName + ' . ' + common_name);

        if (typeof loginFromPUPlugin == 'function')
        {
            loginFromPUPlugin();
        }

        $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
    }
}

function logoutUser()
{
    //alert('plugin');
    $.post(domainUrlApi + 'code.php', {'action': 'logout', 'sessId': sessId}, responsLogoutUser, 'JSON');
}

function responsLogoutUser(d, s)
{
	 if(w_popout!=undefined){
	 w_popout.close();
	 }
    $(".logout-class").remove();
    $('.user-action.dropdown').addClass('hide');
    $('.user-action.dropdown .login-user-fullname').text('');
    $(".ref_add_new_title_bar").remove();
    $('.ref-min-right-dialogue .save_course_detail').hide();
    $('.ref_add_right_tab').hide();
    $('.imranClose').trigger('click');
    $(".show-mini").hide();
    $(".log-class").show();
    setUsername = '';
    setUserID = '';
    $(".connect_user_id").attr('value', setUserID);

    if ($.trim(userComapnyName) == '')
        userComapnyName = 'Investible';
    $(".changed-user-role").html(userComapnyName + ' . Guest');

    if (typeof loginFromPUPlugin == 'function')
    {
        loginFromPUPlugin();
    }
}

function checkSessionFileResponse(data, s)
{
    //if file not exists
    if (parseInt(data.result) == 1)
    {
        $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();
        logoutUser();
    }
    // if file exists and 
    if (parseInt(data.result) == 0)
    {
        var clearTimeOut = setTimeout(function () {
            $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
        }, 10000);
        if (location.host == "localhost") {
            clearTimeout(clearTimeOut);
        }

    }
    if (parseInt(data.result) == 2)
    {
        $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();
        logoutUser();
    }
}
/*End SignIn.js*/

/*start signUp.js*/
function signUpUser()
{

    var password = $.trim($('#signUpForm [type=password]:first').val());
    var cpassword = $.trim($('#confirm_password').val());
    var email_address = $.trim($('#signUpForm .email_address_signup').val());

    $(".error_msg_signup").html("");
    $("#success_msg_signup").html("");

    var flag = true;
    var checkflag = "";
    var temp = true;

    $(".signup-fields").each(function (i, k)
    {
        //alert("Hii");
        var data = $(this).val();
        var data = data.replace(/\'/, "\"");
        if (flag == true)
        {
            var fn = "";
            fn = $(this).attr('validate-data').split(";");
            var aa = [];

            for (i = 0; i < fn.length; i++)
            {
                aa.push(fn[i]);
            }

            aa.toString();
            $(aa).each(function (i, v)
            {
                var newStr = v;
                var valdata = data;
                if (valdata == "")
                {
                    var aaa = newStr.replace("this.value", "");
                } else
                {
                    var aaa = newStr.replace("this.value", data);
                }

                checkflag = eval(aaa);
                if (checkflag == false) {
                    temp = false;
                }
            });

            if (temp == false) {
                flag = false;
            } else {
                flag = true;
            }
        }
    });
    if (flag == true) {
        var output = emailAddressExist(email_address, password, cpassword);

    }


}



function responseSignUpUser(data, source)
{
    $(".error_msg_signup").html("");
    $("#success_msg_signup").html("");
    if (parseInt(data.result) == 0)
    {
        $("#success_msg_signup").html(data.msg);
    }

    $('.first_name_signup').val('');
    $('.last_name_signup').val('');
    $('.date_of_birth_signup').val('');
    $('.email_address_signup').val('');
    $('[type=password]').val('');

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    $('.common_name_signup').attr('value', userRegisterRole);
    $('.domain_signup').attr('value', userDomainName);
    $('.assigned_on_signup').attr('value', datetime);
}

$('body').on('keydown', '#signInForm #password, #emailaddress', function (event) {
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if ($keycode === 13) {

        signInUser();
        event.preventDefault();
    }

});
/* $('body').on('keydown','#signInForm #emailaddress',function(event){
 var $keycode = (event.keyCode ? event.keyCode : event.which);
 if($keycode===13 ){
 
 signInUser();
 event.preventDefault();
 }
 
 }); */

$('body').on('keydown', '#signUpForm .first_name_signup, .last_name_signup, .email_address_signup, .password_signup, #confirm_password', function (event) {
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if ($keycode === 13) {

        signUpUser();
        event.preventDefault();
    }

});



function emailAddressExist(email_address, password, cpassword)
{

    if ($.trim(email_address) != '')
    {
        $.ajax
                ({
                    url: domainUrlApi + 'code.php',
                    type: 'post',
                    data: {'action': 'checkEmailExist', 'email_address': email_address},
                    success: function (data) {
                        if (data == 1)
                        {
                            $(".error_msg_signup").html("Email address already exist.");
                            //variable_type = 0 ;
                            return false;
                        } else {
                            var result = passwordValidation(password);
                            if (result)
                            {
                                if (password != '')
                                {
                                    if (password != cpassword)
                                    {
                                        $(".error_msg_signup").html("Password and confirm password are not matching.");
                                        return false;
                                    } else {
                                        $.post(domainUrlApi + 'code.php', {'data': $("#signUpForm").serialize(), 'action': 'signup'}, responseSignUpUser, 'JSON');
                                    }
                                }
                            }
                        }
                    }
                });
    }

}
function passwordValidation(password)
{
    /*
     /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i
     */
    if (password == '')
    {
        $(".error_msg_signup").html("Please enter password.");
        return false;
    } else
    {

        if (password.length < 6)
        {
            $(".error_msg_signup").html("Password must be of minimum 6 characters.");
            return false;
        }
        if (password.length >= 6 && password.length > 15)
        {
            $(".error_msg_signup").html("Password must be of maximum 15 characters.");
            return false;

        }
        if (!password.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/))
        {
            //^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/

            $(".error_msg_signup").html("Password must be alphanumeric.");
            return false;
        }
        /* if(password.match(/[0-9]/)){
         $(".error_msg_signup").html("Password must contain at least one letter.");
         return false;
         }
         
         if (password.match(/[a-zA-Z]/))
         {
         $(".error_msg_signup").html("Password must contain at least one digit.");
         return false;
         }  */
        return true;
    }


}


/*End signIp.js*/

/* start autocomplte.js*/
(function (e) {
    "function" === typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
})(function (e) {
    function g(a, b) {
        var c = function () {},
                c = {
                    autoSelectFirst: !1,
                    appendTo: "body",
                    serviceUrl: null,
                    lookup: null,
                    onSelect: null,
                    width: "",
                    minChars: 1,
                    maxHeight: 300,
                    deferRequestBy: 0,
                    params: {},
                    formatResult: g.formatResult,
                    delimiter: null,
                    zIndex: 9999,
                    type: "GET",
                    noCache: !1,
                    onSearchStart: c,
                    onSearchComplete: c,
                    containerClass: "autocomplete-suggestions",
                    tabDisabled: !1,
                    dataType: "text",
                    lookupFilter: function (a, b, c) {
                        return -1 !==
                                a.value.toLowerCase().indexOf(c)
                    },
                    paramName: "query",
                    transformResult: function (a) {
                        return "string" === typeof a ? e.parseJSON(a) : a
                    }
                };
        this.element = a;
        this.el = e(a);
        this.suggestions = [];
        this.badQueries = [];
        this.selectedIndex = -1;
        this.currentValue = this.element.value;
        this.intervalId = 0;
        this.cachedResponse = [];
        this.onChange = this.onChangeInterval = null;
        this.isLocal = this.ignoreValueChange = !1;
        this.suggestionsContainer = null;
        this.options = e.extend({}, c, b);
        this.classes = {
            selected: "autocomplete-selected",
            suggestion: "autocomplete-suggestion"
        };
        this.initialize();
        this.setOptions(b)
    }
    var h = {
        extend: function (a, b) {
            return e.extend(a, b)
        },
        createNode: function (a) {
            var b = document.createElement("div");
            b.innerHTML = a;
            return b.firstChild
        }
    };
    g.utils = h;
    e.Autocomplete = g;
    g.formatResult = function (a, b) {
        var c = "(" + b.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g"), "\\$1") + ")";
        return a.value.replace(RegExp(c, "gi"), "<strong>$1</strong>")
    };
    g.prototype = {
        killerFn: null,
        initialize: function () {
            var a = this,
                    b = "." + a.classes.suggestion,
                    c = a.classes.selected,
                    d = a.options,
                    f;
            a.element.setAttribute("autocomplete", "off");
            a.killerFn = function (b) {
                0 === e(b.target).closest("." + a.options.containerClass).length && (a.killSuggestions(), a.disableKillerFn())
            };
            if (!d.width || "" === d.width)
                d.width = a.el.outerWidth();
            a.suggestionsContainer = g.utils.createNode('<div class="' + d.containerClass + '" style="position: absolute; display: none;"></div>');
            f = e(a.suggestionsContainer);
            f.appendTo(d.appendTo).width(d.width);
            f.on("mouseover.autocomplete", b, function () {
                a.activate(e(this).data("index"))
            });
            f.on("mouseout.autocomplete", function () {
                a.selectedIndex = -1;
                f.children("." + c).removeClass(c)
            });
            f.on("click.autocomplete", b, function () {
                a.select(e(this).data("index"), !1)
            });
            a.fixPosition();
            if (window.opera)
                a.el.on("keypress.autocomplete", function (b) {
                    a.onKeyPress(b)
                });
            else
                a.el.on("keydown.autocomplete", function (b) {
                    a.onKeyPress(b)
                });
            a.el.on("keyup.autocomplete", function (b) {
                a.onKeyUp(b)
            });
            a.el.on("blur.autocomplete", function () {
                a.onBlur()
            });
            a.el.on("focus.autocomplete", function () {
                a.fixPosition()
            })
        },
        onBlur: function () {
            this.enableKillerFn()
        },
        setOptions: function (a) {
            var b = this.options;
            h.extend(b, a);
            if (this.isLocal = e.isArray(b.lookup))
                b.lookup = this.verifySuggestionsFormat(b.lookup);
            e(this.suggestionsContainer).css({
                "max-height": b.maxHeight + "px",
                width: b.width + "px",
                "z-index": b.zIndex
            })
        },
        clearCache: function () {
            this.cachedResponse = [];
            this.badQueries = []
        },
        clear: function () {
            this.clearCache();
            this.currentValue = null;
            this.suggestions = []
        },
        disable: function () {
            this.disabled = !0
        },
        enable: function () {
            this.disabled = !1
        },
        fixPosition: function () {
            var a;
            "body" === this.options.appendTo &&
                    (a = this.el.offset(), e(this.suggestionsContainer).css({
                        top: a.top + this.el.outerHeight() + "px",
                        left: a.left + "px"
                    }))
        },
        enableKillerFn: function () {
            e(document).on("click.autocomplete", this.killerFn)
        },
        disableKillerFn: function () {
            e(document).off("click.autocomplete", this.killerFn)
        },
        killSuggestions: function () {
            var a = this;
            a.stopKillSuggestions();
            a.intervalId = window.setInterval(function () {
                a.hide();
                a.stopKillSuggestions()
            }, 300)
        },
        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId)
        },
        onKeyPress: function (a) {
            if (!this.disabled &&
                    !this.visible && 40 === a.keyCode && this.currentValue)
                this.suggest();
            else if (!this.disabled && this.visible) {
                switch (a.keyCode) {
                    case 27:
                        this.el.val(this.currentValue);
                        this.hide();
                        break;
                    case 9:
                    case 13:
                        if (-1 === this.selectedIndex) {
                            this.hide();
                            return
                        }
                        this.select(this.selectedIndex, 13 === a.keyCode);
                        if (9 === a.keyCode && !1 === this.options.tabDisabled)
                            return;
                        break;
                    case 38:
                        this.moveUp();
                        break;
                    case 40:
                        this.moveDown();
                        break;
                    default:
                        return
                }
                a.stopImmediatePropagation();
                a.preventDefault()
            }
        },
        onKeyUp: function (a) {
            var b = this;
            if (!b.disabled) {
                switch (a.keyCode) {
                    case 38:
                    case 40:
                        return
                }
                clearInterval(b.onChangeInterval);
                if (b.currentValue !== b.el.val())
                    if (0 < b.options.deferRequestBy)
                        b.onChangeInterval = setInterval(function () {
                            b.onValueChange()
                        }, b.options.deferRequestBy);
                    else
                        b.onValueChange()
            }
        },
        onValueChange: function () {
            var a;
            clearInterval(this.onChangeInterval);
            this.currentValue = this.element.value;
            a = this.getQuery(this.currentValue);
            this.selectedIndex = -1;
            this.ignoreValueChange ? this.ignoreValueChange = !1 : a.length < this.options.minChars ?
                    this.hide() : this.getSuggestions(a)
        },
        getQuery: function (a) {
            var b = this.options.delimiter;
            if (!b)
                return e.trim(a);
            a = a.split(b);
            return e.trim(a[a.length - 1])
        },
        getSuggestionsLocal: function (a) {
            var b = a.toLowerCase(),
                    c = this.options.lookupFilter;
            return {
                suggestions: e.grep(this.options.lookup, function (d) {
                    return c(d, a, b)
                })
            }
        },
        getSuggestions: function (a) {
            var b, c = this,
                    d = c.options,
                    f = d.serviceUrl;
            (b = c.isLocal ? c.getSuggestionsLocal(a) : c.cachedResponse[a]) && e.isArray(b.suggestions) ? (c.suggestions = b.suggestions, c.suggest()) :
                    c.isBadQuery(a) || (d.params[d.paramName] = a, !1 !== d.onSearchStart.call(c.element, d.params) && (e.isFunction(d.serviceUrl) && (f = d.serviceUrl.call(c.element, a)), e.ajax({
                url: f,
                data: d.ignoreParams ? null : d.params,
                type: d.type,
                dataType: d.dataType
            }).done(function (b) {
                c.processResponse(b, a);
                d.onSearchComplete.call(c.element, a)
            })))
        },
        isBadQuery: function (a) {
            for (var b = this.badQueries, c = b.length; c--; )
                if (0 === a.indexOf(b[c]))
                    return !0;
            return !1
        },
        hide: function () {
            this.visible = !1;
            this.selectedIndex = -1;
            e(this.suggestionsContainer).hide()
        },
        suggest: function () {
            if (0 === this.suggestions.length)
                this.hide();
            else {
                var a = this.options.formatResult,
                        b = this.getQuery(this.currentValue),
                        c = this.classes.suggestion,
                        d = this.classes.selected,
                        f = e(this.suggestionsContainer),
                        g = "";
                e.each(this.suggestions, function (d, e) {
                    g += '<div class="' + c + '" data-index="' + d + '">' + a(e, b) + "</div>"
                });
                f.html(g).show();
                this.visible = !0;
                this.options.autoSelectFirst && (this.selectedIndex = 0, f.children().first().addClass(d))
            }
        },
        verifySuggestionsFormat: function (a) {
            return a.length && "string" ===
                    typeof a[0] ? e.map(a, function (a) {
                return {
                    value: a,
                    data: null
                }
            }) : a
        },
        processResponse: function (a, b) {
            var c = this.options,
                    d = c.transformResult(a, b);
            d.suggestions = this.verifySuggestionsFormat(d.suggestions);
            c.noCache || (this.cachedResponse[d[c.paramName]] = d, 0 === d.suggestions.length && this.badQueries.push(d[c.paramName]));
            b === this.getQuery(this.currentValue) && (this.suggestions = d.suggestions, this.suggest())
        },
        activate: function (a) {
            var b = this.classes.selected,
                    c = e(this.suggestionsContainer),
                    d = c.children();
            c.children("." +
                    b).removeClass(b);
            this.selectedIndex = a;
            return -1 !== this.selectedIndex && d.length > this.selectedIndex ? (a = d.get(this.selectedIndex), e(a).addClass(b), a) : null
        },
        select: function (a, b) {
            var c = this.suggestions[a];
            c && (this.el.val(c), this.ignoreValueChange = b, this.hide(), this.onSelect(a))
        },
        moveUp: function () {
            -1 !== this.selectedIndex && (0 === this.selectedIndex ? (e(this.suggestionsContainer).children().first().removeClass(this.classes.selected), this.selectedIndex = -1, this.el.val(this.currentValue)) : this.adjustScroll(this.selectedIndex -
                    1))
        },
        moveDown: function () {
            this.selectedIndex !== this.suggestions.length - 1 && this.adjustScroll(this.selectedIndex + 1)
        },
        adjustScroll: function (a) {
            var b = this.activate(a),
                    c, d;
            b && (b = b.offsetTop, c = e(this.suggestionsContainer).scrollTop(), d = c + this.options.maxHeight - 25, b < c ? e(this.suggestionsContainer).scrollTop(b) : b > d && e(this.suggestionsContainer).scrollTop(b - this.options.maxHeight + 25), this.el.val(this.getValue(this.suggestions[a].value)))
        },
        onSelect: function (a) {
            var b = this.options.onSelect;
            a = this.suggestions[a];
            this.el.val(this.getValue(a.value));
            e.isFunction(b) && b.call(this.element, a)
        },
        getValue: function (a) {
            var b = this.options.delimiter,
                    c;
            if (!b)
                return a;
            c = this.currentValue;
            b = c.split(b);
            return 1 === b.length ? a : c.substr(0, c.length - b[b.length - 1].length) + a
        },
        dispose: function () {
            this.el.off(".autocomplete").removeData("autocomplete");
            this.disableKillerFn();
            e(this.suggestionsContainer).remove()
        }
    };
    e.fn.autocomplete = function (a, b) {
        return 0 === arguments.length ? this.first().data("autocomplete") : this.each(function () {
            var c =
                    e(this),
                    d = c.data("autocomplete");
            if ("string" === typeof a) {
                if (d && "function" === typeof d[a])
                    d[a](b)
            } else
                d && d.dispose && d.dispose(), d = new g(this, a), c.data("autocomplete", d)
        })
    }
});
/* End autocomplete.js*/

$(document).ready(function() {
    
    $('body').trigger('custom_full_calendar_ready', {});
});