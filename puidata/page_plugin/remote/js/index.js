var current_user_id;
var current_role_id;
var is_first = true;
window.globalVar = {};
globalVar.dealFilterCheck = false;
globalVar.cantHide = true;
window.previous_list_status = '';
window.current_list_status = '';

function loginFromPUPlugin(extra_params) {
    // 454674 RA
    current_user_id = $(".connect_user_id").val();
    current_role_id = $(".connect_role_id").val();


    if (parseInt(current_user_id) > 0) {
        var default_section_index = inboxMenuName.toLowerCase();

        var parsed_all_settings = all_settings;
        if (typeof extra_params != 'undefined') {
            if (typeof extra_params.section_index != 'undefined') {
                default_section_index = extra_params.section_index;
            }
        }
        default_section_index = toggleMainMenu(current_role_id, default_section_index);
        var params = {
            data: parsed_all_settings[default_section_index]['settings']
        };
        /*if(default_section_index == 'deal' && current_role_id == 454674) {
            params.data.menu.menuListInstanceId = 1012017;
        } else if(default_section_index == 'deal' && current_role_id != 454674) {
            params.data.menu.menuListInstanceId = 398419;
        }*/
        if (!is_first) {
            params.action = 'other';
        }
        if (typeof extra_params != 'undefined') {
            $.extend(params.data, extra_params);
        }
        params.section_index = default_section_index;
        var callback_params = {
            data: params,
            callback: loadView
        };
        showFullLoader('full_page_loader', callback_params);
        $("#leftMenuBar").removeClass("leftMenuBarHide").addClass("leftMenuBarShow");
    } else if (current_user_id == '') {
        if (typeof flyoutModule != 'undefined') {
            var flyoutElement = $(flyoutModule.properties.flyoutWrapper);
            flyoutModule.removeOldFlyout();
        }
        $("#dealForm").html("");
        $("#leftMenuBar").removeClass("leftMenuBarShow").addClass("leftMenuBarHide");
        createRootMenus();
    }
    // $("#menu_wraper").removeClass('hide');
    // $('.slideToLeftNav').trigger('click');
}

function storePreviousListStatus() {
    if ($('#page_plugin_menu_item_list').find('li.active').length > 0) {
        previous_list_status = $('#page_plugin_menu_item_list').find('li.active span.item-list-detail').text().toLowerCase();
    }
}

// At multiple places, action flyout menu's alias is being used instead of label at PHP end. It breaks js functionality.
// To fix it, below function returns appropriate menu label when menu-alias is supplied.
var manuLabelArr = {
    business_manager: [
        {label: 'Archived', alias: 'common_archived'}
    ],
    revenue_accountant: [
        {label: 'Team', alias: 'all'},
        {label: 'Archived', alias: 'common_archived'},
        {label: 'Mine', alias: 'ra_mine'},
        {label: 'Review', alias: 'ra_rm/c/d'}
    ],
    revenue_manager: [
        {label: 'Archived', alias: 'common_archived'},
        {label: 'Review', alias: 'ra_c/d'},
        {label: 'Mine', alias: 'ra_mine'},
        {label: 'Team', alias: 'ra_454674'}
    ],
    controller: [
        {label: 'Archived', alias: 'common_archived'},
        {label: 'Team', alias: 'ra_454674'},
        {label: 'Mine', alias: 'ra_mine'},
        {label: 'Review', alias: 'ra_c/d'}
    ],
    director: [
        {label: 'Archived', alias: 'common_archived'},
        {label: 'Team', alias: 'ra_454674'},
        {label: 'Review', alias: 'ra_c/d'},
        {label: 'Mine', alias: 'ra_mine'}
    ]
};
function mapMenuAliasToLabel(menu_alias) {
    var selectedRole = GoToPageModule.getSelectedRole(true), alias_str = menu_alias.toLowerCase();
    if(selectedRole in manuLabelArr) {
        var menusArr = manuLabelArr[selectedRole];
        for(var key in menusArr) {
            if(menusArr[key]['alias'] == alias_str) {
                menu_alias = menusArr[key]['label'];
                break;
            }
        }
    }
    return menu_alias;
}

function filterActiveOnStatus(statusVar) { //Make corresponding menu filter active on response list content placed in HTML : by Saurabh (17th Jan 2017)
    if (statusVar !== '') {
        statusVar = mapMenuAliasToLabel(statusVar);
        $('#page_plugin_menu_item_list').find('li:visible').each(function(index, listEle) {
            listEle = $(listEle);
            var selectedMenuText = listEle.find('span.item-list-detail').text().toLowerCase();
            var statusCapped = selectedMenuText === 'status' && statusVar === 'Capped';
            if (selectedMenuText === statusVar.toLowerCase() || statusCapped) {
                $('#page_plugin_menu_item_list').find('li').removeClass('active');
                listEle.addClass('active');
                if(statusCapped) {
                    $('#li_id_398476').find('a').attr('data-title','Capped');
                }
                leftNavigationModule.highlightShortcutMenu(listEle.find('a'));
            }
        })
    }
}

