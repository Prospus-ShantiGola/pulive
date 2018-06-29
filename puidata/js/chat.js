
objChatfn = true;

$(document).ready(function(){

if(location.hostname !== "localhost"){
    //openChatWebsocket();
	checkContextMenu(); // check context menu
}	
    

 $(document).on("input", "textarea.message", function() {
        //autosize(this);
    });


/*$("body").on("paste",".message", function(event){
	var getThis = $(this);
	 setTimeout(function() {
		getThis.height("");
		getThis.height(getThis.prop("scrollHeight")-20);
		var msgBoxHeight = getThis.outerHeight(true);
			$('.mini-type-textarea .ref-textarea-HT').getNiceScroll(0).doScrollTop(msgBoxHeight, 1);	
	 }, 500);
});*/

$("body").on("keydown",".message", function(event){
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	if($keycode===13 && !event.shiftKey){
		var currentElm = event.currentTarget.id;
	    checkContextMenu(); // check context menu
		
		if(!$('.connection_notif').hasClass('error-message-alert'))
		{
			$(".send-btn").trigger("click", currentElm);
		}
		
		
		event.preventDefault();
	}
	/*$(this).height("");
	$(this).height($(this).prop("scrollHeight")-20);
	$('.mini-type-textarea .ref-textarea-HT').getNiceScroll(0).doScrollTop($('#add-text').height(), -1); */
});

// auto-sized functionality in textarea of mini dialogue
function autosize(textarea) {
    $(textarea).height(1); // temporarily shrink textarea so that scrollHeight returns content height when content does not fill textarea
    $(textarea).height($(textarea).prop("scrollHeight"));
}


// $("body").bind("drop",".message", function(event){
// 	event.preventDefault();

// });

$(document).bind({
   dragenter: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var dt = e.originalEvent.dataTransfer;
     dt.effectAllowed = dt.dropEffect = 'none';
   },
   dragover: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var dt = e.originalEvent.dataTransfer;
      dt.effectAllowed = dt.dropEffect = 'none';
   }
});

$("body").on("keypress",".message", function(event){
//alert('hi')
	$('#error_msg_file').remove();
	if(chattimer==0){
		var messageTo = $('.chat_wrapper.active .chatters').attr("data-chatter");
		var msg = {
		typing: "true",
		sender: setUserID,		
		messageto: messageTo,
		username : setUsername,
		};
		websocket.send(JSON.stringify(msg));
		chattimer=1;
	}
		
		setTimeout(function(){
		var msg = {
		typing: "false",
		sender: setUserID,		
		messageto: messageTo,
		username:setUsername,
		};
		websocket.send(JSON.stringify(msg));
		chattimer=0;
		},10000);
});



$("body").on("click",".send-btn", function(event, currentElm) { 

		if(paste_printScreen_case){ //this is case of paste and print screen
			sendAttachedFile(currentElm)
			paste_printScreen_case = false;
		}
		else {
	    checkContextMenu(); // check context menu
		//use clicks message send button	// .chat_wrapper.active 
		var mymessage = $('.message').val(); //get message text
		//var myname = $('#name').val(); //get user name
		var messageTo = $('.chat_wrapper.active .chatters').attr("data-chatter");
		var groupMessage = $('.chat_wrapper.active').attr("data-group");
		if(groupMessage==undefined){
			groupMessage=0;
		}
		if($.trim(mymessage) == ""){ //emtpy message?
			alert("Enter Some message Please!");

			var mymessage = $('.message').val(""); //get message text

			return;
		}
	//	alert($.trim(mymessage).length)
		if($.trim(mymessage).length>2000)
		{
				alert("Character limit upto 2000");
				return;
		}
		var user_node = $("#"+messageTo).find(".user-node-id").data('id');
		var course_instance_node_id  = $('.panel-heading.panel_active').data('id');
		
		if($('#add-text').hasClass('edited-statement'))
		{
			var action = 'editMessage';
			var node_instance_propertyid = $('.message').data('id');
			
		}
		else{
		var action = 'null';
			var node_instance_propertyid = '';
		}
		var minNumber = 100;
		var maxNumber = 40

			
		var random_id = randomNumberFromRange(minNumber, maxNumber);
		//alert(getTime());
		//prepare json data
		var msg = {
		message: mymessage.trim(),
		sender: setUserID,
		messageto: messageTo,
		username:setUsername,
		timestamp :getTime(),
		isGroupMessage:groupMessage,
		type:'Statement',
		user_node:user_node,
		course_instance_node_id:course_instance_node_id,
		action:action,
		node_instance_propertyid:node_instance_propertyid,
		random_id:random_id
		};
			console.log(msg);			
		
		if(messageTo != undefined)
		{
			
			if(node_instance_propertyid)
			{
				var text_data = $('.desc_drop.'+node_instance_propertyid+'').text();
				if(text_data.trim() != $('#add-text').val() )
				{
					saveNodeData(msg);
					//convert and send data to server		
					websocket.send(JSON.stringify(msg));
		
				}
				$('.message').val('');
				$('#add-text').removeClass('edited-statement');
				$('#add-text').data('id','');
			}
			else
			{
				saveNodeData(msg);
				//convert and send data to server	
		
				websocket.send(JSON.stringify(msg));
				$('.message').val('');
			}
		}
		else{
			$('.message').val('');
		}
	
		
		
		
		if($('.mini-dialogue-flyout .mini-type-textarea .append-top').length){
			$('.mini-dialogue-flyout .expand-collapse-box:visible').trigger('click');
			$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
       	    $(".mini-dialogue-flyout .ref-set-height").height($(".mini-dialogue-flyout").height() - ($(".right-bar-tab").height() + $(".mini-type-textarea").height()));
       	    
		} else {
		$('.message').height("");
		$('.message').height($('.message').prop("scrollHeight")-20);	
		}		
		
		
	}	//end of else

	$(".mini-dialogue-flyout .ref-set-height.nano").nanoScroller({
	        scroll: 'bottom'
	});
	
}); //end of trigger send-btn

	
}); // document ready close 

