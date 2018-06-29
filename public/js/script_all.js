var initalNodeType              = 1;
var hitName                     = '';
var hitByIns                    = false;
var loadDataNewIns              = '';
var globalDocumentSaveStatus    = 0;
var globalTitle                 = "";
var PrevFirst                   = 0;
var PrevLast                    = 0;
var LastClick                   = "";
var lastCTRLclick               = ""
var FolderListarr               = [];
var allInvalidFileCount         = 0;
var documentrowCount            = 0;
var documentcount               = 0;
var completestatusCount         = 0;

//var globalFolderInstanceID      = 0; //Added by Divya Rajput on date 21st April 2016
var globalFolderInstanceID      = $("#FolderList").find('li.active').find('span').attr('data-id'); //Modified by Divya Rajput on date 26th April 2016
var parentFolderInstanceID      = $("#FolderList").find('li.active').closest('.move-parent-folder').attr('id'); //Added by Divya Rajput on date 26th April 2016
/*when first time, we will go on editor page, it will be 0. after saving doc it will be 1.*/
var enableDisablestatus         = 0; //Added by Divya Rajput on date 1st July 2016



$( document ).ready(function() {

    $("#course_action_menu").show();

    $('body').on('click', '.sub-filter', function(){
        $("#filter_operator").attr('value',$(this).attr('data-id'));
        $("#filter_type").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field").attr('value',$(this).attr('data-filter-field'));
    });

    $('body').on('click', '.email_row', function(){
        var email_node_id = $(this).attr('data-id');
        //$(".email_row").removeClass('current');
        //$(".email_row_"+email_row).addClass('current');
        $.post(domainUrl+$("#tempControler").val()+'/detail',{'email_node_id':email_node_id},function(data) {
                $(".email_detail_container").html(data);
            },'html');
    });

    $('body').on('click', '.sub-filter-type', function(){
        $("#filter_operator").attr('value',$(this).attr('data-id'));
        $("#filter_type").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field").attr('value',$(this).attr('data-filter-field'));


        if($(this).attr('data-id') == 'all')
        {
            var filter_operator =   'not_equal';
            var search_text     =   'A';
        }
        else
        {
            var filter_operator =   'equals';
            var search_text     =   $(this).attr('data-id');
        }
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
        }
    });

    $('body').on('click', '.sub-filter-status', function(){
        $("#filter_operator").attr('value',$(this).attr('data-id'));
        $("#filter_type").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field").attr('value',$(this).attr('data-filter-field'));

        if($(this).attr('data-id') == 'all')
        {
            var filter_operator =   'not_equal';
            var search_text     =   'blank';
        }
        else
        {
            var filter_operator =   'begins_with';
            var search_text     =   $(this).attr('data-id');
        }

        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
        }
    });


    $('body').on('click', '.sub-folder-filter-status', function(){
        $("#filter_operator").attr('value',$(this).attr('data-id'));
        $("#filter_type").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field").attr('value',$(this).attr('data-filter-field'));

        if($(this).attr('data-id') == 'all')
        {
            var filter_operator =   'not_equal';
            var search_text     =   '2';
        }
        else
        {
            var filter_operator =   'equals';
            var search_text     =   $(this).attr('data-id');
        }

        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();


        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
            $.post(domainUrl+'documents/folderDetails',{'page':1,'order_by':'node_class_property_id','order':'ASC','type':'no-pagination','filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'mode':'Ajax','class_node_id':folderId},responseCallFolderDetailsAction,'html');
        }
    });

    /*code here for course class */
    $('body').on('click', '.course-sub-filter', function(){
        $("#course_filter_operator").attr('value',$(this).attr('data-id'));
        $("#course_filter_type").attr('value',$(this).attr('data-filter-by'));
        $("#course_filter_field").attr('value',$(this).attr('data-filter-field'));
    });

     $('body').on('click', '.sub-course-filter-status', function(){

        $("#course_filter_operator").attr('value',$(this).attr('data-id'));
        $("#course_filter_type").attr('value',$(this).attr('data-filter-by'));
        if($(this).attr('data-id') == 'all')
        {
            var filter_operator =   'not_equal';
            var search_text     =   '2';
        }
        else
        {
            var filter_operator =   'equals';
            var search_text     =   $(this).attr('data-id');
        }

        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            $.post(domainUrl+'menudashboard/index',{'setUserID':setUserID,'order_by':'node_instance_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':'status','search_text':search_text,'mode':1},responseCourseAjax,'html');
        }
    });
