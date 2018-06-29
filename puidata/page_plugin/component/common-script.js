$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: "hover"
    });
    activeRow();

    var fileUploadHtml = {};
    fileUploadHtml.addList        = "<span class='add-more-file prs_add_new_list'>";
    fileUploadHtml.addList       +=    "<i class='prs-icon add'></i>";
    fileUploadHtml.addList       += "</span>";

    fileUploadHtml.removeList     = "<span class='prs_remove_new_list'>";
    fileUploadHtml.removeList    +=     "<i class='prs-icon icon_close'></i>";
    fileUploadHtml.removeList    += "</span>";

    fileUploadHtml.uploadNewList  = "<div class='prs_row_append'>";
    fileUploadHtml.uploadNewList +=     "<input type='file' class='filestyle operation_documentarr' name='operation_document[]'/>";
    fileUploadHtml.uploadNewList +=     "<div class='upload-right-pane'>";
    fileUploadHtml.uploadNewList +=         fileUploadHtml.addList;
    fileUploadHtml.uploadNewList +=         fileUploadHtml.removeList;
    fileUploadHtml.uploadNewList +=     "</div>";
    fileUploadHtml.uploadNewList += "</div>";

    $("body").on("click", ".prs_row_append .prs_add_new_list", function(){
        $(".upload-wrap").append(fileUploadHtml.uploadNewList);
        $(".upload-wrap :file").filestyle({icon: false});
        if($(this).siblings('.prs_remove_new_list').length === 0){
            $(this).after(fileUploadHtml.removeList);
        }
        $(this).remove();
    });


    $("body").on("click", ".prs_row_append .prs_remove_new_list", function(){
        var parentToRemove = $(this).parents('.prs_row_append');
        if($(this).siblings('.prs_add_new_list').length === 1){
            $(this).parents('.prs_row_append').prev().find('.prs_remove_new_list').before(fileUploadHtml.addList);
        }
        if($(this).parents('.upload-wrap').children().length === 2){
            $('.prs_remove_new_list').remove();
        }
        parentToRemove.remove();
    });



    // $('#j_my_esign').flyout({type: 'overlay', horizontal: 'right', slideDirection: 'right'});
});

function manageScrollBar() {

    setTbodyHt();
    require(['jquery','mousewheel','scrollbar'], function() {
        //setGridScrollBars();
        $(".customScroll").mCustomScrollbar({
            axis: "yx", // vertical and horizontal scrollbar
            theme: "dark",
            autoHideScrollbar: true,
            setLeft:0,
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true
            },
            mouseWheel:{ scrollAmount: '100px'},
            callbacks:{
                whileScrolling:function(){

                    if($('#ui-datepicker-div').is(":visible")){
                        $('#ui-datepicker-div').hide();
                    }
                }
            }

            // onInit: function(){
            //     console.log('onInit.......');
            //     $(".customScroll").mCustomScrollbar("scrollTo",0);
            // }

        });
    });
}

function setGridScrollBars(){
    $(".customScroll.gridViewTable").mCustomScrollbar("destroy");
    $(".customScroll.gridViewTable").mCustomScrollbar({
    axis: "yx", // vertical and horizontal scrollbar
    theme: "dark",
    autoHideScrollbar: true,
    advanced:{
    updateOnBrowserResize:true,
    updateOnContentResize:true,
    },
    callbacks:{
      whileScrolling: function(){
        $("#gridViewHead").width($("#gridView tbody").width());
        $("#gridViewHead").css("left",this.mcs.left+"px");

      }
    }
    });
}

function setDigitalScroll(){
        $(".customScroll.signWrap").mCustomScrollbar("destroy");
        $(".customScroll.signWrap").mCustomScrollbar({
        axis: "yx", // vertical and horizontal scrollbar
        theme: "dark",
        autoHideScrollbar: true,
        advanced:{
        updateOnBrowserResize:true,
        updateOnContentResize:true,
        },
        callbacks:{
          whileScrolling: function(){


          }
        }
        });
    }


