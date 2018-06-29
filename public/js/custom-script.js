var isAutonumberDisplay = true;
var imageFlag = false;
var calculativeWidth = 0;
var midWidth = $("#center-screen").width();
var CountFlag = true;
var hideNumbering = true;
var CheckBuildMode = 0;
var simulateContinue = 0;
var selectedGridId;

$(document).ready(function() {



    // code for collapsing and expanding menu of the left 
    $('.left-manu-bar .dropdown-menu').click(function(e) {


        e.stopPropagation();
    });
    //selection in couseBoard window
    $('body').on('click', '.courseboard_left tr', function() {
        $('.courseboard_left tr').find('.node-circle').removeClass('node-green-circle-expanded').addClass('node-white-circle-expanded');
        $(this).find('.node-circle').addClass('node-green-circle-expanded').removeClass('node-white-circle-expanded');
    });

    $(document).on('click', '.left-manu-bar #drop3', function() {
        $('#node-1 > ol > li:nth-child(1) > a').children().addClass('node-green-circle').parent().addClass('activeBG');
        if ($('#fat-menu').hasClass('open')) {
            $('.left-manu-bar #drop3').find('b.fa-angle-down').removeClass('fa-angle-down').addClass('cross-tab fa-times');
            $('.left-manu-bar #drop3').prev().addClass('blackIcon');
        } else {
            $('.left-manu-bar #drop3').find('b.cross-tab').removeClass('cross-tab fa-times').addClass('fa-angle-down');
            $('.left-manu-bar #drop3').prev().removeClass('blackIcon');
        }

    });

    $('body').on('click', '.system-dropdown', function() {
        setliwidth();
        $('#div_main_menu_item a').on('click', function() {

            $('#div_main_menu_item a').removeClass('activeBG');
            $('#div_main_menu_item a .node-circle').removeClass('node-green-circle node-green-circle-expanded');
            $(this).addClass('activeBG');
            if ($(this).find('.node-circle').hasClass('node-white-circle-expanded')) {
                $(this).find('.node-circle').addClass('node-green-circle-expanded');
            } else {
                $(this).find('.node-circle').addClass('node-green-circle');
            }
        });
    });


    $("body").on('dblclick', ".left-manu-bar ol .node-white-circle-expanded", function(e) {
        $(this).closest('li').children('ol').toggle();
        $(this).addClass('node-selected');
    });

    $('body').on('mouseover', '.center-div .add-col-wrap ul.dropdown-menu li', function(e) {
        e.stopPropagation();
        $(this).addClass('current');
        $('.node-white-circle-expanded').parent('a').parent('li').removeClass('current');
    });

    $('body').on('mouseout', '.center-div .add-col-wrap ul.dropdown-menu li', function() {
        $(this).removeClass('current');
    });

    $('body').on('click', '.entr-left-tab li', function(event) {
        $('#perspectiveDiv').find('.node-left-col').children('li').removeClass('node-selected');
        event.stopPropagation;
    });

    $('body').on('mouseover', '#association-table thead th', function(index, event) {
        $(this).children('i.add').addClass('show');
    });

    // $('.account-grid').find('.fTHLC-inner-wrapper').css({
    //     'width': 700,
    //     'height': 500
    // });


    /*code here to use event status modal open*/
    $('body').on('click','.check-add-status',function(){
            
            var addtdWrapper = $(this).closest('td');
            var addtrWrapper = $(addtdWrapper).closest('tr');
            var addtableWrapper = $(addtrWrapper).closest('table');
            var myCol = $(addtdWrapper).index();
            var myRow = $(addtrWrapper).index();
            var preNoSegment = 0;
            var NewdataArray = Array();
            var index = 0;

            /*var eventVal = [];
                $.each($("input[name='event_status[]']:checked"), function() {
                eventVal.push($(this).val());
            });*/

            //var before = $('.center-div .fixed-left-column .row_'+myRow).find('.col-'+myCol).find('div').hasClass('e-before');    
            

            $(".center-div table").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];

                $rows.each(function(row, v) {
                    $(this).find("td").each(function(cell, v) {
                        if (row >= 2 && myCol == cell) {
                            str = $(this).text();
                            
                                preNoSegment++;
                            
                        }
                    });
                });
            });
       


             $.post(domainUrl + 'grid/index', {
                'type': 'phase',
                'preNoSegment': preNoSegment,
                'columnNumber': myCol,
                'myRow':myRow,
                'confirm': 'EventStatus'
            }, responceEventStatus, 'HTML');
        
    });
    /*end code here to event status*/

    setInitalHeightWidth();
    // $('i').tooltip();
    //  $('a').tooltip();
    $('body').on('mouseover', '.tab-item', function() {
        $(this).tooltip('show');
    });
    $('body').on('.mouseout', '.tab-item', function() {
        $('.tooltip').remove()
    });

    $('.node-right').mouseover(function() {
        $(this).addClass('node-right-trans');
    });
    $('.node-right').mouseout(function() {
        $(this).removeClass('node-right-trans');
    });

    

    $('body').on('click', '.col-1', function(event) {
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
        $('.center-div  .add-col-wrap').children('ul').removeClass('show');
        $('.center-div  td').removeClass('bg-green border-green border-bottom-green border-top-green border-right-green');
        $('.dark-gray').removeClass('dark-gray');
        $('.center-div  .node-white-circle.node-green-circle').removeClass('node-green-circle');
        var RowSelected = $(this);

        if ($(RowSelected).hasClass('row-selected')) {

            $(this).removeClass('row-selected ');
            $(this).nextAll('td').removeClass('row-selected border-top-green');
            $(this).parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
            if(!($('.center-div').hasClass('process-grid'))){
                $(this).parent('tr').next('tr').children('td.col-1').removeClass('border-top-green');
            }
            
        } else {
            $('.center-div  td').removeClass('row-selected');
            $(this).addClass('row-selected');
            $('.center-div  td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');

            $(this).nextAll('td').addClass('row-selected');
            $(this).parent('tr').prev('tr').children('td.border-light-bottom').addClass('row-green-border');
            if(!($('.center-div').hasClass('process-grid'))){
                $(this).parent('tr').next('tr').children('td.col-1').addClass('border-top-green');
            }

            $('.center-div  .row-selected').find('.node-white-circle').addClass('node-green-circle');
            $('.center-div  .row-0').find('.row-selected').removeClass('row-selected');
            $('.center-div  .row-1').find('td').removeClass('border-top-green');
        }
        event.stopPropagation();
    });

    /*function use here to add association process here*/

    /*add Operation Series*/

    $('body').on('click', '.center-div .add-process-series', function() {
        displayLoader();
        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();

        var dataArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        preNoSegment++;
                    }
                });
            });
        });

        $.post(domainUrl + 'associations/addProcess', {
            'data': dataArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment
        }, associationResponceCreatePhase, 'HTML');
    });

    /*end code here*/


    $('body').on('click', '.center-div .add-suboperaton-segment', function() {
        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();
        var preNoSegment = 0;
        var NewdataArray = Array();
        var index = 0;

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                $(this).find("td").each(function(cell, v) {
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();

                        preNoSegment++;

                    }
                });
            });
        });

      var opIndexNo = '';
            $('.center-div .fixed-left-column').find('.operation1 .add-segment  .dropdown-menu').each(function(i,v){
            if($(this).hasClass('show')){
                opIndexNo = (parseInt(i)+parseInt(1));
            }
        });

        
        $.post(domainUrl + 'grid/index', {
            'type': 'phase',
            'preNoSegment': preNoSegment,
            'columnNumber': myCol,
            'myRow': myRow,
            'opIndexNo': opIndexNo,
            'confirm': 'SubOpeartion'
        }, responceSubOpearation, 'HTML');



    });

    /*code start here to add phase for association*/

    $('body').on('click', '.center-div .addPopupPhaseClass', function() {
        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();
        var preNoSegment = 0;
        /*navigation*/
		if($('#course-path-number').hasClass('On')){
			gridNavigation.changeColor();
        }
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                $(this).find("td").each(function(cell, v) {
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        preNoSegment++;
                    }
                });
            });
        });


        var checkrole = 0;

        var checkrole = $(this).closest('td').nextAll('td').find('.add-role-segment').length;

        if (checkrole != '') {
            checkrole = checkrole;
        } else {
            checkrole = 0;
        }

        if (checkrole != 0) {
            $.post(domainUrl + 'associations/index', {
                'type': 'phase',
                'preNoSegment': preNoSegment,
                'columnNumber': myCol,
                'confirm': 'YES'
            }, addresponcePhase, 'HTML');
        } else {
            $.post(domainUrl + 'associations/index', {
                'type': 'phase',
                'preNoSegment1': preNoSegment,
                'columnNumber1': myCol,
                'confirm': 'NO'
            }, addresponcePhase, 'HTML');
        }

    });

    /*delete association phase segment*/

    $('body').on('click', 'li.association-del-segment', function() {

        if ($(this).find('a').hasClass('disabled')) {
            return false;
        }

        var $_this = $(this);
        bootbox.confirm("Are you sure you want to delete this?", function(confirmed) {
            if (confirmed) {
                var addtdWrapper = $_this.closest('td');
                var addtrWrapper = $(addtdWrapper).closest('tr');
                var addtableWrapper = $(addtrWrapper).closest('table');
                var myCol = $(addtdWrapper).index();
                var myRow = $(addtrWrapper).index();
                var lastColumn = $(addtrWrapper).find('td').not(':empty').last().index();

                parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
                    return v.indexOf('parent_') === 0;
                }).join();

                var noofRows = $('.center-div .' + parentName).length;

                var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);

                displayLoader();

                if ($_this.closest('td').prev().hasClass('blank')) {
                    $('.cell_' + lastRow + '_0').closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(myRow) - parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });
                } else {
                    $_this.closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(lastRow) + parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });
                }
                var i, j;
                for (i = myRow; i <= lastRow; i++) {
                    for (j = myCol; j <= lastColumn; j++) {
                        $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                    }
                }

                var dataArray = Array();
                var index = 0;
                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];


                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;

                        });
                    });

                });
                DeleteManifest();
                $.post(domainUrl + 'associations/deletePhase', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow,
                    'lastRow': lastRow,
                    'lastColumn': lastColumn
                }, associationResponceCreatePhase, 'HTML');

            }
        });
    });

    /*end code here*/

    $('body').on('click', '.center-div .addRoleSeries', function() {
        $_this = $(this);
        var RoleSereisArray = Array();
        var NewdataArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        var addtdWrapper = $_this.closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
            myRow = $(addtrWrapper).index();

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        preNoSegment++;
                    }
                });
            });
        });

        var checkrole = $(this).find('.add-role-segment').length;
        PreParentCol = parseInt(myCol) + parseInt(2);
        preChiledVal = $('.center-div .parent_' + 2 + '_' + PreParentCol + ' > div.creation-node').find('.col-text > span:first').attr('class');
        
        var checkProcess = $(".center-div .process-series").length;

         if (checkProcess > 0 ) {

            displayLoader();
            $.post(domainUrl + 'associations/addActor', {
                'data': RoleSereisArray,
                'myCol': myCol,
                'myRow': myRow,
                'preNoSegment': preNoSegment,
                'noOfSegment': noOfSegment,
                'ActorCheck': preChiledVal,
                'confirm': 'NO'
            }, associationResponceCreatePhase, 'HTML');
        } else {
            displayLoader();
            $.post(domainUrl + 'associations/addRole', {
                'data': RoleSereisArray,
                'myCol': myCol,
                'myRow': myRow,
                'preNoSegment': preNoSegment,
                'noOfSegment': noOfSegment,
                'confirm': 'NO'
            }, associationResponceCreatePhase, 'HTML');
        }

    });


    /*function use here to delete the role series  */
    $('body').on('click', '.deleteSegmentRole', function() {
        var $obj = $(this);
        var indexVal = $(this).closest('td').index();
        var dataArray = Array();
        var index = 0;
        var addtdWrapper = $obj.closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = 2;
        bootbox.confirm("Are you sure you want to delete this series?", function(confirmed) {

            if (confirmed) {
                displayLoader();
                $('tr').each(function() {
                    $(this).children('td').eq(indexVal).remove();
                });

                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];
                    var count = 0;
                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;
                        });
                    });

                });

                $.post(domainUrl + 'grid/deletePhase', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow

                }, responceCreateOperation, 'HTML');

            }
        });
    });

    /*code here to use for adding logic segment then first add domain after add segment*/

    function firstAddDomainAfterLogic(myRow, myCol, type, roleNo, NonSquential, domaincount, currentLength, lastColumn, ColNo) {
        displayLoader();
        var domainSeriesArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;

        var nonSequencecheck = [];
        var logicsN = [];

        var eventStatusCol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
        var eventCount = 0;
        if(eventStatusCol>0){
            eventCount = 1;
        }else {
            eventCount = 0;
        }

        /*code here to used check the non sequence blank row*/

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');

                $(this).find("td").each(function(cell, v) {
                    domainSeriesArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });

        });

        $(".center-div .blankRow").each(function() {

            nonSequencecheck.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i, v) {
            logicsN.push($(this).index());

        });


        var logicRowNo = [];
        $(".center-div .fixed-left-column tr").each(function() {
            if ($(this).hasClass('seq')) {
                var count = $(this).find('.domainclass').parents('td').parents('tr').index();
                if (count != '-1') {
                    logicRowNo.push(parseInt(count))
                }
            }

        });

        var suboperationCount = 0;

        //suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
        suboperationCount = $('.center-div .fixed-left-column .row-0 .col-' + ColNo).nextAll('td.add-sub-more-operation').length;

        var checkBlankRows = $(".center-div .blankRow").length;

        $.post(domainUrl + 'grid/addSingleLogicDomain', {
            'data': domainSeriesArray,
            'myCol': myCol,
            'myRow': myRow,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequencecheck,
            'logicsN': logicsN,
            'logicRowNo': logicRowNo,
            'lastColumn': lastColumn,
            'currentCol': ColNo,
            'currentLength': currentLength,
            'roleNo': roleNo,
            'suboperationCount': suboperationCount,
            'eventCount':eventCount
        }, responceAddOperationSegment, 'HTML');




    }

    /*end code here */

    /*code here to use for adding logic segment then first add domain after add segment*/

    function firstLogicDomainAfter(myRow, myCol, type, roleNo, NonSquential, domaincount, currentLength, lastColumn, ColNo) {
        displayLoader();
        var domainSeriesArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        var nonSequencecheck = [];
        var logicsN = [];
        /*code here to used check the non sequence blank row*/

        var eventStatusCol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
        var eventCount = 0;
        if(eventStatusCol>0){
            eventCount = 1;
        }else {
            eventCount = 0;
        }

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');

                $(this).find("td").each(function(cell, v) {
                    domainSeriesArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });

        });

        $(".center-div .blankRow").each(function() {

            nonSequencecheck.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i, v) {
            logicsN.push($(this).index());

        });

        var logicRowNo = [];
        $(".center-div .fixed-left-column tr").each(function() {
            if ($(this).hasClass('seq')) {
                var count = $(this).find('.domainclass').parents('td').parents('tr').index();
                if (count != '-1') {
                    logicRowNo.push(parseInt(count))
                }
            }

        });


        var checkBlankRows = $(".center-div .blankRow").length;

        var suboperationCount = 0;

        suboperationCount = $('.center-div .fixed-left-column .row-0 .col-' + ColNo).nextAll('td.add-sub-more-operation').length;



        $.post(domainUrl + 'grid/addFirstSingleLogicDomain', {
            'data': domainSeriesArray,
            'myCol': myCol,
            'myRow': myRow,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequencecheck,
            'logicsN': logicsN,
            'logicRowNo': logicRowNo,
            'lastColumn': lastColumn,
            'currentCol': ColNo,
            'currentLength': currentLength,
            'roleNo': roleNo,
            'suboperationCount': suboperationCount,
            'eventCount':eventCount
        }, responceAddOperationSegment, 'HTML');


    }

    /*end code here */


    /*function use here to add logic domain*/

    $('body').on('click', '.center-div .addDomain', function() {
        displayLoader();
        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();
        var domainSeriesArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        var nonSequence1 = [];
        var logicsN = [];
        /*code here to used check the non sequence blank row*/

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');

                $(this).find("td").each(function(cell, v) {
                    domainSeriesArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });

        });

        $(".center-div .blankRow").each(function() {

            nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i, v) {
            logicsN.push($(this).index());

        });

        var logicRowNo = [];
        $(".center-div .fixed-left-column tr").each(function() {
            if ($(this).hasClass('seq')) {
                var count = $(this).find('.domainclass').parents('td').parents('tr').index();
                if (count != '-1') {
                    logicRowNo.push(parseInt(count))
                }
            }

        });



        var checkBlankRows = $(".center-div .blankRow").length;
        $.post(domainUrl + 'grid/addLogicDomain', {
            'data': domainSeriesArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN': logicsN,
            'logicRowNo': logicRowNo
        }, responceCreateOperation, 'HTML');
    });

    /*end code hre*/


    

    /*function use here for add operation role series*/
    $('body').on('click', '.center-div .addSegmentRole', function() {
        displayLoader();
        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();
        var RoleSereisArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        var nonSequence1 = [];
        var logicsN = [];


        /*code here to used check the non sequence blank row*/

        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');

                $(this).find("td").each(function(cell, v) {
                    RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });

        });

        $(".center-div .blankRow").each(function() {

            nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i, v) {
            logicsN.push($(this).index());

        });

        var checkBlankRows = $(".center-div .blankRow").length;
        $.post(domainUrl + 'grid/addOperationRole', {
            'data': RoleSereisArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN': logicsN
        }, responceCreateOperation, 'HTML');

    });

    /*code start here to interchange role node */
    $('body').on('click', '.center-div .new-Role', function() {

        var $_this = $(this);
        var roleData = '';
        var currentData = '';
        var nodeHtml = '';
        var currentHtmlData = '';

        var checkNode = $_this.closest('td').siblings('.role').find('.creation-node').parent().length;
        /*function use here to add new node when left single role*/
        if (parseInt(checkNode) < 1) {
            bootbox.confirm("Are you sure you want to add node in current role?", function(confirmed) {

                if (confirmed) {
                    displayLoader();
                    var addtdWrapper = $_this.closest('td'),
                        addtrWrapper = $(addtdWrapper).closest('tr'),
                        addtableWrapper = $(addtrWrapper).closest('table'),
                        myCol = $(addtdWrapper).index();
                    myRow = $(addtrWrapper).index();

                    var RoleSereisArray = Array();
                    var preNoSegment = 0;
                    var noOfSegment = 0;
                    var index = 0;
                    $(".center-div table").each(function() {
                        var $table = $(this);
                        var $rows = $("tbody tr", $(this));
                        var headers = [];
                        var rows = [];

                        $rows.each(function(row, v) {
                            var rowClass = $(this).attr('class');

                            $(this).find("td").each(function(cell, v) {
                                RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                                index++;
                                if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    if (str.toLowerCase().indexOf("add segment") > 0) {
                                        preNoSegment++;
                                    }
                                }
                            });
                        });
                    });

                    $.post(domainUrl + 'grid/addOperationNode', {
                        'data': RoleSereisArray,
                        'myCol': myCol,
                        'myRow': myRow,
                        'preNoSegment': preNoSegment,
                        'noOfSegment': noOfSegment
                    }, responceCreateOperation, 'HTML');

                }
            });
        }

        /*end code here*/
        else {

            bootbox.confirm("Are you sure you want to add node in current role?", function(confirmed) {
                //  if (confirm("Are you sure you want to delete series?")) {
                if (confirmed) {
                    displayLoader();
                    var addtdWrapper = $_this.closest('td'),
                        addtrWrapper = $(addtdWrapper).closest('tr'),
                        addtableWrapper = $(addtrWrapper).closest('table');
                    var myCol = $(addtdWrapper).index();
                    var myRow = $(addtrWrapper).index();

                    currentHtmlData = $_this.closest('td').html();
                    $_this.closest('td').removeClass('disabled-role');
                    roleData = $_this.closest('td').siblings('.role').find('.creation-node').parent();
                    $_this.closest('td').siblings('.role').find('.creation-node').parent().addClass('disabled-role');
                    $_this.closest('td').html(roleData.html());

                    roleData.html(currentHtmlData);

                    //removeInteractiobborder();                    
                    hideLoader();$(".lodding").hide();
                }

            });
        }

    });


    /*code start here to replace domain value*/


    /*code start here to interchange role node */
    $('body').on('click', '.center-div .new-Domain', function() {


        var $_this = $(this);
        var roleData = '';
        var currentData = '';
        var nodeHtml = '';
        var currentHtmlData = '';
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;

        /*function use here to add new node when left single role*/
        if (parseInt(domaincount) == 1) {
            bootbox.confirm("Are you sure you want to add domain in current row?", function(confirmed) {

                if (confirmed) {
                    displayLoader();
                    var addtdWrapper = $_this.closest('td'),
                        addtrWrapper = $(addtdWrapper).closest('tr'),
                        addtableWrapper = $(addtrWrapper).closest('table'),
                        myCol = $(addtdWrapper).index();
                    myRow = $(addtrWrapper).index();
                    var prevRow = parseInt(myRow) - 1;
                    $('.center-div').find('.cell_' + prevRow + '_' + myCol).children('div').addClass('domainclass');


                    var RoleSereisArray = Array();
                    var preNoSegment = 0;
                    var noOfSegment = 0;
                    var index = 0;
                    $(".center-div table").each(function() {
                        var $table = $(this);
                        var $rows = $("tbody tr", $(this));
                        var headers = [];
                        var rows = [];

                        $rows.each(function(row, v) {
                            var rowClass = $(this).attr('class');

                            $(this).find("td").each(function(cell, v) {
                                RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                                index++;
                                if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    if (str.toLowerCase().indexOf("add segment") > 0) {
                                        preNoSegment++;
                                    }
                                }
                            });
                        });
                    });

                    $.post(domainUrl + 'grid/addOperationDomain', {
                        'data': RoleSereisArray,
                        'myCol': myCol,
                        'myRow': myRow,
                        'preNoSegment': preNoSegment,
                        'noOfSegment': noOfSegment
                    }, responceCreateOperation, 'HTML');

                }
            });
        }

        /*end code here*/
        else {

            bootbox.confirm("Are you sure you want to add domain in current row?", function(confirmed) {
                //  if (confirm("Are you sure you want to delete series?")) {
                if (confirmed) {
                    displayLoader();
                    var addtdWrapper = $_this.closest('td'),
                        addtrWrapper = $(addtdWrapper).closest('tr'),
                        addtableWrapper = $(addtrWrapper).closest('table');
                    var myCol = $(addtdWrapper).index();
                    var myRow = $(addtrWrapper).index();
                    var prevRow = parseInt(myRow) - 1;
                    $('.center-div').find('.cell_' + prevRow + '_' + myCol).children('div').addClass('domainclass');

                    currentHtmlData = $_this.closest('td').html();
                    roleData = $_this.closest('td').siblings('.role').find('.creation-node').parent();
                    $_this.closest('td').html(roleData.html());
                    roleData.html(currentHtmlData);

                    removeInteractiobborder();
                    hideLoader();$(".lodding").hide();
                }

            });
        }
    });

    /*end code here*/

    /*function here to use delete association phase and actor*/
    $('body').on('click', '.center-div li.delete-phase-actor-series', function() {
        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = 2;
        var dataArray = Array();
        var index = 0;
        var noofRows = $('.center-div .parent_2_' + myCol).length;
        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);

        bootbox.confirm("Are you sure you want to delete hhh this series?", function(confirmed) {
            
            if (confirmed) {
                displayLoader();
                /*
                var indval = $('.center-div .fixed-left-column .Process').index();
                $('.center-div  .col-' + indval).remove();
                */

                $('.center-div.association-grid .col-' + myCol).prev('td').nextAll('td').children("span").parent('td').remove();
                $('.center-div.association-grid .col-' + myCol).prev('td').nextAll('td').children("div").parent('td').remove();

                var maincounts = 0;
                var count = 0;
                $(".center-div .fixed-left-column").find('tr').each(function(i, v) {
                    ++maincounts;
                    if (maincounts >= 3) {
                        $(this).find('td').each(function(i, v) {
                            if ($(this).find('.custom-node').length > 0) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            $(this).remove()
                        } else {
                            count = 0;
                        }
                    }

                });

                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];
                    var count = 0;
                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;
                        });
                    });

                });
                DeleteManifest();
                $.post(domainUrl + 'associations/deletePhase', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow
                }, associationResponceCreatePhase, 'HTML');
            }
        });
        $('.row-1').children('td:nth-child(2)').removeClass('fixed-header-left');
        $('.row-0').children('td:nth-child(2)').removeClass('fixed-header-left');
    });
    /*end code here*/

    /*delete phase segment series code start here*/
    $('body').on('click', 'li.delete-series', function() {
        
        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = 2;
        var dataArray = Array();
        var index = 0;
        var noofRows = $('.center-div .parent_2_' + myCol).length;
        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);
        bootbox.confirm("Are you sure you want to delete this series?", function(confirmed) {
            if (confirmed) {
                displayLoader();
                $('.center-div .col-' + myCol).prev('td').nextAll('td').children("span").parent('td').remove();
                $('.center-div .col-' + myCol).prev('td').nextAll('td').children("div").parent('td').remove();

                var maincounts = 0;
                var count = 0;
                $(".center-div .fixed-left-column tr").each(function(i, v) {
                    ++maincounts;
                    if (maincounts >= 3) {
                        $(this).find('td').each(function(i, v) {
                            if ($(this).find('.custom-node').length > 0) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            $(this).remove()
                        } else {
                            count = 0;
                        }
                    }

                });

                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];
                    var count = 0;
                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {


                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;

                        });
                    });

                });
                DeleteManifest();
                $.post(domainUrl + 'grid/deletePhase', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow

                }, responceCreatePhase, 'HTML');
            }
        });
        $('.row-1').children('td:nth-child(2)').removeClass('fixed-header-left');
        $('.row-0').children('td:nth-child(2)').removeClass('fixed-header-left');
    });

    $('body').on('click', 'li.del-segment', function() {

        if ($(this).find('a').hasClass('disabled')) {
            return false;
        }

        var $_this = $(this);

        bootbox.confirm("Are you sure you want to delete this?", function(confirmed) {
            if (confirmed) {


                var addtdWrapper = $_this.closest('td');
                var addtrWrapper = $(addtdWrapper).closest('tr');
                var addtableWrapper = $(addtrWrapper).closest('table');
                var myCol = $(addtdWrapper).index();
                var myRow = $(addtrWrapper).index();
                var lastColumn = $(addtrWrapper).find('td').not(':empty').last().index();

                parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
                    return v.indexOf('parent_') === 0;
                }).join();

                var noofRows = $('.center-div .' + parentName).length;
                var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);
                displayLoader();




                if ($_this.closest('td').prev().hasClass('blank')) {
                    $('.cell_' + lastRow + '_0').closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(myRow) - parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });
                } else {
                    $_this.closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(lastRow) + parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });
                }
                var i, j;
                for (i = myRow; i <= lastRow; i++) {
                    for (j = myCol; j <= lastColumn; j++) {
                        $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                    }
                }

                var dataArray = Array();
                var index = 0;
                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];


                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;

                        });
                    });

                });
                DeleteManifest();
                $.post(domainUrl + 'grid/deletePhase', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow,
                    'lastRow': lastRow,
                    'lastColumn': lastColumn
                }, responceCreatePhase, 'HTML');
            }
        });
    });

    /*function here to use delete operation segment*/
    $('body').on('click', 'li.del-operation-segment', function() {

        if ($(this).find('a').hasClass('disabled')) {
            return false;
        }

        var $_this = $(this);

        bootbox.confirm("Are you sure you want to delete this?", function(confirmed) {

            if (confirmed) {

                displayLoader();
                var addtdWrapper = $_this.closest('td');
                var addtrWrapper = $(addtdWrapper).closest('tr');
                var addtableWrapper = $(addtrWrapper).closest('table');
                var myCol = $(addtdWrapper).index();
                var myRow = $(addtrWrapper).index();
                var lastColumn = $(addtrWrapper).find('td').not(':empty').last().index();

                parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
                    return v.indexOf('parent_') === 0;
                }).join();



                var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;
                var nextRow = parseInt(myRow) + parseInt(currentLength);
                var preCol = parseInt(myCol) - parseInt(1);
                var openextRow = parseInt(nextRow) - parseInt(1);
                var findBlankTd = $('.center-div .fixed-left-column tr').eq(parseInt(myRow) - 1).children('td.col-' + myCol).hasClass('blankRowTd');
                var checkoperationLength = $('.center-div .parent_' + parseInt(nextRow) + '_' + myCol).length;
                var destructorVal = $('.center-div .parent_' + openextRow + '_' + preCol + ' > div.creation-node').find('.col-text > span:first').attr('class');
                var i, j;
                var myassignCol = '';

                var noofRows = $('.center-div .' + parentName).length;

                if (findBlankTd && destructorVal == 'destructure') {

                    var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);
                } else {

                    var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);
                }

                if ($_this.closest('td').prev().hasClass('blank')) {
                    $('.cell_' + lastRow + '_0').closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(myRow) - parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });

                } else {
                    $_this.closest('tr').find("td").not('td:first').each(function() {
                        if ($(this).index() < myCol) {
                            col = parseInt(lastRow) + parseInt(1);
                            $('.center-div .cell_' + col + '_' + $(this).index()).html($(this).html());
                        }
                    });
                }

                if (findBlankTd && destructorVal == 'destructure') {

                    if ($_this.closest('tr').prev('tr').hasClass('blankRow')) {

                        for (i = parseInt(myRow) - 1; i <= parseInt(lastRow); i++) {
                            for (j = myCol; j <= parseInt(lastColumn) + 1; j++) {
                                $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                            }

                        }

                    }
                    myassignCol = parseInt(myCol) - 1;
                } else if (findBlankTd == true && destructorVal == 'undefined' && checkoperationLength < 1) {
                    myassignCol = '';
                    for (i = parseInt(myRow) - 1; i <= parseInt(lastRow); i++) {
                        for (j = myCol; j <= parseInt(lastColumn) + 1; j++) {
                            $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                        }

                    }
                } else {
                    myassignCol = '';
                    for (i = parseInt(myRow); i <= lastRow; i++) {
                        for (j = myCol; j <= lastColumn; j++) {
                            $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                        }

                    }
                }



                var dataArray = Array();
                var index = 0;
                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];

                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;

                        });
                    });

                });



                $.post(domainUrl + 'grid/deleteOperation', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow,
                    'lastRow': lastRow,
                    'lastColumn': lastColumn,
                    'myassignCol': myassignCol
                }, responceCreateOperation, 'HTML');

            }
        });
    });

    /*Show grid on click*/
    $('body').on('click', '.add-panels', function() {
        $(this).find('.node-white-circle').addClass('node-white-circle-expanded');

        displayLoader();

        setGridWidth(selectedGridId);
        setTableWidth();
        //Add new tab code start    


        var initialWidth = 0;
        var tabIndex = 0;
        var midWidth = $("#center-screen").width();

        if ((calculativeWidth + 113 >= midWidth)) {
            // imageFlag = true;
            if ($(".entr-center-tab ul").find('.detailNodeIcon').length == 0) {

                var snippet = '<div class="detailNodeIcon" ><span class="rightNode1Icon"><img src="' + domainUrl + '/public/img/tab-arrow.png"></a></div>'
                $(snippet).appendTo(".entr-center-tab ul");
            } else {
                $('.detailNodeIcon').show();
            }
            calculativeWidth = 0;
            $('.tab-item').each(function(i, v) {
                calculativeWidth += $(v).width();
                if (calculativeWidth + 113 >= midWidth) {
                    $(this).hide();
                }
            });
        }
        //imageFlag = false;
        tabIndex = "tabIndex_" + new Date().getTime().toString();
        $('.entr-center-tab ul li a').each(function(i, v) {
            $(this).removeClass("active").find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
        });

        var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="Undefined" class="tab-item" tab-index = ' + tabIndex + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">Undefined</span> <span class="cross-tab fa fa-times"></span> </a></li>';
        $(".entr-center-tab ul").prepend(tabSnippet);


        $(".DropDownTabList ul li").removeClass('active');
        var snippett = '<li tab-index = ' + tabIndex + ' class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">Undefined</span></li>';
        $(".DropDownTabList ul").prepend(snippett);

        calculativeWidth = 0;
        $('.tab-item').each(function(i, v) {
            calculativeWidth += $(v).width();
        });

        $('.grid-div').each(function(i, v) {
            $(this).removeClass('center-div');
        });

        if ($(this).hasClass('Grid-process-panel')) {
            $('.center-wrap.modes').show();
            $('.center-wrap.coursemodes').hide();
            $.post(domainUrl + 'grid', {
                'type': 'mainPage'
            }, responceGridButton, 'HTML');
        } else if ($(this).hasClass('Grid-accounts-panel')) {
            $('.center-wrap.modes').show();
            $('.center-wrap.coursemodes').hide();
            $.post(domainUrl + 'accounts', {
                'type': 'mainPage'
            }, responceAccountingGridButton, 'HTML');

        } else if ($(this).hasClass('Grid-association-panel')) {
            $('.center-wrap.modes').show();
            $('.center-wrap.coursemodes').hide();
            $.post(domainUrl + 'associations', {
                'type': 'mainPage'
            }, responceAssociationGridButton, 'HTML');

        } else if ($(this).hasClass('Course-association-panel')) {

            $('.center-wrap.modes').hide();
            $('.center-wrap.coursemodes').show();

            $.post(domainUrl + 'courses', {
                'type': 'mainPage'
            }, responceGridButton, 'HTML');

        }

        $('.center-div').scrollLeft(0);
    });

    $('body').on('click', '.dashboard-panel', function() {
        $('.center-wrap.modes').show();
        $('.center-wrap.coursemodes').hide();
        $("#dashboard_item").remove();
        var tabSnippet = '<li id="dashboard_item" data-toggle="tooltip" data-placement="bottom"  data-original-title="Dashboard" class="tab-item" tab-index = "tabIndex_0_0_7"> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">Dashbo...</span> <span class="cross-tab fa fa-times"></span> </a></li>';
        $(".entr-center-tab ul").prepend(tabSnippet);
        $.post(domainUrl + 'dashboard', {
            'type': 'mainPage'
        }, responceDashboardButton, 'HTML');
        $(".DropDownTabList ul li").removeClass('active');
        var snippett = '<li tab-index = "tabIndex_0_0_7"  class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">Dashboard</span></li>';
        $(".DropDownTabList ul").prepend(snippett);

    });

    $('body').on('click', '.courseboard-panel', function() {
        $('.center-wrap.modes').show();
        $('.center-wrap.coursemodes').hide();
        $("#courseboard_item").remove();
        var tabSnippet = '<li id="courseboard_item" data-toggle="tooltip" data-placement="bottom"  data-original-title="Courseboard" class="tab-item" tab-index = "tabIndex_0_0_8"> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">Course...</span> <span class="cross-tab fa fa-times"></span> </a></li>';
        $(".entr-center-tab ul").prepend(tabSnippet);
        $.post(domainUrl + 'courseboard', {
            'type': 'mainPage'
        }, responceCourseboardButton, 'HTML');
        $(".DropDownTabList ul li").removeClass('active');
        var snippett = '<li tab-index = "tabIndex_0_0_8"  class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">Courseboard</span></li>';
        $(".DropDownTabList ul").prepend(snippett);

    });


    /*collapse and Expand*/
    $('body').on('dblclick', '.center-div .col-head', function(e) {
        $('.center-div  td').removeClass('row-selected');

        // $('.center-div.process-grid .fTHLC-outer-wrapper').css({
        //         'paddingLeft': 103
        //     });

        $('.center-div  td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
        
        if($('#operationPaneFlyout').hasClass('in')){
        }
        else{
             setTableWidth();
        }
        var tdWrapper = $(this).parent('td, th'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        var rowFlag = 0;
        $('.center-div  .add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').removeClass('show');


        var colFlag = 0;
        $('.center-div  td').each(function(index) {

            if (index === myCol) {
                if ($('.center-div .col-' + myCol).hasClass("collapse")) {
                    $('.center-div .col-' + myCol).removeClass("collapse");
                    $('.center-div .col-' + myCol).find('i').removeClass("rotate");

                    $('.center-div .col-' + myCol).nextAll('th').each(function(i, v) {
                        var setleftpos = parseInt($(v).css('left'));
                        $(v).css('left', setleftpos + 75);
                    });

                    if (myCol == 9) {
                        $('.center-div .col-9 span.col-node-text').each(function(i, v) {
                            if ($(this).hasClass('col-node-Actor-Perspective')) {

                            }
                        });
                    }

                } else {
                    $('.center-div .col-' + myCol).addClass("collapse");
                    $(".center-div .fixed-left-column").width("+75");

                    $('.center-div .col-' + myCol).find('i').addClass("rotate");

                    $('.center-div .col-' + myCol).nextAll('th').each(function(i, v) {
                        var setleftpos = parseInt($(v).css('left'));
                        $(v).css('left', setleftpos - 75);
                    });



                }
            }

            colFlag++;
        });
        rowFlag++;




        if ($('.center-div .col-' + myCol).hasClass('collapse')) {
            if ($('.center-div .row-2 .col-' + myCol + ' span').hasClass('col-node-text custom-node') || $('.center-div .row-3 .col-' + myCol + ' span').hasClass('col-node-text custom-node')) {

                $('.center-div .col-' + myCol).find('span.custom-node.col-node-text').each(function(i, v) {

                    wordcnt = $(this).attr('placeholder');
                    if (wordcnt == undefined) {

                    } else {
                        showchr = wordcnt.substr(0, 2);
                        $(this).text(showchr + '...');
                    }

                    if ($(this).hasClass("col-node-Actor-Perspective")) {
                        $(".col-node-Actor-Perspective").css({

                            'position': 'absolute',
                            'left': '27px'
                        });
                        //  $(".center-div.manifest tr td:nth-child(10),.center-div.manifest tr th:nth-child(10)").css('cssText', 'width:76px !important;');
                    }

                });
            } else {
                $('.center-div .col-' + myCol).find('input.custom-node').each(function(i, v) {

                    wordcnt     = $(this).attr('placeholder');
                    inputvalue  = $(this).val();

                    $(this).attr('colValue', inputvalue);
                    
                    /* commented by divya
                    * On Date: 8th Feb 2016
                    */
                    //$(this).val(showchr + '...');

                    /*if (inputvalue == "") {
                        $(this).attr('colValue', wordcnt);
                    } else {
                        $(this).attr('colValue', inputvalue);
                    }
                    showchr = wordcnt.substr(0, 2);
                    $(this).attr('placeholder', showchr + '...');
                    if (inputvalue != "") {
                        $(this).val(showchr + '...');
                    }*/

                    /*
                    Modified by divya
                    On Date: 8th Feb 2016
                    */
                    /*
                    * Commented By Divya RAjput
                    * ON date: 27th April 2016

                    var textaltvalue = $.trim($(this).attr('alt'));
                    if(textaltvalue != ''){
                        wordcnt = textaltvalue;
                    }else{
                        wordcnt = '';                       
                    }

                    inputvalue = $.trim($(this).val());

                    if (inputvalue == "") {
                        $(this).attr('colValue', wordcnt);
                    } else {
                        $(this).attr('colValue', inputvalue);
                    }
                    showchr = wordcnt.substr(0, 2);
                    $(this).attr('placeholder', showchr + '...');
                    if (inputvalue != "") {
                        $(this).val(showchr + '...');
                    }*/
                    /*End Here*/

                });
            }
        } else {

            if ($('.center-div .row-2 .col-' + myCol + ' span').hasClass('col-node-text custom-node') || $('.center-div .row-3 .col-' + myCol + ' span').hasClass('col-node-text custom-node')) {
                $('.center-div .col-' + myCol).find('span.custom-node').each(function(i, v) {
                    var Value = $(this).attr('placeholder');
                    $(this).text(Value);
                });
            } else {
                $('.center-div .col-' + myCol).find('input.custom-node').each(function(i, v) {
                    
                    /*Commented By Divya Rajput
                    *On Date: 8th Feb 2015*/
                    /*var colValue = $(this).attr('colvalue');
                    $(this).attr('placeholder', colValue);
                    $(this).val(colValue);*/


                    /*Modified By Divya Rajput
                    *On Date: 8th Feb 2015*/
                    /*
                    * Commented By Divya Rajput
                    * ON date: 27th April 2016
                    var colValue = $(this).attr('colvalue');
                    var altValue = $(this).attr('value');
                    $(this).attr('placeholder', colValue);
                    $(this).val(altValue);*/
                    /*End Here*/
                });
            }

        }
        fixCollapseTable();

        if ($('.center-div .col-' + myCol).hasClass('collapse')) {
            $('.center-div .col-' + myCol).each(function(i, v) {
                $(this).find('.custom-node').attr("readonly", 'true');
            });

        } else {
            $('.center-div .col-' + myCol).each(function(i, v) {
                $(this).find('.custom-node').removeAttr("readonly");
            });
        }

    });

    $('body').on('dblclick', '.center-div .col-1 .col-head', function(e) {

        $('i.segment').removeClass('show');

        if ($('.center-div .col-1').hasClass('collapse')) {

            $('.center-div .fTHLC-outer-wrapper').css({
                'paddingLeft': 73
            });

            $('.center-div .fixed-top-header').css({
                'marginLeft': 0
            });
            $('.center-div.association-grid .fTHLC-outer-wrapper').css({
                'paddingLeft': 73
            });
            $('.center-div .association-grid .fixed-top-header').css({
                'marginLeft': 0
            });
            $('.center-div.manifest .fTHLC-outer-wrapper').css({
                'paddingLeft': 75
            });
        } else {

            $('.center-div .fTHLC-outer-wrapper').css({
                'paddingLeft': 172
            });
            $('.center-div .fixed-top-header').css({
                'marginLeft': 99
            });
            $('.center-div.association-grid .fTHLC-outer-wrapper').css({
                'paddingLeft': 172
            });
            $('.center-div .fixed-top-header .fixed-top-header').css({
                'marginLeft': 99
            });
            $('.center-div.manifest .fTHLC-outer-wrapper').css({
                'paddingLeft': 174
            });

        }

    });

    $('body').on('click', '.center-div .add-phase-segment', function(event) {

        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = 2;


        var phaseLength = $(this).closest('td').nextAll('td').find('.add-phase-segment').length;
        var operationLength = $(this).closest('td').nextAll('td').find('.add-operation').length;
        var addRoleLength = $(this).closest('td').nextAll('td').find('.add-role-segment').length;


        if (phaseLength > 0) {
            $('.col-' + myCol).find('.add-right').addClass('disabled');
            $('.col-' + myCol).find('.popupPhaseClass').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.add-operation-series').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.addPopupPhaseClass').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.add-role-series').closest('li').addClass('disabled');
        } else if (operationLength > 0) {
            $('.col-' + myCol).find('.add-operation-series').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.add-operation-series').closest('li').addClass('disabled');
        } else if (addRoleLength > 0) {
            $('.col-' + myCol).find('.add-right').removeClass('disabled');
            $('.col-' + myCol).find('.add-role-series').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.addPopupPhaseClass').closest('li').removeClass('disabled');
        } else {
            $('.col-' + myCol).find('.add-right').removeClass('disabled');
            $('.col-' + myCol).find('.popupPhaseClass').closest('li').removeClass('disabled');
            $('.col-' + myCol).find('.add-operation-series').closest('li').removeClass('disabled');
            $('.col-' + myCol).find('.addPopupPhaseClass').closest('li').removeClass('disabled');
            $('.col-' + myCol).find('.add-role-series').closest('li').removeClass('disabled');

        }

    });

    $('body').on('click', '.center-div .phase-segment', function(event) {

        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();
        removeClassSave();

        var strCol = myCol;
        var strRow = myRow;
        var obj    = $(this);

        /*code here to show and hide the drop down menu option*/
        $('.parent_2_' + myCol).find('.add-above-segment').addClass('disabled');
        $('.parent_2_' + myCol).find('.add-association-above-segment').addClass('disabled');

        /*end code here*/

        var phaseLength = $(this).closest('td').nextAll('td').find('.phase-segment').length;

        if (phaseLength > 0) {
            $(this).siblings('.add-segment').find('li:nth-child(1)').children('a').addClass('disabled ')
            $(this).siblings('.add-segment').find('.add-above-segment').addClass('no-bg').children('a').addClass('disabled ');
            $(this).siblings('.add-segment').find('.add-below-segment').addClass('no-bg').children('a').addClass('disabled ');

            $(this).siblings('.add-segment').find('.add-association-above-segment').addClass('no-bg').children('a').addClass('disabled ');
            $(this).siblings('.add-segment').find('.add-association-below-segment').addClass('no-bg').children('a').addClass('disabled ');
        }

        
        var myRow = $(addtrWrapper).index();
        var preChiledVal = '';
        var descVal = '';
        var PreParentCol = parseInt(myCol) - 1;
        parentName = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();

        var noofRows = $('.center-div .' + parentName).length;

        var lastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(2);
        var desclastRow = parseInt(myRow) + parseInt(noofRows) - parseInt(1);

        preChiledVal = $('.center-div .parent_' + myRow + '_' + PreParentCol + ' > div.creation-node').find('.col-text > span:first').attr('class');
        descVal = $('.center-div .parent_' + desclastRow + '_' + PreParentCol + ' > div.creation-node').find('.col-text > span:first').attr('class');

        if (preChiledVal == 'creation') {


            $('.add-up-segment').addClass('disabled');
            $('.add-down-segment').removeClass('disabled').children('a').removeClass('disabled');

            $('.add-below-segment').removeClass('disabled').children('a').removeClass('disabled');

            $('.add-asso-up-segment').addClass('disabled');
            $('.add-asso-down-segment').removeClass('disabled').children('a').removeClass('disabled');
        } else if (descVal == 'destructure') {

            $('.add-down-segment').addClass('disabled');
            $('.add-up-segment').removeClass('disabled').children('a').removeClass('disabled');

            $('.add-asso-down-segment').addClass('disabled');
            $('.add-asso-up-segment').removeClass('disabled').children('a').removeClass('disabled');

            $('.add-above-segment').removeClass('disabled').children('a').removeClass('disabled');
            $('.add-association-below-segment').removeClass('disabled').children('a').removeClass('disabled');
        } else {

            $('.add-up-segment').removeClass('disabled').children('a').removeClass('disabled');
            $('.add-down-segment').removeClass('disabled').children('a').removeClass('disabled');


            $('.add-asso-up-segment').removeClass('disabled').children('a').removeClass('disabled');
            $('.add-asso-down-segment').removeClass('disabled').children('a').removeClass('disabled');

            $('.add-above-segment').removeClass('disabled').children('a').removeClass('disabled');
            $('.add-below-segment').removeClass('disabled').children('a').removeClass('disabled');


            $('.add-association-above-segment').removeClass('disabled').children('a').removeClass('disabled');
            $('.add-association-below-segment').removeClass('disabled').children('a').removeClass('disabled');
        }

        if (phaseLength > 0) {
            $('.col-' + myCol).find('.add-segment').find('.add-below-segment').addClass('disabled');
            $('.col-' + myCol).find('.add-segment').find('.add-above-segment').addClass('disabled');

            $('.col-' + myCol).find('.add-segment').find('.add-association-below-segment').addClass('disabled');
            $('.col-' + myCol).find('.add-segment').find('.add-association-above-segment').addClass('disabled');
        } else {
            $('.col-' + myCol).find('.add-segment').find('.add-below-segment').removeClass('disabled');
            $('.col-' + myCol).find('.add-segment').find('.add-above-segment').removeClass('disabled');

            $('.col-' + myCol).find('.add-segment').find('.add-association-below-segment').removeClass('disabled');
            $('.col-' + myCol).find('.add-segment').find('.add-association-above-segment').removeClass('disabled');
        }
        //code added for hide deleted phase segment
        if($('.col-'+myCol).find('.phase-segment').length==1){    
            $(".association-del-segment").hide();
        }
        else{
            $(".association-del-segment").show();
        }

        /*setTimeout('callUns()',100);
        callStrP(strRow,strCol,obj);
        unstrucPhaseMenuDisable(obj);
        stucMenuDisable(obj);*/
    });


    $('body').on('click', '.center-div .add-role-segment', function(event) {

        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();

        var checkProcess = $(".center-div .process-series").length;
        var RoleLength = $(this).closest('td').nextAll('td').find('.add-role-segment').length;

        if (RoleLength > 0) {
            $('.col-' + myCol).find('.add-right').addClass('disabled');
            $('.col-' + myCol).find('.addpopupPhaseClass').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.addRoleSeries').closest('li').addClass('disabled');
            $('.col-' + myCol).find('.add-process-series').closest('li').addClass('disabled');
        } else if (checkProcess > 0) {
            $('.col-' + myCol).find('.add-process-series').closest('li').addClass('disabled');
        } else {
            $('.col-' + myCol).find('.add-process-series').closest('li').removeClass('disabled');
            $('.col-' + myCol).find('.add-right').removeClass('disabled');
            $('.col-' + myCol).find('.addRoleSeries').closest('li').removeClass('disabled');
            $('.col-' + myCol).find('.addpopupPhaseClass').closest('li').removeClass('disabled');

        }

    });

    /*open add-column poup*/
    $('body').on('click', '.center-div .add', function(event) {
        $('.center-div  .col-head').removeClass('dark-gray');
        $('.center-div  i.segment').removeClass('show');
        $('.center-div  .border-right-green').removeClass('border-right-green');
        removeClassSave();
        // $('td').parent('tr').next('tr').children('td.col-1').css({
        //     'border-top': '0'
        // });

        $('.center-div  td').removeClass('row-selected');
        $('.center-div  td,.center-div  th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
        $('.center-div  td,.center-div  th').find('.node-white-circle').removeClass('node-green-circle');
        removeSelection();
        var tdWrapper = $(this).closest('td, th'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        var rowFlag = 0;

        var setLeftoffset = $(this).offset().left;
        var setLeft = 0;

        if (setLeftoffset > 987) {
            setLeft = setLeftoffset - 145;
        } else {
            setLeft = setLeftoffset;
        }
        var settop = $(this).offset().top;



        $('.add-colums').children('.dropdown-menu').css({
            'left': setLeft,
            "top": settop + 16
        });

        var colFlag = 0;
        $('tr.row-0, tr.row-1').find('td, th').each(function(index, event) {

            if (index === myCol) {

                if ($('.add-colums').children('.show-' + myCol).hasClass('show')) {
                    $('i.add').removeClass('show show-icon active');
                    $('.add-colums').children('.show-' + myCol).removeClass('show');

                } else {

                    $('i.add').removeClass('show show-icon active');
                    $(this).find('i.add').addClass('show-icon active');
                    $('.add-colums').children('.dropdown-menu').removeClass('show');

                    $('.add-colums').children('.show-' + myCol).addClass('show');


                    $('.add-colums').children('.show-' + myCol).find('.delete-series').removeClass("disabled");
                    $('.add-colums').children('.show-' + myCol).find('.delete-series a').removeClass("disabled");

                }

                $('.add-segment .dropdown-menu').removeClass('show');
            }


            colFlag++;
        });



        rowFlag++;
        $('.add-check-role').children('ul').removeClass('show');

        event.stopPropagation();
    });

/*comment to stop selection on mouse click on phases and association*/
    /*  $('body').on('click', function(event) {
		var targetClass = $(event.target).hasClass('nextBtn');
        //event.stopPropagation();
        if ($('b').hasClass('fa-angle-down')) {
            //alert(1);

            $('b').removeClass().addClass('fa fa-angle-down noPointer');
            $('.left-manu-bar #drop3').prev().removeClass('blackIcon');
        }

        //$('.left-manu-bar #drop3').addClass('caret');
        if ($('.center-div td').hasClass('segment-node-input')) {

            $('.center-div .bg-green').addClass('bg-green');
            $('.center-div .bg-green-border').addClass('bg-green-border');
            $('.center-div .border-top-green').addClass('border-top-green');
            $('.center-div .border-bottom-green').addClass('border-bottom-green');
            $('.center-div .border-bottom-select').addClass('border-bottom-select');
            $('.center-div .border-green').addClass('border-green');


        } else {

            $('.center-div .add-colums ul.dropdown-menu').removeClass('show');
            $('.center-div i.add').removeClass('show show-icon');
            $('.center-div i.add').removeClass('active');
            $('.center-div .segment-count').hide();
            $('.center-div td').removeClass('light-blue');
            $('.center-div .bg-green').removeClass('bg-green');
            $('.center-div .bg-green-border').removeClass('bg-green-border');
            $('.center-div .border-right-green').removeClass('border-right-green');
            $('.center-div .border-top-green').removeClass('border-top-green');
            $('.center-div .border-bottom-green').removeClass('border-bottom-green');
            $('.center-div .border-bottom-select').removeClass('border-bottom-select');
            $('.center-div .border-green').removeClass('border-green');
            $('.center-div td').find('.node-green-circle').removeClass('node-green-circle');
            $('.center-div th').find('.node-green-circle').removeClass('node-green-circle');
            $('.center-div .col-head').removeClass('dark-gray');
            $('.center-div .border-right-green').removeClass('border-right-green');
            // $('span.icons').removeClass('showing');

            $('.center-div td').removeClass('row-selected');
            $('.center-div td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
            // $('td').parent('tr').next('tr').children('td.col-1').css({
            //     'border-top': '0'
            // });
            $('.center-div').find('.add-check-role').children('ul').removeClass('show');
            $('.center-div').find('.add-check-domain').children('ul').removeClass('show');
            $('#account-table td, #account-table th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
            $('#account-table td, #account-table th').find('.node-white-circle').removeClass('node-green-circle');
            $('.hideMeAction').hide();
            $('.account-head-node .icons.showing').removeClass('showing');

        }

    }); */

    /*open segment poup*/
    $('body').on('click', '.segment', function(event) {
        $('.col-head').removeClass('dark-gray');
        $('.border-right-green').removeClass('border-right-green');
        $('td').removeClass('row-selected');
        $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
        $('td,th').find('.node-white-circle').removeClass('node-green-circle');
        $('td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
        var setTopPos = $(this).offset().top;
        var setLeftoffset = $(this).offset().left;
        var setLeftPos = 0;
        var dropdownHeight = $(this).closest('td').find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').height();
        if (setLeftoffset > 980) {

            setLeftPos = setLeftoffset - 145;
        } else {
            setLeftPos = setLeftoffset;
        }

        if (setTopPos > 450) {
            setTop = setTopPos - dropdownHeight - 15;

        } else {
            setTop = setTopPos;

        }

        $('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').css({
            'left': setLeftPos,
            "top": setTop + 15
        });
        removeSelection();
        $('.add-colums').children('.dropdown-menu').removeClass('show');
        $('.segment').removeClass('show');
        if ($(this).closest('td').find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').hasClass('show')) {
            $(this).addClass('active show');
            $(this).closest('td').find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').removeClass('show');
        } else {
            $('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').removeClass('show');
            $(this).addClass('active show');
            $(this).closest('td').find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').addClass('show');
        }

        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();


        var countSubOpt = $('.center-div .fixed-left-column .row' + myRow).find('.col-' + myCol).next('td').next('td').find('.operation-delete').length;

        if (countSubOpt > 0) {

            //  $('.center-div .fixed-left-column .col-'+myCol).find('.add-sub-more-operation').addClass('disabled');
            $('.center-div .fixed-left-column .col-' + myCol).find('.dropdown-menu.show .add-suboperaton-segment').addClass('disabled');
        } else {
            $('.center-div .fixed-left-column .col-' + myCol).find('.dropdown-menu.show .add-suboperaton-segment').removeClass('disabled');
            //  $('.center-div .fixed-left-column .col-'+myCol).find('.add-sub-more-operation').removeClass('disabled');
        }

        event.stopPropagation();

    });

    $('body').on('click', '.add-segment', function(event) {

        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();

        var precol = parseInt(myCol) - parseInt(1);
        var prerow = parseInt(myRow) - parseInt(1);

        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;
        var nextRow = parseInt(myRow) + parseInt(currentLength);


        var findBlankTd = $('.center-div .fixed-left-column tr').eq(nextRow).children('td.col-' + myCol).hasClass('blankRowTd');

        var preChiledVal = $('.center-div .parent_' + myRow + '_' + precol + ' > div.creation-node').find('.col-text > span:first').attr('class');

        var nextLength = $('.center-div .parent_' + parseInt(nextRow) + '_' + myCol).length;
        var prevLength = $('.center-div .parent_' + parseInt(prerow) + '_' + myCol).length;



        if (preChiledVal == 'creation' && findBlankTd) {

            $('.center-div .col-' + myCol).find('.del-operation-segment').closest('li').addClass('disabled');
        } else if (preChiledVal == 'creation' && (prevLength == 0)) {

            $('.center-div .col-' + myCol).find('.del-operation-segment').closest('li').addClass('disabled');
        } else {

            $('.center-div .col-' + myCol).find('.del-operation-segment').closest('li').removeClass('disabled');
        }

        event.stopPropagation();
    });

    $('body').click(function() {
       // $('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').removeClass('show');
        $('i.segment').hide();
        $('i.segment').removeClass('active show');
        $('.row-green-border').removeClass('row-green-border');        
        $('.row-selected').removeClass('row-selected');
        $('.border-top-green').removeClass('border-top-green');
        $('.border-right-green').removeClass('border-right-green');
        $('.dark-gray').removeClass('dark-gray');
        removeSelection();
        $('#main #node-wrapper li.node-selected').removeClass('node-selected');

    });

    showStatusDrp();


    /*code start here to move segment up */
    $('body').on('click', '.add-up-segment', function() {
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        moveSegment(myRow, myCol, 'UP');
    });

    /*code start here to move segment down */
    $('body').on('click', '.add-down-segment', function() {
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        moveSegment(myRow, myCol, 'DOWN');
    });


    /*code start here for association move up and down*/

    /*code start here to move segment up */
    $('body').on('click', '.add-asso-up-segment', function() {
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();

        moveAssoSegment(myRow, myCol, 'UP');
    });

    /*code start here to move segment down */
    $('body').on('click', '.add-asso-down-segment', function() {
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();

        moveAssoSegment(myRow, myCol, 'DOWN');
    });


    /*end code here*/


    $('body').on('click', '.center-div .add-below-segment', function() {

        $(this).closest('.dropdown-menu').removeClass('show');
        var NoOfRole = 0;
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        nonSequence = [];
        /*code here to used check the non sequence blank row*/
        $(".center-div .blankRow").each(function() {

            nonSequence.push($(this).index());
        });

        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);

        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;

        var domaincount = $(".center-div .fixed-left-column .domain-count").length;

        addSegment(myRow, myCol, 'Below', NoOfRole, nonSequence, currentLength, domaincount);
    });




    /*add above phase segment code start here*/
    $('body').on('click', '.center-div .add-above-segment', function() {

        $(this).closest('.dropdown-menu').removeClass('show');
        var NoOfRole = 0;
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        nonSequence = [];
        /*code here to used check the non sequence blank row*/
        $(".center-div .blankRow").each(function() {

            nonSequence.push($(this).index());
        });

        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;

        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;

        addSegment(myRow, myCol, 'Above', NoOfRole, nonSequence, currentLength, domaincount);
    });
    /*end code here*/

    /*add above association phase segment code start here*/
    $('body').on('click', '.center-div .add-association-above-segment', function() {

        $(this).closest('.dropdown-menu').removeClass('show');
        var NoOfRole = 0;
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();

        //var NoOfProcess = $(".center-div .fixed-left-column .Process").length;
        var NoOfProcess = $(".center-div .fixed-left-column").find('.Process').length;
            checkrole = $(".center-div .fixed-left-column .addAssociationRole").length;

        addAssociationSegment(myRow, myCol, 'Above', NoOfProcess, checkrole);
    });


    $('body').on('click', '.center-div .add-association-below-segment', function() {

        $(this).closest('.dropdown-menu').removeClass('show');
        var NoOfRole = 0;
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //var NoOfProcess = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.process-text').length;
        var NoOfProcess = $(".center-div .fixed-left-column .Process").length;
        checkrole = $(".center-div .fixed-left-column .addAssociationRole").length
        addAssociationSegment(myRow, myCol, 'Below', NoOfProcess, checkrole);


    });

    /*end code here*/

    /*add above segment code here*/

    $('body').on('click', '.center-div .add-below-non-sequence-operation-segment', function() {
        var NoOfRole = 0;
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //NoOfRole = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.new-Role').length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;
        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;
        addOperationSegment(myRow, myCol, 'Below', NoOfRole, 'NonSquential', domaincount, currentLength);

    });

    $('body').on('click', '.center-div .add-below-operation-segment', function() {
        var NoOfRole = 0;
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //NoOfRole = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.new-Role').length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;
        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;
        addOperationSegment(myRow, myCol, 'Below', NoOfRole, '', domaincount, currentLength);

    });

    /*add below segment code here*/
    $('body').on('click', '.center-div .add-above-operation-segment', function() {
        var NoOfRole = 0;
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //NoOfRole = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.new-Role').length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;
        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;

        var findBlankTd = $('.center-div .fixed-left-column tr').eq(parseInt(myRow) - 1).children('td.col-' + myCol).hasClass('blankRowTd');
        addOperationSegment(myRow, myCol, 'Above', NoOfRole, '', domaincount, currentLength, findBlankTd);

    });


    /*add below segment code here*/
    $('body').on('click', '.center-div .add-logic-operation-segment', function() {
        var NoOfRole = 0;
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //NoOfRole = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.new-Role').length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;

        if (domaincount == 0) {
            var lastColumn = $(this).closest('td').closest('tr').children('td').length;
            firstLogicDomainAfter(myRow, parseInt(lastColumn) - parseInt(3), 'Below', NoOfRole, '', domaincount, currentLength, lastColumn, myCol);

        } else {
            var lastColumn = $(trWrapper).find('td').not(':empty').last().index();
            addLogicOperationSegment(myRow, myCol, 'Below', NoOfRole, '', domaincount, currentLength, lastColumn);
        }

    });

    /*code start here to add non - sequence logic operation segment*/
    $('body').on('click', '.center-div .add-below-logic-non-sequence-operation-segment', function() {
        var NoOfRole = 0;
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();
        //NoOfRole = $('.center-div .parent_' + myRow + '_' + myCol).nextAll('td').find('.new-Role').length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        NoOfRole = parseInt(rolecount);
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;
        var currentLength = $('.center-div .parent_' + myRow + '_' + myCol).length;

        if (domaincount == 0) {
            var lastColumn = $(this).closest('td').closest('tr').children('td').length;
            firstAddDomainAfterLogic(myRow, parseInt(lastColumn) - parseInt(3), 'Below', NoOfRole, 'NonSquential', domaincount, currentLength, lastColumn, myCol);

        } else {
            var lastColumn = $(trWrapper).find('td').not(':empty').last().index();
            addLogicOperationSegment(myRow, myCol, 'Below', NoOfRole, 'NonSquential', domaincount, currentLength, lastColumn);
        }

    });

    /*end code here*/


    /*code start here to show and hide the domain option dropdown menu */
    $('body').on('click', '.center-div .check-domain', function(event) {
        var roleLength = $('.center-div .fixed-top-header').find('.check-domain').length;
        // var roleindex = $(this).index();
        var setLeftoffset = $(this).siblings('.add-check-domain').offset().left;
        var settop = $(this).siblings('.add-check-domain').offset().top;
        // roleindex = parseInt(roleindex) - 1;
        var setLeft = 0;

        if (setLeftoffset > 987) {
            setLeft = setLeftoffset - 145;
        } else {
            setLeft = setLeftoffset;
        }
        $('.center-div .add-check-domain').children('.dropdown-menu').css({
            'left': setLeft,
            "top": settop
        });
        if (roleLength > 1) {
            $(this).parent().find('.add-check-domain').find('li.deleteSegmentRole').removeClass('disabled')
        } else {
            $(this).parent().find('.add-check-domain').find('li.deleteSegmentRole').addClass('disabled')
        }

        if ($(this).parent().find('.add-check-domain').children('ul').hasClass('show')) {

            $(this).parent().find('.add-check-domain').children('ul').removeClass('show');
        } else {
            $('.center-div .add-check-domain').children('ul').removeClass('show');
            $(this).parent().find('.add-check-domain').children('ul').addClass('show');
            $(this).parent().find('.add-check-domain').children('ul').find('.addSegmentRole').parent().addClass("disabled");
        }

        $('.add-segment .dropdown-menu').removeClass('show');

        event.stopPropagation();
    });

    /*code start here to show and hide the role option dropdown menu */
    $('body').on('click', '.center-div .check-role', function(event) {
        var roleLength = $('.center-div .fixed-top-header').find('.check-role').length;
        // var roleindex = $(this).index();
        var setLeftoffset = $(this).siblings('.add-check-role').offset().left;
        var settop = $(this).siblings('.add-check-role').offset().top;
        //   roleindex = parseInt(roleindex) - 1;
        var setLeft = 0;

        if (setLeftoffset > 987) {
            setLeft = setLeftoffset - 145;
        } else {
            setLeft = setLeftoffset;
        }
        $('.center-div .add-check-role').children('.dropdown-menu').css({
            'left': setLeft,
            "top": settop
        });
        if (roleLength > 1) {
            $(this).parent().find('.add-check-role').find('li.deleteSegmentRole').removeClass('disabled')
        } else {
            $(this).parent().find('.add-check-role').find('li.deleteSegmentRole').addClass('disabled')
        }

        if ($(this).parent().find('.add-check-role').children('ul').hasClass('show')) {
            $(this).parent().find('.add-check-role').children('ul').removeClass('show');

        } else {
            $('.center-div').find('.add-check-role').children('ul').removeClass('show');
            $('.center-div').find('.add-check-role').children('ul').find('li').removeClass('disabled')
            $(this).parent().find('.add-check-role').children('ul').addClass('show');
            if ($(this).parent().next().find('.add').hasClass('check-role')) {
                $(this).parent().find('.add-check-role').children('ul').find('.addDomain').parent().addClass("disabled");
            }
        }

        $('.add-segment .dropdown-menu').removeClass('show');
        event.stopPropagation();
    });


    /*add Operation Series*/
    $('body').on('click', '.add-operation-series', function() {
        displayLoader();
        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        myRow = $(addtrWrapper).index();
        var dataArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
		/*code for navigation*/
		if($('#course-path-number').hasClass('On')){
			gridNavigation.changeColor();
        }
		
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                $(this).addClass("operation");
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });
        });



        $.post(domainUrl + 'grid/createOperation', {
            'data': dataArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment
        }, responceCreateOperation, 'HTML');

    });


    /*add Roles to the right*/
    $('body').on('click', '.current-div .add-Role', function() {
        var addtdWrapper = $(this).closest('td'),
            addtrWrapper = $(addtdWrapper).closest('tr'),
            addtableWrapper = $(addtrWrapper).closest('table'),
            myCol = $(addtdWrapper).index();
        var rowFlag = 0;
        var firstrowFlag = 0;
        $(addtableWrapper).find('tr').each(function() {
            var trObj = $(this);
            var colFlag = 0;
            $(trObj).find('td').each(function(index) {
                if (index === myCol) {

                    $(this);
                    $(this).find('i.add').removeClass('active');
                    $(this).find('.add-colums ul.dropdown-menu').removeClass('show');

                    var tdclone = $(this).clone();
                    var appendTd = $(this);
                    $(tdclone).insertAfter(appendTd);
                    $(tdclone).find('.add-colums ul.dropdown-menu').removeClass('show');
                    $(tdclone).find('i.add').hide();
                    $(tdclone).find('i.add').removeClass('active');

                    $(tdclone).find('.add-colums ul li a').removeClass('disabled');
                    $(tdclone).find('.add-colums ul li').removeClass('no-bg');
                }
                colFlag++;
            });
            rowFlag++;
        });

        $(addtableWrapper).find('tr:first td').each(function() {
            if (firstrowFlag > 0) {
                $(this).find('.top-col').html(firstrowFlag);
            }
            firstrowFlag++;
        });
    });




    $('body').on('click', '.popupPhaseClass', function() {
        var addtdWrapper = $(this).closest('td');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var preNoSegment = 0;
		/*code for navigation*/
		if($('#course-path-number').hasClass('On')){
			gridNavigation.changeColor();
        }
		
		$(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];

            $rows.each(function(row, v) {
                $(this).find("td").each(function(cell, v) {
                    if (row >= 2 && myCol == cell) {
                        str = $(this).text();
                        if (str.toLowerCase().indexOf("add segment") > 0) {
                            preNoSegment++;
                        }
                    }
                });
            });
        });


        checkoperation = $('.center-div .operation-event').children('.segment-node').parent('td').length;
        if (checkoperation != '') {
            $.post(domainUrl + 'grid/index', {
                'type': 'phase',
                'preNoSegment': preNoSegment,
                'columnNumber': myCol,
                'confirm': 'YES'
            }, responcePhase, 'HTML');
        } else {
            $.post(domainUrl + 'grid/index', {
                'type': 'phase',
                'preNoSegment': preNoSegment,
                'columnNumber': myCol,
                'confirm': 'NO'
            }, responcePhase, 'HTML');
        }

    });


    $('body').on('click', '.col-head', function(event) {
        
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
        $('.center-div  i.segment').removeClass('show');
        $('.center-div .add-col-wrap ul.dropdown-menu').removeClass('show');
        $('.center-div .border-right-green').removeClass('border-right-green');
        $('.center-div .segment-node-input').removeClass('segment-node-input');


        // $('td').parent('tr').next('tr').children('td.col-1').css({
        //     'border-top': '0'
        // });
        $('td').removeClass('row-selected');
        $('td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
        if($('#operationPaneFlyout').hasClass('in')){
          
        }
        else{
             setTableWidth();
        }
        var tdWrapper = $(this).parent('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index(),
            myRow = $(trWrapper).index();

        $('.add-colums ul.dropdown-menu').removeClass('show');
        $('i').removeClass('active');
        $('.col-head').removeClass('dark-gray');

        if ($(this).closest('td').hasClass('border-green')) {
            removeSegSelection();
        } else {
            $(tableWrapper).find('tr').each(function() {
                var trObj = $(this);
                var colFlag = 0;
                $(trObj).find('td').each(function(index) {
                    if (index === myCol) {
                        $('td.col-' + myCol).children('.col-head').addClass('dark-gray');
                        $('.creation-bg').removeClass('bg-green');
                        $('td.col-' + myCol).siblings('td').removeClass('border-green bg-green');
                        $('td.col-' + myCol).not(':empty').prev('td.border-right').removeClass('border-right-green');
                        $('.border-right-green').removeClass('border-right-green');
                        $('.border-top-green').removeClass('border-top-green');
                        $('.border-bottom-select').removeClass('border-bottom-select');
                        $('.border-bottom-green').removeClass('border-bottom-green');

                        $('td.col-' + myCol).siblings('td').find('.node-white-circle').removeClass('node-green-circle');
                        $('td.col-' + myCol).find('.node-white-circle').addClass('node-green-circle');
                        $('td.col-' + myCol).not(':empty').addClass('border-green bg-green offinator');
                        $('td.col-' + myCol).not(':empty').prev('td.border-right').addClass('border-right-green');
                        $('td.border-bottom.col-' + myCol).addClass('border-bottom-green');
                    }
                });

            });
        }



        $('.center-div .icons').removeClass('showing');
        if (hideNumbering == false) {
            $('.table-count').removeClass('hide');
        }
        event.stopPropagation();
    });

    $('body').on('click', '.center-div .segment-node', function(event) {
        // $('td').parent('tr').next('tr').children('td.col-1').css({
        //     'border-top': '0'
        // });
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
        $('i.segment').removeClass('show');
        $('td').removeClass('row-selected');
        $('td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
        removeClassSave();
        
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index(),
            myRow = $(trWrapper).index();

        $('.add-col-wrap .dropdown-menu').removeClass('show');
        var get = $.grep(this.closest('td').className.split(" "), function(v, i) {
            return v.indexOf('parent') === 0;
        }).join();
        if (get != "") {
            if ($('.center-div .' + get).hasClass('border-green')) {
                //  alert(1)
                //removeSegSelection();
                $('.border-right-green').removeClass('border-right-green');
                $('li.tab-item a.active').find('.tab-node-circle').addClass('node-green-circle');

            } else {
                //alert(2)
                if ($('.center-div .col-7 span.col-node-text').hasClass('col-node-Actor-Perspective')) {
                    $(this).closest('td').addClass('border-top-green');
                }

                removeSegSelection();
                $('.center-div .border-right-green').removeClass('border-right-green');
                $('.center-div .' + get).prev('td.border-right').removeClass('border-right-green');
                $(this).children('.node-white-circle').addClass('node-green-circle');
                $(this).find('input.custom-node').click().focus();
                $('.center-div .' + get).first().addClass('border-top-green');
                $('.center-div .' + get).addClass('border-green bg-green');
                $('.center-div .' + get).prev('td.border-right').addClass('border-right-green');
                $('.center-div .' + get).last().addClass('border-bottom-green');
                // $('.' + get + '.operation1').closest('tr').prev('tr').children('td.operation1').first().addClass('border-bottom-select');
                $(this).closest('tr').prev('tr').children('td').eq(myCol).addClass('border-bottom-select');
                $('.center-div li.tab-item a.active').find('.tab-node-circle').addClass('node-green-circle');
            }
        }


        event.stopPropagation();

    });
    $('body').on('click', '.operation-series .custom-node', function(event) {        
        $('.border-right-green').removeClass('border-right-green');
        removeClassSave();
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
    });

    $('body').on('click', '.center-div .creation-node', function(event) {

        var _self = $(this);
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
        // code for right side static hard code  value  
        if ($(this).find('.custom-node').hasClass('actionNode')) {
            $('.hideMeAction').toggle();
            if ($('.hideMeAction').find('ol').css('display') == "none") {
                $('.hideMeAction').find('ol').css('display', "block");
            }
        }


        $('.hideMeAction .iCheck-helper').click(function() {
            //alert(_self);
            if ($('.hideMeAction .iCheck-helper').prev().prop('checked')) {
                // alert(1);
                var test = $(_self).parent().attr('class');
                var positionCol = test.search("col-");
                var colNumber = test.substr(positionCol, 7);
                var getTheLoopNumber = parseInt(colNumber.split("-")[1]);
                for (var i = 1; i < getTheLoopNumber; i++) {
                    $('.center-div.process-grid .col-' + i).addClass('deactiveBg');
                }
                $('.center-div.process-grid .fTHLC-inner-wrapper').css('overflow', 'hidden');


                $('.courseRO').show();
            } else {
                $('#center-screen tr td').removeClass('deactiveBg');
                $('.center-div.process-grid .fTHLC-inner-wrapper').css('overflow', 'auto');
                $('.courseRO').hide();
            }
        });


        $('.center-div i.segment').removeClass('show');
        $('.center-div .border-right-green').removeClass('border-right-green');
        removeClassSave();
        $('.center-div td').removeClass('row-selected');
        $('.center-div td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');

        // $('td').parent('tr').next('tr').children('td.col-1').css({
        //     'border-top': '0'
        // });
        // if ($(this).hasClass('nodeFlyout')) {
        //     $('#nodeFlyout').modal('show');
        // } else {
       
        // }

        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index(),
            myRow = $(trWrapper).index();

        $('.center-div .add-col-wrap .dropdown-menu').removeClass('show');
        // var get = $.grep(this.closest('td').className.split(" "), function(v, i) {
        //     return v.indexOf('parent') === 0;
        // }).join();

        var get = $(this).find('.custom-node').attr('name');

        if ($(this).closest('td').hasClass('border-green')) {
            //alert("hdvvdv");
            if ($(this).hasClass("nodeFlyout")) {
                if (!$('#nodeFlyout').hasClass('in')) {
                    removeSegSelection();
                }

            } else {
                removeSegSelection();
            }

        } else {

            removeSegSelection();
            $(this).children('.node-white-circle').addClass('node-green-circle');
            $(this).closest('td').addClass('border-top-green border-green border-bottom-green bg-green');
            $(this).parent('td').addClass('border-top-green');
            //   alert($(this).html())
            $(this).closest('tr').prev('tr').children('td').eq(myCol).addClass('border-bottom-select');
			//number selection
			gridNavigation.numberSelection(_self, true)
        }



        event.stopPropagation();
    });
/*grid navigation selection*/
    $('body').on('click', '.center-div .segment-node input.custom-node', function(event) {
       
        $('.gridICon.iconActive').remove();
        $('.grid-dropdown').hide(); 
        $('.center-div .dropdown-menu').each(function(i, v) {
            if ($(this).hasClass('show')) {
                $(this).removeClass('show')
            }
        });

        $('.center-div .row-selected').removeClass('row-selected');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index(),
            myRow = $(trWrapper).index();

        var get = $.grep(this.closest('td').className.split(" "), function(v, i) {
            return v.indexOf('parent') === 0;
        }).join();

        $('.center-div span.icons').removeClass('showing');
        if (hideNumbering == false) {
            $('span.table-count').removeClass('hide');
        }

        $('.center-div i.fa-bars').addClass('segment').removeClass("show");
        $('.center-div .border-right-green').removeClass('border-right-green');
        $('.center-div .dark-gray').removeClass('dark-gray');

        //      if ($('.' + get).hasClass('border-green')) {
        // $(this).parent().children('span.icons').removeClass('showing');
        //          if(hideNumbering == false) {
        //             $(this).parent().children('span.table-count').removeClass('select-count-hide');
        //          }

        //          $(this).parent().parent().children('i.phase-segment').addClass('segment fa fa-bars');
        //          $(this).closest('.segment-node').siblings('i.add-segment').addClass('segment fa fa-bars');

        //          removeSegSelection();
        //          $('li.tab-item a.active').find('.tab-node-circle').addClass('node-green-circle');

        //      } else {

        if (hideNumbering == true) {
            $(this).parent().children('span.table-count').addClass('hide');
        }

        if ($(this).closest('td').hasClass('collapse')) {

            if (hideNumbering == true) {
                $(this).parent().children('span.table-count').addClass('hide');
            } else {
                $(this).parent().children('span.table-count').removeClass('hide');
            }

        } else {
            $(this).parent().children('span.table-count').addClass('hide');
        }

        $(this).parent().children('span.icons').addClass('showing');
        $(this).parent().parent().children('i.phase-segment').removeClass('segment show').css("display", "none");

        $(this).closest('.segment-node').siblings('i.add-segment').removeClass('segment show').css("display", "none");
        removeSegSelection();

        $('.center-div .' + get).first().addClass('segment-node-input border-top-green');
        $('.center-div .' + get).addClass('segment-node-input border-green bg-green');
        $('.center-div .' + get).prev('.border-right').addClass('border-right-green');
        $('.center-div .' + get).last().addClass('segment-node-input border-bottom-green');
        $('.center-div .' + get + '.operation1').closest('tr').prev('tr').children('td.operation1').first().addClass('segment-node-input border-bottom-select');
        $(this).closest('tr').prev('tr').children('td').eq(myCol).addClass('border-bottom-select');
        $(this).closest('.col-text').siblings('.node-white-circle').addClass('segment-node-input node-green-circle');
        $('.center-div li.tab-item a.active').find('.tab-node-circle').addClass('node-green-circle');

        // }
		if($('#course-path-number').hasClass('On')){
			gridNavigation.numberSelection($(this));
		}
        $('.icons i').tooltip();
        $('.center-div .saveIcon,.center-div  .closeIcon').click(function(event) {

            $('.center-div .icons').removeClass('showing');
            if (!$('.show-auto-number').hasClass('hide-gridNumber')) {
                $(this).parent().siblings('.table-count').removeClass('hide');
            }

            $(this).parent().parent().siblings('i.fa-bars').addClass('segment');
            $(this).closest('.segment-node').siblings('i.fa-bars').addClass('segment');

            $('.center-div .border-right-green').removeClass('border-right-green');
            $('.center-div .border-bottom-select').removeClass('border-bottom-select');
            $('.center-div .' + get).first().removeClass('segment-node-input border-top-green');
            $('.center-div .' + get).removeClass('segment-node-input border-green bg-green');
            $('.center-div .' + get).last().removeClass('segment-node-input border-bottom-green');
            $('.center-div .' + get + '.operation1').closest('tr').prev('tr').children('td.operation1').first().removeClass('segment-node-input border-bottom-select');
            $(this).closest('.col-text').siblings('.node-white-circle').removeClass('segment-node-input node-green-circle');
            //$('li.tab-item a.active').find('.tab-node-circle').removeClass('node-green-circle');
            event.stopPropagation();
        });
        var placeValue = "";
        $('.center-div .custom-node').keyup(function(e) {
            /*This was commented before
            * Cooment Removed By Divya 
            * On date: 27th April 2016

            placeValue = $(this).val();
            $(this).attr("Placeholder", placeValue);

            */

            /*
            * MOdified By Divya Rajput 
            * On Date 27th April 2016
            */
            placeValue = $(this).val();
            $(this).attr("colValue", placeValue);
            $(this).attr("value", placeValue);

            /*
            * Commented BY Divya Rajput
            * ON date 27th April 2016
            * to stop data truncation in input text

            placeValue = $.trim($(this).val());
            var textvalue = $.trim($(this).attr('value'));
            
            if(placeValue != ''){
                $(this).attr("alt", placeValue);
            }else if(textvalue != ''){
                $(this).attr("alt", textvalue);
            }else{
                $(this).attr('alt', '');
            }*/
        });

        $('.center-div .dropdown-menu').each(function(i, v) {
            if ($(this).hasClass('show')) {
                $(this).removeClass('show')
            }
        });
        event.stopPropagation();
    });

    $('body').on('click', '.show-auto-number', function(event) {
        //$(this).toggleClass('hide-gridNumber');
        if ($(this).hasClass('hide-gridNumber')) {
            $('.collapse span.table-count').removeClass('hide');
            $(this).removeClass('hide-gridNumber');
            $('.table-count').each(function(i, v) {
                if (!$(this).next().hasClass('showing')) {
                    $(this).removeClass('hide');
                }
            });

            hideNumbering = false;

        } else {
            $(this).addClass('hide-gridNumber');

            $('.collapse span.table-count').addClass('hide');

            $('.table-count').each(function(i, v) {
                if (!$(this).next().hasClass('showing')) {
                    $(this).addClass('hide');
                }
            });
            hideNumbering = true;

        }

        // if($('.center-div .table-count').hasClass('hide')){

        // } else {
        //     //$('.table-count').addClass('hide');

        // }

        $('i').tooltip('hide');
        event.stopPropagation();
    });


    $('body').on('mouseover', '.show-auto-number', function() {

        if ($('.show-auto-number').hasClass('hide-gridNumber')) {
            $('.tooltip-inner').text('Show Course Path Numbering');
        } else {
            $('.tooltip-inner').text('Hide Course Path Numbering');
        }

    });

    $('body').on('mouseover', '.new-Role', function() {

        $(this).addClass('new-role-show');

    });

    $('body').on('mouseover', '.new-Domain', function() {

        $(this).addClass('new-domain-show');

    });

    $('body').on('mouseout', '.new-Role', function() {
        $(this).removeClass('new-role-show');

    });

    $('body').on('mouseout', '.new-Domain', function() {
        $(this).removeClass('new-domain-show');

    });

    // course link  moving the header section
    $('body').on("click", ".center-div .col-head-assoc", function() {

        $('.Grid-association-panel').trigger('click');
        $('.Domain .leftCalss').removeClass('active');
        $("#domainDiv").css("display", "none");
        $('.perspective .leftCalss').addClass('active');
        $("#perspectiveDiv").css("display", "block");
    });

});


// function setModalPos(poupName){
   
    
//         var modalwid        =       $('#'+poupName).find('.modal-content').outerWidth();
//         var modalHig        =       $('#'+poupName).find('.modal-content').outerHeight();
//         var WindowWid       =       $(window).width()/2;
//         var WindowHig       =       $(window).height()/2;

//         var modalWidHalf    =       modalwid/2;
//         var modalHigHalf    =       modalHig/2;
//         $('#'+poupName+'.modal.fade').css({'margin-top':(WindowHig-modalHigHalf),'top':0,'margin-left':(WindowWid-modalWidHalf),'left':0});
//         $('#'+poupName+'.modal.fade.in').css({'margin-top':(WindowHig-modalHigHalf),'top':0,'margin-left':(WindowWid-modalWidHalf),'left':0});


// }

/*code her for seq human and non seq human*/

function firstresponceCreateOperation(d, s) {

    displayLoader();
    var selectedOp2Val = "";

    var selected2 = $("input[type='radio'][name='sub_op2']:checked");
    if (selected2.length > 0) {
        selectedOp2Val = selected2.val();
    }

    var addtdWrapper = $(this).closest('td'),
        addtrWrapper = $(addtdWrapper).closest('tr'),
        addtableWrapper = $(addtrWrapper).closest('table');
    var RoleSereisArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;

    /*code here to used check the non sequence blank row*/

    var suboperationCount = 0;

    suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;

            });
        });

    });

    $.post(domainUrl + 'grid/subOperationSegment', {
        'data': RoleSereisArray,
        'Op2': selectedOp2Val,
        'domaincount': domaincount,
        'rolecount': rolecount,
        'suboperationCount': suboperationCount
    }, responceCreateOperation, 'HTML');

}
/*end code here*/




