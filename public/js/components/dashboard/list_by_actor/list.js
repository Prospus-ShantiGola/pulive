import React from 'react';
import {connect} from 'react-redux';
import NoRecordFound from '../../no_record_found';
import {appendDialogueList, updateChatList, changeChatView} from '../../../actions/actions';
import {modifyChatListForSystemGeneratedMessages, getCount, isUserAdmin} from '../../functions/common_functions';
import ShowImage from '../../show_image';

class ListByActor extends React.Component {

    render() {
        let self = this;
        let {items} = this.props;
        if(typeof items == 'string')  {
            items = JSON.parse(items);
        }
        if(typeof items.status != 'undefined' && items.status == 0){
            return <NoRecordFound msg={items.message}/>
        }
        return (
            <div className="list-detail">
                <div className="nano paneHT">
                    <div className="nano-content">
                        <div className="course-list-panel mainAccordianDiv">
                            {
                                Object.keys(items).map(function(key, index) {
                                    let item = items[key];
                                    let current_class_name = (index == 0) ? 'current': '';
                                    let class_name = (index == 0) ? 'course-list-detail': 'course-list-detail hide';
                                    let tableClass = (index == 0) ? 'table table-style table-responsive table-row actor-list-table ActiveRow ref-inline react-list openup': 'table table-style table-responsive table-row actor-list-table ActiveRow ref-inline react-list';
                                    let user_full_name = item.first_name + ' ' + item.last_name;
                                    let initialName = ((item.first_name.charAt(0)) + (item.last_name.charAt(0))).toUpperCase();
                                    return (
                                        <div className="list-row" key={index}>
                                            <table className={tableClass}>
                                                <tbody>
                                                    <tr className={current_class_name}>
                                                        {/*<td><i className="fa fa-angle-down"></i></td>*/}
                                                        <td className="ref-td">
                                                            <ShowImage
                                                                imagesUrl={item.profile_image}
                                                                classesName={'img-responsive'}
                                                                imageWapperClassName={'actors-user-img-sm'}
                                                                initialName = {initialName}
                                                            />
                                                            <span>{$.trim(user_full_name)}</span>
                                                        </td>
                                                        <td className="ref-td" dangerouslySetInnerHTML={{__html: getCount(item.has_received_notification,'course-count',0)}}></td>
                                                        {/*<td className="ref-td">{item.domain}</td>
                                                        <td className="ref-td">{item.title}</td>
                                                        <td className="ref-td">{item.email_address}</td>
                                                        <td className="ref-td">Go</td>*/}
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className={class_name}>
                                                <div className="inline-course-wrap ref-inline-course-wrap By-actor-section">
                                                    <ul>
                                                        {
                                                            Object.keys(item.dialogue).map(function(key, index) {
                                                                let dialogue = item.dialogue[key];
                                                                let inactiveClass = (dialogue.has_removed == 1) ? 'newDefaultCourseListActor newDefaultCourseList inactive dialogue_list': 'newDefaultCourseListActor newDefaultCourseList dialogue_list';

                                                                return (
                                                                    <li className={inactiveClass} key={key} onClick={(event) => {
                                                                        self.loadChatWindow.call(self, dialogue.dialogue_node_id, item.actor_node_id, dialogue.dialogueStatus, event);
                                                                    }}
                                                                    data-id={dialogue.dialogue_node_id}
                                                                    data-dialogue-title={dialogue.dialogue} data-instance-id={dialogue.dialogue_instance_id}
                                                                    data-course-node-id={dialogue.course_node_id} data-course-title={dialogue.course}
                                                                    data-course-created-by={dialogue.course_created_by} data-dialogue-created-by={dialogue.dialogue_created_by}
                                                                    data-dialogue-status={dialogue.dialogueStatus}

                                                                    >
                                                                        <div className="toggleCourseWrapper">
                                                                            <a className="ref-course-list">
                                                                                <div className="admin-pane">{isUserAdmin(dialogue.dialogue_created_by)}</div>
                                                                                <div className="left inline-left-pane">
                                                                                    <i className="icon dialogue"></i>
                                                                                    <h6>{dialogue.dialogue}</h6>

                                                                                    <span dangerouslySetInnerHTML={{__html: getCount(dialogue.notificationCount,'counter-wrap',0)}}></span>
                                                                                </div>
                                                                            </a>
                                                                        </div>
                                                                        {/* <div className="RightFlyoutOpen add-courses">
                                                                            <i className="icon plus-class rollover"></i>
                                                                        </div> */}
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        $('.loadder').hide();
        this.removeTooltip();
    }
    componentDidUpdate() {
        this.removeTooltip();
    }
    removeTooltip() {
        $(".tooltip").remove();
    }

    loadChatWindow(dialogue_node_id, course_node_id, dialogueStatus, event) {

        let cancelChatEdit = $("#react-button-cancel-edit");
        if(cancelChatEdit.length) {
            cancelChatEdit.trigger('click');
        }
        event.stopPropagation();
        let cancelAddDialogueBtn = $("#react-button-cancel-add-new-dialogue");
        if(cancelAddDialogueBtn.length) {

            let currentTarget = $(event.currentTarget);
            let uniqueId = +new Date;

            currentTarget.attr('data-clicked-id', uniqueId)
            cancelAddDialogueBtn.attr({
                'data-target-id': uniqueId,
                'data-target-type': currentTarget.prop('nodeName').toLowerCase()
            });
            cancelAddDialogueBtn.trigger('click');
            return true;
        }

        let isImageUploading = $("#message-wrap-chat-statement").find('.msg-statement-wrap').find('.dz-image-preview:visible');
        if(isImageUploading.length) { // if image is uploading then do not allow to change different dialogue to load.
            bootbox.alert({
               title: 'Alert',
                message: 'Image upload is in progress, Please wait for it to complete.'
            });
            return false;
        }
        let self = this;
        let listContainer = $("#menudashboard").find('.list-detail');
        let currentElement = listContainer.find('li[data-id="'+dialogue_node_id+'"]');
        currentElement.closest('li').removeClass('current');
        if(!currentElement.hasClass('current')) {
            listContainer.find('.dialogue_list').removeClass('current');

            let currentChatDialogue = {
                currentChatDialogueDetail: {
                    'course_node_id': course_node_id,
                    'dialogue_node_id': dialogue_node_id,
                    dialogue_status: dialogueStatus,
                    expand_course_node_id: course_node_id
                },
                change_chat_view: dialogue_node_id,
                clear_chat_items: true
            };
            currentElement.addClass('current');
            NProgress.start({position: 'middle'});
            $.ajax({
                url: domainUrl+'menudashboard/statementList',
                data: {'dialogue_instance_node_id':dialogue_node_id,'setUserID': window.setUserID, type: 'json'},
                type: 'POST',
                success: function(response) {
                    self.props.dispatch(changeChatView(currentChatDialogue));
                    response = modifyChatListForSystemGeneratedMessages(response);
                    self.props.dispatch(updateChatList(response));
                    existingDialogueSelCourse();
                    manageDialogueHT();
                }
            });
        }
    }

}

const mapStateToProps = (state) => {
    return {
        items: state.courseList
    }
}
const ConnectedListByActor = connect(mapStateToProps)(ListByActor);
export default ConnectedListByActor;
