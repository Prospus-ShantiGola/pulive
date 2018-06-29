import React from 'react';
import {connect} from 'react-redux';
import {manageHeaderNotification, appendCourseList, manageHeaderNotificationCount, loginUser, subscribeApp} from '../../actions/actions';
import {showRedirectPopup, getRedirectLink} from '../functions/common_functions';
import Connection from './../connection';
import { withRouter, Redirect } from 'react-router-dom'
import RegisterForm from './register_form';
import LoginForm from './login_form';
import ForgotPassword from './forgot_password';
import SetNewPassword from './set_new_password';
class Login extends React.Component {
    constructor(props) {
        super(props);
        let form_fields = window.form_fields;
        if(typeof window.form_fields == 'undefined') {
            form_fields = [];
        } else {
            form_fields = [window.form_fields];
        }
        this.state = {
            form_fields: form_fields,
            login : 0,
            redirect_to_inbox: 0
        }
    }
    render() {
        let redirectLink = getRedirectLink();
        if(this.state.login) {
            if(this.state.redirect_to_inbox == 1) {
                return (
                    <span>
                        <Connection/>
                        <Redirect to={redirectLink.inbox}/>
                    </span>
                )
            }
            return <Connection/>
        }
        if(this.state.redirect_to_inbox == 1) {
            return <Redirect to={redirectLink.inbox}/>
        }
        return this.getLoginPopup();
    }
    componentDidMount() {
        let self = this;
        Dropzone.autoDiscover = false;
        // $("#input-file").filestyle({icon: false});
        let registerForm = $("#rt-signup-form");
        if($("#input-file").length) {
            var myDropZone = new Dropzone("#input-file", {
                url: "api/registration",
                params: {apiname:'registration','is_signup':1},
                maxFilesize: 2, // MB,
                acceptedMimeTypes: ".jpeg,.jpg,.png,.gif",
                maxFiles:1,
                init: function() {
                    this.hiddenFileInput.removeAttribute('multiple');
                    // Register for the thumbnail callback.
                    // When the thumbnail is created the image dimensions are set.
                    this.on("thumbnail", function(file) {
                        // Do the dimension checks you want to do
                        if (file.width > 550 || file.height > 550) {
                            NProgress.done();
                            bootbox.alert({
                                title: 'Alert',
                                message: 'Image should be less than 550 x 550.'
                            });

                            return false;
                        }
                    });
                    this.on("maxfilesexceeded", function(file) {
                        this.removeAllFiles();
                        // this.addFile(file);
                    });
                    this.on("addedfile", function(file) {
                        NProgress.start({position: 'full'});
                        this.timeoutInterval = setTimeout(function() {
                            if($("#react-flx-loader").is(':visible')) {
                                NProgress.done();
                                bootbox.alert({
                                   title: 'Confirm',
                                    message: 'Unable to upload image, please try again.'
                                });
                            }
                        }, 5000);
                    });
                },
                success: function(file, response) {
                    NProgress.done();
                    clearInterval(this.timeoutInterval);
                    if (file.width > 550 || file.height > 550) {
                        return false;
                    }
                    response.data = response.data ;
                    registerForm.find('input[name="upload_profile_image"]').attr('data-profile-image', response.data);
                    registerForm.find('input[name="upload_profile_image"]').parent().find('.bootstrap-filestyle').find('.form-control').val(response.data);
                    imgToCrop = response.data;
                    let modal = $("#user-profile-crop");
                    modal.find('#profile-img-target').remove();
                    let profileImg = $('<img />').attr({
                        'src': response.data,
                        'id': 'profile-img-target'
                    });
                    profileImg.css('width':'100%');
                    modal.find('.modal-body').html(profileImg);

                    $('#profile-img-target').Jcrop({
                        aspectRatio: 1,
                        setSelect: [ 0, 0, 40, 41 ],
                        onSelect: updateCoords
                    });
                    modal.find('.upload-img-js').off('click').on('click', function() {
                        self.processProfile.call(self);
                    })
                    modal.modal('show');
                }
            });
        }
        if(typeof window.setUserID == 'undefined' || window.setUserID == '' || self.props.user_type == 'guest') { // if user is not logged in then only show login popup.

            var popupElement = $('#signin-up-poup');
            var tabs = popupElement.find('.nav-tabs').find('li');
            var url = window.location.href.replace(/#[a-z]+/g, '');
            var body = $('body');
            setInterval(function() {
                if(url == window.location.href) {
                    return true;
                }
                url = window.location.href;
                var hash = window.location.hash.replace('#', '').toLowerCase();
                if(hash == '' || (hash != 'login' && hash != 'register' && hash != 'setpassword')) {
                    popupElement.removeClass('in')
                    body.off('keyup.login_flyout');
                    return true;
                }
                body.on('keyup.login_flyout', function(event) {
                    if ( event.which == 27 ) { // when escape is pressed
                        window.location.hash = '#';
                    }
                });
                if(hash == 'setpassword') {
                    self.showSetNewPasswordPopup();
                    return true;
                }
                tabs.removeClass('active');
                popupElement.find('.tab-pane').removeClass('active');

                tabs.find('a[href="#' + hash +'"]').parent().addClass('active');
                popupElement.find('#' + hash).addClass('active');
                popupElement.find('#' + hash).find('#rt-signup-form').removeClass('hide');
                popupElement.find('#' + hash).find('#rt-signup-sucess').addClass('hide');
                popupElement.addClass('in');
            }, 500);
        }
    }
    showSetNewPasswordPopup() {
        $("#forgotPassword").modal('show');
    }
    processProfile() {
        if (!parseInt($('#w').val())) {
            bootbox.alert({
               title: 'Alert',
                message: 'Please select a crop region.'
            });
            return false;
        }
        $.ajax({
            method: "POST",
            url: "crop.php",
            data: {x:$(x).val(),y:$(y).val(),w:$(w).val(),h:$(h).val(), imgPath:imgToCrop, is_registration: 1}
        }).success(function(msg) {
            console.log(msg);

            var profilePreviewImg = $("#input-file");
            let backgroundImage = 'url(' + domainUrl + msg + ')' ;
            profilePreviewImg.css({"background-image": backgroundImage});
            profilePreviewImg.find('input[name="upload_profile_image"]').val(msg);
            $("#user-profile-crop").find(".close").trigger("click");

            indexing();
        });
    }

    register(event) {
        var form = $(event.target), self = this, form_fields = this.state.form_fields;
        var fields = form.find('input[data-input],select[data-input]');
        form.find('.error-msg-txt').addClass('hide');
        var postData = {};

        fields.each(function() {

            var _this = $(this);
            var name = _this.attr('name'), property = _this.attr('data-input');

            if(name == 'email') {
                if(!self.isValidUserName(_this.val())) {
                   _this.next().text('Please enter Group Name').removeClass('hide');
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
                    _this.next().text('Password and Confirm Password does not match').removeClass('hide');
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

            NProgress.start({position: 'full'});
            jQuery.ajax({
                type: 'POST',
                url: domainUrl+"api/",
                data: {apiname:'signup','data':postData},
                success:function(data) {
                    window.selected_app = undefined;

                    let response = data.data;
                    NProgress.done();
                    if(response.success) {
                        // let organizationValue = form.find('select[name="organization"]').val();
                        let rtSignupSucess = $('#rt-signup-sucess');
                        rtSignupSucess.find('p').addClass('hide');
                        rtSignupSucess.removeClass('hide');
                        // if(organizationValue == "0")
                        {

                            response.data = $.parseJSON(response.data);
                            //self.writeUserDetails(response);
                            rtSignupSucess.find('p:first').removeClass('hide').html('Congratulations! you are successfully registered as <b>' +response.data.first_name + ' ' + response.data.last_name +'</b>'+'. We have sent you a verification link to your registered email address, please verify your email to login.');

                            if(response.app_response) {
                                showRedirectPopup(response.app_response);
                            }

                            window.redirectTimeout = setTimeout(function() {
                                self.redirectUser();
                            }, 5000);

                        }
                        // else {
                        //     rtSignupSucess.find('.margin-bottom').removeClass('hide');
                        // }
                        $("#rt-signup-form").addClass('hide').find('input,select').val('');

                    } else {
                        form.find('input[name="email"]').next().text(response.msg).removeClass('hide');
                    }
                }
            });
        }
    }

    enableMainMenus() {
        $('.inactive_allow_click').removeClass('inactive');
    }
    cancelPopup() {
        window.location.hash = '#';
        window.selected_app = undefined;

        let signinForm = $("#rt-signin-form");
        signinForm.find('.error-msg-txt').addClass('hide');
        signinForm.find('input').val('');

        let registerForm = $("#register");
        registerForm.find('.error-msg-txt').addClass('hide');
        registerForm.find('input').not(':disabled').val('');

        let inputFile = registerForm.find("#input-file");
        inputFile.css({'background-image': inputFile.attr('data-default-profile')}).find('input[name="upload_profile_image"]').val('');
    }
    getRegisterLink() {
        if(JS_ROUTE_PATH == 3) {
            return <a href="javascript:void(0);" className="inactive">Register</a>
        }
        return <a href="#register">Register</a>
    }
    getLoginPopup() {
        return (
                <span>
                    <div className="modal fade pu-popup" id="signin-up-poup" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header modal-header-custom">
                                    <button type="button" className="close" onClick={this.cancelPopup.bind(this)}><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div className="modal-body">{this.getFlyoutContent()}</div>
                            </div>
                        </div>
                    </div>
                    <ForgotPassword context={this}/>
                    <SetNewPassword context={this}/>
                </span>
        )
    }
    getFlyoutContent() {
        if(this.props.user_type == 'guest') {
            return (
                <div className="tab-pane-section">
                    <ul className="nav nav-tabs" role="tablist">
                        <li role="presentation">{this.getRegisterLink()}</li>
                    </ul>
                    <div className="tab-content">
                        <RegisterForm context={this} form_fields={this.state.form_fields}/>
                    </div>
                </div>
            )
        }


        return (
            <div className="tab-pane-section">
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation">{this.getRegisterLink()}</li>
                    <li role="presentation" className="active"><a href="#login">Login</a></li>
                </ul>
                <div className="tab-content">
                    <RegisterForm context={this} form_fields={this.state.form_fields}/>
                    <LoginForm context={this} />
                </div>
            </div>
        )
    }
    checkLogin(userName, password, form, data) {
        var self = this;
        NProgress.start({position: 'full'});
        $.post(domainUrl+'login/doLogin',data,function(response) {
            var currentUrl = window.location.href.replace(/(#[a-z]+)|(#)/g, '').toLowerCase();

            NProgress.done();

            if(response.result == 1) {
                form.find('p:first').removeClass('hide');
                return true;
            }
            if(response.result == 2) {
                var errorMsg = 'You are already logged in on another device. Logging in here will terminate session on that device.</br></br> Would you like to continue?';

                bootbox.confirm({
                    title:'Confirm',
                    message: errorMsg,
                    callback: function(state) {
                        if(state) {
                            data.forceUser = 'Y';
                            self.checkLogin(userName, password, form, data);
                        }
                    }
                });
                return false;
            }
            /*DONE BY DIVYA*/
            if(response.result == 3) {
                var errorMsg = response.msg;

                bootbox.confirm({
                    title:'Confirm',
                    message: errorMsg,
                    callback: function(state) {
                        if(state) {
                            data.forceUser = 'Y';
                            self.checkLogin(userName, password, form, data);
                        }
                    }
                });
                return false;
            }

            if(response.result == 4) {
                var postMailData = {};

                var dialog = bootbox.dialog({
                    message: response.msg,
                    buttons: {
                        ok: {
                            label: "Resend Verification Link",
                            className: 'btn-info',
                            callback: function(){
                                postMailData.email_address  = response.email_address;
                                postMailData.first_name     = response.firstName;
                                postMailData.hashKey        = response.hashKey;

                                $.post(domainUrl+'login/resendMail', postMailData, function(response) {
                                    console.log('test mail testing.');
                                });
                            }
                        }
                    }
                });
            }
            /*DONE BY DIVYA END HERE*/
            if((typeof window.redirectUrl == 'undefined') || (window.redirectUrl && window.redirectUrl.toLowerCase() == currentUrl)) {
                var popupElement = $('#signin-up-poup');
                if(popupElement.find('.modal-header-custom').hasClass('hide')) {
                    window.location.hash = '#';
                    popupElement.removeClass('in');
                    popupElement.find('.modal-header-custom').removeClass('hide');
                    self.writeUserDetails(response);
                    return true;
                }
                if('currentChatDialogueDetail' in response) {
                    let inboxUrl = getRedirectLink('inbox');
                    inboxUrl += '?cid='+response['currentChatDialogueDetail'].course_node_id;
                    if(response['currentChatDialogueDetail'].dialogue_node_id) {
                        inboxUrl +='&did='+response['currentChatDialogueDetail'].dialogue_node_id;
                    }
                    if(response['currentChatDialogueDetail'].production_node_id) {
                        inboxUrl +='&pid='+response['currentChatDialogueDetail'].production_node_id;
                    }

                    window.location.href = inboxUrl; // redirect to home page
                    return false;
                }
                if('notification' in response) {
                    self.props.dispatch(manageHeaderNotification(response.notification));
                }
                self.writeUserDetails(response, {is_user_logged_in: 1});
                let courseList = response.data.courseList;
                self.props.dispatch(appendCourseList({course_list: courseList, view_type: 'bycourse', subscribed_apps: response.data.subscribed_apps}));
                self.props.dispatch(manageHeaderNotificationCount({notificationCount: response.header_notification_count}));
                window.location.hash = '#';
                self.enableMainMenus();
                if(response.app_response) {
                    let redirect_callback = function() {
                        self.setState({redirect_to_inbox: 1});
                    }
                    let callback = function(app) {
                        self.props.dispatch(subscribeApp({app_id: app.production_id}));
                    }
                    showRedirectPopup(response.app_response, redirect_callback, callback, window.selected_app);
                }
            } else {
                window.location.href = window.redirectUrl;
            }

        },'JSON');
    }

    writeUserDetails(response, login_user) {
        response.initialName = (response.data.first_name.charAt(0)+response.data.last_name.charAt(0)).toUpperCase();

        window.setUsername  = response.data['first_name']+' '+response.data['last_name'];
        window.setUserID   = response.data['node_id'];
        window.session_file_name = response.data['email_address'];
        window.firstName = response.data['first_name'];
        window.lastName = response.data['last_name'];
        window.initialName = response.initialName;
        window.profileImage = (response.data.profile_image) ? response.data.profile_image: 0;
        $("#48_inbox").removeClass('inactive');
        $("#116_resources").removeClass('inactive');
        if(typeof login_user == 'object') {
            login_user.user_details = response.data;
            this.props.dispatch(loginUser(login_user));
        } else {
            this.setState({login: 1});
        }
    }
    isValidUserName(email) {
        var re = window.email_regex;
        return re.test(email);
    }
}

const mapStateToProps = (state) => {
    return {
        user_type: state.user_type
    }
}

const ConnectedLogin = connect(mapStateToProps)(Login);
export default ConnectedLogin;
