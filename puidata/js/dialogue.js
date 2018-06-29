var w_popout;
objChatfn = true;
var openCrossDomain;
function saveNodeData(obj) {
	if(obj.type=='Statement') {
		$("#add-text").blur();
	}
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'data':JSON.stringify(obj),'action':'chat','type':'saveStatement'},
		success: function(data) {
			if(data) {
				if(obj.type=='Statement') {
					$("#add-text").focus();
				}
				runTimeNotification(obj.messageto,data,1,'updatePropertyId',obj.user_node,obj.random_id,obj.type);
				$(".nano").nanoScroller();
			}
		}
	});//end of ajax
}


// function getStatement(dialog_instance_node_id,date_obj,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment) {
function getStatement(dialog_instance_node_id,date_obj,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment) {
		if($('.ref_add_new_title_bar').length != 0) {
			$(".ref_add_new_title_bar").remove();
		}
		$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'dialog_instance_node_id':dialog_instance_node_id,'date_obj':date_obj,'action':'chat','type':'getStatement','random':Math.random()},
		success: function(data) {
			if(date_obj =='' || date_obj == null) {
				var img_html = '<img src= "'+domainUrlApi+'img/attachment.png" width="16" height="15" id="attachment" data-toggle="tooltip" data-placement="left" title="Attach Files"/>';
				$("#chatWindows").html(data);
				myDropzone.options.url = domainUrlApi+"upload.php?messageTo="+dialog_instance_node_id;
				setTimeout(function() {
						$('.online_users.active .notif_count_box').addClass('hide');
						$('.online_users.active .notification-count').text(0);
				 }, 500);
			} else {
				$('.chat_wrapper.active .message_box').prepend(data);
				$(".nano").nanoScroller();
			}
		},
		complete: function() {
			if(action=='addActor'|| action=='removeActor' || action=='updateDialogTitle' ) {
				$(".right-bar-tab.ref_add_right_tab").css("display","none");
				$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
				changeDialogueTitle($('.online_users:first'));
				$(".ref-min-center-dialogue .rename-title-mini .dialog-tilte-node-id").removeClass('hide');
				$(".ref-min-center-dialogue .rename-title-mini .title-icon").removeClass('hide');
				$(".ref-min-center-dialogue .rename-title-mini .rename-edit-cover-box").removeClass('hide');
				$('.default-view-tab').find('.angle-collapse-up').removeClass('hide');
				$('.online_users').removeClass('selected');
				$('.online_users:first').addClass('selected');
				divStructure(getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment);
	    	$('body').on('click','.append-top',function() {
			    var innerHt = $(".mini-dialogue-flyout").height();
			    var textareaHeight = $(".ref-textarea-HT").height();
			    $(".dialogue-section.ref-min-center-dialogue").height(innerHt);
			    $(".mini-type-textarea, .mini-type-textarea .ref-textarea-HT").height(67+"px");
			    var textAvilHght= $(".mini-type-textarea, .mini-type-textarea .ref-textarea-HT").height();
			    $(".mini-dialogue-flyout .ref-set-height").height(innerHt - ($(".right-bar-tab").height() + textAvilHght));
		    });
				$('.new_view_wrapper').hide();
				$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
				$(".tab-pane .ref-set-height").removeClass('hide');
			}
			setTimeout(function() {
				$('.mini-dialogue-flyout .dialogue-section .nano').nanoScroller();
				$('.mini-dialogue-flyout .dialogue-section .nano').nanoScroller({scrollBottom: 0});
			}, 2000);
			Dropzone.autoDiscover = false;
			$('img.dz-clickable').css("display","block");
		}
	});//end of ajax
}
//function to change the title
function changeDialogueTitle(obj) {
	var dialog_title = obj.find('.dialog-title').text();
	var dialogue_instance_node_id = obj.attr('id');
	var course_title  = obj.closest('.dialog-accordion').siblings('.panel-heading').find('.mini-course-title').text();
	$(".dialog-random-title").text(dialog_title);
	$(".dialog-tilte-node-id").text(dialogue_instance_node_id);
	$(".edit-dialog-random-title").val(dialog_title);
	$(".edit-dialog-random-title").data('id',obj.data('id'));
	//view mode
	var new_view_wrapper_ele = $('.new_view_wrapper');
	new_view_wrapper_ele.find('.existing_viewform_field .course-detail-title').text(course_title);
	new_view_wrapper_ele.find('.new_col_add_wrap .ref_add_title_id').text(dialogue_instance_node_id);
	new_view_wrapper_ele.find('.existing_viewform_field .dialogue-detail-title').text(dialog_title);
	new_view_wrapper_ele.find('.course_node_id').text(obj.find('.course-title').data('id'));
	new_view_wrapper_ele.find('.new_col_add_wrap .user-name-data').text(obj.find('.dialog-admin-email').val());
}


$(document).ready(function() {
 miniDialogueAddTitleBar(); // add-title-bar
 checkContextMenu(); // check context menu
	$(".cancel_dialogue_title").on("click", function(event) {
		$('.edit-rename-title-mini').addClass('hide');
		$('.rename-title-mini').removeClass('hide');
		$(".edit-dialog-random-title").val($(".dialog-random-title").text());
	});
	var iScrollPos = 0;
	$('.nano-content').scroll(function () {
		// var iCurScrollPos = $(this).scrollTop();
		// var matrix = $('.ref-min-center-dialogue .nano-slider').css('transform')
		// var scrollY = matrix.split(',')
		// parseInt(scrollY[5]);
		// if (iCurScrollPos =='0') {
		// 	var date_obj = $('.chat_wrapper.active .message_box .weekly:first').attr('id');
		// 	var dialog_instance_node_id = $('.chat_wrapper.active').data('id');
		// }
	});


});

// function to update dialogue title
function updateDialogTitle(obj) {
	objChatfn = false;

	var dialog_title = obj.siblings('span').find('.edit-dialog-random-title').val();
	$(".dialog-random-title").text(dialog_title);
	$('.online_users.active').find('.dialog-title').text(dialog_title);
	var course_instance_node_id = $('.panel-heading.panel_active').data('id');
	var dialog_instance_node_id = $('.chat_wrapper.active').data("id");
	if(dialog_title =='') {
		dialog_title = 'Untitled';
	}
	$('.mini-overlay-wrapper').removeClass('hide');
	var variable_data = {
		node_instance_property_id: obj.siblings('span').find('.edit-dialog-random-title').data('id'),
		dialog_title:dialog_title,
		dialog_instance_node_id: dialog_instance_node_id,
		course_instance_node_id: course_instance_node_id
	};
	JSON.stringify(variable_data);
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'variable_data':variable_data,'action':'chat','type':'saveDialogTitle','random':Math.random()},
		success: function(data) {
			if(data > 0) {
				$('.new_view_wrapper').find('.collapse_title_view').text(dialog_title);
				$('.new_view_wrapper').find('.collapse-input-field').val(dialog_title);
				$('.dialog-random-title').text(dialog_title);
				$(".save_dialogue_title").siblings('span').find('.edit-dialog-random-title').val(dialog_title);
				var groupMessage = $('.chat_wrapper.active').attr("data-group");
				var dialog_instance_node_id = $('.chat_wrapper.active').data("id");
				var user_node = $("#"+dialog_instance_node_id).find(".user-node-id").data('id');
				if(groupMessage==undefined) {
					groupMessage=0;
				}
				runTimeNotification(dialog_instance_node_id,dialog_title,groupMessage,'updateDialogTitle',user_node);
			}	else {
				$('.dialog-random-title').text(dialog_title);
				$('.mini-overlay-wrapper').addClass('hide');
			}
		}
	});//end of ajax
}

