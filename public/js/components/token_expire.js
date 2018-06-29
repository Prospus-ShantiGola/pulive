import React from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {getRedirectLink} from './functions/common_functions';
class Tokenexpire extends React.Component {

    render() {
        let {invalid} = this.props;
        return (
            <div className="flex-container">
                <div className="flex-item">
                    <div className="token_Pane">
                        <div className="token_wrap">
                            <div className="modal-header">
                                <h4 className="modal-title">{invalid.title}</h4>
                            </div>
                            <div className="token_body">
                                <h5>{invalid.msg}</h5>
                                Go to <button className="btn btn-dark-blue" onClick={this.redirect}>Home</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    componentDidMount() {
        NProgress.done();
    }
    componentWillUnmount() {
        NProgress.start({position: 'full'});
    }
    redirect() {
        let redirectUrl = window.location.origin + getRedirectLink('inbox');
        window.location.href = redirectUrl;
    }
}
const mapStateToProps = (state) => {
    return {
        page_name: state.page_name,
        invalid: state.invalid
    }
}

const ConnectedTokenexpire = withRouter(connect(mapStateToProps)(Tokenexpire));
export default ConnectedTokenexpire;
