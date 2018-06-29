var myarray = {};
var allConnectionsArray = [];
var inst;
var inst1;
var theArray = [];
var connectionArr = [];
var goal;
var removeConnection = [];
var clickedCount = 1;
var positionArray = {};
var clickFlag = false;
var globalSubPhase = 0;
var globalSubID;
var globalWorkflowItemSectionID;
var breadCrumbArray = [];
var noBreadCrumbAddition = 0;
var itemPlacedPos;
var itemPlacedWidth;
var workflowTextEditMode = 0;
var workflowUrl = 'workflow/ajaxhandler';
function cloneWindow(instance, elem, divID, noteIcon) {

    var defValue = 280;
    if (itemPlacedPos > itemPlacedWidth) {
        //defValue=304;
        itemPlacedPos = Math.floor(itemPlacedPos / defValue) * defValue;
        itemPlacedPos = itemPlacedPos - 280;
    }
    else {
        itemPlacedPos = Math.floor(itemPlacedPos / defValue) * defValue;
    }


    itemPlacedPos = itemPlacedPos + 10;

    if (globalSubPhase == 0) {
        thiscurrentItem = "workflow-survey-section";
    }
    else {
        thiscurrentItem = globalSubID;
    }
    $('.' + thiscurrentItem + ' .absLine').each(function (i, v) {
        if (theArray.indexOf($(v).position().left) == -1) {
            theArray.push($(v).position().left);
        }
        sourceId = $(v).position().left + 10;
        targetId = $(v).attr("sectionid");
        positionArray[sourceId] = targetId;
    })

    var currentBlockoffset = itemPlacedPos;
    var setAttrID;
    $.each(positionArray, function (key, value) {
        if (key == currentBlockoffset) {
            setAttrID = value;
        }
    });

    if (setAttrID == undefined) {
        setAttrID = "section1";
    }

    positionArray = {};


    var $jspContainer = $("#statemachine-demo");
    var mainDivId = $(elem).attr('id');
    var phaseId = $(elem).attr('phase-id');
    if (divID == null) {
        divid = "fromTemplate_" + new Date().getTime().toString();
    }
    if (typeof noteIcon == "undefined") {
        noteIcon = "add";
    }
    addNoteID = divid.split("_");
    var name = $.trim($("[role-id=" + mainDivId + "][phase-id=" + phaseId + "]").find('span').text());
    if (name.length > 16) {
        var trimName = name.substring(0, 15) + "...";
    }
    else {
        var trimName = name;
    }
    var ro_left = $("[role-id=" + mainDivId + "][phase-id=" + phaseId + "]").find('span').attr('ro-left');
    var ro_top = $("[role-id=" + mainDivId + "][phase-id=" + phaseId + "]").find('span').attr('ro-top');
    $cloneElement = $("<div class='w tp' section-id='" + setAttrID + "' style='left:" + itemPlacedPos + "px'><div class='action-block-title'><span class='roName' data-value='" + name + "'>" + trimName + "</span><span class='close-ab right'>&times;</span></div><div class='ab-actions'><a class='left'><i class='icon workflow workflow-icon'></i></a><a class='show-popup' data-target='#" + noteIcon + "-workflow-note' data-open='" + noteIcon + "-workflow-note' id='note_" + addNoteID[1] + "' onclick='javascript:setModalName(this)'><i class='icon " + noteIcon + "-note'></i></a><a id='addwindowx'><i class='icon add-small'></i></a></div><div class='actioncontainer'></div></div>").attr("id", divid);
    $(elem).append($cloneElement);
    $cloneElement.next().css('top', $cloneElement.height() + 50);
    instance.draggable(divid, {
        containment: 'parent',
        axis: 'x',
        start: function () {

            //removeEmptyConnections();
            if (globalSubPhase == 0) {
                thiscurrentItem = "workflow-survey-section";
            }
            else {
                thiscurrentItem = globalSubID;
            }
            theArray = [];
            $('.' + thiscurrentItem + ' .absLine').each(function (i, v) {
                if (theArray.indexOf($(v).position().left+$(".workflow-editor").scrollLeft()) == -1) {
                    if(i==0){
                    theArray.push($(v).position().left);
                    }
                    else{
                    theArray.push($(v).position().left+$(".workflow-editor").scrollLeft());
                    }
                }
                sourceId = $(v).position().left + 10;
                targetId = $(v).attr("sectionid");
                positionArray[sourceId] = targetId;
            })
        },
        drag: function (event, ui) {

            goal = ui.position.left;
            //console.log(goal);
            var closest = null;
            var currentViewWidth = $(this).parents(".rolesWorkflow").find("#operationId .wf-wrap:last").position().left + $(".workflow-editor").scrollLeft() + 10;

            $.each(theArray, function (i, v) {
                if (currentViewWidth >= v) {
                    if (closest === null || Math.abs(v - goal) < Math.abs(closest - goal)) {
                        closest = v;
                    }
                }
            });
            var newPos = Math.ceil(closest / 280) * 280;
            newPos = newPos + 10;
            if(newPos<0){
                newPos = 9;
            }
            ui.position.left = newPos;
            if (allConnectionsArray.length != 0) {
                $.each(allConnectionsArray, function (i, v) {
                    jsPlumb.detach(v)
                });

            }
        },
        snap: ".absLine",
        stop: function () {
            detAtt();
            var currentBlockId = $(this).attr('id');
            var currentBlockoffset = $('#' + currentBlockId).position().left;
            $.each(positionArray, function (key, value) {
                if (key == currentBlockoffset) {
                    $("#" + currentBlockId).attr("section-id", value);
                }
            });
            positionArray = {};

        }

    });

    instance.makeSource($cloneElement, {
        filter: ".ep", // only supported by jquery
        anchor: ["Continuous", {
                faces: ["right", "right"]
            }],
        connector: ["Flowchart", {
                curviness: 1,
                stub: [20, 60],
                gap: 1,
                cornerRadius: 5,
                alwaysRespectStubs: true,
            }],
        overlays: [
            ["Label", {
                    location: [0.5, 1.5],
                    cssClass: "endpointSourceLabel"
                }]
        ],
        connectorStyle: {
            strokeStyle: "#000",
            lineWidth: 2,
            outlineColor: "transparent",
            outlineWidth: 4
        },
        maxConnections: 10,
        onMaxConnections: function (info, e) {
            alert("Maximum connections (" + info.maxConnections + ") reached");
        }
    });


    instance.bind("connection", function (info) {
        //   info.connection.getOverlay("label").setLabel(info.connection.id);
        //  console.log(info.connection);
        console.log(info)
    });


    instance.makeTarget($cloneElement, {
        anchor: "Continuous",
        dropOptions: {
            hoverClass: "dragHover"
        }
    });
    var getPrevAttrPhase = elem.attr("phase-id");
    var wrapId = $(elem).attr('id');
    $cloneElement.unwrap();
    $cloneElement.wrap("<div class='new operationItem innerOperations' phase-id='" + getPrevAttrPhase + "'></div>");
    maintainAbsLineHeight();
    $cloneElement.parent().attr('id', wrapId);
    var currentblockid = $cloneElement.parent().attr("id");
    $("[role-id=" + currentblockid + "]").height($cloneElement.parent().height() - 8);
    $(elem).remove();
    detAtt();
    $('svg').find('circle').remove();

    addRemovedConnection();
}

