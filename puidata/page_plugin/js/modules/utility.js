define(function() {

    var cache = {
        form_state: {}
    };
    return {
        visibleHeight: function(element_obj) {
            if (!element_obj.length) {
                return 0;
            }
            var elBottom, elTop, scrollBot, scrollTop, visibleBottom, visibleTop;
            scrollTop = $(window).scrollTop();
            scrollBot = scrollTop + $(window).height();
            elTop = element_obj.offset().top;
            elBottom = elTop + element_obj.outerHeight();
            visibleTop = elTop < scrollTop ? scrollTop : elTop;
            visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
            return visibleBottom - visibleTop
        },
        compose: function(f, g) {
            return function() {
                return f.call(this, g.apply(this, arguments));
            }
        },
        getRemoveButton: function() { // add more functionality starts
            return $('<a href="javascript:void(0);" class="right remove-more"><i class="prs-icon minus"></i></a>').on('click', function() {
                var previousEleOfnestedLayoutEle = $(this).closest('.nested-layout').prev();
                $(this).closest('.nested-layout').remove();
                var clonedElementCount = this.getClonedElements(previousEleOfnestedLayoutEle);
                // if there is no clonedElement then show "add" more button
                if (clonedElementCount == 0) {
                    previousEleOfnestedLayoutEle.find('.right').removeClass('hide');
                }
            });
        },
        getClonedElements: function(previousEleOfnestedLayoutEle) {
            var nestedLayoutContainer = previousEleOfnestedLayoutEle.parent();
            return nestedLayoutContainer.find('.nested-layout-cloned').length;
        },
        replicate: function(clicked_element) {
            var wrapperElement = clicked_element.closest('.nested-layout');
            var hasRemoveElement = false;
            // if remove element already exists the do not append it again
            if (clicked_element.prev().hasClass('remove-more')) { // remove element is added before add element
                hasRemoveElement = true;
            }
            if (!hasRemoveElement) {
                this.getRemoveButton().insertBefore(clicked_element);
            }
            var newTmpl = wrapperElement.clone(true);
            if (!hasRemoveElement) {
                wrapperElement.find('.remove-more').remove();
            }
            newTmpl.addClass('nested-layout-cloned');
            clicked_element.addClass('hide'); // hide 'add-more' element
            newTmpl.find('input[type="text"]').val('');
            newTmpl.insertAfter(wrapperElement);
        }, // add more functionality ends
        _init: function() {
            var self = this;
            $(window).resize(function() {
                self.shortifyPagination();
            });
        },
        /**
         * [shortifyPagination description] If window size is less than 1365px then show only 2 pagination boxes.
         * @return {[type]} [description] none
         */
        shortifyPagination: function() {
            'use strict';
            var windowWidth = $(window).width();
            var paginationElement = $("#id_listing_pagination");
            var tempPaginationElement = $("#temp_pagination");
            var buttons;
            if (windowWidth > 1024) {
                paginationElement.html(tempPaginationElement.html()).find('li').removeClass('hide');
            } else {
                buttons = tempPaginationElement.find('ul.pagination').find('li');
                if (buttons.length > 6) { // at least 7 li elements must be there inside pagination element
                    // skip 'move-prev' and 'move-next' li elements
                    buttons = buttons.filter(function() {
                        var spanElement = $(this).find('span');
                        return (spanElement.hasClass('move-prev') || spanElement.hasClass('move-next')) ? false : true;
                    });
                    var activeLi = buttons.find('.current').closest('li');
                    var indexOfActiveLi = buttons.index(activeLi);

                    if (buttons.length > 2) {
                        buttons.filter(':gt(' + indexOfActiveLi + ')').addClass('hide');
                        buttons.filter(':lt(' + (indexOfActiveLi - 1) + ')').addClass('hide');
                    }
                }
                paginationElement.html(tempPaginationElement.html());
            }
        },
        getValue: function(element) {
            if (element.is(':input')) {
                if (element.is(':checkbox') || element.is(':radio')) {
                    return (element.is(':checked')) ? element.val() : '';
                }
                return element.val();
            }
            return element.text();
        },
        getFormState: function(container_selector, element_selector) {
            var self = this;
            var containerEle = $(container_selector);
            var values = [];
            var elements = containerEle.find(element_selector);
            //if elements length is 0 means there is no input. In this case return false.
            if(!elements.length) {
                return false;
            }
            elements.each(function(index, item) {
                values.push($.trim(self.getValue($(this))));
            });
            return values.join('');
        },
        getNormalizedKey: function(str1, str2) {
            return (str1 + str2).replace(/[\s|"|']+/g, '').toLowerCase();
        },
        setFormState: function(container_selector, element_selector, msg) {
            var message = msg || 'Are you sure you want to cancel?';
            cache.form_state[this.getNormalizedKey(container_selector, element_selector)] = {
                message: message,
                state: this.getFormState(container_selector, element_selector)
            };
        },
        hasFormStateChanged: function(container_selector, element_selector) {
            var key = this.getNormalizedKey(container_selector, element_selector);
            if (key in cache.form_state) {
                var currentFormState = this.getFormState(container_selector, element_selector);
                //In case of no input, simpley return false so that formStateChange is treated as false.
                if(currentFormState === false) {
                    return false;
                }
                if (currentFormState != cache.form_state[this.getNormalizedKey(container_selector, element_selector)]['state'] && $('#add-edit-popup').css('display') !== 'block')
                    return true;
            } else {
                console.warn('There is no saved state for ', container_selector, element_selector);
            }
            return false;
        },
        getFormStateChangedMessage: function(container_selector, element_selector) {
            var key = this.getNormalizedKey(container_selector, element_selector);
            if (key in cache.form_state) {
                return cache.form_state[this.getNormalizedKey(container_selector, element_selector)]['message']
            } else {
                console.warn('There is no confirmation message supplied for ', container_selector, element_selector);
            }
        },
        resetCache: function(container_selector, element_selector) {
            if (container_selector && element_selector) {
                var key = this.getNormalizedKey(container_selector, element_selector);
                delete cache.form_state[key];
            } else {
                cache.form_state = {};
            }
        },
        updateAutoFieldElements: function(container, elements, params) {
            if (elements.length) {
                for (var i = 0; i < elements.length; i++) {
                    container.find("#instance_property_caption" + elements[i]).parent().find('span')[params.m](params.v);
                }
            }
        },
        updateCaptionElement: function(container, elements) {
            for (var key in elements) {
                var element = container.find("#instance_property_caption" + key);
                var methods = elements[key];
                for (var i = 0; i < methods.length; i++) {
                    element[methods[i]['m']](methods[i]['v']);
                }
            }
        },
        /**
         * [compareObjects description: Compare 2 plain objects for similarity ]
         * @param  {ObjectLiteral} obj1: It will be lopped over
         * @param  {ObjectLiteral} obj2: It will be checked from the same key that exists in obj1
         * @return {Number} 0 if similar otherwise 1
         */
        compareObjects: function(obj1, obj2) {
            return 0;
            /* We do not need for comparing data from IDS and Deals So always return zero.*/
            var flagChanges = 0;
            for (key in obj1) {
                if ($.trim(obj1[key]) != $.trim(obj2[key])) {
                    flagChanges = 1;
                    break;
                }
            }
            return flagChanges;
        },
        /**
         * [localStorageRemoveItems description: Remove items from localStorage]
         * @param  {Array} $items: List of keys to be removed from localStorage
         * @return undefined
         */
        localStorageRemoveItems: function(items) {
            for (var i = 0; i < items.length; i++) {
                localStorage.removeItem(items[i]);
            }
        },
        /**
         * [localStorageSetItems description: Set new variables in localStorage]
         * @param  {Array} $items: List of items that needs to be added in localStorage
         * @return undefined
         */
        localStorageSetItems: function(items) {
            var item;
            for (var i = 0; i < items.length; i++) {
                item = items[i];
                for (var key in item) {
                    localStorage.setItem(key, item[key])
                }
            }
        },
        getCache: function() {
            return cache;
        },
        ucwords: function(str) {
            str = str.toLowerCase();
            return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
                function(s) {
                    return s.toUpperCase();
                }
            );
        },
        ellipsify: function(str, length) {
            if(str.length <= length) return str;
            return str.substring(0, length)+'...';
        }
    }; // return ends here
});
