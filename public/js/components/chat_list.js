import React from 'react';
import fetch from 'isomorphic-fetch'
import {connect} from 'react-redux';
import ContextMenu from './context_menu';
import {appendNewChat, editChat, updateActorList, removeActor} from '../actions/actions';
// import RightPanelActionButton from './dashboard/right_panel_action_button';
import ShowImage from './show_image';
import {showImageInPopupCommon} from './functions/common_functions';

class ChatList extends React.Component {
    constructor() {
        super();
        this.force_update = false;
    }
    render() {

        $(".course-alignment-section").removeClass("current-text-editor")
        $(".course-alignment-section:visible").addClass("current-text-editor");
        manageCourseEditorIcon();

        let {chatItems, chatType, updaetd_timestamp} = this.props;
        chatType = chatType.toLowerCase();
        let items = chatItems;

        if(typeof chatItems == 'string') {
            items = JSON.parse(chatItems);
        }

        if(typeof items == 'undefined') {
            return null;
        }
        let self = this;
        let wrapperClass = 'msg-statement-wrap';
        if(this.props.chatType.toLowerCase() == 'letter') {
            wrapperClass += ' edt';
        }
        return (
            <div className={wrapperClass}>
            {/* <RightPanelActionButton /> */}
            {
                Object.keys(items).map(function(keyName, index) {

                    let chats = items[keyName];
                    let dateStr = moment(keyName).format('ll');
                    let dayName = moment(keyName).format('dddd');
                    dateStr = dayName + ' ' + dateStr;
                    let ulClassName;
                    if(chatType == 'chat') {
                        ulClassName = 'chat-msg-list';
                    }
                    return (
                        <div className="chat-by-date" key={index}>
                            <div className="weekly" data-date-str={keyName}> <span>{dateStr}</span> </div>
                            <ul className={ulClassName}>
                                {
                                    self.getChatList(chats, keyName)
                                }
                            </ul>
                        </div>

                    )
                })
            }
            </div>
        )
    }
    // arrangeSystemGeneratedMessages(chat) {
    //     if(chat.statement && typeof chat.statement.map == 'function') {
    //         chat.statement.map(function() {
    //
    //         });
    //     }
    // }
    componentDidMount(){
        var niceScroll = $(".letter-message-wrap, .message-wrap");
        if($(".msg-statement-wrap").height()<=niceScroll.height()){
            nanoScrollDown = true;
        }
        onElementHeightChange($(".msg-statement-wrap")[0], function(){
            if(nanoScrollDown){
                if(niceScroll.getNiceScroll(0)) {
                    niceScroll.getNiceScroll().resize();
                    niceScroll.getNiceScroll(0).doScrollTop($(".msg-statement-wrap").height() - 1, 1);
                    $(".showDownBtnNano").addClass("hide");
                    $(".showDownBtnNano .ct-counter-content").text("0");
                }
            }
            else{
                var getCounter = $(".showDownBtnNano .ct-counter-content").text();
                getCounter = parseInt(getCounter)+1;
                $(".showDownBtnNano .ct-counter").removeClass("hide");
                $(".showDownBtnNano").removeClass("hide");
                $(".showDownBtnNano .ct-counter-content").text(getCounter);
            }
        });
        if(niceScroll.getNiceScroll(0)) {
            niceScroll.scroll(function(info){
                if ((parseInt(niceScroll.scrollTop()) + parseInt($("#ascrail2000").height())) != $(".msg-statement-wrap").height()){
                     if($(".showDownBtnNano").hasClass("hide")){
                            if($(".showDownBtnNano .ct-counter-content").text()=="0"){
                                $(".showDownBtnNano .ct-counter").addClass("hide");
                            }
                            else{
                                $(".showDownBtnNano .ct-counter").removeClass("hide");
                            }
                            $(".showDownBtnNano").removeClass("hide");
                     }
                }
                else{
                        $(".showDownBtnNano").addClass("hide");
                        $(".showDownBtnNano .ct-counter-content").text("0");
                }
            });
        }
    }