function cloneWindowX(instance, elm, isClicked, opt) {
    clickedCount = clickedCount + 1;
    var $orgContainer = $(elm).parent().parent();
    var $jspContainer = $(elm).parent().parent().find(".actioncontainer");
    //console.log("clicked count:",clickedCount);
    divid = "fromTemplate_" + new Date().getTime().toString();


    $cloneElement = $("<div class='w kk' ><i class='icon action'></i><span class='role_value'></span> <span class='close-ab right'>&times;</span><div class='ep1' style=''></div></div>").attr("id", divid);
    $jspContainer.append($cloneElement);
    $jspContainer.find(".w:last").trigger("dblclick");

    //inst.addEndpoint(divid);
    if (clickedCount == 2) {
        //removeEmptyConnections($jspContainer);
    }

    /*
     instance.bind("connection", function (info) {
     //   info.connection.getOverlay("label").setLabel(info.connection.id);
     allConnectionsArray.push(info.connection);
     $(info.connection.source).find('.ep').hide();
     sourceId = info.sourceId;
     targetId = info.targetId;
     myarray[sourceId]=targetId;
     $('svg').find('circle').remove();
     });
     instance.bind("connectionDetached", function (info) {
     //   info.connection.getOverlay("label").setLabel(info.connection.id);

     $(info.connection.source).find('.ep').show();
     allConnectionsArray=[];
     // inst=[];

     console.log(info);
     $('svg').find('circle').remove();
     });
     */

    var h = $orgContainer.parent().css('min-height');
    hgh = h.split('px');
    $orgContainer.parent().css('min-height', parseInt(hgh[0]) + 30 + 'px');
    var currentblockid = $orgContainer.parent().attr("id");
    $("[role-id=" + currentblockid + "]").height($orgContainer.parent().height() - 8);
    $.each(allConnectionsArray, function (i, v) {
        jsPlumb.detach(v)
    })

    newInstance();

    function createConnectionsDelay()
    {
        $.each(myarray, function (key, value) {
            //alert(key + " : " + value);
            var currentPlumbShow = $("#" + key).parents(".rolesWorkflow").css("display");
            if (currentPlumbShow != "none") {
                inst.connect({
                    source: key,
                    target: value,
                    anchors: ["Right", "Right"]
                });
            }
        });
        actionsortable();
    }

    setTimeout(createConnectionsDelay, 100);
    $('svg').find('circle').remove();
    if (clickedCount == 2) {
        addRemovedConnection();
    }



}
function loadWorkFlow(){
    jsPlumb.ready(function () {

        $('body').on("click", ".addwindow", function (e) {
            var thisOffset = $(this).offset();
            itemPlacedPos = e.pageX - thisOffset.left;
            itemPlacedWidth = $(this).width();
            cloneWindow(instance, $(this));
        });

        $('body').on("mouseover mousemove", ".addwindow", function (e) {
            var thisOffset = $(this).offset();
            var itemHoverPlacedPos = e.pageX - thisOffset.left;
            itemHoverPlacedPos = Math.floor(itemHoverPlacedPos / 280) * 280;
            itemHoverPlacedPos = itemHoverPlacedPos + 10;
            $(this).css('background-position', +itemHoverPlacedPos + 'px center');
            //alert(itemPlacedPos);
        });

        $('body').on("mouseout", ".addwindow", function (e) {
            $(this).css('background-position', '-1000px center');
            //alert(itemPlacedPos);
        });


        $('body').on('click', "#addwindowx", function (event, opt) {
            var CurrentRollBlockName = $(this).parent().parent().find('.roName').text();
            var currentBlockId = $(this).parent().parent().attr('id');
            var counter = $("#" + currentBlockId).find('.kk').length;
            if (counter == 5) {
                return false;
            }
            cloneWindowX(instance, $(this), event.isTrigger, opt);
            //for add workflow
            if ($('#add-workflow-note').hasClass('show')) {
                var surveyTitle = $('#add-workflow-note').find('.survey-title').text();
                if (CurrentRollBlockName == surveyTitle) {
                    var count = $("#" + currentBlockId).find('.kk').length;
                    var AddRoCount = $('#add-workflow-note').find('.roles-wrap').length;
                    if (count > AddRoCount) {
                        var newActionId = $("#" + currentBlockId).find('.kk').last().attr('id');
                        var addRo = '<div class="roles-wrap"><div class="detail-fields clearfix"><div class="detail-label"><span>Actions</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Publish [Action Name]</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"> <span>Description</span> </div><div class="detail-value"><div class="relative"><textarea name="location" class="form-control area-field" maxlength="300" data-validetta="required" id="input_location"> </textarea></div></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Role Change</span> </div><div class="detail-value"><div class="relative"><select class="input-txt-field form-control role-change"><option>Survey Administrator</option></select></div>  </div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Transition</span> </div><div class="detail-value"><div class="relative"><select  class="input-txt-field form-control connection-change compactanchor" id="%actionId%"><option>Please Select</option></select></div></div></div></div>';
                        var newAddRo = addRo.replace('%actionId%', newActionId);
                        $('#add-workflow-note').find('.info-wrap').append(newAddRo);
                        $.each(roleArray, function (key, value) {
                            var newOption = $('<option></option>');
                            newOption.attr('value', key).text(value);
                            $("select#" + newActionId).append(newOption);
                        });
                    }
                }
            }
            // //for view workflow
            if ($('#view-workflow-note').hasClass('show')) {
                var surveyTitle = $('#view-workflow-note').find('.survey-title').text()
                if (CurrentRollBlockName == surveyTitle) {
                    var count = $("#" + currentBlockId).find('.kk').length;
                    var AddRoCount = $('#view-workflow-note').find('.roles-wrap').length;
                    if (count > AddRoCount) {
                        var newActionId = $("#" + currentBlockId).find('.kk').last().attr('id');
                        var addRo = '<div class="roles-wrap"><div class="detail-fields clearfix"><div class="detail-label"><span>Actions</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Cancel</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Description</span> </div><div class="detail-value hin-no">test action description </div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Role Change</span> </div><select class="input-txt-field form-control role-change"><option>Survey Administrator</option></select></div><div class="detail-fields clearfix"><div class="detail-label"><span>Transition</span> </div><div class="detail-value vessel-name"><select  class="input-txt-field form-control connection-change compactanchor" id="%actionID%"><option>Please Select</option></select></div></div></div>';
                        var newAddRo = addRo.replace('%actionID%', newActionId);
                        $('#view-workflow-note').find('.info-wrap').append(newAddRo);
                        $.each(roleArray, function (key, value) {
                            var newOption = $('<option></option>');
                            newOption.attr('value', key).text(value);
                            $("select#" + newActionId).append(newOption);
                        });
                    }
                }
            }
        });
        var wfEditor = $('.workflow-editor');

        $('body').on('click', ".add-role", function () {
            createNewRole();

            maintainAbsLineHeight();

            if (globalSubPhase == 0) {
                $('.workflow-survey-section .operation-head').outerWidth($('.workflow-survey-section .workflow-action-block').outerWidth());
            }
            else {
                $('.' + globalSubID + ' .operation-head').outerWidth($('.' + globalSubID + ' .workflow-action-block').outerWidth());
            }

            if ($('.workflow-action-block').width() > $('.workflow-editor').width()) {

                //var divHeight = $('.workflow-action-block').height();
                var divHeight = getAvailableHeight() - $('.wf-hover-area:first').outerHeight();

                $('.workflow-action-block').css("height", divHeight);

                $('.operation-wrap').css("height", divHeight);
                $('.statemachine-demo').css("height", divHeight - 1);

            }
            setRoleChange();
        });
        $('body .workflow-item-section').height(wfEditor.height());

        $('body').on('dblclick', '.kk', function () {
            var getVal = $(this).find(".role_value").text();
            mysubOperationValue = getVal;
            if (mysubOperationValue == "Action") {
                mysubOperationValue = "";
            }
            var editableText = $("<input type='text' style='width:120px' maxlength='20' class='role_input' value='' onfocus='this.value = mysubOperationValue'/>");
            $(this).find('span.role_value').replaceWith(editableText);
            editableText.focus();
        });

        $('body').on('dblclick', '.operation .operation-item', function () {
            if (workflowTextEditMode == 1) {
                return false;
            }
            $(".newDivAppend, .operation-wrap").sortable("disable");
            var getTitle = $(this).find('span.title').text();
            mysubOperationValue = getTitle;
            var editableText = $("<input class='operation_input form-control' maxlength='18' value='' type='text' onfocus='this.value = mysubOperationValue'>");
            $(this).find('span.addOperation').remove();
            $(this).find('span.closeOperation').remove();
            $(this).find('span.title').replaceWith(editableText);
            $(this).parent().find(".propBtn").addClass("hide");
            editableText.focus();
            EditPhase = 1;
            workflowTextEditMode = 1;
        });

        $('body').on('dblclick', '.operation-sub-item span.title', function () {
            if (workflowTextEditMode == 1) {
                return false;
            }
            $(".newDivAppend, .operation-wrap").sortable("disable");
            $(this).parents("li").addClass("relPosition");
            $(this).parent().find(".propBtn").addClass("hide");
            $(this).parents("li").removeClass("relPosition1");
            var getSubTitle = $(this).text();
            mysubOperationValue = getSubTitle;
            var editableSubText = $("<input class='operation_sub_input form-control' maxlength='32' value='' type='text' onfocus='this.value = mysubOperationValue'>");
            $(this).parent().find('.operation-close').remove();
            $(this).parent().find('.icon-move').remove();
            $(this).replaceWith(editableSubText);
            editableSubText.focus();
            EditOperation = 1;
            workflowTextEditMode = 1;
        });


        $("body").on("keypress", ".role_input", function (e) {
            if (e.which === 13) {
                var value = $('.role_input').val();

                if ($(this).val().length == 0) {
                    value = "Action";
                }

                var divHtml = $("<span class='role_value'></span>");
                divHtml.text(value);
                var getPreviousID = $(this).parent().parent().find(".show-popup").attr("id");
                $('.role_input').replaceWith(divHtml);

                if ($('#add-workflow-note').hasClass('show')) {
                    $("#" + getPreviousID).click.apply($("#" + getPreviousID));
                }
                actionsortable();
            }
        });

        $("body").on("blur", ".role_input", function (e) {
            var value = $(this).val();
            if ($(this).val().length == 0) {
                value = "Action";
            }
            var divHtml = $("<span class='role_value'></span>");
            divHtml.text(value);
            var getPreviousID = $(this).parent().parent().find(".show-popup").attr("id");
            $(this).replaceWith(divHtml);

            if ($('#add-workflow-note').hasClass('show')) {
                $("#" + getPreviousID).click.apply($("#" + getPreviousID));
            }


        });


        $('body').on('click', '.saveworkflowarray', function () {
            $(".workflow-submit-btn").trigger("click");
        });

        $('body').on('click', '.cancelworkflowarray', function () {
            $(".workflow-cancel-btn").trigger("click");
            $(".saveworkflowarray").addClass("hide");
            $(".cancelworkflowarray").addClass("hide");
            $(".saveworkflow").removeClass("hide");
            $(".cancelworkflow").removeClass("hide");
        });


        // setup some defaults for jsPlumb.
        var rolesSnippet = '<div class="new" id="%rollBlock%"><div class="w">%name%<button id="addwindowx">df</button><div class="ep" style="display:none;"></div></div></div>'
        var roleOperationSnippet = '<div class="w kk" id="%roleOperation%">%rolename%<div class="ep" style="display: none;"></div></div>'

        var instance = jsPlumb.getInstance({
            Endpoint: ["Dot", {
                    radius: 4
                }],
            ConnectionOverlays: [
                ["Arrow", {
                        location: 1,
                        id: "arrow",
                        length: 14,
                        foldback: 0.2
                    }],
                ["Label", {
                        // label: "Drag this and drop it on another element to make a connection.",
                        id: "label",
                        cssClass: "aLabel"
                    }]
            ],
            overlays: [
                ["Label", {
                        location: [0.5, 1.5],
                        cssClass: "endpointSourceLabel"
                    }]
            ],
            Container: "statemachine-demo"
        });

        jsPlumb.importDefaults({
            filter: ".ep",
            anchor: "Continuous",
            connector: ["Flowchart", {
                    curviness: 1
                }],
            connectorStyle: {
                strokeStyle: "#5c96bc",
                lineWidth: 2,
                outlineColor: "transparent",
                outlineWidth: 4
            },
            connectorPaintStyle: {
                lineWidth: 4,
                strokeStyle: "#61B7CF",
                joinstyle: "round",
                outlineColor: "white",
                outlineWidth: 2

            },
            maxConnections: 10,
            dropOptions: {
                hoverClass: "dragHover"
            },
            ConnectionsDetachable: true,
            ReattachConnections: true
        });
        var windows = jsPlumb.getSelector(".statemachine-demo .w");

        instance.bind("connection", function (info) {
        });

        // suspend drawing and initialise.

        instance.doWhileSuspended(function () {

            instance.makeSource(windows, {
                filter: ".ep", // only supported by jquery
                anchor: ["Continuous", {
                        faces: ["top", "right"]
                    }],
                connector: ["Flowchart", {
                        curviness: 1,
                        stub: [40, 60],
                        gap: 1,
                        cornerRadius: 5,
                        alwaysRespectStubs: true
                    }],
                overlays: [
                    ["Label", {
                            location: [0.5, 1.5],
                            cssClass: "endpointSourceLabel"
                        }]
                ],
                connectorStyle: {
                    strokeStyle: "#000",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
                connectorPaintStyle: {
                    lineWidth: 4,
                    strokeStyle: "#61B7CF",
                    joinstyle: "round",
                    outlineColor: "white",
                    outlineWidth: 2

                },
                maxConnections: 10,
                onMaxConnections: function (info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
            });
            // initialise all '.w' elements as connection targets.
            instance.makeTarget(windows, {
                dropOptions: {
                    hoverClass: "dragHover"
                },
                anchor: "Continuous"
            });
            instance.draggable(windows, {
                containment: 'parent',
                axis: 'x'
            });
            $(".kk").draggable("disable");
        });

    });

    sortable();
    rolesortable();
    dynamicHeightWidth();
}
function sortable() {

    $(".newDivAppend, .operation-wrap").sortable({
        disabled: false,
        items: ".innerOperations",
        axis: "y",
        start: function (event, ui) {
            $(this).data("elPos", ui.item.index());
        },
        cancel: "",
        sort: function () {
            if (allConnectionsArray.length != 0) {
                $.each(allConnectionsArray, function (i, v) {
                    jsPlumb.detach(v)
                });
            }
        },
        stop: function (event, ui) {
            newInstance();
            $.each(myarray, function (key, value) {
                //alert(key + " : " + value);
                var currentPlumbShow = $("#" + key).parents(".rolesWorkflow").css("display");
                if (currentPlumbShow != "none") {
                    inst.connect({
                        source: key,
                        target: value,
                        anchors: ["Right", "Right"]
                    });
                }
            });
            var origPos = $(this).data("elPos");
            jsPlumb.repaintEverything();

            if (globalSubPhase == 0) {
                currentFrame = "workflow-survey-section";
            }
            else {
                currentFrame = globalSubID;
            }

            $(".workflow-sidebar ul:visible li").each(function (index, element) {
                if (!$(this).hasClass("phaseRow")) {
                    var getAttr = $(this).attr("phase-id");
                    var getClosestAttr = $(this).prevAll(".phaseRow:first").attr("phase-id");
                    $(this).removeClass(getAttr);
                    $(this).addClass(getClosestAttr);
                    $(this).attr("phase-id", getClosestAttr);
                    var getMyThisIndex = $(this).index();
                    $("." + currentFrame + " .newDivAppend .operationItem:eq(" + getMyThisIndex + ")").attr("phase-id", getClosestAttr);
                }
            });

        },
        update: function (event, ui) {
            if ((ui.item.hasClass("operation-sub-item") && ui.item.index() == 0) || (!ui.item.hasClass("phaseRow") && ui.item.index() == 0)) {
                $(".newDivAppend, .operation-wrap").sortable("cancel");
            }
            var origPos = $(this).data("elPos");
            //alert($(this).html());
            $(".kumark").not($(this)).each(function (i, e) {
                checkWhich = $(this).html();
                var checkWhich = checkWhich.indexOf("addOperation");

                if (globalSubPhase == 0) {
                    currentFrame = "workflow-survey-section";
                }
                else {
                    currentFrame = globalSubID;
                }


                if (checkWhich == -1) {
                    var myContainer = "." + currentFrame + " .newDivAppend .operationItem";
                }
                else {
                    if (globalSubPhase == 0) {
                        currentFrame = "default-phase";
                    }
                    var myContainer = "#" + currentFrame + " .operation";
                }

                if (ui.item.attr("phase-id") != undefined) {
                    var getID = ui.item.attr("phase-id");
                }
                else {
                    var getID = ui.item.attr("id");
                }

                if (origPos > ui.item.index()) {
                    $(this).children(myContainer + ":eq(" + origPos + ")").insertBefore($(this).children(myContainer + ":eq(" + ui.item.index() + ")"));
                    if (ui.item.hasClass("phaseRow")) {
                        $(".operation-wrap [phase-id=" + getID + "]").insertAfter($(".workflow-sidebar ul:visible .operation" + ":eq(" + ui.item.index() + ")"));
                        $(".newDivAppend [phase-id=" + getID + "]").insertAfter($(".workflow-editor .rolesWorkflow:visible .newDivAppend .operationItem" + ":eq(" + ui.item.index() + ")"));
                    }

                } else {
                    $(this).children(myContainer + ":eq(" + origPos + ")").insertAfter($(this).children(myContainer + ":eq(" + ui.item.index() + ")"));
                    if (ui.item.hasClass("phaseRow")) {
                        if (ui.item.is("div")) {
                            $(".operation-wrap [phase-id=" + getID + "]").not(".phaseRow").insertAfter($(".workflow-sidebar ul:visible .operation" + ":eq(" + ui.item.index() + ")"));
                            $(".newDivAppend [phase-id=" + getID + "]").insertAfter($(".workflow-editor .rolesWorkflow:visible .newDivAppend .operationItem" + ":eq(" + ui.item.index() + ")"));
                        }
                        else {
                            $(".newDivAppend [phase-id=" + getID + "]").not(".phaseRow").insertAfter($(".workflow-editor .rolesWorkflow:visible .newDivAppend .operationItem" + ":eq(" + ui.item.index() + ")"));
                            $(".operation-wrap [phase-id=" + getID + "]").insertAfter($(".workflow-sidebar ul:visible .operation" + ":eq(" + ui.item.index() + ")"));
                        }
                    }
                }
            })
            $(".workflow-nano").trigger("update");
            $('svg').find('circle').remove();
        }
    })
}

function rolesortable() {
    return false;
    $(".workflow-action-col .operation-head").sortable({
        axis: "x",
        start: function (event, ui) {
            $(this).data("elPos", ui.item.index());
        },
        cancel: ".add-role",
        sort: function (event, ui) {
            if (allConnectionsArray.length != 0) {
                $.each(allConnectionsArray, function (i, v) {
                    jsPlumb.detach(v)
                });
            }
        },
        stop: "",
        update: function (event, ui) {
            //console.log (ui.item.css("left"));
            if (globalSubPhase == 0) {
                currentItem = "workflow-survey-section";
            }
            else {
                currentItem = globalSubID;
            }
            $("." + currentItem + " .workflow-action-col .operation-head .wf-wrap").css("margin-left", "20px");
            $("." + currentItem + " .workflow-action-col .operation-head .wf-wrap:first").css("margin-left", "0px");
            //$("."+currentItem+" .workflow-action-col .operation-head .wf-wrap:first .wf-role").css("margin-right","3px");


            $("." + currentItem + " .workflow-action-col .operation-head .wf-wrap").each(function (i, e) {
                var getCurrentSection = $(this).attr("id");
                var setPos = i

                if (setPos == 0) {
                    setPos = 10;
                }
                else {
                    setPos = i * 280;
                    setPos = setPos + 10;
                }

                $("." + currentItem + " [section-id=" + getCurrentSection + "]").css("left", setPos);
                //positionArray[sourceId]=targetId;
            });


            $("." + currentItem + " #operationId .wf-wrap").each(function (i, v) {
                var getSectionID = $(this).attr("id");
                $("." + currentItem + " .absLine:eq(" + i + ")").attr("sectionid", getSectionID);
            });
        },
        stop: function (event, ui) {
            newInstance();
            $.each(myarray, function (key, value) {
                //alert(key + " : " + value);
                var currentPlumbShow = $("#" + key).parents(".rolesWorkflow").css("display");
                if (currentPlumbShow != "none") {
                    inst.connect({
                        source: key,
                        target: value,
                        anchors: ["Right", "Right"]
                    });
                }
            });
            jsPlumb.repaintEverything();
        }
    })
}


function actionsortable() {
    $(".actioncontainer").sortable({
        axis: "y",
        start: function (event, ui) {
        },
        cancel: "",
        sort: function (event, ui) {
            if (allConnectionsArray.length != 0) {
                $.each(allConnectionsArray, function (i, v) {
                    jsPlumb.detach(v)
                });
            }
        },
        stop: "",
        update: function (event, ui) {
        },
        stop: function (event, ui) {
            newInstance();
            $.each(myarray, function (key, value) {
                //alert(key + " : " + value);
                var currentPlumbShow = $("#" + key).parents(".rolesWorkflow").css("display");
                if (currentPlumbShow != "none") {
                    inst.connect({
                        source: key,
                        target: value,
                        anchors: ["Right", "Right"]
                    });
                }
            });
            jsPlumb.repaintEverything();
        }
    })
}


function newInstance() {
    $('svg').find('circle').remove();
    $('.statemachine-demo').find('svg').remove();


    if (globalSubPhase == 0) {
        var getContainerPlumb = "statemachine-demo";
    }
    else {
        getContainerPlumb = $("." + globalSubID + " #statemachine-demo");
    }

    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {
                radius: 4
            }],
        ConnectionOverlays: [
            ["Arrow", {
                    location: 1,
                    id: "arrow",
                    length: 14,
                    foldback: 0.2
                }],
            ["Label", {
                    id: "label",
                    cssClass: "aLabel"
                }]
        ],
        overlays: [
            ["Label", {
                    location: [0.5, 1.5],
                    cssClass: "endpointSourceLabel"
                }]
        ],
        Container: getContainerPlumb
    });

    jsPlumb.importDefaults({
        filter: ".ep",
        anchor: "Continuous",
        connector: ["Flowchart", {
                curviness: 1
            }],
        connectorStyle: {
            strokeStyle: "#5c96bc",
            lineWidth: 2,
            outlineColor: "transparent",
            outlineWidth: 4
        },
        connectorPaintStyle: {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
        maxConnections: 10,
        dropOptions: {
            hoverClass: "dragHover"
        },
        ConnectionsDetachable: true,
        ReattachConnections: true
    });

    var windows = jsPlumb.getSelector(".statemachine-demo .w");

    instance.bind("connection", function (info) {
        $('svg').find('circle').remove();
    });

    // suspend drawing and initialise.
    instance.doWhileSuspended(function () {

        instance.makeSource(windows, {
            filter: ".ep", // only supported by jquery
            anchor: ["Continuous", {
                    faces: ["right", "right"]
                }],
            connector: ["Flowchart", {
                    curviness: 1,
                    stub: [40, 60],
                    gap: 1,
                    cornerRadius: 5,
                    alwaysRespectStubs: true
                }],
            overlays: [
                ["Label", {
                        location: [0.5, 1.5],
                        cssClass: "endpointSourceLabel"
                    }]
            ],
            connectorStyle: {
                strokeStyle: "#000",
                lineWidth: 2,
                outlineColor: "transparent",
                outlineWidth: 4
            },
            connectorPaintStyle: {
                lineWidth: 4,
                strokeStyle: "#61B7CF",
                joinstyle: "round",
                outlineColor: "white",
                outlineWidth: 2

            },
            maxConnections: 10,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });


        // initialise all '.w' elements as connection targets.
        instance.makeTarget(windows, {
            dropOptions: {
                hoverClass: "dragHover"
            },
            anchor: "Continuous"
        });
        inst = instance;

        $('svg').find('circle').remove();

        instance.bind("connection", function (info) {
            //   info.connection.getOverlay("label").setLabel(info.connection.id);
            allConnectionsArray.push(info.connection);
            $(info.connection.source).find('.ep').hide();
            console.log("infosourceId", info.sourceId);
            sourceId = info.sourceId;
            targetId = info.targetId;
            myarray[sourceId] = targetId;
            inst1 = instance;
            $('svg').find('circle').remove();
        });

        instance.bind("connectionDetached", function (info) {
            //   info.connection.getOverlay("label").setLabel(info.connection.id);
            $(info.connection.source).find('.ep').show();
            allConnectionsArray = [];
            $('svg').find('circle').remove();
            // inst=[];
        });
        instance.draggable(windows, {
            containment: 'parent',
            axis: 'x'
        });

        $(".kk").draggable("disable");
    });
    //  console.log('****************************************');

}

