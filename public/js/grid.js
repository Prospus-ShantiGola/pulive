/*
 * Created by Amit Malakar
 * Date: 31-Mar-2016.
 * JS for Grid
 */

/* =========================== Code By Amit Malakar ===========================*/
var trDataJson = [];

/* Convert Html Table to JSON
 * Amit Malakar
 * Date: 31-Mar-2016
 */
function grdHtmlToJson() {
    //console.log('grdHtmlToJson');
    trDataJson = [];
    // get first two rows from header
    $(".center-div div.fixed-top-header tr").each(function() {
        var tdData = [];
        $(this).find('td').each(function(){
            var css = $(this).attr('class');
            var html = $.trim($(this).html()).replace(/\s+/g, " ");
            tdData.push({'c': css, 'h': html});
        });
        trDataJson.push({'c': $(this).attr('class'), 'h':tdData });
    });
    // get rest of the rows
    $(".center-div table.fixed-left-column tr:gt(1)").each(function() {
        var tdData = [];
        $(this).find('td').each(function(){
            var css = $(this).attr('class');
            var html = $.trim($(this).html()).replace(/\s+/g, " ");
            tdData.push({'c': css, 'h': html});
        });
        trDataJson.push({'c': $(this).attr('class'), 'h':tdData });
    });
    return trDataJson;
}

/*
 * Find event cols
 * Amit Malakar
 * Date: 27-Apr-2016
 * @return: array
 */
function grdFindEventCols() {
    var eventCols = [];
    for(var col = 0; col < trDataJson[1].h.length; col++) {
        text = $.trim($(trDataJson[1].h[col].h).text()).replace(/\s/g, "");
        if(text == 'N.Event' || text == 'NTimeline') {
            eventCols.push(col);
        }
    }
    return eventCols;
}

/* Convert JSON to Html Table
 * not in use directly
 * Amit Malakar
 * Date: 31-Mar-2016
 */
function grdJsonToHtml() {
    var tableData = '';
    var eventCols = grdFindEventCols();
    trDataJson.forEach(function(tr) {
        tableData +=	'<tr class="'+tr.c+'">';
        var col = 0;
        tr.h.forEach(function(td) {
            if($.inArray(col,eventCols) > -1) {
                td.c += ' collapse';
            }
            tableData += '<td class="'+td.c+'">'+td.h+'</td>';
            col++;
        });
        tableData += '</tr>';
    });
    return tableData;
}

/* Update CSS in JSON
 * Amit Malakar
 * Date: 31-Mar-2016
 */
