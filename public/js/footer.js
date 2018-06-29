<!-- Added the script from the footer.html  so that it can work on inner pages rather than the loader page.-->
jQuery(function()
{
    var number_print = [];

    $('#dialogueFlyout').on('shown.bs.tab', function(event){
        $('.nano').nanoScroller();
    });

    $('body').on('click','li#dashboard-navigation.active._active span.dashboards div.menu-wrapper div.nanor div.nano-content ul.menu-items',function(){
        $(this).click();
    });


    /*Vimal Code to stop flickering on menu on the left <Accordian>*/
    // $('body').on('click', '.modal-backdrop', function() {
    //     $(this).hide();
    //     $('.modal').removeClass('in');
    //         setTimeout (function(){
    //           $('.modal').modal('hide');
    //         },500);
    //     $('.cancelIcon').click();
    //     $('.Save-icon').hide();
    // });

    //$('div.panel.panel-default h4.item-title').click();
    $('body').on('click', '.helpnodeFlyout', function(e) {
        e.preventDefault();
        DialogueFlyout();
        //var zIndexNodeFlyout = $('#nodeFlyout').css('z-index');
        //$('#nodeFlyout').css('z-index',parseInt(zIndexNodeFlyout) + 1);

        $('.user-action-wrap').addClass('stopMouseHover');
        $(this).addClass('helpClass');
        if ($('.helpnodeFlyoutmodal').hasClass('in')) {
            setTimeout (function(){
                $('.helpnodeFlyoutmodal').modal('hide');
            },500);

            $('.helpnodeFlyoutmodal').removeClass('in');
            $('.cancelIcon, .shareIcon, .printIcon').hide();
            $('.modal-backdrop.backdrop-2').hide();
            if (!$('#dialogueFlyout').hasClass('in') || $('.helpnodeFlyoutmodal').hasClass('in')) {
                $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').removeClass('disabled');
            }
            $('.DialogueCancel').hide();

            // $('.user-action-wrap').removeClass('rightSideBg');
            $('.user-action-wrap').removeClass('stopMouseHover');
            //    closeUserActionIcon();
            $(this).removeClass('helpClass');
            for (var i in iconArr) {
                $('.user-action-wrap a[data-original-title='+iconArr[i]+']').css("display","block");
            }
            iconArr = [];

        } else {
            // $('.dropdown-menu').click();
            $('.helpnodeFlyoutmodal').modal('show');
            $('.helpnodeFlyoutmodal').addClass('in');
            $('.modal-backdrop').each(function(i, v) {
                var get = $(this).attr('class').split(" ").filter(function(v, i) {
                    return v.indexOf('backdrop') === 0;
                }).join();
                if (get == "") {
                    if ($('#dialogueFlyout').hasClass('in')) {
                        $(this).addClass('backdrop-2').hide();
                    } else {
                        $(this).addClass('backdrop-2').show();
                    }
                } else {
                    if ($('#dialogueFlyout').hasClass('in')) {
                        $('.modal-backdrop.backdrop-2').hide();
                    } else {
                        $('.modal-backdrop.backdrop-2').show();
                    }
                }

            })
            //  openUserActionIcon();
            $('.cancelIcon, .shareIcon, .printIcon').show();

            if ($('#dialogueFlyout').hasClass('in') || $('#helpnodeFlyout').hasClass('in')) {
                $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').addClass('disabled');
                $('.DialogueCancel').hide();

            }

            //$('.user-action-wrap').addClass('rightSideBg');
            $('.user-action-wrap').addClass('stopMouseHover');
            $(this).addClass('helpClass');
        }
        $(".nano").nanoScroller();
        backdropHeight();
    });

    $('body').on('click', '.cancelIcon', function() {
        $('.user-action-wrap').removeClass('stopMouseHover');
        $('.helpnodeFlyoutmodal').removeClass('in');
        $('.modal-backdrop.backdrop-2').hide();
        $(this).hide();
        $('.shareIcon, .printIcon').hide();

        if (!$('#dialogueFlyout').hasClass('in') ||  $('.helpnodeFlyoutmodal').hasClass('in')) {
            $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').removeClass('disabled');
        } else {
            $('.DialogueCancel').show();
        }

        // if($(this).parent().hasClass('rightSideBg')){
        //     $(this).parent().removeClass('rightSideBg');
        //     $('.user-action-wrap').removeClass('stopMouseHover');
        // }
        closeUserActionIcon();
        if($('.user-img').hasClass('openChat')){
            $(".close-chat").show();
        }
        $(this).parent().children('a.helpClass').removeClass('helpClass');
    });

    /*=======open dialogue div on click of user============*/

    $('body').on('click', '.user-tab', function() {
        $('.user-action-wrap a').last().removeClass('helpClass');
        if ($('#dialogueFlyout').hasClass('in')) {
            $('.user-action-wrap').removeClass('rightSideBg');
            $('.user-action-wrap').removeClass('stopMouseHover');
            $('#dialogueFlyout').removeClass('in');
            // @vimal code for highlighting of animations
            var x = 0;
            var intervalID = setInterval(function () {
                $(".sm-user-icon").toggleClass("drop-shadow");

                if (++x ===5) {
                    if($(".sm-user-icon").hasClass("drop-shadow")){
                        $(".sm-user-icon").removeClass("drop-shadow");
                    }

                    window.clearInterval(intervalID);

                    //return false;
                }
            },280);

            setTimeout (function(){
                $('#dialogueFlyout').modal('hide');
            },600);

            $('.DialogueCancel').hide();
            $('.modal-backdrop.backdrop-1').hide();
            //$('.prev, .next').show();
            if (!$('#dialogueFlyout').hasClass('in') ||  $('.helpnodeFlyoutmodal').hasClass('in')) {
                $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').removeClass('disabled');
            }
        } else {

            //$('.user-action-wrap a').last().addClass('helpClass')
            $('.user-action-wrap').addClass('rightSideBg');
            $('.user-action-wrap').addClass('stopMouseHover');
            $('#dialogueFlyout').modal('show');
            $('#dialogueFlyout').addClass('in');
            $(".nano").nanoScroller();
            //$('.prev, .next').hide();
            $('.modal-backdrop').each(function(i, v) {
                var get = $(this).attr('class').split(" ").filter(function(v, i) {
                    return v.indexOf('backdrop') === 0;
                }).join();
                if (get == "") {
                    $(this).addClass('backdrop-1').show();
                } else {
                    $('.modal-backdrop.backdrop-1').show();
                }

            });
            $('.DialogueCancel').show();
            if ($('#dialogueFlyout').hasClass('in') ||  $('.helpnodeFlyoutmodal').hasClass('in')) {

                $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').addClass('disabled');
            }
        }

        if ( $('.helpnodeFlyoutmodal').hasClass('in')) {
            $('.helpnodeFlyoutmodal').removeClass('in');
            $('.cancelIcon').hide();
            //$('.modal-backdrop').hide();
            if (!$('#dialogueFlyout').hasClass('in') ||  $('.helpnodeFlyoutmodal').hasClass('in')) {

                $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').removeClass('disabled');
            }
            $('.modal-backdrop.backdrop-2').hide();
        }
        DialogueFlyout();
        backdropHeight();
    });

    $('body').on('click', '#dialogueFlyout a[data-toggle="tab"]', function() {
        $(".nano").nanoScroller();
    });

    $('body').on('click', '.DialogueCancel', function() {
        $('#dialogueFlyout').removeClass('in');
        $('.modal-backdrop.backdrop-1').hide();
        $(this).hide();
        if ($('#dialogueFlyout').hasClass('in') ||  $('.helpnodeFlyoutmodal').hasClass('in')) {

            $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').addClass('disabled');
        } else {

            $('.user-action-wrap .nextShow,.user-action-wrap .prevShow').removeClass('disabled');
        }

        // Code to remove the highlighted right side backgroundColor
        if($(this).parent().hasClass('rightSideBg')){
            $(this).parent().removeClass('rightSideBg');
            $('.user-action-wrap').removeClass('stopMouseHover');
        }
        $(this).parent().children('a.helpClass').removeClass('helpClass');
    });

    /* Sub Classes Flyout */
    $('body').on('click','.plusIcon',function(e){
        $("#main_action_menu").hide();
        $("#sub_class_action_menu").show();
        $(".sub_class_action_menu1").show();

        /*
        * Modified by Divya Rajput
        * ON Date: 23 DEC 2015
        * To uncheck all checkbox by default
        */
        $('#customPopUp .child_class_ids').prop('checked', false);
        $('#search-subclass').val('');  //to show search subclasses field blank when click on "Add sub class"
        /*END HERE*/

        $.post(domainUrl+'classes/getNodeYClass',{'node_class_id':$("#node_y_class_id").val(),'childs':$("#child_ids_of_class").val()},responseGetNodeYClass,'html');
        e.stopPropagation();
        //  var heightCustomPop = $('.customPopUp').outerHeight() - $('.footer-temp').outerHeight();
        //  var widthCustomPop  = $('#second-class-div').outerWidth();
        // $('.customPopUp').css('height',heightCustomPop);
        // $('#customPopUp').css('wdith',widthCustomPop);
        // $('#search-subclass').val("");
        $('.customPopUp').modal('show');
        $('.customPopUp').append('<div class="blackOverlay_subClass"></div>');
        $('.modal-backdrop').addClass('backdrop-2');
        // $('.customPopUp').show();

        if($(window).width() <=1024 ){
            $("body").addClass('fixedDialogueWindow');
        }
    });

    $('body').on('click','.customPopUpClose',function(){
        $("#main_action_menu").show();
        $("#sub_class_action_menu").hide();
        $(".sub_class_action_menu1").hide();
        $('.customPopUp').modal('hide');
        $('.customPopUp').removeClass('in');
        $('.customPopUp').css('height','100%');
        $('.modal-backdrop.in').removeClass('backdrop-2');
    });

    /**
     * Commented By Divya Rajput
     * Created On nov 24th, 2015
     * for searching subclasses functionality
     */
    jQuery('#search-subclass').keyup(function(){
        var search_subclass = $(this).val();
        $.post(domainUrl+'classes/getNodeYClass',{'node_class_id':$("#node_y_class_id").val(),'childs':$("#child_ids_of_class").val(),'search_text':search_subclass},responseGetNodeYClass,'html');
    });

    /**
     * Commented By Divya Rajput
     * Created On nov 24th, 2015
     * for searching subclasses functionality
     */
    /*$('body').on('click','.AddNewAssociation_li',function(){
        $('#association_action_menu .user-roles').css('display','none');
        $('.save-association').css('display','block');
        $("#association_action_menu").show();
    });*/
    /*END HERE*/
});

