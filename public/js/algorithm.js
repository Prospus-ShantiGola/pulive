//****
function fixedHeadLeftCol() {
    //nice scrollbar
    $('.center-div table.fixed-left-column').fixedTblHdrLftCol({
        scroll: {
            leftCol: {
                fixedSpan: 2
            }
        }
    });
    $('.col-head .arrow').remove();
   // financialGrid();

    var cntrHeight = $("#center-screen").height();
    var cntrWidth = $("#center-screen").width();
    var innerhig = $('.center-div.process-grid .fTHLC-inner-wrapper').height();
    setInitalHeightWidth();
    $('tr').children('.center-div.process-grid .fTHLC-left-col:nth-child(2)').addClass('collapse');

    // $('.borderDashed').parent('td').css({
    //     'border-top': 1,
    //     'height': 22
    // });
    // $('.col-1 .lastRow').parent('td').css({
    //     'border-top': 1,
    //     'height': 22
    // });

	   // addCollapseClass();

    $('.ExcelTableFormationCol.col-1').html(1);
    var tableScroll = "";
    $(".center-div  .fTHLC-inner-wrapper").scroll(function() {

        $('.center-div i.segment').removeClass('show');
        $('.center-div i.add').removeClass('show show-icon active');
        $('.center-div .add-col-wrap').children('.dropdown-menu').removeClass('show');
        tableScroll = $(this).scrollLeft();
       // var tableScrollTop = $(this).scrollTop();
        $(".center-div .fixed-top-header").scrollLeft(tableScroll);
    });
    var PanInnerHig = $('.center-div .fTHLC-inner-wrapper').height();

    $(".center-div  .fTHLC-outer-wrapper").scroll(function() {

        $('.center-div #account-table').find('td.fTHLC-left-col.cell-1, td.ExcelTableFormationRow').removeClass('top-inherit');
        $('.center-div tr').last().children('td').css('margin-bottom', 19);
        var tableScrollTop = $(this).children('.fixed-left-column').scrollTop();
        $(".center-div  .fTHLC-inner-wrapper").scrollTop(tableScrollTop);

        var PanScr0lltop = $('.center-div.process-grid .fTHLC-outer-wrapper').scrollTop();
        var TotalHig = PanInnerHig + PanScr0lltop;

        $('.center-div  .fTHLC-inner-wrapper').css('height', TotalHig);
    });

    if ($('tr').last().prevAll('tr').children('td').hasClass('border-bottom')) {
        $('tr').last().prevAll('tr').children('td').removeClass('border-bottom')
    }
    $('.center-div .fixed-left-column').find('tr').children('td.operation-series.border-right.event').removeClass('border-right');
    setSequenceNonsequence();
    setTableWidth();
    //setTdColClass();
}

/*add function for association*/
function fixedAssociationHeadLeftCol() {
    $('.center-div table.fixed-left-column').fixedTblHdrLftCol({
        scroll: {
            leftCol: {
                fixedSpan: 2
            }
        }
    });
    $('.col-head .arrow').remove();

    var cntrHeight = $("#center-screen").height();
    var cntrWidth = $("#center-screen").width();
    var innerhig = $('.center-div.association-grid .fTHLC-inner-wrapper').height();
    setInitalHeightWidth();

    $('tr').children('.center-div.association-grid .fTHLC-left-col:nth-child(2)').addClass('collapse');

	   addCollapseClass();


    $('.ExcelTableFormationCol.col-1').html(1);
    var tableScroll = "";
    $(".center-div  .fTHLC-inner-wrapper").scroll(function() {

        $('.center-div i.segment').removeClass('show');
        $('.center-div i.add').removeClass('show show-icon active');
        $('.center-div .add-col-wrap').children('.dropdown-menu').removeClass('show');
        tableScroll = $(this).scrollLeft();
       // var tableScrollTop = $(this).scrollTop();
        $(".center-div .fixed-top-header").scrollLeft(tableScroll);
    });
    var PanInnerHig = $('.center-div .fTHLC-inner-wrapper').height();

    $(".center-div .fTHLC-outer-wrapper").scroll(function() {

        $('.center-div tr').last().children('td').css('margin-bottom', 19);
        var tableScrollTop = $(this).children('.fixed-left-column').scrollTop();
        $(".center-div .fTHLC-inner-wrapper").scrollTop(tableScrollTop);

        var PanScr0lltop = $('.center-div.association-grid .fTHLC-outer-wrapper').scrollTop();
        var TotalHig = PanInnerHig + PanScr0lltop;

        $('.center-div .fTHLC-inner-wrapper').css('height', TotalHig);
    });

    if ($('tr').last().prevAll('tr').children('td').hasClass('border-bottom')) {
        $('tr').last().prevAll('tr').children('td').removeClass('border-bottom')
    }

    //setSequenceNonsequence();
    // setAssociationTableWidth();
    setTableWidth();
}
/*end code here*/

function runAlgorithmOfAutoNumbering(associations) {
    var dataAlgo = Array();
    var indexCounter = 0;
    var tCol = -1;

    $(".center-div table.fixed-left-column").each(function() {

        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            $(this).find("td").each(function(cell, v) {
                if (row == 1 && $.trim($(this).html()) != '')
                    tCol++;
            });
        });

        $rows.each(function(row, v) {
            $(this).find("td").each(function(cell, v) {
                parentClass = $.grep(this.className.split(" "), function(v, i) {
                    return v.indexOf('parent_') === 0;
                }).join();
                /*operationClass = "";
                operationClass = $.grep(this.className.split(" "), function(v, i) {
                    return v.indexOf('operation-series') === 0;
                }).join();

                if (operationClass != '') {
                    parentClass = operationClass + ' ' + parentClass
                }*/

                if (row > 1) {
                    if ($('td.cell_1_' + cell).hasClass('event') && !$(this).hasClass("blank")) {
                        dataAlgo[indexCounter] = row + '@' + cell + '@' + parentClass+'_e';
                        indexCounter++;
                    } else {
                        var col_title = $('.cell_1_' + cell).find('.col-head-title').html();
                        col_title     = col_title ? col_title.toLowerCase() : '';
                        var course_type = $('.left-side-heading').html();
                        if (course_type == 'Process' && (col_title == 'role' || col_title == 'universe') && !$(this).hasClass("blank")) {
                            if($(this).hasClass('disabled-role')) {
                                dataAlgo[indexCounter] = row + '@' + cell + '@' + parentClass+'_d';
                            } else {
                                dataAlgo[indexCounter] = row + '@' + cell + '@' + parentClass;
                            }
                            indexCounter++;
                        } else if(course_type == 'Associations' && col_title == 'process' && !$(this).hasClass("blank") && !$(this).find("input.custom-node").length) {
                            dataAlgo[indexCounter] = row + '@' + cell + '@' + parentClass;
                            indexCounter++;
                        }
                    }
                }
            });
        });
    });

    if(associations == 'associations'){

        $.post(domainUrl + 'grid/algorithm', {
        'data': dataAlgo,
        'lastColIndex': tCol
        }, AssociationResponceAlgo, 'JSON');
    }
    else {

       $.post(domainUrl + 'grid/algorithm', {
        'data': dataAlgo,
        'lastColIndex': tCol
        }, responceAlgo, 'JSON');
    }

    /* Start Code By Arvind Soni For Unstructured And Structure Segment */
    var universeText = '';
    $(".center-div .fixed-top-header table").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) { $(this).find("td").each(function(cell, va) { if (row == 1) { text = $.trim($(this).text()).replace(/\s/g, ""); if(text == 'NUnstructured') { universeText = text; } } }); });
    });

    if(universeText == 'NUnstructured')
    {
        fillPlusImage();
    }
    /* End Code By Arvind Soni For Unstructured And Structure Segment */
}

function responceAlgo(d, s) {
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        var parentClass = '';
        $(".center-div .table-count").remove();
        isAutonumberDisplay = $('#course-path-number').hasClass('On') ? true : false;
        $rows.each(function(mrow, v) {
            $(this).find("td").each(function(mcol, v) {
                var objRow = $(this);
                $.each(d.data, function(row, data) {
                    $.each(data, function(col, value) {

                        parentClass = 'parent_' + mrow + '_' + mcol;


                        if (mrow == row && mcol == col) {
                            if (isAutonumberDisplay == false) {
                                objRow.find('.custom-node').after("<span class='table-count hide' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                            } else {
                                objRow.find('.custom-node').after("<span class='table-count show' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                                //objRow.find('.custom-node').attr("value",value);

                            }
                        }

                    });
                });

            });
        });
    });

    disableDeletePhase();
	  fixedHeadLeftCol();
    // removeTdColClass();
    setTdColClass();
    //removeDestructor();
    removeBorderRight();
    countcellCount();
    SegmentCount();
    setWidthInitialy();
    cellFlyout();
    OperationPane();

	 setTimeout(function(){

  	$(".center-div .fTHLC-inner-wrapper").scrollLeft(827);
  	},500);

    hideLoader();

    if(hideNumbering == true){
        $('.table-count').addClass('hide');
        $('.show-auto-number').addClass('hide-gridNumber');
    }
    $(".center-div .blankRow td.creation-bg").removeClass (function (index, css) {

            return (css.match (/\bparent_\S+/g) || []).join(' ');
    });

    $(".center-div .fTHLC-inner-wrapper").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    $('.process-grid').find('.fTHLC-inner-wrapper').addClass('manageScroll');
}

