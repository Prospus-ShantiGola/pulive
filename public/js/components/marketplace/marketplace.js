import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Banner from './sections/banner';
import List from './sections/list';
// import Flyout from '../flyout';
import HeaderNotification from '../header_notification';
import RightActionBar from './right_action_bar';
import {changePageName} from '../../actions/actions';
import Modal from './sections/modal';
import SubscribeGroupPopup from './subscribe_group';

class Marketplace extends React.Component {

    render() {
        return (
            <div className="flex-item">
                <div id="marketplace" className="marketplace-wrapper flex-item">
                    <div className="nano paneHT">
                        <div className="nano-content">
                        <div>
                            <List />
                            <Modal />
                        </div>
                    </div>
                    </div>
                </div>
                <RightActionBar />

                <SubscribeGroupPopup />
            </div>
        )
    }
    componentDidMount() {
        $("#nav, #courseTemplateFlyout").removeClass('in');
        $("#course_action_menu").find('a').addClass('hide');
        // let navigationPane = $('#navigationPane');
        // if(navigationPane.find('li.active').length > 1) {
        //     navigationPane.find('li.active:first').removeClass('active');
        // }
        let params = {page_name: 'store', currentChatDialogueDetail: {}, changeChatView: 0};
        this.props.dispatch(changePageName(params));
        applyScroller();
        NProgress.done();
    }
    componentWillUnmount() {
        NProgress.start({position: 'full'});
    }
}

const mapStateToProps = (state) => {
    return {
        page_name: state.page_name,
        currentChatDialogueDetail: state.currentChatDialogueDetail
    }
}
const ConnectedMarketplace = withRouter(connect(mapStateToProps)(Marketplace));
export default ConnectedMarketplace;
