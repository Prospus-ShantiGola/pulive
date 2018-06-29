import React from 'react';

class EmailList extends React.Component {
    render() {
		let course = this.props.course, self = this;
        let is_active_course = this.props.activeCourse;

        let displayClass = 'collapsedCourseBox clearfix';
        
		 return (
            <li className="email_list_wrapper production" data-email-instance-id={course.course_node_id} onClick={this.loadEmailList.bind(this, course)}>
                <div className="toggleCourseWrapper">
                    <div className="toggle-courses active"><i className="fa fa-angle-up collapse-up"></i></div>
                    <a className="ref-course-list"><div className="left inline-left-pane"><i className="icon production"></i><h6>Email</h6></div></a>
                </div>
                <div className="add-production"><i className="icon plus-class inactive"></i></div>
                <div className="clearfix">
                <div className={displayClass}>
                    <ul className="clearfix">
                       {this.getEmailList()}
                    </ul>
                </div>
                </div>
            </li>
        )
	}
	getEmailList(){
        let course = this.props.course, self = this;
        
            return(
                    <li className="production_list email_list" data-inbox-instance-id={course.course_node_id} onClick={(e) => {
                        self.emailList(course);
                        e.stopPropagation();
                    }}>
                        <div className="subCollapsedCourseBox">
                            {/*<div className="productionTitle clearfix"><i className="icon left sm-dialogue"></i><span>Prospus</span></div>*/}
                            <div className="toggleCourseWrapper" style={{paddingLeft:"0"}}>
                                <div className="toggle-courses active"><i className="fa fa-angle-up collapse-up"></i></div>
                                <a className="ref-course-list"><div className="left inline-left-pane"><i className="icon production"></i><h6>Prospus</h6></div></a>
                            </div>
                            <div className="clearfix">
                                <div className="collapsedCourseBox clearfix" style={{paddingLeft:"60px"}}>
                                    <ul className="clearfix">
                                       <li onClick={(e) => e.stopPropagation() }>Inbox</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                )
    }
	loadEmailList(course) {
		let course_node_id = course.course_node_id;
        let courseList = this.props.courseList, self = this;

        let currentDialogueDomElement = $("#menudashboard").find('li[data-email-instance-id="'+course_node_id+'"]');
        let dialogueWrapper = currentDialogueDomElement.find('.collapsedCourseBox:first');

        let arrowBtn = currentDialogueDomElement.find('.toggleCourseWrapper:first').find('.collapse-up');

        if(dialogueWrapper.hasClass('expandedCourseBox')) {
            arrowBtn.addClass('fa-angle-up').removeClass('fa-angle-down');
            dialogueWrapper.removeClass('expandedCourseBox');
        } else {
            arrowBtn.addClass('fa-angle-down').removeClass('fa-angle-up');
            dialogueWrapper.addClass('expandedCourseBox');
        }
	}
    emailList(course) {
        let course_node_id = course.course_node_id;
        let courseList = this.props.courseList, self = this;

        let currentDialogueDomElement = $("#menudashboard").find('li[data-inbox-instance-id="'+course_node_id+'"]');
        let dialogueWrapper = currentDialogueDomElement.find('.collapsedCourseBox:first');

        let arrowBtn = currentDialogueDomElement.find('.toggleCourseWrapper:first').find('.collapse-up');

        if(dialogueWrapper.hasClass('expandedCourseBox')) {
            arrowBtn.addClass('fa-angle-up').removeClass('fa-angle-down');
            dialogueWrapper.removeClass('expandedCourseBox');
        } else {
            arrowBtn.addClass('fa-angle-down').removeClass('fa-angle-up');
            dialogueWrapper.addClass('expandedCourseBox');
        }
    }
}


export default EmailList;