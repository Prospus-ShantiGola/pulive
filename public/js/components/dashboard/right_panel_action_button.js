import React from 'react';
import {connect} from 'react-redux';
import {getCurrentDialogue, addGuestUser, getGuestUsers} from '../functions/common_functions';
import {changeChatView} from '../../actions/actions';
import RightActionBarProduction from '../course_builder/right_action_bar';
class RightPanelActionButton extends React.Component {

    render() {
        return this.manageRightPanelButton();
    }

    manageRightPanelButton() {
      let self = this;

      let {currentChatDialogueDetail, courseList, view_type} = self.props;
      if(currentChatDialogueDetail && currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
          let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
          let removedUsers = currentDialogue.removed_users;

          if(removedUsers && removedUsers[window.setUserID]) {
              return null;
          }
      }
      if(self.props.changeChatView) {
        var getTemplateType = self.props.currentChatDialogueDetail.chat_view_type;
        if(getTemplateType=="add_new_template" || getTemplateType=="edit_production_template"){
            //return production menu here
            return <RightActionBarProduction />;
        }
        if(self.props.showAdminHeader) {
                return (<ul><li>
                    <a href="javascript:void(0)" id="react-button3" onClick={self.addParticipants.bind(self)}>
                        <i className="icon addUser"></i><span>Add Participant</span>
                    </a>
                </li></ul>)

        } else {
            return self.getAdditionalButtons(currentChatDialogueDetail)
        }
      }
      if(view_type == "bycourse") {
            if(typeof currentChatDialogueDetail != 'undefined' && $.trim(currentChatDialogueDetail.expand_course_node_id) == '2210275') {
                return (
                  <ul>
                      <li>
                          <a href="javascript:void(0)" id="get-started" onClick={self.showBusinessModelBluepringScreen.bind(self)}>
                              <i className="icon-sm get-started"></i><span>Get Started</span>
                          </a>
                      </li>
                  </ul>
                )
            }
      }
      return null;

    }
    showBusinessModelBluepringScreen() {
        $("#business-model-bule-print").removeClass('hide');
    }
    getAdditionalButtons(currentChatDialogueDetail) {
        let self = this;
        if(currentChatDialogueDetail && currentChatDialogueDetail.chat_view_type == 'add_new_course') {
            return (
                <ul>
                    <li>
                        <a href="javascript:void(0)" id="react-button1" onClick={self.sendChat.bind(self)}><i className="icon publish"></i><span>Send</span></a>
                    </li>
                    <li>
                        <button className="btn-anchor" href="javascript:void(0)" id="react-button-cancel-add-new-course" onClick={self.cancelAddNewCourse.bind(self)}>
                            <i className="icon cancel"></i><span>Cancel</span>
                        </button>
                    </li>
                </ul>
            )
        }
        return(
            <ul>
                <li>
                    <a href="javascript:void(0)" id="react-button1" onClick={self.sendChat.bind(self)}><i className="icon publish"></i><span>Send</span></a>
                </li>
            </ul>
        )

    }
    cancelAddNewCourse() {
        var self = this;
        bootbox.confirm({
           title: 'Confirm',
            message: 'Are you sure you want to cancel?',
            callback: function (state) {
                if (state) {
                    let menudashboard = $("#menudashboard");
                    menudashboard.find('.add-new-course-tmpl').closest('.list-row').remove();
                    let buttonWrapper = $("#course_action_menu");

                    buttonWrapper.find("#react-button-cancel-add-new-course").remove();
                    $('.course-list-panel-additional').remove();
                    buttonWrapper.find('a').not('.user-roles').addClass('hide');
                    $('.no-record').show();
                    var firstElement = menudashboard.find('.list-row:first').find('.react-list').find('tr:first');
                    let currentChatDialogue;
                    if (firstElement.length) {
                        currentChatDialogue = {chat_view_type: ''};
                        self.props.dispatch(changeChatView(currentChatDialogue));
                        firstElement.trigger('click');
                    } else {
                        currentChatDialogue = {change_chat_view: 0};
                        self.props.dispatch(changeChatView(currentChatDialogue));
                    }
                }
            }
        });
    }
    sendChat() {
        var sendButton = $("#courseChatSendButton");
        if(!sendButton.length) {
            sendButton = $("#course-dialogue-publish");
        }
        sendButton.trigger('click');
    }
    addParticipants() {
        let userOverviewWrap = $('#course-dialogue:visible');
        let self = this;

        if(userOverviewWrap.length) {
            let {currentChatDialogueDetail, courseList, view_type} = this.props;
            if(typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            }
            let currentChatDialogue, users, courseDetail, dialogue, dialogue_created_by, course_created_by, courseTitle, dialogueTitle, removedUsers = {};
            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
            let allUsers = userOverviewWrap.find('input[name="recipient_id[]"]');
            let domUsers = allUsers.filter(function() {
                return ($(this).attr('data-isnewuser')) ? false: true;
            });
            let list = [];
            let data = {};

            data["type"]='addUpdateParticipant';
            data["added_by_id"] = window.setUserID;
            data["added_by_name"] = setUsername;
            data["user_instance_node_id"] = window.setUserID;
            data["saveType"] = (currentChatDialogueDetail.dialogue_status == 1) ? "P": "D";
            data['default_params'] = {};
            data['default_params']['action'] = 'updateActorList';
            data['default_params']['added_by_id'] = window.setUserID;
            data['default_params']['added_by_name'] = setUsername;

            let guestUsers = getGuestUsers(self.addParticipants.bind(self));
            if(guestUsers.length) {
                return true;
            }
            if(view_type == 'bycourse') {
                removedUsers = currentDialogue.removed_users;
                list = this.getAddedUserList(currentDialogue.users, domUsers);
                let user_ids = this.addActorInUserIdsArray(list);
                if(typeof user_ids != 'undefined' && user_ids.length) {
                    data["user_ids"] = user_ids;
                }
                data["new_user_recepient_node_id"] = list;
                data['default_params']['new_user_recepient_node_id'] = list;

                data["dialogue_node_id"] = currentDialogue.dialogue.dialogue_node_id;
                data["user_recepient_node_id"] = Object.keys(currentDialogue.users).concat(list);
                let course = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)];
                data["course_node_id"] = course.course_node_id;
                data["course_created_by"] = course.created_by;
                data["dialogue_created_by"] = currentDialogue.dialogue.created_by;
                data["course_title"] = course.course;
                data["course_date"] = course.date;
                data["dialogue_date"] = currentDialogue.dialogue.date;
                data["dialogue_title"] = currentDialogue.dialogue.dialogue_title;

                data['default_params']['dialogue_node_id'] = data["dialogue_node_id"];
                data['default_params']['course_node_id'] = data["course_node_id"];
            } else if(view_type == 'bydialogue') {
                list = this.getAddedUserList(currentDialogue.actors, domUsers);
                for(var innerKey in currentDialogue.actors) {
                    let item = currentDialogue.actors[innerKey];
                    if(item.has_removed) {
                        removedUsers[innerKey] = item;
                    }
                };
                data["new_user_recepient_node_id"] = list;
                data['default_params']['new_user_recepient_node_id'] = list;
                data["dialogue_node_id"] = currentDialogue.dialogue_node_id;
                data["user_recepient_node_id"] = Object.keys(currentDialogue.actors).concat(list);
                data["dialogue_title"] = currentDialogue.dialogue_title;
                data["course_node_id"] = currentDialogue.course_node_id;
                data["course_created_by"] = currentDialogue.course_created_by;
                data["dialogue_created_by"] = currentDialogue.dialogue_created_by;
                data["course_title"] = currentDialogue.course;
                data["course_date"] = currentDialogue.date;

            } else if(view_type == 'byactor') {
                list = this.getAddedUserList(currentDialogue.users, domUsers);
                for(var innerKey in currentDialogue.users) {
                    let item = currentDialogue.users[innerKey];
                    if(item.has_removed) {
                        removedUsers[innerKey] = item;
                    }
                };
                data["new_user_recepient_node_id"] = list;
                data['default_params']['new_user_recepient_node_id'] = list;
                data["dialogue_node_id"] = currentDialogue.dialogue_node_id;
                data["user_recepient_node_id"] = Object.keys(currentDialogue.users).concat(list);
                data["dialogue_title"] = currentDialogue.dialogue_title;
                data["course_node_id"] = currentDialogue.course_node_id;
                data["course_created_by"] = currentDialogue.course_created_by;
                data["dialogue_created_by"] = currentDialogue.dialogue_created_by;
                data["course_title"] = currentDialogue.course;
                data["course_date"] = currentDialogue.date;
            }

