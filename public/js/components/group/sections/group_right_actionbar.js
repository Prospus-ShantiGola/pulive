import React from 'react';

class GroupRightActionBar extends React.Component {
    render() {
        return (
            <div className="flex-item right-action-bar">
                <div id="dashboard-action-bar" className="flex-item">
                    <ul>
                        <li><a href="javascript:void(0)"><i className="icon edit"></i><span>Edit</span></a></li>
                        <li><a href="javascript:void(0)"><i className="icon save"></i><span>Save</span></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default GroupRightActionBar;