$("body").on("click",".online_users", function(event){

	var getID = $(this).attr("id");	

	if(getID)
	{
		$('.online_users').removeClass('selected');
		$(this).addClass('selected');
		updateMessage(this);
		$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
		if($(".expand-collapse-box").hasClass("append-top")){
		
				var innerHt = $(".mini-dialogue-flyout").height();
				var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab").outerHeight();
				var totalHght1 = innerHt - rightTabHghtM;
				$(".mini-type-textarea").css({"height": totalHght1 , "border-top":"none"});
				
							
		}
	}

});


function updateMessage(currentElm) {
	$(".ref-min-center-dialogue .rename-title-mini .dialog-tilte-node-id").removeClass('hide');
	$(".ref-min-center-dialogue .rename-title-mini .title-icon").removeClass('hide');
	$(".ref-min-center-dialogue .rename-title-mini .rename-edit-cover-box").removeClass('hide');
	$('.default-view-tab').find('.angle-collapse-up').removeClass('hide');
	
	$(".collapsed_dialogue.new_view_wrapper").hide();
	$(".ref_add_right_tab .ref_top_head_box").hide();

	$('.rename-title-mini').removeClass('hide');
	$('.edit-rename-title-mini').addClass('hide');
	
	$(".mini_arrow_up.angle-collapse-up").removeClass("abc");
	$('.new_untitled_wrap .course-new-drop').find('.course_req').addClass('hide');
	
	$(".ref_add_right_tab .course-new-drop .course_info").removeClass('required_border');

	$('.message').val('');
	$(currentElm).removeClass('notification-color');		
	var getID = $(currentElm).attr("id");	
	//$('.open-mini-dialogue').data('id',getID);			
	
	var active_chat_wrapper = $("#chatWindows .chat_wrapper.active").data('id');
		
	if(getID!=active_chat_wrapper){
			//alert(getID+'if')		
	//getStatement(getID);
	
	}			
	else{
		
	$("[data-id="+getID+"]").addClass("active");
	$("[data-id="+getID+"]").css("display","block");
	$(".chat_wrapper:not(.active)").css("display","none");
	} 
		
	$("#chatWindows").css("display","block");	
	
	getStatement(getID);		

	changeDialogueTitle($(currentElm));
	
	$(".chat_wrapper.active .chatters").text();
	$(".chat_wrapper.active .chatters").attr("data-chatter",getID);
	$(currentElm).parent().css("font-weight","normal");
	$(".ref_top_head_box").css("display","none");
	//$(".ref_hide_tab_content").show();
	$(".ref_top_chat_box .nano .nano-pane").css("display","block");
	//myDropzone.options.url = domainUrlApi+"upload.php?messageTo="+messageTo;
	//$("#attachment").insertAfter(".chat_wrapper.active .fileView");
	
	var d = $(".chat_wrapper.active .message_box");
	//d.scrollTop(d.prop("scrollHeight"));			
	//event.preventDefault();
}

