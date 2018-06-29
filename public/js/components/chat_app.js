import React from 'react';
import ChatList from './chat_list';
import Editor from './editor';
import ChatEditor from './chat_editor';
import {connect} from 'react-redux';
import {getCurrentDialogue, hasLoggedInUserRemoved,getStatementDetailById,getStrWithDot, addCollapseEvent, getGuestUsers, getUpdatedDialogueDetail} from './functions/common_functions';
import CommonObject from './functions/common_objects';
import {updateChatText} from '../actions/actions';

class ChatApp extends React.Component {
    constructor() {
        super();
        this.state = {
            dialougeDetail: tempMessageObj,
            //chat_text: '',
        };
    }
    render() {
        let {chatItems, letters} = this.props;
        return (
            <div className="detail-pane-inner">
            <div className="existingSelectedCourseWrap" id="existingSelectedCourse">
                <div className="existingMidTotal" id="chatWrapper">

                    {/* <div className="unread-msg-box">
                        <span className="total-msg-count letter-count">0 unread messages</span>
                    </div> */}
                    <div id="message-wrap-chat-statement">
                        <div className="message-wrap active existWrapperMsg">
                            <ChatList chat_app={this} />
                        </div>
                    <div className="ct-icon-msg showDownBtnNano hide" onClick={this.scrollDownNano.bind(this)}>
                        <span className="ct-drop-icon fa fa-angle-double-down" aria-hidden="true"></span>
                        <div className="ct-counter"><span className="ct-counter-content">0</span></div>
                    </div>
                    </div>
                    {
                        this.getEditor()
                    }
                </div>
                <div className="checkEnterBox " style={{display: 'none'}}>
                    <div className="checkbox inactive">
                        <label>
                          <input type="checkbox" defaultChecked className="chat-statement-checkbox" /> Please enter to submit
                        </label>
                    </div>
                </div>
            </div>
            </div>
        );
    }

    scrollDownNano(){
        var niceScroll = $(".letter-message-wrap, .message-wrap");
        niceScroll.getNiceScroll(0).doScrollTop($(".msg-statement-wrap").height() - 1, 1);
        $(".showDownBtnNano").addClass("hide");
        $(".showDownBtnNano .ct-counter-content").text("0");
    }