/**
 * Function to get all the actor of a dialogue from file
 */
function getAllDialogueActors(dialog_instance_node_id) {
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'dialog_instance_node_id':dialog_instance_node_id,'action':'chat','type':'getDialogActor','random':Math.random()},
		success: function(data) {
			$('.new_view_wrapper .email_input_field_ui').siblings('.participant_scroll_height_ui').html(data);
			$(".nano").nanoScroller();
		},
		complete: function() {
			var object_val = $('.new_view_wrapper .email_input_field_ui').siblings('.participant_scroll_height_ui').find('.old_user_list');
			var user_node_id ='';
			if(object_val.length) {
				object_val.each(function() {
					user_node_id += $(this).data('id')+',';
				});
				var user_instance_node_id  = setUserID +','+ user_node_id.replace(/,+$/,'');
				getUserList(user_instance_node_id,dialog_instance_node_id);
			} else {
				getUserList(setUserID,dialog_instance_node_id);
			}
		}
	});//end of ajax
}

$('body').on('keydown', '.edit-dialog-random-title', function(event) {
  var $keycode = (event.keyCode ? event.keyCode : event.which);
  if($keycode === 13 && !event.shiftKey) {
  	if($(this).siblings(".save_dialogue_title").hasClass('ref-hideTick')) {
  		$(".ref-hideTick.save_dialogue_title").trigger("click");
  	} else {
    	$('.edit-dialogue-span-box').siblings(".save_dialogue_title").trigger("click");
  	}
    event.preventDefault();
  }
});

$('body').on('keydown', '.save_enter_course, .save_enter_search, .save_enter_dialogue', function(event) {
  var $keycode = (event.keyCode ? event.keyCode : event.which);
  if($keycode===13 && !event.shiftKey) {
		$(".add-participants-list").trigger("click");
    event.preventDefault();
  }
});

var bodyEle = $('body');
var publishMiniDialogue = 'a.publish-minidialogue';
bodyEle.off('click', publishMiniDialogue).on('click', publishMiniDialogue, function() {
	console.log($(this).data('params'));
});
/**
 *Function to get the auto suggestion list of user who are not associated with dialogue
 */
 function getUserList(user_instance_node_id,dialog_instance_node_id) {
 	var variable_data = {
	 	user_instance_node_id:user_instance_node_id,
	 	dialog_instance_node_id:dialog_instance_node_id,
	 	add_type : 'New'
 	};
 	JSON.stringify(variable_data);
 	$.ajax({
 		url: domainUrlApi+'code.php',
 		type: 'post',
 		data: {'variable_data':variable_data,'action':'chat','type':'getAllUserList'},
 		dataType:'json',
 		success: function(data) {
 			if(data) {
 					if(dialog_instance_node_id) 				{
 						setResponseUserList(data);
 					} else {
 						responseUserList(data);
 					}
 				}
 			}
 		});
 }

/**
 * Function to remove the user in the file from which searching results comes out only.
 */
 function removeUserFromFile(dialog_instance_node_id,user_instance_node_id,obj) {
 		var course_instance_node_id = $('.panel-heading.panel_active').data('id');
 		var username = $(obj).closest('.old_user_list').find('.user-name-val').val().trim();

 		$('.loader-actor-box').removeClass('hide');
 		var user_node_id = '';
		$('.dilaog_actor_list').each(function() {
			user_node_id += $(this).data('id')+',';
		});
 		var admin_node_id = $('.participant_scroll_height_ui .admin-user-id').data('id');
 		user_node_id = admin_node_id+','+user_node_id.replace(/,+$/,'');
 		var dialog_data = {
	 		dialog_instance_node_id: dialog_instance_node_id,
	 		user_instance_node_id: user_instance_node_id,
	 		course_instance_node_id: course_instance_node_id,
	 		current_user_node_id:setUserID,
	 		total_users :user_node_id
 		};
 		JSON.stringify(dialog_data);
 		$.ajax({
 			url: domainUrlApi+'code.php',
 			type: 'post',
 			data: {'dialog_data':dialog_data,'action':'chat','type':'removeUserFromFile'},
 			success: function(data) {
 				if(data) {
					$(obj).closest('.old_user_list').remove();
						if(user_instance_node_id == setUserID) {
							var message = 'self';
						} else {
							 var message = username;
						}
						var groupMessage = $('.chat_wrapper.active').attr("data-group");
						if(groupMessage==undefined) {
							groupMessage=0;
						}
						var action = 'removeActor';
						var user_node = user_node_id;
						runTimeNotification(dialog_instance_node_id,message,groupMessage,action,user_node);
						$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
						$(".tab-pane .ref-set-height").removeClass('hide');
				}
 			},
 			complete: function(){
 				$('.loader-actor-box').addClass('hide');
 				$('.new_view_wrapper').hide();
 				getUserList(user_instance_node_id,dialog_instance_node_id);
 				$(".tab-pane .ref-set-height").removeClass('hide');
 			}
 		});
 }

