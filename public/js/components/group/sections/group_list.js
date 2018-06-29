import React from 'react';
import {connect} from 'react-redux';
import NoRecordFound from '../../no_record_found';
import {inactiveActionMenuAccordingly} from '../../functions/common_functions';
class GroupList extends React.Component {
    render() {
        let {groupForm} = this.props;
        let untitled = 0;
        if(groupForm == 'add_group_form'){
            untitled = 1;
        }
        return (
            <div className="flex-item half-pane">
                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm group"></i><span>Groups: List</span></div>
                    <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                </div>
                <div className="detail-pane">
                    <div className="list-detail">
                        <div className="nano paneHT">
                            <div className="nano-content">
                                <ul className="list-item">
                                    {(untitled) ? <li className='current'>Untitled</li> :''}
                                    {this.getList(untitled)}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    getList(untitled) {
        let {groupList} = this.props;
        if (!groupList) {
            return true;
        }
        if (typeof groupList == 'string') {
            groupList = JSON.parse(groupList);
        } else {
            groupList = JSON.parse(JSON.stringify(groupList));
        }
        if(!Object.keys(groupList).length && !untitled){
            return <NoRecordFound msg='No Record Found.'/>
        }

        return Object.keys(groupList).map((key,index) => {
            inactiveActionMenuAccordingly('Add Group');
            let list = groupList[key];
            let currentCls;
            if(index == 0 && untitled == 0){
                currentCls = 'current';
            }

            return (
                <li key={key} className={currentCls}>{list.group}</li>
            )

        });
    }
}

const mapStateToProps = (state) => {
    return {
        groupList: state.groupList,
        groupForm: state.groupForm
    }
}

const ConnectedGroupList = connect(mapStateToProps)(GroupList);
export default ConnectedGroupList;