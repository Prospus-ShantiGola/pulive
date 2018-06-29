import React from 'react';
import {connect} from 'react-redux';
import RightActionBar from './right_action_bar';
import ListSection from './sections/list';
import ChatSection from './sections/chat';
import { withRouter } from 'react-router-dom'
import {addNewCourse, updateCourseList, changePageName, appendCourseList, updateViewType,updateSearchString} from '../../actions/actions';
import {appendNewDialogue} from '../../actions/add_new';
import HeaderNotification from '../header_notification';


class Dashboard extends React.Component {
    render() {
        return (
            <span className="flex-item">
                <ListSection/>
                <ChatSection/>
                <RightActionBar />
            </span>

        )
    }

    componentDidMount() {
        self = this;
        $("#nav, #courseTemplateFlyout").removeClass('in');
        let params = {page_name: 'inbox'};

        $("#edit_chat_statement").remove();
        if(!this.props.view_type){
            console.log('view_type : ',this.props.view_type);
            this.props.dispatch(updateViewType({view_type : 'bycourse'}));
        }
        this.props.dispatch(changePageName(params));
        let navigationPane = $('#navigationPane');
        if(navigationPane.find('li.active').length > 1) {
            navigationPane.find('li.active:not(:first)').removeClass('active');
        }
        /*let courseList = this.props.courseList;
        if (typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        }
        if(!courseList || !Object.keys(courseList).length || courseList.status == 0) {*/
            var data = {};
            if(window.cid) {
                data.course_node_id = window.cid;
                data.setUserID = window.setUserID;
            }
            if(window.did) {
                data.dialogue_node_id = window.did;
            }
            if(window.pid) {
                data.production_node_id = window.pid;
            }
            $.ajax({
                url: domainUrl + "inbox",
                type: 'post',
                data: data,
                success: function(response) {
                    response = JSON.parse(response);
                    let courseList;
                    if(!window.pid && window.cid) {
                        courseList = response;
                        self.props.dispatch(appendCourseList({course_list: courseList, view_type: 'bycourse'}));
                    }
                    else if(window.pid){
                        let menudashboard = $("#menudashboard");
                        menudashboard.find('li[data-production-course-id="' + " " + $.trim(window.cid) + '"] .collapsedCourseBox').addClass('expandedCourseBox');
                        menudashboard.find('li.main_production_list[data-id="' + window.pid + '"]').addClass('current');
                        /*if(self.props.user_type != 'guest') {
                            menudashboard.find('li.main_production_list[data-id="' + window.pid + '"] .productionlistTitle').trigger("click");
                        }*/
                        menudashboard.find('li.main_production_list[data-id="' + window.pid + '"] .productionlistTitle').trigger("click");
                        $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                    }
                    else{
                        courseList = response.data.course_list;
                        self.props.dispatch(appendCourseList({course_list: courseList, view_type: 'bycourse'}));
                    }
                    NProgress.done();
                    applyScroller();
                }
            });
        /*} else {
            applyScroller();
            NProgress.done();
        }*/
        let {user_type, currentChatDialogueDetail} = this.props;
        if(typeof currentChatDialogueDetail != 'undefined' && currentChatDialogueDetail.dialogue_node_id) { // for guest user, load chat list for selected dialogue
            setTimeout(function() {
                $(".dialogue_row[data-id='" +currentChatDialogueDetail.dialogue_node_id+ "']").trigger('click');
            });
        }

    }
    componentWillUnmount() {
        NProgress.start({position: 'full'});
        let searchWrapper = $('.dashboardSearchJs');
        let searchIcon = searchWrapper.find('i');
        if(searchIcon.hasClass('close_icon')){
            searchIcon.removeClass('close_icon').addClass('search');
        }
        searchWrapper.find('input').val('');
        this.props.dispatch(updateSearchString(''));
    }
    isCourseAndDialogueViewSame(data) {
        let currentChatDialogueDetail = this.props.currentChatDialogueDetail;
        if (!currentChatDialogueDetail) return false;
        if (!currentChatDialogueDetail.course_node_id) return false;
        if (!currentChatDialogueDetail.dialogue_node_id) return false;

        if (($.trim(data.course_node_id) == $.trim(currentChatDialogueDetail.course_node_id)) && $.trim(data.dialogue_node_id) == $.trim(currentChatDialogueDetail.dialogue_node_id)) {
            return true;
        }
        return false;
    }