/*code for logic seq and non logic seq*/

function firstLogicresponceCreateOperation(d, s) {

    displayLoader();
    var selectedOp2Val = "";

    var selected2 = $("input[type='radio'][name='sub_op2']:checked");
    if (selected2.length > 0) {
        selectedOp2Val = selected2.val();
    }

    var addtdWrapper = $(this).closest('td'),
        addtrWrapper = $(addtdWrapper).closest('tr'),
        addtableWrapper = $(addtrWrapper).closest('table');
    var RoleSereisArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;

    /*code here to used check the non sequence blank row*/

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;

            });
        });

    });



    $.post(domainUrl + 'grid/subLogicOperationSegment', {
        'data': RoleSereisArray,
        'Op2': selectedOp2Val,
        'domaincount': domaincount,
        'rolecount': rolecount,


    }, responceCreateOperation, 'HTML');

}
/*end code here*/

/*resonse here to add operation*/
function responceCreateOperation(d, s) {



    $(".center-div").html(d);
    var firstrowFlag = 0;
    $(".center-div table").find('tr:first td').each(function() {

        if (firstrowFlag > 0) {
            $(this).find('.top-col').html(firstrowFlag);
        }
        firstrowFlag++;
    });

    var firstColFlag1 = 0;
    var index = 0;
    $('.center-div table.fixed-left-column').find('tr').each(function() {
        index++;
        $(this).find('td:first').each(function() {
            if (firstColFlag1 != 0)
                $(this).html(firstColFlag1);
            firstColFlag1++;
        });
    });

    Operationmargecell();
    $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
    //   $('.center-div tr').find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');
    setColRowClass();

    $('.dropdown-menu').removeClass('show');
    $('i.active').hide();
    $('i').removeClass('active');
    removeSelection();
    if ($('.show-auto-number').hasClass('hide-gridNumber')) {
        isAutonumberDisplay = false;
    } else {
        isAutonumberDisplay = true;
    }


    $('.creation-node').parent('.event.creation-bg').addClass('event-bg');
    $('.creation-node').parent('.event.creation-bg').prev('td.creation-bg').addClass('border-light-top');
    //$('.system').next('td')[0].scrollIntoView();
    $(".center-div").scrollTop(0);


    $(".center-div .blankRow").each(function() {

        var myCol = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").index();
        $(this).find("td").each(function(index) {

            if (index == myCol || index == parseInt(myCol) + 1) {
                //$(this).css('background','green');
                $(this).addClass('blankRowTd');
            }
        });

    });

    removeInteractiobborder();
    runAlgorithmOfAutoNumbering();
	
	/*code for navigation*/
	if($('#course-path-number').hasClass('On')){
		$('.fixed-left-column').find('.border-green, .bg-green, .border-bottom-green').removeClass('border-green bg-green border-bottom-green');
		$('.table-count:first').addClass('activeNum');
		$('.activeNum').closest('td').addClass('border-green bg-green border-bottom-green');
		$('.fixed-left-column [class*=parent_]').removeClass('show_number_grey');
		$('.fixed-left-column [class*=parent_]').not(':first').nextAll().addClass('show_number_grey');
	}
}
// add function here to addLogicOperationSegment 