function responseGetNodeYClass(data,source)
{
    $(".childClassDivFlyout").html(data);
    $('.blackOverlay_subClass').remove();
    // dualPaneHeight();
    sideFlyoutHeight();
    $(".nano").nanoScroller();
}

function saveChildClass()
{
    var ids                 = "";
    /*var is_new              = "";*/
    var class_id            = parseInt($("#node_y_class_id").val()) ? parseInt($("#node_y_class_id").val()) : parseInt($("#class_caption").val());
    var htmlContent         = "";
    var sub_class_id        = "";
    var node_subclass_id    = "";
    var remove_subclass_id  = "";


    var classdata           = [];
    var subclassdata        = [];
    var finalclassdata      = [];
    var intValArray         = [];
    var temp_sub_class_id   = [];
    var temp_sub_class_idA  = [];
    var checked_count       = 0;
    var number_print        = [];
    var tempCount           = 0;


    /**
     * Created By: DIVYA RAJPUT
     * Date: Dec 28, 2015
     * This is used to search and add subclasses in hidden fileds
     */
    var searchclass_value   = $.trim($('#search-subclass').val());
    var hiddenclass_value   = $.trim($('#child_ids_of_class').val());
    /*END HERE*/

    /**
     * Created By: DIVYA RAJPUT
     * Date: Nov 20, 2015
     * This is used to get subclass id of subclasses
     */
    $('li.parent-sub-class-list').each(function(i){
        classdata[i]        = $(this).find('div.node-input span > input').attr('class').split('temp-sub-class-');
        finalclassdata[i]   = parseInt($.trim(classdata[i][1]));
    });
    /*END HERE*/

    number_print[checked_count] = parseInt($('span.number_print').length) + 1;
    checked_count++;
    $('#customPopUp .child_class_ids').each(function(j){

        if($(this).prop('checked'))
        {
            if($(this).val() !== 'add_new_sub')
            {
                ids                 = ids+','+ parseInt($(this).val());
                sub_class_id        = parseInt($.trim($(this).val()));
                subclassdata[j]     = sub_class_id;
                node_subclass_id    = $(this).closest('li').find('.node_subclass').val();

                temp_sub_class_idA[tempCount]     = node_subclass_id;
                tempCount++;

                if($.inArray( sub_class_id, finalclassdata )  !== -1 ){

                }else{
                    htmlContent     = htmlContent + '<li class="parent-sub-class-list"><div class="node-content clearfix" onclick="getSubClassStructure('+node_subclass_id+', '+sub_class_id+', this)"><span class="number_print1 testsi-'+node_subclass_id+'"></span><input type="hidden" class="self_count_class" value=""/><div class="node-left"><div class="node-circle node-white-circle-expanded">N</div><div class="node-head node-input"><span class="sub-class-style"><input type="hidden" class="temp-sub-class-'+sub_class_id+'">'+$(this).attr('alt').toUpperCase()+' ('+$(this).val()+')</span></div></div><div class="node-right-sub clearfix"><a class="action-move act-mov-sub"><span><i class="fa fa-angle-up"></i></span></a><span><a class="action-move act-mov-sub-cross delete-icon" onclick="deleteSubClass('+"this"+','+"''"+',event,'+sub_class_id+')"><span><i class="icon close-small"></i></span></a></span></div></div></li>';
                    number_print++;
                }
            }

            /*if($(this).val() == 'add_new_sub')
            {
                is_new              = "add_new_sub";
            }*/

        }else{
            intValArray[j]            = parseInt($(this).val());
        }
    });

    /**
     * Created By: DIVYA RAJPUT
     * Date: Nov 20, 2015
     * This is used to remove subclasses when unchecked checkbox subclasses*/
    if(searchclass_value === ''){
        var difference = [];

        jQuery.grep(finalclassdata, function(el) {
            if (jQuery.inArray(el, subclassdata) == -1) difference.push(el);
        });

        for(k=0; k<difference.length; k++){
            remove_subclass_id  = parseInt($.trim(difference[k]));
            $('.temp-sub-class-'+remove_subclass_id).closest('li').remove();
        }
    }else{
        if(intValArray.length > 0){
            for(var i=0; i<intValArray.length; i++) {

                var testvalue   = ','+parseInt(intValArray[i]);
                if (hiddenclass_value.indexOf(testvalue) > -1) {
                    hiddenclass_value = hiddenclass_value.replace(testvalue, '');
                    $('.temp-sub-class-'+parseInt(intValArray[i])).closest('li').remove();
                }
            }
        }

        if (hiddenclass_value.indexOf(ids) > -1) {
            ids = hiddenclass_value;
        } else {
            ids = hiddenclass_value+ids;
        }
    }
    /*END HERE*/

    $("#child_ids_of_class").attr('value', ids);

    if ($('li.parent-sub-class-list').length == 0) {
        $(".sub_class_list_view").remove();
        $(".addplus").after('<li class="sub_class_list_view"><ol class="sortable-list">'+htmlContent+'</ol></li>');
        $('.sortable-list').sortable({
            placeholder: "ui-sortable-placeholder",
            start: function(event, ui) {
                startIndex = $(ui.item).index();
            },
            stop : function(event, ui) {
                var stopIndex = $(ui.item).index();
                var thisObj = $(this);
                numberPrintDrag(thisObj, startIndex, stopIndex);

            } //end of stop method
        });
    }else{
        $("li.sub_class_list_view > ol").append(htmlContent);
    }

    var lm = 0;
    var postDataA = [];

    for(lm=0; lm<=temp_sub_class_idA.length; lm++){

        var checked_class_id = temp_sub_class_idA[lm];

        if(checked_count == 1){
            if(lm < temp_sub_class_idA.length){
                var class_id        = parseInt($("#node_y_class_id").val());
                var number_count    = parseInt($('span.number_print').length) + 1;

                $('.testsi-'+temp_sub_class_idA[parseInt(lm)]).html(parseInt(number_count));
                var node_id = $('.testsi-'+checked_class_id).siblings().find('span.sub-class-style').children().attr('class').split('temp-sub-class-')[1];

                $('.testsi-'+checked_class_id).parent().attr("onclick","getSubClassStructure("+checked_class_id+", "+node_id+", this, "+number_count+")");
            }
        }else{

            var checked_class_id_tempA   = temp_sub_class_idA[parseInt(lm)-1];
            postDataA.push({class_id: checked_class_id_tempA, next_class_id: checked_class_id, checked_class_id: checked_class_id});

            /*var checked_class_id_temp   = temp_sub_class_idA[parseInt(lm)-1];

            var postData = {
                class_id: checked_class_id_temp,
                next_class_id: checked_class_id,
            }
            $.ajax({
                url : domainUrl+'classes/countClassesData',
                type: "POST",
                data : postData,
                dataType: "json",
                async: false,
                beforeSend : function(){
                },
                success:function(data)
                {
                    var temp_class_id       = data.next_class_id;
                    var temp_class_id_new   = data.class_id;
                    var number_array        = data.number_array[0];

                    if(temp_class_id != null)
                    {
                        var number_length = parseInt(data.number_print.length) - 1;


                        number_count = parseInt(data.number_print[number_length]) + parseInt($('.testsi-'+temp_class_id_new).text()) + 1;
                        number_count = parseInt(number_array) + parseInt($('.testsi-'+temp_class_id_new).text()) - 1;

                        $('.testsi-'+checked_class_id).html(parseInt(number_count));


                        var node_id = $('.testsi-'+checked_class_id).siblings().find('span.sub-class-style').children().attr('class').split('temp-sub-class-')[1];


                        $('.testsi-'+checked_class_id).parent().attr("onclick","getSubClassStructure("+checked_class_id+", "+node_id+", this, "+number_count+")");
                    }

                    $('.testsi-'+temp_class_id_new).siblings('.self_count_class').val(parseInt(number_array));
                }
            }); */
        }
        checked_count++;
    }

    /*divya*/
    if(checked_count != 1){
        var mypostData = JSON.stringify(postDataA);

        $.ajax({
            url : domainUrl+'classes/countClassesData',
            type: "POST",
            data : {'mypostData':mypostData},
            dataType: "json",
            async: false,
            beforeSend : function(){
            },
            success:function(response)
            {
                for(var i = 0; i < response.length; i++)
                {
                    var data                = response[i];
                    var temp_class_id       = data.next_class_id;
                    var temp_class_id_new   = data.class_id;
                    var number_array        = data.number_array[0];
                    checked_class_id        = postDataA[i].checked_class_id;

                    if(temp_class_id != null)
                    {
                        var number_length = parseInt(data.number_print.length) - 1;

                        number_count = parseInt(data.number_print[number_length]) + parseInt($('.testsi-'+temp_class_id_new).text()) + 1;
                        number_count = parseInt(number_array) + parseInt($('.testsi-'+temp_class_id_new).text()) - 1;

                        $('.testsi-'+checked_class_id).html(parseInt(number_count));


                        var node_id = $('.testsi-'+checked_class_id).siblings().find('span.sub-class-style').children().attr('class').split('temp-sub-class-')[1];


                        $('.testsi-'+checked_class_id).parent().attr("onclick","getSubClassStructure("+checked_class_id+", "+node_id+", this, "+number_count+")");
                    }

                    $('.testsi-'+temp_class_id_new).siblings('.self_count_class').val(parseInt(number_array));
                }

                /*
                var temp_class_id       = data.next_class_id;
                var temp_class_id_new   = data.class_id;
                var number_array        = data.number_array[0];

                if(temp_class_id != null)
                {
                    var number_length = parseInt(data.number_print.length) - 1;


                    number_count = parseInt(data.number_print[number_length]) + parseInt($('.testsi-'+temp_class_id_new).text()) + 1;
                    number_count = parseInt(number_array) + parseInt($('.testsi-'+temp_class_id_new).text()) - 1;

                    $('.testsi-'+checked_class_id).html(parseInt(number_count));


                    var node_id = $('.testsi-'+checked_class_id).siblings().find('span.sub-class-style').children().attr('class').split('temp-sub-class-')[1];


                    $('.testsi-'+checked_class_id).parent().attr("onclick","getSubClassStructure("+checked_class_id+", "+node_id+", this, "+number_count+")");
                }

                $('.testsi-'+temp_class_id_new).siblings('.self_count_class').val(parseInt(number_array));*/
            }
        });
    }
    /*end*/


    $("#main_action_menu").show();
    $("#sub_class_action_menu").hide();
    $(".sub_class_action_menu1").hide();
    $('.customPopUp').modal('hide');
    $('.customPopUp').removeClass('in');
    $('.customPopUp').css('height','100%');

    //setNumberPrint() //commented by divya on 25 jan 2016

    /*if(is_new == "add_new_sub")
    {
        ids                         = "";
        htmlContent                 = "";
        var class_id                = $("#node_y_class_id").val();
        var request                 = $.ajax({
            url: domainUrl+'classes/getNewNodeNumber',
            method: "POST",
            data: { class_id : class_id },
            dataType: "html"
        });
        request.done(function( number ) {
            htmlContent          = '<li class="parent-sub-class-list"><div class="node-content clearfix"><div class="node-left"><div class="node-circle node-white-circle-expanded">N</div><div class="node-head node-input"><span><input type="hidden" class="temp-sub-class-">Sub Class : '+number+' ('+number+')<input type="hidden" id="add_new_sub_class" name="add_new_sub_class" value="'+number+'" /></span></div></div><div class="node-right-sub clearfix"><a class="action-move"><span><i class="fa fa-chevron-up"></i></span></a></div></div></li>';

            $(".sub_class_list_view").find('ol').append(htmlContent);
        });
        request.fail(function( jqXHR, textStatus ) {
            newClassId = 'undefined';
        });
        setTimeout('autoSave()',1000);
    }*/
}

