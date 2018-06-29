import React from 'react';

import {connect} from 'react-redux';
import CourseListHeader from '../course_list_header';
import Columns from '../list_columns';
import ListByCourse from '../list_by_course/list';
import ListByDialogue from '../list_by_dialogue/list';
import ListByActor from '../list_by_actor/list';

class ListSection extends React.Component {
    render() {
        return (
            <div className="flex-item half-pane" id="leftPane">
                <CourseListHeader />
                <div className="detail-pane">

                    {
                        this.getList()
                    }
                </div>
            </div>
        )
    }
    getList() {
        let viewType = this.props.view_type;        
        if(viewType == 'bycourse') {
            return <ListByCourse />
        } else if(viewType == 'bydialogue') {
            return <ListByDialogue />
        } else if(viewType == 'byactor') {
            return <ListByActor />
        }
    }
    componentDidMount() {
        if(typeof leftMenuIconHover == 'function') {
            leftMenuIconHover();
        }
    }
}

const mapStateToProps = (state) => {
    return {
        view_type: state.view_type
    }
}

const ConnectedMiddleSection = connect(mapStateToProps)(ListSection);

export default ConnectedMiddleSection;