function getActiveSectionId() {
    return $("#leftMenuBar").find('.active').find('span').data('sectionId');
}

/**
 * [toggleMainMenu description:: When main menus are shown/hidden then decide which menu should be active. For admin, inboxMenuName.toLowerCase() menu will be hidden. In this case 'Deal' menu should become active]
 * @return {[type]} [undefined]
 */
function toggleMainMenu(current_role_id, default_section_index) {
    var menuContainer = $("#leftMenuBar");
    if (current_role_id != '603696') { // similar to "current_role_id != 'administrator'"
        menuContainer.find("#section_id_team-member,#section_id_operation,#section_id_requirement,#section_id_performance,#section_id_Control,#section_id_store").addClass('hide');
        menuContainer.find("#section_id_dashboard").removeClass('hide');
    } else {
        menuContainer.find("#section_id_team-member,#section_id_operation,#section_id_requirement,#section_id_performance, #section_id_dashboard,#section_id_Control,#section_id_store").removeClass('hide');
        menuContainer.find("#section_id_dashboard").addClass('hide');
    }
    menuContainer.find('a.active').removeClass('active'); // remove 'active' class from every menu
    var alreadySelectedMenu = menuContainer.find('span[data-section-id="' + default_section_index + '"]').closest('a');
    if (alreadySelectedMenu.is(":visible")) {
        alreadySelectedMenu.addClass('active');
        return default_section_index;
    } else {
        menuContainer.find('a').not('.hide').filter(':first').addClass('active'); // make first visible menu active
        return menuContainer.find('a.active').find('span').data('sectionId');
    }
}

function createRootMenus() {

    var menuContainer = $("#leftMenuBar");
    menuContainer.html('');
    // create menu dynamically from settings.json file
    var menuTmpl = $('#left-menu-template');
    for (var section in all_settings) {
        var clonedTmpl = menuTmpl.find('a').clone();
        clonedTmpl.attr('id', 'section_id_' + section).addClass(all_settings[section]['class']);
        clonedTmpl.attr({
            'data-toggle': 'tooltip',
            'data-placement': 'right',
            'data-original-title': all_settings[section]['label']
        });
        clonedTmpl.find('.menu-icon').addClass((all_settings[section]['class'].length) ? section + ' leftPane-icon' : 'leftPane-icon');
        clonedTmpl.find('.section-id').attr('data-section-id', section).text(all_settings[section]['label']);
        menuContainer.append(clonedTmpl);
    }
    $("#leftMenuBar a").off('click').on("click", function() {
        addClickHandler($(this));
    });
}

function addClickHandler(clicked_element) {
    GoToPageModule.cache.show_capped_alert = true;
    leftNavigationModule.clearCache(); // if directly clicked on Main Menu then clear previous stored filter settings
    var menuContainer = $("#leftMenuBar");

    var dataSectionId = clicked_element.find('span').data('sectionId');
    if (dataSectionId != 'deal') {
        leftNavigationModule.cache.show_sidebar_flyout = false;
    }
    var parsed_all_settings = all_settings;
    var params = {
        action: 'other',
        data: parsed_all_settings[dataSectionId]['settings']
    };
    params.section_index = dataSectionId;
    var callback_params = {
        data: params,
        callback: loadView
    };
    showFullLoader('full_page_loader', callback_params);
    menuContainer.find("a").removeClass("active");
    clicked_element.addClass("active");
}

$(document).ready(function() {
    var menuContainer = $("#leftMenuBar");
    createRootMenus();
    checkBrowser();
    // section ends here
    $("#leftMenuBar a").off('click').on("click", function() {
        addClickHandler($(this));
    });
});
function checkBrowser() {
    var val = navigator.userAgent.toLowerCase();
    var body = $('body');
    if(val.indexOf("firefox") > -1) {
        body.addClass('firefox');
    }
    else if(val.indexOf("opera") > -1) {
        body.addClass('opera');
    }
    else if(val.indexOf("msie") > -1) {
        body.addClass('ie');
        // get ie version
        version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        body.addClass('ie'+version);
    }
    else if(val.match('chrome') != null) {
        body.addClass('chrome');
    }
    else if(val.indexOf("safari") > -1) {
        body.addClass('safari');
    } else if(window.navigator.userAgent.indexOf("Edge") > -1) {
        body.addClass('edge');
    }
}
var load_view_xhr = null;

