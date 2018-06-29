import React from 'react';
import { connect } from 'react-redux';
import Form from '../form';
import {showRedirectPopup, getRedirectLink, writeUserDetails} from '../functions/common_functions';
import {manageHeaderNotificationCount} from '../../actions/actions';

class RegisterForm extends React.Component {
    render() {
        let additionalParams = {
            email: window.session_file_name,
            user_type: this.props.user_type
        };
        let {props} = this;
        return (
            <div role="tabpanel" className="tab-pane" id="register">
                <div className="login-screen-wrap rt-signup-wrap" id="rt-signup-form">
                    <div className="login-screen-row">
                        <form className="login-form" onSubmit={e => this.register.call(this, e)} encType="multipart/form-data">
                            <Form form_fields={props.form_fields} additionalParams={additionalParams}/>
                            <div>
                                <button type="submit" className="btn full-btn btn-dark-blue rt-signup-slide">REGISTER</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login-screen-wrap hide rt-signup-wrap" id="rt-signup-sucess">
                    <div className="login-screen-row">
                        <p>Congratulations! you are successfully registered as (firstname + lastname)</p>
                        <p className="margin-bottom">Your request connect to your organization has been sent to organization administrator for approval. you will receive an email notification of once he has responded to your request.</p>
                        <button className="btn full-btn btn-dark-blue" onClick={this.redirectUser.bind(this)}>OK</button>
                    </div>
                </div>
            </div>
        )
    }
    register(event) {
        var form = $(event.target), self = this, form_fields = this.props.form_fields;
        var fields = form.find('input[data-input],select[data-input]');
        form.find('.error-msg-txt').addClass('hide');
        var postData = {};

        fields.each(function() {

            var _this = $(this);
            var name = _this.attr('name'), property = _this.attr('data-input');

            if(name == 'email') {
                if(!self.props.context.isValidUserName(_this.val())) {
                   _this.next().text('Please enter valid Email').removeClass('hide');
                } else {
                   postData[property] = {
                       class: form_fields[0].fields['_'+property].class,
                       property: property,
                       value: _this.val().toLowerCase()
                   }
                }
            }
            if(name == 'first_name') {
                if($.trim(_this.val()) == '') {
                   _this.next().removeClass('hide');
                } else {
                   postData[property] = {
                       class: form_fields[0].fields['_'+property].class,
                       property: property,
                       value: _this.val()
                   }
                }
            }
            if(name == 'last_name') {
                if($.trim(_this.val()) == '') {
                   _this.next().removeClass('hide');
                } else {
                   postData[property] = {
                       class: form_fields[0].fields['_'+property].class,
                       property: property,
                       value: _this.val()
                   }
                }
            }
            if(name == 'upload_profile_image') {
               postData[property] = {
                   class: form_fields[0].fields['_'+property].class,
                   property: property,
                   value: _this.val()
               }
            }
            if(name == 'password') {
                let passwordVal = $.trim(_this.val());
                if( passwordVal == '') {
                    _this.next().text('Please enter Password').removeClass('hide');
                } else if(!/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(passwordVal)) {
                    _this.next().text('Password must be alphanumeric and minimum 8 characters long').removeClass('hide');
                } else if(passwordVal.length < 8) {
                    _this.next().text('Password must be alphanumeric and minimum 8 characters long').removeClass('hide');
                } else {
                    postData[property] = {
                       class: form_fields[0].fields['_'+property].class,
                       property: property,
                       value: _this.val()
                    }
                }
            }
            if(name == 'confirm_password') {
                if($.trim(_this.val()) == '') {
                    _this.next().text('Please enter Confirm Password').removeClass('hide');
                } else if(_this.val() != $.trim(_this.closest('form').find('input[name="password"]').val()) ) {
                    _this.next().text('Password and Confirm Password do not match').removeClass('hide');
                }
            }
            if(name == 'organization') {
               postData[property] = {
                   class: form_fields[1].fields['_'+property].class,
                   property: property,
                   value: _this.val()
               }
            }
        });

        if(!form.find('.error-msg-txt:visible').length) {

            if(window.selected_app) {
                postData.app_detail = {
                    production_id: selected_app.production_id,
                    price: selected_app.price,
                    role: selected_app.role,
                    organization: selected_app.organization
                }
            }
            let ajaxData = {apiname:'signup','data':postData};

            if(self.props.user_type == 'guest') {
                ajaxData.user_type = self.props.user_type;
                ajaxData.guest_user_id = window.setUserID;
            }
            NProgress.start({position: 'full'});
            jQuery.ajax({
                type: 'POST',
                url: domainUrl+"api/",
                data: ajaxData,
                success:function(data) {
                    window.selected_app = undefined;
                    let response = data.data;
                    NProgress.done();
                    if(response.success || response.status) {

                        let registerForm = $("#register");
                        registerForm.find('.error-msg-txt').addClass('hide');
                        registerForm.find('input').not(':disabled').val('');

                        let inputFile = registerForm.find("#input-file");
                        inputFile.css({'background-image': inputFile.attr('data-default-profile')}).find('input[name="upload_profile_image"]').val('');

                        if(self.props.user_type == 'guest') {
                            $("#signin-up-poup").find('.close').trigger('click');
                            self.props.context.writeUserDetails(response, {is_user_logged_in: 1, user_type: 'active'});
                            // self.props.dispatch(manageHeaderNotificationCount({notificationCount: response.header_notification_count}));
                        } else {
                            let rtSignupSucess = $('#rt-signup-sucess');
                            rtSignupSucess.find('p').addClass('hide popup-content ');
                            rtSignupSucess.removeClass('hide');
                            if(typeof response.data == 'string') {
                                response.data = $.parseJSON(response.data);
                            }
                            rtSignupSucess.find('p:first').removeClass('hide').html('Congratulations! you are successfully registered as <b>' +response.data.first_name + ' ' + response.data.last_name +'</b>'+'. We have sent you a verification link to your registered email address, please verify your email to login.');

                            if(response.app_response) {
                                showRedirectPopup(response.app_response);
                            }
                            window.redirectTimeout = setTimeout(function() {
                                self.redirectUser();
                            }, 5000);
                        }
                        $("#rt-signup-form").addClass('hide').find('input,select').val('');
                    } else {
                        form.find('input[name="email"]').next().text(response.msg).removeClass('hide');
                    }
                }
            });
        }
    }
    redirectUser() {
        window.clearTimeout(window.redirectTimeout);

        var currentUrl = window.location.href.replace(/(#[a-z]+)|(#)/g, '').toLowerCase();
        if((typeof window.redirectUrl == 'undefined') || (window.redirectUrl && window.redirectUrl.toLowerCase() == currentUrl)) {
            window.location.hash = '#';
        } else {
            window.location.href = window.redirectUrl;
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user_type: state.user_type
    }
}
const ConnectedRegisterForm = connect(mapStateToProps)(RegisterForm);
export default ConnectedRegisterForm;
