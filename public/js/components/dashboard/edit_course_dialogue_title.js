import React from 'react';
import {connect} from 'react-redux';
import {editTitle, showAdminHeader} from '../../actions/actions';
import {getCurrentDialogue} from '../functions/common_functions';

class EditCourseDialogueTitle extends React.Component {
    render() {
        return this.getTitleTemplate()
    }

    editDialogueTitle() {

        this.props.dispatch(editTitle({isEditTitle: 1, isEditMode: 'dialogue', showAdminHeader: this.props.showAdminHeader}));
        setTimeout(function () {
            manageDialogueHT();
        });
    }

    editCourseTitle() {
        this.props.dispatch(editTitle({isEditTitle: 1, isEditMode: 'course'}));
        setTimeout(function () {
            manageDialogueHT();
        });
    }

    cancelEditMode() {
        this.props.dispatch(editTitle({isEditTitle: 0, showAdminHeader: this.props.showAdminHeader}));
    }

    updateTitle() {
        let {currentChatDialogueDetail, courseList, isEditMode} = this.props;
        let currentCourse = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)];
        let oldCourseTitle = currentCourse.course;
        let dialogue = currentCourse.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue;
        let oldDialogueTitle = $.trim(dialogue.dialogue_title);
        let dialogue_node_id = dialogue.dialogue_node_id;
        let node_id = currentCourse.course_node_id;
        let course_node_id = currentCourse.course_node_id;
        //let  instance_id = courseList[currentChatDialogueDetail.course_node_id].course_instance_id;
        let new_title = $.trim(this.refs.editTitle.value);
        if (new_title.length == 0) {
            alert('Please enter ' + ucwords(isEditMode) + ' Title');
            return true;
        }
        // check if no changes in dialogue title
        if (oldDialogueTitle == new_title) {
            this.cancelEditMode();
            return true;
        }
        let type = 'updateCourseTitle';
        if (isEditMode == 'dialogue') {
            course_node_id = currentCourse.course_node_id;
            //instance_id = currentCourse.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.dialogue_instance_id;
            node_id = currentCourse.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.dialogue_node_id;
            type = 'updateDialogTitle';
        }
        NProgress.start({position: 'middle'});
        let data = {};
        data["action"] = 'addCourseDialogueActorAndStatement';
        data["course_dialogue_type"] = 'existing';
        data["saveType"] = 'P';
        data["type"] = type;
        data["node_id"] = node_id;
        data["course_node_id"] = course_node_id;
        data["dialogue_node_id"] = dialogue_node_id;
        data["updated_by_id"] = window.setUserID;
        data['course_created_by'] = currentCourse.created_by;
        data['dialogue_created_by'] = dialogue.created_by;
        //data["instance_id"] = instance_id;
        data["new_title"] = new_title;
        data["old_course_title"] = oldCourseTitle;
        data["old_dialogue_title"] = oldDialogueTitle;
        data["user_recepient_node_id"] = Object.keys(courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].users).join(', ');
        data['default_params'] = {
            action: 'updateTitle',
            isEditMode: isEditMode,
            new_title: new_title,
            node_id: node_id,
            course_node_id: course_node_id,
            dialogue_node_id: dialogue_node_id,
            updated_by_id: window.setUserID,
            updated_by_name: setUsername,
            old_course_title: oldCourseTitle,
            old_dialogue_title: oldDialogueTitle,
        }
        socket.send(JSON.stringify(data));


    }
    getEditDialogueTitleTmpl(isEditTitle, editTitle, dialogueTitle) {
        if(isEditTitle) {
            return (
                <div className="receivedListBox form-input dialogue-edit-container">
                    <input type="text" defaultValue={editTitle} maxLength={COURSE_DIALOGUE_TITLE_LENGTH} className="form-control input-field" ref="editTitle"/>
                    <span className="edit-exist-icons-wrap">
                        <i className="icon tick" onClick={this.updateTitle.bind(this)}></i>
                        <i className="icon close" onClick={this.cancelEditMode.bind(this)}></i>
                    </span>
                </div>
            )
        }
        return (
            <span className="hover_rename_box dialogue_rename_view_mode">
                <span className="ellipsis-text">{dialogueTitle}</span>
                <span className="edit-wrap" onClick={this.editDialogueTitle.bind(this)}>
                <i className="icon sm-edit"></i></span>
            </span>
        )
    }

    getTitleTemplate() {
        let {currentChatDialogueDetail, courseList, isEditTitle, isEditMode, view_type} = this.props;
        if(typeof courseList == 'string') {
            courseList = $.parseJSON(courseList);
        }
        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
        let courseTitle = currentDialogue.course;
        let dialogue, users;
        let created_by_index, dialogueTitle;
        // debugger;
        if (view_type == 'bycourse') {
            dialogue = currentDialogue.dialogue;
            dialogueTitle = dialogue.dialogue_title;
            courseTitle = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].course;
            users = currentDialogue.users;
            created_by_index = 'created_by';
        } else if (view_type == 'byactor') {
            currentDialogue.dialogue_title = currentDialogue.dialogue;
            dialogue = currentDialogue;
            users = currentDialogue.users;
            created_by_index = 'dialogue_created_by';
            dialogueTitle = dialogue.dialogue_title;
        } else {
            currentDialogue.dialogue_title = currentDialogue.dialogue;
            dialogue = currentDialogue;
            users = currentDialogue.actors;
            created_by_index = 'dialogue_created_by';
            dialogueTitle = dialogue.dialogue_title;
        }
        let adminUser = '', adminProfileImage = '', adminInitialName = '';
        if (users[dialogue[created_by_index]]) {
            adminUser = users[dialogue[created_by_index]].first_name + ' ' + users[dialogue[created_by_index]].last_name;
            adminProfileImage = users[dialogue[created_by_index]].profile_image;
            adminInitialName = ((users[dialogue[created_by_index]].first_name.charAt(0)) + (users[dialogue[created_by_index]].last_name.charAt(0))).toUpperCase();
        }

        let editTitle = courseTitle;
        if (isEditMode == 'dialogue') {
            editTitle = dialogueTitle;
        }

        // if (isEditTitle) {
        //     return (
        //         <div className="existLeftPanel">
        //             <span className="editExistTitle clearfix show">
        //                     <span className="edit-exist-input-wrap">
        //                         <input type="text" defaultValue={editTitle} className="form-control input-field"
        //                                ref="editTitle"/>
        //                     </span>
        //                     <span className="edit-exist-icons-wrap">
        //                         <i className="icon close" onClick={this.cancelEditMode.bind(this)}></i>
        //                         <i className="icon tick" onClick={this.updateTitle.bind(this)}></i>
        //                     </span>
        //                 </span>
        //         </div>
        //     )
        // }


        return (

            <div className="view-course-pane">
                  <div className="panel-group" id="course-dialogue-view" role="tablist" aria-multiselectable="true">
                    <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingOne">
                          <h4 className="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-default" aria-expanded="true" aria-controls="collapseOne">
                                <div className="course-col">
                                    <span className="course-left-pane"><i className="icon-sm course-white"></i><span>Course</span></span>
                                    <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                </div>
                            </a>
                          </h4>
                        </div>
                        <div id="course-default" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                          <div className="panel-body">
                              <div className="form-row">
                                  <label className="form-label">Course Title</label>
                                  <span className="form-input"><span className="existCourseTitle">{courseTitle}</span></span>
                              </div>
                              <div className="form-row">
                                  <label className="form-label">Admin</label>
                                  <span className="form-input">
                                      <div className="user-temp">
                                                <span className="img">{adminProfileImage ? <img src={adminProfileImage}/> : <span className="initials-box">{adminInitialName}</span>}</span>
                                                <span className="name">{adminUser}</span>
                                            </div>
                                  </span>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingTwo">
                          <h4 className="panel-title">
                            <a className="collapsed" role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-dialogue" aria-expanded="false" aria-controls="collapseTwo">
                                <div className="course-col">
                                    <span className="course-left-pane"><i className="icon-sm dialogue-white"></i><span className="course-title">Dialogue</span></span>
                                    <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                </div>
                            </a>
                          </h4>
                        </div>
                        <div id="course-dialogue" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                          <div className="panel-body">
                              <div className="form-row">
                                  <label className="form-label">Dialogue Title</label>
                                  {this.getEditDialogueTitleTmpl(isEditTitle, editTitle, dialogueTitle)}

                              </div>
                              <div className="form-row">
                                  <label className="form-label">Participant(s)</label>
                                   <div className="receivedListBox form-input">
                                      <div>
                                            <input type="hidden" id="individual_user_id" name="individual_user_id"/>
                                            <input type="hidden" id="individual_user_name" name="individual_user_name"/>
                                            <input type="hidden" id="individual_user_initial_name"
                                                   name="individual_user_initial_name"/>
                                            <input type="hidden" id="individual_user_image"
                                                   name="individual_user_image"/>
                                            <input type="text" id="individual_user_list" name="individual_user_list"
                                                   className="form-control input-field email_info auto-suggest"
                                                   placeholder="Email" data-validation-rules="empty,email"
                                                   data-is-multiple="1"
                                                   data-multiple-selector="input[name='recipient_id[]']"
                                                   autoComplete="off"/>
                                           <input type="hidden" id="is_new_user" name="is_new_user" value=""/>
                                            <i className="icon tick addCourseDialogueList"></i>
                                        </div>
                                        <div id="individualAutoCompleteBox" className="clearfix">
                                            <div
                                                className="addNiceScrollWrapper clearfix global_participant_scroll_wrap"
                                                tabIndex="12">
                                                {
                                                    Object.keys(users).filter(function (key) {
                                                        if (users[key].has_removed) {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).map(function (key) {
                                                        let user = users[key];
                                                        if (user.user_id == window.setUserID) {
                                                            return null;
                                                        }
                                                        return (

                                                            <div
                                                                className="user-temp global_participant_box_wrap recRightPanel react-existing-user"
                                                                key={key}>
                                                                <span className="img">{user.profile_image ?
                                                                    <img src={user.profile_image}/> : <span
                                                                        className="initials-box">{((user.first_name.charAt(0)) + (user.last_name.charAt(0))).toUpperCase()}</span>}</span>
                                                                <span className="name">
                                                                    {user.first_name + ' ' + user.last_name}
                                                                    <input type="hidden" data-userEmail={user.email}
                                                                           data-userName={user.first_name + ' ' + user.last_name}
                                                                           data-userInitial = {((user.first_name.charAt(0)) + (user.last_name.charAt(0))).toUpperCase()}
                                                                           data-userImage = {user.profile_image}
                                                                           name="recipient_id[]"
                                                                           defaultValue={user.user_id}/>
                                                                </span>
                                                                <span className="close-sm"><i
                                                                    className="icon close removeDialogueList"></i></span>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                  </div>
                              </div>
                          </div>
                        </div>
                    </div>
                  </div>
            </div>

        )





        return (
            <span className="">
                        <div className="existLeftPanel">
                            <span className="hover_rename_box course_rename_view_mode prevent_click">
                                <span className="existCourseTitle">{courseTitle}</span>
                                <span className="edit-wrap"> <i className="icon sm-edit"></i></span>
                            </span>
                            {/*<span className="hover_rename_box course_rename_view_mode">
                             <span className="ellipsis-text">{courseTitle}</span>
                             <span className="edit-wrap" onClick={this.editCourseTitle.bind(this)}> <i className="icon sm-edit"></i></span>
                             </span>*/}
                            <span className="colonDots">:</span>
                        <span className="hover_rename_box dialogue_rename_view_mode">
                            <span className="ellipsis-text">{dialogueTitle}</span>
                            <span className="edit-wrap" onClick={this.editDialogueTitle.bind(this)}> <i
                                className="icon sm-edit"></i></span>
                        </span>
                        <div className="user-overview-wrap admin-header-js hide">
                        <ul className="user-overview-box">
                            <li className="clearfix">
                                <div className="left admin-title-box">
                                    <span className="admin-title">Admin</span>
                                    <span className="colonDot">:</span>
                                </div>
                                {/*<div className="right admin-info-box">
                                 <span className="admin-info clearfix"><i className="icon user-update pull-left"></i><span>{adminUser}</span></span>
                                 </div>*/}

                                <div className="user-temp">
                                    <span className="img">{adminProfileImage ? <img src={adminProfileImage}/> :
                                        <span className="initials-box">{adminInitialName}</span>}</span>
                                    <span className="name">{adminUser}</span>
                                </div>

                            </li>

                            <li className="clearfix">
                                <div className="left admin-title-box">
                                    <span className="participant-title">Participant(s)</span>
                                    <span className="colonDot">:</span>
                                </div>
                                <div className="right admin-info-box">
                                    <span className="participant-info clearfix">
                                        <div>
                                            <input type="hidden" id="individual_user_id" name="individual_user_id"/>
                                            <input type="hidden" id="individual_user_name" name="individual_user_name"/>
                                            <input type="hidden" id="individual_user_initial_name"
                                                   name="individual_user_initial_name"/>
                                            <input type="hidden" id="individual_user_image"
                                                   name="individual_user_image"/>
                                            <input type="text" id="individual_user_list" name="individual_user_list"
                                                   className="form-control input-field email_info auto-suggest"
                                                   placeholder="Email" data-validation-rules="empty,email"
                                                   data-is-multiple="1"
                                                   data-multiple-selector="input[name='recipient_id[]']"
                                                   autoComplete="off"/>
                                            <i className="icon tick addCourseDialogueList"></i>
                                        </div>
                                        <div id="individualAutoCompleteBox" className="clearfix">
                                            <div
                                                className="addNiceScrollWrapper clearfix global_participant_scroll_wrap"
                                                tabIndex="12">
                                                {
                                                    Object.keys(users).filter(function (key) {
                                                        if (users[key].has_removed) {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).map(function (key) {
                                                        let user = users[key];
                                                        if (user.user_id == window.setUserID) {
                                                            return null;
                                                        }
                                                        return (

                                                            <div
                                                                className="user-temp global_participant_box_wrap recRightPanel react-existing-user"
                                                                key={key}>
                                                                <span className="img">{user.profile_image ?
                                                                    <img src={user.profile_image}/> : <span
                                                                        className="initials-box">{((user.first_name.charAt(0)) + (user.last_name.charAt(0))).toUpperCase()}</span>}</span>
                                                                <span className="name">
                                                                    {user.first_name + ' ' + user.last_name}
                                                                    <input type="hidden" data-userEmail={user.email}
                                                                           data-userName={user.first_name + ' ' + user.last_name}
                                                                           data-userInitial = {((user.first_name.charAt(0)) + (user.last_name.charAt(0))).toUpperCase()}
                                                                           data-userImage = {user.profile_image}
                                                                           name="recipient_id[]"
                                                                           defaultValue={user.user_id}/>
                                                                </span>
                                                                <span className="close-sm"><i
                                                                    className="icon close removeDialogueList"></i></span>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </li>

                        </ul>
                    </div>
                    </div>
                    <div className="existRightPanel expanArrowBox" onClick={this.showAdminHeader.bind(this)}>
                      <span className="active course-action">
                          <i className="icon toggle-section-btn collapse-up"></i>
                      </span>
                  </div>
                </span>
        )

    }

    showAdminHeader() {
        if ($('.existLeftPanel').find('.admin-header-js').hasClass('hide')) {
            this.props.dispatch(showAdminHeader({showAdminHeader: 0}));
        } else {
            this.props.dispatch(showAdminHeader({showAdminHeader: 1}));
        }
        niceScrollDialogue();
        console.log('admin menu');
    }

    // componentDidMount() {
    //     courseTitleTruncate();
    // }
    // componentDidUpdate() {
    //     courseTitleTruncate();
    // }
}


const mapStateToProps = (state) => {
    return {
        isEditTitle: state.isEditTitle,
        isEditMode: state.isEditMode,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        view_type: state.view_type,
        showAdminHeader: state.showAdminHeader
    }
}
const ConnectedEditCourseDialogueTitle = connect(mapStateToProps)(EditCourseDialogueTitle);
export default ConnectedEditCourseDialogueTitle;
