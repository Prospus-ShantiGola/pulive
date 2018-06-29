import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {changePageName} from '../../actions/actions';
import { NavLink } from 'react-router-dom';


class Dashboard extends React.Component {
    render(){
        return (
            <div className="flex-item">
                <div className="main-bg-wrap" id="">
                    <div className="nano paneHT">
                        <div className="nano-content">
                            {/* <NavLink to="/pu/tokenexpire"><span style={{color:"red", fontSize:"17px"}}>Click Here</span></NavLink> */}
                            <img src="public/img/dashboard-screen.jpg" />
                            <div className=" flex-lg hide">
                                <div className="lg-container">
                                    <div className="lg-box">
                                        <div>
                                            <p className="lg-head">LOGIN</p>
                                        </div>
                                            <div>
                                                <div className="mid-container">
                                                     <div>
                                                        <input type="text" className="form-control input-gray" placeholder="ENTER EMAIL" name="email"/>
                                                        <p className="error-msg-txt lg-txt hide">Please enter  valid Email</p>
                                                    </div>
                                                    <div>
                                                        <input type="password" className="form-control input-gray" placeholder="PASSWORD" name="password"/>
                                                        <p className="error-msg-txt lg-txt hide">Please enter Password</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="btn btn-dark-blue lg-btn">LOG IN</button>
                                            </div>
                                        <div className="lg-foot">
                                                <div>
                                                    <a className="lg-link" href="#"><span>Forgot Password</span></a>
                                                </div>
                                                    <div className="lg-foot-rgt hide">
                                                        <a className="lg-link1" href="#"><span>New User?</span></a>
                                                        <a className="lg-link" href="#"><span>Register</span></a>
                                                    </div>
                                                    <div className="hr-sect">OR</div>
                                            <div>
                                                <button type="button" className="btn btn-dark-blue lg-btn">REGISTER</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex-lg hide">
                                <div className="lg-container">
                                    <div className="lg-box">
                                        <div>
                                            <p className="lg-head">REGISTER</p>
                                        </div>
                                        <div className="form-detail-pane lg-padding">
                                            <div>
                                                <input type="text" className="form-control input-gray input-sm" placeholder="FIRST NAME" name="first_name"/>
                                                <p className="error-msg-txt lg-txt hide">Please enter First Name</p>
                                            </div>
                                            <div>
                                                <input type="text" className="form-control input-gray input-sm" placeholder="LAST NAME" name="first_name"/>
                                                <p className="error-msg-txt lg-txt hide">Please enter Last Name</p>
                                            </div>
                                            <div>
                                                <div className="lg-userprofile userprofile-wrap">
                                                    <div id="input-file" className="upload-file" style={{}}>
                                                        <img data-default-img="public/img/user.png" src="public/img/user.png" id="profile-preview-img" className="lg-img img-responsive "/> 
                                                        <input type="hidden" className="form-control input-gray"/>
                                                        <i className="fa fa-upload icon-upload" aria-hidden="true" ></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <input type="text" className="form-control input-gray" placeholder="ENTER EMAIL" name="email"/>
                                                <p className="error-msg-txt lg-txt hide">Please enter  valid Email</p>
                                            </div>
                                            <div>
                                                <input type="password" className="form-control input-gray" placeholder="PASSWORD" name="password"/>
                                                <p className="error-msg-txt lg-txt hide">Please enter Password</p>
                                            </div>
                                            <div>
                                                <div className="mid-container">
                                                    <div>
                                                        <button type="button" className="btn btn-dark-blue lg-btn">REGISTER</button>
                                                    </div>
                                                    <div className="hr-sect">OR</div>
                                                    <div>
                                                        <button type="button" className="btn btn-dark-blue lg-btn">LOG IN</button>
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
        )
    }
    componentDidMount() {
        this.props.dispatch(changePageName({page_name: 'dashboard'}));
        $(".nano").nanoScroller();
        NProgress.done();
    }
}
const mapStateToProps = (state) => {
    return {}
}
const ConnectedDashboard = withRouter(connect(mapStateToProps)(Dashboard));
export default ConnectedDashboard;