function grdUpdateJsonCss() {
    console.time('updateJsonCss');

    var eventCols = grdFindEventCols();
    $.each(trDataJson, function(row_index,row_value){
        row_value.c = 'row-' + row_index;
        //console.log(row_index + ' - ' + row_value.c);
        $.each(row_value.h, function(col_index, col_value){
            //console.log(row_index + ' > ' + col_index);
            if(col_index ==0 && row_index!=0) {
                col_value.h  = '<div class="left-col">'+ row_index + '</div>';
            } else if(row_index == 0) {
                col_value.h = col_value.h.replace(/(<span class="top-col[\s\w-="]*">)([^<]*)(<\/span>)/, "$1"+col_index+"$3");
            }
            col_value.c = col_value.c.replace(/(col-[\d]*)/g, "");                  // remove col class
            col_value.c = col_value.c.replace(/(cell[_\d]*[_\d]*)/g, "");           // remove cell class
            col_value.c += ' cell_'+row_index+'_'+col_index+ ' col-' + col_index;   // add cell, col class
            var css = '';
            if(col_value.h.indexOf('greyed') > -1) {
                css += ' creation-bg';
            }
            if($.inArray(col_index,eventCols) > -1) { // blank-div + event > creation-bg
                col_value.c += ' collapse';
            } if(col_value.h.indexOf('blank-div') > -1 || col_value.h.indexOf('merge-td') > -1) { // blank-div only > merge-td
                col_value.c += ' merge-td';
            }
            col_value.c += css;
            col_value.c = col_value.c.replace(/ +(?= )/g,''); // remove multiple spaces
            if(col_index > 2 && $(col_value.h).find('span.creation').length) {
                var segCol = col_index - 1;
                var parentClass = ' parent_'+row_index+'_'+segCol;
                var parentClassE = ' parent_'+row_index+'_'+col_index;
                //console.log(row_index + ' + ' + col_index + ' => ' + parentClass);
                for(var i=row_index; i<trDataJson.length; i++) {
                    // remove parent class from segment
                    //console.log(i + ' ' + segCol + '-' + $(trDataJson[i].h[segCol].h).find('span.destructure').length);
                    trDataJson[i].h[segCol].c = trDataJson[i].h[segCol].c.replace(/(parent[_\d]+[_\d]+)/g, "");
                    trDataJson[i].h[segCol].c += parentClass;

                    if($(trDataJson[i].h[col_index].h).find('span.destructure').length){
                        // remove parent class from event
                        trDataJson[i].h[col_index].c = trDataJson[i].h[col_index].c.replace(/(parent[_\d]+[_\d]+)/g, "");
                        trDataJson[i].h[col_index].c += ' parent_'+i+'_'+col_index;
                        //console.log('break - ' + i+'_'+segCol);
                        break;
                    }
                    // remove parent class from event
                    trDataJson[i].h[col_index].c = trDataJson[i].h[col_index].c.replace(/(parent[_\d]+[_\d]+)/g, "");
                    trDataJson[i].h[col_index].c += parentClassE;
                }
            }
        });
    });
    console.timeEnd('updateJsonCss');


    /*console.time('css1');
     for(var i=0; i<trDataJson.length; i++) {
     trDataJson[i].c = 'jrow-'+i;
     console.log(i + ' - ' + trDataJson[i].c);
     for(var j=0; j<trDataJson[i].h.length; j++) {
     trDataJson[i].h[j].c = 'jcol-'+j;
     console.log(j + ' - ' + trDataJson[i].h[j].c);
     }
     }
     console.timeEnd('css1'); // 20 - 30 ms*/
}

/*
 * Add border-light-top to first greyed cell
 * Amit Malakar
 * Date: 29-Apr-2016
 */
function addBorderTop(){
    console.time('addBorderTop');
    for(var col=2; col<trDataJson[1].h.length-1; col++) {
        var clFlag = 0;
        for(var row=2; row<trDataJson.length; row++) {
            var cl = trDataJson[row].h[col].c;
            if(cl.indexOf('creation-bg') > -1) {
                clFlag++;
                if(clFlag == 1) {
                    if(trDataJson[row].h[col].h.indexOf('border-light-top') < 0) {
                        var position             = trDataJson[row].h[col].h.indexOf('="') + 2;
                        trDataJson[row].h[col].h = trDataJson[row].h[col].h.substr(0, position)
                            + ' border-light-top ' + trDataJson[row].h[col].h.substr(position);
                        //$(".center-div table.fixed-left-column tr:eq(" + row + ") td:eq(" + col + ") :first-child").addClass('border-light-top');
                        //console.log(row+' - '+col+' - '+$(".center-div table.fixed-left-column tr:eq("+row+") td:eq("+col+") :first-child").attr('class'));
                    }
                } else {
                    trDataJson[row].h[col].h = trDataJson[row].h[col].h.replace('border-light-top', '');
                    trDataJson[row].h[col].c = trDataJson[row].h[col].c.replace('border-light-top', '');
                    //$(".center-div table.fixed-left-column tr:eq("+row+") td:eq("+col+") :first-child").removeClass('border-light-top');
                    //console.log(row + ' - ' + col + ' '+clFlag+' === ' + trDataJson[row].h[col].h.indexOf('border-light-top'));
                }
            } else {
                clFlag = 0;
            }
        }
    }
    console.timeEnd('addBorderTop');
}

/* Update CSS in Table
 * Amit Malakar
 * Date: 31-Mar-2016
 * style not saved in JSON as its only for 2 cols, it's an overhead
 */
function grdUpdateTableCss() {
    $(".center-div table.fixed-left-column tr td:nth-child(1)").css({'position':'absolute','left':'0px'});
    $(".center-div table.fixed-left-column tr td:nth-child(2)").css({'position':'absolute','left':'25px'});
    //$('.center-div .col-1 .col-head').trigger("dblclick");
    //var phaseInfo = getRealPhaseInfo();
    //$('.cell_0_'+phaseInfo[0]).find('.dropdown-menu').removeClass('show-7').addClass('show-'+phaseInfo[0]);
    setTableWidth();
}

/* Create Table from JSON
 * Amit Malakar
 * Date: 31-Mar-2016
 */
function grdCreateTableFromJson() {
    console.time('render');
    grdUpdateJsonCss();
    addBorderTop();
    var tableData = grdJsonToHtml();
    // create fixed top header table
    var tableHeaderData = $(tableData).filter('tr:lt(2)');
    $(".center-div div.fixed-top-header tbody").html('');
    $(".center-div div.fixed-top-header tbody").html(tableHeaderData);
    // create fixed left column table
    $(".center-div table.fixed-left-column tbody").html('');
    $(".center-div table.fixed-left-column tbody").html(tableData);

    grdUpdateTableCss();
    cellFlyout();
    getDropdown();
    console.timeEnd('render');
}

/* Get Html and/or Css
 * Amit Malakar
 * Date: 31-Mar-2016
 * @param: row, col
 * @param: 0-css,1-html,2-both
 */
function grdGetHtmlCssCell(row, col, type) {
    var result = [{c:'', h:''}];
    if(type == 0) {
        result[0].c = trDataJson[row].h[col].c;
    } else if(type == 1) {
        result[0].h = trDataJson[row].h[col].h;
    } else if(type == 2) {
        result[0].c = trDataJson[row].h[col].c;
        result[0].h = trDataJson[row].h[col].h;
    }
    return result;
}

/* Get Week Array
 * Amit Malakar
 * Date: 31-Mar-2016
 */
function grdGetWeekArray() {
    var weekArray = [];
    weekArray['head'] = '<span class="top-col">#$#COL#$#</span>';
    weekArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon phase-icon"></span><span class="col-head-title">Phase</span></div>';
    // start week
    weekArray['s'] = '<div class="gridMenu segment-node merge-td border-light-top" data-id="drpWeek"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text segment-text"><span class="col-node-text custom-node schedule-segment-week">#$#Segment#$#</span></div></div>';
    // blank
    weekArray['b'] = '<div class="segment-node blank-div"></div>';
    // end
    weekArray['e'] = '<div class="segment-node blank-div segment-node week-segment-text structured-last-div"><input type="text" class="custom-node undefined" placeholder="Undefined" ></div>';
    // greyed
    weekArray['g'] = '<div class="segment-node blank-div greyed border-light-top"></div>';    // creation-bg in td

    return weekArray;
}

/* Get Days Array
 * Amit Malakar
 * Date: 01-Apr-2016
 */
function grdGetDaysArray() {
    var dayArray = [];
    dayArray['head'] = '<span class="top-col">#$#COL#$#</span>';
    dayArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon phase-icon"></span><span class="col-head-title">Days</span></div>';
    // start week
    dayArray['s'] = '<div class="segment-node merge-td border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text segment-text">'
        +'<span class="col-node-text custom-node schedule-segment-day">#$#Segment#$#</span></div></div>';
    // blank
    dayArray['b'] = '<div class="segment-node blank-div"></div>';
    // end
    dayArray['e'] = '<div class="segment-node blank-div segment-node structured-last-div"><input type="text" class="custom-node undefined" placeholder="Undefined" ></div>';
    // greyed
    dayArray['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return dayArray;
}

/* Get Time Array
 * Amit Malakar
 * Date: 01-Apr-2016
 */
function grdGetTimeArray() {
    var timeArray = [];
    timeArray['head'] = '<span class="top-col">#$#COL#$#</span>';
    timeArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon phase-icon"></span><span class="col-head-title">Time</span></div>';
    // start week
    timeArray['s'] = '<div class="segment-node blank-div"></div>';
    // blank
    timeArray['b'] = '<div class="segment-node blank-div"></div>';
    // end
    timeArray['e'] = '<div class="segment-node blank-div structured-last-div"><input type="text" class="custom-node undefined" placeholder="Undefined" ></div>';
    // greyed
    timeArray['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return timeArray;
}

/* Get Phase Array
 * Amit Malakar
 * Date: 01-Apr-2016
 */
function grdGetPhaseArray() {
    var phaseArray = [];

    phaseArray['head'] = '<span class="top-col">#$#COL#$#</span>';
    phaseArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon phase-icon"></span><span class="col-head-title">Phase</span></div>';
    // start unstructured
    phaseArray['su'] = '<div class="gridMenu segment-node phase merge-td border-light-top" data-id="drpUnstrucPhase"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text segment-text">'
        +'<span class="col-node-text"><input type="text" class="custom-node undefined" placeholder="Undefined" alt="" value=""></span></div></div>';
    // start structured
    phaseArray['ss'] = '<div class="gridMenu segment-node phase merge-td border-light-top" data-id="drpStrucPhase"><div class="phase node-circle node-white-circle node-white-circle">N</div><div class="col-text segment-text"><span class="col-node-text"><input type="text" class="custom-node undefined" placeholder="Undefined" alt="" value=""></span></div></div>';
    // blank
    phaseArray['b'] = '<div class="segment-node blank-div"></div>';
    // end
    phaseArray['e'] = '<div class="segment-node blank-div"></div>';
    // greyed
    phaseArray['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return phaseArray;
}

/*
 * Get Event Array
 * Amit Malakar
 * Date: 01-Apr-2016
 */
function grdGetEventArray() {
    var eventArray = [];
    // collapse in all td
    eventArray['head'] = '<span class="top-col event">#$#COL#$#</span>';
    eventArray['lbl'] = '<div class="col-head event" data-id="#$#COL#$#"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon event-icon"></span><span class="col-head-title">.Event</span></div>';
    eventArray['s'] = '<div class="creation-node event border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="creation"></span><span class="col-node-text custom-node" name="">Creation</span></div></div>';
    eventArray['e'] = '<div class="creation-node event border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"> <span class="destructure"></span><span class="col-node-text custom-node" name="">Destruction</span></div></div>';
    eventArray['g'] = '<div class="segment-node blank-div event greyed"></div>';    // creation-bg in td

    return eventArray;
}

/*
 * Get Operations 1 array
 * Amit Malakar
 * Date: 13-Apr-2016
 */
function grdGetOperation1Array() {
    var operation1Array = [];
    operation1Array['head'] = '<span class="top-col operation-op1-header">#$#COL#$#</span>';
    operation1Array['lbl'] = '<div data-id="#$#COL#$#" class="col-head col-wrap show operation-header"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon operation-icon"></span><span class="col-head-title">Operation</span><i class="fa fa-caret-left arrow"></i></div>';
    operation1Array['s'] = '<div class="gridMenu segment-node merge-td border-light-top" data-id="drpOperation"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text"><input type="text" class="custom-node operation-delete" placeholder="Undefined" alt="" value=""></span></div></div>';
    operation1Array['e'] = '<div class="segment-node blank-div"></div>';
    operation1Array['b'] = '<div class="segment-node blank-div"></div>';
    operation1Array['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return operation1Array;
}

/*
 * Get Operations 2 array
 * Amit Malakar
 * Date: 13-Apr-2016
 */
function grdGetOperation2Array() {
    var operation2Array = [];
    operation2Array['head'] = '<span class="top-col operation-op2-header">#$#COL#$#</span>';
    operation2Array['lbl'] = '<div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon operation-icon"></span><span class="col-head-title">Operation</span><i class="fa fa-caret-left arrow"></i></div>';
    operation2Array['m'] = '<div class="segment-node merge-td border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Manifestation">Manifestation</span></div></div>';
    operation2Array['i'] = '<div class="gridMenu segment-node merge-td border-light-top" data-id="drpInteraction"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Interaction">Interaction</span></div></div>';
    operation2Array['e'] = '<div class="segment-node blank-div"></div>';
    operation2Array['b'] = '<div class="segment-node blank-div"></div>';
    operation2Array['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return operation2Array;
}

/*
 * Get Role array
 * Amit Malakar
 * Date: 13-Apr-2016
 */
function grdGetRoleArray() {
    var roleArray = [];
    roleArray['head'] = '<span class="top-col operation-role-header">#$#COL#$#</span>';
    roleArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon role-icon"></span><span class="col-head-title">Role</span><i class="fa fa-caret-left arrow"></i></div>';
    roleArray['i'] = '<div class="gridMenu creation-node border-light-top" data-id="drpViewClass"><div class="node-circle node-white-circle node-white-circle" >N</div><div class="col-text operation-text"><span class="col-node-text custom-node actionNode" placeholder="Interaction" >Interaction</span></div></div>';
    roleArray['b'] = '<div class="segment-node blank-div"></div>';
    roleArray['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td
    return roleArray;
}

/*
 * Get Universe array
 * Amit Malakar
 * Date: 13-Apr-2016
 */
function grdGetUniverseArray() {
    var universeArray = [];
    universeArray['head'] = '<span class="top-col operation-universe-header">#$#COL#$#</span>';
    universeArray['lbl'] = '<div data-id="#$#COL#$#" class="col-head col-wrap show"><div class="node-circle node-white-circle node-white-circle">N</div><span class="icon sys-icon"></span><span class="col-head-title">Universe</span><i class="fa fa-caret-left arrow"></i></div>';
    universeArray['p'] = '<div class="creation-node operation-tab-node border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text operation-text"><span class="col-node-text custom-node">...Process</span></div></div>';
    universeArray['b'] = '<div class="segment-node blank-div"></div>';
    universeArray['g'] = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return universeArray;
}


/* Inject Html to JSON
 * Amit Malakar
 * Date: 01-Apr-2016
 * @param: srow - start row
 * @param: erow - end row
 * @param: col - column number
 * @param: map - mapping array acc. to htmlArray
 * @param: htmlArray - html array to be injected
 * @param: type, e - event, o - other
 * @param: header 0-false,1-true
 */
function injectHtmlToJson(srow,erow,col,map,htmlArray,type,header) {
    // col = 11;
    // map = {'0':'head','1':'lbl','2':'s','3':'g','4':'g','5':'e'};
    // map = {'0':'head','1':'lbl','2':'su','3':'b','4':'b','5':'e'};
    // htmlArray = grdGetPhaseArray();//grdGetEventArray();
    // if the column doesn't exist then inject data, header & rest greyed
    var eventCss = '';
    if(type=='e') eventCss = ' event';
    if(header) {
        for(var i=0; i<trDataJson.length; i++) {
            var css = 'ExcelTablerow col-'+col + eventCss;
            var html = htmlArray[map[i]];
            if(htmlArray[map[i]]!== undefined) {
                if (i == 0) {
                    css  = 'ExcelTableFormationCol blank col-' + col + eventCss;
                    html = htmlArray[map[i]].replace(/#\$#COL#\$#/g, col);
                } else if (i == 1) {
                    html = htmlArray[map[i]].replace(/#\$#COL#\$#/g, col);
                } else {
                    html = htmlArray[map[i]];
                }
            } else {
                html = '<div class="segment-node blank-div greyed'+eventCss+'"></div>';
            }
            trDataJson[i].h.splice(col, 0, {c: css, h: html});
        }
        if(erow > (trDataJson.length-1)) {
            //console.log(erow + ' - ' + trDataJson.length);
            for(var i=trDataJson.length; i<=erow; i++) {
                var tdData = [];
                for(var j=0; j<trDataJson[1].h.length; j++) {
                    var css = 'ExcelTablerow col-'+j + eventCss;
                    var html = '';
                    if(j==col) {
                        html = htmlArray[map[i]]
                    } else if(j==0) {
                        css  = 'ExcelTableFormationRow blank col-' + j + eventCss;
                        html = '<div class="left-col">'+ i.toString() + '</div>';
                    } else if(j==1) {
                        html = '<div class=""><div class="borderDashed"></div></div>';
                    } else {
                        html = '<div class="blank-div segment-node greyed"></div>';
                    }
                    tdData.push({'c': css, 'h': html});
                }
                trDataJson.splice(i, 0, {'c': 'row-'+i, 'h':tdData });
            }
        }
    } else {
        //console.log('else');
        for(var i=srow; i<=erow; i++) {
            // check if previous cols exists for the row
            if(trDataJson[i] === undefined) {
                // row don't exists, create cols along with new col data
                // create first 4 cols, every other cols greyed except the new col data
                var tdData = [];
                for(var j=0; j<trDataJson[1].h.length; j++) {
                    var css = 'ExcelTablerow col-'+j + eventCss;
                    var html = '';
                    if(j==col) {
                        html = htmlArray[map[i]]
                    } else if(j==0) {
                        css  = 'ExcelTableFormationRow blank col-' + j + eventCss;
                        html = '<div class="left-col">'+ i.toString() + '</div>';
                    } else if(j==1) {
                        html = '<div class=""><div class="borderDashed"></div></div>';
                    } else {
                        html = '<div class="blank-div segment-node greyed"></div>';
                    }
                    tdData.push({'c': css, 'h': html});
                }
                trDataJson.splice(i, 0, {'c': 'row-'+i, 'h':tdData });
            } else {
                //console.log('update ' + col)
                // row already exists, update cells
                if(trDataJson[i].h[col] !== undefined) { // cell exists
                    trDataJson[i].h[col].c = 'ExcelTablerow col-'+col + eventCss;
                    trDataJson[i].h[col].h = htmlArray[map[i]];
                } else { // cell don't exists
                    console.log('cell dont exists');
                    /*var css = 'ExcelTablerow col-'+col + eventCss;
                     var html = '';
                     if(htmlArray[map[i]]!== undefined) {
                     html = htmlArray[map[i]];
                     } else {
                     html = '<div class="segment-node blank-div greyed'+eventCss+'"></div>';
                     }
                     trDataJson[i].h.splice(col, 0, {c: css, h: html});*/
                }
            }
        }
    }

    // if the column exists then inject/update
}

/* Update Last Four cols into JSON
 * Amit Malakar
 * Date: 04-Apr-2016
 */
function grdUpdateLastFourCols(prevLastRow) {
    console.time('updateLastFourCols');
    // get the last prevLastRow
    var lastRowData = grdLastRowFourCol();
    // update all the rows b/w prevLastRow and lastRow
    if(prevLastRow != trDataJson.length-1){
        if(prevLastRow > trDataJson.length-1) {
            var lastRow = trDataJson.length-1;
            for(var j=1; j<=4; j++) {
                trDataJson[lastRow].h[j].c = lastRowData['dc'][j];
                trDataJson[lastRow].h[j].h = lastRowData['d'][j];
            }
        } else {
            for(var i=prevLastRow; i<trDataJson.length; i++) {
                for(var j=1; j<=4; j++) {
                    if(i==(trDataJson.length-1)) {
                        trDataJson[i].h[j].c = lastRowData['dc'][j];
                        trDataJson[i].h[j].h = lastRowData['d'][j];
                    } else {
                        trDataJson[i].h[j].c = lastRowData['bc'][j];
                        trDataJson[i].h[j].h = lastRowData['b'][j];
                    }
                }
            }
        }
    }
    console.timeEnd('updateLastFourCols');
}

/* Get Last row of four cols
 * Amit Malakar
 * Date: 04-Apr-2016
 */
function grdLastRowFourCol() {
    var rowData = [];
    rowData['b'] = [];  // blank html
    rowData['bc'] = []; // blank css
    rowData['d'] = [];  // last row data html
    rowData['dc'] = []; // last row data css

    rowData['b'][1] = '<div class=""><div class="borderDashed"></div></div>';
    rowData['b'][2] = '<div class="blank-div segment-node"></div>';
    rowData['b'][3] = '<div class="blank-div segment-node"></div>';
    rowData['b'][4] = '<div class="blank-div segment-node"></div>';

    rowData['bc'][1] = 'ExcelTablerow blank collapse border-left merge-td fTHLC-left-col';
    rowData['bc'][2] = 'ExcelTablerow blank collapse event creation-bg border-right merge-td';
    rowData['bc'][3] = 'ExcelTablerow blank merge-td';
    rowData['bc'][4] = 'ExcelTablerow blank collapse event creation-bg border-right merge-td';

    rowData['d'][1] = '<div class="lastRow"><div class="time-col"><div class="node-circle node-white-sm-circle">N</div><div class="borderDashed last-borderDashed"></div><span class="col-text"></span></div></div>';
    rowData['d'][2] = '<div class="lastRow creation-node border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="destructure"></span><span class="col-node-text custom-node" name="parent_5_2">Destruction</span><span class="table-count hide" data-id="12">12</span></div></div>';
    rowData['d'][3] = '<div class="blank-div segment-node"></div>';
    rowData['d'][4] = '<div class="lastRow creation-node border-light-top"><div class="node-circle node-white-circle node-white-circle">N</div><div class="col-text"><span class="destructure"></span><span class="col-node-text custom-node" name="parent_5_4">Destruction</span><span class="table-count hide" data-id="11">11</span></div></div>';

    rowData['dc'][1] = 'ExcelTablerow blank collapse border-bottom border-left merge-td fTHLC-left-col';
    rowData['dc'][2] = 'ExcelTablerow collapse event border-bottom border-right merge-td fill';
    rowData['dc'][3] = 'ExcelTablerow blank border-bottom merge-td';
    rowData['dc'][4] = 'ExcelTablerow collapse event border-bottom border-right merge-td fill';
    /*rowData['dc'][2] = 'ExcelTablerow collapse event border-bottom border-right merge-td border-light-bottom border-light-top fill';
     rowData['dc'][3] = 'ExcelTablerow blank border-bottom merge-td';
     rowData['dc'][4] = 'ExcelTablerow collapse event border-bottom border-right merge-td border-light-bottom border-light-top fill';*/

    return rowData;
}

/*
 * Unstructure Phase Divide
 * Amit Malakar
 * Date: 11-Apr-2016
 */
function unstrucPhaseDivide(phaseRow,phaseCol) {
    console.time('unstrucPhaseDivide');
    $('.divAfterOpDelete').removeClass('divAfterOpDelete');
    grdHtmlToJson();
    var startRow = phaseRow + 1;
    addBlankRows(startRow, 2);
    var unstrucMap = {};
    var phaseMap = {};
    var eventMap = {};
    for (var i=startRow; i<=(startRow+1); i++) {
        var rowNo = i.toString();
        unstrucMap[rowNo] = 'b';
        if(i == startRow) {
            phaseMap[rowNo] = 'e';
            eventMap[rowNo] = 'e';
        } else {
            phaseMap[rowNo] = 'su';
            eventMap[rowNo] = 's';
        }
    }
    injectHtmlToJson(startRow, (startRow+1), 5, unstrucMap, grdGetUnstructureArray(), 'o', 0);
    injectHtmlToJson(startRow, (startRow+1), phaseCol, phaseMap, grdGetPhaseArray(), 'e', 0);
    injectHtmlToJson(startRow, (startRow+1), (phaseCol + 1), eventMap, grdGetEventArray(), 'o', 0);
    if($('.schedule-segment-week').length)
        updateSegmentsInCol($('.schedule-segment-week:first').closest('td').index(),'schedule');
    grdCreateTableFromJson();
    fillPlusImage();
    console.timeEnd('unstrucPhaseDivide');
}

/*
 * Unstructure Phase Remove
 * Amit Malakar
 * Date: 14-Apr-2016
 */
function unstrucPhaseRemove(row,col) {
    console.time('unstrucPhaseRemove');
    grdHtmlToJson();
    var td_class = trDataJson[row].h[col].c;// $_this.closest('td').attr('class');
    var parent_class = $.grep(td_class.split(" "), function(v, i) {
        return v.indexOf('parent_') === 0;
    }).join();
    var unstrucCol = 5;
    var clickedRow = parseInt(parent_class.split('_')[1]);
    var clickedCol = parseInt(parent_class.split('_')[2]);
    segLoc = findSegStartEndByEvent(clickedRow,unstrucCol);
    var segCon = parseInt(segLoc[0]);
    var segDes = parseInt(segLoc[1]);

    if((segDes-segCon)>=3) {
        var unsPFCell   = trDataJson[segCon].h[unstrucCol];     // phase first
        var unsPEFCell  = trDataJson[segCon].h[unstrucCol + 1]; // phase event first
        var unsPLCell   = trDataJson[segDes].h[unstrucCol];     // phase last
        var unsPELCell  = trDataJson[segDes].h[unstrucCol + 1]; // phase event last
        var lastRow = trDataJson.length - 1;
        var beg     = clickedRow;
        var end     = clickedRow + 1;
        var updateFirstRow = 0, updateLastRow = 0;
        if (beg == 2) {
            var fRow = trDataJson[2].h.slice(1,5);
            updateFirstRow = 1;
        }
        if (end == lastRow) {
            var lRow = trDataJson[lastRow].h.slice(1,5);
            updateLastRow = 1;
        }
        removeRows(beg, 2);
        trDataJson[segCon].h[unstrucCol]        = unsPFCell;
        trDataJson[segCon].h[unstrucCol + 1]    = unsPEFCell;
        trDataJson[segDes-2].h[unstrucCol]      = unsPLCell;
        trDataJson[segDes-2].h[unstrucCol + 1]  = unsPELCell;

        if(updateFirstRow) {
            trDataJson[2].h.splice(1,4);
            trDataJson[2].h.splice(1,0,fRow[0],fRow[1],fRow[2],fRow[3]);
        }
        if(updateLastRow) {
            var newLastRow = trDataJson.length-1;
            trDataJson[newLastRow].h.splice(1,4);
            trDataJson[newLastRow].h.splice(1,0,lRow[0],lRow[1],lRow[2],lRow[3]);
        }

        if($('.schedule-segment-week').length)
            updateSegmentsInCol($('.schedule-segment-week:first').closest('td').index(),'schedule');
        grdCreateTableFromJson();
    } else {
        // disable delete icon
        $('a', $_this).addClass('disabled');
    }
    console.timeEnd('unstrucPhaseRemove');
}

/*
 * Structured series creation
 * Amit Malakar
 * Date: 04-Apr-2016
 */
function saveScheduleOfProcess() {
    console.time('structured');
    grdHtmlToJson();
    var addRow                  = parseInt($("#scheduleRow").val());
    var addCol                  = parseInt($("#scheduleCol").val());
    //var status                  = $("#scheduleStatus").val();
    var extend                  = 0;
    var wk_segment              = parseInt($('#timeline_form .wk_segment').val());
    //var unstrucSegCount         = findUnstructureRows().length;
    //var strucSegCount           = $('.schedule-segment-week').length;
    var oldLastRow              = trDataJson.length - 1;
    var updateFirstRow          = 0;

    // determine if days
    var common_time = [];
    $("#timeline_form input[name='common_time[]']:checked").each(function (){
        common_time.push($(this).val());
    });

    //console.log('r '+addRow + ' - c ' + addCol + ' | w ' + wk_segment + ' - d ' + daysFlag);

    // determine if extend
    if($('#scheduleExtend').length)
        extend = ($('#scheduleExtend').val()) ? $('#scheduleExtend').val() : 0;

    var strucSegArr = findSegmentsInCol(addCol,'schedule');
    var daysLength = $('.schedule-segment-day').length;
    var daysFlag = (($.inArray('day',common_time) > -1) || daysLength) ? 1 : 0;
    //console.log(extend + ' - ' + strucSegArr.length + ' - ' + daysLength + ' - ' + daysFlag);

    if(extend) {
        var extendInfo = extend.split('#');
        rowColInfo = extendInfo[1].split('_');
        addRow = parseInt(rowColInfo[0]);
        var rowsToDelete = parseInt(rowColInfo[1]) - addRow + 1;
        var rowsToAdd = (daysFlag==1) ? wk_segment * 2 * 7 : wk_segment * 2;
        //console.log(addRow + ' - ' + addCol + ' | ' + rowsToDelete + ' - ' + rowsToAdd);
        if(addRow==2) {
            // save first row four cols
            var fRow = trDataJson[2].h.slice(1,5);
            updateFirstRow = 1;
        }
        trDataJson.splice(addRow,rowsToDelete);
        addBlankRows(addRow,rowsToAdd);
        $('#scheduleExtend').val('');
    }

    var phaseInfo = getRealPhaseInfo();
    var weekArray = grdGetWeekArray();
    var eventArray = grdGetEventArray();
    var phaseArray = grdGetPhaseArray();
    var isP                     = isProperOrNot();
    isP                         = isP.split(':');
    //var isUnsPro                = isP[0];
    var isStrPro                = isP[1];
    var strucEventHeader = (isStrPro==0) ? 1 : 0;
    var phaseEventHeader = (phaseInfo.length <= 1) ? 1 : 0;
    var weekMap   = {};
    var weekEMap  = {'0': 'head', '1': 'lbl'};
    var phaseMap  = {};
    var phaseEMap = {'0': 'head', '1': 'lbl'};
    var start     = parseInt(addRow), end = 0;

    if(daysFlag) {
        console.log('days');
        var dayCol = ($('.schedule-segment-day:first').parents('td').index() < 0) ? 0 : $('.schedule-segment-day:first').parents('td').index();
        var dayArray  = grdGetDaysArray();
        var timeArray = grdGetTimeArray();
        var dayMap    = {'0': 'head', '1': 'lbl'};
        var dayEMap   = {'0': 'head', '1': 'lbl'};
        var timeMap   = {'0': 'head', '1': 'lbl'};
        var wk        = 0;
        for (var i = 0; i < (wk_segment * 7); i++) {
            if (i % 7 == 0) wk++;
            end   = parseInt(start) + 1;
            var s = start.toString();
            var e = end.toString();
            if (i % 7 == 0) {
                weekMap[s]  = 's';weekEMap[s] = 's';
                weekMap[e]  = 'e';weekEMap[e] = 'g';
            } else if (i % 7 == 6) {
                weekMap[s]  = 'b';weekEMap[s] = 'g';
                weekMap[e]  = 'b';weekEMap[e] = 'e';
            } else {
                weekMap[s]  = 'b';weekEMap[s] = 'g';
                weekMap[e]  = 'b';weekEMap[e] = 'g';
            }
            dayMap[s]    = 's';dayMap[e]    = 'e';
            dayEMap[s]   = 's';dayEMap[e]   = 'e';
            timeMap[s]   = 'g';timeMap[e]   = 'g';
            phaseMap[s]  = 'b';phaseMap[e]  = 'b';
            phaseEMap[s] = 'g';phaseEMap[e] = 'g';
            start += 2;
        }
        phaseMap[parseInt(addRow)]  = 'ss';
        phaseMap[end]               = 'e';
        phaseEMap[parseInt(addRow)] = 's';
        phaseEMap[end]              = 'e';
        /*console.log(weekMap);console.log(weekEMap);console.log(dayMap);console.log(dayEMap);
         console.log(timeMap);console.log(phaseMap);console.log(phaseEMap);*/
        //console.log(addCol+' - '+(addCol+1)+' - '+(addCol+2)+' - '+(addCol+3)+' - '+(addCol+4)+' - '+phaseCol);
        var dayHeader = dayCol==0 ? 1 : 0;
        var phaseCol = (dayCol==0) ?  (strucEventHeader+3+phaseInfo[0]) : phaseInfo[0];

        injectHtmlToJson(parseInt(addRow), end, addCol, weekMap, weekArray, 'o', 0);
        injectHtmlToJson(parseInt(addRow), end, (addCol+1), weekEMap, eventArray, 'e', strucEventHeader);
        injectHtmlToJson(parseInt(addRow), end, (addCol+2), dayMap, dayArray, 'o', dayHeader);
        injectHtmlToJson(parseInt(addRow), end, (addCol+3), dayEMap, eventArray, 'e', dayHeader);
        injectHtmlToJson(parseInt(addRow), end, (addCol+4), timeMap, timeArray, 'o', dayHeader);
        injectHtmlToJson(parseInt(addRow), end, phaseCol, phaseMap, phaseArray, 'o', 0);
        injectHtmlToJson(parseInt(addRow), end, (phaseCol+1), phaseEMap, eventArray, 'e', phaseEventHeader);

    } else {
        console.log('week');
        for (var i = 0; i < wk_segment; i++) {
            end          = parseInt(start) + 1;
            var s        = start.toString();
            var e        = end.toString();
            weekMap[s]   = 's';weekMap[e]   = 'e';
            weekEMap[s]  = 's';weekEMap[e]  = 'e';
            phaseMap[s]  = 'b';phaseMap[e]  = 'b';
            phaseEMap[s] = 'g';phaseEMap[e] = 'g';
            start += 2;
        }
        phaseMap[parseInt(addRow)] = 'ss';phaseMap[end] = 'e';
        phaseEMap[parseInt(addRow)] = 's';phaseEMap[end] = 'e';
        /*console.log(weekMap);console.log(weekEMap);console.log(phaseMap);console.log(phaseEMap);
         console.log(i + ' - ' + wk_segment + ' | ' + start + ' = ' + end + ' || ' + strucEventHeader + ' - ' + phaseEventHeader);
         console.log(addRow + ' - ' + addCol);*/
        var phaseCol = (isStrPro==1) ? phaseInfo[0] : (phaseInfo[0]+1);
        injectHtmlToJson(parseInt(addRow), end, addCol, weekMap, weekArray, 'o', 0);
        injectHtmlToJson(parseInt(addRow), end, (addCol+1), weekEMap, eventArray, 'e', strucEventHeader);
        injectHtmlToJson(parseInt(addRow), end, phaseCol, phaseMap, phaseArray, 'o', 0);
        injectHtmlToJson(parseInt(addRow), end, (phaseCol+1), phaseEMap, eventArray, 'e', phaseEventHeader);
    }

    // update first row if req.
    if(updateFirstRow) {
        trDataJson[2].h.splice(1,4);
        trDataJson[2].h.splice(1,0,fRow[0],fRow[1],fRow[2],fRow[3]);
    }
    // console.log('end ' + end + ' / lastRow ' + oldLastRow);
    grdUpdateLastFourCols(oldLastRow);
    addScheduleClass(addRow,end,addCol);
    if(extend) updateSegmentsInCol(addCol,'schedule');

    // if week w/o days exists, add days
    var wodArr = weekNoDaysExists();
    if(daysFlag && wodArr.length) { addDaysToWeeks(wodArr); }

    grdCreateTableFromJson();
    updateWeekSegmentNo();
    fillPlusImage();
    if($('.operation-op1-header').length>0)
        $('#role_universe_data').html(getRoleUniverse());
    $('.fixed-left-column').css('width','');
    console.timeEnd('structured');
}

/*
 * Add Days to Weeks in JSON
 * Amit Malakar
 * Date: 27-Apr-2016
 * @param: wodArr week w/o days row no.
 */
function addDaysToWeeks(wodArr) {
    console.time('addDaysToWeeks');
    var col = $('.schedule-segment-week:first').closest('td').index();
    var phaseInfo = getRealPhaseInfo();
    var weekMap = {}, weekEMap = {}, phaseMap = {}, phaseEMap = {}
    dayMap = {}, dayEMap = {}, timeMap = {};
    var weekArray = grdGetWeekArray(), eventArray = grdGetEventArray(), phaseArray = grdGetPhaseArray(),
        dayArray = grdGetDaysArray(), timeArray = grdGetTimeArray();

    // if daysFlag is set, days header is already present
    // check any week w/o days, add days
    var rowsToAdd = (7 * 2) - 2;
    var rowsAdjusted = 0;
    for (var i = 0; i < wodArr.length; i++) {
        var sRow = parseInt(wodArr[i]) + rowsAdjusted;
        var eRow = sRow + 14 -1;
        addBlankRows(sRow+1,rowsToAdd);
        for (var row = sRow; row <= eRow; row+=2) {
            var s = row.toString();
            var e = (row+1).toString();
            dayMap[s] = 's'; dayMap[e] = 'e';
            dayEMap[s] = 's'; dayEMap[e] = 'e';
            timeMap[s] = 'g';timeMap[e] = 'g';
            if(row==sRow) {
                weekMap[e] = 'b';weekEMap[e] = 'g';
                phaseMap[e] = 'b'; phaseEMap[e] = 'g';
            } else if(row==eRow-1) {
                weekMap[s] = 'b';weekEMap[s] = 'g';
                phaseMap[s] = 'b'; phaseEMap[s] = 'g';
            } else {
                weekMap[s]   = 'b';weekMap[e]   = 'b';
                weekEMap[s]  = 'g';weekEMap[e]  = 'g';
                phaseMap[s]  = 'b';phaseMap[e]  = 'b';
                phaseEMap[s] = 'g';phaseEMap[e] = 'g';
            }
        }
        //console.log(weekMap);console.log(weekEMap);console.log(dayMap);console.log(dayEMap);
        //console.log(timeMap);console.log(phaseMap);console.log(phaseEMap);
        injectHtmlToJson(sRow+1, eRow-1, col, weekMap, weekArray, 'o', 0);
        injectHtmlToJson(sRow+1, eRow-1, (col+1), weekEMap, eventArray, 'e', 0);
        injectHtmlToJson(sRow, eRow, (col+2), dayMap, dayArray, 'o', 0);
        injectHtmlToJson(sRow, eRow, (col+3), dayEMap, eventArray, 'e', 0);
        injectHtmlToJson(sRow, eRow, (col+4), timeMap, timeArray, 'o', 0);
        injectHtmlToJson(sRow+1, eRow-1, phaseInfo[0], phaseMap, phaseArray, 'o', 0);
        injectHtmlToJson(sRow+1, eRow-1, (phaseInfo[0]+1), phaseEMap, eventArray, 'e', 0);
        //console.log((sRow+1) + ' - ' + (sRow+1) + ' - ' + eRow + ' - ' + eRow + ' - ' + col + ' - ' + col);
        grdSwapData(sRow+1,sRow+1,eRow,eRow,col,col,0); // place undefined input field
        addScheduleClass(sRow,eRow,col);
        rowsAdjusted += rowsToAdd;
    }

    console.timeEnd('addDaysToWeeks');
}

/*
 * Week without Day
 * Amit Malakar
 * Date: 04-Apr-2016
 * @return array
 */
function weekNoDaysExists() {
    var weekDayArr = [];
    //weekDayArr['is'] = [];
    //weekDayArr['not'] = [];
    for(var row = 2; row < trDataJson.length; row++) {
        var col = $('.schedule-segment-week:first').closest('td').index() >= 1
            ? $('.schedule-segment-week:first').closest('td').index()
            : parseInt($("#scheduleCol").val());
        if(trDataJson[row].h[col].h.indexOf('schedule-segment-week') > -1 &&
            trDataJson[row].h[col+2].h.indexOf('schedule-segment-day') < 0) {
            //console.log(row + ' - ' + col + ' - week<>day');
            weekDayArr.push(row);
        }
    }
    return weekDayArr;
}

/*
 * Add schedule class to week in JSON
 * Amit Malakar
 * Date: 04-Apr-2016
 */
function addScheduleClass(addRow,end,addCol) {
    console.time('addScheduleClass');
    var scheduleClass = ' schedule_'+addRow+'_'+end;
    //console.log('addScheduleClass <- ' + arguments.callee.caller.name);
    for (var i = addRow; i <= end; i++) {
        if(trDataJson[i].h[addCol].c.indexOf('schedule') > -1) {
            trDataJson[i].h[addCol].c = trDataJson[i].h[addCol].c.replace(/(schedule[_\d]*[_\d]*)/g, scheduleClass);
            //console.log('reg - '+i+'-'+addCol+'  ' + trDataJson[i].h[addCol].c);
        } else {
            trDataJson[i].h[addCol].c += scheduleClass;
            //console.log('nreg - '+i+'-'+addCol+'  ' + trDataJson[i].h[addCol].c);
        }
    }
    console.timeEnd('addScheduleClass');
}

// Code by Amit Malakar
// Date - 7-Apr-2016
function findSegmentsInCol(col,class_name) {
    var segment_class_arr = [];
    trDataJson.forEach(function(tr) {
        var td_class = tr.h[col].c;
        var segment_class = $.grep(td_class.split(" "), function(v, i) {
            return v.indexOf(class_name+'_') === 0;
        }).join();
        if(segment_class.length && segment_class_arr.indexOf(segment_class) == -1) {
            segment_class_arr.push(segment_class);
        }
    });
    return segment_class_arr;
}

/*
 * Update schedule class to week in JSON
 * Amit Malakar
 * Date: 08-Apr-2016
 */
function updateSegmentsInCol(col,class_name) {
    console.time('updateSegments');
    //console.log('updateSegmentsInCol <- ' + arguments.callee.caller.name);
    var i =0 ;
    var segment_class_arr = [];
    trDataJson.forEach(function(tr) {
        var td_class = tr.h[col].c;
        var segment_class = $.grep(td_class.split(" "), function(v, i) {
            return v.indexOf(class_name + '_') === 0;
        }).join();
        if(segment_class!='') {
            if(segment_class_arr[segment_class] == undefined) {
                segment_class_arr[segment_class] = i+"_";
            } else {
                segment_class_arr[segment_class] += i+"_";
            }
        }i++;
    });
    var new_segment_class_arr = [];
    for(var key in segment_class_arr) {
        if(segment_class_arr.hasOwnProperty(key)) {
            segment_class_arr[key] = segment_class_arr[key].replace(/_\s*$/, "");
            var seg_split_arr = segment_class_arr[key].split('_');
            var fRow = parseInt(seg_split_arr[0]);
            var lRow = parseInt(seg_split_arr.slice(-1).pop());
            var new_seg_class = class_name+'_'+fRow+'_'+lRow;
            if(key != new_seg_class) {
                // segment class need updating
                for(var i=fRow; i<=lRow; i++) {
                    trDataJson[i].h[col].c = trDataJson[i].h[col].c.replace(key, new_seg_class);
                }
            }
            new_segment_class_arr.push(new_seg_class);
        }
    }
    console.timeEnd('updateSegments');
    return new_segment_class_arr;
}


// Created by Amit Malakar
// Modified Arvinds Code
// Date 04-Mar-2016
function getRealPhaseInfo() {
    var phaseColNo   = '';
    var phaseEveNo   = '';
    var counterPhase = 0;
    var realPhaseRes = [];
    var cell = 0;
    trDataJson[1].h.forEach(function(td) {
        text = $.trim($(td.h).text()).replace(/\s/g, "");
        if (text == 'NPhase' && counterPhase == 0) {
            phaseColNo   = cell;
            counterPhase = 1;
        }
        if (text == 'N.Event' && counterPhase == 1) {
            phaseEveNo   = cell;
            counterPhase = 2;
        }
        cell++;
    });
    realPhaseRes.push(parseInt(phaseColNo));

    newVar = parseInt(phaseEveNo) - 1;
    if (parseInt(phaseColNo) == parseInt(newVar)) {
        realPhaseRes.push(parseInt(phaseColNo) + 1);
    }
    return realPhaseRes;
}

/* Add blank rows
 * Amit Malakar
 * Date: 04-Apr-2016
 * @param: start row no.
 * @param: length no. of rows to insert
 */
function addBlankRows(startRow, length) {
    var fourCol = grdLastRowFourCol();

    for (var i=startRow; i<(startRow+length); i++) {
        var tdData = [];
        for(var j=0; j<trDataJson[1].h.length; j++) {
            var css = 'ExcelTablerow col-'+j;
            var html = '';
            if(j>=1 && j<=4) {
                css = fourCol['bc'][j];
                html = fourCol['b'][j];
            } else if(j==0) {
                css  = 'ExcelTableFormationRow blank col-' + j;
                html = '<div class="left-col">'+ i.toString() + '</div>';
            } else if(j==1) {
                html = '<div class=""><div class="borderDashed"></div></div>';
            } else {
                html = '<div class="blank-div segment-node greyed"></div>';
            }
            tdData.push({'c': css, 'h': html});
        }
        trDataJson.splice(i, 0, {'c': 'row-'+i, 'h':tdData });
    }
}

/* Delete rows
 * Amit Malakar
 * Date: 07-Apr-2016
 * @param: start row no.
 * @param: length no. of rows to delete
 */
function removeRows(startRow, length) {
    console.time('removeRows');
    if(trDataJson.length - length >= 4){
        var lastRow = trDataJson.length - 1;
        var updateFirstRow = 0, updateLastRow = 0;
        if(startRow==2) {
            // save first row four cols
            var fRow = trDataJson[2].h.slice(1,5);
            updateFirstRow = 1;
        }
        if(lastRow >= startRow && lastRow <= (startRow+length)) {
            // save last row four cols
            var lRow = trDataJson[lastRow].h.slice(1,5);
            updateLastRow = 1;
        }
        trDataJson.splice(startRow,length);
        lastRow = trDataJson.length - 1;
        if(updateFirstRow) {
            trDataJson[2].h.splice(1,4);
            trDataJson[2].h.splice(1,0,fRow[0],fRow[1],fRow[2],fRow[3]);
        }
        if(updateLastRow) {
            trDataJson[lastRow].h.splice(1,4);
            trDataJson[lastRow].h.splice(1,0,lRow[0],lRow[1],lRow[2],lRow[3]);
        }
    }
    console.timeEnd('removeRows');
}

/* Delete cols
 * Amit Malakar
 * Date: 07-Apr-2016
 * @param: start col no.
 * @param: length no. of seq. cols to delete
 */
function removeCols(startCol, length) {
    console.time('removeCols');
    for (var i = 0; i < trDataJson.length; i++) {
        trDataJson[i].h.splice(startCol,length);

    }
    console.timeEnd('removeCols');
}

/*
 * Update segment number in Week JSON & HTML
 * run after html is rendered
 * Amit Malakar
 * Date: 04-Apr-2016
 */
function updateWeekSegmentNo() {
    // update week segment no.
    console.time('updateweekdayno');
    var weekCol = $('#scheduleCol').val();
    var i = 1;
    $($('.schedule-segment-week').parents('tr').get().reverse()).each(function(){
        $(this).find('span.schedule-segment-week').html('Segment'+i);
        var row = $(this).index();
        trDataJson[row].h[weekCol].h = trDataJson[row].h[weekCol].h.replace(/#\$#Segment#\$#/g, ('Segment'+i));
        i++;
    });

    // update days segment no.
    if($('.schedule-segment-day').length) {
        var dayCol = $('.schedule-segment-day').first().parents('td').index();
        var i = 1;
        $($('.schedule-segment-day').parents('tr').get().reverse()).each(function(){
            $(this).find('span.schedule-segment-day').html('Segment'+i);
            var row = $(this).index();
            trDataJson[row].h[dayCol].h = trDataJson[row].h[dayCol].h.replace(/#\$#Segment#\$#/g, ('Segment'+i));
            i++;
        });
    }
    console.timeEnd('updateweekdayno');
}

/*
 * Delete structured segment
 * Amit Malakar
 * Date: 07-Apr-2016
 */
function deleteScheduleSegment(myRow,myCol) {
    var segInfo = findSegmentsInCol(myCol,'schedule');

    updateSegmentsInCol(myCol,'schedule');
    var tdClass = trDataJson[myRow].h[myCol].c;
    var segment_class = $.grep(tdClass.split(" "), function(v, i) {
        return v.indexOf('schedule_') === 0;
    }).join();
    var segArr = segment_class.split('_');

    var unstrucLength = $(".center-div .unstructure-last-div").length;
    if(segInfo.length == 1) {

        if(unstrucLength==0) {
            displayLoader(); $.post(domainUrl+'grid/index',{},responseCallAction,'html');
        } else {
            //console.log('else 1 - ' + parseInt(segArr[1]) + ' - ' + (1+parseInt(segArr[2])- parseInt(segArr[1])));
            removeRows(parseInt(segArr[1]), (1+parseInt(segArr[2])- parseInt(segArr[1])));
            var colsRemove = 1;
            if($('.schedule-segment-day').length) {
                colsRemove = 4;
            }
            removeCols((myCol+1), colsRemove);
            var map = {'2':'g','3':'g'};
            injectHtmlToJson(2,3,myCol,map,grdGetWeekArray(),'o',0);
        }
    } else {
        //console.log('else 2 - ' + parseInt(segArr[1]) + ' - ' + (1+parseInt(segArr[2])- parseInt(segArr[1])));
        removeRows(parseInt(segArr[1]), (1+parseInt(segArr[2])- parseInt(segArr[1])));
    }

    if($('.schedule-segment-week').length > 0) {
        updateSegmentsInCol(myCol, 'schedule');
    }
    grdCreateTableFromJson();
    updateWeekSegmentNo();
    fillPlusImage();

}

// Code By Amit Malakar (TO CHANGE)
// Date - 22 Mar, 2016
function getRoleUniverse() {
    var operationRoleExists = $(".center-div div.fixed-top-header tr:eq(0) td .operation-role-header").length;
    if(operationRoleExists) {
        // header rows - fixed top header
        var roleIndex = $(".center-div div.fixed-top-header tr:eq(0) td .operation-role-header").parent('td').index();
        var tableClass = $(".center-div div.fixed-top-header").attr('class');
        var beg = roleIndex - 1;
        var end = roleIndex + 2;
        var fixedTopHeader = '<table class="'+tableClass+'">';
        var row = 0;
        $(".center-div div.fixed-top-header tr").each(function() {
            fixedTopHeader += '<tr class="row-'+row+'">';
            $(this).find("td:lt("+end+"):gt("+beg+")").each(function() {
                fixedTopHeader += $(this).get(0).outerHTML;
                $(this).hide(); // hide td
            });
            fixedTopHeader += '</tr>';
            row++;
        });
        fixedTopHeader += '</table>';

        // hide role universe of 2 rows
        $(".center-div table.fixed-left-column tr:lt(2)").find("td:lt("+end+"):gt("+beg+")").hide();

        // table rows - fixed left column
        tableClass = $(".center-div table.fixed-left-column").attr('class');
        var row = 2;
        var fixedLeftColumn = '<div class="setnicescroll manageScroll"><table class="'+tableClass+'">';
        $(".center-div table.fixed-left-column tr:gt(1)").each(function() {
            fixedLeftColumn += '<tr class="row-'+row+'">';
            $(this).find("td:lt("+end+"):gt("+beg+")").each(function() {
                fixedLeftColumn += $(this).get(0).outerHTML;
                $(this).hide(); // hide td
            });
            fixedLeftColumn += '</tr>';
            row++;
        });
        fixedLeftColumn += '</table></div>';

        return fixedTopHeader+fixedLeftColumn;
    }
}
// Code By Amit Malakar (TO CHANGE)
// Date - 22 Mar, 2016
function deleteOperations() {
    console.time('deleteOperations');
    var operationExists = $(".center-div div.fixed-top-header tr:eq(1) td .operation-header").length;
    if(operationExists) {
        var beg = $('.operation-op1-header').closest('td').index();
        var end = $('.operation-universe-header').closest('td').index();
        removeCols(beg, (end-beg+1));
        /*var beg = $(".center-div div.fixed-top-header tr:eq(1) td.operation-header").index()-1;
         var end = $(".center-div div.fixed-top-header tr:eq(1) td:last").index();
         if(beg>0 && end>0) {
         // remove fixed top header
         $(".center-div div.fixed-top-header tr").find("td:lt("+end+"):gt("+beg+")").remove();
         // remove fixed left column
         $(".center-div table.fixed-left-column tr").find("td:lt("+end+"):gt("+beg+")").remove();
         }*/

        // reset unstructured series - remove extra rows
        var rPhaseInfoArr = getRealPhaseInfo();
        var phaseBegEndArr = findAllPhaseStartEnd(rPhaseInfoArr[0]);
        var correctRows = 0;
        $.each(phaseBegEndArr, function(index, element) {
            if(element.type == 'unstructured') {
                deleteBeg = element.beg - correctRows;
                deleteEnd = element.end - correctRows;
                //console.log(deleteBeg + ' - ' + deleteEnd);
                removeRows( (deleteBeg+1), (deleteEnd-deleteBeg-1));
                correctRows += element.end - element.beg - 1;
            } // else { }
        });

        var weekCol = $('.schedule-segment-week:first').closest('td').index();
        if(weekCol>0) updateSegmentsInCol(weekCol,'schedule');
        grdCreateTableFromJson();

        $('.unstructured-add-above-segment').removeClass('checkOperations');
        $('.unstructured-add-below-segment').removeClass('checkOperations');
        $('.unstructured-del-segment').removeClass('checkOperations');
        $('.unstructure-phase-divide-segment').removeClass('checkOperations');
        $('.unstructure-phase-remove-segment').removeClass('checkOperations');

        $('#operationPaneFlyout').animate({right:'-100%'}).removeClass('in');
        OperationPane();
        // $('#role_universe_data').html('');
        console.timeEnd('deleteOperations');
    }
}

/*
 * Swap source and destination data
 * Amit Malakar
 * Date: 07-Apr-2016
 * @param: sBeg source beg
 * @param: sEnd source end
 * @param: dBeg destination beg
 * @param: dEnd destination end
 * @param: cBeg column beg
 * @param: cEnd column end
 * @param: update Json from Html
 */
function grdSwapData(sBeg,sEnd,dBeg,dEnd,cBeg,cEnd,updateJsonFromHtml) {
    // destination -> temp
    if(updateJsonFromHtml) { grdHtmlToJson(); }
    var temp = {};
    for (var i=dBeg; i<=dEnd; i++) {
        temp[i] = trDataJson[i].h.slice(cBeg, (cEnd+1));
    }
    // source -> destination
    for (var i=sBeg,j=dBeg; i<=sEnd; i++,j++) {
        trDataJson[j].h.splice(cBeg, (cEnd-cBeg+1));        // destination remove
        var sData = trDataJson[i].h.slice(cBeg, (cEnd+1));  // source data
        for (var k=cBeg,l=0; k<=cEnd; k++,l++) {
            trDataJson[j].h.splice((cBeg+l),0,sData[l]);    // source -> dest
        }
    }
    // temp -> source
    for (var i=sBeg,j=dBeg; i<=sEnd; i++,j++) {
        trDataJson[i].h.splice(cBeg, (cEnd-cBeg+1));        // source remove
        for (var k=cBeg,l=0; k<=cEnd; k++,l++) {
            trDataJson[i].h.splice((cBeg+l),0,temp[j][l]);  // source put
        }
    }
}

// Code By Amit Malakar (CONVERT TO JSON)
// Date - 9 Mar, 2016
function findSegStartEndByEvent(segRow,segCol) {
    var eventCol = parseInt(segCol)+1;
    var eventCon = 'NaN';
    var eventDes = 'NaN';
    var tdText = '';
    var maxRow = $(".center-div table.fixed-left-column tr").length - 1;

    // get nearest constructor
    var wrongDes = '', wrongCon = '';
    for(var i=segRow; i>=2; i--) {
        tdText = $.trim($(".center-div table.fixed-left-column tr:eq("+i+") td:eq("+eventCol+")").text()).replace(/\s/g, "");
        if(tdText.toLowerCase().indexOf('creation') >= 0) {
            eventCon = i;
            break;
        }
    }

    // get nearest destructor
    for(var i=segRow; i<=maxRow; i++) {
        tdText = $.trim($(".center-div table.fixed-left-column tr:eq("+i+") td:eq("+eventCol+")").text()).replace(/\s/g, "");
        if(tdText.toLowerCase().indexOf('destruction') >= 0) {
            eventDes = i;
            break;
        }
    }

    return [parseInt(eventCon), parseInt(eventDes)];
}

// Code By Amit Malakar (CONVERT TO JSON)
// Date - 17 Mar, 2016
function findAllPhaseStartEnd(col) {
    var strucCol = $(".schedule-segment-week").length ? $(".schedule-segment-week:first").parents('td').index() : 6;
    var structuredArr = findSegmentsInCol(strucCol,'schedule');
    var strucAllBegEnd = [];
    for (var i = 0; i < structuredArr.length; i++) {
        var strucSplit = structuredArr[i].split('_');
        strucAllBegEnd.push(strucSplit[1]+'_'+strucSplit[2]);
    }
    var phaseStartEndArr = [];
    $(".center-div table.fixed-left-column tr:gt(1)").find("td:eq(" + col + ")").each(function () {
        if ($(this).find("input.custom-node").length) {
            //var tdClass     = $(this).attr('class');
            var segStartEnd    = findSegStartEndByEvent($(this).parent('tr').index(),$(this).index()); //(parentClassArr[1], parentClassArr[2]);

            // find type
            var type           = '';
            var match = segStartEnd[0] + '_'+ segStartEnd[1];
            if($.inArray(match, strucAllBegEnd) > -1) {
                type = 'structured'; // structured phase
            } else {
                type = 'unstructured'; // unstructured phase
            }

            phaseStartEndArr.push({
                type: type,
                beg: parseInt(segStartEnd[0]),
                end: parseInt(segStartEnd[1])
            });
        }
    });
    return phaseStartEndArr;
}

function unstrucPhaseMenuDisable($_this) {
    var td_class = $_this.closest('td').attr('class');
    var parent_class = $.grep(td_class.split(" "), function(v, i) {
        return v.indexOf('parent_') === 0;
    }).join();
    var unstrucCol = 5;
    var clickedRow = parseInt(parent_class.split('_')[1]);
    var clickedCol = parseInt(parent_class.split('_')[2]);
    segLoc = findSegStartEndByEvent(clickedRow,unstrucCol);
    var segCon = parseInt(segLoc[0]);
    var segDes = parseInt(segLoc[1]);
    var opExists = $(".center-div div.fixed-top-header tr:eq(1) .operation-header").length;
    var desRow = 1;
    if(segDes-segCon < 3) {
        $('#drpUnstrucPhase').find('li.unstructure-phase-up-segment').addClass('disabled');
        $('#drpUnstrucPhase').find('li.unstructure-phase-down-segment').addClass('disabled');
        $('#drpUnstrucPhase').find('li.unstructure-phase-remove-segment').addClass('disabled');
    } else {
        $('#drpUnstrucPhase').find('li.unstructure-phase-up-segment').removeClass('disabled');
        $('#drpUnstrucPhase').find('li.unstructure-phase-down-segment').removeClass('disabled');
        $('#drpUnstrucPhase').find('li.unstructure-phase-remove-segment').removeClass('disabled');
    }

    if(clickedRow == segCon) {
        // disable move up
        $('#drpUnstrucPhase').find('li.unstructure-phase-up-segment').addClass('disabled');
    }
    if(opExists) desRow = 5;

    if((clickedRow+desRow) == segDes) {
        // disable move down
        $('#drpUnstrucPhase').find('li.unstructure-phase-down-segment').addClass('disabled');
    }
}

/*function stucMenuDisable($_this) {
    $_this.siblings('div.add-segment').find('li.schedule-create-new').removeClass('disabled');
    $_this.siblings('div.add-segment').find('li.schedule-create-new a').removeClass('disabled');
    $_this.siblings('div.add-segment').find('li.schedule-add-up').addClass('disabled');
    $_this.siblings('div.add-segment').find('li.schedule-add-down').addClass('disabled');
}*/

/*
 * All on load event functions
 * Amit Malakar
 * Date: 07-Apr-2016
 */
$(document).ready(function() {
    $('body').on('click', '.schedule-delete', function() {
        var row = $('.iconActive').closest('tr').index();
        var col = $('.iconActive').closest('td').index();
        console.log(row + ' - ' + col);
        bootbox.confirm("Are you sure you want to delete this?", function(confirmed) {
            if (confirmed) {
                deleteScheduleSegment(row,col);
            }
        });
    });

    $('body').on('click', '.unstructure-phase-divide-segment', function() {
        var $_this    = $(this);
        var row = $('.iconActive').closest('tr').index();
        var col = $('.iconActive').closest('td').index();
        trDataJson[row].h[col].c += ' divAfterOpDelete';
        if ($_this.hasClass('checkOperations')) {
            bootbox.confirm({
                message: "Doing so will remove all added operation and roles series. Do you wish to continue?",
                title: 'Heads up!',
                callback: function (confirmed) {
                    if (confirmed) {
                        deleteOperations();
                        row = $('.divAfterOpDelete').closest('tr').index();
                        col = $('.divAfterOpDelete').closest('td').index();
                        unstrucPhaseDivide(row,col);
                    }
                }
            });
        } else {
            unstrucPhaseDivide(row,col);
        }
    });

    $('body').on('click', '.unstructure-phase-up-segment', function() {
        //$(this).closest('ul.dropdown-menu').removeClass('show');
        var td_class = $('.iconActive').closest('td').attr('class');
        var parent_class = $.grep(td_class.split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();
        var unstrucCol = 5;
        var clickedRow = parseInt(parent_class.split('_')[1]);
        var clickedCol = parseInt(parent_class.split('_')[2]);
        var segBoundary = findSegStartEndByEvent(clickedRow,unstrucCol);
        var segBoundaryTop = segBoundary[0];
        var segBoundaryBot = segBoundary[1];
        //console.log(segBoundaryTop +  ' - ' + segBoundaryBot + ' | ' + clickedRow + ' - ' + clickedCol);

        for(var row=clickedRow-1; row>=segBoundaryTop; row--){
            if(trDataJson[row].h[clickedCol].h.indexOf('custom-node') > -1){
                var lastCol = trDataJson[1].h.length - 2;
                var sourceInfo = findSegStartEndByEvent(clickedRow, clickedCol);
                var destntInfo = findSegStartEndByEvent(row, clickedCol);
                if((sourceInfo[1]-sourceInfo[0]) == (destntInfo[1]-destntInfo[0])) {
                    //console.log(sourceInfo[0]+' - '+sourceInfo[1]+' - '+destntInfo[0]+' - '+destntInfo[1]+' - '+clickedCol+' - '+lastCol);
                    grdSwapData(sourceInfo[0],sourceInfo[1],destntInfo[0],destntInfo[1],clickedCol,lastCol,1);
                }
                break;
            }
        }
        grdCreateTableFromJson();
        removeBorder();
        if($(".center-div div.fixed-top-header tr:eq(1) td .operation-header").length) {
            $('#role_universe_data').html(getRoleUniverse());
            // show flyout
            //$('#operationPaneFlyout').animate({right:'0px'}).addClass('in');
            //OperationPane();
        }
    });

    $('body').on('click', '.unstructure-phase-down-segment', function() {
        var td_class = $('.iconActive').closest('td').attr('class');
        var parent_class = $.grep(td_class.split(" "), function(v, i) {
            return v.indexOf('parent_') === 0;
        }).join();
        var unstrucCol = 5;
        var clickedRow = parseInt(parent_class.split('_')[1]);
        var clickedCol = parseInt(parent_class.split('_')[2]);
        var segBoundary = findSegStartEndByEvent(clickedRow,unstrucCol);
        var segBoundaryTop = segBoundary[0];
        var segBoundaryBot = segBoundary[1];

        for(var row=clickedRow+1; row<=segBoundaryBot; row++){
            if(trDataJson[row].h[clickedCol].h.indexOf('custom-node') > -1){
                var lastCol = trDataJson[1].h.length - 2;
                var sourceInfo = findSegStartEndByEvent(clickedRow, clickedCol);
                var destntInfo = findSegStartEndByEvent(row, clickedCol);
                if((sourceInfo[1]-sourceInfo[0]) == (destntInfo[1]-destntInfo[0])) {
                    //console.log(sourceInfo[0]+' - '+sourceInfo[1]+' - '+destntInfo[0]+' - '+destntInfo[1]+' - '+clickedCol+' - '+lastCol);
                    grdSwapData(sourceInfo[0],sourceInfo[1],destntInfo[0],destntInfo[1],clickedCol,lastCol,1);
                }
                break;
            }
        }
        grdCreateTableFromJson();
        removeBorder();
        if($(".center-div div.fixed-top-header tr:eq(1) td .operation-header").length) {
            $('#role_universe_data').html(getRoleUniverse());
            // show flyout
            //$('#operationPaneFlyout').animate({right:'0px'}).addClass('in');
            //OperationPane();
        }
    });

    $('body').on('click', '.schedule-extend', function() {
        var myRow = $('.iconActive').closest('tr').index();
        var myCol = $('.iconActive').closest('td').index();

        // get the number of segments
        var tdClass = $('.iconActive').closest('td').attr('class');
        var segment_class = $.grep(tdClass.split(" "), function(v, i) {
            return v.indexOf('schedule_') === 0;
        }).join();
        var segArr = segment_class.split('_');

        // set the number of segments
        var no_of_segments = 0;
        if($('.schedule-segment-day').length) {
            no_of_segments = (segArr[2] - segArr[1] + 1) / (7*2);
        } else {
            no_of_segments = (segArr[2] - segArr[1] + 1) / 2;
        }
        //var no_of_segments = findSegmentsInCol(myCol,'schedule').length;//(segArr[2] - segArr[1] + 1) / 2;
        $('#timeline_form').find('input.wk_segment').val(no_of_segments);
        if($('#scheduleExtend').length) {
            $('#scheduleExtend').val(myRow+'_'+myCol+'#'+segArr[1] + '_' + segArr[2]);
        } else {
            $("#scheduleStatus").after('<input type="hidden" id="scheduleExtend" value="' +myRow+'_'+myCol+'#'+segArr[1]+'_'+segArr[2]+'" />');
        }

        $('#scheduleRow').val($(".center-div table.fixed-left-column tr").length);
        $('#scheduleCol').val(myCol);
        $("#scheduleStatus").val('');

        //scheduleSegment(myRow, myCol, 'append');
        openThreePaneSchedule();
    });

    // Code By Amit Malakar
    // Manage Schedule
    $('body').on('click', '.schedule-create-new', function() {
        var myCol = $('.iconActive').closest('td').index();
        /*$(this).closest('.dropdown-menu').removeClass('show');
        var tdWrapper = $(this).closest('td'),
            trWrapper = $(tdWrapper).parent('tr'),
            //tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        myRow = $(trWrapper).index();*/
        $('#scheduleRow').val($(".center-div table.fixed-left-column tr").length);
        $('#scheduleCol').val(myCol);
        $("#scheduleStatus").val('');
        $("#scheduleExtend").val('');
        //console.log(myRow + ' - ' + myCol);
        //scheduleSegment(myRow, myCol, 'last');
        openThreePaneSchedule();
    });

    $('body').on('click', '.unstructure-phase-remove-segment', function() {
        $_this  = $(this);
        var row = $('.iconActive').closest('tr').index();
        var col = $('.iconActive').closest('td').index();
        trDataJson[row].h[col].c += ' delAfterOpDelete';
        //$_this.closest('.dropdown-menu').removeClass('show');
        var msg = '', ttl = '';
        if ($_this.hasClass('checkOperations')) {
            msg = "Doing so will remove all added operation and roles series. Do you wish to continue?";
            ttl = 'Heads up!';
        } else {
            msg = "Are you sure you want to delete this?";
        }
        bootbox.confirm({
            message: msg,
            title: ttl,
            callback: function (confirmed) {
                if (confirmed) {
                    if ($_this.hasClass('checkOperations')) {
                        deleteOperations();
                        row = $('.delAfterOpDelete').closest('tr').index();
                        col = $('.delAfterOpDelete').closest('td').index();
                    }
                    unstrucPhaseRemove(row,col);
                    fillPlusImage();
                }
            }
        });
    });

    $('body').on('click', '#drpAddOperation .add-phase-operations', function() {
        $(this).parents('ul').removeClass('show');
        var rPhaseInfoArr = getRealPhaseInfo();
        var phaseBegEndArr = findAllPhaseStartEnd(rPhaseInfoArr[0]);
        var opExists = $(".center-div div.fixed-top-header tr:eq(1) .operation-header").length;

        if(phaseBegEndArr.length) {
            var unstrucMap = {};
            var phaseMap = {};
            if(!opExists) {
                var op1Map  = {'0': 'head', '1': 'lbl'};
                var op2Map  = {'0': 'head', '1': 'lbl'};
                var op1EMap = {'0': 'head', '1': 'lbl'};
                var op2EMap = {'0': 'head', '1': 'lbl'};
                var rlMap   = {'0': 'head', '1': 'lbl'};
                var unvMap  = {'0': 'head', '1': 'lbl'};
            } else {
                var op1Map  = {}, op2Map  = {}, op1EMap = {},
                    op2EMap = {}, rlMap   = {}, unvMap  = {};
            }
            var rowsAdded = 0;
            $.each(phaseBegEndArr, function(index, element) {
                if(element.type=='unstructured') {
                    // add blank rows
                    var sRow = parseInt(element.beg)+1+rowsAdded;
                    addBlankRows(sRow, 4);
                    // adjust unstruc & phase rows
                    for (var i = sRow; i < (sRow+4); i++) {
                        var rw = (i).toString();
                        unstrucMap[rw] = 'b';
                        phaseMap[rw] = 'b';
                    }
                    rowsAdded+=4;
                    //console.log(element.type + ' - ' + element.beg + ' - ' + element.end + ' - ' + sRow + ' - ' + rowsAdded);
                    injectHtmlToJson(sRow,(sRow+3),5,unstrucMap,grdGetUnstructureArray(),'o',0);
                    injectHtmlToJson(sRow,(sRow+3),parseInt(rPhaseInfoArr[0]),phaseMap,grdGetPhaseArray(),'o',0);
                }
            });

            // get operations column insertion point
            var addCol = parseInt(rPhaseInfoArr[0])+2;

            // add operations
            var rowsAdded = 0,opHeader = 0;
            $.each(phaseBegEndArr, function(index, element) {
                if(element.type=='unstructured') {
                    var sRow = parseInt(element.beg)+rowsAdded;
                    for (var i = sRow; i <= (sRow+5); i++) {
                        rw = i.toString();
                        if(i==sRow) {
                            op1Map[rw]='s';op1EMap[rw]='s';op2Map[rw]='m';op2EMap[rw]='s';rlMap[rw]='g';unvMap[rw]='g';
                        } else if(i==sRow+1) {
                            op1Map[rw]='b';op1EMap[rw]='g';op2Map[rw]='b';op2EMap[rw]='g';rlMap[rw]='g';unvMap[rw]='p';
                        } else if(i==sRow+2) {
                            op1Map[rw]='b';op1EMap[rw]='g';op2Map[rw]='b';op2EMap[rw]='e';rlMap[rw]='g';unvMap[rw]='g';
                        } else if(i==sRow+3) {
                            op1Map[rw]='b';op1EMap[rw]='g';op2Map[rw]='i';op2EMap[rw]='s';rlMap[rw]='g';unvMap[rw]='g';
                        } else if(i==sRow+4) {
                            op1Map[rw]='b';op1EMap[rw]='g';op2Map[rw]='b';op2EMap[rw]='g';rlMap[rw]='i';unvMap[rw]='g';
                        } else if(i==sRow+5) {
                            op1Map[rw]='b';op1EMap[rw]='e';op2Map[rw]='b';op2EMap[rw]='e';rlMap[rw]='g';unvMap[rw]='g';
                        }
                    }
                    //$.extend(op2Map, {sRow:'m',rw1:'b',rw2:'b',rw3:'i',rw4:'b',rw5:'b'});
                    if(rowsAdded==0 && !opExists) { opHeader = 1; } else { opHeader = 0; }
                    injectHtmlToJson(sRow,(i-1),addCol,op1Map,grdGetOperation1Array(),'o',opHeader);
                    injectHtmlToJson(sRow,(i-1),addCol+1,op1EMap,grdGetEventArray(),'e',opHeader);
                    injectHtmlToJson(sRow,(i-1),addCol+2,op2Map,grdGetOperation2Array(),'o',opHeader);
                    injectHtmlToJson(sRow,(i-1),addCol+3,op2EMap,grdGetEventArray(),'e',opHeader);
                    injectHtmlToJson(sRow,(i-1),addCol+4,rlMap,grdGetRoleArray(),'o',opHeader);
                    injectHtmlToJson(sRow,(i-1),addCol+5,unvMap,grdGetUniverseArray(),'o',opHeader);
                    rowsAdded+=4;
                }
            });

            if($('.schedule-segment-week:first').length)
                updateSegmentsInCol($('.schedule-segment-week:first').parents('td').index(),'schedule');

            grdCreateTableFromJson();

            // add operation check:
            // unstruc - add/below, delete
            // phase - unstruc phase divide
            $('.unstructured-add-above-segment').addClass('checkOperations');
            $('.unstructured-add-below-segment').addClass('checkOperations');
            $('.unstructured-del-segment').addClass('checkOperations');
            $('.unstructure-phase-divide-segment').addClass('checkOperations');
            $('.unstructure-phase-remove-segment').addClass('checkOperations');

            // add role universe html to flyout
            // hide role universe html from grid
            $('#role_universe_data').html(getRoleUniverse());
            $('#role_universe_data tr:last td').addClass('border-bottom');
            // show flyout
            $('#operationPaneFlyout').animate({right:'0px'}).addClass('in');
            OperationPane();
            fillPlusImage();
        } else {
            console.log('phase do not exists.');
        }
        getDropdown();
        cellFlyout();
    });
});

/* =========================== Code By Arvind Soni ===========================*/
/* Get Unstructure Array
 * Arvind Soni
 * Date: 04/05/16
 */
function grdGetUnstructureArray() {
    var unstrureArray           = [];
    unstrureArray['head']       = '<span class="top-col">#$#COL#$#</span>';
    unstrureArray['lbl']        = '<div data-id="#$#COL#$#" class="col-head"><div class="node-circle node-white-circle">N</div><span class="icon phase-icon"></span><span class="col-head-title">Unstructured</span></div>';
    // start unstrure
    unstrureArray['s']          = '<div class="gridMenu segment-node merge-td border-light-top" data-id="drpUnstructured"><div class="node-circle node-white-circle">N</div><div class="col-text segment-text"><span class="col-node-text"><input type="text" class="custom-node undefined" placeholder="Undefined"></span></div></div>';
    // blank
    unstrureArray['b']          = '<div class="segment-node blank-div"></div>';
    // end
    unstrureArray['e']          = '<div class="segment-node blank-div unstructure-last-div"></div>';
    // greyed
    unstrureArray['g']          = '<div class="segment-node blank-div greyed"></div>';    // creation-bg in td

    return unstrureArray;
}

/* Code By Arvind Soni */
$(document).ready(function() {
    /* For Add First Unstructure Segment With Phase */
    $('body').on('click', '.center-div .unstructured', function() {

        var tdWrapperU  = $(this).closest('td');
        var trWrapperU  = $(tdWrapperU).closest('tr');
        var rowU        = $(trWrapperU).index();
        var colU        = $(tdWrapperU).index();

        var isP         =   isProperOrNot();
        isP             =   isP.split(':');
        var isUnsPro    =   isP[0];
        var isStrPro    =   isP[1];

        var phase                   = isPhaseProper();
        phase                       = phase.split(':');
        var isPhasePro              = phase[0];
        var phaseColNo              = phase[1];

        if(parseInt(isUnsPro) == 0 && parseInt(isStrPro) == 0)
        {
            grdHtmlToJson();
            var unstr   = {'2':'s', '3':'e'};
            var event1  = {'0':'head', '1':'lbl', '2':'s', '3':'e'};
            var phase   = {'2':'su', '3':'e'};
            var event2  = {'0':'head', '1':'lbl', '2':'s', '3':'e'};
            injectHtmlToJson(2,3,5,unstr,grdGetUnstructureArray(),'o',0);
            injectHtmlToJson(2,3,6,event1,grdGetEventArray(),'e',1);
            injectHtmlToJson(2,3,8,phase,grdGetPhaseArray(),'o',0);
            injectHtmlToJson(2,3,9,event2,grdGetEventArray(),'e',1);
            grdCreateTableFromJson();
            removeBorder();
        }
        else if(parseInt(isUnsPro) == 0 && parseInt(isStrPro) == 1)
        {
            var index                   = 0;
            $(".center-div table.fixed-left-column").each(function() {
                var $table          = $(this);
                var $rows           = $("tbody tr", $(this));
                $rows.each(function(row, v) {
                    index = row;
                });
            });

            var sR = parseInt(index)+1;
            var eR = parseInt(index)+2;
            grdHtmlToJson();

            var mapPre = {};
            var map2 = {};
            map2[0] = 'head';
            map2[1] = 'lbl';
            for(i=2;i<parseInt(sR);i++)
            {
                mapPre[i] = 'g';
                map2[i] = 'g';
            }
            map2[sR] = 's';
            map2[eR] = 'e';

            var map1 = {[sR]:'s', [eR]:'e'};
        var map3 = {[sR]:'su', [eR]:'e'};
    var map4 = {[sR]:'s', [eR]:'e'};
injectHtmlToJson(2,index,5,mapPre,grdGetUnstructureArray(),'o',0);
injectHtmlToJson(sR,eR,5,map1,grdGetUnstructureArray(),'o',0);
injectHtmlToJson(sR,eR,6,map2,grdGetEventArray(),'e',1);
injectHtmlToJson(sR,eR,parseInt(phaseColNo)+1,map3,grdGetPhaseArray(),'o',0);
injectHtmlToJson(sR,eR,parseInt(phaseColNo)+2,map4,grdGetEventArray(),'e',0);
grdUpdateLastFourCols(index);
grdCreateTableFromJson();
removeBorder();
}
});

/* For Add Above Unstructure Segment With Phase */
$('body').on('click', '#drpUnstructured .unstructured-add-above-segment', function () {
    var $_this    = $(this);
    //hideUnstructureOptionMenu();
    var row = $('.iconActive').closest('tr').index();
    var col = $('.iconActive').closest('td').index();
    console.log(row + ' - ' + col);
    if ($_this.hasClass('checkOperations')) {
        bootbox.confirm({
            message: "Doing so will remove all added operation and roles series. Do you wish to continue?",
            title: 'Heads up!',
            callback: function (confirmed) {
                if (confirmed) {
                    unstrucAddAbove(row,col);
                    deleteOperations();
                    fillPlusImage();
                    removeBorder();
                }
            }
        });
    } else {
        unstrucAddAbove(row,col);
        fillPlusImage();
        removeBorder();
    }
});

/* For Add Below Unstructure Segment With Phase */
$('body').on('click', '#drpUnstructured .unstructured-add-below-segment', function() {
    var $_this    = $(this);
    //hideUnstructureOptionMenu();
    var row = $('.iconActive').closest('tr').index();
    var col = $('.iconActive').closest('td').index();
    if ($_this.hasClass('checkOperations')) {
        bootbox.confirm({
            message: "Doing so will remove all added operation and roles series. Do you wish to continue?",
            title: 'Heads up!',
            callback: function (confirmed) {
                if (confirmed) {
                    unstrucAddBelow(row,col);
                    deleteOperations();
                    fillPlusImage();
                    removeBorder();
                }
            }
        });
    } else {
        unstrucAddBelow(row,col);
        fillPlusImage();
        removeBorder();
    }
});

/* For Move Below Unstructure Segment With Phase */
$('body').on('click', '#drpUnstructured .unstructured-add-down-segment', function() {
    //hideUnstructureOptionMenu();
    var cRow = $('.iconActive').closest('tr').index();
    var cCol = $('.iconActive').closest('td').index()+1;

    var cLastRow            =  0;
    var totalRows           = -1;

    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            totalRows++;
            if(row > parseInt(cRow)){
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {
                    if(cell == parseInt(cCol))
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");
                        if(text == 'NDestruction' && parseInt(cLastRow) == 0)
                        {
                            cLastRow = row;
                        }
                    }
                });
            }
        });
    });

    segmentStartRow         = cRow;
    segmentEndRow           = cLastRow;

    shiftSegmentStartRow    = 0;
    shiftSegmentEndRow      = 0;

    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row > parseInt(segmentEndRow)){
                $(this).find("td").each(function(cell, va) {

                    if(cell == parseInt(cCol))
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");

                        if(text == 'NCreation' && parseInt(shiftSegmentStartRow) == 0)
                        {
                            shiftSegmentStartRow = row;
                        }

                        if(text == 'NDestruction' && parseInt(shiftSegmentEndRow) == 0)
                        {
                            shiftSegmentEndRow = row;
                        }
                    }
                });
            }
        });
    });

    if(parseInt(shiftSegmentStartRow) == 0 && parseInt(shiftSegmentEndRow) == 0)
    {
        shiftSegmentStartRow  =  parseInt(segmentEndRow)+1;
        shiftSegmentEndRow    =  parseInt(totalRows);
    }
    else if(parseInt(shiftSegmentStartRow) > 0 && parseInt(shiftSegmentEndRow) > 0 && parseInt(segmentEndRow)+1 != parseInt(shiftSegmentStartRow))
    {
        shiftSegmentEndRow    =  parseInt(shiftSegmentStartRow)-1;
        shiftSegmentStartRow  =  parseInt(segmentEndRow)+1;
    }

    var isP                     = isProperOrNot();
    isP                         = isP.split(':');
    var isUnsPro                = isP[0];
    var isStrPro                = isP[1];


    if(parseInt(isStrPro) == 1)
    {
        newArray = updateSegmentsInCol(7,'schedule');
        for(i=0; i<newArray.length; i++)
        {
            nText = newArray[i].split('_');
            startRange  = nText[1];
            endRange    = nText[2];

            if(parseInt(startRange) == parseInt(shiftSegmentStartRow) && parseInt(endRange) < parseInt(shiftSegmentEndRow))
            {
                shiftSegmentStartRow = startRange;
                shiftSegmentEndRow   = endRange;
            }
        }
    }



    console.log('segmentStartRow = '+segmentStartRow+', '+'segmentEndRow = '+segmentEndRow);
    console.log('shiftSegmentStartRow = '+shiftSegmentStartRow+', '+'shiftSegmentEndRow = '+shiftSegmentEndRow);

    moveUpAndDownOfUnstructureSegmet(segmentStartRow,segmentEndRow,shiftSegmentStartRow,shiftSegmentEndRow,5);
});

/* For Move Above Unstructure Segment With Phase */
$('body').on('click', '#drpUnstructured .unstructured-add-up-segment', function() {
    //hideUnstructureOptionMenu();
    var cRow = $('.iconActive').closest('tr').index();
    var cCol = $('.iconActive').closest('td').index()+1;

    var cLastRow     = 0;
    var totalRows    = -1;
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            totalRows++;
            if(row > parseInt(cRow)){
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {
                    if(cell == parseInt(cCol))
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");
                        if(text == 'NDestruction' && parseInt(cLastRow) == 0)
                        {
                            cLastRow = row;
                        }
                    }
                });
            }
        });
    });

    shiftSegmentStartRow  = cRow;
    shiftSegmentEndRow    = cLastRow;

    segmentStartRow         = 0;
    segmentEndRow           = 0;

    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row < parseInt(shiftSegmentStartRow)){
                $(this).find("td").each(function(cell, va) {

                    if(cell == parseInt(cCol))
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");

                        if(text == 'NCreation')
                        {
                            segmentStartRow = row;
                        }

                        if(text == 'NDestruction')
                        {
                            segmentEndRow = row;
                        }
                    }
                });
            }
        });
    });

    var no = segmentEndRow;

    if(parseInt(segmentEndRow)+1 != parseInt(shiftSegmentStartRow))
    {
        segmentStartRow = parseInt(segmentEndRow)+1;
        segmentEndRow   = parseInt(shiftSegmentStartRow) -1;

        if(parseInt(segmentStartRow) < 2)
        {
            segmentStartRow = 2;
        }
    }

    var isP                     = isProperOrNot();
    isP                         = isP.split(':');
    var isUnsPro                = isP[0];
    var isStrPro                = isP[1];

    if(parseInt(isStrPro) == 1)
    {
        newArray = updateSegmentsInCol(7,'schedule');
        for(i=0; i<newArray.length; i++)
        {
            nText = newArray[i].split('_');
            startRange  = nText[1];
            endRange    = nText[2];

            if(parseInt(endRange) == parseInt(segmentEndRow))
            {
                segmentStartRow = startRange;
                segmentEndRow   = endRange;
            }
        }
    }

    console.log('segmentStartRow = '+segmentStartRow+', '+'segmentEndRow = '+segmentEndRow);
    console.log('shiftSegmentStartRow = '+shiftSegmentStartRow+', '+'shiftSegmentEndRow = '+shiftSegmentEndRow);

    moveUpAndDownOfUnstructureSegmet(segmentStartRow,segmentEndRow,shiftSegmentStartRow,shiftSegmentEndRow,5);
});