$('body').on('keydown', '.add-new-participant', function(event) {
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if($keycode === 13 && !event.shiftKey) {
			saveNewActor();
      event.preventDefault();
    }
});
function saveNewActor() {
	var getValue = $('.add_participant_user input').val();
	var getid = $('.add_participant_user input').data('id');
	if( (typeof getid !='undefined' && getid !='') && getValue!='') {
		var actor_temp = getValue.split('(');
		var get_user_name = actor_temp['0'];
		var htmlValue ="<div class='form-label part_id_block new_user_list dilaog_actor_list' data-id ='"+getid+"'  ><span class='ref_span_left'><i class='icon admin-user'></i> </span><span class='user-name-data'>"+getValue+"</span><input type='hidden' class='user-name-val' value='"+get_user_name+"'><span class='ui_close_icon_block close-participant-id'><i class='icon close'></i></span></div>";
		$('.new_view_wrapper .email_input_field_ui').siblings('.participant_scroll_height_ui').prepend(htmlValue);
		$('.add_participant_user input').val('');
		$('.add_participant_user input').data('id','');
	}
	var dialog_instance_node_id = $('.online_users.selected').attr('id');
	var user_instance_node_id = '';
	$('.dilaog_actor_list').each(function() {
  	user_instance_node_id += $(this).data('id')+',';
  });
	var new_user_count = $('.new_user_list').length;
	$('.close-actor-dialogue').trigger('click');
	var course_instance_node_id = $('.panel-heading.panel_active').data('id');
	var user_instance_name = $('.participant_scroll_height_ui .new_user_list .user-name-val').val().trim();
	var dialog_data = {
		dialog_instance_node_id: dialog_instance_node_id,
		user_instance_node_id: user_instance_node_id,
		course_instance_node_id: course_instance_node_id,
		current_user_node_id:setUserID
	};
	JSON.stringify(dialog_data);
	if(new_user_count>0) {
		$('.mini-overlay-wrapper').removeClass('hide');
		$.ajax({
			url: domainUrlApi+'code.php',
			type: 'post',
			data: {'dialog_data':dialog_data,'action':'chat','type':'saveNewActor'},
			success: function(data) {
				if(new_user_count > 0) {
					//get all the user added
					var admin_node_id = $('.participant_scroll_height_ui .admin-user-id').data('id');
					user_node_id = user_instance_node_id + admin_node_id;
					var message = setUsername+', '+ user_instance_name;
					runTimeNotification(dialog_instance_node_id,message,1,'addActor',user_node_id);
					$('.new_view_wrapper').hide();
				}
			},
			complete: function() {
				$('.mini-overlay-wrapper').addClass('hide');
				$(".tab-pane .ref-set-height").removeClass('hide');
			}
		});
	}
	//trigger clicked expand collapsed
	if($('.mini-dialogue-flyout .mini-type-textarea .append-top').length) {
		$('.mini-dialogue-flyout .expand-collapse-box:visible').trigger('click');
	}
}

/**
 * Function for handling run time notification of adding user as well as removing
 */
function runTimeNotification(messageTo,mymessage,groupMessage,action,user_node,random_id) {
	var msg = {
		message: mymessage,
		sender: setUserID,
		messageto: messageTo,
		username:setUsername,
		timestamp :getTime(),
		isGroupMessage:groupMessage,
		action:action,
		user_node:user_node,
		random_id:random_id,
	};
	//console.log(msg);
	websocket.send(JSON.stringify(msg));
}


$('body').on('click','.suggestion_value',function() {
	var _this = $(this);
	$('.add_actor').val(_this.text());
	$('.add_actor').data('id',_this.data('id'));
	$('.Add-more-user').find('.suggestresult').html('');
	$('.autodropdown').addClass('hide');
	$('.actor_adding_class').addClass('add-participants-list');
});
/**
 * Function for ucwords
 */