/*function here for non display number*/
function AssociationResponceAlgo(d, s) {

    //$('.show-auto-number').removeClass('hide-gridNumber');
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        var parentClass = '';
        $(".center-div .table-count").remove();
        $rows.each(function(mrow, v) {
            $(this).find("td").each(function(mcol, v) {
                var objRow = $(this);
                $.each(d.data, function(row, data) {
                    $.each(data, function(col, value) {

                        parentClass = 'parent_' + mrow + '_' + mcol;


                        if (mrow == row && mcol == col) {
                            isAutonumberDisplay = $('#course-path-number').hasClass('On') ? true : false;
                            if (isAutonumberDisplay == false) {
                                objRow.find('.custom-node').after("<span class='table-count hide' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                            } else {
                                objRow.find('.custom-node').after("<span class='table-count show' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                                //objRow.find('.custom-node').attr("value",value);

                            }
                        }

                    });
                });

            });
        });
    });

    fixedAssociationHeadLeftCol();

    disableDeletePhase();
    removeTdColClass();
    setTdColClass();
    //removeDestructor();
    //removeBorderRight();
    countcellCount();
    SegmentCount();
    hideLoader();
    setWidthInitialy();
    cellFlyout();
    OperationPane();

   $(".center-div .fTHLC-inner-wrapper").scrollLeft(827);

   if(hideNumbering == true){
        $('.table-count').addClass('hide');
         $('.show-auto-number').addClass('hide-gridNumber');
    }
    $(".center-div .blankRow td.creation-bg").removeClass (function (index, css) {

            return (css.match (/\bparent_\S+/g) || []).join(' ');
    });
     $(".center-div .fTHLC-inner-wrapper").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
     });
}
/*end code here*/

function disableDeletePhase() {

    // code use here to delete operation segment
    $('.center-div li.del-operation-segment').removeClass('disabled');

    $('.center-div .custom-node.undefined').each(function() {

        var addtdWrapperOP = $(this).closest('td');
        var addtrWrapperOP = $(addtdWrapperOP).closest('tr');
        var addtableWrapper = $(addtrWrapperOP).closest('table');
        var myCol = $(addtdWrapperOP).index();
        var myRow = $(addtrWrapperOP).index();
        parentName = $.grep($(addtdWrapperOP).attr('class').split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();

        var noofRows = $('.center-div .' + parentName).length;
        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);
        var cnt = 0;
        var k, l = parseInt(myCol) + parseInt(2);
        for (k = myRow; k <= lastRow; k++) {
            if ($('.center-div .cell_' + k + '_' + l).find('.custom-node').hasClass('operation-delete')) {
                cnt++;
            }
        }

        if (cnt < 2) {
            for (k = myRow; k <= lastRow; k++) {

                    $('.center-div .cell_' + k + '_' + l).find('li.del-operation-segment').addClass('disabled');
                }
            }

            else if ($(this).closest('tr').find('tr').hasClass('blankRow')) {

                    $('.center-div .parent_' + myRow + '_' + myCol).find('li.del-operation-segment').addClass('disabled');
            }

    });




    $('.center-div li.del-segment').removeClass('disabled');
    $('.center-div .custom-node.undefined').each(function() {


        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();

        parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();

        var noofRows = $('.center-div .' + parentName).length;
        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);

        var i, j = parseInt(myCol) + parseInt(2);
        var counter1 = 0;

        for (i = myRow; i <= lastRow; i++) {
            if ($('.center-div .cell_' + i + '_' + j).find('.custom-node').hasClass('undefined')) {
                counter1++;
            }
        }

        if (counter1 < 3) {
            for (i = myRow; i <= lastRow; i++) {
                $('.center-div .cell_' + i + '_' + j).find('li.del-segment').addClass('disabled');
            }
        }
    });
}

/** Function to Add Role and System Class **/
function addRoleSystemClass() {

    $('td.operation2.fill').each(function() {

        var addtdWrapper = $(this);
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();

        parentName = $.grep($($(this)).attr('class').split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();

        newCol1 = parseInt(myCol) + parseInt(2);
        roleParent = 'role_' + myRow + '_' + newCol1;

        newCol2 = parseInt(myCol) + parseInt(3);
        systemParent = 'system_' + myRow + '_' + newCol2;

        var noofRows = $('.' + parentName).length;
        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);

        var i, j = parseInt(myCol) + parseInt(2);
        var k = parseInt(myCol) + parseInt(3);
        for (i = myRow; i <= lastRow; i++) {
            if ($('.cell_' + i + '_' + j + '.operation-series.role')) {
                className = className.replace("cell", "role");
                $('.cell_' + i + '_' + j + '.operation-series.role').addClass(roleParent);
            }

            if ($('.cell_' + i + '_' + k + '.operation-series.system')) {
                className = className.replace("cell", "system");
                $('.cell_' + i + '_' + k + '.operation-series.system').addClass(systemParent);
            }


        }

    });
}

function setInitalHeightWidth() {
    var windowHeight = $(window).height();
    var rightHeaderHeight = $('.right-header').height();
    var footerHeight = $('.footer-temp').height();
    var cntrbarHeight = $('#ControlBar').height();
    var cntrHeight = windowHeight - (rightHeaderHeight+footerHeight+cntrbarHeight);
    $("#center-screen").css('height', cntrHeight + 'px');

    $(".grid-div").css("height", ($("#center-screen").height()) + 'px');
    var cntrHeight = $("#center-screen").height();
    var cntrWidth = $("#center-screen").width();
     $('.center-div .fTHLC-outer-wrapper').css({
        'width': cntrWidth - 73,
        'height': cntrHeight,
        'paddingLeft': 73
    });
    //  $('.firefox .center-div .fTHLC-outer-wrapper').css({
    //  $('.firefox .center-div .fTHLC-outer-wrapper').css({
    //     'width': cntrWidth - 103,
    //     'height': cntrHeight - 30,
    //     'paddingLeft': 103
    // });
  	var centerInnerHeight = '';
  	if($(".breadcrumb-wrap").hasClass('breadcrumb-up')){
  		centerInnerHeight = (cntrHeight - ($('.breadcrumb-wrap').height()-3));
  	}
  	else{
  		centerInnerHeight = (cntrHeight - ($('.breadcrumb-wrap').height()));
  	}
    $('.center-div .fTHLC-inner-wrapper').css({
        'width': cntrWidth - 73,
        'height': centerInnerHeight-3
    });
}

function setSequenceNonsequence(){

 var checkBlankRows = $(".center-div .blankRow").length;

    $(".center-div .add-segment").parents("tr").addClass("seq");
    $(".center-div .blankLeftBorder").parents("tr").addClass("blankRow");
    $(".center-div .seq.operation").prev("tr.operation").removeClass("operation").addClass("end");
    $(".center-div tr.row-0").removeClass("operation");
    $(".center-div tr.row-2").removeClass("operation");
    $(".center-div tr.row-1").removeClass("end");
    $(".center-div tr:last").removeClass("operation").addClass("end");
}

function addCollapseClass() {
		$('.center-div .fixed-top-header .col-head').each(function(i,v) {
		if($(v).closest('td').hasClass('collapse')) {
			  var get = $(this).closest('td').attr('class').split(" ").filter(function(v, i) {
					return v.indexOf('col-') === 0;
				}).join();
            if(get!=''){
			$(".center-div ."+get).addClass('collapse');
            }
		 }
	    });
}

/*code for remove desctuctive */
function removeDestructor(){

    var suboperation = [];
    $('.center-div .fixed-left-column tr').each(function(){
       $(this).find('.add-sub-more-operation').each(function(){
        suboperation.push($(this).next('td').index())

       })
    });

    var flag = 1;
    for(var i =0; i< suboperation.length;i++){
            $(".col-"+suboperation[i]).each(function(i,v){

             if($(v).find('.col-text').children('span').eq(0).hasClass("creation")){
                flag = 0;
            }
            else if($(v).find('.col-text').children('span').eq(0).hasClass("destructure"))  {
                $(v).removeClass('border-right');
                if(flag == 0){

                    flag = 1;
                }
                else {
                    $(v).html('<div class="blank-div segment-node"></div>');
                    $(v).removeClass('border-light-top');
                    $(v).addClass('creation-bg');
                    flag = 1;
                    }

            }

        });
    }
    var flag1= 1;
    for(var i =0; i< suboperation.length;i++){
            $(".col-"+suboperation[i]).each(function(i,v){

             if($(v).find('.col-text').children('span').eq(0).hasClass("creation")){
                flag1 = 0;
            }
            else if($(v).find('.col-text').children('span').eq(0).hasClass("destructure"))  {

                if(flag1 == 0){
                    $(v).prev().removeClass('creation-bg');
                    flag1 = 1;
                }


            }

        });
    }



        $('.center-div .fixed-left-column tr').each(function(i,v){
            $(v).removeClass('row_'+i);
            $(v).addClass('row_'+i);
        });

        /*code here to add blank row class in doamin*/
        var nonSequence1= [];
        $(".center-div .blankRow").each(function(){
                nonSequence1.push($(this).index());
        });

        var lastRow = $('.center-div .fixed-left-column').find('.event-before:last').parent('td').parent().index();
        var lastcol = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();

        var col = $('.center-div .fixed-left-column').find('.event-before').parent().parent().index()
        var rowIndex = $('.center-div .fixed-left-column').find('.event-before').parent().parent().index()

        for(var i = 0; i< nonSequence1.length;i++){
            $('.center-div .row_'+nonSequence1[i]).find('.col-'+lastcol).addClass('blankRowTd');

        }

        $('.center-div .fixed-left-column tr').each(function(i,v){
            $(v).find('.col-0').removeClass('blankRowTd');
        })

        var PrevRow = parseInt(rowIndex)+1;
        var interactionCheckflag = false;

        $(".row_"+PrevRow +" td").each(function(i,v){

             if($(this).find('span.custom-node').html() == "Interaction"){
                interactionCheckflag = true;
             }

        });



        if(interactionCheckflag == true){
            $('.center-div .fixed-left-column .row_'+rowIndex).each(function(){
                $(this).children('td').each(function(){
                    $(this).removeClass('border-light-top');
                });
            });
        }

        var SecondPrevRow = parseInt(rowIndex)-2;
        var SecondRowIndex = parseInt(rowIndex)-1;
        var SecondCheckflag = false;
         $(".row_"+SecondPrevRow +" td").each(function(i,v){
             if($(this).find('span.custom-node').html() == "Interaction"){
                SecondCheckflag = true;
             }
        });
         if(SecondCheckflag == true){
            $('.center-div .fixed-left-column .row_'+SecondRowIndex).each(function(){
                $(this).children('td').each(function(){
                    //$(this).removeClass('border-light-top');
                });
            });
        }
        $('.center-div .fixed-left-column .event-before').parent('td').parent().prev().find('td:even').removeClass('border-left');

        $('.event-before').parent().parent().prev().find('td').each(function(i,v){
           if($(v).find('.col-text').children('span').eq(0).hasClass("destructure")){
             $(v).parent().children('td').eq(1).html('<div class="blank-div segment-node borderDashed"></div>');
           }
        });

        $('.center-div .fixed-left-column .row_'+lastRow).each(function(i,v){
        $(v).find('.col-'+lastcol).nextAll('td').addClass('creation-bg');

        });

        var prevprevLast = parseInt(lastcol)-parseInt(3);
        var prevLastCol  = parseInt(lastcol)-parseInt(1);

        $('.center-div .fixed-left-column').find('.col-'+prevprevLast).removeClass('border-right');
        $('.center-div .fixed-left-column').find('.col-'+prevLastCol).removeClass('border-right');
        $('.center-div .fixed-left-column').find('.col-'+lastcol).removeClass('border-right');
}