/* For Delete Unstructure Segment With Phase */
$('body').on('click', 'li.unstructured-del-segment', function() {
    var $_this = $(this);
    //hideUnstructureOptionMenu();
    var row = $('.iconActive').closest('tr').index();
    var col = $('.iconActive').closest('td').index();
    var msg = '', ttl = '';
    if ($_this.hasClass('checkOperations')) {
        msg = "Doing so will remove all added operation and roles series. Do you wish to continue?";
        ttl = 'Heads up!';
    } else {
        msg = "Are you sure you want to delete this?";
    }
    bootbox.confirm({
        message: msg,
        title: ttl,
        callback: function (confirmed) {
            if (confirmed) {
                unstrucDeleteSegment(row,col);
                if ($_this.hasClass('checkOperations')) {
                    deleteOperations();
                }
                fillPlusImage();
                removeBorder();
            }
        }
    });
});

/* For Divide And Manage Options Of Structure Phase Segment */
$('body').on('click', '#drpStrucPhase .structure-phase-divide-segment', function() {
    var myRow = $('.iconActive').closest('tr').index();
    var myCol = $('.iconActive').closest('td').index();
    var isDay           =   $('.schedule-segment-day').length;
    var isP             =   isProperOrNot();
    var phase           =   isPhaseProper();

    isP                 =   isP.split(':');
    phase               =   phase.split(':');
    isUnsPro            =   isP[0];
    isStrPro            =   isP[1];
    isPhasePro          =   phase[0];
    phaseColNo          =   phase[1];

    if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
    var newArray        =   updateSegmentsInCol(scheduleCol,'schedule');

    /* Get Segment Start And End Row Number */
    segmentStartRow     =   0;
    segmentEndRow       =   0;
    for(i=0; i<newArray.length; i++)
    {
        nText = newArray[i].split('_');
        startRange  = nText[1];
        endRange    = nText[2];

        if(parseInt(startRange) <= parseInt(myRow) && parseInt(myRow) < parseInt(endRange))
        {
            segmentStartRow     =   startRange;
            segmentEndRow       =   endRange;
        }
    }

    /* Get Total Number Of Phases Within Segment With Star and End Rows */
    totalSegment        =   0;
    totalWeek           =   0;
    phaseStartPoints    =   '';
    phaseEndPoints      =   '';
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row >= parseInt(segmentStartRow) && row <= parseInt(segmentEndRow)){
                $(this).find("td").each(function(cell, va) {

                    if(cell == parseInt(phaseColNo)+1)
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");

                        if(text == 'NCreation')
                        {
                            phaseStartPoints = phaseStartPoints+row+',';
                            totalSegment++;
                        }

                        if(text == 'NDestruction')
                        {
                            phaseEndPoints = phaseEndPoints+row+',';
                        }
                    }

                    if(cell == parseInt(scheduleCol)+1)
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");

                        if(text == 'NCreation')
                        {
                            totalWeek++;
                        }
                    }
                });
            }
        });
    });

    totalWeeksOfStructre  =   totalWeek;

    $("#segmentStartRow").attr('value',segmentStartRow);
    $("#segmentEndRow").attr('value',segmentEndRow);
    $("#totalWeek").attr('value',totalWeek);
    $("#phaseStartPoints").attr('value',phaseStartPoints);
    $("#phaseEndPoints").attr('value',phaseEndPoints);
    $("#phaseColumnNum").attr('value',phaseColNo);

    if(parseInt(totalSegment) == 1)
    {
        $("#totalSegment").attr('value',2);
        $("#totalSegmentTemp").attr('value',2);
        var sweekDD            =   getWeekDropdown(isDay,totalWeek,'start',1);
        var sweekDD1           =   getWeekDropdown(isDay,totalWeek,'start',2);
        var snippet =   '<tbody><tr>'
            +   '<td class="seg-no">Segment1</td>'
            +   '<td>'
            +   sweekDD
            +   '</td>'
            +   '<td class="lastSegment-divide"></td>'
            +   '</tr>'
            +   '<tr>'
            +   '<td class="seg-no">Segment2</td>'
            +   '<td>'
            +   sweekDD1
            +   '</td>'
            +   '<td class="lastSegment-divide"></td>'
            +   '</tr></tbody>';
    }
    else
    {
        $("#totalSegment").attr('value',totalSegment);
        $("#totalSegmentTemp").attr('value',totalSegment);
        var snippet =   '<tbody>';
        for(ii=0;ii<parseInt(totalSegment);ii++)
        {
            var num                 =   parseInt(ii)+1;
            var sweekDD             =   getWeekDropdown(isDay,totalWeek,'start',num);
            snippet +=   '<tr>'
                +   '<td class="seg-no">Segment'+num+'</td>'
                +   '<td>'
                +   sweekDD
                +   '</td>';
            if(parseInt(ii) < 1)
                snippet +=   '<td class="lastSegment-divide"></td>';
            else
                snippet +=   '<td class="refCloseSegment lastSegment-divide"><i class="icon close"></i></td>';
            snippet +=   '</tr>';
        }
        snippet +=   '</tbody>';
    }

    /* Put the dynamic week list in to popup */
    $('.my-table-of-divide').html(snippet);
    $("#error_divide").html('');
    /* open the popup */
    var getTrLength     =       $('.segmentList').find('tr').length;
    if(getTrLength <= 4){
        $('.segmentList').height(getTrLength*36)
    }

    $('#segmentPopup').modal('show');
    $('#segmentPopup').on('shown.bs.modal',function(){
        $(".nano").nanoScroller();
        $(".nano").nanoScroller({ scroll: 'bottom' });
    })

    // $('.segmentList').css('height','72px');
    /* Jquery Code For Week and Days Open In Edit Mode */
    if(parseInt(totalSegment) > 1)
    {
        if(parseInt(isDay) > 0)
        {
            phaseStartPoints          =   phaseStartPoints.slice(0, -1);
            phaseStartPoints          =   phaseStartPoints.split(',');

            weekRow = 14;
            weekNum = 1;
            dayRow  = 2;
            var weekNumStr = '';
            for(i=parseInt(segmentStartRow); i<parseInt(segmentEndRow);i=parseInt(weekRow)+i)
            {
                dayStartRow = (2 + ((parseInt(weekNum) - 1) * 14));
                dayEndRow   = (parseInt(segmentStartRow) + (parseInt(weekNum) * 14));
                dayNum  = 1;
                for(k=parseInt(dayStartRow); k<parseInt(dayEndRow);k=parseInt(dayRow)+k)
                {
                    for(j=0;j<phaseStartPoints.length;j++)
                    {
                        if(parseInt(k) == parseInt(phaseStartPoints[j]))
                        {
                            weekNumStr += weekNum+'-'+dayNum+',';
                        }
                    }
                    dayNum++;
                }
                weekNum++;
            }

            weekNumStr                 =   weekNumStr.slice(0, -1);
            weekNumStr                 =   weekNumStr.split(',');

            index = 1;
            for(i=0;i<weekNumStr.length;i++)
            {
                dayStr = weekNumStr[i].split('-');
                $("#week_start"+index).val(parseInt(dayStr[0]));
                $("#day_start"+index).val(parseInt(dayStr[1]));
                index++;
            }
        }
        else
        {
            phaseStartPoints          =   phaseStartPoints.slice(0, -1);
            phaseStartPoints          =   phaseStartPoints.split(',');
            weekRow                   =   2;
            weekNum                   =   1;

            var weekNumStr = '';
            for(i=parseInt(segmentStartRow); i<parseInt(segmentEndRow);i=parseInt(weekRow)+i)
            {
                for(j=0;j<phaseStartPoints.length;j++)
                {
                    if(parseInt(i) == parseInt(phaseStartPoints[j]))
                    {
                        weekNumStr += weekNum+',';
                    }
                }
                weekNum++;
            }

            weekNumStr                  =   weekNumStr.slice(0, -1);
            weekNumStr                  =   weekNumStr.split(',');
            index                       =   1;
            for(i=0;i<weekNumStr.length;i++)
            {
                $("#week_start"+index).val(parseInt(weekNumStr[i]));
                index++;
            }
        }

        $(".main-button-divide-segment").html('Confirm');
    }
    else
    {
        $(".main-button-divide-segment").html('Create');
    }

    /* Jquery Code For First Week and Days */
    $(".week-dd-class").first().find('option').remove();
    $(".week-dd-class").first().append('<option value="1">Week 1</option>');

    if(parseInt(isDay) > 0)
    {
        $(".day-dd-class").first().find('option').remove();
        $(".day-dd-class").first().append('<option value="1">Day 1</option>');
    }
});

