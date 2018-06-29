import React from 'react';
import HeaderNotification from './header_notification';

import {changePageName} from '../actions/actions';

class NotFound extends React.Component {

    render() {
        return (
            <div className="flex-item">
                <div className="page-no-found"><img src="public/img/Page-not-found.png"/></div>
            </div>
        )
    }
    componentDidMount() {
        NProgress.done();
        $("#course_action_menu").find('a').addClass('hide');
    }
    componentWillUnmount() {
        NProgress.start({position: 'full'});
    }
}
export default NotFound;
