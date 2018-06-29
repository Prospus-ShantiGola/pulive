import React from 'react';
/**
 * Created by prem.prakash on 6/19/2017.
 */

export function modifyChatListForSystemGeneratedMessages(response) {

    var list = JSON.parse(JSON.stringify(response));
    if($.isArray(list.chatItems)){
        list.chatItems = {};
    }
    if(list.chatType.toLowerCase() == 'letter') { // From PHP end, system generated messages are not shown for letter mode
        return list;
    }
    if(list.chatItems) {
        var collectionIndex = 0, anotherCollectionIndex = 0;
        var newCollection = {};
        for(var key1 in list.chatItems) {
            var temp1 = list.chatItems[key1];
            newCollection[key1] = {};
            for(var key2 in temp1) {
                var temp2 = temp1[key2];
                if(temp2.statement) {
                    var counter = 0;
                    for(var key3 in temp2.statement) {
                        var previous_index;
                		var allKeys = Object.keys(list.chatItems[key1][key2].statement);
                		previous_index = allKeys[counter - 1];
                		counter++;
                        var previous_statement_type = '';
                        if(list.chatItems[key1][key2].statement[previous_index]) {
                            previous_statement_type = list.chatItems[key1][key2].statement[previous_index].statement_type.toLowerCase();
                        }
                        var temp3 = temp2.statement[key3];

                        if(typeof temp3 == 'object') {
                            var appendWithExistingStatement = false;
                            if(
                                (previous_statement_type == 'statement' && temp3.statement_type.toLowerCase() == 'statement') ||
                                (previous_statement_type == 'image' && temp3.statement_type.toLowerCase() == 'image') ||
                                (previous_statement_type == 'statement' && temp3.statement_type.toLowerCase() == 'image') ||
                                (previous_statement_type == 'image' && temp3.statement_type.toLowerCase() == 'statement')
                            ) {
                                appendWithExistingStatement = true;
                            }

                            if (temp3.statement_type.toLowerCase() == 'system message') {
                                newCollection[key1][collectionIndex] = JSON.parse(JSON.stringify(temp2));
                                newCollection[key1][collectionIndex].statement = {};
                                newCollection[key1][collectionIndex].statement[collectionIndex] = JSON.parse(JSON.stringify(temp3));
                                newCollection[key1][collectionIndex].has_system_message = 1;
                            } else {
                                if (appendWithExistingStatement) {
                                    var keys = Object.keys(newCollection[key1]);
                                    var innerKey1 = parseInt(keys[keys.length - 1]);
                                    newCollection[key1][innerKey1].statement[key3] = list.chatItems[key1][key2].statement[key3];
                                } else {
                                    newCollection[key1][collectionIndex] = JSON.parse(JSON.stringify(temp2));
                                    newCollection[key1][collectionIndex].statement = {};
                                    newCollection[key1][collectionIndex].statement[temp3.node_instance_propertyid] = JSON.parse(JSON.stringify(temp3));
                                }
                            }
                            collectionIndex++;
                        }
                    }
                }
            }
        }
        list.chatItems = newCollection;
        return list;
    }
    return list;
}

function mapStatementAgainstStatementId(chatType, statementId, chatItems) {
    let result = {};

    if(chatType.toLowerCase() == 'chat') {
        for(var keyName1 in chatItems) {
            let items = chatItems[keyName1];
            for(var keyName2 in items) {
                let statements = items[keyName2].statement;
                if(statements && statements[statementId]) {
                    result.list = statements[statementId].statement;
                    result.nodeStatusType = statements[statementId].node_statusType;
                    break;
                }
            }
            if(result.list) {
                break;
            }
        }

    } else {
        for(var keyName1 in chatItems) {
            let items = chatItems[keyName1];
            for(var keyName2 in items) {
                if(typeof items[keyName2] != 'function' && items[keyName2]) {
                    let statements = items[keyName2].instance.statement;
                    if(statements && items[keyName2]['blank_stmt_node_id'] == statementId) {
                        var list = Object.keys(statements).map(function(key, index) {
                            let item = statements[key];
                            return statements[key].statement;
                        })
                        result.list = list.join(' ');
                        result.nodeStatusType = items[keyName2].instance.node_statusType;
                        break;
                    }
                }
            }
            if(result.list) {
                break;
            }
        }
    }
    return result;
}

