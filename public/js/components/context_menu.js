import React from 'react';
import {connect} from 'react-redux';
import {removeChat, editChat} from '../actions/actions';
import {getStatementDetailById} from './functions/common_functions';
import {getCurrentDialogue, getUpdatedDialogueDetail} from './functions/common_functions';

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state={dialougeDetail:tempMessageObj};
    }
    render() {
        let self = this, options;
        let {chat, stmt} = this.props;
        let optionsForLoggedinUser = [
            {icon_class: 'reply', title: '', callback: function() {
                self.props.context.messageReply.call(self.props.context, chat, stmt);
            }},
            {icon_class: 'favourite inactive', title: ''},
            {dropdown_options: {
                'edit': {title: 'Edit', callback: function() {
                    var editParams = {
                        default_params: {
                            chat_action_type: 'edit',
                            statement_node_id: stmt.node_instance_propertyid,
                        },
                        blank_instance_node_id: stmt.node_instance_propertyid
                    };
                    self.editRecord.call(self,editParams);
                }},
                'copy': {title: 'Copy', parent_class: 'inactive'},
                'delete': {title: 'Delete', callback: function() {
                    var deleteParams = {
                        default_params: {
                            chat_action_type: 'delete',
                            statement_node_id: stmt.node_instance_propertyid,
                        },
                        node_instance_id: stmt.node_instance_propertyid,
                        type: 'deleteLetterStatementMsg'
                    };
                    self.removeRecord.call(self, deleteParams);
                }},
                'assign_to': {title: 'Assign to Course', parent_class: 'inactive'},
                'share': {title: 'Share', parent_class: 'inactive'},
            }}
        ];
        let optionsForOtherUser = [
            {icon_class: 'reply', title: '', callback: function() {
                self.props.context.messageReply.call(self.props.context, chat, stmt);
            }},
            {icon_class: 'favourite', title: ''},
            {dropdown_options: {
                'copy': {title: 'Copy', parent_class: 'inactive'},
                'assign_to': {title: 'Assign to Course', parent_class: 'inactive'},
                'share': {title: 'Share', parent_class: 'inactive'},
            }}
        ];
        options = optionsForLoggedinUser;
        if(chat['actor.author'] != window.setUserID) {
            options = optionsForOtherUser;
        }
        if((stmt.statement_type.toLowerCase() == 'image' || stmt.statement_type.toLowerCase() == 'attachment') && chat['actor.author'] == window.setUserID) {
            delete options[2].dropdown_options.edit;
        }
        return (
            <span className="stmt-tooltip">
                <ul>
                    {
                        options.map(function(option, index) {
                            if(option.dropdown_options) {
                                return (
                                    <li key={index}>
                                        <div className="dropdown reply-options">
                                            <a className="dropdown-toggle" data-toggle="dropdown">
                                                <i className="icon-sm tridot"></i>
                                            </a>
                                            <ul className="dropdown-menu">
                                                {
                                                    Object.keys(option.dropdown_options).map(function(sub_index) {
                                                        let sub_option = option.dropdown_options[sub_index];
                                                        if(sub_option.callback) {
                                                            return <li onClick={sub_option.callback} className={sub_option.parent_class} key={sub_index}><a>{sub_option.title}</a></li>
                                                        }
                                                        return <li className={sub_option.parent_class} key={sub_index}><a>{sub_option.title}</a></li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </li>
                                )
                            } else {
                                if(option.callback) {
                                    return <li key={index} onClick={option.callback}><a><i className={'icon-sm ' + option.icon_class}></i></a></li>
                                }
                                return <li key={index}><a><i className={'icon-sm ' + option.icon_class}></i></a></li>
                            }
                        })
                    }
                </ul>

            </span>
        )
    }
    render_old() {
        return (
            <div id="courseLetterContextMenu"  className="dropdown clearfix courseDialogueContextMenubar">
                {
                    this.getContextMenuTmpl()
                }
            </div>
        )
    }
    componentDidMount() {
        $('body').off('show.bs.dropdown', '.reply-options').on('show.bs.dropdown', '.reply-options', function (evt) {
            isElementCompletelyVisible($(this));
        });
    }
    getContextMenuTmpl() {
        if(this.props.chatType.toLowerCase() == 'letter') {
            return (
                <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style={{display:'block'}}>
                    <li><a href="javascript:void(0)" className="del-chat" onClick={(event) => this.removeRecord(event)}>Remove</a></li>
                    <li><a href="javascript:void(0)" className="edt-chat" onClick={(event) => this.editRecord(event)}>Edit</a></li>
                </ul>
            )
        } else {
            return (
                <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style={{display:'block'}}>
                    <li className="disabled"><a href="javascript:void(0)">Assign to Course</a></li>
                    <li className="disabled"><a href="javascript:void(0)">Share</a></li>
                    <li><a href="javascript:void(0)" className="edt-chat" onClick={(event) => this.editRecord(event)}>Edit</a></li>
                    <li className="remove"><a href="javascript:void(0)" className="del-chat" onClick={(event) => this.removeRecord(event)}>Remove</a></li>
                </ul>
            )
        }
    }
    updateDialogueDetail() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if(this.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            return true;
        }
        this.state.dialougeDetail = getUpdatedDialogueDetail(view_type, courseList, currentChatDialogueDetail);
    }
    removeRecord(params) {
        this.updateDialogueDetail();
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        // let params = this.getRecordParams($(event.target));
        // console.log(params);

        var diaStatusTypeReact = this.state.dialougeDetail.dialogueStatus;
        if(diaStatusTypeReact==1) {
          diaStatusTypeReact = "Published";
        }
        else{
          diaStatusTypeReact = "Draft";
        }
        // let course = this.props.courseList[' ' + $.trim(this.props.currentChatDialogueDetail.course_node_id)];
        // let dialogue = course['dialogue'][' ' + $.trim(this.props.currentChatDialogueDetail.dialogue_node_id)].dialogue;

        let currentCourseId = ' ' + $.trim(this.props.currentChatDialogueDetail['course_node_id']);
        let currentDialogueId = ' ' + $.trim(this.props.currentChatDialogueDetail['dialogue_node_id']);

        let currentCourse = courseList[currentCourseId];
        if(view_type == 'bydialogue') {
            currentCourse = courseList[currentDialogueId];
        }
        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);

        var msg = {
            message: 'statements',
            username: setUsername,
            user_instance_node_id: this.state.dialougeDetail.user_instance_node_id,
            user_recepient_node_id: this.state.dialougeDetail.user_id,
            timestamp: getTime(),
            isGroupMessage: 5,
            action: "Letter",
            type: "appendStatementForDialogueLetterClass",
            dialogue_node_id: this.state.dialougeDetail.dialogue_instance_node_id,
            course_node_id: (this.state.dialougeDetail.course_node_id) ? this.state.dialougeDetail.course_node_id : currentCourseId,
            course_created_by: currentCourse.created_by,
            dialogue_created_by: currentCourse.created_by,
            course_dialogue_type: "new",
            courseStatementType: this.state.dialougeDetail.courseStatementType,
            course_title: this.state.dialougeDetail.course_title,
            dialogue_title: this.state.dialougeDetail.dialogue_title,
            saveType: "P",
            diaStatusType: diaStatusTypeReact
        };
        msg.dialog_instance_node_id = msg.dialogue_node_id;

        params.action = this.props.chatType;
        if(this.props.chatType.toLowerCase() == 'chat') {
            params.type = 'deleteStatementMsg';
        }
        params.chat_type = this.props.chatType;

        var newMsg = $.extend({}, msg, params);

        bootbox.confirm({
            title:'Confirmation',
            message: 'Are you sure you want to remove this message?',
            callback: function(state) {
                if(state) {
                    socket.send(JSON.stringify(newMsg));
                    // when user first clicks 'edit' and then clicks 'remove' then 'Cancel Button' should be removed.
                    $("#react-button-cancel-edit").remove(); //
                    $("#edit_chat_statement").remove();
                }
            }
        });
    }
    editRecord(paramsAll) {
        $("#react-button-cancel-edit").remove();
        $("#edit_chat_statement").remove();
        // let paramsAll = this.getRecordParams($(event.target)),
        let chatItems = (typeof this.props.chatItems == 'object') ? this.props.chatItems: $.parseJSON(this.props.chatItems);
        let params = paramsAll.default_params, self = this;

        let list = '', nodeStatusType = '', chatType = this.props.chatType.toLowerCase();

        let chatMessages = [];
        let statementDetail = getStatementDetailById(chatType, params.statement_node_id, chatItems);
        chatMessages.push(statementDetail.list);

        let editElement = $('<div />').attr('id', 'edit_chat_statement').attr('data-params', JSON.stringify(paramsAll));
        $("#edit_chat_statement").remove();
        $("body").append(editElement);

        var cancelEditBtn = $('<a />').on('click', function() {
            self.cancelChatEdit();
        }).attr({
            href: 'javascript:void(0)',
            id: 'react-button-cancel-edit'
        });
        cancelEditBtn.append('<i class="icon cancel"></i><br><span>Cancel Edit&nbsp;</span>');

        /*Modified By: Divya*/
        if($("#react-button1").length){
            $("#react-button1").parent().addClass('multiple-child').append(cancelEditBtn);
        }else if($("#react-button3").length){
            $("#react-button3").parent().addClass('multiple-child').append(cancelEditBtn);
        }
        /*End Here*/

        if(chatType == 'letter') {
            $('#edt').html(chatMessages.join(' '));
            if(statementDetail.nodeStatusType == 1) {
                $("#react-button2").addClass('hide');
            }
        } else {
            $("#paste-img").val(chatMessages.join(' '));
            // this.props.chatEditor.refs.message.value = chatMessages.join(' ');
        }
    }
    cancelChatEdit() {
        $("#react-button-cancel-edit").remove();
        $("#edit_chat_statement").remove();
        if(this.props.chatType.toLowerCase() == 'letter') {
            var htmlToInsert = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
            $('.letterChatMode #edt').empty().html(htmlToInsert);
            $("#react-button2").removeClass('hide');
        } else {
            $("#paste-img").val('');;
            // this.props.chatEditor.refs.message.value = '';
        }
    }
    getRecordParams(clicked_element) {
        return clicked_element.data('params');
    }
}

const mapStateToProps = (state) => {
    return {
        chatItems: state.chatItems,
        chatType: state.chatType,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        view_type: state.view_type
    }
}
const ConnectedContextMenu = connect(mapStateToProps)(ContextMenu);
export default ConnectedContextMenu;