            let removedUsersList = [];
            if(Object.keys(removedUsers).length && list.length) {
                for(var i = 0; i < list.length; i++) {
                    if(removedUsers[list[i]]) {
                        removedUsersList.push(removedUsers[list[i]].email);
                    }
                }
            }

            if(removedUsersList.length) {
                let tempTxt = (removedUsersList.length > 1) ? 'users' : 'user';
                let alertMessage = 'Removed user can not be added again in the same dialogue. Please remove below '+tempTxt+' from the list to continue. <br />';
                alertMessage = alertMessage + removedUsersList.join(', ');
                bootbox.alert({
                   title: 'Alert',
                    message: alertMessage
                });
                return true;
            }

            if(list.length || guestUsers.length) {
                if(guestUsers.length) {
                    NProgress.start({position: 'full'});
                }
                socket.send(JSON.stringify(data));
                $('.toggle-section-btn').click();
            } else {
                console.log('Error: No new participant selected');
            }
        }
    }
    getAddedUserList(existing_users, dom_users) {
        let list = [];
        dom_users.each(function() {
            if(existing_users[$(this).val()] && existing_users[$(this).val()].has_removed) {
                list.push($(this).val());
            } else if(! existing_users[$(this).val()] ) {
                list.push($(this).val());
            }
        });
        return list;
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
        changeChatView : state.changeChatView,
        showAdminHeader : state.showAdminHeader,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        view_type: state.view_type
    }
}
const ConnectedRightPanelActionButton = connect(mapStateToProps)(RightPanelActionButton);
export default ConnectedRightPanelActionButton;