export function getStatementDetailById(chatType, statementId, chatItems) {
    return mapStatementAgainstStatementId(chatType, statementId, chatItems);
}
export function setStatementDetailById(chatType, statementId, chatItems, statementDetails) {
    let hasFound = false;
    if(chatType.toLowerCase() == 'chat') {
        if(chatItems) {
            for(var keyName1 in chatItems) {
                let items = chatItems[keyName1];
                for(var keyName2 in items) {
                    let statements = items[keyName2].statement;
                    if(statements && statements[statementId]) {
                        $.extend(statements[statementId], statementDetails);
                        hasFound = true;
                        break;
                    }
                }
                if(hasFound) {
                    break;
                }
            }
        }
    } else {
        for(var keyName1 in chatItems) {
            let items = chatItems[keyName1];
            for(var keyName2 in items) {
                if(typeof items[keyName2] != 'function' && items[keyName2]) {
                    let statements = items[keyName2].instance.statement;
                    if(statements && items[keyName2]['blank_stmt_node_id'] == statementId) {
                        $.extend(items[keyName2].instance, statementDetails);
                        items[keyName2].update_status = statementDetails.update_status;
                        hasFound = true;
                        break;
                    }
                }
            }
            if(hasFound) {
                break;
            }
        }
    }
}
export function getCurrentDialogue(view_type, courseList, currentChatDialogueDetail) {
    if(typeof courseList == 'string') {
        courseList = JSON.parse(courseList);
    }
    if(view_type == 'bycourse') {
        return courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)];
    }
    if(view_type == 'bydialogue') {
        return courseList[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)];
    }
    if(view_type == 'byactor') {
        return courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].dialogue[' ' + $.trim(currentChatDialogueDetail.dialogue_node_id)];
    }

}
export function getUpdatedDialogueDetail(view_type, courseList, currentChatDialogueDetail) {
    let dialogueDetailNew = {};
    let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
    let users = currentDialogue.users;
    if(view_type == 'bydialogue') {
        users = currentDialogue.actors;
    } else if(view_type == 'bycourse') {
        currentDialogue = currentDialogue.dialogue;
    }
    dialogueDetailNew.user_instance_node_id = window.setUserID;
    dialogueDetailNew.user_id = Object.keys(users).join(',');
    dialogueDetailNew.dialogue_instance_node_id = currentDialogue.dialogue_node_id;
    dialogueDetailNew.course_node_id = currentDialogue.course_node_id;
    dialogueDetailNew.course_title = currentDialogue.course;
    dialogueDetailNew.dialogue_title = currentDialogue.dialogue_title;
    dialogueDetailNew.dialogueStatus = currentDialogue.dialogueStatus;

    return dialogueDetailNew;
}
export function hasLoggedInUserRemoved(view_type, courseList, currentChatDialogueDetail) {

    let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);

    if(view_type == 'bycourse') {
        if (currentDialogue.removed_users && currentDialogue.removed_users[window.setUserID]) {
            return true;
        }
    } else if(view_type == 'bydialogue') {
        if (currentDialogue.actors) {
            if(currentDialogue.actors[window.setUserID]) {
                return currentDialogue.actors[window.setUserID].has_removed;
            }
            return true; // if user id is not available then user has been removed.
        }
    } else if(view_type == 'byactor') {
        if(currentDialogue.users) {
            if(currentDialogue.users[window.setUserID]) {
                return currentDialogue.users[window.setUserID].has_removed;
            }
            return true; // if user id is not available then user has been removed.
        }
    }
    return false;
}