function ucwords(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// code for right click context menu
function MiniDialogueContextMenu() {
 // left online user right click
 var $classcontextMenubar = $('#viewCourseContextMenu');
 $('.mini-drp .right-drp').on("contextmenu", function(e) {
    $classcontextMenubar.css({
        display: "block",
        left: e.pageX,
        top: e.pageY
    });
    return false;
  });
  $('.right-context').on('update',function() {
      $('#viewCourseContextMenu').hide();
  });
  $classcontextMenubar.on("click","a",function() {
      $('#viewCourseContextMenu').hide();
  });
  $('body').click(function() {
      $('#viewCourseContextMenu').hide();
  });
  $(window).scroll(function() {
      $('#viewCourseContextMenu').hide();
  });
	$('.mini-set-height').on('update',function() {
    $('#viewCourseContextMenu').hide();
  });
  // main description chat right click
  var $paraViewContextMenu = $('#descCourseContextMenu');
  $('body').on("contextmenu",'.desc_drop', function(e) {
		var node_instance_id  = $(this).data('instance_id');
		$paraViewContextMenu.find('.delete-statement').data('id', node_instance_id);
		$paraViewContextMenu.find('.edit-statement').data('id', node_instance_id);
    $paraViewContextMenu.css({
      display: "block",
      left: e.pageX,
      top: e.pageY
    });
    checkContextMenu();
    return false;
  });
	// image right click
  var $imgViewContextMenu = $('#imgContextMenu');
  $('body').on("contextmenu",'.atch-img-border, .anchor-box', function(e) {
		var node_instance_id  = $(this).closest('.common-class').data('instance_id');
		$imgViewContextMenu.find('.delete-statement').data('id', node_instance_id);
	  $imgViewContextMenu.css({
	      display: "block",
	      left: e.pageX,
	      top: e.pageY
	  });
	  checkContextMenu();
	  return false;
  });

  $('.message_box').on('update',function() {
      $('#descCourseContextMenu').hide();
  });
  $paraViewContextMenu.on("click","a",function() {
      $('#descCourseContextMenu').hide();
  });
  $('body').click(function(){
      $('#descCourseContextMenu').hide();
  });
  $('.ref_top_chat_box .ref-set-height').on('update',function() {
      $('#descCourseContextMenu').hide();
  });
	$(window).scroll(function() {
      $('#descCourseContextMenu').hide();
  });

  $('.message_box').on('update',function() {
      $('#imgContextMenu').hide();
  });
  $imgViewContextMenu.on("click","a",function() {
      $('#imgContextMenu').hide();
  });
  $('body').click(function() {
      $('#imgContextMenu').hide();
  });
  $('.ref_top_chat_box .ref-set-height, .mini-type-textarea').on('update',function() {
      $('#imgContextMenu').hide();
  });
  $(window).scroll(function() {
      $('#imgContextMenu').hide();
  });
}
 // miniDialogueAddTitleBar for add title-bar
function miniDialogueAddTitleBar() {
    $("body").on('click', '.ref_hide_top_arrow i', function() {
    	$(".ref_hide_top_arrow i.mini_arrow_up").addClass('angle-rotate-down');
    	$(".ref_add_right_tab").hide();
			$(".collapsed_dialogue").show();
			$('.select-drop-existing').html('Existing');
    });
    $("body").on('click', '.collapse_title_view', function() {
	    $(".mini_arrow_up.angle-collapse-up").addClass("abc");
    	$("input.collapse-input-field").removeClass('hide');
    	$(".ref-hideTick").removeClass('hide');
    	$(".collapse_title_view").hide();
    	$(".ref_mini_drop_box.show_collapse_title_view").removeClass('hide');
    	$(".ref_mini_drop_box.hide_collapsed_title").addClass('hide');
			$('.rename-title-mini').addClass('hide');
			$('.edit-rename-title-mini').removeClass('hide');
    });
    $("body").on('click', '.ref-hideTick', function() {
    	$("input.collapse-input-field").addClass('hide');
    	$(".ref-hideTick").addClass('hide');
    	$(".collapse_title_view").show();
			$('.collapsed_dialogue .ref_mini_input_box .collapse_title_view').removeClass('hide');
	  	$(".ref_mini_drop_box.hide_collapsed_title").removeClass('hide');
	  	$(".ref_mini_drop_box.show_collapse_title_view").addClass('hide');
			$(".mini_arrow_up.angle-collapse-up").removeClass("abc");
			$('.rename-title-mini').removeClass('hide');
			$('.edit-rename-title-mini').addClass('hide');
    });

    // Change field while changing new and existing
    $("body").on('click', '.select-end-user-role li a' , function() {
		   if($(this).html() == "Existing") {
		      $('.dropMenuCourse').html('Existing');
		      $('.existing_user_titlefield').show();
		      $('.new_user_titlefield').hide();
		      $('.part_id_block').remove();
		      $(".search-existing-course").focus();
		    } else {
				 $('.dropMenuCourse').html('New');
				 $('.existing_user_titlefield').hide();
		     $('.new_user_titlefield').show();
		     $('.part_id_block').remove();
		     $(".course_info").focus();
			}
	});

	$("body").on('click', '.participant-user-role li a' , function() {
		if($(this).html() == "Participant2") {
		    $('.participant').html('Participant2');
		    $(".user-search").focus();
		} else {
			$('.participant').html('Participant1');
			$(".user-search").focus();
		}
	});
	$("body").on('click', '.collapse_select_drop li a', function() {
	   if($(this).html() == "New") {
	      $('.select-drop-existing').html('New');
	   } else {
	     $('.select-drop-existing').html('Existing');
		}
	});
	$("body").on('click', '.angle-collapse-up' , function() {
    $("#add-text").focus();
    $(".mini-type-textarea").css("border-top","1px solid #dbdbdb");
		if($(this).hasClass('abc')) {
      $(".ref_hide_top_arrow i.mini_arrow_up").addClass('angle-rotate-down');
      $(".right-bar-tab.new_view_wrapper").show();
      $(".ref-min-center-dialogue .right-bar-tab.default-view-tab").hide();
      $(".collapsed_dialogue .ref_top_head_box1").css("display","block");
      $(".ref_mini_drop_box.show_collapse_title_view").removeClass('hide');
      $("input.collapse-input-field").removeClass('hide');
      $(".ref-hideTick").removeClass('hide');
			$('.collapsed_dialogue .ref_mini_drop_box.hide_collapsed_title').addClass('hide');
			$('.collapsed_dialogue .ref_mini_input_box .collapse_title_view').addClass('hide');
			$(".mini-type-textarea").css("margin-top",0+"px");
		} else {
	    $(".collapsed_dialogue").show();
		 	$(".add_participant_user .existing-user-search").focus();
		 	$(".tab-pane .ref-set-height").addClass('hide');
	    $(".collapsed_dialogue .ref_hide_top_arrow i.mini_arrow_up").addClass('angle-rotate-down');
	    $(".collapsed_dialogue .ref_top_head_box1").show();
	    $(".ref_top_chat_box .nano .nano-pane").css("display","none");
			$('.collapsed_dialogue .ref_mini_drop_box.hide_collapsed_title').removeClass('hide');
			$('.collapsed_dialogue .ref_mini_input_box .collapse_title_view').removeClass('hide');
			$('.collapsed_dialogue .ref_mini_input_box .collapse_title_view').show();
			$(".ref_mini_drop_box.show_collapse_title_view").addClass('hide');
			$(".ref_hover_show_edit .collapse-input-field").addClass('hide');
			$(".ref_mini_input_box .save_dialogue_title").addClass('hide');
			if($(".expand-collapse-box").hasClass("append-top")) {
				if($(".right-bar-tab.collapsed_dialogue").is(":visible")) {
					$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").hide();
					var innerHt = $(".mini-dialogue-flyout").height();
					var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab").last(":visible").outerHeight();
					var totalHght1 = innerHt - rightTabHghtM;
					$(".mini-type-textarea").css({"height": totalHght1 , "border-top":"none"});
				}
				$("body").on("click",".online_users", function(event) {
					$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
					var innerHt = $(".mini-dialogue-flyout").height();
					var rightTabHghtOnline = $(".ref-min-center-dialogue .right-bar-tab").outerHeight();
					var totalHghtOnline = innerHt - rightTabHghtOnline;
					$(".mini-type-textarea, .mini-dialogue-flyout .ref-textarea-HT").css({"height": totalHghtOnline , "border-top":"none"});
				});
			} else if($(".expand-collapse-box").hasClass("expanded-box")) {
				$("body").on("click", ".expanded-box", function() {
					if($(".right-bar-tab.collapsed_dialogue").is(":visible")) {
						$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").hide();
		      	var innerHt = $(".mini-dialogue-flyout").height();
						var rightTabHghtw = $(".ref-min-center-dialogue .right-bar-tab").last(":visible").outerHeight();
						var totalHght2 = innerHt - rightTabHghtw;
						$(".mini-type-textarea").css({"height": totalHght2 , "border-top":"none"});
					}
				});
			} else {
				$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
				$(".tab-pane .ref-set-height").removeClass('hide');
			}
			getAllDialogueActors($('.online_users.selected').attr('id'));
    }
	});
	$("body").on('click', '.collapsed_dialogue .angle-rotate-down' , function() {
		$("#add-text").focus();
		$(".collapsed_dialogue").hide();
		$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
		$(".tab-pane .ref-set-height").removeClass('hide');
		$(".ref_top_chat_box .nano .nano-pane").css("display","block");
		$(".mini-type-textarea").css("border-top","1px solid #dbdbdb");
		var innerHt = $(".mini-dialogue-flyout").height();
		var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab:visible").outerHeight();
		var totalHghtM = innerHt - rightTabHghtM;
		if($(".expand-collapse-box").hasClass("append-top")) {
			$(".mini-type-textarea").css({"height": totalHghtM , "border-top":"none"});
		} else if($(".expand-collapse-box").hasClass("expanded-box")) {
			$("body").on("click", ".expanded-box", function() {
 				$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
      	var innerHt = $(".mini-dialogue-flyout").height();
				var rightTabHghtw = $(".ref-min-center-dialogue .right-bar-tab").first(":visible").outerHeight();
				var totalHght2 = innerHt - rightTabHghtw;
				$(".mini-type-textarea").css({"height": totalHght2 , "border-top":"none"});
      });
		}
  });

  $("body").on('keyup', '.mini-type-textarea #add-text' , function() {
		$(".collapsed_dialogue").hide();
		$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
		$(".tab-pane .ref-set-height").removeClass('hide');
		var innerHt = $(".mini-dialogue-flyout").height();
		var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab:visible").outerHeight();
		var totalHghtM = innerHt - rightTabHghtM;
		if($(".expand-collapse-box").hasClass("append-top")) {
			$(".mini-type-textarea").css({"height": totalHghtM});
		}
  });
}
// All dialogue related

/**
 * Function to save the new course as well as dialogue
 */
 function saveNewCourse(user_instance_node_id,other_user_name,user_count) {
 	$("#add-text").blur();
 	var node_type = $('.new_untitled_wrap').find('.dropMenuCourse').text();
 	if(node_type =='New') {
 		var course_value =  $('.new_untitled_wrap .course-new-drop').find('.course_info').val();
 		var dialogue_instance_node_id =  '';
 		var course_title = $('.new_untitled_wrap .course-new-drop').find('.course_info').val();
 		var dialogue_title 	=  	$('.new_untitled_wrap .ref_mini_input_box').find('.dialogue_info').val();
 	} else {
 		var course_value =  $('.new_untitled_wrap .existing_user_titlefield').find('.course_info').data('id');
 		var dialogue_instance_node_id =  $('.new_untitled_wrap .new_add_wrap').find('.ref_add_title_id').text();
 		var course_title = $('.new_untitled_wrap .existing_user_titlefield').find('.course_info').val();
 		MiniDialogueContextMenu();
 		var dialogue_title 	=  	$('.new_untitled_wrap .existing_user_titlefield').find('.dialogue_info').val();
 	}
 	var dialog_data = {
	 	course_value: course_value,
	 	dialogue_title: dialogue_title,
	 	dialogue_instance_node_id: dialogue_instance_node_id,
	 	course_title:course_title,
	 	save_type:node_type,
	 	creator_instance_node_id:setUserID,
	 	user_instance_node_id:user_instance_node_id,
	 	user_name :setUsername,
	 	other_user_name: other_user_name
 	};
 	JSON.stringify(dialog_data);
 	if(course_value!='' && course_value != undefined) {
 		$('.save_course_detail').attr('disabled', 'disabled');
 		$('.new_untitled_wrap .course-new-drop').find('.course_req').addClass('hide');
 		$(".new_untitled_wrap .course_info").removeClass('required_border');
 		$('.new_untitled_wrap').find('.course_req').addClass('hide');
 		$('.mini-overlay-wrapper').removeClass('hide');
 		$.ajax({
 			url: domainUrlApi+'code.php',
 			type: 'post',
 			data: {'dialog_data':dialog_data,'action':'chat','type':'saveNewDialog'},
 			success: function(data) {
	 			if(data) {
	 				$('.new_untitled_wrap .course-new-drop').find('.course_info').val('');
	 				$('.new_untitled_wrap .existing-search').find('.course_info').data('');
	 				$('.new_untitled_wrap .existing-search').find('.course_info').val('');
	 				$('.new_untitled_wrap .ref_mini_input_box').find('.dialogue_info').val('');
	 				$('.new_untitled_wrap .existing_user_titlefield').find('.dialogue_info').val('')
	 				$('.ref_add_new_title_bar').replaceWith(data);
	 				$(".ref_top_head_box").hide();
	 				$('.new_user_list').remove();
	 			}
 			},
 			complete: function() {
				$("#add-text").focus();
				$('.mini-overlay-wrapper').addClass('hide');
				$(".right-bar-tab.ref_add_right_tab").css("display","none");
				$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
				if($(".right-bar-tab.default-view-tab").css("display","block")) {
					$(".expand-collapse-box").click(function() {
						$(".mini-type-textarea").css("margin-top",0+"px")
					});
				}
				MiniDialogueContextMenu();
				$(".ref-textarea-HT textarea").height('');
				var innerHt = $(".mini-dialogue-flyout").height();
        var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab:visible").outerHeight();
        var totalHghtM = innerHt - rightTabHghtM;
        if($(".expand-collapse-box").hasClass("append-top")) {
           $(".mini-type-textarea").css({"height": totalHghtM , "border-top":"none"});
        }
				var user_instance_name = other_user_name;
				var dialog_instance_node_id = $('.online_users.selected').attr("id");
				var user_node_id = user_instance_node_id;
				var message = other_user_name;
				var groupMessage = 1;
				var action = 'addActor';
				var user_node = user_node_id;
				runTimeNotification(dialog_instance_node_id,message,groupMessage,action,user_node);
				$('.new_view_wrapper').hide();
				$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
				$(".tab-pane .ref-set-height").removeClass('hide');
			}
 		});
 	} else {
 		$('.new_untitled_wrap').find('.course_req').removeClass('hide');
 		$(".ref_add_right_tab .course_info").addClass('required_border');
 	}
 }
//search all the courses of logged in user on the basis of course title
function searchCourseByTitle() {
	var search_data = {
		user_instance_node_id:setUserID
	};
	JSON.stringify(search_data);
	$.ajax({
			url: domainUrlApi+'code.php',
			type: 'post',
			data: {'search_data':search_data,'action':'chat','type':'searchCourseByTitle'},
			'dataType':'json',
			success: function(data) {
			if(data) {
				responseCourseTitle(data);
			}
		}
	});
}

var courseTitle = [];
function responseCourseTitle(data,source) {
	courseTitle = [];
	$.each(data, function (index, user) {
		courseTitle.push({"key":user['course_instance_node_id'],"value":user['course_title']});
	});
	$('.search-existing-course').autocomplete({
	    lookup: courseTitle,
	    appendTo:'.addAutoCompleteBox',
	    onSelect: function (suggestion) {
        $(".search-existing-course").data('id',suggestion.key);
        $(".search-existing-course").val(suggestion.value);
	    }
	});
	$("body").on("click", ".pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions .autocomplete-suggestion", function() {
    $(".search-existing-course").focus();
  });
}
var userList = [];
function responseUserList(data,source) {
	userList = [];
	$.each(data, function (index, user) {
		userList.push({"key":user['user_instance_node_id'],"value":user['user_name']});
	});
 // setup autocomplete function pulling from participant[] array
	$('.user-search').autocomplete({
		lookup: userList,
		//appendTo:'.Add-more-participants',
		appendTo:'#add_participant_new_user',
		onSelect: function (suggestion) {
			  $(".user-search").data('id',suggestion.key);
			  $(".user-search").val(suggestion.value);
		}
	});
 	var autoSuggestDropdownWidth = $(".pu_plugin_mini_dialogue .autosuggest_dropdown_width").width();
 	$(".pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions").width(autoSuggestDropdownWidth);
	$('.pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions').niceScroll({
 		zindex:"auto",
 		cursorcolor: "#000",
    cursorborder: "0",
    cursorborderradius: '0',
    cursorwidth: "2px",
    background: 'rgba(0,0,0,.15)'
	});
	$("body").on("click", ".pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions .autocomplete-suggestion", function() {
      $(".user-search").focus();
  });
}
var userListdata = [];
function setResponseUserList(data,source) {
	userListdata = [];
	$.each(data, function (index, user) {
		userListdata.push({"key":user['user_instance_node_id'],"value":user['user_name']});
	});
 // setup autocomplete function pulling from participant[] array
	$('.add_participant_user .existing-user-search').autocomplete({
		lookup: userListdata,
		//appendTo:'.Add-more-participants',
		appendTo:'.add_participant_user',
		onSelect: function (suggestion) {
		  $(".add_participant_user .existing-user-search").data('id',suggestion.key);
		  $(".add_participant_user .existing-user-search").val(suggestion.value);
		}
	});
	var existingUserSearchWidth = $(".pu_plugin_mini_dialogue .existing-user-search").width();
 	$(".pu_plugin_mini_dialogue .add_participant_user .autocomplete-suggestions").width(existingUserSearchWidth);
	$('.pu_plugin_mini_dialogue .add_participant_user .autocomplete-suggestions').niceScroll({
 		zindex:"auto",
 		cursorcolor: "#000",
    cursorborder: "0",
    cursorborderradius: '0',
    cursorwidth: "2px",
    background: 'rgba(0,0,0,.15)'
	});
	$("body").on("click", ".pu_plugin_mini_dialogue .add_participant_user .autocomplete-suggestions .autocomplete-suggestion", function(){
    $(".existing-user-search").focus();
  });
}
$('body').on('click','.suggestion_course',function(e) {
	var name = $(this).text();
	var id  = $(this).data('id');
	$('.existing-search').find('.search-existing-course').val(name);
	$('.existing-search').find('.search-existing-course').data('id',id);
	$('.existing-search').find('.suggestresult').html('');
	$(".autodropdown.search_auto_drop").addClass("hide");
});

/*============== auto-complete-suggestion ================*/

$('body').on('keyup','.search-existing-course',function() {
  var serachWidth = $(".pu_plugin_mini_dialogue .search-existing-course").width();
  $('.pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions').width(serachWidth);
  $('.pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions').niceScroll({
 		cursorcolor: "#000",
    cursorborder: "0",
    cursorborderradius: '0',
    cursorwidth: "2px",
    background: 'rgba(0,0,0,.15)'
  });
});

/*============== auto-complete-suggestion ================*/
//function to get random id from database
function getRandomNodeId() {
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'action':'chat','type':'getRandomNodeId'},
		dataType:'json',
		success: function(data) {
			if(data) {
				$('.new_untitled_wrap .random_node_id').text(data);
			}
		}
	});
}

