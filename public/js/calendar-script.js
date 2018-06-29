// var selectStartDate = 0;
// var DefaultNeweventDate = 0;
// var selectEndDate = 0;
// var numdiff = 0;
// $(document).ready(function(){
//     fullCalendar();
//     fullCalendarEvents();


//     //left menu Add Event Click function
//     $('body').on('click','[data-id="74_Add event"]',function(e){
//         $('.course-detail-panel .calendarevents_accordian').removeClass("collapsed");
//         $('#inlineCourse4:not(".in")').collapse('show');
//         $(".newevent-startdate").datepicker().datepicker("setDate", new Date());
//         var ed = numberDateCalculation($(".newevent-startdate").val(),1);
//         $(".newevent-enddate").datepicker().datepicker("setDate",ed);
//         $('.daysNumber').val("1");
//         e.stopPropagation();
//     }); 

    


//      //=====================list and grid view switching=============================
//     // $('body').on("click",".calendar-right a, #sub_nav_69 a",function(e){
//     //     if($(this).attr("data-original-title") == "Grid"){
//     //         $('#sub_nav_69 a').parent().removeClass('active');
//     //         $(".calendar-right a, #sub_nav_69 a").removeClass("active");
//     //        // $(this).addClass("active");
//     //         setTimeout(function(){$('#sub_nav_69 a').eq(0).parent().addClass('active');
//     //         $('.calendar-right a').eq(1).addClass('active');
//     //         },100);
//     //         $('.list-calendar-details').hide();
//     //         $('.fullCalendar').show();
//     //     } else {
//     //         $('#sub_nav_69 a').parent().removeClass('active');
//     //         $(".calendar-right a, #sub_nav_69 a").removeClass("active");
//     //        // $(this).addClass("active");
//     //         setTimeout(function(){$('#sub_nav_69 a').eq(1).parent().addClass('active');
//     //         $('.calendar-right a').eq(0).addClass('active');
//     //         },100);
//     //         $('.list-calendar-details').show();
//     //         $('.fullCalendar').hide();
//     //         var listHeight = $(".listing-wrapper").height()-$(".listing-wrapper .control-bar").height();
//     //         $(".list-calendar-details").height(listHeight+"px");
//     //         var nanoHeight = $(".list-calendar-details").height()-$(".calendar-table-head").height();
//     //         $(".list-calendar-details .nano").height(nanoHeight+"px");
//     //         $('.nano').nanoScroller();
//     //     }
//     //  e.stopPropagation();
//     // });
    


// });



// function fullCalendar(){
//     var calanderpanelHght = $(window).height()-($('.control-bar').height()+$('.right-header').height()+$('.breadcrumb-wrap').height());
//     $('#pui_calendar').fullCalendar({
//         header: {
//             left: 'prev,next today',
//             center: 'title',
//             right: ''
//         },
//         // for add events
//         selectable: true,
//         selectHelper: true,
//         height: calanderpanelHght,
//         firstDay: 1,
//         editable: true,
//         eventStartEditable: true,
//         events: [
//         {
//             title: 'All Day Event',
//             start: '2015-11-02'
//         }
//         ],
//         // here is the part :
//         select: function(start, end,jsEvent) {
//             for (var key in start){
//                 if(key == "_d"){
//                     selectStartDate = numberDateCalculation(start[key],0);
//                 }
//             }

//             for (var key in end){
//                 if(key == "_d"){
//                     selectEndDate = numberDateCalculation(end[key],0);
//                 }
//             }
//         },
//         eventClick: function(event) {
//         // opens events in a popup window
//         // window.open(event.url, 'gcalevent', 'width=700,height=600');
//         // return false;
//         },
            
//         loading: function(bool) {
//             $('#loading').toggle(bool);
//         },
//         windowResize: function(view) {
//              var calanderpanel = ($('.listing-wrapper').height() - 43);
//             $('#pui_calendar').fullCalendar('option', 'height',calanderpanel);
//         },
//         eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
//         },
//         dayClick: function(date, allDay, jsEvent, view) { 
//             DefaultNeweventDate = date.format("MM/D/YYYY");

