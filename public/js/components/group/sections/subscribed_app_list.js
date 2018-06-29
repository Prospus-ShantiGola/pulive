import React from 'react';
import {connect} from 'react-redux';
import {actorsApp} from '../../../actions/actions';


class SubscribedAppList extends React.Component {
    render() {
        return (
            <div className="flex-row flex-template-list">
                <table className="table table-row custom-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Can Initiate</th>
                        <th></th>
                        <th></th>
                        <th>{(this.props.user_id != window.setUserID) ?
                            <span className="save-subscription"><button type="button"
                                                                        className="btn  btn-dark-blue flex-col"
                                                                        onClick={this.saveAppList.bind(this, this.props.user_id)}>Save</button></span> : ''}</th>
                    </tr>
                    </thead>
                    <tbody>{this.getAppList()}</tbody>
                </table>
            </div>
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
    getAppList() {
        let app_list = this.props.app_list;
        let actor_app_id = this.props.actor_app_id;
        let curUserId = this.props.user_id;
        return Object.keys(app_list).map(index => {
            let appList = app_list[index];
            let checked;
            let disabled;
            if (window.setUserID == curUserId) {
                disabled = 'disabled';
            }
            if (Object.keys(actor_app_id).length) {
                Object.keys(actor_app_id).map(key => {
                    let actorApp = actor_app_id[key];
                    if (actorApp == appList.app_id) {
                        checked = 'checked';
                    }
                })
            }

            return (
                <tr key={index}>
                    <td>{appList.app_name}</td>
                    <td>
                        <div className=""><input type="checkbox" name={'actor_' + curUserId} disabled={disabled}
                                                 checked={checked}
                                                 value={appList.app_id}
                                                 onChange={(e) => this.handleInputChange(e, appList.app_id, curUserId)}/>
                        </div>
                    </td>
                    <td>
                        <div className=""><input type="checkbox" disabled/></div>
                    </td>
                    <td>
                        <div className=""><input type="checkbox" disabled/></div>
                    </td>
                    <td>
                        <div className=""><input type="checkbox" disabled/></div>
                    </td>
                </tr>
            )
        });
    }

    handleInputChange(event, app_id, user_id) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        //const name = target.name;
        let data = {};
        if (value) {
            // checked update store
            data = {
                action: 'add',
                actorApp: {[app_id]: app_id},
                actor_id: user_id,
                group_node_id: this.props.group_node_id
            }
        } else {
            data = {
                action: 'remove',
                actorApp: app_id,
                actor_id: user_id,
                group_node_id: this.props.group_node_id
            }
        }
        this.props.dispatch(actorsApp(data));

    }
}

const mapStateToProps = (state) => {
    return {}
}

const ConnectedSubscribedAppList = connect(mapStateToProps)(SubscribedAppList);
export default ConnectedSubscribedAppList;