$('body').on('click', '.pop-out', function() {
  w_popout = window.open(domainUrlApi+"minidialog.php?type=openWindow&uid="+setUserID+"&uname="+setUsername+"", "PopupWindow", "width=820,height=400,scrollbars=yes,resizable=yes");
  $(".mini-dialogue-flyout").stop().animate();
  $(".mini-dialogue-flyout").addClass("popOutMiniDialogue").removeClass("opened");
	openCrossDomain = setInterval(function() {
		if(w_popout.closed) {
	     $(".mini-dialogue-flyout").removeClass("popOutMiniDialogue");
			 $(".pu_plugin_mini_chat").trigger("click");
			 clearInterval(openCrossDomain);
		}
	},1000);
});
$('body').on('click','.pop-in',function() {
  window.close();
});


$('body').on('click','.imranClose, .pop-out',function(e) {
		objChatfn = true;
    var chatWindow = $(".mini-dialogue-flyout").outerWidth();
		// remove the new added untitled div
		if($('.ref_add_new_title_bar').length!=0) {
			$(".ref_add_new_title_bar").remove();
			$('.panel-heading:first').addClass('panel_active');
			$('.online_users:first').trigger('click');
			$('.ref-min-right-dialogue .save_course_detail').hide();
			$('.ref_add_right_tab').hide();
			$(".ref-textarea-HT textarea").height('');
			if($(this).hasClass("pop-out")) {
				$(".mini-dialogue-flyout").css({
					"margin-right": -chatWindow-40
				}).removeClass("opened");
        MiniDialogueContextMenu();
				getAllDialogue();
				return false;
			}
			$('.mini_accordion_wrap .panel:nth-child(1) .dialog-accordion').addClass("in");
			if($(".mini_accordion_wrap .panel:nth-child(1) .base-container i").hasClass('fa-angle-up')) {
				$(".mini_accordion_wrap .panel:nth-child(1) .base-container i").removeClass('fa-angle-up').addClass('fa-angle-down');
			}
			$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
			if($('.panel-heading.panel_active').siblings('.dialog-accordion').find('.online_users').length!=0) {
				$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
				$(".tab-pane .ref-set-height").removeClass('hide');
			}
		} else {
			$(".mini-dialogue-flyout .sb-search-input-text").val("");
			if($(this).hasClass('imranClose')) {
		    $(".popOutMiniDialogue").removeClass("popOutMiniDialogue");
        $(".mini-dialogue-flyout").animate({
        	"margin-right": -chatWindow-40,
        }).removeClass("opened");
      	MiniDialogueContextMenu();
    	 	$(".mini-dialogue-flyout .sb-search").stop().animate({right:'-104%'}, 400);
        setTimeout(function(){
        	$(".mini-dialogue-flyout .sb-search").find('input').addClass('hide');
 				}, 100);
		   //reset width of minidialogue
		   var getResizeDialogueTotalWidth = $(".mini-dialogue-flyout").width();
		   $(".tabing-section, .right-dialogue-panel").css("width",230+"px");
		   $(".ref-min-right-dialogue").css("width", 60+"px");
       $(".ref-textarea-HT textarea").height('');
			} else {
				$(".mini-dialogue-flyout").css({
				"margin-right": -chatWindow-40
				}).removeClass("opened");
        MiniDialogueContextMenu();
				getAllDialogue();
			}
			$("#chatWindows").html('');
			$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
			$(".tab-pane .ref-set-height").removeClass('hide');
		}
		$('.course_info').data('id','');
		$('.course_info').val('');
		$('.dialogue_info').val('');
		$(".course-new-drop .course_info").focus();
		if($('.serch-fullWd .search-opened-mini').length!=0) {
			$(".mini-dialogue-flyout .search-opened-mini").trigger('click');
		}
		MiniDialogueContextMenu();
		var innerHt = $(".mini-dialogue-flyout").height();
		var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab:visible").outerHeight();
		var totalHghtM = innerHt - rightTabHghtM;
		if($(".expand-collapse-box").hasClass("append-top")){
			$(".mini-type-textarea").css({"height": totalHghtM , "border-top":"none"});
		}
});
	/*search course*/