    appendAddNewCourseButton(append_cancel_btn) {
        let reactButtonCancelAddNewCourse = $("#react-button-cancel-add-new-course");
        if (reactButtonCancelAddNewCourse.length) {
            reactButtonCancelAddNewCourse.remove();
            $('.course-list-panel-additional').remove();
        }
        var buttonWrapper = $('#course_action_menu'), self = this;
        if (append_cancel_btn) {
            var cancelBtn = $('<a />').on('click', function () {
                self.cancelAddNewCourse();
            }).attr({
                href: 'javascript:void(0)',
                id: 'react-button-cancel-add-new-course'
            });
            cancelBtn.append('<i class="icon cancel"></i><br><span>Cancel</span>');
            buttonWrapper.append(cancelBtn);
            return true;
        }
        $("#react-button-add-new-course").remove();

        var publishBtn = $('<a />').on('click', function () {
            var _this = $(this);
            var addNewDialogueBtn = $('#react-button-cancel-add-new-dialogue:visible');
            if (addNewDialogueBtn.length) {
                bootbox.confirm({
                   title: 'Confirm',
                    message: 'Are you sure you want to cancel?',
                    callback: function (state) {
                        if (state) {
                            addNewDialogueBtn.remove();
                            _this.trigger('click');
                        }
                    }
                });
                return true;
            }
            self.showCreateNewCourseForm('add_new_course');
        }).attr({
            href: 'javascript:void(0)',
            id: 'react-button-add-new-course'
        }).addClass('hide');
        publishBtn.append('<i class="icon publish"></i><br><span>Add New Course</span>');
        buttonWrapper.append(publishBtn);
    }

    appendAddNewCourseTemplateButton(append_cancel_btn) {
        var buttonWrapper = $('#course_action_menu'), self = this;
        $("#react-button-savedraft-new-template-course").remove();
        $("#react-button-publish-new-template-course").remove();
        $("#react-button-cancel-add-new-course").remove();
        $('.course-list-panel-additional').remove();
        $("#react-button-add-new-template-course").remove();

        var saveDraftBtn = $('<a />').on('click', function () {
            self.saveDraftProductionTemplate("add_new_template");
        }).attr({
            href: 'javascript:void(0)',
            id: 'react-button-savedraft-new-template-course'
        }).addClass('hide');
        saveDraftBtn.append('<i class="icon publish"></i><br><span>Save as Draft</span>');
        buttonWrapper.append(saveDraftBtn);

        var savePublishBtn = $('<a />').on('click', function () {
            self.savePublishProductionTemplate("add_new_template");
        }).attr({
            href: 'javascript:void(0)',
            id: 'react-button-publish-new-template-course'
        }).addClass('hide');
        savePublishBtn.append('<i class="icon publish"></i><br><span>Publish</span>');
        buttonWrapper.append(savePublishBtn);
        var publishBtn = $('<a />').on('click', function () {
            var _this = $(this);
            var addNewDialogueBtn = $('#react-button-cancel-add-new-dialogue:visible');
            if (addNewDialogueBtn.length) {
                bootbox.confirm({
                   title: 'Confirm',
                    message: 'Are you sure you want to cancel?',
                    callback: function (state) {
                        if (state) {
                            addNewDialogueBtn.remove();
                            _this.trigger('click');
                        }
                    }
                });
                return true;
            }
            self.showCreateNewCourseForm("add_new_template");
        }).attr({
            href: 'javascript:void(0)',
            id: 'react-button-add-new-template-course'
        }).addClass('hide');
        publishBtn.append('<i class="icon publish"></i><br><span>Add New Course</span>');
        buttonWrapper.append(publishBtn);
    }


    saveDraftProductionTemplate() {
        $("#saveDraftProduction").trigger("click");
    }

    savePublishProductionTemplate() {
        $("#savePublishProduction").trigger("click");
    }



}

const mapStateToProps = (state) => {
    return {
        view_type: state.view_type,
        chatItems: state.chatItems,
        chatType: state.chatType,
        updaetd_timestamp: state.updaetd_timestamp,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        header_notification: state.header_notification,
        user_type: state.user_type
    }
}

const ConnectedDashboard = withRouter(connect(mapStateToProps)(Dashboard));
export default ConnectedDashboard;
