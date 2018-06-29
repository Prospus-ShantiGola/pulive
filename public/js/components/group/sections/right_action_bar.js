import React from 'react';
import {connect} from 'react-redux';
import {groupForm} from '../../../actions/actions';

class RightActionBar extends React.Component {
    render() {
        let {groupForm} = this.props;
        if (groupForm == 'add_group_form' || groupForm == 'edit_group_form') {
            return this.getAddFormAction();
        }
        if (groupForm == 'add_role') {
            return this.getAddRoleAction();
        }
        return this.getDefaultAction();
    }

    getDefaultAction() {
        let {currentGroup} = this.props;
        if (!currentGroup) {
            return null;
        }
        let groupList = this.props.groupList;
        if(!Object.keys(groupList).length){
            return null;
        }
        return (
            <div className="flex-item right-action-bar">
                <div id="dashboard-action-bar" className="flex-item">
                    <ul>
                        <li onClick={this.editForm.bind(this)}><a href="javascript:void(0)"><i className="icon edit"></i><span>Edit</span></a></li>
                    </ul>
                </div>
            </div>
        )
    }

    getAddFormAction() {
        return (
            <div className="flex-item right-action-bar">
                <div id="dashboard-action-bar" className="flex-item">
                    <ul>
                        <li onClick={this.submitForm.bind(this)}><a href="javascript:void(0)"><i
                            className="icon publish"></i><span>Save</span></a></li>
                        {this.getCancelButton()}
                    </ul>
                </div>
            </div>
        )
    }

    getCancelButton() {
        return <li onClick={this.cancelAddForm.bind(this)}><a href="javascript:void(0)"><i
            className="icon cancel"></i><span>Cancel</span></a></li>
    }

    submitForm() {
        $('#groupAddForm').trigger('click')
    }

    cancelAddForm() {
        this.props.dispatch(groupForm(''));
    }

    editForm() {
        this.props.dispatch(groupForm('edit_group_form'));
    }


}

const mapStateToProps = (state) => {
    return {
        groupForm: state.groupForm,
        currentGroup: state.currentGroup,
        addRoleList: state.addRoleList,
        groupList: state.groupList,
    }
}

const ConnectedRightActionBar = connect(mapStateToProps)(RightActionBar);
export default ConnectedRightActionBar;