jQuery("body").on("click", function(e) {
	var autoCompleClass = $(e.target).hasClass('autocomplete-suggestion') || $(e.target).hasClass('search-existing-course');
	var getId = $(".search-existing-course").data('id');
	if(!autoCompleClass && getId == undefined) {
		$('.search-existing-course').val('');
	}
});
$('.search-existing-course').on( "keydown", function( event ) {
	var getVal = $('.search-existing-course').val();
	if(getVal == '' || event.which == 8 || event.which == 46) {
		$(".search-existing-course").removeData('id');
	}
});
jQuery("body").on("click", function(e) {
	var autoCompleClass = $(e.target).hasClass('autocomplete-suggestion') || $(e.target).hasClass('user-search');
	var getId = $(".user-search").data('id');
	if(!autoCompleClass && getId == undefined) {
		$('.user-search').val('');
	}
});
$('.user-search').on( "keydown", function( event ) {
	var getVal = $('.user-search').val();
	if(getVal == '' || event.which == 8 || event.which == 46) {
		$(".user-search").removeData('id');
	}
});

function deleteStatement(obj) {
	var node_instance_id = $(obj).data('id');
	$('#confirmPopup').find('.confirm-delete').data('id',node_instance_id);
	if($('#confirmPopup').modal('show')) {
	   $("body").removeClass("modal-open");
	   $("body").find(".modal-backdrop").addClass("mini-confirm-backdrop");
	   $(".mini-overlay-white-wrapper.white-overlay").removeClass('hide').addClass('show');
     $("#confirmPopup .modal-footer .btn, #confirmPopup button.close").click(function() {
      	$(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
     });
	} else {
		$(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
	}
}
function deleteStatementConfirm(obj) {
	$('.mini-overlay-wrapper').removeClass('hide');
	var node_instance_id = $(obj).data('id');
	var dialog_instance_node_id = $('.chat_wrapper.active').data('id');
	var delete_data = {
		node_instance_id:node_instance_id,
		dialog_instance_node_id:dialog_instance_node_id
	};
	JSON.stringify(delete_data);

	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'action':'chat','type':'deleteStatement','delete_data':delete_data},
		success: function(data) {
			$('.mini-overlay-wrapper').addClass('hide');
			var groupMessage = $('.chat_wrapper.active').attr("data-group");
			if(groupMessage==undefined) {
				groupMessage=0;
			}
			var action = 'deleteMessage';
			var user_node = $("#"+dialog_instance_node_id).find(".user-node-id").data('id');
			var message = node_instance_id;
			runTimeNotification(dialog_instance_node_id,message,groupMessage,action,user_node);
		}
	});
}