/*function autoSave()
{
    var is_instance = $("#is_instance").val();
    if(is_instance == 'N')
    {
        if($.trim($("#node_y_class_id").val()) == "")
            $("#action_type").attr('value','save');
        else
            $("#action_type").attr('value','edit');

        sendClassJson();
        var myJsonString = JSON.stringify(classBuilder);

        $.post(domainUrl+'classes/saveClass',{'data':$("#class_structure_form").serialize(),'propertyJson':myJsonString,'mode':'auto'},responseAutoSave,'html');
    }
}*/

function responseAutoSave(data,source)
{
    $("#second-class-div").html(data);
    setPaperBckgrnd();
    $.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':'pagination','itemPerPage':$("#temp_item_per_page").val(),'auto':'auto'},responseAutoSaveAgain,'html');
}

function responseAutoSaveAgain(data,source)
{

    $("#first-class-div").html(data);
}
/**
 * Created By Arvind Soni On Dec 17th, 2015
 * for open node rights flyout
 * And searching users and add users
 */
var thisObj;
var manageHightScroll = '';
var selectedViewIcon;
jQuery(function()
{
    $('body').on('click','.node_rights_open_class', function(){
        thisObj             =   this;
        var propertyId      =   $(thisObj).attr('id');
        var propertyName    =   $(thisObj).attr('name');
        var instanceValue   =   $("#instance_property_caption"+propertyId).val();
        var rightsType      =   $('.nodeRightsTypeForSelection').val();

        selectedViewIcon= $(this).attr('data-settings');
        $("#form_parti").show();
        $("#save_user_parti").show();
        $("#delete_user_parti").show();
        manageHightScroll = 'add';

        $.post(domainUrl+'classes/getIndividualUsers',{'propertyId':propertyId,'propertyName':propertyName,'instanceValue':instanceValue,'mode':'add','rightsType':rightsType},responseIndividualUsers,'html');


        if($("#is_participant_list").val() == '')
            $.post(domainUrl+'classes/getAllUsers',{},responseParticipant,'json');

        if($("#is_rolecb_list").val() == '')
            $.post(domainUrl+'classes/getAllRoles',{},responseRolescb,'json');

        //$('.loadder').show();
    });

    $('body').on('click','.node_rights_open_class_view', function(){
        thisObj             =   this;
        var propertyId      =   $(thisObj).attr('id');
        var propertyName    =   $(thisObj).attr('name');
        var instanceValue   =   $("#instance_property_caption"+propertyId).val();
        var rightsType      =   $('.nodeRightsTypeForSelection').val();
        $("#form_parti").hide();
        $("#save_user_parti").hide();
        $("#delete_user_parti").hide();
        manageHightScroll = 'view';
        $.post(domainUrl+'classes/getIndividualUsers',{'propertyId':propertyId,'propertyName':propertyName,'instanceValue':instanceValue,'mode':'view','rightsType':rightsType},responseIndividualUsers,'html');

        if($("#is_participant_list").val() == '')
            $.post(domainUrl+'classes/getAllUsers',{},responseParticipant,'json');

        if($("#is_rolecb_list").val() == '')
            $.post(domainUrl+'classes/getAllRoles',{},responseRolescb,'json');

        //$('.loadder').show();
    });

    $('body').on('click','.node_rights_close_class', function(){
        var getID = 'nodeRightFlyout';
        $('#'+getID+".node_rights_open_class").removeClass('openflyout');
        $('#'+getID+".rightFlyout").animate({right:'-100%'}).removeClass('in');
        $('.loadder').hide();
    });

    $('body').on('click','.parti_c', function(){
        var tCounter = 0;
        $('.parti_c').each(function(){
            if($(this).prop('checked') == true)
            {
                tCounter = parseInt(tCounter) + 1;

            }
        });

        if(parseInt(tCounter) > 0)
        {
            $("#delete_user_parti").removeClass("inactive");
        }
        else
        {
            $("#delete_user_parti").addClass("inactive");
        }
    });

    $('body').on('click','.all_parti', function(){

        if($(this).prop('checked') == true)
        {
            $('.parti_c').each(function(){ $(this).prop('checked',true);});
            $("#delete_user_parti").removeClass("inactive");
        }

        if($(this).prop('checked') == false)
        {
            $('.parti_c').each(function(){ $(this).prop('checked',false);});
            $("#delete_user_parti").addClass("inactive");
        }
    });

    // setup autocomplete function pulling from participant[] array
    $('#participant_list').autocomplete({
        appendTo: "#participantAutoCompleteBox",
        lookup: participant,
        width: '80%',
        onSelect: function (suggestion) {
            $("#participant_id").val(suggestion.key);
            $('#participant_list').val(suggestion.value);
        },
        forceFixPosition: 'auto',
        orientation: 'top'
    });

    // setup autocomplete function pulling from rolescb[] array
    $('#rolescb_list').autocomplete({
        appendTo: "#participantAutoCompleteBox",
        lookup: rolescb,
        width: '80%',
        onSelect: function (suggestion) {
            $("#role_cb_id").val(suggestion.key);
            $('#rolescb_list').val(suggestion.value);
        },
        forceFixPosition: 'auto',
        orientation: 'top'
    });
});

