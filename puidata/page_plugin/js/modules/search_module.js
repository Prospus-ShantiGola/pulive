define(function () {
    var properties = {
        searchItemWrap: '.search-item-wrap',
        searchTextboxJS: '.search-text-box-js',
        resetSearchTextboxJS: '.reset-search-text-box-js',
        searchTextbox: '#search-text-box',
        itemListLi: '.item-list li',
        activeItemListLi: '.item-list li.active',
        idDetailContent: '#id_detail_content',
        addEditPopup: '#add-edit-popup',
        addEditBtn: '#add-edit-btn',
        seacrchSubFilter: '.search-sub-filter',
        noPopup: '.no-popup',
        searchImg: '.search-img',
        crossImg: '.cross-img',
        leftMenuBar: '#leftMenuBar',
        dashboardJs: '.dashboardJs',
        menuItems: '.menu-items',
        dashboardMenuSection: 'dashboard_menu_section',
        cache: {},
        elementRef: {},
        in_progress: false
    }

    function _init() {

        var clickIcon = $(properties.searchTextboxJS);
        $(properties.searchItemWrap + ' ' + properties.searchTextbox).keyup(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                var searchWrapper = $(properties.searchItemWrap);
                var wrapper = searchWrapper.find(properties.searchTextboxJS);
                wrapper.removeClass(properties.resetSearchTextboxJS.replace('.', ''));
                clickIcon.trigger('click');
            }
        });
        clickIcon.off('click').on('click', function () {
            if(properties.in_progress) {
                return true;
            }
            properties.in_progress = true;
            setTimeout(function() {
                properties.in_progress = false;
            }, 200);
            var wrapper = $(this).closest('.jq_flyout_wrapper');
            if ($(this).hasClass(properties.resetSearchTextboxJS.replace('.', ''))) {
                if (getActiveLeftAction() == inboxMenuName) {
                    resetMenuAction();
                    return false;
                }
                resetSearchFilter();
                return false;
            }
            if ($.trim($('#leftMenuBar').find('.active').text()) == inboxMenuName) {
                searchString();
            } else if ($('#id_listing_body:visible').length) {
                if (checkAddEditForm(clickIcon)) {
                    searchString();
                }
            } else {
                var detailWrapper = $("#id_detail_content");
                if (htmlModule.checkFormState(detailWrapper.find('form:visible'))) {
                    var msg = 'Are you sure you want to continue?  Any unsaved data will be lost.';
                    searchModule.showPopup(clickIcon,msg);
                    return false;
                } else {
                    searchString();
                }
            }

        });


        removeSearchFilter();
    }
    function getActiveLeftAction() {
        return $.trim($(properties.leftMenuBar).find('.active').text());
    }
    function resetSearchFilter() {
        resetSearchImageAction();
        if($("#operation_list").length) {
            leftNavigationModule.resetIndexViewSearch();
            resetSearchInput();
        } else {
            clickActiveMenu();
        }
    }
    function resetMenuAction() {
        $(properties.menuItems).addClass(properties.dashboardMenuSection);
        resetSearchImageAction();
        resetSearchInput();
        appendMenuWrapper('');
    }
    function resetSearchImageAction() {
        var searchWrapper = $(properties.searchItemWrap);
        var wrapper = searchWrapper.find(properties.searchTextboxJS);
        wrapper.attr('data-original-title','Search');
        wrapper.removeClass(properties.resetSearchTextboxJS.replace('.', ''));
        wrapper.find(properties.crossImg).addClass('hide');
        wrapper.find(properties.searchImg).removeClass('hide');
        $('[data-toggle="tooltip"]' + properties.searchTextboxJS).tooltip('destroy');
    }
    function manageSearchImageAction() {
        var searchWrapper = $(properties.searchItemWrap);
        var wrapper = searchWrapper.find(properties.searchTextboxJS);
        wrapper.attr('data-original-title','Clear Search');
        wrapper.addClass(properties.resetSearchTextboxJS.replace('.', ''));
        wrapper.find(properties.searchImg).addClass('hide');
        wrapper.find(properties.crossImg).removeClass('hide');
        $('[data-toggle="tooltip"]' + properties.searchTextboxJS).tooltip('destroy');
    }
    function searchString(searchStr) {
        if (typeof resetHeadFilters === "function") {
            resetHeadFilters();
        }
        if($('a.collapseWithJS').length>0){
            if($('a.collapseWithJS').hasClass('collapsed')){
                $('a.collapseWithJS').addClass('collapsed');
                $('a.collapseWithJS').find('i.fa').click();
            }
        }
        var leftAction = getActiveLeftAction();
        searchWrapper = $(properties.searchItemWrap);
        if($.trim($('#leftMenuBar').find('.active').text()) == inboxMenuName) {
            searchWrapper = $("#j_my_search_exsiting_deal").find(properties.searchItemWrap);
        }
        var searchString = searchStr || $.trim(searchWrapper.find(properties.searchTextbox).val());
        var activeLi = $(properties.activeItemListLi);
        var propertyId = activeLi.data('statusid');
        var searchFilter = getActiveMenuValue();
        if (leftAction == inboxMenuName) {
            propertyId = 3287;
            searchFilter = 'all';
        }
        if (!searchString) {
            properties.cache = {};
            return false;
        }
        manageSearchImageAction();
        properties.cache.searchString = searchString;

        var isDeal = false, isDashboard = false, isOperation = false;


        if ($('#id_listing_body:visible').length || leftAction == inboxMenuName) {

            searchFilter = (searchFilter == 'all') ? '' : searchFilter;
            //Ajax Call
            // var url = base_plugin_url + 'code.php';
            var record_per_page = getRecordPerPageValue();
            curpage = 1
            var reqData = {
                'action': 'list_content',
                'list_head_array': list_head_array,
                'list_setting_array': list_setting_array,
                'list_node_id_array': list_node_id_array,
                'status': searchFilter,
                'propertyId': propertyId,
                'search_string': searchString,
                'record_per_page': record_per_page,
                'page': curpage,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'roleId': login_role_id
            };
            if (leftAction == inboxMenuName) {
                reqData['isDashboard'] = true;
                isDashboard = true;
                //$('#j_my_search_exsiting_deal_loader').removeClass('hide');
            } else {
                isDeal = true;
            }
        } else {
            searchFilter = (searchFilter == "") ? 'all' : searchFilter;
            var fieldname = '';
            if($.trim(searchFilter) == 'read-edit'){
                fieldname = 'All';
            }
            var deal_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
            var deal_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
            if(GoToPageModule.getSelectedRole(true) == 'super_admin'){
                var deal_user_role_id = searchFilter;
                var super_admin_confirmation = true;
            }else{
                var deal_user_role_id = login_role_id;
                var super_admin_confirmation = false;
            }

            var reqData = {
                'action': 'opreratinList',
                'status': searchFilter,
                'propertyId': propertyId,
                'search_string': searchString,
                'deal_node_instance_id': deal_instance_id,
                'deal_instance_node_id': deal_node_id,
                'deal_actor_role_node_id': deal_user_role_id,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'sadmin': super_admin_confirmation,
            };
            isOperation = true;

            reqData['fieldname'] = fieldname;

            if($("#operation_list").length) {
                reqData['indexing'] = 'indexing';
                var activeMenu = $("#menu_wraper").find('.sidebar_wrap').find('li.active:first');
                reqData['fieldname'] = activeMenu.find('.item-list-detail:first').text();
            }
        }
        var dataType = 'html';
        if (isOperation) {
            dataType = 'json';
        }
        require(['page_module'], function (PageModule) {
            var options = {
                data: reqData,
                success: function (d, s) {
                    if (isDeal) {
                        responseListContent(d, s);
                    } else if (isDashboard) {
                        responseDealSearch(d, s);
                    } else {
                        responseGetWorkSpacePage(d, s);
                    }
                },
                complete: function () {
                    if(isDashboard) {
                        hideFullLoader('j_my_search_exsiting_deal_loader');
                    } else {
                        hideFullLoader('listing_loader');
                    }
                },
                dataType: dataType
            };
            if(isDashboard) {
                options.loader_id = 'j_my_search_exsiting_deal_loader';
            }
            PageModule.loadMiddlePanel(options);
        });
    }
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function convertJsonToHTML(response) {
        if(IsJsonString(response)) {
            return prepareResult(response);
        }
        return response;
    }

    function prepareResult(response) {
        var columnOrder = ['customer', 'customer_#', 'location', 'stock_#', 'status', 'estimated_closing_date']; // show result in this order
        var json_str = JSON.parse(response);
        var output = $('<div />').addClass('listing-table-body scroll-wrap menu-WinHT customScroll');
        var list = json_str.data;
        if($.trim(json_str.msg).length) {
            output.append($('<div />').addClass('noEntry').text(json_str.msg));
        } else {
            for(var key in list) {
                var items = list[key];
                var row = $('<div />').addClass('row');
                for(var inner_key in items) {
                    var value = items[inner_key];
                    if(!value) value = '';
                    row.append($('<div />').addClass('col-sm-2').html(value));
                }
                output.append(row);
            }
        }
        return output;
    }

    function responseDealSearch(d, s) {
        var response = d;
        d = convertJsonToHTML(d);
        appendMenuWrapper(d);
        appendHeader(response);
        applyJs();
        addHighlight($("#j_my_search_exsiting_deal").find('.dashboardJs'));
    }
    function appendHeader(response) {
        if(IsJsonString(response)) {
            var json_str = JSON.parse(response);
            if(json_str.header) {
                var resultWrapper = $(properties.menuItems).find(properties.dashboardJs);
                resultWrapper.parent().find('.listing-table-head').remove();
                var headerWrapper = $('<div />').addClass('listing-table-head').append($('<div />').addClass('row'));
                var header = json_str.header;
                for(key in header) {
                    var className = 'col-sm-2';
                    var columnLabel = header[key]['name'];
                    var column = $('<div />').addClass(className).append($('<span />').addClass('listing-title').text(columnLabel));
                    headerWrapper.find('.row').append(column);
                }
                headerWrapper.insertBefore(resultWrapper);
            }
        }

    }

    function appendMenuWrapper(html) {
        var wrapper = $(properties.menuItems);
        wrapper.find(properties.dashboardJs).html(html);
    }
    function appendSearchFilter(element) {
        element = $(element+':first');
        if (properties.cache.searchString) {
            var serachCount = properties.cache.searchCount;
            removeSearchFilter();
            var serachSpan = '<li class="search-sub-filter search-before active"><a href="#"><i class="prs-icon search left"></i>' + ellipsisText(properties.cache.searchString, 10) + '<span class="badge">' + serachCount + '</span></a></li>';
            element.after(serachSpan);
            element.find('.search-sub-filter').addClass('active');
        }
    }
    function ellipsisText(text, length) {
        text = text ? text : '';
        var allowed_length = length || 10;
        var text_len = text.length;
        return (text_len > allowed_length) ? text.substr(0, allowed_length) + '...' : text;
    }
    function removeSearchFilter() {
        $(properties.seacrchSubFilter).remove();
    }
    function getActiveMenu() {
        var activeLi = $(properties.activeItemListLi);
        if (activeLi.length) {
            var searchFilter = $.trim(activeLi.find('.item-list-detail').text()).toLowerCase();
            return (searchFilter == 'all') ? '' : searchFilter;
        }
        return '';
    }
    function getActiveMenuDataId() {
        return $(properties.activeItemListLi).data('statusid');
    }
    function getActiveMenuValue() {
        var ele = $(properties.activeItemListLi);
        var title = ele.find('[data-title]').data('title');
        if(!title) {
            // for "Status" and "Store" menus, data-title attr does not have any value. In this case, use span text as title
            title = ele.find('.item-list-detail').text();
        }
        return title;
    }
    function getActiveManuId() {
        return $(properties.activeItemListLi).attr('id');
    }
    function clearCache() {
        if (!(key in properties.cache.searchString)) {
            properties.cache = {};
        }
    }
    function clickActiveMenu() {

        $(properties.activeItemListLi).first().find('> a').trigger('click');

    }
    function resetSearchInput() {
        var listId = $("#id_listing_body");
        if ($("#id_listing_body:visible").length == 0) {
            listId = $('#id_listing_operation');
        }
        resetSearchImageAction();
        removeHighlight(listId);
        properties.cache = {};
        removeSearchFilter();
        $(properties.searchItemWrap + ' ' + properties.searchTextbox).val('');
    }
    function checkAddEditForm(obj) {
        if ($(properties.idDetailContent).find('form:visible:not(".no-popup")').length) {
            showPopup(obj);
            return false;
        }
        return true;
    }
    function showPopup(obj,msg) {
        var msg = msg || 'Are you sure you want to cancel?';
        $(properties.addEditPopup + ' ' + properties.addEditBtn).data('clickclass', obj);
        $(properties.addEditPopup).find('.modal-body').find('p').html(msg);
        $(properties.addEditPopup).modal('show');
    }
    function addHighlight(obj) {
        var group_active = obj.find('.collapse.in').length ? obj.find('.collapse.in') : obj;
        if(properties.cache.searchString && group_active.find('.no-record-list').length == 0) {
            group_active.highlight(properties.cache.searchString);
        }
    }
    function removeHighlight(obj) {
        if (properties.cache.searchString && obj.find('.no-record-list').length == 0) {
            obj.removeHighlight(properties.cache.searchString);
        }
    }
    function getSearchString() {
        if (properties.cache.searchString) {
            return properties.cache.searchString;
        }
        return '';
    }

    // _init();
    return{
        properties: properties,
        searchString: searchString,
        resetSearchInput: resetSearchInput,
        clearCache: clearCache,
        checkAddEditForm: checkAddEditForm,
        addHighlight: addHighlight,
        getActiveMenu: getActiveMenu,
        getSearchString: getSearchString,
        appendSearchFilter: appendSearchFilter,
        removeSearchFilter: removeSearchFilter,
        getActiveMenuDataId: getActiveMenuDataId,
        getActiveMenuValue: getActiveMenuValue,
        getActiveManuId: getActiveManuId,
        _init: _init,
        showPopup: showPopup,
        resetMenuAction: resetMenuAction,
        IsJsonString: IsJsonString
    }
});
