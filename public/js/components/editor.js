import React from 'react';
import ChatTypes from './chat_types';
import {connect} from 'react-redux';
import ContextMenu from './context_menu';
import NotAParticipant from './not_a_participant';
import {updateLetterText, showAdminHeader} from '../actions/actions';
import {getCurrentDialogue, getUpdatedDialogueDetail, hasLoggedInUserRemoved,getStrWithDot, addCollapseEvent, getGuestUsers} from './functions/common_functions';

class Editor extends React.Component {
    constructor() {
        super();
        this.state = {dialougeDetail: tempMessageObj};
    }

    render() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if(currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let hasRemoved = hasLoggedInUserRemoved(view_type, courseList, currentChatDialogueDetail);
            if(hasRemoved) {
                return <NotAParticipant />
            }
        }

        return (
            <div className="letterChatMode fixed-chat-screen">
                <div className="total-width-pane">
                    <div className="edtContainer structuredMode" style={{display: 'block'}}>
                        <div id="hiddenTemp"></div>
                        <div id="tableContextMenu">
                            <ul>
                                <li><a href="javascript:void" data-action="rowAbove">Insert Row Above</a></li>
                                <li><a href="javascript:void" data-action="rowBelow">Insert Row Below</a></li>
                                <li><a href="javascript:void" data-action="columnLeft">Insert Column Left</a></li>
                                <li><a href="javascript:void" data-action="columnRight">Insert Column Right</a></li>
                                <li><a href="javascript:void" data-action="deleteRow">Delete Row</a></li>
                                <li><a href="javascript:void" data-action="deleteColumn">Delete Column</a></li>
                                <li><a href="javascript:void" data-action="deleteTable">Delete Table</a></li>
                            </ul>
                        </div>
                        <div id="tagContextMenu">
                            <ul>
                                <li><a href="javascript:void" data-action="removeTag">Remove Tag</a></li>
                            </ul>
                        </div>
                        <div id="signatureType">
                            <div>Select Signature</div>
                            <label><input type="radio" name="signType" defaultValue="full"/> Full</label>
                            <label><input type="radio" name="signType" defaultValue="initial"/> Initial</label>
                        </div>
                        <div id="printMarginBox">
                            <div>Margins (inches)</div>
                            <div><input type="text" size="2" className="edtPrintMargins" id="edtPrintMarginTop"
                                        defaultValue="1"/> Top
                            </div>
                            <div><input type="text" size="2" className="edtPrintMargins" id="edtPrintMarginBottom"
                                        defaultValue="1"/> Bottom
                            </div>
                            <div><input type="text" size="2" className="edtPrintMargins" id="edtPrintMarginLeft"
                                        defaultValue="1"/> Left
                            </div>
                            <div><input type="text" size="2" className="edtPrintMargins" id="edtPrintMarginRight"
                                        defaultValue="1"/> Right
                            </div>
                            <div>
                                <button id="edtPrintCommand">Print</button>
                                <button id="edtPrintCommandCancel">Cancel</button>
                            </div>
                        </div>
                        <div id="edtformElements" className="edtdrp">
                            <ul>
                                <li><a href="javascript:void" data-action="createNew">Definitive</a></li>
                                <li><a href="javascript:void" data-action="createExisting">Referential</a></li>
                            </ul>
                        </div>
                        <div id="edtHyperlinkPopup" className="edtPopWrap">
                            <div>Link : <input type="text" id="edtHyperlinkText" className="form-control input-field"
                                               autoFocus/></div>
                            <div>
                                <button id="saveedtHyperlinkText" className="btn btn-default btn-sm">Ok</button>
                                <button id="canceledtHyperlinkText" className="btn btn-default btn-sm">Cancel</button>
                            </div>
                        </div>
                        <div id="edtTagElements" className="edtdrp">
                            <ul>
                                <li><a href="javascript:void" data-action="Actor">Actor</a></li>
                                <li><a href="javascript:void" data-action="Role">Role</a></li>
                                <li><a href="javascript:void" data-action="Terms">Terms</a></li>
                                <li><a href="javascript:void" data-action="sign">Signature</a></li>
                                <li><a href="javascript:void" data-action="dynamicField">Dynamic Field</a></li>
                                <li><a href="javascript:void" data-action="toggleTags" data-val="visible">Toggle
                                    Tags</a></li>
                                <li><a href="javascript:void" data-action="showtaggeditems">Show Tagged Items</a></li>
                            </ul>
                        </div>
                        <div id="edtHyperlinkPreview" className="edtPopWrap">
                            <div>Visit : <a href="#" id="edtHyperlinkPreviewText" target="_blank"></a></div>
                            <div>
                                <button id="removeedtHyperlinkPreviewText" className="btn btn-default btn-sm">Remove
                                    Link
                                </button>
                            </div>
                        </div>
                        <div id="edtformElementsTextProperties" className="edtPopUp edtPopWrap edtdrp">
                            <div>
                                <label className="label-field">Field Name:</label>
                                <input type="text" id="edtPropAttrName" className="form-control input-field"
                                       placeholder="Required"/>
                            </div>
                            <div>
                                <label className="label-field">Field Value :</label>
                                <input type="text" id="edtPropAttrValue" className="form-control input-field"/>
                            </div>
                            <div>
                                <button id="saveedtformElementsTextProperties" className="btn btn-default btn-sm">Save
                                </button>
                                <button id="deleteedtformElementsTextProperties" className="btn btn-default btn-sm">
                                    Delete
                                </button>
                                <button id="canceledtformElementsTextProperties" className="btn btn-default btn-sm">
                                    Cancel
                                </button>
                                <div className="dropdown">
                                    <button id="tagformElementsTextProperties" className="btn btn-default btn-sm"
                                            data-toggle="dropdown">Tag<span className="caret"></span></button>
                                    <ul className="dropdown-menu tagEdtDynamicField">
                                        <li><a href="javascript:void(0)" data-action="Actor">Actor</a></li>
                                        <li><a href="javascript:void(0)" data-action="Role">Role</a></li>
                                        <li><a href="javascript:void(0)" data-action="Terms">Terms</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="edtformElementsTextPropertiesReference" className="edtPopUp">
                            <ul></ul>
                            <div>
                                <button id="canceledtformElementsTextPropertiesReference"
                                        className="btn btn-default btn-sm">Cancel
                                </button>
                            </div>
                        </div>
                        <div className="color-plates-wrap unselectable edtdrp" id="ColorPlatesSection">
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                <tr>
                                    <td style={{background: '#000000'}}></td>
                                    <td style={{background: '#434343'}}></td>
                                    <td style={{background: '#666666'}}></td>
                                    <td style={{background: '#999999'}}></td>
                                    <td style={{background: '#B7B7B7'}}></td>
                                    <td style={{background: '#CCCCCC'}}></td>
                                    <td style={{background: '#D9D9D9'}}></td>
                                    <td style={{background: '#EFEFEF'}}></td>
                                    <td style={{background: '#F3F3F3'}}></td>
                                    <td style={{background: '#FFFFFF'}}></td>
                                </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                <tr>
                                    <td style={{background: '#980000'}}></td>
                                    <td style={{background: '#FF0000'}}></td>
                                    <td style={{background: '#FF9900'}}></td>
                                    <td style={{background: '#FFFF00'}}></td>
                                    <td style={{background: '#00FF00'}}></td>
                                    <td style={{background: '#00FFFF'}}></td>
                                    <td style={{background: '#4A86E8'}}></td>
                                    <td style={{background: '#0000FF'}}></td>
                                    <td style={{background: '#9900FF'}}></td>
                                    <td style={{background: '#FF00FF'}}></td>
                                </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                <tr>
                                    <td style={{background: '#E6B8AF'}}></td>
                                    <td style={{background: '#F4CCCC'}}></td>
                                    <td style={{background: '#FCE5CD'}}></td>
                                    <td style={{background: '#FFF2CC'}}></td>
                                    <td style={{background: '#D9EAD3'}}></td>
                                    <td style={{background: '#D0E0E3'}}></td>
                                    <td style={{background: '#C9DAF8'}}></td>
                                    <td style={{background: '#CFE2F3'}}></td>
                                    <td style={{background: '#D9D2E9'}}></td>
                                    <td style={{background: '#EAD1DC'}}></td>
                                </tr>
                                <tr>
                                    <td style={{background: '#DD7E6B'}}></td>
                                    <td style={{background: '#EA9999'}}></td>
                                    <td style={{background: '#F9CB9C'}}></td>
                                    <td style={{background: '#FFE599'}}></td>
                                    <td style={{background: '#B6D7A8'}}></td>
                                    <td style={{background: '#A2C4C9'}}></td>
                                    <td style={{background: '#A4C2F4'}}></td>
                                    <td style={{background: '#9FC5E8'}}></td>
                                    <td style={{background: '#B4A7D6'}}></td>
                                    <td style={{background: '#D5A6BD'}}></td>
                                </tr>
                                <tr>
                                    <td style={{background: '#CC4125'}}></td>
                                    <td style={{background: '#E06666'}}></td>
                                    <td style={{background: '#F6B26B'}}></td>
                                    <td style={{background: '#FFD966'}}></td>
                                    <td style={{background: '#93C47D'}}></td>
                                    <td style={{background: '#76A5AF'}}></td>
                                    <td style={{background: '#6D9EEB'}}></td>
                                    <td style={{background: '#6FA8DC'}}></td>
                                    <td style={{background: '#8E7CC3'}}></td>
                                    <td style={{background: '#C27BA0'}}></td>
                                </tr>
                                <tr>
                                    <td style={{background: '#A61C00'}}></td>
                                    <td style={{background: '#CC0000'}}></td>
                                    <td style={{background: '#E69138'}}></td>
                                    <td style={{background: '#F1C232'}}></td>
                                    <td style={{background: '#6AA84F'}}></td>
                                    <td style={{background: '#45818E'}}></td>
                                    <td style={{background: '#3C78D8'}}></td>
                                    <td style={{background: '#3D85C6'}}></td>
                                    <td style={{background: '#674EA7'}}></td>
                                    <td style={{background: '#A64D79'}}></td>
                                </tr>
                                <tr>
                                    <td style={{background: '#85200C'}}></td>
                                    <td style={{background: '#990000'}}></td>
                                    <td style={{background: '#B45F06'}}></td>
                                    <td style={{background: '#BF9000'}}></td>
                                    <td style={{background: '#38761D'}}></td>
                                    <td style={{background: '#134F5C'}}></td>
                                    <td style={{background: '#1155CC'}}></td>
                                    <td style={{background: '#0B5394'}}></td>
                                    <td style={{background: '#351C75'}}></td>
                                    <td style={{background: '#741B47'}}></td>
                                </tr>
                                <tr>
                                    <td style={{background: '#5B0F00'}}></td>
                                    <td style={{background: '#660000'}}></td>
                                    <td style={{background: '#783F04'}}></td>
                                    <td style={{background: '#7F6000'}}></td>
                                    <td style={{background: '#274E13'}}></td>
                                    <td style={{background: '#0C343D'}}></td>
                                    <td style={{background: '#1C4587'}}></td>
                                    <td style={{background: '#073763'}}></td>
                                    <td style={{background: '#20124D'}}></td>
                                    <td style={{background: '#4C1130'}}></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="edtHeader doc-wrap">
                            <div className="alignment-section course-alignment-section current-text-editor">
                                <div className="alignTotalWrapper clearfix">
                                    <div className="alignLeftWrap">
                                        <div className="fixed-icon">
                              <span
                                  className="letter-icon unselectable unstructuredIcon showTootip exist-letter-icon clone-exist-letter-icon"
                                  style={{display: 'inline-block'}}>
                                <ChatTypes />
                                </span><span
                                            className="unselectable unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Font"
                                            style={{display: 'inline-block'}}>
                                                   <select id="fontStyle" className="select-field">
                                                      <option value="select">Font Family</option>
                                                      <option value="open sans">Open Sans</option>
                                                      <option value="arial">Arial</option>
                                                      <option value="verdana">Verdana</option>
                                                      <option value="times new roman">Times New Roman</option>
                                                   </select>
                                                </span><span
                                            className="unselectable unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Font Size"
                                            style={{display: 'inline-block'}}>
                                                   <select id="fontSize" className="select-field"
                                                           style={{width: '50px'}}>
                                                      <option value="select">Size</option>
                                                      <option value="8">8</option>
                                                      <option value="9">9</option>
                                                      <option value="10">10</option>
                                                      <option value="11">11</option>
                                                      <option value="12">12</option>
                                                      <option value="14">14</option>
                                                      <option value="18">18</option>
                                                      <option value="24">24</option>
                                                      <option value="48">48</option>
                                                   </select>
                                                </span></div>
                                        <input type="hidden" id="hidden_document_type_id" value="Letter"/><input
                                        type="hidden" id="hidden_dialog_document_node_id" value=""/><input type="hidden"
                                                                                                           id="hidden_dialog_type"
                                                                                                           value=""/><span
                                        className="unselectable tempDocument" style={{display: 'none'}}>
                                                   <select id="documentMode" className="select-field">
                                                      <option value="structured">Structured</option>
                                                      <option value="unstructured">Styled</option>
                                                   </select>
                                                </span>
                                        <div className="move-icon"><span
                                            className="doFontColor icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Text Color"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doBG icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Text Highlight"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doBold icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Bold"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doItalic icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Italic"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doUnderline icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Underline"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doList icon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Bulleted List"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doTable icon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Table"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doSplit icon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Line Break"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doDynamicText icon showTootip letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Form fields"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doHyperLink icon letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Hyper Link"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doTagFields icon letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Tag Fields"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doRemoveBlankStatements icon letter-icon hideOnChatIcon"
                                            data-align="edtJustify" data-toggle="tooltip" data-placement="bottom"
                                            title="Remove Blank Statements"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doFindReplace icon letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Find and Replace"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doUndo icon letter-icon hideOnChatIcon" data-toggle="tooltip"
                                            data-placement="bottom" title="Undo"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doRedo icon letter-icon hideOnChatIcon" data-toggle="tooltip"
                                            data-placement="bottom" title="Redo"
                                            style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="icon textOrientation hideOnChatIcon more-icons"
                                            data-align="edtJustify" data-toggle="tooltip" data-placement="bottom"
                                            data-original-title="More" id="MoreIconsShow"
                                            style={{display: 'inline-block'}}></span><span className="alignBoxWrap hide"
                                                                                           id="alignBoxId"
                                                                                           style={{display: 'block'}}><span
                                            className="doImageUpload icon letter-icon hideOnChatIcon"
                                            data-toggle="tooltip" data-placement="bottom" title="Upload Image"
                                            style={{display: 'inline-block'}}><input type="file"
                                                                                     id="uploadImage"/></span><span
                                            className="doLeftAlign icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-align="edtLeftALign" data-toggle="tooltip" data-placement="bottom"
                                            title="Left Align" style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doCenter icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-align="edtCenter" data-toggle="tooltip" data-placement="bottom"
                                            title="Center" style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doRightAlign icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-align="edtRightAlign" data-toggle="tooltip" data-placement="bottom"
                                            title="Right Align" style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="doJustify icon unstructuredIcon showTootip letter-icon hideOnChatIcon"
                                            data-align="edtJustify" data-toggle="tooltip" data-placement="bottom"
                                            title="Justify" style={{display: 'inline-block'}}>&nbsp;</span><span
                                            className="unselectable statementNums showTootip letter-icon hideOnChatIcon hide"
                                            data-toggle="tooltip" data-placement="bottom" title="Statement Number"
                                            style={{display: 'inline-block'}}>
                                                  <input type="checkbox" id="sNumbers"/>
                                                  <span className="icon smtNum"></span>
                                                </span><span className="doTotalsWords letter-icon hideOnChatIcon"
                                                             style={{display: 'inline-block'}}>0 words</span></span>
                                        </div>
                                        <span id="attachFileChat"
                                              className="icon attachmentChat showTootip hideOnLetterIcon letter-icon"
                                              data-align="edtJustify" data-toggle="tooltip" data-placement="left"
                                              data-original-title="Attach Files" style={{display: 'none'}}></span>
                                    </div>
                                    <div className="alignRigthWrap"><span
                                        className="icon editor-expand-btn showTootip course-expand-collapsed-btn"
                                        data-align="edtJustify" data-toggle="tooltip" data-placement="left" title=""
                                        style={{display: 'inline-block'}} data-original-title="Expand"></span></div>
                                </div>
                            </div>
                        </div>
                        <div className="edtMainCol">
                            <div className="edtCol1">
                                <div className="tocHeaderMain">
                                    <div className="tocHeader">
                                        <div className="heading">
                                            <span className="textOutline">Outline</span>
                                            <span><select id="edtAutoLevels" className="select-field"></select></span>
                                            <span id="refreshTOC">&nbsp;</span></div>
                                    </div>
                                    <div className="edtTOC niceScrollDiv">
                                        <ul></ul>
                                    </div>
                                </div>
                            </div>

                            <div className="edtCol2">
                                <div className="edtBody">
                                    <div className="niceScrollDiv document-pane mainScroll"
                                         style={{backgroundColor: '#fff'}}>
                                        <div className="edtCustomLoader"></div>
                                        <div contentEditable="true" spellCheck="false" onBlur={this.onBlur.bind(this)}
                                             className="edt structured" id="edt"
                                             style={{background: '#fff', marginLeft: '0px'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="edt-loader"></div>
                <button id="courseChatSendButton" onClick={this.sendMessage.bind(this)} style={{display: 'none'}}>Send
                </button>
                <button id="courseChatSaveDraftButton" onClick={this.saveDraftMessage.bind(this)}
                        style={{display: 'none'}}>Send
                </button>
                <ContextMenu />
            </div>
        )
    }

    onBlur(event) {
        let {currentChatDialogueDetail} = this.props;
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let letterText = event.currentTarget.innerHTML;
            this.props.dispatch(updateLetterText({letterText: letterText}));
        }

    }

