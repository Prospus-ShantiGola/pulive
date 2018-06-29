function showNotification(params) {
    var interval = (params.interval)?params.interval: 10000;
    var ele = $('#DataSaveMsg');
    ele.show().html(params.msg);
    setTimeout(function() {
      ele.fadeOut();
    },interval);
}

// awdhesh sir's file
function getTime() {
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
function getDayVal() {
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

objChatfnCourse = true;
$(document).ready(function() {
	// openChatWebsocketCourse();
	var notificationTimeout;
	function openChatWebsocketCourse() {
		//create a new WebSocket object.
		//var wsUri = socketChatUrl;

		//var wsUri = "ws://localhost:9001/course-dialogue-server.php";
		var wsUri = "ws://dev.pu.prospus.com:9002/temp_cds.php";

		websocketcourse = new WebSocket(wsUri);
		websocketcourse.onopen = function(ev) { // connection is open
			$(".loginWindowq").css("display","none");
			$(".mainContainerq .user_box").css("display","block");
			var msg = {username: setUsername, userid:setUserID};
			websocketcourse.send(JSON.stringify(msg));
		}
		//#### Message received from server?
		websocketcourse.onmessage = function(ev) {
            //
            // if($("#courseChatSendButton").length || $("#courseChatSaveDraftButton").length) { // in case of react-chat, do not execute below statements
            //     return true;
            // }

			var msg 				= JSON.parse(ev.data); //PHP sends Json data
			// console.log('mm',msg);
			var type 				= $.trim(msg.type); //message type
			var umsg 				= msg.message; //message text

			var uname 				= msg.name; //user name
			var onlineuser 			= msg.username; //online user name
			var onlineuserid 		= msg.userid; //online user name
			var getUsername			= msg.sender_full_name;
			var getAttachment		= msg.getAttachment;
			var getMessageTime		= msg.time;

			var user_node  			= msg.user_node;
			var getToMessage		= msg.dialogue_node_id; //online user name
			var	timestamp 			= msg.timestamp_seconds;
			var datetime 			= msg.date_time;
			var action  			= msg.action;
			var attachmentName 		= msg.attachmentName;
			var fileTempName 		= msg.fileTempName;
			var fileSizeByte 		= msg.fileSizeByte;
			var course_node_id = msg.course_node_id;
			var user_session_id    = msg.user_current_session_id;
			var isGroupMessage     = msg.isGroupMessage;
			var sender             = msg.sender;

			if(type == 'addCourse') {
				user_node = msg.user_actor_node_id+''+setUserID;
				var user_exsits = user_node.split(',');
				//send message only to the group user
				if ($.inArray(setUserID, user_exsits) != -1) {
          			showNotification({msg: "<span><b>"+getUsername+"</b> "+umsg+" </span>"});

					NProgress.start();
					setTimeout(function() {
						$.post(domainUrl+'menudashboard/index',{'mode':'0','setUserID':setUserID},responseCallAction,'html');
					},1500);
				}
			}
      		else if(type == 'addDialogue') {
				var user_exsits = msg.user_actor_node_id.split(',');
				//send message only to the group user
        		var flag = 0;
				if ($.inArray(setUserID, user_exsits) != -1) {
						$(".course-list .courseboard-table").find('tr').each(function() {
							if($(this).attr('data-id') == course_node_id) {
								flag = 1;
						    $(this).addClass('notification-color');
							}
						});
				}
				else if(setUserID == user_session_id) {
		          	flag = 1;
				}
		        if(flag) {
		          $.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':course_node_id,'user_instance_node_id':setUserID},responseDialogueListAllCallAction,'JSON');
		        }
			}

			/* code here to display dialgue updated for session and other actor for join this dialogue*/
			else if(type == 'updateDialogTitle') {
				var dialogue_title     = msg.dialogue_title;
				var user_exsits = msg.user_actor_node_id.split(',');
				//send message only to the group user
        		var flag = 0;
				if ($.inArray(setUserID, user_exsits) != -1) {
					if($(".courseboard-table tr.current").attr('data-id') == course_node_id) {
            	flag = 1;
					} else {
						if(setUserID != user_session_id) {
              		notificationCommon2({course_node_id: course_node_id, dialogue_title: dialogue_title, class_name: 'notification-color'});
						}
					}
				}
				if(setUserID == user_session_id) {
          		flag = 1;
					setTimeout(function() {
            	notificationCommon2({course_node_id: course_node_id, dialogue_title: dialogue_title, class_name: 'current'});
						setTimeout(function() {
							$(".expandedCourseBox .existingDialogueSelCourseList").removeClass('current').filter(':first').addClass('current');
							NProgress.done();
						},1200);
					},1000);
				}
		        if(flag) {
		          setTimeout(function() {
		            $.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':course_node_id,'user_instance_node_id':setUserID},responseDialogueListCallAction,'JSON');
		          },1000);
		        }
				if(user_session_id!=setUserID && $(".courseboard-table tr.current").attr('data-id') == course_node_id) {
					$(".existdialogue_title").html(dialogue_title);
					$(".common_notification_msg").hide().html("<div class='msg'> <div class=\"user_message\" style='padding-left:100px;'><b>"+getUsername+"</b> "+umsg+" <b>"+dialogue_title+"</b></div></div>").fadeIn("fast");
				}
			}
			/* code here to display course updated for session and other actor for join this Course*/
			else if(type == 'updateCourseTitle') {
				var course_title     = msg.course_title;
				user_node = msg.user_actor_node_id;
				var user_exsits = user_node.split(',');
				//send message only to the group user
				if ($.inArray(setUserID, user_exsits) != -1) {
					if($(".courseboard-table tr.current").attr('data-id') == course_node_id) {
						var course_instance_id = course_node_id;
						$(".course-list .courseboard-table").find('tr').each(function() {
								if($(this).attr('data-id') == course_node_id) {
								    if(setUserID != user_session_id) {
											$(this).addClass('notification-color');
											$(".existCourseTitle").html(course_title);
                      showNotification({msg: "<span><b>"+getUsername+"</b> "+umsg+" "+course_title+" </span>", interval: 3000});
									}
									$(this).find('td:nth-child(2)').html(course_title);
								}
							});
					} else {
						if(setUserID != user_session_id) {
              notificationCommon({class_name: 'notification-color', course_title: course_title, course_node_id: course_node_id});
						}
					}
				}
				if(setUserID == user_session_id) {
						setTimeout(function() {
              notificationCommon({class_name: 'current', course_title: course_title, course_node_id: course_node_id});
						},1000);
				}
				setTimeout(function() {
					NProgress.done();
				},1200);
			}
			if($.trim(type) == 'addCourseDialogueActorAndStatement') {
				var modeType             = $.trim(msg.selectType);
				var dialogue_node_id     = getToMessage;
				user_node 				 = msg.user_actor_node_id;
				var user_exsits 		 = user_node.split(',');
				//send message only to the group user
				if(modeType == "Letter") {
					modeType = "Letter" ;
				} else if(modeType == undefined) {
					modeType = "Chat" ;
				} else {
					modeType = "Chat" ;
				}
				if ($.inArray(setUserID, user_exsits) != -1) {
					if($("#menudashboard .listing-wrapper").hasClass('active')==true) {
						$.post(domainUrl+'menudashboard/index',{'mode':'0','setUserID':setUserID},responseCallAction,'html');
						NProgress.start();
						setTimeout(function() {
							$('#DataSaveMsg').show().html("<span><b>"+getUsername+"</b> "+umsg+" </span>");
							setTimeout(function() {
				        $('#DataSaveMsg').fadeOut();
					    },10000);
							if($(".courseboard-table tr.current").attr('data-id') == course_node_id) {
								console.log('dialogueList');
								$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':course_node_id,'user_instance_node_id':setUserID},responseDialogueListAllCallAction,'JSON');
								setTimeout(function() {
									dialogue_node_id = $(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id');
									if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == dialogue_node_id) {
										$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
										$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
									}

								$.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id':dialogue_node_id,'modeType':modeType,'setUserID':setUserID},responseViewCourseDataAction,'JSON');
								},4000);


							}
							ShowStatement(modeType);
							$("#course-dialogue-publish").show();
							$("#course-dialogue-cancel").hide();
							$("#course-dialogue-draft").show();
						},4500);
					}
				} else if(setUserID == user_session_id) {
						$.post(domainUrl+'menudashboard/index',{'mode':'0','setUserID':setUserID},responseCallAction,'html');
						NProgress.start();
						$(".mask-course-view.black-mask").show();
						setTimeout(function() {
							$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':course_node_id,'user_instance_node_id':setUserID},responseDialogueListAllCallAction,'JSON');
							// remove hover effect on newDefaultCourseList
							$('.expandedCourseBox ul li').on({
	              mouseover: function () {
	                $(this).closest(".newDefaultCourseList").addClass("noHover");
	              },
	              mouseout: function () {
	                $(this).closest(".newDefaultCourseList").removeClass("noHover");
	              }
	            });

					setTimeout(function() {
                        dialogue_node_id = $(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id');
						if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == dialogue_node_id) {
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
						}
                        $.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id':dialogue_node_id,'modeType':modeType,'setUserID':setUserID},responseViewCourseDataAction,'JSON');
					},2000);

					NProgress.start();
					ShowStatement(modeType);
					$("#course-dialogue-publish").show();
					$("#course-dialogue-cancel").hide();
				},4500);
				NProgress.done();
				}
			}
			else if(type == 'appendStatementForDialogueClass') {
				user_node = msg.user_actor_node_id;
				var user_exsits = user_node.split(',');
				/* code here start for dynamic saving image or attachment */
				if(getAttachment=='image' || getAttachment=="attachment") {
					var temp_format = umsg.split('.');
					//uploaded image format
					var format_icon = ChatdialogueModule.getIconFormat(temp_format[1]);
	          		if(getAttachment=="image") {
	  					umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='anchor-box-course "+fileTempName+"'><img src='"+domainUrlApi+"attachments/"+getToMessage+"/thumbs/"+umsg+"' class='atch-img-border-course'/><span class='img-overlay-wrap'></span></a>";
	  				}
	  				if(getAttachment=="attachment") {
	  					umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='downloadFile truncate-attachments atch-img-border-course  "+fileTempName+"'><img src='"+domainUrlApi+"img/icons/"+format_icon+"' />"+attachmentName+"<span class='fileSized'>"+fileSizeByte+"</span></a>";
	  				}
                                        if($(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".newDefaultCourseListResources .toggleCourseWrapper").find('.collapse-down.fa-angle-down').length)
                                            $(".newDefaultCourseListResources  .toggleCourseWrapper").trigger('click');
				}

				//send message only to the group user
				if ($.inArray(setUserID, user_exsits) != -1) {
					msg.datetime = datetime;
					msg.umsg = umsg;
					msg.actors = user_exsits;
					msg.getToMessage = getToMessage;
					msg.user_session_id = user_session_id;
					msg.timestamp = timestamp;
					msg.user_exsits = user_exsits;
					msg.type = type;
					msg.getAttachment = getAttachment;
					msg.course_node_id = course_node_id;
					msg.setUsername = getUsername;
					msg.uname = user_session_id;
                    msg.setUserID = setUserID;
					dynamicStructure(msg);
				}
			}
			else if(type == 'appendStatementForDialogueLetterClass') {
				user_node = msg.user_actor_node_id;
				var saveType = msg.saveType;
				var user_exsits = user_node.split(',');
				/* code here start for dynamic saving image or attachment */
				if(getAttachment=='image' || getAttachment=="attachment") {
					var temp_format = umsg.split('.');
					var format_icon = ChatdialogueModule.getIconFormat(temp_format[1]);
				}
				if(getAttachment=="image") {
					umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='anchor-letter-box-course "+fileTempName+"'><img src='"+domainUrlApi+"attachments/"+getToMessage+"/thumbs/"+umsg+"' class='atch-img-letter-course-border'/><span class='img-overlay-wrap'></span></a>";
				}
				if(getAttachment=="attachment") {
					umsg = "<a href='"+domainUrlApi+"attachments/"+getToMessage+"/"+umsg+"' target='_blank' class='downloadFile truncate-attachments atch-img-letter-course-border  "+fileTempName+"'><img src='"+domainUrlApi+"img/icons/"+format_icon+"' />"+attachmentName+"<span class='fileSized'>"+fileSizeByte+"</span></a>";
				}
				//send message only to the group user
				if ($.inArray(setUserID, user_exsits) != -1) {
					msg.datetime = datetime;
					msg.umsg = umsg;
					msg.actors = user_exsits;
					msg.getToMessage = getToMessage;
					msg.uname = user_session_id;
					msg.timestamp = timestamp;
					msg.user_exsits = user_exsits;
					msg.action = type;
					msg.getAttachment = getAttachment;
					msg.course_instance_id = course_node_id;
					msg.setUsername = getUsername;
					msg.courseTitle = msg.course_title;
					msg.saveType = saveType;
					msg.modeType = modeType;
					msg.setUserID = setUserID;
					dynamicLetterStructure(msg);
                                        user_node = msg.user_actor_node_id;
					var saveType = msg.saveType;
					var user_exsits = user_node.split(',');
					//send message only to the group user
					if ($.inArray(setUserID, user_exsits) != -1) {
						var statement_node_id 	     = msg.statement_node_id;
						var st_ins_id1= '';
						if(statement_node_id.length > 1) {
							st_ins_id1       = statement_node_id.split('-');
						}
						$('.single_msg_detail[data-statement-id="undefined"]').attr('data-statement-id',st_ins_id1[0]);
					}
				}
			}
			else if(type == 'appendStatementForDialogueLetterClassModified') {
					user_node = msg.user_actor_node_id;
					var saveType = msg.saveType;
					var user_exsits = user_node.split(',');
					//send message only to the group user
					if ($.inArray(setUserID, user_exsits) != -1) {
						var statement_node_id 	     = msg.statement_node_id;
						var st_ins_id1= '';
						if(statement_node_id.length > 1) {
							st_ins_id1       = statement_node_id.split('-');
						}
						$('.single_msg_detail[data-statement-id="undefined"]').attr('data-statement-id',st_ins_id1[0]);
					}
			}
			else if(type == 'deleteStatementMsg') {
				deleteLetterStatementMsg({type: 'chat', msg: msg, setUserID: setUserID});
			}
			else if(type == 'deleteLetterStatementMsg') {
				deleteLetterStatementMsg({type: 'letter', msg: msg, setUserID: setUserID});
			}
			else if(type == 'addUpdateParticipant') {
				//send message only to the group user
        		if ($.inArray(setUserID, msg.user_actor_node_id) != -1)
        		{

        			var params = {
			              course_instance_id: msg.course_node_id,
			              action_callback: responseDialogueListCallAction,
			              modeType: msg.action,
			              getToMessage: getToMessage,
			              dialogue_title: msg.dialogue_title,
			              courseTitle: msg.course_title,
			              setUsername:getUsername
	            		};
	            	dynamicStructureCommon(params);
					//showNotification({msg: "new participant added by <span><b>"+getUsername+"</b> for dialogue ("+msg.dialogue_title+") </span>"});
					NProgress.done();
				}
				if(setUserID == user_session_id)
				{
          			var params = {
			              course_instance_id: msg.course_node_id,
			              action_callback: responseDialogueListCallAction,
			              modeType: msg.action,
			              getToMessage: getToMessage,
			              dialogue_title: msg.dialogue_title,
			              courseTitle: msg.course_title,
			              setUsername:getUsername
	            		};
	            	dynamicStructureCommon(params);
          			NProgress.done();
				}
			}
			else if(type == 'removeParticipant') {
				//send message only to the group user
				var user_exsits = msg.user_actor_node_id.split(',');

        		if ($.inArray(setUserID, user_exsits) == 1)
        		{
        			var params = {
			              course_instance_id: msg.course_node_id,
			              action_callback: responseDialogueListCallAction,
			              modeType: msg.action,
			              getToMessage: getToMessage,
			              dialogue_title: msg.dialogue_title,
			              courseTitle: msg.course_title,
			              setUsername:getUsername,
			              sender_full_name:getUsername,
			              message:umsg,
	            		};
	            	CommonMessageNotification(params);
        			NProgress.done();
				}
				else if(setUserID == user_session_id)
				{

          			var params = {
			              course_instance_id: msg.course_node_id,
			              action_callback: responseDialogueListCallAction,
			              modeType: msg.action,
			              getToMessage: getToMessage,
			              dialogue_title: msg.dialogue_title,
			              courseTitle: msg.course_title,
			              setUsername:getUsername,
			              sender_full_name:getUsername,
			              message:umsg
	            		};
	            	CommonMessageNotification(params);
          			NProgress.done();
				}
			}
			else if(type == 'system' || type == 'offline') {
				var params3 = {
					onlineuser: onlineuser,
					onlineuserid: onlineuserid,
					setUserID: setUserID,
					type: type
				};
				var emtpyID = commonSystemAndOffline(params3);
			}
			};
			websocketcourse.onerror	= function(ev) {
				showErrorMsg();
			};
			websocketcourse.onclose = function(ev) {
				showErrorMsg();
			};
	}
	function existingDialogueSelCourseListCommon(params) {
		var interval = (params.interval > 0) ? params.interval: 2000;
		$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id': params.course_node_id, 'user_instance_node_id': params.setUserID},responseDialogueListAllCallAction,'JSON');
		setTimeout(function() {
		  if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == params.dialogue_node_id) {
		    $(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
		    $(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
		  }
		},interval);
		$.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id': params.dialogue_node_id,'modeType': params.modeType,'setUserID':params.setUserID},responseViewCourseDataAction,'JSON');
	}

	function notificationCommon(params) {
		$(".course-list .courseboard-table").find('tr').each(function() {
		if($(this).attr('data-id') == params.course_node_id) {
			$(".existCourseTitle").html(params.course_title);
			$(this).addClass(params.class_name);
			if($(this).attr('data-id') == params.course_node_id) {
			   $(this).find('td:nth-child(2)').html(params.course_title);
			}
		}
		});
	}

	function notificationCommon2(params) {
		$(".course-list .courseboard-table").find('tr').each(function() {
		  if($(this).attr('data-id') == params.course_node_id) {
		    $(".existdialogue_title").html(params.dialogue_title);
		    $(this).addClass(params.class_name);
		  }
		});
	}

	function commonSystemAndOffline(params) {
		$('#user_box').empty();
		var emtpyID = [];
		for (var key in params.onlineuser) {
		  if (params.onlineuser.hasOwnProperty(key) && key != 0) {
		    if(params.onlineuserid[key] != params.setUserID && emtpyID.indexOf(params.onlineuserid[key])==-1) {
		      emtpyID.push(params.onlineuserid[key]);
		      $('#user_box').append("<div class=\"online_users\" id='"+params.onlineuserid[key]+"'><a href='javascript:void(0)'>"+params.onlineuser[key]+"</a></div>");
		      if(params.type == 'system' && $("#"+params.onlineuserid[key]).attr("id") != undefined) {
		        $("[data-chatter="+params.onlineuserid[key]+"] .chatters").removeClass("offline");
		        $("[data-chatter="+params.onlineuserid[key]+"] .panel").css("display","block");
		      }
		    }
		  }
	}
    if(params.type == 'offline') {
      var getCurrentChatter = $(".chat_wrapper.active .chatters").attr("data-chatter");
      if($("#"+getCurrentChatter).attr("id") == undefined) {
        $(".chat_wrappers.active .chatters").addClass("offline");
        $(".chat_wrappers.active .panel").css("display","none");
      }
    }
    return emtpyID;
  }

	function showErrorMsg() {
		var error = '<div class="connection_notifc"><span class="connect_wrap"><i class="icon connection_error"></i><span class="notif_title">Connection closed</span></span></div>';
		$('.chat_wrappers.active ul:first').append(error);
	}

	function deleteLetterStatementMsg(params) {
	    var user_node 		= params.msg.user_actor_node_id;
	    var user_exsits   = user_node.split(',');
	    var message 	  = params.msg.message;
	    //send message only to the group user
	    if ($.inArray(params.setUserID, user_exsits) != -1) {
	      setTimeout(function() {
	        if(params.type == 'letter') {
	            var single_msg_detail_ele = $(".letter-message-wrap .single_list_wrap").find('.single_msg_detail:first');
	            single_msg_detail_ele.each(function(i,v) {
	              var ele = $(v);
	              if(ele.attr('data-statement-id') == params.msg.statement_node_id) {
	                ele.parent().attr('letter-status',2);
	                ele.siblings('.single_msg_info').find('span:first').html(message);
	                ele.siblings('.single_msg_info').find('span:first').addClass('rmv-disabled');
	                ele.siblings('.single_msg_info').find('span').not(':first').remove();
	              }
	            });
	            if(single_msg_detail_ele.length) {
	              $("#blank-statement-id").val('');
	            }
	        } else {
	            $(".message-wrap .statement-list-wrap").find('.statement-info').each(function(i,v) {
	              $(v).find('span').each(function(index,val) {
	                if($(val).attr('data-instance_id') == params.msg.statement_node_id) {
	                  $(val).html(message);
	                  $(val).addClass('rmv-disabled');
	                }
	              });
	            });
	        }
	      }, 100);
	    }
	}
	function ShowStatement(action){
		$(".single-dialogue-view-control-bar").removeClass("show");
		$(".singleDialogueViewWrap").removeClass("show").addClass("hide");
		$("#newCourseControl").removeClass("show").addClass("hide");
		$(".newCourseDefaultSec").removeClass("show").addClass("hide");
		$(".existing-dialogue-control-wrap").addClass("show");
		$(".existingSelectedCourseWrap").removeClass("hide").addClass("show");
		$("#viewCourseControlBar, #viewCourseDefaultWrapper").addClass("hide");
		existingDialogueSelCourse();
		// default chat value show
		var stType = action;
		var changeIconClass = (stType == "Letter") ? "letterIcon": "chatIcon";
		$("#hidden_document_type_id").attr('value',stType);
		$(".drop-anchor-select").html('<i class="icon ' + changeIconClass+'"></i>' + stType);
	    $(".course-alignment-section .hideOnLetterIcon").hide();
	    $(".course-alignment-section .hideOnChatIcon").show();
	    $(".checkEnterBox").hide();
	    $(".letter-edt-wrapper").removeClass("hide");
	    $(".chat-textarea").addClass("hide");
	    $(".letter-edt-wrapper.edt").focus();
		if($('#dropLetterChatView').text() == "Chat") {
	    $(".message-wrap").removeClass("hide").addClass("show");
	    $(".letter-message-wrap").removeClass("show").addClass("hide");
		}
	}

	$("body").off('click','#confirmCoursePopup .close, #confirmCoursePopup .btn-default-pop').on('click','#confirmCoursePopup .close, #confirmCoursePopup .btn-default-pop',function(){
		$(".mask-course-view.white-mask").hide();
	});

	function showNotification(params) {
		var interval = (params.interval)?params.interval: 10000;
		var ele = $('#DataSaveMsg');
		ele.show().html(params.msg);
		setTimeout(function() {
		  ele.fadeOut();
		},interval);
	}

	function CommonMessageNotification(params) {
		if($("#menudashboard:visible").length == 0) { return true;}
		//var umsg = ' added you as a recipient on '+ params.dialogue_title+' dialogue under '+ params.courseTitle+' course';

		$.post(domainUrl+'menudashboard/index',{'mode':'0','setUserID':setUserID},responseCallAction,'html');
		setTimeout(function() {
		  showNotification({msg: "<span>"+params.message+" </span>"});
		  if($(".courseboard-table tr.current").attr('data-id') == params.course_instance_id) {
		    $.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':params.course_instance_id,'user_instance_node_id':setUserID},params.action_callback,'JSON');

		    setTimeout(function() {
		  		if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == params.getToMessage) {
		  				$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
		  				$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
		  			}
		  		},2000);
		  		$.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id':params.getToMessage,'modeType':params.modeType,'setUserID':setUserID},responseViewCourseDataAction,'JSON');
		      ShowStatement(params.modeType);
		    	$("#course-dialogue-publish").show();
		    	$("#course-dialogue-cancel").hide();
		    	$("#course-dialogue-draft").show();
		  }
		}, 3500);
	}

	function dynamicStructureCommon(params) {

		if($("#menudashboard:visible").length == 0) { return true;}
		var umsg = ' added you as a recipient on '+ params.dialogue_title+' dialogue under '+ params.courseTitle+' course';
		$.post(domainUrl+'menudashboard/index',{'mode':'0','setUserID':setUserID},responseCallAction,'html');
		setTimeout(function() {

		  showNotification({msg: "<span><b>"+params.setUsername+"</b> "+umsg+" </span>"});
		  //showNotification({msg: "<span>"+umsg+" </span>"});
		  if($(".courseboard-table tr.current").attr('data-id') == params.course_instance_id) {
		    $.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':params.course_instance_id,'user_instance_node_id':setUserID},params.action_callback,'JSON');

		    setTimeout(function() {
		  		if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == params.getToMessage) {
		  				$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
		  				$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
		  			}
		  		},2000);
		  		$.post(domainUrl+'menudashboard/viewCourseData',{'dialogue_instance_node_id':params.getToMessage,'modeType':params.modeType,'setUserID':setUserID},responseViewCourseDataAction,'JSON');
		      ShowStatement(params.modeType);
		    	$("#course-dialogue-publish").show();
		    	$("#course-dialogue-cancel").hide();
		    	$("#course-dialogue-draft").show();
		  }
		}, 3500);
	}
  	function dynamicStructure(params) {
		$(".course_edt_box .chat-msg:visible").val('');
		var cls = 'statement_drop clearfix ';
		if(params.getAttachment == "image") {
			var cls = 'atch-overlay-img common-class';
		} else if(params.getAttachment == "attachment") {
		 var cls = 'atch-overlay common-class';
		}
		objChatfnCourse = false;
		var timezone 	= ConvertToLocalTimeC(params.timestamp);
		var temp 		= params.datetime.split('');
		var last_li_obj = $("[data-id="+params.getToMessage+"] .msg-statement-wrap .statement-list-wrap:last");
		var newHtml     = "";
		/* this condition use when user save course dialogue in draft mode */
		if($.trim(params.courseStatementType) == "Draft" && $.trim(params.diaStatusType) == "Draft") {
			if ($.inArray(params.setUserID, params.actors) != -1) {
				if(params.setUserID!= params.uname) {
	            var params = {
	              course_instance_id: params.course_instance_id,
	              action_callback: responseDialogueListCallAction,
	              modeType: 'Chat',
	              getToMessage: params.getToMessage,
	              dialogue_title: params.dialogue_title,
	              courseTitle: params.courseTitle
	            };
	            dynamicStructureCommon(params);
				} else {
					$(".existingDialogueSelCourseList.current").attr('data-status','1');
					if ($.inArray(params.setUserID, params.actors) != -1) {
						if($(".message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id') == params.getToMessage) {

							params.umsg = params.umsg.trim();
							params.umsg = params.umsg.replace(/\n+/g, '\n');
							var str_temp = params.umsg.split("\n");
							st_ins_id    = params.statement_node_id.split('~');
							html = '';
							html +='<li class="statement-list-wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'"><div class="statement-detail"><span class="msgIconBox"><i class="icon envelope"></i></span>\
              <span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>';
							for(i=0;i < str_temp.length;i++) {
								newHtml = newHtml+'<span class="more '+cls+' '+st_ins_id[i]+' " data-instance_id="'+st_ins_id[i]+'">'+str_temp[i]+'</span>';
							}
							html += '</div><div class="statement-info">'+newHtml+'</div></li>';
							var li_content = html;
						}
        	}
          var params5 = params;
          params5.last_li_obj = last_li_obj;
          params5.cls = cls;
          params5.st_ins_id = st_ins_id;
          params5.str_temp = str_temp;
          params5.temp = temp;
          params5.li_content = li_content;
          params5.datetime = params.datetime;
          params5.action = params.type;
          weeklyLastCommon(params5);
				}
			}
		}
		/* Condition use here for course is published and dialogue in draft mode */
		else if($.trim(params.courseStatementType) == "Published" && $.trim(params.diaStatusType) == "Draft") {
			if ($.inArray(setUserID, params.actors) != -1) {
				if(setUserID!= params.uname) {

					if($("#menudashboard").attr('style') != "display: none;" || $("#menudashboard").attr('style')==undefined) {
						setTimeout(function() {
							$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id': params.course_instance_id,'user_instance_node_id':setUserID},responseDialogueListCallAction,'JSON');
						},2000);
						if($(".courseboard-table tr.current").attr('data-id') == params.course_instance_id) {
							if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == params.getToMessage) {
								$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
								$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
							}
						}
						if($.trim(params.diaStatusType) == "Draft") {
							umsg = ' has created new dialogue '+ params.dialogue_title;
              showNotification({msg: "<span><b>"+params.setUsername+"</b> "+umsg+" </span>"});
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").addClass('current');
						}
					}

				} else {
					if ($.inArray(setUserID, params.actors) != -1) {
						$(".existingDialogueSelCourseList.current").attr('data-status','1');
						if($(".message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
							params.umsg 			= params.umsg.trim();
							params.umsg 			= params.umsg.replace(/\n+/g, '\n');
							var str_temp 	= params.umsg.split("\n");
							st_ins_id ="";
							html = '';
							html +='<li class="statement-list-wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'"><div class="statement-detail"><span class="msgIconBox"><i class="icon envelope"></i></span>\
              <span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>';
							for(i=0;i < str_temp.length;i++) {
								newHtml = newHtml+'<span class="more '+cls+' '+st_ins_id[i]+' " data-instance_id="'+st_ins_id[i]+'">'+str_temp[i]+'</span>';
							}
							html += '</div><div class="statement-info">'+newHtml+'</div></li>';
							var li_content = html;
						}
        	}
          var params5 = params;
          params5.last_li_obj = last_li_obj;
          params5.cls = cls;
          params5.st_ins_id = st_ins_id;
          params5.str_temp = str_temp;
          params5.temp = temp;
          params5.li_content = li_content;
          params5.datetime = params.datetime;
          params5.action = params.type;
          weeklyLastCommon(params5);
				}
			}
		}
		/* this condition use when user send chat message to join actor or recepient  */
		else {
			if ($.inArray(setUserID, params.actors) != -1) {
				if($(".message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
					params.umsg 			= params.umsg.trim();
					params.umsg 			= params.umsg.replace(/\n+/g, '\n');
					var str_temp 	= params.umsg.split("\n");
					st_ins_id       = params.statement_node_id.split('~');
					if(params.nodeInstancePropertyId==params.statement_node_id){
						updateChat(params);
					}
					else {
					html = '';
					html +='<li class="statement-list-wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'"><div class="statement-detail"><span class="msgIconBox"><i class="icon envelope"></i></span>\
          <span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>';
					for(i=0;i < str_temp.length;i++) {
						newHtml = newHtml+'<span class="more '+cls+' '+st_ins_id[i]+' " data-instance_id="'+st_ins_id[i]+'">'+str_temp[i]+'</span>';
					}
					html += '</div><div class="statement-info">'+newHtml+'</div></li>';
					var li_content = html;
					}
				}
      }

      var params5 = params;
      params5.last_li_obj = last_li_obj;
      params5.cls = cls;
      params5.st_ins_id = (typeof st_ins_id != 'undefined') ? st_ins_id : '';
      params5.str_temp = str_temp;
      params5.temp = temp;
      params5.li_content = li_content;
      params5.datetime = params.datetime;
      params5.action = params.type;
      weeklyLastCommon(params5);
		}
		if($(".message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
			setTimeout(function() {
				$(".message-wrap").getNiceScroll(0).doScrollTop($('.message-wrap .msg-statement-wrap ul').height() - 1,1);
			},1000);
		}
		readMoreText();
	    if($(".existingSelectedCourseWrap .editor-collapsed-btn").length){
	        $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
	    }
	}
	function weeklyLastCommon(params) {
		if($(".message-wrap.active .msg-statement-wrap").find('.weekly:last').hasClass('present-day')) {
		  if(params.last_li_obj.data("id") == params.uname && params.last_li_obj.data("time") == params.datetime ) {
		    if(params.action =='appendStatementForDialogueClass') {

		    	if(params.nodeInstancePropertyId==params.statement_node_id){
						updateChat(params);
					}
					else {
						if($("[data-id="+params.getToMessage+"] .msg-statement-wrap .statement-list-wrap:last").hasClass('.user-msg-title')) {
						var li_content ='<li class="statement-list-wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'"><div class="statement-detail"><span class="msgIconBox">\
						  <i class="icon envelope"></i></span><span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>\
						  <div class="statement-info"><span class="more">'+params.umsg+'</span></div></div></li>';
						$("[data-id="+params.getToMessage+"] .msg-statement-wrap ul").append(li_content);
						} else {
						for(i=0;i< params.str_temp.length;i++) {
						  var  html_data = '<span class="more '+params.cls+' '+params.st_ins_id[i]+'"  data-instance_id="'+params.st_ins_id[i]+'">'+params.str_temp[i]+'</span>';
						  $("[data-id="+params.getToMessage+"] .msg-statement-wrap ul .statement-info:last").append(html_data);
						  var  html_data = li_content;
						}
					}
		  		}
		    } else {
		    	if(params.nodeInstancePropertyId==params.statement_node_id){
						updateChat(params);
					}
					else {
				      var  html_data = params.li_content;
				      $("[data-id="+params.getToMessage+"] .msg-statement-wrap ul").append(html_data);
		  		}
		    }
		  } else {
				    if(params.nodeInstancePropertyId==params.statement_node_id){
						updateChat(params);
					}
					else {
				    var  html_data = params.li_content;
				    $("[data-id="+params.getToMessage+"] .msg-statement-wrap ul").append(html_data);
					}
		  }
		} else {
				if(params.nodeInstancePropertyId==params.statement_node_id){
						updateChat(params);
					}
					else {
					var html_data = '<div class="weekly present-day" id="'+params.temp[0]+'"> <span>Today </span></div>';
	  				html_data += params.li_content;
	  				$("[data-id="+params.getToMessage+"] .msg-statement-wrap ul").append(html_data);
  				}
		}
	}

	function updateChat(params){
		$('.statement_drop.clearfix[data-instance_id='+params.nodeInstancePropertyId+']').text(params.umsg);
		$('.statement_drop.clearfix[data-instance_id='+params.nodeInstancePropertyId+']').addClass('edited-icon');
	}

	function dynamicLetterStructure(params) {



		$('#menudashboard #edt div.edtParagraph:visible').removeClass('edtList').html('<br>').not(':first').remove();
		$(".letter-edt-wrapper:visible").removeAttr('style');
		$("#blank-statement-id").val('');
		var cls = 'clearfix ';
		if(params.getAttachment=="image") {
			cls = 'atch-overlay-img common-class';
		} else if(params.getAttachment=="attachment") {
		 	cls = 'atch-overlay common-class';
		}
		objChatfnCourse = false;
		var timezone 	= ConvertToLocalTimeC(params.timestamp);
		var temp 		= params.datetime.split('');
		var last_li_obj = $("[data-id=" + params.getToMessage + "] .single_msg_list_box .single_list_wrap");
		var newHtml     = "";
    	var status = "0";
		if(params.saveType=="P") {
			status = 1;
		}
		/* this condition use when user save course dialogue in draft mode */
		if($.trim(params.courseStatementType) == "Draft" && $.trim(params.diaStatusType) == "Draft") {
			if(params.statement_node_id== "" || params.statement_node_id== null) {
				 params.statement_node_id = '0000~0000';
			}
			var st_ins_id1 = '';
			var str_temp 		= params.umsg;
			if(params.statement_node_id.length > 1) {
				st_ins_id1       = params.statement_node_id.split('-');
				st_ins_id        = st_ins_id1[1].split('~');
			} else {
				st_ins_id[0]       = params.statement_node_id;
			}
			if ($.inArray(params.setUserID, params.actors) != -1) {
				if(params.setUserID!= params.uname) {
            var params1 = {
              course_instance_id: params.course_instance_id,
              action_callback: responseDialogueListAllCallAction,
              modeType: 'Letter',
              getToMessage: params.getToMessage,
              dialogue_title: params.dialogue_title,
              courseTitle: params.courseTitle,
              setUsername: params.sender_full_name

            };
            dynamicStructureCommon(params1);

				} else {
          var params2 = {
            setUserID: params.setUserID,
            actors: params.actors,
            getToMessage: params.getToMessage,
            blank_instance_node_id: params.blank_instance_node_id,
            uname: params.uname,
            datetime: params.datetime,
            status: status,
            st_ins_id1: st_ins_id1,
            setUsername: params.setUsername,
            timezone: timezone,
            str_temp: str_temp,
            newHtml:newHtml,
            st_ins_id:st_ins_id
          }
          var li_content = commonScript2(params2);
          var params1 = {
            blank_instance_node_id: params.blank_instance_node_id,
            uname: params.uname,
            setUserID: params.setUserID,
            action: 'appendStatementForDialogueLetterClass',
            temp: temp,
            getToMessage: params.getToMessage,
            li_content:li_content
          }
          commonScript(params1);
				}
			}
		}
		/* Condition use here for course is published and dialogue in draft mode */
		else if($.trim(params.courseStatementType) == "Published" && $.trim(params.diaStatusType) == "Draft") {
			if(params.statement_node_id== "" || params.statement_node_id== null) {
				 params.statement_node_id = '0000~0000';
			}
			var st_ins_id1 = '';
			var str_temp 		= params.umsg;
			if(params.statement_node_id.length > 1) {
				st_ins_id1       = params.statement_node_id.split('-');
				st_ins_id        = st_ins_id1[1].split('~');
			} else {
				st_ins_id[0]       = params.statement_node_id;
			}
			if($.inArray(params.setUserID, params.actors) != -1) {
				if(params.setUserID!= params.uname) {
					if($("#menudashboard").attr('style') != "display: none;" || $("#menudashboard").attr('style')==undefined) {
						setTimeout(function() {
							$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id': params.course_instance_id,'user_instance_node_id':params.setUserID},responseDialogueListAllCallAction,'JSON');
						},2000);
						if($(".courseboard-table tr.current").attr('data-id') == params.course_instance_id) {
							if($(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").attr('data-id') == params.getToMessage) {
								$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
								$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").addClass('current');
							}
						}
						if($.trim(params.diaStatusType) == "Draft") {
							umsg = ' has created new dialogue '+params.dialogue_title;
              				showNotification({msg: "<span><b>"+params.setUsername+"</b> "+umsg+" </span>"});
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").removeClass('current');
							$(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList").addClass('current');
						}
					}
				} else {
          var params2 = {
            setUserID: params.setUserID,
            actors: params.actors,
            getToMessage: params.getToMessage,
            blank_instance_node_id: params.blank_instance_node_id,
            uname: params.uname,
            datetime: params.datetime,
            status: status,
            st_ins_id1: st_ins_id1,
            setUsername: params.setUsername,
            timezone: timezone,
            str_temp: str_temp,
            newHtml: newHtml,
            st_ins_id:st_ins_id
          }
          var li_content = commonScript2(params2);
          var params1 = {
            blank_instance_node_id: params.blank_instance_node_id,
            uname: params.uname,
            setUserID: params.setUserID,
            action: 'appendStatementForDialogueLetterClass',
            temp: temp,
            getToMessage: params.getToMessage,
            li_content:li_content
          }
          commonScript(params1);

				}
			}
		}
		/* this condition use when user send chat message to join actor or recepient  */
		else {
			if($.trim(params.courseStatementType) == "Published" && $.trim(params.diaStatusType) == "Published") {
				var st_ins_id1 = '';
				if(params.getAttachment=="image" || params.getAttachment=="attachment") {
					umsg 			= params.umsg.trim();
					umsg 			= umsg.replace(/\n+/g, '\n');
					var str_temp 	= umsg.split("\n");
					if(params.statement_node_id.length > 1) {
					 	st_ins_id1       = params.statement_node_id.split('-');
					 	st_ins_id        = st_ins_id1[1].split('~');
					 }
				} else {
					var str_temp 		= params.umsg;
					var st_ins_id       = '';
				}

				if(params.blank_instance_node_id)
       			 {
       			 	$(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='"+params.blank_instance_node_id+"']").find('.user-msg-title').addClass('letter-edited-icon');
       			 }


				if ($.inArray(params.setUserID, params.actors) != -1) {
					if($(".letter-message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
						if(params.blank_instance_node_id!="" && $.inArray(params.uname, params.actors)!= -1) {
							html = '';
							html +='<li class="single_list_wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'" letter-status="'+status+'">\
                <div class="single_msg_detail letter_statement_drop" data-statement-id="'+st_ins_id1[0]+'"><span class="msgIconBox">\
                <i class="icon envelope"></i></span><span class="user-msg-title letter-edited-icon">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>';
							jQuery.each(str_temp, function(i, val) {
								if(params.getAttachment=="image" || params.getAttachment=="attachment") {
									var imgval = val;
								} else {
									var imgval = val['statement'];
								}
							  newHtml = newHtml+'<span class="more-txt-span '+cls+'" data-instance_id="'+st_ins_id[i]+'" letter-status="'+status+'">'+imgval+'</span>';
							});
							html += '</div><div class="single_msg_info">'+newHtml+'</div></li>';
							var li_content = html;
						} else {
							html = '';
							html +='<li class="single_list_wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'" letter-status="'+status+'">\
                <div class="single_msg_detail letter_statement_drop" data-statement-id="'+st_ins_id1[0]+'"><span class="msgIconBox">\
                <i class="icon envelope"></i></span><span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+timezone+'</span>';
							jQuery.each(str_temp, function(i, val) {
							  if(params.getAttachment=="image" || params.getAttachment=="attachment") {
									var imgval = val;
								} else {
									var imgval = val['statement'];
								}
							  newHtml = newHtml+'<span class="more-txt-span '+cls+'" data-instance_id="'+st_ins_id[i]+'" letter-status="'+status+'">'+imgval+'</span>';
							});
							html += '</div><div class="single_msg_info">'+newHtml+'</div></li>';
							var li_content = html;
						}
					}
       			 }

				if($(".letter-message-wrap.active .single_msg_list_box").find('.weekly:last').hasClass('present-day')) {
					if(params.blank_instance_node_id!="" && params.uname == params.setUserID) {
						if(params.action =='appendStatementForDialogueLetterClass') {
							var  html_data = '';
							jQuery.each(str_temp, function(i, val) {
							  if(params.getAttachment=="image" || params.getAttachment=="attachment") {
									var imgval = val;
								} else {
									var imgval = val['statement'];
								}
							  html_data += '<span class="more-txt-span '+cls+'" letter-status="'+status+'" data-instance_id="'+st_ins_id[i]+'">'+imgval+'</span>';
							});
							$(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").siblings('div.single_msg_info').html(html_data);
							$(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").parent().attr('letter-status',1);
							$(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").attr('letter-status',1);
						} else {
							var  html_data = li_content;
							$("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
						}
					} else {
						var  html_data = li_content;
						$("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
					}
				} else {

					var html_data = '<div class="weekly present-day" id="'+params.datetime+'"> <span>Today </span></div>';
					html_data += li_content;
					$("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
				}
				if($(".letter-message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
					setTimeout(function() {
						$(".letter-message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul').height() -1 ,1);
					},1000);
				}
			}
		}
		removeEdtClassLetter();
		readMoreText();
		NProgress.done();
	}

  function commonScript2(params) {
    var li_content;
    $(".existingDialogueSelCourseList.current").attr('data-status','1');
    if ($.inArray(params.setUserID, params.actors) != -1 && ($(".letter-message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage)) {
        var html = '';
        html +='<li class="single_list_wrap" data-id="'+params.uname+'" data-time="'+params.datetime+'" letter-status="'+params.status+'"><div class="single_msg_detail letter_statement_drop" data-statement-id="'+params.st_ins_id1[0]+'"><span class="msgIconBox"><i class="icon envelope"></i></span><span class="user-msg-title">'+params.setUsername+'</span><span class="user-msg-date right">'+params.timezone+'</span>';
        for(i=0;i < params.str_temp.length;i++) {
          newHtml = params.newHtml+'<span class="more-txt-span '+params.cls+'" data-instance_id="'+params.st_ins_id[i]+'" letter-status="'+params.status+'">'+params.str_temp[i]['statement']+'</span>';
        }
        html += '</div><div class="single_msg_info">'+newHtml+'</div></li>';
        li_content = html;
    }
    return li_content;
  }

  function commonScript(params) {
    if($(".letter-message-wrap.active .single_msg_list_box").find('.weekly:last').hasClass('present-day')) {
      if(params.blank_instance_node_id!="" && params.uname == params.setUserID) {
        if(params.action =='appendStatementForDialogueLetterClass') {
          var  html_data = '';
          for(i=0;i< params.str_temp.length;i++) {
            html_data += '<span class="more-txt-span '+cls+'" letter-status="'+status+'" data-instance_id="'+st_ins_id[i]+'">'+params.str_temp[i]['statement']+'</span>';
          }
          $(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").siblings('div.single_msg_info').html(html_data);
          $(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").parent().attr('letter-status',1);
          $(".letter-message-wrap .single_msg_list_box").find("li.single_list_wrap [data-statement-id='" + params.blank_instance_node_id + "']").attr('letter-status',1);
        } else {
          var  html_data = params.li_content;
          $("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
        }
      } else {
        var  html_data = params.li_content;
        $("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
      }
    } else {
      var html_data = '<div class="weekly present-day" id="'+params.datetime+'"> <span>Today </span></div>';
      html_data += params.li_content;
      $("[data-id="+params.getToMessage+"] .single_msg_list_box ul").append(html_data);
    }

    if($(".letter-message-wrap.active").data('id') == params.getToMessage && $(".existingDialogueSelCourseList.current").attr('data-id')== params.getToMessage) {
      setTimeout(function() {
        $(".letter-message-wrap").getNiceScroll(0).doScrollTop($('.single_msg_list_box ul, .letter-message-wrap ul').height() - 1,1);
      },1000);
    }
  }
	/* function here used to displayed weekly and day wise statement*/
	function getDayValC() {
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
	/* function here to convert according to time zone*/
	function ConvertToLocalTimeC(utcTime, divID) {
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
	  	var CreateDate =  strTime;
		return CreateDate;
	}

	/*script function here for display course class dialogue information list dynamic html*/
	function responseDialogueListAllCallAction(d,s) {

		var Html = "";
	  var userIconClass = "";
	  Html+= "<ul>";
	  for(var i in d) {
	   for(var j in d[i])
	      if(j=='dialogue_title') {
	        if(d[i]['dialogue_title']!== undefined) {
	          var user_exsits = d[i]['user_id'].split(',');
            userIconClass = 'singular-user';
	          if(user_exsits.length>1) {
	            userIconClass = 'plural-user';
	          }
	          if( (d[i]['status'] ==  '1' && $.inArray(setUserID, user_exsits) != -1) || ( ( d[i]['status']=='0' || d[i]['status'] == null) && d[i]['status']=='0' && d[i]['createdBy'] == setUserID)) {
	            Html+="<li class='existingDialogueSelCourseList' data-status='"+d[i]['status']+"' data-id='"+d[i]['dialogue_node_id']+"' user-id='"+d[i]['user_id']+"' data-course='"+d.course_instance_id+"'>";

	            Html +="<div class='subCollapsedCourseBox'><div class='courseTitle'><i class='icon left sm-dialogue'></i><span>"+d[i]['dialogue_title']+"</div>";
	            Html+="<div class='updateCourseTitle'><i class='icon "+userIconClass+"'></i><span>"+d[i]['userName']+"</span></div>";
	            if(parseInt(d[i]['notificationCount']) > 0)
                Html+="<div id='chat_notification_"+d[i]['dialogue_node_id']+"' class='counter-wrap fadeIn'><span>"+d[i]['notificationCount']+"</span></div>";
                else
                Html+="<div id='chat_notification_"+d[i]['dialogue_node_id']+"' class='counter-wrap hide'><span>"+d[i]['notificationCount']+"</span></div>";
	          }
	        }
	        Html+="</div></li>";
	      }
	    }
	    Html+="</ul>";
	    $('#course-dialogue-instance-id-'+d.course_instance_id).addClass('expandedCourseBox').html(Html);
	    // remove-hover-effect on parent li
	    $('.expandedCourseBox ul li').on({
	      mouseover: function () {
	        $(this).closest(".newDefaultCourseList").addClass("noHover");
	      },
	      mouseout: function () {
	        $(this).closest(".newDefaultCourseList").removeClass("noHover");
	      }
	    });
	    $(".course-list .ref-inline.openup").siblings(".ref-show-inline-wrap").find(".courseDialogueDefaultWrap.newDefaultCourseList .toggleCourseWrapper").find('.collapse-up').removeClass('collapse-up fa-angle-up').addClass('collapse-down fa-angle-down');
	    $(".courseDialogueDefaultWrap.newDefaultCourseList.current").find(".existingDialogueSelCourseList:first").addClass('current');
	    $(".courseDialogueDefaultWrap.newDefaultCourseList.current").removeClass('current');
			var dialogueNodeId = $(".courseDialogueDefaultWrap.newDefaultCourseList").find(".existingDialogueSelCourseList:first").data('id');
	}
});
function isEditorExpanded() {

}

function getHeightForChatEditor(rightPane) {

    var existingDialogueControl = rightPane.find("#existingDialogueControl");
    var remainingHeight = rightPane.outerHeight() - existingDialogueControl.outerHeight();
    if(existingDialogueControl.outerHeight() > 100) {
        remainingHeight = remainingHeight - 22;
    }
    if($("#existingDialogueControl").find('.panel-collapse.in').length) {
        remainingHeight = remainingHeight + 17;
    }
    var existingDocContainer = rightPane.find('.edtContainer.existingDocContainer');
    if(existingDocContainer.length) { // for chat mode
        remainingHeight = remainingHeight - existingDocContainer.outerHeight() - 10;
    } else {
        existingDocContainer = $('.letterChatMode');
        remainingHeight = remainingHeight - existingDocContainer.outerHeight() - 20;
    }
    if(remainingHeight < 1) {
        remainingHeight *= -1;
    }
    return remainingHeight;
}
function getHeightForChatEditorWhenExpanded(rightPane) {
    var existingDialogueControl = rightPane.find("#existingDialogueControl");
    return rightPane.outerHeight() - existingDialogueControl.outerHeight() - 10;
}

function calculateFullDialogueChatHeight() {
    var rightPane = $("#rightPane"), height;
    if(rightPane.find('.editor-collapsed-btn').length) {
        height = getHeightForChatEditorWhenExpanded(rightPane);
    } else {
        height = getHeightForChatEditor(rightPane);
    }
    var existWrapperMsg = rightPane.find(".message-wrap.active.existWrapperMsg");
    if(existWrapperMsg.hasClass('hide')) {
        if(rightPane.find('.edtContainer').hasClass('fixed-chat-screen')) {
            rightPane.find('.edtContainer').height(height);
        } else {
            rightPane.find('.edtContainer').closest('.letterChatMode').height(height);
        }
    } else {
        existWrapperMsg.height(height).niceScroll({
           cursorcolor: "#000",
           cursorborder: "0",
           cursorborderradius: '0',
           cursorwidth: "4px",
           background: 'rgba(0,0,0,.15)'
        });
    }
    maintainScrollDown();
}


function maintainScrollDown(){
	var niceScroll = $(".letter-message-wrap, .message-wrap");
        if($(".msg-statement-wrap").height()<=niceScroll.height()){
            nanoScrollDown = true;
        }
        if(nanoScrollDown){
                if(niceScroll.getNiceScroll(0)) {
                    niceScroll.getNiceScroll().resize();
                    niceScroll.getNiceScroll(0).doScrollTop($(".msg-statement-wrap").height() - 1, 1);
                    $(".showDownBtnNano").addClass("hide");
                    $(".showDownBtnNano .ct-counter-content").text("0");                    
                }
            }
            else{
                var getCounter = $(".showDownBtnNano .ct-counter-content").text();
                getCounter = parseInt(getCounter)+1;
                $(".showDownBtnNano .ct-counter").removeClass("hide");
                $(".showDownBtnNano").removeClass("hide");                
                $(".showDownBtnNano .ct-counter-content").text(getCounter);
            }
}

window.puJsFileLoadCounter++;