$(window).resize(function () {
    resizeHT();
    threePane();
    setTbodyHt();
    paneMidHt();
    menuHT();
    gridHT();
   // signatureResize();
    var getframeHT = $('.mid-section-HT').outerHeight();
    $('#iframe-content').height(getframeHT);
    $('#role_actor_mapping').css('min-height', getframeHT - 40)
    $('.signWrap').height($('.mid-section-HT').height()-50);
    if(typeof EditorPaneHT == 'function') {
        EditorPaneHT();
    }
    if(($(window).width()<1280) && ($('.pin-slide').find('.pin').hasClass('un-pin'))){
        $('.pin-slide').trigger('click');
    }
    var getWT = $(window).width();
    if(getWT <= '1100'){
        $('canvas#digitalSign').attr('width','255');
    }
    else{
        $('canvas#digitalSign').attr('width','350');
    }
});


function resizeHT() {
    if(typeof BreadcrumbModule == 'undefined') {
        return true;
    }
    winHT = $(window).height() - BreadcrumbModule.getBreadcrumbHeight() - $('.header-stick-top').outerHeight();
    $('.ref-winHT').height(winHT+1);

}

function gridHT() {
    if(typeof BreadcrumbModule == 'undefined') {
        return true;
    }
    getHT = $(window).height() - BreadcrumbModule.getBreadcrumbHeight() - $('.header-stick-top').outerHeight() - $('.tp-actn-bar').outerHeight(true) - $('#gridHeader').outerHeight() - $('#gridViewHead').outerHeight();
    $('.gridViewTable-HT').height(getHT);

}

function menuHT(){
    if(typeof BreadcrumbModule == 'undefined') {
        return true;
    }
    winHT = $(window).height() - BreadcrumbModule.getBreadcrumbHeight() - $('.menu-items li').eq(0).outerHeight() - $('.header-stick-top').outerHeight() - 65;
    $('.menu-WinHT').height(winHT);
}

function threePane() {
    // Manage width and height for Three Pane Screen
    $('html').css({'overflow': 'hidden'})
    var scrollWidth = 10;
    winWTH = $(window).width();

    asideMenu = $('.aside-wrap').width();
    leftMenuPane = $('.prs-left-action-pane').outerWidth();

    totalWidth = (winWTH - asideMenu - leftMenuPane);

    $('.universe-wrap').width(totalWidth);
    $('.jq_flyout-WH').css('width', totalWidth / 2 + 30);
    //$('html').css({'overflow':'auto'})
}

function modifyListLayout(setTbodyHT) {

    // if vertical scroll bar is showing then
    var lastRow = setTbodyHT.find('div[data-node-id]:last');
    if(setTbodyHT.find('.mCSB_scrollTools_vertical:visible').length) {
        lastRow.addClass('border-btn-0');
    } else {
        lastRow.removeClass('border-btn-0')
    }

}

var timeoutInterval = 0;
function setTbodyHt() {

    if(typeof BreadcrumbModule == 'undefined') {
        return true;
    }
    // Listing table set height

    var winHT       =   $(window).height() - $('.header-stick-top').outerHeight();
    var listingMPHT =   $('.tp-actn-bar').outerHeight() +
                            $('.listing-table-head').outerHeight() +
                            $('.list-bottom').outerHeight();

    var availHT     =   winHT - listingMPHT - BreadcrumbModule.getBreadcrumbHeight();

    var setTbodyHT = $('.set-tbody-HT');
    setTbodyHT.height(availHT);

    clearTimeout(timeoutInterval);

    timeoutInterval = setTimeout(function() {
        modifyListLayout(setTbodyHT);
    }, 200);

    //console.log($('.uv-control-bar:first').outerHeight(), $('.listing-table-head').outerHeight(), $('.list-bottom').outerHeight());
}

function paneMidHt() {
    if(typeof BreadcrumbModule == 'undefined') {
        return true;
    }
    // two pane mid section height
    var winHT           =   $(window).height() - $('.header-stick-top').outerHeight();
    var listingTopBar   =   47;
    var paginationPanelHeight = $('.list-bottom').outerHeight();
    var TotalHT  = winHT - listingTopBar - BreadcrumbModule.getBreadcrumbHeight();
    $('.mid-section-HT').each(function() {
        var _this = $(this);
        var nextEle = _this.parent().next();
        if(nextEle.hasClass('flyout-pagination-box')) {
            _this.height(TotalHT - paginationPanelHeight);
        } else {
            _this.height(TotalHT);
        }
    });

    // $('.mid-section-HT').height(TotalHT - paginationPanelHeight);
}
/*===============Open filer dropdown====================*/
var body_ele = $('body');

