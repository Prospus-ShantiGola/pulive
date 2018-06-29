var w_popout_course;
objChatfnCourse = true;

var ChatdialogueModule = (function() {
  var options = {
    publishBtn: '.course-dialogue-publish',
    saveAsDraftBtn: '.course-dialogue-draft'
  };

  window.ind_participant = [];
  window.mydummyParticipantObj = [];

  function responseIndividualParticipant(data,source) {
      window.getAllUsersList = data;
    if ($('.auto-suggest').data('autocomplete')) {
      $('.auto-suggest').autocomplete("destroy");
      $('.auto-suggest').removeData('autocomplete');
    }
    var counter = 0;
    $.each(data, function (index, user) {
        if(parseInt(user['node_id']) > 0)
        counter++;
    });
    var user_recepient_node_id = [];
    $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function(e) {
        user_recepient_node_id.push($(this).val());
    });
    if(parseInt(counter) > 0) {
        ind_participant=[];
        $.each(data, function (index, user) {
            if(user_recepient_node_id.indexOf(user['node_id']) == -1) {
                var initinal_name = 'N/A';
                var fName = '', lName = '';
                if(user['first_name']) {
                    fName = user['first_name'].charAt(0);
                }
                if(user['last_name']) {
                    lName = user['last_name'].charAt(0);
                }
                initinal_name =  fName + lName;
                ind_participant.push({"key":user['node_id'],"value":user['email_address'],'userFullName' : user['first_name'] + ' ' + user['last_name'], userProfileImage : user['profile_image'], 'userInitialName' : initinal_name.toUpperCase()});
            }
        });
        var autoCompleteElement = $('.auto-suggest');
        if(autoCompleteElement.length) {
            autoCompleteElement.autocomplete({
                appendTo: "#individualAutoCompleteBox",
                lookup: ind_participant,
                width: '80%',
                onSelect: function (suggestion) {
                    setTimeout(function() {
                        autoCompleteOnSelect(suggestion);
                        ChatdialogueModule.addParticipants();
                    });
                },
                forceFixPosition: 'auto',
                orientation: 'bottom'
            });
            autoCompleteElement.off('keydown.custom').bind("keydown.custom", function(e) {
                var $this = $(this), widgetData, matcher;
                if (e.which === $.ui.keyCode.ENTER || e.which == $.ui.keyCode.NUMPAD_ENTER) {
                    if (!$this.data("selected")) {
                        addNewUser($this.val());
                    } else {
                        console.log('existing');
                    }
                } else {
                    $this.data("selected", false);
                }
            });
        }
    }
    globalNewDialog = 0;
  }
  function _init() {

    var body = $('body');
    body.on('click','.individual-get-list', function() {
      if($("#is_individual_list").val() == '') {
          $.post(domainUrl+'menudashboard/getAllUsers',{},responseIndividualParticipant,'json');
          $("#is_individual_list").val('Y');
      }
    });
    body.on('click','.course-delete-statement',function() {
  		ChatdialogueModule.courseDeleteStatement($(this));
  	});
  	body.on('click','.confirm-course-delete',function() {
  		ChatdialogueModule.confirmCourseDelete($(this));
  	});
  	body.off('click','.img-delete-statement').on('click','.img-delete-statement' ,function() {
  		ChatdialogueModule.imgDeleteStatement($(this));
  	});
  	body.off('click','.confirm-img-statement').on('click','.confirm-img-statement',function() {
  		ChatdialogueModule.confirmImgStatement($(this));
  	});
  	/* open modal for letter mode and delete letter statement*/
  	body.off('click','.letter-img-delete-statement').on('click','.letter-img-delete-statement' ,function() {
  			ChatdialogueModule.letterImgDeleteStatement($(this));
  	});
  	body.off('click','.confirm-letter-img-statement').on('click','.confirm-letter-img-statement',function() {
  		ChatdialogueModule.confirmLetterImgStatement($(this));
  	});
  	/* end letter mode here*/
  	body.on('click','.letter-delete-statement',function() {
  		ChatdialogueModule.letterDeleteStatement($(this));
  	});
  	body.on('click','.confirm-remove-btn',function() {
  			ChatdialogueModule.confirmRemoveBtn($(this));
  	});
  	body.on('click','.letter-edit-statement',function() {
  			ChatdialogueModule.letterEditStatement($(this));
  	});
    /* code here to save course , dialogue and actor and statement*/
  	body.on('click','#course-dialogue-publish',function() {
  		ChatdialogueModule.publishDialogueChat();
  	});

  	/* code here for update dialogue title using socket   */
  	body.on('click','.save_edit_dialogue',function()	{
  			ChatdialogueModule.saveEditDialogue();
  	});

  	/* code here for update course title using socket   */
  	body.on('click','.save_edit_course, .edit_update_course',function() {
  		ChatdialogueModule.saveEditCourse();

  	});
    body.on('click','.chat-edit-statement',function() {
        ChatdialogueModule.chatEditStatement($(this));
    });
  }

  function getMessage(documentType) {
    var mymessage = '';
    if(documentType == "Letter") {
      var statements = [];
      $('#menudashboard #edt div.edtParagraph:visible').each(function() {
          statements.push({
            statement: $(this)[0].outerHTML,
          });
      });
      return statements;
    } else {
      return $.trim($(".course_edt_box .chat-msg:visible").val());
    }
  }

  function publishDialogueChat() {
    publishChat();
  }

  function publishChat() {
    var courseInsId = "", course_dialogue_type = "", mymessage = "",user_recepient_node_id = "",user_instance_node_id="";
    var documentType = $.trim($("#hidden_document_type_id").val($.trim($('#dropLetterExists').text())).val());
    var chatData = $(".message-wrap .msg-statement-wrap ul").find('li .statement-info').length;
    var blank_instance_node_id = $("#blank-statement-id").val();
    var property_instance_node_id = $("#property-statement-id").val();
    var dataParams = {};
    /* if chatData greater than 0 means we are append multiple chat */
    if(chatData > 0 || $("#empty-statement").val() == 'empty-statement') {
      mymessage = getMessage(documentType);
      var existingDialogueSelCourseListCurrent = $(".existingDialogueSelCourseList.current");

      dataParams['dialogue_node_id']               = existingDialogueSelCourseListCurrent.data('id');
      dataParams['user_recepient_node_id']  = existingDialogueSelCourseListCurrent.attr('user-id');
      dataParams['course_node_id'] = existingDialogueSelCourseListCurrent.closest('div').attr('course-dialogue-instance-id');
      dataParams['course_dialogue_type']    = 'new';
      dataParams['user_instance_node_id']   = setUserID;
      dataParams['action']                  = documentType;
      dataParams['username']                = setUsername;
      dataParams['isGroupMessage']          = 5;
      dataParams['message']                 = mymessage;
      dataParams['timestamp']               = getTime();
      dataParams['courseStatementType']     = existingDialogueSelCourseListCurrent.closest('.course-list').find('.courseboard-table tr td:last').text();;
      dataParams['course_title']            = $(".existCourseTitle").text();
      dataParams['dialogue_title']           = $(".existDialogueTitle").text();
      dataParams['saveType']                = 'P';
      var diaStatusType                     = existingDialogueSelCourseListCurrent.attr('data-status');

      if(diaStatusType == "0") {
        diaStatusType = "Draft";
      } else {
        diaStatusType = "Published";
      }
      dataParams['diaStatusType'] = diaStatusType;

      if(mymessage == "" && documentType!="Letter" && $.trim($('#menudashboard #edt div.edtParagraph:visible').text())=="" && $("#mode_val").val()=="") {
        $(".course_edt_box .chat-msg:visible").addClass("alert-text").focus();;
        ErrorModule.appendErrorAfter($(".course_edt_box .chat-textarea"));
      } else if($('#menudashboard #edt div.edtParagraph:visible').html() == "<br>" && $.trim($('#menudashboard #edt div.edtParagraph:visible').text())=="" && documentType=="Letter" && $("#mode_val").val()=="") {
        ErrorModule.appendErrorAfter($(".letter-edt-wrapper").next(), {error_class: 'letter-error-msg'});
      } else {
        if(documentType == "Letter") {
          if($("#mode_val").val()=='edit') {
              var userid = [];
              $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function(e) {
                  userid.push($(this).val());
              });
              dataParams['type'] = 'addUpdateParticipant';
              dataParams['user_recepient_node_id']  = userid;
              addUpdateParticipant(dataParams);
          } else {
            dataParams['type'] = 'appendStatementForDialogueLetterClass';
            dataParams['blank_instance_node_id'] = $("#blank-statement-id").val();
            appendStatementForDialogueLetterClass(dataParams);
//            if((dataParams['courseStatementType'] == "Published") && (diaStatusType == "Published" || diaStatusType == "draft")) {
//              statementLetterNotification(dataParams);
//            }
          }
        } else {
          if($("#mode_val").val()=='edit') {
            var userid = [];
            $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function(e) {
                userid.push($(this).val());
            });
            dataParams['type'] = 'addUpdateParticipant';
            dataParams['user_recepient_node_id']  = userid;
            addUpdateParticipant(dataParams);
          } else {
            dataParams['type'] = 'appendStatementForDialogueClass';
            dataParams['node_instance_propertyid'] = $("#property-statement-id").val();
            appendStatementForDialogueClass(dataParams);
          }
        }
      }
    } else { /* code here for add course, add dialogue, actor and statement*/
      course_dialogue_type    	= $("#course-dialogue-type").val();
      if($("#courseInsId").val()!="") {
         courseInsId = $("#courseInsId").val();
         course_dialogue_type = 'existing';
      }
      var course_title = $("#course-title-value").val();
      var dialogue_title = $("#dialogue-title-value").val();

      $('input[name="recipient_id[]"]').each(function(e) {
          user_recepient_node_id += $(this).val()+',';
      });
      if(course_title=="") {
          course_title = "Untitled";
      }
      if(dialogue_title=="") {
          dialogue_title = "Untitled";
      }
      var validationParams = {
        user_recepient_node_id: user_recepient_node_id,
        courseInsId: courseInsId,
        documentType: documentType
      };
      var valid = validateChat(validationParams);
      if(valid) {
        $("#individual_user_list").removeClass("alert-text");
        $("#chatTextMessage").removeClass("alert-text");
        if(documentType == "Chat" || documentType == "chat") {
          documentType = "Chat";
          mymessage   = $(".course_edt_box .chat-msg:visible").val();
        } else {
          var statements = [];
          $('#menudashboard #edt div.edtParagraph:visible').each(function() {  //add #documents-screen, by awdhesh soni
              statements.push({
                statement: $(this)[0].outerHTML,
              });
          });
          mymessage  	 = statements;
          documentType = "Letter";
        }

        if(user_recepient_node_id!="" && mymessage!= "" && courseInsId!="") {
          type = 'addDialogue';
          isGroupMessage = 3;
        } else if(user_recepient_node_id!="" && documentType!="Letter" && mymessage!="" && courseInsId=="") {
          type = 'addCourseDialogueActorAndStatement';
          isGroupMessage = 5;
          mymessage = mymessage.trim();
        } else if(user_recepient_node_id!="" && documentType=="Letter" && mymessage!="" && courseInsId=="") {
          type = 'addCourseDialogueActorAndStatement';
          isGroupMessage = 5;
          mymessage = mymessage;
        } else {
          type = 'addCourse';
          isGroupMessage = 2;
          var mymessage =  " has created new course "+ course_title;
        }
        var postData = {
          dialog_instance_node_id: "",
          user_recepient_node_id:user_recepient_node_id,
          course_node_id: courseInsId,
          saveType:'P',
          course_dialogue_type: course_dialogue_type,
          course_title:course_title,
          dialogue_title:dialogue_title,
          user_instance_node_id:setUserID,
          action:documentType,
          type:type,
          isGroupMessage:isGroupMessage,
          courseInsId:courseInsId,
          message: mymessage,
          Coursetype: documentType,
          timestamp :getTime(),
        };
        if(user_recepient_node_id!="" && mymessage!="" && courseInsId=="") {
          if(documentType == "Letter") {
            saveNewCourseDialogueActorLetterStatement(postData);
          } else {
              saveNewCourseDialogueActorStatement(postData);
          }
        } else {
          NProgress.start();
          saveNewCourseDialogueActor(postData);
        }
        $("#dialogue-title-value").val('');
        $('input[name="recipient_id[]"]').remove();
        $(".addNiceScrollWrapper").html('');
      }
    }
    //trigger-editor-collapsed-section
    if($(".existingSelectedCourseWrap .editor-collapsed-btn").length) {
      $('.existingSelectedCourseWrap .course-expand-collapsed-btn').trigger('click');
    }
    edtTagArray=[];
    statusUndoRedo = [];
  }

  function validateChat(params) {
    if(params.user_recepient_node_id == "") {
      $(".email_info").focus();
      $("#individual_user_list").addClass("alert-text");
      var ele = $("#individual_user_list").next("span");
      ErrorModule.appendErrorAfter(ele);
      var courseListedUser = ele.closest('.courseListedUser');
      if(courseListedUser.is(':hidden')) {
          courseListedUser.prev().find('.toggle-section-btn').click();
          ele.parent().find('input[name="individual_user_list"]').focus();
      }
      return false;
    } else if( (params.user_recepient_node_id != "" && (params.courseInsId=="" && $("#add-new-course-value").val()=='')) ) {
      //$(".collapsedBlockWrap .course-title-input").focus();
      $(".expand-block-head").hide();
      $(".collapsed-block-head").show();
      $("#individual_user_list").removeClass("alert-text");
      $("#add-new-course-value").val('');
       /* $("#hidden_document_type_id").val('Letter');*/
       return false;
    } else if( (params.documentType == "Chat" || params.documentType == "chat") && params.user_recepient_node_id != "" && $(".course_edt_box .chat-msg:visible").val()=="" ) {

      $(".course_edt_box .chat-msg.alert-text").focus();
      $(".course_edt_box .chat-msg:visible").addClass("alert-text");
      ErrorModule.appendErrorAfter($(".course_edt_box .chat-textarea"));
      setTimeout(function() {
        $(".course_edt_box .chat-msg.alert-text").focus();
      }, 100);
      return false;
    } else if(params.documentType == "Letter" &&  $.trim($('#menudashboard #edt div.edtParagraph:visible').text())=="" && params.user_recepient_node_id!="") {
      var letterPara = $(".letter-edt-wrapper .edtParagraph").text();
      $(".letter-edt-wrapper").focus();

      if(letterPara == "") {
        $("#course-dialogue-cancel").hide();
        ErrorModule.appendErrorAfter($(".letter-edt-wrapper").next(), {error_class: 'letter-error-msg'});
      }
      return false;
    }
    return true;
  }
  /* function here to use save statement for selected dialogue*/
	function appendStatementForDialogueClass(obj) {
    var getAttachment     = (obj.filetype!="") ? obj.filetype : '';
    var fileSizeByte      = (obj.fileSizeByte!="") ? obj.fileSizeByte: '';
    var fileTempName      = (obj.fileTempName!="") ? obj.fileTempName: '';
    var attachmentName    = (obj.attachmentName!="") ? obj.attachmentName: '';

    obj.saveType          = 'P';
    obj.timestamp         = getTime();
    obj.statement_node_id  = 'temp_123456';//data.result.result;
    obj.getAttachment     = getAttachment;
    obj.fileSizeByte      = fileSizeByte;
    obj.fileTempName      = fileTempName;
    obj.attachmentName    = attachmentName;
    statementNotification(obj);

		/*$.ajax({
			type: "post",
			url: domainUrl+'menudashboard/appendStatementDialogue',
			data: {'data':obj,'chatMessage':JSON.stringify(obj.message)},
			dataType: "json",
			success: function (data) {
          obj.saveType          = 'P';
          obj.timestamp         = getTime();
          obj.statement_node_id  = data.result.result;
          obj.getAttachment     = getAttachment;
          obj.fileSizeByte      = fileSizeByte;
          obj.fileTempName      = fileTempName;
          obj.attachmentName    = attachmentName;
          statementNotification(obj);
  	  },
      complete: function() {
        var courseBoardEle = $(".existingDialogueSelCourseList.current").closest('.course-list').find('.courseboard-table tr td:last');
				if(courseBoardEle.text() == "Draft") {
					courseBoardEle.text('Published');
				}
        $("#property-statement-id").val('');
			}
		});*/
	}

  /*function here use to only add and update participant*/
  function addUpdateParticipant(obj) {
    NProgress.start();
    $.ajax({
      type: "post",
      url: domainUrl+'menudashboard/addUpdateParticipant',
      data: {'data':obj},
      dataType: "json",
      success: function (data) {
        var action = obj.action, type  = obj.type;
        obj.saveType = 'P';
        obj.action = action;
        obj.type = type;
        statementLetterNotification(obj);
      },
      complete: function() {
        $("#mode_val").val('');
      }
    });
  }
  /*end code here*/

  /** function here for remove participant*/
  function removeParticipantData(obj) {
    NProgress.start();
    $.ajax({
      type: "post",
      url: domainUrl+'menudashboard/removeParticipantData',
      data: {'data':obj},
      dataType: "json",
      success: function (data) {
        if(obj.removeUser == setUserID) {
          var notification = setUsername +" has left";
        } else {
          var notification = setUsername +" removed "+ ucwords(obj.username) +" from this conversation.";
        }
        obj.saveType = 'P';
        obj.message = notification;
        obj.user_instance_node_id = setUserID;
        if(obj.status == 1) {
          statementLetterNotification(obj);
        }
      },
      complete: function() {
        $("#mode_val").val('');
        NProgress.done();
      }
    });
  }
  /*end code here*/

  function appendStatementForDialogueLetterClass(obj) {
    var getAttachment = (obj.filetype!="") ? obj.filetype : '';
    var fileSizeByte = (obj.fileSizeByte!="") ? obj.fileSizeByte: '';
    var fileTempName = (obj.fileTempName!="") ? obj.fileTempName: '';
    var attachmentName = (obj.attachmentName!="") ? obj.attachmentName: '';
    if(obj.courseStatementType == "Published" && obj.diaStatusType == "Published" && (obj.action!="image" && obj.action!="attachment")) {
                obj.action = 'appendStatementForDialogueLetterClass';
                obj.type   = 'appendStatementForDialogueLetterClass';
        }

      statementLetterNotification(obj);
      var _exisCourseDialogue = $(".existingDialogueSelCourseList.current").closest('.course-list').find('.courseboard-table tr td:last');
            $('#menudashboard #edt div.edtParagraph:visible').html('<br>').not(':first').remove();
            if(_exisCourseDialogue.text() == "Draft") {
                    _exisCourseDialogue.text('Published');
            }


//		NProgress.start();
//		$.ajax({
//			type: "post",
//			url: domainUrl+'menudashboard/saveDialogueLetter',
//			data: {'data':obj,'chatMessage':obj.message},
//			dataType: "json",
//			success: function (data) {
//        var action = obj.action, type  = obj.type;
//        if(obj.courseStatementType == "Published" && obj.diaStatusType == "Published" && (obj.action!="image" && obj.action!="attachment")) {
//					action = 'appendStatementForDialogueLetterClassModified';
//					type   = 'appendStatementForDialogueLetterClassModified';
//				}
//        obj.saveType = 'P';
//        obj.action = action;
//        obj.type = type;
//        obj.timestamp = getTime();
//        obj.statement_node_id = data.result.result;
//        obj.getAttachment = getAttachment;
//				obj.fileSizeByte = fileSizeByte;
//				obj.fileTempName = fileTempName;
//				obj.attachmentName = attachmentName;
//
//				if(obj.courseStatementType=="Published" && obj.diaStatusType=="Published" && (obj.action!="image" && obj.action!="attachment")) {
//					statementLetterModifiedNotification(obj);
//				} else {
//					statementLetterNotification(obj);
//				}
//	  	},
//			complete: function() {
//				var _exisCourseDialogue = $(".existingDialogueSelCourseList.current").closest('.course-list').find('.courseboard-table tr td:last');
//				$('#menudashboard #edt div.edtParagraph:visible').html('<br>').not(':first').remove();
//				if(_exisCourseDialogue.text() == "Draft") {
//					_exisCourseDialogue.text('Published');
//				}
//			}
//		});
	}

  function saveEditDialogue() {
    var editExistDialogueHiddenEle = $("#editExistDialogueHidden");
    var dialogue_title = $("#editExistDialogue").val();
    if(dialogue_title == "") {
        $("#editExistDialogue").addClass("alert-text");
        $(".error-msg").show();
          return false;
    } else {
      var postData   = {
        dialogue_property_node_id: editExistDialogueHiddenEle.attr('property-id'),
        dialog_instance_node_id: editExistDialogueHiddenEle.attr('data-id'),
        user_recepient_node_id :  editExistDialogueHiddenEle.attr('actor-id'),
        course_node_id: $("#editExistCourse").attr('data-id'),
        saveType:'P',
        course_dialogue_type: 'existing',
        dialogue_title:dialogue_title,
        user_instance_node_id: setUserID,
        action:'letter',
        type:'updateDialogTitle',
        isGroupMessage:4,
      };
      editDialogTitle(postData);
    }
    $("#course-dialogue-publish, #course-dialogue-draft").removeClass("inactive");
    $(".course_rename_view_mode").removeClass("no-hover");
  }

  function saveEditCourse() {
    var course_title 				= $("#editExistCourse").val();

    var editExistCourseHiddenEle = $("#editExistCourseHidden");
    var editExistDialogueHiddenEle = $("#editExistDialogueHidden");

  	if(course_title == "") {
    	$("#editExistCourse").addClass("alert-text");
        $(".error-msg").show();
        return false;
    } else {

      var postData = {
  			course_property_node_id: editExistCourseHiddenEle.attr('property-id'),
  			course_node_id: editExistCourseHiddenEle.attr('data-id'),
    		user_recepient_node_id : editExistDialogueHiddenEle.attr('actor-id'),
        dialogue_node_id       : editExistDialogueHiddenEle.attr('data-id'),
    		saveType:'P',
    		course_dialogue_type: 'existing',
    		course_title:course_title,
        user_instance_node_id:setUserID,
    		action:'letter',
    		type:'updateCourseTitle',
    		isGroupMessage:4,
    	};
      editCourseTitle(postData);
    }
  }

  function deleteCourStatement(obj) {
		$.ajax({
			type: "post",
			url: domainUrl+'menudashboard/deleteStatementData',
			data: {'data':obj},
			dataType: "json"
		});
	}

  function confirmDelete(dialog_instance_node_ele, node_instance_ele) {
    var dialog_instance_node_id = dialog_instance_node_ele.data('id');
		var node_instance_id = node_instance_ele.data('id');
    /*var delete_data = {
			node_instance_id:node_instance_id,
			dialog_instance_node_id:dialog_instance_node_id
		};
		deleteCourStatement(delete_data);*/

      var listContainer = $('#menudashboard');
      var selectedCourse = listContainer.find('tr.current').closest('.react-list');
      var selectedDialogue = selectedCourse.closest('.course-list').find('.dialogue_list.current');
		var msg1 = {
      node_instance_propertyid: node_instance_id,
      dialog_instance_node_id: dialog_instance_node_id,
			message: 'This message has been removed.',
            course_created_by : selectedCourse.attr('data-course-created-by'),
            dialogue_created_by : selectedDialogue.attr('data-dialogue-created-by'),
			sender: setUserID,
			dialogue_node_id: dialog_instance_node_id,
			username:setUsername,
			timestamp :getTime(),
			isGroupMessage:5,
			action:'deleteStatementMsg',
			type:'deleteStatementMsg',
			user_recepient_node_id:dialog_instance_node_ele.attr('user-id'),
			statement_node_id:node_instance_id
			};
			websocketcourse.send(JSON.stringify(msg1));
  }

  function confirmCourseDelete(clicked_element) {
    confirmDelete($(".existingDialogueSelCourseList.current"), $('#confirmCoursePopup').find('.confirm-course-delete'));
  }

  function confirmImgStatement() {
    confirmDelete($(".existingDialogueSelCourseList.current"), $('#confirmImgPopup').find('.confirm-img-statement'));
  }

  function confirmDelete2(node_instance_ele) {
    var dialog_instance_node_ele = $(".existingDialogueSelCourseList.current");
    var node_instance_id				= node_instance_ele.data('id');
    /*var delete_data = {
			node_instance_id:node_instance_id,
			dialog_instance_node_id:dialog_instance_node_ele.data('id'),
			timestamp :getTime(),
                        type :'deleteLetterStatementMsg',
		};
		deleteLetterStatement(delete_data);*/
		var msg1 = {
            blank_instance_node_id:node_instance_id,
			dialog_instance_node_id:dialog_instance_node_ele.data('id'),
			message: 'This message has been removed.',
			sender: setUserID,
			dialogue_node_id: dialog_instance_node_ele.data('id'),
			username:setUsername,
			timestamp :getTime(),
			isGroupMessage:5,
			action:'deleteLetterStatementMsg',
			type:'deleteLetterStatementMsg',
			user_recepient_node_id: dialog_instance_node_ele.attr('user-id'),
			statement_node_id:node_instance_id
		};
		websocketcourse.send(JSON.stringify(msg1));
  }

  function confirmLetterImgStatement() {
    confirmDelete2($('.courseViewModal').find('.confirm-letter-img-statement'));
  }

  function confirmRemoveBtn() {
    confirmDelete2($('.courseViewModal').find('.confirm-remove-btn'));
  }

  function imgDeleteStatement(clicked_element) {
    var node_instance_id = clicked_element.data('id');
    var modal = $('#confirmImgPopup');
  	modal.find('.confirm-img-statement').data('id',node_instance_id);
    showConfirmationPopup(modal);
  }
  function letterImgDeleteStatement(clicked_element) {
    var node_instance_id = clicked_element.data('id');
    var modal = $('#confirmLetterImgPopup');
  	modal.find('.confirm-letter-img-statement').data('id',node_instance_id);
    showConfirmationPopup(modal);
  }

  function letterDeleteStatement(clicked_element) {
    var statement_node_id = clicked_element.data('id');
    var modal = $('#letterRemoveModal');
  	modal.find('.confirm-remove-btn').data('id',statement_node_id);
    showConfirmationPopup(modal);
  }
  function courseDeleteStatement(clicked_element) {
    var node_instance_id = clicked_element.data('id');
    var modal = $('#confirmCoursePopup');
    modal.find('.confirm-course-delete').data('id',node_instance_id);
    showConfirmationPopup(modal);
  }

  function showConfirmationPopup(modal_obj) {
    if(modal_obj.modal('show')) {
       var winHght = $(window).outerHeight()/2.2;
       $(".courseViewModal .modal-dialog").css("margin-top", winHght);
       $("body").removeClass("modal-open");
       $("body").find(".modal-backdrop").addClass("courseCoverBackdrop");
    }
  }

  function letterEditStatement(clicked_element) {
    var data = clicked_element.data('value');
		var insetHtml = $('#menudashboard #edt');
		$('#menudashboard .letter-edit-statement#edt div.edtParagraph:visible').html('<br>');
    	$(insetHtml).html(data);
    	$(".course_edt_box .letter-edt-wrapper").find('.EdtChange').removeClass('EdtChange').addClass('edtParagraph');
    	$(insetHtml).find('.morelinkletter').remove();
    	$("#blank-statement-id").val(clicked_element.data('node-id'));
    	var chatContainerDiv = $('div[data-statement-id="'+clicked_element.data('node-id')+'"]');
     	chatContainerDiv.closest('.single_list_wrap').removeClass('text-processed');
  }

   function chatEditStatement(clicked_element) {
      var data              = clicked_element.data('value');
      var inst_property_id  = clicked_element.data('id');
      var insetHtml         = $('.chat-textarea .chat-msg');
      $(insetHtml).val(data);
      $("#property-statement-id").val(inst_property_id);
  }


  function deleteLetterStatement(obj) {



                $.ajax({
			type: "post",
			url: domainUrl+'menudashboard/deleteLetterStatement',
			data: {'data':obj},
			dataType: "json"
		});
	}

  /* code here to update the dialogue bases */
	function editCourseTitle(obj) {
		NProgress.start();
		$.ajax({
			type: "post",
			url: domainUrl+'menudashboard/editCourseTitle',
			data: {'data':obj},
			dataType: "json",
			success: function (data) {
				if(data) {
					var course_node_id =  data.result.course_node_id;
					var groupMessage            =  4;
					var message  				=  " has renamed this course to ";
					var action 					= 'updateCourseTitle';
					var user_node               = data.result.user_recepient_node_id;
					var type 					= 'updateCourseTitle';
					commonRunTimeNotification(course_node_id,message,groupMessage,action,user_node,course_node_id,setUsername,data.result.course_title,type,'');
				}
	  	},
			complete: function() {
				$(".editExistCourseTitle").removeClass("show");
        $(".editExistDialogueTitle").removeClass("show");
        $(".existCourseTitle").removeClass("no-hover");
			}
		});
	}
  /* code here to update the dialogue bases */
	function editDialogTitle(obj) {
		NProgress.start();
		$.ajax({
			type: "post",
			url: domainUrl+'menudashboard/editDialougeTitle',
			data: {'data':obj},
			dataType: "json",
			success: function (data) {
				if(data) {
					if(obj.dialogue_status=="0") {
						$.post(domainUrl+'menudashboard/dialogueList',{'course_instance_id':obj.course_node_id,'user_instance_node_id':setUserID},responseDialogueListCallAction,'JSON');
					} else {
            var params = {
              message: " has renamed this dialogue to ",
              user_instance_node_id: setUserID,
              dialogue_node_id: data.result.dialog_instance_node_id,
              username: setUsername,
              timestamp :getTime(),
              isGroupMessage: 4,
              action: 'updateDialogTitle',
              user_recepient_node_id: data.result.user_recepient_node_id,
              course_node_id: data.result.course_node_id,
              dialogue_title: data.result.dialogue_title,
              course_title:data.result.dialogue_title,
              type: 'updateDialogTitle',
              selectType: ''
          	};
            websocketcourse.send(JSON.stringify(params));
					}
				}
	  	},
			complete: function() {
				$(".editExistCourseTitle").removeClass("show");
        $(".editExistDialogueTitle").removeClass("show");
        $(".existCourseTitle").removeClass("no-hover");
			}
		});
	}

  /**
   * Function for handling run time notification of adding user as well as removing
   */

   function commonRunTimeNotificationData(obj) {

  	websocketcourse.send(JSON.stringify(obj));
  }

   function commonRunTimeNotification(dialogue_node_id,mymessage,groupMessage,action,user_node,course_node_id,username,dialogue_title,type,modeType) {
  	var msg = {
    	message: mymessage,
    	user_instance_node_id: setUserID,
    	dialogue_node_id: dialogue_node_id,
    	username:setUsername,
    	timestamp :getTime(),
    	isGroupMessage:groupMessage,
    	action:action,
    	user_recepient_node_id:user_node,
    	course_node_id:course_node_id,
    	username:username,
    	dialogue_title:dialogue_title,
    	course_title:dialogue_title,
    	type:type,
    	selectType:modeType
  	};
  	websocketcourse.send(JSON.stringify(msg));
  }

  function statementNotification(statementData) {
    statementData.saveType = 'P';
    statementData.timestamp = getTime();
    websocketcourse.send(JSON.stringify(statementData));
  }

  function statementLetterNotification(statementData) {
    statementData.saveType = 'P';
    statementData.timestamp = getTime();
		websocketcourse.send(JSON.stringify(statementData));
  }

  function statementLetterModifiedNotification(statementData) {
	  statementData.saveType = 'P';
    statementData.timestamp = getTime();
    //statementData.actionType =  "appendLetter";
    websocketcourse.send(JSON.stringify(statementData));
  }

  function commonNotificationDialogueCourse(dataArr) {
		websocketcourse.send(JSON.stringify(dataArr));
  }


  function postToSave(obj, data) {
//      console.log(obj);
//      obj.modeType = obj.Coursetype;
//      if(obj.Coursetype!="Letter") {
//          obj.modeType = "Chat";
//      }
//
//      //obj.message = " added you as a recipient on "+ obj.dialogue_title+" dialogue under "+ obj.course_title+"course";
//      obj.action  = 'addCourseDialogueActorAndStatement';
////      var dialog_instance_node_id =  '';//data.result.dialog_instance_node_id;
////      var groupMessage            =  5;
////      var message  				=  " added you as a recipient on "+ obj.dialogue_title+" dialogue under "+ obj.course_title+"course";
////      var action 					= 'addCourseDialogueActorAndStatement';
////      var user_node               =  obj.user_recepient_node_id;
////      var course_node_id =  '';//data.result.course_instance_id;
////      var type 					= 'addCourseDialogueActorAndStatement';
////      var modeType 			    = obj.Coursetype;
//
//      commonRunTimeNotificationData(obj);
    NProgress.start();
		$.ajax({
			type: "post",
			url: domainUrl+'menudashboard/saveCourseDialouge',
			data: data,
			dataType: "json",
			success: function (data) {
				if(data) {
					var dialog_instance_node_id =  data.result.dialog_instance_node_id;
					var groupMessage            =  5;
					var message  				=  " added you as a recipient on "+ obj.dialogue_title+" dialogue under "+ obj.course_title+" course";
					var action 					= 'addCourseDialogueActorAndStatement';
					var user_node               =  obj.user_recepient_node_id;
					var course_node_id =  data.result.course_instance_id;
					var type 					= 'addCourseDialogueActorAndStatement';
					var modeType 			    = obj.Coursetype;
					if(modeType!="Letter") {
						modeType = "Chat";
					}
					commonRunTimeNotification(dialog_instance_node_id,message,groupMessage,action,user_node,course_node_id,setUsername,data.result.dialogue_title,type,modeType);
				}
	  	}
		});
  }

  function sendData(obj, params) {
    commonNotificationDialogueCourse(obj);
    /*$.ajax({
      type: "post",
      url: domainUrl+'menudashboard/saveCourseDialouge',
      data: params,
      dataType: "json",
      success: function (data) {
        if(data) {
          if(obj.Coursetype=="Letter") {
            $('#menudashboard #edt div.edtParagraph').html('<br>');
          } else {
            $(".course_edt_box .chat-msg:visible").val('');
          }
        }
      },
      complete: function() {
        commonNotificationDialogueCourse(obj);
        NProgress.done();
      }
    });*/
  }

  function saveNewCourseDialogueActorStatement(obj) {
    var data = {'data':obj,'chatMessage':JSON.stringify(obj.message)};
    postToSave(obj, data);
  }

  function saveNewCourseDialogueActorLetterStatement(obj) {
    var data = {'data':obj,'chatMessage':obj.message};
    postToSave(obj, data);
  }

  function saveNewCourseDialogueActor(obj) {
    if(obj.type == "addDialogue" || obj.type=="addCourse") {
      if(obj.Coursetype=="Letter") {
        sendData(obj, {data: obj});
      } else {
        sendData(obj, {'data':obj,'chatMessage':JSON.stringify(obj.message)});
      }
    } else {
      sendData(obj, {'data':JSON.stringify(obj)});
    }
  }

  $(function() {
      _init(); // run this function so that event listeners are attached
  });

  function addParticipants() {
      var individual_user_list = $("#individual_user_list");

    niceScrollDialogue();
    var userName    = $.trim(individual_user_list.val());
    var userId      = $.trim($("#individual_user_id").val());
    var userFullName      = $.trim($("#individual_user_name").val());
    var userInitialName      = $.trim($("#individual_user_initial_name").val());
    var userProfileImage      = $.trim($("#individual_user_image").val());
    var isNewUser      = $.trim($("#is_new_user").val());

    // do not let user add himself as guest or participant
    if(userName == $.trim(window.session_file_name)) {
        bootbox.alert({
            closeButton: false,
            message: 'You can not add yourself as participant or guest in this dialogue.'
        });
        individual_user_list.val('');
        return false;
    }

    if(isNewUser) {
        userProfileImage = 'public/img/guest-user.jpg';
    }
    var participantContainer = $(".addNiceScrollWrapper");

    // add user in the list only when it does not exist in the list.
    if(participantContainer.find('input[value="' +userId+ '"]').length || participantContainer.find('input[data-useremail="' +userId+ '"]').length) {
        individual_user_list.val('');
        return true;
    }
    if(userId == "") { // if userId is empty then do nothing
      return true;
    }
    if(userName!="" && mydummyParticipantObj.length) {
      for (var i in ind_participant) {
          if(ind_participant[i].key == mydummyParticipantObj[0].key) {
            ind_participant.splice(i,1);
            break;
         }
      }
    }
    if(userName!="" && userId!="") {
        var image = '<span class="initials-box">' + userInitialName+ '</span>';
        if(userProfileImage != 0){
          image = "<img src='" + userProfileImage + "' />";
        }
        var html = "<div class='user-temp global_participant_box_wrap recRightPanel'>" +
            "<span class='img'>" + image + "</span>" +
            "<span class='name'>" + userFullName + "</span>" +
            "<input data-userInitial=" + userInitialName + " data-userImage=" + userProfileImage + " data-userEmail=" + userName + " data-userName='" + userFullName + "' type='hidden' name='recipient_id[]' value=" + userId + " data-isnewuser=" + isNewUser + ">" +
            "</span>" +
            "<span class='close-sm'>" +
            "<i class='icon close removeDialogueList'></i>" +
            "</span>" +
            "</div>";
        participantContainer.append(html);
        individual_user_list.focus();
        setTimeout(function() {
            individual_user_list.removeAttr('value');
            $("#individual_user_id").removeAttr('value');
            $("#individual_user_name").removeAttr('value');
            $("#individual_user_initial_name").removeAttr('value');
            $("#individual_user_image").removeAttr('value');
            $("#is_new_user").removeAttr('value');
        }, 500);
        setTimeout(function() {
            individual_user_list.removeAttr('value');
            individual_user_list.val('');
        });
    }
    /* Modified by:- Gaurav
     * Manage Send button
    */
    checkChatMode();
  }

  function removeParticipants(clicked_element) {
      var allUserIds = [];
      $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function(e) {
          if($(this).attr('data-isnewuser') != 1) {
                allUserIds.push($(this).val());
          }
       });
       console.log(allUserIds);
       var parent = clicked_element.closest(".recRightPanel");
      if($("#newCourseControl").length || !parent.hasClass('react-existing-user')) {
            if(parent.find('input').attr('data-isnewuser') != 1) {
                var getKey = parent.find('input').attr('data-useremail');//parent.find('span').text();
                var getVal = parent.find('input').val();
                var userFullName = parent.find('input').attr('data-username');
                var userProfileImage = parent.find('input').attr('data-userImage');
                var userInitialName = parent.find('input').attr('data-userInitial');

                ind_participant.push({"key":getVal,"value":getKey,userFullName:userFullName, userProfileImage : userProfileImage, userInitialName:userInitialName });
                ind_participant.sort(function(a,b) {
                  return a.key-b.key
                });
            }
            parent.remove();
            $("#individual_user_list").focus();
            $("#individual_user_id").val('');
            $("#individual_user_name").val('');
            $("#individual_user_initial_name").val('');
            $("#individual_user_image").val('');
            return true;
      }

        var listContainer = $('#menudashboard');
        var selectedCourse = listContainer.find('tr.current').closest('.react-list');
        var selectedDialogue = selectedCourse.closest('.list-row ').find('.dialogue_list.current');
        NProgress.start({position: 'middle'});
        data = {};
        if(!selectedCourse.attr('data-course-node-id')) {
            selectedCourse = selectedDialogue;
        }
        data["dialogue_node_id"] = selectedDialogue.attr('data-id');
        data["dialogue_title"] = selectedDialogue.attr('data-dialogue-title');
        data["dialogue_instance_id"] = selectedDialogue.attr('data-instance-id');

        data["course_node_id"] = selectedCourse.attr('data-course-node-id');
        data["course_title"] = selectedCourse.attr('data-course-title');
        data['course_created_by'] = selectedCourse.attr('data-course-created-by');
        data['dialogue_created_by'] = selectedDialogue.attr('data-dialogue-created-by');
        data["saveType"] = (selectedDialogue.attr('data-dialogue-status') == 1) ? "P": "D";
        data["user_instance_node_id"] = setUserID;
        data["removeUser"] = parent.find('input').val();
        data["user_recepient_node_id"] = allUserIds;
        data["type"]="removeParticipant";
        data["status"]="1"
        var removedUserDetail = window.getAllUsersList[data["removeUser"]];
        data['default_params'] = {
            action: 'removeActor',
            dialogue_node_id: data["dialogue_node_id"],
            dialogue_instance_id: data["dialogue_instance_id"],
            course_node_id: data["course_node_id"],
            dialogue_title: data["dialogue_title"],
            course_title: data["course_title"],
            removed_user_id: data["removeUser"],
            removed_user_name: removedUserDetail.first_name + ' ' + removedUserDetail.last_name,
            removed_by_id: setUserID,
            removed_by_name: setUsername
        }
        console.log(data);
        socket.send(JSON.stringify(data));
        manageDialogueHT();

  }
  // function removeParticipants(clicked_element) {
  //   var getKey = clicked_element.closest(".recRightPanel").find('span').text();
  //   var getVal = clicked_element.closest(".recRightPanel").find('input').val();
  //
  //   ind_participant.push({"key":getVal,"value":getKey});
  //   ind_participant.sort(function(a,b) {
  //     return a.key-b.key
  //   });
  //   clicked_element.closest(".recRightPanel").remove();
  //   $("#individual_user_list").focus();
  //
  //   if($("#mode_val").val()=="edit" && clicked_element.data('user-id') != undefined) {
  //     var existingDialogueSelCourseListCurrent = $(".existingDialogueSelCourseList.current");
  //     var userid = [];
  //     $('.global_participant_box_wrap input[name="recipient_id[]"]').each(function(e) {
  //       userid.push($(this).val());
  //     });
  //     var dataParams = {};
  //     var documentType = $.trim($("#hidden_document_type_id").val($.trim($('#dropLetterExists').text())).val());
  //     dataParams['dialogue_node_id']               = existingDialogueSelCourseListCurrent.data('id');
  //     dataParams['user_recepient_node_id']  = existingDialogueSelCourseListCurrent.attr('user-id');
  //     dataParams['course_node_id'] = existingDialogueSelCourseListCurrent.closest('div').attr('course-dialogue-instance-id');
  //     dataParams['action']                  = documentType;
  //     dataParams['username']                = clicked_element.data('user-name');
  //     dataParams['course_title']            = $(".existCourseTitle").text();
  //     dataParams['dialogue_title']           = $(".existDialogueTitle").text();
  //     dataParams['saveType']                = 'P';
  //     dataParams['removeUser']              = clicked_element.data('user-id');
  //     dataParams['type'] = 'removeParticipant';
  //     dataParams['status'] = existingDialogueSelCourseListCurrent.data('status');
  //     removeParticipantData(dataParams);
  //   }
  //   /* Modified by:- Gaurav
  //    * Manage Send button
  //   */
  //    checkChatMode();
  // }

  function loadChatView(params, callback) {
    $.ajax({
      url: params.url,
      data: params.data,
      post: (params.type)? params.type: 'get',
      success: function(response) {
        // dialogueContainer.html(response);
        if(typeof callback == 'function') {
          callback(response);
        }
      },
      datType: 'html'
    });
  }

  function getIconFormat(format_str) {
    var iconFormat = {
      'docx': 'doc.png',
      'doc': 'doc.png',
      'zip': 'zip.png',
      'pdf': 'pdf.png',
      'xlsx': 'xls.png',
      'csv': 'csv.png',
      'exe': 'exe.png',
      'psd': 'psd.png',
      'txt': 'notepad.png'
    }
    if(format_str in iconFormat) {
      return iconFormat[format_str];
    }
    return 'default.png';
  };
  return {
    responseIndividualParticipant: responseIndividualParticipant,
    _init: _init,
    publishDialogueChat: publishDialogueChat,
    saveEditDialogue: saveEditDialogue,
    saveEditCourse: saveEditCourse,
    confirmCourseDelete: confirmCourseDelete,
    confirmImgStatement: confirmImgStatement,
    imgDeleteStatement: imgDeleteStatement,
    letterImgDeleteStatement: letterImgDeleteStatement,
    confirmLetterImgStatement: confirmLetterImgStatement,
    letterDeleteStatement: letterDeleteStatement,
    confirmRemoveBtn: confirmRemoveBtn,
    letterEditStatement: letterEditStatement,
    courseDeleteStatement: courseDeleteStatement,
    addParticipants: addParticipants,
    removeParticipants: removeParticipants,
    ind_participant: ind_participant,
    loadChatView: loadChatView,
    appendStatementForDialogueClass:appendStatementForDialogueClass,
    appendStatementForDialogueLetterClass:appendStatementForDialogueLetterClass,
    getIconFormat:getIconFormat,
    chatEditStatement:chatEditStatement,

  };
}());
window.puJsFileLoadCounter++;
var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function addNewUser(userEmail) {
    var re = email_regex;

    if($.trim(userEmail) == '') {
        return false;
    }
    if(!re.test(userEmail)) {
        return false;
    }
    var suggestion = {
        key: userEmail,
        value: userEmail,
        userFullName: userEmail,
        userInitialName: 't',
        userProfileImage: 'public/img/guest-user.jpg',
        is_new_user: 1
    }
    autoCompleteOnSelect(suggestion)
    ChatdialogueModule.addParticipants();
}
function autoCompleteOnSelect(suggestion) {
    mydummyParticipantObj=[];
    $("#individual_user_id").val(suggestion.key);
    $('#individual_user_list').val(suggestion.value);
    $('#individual_user_name').val(suggestion.userFullName);
    $('#individual_user_initial_name').val(suggestion.userInitialName);
    $('#individual_user_image').val(suggestion.userProfileImage);
    if(suggestion.is_new_user) {
        $('#is_new_user').val(1);
    } else {
        $('#is_new_user').val('');
    }
    mydummyParticipantObj.push({"key":suggestion.key,"value":suggestion.value,"userFullName" : suggestion.userFullName, userProfileImage : suggestion.userProfileImage, userInitialName : suggestion.userInitialName, is_new_user: suggestion.is_new_user});
}