/*code here to use remove border-right in sub operation and operation series*/
function removeBorderRight(){
    var eventStatus = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.event-before').parent().parent().index()+1);
        if(chekVal > 0 ){
            eventStatus.push(parseInt(chekVal));
        }

    });

    for(var i =0; i< eventStatus.length;i++){
            $(".row_"+eventStatus[i]).each(function(i,v){
                    $(v).children('td').removeClass('border-light-top');
        });
    }
    var suboperation1 = [];
    $('.center-div .fixed-left-column tr').each(function(){
       $(this).find('.add-sub-more-operation').each(function(){
        suboperation1.push($(this).prev('td').index())

       })
    });
    for(var i =0; i< suboperation1.length;i++){
            $(".col-"+suboperation1[i]).each(function(i,v){
                    $(v).removeClass('border-right');

        });
    }
    var eventStatus1 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-destructive').parent().parent().index()+1);
        if(chekVal > 0 ){
            eventStatus1.push(parseInt(chekVal));
        }

    });
    for(var i =0; i< eventStatus1.length;i++){
            $(".row_"+eventStatus1[i]).each(function(i,v){
                    $(v).children('td').addClass('border-light-top');
        });
    }
    var lastcol = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
    var nextLastCol = parseInt(lastcol)+parseInt(1);
    var nextAllLastCol = parseInt(lastcol)+parseInt(2);
    var eventStatus2 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-before').parent().parent().index()+1);
        if(chekVal > 0 ){
            eventStatus2.push(parseInt(chekVal));
        }

    });
    var eventStatus7 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-before').parent().parent().index());
        if(chekVal > 0 ){
            eventStatus7.push(parseInt(chekVal));
        }

    });

    for(var i =0; i< eventStatus2.length;i++){
            $(".row_"+eventStatus2[i]).each(function(i,v){
                    $(v).find('.col-'+nextLastCol).addClass('creation-bg');

                    $(v).find('td').each(function(k,m){
                          if(k > lastcol){
                            $(m).addClass('creation-bg');
                          }
                    });
            });
    }

    for(var i =0; i< eventStatus7.length;i++){
        $(".row_"+eventStatus7[i]).each(function(i,v){
         $(v).find('td').each(function(k,m){
                          if(k > lastcol){
                            $(m).addClass('border-light-top');
                            $(m).addClass('creation-bg');
                          }


            });
        });
    }
    var eventStatus3 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-before').parent().parent().index()+1);
        if(chekVal > 0 ){
            eventStatus3.push(parseInt(chekVal)+parseInt(3));
        }

    });

    for(var i =0; i< eventStatus3.length;i++){
            $(".row_"+eventStatus3[i]).each(function(i,v){
                    $(v).find('.col-'+nextLastCol).addClass('creation-bg');
                    $(v).find('.col-'+nextLastCol).next('td').addClass('creation-bg');
        });
    }

    var eventStatus4 = [],eventStatusNext = [],eventCurrent = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-destructive').parent().parent().index());
        if(chekVal > 0 ){
            eventStatus4.push(parseInt(chekVal)+parseInt(1));
            eventStatusNext.push(parseInt(chekVal)-parseInt(1));
            eventCurrent.push(parseInt(chekVal));

        }

    });


    for(var i =0; i< eventStatus4.length;i++){
            $(".row_"+eventStatus4[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                        if(k > lastcol){
                              $(this).addClass('creation-bg');
                           }
                     })
        });
    }
    for(var i =0; i< eventStatusNext.length;i++){
            $(".row_"+eventStatusNext[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                        if(k > lastcol){
                              $(this).removeClass('border-light-bottom');
                           }
                     })
        });
    }

    var startphase = $('.center-div .fixed-top-header .row_0 td').find('i.add-phase-segment').last().parent().index();
    $('.center-div .fixed-left-column').find('tr').each(function() {
       $(this).find('td').each(function(i,v){
                if(i < parseInt(startphase)){
                    $(v).removeClass("border-light-top");
                }
                if($(v).find('i').hasClass('segment')){
                    $(v).addClass("border-light-top").removeClass("border-light-bottom");

                }
        });

    });
    var eventStatus5 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.check-add-status').parent().parent().index());
        if(chekVal > 0 ){
            eventStatus5.push(parseInt(chekVal)+parseInt(1));
        }

    });
    var intraCol = $('.center-div .fixed-left-column tr').find('.check-add-status:last').parent().index();
    var nextIntCol = $('.center-div .fixed-left-column tr').find('.check-add-status:last').parent().index();

    for(var i =0; i< eventStatus5.length;i++){
            $(".row_"+eventStatus5[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              $(this).removeClass('border-light-top');
                     });
        });
    }

    var eventStatus5 = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-completion').parent().parent().index());
        if(chekVal > 0 ){
            eventStatus5.push(parseInt(chekVal));
        }

    });
    var lastcol = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
    var Nextlastcol = parseInt(lastcol)+parseInt(2);
    var prevcollast = parseInt(lastcol)-parseInt(1);

     for(var i =0; i< eventStatus5.length;i++){
            $(".row_"+eventStatus5[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              if(k==Nextlastcol){
                                $(m).html('<div class="blank-div segment-node"></div>');
                                $(m).removeClass('border-light-top');
                                $(m).addClass('creation-bg');
                              }
                              if(k > lastcol){
                                $(m).addClass('creation-bg');
                              }
                             if(k> 1 && k < lastcol){

                                   if(k%2==0){
                                     $(m).removeClass('border-left');
                                     }

                              }
                    });
        });
    }
    var afterEventNextRow = [],afterEvent = [];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-after').parent().parent().index());
        if(chekVal > 0 ){
            afterEvent.push(parseInt(chekVal));
            afterEventNextRow.push(parseInt(chekVal)+1);

        }

    });
    for(var i =0; i< afterEventNextRow.length;i++){
            $(".row_"+afterEventNextRow[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){

                             if(k> 1 && k < lastcol){

                                   if(k%2==0){
                                     $(m).removeClass('border-left');
                                     }
                              }
                              if(k > parseInt(lastcol)+1){
                                   $(m).addClass('creation-bg');
                              }
                    });
        });
    }

    for(var i =0; i< afterEvent.length;i++){
            $(".row_"+afterEvent[i]).each(function(i,v){
             $(v).find('td').each(function(k,m){
                              if(k > lastcol){
                                $(m).addClass('creation-bg');
                              }


                });
        });
    }

    var eventStatus6 = [],completionEvent=[];
    $('.center-div .fixed-left-column tr').each(function(i,v){
        var chekVal = parseInt($(v).find('.e-completion').parent().parent().index());
        if(chekVal > 0 ){
            eventStatus6.push(parseInt(chekVal)-parseInt(1));
        }
        if(chekVal > 0 ){
            completionEvent.push(parseInt(chekVal)+parseInt(1));
        }

    });
       for(var i =0; i< eventStatus6.length;i++){
        $(".row_"+eventStatus6[i]).each(function(ind,v){
                $(v).find('td').each(function(k,m){
                          if(k==prevcollast){
                            $(m).removeClass('border-light-bottom');
                          }


                });
        });
        }
        for(var i =0; i< completionEvent.length;i++){
            $(".row_"+completionEvent[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              if(k>lastcol){
                               $(m).addClass('creation-bg');
                              }


                    });
            });
        }

       var  last_lastColumn = $('.center-div .fixed-top-header .row-0').find('td').find('.top-col').last().html();
        var manifeastArr = [],maninextArr= [],manlastArr=[],chekVal= 0;
            $('.center-div .fixed-left-column tr').each(function(i,v){
             $(v).find('td').each(function(ii,vv){
             chekVal = $(vv).find('.custom-node').attr('placeholder');
             if(chekVal == "Manifestation"){
                manifeastArr.push(parseInt($(v).index()));
                maninextArr.push(parseInt($(v).index())+parseInt(2));
                manlastArr.push(parseInt($(v).index())+parseInt(1));
             }
            });
        });

        for(var i =0; i< manifeastArr.length;i++){
            $(".row_"+manifeastArr[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              if(k > 6){
                               //$(m).addClass('border-light-top');
                              }


                    });
            });
        }

        for(var i =0; i< manlastArr.length;i++){
            $(".row_"+manlastArr[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              if(k > 6){
                               //$(m).addClass('border-light-top');
                              }


                    });
            });
        }

        for(var i =0; i< maninextArr.length;i++){
            $(".row_"+maninextArr[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                              if(k > 6){
                               $(m).removeClass('border-light-top');
                              }
                    });
            });
        }
        nonSequence = [],currSeq=[];
        $(".center-div .blankRow").each(function() {

            nonSequence.push(parseInt($(this).index())+parseInt(1));
            currSeq.push(parseInt($(this).index()));
        });

        for(var i =0; i< nonSequence.length;i++){
            $(".row_"+nonSequence[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                               $(m).removeClass('border-light-top');
                    });
            });
        }

        for(var i =0; i< currSeq.length;i++){
            $(".row_"+currSeq[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                        /*if(k > 8){
                               $(m).addClass('blankRowTd');
                           }*/
                    });
            });
        }

        var lastRow = $('.center-div .fixed-left-column').find('tr').not(':empty').last().index();
        var lastColumn = $('.center-div .fixed-top-header .row-0').find('td').find('.top-col').last().html();
         for(var i =0; i<= lastRow;i++){
            $(".row_"+i).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                            if(k > parseInt(lastColumn)+parseInt(1)){
                               // $(m).remove();
                            }
                    });
            });
        }

        /*code here for add destructive */
       var snippet1= '';
           snippet1+="<div class='creation-node'><div class='node-circle node-white-circle node-white-circle'>N</div><div class='col-text'> <span class='destructure'></span><span class='col-node-text custom-node'>Destruction</span><span class=''></span>";
           snippet1+="</div></div>";
        var manifeaCol   = $(".center-div .fixed-left-column [placeholder ='Manifestation']").next().attr('data-id');
            var rowArray = [];
            var lastRow = $('.center-div .fixed-left-column').find('tr').not(':empty').last().index();
         for(var i =3; i< lastRow;i++){
            $(".row_"+i).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                            if(k > 6 && k< parseInt(manifeaCol)){
                             if(k%2 == 0){
                              if($(m).find('.custom-node').html() == "Creation"){
                               if($('.center-div .row_'+(i-1)).find('.col-'+k).find('.blank-div') != ""){
                                $('.row_'+(i-1)).find('.col-'+k).html('').removeClass('creation-bg').addClass('border-light-top collapse border-light-bottom');
                               $('.row_'+(i-1)).find('.col-'+k).append(snippet1);
                               }
                              }

                             }
                            }
                    });
            });
        }

        $(".row_"+lastRow).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                            if(k > 1 && k< parseInt(11)){
                             if(k%2 == 0){
                                $('.row_'+lastRow).find('.col-'+k).html('').removeClass('creation-bg').addClass('border-light-top collapse border-light-bottom');
                                 $('.row_'+lastRow).find('.col-'+k).append(snippet1);
                               }
                              }

                    });
            });

        var nonSequenceBlank= [];
        $(".center-div .blankRow").each(function(){
                nonSequenceBlank.push($(this).index());
        });

        for(var i =0; i< nonSequenceBlank.length;i++){
            $(".row_"+nonSequenceBlank[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                               if(k > 6) {
                                $(m).html('');
                            }
                    });
            });
        }

        /*code her for add creation bg in interation node*/

        var interactionArray = [];
        var lastColumn = $('.center-div .fixed-top-header .row-0').find('td').find('.top-col').last().html();
        $('.center-div .fixed-left-column tr').each(function(i,v){
            var chekVal = parseInt($(v).find('.actionNode').parent().parent().parent().parent().index());
            if(chekVal > 0 ){
                interactionArray.push(parseInt(chekVal));
            }

        });

    for(var i=0; i < interactionArray.length;i++){
                $(".row_"+interactionArray[i]).each(function(ind,v){
                        $(v).find('td').each(function(k,m){
                                  if(k == lastColumn){
                                   $(m).addClass('creation-bg');
                                  }


                        });
                });
            }

            for(var i =0; i< eventCurrent.length;i++){
            $(".row_"+eventCurrent[i]).each(function(ind,v){
                    $(v).find('td').each(function(k,m){
                        if(k == parseInt(lastcol)-parseInt(1)){
                              $(this).html('');
                           }
                     })
        });
    }
}