    getEditor() {
        var chatType = this.props.chatType.toLowerCase();
        this.changeContainerId(chatType);
        if(chatType == 'letter') {
            return <Editor />
        } else {
            return <ChatEditor chat_app={this}/>
        }
    }
    componentDidMount() {
        var chatType = this.props.chatType.toLowerCase();
        this.changeContainerId(chatType);
    }
    changeContainerId(chatType) {
        if(chatType == 'letter') {
            $("#message-wrap-chat-statement").attr("id", "message-wrap-letter-statement")
        } else {
            $("#message-wrap-letter-statement").attr("id", "message-wrap-chat-statement")
        }
    }
    updateDialogueDetail() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            return true;
        }
        this.state.dialougeDetail = getUpdatedDialogueDetail(view_type, courseList, currentChatDialogueDetail);
    }
    sendMessage() {
        let self = this;
        if(typeof socket != 'undefined') {
            if(socket.readyState == 1) { // The connection is open and ready to communicate.
                self.processMessage();
            } else {
                CommonObject.ConnectionError.hidePopup();
                CommonObject.ConnectionError.showPopup();
            }
        }
    }
    processMessage() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            this.addNewCourse();
            return true;
        }

        this.updateDialogueDetail();

        //reset chat box (textarea)
        localStorage.setItem('prev_dialogue_node_id',currentChatDialogueDetail.dialogue_node_id);
        this.props.dispatch(updateChatText({chatText : ''}));

        var diaStatusTypeReact = this.state.dialougeDetail.dialogueStatus;
        if (diaStatusTypeReact == 1) {
            diaStatusTypeReact = "Published";
        } else {
            diaStatusTypeReact = "Draft";
        }
        let messageEle = $("#paste-img");
        let replyInput = $("#reply-msg-input");
        if(replyInput.length) {
            messageEle = replyInput;
        }
        if ($.trim(messageEle.val()) == "") {
            $(".course_edt_box .error-msg").removeClass("hide");
            messageEle.blur();
            //alert('Please enter message');
            bootbox.alert({
                title: 'Alert',
                message: 'Please enter message.',
                callback: function(){
                    messageEle.focus();
                }
            });
            return false;
        } else {
            $(".course_edt_box .error-msg").addClass("hide");
        }
        let currentCourseId = ' ' + $.trim(this.props.currentChatDialogueDetail['course_node_id']);
        let currentDialogueId = ' ' + $.trim(this.props.currentChatDialogueDetail['dialogue_node_id']);

        let currentCourse = courseList[currentCourseId];
        if(view_type == 'bydialogue') {
            currentCourse = courseList[currentDialogueId];
        } else if(view_type == 'byactor') {
            currentCourse = courseList[currentCourseId].dialogue[currentDialogueId];
        }

        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
        let newMsg = messageEle.val();
        var msg = {
            message: newMsg,
            username: setUsername,
            firstName: firstName,
            lastName : lastName,
            user_instance_node_id: window.setUserID,
            user_recepient_node_id: this.state.dialougeDetail.user_id,
            timestamp: getTime(),
            isGroupMessage: 5,
            action: "Chat",
            type: "appendStatementForDialogueClass",
            dialogue_node_id: this.state.dialougeDetail.dialogue_instance_node_id,
            course_node_id: currentCourse.course_node_id,
            course_dialogue_type: "new",
            courseStatementType: "Chat",
            course_title: currentCourse.course,
            dialogue_title: this.state.dialougeDetail.dialogue_title,
            course_created_by: currentCourse.created_by,
            dialogue_created_by: currentDialogue.created_by,
            saveType: "P",
            diaStatusType: diaStatusTypeReact,
            chat_type: 'Chat'
        };
        if(replyInput.length) {
            msg.reply = 'yes';
            msg.node_instance_propertyid = replyInput.attr('data-node_instance_propertyid');
        }
        var extraParams = {};
        var edit_chat_statement = $("#edit_chat_statement");
        if (edit_chat_statement.length) {
            extraParams = edit_chat_statement.data('params');
            edit_chat_statement.remove();
            $("#react-button-cancel-edit").remove();
            $("#edit_chat_statement").remove();
            extraParams.node_instance_propertyid = extraParams.blank_instance_node_id;
            delete extraParams.blank_instance_node_id;
            let chatItems = (typeof this.props.chatItems == 'object') ? this.props.chatItems: $.parseJSON(this.props.chatItems);
            let statementDetail = getStatementDetailById(this.props.chatType, extraParams.default_params.statement_node_id, chatItems);

            if(newMsg == statementDetail.list){
                messageEle.val('');
                return true;
            }
            msg = $.extend({}, msg, extraParams);
        }
        socket.send(JSON.stringify(msg));
        messageEle.val('');
    }
    addNewCourse() {
        let courseTitle = $("#course-title-value"), self = this;
        let dialogueTitle = $("#dialogue-title-value");
        let courseTitleVal = $.trim(courseTitle.val());
        let dialogueTitleVal = $.trim(dialogueTitle.val());
        let recipientsList = $("input[name='recipient_id[]']");
        if (!recipientsList.length) {
            bootbox.alert({
                title: 'Alert',
                message: 'Please select Participant.'
            });
            $("#individual_user_list").focus();
            return true;
        }
        let stmt_message = $("#paste-img");
        if ($.trim(stmt_message.val()) == '') {
            //alert('Please enter message');
            bootbox.alert({
                title: 'Alert',
                message: 'Please enter message.'
            });
            stmt_message.focus();
            return true;
        }
        if (courseTitle.length && courseTitleVal == '') {
            courseTitleVal = getStrWithDot(stmt_message.val());
        }
        if (dialogueTitleVal == '') {
            dialogueTitleVal = getStrWithDot(stmt_message.val());
        }
        let guestUsers = getGuestUsers(self.addNewCourse.bind(self));
        if(guestUsers.length) {
            return true;
        }

        let recipients = [];
        recipientsList.each(function () {
            recipients.push($(this).val());
        });
        NProgress.start({position: 'middle'});

        var msg = {
            user_recepient_node_id: recipients.join(','),
            user_instance_node_id: window.setUserID,
            course_title: courseTitleVal,
            dialogue_title: dialogueTitleVal,
            selectType: 'Chat',
            Coursetype: 'Chat',
            course_dialogue_type: 'new',
            saveType: 'P',
            action: 'addCourseDialogueActorAndStatement',
            type: 'addCourseDialogueActorAndStatement',
            message: stmt_message.val(),
            course_node_id: '',
            dialog_node_id: '',
            statement_ins_id: '',
            default_params: {
                action: 'addNewCourse',
                added_by_id: window.setUserID,
                added_by_name: window.setUsername
            }
        };
        stmt_message.val('');
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            let courseList = this.props.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            }
            let course = courseList[' ' + $.trim(this.props.currentChatDialogueDetail.course_node_id)];
            let user_ids = this.addActorInUserIdsArray(recipients);
            if (user_ids.length) {                
                msg.user_ids = user_ids;
            }
            msg.course_date = course.date;
            msg.course_created_by = course.created_by;
            msg.dialogue_created_by = window.setUserID;
            msg.course_node_id = this.props.currentChatDialogueDetail.course_node_id;
            msg.course_title = course.course;
            msg.default_params.action = 'addNewDialogue'
            msg.course_dialogue_type = 'existing';
            msg.default_params.course_node_id = msg.course_node_id;
        }
        socket.send(JSON.stringify(msg));
    }
    addActorInUserIdsArray(list){
        if(list.length){
            let {courseList,currentChatDialogueDetail} = this.props;
            let user_ids = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].user_ids;
            list.map(function(index){
                if($.inArray(index,user_ids) === -1){
                    user_ids.push(index);
                }
            });
            courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].user_ids = user_ids;
            return user_ids;
        }
    }

}
const mapStateToProps = (state) => {
    return {
        chatType: state.chatType,
        chatItems: state.chatItems,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        view_type: state.view_type,
        courseList: state.courseList
    }
}
const ConnectedChatApp = connect(mapStateToProps)(ChatApp);

export default ConnectedChatApp;