var notificationTimeout;
function openChatWebsocket(){
	//create a new WebSocket object.		
	//var wsUri = "ws://localhost:9000/PUI/puidata/server.php";
	var wsUri = socketUrl
		
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(ev) { // connection is open
		$(".loginWindow").css("display","none");
		$(".mainContainer .user_box").css("display","block");		
		var msg = {username: setUsername, userid:setUserID};
		websocket.send(JSON.stringify(msg));
	}	
	
		//#### Message received from server?
		websocket.onmessage = function(ev) {
		//console.log('############');
		var msg = JSON.parse(ev.data); //PHP sends Json data
	//	console.log(msg);
		var type = msg.type; //message type
		var umsg = msg.message; //message text
	
		var uname = msg.name; //user name
		var onlineuser = msg.username; //online user name		
		var onlineuserid = msg.userid; //online user name	
	
		var getUsername	= msg.sender_full_name;
		var getAttachment	= msg.attachment;
		var getMessageTime	= msg.time;
		var getToMessage	= msg.messageTo;
		var	timestamp = 	msg.timestamp_seconds;	
		var datetime = msg.date_time;
		var action  = msg.action;
		var attachmentName = msg.attachmentName;
		var fileTempName = msg.fileTempName;
		var fileSizeByte = msg.fileSizeByte;
		var user_node  = msg.user_node;
		var course_id = msg.course_id;
		var node_instance_propertyid = msg.node_instance_propertyid;
		var random_id = msg.random_id;
		
		
		
		//alert(type);
		if(type=='group'){
			//console.log(msg);		
			if(getAttachment!='Statement')
			{
				var temp_format = umsg.split('.');		
				
				//uploaded image format 
				if(temp_format[1]=='docx' || temp_format[1]=='doc')
				{
					var format_icon = 'doc.png';
				}
				else if(temp_format[1]=='zip')
				{
					var format_icon = 'zip.png';
				}
				else if(temp_format[1]=='pdf')
				{
					var format_icon = 'pdf.png';
				}
				else if(temp_format[1]=='xlsx')
				{
					var format_icon = 'xls.png';
				}
				else if(temp_format[1]=='csv')
				{
					var format_icon = 'csv.png';
				}
				else if(temp_format[1]=='exe')
				{
					var format_icon = 'exe.png';
				}
				else if(temp_format[1]=='psd')
				{
					var format_icon = 'psd.png';
				}
				else if(temp_format[1]=='txt')
				{
					var format_icon = 'notepad.png';
				}
				else{
					var format_icon = 'default.png';
				
				}
			}
		}

		if(getAttachment=="image" && action!='updatePropertyId'){
			umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='anchor-box "+fileTempName+"'><img src='"+domainUrlApi+"attachments/"+getToMessage+"/thumbs/"+umsg+"' class='atch-img-border'/><span class='img-overlay-wrap'></span></a>";
		}
		if(getAttachment=="attachment" && action!='updatePropertyId'){

			//umsg = "<a href='"+domainUrl+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='downloadFile truncate-attachments atch-img-border  "+fileTempName+"'><img src='"+domainUrl+"img/icons/"+format_icon+"' />"+attachmentName+"<span class='fileSized'>"+fileSizeByte+"</span></a>";

			umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='downloadFile truncate-attachments atch-img-border  "+fileTempName+"'><img src='"+domainUrlApi+"img/icons/"+format_icon+"' />"+attachmentName+"<span class='fileSized'>"+fileSizeByte+"</span></a>";

		}
		
		if(type == 'group'){
	
		
		user_node = user_node +',';
		
			var user_exsits = user_node.split(',');
			//send message only to the group user 
			if ($.inArray(setUserID, user_exsits) != -1)
			{
			
				/*if(uname!=setUserID && getAttachment=='Statement'){
					notifyMe("New Message From " + 	getUsername);
				}*/
			
				if(uname==setUserID){
				var fromUser = 	setUsername;
				}
				else{
				var fromUser = 	getUsername;	
				}
			
				//if id are not same
				if($("[data-id="+getToMessage+"]").attr("data-id")==undefined){		
				
						//console.log('not')
					if(action =='addActor'|| action == 'removeActor' || action == 'updateDialogTitle'){	
						
						var event = 'true';
						getAllCourse(setUserID,event,getToMessage,uname,datetime,umsg,timestamp,fromUser,action);
						
						$('ul#dialog-container').find("[id="+getToMessage+"]").addClass('notification-color');	
			
						
					}
					else 
					{
						if(	action !='deleteMessage')
							{
								
								//$('ul#dialog-container').find("[id="+getToMessage+"]").prependTo('ul#dialog-container');
								//$('ul#dialog-container').find("[id="+getToMessage+"]").addClass('notification-color');
								$("[data-id="+course_id+"]").closest('.panel').prependTo('#accordion');
								$("[data-id="+course_id+"]").addClass('notification-color');
							
							}
						//statement case 						
						
						$('ul#dialog-container').find("[id="+getToMessage+"] .notif_count_box").removeClass('hide');
						var get_noti_count = parseInt($('ul#dialog-container').find("[id="+getToMessage+"] .notification-count").text());
						$('ul#dialog-container').find("[id="+getToMessage+"] .notification-count").text(get_noti_count+parseInt(1));
						
					}
					
					
				
				}
				else
				{
							
						if(action =='addActor'|| action == 'removeActor' || action == 'updateDialogTitle'){						
							var event = 'true';
							getAllCourse(setUserID,event,getToMessage,uname,datetime,umsg,timestamp,fromUser,action);
								
						}
						
						else
						{
							//statement case 	
							if(	action =='deleteMessage' || action =='editMessage' )
							{
									
									if(node_instance_propertyid && action =='editMessage')
									{
										$('#add-text').removeClass('edited-statement');
										$('#add-text').data('id','');
										$('.desc_drop.'+node_instance_propertyid+'').text(umsg);
										$('.desc_drop.'+node_instance_propertyid+'').addClass('edited-icon');
										/* setTimeout(function() {
										$('.online_users:first').trigger('click');
										}, 3000); */
									}
								 else if(action =='deleteMessage')
									{
									  
										var data_html= '<p class="rmv-disabled clearfix" data-instance_id ="'+umsg+'">This message has been removed.</p>';
										$('.'+umsg).replaceWith(data_html);	
									}
									
									
							}
							else if(action =='updatePropertyId')
							{
								console.log(getAttachment)
								
								if(getAttachment=='attachment'|| getAttachment=='image' )
								{
									
									//console.log(umsg)
									// console.log('aaaaaa')
									var temp = umsg.split('~');
									//alert(temp[0])
									$('.'+random_id).data('instance_id',temp[0]);
									$('.'+random_id).addClass(temp[0]);
								}
								else
								{
								   // console.log('sss')
									var temp = umsg.split('~');							
									var statment_no = temp.length;
									var obj_val  = $('.'+random_id).slice(-statment_no);
									var i=0;
									$(obj_val).each(function(e){
									//console.log('dfsd')
								
									$(this).data('instance_id',temp[i]);
									$(this).addClass(temp[i]);	
									i++;
									});
								}
								//$('.desc_drop').removeClass(random_id);
								
							}
							else{	
								//console.log('div')							
								divStructure(getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment,random_id);
							}
							//alert(setUserID+'fdfsdd')
							//maintaining notification in DB
						/* setTimeout(function() {
								deleteNotification(getToMessage,setUserID);
						 }, 100);
						 */
						
						}
					 // console.log('active')
				}
				
				//whenever a new message published then change the title of the browser tab //&& uname!=setUserID 
				if($('.mini-dialogue-flyout.opened').length=='1' && uname!=setUserID  )
				{	
				
					visibilitychange();
						
				}
		
				
				if($(".chat_wrapper.active .chatters").attr("data-chatter")==getToMessage)
				{
					$("#"+getToMessage).removeClass("newmessage");
				}
				else{		
					$("#"+getToMessage).addClass("newmessage");
				}
				if(uname!=setUserID && $(".chat_wrapper.active").attr("data-id")!=getToMessage){
			
				clearTimeout(notificationTimeout);	
				$(".chatNotifications").hide();
				$(".chatNotifications").html("<div class='msg'><div class=\"user_name\">"+fromUser+"</div> <div class=\"user_message\">"+umsg+"</div></div>");
				$(".chatNotifications").fadeIn("fast");
				notificationTimeout = setTimeout(function(){
					$(".chatNotifications").fadeOut("fast");
					},3000);
				}		
			//	var state_val = 0;	
			
			}		
		}


		if(type == 'addActor')
		{			
			

		}
		if(type == 'system')
		{
		$('.chat_wrapper.active .message_box .connection_notif').remove();
		$('.mini-type-textarea .animate-div').removeClass('manage-opacity');
		$('.mini-type-textarea .animate-div').find('#add-text').focus();
			$('#user_box').empty();
			var emtpyID = [];
			for (var key in onlineuser) {
			  if (onlineuser.hasOwnProperty(key)) {
				if(key!=0){
					if(onlineuserid[key]!=setUserID && emtpyID.indexOf(onlineuserid[key])==-1){
						emtpyID.push(onlineuserid[key]);
						$('#user_box').append("<div class=\"online_users\" id='"+onlineuserid[key]+"'><a href='javascript:void(0)'>"+onlineuser[key]+"</a></div>");
						if($("#"+onlineuserid[key]).attr("id")!=undefined){
							$("[data-chatter="+onlineuserid[key]+"] .chatters").removeClass("offline");
							$("[data-chatter="+onlineuserid[key]+"] .panel").css("display","block");
						}			
					}
				}
			  }
			}
		}
		if(type == 'offline')
		{
			$('#user_box').empty();
			var emtpyID = [];
			for (var key in onlineuser) {
			  if (onlineuser.hasOwnProperty(key)) {
			  if(key!=0){
				if(onlineuserid[key]!=setUserID  && emtpyID.indexOf(onlineuserid[key])==-1){				  
				emtpyID.push(onlineuserid[key]);
				$('#user_box').append("<div class=\"online_users\" id='"+onlineuserid[key]+"'><a href='javascript:void(0)'>"+onlineuser[key]+"</a></div>");
				}
			  }
			  }
			}
			
			var getCurrentChatter = $(".chat_wrapper.active .chatters").attr("data-chatter");
			if($("#"+getCurrentChatter).attr("id")==undefined){
				$(".chat_wrapper.active .chatters").addClass("offline");
				$(".chat_wrapper.active .panel").css("display","none");
			}
			
		}
		
		if(type == 'typing'){
		
			/* var getCurrentChatter =  ;//$(".chat_wrapper.active .chatters").attr("data-chatter");
			//alert(getCurrentChatter);
			var getCurrentChatterName = $("#"+getCurrentChatter).text();
			if(getCurrentChatter==uname){
			
				if(umsg=="true"){
				var messageShow = getCurrentChatterName+" is typing...";
				$(".chat_wrapper.active .panel .istyping").text(messageShow);
				}
				else{
				$(".chat_wrapper.active .panel .istyping").text("");
				}
			} */
			
			
			/*var getCurrentChatter = setUserID ;//$(".chat_wrapper.active .chatters").attr("data-chatter");
			var getCurrentChatterName = getUsername; //$("#"+getCurrentChatter).text();
			//&& $(".chat_wrapper.active").attr("data-id")!=getToMessage
			if(uname!=getCurrentChatter && $(".chat_wrapper.active").attr("data-id")==getToMessage ){
			
				if(umsg=="true"){
					var data_ary = $(".chat_wrapper.active .panel .istyping").data('array');
					//alert(data_ary)
					if(data_ary == '')
					{
						$(".chat_wrapper.active .panel .istyping").data('array',getUsername);
						var messageShow = getUsername+" is typing...";
					
					}
					else{
					
						
						var new_ary  = data_ary +', '+ getUsername;
						var temp = new_ary.split(', ');
						console.log(temp.length+"**"+setUsername);
						if(temp ==2)
						{
							var messageShow = data_ary+" and "+new_ary +" are typing...";
						}
						else if(temp>2)
						{
							var messageShow = data_ary+" and "+getUsername +" are typing...";
						}
						else{
						
						var messageShow = temp+" is type...";
						}
						
						$(".chat_wrapper.active .panel .istyping").data('array',new_ary);
						//var messageShow = new_ary+" are type...";
					}
				
				    $(".chat_wrapper.active .panel .istyping").text(messageShow);
				}			
				
				else{
				$(".chat_wrapper.active .panel .istyping").text("");
				$(".chat_wrapper.active .panel .istyping").data('array','');
				}
			}*/
		}

	};
	
	websocket.onerror	= function(ev){


	
		var error = '<div class="connection_notif error-message-alert"><span class="connect_wrap try_notif"><i class="icon connection_error"></i><span class="notif_title">Trying to Reconnect...</span></span></div>';
	
		if($('.chat_wrapper.active .message_box .connection_notif').length==0)
		{
			//alert("Error Occurred - "+ev.data);
			$('.chat_wrapper.active .message_box .connection_notif').remove();
			$('.chat_wrapper.active .message_box').append(error);
			
			// $(".ref-min-center-dialogue .nano").nanoScroller({
   //                  scroll: 'bottom'
   //          });
			
				$('.mini-type-textarea .animate-div').addClass('manage-opacity');
				$('.mini-type-textarea .animate-div.manage-opacity').find('#add-text').blur();
		}
	
	//openChatWebsocket();
		
	}; 
	websocket.onclose 	= function(ev){

		var error = '<div class="connection_notif error-message-alert"><span class="connect_wrap try_notif"><i class="icon connection_error"></i><span class="notif_title">Trying to Reconnect...</span></span></div>';
	
		if($('.chat_wrapper.active .message_box .connection_notif').length==0)
		{
			$('.chat_wrapper.active .message_box .connection_notif').remove();
			$('.chat_wrapper.active .message_box').append(error);
			
			$('.mini-type-textarea .animate-div').addClass('manage-opacity');
			$('.mini-type-textarea .animate-div.manage-opacity').find('#add-text').blur();
			
			// $(".ref-min-center-dialogue .nano").nanoScroller({
   //                 scroll: 'bottom'
   //          });
		}
		openChatWebsocket();
	}; 

}


