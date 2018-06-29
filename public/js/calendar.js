var puicalendar = function(){
	var getCalendarDiv = document.getElementById("pui_calendar");
	var getCalendarDetail = document.getElementById("calendar_desc");
	var getToday = document.getElementById("calendar_today");
	var getPrev = document.getElementById("calendar_prev");
	var getNext = document.getElementById("calendar_next");			
	var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var startDate = new Date();
	var prevStartDate = new Date();	
	var today_date = new Date();	
	var StartDateText;
	var EndDateText;
	var elm = getCalendarDiv.getElementsByTagName('div');	
	showCalendar = function(param){
		if(param=="today"){
		var current_date = new Date();		
		}
		else if(param=="next"){
		var current_date = new Date();
		current_date.setFullYear(elm[41].getAttribute("data-year"));
		current_date.setMonth(elm[41].getAttribute("data-month")-1);
		current_date.setDate(elm[41].getAttribute("data-date"));		
		}
		else if(param=="prev"){
		var current_date = new Date();
		current_date.setFullYear(elm[0].getAttribute("data-year"));
		current_date.setMonth(elm[0].getAttribute("data-month")-1);
		current_date.setDate(elm[0].getAttribute("data-date"));		
		current_date.setDate(current_date.getDate()-41);		
		}		
		var getCurrentDay = current_date.getDay();
		var dayDiff = getCurrentDay;		
		dayDiff = 86400000*dayDiff;
		getCalendarDiv.innerHTML = "";		
		for(i=0;i<=41; i++){
			if(getCurrentDay!=0 && param=="today"){
			var currentDate = new Date(current_date - dayDiff);
			}
			else if(param=="next"){
			var currentDate = new Date(current_date);
			currentDate.setDate(currentDate.getDate() + 1);		
			}
			else if(param=="prev"){
			var currentDate = new Date(current_date);
			currentDate.setDate(currentDate.getDate() - 1);		
			}			
			else{
			var currentDate = new Date();			
			}
			currentDate.setDate(currentDate.getDate() + i);	
			var d = document.createElement("div");
			d.setAttribute("data-year",currentDate.getFullYear());
			d.setAttribute("data-Month",currentDate.getMonth()+1);
			d.setAttribute("data-Date",currentDate.getDate());
			d.id = (currentDate.getDate()).toString() + (currentDate.getMonth()+1).toString() + (currentDate.getFullYear()).toString();
			if(today_date.getDate() + ":" + today_date.getMonth() + ":" + today_date.getFullYear()===currentDate.getDate() + ":" + currentDate.getMonth() + ":" + currentDate.getFullYear()){
				d.className = "today_date";
			}
			//d.innerHTML = currentDate.getDate() + " <br> " + months[currentDate.getMonth()];
			if((i==0) || (currentDate.getDate()== 1)) {
				var monthIndex = currentDate.getMonth();
				var monthValue = months[monthIndex];
				d.innerHTML = "<span class=\"pui_date\">" + monthValue.substr(0,3)+" "+currentDate.getDate() + "</span>";
			    getCalendarDiv.appendChild(d);
			} else {
				d.innerHTML = "<span class=\"pui_date\">" + currentDate.getDate() + "</span>";
				getCalendarDiv.appendChild(d);
			}
			
			
			if(i==41){
			startDate.setFullYear(currentDate.getFullYear());
			startDate.setMonth(currentDate.getMonth());
			startDate.setDate(currentDate.getDate());
			prevStartDate.setFullYear(elm[0].getAttribute("data-year"));
			prevStartDate.setMonth(elm[0].getAttribute("data-month")-1);
			prevStartDate.setDate(elm[0].getAttribute("data-date"));		
			}
		}
		StartDateText = months[elm[0].getAttribute("data-month")-1] + " " + elm[0].getAttribute("data-date") + ", " + elm[0].getAttribute("data-year");
		EndDateText = months[elm[41].getAttribute("data-month")-1] + " " + elm[41].getAttribute("data-date") + ", " + elm[41].getAttribute("data-year");
		getCalendarDetail.innerHTML = StartDateText + " - " + EndDateText;
		calenderWidthHeight();
	}
	
	calendarScroll = function(e){
		var e = window.event || e;
		var tmp;
		var dValue = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		if(dValue==-1)
		{   
			var arrayDates = [];
			for (var i = 1; i <= 7; i++) {
				//var currentDate = new Date(months[elm[41].getAttribute("data-month")-1] + " " +  elm[41].getAttribute("data-date") + " " +  elm[41].getAttribute("data-year"));
				var currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
				
				//currentDate.setFullYear(startDate.getFullYear());				
				//currentDate.setMonth(startDate.getMonth());
				//currentDate.setDate(startDate.getDate() + i);
				getCalendarDiv.removeChild(elm[0]);			
				var d = document.createElement("div");
				d.setAttribute("data-year",currentDate.getFullYear());
				d.setAttribute("data-Month",currentDate.getMonth()+1);
				d.setAttribute("data-Date",currentDate.getDate());
				d.id = (currentDate.getDate()).toString() + (currentDate.getMonth()+1).toString() + (currentDate.getFullYear()).toString();				
				if(today_date.getDate() + ":" + today_date.getMonth() + ":" + today_date.getFullYear()===currentDate.getDate() + ":" + currentDate.getMonth() + ":" + currentDate.getFullYear()){
					d.className = "today_date";
				}				
				if((i==0) || (currentDate.getDate()== 1)) {
					var monthIndex = currentDate.getMonth();
					var monthValue = months[monthIndex];
					d.innerHTML = "<span class=\"pui_date\">" + monthValue.substr(0,3) +" "+currentDate.getDate() + "</span>";
			    	getCalendarDiv.appendChild(d);
				} else {
					d.innerHTML = "<span class=\"pui_date\">" + currentDate.getDate() + "</span>";
					getCalendarDiv.appendChild(d);
				}
				if(i==7){
				startDate.setFullYear(elm[41].getAttribute("data-year"));
				startDate.setMonth(elm[41].getAttribute("data-month")-1, elm[41].getAttribute("data-date"));
				prevStartDate.setFullYear(elm[0].getAttribute("data-year"));
				prevStartDate.setMonth(elm[0].getAttribute("data-month")-1, elm[0].getAttribute("data-date"));
				}				
			}
				var monthIndex = elm[0].getAttribute("data-month")-1;
				var monthValue = months[monthIndex];
				var x = document.getElementsByClassName("pui_date");
				var curentDateValue = x[0].innerHTML;
				if(curentDateValue.length<3){
    				x[0].innerHTML =  monthValue.substr(0,3)+" "+curentDateValue;
    			}
				
		}
		else{
			
			var arrayDates = [];
			var Y = document.getElementsByClassName("pui_date");
			var curentDateValue = Y[0].innerHTML;
			var value = curentDateValue.substr(curentDateValue.indexOf(' ')+1);
			if(value != "1"){
				Y[0].innerHTML = curentDateValue.substr(curentDateValue.indexOf(' ')+1);
			}
			
			for (var i = 1; i <= 7; i++) {
				//var currentDate = new Date(months[elm[0].getAttribute("data-month")-1] + " " +  elm[0].getAttribute("data-date") + " " +  elm[0].getAttribute("data-year"));
				var currentDate = new Date(prevStartDate.getFullYear(), prevStartDate.getMonth(), prevStartDate.getDate() - i);
//				currentDate.setFullYear(prevStartDate.getFullYear());				
//				currentDate.setMonth(prevStartDate.getMonth());				
//				currentDate.setDate(prevStartDate.getDate() - i);
				getCalendarDiv.removeChild(elm[41]);	
				var d = document.createElement("div");
				d.setAttribute("data-year",currentDate.getFullYear());
				d.setAttribute("data-Month",currentDate.getMonth()+1);
				d.setAttribute("data-Date",currentDate.getDate());
				d.id = (currentDate.getDate()).toString() + (currentDate.getMonth()+1).toString() + (currentDate.getFullYear()).toString();				
				if(today_date.getDate() + ":" + today_date.getMonth() + ":" + today_date.getFullYear()===currentDate.getDate() + ":" + currentDate.getMonth() + ":" + currentDate.getFullYear()){
					d.className = "today_date";
				}							
				//d.innerHTML = currentDate.getDate() + " <br> " + months[currentDate.getMonth()];
				if(currentDate.getDate()== 1) {
					var monthIndex = currentDate.getMonth();
					var monthValue = months[monthIndex];
					d.innerHTML = "<span class=\"pui_date\">" + monthValue.substr(0,3) +" "+currentDate.getDate() + "</span>";
			    	getCalendarDiv.insertBefore(d,getCalendarDiv.firstChild);
				} else {
					d.innerHTML = "<span class=\"pui_date\">" + currentDate.getDate() + "</span>";				
					getCalendarDiv.insertBefore(d,getCalendarDiv.firstChild);
				}

				if(i==7){
				startDate.setFullYear(elm[41].getAttribute("data-year"));
				startDate.setMonth(elm[41].getAttribute("data-month")-1, elm[41].getAttribute("data-date"));
				prevStartDate.setFullYear(elm[0].getAttribute("data-year"));
				prevStartDate.setMonth(elm[0].getAttribute("data-month")-1, elm[0].getAttribute("data-date"));
				}				
			}
			    var monthIndex = elm[0].getAttribute("data-month")-1;
				var monthValue = months[monthIndex];
				var x = document.getElementsByClassName("pui_date");
				var curentDateValue = x[0].innerHTML;
				if(curentDateValue.length<3){
					x[0].innerHTML =  monthValue.substr(0,3)+" "+curentDateValue;
				}
    			
		}
	StartDateText = months[elm[0].getAttribute("data-month")-1] + " " + elm[0].getAttribute("data-date") + ", " + elm[0].getAttribute("data-year");
	EndDateText = months[elm[41].getAttribute("data-month")-1] + " " + elm[41].getAttribute("data-date") + ", " + elm[41].getAttribute("data-year");
		getCalendarDetail.innerHTML = StartDateText + " - " + EndDateText;
		checkCalendarSelectedDates();
		calenderWidthHeight();
		return false;
	}
	
	if (document.addEventListener) {
  	  getCalendarDiv.addEventListener("mousewheel", calendarScroll,false);
	  getCalendarDiv.addEventListener("DOMMouseScroll", calendarScroll, false);
  	  getToday.addEventListener("click", function(){showCalendar("today");},false);
  	  getPrev.addEventListener("click", function(){showCalendar("prev");},false);
  	  getNext.addEventListener("click", function(){showCalendar("next");},false);	  	  
	} else if (document.attachEvent) {
	  getCalendarDiv.attachEvent("onmousewheel", calendarScroll);
  	  getToday.attachEvent("onclick", function(){showCalendar("today");});
  	  getPrev.attachEvent("click", function(){showCalendar("prev");});
  	  getNext.attachEvent("click", function(){showCalendar("next");});	    
	}
showCalendar("today");	
}

document.onreadystatechange = function(){
	if(document.readyState=="complete"){
		puicalendar();
	}
}