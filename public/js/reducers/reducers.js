import React from 'react';
import {setStatementDetailById} from '../components/functions/common_functions';
import MarketPlaceObject from '../components/marketplace/MarketplaceObject';

const getListByIndex = (list, index) => {
    if (typeof list.map == 'function') {

    }
}


const ChatReducer = (state, action) => {

    let newState, chatItems, defaultParams, responseArr, courseList, newProductionStart, newProductionInstance,
        newProductionAdd, prevNewProductionCourse;
    switch (action.type) {
        case 'CHANGE_CHAT_TYPE':
            state.chatType = action.value;
            return state;
            break;
        case 'UPDATE_CHAT_LIST':
            newState = Object.assign({}, state);
            newState.chatItems = action.value.chatItems;
            newState.chatType = action.value.chatType;
            newState.isEditTitle = 0;
            //console.log(action.value);
            if (state.currentChatDialogueDetail && state.currentChatDialogueDetail.course_node_id) {
                if (typeof state.courseList == 'string') {
                    state.courseList = JSON.parse(state.courseList);
                }
                courseList = Object.assign({}, state.courseList);
                if ($.isArray(courseList)) {
                    courseList = {};
                }
                let currentChatDialogueDetail = state.currentChatDialogueDetail;

                if (currentChatDialogueDetail.dialogue_node_id && state.view_type == 'bycourse') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].count['course'] -= courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.notificationCount;
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.notificationCount = 0;
                    let dialogueNotifications = 0;
                    let dialogueKeys = Object.keys(courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue);
                    for (let key = 0; key < dialogueKeys.length; key++) {
                        dialogueNotifications = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[dialogueKeys[key]].dialogue.notificationCount;
                        if (dialogueNotifications) {
                            break;
                        }
                    }
                    if (dialogueNotifications == 0) {
                        courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].has_received_notification = 0;
                        courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].count['course'] = 0;
                    }
                } else if(state.view_type == 'bydialogue') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].notificationCount = 0;
                } else if(state.view_type == 'byactor') {
                    Object.keys(courseList).map((user_id, index) => {
                        let course = courseList[user_id];
                        if(course.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)]) {
                            course.has_received_notification -= course.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].notificationCount;
                            course.dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].notificationCount = 0;
                        }
                    });

                }
                newState['courseList'] = courseList;
            }

            return newState;
            break;
        case 'REMOVE_CHAT':
            newState = Object.assign({}, state);
            return state;
            break;
        case 'EDIT_CHAT':
            newState = Object.assign({}, state);
            data = action.value.data;
            defaultParams = data.default_params;
            chatItems = newState.chatItems;
            if (typeof chatItems == 'string') {
                chatItems = $.parseJSON(chatItems);
            }

            let update_status = 0;
            if (defaultParams['chat_action_type'] == 'delete') {
                update_status = 2;
            } else if (defaultParams['chat_action_type'] == 'edit') {
                update_status = 1;
            }

            let statementDetails = {};

            if (state.chatType.toLowerCase() == 'chat') {
                if (update_status == 2) {
                    statementDetails = {
                        updated_status: update_status,
                        // statement_timestamp: data.timestamp_seconds,
                        statement_updated_timestamp: action.value.data.statement_updated_timestamp
                    };
                    setStatementDetailById('chat', defaultParams.statement_node_id, chatItems, statementDetails);
                } else if (update_status == 1) {
                    statementDetails = {
                        statement: data.message,
                        updated_status: update_status,
                        statement_updated_timestamp: action.value.data.statement_updated_timestamp,
                        // statement_timestamp: data.timestamp_seconds,
                    };
                    setStatementDetailById('chat', defaultParams.statement_node_id, chatItems, statementDetails);
                }
                else {
                    chatItems[defaultParams['group_ref']][defaultParams['list_ref']]['statement'][defaultParams['self_ref']] = {
                        'statement': data.message,
                        node_instance_propertyid: action.value.statement_node_id,
                        statement_updated_timestamp: action.value.data.statement_updated_timestamp,
                        // statement_timestamp: data.timestamp_seconds,
                    };
                }
            } else {
                statementDetails = {
                    statement: data.message,
                    update_status: update_status,
                    statement_updated_timestamp: action.value.data.statement_updated_timestamp,
                    // statement_timestamp: data.timestamp_seconds,
                };
                setStatementDetailById('letter', defaultParams.statement_node_id, chatItems, statementDetails);
            }
            newState.chatItems = JSON.stringify(chatItems);
            newState.updaetd_timestamp = new Date().getTime();
            return newState;
            break;
        case 'APPEND_NEW_CHAT':
            newState = Object.assign({}, state);
            chatItems = newState.chatItems;
            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            if ($.isArray(courseList)) {
                courseList = {};
            }
            var data = action.value;
            if (data.highlight_course == 1) {
                let edit_msg = 1;
                if (action.value.default_params.chat_action_type && action.value.default_params.chat_action_type == 'edit') {
                    edit_msg = 0;
                }
                if (state.view_type == 'bycourse' && data.user_current_session_id != setUserID && edit_msg) { // for receipient
                    // if all courses are collapsed
                    if (!state.currentChatDialogueDetail) {
                        courseList[' ' + $.trim(data.course_node_id)].has_received_notification = 1;
                        if (Object.keys(courseList[' ' + $.trim(data.course_node_id)].dialogue).length) {
                            courseList[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.notificationCount += data.newMessageCountArr.length;
                        }
                        courseList[' ' + $.trim(data.course_node_id)].count['course'] += data.newMessageCountArr.length;
                    } else if ($.trim(state.currentChatDialogueDetail.course_node_id) == $.trim(data.course_node_id) && $.trim(state.currentChatDialogueDetail.dialogue_node_id) != $.trim(data.dialogue_node_id)) {
                        courseList[' ' + $.trim(data.course_node_id)].has_received_notification = 1;
                        if (Object.keys(courseList[' ' + $.trim(data.course_node_id)].dialogue).length) {
                            courseList[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.notificationCount += data.newMessageCountArr.length;
                        }
                        courseList[' ' + $.trim(data.course_node_id)].count['course'] += data.newMessageCountArr.length;
                    } else if ($.trim(state.currentChatDialogueDetail.course_node_id) != $.trim(data.course_node_id)) {
                        // user is not chatting on the same course
                        courseList[' ' + $.trim(data.course_node_id)].has_received_notification = 1;
                        if (Object.keys(courseList[' ' + $.trim(data.course_node_id)].dialogue).length) {
                            courseList[' ' + $.trim(data.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.notificationCount += data.newMessageCountArr.length;
                        }
                        courseList[' ' + $.trim(data.course_node_id)].count['course'] += data.newMessageCountArr.length;
                    }
                    newState.courseList = courseList;
                    return newState;
                    break;
                } else if (state.view_type == 'bydialogue' && data.user_current_session_id != setUserID && edit_msg) { // for receipient
                    if (courseList[' ' + $.trim(data.dialogue_node_id)]) {
                        courseList[' ' + $.trim(data.dialogue_node_id)].notificationCount += data.newMessageCountArr.length;
                        newState.courseList = courseList;
                        return newState;
                    }
                } else if (state.view_type == 'byactor' && data.user_current_session_id != setUserID && edit_msg) { // for receipient
                    let receipients = data.user_actor_node_id.split(',');
                    receipients.map((user_id, index) => {
                        if(courseList[' ' + $.trim(user_id)]) {
                            courseList[' ' + $.trim(user_id)].has_received_notification += data.newMessageCountArr.length;
                            courseList[' ' + $.trim(user_id)].dialogue[' '+$.trim(data.dialogue_node_id)].notificationCount += data.newMessageCountArr.length;
                        }
                    });
                    newState.courseList = courseList;
                    return newState;
                }
                return state;
                break;
            }


            if (typeof chatItems == 'string') {
                chatItems = $.parseJSON(state.chatItems);
            }

            var dateTime = data.date_time.split(' ')[0];
            let first_name = data.first_name;
            let last_name = data.last_name;
            if (data.sender_full_name && !data.last_name) {
                first_name = data.sender_full_name;
                last_name = '';
            }
            var newChat = {
                instance: {
                    first_name: first_name,
                    last_name: last_name,
                    timestamp: data.timestamp_seconds,
                    statement: data.message,
                    profile_image: data.profile_image,
                    'actor.author': data.user_current_session_id
                },
                timestamp: data.timestamp_seconds
            };
            // debugger;
            let is_system_message = false;
            if (data.responseArr && data.responseArr.system_message) {
                newChat.instance.statement = {
                    0: {
                        statement: data.responseArr.system_message,
                        node_instance_propertyid: data.statement_node_id,
                        statement_type: 'System Message',
                        updated_status: 0,
                        statement_timestamp: data.timestamp_seconds
                    }
                };
                newChat.timestamp = data.responseArr.timestamp_seconds;

                is_system_message = true;
            }
            if (state.chatType.toLowerCase() == 'chat') {
                newChat = newChat.instance;
                if (!is_system_message) {
                    if (typeof data.message == 'string') {
                        let newData = {
                            statement: newChat.statement,
                            node_instance_property_id: data.statement_node_id,
                            statement_type: data.statement_type,
                            node_instance_propertyid: data.statement_node_id,
                            statement_timestamp: data.timestamp_seconds
                        };
                        if ('reply' in data) {
                            newData.reply = data.reply;
                        }
                        newChat.statement = {};
                        newChat.statement[data.statement_node_id] = newData;
                    } else {
                        newChat.statement = data.message;
                    }
                } else {
                    newChat.first_name = data.default_params.added_by_name;
                    newChat.last_name = '';
                    newChat.has_system_message = 1;
                    data.statement_type = 'System Message';
                }

                if (data.attachmentName != 'null') {
                    newChat.statement_type = data.statement_type;
                }
                newChat.node_instance_propertyid = data.statement_node_id;
            } else {
                newChat.blank_stmt_node_id = data.statement_node_id.split('-')[0];
            }

            if (chatItems[dateTime]) {
                if (state.chatType.toLowerCase() == 'chat') {

                    var additionalInfo = Object.keys(chatItems[dateTime]);
                    var lastIndex = additionalInfo[additionalInfo.length - 1];

                    if (is_system_message) {
                        lastIndex = parseInt(lastIndex) + 1;
                        chatItems[dateTime][lastIndex] = newChat;
                    } else {

                        var lastChat = chatItems[dateTime][lastIndex];
                        var lastDay = moment((lastChat.timestamp * 1000)).format("D");
                        var currentDay = moment((newChat.timestamp * 1000)).format("D");
                        var days = lastDay - currentDay;
                        var author = lastChat['actor.author'];

                        if (days == 0 && data.user_current_session_id == author && !lastChat.has_system_message) { // group messages in one statement if sent withing one day by the same user

                            if (data.statement_type.toLowerCase() == '') {

                                let statementIndex = lastChat.statement.length;
                                if (typeof statementIndex == 'undefined') {
                                    statementIndex = Object.keys(lastChat.statement);
                                    statementIndex = statementIndex[statementIndex.length - 1];
                                } else {
                                    statementIndex = statementIndex - 1;
                                }
                                if (lastChat.statement[statementIndex].statement_type.toLowerCase() == 'image') {
                                    lastChat.statement[data.statement_node_id] = {
                                        statement: data.message,
                                        node_instance_propertyid: data.statement_node_id,
                                        statement_type: data.statement_type,
                                        statement_timestamp: data.timestamp_seconds
                                    }
                                    if ('reply' in data) {
                                        lastChat.statement[data.statement_node_id].reply = data.reply;
                                    }
                                } else if (lastChat.statement[statementIndex].statement_type.toLowerCase() == 'system message') {
                                    lastIndex = parseInt(lastIndex) + 1;
                                    chatItems[dateTime][lastIndex] = newChat;
                                } else {
                                    let statementKeys = newChat.node_instance_propertyid.split('~');
                                    Object.keys(newChat['statement']).map(function (key, index) {
                                        let stmt = newChat['statement'][key];
                                        stmt.statement_timestamp = data.timestamp_seconds;
                                        lastChat['statement'][statementKeys[index]] = stmt;
                                    });
                                }
                            } else {
                                if (data.statement_type.toLowerCase() == '') {
                                    lastIndex = parseInt(lastIndex) + 1;
                                    chatItems[dateTime][lastIndex] = newChat;
                                } else {
                                    lastChat.statement[data.statement_node_id] = {
                                        statement: data.message,
                                        node_instance_propertyid: data.statement_node_id,
                                        statement_type: newChat.statement_type,
                                        statement_timestamp: data.timestamp_seconds
                                    };
                                }
                            }
                        } else {
                            if (state.chatType.toLowerCase() == 'chat') {
                                lastIndex = parseInt(lastIndex) + 1;
                                chatItems[dateTime][lastIndex] = newChat;
                            } else {

                            }
                        }
                    }
                } else {
                    if (state.chatType.toLowerCase() == 'chat') {
                        chatItems[dateTime] = {
                            0: newChat
                        };
                    } else {
                        var indexKeys = Object.keys(chatItems[dateTime]);
                        var index = (indexKeys.length) + 1;
                        chatItems[dateTime][index] = newChat;
                    }
                }

            } else {
                if (state.chatType.toLowerCase() == 'chat') {
                    chatItems[dateTime] = {
                        0: newChat
                    };
                } else {
                    chatItems[dateTime] = {0: newChat};
                }
            }
            if (is_system_message) {
                data.course_node_id = data.default_params.course_node_id;
            }
            if (state.view_type == 'bycourse' && data.user_current_session_id != setUserID) { // for receipient
                // if all courses are collapsed
                if (!state.currentChatDialogueDetail) {
                    courseList[' ' + $.trim(data.course_node_id)].has_received_notification = 1;
                    courseList[' ' + $.trim(data.course_node_id)].count['course'] += 1;
                } else if ($.trim(state.currentChatDialogueDetail.course_node_id) != $.trim(data.course_node_id)) {
                    // user is not chatting on the same course
                    courseList[' ' + $.trim(data.course_node_id)].has_received_notification = 1;
                    courseList[' ' + $.trim(data.course_node_id)].count['course'] += 1;
                }
            }
            newState.chatItems = chatItems;

            newState.updaetd_timestamp = new Date().getTime();
            return newState;
            break;
        case 'APPEND_DIALOGUE_LIST':
            newState = Object.assign({}, state);
            let dialogueList = action.value.response;
            if (typeof dialogueList == 'string') {
                dialogueList = JSON.parse(dialogueList);
            }

            if (typeof state.courseList == 'string') {
                courseList = JSON.parse(state.courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(state.courseList));
            }
            if (action.value.updateCurrentChatDialogueDetail) {
                newState.currentChatDialogueDetail = {
                    expand_course_node_id: action.value.course_node_id,
                    expand_dialogue_node_id: action.value.dialogue_node_id,
                    course_node_id: action.value.course_node_id,
                    dialogue_node_id: action.value.dialogue_node_id,
                    dialogue_status: action.value.dialogue_status,
                }
                newState.changeChatView = action.value.change_chat_view;

                if (action.value.clear_chat_items) {
                    newState.chatItems = {};
                }

                action.value.course_node_id = ' ' + action.value.course_node_id;

            }
            courseList[action.value.course_node_id].dialogue = dialogueList;
            newState['courseList'] = courseList;

            return newState;
            break;
        case 'CHANGE_CHAT_VIEW':
            newState = Object.assign({}, state);
            newState.changeChatView = action.value.change_chat_view;
            newState.currentChatDialogueDetail = action.value.currentChatDialogueDetail;
            let chat_view_type;
            if (newState.currentChatDialogueDetail && newState.currentChatDialogueDetail.chat_view_type) {
                chat_view_type = newState.currentChatDialogueDetail.chat_view_type;
            }
            if (chat_view_type && (chat_view_type == 'add_new_dialogue' || chat_view_type == 'add_new_course')) {
                newState['showAdminHeader'] = 0;
            }
            if (newState.changeChatView == 0) {
                newState['showAdminHeader'] = 0;
            }
            if (action.value.clear_chat_items) {
                newState.chatItems = {};
            }
            if (action.value.chatType) {
                newState.chatType = action.value.chatType;
            }

            return newState;
            break;
        case 'APPEND_ACTOR_LIST':
            newState = Object.assign({}, state);
            var actors = action.value.response;
            if (typeof actors == 'string') {
                actors = JSON.parse(actors);
            }
            if (typeof newState['courseList'] == 'string') {
                newState['courseList'] = JSON.parse(newState['courseList']);
            }
            newState['courseList'][' ' + $.trim(action.value.course_node_id)].actors = actors;

            return newState;
            break;
        case 'APPEND_RESOURCE_LIST':
            newState = Object.assign({}, state);
            let resources = action.value.response;
            if (typeof resources == 'string') {
                resources = JSON.parse(resources);
            }
            if (typeof newState['courseList'] == 'string') {
                newState['courseList'] = JSON.parse(newState['courseList']);
            }
            newState['courseList'][' ' + $.trim(action.value.course_node_id)].resources = resources;

            return newState;
            break;
        case 'UPDATE_ACTOR_LIST':
            newState = Object.assign({}, state);

            if (typeof state.courseList == 'string') {
                courseList = JSON.parse(state.courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(state.courseList));
            }
            if ($.isArray(courseList)) {
                courseList = {};
            }
            data = action.value.data;
            defaultParams = data.default_params;
            if (typeof data.responseArr == 'string') {
                responseArr = JSON.parse(data.responseArr);
            } else {
                responseArr = JSON.parse(JSON.stringify(data.responseArr));
            }

            if (state.view_type == 'bycourse') {

                defaultParams.course_node_id = $.trim(defaultParams.course_node_id);
                let currentCourse = courseList[' ' + defaultParams.course_node_id];
                let countArr = responseArr['new_course'][' ' + $.trim(defaultParams.course_node_id)].count;
                if (state.currentChatDialogueDetail && (state.currentChatDialogueDetail.course_node_id == defaultParams.course_node_id && state.currentChatDialogueDetail.dialogue_node_id == defaultParams.dialogue_node_id)) {
                    //sender and receiver is on the same course and dialogue window
                    var actors = courseList[' ' + defaultParams.course_node_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].users;
                    let hasActors = Object.keys(currentCourse.actors).length;
                    let dialogueActors = (hasActors) ? currentCourse.actors : {};

                    Object.keys(responseArr.actor_list).map(function (key) {
                        let user = responseArr.actor_list[key];
                        if (user.has_removed == 0) {
                            actors[key] = user;
                        }
                        dialogueActors[key] = user;
                    });
                    currentCourse.dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].users = actors;

                    // update count of actor
                    currentCourse.count['actors'] = countArr.actors;

                    if (hasActors) {
                        currentCourse.actors = dialogueActors;
                    }
                    newState['courseList'] = courseList;
                    return newState;
                }
                if (currentCourse && Object.keys(currentCourse.dialogue).length) {
                    // if the dialogue already exists then update actors list only
                    if (currentCourse.dialogue[' ' + $.trim(data.dialogue_node_id)]) {
                        var actors = currentCourse.dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].users;
                        let hasActors = Object.keys(currentCourse.actors).length;
                        let dialogueActors = (hasActors) ? currentCourse.actors : {};
                        Object.keys(responseArr.actor_list).map(function (key) {
                            let user = responseArr.actor_list[key];
                            if (user.has_removed == 0) {
                                actors[key] = user;
                            }
                            dialogueActors[key] = user;
                        });
                        currentCourse.dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].users = actors;
                        currentCourse.actors = dialogueActors
                        // course highlight and dialogue notification count
                        // if all courses are collapsed
                        if (!state.currentChatDialogueDetail || $.trim(state.currentChatDialogueDetail.course_node_id) == $.trim(defaultParams.course_node_id) && $.trim(state.currentChatDialogueDetail.dialogue_node_id) != $.trim(defaultParams.dialogue_node_id)) {
                            courseList[' ' + $.trim(defaultParams.course_node_id)].has_received_notification = 1;
                            if (Object.keys(courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue).length) {
                                courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].dialogue.notificationCount += action.value.data.newMessageCountArr.length;
                            }
                            currentCourse.count['course'] += countArr.course;

                        } else if ($.trim(state.currentChatDialogueDetail.course_node_id) != $.trim(defaultParams.course_node_id)) {
                            // user is not chatting on the same course
                            courseList[' ' + $.trim(defaultParams.course_node_id)].has_received_notification = 1;
                            if (Object.keys(courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue).length) {
                                courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].dialogue.notificationCount += action.value.data.newMessageCountArr.length;
                            }
                            currentCourse.count['course'] += countArr.course;
                        }
                        // Update count for listing
                        currentCourse.count['actors'] = countArr.actors;


                        newState['courseList'] = courseList;
                        return newState;
                    }
                    // otherwise add that dialogue in the list
                    let newDialogue = responseArr.new_course[' ' + data.course_node_id].dialogue[' ' + $.trim(data.dialogue_node_id)];
                    currentCourse.dialogue[' ' + $.trim(data.dialogue_node_id)] = newDialogue;
                    // course highlight and dialogue notification count
                    currentCourse.has_received_notification = 1;
                    currentCourse.dialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.notificationCount = action.value.data.newMessageCountArr.length;
                    // Update count for listing
                    Object.keys(countArr).map((index) => {
                        let value = countArr[index];
                        if (index == 'actors') {
                            currentCourse.count[index] = value;
                        } else {
                            currentCourse.count[index] += value;
                        }
                    });
                    newState['courseList'] = courseList;
                    return newState;
                }
                // otherwise add that course in the list
                responseArr = action.value.data.responseArr;
                let newCourseList = {};

                newCourseList[' ' + action.value.data.course_node_id] = responseArr.new_course[' ' + $.trim(action.value.data.course_node_id)];
                // course highlight and dialogue notification count
                newCourseList[' ' + action.value.data.course_node_id].has_received_notification = 1;
                newCourseList[' ' + action.value.data.course_node_id].dialogue[' ' + $.trim(action.value.data.dialogue_node_id)].dialogue.notificationCount = action.value.data.newMessageCountArr.length;
                Object.keys(courseList).map(function (key) {
                    let list = courseList[key];
                    newCourseList[key] = list;
                });
                newState['courseList'] = newCourseList;

                return newState;
            }
            if (state.view_type == 'byactor') {
                let currentCourse = responseArr['new_course'][' ' + data.course_node_id];
                if (!currentCourse) {
                    currentCourse = responseArr['new_course'][data.course_node_id];
                }
                let newDialogue = currentCourse.dialogue;
                let actors = newDialogue[' ' + $.trim(data.dialogue_node_id)].users;
                newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.dialogue = newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.dialogue_title;
                let courseDetails = {};
                courseDetails = {
                    course: currentCourse.course,
                    course_node_id: currentCourse.course_node_id,
                    course_instance_id: '',
                    status: currentCourse.status,
                    course_created_by: currentCourse.created_by,
                    course_creation_date: currentCourse.date
                };
                newDialogue[' ' + $.trim(data.dialogue_node_id)] = newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue;
                newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue_created_by = newDialogue[' ' + $.trim(data.dialogue_node_id)].created_by;
                $.extend(newDialogue[' ' + $.trim(data.dialogue_node_id)], courseDetails);

                let isSort = 0;
                Object.keys(actors).map(function (key) {
                    let actor = actors[key];
                    if (courseList[' ' + actor.user_id]) {
                        //courseList[' ' + actor.user_id].dialogue[' ' + $.trim(data.dialogue_node_id)] = newDialogue[' ' + $.trim(data.dialogue_node_id)];
                        let newDialogueList = {};
                        newDialogueList[' ' + $.trim(data.dialogue_node_id)] = newDialogue[' ' + $.trim(data.dialogue_node_id)];

                        Object.keys(courseList[' ' + actor.user_id].dialogue).map(function (index) {
                            newDialogueList[index] = courseList[' ' + actor.user_id].dialogue[index];
                        });
                        newDialogueList[' ' + $.trim(data.dialogue_node_id)].users = actors;
                        courseList[' ' + actor.user_id].dialogue = newDialogueList;
                    } else if (actor.user_id != setUserID) {
                        isSort = 1;

                        let byActorJSON = {
                            dialogue: newDialogue,
                            email_address: actor.email,
                            first_name: actor.first_name,
                            last_name: actor.last_name,
                            domain: 'Prospus',
                            title: 'Admin'
                        };
                        // add user list
                        byActorJSON.dialogue[' ' + $.trim(data.dialogue_node_id)].users = actors;
                        courseList[' ' + actor.user_id] = byActorJSON;
                    }
                });

                // if new user added then sort the list
                if (isSort) {
                    let courseListKeys = Object.keys(courseList);
                    // Sort keys
                    courseListKeys.sort(function (a, b) {
                        let nameA = (courseList[a].first_name + ' ' + courseList[a].last_name).toUpperCase(); // ignore upper and lowercase
                        let nameB = (courseList[b].first_name + ' ' + courseList[b].last_name).toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    });
                    // Make new list and assign to old list
                    var newCourseList = {};
                    courseListKeys.map(function (index) {
                        newCourseList[index] = courseList[index];
                    });
                    courseList = newCourseList;
                }

                /*if(courseList[' ' + defaultParams.added_by_id]) {
                 let newDialogue = responseArr.new_course[' ' + data.course_node_id].dialogue[data.dialogue_node_id].dialogue;
                 newDialogue.dialogue = newDialogue.dialogue_title;
                 courseList[' '+defaultParams.added_by_id].dialogue[data.dialogue_node_id] = newDialogue;
                 newState['courseList'] = courseList;
                 return newState;
                 }
                 var actors = responseArr.new_course[' ' + data.course_node_id].dialogue[data.dialogue_node_id].users;
                 let newDialogue = responseArr.new_course[' ' + data.course_node_id].dialogue[data.dialogue_node_id].dialogue;
                 newDialogue.dialogue = newDialogue.dialogue_title;

                 let newUserWithDialogue = {};
                 newUserWithDialogue[' ' + defaultParams.added_by_id] = actors[defaultParams.added_by_id];
                 newUserWithDialogue[' ' + defaultParams.added_by_id].dialogue = {};
                 newUserWithDialogue[' ' + defaultParams.added_by_id].dialogue[data.dialogue_node_id] = newDialogue;

                 courseList[' ' + defaultParams.added_by_id] = newUserWithDialogue[' ' + defaultParams.added_by_id];*/
                newState['courseList'] = courseList;
                return newState;
            }
            break;
        case 'REMOVE_ACTOR':
            newState = Object.assign({}, state);
            courseList = Object.assign({}, state.courseList);
            if ($.isArray(courseList)) {
                courseList = {};
            }
            defaultParams = action.value.default_params;

            if (state.view_type == 'bycourse') {
                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }
                if (Object.keys(courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue).length) {
                    let targetDialogue = courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)];
                    let removedUser;
                    if (Object.keys(targetDialogue.users).length) {
                        removedUser = targetDialogue.users[defaultParams.removed_user_id];
                    }
                    defaultParams.course_node_id = $.trim(defaultParams.course_node_id);
                    // if removed user exists only in one dialogue or the user has been removed from all dialogues then make that user disabled in 'actors' tab
                    let dialogues = courseList[' ' + defaultParams.course_node_id].dialogue;
                    if (!courseList[' ' + defaultParams.course_node_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].removed_users) {
                        courseList[' ' + defaultParams.course_node_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].removed_users = {};
                    }

                    // if(Object.keys(courseList[' ' + defaultParams.course_node_id].dialogue[defaultParams.dialogue_node_id].removed_users).length) {
                    courseList[' ' + defaultParams.course_node_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].removed_users[defaultParams.removed_user_id] = removedUser;
                    // }
                    if (Object.keys(courseList[' ' + defaultParams.course_node_id].actors).length) {
                        courseList[' ' + defaultParams.course_node_id].actors[defaultParams.removed_user_id].has_removed = action.value.responseArr.has_removed;
                    }

                    var participant = courseList[' ' + defaultParams.course_node_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].users;
                    delete participant[defaultParams.removed_user_id];
                }

                // course highlight and dialogue notification count
                // if all courses are collapsed
                if (!state.currentChatDialogueDetail || $.trim(state.currentChatDialogueDetail.course_node_id) == $.trim(defaultParams.course_node_id) && $.trim(state.currentChatDialogueDetail.dialogue_node_id) != $.trim(defaultParams.dialogue_node_id)) {
                    courseList[' ' + $.trim(defaultParams.course_node_id)].has_received_notification = 1;
                    if (Object.keys(courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue).length) {
                        courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].dialogue.notificationCount += action.value.data.newMessageCountArr.length;
                    }
                    courseList[' ' + $.trim(defaultParams.course_node_id)].count['course'] += action.value.data.newMessageCountArr.length;
                } else if ($.trim(state.currentChatDialogueDetail.course_node_id) != $.trim(defaultParams.course_node_id)) {
                    // user is not chatting on the same course
                    courseList[' ' + $.trim(defaultParams.course_node_id)].has_received_notification = 1;
                    if (Object.keys(courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue).length) {
                        courseList[' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].dialogue.notificationCount += action.value.data.newMessageCountArr.length;
                    }
                    courseList[' ' + $.trim(defaultParams.course_node_id)].count['course'] += action.value.data.newMessageCountArr.length;
                }
                newState['courseList'] = courseList;
                return newState;
                break;
            }

            if (state.view_type == 'bydialogue') {

                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }
                let actors = courseList[' ' + defaultParams.dialogue_node_id].actors;
                if (actors[defaultParams.removed_user_id]) {
                    // Can not disabled / grayout user from list, in 'by dialogue' remove user from list
                    courseList[' ' + defaultParams.dialogue_node_id].actors[defaultParams.removed_user_id].has_removed = 1;
                    // delete courseList[' ' + defaultParams.dialogue_node_id].actors[defaultParams.removed_user_id];
                }
                // delete courseList[' '+defaultParams.dialogue_node_id];
                newState['courseList'] = courseList;
                return newState;
                break;
            }
            if (state.view_type == 'byactor') {
                debugger;
                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }

                // Object.keys(courseList).map(function (key) {
                //     if (courseList[key].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)]) {
                //         courseList[key].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].has_removed = 1;
                //     }
                //
                // });
                courseList[' '+defaultParams.removed_user_id].dialogue[' ' + $.trim(defaultParams.dialogue_node_id)].has_removed = 1;

                if('currentChatDialogueDetail' in state && state.currentChatDialogueDetail.course_node_id) {
                    // set "has_removed = 1" for removed user
                    courseList[' '+$.trim(state.currentChatDialogueDetail.course_node_id)].dialogue[' '+state.currentChatDialogueDetail.dialogue_node_id].users[defaultParams.removed_user_id].has_removed = 1;
                }
                newState['courseList'] = courseList;
                return newState;
                break;

            }
        case 'ADD_NEW_COURSE':
            newState = Object.assign({}, state);
            // courseList = state.courseList;
            // if(typeof state.courseList == 'string') {
            //     courseList = JSON.parse(state.courseList);
            // }
            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            if ($.isArray(courseList)) {
                courseList = {};
            }

            defaultParams = action.value.default_params;
            responseArr = action.value.data.responseArr;
            let created_by = action.value.created_by;

            let newCourseList = {};

            newCourseList[' ' + action.value.data.course_node_id] = responseArr.new_course[' ' + $.trim(action.value.data.course_node_id)];
            if (created_by != setUserID) { // for receipient
                newCourseList[' ' + action.value.data.course_node_id].has_received_notification = 1;
                if (newCourseList[' ' + action.value.data.course_node_id].dialogue[' ' + $.trim(action.value.data.dialogue_node_id)]) {
                    newCourseList[' ' + action.value.data.course_node_id].dialogue[' ' + $.trim(action.value.data.dialogue_node_id)].dialogue.notificationCount = action.value.data.newMessageCountArr.length;
                }
                // if receipient is chatting with someone then newly created course should be collapsed
                if (state.currentChatDialogueDetail && state.currentChatDialogueDetail.course_node_id && state.currentChatDialogueDetail.dialogue_node_id) {
                    state.currentChatDialogueDetail.expand_course_node_id = state.currentChatDialogueDetail.course_node_id;
                    state.currentChatDialogueDetail.expand_dialogue_node_id = state.currentChatDialogueDetail.dialogue_node_id;
                }
            } else { // for creator, update currentChatDialogueDetail
                state.currentChatDialogueDetail = {};
                state.currentChatDialogueDetail.course_node_id = action.value.currentChatDialogueDetail.course_node_id;
            }

            if (courseList.status == 0) { // If there is no course available in the list then create new object
                newState['courseList'] = {};
                newState['courseList'] = newCourseList;
            } else {
                Object.keys(courseList).map(function (key) {
                    let list = courseList[key];
                    newCourseList[key] = list;
                });
                newState['courseList'] = newCourseList;
            }

            return newState;
            break;
        case 'EDIT_TITLE':
            newState = Object.assign({}, state);
            newState.isEditTitle = action.value.isEditTitle;
            newState.isEditMode = action.value.isEditMode;
            // newState.showAdminHeader = action.value.showAdminHeader;
            return newState;
            break;

        case 'UPDATE_COURSE_TITLE':
            newState = Object.assign({}, state);

            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            if ($.isArray(courseList)) {
                courseList = {};
            }
            if (state.view_type == 'bydialogue') {
                Object.keys(courseList).map(function (key) {
                    if ($.trim(courseList[key].course_node_id) == $.trim(action.value.courseNodeId)) {
                        courseList[key].course = action.value.courseTitle;
                    }
                });

            }
            if (state.view_type == 'bycourse') {
                courseList[' ' + $.trim(action.value.courseNodeId)].course = action.value.courseTitle;
            }
            newState['courseList'] = courseList;
            return newState;
            break;
        case 'UPDATE_DIALOGUE_TITLE':
            newState = Object.assign({}, state);
            if (typeof state.courseList == 'string') {
                state.courseList = JSON.parse(state.courseList);
            }
            courseList = Object.assign({}, state.courseList);
            if ($.isArray(courseList)) {
                courseList = {};
            }
            if (state.view_type == 'byactor') {
                Object.keys(courseList).map(function (key) {
                    if (courseList[key].dialogue[' ' + $.trim(action.value.dialogueNodeId)]) {
                        courseList[key].dialogue[' ' + $.trim(action.value.dialogueNodeId)].dialogue = action.value.dialogueTitle;
                    }

                });
            }
            if (state.view_type == 'bydialogue') {
                courseList[' ' + $.trim(action.value.dialogueNodeId)].dialogue = action.value.dialogueTitle;
            }
            if (state.view_type == 'bycourse') {
                let dialogue = courseList[' ' + $.trim(action.value.courseNodeId)].dialogue;
                if (Object.keys(dialogue).length) {
                    dialogue[' ' + $.trim(action.value.dialogueNodeId)].dialogue.dialogue_title = action.value.dialogueTitle;
                }

                var data = action.value;
                if (state.view_type == 'bycourse' && data.user_current_session_id != setUserID) { // for receipient
                    // if all courses are collapsed
                    if (!state.currentChatDialogueDetail || $.trim(state.currentChatDialogueDetail.course_node_id) == $.trim(data.courseNodeId) && $.trim(state.currentChatDialogueDetail.dialogue_node_id) != $.trim(data.dialogueNodeId)) {
                        courseList[' ' + $.trim(data.courseNodeId)].has_received_notification = 1;
                        if (Object.keys(courseList[' ' + $.trim(data.courseNodeId)].dialogue).length) {
                            courseList[' ' + $.trim(data.courseNodeId)].dialogue[' ' + $.trim(data.dialogueNodeId)].dialogue.notificationCount += data.newMessageCountArr;
                        }
                        courseList[' ' + $.trim(data.courseNodeId)].count['course'] += 1;
                    } else if ($.trim(state.currentChatDialogueDetail.course_node_id) != $.trim(data.courseNodeId)) {
                        // user is not chatting on the same course
                        if (Object.keys(courseList[' ' + $.trim(data.courseNodeId)].dialogue).length) {
                            courseList[' ' + $.trim(data.courseNodeId)].dialogue[' ' + $.trim(data.dialogueNodeId)].dialogue.notificationCount += data.newMessageCountArr;
                        }
                        courseList[' ' + $.trim(data.courseNodeId)].has_received_notification = 1;
                        courseList[' ' + $.trim(data.courseNodeId)].count['course'] += 1;
                    }
                }


            }


            newState['courseList'] = courseList;
            return newState;
            break;
        case 'APPEND_NEW_DIALOGUE':
            //debugger;
            newState = Object.assign({}, state);
            data = action.value.data;
            defaultParams = data.default_params;
            defaultParams.course_node_id = $.trim(defaultParams.course_node_id);
            if (!defaultParams.course_node_id) {
                defaultParams.course_node_id = data.course_node_id;
            }
            if (typeof data.responseArr == 'string') {
                responseArr = JSON.parse(data.responseArr);
            } else {
                responseArr = JSON.parse(JSON.stringify(data.responseArr));
            }

            let currentCourse = responseArr['new_course'][' ' + defaultParams.course_node_id];
            if (!currentCourse) {
                currentCourse = responseArr['new_course'][defaultParams.course_node_id];
            }
            let newDialogue = currentCourse.dialogue;
            let countArr = currentCourse.count;
            if (state.view_type == 'bycourse') {
                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }
                let targetCourse = courseList[' ' + defaultParams.course_node_id];
                if (!targetCourse) {
                    targetCourse = courseList[defaultParams.course_node_id];
                }

                if (targetCourse && Object.keys(targetCourse).length) {
                    // For receipient, course should be highlighted when new dialogue is added.
                    // If user is chatting then do not highlight that course
                    if (defaultParams.added_by_id != setUserID) {
                        courseList[' ' + $.trim(defaultParams.course_node_id)].has_received_notification = 1;
                        newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.notificationCount = 1;

                        // Update count for listing
                        Object.keys(countArr).map((index) => {
                            let value = countArr[index];
                            if (index == 'actors') {
                                courseList[' ' + $.trim(defaultParams.course_node_id)].count[index] = value;
                            } else {
                                courseList[' ' + $.trim(defaultParams.course_node_id)].count[index] += value;
                            }
                        });
                    }
                    // added by is same then update count of all except course count
                    if (defaultParams.added_by_id == setUserID) {
                        // Update count for listing
                        Object.keys(countArr).map((index) => {
                            let value = countArr[index];
                            if (index == 'actors') {
                                courseList[' ' + $.trim(defaultParams.course_node_id)].count[index] = value;
                            } else {
                                if (index != 'course') {
                                    courseList[' ' + $.trim(defaultParams.course_node_id)].count[index] += value;
                                }

                            }
                        });
                    }
                    //}
                    // Add new dialogue on top of dialogue list in by course
                    let dialoguesList = courseList[' ' + defaultParams.course_node_id].dialogue;
                    let newDialogueList = {};
                    if (dialoguesList.status == 0) {
                        courseList[' ' + defaultParams.course_node_id].dialogue = {};
                        newDialogueList[' ' + data.dialogue_node_id] = newDialogue[' ' + $.trim(data.dialogue_node_id)];
                        courseList[' ' + defaultParams.course_node_id].dialogue = newDialogueList;
                    } else {
                        if (Object.keys(dialoguesList).length) {

                            newDialogueList[' ' + data.dialogue_node_id] = newDialogue[' ' + $.trim(data.dialogue_node_id)];
                            Object.keys(courseList[' ' + defaultParams.course_node_id].dialogue).map(function (index) {
                                newDialogueList[index] = courseList[' ' + defaultParams.course_node_id].dialogue[index];
                            });
                            courseList[' ' + defaultParams.course_node_id].dialogue = newDialogueList;
                        }
                    }
                    if (action.value.additionalParams && action.value.additionalParams.currentChatDialogueDetail) {
                        let currentChatDialogueDetail = $.extend({}, state.currentChatDialogueDetail, action.value.additionalParams.currentChatDialogueDetail);
                        newState['currentChatDialogueDetail'] = currentChatDialogueDetail;
                    }

                    newState['courseList'] = courseList;
                    return newState;
                }
                return state;
            }
            if (state.view_type == 'bydialogue') {
                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }

                let date = responseArr['new_course'][' ' + $.trim(defaultParams.course_node_id)].dialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.date;

                let byDialogueJSON = {
                    dialogue: data.dialogue_title,
                    dialogue_node_id: data.dialogue_node_id,
                    dialogue_instance_id: 0,
                    course_node_id: data.course_node_id,
                    course_instance_id: 0,
                    course: data.course_title,
                    actors: newDialogue[' ' + $.trim(data.dialogue_node_id)].users,
                    notification: [],
                    events: [],
                    resources: [],
                    production: [],
                    date: date,
                };
                if (courseList[' ' + $.trim(data.dialogue_node_id)]) { // if dialogue already exists then update actors only
                    courseList[' ' + $.trim(data.dialogue_node_id)].actors = byDialogueJSON.actors;
                    newState.courseList = courseList;
                    return newState;
                } else {
                    let newDialogueList = {};
                    newDialogueList[' ' + $.trim(data.dialogue_node_id)] = byDialogueJSON;
                    if (courseList.status == 0) { // if there is no course in the list then
                        newState.courseList = {};
                        newState.courseList = newDialogueList;
                        return newState;
                    } else {
                        Object.keys(courseList).map(function (key) {
                            let list = courseList[key];
                            newDialogueList[key] = list;
                        });
                        newState.courseList = newDialogueList;
                        return newState;
                    }
                }
                return state;

            }
            if (state.view_type == 'byactor') {

                courseList = state.courseList;
                if (typeof courseList == 'string') {
                    courseList = JSON.parse(courseList);
                } else {
                    courseList = JSON.parse(JSON.stringify(courseList));
                }
                if ($.isArray(courseList)) {
                    courseList = {};
                }
                let actors = newDialogue[' ' + $.trim(data.dialogue_node_id)].users;

                newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.dialogue = newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue.dialogue_title;
                let courseDetails = {};
                courseDetails = {
                    course: currentCourse.course,
                    course_node_id: currentCourse.course_node_id,
                    course_instance_id: '',
                    status: currentCourse.status,
                    course_created_by: currentCourse.created_by,
                    course_creation_date: currentCourse.date
                };
                newDialogue[' ' + $.trim(data.dialogue_node_id)] = newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue;
                newDialogue[' ' + $.trim(data.dialogue_node_id)].dialogue_created_by = newDialogue[' ' + $.trim(data.dialogue_node_id)].created_by;
                $.extend(newDialogue[' ' + $.trim(data.dialogue_node_id)], courseDetails);
                if (courseList.status == 0) {
                    courseList = {};
                }
                let isSort = 0;

                Object.keys(actors).map(function (key) {
                    let actor = actors[key];
                    if (courseList[' ' + actor.user_id]) {
                        let newDialogueList = {};
                        newDialogueList[' ' + data.dialogue_node_id] = newDialogue[' ' + $.trim(data.dialogue_node_id)];
                        Object.keys(courseList[' ' + actor.user_id].dialogue).map(function (index) {
                            newDialogueList[index] = courseList[' ' + actor.user_id].dialogue[index];
                        });
                        newDialogueList[' ' + $.trim(data.dialogue_node_id)].users = actors;
                        courseList[' ' + actor.user_id].dialogue = newDialogueList;
                    } else if (actor.user_id != setUserID) {
                        isSort = 1;
                        let byActorJSON = {
                            dialogue: newDialogue,
                            email_address: actor.email,
                            first_name: actor.first_name,
                            last_name: actor.last_name,
                            domain: responseArr['new_course'][' ' + defaultParams.course_node_id].domain,
                            title: 'Admin'
                        };
                        byActorJSON.dialogue[' ' + $.trim(data.dialogue_node_id)].users = actors;
                        courseList[' ' + actor.user_id] = byActorJSON;
                    }
                });
                // if new user added then sort the list
                if (isSort) {
                    let courseListKeys = Object.keys(courseList);
                    // Sort keys
                    courseListKeys.sort(function (a, b) {
                        let nameA = (courseList[a].first_name + ' ' + courseList[a].last_name).toUpperCase(); // ignore upper and lowercase
                        let nameB = (courseList[b].first_name + ' ' + courseList[b].last_name).toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    });
                    // Make new list and assign to old list
                    var newCourseList = {};
                    courseListKeys.map(function (index) {
                        newCourseList[index] = courseList[index];
                    });
                    courseList = newCourseList;

                }
                newState['courseList'] = courseList;
                return newState;
            }
        case 'SHOW_ADMIN_HEADER':
            newState = Object.assign({}, state);
            newState['showAdminHeader'] = action.value.showAdminHeader;
            return newState;
            break;
        case 'ADD_NEW_PRODUCTION':
            state.newProduction = {};
            newState = Object.assign({}, state);
            newProductionAdd = state.newProduction;
            if (newProductionAdd) {
                if (typeof newProductionAdd == 'string') {
                    newProductionAdd = JSON.parse(newProductionAdd);
                } else {
                    newProductionAdd = JSON.parse(JSON.stringify(newProductionAdd));
                }
            }
            else {
                newProductionAdd = {};
            }
            let getProductionAdd = action.value.courseID;

            //newState = Object.assign({}, state);
            newState['newProduction'] = getProductionAdd;
            return newState;
            break;
        case 'APPEND_PRODUCTION_LIST':
            newState = Object.assign({}, state);
            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            if ($.isArray(courseList)) {
                courseList = {};
            }
            let productionList = action.value.response;
            if (typeof productionList == 'string') {
                productionList = JSON.parse(productionList);
            }
            courseList[' ' + $.trim(action.value.course_node_id)].production = productionList;
            if (action.value.updateCurrentChatDialogueDetail) {
                if (!newState.currentChatDialogueDetail) {
                    newState.currentChatDialogueDetail = {};
                }
                newState.currentChatDialogueDetail.expand_course_node_id = action.value.course_node_id;

            }
            newState['courseList'] = courseList;
            return newState;
            break;
        case 'APPEND_PRODUCTION_DETAIL':
            newState = Object.assign({}, state);
            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            let getProductionDetail = action.value.response;
            if (typeof getProductionDetail == 'string') {
                getProductionDetail = JSON.parse(getProductionDetail);
            }
            courseList[' ' + $.trim(action.value.course_node_id)].productionDetail = getProductionDetail;
            newState['courseList'] = courseList;
            return newState;
            break;
        case 'UPDATE_PRODUCTION_COURSE':
            newState = Object.assign({}, state);
            courseList = state.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            } else {
                courseList = JSON.parse(JSON.stringify(courseList));
            }
            let getCourseDetail = action.value.data;
            if (typeof getCourseDetail == 'string') {
                getCourseDetail = JSON.parse(getCourseDetail);
            }
            courseList[' ' + $.trim(action.value.course_node_id)] = getCourseDetail;
            newState['courseList'] = courseList;
            return newState;
            break;
        case 'APPEND_PRODUCTION_START':
            state.productionStart = {};
            newState = Object.assign({}, state);
            newProductionStart = state.productionStart;
            if (typeof newProductionStart == 'string') {
                newProductionStart = JSON.parse(newProductionStart);
            } else {
                newProductionStart = JSON.parse(JSON.stringify(newProductionStart));
            }
            let getProductionStart = action.value.response;
            if (typeof getProductionStart == 'string') {
                getProductionStart = JSON.parse(getProductionStart);
            }
            newProductionStart = getProductionStart;
            newState['productionStart'] = newProductionStart;
            return newState;
            break;
        case 'APPEND_PRODUCTION_INSTANCE':
            if (!state.productionInstance) {
                state.productionInstance = {};
            }
            newState = Object.assign({}, state);
            newProductionInstance = state.productionInstance;
            if (newProductionInstance) {
                if (typeof newProductionInstance == 'string') {
                    newProductionInstance = JSON.parse(newProductionInstance);
                } else {
                    newProductionInstance = JSON.parse(JSON.stringify(newProductionInstance));
                }
            }
            else {
                newProductionInstance = {};
            }
            let getProductionInstance = action.value.response;
            let getProductionID = action.value.productionID;
            if (typeof getProductionInstance == 'string') {
                getProductionInstance = JSON.parse(getProductionInstance);
            }
            else {
                getProductionInstance = JSON.parse(JSON.stringify(getProductionInstance));
            }
            newProductionInstance[getProductionID] = getProductionInstance;
            newState['productionInstance'] = newProductionInstance;
            return newState;
            break;
        case 'UPDATE_COURSE_LIST':
            newState = Object.assign({}, state);
            newState['courseList'] = action.value.response;

            if (action.value.updateCurrentChatDialogueDetail) {
                newState.currentChatDialogueDetail = {
                    expand_course_node_id: action.value.course_node_id,
                    expand_dialogue_node_id: action.value.dialogue_node_id,
                    course_node_id: action.value.course_node_id,
                    dialogue_node_id: action.value.dialogue_node_id,
                    dialogue_status: action.value.dialogue_status,
                }
                newState.changeChatView = action.value.change_chat_view;

                if (action.value.clear_chat_items) {
                    newState.chatItems = {};
                }

                action.value.course_node_id = ' ' + action.value.course_node_id;
                newState.view_type = 'bycourse';

            } else if (action.value.updateProduction) {
                newState.currentChatDialogueDetail = {
                    expand_course_node_id: action.value.course_node_id,
                    course_node_id: action.value.course_node_id
                }
                newState.changeChatView = 0;
                newState.view_type = 'bycourse';
            }
            else {
                newState['changeChatView'] = 0;
                newState['currentChatDialogueDetail'] = {};
            }

            return newState;
            break;
        case 'UPDATE_CHAT_TEXT':
            newState = Object.assign({}, state);

            if (typeof state.courseList == 'string') {
                state.courseList = JSON.parse(state.courseList);
            } else {
                state.courseList = JSON.parse(JSON.stringify(state.courseList));
            }
            courseList = state.courseList;
            let currentChatDialogueDetail = state.currentChatDialogueDetail;
            if (currentChatDialogueDetail && currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
                if (state.view_type == 'bycourse') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.chat_text = action.value.chatText;
                }
                if (state.view_type == 'bydialogue') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].chat_text = action.value.chatText;
                }

                if (state.view_type == 'byactor') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].chat_text = action.value.chatText;
                }

            }
            newState['courseList'] = courseList;
            break;
        case 'UPDATE_LETTER_TEXT':
            newState = Object.assign({}, state);

            if (typeof state.courseList == 'string') {
                state.courseList = JSON.parse(state.courseList);
            } else {
                state.courseList = JSON.parse(JSON.stringify(state.courseList));
            }
            courseList = state.courseList;
            var currentChatDialogueDetail = state.currentChatDialogueDetail;
            if (currentChatDialogueDetail && currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
                if (state.view_type == 'bycourse') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].dialogue.letter_text = action.value.letterText;
                }
                if (state.view_type == 'bydialogue') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].letter_text = action.value.letterText;
                }

                if (state.view_type == 'byactor') {
                    courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)].letter_text = action.value.letterText;
                }
            }
            newState['courseList'] = courseList;
            break;
        case 'ACTIVE_MP_APP':
            newState = Object.assign({}, state);
            newState = MarketPlaceObject(newState).toggleActiveApp(action.value.active_app).getState();
            return newState;
            break;
        case 'SUBSCRIBE_APP':
            newState = Object.assign({}, state);
            newState = MarketPlaceObject(newState).subscribeApp(action.value.app_id).getState();
            return newState;
            break;
        case 'SHOW_SUBSCRIBED_APP':
            newState = Object.assign({}, state);
            newState.show_subscribed_app = action.value.show_subscribed_app;
            return newState;
            break;
        case 'MANAGE_HEADER_NOTIFICATION':
            newState = Object.assign({}, state);
            if (typeof state.header_notification == 'string') {
                state.header_notification = JSON.parse(state.header_notification);
            } else {
                state.header_notification = JSON.parse(JSON.stringify(state.header_notification));
            }
            let headerNotification = {};
            let position = action.value.position;
            let value = {};


            if (position == 'bottom') {
                let loadMore = 0;
                headerNotification = state.header_notification;
                value = action.value.notification;
                // FLASH_NOTIFICATION_COUNT difine as a const by php in header.phtml
                const FLASH_NOTIFICATION_COUNT = 10;
                if (Object.keys(action.value.notification).length > FLASH_NOTIFICATION_COUNT) {
                    loadMore = 1;
                    let key = Object.keys(action.value.notification)[(Object.keys(action.value.notification).length) - 1];
                    delete value[key];
                }
                newState.loadMore = loadMore;
            }

            if (position == 'top') {
                headerNotification = action.value.notification;
                value = state.header_notification;
                /*if (Object.keys(state.header_notification).length && !action.value.updateList) {
                    newState.notification_socket_count += action.value.notificationCount;
                }

                if (!Object.keys(state.header_notification).length && !action.value.updateList) {
                    newState.header_notification_count += action.value.notificationCount;
                    return newState;
                }*/
            }


            Object.keys(value).map((index) => {
                headerNotification[index] = value[index];
            });
            //newState.loadMore = loadMore;
            newState.header_notification = headerNotification;
            //newState.header_notification_count += action.value.notificationCount;
            return newState;
            break;
        case 'MANAGE_HEADER_NOTIFICATION_COUNT' :
            newState = Object.assign({}, state);
            if (typeof state.header_notification == 'string') {
                state.header_notification = JSON.parse(state.header_notification);
            } else {
                state.header_notification = JSON.parse(JSON.stringify(state.header_notification));
            }

            if (action.value.status && action.value.status == 'resetNotificationCount') {
                newState.header_notification_count = 0;
                return newState;
            }
            newState.header_notification_count += action.value.notificationCount;
            return newState;
            break;
        case 'CHANGE_PAGE_NAME':
            newState = Object.assign({}, state);
            newState.page_name = action.value.page_name;
            let menuList = state.menu_list;
            if (typeof menuList == 'string') {
                menuList = JSON.parse(menuList);
            }
            Object.keys(menuList).map(function (index) {
                let menu = menuList[index];
                if (menu.is_display && $.trim(action.value.page_name.toLowerCase()) == $.trim(menu.menu_title.toLowerCase())) {
                    newState.page_id = menu.menu_id;
                }
            });
            if (action.value.currentChatDialogueDetail) {
                newState.currentChatDialogueDetail = action.value.currentChatDialogueDetail;
            }
            if ('changeChatView' in action.value) {
                newState.changeChatView = action.value.changeChatView;
            }
            // get menu id of selected menu
            // console.log(state.menu_list);
            return newState;
            break;
        case 'EXPAND_LIST_VIEW' :
            newState = Object.assign({}, state);
            if (typeof state.currentChatDialogueDetail == 'string') {
                state.currentChatDialogueDetail = JSON.parse(state.currentChatDialogueDetail);
            } else {
                state.currentChatDialogueDetail = JSON.parse(JSON.stringify(state.currentChatDialogueDetail));
            }
            newState.currentChatDialogueDetail = {
                expand_course_node_id: action.value.expand_course_node_id,
                expand_dialogue_node_id: action.value.expand_dialogue_node_id,
                course_node_id: action.value.expand_course_node_id,
                dialogue_node_id: action.value.expand_dialogue_node_id
            };
            return newState;
            break;
        case 'UPDATE_NOTIFICATION_STATUS' :
            newState = Object.assign({}, state);
            if (typeof state.header_notification == 'string') {
                state.header_notification = JSON.parse(state.header_notification);
            } else {
                state.header_notification = JSON.parse(JSON.stringify(state.header_notification));
            }
            let nodeIds = action.value.nodtification_node_id;
            if ($.isArray(nodeIds)) {
                nodeIds.map((index) => {
                    newState.header_notification[' ' + $.trim(index)].unread_status = action.value.status;
                })
            } else {
                if (newState.header_notification[' ' + $.trim(nodeIds)]) {
                    newState.header_notification[' ' + $.trim(nodeIds)].unread_status = action.value.status;
                }
            }

            return newState;
            break;
        case 'APPEND_COURSE_LIST':
            newState = Object.assign({}, state);
            newState.courseList = action.value.course_list;
            newState.view_type = action.value.view_type;

            if (typeof newState.menu_list == 'string') {
                newState.menu_list = JSON.parse(newState.menu_list);
            }
            if('changeChatView' in action.value) {
                newState.changeChatView = action.value['changeChatView'];
            }
            newState.menu_list[' 48'].ai_class = newState.menu_list[' ' + $.trim(newState.page_id)].ai_class.replace('inactive', '');

            if (typeof action.value.subscribed_apps != 'undefined') {
                if (typeof newState.app_list == 'string') {
                    newState.app_list = JSON.parse(newState.app_list);
                }
                for (var i = 0; i < action.value.subscribed_apps.length; i++) {
                    newState.app_list[action.value.subscribed_apps[i]].is_subscribed = 1;
                }
                newState.is_user_logged_id = 1;
            }

            return newState;
            break;
        case 'START_NEW_PRODUCTION_COURSE':
            state.newProductionCourse = {};
            newState = Object.assign({}, state);
            prevNewProductionCourse = state.newProductionCourse;
            if (typeof prevNewProductionCourse == 'string') {
                prevNewProductionCourse = JSON.parse(prevNewProductionCourse);
            } else {
                prevNewProductionCourse = JSON.parse(JSON.stringify(prevNewProductionCourse));
            }
            let getnewProductionCourse = action.value;
            if (typeof getnewProductionCourse == 'string') {
                getnewProductionCourse = JSON.parse(getnewProductionCourse);
            }
            prevNewProductionCourse = getnewProductionCourse;
            newState['newProductionCourse'] = prevNewProductionCourse;
            return newState;
            break;
        case 'ACTIVE_FILTER':
            newState = Object.assign({}, state);
            newState.activeFilter = action.value;
            return newState;
            break;
        case 'LOGIN_USER':
            newState = Object.assign({}, state);
            var menuList = state.menu_list;
            var activateAfterLogin = ['Dashboard', 'Products', 'Data'];
            // newState.is_user_logged_in = action.value.is_user_logged_in;
            if (action.value.is_user_logged_in) {
                if (state.user_type != 'guest') {
                    if (typeof menuList == 'string') {
                        menuList = JSON.parse(menuList);
                    } else {
                        menuList = JSON.parse(JSON.stringify(menuList));
                    }
                    Object.keys(menuList).map(function (key) {
                        let menu = menuList[key];
                        if (activateAfterLogin.indexOf(menu.menu_title) != -1) {
                            menuList[key].ai_class = '';
                        }
                    });
                    newState.menu_list = menuList;
                }

                newState.is_user_logged_in = action.value.is_user_logged_in;
                if (typeof state.courseList == 'string') {
                    state.courseList = JSON.parse(state.courseList);
                }
                courseList = Object.assign({}, state.courseList);
                let newList = {};
                let gustUserDetails = action.value.user_details;
                Object.keys(courseList).map(index => {
                    newList[index] = courseList[index];
                    Object.keys(newList[index].dialogue).map(dialogueId => {
                        let dialogue = newList[index].dialogue[dialogueId];
                        Object.keys(dialogue.users).map(userId => {
                            if ($.trim(userId) == $.trim(gustUserDetails.node_id)) {
                                dialogue.users[userId]['first_name'] = gustUserDetails.first_name;
                                dialogue.users[userId]['last_name'] = gustUserDetails.last_name;
                                dialogue.users[userId]['profile_image'] = gustUserDetails.profile_image;
                                dialogue.users[userId]['user_id'] = gustUserDetails.node_id;
                                dialogue.users[userId]['email'] = gustUserDetails.email_address;
                            }
                        })
                    })
                })
                newState.courseList = newList;

            }
            if (action.value.user_type) {
                newState.user_type = action.value.user_type;
            }
            return newState;
            break;

        case 'UPDATE_GROUP_LIST':
            newState = Object.assign({}, state);
            newState.groupList = action.value.groups;
            if (!action.value.updateList) {
                newState.groupFormFields = action.value.formArray;
            } else {
                delete newState.groupForm;
            }

            newState.currentGroup = {
                group_node_id: Object.keys(action.value.groups)[0],
            }
            return newState;
            break;
        case 'GROUP_FORM':
            newState = Object.assign({}, state);
            newState.groupForm = action.value;
            return newState;
            break;
        case 'ROLES_LIST':
            newState = Object.assign({}, state);
            var newRolesList = action.value
            if (!newState.rolesList) {
                newState.rolesList = {};
            } else {
                Object.keys(newState.rolesList).map(index => {
                    newRolesList[index] = newState.rolesList[index];
                });
            }
            newState.rolesList = newRolesList;
            return newState;
            break;
        case 'ADD_ROLE_LIST':
            newState = Object.assign({}, state);
            let newAddRoleList = action.value
            if (!newState.addRoleList) {
                newState.addRoleList = {};
            } else {
                Object.keys(newState.addRoleList).map(index => {
                    newAddRoleList[index] = newState.addRoleList[index];
                });

            }
            newState.addRoleList = newAddRoleList;
            return newState;
            break;
        case 'REMOVE_ADDED_ROLE':
            newState = Object.assign({}, state);
            if (newState.addRoleList) {
                delete newState.addRoleList[action.value];
            }
            return newState;
            break;

        case 'ACTORS_LIST':
            newState = Object.assign({}, state);
            var newActorsList = action.value
            if (!newState.actorsList) {
                newState.actorsList = {};
            } else {
                Object.keys(newState.actorsList).map(index => {
                    newActorsList[index] = newState.actorsList[index];
                });
            }
            newState.actorsList = newActorsList;
            return newState;
            break;
        case 'UPDATE_GROUP_ACTOR_LIST':
            newState = Object.assign({}, state);
            if (!newState.currentGroup) {
                return newState;
            }

            if (typeof state.groupList == 'string') {
                state.groupList = JSON.parse(state.groupList);
            } else {
                state.groupList = JSON.parse(JSON.stringify(state.groupList));
            }
            var newGroupList = {};

            Object.keys(state.groupList).map(index => {
                newGroupList[index] = state.groupList[index];
                if (index == newState.currentGroup['group_node_id']) {
                    let newActorList = action.value;
                    Object.keys(newGroupList[index]['actors']).map(key => {
                        newActorList[key] = newGroupList[index]['actors'][key];
                    });
                    newGroupList[index]['actors'] = newActorList;
                }
            });
            newState.groupList = newGroupList;
            return newState;
            break;
        case 'LOGIN_USER':
            newState = Object.assign({}, state);
            // newState.is_user_logged_in = action.value.is_user_logged_in;
            if (action.value.is_user_logged_in) {
                newState.is_user_logged_in = action.value.is_user_logged_in;
                if (typeof state.courseList == 'string') {
                    state.courseList = JSON.parse(state.courseList);
                }
                courseList = Object.assign({}, state.courseList);
                let newList = {};
                let gustUserDetails = action.value.user_details;
                Object.keys(courseList).map(index => {
                    newList[index] = courseList[index];
                    Object.keys(newList[index].dialogue).map(dialogueId => {
                        let dialogue = newList[index].dialogue[dialogueId];
                        Object.keys(dialogue.users).map(userId => {
                            if ($.trim(userId) == $.trim(gustUserDetails.node_id)) {
                                dialogue.users[userId]['first_name'] = gustUserDetails.first_name;
                                dialogue.users[userId]['last_name'] = gustUserDetails.last_name;
                                dialogue.users[userId]['profile_image'] = gustUserDetails.profile_image;
                                dialogue.users[userId]['user_id'] = gustUserDetails.node_id;
                                dialogue.users[userId]['email'] = gustUserDetails.email_address;
                            }
                        })
                    })
                })
                newState.courseList = newList;

            }
            if (action.value.user_type) {
                newState.user_type = action.value.user_type;
            }
            return newState;
            break;
        case 'UPDATE_GROUP_ROLE_LIST':
            newState = Object.assign({}, state);
            if (!newState.currentGroup) {
                return newState;
            }

            if (typeof state.groupList == 'string') {
                state.groupList = JSON.parse(state.groupList);
            } else {
                state.groupList = JSON.parse(JSON.stringify(state.groupList));
            }
            var newGroupList = {};

            Object.keys(state.groupList).map(index => {
                newGroupList[index] = state.groupList[index];
                if (index == newState.currentGroup['group_node_id']) {
                    let newRoleList = action.value;
                    Object.keys(newGroupList[index]['roles']).map(key => {
                        newRoleList[key] = newGroupList[index]['roles'][key];
                    });
                    newGroupList[index]['roles'] = newRoleList;
                }
            });
            newState.groupList = newGroupList;
            return newState;
            break;
        case 'REMOVE_ROLE_FROM_GROUP':
            newState = Object.assign({}, state);
            if (!newState.currentGroup) {
                return newState;
            }

            if (typeof state.groupList == 'string') {
                state.groupList = JSON.parse(state.groupList);
            } else {
                state.groupList = JSON.parse(JSON.stringify(state.groupList));
            }
            var newGroupList = {};

            Object.keys(state.groupList).map(index => {
                newGroupList[index] = state.groupList[index];
                if (index == action.value.group_node_id) {
                    delete newGroupList[action.value.group_node_id]['roles'][action.value.role_id];
                }
            });
            newState.groupList = newGroupList;
            return newState;
            break;
        case 'REMOVE_ACTOR_FROM_GROUP':
            newState = Object.assign({}, state);
            if (!newState.currentGroup) {
                return newState;
            }

            if (typeof state.groupList == 'string') {
                state.groupList = JSON.parse(state.groupList);
            } else {
                state.groupList = JSON.parse(JSON.stringify(state.groupList));
            }
            var newGroupList = {};

            Object.keys(state.groupList).map(index => {
                newGroupList[index] = state.groupList[index];
                if (index == action.value.group_node_id) {
                    delete newGroupList[action.value.group_node_id]['actors'][action.value.actor_id];
                }
            });
            newState.groupList = newGroupList;
            return newState;
            break;
        case 'ACTORS_APP':
            newState = Object.assign({}, state);
            if (!newState.currentGroup) {
                return newState;
            }

            if (typeof state.groupList == 'string') {
                state.groupList = JSON.parse(state.groupList);
            } else {
                state.groupList = JSON.parse(JSON.stringify(state.groupList));
            }
            var newGroupList = {};

            Object.keys(state.groupList).map(index => {
                newGroupList[index] = state.groupList[index];
                let oldAppList = newGroupList[action.value.group_node_id]['actors'][action.value.actor_id].app_ids;
                if (index == action.value.group_node_id) {

                    if (action.value.action == 'remove') {
                        delete newGroupList[action.value.group_node_id]['actors'][action.value.actor_id].app_ids[action.value.actorApp];
                    }
                    if (action.value.action == 'add') {
                        let newAppList = action.value.actorApp
                        Object.keys(oldAppList).map(id => {
                            newAppList[id] = oldAppList[id];
                        })
                        newGroupList[action.value.group_node_id]['actors'][action.value.actor_id].app_ids = newAppList;
                    }
                }
            });
            newState.groupList = newGroupList;
            return newState;
            break;
        case 'UPDATE_VIEW_TYPE':
            newState = Object.assign({}, state);
            newState.view_type = action.value.view_type;
            return newState;
            break;
        case 'UPDATE_SEARCH_STRING':
            newState = Object.assign({}, state);
            newState.searchString = action.value;
            return newState;
            break;
        default:
            return state;
            break;
    }
    return state;
}
export default ChatReducer;