function openNodeRightsOfZ()
{
    $(thisObj).toggleClass('openflyout');
    var getID   =   'nodeRightFlyout';
    if($(thisObj).hasClass('openflyout'))
    {
        $(".node_rights_open_class").removeClass('openflyout');
        $(".rightFlyout").animate({right:'-100%'}).removeClass('in');
        $('#'+getID+".rightFlyout").animate({right:'0px'}).addClass('in');
        setTimeout(function(){sideFlyoutHeight();}, 300);
        $(".nano").nanoScroller();
    }
    else
    {
        $('#'+getID+".rightFlyout").animate({right:'-100%'}).removeClass('in');
    }
    thisObj     =   '';
}

function responseIndividualUsers(data,source)
{
    $(".node-rights-users-list").html(data);
    if($(".tick-icon").length==0 && selectedViewIcon == "open_flyout_for_View"){
        $("#participant_id").val("").val(setUserID);
        addParticipant();
    }
    openNodeRightsOfZ();
}

var participant = [];
function responseParticipant(data,source)
{
    var counter = 0;
    $.each(data, function (index, user) {
        if(parseInt(user['node_id']) > 0)
            counter++;
    });

    if(parseInt(counter) > 0)
    {
        $.each(data, function (index, user) {
            participant.push({"key":user['node_id'],"value":user['email_address']});
        });
        $("#is_participant_list").val('Y');
    }
}