/* For Add New Segment On Structure Phase Segment */
$('body').on('click','.Add-new-segment', function(e){
    var isDay           =   $('.schedule-segment-day').length;
    $("#error_divide").html('');

    var toS                   =   parseInt($("#totalSegmentTemp").val())+1;
    if(parseInt(isDay) > 0)
        var totalWeek             =   parseInt($("#totalWeek").val())*7;
    else
        var totalWeek             =   parseInt($("#totalWeek").val());

    if(parseInt(toS) > parseInt(totalWeek))
    {
        $("#error_divide").html('total segments can not be greater to total weeks.');
        return false;
    }

    num                 =   parseInt($("#totalSegment").val())+1;
    num1                =   parseInt($("#totalSegmentTemp").val())+1;

    $("#totalSegment").val(num);
    $("#totalSegmentTemp").val(num1);
    var sweekDD         =   getWeekDropdown(isDay,totalWeeksOfStructre,'start',num);
    var snippet         =   '<tr>'
        +   '<td class="seg-no">Segment'+num1+'</td>'
        +   '<td >'
        +   sweekDD
        +   '</td>'
        +   '<td class="refCloseSegment lastSegment-divide"><i class="icon close"></i></td>'
        +   '</tr>';

    $(this).siblings('.segmentList').find('tr').last().after(snippet);
    var getTrLength     =       $('.segmentList').find('tr').length;
    if(getTrLength <= 4){
        $('.segmentList').height(getTrLength*36)
    }
    $(".nano").nanoScroller();
    $(".nano").nanoScroller({ scroll: 'bottom' });
});