    addNewCourse(save_type) {
        let courseTitle = $("#course-title-value"), self = this;
        let dialogueTitle = $("#dialogue-title-value");

        let courseTitleVal = courseTitle.val();
        let dialogueTitleVal = dialogueTitle.val();
        let recipientsList = $("input[name='recipient_id[]']");
        if (!recipientsList.length) {
            bootbox.alert({
                title: 'Alert',
                message: 'Please select Participant.'
            });
            $("#individual_user_list").focus();
            return true;
        }
        var statements = [];
        var editor = $('.letterChatMode #edt div.edtParagraph:visible');
        if ($.trim(editor.text()) == '' && editor.find('img').length == 0) {
            bootbox.alert({
                title: 'Alert',
                message: 'Please enter message.'
            });
            cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
            return true;
        }
        let guestUsers = getGuestUsers(self.addNewCourse.bind(self));
        if(guestUsers.length) {
            return true;
        }
        if (courseTitle.length && $.trim(courseTitle.val()) == '') {
            courseTitleVal = getStrWithDot($.trim(editor.text()));
        }

        if ($.trim(dialogueTitle.val()) == '') {
            dialogueTitleVal = getStrWithDot($.trim(editor.text()));
        }

        var htmlToInsert = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
        $('.letterChatMode #edt div.edtParagraph:visible').each(function () {
            statements.push({
                statement: $(this)[0].outerHTML,
            });
        });

        let recipients = [];
        recipientsList.each(function () {
            recipients.push($(this).val());
        });
        NProgress.start({position: 'middle'});
        var msg = {
            user_recepient_node_id: recipients.join(','),
            user_instance_node_id: window.setUserID,
            course_title: courseTitleVal,
            dialogue_title: dialogueTitleVal,
            selectType: 'Letter',
            Coursetype: 'Letter',
            course_dialogue_type: 'new',
            saveType: save_type,
            action: 'Letter',
            type: 'addCourseDialogueActorAndStatement',
            message: statements,
            course_node_id: '',
            dialog_node_id: '',
            statement_ins_id: '',
            default_params: {
                action: 'addNewCourse',
                added_by_id: window.setUserID,
                added_by_name: setUsername
            }
        };
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            let courseList = this.props.courseList;
            if (typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            }
            let course = courseList[' ' + $.trim(this.props.currentChatDialogueDetail.course_node_id)];
            msg.course_date = course.date;
            msg.course_created_by = course.created_by;
            msg.dialogue_created_by = window.setUserID;
            msg.course_node_id = this.props.currentChatDialogueDetail.course_node_id;
            msg.course_title = course.course;
            msg.default_params.action = 'addNewDialogue'
            msg.course_dialogue_type = 'existing';
            msg.default_params.course_node_id = msg.course_node_id;
        }
        socket.send(JSON.stringify(msg));
        $('.letterChatMode #edt').empty().html(htmlToInsert);
    }

    updateDialogueDetail() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            return true;
        }
        this.state.dialougeDetail = getUpdatedDialogueDetail(view_type, courseList, currentChatDialogueDetail);
    }

    sendMessage() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if (this.props.currentChatDialogueDetail.chat_view_type == 'add_new_course' || this.props.currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            this.addNewCourse();
            return true;
        }
        this.updateDialogueDetail();
        // let isAddNewCourse = $('#newCourseControl')
        // if (isAddNewCourse.length) {
        //     this.addNewCourse('P');
        //     return true;
        // }
        var statements = [];
        var htmlToInsert = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
        var editor = $('.letterChatMode #edt div.edtParagraph:visible');
        if ($.trim(editor.text()) == '' && editor.find('img').length == 0) {
            //alert('Please enter message');
            bootbox.alert({
                title: 'Alert',
                message: 'Please enter message.'
            });
            cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
            // bootbox.alert({
            //       title: 'Alert',
            //     message: 'Please enter message',
            //     callback: function() {
            //         cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
            //     }
            // });
            return true;
        }

        editor.each(function () {
            statements.push({
                statement: $(this)[0].outerHTML,
            });
        });
        var diaStatusTypeReact = this.state.dialougeDetail.dialogueStatus;
        if (diaStatusTypeReact == 1) {
            diaStatusTypeReact = "Published";
        }
        else {
            diaStatusTypeReact = "Draft";
        }

        let currentCourseId = ' ' + $.trim(this.props.currentChatDialogueDetail['course_node_id']);
        let currentDialogueId = ' ' + $.trim(this.props.currentChatDialogueDetail['dialogue_node_id']);

        let currentCourse = courseList[currentCourseId];
        if(view_type == 'bydialogue') {
            currentCourse = courseList[currentDialogueId];
        } else if(view_type == 'byactor') {
            currentCourse = courseList[currentCourseId].dialogue[currentDialogueId];
        }

        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);

        var msg = {
            message: statements,
            username: setUsername,
            firstName : firstName,
            lastName : lastName,
            user_instance_node_id: this.state.dialougeDetail.user_instance_node_id,
            user_recepient_node_id: this.state.dialougeDetail.user_id,
            timestamp: getTime(),
            isGroupMessage: 5,
            action: "Letter",
            type: "appendStatementForDialogueLetterClass",
            dialogue_node_id: this.state.dialougeDetail.dialogue_instance_node_id,
            course_node_id: currentCourse.course_node_id,
            course_dialogue_type: "new",
            courseStatementType: this.state.dialougeDetail.courseStatementType,
            course_title: currentCourse.course,
            dialogue_title: this.state.dialougeDetail.dialogue_title,
            course_created_by: currentCourse.created_by,
            dialogue_created_by: currentDialogue.created_by,
            saveType: "P",
            diaStatusType: diaStatusTypeReact,
            chat_type: 'Letter'
        };
        var extraParams = {
            action: 'appendStatementForDialogueLetterClass',
            type: 'appendStatementForDialogueLetterClass'
        };
        var edit_chat_statement = $("#edit_chat_statement");
        if (edit_chat_statement.length) {
            extraParams = edit_chat_statement.data('params');
            edit_chat_statement.remove();
            $("#react-button-cancel-edit").remove();
            msg = $.extend({}, msg, extraParams);
        }
        if (socket.readyState != 1) {
            //socketSaveMessages.push(JSON.stringify(msg));
            bootbox.alert("Connectivity with socket is lost and is in reconnecting state. Please try your action after sometime.")
            return false;
        }
        else {
            socket.send(JSON.stringify(msg));
            //reset chat box (textarea)
            localStorage.setItem('prev_dialogue_node_id',currentChatDialogueDetail.dialogue_node_id);
            this.props.dispatch(updateLetterText({letterText: "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>"}));
        }
        $('.letterChatMode #edt').empty().html(htmlToInsert);
        cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
    }

    saveDraftMessage() {
        this.updateDialogueDetail();
        let isAddNewCourse = $('#newCourseControl')
        if (isAddNewCourse.length) {
            this.addNewCourse('D');
            return true;
        }

        var statements = [];
        var htmlToInsert = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
        var editor = $('.letterChatMode #edt div.edtParagraph:visible');
        if ($.trim(editor.text()) == '' && editor.find('img').length == 0) {
            //alert('Please enter message');
            bootbox.alert({
                title: 'Alert',
                message: 'Please enter message.'
            });
            cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
            // bootbox.alert({
                //title: 'Alert',
            //     message: '',
            //     callback: function() {
            //         cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:first').get(0));
            //     }
            // });
            return true;
        }
        editor.each(function () {
            statements.push({
                statement: $(this)[0].outerHTML,
            });
        });
        var diaStatusTypeReact = this.state.dialougeDetail.dialogueStatus;
        if (diaStatusTypeReact == 1) {
            diaStatusTypeReact = "Published";
        } else {
            diaStatusTypeReact = "Draft";
        }
        var msg = {
            message: statements,
            username: setUsername,
            user_instance_node_id: this.state.dialougeDetail.user_instance_node_id,
            user_recepient_node_id: this.state.dialougeDetail.user_instance_node_id,
            timestamp: getTime(),
            isGroupMessage: 5,
            action: "Letter",
            type: "appendStatementForDialogueLetterClass",
            dialogue_node_id: this.state.dialougeDetail.dialogue_instance_node_id,
            course_node_id: this.state.dialougeDetail.course_node_id,
            course_dialogue_type: "new",
            courseStatementType: this.state.dialougeDetail.courseStatementType,
            course_title: this.state.dialougeDetail.course_title,
            dialogue_title: this.state.dialougeDetail.dialogue_title,
            saveType: "D",
            diaStatusType: diaStatusTypeReact,
            chat_type: 'Letter'
        };
        var extraParams = {
            action: 'appendStatementForDialogueLetterClass',
            type: 'appendStatementForDialogueLetterClass'
        };
        var edit_chat_statement = $("#edit_chat_statement");
        if (edit_chat_statement.length) {
            extraParams = edit_chat_statement.data('params');
            edit_chat_statement.remove();
            $("#react-button-cancel-edit").remove();
            msg = $.extend({}, msg, extraParams);
        }

        socket.send(JSON.stringify(msg));
        $('.letterChatMode #edt').empty().html(htmlToInsert);
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
        $(".checkEnterBox").css("display", "none");
        $('#documentMode').val('unstructured');
        $('#documentMode').trigger('change');

        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        let letter_text = '<div class="edtParagraph" data-s="1." data-x="0"><br></div>';
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
            if (view_type == 'bycourse') {
                letter_text = currentDialogue.dialogue.letter_text;
            } else {
                letter_text = currentDialogue.letter_text;
            }
        }
        var editor = $('.letterChatMode #edt');
        if (editor.length) {
            editor.empty().html(letter_text);
            cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:last').get(0));
        }
        manageDialogueHT();
        manageCourseEditorIcon();
        $(".niceScrollDiv").niceScroll({
            cursorcolor: "#909090",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "5px",
            background: 'rgba(0,0,0,.25)'
        });
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
        var editor = $('.letterChatMode #edt');
        if (editor.length) {
            let curDialogueNodeId = localStorage.getItem('dialogue_node_id');
            let prevDialogueNodeId = localStorage.getItem('prev_dialogue_node_id');
            if ($(editor.html()).text() != '' && prevDialogueNodeId == curDialogueNodeId) {
                cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:last').get(0));
                return true;
            }
        }
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        let letter_text = '<div class="edtParagraph" data-s="1." data-x="0"><br></div>';
        if (currentChatDialogueDetail.course_node_id && currentChatDialogueDetail.dialogue_node_id) {
            let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
            if (view_type == 'bycourse') {
                letter_text = currentDialogue.dialogue.letter_text;
            } else {
                letter_text = currentDialogue.letter_text;
            }

        }
        if (editor.length) {
            editor.empty().html(letter_text);
            cursorManager.setEndOfContenteditable($('.letterChatMode #edt div.edtParagraph:visible:last').get(0));
        }
    }
}
const mapStateToProps = (state) => {
    return {
        chatType: state.chatType,
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        view_type: state.view_type
    }
}

const ConnectedEditor = connect(mapStateToProps)(Editor);

export default ConnectedEditor;
