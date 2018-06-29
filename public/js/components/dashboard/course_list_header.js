import React from 'react';
import {connect} from 'react-redux';
import {updateCourseList, activeFilter} from '../../actions/actions';


class CourseListHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            filter: [
                {title: 'Ascending', value: {key: 'order_by', value: 'ASC'}},
                {title: 'Descending', value: {key: 'order_by', value: 'DESC'}},
                {title: 'By Dialogue', value: {key: 'course_type', value: 'dialogue'}},
                {title: 'By Production', value: {key: 'course_type', value: 'production'}},
                {title: 'Reset Filter', value: {}},
            ],
        };
    }

    render() {
        let self = this;
        let viewType = this.props.view_type;
        let listingHeader = 'Course';
        if (viewType == 'bydialogue') {
            listingHeader = 'Dialogue';
        } else if (viewType == 'byactor') {
            listingHeader = 'Actor';
        }
        return (
            <div className="flex-head clearfix">
                <div className="left detail-title"><i
                    className="icon-sm course-black"></i><span>{listingHeader}: List</span></div>
                <div className="right detail-action">
                    <div className="dropdown custom-dropdown">
                        <div data-toggle="dropdown">
                            <i className="icon-sm dot-md"></i>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <ul>
                                {
                                    (self.state.filter).map((value, key) => {
                                        let activeCls;
                                        if (self.props.activeFilter == value.title) {
                                            activeCls = 'active';
                                        }
                                        return <li className={activeCls} key={key}
                                                   onClick={self.applyFilter.bind(self, key)}><a
                                            className="dropdown-item" href="#">{value.title}</a></li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="control-bar">
                <div className="row">
                    <div className="col-md-12 left-head">
                        <div className="block-head">
                            <span className="main-title-wrap">
                                <span className="main-title left-side-heading">
                                    {listingHeader}: List
                                </span>
                            </span>
                            <span className="right detail-action"><i className="icon-sm dot-md"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    applyFilter(index) {
        /*if (filter.value == '' || this.props.page_name == 'store') {
            return true;
        }*/
        let filter = this.state.filter[index];
        if (filter.title == 'Reset Filter') {
            this.props.dispatch(activeFilter(''));
        } else {
            this.props.dispatch(activeFilter(filter.title));
        }

        filter = filter.value;
        let data = {
            setUserID: window.setUserID,
            view_type: this.props.view_type,
            key: filter.key,
            value: filter.value,
            type: 'json'
        }

        this.makeAjaxCall(data);
    }


    makeAjaxCall(data) {
        let self = this;
        NProgress.start({position: 'middle'});
        $.ajax({
            url: domainUrl + 'menudashboard/index',
            data: data,
            type: 'POST',
            success: function (response) {
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                self.props.dispatch(updateCourseList({response: {}}));
                self.props.dispatch(updateCourseList({response: response.data.course_list}));
                $(".nano").nanoScroller();
                NProgress.done();
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {
        view_type: state.view_type,
        activeFilter : state.activeFilter
    }
}
const ConnectedCourseListHeader = connect(mapStateToProps)(CourseListHeader);
export default ConnectedCourseListHeader;