/* For Delete Structure Phase Segment */
$('body').on('click','.refCloseSegment', function(e){
    $("#error_divide").html('');
    $(this).closest('tr').remove();
    var getTrLength     =       $('.segmentList').find('tr').length;
    if(getTrLength <= 4){
        $('.segmentList').height(getTrLength*36)
    }

    num1                 =   parseInt($("#totalSegmentTemp").val())-1;
    $("#totalSegmentTemp").val(num1);

    var noItem = 1;
    $(".seg-no").each(function() {
        $(this).html("Segment"+noItem);
        noItem++;
    });
});

$('body').on('click', '#drpStrucPhase .structure-phase-up-segment', function() {
    /*var tdWrapper       =   $(this).closest('td');
    var trWrapper       =   $(tdWrapper).parent('tr');
    var tableWrapper    =   $(trWrapper).parent();
    var myCol           =   $(tdWrapper).index();
    var myRow           =   $(trWrapper).index();*/
    var myRow           =   $('.iconActive').closest('tr').index();
    var myCol           =   $('.iconActive').closest('td').index();
    console.log(myRow + ' - ' + myCol);
    var isP             =   isProperOrNot();
    isP                 =   isP.split(':');
    isUnsPro            =   isP[0];
    isStrPro            =   isP[1];


    if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
    var newArray        =   updateSegmentsInCol(scheduleCol,'schedule');

    /* Get Segment Start And End Row Number */
    segmentStartRow     =   0;
    segmentEndRow       =   0;
    for(i=0; i<newArray.length; i++)
    {
        nText = newArray[i].split('_');
        startRange  = nText[1];
        endRange    = nText[2];

        if(parseInt(startRange) <= parseInt(myRow) && parseInt(myRow) < parseInt(endRange))
        {
            segmentStartRow     =   startRange;
            segmentEndRow       =   endRange;
        }
    }

    temp                =   findSegStartEndByEvent(myRow,myCol);
    startRow            =   temp[0];
    endRow              =   temp[1];

    temp1               =   findSegStartEndByEvent(parseInt(temp[0])-1,myCol);
    startRow1           =   temp1[0];
    endRow1             =   temp1[1];

    //console.log(segmentStartRow+','+segmentEndRow);
    //console.log(startRow+','+endRow);
    //console.log(startRow1+','+endRow1);
    if(parseInt(startRow1) >= parseInt(segmentStartRow) && parseInt(endRow) != parseInt(endRow1))
        moveUpAndDownOfUnstructureSegmet(startRow1,endRow1,startRow,endRow,myCol);
});

