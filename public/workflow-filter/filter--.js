/*------------------- 
File Name : "filter.js"
Description : Interface scripting and custom jquery
Author : Prospus Consulting Pvt. Ltd.
Website : http://prospus.com
Developer: Afroj Alam
--------------------*/
var $localFilters = {};
$(document).ready(function () {
    
    $('html').click(function(){
        if($('.parent-dropdown-menu').is(":visible")){
        $('.parent-dropdown-menu').hide();
        }
        
    });
    
    $("body").on("mouseleave",".multi-sub-menu",function(){
       $(this).hide();
    });
    
    $("body").on("mouseleave",".custom-filter-wrapper",function(){
       $(this).hide();
    });
    
    $("body").on("click",".parent-dropdown-menu",function(){
    event.stopPropagation();
    });
    
    $('body').on('click', '.dropdown > span', function (event) {
        var $this = $(this),
        clickedBtn = $this.data('filter'),
        mainBtnWrap = $this.parent('.dropdown'),
        menuBlock = $('.' + clickedBtn + '-filter.clone'),
        menuCount = mainBtnWrap.find('.multi-menu').length,
        fieldType = $this.data('field');
        mainBtnWrap.find('.title-loader').show();
        if (menuCount > 0 && mainBtnWrap.find('.multi-menu').is(':visible')) {
            mainBtnWrap.find('.multi-menu').hide();
        }
        else if (menuCount > 0  && mainBtnWrap.find('.multi-menu').is(':hidden')) {
            $('.parent-dropdown-menu').hide();
            mainBtnWrap.find('.title-filter').html('');
            mainBtnWrap.find('.multi-menu').show();
            // To get filter list
            var surveyId = $('.specifice-survey-breadcrumb').data('id');
            var userRole = $('.changed-user-role').data('roleid');
            
            var filterName = getActiveItemFilter();
            var req = {task:'getTitleFilterList', filterSection:'item', fieldType:fieldType, 
                surveyId:surveyId, userRoleId:userRole, filter:filterName};
            $.ajax({
                type:'POST',
                url:'ajaxhandler/filter-blocks-ajaxhandler.php',
                data:req,
                success:function(resp){
                    mainBtnWrap.find('.title-loader').hide();
                    mainBtnWrap.find('.title-filter').html(resp);   
                    
                    for(var mainKey in $localFilters){
                        // let the checkbox checked if previously checked                      
                            var mainKeys = $localFilters[mainKey];
                            for(var filterKey in mainKeys){
                                if(mainKey == fieldType){
                                    if(mainKeys[filterKey]['titleList'] != undefined && mainKeys[filterKey]['titleList'] != ''){
                                        for(var titleKey in mainKeys[filterKey]['titleList']){
                                            var selectedValue = mainKeys[filterKey]['titleList'][titleKey];
                                            mainBtnWrap.find('.title-list').each(function(){
                                                if(selectedValue == $(this).val()){
                                                    $(this).prop('checked', true);
                                                }
                                            })
                                        }
                                    }

                                    if(mainKeys[filterKey]['textSearch']){
                                        for(var titleKey in mainKeys[filterKey]['textSearch']){
                                            var selectedValue = mainKeys[filterKey]['textSearch'];
                                            mainBtnWrap.find('.title-list').each(function(){
                                                var getTitle  = $(this).closest("label").text().toUpperCase();
                                                if(getTitle.indexOf(selectedValue.toUpperCase())!=-1){
                                                    $(this).prop('checked', true);
                                                }
                                            })
                                        }
                                    }
                                }
                                
                                
                            }
                        
                    } 
                    
                    var selectAll = true;
                    mainBtnWrap.find('.title-list').each(function(){
                       if($(this).is(':checked') == false){
                           selectAll = false;
                       }            
                    });

                    if(selectAll == true){
                        mainBtnWrap.find('.select-all-list').prop('checked', true);
                    }
                }
            });
        }
        //if (menuCount == 0)
        else {
            mainBtnWrap.find('.multi-menu').remove();
            //menuBlock.clone().appendTo(mainBtnWrap).removeClass('clone').show();
            // To get filter list
            var surveyId = $('.specifice-survey-breadcrumb').data('id');
            var userRole = $('.changed-user-role').data('roleid');
            
            var filterName = getActiveItemFilter();
            var req = {task:'getFilterMenu', filterSection:'item', fieldType:fieldType, 
                surveyId:surveyId, userRoleId:userRole, filter:filterName};
            $.ajax({
                type:'POST',
                url:'ajaxhandler/filter-blocks-ajaxhandler.php',
                data:req,
                success:function(resp){
                    $('.parent-dropdown-menu').hide();
                   
                    mainBtnWrap.append(resp);
                    mainBtnWrap.find('.dropdown-menu.multi-menu').show();
                    // To get unique title list
                    var req = {task:'getTitleFilterList', filterSection:'item', fieldType:fieldType, 
                    surveyId:surveyId, userRoleId:userRole, filter:filterName};
                    $.ajax({
                        type:'POST',
                        url:'ajaxhandler/filter-blocks-ajaxhandler.php',
                        data:req,
                        success:function(resp){
                            mainBtnWrap.find('.title-loader').hide();
                            mainBtnWrap.find('.title-filter').html(resp);                            
                        }
                    });
                    
                }
            });
        }
        event.stopPropagation();
    });



    $('body').on('click', '.multi-menu > .filter-bottom .value-filter-cancel', function () {
        $(this).closest('.multi-menu').hide();
    });


    //---- To show inner options in check list
    $('body').on('click', '.check-list li span',
            function () {
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
    $('body').on('mouseenter', '.parent-item', function () {
        $(this).find('>.multi-sub-menu').fadeIn(200);
    });

    $('body').on('mouseenter', '.multi-menu li', function () {
        if (!$(this).hasClass('parent-item')) {
            $(this).siblings('.parent-item').find('.multi-sub-menu, .custom-filter-wrap').fadeOut(200);
        }
    });

    //---- To show custom filter
    $('body').on('click', '.parent-item li', function (e) {
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
                cfWrap.css({top: submenuH});
            }

            $('.custom-filter-wrap').fadeOut(300);

            cfWrap.fadeIn(200);
            e.stopPropagation();
        }
    });


    $('body').on('click', '.custom-filter-wrap .btn', function (e) {
        $(this).closest('.custom-filter-wrap').fadeOut(300);
        e.stopPropagation();
    });

    $('.dropdown-menu .check-list, .search-item-wrap, .parent-item').on('click', function (e) {
        e.stopPropagation();
    });


    $('body').on('click', '.select-all-list', function(){
        var $this = $(this),
        wrapper = $this.closest('.filter-titles');
        if($this.is(':checked')){
            wrapper.find('.title-list').prop('checked', true);
        }
        else{
            wrapper.find('.title-list').prop('checked', false);
        }
    });
    
    $('body').on('click', '.title-list', function(){
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
    
    $('body').on('click', '.sort-by', function(){
        var $this = $(this),
        currField = $this.data('field'),
        orderBy = $this.data('value'),
        section = $this.data('section');
        
        $this.closest('.dropdown-menu').find('.sort-by').removeClass('active');
        $this.addClass('active');
        
        if(section.toUpperCase() == 'ITEM'){
            if($localFilters[currField] == undefined){
                $localFilters[currField] = [];
            }
            
            // if currField is location then need to do other parentKey as empty
            if(currField == 'location'){
                $localFilters['category'] = [];
                $localFilters['status'] = [];
            }
            //To find and remove sortBy array key if exist
            for(var mainKey in $localFilters){
                var mainKeys = $localFilters[mainKey];
                for(var filterKey in mainKeys){
                    if(mainKeys[filterKey]['sortBy']){
                        mainKeys.splice(filterKey, 1); 
                    }
                }
            }
            
            $localFilters[currField].push({sortBy:orderBy});
            
            if(currField == 'location'){
                //$localFilters = {location : {sortBy:orderBy}};
            }
            var orderBy = currField +' '+ orderBy;
            $('.parent-dropdown-menu').hide();
            // To get active filter name
            var filterName = getActiveItemFilter();
            nextFn('getItemWithPagination', 1, 100, 'active', '', filterName, '');
            
        }
    });
    
    $('body').on('click', '.value-filter', function(){
        var $this = $(this),
        wrapper = $this.closest('.parent-dropdown-menu'),
        currField = wrapper.find('.sort-by').eq(0).data('field'),
        listIds = new Array(),
        listIdsArr = new Array;
        if($localFilters[currField] == undefined){
           $localFilters[currField] = [];
        }
        
            
        wrapper.find('.title-list').each(function(){
            if($(this).is(':checked', true)){
                //if($(this).val() > 0){
                   listIds.push($(this).val());
                //}    
            }
        });
        //console.log(listIds);
        //listIdsArr['titleList'] = {};
        //listIdsArr['titleList'] = listIds;
        listIdsArr = {titleList : listIds};
        
        //$localFilters.push(currField);
        // To find and remove titleList key if exist
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
        $localFilters[currField].push(listIdsArr);
                
        if(listIds.length > 0){    
            // if currField is location then need to do other parentKey as empty
            if(currField == 'location'){
                $localFilters['category'] = [];
                $localFilters['status'] = [];
                $localFilters['date'] = [];
            }
            if(currField == 'category'){
                $localFilters['status'] = [];
                $localFilters['date'] = [];
            }
            
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
            
            
            $('.parent-dropdown-menu').hide();
            // To get active filter name
            var filterName = getActiveItemFilter();
            nextFn('getItemWithPagination', 1, 100, 'active', '', filterName, '');
        }
            
        
    });
    
    $('body').on('keyup', '.sort-text-search', function(event){
        var $this = $(this),
        wrapper = $this.closest('.parent-dropdown-menu'),
        keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            wrapper.find('.search-text').click();
        }
    });
    
    $('body').on('click', '.search-text', function(){
        var $this = $(this),
        wrapper = $this.closest('.parent-dropdown-menu'),
        currField = wrapper.find('li').eq(0).data('field');
        
        if($localFilters[currField] == undefined){
            $localFilters[currField] = [];
        }
        
        var searchTxt = wrapper.find('.sort-text-search').val();
        wrapper.find('.sort-text-search').val('');
        
        // To push this search key into main sorting array
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
        $localFilters[currField].push({textSearch:searchTxt});
        
        var filterName = getActiveItemFilter();       
        if(searchTxt.trim() != ''){
            // If textSearch filter is choosed then need to empty titleList array
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
            
            // If textSearch filter is choosed then need to empty filterSort array
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
            
            // If textSearch filter is choosed then need to empty subFilter array
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
            
            // if currField is location then need to do other parentKey as empty
            if(currField == 'location'){
                $localFilters['category'] = [];
                $localFilters['status'] = [];
            }
            
            $(this).closest('.multi-menu').hide();
            nextFn('getItemWithPagination', 1, 100, 'active', '', filterName, '');
        }
        
        
    });
    
    $('body').on('click', '.text-sub-filter', function(){
        var $this  = $(this),
        filterOpt = $this.data('id'),
        wrapper = $this.closest('.multi-sub-menu');
        $('.text-sub-filter-opt option[value='+filterOpt+']').prop('selected', true);
        wrapper.find('.text-sub-filter').removeClass('active');
        $this.addClass('active');
    });
    
    $('body').on('click', '.sub-value-filter', function(){
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
            // if currField is location then need to do other parentKey as empty
            if(currField == 'location'){
                $localFilters['category'] = [];
                $localFilters['status'] = [];
            }
            
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
            
            $localFilters[currField].push({subFilter:opt});
            var filterName = getActiveItemFilter();
            $('.parent-dropdown-menu').hide();
            nextFn('getItemWithPagination', 1, 100, 'active', '', filterName, '');
        }
        
        
        
    });

});	
		
function getActiveItemFilter() {
    var filterName = 'all item';
    if ($('.workspace-menu li.active').hasClass('all-items')) {
        filterName = 'all item';
    }
    else if ($('.workspace-menu li.active').hasClass('unpublished-item')) {
        filterName = 'unpublished';
    }
    else if ($('.workspace-menu li.active').hasClass('published-item')) {
        filterName = 'published';
    }
    else {
        filterName = 'deleted';
    }
    return filterName;
}                