//         },
//         dayRightclick: function(date, jsEvent, view) {
//             var selectDate = date.format("MM/D/YYYY");
//             if(selectStartDate == 0 ){
//                DefaultNeweventDate = selectDate ;
//                $("#pui_calendar").fullCalendar( 'select', selectDate,selectDate);
//                numdiff = 1;

//             } else {
//                 var flag = false;
//                 var start = new Date(selectStartDate);
//                 var end = new Date(selectEndDate);
//                 var selectiondate = new Date(selectDate);
//                 while(start < end){
//                     if (start.getTime() == selectiondate.getTime()) {
//                         flag= true;
//                     } 
//                     var newDate = start.setDate(start.getDate() + 1);
//                     start = new Date(newDate);
//                 }

//                if(flag == true){
//                     DefaultNeweventDate = selectStartDate;
//                     numdiff = daydiff(parseDate(selectStartDate), parseDate(selectEndDate));
//                } else {
//                     DefaultNeweventDate = selectDate;
//                     numdiff = 1;
//                     $("#pui_calendar").fullCalendar('unselect');
//                     $("#pui_calendar").fullCalendar( 'select', selectDate,selectDate);
//                }

//             }
//         }
//     });
//   //  defaultNewEventvalues ();
//     rightMenuDropDown(); 
//      //dynamically set width & margin in event flyout
//     var clw =  $(".display-wrapper").outerWidth()+60;
//     $("#NewEventFlyout.rightFlyout").css({"width":clw+"px","margin-right":'-'+clw+"px"}); 
//     var eventHeight = $('#NewEventFlyout .event-form-section').height();  
//     $('#NewEventFlyout .nano').height(eventHeight);
// }
// function fullCalendarEvents(){
//     var dateToday = new Date();    
//     $(".newevent-datepicker").datepicker();
    
//     //on doubleclick show newEvent flyout 
//     // $("body").on('dblclick','.fc-widget-content',function(e){
//     //     $("#fly-login-events.user-login-flyout").animate({
//     //         "margin-right":"0px"
//     //     },300,function(){
//     //         $("#fly-login-events.user-login-flyout").addClass("opened");
//     //         $(".nano").nanoScroller();
//     //         flyoutLogin();
//     //         $(".newevent-datepicker").datepicker().datepicker("setDate",DefaultNeweventDate);
//     //     });
//     // });

//     //New-event save button functionality
//     $("body").on('click','.newevent-save',function(e){
//         e.preventDefault();
//         var ET = $('.newevent-title').val();
//         var EST = $('.newevent-startdate').val();
//         var EED = $('.newevent-enddate').val();
//         var newEvent = new Object();
//         newEvent.title = ET;
//         newEvent.start = EST;
//         newEvent.end =   EED
//         newEvent.allDay = true;
//         $('#calendar').fullCalendar( 'renderEvent', newEvent );
//         e.stopPropagation();
//     });

//     // recurrence checkbox functionality
//     $('body').on("click",".recurrence_checkbox",function() {
//         if($(this).is(":checked")) {
//             defaultrecurrence();
//             $("#recurrence-div").css("display","block");
//         } else { 
//             $("#recurrence-div").css("display","none");
//         }
//     });
     


//     //hide menu on the right click of calendar
//     // $('.set-height-tab').on('update',function(){
//     //     $('#right_aContextMenubar').hide();
//     // });
//     // $('#right_aContextMenubar').on("click","a",function(){
//     //     $('#right_aContextMenubar').hide();
//     // });   
//     // $('body').click(function(){
//     //     $('#right_aContextMenubar').hide();
//     // }); 
    
