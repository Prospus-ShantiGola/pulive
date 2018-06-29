var leftNavigationModule = (function() {

    var options = {
        slide_to_right_selector: '.slideToRightNav',
        slide_to_left_selector: '.slideToLeftNav',
        slider_wrapper_selector: '.slideNavigationWrap',
        get_offset_left_selector: '.leftMenuWrap',
        pin_it_selector: '.pin-slide',
    };
    var cache = {
        is_pinned: false,
        last_selected_submenu: '',
        collapsedIndex: [],
        show_sidebar_flyout: false, // if true then display filter flyout
        has_action_flyout_expanded: false,
        action_flyout_active_menu: undefined
    };

    function appendFilterSubMenu(dataproperty, clicked_element, is_submenu_open) {
        clicked_element.closest('.sidebar_leftcol').find('li.active').removeClass('active');
        clicked_element.addClass('active');
        var ajax_params = {
            'action': 'open_flyout',
            'dataproperty': dataproperty,
            'login_user_id': login_user_id,
            'list_mapping_id_arr': list_mapping_id_array,
            'roleId': login_role_id
        };
        var activeMenu = all_settings[leftNavigationModule.getActiveMenu()]['settings']['menu'];
        ajax_params.menuListInstanceId = activeMenu.menuListInstanceId;

        $.ajax({
            url: base_plugin_url + 'code.php',
            method: "POST",
            data: ajax_params,
            success: function(result) {
                //var resultData = JSON.parse(result);
                var resultData = result; 
                var menusFilter = resultData.data;
                var filterOptionStructure = $('<div class="filter-option-wrap"><div class="customScroll scroll-wrapper"><ul class="filter-item-list" data-property-id="' + menusFilter.property_id + '" data-class-node-id="' + menusFilter.class_node_id + '"></ul></div></div>');
                if (is_submenu_open === true) {
                    filterOptionStructure.css('margin-left', getMarginleftPx());
                }
                var menufilterlist = '<li class="filter-option-list"><a class="submenu" data-title="">\
                          <span class="item-list-detail" data-property-id="" data-toggle="tooltip" data-placement="bottom" title="">Lorem Ipsum3Lorem Ipsum3Lorem Ipsum3</span>\
                          <span data-count="" class="badge">20</span>\
                       </a></li>';
                var activeMenu = menusFilter.selectedClass;
                if (cache.last_selected_submenu.length) {
                    activeMenu = cache.last_selected_submenu;
                }
                if (menusFilter.list.length) {
                    $.each(menusFilter.list, function(i, v) {
                        var menuListItems = $(menufilterlist);
                        var clickFunc = 'getFilterList(this,"' + v.value + '", ' + menusFilter.property_id + ',"")';
                        menuListItems.find(".item-list-detail").text(v.value).attr("title", v.value);
                        menuListItems.removeClass('active');
                        if ($.trim(v.value.toLowerCase()) == activeMenu.toLowerCase()) {
                            menuListItems.addClass('active');
                        }
                        menuListItems.find(".item-list-detail").parent('a').attr('onclick', clickFunc).attr('data-title', v.value).data('title', v.value);
                        $('.sidebar_wrap .menu-items li.open-option-flyout.active').attr('data-statusid', menusFilter.property_id).data('statusid', menusFilter.property_id);
                        menuListItems.find(".badge").text(v.count);
                        filterOptionStructure.find('.filter-item-list').append(menuListItems);

                        var menuchar = menuListItems.find(".item-list-detail").text(v.value).text().length;
                        if (menuchar >= 24) {
                            menuListItems.find('.item-list-detail[data-toggle="tooltip"]').tooltip('enable');
                        } else {
                            menuListItems.find('.item-list-detail[data-toggle="tooltip"]').tooltip('disable');
                        }
                    });
                } else {
                    var noRecordHtml = '<li class="filter-option-list"><div class="noEntry">No Records Found</div></li>';
                    filterOptionStructure.find('.filter-item-list').html(noRecordHtml);
                }

                $('.menu-wrapper.ref-winHT').css({
                    backgroundColor: 'white'
                });
                var submenuContainer = $(".prs-plugin .slideNavigationWrap").find(".menu-wrapper");
                submenuContainer.parent().find('.filter-option-wrap').remove(); // remove pre-existing submenu list

                var sidebar_leftcol_ele = $("#menu_wraper").find('.sidebar_leftcol:first');
                sidebar_leftcol_ele.css('z-index', 2);
                submenuContainer.after(filterOptionStructure);
                if (!isFilterFlyoutVisible()) { // if filterFlyout is not visible then only update z-index
                    //increase z-index so that short-cut icon wrapper shows properly
                    sidebar_leftcol_ele.css('z-index', 12);
                }
                if (is_submenu_open !== true) {
                    slideLeftFilterFlyout(clicked_element);
                }
                manageScrollBar();
                if(current_list_status!=='' && current_list_status === 'Capped' && $('.filter-option-list').length > 0){
                    $('.filter-option-list').find('span[data-original-title="Capped"]').parents('.filter-option-list').addClass('active');
                }
            }
        });
    }

    function getLeftFlyoutReference() {
        return $("#menu_wraper").find(".sidebar_wrap");
    }

    function showSubmenu(filter_wrap_ref) {
        $(".sidebar_wrap .menu-items li.open-option-flyout").addClass("active");
        getLeftFlyoutReference().find(".filter-option-wrap").animate({
            "marginLeft": "200px"
        }, 500);
        filter_wrap_ref.addClass('open');
    }

    function hideSubmenu(filter_wrap_ref) {
        var submenuEle = getLeftFlyoutReference().find(".filter-option-wrap");
        var hasActiveMenu = submenuEle.find('li.active').length;
        revertActiveMenuSelection(hasActiveMenu);

        submenuEle.animate({
            "marginLeft": "-"+getMarginleftPx()
        }, 500, function() {
            removeOverlay();
            submenuEle.remove();
            //reset z-index
            $("#menu_wraper").find('.sidebar_leftcol:first').css('z-index', 2);
        });
        filter_wrap_ref.removeClass('open');
    }

    function revertActiveMenuSelection(hasActiveMenu) {
        setTimeout(function() {
            // if "add deal"
            if($("#addMenuListDiv").hasClass('active')) {
                return true;
            }
            if(typeof cache.action_flyout_active_menu == 'undefined') {
                return true;
            }
            if(!hasActiveMenu) { // if user has not clicked on any menu in ".filter-option-wrap" then highlight previously selected main menu
                var isShortcutMenu = (cache.action_flyout_active_menu.data('placement') == 'right') ? true : false;
                // remove 'active' class from 'short-cut' and 'main menu' section
                var menuWrapper = $("#menu_wraper");
                menuWrapper.find('.sidebar_leftcol, .sidebar_wrap').find('li.active').removeClass('active');
                var onclick = '', dataProperty = '';
                if(isShortcutMenu) {
                    onclick = cache.action_flyout_active_menu.attr('onclick');
                } else {
                    onclick = cache.action_flyout_active_menu.find('a').attr('onclick');
                }
                if(onclick && onclick.length) {
                    // highlight previously selected menu in short-cut section
                    menuWrapper.find('.sidebar_leftcol').find('li[onclick="'+onclick+'"]').addClass('active');
                    // highlight previously selected menu in main menu section
                    menuWrapper.find('.sidebar_wrap').find('.panel-default').not(':first').find('a[onclick="'+onclick+'"]').parent().addClass('active');
                } else {
                    dataProperty = cache.action_flyout_active_menu.find('a').attr('data-property');
                    // console.log(dataProperty);
                    // highlight previously selected menu in short-cut section
                    menuWrapper.find('.sidebar_leftcol').find('a[data-property="'+dataProperty+'"]').parent().addClass('active');
                    // highlight previously selected menu in main menu section
                    menuWrapper.find('.sidebar_wrap').find('.panel-default').not(':first').find('a[data-property="'+dataProperty+'"]').parent().addClass('active');
                }
            }
            cache.action_flyout_active_menu = undefined;
        });

    }

    function slideLeftFilterFlyout(clicked_element, filter_wrap_ref, action) {
        if (typeof filter_wrap_ref != 'undefined') {
            if (typeof action != 'undefined') {
                hideSubmenu(filter_wrap_ref);
            } else {
                if (filter_wrap_ref.hasClass('open')) {
                    hideSubmenu(filter_wrap_ref);
                    $(".sidebar_wrap .menu-items li.open-option-flyout").addClass("active");
                } else {
                    showSubmenu(filter_wrap_ref);
                }
            }
        } else {
            if ($(clicked_element).length) {
                if (clicked_element.attr('data-placement') == 'right') { // if it is short-cut icon
                    clicked_element.closest('.sidebar_leftcol').find('li.active').removeClass('active');
                } else {
                    $(".sidebar_wrap .menu-items li.active").removeClass('active');
                }
                clicked_element.addClass('active');
            } else {
                $(".sidebar_wrap .menu-items li.open-option-flyout").addClass("active");
            }

            getLeftFlyoutReference().find(".filter-option-wrap").animate({
                "marginLeft": getMarginleftPx()
            }, 500);
        }
    }

    function getMarginleftPx() {
        var marginLeftPx = "350px";
        if(cache.has_action_flyout_expanded) {
            marginLeftPx = "362px";
        }
        if (isFilterFlyoutVisible()) {
            marginLeftPx = "200px";
        }
        return marginLeftPx;
    }

    function slideRight(callback_params) {
        var tempEle = $(options.get_offset_left_selector);
        var getLeftOffset = tempEle.offset().left;

        if (getLeftOffset == 0) {
            getLeftOffset = $('#leftMenuBar').outerWidth();
        }
        cache.has_action_flyout_expanded = true;
        $(options.slider_wrapper_selector).addClass('open').css('left', getLeftOffset);
        $('.menu-bg-overlay').show();
        if (typeof callback_params != 'undefined' && typeof callback_params.callback == 'function') {
            callback_params.callback();
        }
    };

    function slideLeft() {
        var getWrapperWidth = $(options.slider_wrapper_selector).outerWidth();
        $(options.slider_wrapper_selector).removeClass('open').css('left', -getWrapperWidth - 22);
        $('.menu-bg-overlay').hide();

    }

    function init() {
        var leftMenuWrap = $(options.get_offset_left_selector);
        leftMenuWrap.addClass('pointer');

        leftMenuWrap.off('click').on('click', function(evt) {
            var clicked_element = $(evt.target);
            if (clicked_element.hasClass('pointer')) {
                clicked_element.find('.slideToRightNav:first').trigger('click');
            }
        });

        $(options.slide_to_right_selector).off('click').click(function(evt, data) {

            //$('[data-toggle="tooltip"]').tooltip('destroy');
            var callback_params = {};
            if (typeof data != 'undefined') {
                callback_params = data;
            }
            slideRight(callback_params);
            if ($(this).find('.search').length) {
                $('#search-text-box').focus();
            }
        });
        $(options.slide_to_left_selector).off('click').click(function() {
            if (!cache.is_pinned) {
                //$('[data-toggle="tooltip"]').tooltip('destroy');
                slideLeft();
            } else {
                $('.pin-slide').trigger('click');
                setTimeout(function() {
                    $(".menu-bg-overlay").css("display", "none");
                }, 1000);
                slideLeft();
            }
        });

        $('.menu-bg-overlay').off('click').click(function() {
            if (!cache.is_pinned) {
                slideLeft();
            }
        });
        $(options.pin_it_selector).off('click').click(function() {
            var clicked_element = $(this);
            toggleNavigationWrap(clicked_element);
        });
        // $("body").off("click", ".sidebar_wrap .menu-items li.open-option-flyout").on("click", ".sidebar_wrap .menu-items li.open-option-flyout", function(e) {

        $("body").off("click", "#menu_wraper li.open-option-flyout").on("click", "#menu_wraper li.open-option-flyout", function(e) {
            var leftMenuBar = $("#leftMenuBar"), menuWrapper = $("#menu_wraper");
            var overlayWidth = leftMenuBar.outerWidth();
            if(isFilterFlyoutVisible()) {
                overlayWidth += (menuWrapper.find('.sidebar_wrap:first').outerWidth() - menuWrapper.find('.sidebar_actioncol').outerWidth());
            } else {
                overlayWidth += menuWrapper.find('.sidebar_leftcol').outerWidth();
            }
            createOverlay(overlayWidth);

            var dataproperty = $(this).find('a').data('property');
            var isShortcutMenu = ($(this).data('placement') == 'right') ? true : false;
            var filterOptionWrap = getLeftFlyoutReference().find(".filter-option-wrap");

            if(!$(this).hasClass('active') && typeof cache.action_flyout_active_menu == 'undefined') {

                if(isShortcutMenu) {
                    cache.action_flyout_active_menu = $(this).closest('.sidebar_leftcol').find('li.active');
                } else {
                    cache.action_flyout_active_menu = $(this).closest('ul.item-list').find('li.active');
                }
            }
            var clickedMenuTxt = $.trim($(this).find('.item-list-detail').text()).toLowerCase();
            if(isShortcutMenu) {
                clickedMenuTxt = $.trim($(this).attr('data-original-title')).toLowerCase();
            }
            if (cache.selected_main_menu_text != clickedMenuTxt) {
                cache.selected_main_menu_text = clickedMenuTxt;
                highlightMenu(undefined, $(this));

                if (slideSubFilterMenuExists()) {
                    appendFilterSubMenu(dataproperty, $(this), true);
                } else {
                    filterOptionWrap.remove();
                    appendFilterSubMenu(dataproperty, $(this));
                    // getLeftFlyoutReference().find(".filter-option-wrap").addClass('open');
                    // getLeftFlyoutReference().find(".filter-option-wrap").addClass("options-exist");
                }
                return true;
            }
            highlightMenu(undefined, $(this));
            if (slideSubFilterMenuExists()) {
                hideSubmenu(filterOptionWrap);
                revertActiveMenuSelection(filterOptionWrap.find('li.active').length);
            } else {
                filterOptionWrap.remove();
                appendFilterSubMenu(dataproperty, $(this));
                // getLeftFlyoutReference().find(".filter-option-wrap").addClass('open');
            }
            cache.selected_main_menu_text = clickedMenuTxt;
            //getLeftFlyoutReference().find(".filter-option-wrap").addClass("options-exist");
        });

        $("body").off("click", ".filter-item-list li").on("click", ".filter-item-list li", function() {
            if ($('#id_listing_body:visible').length) {
                if (searchModule.checkAddEditForm($(this)) == false) {
                    return false;
                }
            } else {
                status = (status == '') ? 'all' : status;
                var detailWrapper = $("#id_detail_content");
                if (htmlModule.checkFormState(detailWrapper.find('form:visible'))) {
                    var msg = 'Are you sure you want to continue?  Any unsaved data will be lost.';
                    searchModule.showPopup($(this), msg);
                    return false;
                }
            }
            $(this).closest(".filter-item-list").find(".filter-option-list.active").removeClass("active");
            $(this).addClass("active");
            cache.last_selected_submenu = $(this).find(".item-list-detail").text();
        });

        var menuSelector = $('.menu-items').find('.selectlist:last').find('.panel-default:last').find('li');
        cache.in_progress = false;
        $('body').off('click.menu_click', menuSelector).on('click.menu_click', menuSelector, function(evt) {
            var filterOptionWrap = getLeftFlyoutReference().find(".filter-option-wrap");
            // hide flyout functionality should only execute when flyout is displaying.
            if(isFilterFlyoutVisible() || (filterOptionWrap.length && parseInt(filterOptionWrap.css('margin-left')) >= 200)) {

                var target = $(evt.target);
                // somehow below code executes twice. To prevent it, "cache.in_progress" variable is being used.
                if(cache.in_progress) {
                    return true;
                }
                cache.in_progress = true;

                if (!target.closest('div').hasClass('sidebar_actioncol') || !(target.closest('.slideToRightNav').length)) {
                    if (!target.closest('li').hasClass('open-option-flyout')) { // do not hide submenu flyout if element has 'open-option-flyout' class
                        slideLeftFilterFlyout('', filterOptionWrap, 'hide');
                    }
                }
                setTimeout(function() {
                    cache.in_progress = false;
                }, 500);
            }
        });

        $('#addMenuListDiv').on('click', function() {
            // when add button is clicked then remove active class from li
            // cache.action_flyout_active_menu = $(this).closest('.sidebar_leftcol').find('li.active:visible');
            // cache.action_flyout_active_menu.removeClass('active');

            storePreviousListStatus();
            if ($('#id_listing_operation').html().length === 0) {
                $('#li_id_398431 a').trigger('click');
                //$('#li_id_398431').addClass('active');
            } else {
                $('#li_id_1614970 a').trigger('click');
                //$('#li_id_1614970').addClass('active');
            }
            //$('#addMenuListDiv').addClass('active');
        });
        $('#printPackageDiv').on('click', function() {
            storePreviousListStatus();
            $('#li_id_1614980 a').trigger('click');
        });
    };

    function slideSubFilterMenuExists() {
        return getLeftFlyoutReference().find(".filter-option-wrap").length;
    }

    function toggleNavigationWrap(clicked_element) {

        //return true;
        applyJs();
        var slideNavigationWrap = clicked_element.closest('.slideNavigationWrap');
        var menu_wraper = clicked_element.closest('#menu_wraper');
        var sidebar_leftcol = menu_wraper.find('.sidebar_leftcol');
        var universeWrap = $('.universe-wrap');
        var closeBtn = clicked_element.closest('.sidebar_wrap').find('.sidebar_actioncol').find(options.slide_to_left_selector);

        if (clicked_element.attr('data-is-pinned')) {
            $('.menu-bg-overlay').show();
            clicked_element.removeAttr('data-is-pinned');
            clicked_element.find('.prs-icon').removeClass('un-pin');
            clicked_element.find('.prs-icon').siblings('span').text('Pin');

            slideNavigationWrap.removeClass('sidebar-reset');
            menu_wraper.removeClass('menu-width-expend');
            sidebar_leftcol.removeClass('hide');
            cache.is_pinned = false;
            toggleClassOnListingWrapElement();
            setTimeout(function() { // delay it so that filter flyout shows properly
                $('.menu-bg-overlay').show();
            }, 600);
        } else {
            clicked_element.attr('data-is-pinned', '1');
            $('.menu-bg-overlay').hide();
            //closeBtn.addClass('inactive');
            clicked_element.find('.prs-icon').addClass('un-pin');
            clicked_element.find('.prs-icon').siblings('span').text('Unpin');

            slideNavigationWrap.addClass('sidebar-reset');
            menu_wraper.addClass('menu-width-expend');
            sidebar_leftcol.addClass('hide');
            cache.is_pinned = true;
            toggleClassOnListingWrapElement();
            setTimeout(function() { // delay it so that filter flyout shows properly
                $('.menu-bg-overlay').hide();
            }, 600);
        }
    }

    function toggleClassOnListingWrapElement() {
        var className = 'AdjustColWidth';
        var listingWrapElement = $('.flex-item.listing-wrap');
        (cache.is_pinned) ? listingWrapElement.addClass(className): listingWrapElement.removeClass(className);
    }

    function isFilterFlyoutVisible() {
        return (parseInt(getLeftFlyoutReference().css('left')) > 0) ? true : false;
    }

    function getActiveMenu() {
        return $("#leftMenuBar").find('a.active').find('span').attr('data-section-id');
    }

    function pinActionFlyout() {

        var showFlyoutBtn = $('.leftMenuWrap').find('.slideToRightNav:first');

        var activeMenu = getActiveMenu();
        if (activeMenu == inboxMenuName.toLowerCase()) { // if dashboard then do not show filter flyout
            $("#menu_wraper").removeClass('hide');
            return true;
        }

        if (cache.is_pinned) {
            setTimeout(function() {
                collapsePanelGroups(); // if 'item-title' was collapsed then make them collapsed even for new page
                // if action flyout is visibile then click on 'Pin' button to pin the flyout
                var pinElement = $('.sidebar_actioncol').find('.pin-slide');
                if (isFilterFlyoutVisible()) {
                    if (!pinElement.data('isPinned')) { // if not already pinned
                        pinElement.trigger('click');
                    }
                    showActiveFilterPopup(showFlyoutBtn);
                } else {
                    showFlyoutBtn.trigger('click', {
                        callback: function() {
                            pinElement.trigger('click');
                            showActiveFilterPopup(showFlyoutBtn);
                        }
                    });
                }
            }, 10);
        } else if (cache.show_sidebar_flyout) {
            showActiveFilterPopup(showFlyoutBtn);
        }
    }

    function hasFilterApplied() {
        var currentSectionHeading = BreadcrumbModule.getCurrentSectionHeading().toLowerCase();
        if (currentSectionHeading != 'deal') { // for now this functionality works only for 'Deals' section
            return false;
        }

        if (getLeftFlyoutReference().find(".search-sub-filter").length) { // if search is done then
            cache.show_sidebar_flyout = true;
            return true;
        }
        var selectedMenuText = (cache.selected_main_menu_text) ? cache.selected_main_menu_text : 'all';
        if (selectedMenuText != 'all') {
            cache.show_sidebar_flyout = true;
        }
        var headerFilter = $("#id_listing_header").find('.dropdown-menu').find('.active');
        if(headerFilter.length) {
            cache.show_sidebar_flyout = true;
        }
        return cache.show_sidebar_flyout;
    }

    function showActiveFilterPopup(showFlyoutBtn) {
        var currentSectionHeading = BreadcrumbModule.getCurrentSectionHeading().toLowerCase();
        if (currentSectionHeading == 'deal') { // for now this functionality works only for 'Deals' section
            showFlyoutBtn.trigger('click');
            cache.show_sidebar_flyout = false;
            // show confirmation popup only when "All" is not selected
            var selected_text = (typeof cache.selected_main_menu_text == 'undefined') ? '' : cache.selected_main_menu_text;
            if (cache.selected_main_menu_text != 'undefined' && selected_text != '' && selected_text.toLowerCase() != 'all') {
                showActiveFilterSelection();
            }
        }
    }

    function collapsePanelGroups() {
        var panelGroups = $('.menu-wrapper').find('.panel-group');
        for (var i = 0; i < cache.collapsedIndex.length; i++) {
            panelGroups.find('.item-title:eq(' + cache.collapsedIndex[i] + ')').trigger('click');
        }
    }

    function cacheCollapsedIndex(clicked_element) {

        cache.collapsedIndex = [];

        var itemTitles = clicked_element.closest('.panel-group').find('.item-title');
        var collapsedElements = itemTitles.filter('.collapsed');

        if (collapsedElements.length) {
            collapsedElements.each(function() {
                cache.collapsedIndex.push(itemTitles.index($(this)));
            });
        }
    }

    function monitorExpandCollapse() {
        var collapsePanel = $('.panel-collapse');
        collapsePanel.on('shown.bs.collapse hidden.bs.collapse', cacheCollapsedIndex.bind(collapsePanel, collapsePanel));
        // if filter has been applied by user then we need to open action flyout.
        if (cache.show_sidebar_flyout) {
            pinActionFlyout();
        }
    }

    function clearCache() {
        cache.is_pinned = false;
        cache.collapsedIndex = [];
        cache.selected_main_menu_text = '';
        dataSettings = {};
        show_sidebar_flyout = false;
    }

    function highlightMenu(clicked_element, other_element) {

        var menuList = $('.menu-items').find('.selectlist:last').find('.panel-default:last').find('li');
        var container = '';
        if (typeof clicked_element != 'undefined') {
            clicked_element = $(clicked_element);
            container = clicked_element.closest('.filter-option-wrap');
            if (container.length) { // if clicked from submenu section
                menuList = container.find('.filter-item-list').find('li');
            } else {
                menuList = clicked_element.closest('.dashboardJs').find('li');
            }
            if (menuList.length == 0) { // this condition is only for short-cut icons
                clicked_element.closest('ul').find('.shortcut-icon-deal').removeClass('active');
            } else {
                menuList.filter('.active').removeClass('active');
            }
            clicked_element.closest('li').addClass('active');
        } else {
            var selected_menu_text = (cache.selected_main_menu_text) ? cache.selected_main_menu_text : $.trim(menuList.filter('.active').find('a:first').find('span:first').text().toLowerCase());

            menuList.each(function() {
                var li = $(this);
                li.removeClass('active');
                if ($.trim(li.find('.item-list-detail').text()).toLowerCase() == selected_menu_text) {
                    li.addClass('active');
                }
            });
        }
        if (typeof clicked_element == 'undefined') {
            clicked_element = other_element;
        }
        // there are few short-cut menus that do not exist in main-menu section. Handle it appropriately
        if(clicked_element && clicked_element.hasClass('open-option-flyout')) {
            clicked_element = handleNonExistingFilterMenu(clicked_element);
        }
        highlightShortcutMenu(clicked_element);
    }

    function handleNonExistingFilterMenu(clicked_element) {
        var newMenu = clicked_element.clone();
        var dataTitle = newMenu.find('a').attr('data-title');
        newMenu.find('.item-list-detail').text(dataTitle);
        return newMenu;
    }

    function checkSearchFilter() {
        $('#menu_wraper').removeClass('hide');
        $('.slideToRightNav').trigger('click')
        $(searchModule.properties.searchTextbox).val(dataSettings.search_string);
        $(searchModule.properties.searchTextboxJS).trigger('click');
    }

    // to position flyout properly, calculate visible menus width. "#leftMenuBar, .sidebar_leftcol, .sidebar_wrap:visible"
    function getVisibleMenusWidth(action) {
        var leftMenuBar = $('#leftMenuBar');
        var width = leftMenuBar.outerWidth();
        if (isFilterFlyoutVisible()) {
            width += getLeftFlyoutReference().outerWidth();
        } else {
            width += $("#menu_wraper").find('.leftMenuWrap').outerWidth();
        }
        if (action === 'add') {
            createOverlay(width);
        } else {
            removeOverlay();
        }
        return width;
    }

    function toggleClassOnMenuElements(action) {
        var class_name = 'insSidebarZindex';
        var leftMenuBar = $('#leftMenuBar'),
            element1;

        if (isFilterFlyoutVisible()) {
            element1 = getLeftFlyoutReference();
        } else {
            element1 = $("#menu_wraper").find('.leftMenuWrap');
        }
        if (action === 'add') {
            leftMenuBar.addClass(class_name);
            element1.addClass(class_name);
        } else {
            leftMenuBar.removeClass(class_name);
            element1.removeClass(class_name);
        }
        // console.log(element1);
    }

    // when left flyout opens, we need to make left main menus un-clickable so create a overlay on those elements.
    function createOverlay(width) {
        removeOverlay();
        var overlay = $('<div />').css({
            position: 'absolute',
            top: '40px',
            left: '0px',
            height: '100%',
            width: width + 'px',
            zIndex: '100'
        }).attr('id', 'main-menu-overlay');
        $('body').append(overlay);
    }
    function removeOverlay() {
        $('#main-menu-overlay').remove();
    }
    // when left flyout opens then remove active class from active menu and make clicked element active and vice versa when flyout closes
    function toggleActiveSelection(action, clicked_element) {
        var already_active_elements;
        if (action === 'make_clicked_element_active') {
            if (!clicked_element.is('li')) {
                clicked_element = clicked_element.closest('li');
            }
            cache.already_active_elements = clicked_element.closest('.dashboardJs').find('li.active');
            cache.already_active_elements.removeClass('active');
            clicked_element.addClass('active');

            cache.leftflyout_opened_by_element = clicked_element;
        } else {
            cache.leftflyout_opened_by_element.removeClass('active');
            cache.already_active_elements.addClass('active');
        }
    }
    /**
     * [resetFilter description:: Reset applied filter ]
     */
    function resetFilter(clicked_element) {
        if (hasFilterApplied()) {
            // click on "All" filter to reset filter
            var selectedRole = GoToPageModule.getSelectedRole();
            var allFilterElement;
            if(selectedRole === "revenue manager" || selectedRole === 'controller' || selectedRole === 'director') {
                allFilterElement = $('#li_id_1457938 a')
            } else {
                allFilterElement = getLeftFlyoutReference().find('.item-title:eq(1)').parent().find('.item-list:first').find('li:first a');                
            }
            allFilterElement.trigger('click');
        }
        //$(clicked_element).hide();
    }

    function getMenusListOfDeal() {
        var menuListContainer = $('#page_plugin_menu_item_list');
        // do not include menus that belog to "Action" section in the flyout
        var itemListContainer = menuListContainer.find('.item-list[id="accordion1"]').not(':first');
        var expectedMenuList = itemListContainer.find('a:visible');

        expectedMenuList = expectedMenuList.filter(function() {
            var anchor = $(this);
            if (anchor.attr("onclick")) {
                return true;
            }
            if (anchor.attr('data-property')) {
                return true;
            }
        });
        return expectedMenuList;
    }

    function getOrderedMenus(menus) {

        var expectedMenuList = getMenusListOfDeal();
        var firstCollection = $([]);

        $.each(menus, function(index, value) {
            expectedMenuList.map(function() {
                if($(this).find('.item-list-detail').text().toLowerCase() == value.toLowerCase()) {
                    firstCollection = $.merge(firstCollection, $(this));
                }
            });
        });
        expectedMenuList = expectedMenuList.filter(function() {
            if(menus.indexOf($(this).find('.item-list-detail').text()) > -1) {
                return false;
            }
            return true;
        });
        var finalResult = $.merge(firstCollection, expectedMenuList);
        return finalResult;
    }

    function appendShortcutMenus(menu_list, shortcutMenuContainer, menus) {
        var activeMenuSetting = {};
        menu_list.each(function() {
            var anchor = $(this);
            var menuText = anchor.find('.item-list-detail').text();
            if(anchor.parent().hasClass('active') && anchor.parent().hasClass('open-option-flyout')) {
                activeMenuSetting[anchor.attr('data-title').toLowerCase()] = 'active';
            }
            var settings = {
                originalText: menuText,
                iconClass: menuText.toLowerCase(),
                onclick: '',
                class_name: (anchor.parent().hasClass('active')) ? 'active': '',
                attr: {}
            };
            if (anchor.attr('data-property')) {
                settings.dataProperty = anchor.attr('data-property');
            } else {
                settings.onclick = anchor.attr('onclick');
            }

            var newShortcutMenu = getShortcutMenu(settings);
            if(menus && menus.indexOf(menuText) == -1) { // if menu does not match then
                newShortcutMenu.addClass('hide');
            }
            shortcutMenuContainer.append(newShortcutMenu);
        });
        return activeMenuSetting;
    }

    function createShortcutMenusForSuperAdminForOperationPage(shortcutMenuContainer) {
        var shortcutMenuContainer = shortcutMenuContainer || $("#menu_wraper").find('.sidebar_leftcol').find('ul:first');

        var menusToHide = shortcutMenuContainer.find('li:visible').filter(function() {
            var li = $(this);
            var originalTitle = li.attr('data-original-title');

            if(originalTitle) {
                if(originalTitle == 'Toggle Menu' || originalTitle == 'Search') {
                    return false;
                }
            }
            return true;
        });
        menusToHide.addClass('hide');
        var expectedMenuList = shortcutMenuContainer.closest('#menu_wraper').find('.sidebar_wrap').find('.item-list:first').find('li:visible').find('a');
        appendShortcutMenus(expectedMenuList, shortcutMenuContainer);
    }
    function createShortcutMenusForDealPage(shortcutMenuContainer) {
        // this function has to work only for deal page.
        var menus = ['Team', 'Mine', 'Review', 'Archived'];
        var allowedRoles = {
            business_manager: ['Archived'],
            revenue_accountant: menus,
            revenue_manager: menus,
            controller: menus,
            director: menus,
			super_admin: ['Archived']
        };
        var selectedRole = GoToPageModule.getSelectedRole(true);
        if (selectedRole in allowedRoles) {
            var menus = allowedRoles[selectedRole];
            var expectedMenuList = getOrderedMenus(menus);
            activeMenuSetting = appendShortcutMenus(expectedMenuList, shortcutMenuContainer, menus);

            if(selectedRole == 'business_manager' || selectedRole == 'super_admin') {
                createAdditionalShortcutMenusForBM(shortcutMenuContainer, activeMenuSetting);
            }
        }
    }

    function createShortcutMenus(pre_selected_main_manu) {
        var menuWrapper = $("#menu_wraper");
        var shortcutMenuContainer = menuWrapper.find('.sidebar_leftcol').find('ul:first');
        var mainMenuContainer = menuWrapper.find('.panel-default').not(':first');

        shortcutMenuContainer.find('.shortcut-icon-deal').remove();
        var section = BreadcrumbModule.getSectionFullPath();
        var selectedRole = GoToPageModule.getSelectedRole(true);
        if (section == 'deal->deal') {
            createShortcutMenusForDealPage(shortcutMenuContainer);
            setTimeout(function() {
                processPreSelectedSubmenu();
            }, 100);
        } else if(section == 'deal->operation') {
            // for BM, we supply 'Cash/Financing' menu filter to load page appropriately. In this case, make 'Cash/Financing' main menu active active
            if(pre_selected_main_manu) {
                var shortcutMenu = menuWrapper.find('.sidebar_leftcol').find('li[data-original-title="'+pre_selected_main_manu+'"]');
                shortcutMenu.addClass('active');
            }
            if(selectedRole == 'super_admin') {
                createShortcutMenusForSuperAdminForOperationPage(shortcutMenuContainer);
            } else if(selectedRole == 'business_manager') {
                manageFilterViewMenus( mainMenuContainer );
            }

        }
    }

    /**
     * [manageFilterViewMenus description: Load submenus for index view main menu and bind click event]
     * @param  {DOM Obj} mainMenuContainer [ Element reference where submenus to be inserted ]
     */
    function manageFilterViewMenus ( mainMenuContainer ) {

        var accordionAnchor = mainMenuContainer.find('.collapseWithJS');
        accordionAnchor.off('click.accrodion').on('click.accrodion', function() {
            var _this = $(this), itemList = _this.next(), arrowIcon = _this.find('.fa');
            var clicked_menu_title = _this.find('.item-list-detail').text().trim().toLowerCase();

            if(clicked_menu_title == 'index view') {
                if(!cache.has_index_view_clicked) {
                    // If clicked item is 'Index View' accordion then make ajax call
                    cache.has_index_view_clicked = true;
                    loadSubItemsForIndexViewMenus();
                    if( itemList.hasClass('item-list') ) {
                        arrowIcon.removeClass('fa-angle-down fa-angle-up');
                        (itemList.is(':visible')) ? arrowIcon.addClass('fa-angle-up') : arrowIcon.addClass('fa-angle-down');
                        if(_this.hasClass('collapseWithJS') && !itemList.is(':visible')) {
                            hideVisibleAccordion(_this);
                        }
                        itemList.slideToggle();
                    }
                }
            } else {
                if( itemList.hasClass('item-list') ) {
                    arrowIcon.removeClass('fa-angle-down fa-angle-up');
                    (itemList.is(':visible')) ? arrowIcon.addClass('fa-angle-up') : arrowIcon.addClass('fa-angle-down');
                    if(_this.hasClass('collapseWithJS') && !itemList.is(':visible')) {
                        hideVisibleAccordion(_this);
                    }
                    itemList.slideToggle();
                    // toggleListView(clicked_menu_title);
                }
            }
        });
    }
    /**
     * [toggleListView description: Show/Hide "Index View Mode" or "Filter View Mode" list accordingly ]
     * @param  {String} clicked_menu_title [ Title of the menu ]
     */
    function toggleListView(clicked_menu_title) {
        console.log(clicked_menu_title);
        // return true;
        // var operation_list = $("#operation_list");
        // operation_list.parent().children().addClass('hide');
        //
        // if(clicked_menu_title == 'filter view') {
        //     operation_list.parent().children().not("#operation_list").removeClass('hide');
        // } else if(clicked_menu_title == 'index view') {
        //     operation_list.removeClass('hide');
        // }
    }

    /**
     * [toggleAccordion description: Show/Hide submenu in "List/Menu" section]
     * @param  {Dom Obj} accordion_toggle_btn [ Button that user clicks to toggle the list ]
     */
    function toggleAccordion(accordion_toggle_btn) {
        if(accordion_toggle_btn.find('.item-list-detail').text().toLowerCase().trim() != 'index view') {
            synchronizeAccordions(accordion_toggle_btn);
        } else {
            // toggleListView('index view');
        }
        var itemList = accordion_toggle_btn.next(), arrowIcon = accordion_toggle_btn.find('.fa');
        if(accordion_toggle_btn.hasClass('accordion-toggle-js') && !itemList.is(':visible')) {
            hideVisibleAccordion(accordion_toggle_btn);
        }
        arrowIcon.removeClass('fa-angle-down fa-angle-up');
        (itemList.is(':visible')) ? arrowIcon.addClass('fa-angle-up') : arrowIcon.addClass('fa-angle-down');
        itemList.slideToggle();
    }

    /**
     * [hideVisibleAccordion description: Hide visible accordion ]
     * @param  {Dom Obj} accordion_toggle_btn [description]
     */
    function hideVisibleAccordion(accordion_toggle_btn) {
        var visibleList = accordion_toggle_btn.closest('ul').children().children().filter('ul:visible');


        if(accordion_toggle_btn.hasClass('panel-heading')) {
            visibleList = accordion_toggle_btn.closest('.panel-group').find('.panel-item-list:visible');

        }
        if(!visibleList.length) {return true;}

        visibleList.slideUp();
        var arrowIcon = visibleList.prev().find('.fa');
        arrowIcon.removeClass('fa-angle-down fa-angle-up');
        arrowIcon.addClass('fa-angle-up');
    }

    /**
     * [synchronizeAccordions description: Synchronize accordion in Menu and List view ]
     * @param  {Dom Obj} accordion_toggle_btn [description]
     */
    function synchronizeAccordions(accordion_toggle_btn) {
        var collection, indexOfFocusedElement, targetElement;
        if(accordion_toggle_btn.hasClass('collapseWithJS')) {
            collection = accordion_toggle_btn.closest('ul').children();
            indexOfFocusedElement = collection.index(accordion_toggle_btn.closest('li'));
            targetElement = $('#operation_list').find('.panel-default:eq('+indexOfFocusedElement+')');
        } else {
            collection = accordion_toggle_btn.closest('.panel-group').children();
            indexOfFocusedElement = collection.index(accordion_toggle_btn.closest('.panel-default'));
            targetElement = $('#menu_wraper').find('.accordion-toggle-js:first').next().find('li:nth-child('+(indexOfFocusedElement+1)+')');
        }

        if(targetElement.length) {
            var accordion_toggle_btn = targetElement.find('.accordion-toggle-js');
            hideVisibleAccordion(accordion_toggle_btn);
            if(accordion_toggle_btn.hasClass('accordion-toggle-js') && !accordion_toggle_btn.next().is(':visible')) {
                accordion_toggle_btn.next().slideDown();
                var arrowIcon = accordion_toggle_btn.find('.fa');
                arrowIcon.removeClass('fa-angle-down fa-angle-up');
                arrowIcon.addClass('fa-angle-down');
                loadDetailForm(accordion_toggle_btn);
            }
        }
    }

    function showEmptyDetail() {
        $("#id_detail_head").text('Deal ' + deal_node_id + ' (Blank): Detail');
        $("#id_detail_content").text('');
    }

    function loadDetailForm(accordion_toggle_btn) {
        var nextElement = accordion_toggle_btn.next();

        if(nextElement.find('.noEntry').length || nextElement.hasClass('noEntry')) {
            showEmptyDetail();
            return true;
        }

        var targetElement;
        if(nextElement.is('ul')) {
            targetElement = nextElement.find('li:first').find('a');
        } else {
            targetElement = nextElement.find('.flex-grid:first');
        }
        var triggerElement = true;
        if(accordion_toggle_btn.is('a') && accordion_toggle_btn.parent().hasClass('active')) {
            triggerElement = false;
        } else if(accordion_toggle_btn.is('div') && accordion_toggle_btn.hasClass('Active')) {
            triggerElement = false;
        }
        if(triggerElement) {
            targetElement.click();
        }
    }

    /**
     * [synchronizeHighlight description: Highlight submenu item accordingly in Main menu section]
     * @param  {Dom Obj} clicked_item [ Clicked List Item ]
     * @param  {String} id           [ active item operation id]
     */
    function synchronizeHighlight(clicked_item, id) {
        var itemContainer;
        if(clicked_item.hasClass('mode-index-view')) {
            // $('#menu_wraper').find('.menu-wrapper').find('.item-list-detail:contains("Index View")').closest('li').find('.active').removeClass('active');
            $('#menu_wraper').find('.menu-wrapper').find('.active').not('.search-sub-filter').removeClass('active');
            var indexViewMenu = $("#menu_"+id);
            indexViewMenu.closest('ul').closest('li').addClass('active');
            indexViewMenu.addClass('active');
        }
    }
    function removeIndexViewSubMenus() {
        cache.has_index_view_clicked = false;
        var indexViewAccordion = $("#menu_wraper").find('.item-list-detail:contains("Index View")');
        indexViewAccordion.parent().next().children().each(function() {
            $(this).children().filter('ul').remove();
            $(this).find('.accordion-toggle-js').find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');

            var mainMenuContainer = $("#menu_wraper").find('.panel-default').not(':first');
            manageFilterViewMenus( mainMenuContainer );
        });
    }

    function loadSubItemsForIndexViewMenus() {
        showFullLoader('full_page_loader');
        var ajaxData = {
            'action': 'opreratinList',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'indexing': 'indexing',
            'fieldname': dataSettings['deal-type']
        };
        PageModule.ajaxPromise({
            dataType: 'json',
        }, ajaxData).then(function(response) {
            appendSubitems(response);
        });
    }

    function appendSubitems(d) {
        data = jQuery.parseJSON(d.data);
        $('#operation_list').remove();

        var indexViewAccordion = $("#menu_wraper").find('.item-list-detail:contains("Index View")');
        var targetElements = indexViewAccordion.closest('li').find('.item-list-detail');
        // remove hidden menu
        indexViewAccordion.parent().next().children().filter('.hide').remove();
        indexViewAccordion.closest('li').find('.active').removeClass('active');

        targetElements.map(function(index, item) {
            var _this = $(this);
            var key = _this.text().trim().toLowerCase();
            var parent = _this.parent();
            parent.addClass('accordion-toggle-js');
            parent.off('click').on('click', function() {
                toggleAccordion($(this));
            });
            if(key in data) {
                var operationListJson = data[key];
                var operationListHtml = getOperationListForIndexView(operationListJson);
                operationListHtml.insertAfter(parent);
            }
        });
        appendOperationList(targetElements, data);
        hideFullLoader('full_page_loader');
    }

    function resetIndexViewSearch() {
        var listActiveElement = $("#id_listing_operation").find('.accordion-toggle-js.Active');
        revertSearch(listActiveElement);
        var flexGrid = listActiveElement.next().find('.mode-index-view:first');
        if(flexGrid.length) {
            flexGrid.trigger('click');
        }
    }

    function revertSearch(listActiveElement) {
        var listActiveElement = listActiveElement || $("#id_listing_operation").find('.accordion-toggle-js.Active');
        listActiveElement.next().find('.operation-list-pane:first').remove();
        listActiveElement.next().find('.operation-list-pane-hidden:first').removeClass('hide operation-list-pane-hidden').addClass('operation-list-pane');
    }

    function appendOperationList(targetElements, data) {
        var panelGroup = $('<div />').addClass('panel-group list-accordion').attr({
            id: 'operation_list'
        });
        targetElements.map(function(index, item) {
            var _this = $(this);
            var key = _this.text().trim().toLowerCase();

            if(key in data) {
                var operationListJson = data[key];
                var operationListHtml = getOperationListForListView(operationListJson, key);
                var panel = $('<div />').addClass('panel panel-default');
                var anchor = $('<a />')
                    .attr({href: 'javascript:void(0);'})
                    .append($('<i />').addClass('fa fa-angle-up'))
                    .append($('<span />').text(UtilityModule.ucwords(key)));
                var heading = $('<div />').addClass('panel-heading accordion-toggle-js').append($('<h4 />').addClass('panel-title').append(anchor));
                heading.off('click').on('click', function() {
                    toggleAccordion($(this));
                });
                panel.append(heading);
                panel.append(operationListHtml);
                panelGroup.append(panel);
            }
        });

        var container = $("#id_listing_operation").find('.flex-grid:first').parent();
        container.find('.flex-grid').remove();

        container.append(panelGroup);
    }

    function appendSearchResult(search_result) {

        var activeMenu = $("#menu_wraper").find('.sidebar_wrap').find('li.active:first');
        activeMenu = activeMenu.find('.item-list-detail:first').text().toLowerCase();
        var operationListJson = search_result[activeMenu];
        var operationListHtml = getOperationListForListView(operationListJson, activeMenu);
        operationListHtml = operationListHtml.find('.operation-list-pane');

        if(operationListHtml.find('.noEntry').length) {
            showEmptyDetail();
        } else {
            operationListHtml.find('.flex-grid:first').addClass('active');
        }

        var listActiveElement = $("#id_listing_operation").find('.accordion-toggle-js.Active');
        var operationListPane = listActiveElement.next().find('.operation-list-pane:first');

        if(operationListPane.parent().find('.operation-list-pane-hidden').length) {
            operationListPane = operationListPane.parent().find('.operation-list-pane-hidden');
            operationListPane.parent().find('.operation-list-pane').remove();
        }
        operationListPane.addClass('hide operation-list-pane-hidden').removeClass('operation-list-pane');
        operationListPane.parent().prepend(operationListHtml);

    }

    function getOperationListForListView(operationListJson, menu) {
        var wrapper = $('<div />').attr({
            id: menu.toLowerCase()
        }).css({display:'none'}).addClass('panel-item-list collapse').append($('<div />').addClass('panel-body').append($('<div />').addClass('operation-list-pane')));

        for(var key in operationListJson) {
            var name = operationListJson[key]['Name'];
            var ViewNID = operationListJson[key]['View NID'];
            var operation_id = operationListJson[key]['Operation id'];
            var operation_type = operationListJson[key]['Operation Type'];
            var operationArray = (operationListJson[key]['Read-Only Owner'])? (operationListJson[key]['Read-Only Owner']).split(",") : [];
            var read_only_owner = (jQuery.inArray(deal_user_role_id, operationArray) != -1)? 'readonlyowner' : '';

            var flexGrid = $('<div />').addClass('flex-grid clearfix mode-index-view workspace-operation-list');
            flexGrid.attr({
                onclick: 'return getOperationInstanceForm(this, '+ operation_id +','+ ViewNID +',event,'+ "'"+ read_only_owner +"'"+');',
                id: 'opration_id_' + operation_id,
                'data-operation-id': operation_id,
                'data-vnid-id': ViewNID,
                'data-dealnodeinsid': deal_node_id,
                'data-dealid': deal_node_id,
                'data-rolenodeid': deal_user_role_id,
                'data-dealinsid': deal_instance_id,
                'data-operation-type': operation_type,
                'data-document': (operationListJson[key]['PDF Template NID'])? operationListJson[key]['PDF Template NID']: '',
                'data-read-permission': read_only_owner
            });

            var flexColIcon = $('<div />').addClass('flex-col workflow-icon').append($('<a />').append($('<img />').attr({src: operationListJson[key]['Icon']}).addClass('imageListJs')));

            var flexColBody = $('<div />').addClass('flex-col workflow-body');

            if(operationListJson[key]['Operation Type'] == 'Optional') {
                flexGrid.addClass('throbHighlight');
                flexColBody.append($('<i />').addClass('prs-icon sm-close').attr('onclick', 'deleteOptionalOperation(event,'+operation_id+')'));
            }

            flexColBody.append($('<h4 />').addClass('text-upper operation-title breadcrumb-heading-js').text(name));
            flexColBody.append($('<p />').text(operationListJson[key]['Description']));

            flexGrid.append(flexColIcon);
            flexGrid.append(flexColBody);

            wrapper.find('.operation-list-pane').append(flexGrid);
        }
        if(!operationListJson.length) {
            var noOperation = getNotFoundTemplate();
            wrapper.find('.operation-list-pane').append(noOperation);
        }
        return wrapper;
    }
    function getNotFoundTemplate() {
        return '<div class="flex-grid noEntry clearfix no-record-list no-record-operation-list">There are no operations in this grouping.</div>';
    }

    function getOperationListForIndexView(operationListJson) {
        var ul = $('<ul />').addClass('item-list list-indent group-operation-list').css({display: 'none'});
        for(var key in operationListJson) {
            var name = operationListJson[key]['Name'];
            var ViewNID = operationListJson[key]['View NID'];
            var operation_id = operationListJson[key]['Operation id'];

            var anchor = $('<a />').attr({
                'data-title': name,
                'data-original-title': name,
                'data-toggle': 'tooltip',
                'data-placement': 'right',
                'id': 'menu_' + operation_id
            }).on('click', function() {
                var list_id = $(this).attr('id').replace('menu_', 'opration_id_');
                var listContainer = $("#operation_list");
                var targetElement = listContainer.find("#"+list_id);
                if(!targetElement.is(':visible')) {
                    revertSearch();
                    searchModule.resetSearchInput();
                }
                targetElement.click();
            });
            var spanEle = $('<span />').addClass('item-list-detail').text(UtilityModule.ellipsify(name, 16));
            anchor.append(spanEle);
            var li = $('<li />').addClass('index-view-op');
            li.append(anchor);
            ul.append(li);
        }
        if(!operationListJson.length) {
            ul.addClass('noEntry');
        }
        return ul;
    }
    function createAdditionalShortcutMenusForBM(shortcutMenuContainer, activeMenuSetting) {

        var additionalMenus = ['Capped', 'Posting', 'Final Sale'];
        var statusMenu = $("#menu_wraper").find('.sidebar_wrap').find('.open-option-flyout:first');
        var statusId = statusMenu.data('statusid');
        additionalMenus.map(function(value) {
            var settings = {
                originalText: value,
                iconClass: value.toLowerCase(),
                onclick: "getFilterList(this,'" + value + "', " + statusId + ",'');",
                class_name: ' additional-shortcut-icon-deal submenu',
                attr: {'data-title': value},
                attrData: statusMenu
            };
            if(settings.iconClass in activeMenuSetting) {
                settings.class_name = settings.class_name+' '+activeMenuSetting[settings.iconClass];
            }
            var newShortcutMenu = getShortcutMenu(settings);
            // 'Archived' menu has to show at the end of the list. To do so, add additional menus before 'Archived' menu
            newShortcutMenu.insertBefore(shortcutMenuContainer.find('li[data-original-title="Archived"]'));
        });
    }

    function removeDealShortcutMenus() {
        var shortcutMenuContainer = $("#menu_wraper").find('.sidebar_leftcol').find('ul:first');
        shortcutMenuContainer.find('.shortcut-icon-deal').remove();
    }

    function getShortcutMenu(settings) {
        var li = $('<li />').attr({
            'data-toggle': 'tooltip',
            'data-placement': 'right',
            'data-original-title': settings.originalText,
            'onclick': settings.onclick
        }).addClass('shortcut-icon-deal '+ settings.class_name);
        if(settings.attr) {
            li.attr(settings.attr);
        }
        if(settings.attrData) {
            li.data('open-option-flyout-ref', settings.attrData);
        }
        var anchor = $('<a />').attr('onclick', 'javascript:void(0);');
        if (settings.dataProperty) {
            li.addClass('open-option-flyout');
            anchor.attr('data-property', settings.dataProperty);
        }
        anchor.append($('<i />').addClass('prs-icon ' + settings.iconClass.replace(/\s/g, '-')));
        return li.append(anchor);
    }

    function highlightShortcutMenu(clicked_menu) {
        var menuWrapper = $("#menu_wraper");
        if (!clicked_menu) {
            clicked_menu = menuWrapper.find('.menu-wrapper').find('.panel-body').not(':first').find('li.active:visible').find('a');
        }
        var onClickAttr = clicked_menu.attr('onclick');
        var isShortcutMenu = (clicked_menu.data('placement') == 'right') ? true : false;
        var menuLiContainer = '';
        var addClassOnThisElement = '';
        if (isShortcutMenu) {
            //if short-cut icon was clicked then highlight corresponding main menu
            menuLiContainer = menuWrapper.find('.menu-wrapper').find('.panel-body');
            menuLiContainer.find('li.active').removeClass('active');
            if (onClickAttr) { // if has property "onclick"
                menuLiContainer.find('a[onclick="' + onClickAttr + '"]').parent().addClass('active');
            } else {
                menuLiContainer.find('a[data-property="' + clicked_menu.find('a').attr('data-property') + '"]').parent().addClass('active');
            }
        } else {
            //if main menu icon was clicked then highlight corresponding short-cut icon
            menuLiContainer = menuWrapper.find('.sidebar_leftcol');
            // if(!clicked_menu.closest('.filter-option-wrap').length) { // if not submenu
            //     menuLiContainer.find('li.active:visible').removeClass('active');
            // }
            menuLiContainer.find('li.active').removeClass('active');
            if (onClickAttr) { // if has property "onclick"
                addClassOnThisElement = menuLiContainer.find('li[onclick="' + onClickAttr + '"]');
                addClassOnThisElement.addClass('active');
                // if short-cut menu is not visible and addClassOnThisElement has 'submenu' class then find short-cut menu by 'data-title'
                if(clicked_menu.hasClass('submenu')) {
                    menuLiContainer.find('li[data-original-title="'+clicked_menu.attr('data-title')+'"]').addClass('active');
                }
            } else {
                if(clicked_menu.is('a')) {
                    clicked_menu = clicked_menu.parent();
                }
                addClassOnThisElement = menuLiContainer.find('a[data-property="' + clicked_menu.find('a').attr('data-property') + '"]').parent();
                addClassOnThisElement.addClass('active');
                // if short-cut menu is not visible and addClassOnThisElement has 'open-option-flyout' class then find short-cut menu by 'data-title'
                if(!addClassOnThisElement.is(':visible') && addClassOnThisElement.hasClass('open-option-flyout')) {
                    menuLiContainer.find('li[data-original-title="'+clicked_menu.find('a').attr('data-title')+'"]').addClass('active');
                }
            }
        }
        handleAdditionalShortcutMenuClick(clicked_menu);
    }

    function handleAdditionalShortcutMenuClick(clicked_menu) {
        if(clicked_menu.hasClass('additional-shortcut-icon-deal')) {
            var openOptionMainMenu = clicked_menu.data('openOptionFlyoutRef');
            openOptionMainMenu.addClass('active').find('a').attr('data-title', clicked_menu.attr('data-original-title'));
            // console.log(openOptionFlyoutElement);
        }
    }
    function storePreselectedSubmenu(data_settings) {
        if(data_settings.status) {
            cache.preselected_sub_menu = data_settings.status;
        }
    }

    // Highlight short-cut and main menu appropriately when user comes from operation page to deal page.
    function processPreSelectedSubmenu() {

        var preSelectedMenu = cache.preselected_sub_menu;
        if(preSelectedMenu) {
            var shortcutMenuContainer = $("#menu_wraper").find('.sidebar_leftcol');
            // check any short-cut icon is active or not. If not then check STATUS index in data_settings variable
            if(!shortcutMenuContainer.find('li.active:visible').length) {
                var targetShortcutMenu = shortcutMenuContainer.find('li[data-original-title="' + preSelectedMenu + '"]:visible');
                if(targetShortcutMenu.length) {
                    targetShortcutMenu.addClass('active');
                    highlightShortcutMenu(targetShortcutMenu);
                }
            }
        }
        cache.preselected_sub_menu = undefined;
    }

    return {
        slideLeft: slideLeft,
        slideRight: slideRight,
        init: init,
        pinActionFlyout: pinActionFlyout,
        clearCache: clearCache,
        monitorExpandCollapse: monitorExpandCollapse,
        collapsePanelGroups: collapsePanelGroups,
        cache: cache,
        highlightMenu: highlightMenu,
        hasFilterApplied: hasFilterApplied,
        toggleClassOnMenuElements: toggleClassOnMenuElements,
        toggleActiveSelection: toggleActiveSelection,
        getVisibleMenusWidth: getVisibleMenusWidth,
        resetFilter: resetFilter,
        iconBlue: iconBlue,
        checkMenuHighlight: checkMenuHighlight,
        getActiveMenu: getActiveMenu,
        createShortcutMenus: createShortcutMenus,
        highlightShortcutMenu: highlightShortcutMenu,
        removeDealShortcutMenus: removeDealShortcutMenus,
        getMenusListOfDeal: getMenusListOfDeal,
        getOrderedMenus: getOrderedMenus,
        createShortcutMenusForSuperAdminForOperationPage: createShortcutMenusForSuperAdminForOperationPage,
        storePreselectedSubmenu: storePreselectedSubmenu,
        synchronizeHighlight: synchronizeHighlight,
        removeIndexViewSubMenus: removeIndexViewSubMenus,
        appendSearchResult: appendSearchResult,
        resetIndexViewSearch: resetIndexViewSearch,
        getNotFoundTemplate: getNotFoundTemplate,
        showEmptyDetail: showEmptyDetail
    };

}());