/*function here to add below logic segment below of operation*/
function addLogicOperationSegment(currentRow, currentColumn, type, roleNo, NonSquential, domaincount, currentLength, lastColumn) {

    displayLoader();
    var dataArray = Array();
    var index = 0;

        var eventStatusCol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
        var eventCount = 0;
        if(eventStatusCol>0){
            eventCount = 1;
        }else {
            eventCount = 0;
        }

    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {

            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var suboperationCount = 0;

    //suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
    suboperationCount = $('.center-div .fixed-left-column .row-0 .col-' + currentColumn).nextAll('td.add-sub-more-operation').length;

    $.post(domainUrl + 'grid/addLogicOperationSegment', {
        'data': dataArray,
        'currentRow': currentRow,
        'currentColumn': currentColumn,
        'type': type,
        'roleNo': roleNo,
        'NonSquential': NonSquential,
        'currentLength': currentLength,
        'domaincount': domaincount,
        'lastColumn': lastColumn,
        'suboperationCount': suboperationCount,
        'eventCount':eventCount
    }, responceAddOperationSegment, 'HTML');

}

/*end logic operation add here*/

/*function here to add below segment below of operation*/
function addOperationSegment(currentRow, currentColumn, type, roleNo, NonSquential, domaincount, currentLength, blankRow) {


    displayLoader();
    var dataArray = Array();
    var index = 0;
    var eventStatusCol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
    var eventCount = 0;
    if(eventStatusCol>0){
        eventCount = 1;
    }else {
        eventCount = 0;
    }

    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {

            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var suboperationCount = 0;

    suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;

    $.post(domainUrl + 'grid/addOperationSegment', {
        'data': dataArray,
        'currentRow': currentRow,
        'currentColumn': currentColumn,
        'type': type,
        'roleNo': roleNo,
        'NonSquential': NonSquential,
        'domaincount': domaincount,
        'currentLength': currentLength,
        'blankRow': blankRow,
        'domaincount': domaincount,
        'suboperationCount': suboperationCount,
        'eventStatusCol':eventCount
    }, responceAddOperationSegment, 'HTML');



}

function responceAddOperationSegment(d, s) {

    
    $(".center-div").html(d);
    var firstrowFlag = 0;
    $(".center-div table").find('tr:first td').each(function() {
        if (firstrowFlag > 0) {
            $(this).find('.top-col').html(firstrowFlag);
        }
        firstrowFlag++;
    });

    var firstColFlag1 = 0;
    var index = 0;
    $('.center-div table.fixed-left-column').find('tr').each(function() {
        index++;
        $(this).find('td:first').each(function() {
            if (firstColFlag1 != 0)
                $(this).html(firstColFlag1);
            firstColFlag1++;
        });
    });

    Operationmargecell();

    $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
    $('.center-div tr').find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');

    setColRowClass();

    if ($('.show-auto-number').hasClass('hide-gridNumber')) {
        isAutonumberDisplay = false;
    } else {
        isAutonumberDisplay = true;
    }

    if ($('.center-div table.fixed-left-column').find('tr').last().prevAll('tr').children('td').hasClass('border-bottom')) {
        $('.center-div table.fixed-left-column').find('tr').last().prevAll('tr').children('td').removeClass('border-bottom')
    }
    removeInteractiobborder();
    runAlgorithmOfAutoNumbering();
    setTableWidth();




}

/*move segment code start here*/


function moveSegment(currentRow, currentColumn, type) {

    displayLoader();
    var dataArray = Array();
    var index = 0;
    var parentClass = '';
    var PreParentRow = 0;
    var PreMoveRow = 0;
    var classNames = Array();
    var ClassParent = '';

    var lastClmIndx = 0;
    $(".center-div table").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        var gettD = '';

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');

            $(this).find("td").each(function(cell, va) {
                /*code here to check last row node*/
                if (row == 1) {
                    lastClmIndx++;
                }
                if (row == 2 && cell == 1) {
                    var classdata = $(this).attr('class');
                    parentClass = $.grep(classdata.split(" "), function(v, i) {
                        return v.indexOf('parent_') === 0;
                    }).join();
                }

                /*end code here */
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var noofRows = $('.center-div .' + parentClass).length;
    var parentLength = $('.center-div .parent_' + currentRow + '_' + currentColumn).length;

    if (type == 'UP') {
        PreParentRow = parseInt(currentRow) - 1;
        classNames = $('.center-div .cell_' + PreParentRow + '_' + currentColumn).attr('class').split(/\s+/);
        for (var i = 0; i < classNames.length; ++i) {
            if (classNames[i].substr(0, 3) === "par") {
                ClassParent = classNames[i];
            }
        }
        PreMoveRow = $('.center-div .' + ClassParent).length;
    } else {
        PreParentRow = parseInt(parentLength) + parseInt(currentRow);


        PreMoveRow = $('.center-div .parent_' + PreParentRow + '_' + currentColumn).length;
    }



    var checkoperation = 0;

    checkoperation = $('.center-div .parent_' + currentRow + '_' + currentColumn).next('td').next('td').find('.operation-text').length;
    if (checkoperation != '') {
        checkoperation = checkoperation;
    } else {
        checkoperation = 0;
    }
    if (checkoperation == 0) {
        $.post(domainUrl + 'grid/moveSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkoperation': checkoperation,
            'type': type,
            'parentLength': parentLength,
            'PreMoveRow': PreMoveRow,
            'lastClmIndx': lastClmIndx
        }, responceAddSegment, 'HTML');
    } else {
        $.post(domainUrl + 'grid/moveSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkoperation': checkoperation,
            'type': type,
            'parentLength': parentLength,
            'PreMoveRow': PreMoveRow,
            'lastClmIndx': lastClmIndx
        }, responceAddOperationSegment, 'HTML');
    }

}

/*code start here to move association panel*/

function moveAssoSegment(currentRow, currentColumn, type) {

    displayLoader();
    var dataArray = Array();
    var index = 0;
    var parentClass = '';
    var PreParentRow = 0;
    var PreMoveRow = 0;
    var classNames = Array();
    var ClassParent = '';

    var lastClmIndx = 0;
    $(".center-div table").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        var gettD = '';

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');

            $(this).find("td").each(function(cell, va) {
                /*code here to check last row node*/
                if (row == 1) {
                    lastClmIndx++;
                }
                if (row == 2 && cell == 1) {
                    var classdata = $(this).attr('class');
                    parentClass = $.grep(classdata.split(" "), function(v, i) {
                        return v.indexOf('parent_') === 0;
                    }).join();
                }

                /*end code here */
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var noofRows = $('.center-div .' + parentClass).length;
    var parentLength = $('.center-div .parent_' + currentRow + '_' + currentColumn).length;

    if (type == 'UP') {
        PreParentRow = parseInt(currentRow) - 1;
        classNames = $('.center-div .cell_' + PreParentRow + '_' + currentColumn).attr('class').split(/\s+/);
        for (var i = 0; i < classNames.length; ++i) {
            if (classNames[i].substr(0, 3) === "par") {
                ClassParent = classNames[i];
            }
        }
        PreMoveRow = $('.center-div .' + ClassParent).length;
    } else {
        PreParentRow = parseInt(parentLength) + parseInt(currentRow);
        PreMoveRow = $('.center-div .parent_' + PreParentRow + '_' + currentColumn).length;
    }

    var NoOfProcess = $(".center-div .fixed-left-column .Process").length;

    pushactorCol = [];

    $('.center-div table.fixed-left-column .add-role-segment').each(function() {

        pushactorCol.push($(this).closest('td').index());

    });


    $.post(domainUrl + 'associations/moveSegment', {
        'data': dataArray,
        'currentRow': currentRow,
        'currentColumn': currentColumn,
        'noofRows': noofRows,
        'type': type,
        'parentLength': parentLength,
        'PreMoveRow': PreMoveRow,
        'lastClmIndx': lastClmIndx,
        'NoOfProcess': NoOfProcess,
        'pushactorCol': pushactorCol
    }, responceAddOperationSegment, 'HTML');


}

/*end code here*/



/*code start here for add association phase segment*/

function addAssociationSegment(currentRow, currentColumn, type, roleNo, checkrole) {

    
    displayLoader();
    var dataArray = Array();
    var index = 0;
    var parentClass = '';
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                /*code here to check last row node*/
                if (row == 2 && cell == 1) {
                    var classdata = $(this).attr('class');
                    parentClass = $.grep(classdata.split(" "), function(v, i) {
                        return v.indexOf('parent_') === 0;
                    }).join();
                }
                /*end code here */
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var noofRows = $('.center-div .' + parentClass).length;
    if (checkrole != '') {
        checkrole = checkrole;
    } else {
        checkrole = 0;
    }

    if (checkrole == 0) {
        $.post(domainUrl + 'associations/addSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkrole': checkrole,
            'type': type
        }, associationResponceCreatePhase, 'HTML');
    } else {
        $.post(domainUrl + 'associations/addSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkrole': checkrole,
            'type': type,
            'roleNo': roleNo
        }, associationResponceCreatePhase, 'HTML');
    }

}

/*end code here*/


function addSegment(currentRow, currentColumn, type, roleNo, nonSequence, currentLength, domaincount) {

    displayLoader();
    var dataArray = Array();
    var index = 0;
    var parentClass = '';
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];
        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                /*code here to check last row node*/
                if (row == 2 && cell == 1) {
                    var classdata = $(this).attr('class');
                    parentClass = $.grep(classdata.split(" "), function(v, i) {
                        return v.indexOf('parent_') === 0;
                    }).join();
                }
                /*end code here */
                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

var eventStatusCol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
    var eventCount = 0;
    if(eventStatusCol>0){
        eventCount = 1;
    }else {
        eventCount = 0;
    }
    

    var chkoperArray = Array();
    var noofRows = $('.center-div .' + parentClass).length;
    var checkoperation = 0;
    var suboperationCount = 0;
    checkoperation = $('.center-div .parent_' + currentRow + '_' + currentColumn).next('td').next('td').find('.operation-text').length;

    var checkoperationCount = $('.center-div .parent_' + currentRow + '_' + currentColumn).next('td').next('td').find('.operation-text').attr("class");
    $($('.center-div .parent_' + currentRow + '_' + currentColumn).next('td').next('td').find('.operation-text')).each(function(i) {
        if ($(this).parents("tr").prev("tr").hasClass("blankRow") == true) {
            chkoperArray.push(i);
        }
    });

    suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;

    if (checkoperation != '') {
        checkoperation = checkoperation;
    } else {
        checkoperation = 0;
    }



    var indexRow = [],
        indexCol = [];
    $('.center-div .seq').each(function() {

        indexRow.push($(this).find('.operation-delete').parents('tr').index() + parseInt(2));
        indexCol.push($(this).find('.operation-delete').parents('td').index());
        //indecVal.push($(this).find('.operation-delete').parents('tr').index()+','+$(this).find('.operation-delete').nextAll().parents('td').index());
    });


    if (checkoperation == 0) {
        $.post(domainUrl + 'grid/addSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkoperation': checkoperation,
            'type': type,
            'currentLength': currentLength,
            'domaincount': domaincount,
            'suboperationCount': suboperationCount,
            'indexRow': indexRow,
            'indexCol': indexCol,
            'eventCount':eventCount
        }, responceAddSegment, 'HTML');
    } else {
        $.post(domainUrl + 'grid/addSegment', {
            'data': dataArray,
            'currentRow': currentRow,
            'currentColumn': currentColumn,
            'noofRows': noofRows,
            'checkoperation': checkoperation,
            'type': type,
            'roleNo': roleNo,
            'nonSequence': nonSequence,
            //'chkoperArray':chkoperArray,
            'currentLength': currentLength,
            'domaincount': domaincount,
            'indexRow': indexRow,
            'indexCol': indexCol,
            'suboperationCount': suboperationCount,
            'eventCount':eventCount
        }, responceAddOperationSegment, 'HTML');
    }

}

