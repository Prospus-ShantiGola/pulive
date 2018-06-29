
(function ($) {    
    $.fn.visible = function (partial) {
        var $t = $(this),
                $w = $(window),
                viewTop = $w.scrollTop(),
                viewBottom = viewTop + $w.height(),
                _top = $t.offset().top,
                _bottom = _top + $t.height(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;
        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
    
    $.fn.putCursorAtEnd = function() {
        return this.each(function() {
            var $el = $(this),
            el = this;

            // Only focus if input isn't already
            if (!$el.is(":focus")) {
                $el.focus();
            }

            // If this function exists... (IE 9+)
            if (el.setSelectionRange) {
                // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
                var len = $el.val().length * 2;
                // Timeout seems to be required for Blink
                setTimeout(function() {
                el.setSelectionRange(len, len);
                }, 1);
            } else {
                // As a fallback, replace the contents with itself
                // Doesn't work in Chrome, but Chrome supports setSelectionRange
                $el.val($el.val());
            }
            // Scroll to the bottom, in case we're in a tall textarea
            // (Necessary for Firefox and Chrome)
            this.scrollTop = 999999;
        });
    };

})(jQuery);

$(function () {
    'use strict';

    $.widget('ui.flyout', {
        options: {
            mainMenuWrap: '.menu-main-wrap', // left most element which contains all tabs (e.g: 'Dashboard', 'Survey', 'Vessels', etc)
            dashboardElement: '.dashboard', // element where items list and selected item details are shown
            roleSelector: '.',
            headerSection: '.header-wrapper', // element which contains logo, role drop-down, breadcrumbs, etc,
            loaderSelector: '#loader-id',
            dashboardDetailElement: '.ajaxupdate',
            activeItem: null,
            flyoutCollection: [],
            activeItemClass: 'active-tr',
            messages: {
                merge_org: 'The organization details of {{active_item}} will be replaced by {{current_active_item}} details. Please click on yes to confirm the merge.',
                remove_location: 'Are you sure you want to remove the current location?',
                remove_category: 'Are you sure you want to remove the current category?',
                remove_priority: 'Are you sure you want to remove the current priority selection?',
                remove_media: 'Are you sure you want to remove this media item?'
            }
        },
        /**
         * [_create description:: It executes for first time when "flyout" widget is initiated ]
         * @return {[type]} [ none ]
         */
        _create: function () {
            //  		var flyoutElement = this.element, _this = this;

            //          // organization menu handler 
            //  		var organizationMainMenuAnchor = $(this.options.mainMenuWrap).find('a.get-all-organization');
            // organizationMainMenuAnchor.on('click', function() {
            // 	_this.handleOrganization($(this));
            // });
            // organization menu handler ends here

            // "Waiting On Someone Else" menu handler
            // var waitingSomeoneMenu = $(this.options.mainMenuWrap).find('.item-list');
            // waitingSomeoneMenu.find('a.sadm-someone-invitation').on('click', function() {
            //     _this.handleInvitation( $(this) );
            // });

            // "Waiting On Someone Else" menu handler ends here
        },
        handleInvitation: function (element) {
            var _this = this;
            var data = element.data('params');
            data.roleid = _this.getRoleId();
            _this.loadList(element.data('ajaxUrl'), data);
        },
        /**
         * [getRoleId description:: Find selected role id ]
         * @return {[type]} [ returns selected role id ]
         */
        getRoleId: function () {
            var flyoutElement = this.element;
            return flyoutElement.find(this.options.headerSection).find('.changed-user-role').data('roleid');
        },
        /**
         * [handleMainMenu: function to handle click event on left-most menu anchors]
         * @return {[type]} [description]
         */
        handleMainMenu: function (element) {
            console.log($(element).attr('class'));
        },
        /**
         * [handleOrganization:: load and display organization items and selected item detail ]
         * @param  {[type]} element [ element which is clicked to load organization items ]
         * @return {[type]}         [ returns none ]
         */
        handleOrganization: function (element) {

            var _this = this;
            var data = element.data('params');
            data.role_id = _this.getRoleId();
            data.cat = 'all-organization';
            _this.loadList(element, element.data('ajaxUrl'), data);
        },
        /**
         * [makeAjaxCall description:: This function is to be used for all ajax calls]
         * @param  {[type]} url              [ url for ajax call ]
         * @param  {[type]} data             [ data to be sent on server ]
         * @param  {[type]} params           [ to pass some additional parameters ]
         * @param  {[type]} success_callback [ a function that can be passed which will be executed when ajax seccess is called ]
         * @return {[type]}                  [ returns none ]
         */
        makeAjaxCall: function (element, url, data, params, success_callback) {

            var _this = this;
            $.ajax({
                type: params.type || 'post',
                url: url,
                data: data,
                beforeSend: function () {
                    if (element) {
                        _this._trigger('ajax_before_send', null, {data: data, target: element});
                    }
                    if (params.loader_element) {
                        _this.toggleLoader(params.loader_element);
                    }
                },
                success: function (response) {
                    if ($.isFunction(success_callback)) {
                        if (element && false !== _this._trigger('ajax_success', null, {response: response, target: element})) {
                            success_callback(response);
                        } else {
                            success_callback(response);
                        }
                    }
                },
                complete: function () {
                    if (params.loader_element) {
                        _this.toggleLoader(params.loader_element);
                    }
                },
                error: function () {
                    console.log('Error occurred, try again.');
                }
            });
        },
        /**
         * [loadList description:: call ajax and append records in '.dashboard' element]
         * @param  {[type]} url  [ ajax url ]
         * @param  {[type]} data [ data to be sent on server ]
         * @return {[type]}      [ none ]
         */
        loadList: function (element, url, data, callback) {
            var flyoutElement = this.element, _this = this;
            var params = {loader_element: _this.options.loaderSelector};

            var success_callback = function (response) {

                // ajax response will be appended in "elementToUpdate" element                    
                var elementToUpdate = $(flyoutElement).find(_this.options.dashboardElement);

                if (!$.isEmptyObject(callback)) {
                    callback.before(elementToUpdate, response);
                }

                elementToUpdate.html(response);

                setscrollbar();
                emptySpace();

                _this.handleMergeOrganizationCheckbox(elementToUpdate);

                if (_this.options.isMergeMode) {
                    // in case of mergeMode, add ".clone" class on "Ajaxdata-getOrganizationWithPagination" element so that confirmation popup displays when clicked to change "Role", etic
                    elementToUpdate.find('.Ajaxdata-getOrganizationWithPagination').addClass('clone');
                }
                // console.log(elementToUpdate.width());
                var animateElement = elementToUpdate.find('.listing-wrapper');
                var params = {
                    marginLeft: elementToUpdate.width(),
                    position: 'absolute',
                    zIndex: 9
                };
                _this.floatLeft(animateElement, params);
                /**
                 * bind click event on items to load its details using ajax
                 */
                var itemListBody = elementToUpdate.find('.Ajaxdata-getOrganizationWithPagination');
                itemListBody.on('click', function (e) {

                    //When result is appended, find first item in the list and load its details.
                    var target = $(e.target);
                    var node_type = target.prop('nodeName').toLowerCase();
                    var activeItem;
                    if (node_type != 'input') {

                        activeItem = $(e.target).closest('tr');
                        _this.options.activeItem = activeItem;

                        // make clicked item active
                        if (!activeItem.hasClass('blank-row')) {
                            activeItem.closest('table').find('.' + _this.options.activeItemClass)
                                    .removeClass(_this.options.activeItemClass);
                            activeItem.addClass(_this.options.activeItemClass);
                        }

                        var detailData = activeItem.data('params');
                        if (activeItem.data('ajaxUrl') && detailData) { // data-ajax-url and data must be avialble
                            // make "Detail" icon active
                           // _this.toggleDetailIcon('active');  //code commented by priyanka -when merge flyout will be opened then detail icon should be inactive according to venkata
                            detailData.currRoleId = _this.getRoleId();

                            //On item select, make ".merge-organization-id:checked" checkbox unchecked and check current selected item's checkbox
                            activeItem.closest('.Ajaxdata-getOrganizationWithPagination').find('.merge-organization-id:checked').prop('checked', false);
                            setTimeout(function() {
                                activeItem.find('.merge-organization-id').prop('checked', true).trigger('change');    
                            },10);
                            

                            _this.loadItemDetail(activeItem.data('ajaxUrl'), detailData);
                        } else {
                            _this.toggleDetailIcon('inactive');
                        }
                    } else if (target.hasClass('merge-organization-id')) {
                        activeItem = _this.getActiveItem();
                    }
                    e.stopPropagation();
                    // return false; // stop other event listeners
                });

                //When result is appended, find first item in the list and load its details.                
                var firstItem = elementToUpdate.find('.Ajaxdata-getOrganizationWithPagination').find('tr:first');

                _this.options.activeItem = firstItem;

                var detailData = firstItem.data('params');
                if (firstItem.data('ajaxUrl') && detailData) { // data-ajax-url and data must be avialble
                    firstItem.addClass('active-tr');
                    detailData.currRoleId = _this.getRoleId();
                   // _this.toggleDetailIcon('active');  //code commented by priyanka 
                    _this.loadItemDetail(firstItem.data('ajaxUrl'), detailData);
                } else {
                    _this.toggleDetailIcon('inactive');
                }

                if (!$.isEmptyObject(callback)) {
                    callback.after(elementToUpdate, response);
                }
            };
            _this.makeAjaxCall(element, url, data, params, success_callback);
        },
        // when checkbox[name='merge_organization_id'] is checked/unchecked enable/disable marge button
        handleMergeOrganizationCheckbox: function (elementToUpdate) {
            var flyoutElement = this.element, _this = this;
            var mergeOrganizationChk = elementToUpdate.find('.merge-organization-id');
            mergeOrganizationChk.on('change', function () {
                var tr = $(this);
                elementToUpdate.find('.merge-organization-id').not(tr).attr('checked', false);

                setTimeout(function () {

                    var checkedItemLength = elementToUpdate.find('.merge-organization-id:checked').length;
                    var actionWrap = $(flyoutElement).find(_this.options.dashboardElement).find('.user-action-wrap');
                    var useractionBtn = $(flyoutElement).find(_this.options.dashboardElement).find('#user-action-button a:visible');
                    var mergeBtn = actionWrap.find('.merge-organization-detail');
                    var cloneElement = tr.closest('.Ajaxdata-getOrganizationWithPagination');

                    // add "clone" class on response if at least one checkbox is checked
                    if (checkedItemLength) {
                        mergeBtn.removeClass('inactive');
                        // cloneElement.addClass('clone');
                    } else {
                        mergeBtn.addClass('inactive');
                        // cloneElement.removeClass('clone');
                    }
                    if(useractionBtn) {
                        useractionBtn.addClass('inactive');
                    }
                }, 5000);

            });
        },
        updateOrganization: function () {

        },
        /**
         * [loadItemDetail description:: load details of selected item from items list ]
         * @param  {[type]} url  [ ajax url to load data from ]
         * @param  {[type]} data [ data to be sent on server ]
         * @return {[type]}      [ none ]
         */
        loadItemDetail: function (url, data) {
            var flyoutElement = this.element, _this = this;
            var detail_success_callback = function (response) {
                // ajax response will be appended in "elementToUpdate" element                    
                var elementToUpdate = $(flyoutElement).find(_this.options.dashboardDetailElement);
                elementToUpdate.html(response);
                _this.updateHeading();
            };
            var params = {loader_element: $(flyoutElement).find('.loading-right')};
            _this.makeAjaxCall('', url, data, params, detail_success_callback);
        },
        /**
         * [toggleLoader description:: Upon ajax start/complete show/hide loader element ]
         * @param  {[type]} element [ loader element ]
         * @return {[type]}         [ returns none ]
         */
        toggleLoader: function (element, create_if_not_exist, action) {

            //console.log('toggleLoader1');
            var flyoutElement = $(this.element), _this = this, loader = '';
            if (create_if_not_exist) {
                if (flyoutElement.find('#loader_full_width').length) {
                    if(action == 'hide') {
                        flyoutElement.find('#loader_full_width').hide();
                        flyoutElement.find('.ui-white-wrapper-ht').hide();
                    } else {
                        flyoutElement.find('#loader_full_width').toggle();
                        flyoutElement.find('.ui-white-wrapper-ht').toggle();
                    }
                } else {
                    loader = $('<div class="ui-white-wrapper-ht"></div><div id="loader_full_width" class="lodding ui-flyoutv2-loader loader_height_full"></div>');
                    flyoutElement.append(loader);
                }

            } else {
                flyoutElement.find(element).toggle();
                flyoutElement.find('.ui-white-wrapper-ht').toggle();
            }            
            commonScriptObj.setLoaderWrapperLeft();            
        },
        /**
         * [getActiveItem description:: When clicked on any table row (item) to show its details then this row becomes active ]
         * @return {[type]} [ active(selected/clicked) item ]
         */
        getActiveItem: function (latest) {
            var flyoutElement = this.element, _this = this, tempHtml = '';

            if (latest == 'yes') {
                if (_this.options.flyoutCollection.length) {
                    tempHtml = $($.parseHTML(_this.options.flyoutCollection[0]));
                } else {
                    tempHtml = flyoutElement.find(_this.options.dashboardElement);
                }
                return tempHtml.find('.active-tr');

            } else {
                if (!_this.options.activeItem) {
                    _this.options.activeItem = flyoutElement.find(this.options.dashboardElement).find('.listing-wrapper')
                            .find('.active-tr');
                } else if (!_this.options.activeItem.data('id')) { // this "else if" condition should be removed soon
                    _this.options.activeItem = flyoutElement.find(this.options.dashboardElement).find('.listing-wrapper')
                            .find('.active-tr');
                }
                return _this.options.activeItem;
            }
        },
        floatLeft: function (element, params) {
            var flyoutElement = this.element, _this = this;
            element.css({
                marginLeft: params.marginLeft,
                position: params.positionm,
                'z-index': params.zIndex
            });

            element.animate({
                marginLeft: '-=' + params.marginLeft,
            }, 400, function () {
                console.log('Animation complete.');
            });
        },
        /**
         * [handlePagination description:: Update dashboard listing-wrapper element when pagination link is clicked ]
         * @param  {[type]} element [ element which is clicked to load next page (pagination anchors) ]
         * @return {[type]}         [ none ]
         */
        handlePagination: function (element) {

        },
        updateHeading: function () {
            // in case of flyout (2nd level depth), do not update heading or breadcrumb

            // var flyoutElement = this.element, _this = this;
            // var activeItemId = flyoutElement.find(_this.options.dashboardElement).find('.active-tr').data('id');

            // var heading = 'Organization ' + activeItemId + ': Detail';
            // flyoutElement.find('.control-bar').find('.right-side-heading').html(heading);

        },
        // if there is no item to show its details then make 'Detail' icon inactive otherwise make it active
        toggleDetailIcon: function (mode) {
            var _this = this, flyoutElement = this.element;
            var detailIcon = flyoutElement.find('.control-bar .right-end-navigations').find('.detail-icon');

            if (mode == 'inactive') {
                detailIcon.removeClass('active').addClass('inactive');
            } else {
                detailIcon.removeClass('inactive').addClass('active');
            }
        }
    });




    // widget to manage right most "action menus" (e.g.:: save, edit, merge, etc)
    $.widget('ui.action_menu', $.ui.flyout, {
        options: {
            actionMenuWrapper: '.user-action-wrap',
            lazyLoadSelector: '#lazy-load',
            flyoutv2Selector: '#areaSlider11',
            hasUsersListCreated: false,
            pagination_default_params: {
                Page: 1,
                Limit: 10
            },
            finalRecords: []
        },
        _create: function () {
            var actionMenu = this.element, _this = this;
            var source_element = '';
            actionMenu.on('click', this.options.actionMenuWrapper, function (evt) {
                if (evt.target) {
                    var node_type = '', clicked_element = '', funName = '';

                    clicked_element = $(evt.target);
                    node_type = clicked_element.prop('nodeName').toLowerCase();

                    // for now, merge organization link click is handled from here

                    if((node_type == 'i' || node_type == 'span')) {
                        if(clicked_element.parent().hasClass('merge-organization-detail')) {
                            // _this.handleOrgMerge( clicked_element.parent() );   
                            source_element = clicked_element.parent();
                            funName = 'handleOrgMerge';
                        }
                    } else if(node_type == 'a') {
                        if(clicked_element.hasClass('merge-organization-detail')) {
                            // _this.handleOrgMerge( clicked_element );    
                            source_element = clicked_element;
                            funName = 'handleOrgMerge';
                        }
                    }

                    // call appropriate function
                    
                    if($.isFunction(_this[funName])) {
                        _this[funName].apply(_this, [source_element]);                        
                    }
                }
            });
        },
        /**
         * [flyoutV2 description:: Show flyout when this function is called ]
         * @return {[type]} [ ]
         */
        flyoutV2: function (anchor_element, search_term) {
            
            // if button is clicked multiple times then do not execute any code
            if(!anchor_element.attr('data-has-clicked')) {
                
                anchor_element.attr('data-has-clicked', 1);
                
                var actionMenu = this.element, _this = this;

                _this.flyoutV2OpenedByElement = anchor_element;

                _this.toggleLoader('', true);
                
                var flyoutContainer = $.templates("#flyoutV2TmplContainer");

                var defaultSettings = {
                    disableSearch: false
                };
                var finalSettings = $.extend(defaultSettings, anchor_element.data());            

                if(typeof search_term != 'undefined') {
                    finalSettings.search_term = search_term;                
                }
                
                var htmlOutput = flyoutContainer.render(finalSettings);

                actionMenu.append(htmlOutput);

                var flElement = $(_this.options.flyoutv2Selector);
                
                // lazy-load section
                flElement.find('.nano-content').on('scroll', function() {
                    
                    var lazyLoadElement = flElement.find(_this.options.lazyLoadSelector), ajax_params = '';
                    
                    if(lazyLoadElement.length && lazyLoadElement.visible()) {
                        
                        if(_this.flyoutV2OpenedByElement.attr('data-disable-odd-class')) {
                            lazyLoadElement.attr('data-disable-odd-class', _this.flyoutV2OpenedByElement.attr('data-disable-odd-class'));
                        }
                        
                        if(_this.flyoutV2OpenedByElement.attr('data-tmpl-selector')) {
                            lazyLoadElement.attr('data-tmpl-selector', _this.flyoutV2OpenedByElement.attr('data-tmpl-selector'));
                        }
                        
                        if(_this.flyoutV2OpenedByElement.attr('data-module-name')) {
                            lazyLoadElement.attr('data-module-name', _this.flyoutV2OpenedByElement.attr('data-module-name'));
                        }
                        
                        var searchItemsParams = {scrolling: 1};
                        _this.searchItems(flElement, flElement.find('.list-items-js'), lazyLoadElement, searchItemsParams);
                    }
                });

                flElement.css({right: '-350px',}).show();
                
                setTimeout(function() {
                    flElement.show().animate({right: '68px'}, 'slow', function() {

                        var additional_params = ''; 
                        var defaults = {buttons: [],callback: function() {}}; 
                        
                        _this.options.isflyoutv2Open = true;
                        _this.options.isRevertStatePending = true;
                        // if 'data-module-name' is set on the 'anchor_element' 
                        var hasFunction = false;
                        
                        if(anchor_element.data('moduleName')) {
                            var moduleName = anchor_element.data('moduleName');
                            if($.isFunction(window[moduleName].flyoutV2BeforeOpen)) {
                                hasFunction = true;
                                additional_params = window[moduleName].flyoutV2BeforeOpen(defaults, _this);    
                            }
                        }
                        
                        if(!hasFunction) {                            
                            defaults.type = "flyoutv2_before_open";
                            additional_params = $.event.trigger(defaults);
                        }
                        
                        additional_params = $.extend(defaults, additional_params);
                        
                        _this.toggleFlyoutActionButtons('add', flElement, anchor_element, additional_params);
                        $("#full-screen-wrapper").removeClass('hide');
                        
                        var input_element = flElement.find('.list-items-js');
                        input_element.putCursorAtEnd();
                        anchor_element.removeAttr('data-has-clicked');
                    });
                }, 100);              
                
                
            }
        },
        //
        createPaginationParams: function(ajax_params) {
            var actionMenu = this.element, _this = this;          
            var page = parseInt(ajax_params.Page);
            ajax_params.Page = page + 1;            
            ajax_params.is_same = 1;            
            if(_this.options.ajaxData) {
                ajax_params.task = _this.options.ajaxData.task;                
                ajax_params.type = _this.options.ajaxData.type;
            }
            return JSON.stringify(ajax_params);
        },
        /**
         * [toggleFlyoutActionButtons description:: When small flyout is displayed then create new action buttons and hide previous buttons and vice versa ]
         * @param  {[type]} action [ add or remove ]
         * @param {[anchor_element]} [ element upon which data-params and data-ajax-url are attached ] 
         * @return {[type]}        [ none ]
         */
        toggleFlyoutActionButtons: function (action, flElement, anchor_element, additional_params) {

            var actionMenu = this.element, _this = this, buttons, action_menu_wrapper;
            var mode = action || 'add';
            if (mode == 'add') {
                
                action_menu_wrapper = actionMenu.find(_this.options.actionMenuWrapper);

                _this.options.flyout_action_buttons  = action_menu_wrapper.find('a:visible').not('.inactive');
                _this.options.flyout_action_buttons.addClass('hide');
                var flyoutActionButtonsWrapper = $('<span></span>').addClass('flyout-action-buttons-wrapper-js');

                flyoutActionButtonsWrapper.append(additional_params.buttons);
                
                var searchInputEle = flElement.find('.list-items-js');

                var searchButtonInactiveClass = 'inactive';
                if($.trim(searchInputEle.val())) {
                    searchButtonInactiveClass = '';
                }

                // add "Search" button only when searchInputEle is available in the flyout
                if(searchInputEle.length) {
                    var searchBtn = '<a href="javascript:void(0);" class="'+searchButtonInactiveClass+' search-user-js"><i class="icon search"></i><span>Search</span></a>';
                    flyoutActionButtonsWrapper.prepend(searchBtn);
                }
                
                var cancelBtn ='<a href="javascript:void(0);" class="cancel-flyout-js"><i class="icon cancel"></i><span>Cancel</span></a>';
                flyoutActionButtonsWrapper.append(cancelBtn);

                action_menu_wrapper.append(flyoutActionButtonsWrapper);

                // 'search-user-js' button 
                action_menu_wrapper.find('.search-user-js').off('click.search_item').on('click.search_item', function() {
                                        
                    var anchor_element = _this.flyoutV2OpenedByElement;
                    if($.trim(searchInputEle.val())) {
                        _this.searchItems(flElement, searchInputEle, anchor_element);
                    }                                        
                });


                additional_params.callback(_this, action_menu_wrapper);

                action_menu_wrapper.find('.cancel-flyout-js').off().on('click', function() {   
                    _this.removeFlyoutv2();
                });

                var actionMenuWrapper = actionMenu.find(_this.options.actionMenuWrapper);
                var searchElement = actionMenuWrapper.find('.search-user-js');
                var listItemInput = flElement.find('.list-items-js');
                listItemInput.off().on('keyup cut paste', function (event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    var input = $(this);
                    setTimeout(function () {
                        ($.trim(input.val())) ? searchElement.removeClass('inactive') : searchElement.addClass('inactive');
                    }, 0);

                    if (keycode == '13') {                        
                        _this.searchItems(flElement, $(this), anchor_element);
                    }
                }).focus();
                
                
                // create flyout for static content
                if(anchor_element.attr('data-layout-content-source')) {
                    setTimeout(function() {                        
                            var flyoutContent = $(anchor_element.attr('data-layout-content-source')).html();
                            flElement.find('.nano-content').html(flyoutContent);  
                            setColumnsH();                
                    }, 300);
                }
            }
        },

        removeFlyoutv2: function() {

            var actionMenu = this.element, _this = this;
            var action_menu_wrapper = actionMenu.find(_this.options.actionMenuWrapper);
            if(_this.options.flyout_action_buttons) {
                _this.options.flyout_action_buttons.animate({right:"0"}, 700, function(){
                    $(this).removeClass('hide');
                 });   
            }
            //action_menu_wrapper.find('.flyout-action-buttons-wrapper-js').remove();
            action_menu_wrapper.find('.flyout-action-buttons-wrapper-js').animate({right:"0%"}, 700, function(){
                $(this).remove();
            });

            //$(_this.options.flyoutv2Selector).remove();
            
            _this.options.isflyoutv2Open = false;
            _this.options.hasUsersListCreated = false;
            _this.flyoutV2OpenedByElement = false;
            
            
            surveyModule.clearCache();

            setTimeout(function() {
                $( _this.options.flyoutv2Selector ).animate({ "right": "-=350px" }, "slow", function() {
                    $(this).remove();
                    // remove background divs. If it was not removed then it caused some issues
                    $('.ui-white-wrapper-ht').remove();
                    $('#loader_full_width').remove();
                    $("#full-screen-wrapper").addClass('hide');
                });  
            });
        },
        
        searchItems: function(list_container, input_element, anchor_element, search_items_params) {       

            var actionMenu = this.element, _this = this;
            var listTmplSelector = "#flyoutV2Tmpl";
            if(anchor_element.attr('data-tmpl-selector')) {
                listTmplSelector = anchor_element.attr('data-tmpl-selector');
            }
            var listTmpl = $.templates(listTmplSelector);
            
            var recordsContainer = list_container.find('.item-list-height').find('.nano-content');
            
            var loadingElement = '<div class="loading row search-blocks lazy-loading hide" style="text-align:center;">\
                                  <div><div class="main-loader">\
                                  <img src="img/svg-icons/loader-small-logo.svg" id="loader3-img" />\
                                  <div class="loader-circle"></div>\
                                  </div></div></div>';
            var loadingElementObj = list_container.find('.nano-content').find('.loading');
                
            loadingElementObj.remove();
            
            recordsContainer.find(_this.options.lazyLoadSelector).replaceWith(loadingElement);
            
            // scroll to bottom so that loader image displays
            setTimeout(function() {
                if(list_container.find('#loader3-img').length) {
                    list_container.find('.nano').nanoScroller({ scrollTo: list_container.find('#loader3-img') });
                }
            }, 10);
            
            
            var selectUserElement = actionMenu.find(_this.options.actionMenuWrapper).find('.select-item-default');
            // if ajax is sent upon scrolling
            if(search_items_params && search_items_params.scrolling) {
                list_container.find('.lazy-loading').removeClass('hide');
            } else {
                list_container.find('.loading').removeClass('hide');   
                list_container.find('.lazy-loading').remove(); // remove this element if search is fired by enter press 
            }
            
            var searchIndex = 'search';

            var searchButtonSettings = _this.flyoutV2OpenedByElement.data('params');
            if(searchButtonSettings.search_index) {
                searchIndex = searchButtonSettings.search_index;
            }
            if(searchButtonSettings.Limit) {
                _this.options.pagination_default_params.Limit = parseInt(searchButtonSettings.Limit);
            }
            
            var data = {
                survey_id: parseInt(actionMenu.find('.specifice-survey-breadcrumb').data('id')),                
                task: 'getShareUserWithPagination',
                Page: _this.options.pagination_default_params.Page,
                Limit: _this.options.pagination_default_params.Limit + 1,
                role_id: _this.getRoleId()
            };
            data[searchIndex] = input_element.val();            
                        
            var success_callback = function (response) {
                recordsContainer.find('.wait-count-white').remove();
                var htmlOutput = $('<div></div>').addClass('row search-blocks').css('text-align', 'center');
                
                // if ajax is sent upon scrolling
                if(search_items_params && search_items_params.scrolling) {
                    
                } else {
                    list_container.find('.search-blocks').remove();    
                }                
                
                list_container.find('.loading').addClass('hide');

                response = $.parseJSON(response);
                if (response.total > 0) {
                    
                    var finalRecords = response.data.slice(0, _this.options.pagination_default_params.Limit);
                                                
                    htmlOutput = listTmpl.render(finalRecords);
                    recordsContainer.append(htmlOutput);
                    
                    if(anchor_element.data('moduleName')) {
                        var moduleName = anchor_element.data('moduleName');
                        if($.isFunction(window[moduleName].responseAfterAppend)) {
                            window[moduleName].responseAfterAppend(recordsContainer);    
                        }                        
                    }
                    
                    recordsContainer.find('.loading').remove();
                    
                    if(response.total > _this.options.pagination_default_params.Limit) {
                        // if data is received then only append lazy-load anchor element
                        var lazyLoadElement = $('<a></a>').attr({
                            href: 'javascript:void(0)',
                            id: _this.options.lazyLoadSelector.replace('#',''),
                            'data-ajax-url': anchor_element.data('ajaxUrl')
                        }).html('&nbsp;');
                        
                        var ajax_params = _this.createPaginationParams(data);
                        lazyLoadElement.attr('data-params', ajax_params);
                        list_container.find('.item-list-height').find('.nano-content').append(lazyLoadElement);
                    }
                    recordsContainer.on('click.select_item', '.search-blocks', function () {
                        var hasFunction = false;
                        
                        if(anchor_element.data('moduleName')) {
                            var moduleName = anchor_element.data('moduleName');
                            if($.isFunction(window[moduleName].onSelectItem)) {
                                hasFunction = true;
                                window[moduleName].onSelectItem($(this), list_container);    
                            }
                            
                        }
                        if(!hasFunction) {
                            _this.onSelectItem($(this), selectUserElement);    
                        }
                    });                    
                    
                    recordsContainer.off('click.show_child').on('click.show_child', '.js-show-child-parent', function(evt) {
                        
                        if($(this).find('.js-show-child').length) {

                            var target_element = $(evt.target);
                        
                            if(anchor_element.data('moduleName')) {
                                var moduleName = anchor_element.data('moduleName');
                                var args = '';
                                if(target_element.hasClass('js-show-child-parent')) {
                                    args = target_element.data();
                                } else {
                                    args = target_element.closest('.search-blocks').data();
                                }
                                window[moduleName].fetchChild(target_element, args);
                            }
                        }
                        
                    });
                    
                } else {
                    if(!recordsContainer.find('.search-blocks').length) {
                        htmlOutput = htmlOutput.text(response.message);
                        recordsContainer.append(htmlOutput);
                        recordsContainer.find('.row').addClass('default-cursor');    
                    }
                    
                    if(anchor_element.data('moduleName')) {
                        var moduleName = anchor_element.data('moduleName');
                        if($.isFunction(window[moduleName].responseAfterAppend)) {
                            window[moduleName].responseAfterAppend(recordsContainer);    
                        }
                        
                    }
                }
                
                if(!anchor_element.attr('data-disable-odd-class')) { // in some cases no need to add 'odd' class
                    recordsContainer.find('.odd').removeClass('odd');
                    recordsContainer.find('.search-blocks:even').addClass('odd');    
                }
            };

            recordsContainer.off('click.select_item');
            var targetElementParams = $.parseJSON(anchor_element.attr('data-params'));
            if(targetElementParams.Limit) {
                delete targetElementParams.Limit;
            }
            data = $.extend({}, data, targetElementParams);
            var params = {type: 'GET'};
            selectUserElement.addClass('inactive');
            var ajaxUrl = anchor_element.data('ajaxUrl');
            
             if(anchor_element.data('moduleName')) {
                 
                var moduleName = anchor_element.data('moduleName');
                
                if($.isFunction(window[moduleName].beforeSearchItems)) {
                                        
                    var ajax_params = {ajaxUrl: ajaxUrl, data: data, params: params, success_callback: success_callback};                
                    window[moduleName].beforeSearchItems(ajax_params);
                    
                    ajaxUrl = ajax_params.ajaxUrl;
                    data = ajax_params.data;
                    params = ajax_params.params;
                    success_callback = ajax_params.success_callback;    
                } 
                
             } 
                
            _this.makeAjaxCall('', ajaxUrl, data, params, success_callback);

        },
        /**
         * Below function is default function that will be executed if there is no other methods to excute on item select
         */
        onSelectItem: function(clicked_element, selectUserElement) {
            clicked_element.parent().find('.ui-item-active').removeClass('ui-item-active');
            clicked_element.addClass('ui-item-active');
            selectUserElement.removeClass('inactive');
        },
        /**
         * [handleOrgMerge :: when merge organization button is clicked check first which form is open ]
         * @param  {[type]} element [description]
         * @return {[type]}         [description]
         */
        handleOrgMerge: function (element, additional_params) {
            var _this = this, actionMenu = this.element;
            var activeItem = _this.getActiveItem();
            var organizationCheckedCheckbox = actionMenu.find(this.options.dashboardElement).find('.merge-organization-id:checked');

            if (_this.options.isMergeMode) { // if in merge mode, before doing merge show confirmation popup.

                // based on new condition, if below function returns true then show flyoutV2
                if(!_this.options.hasUsersListCreated && typeof OAInvitation != 'undefined' && OAInvitation(this)) {
                    var anchor = $('<a></a>').attr({
                        'data-ajax-url': 'ajaxhandler/organization-ajaxhandler.php',
                        'data-params': '',
                        'data-disable-search': 1
                    });                    
                    _this.flyoutV2(anchor);
                } else {

                    if (element.attr('data-show-confirmation')) {
                        element.removeAttr('data-show-confirmation');
                        _this.revertMode();
                        _this.options.isMergeMode = false;
                        var params = {};
                        if(_this.options.hasUsersListCreated) {
                            //close flyoutv2 
                            _this.removeFlyoutv2();
                            _this.options.hasUsersListCreated = false;    
                            params = additional_params;
                        }
                        
                        updateUserOrganization('update-organization', '', organizationCheckedCheckbox.val(), _this.options.activeItemId, 0, 0, params);
                    } else {
                        element.attr('data-show-confirmation', 1);
                        var confirmationPopup = actionMenu.find('#exit-confirmation-temp');
                        confirmationPopup.find('.modal-btn-wrapper').data('target', element);



                        var message = _this.options.messages.merge_org;
                        var active_item_title = _this.getActiveItem('yes').find('.show-organizatoin-name').text();
                        var current_item_title = actionMenu.find(_this.options.dashboardElement).find('.merge-organization-id:checked');
                        current_item_title = current_item_title.closest('tr').find('.show-organizatoin-name').text();

                        message = message.replace('{{active_item}}', active_item_title)
                                .replace('{{current_active_item}}', current_item_title);

                        confirmationPopup.find('.popup-text-temp').text(message);
                        confirmationPopup.modal({
                            show: true
                        });
                    }
                }
            } else {

                if (organizationCheckedCheckbox.length) {
                    _this.options.isMergeMode = false;
                    _this.revertMode();
                    updateUserOrganization('update-organization', '', organizationCheckedCheckbox.val(), _this.options.activeItemId, 0, 0);
                } else {
                    var data = element.data('params');

                    _this.toggleLeftMenus();
                    _this.options.isMergeMode = true;

                    data.organization_id = _this.getActiveItem('yes').data('id');
                    data.role_id = _this.getRoleId();

                    _this.toggleState();
                    var callback = {
                        before: function (elementToUpdate, response) {

                            _this.appendCountAllHtml(response);

                            var activeItem = $(elementToUpdate).find('.active-tr');
                            _this.options.activeItemId = activeItem.data('id');


                            if (!_this.options.flyoutCollection.length) {
                                _this.options.flyoutCollection.push(elementToUpdate.html());
                            }
                        },
                        after: function (elementToUpdate, response) {

                            var actionMenuWrapper = actionMenu.find(_this.options.actionMenuWrapper);
                            actionMenuWrapper.find('.merge-organization-detail').removeClass('hide').addClass('inactive');
                            actionMenuWrapper.find('.cancel-organization-detail').removeClass('hide')
                                    .off('click').on('click', function () {
                                _this.revertMode();
                            });
                            //make selected item checked
                            elementToUpdate.find('.merge-organization-id').attr('disabled', true);
                            var activeRow = $(elementToUpdate).find('.active-tr');
                            
                            activeRow.find('.merge-organization-id').attr('checked', true).trigger('change');

                            //trigger('change') so that "Merge" button gets enabled

                            // $("#exit-confirmation").find('.cancel-confirm').data('clickclass', actionMenuWrapper.find('.cancel-organization-detail'));
                        }
                    };
                    
                    $.event.trigger({
                        type: "merge_org_flyout_before_open",
                        params: {
                            data: data
                        }
                    });
                    
                    _this.loadList(element, element.data('ajaxUrl'), data, callback);
                }
            }
        },
        /**
         * when revertMode is called then revert page heading (.main-title), search text, etc to its previous state
         */
        toggleState: function (action) {
            var _this = this, actionMenu = this.element;
            var searchElement = actionMenu.find(_this.options.mainMenuWrap).find('.search-highlight:visible');
            if (!action) { // store initial state
                _this.options.searchText = [];
                _this.options.searchText.push(searchElement.val());
                searchElement.val('');
            } else { // revert initial state
                searchElement.val(_this.options.searchText.pop());
            }

        },
        appendCountAllHtml: function (response_html, is_search, search_string) {

            var _this = this, actionMenu = this.element;
            var response = $($.parseHTML(response_html)), searchCount = 0;
            var sectionCountHtml = response.find('#section_count').detach(), searchEle = '';
            var mainMenuWrap = actionMenu.find(_this.options.mainMenuWrap);

            if (!is_search) {
                var heading = '<span class="item-title"><a class="icon org"></a> &nbsp;Organization</span>';
                var count = sectionCountHtml.find('#actives-count').text();

                var countEle = '<li class="active">';
                countEle += '<a href="#" id="organization-all" class="active" data-section="Organizations">';
                countEle += 'All<span id="actives-count" class="badge">' + count + '</span></a></li>';

                var searchCountHtml = response.find('#search-total');
                searchCount = searchCountHtml.text();
                searchEle = '<li class="organization-search-filter submenu active hide organization-search-count" style="" data-search="" id="organization_search_wrapper">';
                searchEle += '<a href="#" class="mid_search" data-usertype="">';
                searchEle += '<span class="icon fillter-icon"></span>"<span id="search-string" class="search-status-string">' + searchCount + '</span>"';
                searchEle += '<span id="search_vessel_count" class="badge">0</span>';
                searchEle += '</a></li>';
                var tmpl = '<li class="selectlist organization_search_section">';
                tmpl += heading;

                tmpl += '<ul class="item-list filter-list-wrap">';
                tmpl += countEle;
                tmpl += searchEle;

                tmpl += '</ul></li>';
                if (actionMenu.find('.organization_search_section').length) {
                    actionMenu.find('.organization_search_section').replaceWith(tmpl);
                } else {
                    mainMenuWrap.find('._active').find('.menu-items').find('.selectlist:last').after(tmpl);
                }
            } else {

                sectionCountHtml = $($.parseHTML(response_html)).find('#actives-count');
                searchCount = sectionCountHtml.text();
                // searchCount = '10';
                var tmplElement = actionMenu.find('.organization_search_section');
                tmplElement.find('#search_vessel_count').text(searchCount);
                tmplElement.find('.organization-search-count').removeClass('hide');
                tmplElement.find('.search-status-string').text(search_string);
            }

            actionMenu.find('#organization-all').off('click').on('click', function () {
                var mergeOrgBtn = actionMenu.find(_this.options.actionMenuWrapper).find('.merge-organization-detail');
                // ".merge-organization-id" checkbox must be unchecked before loaded "Organization" list
                actionMenu.find(_this.options.dashboardElement).find('.merge-organization-id:checked').attr('checked', false);
                _this.options.isMergeMode = false;
                _this.resetForm();
                _this.handleOrgMerge(mergeOrgBtn);
            });


            // console.log(mainMenuWrap.find('._active').find('.menu-items').find('.selectlist:last'));

        },
        // when cancel button is clicked then revert the page to its previous state
        revertMode: function () {
            var _this = this, actionMenu = this.element;

            var elementToUpdate = $(actionMenu).find(_this.options.dashboardElement);
            elementToUpdate.html(_this.options.flyoutCollection.pop());

            //_this.options.disabledMenus.removeClass('inactive');
            _this.options.hiddenMenus.removeClass('hide');
            _this.options.isMergeMode = false;

            activeSideBarLeftIcon('organization');

            //update activeItem on cancel click
            _this.options.activeItem = actionMenu.find(this.options.dashboardElement).find('.listing-wrapper').find('.active-tr');
            if (_this.options.activeItem.length) {
                _this.toggleDetailIcon('active');
            } else {
                _this.toggleDetailIcon('inactive');
            }
            _this.updateHeading();
            actionMenu.find('.organization_search_section').remove();
            _this.resetForm();
            _this.toggleState('revert');
            
            $.event.trigger({type: "merge_org_flyout_after_close"});
                    
        },
        // when revertMode is called, reset few fields
        resetForm: function () {
            //make search field emtpy and hide '#organization-search-string-li'
            var _this = this, actionMenu = this.element;
            actionMenu.find('.search-highlight:visible').val('');
        },
        toggleLeftMenus: function () {
            var _this = this, actionMenu = this.element;
            var mainMenuWrap = actionMenu.find(_this.options.mainMenuWrap);
            var activeMenu = mainMenuWrap.find('._active');

            // do not hide first '.selectlist' because it contains search text field.
            _this.options.hiddenMenus = activeMenu.find('.menu-items').find('.selectlist:not(:first)').not('.organization_search_section');
            _this.options.hiddenMenus.addClass('hide');
            inactiveSideBarLeftIcon('organization');
        }
    });

    var body = $("body");
    // apply flyout widget on body    
    // body.flyout();

    // apply action_menu widget on body    
    body.action_menu();    

    // body.on('flyoutajax_before_send', function(event, params) {        
    //     console.log('flyoutajax_before_send');
    // }).on('flyoutajax_success', function(event, params) {        
    //     console.log('flyoutajax_success');
    // });


    // bind event when flyoutv2 is shown     

});