function countcellCount(){

    var lastColumn = $('.center-div .fixed-top-header .row-0').find('td').find('.top-col').last().html();
    var lastRow = $('.center-div .fixed-left-column').find('tr').not(':empty').last().index();

    $('#cellCount').html(lastRow+' '+ 'x' + ' '+lastColumn);
}

function SegmentCount(){

    var totalnode = $('.table-count').length;
    var totalsegment = parseInt(totalnode)-parseInt(1);
    $('#segmentCount').html(totalsegment);
}

function responsetimeLine(d, s) {
   // alert('ffff');
    //$(".class-bulider-section").hide();

    $(".grid-div").css("display", "none");
    $('.tab-item:first a').addClass('active');
    var gridId ="tabIndex_" + new Date().getTime().toString();
    selectedGridId = gridId;


    var snippet = '<div class="grid-div center-div process-grid" grid-id ="%gridid%"></div>';
    var snip = snippet.replace('%gridid%', gridId);

    $("#center-screen").append(snip);
    $("[grid-id=" + gridId + "]").html(d);

    // var cntrHeight = $("#center-screen").height();
    // $(".center-div").css("height", cntrHeight - 34);
    var centerWid = $('.center-div').width() / 2;
    var centerHight = $('#center-screen').height();


    var cntrWidth = $("#center-screen").width();

    var tdWrapper = $("[grid-id=" + gridId + "]").find('td'),
        trWrapper = $(tdWrapper).parent('tr'),
        tableWrapper = $(trWrapper).closest('table'),
        myCol = $(tdWrapper).index();


    var rowFlag = 0;

    $('table').find('tr:first').each(function() {
        var trObj = $(this);
        var colFlag = 0;
        $('body').on('mouseover', 'td', function(index, event) {
            $(this).children('i.add').addClass('show')
            colFlag++;
        });

        $('body').on('mouseout', 'td', function(index, event) {
            if ($(this).find('.add-colums ul.dropdown-menu').hasClass('show')) {
                $(this).children('i.add').addClass('show')
            } else {
                $(this).children('i.add').removeClass('show')
            }

            colFlag++;

        });
        rowFlag++;
    });

    $(this).closest('li').children('ol').find('.custom-node').focus();

    $('tr').each(function() {
        /*set border*/
        setborder();

        $('.row-2').children('.col-3').addClass('transparent');
        $('.row-2').children('.col-5').addClass('transparent');
    });

    $(tableWrapper).find('tr').each(function() {
        var trObj = $(this);
        var colFlag = 0;
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

        });
        rowFlag++;
        var selectedTabId = 0;
        $(".entr-center-tab ul li a").each(function(i, v) {
            if ($(this).hasClass('active')) {
                selectedTabId = $(this).parent().attr('tab-index');
            }
        });

        $('.TabNodePerpective').each(function(i, v) {
            if ($(this).hasClass('node-selected')) {
                $(this).attr('tab-data', selectedTabId);
            }
        });



        $('body').on('click', '.col-node-text input', function(event) {
            $(this).parent('.col-node-text').siblings('.segment-count').show();
            event.stopPropagation();
        })
    });

    setColRowClass();
    runAlgorithmOfTimeline();
    //  runAlgorithmOfAutoNumbering();
    $('body .center-div .time-col').closest('td').addClass('merge-td');
    $('.center-div td.collapse.event').addClass('border-right');
    $('.center-div .row-0').children('td').removeClass('border-right');
}

function runAlgorithmOfTimeline(associations) {
    fixedHeadLeftCol();
   // this function take a long load time removeTdColClass();
   $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
   setTdColClass();
   margecell();
   $(".lodding").hide();
}