function checkContextMenu() {
	$('body').on('mousedown', '.desc_drop', function() {
    if( $(this).closest('li').data('id') == setUserID) {
       $(this).addClass("desc_drop");
     } else {
      $(this).removeClass("desc_drop");
		  $('#descCourseContextMenu').hide();
   	}
	});
	$('body').on('mousedown', '.atch-img-border, .anchor-box', function() {
    if( $(this).closest('li').data('id') == setUserID){
       $(this).addClass("atch-img-border");
       $(this).addClass("anchor-box");
     } else {
      $(this).removeClass("atch-img-border");
      $(this).removeClass("anchor-box");
		  $('#imgContextMenu').hide();
     }
	});
}
$(window).on("focus", function (e) {
	pathname = window.location.pathname;
	var count_number = document.title;
});

function searchDialogDetail() {
	var search_string = $('.sb-search-input-text').val();
	var dialog_data = {
		user_instance_node_id:setUserID,
		search_string:search_string
	};
	JSON.stringify(dialog_data);
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'action':'chat','type':'searchDialogDetail','dialog_data':dialog_data},
		success: function(data) {
		$("#accordion").html(data);
		$('.online_users:first').addClass('selected');
		MiniDialogueContextMenu();
		var text = search_string;
		// escaping string for use in regex
		text = text.replace(/\s\s+/g, ' ');
		text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		var re = new RegExp(text, 'gi');
		 $("#accordion .highlight_class").each(function () {
			// if no text input clear out previous .highlight spans
			if(!text) {
				$(this).html($(this).text());
				return;
			}
			// if match for regex insert .highlight class
			$(this).html($(this).text().replace(re, function(match) {
				return '<span class="highlight">'+ match   +'</span>';
			}));
		});
		}
	});
}

$('body').on('keydown', '.sb-search-input-text', function(event) {
  var $keycode = (event.keyCode ? event.keyCode : event.which);
  if($keycode===13 && !event.shiftKey) {
		searchDialogDetail();
    event.preventDefault();
  }
});
$('body').on('click', '.search-course-dialog', function(event) {
	$(this).siblings('.dialog-accordion').find('ul .online_users:first').trigger('click');
	$('.panel-heading').removeClass('panel_active');
	$(this).addClass('panel_active');
});

/**
 * Function to remove Notification Count
 */
function deleteNotification(dialog_instance_node_id,user_instance_node_id) {
	var dialog_data = {
		user_instance_node_id:user_instance_node_id,
		dialog_instance_node_id:dialog_instance_node_id
	};
	JSON.stringify(dialog_data);
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'action':'chat','type':'deleteNotification','dialog_data':dialog_data}
	});
}


/**
 * Function to remove Count
  * NOT IN USE
 */
function deleteDilaogue(obj ,dialog_instance_node_id,user_instance_node_id) {
	var dialog_data = {
		user_instance_node_id:user_instance_node_id,
		dialog_instance_node_id:dialog_instance_node_id
	};
	JSON.stringify(dialog_data);
}
/**
 * Function to get All the user list of actors
 * NOT IN USE
 */
function getAllSystemActor() {
	var dialog_data = {
		user_instance_node_id:setUserID
	};
	$.ajax({
		url: domainUrlApi+'code.php',
		type: 'post',
		data: {'action':'chat','type':'getAllSystemActor','dialog_data':dialog_data}
	});
}


