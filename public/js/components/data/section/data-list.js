import React from 'react';
import {connect} from 'react-redux';

class DataList extends React.Component {
    render(){
        return (
            <div className="flex-item half-pane onepart-pane">
                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm course-black"></i><span>Course</span></div>
                    <div className="right detail-action"><i className="icon-sm dot-md"></i></div>
                </div>
                <div className="detail-pane">
                    <div className="list-detail">
                        <div className="nano paneHT">
                            <div className="nano-content">
                            <ul className="list-item">
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="app-icon">
                                        <img src="public/img/transaction.png" />
                                    </span>
                                    <span className="app-name">
                                        <span>Transaction</span>
                                    </span>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        )
    }
    componentDidMount(){
        $(".nano").nanoScroller();       
    }
}

export default DataList;




