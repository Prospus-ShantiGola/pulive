define(['ajax'], function(AjaxModule) {
    window.AjaxModule = AjaxModule;
    var options = {
        panels_count: 3
    };

    var cache = {
        loaded_panels_count: 0
    };

    function PageModule() {
        AjaxModule.call(this, arguments);
        this.mergeDefaultParams = function(options) {
            var defaultParams = {
                'login_user_id': login_user_id,
                'roleId': login_role_id
            };
            $.extend(options.data, defaultParams);
        }
    }

    function incrementPanelCount() {
        // console.trace();
        if ($.increment_panel_count) {
            $.loaded_panels_count++;
        }
    }


    PageModule.prototype = Object.create(AjaxModule.prototype);
    PageModule.constructor = PageModule;
    PageModule.prototype.loadLeftPanel = function() {};

    PageModule.prototype.loadMiddlePanel = function(options) {

        var callback_params = {
            data: options,
            callback: this.ajax.bind(this)
        };
        var loader = options.loader_id;
        if(!options.loader_id) {
            loader = $('.no-record-js').length ? 'full_page_loader' : 'listing_loader'
        }
        showFullLoader(loader, callback_params);

    };

    PageModule.prototype.middlePanelLoaded = function(title) {

        // console.log('middlePanelLoaded... ');
        incrementPanelCount();
        hasAllPanelsLoaded();
    }
    PageModule.prototype.loadDetailPanel = function(settings) {
        var data = settings.data;
        var ajax_settings = {
            requestType: 'POST', dataType: settings.dataType || 'JSON'
        };
        var newFun = UtilityModule.compose(this.detailPanelLoaded, settings.callback);
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise(ajax_settings, data).then(newFun);
        });
    }
    PageModule.prototype.loadDetailPanel__ = function(settings) {

        var newFun = UtilityModule.compose(this.detailPanelLoaded, settings.callback);
        console.log(newFun);
        var options = {
            data: settings.data,
            success: newFun,
            dataType: settings.dataType
        };
        this.ajax(options);
    };

    PageModule.prototype.detailPanelLoaded = function(options) {

        // console.log('detailPanelLoaded...');
        var activeMenu = $("#leftMenuBar").find('.active').find('span');
        //inactive edit button if deal is in current user role stage.

        var level = {
            name: activeMenu.text(),
            callback: function() {
                loginFromPUPlugin({
                    section_index: activeMenu.data('sectionId')
                });
            }
        };
        BreadcrumbModule.setLevel(level);
        BreadcrumbModule.updateBreadcrumb();
        incrementPanelCount();
        // hasAllPanelsLoaded(); // Comment to resole loader issue on BM role that appear on operation list.

        if (typeof OperationModule != 'undefined') {
            OperationModule.toggleOperationActionButton(options);
            if (!OperationModule.isDealEditable(true) && level.name == "Deals") {
                // $("div.right-action-bar a.editJs").not('.inactive').addClass('hide');
            }
        }

        if (GoToPageModule.isPageLoading()) {
            GoToPageModule.showDealDetail();
        }

        // if(GoToPageModule.isPageLoadingForBM()) {
        // 	GoToPageModule.showAppOneDetail();
        // }
    }

    PageModule.prototype.menuAfterLoad = function() {
        // console.log('menuPanelLoaded...');
        //manageMenuDashboard();
        leftNavigationModule.monitorExpandCollapse(); // add event listener 'collapse/expand'
        incrementPanelCount();
        hasAllPanelsLoaded();
        leftNavigationModule.highlightMenu();

        // below function only applies for "deal". Below function creates short-cut icons for deal main-menus
        leftNavigationModule.createShortcutMenus();

        var currentSectionHeading = BreadcrumbModule.getCurrentSectionHeading().toLowerCase();
        // "currentSectionHeading == 'operation'" means user is coming back from operation section. If so then check search was done or not
        if (typeof dataSettings != 'undefined' && dataSettings.search_string && currentSectionHeading == 'operation') {
            checkSearchFilter();
        }
        roleWiseAddDeal();
    }

    function checkSearchFilter() {
        $('#menu_wraper').removeClass('hide');
        $('.slideToRightNav').trigger('click')
        $(searchModule.properties.searchTextbox).val(dataSettings.search_string);
        $(searchModule.properties.searchTextboxJS).trigger('click');
        showActiveFilterSelection();
    }

    function hasAllPanelsLoaded() {

        // console.log(GoToPageModule.isPageLoadingForBM());
        if (GoToPageModule.isPageLoadingForBM() === true) { // if page is still loadeing for Business Manager then do not hide full loader
            if ($.loaded_panels_count == options.panels_count) {
                $.loaded_panels_count = 0;
            }
            return true;
        }

        if ($.loaded_panels_count == options.panels_count) {
            $.loaded_panels_count = 0;
            $.increment_panel_count = false;
            if ($.keep_showing_full_page_loader == true) {
                leftNavigationModule.pinActionFlyout();
            }
            /**
             * call 'hideFullLoader' if it is still visible
             */
            // delay below function so that page is properly ready
             setTimeout(function() {
                 if ($("#full_page_loader").is(':visible')) {
                     $.keep_showing_full_page_loader = false;
                     hideFullLoader('full_page_loader');
                 }
             }, 0);
            // console.log('AllPanelsLoaded...');
        }
    }
    return new PageModule();

});
