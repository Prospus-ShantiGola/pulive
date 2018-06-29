import React from 'react';
import {connect} from 'react-redux';
import DialogueList from './dialogue_list';
import ActorList from '../actor_list';
import EventList from '../event_list';
import NotificationList from '../notification_list';
import ResourceList from '../resource_list';
import ProductionList from '../production_list';
import {changeChatView,appendProductionStart} from '../../../actions/actions';
import NoRecordFound from '../../no_record_found';
import {getCount} from '../../functions/common_functions';


class ListByCourse extends React.Component {

    render() {
        let self = this;
        let {courseList, currentChatDialogueDetail} = this.props;
        if(!courseList) {
            return null;
        }
        if(typeof courseList == 'string')  {
            courseList = JSON.parse(courseList);
        }

        if(typeof courseList.status != 'undefined' && courseList.status == 0){
            return <NoRecordFound msg={courseList.message}/>
        }
        return (
                    <div className="list-detail course-list-panel">
                    <div className="nano paneHT">
                    <div className="nano-content">
                        {

                            Object.keys(courseList).map(function(key, index) {
                                courseList[key].course_node_id = ' '+$.trim(courseList[key].course_node_id);
                                let item = courseList[key];
                                let is_active_course = false;
                                let current_class_name = '';
                                let activeTblClass = "table table-style table-responsive table-row course-list-table ActiveRow ref-inline react-list";
                                let class_name = 'course-list-detail hide';
                                if(index == 0 && !(currentChatDialogueDetail && currentChatDialogueDetail.expand_course_node_id)) {
                                    current_class_name = 'current';
                                    activeTblClass += ' openup';
                                    class_name = 'course-list-detail';
                                    self.defaultWorkflow(courseList[key].course_node_id);
                                }
                                if(typeof item.count == 'string')  {
                                    item.count = JSON.parse(item.count);
                                }
                                let countArr = item.count;
                                if(currentChatDialogueDetail && currentChatDialogueDetail.expand_course_node_id) {

                                    if($.trim(currentChatDialogueDetail.expand_course_node_id) == $.trim(item.course_node_id)) {

                                        current_class_name = 'current';
                                        activeTblClass += ' openup';
                                        class_name = 'course-list-detail';
                                        is_active_course = true;
                                        // currentChatDialogueDetail.expand_course_node_id = 0;
                                    }
                                }
                                if(item.has_received_notification) {
                                    current_class_name += ' notification-color';
                                }
                                let courseNodeId = ' ' + $.trim(item.course_node_id);
                                let isAdmin = self.notifyCourseAdmin(item.created_by);
                                return (
                                    <div className="list-row " key={index}>
                                        <table  cellPadding="0" cellSpacing="0" className={activeTblClass} onClick={self.handleChatView.bind(self, item)} data-course-node-id={courseNodeId} data-course-created-by={item.created_by} data-course-title={item.course}>
                                            <tbody>
                                                <tr className={current_class_name}>
                                                    {/*<td><i className="fa fa-angle-down"></i></td>*/}
                                                    <td className="ref-td">{isAdmin}</td>
                                                    <td className="ref-td"><span>{item.course}</span></td>
                                                    {/*<td className="ref-td">{item.domain}</td>*
                                                    <td className="ref-td" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={item.date}>{item.date}</td>
                                                    <td className="ref-td">{item.status}</td>*/}
                                                    <td className="ref-td" dangerouslySetInnerHTML={{__html: getCount(countArr.course,'course-count',0)}}></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className={class_name}>
                                            <div className="inline-course-wrap ref-inline-course-wrap">
                                                <ul>
                                                    <NotificationList course={item} notificationCount={countArr.notification}/>
                                                    <ActorList course={item} actorCount={countArr.actors}/>
                                                    <DialogueList course={item} activeCourse={is_active_course} dialogueCount={countArr.dialogues}/>
                                                    <EventList course={item} eventCount={countArr.events}/>
                                                    <ResourceList course={item} resourceCount={countArr.resources}/>
                                                    <ProductionList course={item} productionCount={countArr.production}/>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    </div>
                    </div>
        )
    }


    componentDidMount() {

        $('.loadder').hide();
        this.manageAdminClasses();
        this.removeTooltip();
    }
    handleChatView(item) {
        $("#untitledProd").remove();
        $(".dialogue_list.current").removeClass('current');
        $(".main_production_list.current").removeClass('current');
        let currentChatDialogue = {
            change_chat_view: 0,
            currentChatDialogueDetail: {
                expand_course_node_id: item.course_node_id
            }
        };
        // let currentChatDialogue = {change_chat_view: 0, expand_course_node_id: item.course_node_id};
        this.props.dispatch(changeChatView(currentChatDialogue));
        let self = this;
        setTimeout(function(){
            self.defaultWorkflow();
        });
    }
    defaultWorkflow(getNodeID){
        let self = this;
        let {currentChatDialogueDetail,courseList} = this.props;
        if(!currentChatDialogueDetail && !getNodeID){
            return true;
        }
        if(typeof courseList=="string"){
            courseList = JSON.parse(courseList);
        }
        if(!getNodeID && currentChatDialogueDetail){
            if(!currentChatDialogueDetail.expand_course_node_id){
                return true;
            }
        }
        let getCourseNodeID;
        if(!getNodeID){
            getCourseNodeID = currentChatDialogueDetail.expand_course_node_id;
        }
        else{
            getCourseNodeID = getNodeID;
            }

        if(getCourseNodeID==""){
            return true;
        }
        let getCourseInstanceID = courseList[getCourseNodeID].course_instance_id;
        let getCourseStatus = courseList[getCourseNodeID].status;

         $.ajax({
          url: domainUrl+'api/getcourseworkflowproduction/course_instance_id/'+getCourseInstanceID+'/userID/'+setUserID+'/status/'+getCourseStatus, //domainUrl+'menudashboard/getCourseBuilderClasses',
          type: 'GET',
          success: function(response) {
            if(typeof response=="string"){
                response = JSON.parse(response);
            }
            if(response.data.course_status=="P"){
                self.props.dispatch(appendProductionStart({response:response.data}));
            }
            else{
                self.props.dispatch(appendProductionStart({response:{}}));
            }
          }
      });
    }
    componentDidUpdate() {
        this.manageAdminClasses();
        $(".nano").nanoScroller();
        $('.course-list-detail:visible').prev().find('tr').addClass('current');
        this.removeTooltip();
    }
    manageAdminClasses() {
        var courseListJs = $('.courseListJs');
        courseListJs.removeClass('admin-course-list');
        if(courseListJs.find('i.icon.admin').length) {
            courseListJs.addClass('admin-course-list');
        }
    }
    notifyCourseAdmin(created_by) {

        if(created_by == window.setUserID) {
            return <i className='admin-icon'></i>
        }
    }
    removeTooltip() {
        $(".tooltip").remove();
    }
}

const mapStateToProps = (state) => {
    return {
        courseList: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        appendProductionStart: state.appendProductionStart
    }
}
const ConnectedListByCourse = connect(mapStateToProps)(ListByCourse);
export default ConnectedListByCourse;
