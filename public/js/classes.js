var selectedbtn = "powerBtn";
var selectedbtn1 = "powerBtn1";
var currentmode = "Display";
var nodeselectindex = 0;
var threepanefirstDivClick = false;
var instanceClick = false;
var assocationClick = false;
var newVersionClick = false;
var tempStatus = '';
var instanceBuilder = [];
var selectedNodeIDNumber;
var commonNameFirst;
var nodeTypeFirst;
var versioningTypeFirst;
var versioningTypeValidation = 1; // Check versioning type(strict,dynamic) of a class at save/edit time
var ajaxDataFirst;
var selectThis;
var selectPreValue;
var checkVersionMode = 0;
var foldertype = "normal";

function updateInstance(){
    var popupWrapper = $('#instanceUpdate');
    var view_instance_id = popupWrapper.data('view_instance_id');
    var view_instance_node_id = popupWrapper.data('view_instance_node_id');
    var class_node_id = popupWrapper.data('class_node_id');
    NProgress.start();
    $.post(domainUrl + 'classes/updateCombinedHtml', {'view_instance_id': view_instance_id, 'view_instance_node_id': view_instance_node_id,'class_node_id':class_node_id}, responseupdateInstance, 'html');
}
function responseupdateInstance(data, source){
    NProgress.done();
    $('#DataSaveMsg').html("<span>Instance Of VIEW Class Published Successfully</span>");
    $('#DataSaveMsg').fadeIn();
    setTimeout(function () {
        $('#DataSaveMsg').fadeOut();
    }, 3000);
    console.log(data);
}
function setGlobalVariableFirst()
{
    console.log($("#common_name_first"));
    console.log($("#common_name_first").val());
    if ($.trim($("#common_name_first").val()) == "")
    {
        $("#common_name_first").css('border', '1px solid red');
        $("#common_name_first").focus();
        return false;
    } else
    {
        $("#common_name_first").css('border', '');
        NProgress.start();
        $.post(domainUrl + 'classes/index', {'filter_operator': 'Autometic', 'search_text': 'AutometicAll'}, responseCallAutometic, 'html');
    }
}

/* Not uses */
function responseCallAutometic(data, source)
{
    var tempControler = $("#tempControler").val();
    var tempAction = $("#tempAction").val();
    var headingName = '';

    headingName = tempControler;

    $('.left-side-heading').html(ucfirst(headingName));
    $('.manifest-tab').remove();
    $('.content-wrapper-new').siblings('.user-action-wrap').hide();

    if (tempControler != "grid" && tempControler != "associations" && tempControler != "accounts" && tempControler != "process" && tempControler != "menudashboard" && tempControler != "calendar")
    {
        $("#center-screen").hide();
        $("#ControlBar").hide();
        $('#menudashboard').hide();
        $('#calender-screen').hide();
        $(".pui_center_content").show();

        /* For New Class */
        commonNameFirst = $.trim($("#common_name_first").val());
        nodeTypeFirst = $("#node_type_first").val();
        versioningTypeFirst = $("#version_type_first").val();

        /* For Class List */
        $(".pui_center_content").html(data);
        NProgress.done();
        $('.my-profile').removeClass('active');
        $(".All_li").addClass('active');


        $("#common_name_first").val('');
        $("#node_type_first").val(2);
        $("#version_type_first").val(1);
        $("#second-class-div").html(ajaxDataFirst);
        ajaxDataFirst = "";
        manageRightMenuIcon('add', 'classes');
        $(".breadcrumb  li:first").click();
        $(".Nodex-icon").removeClass("inactiveLink");
        $(".Nodex-icon").css("pointer-events", "all");
        $(".Nodez-icon").removeClass("inactiveLink");
        $(".Nodez-icon").css("pointer-events", "all");
        calculatePlusIcons();
        NProgress.done();

        /* Other */
        $('.content-wrapper-new').siblings('.user-action-wrap').hide();
        $("#main_action_menu").show();
        $("#parti_action_div_id").show();
        $("#firstTime").attr('value', 'N');
        $('.class-table tr input[type="checkbox"]').attr("disabled", true);
    }


    StopTabBreak("class_structure_form");
    StopTabBreak("instance_structure_form");
    setNumberPrint('second_instance_div');
}