function loadView(data) {
    if(typeof dataSettings != 'undefined') {
        leftNavigationModule.storePreselectedSubmenu(dataSettings);
        leftNavigationModule.cache.has_index_view_clicked = false;
    }
    $.increment_panel_count = true;
    if (data.section_index == inboxMenuName.toLowerCase()) {
        $.increment_panel_count = false;
    }

    $.loaded_panels_count = 0;

    if (typeof GoToPageModule != 'undefined') {
        GoToPageModule.revertState();
    }
    if (typeof flyoutModule != 'undefined') {
        var flyoutElement = $(flyoutModule.properties.flyoutWrapper);
        flyoutModule.removeOldFlyout();
    }
    $.keep_showing_full_page_loader = true; // means page is being reloaded by ajax call so do not let 'full loader' hide automatically.
    data.userId = current_user_id;
    data.roleId = current_role_id;
    var timeout = 30000;

    load_view_xhr = $.ajax({
        url: api_path,
        type: 'post',
        data: data,
        timeout: timeout,
        beforeSend: function() {
            if (load_view_xhr !== null) {
                load_view_xhr.abort();
                load_view_xhr = null;
            }
        },
        success: function(response) {
            $('#drop-overlay-js').remove();
            showBodyBanner(1);
            /*
             * Added By: Divya Rajput
             * On Date: 24th November 2016
             * Purpose: Task#253 - Remove Chat Dialog option. This option should only be available inside a deal.*/
            if ($.trim(data.section_index) != 'deal') {
                $('#miniDialogue').css('display', "none");
            } else {
                $('#miniDialogue').css('display', "block");
            }
            /*End Here*/

            var dealForm = $("#dealForm");
            dealForm.html(response);
            is_first = false;
            if (typeof _init == 'function') {
                _init();
                flyoutModule._init();
                BreadcrumbModule._init();
                searchModule._init();
                leftNavigationModule.init();
                searchModule.resetSearchInput();
                middlePaneViewModule.init();
                jsGrid.start();
                leftNavigationModule.cache.has_action_flyout_expanded = false;
                leftNavigationModule.cache.is_pinned = false; // This line has been added here to by-pass a bug. It must be removed if that bug is fixed.
            }
        },
        error: function(jqXHR, textStatus) {
            handleAjaxError.showCustomError(jqXHR, textStatus, {timeout: timeout, action: data.action});
        }
    });
}
var handleAjaxError = {
    /**
     * [showCustomError description: When internet connection is lost or server does not return proper response then hide loader and show appropriate message ]
     * @param  {Object} jqXHR      [ first parameter of error callback ]
     * @param  {String} textStatus [ error text ]
     * @return {None}            [description]
     */
    showCustomError: function(jqXHR, textStatus, params) {
        // if(this.is_error_displaying) {
        //     return true;
        // }
        this.is_error_displaying = true;
        var statusErrorMap = {
            '400' : "Server understood the request, but request content was invalid.",
            '401' : "Unauthorized access.",
            '403' : "Forbidden resource can't be accessed.",
            '500' : "Internal server error.",
            '503' : "Service unavailable.",
            '404' : "The server has not found anything for the request",
            'timeout': "Request Timed Out.",
            'error': "Destination Host Unreachable, Please check Internet Connection.",
            'other': "Unable to complete your request.",
            'parsererror': "Parse Error: Unable to parse server response."
        };
        if(textStatus == 'abort') {
            return true;
        }
        var message = (statusErrorMap[jqXHR.status]) ? statusErrorMap[jqXHR.status] : ((statusErrorMap[textStatus]) ? statusErrorMap[textStatus] : '');
        if(!message) {
            message = statusErrorMap['other'];
        }
        var additionalInfo = '<span class="hide">For Action "' + params.action + '", request was unable to complete within ' + (params.timeout/1000) + ' seconds. <br /></span>';
        this.showBootboxError({message: additionalInfo + message});
    },
    showBootboxError: function(params) {
        var self = this;
        bootbox.alert({
            title: 'Alert',
            message: params.message,
            callback: function() {
                self.is_error_displaying = false;
                $.keep_showing_full_page_loader = false;
                $.do_not_hide_loader = false;
                // hide all loader elements
                $('.loader-wrapper:visible').each(function() {
                    var element = $(this);
                    self.hideFlyoutIfFound(element);
                    hideFullLoader(element.attr('id'));
                });
            }
        });
        // set z-index so that Alert popup appears above all loader elements
        setTimeout(function() {
            $('.bootbox-alert.in:last').css('z-index', '99999');
        }, 400);
    },
    /**
     * [hideFlyoutIfFound description: Hide flyout if open when ajax error appears and user clicks on 'OK' button in bootbox alert ]
     * @param  {Obj} child_element [ Child element of the flyout ]
     */
    hideFlyoutIfFound: function(child_element) {
        var jq_flyout_wrapper = child_element.closest('.jq_flyout_wrapper');
        if(jq_flyout_wrapper.length) {
            var closeBtnSelector = jq_flyout_wrapper.attr('id').replace('_wrapper', '_close');
            var closeBtn = jq_flyout_wrapper.find('.user-action-wrap').find('.'+closeBtnSelector);
            if(closeBtn.length) {
                closeBtn.trigger('click');
            }
        }
    }
};

