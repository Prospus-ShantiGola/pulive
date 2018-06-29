import React from 'react';
import RightPanelActionButton from './right_panel_action_button';
class RightActionBar extends React.Component {
    render() {
        return (
            <div className="flex-item right-action-bar">
                <div id="dashboard-action-bar" className="flex-item">
                    <RightPanelActionButton />                    
                </div>
            </div>
        )
    }
}
export default RightActionBar;