//     //list and grid view switching
//     $('body').on("click",".calendar-panel .calendar-right a",function(){
//         if($(this).attr("data-original-title") == "Grid"){
//             $(".calendar-panel .calendar-right a").removeClass("active");
//             $(this).addClass("active");
//             $('.list-calendar-details').hide();
//             $('.fullCalendar').show();
//         } else {
//             $(".calendar-panel .calendar-right a").removeClass("active");
//             $(this).addClass("active");
//             $('.list-calendar-details').show();
//             $('.fullCalendar').hide();
//         }
//     });

//     //calendar right click new event
//     $("body").on("click","#fly-login-events",function(){
//         $('.course-detail-panel .calendarevents_accordian').removeClass("collapsed");
//         $('#inlineCourse4:not(".in")').collapse('show');
//         $(".newevent-startdate").datepicker().datepicker("setDate",DefaultNeweventDate);
//         var ed = numberDateCalculation($(".newevent-startdate").val(),numdiff);
//         $(".newevent-enddate").datepicker().datepicker("setDate",ed); 
//         $(".daysNumber").val(numdiff);
//        // setDaysweek(numdiff);

//     });

//     // continuous scrolling in calendar
//     $('body').on('mousewheel','.fc-view-container', function(e){
//         e.preventDefault();
//         if(e.originalEvent.wheelDelta >= 0) {
//            // alert(1)
//             $('#pui_calendar').fullCalendar('prev');
//         }
//         else{
//            // alert(2);
//             $('#pui_calendar').fullCalendar('next');
//         }
//         e.stopPropagation();  
//     });

    
//     // flyout open in calendar new event click
//     $('body').on('click',"#right_aContextMenubar #NewEventFlyout",function(){
//             $("#NewEventFlyout").animate({"margin-right":"0"},300);

//              setTimeout(function(){
//                var flyWdth = $("#NewEventFlyout").width();
//                 var totalWdth = flyWdth  - $(".user-action-wrap").width()-1; 
//                 $(".courseflyout").width(totalWdth);

//              },300)
//     });
    
//     // flyout close in new event close button
//     $('body').on('click',"[data-original-title='NewEventCancel']",function(){
//             var margin = $("#NewEventFlyout").outerWidth()+60;
//             $("#NewEventFlyout").animate({"margin-right":"-"+margin+"px"},300);
//     });
    

// }    


// var ts;
// $(document).on('touchstart','.fc-view-container', function (e){
//    ts = e.originalEvent.touches[0].clientY;
// });

// $(document).on('touchend', '.fc-view-container',function (e){
//    var te = e.originalEvent.changedTouches[0].clientY;
//    if(ts > te+5){
//     //alert('up')
//    $('#pui_calendar').fullCalendar('next');
//    }else if(ts < te-5){
//     //alert('down')
//      $('#pui_calendar').fullCalendar('prev');
//    }
// });
 




// // function defaultNewEventvalues(){
// //     var snippet = '<option value="">%i%</option>';
// //     //number functionality 
// //     var dW = ['1 days', '2 days', '3 days', '4 days', '5 days','6 days','1 weeks','2 weeks','3 weeks'];
// //     $.each(dW, function(index, value) { 
// //         var dayweek = snippet.replace('%i%',value);
// //         $(".no-of-day select").append(dayweek);
// //     });
// // }

// //function setDaysweek(numberofdays){
//     // if(numberofdays < 7){
//     //         $('.no-of-day option').each(function(){
//     //             if($(this).text() == numberofdays+" days")
//     //                 $(this).attr("selected","selected");
//     //         });
//     //     } else {
//     //         var numberofweeks = numberofdays/7;
//     //         $('.no-of-day option').each(function(){
//     //             if($(this).text() == numberofweeks+" weeks")
//     //                 $(this).attr("selected","selected");
//     //         });
//     //     }
// //}
// function isNumberKey(evt){
//     var charCode = (evt.which) ? evt.which : evt.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57))
//         return false;
//     return true;
// }
// function hoursMinuteCalculate() {
//     var timeStart = new Date("12/29/2015 " + "01:05 AM");
//     var timeEnd = new Date("12/30/2015 " + "01:07 AM");
//     var diff = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds
//     var minutes = diff % 60;
//     var hours = (diff - minutes) / 60;
// }


