var tempMessageObj = {};
var myDropzoneNewCourseChat = null;
var socketStartInterval;
var reconnectingTime = 5000;
var socket;
var autoProductionClickCheck = false;
var newProductionInstance = false;
var globalDocumentSaveStatus    = 0;
var enableDisablestatus         = 0;
var nanoScrollDown = true;
function createSocketConnection(){	
	return false;
	if(socketStartInterval){
		clearInterval(socketStartInterval);		
	}
    var getServerHost = window.location.hostname;
    if(getServerHost == "localhost"){
        getServerHost = getServerHost+":9003/pu/";
    }
    else{
    	getServerHost = getServerHost +":9003/";
    }        
	socket = new WebSocket("ws://"+getServerHost+"course-dialogue-server.php");	
    console.log("ws://"+getServerHost+"course-dialogue-server.php");
	socket.onopen = function(){
	   var msg = {username: setUsername, userid:setUserID};
	   socket.send(JSON.stringify(msg));	
	   console.log("Connection Established.");
	}

	socket.onclose = function(event) {
        console.log("Reconnecting....");
        showNotification("Connection with socket lost. Reconnecting...");
        if(socketStartInterval){
	   		clearInterval(socketStartInterval);		
		}
        socketStartInterval  = setInterval(createSocketConnection,reconnectingTime);		
	}

/*
	socket.onmessage = function(event){
	   console.log(event.data);
	}
*/
	socket.onerror = function(event){        
        console.log("Cannot connect with socket.");
	}
}

// Old code to refesh listing to be removed later
function refreshCourseList(){
$("#tempControler").attr('value', 'menudashboard');
$("#tempAction").attr('value', 'index');
$.post(domainUrl + 'menudashboard/index', {'mode': '0', 'setUserID': setUserID}, responseCallAction, 'html');
}
// Old code ends
window.puJsFileLoadCounter++;


/*$(document).ready(function(){
	$("body").on("click",".productionRHSButtons",function(){
		var getAction = $(this).attr("data-action");
		$("#"+getAction).trigger("click");
	});
})*/

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function onElementHeightChange(elm, callback){
if(elm){
var lastHeight = elm.clientHeight, newHeight;
(function run(){
    newHeight = elm.clientHeight;
    if( lastHeight != newHeight )
        callback();
    lastHeight = newHeight;

    if( elm.onElementHeightChangeTimer )
        clearTimeout(elm.onElementHeightChangeTimer);

    elm.onElementHeightChangeTimer = setTimeout(run, 200);
})();
}
}