function checkMenuHighlight(self) {
    var selectedRole = GoToPageModule.getSelectedRole(true);
    if(selectedRole == 'super_admin') { // for 'super_admin' do not do anything
        return true;
    }

    if (self !== undefined) {
        var menuSelected = $(self);
    } else {
        var menuSelected = $('#page_plugin_menu_item_list li.active');
    }
    $('.sidebar_leftcol li').removeClass('active');
    if (menuSelected.hasClass('opsCat')) {
        var statusId = menuSelected.attr('data-statusid');
        switch (statusId) {
            case '7794':
                $('.capping_filter').addClass('active');
                break;
            case '7795':
                $('.finance_filter').addClass('active');
                break;
            case '7796':
                $('.cash_filter').addClass('active');
                break;
            case '7797':
                $('.closing_filter').addClass('active');
                break;
            case '7798':
                $('.posting_filter').addClass('active');
                break;
            case '8849':
                $('.otherroleoperation_filter').addClass('active');
                break;
            default:
                // alert('Nobody Wins!');
        }
    }
}

function iconBlue() {
    $('.sidebar_leftcol li').on('click', function() {
        if ($(this)[0].hasAttribute('data-original-title')) {
            var tempVal = $(this).attr('data-original-title');
            switch (tempVal) {
                case 'Capping':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.capping_filter').addClass('active');
                    $('#li_id_1615130').addClass('active');
                    break;
                case 'Financing':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.finance_filter').addClass('active');
                    $('#li_id_1615140').addClass('active');
                    break;
                case 'Cash':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.cash_filter').addClass('active');
                    $('#li_id_1615150').addClass('active');
                    break;
                case 'Closing':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.closing_filter').addClass('active');
                    $('#li_id_1615160').addClass('active');
                    break;
                case 'Posting':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.posting_filter').addClass('active');
                    $('#li_id_1615170').addClass('active');
                    break;
                case 'Print Package':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('#printPackageDiv').addClass('active');
                    break;
                case 'Other Role Operations':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('.otherroleoperation_filter').addClass('active');
                    $('#li_id_1615220').addClass('active');
                    break;
                case 'Add':
                    $('.sidebar_leftcol ul li').removeClass('active');
                    $('.opsCat').removeClass('active');
                    $('#addMenuListDiv').addClass('active');
                default:
                    // alert('Nobody Wins!');
            }
        }
    });
    $('#page_plugin_menu_item_list li').on('click', function(event) {
        event.stopPropagation();
        checkMenuHighlight(this);
    });
}


