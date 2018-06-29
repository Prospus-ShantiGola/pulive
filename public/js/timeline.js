/*
 Script created by : Awdhesh soni
 Date              : 06,October 2015
 Code for time line functionality.
 */

var selectedNodeYId = 0;
var threepaneSecondDivClick = false;
$(document).ready(function () {
    expandCollapseGroup();
    /*to open a three pane node-x */
    $('body').on('click', '.dashSlider.active #third-class-div .table-list-view li .node-left', function () {
        threepaneSecondDivClick = true;
        NProgress.start();
        var currenthitcheckboxid = $(this).siblings(".nodeClass-Y").find('input').attr('id');
        var value = $(this).siblings(".nodeClass-Y").find('input').attr('value');
        if (value == undefined) {
            value = $(this).siblings(".sprite-icon").attr('id');
        }
        selectedNodeYId = value;
        var selctedliId = $(this).find('.node-input').attr("data-class");
        var selctedlName = $(this).find('.node-input').attr("data-name");
        var classId = selctedliId.split("_");

        var NodepropertyName = $(this).find('.node-input').find('span').html();

        if ($("#node-x-li a").html() == 'Node X') {
            var nodeXPropertyName = NodepropertyName;
        } else {
            var nodeXPropertyName = NodepropertyName;
        }

        //$("#property-heading").html(nodeXPropertyName);
        var tempAction = $("#tempAction").val();
        //for fourth pane active start
        /*if($(".listing-wrapper").hasClass("active")){
         removeNodeXpane();
         var TotalDashboardWidth=$(".dashboard").width()-Math.abs(parseInt($(".dashboard").css("margin-left")));
         TotalDashboardWidth = Math.abs(TotalDashboardWidth);
         var splitDashboardWidth = TotalDashboardWidth/2;
         $(".dashboard").animate({"margin-left": '-='+splitDashboardWidth});
         $(".breadcrumb-wrap li").addClass("active");
         $(".breadcrumb-wrap li:first").removeClass("active");
         var liwidth = 0;
         $(".breadcrumb li.active").each(function(i,v){
         liwidth += $(v).outerWidth();
         $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
         });
         var firstNodewidth = $(".breadcrumb-wrap li:first").width();
         $(".image-slider").css("width",liwidth);
         $(".image-slider").animate({
         'marginLeft': '+='+firstNodewidth
         }, 200);
         }*/
        //for fourth pane active End

        var node_id = '';
        if ($('.node-selected input').attr('id') == 'class_caption') {
            node_id = $('.node-selected .hidden-node-x').val();
        } else {
            node_id = $('.node-selected input').val();
        }
        if ($("#div-node-x-property").hasClass("active"))
        {
            var selectedtextareaValue = "";
            $(".property-child .node-content").each(function (i, v) {
                if ($(this).hasClass("node-selected")) {
                    selectedtextareaValue = $(this).find("textarea").val()
                }
            });
            //second pane condition   
            var selectedparentId = 0;
            if ($(".thirdPaneActive .node-input").attr("data-class") != undefined) {
                selectedparentId = parseInt($(".thirdPaneActive .node-input").attr("data-class").split("_")[1]);
            }

            var slectedCheckbox = $("#third-class-div [id=" + selectedparentId + "]").prop('checked');
            //tird pane condition
            var flag = false
            $(".instanceRunTab").each(function () {
                if ($(this).val().length > 0) {
                    flag = true;
                }
            });

            if (slectedCheckbox == true)
            {
                if (currenthitcheckboxid != selectedparentId)
                {
                    var selectedNodeZ = $(".thirdPaneActive").find('.node-input').attr("data-name");
                    if (selectedNodeZ == 'TAXONOMY' || selectedNodeZ == 'VERSION' || selectedNodeZ == 'NODE RIGHTS' || selectedNodeZ == 'CLASS')
                    {
                        selectedtextareaValue = selectedNodeZ;
                    }

                    if (selectedtextareaValue == "")
                    {
                        bootbox.alert("Please enter value for the empty Node Y property.");
                    } else
                    {
                        if ($(".property-child .node-content.node-selected input").attr("nodey-value") == undefined) {

                            var selectedCheckBoxId = parseInt($("#third-class-div [id=" + selectedparentId + "]").val());

                            $(".property-child .node-content.node-selected input").attr("nodey-value", selectedCheckBoxId);
                            $(".property-child .node-content.node-selected input").attr("value", selectedCheckBoxId);
                        }

                        if ($.trim($("#node_instance_id").val()) == "")
                            $("#instance_action_type").attr('value', 'save');
                        else
                            $("#instance_action_type").attr('value', 'edit');

                        var flag1 = false
                        $(".checkFillInstanceValue").each(function () {
                            if ($(this).val() != "") {
                                flag1 = true;
                            }
                        });

                        if (flag1 == true)
                        {
                            $(".thirdPaneActive i").removeClass('exclamation');
                            $(".thirdPaneActive i").addClass('circle-tick');
                        }

                        $("#icon165").removeClass('exclamation');
                        $("#icon165").addClass('circle-tick');

                        if ($.trim($("#instance_caption").val()) != "")
                            $.post(domainUrl + 'classes/saveInstanceData', {'data': $("#instance_structure_form").serialize()}, responseSaveInstanceNodeId, 'json');

                        $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': classId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': NodepropertyName}, responsecheckInstanceData, 'json');
                    }
                } else {

                    $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': classId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': NodepropertyName}, responsecheckInstanceData, 'json');
                }
            } else
            {
                $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': classId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': NodepropertyName}, responsecheckInstanceData, 'json');
            }
        } else
        {
            $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': classId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': NodepropertyName}, responsecheckInstanceData, 'json');
        }
    });


    var chVal = [];
    $('body').on('click', '.nodeClass-X input', function () {
        chVal = $('.node-content.node-selected input').val().split(",");
        var currentid = $(this).attr('id');
        if ($('.nodeClass-X input[id=' + currentid + ']').prop("checked") == true) {
            chVal.push(currentid);
        } else {
            for (var i = 0; i < chVal.length; i++) {
                if (chVal[i] === currentid)
                    chVal.splice(i, 1);
            }
        }

        $('.node-content.node-selected input').val('')
        $('.node-content.node-selected input').val(chVal);
        chVal = [];
    });

    $('body').on('click', '.nodeClass-Y input', function (event) {

        chVal = [];
        combineVal = [];
        combineVal = $('.node-content.node-selected input.hidden-node-x').val().split(",");

        $.each($(".nodeClass-Y input[name='nodeX[]']:checked"), function () {
            chVal.push($(this).val());
        });

        $('.node-content.node-selected input.hidden-node-x').attr("NodeY-Value", chVal);
        /* code here for combile id of second class div */
        var curid = $(this).attr('value');
        var classId = $(this).attr('id');
        var node_id = $('.node-selected input.hidden-node-x').val();
        var parentid = $('.node-selected input.hidden-node-x').attr('parent');
        //alert();

        $.post(domainUrl + 'classes/instanceNodeStructure', {'parentid': parentid, 'node_id': node_id, 'node_class_id': classId, 'class_node_id': curid}, responseinstanceData, 'json');

        if ($('.nodeClass-Y input[value=' + curid + ']').prop("checked") == true) {
            combineVal.push(curid);
        } else {
            for (var i = 0; i < combineVal.length; i++) {
                if (combineVal[i] === curid)
                    combineVal.splice(i, 1);
            }
        }

        $('.node-content.node-selected input.hidden-node-x').val('')
        $('.node-content.node-selected input.hidden-node-x').val(combineVal);
        combineVal = [];
        event.stopPropagation();
    });

    //in textarea write selected checkbox
    $("body").on("keyup", ".instanceRunTab", function (e) {
        if (!$("#third-class-div .thirdPaneActive input").is(':checked') && $("#third-class-div .thirdPaneActive input").length) {
            var chValue = [];
            var chValues = [];
            if ($('.node-content.node-selected input').attr("NodeY-Value") != undefined) {
                if ($('.node-content.node-selected input').attr("NodeY-Value").length > 1) {
                    chValue = $('.node-content.node-selected input').attr("NodeY-Value").split(",");
                }

            }
            if ($('.node-content.node-selected input').attr("value") != undefined) {
                if ($('.node-content.node-selected input').attr("value").length > 1) {
                    chValues = $('.node-content.node-selected input').attr("value").split(",");
                }
            }

            $("#third-class-div .thirdPaneActive input").prop("checked", "checked");
            var checkboxId = $("#third-class-div .thirdPaneActive input").val();
            chValue.push(checkboxId);
            chValues.push(checkboxId);

            var classId = $("#third-class-div .thirdPaneActive input").attr('id');
            var node_id = $('.node-selected input').val();
            var parentid = $('.node-selected input').attr('parent');

            var is_instance = $("#is_instance").val();
            if (is_instance == 'N') {
                $.post(domainUrl + 'classes/instanceNodeStructure', {'parentid': parentid, 'node_id': node_id, 'node_class_id': classId, 'class_node_id': checkboxId}, responseinstanceData, 'json');
            }



            $("#second-class-div .node-selected .hidden-node-x").attr("NodeY-Value", '');
            $("#second-class-div .node-selected .hidden-node-x").attr("NodeY-Value", chValue);
            $("#second-class-div .node-selected .hidden-node-x").attr("value", '');
            $("#second-class-div .node-selected .hidden-node-x").attr("value", chValues);
        }
    });

    /*open timeline html*/
    /*$(".timeLineOpen").on('click',function(){
     $(".lodding").show();
     $("#center-screen").html(''); 
     $.post(domainUrl + 'process/timeLine', {              
     }, responsetimeLine, 'HTML');
     
     });
     $("body").on('click','.timeLineOperationOpen', function(){
     $(".lodding").show();
     $("#center-screen").html(''); 
     $.post(domainUrl + 'process/timeLineOperation', {              
     }, responsetimeLine, 'HTML');
     });*/

});