$('body').on('click', '#drpStrucPhase .structure-phase-down-segment', function() {
    /*var tdWrapper       =   $(this).closest('td');
    var trWrapper       =   $(tdWrapper).parent('tr');
    var tableWrapper    =   $(trWrapper).parent();
    var myCol           =   $(tdWrapper).index();
    var myRow           =   $(trWrapper).index();*/
    var myRow           =   $('.iconActive').closest('tr').index();
    var myCol           =   $('.iconActive').closest('td').index();
    console.log(myRow + ' - ' + myCol);
    var isP             =   isProperOrNot();
    isP                 =   isP.split(':');
    isUnsPro            =   isP[0];
    isStrPro            =   isP[1];


    if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
    var newArray        =   updateSegmentsInCol(scheduleCol,'schedule');

    /* Get Segment Start And End Row Number */
    segmentStartRow     =   0;
    segmentEndRow       =   0;
    for(i=0; i<newArray.length; i++)
    {
        nText = newArray[i].split('_');
        startRange  = nText[1];
        endRange    = nText[2];

        if(parseInt(startRange) <= parseInt(myRow) && parseInt(myRow) < parseInt(endRange))
        {
            segmentStartRow     =   startRange;
            segmentEndRow       =   endRange;
        }
    }

    temp                =   findSegStartEndByEvent(myRow,myCol);
    startRow            =   temp[0];
    endRow              =   temp[1];

    temp1               =   findSegStartEndByEvent(parseInt(temp[1])+1,myCol);
    startRow1           =   temp1[0];
    endRow1             =   temp1[1];

    //console.log(segmentStartRow+','+segmentEndRow);
    //console.log(startRow+','+endRow);
    //console.log(startRow1+','+endRow1);
    if(parseInt(startRow1) < parseInt(segmentEndRow) && parseInt(startRow) != parseInt(startRow1))
        moveUpAndDownOfUnstructureSegmet(startRow,endRow,startRow1,endRow1,myCol);
});
});