$(document).ready(function() {

    leftNavigationModule.init();
    $('body').on('mouseenter', '.filter-option-wrap .item-list-detail', function(e) {
        x = e.pageX - $(this).offset().left;
        y = e.pageY - $(this).offset().top;

        $(this).css('z-index', '15')
            .children("div.tooltip")
            .css({
                'top': y + 70,
                'left': x - 0,
                'display': 'block'
            });
    });
})


var PermissionModule = (function() {

    var PermissionModule = function() {};

    PermissionModule.prototype.canAdd = function(permission_list) {
        if (permission_list.indexOf('can_add') > -1) {
            return true;
        }
    }

    PermissionModule.prototype.toggleAddPermissionButton = function(action) {
        var menuWrapper = $("#menu_wraper");
        var addOperationButton1 = menuWrapper.find(".leftMenuWrap").find("#addMenuListDiv");
        var addOperationButton2 = menuWrapper.find('.slideNavigationWrap').find('.item-list:first').find('a[onclick^=getContentFormForAdd]').closest('li');
        var buttons = $.merge(addOperationButton1, addOperationButton2);

        (action) ? buttons.removeClass('inactive'): buttons.addClass('inactive');
    }

    PermissionModule.prototype.checkPermissionForOperation = function(permission_list) {
        //return false;
        var permission_list = permission_list.map(function(value) {
            return $.trim(value.toLowerCase().replace(' ', '_'));
        });

        if (BreadcrumbModule.getSectionFullPath() == "deal->operation") {
            this.toggleAddPermissionButton(this.canAdd(permission_list));
        }

    }

    return new PermissionModule();
}());
