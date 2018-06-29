import React from 'react';
import { connect } from 'react-redux';

class NotificationList extends React.Component {
    render() {
        return (
            <li className="event_list_wrapper notification_list_wrapper" onClick={this.showRegisterationForm.bind(this)}>
                <div className="toggleCourseWrapper">
                    <a className="ref-course-list"><div className="left inline-left-pane"><i className="icon notification">
                    </i><h6>Notifications</h6></div></a>
                </div>
                <div className="RightFlyoutOpen add-courses"><i className="icon plus-class"></i></div>
                <div className="collapsedCourseBox clearfix">
                    <ul className="clearfix" ref="NotificationList">
                        <li className="dialogue_list" onClick={e => {e.stopPropagation();}}>
                            <div className="subCollapsedCourseBox">
                                <div className="courseTitle">Lorem ipsum course title</div>
                                <div className="updateCourseTitle"><span>Sanchaita Dey, Lorem Ipsum, Lorem Title</span></div>
                            </div>
                        </li>
                         <li className="dialogue_list" onClick={e => {e.stopPropagation();}}>
                            <div className="subCollapsedCourseBox">
                                <div className="courseTitle">Lorem ipsum course title</div>
                                <div className="updateCourseTitle"><span>Sanchaita Dey, Lorem Ipsum, Lorem Title</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        )
    }
    showRegisterationForm() {
        if(this.props.user_type == 'guest') {
            window.location.hash = '#register';
            return true;
        }
        let course = this.props.course;
        toggleItemList(course.course_node_id, '.notification_list_wrapper');
    }
}
const mapStateToProps = (state) => {
    return {
        user_type: state.user_type
    }
}
const ConnectedNotificationList = connect(mapStateToProps)(NotificationList);
export default ConnectedNotificationList;