/* For Add Above Unstructure Segment */
function unstrucAddAbove(myRow,myCol)
{
    var phase                   = isPhaseProper();
    phase                       = phase.split(':');
    var isPhasePro              = phase[0];
    var phaseColNo              = phase[1];

    var startRow                = myRow;
    var endRow                  = parseInt(myRow)+1;

    grdHtmlToJson();
    addBlankRows(startRow,2);

    var map1                    = {[startRow]:'s', [endRow]:'e'};
    var map2                    = {[startRow]:'s', [endRow]:'e'};
    var map3                    = {[startRow]:'su', [endRow]:'e'};
    var map4                    = {[startRow]:'s', [endRow]:'e'};

    injectHtmlToJson(startRow,endRow,5,map1,grdGetUnstructureArray(),'o',0);
    injectHtmlToJson(startRow,endRow,6,map2,grdGetEventArray(),'e',0);
    injectHtmlToJson(startRow,endRow,parseInt(phaseColNo),map3,grdGetPhaseArray(),'o',0);
    injectHtmlToJson(startRow,endRow,parseInt(phaseColNo)+1,map4,grdGetEventArray(),'e',0);
    if($('.schedule-segment-week').length)
        updateSegmentsInCol($('.schedule-segment-week:first').closest('td').index(),'schedule');
    grdCreateTableFromJson();
}

/* For Add Below Unstructure Segment */
function unstrucAddBelow(myRow,myCol)
{
    segRowCol       =   findSegStartEndByEvent(myRow,myCol);
    myRow           =   parseInt(segRowCol[1])-1 > 2 ? parseInt(segRowCol[1])-1: myRow;
    grdHtmlToJson();
    lastRowNo       = trDataJson.length;

    addBlankRows(parseInt(segRowCol[1])+1,2);
    var phase                   = isPhaseProper();
    phase                       = phase.split(':');
    var isPhasePro              = phase[0];
    var phaseColNo              = phase[1];

    var startRow = parseInt(segRowCol[1])+1;
    var endRow   = parseInt(startRow)+1;

    var map1 = {[startRow]:'s', [endRow]:'e'};
    var map2 = {[startRow]:'s', [endRow]:'e'};
    var map3 = {[startRow]:'su', [endRow]:'e'};
    var map4 = {[startRow]:'s', [endRow]:'e'};

    injectHtmlToJson(startRow,endRow,5,map1,grdGetUnstructureArray(),'o',0);
    injectHtmlToJson(startRow,endRow,6,map2,grdGetEventArray(),'e',0);
    injectHtmlToJson(startRow,endRow,parseInt(phaseColNo),map3,grdGetPhaseArray(),'o',0);
    injectHtmlToJson(startRow,endRow,parseInt(phaseColNo)+1,map4,grdGetEventArray(),'e',0);

    if(parseInt(lastRowNo)-1 == parseInt(segRowCol[1]))
        grdUpdateLastFourCols(parseInt(segRowCol[1]));
    if($('.schedule-segment-week').length)
        updateSegmentsInCol($('.schedule-segment-week:first').closest('td').index(),'schedule');
    grdCreateTableFromJson();
}

/* For Delete Unstructure Segment */
function unstrucDeleteSegment(myRow,myCol) {
    //var dataArray               = getDataArray();
    var isP                     = isProperOrNot();
    var phase                   = isPhaseProper();

    isP                         = isP.split(':');
    var isUnsPro                = isP[0];
    var isStrPro                = isP[1];

    phase                       = phase.split(':');
    var isPhasePro              = phase[0];
    var phaseColNo              = phase[1];

    countSegments               = $(".center-div .unstructure-last-div").length;

    var stEn                    = findSegStartEndByEvent(myRow,5);
    console.log('isUnsPro = '+isUnsPro+',isStrPro = '+isStrPro+',myRow = '+myRow+',countSegments = '+$(".center-div .unstructure-last-div").length+',isPhasePro = '+isPhasePro+',phaseColNo = '+phaseColNo);

    if(parseInt(countSegments) > 1)
    {
        var length = 0;
        for(i=parseInt(stEn[0]);i<=parseInt(stEn[1]);i++)
        {
            length++;
        }
        removeRows(myRow,length);
        if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
        updateSegmentsInCol(scheduleCol,'schedule');
        grdCreateTableFromJson();
        fillPlusImage();
    }
    else if(parseInt(countSegments) == 1)
    {
        if(parseInt(myRow) == 2 && parseInt(isStrPro) == 0)
        {
            $.post(domainUrl+'grid/index',{},responseCallAction,'html');
        }
        else
        {
            removeCols(6, 1);
            var length = 0;
            for(i=parseInt(stEn[0]);i<=parseInt(stEn[1]);i++)
            {
                length++;
            }
            removeRows(myRow,length);
            if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
            updateSegmentsInCol(scheduleCol,'schedule');
            grdCreateTableFromJson();
            fillPlusImage();
        }
    }
}

/* For Fill the Plus Icon Image On Both (Unstructure And Structure Segments) */
function fillPlusImage()
{
    /* Start Code By Arvind Soni For Unstructured And Structure Segment */
    var isP                     = isProperOrNot();
    isP                         = isP.split(':');
    var isUnsPro                = isP[0];
    var isStrPro                = isP[1];

    var totalRows = -1;
    $(".Add-unstructured-segment1").remove();
    $(".center-div table.fixed-left-column").each(function() {
        var $rows           = $("tbody tr", $(this));

        $rows.each(function(row, v) {
            totalRows++;
            $(this).find("td").each(function(cell, va) {
                if (row >= 2)
                {

                    if(parseInt(isUnsPro) == 0 && parseInt(isStrPro) == 0)
                    {
                        if(cell == 5)
                        {
                            $(this).addClass('unstructured');
                            if(row == 2)
                                $(this).append('<span class="icon-plus Add-unstructured-segment1" ></span>');
                        }
                        if(cell == 6)
                        {
                            $(this).addClass('structuredSche');
                            if(row == 2)
                                $(this).append('<span class="icon-plus Add-unstructured-segment1" ></span>');

                            var getcCellLenth   =   $("td.structuredSche").length;
                            var getCellHig      =   $("td.unstructured").outerHeight();
                            var gettotalHig     =   getCellHig *  getcCellLenth;
                            $('.Add-unstructured-segment1').height(gettotalHig);
                        }
                    }
                    else if(parseInt(isUnsPro) == 1 && parseInt(isStrPro) == 0)
                    {
                        if(cell == 5)
                        {
                            $(this).addClass('unstructured');
                        }
                        if(cell == 6)
                        {
                            $(this).addClass('unstructured');
                        }
                        if(cell == 7)
                        {
                            $(this).addClass('structuredSche');
                            if(row == 2)
                                $(this).append('<span class="icon-plus Add-unstructured-segment1" ></span>');

                            var getcCellLenth   =   $("td.structuredSche").length;
                            var getCellHig      =   $("td.unstructured").outerHeight();
                            var gettotalHig     =   getCellHig *  getcCellLenth;

                            $('.Add-unstructured-segment1').height(gettotalHig);
                            //console.log('getcCellLenth',getcCellLenth);
                            //console.log('gettotalHig',gettotalHig);
                        }
                    }
                    else if(parseInt(isUnsPro) == 0 && parseInt(isStrPro) == 1)
                    {
                        if(cell == 5)
                        {
                            $(this).addClass('unstructured');
                            if(row == 2)
                                $(this).append('<span class="icon-plus Add-unstructured-segment1" ></span>');

                            var getcCellLenth   =   $("td.unstructured").length;
                            var getCellHig      =   $("td.unstructured").outerHeight();
                            var gettotalHig     =   getCellHig *  getcCellLenth;
                            $('.Add-unstructured-segment1').height(gettotalHig);
                        }
                        if(cell == 6)
                        {
                            $(this).addClass('structuredSche');
                        }
                        if(cell == 7)
                        {
                            $(this).addClass('structuredSche');
                        }
                    }
                    else if(parseInt(isUnsPro) == 1 && parseInt(isStrPro) == 1)
                    {
                        if(cell == 5)
                        {
                            $(this).addClass('unstructured');
                        }
                        if(cell == 6)
                        {
                            $(this).addClass('unstructured');
                        }
                        if(cell == 7)
                        {
                            $(this).addClass('structuredSche');
                        }
                        if(cell == 8)
                        {
                            $(this).addClass('structuredSche');
                        }

                        $(".Add-unstructured-segment1").remove();
                    }
                }
            });
        });
    });
    removeBorder();

    if(parseInt(isUnsPro) == 1) { scheduleCol = 7; } else { scheduleCol = 6; }
    updateSegmentsInCol(scheduleCol,'schedule');

    /* End Code By Arvind Soni For Unstructured And Structure Segment */
}

/* For Move Up And Down Segment */
function moveUpAndDownOfUnstructureSegmet(segmentStartRow,segmentEndRow,shiftSegmentStartRow,shiftSegmentEndRow,fromCol)
{
    grdHtmlToJson();
    var preData                 = [];
    var postData                = [];
    for(var i=parseInt(segmentStartRow); i<=parseInt(segmentEndRow); i++)
    {
        var tdData                = [];
        for(var j=0; j<trDataJson[i].h.length; j++)
        {
            if(j >= parseInt(fromCol))
                tdData.push({'tds':trDataJson[i].h[j]});
        }
        preData.push({'html':tdData });
    }

    for(var i=parseInt(shiftSegmentStartRow); i<=parseInt(shiftSegmentEndRow); i++)
    {
        var tdData                = [];
        for(var j=0; j<trDataJson[i].h.length; j++) {
            if(j >= parseInt(fromCol))
                tdData.push({'tds':trDataJson[i].h[j]});
        }
        postData.push({'html':tdData });
    }

    var mergeData = $.merge( $.merge( [], postData ), preData );

    var row = 0;
    for(var i=parseInt(segmentStartRow); i<=parseInt(shiftSegmentEndRow); i++)
    {
        var col = 0;
        for(var j=0; j<trDataJson[i].h.length; j++)
        {
            if(j >= parseInt(fromCol))
            {
                trDataJson[i].h[j] = mergeData[row].html[col].tds;
                col++;
            }
        }
        row++;
    }

    updateSegmentsInCol(7,'schedule');
    grdCreateTableFromJson();
    //hideStructurePhaseOptionMenu();
    removeBorder();
    fillPlusImage();
}

/* For Hide Unstructure Option Popup And Update Schedule Segment Row And Col */
/*function hideUnstructureOptionMenu()
{
    $(".center-div .unstr-div-right-pane").each(function() {
        $(this).closest('i').removeClass('show');
        $(this).find('ul').removeClass('show');
    });

    updateSegmentsInCol(7,'schedule');
}*/

