import React from 'react';
import ChatTypes from './chat_types';

class NotAParticipant extends React.Component {
    render_old() {
        return (
            <div className="noparticipant">
                <div className="edtHeader doc-wrap">
                    <div className="alignment-section course-alignment-section current-text-editor"></div>
                </div>
                <div className="edtMainCol" style={{}}>
                    You are no longer a participant here.
                </div>
            </div>
        )
    }
    // due to an unexpected bug in chattype drop, below function is not being used. Once that issue is fixed then below function can be used.
    render() {
        return (
            <div className="edtContainer existingDocContainer clearfix course_edt_box noparticipant">
                <div className="edtHeader doc-wrap">
                    <div className="alignment-section course-alignment-section current-text-editor">
                        <div className="alignTotalWrapper clearfix">
                            <div className="alignLeftWrap">
                                <div className="fixed-icon">
                                    <ChatTypes />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="edtMainCol">
                    <div className="edtCol2">
                        <div className="edtBody">
                            <div className="edtBodyWrapper">
                                <div className="niceScrollDiv DocInsideHig mainScroll">
                                    <div className="edtCustomLoader"></div>
                                    <div className="chat-textarea" style={{}}>
                                        You are no longer a participant here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    componentDidMount() {
        noParticipantHT();
    }
}

export default NotAParticipant;