function getTime()
{
//'2016-09-01 3:11:10'
var currentdate = new Date(); 
//return currentdate; 
 var datetime =  currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
				return datetime; 
}
function getDayVal()
{
	var d = new Date();
	var n = d.getDay();
	var weekday = new Array(n);
	weekday[0]=  "Sun";
	weekday[1] = "Mon";
	weekday[2] = "Tue";
	weekday[3] = "Wed";
	weekday[4] = "Thu";
	weekday[5] = "Fri";
	weekday[6] = "Sat";

	return day = weekday[d.getDay()];
}
function divStructure(getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment,random_id)
{


	objChatfn = false;
	//alert('ener==')
	var timezone = ConvertToLocalTime(timestamp);
//	console.log(timezone);
	var day = getDayVal();
	var temp = datetime.split('');
	var last_li_obj = $("[data-id="+getToMessage+"] .message_box .statement-detail:last");
	//new user added to the group
	if(getAttachment=="image")
	{
		var cls = 'atch-overlay-img common-class '+random_id ;
	}
	else if(getAttachment=="attachment")
	{
	 var cls = 'atch-overlay common-class '+random_id ;
	}
	else
	{
		 var cls = 'desc_drop '+random_id ;
	}
	if(action =='addActor')
	{
	
		var temp_name = umsg.split(', ');

		if(temp_name.length==2)
		{
			umsg = '<b>'+ucwords(fromUser)+'</b> added <b>'+ucwords(temp_name[1])+'</b>';
		}
		else if(temp_name.length>2)
		{
			umsg = umsg.replace(/, +$/,'');
			umsg = '<b>'+ucwords(fromUser)+'</b> added <b>'+ucwords(umsg)+'</b>';
		}
		
		
		var li_content = '<li class = "statement-detail bold-msg-title-head" data-id="'+uname+'" data-time="'+datetime+'"><span class="dialogue-title msg-normal-weight">'+umsg+'</span></li>';
	}
	else if(action =='removeActor')
	{
		
		//alert('removeActor')
		if(umsg=='self')
		{
			var umsg = '<b>'+ucwords(fromUser)+"</b> has left";	
		}
		else{
		var umsg =  '<b>'+ucwords(fromUser)+'</b> removed <b>'+ucwords(umsg)+'</b> from this conversation.';
		}
		var li_content = '<li class = "statement-detail bold-msg-title-head" data-id="'+uname+'" data-time="'+datetime+'"><span class="dialogue-title msg-normal-weight">'+umsg+'</span></li>';
	}
  else if(action =='updateDialogTitle')
	{
		var dialog_title = umsg;
		var umsg = '<b>'+ucwords(fromUser)+'</b> renamed the dialogue as <b>"'+dialog_title+'"</b>';
		//var update_html = '';
		var li_content = '<li class = "statement-detail bold-msg-title-head" data-id="'+uname+'" data-time="'+datetime+'"><span class="dialogue-title msg-normal-weight">'+umsg+'</span></li>';
	}  
	
	/* else if(action =='deleteMessage')
	{
		var node_id_deleted = umsg;
		//var umsg = '<p class="clearfix rmv-disabled '+node_id_deleted +' " data-instance_id="'+node_id_deleted+'">This message has been removed.</p>';
		//var update_html = '';
		//var li_content = '<li class = "statement-detail bold-msg-title-head" data-id="'+uname+'" data-time="'+datetime+'"><span class="dialogue-title msg-normal-weight">'+umsg+'</span></li>';
	}   */
	// normal chat functionality
	else
	{
	
		umsg = umsg.trim();
		umsg = umsg.replace(/\n+/g, '\n');
		
		var str_temp = umsg.split("\n");
	
		var i = 0;
		var li_content = '<li class = "statement-detail" data-id="'+uname+'" data-time="'+datetime+'"><div class="dialogue-heading-wrap"><div class="dialogue-detail"><div class="dialogue-left-pane"><input type="checkbox"></div><div class="dialogue-right-pane"> <span class="dialogue-title">'+fromUser+'</span><span class="dialogue-date right"><ul><li>'+timezone+'</li></ul></span>';
		
		for(i=0;i< str_temp.length;i++)
		{		
			li_content += '<p class="'+cls+'">'+str_temp[i]+'</p>';
			
		} 
		li_content += '</div></div></div></li>';
		
	}
	if($(".chat_wrapper.active .message_box").find('.weekly:last').hasClass('present-day'))
	{
		
			if(last_li_obj.data("id") == uname && last_li_obj.data("time") == datetime )
			{
			
				if(action=='null')
				{
				
				
					 
					if($("[data-id="+getToMessage+"] .message_box .statement-detail:last").hasClass('bold-msg-title-head'))
					{
						var li_content = '<li class = "statement-detail" data-id="'+uname+'" data-time="'+datetime+'"><div class="dialogue-heading-wrap"><div class="dialogue-detail"><div class="dialogue-left-pane"><input type="checkbox"></div><div class="dialogue-right-pane"> <span class="dialogue-title">'+fromUser+'</span><span class="dialogue-date right"><ul><li>'+timezone+'</li></ul></span><p class="'+cls+'">'+umsg+'</p></div></div></div></li>';
						$("[data-id="+getToMessage+"] .message_box").append(li_content);	
					}
					else
					{
						for(i=0;i< str_temp.length;i++)
						{
							var  html_data = '<p class="'+cls+'">'+str_temp[i]+'</p>';
							$("[data-id="+getToMessage+"] .message_box .statement-detail:last").find('.dialogue-right-pane').append(html_data);	
						}  
					}
					

				
					
					
				}
				else{
		//alert('****')
					var  html_data = li_content;
					$("[data-id="+getToMessage+"] .message_box").append(html_data);	
				}
				
				
			}
			else
			{
				//alert('dsa')
				var  html_data = li_content;			
				$("[data-id="+getToMessage+"] .message_box").append(html_data);	
			}		
			
		}
		else
		{
					
			var html_data = '<div class="weekly present-day" id="'+temp[0]+'"> <span>Today</span></div>';
			html_data += li_content;
			
			if(action =='addActor')
			{
					if(temp_name.length!=1)
					{
						$("[data-id="+getToMessage+"] .message_box").append(html_data);		
					}
					
			}
			else
			{
					$("[data-id="+getToMessage+"] .message_box").append(html_data);	
			}
		
		}
	
	
	
	//$('ul#dialog-container').find("[id="+getToMessage+"]").prependTo('ul#dialog-container');
	$('.online_users.selected').closest('.panel').prependTo('#accordion');
	$('.chat_wrapper.active').find('.fileView').html('');
	var chat_wrapper_height = $('.chat_wrapper.active').height()				
	$(".ref-min-center-dialogue .nano").nanoScroller({ scrollBottom: -chat_wrapper_height }); 
	$('.tab-role-content .nano').nanoScroller({
	scroll: 'top'
	});
	$("#add-text").focus();
	
	/* if(action =='addActor')
	{
		$('.mini-overlay-wrapper').addClass('hide');
	}
	else if(action =='removeActor')
	{
		$('.mini-overlay-wrapper').addClass('hide');
	}
*/	
if(action =='updateDialogTitle')
	{
		$('.mini-overlay-wrapper').addClass('hide');
	} 
	
	if(action !='null')
	{
		$('.mini-overlay-wrapper').addClass('hide');
	}

	//autoScrollDown();
}
//give current time in time zone 3:17
function ConvertToLocalTime(utcTime, divID) {
    var d = new Date();
    var usertime = d.toLocaleString();
    var tzsregex = /\b(ACDT|ACST|ACT|ADT|AEDT|AEST|AFT|AKDT|AKST|AMST|AMT|ART|AST|AWDT|AWST|AZOST|AZT|BDT|BIOT|BIT|BOT|BRT|BST|BTT|CAT|CCT|CDT|CEDT|CEST|CET|CHADT|CHAST|CIST|CKT|CLST|CLT|COST|COT|CST|CT|CVT|CXT|CHST|DFT|EAST|EAT|ECT|EDT|EEDT|EEST|EET|EST|FJT|FKST|FKT|GALT|GET|GFT|GILT|GIT|GMT|GST|GYT|HADT|HAEC|HAST|HKT|HMT|HST|ICT|IDT|IRKT|IRST|IST|JST|KRAT|KST|LHST|LINT|MART|MAGT|MDT|MET|MEST|MIT|MSD|MSK|MST|MUT|MYT|NDT|NFT|NPT|NST|NT|NZDT|NZST|OMST|PDT|PETT|PHOT|PKT|PST|RET|SAMT|SAST|SBT|SCT|SGT|SLT|SST|TAHT|THA|UYST|UYT|VET|VLAT|WAT|WEDT|WEST|WET|WST|YAKT|YEKT)\b/gi;
    var timezonenames = {"UTC+0": "GMT", "UTC+1": "CET", "UTC+2": "EET", "UTC+3": "EEDT", "UTC+3.5": "IRST", "UTC+4": "MSD", "UTC+4.5": "AFT", "UTC+5": "PKT", "UTC+5.5": "IST", "UTC+6": "BST", "UTC+6.5": "MST", "UTC+7": "THA", "UTC+8": "AWST", "UTC+9": "AWDT", "UTC+9.5": "ACST", "UTC+10": "AEST", "UTC+10.5": "ACDT", "UTC+11": "AEDT", "UTC+11.5": "NFT", "UTC+12": "NZST", "UTC-1": "AZOST", "UTC-2": "GST", "UTC-3": "BRT", "UTC-3.5": "NST", "UTC-4": "CLT", "UTC-4.5": "VET", "UTC-5": "EST", "UTC-6": "CST", "UTC-7": "MST", "UTC-8": "PST", "UTC-9": "AKST", "UTC-9.5": "MIT", "UTC-10": "HST", "UTC-11": "SST", "UTC-12": "BIT"};
    var timezone = usertime.match(tzsregex);
    if (timezone) {
        timezone = timezone[timezone.length - 1];
    } else {
        var offset = -1 * d.getTimezoneOffset() / 60;
        offset = "UTC" + (offset >= 0 ? "+" + offset : offset);
        timezone = timezonenames[offset];
    }
    var x = new Date(1000 * utcTime);
    var localYear = x.getFullYear();
    var localMonth = x.getMonth();
    var localDate = x.getDate();
    var localHours = x.getHours();
    var localMinutes = x.getMinutes();
    var ampm = localHours >= 12 ? 'PM' : 'AM';
    localHours = localHours % 12;
    localHours = localHours ? localHours : 12;
    localMinutes = localMinutes < 10 ? '0' + localMinutes : localMinutes;
    var strTime = localHours + ':' + localMinutes + ' ' + ampm;
    var MonthArray = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    localMonth = MonthArray[localMonth];
  
  //var CreateDate = localMonth + " " + localDate + ", " + localYear + " " + strTime + " " + timezone;
    var CreateDate =  strTime;

    /* if (divID != undefined) {
        document.getElementById(divID).innerHTML = CreateDate;
    }
    else
        document.getElementById("timestamp-" + utcTime).innerHTML = CreateDate; */
		return CreateDate;
}

 visibilitychange = function () {				
	var BrowserState;
	if(typeof document.hidden !== "undefined") {
			  BrowserState = "visibilityState";
		 }
	else if (typeof document.webkitHidden !== "undefined") {
			  BrowserState = "webkitVisibilityState";
		 }
	else if (typeof document.mozHidden !== "undefined") {
			  BrowserState = "mozVisibilityState";
		 }
	else if (typeof document.msHidden !== "undefined") {
			 BrowserState = "msVisibilityState";
		 }

	if (document[BrowserState] == "hidden")
	{
		
		/* var count_number = document.title;
		if(count_number =='Investible | Home')
		{
			document.title = "New Message (1)";
		}
		else
		{
			var temp_count = count_number.split('(');
			var temp_c = temp_count[1].split(')');
		
			var number_count = parseInt(temp_c[0]) + 1;
				
			document.title = "New Message ("+number_count+")";
		} */
		
	}

	
} 

