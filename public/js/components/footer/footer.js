import React from 'react';
import {connect} from 'react-redux';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.params = {};
    }
    render() {
        return (
            <footer className="footer">
                <div className="homeIcon"><i className="Icon home-green"></i></div>
                <ul className="breadccrumb-section">
                    <li><a>Course List</a></li>
                    <li><a>Course Name</a></li>
                    <li className="">Course Detail</li>
                </ul>
            </footer>
        )
    }
    getItemsList() {
        let items = [];
        let {page_name, view_type, courseList, currentChatDialogueDetail} = this.props, self = this;

        let sections = {
            inbox: 'Course List',
            store: 'Store'
        };
        items.push(sections[page_name]);
        if(typeof courseList == 'string') {
            courseList = $.parseJSON(courseList);
        }
        let course_id, courseTitle, firstIndex;
        console.log(currentChatDialogueDetail);
        if(page_name == 'inbox') {
            if(view_type == 'bycourse') {
                if(typeof currentChatDialogueDetail == 'undefined') {
                    firstIndex = Object.keys(courseList);
                    course_id = firstIndex[0];
                } else {
                    if(Object.keys(currentChatDialogueDetail).length) {
                        if(currentChatDialogueDetail.expand_course_node_id) {
                            course_id = currentChatDialogueDetail.expand_course_node_id;
                        } else {
                            course_id = currentChatDialogueDetail.course_node_id;
                        }
                    } else {
                        firstIndex = Object.keys(courseList);
                        course_id = firstIndex[0];
                    }
                }
                if(courseList[' ' + $.trim(course_id)]) {
                    courseTitle = courseList[' ' + $.trim(course_id)].course;
                    self.params.courseTitle = courseTitle;
                } else {
                    courseTitle = self.params.courseTitle;
                }
            } else {
                courseTitle = self.params.courseTitle;
            }
            if($.trim(courseTitle).length) {
                items.push(courseTitle);
            }
        }

        return items.map(function(item, index) {
            return (
                <li key={index}><a>{item}</a></li>
            )
        });
    }
}

const mapStateToProps = (state) => {
    return {
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        page_name: state.page_name,
        view_type: state.view_type
    }
}
const ConnectedFooter = connect(mapStateToProps)(Footer);
export default ConnectedFooter;