var cnt = 2;
function createNewRole(rolename) {
         if (globalSubPhase == 0) {
        var elm = $('.workflow-survey-section .workflow-action-block');
    }
    else {
        var elm = $('.' + globalSubID + ' .workflow-action-block');
    }
    var wd = $(elm).width();
    var btnDivWidth = $(".workflow-editor").find(".workflow-item-section").width();

    if (globalSubPhase == 1) {
        $(elm).width(wd + 280);
        $('.scroll-content').width(wd + 280 + btnDivWidth + 2);
    }
    else {
        $(elm).width(wd + 280);
        $('.scroll-content').width(wd + 280);
    }


    if ($('.workflow-editor').outerWidth() < $('.scroll-content').width()) {
        $('body .hor-scroll').mCustomScrollbar("update");
    }

    if (globalSubPhase == 0) {
        var elm = $('.workflow-survey-section .workflow-action-block');
    }
    else {
        var elm = $('.' + globalSubID + ' .workflow-action-block');
    }
    $('.scroll-content').height($('.workflow-editor').height());
    section = "section_" + new Date().getTime().toString();
    var snip = "<div sectionId ='%section%' class='absLine absLinePos" + cnt + "'></div>"
    var snippet = snip.replace('%section%', section);
    var straightLineHeight = $(elm).height();
    if (globalSubPhase == 0) {
        $('.workflow-survey-section').append(snippet);
    }
    else {
        $('.' + globalSubID).append(snippet);
    }
    var lt = $('.absLinePos' + cnt).position().left;


    if (globalSubPhase == 0) {
        $('.workflow-survey-section .add-role').remove();
    }
    else {
        $('.' + globalSubID + ' .add-role').remove();
    }

    if (typeof rolename != 'undefined')
        var roleName = rolename;
    else {
        var injectSelectHtml = '<select>';

        var roleName = 'Surveyor';
    }
    // var operationHeadSnippet = '<div class="wf-wrap default-admin" id="%section%"><div class="wf-role btn btn-default"><span class="left">'+roleName+'</span><i class="icon small-close right section-close"></i></div><div class="wf-count btn btn-default dropdown"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">1 </span><i class="fa fa-angle-down right"></i></div><ul aria-labelledby="dLabel" role="menu" class="dropdown-menu role-count"><li class=""><a class="roles" href="#">1</a></li> <li class=""><a class="roles" href="#">&#8734;</a></li></ul></div></div><div class="add-role"><i class="icon add"></i></div>'
    var operationHeadSnippet = '<div class="wf-wrap default-admin" id="%section%"><div class="wf-role btn btn-default dropdown"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">' + roleName + '</span><i class="icon small-close right section-close"></i><i class="fa fa-angle-down right wf-arrow"></i></div><ul role="menu" class="dropdown-menu role-count wf-dropdown"><li class=""><a class="roles" href="#">Vessel Administrator</a></li><li class=""><a class="roles" href="#">Survey Administrator</a></li><li class=""><a class="roles" href="#">Organization Administrator</a></li><li class=""><a class="roles" href="#">Vessel Owner</a></li><li class=""><a class="roles" href="#">Vessel Crew</a></li><li class=""><a class="roles" href="#">Vessel Guest</a></li><li class=""><a class="roles" href="#">Observer</a></li><li class=""><a class="roles" href="#">Surveyor</a></li><li class=""><a class="roles" href="#">Sales Representative</a></li></ul></div><div class="wf-count btn btn-default dropdown"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">1 </span><i class="fa fa-angle-down right"></i></div><ul  role="menu" class="dropdown-menu role-count"><li class=""><a class="roles" href="#">1</a></li></ul></div><div class="wf-hover-area"><div class="propBtn show-popup hide" data-target="#add-workflow-note" data-open="add-workflow-note" onclick="javascript:setModalName(this)"></div></div></div><div class="add-role"><i class="icon added"></i></div>'


    var k = operationHeadSnippet.replace('%section%', section);
    if (globalSubPhase == 0) {
        $(".workflow-survey-section .operation-head").append(k);
    }
    else {
        $("." + globalSubID + " .operation-head").append(k);
    }

    if (cnt == 1) {
        $("[sectionId=" + section + "]").css('left', 280 + 'px');
        $("#" + section).css('margin-left', 18 + 'px');
    } else {
        if (globalSubPhase == 0) {
            var line = ((($('.workflow-survey-section .absLine').length) - 1) * 280);
            $("[sectionId=" + section + "]").css('left', line + 'px');
            $("#" + section).css('margin-left', 18 + cnt + 'px');
        }
        else {
            var line = ((($('.' + globalSubID + ' .absLine').length) - 1) * 280);
            line = line + btnDivWidth;
            $("[sectionId=" + section + "]").css('left', line + 'px');
            $("#" + section).css('margin-left', 18 + cnt + 'px');
        }
    }
}