function sendAttachedFile(fileSendCourseChat) {
	if(fileSendCourseChat === 'divEditableCourse'){
		myDropzoneCourseChat.addFile(fileObj);
		replaceTextAreaToEditableDiv('.chat-textarea', '#chatTextMessage', 'divEditableCourse');
	} else{
		myDropzone.addFile(fileObj);	
		replaceTextAreaToEditableDiv('#chatMsgBox', '#add-text', 'divEditableChat');	
	}

}

function notifyMe(myMessage,getMessageTime) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
  var notification = new Notification(myMessage);
  }

  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
		 var notification = new Notification(myMessage);
      }
    });
  }
}

//give current time in time zone 3:17
function ConvertToLocalTimeZone(utcTime, divID) {
    var d = new Date();
    var usertime = d.toLocaleString();
    var tzsregex = /\b(ACDT|ACST|ACT|ADT|AEDT|AEST|AFT|AKDT|AKST|AMST|AMT|ART|AST|AWDT|AWST|AZOST|AZT|BDT|BIOT|BIT|BOT|BRT|BST|BTT|CAT|CCT|CDT|CEDT|CEST|CET|CHADT|CHAST|CIST|CKT|CLST|CLT|COST|COT|CST|CT|CVT|CXT|CHST|DFT|EAST|EAT|ECT|EDT|EEDT|EEST|EET|EST|FJT|FKST|FKT|GALT|GET|GFT|GILT|GIT|GMT|GST|GYT|HADT|HAEC|HAST|HKT|HMT|HST|ICT|IDT|IRKT|IRST|IST|JST|KRAT|KST|LHST|LINT|MART|MAGT|MDT|MET|MEST|MIT|MSD|MSK|MST|MUT|MYT|NDT|NFT|NPT|NST|NT|NZDT|NZST|OMST|PDT|PETT|PHOT|PKT|PST|RET|SAMT|SAST|SBT|SCT|SGT|SLT|SST|TAHT|THA|UYST|UYT|VET|VLAT|WAT|WEDT|WEST|WET|WST|YAKT|YEKT)\b/gi;
    var timezonenames = {"UTC+0": "GMT", "UTC+1": "CET", "UTC+2": "EET", "UTC+3": "EEDT", "UTC+3.5": "IRST", "UTC+4": "MSD", "UTC+4.5": "AFT", "UTC+5": "PKT", "UTC+5.5": "IST", "UTC+6": "BST", "UTC+6.5": "MST", "UTC+7": "THA", "UTC+8": "AWST", "UTC+9": "AWDT", "UTC+9.5": "ACST", "UTC+10": "AEST", "UTC+10.5": "ACDT", "UTC+11": "AEDT", "UTC+11.5": "NFT", "UTC+12": "NZST", "UTC-1": "AZOST", "UTC-2": "GST", "UTC-3": "BRT", "UTC-3.5": "NST", "UTC-4": "CLT", "UTC-4.5": "VET", "UTC-5": "EST", "UTC-6": "CST", "UTC-7": "MST", "UTC-8": "PST", "UTC-9": "AKST", "UTC-9.5": "MIT", "UTC-10": "HST", "UTC-11": "SST", "UTC-12": "BIT"};
    var timezone = usertime.match(tzsregex);
    if (timezone) {
        timezone = timezone[timezone.length - 1];
    } else {
        var offset = -1 * d.getTimezoneOffset() / 60;
        offset = "UTC" + (offset >= 0 ? "+" + offset : offset);
        timezone = timezonenames[offset];
    }
    var x = new Date(1000 * utcTime);
    var localYear = x.getFullYear();
    var localMonth = x.getMonth();
    var localDate = x.getDate();
    var localHours = x.getHours();
    var localMinutes = x.getMinutes();
    var ampm = localHours >= 12 ? 'PM' : 'AM';
    localHours = localHours % 12;
    localHours = localHours ? localHours : 12;
    localMinutes = localMinutes < 10 ? '0' + localMinutes : localMinutes;
    var strTime = localHours + ':' + localMinutes + ' ' + ampm;
    var MonthArray = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    localMonth = MonthArray[localMonth];
  
  //var CreateDate = localMonth + " " + localDate + ", " + localYear + " " + strTime + " " + timezone;
    var CreateDate =  strTime;

    if (divID != undefined) {
        document.getElementById(divID).innerHTML = CreateDate;
    }
    /*else
        document.getElementById("timestamp-" + utcTime).innerHTML = CreateDate; */
		//return CreateDate;
}




function randomNumberFromRange(min,max)
{
    return (Math.floor(Math.random()*(max-min+1)+min));
}