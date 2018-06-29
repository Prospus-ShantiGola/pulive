import React from 'react';
import {appendActorList} from '../../actions/actions';
import { connect } from 'react-redux';
import ShowImage from '../show_image';
import {getCount,highlightSearch} from '../functions/common_functions';

class ActorList extends React.Component {
    render() {
        let {course} = this.props;
        let id = 'actor'+($.trim(course.course_node_id));
        if(this.props.view_type == 'bydialogue') {
            id = 'actor'+($.trim(course.dialogue_node_id));
        }

        // console.log(course);
        return (
            <li className="actor_list_wrapper newDefaultCourseListActor newDefaultCourseList" onClick={this.loadActorList.bind(this, course, id)} id={id}>
                <div className="toggleCourseWrapper">
                    {/*<div className="toggle-courses active"><i className="fa collapse-down fa-angle-up"></i></div>*/}
                    <a className="ref-course-list">
                        <div className="left inline-left-pane"><i className="icon actor"></i><h6 dangerouslySetInnerHTML={{__html: 'Actors' + getCount(this.props.actorCount,'count-list',1)}}></h6></div>
                    </a>
                </div>
                <div className="RightFlyoutOpen add-courses">{/*<i className="icon plus-class inactive"></i>*/}</div>
                <div className="collapsedCourseBox clearfix expandedCourseBox" style={{display: 'none'}}>
                    <ul className="clearfix" ref="actorsList">
                        {
                            this.prepareActorList(course.actors)
                        }
                    </ul>
                </div>
            </li>
        )
    }
    prepareActorList(actors) {

        let self = this;
        if(!Object.keys(actors).length) {
            return null;
        }
        return (
            Object.keys(actors).map(function(key) {
                let actor = actors[key];
                if(!actor) return true;
                let user_name = actor.first_name + ' ' + actor.last_name;
                let initialName = ((actor.first_name.charAt(0)) + (actor.last_name.charAt(0))).toUpperCase()
                if(actor.user_id == window.setUserID) {
                    user_name = 'You';
                }
                // actor.has_removed = 1;
                let inactiveClass = (actor.has_removed == 1) ? 'actors_user_list actor-inactive': 'actors_user_list';
                return (
                    <li className={inactiveClass} key={key}>
                        <div className="actors_box clearfix" onClick={e => {e.stopPropagation();}}>
                            <ShowImage
                                imagesUrl={actor.profile_image}
                                classesName={'img-responsive'}
                                imageWapperClassName={'actors-user-img-sm'}
                                initialName = {initialName}
                            />
                            <div className="actors-user-info">
                                <h2 className="actors-title">{user_name}</h2>
                                <p className="actors-profile-title"></p>
                            </div>
                            <div className="actors-chat-box">
                                <i className="icon open-mini-chat inactive"></i>
                            </div>
                        </div>
                    </li>
                )
            })
        )
    }
    loadActorList(course, id) {
        if(this.props.user_type == 'guest') {
            window.location.hash = '#register';
            return true;
        }
        if(!course) {
            return null;
        }
        let actorListWrapper = $('#menudashboard').find('#'+id), self = this, courseList = this.props.courseList;
        let expandedCourseBox = actorListWrapper.find('.expandedCourseBox');
        let arrowBtn = actorListWrapper.find('.toggleCourseWrapper:first').find('.collapse-down');

        if(expandedCourseBox.is(':visible')) {
            arrowBtn.addClass('fa-angle-up').removeClass('fa-angle-down');
            expandedCourseBox.hide();
        } else {
            arrowBtn.addClass('fa-angle-down').removeClass('fa-angle-up');
            expandedCourseBox.show();
        }

        if(typeof courseList == 'string')  {
            courseList = JSON.parse(courseList);
        }
        if(this.props.view_type == 'bydialogue' || this.props.view_type == 'byactor') {
            return true;
        }
        if(Object.keys(courseList[' ' + $.trim(course.course_node_id)].actors).length) {
            return true;
        }
        NProgress.start({position: 'middle'});
        $.ajax({
            url: domainUrl+'menudashboard/dialogueActorList',
            data: {'course_node_id':course.course_node_id},
            type: 'POST',
            success: function(response) {

                self.props.dispatch(appendActorList({response: response, course_node_id: course.course_node_id}));

                setTimeout(function() {
                    self.forceUpdate();
                    NProgress.done();
                }, 100);
            }
        });
    }
    componentDidUpdate(){
        this.highlightSearch();
    }
    componentDidMount(){
        this.highlightSearch();
    }
    highlightSearch(){
        if (this.props.searchString != '') {
            highlightSearch($(this.refs.actorsList), this.props.searchString)
        }
    }
}

const mapStateToProps = (state) => {
    return {
        chatType: state.chatType,
        courseList: state.courseList,
        view_type: state.view_type,
        user_type: state.user_type,
        searchString: state.searchString
    }
}
const ConnectedActorList = connect(mapStateToProps)(ActorList);
export default ConnectedActorList;
