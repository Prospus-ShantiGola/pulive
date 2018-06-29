import React from 'react';
import {connect} from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <header className="header">
                <div className='top-header clearfix'>
                    <div className='top-header-left left'>
                        <ul>
                            <li><a><div className="logo"><img src="public/img/prospus-white-logo.png" alt="logo" /></div></a></li>
                            <li><a>Prospus . Guest</a></li>
                        </ul>
                    </div>
                    <div className='top-header-right right'>
                        {
                            this.getLoginTmpl()
                        }
                    </div>
                </div>
            </header>
        )
    }
    getLoginTmpl() {
        if(typeof window.setUserID =='undefined' || window.setUserID == '') { // user is not logged in
            return this.getBeforeLoginTmpl();
        }
        return this.getAfterLoginTmpl();
    }
    getLoginTmplForGuest() {
        return (
            <ul>
                <li><a className="" href="#register"><div className="user-icon"><img src={window.profileImage}/></div></a></li>
            </ul>
        )
    }
    getBeforeLoginTmpl() {
        return (
            <ul>
                <li><a className="signup-col" href="#login"><i className="icon-sm user-dp"></i><span>LOGIN/REGISTER</span></a></li>
            </ul>
        )
    }
    getClickableProfileTmpl() {
        if(this.props.user_type == 'guest') {
            return this.getLoginTmplForGuest();
        }
        return (
            <div className="user-action dropdown ">
                <a data-toggle="dropdown" href="javascript:void(0);">
                    <div className="user-icon">
                        {window.profileImage ? <img src={window.profileImage}/> : <span className="initials-box">{window.initialName}</span>}
                    </div>
                </a>
                <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                    <li className=""><a href="javascript:void(0)" className="logout-hidden logout-class logout-user-all">Logout</a></li>
                    <li className="inactive"><a href="javascript:void(0)" className="">Settings</a></li>
                </ul>
            </div>
        )
    }
    getAfterLoginTmpl() {
        let notificationCounter = 'notification-counter notification-counter-js';
        if(!this.props.header_notification_count){
            notificationCounter += ' hide';
        }
        return (
            <ul>
                <li className="inactive"><a><i className="icon-sm search-white"></i></a></li>
                <li className="notification-js">
                    <a id="courseNotification"><i className="icon-sm notification-white"></i>
                    <i className={notificationCounter}>{this.props.header_notification_count}</i>
                    </a>
                </li>
                <li className="inactive"><a><i className="icon-sm dialogue-white"></i></a></li>
                <li>
                    <div className="login-box">
                        <div className="links-box">
                            {this.getClickableProfileTmpl()}
                        </div>
                    </div>
                </li>
            </ul>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        header_notification_count : state.header_notification_count,
        is_user_logged_in: state.is_user_logged_in,
        user_type: state.user_type
    }
}

const ConnectedHeader = connect(mapStateToProps)(Header);
export default ConnectedHeader;