function detAtt() {
    $.each(allConnectionsArray, function (i, v) {
        jsPlumb.detach(v)
    });
    newInstance();
    $.each(myarray, function (key, value) {
        //alert(key + " : " + value);
        var currentPlumbShow = $("#" + key).parents(".rolesWorkflow").css("display");
        if (currentPlumbShow != "none") {
            inst.connect({
                source: key,
                target: value,
                anchors: ["Right", "Right"]
            });
        }
    });
    $('svg').find('circle').remove();
}

function makeconnection(dataarray) {
    // newInstance();
    $.each(dataarray, function (key, value) {
        value = $("#" + value + " " + ".action-block-title");
        inst.connect({
            source: key,
            target: value,
            anchors: ["Right", "Right"]
        });
    });
    $('svg').find('circle').remove();
}

function deleteConnection(connectionId) {
    var conId = $(connectionId).attr('id');
    //var pconId=parseInt(conId);
    delete myarray[connectionId];
    inst.detachAllConnections(connectionId);
    keyIdArray = Object.keys(myarray);

    //myarray.splice(id,1);
    jsPlumb.remove(connectionId);
    detAtt();
}

function removeEmptyConnections(elm) {
    $('.defaultClass').remove();
    if (elm != undefined) {
        var kkELm = elm.find('.kk');
        $('.kk').each(function (i, v) {
            var id = $(v).attr('id');
            console.log("hello", id);
            if (!($(v).attr('id') in myarray) && ($(v).find('span.role_value').text() == "Action"))
            {
                $('body').append('<div class="defaultClass ' + $(v).parent().attr("id") + '"></div>')
                jsPlumb.remove(id);
            }
        });
    }
    else {
        $('.kk').each(function (i, v) {
            var id = $(v).attr('id')
            if (!($(v).attr('id') in myarray) && ($(v).find('span.role_value').text() == "Action"))
            {
                $('body').append('<div class="defaultClass ' + $(v).parent().attr("id") + '"></div>')
                jsPlumb.remove(id);
            }
        });
    }

    $('.tp').each(function (i, v) {
        var height = $(v).height();
        var parentId = $(v).parent().attr('id');
        $("#" + parentId).height(height);
        $("#" + parentId).css("min-height", height + 'px');
        $("[role-id=" + parentId + "]").height($("#" + parentId).height() - 8);
    })

    $('svg').find('circle').remove();

}