    componentWillReceiveProps(){
        var niceScroll = $(".letter-message-wrap, .message-wrap");
        if($(".msg-statement-wrap").height()<=niceScroll.height()) {
            nanoScrollDown = true;
        }
        onElementHeightChange($(".msg-statement-wrap")[0], function(){
            if(nanoScrollDown){
                if(niceScroll.getNiceScroll(0)) {
                    niceScroll.getNiceScroll().resize();
                    niceScroll.getNiceScroll(0).doScrollTop($(".msg-statement-wrap").height() - 1, 1);
                    $(".showDownBtnNano").addClass("hide");
                    $(".showDownBtnNano .ct-counter-content").text("0");
                }
            }
            else{
                var getCounter = $(".showDownBtnNano .ct-counter-content").text();
                getCounter = parseInt(getCounter)+1;
                $(".showDownBtnNano .ct-counter").removeClass("hide");
                $(".showDownBtnNano").removeClass("hide");
                $(".showDownBtnNano .ct-counter-content").text(getCounter);
            }
        });
        if(niceScroll.getNiceScroll(0)) {
            niceScroll.scroll(function(info){
                if ((parseInt(niceScroll.scrollTop()) + parseInt($("#ascrail2000").height())) != $(".msg-statement-wrap").height()){
                     if($(".showDownBtnNano").hasClass("hide")){
                         if($(".showDownBtnNano .ct-counter-content").text()=="0"){
                           $(".showDownBtnNano .ct-counter").addClass("hide");
                         }
                         else{
                            $(".showDownBtnNano .ct-counter").removeClass("hide");
                        }
                         $(".showDownBtnNano").removeClass("hide");
                     }
                }
                else{
                        $(".showDownBtnNano").addClass("hide");
                        $(".showDownBtnNano .ct-counter-content").text("0");
                }
            });
        }
    }