function changeCommonName(obj)
{
    var CCN = $(obj).val();
    $("#common_name").val(CCN);

    var SCCN = $("#post_name").html();
    SCCN = SCCN.replace(/.+?(?=[(])/, CCN + " ");
    $("#post_name").html(SCCN);

    var HCCN = $("#second-class-div-heading").attr('alt');
    HCCN = HCCN.replace(/(:).*(?=[\s][(])/, ": " + CCN);
    $("#second-class-div-heading").attr('alt', HCCN);
    $("#second-class-div-heading").html(HCCN);
}

function setupRightMenu(tempNodeTypeFirst)
{
    if (parseInt(tempNodeTypeFirst) == 1) {
        $(".Nodex-icon").addClass("inactiveLink");
        $(".Nodex-icon").css("pointer-events", "none");

        $(".Nodez-icon").removeClass("inactiveLink");
        $(".Nodez-icon").css("pointer-events", "all");

        $(".Subclass-icon").addClass("inactiveLink");
        $(".Subclass-icon").css("pointer-events", "none");
    } else if (parseInt(tempNodeTypeFirst) == 3) {
        $(".Nodex-icon").addClass("inactiveLink");
        $(".Nodex-icon").css("pointer-events", "none");

        $(".Nodez-icon").addClass("inactiveLink");
        $(".Nodez-icon").css("pointer-events", "none");

        $(".Subclass-icon").addClass("inactiveLink");
        $(".Subclass-icon").css("pointer-events", "none");
    } else {
        $(".Nodex-icon").removeClass("inactiveLink");
        $(".Nodex-icon").css("pointer-events", "all");

        $(".Nodez-icon").removeClass("inactiveLink");
        $(".Nodez-icon").css("pointer-events", "all");

        $(".Subclass-icon").removeClass("inactiveLink");
        $(".Subclass-icon").css("pointer-events", "all");
    }
}

function getClassStructure(class_id)
{
    $(".list-row").removeClass('current');
    $("#list-row_" + class_id).addClass('current');
    if (!$(".form_active").length) {
        $(".classes_top_cl").trigger("click");
    }

    if ($("#firstTime").val() == 'N')
    {
        NProgress.start();
    }
    $.post(domainUrl + 'classes/classStructure', {'class_id': class_id, 'mode': 'Display'}, responseClassStructure, 'html');
}

function responseClassStructure(data, source)
{
    $("#second-class-div").html(data);
    $('.dz-hidden-input').next('.bootstrap-filestyle:visible').length ? $('.dz-hidden-input').next().hide() : '';
    if (selectedNodeIDNumber != undefined) {
        $("#second-class-div .node-content").removeClass("node-selected");
        $("#second-class-div [data-class =" + selectedNodeIDNumber + "]").find(".node-content").first().addClass("node-selected");
    }
    if ($("#second-class-div .node-selected").length < 1) {
        $("#second-class-div .node-content").first().addClass("node-selected");
    }
    manageRightMenuIcon('listing', 'classes');
    NProgress.done();
    setPaperBckgrnd();
    removeString();
    setNumberPrint();
    $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
    //fullSelectionNode();

    manageNiceScroll();




}



/* code start for display folder list by search code written by awdhesh soni */

function paginationFolderAjax(url, page, order_by, order, mode)
{
    NProgress.start();
    $("#folder-first-instance-list-div").html("");
    $.post(url + '/folderList', {'page': page, 'order_by': order_by, 'order': order, 'type': 'no-pagination', 'mode': mode}, responsePaginationFolderAjax, 'html');
}

/* code start for display folder details by search code written by awdhesh soni */
function paginationDocumentDetailsAjax(url, page, order_by, order, mode)
{

    NProgress.start();
    $("#course-instance-list-div").html("");
    var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
    $.post(url + '/folderDetails', {'page': page, 'order_by': order_by, 'order': order, 'type': 'no-pagination', 'mode': mode, 'class_node_id': folderId}, responseCallFolderDetailsAction, 'html');
}

/* end code here */

/* function use here to display course listing by sorting*/

function courseAjax(url, order_by, order, mode)
{
    NProgress.start();
    $("#course-instance-list-div").html("");
    $.post(url + '/index', {'setUserID':setUserID, 'order_by': order_by, 'order': order, 'mode': mode}, responseCourseAjax, 'html');

    //var activeNode = $(".ref-inline").find('tr.current').attr('data-id');
    //$.post(domainUrl+'menudashboard/courseView',{'node_instance_id':activeNode},responseCallcourseViewAction,'html');
}

function responseCourseAjax(data, source)
{

    $("#course-instance-list-div").html(data);
    $('.list-tab a').addClass('active');
    $("#center-screen, #ControlBar, .pui_center_content, #calender-screen, #actors-screen, #documents-screen, #main-screen").hide();
    $("#menudashboard").html(data);
    $('#menudashboard').show();

    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
    $("#new_course_action_menu").show();
    $("#course_action_menu").hide();

    setColumnsH();
    $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
    $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
    $('.loadder').hide();
    var activeNode = $(".courseboard-table tr.current").attr('data-id');
    if (activeNode == undefined)
    {
        activeNode = "";
    }
    $.post(domainUrl + 'menudashboard/courseView', {'node_instance_id': activeNode}, responseCallcourseViewAction, 'html');
    dualPaneHeight();
    hitName = '';
    dashboardInitalLoad();
    NProgress.done();
}

function paginationAjax(url, page, order_by, order, itemPerPage)
{
    NProgress.start();
    $.post(url + '/index', {'page': page, 'order_by': order_by, 'order': order, 'type': 'pagination', 'itemPerPage': itemPerPage}, responsePaginationAjax, 'html');
}

function setPage(value)
{
    NProgress.start();
    $.post(domainUrl + 'classes/index', {'page': 1, 'order_by': 'node_class_id', 'order': 'DESC', 'type': 'pagination', 'itemPerPage': value}, responsePaginationAjax, 'html');
}

function paginationAjaxList(url, page, order_by, order)
{
    NProgress.start();
    $.post(url + '/index', {'page': page, 'order_by': order_by, 'order': order, 'type': 'no-pagination'}, responsePaginationAjax, 'html');
}

function responsePaginationAjax(data, source)
{
    $("#first-class-div").html(data);

    /*
     * Commented By Divya
     * ON Date 15th April 2016
     * as when click on pagination, classes/index run and stop. when class structure hit page load
     */
    //NProgress.done();

    /*Code for toggling of the buttons*/
    if (selectedbtn == "barBtn") {
        $('.barBtn .fa').removeClass("barIcon").addClass("squareIconGray");
        $('.powerBtn .fa').removeClass("powerIcon").addClass("squareIconArrowWhite");
    } else {
        $('.barBtn .fa').removeClass("squareIconGray").addClass("barIcon");
        $('.powerBtn .fa').removeClass("squareIconArrowWhite").addClass("powerIcon");
    }
}

/** code use here to assign folder list data awdhesh soni*/
function responsePaginationFolderAjax(data, source)
{
    $("#folder-first-instance-list-div").html(data);
    $("#FolderList").find('li:eq(0)').addClass('active');
    $("#FolderList").find('li:odd').css('background', '#F4F4F4');
    $("#FolderList").find('li:even').css('background', '#fff');

    folderSection(); //folder functionality
    manageNiceScroll();
    DragDropFolder(); // drag drop
    sideFlyoutHeight(); // nice scroll
    DragDropFolderCall(); // outer file drag & drop
    var folderId = $("#FolderList").find('li.drag-folder.active').attr('id');
    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': folderId}, responseCallFolderDetailsAction, 'html');
    //NProgress.done();
}

function responsePaginationFolderDetailsAjax(data, source)
{
    $("#document-details-instance-list-div").html(data);
    //$("#FolderList").find('li:eq(0)').addClass('active');
    sideFlyoutHeight();
    if ($('#folderSection .display-wrapper').width() <= 500) {
        $('#folderSection .display-wrapper .main-one-third').css('width', '540px')
    } else {
        $('#folderSection .display-wrapper .main-one-third').css('width', '100%')
    }
    manageNiceScroll();
    $(".nano").nanoScroller();
    NProgress.done();
}

/*end code here */
function editClassProperty()
{

    var is_instance = $("#is_instance").val();
    var node_id = $('.node-selected input').not('.self_count_class').val(); //$('.node-selected input').val();
    $('.class-table tr input[type="checkbox"]').attr("disabled", true);
    if (is_instance == 'N')
    {
        var node_y_class_id = $("#node_y_class_id").val();
        if (parseInt(node_y_class_id) > 0)
        {
            NProgress.start();
            selectedNodeIDNumber = $('.node-content.node-selected').closest('li').attr('data-class');
            $.post(domainUrl + 'classes/classStructure', {'class_id': node_y_class_id, 'mode': 'Edit'}, responseEditClassProperty, 'html');
            var nodeName = $('#second-class-div').find('div.node-selected .node-input span').html();
            var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
            if ($("#node-x-li a").html() == 'Node X') {

                $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Edit', 'nodeTypeId': 1, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
            } else {

                $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Edit', 'nodeTypeId': 3, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
            }


            // $.post(domainUrl+'classes/getNodeXThirdPane',{'mode':'Edit'},responsegetNodeXThirdPane,'html');
        }
        currentmode = 'edit';
    } else
    {
        var node_instance_id = $("#node_instance_id").val();
        if (parseInt(node_instance_id) > 0)
        {
            NProgress.start();
            manageRightMenuIcon('add', 'classes');
            $.post(domainUrl + 'classes/instanceStructure', {'node_instance_id': node_instance_id, 'mode': 'Edit', 'is_instance': is_instance}, responseInstanceStructure, 'html');
        }
    }
}

function responseEditClassProperty(data, source)
{
    $("#second-class-div").html(data);
    if (selectedNodeIDNumber != undefined) {
        $("#second-class-div .node-content").removeClass("node-selected");
        $("#second-class-div [data-class =" + selectedNodeIDNumber + "]").find(".node-content").first().addClass("node-selected");
    }

    NProgress.done();
    setPaperBckgrnd();
    manageRightMenuIcon('add', 'classes');
    stopLastElementTabing();
    removeString();
    manageNiceScroll();
    /*Custom code to add and remember Class highligting NodeX Problem*/
}

function cancelClassProperty()
{

    var nodeName = $('#second-class-div').find('div.node-selected .node-input span').html();
    var node_id = $('.node-selected input').not('.self_count_class').val(); //$('.node-selected input').val();
    var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
    if ($("#node-x-li a").html() == 'Node X') {
        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 1, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    } else {
        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 3, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    }

    $.post(domainUrl + 'classes/getNodeXThirdPane', {'mode': 'Display'}, responsegetNodeXThirdPane, 'html');
    var is_instance = $("#is_instance").val();
    if (is_instance == 'N')
    {
        var node_y_class_id = $("#node_y_class_id").val();
        if (parseInt(node_y_class_id) > 0)
        {
            getClassStructure(node_y_class_id);
        } else
        {
            $(".first_class_structure").click();
        }
    } else
    {
        var node_instance_id = $("#node_instance_id").val();
        if (parseInt(node_instance_id) > 0)
        {
            NProgress.start();
            manageRightMenuIcon('listing', 'classes');
            var node_y_class_id = $("#node_y_class_id").val();
            $.post(domainUrl + 'classes/instanceStructure', {'node_instance_id': node_instance_id, 'mode': 'Display', 'node_y_class_id': node_y_class_id}, responseInstanceStructure, 'html');
        } else
        {
            var node_y_class_id = $("#node_y_class_id").val();
            $.post(domainUrl + 'classes/getClassInstance', {'class_id': node_y_class_id, 'page': 1, 'order_by': 'node_instance_id', 'order': 'DESC', 'mode': 'pagination'}, responseGetClassInstance1, 'html');
        }
    }
}

function removeProperty(id)
{
    var $currentSelection = $("#prop_temp_li_" + id);
    var countRemoveProp = $currentSelection.find('.runTab').length;
    countRemoveProp = parseInt(countRemoveProp, 10);
    increaseWidthEdit(8, $currentSelection)//nice-scroll-box increase and decrease width
    $("#prop_temp_li_" + id).remove();
    var propLen = $('.tabber li').length;
    if (propLen == 0) {
        $(".tabber").closest('.sortable').find('.addplus').empty();
        $(".tabber").closest('.sortable').find('.addplus').hide();
    } 	//remove first property when add new class @niraj
    tabPositions();
    calculatePlusIcons();
    var addSubWrap = $('.add-sub-child-wrap').is(':visible');
    setNumberPrint('', countRemoveProp, addSubWrap);
}

function removePropertyNew(id)
{
    var newIds = id + ',';
    $("#old_" + id).find("ol li").each(function () {
        newIds = newIds + $(this).attr("data-class") + ',';
    });
    var npids = $("#remove_prop_ids").val() + newIds;
    var $currentSelection = $("#prop_temp_li_" + id);
    var $currentSelectionParent = $('[data-class=' + id + ']')
    var countRemoveProp = $currentSelectionParent.find('.runTab').length;
    countRemoveProp = parseInt(countRemoveProp, 10);
    increaseWidthEdit(8, $currentSelection)//nice-scroll-box increase and decrease width

    $("#old_" + id).remove();

    $("#remove_prop_ids").attr('value', npids);
    var propLen = $('.tabber li').length;
    if (propLen == 0) {
        $(".tabber").closest('.sortable').find('.addplus').hide()
    } //remove first property when add new class @niraj
    var addSubWrap = $('.add-sub-child-wrap').is(':visible');
    setNumberPrint('', countRemoveProp, addSubWrap);
}

function deleteClassProperty()
{
    var is_instance = $("#is_instance").val();
    var counter = 0;
    var class_id = '';
    if (is_instance == 'N')
    {
        $('.single_check').each(function () {
            if ($(this).is(':checked') == true)
            {
                counter = parseInt(counter) + 1;
                class_id = $(this).val();
            }
        });
    } else
    {
        $('.single_i_check').each(function () {
            if ($(this).is(':checked') == true)
            {
                counter = parseInt(counter) + 1;
                class_id = $(this).val();
            }
        });
    }


    if (parseInt(counter) > 0)
    {
        $.post(domainUrl + 'classes/deleteClassCount', {'counter': counter, 'is_instance': is_instance, 'class_id': class_id}, responseOpenDialogOfDelete, 'JSON');
    }
}

function deleteClassPropertyVersion()
{
    var is_instance = $("#is_instance").val();
    var class_id = $("#node_y_class_id").val();
    $.post(domainUrl + 'classes/deleteClassCount', {'counter': 1, 'is_instance': is_instance, 'class_id': class_id}, responseOpenDialogOfVersionDelete, 'JSON');
}

function responseOpenDialogOfDelete(data, source)
{

    $("#delMsgOfCI").html(data['msg']);
    $("#deleteInsOrClsPopup").modal('show');
}

function responseOpenDialogOfVersionDelete(data, source)
{
    if ($('#version').find(".Cancel1-icon").is(":not(':hidden')")) {
        data = {msg: 'Are you sure you want to cancel?'}
    }
    $("#delMsgOfCI").html(data['msg']);
    $("#deleteInsOrClsPopup").modal('show');
}

function deleteClassPropertyAgain()
{
    NProgress.start();
    var is_instance = $("#is_instance").val();
    var delete_ids = '';
    if (is_instance == 'N')
    {
        var versionData = $("#node_y_class_id").attr('version-id');
        if (versionData == 1) {
            var class_id = $("#node_y_class_id").val();
            delete_ids = delete_ids + class_id + ',';
            $.post(domainUrl + 'classes/deleteClass', {'delete_ids': delete_ids}, responseDeleteClassProperty, 'html');
        } else {
            $('.single_check').each(function () {
                if ($(this).is(':checked') == true)
                {
                    delete_ids = delete_ids + $(this).val() + ',';
                }
            });
            $.post(domainUrl + 'classes/deleteClass', {'delete_ids': delete_ids}, responseDeleteClassProperty, 'html');
        }
    } else
    {
        $('.single_i_check').each(function () {
            if ($(this).is(':checked') == true)
            {
                delete_ids = delete_ids + $(this).val() + ',';
            }
        });
        $.post(domainUrl + 'classes/deleteInstance', {'delete_ids': delete_ids}, responseDeleteInstanceProperty, 'html');
    }
}

function responseDeleteClassProperty(data, source)
{
    NProgress.done();
    $(".first_hit").click();
}

function responseDeleteInstanceProperty(data, source)
{
    var node_class_id = $("#node_y_class_id").val();
    $.post(domainUrl + 'classes/getClassInstance', {'page': 1, 'order_by': 'node_instance_id', 'order': 'DESC', 'class_id': node_class_id, 'mode': 'pagination', 'itemPerPage': '0'}, responsePaginationInstanceAjax, 'html');
}

function saveClassProperty(saveType)
{


    NProgress.start();
    var is_instance = $("#is_instance").val();
    $("#saveTypeClass").attr('value', saveType);
    if (saveType == 'P') {
        $("#second-class-div li>div").each(function (i, v) {
            if ($(v).hasClass('node-selected')) {
                nodeselectindex = i;
            }
        });

    }
    if (is_instance == 'N')
    {

        if ($.trim($("#class_caption").val()) == "" && $.trim($("#node_y_class_id").val()) == "") {
            return false;
        } else
        {
            /* code here start for save data fisrt class propert */
            selectedtextareaValue = "";
            $(".property-child .node-content").each(function (i, v) {
                if ($(this).hasClass("node-selected")) {
                    selectedtextareaValue = $(this).find("textarea").val()
                }
            });

            var selectedNodeZ = $(".thirdPaneActive").find('.node-input').attr("data-name");
            if (selectedNodeZ == 'TAXONOMY' || selectedNodeZ == 'VERSION' || selectedNodeZ == 'NODE RIGHTS' || selectedNodeZ == 'CLASS') {
                selectedtextareaValue = selectedNodeZ;
            }
            if (selectedtextareaValue == "" && $("#div-node-x-property").hasClass("active"))
            {
                bootbox.alert('Please enter value for the empty Node Y property.');
            } else
            {
                /*save Instance data */
                /*check second pane condition textarea value*/
                var selectedtextareaValue = "";
                $(".property-child .node-content").each(function (i, v) {
                    if ($(this).hasClass("node-selected")) {
                        selectedtextareaValue = $(this).find("textarea").val()
                    }
                });

                //third pane condition
                var selectedparentId = 0;
                if ($(".thirdPaneActive .node-input").attr("data-class") != undefined) {
                    selectedparentId = parseInt($(".thirdPaneActive .node-input").attr("data-class").split("_")[1]);
                }
                var slectedCheckbox = $("#third-class-div [id=" + selectedparentId + "]").prop('checked');
                //third pane condition
                var flag = false
                $(".instanceRunTab").each(function () {
                    if ($(this).val().length > 0) {
                        flag = true;
                    }
                });

                if ($("#node-x-li a").html() == "Node Z")
                {
                    $(".checkFillInstanceValue").each(function () {
                        if ($(this).val().length > 0) {
                            flag = true;
                        }
                    });
                }

                /* code here to check third pane check box */
                var selectedparentId = 0;
                if ($(".thirdPaneActive .node-input").attr("data-class") != undefined) {
                    selectedparentId = parseInt($(".thirdPaneActive .node-input").attr("data-class").split("_")[1]);
                }
                var slectedCheckbox = $("#third-class-div [id=" + selectedparentId + "]").prop('checked');


                if (slectedCheckbox == true && flag == true)
                {
                    saveInstanceVal();
                } else
                {
                    var selectednode = $('.nodeselection-dropdown').val();
                    if (parseInt(selectednode) == 1 || parseInt(selectednode) == 2)
                    {
                        if (saveType == 'P')
                        {
                            var checkNodeZInstances = 0;
                            var index = 1;
                            $("#class_structure_form .class-wrapper li .hidden-node-z").each(function () {

                                var nodezVal = $(this).val();
                                var arr = nodezVal.split(',');
                                arr = $.grep(arr, function (n, i) {
                                    return (n !== "" && n != null);
                                });
                                /* Modified by: Amit Malakar 02-May-16 - isParent added */
                                var isParent = $(this).siblings('div.node-white-circle-expanded').length;

                                if ($.trim($("#node_y_class_id").val()) == '') {
                                    if (parseInt(index) == 1) {
                                        if (parseInt(arr.length) < 2) {
                                            checkNodeZInstances = 1;
                                        }
                                    } else if (parseInt(index) == 2) {
                                        if (parseInt(arr.length) < 1) {
                                            checkNodeZInstances = 1;
                                        }
                                    } else {
                                        if (isParent && parseInt(arr.length) < 1) {
                                            checkNodeZInstances = 1;
                                        } else if (!isParent && parseInt(arr.length) < 4) {
                                            checkNodeZInstances = 1;
                                        }
                                    }
                                }

                                if ($.trim($("#node_y_class_id").val()) != '') {
                                    if (parseInt(index) == 1) {
                                        if (parseInt(arr.length) < 3) {
                                            checkNodeZInstances = 1;
                                        }
                                    } else if (parseInt(index) == 2) {
                                        if (parseInt(arr.length) < 2) {
                                            checkNodeZInstances = 1;
                                        }
                                    } else {
                                        if (isParent && parseInt(arr.length) < 2) {
                                            checkNodeZInstances = 1;
                                        } else if (!isParent && parseInt(arr.length) < 5) {
                                            checkNodeZInstances = 1;
                                        }
                                    }
                                }
                                index++;
                            });

                            //if (checkNodeZInstances == 1 && versioningTypeValidation == 1)
                            if (checkNodeZInstances == 1 && false)
                            {
                                NProgress.done();
                                bootbox.alert("NODE Z field is mandatory. NODE Y cannot be published without filling out all NODE Z!");
                                return false;
                            } else {
                                $("#first-class-div .current.default_row_class td:last").html("Published");
                                $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
                            }
                        }
                    }

                    if ($.trim($("#node_y_class_id").val()) == "")
                        $("#action_type").attr('value', 'save');
                    else
                        $("#action_type").attr('value', 'edit');
                    sendClassJson();
                    var myJsonString = JSON.stringify(classBuilder);

                    /* code here to check NODE Z property condition when opublish then check ckeckbox all fill */

                    if ($("#node-x-li a").html() == "Node Z" && $("#div-node-x-property").hasClass("active") == true)
                    {
                        chVal = [];
                        $.each($(".nodeClass-Y input[name='nodeX[]']:checked"), function () {
                            chVal.push($(this).val());
                        });
                        $("#sub_nav_39 li").removeClass('active');
                        $("#sub_nav_39 .All_li").addClass('active');
                        $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                    } else
                    {
                        if (parseInt(selectednode) == 1 || parseInt(selectednode) == 3) {
                            var subclassexist = $('.sub_class_list_view ol > li').length;
                            if (subclassexist) {
                                bootbox.confirm({
                                    title: 'Message',
                                    message: 'If you select NODE X or NODE Z, all subclasses will be removed. Do you want to continue?',
                                    buttons: {
                                        'cancel': {
                                            label: 'No',
                                            className: 'btn-default'
                                        },
                                        'confirm': {
                                            label: 'Continue',
                                            className: 'btn-primary'
                                        }
                                    },
                                    callback: function (result) {
                                        if (result) {
                                            $('#child_ids_of_class').val('');

                                            if (saveType == 'P' && parseInt(selectednode) == 1)
                                            {
                                                var checkNodeZInstances = 0;
                                                var index = 1;
                                                $("#class_structure_form .class-wrapper li .hidden-node-z").each(function () {

                                                    var nodezVal = $(this).val();
                                                    var arr = nodezVal.split(',');
                                                    arr = $.grep(arr, function (n, i) {
                                                        return (n !== "" && n != null);
                                                    });
                                                    /* Modified by: Amit Malakar 02-May-16 - isParent added */
                                                    var isParent = $(this).siblings('div.node-white-circle-expanded').length;

                                                    if ($.trim($("#node_y_class_id").val()) == '') {
                                                        if (parseInt(index) == 1) {
                                                            if (parseInt(arr.length) < 2) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        } else if (parseInt(index) == 2) {
                                                            if (parseInt(arr.length) < 1) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        } else {
                                                            if (isParent && parseInt(arr.length) < 1) {
                                                                checkNodeZInstances = 1;
                                                            } else if (!isParent && parseInt(arr.length) < 4) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        }
                                                    }

                                                    if ($.trim($("#node_y_class_id").val()) != '') {
                                                        if (parseInt(index) == 1) {
                                                            if (parseInt(arr.length) < 3) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        } else if (parseInt(index) == 2) {
                                                            if (parseInt(arr.length) < 2) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        } else {
                                                            if (isParent && parseInt(arr.length) < 2) {
                                                                checkNodeZInstances = 1;
                                                            } else if (!isParent && parseInt(arr.length) < 5) {
                                                                checkNodeZInstances = 1;
                                                            }
                                                        }
                                                    }
                                                    index++;
                                                });

                                               // if (checkNodeZInstances == 1 && versioningTypeValidation == 1)
                                                 if (checkNodeZInstances == 1 && false)
                                                {
                                                    NProgress.done();
                                                    bootbox.alert("NODE Z field is mandatory. NODE Y cannot be published without filling out all NODE Z!");
                                                    return false;
                                                }
                                            }
                                            $("#sub_nav_39 li").removeClass('active');
                                            $("#sub_nav_39 .All_li").addClass('active');
                                            $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                                        } else {

                                        }
                                    }
                                });
                                return false;
                            } else {
                                $("#sub_nav_39 li").removeClass('active');
                                $("#sub_nav_39 .All_li").addClass('active');
                                $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                            }
                        } else
                        {
                            /*code here to check validation for node X*/
                            if ($("#node-x-li a").html() == "Node X" && $(".image-slider a").length > 2)
                            {

                                var flagCheck = checkValidate();

                                if (flagCheck == true) {
                                    NProgress.start();
                                    $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                                }

                            } else if ($(".image-slider a").length > 2 && $("#node-x-li a").html() == "Node Z") {
                                $("#sub_nav_39 li").removeClass('active');
                                $("#sub_nav_39 .All_li").addClass('active');
                                $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                            } else {
                                $("#sub_nav_39 li").removeClass('active');
                                $("#sub_nav_39 .All_li").addClass('active');
                                $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
                            }
                        }
                    }
                }
                /*end code here*/
            }
            /* end code here */
        }
    } else
    {

        if ($.trim($("#node_instance_id").val()) == "")
        {
            $("#instance_action_type").attr('value', 'save');
        } else
        {
            $("#instance_action_type").attr('value', 'edit');
        }

        if ($.trim($("#instance_caption").val()) != "") {

            sendInstanceJson();
            var myInstanceJsonString = JSON.stringify(instanceBuilder);

            var postData = {
                mapping_class_id: $.trim($("#node_y_class_id").val())
            }
            if ($.trim($("#node_instance_id").val()) == '') {

                var flag = true;
                var checkflag = "";
                var temp = true;
                $(".validationCheck").each(function (i, k) {
                    var element = $(this);
                    var data = $(this).val();
                    NProgress.done();
                    if (flag == true) {
                        var fn = "";
                        fn = $(this).attr('validate-data').split(";");
                        var aa = [];
                        for (i = 0; i < fn.length; i++) {
                            aa.push(fn[i]);
                        }
                        aa.toString();
                        $(aa).each(function (i, v) {
                            var newStr = v;
                            var valdata = data;
                            if (newStr.indexOf("pui_fun") >= 0) {
                                var elementId = element.attr('id');
                                var aaa = newStr.replace("this.value", elementId);
                            } else
                            {
                                if (valdata == "") {
                                    var aaa = newStr.replace("this.value", "");
                                } else {
                                    var aaa = newStr.replace("this.value", data);
                                }
                            }
                            checkflag = eval(aaa);
                            if (checkflag == false) {
                                temp = false;
                            }
                        });

                        if (temp == false) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                    }
                });

                if (flag == true)
                {
                    if ($.trim($("#node_y_class_id").val()) == 638 && saveType == 'P')
                    {
                        var cssInstanceId = $('#instance_property_caption2951').val();
                        var htmlLayout = $('#instance_property_caption2949').val();
                        // auto selector ids
                        var regExp = /<AUTO_CSS>(.*)<\/AUTO_CSS>/g;
                        var regExp1 = /SID_([\d]+)/g;
                        var match = regExp.exec(htmlLayout);
                        var asidArr = [];
                        if (match) {
                            while (match1 = regExp1.exec(match[1])) {
                                if (asidArr.indexOf(match1[1]) == -1)
                                    asidArr.push(match1[1]);
                            }
                        }
                        // selector ids
                        var newHtmlLayout = htmlLayout.replace(/<AUTO_CSS>(.*)<\/AUTO_CSS>/g, '');
                        var sidArr = [];
                        while (match2 = regExp1.exec(newHtmlLayout)) {
                            if (sidArr.indexOf(match2[1]) == -1)
                                sidArr.push(match2[1]);
                        }
                        $.post(domainUrl + 'classes/checkValidSelector', {'selector_ids': sidArr, 'auto_selector_ids': asidArr, 'css_instance_id': cssInstanceId, 'action': 'validation'}, responseCheckValidSelector, 'JSON');
                    } else {

                        NProgress.start();
                        $("#sub_nav_39 li").removeClass('active');
                        $("#sub_nav_39 .All_li").addClass('active');
                        $.post(domainUrl + 'classes/saveInstance', {'data': $("#instance_structure_form").serialize(), 'saveType': saveType, 'is_instance': is_instance, 'myInstanceJsonString': myInstanceJsonString}, responseSaveInstanceProperty, 'html');
                        if (saveType == 'P') {
                            $("#first-class-div .current.default_row_class td:last").html("Published");
                            $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
                        }
                    }
                }

                /*$.ajax({
                 type: "post",
                 url: domainUrl+'classes/checkMappingClass',
                 data: postData,
                 dataType: "json",
                 success: function (msg) {
                 // As discuss with arvind sir, he told remove this check validation
                 //if (msg.count < 1)
                 if (1) {}
                 else {
                 bootbox.alert("For this class you can not add more then one instance!");
                 return false;
                 }
                 },

                 });*/
            } else {

                if ($.trim($("#node_y_class_id").val()) == 638 && saveType == 'P')
                {
                    var cssInstanceId = $('#instance_property_caption2951').val();
                    var htmlLayout = $('#instance_property_caption2949').val();
                    // auto selector ids
                    var regExp = /<AUTO_CSS>(.*)<\/AUTO_CSS>/g;
                    var regExp1 = /SID_([\d]+)/g;
                    var match = regExp.exec(htmlLayout);
                    var asidArr = [];
                    if (match) {
                        while (match1 = regExp1.exec(match[1])) {
                            if (asidArr.indexOf(match1[1]) == -1)
                                asidArr.push(match1[1]);
                        }
                    }
                    // selector ids
                    var newHtmlLayout = htmlLayout.replace(/<AUTO_CSS>(.*)<\/AUTO_CSS>/g, '');
                    var sidArr = [];
                    while (match2 = regExp1.exec(newHtmlLayout)) {
                        if (sidArr.indexOf(match2[1]) == -1)
                            sidArr.push(match2[1]);
                    }
                    $.post(domainUrl + 'classes/checkValidSelector', {'selector_ids': sidArr, 'auto_selector_ids': asidArr, 'css_instance_id': cssInstanceId, 'action': 'validation'}, responseCheckValidSelector, 'JSON');
                    NProgress.done();
                } else if ($.trim($("#node_y_class_id").val()) == 125) {

                    bootbox.confirm({
                        title: 'Message',
                        message: 'Please update the property of conversion class as well.',
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
                        callback: function (result) {
                            if (result) {
                                $("#sub_nav_39 li").removeClass('active');
                                $("#sub_nav_39 .All_li").addClass('active');
                                $.post(domainUrl + 'classes/saveInstance', {'data': $("#instance_structure_form").serialize(), 'saveType': saveType, 'myInstanceJsonString': myInstanceJsonString}, responseSaveInstanceProperty, 'html');

                            } else {

                            }
                        }
                    });
                } else {

                    var flag1 = true;
                    var checkflag1 = "";
                    var temp1 = true;
                    $(".validationCheck").each(function (i, k) {
                        var element = $(this);
                        var data1 = $(this).val();
                        NProgress.done();
                        if (flag1 == true) {
                            var fn1 = "";
                            fn1 = $(this).attr('validate-data').split(";");
                            var aa1 = [];
                            for (i = 0; i < fn1.length; i++) {
                                aa1.push(fn1[i]);
                            }
                            aa1.toString();
                            $(aa1).each(function (i, v) {

                                var newStr1 = v;
                                var valdata1 = data1;

                                if (newStr1.indexOf("pui_fun") >= 0) {
                                    var elementId = element.attr('id');
                                    var aaa1 = newStr1.replace("this.value", elementId);
                                } else
                                {
                                    if (valdata1 == "") {
                                        var aaa1 = newStr1.replace("this.value", "");
                                    } else {
                                        var aaa1 = newStr1.replace("this.value", data1);
                                    }
                                }

                                checkflag1 = eval(aaa1);
                                if (checkflag1 == false) {
                                    temp1 = false;
                                }
                            });

                            if (temp1 == false) {
                                flag1 = false;
                            } else {

                                flag1 = true;
                            }
                        }
                    });

                    if (flag1 == true) {
                        NProgress.start();
                        $("#sub_nav_39 li").removeClass('active');
                        $("#sub_nav_39 .All_li").addClass('active');
                        $.post(domainUrl + 'classes/saveInstance', {'data': $("#instance_structure_form").serialize(), 'saveType': saveType, 'myInstanceJsonString': myInstanceJsonString}, responseSaveInstanceProperty, 'html');
                    }
                }

            }
        }
    }


}

function responseCheckValidSelector(data, source) {
    if (data.error_msg != '')
    {
        $("#msg_of_sid").html(data.error_msg);
        $("#sid_popup").modal('show');
    } else
    {
        $.post(domainUrl + 'classes/checkValidSelector', {'selector_ids': data.valid, 'selector': data.selector,
            'action': 'fetch_data',
            'data': $("#instance_structure_form").serialize(),
            //'saveType':saveType,
            //'is_instance':is_instance,
            //'myInstanceJsonString':myInstanceJsonString
        }, responseCheckValidSelectorAgain, 'JSON');
    }
    //$.post(domainUrl+'classes/viewClassCombinedHtml',{'data':$("#instance_structure_form").serialize(),'saveType':saveType,'is_instance':is_instance,'myInstanceJsonString':myInstanceJsonString},responseviewClassCombined,'html');
}

function responseCheckValidSelectorAgain(data, source)
{
    $('#viewClassInstance textarea').val('');
    $('#viewClassInstance').modal('show');
    $('#viewClassInstance').on('shown.bs.modal', function () {
        $('#viewClassInstance textarea').val(data);
        $('#viewClassInstance textarea').focus();
    });
    $("#viewClassInstance .btn").first().removeClass("inactiveLink");
}

/*function responseviewClassCombined(data,source)
 {
 $('#viewClassInstance textarea').val('');
 $('#viewClassInstance').modal('show');
 $('#viewClassInstance').on('shown.bs.modal', function () {
 $('#viewClassInstance textarea').val(data);
 $('#viewClassInstance textarea').focus();
 });
 $("#viewClassInstance .btn").first().removeClass("inactiveLink");
 /!*if($('#viewClassInstance textarea').val().length>0){
 $("#viewClassInstance .btn").first().removeClass("inactiveLink");
 }
 else{
 $("#viewClassInstance .btn").first().addClass("inactiveLink");
 }*!/
 }*/

function responseSaveClassProperty(data, source)
{
    $("#second-class-div").html(data);

    // change code here for selected after save data

    if (selectedNodeIDNumber != undefined) {
        $("#second-class-div .node-content").removeClass("node-selected");
        $("#second-class-div [data-class =" + selectedNodeIDNumber + "]").find(".node-content").first().addClass("node-selected");

    }

    var selectionFlag = false;
    if ($("#node-x-li a").html() == 'Node Z') {
        $("#second-class-div .node-content").each(function (i, v) {
            if ($(this).hasClass('node-selected')) {
                selectionFlag = true;
            }
        });

        if (selectionFlag == false) {
            $("#second-class-div li").eq(nodeselectindex).find('.node-content').first().addClass('node-selected');
        }
    }
    NProgress.done();

    var node_id = $('.node-selected input').not('.self_count_class').val(); //$('.node-selected input').val();
    var nodeName = $('#second-class-div').find('div.node-selected .node-input span').html();
    var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
    if ($("#node-x-li a").html() == 'Node X') {

        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 1, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    } else {
        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 3, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    }

    currentmode = 'Display';

    if ($("#action_type").val() == 'save')
    {
        $('#DataSaveMsg').html("<span>Class Saved Successfully</span>");
        $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
    } else
    {
        $('#DataSaveMsg').html("<span>Class Updated Successfully</span>");
        $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
    }


    $('#DataSaveMsg').fadeIn();
    setTimeout(function () {
        $('#DataSaveMsg').fadeOut();
    }, 3000);

    setPaperBckgrnd();
    manageRightMenuIcon('listing', 'classes');


    if ($("#action_type").val() == 'save')
    {
        if (!$("#div-node-x").hasClass("active"))
        {
            $(".first_hit").click();
        } else
        {
            /* Code By Arvind Soni on date 16 Feb 2016 */
            var lastRow = $("#first-class-div .get-version tbody tr").last().attr('class');
            lastRowClass = lastRow.replace(' list-row', '');
            $("." + lastRowClass).remove();

            var index = 0;
            $("#first-class-div .get-version").each(function () {
                var $rows = $("tbody tr", $(this));
                $rows.each(function (row, v) {
                    var classN = $(this).attr('class');
                    classN = classN.replace(/(lisat-class-row[\d]+)/, '');
                    $(this).removeAttr('class');
                    $(this).addClass(classN);
                    $(this).removeClass('default_row_class');
                    if (row == 0)
                    {
                        $(this).addClass('list-row');
                    }
                    $(this).addClass('lisat-class-row' + index);
                    index++;
                });
            });

            var c_id_new = $("#node_y_class_id").val();
            $("#first-class-div .get-version tbody tr").first().attr('id', 'list-row_' + c_id_new);

            $(".lisat-class-row0 td").each(function (cell, v) {

                if (cell == 0)
                {
                    $(this).html('<input id="r_check' + c_id_new + '" class="single_check" type="checkbox" name="r_check' + c_id_new + '" value="' + c_id_new + '"><label></label>');
                } else if (cell == 1)
                {
                    $(this).attr('id', 'node_class_id_label_' + c_id_new);
                    $(this).addClass('first_class_structure strat_click');
                    $(this).attr('onclick', 'getClassStructure(' + c_id_new + ')');
                    $(this).html(c_id_new);
                } else
                {
                    if (cell == 2)
                    {
                        $(this).attr('id', 'common_name_label_' + c_id_new);
                    } else if (cell == 3)
                    {
                        $(this).attr('id', 'node_type_label_' + c_id_new);
                    } else if (cell == 4)
                    {
                        $(this).attr('id', 'version_label_' + c_id_new);
                    } else if (cell == 5)
                    {
                        $(this).attr('id', 'instance_label_' + c_id_new);
                    } else
                    {
                        $(this).attr('id', 'status_label_' + c_id_new);
                    }
                    $(this).addClass('strat_click');
                    $(this).attr('onclick', 'getClassStructure(' + c_id_new + ')');
                }
            });

            $(".lisat-class-row1 td").each(function (cell, v) {
                $(this).removeClass('first_class_structure');
            });
            /* Code By Arvind Soni on date 16 Feb 2016 */
        }
    }
    removeString();
    setNumberPrint();

}

function responseGetNodeX(data, source)
{
    $("#third-class-div").html(data);
    if ($("#third-class-div").find('.tab-pane').find('span').hasClass('no-dataAvilable')) {
        $("#third-class-div").find('.tab-pane').addClass('no-content-bg-gray');
    } else {
        $("#third-class-div").find('.tab-pane').removeClass('no-content-bg-gray');
        setNumberPrint('third-class-div')
    }
    if (!$('.listing-wrapper').hasClass("active")) {
        defaultSelection();

    } else {
        thirdPaneselection();
    }
    dualPaneHeight();
    manageNiceScroll();
}

function responsegetNodeXThirdPane(data, source)
{
    $("#fourh-class-div").html(data);
    //selectthirdNodeX();
    $(".nano").nanoScroller();
    dualPaneHeight();
    setNumberPrint('fourh-class-div')
}
/* function use here for assign node class instance node id */

function responseSaveInstanceNodeId(data, source) {

    if (parseInt(data.node_id) > 0)
    {
        var appendInstanceId = $("#second-class-div").find(".node-selected .hidden-node-x").val();
        $("#second-class-div").find(".node-selected .hidden-node-x").val(appendInstanceId + ',' + data.node_id);
    }

    if (parseInt(data.node_type_id) == 3 && data.node_instance_id == '')
    {
        var appendNodeZId = $("#second-class-div").find(".node-selected .hidden-node-z").val();
        $("#second-class-div").find(".node-selected .hidden-node-z").val(appendNodeZId + ',' + data.node_id);

        var appendNodeZId1 = $("#second-class-div").find(".node-selected .hidden-node-z-main").val();
        $("#second-class-div").find(".node-selected .hidden-node-z-main").val(appendNodeZId1 + ',' + data.node_class_id);
    }
}
/* end code here */

function responseSaveInstanceProperty(data, source)
{
    NProgress.done();

    if ($("#instance_action_type").val() == 'save')
    {
        $('#DataSaveMsg').html("<span>Instance Saved Successfully</span>");
    } else
    {
        $('#DataSaveMsg').html("<span>Instance Updated Successfully</span>");
    }
    setTimeout(function () {
        $('#DataSaveMsg').fadeOut();
    }, 3000);
    manageRightMenuIcon('listing', 'classes');
    NProgress.start();
    if ($("#instance_action_type").val() == 'save')
    {
        var node_y_class_id = $("#node_y_class_id").val();
        $.post(domainUrl + 'classes/getClassInstance', {'class_id': node_y_class_id, 'page': 1, 'order_by': 'node_instance_id', 'order': 'DESC', 'mode': 'pagination'}, responseGetClassInstance1, 'html');
    } else
    {
        NProgress.done();
        var node_instance_id = $("#node_instance_id").val();
        getInstanceStructure(node_instance_id);
    }

    $('#DataSaveMsg').fadeIn();
}

function responseGetClassInstance1(data, source)
{
    $("#first_instance_div").html(data);
    NProgress.done();
    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
    {
        $(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").addClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "none");
        $(".Edit-icon").hide();
        $(".Cancel-icon").hide();
    } else
    {
        // $(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").removeClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "all");
        $(".Edit-icon").show();
    }
}

function listPage(displayType)
{
    if (displayType == 'Y')
    {
        selectedbtn = "powerBtn";
        NProgress.start();
        var value = $("#temp_item_per_page").val();
        $.post(domainUrl + 'classes/index', {'page': 1, 'order_by': 'node_class_id', 'order': 'DESC', 'type': 'pagination', 'itemPerPage': value}, responsePaginationAjax, 'html');
    } else
    {
        selectedbtn = "barBtn";
        NProgress.start();
        $.post(domainUrl + 'classes/index', {'order_by': 'node_class_id', 'order': 'DESC', 'type': 'no-pagination'}, responsePaginationAjax, 'html');
    }
}

function setNumberPrint(getElement, add_remove_Prop, addSubWrap, nextAllNumPrint1, lastNumVal, instanceCase)
{
    if (getElement) {
        $('#' + getElement + ' .number_print').not(':hidden').each(function (index, el) {
            $(this).text((index + 1));
        });
    } else {
        $('#second-class-div .number_print').not(':hidden').each(function (index, el) {
            $(this).text((index + 1));
            // $(".number_print:visible").last().css("height","22px");
        });
    }
    if (add_remove_Prop) { //instance case
        if (instanceCase) {
            add_remove_Prop = add_remove_Prop;
        } else {
            add_remove_Prop = (add_remove_Prop == 'addProp') ?
                    ((addSubWrap) ? +1 : +2) :
                    ((addSubWrap) ? '-' + add_remove_Prop : '-' + Number(add_remove_Prop + 1));
        }
        var nextAllNumPrint1 = (nextAllNumPrint1) ? nextAllNumPrint1 : $('#second-class-div .number_print1')

        nextAllNumPrint1.each(function (index, el) {
            var callfnOn_elm = $(this).parent().attr('onclick');
            if (lastNumVal) {
                lastNumVal++;
                var currentSubclassNum = parseInt(lastNumVal);
            } else {
                var currentSubclassNum = parseInt($(this).text()) + Number(add_remove_Prop);
            }
            $(this).text(currentSubclassNum);
            if (callfnOn_elm) {
                callfnOn_elm = callfnOn_elm.replace(/,\s?[0-9]+\)$/, ', ' + currentSubclassNum + ')');
                $(this).parent().attr('onclick', callfnOn_elm)
            }
        });
    }
}

function addChildProperty(getElement)
{

    var prop_number = $("#prop_number").val();
    //var lastIndex = $(".property-child li:last span.number_print").text();
    var propHtml = '<li id="prop_temp_li_' + prop_number + '" class="numbering" data-class="prop_temp_li_' + prop_number + '"><div class="node-content  node-selected clearfix"><span class="number_print"></span><div class="node-left"><div class="node-circle node-white-circle">N</div><div class="node-head node-input"><textarea class="runTab" cols="30" rows="1" class="runTab" id="new_property_' + prop_number + '" name="new_property[]" placeholder=""></textarea></div><input type="hidden" class="hidden-node-x" name="node_x_y[]" nodey-value="'+class_nodez_ids+'" value="'+class_nodez_ids+'" id="class_prop_temp_li_' + prop_number + '"><input type="hidden" class="hidden-node-z" name="node_y_z[]" value="" id="node_y_z' + prop_number + '" ><input type="hidden" class="hidden-node-z-main" name="prop_z_main[]" value="" id="prop_z_main' + prop_number + '" ><input type="hidden" class="hidden-node-y" name="hidden_node_y[]" value="" id="hidden_node_y' + prop_number + '" ><input type="hidden" class="hidden-node-y-instance-property-node-id" name="hidden_node_y_instance_property_node_id[]" value="" id="hidden_node_y_instance_property_node_id' + prop_number + '" ></div><div class="node-right hide"><a class="action-move act-mov-sub-cross" onclick="removeProperty(' + prop_number + ');"><span><i class="icon close-small"></i></span></a><a class="action-move act-mov-sub-cross addclass"><span><i class="icon plus-class"></i></span></a></div></div><ol></ol></li>';

    $(".node-content").removeClass("node-selected");
    if (getElement != undefined)
    {
        if (getElement.is("ol"))
        {
            getElement.append(propHtml);
            getElement.find("li:last").find(".runTab").focus();
        } else if (getElement != undefined)
        {
            $(propHtml).insertAfter(getElement);
            getElement.next().find(".runTab").focus();
        }
    } else
    {
        $(".property-child").append(propHtml);
        $(".property-child li:last").find(".runTab").focus();
    }
    var propLen = $('.tabber li').length;
    var addSubWrap = $('.add-sub-child-wrap').is(':visible');
    if (propLen === 1)
    {
        $(".tabber").closest('.sortable').find('.addplus').append('<span class="number_print"></span>');
        $(".tabber").closest('.sortable').find('.addplus').show();

    }
    var new_prop_number = parseInt(prop_number) + 1;
    $("#prop_number").attr('value', new_prop_number);
    stopLastElementTabing();
    textareaIncreaseHeight();
    tabPositions();
    calculatePlusIcons();
    increaseWidthEdit(13);
    setNumberPrint('', 'addProp', addSubWrap);
    manageNiceScroll();
    setPaperBckgrnd();

    //In enter pressing unchecked all checkbox
    if ($("#div-node-x").hasClass("active")) {
        $("#third-class-div input[name='nodeX[]']").removeAttr('checked');
    }
}

function responseFilter(data, source)
{
    $("#first-class-div").html(data);
    NProgress.done();
}

function instanceClassProperty()
{
    tempStatus = $.trim($("#sub_nav_39 div ul .active").text());
    $("#sub_nav_39 li .active").html();
    $("#sub_nav_39 li").removeClass('active');
    $("#sub_nav_39 .All_li").addClass('active');
    var is_instance = $("#is_instance").val();
    $(".classes_top_cl").click();
    if (is_instance == 'N')
    {
        var node_y_class_id = $("#node_y_class_id").val();
        if (parseInt(node_y_class_id) > 0)
        {
            instanceClick = true;
            NProgress.start();
            $.post(domainUrl + 'classes/getClassInstance', {'class_id': node_y_class_id, 'mode': 'Normal'}, responseGetClassInstance, 'html');
        }
    } else
    {
        GoTo(2);

    }

    if ($('.dashSlider').hasClass('paneNum2')) {
        $('.paneNum2').addClass('customPaneSpanWidth');
    }
}

function setInstance()
{
    $("#is_instance").attr('value', 'N');
    $(".ins").remove();
    setWidth();
    setTimeout('instanceClassProperty()', 1000);
}

function responseGetClassInstance(data, source)
{
    $("#div-node-x").before(data);
    var footerHtml = '<li class="ins strat_click" ><a href="#">Instance List</a></li><li class="ins strat_click" ><a href="#">Instance Properties</a></li>';
    $("#node-x-li").before(footerHtml);
    //NProgress.done();

    $("#is_instance").attr('value', 'Y');
    manageRightMenuIcon('listing', 'classes');
    addArrow();
    instanceShowHide();

    /*
     * Created By: Divya Rajput
     * On Date: Dec 31, 2015
     */
    if ($.trim($('#node_y_class_id').val()) == domain_production_class_id) {
        $('a.Edit-icon').addClass('inactiveLink');
        $('a.Edit-icon').css("pointer-events","none");
        $('.Compose-icon').show();
    } else {
        $('.Compose-icon').hide();
    }
    /*End Here*/

    initialLoad();
    GoTo(2);
}

function instanceShowHide() {
    $(".AddNewInstance_li").show();
    $(".AddNewClass_li").hide();

    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
    {
        $(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").addClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "none");
        $(".Edit-icon").hide();
        $(".Cancel-icon").hide();
        NProgress.done();
    } else
    {
        // $(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").removeClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "all");
        $(".Edit-icon").show();
    }
    $(".ExportInstanceData_li").show();
    $(".GenerateInstanceTemplate_li").show();
    $(".ImportInstanceData_li").show();
}

function getInstanceStructure(id)
{
    $(".list-row-instance-class").removeClass('current');
    $("#list-row-instance-id_" + id).addClass('current');
    NProgress.start();
    $.post(domainUrl + 'classes/instanceStructure', {'node_instance_id': id, 'mode': 'Display'}, responseInstanceStructure, 'html');
}

function responseInstanceStructure(data, source)
{

    var ww = $(window).width();
    var sw = $(".sidebar_wrap").outerWidth();
    var uw = $(".user-action-wrap").outerWidth();
    var tw = (ww - (sw + uw)) / 2 - 1;
    $(".set-height.active .intance-table").width(tw + "px");
    $("#second_instance_div").html(data);
    NProgress.done();
    setPaperBckgrnd();
    setNumberPrint('second_instance_div');
    manageNiceScroll();
}

function paginationInstanceAjax(url, page, order_by, order, itemPerPage)
{
    NProgress.start();
    var node_class_id = $("#node_y_class_id").val();
    $.post(url, {'page': page, 'order_by': order_by, 'order': order, 'class_id': node_class_id, 'mode': 'pagination', 'itemPerPage': itemPerPage}, responsePaginationInstanceAjax, 'html');
}

function setPageInstance(value)
{
    NProgress.start();
    var node_class_id = $("#node_y_class_id").val();
    $.post(domainUrl + 'classes/getClassInstance', {'page': 1, 'order_by': 'node_instance_id', 'order': 'DESC', 'mode': 'pagination', 'itemPerPage': value, 'class_id': node_class_id}, responsePaginationInstanceAjax, 'html');
}

function paginationInstanceAjaxList(url, page, order_by, order)
{
    NProgress.start();
    var node_class_id = $("#node_y_class_id").val();
    $.post(url, {'page': page, 'order_by': order_by, 'order': order, 'class_id': node_class_id, 'mode': 'no-pagination'}, responsePaginationInstanceAjax, 'html');
}

function responseInstanceFilter(data, source)
{
    $("#first_instance_div").html(data);
    NProgress.done();
    stopLastElementInstanceTabbing()

    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
    {
        $(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").addClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "none");
        $(".Edit-icon").hide();
        $(".Cancel-icon").hide();
    } else
    {
        //$(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").removeClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "all");
        $(".Edit-icon").show();
    }
}

function responsePaginationInstanceAjax(data, source)
{
    $("#first_instance_div").html(data);
    //NProgress.done(); //commented by divya
    /*Code for toggling of the buttons*/
    if (selectedbtn1 == "barBtn1") {
        $('.barBtn1 .fa').removeClass("barIcon").addClass("squareIconGray");
        $('.powerBtn1 .fa').removeClass("powerIcon").addClass("squareIconArrowWhite");
    } else {
        $('.barBtn1 .fa').removeClass("squareIconGray").addClass("barIcon");
        $('.powerBtn1 .fa').removeClass("squareIconArrowWhite").addClass("powerIcon");
    }

    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
    {
        $(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").addClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "none");
        $(".Edit-icon").hide();
        $(".Cancel-icon").hide();

        NProgress.done();
    } else
    {
        // $(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        $(".ExportInstanceData_li").removeClass('inactive');
        $(".ExportInstanceData_li").find('a').css("pointer-events", "all");
        $(".Edit-icon").show();
    }

    /*
     * Created By: Divya Rajput
     * On Date: Jan 14, 2016
     */
    if ($.trim($('#node_y_class_id').val()) == domain_production_class_id) {
        $('a.Edit-icon').addClass('inactiveLink');
        $('a.Edit-icon').css("pointer-events","none");
        $('.Compose-icon').show();
    } else {
        $('.Compose-icon').hide();
    }
    /*End Here*/
}

function listPageInstance(displayType)
{
    var node_class_id = $("#node_y_class_id").val();
    if (displayType == 'Y')
    {
        selectedbtn1 = "powerBtn1";
        NProgress.start();
        var value = $("#temp_item_per_page_instance").val();
        $.post(domainUrl + 'classes/getClassInstance', {'page': 1, 'order_by': 'node_instance_id', 'order': 'DESC', 'class_id': node_class_id, 'mode': 'pagination', 'itemPerPage': value}, responsePaginationInstanceAjax, 'html');
    } else
    {
        selectedbtn1 = "barBtn1";
        NProgress.start();
        $.post(domainUrl + 'classes/getClassInstance', {'order_by': 'node_instance_id', 'order': 'DESC', 'class_id': node_class_id, 'mode': 'no-pagination'}, responsePaginationInstanceAjax, 'html');
    }
}

function stopLastElementTabing()
{
    // code to stop last tab from popingup and breakingup the layout
    var id = $('.property-child li').last().children().find('input').attr('id');
    var firstID = $('#class_structure_form li').first().children().find('input').first().attr('id');
    $("body").on('keydown', '#' + id + ',#' + firstID, function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9) {
            e.preventDefault();
            // call custom function here - Vimmy for last tab functionality
        }
    });
}

function nodexSelection()
{

    $('body').on("click", '#second-class-div li, #second_instance_div li', function (e) {
        if ($('.dashboard .set-height.active').length == 3) {
            threepanefirstDivClick = true;
            NProgress.start();
        }

        var flag = false

        $(".checkFillInstanceValue").each(function ()
        {
            if ($(this).val().length > 0) {
                flag = true;
            }
        });

        if (flag == false)
        {
            $("#second-class-div .node-selected, #second_instance_div .node-selected").removeClass('node-selected');
            $(this).find(".node-content:first").addClass("node-selected");
            saveNodesValue(this);
        } else
        {
            selectThis = this;
            var selectedLi = $(".thirdPaneActive .node-input").attr("data-class");
            var Id;
            if (selectedLi != undefined)
            {
                Id = selectedLi.split("_")[1];
            }

            if ($(".nodeClass-Y #" + Id).prop('checked') == true)
            {
                var checkboxLength = parseInt($(".nodeClass-Y").length) - 1;
                $(".nodeClass-Y").each(function (i, v) {
                    if ($(this).find('input').attr('id') == Id) {
                        selectPreValue = $(this).find('input').attr('value');
                        if (selectPreValue == undefined) {
                            selectPreValue = $(this).siblings(".sprite-icon").attr('id');
                        }
                        $.post(domainUrl + 'classes/saveInstanceData', {'data': $("#instance_structure_form").serialize()}, responseSaveInstanceNodeId111, 'json');
                    }
                });
            } else
            {
                $("#second-class-div .node-selected").removeClass('node-selected');
                $("#second_instance_div .node-selected").removeClass('node-selected');
                $(this).find(".node-content:first").addClass("node-selected");
                saveNodesValue(this);
            }
        }
        if ($(".thirdPaneActive").length) {
            setTimeout('$(".thirdPaneActive .node-left").trigger("click");', 1000);
        }
        e.stopPropagation();
    });
}

function responseSaveInstanceNodeId111(data, source) {

    if (parseInt(data.node_id) > 0)
    {
        var appendInstanceId = $("#second-class-div").find(".node-selected .hidden-node-x").val();
        $("#second-class-div").find(".node-selected .hidden-node-x").val(appendInstanceId + ',' + data.node_id);
    }

    if (parseInt(data.node_type_id) == 3 && data.node_instance_id == '')
    {
        var appendNodeZId = $("#second-class-div").find(".node-selected .hidden-node-z").val();
        $("#second-class-div").find(".node-selected .hidden-node-z").val(appendNodeZId + ',' + data.node_id);

        var appendNodeZId1 = $("#second-class-div").find(".node-selected .hidden-node-z-main").val();
        $("#second-class-div").find(".node-selected .hidden-node-z-main").val(appendNodeZId1 + ',' + data.node_class_id);
    }



    $("#second-class-div .node-selected").removeClass('node-selected');
    $(selectThis).find(".node-content:first").addClass("node-selected");
    saveNodesValue(selectThis);
    selectThis = undefined;
    selectPreValue = undefined;
}

function responseNodeZClassName(data) {

    if (data.caption_name != "" && data.caption_name != null)
    {
        $(".show-edit-node-cust i").css("visibility", "visible");
        $(".add-fly-radio-checked i").removeClass('plus-small').addClass('edit-class-select');
        $('#flyRadioBtnWrapper').show();
        $(".nodeZClassName").html(data.caption_name);
    } else
    {
        if ($(".radio_class_check_plus").is(":checked") == true) {

            $(".show-edit-node-cust i").css("visibility", "visible");
        }
        $(".add-fly-radio-checked i").addClass('plus-small').removeClass('edit-class-select');
        $(".sub_class_list_view1").hide();
    }
}

function saveNodesValue(obj)
{
    var selctedliId = "";
    var selctedCheckarray = [];
    var selctedCheckarrayNodeY = [];

    selctedliId = "";
    selctedliId = $(obj).attr("data-class");
    selectedNodeIDNumber = selctedliId;

    var node_id = $('.node-selected input').not('.self_count_class').val(); //$('.node-selected input').val();
    var mode = $("#second-class-div #prop_number").val();
    var type = $("#second-class-div #viewTypeClass").val();

    if (type === undefined)
    {
        if (mode == undefined) {
            var modetype = 'Display';
        } else {
            var modetype = 'Edit';
        }
    } else
    {
        var is_ins_class = $('#second-class-div .node-selected .is_ins_class').val();
        if (is_ins_class == undefined) {
            var modetype = 'Edit';
        } else {
            var modetype = 'Display';
        }
    }



    var nodeName = $('#second-class-div').find('div.node-selected .node-input span').html();
    var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
    if ($("#node-x-li a").html() == 'Node X') {
        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': modetype, 'nodeTypeId': 1, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    } else {
        $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': modetype, 'nodeTypeId': 3, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
    }


    /*if(selctedliId != undefined)
     {

     if($('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr('nodey-value')!=""){
     if($("#NodeX-tab:visible").hasClass("nodexdisplay")){
     $(".sprite-icon").css("visibility","hidden");
     selctedCheckarrayNodeY = $('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr("NodeY-value");
     if(selctedCheckarrayNodeY != undefined){
     var pp =selctedCheckarrayNodeY.split(',');
     for(i=0;i<pp.length;i++){
     $('#third-class-div span[id='+pp[i]+']').css("visibility","visible");
     }
     }

     if($("#div-node-x-property").hasClass("active")){
     parentDivSelection('Display');
     }
     }
     else {

     $("input[name='nodeX[]']").removeAttr('checked');
     selctedCheckarrayNodeY = $('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr("NodeY-value");
     if(selctedCheckarrayNodeY != undefined){
     var pp =selctedCheckarrayNodeY.split(',');
     for(i=0;i<pp.length;i++){
     $('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
     }
     }
     if($("#div-node-x-property").hasClass("active")){
     parentDivSelection('Edit');
     }
     }
     } else {

     $("input[name='nodeX[]']").removeAttr('checked');
     $(".sprite-icon").css("visibility","hidden");
     $('#third-class-div li:first').addClass("thirdPaneActive");
     }
     }*/
}

function selectthirdNodeX()
{

    if (currentmode == "Display") {
        $('.thirdnodeX-Panel').css("visibility", "hidden");
        var selctedCheckarray = $("#second-class-div").find(".node-selected .hidden-node-x").val();

        if (selctedCheckarray != undefined) {
            var pp = selctedCheckarray.split(',');
            for (i = 0; i < pp.length; i++) {
                $('#fourh-class-div [id=' + pp[i] + ']').css("visibility", "visible");
            }
        }
    } else {

        /*// $('.thirdnodeX-Panel').css("visibility","hidden");
         var selctedCheckarray = $("#second-class-div").find(".node-selected .hidden-node-x").val();
         if(selctedCheckarray != undefined){

         var pp =selctedCheckarray.split(',');
         for(i=0;i<pp.length;i++){
         $('#fourh-class-div input[id='+pp[i]+']').prop('checked','checked');
         }
         }*/
    }
}

function parentDivSelection(mode)
{
    var firstSelectedNode = 0;
    var flag = true;
    var nodeTypeId = '';

    if (mode == "Display") {
        $("#third-class-div .sprite-icon").each(function (i, v) {
            var visiblityshow = $(this).css("visibility");
            if (visiblityshow == "visible") {
                if (flag == true) {
                    firstSelectedNode = $(this).attr("id");
                    $('#third-class-div li').removeClass("thirdPaneActive");
                    $(this).closest('li').addClass("thirdPaneActive");
                    flag = false;
                }
            }
        });

        //$('[id='+firstSelectedNode+']').trigger( "click" );
        var selctedliId = $('#third-class-div [id=' + firstSelectedNode + ']').parent().find('.node-input').attr("data-class");
        var selctedlname = $('#third-class-div [id=' + firstSelectedNode + ']').parent().find('.node-input').find('span').html();
        if (selctedliId == undefined) {
            selctedliId = "Display_0"
        }
    } else {
        $('#third-class-div .nodeClass-Y input').each(function (i, v) {
            var firstChecked = $(this).prop('checked');
            if (firstChecked == true) {
                if (flag == true) {
                    firstSelectedNode = $(this).attr("id");
                    $('#third-class-div li').removeClass("thirdPaneActive");
                    $(this).closest('li').addClass("thirdPaneActive");
                    flag = false;
                }
            }
        });
        if (flag == true) {
            $('#third-class-div li:first').addClass("thirdPaneActive");
        }

        var selctedliId = $('#third-class-div [id=' + firstSelectedNode + ']').parent().parent().find('.node-input').attr("data-class");
        var selctedlname = $('#third-class-div [id=' + firstSelectedNode + ']').parent().parent().find('.node-input').find('span').html();

        if (selctedliId == undefined) {
            selctedliId = "Edit_0"
        }
    }
    var NodeYId = selctedliId.split("_");
    if (NodeYId[0] == "Display") {
        currentmode = "Display";
    } else {
        currentmode = "Edit";
    }

    $("#property-heading").html('');
    if ($("#node-x-li a").html() == 'Node X') {
        var nodeXPropertyName = selctedlname;
    } else {
        var nodeXPropertyName = selctedlname;
    }
    $("#property-heading").html(cutString(nodeXPropertyName));

    var node_id = '';
    if ($('.node-selected input').attr('id') == 'class_caption') {
        node_id = $('.node-selected .hidden-node-x').val();
    } else {
        node_id = $('.node-selected input').val();
    }
    $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': NodeYId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': nodeXPropertyName}, responsecheckInstanceData, 'json');
}

function defaultSelection()
{
    var flag = false;
    var pp = [];
    var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');

    if (value != undefined) {

        pp = value.split(',');
        for (i = 0; i < pp.length; i++) {
            $('span[id=' + pp[i] + ']').css("visibility", "visible");
            $('#third-class-div input[value=' + pp[i] + ']').prop('checked', 'checked');
        }
    }
    if (selectedNodeYId == 0) {
        $('#third-class-div li:first').addClass("thirdPaneActive");
    } else {
        $('#third-class-div .node-left').siblings(".nodeClass-Y").each(function (i, v) {
            if ($(this).find('input').attr('value') == selectedNodeYId) {
                $(this).closest('li').addClass('thirdPaneActive');
                flag = true;
            }
        });

        $('#third-class-div .node-left').siblings('.sprite-icon').each(function (i, v) {
            if ($(this).attr('id') == selectedNodeYId) {
                $(this).closest('li').addClass('thirdPaneActive');
                flag = true;
            }
        });

        if (flag == false) {
            $('#third-class-div li:first').addClass("thirdPaneActive");
        }
    }

    //$('#third-class-div li:first').addClass("thirdPaneActive");
    var selctedliId = $("li.thirdPaneActive .node-input").attr("data-class");

    var selctedlName = $("li.thirdPaneActive .node-input").find('span').html();

    if (selctedliId == undefined) {
        selctedliId = "Display_0";
        selctedlName = "Display";
    }
    divideInThreePane(selctedliId, selctedlName);
}

function divideInThreePane(selctedliId, selctedlName)
{
    $('li').removeClass('thirdPaneActive');
    $('[data-class=' + selctedliId + ']').closest('li').addClass('thirdPaneActive');
    var nodeXPropertyName = '';
    //code for breadcrumb
    var NodeYId = selctedliId.split("_");

    if (NodeYId[0] == "Display") {

        currentmode = "Display";

    } else {

        currentmode = "Edit";
    }
    $("#property-heading").html('');
    if ($("#node-x-li a").html() == 'Node X') {
        nodeXPropertyName = 'Node X (Properties): ' + selctedlName;
    } else if ($("#node-x-li a").html() == 'Node Z') {
        nodeXPropertyName = 'Node Z (Properties): ' + selctedlName;
    } else {
        nodeXPropertyName = 'Node Y (Properties): ' + selctedlName;
    }
    $("#property-heading").html(cutString(nodeXPropertyName));

    var classId = $("#node_y_class_id").val();
    var node_id = '';
    if ($('.node-selected input').attr('id') == 'class_caption') {
        node_id = $('.node-selected .hidden-node-x').val();
    } else {
        node_id = $('.node-selected input').val();
    }
    $.post(domainUrl + 'classes/checkInstanceData', {'node_class_id': NodeYId[1], 'node_id': node_id, 'full_class_id': selctedliId, 'selctedlName': nodeXPropertyName}, responsecheckInstanceData, 'json');
    //$.post(domainUrl+'classes/instanceStructure',{'mode':NodeYId[0],'node_class_id':NodeYId[1],'node_id':node_id},responsenodex,'html');
    if (currentmode == 'Edit' || currentmode == 'Display') {
        $("#instance_structure_form").attr('class', 'form_active1');
    }
}

function divideInThreePaneX(selctedliId, selctedlName)
{
    $('li').removeClass('thirdPaneActive');
    if (selctedliId == "Edit_0") {
        $("#third-class-div li:first").addClass('thirdPaneActive');
    } else {
        $('[data-class=' + selctedliId + ']').closest('li').addClass('thirdPaneActive');
    }


    //code for breadcrumb
    var NodeYId = selctedliId.split("_");

    if (NodeYId[0] == "Display") {
        currentmode = "Display";
    } else {
        currentmode = "Edit";
    }

    $("#property-heading").html('');
    if ($("#node-x-li a").html() == 'Node X') {

        var nodeXPropertyName = 'Node X (Properties): ' + selctedlName;
    } else {
        var nodeXPropertyName = 'Node Z (Properties): ' + selctedlName;
    }
    $("#property-heading").html(cutString(nodeXPropertyName));

    var classId = $("#node_y_class_id").val();
    var node_id = $('.node-selected input').val();


    /*if(NodeYId[0]=='Display'){

     $.post(domainUrl+'classes/instanceStructure',{'mode':NodeYId[0],'node_class_id':NodeYId[1],'node_id':node_id,'nodeType':$("#node-x-li a").html(),'is_instance':$("#is_instance").val()},responsenodex,'html');

     }
     else {*/
    var parentNodeId = '';
    if($('#parent_class').length){
        parentNodeId = $('#parent_class').val();
    }
    $.post(domainUrl + 'classes/addNewInstance', {'node_class_id': NodeYId[1], 'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'is_instance': $("#is_instance").val(),'parentNodeId':parentNodeId}, responsenodex, 'html');
    //}

    if (currentmode == 'Edit' || currentmode == 'Display') {
        $("#instance_structure_form").attr('class', 'form_active1');
    }
}

function divideInThreePaneInstance(selctedliId, selctedlName)
{
    $('li').removeClass('thirdPaneActive');
    $('[data-class=' + selctedliId + ']').closest('li').addClass('thirdPaneActive');

    //code for breadcrumb
    var NodeYId = selctedliId.split("_");
    if (NodeYId[0] == "Display") {

        currentmode = "Display";

    } else {

        currentmode = "Edit";
    }

    $("#property-heading").html('');
    if ($("#node-x-li a").html() == 'Node X') {
        var nodeXPropertyName = 'Node X (Properties): ' + selctedlName;
    } else {
        var nodeXPropertyName = 'Node Z (Properties): ' + selctedlName;
    }


    $("#property-heading").html(cutString(nodeXPropertyName));



    var classId = $("#node_y_class_id").val();
    var node_id = '';
    if ($('.node-selected input').attr('id') == 'class_caption') {
        node_id = $('.node-selected .hidden-node-x').val();
    } else {
        node_id = $('.node-selected input').val();
    }


    $.post(domainUrl + 'classes/instanceStructure', {'mode': NodeYId[0], 'node_class_id': NodeYId[1], 'node_id': node_id, 'node_y_class_id': classId}, responsenodex, 'html');
    if (currentmode == 'Edit' || currentmode == 'Display') {
        $("#instance_structure_form").attr('class', 'form_active1');
    }
}

function responsecheckInstanceData(data, source)
{
    if (data.checkvalue > 0) {
        divideInThreePaneInstance(data.full_class_id, data.selctedliId); // for edit and view
    } else {

        divideInThreePaneX(data.full_class_id, data.selctedliId); // for add only
    }
}

function responsenodex(d, s)
{
    $("#fourh-class-div").html(d);
    //NProgress.done();
    setPaperBckgrnd();
    $("#instance_structure_form").attr('class', 'form_active1');

    if ($("#third-class-div").find('.tab-pane').find('span').hasClass('no-dataAvilable'))
    {
        $("#fourh-class-div").find('form').addClass('no-content-property-bg-gray');
        $("#fourh-class-div").find('.number_print').css('display', 'none');

    } else {
        setNumberPrint('fourh-class-div');
        $("#fourh-class-div").find('.number_print').css('display', 'block');
    }

    // >>> AMIT MALAKAR
    // EDIT MODE
    // set version 1.0 if version selected
    if ($(".thirdPaneActive").find('.node-input').attr("data-name") == 'VERSION') {
        //if($.trim($("#node_y_class_id").val())== ""){

        var checkTextArea = $('#instance_structure_form')
                .find(' ol.class-wrapper.sortable li ol.sortable li:first-child ol li:nth-child(2) ol li')
                .find('textarea.instanceRunTab.checkFillInstanceValue').val();
        if ($.trim(checkTextArea) == "") {
            $('#instance_structure_form')
                    .find(' ol.class-wrapper.sortable li ol.sortable li:first-child ol li:nth-child(2) ol li')
                    .find('textarea.instanceRunTab.checkFillInstanceValue')
                    .val('1');
        }
        //}
    }

    // VIEW MODE
    // get common name
    var cn_v_textarea = $('#second-class-div').find('ol.class-wrapper.sortable')
            .find('li ol li:first-child ol li').find('span').html();
    // insert into span
    $('#fourh-class-div').find('ol.class-wrapper.sortable')
            .find('li ol.class-wrapper.sortable li:first-child ol li ol li:nth-child(2) ol li')
            .find('div.node-head.node-input').children('span').html(cn_v_textarea);

    var property_child = $('#class_structure_form').find('div.node-selected').parents().hasClass('property-child');
    var property_string = $('#class_structure_form').find('div.node-selected').children('div.node-left').children('div.node-input').children('span').html();

    if (typeof property_string === 'undefined') {
        property_string = '';
    }
    /*if(property_child || property_string.trim() == 'Properties') {
     // disable common name
     cn_textarea.prop("readonly", true);
     }*/


    var nodeId1 = $('#second-class-div .node-selected .hidden-node-y').val();
    if ($('#second-class-div .node-selected .hidden-node-y').val() != "") {
        $.post(domainUrl + 'classes/getClassNameNodeZ', {'nodeId': nodeId1}, responseNodeZClassName, 'json');
    } else {
        if ($(".radio_class_check_plus").is(":checked") == true) {

            $(".show-edit-node-cust i").css("visibility", "visible");
        }
        $(".add-fly-radio-checked i").addClass('plus-small').removeClass('edit-class-select');
        $(".sub_class_list_view1").hide();
    }

    if (newVersionClick != true) {
        NProgress.done();

        manageNiceScroll();
        adjustWidthClassStructure('expand', 'second-class-div')//increase width of pane 2 when user click on z-node
    }
}

function responseinstanceData(d, s)
{
    if ($('.node-content.node-selected input.hidden-node-x').val() != undefined) {
        combineVal = $('.node-content.node-selected input.hidden-node-x').val().split(",");
    } else {
        combineVal = '';
    }
    if ($('.nodeClass-Y input[value=' + d.selected_node_class_id + ']').prop("checked") == true) {

        if ($("#node-x-li a").html() == 'Node X') {
            combineVal.push(d.node_id + ',' + d.selected_node_class_id);
        } else {
            combineVal.push(d.node_id);
        }
    } else {
        for (var i = 0; i < combineVal.length; i++) {
            if (combineVal[i] === d.node_id)
                combineVal.splice(i, 1);
        }
    }

    $('.node-content.node-selected input.hidden-node-x').val('')
    $('.node-content.node-selected input.hidden-node-x').val(combineVal);
    combineVal = [];
    if ($('.node-content.node-selected input.hidden-node-x').val() == "") {
        $('.node-content.node-selected input.hidden-node-x').val('0');
    }
}

function thirdPaneselection()
{
    var pp = [];
    var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');
    if (value != undefined) {
        pp = value.split(',');
        for (i = 0; i < pp.length; i++) {
            $('span[id=' + pp[i] + ']').css("visibility", "visible");
            $('#third-class-div input[value=' + pp[i] + ']').prop('checked', 'checked');
        }
    }
    $('#third-class-div li:first').addClass("thirdPaneActive");
}

function saveInstanceVal()
{
    if ($.trim($("#node_instance_id").val()) == "")
        $("#instance_action_type").attr('value', 'save');
    else
        $("#instance_action_type").attr('value', 'edit');

    if ($.trim($("#instance_caption").val()) != "")
        /*check here third pane node class id*/
        var selctedliId = $("#third-class-div .thirdPaneActive").find('.node-input').attr("data-class");
    var selctedlName = $("#third-class-div .thirdPaneActive").find('.node-input').attr("data-name");
    var classId = selctedliId.split("_");
    var NodepropertyName = $(this).find('.node-input').find('span').html();
    var node_id = $('.node-selected input').val();
    $.post(domainUrl + 'classes/saveInstanceData', {'data': $("#instance_structure_form").serialize()}, responseInstanceNodeId, 'json');

    //var node_id = $('.node-selected input').val();
    //$.post(domainUrl+'classes/checkInstanceData',{'node_class_id':classId[1],'node_id':node_id,'full_class_id':selctedliId,'selctedlName':NodepropertyName},responsecheckInstanceData,'json');
}

function responseInstanceNodeId(data, source)
{

    var instanceFlag = 0;
    if (parseInt(data.node_id) > 0)
    {
        var appendInstanceId = $("#second-class-div").find(".node-selected .hidden-node-x").val();
        $("#second-class-div").find(".node-selected .hidden-node-x").val(appendInstanceId + ',' + data.node_id);
    }

    if (parseInt(data.node_type_id) == 3 && data.node_instance_id == '')
    {
        var appendNodeZId = $("#second-class-div").find(".node-selected .hidden-node-z").val();
        $("#second-class-div").find(".node-selected .hidden-node-z").val(appendNodeZId + ',' + data.node_id);

        var appendNodeZId1 = $("#second-class-div").find(".node-selected .hidden-node-z-main").val();
        $("#second-class-div").find(".node-selected .hidden-node-z-main").val(appendNodeZId1 + ',' + data.node_class_id);
    }


    if (data.node_id != "") {

        if ($.trim($("#node_y_class_id").val()) == "")
            $("#action_type").attr('value', 'save');
        else
            $("#action_type").attr('value', 'edit');
        sendClassJson();
        var myJsonString = JSON.stringify(classBuilder);

        var saveType = $("#saveTypeClass").val();
        var selectednode = $('.nodeselection-dropdown').val();
        if (parseInt(selectednode) == 1 || parseInt(selectednode) == 2)
        {
            if (saveType == 'P')
            {
                var checkNodeZInstances = 0;
                var index = 1;
                $("#class_structure_form .class-wrapper li .hidden-node-z").each(function () {

                    var nodezVal = $(this).val();
                    var arr = nodezVal.split(',');
                    arr = $.grep(arr, function (n, i) {
                        return (n !== "" && n != null);
                    });
                    /* Modified by: Amit Malakar 02-May-16 - isParent added */
                    var isParent = $(this).siblings('div.node-white-circle-expanded').length;

                    if ($.trim($("#node_y_class_id").val()) == '') {
                        if (parseInt(index) == 1) {
                            if (parseInt(arr.length) < 2) {
                                checkNodeZInstances = 1;
                            }
                        } else if (parseInt(index) == 2) {
                            if (parseInt(arr.length) < 1) {
                                checkNodeZInstances = 1;
                            }
                        } else {
                            if (isParent && parseInt(arr.length) < 1) {
                                checkNodeZInstances = 1;
                            } else if (!isParent && parseInt(arr.length) < 4) {
                                checkNodeZInstances = 1;
                            }
                        }
                    }

                    if ($.trim($("#node_y_class_id").val()) != '') {
                        if (parseInt(index) == 1) {
                            if (parseInt(arr.length) < 3) {
                                checkNodeZInstances = 1;
                            }
                        } else if (parseInt(index) == 2) {
                            if (parseInt(arr.length) < 2) {
                                checkNodeZInstances = 1;
                            }
                        } else {
                            if (isParent && parseInt(arr.length) < 2) {
                                checkNodeZInstances = 1;
                            } else if (!isParent && parseInt(arr.length) < 5) {
                                checkNodeZInstances = 1;
                            }
                        }
                    }
                    index++;
                });

                //if (checkNodeZInstances == 1 && versioningTypeValidation == 1)
                if (checkNodeZInstances == 1 && false)
                {
                    NProgress.done();
                    bootbox.alert("NODE Z field is mandatory. NODE Y cannot be published without filling out all NODE Z!");
                    return false;
                }
            }
        }

        /* code here to check validation NodeX class */

        if ($("#node-x-li a").html() == "Node X" && $(".image-slider a").length > 2)
        {
            var flagCheck1 = checkValidate();

            if (flagCheck1 == true)
            {
                NProgress.start();
                $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
            }
        } else if ($("#node-x-li a").html() == "Node Z" && $(".image-slider a").length > 2)
        {
            $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
            if (saveType == 'P') {
                $("#first-class-div .current.default_row_class td:last").html("Published");
                $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);
            }
        } else
        {
            if ($(".image-slider a").length < 3)
                $.post(domainUrl + 'classes/saveClass', {'data': $("#class_structure_form").serialize(), 'propertyJson': myJsonString, 'mode': 'normal', 'saveType': saveType}, responseSaveClassProperty, 'html');
        }
    }
}

function newVersion() {

    var versionVal = $(".list-row.current").find('td').eq(4).html();
    var node_y_class_id = $("#node_y_class_id").val();
    $.post(domainUrl + 'classes/checkVersionVal', {'class_id': node_y_class_id, 'version': versionVal}, responseversioncheck, 'JSON');
}

function responseversioncheck(d, s) {

    var versionVal, newVer = "";
    var nextVer = 0;
    var versionVal = $(".list-row.current").find('td').eq(4).html();
    var newVer = versionVal.split(".");
    $(".version-table").find("#major_cur_vers").html($.trim(newVer[0]));
    nextVer = parseInt(newVer[0]) + 1;
    $(".version-table").find("#major_next_vers").html($.trim(d.majorVersion));
    $(".version-table").find("#minor_cur_vers").html($.trim(versionVal));
    $(".version-table").find("#minor_next_vers").html($.trim(d.nextVersion) + "<span class='last-word'>" + $.trim(d.nextVersion2) + "</span>");
    $('#versionModal').modal('show');
}

function createVersion(vertype) {

    newVersionClick = true;
    NProgress.start();
    var node_y_class_id = $("#node_y_class_id").val();
    var node_id = $('.node-selected input.hidden-node-x').val();
    var majorVersion = $(".version-table").find("#major_next_vers").html();
    if ($("#node-x-li a").html() == 'Node X') {
        $.post(domainUrl + 'classes/versionClassStructure', {'class_id': node_y_class_id, 'node_id': node_id, 'node_type_id': 1, 'vertype': vertype, 'majorVersion': majorVersion}, responseversionClassStructure, 'JSON');
    } else {
        $.post(domainUrl + 'classes/versionClassStructure', {'class_id': node_y_class_id, 'node_id': node_id, 'node_type_id': 3, 'vertype': vertype, 'majorVersion': majorVersion}, responseversionClassStructure, 'JSON');
    }
    checkVersionMode = 1;
}

function responseversionClassStructure(d, s) {

    var is_instance = $("#is_instance").val();

    if (is_instance == 'N')
    {
        var node_y_class_id = d.node_y_class_id;
        if (parseInt(node_y_class_id) > 0)
        {
            if (newVersionClick == true) {
                $(".breadcrumb  li:first").click();
                newVersionClick = false;
            }
            $.post(domainUrl + 'classes/index', {'filter_operator': 'Autometic', 'search_text': 'AutometicAll'}, responseCallVersionAutometic, 'html');
        }
    }


}

function responseCallVersionAutometic(data, source)
{
    var tempControler = $("#tempControler").val();
    var tempAction = $("#tempAction").val();
    var headingName = '';

    headingName = tempControler;

    $('.left-side-heading').html(ucfirst(headingName));
    $('.manifest-tab').remove();
    $('.content-wrapper-new').siblings('.user-action-wrap').hide();

    if (tempControler != "grid" && tempControler != "associations" && tempControler != "accounts" && tempControler != "process" && tempControler != "menudashboard" && tempControler != "calendar")
    {
        $("#center-screen").hide();
        $("#ControlBar").hide();
        $('#menudashboard').hide();
        $('#calender-screen').hide();
        $(".pui_center_content").show();

        /* For Class List */
        $(".pui_center_content").html(data);
        NProgress.done();
        $('.my-profile').removeClass('active');
        $(".All_li").addClass('active');
        //$("#sub_nav_39 ul .Draft_li").addClass('active');

        var class_id = $(".first_class_structure").html();
        $("#list-row_" + class_id).addClass('current');
        editClassPropertyVersion(class_id);
        /* Other */
        $('.content-wrapper-new').siblings('.user-action-wrap').hide();
        $("#main_action_menu").show();
        $("#parti_action_div_id").show();
        $("#firstTime").attr('value', 'N');
        $('.class-table tr input[type="checkbox"]').attr("disabled", true);
    }


    StopTabBreak("class_structure_form");
    StopTabBreak("instance_structure_form");
    setNumberPrint('second_instance_div');
    /*========(To set the scroll for create new version)=============*/
    if (checkVersionMode == 1) {
        addArrow();
        checkVersionMode = 0;
    }
    manageNiceScroll();
}

function editClassPropertyVersion(class_id)
{
    var is_instance = $("#is_instance").val();
    if (is_instance == 'N')
    {
        var node_y_class_id = class_id;
        if (parseInt(node_y_class_id) > 0)
        {
            NProgress.start();
            $.post(domainUrl + 'classes/classStructure', {'class_id': node_y_class_id, 'mode': 'Edit', 'version': 1}, responseEditClassProperty, 'html');

        }
    }
}

function cutString(test)
{


    var newVar = '', string = '', withstr = '';
    if (test != '' && test != undefined) {
        string = test.split(":");

        if (string[1] != '' && string[1] != undefined) {

            if (string[2] != '' && string[2] != undefined) {


                if (string[2].replace(/\s\s+/g, '').length >= 16)
                {

                    newVar = string[2].replace(/\s\s+/g, '').substr(0, 16);
                    withStr = $.trim(string[1]) + ': ' + newVar + '...';
                    return withStr;
                } else
                {

                    withStr = string[1] + ': ' + string[2].replace(/\s\s+/g, '');
                    return withStr;
                }
            } else
            {

                if (string[1].replace(/\s\s+/g, '').length >= 16)
                {
                    newVar = string[1].replace(/\s\s+/g, '').substr(0, 16);
                    withStr = string[0] + ': ' + newVar + "...";
                    return withStr;
                } else
                {
                    withStr = string[0] + ': ' + string[1].replace(/\s\s+/g, '');
                    return withStr;
                }

            }

        }

    }
}

function setValueOfNodeZ(obj, id)
{
    $("#instance_property_caption" + id).val(obj.value);

    if ($(".thirdPaneActive").find('.node-input').attr("data-name") == "DATATYPE") {
        if (obj.value != "Class")
        {
            if ($(".radio_class_check_plus").is(":checked") == true) {

                $(".show-edit-node-cust i").css("visibility", "visible");
            }

            $('#second-class-div .node-selected .hidden-node-y').val('')
            $('#second-class-div .node-selected .hidden-node-y-instance-property-node-id').val('')

            $(".add-fly-radio-checked i").removeClass('plus-small').removeClass('edit-class-select');
            $(".show-edit-node-cust i").css("visibility", "hidden");
            $(".sub_class_list_view1").hide();
        } else {
            if ($('#second-class-div .node-selected .hidden-node-y').val() != "") {
                $(".add-fly-radio-checked i").removeClass('plus-small').addClass('edit-class-select');
                $(".sub_class_list_view1").show();
            } else {
                $(".add-fly-radio-checked i").addClass('plus-small').removeClass('edit-class-select');
                $(".show-edit-node-cust i").css("visibility", "visible");
                $(".sub_class_list_view1").hide();
            }
        }
    }

    if (obj.id == "data_source_type")
    {
        if(obj.value == 'Class Property')
        {
            $("#class_property_details_li").show();
            $(".class_property_details_class").attr('style','');
        }
        else
        {
            $("#class_property_details_li").hide();
            $(".class_property_details_class").val('--');
            $(".class_property_details_class").attr('style','');
        }
    }
}

function setValueOfNodeZcheckBox(obj, id)
{
    var textval = "";
    $(".checkClass_" + id).each(function (index) {
        if ($(this).prop("checked") == true)
        {
            textval = textval + $(this).val() + checkboxSep;
        }
    });

    if ($.trim(textval) == '')
        textval = checkboxSep;

    $("#instance_property_caption" + id).val(textval);
}

function setValueOfNodeZ_clone(obj, id)
{

    $("#instance_property_caption_clone" + id).val(obj.value);
}

function setValueOfNodeZcheckBox_clone(obj, id)
{
    var textval = "";
    $(".checkClass_clone_" + id).each(function (index) {
        if ($(this).prop("checked") == true)
        {
            textval = textval + $(this).val() + checkboxSep;
        }
    });

    if ($.trim(textval) == '')
        textval = checkboxSep;

    $("#instance_property_caption_clone" + id).val(textval);
}

function setValueOfNodeZForFile(obj, id)
{
    //$(".thirdPaneActive .nodeClass-Y input[name='nodeX[]']").prop('checked',true)
    var fData = new FormData(document.getElementById("instance_structure_form"));
    if($('#instance_structure_form #node_class_id').val()=="632"){
        
        var FileUploadPath = document.getElementById('filenodeZ'+id).value;
        var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "png" || Extension == "jpeg" || Extension == "jpg") {
            var file = document.getElementById('filenodeZ'+id).files[0];
           // console.log(file);
            if (file.size > 100000) {
                alert('Max Upload size is 100KB only');
                return false;
            }
        }else {
            alert("Photo only allows file types of PNG, JPG, and JPEG");
            return false;

        }            
    }
    
        var checkVal = $("#instance_property_caption" + id).attr('value');
        if (checkVal != "") {
            fData.append('imgName', checkVal);
        }
        fData.append('fileName', obj.value);
        fData.append('id', id);
    
        $.ajax({
            type: "POST",
            url: domainUrl + 'classes/saveNodeZFile',
            type: "POST",
            data: fData,
            dataType: 'json',
            async: true,
            enctype: 'multipart/form-data',
            processData: false, // tell jQuery not to process the data
            contentType: false,
            beforeSend:function(){displayLoader()},
            success: function (msg)
            {
                hideLoader();
                if (typeof msg.errorMsg != undefined && typeof msg.fileName == undefined)
                {
                    bootbox.alert(msg.errorMsg);
                    return false;
                } else
                {
                    $("#instance_property_caption" + id).attr('value', msg.fileName);
                }
            }
        });
        //$("#filenodeZ"+id).val();
        
    
    
}

function setClassAndInstancePropertyNodeIds()
{
    var node_y_class_node_ids = "";
    var node_y_class_node_name = "";
    $('.single_radio_check').each(function () {
        if (this.checked == true)
        {
            node_y_class_node_ids = this.value;
        }
    });

    var node_y_instance_value_node_ids = "";
    $('.single_radio_check1').each(function () {
        if (this.checked == true)
        {
            node_y_instance_value_node_ids = node_y_instance_value_node_ids + this.value + ',';
        }
    });

    if (node_y_class_node_ids != "") {

        if (node_y_instance_value_node_ids == "") {

            bootbox.alert("Please select instances for the selected class.");
            return false;
        }
    }

    $("#second-class-div").find(".node-selected .hidden-node-y").val(node_y_class_node_ids);
    $("#second-class-div").find(".node-selected .hidden-node-y-instance-property-node-id").val(node_y_instance_value_node_ids);

    if ($("#second-class-div").find(".node-selected .hidden-node-y").val() != "") {

        $(".add-fly-radio-checked i").removeClass('plus-small').addClass('edit-class-select');

        $(".show-edit-node-cust i").css({"visibility": "visible"});

        $(".sub_class_list_view1").show();
        node_y_class_node_name = $(".list-row.current").find(".td_new_name").html();
        $(".nodeZClassName").html(node_y_class_node_name);
    }

    $(".classesInstance_Cancel").trigger('click');
}

/*
 * Created By: Divya Rajput
 * ON Date: Nov 24, 2015
 * To show subclass structure within class

 * Modified By Divya Rajput
 * ON Date: Jan 19, 2015
 * To show/hide structure within sec
 */
function getSubClassStructure(node_class_id, subchildid, thisobj, countnumber) {

    $('#temp-class').attr('value', subchildid);
    $('div.node-selected').removeClass('node-selected');
    $(thisobj).addClass('node-selected');


    if (parseInt($('div.node-selected').siblings('ol.subclass-' + subchildid).length) == 0) {
        displayLoader();
        $('#hidden_line_number').remove();
        $.post(domainUrl + 'classes/subClassStructure', {'class_id': node_class_id, 'countnumber': countnumber}, getSubClassResponseStructure, 'html');

    } else {

        if ($.trim($('div.node-selected').siblings('.subclass-' + subchildid).css('display')) == 'none') {
            $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub i:first').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('.subclass-' + subchildid).show();

        } else {
            $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub i:first').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('.subclass-' + subchildid).hide();
        }
    }
}

function getSubClassResponseStructure(data, source) {
    if ($("#fourh-class-div").find('span').hasClass('no-dataAvilable')) {
        $("#fourh-class-div").find('.niceScrollDiv').removeClass('niceScrollDiv');
        $("#fourh-class-div").find('.nice-scroll-box').removeClass('nice-scroll-box')
    }
    manageNiceScroll();

    $('li').removeClass('calculate-position');
    var subchildid = $('#temp-class').attr('value');
    /*if ($('.class-structure-within-subclass').siblings('div.node-selected').siblings('ol').hasClass('subclass-' + subchildid)) {
     $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub i:first').removeClass('fa-angle-down').addClass('fa-angle-up');
     //start adjust width on collapse
     adjustWidthClassStructure('collapse', 'second-class-div')
     //end adjust width on collapse
     $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('.subclass-' + subchildid).remove();

     } else {*/

    //$('div.node-selected').find('span.number_print1').removeClass('number_print1').addClass('number_print');

    $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub i:first').removeClass('fa-angle-up').addClass('fa-angle-down');
    $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').append(data);
    $('.temp-sub-class-' + subchildid).closest('li').find('div.node-selected').parent('li').children('.class-structure-within-subclass').addClass('subclass-' + subchildid);
    //start adjust width on expand
    adjustWidthClassStructure('expand', 'second-class-div');
    //end adjust width on expand

    /*}*/
    setNumberPrint();
    hideLoader();
    //fullSelectionNode();
}
/*END HERE*/

/*
 Created by: Niraj
 On Date : 7th Jan 2016
 Comment : Class width adjustment on collapse and expand
 */
function adjustWidthClassStructure(status, idName) {
    var parentContainerW, parentContainerH, moveScrollLeft, moveScrollTop;
    var parentOL, lastOL, diffParentChild, currentWidth;
    if ($("#fourh-class-div").find('span').hasClass('no-dataAvilable')) {
        $("#fourh-class-div").find('.niceScrollDiv').removeClass('niceScrollDiv');
        $("#fourh-class-div").find('.nice-scroll-box').removeClass('nice-scroll-box')
    }
    if (status === 'collapse') {
        var niceScrollBoxParentWidth = $('.nice-scroll-box').parent().width()
        if ($('.nice-scroll-box').width() > niceScrollBoxParentWidth) {
            parentOL = $('.node-selected').parent().find('ol').width();
            lastOL = $('.node-selected').parent().find('ol:last').not(':empty').width();
            diffParentChild = Math.ceil((parentOL - lastOL) * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
            currentWidth = Math.ceil($('.nice-scroll-box').width() * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
            currentWidth = (currentWidth - diffParentChild > 100) ? (currentWidth - diffParentChild) : 100;
            $('.nice-scroll-box').width(parseInt(currentWidth) + '%');

            //more than one subclasses
            var leftEach = $('#' + idName + ' .node-left').not(':hidden');
            leftEach.each(function () {
                var nodeLeftW = $(this).width();
                var nodeInputW = parseInt($(this).find('.node-input').width() + 27);
                if (nodeInputW >= nodeLeftW) {

                    parentOL = $(this).closest('.sub-class-list').width();
                    lastOL = $(this).closest('.sub-class-list').find('ol:last').not(':empty').width();


                    diffParentChild = Math.ceil((parentOL - lastOL) * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
                    currentWidth = Math.ceil($('.nice-scroll-box').width() * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
                    $('.nice-scroll-box').width(parseInt(currentWidth + diffParentChild) + '%');
                }
            });
        }
    }
    //end of width decrease on collapsed
    else {
        var leftEach = $('.node-selected').parent().find('.node-left:not(":hidden")');

        $.each(leftEach, function (index) {
            var nodeLeftW = $(this).outerWidth(true);
            var nodeInputW = parseInt($(this).find('.node-input').outerWidth(true) + 27);
            if (nodeInputW > nodeLeftW) {
                parentOL = $('.node-selected').parent().find('ol').width();
                lastOL = $('.node-selected').parent().find('ol:last').not(':empty').width();
                diffParentChild = Math.ceil((parentOL - lastOL) * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
                currentWidth = Math.ceil($('.nice-scroll-box').width() * 100 / $('.nice-scroll-box').closest('.niceScrollDiv').width());
                $('.nice-scroll-box').width(parseInt(currentWidth + diffParentChild) + '%');
            }
        });
    }
}

/*
 * Created By: Divya Rajput
 * ON Date: Nov 25, 2015
 * To show subclass structure within Instance
 */
function getInstanceSubClassStructure(node_class_id, subchildid, fieldtype, thisobj, node_y_id, sub_class_label, count, line_count_number)
{
    /*if( $.trim(fieldtype) == 'Clone'){
     event.preventDefault();
     }*/
    $('.tempclass').removeClass('node-selected');
    $(thisobj).addClass('tempclass node-selected');
    var nextAllNumPrint1 = $(thisobj).parent().nextAll().find('.number_print1');

    $('#temp-class-ins-').attr('value', subchildid);

    var hidden_instance_temp_id = jQuery('#hidden_instance_temp_id').val();
    jQuery('#hidden_instance_temp_id').val(parseInt(jQuery('#hidden_instance_temp_id').val()) + 1);

    //$.post(domainUrl+'classes/instanceSubClassStructure',{'temp_instance_id':hidden_instance_temp_id,'class_id':node_class_id,'count_instance':count,'mode':fieldtype,'node_y_id':node_y_id,'sub_class_label':sub_class_label},getInstanceSubClassResponseStructure,'html');

    if (parseInt($('div.node-selected').siblings('ol.subclass-' + subchildid).length) == 0) {
        displayLoader()
        $.post(domainUrl + 'classes/instanceSubClassStructure', {'section_mode': 'yes', 'temp_instance_id': hidden_instance_temp_id, 'class_id': node_class_id, 'line_count_number': line_count_number, 'count_instance': count, 'mode': fieldtype, 'node_y_id': node_y_id, 'sub_class_label': sub_class_label}, getInstanceSubClassResponseStructure, 'html');

    } else {

        if ($.trim($('div.node-selected').siblings('.subclass-' + subchildid).css('display')) == 'none') {
            show_hide(subchildid, 1);
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub .action-move i:first').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').removeClass('inactive').addClass('active');
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').css("pointer-events", "all");

            adjustWidthClassStructure('expand', 'second_instance_div');

            /*var currentNumVal = parseInt($(thisobj).parent().find('.number_print1:first').text());
             var lastNumVal = parseInt($(thisobj).parent().find('.number_print1:last').text());
             var addPropCountDiff =  parseInt(lastNumVal-currentNumVal);

             setNumberPrint('second_instance_div', addPropCountDiff, true, nextAllNumPrint1);*/

        } else {
            show_hide(subchildid, 0);
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub .action-move i:first').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').removeClass('active').addClass('inactive');
            $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').css("pointer-events", "none");

            adjustWidthClassStructure('collapse', 'second_instance_div');
        }
    }
}

function getInstanceSubClassResponseStructure(data, source)
{
    var subchildid = $('#temp-class-ins-').attr('value');
    var parent_id = '';
    var parsedHtml = $.parseHTML(data);
    if ($(parsedHtml).find('span.number_print1').length > 0) {
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').find('div.node-right-sub .action-move i:first').removeClass('fa-angle-up').addClass('fa-angle-down');
    }

    $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').append(data);
    $('#second_instance_div .edtParagraph').css('height', 'auto');
    hideLoader();
    if ($(parsedHtml).find('span.number_print1').length > 0) {
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').removeClass('inactive').addClass('active');
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('span.action-plus').css("pointer-events", "all");
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').children('.ins-subcls').addClass('subclass-' + subchildid);
    }
    addTempInstance();
    //horizontal-nice-scroll-add-starts
    adjustWidthClassStructure('expand', 'second_instance_div');
    //setNumberPrint('second_instance_div');
    //var nextAllNumPrint1 = $('.temp-sub-class-ins-'+subchildid).closest('li').nextAll().find('.number_print1');
    /*var nextAllNumPrint1 = $('.temp-sub-class-ins-'+subchildid).closest('li').find('div.node-selected').parent('li').nextAll().find('.number_print1');
     if(nextAllNumPrint1.length){
     var currentNumVal = parseInt($('.temp-sub-class-ins-'+subchildid).closest('li').find('.number_print1:first').text());
     var lastNumVal = parseInt($('.temp-sub-class-ins-'+subchildid).closest('li').find('.number_print1:last').text());
     var insAddPropCountDiff =  parseInt(lastNumVal-currentNumVal);

     setNumberPrint('second_instance_div', insAddPropCountDiff, true, nextAllNumPrint1, '', 'instanceCase');
     }*/
}


/*
 * Created by Divya
 * ON Date: Nov 25, 2015
 * Purpose: This function is used to show/hide class structure
 */
function show_hide(subchildid, goal)
{
    if (goal)
    {
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').find('.subclass-' + subchildid).show();
    } else
    {
        $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').find('.subclass-' + subchildid).hide();
    }
}

/*
 * Created by Divya
 * Purpose: for cloning
 */
function getInstanceCloneSubClassStructure(node_class_id, subchildid, fieldtype, thisobj, node_y_id, sub_class_label, count, event, number_print)
{
    var clonecount = parseInt($('#clone-counter').val());

    if (clonecount) {
        NProgress.start();
        $('#clone-counter').val('0');
        var linenumber = parseInt($('span.action-plus').parent().parent('div.node-selected').find('span.number_print1').text());

        $('.tempclass').removeClass('node-selected');
        $('#second_instance_div').find('div.node-content').removeClass('node-selected');
        $(thisobj).closest('div.node-content').addClass('tempclass node-selected');

        /*var countnum = 0;
         $(thisobj).closest('div.node-selected').siblings('ol.ins-subcls').each(function(){
         countnum = countnum + $(this).children('li.sub-class-list-new').length;
         });*/

        var countnum = $(thisobj).closest('div.node-selected').siblings('ol.ins-subcls').length;

        event.preventDefault();

        $('#temp-class-ins-').attr('value', subchildid);

        var hidden_instance_temp_id = jQuery('#hidden_instance_temp_id').val();
        jQuery('#hidden_instance_temp_id').val(parseInt(jQuery('#hidden_instance_temp_id').val()) + 1);

        var $this = $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li');
        var linenumber = number_print; //parseInt($this.find('span.number_print1').last().text());

        $.post(domainUrl + 'classes/instanceSubClassStructure', {'resp_number_print': number_print, 'temp_instance_id': hidden_instance_temp_id, 'class_id': node_class_id, 'line_count_number': linenumber, 'count_instance': countnum, 'mode': fieldtype, 'node_y_id': node_y_id, 'sub_class_label': sub_class_label}, getInstanceCloneSubClassResponseStructure, 'html');
    }
    event.stopPropagation();
}

function getInstanceCloneSubClassResponseStructure(data, source)
{
    var subchildid = $('#temp-class-ins-').attr('value');
    var result = parseInt($('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').find('.hidden_number_print').val()) - 1; //$(parsed).find(".number_print1").length;

    var parent_id = '';
    var $this = $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li');

    var before_append_line_number;

    $this.nextAll("li").each(function () {
        var tempParam = [];
        before_append_line_number = parseInt($(this).find('span.number_print1').text());
        var after_append_line_number = before_append_line_number + result;

        $(this).find('.number_print1').each(function (index, el) {
            before_append_line_number = parseInt($(this).text());
            var textdone = parseInt(before_append_line_number) + parseInt(result);
            $(this).text(textdone);
        });

        if ($(this).find('div.node-content:first').hasClass('showhide') || $(this).find('div.node-content:first').hasClass('hideshow'))
        {
        } else
        {
            var param = $(this).find('div.node-content:first').attr('onclick').split(",");
            var param_length = param.length;

            for (i = 0; i < parseInt(param_length) - 1; i++) {
                tempParam[i] = param[parseInt(i)];
            }
            tempParam[parseInt(param_length) - 1] = after_append_line_number + ')';
            $(this).find('div.node-content:first').attr("onclick", tempParam);
        }
    });

    $this.append(data);
    $this.children('.ins-subcls').addClass('subclass-' + subchildid);
    addTempInstance();
    $('#clone-counter').val('1');


    var nextAllNumPrint1 = $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li').nextAll().find('.number_print1');
    var lastNumVal = parseInt($('.temp-sub-class-ins-' + subchildid).closest('li').find('.number_print1:last').text());
    //var lastNumVal = parseInt($('.temp-sub-class-ins-'+subchildid).closest('li').find('div.node-selected').parent('li').find('.number_print1').text());

    if (nextAllNumPrint1.length) {
        setNumberPrint('second_instance_div', 'addProp', true, nextAllNumPrint1, lastNumVal);
    }

    NProgress.done();
}

/*
 * Created by Divya Rajput
 * Copy of Class Bulider
 * On Date: 1 DEC 2015
 */
function sendInstanceJson()
{
    instanceBuilder = [];
    $("li.sub-class-list-new").each(function ()
    {
        var getText = [];
        var getID = $(this).attr("id");
        var node_class_property_id = [];
        var node_class_id = $('.si_node_class_id-' + getID).val();
        var getNodeId = $('.si_node_id-' + getID).val();

        $(".si_node_instance-" + getID).each(function (i) {
            getText[i] = $(this).val();
        });

        $(".si_node_class_property_id-" + getID).each(function (i) {
            node_class_property_id[i] = $(this).val();
        });

        var getParent = $(this).attr("parent");

        if (getParent == undefined)
        {
            getParent = "none";
        }
        instanceBuilder.push({parent: getParent, text: getText, id: getID, temp_node_id: getNodeId, subnodeclasspropertyid: node_class_property_id, subnodeclassid: node_class_id});
    });
}

/*
 * Created by Divya Rajput
 * Purpose: To get and set temp instance id
 */
function addTempInstance(getElement)
{
    var temp_instance_prop_number = parseInt($("#temp-instance-id").val());
    var new_temp_instance_prop_number = temp_instance_prop_number + 1;

    tempInstancePositions(new_temp_instance_prop_number);
}

/*
 * Created by Divya Rajput
 * Purpose: To set id and parent id
 */
function tempInstancePositions(temp_instance_prop_number) {

    var new_temp_instance_prop_number = temp_instance_prop_number;
    var getLI = $("li.sub-class-list-new");

    getLI.each(function () {

        var parent_id = $(this).closest('ol.ins-subcls').closest('li.sub-class-list-new').attr("id");

        if ($(this).attr("parent") !== undefined && $(this).attr("parent") !== '') {
        } else {
            if (parent_id) {
                $(this).attr("parent", parent_id);
            } else {
                $(this).attr("parent", $('#instance_caption').val());
            }
            new_temp_instance_prop_number++;
        }

        if ($(this).attr("id") !== undefined && $.trim($(this).attr("id")) !== '') {

            jQuery(this).find('.si_node_instance, .si_node_class_property_id, .si_node_class_id, .si_node_id').removeClass(
                    function (index, css) {
                        var m = css.match(/(si_node_instance-[0-9]+)|(si_node_class_property_id-[0-9]+)|(si_node_class_id-[0-9]+)|(si_node_id-[0-9]+)/g);
                        return m ? m.join(' ') : m;
                    }
            );

            $(this).find('.si_node_instance').addClass('si_node_instance-' + $(this).attr("id"));
            $(this).find('.si_node_class_property_id').addClass('si_node_class_property_id-' + $(this).attr("id"));
            $(this).find('.si_node_class_id').addClass('si_node_class_id-' + $(this).attr("id"));
            $(this).find('.si_node_id').addClass('si_node_id-' + $(this).attr("id"));

        } else {
            $(this).attr("id", new_temp_instance_prop_number);

            jQuery(this).find('.si_node_instance, .si_node_class_property_id, .si_node_class_id, .si_node_id').removeClass(
                    function (index, css) {
                        var m = css.match(/(si_node_instance-[0-9]+)|(si_node_class_property_id-[0-9]+)|(si_node_class_id-[0-9]+)|(si_node_id-[0-9]+)/g);
                        return m ? m.join(' ') : m;
                    }
            );

            $(this).find('.si_node_instance').addClass('si_node_instance-' + new_temp_instance_prop_number);
            $(this).find('.si_node_class_property_id').addClass('si_node_class_property_id-' + new_temp_instance_prop_number);
            $(this).find('.si_node_class_id').addClass('si_node_class_id-' + new_temp_instance_prop_number);
            $(this).find('.si_node_id').addClass('si_node_id-' + new_temp_instance_prop_number);
        }
    });
    $("#temp-instance-id").attr('value', new_temp_instance_prop_number);
}

/*
 * Created by Divya
 * On Date: 15 DEC 2015
 * To remove subclasses inside classes
 */
function deleteSubClass(node_id, node_class_id, event, nodeclassid)
{
    event.preventDefault();
    event.stopPropagation();

    if ($.trim(node_class_id) !== '') {
        $('#delete-sub-class').val(node_id);
        $('#delete-sub-class-id').val(node_class_id);

        var msg = "There are currently instances associated with this subclass. If you remove this, then the dependant instances will also be deleted. Continue anyway?";

        $('#del_msg_of_sub_class').val(node_id + ' ~ ' + ' ~ subclass');
        $("#delMsgOfSubClass").html(msg);
        $("#deleteSubInsOrSubClassPopup").modal('show');
    } else {
        var tempnodeid = "," + nodeclassid;
        var ids = $('#child_ids_of_class').attr('value').replace(tempnodeid, "");
        $("#child_ids_of_class").attr('value', ids);

        var $currentSelection = $(node_id).closest('.parent-sub-class-list');
        //var countRemoveProp = $currentSelection.find('.node-content').length;

        //var $currentSelection = $('.temp-sub-class-'+child_class_id).closest('li.parent-sub-class-list')
        //var subClassProCount = $currentSelection.find('.node-content').length;
        var prevNumVal = parseInt($currentSelection.find('.number_print1:first').text());
        var nextNumVal = parseInt($currentSelection.next().find('.number_print1:first').text());
        var subClassProCountDiff = parseInt(nextNumVal - prevNumVal);
        var nextAllNumPrint1 = $currentSelection.nextAll().find('.number_print1');
        $(node_id).closest('.parent-sub-class-list').remove();

        //var addSubWrap = $('.add-sub-child-wrap').is(':visible');
        setNumberPrint('', subClassProCountDiff, true, nextAllNumPrint1);

    }
}

$(document).on('click', '.delMsgOfSubClass', function () {

    var tempid = $('#del_msg_of_sub_class').val().split(' ~ ');

    if ($.trim(tempid[2]) === 'instance')
    {
        var instance_node_id = tempid[0];
        var sub_class_id = tempid[1];
        var node_class_id = $('#node_y_class_id').val();
        $.post(domainUrl + 'classes/deleteSubClassInstances', {'sub_class_id': sub_class_id, 'node_class_id': node_class_id, 'instance_node_id': instance_node_id}, responseDeleteInstanceProperty, 'html');
    } else
    {
        var primary_class_id = $('#class_caption').val();
        var child_class_id = $('#delete-sub-class').val();
        var node_class_id = $('#node_y_class_id').val();
        var sub_class_id = $('#delete-sub-class-id').val();

        /*This is used to remove node id for delete class from hidden field*/
        var nodeclassid = tempid[0];
        var tempnodeid = "," + nodeclassid;
        var ids = $('#child_ids_of_class').attr('value').replace(tempnodeid, "");
        $("#child_ids_of_class").attr('value', ids);
        /*End Here*/
        var $currentSelection = $('.temp-sub-class-' + child_class_id).closest('li.parent-sub-class-list')
        //var subClassProCount = $currentSelection.find('.node-content').length;
        var currentNumVal = parseInt($currentSelection.find('.number_print1:first').text());
        var nextNumVal = parseInt($currentSelection.next().find('.number_print1:first').text());
        var subClassProCountDiff = parseInt(nextNumVal - currentNumVal);
        var nextAllNumPrint1 = $currentSelection.nextAll().find('.number_print1');
        $('.temp-sub-class-' + child_class_id).closest('li.parent-sub-class-list').remove();

        //var addSubWrap = $('.add-sub-child-wrap').is(':visible');
        setNumberPrint('', subClassProCountDiff, true, nextAllNumPrint1);

        $.post(domainUrl + 'classes/deleteSubClass', {'sub_class_id': sub_class_id, 'node_class_id': node_class_id, 'node_y_id': primary_class_id, 'node_x_id': child_class_id}, responseDeleteSubClassStructure, 'JSON');
    }

    event.stopPropagation();
});

/*
 * Created By Divya Rajput
 * On Date: Dec 17, 2015
 * to removs instance which status is draft
 */
function removedraftInstances(instancenodeid, subclassid)
{
    var instance_node_id = instancenodeid;
    var sub_class_id = subclassid;
    var node_class_id = $('#node_y_class_id').val();
    $.post(domainUrl + 'classes/deleteSubClassInstances', {'sub_class_id': sub_class_id, 'node_class_id': node_class_id, 'instance_node_id': instance_node_id}, responseDeleteInstanceProperty, 'html');
}

function responseDeleteSubClassStructure(data, source)
{
    if (data.msg == 'delete') {
        //var node_class_id 		= $('#node_y_class_id').val();
        //getClassStructure(node_class_id);
    }
}

/*
 * Created By Divya Rajput
 * On Date: Dec 17, 2015
 * to delete sub instances
 */
function deleteSubInstance(instancenodeid, subclassid, flag)
{
    if (parseInt(flag) === 1) {
        var msg = "If you delete this instance, all associated instances will also be removed. Do you want to delete instance?";

        $('#del_msg_of_sub_class').val(instancenodeid + ' ~ ' + subclassid + ' ~ instance');
        $("#delMsgOfSubClass").html(msg);
        $("#deleteSubInsOrSubClassPopup").modal('show');

        event.stopPropagation();

    } else {
        manageinstanceSubclassNumber(instancenodeid);
    }
}

/*
 * Created By Divya Rajput
 * On Date: Dec 17, 2015
 * on delete classes, set counter instance number
 */
function manageinstanceSubclassNumber(thisobj)
{
    if ($(thisobj).closest('ol.ins-subcls').siblings('ol.ins-subcls').length == 0)
    {
        bootbox.alert("You can't delete this instance.");
        event.stopPropagation();

    } else {
        var counter = 1;
        $(thisobj).closest('ol.ins-subcls').siblings().each(function () {

            if ($(this).find('a.count-class').length > 1)
            {
                $(this).children('li.sub-class-list').each(function () {

                    if ($.trim($(this).find('a.count-class').text()) != '')
                    {
                        $(this).find('a.count-class').text(counter++);
                    }
                });

            } else {
                var clone_class = $.trim($(this).find('span.number_print1.clone').attr('class'));
                if (typeof clone_class != undefined && clone_class != '')
                {
                    var new_clone_class = clone_class.slice(0, -1);
                    $(this).find('span.number_print1.clone').removeClass(clone_class).addClass(new_clone_class + counter);


                    $(this).find('span.number_print1.prop').each(function () {
                        var prop_class = $.trim($(this).attr('class'));
                        var prop_clone_class = prop_class.slice(0, -1);
                        $(this).removeClass(prop_class).addClass(prop_clone_class + counter);
                    });


                    $(this).find('span.number_print1.input').each(function () {
                        var input_class = $.trim($(this).attr('class'));
                        var input_clone_class = input_class.slice(0, -1);
                        $(this).removeClass(input_class).addClass(input_clone_class + counter);
                    });


                    $(this).find('span.number_print1.radio').each(function () {
                        var radio_class = $.trim($(this).attr('class'));
                        var radio_clone_class = radio_class.slice(0, -1);
                        $(this).removeClass(radio_class).addClass(radio_clone_class + counter);
                    });


                    $(this).find('span.number_print1.checkbox').each(function () {
                        var checkbox_class = $.trim($(this).attr('class'));
                        var checkbox_clone_class = checkbox_class.slice(0, -1);
                        $(this).removeClass(checkbox_class).addClass(checkbox_clone_class + counter);
                    });


                    $(this).find('span.number_print1.dropdown').each(function () {
                        var dropdown_class = $.trim($(this).attr('class'));
                        var dropdown_clone_class = dropdown_class.slice(0, -1);
                        $(this).removeClass(dropdown_class).addClass(dropdown_clone_class + counter);
                    });


                    $(this).find('span.number_print1.file').each(function () {
                        var file_class = $.trim($(this).attr('class'));
                        var file_clone_class = file_class.slice(0, -1);
                        $(this).removeClass(file_class).addClass(file_clone_class + counter);
                    });


                    $(this).find('span.number_print1.textarea').each(function () {
                        var textarea_class = $.trim($(this).attr('class'));
                        var textarea_clone_class = textarea_class.slice(0, -1);
                        $(this).removeClass(textarea_class).addClass(textarea_clone_class + counter);
                    });


                    $(this).find('span.number_print1.calendar').each(function () {
                        var calendar_class = $.trim($(this).attr('class'));
                        var calendar_clone_class = calendar_class.slice(0, -1);
                        $(this).removeClass(calendar_class).addClass(calendar_clone_class + counter);
                    });


                    $(this).find('span.number_print1.else').each(function () {
                        var else_class = $.trim($(this).attr('class'));
                        var else_clone_class = else_class.slice(0, -1);
                        $(this).removeClass(else_class).addClass(else_clone_class + counter);
                    });
                }

                if ($.trim($(this).find('a.count-class').text()) != '')
                {
                    $(this).find('a.count-class').text(counter++);
                }
            }
        });

        /*var deleted_number = $(thisobj).closest('ol.ins-subcls').find('span.number_print1').length;*/
        var currentNum = $(thisobj).closest('ol').find('div.node-content:first').find('span.number_print1').text();

        var nextNum = $(thisobj).closest('ol').nextAll("ol.ins-subcls:first").find('div.node-content:first').find('span.number_print1').text();
        if ($.trim(nextNum) == '')
        {
            var prevNum = $(thisobj).closest('ol').prevAll("ol.ins-subcls:first").find('div.node-content:first').find('span.number_print1').text();
            var deleted_number = parseInt(currentNum) - parseInt(prevNum);
        } else {
            var deleted_number = parseInt(nextNum) - parseInt(currentNum);
        }


        if ($.trim($(thisobj).closest('ol.ins-subcls').siblings('div.node-content').find('span.action-plus').attr('onclick')) != "") {
            var param = $(thisobj).closest('ol.ins-subcls').siblings('div.node-content').find('span.action-plus').attr('onclick').split(",");
            var param_length = param.length;
            var tempParam = [];
            var tempcount = parseInt(param[parseInt(param_length) - 1]) - parseInt(deleted_number);

            for (i = 0; i < parseInt(param_length) - 1; i++)
            {
                tempParam[i] = param[parseInt(i)];
            }
            tempParam[parseInt(param_length) - 1] = tempcount + ')';
            $(thisobj).closest('ol.ins-subcls').siblings('div.node-content').find('span.action-plus').attr('onclick', tempParam);
        }


        /*change number value after the selected node*/
        $('.action-plus').each(function () {
            var currentActionInd = $('.act-mov-sub').index($(thisobj).siblings('.act-mov-sub')); /*$('.act-mov-sub').index($('.node-selected .act-mov-sub'));*/
            var lengthAction = $('.act-mov-sub').length;

            for (i = currentActionInd; i < lengthAction; i++) {
                //console.log('index',i);

                if ($('.act-mov-sub').parent().eq(i).find('.action-plus').attr("onclick"))
                {
                    //$('.act-mov-sub').parent().eq(i).find('.action-plus').css({'background': 'orange'});

                    var paramB = $('.act-mov-sub').parent().eq(i).find('.action-plus').attr("onclick").split(",");
                    var param_lengthB = paramB.length;
                    var tempParamB = [];
                    var newdiff = parseInt(paramB[parseInt(param_lengthB) - 1]) - parseInt(deleted_number);
                    for (iB = 0; iB < parseInt(param_lengthB) - 1; iB++) {
                        tempParamB[iB] = paramB[parseInt(iB)];
                    }
                    tempParamB[parseInt(param_lengthB) - 1] = newdiff + ')';
                    $('.act-mov-sub').parent().eq(i).find('.action-plus').attr("onclick", tempParamB);
                }
            }
        });
        /*End Here*/

        $(thisobj).closest('ol.ins-subcls').nextAll('ol.ins-subcls').each(function () {
            $(this).find('span.number_print1').each(function () {
                $(this).html(parseInt($(this).text()) - deleted_number);
            });
        });

        /*Sub Class Structure not for clone part*/
        $('div.node-content').each(function () {
            var currentActionInd = $('.act-mov-sub').index($('.node-selected .act-mov-sub'));
            var lengthAction = $('.act-mov-sub').length;

            for (i = currentActionInd; i < lengthAction; i++) {

                if ($('.act-mov-sub').parent().parent('div.node-content').eq(i).hasClass('showhide') || $(this).eq(i).hasClass('hideshow'))
                {

                } else
                {
                    if ($(this).eq(i).attr("onclick"))
                    {
                        //$('.act-mov-sub').parent().parent('div.node-content').eq(i).css({'background': 'green'});

                        var paramB = $('.act-mov-sub').parent().parent('div.node-content').eq(i).attr("onclick").split(",");
                        var param_lengthB = paramB.length;
                        var tempParamB = [];
                        var newdiff = parseInt(paramB[parseInt(param_lengthB) - 1]) - parseInt(deleted_number);
                        for (iB = 0; iB < parseInt(param_lengthB) - 1; iB++) {
                            tempParamB[iB] = paramB[parseInt(iB)];
                        }
                        tempParamB[parseInt(param_lengthB) - 1] = newdiff + ')';
                        $('.act-mov-sub').parent().parent('div.node-content').eq(i).attr("onclick", tempParamB);

                        $('.act-mov-sub').parent().parent('div.node-content').not(":hidden").find('span.number_print1').each(function () {
                            $(this).html(parseInt($(this).text()) - deleted_number);
                        });
                    }
                }
            }
        });
        /*End Here*/

        /*$(thisobj).closest('ol.ins-subcls').parent('li').nextAll('li').each(function(){

         $(this).not(":hidden").find('span.number_print1').each(function(){
         $(this).html(parseInt($(this).text()) - deleted_number);
         if($(this).find('div.node-content:first').hasClass('showhide') || $(this).find('div.node-content:first').hasClass('hideshow'))
         {
         }
         else
         {
         if($(this).closest('div.node-content:first').attr('onclick')){
         var tempcount 		= $(this).text();
         var param 			= $(this).closest('div.node-content:first').attr('onclick').split(",");
         var param_length 	= param.length;
         var tempParam 		= [];

         for(i=0; i<parseInt(param_length)-1; i++){
         tempParam[i] 	= param[parseInt(i)];
         }
         tempParam[parseInt(param_length)-1] = tempcount+')';
         $(this).closest('div.node-content:first').attr("onclick",tempParam);
         }
         }
         });
         });*/

        var parent_li = $(thisobj).closest('.parent-sub-class-list');
        $(thisobj).closest('ol.ins-subcls').remove();

        /*if(!parent_li.find('ol.ins-subcls').length){
         parent_li.find('.fa-angle-down:first').removeClass('fa-angle-down').addClass('fa-angle-up')
         }*/
    }
}

/*
 * Created By Awdhesh Soni
 * On Date: Dec 18, 2015
 */
function checkValidate()
{
    var flag5 = true;
    var checkflag5 = "";
    var temp5 = true;
    $(".validationCheck").each(function (i, k) {
        var data = $(this).val();
        NProgress.done();
        if (flag5 == true) {

            $(".thirdPaneActive .nodeClass-Y input[name='nodeX[]']").prop('checked', true)
            var curid = $(".thirdPaneActive .nodeClass-Y input[name='nodeX[]']").attr('value');
            var classId = $(".thirdPaneActive .nodeClass-Y input[name='nodeX[]']").attr('id');
            var node_id = $('.node-selected input.hidden-node-x').val();
            var parentid = $('.node-selected input.hidden-node-x').attr('parent');
            $.post(domainUrl + 'classes/instanceNodeStructure', {'parentid': parentid, 'node_id': node_id, 'node_class_id': classId, 'class_node_id': curid}, responseinstanceData, 'json');

            var fn = "";
            fn = $(this).attr('validate-data').split(";");
            var aa5 = [];
            for (i = 0; i < fn.length; i++) {
                aa5.push(fn[i]);
            }
            aa5.toString();
            $(aa5).each(function (i, v) {
                var newStr = v;
                var valdata = data;
                if (valdata == "") {
                    var aaa = newStr.replace("this.value", "");
                } else {
                    var aaa = newStr.replace("this.value", data);
                }
                checkflag5 = eval(aaa);
                if (checkflag5 == false) {
                    temp5 = false;
                }
            });

            if (temp5 == false) {
                flag5 = false;
            } else {
                flag5 = true;
            }
        }
    });
    return flag5;
}

/*
 * Created By Divya Rajput
 * On Date: Dec 23, 2015
 * to show hide subclass structure for class/instance
 */
function showHideSubClassStructure(thisobj) {
    if ($(thisobj).hasClass('showhide')) {	//if open
        $(thisobj).removeClass('showhide').addClass('hideshow');
        $(thisobj).siblings('ol').hide();
        $(thisobj).find('div.node-right-sub').find('a.act-mov-sub i').removeClass('fa-angle-down').addClass('fa-angle-up');

    } else if ($(thisobj).hasClass('hideshow')) { 									//if close
        $(thisobj).removeClass('hideshow').addClass('showhide');
        $(thisobj).siblings('ol').show();
        $(thisobj).find('div.node-right-sub').find('a.act-mov-sub i').removeClass('fa-angle-up').addClass('fa-angle-down');

    } else {
        $(thisobj).addClass('hideshow');
        $(thisobj).siblings('ol').hide();
        $(thisobj).find('div.node-right-sub').find('a.act-mov-sub i').removeClass('fa-angle-down').addClass('fa-angle-up');
    }
    //setNumberPrint('second_instance_div');
}

/*
 * Created By Divya Rajput
 * On Date: Jan 4, 2016
 * to show instance structure for specified class
 */
function instanceView() {
    NProgress.start();
    assocationClick = true;

    $(".classes_top_cl").click();
    $('.panel-default').hide();
    instanceShowHide();

    $(".pui_center_content").html('');
    $(".pui_center_content").hide();
    $('#second-class-div').hide();

    $('.my-profile').removeClass('active');
    $("#tempControler").attr('value', 'classes');
    $("#tempAction").attr('value', 'classStructure');

    $.post(domainUrl + 'classes/index', {}, responseCallActionCompose, 'html');

    var tempControler = 'classes';
    var tempAction = 'classStructure';
    headingName = tempControler;
    $('.left-side-heading').html(ucfirst(headingName));
    $('.manifest-tab').remove();
    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
}

function responseCallActionCompose(data, source) {

    $("#center-screen").hide();
    $("#ControlBar").hide();
    $('#menudashboard').hide();
    $(".pui_center_content").html(data);
    $(".pui_center_content").hide();

    $('.my-profile').removeClass('active');
    $(".NodeY_li").addClass('active');
    $(".All_li").addClass('active');
    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
    $("#main_action_menu").show();
    $("#parti_action_div_id").show();

    $(".list-row").removeClass('current');
    //$("#list-row_"+domain_course_class_id).addClass('current');
    $("#list-row_" + domain_production_class_id).addClass('current');

    $.post(domainUrl + 'classes/classStructure', {'class_id': domain_production_class_id, 'mode': 'Display'}, composeResponseClassStructure, 'html');
}

/*
 * Created By Divya Rajput
 * On Date: Jan 6, 2016
 */
function composeResponseClassStructure(data, source) {
    $("#second-class-div").html(data);
    if (selectedNodeIDNumber != undefined) {
        $("#second-class-div .node-content").removeClass("node-selected");
        $("#second-class-div [data-class =" + selectedNodeIDNumber + "]").find(".node-content").first().addClass("node-selected");
    }

    $("#is_instance").attr('value', 'N');
    $(".ins").remove();
    $.post(domainUrl + 'classes/getClassInstance', {'class_id': domain_production_class_id, 'mode': 'Normal'}, composeResponseGetClassInstance, 'html');
}

function composeResponseGetClassInstance(data, source) {
    responseGetClassInstance(data, source);

    removeString();
    setNumberPrint();

    $('#second-class-div').show();
    $("#first_instance_div").show();
    $('#second_instance_div').show();
    $(".pui_center_content").show();

    /* Right Menu Function */
    var ww = $(window).width();
    var sw = $(".sidebar_wrap").outerWidth();
    var uw = $(".user-action-wrap").outerWidth();
    var tw = (ww - (sw + uw)) / 2;
    $(".set-height.active").outerWidth(tw + "px");
    $('.panel-default').show();
    $('.panel-group').eq(1).find('.panel-default').eq(1).css('display', 'none');
    assocationClick = false;
    var node_instance_id = parseInt($('#hidden-instance_id').val());
    getInstanceStructure(node_instance_id);
    NProgress.done();
    $(".set-height.active .intance-table").width(tw + "px");
}
/*End Here*/

/*
 * Created By Divya Rajput
 * On Date: Jan 6, 2016
 * to show grid structure of specified class's specific instance
 */
function gridView()
{
    NProgress.start();

    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found') {
        $('.association_top_cl').click();
        $('li.AddNewAssociation_li > a').click();
    } else {
        var temp_instance_node_id = $('.table-dashboard tr.list-row-instance-class.current').attr('id');
        temp_instance_node_id = temp_instance_node_id.split('list-row-instance-id_');
        var node_instance_id = temp_instance_node_id[1];

        // temp code to remove, untill instructions
        var course_type = $('#second_instance_div div.nano1').find('ol.sortable li ol.sortable li ol li:nth-child(2) ol li').find('div.node-input span').html();
        if (typeof course_type !== 'undefined')
            course_type = course_type.trim()
        var node_id = $('#second_instance_div div.nano1').find('ol.sortable li div:nth-child(1)').find('div.node-input span').html();
        if (typeof node_id !== 'undefined')
            node_id = node_id.trim()

        $('.course_top_cl').click();
        $('#ControlBar').find('.left-side-heading').html(course_type);
        if ($('.nodeIdCount').length) {
            $('.nodeIdCount').html("( " + node_id + " )");
        } else {
            $('#ControlBar').find('.left-side-heading').after('<span class="nodeIdCount" id="temp_node_span">( ' + node_id + ' )</span>');
        }
        $.post(domainUrl + 'associations/composeClassStructure', {'node_class_id': domain_production_class_id, 'node_instance_id': node_instance_id}, gridInstanceResponse, 'html');
    }
}

/*open grid view from open course class*/

function gridcourseClassView(node_instance_id, node_id, course_type, title)
{
    NProgress.start();

    parObj = {'nodeID': node_instance_id}

    if ($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found') {
        $('.association_top_cl').click();
        $('li.AddNewAssociation_li > a').click();
    } else {

        //var temp_instance_node_id 	= 	$('.table-dashboard tr.list-row-instance-class.current').attr('id');
        //temp_instance_node_id 		=	temp_instance_node_id.split('list-row-instance-id_');
        //var node_instance_id 			=	temp_instance_node_id[1];

        // temp code to remove, untill instructions
        /*var course_type = $('#second_instance_div div.nano1').find('ol.sortable li ol.sortable li ol li:nth-child(2) ol li').find('div.node-input span').html();
         if(typeof course_type !== 'undefined')
         course_type = course_type.trim()
         var node_id = $('#second_instance_div div.nano1').find('ol.sortable li div:nth-child(1)').find('div.node-input span').html();
         if(typeof node_id !== 'undefined')
         node_id = node_id.trim()*/

        $('.course_top_cl').click();
        $('#ControlBar').find('.left-side-heading').html(course_type);
        if ($('.nodeIdCount').length) {
            $('.nodeIdCount').html("( " + node_id + " )");
        } else {

            $('#ControlBar').find('.left-side-heading').after('<span class="nodeIdCount" id="temp_node_span"><span>( ' + node_id + ' )</span><span class="colon">:</span><span class="refCourseTitle"><span class="refCourseTitleEdit"><input type="text" value="" name="productiontitle" class="production_title form-control input-field" placeholder="Undefined"><i class="icon tick"></i></span><span class="refCourseTitleView hide"><label>Undefined</label><i class="icon sm-edit"></i></span></span></span>');
        }
        $('#operationPaneFlyout').animate({right: '-100%'}).removeClass('in');
        $('#hidden-instance_id').attr('value', node_instance_id);
        $.post(domainUrl + 'associations/composeClassStructure', {'node_class_id': domain_production_class_id, 'node_instance_id': node_instance_id}, gridInstanceResponse, 'html');
    }

}

function gridInstanceResponse(d, s)
{
    var node_instance_id = '';
    displayLoader();
    var temp_instance_node_id = $('.table-dashboard tr.list-row-instance-class.current').attr('id');
    if (temp_instance_node_id != '' && typeof temp_instance_node_id != 'undefined') {
        temp_instance_node_id = temp_instance_node_id.split('list-row-instance-id_');
        node_instance_id = temp_instance_node_id[1];

    } else {

        if ($('#hidden-instance_id').val() != undefined && $('#hidden-instance_id').val() !== "NaN") {
            node_instance_id = parseInt($('#hidden-instance_id').val());

        } else {

            node_instance_id = parObj.nodeID;
        }

    }

    $(".grid-div").css("display", "none");
    $('.tab-item:first a').addClass('active');

    var gridId = "tabIndex_" + new Date().getTime().toString();

    selectedGridId = gridId;
    var snippet = '<div class="grid-div center-div association-grid" grid-id ="%gridid%"></div><input type="hidden" id="hidden-instance_id" value="' + node_instance_id + '" /><input type="hidden" id="temp_column_count" value="" /><input type="hidden" id="temp_rows_count" value="" />';
    var snip = snippet.replace('%gridid%', gridId);

    if ($("#center-screen").children('.grid-div').length > 1) {
        $("#center-screen").children('#hidden-instance_id').remove();
        $("#center-screen").children('#temp_column_count').remove();
        $("#center-screen").children('#temp_rows_count').remove();
        $("#center-screen").children('.grid-div').remove();
    }
    $(".pui_center_content").hide();
    $('#hidden-instance_id').remove();
    $('#temp_column_count').remove();
    $('#temp_rows_count').remove();
    $("#center-screen").append(snip);
    $('#ControlBar').show();
    $("#center-screen").show();

    $("[grid-id=" + gridId + "]").html(d);

    var centerWid = $('.center-div').width() / 2;
    var centerHight = $('#center-screen').height();
    $('.right-popup#nodeFlyout').width(centerWid);
    $('.right-popup#nodeFlyout').height(centerHight);
    var cntrWidth = $("#center-screen").width();

    var tdWrapper = $("[grid-id=" + gridId + "]").find('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).closest('table'),
            myCol = $(tdWrapper).index();


    //enablePlusIcon();

    $(this).closest('li').children('ol').find('.custom-node').focus();

    $('tr').each(function () {
        /*set border*/
        setborder();

        $('.row-2').children('.col-3').addClass('transparent');
        $('.row-2').children('.col-5').addClass('transparent');
    });

    $(tableWrapper).find('tr').each(function () {
        var trObj = $(this);
        /*var colFlag = 0;
         $('body').on('mouseover', 'td', function(index, event) {
         $('i.segment').hide();
         $(this).find('i.segment').show();
         colFlag++;

         });

         $('body').on('mouseout', 'td', function(index, event) {
         if ($(this).find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').hasClass('show')) {
         $(this).find('i.segment').show();
         } else {
         $(this).find('i.segment').hide();
         }
         colFlag++;
         });*/

        var selectedTabId = 0;
        $(".entr-center-tab ul li a").each(function (i, v) {
            if ($(this).hasClass('active')) {
                selectedTabId = $(this).parent().attr('tab-index');
            }
        });

        $('.TabNodePerpective').each(function (i, v) {
            if ($(this).hasClass('node-selected')) {
                $(this).attr('tab-data', selectedTabId);
            }
        });

        $('body').on('click', '.col-node-text input', function (event) {
            $(this).parent('.col-node-text').siblings('.segment-count').show();
            event.stopPropagation();
        })
    });

    $(".center-div").scrollTop(0);

    showMenuInViewMode(node_instance_id);
    $('#course-path-number').removeClass('inactive');
    coursePathNumbering();

    setColRowClass();
    setTableWidth();
    runAlgorithmOfAutoNumbering('associations');
    $('#main-screen').hide();



    NProgress.done();
    hideLoader();
    $('.loadder').hide();
}
/*End Here*/
/*End Here*/

/*
 * Created By Divya Rajput
 * On Date: Jan 11, 2016
 * to show grid structure into editable format
 */
function showMenuInViewMode(node_instance_id)
{
    if ($("#center-screen").children('.grid-div').length > 1) {
        $("#center-screen").children('.grid-div').eq(0).remove();
    }
    if (parseInt(node_instance_id) > 0) {
        var status = $.trim($('#ins_status' + node_instance_id).text());
        $('#association_action_menu .user-roles').css('display', 'none');
        $('#process_action_menu .user-roles').css('display', 'none');

        if (status == 'Published') {
            $('#association_action_menu .edit-association').css('display', 'block');
            $('#association_action_menu .edit-association').addClass('inactiveLink');
        } else {
            $('#association_action_menu .edit-association').css('display', 'block');
            $('#association_action_menu .edit-association').removeClass('inactiveLink');
        }
        $('#association_action_menu').css('display', 'block');
        $('#association_action_menu .instance-view').removeClass('inactiveLink').css('display', 'block');
        $('#process_action_menu .instance-view').removeClass('inactiveLink').css('display', 'block');
    }
}

function editAssociationProperty()
{
    $('#association_action_menu .user-roles').css('display', 'block');
    $('#association_action_menu .edit-association').css('display', 'none');
    $('#association_action_menu .instance-view').css('display', 'none');

    enablePlusIcon();

    $('span.editable-field').each(function () {
        var string_val = $(this).text();
        var replace_html_string = '<input type="text" class="custom-node" alt="' + $.trim(string_val) + '" value="' + $.trim(string_val) + '">';
        $(this).replaceWith(replace_html_string);
    });

    $('body').on('mouseover', 'td', function (index, event) {
        $('i.segment').hide();
        $(this).find('i.segment').show();
    });

    $('body').on('mouseout', 'td', function (index, event) {
        if ($(this).find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').hasClass('show')) {
            $(this).find('i.segment').show();
        } else {
            $(this).find('i.segment').hide();
        }
    });

    $("input.custom-node").attr('placeholder', "Undefined");
}

function enablePlusIcon() {

    $(".production_title").removeAttr("readonly");

    var rowFlag = 0;
    $('table').find('tr:first').each(function () {
        var trObj = $(this);
        var colFlag = 0;
        $('body').on('mouseover', 'td', function (index, event) {
            $(this).children('i.add').addClass('show')
            colFlag++;
        });

        $('body').on('mouseout', 'td', function (index, event) {
            if ($(this).find('.add-colums ul.dropdown-menu').hasClass('show')) {
                $(this).children('i.add').addClass('show')
            } else {
                $(this).children('i.add').removeClass('show')
            }

            colFlag++;

        });
        rowFlag++;
    });
}

function disablePlusIcon() {
    var rowFlag = 0;
    $('table').find('tr:first').each(function () {
        var trObj = $(this);
        var colFlag = 0;
        $('body').on('mouseover', 'td', function (index, event) {
            $(this).children('i.add').removeClass('show')
            colFlag++;
        });

        $('body').on('mouseout', 'td', function (index, event) {
            if ($(this).find('.add-colums ul.dropdown-menu').hasClass('show')) {
                $(this).children('i.add').removeClass('show')
            } else {
                $(this).children('i.add').removeClass('show')
            }

            colFlag++;

        });
        rowFlag++;
    });
}
/*End Here*/

/*
 Created by: Niraj
 On Date : 11th Jan 2016
 Comment : nice-scroll-box increase width on add new property and vice versa
 */
function increaseWidthEdit($keycode, $currentSelection) {
    var nodeSelected = $('.node-selected').width();
    var nodeLeft = parseInt($('.node-selected > .node-left').width() + 43);
    var diffParentChild, niceScrollWidth, parentContainerW, parentContainerH, moveScrollLeft, moveScrollTop, parentContainer, childContainer;
    if ($keycode == 13 || $keycode == 9) {
        if (nodeLeft > nodeSelected) {
            niceScrollWidth = $('.nice-scroll-box').width();
            diffParentChild = parseInt($('.node-selected').parents('ol:eq(1)').width() - $('.node-selected').parents('ol:eq(0)').width())
            $('.nice-scroll-box').width(niceScrollWidth + diffParentChild);
            parentContainerW = $('.niceScrollDiv').width();
            parentContainerH = $('.niceScrollDiv').height();
            moveScrollLeft = $('.nice-scroll-box').width() - parentContainerW;
            moveScrollTop = $('.nice-scroll-box').height() - parentContainerH;
            $(".niceScrollDiv").scrollLeft(moveScrollLeft);
            $(".niceScrollDiv").scrollTop(moveScrollTop);
        }
    } else if ($keycode == 8) {
        var niceScrollBoxParentWidth = $('.nice-scroll-box').parent().width()
        niceScrollWidth = $('.nice-scroll-box').width();
        if (niceScrollWidth > niceScrollBoxParentWidth) {
            parentContainer = $currentSelection.closest('ol').width();
            childContainer = $currentSelection.parent().find('ol').not(':empty').last().width();
            diffParentChild = !childContainer ? parseInt($currentSelection.parents('ol:eq(1)').width() - $currentSelection.parents('ol:eq(0)').width()) : (parseInt(parentContainer - childContainer));
            calculatedNiceScrollWidth = (niceScrollWidth - diffParentChild) < niceScrollBoxParentWidth ? niceScrollBoxParentWidth : (niceScrollWidth - diffParentChild);
            $('.nice-scroll-box').width(calculatedNiceScrollWidth);
        }
    }
}
/*end of nice-scroll-box width increase and decrease*/

/* Start Code By Arvind Soni For Instances Class */
function instanceClassNew()
{
    $("#instance_class_name_first").val('');
    $("#instance-class-popup-div").trigger('click');
    $("#instance-class-popup .btn").first().addClass("inactiveLink");
    $("#instance-class-popup").on('shown.bs.modal', function () {
        $(this).find('input[type="text"]').focus();

    });


}

function instanceClassNewAgain()
{
    if ($.trim($("#instance_class_name_first").val()) == "")
    {
        $("#instance_class_name_first").css('border', '1px solid red');
        $("#instance_class_name_first").focus();
        return false;
    } else
    {
        $("#instance_class_name_first").css('border', '');
        NProgress.start();
        var node_y_class_id = $("#node_y_class_id").val();
        $.post(domainUrl + 'classes/instanceClassNew', {'class_id': node_y_class_id, 'class_name': $("#instance_class_name_first").val()}, responseInstanceClassNew, 'HTML');
    }
}

function responseInstanceClassNew(d, s)
{
    $("#second-class-div").html(d);
    addChildProperty1();
    manageRightMenuIcon('add', 'classes');
    NProgress.done();

    if ($("#node-x-li a").html() == "Node Z")
    {
        $("#class_structure_form .class-wrapper").find('li').first().click();
    }
    //$("#sub_nav_38 .All_li a").click();
}

function addChildProperty1(getElement)
{
    var prop_number = $("#prop_number").val();
    var propHtml = '<li id="prop_temp_li_' + prop_number + '" class="numbering" data-class="prop_temp_li_' + prop_number + '"><div class="node-content  clearfix"><span class="number_print"></span><div class="node-left"><div class="node-circle node-white-circle">N</div><div class="node-head node-input"><textarea class="runTab" cols="30" rows="1" class="runTab" id="new_property_' + prop_number + '" name="new_property[]" placeholder=""></textarea></div><input type="hidden" class="hidden-node-x" name="node_x_y[]" nodey-value="'+class_nodez_ids+'" value="'+class_nodez_ids+'" id="class_prop_temp_li_' + prop_number + '"><input type="hidden" class="hidden-node-z" name="node_y_z[]" value="" id="node_y_z' + prop_number + '" ><input type="hidden" class="hidden-node-z-main" name="prop_z_main[]" value="" id="prop_z_main' + prop_number + '" ><input type="hidden" class="hidden-node-y" name="hidden_node_y[]" value="" id="hidden_node_y' + prop_number + '" ><input type="hidden" class="hidden-node-y-instance-property-node-id" name="hidden_node_y_instance_property_node_id[]" value="" id="hidden_node_y_instance_property_node_id' + prop_number + '" ></div><div class="node-right hide"><a class="action-move act-mov-sub-cross" onclick="removeProperty(' + prop_number + ');"><span><i class="icon close-small"></i></span></a><a class="action-move act-mov-sub-cross addclass"><span><i class="icon plus-class"></i></span></a></div></div><ol></ol></li>';
    if (getElement != undefined)
    {
        if (getElement.is("ol"))
        {
            getElement.append(propHtml);
        } else if (getElement != undefined)
        {
            $(propHtml).insertAfter(getElement);
        }
    } else
    {
        $(".property-child").append(propHtml);
    }

    var propLen = $('.tabber li').length;
    if (propLen === 1)
    {
        $(".tabber").closest('.sortable').find('.addplus').append('<span class="number_print"></span>');
        $(".tabber").closest('.sortable').find('.addplus').show();
    }
    var new_prop_number = parseInt(prop_number) + 1;
    $("#prop_number").attr('value', new_prop_number);
    stopLastElementTabing();
    textareaIncreaseHeight();
    tabPositions();
    calculatePlusIcons();
    increaseWidthEdit(13);
    setNumberPrint();
    manageNiceScroll();
    setPaperBckgrnd();

    //In enter pressing unchecked all checkbox
    if ($("#div-node-x").hasClass("active")) {
        $("#third-class-div input[name='nodeX[]']").removeAttr('checked');
    }
}
/* End Code By Arvind Soni For Instances Class */

/*
 *  Created By: Amit Malakar
 *  Date: 3-Feb-16
 *  Function to save Document
 */
function saveDocument(saveType) {
    NProgress.start();
    var dialogue = [];
    var statements = [];
    var dtm = getCurrentDateTime();
    var instance_id = $('#hidden_dialog_document_instance_id').val();

    var instance_node_id = parseInt(globalFolderInstanceID); //Added by Divya Rajput on date 21 April 2016

    if ($.trim(globalTitle) != "" && typeof globalTitle != 'Undefined')
    {
        $("#document_title").val(globalTitle);
        $("#document_title").attr('value', globalTitle);
    }

    if ($.trim($('#document_title').val()) == '') {

        bootbox.prompt('Please enter document title.', function (result) {
            $(".bootbox-input").click(function () {
                $(".bootbox-input").removeClass("alert-text");
                $(".error-msg").remove();
            });

            if (result !== null && result != "") {
                NProgress.start();
                $('#document_title').val(result);
                $('#documents-screen #edt div.edtParagraph').each(function () {//add #documents-screen, by divya rajput
                    statements.push({
                        statement_actorauthor: '',
                        statement_type: '',
                        statement: $(this)[0].outerHTML,
                        statement_timestamp: ''
                    });
                });
                dialogue = {
                    dialogue_template: 'Document',
                    dialogue_title: $('#document_title').val(),
                    dialogue_admin: '',
                    dialogue_timestamp: dtm,
                    "statementData": statements
                };
                $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': saveType, 'instance_id': instance_id, 'title': $('#document_title').val(), 'instancenodeid': instance_node_id}, responseSaveDocument, 'html');

            } else {

                if(result == null){
                    return true;
                }
                else {
                    $(".bootbox-input").addClass("alert-text");
                    if( parseInt($(".bootbox-input").siblings(".error-msg").length) > 0 ){
	        			$(".bootbox-input").siblings(".error-msg").remove();
                    }
                    $(".bootbox-input").after('<span class="error-msg" style="padding:5px">Required Field.</span>');
                    $(".error-msg").show();
                    return false;
                }
            }
        });
        $('.bootbox').addClass('DocModal');
        $('.DocModal .modal-footer button').text('');
        $('.DocModal .modal-footer button.btn-default').text('Cancel');
        $('.DocModal .modal-footer button.btn-primary').text('Save');
        NProgress.done();
    } else {
        $('#documents-screen #edt div.edtParagraph').each(function () { //add #documents-screen, by divya rajput
            statements.push({
                statement_actorauthor: '',
                statement_type: '',
                statement: $(this)[0].outerHTML,
                statement_timestamp: ''
            });
        });
        dialogue = {
            dialogue_template: 'Document',
            dialogue_title: $('#document_title').val(),
            dialogue_admin: '',
            dialogue_timestamp: dtm,
            "statementData": statements
        };
        $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': saveType, 'instance_id': instance_id, 'title': $('#document_title').val(), 'instancenodeid': instance_node_id}, responseSaveDocument, 'html');

    }
}

function responseSaveDocument(data, source) {
    data = JSON.parse(data);



    /*if (data.hasOwnProperty('error')) {
        bootbox.prompt(data.error, function (result) {
            if (result !== null)
                $('#document_title').val(result);


            $('#documents-screen #edt div.edtParagraph').each(function () {
                statements.push({
                    statement_actorauthor: '',
                    statement_type: '',
                    statement: $(this)[0].outerHTML,
                    statement_timestamp: ''
                });
            });
            dialogue = {
                dialogue_template: 'Document',
                dialogue_title: $('#document_title').val(),
                dialogue_admin: '',
                dialogue_timestamp: dtm,
                "statementData": statements
            };
            var instance_id = $('#hidden_dialog_document_instance_id').val();
            $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': 'D', 'instance_id': instance_id, 'title': $('#document_title').val()}, responseSaveDocument, 'html');
        });

        $('.bootbox').addClass('DocModal');
        $('.DocModal .modal-footer button').text('');
        $('.DocModal .modal-footer button.btn-default').text('Cancel');
        $('.DocModal .modal-footer button.btn-primary').text('Save');

    } else {*/

        if ($('#hidden_dialog_document_instance_id').val() == "") {
            $('#DataSaveDocument').html("<span>Document Saved Successfully</span>");
        } else {
            $('#DataSaveDocument').html("<span>Document Updated Successfully</span>");
        }
        $('#hidden_dialog_document_instance_id').val(data.node_instance_id);
        $('#hidden_dialog_document_node_id').val(data.node_id);
        $('#hidden_dialog_type').val(data.templateType);
        $('#hidden_dialog_title').val(data.dialogue_title);

        globalTitle = data.title;
        var checkSta = $("#document_action_menu").find('#save-document-data').attr('onclick');

        if (checkSta == "saveDocument('D');") {

            $("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');
            globalDocumentSaveStatus = 1;
        }
    //}

    NProgress.done();
    $('#DataSaveDocument').fadeIn();
    setTimeout(function () {
        $('#DataSaveDocument').fadeOut();
    }, 3000);
}


function closeDocument() {
    var element = document.getElementById('edt');
    ResizeSensor.detach(element);
    //$(".edt").html('');
    //$(".edt").html('<div class="edtParagraph" data-x="0" data-s=""><br></div>');

    /*
     * Added By: Divya Rajput
     * On Date: 	24th May 2016
     * Purpose: 	To disable visibility of document-file-save-btn on resource page
     */
    $('.ref-hideTollbar').trigger('click');
    /*End Here*/

    if (globalDocumentSaveStatus == 0) {

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
            callback: function (result) {
                if (result) {
                    /*$.post(domainUrl+'documents/folderList',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal'},responseCallAction1,'html');*/

                    /*
                     * Modified By: Divya Rajput
                     * On Date: 24th May 2016
                     * Purpose: Resource is not sorting properly,
                     * On resource click, folder's instance are sorting by ni.sequence
                     * On Resource close click, folder's instance are sorting by nip.node_instance_property_id
                     */
                    $.post(domainUrl + 'documents/folderList', {'order_by': 'sequence', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal'}, responseCallAction1, 'html');
                    /*End Here*/

                    $('#folderList_action_menu').show();
                    $(".NewFolder_li").show();
                    $(".DeleteFolder_li").show();
                    $(".NewDocument_li").hide();
                    $(".OpenDocument_li").hide();

                } else {

                }
            }
        });
    } else {
        NProgress.start();
        /*$.post(domainUrl+'documents/folderList',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal'},responseCallAction1,'html');*/

        /*
         * Modified By: Divya Rajput
         * On Date: 24th May 2016
         * Purpose: Resource is not sorting properly,
         * On resource click, folder's instance are sorting by ni.sequence
         * On Resource close click, folder's instance are sorting by nip.node_instance_property_id
         */
        $.post(domainUrl + 'documents/folderList', {'order_by': 'sequence', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal'}, responseCallAction1, 'html');

        /*End Here*/

        $('#folderList_action_menu').show();
        $(".NewFolder_li").show();
        $(".DeleteFolder_li").show();
        $(".NewDocument_li").hide();
        $(".OpenDocument_li").hide();
    }
}

function getCurrentDateTime() {
    var d = new Date();
    var date = d.getFullYear() + '-' +
            ("00" + (d.getMonth() + 1)).slice(-2) + '-' +
            ("00" + d.getDate()).slice(-2) + ' ' +
            ("00" + d.getHours()).slice(-2) + ':' +
            ("00" + d.getMinutes()).slice(-2) + ':' +
            ("00" + d.getSeconds()).slice(-2);
    return date;
}

function rejectDeleteClass() {
    $('.DeleteClasses_li').removeClass('inactive');
}

function numberPrintDrag(thisObj, startIndex, stopIndex) {
    //console.log('call numberPrintDrag');
    var selectLiRange, currentItem, prevNum, count_prop, newdragElmNum, callfnOn_elm, originalNum, diff, childRenum;
    selectLiRange = (startIndex < stopIndex) ?
            thisObj.children().slice(startIndex, stopIndex + 1) :
            thisObj.children().slice(stopIndex, startIndex + 1);
    selectLiRange.each(function (index, elm) {
        prevNum = ($(this).prev().length) ?
                Number($(this).prev().find('.number_print1:first').text()) :
                $('.number_print').length;
        count_prop = ($(this).prev().length) ?
                Number($(this).prev().find('.self_count_class').val())-1 :
                1;
        newdragElmNum = (prevNum + count_prop);
        console.log('prevNum'+prevNum+'count_prop'+count_prop);
        if ($(this).find('li').length) {//subclass children open
            originalNum = Number($(this).find('.number_print1:first').text());
            diff = newdragElmNum - originalNum;//top-bottom
            $(this).find('li').each(function () {
                currentNum = Number($(this).find('.number_print1:first').text());
                childRenum = currentNum + diff;
                $(this).find('.number_print1:first').text(childRenum);
                callfnOn_elm = $(this).find('.node-content:first').attr('onclick')
                if (callfnOn_elm) {
                    callfnOn_elm = callfnOn_elm.replace(/,\s?[0-9]+\)$/, ', ' + childRenum + ')');
                    $(this).find('.node-content:first').attr('onclick', callfnOn_elm)
                }
            });
        }
        $(this).find('.number_print1:first').text(newdragElmNum);
        //onclick parameter update with new number
        callfnOn_elm = $(this).find('.node-content:first').attr('onclick')
        if (callfnOn_elm) {
            callfnOn_elm = callfnOn_elm.replace(/,\s?[0-9]+\)$/, ', ' + newdragElmNum + ')');
            $(this).find('.node-content:first').attr('onclick', callfnOn_elm)
        }

    });//end of each selectLiRange
    //To change the hidden field values of subclass ids
    var subclass_ids = [''];
    $('input[class*=temp-sub-class-]').each(function (i, v) {
        var subtract_id = $(this).attr('class');
        subtract_id = subtract_id.match(/[0-9]+/)
        subclass_ids.push(subtract_id)

    })
    //subclass_ids.unshift(',')
    $('#child_ids_of_class').val(subclass_ids.join())
}


function loadFolderDialogueDocument(instance_id, instance_node_id, value, foldertype)
{
    NProgress.start();
    /*
     * Added By: Divya Rajput
     * On Date:  26th May 2016
     * Purpose:  Store Document html in localstoage
     * So that when any instance of resource folder is selected, by default selected resource retained when click on close icon of document
     */
    var resourceHtml = $("li#" + parentFolderInstanceID).html();
    localStorage.setItem('resourcedata', resourceHtml);
    /*End Here*/

    $("#tempControler").attr('value', 'documents');
    $("#tempAction").attr('value', 'index');

    $('#menudashboard').children().remove();

    loadDocument(instance_id, instance_node_id, value, foldertype);

    $('#newDocumentFlyout').animate({right: '-100%'}, 300, function () {}).removeClass('in');
    $('#newDocumentFlyout #File').removeClass('in');
    $('.loadder').hide();
    $('#documents-screen').show();
    $("#document_action_menu").show();
    $('#helpNoderAnchor').show();
    $(".NewFolder_li").hide();
    $(".DeleteFolder_li").hide();
    $(".NewDocument_li").hide();
    $(".OpenDocument_li").show();
    $("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');
    $("#document_action_menu").find('#add-document-open').remove();
    caretInsert();
    indexing();

    setColumnsH();


    var hitFile = function () {
        if ($('.edtHeader #sNumbers').is(":checked")) {
            $(".statementNums").addClass("active");
            $(".edtContainer").addClass("statementson");
            outLineNum();
            indexing();
        }
        $('body #documents-screen .open-file1').trigger('click');
        $('body #documents-screen .open-file1').closest('li').removeClass('active');
        $("body #documents-screen .file1").removeClass('active');
        $(".action-file1").hide();
        $(".action-file2").hide();
        $(".loadder").hide();
        /*localStorage.removeItem('loaddocument');*/
    };
    setTimeout(hitFile, 1000);
    enableDisablestatus = 1;// added 1st of july 2016
}

/*
 * Created By: Divya Rajput
 * On Date: 23rd May 2016
 * Purpose: Enable save icon of Folder Dialog Document
 */
function enableResourceSaveIcon() {
    if (parseInt($('#hidden_dialog_document_instance_id').val()) > 0) {
        $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('inactive').addClass('active');
    }
}
/*End Here*/

/*
 * Created By: Divya Rajput
 * On Date: 23rd May 2016
 * Purpose: Disable save icon of Folder Dialog Document
 */
function disableResourceSaveIcon() {
    /*if(globalDocumentSaveStatus == 1 && $.trim($(".edtParagraph").text()).length >= 0){
     var checkSta = $("#document_action_menu").find('#save-document-data').attr('onclick');
     if(checkSta=="saveDocument('D');")
     {
     $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('inactive');
     globalDocumentSaveStatus = 0;
     }
     }
     else if($('#edt div.edtParagraph').html()=="<br>" && globalDocumentSaveStatus==0)
     {
     $("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');
     globalDocumentSaveStatus = 1;
     } else {
     globalDocumentSaveStatus = 1;
     }*/

    var checkSta = $("#document_action_menu").find('#save-document-data').attr('onclick');

    /*
     enableDisablestatus: 0 :: new content.
     enableDisablestatus: 1 :: saved content.
     */
    if (enableDisablestatus == 1 && $.trim($(".edtParagraph").text()).length > 0)
    {
        if (checkSta == "saveDocument('D');")
        {
            $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('inactive');
            //globalDocumentSaveStatus = 0;
        }
    } else if (enableDisablestatus == 1 && $.trim($(".edtParagraph").text()).length == 0)
    {
        if (checkSta == "saveDocument('D');")
        {
            $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('active').addClass('inactive');
            //globalDocumentSaveStatus = 0;
        }
    } else if (enableDisablestatus == 0)
    {
        if (checkSta == "saveDocument('D');")
        {
            $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('inactive').addClass('active');
            //globalDocumentSaveStatus = 0;
        }
    }
}
/*End Here*/


/**
 * Modified By: Divya Rajput
 * On Date: 23rd May 2016
 * To enable resource save icon
 */
$(document).ready(function () {
    $("body").on("click", ".doHyperLink, #saveedtHyperlinkText, #edtformElements a, .edtHeader .doBold, .edtHeader .doItalic, .edtHeader .doUnderline, .edtHeader .doList, .edtHeader .doSplit, .edtHeader .doLeftAlign, .edtHeader .doRightAlign, .edtHeader .doCenter, .edtHeader .doJustify, .edtHeader .doTable, .edtHeader .doFontColor, .edtHeader .doBG, .edtParagraph img, #cropImageEDT, #saveedtformElementsTextProperties, #deleteedtformElementsTextProperties, #saveAllDynFields, .doRemoveBlankStatements", function (event) {
        enableResourceSaveIcon();
    });


    /* Written by divya
     *  for enable/disable right menu icon
     */
    $("body").on("keyup, keydown", ".edt", function (event) {
        disableResourceSaveIcon();
    });
    /*End Here*/


    $("body").on("click", ".edt", function (event) {
        if ($("#sNumbers").is(":checked")) {
            outLineNum();
        }
        columnizer();
        indexing();
    });


    $("body").on("change", ".edtHeader #fontStyle, .edtHeader #fontSize, .edtHeader #sNumbers, .edtHeader #documentMode, #uploadImage", function () {
        enableResourceSaveIcon();
    });

    $('body').off('click','#saveCanvasTable').on('click','#saveCanvasTable ',function(){
    NProgress.start();
    //Canvas Table Width Set
    $("#edtInnerCanvasView table td").each(function(){
        var getWidth = $(this).width();
        $(this).width(getWidth);
        $(this).css("min-width",getWidth+"px");
        });
    //Canvas Table Width Set Ends
    var dialogue = [];
    var statements = [];
    var dtm = getCurrentDateTime();
    var instance_id = $('#hidden_dialog_document_instance_id').val();

    var instance_node_id = parseInt(globalFolderInstanceID); //Added by Divya Rajput on date 21 April 2016

    $("#gtresizer").remove();
    $("#gthorresizer").remove();
    $("#gridLine").remove();

    if ($.trim(globalTitle) != "" && typeof globalTitle != 'Undefined')
    {
        $("#document_title").val(globalTitle);
        $("#document_title").attr('value', globalTitle);
    }

    if ($.trim($('#document_title').val()) == '' && instance_id=="")
    {
        bootbox.prompt('Please enter document title.', function (result) {
            $(".bootbox-input").click(function () {
                $(".bootbox-input").removeClass("alert-text");
                $(".error-msg").remove();
            });

            if (result !== null && result != "") {
                NProgress.start();
                $('#document_title').val(result);
                statements = $('#canvas-screen #edtInnerCanvasView').html();
                dialogue = {
                    dialogue_template: 'Canvas',
                    dialogue_title: $('#document_title').val(),
                    dialogue_admin: '',
                    dialogue_timestamp: dtm,
                    "statementData": statements
                };
                $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': 'P', 'instance_id': instance_id, 'title': $('#document_title').val(), 'instancenodeid': instance_node_id}, responseSaveDocument, 'html');

            } else {

                if(result == null){
                    return true;
                }
                else {
                    $(".bootbox-input").addClass("alert-text");
                    if( parseInt($(".bootbox-input").siblings(".error-msg").length) > 0 ){
                        $(".bootbox-input").siblings(".error-msg").remove();
                    }
                    $(".bootbox-input").after('<span class="error-msg" style="padding:5px">Required Field.</span>');
                    $(".error-msg").show();
                    return false;
                }
            }
        });
        $('.bootbox').addClass('DocModal');
        $('.DocModal .modal-footer button').text('');
        $('.DocModal .modal-footer button.btn-default').text('Cancel');
        $('.DocModal .modal-footer button.btn-primary').text('Save');
        NProgress.done();
    }

    else if (($.trim($('#document_title').val()) != '' || globalTitle!="") && instance_id!="")
    {
        statements = $('#canvas-screen #edtInnerCanvasView').html();
        if(globalTitle==undefined || globalTitle=="")
        {
            globalTitle = $('#hidden_dialog_title').val();
        }
        dialogue = {
            dialogue_template: 'Canvas',
            dialogue_title: globalTitle,
            dialogue_admin: '',
            dialogue_timestamp: dtm,
            "statementData": statements
        };
            $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': 'P', 'instance_id': instance_id, 'title': $('#document_title').val(), 'instancenodeid': instance_node_id}, responseSaveDocument, 'html');
    }
    else {
        statements = $('#canvas-screen #edtInnerCanvasView').html();
        dialogue = {
            dialogue_template: 'Canvas',
            dialogue_title: $.trim($('#document_title').val()),
            dialogue_admin: '',
            dialogue_timestamp: dtm,
            "statementData": statements
        };
            $.post(domainUrl + 'documents/save', {'document': dialogue, 'saveType': 'P', 'instance_id': instance_id, 'title': $('#document_title').val(), 'instancenodeid': instance_node_id}, responseSaveDocument, 'html');
        }
    });

    $("body").off('click','#printCanvasTableMode').on("click", "#printCanvasTableMode", function(){
    var contentHeight   = $('#edtCanvasView').height();
    var contents        = $("#edtCanvasView").html();
    var documentHtml = "<div id='edtCanvasView' class='niceScrollDiv DocInsideHig' style='height:"+contentHeight+"px overflow: hidden; outline: none;'><div id='edtInnerCanvasView' class='screenMode'><div class='innerCanvasContainer'>"+contents+"</div></div></div>";
    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({ "position": "absolute", "top": "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    //Append the external CSS file.
    frameDoc.document.write('<link rel="stylesheet" type="text/css" href="'+domainUrl+'public/css/table-print.css" media="print"/>');

    //Append the DIV contents.
    frameDoc.document.write(documentHtml);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
        $(".dragCanvasContainer").each(function(){
            $(this).css("background-image",$(this).css("background-image"));
        });
    }, 1000);
    });

});
/*End here*/

function getInstanceCloneOfLocation(node_class_id, subchildid, fieldtype, thisobj, node_y_id, sub_class_label, count, event, number_print,location,role_id,role_name)
{
    number_print = $("#edit_hidden_line_number_temp").val();
    var clonecount = parseInt($('#clone-counter').val());

    if (clonecount) {
        NProgress.start();
        $('#clone-counter').val('0');

        $('.tempclass').removeClass('node-selected');
        $('#second_instance_div').find('div.node-content').removeClass('node-selected');
        $(thisobj).closest('div.node-content').addClass('tempclass node-selected');

        var countnum = $(thisobj).closest('div.node-selected').siblings('ol.ins-subcls').length;

        $('#temp-class-ins-').attr('value', subchildid);

        var hidden_instance_temp_id = node_y_id + parseInt(countnum) + 1;
        var $this = $('.temp-sub-class-ins-' + subchildid).closest('li').find('div.node-selected').parent('li');
        var linenumber = number_print;
        $.post(domainUrl + 'classes/instanceSubClassStructure', {'resp_number_print': number_print, 'temp_instance_id': hidden_instance_temp_id, 'class_id': node_class_id, 'line_count_number': linenumber, 'count_instance': countnum, 'mode': fieldtype, 'node_y_id': node_y_id, 'sub_class_label': sub_class_label,'location':location,'role_id':role_id,'role_name':role_name}, getInstanceCloneOfLocationResponseStructure, 'html');
    }
}

function getInstanceCloneOfLocationResponseStructure(data, source)
{
    var subchildid = $('#temp-class-ins-').attr('value');
    var $this = $(".instance-sortable-list").find('li:first');
    $this.append(data);
    $this.children('.ins-subcls').addClass('subclass-' + subchildid);
    addTempInstance();
    $('#clone-counter').val('1');
    NProgress.done();
}
window.puJsFileLoadCounter++;