/*end code here*/


    $('body').on('click', '.search-button-box', function(){
        var filter_operator =   $("#filter_operator").val();
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();
        var search_text     =   $("#search-caption-text-box").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
        }
    });

    $('body').on('click', '.search-button-box-caption', function(){
        var filter_operator =   $("#filter_operator").val();
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();
        var search_text     =   $("#search-caption-text-box-caption").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
        }
    });

    $('body').on('click', '.search-button-box-instance_total', function(){
        var filter_operator =   $("#filter_operator").val();
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();
        var search_text     =   $("#search-caption-text-box-instance_total").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            var value = $("#temp_item_per_page").val();
            $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
        }
    });

    $('body').on('click', '.sub-filter-instance', function(){
        $("#filter_operator_instance").attr('value',$(this).attr('data-id'));
        $("#filter_type_instance").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field_instance").attr('value',$(this).attr('data-filter-field'));
    });

    $('body').on('click', '.sub-filter-instance-status', function(){
        $("#filter_operator_instance").attr('value',$(this).attr('data-id'));
        $("#filter_type_instance").attr('value',$(this).attr('data-filter-by'));
        $("#filter_field_instance").attr('value',$(this).attr('data-filter-field'));

        if($(this).attr('data-id') == 'all')
        {
            var filter_operator =   'not_equal';
            var search_text     =   'blank';
        }
        else
        {
            var filter_operator =   'begins_with';
            var search_text     =   $(this).attr('data-id');
        }

        var filter_type     =   $("#filter_type_instance").val();
        var filter_field    =   $("#filter_field_instance").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            var node_class_id = $("#node_y_class_id").val();
            var value = $("#temp_item_per_page_instance").val();
            $.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseInstanceFilter,'html');
        }
    });

    $('body').on('click', '.search-button-instance-box', function(){
        var filter_operator =   $("#filter_operator_instance").val();
        var filter_type     =   $("#filter_type_instance").val();
        var filter_field    =   $("#filter_field_instance").val();
        var search_text     =   $("#search-caption-instance-text-box").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            var node_class_id = $("#node_y_class_id").val();
            var value = $("#temp_item_per_page_instance").val();
            $.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseInstanceFilter,'html');
        }
    });

    $('body').on('click', '.all_check', function(){
        if($('.all_check').is(':checked') == true)
        {
            $('.single_check').each(function(){ this.checked = true; });
            $('.default_row_class input[type="checkbox"]').each(function(){ this.checked = true; });
        }

        if($('.all_check').is(':checked') == false)
        {
             $('.single_check').each(function(){ this.checked = false; });
             $('.default_row_class input[type="checkbox"]').each(function(){ this.checked = false; });
        }
    });

    $('body').on('click', '.all_i_check', function(){
        if($('.all_i_check').is(':checked') == true)
        {
            $('.single_i_check').each(function(){ this.checked = true; });
        }

        if($('.all_i_check').is(':checked') == false)
        {
             $('.single_i_check').each(function(){ this.checked = false; });
        }
    });

    /*Created By Divya Rajput*/
    $('body').on('click', '.ImportInstanceData_li',function(){
        $('input[name=import_instance_file]').click();
        return false;
    });

    /*for import file*/
    $('body').on('click', '#importFile',function(){
        NProgress.start();

        var node_class_id = $("#node_y_class_id").val();
        $('#hidden-class-id').attr('value',node_class_id);

        var insert_record;
        var disregard_record;

        var fd = new FormData(document.getElementById("import_instance_form"));
        $.ajax({
            url: "classes/importInstanceData",
            type: "POST",
            data: fd,
            dataType: 'json',
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function( data ) {

            if($.trim(data.error) == 'error'){
                $('#csvfilePopup').find('.series-content p').text("The import template you provided does not match the expected data structure. Please correct your import template and try again.");
                $('#csvfilePopup').modal('show');
            }else{

                if($.trim(data.update) != '0'){
                    disregardData = data.update;
                }else{
                    disregardData = data.disregard;
                }

                var node_y_class_id = $("#node_y_class_id").val();
                $.post(domainUrl+'classes/getClassInstance',{'class_id':node_y_class_id,'page':1,'order_by':'node_instance_id','order':'DESC','mode':'pagination'},responseGetClassInstance1,'html');

                if(data.insert <= 1){
                    insert_record = 'record';
                }else{
                    insert_record = 'records';
                }

                if(disregardData <= 1){
                    disregard_record = 'record has';
                }else{
                    disregard_record = 'records have';
                }

                $('#csvfilePopup').find('.series-content p').text("You have successfully added "+data.insert+" "+insert_record+". "+disregardData+" "+disregard_record+" been disregarded.");
                $('#csvfilePopup').modal('show');
            }
            NProgress.done();
        });
        return false;
    });
    /*END HERE*/

    /* Start Code By Arvind Soni For Node Z class List Instances*/
    /*Left Pane*/
    $('body').on('click', '.sub-filter-node-z', function(){
        $("#filter_operator_node_z").attr('value',$(this).attr('data-id'));
        $("#filter_field_node_z").attr('value',$(this).attr('data-filter-field'));
    });

    $('body').on('click', '.search-button-box-node-z', function(){
        var filter_operator =   $("#filter_operator_node_z").val();
        var filter_field    =   $("#filter_field_node_z").val();
        var search_text     =   $("#search-caption-text-box-node-z").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            $.post(domainUrl+'classes/classListNew',{'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'order_by':'node_class_id','order':'DESC','mode':'Ajax'},responseclassListNewAjax,'html');
        }
    });

    $('body').on('click', '.search-button-box-node-z-caption', function(){
        var filter_operator =   $("#filter_operator_node_z").val();
        var filter_field    =   $("#filter_field_node_z").val();
        var search_text     =   $("#search-caption-text-box-node-z-caption").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            $.post(domainUrl+'classes/classListNew',{'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'order_by':'node_class_id','order':'DESC','mode':'Ajax'},responseclassListNewAjax,'html');
        }
    });

    $('body').on('click', '.node-z-searching-in-class-list-top-button', function(){
        var search_text     =   $(".node-z-searching-in-class-list-top-text-field").val();
        if($.trim(search_text) != '')
        {
            NProgress.start();
            $.post(domainUrl+'classes/classListNew',{'filter_operator':'all','filter_field':'all','search_text':search_text,'order_by':'node_class_id','order':'DESC','mode':'Ajax'},responseclassListNewAjax,'html');
        }
    });

    /*Right Pane*/
    $('body').on('click', '.sub-filter-node-z-instance-value', function(){
        $("#filter_operator_node_z_instance").attr('value',$(this).attr('data-id'));
        $("#filter_field_node_z_instance").attr('value',$(this).attr('data-filter-field'));
    });

    $('body').on('click', '.search-button-box-node-z-node-id', function(){
        var filter_operator =   $("#filter_operator_node_z_instance").val();
        var filter_field    =   $("#filter_field_node_z_instance").val();
        var search_text     =   $("#search-caption-text-box-node-z-node-id").val();
        if($.trim(search_text) != '')
        {
            var class_id = $("#intanceClassIdNozeZ").val();
            NProgress.start();
            $.post(domainUrl+'classes/instanceListNew',{'class_id':class_id,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'order_by':'node_instance_id','order':'DESC','mode':'Ajax'},responseinstanceListNewAjax,'html');
        }
    });

    $('body').on('click', '.search-button-box-node-z-caption-instanceList', function(){
        var filter_operator =   $("#filter_operator_node_z_instance").val();
        var filter_field    =   $("#filter_field_node_z_instance").val();
        var search_text     =   $("#search-caption-text-box-node-z-caption-instanceList").val();
        if($.trim(search_text) != '')
        {
            var class_id = $("#intanceClassIdNozeZ").val();
            NProgress.start();
            $.post(domainUrl+'classes/instanceListNew',{'class_id':class_id,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'order_by':'node_instance_id','order':'DESC','mode':'Ajax'},responseinstanceListNewAjax,'html');
        }
    });

    $('body').on('click', '.node-z-searching-in-instance-list-top-button', function(){
        var search_text     =   $(".node-z-searching-in-instance-list-top-text-field").val();
        if($.trim(search_text) != '')
        {
            var class_id = $("#intanceClassIdNozeZ").val();
            NProgress.start();
            $.post(domainUrl+'classes/instanceListNew',{'class_id':class_id,'filter_operator':'all','filter_field':'all','search_text':search_text,'order_by':'node_instance_id','order':'DESC','mode':'Ajax'},responseinstanceListNewAjax,'html');
        }
    });

    $('body').on('click', '.single_radio_check_all', function(){
        if($('.single_radio_check_all').is(':checked') == true)
        {
            $('.single_radio_check1').each(function(){ this.checked = true; });
        }

        if($('.single_radio_check_all').is(':checked') == false)
        {
             $('.single_radio_check1').each(function(){ this.checked = false; });
        }

    });

    $('body').on('click', '.class_radio_data_type', function(){
        $("#second-class-div").find(".node-selected .hidden-node-y").val('');
        $("#second-class-div").find(".node-selected .hidden-node-y-instance-property-node-id").val('');
    });
    /* End Code By Arvind Soni For Node Z class List Instances*/

    //No relaod in add new Instance Enter
    $("body").on("keypress",".instanceRunTab.noReload",function(event){
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if($keycode===13){
            return false;
        }
    });

    /*code here to click folder search from text area*/

    $('body').on('click', '.search-button-box-folder-value', function(){
        var filter_operator =   $("#filter_operator").val();
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();
        var search_text     =   $("#search-folder-text-box-value").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            $.post(domainUrl+'documents/folderList',{'page':1,'order_by':'node_instance_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'mode':'Ajax'},responsePaginationFolderAjax,'html');
        }
    });

    $('body').on('click', '.search-button-box-folder-details', function(){

        var filter_operator =   $("#filter_operator").val();
        var filter_type     =   $("#filter_type").val();
        var filter_field    =   $("#filter_field").val();
        var search_text     =   $("#search-button-box-folder-details").val();

        if($.trim(search_text) != '')
        {   var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
            NProgress.start();
            $.post(domainUrl+'documents/folderDetails',{'page':1,'order_by':'node_instance_id','order':'DESC','type':'no-pagination','filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'mode':'Ajax','class_node_id':folderId},responseCallFolderDetailsAction,'html');

        }
    });

    $('body').on('click', '.search-button-box-course', function()
    {

        var filter_operator =   $("#course_filter_operator").val();
        var filter_type     =   $("#course_filter_type").val();
        var filter_field    =   $("#course_filter_field").val();
        var search_text     =   $("#search-button-box-course").val();

        if($.trim(search_text) != '')
        {
            NProgress.start();
            $("#course-instance-list-div").html("");
            $.post(domainUrl+'menudashboard/index',{'setUserID':setUserID,'order_by':'node_instance_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'mode':1},responseCourseAjax,'html');
        }
    });

/*end code here*/

/*start code for delete folder files*/
    $("body").on("click", function(e)
    {
        var checkDelete = $(".folder-detail").find('tr.folder-document-details').hasClass('selected-list');
        if(checkDelete==false){
            $("#delete-folder-document").addClass("inactiveLink");
        }
        if($(".bootbox").css("display") != "block"){
            if(!$(e.target).closest('table').hasClass("folder-detail") && !$(e.target).closest('a').hasClass("deleteFolderDocument")){
                FolderListarr = [];
                $(".selected-list").removeClass("selected-list");
                $(".drag-folder").removeClass('fDetailMoveNotAllow');
                PrevFirst = 0;
                PrevLast = 0;
                lastCTRLclick ="";
                LastClick="";
                $("#delete-folder-document").addClass("inactiveLink");
            }
        }
    });
    var first,last;
    $('body').on("click",'.folder-detail tr',function(e){
        var folderDetailId;
        selectedFolder_arr = [];
        if(!$(this).hasClass('no-record')){
        if(e.ctrlKey){
            if($(this).hasClass("selected-list")){
                FolderListarr.pop($(this).data('id'));
                $(this).removeClass("selected-list");
                folderDetailId = $(this).data('id');
                $(".drag-folder#"+folderDetailId).removeClass('fDetailMoveNotAllow');

            }else{
                $(this).addClass("selected-list");
                FolderListarr.push($(this).data('id'));
                lastCTRLclick = $(this).index();
                folderDetailId = $(this).data('id');
                $(".drag-folder#"+folderDetailId).addClass('fDetailMoveNotAllow');
            }
        } else if(e.shiftKey){
                $(this).addClass("selected-list");
                var current = $(this).index();
                if(PrevFirst == 0 && PrevLast == 0 && lastCTRLclick == "" ){
                    first = 0;
                    last = current;
                    LastClick ="above";
                    lastCTRLclick ="";
                }
                else if((current > PrevFirst) && (current < PrevLast)){
                    if(LastClick == 'below'){
                        first = PrevFirst;
                        last = current;
                        LastClick ="below";
                        lastCTRLclick ="";
                    }  else {
                       first = current;
                       last = PrevLast;
                       LastClick ="above";
                       lastCTRLclick ="";
                    }
                }
                else if((current < PrevFirst) && (LastClick == "below")){
                    first = current;
                    last = PrevFirst;
                    LastClick = "above";
                    lastCTRLclick ="";
                } else if((current < PrevFirst) && (LastClick == "above")){
                    first = current;
                    last = PrevLast;
                    LastClick = "above";
                    lastCTRLclick ="";
                }
                else if((current > PrevLast) && (LastClick == "above")){
                    first = PrevLast;
                    last =  current;
                    LastClick = "below";
                    lastCTRLclick ="";
                }
                else {
                            if(lastCTRLclick !=""){
                                if(lastCTRLclick >current){
                                        first = current;
                                        last = lastCTRLclick;
                                        LastClick = "above";
                                        lastCTRLclick ="";
                                } else if (lastCTRLclick < current){
                                        first = lastCTRLclick;
                                        last = current;
                                        LastClick = "below";
                                        lastCTRLclick ="";
                                }

                            } else {
                            first = $('.folder-detail tr.selected-list').first().index();
                            last  = $('.folder-detail tr.selected-list').last().index();
                             if((current < PrevFirst) && (current < PrevLast)) {
                                firstHolder = first;
                                first = last;
                                last = firstHolder;
                                LastClick = "above";
                                lastCTRLclick ="";
                            } else if((current > PrevFirst) && (current > PrevLast)) {
                                LastClick = "below";
                                lastCTRLclick ="";
                            } else if((current == PrevFirst) || (current == PrevLast)) {
                                if( current == PrevFirst ) {
                                  first = PrevFirst;
                                  last =  PrevFirst;
                                  LastClick = "above";
                                  lastCTRLclick ="";
                                } else {
                                  first = PrevLast;
                                  last =  PrevLast;
                                  LastClick = "below";
                                  lastCTRLclick ="";
                                }

                            }
                    }
                }


                if (first == -1 || last == -1) {
                return false;
                }

                $('.folder-detail tr').removeClass('selected-list');
                $(".drag-folder").removeClass('fDetailMoveNotAllow');

                var num = last - first;
                var x = first;
                FolderListarr = [];
                for (i=0;i<=num;i++) {

                     $('.folder-detail tbody tr').eq(x).addClass('selected-list');
                     FolderListarr.push($('.folder-detail tbody tr').eq(x).data('id'));
                     folderDetailId = $('.folder-detail tbody tr').eq(x).data('id');
                     $(".drag-folder#"+folderDetailId).addClass('fDetailMoveNotAllow');
                x++;
                }
                PrevFirst = first;
                PrevLast = last;




        } else {
            if(!$(this).hasClass("selected-list")){
                $('.folder-detail tr').removeClass('selected-list');
                $(".drag-folder").removeClass('fDetailMoveNotAllow');
                FolderListarr = [];
                FolderListarr.push($(this).data('id'));
                $(this).addClass("selected-list");
                folderDetailId = $(this).data('id');
                $(".drag-folder#"+folderDetailId).addClass('fDetailMoveNotAllow');
                PrevFirst = $(this).index();
                PrevLast = $(this).index();
                lastCTRLclick = $(this).index();
            }else{
                $('.folder-detail tr').removeClass('selected-list');
                $(".drag-folder").removeClass('fDetailMoveNotAllow');
                FolderListarr = [];
                $(this).addClass("selected-list");
                FolderListarr.push($(this).data('id'));
                folderDetailId = $(this).data('id');
                $(".drag-folder#"+folderDetailId).addClass('fDetailMoveNotAllow');
                PrevFirst = $(this).index();
                PrevLast = $(this).index();
                lastCTRLclick = $(this).index();
            }
        }
        }

        if(FolderListarr.length<1){
            $("#delete-folder-document").addClass("inactiveLink");
        } else {
            $("#delete-folder-document").removeClass("inactiveLink");
        }
    });

    /* function here to delete folder and document */

    $("body").on('click','#delete-folder-document',function(){
        var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
        var selectedId = FolderListarr;
        if(FolderListarr == ""){
            bootbox.alert('Please select at-least one file or folder.');
            return false;
        }
        else {

            bootbox.confirm({
                    title: 'Delete Message',
                    message: 'Are you sure you want to delete file or folder.',
                        buttons: {
                            'cancel': {
                               label: 'No',
                               className: 'btn-default'
                            },
                            'confirm': {
                               label: 'Yes',
                               className: 'btn-primary'
                            }
                        },
                        callback: function(result) {
                             if (result) {
                                NProgress.start();
                                  var FoldderDetailarr = [];
                                var foldercount = 0;
                                $(".folder-document-details").each(function(i,v){
                                    if($(this).find('td').eq(1).find('span').html() == "Folder"){
                                    FoldderDetailarr.push($(this).data('id'));
                                    }
                                });
                                $(FoldderDetailarr).each(function(i,v){
                                    if (jQuery.inArray(v, FolderListarr) !='-1') {
                                    ++foldercount;
                                    }
                                });
                                if(FoldderDetailarr.length == foldercount){
                                    $("#"+folderId+" .left-folder-action").html("");
                                    $("#"+folderId+" .folder-action").addClass('noChild').removeClass('hasChild');
                                }
                                $.post(domainUrl+'documents/deleteInstance',{'delete_ids':selectedId,'parentFolderId':folderId},responseDeleteInstanceFolderDocumentProperty,'JSON');
                                $(FolderListarr).each(function(i,v){
                                  $("#"+v).remove();
                                });

                            }else{
                                    FolderListarr = [];
                                    $(".folder-detail tr").removeClass("current");
                                    $(".selected-list").removeClass("selected-list");
                                     $(".drag-folder").removeClass('fDetailMoveNotAllow');
                                    PrevFirst = 0;
                                    PrevLast = 0;
                                    lastCTRLclick ="";
                                    LastClick="";
                                    $("#delete-folder-document").addClass("inactiveLink");
                            }
                        }
                    });
        }
    });

    $("body").on('click','#add-document',function(){

        /*
        * Added By: Divya Rajput
        * On Date:  26th May 2016
        * Purpose:  First reset the localStorage variable after that Store Document html in localstoage
        * So that when any instance of resource folder is selected, by default selected resource retained when click on close icon of document
        */
        localStorage.removeItem('resourcedata');
        localStorage.removeItem('loaddocument');
        var resourceHtml = $("li#"+parentFolderInstanceID).html();
        localStorage.setItem('resourcedata', resourceHtml);
        /*End Here*/

        /*$(".NewFolder_li").hide();
        $(".DeleteFolder_li").hide();*/
        $('#newDocumentFlyout').animate({right:'0'},300,function(){}).addClass('in');
        $('#newDocumentFlyout #File').addClass('in');
        $('.ref-hideTollbar').trigger('click');
        $.post(domainUrl+'documents/fileHelper',{},responseFileHelper1,'html');
        $('.loadder').show();
        $("#document_title").val("");
        globalTitle ="";
        $('#document_action_menu').show();
        $('#openCourseFlyout').animate({left:0},300).removeClass('in');

        $('body').on('keyup','#document_title',function(){
            if($(this).val().length<51){
                var getCount = $(this).val().length;
                $(this).siblings('.char-limit').find('.charCount').text(getCount);
            }
        });

        $('.charCount').text(0);
    });

    $('body').on('keypress','#Folder_name',function(event){
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if($(this).val().length>0){
            if($keycode==13){
                $('.common_name_folder_first').trigger('click');
            }
        }
    });

    $('body').on('keypress','#Folder_sub_name',function(event)
    {
        var $keycode = (event.keyCode ? event.keyCode : event.which);

        if($(this).val().length>0 && $.trim($(this).val())!=""){
            if($keycode==13){
                $('.common_sub_folder_first').trigger('click');
            }
        }
    });

    /* code here for create root folder click on + icon link */
    $('body').on('keypress','#Folder_root_name',function(event)
    {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if($(this).val().length>0 && $.trim($(this).val())!=""){
            if($keycode==13){
                $('.common_root_folder_first').trigger('click');
            }
        }
    });

    $('body').on('keypress','#common_name_first',function(event){
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if($(this).val().length>0){
            if($keycode==13){
                $('#commonPopupFirst .btn').eq(0).trigger('click');
            }
        }
    });

    $('body').on('click','#add-document-open',function(){

        if(globalDocumentSaveStatus == 0){
            bootbox.confirm({
                        title: 'Exit without saving',
                        message: 'Are you sure you want to Close the document without saving your changes?',
                            buttons: {
                                'cancel': {
                                   label: 'No',
                                   className: 'btn-default'
                                },
                                'confirm': {
                                   label: 'Yes',
                                   className: 'btn-primary'
                                }
                            },
                            callback: function(result) {
                                 if (result) {
                                    /*
                                    * Modified By: Divya Rajput
                                    * On Date: 24th May 2016
                                    * Purpose: Resource is not sorting properly,
                                    * On resource click, folder's instance are sorting by ni.sequence
                                    * On Resource close click, folder's instance are sorting by nip.node_instance_property_id
                                    */
                                    $.post(domainUrl+'documents/folderList',{'order_by':'sequence','order':'DESC','type':'no-pagination','mode':'Normal'},responseCallAction1,'html');
                                    /*End Here*/

                                    $('#folderList_action_menu').show();
                                    $(".NewFolder_li").show();
                                    $(".DeleteFolder_li").show();
                                    $(".NewDocument_li").hide();
                                    $(".OpenDocument_li").hide();
                                }
                            }
                        });
        } else {
            /*
            * Modified By: Divya Rajput
            * On Date: 24th May 2016
            * Purpose: Resource is not sorting properly,
            * On resource click, folder's instance are sorting by ni.sequence
            * On Resource close click, folder's instance are sorting by nip.node_instance_property_id
            */
            $.post(domainUrl+'documents/folderList',{'order_by':'sequence','order':'DESC','type':'no-pagination','mode':'Normal'},responseCallAction1,'html');
            /*End Here*/

            $('#folderList_action_menu').show();
            //$("#documents-screen").html('');
            $(".NewFolder_li").show();
            $(".DeleteFolder_li").show();
            $(".NewDocument_li").hide();
            $(".OpenDocument_li").hide();

        }
    });

    /* code here for add sub folder from click on add folder from right menu*/
     $('body').on('click','.addSubFolder',function()
     {
        $('#createSubFolder').modal('show');
        $("#createSubFolder").on('shown.bs.modal', function(){
            $(this).find('input[type="text"]').focus();
            $("#createSubFolder .btn").first().addClass("inactiveLink");
        });
        $('body').on('keyup','#Folder_sub_name',function(){
            if($(this).val().length>0 && $.trim($(this).val())!=""){
              $("#createSubFolder .btn ").removeClass("inactiveLink");
            } else {
              $("#createSubFolder .btn").first().addClass("inactiveLink");
            }
            if($(this).val().length<51){
                var getCount = $(this).val().length;
                $(this).siblings('.char-limit').find('.charCount').text(getCount);
            }
        });
        $("#Folder_sub_name").val("");
        $('.charCount').text(0);
     });

     /*code use here for save or update course class structure data*/

     $('body').on('click','#edit-course',function()
     {
        $('.viewTopMode, #view-detail-course').addClass('hide');
        $('.editTopMode, #edit-detail-course').removeClass('hide');
        $("#course-publish").show();
        $("#course-draft").show();
        $("#course-cancel").show();
        $("#edit-course").hide();
        autosize.destroy(document.querySelectorAll('.courseDetailSection textarea.resizeTextarea'));
        $('.courseDetailSection textarea.resizeTextarea').each(function(){
            autosize($(this));
        }).on('autosize:resized', function(){
            $(".nano").nanoScroller();
        });
        //$("#course-value").focus();
         $("#course-title-defalut-value").focus();
     });

     $('body').on('click','#course-cancel',function()
     {
        $('.viewTopMode').removeClass('hide');
        $('.editTopMode').addClass('hide');
        $('.viewTopMode, #view-detail-course').removeClass('hide');
        $('.editTopMode, #edit-detail-course').addClass('hide');
        $("#course-publish").hide();
        $("#course-draft").hide();
        $("#course-cancel").hide();
        $("#edit-course").show();
     });
});

function responseDeleteInstanceFolderDocumentProperty(d,s){
    var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
    $.post(domainUrl+'documents/folderDetails',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal','class_node_id':folderId},responseCallFolderDetailsAction,'html');
}

/*end code here*/
function setWidth()
{
    DialogueFlyout();
  //  filterDropDown();
    searchInfo();

    // for nano scroll
    $('.nano').nanoScroller({
        preventPageScrolling: true
    });
    $("#main").find('.description').load("readme.html", function(){
        $(".nano").nanoScroller();
        $("#main").find("img").load(function() {
            $(".nano").nanoScroller();
        });
    });
    //end nano scroll

    $headerHeight = $("header").outerHeight(true);
    $breadcrumbWrap = $(".breadcrumb-wrap").outerHeight(true);


    $winWidth = $(window).width(),
    $rightOne = $("div.display-wrapper"),
    $leftOne = $("div.main"),
    $sidebar = $(".sidebar-wrapper"),
    $sidebarWrap = $(".sidebar_wrap"),
    $contentWrap = $('.content-wrapper-new');

    $availHeight = window.innerHeight - ($headerHeight + $breadcrumbWrap+1);
    //---- Sidebar hover work starts
    var windowWidth = $(window).outerWidth(),
    windowHeight = $(window).outerHeight(),
    sidebar_wrap_min = 70,
    sidebar_wrap_max = 260,
    _TIME_ = 150,
    _CLICKED_ = false,
    lastLiIndex = null;


    var $sidebar_wrap = $('.sidebar_wrap'),
            $innerUl = $('div.sidebar_wrap ul:first ul.menu-items'),
            $firstLi = $('ul.menu-main-wrap > li'),
            $menuWrappers = $sidebar_wrap.find(".menu-wrapper");

    $firstLi.on('click', function (event, goClicked) {
    if(!$(".form_active").length){
        $this = $(this);
        $disabledLinkArr = ['icon invoice', 'icon profile', 'icon setting main-icon-setting_ ', 'icon checklist'];
        if ($disabledLinkArr.indexOf($this.find('i').attr("class")) != -1 || $this.hasClass("inactive")) {
            return false;
        }
        if(!isUserLoggedIn()) {
            return false;
        }
        if (inprocess != 0) {
            return;
        }

        lastLiIndex = $sidebar_wrap.find('ul:first > li').index(this);
        var section = $(".change_breadcrumb").text();
        section = section.toLowerCase().slice(0, -1);

        if ($('#edit-' + section + '-form .profile-detail').length > 0 || $('.edit-form-data').is(':visible')) {
            // To find active li before clicked
            var lastVisitedLi = $(".menu-main-wrap li._active");
            lastVisitedLi.find('.menu-wrapper').show();
        }
        else if ($('table .clone').length > 0) {
            var lastVisitedLi = $(".menu-main-wrap li._active");
            lastVisitedLi.find('.menu-wrapper').show();
        }
        else {
            //--- Add and remove classes
            $firstLi.removeClass('_active');
            $this.addClass('_active');

            var top = $this.offset().top - $sidebar_wrap.offset().top + 1;
            $menuWrappers.hide(0);
            $(".compactanchor").removeClass("last-active");

            $menu_wrapper = $this.find(".menu-wrapper").css({
              //  height: $availHeight,
                top: -top +1 + 'px'
            }).show(0);
            $menu_wrapper.find('ul.menu-items:not(._sub-menu)').css({
                minHeight: $availHeight- $breadcrumbWrap
            });

        }
        if($("#1_classes").hasClass("_active")){
                $(".DeleteClasses_li").addClass("inactive");
        }
        // event.preventDefault();
        // event.stopPropagation();
        }
        else if($(".form_active").length) {
            $('.Cancel-icon').trigger('click');
        }
    });
    //--- Sidebar hover work ends here

    $('.sidebar_wrap .menu-wrapper').css({
        height: $availHeight
    });

    $('.user-action-wrap').css({
        height: $availHeight
    });

    $sidebarWrap.height($availHeight);

    //---- Container width in workspace page
    var sideWidth = $(".sidebar_wrap").outerWidth(),
        actionWrap = $(".user-action-wrap").outerWidth(),
        totalActionWidth = sideWidth + actionWrap;
    $('.content-wrapper-new').css("width",($winWidth-totalActionWidth));
    $('.content-wrapper-new').css("height",($availHeight));

   //control bar with table listing for left pane
    var tableWrap = $(".listing-wrapper").width();

    $sidebarWrap.height($availHeight);
    $('.set-height').height($availHeight);

    contentHeaderWidth();
    setColumnsH();

    var currentNode             =   1;
    var TotalDashboardWidth     =   $(".dashboard").width();
    splitDashboardWidth         =   TotalDashboardWidth/2;

    var subDashboardWidth       =   splitDashboardWidth*$(".active .dashSlider").length;
    $(".total-width-pane").width(subDashboardWidth);

    $(".dashSlider").outerWidth(splitDashboardWidth);
    $(".nextShow").removeClass('disabled');
    $(".prevShow").addClass('disabled');
    var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
    $(".image-slider").width(totalwidth);

    $('.breadcrumb-down').click(function(e) {
        $(".breadcrumb-wrap").addClass('breadcrumb-up');
        $headerHeight = $("header").outerHeight(true);
        $availHeight = window.innerHeight - ($headerHeight + 10);
        $('.sidebar_wrap .menu-wrapper').animate({'height': $availHeight},'fast');
        $('.user-action-wrap').animate({'height': $availHeight},'fast');
        $(".sidebar_wrap").animate({'height': $availHeight},'fast');
        $('.content-wrapper-new').animate({'height': $availHeight},'fast');
        $('.set-height').animate({'height': $availHeight},'fast');
        setWidthInitialy()
        $('.breadcrumb-down').hide();
        e.stopPropagation();
    });

         /***************** pagination-toggle ********************/
    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');

        if ($(this).find('.btn-primary').size()>0) {
            $(this).find('.btn').toggleClass('btn-primary');
        }
        if ($(this).find('.btn-danger').size()>0) {
            $(this).find('.btn').toggleClass('btn-danger');
        }
        if ($(this).find('.btn-success').size()>0) {
            $(this).find('.btn').toggleClass('btn-success');
        }
        $(this).find('.btn').toggleClass('btn-default');
    });

    $('form').submit(function(){
        return false;
    });

    /***************** pagination-toggle ********************/
}

function displayRightMenuContent(id)
{
}

function getCenterContent(obj,id,name)
{
    //Remove notification list
    var courseNotificationPanel = $(".courseNotification-panel");
    if(courseNotificationPanel.hasClass('show')){
        courseNotificationPanel.removeClass('show');
    }
    //Reset Search box
    $('.search-item-wrap #dashboard_search_id').val('');
    //remove this code when left menu handle in react
    $('.Newcourse_li').removeClass('inactive');
    if(name.toLowerCase() == 'bydialogue' || name.toLowerCase() == 'byactor') {
          $('.Newcourse_li').addClass('inactive');
    }
    if(name.toLowerCase() == 'newcourse') {
        localStorage.removeItem('dialogue_node_id');
        //localStorage.removeItem('prev_dialogue_node_id');
        $("#react-button-add-new-course").click();
        if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
            $breadcrumbWrap = 10;
            var HT = $(window).height() - $('header').outerHeight()- $('.dialogue-container').outerHeight() - $breadcrumbWrap;
            $('.existingSelectedCourseWrap.HalfPaneHeight').height(HT);
        }
        else{
            $breadcrumbWrap = 51;
            var HT = $(window).height() - $('header').outerHeight()- $('.dialogue-container').outerHeight() - $breadcrumbWrap;
            $('.existingSelectedCourseWrap.HalfPaneHeight').height(HT);
        }
        manageDialogueHT();
        $(window).trigger('resize');
        return true;
    }
    $('#temp_node_span').remove();
    $('#tempNodeId').val('');
    hitName = name;
    if(name == 'Addevent' || name == 'Grid' || name == 'List')
    {
       //Inside code written in calendar-script.js
    }
    else if(name == 'All' || name == 'Draft' || name == 'Published' || name == 'Disabled' || name == 'NodeX' || name == 'NodeY' || name == 'NodeZ')
    {
        var levelMenu   =   $.trim($(obj).closest('.panel-collapse').siblings('.item-title').text());
        if((name == 'All' || name == 'Draft' || name == 'Published') && levelMenu == 'Status')
        {
            $(obj).closest('li').siblings('li').removeClass('active');
            $(obj).closest('li').addClass('active');
            var is_instance = $("#is_instance").val();
            if(is_instance == 'N')
            {
                $("#filter_operator").attr('value',name);
                $("#filter_type").attr('value','pagination');
                $("#filter_field").attr('value','status');

                if(name == 'All')
                {
                    var filter_operator =   'not_equal';
                    var search_text     =   'blank';
                }
                else
                {
                    var filter_operator =   'begins_with';
                    if(name == 'Draft')
                        var search_text     =   'd';
                    if(name == 'Published')
                        var search_text     =   'p';
                }

                var filter_type     =   $("#filter_type").val();
                var filter_field    =   $("#filter_field").val();

                if($.trim(search_text) != '')
                {
                    NProgress.start();
                    var value = $("#temp_item_per_page").val();
                    $.post(domainUrl+'classes/index',{'hit_by':'left_section','page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
                }
            }
            else
            {
                $("#filter_operator_instance").attr('value',name);
                $("#filter_type_instance").attr('value','pagination');
                $("#filter_field_instance").attr('value','status');

                if(name == 'All')
                {
                    var filter_operator =   'not_equal';
                    var search_text     =   'blank';
                }
                else
                {
                    var filter_operator =   'begins_with';
                    if(name == 'Draft')
                        var search_text     =   'd';
                    if(name == 'Published')
                        var search_text     =   'p';
                }
                var filter_type     =   $("#filter_type_instance").val();
                var filter_field    =   $("#filter_field_instance").val();

                if($.trim(search_text) != '')
                {
                    NProgress.start();
                    var node_class_id = $("#node_y_class_id").val();
                    var value = $("#temp_item_per_page_instance").val();
                    $.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseInstanceFilter,'html');
                }
            }
        }
        else if((name == 'All' || name == 'NodeX' || name == 'NodeY' || name == 'NodeZ') && levelMenu == 'Node Type')
        {
            $("#filter_operator").attr('value',name);
            $("#filter_type").attr('value','pagination');
            $("#filter_field").attr('value','node_type_id');
            $(obj).closest('li').siblings('li').removeClass('active');
            $(obj).closest('li').addClass('active');
            if(name == 'NodeX')
            {
                var filter_operator =   'equals';
                var search_text     =   'X';
            }
            else if(name == 'NodeY')
            {
                var filter_operator =   'equals';
                var search_text     =   'Y';
            }
            else if(name == 'NodeZ')
            {
                var filter_operator =   'equals';
                var search_text     =   'Z';
            }
            else
            {
                var filter_operator =   'not_equal';
                var search_text     =   'A';
            }

            var filter_type     =   $("#filter_type").val();
            var filter_field    =   $("#filter_field").val();

            if($.trim(search_text) != '')
            {
                NProgress.start();
                var value = $("#temp_item_per_page").val();
                $.post(domainUrl+'classes/index',{'hit_by':'left_section','page':1,'order_by':'node_class_id','order':'DESC','type':filter_type,'filter_operator':filter_operator,'filter_field':filter_field,'search_text':search_text,'itemPerPage':value},responseFilter,'html');
            }
        }
    } else {
        var levelMenu   =   $.trim($(obj).closest('.panel-collapse').siblings('.item-title').text());
        if(levelMenu == 'Actions') {

        } else {
            $('.my-profile').removeClass('active');
            $(obj).closest('li').addClass('active');
        }
        var viewTypes = ['bycourse', 'bydialogue', 'byactor'];
        if(viewTypes.indexOf(name.toLowerCase()) > -1) {
            //$.post(domainUrl+'menudashboard/index',{'id':id, type: 'json', view_type: name.toLowerCase()},function() {},'json');
        } else {
            $.post(domainUrl+'classes/createAction',{'id':id},responseCenterContent,'json');

        }

    }
    var actionMens = ['Bycourse', 'Bydialogue', 'Byactor'];
    if(actionMens.indexOf(name) > -1) {
        highlightActionMenuAccordingly($(obj).attr('data-original-title'));
    }
}

function responseNodex(data,source)
{}

function responseCenterContent(data,source)
{
    if(data != null)
    callFunction(data);
    /* gridNavigation.init(); */
}

function callFunction(data)
{


    if($("#firstTime").val() == 'N')
    {
       NProgress.start();
    }

    $("#tempControler").attr('value',data.controler);
    $("#tempAction").attr('value',data.action);
    if(data.new_node_id) {
        if ($('#tempNodeId').length) {
            $('#tempNodeId').val(data.new_node_id);
        } else {
            $("#tempAction").after('<input type="hidden" id="tempNodeId" value="' + data.new_node_id + '" />')
        }
    }


    if(data.action == 'addNewInstance')
    {
        var node_class_id = $("#node_y_class_id").val();
        var is_instance = $("#is_instance").val();
            if(is_instance == 'N')
            {
                $.post(domainUrl+data.controler+'/'+data.action,{'node_class_id':node_class_id},responseCallAction,'html');
            }else {
                $.post(domainUrl+data.controler+'/'+data.action,{'node_class_id':node_class_id,'is_instance':'Yes'},responseCallAction,'html');
            }
    }
    else if(data.action == 'exportInstanceData')
    {
        var node_class_id = $("#node_y_class_id").val();
        $.post(domainUrl+data.controler+'/'+data.action,{'node_class_id':node_class_id},responseExportInstanceCallAction,'json');
    }
    else if(data.action == 'generateInstanceTemplate')
    {
        var node_class_id = $("#node_y_class_id").val();
        $.post(domainUrl+data.controler+'/'+data.action,{'node_class_id':node_class_id},responseExportInstanceCallAction,'json');
    }
    else if(data.action == 'importInstanceData')
    {
        NProgress.done();
    }
    else if(data.action == 'deleteClass')
    {
        NProgress.done();
        deleteClassProperty();
    }

    else
    {
        $.post(domainUrl+data.controler+'/'+data.action,{},responseCallAction,'html');
        if(data.controler == 'classes' && data.action=="index")
        {
            $.post(domainUrl+'classes/createFileOfUser',{},responseOfUser,'json');
        }
    }
}

function ucfirst(str) {
  str += '';
  var f = str.charAt(0)
    .toUpperCase();
  return f + str.substr(1);
}

function responseCallAction(data,source)
{
    $('.checkOperations').removeClass('checkOperations');
    hitName = '';
    var tempControler   =   $("#tempControler").val();
    var tempAction      =   $("#tempAction").val();
    var tempNodeId      =   $('#tempNodeId').val();
    var headingName     =  '';
    $('#temp_node_span').remove();
    $('.main-title-wrap').children('#temp_node_span').remove();
    $('.main-title-wrap').children('#temp_node_span').html('');

    if(tempControler =='grid')
    {
        headingName  = 'Process';
    }
    else if(tempAction == 'addNewInstance' && tempControler =='classes' )
    {
        headingName  =  "Instance: List";
    }
    else
    {
        headingName  =  tempControler;
    }
    $('.left-side-heading').html(ucfirst(headingName));

    $('.manifest-tab').remove();
    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
    $("#main_action_menu").show();
    if(tempControler != "grid" && tempControler!="associations" && tempControler!="accounts" && tempControler!="process" && tempControler!="workflow" && tempControler!="menudashboard" && tempControler!="calendar" && tempControler!="actors" && tempControler!="email" && tempControler!=dashboardMenuName.toLowerCase()  && tempControler!="testing" && tempControler!="documents" && tempControler!="group" && tempControler!=marketMenuName.toLowerCase())
    {
        $("#center-screen, #ControlBar, #menudashboard, #calender-screen, #actors-screen, #documents-screen, #main-screen, #canvas-screen, #organization-screen").hide();
        $(".pui_center_content").show();

        if(tempAction == 'addNewClass')
        {
            NProgress.done();
            ajaxDataFirst = data;
            $("#common_name_first").val("");
            $("#commonPopupFirstDiv").trigger('click');
            $("#commonPopupFirst").on('shown.bs.modal', function(){
                $(this).find('input[type="text"]').focus();
                $(this).find(".modal-footer button:first").addClass('inactiveLink');
                $('.content-wrapper-new').siblings('.user-action-wrap').show();
                //$("#main_action_menu").show();
            });
        }
        else if(tempAction == 'addNewInstance')
        {
            loadDataNewIns = data;
            var node_y_class_id = $("#node_y_class_id").val();
            if(parseInt(node_y_class_id) > 0)
            {
                hitByIns = true;
                NProgress.start();
                $.post(domainUrl+'classes/getClassInstance',{'class_id':node_y_class_id,'mode':'pagination','filter_field':'status','filter_operator':'not_equal','itemPerPage':'25','order':'DESC','order_by':'node_instance_id','search_text':'blank','page':'1'},responseNInstance,'html');
            }
        }
        else
        {
            $(".pui_center_content").html(data);
            NProgress.done();
            $(".first_class_structure").click();
            $('.my-profile').removeClass('active');
            $(".All_li").addClass('active');
            addArrow();
        }

        $('.content-wrapper-new').siblings('.user-action-wrap').hide();
        $("#main_action_menu").show();
        $("#parti_action_div_id").show();

        $("#firstTime").attr('value','N');
    }
    else
    {
        if(tempControler == "grid" || tempControler == "process")
        {
            $('.list-tab a').addClass('active');
            $(".pui_center_content, #menudashboard, #calender-screen, #actors-screen, #documents-screen, #main-screen, #canvas-screen, #organization-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $("#center-screen").html('');
            responceGridButton(data,source);

            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            if(typeof tempNodeId !== 'undefined') {
                $('.main-title-wrap').children('#temp_node_span').remove();
                $('.main-title-wrap').children('#temp_node_span').html('');
                if($('#temp_node_span').html()!= "( ... )" || $('#temp_node_span').html()!== 'undefined') {
                    $('#course_text_add').after('<span class="nodeIdCount" id="temp_node_span"><span>( ... )</span><span class="colon">:</span><span class="refCourseTitle"><span class="refCourseTitleEdit"><input type="text" value="" name="productiontitle" class="production_title form-control input-field" placeholder="Undefined" data-value="entr-process-title"><i class="icon tick entr-process-title"></i></span><span class="refCourseTitleView hide"><label>Undefined</label><i class="icon sm-edit"></i></span></span></span>');

                }
            }

            $("#association_action_menu").hide();
            $("#process_action_menu").show();
            $('#ControlBar .list-tab').addClass('active');
            $("#procces-tab").removeClass('hide');

            coursePathNumbering();
            cellFlyout();
            manageCourseTitle();
            $('#operationPaneFlyout').animate({right:'-100%'}).removeClass('in');
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
        }
        else if(tempControler == "accounts")
        {
            $('.list-tab a').addClass('active');
            $(".pui_center_content, #menudashboard, #calender-screen, #actors-screen, #documents-screen, #main-screen, #canvas-screen, #organization-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $("#center-screen").html('');
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();

            $('#operationPaneFlyout').animate({right:'-100%'}).removeClass('in');
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
            responceAccountingGridButton(data,source);
             $('#ControlBar .list-tab').addClass('active');
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#accounts_action_menu").show();
            $("#procces-tab").removeClass('hide');
        }
        else if( (tempControler == "resources" || tempControler == "documents") && tempAction == 'index')
        {
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #documents-screen, #canvas-screen, #main-screen, #calender-screen, #actors-screen, #organization-screen").hide();
            $("#documents-screen").html(data);
            $('#documents-screen').show();

            /*
            * Added By: Divya Rajput
            * On Date: 29 July 2016
            * Purpose: To show Tags, as it is not showing tags when resource content is loading.
            */
            editorLoadTags();
            /*End Here*/

            caretInsert();
            rangeInitialize();
            indexing();
            autoEDTHeightCheck();
            manageDocEdtHig();
            setDocNiceScroll();
            ChangeAlignment();
            $(".unstructuredIcon").hide();
            setColumnsH();
            sideFlyoutHeight();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#main-screen").hide();
            $("#document_action_menu").show();
            $('.loadder').hide();
            $('#helpNoderAnchor').show();
            $('#newDocumentFlyout').animate({right:'-100%'},300,function(){
            }).removeClass('in');
            $('.edtHeader  #File').removeClass('in');
            if(globalTitle != ''){
                closeDocumentFlyout();
                $("#document_title").val(globalTitle);
            }

            var checkSta = $("#document_action_menu").find('#save-document-data').attr('onclick');
            if(checkSta =="saveDocument('D');"){
                /*
                * Modified By: Divya Rajput
                * On Date: 18th May 2016
                * Purpose: remove inactive class when open a new document,
                * it will remain inactive when in edit mode
                */
              globalDocumentSaveStatus = 1;
            }
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');

            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){

                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
        }
        else if( (tempControler == "resources" || tempControler == "documents") && tempAction == 'folderList')
        {
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #documents-screen, #canvas-screen, #main-screen, #calender-screen, #actors-screen, #organization-screen").hide();
            $("#documents-screen").html(data);
            $('#documents-screen').show();
            folderSection();
            caretInsert();
            rangeInitialize();
            indexing();
            setDocNiceScroll();
            ChangeAlignment();
            $(".unstructuredIcon").hide();
            setColumnsH();
            sideFlyoutHeight();
            AddUserEntry();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#main-screen").hide();
            $("#folderList_action_menu").show();
            $('.loadder').hide();
            $('#helpNoderAnchor').show();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            $('#newDocumentFlyout #File').removeClass('in');
            $('.edtHeader  #File').removeClass('in');

            $("#document_title").val(globalTitle);
            var getVal = $("#document_title").val();
            if(!getVal==""){
                var getdata = $("#document_title").val().length;
                $('.charCount').text(getdata);
            }

            $("#FolderList").find('li:eq(0)').addClass('active');

            DragDropFolder();

            var folderId = $("#FolderList").find('li:eq(0)').find('span').attr('data-id');
            /*
            * Added By: Divya Rajput
            * On Date:  24th May 2016
            * Purpose:  to make folder id as global*/
            globalFolderInstanceID = folderId;
            parentFolderInstanceID = $("#FolderList").find('li.active').closest('.move-parent-folder').attr('id');
            /*End Here*/

            DragDropFolderCall();
            NProgress.start();
            $("#FolderList li.active").trigger('click');
            oddEvenColor();
                $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
        }
        else if(tempControler == 'menudashboard' && tempAction == 'index')
        {
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #actors-screen, #calender-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            $('#menudashboard').show();
            $("#menudashboard").html(data);
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#course_action_menu").show();
            $('.courseDetailSection textarea.resizeTextarea').each(function(){
                autosize(this);
            }).on('autosize:resized', function(){
                $(".nano").nanoScroller();
            });
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            dashboardInitalLoad();
            setColumnsH();
            if(!$('.no-record').length) {
                NProgress.start({position: 'middle'});
            }

            var activeNode = $(".courseboard-table.ActiveRow tr.current").attr('data-id');
            // commented below $.post due to react implementation
            // $.post(domainUrl+'menudashboard/courseView',{'node_instance_id':activeNode},responseCallcourseViewAction,'html');
            $('.HalfPaneHeight').height($(window).height() - $('header').outerHeight()- 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
            $('.setListWrapHeight').height($(window).height() - $('header').outerHeight()- 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
            $(".nano").nanoScroller();
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
            $('#documents-screen').children().remove();
            $("#hidden_document_type_id").val('Letter');
            $("#course-instance-list-div .nano").on("update", function(){
            if($(this).find('.dropdown.dialogue-drp').hasClass('open')){
                $(this).find('.dropdown.dialogue-drp').removeClass('open')
            }

            });
        }
        else if(tempControler == 'menudashboard' && (tempAction == 'newCourse' || tempAction == 'underConstruction'))
        {
            edtTagArray = [];
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #calender-screen, #actors-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            /*Modified BY:Divya Rajput*/
            if(globalNewDialog > 0){
            }else{
               $("#menudashboard").html(data);
            }
            /*End Here*/
            $('#menudashboard').show();

            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#new_course_action_menu").show();
            $("#course_action_menu").hide();
            $('#documents-screen').children().remove();
            setColumnsH();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();

            /*Modified BY:Divya Rajput*/
            if(globalNewDialog > 0){
                var activeNode  = globalNewDialog;
            }else{
                var activeNode  = $(".courseboard-table tr.current").attr('data-id');
            }
            /*End Here*/
            if(activeNode == undefined)
            {
                activeNode = "";
            }
            $.post(domainUrl+'menudashboard/courseView',{'node_instance_id':activeNode, 'load_editor': 1},responseCallcourseViewAction,'html');

            dualPaneHeight();
            hitName = '';
            dashboardInitalLoad();

            $("#add-new-course-value").val('no');
            $("#hidden_document_type_id").val('Letter');
            NProgress.done();
        }
        else if(tempControler == 'calendar' && tempAction == 'index')
        {
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #actors-screen, #documents-screen, #canvas-screen, #organization-screen").hide();
            $("#main-screen").hide();
            $("#calender-screen").html(data);
            $('#calender-screen').show();
            calenderWidthHeight();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#calendar_action_menu").show();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            setColumnsH();
            dualPaneHeight();
            $('textarea.resizeTextarea').each(function(){
                autosize(this);
            }).on('autosize:resized', function(){
                $(".nano").nanoScroller();
            });
            dashboardInitalLoad();
            calenderWidthHeight();
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
            setTimeout('myFunction()', 1000);
        }
        else if(tempControler == 'actors' && tempAction == 'index')
        {
            $('.Byindividual_li').addClass('active');
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #calender-screen, #documents-screen, #canvas-screen, #organization-screen").hide();
            $("#main-screen").hide();
            $("#actors-screen").html(data);
            $('#actors-screen').show();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#actors_action_menu").show();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            setColumnsH();
            openActor();
            dualPaneHeight();
            sideFlyoutHeight();
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
        }
        else if(tempControler == 'email' && tempAction == 'index')
        {
            $('.Byindividual_li').addClass('active');
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #calender-screen, #documents-screen, #canvas-screen, #actors-screen, #organization-screen").hide();
            $("#main-screen").hide();
            $("#email-screen").html(data);
            $('#email-screen').show();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#email_action_menu").show();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            setColumnsH();
            dualPaneHeight();
            sideFlyoutHeight();
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
        }
        else if(tempControler == 'testing' && tempAction == 'index')
        {
            $('.list-tab a').addClass('active');
            $("#center-screen, #ControlBar, .pui_center_content, #menudashboard, #actors-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            $("#calender-screen").html(data);
            $('#calender-screen').show();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#calendar_action_menu").show();
            setColumnsH();
            dualPaneHeight();
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            $('textarea.resizeTextarea').each(function(){
                autosize(this);
            }).on('autosize:resized', function(){
                $(".nano").nanoScroller();
            });
            dashboardInitalLoad();
            calenderWidthHeight();
        }
        else if(tempControler == 'associations' && tempAction == 'index')
        {

            $('.list-tab a').addClass('active');
            $(".pui_center_content, #menudashboard, #calender-screen, #actors-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            $("#center-screen, #ControlBar").show();
            $("#center-screen").html('');

            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            if(typeof tempNodeId !== 'undefined') {
                $('.main-title-wrap').children('#temp_node_span').remove();
                $('.main-title-wrap').children('#temp_node_span').html('');
                if($('#temp_node_span').html()!= "( ... )" || $('#temp_node_span').html()!== 'undefined') {
                    $('#course_text_add').after('<span class="nodeIdCount" id="temp_node_span"><span>( ... )</span><span class="colon">:</span><span class="refCourseTitle"><span class="refCourseTitleEdit"><input type="text" value="" name="productiontitle" class="production_title form-control input-field" placeholder="Undefined" data-value="entr-association-title"><i class="icon tick entr-association-title"></i></span><span class="refCourseTitleView hide"><label>Undefined</label><i class="icon sm-edit"></i></span></span></span>');

                }
            }
            $("#process_action_menu").hide();
            $("#association_action_menu").show();
            $('#association_action_menu .user-roles').css('display','none');
            $('.draft-association, .publish-association, .cancel-association').css('display','block');
            $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
            $('#openCourseFlyout').animate({left:0},300).removeClass('in');
            $('.loadder').hide();
            $('#operationPaneFlyout').animate({right:'-100%'}).removeClass('in');
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
                $("#scheduleBuilder").removeClass("in");
                $('.structuredSche.openthreepane').removeClass('openthreepane');
            });
            responceAssociationGridButton(data,source);
             $('#ControlBar .list-tab').addClass('active');
            coursePathNumbering();
            cellFlyout();
            manageCourseTitle();
            $("#procces-tab").removeClass('hide');
        }
        else if(tempControler == 'workflow' && tempAction == 'index'){
            $(".pui_center_content").show().html(data);
            NProgress.done();
            $('.user-action-wrap').hide();
            $("#workflow_action_menu").show();
            $("#workflow_action_menu").find('a').show();
        }
        else if(tempControler == 'store' && tempAction == 'market'){
            $("#center-screen, #ControlBar, .pui_center_content, #actors-screen, #calender-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            $('#menudashboard').show();
            $("#menudashboard").html(data);
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#course_action_menu").show();
            NProgress.done();
        }
        else if(tempControler == 'store' && tempAction == 'mycourse'){
            $("#menudashboard").html(data);
            NProgress.done();
        }
        else if(tempControler == 'group' && tempAction == 'index'){
            $("#center-screen, #ControlBar, .pui_center_content, #actors-screen, #calender-screen, #documents-screen, #canvas-screen, #main-screen, #menudashboard").hide();
            $('#organization-screen').show();
            $("#organization-screen").html(data);
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#organization_action_menu").show();
            NProgress.done();
        }
        else
        {

            $('.list-tab a').addClass('active');
            $(".pui_center_content, #menudashboard, #calender-screen, #actors-screen, #documents-screen, #canvas-screen, #main-screen, #organization-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $("#center-screen").html('');
            responceAssociationGridButton(data,source);
        }

        var activeMenu = $('.filter-list-wrap').find('.active').find('a');
        if(!activeMenu.length) {
            NProgress.done(); // this is needed to hide common loader '#react-flx-loader'
            NProgress.done(); // this is needed to hide previous implemented loaders
        } else if( activeMenu.attr('data-original-title') != 'By dialogue') {
            NProgress.done(); // this is needed to hide common loader '#react-flx-loader'
            NProgress.done(); // this is needed to hide previous implemented loaders
        }

        

    }
    //for new version case click on respective tab
    var curObj = $("#hostory_object").data('id');
    if(curObj && tempControler !== 'actors' && tempControler !== 'menudashboard' && tempAction !== 'addNewInstance'){
        curObj.trigger('click');
        curObj = $("#hostory_object").data('id','');
    }
    setInitalBreadCrumb(tempControler,tempAction);
    StopTabBreak("class_structure_form");
    StopTabBreak("instance_structure_form");
    setNumberPrint('second_instance_div');
    manageNiceScroll();
    $(".leftScroll").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "0px",
        background: 'rgba(0,0,0,.15)'
    });
    $(".niceScrollDiv").scroll(function(info){
         $("#tableContextMenu").hide();
         $("#edtHyperlinkPopup").hide();
         $("#edtHyperlinkPreview").hide();
         $("#edtformElementsTextProperties").hide();
         $("#tableContextMenu").hide();
    })
    if($('.edtHeader #sNumbers').is(":checked")){
        $(".statementNums").addClass("active");
    }
    else{
        $(".statementNums").removeClass("active");
    }
}

function getAvailableHeight() {
    var headerWrapperHeight = $('.header-wrapper').outerHeight();

    var breadcrumbElement = $('.breadcrumb-wrap');
    var breadcrumbHeight = breadcrumbElement.outerHeight();
    if(breadcrumbElement.hasClass('breadcrumb-up')) {
        breadcrumbHeight = 10;
    }
    var windowHeight = $(window).height();
    return windowHeight - (headerWrapperHeight + breadcrumbHeight);
}

function responseNInstance(data,source)
{
    $("#sub_nav_39 li").removeClass('active');
    $("#sub_nav_39 .All_li").addClass('active');
    $("#first_instance_div").html(data);
    $("#second_instance_div").html(loadDataNewIns);
    setPaperBckgrnd();
    manageRightMenuIcon('add','classes');
    NProgress.done();
    hitByIns = false;
    loadDataNewIns = '';
    setNumberPrint('second_instance_div');
     $('.class-table .single_i_check,.class-table .all_i_check,.class-table .default_row_instance input[type="checkbox"]').attr("disabled",true);
}

function manageRightMenuIcon(type,module)
{
    $(".Disabled_li").addClass('inactive');
    $(".Disabled_li").find('a').css("pointer-events","none");
    /* Start manage right menu icon */
    var is_instance = $("#is_instance").val();
    if(is_instance == 'N')
    {
        $(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","none");
    }
    if(module == 'classes')
    {
        $(".tooltip-item").hide();

        if(type == 'listing')
        {
            var obj1 = $('.NodeX_li').parents()[3];
            $(obj1).closest('div').show();

            $(".Edit-icon").show();

            if(is_instance == 'N')
            {

                $(".DeleteClasses_li").find('a').html('Delete Classes');
                if($(".class-table :checkbox:checked").length>0){
                    $(".DeleteClasses_li").removeClass("inactive");
                    $(".DeleteClasses_li").find('a').css("pointer-events","all");
                } else {
                    $(".DeleteClasses_li").addClass("inactive");
                    $(".DeleteClasses_li").find('a').css("pointer-events","none");
                }

            }
            else
            {
                $(".DeleteClasses_li").find('a').html('Delete Instances');
                $(".DeleteClasses_li").find('a').css("pointer-events","none");
                $(".ExportInstanceData_li").removeClass('inactive');
                $(".ExportInstanceData_li").find('a').css("pointer-events","all");
                $(".GenerateInstanceTemplate_li").removeClass('inactive');
                $(".GenerateInstanceTemplate_li").find('a').css("pointer-events","all");
                $(".ImportInstanceData_li").removeClass('inactive');
                $(".ImportInstanceData_li").find('a').css("pointer-events","all");

                var obj1 = $('.NodeX_li').parents()[3];
                $(obj1).closest('div').hide();

            }
        }


        if(type == 'add')
        {
            $(".Save-icon").show();
            $(".Cancel-icon").show();
            if(is_instance == 'N')
            {
                $(".Subclass-icon").show();

                var status      =   $("#class_status").val();
                if(parseInt(status) == 1)
                {
                    $('.saveDraft').hide();
                }else
                {
                    $('.saveDraft').show();
                }
            }
            else
            {
                $('.saveDraft').show();
                $(".DeleteClasses_li").addClass('inactive');
                $(".DeleteClasses_li").find('a').css("pointer-events","none");
                $(".ExportInstanceData_li").addClass('inactive');
                $(".ExportInstanceData_li").find('a').css("pointer-events","none");
                $(".GenerateInstanceTemplate_li").addClass('inactive');
                $(".GenerateInstanceTemplate_li").find('a').css("pointer-events","none");
                $(".ImportInstanceData_li").addClass('inactive');
                $(".ImportInstanceData_li").find('a').css("pointer-events","none");
            }
        }

        var is_instance = $("#is_instance").val();
        if(is_instance =="N" && ($(".list-row.current").find('td:last').html()=="Published" && $(".list-row.current").data('versiontype') == 1))
        {
            $(".Version-icon").show();
            $(".Edit-icon").addClass('inactiveLink');
            $("a.Edit-icon").css("pointer-events","none");
            $('.saveDraft').hide();
        }
        else
        {
            $(".Version-icon").hide();
            $(".Edit-icon").removeClass('inactiveLink');
            $("a.Edit-icon").css("pointer-events","all");
        }

        if(is_instance == 'N')
        {
            if(type == 'listing')
            {
                var s       = $("#second-class-div #class_status").val();
                var t       = $("#second-class-div #node_type_id").val();
                var d       = $("#second-class-div #discendant_name").val();

                if(parseInt(t) == 1 || parseInt(t) == 3)
                {
                    $(".Instance-icon").hide();
                    $(".Instance-icon").addClass("inactiveLink");
                    $(".Instance-icon").css("pointer-events","none");

                    $(".Instance-Class-icon").hide();
                    $(".Instance-Class-icon").addClass("inactiveLink");
                    $(".Instance-Class-icon").css("pointer-events","none");
                }
                else
                {
                    if(parseInt(s) == 1)
                    {
                        if(d == 'Instance')
                        {
                            $(".Instance-icon").show();
                            $(".Instance-icon").removeClass("inactiveLink");
                            $(".Instance-icon").css("pointer-events","all");
                        }
                        else if(d == 'Instance Class')
                        {
                            $(".Instance-Class-icon").show();
                            $(".Instance-Class-icon").removeClass("inactiveLink");
                            $(".Instance-Class-icon").css("pointer-events","all");
                        }
                        else if(d == 'Both')
                        {
                            $(".Instance-icon").show();
                            $(".Instance-icon").removeClass("inactiveLink");
                            $(".Instance-icon").css("pointer-events","all");

                            $(".Instance-Class-icon").show();
                            $(".Instance-Class-icon").removeClass("inactiveLink");
                            $(".Instance-Class-icon").css("pointer-events","all");
                        }
                    }
                    else
                    {
                        $(".Instance-icon").hide();
                        $(".Instance-icon").addClass("inactiveLink");
                        $(".Instance-icon").css("pointer-events","none");

                        $(".Instance-Class-icon").hide();
                        $(".Instance-Class-icon").addClass("inactiveLink");
                        $(".Instance-Class-icon").css("pointer-events","none");
                    }
                }
            }
        }

        if(parseInt(nodeCounter) == 0)
        {
            $(".Nodex-icon").show();
            $(".Nodez-icon").show();
            nodeCounter = 1;
        }

        manageNodeXIcon();
    }

    var versionData = $("#node_y_class_id").attr('version-id');
    if(versionData == 1){
        var hl  = "<a style='display:block;' onclick='deleteClassPropertyVersion();' class='tooltip-item user-roles Cancel1-icon version-draft-icon' data-original-title='Cancel'><i class='icon cancel'></i><br><span>Cancel</span></a>";
            $("#version").html(hl);
            $(".Cancel-icon").hide();
    }

    dualPaneHeight()

    /* End manage right menu icon   */
}

/*Function to stop last element Tabing Because it was breaing the layout.*/
function StopTabBreak(element){

    $('.nano-content').removeAttr('tabindex');
    var id = $('#' + element +' li').last().children().find('input').last().attr('id');
    var firstID = $('#' + element +' li').first().children().find('input').first().attr('id');
    $('#'+id+', #'+firstID).keydown(function(e){

        var keyCode = e.keyCode || e.which;
        if (keyCode == 9) {

        e.preventDefault();
        }
    });
}

function nodeXShow()
{
    selectedNodeYId = 0;
    var mode = $("#second-class-div #prop_number").val();
    if($(".image-slider a").length > 2){

        if($("#node-x-li a").html()== "Node Z"){
            $(".Nodez-icon").show();
            $(".Nodex-icon").hide();
           if(currentmode == "Edit" || currentmode == "edit"){
                // alert('u want to change');
                 //if yes
                $("#node-x-li a").text("Node X");
                $("#node-x-li-properties a").text("Node X - Properties");

                if($(".image-slider a:first").text() == "Class Properties"){
                    $(".image-slider a:last").prev().text("Node X");
                    $(".image-slider a:last").text("Node X - Properties");

                } else {
                    $(".image-slider a:last").text("Node X");
                }
            } else {
                $("#node-x-li a").text("Node X");
                $("#node-x-li-properties a").text("Node X - Properties");
                if($(".image-slider a:first").text() == "Class Properties"){
                    $(".image-slider a:last").prev().text("Node X");
                    $(".image-slider a:last").text("Node X - Properties");

                } else {
                    $(".image-slider a:last").text("Node X");
                }
            }
        }

    } else{
            $("#node-x-li").show();
            $(".Nodex-icon").hide();
            $(".dashboard").animate({"margin-left": '-='+splitDashboardWidth});
            $('.listing-wrapper').removeClass('active');
            $('#div-node-x').addClass('active');
            $('#div-node-x-property').addClass('active');
            var panewidth = $('.content-wrapper-new').width();
            var threepanenode = panewidth/3
            $('.content-wrapper-new').find('.dashSlider.active').animate({'width':threepanenode},'3000');
            $(".breadcrumb li:first").removeClass('active');
            $("#node-x-li").addClass("active");
            $("#node-x-li-properties").addClass("active");
            $("#node-x-li a").text("Node X");
            $("#node-x-li-properties a").text("Node X - Properties");
            var snippet = '<a href="javascript:void(0);">Node X properties</a>';
            $(".image-slider").append(snippet);
            var liwidth = 0;
            $(".breadcrumb li.active").each(function(i,v){
                liwidth += $(v).outerWidth();
                $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
            });
            var firstNodewidth = $(".breadcrumb-wrap li:first").outerWidth();
            $(".image-slider").animate({
                     'marginLeft': '+='+firstNodewidth
                }, 200);

            $(".image-slider").css("width",liwidth);
            setTimeout(function(){
                var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');
                if(value != undefined){
                 pp =value.split(',');
                    for(i=0;i<pp.length;i++){
                        $('span[id='+pp[i]+']').css("visibility","visible");
                    }
                }

                 if(value != undefined){
                 pp =value.split(',');
                    for(i=0;i<pp.length;i++){
                        $('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
                    }
                }
               $('#third-class-div li:first').addClass("thirdPaneActive");

            },500);
            removeString();

    }

    $("#changeNodeType1").html('Node X (Class): List');
    var node_id     = $('.node-selected input').not('.self_count_class').val(); //modified by Divya Rajput on 10th June 2016
    var nodeName    = $('#second-class-div').find('div.node-selected .node-input span').html();
    var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');

    if(mode == undefined)
    {
        $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':1,'node_id':node_id,'nodeType':'Node X','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
    }
    else
    {
        /* Code by Arvind Soni */
        var is_ins_class = $('#second-class-div .node-selected .is_ins_class').val();
        if(is_ins_class==undefined){
            $.post(domainUrl+'classes/getNodeX',{'mode':'Edit','nodeTypeId':1,'node_id':node_id,'nodeType':'Node X','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
        }else {
            $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':1,'node_id':node_id,'nodeType':'Node X','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
        }
    }


    var is_instance = $("#is_instance").val();
        if($(".list-row.current").find('td:last').html()=="Published" && $(".list-row.current").data('versiontype') == 1)
            {
                $(".Version-icon").show();
                $(".Edit-icon").addClass('inactiveLink');
                $(".Edit-icon").css("pointer-events","none");
                $('.saveDraft').hide();
            }
            else
            {
                $(".Version-icon").hide();
                $(".Edit-icon").removeClass('inactiveLink');
                $(".Edit-icon").css("pointer-events","all");
            }

    //added-classes-unique on different panes
    var classes = ['paneNum1','paneNum2','paneNum3','paneNum4','paneNum5'];
    for(var i = 0; i <= classes.length; i++){
        $('.dashSlider').each(function(i,v){
           $(v).addClass(classes[i]);
        });
    }

    if($('.dashSlider').hasClass('customPaneSpanWidth')){
         $('.dashSlider').removeClass('customPaneSpanWidth');
    }
    addArrow();
}

function nodeZShow() {
    selectedNodeYId = 0;
    var mode = $("#second-class-div #prop_number").val();
    if($(".image-slider a").length > 2) {
        if($("#node-x-li a").html()== "Node X") {
            $(".Nodez-icon").hide();
            $(".Nodex-icon").show();
            if(currentmode == "Edit" || currentmode == "edit") {
                $("#node-x-li a").text("Node Z");
                $("#node-x-li-properties a").text("Node Z - Properties");
               if($(".image-slider a:first").text() == "Class Properties"){
                    $(".image-slider a:last").prev().text("Node Z");
                    $(".image-slider a:last").text("Node Z - Properties");

                } else {
                    $(".image-slider a:last").text("Node Z");
                }

            } else {
                $("#node-x-li a").text("Node Z");
                $("#node-x-li-properties a").text("Node Z - Properties");
               if($(".image-slider a:first").text() == "Class Properties"){
                    $(".image-slider a:last").prev().text("Node Z");
                    $(".image-slider a:last").text("Node Z - Properties");

                } else {
                    $(".image-slider a:last").text("Node Z");
                }
            }

        }
    } else {

      $("#node-x-li").show();
      //comment due to initally show in three pane not sliding
      $(".Nodez-icon").hide();
      $(".Nodex-icon").show();
      $(".dashboard").animate({"margin-left": '-='+splitDashboardWidth});
      $('.listing-wrapper').removeClass('active');
      $('#div-node-x').addClass('active');
      $('#div-node-x-property').addClass('active');
      var panewidth = $('.content-wrapper-new').width();
      var threepanenode = panewidth/3
      $('.content-wrapper-new').find('.dashSlider.active').animate({'width':threepanenode},'3000');
      $(".breadcrumb li:first").removeClass('active');
      $("#node-x-li").addClass("active");
      $("#node-x-li-properties").addClass("active");
      $("#node-x-li a").text("Node Z");
      $("#node-x-li-properties a").text("Node Z - Properties");
      var snippet = '<a href="javascript:void(0);">Node Z - Properties</a>';
      $(".image-slider").append(snippet);
      var liwidth = 0;
      $(".breadcrumb li.active").each(function(i,v) {
        liwidth += $(v).outerWidth();
        $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
      });
      var firstNodewidth = $(".breadcrumb-wrap li:first").outerWidth();
      $(".image-slider").animate({
        'marginLeft': '+='+firstNodewidth
      }, 200);
      $(".image-slider").css("width",liwidth);
      setTimeout(function() {
        var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');
        if(value != undefined) {
          pp = value.split(',');
          for(i=0;i<pp.length;i++) {
            $('span[id='+pp[i]+']').css("visibility","visible");
          }
        }
        if(value != undefined) {
          pp = value.split(',');
          for(i=0;i<pp.length;i++) {
            $('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
          }
        }
        $('#third-class-div li:first').addClass("thirdPaneActive");
      },500);
      removeString();
    }
    var nodeName    = $('#second-class-div').find('div.node-selected .node-input span').html();
    var node_id     = $('.node-selected input').not('.self_count_class').val(); //modified by Divya Rajput on 10th June 2016
    var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
    if(mode == undefined) {
        $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':3,'node_id':node_id,'nodeType':'Node Z','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
    } else {
      /* Code by Arvind Soni */
      var is_ins_class = $('#second-class-div .node-selected .is_ins_class').val();
      if(is_ins_class==undefined) {
          $.post(domainUrl+'classes/getNodeX',{'mode':'Edit','nodeTypeId':3,'node_id':node_id,'nodeType':'Node Z','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
      } else {
          $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':3,'node_id':node_id,'nodeType':'Node Z','nodeName':nodeName,'nodeIsChild':nodeIsChild},responseGetNodeX,'html');
      }
    }
    $("#changeNodeType1").html('Node Z (Class): List');
    var is_instance = $("#is_instance").val();
    if(is_instance == 'N' && ($(".list-row.current").find('td:last').html()=="Published" && $(".list-row.current").data('versiontype') == 1)) {
      $(".Version-icon").show();
      $(".Edit-icon").addClass('inactiveLink');
      $(".Edit-icon").css("pointer-events","none");
      $('.saveDraft').hide();
    } else {
      $(".Version-icon").hide();
      $(".Edit-icon").removeClass('inactiveLink');
      $(".Edit-icon").css("pointer-events","all");
    }
    //added-classes-unique on different panes
    var classes = ['paneNum1','paneNum2','paneNum3','paneNum4','paneNum5'];
    for(var i = 0; i <= classes.length; i++) {
      $('.dashSlider').each(function(i,v){
         $(v).addClass(classes[i]);
      });
    }
    if($('.dashSlider').hasClass('customPaneSpanWidth')){
       $('.dashSlider').removeClass('customPaneSpanWidth');
    }
    addArrow();
}

/*Created By Divya*/
function openDialogPopup() {
  var filename            = $('#import_instance_file').val();
  filename                = filename.split('.');
  var filename_extension  = $.trim(filename[filename.length-1]);
  /*used to check csv validation*/
  if(filename_extension == 'csv') {
    $('#filePopup').modal('show');
  } else {
    $('#csvfilePopup').find('.series-content p').text("This file format is not in a proper format. Please use csv file format.");
    $('#csvfilePopup').modal('show');
  }
}

//* created By Divya Rajput
//* For download csv file
//* for exporting csv/**/
function responseExportInstanceCallAction(data,source) {
  NProgress.start();
  window.location.href=data.path;
  NProgress.done();
}

function manageNodeXIcon() {
  var is_instance = $("#is_instance").val();
  if(is_instance == 'N') {
    if($("#div-node-x").hasClass('active')) {
        $(".Nodex-icon").hide();
    } else {
        $(".Nodex-icon").show();
        $(".Nodez-icon").show();
        $("#node-x-li").hide();
    }
    if($("#node-x-li a").html()=='Node X') {
      $(".Nodez-icon").show();
    } else {
      $(".Nodex-icon").show();
    }
  } else {
    $(".Nodez-icon").hide();
    $(".Nodex-icon").hide();
    $("#node-x-li").hide();
  }
  removeString();
}

function removeString() {
  var nodeType = 'Y';
  if($.trim($("#node_y_class_id").val()) == "") {
    if(initalNodeType == 1) {
      nodeType = 'X';
    } else  if(initalNodeType == 2) {
      nodeType = 'Y';
    } else {
      nodeType = 'Z';
    }
    var selectedVal = $("#post_name").text();
    $("#second-class-div-heading").html("Node "+nodeType+" (Properties): "+selectedVal);
    $(".display-wrapper #second-class-div-heading").attr('alt',"Node "+nodeType+" (Properties): "+selectedVal);
  }
  var str = $(".display-wrapper #second-class-div-heading").attr('alt');
  if($.trim(str) != '') {
    var flyMode = $(".image-slider a").length;
    var string  = '',withStr='';
    string  = str.split(":");
    if(flyMode > 2) {
      if(string[1]!='' && string[1]!=undefined) {
        if(string[1].length > 7) {
          newVar  = string[1].substr(0,7);
          withStr = string[0]+': '+newVar+'...';
          $("#second-class-div-heading").html(withStr);
        } else {
          withStr = string[0]+': '+string[1];
          $("#second-class-div-heading").html(withStr);
        }
      }
    } else {
      if(string[1]!='' && string[1] != undefined) {
        if(string[1].length > 37) {
          newVar  = string[1].substr(0,37);
          withStr = string[0]+': '+newVar+'...';
          $("#second-class-div-heading").html(withStr);
        } else {
          withStr = string[0]+': '+string[1];
          $("#second-class-div-heading").html(withStr);
        }
      }
    }
  }
}

function setInitalBreadCrumb(tempControler,tempAction) {
  if(tempAction!="addNewInstance") {
    $(".image-slider").css("marginLeft",'0px');
    $('.image-slider a').each(function(i,v) {
      if(i > 1) {
        $(v).remove();
      }
    });
    $('.breadcrumb li').removeClass('active').hide();
    $('.breadcrumb li.non-ins').addClass('active').show();

    var liwidth = 0;
    if(tempControler == 'menudashboard' && tempAction == 'index') {
      $('.non-ins a:first').text('Course List')
      $('.non-ins a:last').text('Course Detail');

    } if(tempControler == 'classes' && tempAction == 'index') {
      $('.non-ins a:first').text('Class List')
      $('.non-ins a:last').text('Class Properties');
    }

    $(".breadcrumb li.active").each(function(i,v) {
      liwidth += $(v).outerWidth();
      $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
    });
    $(".image-slider").css("width",liwidth);
  }
}

/*code here to drag and drop filde in folder class*/
function DragDropFolderCall() {
  var obj = $("#dragandrophandler");
  var obj1 = $("#dragandrophandler li");
  obj1.on('dragover', function (e) {
     var currentTarget = e.target;
     $("#FolderList li").removeClass("folder-hover-active");
     $(currentTarget).closest('li.drag-folder').addClass("folder-hover-active");
     e.stopPropagation();
     e.preventDefault();
  });
  obj.on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).css('border', '2px solid #0B85A1');
  });
  obj.on('dragover', function (e) {
     e.stopPropagation();
     e.preventDefault();
  });
  obj.on('drop', function (e) {
     e.preventDefault();
     var currentTarget = e.target;
     var files = e.originalEvent.dataTransfer.files;
     //We need to send dropped files to Server
     if(files.length >0) {
        $("#FolderList li").removeClass("active folder-hover-active");
        $(currentTarget).closest('li.drag-folder').addClass("active");
        oddEvenColor();
     } else {
       $("#FolderList li").removeClass("folder-hover-active");
     }
     handleFileUpload(files,obj);
  });
  $(document).on('dragenter', function (e) {
    var dt = e.originalEvent.dataTransfer;
    dt.effectAllowed = dt.dropEffect = 'none';
    e.stopPropagation();
    e.preventDefault();
  });
  $(document).on('dragover', function (e) {
    $(".document-table").find(".statusbar").remove();
    var dt = e.originalEvent.dataTransfer;
    dt.effectAllowed = dt.dropEffect = 'none';
    $("#FolderList li").removeClass("folder-hover-active");
    e.stopPropagation();
    e.preventDefault();
    obj.css('border', '2px dotted #0B85A1');
  });
  $(document).on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
}
/*code here srart for drag and drop from browser */

function sendFileToServer(formData,status) {
  var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
  formData.append('folderId',folderId);
  var extraData ={}; //Extra Data.
  var jqXHR=$.ajax({
    xhr: function() {
      var xhrobj = $.ajaxSettings.xhr();
      if (xhrobj.upload) {
        xhrobj.upload.addEventListener('progress', function(event) {
          var percent = 0;
          var position = event.loaded || event.position;
          var total = event.total || event.totalSize;
          percent = Math.round(position/total*100);
          //Set progress
            status.setProgress(percent);
        }, false);
      }
      return xhrobj;
    },
    url : domainUrl+'documents/saveFolderFile',
    type: "POST",
    contentType:false,
    processData: false,
    cache: false,
    data: formData,
    success: function(data){
      status.setProgress(200);
      $("#status1").append("File upload Done1<br>");
    }
  });
  status.setAbort(jqXHR);
}

var popNotHide = true;
function createStatusbar(obj) {
    documentrowCount++;
    var row ="odd";
    if(documentrowCount %2 ==0) row ="even";
    this.statusbar = $("<div class='statusbar "+row+"'></div>");
    this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
    this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
    this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
    this.abort = $("<div class='abort icon close'></div>").appendTo(this.statusbar);
    $(".document-table").find("#status2").after(this.statusbar);
    $("#folderDocumentModal").modal('show');

    this.setFileNameSize = function(name,size,totalFiles) {
        popNotHide = true;
        $("#folderDocumentModal").find('.btn-black').addClass('hide');
        var sizeStr="";
        var sizeKB = size/1024;
        if(parseInt(sizeKB) > 1024) {
          var sizeMB = sizeKB/1024;
          sizeStr = sizeMB.toFixed(2)+" MB";
        } else {
          sizeStr = sizeKB.toFixed(2)+" KB";
        }
        var checkExt = name.split(".");
        if(name.indexOf('.') >= 0) {
          if(checkExt[1].toLowerCase()== "docx" || checkExt[1].toLowerCase()== "doc") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase()== "xlsx" || checkExt[1].toLowerCase()== "xls") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase()== "csv") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase()== "pdf") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase()== "ppt") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase() == "jpeg" || checkExt[1].toLowerCase() == "jpg") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase() == "png") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase() == "gif") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase() == "zip") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else if(checkExt[1].toLowerCase() == "rar") {
            this.filename.html(name);
            this.size.html(sizeStr);
          } else {
            allInvalidFileCount++;
            if(totalFiles == 1 || totalFiles == allInvalidFileCount) {
              popNotHide = false;
              $("#folderDocumentModal").find('.btn-black').removeClass('hide');
            }
            this.filename.html(name);
            this.size.html("Invalid File Format");
            this.progressBar.remove();
            this.statusbar[0].classList.add("Invalidfile");
          }
        } else {
          allInvalidFileCount++;
          if(totalFiles == 1 || totalFiles == allInvalidFileCount) {
            popNotHide = false;
            $("#folderDocumentModal").find('.btn-black').removeClass('hide');
            completestatusCount = 0;
          } else {
            completestatusCount++;
          }
          this.filename.html(name);
          this.size.html("Invalid File Format");
          this.progressBar.remove();
          this.statusbar[0].classList.add("Invalidfile");
          NProgress.done();
        }
        $("#folderDocumentModal .niceScrollDivModal").niceScroll({
            cursorcolor: "#000",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "2px",
            background: 'rgba(0,0,0,.15)'
        });
    }
    this.setProgress = function(progress) {
      var progressBarWidth = progress*this.progressBar.width()/ 100;
      this.progressBar.find('div').animate({ width: progressBarWidth}, 10,function() {
        ++documentcount;
        if(documentcount == documentrowCount*2 ) {
          setTimeout(function(){
              if(popNotHide != false) {
                $("#folderDocumentModal").find('.btn-black').addClass('hide')
                popNotHide = true;
                allInvalidFileCount= 0;
              }
          },2000);
        }
      }).html("progress + "% "");
      if(parseInt(progress) >= 200)  {
        completestatusCount++;
        var classCount  = this.statusbar[0].classList.length;
        if(classCount < 3) {
         this.progressBar.remove();
         this.abort.remove();
         this.completedstatus = $("<div class='completestatus'>Uploaded</div>").appendTo(this.statusbar);
        }
        var totalFiles = $('.statusbar').length;
        if(totalFiles == completestatusCount) {
          setTimeout(function() {
            completestatusCount = 0;
            if(popNotHide != false) {
              $("#folderDocumentModal").modal('hide');
              setTimeout(function() {
                var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
                NProgress.start();
                $.post(domainUrl+'documents/folderDetails',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal','class_node_id':folderId},responseCallFolderDetailsAction,'html');
              },500);
              popNotHide = true;
            }
          },500);
        }
      }
    }
    this.setAbort = function(jqxhr) {
      var sb = this.statusbar;
      this.abort.click(function() {
        jqxhr.abort();
        sb.remove();
        var filesCount = $('.statusbar').length
        if(filesCount < 1) {
            $("#folderDocumentModal").modal('hide');
            completestatusCount = 0;
        }
      });
    }
}
function handleFileUpload(files,obj) {
    $(".document-table").find("#status2").html('');
    allInvalidFileCount= 0;
    documentrowCount =0;
    documentcount = 0;
   for (var i = 0; i < files.length; i++) {
      var fd = new FormData();
      fd.append('file', files[i]);
      var status = new createStatusbar(obj); //Using this we can set progress.
      status.setFileNameSize(files[i].name,files[i].size,files.length);
      sendFileToServer(fd,status);
   }
}

/*code here to drag and drop file in document right pane*/
function DragDropFolderDocumentDetailsCall() {
    var obj = $("#dragandrophandler1");
    obj.on('dragenter', function (e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).css('border', '2px solid #0B85A1');
    });
    obj.on('dragover', function (e) {
      $("#FolderList li").removeClass("folder-hover-active");
      $(".document-table").find(".statusbar").remove();
      e.stopPropagation();
      e.preventDefault();
    });
    obj.on('drop', function (e) {
      $(this).css('border', '2px dotted #0B85A1');
      e.preventDefault();
      var files = e.originalEvent.dataTransfer.files;
      //We need to send dropped files to Server
      handleFileUploadFolderDocument(files,obj);
    });
    $(document).on('dragenter', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
    $(document).on('dragover', function (e) {
      e.stopPropagation();
      e.preventDefault();
      obj.css('border', '2px dotted #0B85A1');
    });
    $(document).on('drop', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
}
/*end code here*/

function sendFileToServerFolderDocument(formData,status) {
    var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
    formData.append('folderId',folderId);
    var extraData ={}; //Extra Data.
    var jqXHR=$.ajax({
      xhr: function() {
        var xhrobj = $.ajaxSettings.xhr();
        if (xhrobj.upload) {
          xhrobj.upload.addEventListener('progress', function(event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total || event.totalSize;
            percent = Math.round(position/total*100);
            //Set progress
            status.setProgress(percent);
          }, false);
        }
        return xhrobj;
      },
      url : domainUrl+'documents/saveFolderFile',
      type: "POST",
      contentType:false,
      processData: false,
      cache: false,
      data: formData,
      success: function(data){
        status.setProgress(200);
      }
    });
    status.setAbort(jqXHR);
}

var popNotHide = true;

function createStatusbarFolderDocument(obj) {
    documentrowCount++;
    var row="odd";
    if(documentrowCount %2 ==0) row ="even";
    this.statusbar = $("<div class='statusbar "+row+"'></div>");
    this.filename  = $("<div class='filename'></div>").appendTo(this.statusbar);
    this.size      = $("<div class='filesize'></div>").appendTo(this.statusbar);
    this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
    this.abort     = $("<div class='abort icon close'></div>").appendTo(this.statusbar);
    obj.after(this.statusbar);
    $(".document-table").find("#status2").after(this.statusbar);
    $("#folderDocumentModal").modal('show');
    this.setFileNameSize = function(name,size,totalFiles) {
        $("#folderDocumentModal").find('.btn-black').addClass('hide');
        popNotHide = true;
        var sizeStr="";
        var sizeKB = size/1024;
        if(parseInt(sizeKB) > 1024) {
            var sizeMB = sizeKB/1024;
            sizeStr = sizeMB.toFixed(2)+" MB";
        } else {
            sizeStr = sizeKB.toFixed(2)+" KB";
        }
        var checkExt = name.split(".");
        if(name.indexOf('.') >= 0) {
            if(checkExt[1].toLowerCase()=="docx" || checkExt[1].toLowerCase()=="doc") {
                this.filename.html(name);
                this.size.html(sizeStr);
            }
            else if(checkExt[1].toLowerCase()== "xlsx" || checkExt[1].toLowerCase()== "xls") {
                this.filename.html(name);
                this.size.html(sizeStr);
            }
            else if(checkExt[1].toLowerCase()== "csv") {
                this.filename.html(name);
                this.size.html(sizeStr);
            }
            else if(checkExt[1].toLowerCase()== "pdf") {
              this.filename.html(name);
              this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "ppt") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "jpeg" || checkExt[1].toLowerCase() == "jpg") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "png") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "gif") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "zip") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else if(checkExt[1].toLowerCase() == "rar") {
                this.filename.html(name);
                this.size.html(sizeStr);
            } else {
               allInvalidFileCount++;
                if(totalFiles == 1 || totalFiles == allInvalidFileCount){
                    popNotHide = false;
                    $("#folderDocumentModal").find('.btn-black').removeClass('hide');
                }
                this.filename.html(name);
                this.size.html("Invalid File Format");
                this.progressBar.remove();
                this.statusbar[0].classList.add("Invalidfile");
            }
        }
        else {

            allInvalidFileCount++;
            if(totalFiles == 1 || totalFiles == allInvalidFileCount){
                popNotHide = false;
                $("#folderDocumentModal").find('.btn-black').removeClass('hide');
                completestatusCount = 0;
            } else {
                completestatusCount++;
            }
            this.filename.html(name);
            this.size.html("Invalid File Format");
            this.progressBar.remove();
            this.statusbar[0].classList.add("Invalidfile");
            NProgress.done();
        }
            $("#folderDocumentModal .niceScrollDivModal").niceScroll({
                cursorcolor: "#000",
                cursorborder: "0",
                cursorborderradius: '0',
                cursorwidth: "2px",
                background: 'rgba(0,0,0,.15)'
            });

    }

    this.setProgress = function(progress) {
      var progressBarWidth = progress*this.progressBar.width()/ 100;
      this.progressBar.find('div').animate({ width: progressBarWidth}, 10,function(){
         documentcount++;
         if(documentcount == documentrowCount*2 ) {
          setTimeout(function(){
            if(popNotHide != false) {
              $("#folderDocumentModal").find('.btn-black').addClass('hide')
              popNotHide = true;
              allInvalidFileCount = 0;
            }
          },2000);
         }
      }).html("progress + "% "");
      if(parseInt(progress) >= 200) {
       var classCount  = this.statusbar[0].classList.length;
       completestatusCount++;
       if(classCount < 3) {
         this.progressBar.remove();
         this.abort.remove();
         this.completedstatus = $("<div class='completestatus'>Uploaded</div>").appendTo(this.statusbar);
       }
       var totalFiles = $('.statusbar').length;
       if(totalFiles == completestatusCount) {
          setTimeout(function() {
            completestatusCount = 0;
            if(popNotHide != false) {
              $("#folderDocumentModal").modal('hide');
              setTimeout(function() {
                var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
                NProgress.start();
                $.post(domainUrl+'documents/folderDetails',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal','class_node_id':folderId},responseCallFolderDetailsAction,'html');
              },500);
            }
          },500);
       }
      }
    }
    this.setAbort = function(jqxhr) {
      var sb = this.statusbar;
      this.abort.click(function() {
          jqxhr.abort();
          sb.remove();
          var filesCount = $('.statusbar').length
          if(filesCount < 1) {
            $("#folderDocumentModal").modal('hide');
            completestatusCount = 0;
          }
      });
    }
}
function handleFileUploadFolderDocument(files,obj) {
   allInvalidFileCount= 0;
   documentrowCount = 0;
   documentcount = 0;
   for (var i = 0; i < files.length; i++) {
    var fd = new FormData();
    fd.append('file', files[i]);

    var status = new createStatusbarFolderDocument(obj); //Using this we can set progress.
    status.setFileNameSize(files[i].name,files[i].size,files.length);
    sendFileToServerFolderDocument(fd,status);
   }
}
/*function here for create sub folder on click + icon from left panel folder*/

function createSubfolder(folderId) {
  $("#createSubFolder").modal('show').on('shown.bs.modal', function() {
    $(this).find('input[type="text"]').focus();
    $("#createSubFolder .btn ").first().addClass("inactiveLink");
  });

  $('body').on('keyup','#Folder_sub_name',function() {
    if($(this).val().length>0 && $.trim($(this).val())!="") {
      $("#createSubFolder .btn ").removeClass("inactiveLink");
    } else {
      $("#createSubFolder .btn").first().addClass("inactiveLink");
    }
    if($(this).val().length<51){
      var getCount = $(this).val().length;
      $(this).siblings('.char-limit').find('.charCount').text(getCount);
    }
  });

  $("#Folder_sub_name").val("");
  $('.charCount').text(0);
}

function createRootfolder() {
  $("#createRootFolder").modal('show').on('shown.bs.modal', function() {
    $(this).find('input[type="text"]').focus();
    $("#createRootFolder .btn").first().addClass("inactiveLink");
  });
  $('body').on('keyup','#Folder_root_name',function() {
    if($(this).val().length > 0 && $.trim($(this).val()) != "") {
      $("#createRootFolder .btn ").removeClass("inactiveLink");
    } else {
      $("#createRootFolder .btn").first().addClass("inactiveLink");
    }
    if($(this).val().length < 51) {
      var getCount = $(this).val().length;
      $(this).siblings('.char-limit').find('.charCount').text(getCount);
    }
  });
  $("#Folder_root_name").val("");
  $('.charCount').text(0);
}

function responsecourseDisplayList() {
    $('.list-tab a').addClass('active');
    $("#center-screen, #ControlBar, .pui_center_content, #calender-screen, #actors-screen, #documents-screen, #canvas-screen, #main-screen").hide();
    $("#menudashboard").html(data).show();

    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
    $("#new_course_action_menu").show();
    $("#course_action_menu").hide();

    setColumnsH();
    $('#newDocumentFlyout').animate({right:'-100%'},300).removeClass('in');
    $('#openCourseFlyout').animate({left:0},300).removeClass('in');
    $('.loadder').hide();
    var activeNode = $(".courseboard-table tr.current").attr('data-id');
    if(activeNode == undefined) {
        activeNode = "";
    }
    $.post(domainUrl+'menudashboard/courseView',{'node_instance_id':activeNode},responseCallcourseViewAction,'html');
    dualPaneHeight();
    hitName = '';
    dashboardInitalLoad();
    NProgress.done();
}
/* end code here */


/*
* Added By:Divya Rajput
* On Date: 29th July 2016
* Purpose: To show Actor/Role/Terms on resources
*/
function editorLoadTags(){
    edtTagArray     = [];
    var tempArray   = [];

    $("#edt .actor").each(function(index, element) {
        var getElm = $.trim($(this).text());
        if(tempArray.indexOf(getElm)==-1){
            edtTagArray.push({"type":"Actor","tag":getElm});
            tempArray.push(getElm);
        }
    });

    $("#edt .role").each(function(index, element) {
        var getElm = $.trim($(this).text());
        if(tempArray.indexOf(getElm)==-1){
            edtTagArray.push({"type":"Role","tag":getElm});
            tempArray.push(getElm);
        }
    });

    $("#edt .terms").each(function(index, element) {
        var getElm = $.trim($(this).text());
        if(tempArray.indexOf(getElm)==-1){
            edtTagArray.push({"type":"Terms","tag":getElm});
            tempArray.push(getElm);
        }
    });

    highlightText(tagStatus);
}
window.puJsFileLoadCounter++;
/*End Here*/