    componentDidUpdate() {
        manageDialogueHT();
        //let niceScroll = $(".letter-message-wrap, .message-wrap");
        let self = this;
        let totalImages = $("#existingSelectedCourse").find('img');
        let loadedImgCount = 0;
        totalImages.on("load", function() {
            loadedImgCount++;
            if(totalImages.length == loadedImgCount) {
                manageDialogueHT();
            }
        }).each(function() {
            if(this.complete) $(this).load();
        });
        if(!this.force_update) {
            self.force_update = true;
            self.forceUpdate();
            setTimeout(function() {
                self.force_update = false;
            }, 1000);
        }
        setTimeout(function() {
            manageDialogueHT();
            NProgress.done();

            /*
            if(!niceScroll) {
                NProgress.done();
            }
            if(niceScroll.getNiceScroll(0)) {
                niceScroll.niceScroll().scrollend(function(info) {
                    setTimeout(function() {
                        NProgress.done();
                    }, 300);
                });
                //niceScroll.getNiceScroll(0).doScrollTop($(".msg-statement-wrap").height() - 1, 1);
            } else {
                setTimeout(function() {
                    NProgress.done();
                }, 500);
            }*/
        }, 200);
        // $('.dropdown').off('shown.bs.dropdown').on('shown.bs.dropdown', function() {
        //     console.log('dropdown');
        // });
    }
    getChatList(chats, keyName) {
        let self = this, items = chats, chat_type = this.props.chatType.toLowerCase();
        // if(typeof items.map != 'function') {
        //     return null;
        // }
        // console.log(items);
        return Object.keys(items).map(function(key1, index) {
            // debugger;
            let chat1 = items[key1];
            if(!chat1) {
                return null;
            }
            let chat = chat1['instance'];
            if(chat_type == 'chat') {
                chat = chat1;
            }
            if(!chat) {
                return null;
            }
            // self.arrangeSystemGeneratedMessages(chat);
            let userid = chat['actor.author'];
            let username = chat.first_name + ' ' + chat.last_name;
            if(chat.first_name && chat.last_name){
              var initialName = ((chat.first_name.charAt(0)) + (chat.last_name.charAt(0))).toUpperCase();
            }

            let timestampStr = moment((chat1.timestamp * 1000)).format("LT");
            if(timestampStr == 'Invalid date') {
                timestampStr = '';
            }
            let listRefId = chat1.blank_stmt_node_id;
            let dataContainerId = 0;
            let StatementUpdateTimestamp;
            if(chat_type == 'chat') {
                listRefId = chat1.node_instance_propertyid;
            } else {
                dataContainerId = chat1.blank_stmt_node_id;
            }
            var classes = 'user-msg-title';
            if(chat1.update_status == 1 && chat_type == 'chat') {
                classes += ' letter-edited-icon';

            }
            var editPermissionClass = 'statement-detail';

            if(window.setUserID == chat['actor.author'] && chat_type == 'letter' && chat.updated_status != 2) {
                editPermissionClass += ' react-type-letter';

            }

            let liClassName = 'statement-list-wrap single_list_wrap';
            if(chat_type == 'chat') {
                liClassName = 'statement-list-wrap single_list_wrap msg-left';
                if(userid == window.setUserID){
                    liClassName = 'statement-list-wrap single_list_wrap';
                    if(!chat.has_system_message) {
                        liClassName += ' msg-right';
                    }
                }
            }
            let single_msg_info_class = 'single_msg_info';
            if(chat_type == 'letter' && chat1.update_status == 1) {
                single_msg_info_class += ' letter-edited-icon';
                StatementUpdateTimestamp = 'Edited ' + moment((chat1.instance.statement_updated_timestamp * 1000)).format("hh:mm:ss");
            }
            if(chat_type == 'letter' && chat1.update_status == 2) {
                StatementUpdateTimestamp = 'Removed ' + moment((chat1.instance.statement_updated_timestamp * 1000)).format("hh:mm:ss");
            }
            if(chat.has_system_message) {
                liClassName += ' container-system-generated';
                return self.getSystemGeneratedTemplate(index, keyName, listRefId, single_msg_info_class, chat, chat1, timestampStr)
            }
            return (
                <li className={liClassName} key={index} data-group-ref={keyName} data-toggle="tooltip"
                    data-container="body" data-placement="bottom" data-original-title={StatementUpdateTimestamp}>
                    <ShowImage
                        imagesUrl={chat.profile_image}
                        classesName={'atch-img-border-course'}
                        imageWapperClassName={'msgIconBox'}
                        initialName = {initialName}
                        firstName = {chat.first_name}
                        lastName = {chat.last_name}
                    />
                    <div className="stmt-left">
                        <div className={editPermissionClass}>
                        <span className={classes}>
                            <span>
                                {username}<span className="user-msg-date right">{timestampStr}</span>
                            </span>
                            {/* <i className="icon sm-edit"></i>
                             <i className="icon draft"></i> */}

                        </span>

                        </div>
                        <div className={single_msg_info_class} data-container-id={dataContainerId}>
                            {
                                self.prepareMessageTemplate(chat, chat1)
                            }
                        </div>
                    </div>

                </li>
            )
        })
    }
    getSystemGeneratedTemplate(index, keyName, listRefId, single_msg_info_class, chat, chat1, timestampStr) {
        let self = this;
        let statement_timestamp;
        Object.keys(chat.statement).map(function(key) {
            let item = chat.statement[key];
            statement_timestamp = item.statement_timestamp;
        })
        return (
            <li className="participant-row" key={index} data-group-ref={keyName}>

                <div className={single_msg_info_class}>
                    {
                        self.prepareMessageTemplate(chat, chat1)
                    }
                </div>
                <div style={{textAlign: 'center'}}>{moment((statement_timestamp * 1000)).format("LT")}</div>
            </li>
        )
    }
    isWithinMinute(statements, position, statementKeys) {
        if(position == 0) return true;
        let currentKey = statementKeys[position];
        let prevKey = statementKeys[position - 1];

        let currentStatement = statements[currentKey];
        let prevStatement = statements[prevKey];
        var prevStatementTimestamp = moment(moment((prevStatement.statement_timestamp * 1000)).format("LT"), "HH:mm:ss a");
        var currentStatementTimestamp = moment(moment((currentStatement.statement_timestamp * 1000)).format("LT"), "HH:mm:ss a");

        var duration = moment.duration(currentStatementTimestamp.diff(prevStatementTimestamp));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes()) - hours * 60;

