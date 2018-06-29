import React from 'react';
import {connect} from 'react-redux';
import {
    appendProductionList,
    appendNewChat,
    editChat,
    updateActorList,
    appendDialogueList,
    updateChatList,
    removeActor,
    changeChatView,
    addNewCourse,
    updateCourseTitle,
    updateDialogueTitle,
    editTitle,
    updateProductionCourse,
    appendProductionInstance,
    manageHeaderNotification,
    manageHeaderNotificationCount,
    updateNotificationStatus,
    appendProductionStart,
    updateCourseList,
    appendCourseList
} from '../actions/actions';
import {appendNewDialogue} from '../actions/add_new';
import {
    sendInvitationToGuestUser,
    highlightActionMenuAccordingly,
    modifyChatListForSystemGeneratedMessages,
    getRedirectLink
} from './functions/common_functions';
import CommonObject from './functions/common_objects';
import {Redirect} from 'react-router-dom';

class Connection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: 0
        }
    }
    render() {
        if(this.state.redirect){
            this.state.redirect = 0;
            return (
                <span><Redirect to={getRedirectLink()['inbox']}/></span>
            )
        }
        return null;
    }

    componentDidMount() {
        let self = this;
        if (typeof socket == 'undefined') {
            this.creatsocketConnection();
        }
        else {
            socket.onclose = function (event) {
                console.log("Reconnecting....");
                CommonObject.ConnectionError.showNotification({msg: "Connection with socket lost."});
                NProgress.done();
                if (socketStartInterval) {
                    clearInterval(socketStartInterval);
                }
                socketStartInterval = setInterval(function () {
                    self.creatsocketConnection();
                }, reconnectingTime);
            }

            socket.onmessage = function (event) {
                self.getIncomingMessage(event);
            }
        }

    }
    creatsocketConnection() {
        var self = this;
        if (socketStartInterval) {
            clearInterval(socketStartInterval);
        }
        var hostName = domainUrl.replace(/([a-z]+:\/\/)(.*)/, "$2");//window.location.hostname;
        var getServerHost = hostName + ":9003/pu/";
        if (hostName == "www.prospus.com/dev/") {
            getServerHost = window.location.hostname + ":9003/dev/";
        } else if (hostName == "www.prospus.com/qa/") {
            getServerHost = window.location.hostname + ":9004/qa/";
        } else if (hostName == "www.prospus.com/sta/") {
            getServerHost = window.location.hostname + ":9005/sta/";
        } else if (hostName == "pro.pu.prospus.com") {
            getServerHost = hostName + ":9003/";
        } else if (hostName == "qatest.pu.prospus.com") {
            getServerHost = hostName + ":9006/";
        } else {
            getServerHost = window.location.hostname + ":9003/pu/";
        }
        /*if(getServerHost == "localhost"){
            getServerHost = getServerHost +":9003/pu/";
        }
        else{
            getServerHost = getServerHost +":9003/";
        }*/

        socket = new WebSocket("ws://" + getServerHost + "course-dialogue-server.php");
        console.log("ws://" + getServerHost + "course-dialogue-server.php");
        socket.onopen = function () {
            var msg = {username: setUsername, userid: window.setUserID};
            socket.send(JSON.stringify(msg));
            console.log("Connection Established.");
            CommonObject.ConnectionError.hidePopup();
        }

        socket.onclose = function (event) {
            console.log("Reconnecting....");
            CommonObject.ConnectionError.showNotification({msg: "Connection with socket lost."});
            NProgress.done();
            if (socketStartInterval) {
                clearInterval(socketStartInterval);
            }
            socketStartInterval = setInterval(function () {
                self.creatsocketConnection();
            }, reconnectingTime);
        }


        socket.onmessage = function (event) {
            self.getIncomingMessage(event);
        }

        socket.onerror = function (event) {
            console.log("Cannot connect with socket.");
        }
    }

    getIncomingMessage(event) {
        var self = this;
        let menudashboard = $("#menudashboard");
        var data = $.parseJSON(event.data), msg;
        console.log($.parseJSON(event.data));
        if(data.statement_type == 'image') {
            // debugger;
            window.is_file_upload_in_progress = false;
            console.log(window.file_list.length);
            if(window.file_list && window.file_list.length) {
                let processFun = window.file_list.shift();
                processFun.callback();
            }
        }
        if(data.action=="appendStatementForDialogueClass"){
            if(data.user_current_session_id == window.setUserID && data.default_params==""){
                nanoScrollDown = true;
            }
            else{
                nanoScrollDown = false;
            }
        }
        if (data.type && (data.type.toLowerCase() == 'offline' || data.type.toLowerCase() == 'system')) {
            return true;
        }
        if (data.default_params) {
            if (data.default_params.action == 'updateActorList' || data.default_params.action == 'removeActor') {
                data.message = undefined;
                if(data.user_current_session_id == window.setUserID){
                    nanoScrollDown = true;
                }
            }
            // delete default_params if it have only device token
            if (Object.keys(data.default_params).length == 1 && data.default_params['device_token']) {
                data.default_params = "";
            }
            // delete device token from default_params
            /*if (Object.keys(data.default_params).length && data.default_params['device_token']) {
                delete data.default_params['device_token'];
            }*/

        }


        let headerNotificationList = this.props.header_notification

        if (typeof headerNotificationList == 'string') {
            headerNotificationList = JSON.parse(headerNotificationList);
        } else {
            headerNotificationList = JSON.parse(JSON.stringify(headerNotificationList));
        }

        if (data.action == 'updateProductionList') {
            let newProduction = data.responseArr[data.production_node_id][window.setUserID];
            let checkPrevSelected = $(".main_production_list.current").attr("data-id");
            /*
            if(checkPrevSelected){
                if(newProduction.indexOf(checkPrevSelected)==-1){
                    let currentChatDialogue = {
                        change_chat_view: 1,
                        currentChatDialogueDetail: {
                            chat_view_type: "view_production_template"
                        }
                    };
                    $(".main_production_list.current").removeClass("current");
                    this.props.dispatch(changeChatView(currentChatDialogue));
                }
            }
            */
            this.props.dispatch(appendProductionInstance({
                productionID: data.production_node_id,
                response: newProduction
            }));
            if (checkPrevSelected && $(".rightMenuFlyout.prod.fly-in").length == 0) {
                // $(".main_production_list.current").removeClass("current");
                // $("#"+checkPrevSelected).addClass("current");
                $(".main_production_list.current .productionlistTitle").trigger("click");
            }

        }

        if (data.action == 'sendProductionNotification') {
            let courseNotificationPanel = $(".courseNotification-panel");
            let response = {};
            let notificationId;
            if(data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id) {
                notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID];
                response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
            }
            if (!notificationId && data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification_next.user_notification_id) {
                response = {};
                notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification_next.user_notification_id[window.setUserID];
                response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification_next.notification_msg;
            }
            if (!notificationId) {
                return true;
            }

            if (courseNotificationPanel.hasClass('show')) {
                response[notificationId].unread_status = 1;
                let notificationIds = [];
                notificationIds.push(notificationId);
                let ajaxParams = {
                    login_user_id: window.setUserID,
                    notification_id: notificationIds,
                };
                $.ajax({
                    url: domainUrl + 'store/updateNotificationStatus',
                    type: 'post',
                    data: ajaxParams,
                    success: function (response) {

                    }
                });

                self.props.dispatch(manageHeaderNotification({
                    'notification': response,
                    'position': 'top',
                }));
                self.desktopNotification("PU Course Update", response[notificationId], notificationId);
                return true;
            }
            if (Object.keys(headerNotificationList).length) {
                self.props.dispatch(manageHeaderNotification({
                    'notification': response,
                    'position': 'top',
                }));
            }
            self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
            self.desktopNotification("PU Course Update", response[notificationId], notificationId);
            return true;
        }

        if (data.action == 'editProductionCourse') {
            let newProduction = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].production;
            let productionID = data.responseArr["new_course"][' ' + $.trim(data.course_node_id)].new_production_id;
            let newProductionName = newProduction[productionID].production_name;
            let created_by = newProduction[productionID].created_by;
            let recipient = newProduction[productionID].users;

            if (!recipient[window.setUserID]) { // if loggedIn user is not receipient then do nothing
                return true;
            }
            var newData = data.responseArr["new_course"][' ' + $.trim(data.course_node_id)];
            let currentChatDialogue = {
                change_chat_view: 1,
                currentChatDialogueDetail: {
                    'course_node_id': data.course_node_id
                },
                change_chat_view: data.dialogue_node_id,
                chat_view_type: 0
            };
            self.props.dispatch(updateProductionCourse({course_node_id: data.course_node_id, data: newData}));
            if (created_by == window.setUserID) { // loggedIn user created this dialogue then
                self.props.dispatch(changeChatView(currentChatDialogue));
                $(".production_list.current").trigger("click");
            }
            //msg = '<b>' + data.default_params.added_by_name + '</b>' + ' added ' + '<b>' + 'You' + '</b>' + ' as a participant on ' + '<b>' + newProductionName + '</b>' + ' production under ' + '<b>' + data.course_title + '</b>' + ' course.';
            if (created_by != window.setUserID) {

                let courseNotificationPanel = $(".courseNotification-panel");
                let response = {};
                let notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID]
                response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
                if (courseNotificationPanel.hasClass('show')) {
                    response[notificationId].unread_status = 1;
                    let notificationIds = [];
                    notificationIds.push(notificationId);
                    let ajaxParams = {
                        login_user_id: window.setUserID,
                        notification_id: notificationIds,
                    };
                    $.ajax({
                        url: domainUrl + 'store/updateNotificationStatus',
                        type: 'post',
                        data: ajaxParams,
                        success: function (response) {

                        }
                    });

                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                    return true;
                }
                if (Object.keys(headerNotificationList).length) {
                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                }
                self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));


                //showNotification({msg: msg});
            }
            return true;
        }

        if (data.action == 'addProductionCourse') {
            let newProduction = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].production;
            let newProductionID = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id;
            let newProductionName = newProduction[newProductionID].production_name;
            let created_by = newProduction[newProductionID].created_by;
            let recipient = newProduction[newProductionID].users;
            let menudashboard = $("#menudashboard");
            // console.log(recipient);

            if (!recipient[window.setUserID]) { // if loggedIn user is not receipient then do nothing
                //return true;
            }

            let reactButtonCancelAddNewCourse = $("#react-button-cancel-add-new-course");
            let reactButtonSaveNewCourseTemplate = $("#react-button-savedraft-new-template-course");
            let reactButtonPublishNewCourseTemplate = $("#react-button-publish-new-template-course");
            if (reactButtonCancelAddNewCourse.length) {
                reactButtonCancelAddNewCourse.addClass("hide");
                reactButtonSaveNewCourseTemplate.addClass("hide");
                reactButtonPublishNewCourseTemplate.addClass("hide");
                $("#menudashboard").find('.add-new-course-tmpl').remove();
            }