function addRemovedConnection(opt) {
//    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    $('.defaultClass').each(function (i, v) {
        var id = $(v).attr('class').split(' ')[1];
        $('#' + id).find('.add-small').trigger("click", opt);
    })
    clickedCount = 1;
    var newFindID;
    if (globalSubPhase == 0) {
        newFindID = ".workflow-survey-section";
    }
    else {
        newFindID = "." + globalSubID;
    }

    $(newFindID + ' .tp').each(function (i, v) {
        var height = $(v).height();
        var parentId = $(v).parent().attr('id');
        $("#" + parentId).height(height);
        $("#" + parentId).css("min-height", height + 'px');
        $("[role-id=" + parentId + "]").height($("#" + parentId).height() - 8);
    });
}

/**
 * setModalName is used to show the modal on basis of icon
 * if view then show the details of the note on the role operation window
 * if add then show the realtive form to add note.
 */
function setModalName(roleOperation) {
    $(".hidden-ViewWorkflow").css({"display": "block", "background-color": "#000000", "opacity": "0.4"});

    roleOperationID = roleOperation.id;

    var roCount = $('#' + roleOperationID).parent().parent().parent().find('.kk').length;
    console.log("roCount", roCount);
    console.log("roleOperationID", roleOperationID);
    noteAction = roleOperation.dataset.open.split("-");
    var opRoleNameSpan = roleOperation.parentNode.parentNode.childNodes[0].childNodes[0];
    var roleOperationName = opRoleNameSpan.textContent;
    //console.log("%c data-open","background:#999;color:red",roleOperation );
    roleOperationID = roleOperationID.split("_");
    var targetTask = '' + noteAction[0] + 'Note';
    $.ajax({
        url: workflowUrl,
        type: 'post',
        data: {
            task: targetTask,
            operationID: roleOperationID[1],
            roleOperationName: roleOperationName
        },
        beforeSend: function () {

            $('.loading-left').show();

            //$("#"+noteAction[0]+"-workflow").html("");
            noteActions = noteAction.join("-");
            if (noteActions == "view-workflow-note") {
                $("#add-workflow-note").removeClass("show");
                $("#add-workflow-note").css("show");
                $("#view-workflow-note").css("right", "0");
            }

        },
        success: function (data) {
            $('.connection-change').empty();
            // $('.role-change').append('<option>abcd</option>')
            noteActions = noteAction.join("-");
            $("#" + noteAction[0] + "-workflow").html(data);
            if (noteActions == "view-workflow-note") {

                $("#add-workflow-note").removeClass("show");
                $("#view-workflow-note").addClass("show");
                $("#view-workflow-note").css("right", "0");
            }


            if ($('#view-workflow-note').hasClass('show')) {
                var AddRoCount = $('#view-workflow-note').find('.roles-wrap').length;
                console.log("AddRoCount", AddRoCount);
                var count = roCount - AddRoCount;
                if (roCount != AddRoCount) {
                    for (i = 1; i <= count; i++) {
                        var addRo = '<div class="roles-wrap"><div class="detail-fields clearfix"><div class="detail-label"><span>Actions</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Cancel</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Description</span> </div><div class="detail-value hin-no">test action description 3</div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Role Change</span> </div><select class="input-txt-field form-control role-change"><option>Survey Administrator</option></select><!-- <div class="detail-value vessel-name">Survey Administrator</div> --></div><div class="detail-fields clearfix"><div class="detail-label"><span>Transition</span> </div><div class="detail-value vessel-name"><select  class="input-txt-field form-control connection-change compactanchor"><option>Please Select</option></select></div></div></div>';
                        $('#view-workflow-note').find('.info-wrap').append(addRo);
                    }

                }
            }
            if ($('#add-workflow-note').hasClass('show')) {
                var AddRoCount = $('#add-workflow-note').find('.roles-wrap').length;
                console.log("AddRoCount", AddRoCount);
                // alert(AddRoCount);
                var count = roCount - AddRoCount;
                var getRoleID = roleOperation.id;
                getRoleID = getRoleID.replace("note", "fromTemplate");
                if (roCount != AddRoCount) {
                    for (i = 1; i <= count; i++) {
                        var newK = i - 1;
                        //alert(newK);
                        var actionRoleID = $("#" + getRoleID + " .kk:eq(" + newK + ")").attr("id");
                        actionRoleID = actionRoleID.replace("fromTemplate", "actionTemplate");

                        for (var x in ActionNote) {
                            if (x == actionRoleID) {
                                var textareaValue = ActionNote[actionRoleID].actionDescription;
                                var roleValue = ActionNote[actionRoleID].roleChange;
                                var connValue = ActionNote[actionRoleID].connChange;
                                var noteValue = ActionNote[actionRoleID].noteDescription;
                            }
                        }

                        if (noteValue != "" || noteValue != undefined) {
                            $("#add-new-note-form #input_location").val(noteValue);
                        }

                        if (textareaValue == undefined) {
                            textareaValue = "";
                        }

                        var addRo = '<div class="roles-wrap chkAction" id="' + actionRoleID + '"><div class="detail-fields clearfix"><div class="detail-label"><span>Actions</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label actionName"><span>Publish [Action Name]</span> </div><div class="detail-value vessel-name"></div></div><div class="detail-fields clearfix"><div class="detail-label"> <span>Description</span> </div><div class="detail-value"><div class="relative"><textarea name="location" class="form-control area-field" maxlength="300" data-validetta="required">' + textareaValue + '</textarea></div></div></div><div class="detail-fields clearfix"><div class="detail-label"><span>Transition</span> </div><div class="detail-value"><div class="relative"><select  class="input-txt-field form-control connection-change compactanchor"><option value="select">Please Select</option></select></div></div></div></div>';

                        var getActionValue = $("#" + getRoleID + " .kk:eq(" + newK + ")").find('.role_value').text();
                        $('#add-workflow-note').find('.info-wrap').append(addRo);
                        $('.chkAction .actionName:eq(' + newK + ')').text(getActionValue);
                        textareaValue = "";
                        //set all roles in rolechange dropdown
                        var t = 1;
                        if (t == 1)
                        {
                            t = 2;
                            var tempMyOpArray = [];
                            $.each(roleArray, function (key, value) {
                                var newOption = $('<option></option>');

                                var getCurrentItemIndex = $("#" + key).parent().prevAll(".phaseRow:first").index();
                                var getItemValue = $(".workflow-sidebar ul:visible li:eq(" + getCurrentItemIndex + ")").text();

                                if (tempMyOpArray.indexOf(getCurrentItemIndex) == -1) {
                                    $('#' + actionRoleID + ' .connection-change').append("<optgroup label='" + getItemValue + "'></optgroup>");
                                    tempMyOpArray.push(getCurrentItemIndex);
                                }

                                if (connValue == key) {
                                    newOption.attr({'value': key, "selected": "selected"}).html(value);
                                }
                                else {
                                    newOption.attr('value', key).html(value);
                                }

                                $('#' + actionRoleID + ' .connection-change optgroup:last').append(newOption);
                            });
                            connValue = "select";
                        }

                        if (globalSubPhase == 0) {
                            var getCurrentScreenRole = $(".workflow-survey-section .wf-role span.left");
                        }
                        else {
                            var getCurrentScreenRole = $("." + globalSubID + " .wf-role span.left");
                        }

                        $('#add-workflow-note .role-change').find("option").remove();
                        getCurrentScreenRole.each(function (i, v) {
                            var gVal = $(this).text();
                            var newRoleOption = $('<option></option>');
                            newRoleOption.attr('value', gVal).text(gVal);
                            $('#add-workflow-note .role-change').append(newRoleOption);
                        });

                           // $('.workflow-flyout-form').height($(window).height()-100);

                            $(".workflow-flyout-form").niceScroll({
                                cursorcolor: "#000",
                                cursorborder: "0",
                                cursorborderradius: '0',
                                cursorwidth: "2px",
                                background: 'rgba(0,0,0,.15)'
                            });

                    }
                }
            }

            $('.loading-left').hide();
        }
    });

}
/**
 * attach note on role operation.
 *
 */
