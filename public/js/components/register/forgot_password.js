import React from 'react';

export default class ForgotPassword extends React.Component {
    render() {
        return (
            <div className="modal fade pu-popup" id="emailVerification" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header modal-header-custom">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.resetForm}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="tab-content">
                                <div className="tab-pane-section">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation" className="active">
                                            <a href="javascript:void(0);">Forgot Password</a>
                                        </li>
                                    </ul>
                                    <div role="tabpanel" className="tab-pane" id="register">
                                        <div className="login-screen-wrap rt-signin-wrap">
                                            <div className="login-screen-row">
                                                <form onSubmit={ e => {this.submitEmail.call(this, e)}}>
                                                    <div>
                                                        <p className="popup-content">Enter your email address and we will send you a link to reset your password.</p>
                                                        <input type="text" name="email" className="form-control input-gray" placeholder="Enter Email" ref="email"/>
                                                        <p className="error-msg-txt hide"></p>
                                                        <p className="popup-content confirmation-msg hide"></p>
                                                    </div>
                                                    <div className="popup-footer">
                                                        <button type="submit" id="submit-register" className="btn full-btn btn-dark-blue">Submit</button>
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
    resetForm() {
        $("#emailVerification").find('input[name="email"]').val('').next().addClass('hide');
    }
    submitEmail(e) {
        e.preventDefault();
        var emailElement = $(this.refs.email);
        emailElement.next().addClass('hide');
        emailElement.parent().find('.confirmation-msg').addClass('hide');
        if($.trim(emailElement.val()) == '') {
            emailElement.next().text('Please enter your email address').removeClass('hide');
            return false;
        }
        if($.trim(emailElement.val()) != '') {
            if(!this.props.context.isValidUserName(emailElement.val())) {
               emailElement.next().text('Please enter your email address').removeClass('hide');
           } else {
               NProgress.start({position: 'full'});
               $.ajax({
                   url: domainUrl + 'api/forgotpwd',
                   type: 'post',
                   data: {email_address: emailElement.val()},
                   success: function(response) {
                       NProgress.done();
                       if(typeof response == 'string') {
                           response = $.parseJSON(response);
                       }
                       if(response.data.success == 0) {
                           emailElement.next().text(response.data.msg).removeClass('hide')
                       } else {
                        //    emailElement.val('');
                           emailElement.parent().find('.error-msg-txt').addClass('hide');
                           emailElement.parent().find('.confirmation-msg').text('').text(response.data.msg).removeClass('hide');
                           emailElement.closest('form').find('#submit-register').text('Resend');
                        //    $("#emailVerification").find('.close').trigger('click');
                        //    $("#emailVerificationMsg").modal('show');
                       }
                   }
               });
           }
        }
    }
    componentDidMount() {
        $('#emailVerification').on('hidden.bs.modal', function () {
            let _this = $(this);
            let form = _this.find('form');
            form.find('input[name="email"]').val('');
            form.find('.error-msg-txt, .confirmation-msg').addClass('hide');
            form.find('#submit-register').text('Submit');
        })
    }
}
