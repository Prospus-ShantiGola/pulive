function fixedHeadLeftCol() {
    //nice scrollbar
    $('.center-div table.fixed-left-column').fixedTblHdrLftCol({
        scroll: {
            leftCol: {
                fixedSpan: 2
            }
        }
    });
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
    $('.left-head').css("width",$('#center-screen').width());
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
                operationClass = "";
                operationClass = $.grep(this.className.split(" "), function(v, i) {
                    return v.indexOf('operation-series') === 0;
                }).join();
                if (operationClass != '') {
                    parentClass = operationClass + ' ' + parentClass
                }
                dataAlgo[indexCounter] = row + '@' + cell + '@' + parentClass;
                indexCounter++;
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

    
}





function responceAlgo(d, s) {
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
                            if (isAutonumberDisplay == false) {
                                objRow.find('.custom-node').after("<span class='table-count hide' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                            } else {
                                objRow.find('.custom-node').after("<span class='table-count ' data-id='"+value+"'>" + value + "</span>");
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
    
    $(".center-div .fTHLC-inner-wrapper").niceScroll({cursorcolor: "#909090",cursorborder: "0",cursorwidth:"10px", autohidemode:false});
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
                            if (isAutonumberDisplay == false) {
                               // objRow.find('.custom-node').after("<span class='table-count hide' data-id='"+value+"'>" + value + "</span>");
                                objRow.find('.custom-node').attr("name", parentClass);
                            } else {
                               // objRow.find('.custom-node').after("<span class='table-count ' data-id='"+value+"'>" + value + "</span>");
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


    

   
   
   $(".center-div .fTHLC-inner-wrapper").scrollLeft(827);
    
   if(hideNumbering == true){
        $('.table-count').addClass('hide');
         $('.show-auto-number').addClass('hide-gridNumber');
    }
    $(".center-div .blankRow td.creation-bg").removeClass (function (index, css) {
        
            return (css.match (/\bparent_\S+/g) || []).join(' ');
    });
     $(".center-div .fTHLC-inner-wrapper").niceScroll({cursorcolor: "#909090",cursorborder: "0",cursorwidth:"10px", autohidemode:false});

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
        'width': cntrWidth - 98,
        'height': cntrHeight,
        'paddingLeft': 98
    });
    //  $('.firefox .center-div .fTHLC-outer-wrapper').css({
    //     'width': cntrWidth - 103,
    //     'height': cntrHeight - 30,
    //     'paddingLeft': 103
    // });
    $('.center-div .fTHLC-inner-wrapper').css({
        'width': cntrWidth - 98,
        'height': cntrHeight 
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
		   console.log("true");
			  var get = $(this).closest('td').attr('class').split(" ").filter(function(v, i) {
					return v.indexOf('col-') === 0;
				}).join();
            console.log("get",get);
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
    $('.left-head').css("width",$('#center-screen').width());
    fixedHeadLeftCol();
   // this function take a long load time removeTdColClass();
   $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
   setTdColClass();
   margecell();
   $(".lodding").hide();
}