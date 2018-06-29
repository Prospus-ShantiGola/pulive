var globalNewDialog = 0;
var TextEditor = (function () {

    var options = {
        showCharLetter: 400,
        ellipsestextLetter: "...",
        moretextLetter: "Read More",
        lesstexLetter: "Read Less"
    };
    var selectors = {
        chat_list_container: '.single_list_wrap',
    };

    function trimText(text) {

        var cLetter = text.substr(0, options.showCharLetter);
        var hLetter = text.substr(text.length - options.showCharLetter);

        return cLetter + '<span class="moreellipsesletter" data-value="/' + text + '\">' + options.ellipsestextLetter + '&nbsp;</span> \
                            <span class="morecontentletter"><span>' + hLetter + '</span>&nbsp;&nbsp; \
                            <a href="javascript:void(0);" class="morelinkletter">' + options.moretextLetter + '</a></span>';

    }

    function ellipsifyText(single_list_wrap_obj) {

        if (!single_list_wrap_obj.length)
            return true;


        single_list_wrap_obj.each(function () {

            var li = $(this);
            li.addClass('text-processed');
            var chat_text = getWholeText(li);

            if (hasEnoughChars(chat_text)) {

                li.find('.more-txt-span').addClass('hide');
                var modified_chat_text = trimText(chat_text);
                var textWrapper = $('<span />').html(modified_chat_text).addClass('ellipsify');
                li.find('.single_msg_info').append(textWrapper);
            }

        });

        setTimeout(function () {
            single_list_wrap_obj.find('.morelinkletter').off('click').on('click', function () {
                showFullText($(this));
            });
        }, 100);
    }

    function getWholeText(li) {

        var chat_text = '';

        li.find('.EdtChange').each(function () {
            chat_text += $(this).html();
        });

        return chat_text;
    }

    function showFullText(read_more_element) {


        var li = read_more_element.closest('.single_list_wrap');

        var chat_text = getWholeText(li);

        var ellipsifyElement = read_more_element.closest('.ellipsify');
        ellipsifyElement.html(chat_text);

        var readLessElement = $('<a />').attr({
            href: 'javascript:void(0)'
        }).addClass('read-less morelinkletter').text(options.lesstexLetter);

        var spanWrapper = $('<span />').addClass('morecontentletter');
        spanWrapper.append('&nbsp;&nbsp;');
        spanWrapper.append(readLessElement);

        ellipsifyElement.append(spanWrapper);
        readLessElement.on('click', function () {
            showLessText($(this));
        });
    }

    function showLessText(show_less_element) {

        var li = show_less_element.closest('.single_list_wrap');

        var chat_text = getWholeText(li);

        chat_text = trimText(chat_text);

        show_less_element.closest('.ellipsify').html(chat_text);

        setTimeout(function () {
            li.find('.ellipsify').find('.morelinkletter').on('click', function () {
                showFullText($(this));
            });
        }, 100);

    }


    function hasEnoughChars(text) {

        return (text.length > options.showCharLetter);
    }

    return {
        ellipsifyText: ellipsifyText
    };

}());

var inprocess = 0;
var flag = true;
var selectText = '';
var iconArr = [];
var helpArr = [];
var courseArr = [];
var assigncourseArr = [];
var classesIntance = [];
var courseMenu = [];
var PrevFirst = 0;
var PrevLast = 0;
var LastClick = "";
var selectedFolder_arr = [];
var InitalDragFolderId = "";
var ParentPositionId = "";
var folderListId = "";
var IndividualArr = [];
var scrolling = false;
var foldertype = "";
var alreadyAttached = false;


$(document).ready(function () {
    $("body").on("contextmenu", '.react-type-letter', function (e) {
        var windowWidthMenu = $(window).width();
        var userActionWidth = $(".user-action-wrap").outerWidth();
        var getCourseMenuWidth = $(".courseDialogueContextMenubar .dropdown-menu").outerWidth();
        var remainingWindowWidth = windowWidthMenu - (userActionWidth + 120);

        var courseLetterContextVar = $('#courseLetterContextMenu');
        var node_instance_id = $(this).data('listRef');
        var single_msg_info_wrapper = $(this).parent().find('.single_msg_info:first');

        var nodeId = single_msg_info_wrapper.data('containerId')
        var deleteParams = {
            default_params: {
                chat_action_type: 'delete',
                statement_node_id: nodeId
            },
            node_instance_id: nodeId,
            type: 'deleteLetterStatementMsg'
        };
        var editParams = {
            default_params: {
                chat_action_type: 'edit',
                statement_node_id: nodeId
            },
            blank_instance_node_id: nodeId
        };

        courseLetterContextVar.find('.del-chat').data('params', deleteParams);
        courseLetterContextVar.find('.edt-chat').data('params', editParams);

        courseLetterContextVar.css({
            display: "block",
            right: "inherit",
            left: e.pageX,
            top: e.pageY
        });
        var getCoursePosition = courseLetterContextVar.position().left;
        if (getCoursePosition > remainingWindowWidth) {
            courseLetterContextVar.css({
                left: "inherit",
                right: "230px"
            });
        }
        return false;
    });

    // $("body").on("contextmenu", '.react-type-chat', function (e) {
    //     var windowWidthMenu = $(window).width();
    //     var userActionWidth = $(".user-action-wrap").outerWidth();
    //     var getCourseMenuWidth = $(".courseDialogueContextMenubar .dropdown-menu").outerWidth();
    //     var remainingWindowWidth = windowWidthMenu - (userActionWidth + 120);
    //
    //     var courseLetterContextVar = $('#courseLetterContextMenu');
    //
    //     if($(this).data('type') == 'statement') {
    //         courseLetterContextVar.find('li').show();
    //     } else {
    //         courseLetterContextVar.find('li').not('.remove').hide();
    //     }
    //     var node_instance_propertyid = $(this).data('propertyRef');
    //     var parent = $(this).parent();
    //     var deleteParams = {
    //         default_params: {
    //             chat_action_type: 'delete',
    //             statement_node_id: node_instance_propertyid,
    //         },
    //         node_instance_id: node_instance_propertyid,
    //         type: 'deleteLetterStatementMsg'
    //     };
    //     var editParams = {
    //         default_params: {
    //             chat_action_type: 'edit',
    //             statement_node_id: node_instance_propertyid,
    //         },
    //         blank_instance_node_id: node_instance_propertyid
    //     };
    //     courseLetterContextVar.find('.del-chat').data('params', deleteParams);
    //     courseLetterContextVar.find('.edt-chat').data('params', editParams);
    //
    //     courseLetterContextVar.css({
    //         display: "block",
    //         right: "inherit",
    //         left: e.pageX,
    //         top: e.pageY
    //     });
    //     var getCoursePosition = courseLetterContextVar.position().left;
    //     console.log('getCoursePosition',getCoursePosition )
    //     console.log('remainingWindowWidth',remainingWindowWidth )
    //     if (getCoursePosition > remainingWindowWidth) {
    //         courseLetterContextVar.css({
    //             left: "inherit",
    //             right: "230px"
    //         });
    //     }
    //     return false;
    // });




    $("body").off('click', "#openMapFlyout").on('click', "#openMapFlyout", function () {
        var rightPane = $('.canvasRightPane');
        rightPane.show();
        rightPane.animate({right: "61px"}, 600, function () {
            $('.canvasMidPane').addClass('activePane');
            $('#canvas_action_menu').hide();
            $('#map_action_menu').show();
            setTimeout(function () {
                $(".niceScrollDiv").getNiceScroll().remove();
                $(".niceScrollDiv").niceScroll({
                    cursorcolor: "#000",
                    cursorborder: "0",
                    cursorborderradius: '0',
                    cursorwidth: "2px",
                    background: 'rgba(0,0,0,0.15)'
                });
            }, 400);
        });
    });

    $("body").off('click', ".closeMapFlyout").on('click', ".closeMapFlyout", function () {
        var rightPane = $('.canvasRightPane');
        $('.canvasMidPane').removeClass('activePane');
        rightPane.animate({right: "-100%"}, 600, function () {
            $('#canvas_action_menu').show();
            $('#map_action_menu').hide();
            rightPane.hide();
            setTimeout(function () {
                $(".niceScrollDiv").getNiceScroll().remove();
                $(".niceScrollDiv").niceScroll({
                    cursorcolor: "#000",
                    cursorborder: "0",
                    cursorborderradius: '0',
                    cursorwidth: "2px",
                    background: 'rgba(0,0,0,0.15)'
                });
            }, 400);
        });
    });

    $("body").on("click", ".course_edt_box .doFontColor, .course_edt_box .doBG", function () {
        if ($('.courseDialogueDefaultWrap').hasClass('current') || $('.courseboard-table.ActiveRow tr').hasClass('current')) {
            var classType = '.newCourseDefaultSec ';
        } else {
            var classType = '.existingSelectedCourseWrap ';
        }

        $(classType + '.course_edt_box #ColorPlatesSection').css('display', 'block');
        var getDocExistHig = $(classType + '.course_edt_box .edtBody').outerHeight();
        var drpExistHig = $(classType + '.course_edt_box #ColorPlatesSection').outerHeight();
        var getExistTopPos = parseInt($(classType + '.course_edt_box #ColorPlatesSection').css('top'));
        var totalExistHig = getDocExistHig - drpExistHig;
        var setExistTopPos = (getExistTopPos - drpExistHig);

        if (getExistTopPos > totalExistHig) {
            $(classType + ".course_edt_box #ColorPlatesSection").css('top', setExistTopPos);
        }
    });

    $("body").on("click", ".move-icon .doDynamicText", function () {
        if ($('.courseDialogueDefaultWrap').hasClass('current') || $('.courseboard-table.ActiveRow tr').hasClass('current')) {
            var classType = '.newCourseDefaultSec ';
        } else {
            var classType = '.existingSelectedCourseWrap ';
        }

        $(classType + ".course_edt_box #edtformElements").css('display', 'block');
        var getDocExistHig = $(classType + '.course_edt_box .edtBody').outerHeight();
        var drpExistHig = $(classType + '.course_edt_box #edtformElements').outerHeight();
        var getExistTopPos = parseInt($(classType + '.course_edt_box #edtformElements').css('top'));
        var totalExistHig = getDocExistHig - drpExistHig;
        var setExistTopPos = (getExistTopPos - drpExistHig);

        if (getExistTopPos > totalExistHig) {
            $(classType + ".course_edt_box #edtTagElements, .course_edt_box #edtformElements").css('top', setExistTopPos);
        }
    });

    $("body").on("click", ".move-icon .doTagFields", function () {
        if ($('.courseDialogueDefaultWrap').hasClass('current') || $('.courseboard-table.ActiveRow tr').hasClass('current')) {
            var classType = '.newCourseDefaultSec ';
        } else {
            var classType = '.existingSelectedCourseWrap ';
        }
        classType = '';

        $(classType + ".course_edt_box #edtTagElements").css('display', 'block');
        var getDocExistHig = $(classType + '.course_edt_box .edtBody').outerHeight();
        var drpExistHig = $(classType + '.course_edt_box #edtTagElements').outerHeight();
        var getExistTopPos = parseInt($(classType + '.course_edt_box #edtTagElements').css('top'));
        var totalExistHig = getDocExistHig - drpExistHig;
        var setExistTopPos = (getExistTopPos - drpExistHig);

        if (getExistTopPos > totalExistHig) {
            $(classType + ".course_edt_box #edtTagElements").css('top', setExistTopPos);
        }
    });

    $("body").on("dblclick", ".course_edt_box .selectedHyperLink, .course_edt_box .edt .edtParagraph .edtInputText", function () {
        setDropDownPosition();
    });

    $("body").on("click", ".course_edt_box .doHyperLink", function () {
       // setDropDownPosition();
    });



    $('body').on('click', '#do_Toc', function () {
        if ($(this).is(':checked')) {
            if ($(".edtContainer .edtCol1").css("display") == "none") {
                $(".edtContainer .edtCol1").css("display", "block");
                $(".collapsableEDTLevelsContent").css("display", "block");
                $(".edtContainer .edtCol2").addClass("edtCol2Width");
                if ($("#documentMode").val() == "structured") {
                    $(".edt").css("margin-left", "80px");
                    $(".edtColumns").css("padding-left", "79px");
                }
                else {
                    $(".edt").css("margin-left", "40px");
                    $(".edtColumns").css("padding-left", "39px");
                }

                runTOC();
                indexing();
            }
        }
        else {
            $(".edtContainer .edtCol1").css("display", "none");
            $(".edtContainer .edtCol2").removeClass("edtCol2Width");
            $(".collapsableEDTLevelsContent").css("display", "none");
            if ($("#documentMode").val() == "structured") {
                $(".edt").css("margin-left", "40px");
                $(".edtColumns").css("padding-left", "39px");
            }
            else {
                $(".edt").css("margin-left", "0px");
            }
        }
    });


    $('body').on('click', '#do_toggle_tags', function () {

        if ($(this).is(':checked')) {
            tagStatus = "visible";
        }
        else {
            tagStatus = "hidden";
        }
        highlightText(tagStatus);
    });


    /*==========On click of enter save data start here======================*/

    $('body').on('keypress', 'input[data-value]', function (e) {
        var getValue = $(this).data('value');
        if (e.which == 13) {
            $('.' + getValue).trigger('click');
        }
    });
    // code for open VIEW Class Instances  modal
    /*$('body').on('click','#getClassInstance', function(e){
     $('#viewClassInstance').modal('show');
     $('#viewClassInstance').on('shown.bs.modal', function () {
     $('#viewClassInstance textarea').focus()
     })
     if($('#viewClassInstance textarea').val().length>0){
     $("#viewClassInstance .btn").first().removeClass("inactiveLink");
     }
     else{
     $("#viewClassInstance .btn").first().addClass("inactiveLink");
     }
     });*/
    $('body').on('keyup', '#viewClassInstance textarea', function (event) {
        var getValue = $(this).data('value');
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($(this).val().length > 0) {
            if ($keycode === 13 && !event.shiftKey) {
                $('.' + getValue).trigger('click');
            }
            $("#viewClassInstance .btn").first().removeClass("inactiveLink");
        }
        else {
            $("#viewClassInstance .btn").first().addClass("inactiveLink");
        }

    });

    //save chat message on enter(courseBoard)
    $('body').on('keypress', '.course_edt_box .chat-msg:visible', function (event) {

        $(".course_edt_box .chat-msg:visible").removeClass("alert-text");
        $(".course_edt_box .chat-textarea").siblings(".error-msg").addClass("hide");

        if (event.which === 32 && this.value === '') {

            $(".course_edt_box .chat-msg:visible").addClass("alert-text");
            $(".course_edt_box .chat-textarea").siblings(".error-msg").remove();
            $(".course_edt_box .chat-textarea").after('<span class="error-msg">! Required Field.</span>');
            return false;

        }

        var $keycode = (event.keyCode ? event.keyCode : event.which);

        if ($keycode === 13 && !event.shiftKey) {
            if ($('.chat-statement-checkbox').is(":checked"))
            {
                if ($.trim($(".course_edt_box .chat-msg:visible").val()) != "")
                {
                    $("#course-dialogue-publish").trigger('click');
                    $(this).val('');
                }
                else
                {

                    $(".course_edt_box .chat-msg:visible").val('');
                    $(".course_edt_box .chat-msg:visible").addClass("alert-text");
                    ErrorModule.appendErrorAfter($(".course_edt_box .chat-textarea"));
                    return false;

                }
                event.preventDefault();

            }
        }

    });


    // required-field-validation
    $('body').on('keydown', '.letter-edt-wrapper', function (e) {
        $("#course-dialogue-draft").show();
        var letterPara = $(".letter-edt-wrapper .edtParagraph").text();
        if (e.which === 32 && letterPara === '') {
            ErrorModule.appendErrorAfter($(".letter-edt-wrapper").next(), {error_class: 'letter-error-msg'});
            return false;
        }
    });

    // course-dialogue-active-starts
    // Below code commented because it is being done in REACT JS
    // $("body").on("click", ".courseDialogueDefaultWrap .toggleCourseWrapper", function (e) {
    //     e.preventDefault();
    //
    //     if ($(this).prev($(".newDefaultCourseListActor.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").hasClass("fa-angle-down"))) {
    //         $(".newDefaultCourseListActor.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").removeClass("fa-angle-down").addClass("fa-angle-up");
    //     }
    //
    //     if (!$(this).siblings().is('.expandedCourseBox')) {
    //         toggleSpinner($(this).next());
    //         var course_instance_id = $(this).parent().attr('course-instance-id');
    //         $.post(domainUrl + 'menudashboard/dialogueList', {'course_instance_id': course_instance_id, 'user_instance_node_id': setUserID}, responseDialogueListCallAction, 'JSON');
    //     }
    //     if ($(this).siblings().is('.expandedCourseBox'))
    //     {
    //         $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
    //         $(this).find('i.fa').removeClass('collapse-down fa-angle-down').addClass('collapse-up fa-angle-up');
    //
    //     }
    //     else
    //     {
    //         $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
    //         $(this).siblings('.collapsedCourseBox').addClass('expandedCourseBox');
    //         // remove-hover-effect-on-parent
    //         $('.expandedCourseBox ul li').on({
    //             mouseover: function () {
    //                 $(this).closest(".newDefaultCourseList").addClass("noHover");
    //
    //             },
    //             mouseout: function () {
    //                 $(this).closest(".newDefaultCourseList").removeClass("noHover");
    //             }
    //         });
    //     }
    //     $("#course-title-defalut-value").focus();
    //
    //     e.stopPropagation();
    // });
    // course-dialogue-active-ends

    // course-resource-active-starts
    $("body").on("click",".newDefaultCourseListResources  .toggleCourseWrapper", function(e) {
        e.preventDefault();

        if($(this).prev($(".newDefaultCourseListActor.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").hasClass("fa-angle-down"))){
            $(".newDefaultCourseListActor.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").removeClass("fa-angle-down").addClass("fa-angle-up");
        }

        if( !$(this).siblings().is('.expandedCourseBox') ) {
            var course_instance_id = $(this).parent().attr('course-instance-id');
            $.post(domainUrl+'menudashboard/dialogueResourceList',{'course_instance_id':course_instance_id,'user_instance_node_id':setUserID},responseDialogueResourceListCallAction,'JSON');
        }
        if( $(this).siblings().is('.expandedCourseBox') )
        {
            $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
            $(this).find('i.fa').removeClass('collapse-down fa-angle-down').addClass('collapse-up fa-angle-up');

        }
        else
        {
            $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
            $(this).siblings('.collapsedCourseBox').addClass('expandedCourseBox');
            // remove-hover-effect-on-parent
            $('.expandedCourseBox ul li').on({
                mouseover: function () {
                    $(this).closest(".newDefaultCourseList").addClass("noHover");

                },
                mouseout: function () {
                    $(this).closest(".newDefaultCourseList").removeClass("noHover");
                }
            });
        }
        $("#course-title-defalut-value").focus();

        e.stopPropagation();
    });
    // course-resource-active-ends

    // course-actor-active-starts

//     $("body").on("click", ".newDefaultCourseListActor .toggleCourseWrapper", function (e) {
//         e.preventDefault();
//
//
//         if ($(this).next($(".courseDialogueDefaultWrap.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").hasClass("fa-angle-down"))) {
//             $(".courseDialogueDefaultWrap.newDefaultCourseList .toggleCourseWrapper .toggle-courses i").removeClass("fa-angle-down").addClass("fa-angle-up");
//         }
//         if (!$(this).siblings().is('.expandedCourseBox')) {
//             //Commented below lines because user-list is fetched from REACT
//             // toggleSpinner($(this).next());
//             // var course_instance_node_id = $(this).parent().attr('course-instance-node-id');
//             // $.post(domainUrl+'menudashboard/dialogueActorList',{'course_instance_node_id':course_instance_node_id},responseDialogueActorListCallAction,'JSON');
//         }
//         if ($(this).siblings().is('.expandedCourseBox'))
//         {
// //            $('.newDefaultCourseList .toggleCourseWrapper .collapse-down').addClass('collapse-up');
// //            $(this).find('.collapse-up').removeClass('collapse-up fa-angle-down').addClass('collapse-up fa-angle-up');
// //            $(this).siblings('.collapsedCourseBox').slideUp().removeClass('expandedCourseBox');
//             $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
//             $(this).find('i.fa').removeClass('collapse-down fa-angle-down').addClass('collapse-up fa-angle-up');
//         }
//         else
//         {
//             //Commented below lines because user-list toggle id done from REACT
//             // $('.newDefaultCourseList .toggleCourseWrapper .collapse-down').addClass('collapse-up');
//             // $('.newDefaultCourseList .toggleCourseWrapper').siblings('.expandedCourseBox').slideUp().removeClass('expandedCourseBox');
//             // $(this).find('.collapse-up').removeClass('collapse-up fa-angle-up').addClass('collapse-down fa-angle-down');
//             // $(this).siblings('.collapsedCourseBox').slideDown().addClass('expandedCourseBox');
//             //
//             // // remove-hover-effect-on-parent
//             // $('.expandedCourseBox ul li').on({
//             //     mouseover: function () {
//             //         $(this).closest(".newDefaultCourseList").addClass("noHover");
//             //
//             //     },
//             //     mouseout: function () {
//             //         $(this).closest(".newDefaultCourseList").removeClass("noHover");
//             //     }
//             // });
//         }
//
//         $("#course-title-defalut-value").focus();
//         e.stopPropagation();
//     });

    // course-dialogue-active-ends



    /*======================================End here======================*/
    filterDropDown();
    leftpaneflyout();


    $(".nano").nanoScroller();

    $("#course-title-defalut-value").focus();
    $("#course-title-value").focus();
    $('body').mousedown(function (e) {
        if (e.button == 1)
            return false;
    });
    $('.showTootip').tooltip();
    dialogueView();
    if ($(window).width() <= 1024 && $(window).height() <= 768) {
        $('body').addClass('fixedDialogueWindow');
    } else {
        $('body').removeClass('fixedDialogueWindow');
    }

    $("body").on('click', '.openDialogueSec', function (event) {
        $('#courseViewWrap').addClass('hide');
        $('#courseDetailWrap').removeClass('hide');
        $('#courseDetailWrap .dialogueViewWrap:first').trigger('click');
    });

    // >>> AMIT MALAKAR
    $('#printContextMenubar').on('click', function () {
        var class_list_visible = $('div#first-class-div').parent('div.listing-wrapper').hasClass('active');
        var instance_list_visible = $('div#first_instance_div').parent('div.listing-wrapper').hasClass('active');

        if (class_list_visible) {
            var class_id = $('div#first-class-div').find('tr.current td:nth-child(2)').text();
            var node_class_node_id = $('div#first-class-div').find('tr.current td:nth-child(3)').text();
            $.post(domainUrl + 'classes/classStructurePrint', {'class_id': class_id, 'node_class_id': node_class_node_id, 'mode': 'Display'}, printSelectedPane, 'html');

        } else if (instance_list_visible) {
            var node_instance_id = $('div#first_instance_div').find('tr.current').find('td.first_instance_structure.strat_click').text();
            var node_instance_node_id = $('div#first_instance_div').find('tr.current td:nth-child(3)').text();
            $.post(domainUrl + 'classes/instanceStructurePrint', {'node_instance_id': node_instance_id, 'node_y_class_id': $('#node_y_class_id').val(), 'node_instance_node_id': node_instance_node_id, 'mode': 'Display'}, printSelectedPane, 'html');

        } else { // remove this else

        }
    });
    // <<< AMIT MALAKAR


    flyoutUserSupportChatCollapse();
    procesMeterThreePane();
    renameTitle();//to rename title
    contextMenuDropDown(); // code for right click context menu
    viewUserProfile();
    addparticipants();
    badgeCount();
    peopleTabDropDown();
    AddMorePArticipants();
    coursePinned();
    fixedLiSticky();
    searchbarInfo();
    chatWindow();
    flyRadioBtnCustom();
    leftMenuCalHt();
    coursePanel();
    calculateThreePaneHeight();
    FilesValueFlyout();
    addArrow();
    loaderHeightWidth();


    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    $('.filter.close-participants').click(function () {
        if ($(".participant-panel").hasClass('opened')) {
            $('#UserChat .add-participants').trigger("click");
        }
    })

    $("body").on('click', function (e) {
        var getId = $(e.target).closest('.rightFlyout').attr('id');
        // if($('#CellRightFlyout').hasClass('in')){

        //     if(getId != 'CellRightFlyout'){
        //         $('.node-circle').removeClass('openflyout node-green-circle');
        //         $('#CellRightFlyout').animate({right:'-100%'}).removeClass('in');
        //         var cntrWidth = $("#center-screen").width();
        //         $("#center-screen").find('.fTHLC-inner-wrapper').css('width', cntrWidth -73);
        //         $("#center-screen").find('.fixed-top-header').css('width', $('.fTHLC-inner-wrapper').width());
        //         $("#center-screen").find('.fTHLC-outer-wrapper').css('width', cntrWidth);
        //     }

        // }
        if ($("#UserChat .people-project").hasClass("projectOpened")) {
            $(".close-people-panel").trigger('click');
        }
        if ($('#second-class-div').hasClass('hide')) {
            $('#main_action_menu').hide();
            $('#version_action_menu').show();
        }


        // $('.tollbar-panel .active').removeClass('active')
        // if($('.leftFlyout').hasClass('in')){
        //   $(".LeftFlyoutClose").trigger('click');
        // }
        // addArrow();
    });

    $('body').click(function (e) {

        // var status           =  $(e.target).closest('.leftFlyout').attr('id');
        var getLeftPaneClass = $(e.target).closest('.left-menu-pane').attr('id');
        var getInputId = $(e.target).closest('.nodeIdCount').attr('id');

        // if($('.leftFlyout').hasClass('in')){
        //     if(status == 'courseTemplateFlyout'){
        //     }

        //     else if(status != 'openCourseFlyout'){
        //         $('#openCourseFlyout').animate({left:0},300).removeClass('in');
        //         $('.course-filter-view').addClass('hide');
        //     }
        //     else{
        //         $('.LeftFlyoutClose').trigger('click');
        //     }
        // }

        if ($('.left-menu-pane').hasClass('in')) {

            if (getLeftPaneClass != 'new-course-first-pane') {
                $('#new-course-secound-pane').animate({left: 0}, 300).removeClass('in');
                $('#new-course-first-pane').animate({left: 0}, 300).removeClass('in');
                $('#new-course-first-pane').removeClass('removeActionPanel');
            }
            else if (getLeftPaneClass != 'new-course-secound-pane') {
                $('#new-course-secound-pane').animate({left: 0}, 300).removeClass('in');
                $('#new-course-first-pane').animate({left: 0}, 300).removeClass('in');
                $('#new-course-first-pane').removeClass('removeActionPanel');

            }

        }
        if (getInputId != 'temp_node_span') {
            $('.refCourseTitleEdit > i.tick').trigger('click');
        }



    });

    $('.breadcrumb-wrap').click(function (e) {
        // if($('.leftFlyout').hasClass('in')){
        //     $(".LeftFlyoutClose").trigger('click');
        // }
        addArrow();

    });

    $(".dialogue-side-tab .by-course-section").on('click', function (event) {
        $('.dialogue-tab').addClass('hide');
        $('.assign-course-tab').show();
        $('.new-course-tab').show();
        $('.course-pinned-close').trigger('click');
    });

    $(".dialogue-side-tab .by-actor-section").on('click', function (event) {
        $('.dialogue-tab').removeClass('hide');
        $('.dialogue-left-pane').hide();
        $('.course-detail').hide();
        $('.close-chat1').show();
        $('.chatIcon').show();
        $('.course-assign-cancel').hide();

        if (($('.close-chat1').hasClass('assign-course-tab')) && ($('.close-chat1').hasClass('new-course-tab'))) {
            $('.assign-course-tab').hide();
            $('.new-course-tab').hide();
        }
        else {
            $('.close-chat1').show();
        }
    });

    $('body').on('click', '.expand-heading', function () {
        var getData = $(this).next('.expanded-content').html();
        $(this).next('.expanded-content').html('Lorem . Ipsum . Dor . Ipsum .' + getData);
        $(this).next('.expanded-content').attr("originalData", getData);
        $(this).addClass('collapse-heading').removeClass('expand-heading');
        //$(this).parent('h2').css('margin-top','0px');
    });

    $('body').on('click', '.collapse-heading', function () {
        var getData = $(this).next('.expanded-content').attr("originalData");
        $(this).next('.expanded-content').html(getData);
        $(this).addClass('expand-heading').removeClass('collapse-heading');
        //  $(this).parent('h2').css('margin-top','7px')
    });

    $('body').on('click', '.flyoutFH', function () {
    });

    // using this support chat flyout on selected user
    $("body").on('click', '.all-users li', function (e) {
        $(this).removeClass("stickyLi courseStickyLi");
        var targetName = $(this).find(".chat-user-name").text()
        $(this).siblings('li').removeClass("active fixedSticky stickyLi courseStickyLi");
        $(this).addClass("active")
        $(".user-name").html(targetName);

        if ($('#view-courses').hasClass('hide')) {
            $('.edit-rename-title i').trigger('click');
            $('#view-courses').removeClass('hide');
            $('#add-courses').addClass('hide');
        }
        if ($(this).hasClass('undefined-col')) {
            $('#view-courses').addClass('hide');
            $('#add-courses').removeClass('hide');
        }
        //  e.stopPropagation();
    });

    $("body").on("click", ".support-chat", function (e) {
        if ($('.Flyout-Four-Pane').find('.user-profile-details').siblings('.close-user-profile-details').hasClass('opened-arrow')) {
            e.preventDefault();
            $(".user-profile-details").animate({"margin-right": "0"}, function () {

                $(".close-user-profile-details a i").attr("class", "fa fa-chevron-left")
                $(".close-user-profile-details").addClass("opened-arrow").removeClass("closeme");

            });

        }
    });
    //end profile user

    // expended textarea by click

    var headerHig = $('.header-wrapper').outerHeight();
    var windowHig = $(window).height();
    var footerWrap = $(".breadcrumb-wrap").outerHeight();
    var availHeight = windowHig - headerHig - footerWrap;
    var setHt = $(".set-height-dialogue").outerHeight();
    var expendedBtn = $(".action-wrap").outerHeight();
    var tabHeight = $(".right-bar-tab").outerHeight();
    var textareaBox = $(".dialogue-txt-comment").outerHeight();
    var actionWrap = $(".action-wrap").outerHeight();

    $("body").on("click", ".dialogue-view .expanded-box", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(".dialogue-view .set-height-dialogue").animate({"height": -setHt});
        $(".dialogue-view .dialogue-txt-comment").height(availHeight - (tabHeight + actionWrap));
        $(".dialogue-view .expended-height").height(availHeight - (tabHeight + expendedBtn) - 28);
        $(".dialogue-view .expand-collapse-box").removeClass("expanded-box").addClass("close-expend");
        $(".dialogue-view .checkbox").css("visibility", "hidden");
        $(".dialogue-view .expended-height").css("background", "")
        $('.dialogue-view .close-participants').trigger('click');
        $(".dialogue-view .icons-right-panel span").removeClass("open");
    });

    $("body").on("click", ".dialogue-view .close-expend", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('.breadcrumb-wrap').hasClass('breadcrumb-up')) {
            var setHt2 = setHt + 38;
            $(".dialogue-view .set-height-dialogue").animate({"height": setHt2}, function () {
                $(".dialogue-view .expand-collapse-box").removeClass("close-expend").addClass("expanded-box");
                $(".dialogue-view .dialogue-txt-comment").height(textareaBox);
                $(".dialogue-view .expended-height").css("height", "100");
            });
        }
        else {
            $(".dialogue-view .set-height-dialogue").animate({"height": setHt}, function () {
                $(".dialogue-view .expand-collapse-box").removeClass("close-expend").addClass("expanded-box");
                ;
                $(".dialogue-view .dialogue-txt-comment").height(textareaBox);
                $(".dialogue-view .expended-height").css("height", "100");
                $(".dialogue-view .checkbox").css("visibility", "visible");
                $(".dialogue-view .expended-height").css("background", "#fff")

            });
        }
    });
    //end

    /* Code for Three pane general right click context menu */
    var $contextMenu = $('#generalContextMenu');
    $('body').on("contextmenu", '.general-details-info .detail-label', function (e) {
        $contextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY,
            position: "fixed"
        });
        return false;
    });

    $contextMenu.on("click", "a", function () {
        $contextMenu.hide();
    });

    $('.threePaneWrapper').on('update', function () {
        $('#generalContextMenu').hide();
    });

    $('body').click(function () {
        $('#generalContextMenu').hide();
    });

    NProgress.configure({showSpinner: false, trickleRate: 0.02, trickleSpeed: 500});
    $('#nprogress .bar').css({'background': '#16a085'});
    $('#nprogress .peg').css({'box-shadow': '0 0 10px #16a085, 0 0 5px #16a085'});
    $('#nprogress .spinner-icon').css({'border-top-color': '#16a085', 'border-left-color': '#16a085'});
    DialogueFlyout();
    searchInfo();
    contextualSearch();
    showLoginModal();

    // for nano scroll
    $('.nano').nanoScroller({
        preventPageScrolling: true
    });

    $("#main").find('.description').load("readme.html", function () {
        $(".nano").nanoScroller();
        $("#main").find("img").load(function () {
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

    $availHeight = window.innerHeight - ($headerHeight + $breadcrumbWrap + 1);
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
                // height: $availHeight,
                top: -top + 1 + 'px'
            }).show(0);
            $menu_wrapper.find('ul.menu-items:not(._sub-menu)').css({
                minHeight: $availHeight - $breadcrumbWrap
            });

        }
        // event.preventDefault();
        // event.stopPropagation();
    });

    contentHeaderWidth();
    setColumnsH();
    dualPaneHeight();
    threepaneSlide();


    // onclick chat icon with drop shadow - @vimal
    $(".DialogueCancel").click(function () {

        var x = 0;
        var intervalID = setInterval(function () {
            $(".sm-user-icon").toggleClass("drop-shadow");

            if (++x === 5) {
                if ($(".sm-user-icon").hasClass("drop-shadow")) {
                    $(".sm-user-icon").removeClass("drop-shadow");
                }
                window.clearInterval(intervalID);

                //return false;
            }
        }, 280);
    });





    // $('body').on('click','.three-pane-open',function(e){

    //     var threepanewrapperWidth = $(".threePaneWrapper").outerWidth();
    //     var  actionWrap = $(".user-action-wrap").outerWidth();
    //     var wrappermargin = threepanewrapperWidth + actionWrap;
    //     if(flag == true){
    //          threepaneSlide();
    //         $(".threePaneWrapper").animate({"margin-right":'+='+wrappermargin});

    //         $(".threePaneWrapper").removeClass('hide');
    //       // flag = false
    //     }
    //      $(".tooltip-item").hide();
    //      $('.Done-timeline').show();
    //      $('.Cancel-timeline').show();
    //      $('.three-pane-close').show();


    //      flag = false
    //      e.stopPropagation();
    // });

    //threePaneWrapper slideout
    // $('body').on('click','.three-pane-close',function(){

    //     var threepanewrapperWidth = $(".threePaneWrapper").outerWidth();
    //     var  actionWrap = $(".user-action-wrap").outerWidth();
    //     var wrappermargin = threepanewrapperWidth + actionWrap;
    //     manageRightMenuIcon('listing','classes');
    //     if(flag == false){

    //       $(".threePaneWrapper").animate({"margin-right":'-='+wrappermargin});
    //        $(".threePaneWrapper").addClass('hide');
    //       flag = true
    //     }
    // });


    $('body').on('click', ".list-tab", function () {
        $('.grid-div.process-grid').css("display", "block").addClass('center-div');
        $('.grid-div.manifest').css("display", "none").removeClass('center-div');
        $('.list-tab').addClass("active");
        $('.manifest-tab').removeClass("active");
        setTableWidth();
    });

    $('body').on('click', ".manifest-tab", function () {
        $('.grid-div.process-grid').css("display", "none").addClass('center-div');
        $('.grid-div.manifest').css("display", "block").removeClass('center-div');
        $('.list-tab').removeClass("active");
        $('.manifest-tab').addClass("active");
        setTableWidth();
    });

    $("body").on('click', '.classes_top_cl', function (e) {

        versionPanel();
        if (assocationClick != true) {
            if ($("#firstTime").val() == 'Y')
            {
                $(".first_hit").click();
                $("#firstTime").val('N');
            }
        }

        $(".main-head").html("Classes: List");
        var setmargin = $(".pui_center_content").css("margin-left");
        var setmarginbredcrumb = $(".image-slider").css("margin-left");
        $("#center-screen").hide();
        $("#ControlBar").hide();
        $('#menudashboard').hide();
        $(".pui_center_content").show();
        $('#menudashboard').hide();
        $("#actors-screen").hide();
        $("#documents-screen").hide();
        $("#canvas-screen").html('');
        $("#canvas-screen").hide();
        $("#main-screen").hide();
        $('.content-wrapper-new').siblings('.user-action-wrap').hide();
        //$("#main_action_menu").show();
        $("#parti_action_div_id").show();


        /* Right Menu Function */
        $("#main_action_menu").show();
        $("#sub_class_action_menu").hide();
        $("#course_action_menu").hide();

        $(".pui_center_content").animate({
            'marginLeft': '0px'

        }, 500);
        $(".dashSlider ").removeClass("active");
        $(".dashSlider ").eq(0).addClass("active");
        $(".dashSlider ").eq(1).addClass("active");
        $(".breadcrumb-wrap li").removeClass("active");
        $(".breadcrumb-wrap li").eq(0).addClass("active");
        $(".breadcrumb-wrap li").eq(1).addClass("active");
        $(".image-slider a").eq(2).remove();
        $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
        $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
        var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth()
        $(".image-slider").css("width", totalwidth);
        $(".image-slider").animate({
            'marginLeft': '-=' + setmarginbredcrumb
        }, 500);
        var is_instance = $("#is_instance").val();
        if (is_instance == 'Y')
        {
            setTimeout('nextNew();', 1000);
        }
        e.stopPropagation();
        manageNodeXIcon();
        removeNodeXpane();
        contextMenuDropDown();
        hideFlyout();
        $("#scheduleBuilder").animate({"right": "-100%"}, 300, function () {
            $("#scheduleBuilder").removeClass("in");
            $('.structuredSche.openthreepane').removeClass('openthreepane');
        });
        addArrow();
        //setNumberPrint()
    });

    $(".breadcrumb li").hover(function () {
        if ($(this).hasClass("non-ins")) {
            $(".non-ins").addClass("breadCrumbHoverLi");
        } else if ($(this).hasClass("ins")) {
            $("ins").addClass("breadCrumbHoverLi");
        }
    }, function () {
        $(".breadcrumb li").removeClass("breadCrumbHoverLi");
    });

    // show and hide in node-x & Node-y selection in dropdown
    $('body').on('change', '.nodeselection-dropdown', function () {

        if ($("#node-x-li a").html() == "Node X") {
            if (this.value == 1) {
                if ($("#div-node-x").hasClass("active")) {
                    var NodeclassName = $("#class_caption").parent('.node-head').find('span').html();
                    bootbox.confirm({
                        title: 'Warning',
                        message: 'Changing the node type will disregard all saved relationship and convert class ' + NodeclassName + ' to Node X Class. Are you sure you want to continue',
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
                                var classPropertyId = [];
                                $("#second-class-div").find(".hidden-node-x").each(function (k, v) {
                                    if ($(v).val() != "")
                                        classPropertyId.push($(v).val());
                                });
                                $.post(domainUrl + 'classes/deleteInstanceProperty', {'classPropertyId': classPropertyId}, deleteInstanceProperty, 'json');
                                removeNodeXpane();
                                $(".non-ins").trigger("click");
                                $(".Edit-icon").trigger("click");
                                setTimeout(function () {
                                    $("#node_type_id").val("1");
                                    $(".Nodex-icon").addClass("inactiveLink");
                                }, 500);

                            } else {
                                $("#node_type_id").val("2");
                            }
                        }
                    });

                }
                $(".Nodex-icon").addClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "none");

                $(".Nodez-icon").removeClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "all");

                $(".Subclass-icon").addClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "none");
            }
            else if (this.value == 3) {
                $(".Nodex-icon").addClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "none");

                $(".Nodez-icon").addClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "none");
                $(".Subclass-icon").addClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "none");
            }
            else {

                $(".Nodex-icon").removeClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "all");

                $(".Nodez-icon").removeClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "all");

                $(".Subclass-icon").removeClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "all");
            }
        }
        else if ($("#node-x-li a").html() == "Node Z") {

            if (this.value == 3) {
                if ($("#div-node-x").hasClass("active")) {
                    var NodeclassName = $("#class_caption").parent('.node-head').find('span').html();
                    bootbox.confirm({
                        title: 'Warning',
                        message: 'Changing the node type will disregard all saved relationship and convert class ' + NodeclassName + ' to Node Z Class. Are you sure you want to continue',
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
                                var classPropertyId = [];
                                $("#second-class-div").find(".hidden-node-x").each(function (k, v) {
                                    if ($(v).val() != "")
                                        classPropertyId.push($(v).val());
                                });
                                $.post(domainUrl + 'classes/deleteInstanceProperty', {'classPropertyId': classPropertyId}, deleteInstanceProperty, 'json');
                                removeNodeXpane();
                                $(".non-ins").trigger("click");
                                $(".Edit-icon").trigger("click");
                                setTimeout(function () {
                                    $("#node_type_id").val("3");
                                    $(".Nodex-icon").addClass("inactiveLink");
                                }, 500);

                            } else {
                                $("#node_type_id").val("2");
                            }
                        }
                    });

                }

                $(".Nodex-icon").addClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "none");
                $(".Nodez-icon").addClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "none");
                $(".Subclass-icon").addClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "none");
            }
            else if (this.value == 1) {

                $(".Nodex-icon").addClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "none");

                $(".Nodez-icon").removeClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "all");

                $(".Subclass-icon").addClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "none");
            }
            else {

                $(".Nodex-icon").removeClass("inactiveLink");
                $(".Nodex-icon").css("pointer-events", "all");

                $(".Nodez-icon").removeClass("inactiveLink");
                $(".Nodez-icon").css("pointer-events", "all");

                $(".Subclass-icon").removeClass("inactiveLink");
                $(".Subclass-icon").css("pointer-events", "all");
            }
        }
    });


    $("body").on('click', '.close-class-select', function () {
        $('#second-class-div .node-selected .hidden-node-y').val('')
        $('#second-class-div .node-selected .hidden-node-y-instance-property-node-id').val('')
        $(".sub_class_list_view1").hide();
        $(".add-fly-radio-checked i").addClass('plus-small').removeClass('edit-class-select');
    });

    //code for add New Class Model
    $('body').on('keyup', '#common_name_first', function () {
        if ($(this).val().length > 0) {
            $("#commonPopupFirst .btn ").removeClass("inactiveLink");
        } else {
            $("#commonPopupFirst .btn").first().addClass("inactiveLink");
        }
    });



    //code for add New Instance Class Model
    $('body').on('keyup', '#instance_class_name_first', function () {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($(this).val().length > 0) {
            $("#instance-class-popup .btn ").removeClass("inactiveLink");
            if ($keycode == 13) {
                $('#instance-class-popup .btn').eq(0).trigger('click');
            }
        } else {
            $("#instance-class-popup .btn").first().addClass("inactiveLink");
        }
    });
    $('body').on('shown.bs.modal', '#myEditorImg', function () {
        $('#myImg').Jcrop({
            aspectRatio: 1,
            onSelect: updateCoords
        }, function () {
            jcrop_api = this;
        });
    });

    //code for enable and disable deleteclasses and instance
    $('body').on('click', '#first-class-div .class-table tr input[type="checkbox"]', function () {
        if (($(".class-table .single_check:checkbox:checked").length > 0) || ($(".class-table .default_row_class :checkbox:checked").length > 0)) {
            $(".DeleteClasses_li").removeClass("inactive");
            $(".DeleteClasses_li").find('a').css("pointer-events", "all");
        } else {
            $(".DeleteClasses_li").addClass("inactive");
            $('.class-table .all_check').attr("checked", false);
            $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        }
    });

    $('body').on('click', '#first_instance_div .class-table tr input[type="checkbox"]', function () {
        if ($(".class-table .single_i_check:checkbox:checked").length > 0) {
            $(".DeleteClasses_li").removeClass("inactive");
            $(".DeleteClasses_li").find('a').css("pointer-events", "all");
        } else {
            $(".DeleteClasses_li").addClass("inactive");
            $('.class-table .all_i_check').attr("checked", false);
            $(".DeleteClasses_li").find('a').css("pointer-events", "none");
        }
    });

    $('body').on('click', '.open-file1', function () {

        if ($.trim(globalTitle) != "" && typeof globalTitle != 'Undefined') {
            globalTitle = globalTitle;
        } else {
            globalTitle = $("#document_title").val();
        }

        $.post(domainUrl + 'documents/fileHelper', {'title': $("#document_title").val()}, responseFileHelper2, 'html');
        $('#File.file1').addClass('in');
    });

    /*code here start to click on dialogue + icon then open right pane with selected course add dialogue*/
    // $('body').off('click', '#create-new-dialogue').on('click', '#create-new-dialogue', function (e) {

    //     edtTagArray = [];
    //     globalNewDialog = $(this).attr('co-instance-id');
    //     $('.Newcourse_li > a.strat_click').trigger('click');


    //     mydummyParticipantObj = "";
    //     $("#is_individual_list").val('');
    //     $(".course_edt_box .chat-msg:visible").val("");
    //     $(".course_edt_box .letter-edt-wrapper .edtParagraph:visible").text("");
    //     addBrEditor();

    //     /* hide edit course mode */
    //     $(".existingSelectedCourseWrap").removeClass("show").addClass("hide");
    //     $(".existing-dialogue-control-wrap").removeClass("show").addClass("hide");
    //     /* hide edit course mode */

    //     /* show default course mode */
    //     $(".new-course-control-wrap").addClass("show");
    //     $(".newCourseDefaultSec").addClass("show");

    //     $("#viewCourseControlBar, #viewCourseDefaultWrapper").addClass("hide");
    //     newCourseView('visible', 'hide');

    //     /* show default course mode */
    //     $("#dialogue-title-value").val('');
    //     $(".expand-block-head").show();
    //     $("#course-title-value").addClass("hide");
    //      $(".courseTitleAddView").show();
    //      $("#dialogue-title-value").focus();
    //      var courseInstanceId    =  $(this).attr('co-instance-id');
    //      var courseName          =  $(this).attr('course-title');
    //      $(".courseTitleAddView").html(courseName);
    //      $("#courseInsId").val(courseInstanceId);
    //      if($("#course-title-value").is(":hidden")){
    //      var courseTitleVal = $(".courseTitleAddView").html();
    //      $(".course-title-input").val(courseTitleVal);
    //      }
    //     dialogueMenu();
    //     $("#dialogue_action_menu").show();
    //     $("#course-dialogue-draft").show();
    //     $("#course-dialogue-publish").show();
    //     $("#course-dialogue-cancel").show();

    //     /*$("#is_individual_list").val('');
    //      $.post(domainUrl+'menudashboard/getAllUsers',{},responseIndividualParticipant,'json');
    //      $("#is_individual_list").val('Y');
    //      $("#empty-statement").val('');
    //      $(".message-wrap .msg-statement-wrap ul").find('li .statement-info').remove();
    //      $("#add-new-course-value").val('');
    //      $("#individual_user_list").val('');*/

    //     //required-field-validation

    //     /*$(".course_edt_box .chat-textarea").siblings(".error-msg").remove();
    //      $(".course_edt_box .chat-textarea .chat-msg:visible").removeClass("alert-text");
    //      $(".letter-edt-wrapper").next().siblings(".letter-error-msg").remove();
    //      $("#add-new-course-value").val("no");*/

    //     // remove incative buttons
    //     /*$("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");
    //      $("#individual_user_list").siblings(".error-msg").remove();
    //      $("#individual_user_list").removeClass("alert-text");
    //      $("#dialogue-title-value").val('');
    //      $('input[name="recipient_id[]"]').remove();
    //      $(".addNiceScrollWrapper").html('');*/
    // });


    // $('body').off('click', '.dialogue-drp').on('click', '.dialogue-drp', function (e) {
    //     var getTopPos = $(this).offset().top;
    //     var getOffset = $(this).offset().top + 70;
    //     var AvailHT     = $(window).height() - 180;
    //     $(this).toggleClass('open');
    //
    //     if($(this).hasClass('open')){
    //         $("body").append("<div class='background-layer'></div>")
    //     }
    //     else{
    //         $('.background-layer').remove();
    //     }
    //
    //     if (getOffset > AvailHT){
    //         $(this).find('.dropdown-menu').addClass('drpBottom');
    //         $(this).find('.dropdown-menu').css('top', 'inherit');
    //     }
    //     else{
    //         $(this).find('.dropdown-menu').removeClass('drpBottom');
    //         $(this).find('.dropdown-menu').css('top', getTopPos);
    //     }
    //     //  return false;
    // });
    $('body').off('click', '.dialogue-drp-close').on('click', '.dialogue-drp-close ', function (e) {
        $(".dialogue-drp").removeClass('open');
        setTimeout(function(){
            $('.background-layer').remove();
        })

        // return false;
    });
    $('body').off('click', '.background-layer').on('click', '.background-layer', function (e) {
        $(".dialogue-drp").removeClass('open');
       setTimeout(function(){
            $('.background-layer').remove();
        })
    });

    /*********** start Course DashBoard *********/

    //course Board more icon show and hide

    // $("body").on('click','.more-icons', function(){
    //     alert(event.target.id+" and "+$(event.target).attr('class'));
    //     //$('.current-text-editor .alignBoxWrap:visible').removeClass("hide");
    //     $('.current-text-editor .alignBoxWrap:visible').removeClass("hide");
    // });
    $(document).on('click', function (e) {
        if (e.target.id == 'MoreIconsShow') {
            //added by divya
            //$(".current-text-editor .alignBoxWrap").children().css('display','block');
            /*End Here*/
            $('.current-text-editor .alignBoxWrap').toggleClass("hide").css("display", "block");
        } else {
            $('.current-text-editor .alignBoxWrap').addClass("hide");
        }

    })


    $("body").on("click", ".existingSelectedCourseWrap .course-expand-collapsed-btn", function () {

        var midExistHght = $('#rightPane').outerHeight() - $(".add-course-pane").outerHeight() - 11;
        //var msgWrap = $(".letter-message-wrap");
        var msgBox = $(".unread-msg-box");
        var existingDocContainer;
        if ($(".drop-anchor-select:first:visible").text() == "Letter") {
            existingDocContainer = $(".letterChatMode:first");
        } else {
            existingDocContainer = $(".existingDocContainer:first");
        }
        if ($(this).hasClass("editor-expand-btn")) {
            // $(".letter-message-wrap").removeClass("show").addClass("hide");
            if ($(".drop-anchor-select:first:visible").text() == "Letter") {
                $(".letter-count").show();
                $(".chat-count").hide();
                $(".message-wrap").addClass("hide");
                //$(".message-wrap").removeClass("show").addClass("hide");
            }
            else if ($(".drop-anchor-select:first:visible").text() == "Chat") {
                $(".letter-count").hide();
                $(".chat-count").show();
                //$(".letter-message-wrap").removeClass("show").addClass("hide");
                $(".message-wrap").addClass("hide");
                msgBox.removeClass("hide").addClass("show");
            }
            msgBox.removeClass("hide").addClass("show");
            $(this).removeClass("editor-expand-btn").addClass("editor-collapsed-btn").attr('data-original-title', 'Collapse');
            var unreadmsgHght = $(".unread-msg-box").outerHeight();
            var editorExpandHght = midExistHght - unreadmsgHght;
            existingDocContainer.outerHeight(editorExpandHght);
            $(this).closest(".course_edt_box").addClass('manageCourseEditorPopTop');

        }

        else {
            $(this).removeClass("editor-collapsed-btn").addClass("editor-expand-btn").attr('data-original-title', 'Expand');
            msgBox.removeClass("show").addClass("hide");
            $(".message-wrap").removeClass("hide");

            //$(".letter-message-wrap").removeClass("hide").addClass("show");
            /*if($('#dropLetterChatView').text() == "Letter"){
             $(".letter-message-wrap").removeClass("hide").addClass("show");
             }
             else if($('#dropLetterChatView').text() == "Chat"){
             $(".letter-message-wrap").removeClass("show").addClass("hide");
             $(".message-wrap").removeClass("hide").addClass("show");
             }*/

            existingDocContainer.outerHeight(100 + "px");
            $(".existWrapperMsg").outerHeight(midExistHght - 100);
            $(this).closest(".course_edt_box").removeClass('manageCourseEditorPopTop');


        }
        var editorHght = existingDocContainer.outerHeight();
        var edtHeaderhght1 = existingDocContainer.find(".edtHeader").height();
        var remConHght1 = editorHght - edtHeaderhght1;
        $(".existingSelectedCourseWrap .existingDocContainer .edtBody,.existingSelectedCourseWrap .existingDocContainer .mainScroll").outerHeight(remConHght1);
        $(".existingSelectedCourseWrap .existingDocContainer .niceScrollDiv").niceScroll({
            cursorcolor: "#000",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "2px",
            background: 'rgba(0,0,0,.15)'
        });
        var getOffset = $('.course-alignment-section').offset().top
        if (getOffset > 500){
            $('.course-alignment-section').find('.StatementType').addClass('drpBottom');
        }
        else{
            $('.course-alignment-section').find('.StatementType').removeClass('drpBottom');
        }

        $(".letter-message-wrap, .message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .message-wrap ul').height() - 1, 1);
        EditorHT($(this).hasClass("editor-expand-btn"));
        manageDialogueHT();
    });

    // edit-expanded-view-source
    $("body").on("click", ".existingSelectedCourseWrap .unread-msg-box .total-msg-count", function () {
        $(".course-expand-collapsed-btn").trigger('click');
        $(".letter-message-wrap, .message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .message-wrap ul').height() - 1, 1);
    });

    /*********** End Course DashBoard *********/

    // $(document).on("click", function(){
    //    $(".alignBoxWrap").addClass("hide").removeClass("show");

    // });

    /*save form builder data*/
    $(".entr-save-form-instance").on("click", function ()
    {
        $("#instance_property_caption2952").val('');
        $("#instance_property_caption2952").val($('#viewClassInstance textarea').val());
        sendInstanceJson();
        var myInstanceJsonString = JSON.stringify(instanceBuilder);
        $.post(domainUrl + 'classes/saveInstance', {'data': $("#instance_structure_form").serialize(), 'saveType': 'P', 'is_instance': 'Y', 'myInstanceJsonString': myInstanceJsonString}, responseSaveInstanceProperty, 'html');
        $("#viewClassInstance").modal('hide');
    });

    $(".entr-save-form-instance-cancel").on("click", function () {
        $("#instance_property_caption2952").val('');
        $("#instance_property_caption2952").val($('#viewClassInstance textarea').val());
    });



    $('body').off('click', '#course-dialogue-cancel').on('click', '#course-dialogue-cancel ', function ()
    {
        var data = {msg: 'Are you sure you want to cancel?'}
        $("#delMsgOfCID").html(data['msg']);
        $("#deleteInsOrCourseDialogue").modal('show');

    });


    $('body').off('click', '#getCanvasMode').on('click', '#getCanvasMode ', function () {

        var instance_id = $('#hidden_dialog_document_instance_id').val();
        var instance_node_id = $('#hidden_dialog_document_node_id').val();
        var hidden_dialog_type = $('#hidden_dialog_type').val();
        if (instance_node_id != "" && instance_id != "" && hidden_dialog_type == "Canvas") {
            $.post(domainUrl + 'documents/canvas', {'node_instance_id': instance_id, 'node_id': instance_node_id}, responseCanvasHtml, 'html');
        } else {
            $.post(domainUrl + 'documents/canvas', {}, responseCanvasHtml, 'html');
        }



    });


   // $('body').off('click', '.menu-flyout-open').on('click', '.menu-flyout-open', function () {
   //    var getFlyoutID = $(this).data('flyout');
   //    $("#"+getFlyoutID).toggleClass("in");
   //      if($('#courseTemplateFlyout.right-popup').hasClass('in') ) {
   //          $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
   //      }
   //      if($('#courseTemplateFlyout.LeftFlyoutOpen').hasClass('openflyout') ) {
   //          $('#courseTemplateFlyout.LeftFlyoutOpen').removeClass('openflyout');
   //      }
   //    setColumnsH();
   //  });

    $('body').off('click', '.menu-flyout-close').on('click', '.menu-flyout-close', function () {
      var getFlyoutID = $(this).data('flyout');
      $("#"+getFlyoutID).removeClass("in");
      if($(".left-action-bar").hasClass("fixed-menu")){
        $(".left-action-bar").removeClass("fixed-menu");
      }
    });
    $('body').off('click', '.menu-flyout-overlay').on('click', '.menu-flyout-overlay', function () {
        if($(".menu-flyout").hasClass("in")){
            $(".menu-flyout-close").trigger('click');
        }
        if($("#courseTemplateFlyout").hasClass("in")){
            $(".LeftFlyoutClose").trigger('click');
        }
    });



    // $('body').off('click', '.rt-signin-slide').on('click', '.rt-signin-slide', function () {
    //     if(!($("#rt-signin-form").hasClass("hide"))){
    //         $(".rt-signin-wrap").addClass("hide");
    //         $("#rt-role-form").removeClass("hide")
    //     }
    //     else if(!($("#rt-role-form").hasClass("hide"))){
    //         $(".rt-signin-wrap").addClass("hide");
    //         $("#rt-payment-form").removeClass("hide")
    //     }
    //     else{
    //         setTimeout(function(){
    //             $(".rt-signin-wrap").addClass("hide");
    //             $("#rt-signin-form").removeClass("hide")
    //         },500)
    //
    //     }
    // });

    // $('body').off('click', '.rt-signup-slide').on('click', '.rt-signup-slide', function () {
    //     if(!($("#rt-signup-form").hasClass("hide"))){
    //         $(".rt-signup-wrap").addClass("hide");
    //         $("#rt-signup-sucess").removeClass("hide")
    //     }
    //     else{
    //         setTimeout(function(){
    //             $(".rt-signin-wrap").addClass("hide");
    //             $("#rt-signup-form").removeClass("hide")
    //         },500)
    //
    //     }
    // });

    $( "#mkt-datepicker" ).datepicker({
      changeMonth: true,
      changeYear: true,
      maxDate: 0
    });

    // Amit Malakar Date: 01-Aug-2017
    // logout function moved from subscription.phtml
    $('body').on("click", '.logout-user-all', function (event) {
        $('#user_details_icon').siblings('.dropdown-menu').hide();
        $.post(domainUrl + 'login/doLogout', {'session_file_name': session_file_name}, getLogoutResponse, 'JSON');
        if (event.stopPropagation) event.stopPropagation();
    });


    $('body').off('click', '#courseNotification').on('click', '#courseNotification', function () {
        $('.loadNotiication').trigger('click');
        /*if($(".courseNotification-panel").hasClass('show')){
            $(".courseNotification-panel").removeClass('show');
        }
        else{
            $(".courseNotification-panel").addClass('show');
        }
        setTimeout(function(){$(".courseNotification-panel .nano").nanoScroller();$(".courseNotification-panel .nano").nanoScroller({ scroll: 'top' });},0);
        */
    });

    $('body').off('click', '.popover-overlay').on('click', '.popover-overlay', function () {
        if($(".courseNotification-panel").hasClass('show')){
            $(".courseNotification-panel").removeClass('show');
        }
    });

    $('body').off('click', '.app-read-more').on('click', '.app-read-more', function () {
        $(this).addClass('hide');
        $('.truncate-text').removeClass("paragraph-ellipsis");
        $(".app-read-less").removeClass('hide');
         $(".nano").nanoScroller();
    });

    $('body').off('click', '.app-read-less').on('click', '.app-read-less', function () {
        $(this).addClass('hide');
        $('.truncate-text').addClass("paragraph-ellipsis");
        $(".app-read-more").removeClass('hide');
         $(".nano").nanoScroller();
    });





});

// Amit Malakar Date: 01-Aug-2017
// logout response function moved from subscription.phtml
function getLogoutResponse(data) {
    if (parseInt(data.result) == 0) {
        session_file_name   = '';
        setUsername         = '';
        setUserID           = '';
        firstName           = '';
        lastName            = '';
        initialName         = '';
        profileImage        = 0;

        window.location.href = domainUrl + 'store';
    }
}

/* function here to diaplay dialogue menu while adding dialogue for selected course*/
var myDropzoneCourseChat;
function dialogueMenu() {
    $("#edit-course").hide();
    $("#course-publish").hide();
    $("#course-draft").hide();
    $("#course-cancel").hide();
    $("#add-course-publish").hide();
    $("#add-course-draft").hide();
    $("#add-course-cancel").hide();
    $("#new_course_action_menu").hide();
    $("#course_action_menu").hide();
    $("#dialogue_action_menu").show();
}



function responseCanvasJson(d, s) {
    $("#documents-screen").html('');
    $("#documents-screen").hide();
    $("#canvas-screen").html(d);
    $("#canvas-screen").show();
    $('#canvas_action_menu').show();
    setColumnsH();
    manageNiceScroll();
    NProgress.done();
}

function responseFileHelper2(d, s) {
    //var titleData = JSON.parse(d);
    $(".file1").html(d);
    $(".action-file1").show();
    $(".action-file2").hide();
    setDocHig();
    $("#document_title").focus();

    $("#document_title").val(globalTitle);
    var getVal = $("#document_title").val();
    if (!getVal == "") {
        var getdata = $("#document_title").val().length;
        $('.charCount').text(getdata);
    }
}

function responseFileHelper1(d, s) {
    $(".file2").html(d);
    $(".action-file2").show();
    $(".action-file1").hide();
    setDocHig();
    $("#document_title").focus();

    $("#document_title").val(globalTitle);
    var getVal = $("#document_title").val();
    if (!getVal == "") {
        var getdata = $("#document_title").val().length;
        $('.charCount').text(getdata);
    }
}

function deleteInstanceProperty()
{
}
//---- document ready ends here

$(window).on('load', function () {
    contentHeaderWidth();//--- to set control bar's cols width
    setColumnsH();
    DialogueFlyout();
    dualPaneHeight();
    leftMenujs();
    $(".expended-height").css("background", "#fff");
    //display node-x selection
    nodexSelection();
});

$(window).resize(function () {
    //threepaneSlide();
    // procesMeterThreePane();
    // DialogueFlyout();
    // setColumnsH();
    // dualPaneHeight();
    // setHeightThreePane();
    // initialLoad();
    // setThreePaneWidth();
    // setProcessThreePaneWidth();
    // flyRadioBtnCustom();
    // leftMenuIconHover();
    // loaderHeightWidth();
    // calenderWidthHeight();
    // sideFlyoutHeight();
    // cellFlyout();
    // OperationPane();
    // setMaskWidthHeight();
    EditorHT(true);
    // if ($("#menudashboard").css('display') == 'block') {
    //     dashboardInitalLoad();
    //
    //     if (($('.course-list-panel .course-list .ActiveRow').find('tr').hasClass('current')) || ($(".existingDialogueSelCourseList.current").data('id') == null)) {
    //         newCourseView(':visible', 'hide');
    //
    //     } else {
    //
    //         var modeType = $.trim($('#dropLetterExists').text());
    //         //existingCourseView(':visible', modeType);
    //     }
    // }
    //folderSection();
    //newCourseDialogueDefault(); // new course default dialogue
    // if ($("#menudashboard").children().length > 0) { //this line written by Divya Rajput to stop this functionality on document section
    //     //defaultOpenNewCourseDialogBox(true); //default course dialogue
    // }  //this line written by Divya Rajput to stop this functionality on document section


    /*if( ($('.course-list-panel .course-list .ActiveRow').find('tr').hasClass('current')) || ($(".existingDialogueSelCourseList.current").data('id') == null) ){
     newCourseView(':visible','hide');
     }else{
     var modeType = $.trim($('#dropLetterExists').text());
     existingCourseView(':visible',modeType);
     }*/
    // if($('.alignBoxWrap').is(':visible')){
    //     $('.alignBoxWrap').addClass('hide');
    // }
    // existingDialogueSelCourse();

    //singleDialogueViewCourse();
    //$("#newCourseControl").addClass("hide"); // because it shows on window resize

    // resize-icons-appeared-in-version-dashboard
    // if ($(".dashboard.pui_center_content").css('display') == 'block') {
    //     $("#dialogue_action_menu").hide();
    // }

    // set-scroll-nice-bottom-course-view
    // setTimeout(function () {
    //     //$(".letter-message-wrap, .message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .message-wrap ul').height() - 1,1);
    //     if ($(".letter-message-wrap, .message-wrap").length) {
    //         $(".letter-message-wrap, .message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .message-wrap ul').height() - 1, 1);
    //     }
    //
    // }, 1000);
    setTimeout(function () {
        calculateFullDialogueChatHeight()
        // noParticipantHT();
        // manageDialogueHT();
    }, 100);
    // set-resize-margin-course-view-modal
    // var winHght = $(window).outerHeight() / 2.2;
    // $(".courseViewModal .modal-dialog").css("margin-top", winHght);
    //
    // // setTimeout(function () {
    // //     imitationDemoWidthHeight(); // summary page height & width in resize
    // // }, 100)
    //
    // responseInstanceStructure();
    // if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
    //     $breadcrumbWrap = 10;
    //     var HT = $(window).height() - $('header').outerHeight()- $('.dialogue-container').outerHeight() - $breadcrumbWrap;
    //     $('.existingSelectedCourseWrap.HalfPaneHeight').height(HT);
    // }
    // else{
    //     $breadcrumbWrap = 51;
    //     var HT = $(window).height() - $('header').outerHeight()- $('.dialogue-container').outerHeight() - $breadcrumbWrap;
    //     $('.existingSelectedCourseWrap.HalfPaneHeight').height(HT);
    // }


    //$(".nano").nanoScroller({ destroy: false });

});

function leftMenujs()
{
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


    // $sidebar_wrap.on('mouseleave', function (event) {
    // $firstLi.eq(lastLiIndex).trigger("click");
    // });
    window.redirectUrl;
    $firstLi.on('click', function (event, goClicked) {
        $this = $(this);
        if(!isUserLoggedIn() && !($this.hasClass('_active'))) {
            window.location.hash = '#login';
            window.redirectUrl = $(this).find('.icon-wrap').find('.strat_click').data('href');
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        $disabledLinkArr = ['icon invoice', 'icon profile', 'icon setting main-icon-setting_ ', 'icon checklist'];
        if ($disabledLinkArr.indexOf($this.find('i').attr("class")) != -1 || $this.hasClass("inactive")) {
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
            $('.shortcut-icon').hide();
            //--- Add and remove classes
            $firstLi.removeClass('_active');
            $this.addClass('_active');
            $this.find('.shortcut-icon').show();

            var top = $this.offset().top - $sidebar_wrap.offset().top + 1;
            $menuWrappers.hide(0);
            $(".compactanchor").removeClass("last-active");
            $menu_wrapper = $this.find(".menu-wrapper").css({
                // height: $availHeight,
                top: -top + 1 + 'px'
            }).show(0);
            $menu_wrapper.find('ul.menu-items:not(._sub-menu)').css({
                minHeight: $availHeight - $breadcrumbWrap
            });

        }
        // event.preventDefault();
        // event.stopPropagation();
    });

    // $firstLi.find('i.icon, div.icon-wrap').on('mouseenter', function (e) {
    // $this = $(this);
    // $menuWrappers.hide(0);
    // });

    // $firstLi.last().on('mouseleave', function (e) {
    // //-- when mouse is left at bottom end
    // if (e.pageY.toFixed() > $(this).offset().top.toFixed())
    // //$this.trigger("click", true);
    // $firstLi.eq(lastLiIndex).trigger("click", true);
    // });

    //dualPaneHeight();
    //setColumnsH();
}

function contentHeaderWidth()
{
}

function setColumnsH() {
    $headerHeight = $("header").outerHeight(true);
    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $breadcrumbWrap = 10;
        $("footer").css("margin-top", "0px");
    } else {
        $breadcrumbWrap = $(".breadcrumb-wrap").outerHeight(true);
    }

    $winWidth = $(window).width(),
            $rightOne = $("div.display-wrapper"),
            $leftOne = $("div.main"),
            $sidebar = $(".sidebar-wrapper"),
            $sidebarWrap = $(".sidebar_wrap"),
            $contentWrap = $('.content-wrapper-new');
    $availHeight = window.innerHeight - ($headerHeight + 1);


    var availheader = $('.edtHeader').outerHeight();
    var availColumn = 0;

    if ($('.edtColumns').css('display') == 'block') {
        availColumn = $('.edtColumns').outerHeight();
    }

    var sideWidth = $(".sidebar_wrap").outerWidth(),
            actionWrap = $(".user-action-wrap").outerWidth(),
            totalActionWidth = sideWidth + actionWrap;




    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $breadcrumbWrap = 10;
        $('.DocInsideHig').css({height: $availHeight - availheader - availColumn - $breadcrumbWrap});

        $('.doc-tollbar-wrap > .tab-pane').css({height: $availHeight - 28 - $breadcrumbWrap});
        $('.sidebar_wrap .menu-wrapper').css({height: $availHeight - $breadcrumbWrap});
        $('.user-action-wrap').css({height: $availHeight - $breadcrumbWrap});
        $sidebarWrap.height($availHeight - $breadcrumbWrap);
        $('.set-height').height($availHeight - $breadcrumbWrap);
        $('.content-wrapper-new').css("height", ($availHeight - $breadcrumbWrap));
        $('.sidebar_wrap .menu-wrapper').find('ul.menu-items:not(._sub-menu)').css({
            minHeight: $availHeight - $breadcrumbWrap
        });
        $('.fixed-calender-icon .icon-wrap').css('bottom', '59px');
        $('.fixed-search-icon .icon-wrap').css('bottom', '10px');

    } else {
        $breadcrumbWrap = 51;
        $('.DocInsideHig').css({height: $availHeight - availheader - availColumn - $breadcrumbWrap});

        $('.doc-tollbar-wrap > .tab-pane').css({height: $availHeight - 28 - $breadcrumbWrap});
        $('.sidebar_wrap .menu-wrapper').css({height: $availHeight - $breadcrumbWrap});
        $('.user-action-wrap').css({height: $availHeight - $breadcrumbWrap});
        $sidebarWrap.height($availHeight - $breadcrumbWrap);
        $('.set-height').height($availHeight - $breadcrumbWrap);
        $('.content-wrapper-new').css("height", ($availHeight - $breadcrumbWrap));
        $('.sidebar_wrap .menu-wrapper').find('ul.menu-items:not(._sub-menu)').css({
            minHeight: $availHeight - $breadcrumbWrap
        });
        $('.fixed-calender-icon .icon-wrap').css('bottom', '98px');
        $('.fixed-search-icon .icon-wrap').css('bottom', '49px');
    }
    //---- Container width in workspace page
    $('.content-wrapper-new').css("width", ($winWidth - totalActionWidth));

}


function EditorHT(state) {
    setTimeout(function(){
        // console.log(state)
        $headerHeight = $("header").outerHeight(true);

        $availHeight = window.innerHeight - ($headerHeight + 1);

        var availheader = $('.edtHeader').outerHeight();
        var availColumn = 0;

        if ($('.edtColumns').css('display') == 'block') {
            availColumn = $('.edtColumns').outerHeight();
        }


        var chatHeader  =   $('.existing-dialogue-block-head').outerHeight() + $('.unread-msg-box').outerHeight();
        var chatMsg     =   $('.existWrapperMsg').outerHeight();
        var dialogue_and_default_height = $("#course-dialogue-view").outerHeight();

        if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
            $breadcrumbWrap = 10;
            if(state){
                $('.document-pane').css({height: $availHeight - availheader - availColumn - $breadcrumbWrap - chatHeader - chatMsg - dialogue_and_default_height - 1});
            }
            else{
                $('.document-pane').css({height: $availHeight - availheader - $breadcrumbWrap - chatHeader - 1 - dialogue_and_default_height});
            }

        }
        else {
            $breadcrumbWrap = 51;
            // if(state){
            //     $('.document-pane').css({height: $availHeight - availheader - availColumn - $breadcrumbWrap - chatHeader - chatMsg - 1 - dialogue_and_default_height});
            // }
            // else{
            //     $('.document-pane').css({height: $availHeight - availheader - $breadcrumbWrap - chatHeader - 1 - dialogue_and_default_height});
            // }
        }

    }, 100);
}

function initialLoad() {
    TotalDashboardWidth = $(".dashboard").width() - Math.abs(parseInt($(".dashboard").css("margin-left")));
    TotalDashboardWidth = Math.abs(TotalDashboardWidth);
    splitDashboardWidth = TotalDashboardWidth / 2;
    subDashboardWidth = splitDashboardWidth * $(".active .dashSlider").length;
    $(".pui_center_content .total-width-pane").width(subDashboardWidth);

    $(".pui_center_content .dashSlider").outerWidth(splitDashboardWidth);
    $(".nextShow").removeClass('disabled');
    $(".prevShow").addClass('disabled');
    var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
    $(".image-slider").width(totalwidth);
}

function GoTo(num)
{
    currentNode = 0;
    var getNum = Math.abs(num - currentNode);
    var calculateWidth = getNum * splitDashboardWidth;
    if (currentNode < num) {
        $(".dashboard").animate({"margin-left": '-=' + calculateWidth});
        currentNode = parseInt(num); // 2 + 1
        $(".dashSlider ").removeClass("active");
        $(".dashSlider ").eq(currentNode).addClass("active");
        $(".dashSlider ").eq(currentNode + 1).addClass("active");
        var firstNodewidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
        $(".breadcrumb-wrap li").removeClass("active");
        $(".breadcrumb-wrap li").eq(currentNode).addClass("active");
        $(".breadcrumb-wrap li").eq(currentNode + 1).addClass("active");
        $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
        $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
        var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth()
        $(".image-slider").css("width", totalwidth);
        $(".image-slider").animate({
            'marginLeft': '+=' + firstNodewidth
        }, 200);
    }
    else if (getNum != 0) {
        $(".dashboard").animate({"margin-left": '+=' + calculateWidth});
        currentNode = parseInt(num);
        $(".dashSlider ").removeClass("active");
        $(".dashSlider ").eq(currentNode).addClass("active");
        $(".dashSlider ").eq(currentNode + 1).addClass("active");
    }



    if (currentNode == $(".active .dashSlider").length - 1) {
        $(".nextShow").addClass('disabled');
        $(".prevShow").removeClass('disabled');
    }
    else {
        $(".nextShow").removeClass('disabled');
        $(".prevShow").removeClass('disabled');
    }
}

/**problem With Closures */
$(document).ready(function () {
    currentNode = 0;
    initialLoad();
    $('body').on('click', '.nextShow', function () {
        //currentNode = $(".active .dashSlider.active").last().index();
        if (currentNode < $(".active .dashSlider").length) {
            $(".dashboard").animate({"margin-left": '-=' + splitDashboardWidth});
            currentNode = currentNode + 1;
            $(".dashSlider ").removeClass("active");
            $(".dashSlider ").eq(currentNode - 1).addClass("active");
            $(".dashSlider ").eq(currentNode).addClass("active");
            var firstNodewidth = $('.breadcrumb li.active').first().outerWidth();
            $(".breadcrumb-wrap li").removeClass("active");
            $(".breadcrumb-wrap li").eq(currentNode).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNode - 1).addClass("active");
            $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
            $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
            var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth()
            $(".image-slider").css("width", totalwidth);
            $(".image-slider").animate({
                'marginLeft': '+=' + firstNodewidth
            }, 200);

        }

        if (currentNode == $(".active .dashSlider").length - 2) {
            $(this).addClass('disabled');
            $(".prevShow").removeClass('disabled');
        }
        else {
            $(this).removeClass('disabled');
            $(".prevShow").removeClass('disabled');
        }
    });

    $('body').on('click', '.prevShow', function () {
        selectedcurrentNode = $(".active .dashSlider.active").first().index();
        if (currentNode >= 0) {
            $(".dashboard").animate({"margin-left": '+=' + splitDashboardWidth});
            currentNode = currentNode - 1; // making it 0
            $(".dashSlider ").removeClass("active");
            $(".dashSlider ").eq(currentNode).addClass("active");
            $(".dashSlider ").eq(currentNode + 1).addClass("active");

            $(".breadcrumb-wrap li").removeClass("active");
            $(".breadcrumb-wrap li").eq(currentNode).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNode + 1).addClass("active");
            var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
            $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
            $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
            $(".image-slider").css("width", totalwidth);
            var lastNodewidth = $('.breadcrumb li.active').first().outerWidth();

            $(".image-slider").animate({
                'marginLeft': '-=' + lastNodewidth
            }, 500);

        }
        if (currentNode == 0) {
            $(this).addClass('disabled');
            $(".image-slider").css("width", totalwidth + 5);
            $(".nextShow").removeClass('disabled');
        }
        else {
            $(this).removeClass('disabled');
            $(".nextShow").removeClass('disabled');
        }
    });

    $('body').on('click', '.breadcrumb-wrap li', function () {
        SelectedCurrentTabNode = $(this).index() - 1;
        if ($(".image-slider a").length > 2) {
            $(".image-slider a:last").remove();
        }
        var tempControler = $("#tempControler").val();
        var tempAction = $("#tempAction").val();
        if (tempControler == 'menudashboard' && tempAction == 'index') {
            menuDashboardBack();
        }
        breadCrumbSelection(SelectedCurrentTabNode);
    });

    $('.breadcrumb-down').click(function (e) {
        $(".breadcrumb-wrap").addClass('breadcrumb-up');
        $headerHeight = $("header").outerHeight(true);
        $availHeight = window.innerHeight - ($headerHeight + 10);
        $('.sidebar_wrap .menu-wrapper').animate({'height': $availHeight}, 'fast');
        $('.user-action-wrap').animate({'height': $availHeight}, 'fast');
        $(".sidebar_wrap").animate({'height': $availHeight}, 'fast');
        $('.content-wrapper-new').animate({'height': $availHeight}, 'fast');
        $('.set-height').animate({'height': $availHeight}, 'fast');
        var getHT = $(window).height();
        $('.edtTaggedFields').height(getHT - 130 - 10 - $('.header-stick-top').outerHeight());

        setWidthInitialy();
        flyoutUserSupportChatExpand();
        setColumnsH();
        setHeightThreePane();
        dualPaneHeight();
        sideFlyoutHeight();
        calculateTotalHeightRadioTable();
        setDocHig();


        $('.breadcrumb-down').hide();
        if ($("#menudashboard").css('display') == 'block') {
            dashboardInitalLoad();
          //  defaultOpenNewCourseDialogBox(true);
            // newCourseDialogueDefault();

        }
        manageDialogueHT();
        e.stopPropagation();

    });

    // $('body').off('click', 'footer').on('click', 'footer', function (e) {
    //     $headerHeight = $("header").outerHeight(true);
    //     $breadcrumbWrap = $(".breadcrumb-wrap").outerHeight(true);
    //     var footerHig = $('.breadcrumb-wrap').outerHeight();
    //     $availHeight = window.innerHeight - ($headerHeight + $breadcrumbWrap + 1);
    //     $('.sidebar_wrap .menu-wrapper').animate({'height': $availHeight}, 'fast');
    //     $('.user-action-wrap').animate({'height': $availHeight}, 'fast');
    //     $(".sidebar_wrap").animate({'height': $availHeight}, 'fast');
    //     $('.content-wrapper-new').animate({'height': $availHeight}, 'fast');
    //     $('.set-height').animate({'height': $availHeight}, 'fast');
    //     var getHT = $(window).height();
    //     $('.edtTaggedFields').height(getHT - 130 - $('.breadcrumb-wrap').outerHeight() - $('.header-stick-top').outerHeight());
    //     setTimeout(function () {
    //         AddUserEntry()
    //     }, 100);
    //     if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
    //         $(".breadcrumb-wrap").removeClass('breadcrumb-up');
    //         setWidthInitialy();
    //         flyoutUserSupportChatCollapse();
    //
    //         setHeightThreePane();
    //         $('.breadcrumb-down').show();
    //     }
    //
    //     dualPaneHeight();
    //     setColumnsH();
    //     sideFlyoutHeight();
    //     if ($("#menudashboard").css('display') == 'block') {
    //         dashboardInitalLoad();
    //     }
    //     manageDialogueHT();
    //
    //     e.stopPropagation();
    // });

    /***************** pagination-toggle ********************/
    $('.btn-toggle').click(function () {
        $(this).find('.btn').toggleClass('active');

        if ($(this).find('.btn-primary').size() > 0) {
            $(this).find('.btn').toggleClass('btn-primary');
        }
        if ($(this).find('.btn-danger').size() > 0) {
            $(this).find('.btn').toggleClass('btn-danger');
        }
        if ($(this).find('.btn-success').size() > 0) {
            $(this).find('.btn').toggleClass('btn-success');
        }


        $(this).find('.btn').toggleClass('btn-default');
    });

    $('form').submit(function () {
        return false;
    });

    /***************** pagination-toggle ********************/
    // code for highlightingof table row using checkbox
    $(".iCheck-helper").click(function (e) {
        var id = e.toElement.parentNode.firstChild.className;
        var isChecked = $('.' + id).is(':checked');
        if (isChecked)
        {
            $(this).prev().closest('tr').css('background', 'red');
        } else {
            $(this).prev().closest('tr').css('background', 'yellow');
        }
    });


    $('body').on('click', '.first-level-menu .strat_click', function (e) {

        var courseNotificationPanel = $(".courseNotification-panel");
        if(courseNotificationPanel.hasClass('show')){
            courseNotificationPanel.removeClass('show');
        }
        var _this = $(this);
        var originalTitle = $(this).data('originalTitle');

        if(originalTitle) {
            if(originalTitle.toLowerCase() == 'new course') {
                return true;
            }
            if(originalTitle.toLowerCase() == 'store') {
                toggleSubscribedApp(this, 0, {is_shortcut_menu: 0, originalTitle: originalTitle});
                return false;
            }
            if(originalTitle.toLowerCase() == 'my courses') {
                toggleSubscribedApp(this, 1, {is_shortcut_menu: 0, originalTitle: originalTitle});
                return false;
            }

            if(originalTitle.toLowerCase() == 'add group') {
                toggleSubscribedApp(this, 1, {is_shortcut_menu: 0, originalTitle: originalTitle});
                return false;
            }
        }
        var id = $(this).closest('.first-level-menu').attr('id');
        var ids = id.split("_");


        $(".nextPrevButton").addClass('hide');

        $(".sidebar_wrap").removeClass('flyout-menu');

        setTimeout(function(){
           setColumnsH();
        },1000);
        if($(this).data('href')){
            window.history.pushState("","", $(this).data('href'));
        }

        if (ids[1] == 'classes')
        {
            $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
            $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
            $('.loadder').hide();
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
        }
        else if (ids[1] == marketMenuName.toLowerCase())
        {
            $(".sidebar_wrap").addClass('flyout-menu');
            NProgress.start();
            if(hitName == '')
            {
                $("#tempControler").attr('value', 'store');
                $("#tempAction").attr('value', 'market');
                $.post(domainUrl + 'store/market', {}, responseCallAction, 'html');
                var targetAnchor = $("#marketplace-nav").find('a[data-original-title="Store"]');
                toggleSubscribedApp(targetAnchor, 0, {is_shortcut_menu: 0, originalTitle: 'Store', ignore_click: 1})
            }
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }
        else if (ids[1] == organizationMenuName.toLowerCase())
        {
            if(hitName == '')
            {
                $("#tempControler").attr('value', 'group');
                $("#tempAction").attr('value', 'index');
                $.post(domainUrl + 'group/index', {}, responseCallAction, 'html');
            }
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }
        else if (ids[1] == inboxMenuName.toLowerCase())
        {
            $(".sidebar_wrap").addClass('flyout-menu');
            NProgress.start();
            hideFlyout();
            //Reset Search Field, remove it when left menu handle by react
            $('.search-item-wrap #inbox_search_id').val('');
            if($(this).text().trim().toLowerCase() == inboxMenuName.toLowerCase()){
                // Remove inactive class from left menu add new course when dashboard is clicked
                $('.Newcourse_li').removeClass('inactive');
                // Remove active class from left menu when dashboard is clicked
                $('.menu-items li.selectlist').find('ul.item-list').find('.my-profile.active').removeClass('active');
            }

            if (hitName != 'Newcourse')
            {
                $("#tempControler").attr('value', 'menudashboard');
                $("#tempAction").attr('value', 'index');
                var params = {'mode': '0', 'setUserID': setUserID};

                var viewTypes = ['bycourse', 'bydialogue', 'byactor'];
                if($(this).data('originalTitle')) {
                    var name = $(this).data('originalTitle').replace(/\s+/g, '').toLowerCase();
                    if(viewTypes.indexOf(name) > -1) {
                        params.view_type = name.toLowerCase();
                    }
                }
                $.post(domainUrl + 'menudashboard/index', params, responseCallAction, 'html');

            }
        }
        /*else if (ids[1] == dashboardMenuName.toLowerCase())
        {
            return false;

            NProgress.start();
            $("#tempControler").attr('value', 'dashboard');
            $("#tempAction").attr('value', 'index');
            $.post(domainUrl + 'board/index', {'setUserID' : setUserID}, responseCallAction, 'html');
            //$.post(domainUrl + 'email/submenu', {'setUserID' : setUserID}, responseEmailSubMenuAction, 'html');
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }*/
        else if (ids[1] == 'resources')
        {
            if (hitName == '') {
                $('.content-wrapper-new').siblings('.user-action-wrap').hide();
                $("#center-screen").hide();
                $("#ControlBar").hide();
                $('#menudashboard').hide();
                $('#calender-screen').hide();
                $("#actors-screen").hide();
                $("#market-screen").hide();
                $("#documents-screen").hide();
                $("#canvas-screen").html('');
                $("#canvas-screen").hide();
                $('.pui_center_content').hide();
                $("#main-screen").hide();
                // $(".NewDocument_li").hide();
                //$(".OpenDocument_li").hide();
                $("#folderList_action_menu").show();
                NProgress.start();
                $("#tempControler").attr('value', 'documents');
                $("#tempAction").attr('value', 'folderList');

                $.post(domainUrl + 'documents/folderList', {'order_by': 'sequence', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal'}, responseCallAction, 'html');
                $('#folderList_action_menu').show();
                //$("#documents-screen").html('');
                $(".NewFolder_li").show();
                $(".DeleteFolder_li").show();
                $(".NewDocument_li").hide();
                $(".OpenDocument_li").hide();
                hideFlyout();

            }

            if (hitName == 'NewDocument')
            {
                //NProgress.start();
                /*$("#tempControler").attr('value','documents');
                 $("#tempAction").attr('value','index');
                 $.post(domainUrl+'documents/index',{},responseCallAction,'html');*/
                $('#newDocumentFlyout').animate({right: '0'}, 300, function () {
                }).addClass('in');
                $('#newDocumentFlyout #File').addClass('in');
                $('.ref-hideTollbar').trigger('click');
                $.post(domainUrl + 'documents/fileHelper', {}, responseFileHelper1, 'html');
                $('.loadder').show();
                $("#document_title").val("");
                globalTitle = "";
                $('#document_action_menu').show();
                $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
                $('body').on('keyup', '#document_title', function () {
                    if ($(this).val().length < 51) {
                        var getCount = $(this).val().length;
                        $(this).siblings('.char-limit').find('.charCount').text(getCount);
                    }
                });
            }
            else if (hitName == 'OpenDocument') {
                $("#tempControler").attr('value', 'documents');
                $("#tempAction").attr('value', 'index');
                $('.ref-hideTollbar').trigger('click');
            }

            else if (hitName == 'NewFolder') {
                $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
                $('.loadder').hide();
                $('#createNewFolder input').val("");
                $('.charCount').text(0);
                $('#createNewFolder').modal('show');
                // $('.ref-hideTollbar').trigger('click');
                $("#createNewFolder").on('shown.bs.modal', function () {
                    $(this).find('input[type="text"]').focus();
                    $(this).find('.common_name_folder_first').addClass('inactiveLink');
                });

                $('body').on('keyup', '#Folder_name', function () {
                    if ($(this).val().length > 0 && $.trim($(this).val()) != "") {
                        $("#createNewFolder .btn ").removeClass("inactiveLink");
                    } else {
                        $("#createNewFolder .btn").first().addClass("inactiveLink");
                    }

                    if ($(this).val().length < 51) {
                        var getCount = $(this).val().length;
                        $(this).siblings('.char-limit').find('.charCount').text(getCount);
                    }
                });


            }
        }
        else if (ids[1] == 'calendar')
        {
            $("#tempControler").attr('value', 'calendar');
            $("#tempAction").attr('value', 'index');
            NProgress.start();
            $.post(domainUrl + 'calendar/index', {}, responseCallAction, 'html');
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }
        else if (ids[1] == 'actors')
        {
            NProgress.start();
            $("#tempControler").attr('value', 'actors');
            $("#tempAction").attr('value', 'index');
            $.post(domainUrl + 'actors/index', {}, responseCallAction, 'html');
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }
        else if (ids[1] == 'email')
        {
            NProgress.start();
            $("#tempControler").attr('value', 'email');
            $("#tempAction").attr('value', 'index');
            $.post(domainUrl + 'email/index', {'email_node_id':	'2299928'}, responseCallAction, 'html');
            //$.post(domainUrl + 'email/submenu', {'setUserID' : setUserID}, responseEmailSubMenuAction, 'html');
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
            hideFlyout();
        }
        else if (ids[1] == 'actors2')
        {
            $("#tempControler").attr('value', 'testing');
            $("#tempAction").attr('value', 'index');
            NProgress.start();
            $.post(domainUrl + 'testing/index', {}, responseCallAction, 'html');
        }
        else if (ids[1] == 'grid')
        {
            $(".pui_center_content").hide();
            $('#menudashboard').hide();
            $("#actors-screen").hide();
            $("#market-screen").hide();
            $("#documents-screen").hide();
            $("#canvas-screen").html('');
            $("#canvas-screen").hide();
            $("#main-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $('.loadder').hide();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            hideFlyout();
            $("#process_action_menu").show();
        }
        else if (ids[1] == 'association')
        {
            $(".pui_center_content").hide();
            $('#menudashboard').hide();
            $("#actors-screen").hide();
            $("#documents-screen").hide();
            $("#market-screen").hide();
            $("#canvas-screen").html('');
            $("#canvas-screen").hide();
            $("#main-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $('.loadder').hide();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            hideFlyout();
            $("#association_action_menu").show();
        }
        else if (ids[1] == 'accounting')
        {
            $(".pui_center_content").hide();
            $('#menudashboard').hide();
            $("#actors-screen").hide();
            $("#documents-screen").hide();
            $("#canvas-screen").html('');
            $("#canvas-screen").hide();
            $("#main-screen").hide();
            $("#market-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $('.loadder').hide();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#accounts_action_menu").show();
            hideFlyout();
        }
        else if (ids[1] == 'dialogue')
        {
            $(".pui_center_content").hide();
            $('#menudashboard').hide();
            $("#actors-screen").hide();
            $("#documents-screen").hide();
            $("#canvas-screen").html('');
            $("#canvas-screen").hide();
            $("#main-screen").hide();
            $("#market-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $('.loadder').hide();
            /* Right Menu Icons Manage*/
            $('.content-wrapper-new').siblings('.user-action-wrap').hide();
            $("#dialogue_action_menu").show();
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
        }
        else if (ids[1] == 'course')
        {
            if (hitName == '') {
                // debugger;
                $("#center-screen").hide();
                $("#ControlBar").hide();
                $('#menudashboard').hide();
                $('#calender-screen').hide();
                $("#actors-screen").hide();
                $("#documents-screen").hide();
                $("#canvas-screen").html('');
                $("#canvas-screen").hide();
                $('.pui_center_content').hide();
                $("#market-screen").hide();
                $("#main-screen").show();
                $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
                $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
                $('.content-wrapper-new').siblings('.user-action-wrap').hide();
                $('#blank_course_action_menu').show();
                hideFlyout();
                $('.loadder').hide();

            }

            $('#course-path-number').addClass('inactive');
            if ($('#openCourseFlyout').hasClass('in')) {
                $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
            }
            if ($('#newDocumentFlyout').hasClass('in')) {
                $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
            }
            if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
                $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
            }
        }
        else
        {
            $(".pui_center_content").hide();
            $('#menudashboard').hide();
            $("#actors-screen").hide();
            $("#documents-screen").hide();
            $("#canvas-screen").html('');
            $("#canvas-screen").hide();
            $("#main-screen").hide();
            $("#email-screen").hide();
            $("#market-screen").hide();
            $("#organization-screen").hide();
            $("#center-screen").show();
            $("#ControlBar").show();
            $('.loadder').hide();
        }
    });


    $('body').on('click', '#116_resources .icon-wrap', function (e) {
        if ($('#openCourseFlyout').hasClass('in')) {
            $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
        }

        if ($('#newDocumentFlyout').hasClass('in')) {
            $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
        }

        if ($('#courseTemplateFlyout.right-popup').hasClass('in')) {
            $('#courseTemplateFlyout.right-popup').animate({left: 0}, 300).removeClass('in');
        }

        /*
         * Added By: Divya Rajput
         * On date: 27th May 2016
         * Purpose: to remove localStorage variable data
         */
        localStorage.removeItem('resourcedata');
        localStorage.removeItem('loaddocument');
        /*End Here*/
    });


    $('body').on('click', '.non-ins', function () {
        var is_instance = $("#is_instance").val();
        if (is_instance == 'Y')
        {
            $(".AddNewInstance_li").hide();
            $(".ExportInstanceData_li").hide();
            $(".GenerateInstanceTemplate_li").hide();
            $(".ImportInstanceData_li").hide();
            $(".AddNewClass_li").show();

            setTimeout('setInstanceAgain()', 1000);
        }
        manageNodeXIcon();
        removeNodeXpane();
    });
});

function nextNew()
{
    var is_instance = $("#is_instance").val();
    if (is_instance == 'Y')
    {
        $(".AddNewInstance_li").hide();
        $(".ExportInstanceData_li").hide();
        $(".GenerateInstanceTemplate_li").hide();
        $(".ImportInstanceData_li").hide();
        $(".AddNewClass_li").show();
        setTimeout('setInstanceAgain()', 1000);
    }
}

function setInstanceAgain()
{
    $("#is_instance").attr('value', 'N');
    $(".ins").remove();
    setWidth();
    manageRightMenuIcon('listing', 'classes');
    initialLoad();
    // breadCrumbSelection(SelectedCurrentTabNode);
}

/*===============anjali work strat from here====================*/
/*===============calculate width & height of dialogue flyout====================*/
function DialogueFlyout() {
    var headerHig = $('.header-wrapper').height();
    var footerHig = $('footer').height();
    var windowHig = $(window).height();
    var windowWid = $(window).width();
    var DialogWid = $('#dialogueFlyout').outerWidth();
    var commentBox = $('.dialogue-txt-comment').outerHeight();
    var leftPanel = $('.left-dialogue-panel').outerWidth();
    var rightPanel = $('.user-tab-node').outerWidth();
    var searchsection = 51;
    var tabHeight = $(".right-bar-tab ul li").outerHeight();

    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $('#dialogueFlyout').css('height', windowHig - headerHig - 10);
        $('#helpnodeFlyout').css('height', windowHig - headerHig - 10);
        $('#dialogueFlyout').css('width', windowWid / 2 + 215);
        $('.dialogueFlyout .setDialogueHeight').css('height', windowHig - headerHig - tabHeight - 10);
        $('.helpnodeFlyoutmodal .setDialogueHeight').css('height', windowHig - headerHig - searchsection - 10);
        $('.dialogue-listing').css('height', windowHig - headerHig - tabHeight - commentBox - 10);
    } else {
        $('#dialogueFlyout').css('height', windowHig - headerHig - footerHig);
        $('#helpnodeFlyout').css('height', windowHig - headerHig - footerHig);
        $('#dialogueFlyout').css('width', windowWid / 2 + 215);
        $('.dialogueFlyout .setDialogueHeight').css('height', windowHig - headerHig - tabHeight - footerHig);
        $('.helpnodeFlyoutmodal .setDialogueHeight').css('height', windowHig - headerHig - searchsection - footerHig);
        $('.dialogue-listing').css('height', windowHig - headerHig - tabHeight - commentBox - footerHig);
    }


    var totalPanelWidth = DialogWid - leftPanel - rightPanel;
    $('.center-dialogue-panel').css('width', totalPanelWidth - 3);
    $(".nano").nanoScroller();

}

/*===============Open filer dropdown====================*/
$('body').off('click', '.filter-menu .open-filter-menu').on('click', '.filter-menu .open-filter-menu', function (event) {

    if ($(this).siblings('ul').hasClass('show'))
    {
        $(this).removeClass('active').siblings('ul').removeClass('show');
    }
    else
    {
        $('.open-filter-menu').siblings('ul').removeClass('show');
        $('.open-filter-menu').removeClass('active');
        $('.open-filter-menu').parent('th').siblings('th').children('ul').removeClass('show');
        $('.open-filter-menu').parent('th').siblings('th').children('span').removeClass('active');
        $(this).addClass('active').siblings('ul').addClass('show');
    }
    event.stopPropagation();
});

$('body').off('click', '.filter-menu ul.multi-menu > li').on('click', '.filter-menu ul.multi-menu > li', function (event) {
    if (!($(this).hasClass('parent-item'))) {
        $('ul.multi-menu ul.show-sub-child').remove();
        $(this).siblings('.search-item-wrap').hide();
        $(this).siblings('li').removeClass('active');
        $(this).siblings('li').find('li').removeClass('active');
        $(this).addClass('active');
        event.stopPropagation();
    }
});

$('body').off('click', '.filter-menu ul.multi-menu li li').on('click', '.filter-menu ul.multi-menu li li', function (event) {
    var self = $(this)
    var getData = $(this).html();
    $(this).siblings('li').removeClass('active');
    $(this).closest('li.parent-item').siblings('li').removeClass('active');
    $(this).addClass('active');
    $(this).closest('li.parent-item').addClass('active');
    $(this).closest('li.parent-item').siblings('ul.show-sub-child').remove();
    $(this).closest('li.parent-item').after('<ul class="show-sub-child"><li>' + getData + '</li></ul>').addClass('active');
    $(this).closest('li.parent-item').siblings('.search-item-wrap').show(0, function () {
        self.closest('ul.dropdown-menu.multi-menu.show').find('input').focus();
    });


    event.stopPropagation();
});

$('body').off('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap').on('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap', function (event) {
    event.stopPropagation();
});

$('body, .entr-filter').on('click', function () {
    if ($('.filter-menu ul.multi-menu').hasClass('show')) {
        $('.filter-menu ul.multi-menu ').removeClass('show');
        $('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
    }
});

$('body').off('click', '.filter-menu input[data-save]').on('keypress', '.filter-menu input[data-save]', function (e) {
    var getValue = $(this).data('save');
    if (e.which == 13) {
        $('.' + getValue).closest('.filter-menu ul.multi-menu ').removeClass('show');
        $('.' + getValue).closest('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
    }
});



$('body').off('click', '.filterDrp > span').on('click', '.filterDrp > span', function (event) {
    if ($(this).siblings('ul').hasClass('show'))
    {
        $(this).removeClass('active').siblings('ul').removeClass('show');
    }
    else
    {
        $('.filterDrp > span').siblings('ul').removeClass('show');
        $('.filterDrp > span').removeClass('active');
        $('.filterDrp > span').parent('th').siblings('th').children('ul').removeClass('show');
        $('.filterDrp > span').parent('th').siblings('th').children('span').removeClass('active');
        $(this).addClass('active').siblings('ul').addClass('show');
    }
    event.stopPropagation();
});



$('body').off('click', 'ul.multi-menu > li').on('click', 'ul.multi-menu > li', function (event) {
    if (!($(this).hasClass('parent-item'))) {
        $('ul.multi-menu ul.show-sub-child').remove();
        $(this).siblings('.search-item-wrap').hide();
        $(this).siblings('li').removeClass('active');
        $(this).siblings('li').find('li').removeClass('active');
        $(this).addClass('active');
        //event.stopPropagation();
    }
});

// This line of code used for temp we will remove it later
//  if(!$('#'+inboxMenuId+'_'+inboxMenuName.toLowerCase()).hasClass('_active'))

$('body').off('click', 'ul.multi-menu li li').on('click', 'ul.multi-menu li li', function (event) {
    var self = $(this)
    var getData = $(this).html();
    $(this).siblings('li').removeClass('active');
    $(this).closest('li.parent-item').siblings('li').removeClass('active');
    $(this).addClass('active');
    $(this).closest('li.parent-item').addClass('active');
    $(this).closest('li.parent-item').siblings('ul.show-sub-child').remove();
    if(!$('#'+inboxMenuId+'_'+inboxMenuName.toLowerCase()).hasClass('_active'))
      $(this).closest('li.parent-item').after('<ul class="show-sub-child"><li>' + getData + '</li></ul>').addClass('active');
    $(this).closest('li.parent-item').siblings('.search-item-wrap').show(0, function () {
        self.closest('ul.dropdown-menu.multi-menu.show').find('input').focus();

    });
    if(!$('#'+inboxMenuId+'_'+inboxMenuName.toLowerCase()).hasClass('_active'))
      event.stopPropagation();
});

$('body').off('click', '.show-sub-child, .search-item-wrap').on('click', '.show-sub-child, .search-item-wrap', function (event) {
    if(!$('#'+inboxMenuId+'_'+inboxMenuName.toLowerCase()).hasClass('_active'))
        event.stopPropagation();
});

$('body').off('click.filter_drop').on('click.filter_drop', function () {
    if(!$('#'+inboxMenuId+'_'+inboxMenuName.toLowerCase()).hasClass('_active'))
      $('ul.multi-menu ').removeClass('show');

    $('ul.multi-menu ').siblings('span').removeClass('active');
    var getInstanceWidth = $('.listing-wrapper').filter('.active').width(); //$('.listing-wrapper').width();
    if ($.trim($('.listing-wrapper').filter('.active').find('.list-row td').text()) !== "No Instance Found") {
        $('#first_instance_div table').width(getInstanceWidth);
    }
});


$('body').off('click', '.search-item-wrap .leftbar-search-js').on('click', '.search-item-wrap .leftbar-search-js', function () {
    $('#react-button-dashboard-search').trigger('click');
});

$('body').off('keyup', '.search-item-wrap #inbox_search_id').on('keyup', '.search-item-wrap #inbox_search_id', function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        $('#react-button-dashboard-search').trigger('click');
    }
});

function filterDropDown() {


}

/*===============Open search filed in help flyout====================*/
function searchInfo() {
    $('.search-section > .search-icon').click(function () {

        $(this).addClass('hide');
        $(this).siblings('.search-text').removeClass('hide');
        $(this).siblings('.search-detail').addClass('hide');

    });
    $('.search-section  .search-cancel').click(function () {
        $('.search-icon').removeClass('hide');
        $(this).closest('.search-text').addClass('hide');
        $('.search-detail').removeClass('hide');

    });
}

/*================Add title after search input filed===================*/
function contextualSearch() {

    var getTitle = $('.sidebar_wrap ul li._active a').children('span').html();
    $('.sidebar_wrap ul li._active a').parent('.icon-wrap').siblings('.menu-wrapper').find('input').attr('placeholder', 'Search' + ' ' + getTitle);

    $('body').on('click', '.sidebar_wrap ul li a', function () {
        var getTitle = $(this).children('span').html();
        $(this).parent('.icon-wrap').siblings('.menu-wrapper').find('input').attr('placeholder', 'Search' + ' ' + getTitle);
        setTimeout(function () {
            $(".nano").nanoScroller();
            //  var inlineHIg   =   $('.ref-show-inline-wrap').outerHeight();
            //  $('.ref-show-inline-wrap').animate({marginTop:-inlineHIg+"px"});
        }, 500);
    });
}
/*================Show modal after 5 sec===================*/

function showLoginModal() {
    // setTimeout(function(){
    //     $('#loginPopup').modal('show');
    // }, 1000);
}

function dualPaneHeight() {
    var getHeight = $('.set-height').height();
    var topSecHeight = $('.left-head').height();
    var getheadHig = $('.table-head').height();

    midSecDualPaneHeight = getHeight - topSecHeight;
    tableHeight = getHeight - topSecHeight - getheadHig;
    $('.dual-pane-height').height(midSecDualPaneHeight - 1);
    $('.table-height').height(tableHeight);

    var getHeadHig = $('.table-head').outerHeight();
    var getfooterHig = $('.list-bottom').outerHeight();
    var getbottomHig = $('.breadcrumb-wrap').outerHeight();

    $('.set-content-height').height(midSecDualPaneHeight - getHeadHig - getfooterHig);




}

function rightPaneicon() {

    $('body').on('mouseover', '.node-content', function () {
        $(this).find('.node-right').removeClass('hide');

    });
    $('body').on('mouseleave', '.node-content', function () {
        $(this).find('.node-right').addClass('hide');

    });
    $('body').on('click', '.control-btn-wrap a', function () {
        $(this).addClass('active');
        $(this).siblings('a').removeClass('active');

    });
}

function customCheckbox()
{
    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal-grey',
        radioClass: 'iradio_minimal-grey',
        increaseArea: '15%'
    });
}

function threepaneSlide()
{
    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $breadcrumbWrap = 10;
        var windowHeight = $(window).height();
        var headerHeight = $(".header-temp").height();
        var controlBar = $('.threePaneWrapper .control-bar').outerHeight();
        $('.threePaneWrapper.set-height').css("height", (windowHeight - headerHeight - $breadcrumbWrap));
        var threepaneHeight = $('.threePaneWrapper.set-height').height();
        var paneNanoHeight = threepaneHeight - 85;
        $(".three-slide-pane-width").height(paneNanoHeight);

    } else {
        $breadcrumbWrap = 51;
        var windowHeight = $(window).height();
        var footerHight = $(".footer-temp").height();
        var headerHeight = $(".header-temp").height();
        var controlBar = $('.threePaneWrapper .control-bar').outerHeight();
        $('.threePaneWrapper.set-height').css("height", (windowHeight - headerHeight - $breadcrumbWrap));
        var threepaneHeight = $('.threePaneWrapper.set-height').height();
        var paneNanoHeight = threepaneHeight - 85;
        $(".three-slide-pane-width").height(paneNanoHeight);
    }

    var $winWidth = $(window).width();
    var sideWidth = $(".sidebar_wrap").outerWidth();
    var actionWrap = $(".user-action-wrap").outerWidth();

    $(".threePaneWrapper").css("width", $winWidth - (sideWidth) + 1);
    var threePaneWidth = $(".threePaneWrapper").outerWidth();
    var paneSection = threePaneWidth / 3 - 20;
    $(".pane-wrapper").outerWidth(paneSection);

    var paneWrap = $(".pane-wrapper").width();
    $(".threePaneWrapper .three-slide-pane-width").outerWidth(paneWrap);
    var marginTest = $(".threePaneWrapper").outerWidth();


    // if($(window).width() <= 1024){
    //      marginTest1 = 60;
    //      $(".threePaneWrapper").show();
    //       $(".threePaneWrapper").css("margin-right",-marginTest1);
    //  }else{
    //      $(".threePaneWrapper").css("margin-right",-marginTest);
    //  }
}

var timer = 0;
var percentageWidth = $('#progressBar').outerWidth() / 100;
var loaderTimer;
var hasPageLoaded = false;
function timerRun()
{
    $('#progressBar .progress-bar').css("width", timer + "%").attr("aria-valuenow", timer);
    $('#progressBar .progress-number').css("-webkit-transform", "translateX(" + percentageWidth * timer + "px)").attr("aria-valuenow", timer);

    if (timer >= 100 && hasPageLoaded)
    {
        $('#progressBar .progress-bar').css("width", "100%");
        var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
        $(".image-slider").width(totalwidth);
        if(typeof setWidth == 'function') {
            setWidth();
        }
        setColumnsH();
        dualPaneHeight();
        //  customCheckbox();
        //  filterDropDown();
        contextualSearch();
        $(".wel-wrap").hide();
        dashboardInitalLoad();  //commented by Divya As suggested Vaishali
    }
    else
    {
        timer = parseInt(timer) + 10;
        loaderTimer = setTimeout(function () {
            timerRun()
        }, 100);
    }
}

$(".wlcm-table").height($(".wlcm-wrapper").height());

$(document).ready(function () {
    timerRun();
    $('body').on('mousedown', '.strat_click', function (e) {
        $this = $(this);
        if ($(".form_active").is(":visible") == true)
        {
            if ($("#div-node-x").hasClass("active"))
            {
                selectText = $(this).text();
            }
            else
            {
                selectText = '';
            }

            $("#hostory_object").data('id', $this);
            $("#hostory_object").attr('value', $this.attr('strat-id'));
            openConfirmation();
            $this.css("pointer-events", "none");
        } else {
            $('.menu-main-wrap > li a.strat_click:visible').each(function (i, v) {
                if ($(this).css('pointer-events') === "none") {
                    $(this).css({'pointer-events': 'auto'})
                }
            });
        }
        manageNodeXIcon();

    });
    /*to active add new class link*/
    $('body').on('click', '#commonPopupFirst .classes-btn-changes:eq(1)', function () {
        if ($("[data-id^='4_Add']").css('pointer-events') == 'none') {
            $("[data-id^='4_Add']").css({'pointer-events': ''})
        }
    });


    $('body').on('click', '.action-plus', function () {
        var subclassClone = $(this).closest('li').clone();
        $(this).closest('ol').append(subclassClone);
    })
});

function openConfirmation()
{
    $("#exitPopup").modal('show');

}

function checkHistory()
{
    if ($("#tempControler").val() == 'classes' && $("#tempAction").val() == 'addNewClass')
    {
        $(".first_hit").click();
    }

    if ($.trim(selectText) != '')
    {
        $(".breadcrumb-wrap div .breadcrumb li").first().click();
        setTimeout('runAgain();', 1000);
    }

    if ($('#version').find(".Cancel1-icon").is(":not(':hidden')"))
    {
        deleteClassPropertyAgain();
    }
    else
    {
        runAgain();

    }
}

function runAgain()
{
    $(".default_row_class").remove();
    $(".default_row_instance").remove();
    var is_instance = $("#is_instance").val();
    var curobj = $("#hostory_object").data('id');
    var curobjVal = $("#hostory_object").val();
    $("#hostory_object").attr('value', '');
    $('.class-table tr input[type="checkbox"]').removeAttr("disabled", true);

    if (curobj != "")
    {
        if (curobjVal == 'n_ajax')
        {
            callingList(is_instance);
        }
        else if (curobjVal == 'not_ajax')
        {
            callingList(is_instance);
            curobj.click();
        }
        else
        {
            /*Added custom code to fix the three pane slider animation*/
            if ($('#div-node-x-property').hasClass('active')) {
                $('.tooltip-item').hide();
                $('[data-original-title=NodeZ]').show();
                $('[data-original-title=Instance]').show();
                $('[data-original-title=Edit]').show();
                //$.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':1},responseGetNodeX,'html');
                var node_id = $('.node-selected input:visible').val();
                var nodeName = $('#second-class-div').find('div.node-selected .node-input span').html();
                var nodeIsChild = $('#second-class-div').find('div.node-selected .node-circle').hasClass('node-white-circle');
                if ($("#node-x-li a").html() == 'Node X') {
                    $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 1, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
                }
                else {
                    $.post(domainUrl + 'classes/getNodeX', {'node_id': node_id, 'nodeType': $("#node-x-li a").html(), 'mode': 'Display', 'nodeTypeId': 3, 'nodeName': nodeName, 'nodeIsChild': nodeIsChild}, responseGetNodeX, 'html');
                }
                var newValue = $("#node_y_class_id").val()
                $.post(domainUrl + 'classes/classStructure', {'class_id': newValue, 'mode': 'Display'}, responseClassStructure, 'html');
            } else {
                curobj.click();
            }
        }
    }
    else
    {
        callingList(is_instance);
    }
    $(".strat_click").css("pointer-events", "all");
    if (is_instance == 'Y')
    {
        manageRightMenuIcon('listing', 'classes');
    }

    if ($('#div-node-x-property').hasClass('active')) {
    } else {
        removeNodeXpane();
    }
}

function checkHistoryNone()
{
    $(".strat_click").css("pointer-events", "all");
}

function callingList(is_instance)
{
    if (is_instance == 'N')
    {
        $(".first_class_structure").click();
    }
    else
    {
        $(".first_instance_structure").click();
    }
}

function backdropHeight() {
    var windowHeight = $(window).height();
    var footerHight = $(".footer-temp").height();
    var headerHeight = $(".header-temp").height();
    $(".modal-backdrop").css("height", (windowHeight - footerHight - headerHeight));
}

function setHeightThreePane() {

    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $breadcrumbWrap = 10;
        var windowHeight = $(window).height();
        var headerHeight = $(".header-temp").height();
        var controlBar = $(".control-bar").outerHeight();
        $('.threePaneWrapper.set-height').css("height", (windowHeight - headerHeight - $breadcrumbWrap));
        var threepaneHeight = $('.threePaneWrapper.set-height').height();
        var paneNanoHeight = threepaneHeight - 85;
        $(".three-slide-pane-width").height(paneNanoHeight);

    } else {
        $breadcrumbWrap = 51;
        var windowHeight = $(window).height();
        var footerHight = $(".footer-temp").height();
        var headerHeight = $(".header-temp").height();
        var controlBar = $(".control-bar").outerHeight();
        $('.threePaneWrapper.set-height').css("height", (windowHeight - headerHeight - $breadcrumbWrap));
        var threepaneHeight = $('.threePaneWrapper.set-height').height();
        var paneNanoHeight = threepaneHeight - 85;
        $(".three-slide-pane-width").height(paneNanoHeight);
    }
}

function breadCrumbSelection(SelectedCurrentTabNode) {
    if (tempStatus != "")
    {
        $("#sub_nav_39 li").removeClass('active');
        $("#sub_nav_39 ." + tempStatus + "_li").addClass('active');
        tempStatus = '';
    }
    var totalBreadcrumb = $(".breadcrumb-wrap li:visible").length;
    var alreadyselectedNode = $(".breadcrumb-wrap li.active").first().index() - 1;
    $(".breadcrumb-wrap li").removeClass("active");
    var currentNodeTab = parseInt(SelectedCurrentTabNode);
    if (currentNodeTab == 1) {

        $(".dashSlider ").removeClass("active");
        $(".dashSlider ").eq(currentNodeTab - 1).addClass("active");
        $(".dashSlider ").eq(currentNodeTab).addClass("active");
        $(".breadcrumb-wrap li").eq(currentNodeTab - 1).addClass("active");
        $(".breadcrumb-wrap li").eq(currentNodeTab).addClass("active");
        $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
        $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
        var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
        $(".image-slider").css("width", totalwidth);
        var selectedliindex = $(".breadcrumb-wrap li.active").last().index();
        var countwidth = 0;
        $(".breadcrumb-wrap li").each(function (i, v) {
            if (i < selectedliindex - 2) {
                countwidth += $(this).outerWidth()
            }
        });
        $(".image-slider").animate({
            'marginLeft': countwidth
        }, 500);
        $(".dashboard").animate({"margin-left": '0px'});
    } else {
        if (currentNodeTab == totalBreadcrumb - 1) {
            $(".dashSlider ").removeClass("active");
            $(".dashSlider ").eq(currentNodeTab - 1).addClass("active");
            $(".dashSlider ").eq(currentNodeTab).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNodeTab - 1).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNodeTab).addClass("active");
            $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
            $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
            var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
            $(".image-slider").css("width", totalwidth);
            var selectedliindex = $(".breadcrumb-wrap li.active").last().index();
            var countwidth = 0;
            $(".breadcrumb-wrap li").each(function (i, v) {
                if (i < selectedliindex - 2) {
                    countwidth += $(this).outerWidth()
                }
            });
            $(".image-slider").animate({
                'marginLeft': countwidth
            }, 500);
        }
        else
        {
            $(".dashSlider ").removeClass("active");
            $(".dashSlider ").eq(currentNodeTab + 1).addClass("active");
            $(".dashSlider ").eq(currentNodeTab).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNodeTab).addClass("active");
            $(".breadcrumb-wrap li").eq(currentNodeTab + 1).addClass("active");
            $(".image-slider").find('a').first().text($(".breadcrumb-wrap li.active").first('a').text());
            $(".image-slider").find('a').last().text($(".breadcrumb-wrap li.active").last('a').text());
            var totalwidth = $('.breadcrumb li.active').first().outerWidth() + $('.breadcrumb li.active').last().outerWidth();
            $(".image-slider").css("width", totalwidth);
            if (currentNodeTab > alreadyselectedNode)
            {
                var selectedliindex = $(".breadcrumb-wrap li.active").last().index() - 2;
                var countwidth = 0;
                $(".breadcrumb-wrap li").each(function (i, v) {
                    if (i < selectedliindex) {
                        countwidth += $(this).outerWidth()
                    }
                });
                $(".image-slider").animate({
                    'marginLeft': countwidth

                }, 500);
            } else {
                // var selectedli = alreadyselectedNode - ($(".breadcrumb-wrap li.active").first().index()-1);
                var selectedliindex = $(".breadcrumb-wrap li.active").first().index() - 1;
                var countwidth = 0;
                $(".breadcrumb-wrap li").each(function (i, v) {
                    if (i < alreadyselectedNode && i >= selectedliindex) {
                        countwidth += $(this).outerWidth()
                    }
                });
                $(".image-slider").animate({
                    'marginLeft': '-=' + countwidth

                }, 500);
            }
        }


        var currentnode = $(".dashSlider ").filter('.active').last().index();
        var currentmargin = $(".dashboard").css("margin-left");
        if (totalBreadcrumb == currentNodeTab + 1) {
            $(".dashboard").animate({"margin-left": '-' + (currentNodeTab - 1) * splitDashboardWidth});
        } else {
            $(".dashboard").animate({"margin-left": '-' + currentNodeTab * splitDashboardWidth});
        }
    }

    if (currentNodeTab == 0) {
        $(".prevShow").addClass('disabled');
        $(".nextShow").removeClass('disabled');
    } else if (currentNodeTab == $(".active .dashSlider").length - 1) {
        $(".prevShow").removeClass('disabled');
        $(".nextShow").addClass('disabled');
    }
    else if (currentNodeTab + 1 == $(".active .dashSlider").length - 1) {
        $(".prevShow").removeClass('disabled');
        $(".nextShow").addClass('disabled');
    }
    else {
        $("prevShow").removeClass('disabled');
        $(".nextShow").removeClass('disabled');
    }
}

// open threepane modal on click of plus icon
function procesMeterThreePane() {
    // $('body').on('click','.add-three-pane > span', function(e){

    //    $('.threePaneWrapper').show();
    //     if($(window).width() <= 1024){
    //         $('body').addClass('fixedDialogueWindow');

    //         $('.threePaneWrapper').show();
    //     }

    //     var threepanewrapperWidth = $(".threePaneWrapper").outerWidth();
    //     var  actionWrap = $(".user-action-wrap").outerWidth();
    //     var wrappermargin = threepanewrapperWidth + actionWrap;


    //     //$.post(domainUrl+'process/meterThreePane',{},responsemeterThreePane,'html');

    //     if(flag == true){
    //         threepaneSlide();
    //         $(".threePaneWrapper").removeClass('hide');
    //         $(".threePaneWrapper").animate({"margin-right":'+='+wrappermargin});
    //     }
    //     $('.three-pane-close').show();
    //     $('.open-process-meter').show();
    //      flag = false
    //      e.stopPropagation();



    // });
}

function setPaperBckgrnd()
{
    $('.paper-line').scroll(function () {
        $(this).find('li').not('.ui-sortable-placeholder').addClass('paper-line-center-li');
    });
}

/*===============calculate width & height of dialogue flyout====================*/
function flyoutUserSupportChatCollapse() {
    $(".nano").nanoScroller(true);
    var headerHig = $('.header-wrapper').outerHeight();
    var footerHig = $('.breadcrumb-wrap').outerHeight();
    var windowHig = $(window).height();
    var windowWid = $(window).outerWidth();
    var DialogWid = $('.Flyout-Four-Pane').outerWidth();
    var commentBox = $('.dialogue-txt-comment').outerHeight();
    var tabHeight = $(".right-bar-tab").outerHeight();
    var actionWrap = $(".action-wrap").outerHeight();
    var peopleHT = $('.people-individual').outerHeight();
    var midTabSection = $('.dialogue-side-tab').outerHeight();
    var availHeight = windowHig - headerHig - footerHig;

    $('.Flyout-Four-Pane').css('height', availHeight);
    //$('.Flyout-Four-Pane').css('width', totalPanelWidth);

    $('.project-height').height(availHeight - peopleHT);
    $('.user-action-wrap, .close-user-profile-details, .user-profile-details').height(availHeight);
    $('.set-height-dialogue').height(availHeight - (tabHeight + commentBox + actionWrap));
    $('.set-height-tab').height(availHeight - tabHeight - midTabSection);
    $('.set-height-participant').height(availHeight - tabHeight);
}

function flyoutUserSupportChatExpand() {
    $(".nano").nanoScroller(true);
    var $headerHeight = $("header").outerHeight(true);
    var $availHeight = window.innerHeight - ($headerHeight + 10);
    var commentBox = $('.dialogue-txt-comment').outerHeight();
    var tabHeight = $(".right-bar-tab").outerHeight();
    var actionWrap = $(".action-wrap").outerHeight();
    var footerHig = $('.breadcrumb-wrap').outerHeight();


    $('.Flyout-Four-Pane').css('height', $availHeight);
    $('.user-action-wrap, .close-user-profile-details, .user-profile-details').height($availHeight);

    $('.set-height-dialogue').height($availHeight - (tabHeight + commentBox + actionWrap));
    //$('.action-wrap').css('bottom', 10)
    $('.set-height-tab').height($availHeight - tabHeight);
}

//to rename title
function renameTitle() {
    $('i').tooltip();
    $('.rename-title').click(function (event) {
        $(this).addClass('hide');
        $(this).siblings('.edit-rename-title').removeClass('hide');
        event.stopPropagation()
    });
    $('.edit-rename-title i').click(function (event) {
        $(this).closest('.edit-rename-title').siblings('.rename-title').removeClass('hide');
        $(this).closest('.edit-rename-title').addClass('hide');
        event.stopPropagation()
    });
}

// code for right click context menu
function contextMenuDropDown() {
    var $contextMenubar = $('#generalContextMenubar');
    $('body').on("contextmenu", '.right-drp', function (e) {
        $contextMenubar.css({
            display: "block",
            left: e.pageX,
            top: e.pageY,
        });
        return false;
    });

    var $classcontextMenubar = $('#printContextMenubar');
    $('body').on("contextmenu", '.print-drp', function (e) {
        $classcontextMenubar.css({
            display: "block",
            left: e.pageX,
            top: e.pageY,
        });
        return false;
    });

    $('.set-height-tab').on('update', function () {
        $('#generalContextMenubar').hide();
        $('#printContextMenubar').hide();
    });
    $contextMenubar.on("click", "a", function () {
        $('#generalContextMenubar').hide();
        $('#printContextMenubar').hide();
    });
    $('body').click(function () {
        $('#generalContextMenubar').hide();
        $('#printContextMenubar').hide();
    });
}

// user profile section slide when click on view profile
function viewUserProfile() {
    $(".view-user-profile").click(function () {
        $(".user-profile-tab").removeClass("hide");

        if ($('.people-project').hasClass('course-pin-wrap')) {
            $(".user-profile-tab").animate({"right": "0"}, 300, function () {
                $(".nano").nanoScroller();
            });
        }
        else {
            $(".people-project").animate({"right": "0"}, 300, function () {
                $(".people-project").addClass("hide");
            });
            $(".user-profile-tab").animate({"right": "-270"}, 300, function () {
                $(".nano").nanoScroller();
            });
        }

    });

    $(".close-profile-panel").click(function () {
        if ($('.people-project').hasClass('course-pin-wrap')) {
            $(".user-profile-tab").animate({"right": "270px"}, 300, function () {
                $(".user-profile-tab").addClass("hide");
            });
        }
        else {
            $(".user-profile-tab").animate({"right": "-1px"}, 300, function () {
                $(".user-profile-tab").addClass("hide");
            });
        }

    });
}

function addparticipants() {

    var participantPanHig = $(".participant-panel").outerHeight();
    $(".participant-panel").css('top', -participantPanHig)
    $('.add-participants').click(function (event) {
        if ($(".participant-panel").hasClass('opened')) {
            var participantPanHig = $(".participant-panel").outerHeight();
            $(".participant-panel").animate({"top": -participantPanHig}, 300, function () {
            });
            $(".participant-panel").removeClass("opened");
        } else {
            var participantPanHig = $(".participant-panel").outerHeight();
            $('.close-expend').trigger('click');
            $(".participant-panel").animate({"top": "45"}, 300, function () {
            });
            $(".participant-panel").addClass("opened");
        }
    });



}
function checkChatMode() {
    var sendFlag = false;

    if (       validationModule.isInputEmpty($('.display-wrapper #course-title-value'))
            && validationModule.isInputEmpty($('.display-wrapper #dialogue-title-value'))
            && validationModule.isInputEmpty($('.display-wrapper #individual_user_list'))
        )
            {
        sendFlag = true;
    }
    if (sendFlag) {
        $('#course-dialogue-publish').removeClass('inactive');
    } else {
        $('#course-dialogue-publish').addClass('inactive');
    }

}
/*=============== add multiple participant====================*/
function AddMorePArticipants() {

    var CloneLi = '<li class="">';

    CloneLi += '<div class="Add-more-user"><i class="icon add-user-icon"></i><input type="text" placeholder="Add Participants here" class="form-control" required="required"></div>';
    CloneLi += '<div class="right-icon"><i class="icon tick add-more-Users"></i><i class="icon close delete-Users"></i></div></li>';

    $('body').on('click', 'button.add-Users', function (event) {
        $(this).closest('li').after(CloneLi);
        $(this).closest('li').remove();
    });

    $('body').on('click', '.add-more-Users', function (event) {
        if (!$(this).closest('li').find('input').val() == '') {

            var getValue = $(this).closest('li').find('input').val();
            var htmlValue = '<li class=""><div class="user-pic-sm"><img src="public/img/hat.png" alt=""><div class="icon green-icon shape"></div></div>';
            htmlValue += '<div class="chat-user-name"><h2>' + getValue + '</h2></div>';
            htmlValue += '<div class="right-icon"><i class="icon close delete-actor" data-original-title="" title=""></i></div></li>';
            $(this).closest('li').before(htmlValue);
            $(this).closest('li').find('input').val('');

            var participantHeight = $(window).height() - $('.header-stick-top').outerHeight();

            if ($('.participant-panel').outerHeight() >= participantHeight) {
                $('.participant-panel').css('height', participantHeight);
                $(".nano").nanoScroller();
            }
            else {
                $('.participant-panel').css('height', $('.participant-panel').outerHeight() + 31);
            }


        }
    });


    $('body').on('click', '.delete-Users', function (event) {
        var getButton = '<li class=""><button type="Submit" class="btn btn-style add-Users">Add Participants</button></li>';
        $(this).closest('li').append().html(getButton);
        $(this).closest('li').remove();
    });
    $('body').on('click', '.delete-actor', function (event) {
        $(this).closest('li').remove();
    });
    $('body').on('keypress', '.Add-more-actor input', function (e) {
        if (e.which == 13) {
            $('.add-more-Users').trigger('click');
        }
        $(".nano").nanoScroller();
    });
}

/*===============pin unpin course pane====================*/
function coursePinned() {
    $('.course-assign-cancel').hide();
    getRightPaneHig = $('.project-height').outerHeight();

    $('body').on('click', '.course-pinned', function (event) {
        var dialogueChatWid = $('#UserChat.opened').outerWidth();
        $('#UserChat.opened').animate({'width': dialogueChatWid + 270}, 300, function () {
            $('.pin').addClass('course-unpinned');
            $('.pin').removeClass('course-pinned');
            $('#UserChat .people-project').addClass('course-pin-wrap').removeClass("projectOpened");
        });
        $('#course-tab').find('li').first().find('a').html('By courses');
        $('.no-padding').removeClass('no-padding');
        $('.dialogue-Title').html('Project Management');
        $('.edit-rename-title input').val('Project Management');
        event.stopPropagation();
    });

    $('body').on('click', '.course-unpinned', function (event) {
        var dialogueChatWid = $('#UserChat.opened').outerWidth();
        $('#UserChat.opened').animate({'width': dialogueChatWid - 270}, 300, function () {
            $('.pin').addClass('course-pinned');
            $('.pin').removeClass('course-unpinned');
        });
        $('#course-tab').find('li').first().find('a').html('By courses');
        $('.no-padding').removeClass('no-padding');
        $('.dialogue-Title').html('Project Management');
        $('.edit-rename-title input').val('Project Management');
        $('#UserChat .people-project').removeClass('course-pin-wrap');
        // to hide course-assign mode
        $('.course-assign, .course-add, .pin, .close-people-panel').show();
        $('.course-unassign').hide();
        $('.course-assign-cancel').hide();
        //$('.close-chat1').show();
        $('.dialogue-left-pane').hide();
        $('.course-detail').hide();
        $('.project-height').css('height', getRightPaneHig)

        // to hide course-add mode
        $('li.untitled-col').hide();
        $('li.untitled-col').next('li').addClass('active');
        $('.edit-rename-title i').trigger('click');
        $('#view-courses').removeClass('hide');
        $('#add-courses').addClass('hide');
        setTimeout(function () {
            $('#UserChat .people-project').addClass("projectOpened");
        }, 500);
        event.stopPropagation();
    });

    $('body').on('click', '#UserChat .course-add', function (event) {
        if ($('.pin').hasClass('course-pinned')) {
            $('.course-pinned').trigger('click');
            // to hide course-assign mode
            $('.course-assign, .course-add, .pin, .close-people-panel').show();
            $('.course-unassign').hide();
            $('.course-assign-cancel').hide();
            //$('.close-chat1').show();
            $('.dialogue-left-pane').hide();
            $('.course-detail').hide();
            $('.project-height').css('height', getRightPaneHig)


            $('#course-tab').find('li').first().find('a').html('By courses');
            $('.no-padding').removeClass('no-padding');
            $('.dialogue-Title').html('Project Management');
            $('.edit-rename-title input').val('Project Management');
            $('li.untitled-col').show();
            $('li.untitled-col').next('li').removeClass('active');
            $('.dialogue-Title').trigger('click');
            $('#view-courses').addClass('hide');
            $('#add-courses').removeClass('hide');
        }
        else {
            // to hide course-assign mode
            $('.course-assign, .course-add, .pin, .close-people-panel').show();
            $('.course-unassign').hide();
            $('.course-assign-cancel').hide();
            // $('.close-chat1').show();
            $('.dialogue-left-pane').hide();
            $('.course-detail').hide();
            $('.project-height').css('height', getRightPaneHig)

            $('#course-tab').find('li').first().find('a').html('By courses');
            $('.no-padding').removeClass('no-padding');
            $('.dialogue-Title').html('Project Management');
            $('.edit-rename-title input').val('Project Management');
            $('li.untitled-col').show();
            $('li.untitled-col').next('li').removeClass('active');
            $('.dialogue-Title').trigger('click');
            $('#view-courses').addClass('hide');
            $('#add-courses').removeClass('hide');
        }
        event.stopPropagation();
    });



    $('body').on('click', '#UserChat  .course-assign', function (event) {
        $(this).hide();
        $('.course-add, .pin, .close-people-panel').hide();
        $('.course-unassign').show();
        courseAssignIcon();
        if ($('.pin').hasClass('course-pinned')) {
            $('.course-pinned').trigger('click');
            // to hide course-add mode
            $('li.untitled-col').hide();
            $('li.untitled-col').next('li').addClass('active');
            $('.edit-rename-title i').trigger('click');
            $('#view-courses').removeClass('hide');
            $('#add-courses').addClass('hide');

            $('#course-tab').find('li').first().find('a').append('<span class="sm-assign-course">Assign to course</span>');
            $('.sm-assign-course').closest('li').addClass('no-padding');
            $('.dialogue-Title').html('General');
            $('.edit-rename-title input').val('General');
            $('.course-assign-cancel').show();
            $('.close-chat1').hide();
            $('.dialogue-left-pane').show();
            $('.course-detail').show();
            var topPaneHig = $('.course-detail').outerHeight();
            $('.project-height').css('height', getRightPaneHig - topPaneHig)
        }
        else {
            // to hide course-add mode
            $('li.untitled-col').hide();
            $('li.untitled-col').next('li').addClass('active');
            $('.edit-rename-title i').trigger('click');
            $('#view-courses').removeClass('hide');
            $('#add-courses').addClass('hide');

            $('#course-tab').find('li').first().find('a').append('<span class="sm-assign-course">Assign to course</span>');
            $('.sm-assign-course').closest('li').addClass('no-padding');
            $('.dialogue-Title').html('General');
            $('.edit-rename-title input').val('General');

            $('.course-assign-cancel').show();
            $('.close-chat1').hide();
            $('.dialogue-left-pane').show();
            $('.course-detail').show();
            var topPaneHig = $('.course-detail').outerHeight();
            $('.project-height').css('height', getRightPaneHig - topPaneHig)
        }

        event.stopPropagation();
    });

    $('body').on('click', '.course-assign-cancel', function (event) {

        // to hide course-assign mode
        $('.course-assign, .course-add, .pin, .close-people-panel').show();
        $('.course-unassign').hide();
        $('.course-assign-cancel').hide();
        // $('.close-chat1').show();
        $('.dialogue-left-pane').hide();
        $('.course-detail').hide();
        $('.project-height').css('height', getRightPaneHig);
        $('#course-tab').find('li').first().find('a').html('By courses');
        $('.no-padding').removeClass('no-padding');
        $('.dialogue-Title').html('Project Management');
        $('.edit-rename-title input').val('Project Management');
        if ($(".by-course-section").hasClass("active")) {
            cancelCourseIcon();
        } else {
            courseAssignIcon();
        }
        event.stopPropagation();
    });

    $('body').on('click', '.dialogue-tab', function () {
        $('.dialogue-Title').trigger('click');
        $('#view-courses').addClass('hide');
        $('#add-courses').removeClass('hide');
        $('#By-Actor.active li, #Actors.active li').removeClass('stickyLi');
        var snippet = '<li class="clearfix undefined-col">'
                + '<a href="#" class="left right-drp">'
                + '<div class="user-pic-sm">'
                + ' <img src="public/img/hat.png" alt="">'
                + '<div class="indicate-icon indicate-offline"></div></div> '
                + '<div class="chat-user-name">'
                + ' <h2>Untitled</h2> '
                + '<p>Lorem Ipsum is simply dummy text of the printing...</p></div></a>'
                + '<a href="#" class="right"> <div class="badge-section">'
                + '<span class="badge right individual-panel individual-panel">14</span>'
                + '<span class="dialogue-day">Mon</span></div></a></li> ';

        $("#By-Actor.active li:first, #Actors.active li:first").before(snippet);
        if ($("#By-Actor.active li.active,#Actors.active li.active").hasClass("fixedSticky")) {
            $("#By-Actor.active li:first, #Actors.active li:first").addClass('stickyLi');
        }
    });

    $('body').on('click', '.new-course-tab', function () {
        $('.dialogue-Title').trigger('click');
        $('#view-courses').addClass('hide');
        $('#add-courses').removeClass('hide');
        $('#By-Course.active li').removeClass('courseStickyLi');
        var snippet = '<li class="undefined-col"><div class="course-id">11</div><div class="chat-user-name">'
                + '<h2>Untitled</h2><p>Lorem Ipsum is simply dummy text ...</p></div><div class="badge-section"><span class="dialogue-day">Fri</span>'
                + '</div></li>';
        $("#By-Course.active li:first").before(snippet);
        if ($("#By-Course.active li.active").hasClass("fixedSticky")) {
            $("#By-Course.active li:first").addClass('courseStickyLi');
        }

    });

    $('body').on('click', '.assign-course-tab', function () {
        $('#view-courses').removeClass('hide');
        $('#add-courses').addClass('hide');
        $('#By-Course.active li.untitled-col').hide();
        $('#By-Course.active li.untitled-col').next('li').addClass('active');
        $('.dialogue-left-pane').show();
        $('.course-detail').show().addClass("showCourse").next('.all-users').find('li').removeClass('fixedSticky courseStickyLi');
        // $('.close-chat1').hide();
        assignCourseIcon();
        $('.course-assign-cancel').show();


    });

    $('body').on('click', '#UserChat .untitled-col', function () {
        $('#view-courses').addClass('hide');
        $('#add-courses').removeClass('hide');
    });



    $('body').on('click', '.course-unassign', function () {
        $('.course-assign-cancel').trigger('click');
    });

}

/*===============add sticky header====================*/
function fixedLiSticky() {
    $(".tab-sticky").on("update", function (event, vals) {
        var position = $("#By-Actor .all-users  li.active").position();
        if ((position.top <= 0) || (position.top >= $("#By-Actor").height())) {
            if (!$(".tab-sticky .tab-pane.active .all-users  li:first").hasClass("active")) {
                if (!$('#By-Course.active .course-detail').hasClass("showCourse")) {
                    $("#By-Course.active  li:first").addClass("courseStickyLi");
                }
                $("#By-Actor.active li:first, #Actors.active li:first").addClass("stickyLi");
            } else {
                if (!$('#By-Course.active .course-detail').hasClass("showCourse")) {
                    $("#By-Course.active  li:first").next().addClass("courseStickyLi");
                }
                $("#By-Actor.active li:first, #Actors.active li:first").next().addClass("stickyLi");
            }

            if (!$('#By-Course.active .course-detail').hasClass("showCourse")) {
                $(".tab-sticky .tab-pane.active .all-users  li.active").addClass("fixedSticky");
            }
        }
    });
}

/*===============Open search filed in help flyout====================*/
function searchbarInfo() {
    $('.searchbar-section > .searchbar-icon').click(function () {
        $(this).addClass('hide');
        $(this).siblings('.searchbar-text').removeClass('hide');

    });
    $('.searchbar-section  .searchbar-cancel').click(function () {
        $('.searchbar-icon').removeClass('hide');
        $(this).closest('.searchbar-text').addClass('hide');

    });
}

function badgeCount()
{
    // people section slide when we click to badge
    $('body').on('click', '.individual-panel', function (event) {
        $(this).closest('li').siblings().find(".individual-panel").removeClass('badgeActive');
        $(this).addClass('badgeActive');

        $(".people-project").removeClass("hide");
        $(".user-profile-tab").animate({"right": "0"}, 300, function () {
            $(".user-profile-tab").addClass("hide");
        });
        $("#UserChat .people-project").animate({"right": "-270"}, 300, function () {
            $(".nano").nanoScroller();
        }).addClass("projectOpened");
        var headerHig = $('.header-wrapper').outerHeight();
        var windowHig = $(window).height();
        var peopleHT = $('#UserChat .people-project .people-individual').outerHeight();
        var availHeight = windowHig - headerHig;
        $('.project-height').height(availHeight - 47);
        event.stopPropagation();

    });
    $('body').on('click', '.close-people-panel', function (event) {
        $('.badgeActive').removeClass('badgeActive');
        $("#UserChat .people-project").animate({"right": "-1px"}, 300, function () {
            $(".people-project").addClass("hide");
            $('.edit-rename-title i').trigger("click");
        }).removeClass("projectOpened");
        if ($('.people-project').hasClass('course-pin-wrap')) {
            $(".user-profile-tab").css('right', 0).addClass("hide");
            var dialogueChatWid = $('#UserChat.opened').outerWidth();
            $('#UserChat.opened').animate({'width': dialogueChatWid - 270}, 300, function () {
                $('.pin').addClass('course-pinned');
                $('.pin').removeClass('course-unpinned');
                $('.project-height').css('height', getRightPaneHig)
            });
            $('#UserChat .people-project').removeClass('course-pin-wrap projectOpened');
            $('#course-tab').find('li').first().find('a').html('By courses');
            $('.no-padding').removeClass('no-padding');
            $('.dialogue-Title').html('Project Management');
            $('.edit-rename-title input').val('Project Management');
            $('.course-assign, .course-add, .pin, .close-people-panel').show();
            $('.course-unassign').hide();
            // to hide course-assign mode
            $('li.untitled-col').hide();
            $('li.untitled-col').next('li').addClass('active');
            $('.course-assign-cancel').hide();
            //  $('.close-chat1').show();
            $('.dialogue-left-pane').hide();
            $('.course-detail').hide();
            $('.project-height').css('height', getRightPaneHig)

            // to hide course-add mode
            $('li.untitled-col').hide();
            $('li.untitled-col').next('li').addClass('active');
            $('.edit-rename-title i').trigger('click');
            $('#view-courses').removeClass('hide');
            $('#add-courses').addClass('hide');
        }
        //  event.stopPropagation();

    });
    // trigger
    $(".added-user").click(function () {
        $(".rename-title").trigger("click");
    });
}

function peopleTabDropDown() {
    $(".people-tab").click(function (event) {
        $('.user-dialogue-drp').toggle();
        event.stopPropagation();
    });
    $(".user-dialogue-drp li a").click(function () {
        $('.user-dialogue-drp').hide();
    });
    $("body").click(function () {
        $('.user-dialogue-drp').hide();
    });
}

function openUserActionIcon() {

    // if(!$(".helpnodeFlyout").hasClass('helpClass')){
    //     if($(".user-img").hasClass('openChat')){
    //         $(".user-action-wrap a").each(function(i,v){
    //             if($(this).css("display") == "block"){

    //             var title = $(this).attr("data-original-title");
    //                 if((title != "NewDialogue") && (title != "SaveasDraft") && (title != "Send") && (title != "Close") && (title !="Help")){
    //                     $(this).css("display","none");
    //                     iconArr.push(title);
    //                 }
    //             }
    //          });
    //     }
    // }
    if ($(".helpnodeFlyout").hasClass('helpClass')) {
        $(".user-action-wrap a").each(function (i, v) {
            if ($(this).css("display") == "block") {
                var title = $(this).attr("data-original-title");

                if ((title != "Share") && (title != "Print") && (title != "helpClose") && (title != "Help")) {
                    $(this).css("display", "none");
                    helpArr.push(title);
                }
            }
        });
    }
}

function closeUserActionIcon() {
    if (!$(".helpnodeFlyout").hasClass('helpClass')) {
        if ($(".user-img").hasClass('openChat')) {
            for (var i in iconArr) {
                $('.user-action-wrap a[data-original-title=' + iconArr[i] + ']').css("display", "block");
            }
            iconArr = [];
        }
    }
    if ($(".helpnodeFlyout").hasClass('helpClass')) {
        for (var i in helpArr) {
            // $('.user-action-wrap a[data-original-title='+helpArr[i]+']').css("display","block");
        }
        helpArr = [];
    }
}

function courseAssignIcon() {
    if ($('.course-unassign').css("display") == "inline-block") {
        $(".user-action-wrap a").each(function (i, v) {
            if ($(this).css("display") == "block") {

                var title = $(this).attr("data-original-title");
                if ((title != "course-assign-save") && (title != "course-assign-cancel")) {
                    $(this).css("display", "none");
                    courseArr.push(title);
                }
            }
        });
    }
    if ($('.course-assign').css("display") == "inline-block") {
        for (var i in courseArr) {
            $('.user-action-wrap a[data-original-title=' + courseArr[i] + ']').css("display", "block");
        }
        courseArr = [];

    }
}

function assignCourseIcon() {

    $(".user-action-wrap a").each(function (i, v) {
        if ($(this).css("display") == "block") {

            var title = $(this).attr("data-original-title");
            if ((title != "course-assign-save") && (title != "course-assign-cancel")) {
                $(this).css("display", "none");
                assigncourseArr.push(title);
            }
        }
    });
}

function cancelCourseIcon() {
    for (var i in assigncourseArr) {
        $('.user-action-wrap a[data-original-title=' + assigncourseArr[i] + ']').css("display", "block");
    }
    assigncourseArr = [];
}

//chat window Event
function chatWindow() {

    var chatWindow = $(".Flyout-Three-Pane").outerWidth();

    $('.user-tab').click(function (e) {
        if ($(window).width() <= 1024) {
            $("body").addClass('fixedDialogueWindow');
        }
        else {
            $("body").removeClass('fixedDialogueWindow');
        }


        var FlyID = $(this).attr('id');
        if (!$("#" + FlyID + ".modalFlyout").hasClass('opened')) {
            e.preventDefault();
            flyOutclosing();
            $("#" + FlyID + '.Flyout-Three-Pane').animate({"margin-right": "0"}, function () {
                //$(".ui-resizable-sw").addClass("resizableIcon");
            }).addClass("opened");
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $(".nano").nanoScroller();

            });
            $(".chatIcon").show();
            $('.flyoutFH').addClass('openChat').removeClass('flyoutFH');
            $(".dialogue-side-tab li").removeClass("active").eq(0).addClass("active");
            $(".right-dialogue-panel .tab-content > div").removeClass('active').eq(0).addClass("active")
            $('.by-actor-section').trigger("click");
            $('[data-original-title="NewDialogue"]').show();
            openUserActionIcon();

            // FlyoutUserDialogue();

            // resizemodalWidth();

        }
        else {
            $(".close-chat").trigger("click");
        }


        e.stopPropagation();
    });

    $(".close-chat").click(function () {
        var chatWindow = $(".Flyout-Three-Pane").outerWidth();
        $(".Flyout-Three-Pane").animate({"margin-right": -chatWindow - 40}).removeClass("opened");
        if ($(".participant-panel").hasClass('opened')) {
            $('#UserChat .add-participants').trigger("click");
        }
        closeUserActionIcon();
        $('.openChat').addClass('flyoutFH').removeClass('openChat');
        $(".chatIcon").hide();
        $(".new-course-tab").hide();
        $(".assign-course-tab").hide();
        // addparticipants();
    });
}
//chat window Event end

function flyOutclosing()
{
    $(".modalFlyout").each(function (i, v) {
        if ($(this).hasClass("opened")) {
            var modalwidth = $(this).width();
            if ($(this).hasClass('sidebar-wrap')) {
                $(this).animate({"margin-left": -modalwidth}, 300).removeClass("opened");
            }
            else {
                $(this).animate({"margin-right": -modalwidth}, 300).removeClass("opened");
            }
        }
    });
}

//flyout-radio-btn-starts
/* Start Code By Arvind Soni Of Node Z class list instances */
/* Left Panel */
function classListNewAjax(url, order_by, order)
{
    NProgress.start();
    $.post(domainUrl + 'classes/' + url, {'order_by': order_by, 'order': order, 'mode': 'Ajax'}, responseclassListNewAjax, 'html');
}

function responseclassListNewAjax(d, s)
{
    NProgress.done();
    $("#node_z_class_list_final_div").html(d);
}

function responseClassListNew(d, s)
{
    NProgress.done();
    $(".classFourthDivOfInstancePane").html(d);

    $("#flyRadioBtnWrapper.modal").css({"right": "60px"});
    $("#flyRadioBtnWrapper.modal").addClass("classesIntance-opened");
    openclassesIntanceIcon();

    $('.classesInstance_roles').show();

    calculateTotalHeightRadioTable();
}
/* Right Panel*/
function getAllInstance(class_id)
{
    NProgress.start();
    $.post(domainUrl + 'classes/instanceListNew', {'class_id': class_id, 'mode': 'Normal'}, responsegetAllInstance, 'html');
}

function responsegetAllInstance(d, s)
{
    NProgress.done();
    $(".classFourthDivOfInstancePaneRight").html(d);
    calculateTotalHeightRadioTable();
}

function instanceListNewAjax(url, order_by, order)
{
    var class_id = $("#intanceClassIdNozeZ").val();
    NProgress.start();
    $.post(domainUrl + 'classes/' + url, {'class_id': class_id, 'order_by': order_by, 'order': order, 'mode': 'Ajax'}, responseinstanceListNewAjax, 'html');
}

function responseinstanceListNewAjax(d, s)
{
    NProgress.done();
    $("#node_z_instance_list_final_div").html(d);
    calculateTotalHeightRadioTable();
}

/* End Code By Arvind Soni Of Node Z class list instances */
function flyRadioBtnCustom() {

    $('body').on('click', '.fly-radio-btn', function (event) {
        if ($(window).width() <= 1024) {
            $("body").addClass('fixedDialogueWindow');
        }
        else {
            $("body").removeClass('fixedDialogueWindow');
        }

        $('#flyRadioBtnWrapper').show();
        ;
        $.post(domainUrl + 'classes/classListNew', {'mode': 'Normal'}, responseClassListNew, 'html');
        $('.loadder').show();
    });

    if ($('#second-class-div .node-selected .hidden-node-y').val() == "") {
        $(".add-fly-radio-checked i").addClass('plus-small').removeClass('edit-class-select');
        $(".show-edit-node-cust i").css("visibility", "visible");
        $(".sub_class_list_view1").hide();
    }


    $('body').on('click', '.fly-radio-btn:checked', function (event) {
        $(".add-fly-radio-checked").addClass("show").css("visibility", "visible");
        $(".add-fly-radio-checked i").addClass("fly-radio-btn");
    });


    // $('body').on('click','.radio_class_check_plus:unchecked', function(event){
    //     $(".add-fly-radio-checked i").css("visibility","hidden");

    // });

    //  $('body').on('click','.radio_class_check_plus:checked', function(event){
    //     $(".add-fly-radio-checked i").css("visibility","visible");

    // });

    $('body').on('click', '.radio_class_check_plus', function (event) {
        if ($(this).is(":checked")) {
            $(".show-edit-node-cust i").css({"visibility": "visible"});
        }
    });

    $('body').on('click', '.classesInstance_Cancel', function (event) {
        $("#flyRadioBtnWrapper.modal").css({"right": "-100%"});
        $('.loadder').hide();
        $("#flyRadioBtnWrapper.modal").removeClass("classesIntance-opened");
        $('.classesInstance_roles').hide();
        openclassesIntanceIcon();




    });


    $('body').on('click', '.table-radio-out-box  tr', function () {
        //$(".table-radio-out-box  tr").removeClass('current').find('.single_radio_check').prop( "checked", false );
        $(".table-radio-out-box  tr").removeClass('current').find('.single_radio_check');
        //$(this).addClass('current').find('.single_radio_check').prop( "checked", true );
        $(this).addClass('current');
    });

    $('body').on('click', '.table-radio-instance-out-box tr', function (event) {
        $(".table-radio-instance-out-box tr").removeClass('current');
        $(this).addClass('current');
    });

    $('body').on('click', '.fly-search-class-icon', function () {
        $('.search-fly-classes-box').slideToggle("fast");
        $(this).toggleClass('active');
    });

    $('body').on('click', '.fly-search-instance-icon', function () {
        $('.search-fly-instance-box').slideToggle("fast");
        $(this).toggleClass('active');
    });
}

function calculateTotalHeightRadioTable() {
    var rightFlyoutHig = $(window).height() - $('header').outerHeight() - 35 - $('.rightFlyout.in .fixed-participant').outerHeight();
    var flyTotalBoxHeight = $('.fly-TotalBox .block-head').outerHeight();

    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $('.mainTableFlyBox').css("height", rightFlyoutHig - $breadcrumbWrap);
        $('.mainTableFlyBox .nano').css("height", rightFlyoutHig - $breadcrumbWrap - flyTotalBoxHeight);
    }
    else {
        $('.mainTableFlyBox').css("height", rightFlyoutHig - $breadcrumbWrap);
        $('.mainTableFlyBox .nano').css("height", rightFlyoutHig - $breadcrumbWrap - flyTotalBoxHeight);
    }
    $(".nano").nanoScroller();
}

function openclassesIntanceIcon() {

    if ($("#flyRadioBtnWrapper").hasClass('classesIntance-opened')) {
        $(".user-action-wrap a").each(function (i, v) {
            if ($(this).css("display") == "block") {

                var title = $(this).attr("data-original-title");
                if ((title != "classesInstance-Submit") && (title != "classesInstance-Cancel")) {
                    $(this).css("display", "none");
                    classesIntance.push(title);
                }
            }
        });
    }

    if (!$("#flyRadioBtnWrapper").hasClass('classesIntance-opened')) {
        for (var i in classesIntance) {
            $('.user-action-wrap a[data-original-title=' + classesIntance[i] + ']').css("display", "block");
        }
        classesIntance = [];
    }
}

function leftMenuCalHt()
{
    var winHig = $(window).height();
    var menuHig = $('.menu-main-wrap').outerHeight();
    var topHig = $('.header-wrapper').outerHeight();
    var searchHig = $('.fixed-btm-icon').outerHeight();
    var getHig = winHig - menuHig - topHig - searchHig;
    $('.menu-main-wrap').css('height', winHig - topHig)
    // $('.fixed-calender-bottom').css('bottom',60);
    // $('.fixed-search-bottom').css('bottom',0);
}

function leftMenuIconHover()
{
    // this is tentative work for hover

    if ($(window).width() > 1024) {
        var menuHig = $(window).height() - 92;
        var singleIconHig = $(".menu-main-wrap").children('li').height();
        var iconHig = $(".menu-main-wrap").children('li').length * 50;
        var pendingHig = ((menuHig - iconHig));
        var snippet = '<div class="icon-wrap custom-blank-div"></div>';
        $('.menu-main-wrap .custom-blank-div').remove();
        $('.menu-main-wrap').append(snippet);
        $('.icon-wrap.custom-blank-div').height(pendingHig+4);
        // end

        // $('.icon-wrap').find('a').css({'vertical-align':'middle' });
        //     $('.icon-wrap').find('i').css({'margin-top':'0'});
        //     $('.icon-wrap').find('span').css('display','none');

        // $('body').on('mouseover','.icon-wrap', function(){
        //     $('.icon-wrap').find('a').css({'vertical-align':'top'});
        //     $('.icon-wrap').find('i').css({'margin-top':'7px'});
        //     $('.icon-wrap').find('span').css('display','block');
        // });

        // $('body').on('mouseleave','.icon-wrap', function(){
        //     $('.icon-wrap').find('a').css({'vertical-align':'middle' });
        //     $('.icon-wrap').find('i').css({'margin-top':'0'});
        //     $('.icon-wrap').find('span').css('display','none');
        // });
        return false;
    }
    // else{
    //    $('.icon-wrap').find('a').css({'vertical-align':'top'});
    //       $('.icon-wrap').find('i').css({'margin-top':'7px'});
    //       $('.icon-wrap').find('span').css('display','block');
    // }
}

function coursePanel() {
    // $('#mySelect').selectpicker();
    $('body').off('click', 'table.ActiveRow tr').on('click', 'table.ActiveRow tr', function () {
        var _this = $(this);
        var reactButtonCancelAddNewCourse = $("#react-button-cancel-add-new-course");
        if (reactButtonCancelAddNewCourse.length) {
             reactButtonCancelAddNewCourse.trigger('click');
             return false;
        }

            var buttonWrapper = $('#course_action_menu');
        var hasCancelButton = buttonWrapper.find('a:visible').find('.icon.cancel').length;
        if(hasCancelButton) {
            return true;
        }
        _this.closest('.course-list').siblings('.course-list').find('tr').removeClass('current');
        _this.siblings('tr').removeClass('current');
        _this.closest('table').siblings('.ref-show-inline-wrap').find('li').removeClass('current');
        _this.closest('.course-list').siblings('.course-list').find('li').removeClass('current');
        if (!_this.hasClass('folder-document-details')) {
            _this.addClass('current');
        }
    });

    // $('body').on('click', '.inline-course-wrap ul > li > a ' , function(){
    //     $(this).siblings('ul').slideToggle(300);
    // });

    $('body').on('click', '.ref-showCmt', function (event) {
        $(this).siblings('h6').addClass('hide');
        $(this).siblings('i.recurssion').addClass('hide');
        $(this).before('<input type="text" class="form-control input-field">');
        $(this).addClass('tick ref-hideCmt');
        $(this).removeClass('sm-edit ref-showCmt');
        event.stopPropagation();
    });

    $('body').on('click', '.ref-hideCmt', function (event) {
        var getValue = $(this).siblings('input').val();
        if (getValue == '')
        {
            $(this).siblings('h6').removeClass('hide').html("Undefined");

        }
        else {
            $(this).siblings('h6').removeClass('hide').html(getValue);
            ;
        }
        $(this).siblings('i.recurssion').removeClass('hide');
        $(this).siblings('input').remove();
        $(this).addClass('sm-edit ref-showCmt');
        $(this).removeClass('tick ref-hideCmt');
        event.stopPropagation();
    });
    $('body').on('click', '.view-comment.openDialogueSec input', function (event) {
        event.stopPropagation();
    });


    $('body').on('click', '.ref-add-event', function () {
        var getValue = $(this).siblings('input').val();
        var getCloneLi = $(this).closest('li').prev('li').clone();
        $(this).closest('li').addClass('hide');
        $(this).closest('li').after(getCloneLi);
        $(getCloneLi).addClass('Undefined-entry');
        if (getValue == '')
        {
            $('.Undefined-entry').find('h6').html("Undefined");
        }
        else {
            $('.Undefined-entry').find('h6').html(getValue);
            ;
        }
        $('.event-form-section').removeClass('hide');
        $(".nano").nanoScroller();
    });

    // Below code is commented because of REACT implementation
    // $('body').off('click', '.ref-inline-course-wrap  li').on('click', '.ref-inline-course-wrap  li', function (event) {
    //
    //     $('.ref-inline-course-wrap  li').removeClass('current');
    //     $(this).addClass('current');
    //     $(this).closest('.ref-show-inline-wrap').siblings('table.ActiveRow').find('tr').removeClass('current');
    //     $(this).closest('.course-list').siblings('.course-list').find('tr').removeClass('current');
    //     $(this).closest('.course-list').siblings('.course-list').find('li').removeClass('current');
    //     $(".nano").nanoScroller();
    //     var liwidth = 0;
    //     var coursevalue = $(this).find('.inline-left-pane').text().trim();
    //     $('.non-ins a:last').text(coursevalue + " List");
    //     $(".breadcrumb li.active").each(function (i, v) {
    //         liwidth += $(v).outerWidth();
    //         $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
    //     });
    //     $(".image-slider").css("width", liwidth);
    //
    // });

    $('body').on('click', '.ref-inline-course-wrap  li .ref-course-list', function () {
        // $('#courseDetailWrap').removeClass('hide'); // hide due to course-old-table-shows
        $('#courseViewWrap').addClass('hide');
        sideFlyoutHeight();
    });
    var DELAY = 500, clicks = 0, timer = null;

    //  $('.ref-show-inline-wrap').css('margin-top',-inlineHIg);

    $('body').on('click', '.ref-inline', function (e) {
        var _this = $(this);
        var cancelAddDialogueBtn = $("#react-button-cancel-add-new-dialogue");
        if(cancelAddDialogueBtn.length) {

            var currentTarget = _this;
            var uniqueId = +new Date;

            currentTarget.attr('data-clicked-id', uniqueId)
            cancelAddDialogueBtn.attr({
                'data-target-id': uniqueId,
                'data-target-type': currentTarget.prop('nodeName').toLowerCase()
            });
            cancelAddDialogueBtn.trigger('click');
            return false;
        }

        if(_this.hasClass('react-list')) {

            var reactButtonCancelAddNewCourse = $("#react-button-cancel-add-new-course");
            if(reactButtonCancelAddNewCourse.length) {
                reactButtonCancelAddNewCourse.trigger('click');
                return false;
            }

            if(_this.next().hasClass('hide')) {
                _this.closest('.course-list-panel').find('.course-list-detail').addClass('hide');
                _this.next().removeClass('hide');
            } else {
                _this.next().addClass('hide');
            }

            $(this).toggleClass('openup');
            //$(this).closest('.course-list').siblings('.course-list').find('.ref-inline').removeClass('openup');
            $(this).closest('.list-row').siblings('.list-row').find('.ref-inline').removeClass('openup');
            $(this).closest('.list-row').siblings('.list-row').find('.ref-inline').find('tr').removeClass('current');

            return true;
        }
        // var activeRow = _this.closest('.course-list-panel').find('.ActiveRow').not(_this);
        // if(activeRow.length) {
        //     bootbox.confirm({
        //         title: 'Confirmation',
        //         message: 'Are you sure you want to move? Any unsaved data will be lost?',
        //         callback: function(state) {
        //             if(state) {
        //                 activeRow.remove();
        //                 _this.click();
        //             }
        //         }
        //     });
        //     return true;
        // }

        $("#tempAction").val('underConstruction');
        $('#courseViewWrap').removeClass('hide'); // hide due to course-old-table-shows
        $('#courseDetailWrap').addClass('hide');
        $(".control-bar.course-title-bar,#courseViewWrap, #newCourseControl, #newcourseDefaultWrap, #existingDialogueControl, #existingSelectedCourse").addClass('hide');
        $('#viewCourseControlBar, #viewCourseDefaultWrapper').removeClass('hide');
        $(this).toggleClass('openup');
        var inlineHIg = $('.ref-inline.openup').siblings('.ref-show-inline-wrap').outerHeight();
        $(this).closest('.course-list').siblings('.course-list').find('.ref-inline').removeClass('openup');

        if ($(this).hasClass('openup')) {
            $(this).closest('.course-list').siblings('.course-list').find('.ref-show-inline-wrap').animate({'marginTop': -inlineHIg}).addClass('hide');
            $(this).siblings('.ref-show-inline-wrap').animate({'marginTop': '0px'}).removeClass('hide');
        } else {
            $(this).siblings('.ref-show-inline-wrap').animate({'marginTop': -inlineHIg}).addClass('hide');
        }
        $(".nano").nanoScroller();
        var liwidth = 0;
        var coursevalue = $(this).find('.inline-left-pane').text();
        $('.non-ins a:last').text("Course Detail");
        $(".breadcrumb li.active").each(function (i, v) {
            liwidth += $(v).outerWidth();
            $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text())
        });
        $(".image-slider").css("width", liwidth);
        $(this).find("tr").removeClass('notification-color');
        $(".ref-inline tr.current").removeClass('current');
        $(this).find('tr').addClass('current');
        var activeNode = $(this).find('tr.current').attr('data-id');
        $.post(domainUrl + 'menudashboard/courseView', {'node_instance_id': activeNode}, responseCallcourseViewAction, 'html');
        if ($('.newDefaultCourseList .toggleCourseWrapper').siblings('.collapsedCourseBox').hasClass('expandedCourseBox')) {
            $('.newDefaultCourseList .toggleCourseWrapper').siblings('.collapsedCourseBox').slideUp().removeClass('expandedCourseBox');
            $(".newDefaultCourseList .toggleCourseWrapper .toggle-courses i").removeClass("fa-angle-down collapse-down").addClass("fa-angle-up collapse-up");
        }
    })
            .on("dblclick", function (e) {
                e.preventDefault();  //cancel system double-click event
            });

    $('body').on('shown.bs.collapse', '.courseDetailSection .collapse', function () {
        autosize.destroy(document.querySelectorAll('.courseDetailSection textarea.resizeTextarea'));
        $('.courseDetailSection textarea.resizeTextarea').each(function () {
            autosize(this);
        }).on('autosize:resized', function () {
            $(".nano").nanoScroller();
        });
    });
    $('body').on('shown.bs.collapse', '.collapse', function () {
        $(".nano").nanoScroller();
    });

    $('body').on('hide.bs.collapse', '.collapse.in', function () {
        $(".nano").nanoScroller();
        setTimeout(function () {
            if ($(this).closest('.mainAccordianHig .nano-content .mainAccordianDiv').height() < $(this).closest('.mainAccordianHig').height()) {
                $(".nano").nanoScroller({destroy: true});
            }
        }, 200);
    });

    $('body').on('click', 'input.datepicker', function (event) {
        $(this).datepicker({
            showOn: 'focus'
        }).focus();
    });

    $('body').on('update', '.nano', function () {
        $('.datepicker').datepicker('hide');
    });

    $('body').on('click', '.on-off > li', function () {
        if ($(this).hasClass('all-day')) {
            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');
            $('.ref-all-day').removeClass('hide');
            $('.ref-specific-time').addClass('hide');
        }
        else {
            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');
            $('.ref-specific-time').removeClass('hide');
            $('.defaultEntry').timeEntry();
            $('.timeEntry_control').remove()
            $('.ref-all-day').addClass('hide');
        }
    });

    $('body').on('click', '#ref-toggle-drp > li > .radio input[type="radio"]', function () {
        if ($(this).is(":checked")) {
            $('#ref-toggle-drp').find('ul').hide();
            $(this).closest('.radio').siblings('ul').show();
        }
        else {
            $('#ref-toggle-drp').hide();
        }

    });

    $('body').on('click', '.ref-show-recurrence > input[type="checkbox"]', function () {
        if ($(this).is(":checked")) {
            $('.recurrence-wrap').removeClass('hide');
        }
        else {
            $('.recurrence-wrap').addClass('hide');
        }
    });

    $('body').on('click', '.RightFlyoutOpen', function () {

        $(this).toggleClass('openflyout');
        if ($(this).hasClass('openflyout')) {
            var getID = $(this).attr('id');
            var getZindex = parseInt($('.rightFlyout.in').css('z-index'));

            $("#participantFlyout, #AddUserFlyout, #userRightFlyout").removeClass('openflyout');
            $("#participantFlyout, #AddUserFlyout, #userRightFlyout").animate({right: '-100%'}).removeClass('in');

            $('#' + getID + ".rightFlyout").animate({right: '0px'}).addClass('in').css('z-index', getZindex + 1);
            setTimeout(function () {
                sideFlyoutHeight();
            }, 300);
            $(".nano").nanoScroller();
            $('.loadder').show();
        }
        else {
            $('#' + getID + ".rightFlyout").animate({right: '-100%'}).removeClass('in');
            $('.loadder').hide();
        }

    });

    $('body').on('click', '.RightFlyoutClose', function () {
        var getID = $(this).attr('id');
        $('#' + getID + ".RightFlyoutOpen").removeClass('openflyout');
        $('#' + getID + ".rightFlyout").animate({right: '-100%'}).removeClass('in');
        $('.loadder').hide();
    });

    $('body').on('click', '.LeftFlyoutOpen', function (event) {
        openFlyout($(this));
    });

    $('body').on('click', '.LeftFlyoutClose', function (event) {
        var getID = $(this).attr('id');
        $('#' + getID + ".LeftFlyoutOpen").removeClass('openflyout');
        $('#' + getID + ".leftFlyout").removeClass('in');
        if($(this).find('.icon').hasClass('done')) {
            $('.menu-flyout-close:first').click();
        }
        $('#nav').removeClass('subflyout-in');
        $('.loadder').hide();
        // event.stopPropagation();
    });



    $('body').on('click', '.searchFlyoutOpen', function (event) {
        $(this).toggleClass('openup');
        if ($(this).hasClass('openup')) {
            $(this).closest('.searchFlyout').find('input').animate({right: '0px'}, 300);
            $(this).closest('.searchFlyout').siblings('.main-title-wrap > span').addClass('hide');
        }
        else {
            $(this).closest('.searchFlyout').find('input').animate({right: '-100%'}, 300);
            $(this).closest('.searchFlyout').siblings('.main-title-wrap > span').removeClass('hide');
        }
        event.stopPropagation();
    });

    $('body').on('click', '.ref-add-partcipant', function (event) {

        if (!$(this).closest('li').find('input').val() == '') {

            var getValue = $(this).closest('li').find('input').val();

            var htmlValue = '<li class=""><div class="user-pic-sm"><img src="public/img/hat.png" alt=""><div class="icon green-icon shape"></div></div>';
            htmlValue += '<div class="chat-user-name"><h2>' + getValue + '</h2></div>';
            htmlValue += '<div class="right-icon"><i class="icon close ref-delete-participant"t></i></div></li>';

            $(this).closest('.fixed-participant').siblings('.course-inner-wrap').find('ol').prepend(htmlValue);
            $(this).closest('li').find('input').val('');
            $(".nano").nanoScroller();

        }
    });



    $('body').on('keypress', '.add-usersli input', function (e) {
        if (e.which == 13) {
            $('.ref-add-partcipant').trigger('click');
        }
        $(".nano").nanoScroller();
    });

    $('body').on('click', '.ref-delete-participant', function (event) {
        $(this).closest('li').remove();
    });
}

function sideFlyoutHeight() {
    if(typeof manageHightScroll == 'undefined') {
        manageHightScroll = '';
    }
    var getWidth = $('.content-wrapper-new').outerWidth() / 2;
    var rightFlyoutWid = $(window).width() / 3.5;
    var nodeRightFlyoutWid = $(window).width() / 2.3;
    var midrightFlyoutWid = rightFlyoutWid - $('.rightFlyout .user-action-wrap').outerWidth();
    //var midnodeRightFlyoutWid   =   '539px' - $('.rightFlyout .user-action-wrap').outerWidth();
    var rightFlyoutHig = $(window).height() - $('header').outerHeight() - 45 - $('.rightFlyout.in .fixed-participant').outerHeight();
    var leftFlyoutHig = $(window).height() - $('header').outerHeight() - 45 - $('.leftFlyout.in .fixed-participant').outerHeight();

    $('.rightFlyout.in').css('width', rightFlyoutWid);
    $('#newDocumentFlyout.rightFlyout').css('width', '610px');

    $('#nodeRightFlyout.rightFlyout, #userRightFlyout.rightFlyout, #GroupFlyout.rightFlyout').css('width', getWidth + 61);
    $('#EventFlyout.rightFlyout').css('width', getWidth + 61);

    $('#CellRightFlyout.rightFlyout.in').width(getWidth + 60);
    //  $('.rightFlyout.in .courseflyout').css('width', midrightFlyoutWid-2);
    $('#nodeRightFlyout .courseflyout, #userRightFlyout .courseflyout, #GroupFlyout .courseflyout').css('width', getWidth);
    $('#EventFlyout .courseflyout').css('width', getWidth);

    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
        $breadcrumbWrap = 10;
        $('.course-inner-wrap').css('height', rightFlyoutHig - $breadcrumbWrap);
        $('.leftFlyout .course-inner-wrap').css('height', leftFlyoutHig - $breadcrumbWrap);
        $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap - 3);
        $('.leftFlyout .fixedTableHig').css('height', leftFlyoutHig - 35 - $breadcrumbWrap);

        if (manageHightScroll == 'add')
        {
            $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap);
        }
        else if (manageHightScroll == 'view')
        {
            $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap + 43);
        }



    } else {
        $breadcrumbWrap = 51;
        $('.course-inner-wrap').css('height', rightFlyoutHig - $breadcrumbWrap);
        $('.leftFlyout .course-inner-wrap').css('height', leftFlyoutHig - $breadcrumbWrap);
        $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap - 4);

        $('.leftFlyout .fixedTableHig').css('height', leftFlyoutHig - 35 - $breadcrumbWrap);

        if (manageHightScroll == 'add')
        {
            $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap);
        }
        else if (manageHightScroll == 'view')
        {
            $('.fixedTableHig').css('height', rightFlyoutHig - 35 - $breadcrumbWrap + 43);
        }
    }
}

function setThreePaneWidth() {
    if ($("#class-wrapper .set-height.active").length == 3) {
        var ww = $(window).width();
        var sw = $(".sidebar_wrap").outerWidth();
        var uw = $(".user-action-wrap").outerWidth();
        var tw = parseInt((ww - (sw + uw)) / 3);
        $("#class-wrapper .set-height").outerWidth(tw + "px");
        $(".pui_center_content").css("margin-left", "-" + tw + "px");
    }
    else {
        var ww = $(window).width();
        var sw = $(".sidebar_wrap").outerWidth();
        var uw = $(".user-action-wrap").outerWidth();
        var tw = (ww - (sw + uw)) / 2;
        $("#class-wrapper .set-height").outerWidth(tw + "px");
        var activeindex = $("#class-wrapper .set-height.active").index();
        $(".pui_center_content").css("margin-left", "-" + activeindex * tw + "px");
    }
    var sum = 0;
    $('.breadcrumb li.active').each(function (i, v) {
        sum += $(this).outerWidth();
    });
    $(".image-slider").width(sum + "px");
}

function setProcessThreePaneWidth() {

    var $winWidth = $(window).width();
    var sideWidth = $(".sidebar_wrap").outerWidth();
    var actionWrap = $(".user-action-wrap").outerWidth();

    $(".threePaneWrapper").css("width", $winWidth - (sideWidth) + 1);
    var threePaneWidth = $(".threePaneWrapper").outerWidth();
    var paneSection = threePaneWidth / 3 - 20;
    $(".pane-wrapper").outerWidth(paneSection);

    var paneWrap = $(".pane-wrapper").width();
    $(".threePaneWrapper .three-slide-pane-width").outerWidth(paneWrap);
    var marginTest = $(".threePaneWrapper").outerWidth();
}

function calculateThreePaneHeight() {
    var windowHg = $(window).height();
    var brHeight = $('.breadcrumb-wrap').outerHeight();
    var headerheight = $('.header-wrapper').outerHeight();


    var totalThreePaneBlockHeight = $('.threePaneWrapper .paneSection:nth-child(2) .pane-control-head').outerHeight();
    var totalFlyWindowHeight = windowHg - (brHeight + headerheight + totalThreePaneBlockHeight);
    $('.threePaneWrapper .paneSection:nth-child(2) .three-slide-pane-width').css("height", totalFlyWindowHeight);


    var totalThreePaneBlockHeight = $('.threePaneWrapper .paneSection:nth-child(3) .pane-control-head').outerHeight();
    var totalFlyWindowHeight = windowHg - (brHeight + headerheight + totalThreePaneBlockHeight);
    $('.threePaneWrapper .paneSection:nth-child(3) .three-slide-pane-width').css("height", totalFlyWindowHeight - brHeight);


    var totalThreePaneBlockHeight = $('.threePaneWrapper .paneSection:nth-child(1) .pane-control-head').outerHeight();
    var totalFlyWindowHeight = windowHg - (brHeight + headerheight + totalThreePaneBlockHeight);
    $('.threePaneWrapper .paneSection:nth-child(1) .three-slide-pane-width').css("height", totalFlyWindowHeight);
}

function FilesValueFlyout() {

    var getID = 'FilesValueFlyout';

    $('body').on('click', '.FilesValueFlyoutOpen', function () {
        $(this).toggleClass('openflyout');
        if ($(this).hasClass('openflyout'))
        {
            var heading = $(this).parents('li:eq(1)').find('div:first').find('span:last').html();
            var is_instance = $("#is_instance").val();

            if (is_instance == "Y")
            {
                var dProperty = $("#second-instance-div-heading").html();

                $('div#FilesValueFlyout').find(".block-rightHead span .main-title").html($.trim(dProperty) + ' (' + heading + ')');
            }

            $(".FilesValueFlyoutOpen").removeClass('openflyout');
            $(".rightFlyout").animate({right: '-100%'}).removeClass('in');
            // flyout head
            /*var method_head = $(this).parents('ol.ins-subcls li.paper-line-center-li')
             .find('div.node-input').find('.method_value_head').val();
             var method_head = $(this).parents('li.paper-line-center-li').find('div.node-content').find('input.method_value_head').val();*/
            var method_head = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent()
                    .parent().find('div.node-content').find('input.method_value_head').val();
            $('div#FilesValueFlyout').find('div.control-bar span.main-title').html(method_head);
            // flyout content


            var value = $(this).attr('alt');
            value = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
            $('div#FilesValueFlyout').find('div.nano-content').html(value);



            $('#' + getID + ".rightFlyout").animate({right: '0px'}).addClass('in');
            setTimeout(function () {
                sideFlyoutHeight();
            }, 300);
            $(".nano").nanoScroller();
        }
        else
        {
            $('#' + getID + ".rightFlyout").animate({right: '-100%'}).removeClass('in');
        }
    });


    $('body').on('click', '.FilesValueFlyoutClose', function () {
        var getID = 'FilesValueFlyout';
        $('#' + getID + ".FilesValueFlyoutOpen").removeClass('openflyout');
        $('#' + getID + ".rightFlyout").animate({right: '-100%'}).removeClass('in');
    });
}

function addArrow() {
    setTimeout(function () {
        var getLength = $('.total-width-pane:visible .set-height.active').length - 1;
        $('.total-width-pane.slide-wrap .set-height').removeClass("activeWrap");
        $('.total-width-pane.slide-wrap .set-height.active').each(function (i, v) {
            if (i < getLength) {
                $(this).addClass("activeWrap");
            }
        });
    }, 200);

    // $(".breadcrumb-wrap").click(function(event){
    //   addArrow();
    // });
}

function undefinedEntry() {
    $('.table-style td').each(function () {
        var getText = $(this).text();
        if (getText == 'Untitled') {
            $(this).addClass('text-italic');
        }
    });
}

function loaderHeightWidth() {
    //setWidth
    var fullWidth = ($(window).width() - (264));
    $(".greyloader-Full").width(fullWidth);
    var twoPaneWidth = (($(window).width() - (264)) / 2) + 30;
    $(".greyloader-TwoPane").width(twoPaneWidth);
    var threePaneWidthTwo = ($(window).width() - (264 + 60)) / 3;
    $(".greyloader-ThreePane-Twodiv").width(threePaneWidthTwo + threePaneWidthTwo + 60);
    var threePaneWidthOne = ($(window).width() - (264 + 60)) / 3 + 60
    $(".greyloader-ThreePane-oneDiv").width(threePaneWidthOne);

    //setHeight
    var loaderHght = $(window).height() - ($('header').height() + $('.breadcrumb-wrap').height());
    $('.greyloader').height(loaderHght);
    if ($('.breadcrumb-wrap').hasClass('breadcrumb-up')) {
        $('.greyloader').height(loaderHght + 50);
    }
}

function printSelectedPane(data, source) {
    // source = success
    var popupWin = window.open('', '_blank', 'width=800,height=600');
    var head = '<head><link rel="stylesheet" type="text/css" media="print" href="http://localhost/PUI/public/css/style.css"></head>';
    popupWin.document.open();
    popupWin.document.write('<html>' + head + '<body onload="window.print()" style="-webkit-print-color-adjust:exact;">' + data + '</html>');
    popupWin.document.close();
}

function calenderWidthHeight() {

    var DateHig = $('#calenderWrap.listing-wrapper').outerHeight() - $('#calenderWrap .control-bar').outerHeight() - $('#calenderWrap .cal-top-section').outerHeight() - $('#calenderWrap .pui_calendar_headings').outerHeight();
    var getDateHig = (DateHig / 6) - 4;
    var getDateWid = $('#pui_calendar').outerWidth() / 7;

    $('#pui_calendar').children('div').css({'width': getDateWid - .1, 'height': getDateHig});
    $('#pui_calendar_headings').children('div').css({'width': getDateWid - .1});
}

function myFunction()
{
    calenderWidthHeight();
}

function dashboardInitalLoad() {

    if (parseInt($(".menudashboard").css("margin-left")) == "0") {
        var menuDashboardWidth = $(".menudashboard").width() - Math.abs(parseInt($(".menudashboard").css("margin-left")));
        var menuDashboardWidth = parseInt(menuDashboardWidth);
        var menusplitDashboardWidth = menuDashboardWidth / 2;
        $("#menudashboard .total-width-pane .dashSlider").outerWidth(menusplitDashboardWidth);
        var menusubDashboardWidth = menusplitDashboardWidth * $(".dashSlider").length;
        $("#menudashboard .total-width-pane").width(menusubDashboardWidth);
        if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
            $breadcrumbWrap = 10;
            $('.HalfPaneHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
            $('.setListWrapHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
        }
        else {
            $breadcrumbWrap = 51;
            $('.HalfPaneHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
            $('.setListWrapHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());

            var newcourseDefaultWrapHeight = $("#newcourseDefaultWrap").outerHeight();
            $(".courseEditorCollapsedWrap").outerHeight(newcourseDefaultWrapHeight);

        }
    } else {
        var menuDashboardWidth = $(".content-wrapper-new").width();
        var menuDashboardWidth = parseInt(menuDashboardWidth);
        var menusplitDashboardWidth = menuDashboardWidth / 2;
        $("#menudashboard .total-width-pane .dashSlider").outerWidth(menusplitDashboardWidth);
        var menusubDashboardWidth = menusplitDashboardWidth * $(".dashSlider").length;
        $("#menudashboard .total-width-pane").width(menusubDashboardWidth);
        $(".menudashboard").css("margin-left", "-" + menusplitDashboardWidth + "px");
    }


}

function dialogueViewPanel() {
    $("body").on('click', '.dialogueViewWrap', function (event) {
        if (!$(".menudashboard .total-width-pane .dashSlider:last").hasClass('active')) {
            var divwidth = $("#menudashboard .total-width-pane .dashSlider").outerWidth();
            $(".menudashboard").animate({"margin-left": '-=' + divwidth},
            300);
            $('.menudashboard .listing-wrapper').removeClass('active');
            $('.menudashboard .display-wrapper').addClass('active');
            dialogueView();
            renameTitle();

            $(".breadcrumb li:first").removeClass("active");
            $("#node-x-li").css("display", "block").addClass('active');
            var coursevalue = $(".non-ins a:last").text();
            var value = coursevalue.substr([0], coursevalue.indexOf(' '));
            $("#node-x-li a").text(value + " Detail");
            var liwidth = 0;
            $(".breadcrumb li.active").each(function (i, v) {
                liwidth += $(v).outerWidth();
                $(".image-slider a").eq(i).text($(".breadcrumb-wrap li.active a").eq(i).text());
            });
            $(".image-slider").css("width", liwidth);
            var firstNodewidth = $(".breadcrumb-wrap li:first").outerWidth();
            $(".image-slider").animate({
                'marginLeft': '+=' + firstNodewidth
            }, 200);
        }
        event.stopPropagation();
    });
}

function menuDashboardBack() {
    $(".menudashboard").animate({"margin-left": 0}, 300);
    $('.menudashboard .listing-wrapper').addClass('active');
    $(".menudashboard .total-width-pane .dashSlider:last").removeClass('active');
}

function dialogueView() {
    var windowHig = $(window).height();
    var headerHig = $('.header-wrapper').outerHeight();
    var footerWrap = $(".breadcrumb-wrap").outerHeight();
    var textareaBox = $(".dialogue-view .dialogue-txt-comment").outerHeight();
    var actionWrap = $(".dialogue-view .action-wrap").outerHeight();
    var topBar = $(".dialogue-view .right-bar-tab").outerHeight();

    var availHeight = windowHig - headerHig - footerWrap - textareaBox - actionWrap - topBar;

    $(".set-height-dialogue").animate({"height": availHeight});
}

function openActor() {
    $("body").on('click', '.editActorFrom', function (event) {
        $('.accountEditMode').removeClass('hide');
        $('.accountViewMode').addClass('hide');
    });

    $("body").on('click', '.viewActorFrom', function (event) {
        $('.accountViewMode').removeClass('hide');
        $('.accountEditMode').addClass('hide');
    });
}

function versionPanel() {


    $("body").on('click', '.structureDiv', function (event) {
        $(this).addClass('active');
        $(this).siblings('a').removeClass('active');
        $('#second-class-div').removeClass('hide');
        $('#version-class-div').addClass('hide');
        $('#version_action_menu').hide();
        $('#main_action_menu').show();
        //added-code-version-div-active-classes-clicked-default-show-structure-icons
        $("#main_action_menu a[style*='block'], #main_action_menu a[style=''], #main_action_menu a[data-original-title='AddSubclass'], #main_action_menu a[data-original-title='Cancel'], #main_action_menu a[data-original-title='Edit'], #main_action_menu a[data-original-title='Instance']").removeClass("hide");

    });



    $("body").on('click', '.version-tree-structure li .node-content', function (event) {
        $(".version-tree-structure li .node-content").removeClass('active');
        $(this).addClass('active');
    });




    $("body").on('click', '#first-class-div .get-version tr', function (event) {
        if ($('.versionDiv').hasClass('active')) {
            $('#second-class-div').removeClass('hide');
            $('#version-class-div').addClass('hide');
            $('#version_action_menu').hide();
            $('#main_action_menu').show();
            $('.versionDiv').removeClass('active');
            $('.structureDiv').addClass('active');

        }
        event.stopPropagation();
    });

}

$("body").on('click', '.versionDiv', function ()
{
    var node_y_class_id = $("#node_y_class_id").val();
    var versionVal = $.trim($(".list-row.current").find('td').eq(4).html());
    $.post(domainUrl + 'classes/versionHistory', {'class_id': node_y_class_id, 'version': versionVal}, responversionHistory, 'HTML');

});


function responversionHistory(d, s) {

    $("#version-class-div").html(d);
    var getVersion = $.trim($(".list-row.current").find('td').eq(4).html());
    $(".version-tree-structure li .node-content").removeClass('active');

    $("[data-version='" + getVersion + "']").closest('.node-content').addClass('active');
    // $(this).addClass('active');
    // $(this).siblings('a').removeClass('active');
    dualPaneHeight();
    $('#version-class-div').removeClass('hide');
    $('#second-class-div').addClass('hide');
    $('#main_action_menu').hide();
    $('#version_action_menu').show();
    $('.structureDiv').removeClass('active');
    $('.versionDiv').addClass('active');

    //added-code-version-div-active-classes-clicked
    $("body").on("click", ".classes_top_cl", function (e) {
        e.stopPropagation();
        if ($(".versionDiv").hasClass("active")) {
            $("#main_action_menu a[style*='block'], #main_action_menu a:visible").addClass("hide");
        }
    });


}

function ActorFlyout() {
    $('.ActorFlyoutOpen').on('click', function () {
        $("#ActorFlyout.rightFlyout").animate({right: '0px'}).addClass('in');
        setTimeout(function () {
            sideFlyoutHeight();
            $('#ActorFlyout .courseflyout .left-head').width($('#ActorFlyout .courseflyout').width());
        }, 300);
        $(".nano").nanoScroller();
    });

    $('.ActorFlyoutClose').on('click', function () {
        $("#ActorFlyout.rightFlyout").animate({right: '-100%'}).removeClass('in');
    });
}
var topheader = $('.header-wrapper').outerHeight();
var footerHig = $('.breadcrumb-wrap').outerHeight();
var windowHig = $(window).height();
var leftPaneWid = 265;
var FirstPaneWid = 200;
var mainHig = windowHig - footerHig - topheader;
var newCourseFlyoutWidth = $(".left-menu-pane").outerWidth();
var totalLeftPaneWidth = leftPaneWid + newCourseFlyoutWidth;

function leftpaneflyout() {
    newCourseFlyout();
    openCourseFlyout();

}

function newCourseFlyout() {

    $('body').on('mouseenter', '#new-course-flyout', function () {

        if (!$('#new-course-first-pane').hasClass('in')) {
            $(this).closest('.panel.actionMenu').siblings('.course-filter-view').addClass('hide');
            $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
            $('#new-course-first-pane').removeClass('removeActionPanel');
            $('#new-course-first-pane').animate({left: leftPaneWid}, 300).addClass('in');

            var data_id = $(this).children('a').attr('data-id');
            var data_original_title = $(this).children('a').attr('data-original-title');
            var menu_id = data_id.replace(data_original_title, '').split('_')[0];
            sideFlyoutHeight();
            //NProgress.start();
            $.post(domainUrl + 'classes/getCourseMenuList', {'menu_id': menu_id}, fillCourseFlyout, 'html');
            event.stopPropagation();
        } else {

            $('#new-course-first-pane').animate({left: 0}, 300).removeClass('in');
            $('#new-course-secound-pane').animate({left: 0}, 300).removeClass('in');
        }
    });

    $("body").on('click', '#first-pane > li .openTempPane', function (event) {
        $('#new-course-first-pane').addClass('removeActionPanel');
        $('#new-course-secound-pane').animate({left: leftPaneWid + FirstPaneWid}, 300).addClass('in');

        event.stopPropagation();
    });

    $("body").on('click', '#secound-pane > li', function (event) {

        $('#new-course-secound-pane').animate({left: '0px'}, 300).removeClass('in');
        $('#new-course-first-pane').animate({left: '0px'}, 300).removeClass('in');

        event.stopPropagation();
    });

}
function openCourseFlyout() {

    $("body").on('click', '#open-course-flyout', function (event) {
        var selectedMenu = $('li.first-level-menu.active._active').attr('id');
        if (selectedMenu == "116_resources") {
            // open documents
            NProgress.start();

            $.post(domainUrl + 'documents/getAllDocs', {}, responseGetAllDocuments, 'html');
        }
        else if (selectedMenu == "97_course") {
            NProgress.start();
            $.post(domainUrl + 'courses/getAllCourse', {}, responseGetAllDocuments, 'html');

        } else { // add condition for course if req.
            // open course

            $(this).closest('.panel.actionMenu').siblings('.course-filter-view').removeClass('hide');
            $('#new-course-secound-pane').animate({left: '0px'}, 300).removeClass('in');
            $('#new-course-first-pane').animate({left: '0px'}, 300).removeClass('in');
            alert('openCourseFlyout')
            closeDocumentFlyout();
            $('#openCourseFlyout').animate({left: '265px'}, 300).addClass('in');
            // $('#openCourseFlyout').find('left-head').width();
            setTimeout(function () {
                sideFlyoutHeight();
            }, 300);
            $(".loadder").show();
            $(".nano").nanoScroller();
            event.stopPropagation();
        }
    });
    $("body").on('click', '.close-open-course-flyout', function (event) {
        $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
        $(".loadder").hide();
    });

}

function responseGetAllDocuments(data, source) {

    var selectedMenu = $('li.first-level-menu.active._active').attr('id');

    if (selectedMenu == "97_course") {
        $('#openCourseFlyout').find('span.main-title').html('Course Instance: List');
        var thi1 = $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(0) span i').get(0).outerHTML;
        $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(0) span').html("COURSE TITLE" + thi1);
        var thi2 = $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(1) span i').get(0).outerHTML;
        $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(1) span').html("TYPE" + thi2);
        data = JSON.parse(data);

        var td_html = '';
        $.each(data, function () {
            td_html += '<tr class="dialogueViewWrap" onclick="gridcourseClassView(\'' + this.node_instance_id + '\',\'' + this.node_id + '\',\'' + this.type + '\',\'' + this.value + '\')"><td>' + this.value + '</td><td>' + this.type + '</td></tr>';
        });
    }
    else {
        $('#openCourseFlyout').find('span.main-title').html('Document Instance: List');
        var thi1 = $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(0) span i').get(0).outerHTML;
        $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(0) span').html("DOCUMENT TITLE" + thi1);
        var thi2 = $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(1) span i').get(0).outerHTML;
        $('#openCourseFlyout').find('.open-course-table.table-head thead tr th:eq(1) span').html("STATUS" + thi2);
        data = JSON.parse(data);
        var td_html = '';
        $.each(data, function () {
            var status = (this.status == 0) ? 'Draft' : 'Published';
            td_html += '<tr class="dialogueViewWrap" onclick="loadDocument(\'' + this.node_instance_id + '\',\'' + this.node_id + '\',\'' + this.value + '\')"><td>' + this.value + '</td><td>' + status + '</td></tr>';
        });
    }


    $('#openCourseFlyout').find('.nano-content.fixedTableHig tbody').html(td_html);


    //$(this).closest('.panel.actionMenu').siblings('.course-filter-view').removeClass('hide');
    //$('#new-course-secound-pane').animate({left:'0px'},300).removeClass('in');
    //$('#new-course-first-pane').animate({left:'0px'},300).removeClass('in');
    closeDocumentFlyout();
    $('#openCourseFlyout').animate({left: leftPaneWid}, 300).addClass('in');
    // $('#openCourseFlyout').find('left-head').width();
    setTimeout(function () {
        sideFlyoutHeight();
    }, 300);
    $(".loadder").show();
    $(".nano").nanoScroller();
    NProgress.done();
    event.stopPropagation();
}

function loadDocument(node_instance_id, node_id, title, foldertype) {
    NProgress.start();

    $('#openCourseFlyout').animate({left: 0}, 300, function () {
    }).removeClass('in');

    /*
     * Added By: Divya Rajput
     * On date: 27th May 2016
     * Purpose: set localStorage variable accordingly as either it is opened by open Document section or by double click on
     */
    if ($.trim(foldertype) === 'normal') {
        localStorage.removeItem('loaddocument');
    } else {
        $.post(domainUrl + 'documents/getRootParent', {'node_x_id': node_id}, responseParentData, 'html');
    }
    /*End Here*/


    /*
     * Modified By: Divya Rajput
     * On Date: 18th May 2016
     * Purpose: When double click of folder's Dialog instances, make a save button inactive
     */
    $("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');
    /*End Here*/

    $.post(domainUrl + 'documents/index', {'node_instance_id': node_instance_id, 'node_id': node_id}, responseCallAction, 'html');
    globalTitle = title;
}

/*
 * Added By: Divya Rajput
 * On date: 27th May 2016
 * Purpose: to set loaddocument variable in localStorage when click on Folder Resource's instances by open Document Section
 */
function responseParentData(data, s)
{
    localStorage.setItem('loaddocument', data);
    localStorage.removeItem('resourcedata');
}
/*End Here*/

function getChildMenu(menu_id) {
    var parentMenu = courseMenu[menu_id];
    var childMenu = parentMenu.child;
    $('#new-course-secound-pane').find('#secound-pane').html('');
    var html = '';
    for (var key in childMenu) {
        for (var key1 in childMenu[key]) {
            if (key1 == 'menu') {
                //childMenu[key][key1]
                var menu_id = childMenu[key]['menu_id'];
                var menu_name = childMenu[key][key1];
                var menu_name_wo_space = menu_name.replace(/\s/g, '');
                html += '<li class="inactive"><a style="cursor:pointer;" data-id="' + menu_id + '_' + menu_name + '" data-original-title="' + menu_name + '" class="strat_click">' + menu_name + '</a></li>';

            }
        }
    }
    $('#new-course-secound-pane').find('#secound-pane').html(html);
}

function fillCourseFlyout(data, source) {
    $('#first-pane').html('');
    var courseNewCourse = JSON.parse(data);
    courseMenu = courseNewCourse.child;
    for (var key in courseMenu) {
        for (var key2 in courseMenu[key]) {
            if (key2 == 'menu') {
                var menu_name_wo_space = courseMenu[key]['menu'].replace(/[_]/g, '');
                //$('#first-pane').append('<li onclick="javascript:getChildMenu(' + courseMenu[key]['menu_id'] + ')"><a class="createCourses"><span>' + courseMenu[key][key2] + '</span></a><a class="openTempPane"><i class="fa fa-angle-right"></i></a></li>');
                $('#first-pane').append('<li ><a class="createCourses" onclick="javascript:getCenterContent(this,' + courseMenu[key]['menu_id'] + ',\'' + menu_name_wo_space + '\')"><span>' + courseMenu[key][key2] + '</span></a><a class="openTempPane" href="javascript:getChildMenu(' + courseMenu[key]['menu_id'] + ')"><i class="icon template"></i></a></li>');
            }
        }
    }

    NProgress.done();
}


function coursePathNumbering() {
    $('#course-path-number').removeClass('inactive');
    var snippet = '<div class="nextPrevButton hide">';
    snippet += '<ul>';
    snippet += '<li class="disable"><a href="#" class="prevBtn"><i class="icon icon-prev"></i></a></li>';
    snippet += '<li><a href="#" onclick="saveGridNav()"><i class="icon lg-save"></i></a></li>';
    snippet += '<li><a href="#" onclick="gridNavigation.nextNumSelect()" class="nextBtn"><i class="icon icon-next"></i></a></li>';
    snippet += '</ul>';
    snippet += '</div>';

    $('body').append(snippet);
    $('#course-path-number').unbind("click");
    $('#course-path-number').click(function (event) {
        $(this).toggleClass('On')
        if ($(this).hasClass('On')) {
            $('.grid-div td').find('.table-count').removeClass('hide').addClass('show');
            $('.nextPrevButton').removeClass('hide');
            /*course path number*/
            $('.fixed-left-column [class*=parent_]').not(':first').nextAll().addClass('show_number_grey');
            $('.table-count:first').addClass('activeNum');
            $('.activeNum').closest('td').addClass('border-green bg-green border-bottom-green');
        }
        else {
            $('.grid-div td').find('.table-count').removeClass('show').addClass('hide');
            $('.nextPrevButton').addClass('hide');
            /*course path number*/
            $('.fixed-left-column [class*=parent_]').removeClass('show_number_grey');
            $('.fixed-left-column').find('.border-green, .bg-green, .border-bottom-green').removeClass('border-green bg-green border-bottom-green');
            $('.fixed-left-column').find('.activeNum').removeClass('activeNum');
        }
        event.stopPropagation();
    });
}



function cellFlyout() {
    var getWidth = $('#center-screen').outerWidth() / 2;

    var getTopHig = $('#center-screen .fixed-top-header').outerWidth();
    var getOutrHig = $('#center-screen .fTHLC-outer-wrapper').outerWidth();
    var getInrHig = $('#center-screen .fTHLC-inner-wrapper').outerWidth();

    var setTopHig = getTopHig / 2;
    var setOutrHig = getOutrHig / 2;
    var setInrHig = getInrHig / 2;

    if ($('#CellRightFlyout').hasClass('in')) {
        setTimeout(function () {
            $('#CellRightFlyout .courseflyout, #CellRightFlyout .left-head').width(getWidth);
        }, 500);
    }

    $('.node-white-circle').on('dblclick', function (event) {
        $('.node-circle').removeClass('openflyout node-green-circle');
        $(this).toggleClass('openflyout node-green-circle');
        if ($(this).hasClass('openflyout')) {
            $('#CellRightFlyout').animate({right: '0px'}).addClass('in');
            setTimeout(function () {
                sideFlyoutHeight();
                $('#CellRightFlyout').width(getWidth + 60);
                $('#CellRightFlyout .courseflyout, #CellRightFlyout .left-head').width(getWidth);

            }, 300);
            setTimeout(function () {
                // processDualPaneWidth();
            }, 700);
            $(".nano").nanoScroller();
        }
        else {
            $('.node-circle').removeClass('openflyout node-green-circle');
            $('#CellRightFlyout').animate({right: '-100%'}).removeClass('in');

        }
        event.stopPropagation();
    });

    $('.CellRightFlyoutClose').on('click', function (event) {
        $('#CellRightFlyout').animate({right: '-100%'}).removeClass('in');
        $('.viewClassFlyout').removeClass('openflyout node-green-circle');
        $('.node-circle').removeClass('openflyout node-green-circle');
        event.stopPropagation();
    });

    function processDualPaneWidth() {
        if ($('td.col-1').hasClass('collapse')) {
            $('#center-screen .fixed-top-header').width(setTopHig - 40)
            $('#center-screen .fTHLC-outer-wrapper').width(setOutrHig - 40)
            $('#center-screen .fTHLC-inner-wrapper').width(setInrHig - 40);
        }
        else {
            $('#center-screen .fixed-top-header').width(setTopHig - 140)
            $('#center-screen .fTHLC-outer-wrapper').width(setOutrHig - 140)
            $('#center-screen .fTHLC-inner-wrapper').width(setInrHig - 140);
        }
    }

    function processSinglePaneWidth() {
        $('#center-screen .fixed-top-header').width(getTopHig)
        $('#center-screen .fTHLC-outer-wrapper').width(getOutrHig)
        $('#center-screen .fTHLC-inner-wrapper').width(getInrHig);
    }
}

function caretInsert() {
    $('#edt').focus();
}


function setDocNiceScroll() {
    $('.mainScroll').bind('scroll', function () {
        var getTopPosition = $(this).getNiceScroll(0).getScrollTop();
        //  $('.leftScroll').getNiceScroll(0).setScrollTop(getTopPosition);
        // $(".leftScroll").getNiceScroll().hide();
    });
}
function ChangeAlignment() {
    var docM = $('#documentMode');
    $('#OnOffMode li').click(function () {

        $('#OnOffMode li').removeClass('active');
        $(this).addClass('active');

        if ($(this).data('value') == "structured") {
            docM.val('structured');
            docM.trigger('change');
        }
        else if ($(this).data('value') == "unstructured") {
            $(this).addClass('active');
            docM.val('unstructured');
            docM.trigger('change');
        }
        setDocEntryHig();
        manageDocEdtHig();


    });
    $('#changeDocMode').on('change', function () {

        var getOptionVal = $(this).find('option:selected').data('value');

        if (getOptionVal == "potrait") {
            $('#printLandscape').prop("checked", true);
            $('#printLandscape').trigger("click");
        }
        else {
            $('#printLandscape').prop("checked", false);
            $('#printLandscape').trigger("click");
        }

    });
    $('#printMode').click(function () {
        $(this).toggleClass('inactivePrintMode');
        if ($(this).hasClass('inactivePrintMode')) {
            $('#viewOpts').val('default');
            $('#viewOpts').trigger('change');
        }
        else {
            $('#viewOpts').val('a4')
            $('#viewOpts').trigger('change');
        }
    });
}



function AddUserEntry() {
    var snippet = '<tr><td><select class="select-field">'
            + '<option>Owner</option>'
            + '<option selected>Collaborator</option>'
            + '</select></td>'
            + '<td><div class="userName">'
            + '<i class="icon by-actor"></i>'
            + '<span> %value% </span>'
            + '</div></td>'
            + '<td><div class="checkbox">'
            + '<label><input type="checkbox"></label>'
            + '</div></td>'
            + '<td><div class="checkbox">'
            + '<label><input type="checkbox"></label>'
            + '</div></td>'
            + '<td><div class="checkbox">'
            + '<label><input type="checkbox"></label>'
            + '</div></td>'
            + '<td><i class="icon close ref-removeUser"></i></td></tr>';


    setTimeout(function () {
        setDocHig();
    }, 300);

    $('body').off('keypress', '#File.in .ref-addMore-user input');
    $('body').on('keypress', '#File.in .ref-addMore-user input', function (e) {
        var getValue = $(this).val();
        var snip = snippet.replace('%value%', getValue);


        if (e.which == 13) {

            $("#File.in .ref-listed-user tr").last().after(snip);
            $('#File.in .ref-addMore-user input').val('');
            setTimeout(function () {
                setDocHig();
            }, 300)
            return false;
        }
    });
    $('body').on('click', '#File.in .ref-removeUser', function (e) {
        $(this).closest('tr').remove();
        setTimeout(function () {
            setDocHig();
        }, 300)
    });
    $('body').on('click', '.ref-hideTollbar', function (e) {
        $('.tollbar-panel .active').removeClass('active');
        $('.loadder').hide();
        $('.doc-tollbar a').removeClass('disabledField');
        /*
         * Added by: Divya
         * On date: 4th MAy 2016
         * Purpose: to display none, parent class of a tag
         */
        $('.action-file1').hide();
        $('.action-file2').hide();
        /*End Here*/
    });

    $('body').on('click', '.doc-tollbar a', function (e) {
        $(this).parent('li').siblings('li').children('a').addClass('disabledField');
        $('.loadder').show();

    });

}
function setDocHig() {
    var getLength = $('#File.in .listedEntry tr').length;
    var getHig = getLength * 36;


    var outerWrapHig = $('.doc-tollbar-wrap .tab-pane').outerHeight();
    var innerWrapHig = $('#File.in .doc-file-pane .file-pane').eq(2).find('table').eq(0).outerHeight() +
            $('#File.in .doc-file-pane .file-pane').eq(2).find('table').eq(2).outerHeight() +
            $('#File.in .doc-file-pane .file-pane').eq(0).outerHeight() +
            $('#File.in .doc-file-pane .file-pane').eq(1).outerHeight() +
            $('#File.in .doc-file-pane h2').outerHeight();
    var totalHig = outerWrapHig - innerWrapHig - 55;

    if (totalHig > getHig) {
        $('#File.in .listedEntry').height(getHig);
    }
    else {
        $('#File.in .listedEntry').height(totalHig);
    }

}

function setDocEntryHig() {
    // var sum     =   0;
    // var getHig  =   $('.DocInsideHig ').height();
    // $('.edtParagraph').each(function(i, v){
    //     sum += $(v).height();
    //     if($('#edt').height() < sum){
    //         $('#edt').height(sum);
    //     }
    //     else{
    //        $('#edt').height(getHig);
    //     }
    // });
    //  $('#edt').height($("#edt")[0].scrollHeight);
    if (globalDocumentSaveStatus == 1) {
        var checkSta = $("#document_action_menu").find('#save-document-data').attr('onclick');
        if (checkSta == "saveDocument('D');") {
            $("#document_action_menu").find('.user-roles').find('.document-save').parent().removeClass('inactive');
            globalDocumentSaveStatus = 0;
        }
    }
}

function createDocumentPanel() {

    enableDisablestatus = 0;  // added 1st of july 2016

    NProgress.start();
    $("#tempControler").attr('value', 'documents');
    $("#tempAction").attr('value', 'index');
    $.post(domainUrl + 'documents/index', {}, responseCallAction, 'html');
    $('#newDocumentFlyout').animate({right: '-100%'}, 300, function () {
    }).removeClass('in');
    $('#newDocumentFlyout #File').removeClass('in');
    $('.loadder').hide();

    /*
     * Modified By: Divya Rajput
     * On Date: 25th April 2016
     * Purpose: As same id and class is loding on document page and it is conflicting the data on Document Page
     */
    $('#menudashboard').children().remove();

    /*End Here*/

    $('#documents-screen').show();
    $("#canvas-screen").html('');
    $("#canvas-screen").hide();
    $("#document_action_menu").show();
    $('#helpNoderAnchor').show();
    $(".NewFolder_li").hide();
    $(".DeleteFolder_li").hide();
    $(".NewDocument_li").hide();
    $(".OpenDocument_li").show();
    /*
     * Modified By: Divya Rajput
     * On Date: 18th May 2016
     * Purpose: remove inactive class when open a new document,
     * it will remain inactive when in edit mode
     */
    /*$("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');*/
    $("#document_action_menu").find('#add-document-open').remove();
    caretInsert();
    indexing();
    setColumnsH();

}

function closeDocumentFlyout() {
    $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
    $('.loadder').hide();
    $('#newDocumentFlyout #File').removeClass('in');
    $('.edtHeader  #File').removeClass('in');

}

function folderSection() {
    var getMainWid = $('#folderSection').width();
    var setThreePane = $('#folderSection').width() / 3;
    $('#folderSection .listing-wrapper').width('29%');
    $('#folderSection .display-wrapper').width('69%');

    $("#resizeFolderList, window").resizable({
        handles: "n, e",
        resize: function (event, ui) {
            var getMainWidResize = $('#folderSection').width();
            var wMaxResize = (getMainWidResize / 4) * 3;
            var wMinResize = (getMainWidResize / 4);
            var parent = ui.element.parent();
            var folderListWperc = ui.element.width() / parent.width() * 100;
            var displayWidth = 100 - folderListWperc;

            $('#folderSection .display-wrapper').css({width: displayWidth + '%'});
            ui.element.css({
                width: folderListWperc + '%'
            })
            $("#resizeFolderList").resizable("option", "maxWidth", wMaxResize);
            $("#resizeFolderList").resizable("option", "minWidth", wMinResize);

            if ($('#folderSection .display-wrapper').width() <= 500) {
                $('#folderSection .display-wrapper .main-one-third').css('width', '540px');
            }
            else {
                $('#folderSection .display-wrapper .main-one-third').css('width', '100%');
            }
            manageNiceScroll();

            $("#folder-first-instance-list-div .nice-scroll-box").width('100%');



        },
        stop: function (event, ui) {
            /*var xyz = 0;
             $('.drag-folder a').each(function(i,v){
             var abc = $(this).width();
             if(abc<125){
             if(flag == false){
             xyz = abc;
             flag = true;
             } else{
             if(xyz< abc){
             xyz = abc;
             flag = true;
             }
             }
             }
             });
             if(flag == true){
             var niceScrollWidth = $('#folder-first-instance-list-div .nice-scroll-box').width();
             $('#folder-first-instance-list-div .nice-scroll-box').width(niceScrollWidth+xyz);
             $("#folder-first-instance-list-div .niceScrollDiv").scrollLeft(27);
             flag = false;
             } */



        },
        maxWidth: (getMainWid / 4) * 3,
        minWidth: (getMainWid / 4)
    });
    $('#FolderList li').each(function (i, v) {
        var getChildLen = $(v).children('ul').length;
        if (getChildLen == 0) {
            //$(this).children('.folder-action').find('.fa-angle-up').addClass('hide');
        }
    });
    var DELAY = 500, clicks = 0, timer = null;

    //$('#FolderList li').unbind();
    //  $('body').on('click','#FolderList li',function(event){

    $('#FolderList li').click(function (event) {
        //var node_id = $(this).find('span').attr('data-id');
        $('#FolderList li').removeClass('active');
        var CurrentTarget = event.target;
        $(CurrentTarget).closest('li.drag-folder').addClass("active");
        oddEvenColor();
        var folderId = $(CurrentTarget).closest('li.drag-folder').attr('id');
        /*
         * Added By: Divya Rajput
         * On Date:  24th May 2016
         * Purpose:  to make folder id as global
         */
        globalFolderInstanceID = folderId;
        parentFolderInstanceID = $("#FolderList").find('li.active').closest('.move-parent-folder').attr('id');
        /*End Here*/

        if ($(CurrentTarget).hasClass('fa-angle-up')) {
            if ($('#FolderList li.active').find('.fa-angle-up:first').hasClass('rotate')) {
                $('#FolderList li.active').find('.fa-angle-up').removeClass('rotate');
                $('#FolderList li.active').find(".nested-list").html("");
                //oddEvenColor();
                NProgress.start();
                $("#FolderList li.active").children('a').trigger('click');
            } else {
                $('#FolderList li.active').find('.fa-angle-up:first').addClass('rotate');
                NProgress.start();
                $.post(domainUrl + 'documents/childList', {'node_id': folderId}, responseFolderAction, 'html');

            }
        } else if ($(CurrentTarget).hasClass('plus-class')) {
            createSubfolder(folderId);
        }
        else {
            clicks++;  //count clicks

            setTimeout(function () {

                if (clicks == 1) {

                    // var folderId = $(this).find('span').attr('data-id');
                    NProgress.start();
                    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': folderId}, responseCallFolderDetailsAction, 'html');
                    clicks = 0;
                    oddEvenColor();
                    /* $("#FolderList").find('li:odd').css('background','#F4F4F4');
                     $("#FolderList").find('li:even').css('background','#fff');*/
                    event.stopPropagation();

                } else if (clicks == 2) {

                    if ($('#FolderList li.active').find('.folder-action:first').hasClass('hasChild')) {

                        if ($('#FolderList li.active').find('.fa-angle-up:first').hasClass('rotate')) {
                            $('#FolderList li.active').find('.fa-angle-up').removeClass('rotate');
                            $('#FolderList li.active').find(".nested-list").html("");
                            //oddEvenColor();
                            //$("#FolderList li.active").children('a').trigger('click');
                            NProgress.start();
                            $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': folderId}, responseCallFolderDetailsAction, 'html');

                        } else {

                            if ($('#FolderList li.active').find('.folder-action:first').hasClass('hasChild')) {
                                $('#FolderList li.active').find('.fa-angle-up:first').addClass('rotate');
                                NProgress.start();
                                $.post(domainUrl + 'documents/childList', {'node_id': folderId}, responseFolderAction, 'html');
                            }
                        }
                    }

                    clicks = 0;

                } else {
                    clicks = 0;
                }

                event.stopPropagation();

            }, 500);
        }
        // if(clicks === 1) {
        //         $('#FolderList li').removeClass('active');
        //          var CurrentTarget = event.target;
        //           $(CurrentTarget).closest('li.drag-folder').addClass("active");
        //           var folderId = $(this).find('span').attr('data-id');
        //           $.post(domainUrl+'documents/folderDetails',{'order_by':'node_instance_id','order':'DESC','type':'no-pagination','mode':'Normal','class_node_id':folderId},responseCallFolderDetailsAction,'html');

        //         //$(this).addClass('active');
        //         //$.post(domainUrl+'documents/folderList',{'node_id':node_id},responseFolderAction,'html');

        //     timer = setTimeout(function(event) {
        //         clicks = 0;
        //     }, DELAY);
        // }
        // else {
        //         clearTimeout(timer);
        //         clicks = 0;
        //         //console.log('double click');
        //         if($('#FolderList li.active').find('.folder-action:first').hasClass('hasChild')){
        //             if($('#FolderList li.active').find('.fa-angle-up:first').hasClass('rotate')){
        //                 $('#FolderList li.active').find('.fa-angle-up').removeClass('rotate');
        //                 $('#FolderList li.active').find(".nested-list").html("");
        //             } else{
        //                 $('#FolderList li.active').find('.fa-angle-up:first').addClass('rotate');
        //                 $.post(domainUrl+'documents/childList',{'node_id':node_id},responseFolderAction,'html');
        //             }

        //         }

        //         event.stopPropagation();
        //     }
        event.stopPropagation();
    });
}

$("body").on('click', '.common_name_folder_first', function () {

    var folderName = $.trim($("#Folder_name").val());

    $("#common_name_folder_first").click(function () {
        $("#Folder_name").removeClass("alert-text");
        $(".error-msg").remove();
    })

    if (folderName == "") {
        $(".common_name_folder_first").addClass('inactiveLink');
        //$("#Folder_name").addClass("alert-text");
        //$("#Folder_name").after('<span class="error-msg">Required Field.</span>');
        $(".error-msg").show();
        return false;
    }
    else {
        $(".common_name_folder_first").removeClass('inactiveLink');
        NProgress.start();
        var instance_id = "";
        var parent_id = "";
        $.post(domainUrl + 'documents/saveFolder', {'saveType': "D", 'instance_id': instance_id, 'folderName': folderName, 'parent_id': parent_id}, responseSaveFolderAction, 'html');
        $("#createNewFolder").modal('hide');
    }
});

$("body").on('click', '.common_sub_folder_first', function () {

    var folderName = $.trim($("#Folder_sub_name").val());

    $("#common_sub_folder_first").click(function () {

        $("#Folder_sub_name").removeClass("alert-text");
        $(".error-msg").remove();
    })

    if (folderName == "") {
        $(".common_sub_folder_first").addClass('inactiveLink');
        // $("#Folder_sub_name").addClass("alert-text");
        //$("#Folder_sub_name").after('<span class="error-msg">Required Field.</span>');
        $(".error-msg").show();
        return false;
    }
    else {
        $(".common_sub_folder_first").removeClass('inactiveLink');
        NProgress.start();
        var instance_id = "";
        var parent_id = $("#FolderList").find('li.active').find('span').attr('data-id');
        $.post(domainUrl + 'documents/saveSubFolder', {'saveType': "D", 'instance_id': instance_id, 'folderName': folderName, 'parent_id': parent_id}, responSaveSubFolderAction, 'JSON');
        $("#createSubFolder").modal('hide');
    }
});

/* code here for create root folder click on + icon link */
$("body").on('click', '.common_root_folder_first', function () {
    var folderName = $.trim($("#Folder_root_name").val());

    $("#common_root_folder_first").click(function () {
        $("#Folder_root_name").removeClass("alert-text");
        $(".error-msg").remove();
    })

    if (folderName == "") {
        $(".common_root_folder_first").addClass('inactiveLink');
        //$("#Folder_root_name").addClass("alert-text");
        // $("#Folder_root_name").after('<span class="error-msg">Required Field.</span>');
        $(".error-msg").show();
        return false;
    }
    else {
        $(".common_root_folder_first").removeClass('inactiveLink');
        NProgress.start();
        var instance_id = "";
        var parent_id = "";
        $.post(domainUrl + 'documents/saveFolder', {'saveType': "D", 'instance_id': instance_id, 'folderName': folderName, 'parent_id': parent_id}, responseSaveFolderAction, 'html');
        $("#createRootFolder").modal('hide');
    }
});

function responseSaveFolderAction(d, s) {

    $('.content-wrapper-new').siblings('.user-action-wrap').hide();
    $.post(domainUrl + 'documents/folderList', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal'}, responseCallAction, 'html');
}

function responSaveSubFolderAction(d, s) {

    var folderId = $("#FolderList").find('li.active').find('span').attr('data-id');
    if ($("#" + folderId + " .folder-action:first").hasClass('noChild')) {
        $("#" + folderId + " .left-folder-action").append('<i class="fa fa-angle-up"></i>');
        $("#" + folderId + " .folder-action").addClass('hasChild').removeClass('noChild');
    }
    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': folderId}, responseCallFolderDetailsAction, 'html');
}

function responseCallAction1(d, s) {

    $("#documents-screen").html(d);
    $('#documents-screen').show();
    folderSection();
    caretInsert();
    rangeInitialize();
    indexing();
    autoEDTHeightCheck();
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
    $('#newDocumentFlyout').animate({right: '-100%'}, 300).removeClass('in');
    $('#openCourseFlyout').animate({left: 0}, 300).removeClass('in');
    $('.loadder').hide();
    $('#newDocumentFlyout #File').removeClass('in');
    $('.edtHeader  #File').removeClass('in');

    $("#document_title").val(globalTitle);
    var getVal = $("#document_title").val();
    if (!getVal == "") {
        var getdata = $("#document_title").val().length;
        $('.charCount').text(getdata);
    }

    var checkSta = $("#document_action_menu").find('.user-roles').attr('onclick')
    if (checkSta == "saveDocument('D');") {
        $("#document_action_menu").find('.user-roles').find('.document-save').parent().addClass('inactive');
        globalDocumentSaveStatus = 1;
    }

    /*
     * Added By: Divya Rajput
     * On Date:  26th May 2016
     * Purpose:  get Document html from localstoage
     * So that when any instance of resource folder is selected, by default selected resource retained when click on close icon of document
     */
    var loaddocument = localStorage.getItem('loaddocument');
    if ($.trim(loaddocument) != '' && typeof loaddocument != 'undefined') {

        globalFolderInstanceID = loaddocument;

    } else {

        var resourceHtml = localStorage.getItem('resourcedata');

        if ($.trim(resourceHtml) != '' && typeof resourceHtml != 'undefined') {
            $("li#" + parentFolderInstanceID).html(resourceHtml);
        }
    }
    /*End Here*/

    /*
     * Modified By:  Divya Rajput
     * On Date:      26th May 2016
     * Purpose:      to add class active on that folder resource id which is bydefault selected or manually selected
     */
    /*$("#FolderList").find('li:eq(0)').addClass('active');*/ //Commented By Divya Rajput
    $("#FolderList").find('li#' + globalFolderInstanceID).addClass('active');
    /*End Here*/

    DragDropFolder();
    var class_node_id = $("#FolderList").find('li.active').find('span').attr('data-id');
    $.post(domainUrl + 'documents/folderDetails', {'class_node_id': class_node_id, 'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal'}, responseCallFolderDetailsAction, 'html');

    NProgress.done();
}

function responseCanvasHtml(d, s) {
    $("#documents-screen").html('');
    $("#documents-screen").hide();
    $("#canvas-screen").html(d);
    $("#canvas-screen").show();
    fetchClasses();
    $('#canvas_action_menu').show();
    setColumnsH();
    manageNiceScroll();
    $( ".dragELM" ).draggable({
        cancel: false,
        drag: function( event, ui ) {
        $(this).width($(this).width());
        },
        stop: function( event, ui ) {
        $(this).width($(this).width());
        }
    });
    $(".dragELM").resizable();
    $(".dragELM").resizable("destroy");
    NProgress.done();

}

function responseFolderAction(d, s) {

    var dataid = $("#FolderList").find('li.active').find('span').attr('data-id');
    $("#childList_" + dataid).html(d);
    var getChildLen = $("#FolderList").find('li.active').children('ul').length;
    var childList = $("#childList_" + dataid);

    if (getChildLen > 0) {
        $("#FolderList").find('li.active').toggleClass('expandFolder');
    }

    if ($("#FolderList").find('li.active').hasClass('expandFolder')) {
        $("#FolderList").find('li.active').children('ul').show();
    }
    else {
        $(this).children('ul').hide();
        //folderListWidth(childList);
    }
    $("#FolderList li.active").children('a').trigger('click');
    DragDropFolder();
    increaseFolderWidthEdit();
    oddEvenColor();
}

function responseMoveFolderAction(d, s)
{
    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': d.destination_id}, responseCallFolderDetailsAction, 'html');
    //$.post(domainUrl+'documents/childList',{'node_id':d.destination_id},responseFolderAction,'html');
}

function responseMovePositionAction(d, s) {

    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': d.destination_id}, responseCallFolderDetailsAction, 'html');
}
/*code here use to display folder details after move document*/

function responseMoveDocumentAction(d, s)
{
    $.post(domainUrl + 'documents/childfolderList', {'node_id': InitalDragFolderId}, responseFolderChildAction, 'JSON');
    $.post(domainUrl + 'documents/folderDetails', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 'Normal', 'class_node_id': d.destination_id}, responseCallFolderDetailsAction, 'html');
}

function DragDropFolder() {
    //var htmlStr = "<br><img id=\"dragMoveImg\" src = \"public/img/folder.gif\" class=\"movingImg\">";
    var htmlStr = "<div style=\"display:none;z-index:100;\" id=\"dragMoveImg\" ><img  src = \"public/img/folderIcon.png\" class=\"movingImg\"><span class=\"selectedFilesCount\">4</span><span class=\"not-dropable\"><img style=\"width: 12px;height: 12px;\" src = \"public/img/restrict.png\"></span></div>"
    $("body").append(htmlStr);

    $("body").on("click", function (e) {
        if (!$(e.target).hasClass("multiclicked")) {
            selectedFolder_arr = [];
            $(".multiclicked").removeClass("multiclicked");
        }
    })
    var timeoutid = 0;
    $('li.drag-folder').drag(function (ev, dd) {
        var lastTop = 0;
        var lastleft = 0;
        // if (!$(this).is(':hover')) {
        $("#dragMoveImg").css({
            top: ev.pageY + 5,
            left: ev.pageX,
            display: "block",
            position: "absolute"
        }).find('.selectedFilesCount').html(selectedFolder_arr.length);
        //  autoScrolling();
    });

    $('li.drag-folder').mousedown(function (e) {
        $('li.drag-folder').removeClass('multiclicked parentMoveNotAllowed active');
        $(this).addClass("active multiclicked");
        selectedFolder_arr = [];
        selectedFolder_arr.push($(this).attr('id'));
        var SelectedNodeId = $(this).attr('id');
        $("#childList_" + SelectedNodeId + " li").addClass('parentMoveNotAllowed');
        $(this).addClass('parentMoveNotAllowed');
        folderListId = SelectedNodeId;
    });

    $("body").on('mouseover', function (e) {
        var CurrentTarget = e.target;
        if ($("#dragMoveImg").css("display") == "block") {
            if ($(CurrentTarget).closest('li.drag-folder').hasClass("parentMoveNotAllowed") || !$(CurrentTarget).closest('#FolderList').hasClass("fixedTableHig")) {
                $('.not-dropable').show();
            }
        }
    })

    $("body").on({
        mouseover: function (e) {
            var CurrentTarget = e.target;
            var selectedNodeId = parseInt(selectedFolder_arr[0]);
            $('.folder-action i.plus-class').hide();
            $(CurrentTarget).closest('li.drag-folder').find('.folder-action:first i.plus-class').show();
            var dragId = $(CurrentTarget).closest('li.drag-folder').attr('id');
            var snip = '<li id="snip_123" style = "border:1px solid #B7E9FB;height: 32px;display:block" class ="drag-folder customDrop"></li>'
            $("#FolderList li").removeClass("multiclicked");
            if ($("#dragMoveImg").css("display") == "block") {
                if (!$(CurrentTarget).closest('li.drag-folder').hasClass("parentMoveNotAllowed")) {
                    if (!$(CurrentTarget).closest('li.drag-folder').hasClass("fDetailMoveNotAllow")) {
                        $("#FolderList li").removeClass("active");
                        $(CurrentTarget).closest('li.drag-folder').addClass("active");
                        if (!$(CurrentTarget).closest('li.drag-folder').hasClass("moveNotAllowed")) {
                            if ($(CurrentTarget).closest('li.drag-folder').hasClass('move-parent-folder') && !$(CurrentTarget).closest('li.move-parent-folder').hasClass('parentMoveNotAllowed') && !$(CurrentTarget).closest('li.drag-folder').next().hasClass('parentMoveNotAllowed')) {
                                $('.customDrop').remove();
                                ParentPositionId = $(CurrentTarget).closest('li.drag-folder').attr('id');
                                $(CurrentTarget).closest('li.drag-folder').after(snip);
                            }
                        }
                        $('.not-dropable').hide();
                        oddEvenColor();
                    }
                }
                else {

                    if ($(CurrentTarget).closest('li.drag-folder').hasClass("parentMoveNotAllowed") || !$(CurrentTarget).closest('#FolderList').hasClass("fixedTableHig")) {
                        $('.not-dropable').show();
                    }

                }
                autoScrolling();

            }



            e.stopPropagation();
        },
        mouseleave: function (e) {

            $('.folder-action i.plus-class').hide();
            $('.not-dropable').show();
            scrolling = false;
            //  $('.customDrop').remove();
            // if($( "#dragMoveImg" ).css("display") == "block"){
            //     $("#FolderList li.multiclicked").addClass("active");
            //     if($("#FolderList li.multiclicked").length >0){
            //          $("#FolderList li").removeClass("active");
            //           oddEvenColor();
            //     }
            // }
            //scrolling = false;
        }
    }, "#FolderList li");
}

function responseCallFolderDetailsAction(d, s) {
    $('li.drag-folder').removeClass('multiclicked');
    $("#first-folder-details").html(d);
    DragDropFolderDocumentDetailsCall();
    sideFlyoutHeight();
    if ($('#folderSection .display-wrapper').width() <= 500) {
        $('#folderSection .display-wrapper .main-one-third').css('width', '540px');
    }
    else {
        $('#folderSection .display-wrapper .main-one-third').css('width', '100%')
    }
    manageNiceScroll();
    $(".nano").nanoScroller();
    FolderListarr = [];
    $(".selected-list").removeClass("selected-list");
    PrevFirst = 0;
    PrevLast = 0;
    lastCTRLclick = "";
    LastClick = "";
    NProgress.done();
    var InitalFlag = true;
    $('.folder-document-details').drag(function (ev, dd) {
        if (!$(this).hasClass("no-record")) {
            if (InitalFlag == true) {
                InitalDragFolderId = $('li.drag-folder.active').attr('id');
                //console.log("parentId.........",InitalDragFolderId);
                InitalFlag = false;
            }
            if (ev.ctrlKey) {
                selectedFolder_arr = [];
                $("#delete-folder-document").removeClass("inactiveLink");
                $("li.move-parent-folder").addClass("moveNotAllowed");
                $(this).addClass('selected-list');
                var currentId = $(this).data('id');
                $(".drag-folder#" + currentId).addClass('fDetailMoveNotAllow');
                if (jQuery.inArray(currentId, FolderListarr) == '-1') {
                    //   $('.folder-detail tr').removeClass('selected-list');
                    //  FolderListarr = [];
                    FolderListarr.push($(this).data('id'));
                    $(this).addClass("selected-list");
                    var folderDetailId = $(this).data('id');
                    $(".drag-folder#" + folderDetailId).addClass('fDetailMoveNotAllow');
                    PrevFirst = $(this).index();
                    PrevLast = $(this).index();
                    lastCTRLclick = $(this).index();
                }
            } else {
                selectedFolder_arr = [];
                $("#delete-folder-document").removeClass("inactiveLink");
                $("li.move-parent-folder").addClass("moveNotAllowed");
                var currentId = $(this).data('id');
                if (jQuery.inArray(currentId, FolderListarr) == '-1') {
                    $('.folder-detail tr').removeClass('selected-list');
                    $(".drag-folder").removeClass('fDetailMoveNotAllow');
                    FolderListarr = [];
                    FolderListarr.push($(this).data('id'));
                    $(this).addClass("selected-list");
                    var folderDetailId = $(this).data('id');
                    $(".drag-folder#" + folderDetailId).addClass('fDetailMoveNotAllow');
                    PrevFirst = $(this).index();
                    PrevLast = $(this).index();
                    lastCTRLclick = $(this).index();

                } else {
                    $(this).addClass("selected-list");
                    var folderDetailId = $(this).data('id');
                    $(".drag-folder#" + folderDetailId).addClass('fDetailMoveNotAllow');
                }


            }

            //if (!$(this).is(':hover')) {
            $("#dragMoveImg").css({
                top: ev.pageY + 5,
                left: ev.pageX,
                display: "block",
                position: "absolute"
            }).find('.selectedFilesCount').html(FolderListarr.length);
            // }
        } else {
            return false;
        }
    });
    $("#delete-folder-document").addClass("inactiveLink");
    oddEvenColor();
    NProgress.done();
    //$("#folderDocumentModal").modal('hide');
}

function responseFolderChildAction(d, s) {

    if (d.child == 0)
    {
        $("#" + d.parentId + " .left-folder-action").html('');
        $("#" + d.parentId + " .folder-action").addClass('noChild').removeClass('hasChild');
    }

}

function manageCourseTitle() {
    $('.refCourseTitleEdit input').focus();
    $('body').on('click', '.refCourseTitleView', function (event) {
        $(this).addClass('hide');
        $(this).siblings('.refCourseTitleEdit').removeClass('hide');
        $('.refCourseTitleEdit input').focus();
        event.stopPropagation();
    });
    $('body').on('click', '.refCourseTitleEdit > i.tick', function (event) {
        var getValue = $(this).siblings('input').val();
        $(this).closest('.refCourseTitleEdit').addClass('hide');
        if (getValue == '') {
            $(this).closest('.refCourseTitleEdit').siblings('.refCourseTitleView').find('label').text('Undefined');
        }
        else {
            $(this).closest('.refCourseTitleEdit').siblings('.refCourseTitleView').find('label').text(getValue);
        }
        $(this).closest('.refCourseTitleEdit').siblings('.refCourseTitleView').removeClass('hide');
        event.stopPropagation();
    });
}
function increaseFolderWidthEdit() {
    var nodeSelected = $('.drag-folder.active a').width();
    var diffParentChild, niceScrollWidth, parentContainerW, moveScrollLeft;
    if (nodeSelected < 125) {
        niceScrollWidth = $('.nice-scroll-box').width();
        diffParentChild = parseInt($('.drag-folder.active').parents('ul:eq(1)').width() - $('.drag-folder.active').parents('ul:eq(0)').width())
        $('.nice-scroll-box').width(niceScrollWidth + diffParentChild);
        parentContainerW = $('.niceScrollDiv').width();
        moveScrollLeft = $('.nice-scroll-box').width() - parentContainerW;
        $(".niceScrollDiv").scrollLeft(moveScrollLeft);
    }
}

function OperationPane() {
    $(".setnicescroll").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });

    var GetHig = $('.fTHLC-inner-wrapper').outerHeight();
    var getTopWid = $('#center-screen .fixed-top-header').outerWidth();
    var getOutrWid = $('#center-screen .fTHLC-outer-wrapper').outerWidth();
    var getInrWid = $('#center-screen .fTHLC-inner-wrapper').outerWidth();

    var setTopWid = getTopWid - 300;
    var setOutrWid = getOutrWid - 300;
    var setInrWid = getInrWid - 300;

    setTimeout(function () {
        var getTopHig = $('.center-div .fixed-top-header').outerHeight();
        $('.setnicescroll').height(GetHig - getTopHig);
    }, 500);

    if ($('#operationPaneFlyout').hasClass('in')) {
        setTimeout(function () {
            RoleDualPaneWidth(setTopWid, setOutrWid, setInrWid);
        }, 500);
    }
    else {
        RoleSinglePaneWidth(getTopWid, getOutrWid, getInrWid);
    }

    $('.operationPaneFlyoutClose').on('click', function (event) {
        $('#operationPaneFlyout').animate({right: '-100%'}).removeClass('in');
        RoleSinglePaneWidth(getTopWid, getOutrWid, getInrWid);
        setTableWidth();
        event.stopPropagation();
    });


    // $('.process-grid .fTHLC-inner-wrapper').bind('scroll', function(event){
    //     var getTopPosition = $(this).getNiceScroll(0).getScrollTop();
    //     $('.setnicescroll').getNiceScroll(0).setScrollTop(getTopPosition);
    //     event.stopPropagation();
    //     return false;
    //     $('.setnicescroll').css('overflow','hidden');
    // });
    // $('.setnicescroll').bind('scroll', function(event){
    //     var getTopPosition = $(this).getNiceScroll(0).getScrollTop();
    //     $('.process-grid .fTHLC-inner-wrapper').getNiceScroll(0).setScrollTop(getTopPosition);
    //     event.stopPropagation();
    //     return false;
    //     $('.process-grid .fTHLC-inner-wrapper').css('overflow','hidden');
    // });

    // $('.manageScrollDiv').bind('scroll', function(e){
    //     if($(this).hasClass('fTHLC-inner-wrapper')){
    //         console.log('left section.............');
    //         var getTopPosition = $(this).getNiceScroll(0).getScrollTop();
    //         $('.setnicescroll').getNiceScroll(0).setScrollTop(getTopPosition);
    // $('.manageScrollDiv').getNiceScroll(0).remove();
    // $(".manageScrollDiv").niceScroll({
    //     cursorcolor: "#909090",
    //     cursorborder: "0",
    //     cursorborderradius: '0',
    //     cursorwidth: "5px",
    //     background: 'rgba(0,0,0,.25)'
    // });
    //         e.stopPropagation();
    //     }
    //     else{
    //         console.log('Right section.............');
    //         var getTopPosition = $(this).getNiceScroll(0).getScrollTop();
    //         $('.process-grid .fTHLC-inner-wrapper').getNiceScroll(0).setScrollTop(getTopPosition);
    //         $('.manageScrollDiv').getNiceScroll(0).remove();
    //         $(".manageScrollDiv").niceScroll({
    //             cursorcolor: "#909090",
    //             cursorborder: "0",
    //             cursorborderradius: '0',
    //             cursorwidth: "5px",
    //             background: 'rgba(0,0,0,.25)'
    //         });
    //         e.stopPropagation();
    //     }

    //  });

}

function RoleDualPaneWidth(setTopWid, setOutrWid, setInrWid) {
    if ($('td.col-1').hasClass('collapse')) {
        $('#center-screen .fixed-top-header').width(setTopWid + 3)
        $('#center-screen .fTHLC-outer-wrapper').width(setOutrWid)
        $('#center-screen .fTHLC-inner-wrapper').width(setInrWid);
    }
    else {
        $('#center-screen .fixed-top-header').width(setTopWid - 97)
        $('#center-screen .fTHLC-outer-wrapper').width(setOutrWid - 100)
        $('#center-screen .fTHLC-inner-wrapper').width(setInrWid - 100);
    }


}
function RoleSinglePaneWidth(getTopWid, getOutrWid, getInrWid) {
    $('#center-screen .fixed-top-header').width(getTopWid)
    $('#center-screen .fTHLC-outer-wrapper').width(getOutrWid)
    $('#center-screen .fTHLC-inner-wrapper').width(getInrWid);
}
function oddEvenColor() {
    var $folderList = $('#FolderList');
    $('ilayer:odd', $folderList).not('.active > ilayer').removeClass('evenbgclr').addClass('oddbgclr');
    $('ilayer:even', $folderList).not('.active > ilayer').removeClass('oddbgclr').addClass('evenbgclr');
    /*var $folderList = $('#FolderList');
     $folderList.find('ilayer:odd').not('.active > ilayer').css({'background-color':'rgb(244, 244, 244)'});
     $folderList.find('ilayer:even').not('.active > ilayer').css({'background-color':'rgb(255, 255, 255)'});
     $folderList.find('.active > ilayer').css({'background-color':'#B7E9FB'});
     $folderList.find('li:odd').css({background:'rgb(244, 244, 244)'})
     $folderList.find('li:even').css({'background-color':'rgb(255, 255, 255)'});*/
}

/*
 * Created By Divya Rajput
 * On Date: 1st April 2014
 * For printing document
 */


$("body").on("click", ".doPrint", function () {

    var contentHeight = $('#edt').height();

    var contents = $("#edt").html();
    var dynContentClass = $.trim($('#OnOffMode').find('li.active').attr('data-value'));
    var dynParentClass = $.trim($('#OnOffMode').closest('div.edtContainer').attr('class'));
    var documentHtml = "<div class='" + dynParentClass + "'><div class='edtBody'><div class=''><div contenteditable='true' spellcheck='false' class='edt " + dynContentClass + "' id='edt' style='height:" + contentHeight + "px'>" + contents + "</div></div></div></div>";

    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({"position": "absolute", "top": "-1000000px"});
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    //Append the external CSS file.
    frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + domainUrl + 'public/css/editor.css">');
    frameDoc.document.write('<link rel="stylesheet" type="text/css" media="print" href="' + domainUrl + 'public/css/editor-print.css" >');
    //Append the DIV contents.
    frameDoc.document.write(documentHtml);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
    }, 1000);
});

function printEDTDocument(data)
{
    var WinPrint = window.open('', '_blank', 'width=800');
    var head = '<head><link rel="stylesheet" type="text/css" href="' + domainUrl + 'public/css/editor.css"><link rel="stylesheet" media="print" type="text/css" href="' + domainUrl + 'public/css/editor-print.css"></head>';
    WinPrint.document.open();
    WinPrint.document.write('<html>' + head + '<body style="-webkit-print-color-adjust:exact; margin:0 25px !important;">' + data + '</body></html>');
    WinPrint.document.close();
    WinPrint.onload = function () {
        WinPrint.focus();
        WinPrint.print();
        onPrintFinish(WinPrint);
    }
}

function onPrintFinish(WinPrint) {
    WinPrint.close();
    var documentHtmlA = $('#edt').html();
    $('#edt').html(documentHtmlA.replace(/files/g, "files"));
}
/*End Here*/

function saveCourse(saveType)
{
    var courseTitle = $("#course-value").val();
    var courseDescription = $("#course-description").val();
    var courseObjective = $("#course-objective").val();

    if (courseTitle == "")
    {
        $("#course-value").addClass("alert-text");
        $(".error-msg").show();
        return false;
    }
    else
    {
        NProgress.start();
        var instance_id = $("#course_instance_id").val();
        $.post(domainUrl + 'menudashboard/saveCourse', {'saveType': saveType, 'instance_id': instance_id, 'courseTitle': courseTitle, 'courseDescription': courseDescription, 'courseObjective': courseObjective, 'mode': 0}, responseSaveCourseAction, 'html');
    }
}

function responseSaveCourseAction(d, s)
{
    $.post(domainUrl + 'menudashboard/index', {'order_by': 'node_instance_id', 'order': 'DESC', 'type': 'no-pagination', 'mode': 0}, responseCourseAjax, 'html');
    //NProgress.done();
}



function responseCallcourseViewAction(d, s) {
    $(".courseViewData").html(d);
    $(".edtContainer .color-plates-wrap").remove();
    $("#is_individual_list").val('');
    if (globalNewDialog > 0) {
        var activeNode = globalNewDialog;
    } else {
        var activeNode = $(".courseboard-table tr.current").attr('data-id');
    }

    if (activeNode == undefined)
    {
        $("#edit-course").hide();
        $("#course-publish").hide();
        $("#course-draft").hide();
        $("#course-cancel").hide();
        $("#add-course-publish").show();
        $("#add-course-draft").show();
        $("#add-course-cancel").show();
        $("#new_course_action_menu").show();
        $("#course_action_menu").hide();
        $('textarea.resizeTextarea').each(function ()
        {
            autosize(this);
        }).on('autosize:resized', function ()
        {
            $(".nano").nanoScroller();
        });
        //$("#course-value").focus();
        $("#course-title-defalut-value").focus();
        dialogueMenu();
        $("#dialogue_action_menu").show();
        $("#course-dialogue-draft").show();
        $("#course-dialogue-cancel").hide();

        dialog_instance_node_id = $(".existingDialogueSelCourseList.current").data('id');

        if (dialog_instance_node_id != null)
        {

            $.post(domainUrl+'menudashboard/statementLetterList',{'dialogue_instance_node_id':dialog_instance_node_id,'setUserID':setUserID},responseStatementListDataAction,'HTML');
        }
    }
    else {
        $('.viewTopMode, #view-detail-course').removeClass('hide');
        $('.editTopMode, #edit-detail-course').addClass('hide');
        $("#edit-course").show();
        $("#course-publish").hide();
        $("#course-draft").hide();
        $("#course-cancel").hide();
        $("#add-course-publish").hide();
        $("#add-course-draft").hide();
        $("#add-course-cancel").hide();
        $("#new_course_action_menu").hide();
        $("#course_action_menu").show();
        $("#course-title-defalut-value").focus();
        dialogueMenu();
        /*  Commented BY: Divya Rajput
         * ON Date: 19 August 2016
         $("#dialogue_action_menu").show();
         $("#course-dialogue-draft").show();
         $("#course-dialogue-cancel").hide();
         End Here*/
        dialog_instance_node_id = $(".existingDialogueSelCourseList.current:visible").data('id');
        if (dialog_instance_node_id != null)
        {
            $.post(domainUrl + 'menudashboard/statementList', {'dialogue_instance_node_id': dialog_instance_node_id}, responseStatementListDataAction, 'HTML');
        }
    }

    $('.HalfPaneHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
    $('.setListWrapHeight').height($(window).height() - $('header').outerHeight() - 45 - $breadcrumbWrap - $('.calendar-table-head').outerHeight());
    $(".nano").nanoScroller();

    if ($("#is_individual_list").val() == '')
    {
        $.post(domainUrl + 'menudashboard/getAllUsers', {}, ChatdialogueModule.responseIndividualParticipant, 'json');
        $("#is_individual_list").val('Y');
    }

    if (globalNewDialog > 0) {
        $("#empty-statement").val('');
        $(".message-wrap .msg-statement-wrap ul").find('li .statement-info').remove();
        $("#add-new-course-value").val('');
        $("#individual_user_list").val('');
    }
    $("#dialogue_action_menu #course-dialogue-publish").hide();


    /*Added By Divya Rajput*/
    var current_node_id = $(".courseboard-table.ActiveRow tr.current").attr('data-id');
    if (typeof current_node_id == undefined || typeof current_node_id == 'undefined') {
    } else {
        $("#tempAction").val('index');
    }

    if ($.trim($("#tempAction").val()) == 'newCourse') {
    }
    else {
        existingCourseView(':visible', '');
    }
    /*End Here*/
    defaultOpenNewCourseDialogBox();
    newCourseDialogueDefault();
    $("#add-new-course-value").val('no');
    $("#course-title-value").focus();
    NProgress.done();
}

/*function here used to open fefault course dialogue box*/
function defaultOpenNewCourseDialogBox(defaultStructure)
{

    $("#course-title-defalut-value").focus();
    $(".control-bar.course-title-bar,#courseViewWrap, #newCourseControl, #newcourseDefaultWrap").addClass('hide');
    if (!defaultStructure) {
        //$("#newCourseControl, #newcourseDefaultWrap").removeClass("hide");
        $("#viewCourseControlBar, #viewCourseDefaultWrapper").removeClass("hide");
        $("#course-dialogue-publish, #course-dialogue-draft").hide();
    }

    $("#dialogue_action_menu").show();
    //$("#newCourseControl input#course-title-defalut-value").select();

    var newcourseDefaultWrapHeight = $("#newcourseDefaultWrap").outerHeight();
    $(".courseEditorCollapsedWrap").outerHeight(newcourseDefaultWrapHeight);
    var courseEdtHeigth = $(".courseEditorCollapsedWrap").outerHeight();
    $(".courseEditorCollapsedWrap .edtBody, .courseEditorCollapsedWrap .mainScroll").outerHeight(courseEdtHeigth - 35);
    //$(".courseEditorCollapsedWrap").outerHeight(newcourseDefaultWrapHeight);
    //var newCourseDefaultSec = $(".newCourseDefaultSec").outerHeight();
    //console.log("newCourseDefaultSec", newCourseDefaultSec);
    //$(".newCourseDefaultSec .newDefaultContainer").height(newCourseDefaultSec);

    if ($("#tempAction").val() == 'newCourse')
    {
        if (globalNewDialog > 0) {
            $("#course-title-value").addClass("hide");
            $(".courseTitleAddView").show();
            $("#dialogue-title-value").focus();
            var courseInstanceId = $('.courseDialogueDefaultWrap.current #create-new-dialogue').attr('co-instance-id');
            var courseName = $('.courseDialogueDefaultWrap.current #create-new-dialogue').attr('course-title');
            $(".courseTitleAddView").html(courseName);
            $("#courseInsId").val(courseInstanceId);
            if ($("#course-title-value").is(":hidden")) {
                var courseTitleVal = $(".courseTitleAddView").html();
                $(".course-title-input").val(courseTitleVal);
            }
        }

        $("#newCourseControl, #newcourseDefaultWrap").removeClass("hide");
        $("#viewCourseControlBar, #viewCourseDefaultWrapper").addClass("hide");
        $(".expand-block-head").show();
        /* Commented BY: Divya Rajput
         * On date: 19 August
         */
        $("#course-dialogue-publish, #course-dialogue-draft, #course-dialogue-cancel").show();
        $("#course-dialogue-publish").addClass('inactive');


        //added by Divya Rajput On Date: 1st August 2016
        if (globalNewDialog > 0) {
            newCourseView('visible', 'hide');
        } else {
            newCourseView();
        }
        /*End Here*/
    }
    else if ($("#tempAction").val() == 'underConstruction')
    {
        $("#newCourseControl, #newcourseDefaultWrap").addClass("hide");
        $("#viewCourseControlBar, #viewCourseDefaultWrapper").removeClass("hide");
        $("#course-dialogue-publish, #course-dialogue-draft, #course-dialogue-cancel").hide();
    }

    $(".courseEditorCollapsedWrap .niceScrollDiv").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        zindex: 1,
        background: 'rgba(0,0,0,.15)'
    });
    $(".course-alignment-section").removeClass("current-text-editor")
    $(".course-alignment-section:visible").addClass("current-text-editor");
    //manageCourseEditorIcon(); //dS
    /*
     Commented BY: Vaishali
     $detachedItem = $('.existingSelectedCourseWrap #ColorPlatesSection, .newCourseDefaultSec #ColorPlatesSection, .existingSelectedCourseWrap  #tableContextMenu, .newCourseDefaultSec #tableContextMenu').detach();
     $(".courseEditorCollapsedWrap .doFontColor, .courseEditorCollapsedWrap .doBG").click(function()  {
     $(".newCourseDefaultSec .courseEditorCollapsedWrap").append($detachedItem);
     });*/
    setMaskWidthHeight(); // set width heigth of mask loader
    //imitationDemoWidthHeight(); // summary page height & width

}

// function keyExists(arr, index) {
//     if(!arr.length) {
//         return arr;
//     }

//     var exists = false;
//     for(var i = 0; i < arr.length; i++) {
//         if(arr[i]['key'] == index) {
//             exists = true;
//             break;
//         }
//     }

//     return exists;
// }

function newCourseDialogueDefault() {


    $("body").off("click", ".recRightPanel .removeDialogueList").on("click", ".recRightPanel .removeDialogueList", function () {
        var clicked_element = $(this);
        var input = clicked_element.closest('div.global_participant_box_wrap').find('input');
        var userName = input.attr('data-username');
        var userEmail = input.attr('data-useremail');
        userName = userName + ' (' + $.trim(userEmail) + ')';
        ChatdialogueModule.removeParticipants(clicked_element);
        manageDialogueHT();

        //userName = userName ? userName : 'this participant';
        // bootbox.confirm({
        //     title: 'Confirmation',
        //     message: 'Are you sure you want to remove ' + userName + '?',
        //     callback: function callback(state) {
        //         if (state) {
        //             ChatdialogueModule.removeParticipants(clicked_element);
        //             manageDialogueHT();
        //         }
        //     }
        // });
    });

    $("body").off("click", ".addCourseDialogueList").on("click", ".addCourseDialogueList", function () {
        var autoCompleteInputVal = $.trim($(this).closest('.receivedListBox').find("#individual_user_list").val());
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(autoCompleteInputVal)) {
            return false;
        }

        if(autoCompleteInputVal != '') {
            // check user exists or not
            var userExists = false;
            for(var i = 0; i < ind_participant.length; i++) {
                var row = ind_participant[i];
                if(autoCompleteInputVal.toLowerCase() == row.value.toLowerCase()) {
                    userExists = true;
                    break;
                }
            }
            if(userExists) {
                ChatdialogueModule.addParticipants();
            } else {
                addNewUser(autoCompleteInputVal)
            }
            setTimeout(function(){
                manageDialogueHT();
            },0)
        }
    });
    $('body').off("click", ".course-action .toggle-section-btn").on("click", ".course-action .toggle-section-btn", function (evt, params) {
        toggleAddCourseSection($(this), params);
        if($(this).closest('.block-head').hasClass("existing-dialogue-block-head")){
            if($('.toggle-section-btn').hasClass('collapse-down')){
              //  alert(1)
                $('.admin-header-js').removeClass('hide')
            }
            else if($(this).hasClass('collapse-up')){
              //  alert(2)
                $('.admin-header-js').addClass('hide')
            }
        }
        manageDialogueHT();
        if($('.edtContainer').hasClass('noparticipant')){
            noParticipantHT();
        }

    });

    // $("body").off("click", ".course-action .collapse-up").on("click", ".course-action .collapse-up", function(){
    //     $(".expandBlockWrap .course-title-input").focus();
    //     $(".expand-block-head").show();
    //     $(".collapsed-block-head").show();
    //     $("#course-title-value").focus();
    //     $(".letter-message-wrap .nicescroll-rails-vr").addClass("nicezIndexManage");
    //     $(".expand-block-head .nicescroll-rails-vr, .classes-click-modal .nicescroll-rails-vr").removeClass("nicezIndexManage");
    //     var courseDefaultValue = $("#course-title-defalut-value").val();
    //     $("#course-title-value").val(courseDefaultValue);
    //
    //     // remove required validation
    //     $(".email_info").blur();
    //     $("#individual_user_list").removeClass("alert-text");
    //     $("#individual_user_list").siblings(".error-msg").addClass("hide");
    //     //$("#hidden_document_type_id").val('Letter');
    //
    //
    // });
    //
    // $("body").off("click", ".expanArrowBox .collapse-down").on("click", ".expanArrowBox .collapse-down", function(){
    //
    //     $(".collapsedBlockWrap .course-title-input").focus();
    //     $(".expand-block-head").hide();
    //     $(".collapsed-block-head").show();
    //     $("#course-title-value").focus();
    //     $(".nicescroll-rails-vr").removeClass("nicezIndexManage");
    //     //$("#add-new-course-value").val('');     // CHECK CODE HERE
    //     var courseTxtVal = $("#course-title-value").val();
    //     $("#course-title-defalut-value").val(courseTxtVal);
    //
    //    /* if($(".courseTitleAddView").css({'style':'display: inline'}) || $("#course-title-value").is(":visible")){
    //       console.log("33");
    //       var s = $(".courseTitleAddView").html();
    //       $("#course-title-defalut-value").val(s);
    //     }
    //
    //     else{
    //         console.log("bb");
    //     }*/
    // });

// $('.course-alignment-section .dropdown-menu').on('touchstart.dropdown.data-api', function(e) {
//     e.stopPropagation();
//     //alert("touchstart");
//     // if($("body").hasClass('safari')){
//     //         $('.letter-icon .dropdown-menu').css("display","none");
//     // }
// });


    // Note: Below click functionality has been commented and kept as backup. Do not remove it.
//    $("body").off("click", ".course-alignment-section .dropdown-menu li a").on("click", ".course-alignment-section .dropdown-menu li a", function (event) {
//
//        if($("#courseChatSendButton").length || $("#courseChatSaveDraftButton").length) {
//            return true;
//        }
//        //$('.letter-icon .dropdown-menu').hide();
//        $("#individual_user_list").removeClass("alert-text");
//        $("#course-title-value").removeClass("alert-text");
//        $("#dialogue-title-value").removeClass("alert-text");
//        var changeIconClass = ($(this).text() == "Letter") ? "letterIcon" : "chatIcon";
//
//        $("#hidden_document_type_id").attr('value', $(this).text());
//        $(".drop-anchor-select").html('<i class="icon ' + changeIconClass + '"></i>' + $(this).text());
//
//        if ($.trim($(this).text()) == "Letter") {
//            NProgress.start();
//            $(".course-alignment-section .hideOnLetterIcon").hide();
//            $(".course-alignment-section .hideOnChatIcon").show();
//            $(".checkEnterBox").hide();
//            // manageCourseEditorIcon();
//            dialogueMenu();
//
//            $("#dialogue_action_menu").show();
//            $("#course-dialogue-draft").show();
//            $("#course-dialogue-cancel").hide();
//            //$(".letter-icon").attr('data-original-title', 'Letter');
//            $(".chat-textarea").addClass("hide");
//            $(".letter-edt-wrapper").removeClass("hide");
//            $(".letter-edt-wrapper").focus();
//            /*********** letter-msg-wrapper ***********/
//
//            //$(".letter-message-wrap").removeClass("hide").addClass("show");
//            //$(".message-wrap").removeClass("show").addClass("hide");
//            if ($("#empty-statement").val() != undefined || $("#empty-statement").val() == "") {
//
//                dialog_instance_node_id = $(".existingDialogueSelCourseList.current").data('id');
//                $.post(domainUrl + 'menudashboard/statementLetterList', {'dialogue_instance_node_id': dialog_instance_node_id}, responseStatementListDataAction, 'HTML');
//            } else {
//                NProgress.done();
//            }
//            NProgress.done();
//            event.preventDefault();
//            //$(".letter-message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul').height() - 1,1);
//
//            /*********** letter-msg-wrapper ***********/
//        }
//        else
//        {
//            NProgress.start();
//            $(".courseEditorCollapsedWrap .edt").focus();
//            $(".course-alignment-section .hideOnLetterIcon").show();
//            $(".course-alignment-section .hideOnChatIcon").hide();
//            //$(".checkEnterBox").show();
//            $('.alignBoxWrap').css("display", "none");
//            dialogueMenu();
//            $("#dialogue_action_menu").show();
//            $("#course-dialogue-cancel").hide();
//            $("#course-dialogue-draft").hide();
//            //$(".letter-icon").attr('data-original-title', 'Chat');
//            $(".chat-textarea").removeClass("hide");
//            $(".letter-edt-wrapper").addClass("hide");
//            $(".chat-textarea .chat-msg").focus();
//            $(".chat-textarea textarea").niceScroll({
//                cursorcolor: "#000",
//                cursorborder: "0",
//                cursorborderradius: '0',
//                cursorwidth: "2px",
//                background: 'rgba(0,0,0,.15)'
//            });
//
//            /*********** letter-msg-wrapper ***********/
//            // $(".letter-message-wrap").removeClass("show").addClass("hide");
//            // $(".message-wrap").removeClass("hide").addClass("show");
//            /*********** letter-msg-wrapper ***********/
//            if ($("#empty-statement").val() != undefined || $("#empty-statement").val() == "") {
//                dialog_instance_node_id = $(".existingDialogueSelCourseList.current").data('id');
//                $.post(domainUrl + 'menudashboard/statementList', {'dialogue_instance_node_id': dialog_instance_node_id}, responseStatementListDataAction, 'HTML');
//            } else {
//                NProgress.done();
//            }
//            NProgress.done();
//            //$(".message-wrap").getNiceScroll(0).doScrollTop($('.message-wrap .msg-statement-wrap ul').height() - 1,1);
//
//        }
//
//        //trigger-editor-collapsed-section
//
//        if ($(".existingSelectedCourseWrap .course-expand-collapsed-btn").hasClass("editor-collapsed-btn")) {
//            if ($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
//                $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
//            }
//        }
//
//    });


    // Chat module is handle with react so commenting this code
    /*$("body").off("click", ".course-alignment-section .dropdown-menu li a").on("click", ".course-alignment-section .dropdown-menu li a", function(event){

        $("#individual_user_list").removeClass("alert-text");
        $("#course-title-value").removeClass("alert-text");
        $("#dialogue-title-value").removeClass("alert-text");
        var changeIconClass = ($(this).text() == "Letter") ? "letterIcon": "chatIcon";

        $("#hidden_document_type_id").attr('value',$(this).text());
        $(".drop-anchor-select").html('<i class="icon ' + changeIconClass+'"></i>' + $(this).text());

        if($.trim($(this).text()) == "Letter"){
            NProgress.start();
             $(".course-alignment-section .hideOnLetterIcon").hide();
             $(".course-alignment-section .hideOnChatIcon").show();
             $(".checkEnterBox").hide();
            // manageCourseEditorIcon();
              dialogueMenu();

              $("#dialogue_action_menu").show();
              $("#course-dialogue-draft").show();
              $("#course-dialogue-cancel").hide();
             //$(".letter-icon").attr('data-original-title', 'Letter');
             $(".chat-textarea").addClass("hide");
             $(".letter-edt-wrapper").removeClass("hide");
             $(".letter-edt-wrapper").focus();
             // letter-msg-wrapper

             //$(".letter-message-wrap").removeClass("hide").addClass("show");
             //$(".message-wrap").removeClass("show").addClass("hide");
             if($("#empty-statement").val()!=undefined || $("#empty-statement").val()==""){

             dialog_instance_node_id         = $(".existingDialogueSelCourseList.current").data('id');
             $.post(domainUrl+'menudashboard/statementLetterList',{'dialogue_instance_node_id':dialog_instance_node_id,'setUserID':setUserID},responseStatementListDataAction,'HTML');
            }else {
                NProgress.done();
            }
            NProgress.done();
            event.preventDefault();
            //$(".letter-message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul').height() - 1,1);

             // letter-msg-wrapper
         }
        else
        {
            NProgress.start();
            $(".courseEditorCollapsedWrap .edt").focus();
            $(".course-alignment-section .hideOnLetterIcon").show();
            $(".course-alignment-section .hideOnChatIcon").hide();
            // $(".checkEnterBox").show();
            $('.alignBoxWrap').css("display","none");
            dialogueMenu();
              $("#dialogue_action_menu").show();
              $("#course-dialogue-cancel").hide();
              $("#course-dialogue-draft").hide();
            //$(".letter-icon").attr('data-original-title', 'Chat');
            $(".chat-textarea").removeClass("hide");
            $(".letter-edt-wrapper").addClass("hide");
            $(".chat-textarea .chat-msg").focus();
            $(".chat-textarea textarea").niceScroll({
                cursorcolor: "#000",
                cursorborder: "0",
                cursorborderradius: '0',
                cursorwidth: "2px",
                background: 'rgba(0,0,0,.15)'
            });

            // letter-msg-wrapper
            // $(".letter-message-wrap").removeClass("show").addClass("hide");
            // $(".message-wrap").removeClass("hide").addClass("show");
            // letter-msg-wrapper
            if($("#empty-statement").val()!=undefined || $("#empty-statement").val()==""){
                dialog_instance_node_id         = $(".existingDialogueSelCourseList.current").data('id');
                $.post(domainUrl+'menudashboard/statementList',{'dialogue_instance_node_id':dialog_instance_node_id,'setUserID':setUserID},responseStatementListDataAction,'HTML');
            }else {
                NProgress.done();
            }
            NProgress.done();
             //$(".message-wrap").getNiceScroll(0).doScrollTop($('.message-wrap .msg-statement-wrap ul').height() - 1,1);
        }

        if($(".existingSelectedCourseWrap .course-expand-collapsed-btn").hasClass("editor-collapsed-btn")){
            if($(".existingSelectedCourseWrap .editor-collapsed-btn").length){
                $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
            }
        }

    });*/
    /*test dropdown*/
    $('body').on('click', '.dropdown a', function(e) {
      e.preventDefault();
      setTimeout($.proxy(function() {
        if ('ontouchstart' in document.documentElement) {
          $(this).siblings('.dropdown-backdrop').off().remove();
        }
      }, this), 0);
    });
    /*end test dropdown*/

    // clicking enter active
    $('body').off('keydown', '#individual_user_list').on('keydown', '#individual_user_list', function (event) {
        // remove requried field validation on keyup starts
        var inactiveSpace = $("#individual_user_list").val().length;
        if (inactiveSpace == 0) {
            return event.which !== 32;
            $(".error-msg").show();
            $("#individual_user_list").addClass("alert-text");
        }
        // remove requried field validation on keyup ends
    });

    $("body").off("keyup", "#individual_user_list").on("keyup", "#individual_user_list", function (event) {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($keycode === 13 && !event.shiftKey) {
            $(".addCourseDialogueList").trigger("click");
            manageDialogueHT();
            event.preventDefault();

        }

        $(".error-msg").hide();
        $("#individual_user_list").removeClass("alert-text");
        var individualWidth = $("#individual_user_list").width();
        $("#individualAutoCompleteBox .autocomplete-suggestions").width(individualWidth);
        $('#individualAutoCompleteBox .autocomplete-suggestions').niceScroll({
            cursorcolor: "#909090",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "10px",
            background: 'rgba(0,0,0,.25)'
        });


    });


    $("body").off("click", "#newcourseDefaultWrap .course_edt_box .edtBody").on("click", "#newcourseDefaultWrap .course_edt_box .edtBody", function () {
        var toggle_btn = $(this).closest('.display-wrapper').find('.dialogue-container').find('.course-action .toggle-section-btn');
        if (toggle_btn.hasClass('collapse-down')) {
            toggle_btn.trigger('click', {stop_focus: 1});
        }

        //  var courseTitleValue = $("#course-title-value").is(":visible") ? $("#course-title-value:visible").val() : $("#course-title-defalut-value:visible").val();
        //  $("#course-title-defalut-value").val(courseTitleValue);
        //  $(".expand-block-head").hide();
        //  $(".nicescroll-rails-vr").removeClass("nicezIndexManage");
        //  if($(".expand-block-head").css("display") == "none"){
        //      $("#course-dialogue-cancel").hide();
        //   }
        //   $(".chat-textarea textarea:visible").niceScroll({
        //       cursorcolor: "#000",
        //       cursorborder: "0",
        //       cursorborderradius: '0',
        //       cursorwidth: "2px",
        //       background: 'rgba(0,0,0,.15)'
        //   });
        //   var modeTypeVal = $.trim($('.drop-anchor-select:visible').text());
        //   if(modeTypeVal == 'Chat'){
        //       $("#course-dialogue-draft").hide();
        //   }

    });

    // add focus when selected an autocomplete-list using mouse click
    $("body").off("click", "#individualAutoCompleteBox .autocomplete-suggestions .autocomplete-suggestion").on("click", "#individualAutoCompleteBox .autocomplete-suggestions .autocomplete-suggestion", function () {
        $("#individual_user_list").focus();
        $("#individual_user_list").closest("div").find(".addCourseDialogueList").trigger("click");
         manageDialogueHT();
    });

    //manageCourseEditorIcon();

    // existing-course-title-dialogue

    $("body").off("click", ".existingDialogueSelCourseList:visible").on("click", ".existingDialogueSelCourseList:visible", function (e) {

        e.stopPropagation();
        e.preventDefault();
        var dialogueNodeId = $(this).attr('data-id');

        $.ajax({
            type: "post",
            url: domainUrl + 'menudashboard/fetchModeType',
            data: {'data': dialogueNodeId},
            dataType: "json",
            success: function (data)
            {
                var modeTypeC = $.trim($('#dropLetterExists').text());
                if (modeTypeC != data.result) {

                    if ($.trim(data.result) == 'Letter') {
                        $('#dropLetterExists').html("<i class='icon letterIcon'></i>Letter");
                    }
                    else {
                        $('#dropLetterExists').html("<i class='icon chatIcon'></i>Chat");
                    }
                    //$.trim($('#dropLetterExists').text(data.result));
                } else {

                    if ($.trim(modeTypeC) == 'Letter') {
                        $('#dropLetterExists').html("<i class='icon letterIcon'></i>Letter");
                    }
                    else {
                        $('#dropLetterExists').html("<i class='icon chatIcon'></i>Chat");
                    }

                    //$.trim($('#dropLetterExists').text(modeTypeC));
                }

            },
            complete: function ()
            {
            var modeType = $.trim($('#dropLetterExists').text());
            existingCourseView(':visible', modeType);
            NProgress.start();
            $.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id':dialogueNodeId,'modeType':modeType,'setUserID':setUserID},responseViewCourseDataAction,'JSON');


                $(".single-dialogue-view-control-bar").removeClass("show");
                $(".singleDialogueViewWrap").removeClass("show").addClass("hide");

                $("#newCourseControl, .newCourseDefaultSec").removeClass("show").addClass("hide");
                //$("#viewCourseControlBar, #viewCourseDefaultWrapper").addClass("hide");
                $("#viewCourseControlBar, #viewCourseDefaultWrapper").removeClass('show').addClass('hide');


                $(".existing-dialogue-control-wrap").addClass("show");
                $(".existingSelectedCourseWrap").removeClass("hide").addClass("show");

                $(".letter-edt-wrapper").focus();
                /*$(".existingDocContainer .doFontColor, .existingDocContainer .doBG").click(function()  {
                 $(".existingSelectedCourseWrap .existingDocContainer").append($detachedItem);
                 });*/
                $("#course-dialogue-publish, #course-dialogue-draft").show();
                if (modeType == "Chat") {
                    //$('.drop-anchor-select:visible').text("Letter");
                    $(".course-alignment-section .hideOnLetterIcon").show();
                    $(".course-alignment-section .hideOnChatIcon").hide();
                    // $(".checkEnterBox").show();
                    $(".chat-textarea").removeClass("hide");
                    $(".letter-edt-wrapper").addClass("hide");
                } else {

                    $(".course-alignment-section .hideOnLetterIcon").hide();
                    $(".course-alignment-section .hideOnChatIcon").show();
                    $(".checkEnterBox").hide();
                    // manageCourseEditorIcon();
                    dialogueMenu();
                    $("#dialogue_action_menu").show();
                    $("#course-dialogue-draft").show();
                    $("#course-dialogue-cancel").hide();
                    //$(".letter-icon").attr('data-original-title', 'Letter');
                    $(".chat-textarea").addClass("hide");
                    $(".letter-edt-wrapper").removeClass("hide");
                    $(".letter-edt-wrapper").focus();
                    event.preventDefault();
                }

                //trigger-editor-collapsed-section
                if ($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
                    $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
                }

                $('.course_edt_box .niceScrollDiv').on('scroll', function () {
                    $('.edtPopWrap').hide();
                });

                $("#course-dialogue-cancel").hide();

            }

        });

        // trigger-click-expand-edit-mode
        //$(".existing-dialogue-block-head .collapse-up").trigger("click");
        var getOffset = $('.course-alignment-section').offset().top
        if (getOffset > 500){
            $('.course-alignment-section').find('.StatementType').addClass('drpBottom');
        }
        else{
            $('.course-alignment-section').find('.StatementType').removeClass('drpBottom');
        }


    });


    $("body").off("click", ".course_rename_view_mode span").on("click", ".course_rename_view_mode span", function () {
        $(".course_rename_view_mode").addClass("no-hover");
        $(".editExistCourseTitle").addClass("show");
        $("#editExistCourse").focus();
        $("#course-dialogue-publish, #course-dialogue-draft").show();
        if ($(".editExistCourseTitle").hasClass("editExistTitle")) {
            $("#course-dialogue-publish, #course-dialogue-draft").addClass("inactive");
        }
        else {
            $("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");
        }
        var existCourseTitleVal = $(".existing-dialogue-block-head .existLeftPanel .existCourseTitle").text();
        $(".edit-exist-input-wrap #editExistCourse").val(existCourseTitleVal);

    });

    $("body").off("click", ".dialogue_rename_view_mode span").on("click", ".dialogue_rename_view_mode span", function () {
        $(".course_rename_view_mode").addClass("no-hover");
        $(".editExistDialogueTitle").addClass("show");
        $("#editExistDialogue").focus();

        if ($(".editExistDialogueTitle").hasClass("editExistTitle")) {
            $("#course-dialogue-publish, #course-dialogue-draft").addClass("inactive");
        }
        else {
            $("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");
        }
        var existDialogueTitleVal = $(".existing-dialogue-block-head .existLeftPanel .existDialogueTitle").text();
        $(".edit-exist-input-wrap #editExistDialogue").val(existDialogueTitleVal);

    });

    $("body").off("click", ".edit-exist-icons-wrap i.save_edit_course").on("click", ".edit-exist-icons-wrap i.save_edit_course", function () {

        if ($("#editExistCourse").val() != "") {
            $(".editExistCourseTitle").removeClass("show");
            $(".editExistDialogueTitle").removeClass("show");
            $(".course_rename_view_mode").removeClass("no-hover");
            $("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");
        }

    });
    $("body").off("click", "i.cancel_edit_course, .edit-exist-icons-wrap i.cancel_edit_dialogue").on("click", ".existing-dialogue-block-head .existLeftPanel .edit-exist-icons-wrap i.cancel_edit_course, .existing-dialogue-block-head .existLeftPanel .edit-exist-icons-wrap i.cancel_edit_dialogue", function () {

        $(".editExistCourseTitle").removeClass("show");
        $(".editExistDialogueTitle").removeClass("show");
        $(".existCourseTitle").removeClass("no-hover");
        $("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");


    });

    $("body").off("click", ".existing-dialogue-block-head .collapse-up").on("click", ".existing-dialogue-block-head .collapse-up", function () {


        //$(".collapsed-left-head").show();
       //  $(this).removeClass('collapse-up').addClass('collapse-down');
       //  $(".user-overview-wrap").removeClass("hide");
       //  $("#react-toggleRecipientBtn").trigger('click');
       //  var existDialText = $(".existDialogueTitle").text();
       //  $(".collapsedDialogueTitle").text(existDialText);
       //  var existCourseText = $(".existCourseTitle").text();
       //  $(".collapsedCourseTitle").text(existCourseText);
       //  //$(".existing-dialogue-block-head").hide();
       //  $(".nicescroll-rails-vr").addClass("nicezIndexManage");
       //  $(".email_info").focus();
       //  //trigger-editor-collapsed-section

       //  if ($(".existingSelectedCourseWrap .course-expand-collapsed-btn").hasClass("editor-collapsed-btn")) {
       //      if ($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
       //          $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
       //      }
       //  }
       // // calculateFullDialogueChatHeight();
       //  $.post(domainUrl + 'menudashboard/getAllUsers', {}, ChatdialogueModule.responseIndividualParticipant, 'json');
       //  $(".letter-edt-wrapper").attr('contenteditable', 'false');
       //  $(".course_edt_box .chat-msg:visible").attr('readonly', true);
       //  $("#mode_val").val('edit');
       // niceScrollDialogue();

    });
    $("body").off("click", ".existing-dialogue-block-head .collapse-down").on("click", ".existing-dialogue-block-head .collapse-down", function () {

        //$(".collapsed-left-head").hide();
       //  $(this).removeClass('collapse-down').addClass('collapse-up');
       //  $(".user-overview-wrap").addClass("hide");
       //  //$(".existing-dialogue-block-head").show();
       //  $("#react-toggleRecipientBtn").trigger('click');
       //  $(".nicescroll-rails-vr").removeClass("nicezIndexManage");
       // // calculateFullDialogueChatHeight();
       //  $(".letter-edt-wrapper").attr('contenteditable', 'true');
       //  $(".course_edt_box .chat-msg:visible").attr('readonly', false);
       //  $("#mode_val").val('');

    });

}

function niceScrollDialogue() {
    $(".addNiceScrollWrapper").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        touchbehavior: true,
        cursordragontouch: true,
        background: 'rgba(0,0,0,.15)'
    });
}

//create-new-dialogue

/** code start here for save dialoge , course and individual class title 15-april-2016*/
function saveCourseDialouge(saveType)
{
    NProgress.start();
    var courseInsId = "";
    var _dataHtml = $('#menudashboard #edt div.edtParagraph:visible');
    var _exisCourseDialogue = $(".existingDialogueSelCourseList.current");
    if ($("#courseInsId").val() != "")
    {
        courseInsId = $("#courseInsId").val();
        var course_dialogue_type = 'existing';
    }
    else
    {
        var course_dialogue_type = $("#course-dialogue-type").val();
    }
    var course_title = $("#course-title-value").val();
    var dialogue_title = $("#dialogue-title-value").val();
    var user_instance_node_id = setUserID

    var user_recepient_node_id = '';

    if (course_title == "")
    {
        course_title = "Untitled";
    }
    else
    {
        course_title = course_title;
    }

    if (dialogue_title == "")
    {
        dialogue_title = "Untitled";
    }
    else
    {
        dialogue_title = dialogue_title;
    }

    $('input[name="recipient_id[]"]').each(function (e) {
        user_recepient_node_id += $(this).val() + ',';
    });

    var blank_instance_node_id = "";
    if ($("#blank-statement-id").val() != "")
    {
        blank_instance_node_id = $("#blank-statement-id").val();
    }
    else
    {
        blank_instance_node_id = "";
    }

    var Coursetype = $.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val());

    if ($("#mode_val").val() == "edit") {
        var userid = [];
        var dataParams = {};
        $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function (e) {
            userid.push($(this).val());
        });

        var existingDialogueSelCourseListCurrent = $(".existingDialogueSelCourseList.current");

        dataParams['dialogue_node_id'] = existingDialogueSelCourseListCurrent.data('id');
        dataParams['course_node_id'] = existingDialogueSelCourseListCurrent.closest('div').attr('course-dialogue-instance-id');
        dataParams['user_instance_node_id'] = setUserID;
        dataParams['user_recepient_node_id'] = userid;
        dataParams['saveType'] = 'D';
        $.post(domainUrl + 'menudashboard/addUpdateParticipant', {'data': dataParams}, responseSaveCourseDialogueAction, 'JSON');
    }
    else {
        if (_exisCourseDialogue.data('id') != null && _dataHtml.html() == "<br>" && Coursetype == "Letter" && $.trim($('#menudashboard #edt div.edtParagraph:visible').text()) == "") {
            NProgress.done();
            ErrorModule.appendErrorAfter($(".letter-edt-wrapper").next(), {error_class: 'letter-error-msg'});
        } else {
            if ($.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val()) == "Letter" && _exisCourseDialogue.data('id') == null && $(".course_edt_box .chat-msg:visible").val() == undefined)
            {

                var statements = [];
                _dataHtml.each(function ()
                {  //add #documents-screen, by awdhesh soni
                    statements.push({
                        statement_type: 'Letter',
                        statement: $(this)[0].outerHTML,
                    });
                });
                if (courseInsId != "" && saveType == "D")
                {

                    $.post(domainUrl + 'menudashboard/saveCourseDialouge', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'course_dialogue_type': course_dialogue_type, 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'statements': statements, 'blank_instance_node_id': blank_instance_node_id, timestamp: getTime()}, responseSaveCourseDialogueAction, 'JSON');
                }
                else {

                    if ($.trim($('#menudashboard #edt div.edtParagraph:visible').html()) == "<br>" && $.trim($('#menudashboard #edt div.edtParagraph:visible').text()) == "")
                    {

                        statements = "";
                    }

                    $.post(domainUrl + 'menudashboard/saveCourseDialouge', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'course_dialogue_type': course_dialogue_type, 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'statements': statements, timestamp: getTime(), 'blank_instance_node_id': blank_instance_node_id}, responseSaveCourseDialogueDefualtAction, 'JSON');
                }

            }

            else if ($.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val()) == "Letter" && _exisCourseDialogue.data('id') != "" && $(".course_edt_box .chat-msg:visible").val() == undefined)
            {

                var statements = [];
                _dataHtml.each(function ()
                {  //add #menudashboard, by awdhesh soni
                    statements.push({
                        statement_type: 'Letter',
                        statement: $(this)[0].outerHTML,
                    });

                });
                if (courseInsId != "" && saveType == "D" && $.trim(_dataHtml.html()) == "<br>" && $.trim($('#menudashboard #edt div.edtParagraph:visible').text()) == "")
                {

                    $.post(domainUrl + 'menudashboard/saveCourseDialouge', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'course_dialogue_type': course_dialogue_type, 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'statements': statements, timestamp: getTime(), 'blank_instance_node_id': blank_instance_node_id}, responseSaveCourseDialogueAction, 'JSON');
                }
                else
                {

                    $.post(domainUrl + 'menudashboard/saveDialogueLetter', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'dialogueId': $(".existingDialogueSelCourseList.current").data('id'), 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'statements': statements, timestamp: getTime(), 'blank_instance_node_id': blank_instance_node_id}, responseLetterSaveCourseDialogueAction, 'JSON');
                }

            }
            else
            {
                if (courseInsId != "")
                {
                    $.post(domainUrl + 'menudashboard/saveCourseDialouge', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'course_dialogue_type': course_dialogue_type, 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'blank_instance_node_id': blank_instance_node_id, timestamp: getTime()}, responseSaveCourseDialogueAction, 'JSON');
                }
                else
                {
                    $.post(domainUrl + 'menudashboard/saveCourseDialouge', {'courseInsId': courseInsId, 'current_user_node_id': setUserID, 'user_recepient_node_id': user_recepient_node_id, 'saveType': saveType, 'course_dialogue_type': course_dialogue_type, 'course_title': course_title, 'dialogue_title': dialogue_title, 'user_instance_node_id': user_instance_node_id, 'Coursetype': Coursetype, 'blank_instance_node_id': blank_instance_node_id, timestamp: getTime()}, responseSaveCourseDialogueDefualtAction, 'JSON');
                }

            }

            $("#dialogue-title-value").val('');
            $('input[name="recipient_id[]"]').remove();
            $(".addNiceScrollWrapper").html('');
        }
    }

    //trigger-editor-collapsed-section
    if ($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
        $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
    }

    edtTagArray = [];
    statusUndoRedo = [];

}

function responseSaveCourseDialogueAction(data, success)
{
    var course_instance_id = $('.courseDialogueDefaultWrap.current').attr('course-instance-id');

    $.post(domainUrl + 'menudashboard/dialogueList', {'course_instance_id': course_instance_id, 'user_instance_node_id': setUserID}, responseDialogueListCallAction, 'JSON');

    addBrEditor();

}

function responseSaveCourseDialogueDefualtAction(d, s)
{
    $("#tempAction").attr('value', '');
    $("#tempAction").attr('value', 'index');
    $.post(domainUrl + 'menudashboard/index', {'mode': '0', 'setUserID': setUserID}, responseCallAction, 'html');
    NProgress.done();
}


/* function here to response letter statemt and send ajax call for statement list of letter type */
function responseLetterSaveCourseDialogueAction(d, s)
{
    $('#menudashboard #edt div.edtParagraph:visible').html('<br>').not(':first').remove();
    $(".letter-edt-wrapper:visible").removeAttr('style');
    $("#blank-statement-id").val('');
    NProgress.done();
    $.post(domainUrl+'menudashboard/statementLetterList',{'dialogue_instance_node_id':$(".existingDialogueSelCourseList.current").data('id'),'setUserID':setUserID},responseStatementListDataAction,'HTML');
}


function my_implode_js(separator, array) {
    var temp = '';
    for (var i = 1; i < array.length; i++) {
        temp += array[i]
        if (i != array.length - 1) {
            temp += separator;
        }
    }//end of the for loop

    return temp;
}//end of the function

/* response after ajax call from view Course Data here awdhesh soni*/
function responseViewCourseDataAction(d, s) // viewCourseData
{
    tempMessageObj = d;
    $(".admin-info-box .participant-info").html('');
    $("#editExistDialogue").val(d.dialog_title);
    $(".existCourseTitle").html(d.course_title);
    $(".existDialogueTitle").html(d.dialog_title);
    $("#mode_val").val('');
    var editExistCourseHidden = $("#editExistCourseHidden"), editExistCourse = $("#editExistCourse"), editExistDialogueHidden = $("#editExistDialogueHidden");
    editExistCourse.val(d.course_title);
    editExistCourse.attr('data-id', d.course_node_id);
    editExistCourseHidden.attr({'data-id': d.course_node_id, 'property-id': d.course_property_id});
    editExistDialogueHidden.attr({'data-id': d.dialogue_instance_node_id, 'property-id': d.node_instance_property_id, 'actor-id': d.user_id, 'user-name': d.user_name, 'data-status': d.dialogueStatus});
    var recipient = d.user_name.split(",");
    var loginUser = d.user_id.split(",");

    $(".admin-info-box .admin-info").html('<i class="icon user-update pull-left"></i><span>' + recipient[parseInt(recipient.length-1)] + '</span></span>');
    var str = d.user_name;//my_implode_js(',', recipient);

    if (setUserID != loginUser[parseInt(loginUser.length-1)]) {
        $(".existing-dialogue-block-head").find('.course_rename_view_mode, .dialogue_rename_view_mode').addClass('prevent_click');
        $(".admin-info-box .participant-info").html('<i class="icon user-update pull-left"></i><span>' + str + '</span></span>');
    }
    else {
        $('.existing-dialogue-block-head .collapse-down').removeClass('collapse-down').addClass('collapse-up');
        $(".user-overview-wrap").addClass("hide");
        calculateFullDialogueChatHeight();
        $(".letter-edt-wrapper").attr('contenteditable', 'true');
        $("#individualAutoCompleteBox").remove();
        $("#individual_user_id").remove();
        $("#individual_user_name").remove();
        $('#individual_user_list').remove();
        $('input[name="individual_user_list"]').remove();
        $('input[name="recipient_id[]"]').remove();
        $(".addNiceScrollWrapper").remove();

        $(".existing-dialogue-block-head").find('.course_rename_view_mode, .dialogue_rename_view_mode').removeClass('prevent_click');
        var html_participant = '<div >\
                                    <input type="hidden" id="individual_user_id" name="individual_user_id" value=""/>\
                                    <input type="hidden" id="individual_user_name" name="individual_user_name" value=""/>\
                                    <input type="text" id="individual_user_list" name="individual_user_list" class="form-control input-field email_info auto-suggest" placeholder="Email" data-validation-rules="empty,email" data-is-multiple="1" data-multiple-selector="input[name=\'recipient_id[]\']" autocomplete="off"/>\
                                    <i class="icon tick addCourseDialogueList" onclick="" data-original-title="" title=""></i>\
                                </div>\
                                <div id="individualAutoCompleteBox" class="clearfix"></div>';

        $(".admin-info-box .participant-info").html(html_participant);
        var exisEmail = (d.email_address) ? d.email_address.split(",") : '';
        var exisInsNodeId = (d.user_instance_node_id) ? d.user_instance_node_id.split(",") : '';
        var nameStr = (d.nameStr) ? d.nameStr.split(",") : '';
        var existParticipant = '';
        existParticipant += "<div class='addNiceScrollWrapper clearfix global_participant_scroll_wrap'>";

        for (var i = 0; i < exisEmail.length; ++i)
        {
            existParticipant += "<div class='global_participant_box_wrap recRightPanel'><span class='user_icon'><i class='icon admin-user'></i></span>";
            existParticipant += "<span class='txtTitle'>" + exisEmail[i] + "<input type='hidden' name='recipient_id[]' value=" + exisInsNodeId[i] + "></span>";
            existParticipant += "<span class='IconTitle'><i class='icon close removeDialogueList' data-user-id=" + exisInsNodeId[i] + " data-user-name=" + nameStr[i] + "></i></span></div>";
        }
        existParticipant += "</div>";
        $(".admin-info-box #individualAutoCompleteBox").html(existParticipant);


    }

    //$(".admin-info-box .participant-info").html('<i class="icon user-update"></i><span>'+str+'</span></span>');


    // testing
    //$(".admin-info-box .participant-info").html('<i class="icon user-update"></i><span>'+str+'</span></span>');

    if(d.modeType.toLowerCase() == 'chat') {
         /* Added By: Divya RAjput ON Date: 19 August 2016 */
        $("#dialogue_action_menu").show();
        $("#course-dialogue-cancel").hide();
        $("#course-dialogue-draft").hide();

        /* End Here */
        $.post(domainUrl+'menudashboard/statementList',{'dialogue_instance_node_id':d.dialogue_instance_node_id,'setUserID':d.setUserID},responseStatementListDataAction,'HTML');

        $(".course-alignment-section .hideOnLetterIcon").show();
        $(".course-alignment-section .hideOnChatIcon").hide();
        // $(".checkEnterBox").show();
        $(".chat-textarea").removeClass("hide");
        $(".letter-edt-wrapper").addClass("hide");
        $("#course-dialogue-draft").hide();
    } else if (d.modeType.toLowerCase() == 'letter') {
        /*Added By: Divya RAjput
         * ON Date: 19 August 2016*/
        $("#dialogue_action_menu").show();
        $("#course-dialogue-draft").show();
        $("#course-dialogue-cancel").hide();
        /*End Here*/
        $.post(domainUrl+'menudashboard/statementLetterList',{'dialogue_instance_node_id':d.dialogue_instance_node_id,'setUserID':d.setUserID},responseStatementListDataAction,'HTML');
    }

    //$.post(domainUrl+'menudashboard/statementList',{'dialogue_instance_node_id':d.dialogue_instance_node_id},responseStatementListDataAction,'HTML');



    $.post(domainUrl + 'menudashboard/getAllUsers', {}, ChatdialogueModule.responseIndividualParticipant, 'json');


}

function responseStatementListDataAction(d, s)
{
    $("#chat-app-placeholder").html(d);

    //$("#course-dialogue-publish").show();
    //$("#course-dialogue-draft").show();
    // $("#course-dialogue-cancel").hide();
    existingDialogueSelCourse();
    removeEdtClassLetter();
    readMoreText();
    $(".mask-course-view.black-mask").hide();
    courseDialogueContextMenuBar();
    NProgress.done();

    return true;
    //$.post(domainUrl+'menudashboard/courseEditor',{},responsecourseEditorAction,'HTML');
    $(".chat-textarea textarea:visible").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    //alert(4)
    setTimeout(function () {
        if ($(".letter-message-wrap").length) {
            $(".letter-message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul').height() - 1, 1);
        } else if ($(".message-wrap").length) {
            $(".message-wrap").getNiceScroll(0).doScrollTop($('.message-wrap .msg-statement-wrap ul').height() - 1, 1);
        }

    }, 100);
    //$(".letter-message-wrap, .message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .message-wrap ul').height() - 1,1);
    //trigger-editor-collapsed-section




    /*    if($.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val())=="Letter"){
     $("#course-dialogue-draft").show();
     $("#course-dialogue-cancel").show();
     }*/
    //if( $('#chatWrapper:visible').length) {
    fileAttachment();
    messageBoxImgPaste('.chat-textarea', '#chatTextMessage', 'divEditableCourse', '.existWrapperMsg');
    //}
    $('#menudashboard #edt div.edtParagraph:visible').removeClass('edtList');
    $('#menudashboard #edt div.edtParagraph:visible').html('<br>').not(':first').remove();

    if ($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
        $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
    }

alert("abn")
    EditorHT(true);
        $(".niceScrollDiv.document-pane").niceScroll({
            cursorcolor: "#000",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "2px",
            background: 'rgba(0,0,0,.15)'
        });


}





/*script function here for display course class dialogue information list dynamic html*/
function responseDialogueListCallAction(d, s)
{
    // defaultOpenNewCourseDialogBox();

    var Html = "";
    var userIconClass = "";
    Html += "<ul class='clearfix'>";
    for (var i in d)
    {
        for (var j in d[i])
            if (j == 'dialogue_title')
            {
                if (d[i]['dialogue_title'] !== undefined)
                {
                    var user_exsits = d[i]['user_id'].split(',');

                    if (user_exsits.length > 1) {
                        userIconClass = 'plural-user';
                    } else {
                        userIconClass = 'singular-user';
                    }

                    if ((d[i]['status'] == '1' && $.inArray(setUserID, user_exsits) != -1) || ((d[i]['status'] == '0' || d[i]['status'] == null) && d[i]['status'] == '0' && d[i]['createdBy'] == setUserID))
                    {
                        //alert(5);
                        $(".collapsedCourseBox.expandedCourseBox").hide();
                        Html += "<li class='existingDialogueSelCourseList' data-status='" + d[i]['status'] + "' data-id='" + d[i]['dialogue_node_id'] + "' user-id='" + d[i]['user_id'] + "' data-course='" + d.course_instance_id + "'>";
                        Html += "<div class='subCollapsedCourseBox'><div class='courseTitle'><i class='icon left sm-dialogue'></i><span>" + d[i]['dialogue_title'] + "</div>";
                        Html += "<div class='updateCourseTitle'><i class='icon " + userIconClass + "'></i><span>" + d[i]['userName'] + "</span></div>";
                        //$(".collapsedCourseBox.expandedCourseBox").slideDown('slow');
                        if(parseInt(d[i]['notificationCount']) > 0)
                        Html+="<div id='chat_notification_"+d[i]['dialogue_node_id']+"' class='counter-wrap fadeIn'><span>"+d[i]['notificationCount']+"</span></div>";
                        else
                        Html+="<div id='chat_notification_"+d[i]['dialogue_node_id']+"' class='counter-wrap hide'><span>"+d[i]['notificationCount']+"</span></div>";
                    }
                }
                Html += "</div></li>";
            }
    }

    Html += "</ul>";
    var targetEle = $('#course-dialogue-instance-id-' + d.course_instance_id);
    toggleSpinner(targetEle.prev());
    //close_accordion_course();
    targetEle.addClass('expandedCourseBox').html(Html);

    // remove-hover-effect on parent li
    $('.expandedCourseBox ul li').on({
        mouseover: function () {
            $(this).closest(".newDefaultCourseList").addClass("noHover");

        },
        mouseout: function () {
            $(this).closest(".newDefaultCourseList").removeClass("noHover");
        }
    });
    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".newDefaultCourseListResources .toggleCourseWrapper").find('.collapse-down').removeClass('collapse-down fa-angle-down').addClass('collapse-up fa-angle-up');
    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".courseDialogueDefaultWrap.newDefaultCourseList .toggleCourseWrapper").find('.collapse-up').removeClass('collapse-up fa-angle-up').addClass('collapse-down fa-angle-down');
    /*    $(".newDefaultCourseList .expandedCourseBox ul li:odd").css("background","#f4f4f4");
     $(".newDefaultCourseList .expandedCourseBox ul li:even").css("background","#fff");*/
    NProgress.done();
    $(".collapsedCourseBox.expandedCourseBox").slideDown();
}

function manageCourseEditorIcon() {

    // if ($.trim($(".current-text-editor .drop-anchor-select").text()) == "Letter") {
    //     var NoOfIcons = parseInt($('.current-text-editor .alignLeftWrap .move-icon').outerWidth() / 22);
    //     $('.current-text-editor .alignBoxWrap').css("display", "none");
    //     if ($('.current-text-editor .move-icon .letter-icon').length >= NoOfIcons) {
    //         var totalIcon = $('.current-text-editor .move-icon .letter-icon').length;
    //         var iconClone = $('.current-text-editor .move-icon .letter-icon').slice(NoOfIcons - 1);
    //         $(".current-text-editor .alignBoxWrap").prepend(iconClone);
    //         for(i=totalIcon;i>NoOfIcons-1;i--){
    //          $(".current-text-editor .more-icons").css("display","inline-block");
    //          var iconClone = $('.current-text-editor .move-icon .letter-icon').eq(i-1).clone();
    //          $('.current-text-editor .move-icon .letter-icon').eq(i-1).remove();
    //          iconClone.removeClass("letter-icon");
    //          $(".current-text-editor .alignBoxWrap").prepend(iconClone);
    //          }
    //     }
    //     else {
    //         var visibleIcon = $('.current-text-editor .move-icon .letter-icon').length;
    //         var addIcon = NoOfIcons - visibleIcon;
    //         $(".current-text-editor .alignBoxWrap span").each(function (i, v) {

    //             if (i + 1 <= addIcon - 1) {
    //                 var iconClone = $(this).clone();
    //                 $(this).remove();

    //                 iconClone.addClass("letter-icon");
    //                 $(iconClone).insertBefore(".current-text-editor .move-icon .more-icons");
    //             }
    //         });
    //         if ($('.current-text-editor .alignBoxWrap span').length == 0) {
    //             $(".current-text-editor .more-icons").css("display", "none");
    //             $('.current-text-editor .alignBoxWrap').css("display", "none");
    //         }
    //     }
    // }

    var totalIconWD     =   $('.move-icon').outerWidth();
    var visibleIconWD   =   $('.move-icon .icon:visible').length * 22
    var getWD           =   totalIconWD - visibleIconWD;
    var getIconlen      =   parseInt(getWD / 22);

    if(getWD  > 22){
        var getIconHtml1 =  $('.alignBoxWrap .icon').eq(getIconlen).prevAll(".icon");
        $('.move-icon').find('span.more-icons').before(getIconHtml1);
    }

    else{
        var noOfIcon    =   parseInt($('.current-text-editor .alignLeftWrap .move-icon').outerWidth() / 22);
        var getIconHtml =   $('.move-icon .icon').eq(noOfIcon - 3).nextUntil('span.more-icons')
        $('.alignBoxWrap').append(getIconHtml);
    }


}


var hasExecuted = 0;

function existingDialogueSelCourse() {
    return true;
    // readMoreText();
    //var existingHeight= $(".existingSelectedCourseWrap").height();

    // existing main height starts
    var existingHght = $("#existingSelectedCourse").outerHeight();
//    $(".existingMidTotal").height(existingHght);
    if ($(".course-expand-collapsed-btn").hasClass("editor-expand-btn")) {
        $(".unread-msg-box").removeClass("show").addClass("hide");
        var existDocContHght = $(".existingSelectedCourseWrap .existingDocContainer").outerHeight();
        var totalMsgwrapHght = existingHght - 100;
        $(".letter-message-wrap, .message-wrap").height(totalMsgwrapHght);


        //var msgWrapHghtChat = $(".letter-message-wrap").height();
        //$(".message-wrap").height(msgWrapHghtChat);
        $(".existingSelectedCourseWrap .existingDocContainer .edtBody,.existingSelectedCourseWrap .existingDocContainer .mainScroll").outerHeight(existDocContHght - 35);

    } else {
        var msgBoxHght = $(".unread-msg-box").outerHeight();
        $(".existingDocContainer").outerHeight(existingHght - msgBoxHght);
    }

    $(".message-wrap, .letter-message-wrap").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });

    $(".existingSelectedCourseWrap .existingDocContainer .niceScrollDiv").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });

    // existing main height ends

    // docFontBgPosSetCourse();
    $(".course-alignment-section").removeClass("current-text-editor")
    $(".course-alignment-section:visible").addClass("current-text-editor");
    manageCourseEditorIcon();
    //$detachedItem = $('.existingSelectedCourseWrap #ColorPlatesSection, .newCourseDefaultSec #ColorPlatesSection, .existingSelectedCourseWrap  #tableContextMenu, .newCourseDefaultSec #tableContextMenu').detach();
}

function hideFlyout() {
    $('#operationPaneFlyout').animate({right: '-100%'}).removeClass('in');
    OperationPane();
    $('.viewClassFlyout').removeClass('openflyout node-green-circle');
    $('.node-circle').removeClass('openflyout node-green-circle');
    $('#CellRightFlyout').animate({right: '-100%'}).removeClass('in');

}


/* ==========singleDialogue-view-mode========== */

/*function singleDialogueViewCourse(){
 var singleDiaHght = $(".singleDialogueViewWrap").outerHeight();
 $(".singleMidViewBox").height(singleDiaHght);
 var singleMsgWrapHght = $(".single_view_msg_wrap").height();
 var brdHght = $(".breadcrumb-wrap").height();
 $(".singleDialogueEdtContainer").height(singleDiaHght - singleMsgWrapHght -brdHght + 10);
 var singleEdtContHght = $(".singleDialogueEdtContainer").height();
 var singleEdtHeader = $(".singleDialogueEdtContainer .edtHeader").height();
 var singleMainScroll = singleEdtContHght - singleEdtHeader;
 $(".singleDialogueEdtContainer .mainScroll").height(singleMainScroll);
 $(".singleDialogueEdtContainer .niceScrollDiv").niceScroll({
 cursorcolor: "#909090",
 cursorborder: "0",
 cursorborderradius: '0',
 cursorwidth: "10px",
 background: 'rgba(0,0,0,.25)'
 });
 docFontBgPosSetCourse();
 $detachedItem = $('.existingSelectedCourseWrap #ColorPlatesSection, .newCourseDefaultSec #ColorPlatesSection, .existingSelectedCourseWrap  #tableContextMenu, .newCourseDefaultSec #tableContextMenu').detach();
 $("body").on("click",".view-collapsed-btn", function(){
 console.log("sdsdsd");
 $(this).removeClass("view-collapsed-btn").addClass("view-expand-btn");
 //$(".singleDialogueEdtContainer").height(100+"px");
 // var collapseEdtContainer = $(".singleDialogueViewWrap .singleDialogueEdtContainer").outerHeight();
 // var singleMidViewBox     = $(".singleDialogueViewWrap .singleMidViewBox").outerHeight();
 // var breadcrumbHght       = $(".breadcrumb-wrap").outerHeight();
 // var remMidViewBoxHght    = singleMidViewBox - collapseEdtContainer - breadcrumbHght;
 // $(".single_view_msg_wrap").height(remMidViewBoxHght);
 $(".single_view_msg_wrap").niceScroll({
 cursorcolor: "#909090",
 cursorborder: "0",
 cursorborderradius: '0',
 cursorwidth: "10px",
 background: 'rgba(0,0,0,.25)'
 });
 });
 $("body").on("click",".view-expand-btn", function(){
 console.log("view-expand-btn");
 $(this).removeClass("view-expand-btn").addClass("view-collapsed-btn");
 //$(".single_view_msg_wrap").addClass("hide");
 //var singleMidViewBox1     = $(".singleDialogueViewWrap .singleMidViewBox").height();
 //$(".singleDialogueEdtContainer").height(singleMidViewBox1);
 //$(".singleDialogueViewWrap .singleDialogueEdtContainer").height(singleMidViewBox);
 });
 }*/

/* ==========singleDialogue-view-mode========== */

/*Generate Menu and Pop-up for Unstructured and Structured Series Dynamically start here*/
function getDropdown() {
    $('.gridMenu').on({
        mouseenter: function () {
            if (!$(this).find('.gridICon').hasClass('iconActive')) {
                $('.gridICon').not('.iconActive').remove();
                $(this).append('<span class="fa fa-bars gridICon"></span>');
            }
            var getID = $(this).data('id');
            if (getID == 'drpInteraction') {
                $(this).find('.gridICon').addClass('check-add-status');
            }
            if ($(this).closest('tr').hasClass('row-0')) {
                $(this).find('.gridICon').removeClass('fa-bars').addClass('fa-plus');
            }

        },
        mouseleave: function () {
            if (!$(this).find('.gridICon').hasClass('iconActive')) {
                $('.gridICon').not('.iconActive').remove();
            }
        }
    });
    $('.fTHLC-inner-wrapper.manageScroll').bind('scroll', function () {
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide();
    });

}

$(function () {
    $('body').on('click', function (e) {
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide();
    });


    $('body').on('click', '.gridICon', function (e) {
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide();
        var getIconTopPos = $(this).offset().top;
        var getIconLeftPos = $(this).offset().left;
        var getID = $(this).closest('.gridMenu').data('id');
        var getOuterHig = $('.center-div .fTHLC-outer-wrapper').outerHeight();
        var getOuterWid = $('#center-screen').outerWidth();
        var getDrpHig = $('#' + getID).children('.grid-dropdown').outerHeight();
        var gettotalHig = getOuterHig - getDrpHig;
        var setTopPos = (getIconTopPos - getDrpHig);
        var setLeftPos = (getIconLeftPos - 150);
        var getcellHig = $(this).closest('td').outerHeight();
        var getTotalOuterHig = getOuterHig - 80;

        $('#' + getID).children('.grid-dropdown').css({'top': getIconTopPos + 24, 'left': getIconLeftPos + 24});
        if (getIconTopPos > getTotalOuterHig) {
            $('#' + getID).children('.grid-dropdown').css({'top': setTopPos + 24});
        }
        if (getIconLeftPos > getOuterWid) {
            $('#' + getID).children('.grid-dropdown').css({'left': setLeftPos});
        }
        $(this).toggleClass('iconActive');
        if ($(this).hasClass('iconActive')) {
            $('.grid-dropdown').hide();
            $('#' + getID).children('.grid-dropdown').show();
        }
        callUns($(this));
        unstrucPhaseMenuDisable($(this));
        callStrP($(this));
        e.stopPropagation();
    });

    $('.viewClassFlyout').on('click', function (event) {
        $('.node-circle').removeClass('openflyout node-green-circle');
        $(this).toggleClass('openflyout node-green-circle');
        if ($(this).hasClass('openflyout')) {
            $('#CellRightFlyout').animate({right: '0px'}).addClass('in');
            setTimeout(function () {
                sideFlyoutHeight();
                $('#CellRightFlyout').width(getWidth + 60);
                $('#CellRightFlyout .courseflyout, #CellRightFlyout .left-head').width(getWidth);

            }, 300);
            $(".nano").nanoScroller();
        }
        else {
            $('.node-circle').removeClass('openflyout node-green-circle');
            $('#CellRightFlyout').animate({right: '-100%'}).removeClass('in');

        }
        event.stopPropagation();
    });


    /*
     * Created By: Divya Rajput
     * On Date: 4th May 2016
     * Purpose: save document file title
     */
    $('body').on('click', '.action-file1 .document-file-save-btn:visible', function (e) {

        var document_title_name = $.trim($('#documents-screen').find('#document_title').val());

        var dialog_document_nodeinstanceid = parseInt($('#hidden_dialog_document_instance_id').val());

        var instance_node_id = parseInt(globalFolderInstanceID);

        var dialogueType = $("#hidden_dialog_type").val();

        var title_status = '';

        if (document_title_name == '') {

            bootbox.alert("Title field is empty.");
            return false;

        } else {

            NProgress.start();

            if (dialog_document_nodeinstanceid > 0) {

                title_status = 'update';

            } else {
                title_status = 'create';
            }

            $.post(domainUrl + 'documents/saveDocumentDialogFileData', {'folder_instance_node_id': instance_node_id, 'save_type': title_status, 'title': document_title_name, 'node_instance_id': dialog_document_nodeinstanceid, 'dialogueType': dialogueType}, responseSaveFileDocument, 'JSON');
        }

    });
    /*End Divya Code Here*/

})

/*End here*/

function autoScrolling() {
    var spacer = 75;
    var paneTop = $(".folder-listing.niceScrollDiv").position().top;
    var paneHeight = $(".folder-listing.niceScrollDiv").outerHeight();
    //Up==============================================================
    if (($("#dragMoveImg").offset().top - spacer) < paneTop && $(".folder-listing.niceScrollDiv").scrollTop() > 0) {
        scrolling = true;
        scrollContent("up");
    }
    //down===========================================================
    else if ($("#dragMoveImg").offset().top > ((paneTop + paneHeight + 8))) {
        scrolling = true;
        scrollContent("down");
    } else {
        scrolling = false;
    }

}

function scrollContent(direction) {
    var amount = (direction === "up" ? "-=1px" : "+=1px");
    $(".niceScrollDiv").animate({
        scrollTop: amount
    }, 1, function () {
        if (scrolling) {
            scrollContent(direction);
        } else {
            $(".niceScrollDiv").clearQueue().finish();
        }
    });
}

/*
 * Created By: Divya Rajput
 * On Date: 4th May 2016
 * Purpose: Show Message accordingly Response when saving Title
 */
function responseSaveFileDocument(data, source) {

    globalTitle = data.title;

    $('#hidden_dialog_document_instance_id').val(data.node_instance_id);

    if ($.trim(data.status) == 'update') {
        $('#DataSaveDocument').html("<span>Title Updated Successfully.</span>");
    } else {
        $('#DataSaveDocument').html("<span>Title Saved Successfully.</span>");
    }

    NProgress.done();

    $('#DataSaveDocument').fadeIn();

    setTimeout(function () {
        $('#DataSaveDocument').fadeOut();
    }, 3000);

    return false;
}
/*End Here*/

function readMoreText()
{
    // convert read more to read less text
    // How many characters are shown by default
    if ($.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val()) == "Chat")
    {
        var showChar = 400;
        var ellipsestext = "...";
        var moretext = "Read More ";
        var lesstext = "Read Less";
        $('.statement-list-wrap .statement-info .more').each(function () {
            var content = $(this).html();

            if ($(this).find('a').length == 0) {
                if (content.length > showChar) {
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);

                    var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

                    $(this).html(html);

                }
            }
        });

        $(".statement-list-wrap .statement-info .morelink").click(function () {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html(moretext);
            } else {
                $(this).addClass("less");
                $(this).html(lesstext);
            }
            $(this).parent().prev().toggle();
            $(this).prev().toggle();
            return false;
        });
    }

    function createTextFragment(contentLetter) {
        var showCharLetter = 400;
        var ellipsestextLetter = "...";
        var moretextLetter = "Read More ";
        var lesstexLetter = "Read Less";
        var desc = '';

        if (contentLetter.length > showCharLetter) {

            var cLetter = contentLetter.substr(0, showCharLetter);
            var hLetter = contentLetter.substr(contentLetter.length - showCharLetter);

            return cLetter + '<span class="moreellipsesletter" data-value="/' + contentLetter + '\">' + ellipsestextLetter + '&nbsp;</span><span class="morecontentletter"><span>' + hLetter + '</span>&nbsp;&nbsp;<a href="javascript:void(0);" class="morelinkletter">' + moretextLetter + '</a></span>';

            //$(this).html(html);
            //$(".morecontentletter + .morelinkletter").remove();
        }
    }



    if ($.trim($("#hidden_document_type_id").val($('#dropLetterChatView').text()).val()) == "Letter") {

        //TextEditor.ellipsifyText($('.single_list_wrap').not('.text-processed'));

        var desc = '';
        var lesstexLetter = "Read Less";
        var moretextLetter = "Read More ";

        var singleMsgInfoElements = $('.single_msg_list_box .single_msg_info');

        singleMsgInfoElements.each(function () {
            var _this = $(this);
            var desc = '';
            _this.find('.edtParagraph').each(function () {
                desc += $(this).text();
            });

            var html = createTextFragment(desc);
            _this.html(html);
        });

        $('.single_msg_list_box .single_msg_info .more-txt-span .edtParagraph').each(function () {
            var showCharLetter = 400;
            var ellipsestextLetter = "...";
            var moretextLetter = "Read More ";
            var lesstexLetter = "Read Less";
            var desc = '';

            var contentLetter = $(this).html();
            if (contentLetter.length > showCharLetter) {

                var cLetter = contentLetter.substr(0, showCharLetter);
                var hLetter = contentLetter.substr(contentLetter.length - showCharLetter);

                var html = cLetter + '<span class="moreellipsesletter">' + ellipsestextLetter + '&nbsp;</span><span class="morecontentletter"><span>' + hLetter + '</span>&nbsp;&nbsp;<a href="" class="morelinkletter">' + moretextLetter + '</a></span>';

                $(this).html(html);
                $(".morecontentletter + .morelinkletter").remove();
            }
        });
        var html = createTextFragment(desc);
        $('.single_msg_list_box .single_msg_info').html(html);
        $(".morecontentletter + .morelinkletter").remove();


        $(".single_msg_list_box .single_msg_info .morelinkletter").click(function () {

            if ($(this).hasClass("less")) {

                $(this).removeClass("less");
                $(this).html(moretextLetter);
            } else {
                $(this).addClass("less");

                $(this).html(lesstexLetter);
            }

            $(this).parent().prev().toggle();
            $(this).prev().toggle();
            return false;
        });


    }

    if ($(".more-txt-span").hasClass("common-class")) {
        $(".more-txt-span.common-class").closest('.single_msg_info').siblings(".letter_statement_drop").removeClass("letter_statement_drop");
    }
}



/* ========== course-context-menu ========== */
function courseDialogueContextMenuBar() {

    courseContextMenuDiffReceipients();
    // main description chat right click
    var windowWidthMenu = $(window).width();
    var userActionWidth = $(".user-action-wrap").outerWidth();
    var getCourseMenuWidth = $(".courseDialogueContextMenubar .dropdown-menu").outerWidth();
    var remainingWindowWidth = windowWidthMenu - (userActionWidth + getCourseMenuWidth);
    var $statementListContextMenu = $('#courseDialogueContextMenu');

    $("body").off("contextmenu", '.statement_drop').on("contextmenu", '.statement_drop', function (e)
    {
        $("#property-statement-id").val('');
        $statementListContextMenu.find('.chat-edit-statement').data('value', '');
        $statementListContextMenu.find('.chat-edit-statement').data('id', '');
        var node_instance_id = $(this).data('instance_id');
        $statementListContextMenu.find('.chat-edit-statement').data('value', $(this).html().trim());
        $statementListContextMenu.find('.chat-edit-statement').data('id', node_instance_id);
        $statementListContextMenu.find('.course-delete-statement').data('id', node_instance_id);
        $statementListContextMenu.css({
            display: "block",
            right: "inherit",
            left: e.pageX,
            top: e.pageY

        });
        var getCoursePosition = $("#courseDialogueContextMenu").position().left;
        if (getCoursePosition > remainingWindowWidth)
        {
            $statementListContextMenu.css({
                left: "inherit",
                right: "230px"
            });
        }
        else {

        }

        return false;
    });



    $('.message-wrap').on('update', function () {
        $('#courseDialogueContextMenu').hide();
    });
    $statementListContextMenu.on("click", "a", function () {
        $('#courseDialogueContextMenu').hide();
    });
    $('body').click(function () {
        $('#courseDialogueContextMenu').hide();
    });
    $(".message-wrap").scroll(function () {
        $('#courseDialogueContextMenu').hide();
    });

    // letter-context-menu-manage

    var $courseLetterContextVar = $('#courseLetterContextMenu');

    $("body").on("contextmenu", '.letter_statement_drop', function (e) {

        var node_instance_id = $(this).data('statement-id');

        var StamentHtmlArr = [];
        $(this).siblings().find('.more-txt-span').each(function (index)
        {
            StamentHtmlArr.push($(this).html());
        });

        $courseLetterContextVar.find('.letter-delete-statement').data('id', node_instance_id);
        $courseLetterContextVar.find('.letter-edit-statement').data('value', StamentHtmlArr);
        $courseLetterContextVar.find('.letter-edit-statement').data('node-id', node_instance_id);
        $courseLetterContextVar.css({
            display: "block",
            left: e.pageX,
            top: e.pageY

        });
        var getCoursePosition = $("#courseLetterContextMenu").position().left;
        if (getCoursePosition > remainingWindowWidth) {
            $courseLetterContextVar.css({
                left: "inherit",
                right: "230px"
            });
        }
        else {

        }

        return false;
    });

    $('.letter-message-wrap').on('update', function () {
        $('#courseLetterContextMenu').hide();
    });
    $statementListContextMenu.on("click", "a", function () {
        $('#courseLetterContextMenu').hide();
    });
    $('body').click(function () {
        $('#courseLetterContextMenu').hide();
    });
    $(".letter-message-wrap").scroll(function () {
        $('#courseLetterContextMenu').hide();
    });


    var $imgViewCourseContextMenu = $('#courseImgContextMenu');
    $('body').on("contextmenu", '.atch-img-border-course, .anchor-box-course', function (e) {

        var node_instance_id = $(this).closest('.common-class').data('instance_id');

        $imgViewCourseContextMenu.find('.img-delete-statement').data('id', node_instance_id);

        $imgViewCourseContextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY

        });
        //checkContextMenu();
        return false;
    });


    $imgViewCourseContextMenu.on("click", "a", function () {
        $('#courseImgContextMenu').hide();
    });
    $('body').click(function () {
        $('#courseImgContextMenu').hide();
    });
    $(window).scroll(function () {
        $('#courseImgContextMenu').hide();
    });

    $('.message-wrap').on('scroll', function () {
        $('#courseImgContextMenu').hide();
    });


    /*code here for show and assing value for modal in letter case*/
    var $imgLetterViewCourseContextMenu = $('#courseLetterImgContextMenu');
    $('body').on("contextmenu", '.atch-img-letter-course-border, .anchor-letter-box-course', function (e) {
        //var node_instance_id  = $(this).closest('.common-class').data('instance_id');
        var node_instance_id = $(this).closest('.single_msg_info').siblings('.single_msg_detail').data('statement-id');

        $imgLetterViewCourseContextMenu.find('.letter-img-delete-statement').data('id', node_instance_id);

        $imgLetterViewCourseContextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY

        });
        var getCoursePosition = $("#courseLetterImgContextMenu").position().left;
        if (getCoursePosition > remainingWindowWidth) {
            $imgLetterViewCourseContextMenu.css({
                left: "inherit",
                right: "230px"
            });
        }
        else {

        }

        return false;
    });


    $('.letter-message-wrap').on('update', function () {
        $('#courseLetterImgContextMenu').hide();
    });
    $imgLetterViewCourseContextMenu.on("click", "a", function () {
        $('#courseLetterImgContextMenu').hide();
    });
    $('body').click(function () {
        $('#courseLetterImgContextMenu').hide();
    });
    $(".letter-message-wrap").scroll(function () {
        $('#courseLetterImgContextMenu').hide();
    });

}
$('.letter-message-wrap').on('update', function () {
    $('#courseLetterContextMenu').hide();
});
$('body').click(function () {
    $('#courseLetterContextMenu').hide();
});
$(".letter-message-wrap").scroll(function () {
    $('#courseLetterContextMenu').hide();
});

/* ========== course-context-menu ========== */

/* ========== course-context-menu-same-userId ========== */

function courseContextMenuDiffReceipients()
{

    $('body').on('mousedown', '.statement_drop', function ()
    {
        if ($(this).closest('li').data('id') == setUserID)
        {
            $(this).addClass("statement_drop");
        }
        else
        {
            $(this).removeClass("statement_drop");
            $('#courseDialogueContextMenu').hide();
        }
    });

    $('body').on('mousedown', '.letter_statement_drop', function () {

        if ($(this).parent(".single_list_wrap").data('id') == setUserID)
        {
            $(this).addClass("letter_statement_drop");

            if ($(this).parent(".single_list_wrap").attr('letter-status') == 1)
            {
                $('#courseLetterContextMenu ul li').find('a.letter-edit-statement').hide();
                //$(this).addClass("statement_drop");
            }

            else if ($(this).parent(".single_list_wrap").attr('letter-status') == 2)
            {
                $(this).removeClass("letter_statement_drop");
                $('#courseLetterContextMenu').hide();
            }
            else {
                if ($(this).parent(".single_list_wrap").attr('letter-status') == 0) {
                    $('#courseLetterContextMenu ul li').find('a.letter-edit-statement').show();
                }
                //$(this).addClass("statement_drop");
            }
        }
        else {

            $(this).removeClass("letter_statement_drop");
            $('#courseLetterContextMenu').hide();
        }
    });

    $('body').on('mousedown', '.statement_drop', function ()
    {
        if ($(this).closest('li').data('id') == setUserID)
        {
            $(this).addClass("statement_drop");
        }
        else
        {
            $(this).removeClass("statement_drop");
            $('#courseDialogueContextMenu').hide();
        }
    });

    /*for chat section click on anchor*/
    $('body').on('mousedown', '.atch-img-border-course, .anchor-box-course', function () {
        if ($(this).closest('li').data('id') == setUserID) {
            $(this).addClass("atch-img-border-course");
            $(this).addClass("anchor-box-course");
        }
        else {
            $(this).removeClass("atch-img-border-course");
            $(this).removeClass("anchor-box-course");
            $('#courseImgContextMenu').hide();
        }
    });

    /*for letter section click on anchor*/
    $('body').on('mousedown', '.atch-img-letter-course-border, .anchor-letter-box-course', function () {
        if ($(this).closest('li').data('id') == setUserID) {
            $(this).addClass("atch-img-letter-course-border");
            $(this).addClass("anchor-letter-box-course");
        }
        else {
            $(this).removeClass("atch-img-letter-course-border");
            $(this).removeClass("anchor-letter-box-course");
            $('#courseLetterImgContextMenu').hide();
        }
    });

}

/* ========== course-context-menu-same-userId ========== */


/*
 * Created By Divya
 * On Date: 18th May 2016
 * Purpose: open Document Editor page on enter hit of document title
 *@page = resource
 */
$(document).ready(function () {
    $('body').on('keydown', '#newDocumentFlyout #document_title', function (e) {
        if (e.keyCode == 13) {
            enableDisablestatus = 0;
            $('.action-file2').find('i.done').closest('a').trigger('click');
        }
    });
});

function setMaskWidthHeight() {
    // manage height & width course view loader
    var courseViewWidth = $(".courseViewData.display-wrapper").outerWidth();
    var useractionWidth = $(".user-action-wrap").outerWidth();
    var courseViewHeight = $(".courseViewData.display-wrapper").outerHeight();
    $(".mask-course-view").css({"width": courseViewWidth + useractionWidth, "height": courseViewHeight});

}

function imitationDemoWidthHeight() {

    // viewCourseDefaultWrapper set height & width
    // var viewCourseHght = $(".viewCourseDefaultSec").outerHeight();
    // $(".viewDefaultContainer, .imitation-wrapper").height(viewCourseHght);
}

function manageDocEdtHig() {
    if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) { //(changes)
        $breadcrumbWrap = 10;
        var windowWidthEDT = $(window).height() - $(".edtHeader").outerHeight() - $("header").outerHeight() - $breadcrumbWrap - 22;
        //windowWidthEDT = Math.floor(windowWidthEDT/22) * 22;
        if ($(".mainScroll").find('#edt').hasClass('structured')) {
            $("#edt").css("min-height", windowWidthEDT);
            $(".mainScroll").css("height", windowWidthEDT);
        }
        else {
            $("#edt").css("min-height", windowWidthEDT + 22);
            $(".mainScroll").css("height", windowWidthEDT + 22);
        }
        $(".edtTOC").css("height", windowWidthEDT);
    }
    else {

        $breadcrumbWrap = 51;
        var windowWidthEDT = $(window).height() - $(".edtHeader").outerHeight() - $("header").outerHeight() - $breadcrumbWrap - 22;
        //windowWidthEDT = Math.floor(windowWidthEDT/22) * 22;
        if ($(".mainScroll").find('#edt').hasClass('structured')) {
            $("#edt").css("min-height", windowWidthEDT);
            $(".mainScroll").css("height", windowWidthEDT);
        }
        else {
            $("#edt").css("min-height", windowWidthEDT + 22);
            $(".mainScroll").css("height", windowWidthEDT + 22);
        }
        $(".edtTOC").css("height", windowWidthEDT);
    }
}
function setDrpdownPos(myElement) {
    var getDocHig = $('.edtBody').outerHeight();
    var getDocWT = $('.edtContainer').outerWidth();
    var drpHig = $(myElement).outerHeight();
    var drpWT = $(myElement).outerWidth();
    var getTopPos = parseInt($(myElement).css('top'));
    var getLeftPos = parseInt($(myElement).css('left'));
    var totalHig = getDocHig - drpHig;
    var totalWT = getDocWT - drpWT;
    var setTopPos = (getTopPos - drpHig);

    if (getTopPos > totalHig) {
        $(myElement).css('top', setTopPos);
    }
    $('.drpRightPos').removeClass('drpRightPos');
    if (getLeftPos > totalWT) {
        $(myElement).addClass('drpRightPos')
    }

}

function setCanvasDrpdownPos(myCanvasElement) {
    console.log('canvas loaded');
    var getCnvsHig = $('#edtCanvasView').outerHeight();
    var getCnvsWT = $('#edtCanvasView').outerWidth();
    var drpCnvsHig = $(myCanvasElement).outerHeight();
    var drpCnvsWT = $(myCanvasElement).outerWidth();
    var getCnvsTopPos = parseInt($(myCanvasElement).css('top'));
    var getCnvsLeftPos = parseInt($(myCanvasElement).css('left'));
    var totalCnvsHig = getCnvsHig - drpCnvsHig;
    var totalCnvsWT = getCnvsWT - drpCnvsWT;
    var setCnvsTopPos = (getCnvsTopPos - drpCnvsHig);
    console.log(getCnvsHig, getCnvsWT, drpCnvsHig, drpCnvsWT, getCnvsTopPos, getCnvsLeftPos, totalCnvsHig, totalCnvsWT, setCnvsTopPos)

    if (getCnvsTopPos > totalCnvsHig) {
        $(myCanvasElement).css('top', setCnvsTopPos);
        console.log('canvas loaded top');
    }
    // $('.drpRightPos').removeClass('drpRightPos');
    // if(getCnvsLeftPos>totalCnvsWT){
    //     $(myCanvasElement).addClass('drpRightPos');
    //     console.log('canvas loaded left');
    // }

}

/* function here to text editor assign br*/
function addBrEditor() {
    $('#menudashboard #edt div.edtParagraph:visible').html('<br>').not(':first').remove();
    $(".letter-edt-wrapper:visible").removeAttr('style');
    $("#blank-statement-id").val('');
}


function fileAttachment() {

    alreadyAttached = true;
    var previewTemplateChat = $('#custom-preview-template').html();
    var bindDropZoneOnElement = $("#chatWrapper").data('id');

    var user_instance_node_id = setUserID;
    var username = setUsername;
    isGroupMessage = 5;
    user_recepient_node_id = $(".existingDialogueSelCourseList.current").attr('user-id');
    course_node_id = $(".existingDialogueSelCourseList.current").closest('div').attr('course-dialogue-instance-id');
    dialogue_node_id = $(".existingDialogueSelCourseList.current").attr('data-id');
    var courseStatementType = $(".existingDialogueSelCourseList.current").closest('.course-list').find('.courseboard-table tr td:last').text();
    var diaStatusType = '';
    if (diaStatusType == "0")
    {
        diaStatusType = "Draft";
    } else {
        diaStatusType = "Published";
    }



//  myDropzoneChat.destroy();
    if (myDropzoneCourseChat) {
        myDropzoneCourseChat.element.dropzone = false;
        myDropzoneCourseChat.destroy();
    }

    var clickable = false;
    if ($("#attachFileChat:visible").length) {
        clickable = "#attachFileChat";
    }
    var documentType = $.trim($('#dropLetterExists').text());

    myDropzoneCourseChat = new Dropzone("#existingSelectedCourse", {
        url: domainUrl + "chat-letter-upload.php",
        //url:domainUrl+'menudashboard/appendStatementDialogue',
        previewsContainer: (documentType.toLowerCase() == 'letter') ? undefined : ".msg-statement-wrap",
        clickable: clickable,
        previewTemplate: previewTemplateChat,
        addRemoveLinks: true,
        dictRemoveFile: '',
        dictCancelUpload: '',
        thumbnailWidth: 100,
        thumbnailHeight: 100,
        maxFilesize: 8,
        acceptedMimeTypes: ".jpeg,.jpg,.png,.gif,.zip,.psd,.pdf,.doc,.docx,.xlsx,.csv,.txt",
        sending: function (file, xhr, formData) {
            formData.append('dialogue_node_id', dialogue_node_id);
        },
        uploadprogress: function (file, progress, bytesSent) {
            var myDropzone = this;
            if (firstTime) {
                whiteCircle(file)
            }
            progressSim(progress, file);
        },
        success: function (file, Response) {

            if (dialogue_node_id != '')
            {
                var file_detail = Response.split('~');
                if (file_detail[0] != 'error')
                {

                    // var file_detail = Response.split('~');

                    if (file.type.match(/image.*/) != null) {
                        var attachment = "image";
                    }
                    else
                    {
                        var attachment = "attachment";
                    }

                    /*var dialogue_node_id = $('.chat_wrapper.active .chatters').attr("data-chatter");
                     var groupMessage = $('.chat_wrapper.active').attr("data-group");
                     var user_node = $("#"+dialogue_node_id).find(".user-node-id").data('id'); */
                    var comType = "";
                    var blank_instance_node_id = "";

                    if (documentType == "Letter") {
                        comType = 'appendStatementForDialogueLetterClass';
                        blank_instance_node_id = $("#blank-statement-id").val();
                    } else {
                        comType = 'appendStatementForDialogueClass';
                        blank_instance_node_id = "";
                    }

                    var msg = {
                        dialogue_node_id: dialogue_node_id,
                        user_recepient_node_id: user_recepient_node_id,
                        course_node_id: course_node_id,
                        saveType: 'P',
                        course_dialogue_type: 'new',
                        user_instance_node_id: user_instance_node_id,
                        action: attachment,
                        type: comType,
                        message: file_detail[0],
                        filetype: attachment,
                        attachmentName: file.name,
                        fileTempName: file_detail[1],
                        fileSizeByte: file_detail[2],
                        username: username,
                        isGroupMessage: isGroupMessage,
                        timestamp: getTime(),
                        courseStatementType: 'Published',
                        course_title: $(".existCourseTitle").text(),
                        diaStatusType: diaStatusType,
                        dialogue_title: $(".existDialogueTitle").text(),
                        blank_instance_node_id: blank_instance_node_id

                    };
                    if (dialogue_node_id != undefined)
                    {
                        //saveNodeData(msg);
                        if (documentType == "Letter") {
                            ChatdialogueModule.appendStatementForDialogueLetterClass(msg);
                        } else {

                            ChatdialogueModule.appendStatementForDialogueClass(msg);
                        }
                    }

                    //convert and send data to server
                    //websocketcourse.send(JSON.stringify(msg));
                }
                else
                {
                    $(".panel .fileView").html('');
                    if ($('#messagePopup').modal('show')) {
                        $("body").removeClass("modal-open");
                        $("body").find(".modal-backdrop").addClass("mini-confirm-backdrop");
                        $(".mini-overlay-white-wrapper.white-overlay").removeClass('hide').addClass('show');
                        $("#messagePopup .modal-footer .btn").click(function () {
                            $(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
                        });
                    }
                    else {
                        $(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
                    }
                    $("#messagePopup").find('.series-content').html(file_detail[1]);


                }
            }

            if ($('#error_msg_file').length) {
                $('#error_msg_file').remove()
            }
            myDropzoneCourseChat.removeFile(file); //comment to show after upload
        },
        complete: function () {
            $('.existWrapperMsg').getNiceScroll(0).doScrollTop($('.existWrapperMsg')[0].scrollHeight, -1);
        }
    });
}

$('body').on('keyup', '.chat-textarea:visible #chatTextMessage', function () {
    if ($('#error_msg_file').length) {
        $('#error_msg_file').remove();
    }
});



function manageNiceScroll() {
    $(".niceScrollDiv").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
}

function deleteCourseDialoguePropertyAgain()
{
    if ($(".courseDialogueDefaultWrap.newDefaultCourseList").hasClass('current')) {
        $(".expand-block-head").hide();
        $("#viewCourseControlBar").removeClass('hide').addClass('show');
        $("#viewCourseDefaultWrapper").removeClass('hide').addClass('show');
        $("#newCourseControl").addClass("hide");
        $("#newCourseControl").removeClass("show").addClass("hide");
        $("#newcourseDefaultWrap").removeClass("show").addClass("hide");

    } else {
        $("#tempControler").attr('value', 'menudashboard');
        $("#tempAction").attr('value', 'index');
        $.post(domainUrl + 'menudashboard/index', {'mode': '0', 'setUserID': setUserID}, responseCallAction, 'html');
    }
}

function setDropDownPosition() {
    var windowWidthMenu = $(window).width();
    var userActionWidth = $(".user-action-wrap").outerWidth();
    var getCourseMenuWidth = $(".course_edt_box .edtPopWrap").outerWidth();
    var remainingWindowWidth = windowWidthMenu - (userActionWidth + getCourseMenuWidth);
    var getCoursePosition = $(".course_edt_box .edtPopWrap:visible").position().left;
    var addCoursePositionLeft = getCoursePosition + 60;

    if (addCoursePositionLeft > remainingWindowWidth) {
        $(".course_edt_box #edtHyperlinkPopup, .course_edt_box #edtHyperlinkPreview, .course_edt_box #edtformElementsTextProperties").removeClass('rightDrpDownMenu');
        $(".course_edt_box #edtHyperlinkPopup, .course_edt_box #edtHyperlinkPreview, .course_edt_box #edtformElementsTextProperties").addClass('rightDrpDownMenu');
    }
    else {
        $(".course_edt_box #edtHyperlinkPopup, .course_edt_box #edtHyperlinkPreview, .course_edt_box #edtformElementsTextProperties").removeClass('rightDrpDownMenu');
    }
}


/*
 * Created By: Divya
 * Purpose: Course Dialog Section
 */
/*for new course*/
function newCourseView(visible, hide)
{
    return true; // this statement is used so that below statements do not execute. It is done for REACT implementation.
    if ($.trim(hide) != 'hide') {
        $('.existingSelectedCourseWrap').remove();
    } else {
        $('.existingSelectedCourseWrap').css('display', 'none');
    }

    $('.drop-anchor-select' + visible).html("<i class='icon letterIcon'></i>Letter");

    if ($('.newCourseDefaultSec .edtContainer').parent().hasClass('total-width-pane')) {
        $('.newCourseDefaultSec .edtContainer').unwrap();
    }

    if ($('.newCourseDefaultSec .edtBody .edtBodyWrapper').length == 0) {
        $('.newCourseDefaultSec .edtBody .mainScroll').wrapAll('<div class="edtBodyWrapper"/>');
    }

    if ($('.newCourseDefaultSec .edtBody .edtBodyWrapper .mainScroll .leftScroll').length == 1) {
        $('.newCourseDefaultSec .edtBody .mainScroll .leftScroll').remove();
    }

    if ($('.newCourseDefaultSec .edtBody .edtBodyWrapper .leftScroll').length == 0) {
        $('.newCourseDefaultSec .edtBody .edtBodyWrapper').prepend('<div class="numbering DocInsideHig leftScroll" tabindex="3"></div>');
    }

    if ($('.newCourseDefaultSec .edtBody .mainScroll .chat-textarea').length == 0) {
        $('.newCourseDefaultSec .edtBody .mainScroll').append('<div class="chat-textarea hide"><textarea rows="4" cols="3" class="form-control chat-msg" id="chatTextMessage"></textarea></div>');
    }

    $('.newCourseDefaultSec .edtBody .mainScroll .edt').addClass('letter-edt-wrapper unstructured').removeClass('structured');

    $('.newCourseDefaultSec #userRightFlyout').remove();
    $('.newCourseDefaultSec').find('.edtContainer').addClass('courseEditorCollapsedWrap clearfix course_edt_box');
    $('.newCourseDefaultSec #printMarginBox').remove();

    $('.newCourseDefaultSec #edtHyperlinkPopup').css('display', 'none');
    $('.newCourseDefaultSec .edtHeader').find('.tollbar-panel').remove();
    $('.newCourseDefaultSec .edtHeader').find('.alignment-type').css('display', 'none');
    $('.newCourseDefaultSec .edtMainCol').find('.edtColumns').remove();
    $('.newCourseDefaultSec .edtHeader').find('.alignment-section').addClass('course-alignment-section');

    if ($(".newCourseDefaultSec .alignment-section .alignTotalWrapper").length == 0) {
        var lettericon = $('span#new-letter-icon').clone();
        //lettericon.addClass('clone-new-letter-icon');
        lettericon.css('display', 'block');
        $('.newCourseDefaultSec .alignment-section').prepend(lettericon);
        $(".newCourseDefaultSec .alignment-section").children().wrapAll('<div class="alignTotalWrapper clearfix"/>').wrapAll('<div class="alignLeftWrap"/>');
    }

    $('span.versionName').remove();
    $(".newCourseDefaultSec .alignment-section .alignLeftWrap").siblings('.alignRigthWrap').remove();

    $('#documentMode').val('unstructured');
    $('#documentMode').trigger('change');

    if ($("#alignBoxId").children().length > 0) {
        $("#alignBoxId").children().css('display', 'none').unwrap();
    }

    $(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon .textOrientation").remove();
    $(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon #alignBoxId").remove();

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .fixed-icon").children().length > 0) {
        $(".newCourseDefaultSec .alignment-section .alignLeftWrap .fixed-icon").children().unwrap();
    }

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon").children().length > 0) {
        $(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon").children().unwrap();
    }

    $('.newCourseDefaultSec #documentMode').parent().addClass('tempDocument');
    var spanVisible = $(".newCourseDefaultSec .alignment-section .alignLeftWrap > span:not('.tempDocument')").css('display', 'none');

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .fixed-icon").length == 0) {
        spanVisible.slice(0, 3).wrapAll('<div class="fixed-icon"/>');
    }

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon").length == 0) {
        spanVisible.slice(3).wrapAll('<div class="move-icon"/>');
    }

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .attachmentChat").length == 0) {
        $(".newCourseDefaultSec .alignment-section .alignLeftWrap").append('<span class="icon attachmentChat showTootip hideOnLetterIcon" data-align="edtJustify" data-toggle="tooltip" data-placement="left" data-original-title="Attach Files"></span>');
    }

    spanVisible.addClass('letter-icon hideOnChatIcon');
    $('span#new-letter-icon').removeClass('hideOnChatIcon');
    $('span.attachmentChat').removeClass('hideOnChatIcon');

    if ($(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon .textOrientation").length == 0) {
        $(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon").append('<span class="icon textOrientation hideOnChatIcon more-icons" data-align="edtJustify" data-toggle="tooltip" data-placement="bottom" data-original-title="More" id="MoreIconsShow"></span><span class="alignBoxWrap hide" id="alignBoxId">');
    }

    $(".newCourseDefaultSec .alignment-section .alignLeftWrap .fixed-icon > span:not('.tempDocument')").css('display', 'inline-block');
    $(".newCourseDefaultSec .alignment-section .alignLeftWrap .move-icon > span:not('.tempDocument')").css('display', 'inline-block');


    $('.statementNums').addClass('hide');
    $(".course-alignment-section").removeClass("current-text-editor")
    $(".course-alignment-section:visible").addClass("current-text-editor");

    $(".newCourseDefaultSec .alignment-section .alignLeftWrap").after('<div class="alignRigthWrap"><span class="icon dialogue-close-collapsed showTootip" data-align="edtJustify" data-toggle="tooltip" data-placement="left" title="" style="display: inline-block;" data-original-title="Collapsed"></span></div> ');
    $(".newCourseDefaultSec .alignment-section .alignLeftWrap #hidden_dialog_document_instance_id").attr('id', 'hidden_document_type_id');

    $('.hideOnLetterIcon').hide();
    $('.hideOnChatIcon').show();
    manageCourseEditorIcon();

    var newcourseDefaultWrapHeight = $("#newcourseDefaultWrap").outerHeight();
    $(".courseEditorCollapsedWrap").outerHeight(newcourseDefaultWrapHeight);
    var courseEdtHeigth = $(".courseEditorCollapsedWrap").outerHeight();
    $(".courseEditorCollapsedWrap .edtBody, .courseEditorCollapsedWrap .mainScroll").outerHeight(courseEdtHeigth - 35);

    courseViewShowHide('.newCourseDefaultSec', '.existingSelectedCourseWrap');
}

/*for existing course*/
function existingCourseView(visible, modeType) {
    $('.newCourseDefaultSec').remove();
    if ($.trim(modeType) == 'Letter') {
        $('#dropLetterExists' + visible).html("<i class='icon letterIcon'></i>Letter");


    } else {
        $('#dropLetterExists' + visible).html("<i class='icon chatIcon'></i>Chat");
    }

    if ($('.existingSelectedCourseWrap .edtContainer').parent().hasClass('total-width-pane')) {
        $('.existingSelectedCourseWrap .edtContainer').unwrap();
    }

    if ($('.existingSelectedCourseWrap .edtBody .edtBodyWrapper').length == 0) {
        $('.existingSelectedCourseWrap .edtBody .mainScroll').wrapAll('<div class="edtBodyWrapper"/>');
    }

    if ($('.existingSelectedCourseWrap .edtBody .mainScroll').children('.leftScroll').length == 0) {
        $('.existingSelectedCourseWrap .edtBody .mainScroll').prepend('<div class="numbering DocInsideHig leftScroll" tabindex="3"></div>');
    }

    if ($('.existingSelectedCourseWrap .edtBody .mainScroll .chat-textarea').length == 0) {
        $('.existingSelectedCourseWrap .edtBody .mainScroll').append('<div class="chat-textarea hide"><textarea rows="4" cols="3" class="form-control chat-msg" id="chatTextMessage"></textarea></div>');
    }

    $('.existingSelectedCourseWrap .edtBody .mainScroll .edt').addClass('letter-edt-wrapper unstructured').removeClass('structured');

    $('.existingSelectedCourseWrap #userRightFlyout').remove();

    $('.existingSelectedCourseWrap').find('.edtContainer').addClass('existingDocContainer clearfix course_edt_box').outerHeight(100);

    $('.existingSelectedCourseWrap #printMarginBox').remove();
    //$('.existingSelectedCourseWrap #edtHyperlinkPopup').css('display','none');
    $('.existingSelectedCourseWrap .edtHeader').find('.tollbar-panel').remove();
    $('.existingSelectedCourseWrap .edtHeader').find('.alignment-type').css('display', 'none');
    $('.existingSelectedCourseWrap .edtMainCol').find('.edtColumns').remove();

    $('.existingSelectedCourseWrap .edtHeader').find('.alignment-section').addClass('course-alignment-section');

    $(".existingSelectedCourseWrap .alignment-section").children().find('.alignRigthWrap').remove();

    if ($(".existingSelectedCourseWrap .alignment-section .alignTotalWrapper").length == 0) {
        // var lettericon = $('span.exist-letter-icon').clone();
        // lettericon.addClass('clone-exist-letter-icon');
        // lettericon.css('display', 'block');
        // $('.existingSelectedCourseWrap .alignment-section').prepend(lettericon);

        $(".existingSelectedCourseWrap .alignment-section").children().wrapAll('<div class="alignTotalWrapper clearfix"/>').wrapAll('<div class="alignLeftWrap"/>');
    } else {
        if ($('span.exist-letter-icon').length == 0) {
            // var lettericon = $('span.exist-letter-icon').clone();
            // lettericon.addClass('clone-exist-letter-icon');
            // lettericon.css('display', 'block');
            // $(".existingSelectedCourseWrap .alignment-section").children('.alignTotalWrapper').find('.fixed-icon').children().unwrap();
            // $(".existingSelectedCourseWrap .alignment-section").children('.alignTotalWrapper').find('.move-icon').children().unwrap();
            // $('.existingSelectedCourseWrap .alignment-section .alignTotalWrapper .alignLeftWrap').prepend(lettericon);
        }
    }
    $('span.versionName').remove();

    $('#documentMode').val('unstructured');
    $('#documentMode').trigger('change');

    if ($("#alignBoxId").children().length > 0) {
        $("#alignBoxId").children().css('display', 'none').unwrap();
    }

    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon .textOrientation").remove();
    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon #alignBoxId").remove();

    $('.existingSelectedCourseWrap #documentMode').parent().addClass('tempDocument');
    var spanVisible = $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap > span:not('.tempDocument')").css('display', 'none');

    if ($(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .fixed-icon").children().length > 0) {
    } else {
        spanVisible.slice(0, 3).wrapAll('<div class="fixed-icon"/>');
    }

    if ($(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon").children().length > 0) {
    } else {
        spanVisible.slice(3).wrapAll('<div class="move-icon"/>');
    }

    if ($(".existingSelectedCourseWrap .alignment-section .alignLeftWrap").children(".attachmentChat").length > 0) {
    } else {
        $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap").append('<span id="attachFileChat" class="icon attachmentChat showTootip hideOnLetterIcon" data-align="edtJustify" data-toggle="tooltip" data-placement="left" data-original-title="Attach Files"></span>');
    }

    spanVisible.addClass('letter-icon hideOnChatIcon');
    $('span.exist-letter-icon').removeClass('hideOnChatIcon');

    $('span.attachmentChat').removeClass('hideOnChatIcon');

    if ($(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon .textOrientation").length == 0) {
        $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon").append('<span class="icon textOrientation hideOnChatIcon more-icons" data-align="edtJustify" data-toggle="tooltip" data-placement="bottom" data-original-title="More" id="MoreIconsShow"></span><span class="alignBoxWrap hide" id="alignBoxId">');
    }

    $('.statementNums').addClass('hide');
    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap").after('<div class="alignRigthWrap"><span class="icon editor-expand-btn showTootip course-expand-collapsed-btn" data-align="edtJustify" data-toggle="tooltip" data-placement="left" title="Expand" style="display: inline-block;"></span></div> ');
    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap #hidden_dialog_document_instance_id").attr('id', 'hidden_document_type_id');

    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .fixed-icon > span:not('.tempDocument')").css('display', 'inline-block');
    $(".existingSelectedCourseWrap .alignment-section .alignLeftWrap .move-icon > span:not('.tempDocument')").css('display', 'inline-block');


    if ($.trim(modeType) == 'Letter') {
        $("#dialogue_action_menu").show();
        $("#course-dialogue-draft").show();
        // $("#course-dialogue-cancel").hide();

        $('.hideOnLetterIcon').hide();
        $('.hideOnChatIcon').show();
    } else {
        $("#dialogue_action_menu").show();
        // $("#course-dialogue-cancel").hide();
        $("#course-dialogue-draft").hide();

        $('span#alignBoxId').css('display', 'none');
        $('.hideOnLetterIcon').show();
        $('.hideOnChatIcon').hide();
    }

    var existingHght = $("#existingSelectedCourse").outerHeight();
    var existDocContHght = $(".existingSelectedCourseWrap .existingDocContainer").outerHeight();
    var totalMsgwrapHght = existingHght - 100 - $('.existing-dialogue-block-head').outerHeight();
    $(".letter-message-wrap, .message-wrap").height(totalMsgwrapHght);

    $(".existingSelectedCourseWrap .existingDocContainer .niceScrollDiv").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    $("span.exist-letter-icon:not('.clone-exist-letter-icon')").css('display', 'none');
    $("span.new-letter-icon").css('display', 'none');

    courseViewShowHide('.existingSelectedCourseWrap', '.newCourseDefaultSec');
}

/**/
function courseViewShowHide(showClass, hideClass)
{
    $(hideClass + ' .edtContainer #tableContextMenu').remove();
    $(hideClass + ' .edtContainer #tagContextMenu').remove();
    $(hideClass + ' .edtContainer #edtformElements').remove();
    $(hideClass + ' .edtContainer #edtHyperlinkPopup').remove();
    $(hideClass + ' .edtContainer #edtTagElements').remove();
    $(hideClass + ' .edtContainer #edtHyperlinkPreview').remove();
    $(hideClass + ' .edtContainer #edtformElementsTextProperties').remove();
    $(hideClass + ' .edtContainer #edtformElementsTextPropertiesReference').remove();
    $(hideClass + ' .edtContainer .color-plates-wrap').remove();
    $(hideClass + ' .edtContainer #edt').remove();



    var edtParagraphContent = 0;
    if ($(showClass + ' .edtContainer .edtParagraph').length > 0) {

        $(showClass + ' .edtContainer .edtParagraph').each(function (event, i) {
            if ($.trim($(this).text()) != '') {
                edtParagraphContent++;
            }
        });
        if (edtParagraphContent == 0) {
            $(showClass + ' .edtContainer .edtParagraph').remove();
            var htmlToInsert = '<div class="edtParagraph" data-s="" data-x="0"><br></div>';
            if ($(showClass + ' .edtContainer .mainScroll').children('#edt').length == 0) {
                var htmlToInsertA = '<div contenteditable="true" spellcheck="false" class="edt letter-edt-wrapper unstructured" id="edt">' + htmlToInsert + '</div>';
                $(showClass + ' .edtContainer .mainScroll').append(htmlToInsertA);
            } else {
                $(showClass + ' .edtContainer #edt').append(htmlToInsert);
            }
        }
    } else if ($(showClass + ' .edtContainer .edtParagraph').length == 0) {
        var htmlToInsert = '<div class="edtParagraph" data-s="" data-x="0"><br></div>';

        if ($(showClass + ' .edtContainer .mainScroll').children('#edt').length == 0) {
            var htmlToInsertA = '<div contenteditable="true" spellcheck="false" class="edt letter-edt-wrapper unstructured" id="edt">' + htmlToInsert + '</div>';
            $(showClass + ' .edtContainer .mainScroll').append(htmlToInsertA);
        } else {
            $(showClass + ' .edtContainer #edt').append(htmlToInsert);
        }
    }


    if ($(showClass + ' .edtContainer #tableContextMenu').length > 0) {
        $(showClass + ' .edtContainer #tableContextMenu').remove();
        var tableContextMenu = $('#tableContextMenu').clone();
        tableContextMenu.addClass('tableContextMenu');
        tableContextMenu.css('disply', 'block');
        $(showClass + ' .edtContainer').append(tableContextMenu);
        $("#tableContextMenu:not('.tableContextMenu')").css('display', 'none');
    } else {
        var tableContextMenu = $('#tableContextMenu:not(.tableContextMenu)').clone();
        tableContextMenu.addClass('tableContextMenu tres');
        tableContextMenu.css('disply', 'block');
        $(showClass + ' .edtContainer').append(tableContextMenu);
        $("#tableContextMenu:not('.tableContextMenu')").css('display', 'none');
    }


    if ($(showClass + ' .edtContainer #tagContextMenu').length > 0) {
        $(showClass + ' .edtContainer #tagContextMenu').remove();
        var tagContextMenu = $('#tagContextMenu').clone();
        tagContextMenu.addClass('tagContextMenu');
        tagContextMenu.css('disply', 'block');
        $(showClass + ' .edtContainer').append(tagContextMenu);
        $("#tagContextMenu:not('.tagContextMenu')").css('display', 'none');
    } else {
        var tagContextMenu = $('#tagContextMenu:not(.tagContextMenu)').clone();
        tagContextMenu.addClass('tagContextMenu tres');
        tagContextMenu.css('disply', 'block');
        $(showClass + ' .edtContainer').append(tagContextMenu);
        $("#tagContextMenu:not('.tagContextMenu')").css('display', 'none');
    }


    if ($(showClass + ' .edtContainer #edtformElements').length > 0) {
        $(showClass + ' .edtContainer #edtformElements').remove();
        var edtformElements = $('#edtformElements').clone();
        edtformElements.addClass('edtformElements');
        edtformElements.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElements);
        $("#edtformElements:not('.edtformElements')").css('display', 'none');
    } else {
        var edtformElements = $('#edtformElements:not(.edtformElements)').clone();
        edtformElements.addClass('edtformElements tres');
        edtformElements.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElements);
        $("#edtformElements:not('.edtformElements')").css('display', 'none');
    }


    if ($(showClass + ' .edtContainer #edtHyperlinkPopup').length > 0) {
        $(showClass + ' .edtContainer #edtHyperlinkPopup').remove();
        var edtHyperlinkPopup = $('#edtHyperlinkPopup').clone();
        edtHyperlinkPopup.addClass('edtHyperlinkPopup');
        edtHyperlinkPopup.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtHyperlinkPopup);
        $("#edtHyperlinkPopup:not('.edtHyperlinkPopup')").css('display', 'none');
    } else {
        var edtHyperlinkPopup = $('#edtHyperlinkPopup:not(.edtHyperlinkPopup)').clone();
        edtHyperlinkPopup.addClass('edtHyperlinkPopup tres');
        edtHyperlinkPopup.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtHyperlinkPopup);
        $("#edtHyperlinkPopup:not('.edtHyperlinkPopup')").css('display', 'none');
    }



    if ($(showClass + ' .edtContainer #edtTagElements').length > 0) {
        $(showClass + ' .edtContainer #edtTagElements').remove();
        var edtTagElements = $('#edtTagElements').clone();
        edtTagElements.addClass('edtTagElements');
        edtTagElements.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtTagElements);
        $("#edtTagElements:not('.edtTagElements')").css('display', 'none');
    } else {
        var edtTagElements = $('#edtTagElements:not(.edtTagElements)').clone();
        edtTagElements.addClass('edtTagElements tres');
        edtTagElements.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtTagElements);
        $("#edtTagElements:not('.edtTagElements')").css('display', 'none');
    }



    if ($(showClass + ' .edtContainer #edtHyperlinkPreview').length > 0) {
        $(showClass + ' .edtContainer #edtHyperlinkPreview').remove();
        var edtHyperlinkPreview = $('#edtHyperlinkPreview').clone();
        edtHyperlinkPreview.addClass('edtHyperlinkPreview');
        edtHyperlinkPreview.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtHyperlinkPreview);
        $("#edtHyperlinkPreview:not('.edtHyperlinkPreview')").css('display', 'none');
    } else {
        var edtHyperlinkPreview = $('#edtHyperlinkPreview:not(.edtHyperlinkPreview)').clone();
        edtHyperlinkPreview.addClass('edtHyperlinkPreview tres');
        edtHyperlinkPreview.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtHyperlinkPreview);
        $("#edtHyperlinkPreview:not('.edtHyperlinkPreview')").css('display', 'none');
    }


    if ($(showClass + ' .edtContainer #edtformElementsTextProperties').length > 0) {
        $(showClass + ' .edtContainer #edtformElementsTextProperties').remove();
        var edtformElementsTextProperties = $('#edtformElementsTextProperties').clone();
        edtformElementsTextProperties.addClass('edtformElementsTextProperties');
        edtformElementsTextProperties.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElementsTextProperties);
        $("#edtformElementsTextProperties:not('.edtformElementsTextProperties')").css('display', 'none');
    } else {
        var edtformElementsTextProperties = $('#edtformElementsTextProperties:not(.edtformElementsTextProperties)').clone();
        edtformElementsTextProperties.addClass('edtformElementsTextProperties tres');
        edtformElementsTextProperties.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElementsTextProperties);
        $("#edtformElementsTextProperties:not('.edtformElementsTextProperties')").css('display', 'none');
    }



    if ($(showClass + ' .edtContainer #edtformElementsTextPropertiesReference').length > 0) {
        $(showClass + ' .edtContainer #edtformElementsTextPropertiesReference').remove();
        var edtformElementsTextPropertiesReference = $('#edtformElementsTextPropertiesReference').clone();
        edtformElementsTextPropertiesReference.addClass('edtformElementsTextPropertiesReference');
        edtformElementsTextPropertiesReference.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElementsTextPropertiesReference);
        $("#edtformElementsTextPropertiesReference:not('.edtformElementsTextPropertiesReference')").css('display', 'none');
    } else {
        var edtformElementsTextPropertiesReference = $('#edtformElementsTextPropertiesReference:not(.edtformElementsTextPropertiesReference)').clone();
        edtformElementsTextPropertiesReference.addClass('edtformElementsTextPropertiesReference tres');
        edtformElementsTextPropertiesReference.css('disply', 'block');
        $(showClass + ' .edtContainer').append(edtformElementsTextPropertiesReference);
        $("#edtformElementsTextPropertiesReference:not('.edtformElementsTextPropertiesReference')").css('display', 'none');
    }



    if ($(showClass + ' .edtContainer .color-plates-wrap').length > 0) {
        $(showClass + ' .edtContainer .color-plates-wrap').remove();
        var colorPlate = $('#ColorPlatesSection').clone();
        colorPlate.addClass('ColorPlatesSection');
        colorPlate.css('disply', 'block');
        $(showClass + ' .edtContainer').append(colorPlate);
        $(".color-plates-wrap:not('.ColorPlatesSection')").css('display', 'none');
    } else {
        var colorPlate = $('#ColorPlatesSection:not(.ColorPlatesSection)').clone();
        colorPlate.addClass('ColorPlatesSection tres');
        colorPlate.css('disply', 'block');
        $(showClass + ' .edtContainer').append(colorPlate);
        $(".color-plates-wrap:not('.ColorPlatesSection')").css('display', 'none');
    }

}
/*End Here*/



function removeEdtClassLetter() {
    $(".letter-message-wrap .single_msg_list_box .single_msg_info .more-txt-span").find('.edtParagraph').removeClass('edtParagraph').addClass('EdtChange');
}

function getSubClassesForClassNID(node_class_property_id)
{
    // 601263 // 612065
    var class_node_id = $("#instance_property_caption" + node_class_property_id).val();
    var new_node_id = $("#instance_caption").val();
    var current_num = $("#mapping_joining_div").attr('data-curr-num');

    var name_regex = /^[0-9]+$/;

    if (class_node_id.match(name_regex) && class_node_id.length > 0)
    {
        $.post(domainUrl + 'classes/subClassForMapping', {'class_node_id': class_node_id, 'new_node_id': new_node_id, 'current_num': current_num}, responseGetSubClassesForClassNID, 'HTML');
    }
}

function responseGetSubClassesForClassNID(d, s)
{
    $("#mapping_joining_div").html(d);
}

function getSubClassesOfLocationRole(node_class_property_id)
{
    var location = $("#instance_property_caption" + node_class_property_id).val();
    var new_node_id = $("#instance_caption").val();
    var current_num = $("#mapping_joining_div").attr('data-curr-num');

    if ($.trim(location) != '')
    {
        $.post(domainUrl + 'classes/subClassesOfLocationRole', {'location': location, 'new_node_id': new_node_id, 'current_num': current_num}, responseGetSubClassesOfLocationRole, 'HTML');
    }
}

function responseGetSubClassesOfLocationRole(d, s)
{
    $("#mapping_joining_div").html(d);
}

/*script function here for display course class dialogue information list dynamic html*/
function responseDialogueResourceListCallAction(d,s) {
    var Html = "";
    var userIconClass = "";
    Html += "<ul class='clearfix'>";
    if (d[0] != undefined) {
        for (var i in d) {
            var statement = d[i].statement;
            if (statement) {
                var ext_arr = statement.split('.');
                var ext = ext_arr.pop();
                //console.log(ext);
                if (ext == 'jpg' || ext == 'png' || ext == 'gif') {
                    var format_icon = 'jpg';
                } else if (ext == 'docx') {
                    var format_icon = 'doc';
                }
                else if (ext == 'zip') {
                    var format_icon = 'zip';
                }
                else if (ext == 'pdf') {
                    var format_icon = 'pdf';
                }
                else if (ext == 'xlsx') {
                    var format_icon = 'xls';
                }
                else if (ext == 'csv') {
                    var format_icon = 'csv';
                }
                else if (ext == 'exe') {
                    var format_icon = 'exe';
                }
                else if (ext == 'psd') {
                    var format_icon = 'psd';
                }
                else {
                    var format_icon = 'default';
                }
                $(".collapsedCourseBox.expandedCourseBox").hide();
                Html += '<li class="existingDialogueSelResourcesList"><div class="subCollapsedCourseBox"><div class="courseTitle"><i class="icon left ' + format_icon + '"></i><span class="dialogue_resource_link"><a href="puidata/attachments/' + d[i].dialogue_node_id + '/' + d[i].statement + '" target="_blank">' + d[i].statement + '</a></span></div></div></li>';
            }
        }
    } else {
        Html += "<li class='existingDialogueSelResourcesList'><div class='subCollapsedCourseBox'><div class='courseTitle'><span>No Resource Available.</span></div></div></li>";
    }

    Html += "</ul>";

    //close_accordion_course();
    $('#course-dialogue-resource-instance-id-' + d.course_instance_id).addClass('expandedCourseBox');
    $('#course-dialogue-resource-instance-id-' + d.course_instance_id).html(Html);


    // remove-hover-effect on parent li
    $('.expandedCourseBox ul li').on({
        mouseover: function () {
            $(this).closest(".newDefaultCourseList").addClass("noHover");

        },
        mouseout: function () {
            $(this).closest(".newDefaultCourseList").removeClass("noHover");
        }
    });

    //$(".inline-course-wrap li").find('.collapse-up').removeClass('collapse-up fa-angle-down').addClass('collapse-down fa-angle-up');
    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".courseDialogueDefaultWrap.newDefaultCourseList .toggleCourseWrapper").find('.collapse-down').removeClass('collapse-down fa-angle-down').addClass('collapse-up fa-angle-up');
    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".newDefaultCourseListResources .toggleCourseWrapper").find('.collapse-up').removeClass('collapse-up fa-angle-up').addClass('collapse-down fa-angle-down');
    /*    $(".newDefaultCourseList .expandedCourseBox ul li:odd").css("background","#f4f4f4");
     $(".newDefaultCourseList .expandedCourseBox ul li:even").css("background","#fff");*/
    NProgress.done();
    $(".collapsedCourseBox.expandedCourseBox").slideDown();
}

function toggleSpinner(container_element) {
    var iconEle;
    if (container_element.attr('data-class-names')) {
        iconEle = container_element.find('i.fa');
        iconEle.attr('class', container_element.attr('data-class-names')).removeAttr('style');
        container_element.removeAttr('data-class-names');
    } else {
        iconEle = container_element.find('.icon.plus-class');
        container_element.attr('data-class-names', iconEle.attr('class'));
        iconEle.attr('class', 'fa fa-refresh fa-spin').css('margin-left', '5px');
    }
}

var validationModule = (function () {

    return {
        isInputEmpty: function (input_selector) {

            if (input_selector.is("[type=text]")) {
                return this.isTextBoxEmpty(input_selector);

            }
            return true;
        },
        isTextBoxEmpty:function(input_selector){

            if(input_selector.is('input:text') && input_selector.hasClass('auto-suggest')){
                var eleLength = input_selector.closest('.receivedListBox').find('.global_participant_box_wrap').length;
                if(eleLength>0){
                    return true;
                }else{
                    return false;
                }
            }else{
                    var eleValue = input_selector.val();
                    if($.trim(eleValue)===''){
                        return false;
                    }
                    return true;
            }


        },
        isEditEmpty:function(input_selector){
            if(!input_selector.find('img').length>0){
                if(!$.trim(input_selector.text()).length>0){
                        return false;
                }
            }
           return true;

        }
    }
}());

function handleNotificationOnChatTypeChange(response) {
    var totalUnread = 0;

    if(response.notificationItem.statementType == 'chat')
    {
        if(parseInt(response.notificationItem.totalUnreadCount) > 0)
        totalUnread = parseInt(response.notificationItem.totalUnreadCount) - parseInt(response.notificationItem.unreadChatCount);

        if(parseInt(totalUnread) > 0)
        $("#chat_notification_"+response.notificationItem.dialogue_instance_node_id).removeClass('fadeOut').addClass('fadeIn').html("<span>"+totalUnread+"</span>");
        else
        $("#chat_notification_"+response.notificationItem.dialogue_instance_node_id).removeClass('fadeIn').addClass('fadeOut').html("<span>"+totalUnread+"</span>");

        /*if(parseInt(response.notificationItem.unreadChatCount) > 0) { ?>
            $(".unread-msg-box").find('span.chat-count').text(response.notificationItem.unreadChatCount+' unread messages');
        } else { */
            $(".unread-msg-box").find('span.letter-count').text('0 unread messages');
        // }
    }

    if(response.notificationItem.statementType == 'letter')
    {
        if(parseInt(response.notificationItem.totalUnreadCount) > 0)
        totalUnread = parseInt(response.notificationItem.totalUnreadCount) - parseInt(response.notificationItem.unreadLetterCount);

        if(parseInt(totalUnread) > 0)
        $("#chat_notification_"+response.notificationItem.dialogue_instance_node_id).removeClass('fadeOut').addClass('fadeIn').html("<span>"+totalUnread+"</span>");
        else
        $("#chat_notification_"+response.notificationItem.dialogue_instance_node_id).removeClass('fadeIn').addClass('fadeOut').html("<span>"+totalUnread+"</span>");

        /*if(parseInt(response.notificationItem.unreadLetterCount) > 0) { ?>
            $(".unread-msg-box").find('span.letter-count').text(response.notificationItem.unreadLetterCount+' unread messages');
        } else { */
            $(".unread-msg-box").find('span.letter-count').text('0 unread messages');
        //}
    }
}
/**
* Modified By: Kunal Kumar
* Date: 12-Apr-2017
* List Dialogue Actors Response
* @param array
*/
function responseDialogueActorListCallAction(d, s) {
    // defaultOpenNewCourseDialogBox();
    var Html = "";
    Html += "<ul class='clearfix'>";
    $.each(d.user, function (index, obj) {
        //console.log(d[i]);
        Html += '<li class="actors_user_list" data-id=""><div class="actors_box clearfix"><div class="actors-user-img-sm"><img src="public/img/user.png" class="img-responsive"></div><div class="actors-user-info"><h2 class="actors-title">' + obj + '</h2></div></div></div></li>';
    });
    Html += '</ul>';
    var targetEle = $('#showActorList' + d.course_node_id);
    toggleSpinner(targetEle.prev());
    targetEle.addClass('expandedCourseBox').html(Html);
    $('.expandedCourseBox ul li').on({
        mouseover: function () {
            $(this).closest(".newDefaultCourseList").addClass("noHover");

        },
        mouseout: function () {
            $(this).closest(".newDefaultCourseList").removeClass("noHover");
        }
    });

    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".newDefaultCourseListActor.newDefaultCourseList .toggleCourseWrapper").find('.collapse-up').removeClass('collapse-up fa-angle-up').addClass('collapse-down fa-angle-down');
    $(".newDefaultCourseListActor .expandedCourseBox ul li:odd").css("background", "#f4f4f4");
    NProgress.done();
    $(".collapsedCourseBox.expandedCourseBox").slideDown();
}



function manageDialogueHT(){
    return true;
    $(".chat-textarea textarea").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    var midExistHght = $(".existingSelectedCourseWrap").outerHeight();
    var msgBox = $(".unread-msg-box");
    var existingDocContainer = $(".existingDocContainer:first");


    if ($(".course-expand-collapsed-btn").hasClass("editor-expand-btn")) {
        if ($(".drop-anchor-select:first:visible").text() == "Letter") {
            $(".letter-count").show();
            $(".chat-count").hide();
            $(".message-wrap").addClass("hide");

        }
        else if ($(".drop-anchor-select:first:visible").text() == "Chat") {
            $(".letter-count").hide();
            $(".chat-count").show();
            $(".message-wrap").addClass("hide");
            msgBox.removeClass("hide").addClass("show");
        }


        msgBox.removeClass("show").addClass("hide");
        $(".message-wrap").removeClass("hide");
        if ($(".breadcrumb-wrap").hasClass('breadcrumb-up')) {
            $breadcrumbWrap = 10;
            var height = $(window).height() - $('header').outerHeight()- $('.existing-dialogue-block-head, .dialogue-container').outerHeight() - $breadcrumbWrap;
            $('.HalfPaneHeight').height(height);
        }
        else{
            $breadcrumbWrap = 51;
            var height = $(window).height() - $('header').outerHeight()- $('.existing-dialogue-block-head, .dialogue-container').outerHeight() - $breadcrumbWrap;
            $('.HalfPaneHeight').height(height);
        }
        var existingHght        = $("#existingSelectedCourse").outerHeight();
        var existDocContHght    = $(".existingSelectedCourseWrap .existingDocContainer").first().outerHeight();
        var totalMsgwrapHght    = existingHght - 100;
        $(".letter-message-wrap, .message-wrap").height(totalMsgwrapHght);
        $(".course-expand-collapsed-btn").closest(".course_edt_box").removeClass('manageCourseEditorPopTop');
    }

    else {
        msgBox.removeClass("hide").addClass("show");
        var unreadmsgHght = $(".unread-msg-box").outerHeight();
        var editorExpandHght = midExistHght - unreadmsgHght;
        existingDocContainer.outerHeight(editorExpandHght);
        $(".course-expand-collapsed-btn").closest(".course_edt_box").addClass('manageCourseEditorPopTop');
        $('.document-pane').height()
    }




    EditorHT(true);
    if($('.course-alignment-section').length) {
        var getOffset = $('.course-alignment-section').offset().top
        if (getOffset > 500){
            $('.course-alignment-section').find('.StatementType').addClass('drpBottom');
        }
        else{
            // below statement has been commented because chat-type drop was not visible due to minimum height.
            // $('.course-alignment-section').find('.StatementType').removeClass('drpBottom');
        }
    }

    $(".niceScrollDiv.document-pane").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    setTimeout(function() {
        // let niceScroll = $(".letter-message-wrap, .message-wrap").getNiceScroll(0);
        // if(niceScroll) {
        //     niceScroll.doScrollTop($(".msg-statement-wrap").height() - 1, 1);
        // }
        if ($(".drop-anchor-select:first:visible").text() == "Letter") {
            var getmainHT = $('.HalfPaneHeight').height();
            var getmsgHT = $('.message-wrap').height();

            if($('.message-wrap').hasClass('hide')){
                $('.document-pane').height(getmainHT - 70);
                console.log(getmainHT)
            }
            else{
                $('.document-pane').height(63);
            }
        }

    },100);
}

function openDialogueOptionsDrop(clicked_element) {

    var getTopPos = clicked_element.offset().top;
    var getOffset = clicked_element.offset().top + 70;
    var AvailHT     = $(window).height() - 180;
    clicked_element.toggleClass('open');

    if(clicked_element.hasClass('open')) {
        $("body").append("<div class='background-layer'></div>")
    } else {
        $('.background-layer').remove();
    }

    if (getOffset > AvailHT) {
        clicked_element.find('.dropdown-menu').addClass('drpBottom');
        clicked_element.find('.dropdown-menu').css('top', 'inherit');
    }
    else{
        clicked_element.find('.dropdown-menu').removeClass('drpBottom');
        clicked_element.find('.dropdown-menu').css('top', getTopPos);
    }
}
function noParticipantHT(){
    var midPaneHT       =   $('.display-wrapper').outerHeight();
    var topBarHT        =   $('.existing-dialogue-control-wrap').outerHeight();

    $('.existingSelectedCourseWrap.HalfPaneHeight').height(midPaneHT - topBarHT);
    $(".existWrapperMsg").outerHeight(midPaneHT - topBarHT - 100);

    $(".existingSelectedCourseWrap .existingDocContainer .niceScrollDiv").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
}
function courseTitleTruncate(){
    var gettotalWD  =   $(".existLeftPanel").outerWidth();
    var getCourseWD =   $(".course_rename_view_mode").outerWidth();
    var getdeatilWD =   $(".dialogue_rename_view_mode").outerWidth();
    var gethalfWD   =   gettotalWD / 2;

    if(getCourseWD > getdeatilWD){
        $(".course_rename_view_mode").css("max-width", gettotalWD - getdeatilWD - 10);
    }
    else if(getdeatilWD > getCourseWD){
        $(".dialogue_rename_view_mode").css("max-width", gettotalWD - getCourseWD - 10);
    }
}
function responseEmailSubMenuAction(data,source)
{
    $(".menu-items").html(data);
}
window.puJsFileLoadCounter++;

function isUserLoggedIn() {
    if(typeof setUserID == 'undefined' || setUserID == '') {
        return false;
    }
    return true;
}
function isActionMenuFlyoutOpen(element) {
    if(element) {
        return (element.hasClass('in'));
    }
    return ($("#nav").hasClass('in'));
}

function applyScroller(container_selector) {
    $(".nano").nanoScroller();
}
function openFlyout(clicked_element) {
    clicked_element.toggleClass('openflyout');
    if (clicked_element.hasClass('openflyout')) {
        var getID = clicked_element.attr('id');
        var flyoutElement = $('#' + getID + ".leftFlyout");

        var animateParams = {left: '102px'};
        var actionFlyoutElement = $("#nav");

        if(isActionMenuFlyoutOpen(actionFlyoutElement)) {
            animateParams = {left: '267px'};
            actionFlyoutElement.addClass('subflyout-in');
        } else {
            actionFlyoutElement.removeClass('subflyout-in');
        }
        flyoutElement.animate(animateParams).addClass('in');
        sideFlyoutHeight();
        $(".nano").nanoScroller();
        $('.loadder').show();
    }
    else {
        $('#' + getID + ".leftFlyout").animate({left: '-100%'}).removeClass('in');
        $('.loadder').hide();
    }
    event.stopPropagation();
}
window.mouseposition = {};
$(document).ready(function() {
    var body = $('body');
    body.mousemove(function(event) {
        window.mouseposition = {
            x: event.pageX,
            y: event.pageY
        };
    });
    body.on('mouseleave', '.stmt-wrap-pane', function() {
        $(this).find('.reply-options.open').removeClass('open');
    })
});

function isElementCompletelyVisible(elm) {
    var window_height = $(window).height();
    var dropdown_height = elm.find('.dropdown-menu').height();
    var bottom = window.mouseposition.y + dropdown_height;
    var editor_height = 150;// fixed. Because when editor is at the bottom then its height is 100px;

    if(window_height - bottom <= editor_height) {
        elm.find('.dropdown-menu').addClass('dropdown-up');
        return true;
    }
    elm.find('.dropdown-menu').removeClass('dropdown-up');
}
function checkWindowFocus() {
    if(document.hasFocus() == window.lastFocusStatus) return;
    window.lastFocusStatus = !window.lastFocusStatus;
    return window.lastFocusStatus ? true : false;
}
window.lastFocusStatus = document.hasFocus();

function toggleItemList(node_id, list_wrapper_class) {
    let leftPane = $("#leftPane");
    let notificationElement = $("#leftPane").find('table[data-course-node-id="' + node_id + '"]').parent().find('.course-list-detail');
    let container = notificationElement.find(list_wrapper_class).find('.collapsedCourseBox');
    (container.is(':visible')) ? container.removeClass('expandedCourseBox') : container.addClass('expandedCourseBox');
}