//New Integrated Calendar Code
var firstElementDate = "";
var lastElementDate = "";
$(function(){
		
		// $('body').on('click','#pui_calendar div',function(e){
		// 	var oldVal = 'Event Name';
		// 	var newVal = prompt("Title",oldVal);
		// 	if (newVal === null || newVal === oldVal) {
		//     return false;
		// 	}
		// 	if(newVal !== ""){
		// 		$(this).append("<span class='eventInsert selectable'>"+newVal+"</span>");
		// 		$('.dragBtn').click();
		// 		$('.extendBtn').click();

		// 	}
		// });
		
		// $('body').on('click','.dragBtn',function(){
		// 	$('.eventInsert').draggable();
		// });
		// $('body').on('click','.extendBtn',function(){
		// 	$('.eventInsert').resizable();
		// });
		

		
		// $('body').on('click','.selectableBtn',function(){
		// 	$('#pui_calendar').addClass('selectable');
		// 	$( ".selectable" ).selectable({
		// 	start: function( event, ui ) {
		// 	},	
		// 	stop: function() {
		// 	var result = $( "#select-result" ).empty();
		// 	$( ".ui-selected", this ).each(function() {
		// 	  var index = $( "#pui_calendar div" ).index( this );
		// 	  result.append(index + 1+',');
		// 	});
			
		// 	var htmlOfIndexes = result.html();
		// 	htmlOfIndexes = htmlOfIndexes.replace(/,0,/g,",");
		// 	arrIndexes = htmlOfIndexes.split(",");
		// 	var newArray = [];
		// 	for (var i = 0; i < arrIndexes.length; i++) {
		// 	  if (arrIndexes[i] !== undefined && arrIndexes[i] !== null && arrIndexes[i] !== "") {
		// 		newArray.push(arrIndexes[i]);
		// 	  }
		// 	 }	
			
		// 	var maxVal = Math.max.apply(Math,newArray); 
		// 	var minVal = Math.min.apply(Math,newArray); 
			
			
		// 	$("#pui_calendar div").each(function(i,v){
					
				  
		// 		  for(var k = minVal; k <= maxVal; k++){
		// 		    $(k).eq(i).addClass('eventAdded');
		// 			}
		// 		});
			
		// 	alert("Max value is: "+maxVal+"\nMin value is: "+ minVal);
		// 	}
		// 	});
		// });
		var isMouseDown = false;
		var firstElement="";
		var lastElement="";	
		
		$("body").on("mousedown","#pui_calendar div",function(event){
			rightMenuDropDown();
			var $keycode = (event.keyCode ? event.keyCode : event.which);
			isMouseDown = true;
			var getThis = $(this);
			if(event.which===3 && $(this).hasClass("selected")){
				return false;
			}
			if(event.shiftKey && firstElement!="" && $("#"+firstElement).index()<=$(this).index()){
				if($("#"+firstElement).attr("id")==undefined){
					firstElement = $("#pui_calendar div:first").attr("id");
				}
				$("#"+firstElement).nextAll().addBack().each(function(index, element) {
						$(this).addClass("selected");
						lastElement = $(this).attr("id");
						lastElementDate = new Date($(this).attr("data-year"), $(this).attr("data-month")-1, $(this).attr("data-date"));
	                    if($(this).attr("id")==getThis.attr("id")){
							return false;
						}					
	                });
				return false;
			}
			$("#pui_calendar div").removeClass("selected");			
			$(this).addClass("selected");
			firstElement = $(this).attr("id");
			firstElementDate = new Date($(this).attr("data-year"), $(this).attr("data-month")-1, $(this).attr("data-date"));
			
		});
		
		$("*").mouseup(function(){
			isMouseDown = false;
		});
		
		$("body").on("mouseover","#pui_calendar div",function(){
			if(isMouseDown==true){
			lastElement = "";			
			$("#pui_calendar div").removeClass("selected");	
			lastElement = $(this).attr("id");
			lastElementDate = new Date($(this).attr("data-year"), $(this).attr("data-month")-1, $(this).attr("data-date"));
			if($("#"+firstElement).index()<=$("#"+lastElement).index()){
				if($("#"+firstElement).attr("id")==undefined){
					firstElement = $("#pui_calendar div:first").attr("id");
				}
					$("#"+firstElement).nextAll().addBack().each(function(index, element) {
						$(this).addClass("selected");
	                    if($(this).attr("id")==lastElement){
							return false;
						}					
	                });
				}		
			}
		});

	    // flyout open in calendar new event click
	    $('body').on('click',"#right_aContextMenubar #NewEventFlyout",function(){
	            $("#NewEventFlyout").animate({"margin-right":"0"},300);
	             setTimeout(function(){
	               // var flyWdth = $("#NewEventFlyout").width();
	               //  var totalWdth = flyWdth  - $(".user-action-wrap").width()-1; 
	               //  $(".courseflyout").width(totalWdth);
	                $('#NewEventFlyout.rightFlyout').css('width', $('#calender-screen .display-wrapper').outerWidth()+61);  
    				$('#NewEventFlyout .courseflyout').css('width', $('#calender-screen .display-wrapper').outerWidth()-1);
	             },300);
	             $('.nano').nanoScroller();

	            //All day Event Functionality
                var startdate = numberDateCalculation(firstElementDate,0);
	            $(".newevent-startdate").datepicker().datepicker("setDate",startdate);
	            $(".newevent-startdate").datepicker( "option", "minDate",'0' );
	            $('.daysNumber').val($("#pui_calendar div.selected").length);
	            if($("#pui_calendar div.selected").length == 1 ){
                	enddate = numberDateCalculation($(".newevent-startdate").val(),0);
                } else {
                	enddate = numberDateCalculation(lastElementDate,0);
                }
                $(".newevent-enddate").datepicker().datepicker("setDate",enddate);
				$(".newevent-enddate").datepicker( "option", "minDate",$(".newevent-startdate").val());
				
				//$('.daysNumber').val($("#pui_calendar div.selected").length);
				setDays();
                
                //Specific Time Functionaty
                $('.specific-hour').val($('.daysNumber').val()*24);
                $(".specific-startdate").datepicker().datepicker("setDate", startdate);
                $(".specific-startdate").datepicker("option", "minDate",'0');
                var specificenddate =  numberDateCalculation(enddate,1);
                $(".specific-enddate").datepicker("option", "minDate",$(".specific-startdate").val());
				$(".specific-enddate").datepicker().datepicker("setDate",specificenddate);
				$(".specific-starttime").val("12:00AM");
				$(".specific-endtime").val("12:00AM");


	    });

	    // flyout close in new event close button
	    $('body').on('click',"[data-original-title='NewEventCancel']",function(){
	            var margin = $("#NewEventFlyout").outerWidth()+60;
	            $("#NewEventFlyout").animate({"margin-right":"-"+margin+"px"},300);
	    });
        
        //left menu Add Event Click function
		$('body').on('click','[data-id="74_Add event"]',function(e){
				// $('.course-detail-panel .calendarevents_accordian').removeClass("collapsed");
				// $('#inlineCourse4:not(".in")').collapse('show');
				$("#NewEventFlyout").animate({"margin-right":"0"},300);
					setTimeout(function(){
					// var flyWdth = $("#NewEventFlyout").width();
					// var totalWdth = flyWdth  - $(".user-action-wrap").width()-1; 
					// $(".courseflyout").width(totalWdth);
					$('#NewEventFlyout.rightFlyout').css('width', $('#calender-screen .display-wrapper').outerWidth()+61);  
    				$('#NewEventFlyout .courseflyout').css('width', $('#calender-screen .display-wrapper').outerWidth()-1);
	             
				},300);
				$('.nano').nanoScroller();

				//All day Event Functionality
				$(".newevent-startdate").datepicker().datepicker("setDate", new Date());
				$(".newevent-startdate").datepicker( "option", "minDate",'0' );
				$(".newevent-enddate").datepicker().datepicker("setDate",new Date());
				$(".newevent-enddate").datepicker( "option", "minDate",'0' );
				$('.daysNumber').val("1");

				//Specific Time Functionaty
                $('.specific-hour').val("24");
                $(".specific-startdate").datepicker().datepicker("setDate", new Date());
                $(".specific-startdate").datepicker( "option", "minDate",'0');
                var enddate =  numberDateCalculation(new Date(),1);
				$(".specific-enddate").datepicker().datepicker("setDate",enddate);
				$(".specific-enddate").datepicker( "option", "minDate",'0');
				$(".specific-starttime").val("12:00AM");
				$(".specific-endtime").val("12:00AM");
				e.stopPropagation();
		}); 
});

