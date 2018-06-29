import React from 'react';
import {connect} from 'react-redux';

class DataImg extends React.Component {
    render(){
        return (
            <div className="flex-item">
                <div className="main-bg-wrap" id="Data">
                    <div className="nano paneHT">
                        <div className="nano-content">
                            <img src="public/img/data-screen.jpg" />
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

export default DataImg;