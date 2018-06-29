import React from 'react';
import ChatTypes from './chat_types';
// import ContextMenu from './context_menu';
import {connect} from 'react-redux';
import NotAParticipant from './not_a_participant';
import {updateChatText, showAdminHeader} from '../actions/actions';
import {getCurrentDialogue, hasLoggedInUserRemoved,getStatementDetailById,getStrWithDot, addCollapseEvent, getGuestUsers, sendImageOnSocket} from './functions/common_functions';


class ChatEditor extends React.Component {


    render() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let hasRemoved = hasLoggedInUserRemoved(view_type, courseList, currentChatDialogueDetail);
            if(hasRemoved) {
                return <NotAParticipant />
            }
        }


        return (
            <div className="edtContainer existingDocContainer clearfix course_edt_box fixed-chat-screen">
                <div className="edtHeader doc-wrap">
                    <div className="alignment-section course-alignment-section current-text-editor">
                        <div className="alignTotalWrapper clearfix">
                            <div className="alignLeftWrap">
                                <div className="fixed-icon">
                                    <div id="custom-preview-template-react" style={{display: 'none'}}>
                                        <div className="dz-preview dz-file-preview logoFrame">
                                            <div className="dz-image"><img data-dz-thumbnail/></div>
                                            <div className="dz-progress">
                                                <a href="javascript:void(0)" target="_blank"
                                                   className="canvas_view_mode">
                                                    <canvas id="my_canvas" data-dz-uploadprogress height="40"
                                                            width="40"></canvas>
                                                </a>
                                            </div>
                                            <div className="dz-details right_margin">
                                                <div className="dz-filename"><span data-dz-name></span></div>
                                                <div className="dz-size"><span data-dz-size></span></div>
                                            </div>
                                            {/*<span className="dialogue-date right"><ul><li><span id="currentTime">3:32 PM</span></li></ul></span>
                                             <div className="dz-error-message connection_notif">

                                             <span className="connect_wrap">
                                             <i className="icon connection_error"></i>
                                             <span data-dz-errormessage className="errMsg notif_title"> </span>
                                             </span>

                                             </div>
                                             <div className="dz-success-mark"></div>
                                             <div className="dz-error-mark">
                                             <title>Error</title>
                                             </div>
                                             */}
                                        </div>
                                    </div>
                                    <ChatTypes />
                                </div>
                                <span id="attachFileChat"
                                      className="icon attachmentChat showTootip hideOnLetterIcon letter-icon dz-clickable"
                                      data-align="edtJustify" data-toggle="tooltip" data-placement="left"
                                      data-original-title="Attach Files" style={{display: 'inline'}}></span>
                            </div>

                            <div className="alignRigthWrap"><span
                                className="icon editor-expand-btn showTootip course-expand-collapsed-btn"
                                data-align="edtJustify" data-toggle="tooltip" data-placement="left" title=""
                                style={{display: 'inline-block'}} data-original-title="Expand"></span></div>

                            <button id="courseChatSendButton" onClick={this.props.chat_app.sendMessage.bind(this.props.chat_app)}
                                    style={{display: 'none'}}>Send
                            </button>
                        </div>
                    </div>
                </div>

                <div className="edtMainCol">
                    <div className="edtCol2">
                        <div className="edtBody">
                            <div className="edtBodyWrapper">
                                <div className="niceScrollDiv mainScroll">
                                    <div className="chat-textarea">
                                        <textarea rows="3" cols="3"
                                            onBlur={this.onBlur.bind(this)}
                                            onKeyDown={this.sendKeydownMessage.bind(this)} className="form-control chatTextAreaJs"
                                            ref="message" id="paste-img"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <ContextMenu chatEditor={this}/> */}
            </div>
        )
    }

    /*onChange(event) {
        this.setState({
            chat_text:  event.currentTarget.value,
        });
        $('.chatTextAreaJs').val(event.currentTarget.value);
    }*/
    onBlur(event) {
        let currentTarget = event.currentTarget;
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 13 && !event.shiftKey) {
            return false;
        }
        let {currentChatDialogueDetail} = this.props;
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            this.props.dispatch(updateChatText({chatText : currentTarget.value}));
        }

    }

    componentDidUpdate() {
        var self = this;
        addCollapseEvent({
            on_show: function() {
                self.props.dispatch(showAdminHeader({showAdminHeader: 1}));
            },
            on_hide: function() {
                self.props.dispatch(showAdminHeader({showAdminHeader: 0}));
            }
        }, self.props);

        let textArea = $('.chatTextAreaJs');
        if (textArea.length) {
            let curDialogueNodeId = localStorage.getItem('dialogue_node_id');
            let prevDialogueNodeId = localStorage.getItem('prev_dialogue_node_id');
            if (textArea.val() != '' && prevDialogueNodeId == curDialogueNodeId) {
                this.refs.message.focus();
                return true;
            }
        }
        let chat_text = '';
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
            if(view_type == 'bycourse'){
                chat_text = currentDialogue.dialogue.chat_text;
            }else{
                chat_text = currentDialogue.chat_text;
            }

        }

        if (textArea.length) {
            textArea.val(chat_text);
            this.refs.message.focus();
        }
        courseDialogueContextMenuBar();
    }
    sendKeydownMessage(event) {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($keycode == 13 && !event.shiftKey) {
            event.preventDefault();
            this.props.chat_app.sendMessage();
            return false;
        }
    }





    componentDidMount() {
        var self = this;
        addCollapseEvent({
            on_show: function() {
                self.props.dispatch(showAdminHeader({showAdminHeader: 1}));
            },
            on_hide: function() {
                self.props.dispatch(showAdminHeader({showAdminHeader: 0}));
            }
        }, self.props);
        calculateFullDialogueChatHeight();
        let shouldInitializeDropZone = true;
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        let chat_text = '';
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);;
            chat_text = currentDialogue.dialogue.chat_text;
            let hasRemoved = hasLoggedInUserRemoved(view_type, courseList, currentChatDialogueDetail);
            if(hasRemoved) {
                shouldInitializeDropZone = false;
            }

        }
        $('.chatTextAreaJs').val(chat_text);
        courseDialogueContextMenuBar();
        this.attachImagePasteFunctionality();
        if (myDropzoneNewCourseChat) {
            myDropzoneNewCourseChat.element.dropzone = false;
            myDropzoneNewCourseChat.destroy();
        }
        if (shouldInitializeDropZone) {
            this.initializeDropZone();
        }

        if (this.refs.message) {
            this.refs.message.focus();
        }
        manageDialogueHT();
        manageCourseEditorIcon();
        $("#paste-img").niceScroll({
            cursorcolor: "#000",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "2px",
            background: 'rgba(0,0,0,.15)'
         });
    }
    attachImagePasteFunctionality() {
        let targetPasteImgElement = $('#paste-img'), _this = this;
        targetPasteImgElement.pastableTextarea();
        targetPasteImgElement.off('paste-image').on('paste-image', function(event, data) {

            let modalPopup = $("#user-profile-crop");
            let img = $('<img />').addClass('img-responsive').attr({
                src: data.dataURL
            });
            let defaultCaption = 'image';
            let ul = $('<ul />').addClass('paste-img-container');
            let li = $('<li />').addClass('paste-img').append(img);
            ul.append(li);

            li = $('<li />').addClass('paste-label').append($('<span />').addClass("form-label").text('Title: '));
            li.append($('<input name="paste-image-input"/>').attr({
                'maxlength': '50',
                placeholder: 'image'
            }).addClass("form-control input-field").val(defaultCaption)).on('keypress', function(event) {
                let keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13) {
                    modalPopup.find('.upload-img-js').trigger('click');
                }
            });
            li.append($('<p class="error-msg-txt hide">Only letters, numbers, dashes (-) and underscores (_) are allowed in caption.</p>'));
            ul.append(li);

            modalPopup.find('.modal-body').text('').append(ul);
            modalPopup.modal('show');

            modalPopup.off('shown.bs.modal').on('shown.bs.modal', function() {
                // modalPopup.find('.upload-img-js').focus();
                modalPopup.find('input[name="paste-image-input"]').focus();
            })
            modalPopup.find('.upload-img-js').off('click').on('click', function() {
                let caption = $.trim(modalPopup.find('input[name="paste-image-input"]').val());
                if(caption == '') {
                    caption = defaultCaption;
                }
                // if(!/^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(caption)) {
                if(!/^[a-zA-Z0-9-_]+$/.test(caption)) { // allow a-z, 0-9, - and _
                    modalPopup.find('.error-msg-txt').removeClass('hide');
                    return false;
                } else {
                    modalPopup.find('.error-msg-txt').addClass('hide');
                }
                NProgress.start({position: 'full'});
                $.ajax({
                    url: domainUrl + "chat-letter-upload.php",
                    type: 'post',
                    data: {
                        'data-url': data.dataURL,
                        name: caption,
                        dialogue_node_id: $('.dialogue_list.current').attr('data-id')
                    },
                    success: function(response) {
                        // _this.sendImageOnSocket({type: 'image', name: 'image.png'}, response);
                        sendImageOnSocket(_this, {type: 'image', name: 'image.png'}, response);
                        // NProgress.done();
                        modalPopup.find('.upload-img-js').off('click');
                        modalPopup.modal('hide');
                    }
                });
            });
        });
        targetPasteImgElement.on('paste-image-error', function(event, data) {
            bootbox.alert({
                title: 'Alert',
                message: data.message
            });
        });
    }

    componentWillReceiveProps() {
        if (myDropzoneNewCourseChat) {
            myDropzoneNewCourseChat.element.dropzone = false;
            myDropzoneNewCourseChat.destroy();
        }
        let shouldInitializeDropZone = true;
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let hasRemoved = hasLoggedInUserRemoved(view_type, courseList, currentChatDialogueDetail);
            if(hasRemoved) {
                shouldInitializeDropZone = false;
            }
        }
        if (shouldInitializeDropZone) {
            this.initializeDropZone();
        }
    }

    initializeDropZone() {
        this.props.chat_app.updateDialogueDetail();
        let {currentChatDialogueDetail, courseList, view_type} = this.props;

        var previewTemplateChat = $('#custom-preview-template-react').html();
        var documentType = $.trim($('#dropLetterExists').text());
        var clickable = "false";
        if ($("#attachFileChat:visible").length) {
            clickable = "#attachFileChat";
        }
        var getThis = this;
        var dialogue_node_id = $(".dialogue_list.current").attr('data-id');
        myDropzoneNewCourseChat = new Dropzone("#chatWrapper", {
            url: domainUrl + "chat-letter-upload.php",
            //url:domainUrl+'menudashboard/appendStatementDialogue',
            previewsContainer: (documentType.toLowerCase() == 'letter') ? undefined : ".msg-statement-wrap",
            autoProcessQueue: true,
            clickable: clickable,
            previewTemplate: previewTemplateChat,
            addRemoveLinks: true,
            dictRemoveFile: '',
            dictCancelUpload: '',
            thumbnailWidth: 100,
            thumbnailHeight: 100,
            parallelUploads: 5,
            acceptedMimeTypes: ".jpeg,.jpg,.png,.gif,.zip,.psd,.pdf,.doc,.docx,.xlsx,.csv,.txt",
            sending: function (file, xhr, formData) {
                formData.append('dialogue_node_id', dialogue_node_id);
            },
            uploadprogress: function (file, progress, bytesSent) {

                var myDropzone = this;
                if (firstTime) {
                    whiteCircle(file)
                }
                progressSim(progress, file);
            },
            success: function (file, Response) {
                window.file_list.push({
                    callback: function() {
                        var callback = {
                            success: function(file) {
                                if ($('#error_msg_file').length) {
                                    $('#error_msg_file').remove()
                                }
                                myDropzoneNewCourseChat.removeFile(file); //comment to show after upload
                            },
                            error: function(file) {
                                myDropzoneNewCourseChat.removeFile(file);
                            }
                        }
                        sendImageOnSocket(getThis, file, Response, callback);
                    }
                });
                if(!window.is_file_upload_in_progress) {
                    let processFun = window.file_list.shift();
                    processFun.callback();
                }
                // var callback = function(file) {
                //     if ($('#error_msg_file').length) {
                //         $('#error_msg_file').remove()
                //     }
                //     myDropzoneNewCourseChat.removeFile(file); //comment to show after upload
                // }
                // sendImageOnSocket(getThis, file, Response, callback);

            },
            complete: function () {
                $('.existWrapperMsg').getNiceScroll(0).doScrollTop($('.existWrapperMsg')[0].scrollHeight, -1);
            },
            // init: function() {
            //     var _this = this;
            //     this.on("addedfile", function(file) {
            //         if(file.size > (1024 * 1024 * 6) && !window.bootboxModal) {// not more than 6mb
            //             window.bootboxModal = true;
            //             var tmpl = '<div>\
            //                             <p class="text-danger">Error: maximum allowed size is 6 MB.</p>\
            //                             <div id="failed_images_list">File upload failed.</div>\
            //                         </div>';
            //             bootbox.alert({
            //                 title: 'Alert',
            //                 message: tmpl,
            //                 callback: function() {
            //                     window.bootboxModal = undefined;
            //                 }
            //             });
            //             this.removeFile(file); // if you want to remove the file or you can add alert or presentation of a message
            //         }
            //     });
            // }
        });
    }
}

const mapStateToProps = (state) => {
    return {
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        view_type: state.view_type,
        chatItems: state.chatItems,
        chatType: state.chatType,
    }
}
const ConnectedChatEditor = connect(mapStateToProps)(ChatEditor);
export default ConnectedChatEditor;