export function getCount(count = 0,class_name,brackets = 0) {
    if (count == 0) {
        return '';
    }
    if(brackets){
        return '<span class='+ class_name +'>' + '(' + count + ')' + '</span>';
    }
    return '<span class='+ class_name +'>' + count + '</span>';

}
export function getStrWithDot(str = ''){
    let strLength = COURSE_DIALOGUE_TITLE_LENGTH;
    return (str == '') ? null : (str.length > strLength ) ? addThreeDot(removeCommaOrFullstop(str.substr(0, (strLength - 3)))) : str;
}

function removeCommaOrFullstop(str = ''){
    if(str == '' || str == null){
        return null;
    }
    return str.replace(/([a-z]+)[.,]/ig, '$1');
}

function addThreeDot(str = ''){
    if(str == '' || str == null){
        return null;
    }
    return str + '...';
}

export function subscribeApplication(app, callback, redirect_callback) {
    NProgress.start({position: 'full'});
    let data = {
        user_id: window.setUserID,
        production_id: app.production_id,
        price: app.price,
        role: app.role,
        organization: app.organization
    };
    $.ajax({
        url: domainUrl+'store/subscription',
        type: 'POST',
        data: data,
        success: function(response) {
            if (typeof response == 'string') {
                response = $.parseJSON(response);
            }
            if(typeof callback == 'function' && response.status && !('group' in response)) {
                callback(app);
            }
            showRedirectPopup(response, redirect_callback, callback, app);
        }
    });
}
export function showRedirectPopup(response, redirect_callback, callback, app) {
    window.selected_app = undefined;
    NProgress.done();
    if (typeof response == 'string') {
        response = $.parseJSON(response);
    }
    if(response.status) {
        let message = 'Subscribed successfully, Do you want to go to Inbox?';
        if('group' in response) {
            // message = response.group_msg;
            let wrapper = $('<div />').addClass('app-list-wrapper');
            let checkbox_element = $('<span />').addClass('checkbox').append($('<input type="radio" name="subscribe_for" checked="checked" id="yourself"/>'));
            let title_element = $('<label />').attr({for: 'yourself'}).addClass('group-title-').text('Yourself');

            let ul = $('<ul />');
            let li = $('<li />');

            li.append(checkbox_element);
            li.append(title_element);
            ul.append(li);
            wrapper.append($('<div />').addClass('app-list-inner-wrapper first').append(ul));

            ul = $('<ul />');

            let inner_wrapper = $('<div />').append($('<h6 />').append($('<span />').text('Group'))).addClass('app-list-inner-wrapper');
            Object.keys(response.group).map(function(key) {
                var group_item = response.group[key];

                checkbox_element = $('<span />').addClass('checkbox').append($('<input type="radio" name="subscribe_for" value="' +group_item.id+ '" id="_' +group_item.id+ '"/>'));
                title_element = $('<label />').attr({for: '_'+group_item.id}).addClass('group-title-').text(group_item.title);

                li = $('<li />').append(checkbox_element).append(title_element);
                ul.append(li);
                inner_wrapper.append(ul);

                wrapper.append(inner_wrapper);
            });
            let popup = $("#subscribe-group-popup");
            popup.find('.app-list-wrapper').remove();
            popup.find('.modal-body').append(wrapper);
            popup.modal('show');
            popup.find('.subscribe-group-js').off('click').on('click', function() {
                response.user_id = window.setUserID;
                let group_id = $('input[name="subscribe_for"]:checked').val();
                if(group_id.toLowerCase() != 'on') {
                    response.group_id = group_id;
                }
                $.ajax({
                    type: 'post',
                    url: domainUrl + response.action,
                    data: response,
                    success: function(response) {
                        if(typeof callback == 'function') {
                            callback(app);
                        }
                        console.log(response);
                    }
                });
                popup.find(".close").trigger("click");
            });
        } else {
            bootbox.confirm({
                title: 'Confirm',
                message: 'Subscribed successfully, Do you want to go to Inbox?',
                callback: function(state) {
                    if(state) {
                        if(typeof redirect_callback == 'function') {
                            redirect_callback();
                        }
                    }
                }
            });
        }
    }
}
export function addCollapseEvent(params, props) {

    var collapseElements = $('#course-dialogue,#course-default');
    collapseElements.off('shown.bs.collapse');
    collapseElements.off('hidden.bs.collapse');

    collapseElements.on('shown.bs.collapse', function() {
        // manageDialogueHT();
        calculateFullDialogueChatHeight();
        if($(this).attr('id') == 'course-dialogue' && fireCallback(props)) {
            params.on_show();
        }
    }).on('hidden.bs.collapse', function() {
        // manageDialogueHT();
        calculateFullDialogueChatHeight();
        if($(this).attr('id') == 'course-dialogue' && fireCallback(props)) {
            params.on_hide();
        }
    });
}