function loadMenuListByAjax() {}

function responseListHeader() {}

function responseListContent() {}

function getListHeaders() {}

function getListContent() {}

function isFullPageLoaderShowing() {
    return $("#full_page_loader:visible").length;
}

function showFullLoader(id, params) {
    if( $('#content_loader:visible').length && id === "full_page_loader") {
        hideFullLoader('content_loader');
    }
    $('.user-action-wrap').addClass('inactive'); //Make side buttons inactive
    if (isFullPageLoaderShowing()) { // As per new requirement, do not show any other loader if full page loader is showing.
        if (typeof params == 'object') {
            params.callback(params.data);
        }
        return true;
    }
    var element = $('#' + id);
    if (!element.length && typeof params == 'object') {
        params.callback(params.data);
    }
    if (element.is(':visible')) { // if loader is visible then do not show it again.
        if (typeof params == 'object') {
            params.callback(params.data);
        }
        return true;
    }
    if(element.attr('data-timeout-interval')) {
        window.clearTimeout(element.attr('data-timeout-interval'));
        element.removeAttr('data-timeout-interval');
    }
    //If loader stays for 35 seconds then hide the loader and show error message of timeout
    var timeoutInterval = setTimeout(function() {
        //in one case, this function executs even all the loaders are hidden. Below condition is to prevent it.
        var visibleLoaderElement = $('div[data-timeout-interval="' +timeoutInterval+ '"]');
        if(visibleLoaderElement.is(':visible')) {
            handleAjaxError.showCustomError({}, 'timeout', {timeout: 35000});
        } else {
            visibleLoaderElement.removeAttr('data-timeout-interval');
        }
    }, 35000);
    element.attr('data-timeout-interval', timeoutInterval);
    element.fadeIn(0, function() {
        if (typeof params == 'object') {
            params.callback(params.data);
        }
    });
}


function hideFullLoader(id, callback) {
    var element = $('#' + id);
    if(element.attr('data-timeout-interval')) {
        window.clearTimeout(element.attr('data-timeout-interval'));
        element.removeAttr('data-timeout-interval');
    }

    if (id == 'full_page_loader' && $.keep_showing_full_page_loader === true) {
        // console.log('do not hide "#full_page_loader"');
    } else if (globalVar.dealFilterCheck && globalVar.cantHide) {
        // can't hide loader yet!!
    } else {
        $('.user-action-wrap').removeClass('inactive'); //Reactivate side buttons
        if (element.is(':visible')) { // fadeout the loader only when it is visible
            if ($.do_not_hide_loader !== true) {
                element.fadeOut(500, function() {
                    if (typeof callback != 'undefined' && typeof callback == 'function') {
                        callback();
                    }
                });
            }
        }
    }
}

/**
 * [showBodyBanner description: Keep showing loader when user is not logged in until background image is loaded. If user logs in then do not call this function. ]
 */
function showBodyBanner(remove_background_image_from_body) {
    var current_user_id = $(".connect_user_id").val();
    var bodyEle = $('body');
    var bannerImg = 'http://sta.pu.prospus.com/puidata/page_plugin/component/img/dashboard-bg.jpg';
    bodyEle.attr('data-background-url', bannerImg);
    if(remove_background_image_from_body) {
        bodyEle.css({
            background: ''
        });
        return true;
    }

    showFullLoader('full_page_loader');
    var imgTag = $('<img />').attr({
        src: bannerImg
    }).on('load', function() {
        $(this).remove();
        bodyEle.css({
            background: 'url('+bannerImg+')',
            'background-position': 'top right',
            'background-size': 'cover'
        });
    });
    bodyEle.append(imgTag);
}
showBodyBanner();

// below empty function is needed to prevent js error.
function resizeHT() {}
function resizeHT() {}
function threePane() {}
function menuHT() {}
function filterMenu() {}
function setTbodyHt() {}
function paneMidHt() {}
function manageScrollBar() {}
function applyDatePicker() {}


function bindEventsSortSearch() {
    $('body').on('click', function() {
        clearFilter();
    });
}