/* For Divide Schedule Phase Segment */
function createDivideSegments()
{
    var isDay                 =   $('.schedule-segment-day').length;
    var segmentStartRow       =   $("#segmentStartRow").val();
    var segmentEndRow         =   $("#segmentEndRow").val();
    var totalSegment          =   $("#totalSegment").val();
    var totalSegmentTemp      =   $("#totalSegmentTemp").val();
    var totalWeek             =   $("#totalWeek").val();
    var phaseStartPoints      =   $("#phaseStartPoints").val();
    var phaseEndPoints        =   $("#phaseEndPoints").val();
    var phaseColumnNum        =   $("#phaseColumnNum").val();
    var is_error              =   'N';

    $("#error_divide").html('');
    if(parseInt(isDay) > 0)
    {
        $(".week-dd-class").each(function() {
            if($(this).val() == "")
            {
                $("#error_divide").html($(this).closest('td').siblings('td').html()+' week can not be empty.');
                is_error              =   'Y';
                return false;
            }
            else if($(this).next('select').val() == "")
            {
                $("#error_divide").html($(this).closest('td').siblings('td').html()+' day can not be empty.');
                is_error              =   'Y';
                return false;
            }
        });
    }
    else
    {
        $(".week-dd-class").each(function() {
            if($(this).val() == "")
            {
                $("#error_divide").html($(this).closest('td').siblings('td').html()+' week can not be empty.');
                is_error              =   'Y';
                return false;
            }
        });
    }

    if(is_error == 'N')
    {
        var count       = 0;
        var start       = 0;
        var end         = 0;
        var temp1       = 0;
        var pointArray  = [];
        var item        = [];

        if(parseInt(totalSegmentTemp) > 1)
        {
            $(".week-dd-class").each(function() {

                if($(this).val() != "" && count != 0)
                {
                    if(parseInt(isDay) > 0)
                    {
                        weekVal     = $(this).val();
                        dayVal      = $(this).next('select').val();
                        start       = parseInt(segmentStartRow) + ((parseInt(weekVal) -1) * 2 * 7) + ((parseInt(dayVal) * 2) - 2);
                    }
                    else
                    {
                        temp        = $(this).val();
                        start       = parseInt(segmentStartRow) + ((parseInt(temp) -1) * 2);
                    }

                    end           = parseInt(start) - 1;
                }

                if(count == 1)
                {
                    item = {start: parseInt(segmentStartRow), end: parseInt(end)};
                    pointArray.push(item);
                    temp1 = parseInt(end) + 1;
                }
                else if(count > 1)
                {
                    temp2  = parseInt(start) - 1;
                    item = {start: parseInt(temp1), end: parseInt(temp2)};
                    pointArray.push(item);
                    temp1  = parseInt(end) + 1;
                }

                count++;
            });
        }
        else
        {
            temp1         = segmentStartRow;
        }

        item = {start: parseInt(temp1), end: parseInt(segmentEndRow)};
        pointArray.push(item);

        var lastI         = parseInt(pointArray.length)-1;
        var eventArray    = grdGetEventArray();
        var pArray        = grdGetPhaseArray();

        $(".center-div table.fixed-left-column").each(function() {
            var $rows           = $("tbody tr", $(this));
            $rows.each(function(row, v) {
                if(parseInt(row) >= parseInt(segmentStartRow) && parseInt(row) <= parseInt(segmentEndRow))
                {
                    $(this).find("td").each(function(cell, va) {
                        objNew = $(this);
                        if(parseInt(phaseColumnNum) == cell)
                        {
                            objNew.html('');
                            objNew.removeClass();
                            objNew.addClass('ExcelTablerow');
                            objNew.addClass('merge-td');
                        }

                        if((parseInt(phaseColumnNum)+1) == cell)
                        {
                            objNew.html('');
                            objNew.removeClass();
                            objNew.addClass('creation-bg');
                        }
                    });
                }
            });
        });

        $(".center-div table.fixed-left-column").each(function() {
            var $rows           = $("tbody tr", $(this));
            $rows.each(function(row, v) {
                if(parseInt(row) >= parseInt(segmentStartRow) && parseInt(row) <= parseInt(segmentEndRow))
                {
                    $(this).find("td").each(function(cell, va) {
                        objNew = $(this);
                        if(parseInt(phaseColumnNum) == cell)
                        {
                            objNew.html(pArray['b']);
                            phase_0_phase   = pArray['ss'];
                            pointArray.forEach(function(points) {
                                if (parseInt(points.start) == parseInt(row)) {
                                    objNew.html(phase_0_phase);
                                }
                                if (parseInt(points.end) == parseInt(row)) {
                                    objNew.html(pArray['e']);
                                }
                            });
                        }

                        if((parseInt(phaseColumnNum)+1) == cell)
                        {
                            objNew.html(eventArray['g']);
                            pointArray.forEach(function(points) {
                                if (parseInt(points.start) == parseInt(row)) {
                                    objNew.html(eventArray['s']);
                                    objNew.removeClass('creation-bg');
                                }
                                if (parseInt(points.end) == parseInt(row)) {
                                    objNew.html(eventArray['e']);
                                    objNew.removeClass('creation-bg');
                                }
                            });
                        }
                    });
                }
            });
        });
        grdHtmlToJson();
        grdCreateTableFromJson();
        $('#segmentPopup').modal('hide');
    }

    //hideStructurePhaseOptionMenu();
    removeBorder();
}

/*function hideStructurePhaseOptionMenu()
{
    $(".center-div .str-div-right-pane-phase").each(function() {
        $(this).closest('i').removeClass('show');
        $(this).find('ul').removeClass('show');
    });
}*/

function getWeekDropdown(isDay,totalWeek,type,number)
{
    if(parseInt(isDay) > 0)
        snippet =   '<select id="week_'+type+number+'" name="week_'+type+'[]" class="select-field week-dd-class dd-'+number+'-'+type+'-week" onchange="setNextOrPreDD(this);" >';
    else
        snippet =   '<select id="week_'+type+number+'" name="week_'+type+'[]" class="select-field single-week week-dd-class dd-'+number+'-'+type+'-week" onchange="setNextOrPreDD(this);" >';

    if(parseInt(number) != 1)
        snippet +=   '<option value="" >Select Week</option>';

    for(i=1;i<=parseInt(totalWeek);i++)
        snippet +=   '<option value="'+i+'" >Week '+i+'</option>';

    snippet +=   '</select>';

    if(parseInt(isDay) > 0)
    {
        snippet +=   '<select id="day_'+type+number+'" name="day_'+type+'[]" class="select-field day-dd-class dd-'+number+'-'+type+'-day" onchange="setNextOrPreDD(this);" >';

        if(parseInt(number) != 1)
            snippet +=   '<option value="" >Select Day</option>';
        for(i=1;i<=7;i++)
            snippet +=   '<option value="'+i+'" >Day '+i+'</option>';

        snippet +=   '</select>';
    }

    return snippet;
}

function setNextOrPreDD(obj)
{
    var isDay     = $('.schedule-segment-day').length;
    className     = $.grep(obj.className.split(" "), function(v, i) { return v.indexOf('dd-') === 0; }).join();
    classArray    = className.split('-');
    number        = classArray[1];
    type          = classArray[2];
    ddType        = classArray[3];

    $("#error_divide").html('');
    if(parseInt(isDay) > 0)
    {
        numberPre           = parseInt(number) - 1;
        numberPre           = givePreNumber(type,numberPre);

        weekVal             = $("#week_"+type+number).val();
        dayVal              = $("#day_"+type+number).val();

        preWeekVal          = $("#week_"+type+numberPre).val();
        preDayVal           = $("#day_"+type+numberPre).val();
        if(parseInt(weekVal) < parseInt(preWeekVal))
        {
            $("#error_divide").html('Please select greater value from previous segment.');
            $("#week_"+type+number).val("");
            return false;
        }
        else if(parseInt(weekVal) == parseInt(preWeekVal) && parseInt(dayVal) <= parseInt(preDayVal) )
        {
            $("#error_divide").html('Please select greater value from previous segment.');
            $("#day_"+type+number).val("");
            return false;
        }

        numberPost          = parseInt(number) + 1;
        numberPost          = givePostNumber(type,numberPost);
        postWeekVal         = $("#week_"+type+numberPost).val();
        postDayVal          = $("#day_"+type+numberPost).val();
        if(parseInt(weekVal) > parseInt(postWeekVal))
        {
            $("#error_divide").html('Please select lesser value from next segment.');
            $("#week_"+type+number).val("");
            return false;
        }
        else if(parseInt(weekVal) == parseInt(postWeekVal) && parseInt(dayVal) >= parseInt(postDayVal) )
        {
            $("#error_divide").html('Please select lesser value from next segment.');
            $("#day_"+type+number).val("");
            return false;
        }
    }
    else
    {
        numberPre     = parseInt(number) - 1;
        numberPre     = givePreNumber(type,numberPre);

        myVal         = $(obj).val();
        preVal        = $("#week_"+type+numberPre).val();
        if(parseInt(myVal) <= parseInt(preVal))
        {
            $("#error_divide").html('Please select greater value from previous segment.');
            $(obj).val("");
            return false;
        }

        numberPost    = parseInt(number) + 1;
        numberPost    = givePostNumber(type,numberPost);
        postVal       = $("#week_"+type+numberPost).val();
        if(parseInt(myVal) >= parseInt(postVal))
        {
            $("#error_divide").html('Please select lesser value from next segment.');
            $(obj).val("");
            return false;
        }
    }
}

function givePreNumber(typeT,numberT)
{
    if($("#week_"+typeT+numberT).length == 0)
    {
        numberT     = parseInt(numberT)-1;
        numberT     = givePreNumber(typeT,numberT);
    }

    return numberT;
}

function givePostNumber(typeT,numberT)
{
    if($("#week_"+typeT+numberT).length == 0)
    {
        numberT     = parseInt(numberT)+1;
        numberT     = givePostNumber(typeT,numberT);
    }

    return numberT;
}

function removeBorder()
{
    var index                   = 0;
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            index = row;
        });
    });

    $(".center-div table").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row < parseInt(index)){
                var rowClass = $(this).attr('class');
                $(this).find("td").each(function(cell, va) {
                    $(this).removeClass('border-bottom');
                });
            }
        });
    });

    var lastRow = $(".center-div table.fixed-left-column tr").length;
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row == parseInt(lastRow)-1){

                $(this).find("td").each(function(cell, va) {
                    $(this).addClass('border-bottom');
                });
            }
        });
    });
}

function isProperOrNot()
{
    var isUnsPro = 0;
    var isStrPro = 0;
    $(".center-div .fixed-top-header table").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            $(this).find("td").each(function(cell, va) {
                if (row == 1) {
                    text = $.trim($(this).text()).replace(/\s/g, "");
                    if(cell == 6)
                    {
                        if(text == 'N.Event')
                            isUnsPro = 1;
                    }
                }
            });
        });
    });

    if(isUnsPro == 0)
    {
        $(".center-div .fixed-top-header table").each(function() {
            var $rows           = $("tbody tr", $(this));
            $rows.each(function(row, v) {
                $(this).find("td").each(function(cell, va) {
                    if (row == 1) {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        if(cell == 7)
                        {
                            if(text == 'N.Event')
                                isStrPro = 1;
                        }
                    }
                });
            });
        });
    }
    else
    {
        $(".center-div .fixed-top-header table").each(function() {
            var $rows           = $("tbody tr", $(this));
            $rows.each(function(row, v) {
                $(this).find("td").each(function(cell, va) {
                    if (row == 1) {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        if(cell == 8)
                        {
                            if(text == 'N.Event')
                                isStrPro = 1;
                        }
                    }
                });
            });
        });
    }

    return isUnsPro+':'+isStrPro;
}

function isPhaseProper()
{
    var phaseText               = '';
    var phaseColNo              = '';
    var phaseEveNo              = '';
    var counterPhase            = 0;
    var isPhasePro              = 0;
    $(".center-div .fixed-top-header table").each(function() {
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v){
            $(this).find("td").each(function(cell, va) {
                if (row == 1) {
                    text = $.trim($(this).text()).replace(/\s/g, "");
                    if(text == 'NPhase' && counterPhase == 0) {
                        phaseText = text;
                        phaseColNo = cell;
                        counterPhase = 1;
                    }

                    if(text == 'N.Event' && counterPhase == 1) {
                        phaseEveNo = cell;
                        counterPhase = 2;
                    }
                }
            });
        });
    });


    newVar = parseInt(phaseEveNo) -1;
    if(parseInt(phaseColNo) == parseInt(newVar))
    {
        isPhasePro    = 1;
    }

    return isPhasePro+':'+phaseColNo;
}

function callUns($_this) {
    console.log('calling callUns function');
    $('#drpUnstructured').find('a').each(function (e) {
        $(this).removeClass('disabled');
        $(this).closest('li').removeClass('disabled');
    });

    var str          = findUnstructureLastRows();
    var strArray     = str.split(',');
    var lastSegStart = strArray[0];
    var lastSegEnd   = strArray[1];
    var totalRow     = strArray[2];
    $("#drpUnstructured").each(function () {
        myRow = $_this.closest('tr').index();
        myCol = $_this.closest('td').index();
        $(this).find('a').each(function (e) {
            text = $.trim($(this).text()).replace(/\s/g, "");
            text = text.replace(/[0-9]+/, "");
            if (parseInt(myRow) == 2) {
                if (text == 'NAbove' || text == 'NUp')
                    $(this).closest('li').addClass('disabled');
            }
            if (parseInt(myRow) == parseInt(lastSegStart) && parseInt(totalRow) == parseInt(lastSegEnd)) {
                if (text == 'NDown')
                    $(this).closest('li').addClass('disabled');
            }
        });
    });
}

function callStrP(obj)
{
    var strRow = $('.iconActive').closest('tr').index();
    var strCol = $('.iconActive').closest('td').index();
    var isP                     = isProperOrNot();
    isP                         = isP.split(':');
    var isUnsPro                = isP[0];
    var isStrPro                = isP[1];
    if(parseInt(isUnsPro) == 1)
        var newArray                = updateSegmentsInCol(7,'schedule');
    else
        var newArray                = updateSegmentsInCol(6,'schedule');

    var segmentStartRow         = 0;
    var segmentEndRow           = 0;

    for(i=0; i<newArray.length; i++)
    {
        nText = newArray[i].split('_');
        startRange  = nText[1];
        endRange    = nText[2];

        if(parseInt(startRange) <= parseInt(strRow) && parseInt(endRange) > parseInt(strRow))
        {
            segmentStartRow = startRange;
            segmentEndRow   = endRange;
        }
    }

    /* Get Total Number Of Phases Within Segment With Star and End Rows */
    phaseStartPoints    =   '';
    $(".center-div table.fixed-left-column").each(function() {
        var $table          = $(this);
        var $rows           = $("tbody tr", $(this));
        $rows.each(function(row, v) {
            if(row >= parseInt(segmentStartRow) && row <= parseInt(segmentEndRow)){
                $(this).find("td").each(function(cell, va) {
                    if(cell == parseInt(strCol)+1)
                    {
                        text = $.trim($(this).text()).replace(/\s/g, "");
                        text = text.replace(/[0-9]+/, "");

                        if(text == 'NCreation')
                        {
                            phaseStartPoints = phaseStartPoints+row+',';
                        }
                    }
                });
            }
        });
    });

    phaseStartPoints = phaseStartPoints.slice(0, -1);
    phaseStartPoints = phaseStartPoints.split(',');
    len              = parseInt(phaseStartPoints.length)-1;
    if(phaseStartPoints.length > 1) {
        $('#drpStrucPhase').find('li.structure-phase-divide-segment a span').html('Manage Segment');
        if (parseInt(phaseStartPoints[0]) == parseInt(strRow)) {
            var index = 0;
            $('#drpStrucPhase').find('ul .sub-item').each(function () {
                $(this).find('li').each(function () {
                    $(this).removeClass('disabled');

                    if (index == 0) {
                        $(this).addClass('disabled');
                    }

                    if (index == 1) {
                        $(this).removeClass('disabled');
                    }
                    index++;
                });
            });
        } else if (parseInt(phaseStartPoints[len]) == parseInt(strRow)) {
            var index = 0;
            $('#drpStrucPhase').find('ul .sub-item').each(function () {
                $(this).find('li').each(function () {
                    $(this).removeClass('disabled');

                    if (index == 0) {
                        $(this).removeClass('disabled');
                    }

                    if (index == 1) {
                        $(this).addClass('disabled');
                    }
                    index++;
                });
            });
        } else {
            $('#drpStrucPhase').find('ul .sub-item li').removeClass('disabled');
        }
    } else {
        $('#drpStrucPhase').find('li.structure-phase-divide-segment a span').html('Divide Segment');
        $('#drpStrucPhase').find('ul .sub-item li').addClass('disabled');
    }
    //console.log(strRow+', '+strCol+', '+segmentStartRow+', '+segmentEndRow+', '+phaseStartPoints.length);
}
window.puJsFileLoadCounter++;