function fireCallback(props) {
    if(props.currentChatDialogueDetail &&
        (props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue')) {
        return false;
    }
    return true;
}
export function highlightActionMenuAccordingly(dataOriginalTitle) {
    highlightMenuAccordingly($('.shortcut-icon'),dataOriginalTitle);
    highlightMenuAccordingly($('div#nav-accordion'),dataOriginalTitle);
}

function highlightMenuAccordingly(actionMenuWrapper,dataOriginalTitle) {
    var actionMenu = actionMenuWrapper.find('a[data-menu-name="' +dataOriginalTitle+ '"]');
    var activeMenuClass = 'active';
    actionMenu.closest('ul').find('li').removeClass(activeMenuClass);
    actionMenu.closest('li').addClass(activeMenuClass);
}

export function inactiveActionMenuAccordingly(dataOriginalTitle) {
    inactiveMenuAccordingly($('.shortcut-icon'),dataOriginalTitle);
    inactiveMenuAccordingly($('div#nav-accordion'),dataOriginalTitle);
}

function inactiveMenuAccordingly(actionMenuWrapper,dataOriginalTitle){
    var actionMenu = actionMenuWrapper.find('a[data-menu-name="' +dataOriginalTitle+ '"]');
    actionMenu.closest('li').addClass('inactive');
}



export function isUserLoggedIn() {
    return (typeof window.setUserID == 'undefined' || window.setUserID == '') ? false: true;
}

export function getRedirectLink(page_name) {
    let routes = {
        inbox: 'inbox',
        store: 'store',
        invalid: 'invalid'
    };
    let prefix = '/pu/';

    if(JS_ROUTE_PATH == 1) {
        prefix = '/dev/';
    } else if(JS_ROUTE_PATH == 2) {
        prefix = '/qa/';
    } else if(JS_ROUTE_PATH == 3) {
        prefix = '/sta/';
    }

    Object.keys(routes).map(function(index) {
        routes[index] = prefix + routes[index];
    });
    if(page_name) {
        return routes[page_name];
    }
    return routes;
}
export function addGuestUser(users, callback) {
    NProgress.start({position: 'full'});
    $.ajax({
        type: 'POST',
        url: domainUrl+"api/",
        data: {apiname:'addGuestUsers','guest_emails':users},
        success:function(response) {
            let users = response.data;
            if($('#prodRole').length==1){
                let individualAutoCompleteBox = $('#prodRole');
                individualAutoCompleteBox.find('.newUser').removeClass('newUser');
            }
            else{
                let individualAutoCompleteBox = $('#course-dialogue:visible');
                for(let key in users) {
                    individualAutoCompleteBox.find('input[data-useremail="' +key+ '"]').val(users[key]).removeAttr('data-isnewuser');
                }
            }
            callback();
        }
    });
}

export function getGuestUsers(callback) {
    let userOverviewWrap = $('#course-dialogue:visible');

    let guestUsers = [];
    userOverviewWrap.find('input[data-isnewuser="1"]').each(function() {
        guestUsers.push($(this).val());
    });
    if(guestUsers.length) {
        showGuestUserPopup(guestUsers, callback);
    }
    return guestUsers;
}
export function getGuestUsersProduction(callback) {
    let userOverviewWrap = $('#prodRole');

    let guestUsers = [];
    userOverviewWrap.find('.newUser').each(function() {
        guestUsers.push($(this).val());
    });
    if(guestUsers.length) {
        showGuestUserPopup(guestUsers, callback);
    }
    return guestUsers;
}
export function showGuestUserPopup(guestUsers, callback) {
    var message_prefix = guestUsers.join(', ');
    if(guestUsers.length > 1) {
        message_prefix += ' are';
    } else {
        message_prefix += ' is';
    }
    var confirmationMessage = message_prefix + ' not registered on Prospus. Send an invitation to join Prospus.';
    bootbox.confirm({
        title: 'Confirm',
        message: confirmationMessage,
        buttons: {
            confirm: {
                label: 'Send'
            }
        },
        callback: function(state) {
            if(state) {
                window.tempGuestUsers = guestUsers;
                addGuestUser(guestUsers, callback);
            }
        }
    });
}
export function sendInvitationToGuestUser(actor_list, course_detail) {
    NProgress.done();
    delete window.tempGuestUsers;
    return true;
    if(typeof window.tempGuestUsers != 'undefined' && Object.keys(window.tempGuestUsers)) {
        let toUserList = {};
        for(let key in actor_list) {
            if(window.tempGuestUsers.indexOf(actor_list[key].email) > -1) {
                toUserList[actor_list[key].actor_id] = {
                    email: actor_list[key].email,
                    actorID: actor_list[key].actor_id
                }
            }
        }
        if(Object.keys(toUserList)) {
            course_detail.toUserList = toUserList;
            course_detail.adminFirstName = window.firstName;
            course_detail.adminLastName = window.lastName;
            course_detail.adminEmail = window.session_file_name;
            $.ajax({
                type: 'POST',
                url: domainUrl+"api/",
                data: {apiname:'guestsMail','guestsMail':course_detail},
                success:function(response) {
                    console.log(response);
                }
            });
        }

    }
}

export function highlightSearch(elementObj,pat) {
    return elementObj.each(function () {
        innerHighlight(this, pat.toUpperCase());
    });
}

function innerHighlight(node, pat) {
    let self = this;
    var skip = 0;
    if (node.nodeType == 3) {
        var pos = node.data.toUpperCase().indexOf(pat);
        if (pos >= 0) {
            var spannode = document.createElement('span');
            spannode.className = 'highlight';
            var middlebit = node.splitText(pos);
            var endbit = middlebit.splitText(pat.length);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);
            skip = 1;
        }
    }
    else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
        for (var i = 0; i < node.childNodes.length; ++i) {
            i += innerHighlight(node.childNodes[i], pat);
        }
    }
    return skip;
}
export function showImageInPopupCommon(full_url, item) {
    let img = $('<div />').addClass('img-container').append($('<img />').addClass('img-responsive').attr({src: full_url, id: 'download_img'}));
    let anchor_url = domainUrlApi + 'api/downloadfile?filepath='+full_url.replace(domainUrlApi, '');
    let modalEle = $("#custom-modal");
    let modalBody = $('<div />').addClass('modal-body-container').append(img);

    let anchor = $('<a />').attr({
        href: anchor_url,
        id: "download_chat_img",
    }).append('<i class="icon-sm download-icon pointer"></i>');

    let menuContainer = $('<div />').addClass('modal-menu-container');
    let menus = $('<ul />');
    menus.append($('<li />').append(anchor));
    menus.append($('<li />').append('<i class="icon-sm tri-dot inactive"></i>'));
    menus.append($('<li />').append('<i data-dismiss="modal" class="icon-sm close-black pointer"></i>'));

    menuContainer.append(menus);
    modalBody.append(menuContainer);

    let heading = $('<h4 /> ').text(item.statement);

    modalEle.find('.modal-header-title').append(heading);

    modalEle.find('.modal-body').append(modalBody);
    modalEle.modal('show');

    modalEle.off('hidden.bs.modal').on('hidden.bs.modal', function() {
        $(this).find('.modal-header-icon').text('');
        $(this).find('.modal-header-title').text('');
        $(this).find("#download_img").remove();
    })
}
export function isUserAdmin(created_by) {
    if(created_by == window.setUserID) {
        return <i className='admin-icon'></i>
    }
}

