import React from 'react';
import UserList from './user_list';

import {connect} from 'react-redux';
import {
    rolesList,
    addRoleList,
    removeAddedRole,
    actorsList,
    updateGroupActorList,
    updateGroupRoleList,
    updateGroupList,
    removeRoleFromGroup,
    removeActorFromGroup
} from '../../../actions/actions';
import NoRecordFound from '../../no_record_found';

class GroupDetail extends React.Component {

    render() {
        let {currentGroup, groupForm} = this.props;
        if (!currentGroup) {
            //return <NoRecordFound msg='No Record Found.'/>
            return null;
        }
        if (groupForm == 'add_group_form') {
            return this.getAddForm(0)
        }
        if (groupForm == 'edit_group_form') {
            return this.getAddForm(1);
        }

        return this.getDetails()


    }

    getAddForm(isEdit = 0) {

        return (
            <div className="flex-item half-pane">
                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm group"></i><span>Groups: Detail</span>
                    </div>
                    <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                </div>
                <div className="detail-pane">
                    <div className="nano paneHT">
                        <div className="nano-content">
                            <div className="view-course-pane">
                                <div className="panel-group" id="group-add" role="tablist"
                                     aria-multiselectable="true">
                                    <div className="panel panel-default">
                                        <div className="panel-heading" role="tab">
                                            <h4 className="panel-title">
                                                <a role="button" data-toggle="collapse" data-parent="#group-add1"
                                                   href="#add-group-general1" aria-expanded="true"
                                                   aria-controls="collapseOne">
                                                    <div className="course-col">
                                                            <span className="course-left-pane"><i
                                                                className="icon-sm workflow"></i><span>General</span></span>
                                                        <span className="course-right-pane"><i
                                                            className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="add-group-general2" className="panel-collapse collapse in"
                                             role="tabpanel" aria-labelledby="headingOne">
                                            <div className="panel-body">
                                                <div>
                                                    <form className="group-form"
                                                          onSubmit={e => this.saveGroup.call(this, e)}
                                                          encType="multipart/form-data">
                                                        {this.makeForm(isEdit)}
                                                        <div>
                                                            <button id="groupAddForm" type="submit"
                                                                    className="hide"></button>
                                                        </div>
                                                    </form>

                                                    {/*<div className="prod-list-row">
                                                            <div className="list-col">
                                                                <span>Group Url</span>
                                                            </div>
                                                            <div className="list-col">
                                                                <input type="text" className="form-control input-field"/>
                                                            </div>
                                                        </div>
                                                        <div className="prod-list-row">
                                                            <div className="list-col">
                                                                <span>Logo</span>
                                                            </div>
                                                            <div className="list-col">
                                                                <input type="file" className="logo-file filestyle" data-placeholder="Choose File" />
                                                            </div>
                                                        </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getErrorTag(text) {
        return <p className="error-msg-txt hide">{text}</p>
    }

    saveGroup(event) {
        event.preventDefault();
        var form = $(event.target), self = this;
        var fields = form.find('input[data-input]');
        form.find('.error-msg-txt').addClass('hide');
        var postData = {};

        fields.each(function () {
            var _this = $(this);
            var name = _this.attr('name'), property = _this.attr('data-input');

            if (name == 'group') {
                if ($.trim(_this.val()) == '') {
                    _this.next().removeClass('hide');
                } else {
                    postData[property] = $.trim(_this.val())
                }
            }
            if (name == 'group_actor') {
                if ($.trim(_this.val()) != '') {
                    postData[property] = $.trim(_this.val())
                }
            }
        });
        console.log(postData);
        if (!form.find('.error-msg-txt:visible').length) {
            NProgress.start({position: 'full'});
            let data = {group_class_id: 861, type: 'organizations', data: postData};
            let {groupForm} = this.props;
            if (groupForm == 'edit_group_form') {
                let {groupList, currentGroup} = this.props;
                let currentGroupList = groupList[currentGroup['group_node_id']];
                data.group_instance_id = currentGroupList.node_instance_id;
                data.group_instance_node_id = currentGroupList.node_id;
            }
            $.ajax({
                type: 'POST',
                url: domainUrl + "group/saveOrganizationRoleAndGroup",
                data: data,
                success: function (data) {
                    let newGroup = {
                        groups: JSON.parse(data),
                        updateList: 1
                    }
                    if (groupForm == 'edit_group_form') {
                        newGroup.updateForm = 1;
                    }
                    self.props.dispatch(updateGroupList(newGroup));
                    NProgress.done();
                }
            });
        }
    }

    makeForm(isEdit = 0) {
        let errMsg = 'Please enter ';
        let {groupFormFields} = this.props;
        let currentGroupList;
        if (!groupFormFields) {
            return true;
        }
        if (isEdit) {
            let {groupList, currentGroup} = this.props;
            currentGroupList = groupList[currentGroup['group_node_id']];
        }
        return Object.keys(groupFormFields).map(index => {
            let formField = groupFormFields[index];
            let className = 'prod-list-row';
            if (formField.hidden) {
                className += ' hide';
            }
            let value = formField.value;
            if (currentGroupList && !value) {
                value = currentGroupList[formField.name]
            }

            return (
                <div key={index} className={className}>
                    <div className="list-col">
                        <span>{formField.label}</span>
                    </div>
                    <div className="list-col">
                        <input data-input={formField.property} name={formField.name} defaultValue={value}
                               placeholder={formField.placeholder}
                               type="text" className="form-control input-field"/>
                        {this.getErrorTag(errMsg + formField.placeholder)}
                    </div>
                </div>

            )
        });

    }

    getDetails() {
        let {groupList, currentGroup} = this.props;
        let currentDetails = groupList[currentGroup.group_node_id];
        if (!currentDetails) {
            return (
                <div className="flex-item half-pane">
                    <div className="flex-head clearfix">
                        <div className="left detail-title"><i className="icon-sm group"></i><span>Groups: Detail</span>
                        </div>
                        <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                    </div>
                    <div className="detail-pane">
                        <div className="list-detail"></div>
                    </div>
                </div>
            )
        }
        return (
            <div className="flex-item half-pane">
                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm group"></i><span>Groups: Detail</span>
                    </div>
                    <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                </div>
                <div className="detail-pane">
                    <div className="nano paneHT">
                        <div className="nano-content">
                            <div className="view-course-pane">
                                <div className="panel-group" id="group-view" role="tablist"
                                     aria-multiselectable="true">

                                    <div className="panel panel-default">
                                        <div className="panel-heading" role="tab">
                                            <h4 className="panel-title">
                                                <a role="button" data-toggle="collapse" data-parent="#group-view1"
                                                   href="#group-general" aria-expanded="true"
                                                   aria-controls="collapseOne">
                                                    <div className="course-col">
                                                            <span className="course-left-pane"><i
                                                                className="icon-sm workflow"></i><span>General</span></span>
                                                        <span className="course-right-pane"><i
                                                            className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="group-general" className="panel-collapse collapse" role="tabpanel"
                                             aria-labelledby="headingOne">
                                            <div className="panel-body">
                                                <div>
                                                    <div className="prod-list-row">
                                                        <div className="list-col">
                                                            <span>Group Name</span>
                                                        </div>
                                                        <div className="list-col">
                                                            <span>{currentDetails.group}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="panel panel-default">
                                        <div className="panel-heading" role="tab">
                                            <h4 className="panel-title">
                                                <a role="button" data-toggle="collapse" data-parent="#group-view1"
                                                   href="#group-role" aria-expanded="true"
                                                   aria-controls="collapseOne">
                                                    <div className="course-col">
                                                            <span className="course-left-pane"><i
                                                                className="icon-sm roles-white"></i><span>Roles</span></span>
                                                        <span className="course-right-pane"><i
                                                            className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="group-role" className="panel-collapse collapse" role="tabpanel"
                                             aria-labelledby="headingOne1">
                                            <div className="panel-body">
                                                <div>
                                                    <div>
                                                        {this.addRole()}
                                                    </div>
                                                    <div className="actor-wrap-list">
                                                        {this.getRoles(currentDetails.roles)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="panel panel-default">
                                        <div className="panel-heading" role="tab">
                                            <h4 className="panel-title">
                                                <a role="button" data-toggle="collapse" data-parent="#group-view1"
                                                   href="#group-actor" aria-expanded="true"
                                                   aria-controls="collapseOne1">
                                                    <div className="course-col">
                                                            <span className="course-left-pane"><i
                                                                className="icon-sm actor-white"></i><span>Actors</span></span>
                                                        <span className="course-right-pane"><i
                                                            className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="group-actor" className="panel-collapse collapse" role="tabpanel"
                                             aria-labelledby="headingOne1">
                                            <div className="panel-body">
                                                <div>
                                                    <div>
                                                        {this.addActor()}
                                                    </div>
                                                    <div className="actor-wrap-list">

                                                        {this.getActorList()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getActorList() {
        let actorsList = this.props.actorsList;
        if (!actorsList) {
            return true;
        }
        let {currentGroup, groupList} = this.props;
        if (!currentGroup) {
            return true;
        }
        let currentGroupList = groupList[currentGroup['group_node_id']];
        let actors = currentGroupList['actors'];
        if (!actors) {
            return true;
        }
        return Object.keys(actors).map(index => {
            let actor = actorsList[index];
            return (
                <div className="flex-main" key={index}>
                    <UserList group_node_id={currentGroup['group_node_id']} app_list={currentGroupList.app_list} user_id={index} actor={actor} actor_app_id={actors[index].app_ids}/>

                </div>
            )
        })

    }

    removeActor(userId) {
        if (!userId) {
            return true;
        }
        let self = this;
        let {currentGroup, groupList} = self.props;
        if (!currentGroup) {
            return true;
        }
        let currentGroupList = groupList[currentGroup['group_node_id']];
        let data = {
            action: 'Remove Actor',
            group_node_id: currentGroupList.node_id,
            user_id: userId,
        };
        $.ajax({
                type: 'POST',
                url: domainUrl + "group/removeGroupActor",
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    if (!data.user_id) {
                        return true;
                    }
                    let res = {
                        actor_id: data.user_id,
                        group_node_id: data.group_node_id,
                    }
                    self.props.dispatch(removeActorFromGroup(res));
                }
            }
        );

    }

    addActor() {
        return (
            <span>
                <div className="flex-row">
                      <span className="flex-col">
                          <input id="actors_list" type="text" onKeyDown={this.addActorOnPressEnter.bind(this)}
                                 className="form-control input-field" ref="actorName"/>
                      </span>
                    <span onClick={this.selectActor.bind(this)}>
                        <button type="button" className="btn  btn-dark-blue flex-col">ADD</button>
                    </span>
                </div>
                <div id="actorAutoCompleteBox" className="clearfix">
                </div>
            </span>
        )
    }

    addActorOnPressEnter(event) {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($keycode == 13 && !event.shiftKey) {
            event.preventDefault();
            this.selectActor();
        }
    }

    selectActor() {
        let self = this;
        let actorName = this.refs.actorName.value;
        if (actorName == '') {
            bootbox.alert({
                title: 'Alert',
                message: 'Please select Actor.'
            });
            return true;
        }
        let actorsList = this.props.actorsList;
        let addNewActor = 0;
        let actorId;
        for (const key of Object.keys(actorsList)) {
            if (actorsList[key].email_address == actorName) {
                this.refs.actorName.value = '';
                addNewActor = 1;
                actorId = key;
                break;
            }
        }
        if (addNewActor) {
            let {groupList, currentGroup} = this.props;

            if (!currentGroup) {
                return true;
            }
            let currentDetails = groupList[currentGroup.group_node_id];
            let data = {
                group_id: currentGroup['group_node_id'],
                user_ids: actorId,
                type: 'users',
                group_name: currentDetails.group,
                first_name: actorsList[actorId].first_name,
                last_name: actorsList[actorId].last_name,
                email_address: actorsList[actorId].email_address,
                profile_image: actorsList[actorId].profile_image
            };
            NProgress.start({position: 'full'});
            $.ajax({
                type: 'POST',
                url: domainUrl + "group/saveOrganizationRoleAndGroup",
                data: data,
                success: function (data) {
                    self.props.dispatch(updateGroupActorList({[actorId]: {actor_id: actorId, app_ids: {}}}));
                    NProgress.done();
                }
            });

        } else {
            alert('Select Email Id');
        }
    }

    getRoles(roles) {
        if (!roles) {
            return true;
        }
        return Object.keys(roles).map(index => {
            let role = roles[index];
            return (
                <div key={index} className="flex-row">
                    <span className="flex-col">{role.role}</span>
                    {/*<span className="flex-col icon-sm close-black" onClick={this.removeRole.bind(this, index)}></span>*/}
                </div>
            )

        });
    }

    removeRole(roleId) {
        if (!roleId) {
            return true;
        }

        let self = this;
        let {currentGroup, groupList} = self.props;
        if (!currentGroup) {
            return true;
        }
        let currentGroupList = groupList[currentGroup['group_node_id']];
        let data = {
            action: 'Remove Role',
            relation_id: currentGroupList.roles[roleId].node_x_y_relation_id,
            role_id: roleId,
            group_node_id: currentGroupList.node_id,
            user_id: window.setUserID,
        };
        $.ajax({
                type: 'POST',
                url: domainUrl + "group/removeRelation",
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    if (!data.role_id) {
                        return true;
                    }
                    let res = {
                        group_node_id: data.group_node_id,
                        role_id: data.role_id,
                    }
                    self.props.dispatch(removeRoleFromGroup(res));
                }
            }
        );

    }

    addRole() {
        return (
            <div>
                <div className="flex-row">
                    <span className="flex-col">
                        <input id="roles_list" type="text" className="form-control input-field" ref="groupName" onKeyDown={this.addRoleOnPressEnter.bind(this)} />
                    </span>
                    <span onClick={this.selectRole.bind(this)}>
                        <button type="button" className="btn  btn-dark-blue flex-col">ADD</button>
                    </span>
                </div>
                <div id="groupAutoCompleteBox" className="clearfix">
                </div>
            </div>
        )
    }


    addRoleOnPressEnter(event) {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($keycode == 13 && !event.shiftKey) {
            event.preventDefault();
            this.selectRole();
        }
    }

    selectRole() {
        let roleName = this.refs.groupName.value;
        if (roleName == '') {
            bootbox.alert({
                title: 'Alert',
                message: 'Please select role.'
            });
            return true;
        }
        let rolesList = this.props.rolesList;
        let addNewRole = 1;
        let roleId;
        for (const key of Object.keys(rolesList)) {
            if (rolesList[key].role == roleName) {
                /*let addedRole = {[key]: rolesList[key]};
                this.props.dispatch(updateGroupRoleList(addedRole));
                this.props.dispatch(addRoleList(addedRole));
                this.refs.groupName.value = '';
                addNewRole = 0;*/
                roleId = key;
                break;
            }
        }
        if (addNewRole) {
            //this.addNewRole(roleName);
            this.refs.groupName.value = '';
            let self = this;
            let {addRoleList, currentGroup, groupList} = this.props;
            if (!currentGroup) {
                return true;
            }
            let currentGroupList = groupList[currentGroup['group_node_id']];
            let data = {
                action: 'Add Role',
                type: 'roles',
                role_ids: roleId,
                group_instance_id: currentGroupList.node_instance_id,
                group_node_id: currentGroupList.node_id,
                user_id: window.setUserID,
                role_name: roleName
            };
            NProgress.start({position: 'full'});
            $.ajax({
                    type: 'POST',
                    url: domainUrl + "group/saveOrganizationRoleAndGroup",
                    data: data,
                    success: function (data) {
                        data = JSON.parse(data);
                        if (!data.role_id) {
                            return true;
                        }
                        let addedRole = {
                            [data.role_id]: {
                                node_x_id: data.role_id,
                                role: roleName,
                                node_x_y_relation_id: data.node_x_y_relation_id
                            }
                        };
                        self.props.dispatch(updateGroupRoleList(addedRole));
                        NProgress.done();
                    }
                }
            );
        }


    }

    addNewRole(roleName) {
        if (roleName == '') {
            return true;
        }
        let self = this;
        $.ajax({
            type: 'POST',
            url: domainUrl + "group/addRole",
            data: {'role_name': roleName},
            success: function (data) {
                data = JSON.parse(data);
                if (!data.role_id) {
                    return true;
                }
                self.props.dispatch(rolesList({[data.role_id]: {role_id: data.role_id, role: roleName}}));
                self.props.dispatch(addRoleList({[data.role_id]: {role_id: data.role_id, role: roleName}}));
            }
        });
    }

    componentDidMount() {
        let self = this;
        $.ajax({
            type: 'POST',
            url: domainUrl + "menudashboard/getAllUsers",
            data: {is_group: 'Y'},
            success: function (data) {
                self.props.dispatch(actorsList(JSON.parse(data)));
            }
        });

        $.ajax({
            type: 'POST',
            url: domainUrl + "group/getAllRoles",
            data: {},
            success: function (data) {
                self.props.dispatch(rolesList(JSON.parse(data)));
            }
        });

    }

    componentDidUpdate() {
        $(".nano").nanoScroller();
        this.bindAutoSuggest();
        this.bindActorAutoSuggest();
    }

    bindAutoSuggest() {
        let rolesList = this.props.rolesList;
        if (!rolesList) {
            return true;
        }
        let roles = [];
        Object.keys(rolesList).map(index => {
            let role = rolesList[index];
            roles.push({key: role['role_id'], value: role['role']});
        });
        let self = this;
        $('#roles_list').autocomplete({
            appendTo: "#groupAutoCompleteBox",
            lookup: roles,
            width: '80%',
            onSelect: function (suggestion) {
                //self.selectRole();
            },
            forceFixPosition: 'auto',
            orientation: 'bottom'
        });
    }

    bindActorAutoSuggest() {
        let actorsList = this.props.actorsList;
        if (!actorsList) {
            return true;
        }
        let actors = [];
        let currentGroupList;
        let currentActors = [];
        let {currentGroup, groupList} = this.props;
        if (currentGroup) {
            currentGroupList = groupList[currentGroup['group_node_id']];
            currentActors = Object.keys(currentGroupList['actors']);
        }


        Object.keys(actorsList).map(index => {
            if(jQuery.inArray(index.toString(), currentActors) == -1){
                let actor = actorsList[index];
                actors.push({key: actor['node_id'], value: actor['email_address']});
            }

        });
        let self = this;
        $('#actors_list').autocomplete({
            appendTo: "#actorAutoCompleteBox",
            lookup: actors,
            width: '80%',
            onSelect: function (suggestion) {
                //self.selectRole();
            },
            forceFixPosition: 'auto',
            orientation: 'bottom'
        });
    }

    showRole() {
        let addRoleList = this.props.addRoleList;
        if (!addRoleList) {
            return true;
        }
        return Object.keys(addRoleList).map(index => {
            let roleName = addRoleList[index].role;
            return (
                <div key={index} className="user-temp">
                    <span className="name">{roleName}</span>
                    {/*<span className="close-sm" onClick={this.removeAddRole.bind(this, index)}><i
                        className="icon close"></i></span>*/}
                </div>

            )
        });

    }

    removeAddRole(index) {
        this.props.dispatch(removeAddedRole(index));
    }

}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList,
        currentGroup: state.currentGroup,
        groupForm: state.groupForm,
        groupFormFields: state.groupFormFields,
        rolesList: state.rolesList,
        addRoleList: state.addRoleList,
        actorsList: state.actorsList,
    }
}

const ConnectedGroupDetail = connect(mapStateToProps)(GroupDetail);
export default ConnectedGroupDetail;
