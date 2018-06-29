/*------------------- 
File Name : "filter.js"
Description : Interface scripting and custom jquery
Author : Prospus Consulting Pvt. Ltd.
Website : http://prospus.com
--------------------*/
//var $localFilters = {};

var filterModule = (function() {
    var sections = {
        survey_item: 'getItemWithPagination',
        share_item: 'getShareItemWithPagination'
    };
    var options = {};
    var order_text = {
        'num': {'asc': 'Sort smallest to largest', 'desc': 'Sort largest to smallest'},
        'date': {'asc': 'Sort oldest to newest', 'desc': 'Sort newest to oldest'},
    };

    var getRoleId = function() {
        return $('.changed-user-role').data('roleid');
    };
    var getSurveyId = function() {
        return $('.specifice-survey-breadcrumb').data('id');
    }

    function getFilterContainerParams( clicked_element ) {
        return clicked_element.closest('.filter-container').data('filterParams');
    }
    var fetchFilterList = function(mainBtnWrap, clicked_element, req) {
        
        var filterContainerParams = getFilterContainerParams(clicked_element);
        
        var fieldType = clicked_element.data('field');
        var surveyId = $('.specifice-survey-breadcrumb').data('id');
        var userRole = filterModule.getRoleId();
        var filterName = getActiveItemFilter();

        var data = {                
            fieldType:fieldType, surveyId:surveyId, 
            userRoleId:filterModule.getRoleId(), filter:filterName,
            task: 'getTitleFilterList', filterSection: filterContainerParams.filterSection
        };

        var buttonSettings = {};
        if(clicked_element.data('filterParams')) {
            buttonSettings = clicked_element.data('filterParams');            
        } else if(clicked_element.attr('data-filter')) {
            buttonSettings = {
                filter: clicked_element.attr('data-filter'),
                field: clicked_element.attr('data-field')
            };
        }
        
        
        $('.parent-dropdown-menu').hide();        
        
        if(buttonSettings.filter == 'num' || buttonSettings.filter == 'date') {
            mainBtnWrap.find('.sort-by[data-value="ASC"]').text(filterModule.order_text[buttonSettings.filter].asc);
            mainBtnWrap.find('.sort-by[data-value="DESC"]').text(filterModule.order_text[buttonSettings.filter].desc);
        }

        var fieldTitle = clicked_element.closest('.dropdown').find('.fieldTitle').text();
        mainBtnWrap.find('.clear-filter').text("Clear Filter From '"+fieldTitle.toUpperCase().trim()+"'");
        
        mainBtnWrap.find('.dropdown-menu.multi-menu').show();        

        var callback = function(resp) {
            mainBtnWrap.find('.title-loader').hide();
            mainBtnWrap.find('.title-filter').html(resp);
            
            for(var mainKey in $localFilters) {
                // let the checkbox checked if previously checked                      
                var mainKeys = $localFilters[mainKey];
                for(var filterKey in mainKeys){
                    if(mainKey == buttonSettings.field) {
                        if(mainKeys[filterKey]['titleList'] != undefined && mainKeys[filterKey]['titleList'] != ''){
                            mainBtnWrap.find('.title-list').prop('checked', false);
                            for(var titleKey in mainKeys[filterKey]['titleList']){
                                var selectedValue = mainKeys[filterKey]['titleList'][titleKey];
                                mainBtnWrap.find('.title-list').each(function(){
                                    if(selectedValue == $(this).val()){
                                        $(this).prop('checked', true);
                                    }                                                      
                                });
                            }
                        }

                        if(mainKeys[filterKey]['textSearch']){
                            mainBtnWrap.find('.title-list').prop('checked', false);
                            for(var titleKey in mainKeys[filterKey]['textSearch']){
                                var selectedValue = mainKeys[filterKey]['textSearch'];
                                mainBtnWrap.find('.title-list').each(function(){
                                    var getTitle  = $(this).closest("label").text().toUpperCase();
                                    if(getTitle.indexOf(selectedValue.toUpperCase())!=-1){
                                        $(this).prop('checked', true);
                                    }                                        
                                });
                            }
                        }
                    }
                }
            }
            var selectAll = true;
            mainBtnWrap.find('.title-list').each(function() {
                if($(this).is(':checked') == false){
                    selectAll = false;
                }            
            });

            if(selectAll == true){
                mainBtnWrap.find('.select-all-list').prop('checked', true);
            }
        };
        var callback_fun = {
            success: callback
        };
        commonAjaxCall('ajaxhandler/filter-blocks-ajaxhandler.php', data, {}, callback_fun);            
    }

    var loadFilterTmpl = function(mainBtnWrap, clicked_element, req) {        
        var hasDataFilter = false, dataFilterParams = {};
        
        if(clicked_element.attr('data-filter-params')) {
            dataFilterParams = clicked_element.data('filterParams');
            hasDataFilter = true;
        } else if(clicked_element.attr('data-filter')) {
            hasDataFilter = true;
            dataFilterParams = {
                section: clicked_element.attr('data-filter'),
                field: clicked_element.attr('data-field')
            };
        }        
        
        if(!hasDataFilter) {
            console.log("Can not show filter drop. 'data-filter-params' attribute is missing.");
            return true;
        }
        
        mainBtnWrap.find('.multi-menu').remove();
        mainBtnWrap.find('.sort-text-search').val('');
        
        // To get filter list
        var surveyId = $('.specifice-survey-breadcrumb').data('id');
        var userRole = getRoleId();
        
        var filterName = getActiveItemFilter();
        var textFilterTmpl = $.templates("#textFilterTmpl");        

        mainBtnWrap.append(textFilterTmpl);

        mainBtnWrap.find('.js-filter-item')
            .attr('data-section', dataFilterParams.section)
            .attr('data-field', dataFilterParams.field);

        fetchFilterList(mainBtnWrap, clicked_element);

        // $.ajax({
        //     type:'POST',
        //     url:'ajaxhandler/filter-blocks-ajaxhandler.php',
        //     data:req,
        //     success:function(resp) {
        //         mainBtnWrap.append(resp);
        //         fetchFilterList(mainBtnWrap, clicked_element);
        //     }
        // });
    };

    var sortBy = function(clicked_element) {

        var currField = clicked_element.data('field'),
        orderBy = clicked_element.data('value'),
        section = clicked_element.data('section');
        
        clicked_element.closest('.dropdown-menu').find('.sort-by').removeClass('active');
        clicked_element.addClass('active');
        
        var filterContainerParams = filterModule.getFilterContainerParams(clicked_element);
        
        // if "filterContainerParams.filterSection" index does not exist then create this index
        
        if(!(filterContainerParams.filterSection in $localFilters)) {            
            $localFilters[filterContainerParams.filterSection] = {};
        }
        
        $localFilters[filterContainerParams.filterSection] = clearFilter2(clicked_element, $localFilters[filterContainerParams.filterSection]);
        

        // To find and remove titleList key if exist
        var resetKeyArr = ['sortBy'];
        filterModule.resetFilterByKey(currField, resetKeyArr, $localFilters[filterContainerParams.filterSection]);
        
        //var orderBy = currField +' '+ orderBy; // as_done
        var orderBy =  orderBy;

        $localFilters[filterContainerParams.filterSection][currField].push({sortBy:orderBy});            

        filterModule.fetchRecordWithPagination();
        
    };

    
    var clearFilter2 = function(clicked_element, filter_options) {
        
        var currField = clicked_element.data('field');
        var filterFieldItemElements = clicked_element.closest('.tr-item-header').find('.fieldTitle');
        var currentFilterFieldItemElement = clicked_element.closest('.filter-btn-text').find('.fieldTitle');
        var indexOfClickedFilterItemElement = filterFieldItemElements.index(currentFilterFieldItemElement);
        if(indexOfClickedFilterItemElement > -1) {
            filterFieldItemElements.splice(0, indexOfClickedFilterItemElement + 1);            
        } 

        if(filter_options[currField] == undefined) {
            filter_options[currField] = [];
        }

        filterFieldItemElements.each(function() {
            var filterElement = $(this); 
            var field = filterElement.attr('data-field');
            var dropdownMenu = filterElement.closest('.dropdown').find('.dropdown-menu');
            filter_options[field] = [];

            filterElement.find('.unsort-filter').removeClass('hide');
            filterElement.find('.sort-filter').addClass('hide');
            dropdownMenu.find('.clear-filter').addClass('inactive');
        });
        return filter_options;
    };

    var fetchRecordWithPagination = function() {
        
        $('.parent-dropdown-menu').hide();
        // To get active filter name
        var mainMenuWrap = $('.menu-main-wrap');
        var menuWrapper = mainMenuWrap.find('.menu-wrapper:visible');

        var panelDefault = menuWrapper.find('.panel-default:visible').not(':first');

        var activeElement = panelDefault.find('li.active');
        
        // to minimize lots of changes at php end, trigget('click') is being used
        if(activeElement.length) {            
            activeElement.find('a').trigger('click');
        } else if(menuWrapper.find('li.active:visible').length) {
            activeElement = menuWrapper.find('li.active:visible');
            if(activeElement.hasClass('share-item')) {
                nextFn('getShareItemWithPagination', 1, 100, 'active', '', 'share-item', '');
            } else if(activeElement.hasClass('get-general-survey')) {
                activeElement.find('a').trigger('click');
            } else {
                activeElement.find('a').trigger('click');
            }
        }
    };
    
    var resetFilterByKey = function( currField, reset_key_arr, data_object ) {
        
        for(var mainKey in data_object) {
            var mainKeys = data_object[mainKey];
            for(var filterKey in mainKeys) {
                if(mainKey == currField) {
                    
                    var key_found = false;
                    for(var i = 0; i < reset_key_arr.length; i++) {
                        if(mainKeys[filterKey][reset_key_arr[i]]) {
                            key_found = true;
                        }    
                    }
                    
                    if(key_found) {
                        mainKeys.splice(filterKey, 1); 
                    }
                }
            }
        }
        
    };
    return {
        order_text: order_text,
        getRoleId: getRoleId,
        loadFilterTmpl: loadFilterTmpl,
        fetchFilterList: fetchFilterList,
        sortBy: sortBy,
        clearFilter2: clearFilter2,
        fetchRecordWithPagination: fetchRecordWithPagination,
        resetFilterByKey: resetFilterByKey,
        getFilterContainerParams: getFilterContainerParams
    };
}());