/* Start Code By Arvind Soni */
var totalWeeksOfStructre = 0;
$(document).ready(function() {
    defaultWeek();
    checkSegmentType();
    
    $('body').on('click', '.structuredSche', function() {

      var tdWrapperU = $(this).closest('td');
      var trWrapperU = $(tdWrapperU).closest('tr');
      var rowU = $(trWrapperU).index();
      var colU = $(tdWrapperU).index();

      var isP         =   isProperOrNot();
      isP             =   isP.split(':');

      var isUnsPro = isP[0];
      var isStrPro = isP[1];

      if(parseInt(isUnsPro) == 0 && parseInt(isStrPro) == 0)
      {
        $("#scheduleRow").val('2');
        $("#scheduleCol").val('6');
        $("#scheduleStatus").val('First');
        openThreePaneSchedule();
      }
      else if(parseInt(isUnsPro) == 1 && parseInt(isStrPro) == 0)
      {
        var highestRow = 0;
        $(".center-div .unstructure-last-div").each(function() {
          tds = $(this).closest('td');
          trs = $(tds).closest('tr');
          rows = $(trs).index();
          cols = $(tds).index();
            console.log(rows);
          if(parseInt(highestRow) < parseInt(rows))
            highestRow = rows;
        });

        newR = parseInt(highestRow)+1;
        $("#scheduleRow").val(newR);
        $("#scheduleCol").val('7');
        $("#scheduleStatus").val('First');
        openThreePaneSchedule();
      }
    });

    $('body').on('click','.closeSheduleBuilder', function(e){
        $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
            $("#scheduleBuilder").removeClass("in");
            $('.structuredSche.openthreepane').removeClass('openthreepane');
        });
    });

    /*code here used to display week day default value*/
    $("body").on("blur", ".wk_segment", function(event) {
        var segmentVal = $(".wk_segment").val();
        var wk_li = "",wk_select="";
        $(".segment-wk").html('');
        $(".wk-starting-segment").html('');
        wk_select ='<option value="1">1 Week</option>';
        for( var index  = 0 ; index < segmentVal;index++) {
             checkVal  = parseInt(index)+1;
             wk_li     ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+checkVal+'" name="wk-ck-segment[]]"><label></label></div><div>Week '+checkVal+'</div></li>';
             $(".segment-wk").append(wk_li);

        }
        $(".wk-starting-segment").append(wk_select);
        $('.wk-segment-count').html("("+segmentVal+" items)");
    });

    /*code here used to display day default value*/
    $("body").on("blur", ".day_segment", function(event) {
        var segmentVal = $(".day_segment").val();
        var day_li = "",day_select='';
        $(".segment-day").html('');
        $(".day-starting-segment").html('');
        day_select='<option value="1">1 Day</option>';
        for( var index  = 0 ; index < segmentVal;index++) {
                 checkVal = parseInt(index)+1;
                 day_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+checkVal+'" name="day-ck-segment[]]"><label></label></div><div>Day '+checkVal+'</div></li>';
                 $(".segment-day").append(day_li);
        }
        $(".day-starting-segment").append(day_select);
        $('.day-segment-count').html("("+segmentVal+" items)");
    });

    /*code here used to display hour default value*/
    $("body").on("blur", ".hour_segment", function(event) {
        var segmentVal = $(".hour_segment").val();
        var hour_li = "",hour_select='';
        $(".segment-hour").html('');
        $(".hour-starting-segment").html('');
        hour_select='<option value="1">1 Hour</option>';
        for( var index  = 0 ; index < segmentVal;index++) {
                 checkVal = parseInt(index)+1;
                 hour_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+checkVal+'" name="hour-ck-segment[]]"><label></label></div><div>Hour '+checkVal+'</div></li>';
                 $(".segment-hour").append(hour_li);
        }
        $(".hour-starting-segment").append(hour_select);
        $('.hour-segment-count').html("("+segmentVal+" items)");
    });

    /*code here used to display minute default value*/
    $("body").on("blur", ".minute_segment", function(event) {
        var segmentVal = $(".minute_segment").val();
        var minute_li = "",minute_select='';
        $(".segment-minute").html('');
        $(".minute-starting-segment").html('');
        minute_select='<option value="1">1 Minute</option>';
        for( var index  = 0 ; index < segmentVal;index++) {
                 checkVal = parseInt(index)+1;
                 minute_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+checkVal+'" name="minute-ck-segment[]]"><label></label></div><div>Minute '+checkVal+'</div></li>';
                 $(".segment-minute").append(minute_li);
        }
        $(".minute-starting-segment").append(minute_select);
        $('.minute-segment-count').html("("+segmentVal+" items)");
    });

    var segmentType = '';
    $('#scheduleBuilder .show-survey-pane').click(function(){
      $('#scheduleBuilder .show-survey-pane').parent("tr").removeClass('current');
       segmentType =  $(this).attr('data-id');
       if(segmentType == 'day'){
            var segType = checkSeg();
            if($.inArray('day',segType)){
            $('.day-form').show();
            $('.week-form').hide();
            $('.hour-form').hide();
            $('.minute-form').hide();
            $(this).parent("tr").addClass('current');
            defaultDay();
            }
       }
       else if(segmentType=='week'){
            $('.week-form').show();
            $('.day-form').hide();
            $('.hour-form').hide();
            $('.minute-form').hide();
            $(this).parent("tr").addClass('current');
       }
       else if(segmentType == 'hour'){
            var segType = checkSeg();
            if($.inArray('hour',segType)){
            $('.day-form').hide();
            $('.week-form').hide();
            $('.minute-form').hide();
            $('.hour-form').show();
            $(this).parent("tr").addClass('current');
            defaultHour();
            }
       }
       else if(segmentType == 'minute'){
            var segType = checkSeg();
            if($.inArray('minute',segType)){
            $('.day-form').hide();
            $('.week-form').hide();
            $('.hour-form').hide();
            $('.minute-form').show();
            $(this).parent("tr").addClass('current');
            defaultMinute();
            }
       }
    });

});


// Code By Amit Malakar
// Date - 21 Mar, 2016
/*function getOperationGreyedHtml() {
    var operationGreyedArr = [];
    operationGreyedArr[0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    operationGreyedArr[1] += '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationGreyedArr[2] += '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    operationGreyedArr[3] += '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationGreyedArr[4] += '<td class="ExcelTablerow col-#$#COL#$# operation-series role merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    operationGreyedArr[5] += '<td class="ExcelTablerow col-#$#COL#$# operation-series system merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    return operationGreyedArr;
}*/

// Code By Amit Malakar
// Date - 21 Mar, 2016
/*function getFirstFourBlankHtml() {
    var blankRow = '';
    blankRow += '<td class="ExcelTableFormationRow fTHLC-left-col blank col-0" style="position: absolute; left: 0px;"></td>';
    blankRow += '<td class="ExcelTablerow border-left merge-td fTHLC-left-col collapse blank col-1" style="position: absolute; left: 25px;"><div class="blank-div segment-node borderDashed"></div></td>';
    blankRow += '<td class="ExcelTablerow creation-bg collapse event border-right blank col-2" style="height: 24px;"><div class="blank-div segment-node"></div></td>';
    blankRow += '<td class="ExcelTablerow transparent merge-td blank col-3"></td>';
    blankRow += '<td class="ExcelTablerow creation-bg collapse event border-right blank col-4"><div class="blank-div segment-node"></div></td>';
    return blankRow;
}*/

/*// Code By Amit Malakar
// Date - 21 Mar, 2016
function getStructuredBlankHtml() {
    var strucHtml = '';
    // week exists
    if($('.schedule-segment-week').length) {
        // day exists
        if($('.schedule-segment-day').length) {
            // week + event + day + event + time
            strucHtml += '<td class="ExcelTableFormationCol creation-bg blank structuredSche col-7"><div class="blank-div segment-node"></div></td>';
            strucHtml += '<td class="ExcelTableFormationCol creation-bg collapse event border-right blank structuredSche col-8"><div class="blank-div segment-node"></div></td>';
            strucHtml += '<td class="ExcelTableFormationCol creation-bg blank col-9"><div class="blank-div segment-node"></div></td>';
            strucHtml += '<td class="ExcelTableFormationCol creation-bg collapse event border-right blank col-10"><div class="blank-div segment-node"></div></td>';
            strucHtml += '<td class="ExcelTableFormationCol creation-bg blank col-11"><div class="blank-div segment-node"></div></td>';
        } else {
            // week + event html
            strucHtml += '<td class="ExcelTableFormationCol creation-bg blank structuredSche col-7"><div class="blank-div segment-node"></div></td>';
            strucHtml += '<td class="ExcelTableFormationCol creation-bg collapse event border-right blank structuredSche col-8"><div class="blank-div segment-node"></div></td>';
        }
    } else {
        strucHtml += '<td class="ExcelTablerow transparent blank structuredSche col-7"><div class="blank-div segment-node"></div></td>';
    }
    return strucHtml;
}*/

// Code By Amit Malakar
// Date - 18 Mar, 2016
/*function updateColNum(dataArr, startCol) {
    for(var i=0; i<dataArr.length; i++) {
        dataArr[i] = dataArr[i].replace(/#\$#COL#\$#/g, (i+startCol));
    }
    return dataArr;
}*/

