import React from 'react';
import {connect} from 'react-redux';
import {changeChatType, updateChatList} from '../actions/actions';
import {modifyChatListForSystemGeneratedMessages} from './functions/common_functions';

class ChatTypes extends React.Component {
    render() {
        return (
            <span className="">
                <div className="option-wrap dropdown">
                    {
                        this.getChatTypeIconTmpl()
                    }
                    <ul className="dropdown-menu StatementType" aria-labelledby="dropLetterExists">
                        <li onClick={this.handleClick.bind(this, 'Chat')}>
                            <a data-value="Chat" value="Chat" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Chat</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="Letter" value="Letter" href="javascript:void(0)">
                                <i className="icon letterIcon"></i><span>Letter</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="Forum" value="Forum" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Email</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="Forum" value="Forum" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Forum</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="QA" value="QA" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Q&A</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="Video" value="Video" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Video Call</span>
                            </a>
                        </li>
                        <li className="disabled">
                            <a data-value="Voice" value="Voic" href="javascript:void(0)">
                                <i className="icon chatIcon"></i><span>Voice Call</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </span>
        )
    }
    handleClick(chat_type) {
        var url = domainUrl+'menudashboard/statementList';
        var self = this;
        var dialogue_instance_node_id = $(".dialogue_list.current").data('id');
        if($('.add-new-course-tmpl').length) {
            dialogue_instance_node_id = '';
        }
        NProgress.start({position: 'right'});
        $.ajax({
            url: url,
            type: 'POST',
            data: {type: 'json', dialogue_instance_node_id: dialogue_instance_node_id, setUserID: window.setUserID, chatType: chat_type},
            success: function(response) {
                var chatItems = $.parseJSON(JSON.stringify(response));
                chatItems = modifyChatListForSystemGeneratedMessages(chatItems);
                self.props.dispatch(updateChatList(chatItems));
                handleNotificationOnChatTypeChange(chatItems);
                if(chatItems.chatType === 'Letter') {
                    myDropzoneNewCourseChat.element.dropzone = false;
                    myDropzoneNewCourseChat.destroy();
                }
            }
        });
        self.props.dispatch(changeChatType(chat_type));
    }
    getChatTypeIconTmpl() {
        let iconClass = 'icon letterIcon';
        if(this.props.chatType.toLowerCase() == 'chat') {
            iconClass = 'icon chatIcon';
        }
        return <a href="javascript:void(0)" data-toggle="dropdown" className="drop-anchor-select dropdown-toggle ttttt---111" id="dropLetterExists">
                    <i className={iconClass}></i><span ref="chat_type_holder">{this.props.chatType}</span>
                </a>
    }
}

const mapStateToProps = (state) => {
    return {
        chatType: state.chatType
    }
}

const ConnectedChatTypes = connect(mapStateToProps)(ChatTypes);
export default ConnectedChatTypes;
