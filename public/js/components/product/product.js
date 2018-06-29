import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {changePageName} from '../../actions/actions';
class Product extends React.Component {
    render(){
        return (
            <div className="flex-item">
                <div className="main-bg-wrap" id="Product">
                    <div className="nano paneHT">
                        <div className="nano-content">
                            <img src="public/img/product-screen.jpg" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.props.dispatch(changePageName({page_name: 'product'}));
        $(".nano").nanoScroller();
        NProgress.done();
    }
}
const mapStateToProps = (state) => {
    return {}
}

const ConnectedProduct = withRouter(connect(mapStateToProps)(Product));
export default ConnectedProduct;