$(document).ready(function () {
    var bodyEle = $('body');

    $('html').click(function(){
        if($('.parent-dropdown-menu').is(":visible")){
            $('.parent-dropdown-menu').hide();
        }        
    });
    
    bodyEle.on("mouseleave",".multi-sub-menu",function(){
       $(this).hide();
    });
    
    bodyEle.on("mouseleave",".custom-filter-wrapper",function(){
       $(this).hide();
    });
    
    bodyEle.on("click",".parent-dropdown-menu",function(event) {
        event.stopPropagation();
    });

    bodyEle.on('click', '.dropdown > span', function (event) {
        
        //console.log('Filter drop is commented.');
       // return false;
        
        var _this = $(this);
        var filterContainerParams = filterModule.getFilterContainerParams(_this);
        var fieldType = _this.data('field');
        var surveyId = $('.specifice-survey-breadcrumb').data('id');
        var userRole = filterModule.getRoleId();
        var filterName = getActiveItemFilter();

        var data = {                
            fieldType:fieldType, surveyId:surveyId, 
            userRoleId:filterModule.getRoleId(), filter:filterName,
            task: 'getTitleFilterList', filterSection: filterContainerParams.filterSection
        };

        var mainBtnWrap = _this.parent('.dropdown');        
        var menuCount = mainBtnWrap.find('.multi-menu').length;
	    
	    // to check if edit or add form is opened then need to show alert popup
        if( $('.edit-form-data').is(':visible') || $('table .clone').length > 0) {
                event.stopPropagation();
                var $obj = $(".userrole-cancel-confirm");
                //var $obj = '';
                $('#exit-confirmation').modal('show');
                $('#exit-confirmation').data('clickclass', $obj);
                return false;
        }       
        
        mainBtnWrap.find('.title-filter').html(' ');
        mainBtnWrap.find('.title-loader').show();
        
        if (menuCount > 0 && mainBtnWrap.find('.multi-menu').is(':visible')) {
            mainBtnWrap.find('.multi-menu').hide();
        }
        else if (menuCount > 0  && mainBtnWrap.find('.multi-menu').is(':hidden')) {

            // To get unique title list
            
            filterModule.fetchFilterList(mainBtnWrap, $(this), data);
        }        
        else {

            data.task = 'getFilterMenu';            
            filterModule.loadFilterTmpl(mainBtnWrap, $(this), data);
        }
        event.stopPropagation();
        
    });



    bodyEle.on('click', '.multi-menu > .filter-bottom .value-filter-cancel', function () {
        $(this).closest('.multi-menu').hide();
    });


    //---- To show inner options in check list
    bodyEle.on('click', '.check-list li span', function () {
            $(this).siblings('.check-list').toggleClass('hide');
            if ($(this).children('i').hasClass('fa-plus')) {
                $(this).children('i').removeClass('fa-plus').addClass('fa-minus');
            }
            else {
                $(this).children('i').addClass('fa-plus').removeClass('fa-minus');
            }
        }
    );


    //---- Table Filter Dropdowns	
    bodyEle.on('mouseenter', '.parent-item', function () {
        $(this).find('>.multi-sub-menu').fadeIn(200);
    });

    bodyEle.on('mouseenter', '.multi-menu li', function () {
        if (!$(this).hasClass('parent-item')) {
            $(this).siblings('.parent-item').find('.multi-sub-menu, .custom-filter-wrap').fadeOut(200);
        }
    });

    //---- To show custom filter
    bodyEle.on('click', '.parent-item li', function (e) {
        var submenuH = $(this).closest('.multi-sub-menu').outerHeight();
        cfWrap = $(this).closest('.multi-sub-menu').siblings('.custom-filter-wrap');
        cfHeight = cfWrap.outerHeight();
        cfTop = cfWrap.offset().top; // offset is not working properly yet
        winHeight = $(window).height();
        offHeight = winHeight - (cfHeight + cfTop);

        //console.log(cfHeight, cfTop, 'winH', winHeight, offHeight);
        if ($(this).hasClass('parent-item')) {
            cfWrap.hide();
        }
        else {
            if (offHeight < 0) {
                //console.log(offHeight);
                cfWrap.css({top: submenuH + offHeight});
            }
            else {
                //console.log('else');
                cfWrap.css({top: (submenuH-6)});
            }

            $('.custom-filter-wrap').fadeOut(300);

            cfWrap.fadeIn(200);
            e.stopPropagation();
        }
    });


    bodyEle.on('click', '.custom-filter-wrap .btn', function (e) {
        $(this).closest('.custom-filter-wrap').fadeOut(300);
        e.stopPropagation();
    });

    $('.dropdown-menu .check-list, .search-item-wrap, .parent-item').on('click', function (e) {
        e.stopPropagation();
    });


    bodyEle.on('click', '.select-all-list', function(){
        var $this = $(this),
        wrapper = $this.closest('.filter-titles');
        if($this.is(':checked')){
            wrapper.find('.title-list').prop('checked', true);
        }
        else{
            wrapper.find('.title-list').prop('checked', false);
        }
    });
    
    bodyEle.on('click', '.title-list', function(){
        var $this = $(this),
        wrapper = $this.closest('.filter-titles');
        // if any uncheck then do uncheck select all option
        if($this.is(':checked') == false){
            wrapper.find('.select-all-list').prop('checked', false);
        }
        
        // to do check if all titles are checked
        var selectAll = true;
        wrapper.find('.title-list').each(function(){
           if($(this).is(':checked') == false){
               selectAll = false;
           }            
        });
        
        if(selectAll == true){
            wrapper.find('.select-all-list').prop('checked', true);
        }
        
    });
    
    bodyEle.on('click', '.sort-by', function(){
        filterModule.sortBy($(this));
    });
    
    bodyEle.on('click', '.value-filter', function() {
        
        var filterContainerParams = filterModule.getFilterContainerParams($(this));
        
        // if "filterContainerParams.filterSection" index does not exist then create this index
        
        if(!(filterContainerParams.filterSection in $localFilters)) {            
            $localFilters[filterContainerParams.filterSection] = {};
        }
            
        
        var $this = $(this), filterOptions = $localFilters[filterContainerParams.filterSection]
        wrapper = $this.closest('.parent-dropdown-menu'),
        currField = wrapper.find('.sort-by').eq(0).data('field'),
        listIds = new Array(),
        listIdsArr = new Array;
        
        if(filterOptions[currField] == undefined) {
           filterOptions[currField] = [];
        }       
            
        wrapper.find('.title-list').each(function(){
            if($(this).is(':checked', true)) {        
               listIds.push($(this).val());        
            }
        });
        
        listIdsArr = {titleList : listIds};
                
        // To find and remove titleList key if exist
        var resetKeyArr = ['titleList','filterSort', 'subFilter', 'textSearch'];
        filterModule.resetFilterByKey(currField, resetKeyArr, filterOptions);
        
        filterOptions[currField].push(listIdsArr);
                
        if(listIds.length > 0) {
            // To change the sort icon on parent heading
            wrapper.closest('.dropdown').find('.unsort-filter').addClass('hide');
            wrapper.closest('.dropdown').find('.sort-filter').removeClass('hide');
            //To enable clear filter option
            wrapper.find('.clear-filter').removeClass('inactive');
                        
            $localFilters[filterContainerParams.filterSection] = filterModule.clearFilter2($(this), $localFilters[filterContainerParams.filterSection]);
            filterModule.fetchRecordWithPagination();
        }
    });
    
    bodyEle.on('keyup', '.sort-text-search', function(event) {
        
        var $this = $(this),
        wrapper = $this.closest('.parent-dropdown-menu'),
        keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            wrapper.find('.search-text').click();
        }
        
    });
    
    bodyEle.on('click', '.search-text', function() {
        
        var filterContainerParams = filterModule.getFilterContainerParams($(this));
        
        // if "filterContainerParams.filterSection" index does not exist then create this index        
        if(!(filterContainerParams.filterSection in $localFilters)) {            
            $localFilters[filterContainerParams.filterSection] = {};
        }
            
        
        var filterOptions = $localFilters[filterContainerParams.filterSection];
        
        var $this = $(this),
        wrapper = $this.closest('.parent-dropdown-menu'),
        currField = wrapper.find('li').eq(0).data('field');
        
        if(filterOptions[currField] == undefined){
            filterOptions[currField] = [];
        }
        
        var searchTxt = wrapper.find('.sort-text-search').val();
        wrapper.find('.sort-text-search').val('');
        
        // To push this search key into main sorting array
        var resetKeyArr = ['textSearch'];
        filterModule.resetFilterByKey(currField, resetKeyArr, filterOptions);
        
        filterOptions[currField].push({textSearch:searchTxt});
        
        var filterName = getActiveItemFilter();       
        if(searchTxt.trim() != '') {
            // To change the sort icon on parent heading
            wrapper.closest('.dropdown').find('.unsort-filter').addClass('hide');
            wrapper.closest('.dropdown').find('.sort-filter').removeClass('hide');
            //To enable clear filter option
            wrapper.find('.clear-filter').removeClass('inactive');
            
            var resetKeyArr = ['titleList','filterSort', 'subFilter'];
            filterModule.resetFilterByKey(currField, resetKeyArr, filterOptions);           

//            filterModule.clearFilter2($this);
            $localFilters[filterContainerParams.filterSection] = filterModule.clearFilter2($this, $localFilters[filterContainerParams.filterSection]);
            
            $(this).closest('.multi-menu').hide();
            filterModule.fetchRecordWithPagination();
        }
    });
    
    bodyEle.on('click', '.text-sub-filter', function(){
        var $this  = $(this),
        filterOpt = $this.data('id'),
        wrapper = $this.closest('.multi-sub-menu'),
        mainWrapper = $this.closest('.parent-dropdown-menu');
        
        $('.text-sub-filter-opt option[value='+filterOpt+']').prop('selected', true);
        wrapper.find('.text-sub-filter').removeClass('active');
        
        // to empty sub-search field
        mainWrapper.find('.text-sub-filter-sub-text').val('');
        mainWrapper.find('.text-sub-filter-sub-cond-text').val('');
        mainWrapper.find('.text-sub-filter-opt-cond[value="and"]').prop('checked', true);
        mainWrapper.find('.text-sub-filter-sub-opt option[value=""]').attr('selected', 'selected');
        
        $this.addClass('active');
    });
    
    bodyEle.on('click', '.sub-value-filter', function() {
        
        var $this = $(this),
        wrapper = $this.closest('.custom-filter-wrap'),
        currField = $this.closest('.parent-dropdown-menu').find('li').eq(0).data('field'),
       
        optText = wrapper.find('.text-sub-filter-opt').val(),
        optVal = wrapper.find('.text-sub-filter-sub-text').val().trim(),
        optCond = wrapper.find('.text-sub-filter-opt-cond:checked').val(),
        subOpt = wrapper.find('.text-sub-filter-sub-opt').val(),
        subOptVal = wrapper.find('.text-sub-filter-sub-cond-text').val().trim();
               
        var opt = new Array();
        if(optVal != ''){
            opt.push({opt:optText, optVal:optVal});
        }
        if(subOptVal != '' && subOpt != ''){
            opt.push({optCond:optCond, subOpt:subOpt, subOptVal:subOptVal});
        }
        
        
        if($localFilters[currField] == undefined){
            $localFilters[currField] = [];
        }
        
        // To generate this search key in main sorting array
        for(var mainKey in $localFilters){
            var mainKeys = $localFilters[mainKey];
            for(var filterKey in mainKeys){
                if(mainKey == currField){
                    if(mainKeys[filterKey]['subFilter']){
                        mainKeys.splice(filterKey, 1); 
                    }
                }
            }
        }
        if(opt.length > 0){
            // To change the sort icon on parent heading
            wrapper.closest('.dropdown').find('.unsort-filter').addClass('hide');
            wrapper.closest('.dropdown').find('.sort-filter').removeClass('hide');
            //To enable clear filter option
            wrapper.closest('.dropdown').find('.clear-filter').removeClass('inactive');
            
            // if currField is id then need to do other parentKey as empty
            filterModule.clearFilter2($this);   
            
            // If titleList filter is choosed then need to empty filterSort array
            for(var mainKey in $localFilters){
                var mainKeys = $localFilters[mainKey];
                for(var filterKey in mainKeys){
                    if(mainKey == currField){
                        if(mainKeys[filterKey]['filterSort']){
                            mainKeys.splice(filterKey, 1); 
                        }
                    }                    
                }
            }
            
            // If titleList filter is choosed then need to empty subFilter array
            // To uncheck title filter if checked
            $this.closest('.parent-dropdown-menu').find('.title-list, .select-all-list').prop('checked', false);
            
            for(var mainKey in $localFilters){
                var mainKeys = $localFilters[mainKey];
                for(var filterKey in mainKeys){
                    
                    if(mainKey == currField){
                        if(mainKeys[filterKey]['titleList']){
                            mainKeys.splice(filterKey, 1); 
                        }
                    }                   
                }
            }
            
            // To empty if any textSearch is performed
            for(var mainKey in $localFilters){
                var mainKeys = $localFilters[mainKey];
                for(var filterKey in mainKeys){
                    
                    if(mainKey == currField){
                        if(mainKeys[filterKey]['textSearch']){
                            mainKeys.splice(filterKey, 1); 
                        }
                    }                   
                }
            }
            
            $localFilters[currField].push({subFilter:opt});
            var filterName = getActiveItemFilter();
            $('.parent-dropdown-menu').hide();
            filterModule.fetchRecordWithPagination();            
        }
        
    });
    
    bodyEle.on('click', '.clear-filter', function() {
        
        var filterContainerParams = filterModule.getFilterContainerParams($(this));
        
        // if "filterContainerParams.filterSection" index does not exist then create this index        
        if(!(filterContainerParams.filterSection in $localFilters)) {            
            $localFilters[filterContainerParams.filterSection] = {};
        }        
        
        var $this = $(this),
        mainBtnWrap = $this.closest('.dropdown'),
        currField = mainBtnWrap.find('.fieldTitle').data('field'),
        filterName = getActiveItemFilter(); 
        if($this.hasClass('inactive')){
            return false;
        }        
        
        if($localFilters[filterContainerParams.filterSection][currField] != undefined) {
            $localFilters[filterContainerParams.filterSection][currField] = [];
        }
        // To inactive current clear-filter
        $this.addClass('inactive');
        mainBtnWrap.find('.unsort-filter').removeClass('hide');
        mainBtnWrap.find('.sort-filter').addClass('hide');
        $('.parent-dropdown-menu').hide();
        // To reset current filter
        $.ajax({
            type:'POST',
            url:'ajaxhandler/item-ajaxhandler.php',
            data:{task:'resetSearchValue', fieldName:currField},
            success:function(resp) {
                filterModule.fetchRecordWithPagination();
            }
        });
        
    });

});	

