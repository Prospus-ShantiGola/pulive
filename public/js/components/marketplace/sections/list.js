import React from 'react';
import {connect} from 'react-redux';
import {activeMpApp, subscribeApp, showSubscribedApp} from '../../../actions/actions';
import ShowRating from '../../show_rating';
import {subscribeApplication, getRedirectLink} from '../../functions/common_functions';
import { withRouter, Redirect } from 'react-router-dom'

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect_to_inbox: 0
        };
    }
    render() {
        if(this.state.redirect_to_inbox == 1) {
            let redirectLink = getRedirectLink();
            return <Redirect to={redirectLink.inbox}/>
        }
        let {app_list, show_subscribed_app, subscribed_apps} = this.props;
        if(!app_list) {
            return null;
        }
        let self = this, tempText = 'Our Solutions';
        if(show_subscribed_app) {
            tempText = 'My Solutions';
        }
        return (
            <div className="app-list-pane">
               <div className="top-head">{tempText}</div>
               <div className="app-list-row">
                   {
                       this.getAppList()
                   }
               </div>
            </div>
        )
    }
    getAppList() {
        let {app_list, show_subscribed_app, subscribed_apps} = this.props;
        if(typeof app_list == 'string')  {
            app_list = JSON.parse(app_list);
        }
        let self = this;
        if(typeof window.setUserID != 'undefined' && window.setUserID != '') {
            let has_subscribed_app = false;
            if(show_subscribed_app) {
                Object.keys(app_list).map(function(index) {
                    let item = app_list[index];
                    if(item.is_subscribed) {
                        has_subscribed_app = true;
                    }
                });
                if(!has_subscribed_app) {
                    return (
                        <p className="no-found">No App Found.</p>
                    )
                }
            }
        }

        return Object.keys(app_list).map(function(index) {
            let item = app_list[index];
            if(show_subscribed_app && !item.is_subscribed) {
                return null;
            }
            let mainWraperClass = 'app-list-col';
            if(self.props.active_app == index){
                mainWraperClass += ' active';
            }
                return (
                <div className={mainWraperClass} key={index}>
                   <div className="app-left-pane">
                      <span className="app-icon">
                         <img src={item.icon}/>
                      </span>
                      <ShowRating rating={item.rating} />

                   </div>
                   <div className="app-right-pane">
                       <h2><span className="app-title">{item.title1}</span><button className="btn btn-green">Trial Now!</button></h2>
                      <h3>{item.title2}</h3>
                      <p className="paragraph-ellipsis">{item.desc}</p>
                      <div className="app-bottom-pane">
                         <button className="btn btn-blue" data-toggle="modal" data-target="#demo-popup">Demo</button>
                          <button className="btn btn-blue" onClick={self.showDetails.bind(self,index)}>Details</button>
                         {self.getSubscribeBtn(item)}
                      </div>
                   </div>
                </div>
            )
        })
    }
    getSubscribeBtn(item) {
        if(this.props.user_type == 'guest') {
            return <button className="btn btn-blue inactive">Subscribe</button>
        }
        if(item.is_subscribed) {
            return <button className="btn btn-blue inactive">Subscribed</button>
        }
        return <button className="btn btn-blue" onClick={this.buyNow.bind(this, item)}>Subscribe</button>
    }
    buyNow(app) {
        var self = this;
        if(typeof window.setUserID == 'undefined' || window.setUserID == '') {
            window.selected_app = app;
            window.location.hash = '#login';
        } else {
            let callback = function(app) {
                self.props.dispatch(subscribeApp({app_id: app.production_id}));
            }
            let redirect_callback = function() {
                self.setState({redirect_to_inbox: 1});
            }
            subscribeApplication(app, callback, redirect_callback);
        }
    }
    showDetails(index) {

        this.props.dispatch(activeMpApp({active_app : index}));
        let flyout = $(".rightMenuFlyout");
        flyout.find('.app-read-less').addClass('hide');
        flyout.find('.app-read-more').removeClass('hide');
        flyout.find('.truncate-text').addClass('paragraph-ellipsis');
        flyout.addClass("fly-in");
    }

    // componentDidMount() {
    //     setTimeout(function() {
    //         hasPageLoaded = true; // this will hide big white loader
    //     }, 500);
    // }
}

const mapStateToProps = (state) => {
    return {
        app_list: state.app_list,
        active_app : state.active_app,
        show_subscribed_app: state.show_subscribed_app,
        subscribed_apps: state.subscribed_apps,
        user_type: state.user_type
    }
}

const ConnectedList = withRouter(connect(mapStateToProps)(List));
export default ConnectedList;