//                return false;

            let currentChatDialogue = {
                change_chat_view: 1,
                currentChatDialogueDetail: {
                    chat_view_type: "saving_data"
                }
            };
            var getCourseNodeID = data.course_node_id;
            var letExistingCourses = self.props.courseList;
            if (typeof letExistingCourses == "string") {
                letExistingCourses = JSON.parse(letExistingCourses);
            }

            if (self.props.view_type == 'bydialogue' || self.props.view_type == 'byactor') {
                    if(created_by == window.setUserID) {
                        // for admin, take user to 'by course' view when new course is added from 'bydialogue' or 'byactor' tab
                        let view_type = 'bycourse';
                        $.ajax({
                            url: domainUrl + 'inbox',
                            type: 'post',
                            data: {mode: 0, setUserID: window.setUserID, type: 'json', view_type: view_type},
                            success: function(response) {
                                response = JSON.parse(response);
                                let courseList = response.data.course_list;
                                let newDialogue = data.responseArr['new_course'][' '+$.trim(data.course_node_id)].dialogue;
                                //courseList[' '+$.trim(data.course_node_id)].dialogue = newDialogue;
                                self.props.dispatch(appendCourseList({
                                    course_list: courseList,
                                    view_type: view_type,
                                    changeChatView: 0,
                                }));

                                var getExistingProductions = courseList[' ' + $.trim(getCourseNodeID)].production;
                                var getProduction = data.responseArr['new_course'][' ' + $.trim(data.course_node_id)].production;
                                var getProdID = data['responseArr']['new_course'][' ' + $.trim(getCourseNodeID)].new_production_id;
                                var newProductionList = {};
                                newProductionList[' ' + getProdID] = getProduction[getProdID];
                                Object.keys(getExistingProductions).map(function (key) {
                                    let list = getExistingProductions[key];
                                    newProductionList[key] = list;
                                });
                                self.props.dispatch(appendProductionList({
                                    course_node_id: getCourseNodeID,
                                    response: newProductionList
                                }));

                                let newSelectedCourse = menudashboard.find('.react-list:first');
                                newSelectedCourse.find('tr:first').addClass('current');
                                newSelectedCourse.next().removeClass('hide');
                                newSelectedCourse.closest('.course-list').find('.course-list-detail:first').removeClass('hide');
                                //menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"]').trigger('click');
                                menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"] .collapsedCourseBox').addClass('expandedCourseBox');
                                menudashboard.find('li.main_production_list[data-id="' + data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id + '"] .productionlistTitle').trigger('click');
                                highlightActionMenuAccordingly('By course');
                                applyScroller();                                
                            }
                        });
                        return true;
                    }
            }


            if (letExistingCourses[' ' + $.trim(getCourseNodeID)]) {
                var getExistingProductions = letExistingCourses[' ' + $.trim(getCourseNodeID)].production;
                var getProduction = data.responseArr['new_course'][' ' + $.trim(data.course_node_id)].production;
                var getProdID = data['responseArr']['new_course'][' ' + $.trim(getCourseNodeID)].new_production_id;
                var newProductionList = {};
                newProductionList[' ' + getProdID] = getProduction[getProdID];
                Object.keys(getExistingProductions).map(function (key) {
                    let list = getExistingProductions[key];
                    newProductionList[key] = list;
                });
                self.props.dispatch(appendProductionList({
                    course_node_id: getCourseNodeID,
                    response: newProductionList
                }));
            }
            else {
                self.props.dispatch(addNewCourse({data: data, default_params: data.default_params}));
            }
            if (created_by == window.setUserID) { // loggedIn user created this dialogue then
                let actorList = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].production[data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id].users;
                sendInvitationToGuestUser(actorList, {
                    courseId: data.responseArr.new_course[' ' + $.trim(data.course_node_id)],
                    courseTitle: data.course_title,
                    productionId: data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id,
                    productionTitle: data.responseArr.new_course[' ' + $.trim(data.course_node_id)].production[data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id].production_name
                });                
                menudashboard.find('.add-new-course-tmpl').closest(".list-row").remove();
                if (!letExistingCourses[' ' + $.trim(getCourseNodeID)]) {
                    // self.props.dispatch(changeChatView(currentChatDialogue));
                    manageDialogueHT();
                    let menudashboard = $("#menudashboard");
                    let currentSelectedCourse = menudashboard.find('tr.current');
                    currentSelectedCourse.removeClass('current');
                    currentSelectedCourse.closest('.course-list').find('.course-list-detail:first').addClass('hide');

                    let newSelectedCourse = menudashboard.find('.react-list:first');
                    newSelectedCourse.find('tr:first').addClass('current');
                    newSelectedCourse.next().removeClass('hide');
                    newSelectedCourse.closest('.course-list').find('.course-list-detail:first').removeClass('hide');
                    //menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"]').trigger('click');
                    menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"] .collapsedCourseBox').addClass('expandedCourseBox');
                    menudashboard.find('li.main_production_list[data-id="' + data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id + '"] .productionlistTitle').trigger('click');
                }
                else {
                    menudashboard.find('li.main_production_list[data-id="' + data.responseArr.new_course[' ' + $.trim(data.course_node_id)].new_production_id + '"] .productionlistTitle').trigger('click');
                }
                return true;
            }

            let courseNotificationPanel = $(".courseNotification-panel");
            let response = {};
            let notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID]
            response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
            if (courseNotificationPanel.hasClass('show')) {
                response[notificationId].unread_status = 1;
                let notificationIds = [];
                notificationIds.push(notificationId);
                let ajaxParams = {
                    login_user_id: window.setUserID,
                    notification_id: notificationIds,
                };
                $.ajax({
                    url: domainUrl + 'store/updateNotificationStatus',
                    type: 'post',
                    data: ajaxParams,
                    success: function (response) {

                    }
                });

                self.props.dispatch(manageHeaderNotification({
                    'notification': response,
                    'position': 'top',
                }));
                return true;
            }
            if (Object.keys(headerNotificationList).length) {
                self.props.dispatch(manageHeaderNotification({
                    'notification': response,
                    'position': 'top',
                }));
            }
            self.desktopNotification("PU Course Update", response[notificationId], notificationId);
            self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
            //msg = '<b>' + data.default_params.added_by_name + '</b>' + ' added ' + '<b>' + 'You' + '</b>' + ' as a participant on ' + '<b>' + newProductionName + '</b>' + ' production under ' + '<b>' + data.course_title + '</b>' + ' course.';
            //showNotification({msg: msg});
            return true;
        }


        if (data.message) {
            if (data.default_params.action == 'addNewCourse') {

                let newDialogue = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].dialogue;
                let dialogueInfo = newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue;
                let recipient = newDialogue[' ' + $.trim(data.dialogue_node_id)].users;
                // console.log(recipient);

                if (!recipient[window.setUserID]) { // if loggedIn user is not receipient then do nothing
                    NProgress.done();
                    return true;
                }
                if ((data.action == 'Letter' && data.saveType == 'D') && dialogueInfo.created_by != window.setUserID) {
                    NProgress.done();
                    return true;
                }

                let reactButtonCancelAddNewCourse = $("#react-button-cancel-add-new-course");
                if (reactButtonCancelAddNewCourse.length) {
                    reactButtonCancelAddNewCourse.remove();
                    let menudashboard = $("#menudashboard");
                    menudashboard.find('.add-new-course-tmpl').remove();
                    menudashboard.find('.course-list-panel-additional').remove();

                }

                let currentChatDialogue = {
                    currentChatDialogueDetail: {
                        'course_node_id': data.course_node_id,
                        'dialogue_node_id': data.dialogue_node_id
                    },
                    change_chat_view: data.dialogue_node_id,
                    chat_view_type: 0
                };
                if (self.props.view_type == 'bydialogue' || self.props.view_type == 'byactor') {
                    if(data.default_params.added_by_id == window.setUserID) {
                        // for admin, take user to 'by course' view when new course is added from 'bydialogue' or 'byactor' tab
                        let view_type = 'bycourse';
                        $.ajax({
                            url: domainUrl + 'inbox',
                            type: 'post',
                            data: {mode: 0, setUserID: window.setUserID, type: 'json', view_type: view_type},
                            success: function(response) {
                                response = JSON.parse(response);
                                let courseList = response.data.course_list;
                                let newDialogue = data.responseArr['new_course'][' '+$.trim(data.course_node_id)].dialogue;
                                courseList[' '+$.trim(data.course_node_id)].dialogue = newDialogue;
                                self.props.dispatch(appendCourseList({
                                    course_list: courseList,
                                    view_type: view_type,
                                    changeChatView: 0,
                                }));
                                var targetElement = $('.dialogue_list_wrapper[data-course-instance-id=" ' + $.trim(data.course_node_id) + '"]').find('.collapsedCourseBox');
                                targetElement.addClass('expandedCourseBox');
                                targetElement.find('.dialogue_row[data-id="' + $.trim(data.dialogue_node_id) + '"]').trigger('click');
                                highlightActionMenuAccordingly('By course');
                                applyScroller();
                            }
                        });
                        return true;
                    }
                    self.props.dispatch(appendNewDialogue({
                        data: data,
                        responseArr: data.responseArr,
                        action: 'addNewCourse'
                    }));
                } else {
                    self.props.dispatch(addNewCourse({
                        data: data,
                        default_params: data.default_params,
                        created_by: dialogueInfo.created_by,
                        currentChatDialogueDetail: currentChatDialogue.currentChatDialogueDetail
                    }));
                }

                if (dialogueInfo.created_by == window.setUserID) { // loggedIn user created this dialogue then
                    let actorList = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].users;

                    sendInvitationToGuestUser(actorList, {
                        courseId: data.course_node_id,
                        courseTitle: data.course_title,
                        dialogueId: data.dialogue_node_id,
                        dialogueTitle: data.dialogue_title,
                    });
                    self.props.dispatch(changeChatView(currentChatDialogue));
                    setTimeout(function () {

                        manageDialogueHT();
                        let menudashboard = $("#menudashboard");
                        let currentSelectedCourse = menudashboard.find('tr.current');
                        currentSelectedCourse.removeClass('current');
                        currentSelectedCourse.closest('.course-list').find('.course-list-detail:first').addClass('hide');

                        let newSelectedCourse = menudashboard.find('.react-list:first');
                        newSelectedCourse.find('tr:first').addClass('current');
                        newSelectedCourse.next().removeClass('hide');
                        menudashboard.find('li[data-course-instance-id="' + data.course_node_id + '"]').trigger('click');
                        menudashboard.find('li[data-course-instance-id="' + data.course_node_id + '"]').find('.collapsedCourseBox:first').addClass('expandedCourseBox');
                        menudashboard.find('.dialogue_list[data-id="' + data.dialogue_node_id + '"]').trigger('click');
                    });
                    return true;
                }
                let courseNotificationPanel = $(".courseNotification-panel");
                let response = {};
                let notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID]
                response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
                if (courseNotificationPanel.hasClass('show')) {
                    response[notificationId].unread_status = 1;
                    let notificationIds = [];
                    notificationIds.push(notificationId);
                    let ajaxParams = {
                        login_user_id: window.setUserID,
                        notification_id: notificationIds,
                    };
                    $.ajax({
                        url: domainUrl + 'store/updateNotificationStatus',
                        type: 'post',
                        data: ajaxParams,
                        success: function (response) {

                        }
                    });

                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                    return true;
                }
                if (Object.keys(headerNotificationList).length) {
                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                }
                self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
                if (data.user_current_session_id != window.setUserID) {
                    self.desktopNotification("PU Course Update", response[notificationId], notificationId);
                }
                //msg = '<b>' + data.default_params.added_by_name + '</b>' + ' added ' + '<b>' + 'You' + '</b> on ' + '<b>' + data.dialogue_title + '</b>' + ' dialogue under ' + '<b>' + data.course_title + '</b>' + ' course.';
                //showNotification({msg: msg});
                NProgress.done();
                return true;
            }

            if (data.default_params.action == 'addNewDialogue') {
                if (data.default_params.added_by_id == window.setUserID) { // remove some elements for admin
                    let actorList = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].users;
                    sendInvitationToGuestUser(actorList, {
                        courseId: data.course_node_id,
                        courseTitle: data.course_title,
                        dialogueId: data.dialogue_node_id,
                        dialogueTitle: data.dialogue_title,
                    });

                    $('.add-new-dialogue-untitled').removeClass('current');
                    $(".add-new-dialogue-untitled-wrapper").attr("style", "display: none !important"); // hide untitled row
                    $("#react-button-cancel-add-new-dialogue").remove(); // remove cancel button
                }
                let additionalParams = {};
                if (data.default_params.added_by_id == window.setUserID) {
                    additionalParams = {
                        currentChatDialogueDetail: {
                            course_node_id: ' ' + $.trim(data.course_node_id),
                            dialogue_node_id: data.dialogue_node_id,
                            expand_course_node_id: ' ' + $.trim(data.course_node_id),
                            dialogue_added_under_course_node_id: ' ' + $.trim(data.course_node_id),
                            chat_view_type: ''
                        }
                    };
                }
                let courseList = self.props.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                // check course exists or not

                data.default_params.course_node_id = data.course_node_id;

                if (courseList[' ' + $.trim(data.default_params.course_node_id)] || self.props.view_type == 'bydialogue' || self.props.view_type == 'byactor') {
                    self.props.dispatch(appendNewDialogue({
                        data: data,
                        responseArr: data.responseArr,
                        additionalParams: additionalParams
                    }));
                } else {
                    self.props.dispatch(addNewCourse({data: data, default_params: data.default_params}));
                }


                if (data.default_params.added_by_id == window.setUserID) { // load chat mode of newly created dialoge for admin
                    let targetDialogue = menudashboard.find('.react-list.openup').next().find('.dialogue_list[data-id="' + data.dialogue_node_id + '"]');
                    if (targetDialogue.length) {
                        targetDialogue.trigger('click');
                    } else {
                        $('.course-list-detail:visible').find('.dialogue_list[data-id="' + data.dialogue_node_id + '"]').trigger('click');
                    }

                } else {
                    let actorList = data.responseArr.new_course[' ' + data.course_node_id].dialogue[' ' + $.trim(data.dialogue_node_id)].users;

                    let courseNotificationPanel = $(".courseNotification-panel");

                    let response = {};
                    let notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID]
                    response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
                    if (courseNotificationPanel.hasClass('show')) {
                        response[notificationId].unread_status = 1;
                        let notificationIds = [];
                        notificationIds.push(notificationId);
                        let ajaxParams = {
                            login_user_id: window.setUserID,
                            notification_id: notificationIds,
                        };
                        $.ajax({
                            url: domainUrl + 'store/updateNotificationStatus',
                            type: 'post',
                            data: ajaxParams,
                            success: function (response) {

                            }
                        });

                        self.props.dispatch(manageHeaderNotification({
                            'notification': response,
                            'position': 'top',
                        }));
                        return true;
                    }
                    if (Object.keys(headerNotificationList).length) {
                        self.props.dispatch(manageHeaderNotification({
                            'notification': response,
                            'position': 'top',
                        }));
                    }
                    self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
                    self.desktopNotification("PU Course Update", response[notificationId], notificationId);
                    /*let addedUsers = [];
                    if (Object.keys(actorList).length == 2) {
                        msg = '<b>' + data.default_params.added_by_name + '</b>' + ' added ' + '<b> You </b>' + ' on <b>' + data.dialogue_title + '</b>' + ' dialogue under ' + '<b>' + data.course_title + '</b>' + ' course.';
                    } else {
                        if (actorList[setUserID]) {
                            addedUsers.push('You');
                        }
                        Object.keys(actorList).map(function (user_id) {
                            if (user_id != setUserID && user_id != data.default_params.added_by_id) {
                                addedUsers.push(ucwords(actorList[user_id].first_name + ' ' + actorList[user_id].last_name));
                            }
                        });
                        msg = '<b>' + data.default_params.added_by_name + '</b>' + ' added ' + '<b>' + addedUsers.join(', ') + '</b>' + ' on <b>' + data.dialogue_title + '</b>' + ' dialogue under ' + '<b>' + data.course_title + '</b>' + ' course.';
                    }*/

                    //showNotification({msg: msg});

                }
                return true;
            }
            var user_exsits = data.user_actor_node_id;
            if (typeof user_exsits != 'object') {
                user_exsits = user_exsits.split(',');
            }

            if ($.inArray(window.setUserID, user_exsits) != -1) {
                if (data.chat_type.toLowerCase() == self.props.chatType.toLowerCase()) {

                    if (self.props.currentChatDialogueDetail && $.trim(data.dialogue_node_id) == $.trim(self.props.currentChatDialogueDetail.dialogue_node_id)) {
                        if (data.default_params) {
                            if (data.default_params.chat_action_type == 'edit' || data.default_params.chat_action_type == 'delete') {
                                nanoScrollDown = false;
                                self.props.dispatch(editChat({
                                    default_params: data.default_params,
                                    message: data.message,
                                    data: data

                                }));
                                return true;
                            }
                            return true;
                        }
                        if (self.props.currentChatDialogueDetail && (self.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || self.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue')) {
                            // highlight the course
                            data.highlight_course = 1;
                        }
                        self.props.dispatch(appendNewChat(data));
                    } else {
                        // highlight the course
                        data.highlight_course = 1;
                        self.props.dispatch(appendNewChat(data));
                    }
                } else {
                    // highlight the course
                    data.highlight_course = 1;
                    self.props.dispatch(appendNewChat(data));
                }
                if (data.user_current_session_id != window.setUserID) {
                    let desktopNotificationTitle = 'New message from ' + data.responseArr.header_notification.notification_msg.first_name + ' ' + data.responseArr.header_notification.notification_msg.last_name;
                    self.desktopNotification(desktopNotificationTitle, data.responseArr.header_notification.notification_msg, '');
                }

                if (self.props.currentChatDialogueDetail && self.props.currentChatDialogueDetail.course_node_id == data.course_node_id) {
                    return true;
                }
                if (data.user_current_session_id == window.setUserID) {
                    return true;
                }
                // let menudashboard = $("#menudashboard");
                // menudashboard.find('.react-list[data-course-node-id=" '+data.course_node_id+'"]').find('tr:first').addClass('notification-color');
                return true;
            }
        } else if (data.default_params.action) {
            let params = {responseArr: data.responseArr, default_params: data.default_params, data: data};
            if (data.default_params.action == 'updateActorList') {
                sendInvitationToGuestUser(data.responseArr.actor_list, {
                    courseId: data.course_node_id,
                    courseTitle: data.course_title,
                    dialogueId: data.dialogue_node_id,
                    dialogueTitle: data.dialogue_title,
                });
                let actorList = data.responseArr.actor_list;
                let newAddedActorList = data.default_params.new_user_recepient_node_id;

                let individualAutoCompleteBox = $("#individualAutoCompleteBox");
                if (data.default_params.added_by_id != window.setUserID) {
                    individualAutoCompleteBox = 0;
                }
                let addedUsers = [];
                let logedinUserName = '';

                newAddedActorList.map(function (key) {
                    if (individualAutoCompleteBox) { // if participant is added on the same dialogue then only execute below statement.
                        individualAutoCompleteBox.find('input[value="' + key + '"]').closest('.recRightPanel').remove();
                    }
                    if (actorList[key].user_id == window.setUserID) {
                        logedinUserName = 'You';
                    } else {
                        let userFullName = ucwords(actorList[key].first_name + ' ' + actorList[key].last_name);
                        addedUsers.push(userFullName);
                    }

                });
                if (logedinUserName !== '') {
                    addedUsers.unshift(logedinUserName);
                }

                if (self.props.view_type == 'bydialogue') {
                    self.props.dispatch(appendNewDialogue({
                        data: data,
                        responseArr: data.responseArr
                    }));
                } else {
                    self.props.dispatch(updateActorList(params));
                }


                if (self.props.chatType.toLowerCase() == 'chat' && data.responseArr && data.responseArr.system_message) {
                    if (self.isCourseAndDialogueViewSame(data)) {
                        self.props.dispatch(appendNewChat(data));
                    }
                }
                if (data.default_params.added_by_id != window.setUserID) {

                    //msg = '<b>' + data.default_params.added_by_name + '</b>'+ ' added ' + '<b>' +addedUsers.join(', ')+ '</b>'  +  ' on <b>'+ data.dialogue_title + '</b>' + ' dialogue under ' + '<b>' + data.course_title + '</b>' + ' course.';
                    //showNotification({msg: msg});
                    let courseNotificationPanel = $(".courseNotification-panel");
                    let response = {};
                    let notificationId = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.user_notification_id[window.setUserID]
                    response[notificationId] = data.responseArr.new_course[' ' + $.trim(data.course_node_id)].header_notification.notification_msg;
                    if (courseNotificationPanel.hasClass('show')) {
                        response[notificationId].unread_status = 1;
                        let notificationIds = [];
                        notificationIds.push(notificationId);
                        let ajaxParams = {
                            login_user_id: window.setUserID,
                            notification_id: notificationIds,
                        };
                        $.ajax({
                            url: domainUrl + 'store/updateNotificationStatus',
                            type: 'post',
                            data: ajaxParams,
                            success: function (response) {

                            }
                        });

                        self.props.dispatch(manageHeaderNotification({
                            'notification': response,
                            'position': 'top',
                        }));
                        NProgress.done();
                        return true;
                    }
                    if (Object.keys(headerNotificationList).length) {
                        self.props.dispatch(manageHeaderNotification({
                            'notification': response,
                            'position': 'top',
                        }));
                    }
                    self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
                    self.desktopNotification("PU Course Update", response[notificationId], notificationId);
                }
                $("#react-toggleRecipientBtn").trigger('click');
                NProgress.done();
                return true;
            }
            if (data.default_params.action == 'removeActor') {
                self.props.dispatch(removeActor(params));

                if (self.props.chatType.toLowerCase() == 'chat' && data.responseArr && data.responseArr.system_message) {
                    if (self.isCourseAndDialogueViewSame(data)) {
                        self.props.dispatch(appendNewChat(data));
                    }
                }
                if (data.default_params.removed_by_id != window.setUserID) {
                    let userName = ucwords(data.default_params.removed_user_name);
                    if (data.default_params.removed_user_id == window.setUserID) {
                        userName = 'You';
                    }
                    msg = '<b>' + data.default_params.removed_by_name + '</b>' + ' removed ' + '<b>' + userName + '</b>' + ' from ' + '<b>' + data.default_params.dialogue_title + '</b>' + ' dialogue under ' + '<b>' + data.default_params.course_title + '</b>' + ' course.';
                    showNotification({msg: msg});
                }
                NProgress.done();
                return true;
            }

            if (data.default_params.action == 'updateTitle') {
                if (data.default_params.isEditMode == 'course') {
                    self.props.dispatch(updateCourseTitle({
                        courseTitle: data.default_params.new_title,
                        courseNodeId: data.default_params.node_id,
                        dialogueNodeId: data.default_params.dialogue_node_id,
                        updated_by_id: data.default_params.updated_by_id
                    }));
                } else {
                    self.props.dispatch(updateDialogueTitle({
                        dialogueTitle: data.default_params.new_title,
                        dialogueNodeId: data.default_params.node_id,
                        courseNodeId: data.default_params.course_node_id,
                        updated_by_id: data.default_params.updated_by_id,
                        newMessageCountArr: data.newMessageCountArr.length
                    }));
                    if (self.props.chatType.toLowerCase() == 'chat' && data.responseArr && data.responseArr.system_message) {
                        if (self.isCourseAndDialogueViewSame(data.default_params)) {
                            self.props.dispatch(appendNewChat(data));
                        }
                    }
                }
                self.props.dispatch(editTitle({isEditTitle: 0}));
                NProgress.done();
            }
            if (data.default_params.updated_by_id != window.setUserID) {
                /*let userName = ucwords(data.default_params.updated_by_name);
                let mode = data.default_params.isEditMode;
                let old_title = data.default_params.old_course_title;
                let dilagoueMsg = '.';
                if (mode == 'dialogue') {
                    old_title = data.default_params.old_dialogue_title;
                    dilagoueMsg = ' under ' + '<b>' + data.default_params.old_course_title + '</b>' + ' course.';
                }
                var msg = '<b>' + userName + '</b>' + ' renamed ' + mode + ' <b>' + old_title + '</b>' + ' to ' + '<b>' + data.default_params.new_title + '</b>' + dilagoueMsg;
                showNotification({msg: msg});*/
                let courseNotificationPanel = $(".courseNotification-panel");
                let response = {};
                let notificationId = data.responseArr.header_notification.user_notification_id[window.setUserID]
                response[notificationId] = data.responseArr.header_notification.notification_msg;
                if (courseNotificationPanel.hasClass('show')) {
                    response[notificationId].unread_status = 1;
                    let notificationIds = [];
                    notificationIds.push(notificationId);
                    let ajaxParams = {
                        login_user_id: window.setUserID,
                        notification_id: notificationIds,
                    };
                    $.ajax({
                        url: domainUrl + 'store/updateNotificationStatus',
                        type: 'post',
                        data: ajaxParams,
                        success: function (response) {

                        }
                    });

                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                    return true;
                }
                if (Object.keys(headerNotificationList).length) {
                    self.props.dispatch(manageHeaderNotification({
                        'notification': response,
                        'position': 'top',
                    }));
                }
                self.props.dispatch(manageHeaderNotificationCount({notificationCount: 1}));
                self.desktopNotification("PU Course Update", response[notificationId], notificationId);
            }
            return true;
        }
    }


    desktopNotification(title, msg, notificationId) {
        var self = this;
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, {
                        'body': strip(msg.notification),
                        icon: domainUrl + "public/img/prospus-black-logo.png"
                    });
                    notification.onclick = function () {
                        nanoScrollDown = true;
                        window.focus();
                        notification.close();
                        self.gotoNotificationDetail(msg, notificationId);
                    }
                }
            });
        }
    }

    gotoNotificationDetail(msg, notificationId) {
        let data = {
            course_node_id: msg.course_node_id,
            dialogue_node_id: msg.dialogue_node_id,
            type: msg.type,
            nodtification_node_id: notificationId,
            production_node_id: msg.production_node_id
        };

        let self = this;
        let courseList = self.props.courseList;
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
            //self.props.dispatch(activeFilter(''));
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
                            $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                            //Menu handle
                            highlightActionMenuAccordingly('By course');
                            if (self.props.page_name == 'store' || self.props.page_name == 'group') {
                                self.setState({ redirect: 1 });
                            }

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

                highlightActionMenuAccordingly('By course');
                NProgress.done();
                setTimeout(function () {
                    //$("#mcs_container").mCustomScrollbar("scrollTo", ".openup");
                    if (self.props.page_name == 'store' || self.props.page_name == 'group') {
                        self.setState({ redirect: 1 });
                    }
                    let menudashboard = $("#menudashboard");
                    menudashboard.find('li[data-production-course-id="' + " " + $.trim(data.course_node_id) + '"] .collapsedCourseBox').addClass('expandedCourseBox');
                    menudashboard.find('li.main_production_list[data-id="' + data.production_node_id + '"]').addClass('current');
                    $(".list-detail .nano").nanoScroller({scrollTo: $('.openup')});
                });
            }
        });
    }

    isCourseAndDialogueViewSame(data) {
        let currentChatDialogueDetail = this.props.currentChatDialogueDetail;
        if (!currentChatDialogueDetail) return false;
        if (!currentChatDialogueDetail.course_node_id) return false;
        if (!currentChatDialogueDetail.dialogue_node_id) return false;

        if ($.trim(data.dialogue_node_id) == $.trim(currentChatDialogueDetail.dialogue_node_id)) {
            return true;
        }
        return false;
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
        page_name: state.page_name
    }
}

const ConnectedConnection = connect(mapStateToProps)(Connection);
export default ConnectedConnection;