        if(minutes == 0) {
            return true;
        }
        return false;
    }
    prepareMessageTemplate(chat, chat1) {
        let self = this;
        let is_author = true;
        if(window.setUserID != chat['actor.author']) {
            is_author = false;
        }
        let courseId = $.trim(self.props.currentChatDialogueDetail.dialogue_node_id);
        if(this.props.chatType.toLowerCase() == 'chat') {
            let statementKeys = Object.keys(chat.statement);

            // if(chat.statement && typeof chat.statement.map == 'function') {
            return statementKeys.map(function(key22, index) {
                let position = statementKeys.indexOf(key22);

                let isWithinMinute = self.isWithinMinute(chat.statement, position, statementKeys);

                let item = chat.statement[key22];
                let imgPath = domainUrlApi + 'puidata/attachments/'+courseId+'/thumbs/'+item.statement;
                let anchorPath = domainUrlApi + 'puidata/attachments/'+courseId+'/'+item.statement;
                let listRefId = item.node_instance_propertyid;
                let StatementUpdateTimestamp;
                let updateStatusClass = 'more atch-overlay-img common-class react-type-chat';
                if(!is_author) {
                    updateStatusClass = updateStatusClass.replace('react-type-chat', '');
                }
                let statementPropertyId = item.node_instance_propertyid;
                if(item.updated_status == 1) {
                    updateStatusClass += ' letter-edited-icon';
                    StatementUpdateTimestamp = 'Edited '+ moment((item.statement_updated_timestamp * 1000)).format("hh:mm:ss");
                }
                if(item.statement_type && item.statement_type.toLowerCase() == 'image' && item.updated_status != 2) {
                    return (

                        <span key={index} className={updateStatusClass + ' stmt-wrap-pane'} data-property-ref={statementPropertyId}>
                                <a href="javascript:void(0)" className='anchor-box-course' onClick={self.showImageInPopup.bind(self, anchorPath, item)}>

                                    <img src={imgPath} className='atch-img-border-course'/>
                                    <span className='img-overlay-wrap'></span>
                                </a>
                                 {self.stmtOptionOnHover(chat, item)}
                                 {self.replyMessage(item)}
                            </span>
                    )
                }
                if(item.statement_type && item.statement_type.toLowerCase() == 'attachment' && item.updated_status != 2) {
                    var file_format = item.statement.split('.');
                    var format_icon = ChatdialogueModule.getIconFormat(file_format[1]);
                    imgPath = domainUrlApi + 'puidata/img/icons/'+format_icon;
                    return (

                        <span key={index} className={updateStatusClass + ' stmt-wrap-pane'} data-property-ref={statementPropertyId}>
                                <a key={index}  href={anchorPath} target="_blank" className='downloadFile truncate-attachments atch-img-border-course'>
                                    <img src={imgPath} className='atch-img-border-course'/>{item.statement}
                                    {/* <span className='fileSized'>100</span> */}
                                </a>
                                {self.stmtOptionOnHover(chat, item)}
                                {self.replyMessage(item)}
                            </span>
                    )
                }
                if(item.statement_type && item.statement_type.toLowerCase() == 'system message' && item.updated_status != 2) {
                    return (
                        <div key={index} className="participant-updated-wrapper" >
                            <span className="participant-updated" dangerouslySetInnerHTML={{__html: item.statement}} data-type="statement"></span>
                        </div>
                    )
                }
                updateStatusClass = 'more-txt-span clearfix react-type-chat';
                if(!is_author) {
                    updateStatusClass = updateStatusClass.replace('react-type-chat', '');
                }
                if(item.updated_status == 1) {
                    updateStatusClass += ' letter-edited-icon';
                    StatementUpdateTimestamp = 'Edited '+ moment((item.statement_updated_timestamp * 1000)).format("hh:mm:ss");
                }
                if(item.updated_status == 2) {

                    let text_remove_message;
                    let timestampStr = '';
                    if(item.statement_timestamp) {
                        timestampStr = moment((item.statement_timestamp * 1000)).format("LT");
                    }
                    if(timestampStr == 'Invalid date') {
                        timestampStr = '';
                    }
                    StatementUpdateTimestamp = 'Removed '+ moment((item.statement_updated_timestamp * 1000)).format("hh:mm:ss");
                    if($.trim(item.statement_type.toLowerCase()) == 'image' || $.trim(item.statement_type.toLowerCase()) == 'attachment'){
                        text_remove_message = 'This file has been removed.';
                    }else{
                        text_remove_message = 'This message has been removed.';
                    }
                    if (!isWithinMinute && timestampStr) {
                        return <div className="stmt-text-timestamp" key={index}><span key={index} className="more statement_drop clearfix rmv-disabled" data-type="statement" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={StatementUpdateTimestamp}>{text_remove_message}</span><span className="user-msg-date">{timestampStr}</span></div>
                    }else {
                        return <span key={index} className="more statement_drop clearfix rmv-disabled" data-type="statement" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={StatementUpdateTimestamp}>{text_remove_message}</span>
                    }

                }

                    if (!isWithinMinute) {

                        let timestampStr = moment((item.statement_timestamp * 1000)).format("LT");
                        if(timestampStr == 'Invalid date') {
                            timestampStr = '';
                        }
                        return (
                            <div className="stmt-text-timestamp stmt-wrap-pane" key={index}>
                                <span className={updateStatusClass}
                                      dangerouslySetInnerHTML={{__html: item.statement}}
                                      data-property-ref={statementPropertyId} data-type="statement"
                                      data-type="statement" data-toggle="tooltip" data-container="body"
                                      data-placement="bottom" data-original-title={StatementUpdateTimestamp}>
                                </span>
                                {self.stmtOptionOnHover(chat, item)}
                                <span className="user-msg-date">{timestampStr}</span>
                                {self.replyMessage(item)}

                            </div>
                        )
                    }



                return (
                 <span key={index} className="stmt-wrap-pane">
                    <span className={updateStatusClass} dangerouslySetInnerHTML={{__html: item.statement}} data-property-ref={statementPropertyId} data-type="statement" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={StatementUpdateTimestamp}>
                    </span>
                    {self.stmtOptionOnHover(chat, item)}
                    {self.replyMessage(item)}
                </span>
                )
            })
           } else {
            return Object.keys(chat.statement).map(function(key, index) {
                let stmt = chat.statement[key];
                let disabledClass = 'more-txt-span clearfix';
                if(chat1.update_status == 2) {
                    disabledClass += ' rmv-disabled';
                }
                return (
                    <span key={index} className="stmt-wrap-pane">
                        <span className={disabledClass} dangerouslySetInnerHTML={{__html: stmt.statement}}></span>
                        {self.stmtOptionOnHover(chat, stmt)}
                        {self.replyMessage(stmt)}
                    </span>
                )
            })
        }
        return
    }
    messageReply(chat, stmt) {
        let self = this, bootbox_modal;
        let replyPopupHtml = $('<div />').addClass('reply-box-wrapper');
        let row1 = $('<div />').addClass('reply-box-row');

        let input = $('<textarea />').addClass('form-control input-field').attr({
            id: 'reply-msg-input',
            'data-node_instance_propertyid': stmt.node_instance_propertyid,
            placeholder: 'Type your reply here...'
        });
        input.on('keypress', function(event) {
            if(event.which == 13) {
                let message_txt = $.trim($(this).val());
                self.props.chat_app.sendMessage();
                if(message_txt != '') {
                    bootbox_modal.modal('hide');
                } else {
                    $(this).val('');
                    return false;
                }
            }
        })
        row1.append($('<div />').append(input));
        let buttonContainer = $('<div />').addClass('btn-box');
        buttonContainer.append($('<span />').text("Hit 'Enter' or"));
        let send_btn = $('<button type="button" class="btn btn-dark-blue btn-sm">Send</button>');
        send_btn.on('click', function() {
            let message_txt = $.trim(input.val());
            self.props.chat_app.sendMessage();
            if(message_txt != '') {
                bootbox_modal.modal('hide');
            } else {
                input.val('');
                return false;
            }
        });
        buttonContainer.append(send_btn);
        let courseId = $.trim(self.props.currentChatDialogueDetail.dialogue_node_id);
        row1.append(buttonContainer);

        replyPopupHtml.append(row1);

        let row2 = $('<div />').addClass('reply-box-row');
        let content = $('<div />').addClass('reply-msg-wrap').append($('<h5 />').text('in reply to ' + chat.first_name + ' ' + chat.last_name));
        let statement = stmt.statement;
        let imgPath;
        if(stmt.statement_type.toLowerCase() == 'image') {
             imgPath = domainUrlApi + 'puidata/attachments/'+courseId+'/thumbs/'+stmt.statement;
             statement = $('<img />').attr({src: imgPath}).addClass('atch-img-border-course');
        } else if(stmt.statement_type.toLowerCase() == 'attachment') {
            var file_format = stmt.statement.split('.');
            var format_icon = ChatdialogueModule.getIconFormat(file_format[1]);
            imgPath = domainUrlApi + 'puidata/img/icons/'+format_icon;
            statement = $('<span />').addClass('single_list_wrap');
            var container = $('<span />').addClass('single_msg_info');

            var anchor = $('<a />').attr({
                href: 'javascript:void(0)'
            }).addClass('downloadFile');
            anchor.append($('<img />').attr({src: imgPath}).addClass('atch-img-border-course'));
            anchor.append($('<span />').text(stmt.statement));
            container.append(anchor);
            statement.append(container);
        }
        content.append($('<div />').addClass('reply-msg').html(statement));
        row2.append(content);
        replyPopupHtml.append(row2);

        bootbox_modal = bootbox.dialog({
            title: 'Reply',
            message: replyPopupHtml
        });
        bootbox_modal.on("shown.bs.modal", function() {
            $(this).find('#reply-msg-input').focus()
        });
        bootbox_modal.on("hidden.bs.modal", function() {
            $("#paste-img").focus();
        });
        bootbox_modal.modal('show');
    }
    stmtOptionOnHover(chat, stmt) {
        return <ContextMenu chat={chat} stmt={stmt} context={this}/>
    }

    replyMessage(item) {
        if(!('reply' in item) || !item.reply) {
            return null;
        }
        let {currentChatDialogueDetail, courseList} = this.props;
        if(typeof courseList == 'string') {
            courseList = $.parseJSON(courseList);
        }
        let currentDialogue = (this.props.view_type == 'bydialogue') ? courseList[' '+$.trim(currentChatDialogueDetail.dialogue_node_id)] : courseList[' '+$.trim(currentChatDialogueDetail.course_node_id)].dialogue[' '+$.trim(currentChatDialogueDetail.dialogue_node_id)];
        let reply = item.reply;
        if(typeof reply == 'string') {
            reply = $.parseJSON(item.reply);
        }
        if(this.props.view_type == 'bydialogue'){
            if(!currentDialogue.actors[reply.user_id]) {
                return null;
            }
        }else{
            if(!currentDialogue.users[reply.user_id]) {
                return null;
            }
        }

        let user_name = (this.props.view_type == 'bydialogue') ? currentDialogue.actors[reply.user_id].first_name + ' ' + currentDialogue.actors[reply.user_id].last_name : currentDialogue.users[reply.user_id].first_name + ' ' + currentDialogue.users[reply.user_id].last_name;
        let self = this;
        return(
            <span className="rply-msg-view">
                <ul>
                    <li>
                        <h5>In reply to {user_name}</h5>
                        {this.showReply.call(this, reply, currentDialogue)}
                    </li>
                </ul>
            </span>
        )
    }
    showReply(reply, currentDialogue) {
        let {currentChatDialogueDetail} = this.props;
        let courseId = $.trim(currentChatDialogueDetail.dialogue_node_id), imgPath;
        let user_name = (this.props.view_type == 'bydialogue') ? currentDialogue.actors[reply.user_id].first_name + ' ' + currentDialogue.actors[reply.user_id].last_name :  currentDialogue.users[reply.user_id].first_name + ' ' + currentDialogue.users[reply.user_id].last_name;
        let self = this;

        if(reply.statement_type && reply.statement_type.toLowerCase() == 'image') {
             imgPath = domainUrlApi + 'puidata/attachments/'+courseId+'/thumbs/'+reply.statement;
             let anchorPath = domainUrlApi + 'puidata/attachments/'+courseId+'/'+reply.statement;
             return (<p onClick={this.showImageInPopup.bind(this, anchorPath, reply)}><img src={imgPath} /></p>)
        } else if(reply.statement_type && reply.statement_type.toLowerCase() == 'attachment') {
            var file_format = reply.statement.split('.');
            var format_icon = ChatdialogueModule.getIconFormat(file_format[1]);
            imgPath = domainUrlApi + 'puidata/img/icons/'+format_icon;
            let anchorPath = domainUrlApi + 'puidata/attachments/'+courseId+'/'+reply.statement;
            return (
                <p><a href={anchorPath} target="_blank" className="downloadFile"><img src={imgPath} />{reply.statement}</a></p>
            )
        }
        return (
            <p dangerouslySetInnerHTML={{__html: reply.statement}}></p>
        )


        //
        //
        // if(reply.statement_type && reply.statement_type.toLowerCase() == 'image') {
        //     this.showImageInPopup(anchorPath, reply);
        // } else if(reply.statement_type && reply.statement_type.toLowerCase() == 'attachment') {
        //     // let anchorPath = domainUrlApi + 'puidata/attachments/'+courseId+'/'+item.statement;
        //     let anchor = $('<a />').attr({
        //         href: anchorPath,
        //         target: '_blank',
        //         id: 'attachement_anchor'
        //     });
        //     $('body').append(anchor);
        //     $("#attachement_anchor").trigger('click');
        //     $("#attachement_anchor").remove();
        //     // window.location.href = anchorPath;
        // }
    }
    showImageInPopup(full_url, item) {
        showImageInPopupCommon(full_url, item);
    }
    /*sendChat() {
        var sendButton = $("#courseChatSendButton");
        if(!sendButton.length) {
            sendButton = $("#course-dialogue-publish");
        }
        sendButton.trigger('click');
    }*/
    saveAsDraft() {
        var saveAsDraftButton = $("#courseChatSaveDraftButton");
        if(!saveAsDraftButton.length) {
            saveAsDraftButton = $("#course-dialogue-draft");
        }
        saveAsDraftButton.trigger("click");
    }
    toggleAddRecipientBtn() {
        var existingDialogueControl = $("#existingDialogueControl");
        var individual_user_list;
        if(existingDialogueControl.length) {
            var btn = $("#react-button3"), editor = $('.chat-textarea').find('textarea'), publishBtn = $("#react-button1"), saveAsDraftBtn = $("#react-button2");
            if(existingDialogueControl.find('.existRightPanel').find('.icon').hasClass('collapse-up')) {
                editor.removeAttr('readonly');
                publishBtn.removeClass('hide');
                if(this.props.chatType.toLowerCase() == 'letter') {
                    saveAsDraftBtn.removeClass('hide')
                }
                btn.addClass('hide');
                return true;
            }

            individual_user_list = existingDialogueControl.find('input[name="individual_user_list"]');

            if(individual_user_list.length) {
                btn.removeClass('hide');
                publishBtn.addClass('hide');
                if(this.props.chatType.toLowerCase() == 'letter') {
                    saveAsDraftBtn.addClass('hide')
                }
                editor.attr('readonly', true);
            } else {
                btn.addClass('hide');
                publishBtn.removeClass('hide');
                if(this.props.chatType.toLowerCase() == 'letter') {
                    saveAsDraftBtn.removeClass('hide')
                }
                editor.removeAttr('readonly');
            }
        }

    }
                }
const mapStateToProps = (state) => {
    return {
        chatItems: state.chatItems,
        chatType: state.chatType,
        updaetd_timestamp: state.updaetd_timestamp,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        change_chat_view : state.change_chat_view,
        view_type : state.view_type,
    }
}
const ConnectedChatList = connect(mapStateToProps)(ChatList);
export default ConnectedChatList;