function responceAddSegment(d, s) {
    
    
    $(".center-div").html(d);
    var firstrowFlag = 0;
    $(".center-div table").find('tr:first td').each(function() {

        if (firstrowFlag > 0) {
            $(this).find('.top-col').html(firstrowFlag);
        }
        firstrowFlag++;
    });

    var firstColFlag1 = 0;
    var index = 0;
    $('.center-div table.fixed-left-column').find('tr').each(function() {
        index++;
        $(this).find('td:first').each(function() {
            if (firstColFlag1 != 0)
                $(this).html(firstColFlag1);
            firstColFlag1++;
        });
    });

    margecell();
    $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
    $('.center-div tr').find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');

    setColRowClass();

    if ($('.show-auto-number').hasClass('hide-gridNumber')) {
        isAutonumberDisplay = false;
    } else {
        isAutonumberDisplay = true;
    }



    if ($('tr').last().prevAll('tr').children('td').hasClass('border-bottom')) {

        $('tr').last().prevAll('tr').children('td').removeClass('border-bottom');
    }
    removeInteractiobborder();
    runAlgorithmOfAutoNumbering();
    //remove show class after adding segments
    $('.phase-segment').removeClass('active show');

}
/*code start here to use for create Event*/
function createEventStatus(columnNumber, preNoSegment,currentRow){

        displayLoader();
        $("#EventStatusModal").modal('show');
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

       var chVal='';
            $.each($("input[name='eventstatus']:checked"), function() {
            chVal = $(this).val();
            
        });     


         $_this = $(this);

        var sessionVal = '';
        var myArray = ["before","after","completion","desctructor"];
        $(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
        trWrapper = $(tdWrapper).parent('tr'),
        tableWrapper = $(trWrapper).parent(),
        myCol = columnNumber;
        myRow = currentRow;
        
        var lastColumn = $('.center-div .fixed-top-header').find('.row_1').find('.sys-icon').parent().parent().index();

        var rolecount = $(".center-div .fixed-left-column").find('.check-role').eq(0).parents('td').index();
        var currentLength = $('.center-div .parent_'+myRow+'_' + myCol).length;
        //var eventFun = '';
        var lastcol  = 0;
        var exitscol = 0
            
            lastcol   = $('.center-div .fixed-left-column').find('.event-before:last').parent().index();
            exitscol  = $('.center-div .fixed-left-column').find('.row_'+myRow).find('.col-'+lastcol).children('div').hasClass('event-before');
            var checkexitscol = false;
            var totalOpRow = parseInt(myRow)+parseInt(currentLength);
            for(i=parseInt(myRow);i<=parseInt(totalOpRow);i++){
              if($('.center-div .fixed-left-column').find('.row_'+i).find('.col-'+lastcol).children('div').hasClass('event-before')){
             checkexitscol  = $('.center-div .fixed-left-column').find('.row_'+i).find('.col-'+lastcol).children('div').hasClass('event-before');
              }
            }

            /*if(chVal=='delete'){
                var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
                var i, j;
                for (i = myRow; i <= lastRow; i++) {
                    
                    for (j = 1; j <= lastColumn; j++) {
                        $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                    }
                }    

                var afterEvent = [];
                    $('.center-div .fixed-left-column tr').each(function(i,v){
                        var chekVal = parseInt($(v).find('.event-before').parent().parent().index());
                        if(chekVal > 0 ){
                            afterEvent.push(parseInt(chekVal));

                            
                        }
                      
                    });
                if(afterEvent.length<1){
                    $('.center-div .fixed-left-column').find('.col-13').remove();
                }
                deleteEventStatusSelected(myRow, myCol,eventVal);
            }
            else if(eventVal==''){
                
                hideLoader();$(".lodding").hide();
                return false;

            }else {*/

            //checkexitscol  = $('.center-div .fixed-left-column').find('.row_'+myRow).find('.col-'+lastcol).children('div').hasClass('event-before');
                        if(lastcol ==-1 && checkexitscol == false){
                         exitscol   = 0;
                         sessionVal = 0;
                        }

                        else if(lastcol!=-1 && checkexitscol == false){

                            exitscol   = 1;
                            sessionVal = 0;
                        }
                        else {
                            exitscol   = 1;
                            sessionVal = 0;
                        }
           
                if(eventVal.length > 1){
            
                   
                    //addMultipleEvent(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);
                       if(eventVal.length==2){

                                
                                hideLoader();$(".lodding").hide();
                                
                                if(eventVal[0]=='after' && eventVal[1]=='completion'){
                                    
                                    if(lastcol!=-1 && checkexitscol == true){
                                        
                                        deleteAfterCopmletionStatus(myRow, myCol,eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                                   
                                    } else {
                                        
                                    addAfterCopmletion(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);
                                    
                                    }
                                }
                                else if(eventVal[0]=='after' && eventVal[1]=='destructor'){
                                    
                                    if(lastcol!=-1 && checkexitscol == true){
                                        
                                        deleteAD(myRow, myCol,eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                                   
                                    } else {

                                        addAfterDestructure(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);    
                                    }

                                    
                                }

                                else if(eventVal[0]=='completion' && eventVal[1]=='destructor'){

                                    if(lastcol!=-1 && checkexitscol == true){
                                        deleteCD(myRow, myCol,eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                                    } else {
                                        addCopmletionDestructure(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);
                                    }
                                }
                                else {
                                    if(lastcol!=-1 && checkexitscol == true){
                                        deleteALL(myRow, myCol,eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                                    } else {
                                    addMultipleEvent(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);
                                    }                                    
                                }
                                
                       }
                       else {

                                if(lastcol!=-1 && checkexitscol == true){
                                    
                                    deleteALL(myRow, myCol,eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                                } 
                                else {
                                    
                                    addMultipleEvent(myRow, myCol, eventVal,currentLength,sessionVal,exitscol,checkexitscol);
                                }
                        
                        }
                    
                    }
        
                    else{

                    var matchVal = getMatch(myArray, eventVal);
                    
                    if(matchVal == 'before'){

                        if(lastcol!=-1 && checkexitscol == true){
                            
                             deleteStatusEvent(myRow, myCol,matchVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                        }
                        else {
                           
                           addEventStatus(myRow, myCol,matchVal,currentLength,sessionVal,exitscol,checkexitscol);
                        }

                    }
                    else if(matchVal=='after'){

                        if(lastcol!=-1 && checkexitscol == true){
                            
                             deleteAfterStatus(myRow, myCol,matchVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                        }else {
                            
                            addAfterEventStatus(myRow, myCol,matchVal,currentLength,sessionVal,exitscol,checkexitscol);
                        }
                    }   
                    else if(matchVal=='completion'){
                        
                        if(lastcol!=-1 && checkexitscol == true){
                            
                             deleteCompletionStatus(myRow, myCol,matchVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                        }else {

                            addAfterCompletionEventStatus(myRow, myCol,matchVal,currentLength,sessionVal,exitscol,checkexitscol);
                        }
                    } 

                    else {
                        
                        if(lastcol!=-1 && checkexitscol == true){
                            
                             deleteDestrutorStatus(myRow, myCol,matchVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,matchVal);
                        }
                        else {
                            addAfterDestructiveEventStatus(myRow, myCol,matchVal,currentLength,sessionVal,exitscol,checkexitscol);
                        }
                    }

                }

        }

 /*end code here*/

/*code here use to add after event*/

function CDCreateEventStatus(d, s) {
    
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

             $.post(domainUrl + 'grid/addCopmletionDestructure', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}



function AllCreateEventStatus(d, s) {
    
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

        $.post(domainUrl + 'grid/addMultipleEvent', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}

function ADCreateEventStatus(d, s) {
    
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

             $.post(domainUrl + 'grid/addAfterDestructure', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}
function AfterComletionCreateEventStatus(d, s) {
    

    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

             $.post(domainUrl + 'grid/addAfterCopmletion', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}
function DestructorCreateEventStatus(d, s) {

    displayLoader();
    
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;
             $.post(domainUrl + 'grid/addAfterDestructiveEventStatus', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}
function CompletionCreateEventStatus(d, s) {

    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;
             $.post(domainUrl + 'grid/addAfterCompletionEventStatus', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}

function AfterCreateEventStatus(d, s) {

    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;
             $.post(domainUrl + 'grid/addAfterEventStatus', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}
/*code for before event*/

function FirstCreateEventStatus(d, s) {

    displayLoader();

    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;

    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });

     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;
             $.post(domainUrl + 'grid/addEventStatus', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, responceCreateOperation, 'HTML');

}
/*end code here*/


 /*delete event Status and add New interacton */
    function deleteStatusEvent(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
            var preNoSegment= 0;
            var lastRow = parseInt(myRow)+parseInt(currentLength);
            var i, j;
            for (i = myRow; i < lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
            var beforeArray = [];
            $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var beforeindex = 0;
                
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        beforeArray[beforeindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        beforeindex++;
                    });
                });
            });

                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': beforeArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, FirstCreateEventStatus, 'HTML');
          
    }

    function deleteAfterStatus(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
            var preNoSegment= 0;
            var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var afterArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var beforeindex = 0;
                var afterindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        afterArray[afterindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        afterindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': afterArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, AfterCreateEventStatus, 'HTML');
           
    }

    function deleteCompletionStatus(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
            var preNoSegment= 0;
            var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var afterArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var beforeindex = 0;
                var afterindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        afterArray[afterindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        afterindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': afterArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, CompletionCreateEventStatus, 'HTML');
           
    }

    function deleteDestrutorStatus(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
        var lastRow = parseInt(myRow)+parseInt(currentLength)-1;

            var preNoSegment= 0;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': desArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, DestructorCreateEventStatus, 'HTML');
           
    }


    function deleteEventStatusSelected(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
        
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': desArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, responceCreateOperation, 'HTML');
           
    }

    function deleteAfterCopmletionStatus(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
        var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            //lastColumn = parseInt(lastColumn)+parseInt(1);
            
            var preNoSegment= 0;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': desArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, AfterComletionCreateEventStatus, 'HTML');
           
    }

/*function use here for delete event status while add sub-operation */
function deleteESOS(myRow,myCol,opLength,suboperationCount,logicsN,nonSequence1,opSelect,domaincount,rolecount,logicType,opIndexNo){
             
            var preNoSegment = 0;
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            
             var dataArray = Array();
                var index = 0;
                $(".center-div table.fixed-left-column").each(function() {
                    var $table = $(this);
                    var $rows = $("tbody tr", $(this));
                    var headers = [];
                    var rows = [];


                    $rows.each(function(row, v) {
                        var rowClass = $(this).attr('class');
                        $(this).find("td").each(function(cell, va) {
                            dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                            index++;

                        });
                    });

                });
                if(logicType=='logic'){
                $.post(domainUrl + 'grid/deleteEvent', {
                    'data':     dataArray,
                    'myCol':     myCol,
                    'myRow':     myRow,
                    'opLength':  opLength,
                    'logicsN':   logicsN,
                    'nonSequence':nonSequence1,
                    'opSelect':   opSelect, 
                    'domaincount':domaincount,
                    'rolecount':  rolecount,
                    'opIndexNo' : opIndexNo,
                    'suboperationCount':suboperationCount

                }, ADaddOperation, 'HTML');
            }
            else {
                $.post(domainUrl + 'grid/deleteEvent', {
                    'data': dataArray,
                    'myCol': myCol,
                    'myRow': myRow,
                    'opLength' : opLength,
                    'logicsN':logicsN,
                    'nonSequence':nonSequence1,
                    'opSelect':opSelect, 
                    'domaincount':domaincount,
                    'rolecount':rolecount,
                    'opIndexNo' : opIndexNo,
                    'suboperationCount':suboperationCount

                }, ADSimpleOperation, 'HTML');
            }
}
/* add logic operation after delete event status and add sub-operation */
function ADaddOperation(d, s) {
   
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });
     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

            $.post(domainUrl + 'grid/addOperation', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, SOaddSubOperation, 'HTML');

    }
function SOaddSubOperation(d, s) {
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });
     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

            $.post(domainUrl + 'grid/addSubOperation', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, firstLogicresponceCreateOperation, 'HTML');

    }


function ADSimpleOperation(d, s) {
   
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });
     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

            $.post(domainUrl + 'grid/addOperation', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, SOSimpleaddSubOperation, 'HTML');

    }
function SOSimpleaddSubOperation(d, s) {
    displayLoader();
    var myRow = '',myCol='',currentLength=3,preNoSegment=0;
    var logicsN = [],nonSequence1=[];
    var EventStatusArray = Array();
    var index = 0;
    var domaincount = $(".center-div .fixed-left-column .domain-count").length;
    var rolecount = $(".center-div .fixed-left-column .role-count").length;
    /*code here to used check the non sequence blank row*/
        var eventVal = [];
            $.each($("input[name='event_status[]']:checked"), function() {
            eventVal.push($(this).val());
        });

    $(d).each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, v) {
                EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                preNoSegment++;
            });
        });

    });
     $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

            $.post(domainUrl + 'grid/addSubOperation', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : eventVal,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : 0,
            'exitscol'          : 1

        }, firstresponceCreateOperation, 'HTML');

    }

/*end code here*/