$('body').on('click', '.save-ro-note', function (event, opt) {

    $("#submit-add-new-note").trigger('click');

});

function dynamicHeightWidth() {
    $headerHeight = $("header").outerHeight(true) + $(".control-bar").outerHeight(true);
    var availableHeight = getAvailableHeight();
    console.log(availableHeight);
    //$availHeight = window.innerHeight - $headerHeight;
    var //winWidth = $(window).width(),
            wfMain = $('.workflow-wrapper'),
            wfSidebar = $('.workflow-sidebar'),
            //wfAction = $('.action-strip-js'),

           // actionBarWidth = $('.user-action-wrap').width(),
         //   wfMainWidth = winWidth, //---- 64 for the left bar icon's width
            //wfMainHeight = $availHeight,
            wfColHeadHeight = $('#operationId').outerHeight();
            $('#add-workflow-note').height('.workflow-action-block');
            // $('.workflow-container').height($(window).height());
            $('.workflow-container').height(availableHeight);



    //wfMain.width(wfMainWidth).height($availHeight);
    $('.statemachine-demo').height(availableHeight - wfColHeadHeight);

    if (globalSubPhase == 0) {

       $('.workflow-editor').width(wfMain.width() - wfSidebar.width() - 2 );

    }
    else {
        var getItemActionWidth = $('.workflow-item-section').width() + 2;
        $('.workflow-editor').width(wfMain.width() - wfSidebar.width() - getItemActionWidth - 1);
    }

    $('.workflow-editor').height(availableHeight);
    $('.absLine').css({minHeight: $('#statemachine-demo').height()});


    //var operationwrapHeight = $('.workflow-container').height()-$('.operation-item').outerHeight();
    $('.operation-wrap').height(availableHeight - wfColHeadHeight);
    // $('.workflow-action-block').height($availHeight - wfColHeadHeight);
    $('.workflow-action-block').height(availableHeight - $('.wf-hover-area:first').outerHeight());
    $(".workflow-nano").nanoScroller();
    $(".workflow-nano").on("update", function (event, vals) {
        $('.operation-wrap:visible').css("overflow-y","hidden").scrollTop($(this).find(".nano-content").scrollTop());
    });

    $('.workflow-item-section').height($('.workflow-editor').height());
    // $("#ascrail2002-hr").css('top', '0px');

}

    $('body').on("click", '.show-popup', function (event) {
        $("#add-workflow-note").addClass('show').animate({
            right: '0'
        }, 300);
        $('.mask-black.mask-left').show();
        $(".popup-wrapper").width(500);

    });

    $("body").on("click", '.close-popup', function () {

        var _for = $(this).data("for"); //console.log( _for );
        console.log(_for);
        if (_for == "add-workflow-note") {
            $(".hidden-ViewWorkflow").css("display", "none");
            document.getElementById("add-new-note-form").reset();
            $('.connection-change').trigger("change");
        }
        popupWidth = $("#" + _for).width();
        visiblePopups = $('.popup-wrapper:visible').size();

        $("#" + _for).animate({
            right: -popupWidth
        }, 400, function () {
            $("#" + _for).removeClass("show");
        });
    });

/**
 To maintain the absline height while adding the row, draggable element.

 **/
function maintainAbsLineHeight() {

//$(".absLine").height(eleHeightCount-2* 53);
    //
    $('.absLine').css({minHeight: $('#statemachine-demo').height()});
}
$(window).load(function () {
    //dynamicHeightWidth();
});
$(window).resize(function () {
    //dynamicHeightWidth();
});
