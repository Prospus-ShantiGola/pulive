import React from 'react';
import {manageHeaderNotificationCount} from '../../actions/actions';
import {connect} from 'react-redux';

class SetNewPassword extends React.Component {
    render() {
        let self = this;
        return (
            <div className="modal fade pu-popup" id="forgotPassword" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header modal-header-custom">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="tab-content">
                                <div className="tab-pane-section">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation" className="active">
                                            <a href="javascript:void(0);">Set New Password</a>
                                        </li>
                                    </ul>
                                    <div role="tabpanel" className="tab-pane" id="register">
                                        <div className="login-screen-wrap rt-signin-wrap">
                                            <div className="login-screen-row">
                                                <form className="login-form" onSubmit={e => {self.processResetPassword.call(self, e)}}>
                                                    <div>
                                                        <input type="password" className="form-control input-gray" placeholder="Enter New Password" name="password" ref="password"/>
                                                        <p className="error-msg-txt hide"></p>
                                                    </div>
                                                    <div>
                                                        <input type="password" className="form-control input-gray" placeholder="Enter Confirm Password" name="confirm_password" ref="confirm_password"/>
                                                        <p className="error-msg-txt hide"></p>
                                                    </div>
                                                    <div>
                                                        <p className="success-msg-js hide">
                                                            Password has been updated successfully, click
                                                            <a href="javascript:void(0)" onClick={this.showLoginForm}> here</a> to login.
                                                        </p>
                                                    </div>
                                                    <div className="popup-footer">
                                                        <button type="submit" className="btn full-btn btn-dark-blue rt-signin-slide">Submit</button>
                                                    </div>
                                                </form>
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
    showLoginForm() {
        let forgotPasswordPopup = $("#forgotPassword");
        forgotPasswordPopup.find('.close').trigger('click');
        window.location.hash = '#login';
        forgotPasswordPopup.find('.success-msg-js').addClass('hide');
    }
    processResetPassword(event) {
        let password = $(this.refs.password), self = this;
        let passwordVal = $.trim(password.val());
        let {invalid} = this.props;

        let confirmPassword = $(this.refs.confirm_password);
        let confirmPasswordVal = $.trim(confirmPassword.val());
        event.preventDefault();

        password.closest('form').find('.error-msg-txt').addClass('hide');

        if( passwordVal == '') {
            password.next().text('Please enter New Password').removeClass('hide');
            password.focus();
            return true;
        }
        if(!/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(passwordVal)) {
            password.next().text('Password must be alphanumeric and minimum 8 characters long').removeClass('hide');
            password.focus();
            return true;
        }
        if(passwordVal.length < 8) {
            password.next().text('Password must be alphanumeric and minimum 8 characters long').removeClass('hide');
            password.focus();
            return true
        }
        if(confirmPasswordVal == '') {
            confirmPassword.next().text('Please enter Confirm Password').removeClass('hide');
            confirmPassword.focus();
            return true;
        }
        if(passwordVal != confirmPasswordVal) {
            confirmPassword.next().text('Password and Confirm Password do not match').removeClass('hide');
            confirmPassword.focus();
            return true;
        }
        NProgress.start({position: 'full'});
        $.ajax({
            url: domainUrl + 'api/setpassword',
            type: 'post',
            data: {password: passwordVal, confirm_password: confirmPasswordVal, token: $('input[name="_token"]').val()},
            success: function(response) {
                if(typeof response == 'string') {
                    response = $.parseJSON(response);
                }
                if(response.success == 0) {
                    confirmPassword.next().text(response.msg).removeClass('hide');
                } else {
                    let forgotPasswordPopup = $("#forgotPassword");
                    forgotPasswordPopup.find('input').val('');
                    forgotPasswordPopup.find('.success-msg-js').removeClass('hide');
                }
                NProgress.done();
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {invalid: state.invalid}
}
const ConnectedSetNewPassword = connect(mapStateToProps)(SetNewPassword);
export default ConnectedSetNewPassword;