function deleteAD(myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            
            var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            var tmpRow = $('.center-div .fixed-left-column tr').length;
            var totalRow = parseInt(tmpRow)-1;
            var preNoSegment= 0;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data': desArray,
                    'myRow': myRow,
                    'myCol': myCol,
                    'roleNo': NoOfRole,
                    'lastRow': totalRow,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, ADCreateEventStatus, 'HTML');
           
    }
    function deleteCD (myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            var tmpRow = $('.center-div .fixed-left-column tr').length;
            var totalRow = parseInt(tmpRow)-1;
            var preNoSegment = 0;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data'   : desArray,
                    'myRow'  : myRow,
                    'myCol'  : myCol,
                    'noOfEvent' : eventVal,
                    'lastRow': totalRow,
                    'roleNo' : NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, CDCreateEventStatus, 'HTML');
           
    }
    
   function deleteALL (myRow, myCol, eventVal,currentLength,lastcol,sessionVal,exitscol,checkexitscol,lastColumn,type){
            var lastRow = parseInt(myRow)+parseInt(currentLength)-1;
            var tmpRow = $('.center-div .fixed-left-column tr').length;
            var totalRow = parseInt(tmpRow)-1;
            var preNoSegment = 0;
            var i, j;
            for (i = myRow; i <= lastRow; i++) {
                for (j = 1; j <= lastColumn; j++) {
                    $('.center-div .cell_' + i + '_' + j).closest('tr').remove();
                }
            }    
            var rolecount = $(".center-div .fixed-left-column .role-count").length;
            NoOfRole = parseInt(rolecount);
            var domaincount = $(".center-div .fixed-left-column .domain-count").length;
            var suboperationCount = 0;
            suboperationCount = $('.center-div .fixed-left-column .row-0').find(".add-sub-more-operation").length;
            displayLoader();
            
             var desArray = [];
             $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var descindex = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        desArray[descindex] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        descindex++;
                    });
                });
            });
                 $.post(domainUrl + 'grid/deleteEventStatus', {
                    'data'   : desArray,
                    'myRow'  : myRow,
                    'myCol'  : myCol,
                    'noOfEvent' : eventVal,
                    'lastRow': totalRow,
                    'roleNo' : NoOfRole,
                    'domaincount': domaincount,
                    'currentLength': currentLength,
                    'domaincount': domaincount,
                    'suboperationCount': suboperationCount,
                    'lastcol': lastcol
                }, AllCreateEventStatus, 'HTML');
           
    }
    
 /* function here for add Event Status */



    function addCopmletionDestructure(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        
        displayLoader();

        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    
                        preNoSegment++;
                                    
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

       $.post(domainUrl + 'grid/addCopmletionDestructure', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : type,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : sessionVal,
            'exitscol'          : exitscol

        }, responceCreateOperation, 'HTML');
    }

    function addAfterDestructure(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        
        displayLoader();

        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    
                        preNoSegment++;
                                    
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

       $.post(domainUrl + 'grid/addAfterDestructure', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : type,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : sessionVal,
            'exitscol'          : exitscol

        }, responceCreateOperation, 'HTML');

    }
    function addAfterCopmletion(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        
        displayLoader();

        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    
                        preNoSegment++;
                                    
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

       $.post(domainUrl + 'grid/addAfterCopmletion', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : type,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : sessionVal,
            'exitscol'          : exitscol

        }, responceCreateOperation, 'HTML');

    }


   function addEventStatus(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        
        displayLoader();

        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                    
                        preNoSegment++;
                                    
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

       $.post(domainUrl + 'grid/addEventStatus', {
            'data'              : EventStatusArray,
            'myCol'             : myCol,
            'myRow'             : myRow,
            'checkBlankRows'    : checkBlankRows,
            'nonSequence'       : nonSequence1,
            'logicsN'           : logicsN,
            'currentLength'     : currentLength,
            'type'              : type,
            'eventCount'        : eventCount,
            'preNoSegment'      : preNoSegment,
            'sessionVal'        : sessionVal,
            'exitscol'          : exitscol

        }, responceCreateOperation, 'HTML');

    }

    function addAfterEventStatus(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
     
        displayLoader();
        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                            preNoSegment++;
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

          $.post(domainUrl + 'grid/addAfterEventStatus', {
            'data': EventStatusArray,
            'myCol': myCol,
            'myRow': myRow,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN':logicsN,
            'currentLength':currentLength,
            'type':type,
            'eventCount':eventCount,
            'preNoSegment':preNoSegment,
            'sessionVal' : sessionVal,
            'exitscol':exitscol

        }, responceCreateOperation, 'HTML');

    }

   function addAfterCompletionEventStatus(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        displayLoader();
        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                        preNoSegment++;
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

        $.post(domainUrl + 'grid/addAfterCompletionEventStatus', {
            'data': EventStatusArray,
            'myCol': myCol,
            'myRow': myRow,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN':logicsN,
            'currentLength':currentLength,
            'type':type,
            'eventCount':eventCount,
            'preNoSegment':preNoSegment,
            'sessionVal' : sessionVal,
            'exitscol':exitscol

        }, responceCreateOperation, 'HTML');

    }



    function addAfterDestructiveEventStatus(myRow, myCol,type,currentLength,sessionVal,exitscol,checkVal){
        displayLoader();
        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    if (row >= 2 && myCol == cell) {
                                    str = $(this).text();
                                        preNoSegment++;
                    }
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

        $.post(domainUrl + 'grid/addAfterDestructiveEventStatus', {
            'data': EventStatusArray,
            'myCol': myCol,
            'myRow': myRow,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN':logicsN,
            'currentLength':currentLength,
            'type':type,
            'eventCount':eventCount,
            'preNoSegment':preNoSegment,
            'sessionVal' : sessionVal,
            'exitscol':exitscol

        }, responceCreateOperation, 'HTML');

    }


    function addMultipleEvent(myRow, myCol,type,currentLength,sessionVal,exitscol){
        
      
        displayLoader();
        var EventStatusArray = Array();
        var index = 0;
        var nonSequence1 = [];
        var logicsN= [];
        var preNoSegment= 0;
        
        $(".center-div table").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, v) {
                    EventStatusArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                    preNoSegment++;
                    
                });
            });
          
        });

        $(".center-div .blankRow").each(function(){
                
                nonSequence1.push($(this).index());
        });

        $(".center-div .fixed-left-column tr.seq").each(function(i,v){
                logicsN.push($(this).index());
              
        });

        var checkBlankRows = $(".center-div .blankRow").length;

        var eventCount =  $('.center-div .row_0').find('.event-count').length;

             $.post(domainUrl + 'grid/addMultipleEvent', {
            'data': EventStatusArray,
            'myCol': myCol,
            'myRow': myRow,
            'checkBlankRows': checkBlankRows,
            'nonSequence': nonSequence1,
            'logicsN':logicsN,
            'currentLength':currentLength,
            'type':type,
            'eventCount':eventCount,
            'preNoSegment':preNoSegment,
            'sessionVal':sessionVal,
            'exitscol':exitscol

        }, responceCreateOperation, 'HTML');
   
    }

/*add simple operation function here*/





/*function use here to create sub operation*/

function createSubOperation(columnNumber, preNoSegment, currentRow,opIndexNo) {

    displayLoader();
    var selectedOp1Val = "",
        selectedOp2Val = "";
    var selected = $("input[type='radio'][name='sub_op1']:checked");
    if (selected.length > 0) {
        selectedOp1Val = selected.val();
    }

    var selected2 = $("input[type='radio'][name='sub_op2']:checked");
    if (selected2.length > 0) {
        selectedOp2Val = selected2.val();
    }

   
    $("#SubOperationpoup").modal('show');

    var addtdWrapper = $(this).closest('td'),
        addtrWrapper = $(addtdWrapper).closest('tr'),
        addtableWrapper = $(addtrWrapper).closest('table'),
        myCol = columnNumber,
        myRow = currentRow;
        var RoleSereisArray = Array();
        var preNoSegment = 0;
        var noOfSegment = 0;
        var index = 0;
        var nonSequence1 = [];
        var logicsN = [];
        var domaincount = $(".center-div .fixed-left-column .domain-count").length;
        var rolecount = $(".center-div .fixed-left-column .role-count").length;
        var checkEventStatus = $('.center-div .fixed-left-column').find('.event-before').length
        
        var tmpRow       = $('.center-div .fixed-left-column tr').length;
        var totalRow     = parseInt(tmpRow)-1;     
            

    /*code here to used check the non sequence blank row*/

    $(".center-div table").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');

            $(this).find("td").each(function(cell, v) {
                RoleSereisArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
                if (row >= 2 && myCol == cell) {
                    str = $(this).text();
                    if (str.toLowerCase().indexOf("add segment") > 0) {
                        preNoSegment++;
                    }
                }
            });
        });

    });

    $(".center-div .blankRow").each(function() {

        nonSequence1.push($(this).index());
    });

    $(".center-div .fixed-left-column tr.seq").each(function(i, v) {
        logicsN.push($(this).index());

    });
        var lastcol   = $('.center-div .fixed-left-column').find('.check-add-status:last').parent().index();
        var removecol   = $('.center-div .fixed-left-column').find('.e-before:last').parent().index();
        var suboperationCount = 0;
        suboperationCount = $('.center-div .fixed-left-column .row-0 .col-' + myCol).nextAll('td.add-sub-more-operation').length;;

    var checkBlankRows = $(".center-div .blankRow").length;
            
    if (selectedOp2Val == 'seq_logic_2' || selectedOp2Val == 'non_seq_logic_2') {

        var checkNextOperation = $('.center-div .row-0 .col-' + myCol).next().next().hasClass("add-sub-more-operation");
        var NewdataArray = Array();
        
        if(checkEventStatus>0){
              
               $('.center-div').find('.col-'+removecol).remove();
                var eventStatus = [];
                $('.center-div .fixed-left-column tr').each(function(i,v){
                var chekVal = parseInt($(v).find('.check-add-status').parent().parent().index());
                if(chekVal > 0 ){
                    eventStatus.push(parseInt(chekVal));
                }
               });
               $('.center-div .col-' + myCol).prev('td').nextAll('td').children("span").parent('td').remove();
               $('.center-div .col-' + myCol).prev('td').nextAll('td').children("div").parent('td').remove();
                var maincounts = 0;
                var count = 0;
                $(".center-div .fixed-left-column tr").each(function(i, v) {
                    ++maincounts;
                    if (maincounts >= 3) {
                        $(this).find('td').each(function(i, v) {
                            if ($(this).find('.custom-node').length > 0) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            $(this).remove()
                        } else {
                            count = 0;
                        }
                    }

                });
             $('.center-div').find('.col-'+removecol).remove();
            
                var opSelect = "";
                var selected2 = $("input[type='radio'][name='sub_op2']:checked");
                if (selected2.length > 0) {
                    opSelect = selected2.val();
                }
                var NonLogic= 'logic';
                
            deleteESOS(myRow,myCol,eventStatus.length,suboperationCount,logicsN,nonSequence1,opSelect,domaincount,rolecount,NonLogic,opIndexNo);
             
             
        } 
        else {
        if (checkNextOperation) {

            $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var index2 = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        NewdataArray[index2] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        index2++;
                    });
                });
            });



            displayLoader();
            $.post(domainUrl + 'grid/addSubOperationMultiple', {
                'data': NewdataArray,
                'myCol': myCol,
                'myRow': myRow,
                'suboperationCount': suboperationCount

             }, firstLogicresponceCreateOperation, 'HTML');
        } 
        else {

                $.post(domainUrl + 'grid/addSubOperation', {
                    'data': RoleSereisArray,
                    'myCol': columnNumber,
                    'myRow': currentRow,
                    'Op1': selectedOp1Val,
                    'Op2': selectedOp2Val,
                    'preNoSegment': preNoSegment,
                    'noOfSegment': noOfSegment,
                    'checkBlankRows': checkBlankRows,
                    'nonSequence': nonSequence1,
                    'domaincount': domaincount,
                    'rolecount': rolecount,
                    'logicsN': logicsN,

                }, firstLogicresponceCreateOperation, 'HTML');
            }
        }
    } else {

        if(checkEventStatus>0){
              $('.center-div').find('.col-'+removecol).remove();
                var eventStatus = [];
                $('.center-div .fixed-left-column tr').each(function(i,v){
                var chekVal = parseInt($(v).find('.check-add-status').parent().parent().index());
                if(chekVal > 0 ){
                    eventStatus.push(parseInt(chekVal));
                }
               });
               $('.center-div .col-' + myCol).prev('td').nextAll('td').children("span").parent('td').remove();
               $('.center-div .col-' + myCol).prev('td').nextAll('td').children("div").parent('td').remove();
                var maincounts = 0;
                var count = 0;
                $(".center-div .fixed-left-column tr").each(function(i, v) {
                    ++maincounts;
                    if (maincounts >= 3) {
                        $(this).find('td').each(function(i, v) {
                            if ($(this).find('.custom-node').length > 0) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            $(this).remove()
                        } else {
                            count = 0;
                        }
                    }

                });
             $('.center-div').find('.col-'+removecol).remove();
            
                var opSelect = "";
                var selected2 = $("input[type='radio'][name='sub_op2']:checked");
                if (selected2.length > 0) {
                    opSelect = selected2.val();
                }
                var NonLogic = 'non-logic';

                deleteESOS(myRow,myCol,eventStatus.length,suboperationCount,logicsN,nonSequence1,opSelect,domaincount,rolecount,NonLogic,opIndexNo);

        } 
        else {

        var checkNextOperation1 = $('.center-div .row-0 .col-' + myCol).next().next().hasClass("add-sub-more-operation");
        
        if (checkNextOperation1) {

            var NewdataArray1 = Array();
            $(".center-div table.fixed-left-column").each(function() {
                var $table = $(this);
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                var index3 = 0;
                $rows.each(function(row, v) {
                    var rowClass = $(this).attr('class');
                    $(this).find("td").each(function(cell, va) {
                        if (row == 2 && cell == 1) {
                            preNoSegment++;
                        }
                        NewdataArray1[index3] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                        index3++;
                    });
                });
            });
            displayLoader();
            $.post(domainUrl + 'grid/addSubOperationMultiple', {
                'data': NewdataArray1,
                'myCol': myCol,
                'myRow': myRow,
                'suboperationCount': suboperationCount
            }, firstresponceCreateOperation, 'HTML');
        } else {

            $.post(domainUrl + 'grid/addSubOperation', {
                'data': RoleSereisArray,
                'myCol': columnNumber,
                'myRow': currentRow,
                'Op1': selectedOp1Val,
                'Op2': selectedOp2Val,
                'preNoSegment': preNoSegment,
                'noOfSegment': noOfSegment,
                'checkBlankRows': checkBlankRows,
                'nonSequence': nonSequence1,
                'domaincount': domaincount,
                'rolecount': rolecount,
                'logicsN': logicsN,
                'suboperationCount': suboperationCount
            }, firstresponceCreateOperation, 'HTML');

            }
        }
    }
    setTimeout(function() {
        addCollapseClass();
    }, 1000);

}



function createPhase() {
    var myCol               = $("#columnNumber").val();
    var preNoSegment        = $("#preNoSegment").val();
    var noOfSegment         = $("#noOfSegment").val();
    var dataArray           = Array();
    var NewdataArray        = Array();
    var index               = 0;
    var parentClass         = '';
    var lastColumnIndex     = 0;

    displayLoader();
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        var headers         = [];
        var rows            = [];

        $rows.each(function(row, v) {
            var rowClass = $(this).attr('class');
            $(this).find("td").each(function(cell, va) {
                if (row == 1) {
                    lastColumnIndex++;
                }

                if (row == 2 && cell == 1) {
                    var classdata = $(this).attr('class');
                    parentClass = $.grep(classdata.split(" "), function(v, i) {
                        return v.indexOf('parent_') === 0;
                    }).join();
                }

                dataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                index++;
            });
        });
    });

    var noofRows            = $('.center-div .' + parentClass).length;
    var checkoperation      = 0;
    checkoperation          = $('.center-div .operation-event').children('.segment-node').parent('td').length;

    if (checkoperation != '') {
        checkoperation = checkoperation;
    } else {
        checkoperation = 0;
    }

    if (checkoperation == 0) {
        $.post(domainUrl + 'grid/createPhase', {
            'data': dataArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'noofRows': noofRows,
            'checkoperation': checkoperation
        }, responceCreatePhase, 'HTML');
    } else {

        var SegArr = $('.center-div .col-' + myCol).find('.segment-node').children('.node-white-circle').parent().length;
        var operationCount = new Array();
        $('.center-div .col-' + myCol).find('.col-node-text').each(function(e, value) {
            var addtdWrapperOP = $(this).closest('td');
            var addtrWrapperOP = $(addtdWrapperOP).closest('tr');
            var addtableWrapper = $(addtrWrapperOP).closest('table');
            var myCol = $(addtdWrapperOP).index();
            var myRow = $(addtrWrapperOP).index();
            var optLenght = $('.center-div .parent_' + myRow + '_' + myCol).next('td').next('td').find('.operation-text').length;
            operationCount.push(optLenght);

        });

        $('.center-div .col-' + myCol).next('td').nextAll('td').children('div').parent('td').remove();
        $('.center-div .row-0').children('.col-' + myCol).next('td').nextAll('td').children('span').parent('td').remove();


        var maincounts = 0;
        var count = 0;
        $(".center-div .fixed-left-column tr").each(function(i, v) {
            ++maincounts;
            if (maincounts >= 3) {
                $(this).find('td').each(function(i, v) {
                    if ($(this).find('.custom-node').length > 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    $(this).remove()
                } else {
                    count = 0;
                }
            }

        });

        $(".center-div table.fixed-left-column").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {
                    if (row == 2 && cell == 1) {
                        var classdata = $(this).attr('class');
                        parentClass = $.grep(classdata.split(" "), function(v, i) {
                            return v.indexOf('parent_') === 0;
                        }).join();
                    }
                    NewdataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                });
            });
        });
        DeleteManifest();
        $.post(domainUrl + 'grid/createPhase', {
            'data': NewdataArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,
            'noofRows': noofRows,
            'checkoperation': checkoperation
        }, responceCreatePhase, 'HTML');
        /*end code here*/

    }

}

/*function use here to add phase for association*/
function addPhase(col,seg) {

    var myCol = col;
    var preNoSegment = $("#preNoSegment_association").val();
    var noOfSegment = $("#noOfSegment_association").val();
    var NewdataArray = Array();
    var phaseArr = Array();
    var index = 0;

   

    var parentClass = '';
    var lastColumnIndex = 0;

    var checkrole = 0;
    var checkrole = $('.center-div .col-' + myCol).next('td').nextAll('td').find('.addRoleSeries').closest('li').length;

    if (checkrole != '') {
        checkrole = checkrole;
    } else {
        checkrole = 0;
    }
    if (checkrole > 0) {
        displayLoader();
        $('.center-div .col-' + myCol).next('td').nextAll('td').children('div').parent('td').remove();
        $('.center-div .row-0').children('.col-' + myCol).next('td').nextAll('td').children('span').parent('td').remove();

        var maincounts = 0;
        var count = 0;
        $(".center-div .fixed-left-column tr").each(function(i, v) {
            ++maincounts;
            if (maincounts >= 3) {
                $(this).find('td').each(function(i, v) {
                    if ($(this).find('.custom-node').length > 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    $(this).remove()
                } else {
                    count = 0;
                }
            }

        });

        $(".center-div table.fixed-left-column").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {

                    phaseArr[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                });
            });
        });

        $.post(domainUrl + 'associations/addPhase', {
            'data': phaseArr,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,

        }, associationResponceCreatePhase, 'HTML');

    } else {
        displayLoader();
        $(".center-div table.fixed-left-column").each(function() {
            var $table = $(this);
            var $rows = $("tbody tr", $(this));
            var headers = [];
            var rows = [];
            $rows.each(function(row, v) {
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {

                    NewdataArray[index] = row + '@' + cell + '@' + rowClass + '@' + $(this).attr('class') + '@' + $(this).html();
                    index++;
                });
            });
        });

        $.post(domainUrl + 'associations/addPhase', {
            'data': NewdataArray,
            'myCol': myCol,
            'preNoSegment': preNoSegment,
            'noOfSegment': noOfSegment,

        }, associationResponceCreatePhase, 'HTML');
    }
    /*end code here*/
}
/*end code here*/


/*vode here for association response */

function associationResponceCreatePhase(d, s) {

    var checkflag = 0;
    $(".center-div").html(d);
    var firstrowFlag = 0;
    $(".center-div table").find('tr:first td').each(function() {

        if (firstrowFlag > 0) {
            $(this).find('.top-col').html(firstrowFlag);

        }
        firstrowFlag++;
    });



    var firstColFlag1 = 0;
    var index = 0;
    $('.center-div table.fixed-left-column').find('tr').each(function() {
        index++;
        $(this).find('td:first').each(function() {
            if (firstColFlag1 != 0)
                $(this).html(firstColFlag1);
            firstColFlag1++;
        });


    });

    margecell();

    $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
    $('.center-div tr').find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');

    setColRowClass();

    $('.dropdown-menu').removeClass('show');
    $('i.active').hide();
    $('i').removeClass('active');
    removeSelection();

    if ($('tr').last().children('td').length == 0) {
        $('tr').last().remove();
    }

    if ($('.show-auto-number').hasClass('hide-gridNumber')) {
        isAutonumberDisplay = false;
    } else {
        isAutonumberDisplay = true;
    }
    runAlgorithmOfAutoNumbering('associations');

    $('.center-div .Role-segment').children('.blank-div').parent('td').addClass('creation-bg');
    $('.creation-node').parent('.event.creation-bg').addClass('event-bg');
    $('.creation-node').parent('.event.creation-bg').prev('td.event.creation-bg').addClass('border-light-top');
    //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);
    //  setAssociationTableWidth();
    setTableWidth();
    $('.phase-segment').removeClass('show');
     ActorFlyout();
	 if($('#course-path-number').hasClass('On')){
			gridNavigation.changeColor();
        }

    if($('.schedule-segment-week').length) {
        var scheduleCol = $('.schedule-segment-week:first').parents('td').index();
        $("#scheduleCol").val(scheduleCol);
        updateTextNumInCol(scheduleCol,'Segment','schedule-segment-week');
        if($('.schedule-segment-day').length) {
            updateTextNumInCol((scheduleCol+2),'Segment','schedule-segment-day');
        }
    }
    correctCssStructured();


}

function responceCreatePhase(d, s) {

    var checkflag = 0;
    $(".center-div").html(d);
    var firstrowFlag = 0;
    $(".center-div table").find('tr:first td').each(function() {
        if (firstrowFlag > 0) {
            $(this).find('.top-col').html(firstrowFlag);

        }
        firstrowFlag++;
    });

    var firstColFlag1 = 0;
    var index = 0;
    $('.center-div table.fixed-left-column').find('tr').each(function() {
        index++;
        $(this).find('td:first').each(function() {
            if (firstColFlag1 != 0)
                $(this).html(firstColFlag1);
            firstColFlag1++;
        });
    });

    margecell();

    $('.center-div tr').find('.destructure').closest('td').next().prevAll('td.collapse').find('.destructure').closest('td').addClass('border-light-bottom border-light-top');
    $('.center-div tr').find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');

    setColRowClass();

    $('.dropdown-menu').removeClass('show');
    $('i.active').hide();
    $('i').removeClass('active');
    removeSelection();

    if ($('tr').last().children('td').length == 0) {
        $('tr').last().remove();
    }

    if ($('.show-auto-number').hasClass('hide-gridNumber')) {
        isAutonumberDisplay = false;
    } else {
        isAutonumberDisplay = true;
    }

    runAlgorithmOfAutoNumbering();

    $('.center-div .Role-segment').children('.blank-div').parent('td').addClass('creation-bg');
    $('.creation-node').parent('.event.creation-bg').addClass('event-bg');
    $('.creation-node').parent('.event.creation-bg').prev('td.event.creation-bg').addClass('border-light-top');
    //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);
    setTableWidth();
	/*navigation*/
	if($('#course-path-number').hasClass('On'))
    {
    	$('.fixed-left-column [class*=parent_]').removeClass('show_number_grey');
    	$('.fixed-left-column [class*=parent_]').not(':first').nextAll().addClass('show_number_grey');
	}
}
/*function here to use compare match value*/
function getMatch(a, b) {
            var matches = [];
            for ( var i = 0; i < a.length; i++ ) {
                for ( var e = 0; e < b.length; e++ ) {
                    if ( a[i] === b[e] ) matches.push( a[i] );
                }
            }
            return matches;
}

function getFunctionName(matchVal){
   
    var funName = '';
    if(matchVal=='before'){
        
        funName = 'addEventStatus';
    }
    else if(matchVal=='after'){
        
        funName = 'addAfterEventStatus';
    }   
    else if(matchVal=='completion'){
        funName = 'addAfterCompletionEventStatus';
    } else {
        funName = 'addAfterDestructiveEventStatus';
    }
    return funName;
    }

/*end code here*/    

/*add cdde here to open sub operation madal*/

function responceSubOpearation(d, s) {

    $("#SubOperationpoup").modal('show');
    $("#SubOperationpoup").html(d);
    $('.center-div .add-segment ul').removeClass('show');
    

    //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);

}
function responceEventStatus(d, s) {

    $("#EventStatusModal").modal('show');
    $("#EventStatusModal").html(d);
       $('.center-div .add-segment ul').removeClass('show');
  

  //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);

}
/*end code here*/

function responcePhase(d, s) {

    $("#Seriespoup").modal('show');
       
    
    $("#Seriespoup").html(d);
    //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);
   // setModalPos('Seriespoup');
   
}

function addresponcePhase(d, s) {

    $("#addSeriespoup").html(d);
    // $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);

}


function addAssoresponcePhase(d, s) {

    $("#associationSeriespoup").html(d);
    // $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);

}

function responceopenPhase(d, s) {
    $("#openSeriespoup").html(d);
    //  $('.creation-node').last()[0].scrollIntoView();
    $(".center-div").scrollTop(0);

}

function responceAccountingGridButton(d, s) {
    //$(".class-bulider-section").hide();
    $(".grid-div").css("display", "none");
    $('.tab-item:first a').addClass('active');
   /*var formate = Math.floor((Math.random() * 100000) + 1);*/
    var gridId ="tabIndex_" + new Date().getTime().toString();
    selectedGridId = gridId

    var snippet = '<div class="grid-div center-div account-grid fiancial-grid" grid-id ="%gridid%"></div>';
    var snip = snippet.replace('%gridid%', gridId);
    
    /*if($("#center-screen").children('.grid-div').length > 1){
        $("#center-screen").children('#hidden-instance_id').remove();
        $("#center-screen").children('#temp_column_count').remove();
        $("#center-screen").children('#temp_rows_count').remove();
        $("#center-screen").children('.grid-div').remove();
    }*/

    $("#center-screen").append(snip);
    $("[grid-id=" + gridId + "]").html(d);
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
    financialGrid();
    var tableWidth = $('.center-div #account-table').width();
    $('.center-div #account-table').css('width', tableWidth)
    hideLoader();$(".lodding").hide();
    setWidthInitialy();
}

function responceCourseboardButton(d, s) {
    $(".courseboard-section").html(d);
    jQuery('.courseboard-section').css('opacity', '1');
    $(".grid-div").hide();
    $(".courseboard-section").show();
    var pixels = 100;
    var screenWidth = $(document).width();
    var percentage = 100 * (screenWidth - 450) / screenWidth;
    $("#center-screen").css('width', percentage + '%');
    $('#main').css('height', $('#center-screen').height() - 60);
    $(".nano").nanoScroller({
        preventPageScrolling: true
    });
    $(".courseboard_right .tab-content").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
    $(".dual-panel").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
    });
}

function responceDashboardButton(d, s) {
    $(".dashboard-section").html(d);
    jQuery('.dashboard-section').css('opacity', '1');
    $(".grid-div").hide();
    $(".dashboard-section").show();
    var pixels = 100;
    var screenWidth = $(document).width();
    var percentage = 100 * (screenWidth - 450) / screenWidth;
    $("#center-screen").css('width', percentage + '%');
    $('#main').css('height', $('#center-screen').height() - 60);
    $(".nano").nanoScroller({
        preventPageScrolling: true
    });
}
function responceGridButton(d, s) {
    //$(".class-bulider-section").hide();
    
    $(".grid-div").css("display", "none");
    $('.tab-item:first a').addClass('active');
    var gridId ="tabIndex_" + new Date().getTime().toString();
    selectedGridId = gridId;
    

    var snippet = '<div class="grid-div center-div process-grid" grid-id ="%gridid%"></div><input type="hidden" id="hidden-instance_id" value="" /><input type="hidden" id="temp_column_count" value="" /><input type="hidden" id="temp_rows_count" value="" />';
    var snip = snippet.replace('%gridid%', gridId);

    $("#center-screen").append(snip);
    $("[grid-id=" + gridId + "]").html(d);

    // var cntrHeight = $("#center-screen").height();
    // $(".center-div").css("height", cntrHeight - 34);
    var centerWid = $('.center-div').width() / 2;
    var centerHight = $('#center-screen').height();
    $('.right-popup#nodeFlyout').width(centerWid);
    $('.right-popup#nodeFlyout').height(centerHight);

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
    runAlgorithmOfAutoNumbering();
    $('body .center-div .time-col').closest('td').addClass('merge-td');
    $('.center-div td.collapse.event').addClass('border-right');
    $('.center-div .row-0').children('td').removeClass('border-right');

}