var rolescb = [];
function responseRolescb(data,source)
{
    var counter = 0;
    $.each(data, function (index, roles) {
        if(parseInt(roles['role_id']) > 0)
            counter++;
    });

    if(parseInt(counter) > 0)
    {
        $.each(data, function (index, roles) {
            rolescb.push({"key":roles['role_id'],"value":roles['role']});
        });
        $("#is_rolecb_list").val('Y');
    }
}


function addParticipant()
{
    var rightsType      =   $('.nodeRightsTypeForSelection').val();
    if(rightsType == 'Actor')
    {
        var id = $("#participant_id").val();
        $('#participant_list').val('');
        $('#participant_id').val('');
        if ($('#parti_'+id).length)
        {
            $('#participant_list').val('');
            $('#participant_id').val('');
        }
        else
        {
            $('#participant_list').val('');
            $('#participant_id').val('');
            $.post(domainUrl+'classes/addParticipant',{'id':id,'rightsType':rightsType},responseAddParticipant,'json');
        }
    }
    else if(rightsType == 'Role')
    {
        var id = $("#role_cb_id").val();
        $('#rolescb_list').val('');
        $('#role_cb_id').val('');
        if ($('#parti_'+id).length)
        {
            $('#rolescb_list').val('');
            $('#role_cb_id').val('');
        }
        else
        {
            $('#rolescb_list').val('');
            $('#role_cb_id').val('');
            $.post(domainUrl+'classes/addParticipant',{'id':id,'rightsType':rightsType},responseAddRole,'json');
        }
    }
}