/*// Code By Amit Malakar
// Date - 18 Mar, 2016
function getOperationsArray() {
    var operationsArr = [];
    operationsArr[0] = [];
    operationsArr[1] = [];
    operationsArr[2] = [];
    operationsArr[3] = [];
    operationsArr[4] = [];
    operationsArr[5] = [];
    operationsArr[6] = [];
    operationsArr[7] = [];

    // row-0 data here
    operationsArr[0][0] = '<td class="ExcelTableFormationCol blank operation-header col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    operationsArr[0][1] = '<td class="ExcelTableFormationCol collapse blank event col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    operationsArr[0][2] = '<td class="ExcelTableFormationCol blank col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    operationsArr[0][3] = '<td class="ExcelTableFormationCol collapse blank event col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    operationsArr[0][4] = '<td class="ExcelTableFormationCol blank operation-role-header col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    operationsArr[0][5] = '<td class="ExcelTableFormationCol blank operation-system-header col-#$#COL#$#"><span class="top-col">#$#COL#$#</span></td>';
    // row-1 data here
    operationsArr[1][0] = '<td class="ExcelTablerow border-top operation-header col-#$#COL#$#"><div data-id="#$#COL#$#; ?>" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon operation-icon"></span><span class="col-head-title">Operation</span><i class="fa fa-caret-left arrow"></i></div></td>';
    operationsArr[1][1] = '<td class="ExcelTablerow border-top collapse event col-#$#COL#$#"><div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon event-icon"></span><span class="col-head-title">.Event</span><i class="fa fa-caret-left arrow rotate"></i></div></td>';
    operationsArr[1][2] = '<td class="ExcelTablerow border-top col-#$#COL#$#"><div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon operation-icon"></span><span class="col-head-title">Operation</span><i class="fa fa-caret-left arrow"></i></div></td>';
    operationsArr[1][3] = '<td class="ExcelTablerow border-top collapse event col-#$#COL#$#"><div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon event-icon"></span><span class="col-head-title">.Event</span><i class="fa fa-caret-left arrow rotate"></i></div></td>';
    operationsArr[1][4] = '<td class="ExcelTablerow border-top col-#$#COL#$#"><div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon role-icon"></span><span class="col-head-title">Role</span><i class="fa fa-caret-left arrow"></i></div></td>';
    operationsArr[1][5] = '<td class="ExcelTablerow border-top col-#$#COL#$#"><div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon sys-icon"></span><span class="col-head-title">Universe</span><i class="fa fa-caret-left arrow"></i></div></td>';
    // first row data here
    operationsArr[2][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td"><div class="segment-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text"><input type="text" class="custom-node operation-delete" placeholder="Undefined"></span></div></div><i class="fa fa-bars add-segment segment"></i><div class="add-col-wrap add-segment "><ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4"><li role="presentation" class=""> <a class="" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Add Series </a><ul class="sub-item"><li role="presentation" class="add-suboperaton-segment"> <a href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle node-white-circle">N</div>Operation </a> </li></ul></li><li role="presentation" class="no-bg"><a role="menuitem" tabindex="-1" class=""><div class="node-circle node-white-circle-expanded">N</div>Add Segment</a><ul class="sub-item"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="add-above-operation-segment"><div class="node-circle node-white-circle">N</div>Add Above </a></li><li role="presentation" ><a role="menuitem" tabindex="-1" href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle-expanded">N</div>Add Below</a><ul class="sub-item"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class=" WriteYourOwnClass"><div class="node-circle node-white-circle">N</div>Sequential </a><ul class="agent-drp"><li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li><li><a href="#" class="add-logic-operation-segment"><div class="node-circle node-white-circle ">N</div>Logic</a></li><li><a href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li></ul></li><li><a role="menuitem" tabindex="-1" href="#" class="WriteYourOwnClass"><div class="node-circle node-white-circle">N</div>Non-Sequential </a><ul class="agent-drp"><li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li><li><a href="#" class="add-below-logic-non-sequence-operation-segment"><div class="node-circle node-white-circle">N</div>Logic</a></li><li><a href="#" class="add-below-non-sequence-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li></ul></li></ul></li></ul></li><li role="presentation" class="no-bg "><a role="menuitem" tabindex="-1" class="disabled"><div class="node-circle node-white-circle-expanded">N</div>Move Segment</a><ul class="sub-item"><li role="presentation" class="no-bg disabled"><a role="menuitem" tabindex="-1" href="#" class=""><div class="node-circle node-white-circle">N</div>Move Above </a></li><li role="presentation" data-toggle="modal" data-target="#moveBelow" class="moveBelow disabled"><a role="menuitem" tabindex="-1" href="#" class=""><div class="node-circle node-white-circle">N</div>Move Below </a></li></ul></li><li data-toggle="modal" data-target="#deleteOperationSegment" class="del-operation-segment"><a class="" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Delete Segment</a></li></ul></div></td>';
    operationsArr[2][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="creation"></span><span class="col-node-text custom-node">Creation</span></div></div></td>';
    operationsArr[2][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 merge-td"><div class="segment-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Manifestation" >Manifestation</span></div></div></td>';
    operationsArr[2][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="creation"></span><span class="col-node-text custom-node">Creation</span></div></div></td>';
    operationsArr[2][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[2][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    // second row data here
    operationsArr[3][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[3][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[3][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[3][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class ="blank-div segment-node"></div></td>';
    operationsArr[3][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[3][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system merge-td"><div class="creation-node operation-tab-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node">...Process</span></div></div></td>';
    // third row data here
    operationsArr[4][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[4][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[4][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2"><div class="blank-div segment-node"></div></td>';
    operationsArr[4][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse border-light-top border-light-bottom"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="destructure"></span><span class="col-node-text custom-node">Destruction</span></div></div></td>';
    operationsArr[4][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[4][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system creation-bg"><div class="blank-div segment-node"></div></td>';
    // fourth row data here
    operationsArr[5][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[5][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[5][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 merge-td border-light-top"><div class="segment-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Interaction" >Interaction</span></div></div><i class="fa fa-bars  segment check-add-status"></i><div class="add-col-wrap"><ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4"><li role="presentation" class="no-bg"><a role="menuitem" tabindex="-1" class=""><div class="node-circle node-white-circle-expanded">N</div>Status capture point</a><ul class="sub-item check-point "><li role="presentation" class=""><a role="menuitem" tabindex="-1" href="#" class="add-before-the-event-has-started"><span class="node-input"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="pane_1" name="nodes_1[]" value="before" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div></span><div class="node-circle node-white-circle">N</div>Before the event has started </a></li><li role="presentation" class=""><a role="menuitem" tabindex="-1" href="#" class="add-after-the-event-has-ended"><span class="node-input"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="pane_1" name="nodes_1[]" value="after" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div></span><div class="node-circle node-white-circle">N</div>After the event has ended</a> </li><li role="presentation" class=""><a role="menuitem" tabindex="-1" href="#" class="add-after-completion-of-role-operation"><span class="node-input"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="pane_1" name="nodes_1[]" value="completion" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div></span><div class="node-circle node-white-circle">N</div>After completion of Role-Operation</a> </li><li role="presentation" class=""><a role="menuitem" tabindex="-1" href="#" class="add-after-the-destruction-event"><span class="node-input"><div class="icheckbox_minimal" style="position: relative;"><input type="checkbox" class="pane_1" name="nodes_1[]" value="destructor" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div></span><div class="node-circle node-white-circle">N</div>After the destruction event</a> </li></ul></li></ul></div></td>';
    operationsArr[5][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse border-light-top"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="creation"></span> <span class="col-node-text custom-node">Creation</span></div></div></td>';
    operationsArr[5][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role creation-bg border-light-top"><div class="blank-div segment-node"></div></td>';
    operationsArr[5][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system merge-td creation-bg border-light-top"><div class="blank-div segment-node"></div></td>';
    // fifth row data here
    operationsArr[6][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[6][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[6][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 merge-td"><div class="blank-div segment-node"></div></td>';
    operationsArr[6][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse creation-bg"><div class="blank-div segment-node"></div></td>';
    operationsArr[6][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle" >N</div><div class="col-text operation-text"><span class="col-node-text custom-node actionNode" placeholder="Interaction" >Interaction</span></div></div><i class="fa fa-bars  segment"></i><div class="add-col-wrap  add-status nodeflyOut"><ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4"><li role="presentation" class="no-bg"><a role="menuitem" tabindex="-1" class="nodeFlyout" data-toggle="modal" data-target="#nodeFlyout" data-direction="right"><div class="node-circle node-white-circle-expanded">N</div>View Class </a></li></ul></div></td>';
    operationsArr[6][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system merge-td creation-bg"><div class="blank-div segment-node"></div></td>';
    // sixth row data here
    operationsArr[7][0] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation1 border-light-bottom"><div class="blank-div segment-node"></div></td>';
    operationsArr[7][1] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse border-light-top border-light-bottom"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div></div></td>';
    operationsArr[7][2] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation2 border-light-bottom"><div class="blank-div segment-node"></div></td>';
    operationsArr[7][3] = '<td class="ExcelTablerow col-#$#COL#$# operation-series operation-event collapse border-light-top border-light-bottom"><div class="creation-node"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div></div></td>';
    operationsArr[7][4] = '<td class="ExcelTablerow col-#$#COL#$# operation-series role creation-bg border-light-bottom"><div class="blank-div segment-node"></div></td>';
    operationsArr[7][5] = '<td class="ExcelTablerow col-#$#COL#$# operation-series system creation-bg border-light-bottom"><div class="blank-div segment-node"></div></td>';

    return operationsArr;
}*/

// Code By Amit Malakar
/*function deleteUnstrucPhase($_this,segCon,segDes) {
    var unstrucLastRowHtml = 0;
    var addtdWrapper = $_this.closest('td');
    var myCol = $(addtdWrapper).index();

    updateSegmentsInCol(myCol,'schedule');
    var tdClass = addtdWrapper.attr('class');
    var parent_class = $.grep(tdClass.split(" "), function(v, i) {
        return v.indexOf('parent_') === 0;
    }).join();
    var segArr = parent_class.split('_');


    var deleteRowStart = parseInt(segArr[1]);
    var lastColumn = $(".center-div table.fixed-left-column tr:eq(2) td").length-2;

    parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
        return v.indexOf('parent_') === 0;
    }).join();

    var deleteRowEnd = deleteRowStart + 1;

    if(segDes == deleteRowEnd && (segDes-segCon) >= 3) {
        // atleast 2 phase are there
        // then copy unstructured destructor
        unstrucLastRowHtml = $(".center-div table.fixed-left-column tr:eq("+deleteRowEnd+") td").filter(":eq(5),:eq(6)");
    }

    // copy the segCon (start) row
    var firstRowHtml = $(".center-div table.fixed-left-column tr:eq(2) td:lt(7)");
    // copy the segDes (end) row
    var lastRowHtml = $(".center-div table.fixed-left-column tr:last td:lt(7)");

    for (i = deleteRowStart; i<=deleteRowEnd; i++) {
        for (j = myCol; j <= lastColumn; j++) {
            $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
        }
    }
    // update row-2
    $(".center-div table.fixed-left-column tr:eq(2) td").slice(0, 7).remove();
    $(".center-div table.fixed-left-column tr:eq(2)").prepend(firstRowHtml);
    // update last row
    $(".center-div table.fixed-left-column tr:last td").slice(0, 7).remove();
    $(".center-div table.fixed-left-column tr:last").prepend(lastRowHtml);
    if(unstrucLastRowHtml.length==2) {
        // insert the last unstructured destructor
        $(".center-div table.fixed-left-column tr:eq("+(deleteRowStart-1)+") td").slice(5, 7).remove();
        $(".center-div table.fixed-left-column tr:eq("+(deleteRowStart-1)+") td:eq(4)").after(unstrucLastRowHtml);
    }

    // update segment column
    // updateSegmentsInCol(myCol,'schedule');  // week column segment update
    // updateTextNumInCol(myCol,'Segment','schedule-segment-week'); // week column numbering reset
    var dataArray = getDataArray();
    return dataArray;
}*/