/*code for association grid not call algorith*/

function responceAssociationGridButton(d, s) {
    //$(".class-bulider-section").hide();

    $(".grid-div").css("display", "none");
    $('.tab-item:first a').addClass('active');
   // var formate = Math.floor((Math.random() * 100000) + 1);
    var gridId ="tabIndex_" + new Date().getTime().toString();
    

    selectedGridId = gridId;
    var snippet = '<div class="grid-div center-div association-grid" grid-id ="%gridid%"></div><input type="hidden" id="hidden-instance_id" value="" /><input type="hidden" id="temp_column_count" value="" /><input type="hidden" id="temp_rows_count" value="" />';
    var snip = snippet.replace('%gridid%', gridId);

     if($("#center-screen").children('.grid-div').length > 1){
        $("#center-screen").children('#hidden-instance_id').remove();
        $("#center-screen").children('#temp_column_count').remove();
        $("#center-screen").children('#temp_rows_count').remove();
        $("#center-screen").children('.grid-div').remove();
    }

    $("#center-screen").append(snip);
    $("[grid-id=" + gridId + "]").html(d);
    // var cntrHeight = $("#center-screen").height();
    // $(".center-div").css("height", cntrHeight - 34);
    var centerWid = $('.center-div').width() / 2;
    var centerHight = $('#center-screen').height();
    $('.right-popup#nodeFlyout').width(centerWid);
    $('.right-popup#nodeFlyout').height(centerHight);
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
    runAlgorithmOfAutoNumbering('associations');
    $('body .center-div .time-col').closest('td').addClass('merge-td');
    $('.center-div td.collapse.event').addClass('border-right');
    $('.center-div .row-0').children('td').removeClass('border-right');

}

/*end code here*/

function setborder() {
    $('.center-div tr').last().children('td').addClass('border-bottom');
}

function margecell() {

    cellCollapse();
    $('.center-div .collapse.event').children('.blank-div').parent('td').addClass('creation-bg');
    $('.center-div tr').each(function() {

        $(this).find('.col-text').closest('td').last().prevAll('td.ExcelTablerow').addClass('merge-td');
        $('tr').find('.col-text').closest('td').prevAll('td:nth-child(2)').addClass('border-left');
        $(this).find('.creation').last().closest('td').prev('td').addClass('border-light-top');
        $(this).find('.creation').closest('td').last().next().prevAll('td.collapse').find('.creation').closest('td').addClass('border-light-bottom');
        $(this).find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');
    });
    $('.center-div .row-3').last().find('.col-text').closest('td').last().next().prevAll('td.ExcelTablerow').addClass('border-bottom');
    $('.center-div .blank_row').last().find('.col-text').closest('td').last().next().prevAll('td.ExcelTablerow').addClass('border-bottom');
    $('.center-div .blank_row').children('td').removeClass('border-light-top');
    $('.center-div .blank_row').last().find('.destructure').closest('td').last().next().prevAll('td.collapse').addClass('border-light-top');

    $('.center-div .col-1.border-left').children('.blank-div').addClass("borderDashed")

}

function cellCollapse() {
    var data = '';
    $("table").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var headers = [];
        var rows = [];

        $rows.each(function(row, v) {
            $(this).find("td").each(function(cell, v) {
                str = $.trim($(this).text());
                if (row == 1 && str.indexOf("Event") > 0) {
                    $rows.each(function(rows, v1) {
                        $(this).find("td").each(function(cells, v1) {
                            if (cell == cells) {
                                $(this).attr('class', $(this).attr('class') + ' collapse event ');
                            }
                        });
                    });
                }
            });
        });
    });
}

function removeSelection() {
    $('.center-div td').removeClass('border-top-green border-bottom-green border-green');
    $('.center-div td').find('.node-white-circle').removeClass('node-green-circle');
    $('.center-div .bg-green').removeClass('bg-green');
    $('.center-div .bg-green-border').removeClass('bg-green-border');
    $('.center-div .border-top-green').removeClass('border-top-green');
    $('.center-div .border-bottom-green').removeClass('border-bottom-green');
    $('.center-div .border-bottom-select').removeClass('border-bottom-select');
}

function setColRowClass() {
    // removeing the cell_ and parent_ classes for each cells
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var tCol = 0;

        $rows.each(function(row, v) {

            RowclassName = $.grep(this.className.split(" "), function(v, i) {
                return v.indexOf('row_') === 0;
            }).join();

            $(this).removeClass(RowclassName);

            $(this).find("td").each(function(cell, v) {


                className = $.grep(this.className.split(" "), function(v, i) {
                    return v.indexOf('cell_') === 0;
                }).join();

                parentName = $.grep(this.className.split(" "), function(v, i) {
                    return v.indexOf('parent_') === 0;
                }).join();
                $(this).removeClass(className);
                $(this).removeClass(parentName);
                $(this).removeClass('fill');
                $(this).removeClass('blank');


            });

        });
    });
    // add the cell_ class for each cells
    $('.center-div td').each(function() {
        var colIndex = $(this).parent().children().index($(this));
        var rowIndex = $(this).parent().parent().children().index($(this).parent());

        // remove any existing, wrong col class
        var tdClass = $(this).attr('class');
        var newC = $.grep(tdClass.split(" "), function(v, i) {
            return v.replace(/\bcell_[\d]_[\d].?\b/g, '')
        }).join(' ');
        $(this).attr('class', '');
        $(this).addClass(newC);

        var RowColIndex = $(this).addClass('cell_' + rowIndex + '_' + colIndex);

        if ($('.center-div.association-grid').length == 1) {
            //var addColClass = $(this).addClass('asso_' + rowIndex);
        }


        if ($(RowColIndex).find('.col-node-text').length > 0) {
            $(this).addClass('fill');
        } else {
            $(this).addClass('blank');

            var blankCellClass = $(this).attr('class');
            if($(this).hasClass('border-light-top') || rowIndex == 2) {
                blankSegName = $.grep(blankCellClass.split(" "), function(v, i) {
                    return v.indexOf('cell_') === 0;
                }).join();
                blankSegName = blankSegName.replace("cell", "blankSeg");
                $(this).addClass(blankSegName);
            } else {
                rowColClass = $.grep(blankCellClass.split(" "), function(v, i) {
                    return v.indexOf('cell_') === 0;
                }).join();
                rowNum = rowColClass.split("_")[1];
                colNum = rowColClass.split("_")[2];


                var parentFillInClass = $(".center-div table.fixed-left-column tbody").find('tr:eq('+(rowNum-1)+') td:eq('+colNum+')').attr('class');
                if (parentFillInClass !== undefined && parentFillInClass.indexOf('fill') > -1) {
                    $(this).addClass('blankSeg_' + rowNum + '_' + colNum);
                } else {
                    for(var i=rowNum; i>=2; i--) {
                        var parentSegClass = $(".center-div table.fixed-left-column tbody").find('tr:eq('+i+') td:eq('+colNum+')').attr('class');
                        
                        if(typeof parentSegClass != 'undefined'){
                            if(parentSegClass.indexOf('border-light-top') > -1) {
                                blankSegName = $.grep(parentSegClass.split(" "), function(v, i) {
                                    return v.indexOf('blankSeg_') === 0;
                                }).join();
                                $(this).addClass(blankSegName);
                                break;
                            }
                        }
                    }
                }
            }

        }
    });

    // add the parent_ class for each cells
    $(".center-div table.fixed-left-column").each(function() {
        var $table = $(this);
        var $rows = $("tbody tr", $(this));
        var tCol = 0;

        $rows.each(function(row, v) {
            $(this).find("td").each(function(cell, v) {
                if (row == 1)
                    tCol++;
            });
        });


        for (i = 1; i <= parseInt(tCol); i++) {
            var className = '';
            $rows.each(function(row, v) {
                if (row > 1) {
                    $(this).find("td").each(function(cell, v) {
                        if (cell == i) {

                            if ($.trim($(this).html()) != '') {
                                if ($(this).hasClass('fill')) {

                                    className = $.grep(this.className.split(" "), function(v, i) {
                                        return v.indexOf('cell_') === 0;
                                    }).join();
                                    className = className.replace("cell", "parent");
                                    $(this).addClass(className);
                                } else {
                                    role = $.grep(this.className.split(" "), function(v, i) {
                                        return v.indexOf('role') === 0;
                                    }).join();

                                    system = $.grep(this.className.split(" "), function(v, i) {
                                        return v.indexOf('system') === 0;
                                    }).join();

                                    if (role == '' && system == '')
                                        $(this).addClass(className);
                                }

                            }
                        }

                    });
                }
            });
        }
    })
}

function removeSegSelection() {
    $('.node-white-circle.node-green-circle').removeClass('node-green-circle');
    $('.center-div .border-green').removeClass('border-green');
    $('.center-div .bg-green').removeClass('bg-green');
    $('.center-div .offinator').removeClass('offinator');
    $('.center-div .bg-green-border').removeClass('bg-green-border');
    $('.center-div .border-top-green').removeClass('border-top-green');
    $('.center-div .border-bottom-green').removeClass('border-bottom-green');
    $('.center-div .border-bottom-select').removeClass('border-bottom-select');
    $('.center-div span.icons').parent().siblings().removeClass('showing');
    $('.center-div span.icons').parent().siblings().removeClass('addTableCount');

}

function Operationmargecell() {

    cellCollapse();
    $('.center-div .collapse.event').children('.blank-div').parent('td').addClass('creation-bg');
    $('.center-div .role').children('.blank-div').parent('td').addClass('creation-bg');
    $('.center-div .system').children('.blank-div').parent('td').addClass('creation-bg');
    $('.center-div tr').each(function() {

        $(this).find('.col-text').closest('td').last().prevAll('td.ExcelTablerow').addClass('merge-td');
        $('.center-div tr').find('.col-text').closest('td').prevAll('td:nth-child(2)').addClass('border-left');

        $(this).find('.creation').last().closest('td').prev('td').addClass('border-light-top');
        $('.border-light-top').next('td.operation1').addClass('border-light-bottom');

        $(this).find('.creation').last().closest('td').nextAll('td').addClass('border-light-top');

        $(this).find('.creation').closest('td').last().next().prevAll('td.collapse').find('.creation').closest('td').addClass('border-light-bottom');
        $(this).find('.col-text').closest('td').last().next().prevAll('td.collapse.event').addClass('border-right');

        $(this).find('.system').last().next().prevAll('td.ExcelTablerow').addClass('merge-td');
        $(this).find('.system').find('.creation-node').parent('td').addClass('border-light-top border-light-bottom');
        $(this).find('.role').find('.creation-node').parent('td').addClass('border-light-top border-light-bottom');
        $('.center-div .system').addClass('border-right');

    });

    $('.center-div .operation-event').removeClass('border-right');

    setTimeout(function() {
        $('.center-div .operation-event.border-bottom').removeClass('border-right');
    }, 100);

    $('.center-div .row-3').last().find('.system').last().next().prevAll('td.ExcelTablerow').addClass('border-bottom');

    $('.center-div .row-3').last().find('.col-text').closest('td').last().next().prevAll('td.ExcelTablerow').addClass('border-bottom');
    $('.center-div .blank_row').last().find('.col-text').closest('td').last().next().prevAll('td.ExcelTablerow').addClass('border-bottom');
    $('.center-div .blank_row').children('td').removeClass('border-light-top');
    $('.center-div .blank_row').last().find('.destructure').closest('td').last().next().prevAll('td.collapse').addClass('border-light-top');

    $('.center-div .col-1.border-left').children('.blank-div').addClass("borderDashed")

}

function responceManifestation(d, s) {
    
    //$(".class-bulider-section").hide();
    
    $(".grid-div").css("display", "none");
    $('.grid-div').each(function(i, v) {
        $(this).removeClass('center-div');
    });
    $('.tab-item:first a').addClass('active');
    //var formate = Math.floor((Math.random() * 100000) + 1);
    var gridId ="tabIndex_" + new Date().getTime().toString();
    selectedGridId = gridId;
    var snippet = '<div class="grid-div manifest center-div" grid-id ="%gridid%"></div>';
    var snip = snippet.replace('%gridid%', gridId);
    $("#center-screen").append(snip);
    $("[grid-id=" + gridId + "]").html(d);
    if (CheckBuildMode == 1) {
        simulateContinue = 1;
        $(".simulate-mode").trigger("click");
        CheckBuildMode = 0;
    }

    $("#center-screen").css('height', ($(window).height() - 52) + 'px');
    var cntrHeight = $("#center-screen").height();
    $(".center-div").css("height", cntrHeight - 55);
    parentId = $('.tab-item:first').attr("parent-id");
    $("[grid-id=" + gridId + "]").attr("parent-id", parentId);
   

    $(".col-node-Actor-Perspective").css({
        'position': 'absolute',
        'left': '27px'
    });

    hideLoader();$(".lodding").hide();

    $('.center-div .col-9').addClass('border-right');
    setColRowClass();
    runAlgorithmOfAutoNumbering();
    if (hideNumbering == true) {
        $('.table-count').addClass('hide');
        $('.show-auto-number').addClass('hide-gridNumber');
    }
    var snippet ='<a href="#" class="manifest-tab active"><i class="icon survey"></i><span>Manifest</span></a>';
    $('.block-head .control-btn-wrap').prepend(snippet);
    $('.list-tab').removeClass("active");
}

/*association open popup while add phase in between role and process*/

function openAddPhase(columnNumber, preNoSegment) {

    $.post(domainUrl + 'associations/index', {
        'type': 'phase',
        'preNoSegment1': preNoSegment,
        'columnNumber1': columnNumber,
        'confirm': 'NO'
    }, addAssoresponcePhase, 'HTML');
    $("#associationSeriespoup").modal('show');
}

/*end code here*/


function openCreatePhase(columnNumber, preNoSegment) {

    $.post(domainUrl + 'grid/index', {
        'type': 'phase',
        'preNoSegment': preNoSegment,
        'columnNumber': columnNumber,
        'confirm': 'NO'
    }, responceopenPhase, 'HTML');
    $("#openSeriespoup").modal('show');
}

function displayLoader() {

    $(".lodding").show();
}

function hideLoader() {

    $(".lodding").hide();
}

function setGridWidth(id) {
   
    var cntrWidth = $("#center-screen").width();
    $("[grid-id=" + id + "]").find('.fTHLC-inner-wrapper').css('width', cntrWidth - 120);
    $("[grid-id=" + id + "]").find('.fixed-top-header').css('width', $('.fTHLC-inner-wrapper').width());
    $("[grid-id=" + id + "]").find('.fTHLC-outer-wrapper').css('width', cntrWidth - 103);
}

function DeleteManifest() {
    if ($('.center-div').hasClass('manifest-Create')) {
        $('.center-div').removeClass('manifest-Create');
        var id = $(".center-div").attr("grid-id");
        $("[parent-id=" + id + "]").remove();
    }

}

function setTableWidth() {
    // $("#left-screen").css('height',($(window).height()-52)+'px');
    // $("#center-screen").css('height',($(window).height()-52)+'px');
    // $("#right-screen").css('height',($(window).height()-52)+'px');

    var cntrWidth = $("#center-screen").width();
    var canvasHIG = $(".center-div .fixed-left-column").height();
    var tableHIG = $(".center-div .fTHLC-inner-wrapper").height();
    var cntrHeight = $("#center-screen").height();

    $('#main').css('height', $('#center-screen').height() - 31);
    var rightPanHig = $('.rightSectionWrap').height();
    var actionPanHig = $('.actionPaneHt').height();
    var totalPanHig = rightPanHig - actionPanHig;


    $('.rightSectionWrap, .property-node-search').css('height', ($(window).height() - 227) + 'px');
    $('.right-tab-node').find('.tab-content').css('height', ($(window).height() - 200) + 'px');
    $('.center-div.process-grid .blankRow').children('td').addClass('merge-td');
    // $('.center-div.class-bulider-section').css('height', ($(window).height() - 105) + 'px');
    //dialogueflyout();
   
    if ($('#nodeFlyout').hasClass('in')) {

        var flyOutWid = $('.right-popup').width();
        var nodeFlyoutPos = $('.center-div').find('.nodeFlyout').offset().left;
        var getTopHig       =   $('#center-screen .fixed-top-header').outerWidth();
            var getOutrHig      =   $('#center-screen .fTHLC-outer-wrapper').outerWidth();
            var getInrHig       =   $('#center-screen .fTHLC-inner-wrapper').outerWidth();

            var setTopHig       =   getTopHig/2;
            var setOutrHig      =   getOutrHig/2;
            var setInrHig       =   getInrHig/2;
        if (tableHIG - 17 < canvasHIG) {
                    if ($('.center-div .col-1').hasClass("collapse")) {
                        
                        $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', setOutrHig+100);
                        $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', setInrHig-60).scrollLeft();
                        $('.center-div.process-grid .fixed-top-header').css("width", setTopHig-60);

                    } else {

                        $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', setOutrHig+100);
                        $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', setInrHig-60).scrollLeft();
                        $('.center-div.process-grid .fixed-top-header').css("width", setTopHig-60);

                    }


                } else {
                    if ($('.center-div .col-1').hasClass("collapse")) {
                        
                       $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', setOutrHig+100);
                        $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', setInrHig-60).scrollLeft();
                        $('.center-div.process-grid .fixed-top-header').css("width", setTopHig-60);


                    } else {
                        
                        $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', setOutrHig+100);
                        $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', setInrHig-60).scrollLeft();
                        $('.center-div.process-grid .fixed-top-header').css("width", setTopHig-60);
                    }

                }
    } 
    else {
        if (tableHIG - 17 < canvasHIG){
            if ($('.center-div .col-1').hasClass("collapse")) {
                $('.center-div.process-grid .fixed-top-header').width(cntrWidth - 76);
                $('.center-div.process-grid tr').last().children('td').css('margin-bottom', 19);
                $('.center-div.process-grid .fTHLC-outer-wrapper').css({
                    'width': cntrWidth
                });
                $('.center-div.process-grid .fTHLC-inner-wrapper').css({
                    'width': cntrWidth - 73
                });
                $('.center-div.association-grid .fixed-top-header').width(cntrWidth - 76);
                $('.center-div.association-grid tr').last().children('td').css('margin-bottom', 19);
                $('.center-div.association-grid .fTHLC-outer-wrapper').css({
                    'width': cntrWidth
                });
                $('.center-div.association-grid .fTHLC-inner-wrapper').css({
                    'width': cntrWidth - 73
                });
                $('.center-div.manifest .fTHLC-inner-wrapper').css('width', cntrWidth - 75);
                $('.center-div.manifest .fTHLC-outer-wrapper').css('width', cntrWidth);
                // $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', flyOutWid - 103);
                // $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', flyOutWid - 105).scrollLeft();
                // $('.center-div.association-grid .fixed-top-header').css("width", $('.center-div.association-grid .fTHLC-inner-wrapper').width()-2);
            } else {
                $('.center-div.process-grid .fixed-top-header').width(cntrWidth - 175);
                $('.center-div.process-grid tr').last().children('td').css('margin-bottom', 19);
                $('.center-div.process-grid .fTHLC-outer-wrapper').css({
                    'width': cntrWidth
                });
                $('.center-div.process-grid .fTHLC-inner-wrapper').css({
                    'width': cntrWidth - 172
                });
                $('.center-div.association-grid .fixed-top-header').width(cntrWidth - 175);
                $('.center-div.association-grid tr').last().children('td').css('margin-bottom', 19);
                $('.center-div.association-grid .fTHLC-outer-wrapper').css({
                    'width': cntrWidth
                });
                $('.center-div.association-grid .fTHLC-inner-wrapper').css({
                    'width': cntrWidth - 172
                });
                $('.center-div.manifest .fTHLC-inner-wrapper').css('width', cntrWidth - 174);
                $('.center-div.manifest .fTHLC-outer-wrapper').css('width', cntrWidth);
            }


        } else {
            if ($('.center-div .col-1').hasClass("collapse")) {
                
                $('.center-div.process-grid .fixed-top-header').css('width', cntrWidth - 76);
                $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', cntrWidth);
                $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 73);
                $('.center-div.association-grid .fixed-top-header').css('width', cntrWidth - 76);
                $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', cntrWidth);
                $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 73);
                $('.center-div.manifest .fTHLC-inner-wrapper').css('width', cntrWidth - 75);
                $('.center-div.manifest .fTHLC-outer-wrapper').css('width', cntrWidth);
            } else {
                $('.center-div.process-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 176);
                $('.center-div.process-grid .fixed-top-header').css('width', cntrWidth - 176);
                $('.center-div.process-grid .fTHLC-outer-wrapper').css('width', cntrWidth);

                $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 176);
                $('.center-div.association-grid .fixed-top-header').css('width', cntrWidth - 176);
                $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', cntrWidth);
                $('.center-div.manifest .fTHLC-inner-wrapper').css('width', cntrWidth - 174);
                $('.center-div.manifest .fTHLC-outer-wrapper').css('width', cntrWidth);

            }


        }
    }
     $(".center-div .fTHLC-inner-wrapper").niceScroll({
        cursorcolor: "#000",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "2px",
        background: 'rgba(0,0,0,.15)'
     });

    $('.center-div tr').last().children('td').addClass('border-bottom');
    $('.center-div').find('.fTHLC-inner-wrapper').first().find('table').first().find('tr').last().children('td').addClass('border-bottom');
}

/*function use here to add set table width in association*/


// function setAssociationTableWidth() { 
//     var cntrWidth = $("#center-screen").width();
//     var canvasHIG = $(".center-div .fixed-left-column").height();
//     var tableHIG = $(".center-div .fTHLC-inner-wrapper").height();
//     var cntrHeight = $("#center-screen").height();

//     $('#main').css('height', $('#center-screen').height()-31 );
//     var rightPanHig     =   $('.rightSectionWrap').height();
//     var actionPanHig    =   $('.actionPaneHt').height();
//     var totalPanHig     =   rightPanHig - actionPanHig;

//   $('.rightSectionWrap').css('height', ($(window).height() - 227) + 'px');
//   $('.right-tab-node').find('.tab-content').css('height',($(window).height() - 200) + 'px');
//     $('.center-div.association-grid .blankRow').children('td').addClass('merge-td');

//     if ($('#nodeFlyout').hasClass('in')) {

//         var flyOutWid = $('.right-popup').width();
//         var nodeFlyoutPos = $('.center-div').find('.nodeFlyout').offset().left;
//          if (tableHIG-17 < canvasHIG) {
//              if($('.center-div .col-1').hasClass("collapse")) {
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', flyOutWid - 87);
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', flyOutWid - 104).scrollLeft();
//                 $('.center-div.association-grid .fixed-top-header').css("width", $('.center-div.association-grid .fTHLC-inner-wrapper').width()-15);

//              } else {
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', flyOutWid - 179);
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', flyOutWid - 179).scrollLeft();
//                 $('.center-div.association-grid .fixed-top-header').css("width", $('.center-div.association-grid .fTHLC-inner-wrapper').width()-16);

//              }


//         } else {
//           if($('.center-div .col-1').hasClass("collapse")) {

//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', flyOutWid - 103);
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', flyOutWid - 105).scrollLeft();
//                 $('.center-div.association-grid .fixed-top-header').css("width", $('.center-div.association-grid .fTHLC-inner-wrapper').width()-2);


//             } else {
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', flyOutWid - 179);
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', flyOutWid - 179).scrollLeft();
//                 $('.center-div.association-grid .fixed-top-header').css("width", $('.center-div.association-grid .fTHLC-inner-wrapper').width());

//             }

//         }
//     } else {
//         if (tableHIG-17 < canvasHIG) {
//              if($('.center-div .col-1').hasClass("collapse")) {
//                 $('.center-div.association-grid .fixed-top-header').width(cntrWidth - 121);
//                 $('.center-div.association-grid tr').last().children('td').css('margin-bottom', 19);
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css({'width': cntrWidth - 103});
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css({'width': cntrWidth - 103});


//              } else {

//                 $('.center-div.association-grid .fixed-top-header').width(cntrWidth - 195);
//                 $('.center-div.association-grid tr').last().children('td').css('margin-bottom', 19);
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css({'width': cntrWidth - 178});
//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css({'width': cntrWidth - 178});

//              }


//         } else {
//            if($('.center-div .col-1').hasClass("collapse")) {

//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 103);
//                 $('.center-div.association-grid .fixed-top-header').css('width', cntrWidth - 105);
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', cntrWidth - 102);


//             } else {

//                 $('.center-div.association-grid .fTHLC-inner-wrapper').css('width', cntrWidth - 176);
//                 $('.center-div.association-grid .fixed-top-header').css('width', cntrWidth- 176);
//                 $('.center-div.association-grid .fTHLC-outer-wrapper').css('width', cntrWidth - 176);

//             }


//         }
//     }

//     $('.center-div tr').last().children('td').addClass('border-bottom');
//     $('.center-div').find('.fTHLC-inner-wrapper').first().find('table').first().find('tr').last().children('td').addClass('border-bottom');



// }



/*end code here*/

function fixCollapseTable() {
    var sum = 0;
    $('.center-div .row-0 th.col-1').nextAll().each(function(i, v) {
        sum += parseInt($(v).width());
    });
    $('.center-div.account-grid table').css('width', sum + 8);
    $('body.firefox .center-div.account-grid table').css('width', sum + 20);
}