function responseAddParticipant(d,s)
{
    $("#no_user_select").hide();
    var html = '<tr id="row_parti_'+d.node_id+'"><td><div class="custom-checkbox"><input type="checkbox" id="parti_'+d.node_id+'" class="parti_c" value="'+d.node_id+'" ></div></td><td>'+d.first_name+' '+d.last_name+'</td><td>'+d.email_address+'</td><td>'+d.domain+'</td></tr>';
    $("#no_user_select").before(html);
}

function responseAddRole(d,s)
{
    $("#no_user_select").hide();
    var html = '<tr id="row_parti_'+d.role_id+'"><td><div class="custom-checkbox"><input type="checkbox" id="parti_'+d.role_id+'" class="parti_c" value="'+d.role_id+'" ></div></td><td>'+d.role+'</td></tr>';
    $("#no_user_select").before(html);
}

function saveUsersOfRights()
{
    var userIds = '';
    $('.parti_c').each(function(){ userIds = $(this).val()+','+userIds; });
    parti_user_property_id = $('#parti_user_property_id').val();
    $("#instance_property_caption"+parti_user_property_id).val(userIds);
    $('#parti_user_property_id').val('');
}

function deleteUsersOfRights()
{
    var counter = 0;
    $('.parti_c').each(function(){
        if($(this).prop('checked') == true)
        {
            counter = parseInt(counter) + 1;
        }
    });

    var rightsType      =   $('.nodeRightsTypeForSelection').val();
    var message         = '';
    if(rightsType == 'Actor')
    {
        message = 'Are you sure you want to delete users from list?';
    }
    else if(rightsType == 'Role')
    {
        message = 'Are you sure you want to delete roles from list?';
    }

    if(parseInt(counter) > 0)
    {
        bootbox.confirm({
            title: 'Warning',
            message: message,
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
                if (result)
                {
                    $('.parti_c').each(function(){
                        if($(this).prop('checked') == true)
                        {
                            $("#row_parti_"+$(this).val()).remove();
                        }
                    });

                    var userIds = '';
                    $('.parti_c').each(function(){ userIds = $(this).val()+','+userIds; });
                    parti_user_property_id = $('#parti_user_property_id').val();
                    $("#instance_property_caption"+parti_user_property_id).val(userIds);
                    $('#parti_user_property_id').val('');

                    $("#delete_user_parti").addClass("inactive");
                }

                var getID = 'nodeRightFlyout';
                $('#'+getID+".node_rights_open_class").removeClass('openflyout');
                $('#'+getID+".rightFlyout").animate({right:'-100%'}).removeClass('in');

            }
        });
    }
}