function getActiveItemFilter2() {
    var dataParams = {};
    var menuItemEle = $('.menu-items:visible');

    if(menuItemEle.find('.filter-list-wrap li.active').hasClass('share-item')) {
        dataParams.filterName = 'share_item';
    }
    else if (menuItemEle.find('.workspace-menu li.active')) {
        dataParams = menuItemEle.find('.workspace-menu li.active').find('a').data('params');
    }
    return dataParams;
}

function getActiveItemFilter() {
    
    var filterName = 'all item';
    if($('.filter-list-wrap li.active').hasClass('share-item')){
        filterName = 'share_item';
    }
    else if ($('.workspace-menu li.active').hasClass('all-items')) {
        filterName = 'all item';
    }
    else if ($('.workspace-menu li.active').hasClass('unpublished-item')) {
        filterName = 'unpublished';
    }
    else if ($('.workspace-menu li.active').hasClass('published-item')) {
        filterName = 'published';
    }
	else if ($('.workspace-menu li.active').hasClass('closed-item')) {
        filterName = 'closed';
    }
    else if ($('.menu-main-wrap').find('.menu-wrapper:visible').find('li.active').hasClass('get-general-survey')) {
        filterName = 'all';
    }
    else {
        filterName = 'deleted';
    }
    return filterName;
}

function clearFilter(fieldTitleArray) {

    for(var i=0; i < fieldTitleArray.length; i++) {
        $('.dropdown .fieldTitle[data-field="'+fieldTitleArray[i]+'"]').find('.unsort-filter').removeClass('hide');
        $('.dropdown .fieldTitle[data-field="'+fieldTitleArray[i]+'"]').find('.sort-filter').addClass('hide');
        $('.fieldTitle[data-field="'+fieldTitleArray[i]+'"]').closest('.dropdown').find('.clear-filter').addClass('inactive');
    }
}

