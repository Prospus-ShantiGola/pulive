define(function() {

    "use strict";
    var breadcrumb = {
        wrapper: '.breadcrumb-wrap',
        list_container: '.breadcrumb',
        close_selector: '.breadcrumb-down',
        section_selector: '.page-section-js',
        height: 47,
        item_heading_selector: '.breadcrumb-heading-js',
        cache: {},
        level: [], // breadcrumb level callback array
        currentLevel: 0, //
        section_heading: '',
    };
    return {
        breadcrumb: breadcrumb,
        /**
         * [html description:: Replace existing links and insert the new one ]
         * @param  {[type]} text [ new link to be replaced with existing links ]
         * @return {[type]}      [ null ]
         */
        html: function(text) {
            var breadcrumbElement = this.getBreadcrumbElementObj();
            breadcrumbElement.find('.breadcrumb').html(text);
        },
        /**
         * [append description:: Append new link with existing links]
         * @param  {[type]} text [ new link to be inserted ]
         * @return {[type]}      [ null ]
         */
        append: function(text) {
            var breadcrumbElement = this.getBreadcrumbElementObj();
            breadcrumbElement.find('.breadcrumb').append(text);
        },
        /**
         * [getLink description:: returns breadcrumb link template]
         * @param  {[type]} label    [array of labels ]
         * @param  {[type]} settings [ object of required classes ]
         * @return {[type]}          [ null ]
         */
        getLink: function(label, settings) {
            var default_classes = {
                anchor_class: '',
                list_class: ''
            };
            if (typeof settings != 'undefined') {
                default_classes = $.extend({}, default_classes, settings);
            }
            var labels = label,
                label_txt, result = '';
            for (var i = 0; i < labels.length; i++) {
                label_txt = this.extractText(label[i]);
                result += '<a href="javascript:void(0);" class="' + default_classes.anchor_class + '">' + label_txt + '</a>';
            }
            return '<li class="image-slider active ' + default_classes.list_class + '">' + result + '</li>'
        },
        getSectionHeading: function() {
            return this.extractText($("#content_wraper").find('.tp-actn-bar').find('#id_listing_head.main-title').text());
        },
        animate: function(options) {
            var breadcrumbElement = this.getBreadcrumbElementObj();
            var self = this;
            breadcrumbElement.animate({
                bottom: options.bottom
            }, 'slow', function() {
                self.setHeight();
                resizeHT();
                threePane();
                setTbodyHt();
                paneMidHt();
                gridHT();
            });
        },
        /**
         * [close description:: Hide breadcrumb when called ]
         * @param  {[type]} evt [ event ]
         * @return {[type]}     [ null ]
         */
        close: function(evt, module) {
            evt.stopPropagation();
            var ele = $(this);
            if (!ele.attr('data-closed')) {
                ele.attr('data-closed', 1);
                ele.removeClass('breadcrumb_open');
                module.animate({
                    bottom: "-=38px"
                });
            }
        },
        /**
         * [setHeight description:: When breadcrumb is closed/shown then calculate height ]
         */
        setHeight: function() {
            var breadcrumbElement = this.getBreadcrumbElementObj();
            breadcrumb.height = UtilityModule.visibleHeight(breadcrumbElement);
        },
        /**
         * [show description:: show breadcrumb when called ]
         * @return {[type]} [description]
         */
        show: function(evt, module) {
            evt.stopPropagation();
            var ele = $(this);
            if (ele.attr('data-closed')) {
                ele.removeAttr('data-closed');
                ele.addClass('breadcrumb_open');
                module.animate({
                    bottom: "+=38px"
                });
            }
        },
        /**
         * [getBreadcrumbElementObj description:: get breadcrumb element ]
         * @return {[type]} [description]
         */
        getBreadcrumbElementObj: function() {
            var body = $('body');
            return body.find(breadcrumb.wrapper);
        },
        /**
         * [_init description:: bind events (close, show) when this module is initialized]
         * @return {[type]} [ null ]
         */
        _init: function() {
            var self = this;
            var breadcrumbElement = this.getBreadcrumbElementObj();
            breadcrumbElement.off('click').on('click', function(evt) {
                var breadcrumbDown = $(this).find('.breadcrumb-down');
                self.show.call(breadcrumbDown, evt, self);
            });
            breadcrumbElement.find(breadcrumb.close_selector).off('click').on('click', function(evt) {
                self.close.call(this, evt, self);
            });
            breadcrumbElement.on('mouseenter mouseleave', '.image-slider', function(evt) {
                var element = $(this);
                element.addClass('breadCrumbHoverLi');
                if (evt.type.toLowerCase() == 'mouseleave') {
                    element.removeClass('breadCrumbHoverLi');
                }
            });
            this.handleBreadcrumbClick(breadcrumbElement);
            breadcrumb.level = [];
            breadcrumb.currentLevel = 0;
            this.checkActiveMenu();
        },
        checkActiveMenu: function() {
            var activeMenu = $("#leftMenuBar").find('a.active');
            if (activeMenu.find(".section-id").attr('data-section-id') == inboxMenuName.toLowerCase()) {
                this.updateBreadcrumb();
            }
        },
        handleBreadcrumbClick: function(breadcrumbElement) {
            breadcrumbElement.off('click', 'li').on('click', 'li', function() {
                var li = breadcrumbElement.find('li');
                if (li.length == 1) {
                    // if there are only one li in breadcrumb then do nothing.
                    return true;
                }
                var index = li.index($(this));
                if (typeof breadcrumb.level[index] != 'undefined') {
                    var level = breadcrumb.level[index];
                    level.callback();
                    breadcrumb.level = breadcrumb.level.slice(0, index);
                }
            });
        },
        /**
         * [getBreadcrumbHeight description:: get height of breadcrumb ]
         * @return {[type]} [description]
         */
        getBreadcrumbHeight: function() {
            return breadcrumb.height;
        },
        extractText: function(label) {
            if (typeof label == 'undefined')
                return '';
            var str_parts = label.toString().split(":");
            return str_parts[0];
        },
        singularize: function(word) {
            var words = {
                'deals': 'Deal',
                'operations': 'Operation',
                'roles': 'Role'
            };
            if (word.toLowerCase() in words) {
                return words[word.toLowerCase()];
            }
            return word;
        },
        updateBreadcrumb: function() {
            var container = $("#id_listing_body");
            var activeRow = container.find('.row.active-tr');
            if (container.hasClass('hide')) {
                container = $("#id_listing_operation");
                activeRow = container.find('.active:visible');
            }
            //When "Create Deal" is clicked from inboxMenuName.toLowerCase() page then reset activeRow variable.
            if($("#leftMenuBar").find('.active').find('.section-id').attr('data-section-id') == inboxMenuName.toLowerCase()) {
                activeRow = '';
            }

            var section_heading = breadcrumb.section_heading = this.singularize(this.extractText(this.getSectionHeading()));
            var breadcrumbElement = this.getBreadcrumbElementObj();
            var currentLevel = breadcrumb.currentLevel - 1;
            breadcrumbElement.find('.breadcrumb').find('li:eq("' + currentLevel + '")').remove();
            breadcrumbElement.find('.breadcrumb').find('.active').removeClass('active');

            var list_arr = [section_heading];
            if (activeRow.length) {
                list_arr.push(section_heading + ' | ' + activeRow.find(breadcrumb.item_heading_selector + ':first').text());
                activeRow.closest('.mCSB_container').find('.row').removeClass('border-btn-0');
                activeRow.prev().addClass('border-btn-0');
            }
            var links = this.getLink(list_arr);
            this.append(links);
        },
        getCurrentSectionHeading: function() {
            return breadcrumb.section_heading;
        },
        getSection: function() {
            return this.singularize(this.extractText(this.getSectionHeading()));
        },
        setLevel: function(callback_info) {
            if (breadcrumb.level.length) {
                breadcrumb.level[breadcrumb.level.length - 1] = callback_info;
            } else {
                breadcrumb.level.push(callback_info);
            }
        },
        getLevel: function(index) {
            return breadcrumb.level[index];
        },
        getSectionFullPath: function() {
            return leftNavigationModule.getActiveMenu().toLowerCase() + '->' + this.getSection().toLowerCase();
        }
    };
});