function rightMenuDropDown(){
    var $contextMenubar = $('#right_aContextMenubar');
    $('body').on("contextmenu",'#pui_calendar div', function(e){
        $contextMenubar.css({
            display: "block",
            left: e.pageX,
            top: e.pageY,
          
        });
        return false;

    });
    $('body').on('update','.set-height-tab',function(){
        $('#right_aContextMenubar').hide();
    });
    $contextMenubar.on("click","a",function(){
        $('#right_aContextMenubar').hide();
    });   
    $('body').click(function(){
        $('#right_aContextMenubar').hide();
    }); 
}
function setDynamicallyEvents(){
	//dynamically set width & margin in event flyout
	var clw =  $(".display-wrapper").outerWidth()+60;
	$("#NewEventFlyout.rightFlyout").css({"width":clw+"px","margin-right":'-'+clw+"px"});
	var eventHeight = $('#NewEventFlyout .event-form-section').height();  
    //$('#NewEventFlyout .nano').height(eventHeight);
     var rightFlyoutHig          =   $(window).height()- $('header').outerHeight() - 44 - 51;
    $('.course-inner-wrap').css('height', rightFlyoutHig);
}
function numberDateCalculation(currentdate,number){
    var newdate = new Date(currentdate);
    newdate.setDate(newdate.getDate() + number);
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();
    var someFormattedDate = mm + '/' + dd + '/' + y;
    return someFormattedDate ;
}
function parseDate(str) {
    var mdy = str.split('/')
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
}
function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}
function checkCalendarSelectedDates(){
	$("#pui_calendar div").each(function(index, element) {
		if(firstElementDate!=""){
        var currentDate = $(this).attr("data-date");
        var currentMonth = $(this).attr("data-month")-1;
        var currentYear = $(this).attr("data-year");
		var currentCreatedDate = new Date(currentYear, currentMonth, currentDate);
			if(currentCreatedDate>=firstElementDate && currentCreatedDate<=lastElementDate){
				$(this).addClass("selected");
			}
		}
    });
	
}
function calculateSpecificTimeEndDate(flag) {
	var hour = parseInt($('.specific-hour').val());
	if(isNaN(hour)){
		hour = 0;
	}
	var startdate = $(".specific-startdate").val();
	var starttime = $(".specific-starttime").val();
	var completedate = startdate+" "+starttime;
	var getdate = moment(completedate).add(hour, 'hours').format('MM/DD/YYYY h:mm A');
	var enddate = getdate.substr(0,getdate.indexOf(' '));
	var endtime = getdate.substr(getdate.indexOf(' ')+1);
	var d1 = endtime.substr(0,endtime.indexOf(':'));
	var d2 = endtime.substr(endtime.indexOf(':')+1);
	if(d1.length<2){
		endtime = "0"+d1+":"+d2;
	}
	$(".specific-enddate").datepicker( "option","minDate",$(".specific-startdate").val());
	$(".specific-enddate").datepicker().datepicker("setDate",enddate);
	$(".specific-endtime").val(endtime);
    
    if(flag == true){
    	$(".newevent-startdate" ).datepicker( "option", "minDate",'0');
        $(".newevent-startdate").datepicker("setDate",$(".specific-startdate").val());
        if(hour < 24){
			$(".newevent-enddate" ).datepicker( "option", "minDate",$(".newevent-startdate").val());
			$(".newevent-enddate").datepicker("setDate", $(".specific-enddate").val()); 
			setDays(false);
        } else {
        	$('.daysNumber').val(parseInt(hour/24));
        	calculateAllDayEndDate(false);
        }
	 
    }
	
}