/*code here used to click on details class anchor tag for jump form for segment type*/

function tmsavePhase()
{
    NProgress.start();
    var preNoSegment = 0;
    $.post(domainUrl + 'process/saveTimeLine', {'data': $("#timeline_form").serialize(), }, responceEventStatus, 'html');
}

function expandCollapseGroup() {
    var getTableWidth;
    $('body').on('click', '.icon-group-expand', function () {
        getTableWidth = $('table.process-meter').width();
        $(this).addClass('icon-group-collapse').removeClass('icon-group-expand');


        $('tr').each(function () {
            $(this).children('.group-Expand').prevUntil('.group-collapse').addClass('hide');
            //  $(this).children('.group-Expand').prevUntil('.group-collapse').prev('.col-2').addClass('mini-col-width')
        });

        var sum = 0
        $('.process-meter tr.row-0').children('.group-collapse').nextAll('td:visible').each(function (i, v) {

            sum += parseInt($(v).width());
        });

        $('table.process-meter').css('width', sum);
        $('.fixed-top-header').css('left', 364);
    });
    $('body').on('click', '.icon-group-collapse', function () {
        $(this).addClass('icon-group-expand').removeClass('icon-group-collapse');
        $('table.process-meter').css('width', getTableWidth);
        $('tr').each(function () {
            $(this).children('.group-Expand').prevUntil('.group-collapse').removeClass('hide');
            //  $(this).children('.group-Expand').prevUntil('.group-collapse').prev('.col-2').removeClass('mini-col-width');

        });
        $('.fixed-top-header').css('left', 365);
    });
}

function removeNodeXpane() {
    var panewidth = $('.content-wrapper-new').width();
    var threepanenode = panewidth / 2
    $('#div-node-x-property').removeClass('active');
    $('.content-wrapper-new').find('.dashSlider.active').css('width', threepanenode)
}

/*function use here for fetch meter three pane*/
function responsemeterThreePane(data, source) {
    $(".threePaneWrapper").html(data);
}
window.puJsFileLoadCounter++;