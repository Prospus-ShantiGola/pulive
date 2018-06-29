import React from 'react';
import {connect} from 'react-redux';
import ActorList from '../actor_list';
import EventList from '../event_list';
import ResourceList from '../resource_list';
import NoRecordFound from '../../no_record_found';
import {appendDialogueList, updateChatList, changeChatView, updateCourseList} from '../../../actions/actions';
import {modifyChatListForSystemGeneratedMessages} from '../../functions/common_functions';
import ShowImage from '../../show_image';
import {getCount, isUserAdmin} from '../../functions/common_functions';

class ListByDialogue extends React.Component {
    render() {
        let {items, currentChatDialogueDetail} = this.props, self = this;
        if(typeof items == 'string') {
            items = JSON.parse(items);
        }
        if(typeof items.status != 'undefined' && items.status == 0){
            return <NoRecordFound msg={items.message}/>
        }
        return (
            <div className="list-detail">
                <div className="nano paneHT">
                    <div className="nano-content">
                        <div className="course-list-panel mainAccordianDiv">
                            {
                                Object.keys(items).map(function(key, index) {
                                    let item = items[key];
                                    let current_class_name = 'dialogue_list';
                                    if(typeof currentChatDialogueDetail != 'undefined') {
                                        if(currentChatDialogueDetail.dialogue_node_id == item.dialogue_node_id) {
                                            current_class_name += ' current';
                                        }
                                    } else if(index == 0) {
                                        current_class_name += ' current';
                                    }
                                    let class_name = (index == 0) ? 'course-list-detail': 'course-list-detail hide';
                                    //let actor_name = self.getActorsShortName(item.actors);
                                    let activeTblClass = (index == 0) ? 'table table-style table-responsive table-row dialogue-list-table ActiveRow ref-inline react-list openup' : 'table table-style table-responsive table-row dialogue-list-table ActiveRow ref-inline react-list';
                                    let urls = self.getUserProfileUrl(item.actors);
                                    return (
                                        <div className="list-row" key={index}>
                                            <table className={activeTblClass} onClick={e => {self.loadChatWindow.call(self, item, e)}}>
                                                <tbody>
                                                    <tr
                                                        className={current_class_name} data-id={item.dialogue_node_id}
                                                        data-dialogue-title={item.dialogue} data-instance-id={item.dialogue_instance_id}
                                                        data-course-node-id={item.course_node_id} data-course-title={item.course}
                                                        data-course-created-by={item.course_created_by} data-dialogue-created-by={item.dialogue_created_by}
                                                        data-dialogue-status={item.dialogueStatus}>
                                                        {/*<td><i className="fa fa-angle-down"></i></td>*/}
                                                        <td className="ref-td">{isUserAdmin(item.dialogue_created_by)}</td>
                                                        <td className="ref-td">{item.dialogue}</td>
                                                        {/*<td className="ref-td" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={item.course}>{item.course}</td>
                                                        <td className="ref-td" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={item.date}>{item.date}</td>*/}
                                                        <td className="ref-td">
                                                            <div className="actors-list grp-actor-list">
                                                                <ShowImage
                                                                    imagesUrl={item.actors}
                                                                    classesName={'img-responsive'}
                                                                    imageWapperClassName={'actors-user-img-sm'}
                                                                    dialogueCreatedBy = {item.dialogue_created_by}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td onClick={event => self.goToCourse.bind(self,item.course_node_id,event)} className="ref-td">
                                                            <i className="go-to-course"></i>
                                                        </td>
                                                        <td className="ref-td" dangerouslySetInnerHTML={{__html: getCount(item.notificationCount,'counter-wrap',0)}}></td>

                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className={class_name}>
                                                <div className="inline-course-wrap ref-inline-course-wrap">
                                                    <ul>
                                                        {/*<ActorList course={item}/>
                                                        <EventList course={item}/>
                                                        <ResourceList course={item}/>*/}
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
            </div>
        )
    }
    loadChatWindow(dialogue, event) {

        NProgress.start({position: 'middle'});
        let self = this;
        let currentChatDialogue = {
            currentChatDialogueDetail: {
                'course_node_id': dialogue.course_node_id,
                'dialogue_node_id': dialogue.dialogue_node_id,
                dialogue_status: 1
            },
            change_chat_view: dialogue.dialogue_node_id,
            clear_chat_items: true
        };
        $.ajax({
            url: domainUrl+'menudashboard/statementList',
            data: {'dialogue_instance_node_id': dialogue.dialogue_node_id,'setUserID': window.setUserID, type: 'json'},
            type: 'POST',
            success: function(response) {
                self.props.dispatch(changeChatView(currentChatDialogue));
                response = modifyChatListForSystemGeneratedMessages(response);
                self.props.dispatch(updateChatList(response));
                existingDialogueSelCourse();
                manageDialogueHT();
            }
        });

    }

    goToCourse(course_node_id,event) {
        console.log('goToCourse');
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        NProgress.start({position: 'middle'});
        let self = this;

        let data = {
            'setUserID' : window.setUserID,
            'view_type' : 'bycourse',
            'expand_course_node_id' : course_node_id,
            'type' : 'json'
        }


        $.ajax({
            url: domainUrl + 'menudashboard/index',
            data: data,
            type: 'POST',
            success: function (response) {
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                self.props.dispatch(updateCourseList({response: {}}));
                self.props.dispatch(updateCourseList({response: response}));
                $(".nano").nanoScroller();
                NProgress.done();
            }
        });

    }


    /*getActorsShortName(actors) {
        var keys = Object.keys(actors);
        if(!keys.length) {
            return 'N/A';
        }
        let names = keys.filter(function(key) {
            if(actors[key].has_removed) {
                return false;
            }
            return true;
        }).map(function(key) {
            let name = actors[key];
            return ((name.first_name.charAt(0)) + (name.last_name.charAt(0))).toUpperCase();
        });
        return names.join(', ');
    }*/

    getUserProfileUrl(actors){

        var keys = Object.keys(actors);
        if(!keys.length) {
            return null;
        }
        let url = [];
        for(let i=0; i<keys.length; i ++ ){
            url.push(actors[keys[i]].profile_image);
            if(i == 5){
                break;
            }
        }
        return url;
    }
    componentDidMount() {
        $('.loadder').hide();
        this.removeTooltip();

        let {items} = this.props;

        if(typeof items == 'string') {
            items = JSON.parse(items);
        }
        this.has_chat_window_loaded = false;

        if(items.status == 0) {
            NProgress.done();
        } else {
            let keys = Object.keys(items), first_dialogue_index = 0;
            if(keys.length) {
                first_dialogue_index = keys[0];
                this.loadChatWindow(items[first_dialogue_index]);
            }
        }
    }
    componentDidUpdate() {
        this.removeTooltip();
    }
    removeTooltip() {
        $(".tooltip").remove();
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.courseList,
        currentChatDialogueDetail: state.currentChatDialogueDetail
    }
}
const ConnectedListByDialogue = connect(mapStateToProps)(ListByDialogue);

export default ConnectedListByDialogue;
