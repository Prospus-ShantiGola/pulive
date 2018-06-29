import React from 'react';
import {connect} from 'react-redux';
import {
    activeMpApp,
    manageHeaderNotification,
    expandListView,
    appendDialogueList,
    updateChatList,
    changeChatView,
    updateCourseList,
    updateNotificationStatus,
    manageHeaderNotificationCount,
    appendProductionList,
    appendProductionStart,
    activeFilter
} from '../actions/actions';
import NoRecordFound from './no_record_found';
import {
    modifyChatListForSystemGeneratedMessages,
    highlightActionMenuAccordingly,
    getRedirectLink
} from './functions/common_functions';
import {Redirect} from 'react-router-dom';

class HeaderNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: 0
        }
    }

    render() {
        /*if (this.state.redirect) {
            return <Redirect to={getRedirectLink()['inbox']}/>
        }*/
        return (
            <span>
                <div className="popover courseNotification-panel bottom">
                    <div className="arrow"></div>

                    <h3 className="popover-title">Notifications</h3>
                    <div className="popover-content manageHT">
                      <div className="nano">
                        <div className="nano-content">
                          <ul>
                              {(this.state.redirect) ? <Redirect to={getRedirectLink()['inbox']}/> : this.getNotification()}
                              <div className="sm-flex-loader notification-loader-js"><img src="public/img/sm-spinner.gif"/></div>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>
                <div className="popover-overlay"></div>
                <button className="loadNotiication hide" onClick={this.loadNotiication.bind(this)}></button>
        </span>
        )
    }

    loadNotiication(e) {
        let self = this;
        self.setState({redirect: 0});
        let courseNotificationPanel = $(".courseNotification-panel");
        if (courseNotificationPanel.hasClass('show')) {
            courseNotificationPanel.removeClass('show');
        } else {
            //Reset Notification Count

            self.props.dispatch(manageHeaderNotificationCount({'status': 'resetNotificationCount'}));


            let userObj = self.props.header_notification;
            if (typeof userObj == 'string') {
                userObj = JSON.parse(userObj);
            } else {
                userObj = JSON.parse(JSON.stringify(userObj));
            }
            if (Object.keys(userObj).length) {
                courseNotificationPanel.addClass('show');


                setTimeout(function () {
                    $(".courseNotification-panel .nano").nanoScroller();
                    $(".courseNotification-panel .nano").nanoScroller({scroll: 'top'});
                }, 300);
                let notification_ids = [];
                Object.keys(userObj).map((index) => {
                    let userDetails = userObj[index];
                    if (userDetails.unread_status == 0) {
                        notification_ids.push($.trim(index));
                    }
                });


                if (notification_ids.length) {
                    self.props.dispatch(updateNotificationStatus({nodtification_node_id: notification_ids, status: 1}));
                    let ajaxParams = {
                        login_user_id: window.setUserID,
                        notification_id: notification_ids,
                    };
                    $.ajax({
                        url: domainUrl + 'store/updateNotificationStatus',
                        type: 'post',
                        data: ajaxParams,
                        success: function (response) {

                        }
                    });
                }


                return true;
            }
            let ajaxParams = {'login_user_id': window.setUserID};
            let ajaxURL = domainUrl + 'store/notificationList';
            self.makeAjaxCall(ajaxParams, ajaxURL);
            courseNotificationPanel.addClass('show');
            setTimeout(function () {
                $(".courseNotification-panel .nano").nanoScroller();
                $(".courseNotification-panel .nano").nanoScroller({scroll: 'top'});
            }, 300);
        }


    }

    componentDidMount() {
        let header_notification_count = this.props.header_notification_count;
        if (header_notification_count) {
            $('.notification-counter-js').removeClass('hide').text(header_notification_count)
        } else {
            $('.notification-counter-js').addClass('hide')
        }
        setTimeout(function () {
            $(".courseNotification-panel .nano").nanoScroller();
            $(".courseNotification-panel .nano").nanoScroller({scroll: 'top'});
        }, 500);
        let self = this;
        $(".courseNotification-panel .nano").bind("scrollend", function (e) {
            let userObj = self.props.header_notification;
            if (typeof userObj == 'string') {
                userObj = JSON.parse(userObj);
            } else {
                userObj = JSON.parse(JSON.stringify(userObj));
            }
            let ajaxParams = {
                'login_user_id': window.setUserID,
                'notification_id': Object.keys(userObj)[(Object.keys(userObj).length) - 1]
            };
            let ajaxURL = domainUrl + 'store/notificationList';
            if (self.props.loadMore) {
                self.makeAjaxCall(ajaxParams, ajaxURL);
            }

        });

    }

    makeAjaxCall(ajaxParams, ajaxURL) {
        let self = this;
        $('.notification-loader-js').removeClass('hide');
        $.ajax({
            url: ajaxURL,
            type: 'post',
            data: ajaxParams,
            success: function (response) {
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                } else {
                    response = JSON.parse(JSON.stringify(response));
                }

                if (!Object.keys(response.notification).length) {
                    response.notification = {'no_record': 'No records found.'};
                }

                self.props.dispatch(manageHeaderNotification({
                    'notification': response.notification,
                    'position': 'bottom'
                }));
                $('.notification-loader-js').addClass('hide');
            }
        });
    }

    getNotification() {

        let self = this;
        let userObj = self.props.header_notification;
        if (!userObj) {
            return true;
        }
        if (typeof userObj == 'string') {
            userObj = JSON.parse(userObj);
        } else {
            userObj = JSON.parse(JSON.stringify(userObj));
        }
        if (Object.keys(userObj).length) {
            if (Object.keys(userObj).length == 1 && Object.keys(userObj) == 'no_record') {
                return <NoRecordFound msg={userObj.no_record}/>
            }
            delete userObj.no_record;
            return Object.keys(userObj).map((index) => {
                let userDetails = userObj[index];
                let data = {
                    course_node_id: userDetails.course_node_id,
                    dialogue_node_id: userDetails.dialogue_node_id,
                    type: userDetails.type,
                    nodtification_node_id: index,
                    production_node_id: userDetails.production_node_id
                };
                let unreadCls = 'read-unread';
                if (userDetails.unread_status == 2) {
                    unreadCls = '';
                }
                return (
                    <li className={unreadCls} data-id={index} key={index} onClick={self.gotoDetail.bind(self, data)}>
                        <a href="javascript:void(0)">
                            <div className="col-xs">
                                {(userDetails.profile_image) ? <img src={userDetails.profile_image} alt="drop arrow"/> :
                                    <span
                                        className="initials-box">{(userDetails.first_name.charAt(0) + userDetails.last_name.charAt(0)).toUpperCase()}</span>}
                            </div>
                            <div className="notification-detail"
                                 dangerouslySetInnerHTML={{__html: userDetails.notification}}>
                            </div>
                        </a>
                    </li>
                )
            });
        }
        //return <NoRecordFound msg={'No records found.'}/>

    }

    gotoProduction(data, currentCourse) {
        let self = this;
        let currentChatDialogue = {
            change_chat_view: 1,
            currentChatDialogueDetail: {
                chat_view_type: "edit_production_template",
                expand_course_node_id: data.course_node_id
            }
        };
        var ajaxParams = {
            course_instance_id: currentCourse.course_instance_id,
            userID: window.setUserID,
            nodtification_node_id: data.nodtification_node_id,
            production_node_id: data.production_node_id,
            status: 'Published'
        }
        $.ajax({
            url: domainUrl + 'board/productionList',
            type: 'post',
            data: ajaxParams,
            success: function (response) {
                if (Object.keys(JSON.parse(response)).length == 0 && JSON.parse(response).constructor == Object) {
                    response = {};
                    response.message = "No records found.";
                    response = JSON.stringify(response);
                }
                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
                self.props.dispatch(appendProductionList({
                    course_node_id: data.course_node_id,
                    response: JSON.stringify(response.production_list),
                    updateCurrentChatDialogueDetail: 1
                }));
                self.props.dispatch(appendProductionStart({response: JSON.stringify(response.production_detail)}));
                self.props.dispatch(changeChatView(currentChatDialogue));
                let menudashboard = $("#menudashboard");
                menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"] .collapsedCourseBox').addClass('expandedCourseBox');
                menudashboard.find('li.main_production_list[data-id="' + data.production_node_id + '"]').addClass('current');
                highlightActionMenuAccordingly('By course');
                NProgress.done();
                setTimeout(function () {
                    //$("#mcs_container").mCustomScrollbar("scrollTo", ".openup");
                    $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                });
            }
        });
    }

    gotoDetail(data) {

        let self = this;
        let courseList = self.props.courseList;
        if (!courseList) {
            courseList = {};
        }
        if (typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        } else {
            courseList = JSON.parse(JSON.stringify(courseList));
        }
        let currentCourse = courseList[' ' + $.trim(data.course_node_id)];

        let courseNotificationPanel = $(".courseNotification-panel");
        if (courseNotificationPanel.hasClass('show')) {
            courseNotificationPanel.removeClass('show');
        }

        NProgress.start({position: 'middle'});
        self.props.dispatch(updateNotificationStatus({nodtification_node_id: data.nodtification_node_id, status: 2}));
        nanoScrollDown = true;
        if (self.props.view_type != 'bycourse' || !currentCourse || self.props.page_name == 'store' || self.props.page_name == 'group') {
            self.props.dispatch(activeFilter(''));
            var ajaxParams = {
                dialogue_node_id: data.dialogue_node_id,
                course_node_id: data.course_node_id,
                setUserID: window.setUserID,
                view_type: 'bycourse',
                nodtification_node_id: data.nodtification_node_id,
                mode: 0,
                type: 'json'
            }
            if (data.production_node_id) {
                delete ajaxParams.dialogue_node_id;
            }
            $.ajax({
                url: domainUrl + 'menudashboard/index',
                type: 'post',
                data: ajaxParams,
                success: function (response) {
                    if (typeof response == 'string') {
                        response = JSON.parse(response);
                    } else {
                        response = JSON.parse(JSON.stringify(response));
                    }

                    if (data.production_node_id) {
                        self.props.dispatch(updateCourseList({
                            response: response.data.course_list,
                            course_node_id: data.course_node_id,
                            updateProduction: 1
                        }));
                        if (self.props.page_name == 'store' || self.props.page_name == 'group') {
                            self.setState({redirect: 1});
                        }
                        currentCourse = response.data.course_list[' ' + $.trim(data.course_node_id)];
                        self.gotoProduction(data, currentCourse);
                    }
                    else {
                        let statementData = response[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].statement_data;
                        delete response[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].statement_data;

                        self.props.dispatch(updateCourseList({
                            response: response,
                            course_node_id: data.course_node_id,
                            updateCurrentChatDialogueDetail: 1,
                            dialogue_node_id: data.dialogue_node_id,
                            dialogue_status: 1,
                            change_chat_view: data.dialogue_node_id,
                            clear_chat_items: true
                        }));

                        statementData = modifyChatListForSystemGeneratedMessages(statementData);
                        self.props.dispatch(updateChatList(statementData));
                        existingDialogueSelCourse();
                        manageDialogueHT();

                        setTimeout(function () {
                            self.forceUpdate();
                            //$("#mcs_container").mCustomScrollbar("scrollTo", ".openup");
                            if (self.props.page_name == 'store' || self.props.page_name == 'group') {
                                self.setState({redirect: 1});
                            }

                            $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                            //Menu handle
                            highlightActionMenuAccordingly('By course');

                            NProgress.done();
                        }, 500);
                        return true;
                    }
                }
            });
            return true;
        }
        if (data.production_node_id) {
            if (!currentCourse) {
                return true;
            }
            this.gotoProduction(data, currentCourse);
            return true;
        }

        NProgress.start({position: 'middle'});

        var ajaxParams = {
            'course_instance_id': currentCourse.course_instance_id,
            'user_instance_node_id': window.setUserID,
            dialogue_node_id: data.dialogue_node_id,
            nodtification_node_id: data.nodtification_node_id,
        }
        $.ajax({
            url: domainUrl + 'menudashboard/dialogueList',
            type: 'post',
            data: ajaxParams,
            success: function (response) {
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                } else {
                    response = JSON.parse(JSON.stringify(response));
                }
                let statementData = response[' ' + $.trim(data.dialogue_node_id)].statement_data;
                delete response[' ' + $.trim(data.dialogue_node_id)].statement_data;
                let dialogueList = response;
                self.props.dispatch(appendDialogueList({
                    response: response,
                    course_node_id: data.course_node_id,
                    updateCurrentChatDialogueDetail: 1,
                    dialogue_node_id: data.dialogue_node_id,
                    dialogue_status: 1,
                    change_chat_view: data.dialogue_node_id,
                    clear_chat_items: true
                }));

                statementData = modifyChatListForSystemGeneratedMessages(statementData);
                self.props.dispatch(updateChatList(statementData));
                existingDialogueSelCourse();
                manageDialogueHT();

                setTimeout(function () {
                    self.forceUpdate();
                    //$("#mcs_container").mCustomScrollbar("scrollTo", ".openup");
                    $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                    NProgress.done();
                }, 500);
            }
        });

    }

    componentDidUpdate() {
        let header_notification_count = parseInt(this.props.header_notification_count);
        if (header_notification_count) {
            $('.notification-counter-js').removeClass('hide').text(header_notification_count)
        } else {
            $('.notification-counter-js').addClass('hide')
        }
        if ($(".courseNotification-panel .popover-content").outerHeight() >= 300) {
            $(".courseNotification-panel .popover-content").removeClass("manageHT");
        }
        else {
            $(".courseNotification-panel .popover-content").addClass("manageHT");
        }
        setTimeout(function () {
            $(".courseNotification-panel .nano").nanoScroller();
            //$(".courseNotification-panel .nano").nanoScroller({scroll: 'top'});
        }, 300);
    }
}

const mapStateToProps = (state) => {
    return {
        header_notification: state.header_notification,
        header_notification_count: state.header_notification_count,
        loadMore: state.loadMore,
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        view_type: state.view_type,
        page_name: state.page_name
    }
}

const ConnectedHeaderNotification = connect(mapStateToProps)(HeaderNotification);
export default ConnectedHeaderNotification;
