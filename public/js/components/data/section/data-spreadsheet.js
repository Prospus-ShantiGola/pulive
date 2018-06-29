import React from 'react';
import {connect} from 'react-redux';

class DataSpreadsheet extends React.Component {
    render(){
        return (
            <div className="flex-item half-pane thirdpart-pane">
                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm group"></i><span>Transaction</span></div>
                    <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                </div>
                <div className="detail-pane">
                    <div className="list-detail"></div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        $(".nano").nanoScroller();
    }
}

export default DataSpreadsheet;