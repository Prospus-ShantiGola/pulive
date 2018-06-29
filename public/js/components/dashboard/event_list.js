import React from 'react';
class EventList extends React.Component {
    render() {
        return (

            <li className="event_list_wrapper event_list_wrapper_js"  onClick={this.showRegisterationForm.bind(this)}>
                <div className="toggleCourseWrapper">
                    {/*<div className="toggle-courses active"><i className="fa fa-angle-up collapse-up"></i></div>*/}
                    <a className="ref-course-list"><div className="left inline-left-pane" id="ct-toggle"><i className="icon event"></i><h6>Events</h6></div></a>
                </div>
                <div className="" id="EventFlyout"><i className="icon plus-class"></i></div>
                <div className="collapsedCourseBox clearfix" id="ct-toggle1">
                    <ul>
                        <li className="dialogue_list p" onClick={e => {e.stopPropagation();}}>
                            <div className="subCollapsedCourseBox">
                                <div className="courseTitle"><span>Lorem ipsum course title</span></div>
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
        toggleItemList(course.course_node_id, '.event_list_wrapper_js');
    }
  }
export default EventList;
