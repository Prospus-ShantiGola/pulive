import React from 'react';
import {appendDialogueList, updateChatList, changeChatView} from '../../../actions/actions';
import {addNewDialogue, showAddNewDialogueForm} from '../../../actions/add_new';
import {connect} from 'react-redux';
import {modifyChatListForSystemGeneratedMessages,getCount,highlightSearch} from '../../functions/common_functions';
import NoRecordFound from '../../no_record_found';
import ShowImage from '../../show_image';

class DialogueList extends React.Component {
    render() {
        let self = this, course = self.props.course;
        let is_active_course = self.props.activeCourse;
        let displayClass = 'collapsedCourseBox clearfix';
        if(course.dialogue[0] && !is_active_course) {
            displayClass += ' expandedCourseBox';
        }
        if(is_active_course) {
            displayClass += ' expandedCourseBox';
        }
        let addCourseClass = 'add-courses active dropdown dialogue-drp';
        if(this.props.user_type == 'guest') {
            addCourseClass += ' inactive';
        }
        return (
            <li className="courseDialogueDefaultWrap newDefaultCourseList dialogue_list_wrapper" data-course-instance-id={course.course_node_id}
                onClick={e => {self.loadDialogueList.call(self, course)}}>
                <div className="toggleCourseWrapper">
                    {/*<div className="toggle-courses active"><i className="fa collapse-down fa-angle-up collapse-up"></i></div>*/}
                    <a className="ref-course-list">
                        <div className="left inline-left-pane">
                            <i className="icon dialogue"></i>
                            <h6 dangerouslySetInnerHTML={{__html: 'Dialogues' + getCount(self.props.dialogueCount,'count-list',1)}}></h6>
                        </div>
                    </a>
                </div>
                <div className={addCourseClass}
                    onClick={event => {self.showOptionsList.call(self, event)}}>
                    <i className="icon plus-class rollover"></i>
                    <ul className="dropdown-menu StatementType ft rightDrpShow" aria-labelledby="dropLetterExists">
                        <li><a href="javascript:void(0)"><span>Select</span><i className="icon plus dialogue-drp-close"></i></a></li>
                        <li>
                            <a href="javascript:void(0)" onClick={event => {self.addDialogue.call(self, event, 'Chat')}}>
                                <i className="icon chatIcon"></i><span>Chat</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a href="javascript:void(0)">
                                <i className="icon letterIcon"></i><span>Letter</span>
                            </a>
                        </li>
                        <li className="disabled"><a href="javascript:void(0)"><i className="icon chatIcon"></i><span>Forum</span></a></li>
                        <li className="disabled"><a href="javascript:void(0)"><i className="icon chatIcon"></i><span>Q&A</span></a></li>
                        <li className="disabled"><a href="javascript:void(0)"><i className="icon chatIcon"></i><span>Video Call</span></a></li>
                        <li className="disabled"><a href="javascript:void(0)"><i className="icon chatIcon"></i><span>Voice Call</span></a></li>
                    </ul>
                </div>

                <div className={displayClass}>
                    {
                        this.getAddNewDialogueUntitledRow(course)
                    }
                    <ul className="clearfix" ref="dialogueTitleList">
                        {
                            this.getList(course)
                        }
                    </ul>
                </div>

            </li>
        )
    }
    highlightSearch(){
        if (this.props.searchString != '') {
            highlightSearch($(this.refs.dialogueTitleList).find('.courseTitle'), this.props.searchString)
        }
    }