function searchingOnFile(type,field_name)
{
    var userIds                 =   '';
    var selUserIds              =   '';
    var dselUserIds             =   '';
    $('.parti_c').each(function(){
        userIds = userIds + $(this).val() +',';
        if($(this).prop('checked') == true)
        {
            selUserIds = selUserIds + $(this).val() +',';
        }

        if($(this).prop('checked') == false)
        {
            dselUserIds = dselUserIds + $(this).val() +',';
        }
    });

    var mode = $('#parti_user_property_id_mode').val();

    if(userIds != "")
        $.post(domainUrl+'classes/filterUsers',{'userIds':userIds,'selUserIds':selUserIds,'dselUserIds':dselUserIds,'type':type,'field_name':field_name,'mode':mode},responsefilterUsers,'html');
}

function responsefilterUsers(d,s)
{
    $('ul.multi-menu ').removeClass('show');
    $('ul.multi-menu ').siblings('span').removeClass('active');
    $("#tableDataParticipantFilter").html(d);
}

function responseCountClassesData(data,s){

    var resp = $.parseJSON(data);
    //number_print[] = resp;
}

function getClassesOfCourseBuilder()
{
    $.post(domainUrl+'board/getCourseBuilderClasses',{'isCall':'Y','user_id':setUserID},responseClassesOfCourseBuilder,'json');
}