// Code By Amit Malakar
/*function deleteScheduleSegment($_this, extend) {
    displayLoader();
    var addtdWrapper = $_this.closest('td');
    var addtrWrapper = $(addtdWrapper).closest('tr');
    //var addtableWrapper = $(addtrWrapper).closest('table');
    var myCol = $(addtdWrapper).index();

    updateSegmentsInCol(myCol,'schedule');
    var tdClass = addtdWrapper.attr('class');
    var segment_class = $.grep(tdClass.split(" "), function(v, i) {
        return v.indexOf('schedule_') === 0;
    }).join();
    var segArr = segment_class.split('_');

    var myRow = parseInt(segArr[1]);//$(addtrWrapper).index();
    var lastColumn = $(".center-div table.fixed-left-column tr:eq(2) td").length-2;//$(addtrWrapper).find('td').not(':empty').last().index();

    parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
        return v.indexOf('parent_') === 0;
    }).join();

    //var noofRows = $('.center-div .' + parentName).length;
    var lastRow = parseInt(segArr[2]);//parseInt(myRow) + parseInt(noofRows) - parseInt(1);

    var dayCol = 0;
    if($('.schedule-segment-day').length) { dayCol = 1;}


    var i, j;
    var firstRowHtml = '';
    var lastRowHtml = '';
    var lastRowTable = $(".center-div table.fixed-left-column tr").length -1;
    //console.log(lastRow + ' ' + lastRowTable);
    //console.log(myCol + ' ' + lastColumn);
    for (i = 2; i <= lastRowTable; i++) {
        for (j = 0; j <= (myCol-1); j++) {
            if(i==2 && j <= 4) {
                firstRowHtml += $('.center-div .cell_' + i + '_' + j).closest('td').get(0).outerHTML;
            } else if(i==lastRowTable && j <= 4) {
                lastRowHtml +=  $('.center-div .cell_' + i + '_' + j).closest('td').get(0).outerHTML;
            }
        }
    }
    for (i = myRow; i <= lastRow; i++) {
        for (j = myCol; j <= lastColumn; j++) {
            $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
        }
    }

    if($('.schedule-segment-week').length < 1) {

        if($(".center-div table.fixed-left-column tr").length == 2) {
            struc_html1 = '<td class="ExcelTablerow transparent blank"><div class="blank-div segment-node"></div></td>'+
                '<td class="ExcelTablerow transparent blank structuredSche"><div class="blank-div segment-node"><span class="icon-plus Add-unstructured-segment1"></span></div></td>';
            struc_html2 = '<td class="ExcelTablerow border-bottom blank"><div class="blank-div segment-node"></div></td>'+
                '<td class="ExcelTablerow border-bottom blank structuredSche"><div class="blank-div segment-node"></div></td>';
            if(extend==1) {
                event_html = '<td class="ExcelTablerow collapse event creation-bg merge-td border-right blank"><div class="blank-div segment-node"></div></td>';
                struc_html1+= event_html;
                struc_html2+= event_html;
            }
            struc_html1 += '<td class=""></td>';
            struc_html2 += '<td class=""></td>';
            tr_html = '<tr class="row-2">'+firstRowHtml+struc_html1+'</tr>';
            tr_html+= '<tr class="row-3">'+lastRowHtml+struc_html2+'</tr>';
            $(".center-div table.fixed-left-column").append(tr_html);
        } else if(extend==0) {
            struc_html1 = '<td class="ExcelTablerow transparent blank structuredSche"><div class="blank-div segment-node"><span class="icon-plus Add-unstructured-segment1"></span></div></td>';
            struc_html2 = '<td class="ExcelTablerow border-bottom blank structuredSche"><div class="blank-div segment-node"></div></td>';
            $(".center-div table.fixed-left-column tr:eq(2) td:eq(7)").replaceWith(struc_html1);
            $(".center-div table.fixed-left-column tr:eq(3) td:eq(7)").replaceWith(struc_html2);
        } else if(extend==1) {
            console.log(myCol+1);
            $(".center-div table.fixed-left-column tr").find("td:eq("+(myCol+1)+")").remove();
            $(".center-div div.fixed-top-header tr").find("td:eq("+(myCol+1)+")").remove();
        }
        if(extend ==0 ) {
            var deleteCol = myCol + 1;
            $(".center-div div.fixed-top-header tr td.col-"+deleteCol).remove();
            $(".center-div div.fixed-top-header tr td:last").removeClass('cell_0_'+(deleteCol+1)+' col-'+(deleteCol+1));
            $(".center-div div.fixed-top-header tr td:last").addClass('cell_0_'+deleteCol+' col-'+deleteCol);
            //$(".center-div div.fixed-top-header tr.row-1 td.col-"+deleteCol).remove();
            //$(".center-div div.fixed-top-header tr.row-1 td:last").removeClass('cell_1_'+(deleteCol+1)+' col-'+(deleteCol+1));
            //$(".center-div div.fixed-top-header tr.row-1 td:last").addClass('cell_1_'+deleteCol+' col-'+deleteCol);
            if(dayCol){
                $(".center-div div.fixed-top-header tr td.col-"+(deleteCol+1)).remove(); // day
                $(".center-div div.fixed-top-header tr td.col-"+(deleteCol+2)).remove(); // day event
                $(".center-div div.fixed-top-header tr td.col-"+(deleteCol+3)).remove(); // time
                //$(".center-div div.fixed-top-header tr.row-1 td.col-"+(deleteCol+1)).remove(); // day
                //$(".center-div div.fixed-top-header tr.row-1 td.col-"+(deleteCol+2)).remove(); // day event
                //$(".center-div div.fixed-top-header tr.row-1 td.col-"+(deleteCol+3)).remove(); // time
            }
            $(".center-div table.fixed-left-column tbody tr").each(function() {
                $(this).find("td.col-"+deleteCol).remove(); // week event
                if(dayCol) {
                    $(this).find("td.col-"+(deleteCol+1)).remove(); // day
                    $(this).find("td.col-"+(deleteCol+2)).remove(); // day event
                    $(this).find("td.col-"+(deleteCol+3)).remove(); // time
                }
                //$(this).find("td:last").removeClass('cell_0_'+(deleteCol+1)+' col-'+(deleteCol+1));
                //$(this).find("td:last").addClass('cell_0_'+deleteCol+' col-'+deleteCol);
            });

        }
    }

    // update row-2
    $(".center-div table.fixed-left-column tr:eq(2) td").slice(0, 5).remove();
    $(".center-div table.fixed-left-column tr:eq(2)").prepend(firstRowHtml);
    // update last row
    $(".center-div table.fixed-left-column tr:last td").slice(0, 5).remove();
    $(".center-div table.fixed-left-column tr:last").prepend(lastRowHtml);
    // update segment column
    updateSegmentsInCol(myCol,'schedule');  // week column segment update
    updateTextNumInCol(myCol,'Segment','schedule-segment-week'); // week column numbering reset
    if(dayCol) { updateTextNumInCol(myCol+2,'Segment','schedule-segment-day'); } // day column numbering reset
    var dataArray = getDataArray();
    DeleteManifest();
    return dataArray;
}*/

// Code by Amit Malakar
// Date - 02-Mar-2016
/*function getDataArray() {
    var dataArray               = Array();
    var dataArrayFirstTwo       = Array();
    var index = 0;
    $(".center-div div.fixed-top-header table").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                dataArrayFirstTwo[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });
    index = 0;
    $(".center-div table.fixed-left-column").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });
    for (i = 0; i < dataArrayFirstTwo.length; i++) {
        dataArray[i] = dataArrayFirstTwo[i];
    }
    return dataArray;
}*/
// Code by Amit Malakar
// Date - 17-Mar-2016
/*function correctPhaseOperationMenu() {
    var rPhaseInfoArr = getRealPhaseInfo();
    var newClass = 'dropdown-menu show-' + rPhaseInfoArr[0];
    $(".center-div div.fixed-top-header tr:eq(0) td:eq("+rPhaseInfoArr[0]+")").find('ul').attr('class', newClass);
}*/

/*function getAllSegentsOfPhases()
{
  var newArray  = findSegmentsInCol(7,'schedule');
  var newArray1 = findUnstructureRows();

  console.log('newArray = '+newArray);
  for(i=0; i<newArray.length; i++)
  {
    nText = newArray[i].split('_');
    startRange  = nText[1];
    endRange    = nText[2];
    console.log('startRange = '+startRange+', '+'endRange = '+endRange);
  }
  console.log('newArray1 = '+newArray1);
  for(i=0; i<newArray1.length; i++)
  {
    nText = newArray1[i].split('_');
    startRange  = nText[1];
    endRange    = nText[2];
    console.log('startRange = '+startRange+', '+'endRange = '+endRange);
  }
}*/

function findUnstructureLastRows()
{
  var segment_arr = '';
  var sn = 0;
  var en = 0;
  var totalRow = -1;
  $(".center-div table.fixed-left-column").each(function() {
    var $table          = $(this);
    var $rows           = $("tbody tr", $(this));

    $rows.each(function(row, v) {
      totalRow++;
      $(this).find("td").each(function(cell, va) {
          if(cell == 6)
          {
            text = $.trim($(this).text()).replace(/\s/g, "");
            text = text.replace(/[0-9]+/, "");
            
            if(text == 'NCreation' && parseInt(sn) == 0 && parseInt(en) == 0)
            {
              sn = row;
            }
            
            if(text == 'NDestruction' && parseInt(sn) > 0 && parseInt(en) == 0)
            {
              en = row;
            }

            segment_arr = '';
            
            if(parseInt(sn) > 0 && parseInt(en) > 0)
            {
              segment_arr = sn+','+en;
              sn = 0;
              en = 0;
            }
          }
      });
    });
  });

  return segment_arr+','+totalRow;
}

function findUnstructureRows()
{
  var segment_arr = [];
  var sn = 0;
  var en = 0;
  $(".center-div table.fixed-left-column").each(function() {
    var $table          = $(this);
    var $rows           = $("tbody tr", $(this));
    $rows.each(function(row, v) {
      $(this).find("td").each(function(cell, va) {
          if(cell == 6)
          {
            text = $.trim($(this).text()).replace(/\s/g, "");
            text = text.replace(/[0-9]+/, "");
            
            if(text == 'NCreation' && parseInt(sn) == 0 && parseInt(en) == 0)
            {
              sn = row;
            }
            
            if(text == 'NDestruction' && parseInt(sn) > 0 && parseInt(en) == 0)
            {
              en = row;
            }
            
            if(parseInt(sn) > 0 && parseInt(en) > 0)
            {
              segment_arr.push('schedule_'+sn+'_'+en);
              sn = 0;
              en = 0;
            }
          }
      });
    });
  });

  return segment_arr;
}