body_ele.off('click', '.filter-menu .open-filter-menu').on('click', '.filter-menu .open-filter-menu', function (event) {

    if ($(this).siblings('ul').hasClass('show'))
    {
        clearFilter();
        $(this).removeClass('active').siblings('ul').removeClass('show');
    }
    else
    {
        clearFilter();
        $('.open-filter-menu').siblings('ul').removeClass('show');
        $('.open-filter-menu').removeClass('active');
        $('.open-filter-menu').parent('th').siblings('th').children('ul').removeClass('show');
        $('.open-filter-menu').parent('th').siblings('th').children('span').removeClass('active');
        $(this).addClass('active').siblings('ul').addClass('show');
        if($(this).closest('#gridContainer thead').hasClass('filter-plugin')){
            setDropDownPosition();
        }

    }
    event.stopPropagation();
});

body_ele.off('click', '.filter-menu ul.multi-menu > li').on('click', '.filter-menu ul.multi-menu > li', function (event) {
    if (!($(this).hasClass('parent-item'))) {
        $(this).parents('ul.multi-menu').find('.show-sub-child').remove();
        $(this).siblings('.search-item-wrap').hide();
        $(this).siblings('li').removeClass('active');
        $(this).siblings('li').find('li').removeClass('active');
        $(this).addClass('active');
        event.stopPropagation();
    }
});

body_ele.off('click', '.filter-menu ul.multi-menu li li').on('click', '.filter-menu ul.multi-menu li li', function (event) {
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
    filterApplied($(this), 'removeClass');

    event.stopPropagation();
});

body_ele.off('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap').on('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap', function (event) {
    event.stopPropagation();
});

body_ele.off('click', '#gridViewHead .search-item-wrap .form-control').on('keypress', '#gridViewHead .search-item-wrap .form-control', function (e) {
    var getValue = $(this).data('save');
    if (e.which == 13) {
        $(this).closest('.input-group').find("button").trigger("click");
        $('.multi-menu').find('li:first').trigger('click');
        $('.multi-menu').find('li').removeClass('active');
        $(this).val('');
    }
});