function responseClassesOfCourseBuilder(d,s)
{
    var list = '';
    for(i=0;i<d.list.length;i++)
    {

        list += '<li onClick="getActiveRolesFromProduction(this)" data-productionId="'+d.list[i].production_id+'" data-classNodeId="'+d.list[i].class_node_id+'"><div class="left"><div class="node-content"><span class="app-icon"><img src="'+d.list[i].icon+'"></span><span class="app-name"><span>' +d.list[i].title1+'</span><span class="red sm-text hide">Expired</span></span><span class="btn-box hide"><button class="btn btn-bdr-blue" type="button">Renew</button></span></div></div></li>';



    }
    $("#courseTemplateFlyoutList").html(list);
}

function getActiveRolesFromProduction(elem)
{
    $(elem).siblings('li').removeClass("active");
    $(elem).addClass("active");
    var pId     = $("#courseTemplateFlyoutList").find('li.active').attr('data-productionId');
    var cNId    = $("#courseTemplateFlyoutList").find('li.active').attr('data-classNodeId');
    $("#react-button-add-new-template-course").trigger("click");
    $('.menu-flyout-close[data-flyout="nav"]').click();
    $("#courseTemplateFlyout.LeftFlyoutClose").trigger("click");
}

function getEditCourse(id)
{
    $.post(domainUrl+'board/getCourse',{'course_instance_id':id},responseEditCourse,'json');
}

function responseEditCourse(d,s)
{
    console.log(d);
}