export function sendImageOnSocket(_this, file, Response, callback) {
    window.is_file_upload_in_progress = true;
    var documentType = $.trim($('#dropLetterExists').text());
    var getThis = _this;
    let {currentChatDialogueDetail, courseList, view_type} = _this.props;
    var diaStatusTypeReact = _this.props.chat_app.state.dialougeDetail.dialogueStatus;
    if (diaStatusTypeReact == 1) {
        diaStatusTypeReact = "Published";
    } else {
        diaStatusTypeReact = "Draft";
    }
    if (currentChatDialogueDetail['dialogue_node_id']) {
        var file_detail = Response.split('~');
        if (file_detail[0] != 'error') {
            if (file.type.match(/image.*/) != null) {
                var attachment = "image";
            } else {
                var attachment = "attachment";
            }
            var comType = "";
            var blank_instance_node_id = "";

            if (documentType == "Letter") {
                comType = 'appendStatementForDialogueLetterClass';
                blank_instance_node_id = $("#blank-statement-id").val();
            } else {
                comType = 'appendStatementForDialogueClass';
                blank_instance_node_id = "";
            }
            let currentCourseId = ' ' + $.trim(currentChatDialogueDetail['course_node_id']);
            let currentDialogueId = ' ' + $.trim(currentChatDialogueDetail['dialogue_node_id']);
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            }
            let currentCourse = courseList[currentCourseId];
            if(view_type == 'bydialogue') {
                currentCourse = courseList[currentDialogueId];
            }

            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);

            var msg = {
                message: file_detail[0],
                filetype: attachment,
                statement_type: attachment,
                attachmentName: file.name,
                fileTempName: file_detail[1],
                fileSizeByte: file_detail[2],
                firstName : firstName,
                lastName : lastName,
                username: setUsername,
                user_instance_node_id: window.setUserID,
                user_recepient_node_id: getThis.props.chat_app.state.dialougeDetail.user_id,
                timestamp: getTime(),
                isGroupMessage: 5,
                action: attachment,
                type: comType,
                chat_type: 'Chat',
                dialogue_node_id: getThis.props.chat_app.state.dialougeDetail.dialogue_instance_node_id,
                course_node_id: currentCourse.course_node_id,
                course_dialogue_type: "new",
                courseStatementType: 'Chat',
                course_title: currentCourse.course,
                dialogue_title: getThis.props.chat_app.state.dialougeDetail.dialogue_title,
                saveType: "P",
                diaStatusType: diaStatusTypeReact
            };
            socket.send(JSON.stringify(msg));
            if(callback) {
                callback.success(file);
            }
        } else {
            var msg = '<p class="text-warning">' + file.name + ' upload failed.</p>';
            if(callback) {
                callback.error(file);
            }
            if(window.bootboxModal) {
                setTimeout(function() {
                    $('#failed_images_list').append(msg);
                }, 1000);
            } else {
                window.bootboxModal = true;
                var tmpl = '<div>\
                                <p class="text-danger">Error: '+file_detail[1]+'</p>\
                                <div id="failed_images_list">' +msg+ '</div>\
                            </div>';
                bootbox.alert({
                    title: 'Alert',
                    message: tmpl,
                    callback: function() {
                        window.bootboxModal = undefined;
                    }
                });
            }
        }
    }
}
