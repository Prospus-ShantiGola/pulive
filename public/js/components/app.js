import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Dashboard from './dashboard/dashboard';
// import Marketplace from './marketplace/marketplace';
import Login from './register/login';
import Connection from './connection';
import Header from './header/header';
import MainContainer from './main_container';
import Footer from './footer/footer';
//import Perf from 'react-addons-perf';
//window.Perf = Perf;
import Flyout from './flyout';
import HeaderNotification from './header_notification';
import Tokenexpire from './token_expire';
import {getRedirectLink} from './functions/common_functions';
class App extends React.Component {
    render() {
        let {invalid} = this.props;
        if(invalid && invalid.msg) {
            return this.getFlatLayout()
        }
        return this.getFullLayout()
    }
    getFlatLayout() {
        return (
            <div>
                <Tokenexpire />
            </div>
        )
    }
    getFullLayout() {
        return (
            <div>
                <Header />
                <MainContainer />
                <Footer />
                <Login />
                {(typeof window.setUserID != "undefined") ? <Connection /> : ''}
                <HeaderNotification/>
                <Flyout/>
            </div>
        )
    }
    componentDidMount() {
        var popupElement = $('#signin-up-poup'), in_progress = false;
        $(window).on('focus', function() {
            if((typeof window.setUserID != "undefined" && window.setUserID != '') && !popupElement.is(':visible') && !in_progress) {
                in_progress = true;
                $.ajax({
                    url: domainUrl + 'login/checkUserLogedin',
                    type: 'post',
                    data: {email: window.session_file_name},
                    success: function(response) {
                        in_progress = false;
                        if(typeof response == 'string') {
                            response = $.parseJSON(response);
                        }
                        if(response.is_logedin == '0') {
                            console.log(in_progress);
                            window.location.reload(false);
                            // let storeUrl = getRedirectLink('store');
                            // window.location.href = storeUrl+'#login';
                            // window.setUsername  = undefined;
                            // window.setUserID   = undefined;
                            // window.session_file_name = undefined;
                            // window.firstName = undefined;
                            // window.lastName = undefined;
                            // window.initialName = undefined;
                            // window.profileImage = 0;
                            // window.location.hash = '#login';
                            // var hash = 'login';
                            //
                            // var tabs = popupElement.find('.nav-tabs').find('li');
                            // tabs.removeClass('active');
                            // popupElement.find('.tab-pane').removeClass('active');
                            //
                            // tabs.find('a[href="#' + hash +'"]').parent().addClass('active');
                            // popupElement.find('#' + hash).addClass('active');
                            // popupElement.find('#' + hash).find('#rt-signup-form').removeClass('hide');
                            // popupElement.find('#' + hash).find('#rt-signup-sucess').addClass('hide');
                            // popupElement.addClass('in');
                            // popupElement.find('.modal-header-custom').addClass('hide');
                        }
                    }
                });
            }
        });

        // let {invalid} = this.props;
        // if((typeof setUserID != "undefined" && setUserID != '')) {
        //
        //     let interval = setInterval(function() {
        //         if(typeof window.session_file_name == 'undefined' || window.session_file_name == '') return true;
        //         let hasFocus = checkWindowFocus();
        //         if(hasFocus) {
        //             $.ajax({
        //                 url: domainUrl + 'login/checkUserLogedin',
        //                 type: 'post',
        //                 data: {email: window.session_file_name},
        //                 success: function(response) {
        //                     if(typeof response == 'string') {
        //                         response = $.parseJSON(response);
        //                     }
        //                     if(!response.is_logedin) {
        //                         window.setUsername  = undefined;
        //                         window.setUserID   = undefined;
        //                         window.session_file_name = undefined;
        //                         window.firstName = undefined;
        //                         window.lastName = undefined;
        //                         window.initialName = undefined;
        //                         window.profileImage = 0;
        //                         window.location.hash = '#login';
        //                         var hash = 'login';
        //                         var popupElement = $('#signin-up-poup');
        //                         var tabs = popupElement.find('.nav-tabs').find('li');
        //                         tabs.removeClass('active');
        //                         popupElement.find('.tab-pane').removeClass('active');
        //
        //                         tabs.find('a[href="#' + hash +'"]').parent().addClass('active');
        //                         popupElement.find('#' + hash).addClass('active');
        //                         popupElement.find('#' + hash).find('#rt-signup-form').removeClass('hide');
        //                         popupElement.find('#' + hash).find('#rt-signup-sucess').addClass('hide');
        //                         popupElement.addClass('in');
        //                         popupElement.find('.modal-header-custom').addClass('hide');
        //                     }
        //                 }
        //             });
        //         }
        //     }, 500);
        // }
    }
}

const mapStateToProps = (state) => {
    return {
        page_name: state.page_name,
        invalid: state.invalid
    }
}

const ConnectedApp = withRouter(connect(mapStateToProps)(App));
export default ConnectedApp;