function getAllCourse(setUserID,event,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment) {
	if($('.mini-dialogue-flyout.opened').length!='1' && event !='true') {
		if(w_popout==undefined) {
			$('.loader-box').show();
		} else if(w_popout.closed) {
			$('.loader-box').show();
		}
		var user_instance_node_id = $('#node_id').val();
		var variable_data = {
			user_instance_node_id:user_instance_node_id
		};
		$.ajax({
			url: domainUrlApi+'code.php',
			type: 'post',
			data: {'action':'chat','type':'getAllCourse','variable_data':variable_data},
			success: function(data) {
				if(data!=0) {
					$("#accordion").html(data);
					$('.panel-heading:first').addClass('panel_active');
					$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
					$("#add-text").focus();
				} else {
					$("#accordion").html('');
					$(".mini-type-textarea .animate-div").addClass("manage-opacity");
					$("#add-text").blur();
				}
				manageRightHeader('hide');
				$('.loader-box').hide();
				$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
				$('img.dz-clickable').css("display","block");
				$(".mini-type-textarea").css("display","block");
			},
			complete: function() {
				$('.mini_accordion_wrap .panel-heading:first a').trigger('click');
				var dialog_instance_node_id = $('.online_users:first').attr('id');
				setTimeout(function() {
				 if($('.panel-heading.panel_active').siblings('.dialog-accordion').find('.online_users').length==0) {
						$(".mini-type-textarea .animate-div").addClass("manage-opacity");
						$("#add-text").blur();
					}
				}, 1000);
				if(w_popout == undefined) {
					$('.mini-dialogue-flyout').animate({
						"margin-right":"0"
					},function() {
						if(objChatfn) {
							chatWidthHeight();
							objChatfn = false;
						}
					}).addClass("opened");
				} else if(w_popout.closed) {
					$('.mini-dialogue-flyout').animate({
						"margin-right":"0"
					},function() {
						if(objChatfn) {
							chatWidthHeight();
							objChatfn = false;
						}
					}).addClass("opened");
				} else {
					$('.mini-dialogue-flyout').removeClass("opened");
				}
				if($('.mini-dialogue-flyout.opened .textarea-icon-wrap .expand-collapse-box').hasClass('append-top')) {
					var innerHt = $(".mini-dialogue-flyout").height();
					var textAvilHT = $(".mini-type-textarea").height();
					$("#add-text").focus();
					$('.append-top').trigger('click')
					$(".ref-set-height").height( - ($(".right-bar-tab").height() + textAvilHT));
				}
				$("#add-text").focus();
				miniDialogue();
				$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
				$('img.dz-clickable').css("display","block");
				$('#add-text').focus();
				renameTitleMiniDialogue();
				MiniDialogueContextMenu();
				miniDialogueResizeShrink();
				$(".mini-set-height.nano").nanoScroller();
			}
	});//end of ajax
} else if(event =='true' && $('.mini-dialogue-flyout.opened').length=='1') {
		var user_instance_node_id = setUserID;
		var variable_data = {
			user_instance_node_id:user_instance_node_id
		};
		$.ajax({
			url: domainUrlApi+'code.php',
			type: 'post',
			data: {'action':'chat','type':'getAllCourse','variable_data':variable_data},
			success: function(data) {
				if(data!=0) {
					$("#accordion").html(data);
					$('.panel-heading:first').addClass('panel_active');
    			$('.mini_accordion_wrap .panel:first .dialog-accordion').addClass("in");
			    manageRightHeader('hide');
					$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
				} else {
					$("#accordion").html('');
				}
				$('.loader-box').hide();
				$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
				$('img.dz-clickable').css("display","block");
				$(".mini-type-textarea").css("display","block");
			},
			complete: function() {
				var date_obj ='';
				getAllDialogue($('.panel-heading:first'),setUserID,event,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment);
				var dialog_instance_node_id = $('.online_users:first').attr('id');
				if(w_popout==undefined) {
					$('.mini-dialogue-flyout').animate({
						"margin-right":"0"
					},function(){
						if(objChatfn){
							chatWidthHeight();
							objChatfn = false;
						}
					}).addClass("opened");
				} else if(w_popout.closed) {
					$('.mini-dialogue-flyout').animate({
						"margin-right":"0"
					},function(){
						if(objChatfn){
							chatWidthHeight();
							objChatfn = false;
						}
					}).addClass("opened");
				} else {
					$('.mini-dialogue-flyout').removeClass("opened");
				}
				MiniDialogueContextMenu();
			}
		});//end of ajax
	}
	messageBoxImgPaste('#chatMsgBox', '#add-text', 'divEditableChat');
	$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
}
function getAllDialogue(obj,setUserID,event,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment) {
	var user_instance_node_id = $('#node_id').val();
	var course_instance_node_id = $(obj).closest('.panel-heading').data('id');
	var acc_count = $(obj).closest('.panel-heading').data('count');
	var variable_data = {
		user_instance_node_id:user_instance_node_id,
		course_instance_node_id:course_instance_node_id,
		acc_count:acc_count
	};
	$('.panel-heading').removeClass('panel_active');
	$(obj).addClass('panel_active');
	manageRightHeader('hide');
	$("#chatWindows").html('');
	$(obj).removeClass('notification-color');
	if($('.ref_add_new_title_bar').length!=0) {
		$(".ref_add_new_title_bar").remove();
	}
	var result = '';
	setTimeout(function() {
	if($('.panel-heading.panel_active').siblings('.dialog-accordion').find('.online_users').length==0) {
			$(".mini-type-textarea .animate-div").addClass("manage-opacity");
			$("#add-text").blur();
		}
	}, 1000);
	$.ajax({
			url: domainUrlApi+'code.php',
			type: 'post',
			data: {'variable_data':variable_data,'action':'chat','type':'getDialog','random':Math.random()},
			success: function(data) {
				if(data!=0) {
					$(obj).siblings('.dialog-accordion').find('ul').html(data);
					result =  '1';
					$(".mini-type-textarea .animate-div").removeClass("manage-opacity");
				} else {
					$(obj).siblings('.dialog-accordion').find('ul').html('');
					result =  '0';
				}
				$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
				$('img.dz-clickable').css("display","block");
				$(".mini-type-textarea").css("display","block");
			},
			complete: function() {
					if(result!='0') {
					var dialog_instance_node_id = $('.online_users:first').attr('id');
					if(event=='true') {
						var date_obj ='';
						getStatement(dialog_instance_node_id,date_obj,getToMessage,uname,datetime,umsg,timestamp,fromUser,action,getAttachment);
					} else {
						$(obj).siblings('.dialog-accordion').find('ul .online_users:first').trigger('click');
					}
					$("#add-text").focus();
					//miniDialogue();
					$('.mini-type-textarea .textarea-icon-wrap').css("display","block");
					$('img.dz-clickable').css("display","block");
					$('#add-text').focus();
					renameTitleMiniDialogue();
					MiniDialogueContextMenu();
					miniDialogueResizeShrink();
					$(".mini-set-height.nano").nanoScroller();
					}
				}
			});//end of ajax
	messageBoxImgPaste('#chatMsgBox', '#add-text', 'divEditableChat');
	$(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
	$(".right_bar_tab_new_ui").hide();
}

function manageRightHeader(class_type) {
	$(".ref-min-center-dialogue .rename-title-mini .dialog-tilte-node-id").addClass(class_type);
	$(".ref-min-center-dialogue .rename-title-mini .title-icon").addClass(class_type);
	$(".ref-min-center-dialogue .rename-title-mini .rename-edit-cover-box").addClass(class_type);
	$('.default-view-tab').find('.angle-collapse-up').addClass(class_type);
}

function editStatement(obj) {
	var node_instance_id = $(obj).data('id');
	var dialog_instance_node_id = $('.chat_wrapper.active').data('id');
	//alert(node_instance_id);
	var delete_data = {
		node_instance_id:node_instance_id,
		dialog_instance_node_id:dialog_instance_node_id
	};
	JSON.stringify(delete_data);
	var text_data = $('.desc_drop.'+node_instance_id+'').text();
	$('#add-text').val(text_data.trim());
	$('#add-text').data('id',node_instance_id);
	$('#add-text').addClass('edited-statement');
}


function toggleAddCourseSection(toggle_btn, params) {
	//alert("ajjdh dhsjd hsjh ");
	var toggleBtn = toggle_btn,
		container = toggleBtn.closest('.block-head'),
		elements = container.find('.chat-toggle');
	var edtHeaderDocWrap = container.closest('.display-wrapper').find('.edtHeader.doc-wrap'); // editor's toolbar
	if(toggleBtn.hasClass('collapse-down')) {
		elements.addClass('hide');
		toggleBtn.removeClass('collapse-down').addClass('collapse-up');
		//edtHeaderDocWrap.removeClass('hide'); // show editor's tool bar
	} else {
		elements.removeClass('hide');
		toggleBtn.addClass('collapse-down').removeClass('collapse-up');
		//edtHeaderDocWrap.addClass('hide'); // hide editor's tool bar
	}
	$("#react-toggleRecipientBtn").trigger('click');
	if(typeof params == 'undefined') { // when called by using 'trigger' then do not focus the input
			container.find("#course-title-value").focus();
	}

}