$(window).load(function() {
    var windowHeight = $(window).height();
    var rightHeaderHeight = $('.right-header').height(); 
    var footerHeight = $('.footer-temp').height(); 
    var cntrbarHeight = $('#ControlBar').height(); 
    var cntrHeight = windowHeight - (rightHeaderHeight+footerHeight+cntrbarHeight);

    $("#left-screen").css('height', ($(window).height() - 52) + 'px');
    $("#center-screen").css('height', cntrHeight + 'px');
    $("#right-screen").css('height', ($(window).height() - 52) + 'px');
    setWidthInitialy();

    $('.rightSectionWrap, .property-node-search').css('height', ($(window).height() - 227) + 'px');
    $('.right-tab-node').find('.tab-content').css('height', ($(window).height() - 200) + 'px');
    $('.rightSectionWrap, .property-node-search').css('height', ($(window).height() - 227) + 'px');
    //dialogueflyout();
    



    // var cntrHeight = $("#center-screen").height();
    // $(".center-div").css("height", cntrHeight - 34);
    // $("#main").css("height", cntrHeight);
    // var cntrWidth = $("#center-screen").width();
    // $('.center-div .fTHLC-outer-wrapper').css({
    //     'width': cntrWidth - 100,
    //     'height': cntrHeight - 30,
    //     'paddingLeft': 103
    // });
    // $('.center-div .fTHLC-inner-wrapper').css({
    //     'width': cntrWidth - 120,
    //     'height': cntrHeight - 30
    // });
    setInitalHeightWidth();

    $('body').on('click', '#second-class-div #node-wrapper .node-content', function() {
        
        //$("#second-class-div .node-selected").removeClass('node-selected');
        //$(this).closest("li:first").addClass("node-selected");



        //$(this).addClass("node-selected");
        setNodePosition();

        // $("#renamePopup .rename-value").val($('.node-selected .node-rename').html());
        // var index = $('.node-selected').attr("data-tab");

        // $(".entr-center-tab ul li").each(function(ind) {

        //     if (ind != (index - 1))
        //         $(this).find("a").removeClass("active");
        // });

    });

    $('body').on('click', '#fourh-class-div #node-wrapper .node-content', function() { 
           $("#fourh-class-div .property-selected").removeClass('property-selected');
           $(this).addClass("property-selected");
    });

    //Rename tab 

    $('.submit-val').click(function() {
        var storeVal = $.trim($('.rename-value').val());
        if (/[^a-zA-Z\-\_\.\s]/.test(storeVal)) {
            $(".error-msg").css("display", "block");
            $(".rename-value").val(" ");
            return false;

        } else {
            $(".error-msg").css("display", "none");
            if (storeVal != "") {
                $('.node-selected .node-rename').html(storeVal);
                $('.node-selected').attr("fullNameTabnode", storeVal);
                var tabdata = $('.node-selected').parent().attr("tab-data");
                var valueLength = storeVal.length;
                if (valueLength <= 9) {
                    var difference = 9 - valueLength;
                    for (i = 1; i <= difference; i++) {
                        storeVal += "&nbsp;&nbsp;";
                    }
                } else {
                    storeVal = storeVal.substr(0, 6) + '...';
                }
                $(".entr-center-tab ul li").each(function() {
                    var currenttab = $(this).attr('tab-index');
                    if ($(this).find('a').hasClass('active')) {

                        if (tabdata == currenttab) {
                            var renameValue = $.trim($('.rename-value').val());
                            $(this).attr("data-original-title", renameValue);
                            $(this).find('.ref-name').html(storeVal);
                        }
                    }
                });
                var storeValue = $('.rename-value').val();
                if (valueLength >= 19) {
                    storeValue = storeValue.substr(0, 16) + '...';
                }

                $(".DropDownTabList ul li").each(function(i, v) {
                    var currenttab = $(this).attr('tab-index');
                    if ($(this).hasClass('active')) {
                        if (tabdata == currenttab) {
                            $(this).find('.ref-name').html(storeValue);
                        }
                    }
                });
            }
        }
    });

    $('.rename-value').keyup(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $('.submit-val').trigger('click');
        }
    });
    //show rename modal in dblclick
    $('body').on('dblclick', '.node-rename', function(e) {

        $("#renamePopup").modal('show');
        $(".error-msg").css("display", "none");
        $("#renamePopup .rename-value").val('');
        e.stopPropagation();
    });

    //clicking on left side tab and if related tab is not avilable then 
    $('body').on('click', '.TabNodePerpective', function(e) {
        var fullnametabnodeValue = $(this).attr("fullnametabnode");
        $('.TabNodePerpective').each(function(i, v) {
            $(this).removeClass('node-selected');
        })
        $('.DropDownTabList li').each(function(i, v) {
            $(this).removeClass('active');
        });

        $('.tab-item a').each(function(i, v) {
            $(this).removeClass('active').find('div.tab-tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
        });

        $(this).addClass("node-selected");

        var storeVal = $('.node-selected').find('.node-rename').text();
        var valueLength = storeVal.length;

        if (valueLength <= 9) {
            var difference = 9 - valueLength;
            for (i = 1; i <= difference; i++) {
                storeVal += "&nbsp;&nbsp;";
            }
        } else {
            storeVal = storeVal.substr(0, 6) + '...';
        }

        var storeValue = $('.node-selected').find('.node-rename').text();
        if (valueLength >= 19) {
            storeValue = storeValue.substr(0, 16) + '...';
        }

        var midWidth = $("#center-screen").width();
        var tabdata = $('.node-selected').attr('tab-data');
        if (selectedGridId != tabdata) {
            $('#nodeFlyout').modal('hide');
            setGridWidth(selectedGridId);
        }

        selectedGridId = tabdata;

        $('.grid-div').css("display", "none");
        $('.grid-div').removeClass('center-div');
        $('.grid-div').each(function(i, v) {
            var gridId = $(this).attr('grid-id');
            if (gridId == tabdata) {
                $(this).css("display", "block");
                $(this).addClass('center-div');
            }
        });

        var flag = 0;
        $(".entr-center-tab ul li a").removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
        $(".entr-center-tab ul li").each(function(i, v) {
            var tabIndex = $(this).attr('tab-index');
            if (tabdata == tabIndex) {
                flag = 1;


                if ($(this).css("display") == "none") {
                    $(this).remove();
                    calculativeWidth = 0;
                    $('.tab-item').each(function(i, v) {
                        calculativeWidth += $(v).width();

                        if (calculativeWidth + 113 >= midWidth) {

                            $(this).hide();
                        }
                    });
                    var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="%Undefined%" class="tab-item" tab-index = ' + tabIndex + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">%name%</span> <span class="cross-tab fa fa-times"></span> </a> </li>';
                    var snippet = tabSnippet.replace('%name%', storeVal);
                    var snippett = snippet.replace('%Undefined%', fullnametabnodeValue);
                    $(".entr-center-tab ul").prepend(snippett);
                    if ($('.center-div').hasClass("manifest-Create")) {
                        $(".entr-center-tab ul li:first").addClass("manifest-Create");
                    }

                } else {
                    $(this).find('a').addClass('active').find('div.tab-node-circle').removeClass('node-white-circle').addClass('node-green-circle');
                }

            }

            $('.TabNodePerpective').removeClass('node-selected');




        });



        $(".DropDownTabList ul li").each(function(i, v) {
            var tabIndex = $(this).attr('tab-index');
            if (tabdata == tabIndex) {
                flag = 1;
                $(this).addClass('active');
            }
        });
        if (flag == 0) {
            var midWidth = $("#center-screen").width();
            if ((calculativeWidth + 113 >= midWidth)) {

                calculativeWidth = 0;
                $('.tab-item').each(function(i, v) {
                    calculativeWidth += $(v).width();
                    if (calculativeWidth + 113 >= midWidth) {
                        $(this).hide();
                    }
                    $('.detailNodeIcon').css("display", "block");
                });
                $(".entr-center-tab ul li a").removeClass("active");
                var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="%Undefined%" class="tab-item" tab-index = ' + tabdata + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">%name%</span> <span class="cross-tab fa fa-times"></span> </a> </li>';
                var snippet = tabSnippet.replace('%name%', storeVal);
                var snippett = snippet.replace('%Undefined%', fullnametabnodeValue);
                $(".entr-center-tab ul").prepend(snippett);
                $(".DropDownTabList ul li").removeClass('active');
                var snippett = '<li tab-index = ' + tabdata + ' class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">%name%</span></li>';
                var snippet = snippett.replace('%name%', storeValue);
                $(".DropDownTabList ul").prepend(snippet);
                if ($('.center-div').hasClass("manifest-Create")) {
                    $(".entr-center-tab ul li:first").addClass("manifest-Create");
                }

            } else {
                $(".entr-center-tab ul li a").removeClass("active");
                var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="%Undefined%" class="tab-item" tab-index = ' + tabdata + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">%name%</span> <span class="cross-tab fa fa-times"></span> </a> </li>';
                var snippet = tabSnippet.replace('%name%', storeVal);
                var snippett = snippet.replace('%Undefined%', fullnametabnodeValue);
                $(".entr-center-tab ul").prepend(snippett);
                $(".DropDownTabList ul li").removeClass('active');
                var snippett = '<li tab-index = ' + tabdata + ' class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">%name%</span></li>';
                var snippet = snippett.replace('%name%', storeValue);
                $(".DropDownTabList ul").prepend(snippet);
                if ($('.center-div').hasClass("manifest-Create")) {
                    $(".entr-center-tab ul li:first").addClass("manifest-Create");
                }

                calculativeWidth = 0;
                $('.tab-item').each(function(i, v) {
                    calculativeWidth += $(v).width();
                });
            }
        }
        setWidthInitialy();
        setTableWidth();
    });

    //active on tab click
    $('body').on('click', '.tab-item', function() {


        $('.tab-item a').each(function(i, v) {
            $(this).removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
        });

        $(this).find('a').addClass('active').find('div.tab-node-circle').removeClass('node-white-circle').addClass('node-green-circle');


        var tabIndex = $(this).attr('tab-index');
        
        var tabName = $(this).find('.ref-name').html();
        if(tabName == "Roles" || tabName == "Classes") 
            {
                $(".main-loader").show();
                $(".soniclass1").hide();
                getRightPaneHtml();
            }
            else 
            {
                $(".soniclass1").show();
                $(".main-loader").show();
                getRightPaneHtml1();
            }
        if (selectedGridId != tabIndex) {
            $('#nodeFlyout').modal('hide');
            setGridWidth(selectedGridId);
        }

        selectedGridId = tabIndex;
        $('.grid-div').css("display", "none");
        $('.grid-div').removeClass('center-div');
        $('.grid-div').each(function(i, v) {
            var gridId = $(this).attr('grid-id');
            if (gridId == tabIndex) {
                $(this).css("display", "block");
                $(this).addClass('center-div');
            }
        });

        $('.DropDownTabList li').each(function(i, v) {
            $(this).removeClass('active');
        })
        $('.DropDownTabList li').each(function(i, v) {
            var tabData = $(this).attr('tab-index');
            if (tabIndex == tabData) {
                $(this).addClass('active');
            }
        })
        $('.DropDownTabList ').css("display", "none");

        $('.TabNodePerpective').each(function(i, v) {
            $(this).find('.node-content').removeClass('node-selected');
            $(this).removeClass('node-selected');
        });
        $('.TabNodePerpective').each(function(i, v) {
            var tabData = $(this).attr('tab-data');
            if (tabData == 'tabIndex_000_0') {
                var nodePerpectiveName = $(this).attr('node-type-name');
                if (nodePerpectiveName == 'cell_' + tabName) {
                    $(this).addClass('node-selected');
                }
            } else {
                if (tabIndex == tabData) {
                    $(this).addClass('node-selected');
                }
            }
        });
        setWidthInitialy();
        setTableWidth();
    });

    //Image Icon List
    $('body').on('click', '.DropDownTabList li', function() {



        if (!$(this).hasClass('active')) {
            $('#nodeFlyout').modal('hide');
        }
        var midWidth = $("#center-screen").width();
        $('.DropDownTabList li').each(function(i, v) {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        $(this).parent().parent().css("display", "none");
        var tabIndex = $(this).attr('tab-index');
        var tabName = $(this).find('.ref-name').html();
        $('.grid-div').css("display", "none");
        $('.grid-div').removeClass('center-div');
        $('.grid-div').each(function(i, v) {
            var gridId = $(this).attr('grid-id');
            if (gridId == tabIndex) {
                $(this).css("display", "block");
                $(this).addClass('center-div');
            }
        });

        $('.tab-item a').each(function(i, v) {
            $(this).removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
        });
        $('.TabNodePerpective').each(function(i, v) {
            $(this).find('.node-content').removeClass('node-selected');
            $(this).removeClass('node-selected');
        });

        /*  var fullnametabnodeValue;
          $('.TabNodePerpective').each(function(i, v) {
              var tabData = $(this).attr('tab-data');
              if (tabIndex == tabData) {
                  $(this).addClass('node-selected');
                  fullnametabnodeValue = $(this).attr("fullnametabnode");
              }
          });*/

        var fullnametabnodeValue;
        $('.TabNodePerpective').each(function(i, v) {
            var tabData = $(this).attr('tab-data');
            if (tabData == 'tabIndex_000_0') {
                var nodePerpectiveName = $(this).attr('node-type-name');
                if (nodePerpectiveName == 'cell_' + tabName) {
                    $(this).addClass('node-selected');
                }
            } else {
                if (tabIndex == tabData) {
                    $(this).addClass('node-selected');
                    fullnametabnodeValue = $(this).attr("fullnametabnode");
                }
            }
        });


        var storeVal = $(this).find('.ref-name').text();

        var valueLength = storeVal.length;
        if (valueLength < 9) {
            var difference = 9 - valueLength;
            for (i = 1; i <= difference; i++) {
                storeVal += "&nbsp;&nbsp;";
            }
        } else {
            storeVal = storeVal.substr(0, 6) + '...';
        }

        $('.tab-item a').each(function(i, v) {
            var tabData = $(this).parent().attr('tab-index');
            if (tabIndex == tabData) {

                if ($(this).parent().css("display") === "none") {

                    $(this).parent().remove();
                    calculativeWidth = 0;
                    $('.tab-item').each(function(i, v) {
                        calculativeWidth += $(v).width();

                        if (calculativeWidth + 113 >= midWidth) {
                            $(this).hide();
                        }
                    });
                    var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="%Undefined%" class="tab-item" tab-index = ' + tabIndex + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">%name%</span> <span class="cross-tab">X</span> </a> </li>';
                    var snippet = tabSnippet.replace('%name%', storeVal);
                    var snippett = snippet.replace('%Undefined%', fullnametabnodeValue);
                    $(".entr-center-tab ul").prepend(snippett);
                    if ($('.center-div').hasClass("manifest-Create")) {
                        $(".entr-center-tab ul li:first").addClass("manifest-Create");
                    }
                } else {
                    $(this).addClass('active').find('div.tab-node-circle').removeClass('node-white-circle').addClass('node-green-circle');
                }

            }
        });
        setWidthInitialy();
        setTableWidth();

    });

    //delete tab
    $('body').on('click', '.cross-tab', function(e) {
        $('#nodeFlyout').modal('hide');
        $('.tooltip').remove();
        var tabdataattr = 0;
        var manifestindexId = 0;
        $('.tooltip').css("display", "none");
        var tabIndex = $(this).closest(".tab-item").attr('tab-index');
        if ($(this).closest(".tab-item").hasClass('manifest-Create')) {
            $('.tab-item.manifest-tab').each(function(i, v) {
                manifestindexId = $(v).attr('tab-index');
                var parentId = $(v).attr('parent-id');
                if (parentId == tabIndex) {
                    $(v).remove();
                    $("[grid-id=" + manifestindexId + "]").css("display", "none");
                }

            });
        }
        var nextTabindex = $(this).closest(".tab-item").next().attr('tab-index');
        if (nextTabindex == undefined) {
            nextTabindex = $(this).closest(".tab-item").prev().attr('tab-index');
        }


        $(this).closest(".tab-item").remove();
        if ($(this).hasClass())
            $('.tab-item a').each(function(i, v) {
                $(this).removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
            });

        $('.tab-item').each(function(i, v) {
            if ($(this).css("display") == "none") {
                $(this).css("display", "block");
                return false;
            }
        });

        $('.tab-item a').each(function(i, v) {
            var index = $(this).parent().attr('tab-index');
            if (index == nextTabindex) {
                $(this).addClass('active').find('div.tab-node-circle').addClass('node-green-circle').removeClass('node-white-circle');
            }
        });
        $('.grid-div').css("display", "none");
        $('.grid-div').removeClass("center-div");
        $('.grid-div').each(function(i, v) {
            var gridId = $(this).attr('grid-id');
            if (gridId == nextTabindex) {
                $(this).css("display", "block");
                $(this).addClass("center-div");
            }
        });

        $('.DropDownTabList li').each(function(i, v) {
            var index = $(this).attr('tab-index');
            if ((index == tabIndex) || (index == manifestindexId)) {
                $(this).remove();
            }
        });

        $('.DropDownTabList li').each(function(i, v) {
            $(this).removeClass('active');
        });

        $('.DropDownTabList li').each(function(i, v) {
            var index = $(this).attr('tab-index');
            if (index == nextTabindex) {
                $(this).addClass('active');
            }
        });

        var midWidth = $("#center-screen").width();
        calculativeWidth = 0;
        $('.tab-item').each(function(i, v) {
            calculativeWidth += $(v).width();
        });

        if (calculativeWidth <= midWidth) {
            $('.detailNodeIcon').css("display", "none");
            $('.DropDownTabList').css("display", "none");
        }

        $('.TabNodePerpective').each(function(i, v) {
            $(this).removeClass('node-selected');
        });

        $('.TabNodePerpective').each(function(i, v) {

            var tabData = $(this).attr('tab-data');
            if (nextTabindex == tabData) {

                $(this).addClass('node-selected');
                return false;
            }
        });
        setWidthInitialy();
        setTableWidth();
        e.stopPropagation();
    });
    //Image Icon Toggle
    $('body').on('click', '.detailNodeIcon', function() {
        $('.DropDownTabList').toggle();
    });
    //open a new tab in opeartion click
    $('body').on('click', '.operation-tab-node', function() {

        var midWidth = $("#center-screen").width();
        var parentId = $('.center-div').attr('grid-id');
        var manifestexist = false;
        $('.grid-div').each(function(){
           if($(this).hasClass('manifest')){
                manifestexist  = true
                
           }
        });

        if (manifestexist == true) {
            $('.grid-div.process-grid').css("display","none").addClass('center-div');
            $('.grid-div.manifest').css("display","block").removeClass('center-div');
            $('.list-tab a').removeClass("active");
            $('.manifest-tab a').addClass("active");
            // var tabId = 0;
            // $('.tab-item a').each(function(i, v) {
            //     $(this).removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
            // });
            // $('.grid-div').css("display", "none");
            // $('.grid-div').removeClass('center-div');
            // $('.grid-div').each(function(i, v) {
            //     var gridId = $(this).attr('parent-id');
            //     if (gridId == parentId) {
            //         tabId = $(this).attr('grid-id');
            //         $(this).css("display", "block");
            //         $(this).addClass('center-div');
            //     }
            // });

            // var flag = 0;
            // $(".entr-center-tab ul li a").removeClass('active').find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
            // $(".entr-center-tab ul li").each(function(i, v) {
            //     var tabIndex = $(this).attr('parent-id');
            //     if (tabIndex == parentId) {
            //         flag = 1;
            //         if ($(this).css("display") == "none") {
            //             $(this).remove();
            //             calculativeWidth = 0;
            //             $('.tab-item').each(function(i, v) {
            //                 calculativeWidth += $(v).width();

            //                 if (calculativeWidth + 113 >= midWidth) {
            //                     $(this).hide();
            //                 }
            //             });
            //             $(".entr-center-tab ul li a").removeClass("active");
            //             var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="Manifestation" class="tab-item manifest-tab" tab-index = ' + tabId + ' parent-id= ' + parentId + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">Manife...</span> <span class="cross-tab fa fa-times"></span> </a> </li>';
            //             $(".entr-center-tab ul").prepend(tabSnippet);

            //         } else {
            //             $(this).find('a').addClass('active').find('div.tab-node-circle').removeClass('node-white-circle').addClass('node-green-circle');
            //         }

            //     }
            // });

            // if (flag == 0) {
            //     calculativeWidth = 0;
            //     $('.tab-item').each(function(i, v) {
            //         calculativeWidth += $(v).width();

            //         if (calculativeWidth + 113 >= midWidth) {

            //             $(this).hide();
            //         }
            //     });
            //     $(".entr-center-tab ul li a").removeClass("active");
            //     var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="Manifestation" class="tab-item manifest-tab" tab-index = ' + tabId + ' parent-id= ' + parentId + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">Manife...</span> <span class="cross-tab fa fa-times"></span> </a> </li>';
            //     $(".entr-center-tab ul").prepend(tabSnippet);
            //     $(".DropDownTabList ul li").removeClass('active');
            //     var snippett = '<li tab-index = ' + tabId + ' class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">Manifestation</span></li>';
            //     $(".DropDownTabList ul").prepend(snippett);

            // }


        } else {
            $('.tab-item a').each(function(i, v) {
                if ($(this).hasClass('active')) {
                    $(this).parent().addClass('manifest-Create');
                }
            });
            $('.center-div').addClass('manifest-Create')
                //var operationValue = $(this).find('.custom-node').html();
            var operationValue = "Manifestation";

            var storeVal;
            var storeValue;
            var valueLength = operationValue.length;
            if (valueLength <= 9) {
                var difference = 9 - valueLength;
                for (i = 1; i <= difference; i++) {
                    storeVal += "&nbsp;&nbsp;";
                }
            } else {
                storeVal = operationValue.substr(0, 6) + '...';
            }

            if (valueLength >= 19) {
                storeValue = operationValue.substr(0, 16) + '...';
            } else {
                storeValue = operationValue;
            }

            $('.TabNodePerpective').each(function(i, v) {
                $(this).removeClass('node-selected');
            });

            displayLoader();
            $('#nodeFlyout').modal('hide');
            setGridWidth(selectedGridId);
            var initialWidth = 0;
            var tabIndex = 0;
            var midWidth = $("#center-screen").width();

            if ((calculativeWidth + 113 >= midWidth)) {
                if ($(".entr-center-tab ul").find('.detailNodeIcon').length == 0) {

                    var snippet = '<div class="detailNodeIcon" ><span class="rightNode1Icon"><img src="' + domainUrl + '/public/img/tab-arrow.png"></a></div>'
                    $(snippet).appendTo(".entr-center-tab ul");
                } else {
                    $('.detailNodeIcon').show();
                }
                calculativeWidth = 0;
                $('.tab-item').each(function(i, v) {
                    calculativeWidth += $(v).width();
                    if (calculativeWidth + 113 >= midWidth) {
                        $(this).hide();
                    }
                });
            }

            tabIndex = "tabIndex_" + new Date().getTime().toString();
            $('.entr-center-tab ul li a').each(function(i, v) {
                $(this).removeClass("active").find('div.tab-node-circle').removeClass('node-green-circle').addClass('node-white-circle');
            });

            var tabSnippet = '<li data-toggle="tooltip" data-placement="bottom"  data-original-title="Manifestation" class="tab-item manifest-tab" tab-index = ' + tabIndex + ' parent-Id = ' + parentId + '> <a href="#" class="active"> <div class="tab-node-circle node-green-circle">N</div><span class="ref-name">' + storeVal + '</span> <span class="cross-tab fa fa-times"></span> </a></li>';
            $(".entr-center-tab ul").prepend(tabSnippet);

            $(".DropDownTabList ul li").removeClass('active');
            var snippett = '<li tab-index = ' + tabIndex + ' class="active"><div class="node-circle node-white-circle show-col-wrap">N</div><span class="ref-name">' + storeValue + '</span></li>';
            $(".DropDownTabList ul").prepend(snippett);

            calculativeWidth = 0;
            $('.tab-item').each(function(i, v) {
                calculativeWidth += $(v).width();
            });

            $('.grid-div').each(function(i, v) {
                $(this).removeClass('center-div');
            });
            
            $('.left-side-heading').html('Manifestation');
            $.post(domainUrl + 'manifestation', {}, responceManifestation, 'HTML');
            //var snpmst = '<input type="hidden" id="manifeastid" value="manifest">';
            //$.post(domainUrl+'manifestation'+'/'+'createManifest',{},responseCallAction,'html');

            $('.center-div').scrollLeft(0);
            $('.show-auto-number').removeClass('hide-gridNumber');
        }
      setTableWidth();
        $('#operationPaneFlyout').animate({right:'-100%'}).removeClass('in');
        OperationPane();
    });

    $('.col-head-bk').click(function() {
    });
});

$(window).resize(function() {

    setWidthInitialy();
    setTableWidth();
    if(typeof DialogueFlyout == 'function') {
        DialogueFlyout();
    }
    if(typeof dualPaneHeight == 'function') {
        dualPaneHeight();
    }
    setColumnsH(); 
    setHeightThreePane();
    //dialogueflyout();


});

function setWidthInitialy() {
    var pixels = 100;
    var screenWidth = $(document).width();
    var windowWidth = $(window).outerWidth()
    var actionWrap = $('.user-action-wrap').outerWidth()
    var sidebarwrap = $('.sidebar_wrap').outerWidth()
    var centerwidth = windowWidth - (actionWrap+sidebarwrap);
    var windowHeight = $(window).height();
    var rightHeaderHeight = $('.right-header').height(); 
    var footerHeight = $('.footer-temp').height(); 
    var cntrbarHeight = $('#ControlBar').height(); 
    

    //var percentage = 100 * (screenWidth - 450) / screenWidth;
    $("#center-screen").css('width',centerwidth+"px");
    $("#left-screen").css('height', ($(window).height() - 52) + 'px');
    $(".node-left-col").css("height", ($("#left-screen").height() - 52) + 'px');
    if($(".breadcrumb-wrap").hasClass('breadcrumb-up')){

        $breadcrumbWrap = 10;
         var cntrHeight = windowHeight - (rightHeaderHeight+$breadcrumbWrap+cntrbarHeight);
         $("#center-screen").css('height', + cntrHeight +'px');
    } else {
        $breadcrumbWrap = 51;
         var cntrHeight = windowHeight - (rightHeaderHeight+$breadcrumbWrap+cntrbarHeight);
         $("#center-screen").css('height', + cntrHeight +'px');
    }
    var centerInnerHeight = '';
    var GetHig            = '';
	if($(".breadcrumb-wrap").hasClass('breadcrumb-up')){
		centerInnerHeight = (cntrHeight);
	}
	else{
		centerInnerHeight = (cntrHeight);
    }
   
    $(".grid-div,.association-grid").css("height",$("#center-screen").height() + 'px');
    $(".center-div.process-grid .fTHLC-outer-wrapper,.center-div.association-grid .fTHLC-outer-wrapper").css("height", $("#center-screen").height()+3 + 'px');
    $(".center-div.process-grid .fTHLC-inner-wrapper,.center-div.association-grid .fTHLC-inner-wrapper").css("height", centerInnerHeight + 'px');
    var cntrWidth = $("#center-screen").width();
    var cntrHeight = $("#center-screen").height();
    $('.center-div.account-grid').find('.fTHLC-inner-wrapper').css({
        'width': cntrWidth - 200,
        'height': cntrHeight-167
    });
    $('.center-div.account-grid').find('.fTHLC-outer-wrapper').css({
        'width': cntrWidth - 200,
        'height': cntrHeight
    });

    $(".center-div.manifest .fTHLC-outer-wrapper").css("height", ($("#center-screen").height()) + 'px');
    $(".center-div.manifest .fTHLC-inner-wrapper").css("height", ($("#center-screen").height()) + 'px');

    $("#right-screen").css('height', ($(window).height() - 52) + 'px');
    $('.class-bulider-section-modal #main').css('height', $('#center-screen').height() - 31);
    $('.rightSectionWrap, .property-node-search').css('height', ($(window).height() - 207) + 'px');
    
    if($(".breadcrumb-wrap").hasClass('breadcrumb-up')){
        GetHig          =   $('.fTHLC-inner-wrapper').outerHeight();
    }
    else{
        GetHig          =   $('.fTHLC-inner-wrapper').outerHeight();
    }
    var getTopHig = $('.center-div .fixed-top-header').outerHeight();
    $('.setnicescroll').height(GetHig-getTopHig);
}

function removeInteractiobborder() {
    $('.center-div .nodeFlyout').parent('td').css({
        'border-top': '1px solid #ccc',
        'border-bottom': '1px solid #ccc'
    });
    $('.center-div .new-Role').parent('td').css({
        'border-top': '0px',
        'border-bottom': '0px'
    });
    $('.center-div .new-Role').parent('td').parent('tr').next('tr').find('.role').css({
        'border-top': '0px',
        'border-bottom': '0px'
    });

    $('.center-div .new-Domain').parent('td').css({
        'border-top': '0px',
        'border-bottom': '0px'
    });
    $('.center-div .new-Domain').parent('td').parent('tr').next('tr').find('.domain').css({
        'border-top': '0px',
        'border-bottom': '0px'
    });
    $('.center-div .creation-node').siblings('.new-Role').parent('td').attr("style", "").addClass('disabled-role');

}

function flyoutHideSetWidth() {
    var cntrWidth = $("#center-screen").width();
    var canvasHIG = $(".center-div .fixed-left-column").height();
    var tableHIG = $(".center-div .fTHLC-inner-wrapper").height();
    var cntrHeight = $("#center-screen").height();
    if (tableHIG - 17 < canvasHIG) {
        if ($('.center-div .col-1').hasClass("collapse")) {
            $('.center-div .fixed-top-header').width(cntrWidth - 121);
            $('.center-div tr').last().children('td').css('margin-bottom', 19);
            $('.center-div .fTHLC-outer-wrapper').css({
                'width': cntrWidth - 103
            });
            $('.center-div .fTHLC-inner-wrapper').css({
                'width': cntrWidth - 103
            });

        } else {
            $('.center-div .fixed-top-header').width(cntrWidth - 195);
            $('.center-div tr').last().children('td').css('margin-bottom', 19);
            $('.center-div .fTHLC-outer-wrapper').css({
                'width': cntrWidth - 178
            });
            $('.center-div .fTHLC-inner-wrapper').css({
                'width': cntrWidth - 178
            });
        }


    } else {
        if ($('.center-div .col-1').hasClass("collapse")) {
           
            $('.center-div .fTHLC-inner-wrapper').css('width', cntrWidth - 103);
            $('.center-div .fixed-top-header').css('width', cntrWidth - 105);
            $('.center-div .fTHLC-outer-wrapper').css('width', cntrWidth - 102);

        } else {
            $('.center-div .fTHLC-inner-wrapper').css('width', cntrWidth - 176);
            $('.center-div .fixed-top-header').css('width', cntrWidth - 176);
            $('.center-div .fTHLC-outer-wrapper').css('width', cntrWidth - 176);
        }


    }

}

function removeClassSave() {
    $('.center-div .icons').each(function(i, v) {
        if ($(this).hasClass('showing')) {
            $(this).removeClass("showing");
            var get = $(this).siblings('input').attr('name');
            $('.center-div .' + get).first().removeClass('segment-node-input border-top-green');
            $('.center-div .' + get).removeClass('segment-node-input border-green bg-green');
            $('.center-div .' + get).last().removeClass('segment-node-input border-bottom-green');
            $('.center-div .' + get + '.operation1').closest('tr').prev('tr').children('td.operation1').first().removeClass('segment-node-input border-bottom-select');
            $(this).closest('.col-text').siblings('.node-white-circle').removeClass('segment-node-input node-green-circle');
            // $('li.tab-item a.active').find('.tab-node-circle').removeClass('node-green-circle');
            if (!$('.show-auto-number').hasClass('hide-gridNumber')) {
                $(this).siblings('.table-count').removeClass('hide');
            }
            $('.center-div .' + get).find('i.fa-bars').addClass('segment');
        }
    });
}


function setBreadCrumb() {
    // setTimeout(function(){

    //        if($('.gray-area').find('.grid-div').hasClass('center-div')){
    //            var textValue   =   $(this).find('span').text();
    //            var textStr     =   '<i class="fa fa-angle-right"></i><a href="#" class="node-title-text title-text node-circle node-white-circle" data-id="1"> '+textValue+' </a>';
    //            $('.node-breadcrumb').append(textStr);
    //        }

    //    },1000)
}

function removeTdColClass() {

    $(".center-div").each(function() {
        var $table = $(this);
        var $tbodyrows = $("tbody tr", $(this));
        var $theadrows = $("thead tr", $(this));

        $(this).find('tr').each(function() {
            var index = 0;
            $(this).find("td").each(function(cell, va) {
                $('.center-div td').removeClass('col-' + index);
                index++;
            });
        });
    });
}

function setTdColClass() {
    $(".center-div").each(function() {
        var $table = $(this);
        var $tbodyrows = $("tbody tr", $(this));
        var $theadrows = $("thead tr", $(this));
        var index;

        $(this).find('tr').each(function() {
            index = 0;

            $(this).find("td").each(function(cell, va) {
                // remove any existing, wrong col class
                var tdClass = $(this).attr('class');
                var newC = $.grep(tdClass.split(" "), function(v, i) {
                    return v.replace(/\bcol-[\d].?\b/g, '')
                }).join(' ');
                $(this).attr('class', '');

                // add the correct col class
                $(this).addClass(newC + ' col-' + index);
                index++;
            });
        });
    });
}

function showStatusDrp() {
    $('body').on('click', '.add-staus', function() {
        $(this).siblings('.add-col-wrap').children('ul').addClass('show')

    });
}


function setNodePosition() {
    $('#left-screen .node-content').css({
        'margin-left': 0,
        'padding-left': 0
    });
    // $('#left-screen .node-content').find('.node-circle').removeClass('node-green-circle-expanded');
    // $('#left-screen .node-content').find('.node-circle').removeClass('node-green-circle')


    if ($('#left-screen .node-content').hasClass('node-selected')) {

        var nodeLeftPos = $('#left-screen .node-content.node-selected').offset().left;

        $('#left-screen .node-content.node-selected').css({
            'margin-left': -nodeLeftPos,
            'padding-left': nodeLeftPos
        });

        // if($('.node-content.node-selected').find('.node-circle').hasClass('node-white-circle-expanded')){
        //     $('.node-content.node-selected').find('.node-circle').addClass('node-green-circle-expanded')
        // }
        // else if($('.node-content.node-selected').find('.node-circle').hasClass('node-white-circle')){
        //     $('.node-content.node-selected').find('.node-circle').addClass('node-green-circle')
        // }

    }
    // else if($('li.node-selected').find('.node-circle').hasClass('node-white-circle-expanded')){
    //         alert(1)
    //             $('li.node-selected').removeClass('node-green-circle-expanded');
    //     }

}


// function setPoupPosition(){
//     var WinHig      =       $(window).height()/2;
//     var WinWid      =       $(window).width()/2;
//     var PoupHig     =       $('.series-popup.modal.fade.in').outerHeight()/2;
//     var PoupWid     =       $('.series-popup.modal.fade.in').outerWidth()/2;

//     popupTop        =       WinHig - PoupHig;
//     popupLeft       =       WinWid - PoupWid;

//     $('.series-popup.modal.fade.in').css('top',popupTop);
//     $('.series-popup.modal.fade.in').css('left',popupLeft);
// }
function setliwidth() {
    $('.left-manu-bar [role="menuitem"]').each(function(i, v) {
        $(this).css({
            'margin-left': 0,
            'padding-left': 0
        });
        var leftposition = 212 - $(this).width();
        $(this).css({
            'margin-left': -leftposition,
            'padding-left': leftposition
        });
    });
}


/*
 * Created by Divya Rajput
 * Date: 28 Dec, 2015
 * Modified By Amit Malakar
 * Date: 11 Jan, 2016
 * Save process structure in series Array
 * As shown in class structure as a DRAFT
 */
var course = [];
function saveAssociationProcess() {
    //for counting column
    var total_column                = parseInt($('.center-div').find('table.fixed-left-column tr').eq(0).find('td').length) - 2;
    
    if($('.production_title:eq(1)').val()!= undefined ){
        var proctuctTypetitle           = $('.production_title:eq(1)').val();    
    }else {
        var proctuctTypetitle           = $('.production_title').val();
    }
    

    //for counting row
    var total_rows                  = parseInt($('.center-div').find('table.fixed-left-column tr').length) - 1;
    var period_count                = parseInt(total_rows) - 1;

    course                          = [];
    var series                      = [];
    var series_title                = '';
    var series_column               = '';
    var series_temp_update          = '';

    var segment                     = [];
    var segment_type                = '';
    var segment_title               = '';
    var segment_temp_update         = '';

    var production_series           = '';
    var production_segment          = '';
    var production_event            = 0;
    var production_period           = '';
    var selected_segment            = '';
    var total_period                = parseInt(total_column) * parseInt(period_count);

    var rowData                     = $('table.fixed-left-column tr');

    for (var i = 1; i <= total_column; i++) {

        series_title  = $('.center-div .fixed-top-header tr.row-1 td.col-' + parseInt(i)).find('span.col-head-title').text();
        if(series_title == '' && $("#hidden-instance_id").val()==""){
            series_title  = $('table.fixed-left-column tr.row-1 td.col-' + parseInt(i)).first().find('span.col-head-title').text();
        }
        
        series_column = i;

        var segments = [];
        if (i == 1) {
            segment_start_column = 2;
            segment_end_column   = total_rows;
            segments[0]          = {
                "seg_title": '',
                "segment_temp_update":segment_temp_update, 
                "seg_type": '',
                "seg_start": segment_start_column,
                "seg_end": segment_end_column,
                "seg_active": 'false',
                "seg_complete": 'false'
            };

            series.push({title: series_title, type: 'Phase', column_sequence: series_column, series_active:'false', series_complete: 'false', "segmentData": segments});
        } else {
            //loop for rows
            var k                  = 0;
            var l                  = 0;
            var m                  = 0;
            var n                  = 0;
            var o                  = -1;
            var ser_active_flag    = 0;
            var ser_complete_flag  = 1;

            for (var j = 2; j <= total_rows; j++) {

                var seg_active = $(rowData).eq(j).children('td').eq(i).is('.border-green, .bg-green') ? 'true' : 'false';
                if($('#course-path-number').hasClass('On')) {
                    var seg_complete = $(rowData).eq(j).children('td').eq(i).hasClass('show_number_grey') ? 'false' : 'true';
                } else {    // as not on simulate mode some have show_number_grey class
                    var seg_complete = 'false';
                }
                // series state active true if any segment state active is true
                if(seg_active == 'true') {
                    ser_active_flag = 1;
                    if($(rowData).eq(j).children('td').eq(i).find('span.table-count.activeNum').length) {
                        //var production_event = 0;
                        cellNum = $.grep($(rowData).eq(j).children('td').eq(i).attr('class').split(" "), function(v, i) {
                            return v.indexOf('cell_') === 0;
                        }).join();
                        cellNumArr = cellNum.split('_');
                        selectedRowNum = cellNumArr[1];
                        production_series = i;
                        if ($.trim(series_title) === '.Event') {
                            // find segments rank in prev column
                            selected_segment = i - 1;
                            for (var k = 2; k <= selectedRowNum; k++) {
                                $(rowData).eq(k).children('td').eq(i).each(function(){
                                    if($(this).find('span.table-count').length)
                                        production_event++;
                                });
                            }
                        } else {
                            // find segments rank in same column
                            selected_segment = i;
                            production_event = '#';
                        }
                        production_period = j - 1;

                        var parentClassNameArr = [];

                        for (var k = 2; k <= total_rows; k++) {
                            $(rowData).eq(k).children('td').eq(selected_segment).each(function() {
                                allParentClassName = $.grep($(this).attr('class').split(" "), function(v, i) {
                                    return v.indexOf('parent_') === 0;
                                }).join();
                                if(parentClassNameArr.indexOf(allParentClassName) == -1 && allParentClassName.trim() != '')
                                    parentClassNameArr.push(allParentClassName);
                            });
                        }

                        parentClassName = $.grep($(rowData).eq(j).children('td').eq(selected_segment).attr('class').split(" "), function(v, i) {
                            return v.indexOf('parent_') === 0;
                        }).join();
                        production_series = selected_segment;
                        production_segment = parentClassNameArr.indexOf(parentClassName) + 1;
                    }
                }
                // series state complete true if all segment state complete is true
                if(seg_complete == 'false')
                    ser_complete_flag = 0;

                if ($.trim(series_title) === '.Event') {

                    if ($(rowData).eq(j).children('td').eq(i).find('span').hasClass('creation')) {
                        k             = j;
                        segment_title = 'Creation'; //$(rowData).eq(j).find('span.custom-node').text();
                        segment_temp_update = $(rowData).eq(j).children('td').eq(i).find('input.custom-node-hidden').val();
                        segment_type         = '';
                        segment_start_column = j;
                        segment_end_column   = j;
                        k++;
                        segments[l]          = {
                            "seg_title": segment_title,
                            "segment_temp_update": segment_temp_update,
                            "seg_type": segment_type,
                            "seg_start": segment_start_column,
                            "seg_end": segment_end_column,
                            "seg_active": seg_active,
                            "seg_complete": seg_complete
                        };
                    } else if ($(rowData).eq(j).children('td').eq(i).find('span').hasClass('destructure')) {
                        segment_title = 'Destruction'; //$(rowData).eq(j).find('span.custom-node').text();
                        segment_type         = '';
                        segment_start_column = j;
                        segment_end_column   = j;
                        n                    = m + 1;
                        l                    = ++m;
                        segments[n]          = {
                            "seg_title": segment_title,
                            "segment_temp_update":segment_temp_update, 
                            "seg_type": segment_type,
                            "seg_start": segment_start_column,
                            "seg_end": segment_end_column,
                            "seg_active": seg_active,
                            "seg_complete": seg_complete
                        };
                        l++;
                        m++;
                        n++;
                    } else {
                        m                    = parseInt(n) + 1;
                        l                    = parseInt(n) + 2;
                        segment_title        = '';
                        segment_temp_update  = $(rowData).eq(j).children('td').eq(i).find('input.custom-node-hidden').val();
                        segment_type         = '';
                        segment_start_column = k;
                        segment_end_column   = j;
                        segments[m]          = {
                            "seg_title": segment_title,
                            "segment_temp_update":segment_temp_update,
                            "seg_type": segment_type,
                            "seg_start": segment_start_column,
                            "seg_end": segment_end_column,
                            "seg_active": seg_active,
                            "seg_complete": seg_complete
                        };
                    }
                } else {

                    if ($(rowData).eq(j).children('td').eq(i).hasClass('process-series')) {
                        ++o;
                        if ($(rowData).eq(j).children('td').eq(i).hasClass('fill')) {
                            segment_title = $(rowData).eq(j).find('td').eq(i).find('span.custom-node').text();
                        } else {
                            segment_title = '';
                        }

                        segment_temp_update         = $(rowData).eq(j).children('td').eq(i).find('input.custom-node-hidden').val();
                        segment_type         = '';
                        segment_start_column = j;
                        segment_end_column   = j;
                        segments[o]          = {
                            "seg_title": segment_title,
                            "segment_temp_update":segment_temp_update,
                            "seg_type": segment_type,
                            "seg_start": segment_start_column,
                            "seg_end": segment_end_column,
                            "seg_active": seg_active,
                            "seg_complete": seg_complete
                        };
                    } else {
                        var parentExistsCheck = $(rowData).eq(j).children('td').eq(i).attr('class');
                        var parentExists = $.grep(parentExistsCheck.split(" "), function(v, i) {
                            return v.indexOf('parent_') === 0;
                        }).join();
                        if ($(rowData).eq(j).children('td').eq(i).hasClass('cell_' + j + '_' + i) == $(rowData).eq(j).children('td').eq(i).hasClass('parent_' + j + '_' + i)) {
                            m                     = j;
                            ++o;
                            if($(rowData).eq(j).find('td').eq(i).find('input.custom-node').length) {
                                /*Change alt to colValue*/
                                segment_title         = $(rowData).eq(j).find('td').eq(i).find('input.custom-node').attr('colValue');
                            } else {
                                segment_title         = $(rowData).eq(j).find('td').eq(i).find('span.custom-node').text();
                            }
                            segment_temp_update     = $(rowData).eq(j).find('td').eq(i).find('input.custom-node-hidden').val();
                            segment_type          = '';
                            segment_start_column  = j;
                            segment_end_column    = j;
                            var segment_title_new = segment_title;
                            var segment_temp        = segment_temp_update;
                            segments[o]           = {
                                "seg_title": segment_title,
                                "segment_temp_update":segment_temp_update,
                                "seg_type": segment_type,
                                "seg_start": segment_start_column,
                                "seg_end": segment_end_column,
                                "seg_active": seg_active,
                                "seg_complete": seg_complete
                            };
                        } else if (parentExists == '' && $(rowData).eq(j).children('td').eq(i).hasClass('cell_' + j + '_' + i) == $(rowData).eq(j).children('td').eq(i).hasClass('blankSeg_' + j + '_' + i)) {
                            m                     = j;
                            ++o;
                            segment_title         = '';
                            segment_type          = '';
                            segment_start_column  = j;
                            segment_end_column    = j;
                            var segment_title_new = segment_title;
                            segments[o]           = {
                                "seg_title": segment_title,
                                "seg_type": segment_type,
                                "seg_start": segment_start_column,
                                "seg_end": segment_end_column,
                                "seg_active": seg_active,
                                "seg_complete": seg_complete
                            };
                        } else {
                            segment_title        = segment_title_new;
                            segment_temp_update  = segment_temp;
                            segment_type         = '';
                            segment_start_column = m;
                            segment_end_column   = j;
                            segments[o]          = {
                                "seg_title": segment_title,
                                "segment_temp_update":segment_temp_update,
                                "seg_type": segment_type,
                                "seg_start": segment_start_column,
                                "seg_end": segment_end_column,
                                "seg_active": seg_active,
                                "seg_complete": seg_complete
                            };
                        }
                    }
                }

                if (j == total_rows) {
                    series.push({
                        title: series_title,
                        type: 'Phase',
                        column_sequence: series_column,
                        series_active: ser_active_flag==1 ? 'true': 'false',
                        series_complete: ser_complete_flag==1 ? 'true': 'false',
                        "segmentData": segments
                    });
                }
            }
        }
    }
    

    course.push({
        course_template                     : 'course_template',
        course_title                        : 'course_title',
        course_description                  : 'course_description',
        course_objectives                   : 'course_objectives',
        "productionData": {
            production_title                : proctuctTypetitle,
            production_type                 : $('#ControlBar').find('.left-side-heading').html(),
            production_description          : '',
            production_rows                 : period_count,
            production_columns              : total_column,
            production_cells                : total_period,
            production_series               : production_series,
            production_segment              : production_segment,
            production_event                : production_event,
            production_period               : production_period,
            "seriesData"                    : series
        }
    });


}
/*End Here*/

/*
* Created By Divya Rajput
* On Date: Dec 30, 2015
* Save association structure in node-instance and node-instance-property
* As shown in class structure
*/
function saveAssociationProcessProperty(saveType)
{
    NProgress.start();
    saveAssociationProcess();
    var myJsonString        = JSON.stringify(course);
    var node_instance_id    = $('#hidden-instance_id').val();

    /*added by divya
    * to remove green color as highlighted when remain in view mode
    */
    $('div.center-div td.ExcelTablerow, td.ExcelTableFormationCol').removeClass('border-top-green border-green bg-green border-right-green border-bottom-green border-bottom-select');
    $('div.center-div td.ExcelTablerow, td.ExcelTableFormationCol').find('.node-green-circle, .dark-gray').removeClass('node-green-circle dark-gray');
    /*End Here*/


    /*
    $('.center-div  .bg-green').removeClass('bg-green');
    $('.center-div  .border-top-green').removeClass('border-top-green');
    $('.center-div  .border-bottom-green').removeClass('border-bottom-green');
    $('.center-div  .border-green').removeClass('border-green');
    $('.center-div  .border-bottom-select').removeClass('border-bottom-select')
    $('.center-div  td').find('.node-green-circle').removeClass('node-green-circle');
    */

    // <<< Amit Malakar
        //console.log(myJsonString);
        //NProgress.done();
        //return false;
    // >>> Amit Malakar

    $.post(domainUrl+'associations/saveAssociationInstanceData', {
        'course_class_id': domain_course_class_id,
        'production_class_id': domain_production_class_id,
        'series_class_id': domain_series_class_id,
        'segment_class_id': domain_segment_class_id,
        'propertyJson': myJsonString,
        'saveType': saveType,
        'node_instance_id': node_instance_id
    },responseSaveAssociationProcessProperty,'HTML');
}

function responseSaveAssociationProcessProperty(data, source)
{
    res = JSON.parse(data);

    
     $('.main-title-wrap').children('#temp_node_span').remove();
     $('.main-title-wrap').children('#temp_node_span').html('');
    //$('.nodeIdCount').html("( "+res.node_id+" )");
    $('#ControlBar').find('.left-side-heading').after('<span class="nodeIdCount" id="temp_node_span"><span>( '+res.node_id+' )</span><span class="colon">:</span><span class="refCourseTitle"><span class="refCourseTitleEdit"><input type="text" value="" name="productiontitle" class="production_title form-control input-field" placeholder="Undefined"><i class="icon tick"></i></span><span class="refCourseTitleView hide"><label>Undefined</label><i class="icon sm-edit"></i></span></span></span>');

    $('input.custom-node').each(function(){

        /*var string_val      = $(this).attr('placeholder');*/
        /*change alt to colValue*/

        var string_val      = $.trim($(this).attr('colValue'));
        var replace_html_string = '<span class="editable-field">'+$.trim(string_val)+'</span>';
        $(this).replaceWith(replace_html_string);
    });

    $('#temp_column_count').attr('value', parseInt(res.columns));
    $('#temp_rows_count').attr('value', parseInt(res.trrows));
    
    disablePlusIcon();

    showAssociationProcessRightMenuInViewMode(res.node_instance_id, res.savetypestatus);

    NProgress.done();
}

function showAssociationProcessRightMenuInViewMode(instance_id, savetypestatus)
{
    $('#hidden-instance_id').attr('value',parseInt(instance_id));
    $('#association_action_menu .user-roles').css('display','none');

    if($.trim(savetypestatus) == 'D'){
        $('#association_action_menu .edit-association').removeClass('inactiveLink').css('display','block');
        $('#association_action_menu .instance-view').removeClass('inactiveLink').css('display','block');
    }else{
        $('#association_action_menu .edit-association').addClass('inactiveLink').css('display','block');
        $('#association_action_menu .instance-view').removeClass('inactiveLink').css('display','block');
    }
    
}
/*End Here*/

/*
* Created By Divya Rajput
* On Date: Jan 5, 2016
*/
$(document).ready(function(){
    
    /*
    * Commented BY Divya Rajput
    * ON date: 27th April 2016
    * below three functions
    */

    /*on blur association input value, put value with ... */
    /*$('body').on('blur', '.center-div input.custom-node', function(e){
        var blur_change_value        = $.trim($(this).val());

        $(this).attr('alt', blur_change_value);
            
        if($(this).val().length > 8){ 
            blur_change_value        = blur_change_value.substr(0,5);
            blur_change_value        = blur_change_value+'...';
            $(this).attr('value', blur_change_value);
            $(this).val(blur_change_value);
        }else{
            $(this).attr('value', blur_change_value);
        }                 
            
        $(this).attr('placeholder', 'Undefined');      
    });*/

    /*on click association input value, put whole value removing ... */
    /*$('body').on('click', '.center-div input.custom-node', function(e){

        if($(this).is(':focus')){
            var click_change_value        = $.trim($(this).attr('alt'));
            if(click_change_value == 'Undefined'){

            }else{
                if(click_change_value != ''){
                    $(this).attr('value', click_change_value);
                    $(this).val(click_change_value);
                } 
            }
            $(this).attr('placeholder', 'Undefined');
        }
    });*/

    /*on using tab, association input value, put whole value removing ... */
    /*$('body').on('keydown', '.center-div input.custom-node', function(e){
        if(e.keyCode == 9){
            $('.center-div input.custom-node').trigger('click');             
            e.stopPropagation();       
        }
    });*/
    });
/*End Here*/


/*Created By Divya Rajput*/
function showDefaultView()
{
    bootbox.confirm("Are you sure you want to cancel?", function(confirmed) {
        if (confirmed) {
            var hidden_instance_id  = parseInt($('#hidden-instance_id').val());    

            if(hidden_instance_id > 0){

                NProgress.start();
                displayLoader();

                $.post(domainUrl+'associations/composeClassStructure',{'node_class_id':domain_production_class_id, 'node_instance_id':hidden_instance_id},gridInstanceResponse,'html');
            
            }else{ 

                $(".center-div").remove(); 
                $("#ControlBar").css('display','none');     
            }

            /*change alt to colValue*/
            $('input.custom-node').each(function(){
                var string_val      = $.trim($(this).attr('colValue'));
                var replace_html_string = '<span class="editable-field">'+$.trim(string_val)+'</span>';
                $(this).replaceWith(replace_html_string);
            });
            $(".production_title").attr("readonly",true);
            showMenuInViewMode(hidden_instance_id);
            $('#association_action_menu').hide();
        }
    });
}


/*grid navigation*/
var htmlElm,
 gridNavigation = {
	/* settings: {
		arrayNum_new: $('.fixed-left-column:last').find('.table-count')
	},
	init: function() {
		htmlElm = this.settings;
		this.bingUIActions();
	},
	bingUIActions: function() {
		
	}, */
    nextNumSelect: function() {
        var $arrayNum = $('.fixed-left-column:last').find('.table-count');
        var active = $arrayNum.filter('.activeNum');
        var activeIndex = active.data('id')
        activeIndex++;
        var next = (active.length !== 0) ? $arrayNum.filter('[data-id=' + (activeIndex) + ']') : $arrayNum.filter('[data-id=1]');
        $('.center-div span.icons').removeClass('showing');
        $arrayNum.removeClass('activeNum');
        $(next).last().addClass('activeNum');
        $('.fixed-left-column').find('.bg-green').removeClass('border-green bg-green border-bottom-green border-top-green');
        var parentClassName = $('.activeNum:last').closest('.ExcelTablerow').prev()[0].className.match(/parent_[_0-9]*/);
        if (parentClassName && activeIndex !== 1 && activeIndex !== $arrayNum.length && !($('.' + parentClassName).find('.table-count').length)) {
            $('.' + parentClassName).removeClass('show_number_grey').addClass('border-green bg-green');
            $('.' + parentClassName).first().addClass('border-top-green').end().last().addClass('border-bottom-green');
			$('.activeNum').closest('td').removeClass('show_number_grey').addClass('border-green bg-green border-bottom-green')
        } else {
            $('.activeNum').closest('td').removeClass('show_number_grey').addClass('border-green bg-green border-bottom-green')
        }
        if ($('.prevBtn').parent().hasClass('disable')) {
            $('.prevBtn').parent().removeClass('disable');
            $('.prevBtn').attr('onclick', 'gridNavigation.prevNumSelect()')
        }
        if (activeIndex == $arrayNum.length) {
            $('.nextBtn').parent().addClass('disable');
            $('.nextBtn').removeAttr('onclick', 'nextNumSelect')
        }
    },
    prevNumSelect: function() {
        var $arrayNum = $('.fixed-left-column:last').find('.table-count');
        var active = $arrayNum.filter('.activeNum');
        var activeIndex = active.data('id');
        activeIndex--;
        var prev = $arrayNum.filter('[data-id=' + (activeIndex) + ']');
        $arrayNum.removeClass('activeNum');
        $(prev).last().addClass('activeNum');
        $('.fixed-left-column').find('.bg-green').removeClass('border-green bg-green border-bottom-green border-top-green');
        var parentClassName = $('.activeNum:last').closest('.ExcelTablerow').prev()[0].className.match(/parent_[_0-9]*/);
        if (parentClassName && activeIndex !== 1 && !($('.' + parentClassName).find('.table-count').length)) {
            $('.' + parentClassName).addClass('border-green bg-green');
            $('.' + parentClassName).first().addClass('border-top-green').end().last().addClass('border-bottom-green');
            $('.activeNum').closest('td').addClass('border-green bg-green border-bottom-green')
        } else {
            $('.activeNum').closest('td').addClass('border-green bg-green border-bottom-green')
        }
        if ($('.nextBtn').parent().hasClass('disable')) {
            $('.nextBtn').parent().removeClass('disable');
            $('.nextBtn').attr('onclick', 'gridNavigation.nextNumSelect()')
        }
        if (activeIndex == 1) {
            $('.prevBtn').parent().addClass('disable');
            $('.prevBtn').removeAttr('onclick', 'prevNumSelect')
        }
    },
    changeColor: function() {
        $('.fixed-left-column').find('.bg-green').removeClass('border-green bg-green border-bottom-green');
        $('.table-count').removeClass('activeNum');
        $('.table-count:first').addClass('activeNum');
        $('.activeNum').closest('td').addClass('border-green bg-green border-bottom-green');
        if ($('.nextBtn').parent().hasClass('disable')) {
            $('.nextBtn').parent().removeClass('disable');
            $('.nextBtn').attr('onclick', 'nextNumSelect()')
        }
        $('.fixed-left-column [class*=parent_]').removeClass('show_number_grey');
        $('.fixed-left-column [class*=parent_]').not(':first').nextAll().addClass('show_number_grey');

    },
    numberSelection: function(currentElm, numClick) {
        var parentClassName;
        var tableCount = ('.table-count');
        $(tableCount).removeClass('activeNum');
        $('.center-div span.icons').removeClass('showing');

        $(currentElm).closest('td').first().find('.center-div span.icons').addClass('showing');
        if (numClick) {
			if($(currentElm).find('.table-count').data('id') !== 1 && $(currentElm).find('.table-count').data('id') !== $('.creation-node').find('.table-count').length ){
				parentClassName = $(currentElm).closest('.ExcelTablerow').prev()[0].className.match(/parent_[_0-9]*/);
				$('.' + parentClassName).removeClass('show_number_grey').addClass('border-green bg-green');
				$('.' + parentClassName).first().addClass('border-top-green').end().last().addClass('border-bottom-green');
            }
            $(currentElm).closest('td').find('.table-count').addClass('activeNum');
        } else {
            parentClassName = $(currentElm).closest('.ExcelTablerow').next()[0].className.match(/parent_[_0-9]*/);
            $('.' + parentClassName).first().addClass('border-top-green border-green border-bottom-green bg-green')
                .find('.table-count').addClass('activeNum');
        }

    }
}//end of gridNavigation Object

function saveGridNav(){
    saveAssociationProcessProperty('P');
}

function openSheduleBuilder() {
    $('body').on('click','.col-head', function(e){ 
        $(this).toggleClass('openthreepane');
        if($(this).hasClass('openthreepane')){
            $("#scheduleBuilder").animate({"right":"0"}, 300, function(){
                $("#scheduleBuilder").addClass("in");  
                 $('.nano').nanoScroller();
            });
        }
        else{
            $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
               $("#scheduleBuilder").removeClass("in"); 
               $('.col-head.openthreepane').removeClass('openthreepane'); 
            });  
        }
        threepaneSlide();
        e.stopPropagation();  
    });
    $('body').on('click','.closeSheduleBuilder', function(e){ 
        $("#scheduleBuilder").animate({"right":"-100%"}, 300, function(){
            $("#scheduleBuilder").removeClass("in");  
            $('.col-head.openthreepane').removeClass('openthreepane');
        });  
    });
}

/* hide dropdown on document */

$(document).click(function(){
   if($(".add-col-wrap .dropdown-menu").hasClass("show")){
       $(".add-col-wrap .dropdown-menu").removeClass("show");
       $("td.ExcelTableFormationCol i, td.ExcelTablerow i").removeClass("active show-icon show");
    }
});


/* hide dropdown on document */

/* hide dropdown on modal open */

$(".add-col-wrap .sub-item li[data-target='#addSeriespoup']").click(function(){
    if($(".series-popup").hasClass("in")){
          $(".add-col-wrap .dropdown-menu").addClass("show");
      }
      else{
          $(".add-col-wrap .dropdown-menu").removeClass("show");
    }

});

/* hide dropdown on modal open */
window.puJsFileLoadCounter++;



