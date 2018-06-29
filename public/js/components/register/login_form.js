import React from 'react';

class LoginForm extends React.Component {
    showForgotPasswordPopup() {        
         $("#signin-up-poup").find('.close').click();
         $("#emailVerification").modal('show');
    }
    render() {
        let {props} = this;
        return (
            <div role="tabpanel" className="tab-pane active" id="login">
                <div className="login-screen-wrap rt-signin-wrap" id="rt-signin-form">
                    <div className="login-screen-row">
                        <form className="login-form" onSubmit={event => { this.validateForm.call(this, event) }}>
                            <p className="hide error-msg-txt">Email/Password is incorrect.</p>
                            <input type="text" className="form-control input-gray" ref="user_name" placeholder="Enter Email" />
                            <p className="hide error-msg-txt">Please enter your email address</p>
                            <input type="password" className="form-control input-gray" ref="user_pass" placeholder="Enter Password" />
                            <p className="hide error-msg-txt">The password field is required</p>
                            
                             <div>
                                <button type="submit" className="btn full-btn btn-dark-blue rt-signin-slide">LOGIN</button>
                            </div>                            
                            <span className="right fgt-pwd" onClick={this.showForgotPasswordPopup.bind(this)}>Forgot Password</span>
                        </form>
                    </div>
                </div>


                {/* <div className="login-screen-wrap rt-signin-wrap hide" id="rt-role-form">
                    <div className="login-screen-row">
                        <form className="login-form">
                            <h3><span>Organizations/Roles</span></h3>
                            <p>Please select the organization and role that you want to buy course for</p>
                            <select className="gray-select-field">
                                <option>Universe</option>
                            </select>
                            <select className="gray-select-field">
                                <option>individual</option>
                            </select>
                            <button className="btn full-btn btn-dark-blue rt-signin-slide">Confirm</button>
                        </form>
                    </div>
                </div>

                <div className="login-screen-wrap rt-signin-wrap hide" id="rt-payment-form">
                    <div className="login-screen-row">
                        <form className="login-form">
                            <h3><span>Payment/Select a Method</span></h3>
                            <div className="col-pane-3 margin-bottom">
                                <div className="col1">
                                    <img src="public/img/visa.png"/>
                                    <div className="radio"><label><input type="radio" name="cardtype"/></label></div>
                                </div>
                                <div className="col1">
                                    <img src="public/img/mastercard.jpg"/>
                                    <div className="radio"><label><input type="radio" name="cardtype"/></label></div>
                                </div>
                                <div className="col1">
                                    <img src="public/img/ae.png"/>
                                    <div className="radio"><label><input type="radio" name="cardtype"/></label></div>
                                </div>
                            </div>
                            <input type="text" className="form-control input-gray"  placeholder="Credit Card Number" />
                            <input type="text" className="form-control input-gray"  placeholder="Card Holder Name" />
                            <div className="col-pane-3">
                                <input type="text" className="form-control input-gray"  placeholder="A" />
                                <input type="text" className="form-control input-gray"  placeholder="B" />
                                <input type="text" className="form-control input-gray"  placeholder="C" />
                            </div>
                            <div className="col-pane-2">
                                <select className="gray-select-field" placeholder="select your beverage">
                                    <option>Exp Month</option>
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </select>
                                <select className="gray-select-field" placeholder="select your beverage">
                                    <option>Exp Year</option>
                                    <option>2017</option>
                                    <option>2024</option>
                                    <option>2030</option>
                                    <option>2035</option>
                                    <option>2040</option>
                                    <option>2045</option>
                                    <option>2050</option>
                                </select>
                            </div>
                            <div className="col-pane-3">
                                <input type="text" className="form-control input-gray"  placeholder="CVV" />
                            </div>
                            <button className="btn full-btn btn-dark-blue rt-signin-slide" data-dismiss="modal">Pay</button>
                        </form>
                    </div>
                </div> */}
            </div>
        )
    }
    validateForm(event) {
        event.preventDefault();
        var userName = this.refs.user_name;
        var password = this.refs.user_pass;
        var form = $(userName).closest('form');
        var self = this;
        form.find('p').addClass('hide');
        if(!this.props.context.isValidUserName(userName.value)) {
            $(userName).next().removeClass('hide');
            return true;
        }

        if($.trim(password.value) == '') {
            $(password).next().removeClass('hide');
            return true;
        }
        var data = {'emailaddress':userName.value,'logged_in_user':userName.value, 'password':password.value,forceUser:'N'};

        if(window.selected_app) {
            data.app_detail = {
                production_id: selected_app.production_id,
                price: selected_app.price,
                role: selected_app.role,
                organization: selected_app.organization
            }
        }
        this.props.context.checkLogin(userName, password, form, data);
    }
}

export default LoginForm;