function setHours(flag){
	var startdate = $(".specific-startdate").val();
	var starttime = $(".specific-starttime").val();
	var completestartdate = startdate+" "+starttime;
	var enddate = $(".specific-enddate").val();
	var endtime = $(".specific-endtime").val();
	var completeenddate = enddate+" "+endtime;
	var ms = moment(completeenddate,"MM/DD/YYYY h:mm A").diff(moment(completestartdate,"MM/DD/YYYY h:mm A"));
	var d = moment.duration(ms);
	//var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
	var hours = Math.floor(d.asHours()); 
	$('.specific-hour').val(hours);

	if(flag == true){
		var hour = parseInt($('.specific-hour').val());
		if(isNaN(hour)){
			hour = 0;
		}
		$(".newevent-startdate" ).datepicker( "option", "minDate",'0');
        $(".newevent-startdate").datepicker("setDate",$(".specific-startdate").val());
        if(hour < 24){
			$(".newevent-enddate" ).datepicker( "option", "minDate",$(".newevent-startdate").val());
			$(".newevent-enddate").datepicker("setDate", $(".specific-enddate").val()); 
			setDays(false);
        } else {
        	$('.daysNumber').val(parseInt(hour/24));
        	calculateAllDayEndDate(false);
        }
	}
}

function calculateAllDayEndDate(flag) {
	// For All Day
    var number = parseInt($('.daysNumber').val());
    if(isNaN(number)){
		number = 1;
	}
    var currentdate = $(".newevent-startdate").val();
    var changeDate = numberDateCalculation(currentdate,number-1);
    $(".newevent-enddate").datepicker( "option", "minDate",$(".newevent-startdate").val());
    $(".newevent-enddate").datepicker("setDate",changeDate); 

    firstElementDate = new Date($(".newevent-startdate").val());
    lastElementDate = new Date($(".newevent-enddate").val());
    $("#pui_calendar div").removeClass("selected");	
    checkCalendarSelectedDates();
  
    //for Specific Time
    if(flag == true){
	 $(".specific-startdate").datepicker().datepicker("setDate",$(".newevent-startdate").val());
	 $(".specific-starttime").val("12:00 AM");
	 $('.specific-hour').val(number*24);
     calculateSpecificTimeEndDate(false);
    }
}

function setDays(flag){
	//for all Day
	var numberofdays = daydiff(parseDate($('.newevent-startdate').val()), parseDate($('.newevent-enddate').val()));
	$('.daysNumber').val(numberofdays+1);
	firstElementDate = new Date($(".newevent-startdate").val());
    lastElementDate = new Date($(".newevent-enddate").val());
    $("#pui_calendar div").removeClass("selected");	
    checkCalendarSelectedDates();

	//for specific Time
	if(flag == true){
		var currentdate = $(".newevent-enddate").val();
		var changeDate = numberDateCalculation(currentdate,1);
		$(".specific-enddate").datepicker().datepicker("setDate",changeDate);
		$(".specific-endtime").val("12:00 AM");
		setHours(false);
	}
}
window.puJsFileLoadCounter++;