$('body, .entr-filter').on('click', function () {
    if ($('.filter-menu ul.multi-menu').hasClass('show')) {
        $('.filter-menu ul.multi-menu ').removeClass('show');
        $('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
    }
});

body_ele.off('click', '.filter-menu input[data-save]').on('keypress', '.filter-menu input[data-save]', function (e) {
    //alert(1);
    var getValue = $(this).data('save');
    if (e.which == 13) {
        $('.' + getValue).closest('.filter-menu ul.multi-menu ').removeClass('show');
        $('.' + getValue).closest('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
    }
});


body_ele.off('click.pin_it', '.pin-slide').on('click.pin_it', '.pin-slide', function() {

});

body_ele.off('click.sort', '.filter-menu ul.multi-menu > li.sort-by').on('click', '.filter-menu ul.multi-menu > li.sort-by', function (event) {
        filterApplied($(this), 'addClass');
        resetTextFilter($(this));
        resetSortedClass();
});

function filterMenu() {
}


function activeRow() {
//    $('body').on('click', '.listing-table-body .row', function () {
//        $(this).siblings('.row').removeClass('active-tr');
//        $(this).addClass('active-tr');
//    })
}

function setDropDownPosition(){
    var getTableWT      =   $('.gridViewTable').outerWidth();
    var getDrpWT        =   $('.multi-menu.show').outerWidth()+128;
    var getDrpLeftPos   =   $('.multi-menu.show').offset().left;
    var getTotalWT      =   getTableWT - getDrpWT;
    console.log(getTableWT);
    console.log(getDrpWT);
    console.log(getDrpLeftPos);
    console.log(getTotalWT);
    if(getDrpLeftPos > getTotalWT ){
        $('.multi-menu').removeClass('rightDrpDownMenu');
        $('.multi-menu.show').addClass('rightDrpDownMenu');
    }
    else{
        $('.multi-menu').removeClass('rightDrpDownMenu');
    }
}

/* textarea scroll */
(function ($) {
    var textArea = $(".customTextarea textarea");
    textArea.wrap("<div class='textarea-wrapper' />");
    var textAreaWrapper = textArea.parent(".textarea-wrapper");
    if ($(textAreaWrapper).length > 0) {
        textAreaWrapper.mCustomScrollbar({
            scrollInertia: 0,
            advanced: {autoScrollOnFocus: false},
            theme: "dark",
            mouseWheel: {enable: true}
        });
    }

    var hiddenDiv = $(document.createElement("div")),
            content = null;
    hiddenDiv.addClass("hiddendiv");
    $("body").prepend(hiddenDiv);
    textArea.bind("keyup", function (e) {
        content = $(this).val();
        var clength = content.length;
        var cursorPosition = textArea.getCursorPosition();
        content = "<span>" + content.substr(0, cursorPosition) + "</span>" + content.substr(cursorPosition, content.length);
        content = content.replace(/\n/g, "<br />");
        hiddenDiv.html(content + "<br />");
        $(this).css("height", hiddenDiv.height());
        textAreaWrapper.mCustomScrollbar("update");
        var hiddenDivSpan = hiddenDiv.children("span"),
                hiddenDivSpanOffset = 0,
                viewLimitBottom = (parseInt(hiddenDiv.css("min-height"))) - hiddenDivSpanOffset,
                viewLimitTop = hiddenDivSpanOffset,
                viewRatio = Math.round(hiddenDivSpan.height() + textAreaWrapper.find(".mCSB_container").position().top);
        if (viewRatio > viewLimitBottom || viewRatio < viewLimitTop) {
            if ((hiddenDivSpan.height() - hiddenDivSpanOffset) > 0) {
                textAreaWrapper.mCustomScrollbar("scrollTo", hiddenDivSpan.height() - hiddenDivSpanOffset);
            } else {
                textAreaWrapper.mCustomScrollbar("scrollTo", "top");
            }
        }
    });
    $.fn.getCursorPosition = function () {
        var el = $(this).get(0),
                pos = 0;
        if ("selectionStart" in el) {
            pos = el.selectionStart;
        } else if ("selection" in document) {
            el.focus();
            var sel = document.selection.createRange(),
                    selLength = document.selection.createRange().text.length;
            sel.moveStart("character", -el.value.length);
            pos = sel.text.length - selLength;
        }
        return pos;
    }
})(jQuery);


// for single to two pane converssion

function DocSinglePaneResize(){
    $('.tp-actn-bar').find('.main-title').eq(0).removeClass('flexDualPane flexThirdPane docCanvasView').addClass('flexSinglePane');
    $('.listing-wrap').removeClass('flexDualPane flexThirdPane docCanvasView').addClass('flexSinglePane');
}
function DocThirdPaneResize(){
    $('.tp-actn-bar').find('.main-title').eq(0).removeClass('flexDualPane docCanvasView').addClass('flexThirdPane');
    $('.listing-wrap').removeClass('flexDualPane docCanvasView').addClass('flexThirdPane');
}
function DocDualPaneAnmate(){
    $('.tp-actn-bar').find('.main-title').eq(0).removeClass('flexSinglePane flexThirdPane docCanvasView').addClass('flexDualPane');
    $('.listing-wrap').removeClass('flexSinglePane flexThirdPane docCanvasView').addClass('flexDualPane');
}

function loadCanvasPaneAnmate(){
    $('.tp-actn-bar').find('.main-title').eq(0).removeClass('flexSinglePane flexThirdPane flexDualPane').addClass('docCanvasView');
    $('.listing-wrap').removeClass('flexSinglePane flexThirdPane flexDualPane').addClass('docCanvasView');
 }

function resetTextFilter(currentElem) {
    $(currentElem).parents('.filter-menu').find('.col-header-str').val('');
    $(currentElem).parents('.filter-menu').find('.resetSearch').removeClass('resetSearch').addClass('entr-filter');
}