function openThreePaneSchedule()
{
    console.log('oper3paneschedule');
    /*$(obj).toggleClass('openthreepane');
    if($(obj).hasClass('openthreepane')){
        $("#scheduleBuilder").animate({"right":"0"}, 300, function(){
            $("#scheduleBuilder").addClass("in");  
             $('.nano').nanoScroller();
        });
    }
    else{
        $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
           $("#scheduleBuilder").removeClass("in"); 
           $('.structuredSche.openthreepane').removeClass('openthreepane'); 
        });  
    }*/
    $("#scheduleBuilder").animate({"right":"0"}, 300, function(){
        $("#scheduleBuilder").addClass("in");
        $('.nano').nanoScroller();
    });
    // AMIT MALAKAR >>>
        if($('.schedule-segment-day:first').length >= 1) {
            $('#timeline_form td[data-id="day"]').parents('tr').find('.cls-check').prop('checked', true).attr('disabled', true);
            $('#timeline_form td[data-id="hour"]').parents('tr').find('.cls-check').prop('checked', true).attr('disabled', true);
            $('#timeline_form td[data-id="minute"]').parents('tr').find('.cls-check').prop('checked', true).attr('disabled', true);
        } else {
            $('#timeline_form td[data-id="day"]').parents('tr').find('.cls-check').prop('checked', false).attr('disabled', false);
            $('#timeline_form td[data-id="hour"]').parents('tr').find('.cls-check').prop('checked', false).attr('disabled', false);
            $('#timeline_form td[data-id="minute"]').parents('tr').find('.cls-check').prop('checked', false).attr('disabled', false);
        }
    // <<< AMIT MALAKAR
    threepaneSlide();   
}

/*function here used to display defalut week day 1*/
function defaultWeek()
{
    var sVal = $(".wk_segment").val(); 
    var wk_select='';
    $(".segment-wk").html('');
    $(".wk-starting-segment").html('');
    wk_select ='<option value="1">1 Week</option>';
    for( var index  = 0 ; index < sVal;index++) 
    {
        ckVal = parseInt(index)+1;   
        
        h_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+ckVal+'" name="wk-ck-segment[]"><label></label></div><div>Week '+ckVal+'</div></li>';
        $(".segment-wk").append(h_li);
        
    }
    $(".wk-starting-segment").append(wk_select);
}

/*function here used to display defalut day 7 */
function defaultDay()
{
    var sVal = $(".day_segment").val(); 
    var day_select= '';
    $(".segment-day").html('');
    $(".day-starting-segment").html('');
    day_select='<option value="1">1 Day</option>';
    for(var index  = 0 ; index < sVal;index++) 
    {
        ckVal = parseInt(index)+1;   
        h_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+ckVal+'" name="day-ck-segment[]"><label></label></div><div>Day '+ckVal+'</div></li>';
        $(".segment-day").append(h_li);
        
    }
    $(".day-starting-segment").append(day_select);
}

/*function here used to display defalut Hour 24 */
function defaultHour()
{
    var sVal = $(".hour_segment").val(); 
    var hour_select= '';
    $(".segment-hour").html('');
    $(".hour-starting-segment").html('');
    hour_select='<option value="1">1 Hour</option>';
    for(var index  = 0 ; index < sVal;index++) 
    {
        ckVal = parseInt(index)+1;   
        hour_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+ckVal+'" name="hour-ck-segment[]"><label></label></div><div>Hour '+ckVal+'</div></li>';
        $(".segment-hour").append(hour_li);
    }
    $(".hour-starting-segment").append(hour_select);
}

/*function here used to display defalut Minute 60 */
function defaultMinute()
{
    var sVal = $(".minute_segment").val(); 
    var minute_select= '';
    $(".segment-minute").html('');
    $(".minute-starting-segment").html('');
    minute_select='<option value="1">1 Minute</option>';
    for(var index  = 0 ; index < sVal;index++) 
    {
         ckVal = parseInt(index)+1;   
         minute_li  ='<li><div class="custom-checkbox"><input type="checkbox" disabled="true" checked="true" class="cls-check" value="'+ckVal+'" name="minute-ck-segment[]"><label></label></div><div>Minute '+ckVal+'</div></li>';
         $(".segment-minute").append(minute_li);
    }
    $(".minute-starting-segment").append(minute_select);
}

/*function used here check segment type and defeult selected week checkbox*/
function checkSegmentType()
{
    $.each($("input[name='common_time[]']:checked"), function() {
       var chVal = $(this).val();
       if($.inArray( "week", chVal )){
        $('#wk_parent_name').attr('value','Month')
       }
       if($.inArray( "day", chVal )){
        $('#day_parent_name').attr('value','Week')
       }
    });
}

/*function here to check segmentType*/
function checkSeg()
{
    var chVal = '' , pushVal = [];
    $.each($("input[name='common_time[]']:checked"), function() {
        pushVal.push($(this).val());
    });
    return pushVal;
}

/* OBSOLETE FUNCTION, DELETE
 function saveScheduleOfProcess() {
    var addRow                  = $("#scheduleRow").val();
    var addCol                  = $("#scheduleCol").val();
    var status                  = $("#scheduleStatus").val();
    var extend                  = 0;
    var wk_segment              = parseInt($('#timeline_form .wk_segment').val());
    var unstrucSegCount         = findUnstructureRows().length;
    var strucSegCount           = $('.schedule-segment-week').length;
    var strucSegDayCount        = $('.schedule-segment-day').length;
    if($('#scheduleExtend').length)
        extend = ($('#scheduleExtend').val()) ? $('#scheduleExtend').val() : 0;

    displayLoader();

    if (extend == 0) {
        dataArray = getDataArray();
    } else {
        rowColArr    = extend.split('#')[0].split('_');
        $_this       = $('.cell_' + rowColArr[0] + '_' + rowColArr[1]).find('.schedule-extend');
        addRowColArr = extend.split('#')[1].split('_');
        addRow       = addRowColArr[0];//rowColArr[0];
        addCol     = rowColArr[1];
        extendFlag = wk_segment == 0 ? 0 : 1;

        dataArray = deleteScheduleSegment($_this, extendFlag);
        //hideLoader();return true;
        $('#scheduleExtend').val('');
        // updateTextNumInCol(7,'Segment');
        //if($('.schedule-segment-week').length<1) {
        //    status = 'First';
        //}
        if (extendFlag == 0) {
            $.post(domainUrl + 'process/deleteStructuredPhase', {
                'data': dataArray,
            }, associationResponceCreatePhase, 'HTML');
            return true;
        }
    }

    // status
    var below = 'below';
    if (addRow == 2) {
        below = 'above';
    }
    var realPhase = getRealPhaseInfo();
    if (wk_segment != 0) {
        $.post(domainUrl + 'process/addStructureSegment', {
            'extend': extend,
            'addRow': addRow,
            'addCol': addCol,
            'status': status,
            'below': below,
            'isDayPro': checkDayExist(),
            'isRPhasePro': (realPhase.length)>1 ? 1 : 0,
            'rPhaseColNo': realPhase[0],
            'unstrucSegCount': unstrucSegCount,
            'strucSegCount': $('.schedule-segment-week').length,
            'strucSegDayCount': strucSegDayCount,
            'rows': $(".center-div table.fixed-left-column tr").length - 2,
            'cols': $(".center-div div.fixed-top-header tr.row-1 td").length - 2,
            'formData': $("#timeline_form").serialize(),
            'data': dataArray
        }, associationResponceCreatePhase, 'HTML');
    }
}*/

// Code by Amit Malakar
// Date - 15-Mar-2016
function checkDayExist() {
    var dayFlag = 0;
    $(".center-div div.fixed-top-header tr.row-1 td").each(function () {
        var text = $(this).text().replace(/\s/g, "");
        if (text == 'NDay') {
            dayFlag = 1;
        }
    });
    return dayFlag;
}

// Code by Amit Malakar
// Date - 26-Feb-2016
function updateTextNumInCol(col,text,cls) {
    var i=1;
    //'schedule-segment-week'
    $(".center-div table.fixed-left-column").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            var seg_text = $(this).find("td").eq(col).find('span.'+cls).text();
            if(seg_text.length) {
                $(this).find("td").eq(col).find('span.'+cls).text(text+i);
                i++;
            }
        });
    });
}

function correctCssStructured() {
    var strucCol = parseInt($("#scheduleCol").val());
    var unstrucCol = 5;
    var phaseCol = getRealPhaseInfo();
    $(".center-div table.fixed-left-column").each(function() {
        var $rows           = $("tbody tr", $(this)).not(':last');
        $rows.each(function(row, v) {
            $(this).find("td").each(function(){
                $(this).removeClass('border-bottom');
                if($(this).index()==3) {
                    $(this).addClass('ExcelTablerow merge-td');
                    $(this).removeClass('ExcelTableFormationCol border-bottom');
                } else if($(this).index()== strucCol || $(this).index()==strucCol+1
                    || $(this).index()== unstrucCol
                    || $.inArray($(this).index(),phaseCol)>-1) {
                    $(this).addClass('ExcelTablerow');
                    $(this).removeClass('ExcelTableFormationCol border-bottom');
                    if($(this).index()==strucCol+1)
                        $(this).addClass('border-right');
                }
            });
        });
    });
    //$('li.schedule-create-new a').removeClass('disabled');
}

function toggleDaySelection(param) {
    if($(param).val() == 'day') {
        if($(param).is(':checked')){
            $('td[data-id="hour"]').parents('tr').find('.cls-check').prop("checked", true);
            $('td[data-id="minute"]').parents('tr').find('.cls-check').prop("checked", true);
        } else {
            $('td[data-id="hour"]').parents('tr').find('.cls-check').prop("checked", false);
            $('td[data-id="minute"]').parents('tr').find('.cls-check').prop("checked", false);
        }
    }
}
window.puJsFileLoadCounter++;
