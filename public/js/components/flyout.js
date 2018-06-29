import React from 'react';
import {connect} from 'react-redux';
import {activeMpApp, subscribeApp} from '../actions/actions';
import ShowRating from './show_rating';
import HeaderNotification from './header_notification';
import {subscribeApplication, getRedirectLink} from './functions/common_functions';
import { withRouter, Redirect } from 'react-router-dom';

class Flyout extends React.Component {
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
        let app_list = this.props.app_list;
        let active_app = parseInt(this.props.active_app);
        if (typeof app_list == 'string') {
            app_list = JSON.parse(app_list);
        } else {
            app_list = JSON.parse(JSON.stringify(app_list));
        }
        var readMoreClass = 'app-read-more read-more ';
        var readLessClass = 'app-read-less read-more hide';
        if(active_app) {
             let desc = app_list[active_app].desc;
             if(desc && desc.length < 512) {
                 readMoreClass += ' inactive';
             }
        }
        return (
            <div>
            <div className="rightMenuFlyout">

                <div className="main-pane">

                    <div className="nano paneHT">
                        <div className="nano-content">
                            <div className="main-inner-pane ">
                                <div className="app-head-section">
                                    <div className="app-list-col">
                                        <div className="app-left-pane">
                                            <span className="app-icon">
                                                <img
                                                    src={(active_app) ? app_list[active_app].icon : PU_CDN_URL + 'public/img/app_1.png'}/>
                                            </span>
                                            <span className="rating-wrap">
                                                <span className="rating-title">Rating:</span>
                                                <ShowRating rating={(active_app) ? app_list[active_app].rating : 0}/>
                                            </span>

                                            <span>Price: ${(active_app) ? app_list[active_app].price : 0}</span>
                                            <span>
                                                {this.getSubscribeBtn(app_list[active_app])}
                                            </span>
                                        </div>
                                        <div className="app-right-pane">
                                            <h1>{(active_app) ? app_list[active_app].title1 : ''}</h1>
                                            <h3>{(active_app) ? app_list[active_app].title2 : ''}</h3>

                                            <p className="paragraph-ellipsis truncate-text">{(active_app) ? app_list[active_app].desc : ''}</p>
                                            <a href="#" className={readMoreClass}>Read More <i className="fa fa-angle-down"></i></a>
                                            <a href="#" className={readLessClass}>Read Less <i className="fa fa-angle-up"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="app-detail-section">
                                    <div className="app-list-section">
                                        <div className="app-list-heading"><i className="icon-sm highlight"></i><span>Feature Highlights</span>
                                        </div>

                                        <div className="app-list-content" dangerouslySetInnerHTML={{__html: (active_app) ? app_list[active_app].feature_highlights : ''}}>

                                        </div>
                                    </div>
                                        {
                                            this.showWorkflow()
                                        }
                                    <div className="app-list-section hide">
                                        <div className="app-list-heading">
                                        <span className="heading-left-pane">
                                          <i className="icon-sm reviews"></i>
                                          <span>Reviews</span>
                                        </span>

                                                                    <span className="heading-right-pane">
                                          <span className="list-count">1-10 of 85</span>
                                          <span className="list-control">
                                              <a className="left carousel-prev" href="#review-carousel" role="button" data-slide="prev">
                                                <i className="fa fa-angle-left"></i>
                                              </a>
                                              <a className="right carousel-next" href="#review-carousel" role="button" data-slide="next">
                                                <i className="fa fa-angle-right"></i>
                                              </a>
                                          </span>
                                        </span>
                                        </div>
                                        <div className="app-list-content">
                                            <div id="review-carousel" className="carousel slide" data-interval="false">
                                                <div className="carousel-inner" role="listbox">

                                                    <div className="item active">
                                                        <div className="carousel-caption">
                                                            {this.getUserReview()}
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="carousel-caption">
                                                            {this.getUserReview()}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="rightActionBar">
                    <ul>
                        <li><a href="javascript:void(0)"><i className="icon-sm chat inactive"></i></a></li>
                        <li onClick={this.closeFlyout.bind(this)}><a href="javascript:void(0)"><i
                            className="icon-sm close-black"></i></a></li>
                    </ul>
                </div>
            </div>
            <div className="rightMenuFlyout-overlay"></div>
            </div>

        )
    }
    getSubscribeBtn(item) {
        if(this.props.user_type == 'guest') {
            return <button className="btn btn-blue inactive">Subscribe</button>
        }
        if(item && item.is_subscribed) {
            return <button className="btn btn-blue active inactive">Subscribed</button>
        }
        return <button className="btn btn-blue " onClick={this.buyNow.bind(this, item)}>Subscribe</button>
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
    closeFlyout() {
        this.props.dispatch(activeMpApp({active_app: ''}));
        $(".rightMenuFlyout").removeClass("fly-in")
    }

    getUserReview() {
        let reviewsArr = [];
        for (let i = 1; i <= 5; i++) {
            let rating = parseFloat(Math.min(2 + (Math.random() * (5 - 2)),5).toFixed(1));
            reviewsArr.push(<div key={i} className="rvw-list">
                <div className="rvw-icon"><img src={PU_CDN_URL + "public/img/review_user.png"}/></div>
                <div className="rvw-content"><span className="rvw-heading"><h3>A Google User</h3><span
                    className="rvw-post-date"> Apr, 27, 2017</span></span><ShowRating rating={rating}/><p>Lorem ipsum dolor
                    sit amet, consecteturadipiscing elit, sed do eiusmod temporincididunt ut labore et dolore magna
                    aliqua. Utenim ad minim veniam, quis nostrudexercitatio.</p></div>
            </div>);
        }

        return reviewsArr;
    }

    showWorkflow(){
        let app_list = this.props.app_list;
        let active_app = parseInt(this.props.active_app);
        if (typeof app_list == 'string') {
            app_list = JSON.parse(app_list);
        } else {
            app_list = JSON.parse(JSON.stringify(app_list));
        }
        if(!app_list[active_app]){
            return false;
        }
        let workflow = app_list[active_app].workflow;
        if(!workflow){
            return false;
        }
        if (typeof workflow == 'string') {
            workflow = JSON.parse(workflow);
        }
        else{
            workflow = JSON.parse(JSON.stringify(workflow));
        }
        return(
                <div className="app-list-section workflow-wrapper">
                <div className="app-list-heading"><i
                            className="icon-sm workflow-black"></i><span>Workflow</span></div>
                            {workflow.map((key, index) => (
                            <div className="app-list-content" key={index}>
                                <table className="workflow-list-table">
                                    <tbody>
                                    <tr>
                                        <td><span className="circle-icon">{parseInt(index)+1}</span></td>
                                        <td>
                                            <h5>{workflow[index].operationName}</h5>
                                            <h6>{workflow[index].role}</h6>
                                        </td>
                                        <td><span>{workflow[index].operationDescription}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                                    ))}
                    </div>
            )
    }

    componentDidUpdate(){
        $(".rightMenuFlyout  .nano").nanoScroller();
        $(".rightMenuFlyout  .nano").nanoScroller({ scroll: 'top' })
    }
}

const mapStateToProps = (state) => {
    return {
        app_list: state.app_list,
        active_app: state.active_app,
        user_type: state.user_type
    }
}

const ConnectedFlyout = withRouter(connect(mapStateToProps)(Flyout));
export default ConnectedFlyout;
