import React from 'react';
import {connect} from 'react-redux';
import {appendResourceList} from '../../actions/actions';
import NoRecordFound from '../no_record_found';
import {showImageInPopupCommon} from '../functions/common_functions';

class ResourceList extends React.Component {
    render() {
        let {course} = this.props;
        let id = 'resource_' + $.trim(course.course_node_id);
        let count = '';
        if(this.props.resourceCount) {
            count = ' (' + this.props.resourceCount + ')';
        }
        return (
            <li className="resource_list_wrapper inactive1" onClick={this.loadResourceList.bind(this, course, id)}
                data-resource-id={id}>
                <div className="toggleCourseWrapper">
                    {/*<div className="toggle-courses active"><i className="fa fa-angle-up collapse-up"></i></div>*/}
                    <a className="ref-course-list">
                        <div className="left inline-left-pane"><i className="icon resources inactive1"></i>
                            <h6>Resources{count}</h6>
                        </div>
                    </a>
                </div>
                {/*<div className="add-courses"><i className="icon plus-class"></i></div>*/}
                <div className="collapsedCourseBox clearfix ">
                    <ul className="clearfix">
                        {
                            this.prepareResouceList(course.resources)
                        }
                    </ul>
                </div>
            </li>
        )
    }

    prepareResouceList(resources) {
        let self = this;
        let icon_class, resourceStatement, icon_class_name, anchorPath = '';
        if (!Object.keys(resources).length) {
            return (
                <li>
                    <NoRecordFound msg={'No records found.'}/>
                </li>
            )
        }
        return (
            Object.keys(resources).map(function (key) {
                if (key == 'course_node_id') {
                    return null;
                }
                let resource = resources[key];
                if (typeof resource == 'string') {
                    return null;
                }
                let resourcePath = '';
                if (!resource.statement_type) {
                    resource.statement_type = '';
                }
                if (resource.statement_type.toLowerCase() == 'image') {
                    resourcePath = domainUrlApi + 'puidata/attachments/' + resource['dialogue_node_id'] + '/thumbs/' + resource.statement;
                    icon_class = 0;
                    icon_class_name = '';
                    anchorPath = domainUrlApi + 'puidata/attachments/' + resource['dialogue_node_id'] + '/' + resource.statement;
                }
                else if (resource.statement_type.toLowerCase() == 'attachment') {
                    //resourcePath = domainUrlApi + 'attachments/' + resource['dialogue_node_id'] + '/' + resource.statement;
                    icon_class = 1;
                    let format = resource.statement.split('.')[1];
                    if(format == 'docs' || format == 'docx') {
                        format = 'doc';
                    }else if(format == 'txt'){
                        format = 'notepad';
                    }
                    icon_class_name = "icon left " + format;

                    resourcePath = '';
                    anchorPath = domainUrlApi + 'puidata/attachments/'+resource['dialogue_node_id']+'/'+resource.statement;
                }

                //let icon_class = "icon left " + resource.statement.split('.')[1];
                return (
                    <li className="existingDialogueSelResourcesList" key={key} onClick={e => {e.stopPropagation();}}>
                        <div className="subCollapsedCourseBox">
                            <div className="courseTitle">
                                {(icon_class) ? <i className={icon_class_name}></i> : ''}
                                <span className="dialogue_resource_link">
                                    {(icon_class) ? <a href={anchorPath} target="_blank" className="downloadFile">{resource.statement}</a> : <a href="javascript:void(0)" onClick={self.showImageInPopup.bind(this, anchorPath, resource)}><img src={resourcePath} />{resource.statement}</a>}
                                </span>
                            </div>
                        </div>
                    </li>
                )
            })
        )
    }
    showImageInPopup(anchorPath, resource) {
        showImageInPopupCommon(anchorPath, resource);
    }
    loadResourceList(course, id) {

        let self = this; //added By Divya
        let currentResourceDomElement = $("#menudashboard").find('li[data-resource-id="'+id+'"]');
        let resourceWrapper = currentResourceDomElement.find('.collapsedCourseBox');
        if(resourceWrapper.hasClass('expandedCourseBox') && resourceWrapper.find('li').length) {
            resourceWrapper.removeClass('expandedCourseBox');
            return true;
        } else {
            resourceWrapper.addClass('expandedCourseBox');
        }

        let courseList = this.props.courseList;
        if (typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        }

        if (Object.keys(courseList[' ' + $.trim(course.course_node_id)].resources).length) {
            return true;
        }
        NProgress.start({position: 'middle'});
        $.ajax({
            url: domainUrl + 'menudashboard/dialogueResourceList',
            //data: {'course_instance_id': course.course_instance_id, user_instance_node_id: setUserID},
            data: {'course_node_id': course.course_node_id},
            type: 'POST',
            success: function (response) {
                self.props.dispatch(appendResourceList({response: response, course_node_id: course.course_node_id}));
                setTimeout(function () {
                    self.forceUpdate();
                    NProgress.done();
                }, 100);
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {
        chatType: state.chatType,
        courseList: state.courseList
    }
}
const ConnectedResourceList = connect(mapStateToProps)(ResourceList);
export default ConnectedResourceList;
