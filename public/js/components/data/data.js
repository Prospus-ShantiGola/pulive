import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import DataImg from './section/data-img';
import DataList from './section/data-list';
import DataSpreadsheet from './section/data-spreadsheet';
import {changePageName} from '../../actions/actions';
class Data extends React.Component {
    render(){
        return (
            <div className="flex-item">
                <DataImg />
            </div>
        )
    }
    componentDidMount() {
        this.props.dispatch(changePageName({page_name: 'data'}));
        NProgress.done();
    }
}
const mapStateToProps = (state) => {
    return {}
}
const ConnectedData = withRouter(connect(mapStateToProps)(Data));
export default ConnectedData;