    getAddNewDialogueUntitledRow(course) {
        let self = this;
        let currentChatDialogueDetail = self.props.currentChatDialogueDetail;
        // console.log(self.props.currentChatDialogueDetail);
        if(currentChatDialogueDetail && currentChatDialogueDetail.chat_view_type == 'add_new_dialogue' && $.trim(currentChatDialogueDetail.course_node_id) == $.trim(course.course_node_id)) {

            $(".course-list-detail:visible").find('.dialogue_list.current').removeClass('current');

            setTimeout(function() {
                if($("#react-button-cancel-add-new-course").length && !$('.add-new-dialogue-untitled').length ) {
                    return true;
                }
                let course_action_menu = $("#react-button1");
                $('#react-button-cancel-add-new-dialogue').remove();

                let cancelBtn = $('<a />').attr({
                    href: 'javascript:void(0)',
                    id: 'react-button-cancel-add-new-dialogue'
                }).on('click', function() {
                    let _this = $(this);

                    bootbox.confirm({
                        title: 'Confirm',
                        message: 'Are you sure you want to cancel?',
                        callback: function(state) {
                            if(state) {
                                let currentChatDialogue = {
                                    change_chat_view: 0,
                                    chat_view_type: 0,
                                    currentChatDialogueDetail: {
                                        expand_course_node_id: course.course_node_id
                                    }
                                };
                                self.props.dispatch(changeChatView(currentChatDialogue));
                                let targetId = _this.attr('data-target-id');
                                let targetType = _this.attr('data-target-type');
                                _this.remove();
                                if(targetType && targetId) {
                                    let targetElement = targetType + "[data-clicked-id='" + targetId + "']";
                                    $(targetElement).click();
                                }
                            }
                        }
                    });
                }).append('<i class="icon cancel"></i><br><span>Cancel</span>');
                course_action_menu.parent().addClass('multiple-child').append(cancelBtn);
            }, 100);

            return (
                <ul className="clearfix add-new-dialogue-untitled-wrapper" onClick={e => {self.doNothing(e)}}>
                    <li className="add-dialogue current dialogue_row add-new-dialogue-untitled">
                        <div className="subCollapsedCourseBox">
                            <div className="courseTitle"><i className="icon-sm left chat"></i><span>Untitled</span></div>
                            <div className="updateCourseTitle"><div className="actors-list grp-actor-list"><span><div className="actors-user-img-sm actor-admin">{profileImage ? <img src={profileImage}/> : <span className="initials-box">{initialName}</span>}</div></span></div></div>
                        </div>
                    </li>
                </ul>
            )
        }
        return null;
    }
    doNothing(event) {
        event.stopPropagation();
        return false;
    }
    showOptionsList(event) {
        event.stopPropagation();
        if(this.props.user_type == 'guest') {
            window.location.hash = '#register';
            return true;
        }
        openDialogueOptionsDrop($(event.target).parent());
    }
    addDialogue(event, chat_type) {
        let courseList = this.props.courseList;
        if(typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        }
        event.stopPropagation();
        let menudashboard = $("#menudashboard");
        let activeTable = menudashboard.find('.react-list.openup');
        if(!activeTable.length) {
            activeTable = $('.course-list-detail:visible').prev();
        }
        let data = activeTable.data();
        let currentChatDialogue = {
            'course_node_id': data.courseNodeId,
            chat_view_type: 'add_new_dialogue',
            expand_course_node_id: data.courseNodeId
        };

        this.props.dispatch(changeChatView({
                chatType: chat_type,
                currentChatDialogueDetail: currentChatDialogue,
                change_chat_view: 1,
                clear_chat_items: 1
            })
        );
        setTimeout(function() {
            manageDialogueHT();
            let nextElement = activeTable.next();
            if(!nextElement.find('.collapsedCourseBox:visible').length) { // open dialogue list
                nextElement.find('.dialogue_list_wrapper').trigger('click');
            }
            let currentNodeId = ' ' + $.trim(data.courseNodeId);
            let currentCourse = courseList[currentNodeId];
            if(!Object.keys(currentCourse.dialogue).length) {
                var ajaxParams = {'course_instance_id': currentCourse.course_instance_id, 'user_instance_node_id': window.setUserID};
                let targetArrow = menudashboard.find('li[data-course-instance-id="'+currentNodeId+'"]').find('.toggleCourseWrapper').find('.collapse-down');
                targetArrow.removeClass('fa-angle-up').addClass('fa-angle-down');
                NProgress.start({position: 'middle'});

                $.ajax({
                    url: domainUrl + 'menudashboard/dialogueList',
                    type: 'post',
                    data: ajaxParams,
                    success: function(response) {
                        let dialogueList = response;
                        self.props.dispatch(appendDialogueList({response: response, course_node_id: data.courseNodeId}));

                        setTimeout(function() {
                            self.forceUpdate();
                            NProgress.done();
                        }, 500);
                    }
                });
            }

        });
        $('.background-layer').trigger('click');
    }
    getList(course) {

        if(typeof course.dialogue.status != 'undefined' && course.dialogue.status == 0) {
            return (
                <li>
                    <NoRecordFound msg={course.dialogue.message}/>
                </li>
            )

        }
        let self = this;
        if(!Object.keys(course.dialogue).length) {
            return null;
        }
        let dialogues;
        if(typeof course.dialogue == 'string') {
            dialogues = JSON.parse(course.dialogue);
        } else {
            dialogues = JSON.parse(JSON.stringify(course.dialogue));
        }

        return (
            Object.keys(dialogues).map(function(key, index) {

                if(key == 'course_node_id') {
                    return null;
                }
                let dialogue = dialogues[key].dialogue, notificationClass = 'counter-wrap hide';
                let dialogueCreatedBy = dialogue.created_by;
                let users = dialogues[key].users;
                /*let userNames = Object.keys(users).map(function(id) {
                    if(id == setUserID && dialogue.created_by != setUserID){
                        return 'You';
                    }
                    let user = users[id];
                    return user.first_name +' '+ user.last_name;

                });
                let admin = '';
                if(dialogue.created_by){
                    admin = users[dialogue.created_by].first_name + ' ' + users[dialogue.created_by].last_name;
                    userNames.splice( $.inArray(admin,userNames) ,1 );
                    if(dialogue.created_by == setUserID) {
                        admin = 'You';
                    }
                }

                userNames = userNames.join(', ');*/
                if(dialogue.notificationCount) {
                    notificationClass = 'counter-wrap';
                }
                let liClass = "dialogue_list dialogue_row";
                if(self.props.activeCourse) {
                    if(self.props.currentChatDialogueDetail && dialogue.dialogue_node_id == self.props.currentChatDialogueDetail.expand_dialogue_node_id) {
                        liClass += " current";
                    }
                }
                return (
                    <li className={liClass} key={key} data-id={dialogue.dialogue_node_id} onClick={(event) => {
                        self.loadChatWindow.call(self, dialogue.dialogue_node_id, course.course_node_id, dialogue.dialogueStatus, event);
                    }} data-dialogue-title={dialogue.dialogue_title} data-instance-id={dialogue.dialogue_instance_id} data-dialogue-status={dialogue.dialogueStatus} data-dialogue-created-by={dialogue.created_by}>
                        <div className="subCollapsedCourseBox">
                            <div className="courseTitle"><i className="icon-sm left chat"></i><span>{dialogue.dialogue_title}</span></div>
                            <div className="updateCourseTitle">
                                {/*<i className="icon plural-user"></i><span><span className="admin-user">{admin}</span>{(userNames.length && admin.length) ? ', ' : ''}{userNames}</span>*/}
                                <div className="actors-list grp-actor-list">
                                    <ShowImage
                                        imagesUrl={users}
                                        classesName={'img-responsive'}
                                        imageWapperClassName={'actors-user-img-sm'}
                                        dialogueCreatedBy = {dialogueCreatedBy}
                                    />
                                </div>
                            </div>
                            <div className={notificationClass}><span>{dialogue.notificationCount}</span></div>
                        </div>
                    </li>
                )
            })
        )
    }
    loadDialogueList(course) {
        let course_node_id = course.course_node_id;
        let courseList = this.props.courseList, self = this;

        let currentDialogueDomElement = $("#menudashboard").find('li[data-course-instance-id="'+course_node_id+'"]');
        let dialogueWrapper = currentDialogueDomElement.find('.collapsedCourseBox');

        let arrowBtn = currentDialogueDomElement.find('.toggleCourseWrapper:first').find('.collapse-up');

        if(dialogueWrapper.hasClass('expandedCourseBox') && dialogueWrapper.find('li').length) {
            arrowBtn.addClass('fa-angle-up').removeClass('fa-angle-down');
            dialogueWrapper.removeClass('expandedCourseBox');
        } else {
            arrowBtn.addClass('fa-angle-down').removeClass('fa-angle-up');
            dialogueWrapper.addClass('expandedCourseBox');
        }

        if(typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        }
        let currentCourse = courseList[' ' + $.trim(course_node_id)];
        if(Object.keys(currentCourse.dialogue).length) {
            return true;
        }

        NProgress.start({position: 'middle'});

        var ajaxParams = {'course_instance_id': course.course_instance_id, 'user_instance_node_id': window.setUserID};
        $.ajax({
            url: domainUrl + 'menudashboard/dialogueList',
            type: 'post',
            data: ajaxParams,
            success: function(response) {
                let dialogueList = response;
                self.props.dispatch(appendDialogueList({response: response, course_node_id: course_node_id}));

                setTimeout(function() {
                    self.forceUpdate();
                    NProgress.done();
                }, 500);
            }
        });
    }
    loadChatWindow(dialogue_node_id, course_node_id, dialogueStatus, event) {
        nanoScrollDown = true;
        // console.log($(event.currentTarget));
        $('.production_list.current').removeClass('current');
        localStorage.setItem('prev_dialogue_node_id',dialogue_node_id);
        if(localStorage.getItem('dialogue_node_id')){
            localStorage.setItem('prev_dialogue_node_id',localStorage.getItem('dialogue_node_id'));
        }
        localStorage.setItem('dialogue_node_id',dialogue_node_id);
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
        let listContainer = $("#menudashboard").find('.listing-wrapper');
        let currentElement = listContainer.find('li[data-id="'+dialogue_node_id+'"]');
        currentElement.closest('li').removeClass('current');
        if(!currentElement.hasClass('current')) {
            listContainer.find('.dialogue_list').removeClass('current');

            let currentChatDialogue = {
                currentChatDialogueDetail: {
                    'course_node_id': course_node_id,
                    'dialogue_node_id': dialogue_node_id,
                    dialogue_status: dialogueStatus,
                    expand_course_node_id: course_node_id,
                    expand_dialogue_node_id: dialogue_node_id,
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
    componentDidUpdate(){
        this.highlightSearch();
    }
    componentDidMount(){
        this.highlightSearch();
    }
}

const mapStateToProps = (state) => {
    return {
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        user_type: state.user_type,
        searchString: state.searchString
    }
}
const ConnectedDialogueList = connect(mapStateToProps)(DialogueList);
export default ConnectedDialogueList;
