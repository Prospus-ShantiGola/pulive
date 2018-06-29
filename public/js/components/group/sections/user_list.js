import React from 'react';
import {connect} from 'react-redux';
import SubscribedAppList from './subscribed_app_list';
import {actorsApp} from '../../../actions/actions';

class UserList extends React.Component {
    render() {
        return (
            <div>
                <div className="flex-row showGroupList">
                    <span className="flex-col actors-user-img-sm">
                        {this.getProfileImg()}
                    </span>
                    <span className="flex-col">{this.props.actor.first_name + ' ' + this.props.actor.last_name}</span>
                    {/*(this.props.user_id != setUserID && Object.keys(this.props.app_list).length) ?
                        <span className="save-subscription"><button type="button"
                                                                    className="btn  btn-dark-blue flex-col"
                                                                    onClick={this.saveAppList.bind(this, this.props.user_id)}>Save</button></span> : ''*/}

                </div>
                {(Object.keys(this.props.app_list).length) ?
                    <SubscribedAppList group_node_id={this.props.group_node_id} app_list={this.props.app_list}
                                       user_id={this.props.user_id}
                                       actor_app_id={this.props.actor_app_id}/> : ''}

            </div>
        )
    }

    getProfileImg() {
        if (this.props.actor.profile_image) {
            return (
                <img src={this.props.actor.profile_image}/>
            )
        }
        return (
            <span
                className="initials-box">{((this.props.actor.first_name.charAt(0)) + (this.props.actor.last_name.charAt(0))).toUpperCase()}</span>
        )
    }

    saveAppList(user_id) {
        if (!user_id) {
            return true;
        }
        let self = this;
        var actorApp = [];
        let name = 'actor_' + user_id;
        $.each($("input[name='" + name + "']"), function () {
                if ($(this).is(':checked')) {
                    actorApp.push($(this).val());
                }
            }
        )
        //if (actorApp.length) {
        let data = {
            user_id: user_id,
            app_ids: actorApp.join(','),
            group_id: this.props.group_node_id
        }
        NProgress.start({position: 'full'});
        $.ajax({
                type: 'POST',
                url: domainUrl + "group/setGroupApplicationToActor",
                data: data,
                success: function (data) {
                    NProgress.done();
                    // self.props.dispatch(actorsApp({
                    //     actorApp: Object.assign({}, actorApp),
                    //     actor_id: user_id,
                    //     group_node_id: self.props.group_node_id
                    // }));
                }
            }
        );


        //}

    }

    componentDidMount() {
        $(".showGroupList").off('click').on('click', function () {
            if( $(this).siblings(".flex-template-list").hasClass("show")){
                $(this).siblings(".flex-template-list").removeClass("show");
            }
            else{ 
                $(".flex-template-list, .save-subscription").removeClass("show");   
                $(this).siblings(".flex-template-list").toggleClass("show");
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {}
}

const ConnectedUserList = connect(mapStateToProps)(UserList);
export default ConnectedUserList;
