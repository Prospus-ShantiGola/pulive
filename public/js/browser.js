/*-------------------
File Name : "browser.js"
Description : This js file detects the client browser and gives css classes to the body for browser compatible theming
Author : Prospus Consulting Pvt. Ltd.
Website : http://prospus.com
Date Created : 27th August 2012
Time : 11:09:50
Developer : Ankit Bhatia
--------------------*/

$(document).ready(function(){
	checkBrowser();

	$('body').on('keydown','.user_login_form #password',function(event){
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	if($keycode===13 ){
		DoLogin();
		event.preventDefault();
	}

	});
	$('body').on('keydown','.user_login_form #emailaddress',function(event){
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	if($keycode===13 ){
		DoLogin();
		event.preventDefault();
	}

	});

        if(typeof session_file_name != 'undefined' && session_file_name != ''){
            checkUserInactivity();
        }
});

function checkBrowser(){
	var val = navigator.userAgent.toLowerCase();
		if(val.indexOf("firefox") > -1){
			$('body').addClass('firefox');
		}
		else if(val.indexOf("opera") > -1){
			$('body').addClass('opera');
		}
		else if(val.indexOf("msie") > -1){
			$('body').addClass('ie');
			// get ie version
			version = parseFloat(navigator.appVersion.split("MSIE")[1]);
			$('body').addClass('ie'+version);
		}
		else if(val.match('chrome') != null){
			$('body').addClass('chrome');
		}
		else if(val.indexOf("safari") > -1){
			$('body').addClass('safari');
		}
}

    function DoLogin(forceUser)
	{
		var email_address  =     $('.user_login_form .form-group').find('#emailaddress').val();
		var password	   =     $('.user_login_form .form-group').find('#password').val();
        var logged_in_user =     $('.user_login_form .form-group').find('#logged_in_user').val();

		$("#email_error").html("");
        $("#password_error").html("");

        $('.user_login_form .form-group').find('#emailaddress').removeClass('form-error-field');
        $('.user_login_form .form-group').find('#password').removeClass('form-error-field');

        if(email_address == '')
        {
            $('.user_login_form .form-group').find('#emailaddress').addClass('form-error-field');
            $("#email_error").html("Please enter email address.");
            return false;
        }

        if(!isValidEmail(email_address))
        {
            $('.user_login_form .form-group').find('#emailaddress').addClass('form-error-field');
            $("#email_error").html("Please enter valid email address.");
            return false;
        }

        if(password == '')
        {
            $('.user_login_form .form-group').find('#password').addClass('form-error-field');
            $("#password_error").html("Please enter password.");
            return false;
        }
        if (typeof forceUser =="undefined"){

        forceUser="N";

    }
    else{
        "Y";
    }
		/*if(typeof logged_in_user == 'undefined'){
                    logged_in_user = '';
                }else{
                    logged_in_user = '/logged_in_user/' + logged_in_user
                }*/
		$.post(domainUrl+'login/doLogin',{'emailaddress':email_address,'logged_in_user':logged_in_user, 'password':password,forceUser:forceUser},getLoginResponse,'JSON');
                //$.get(domainUrl + 'api/login/emailaddress/' + email_address + '/password/' + password + logged_in_user + '/forceUser/' + forceUser, {}, getLoginResponse, 'JSON');
	}
        function callforceloginAction(){
            var forceUser=true;
            DoLogin(forceUser);
         }
	function getLoginResponse(data,source)
	{
        $('.user_login_form .form-group').find('#logged_in_user').remove();

                switch(data.result){
                    case "3":
                        $("#confirmation-signin-popup #loggedin-msg").html(data.msg);
                        $("#confirmation-signin-popup").modal("show");
                        $('.user_login_form .form-group').find('#emailaddress').after('<input type="hidden" value="'+data.logged_in_user+'" id="logged_in_user" name="logged_in_user" />');
			//$("#error_msg_signin").html(data.msg);
			$(".show-mini").hide();
                        break;
                    case "2":
                    var errorMsg='The account '+data.email_address+' is already logged in. If you log in here, that session will be terminated.</br></br> Would you like to continue logging in?';
        $("#confirmation-signin-popup #loggedin-msg").html(errorMsg);
                    $("#confirmation-signin-popup").modal("show");
			//$("#error_msg_signin").html(data.msg);
			$(".show-mini").hide();
                        break;

                    case "1":
			$("#error_msg_signin").html(data.msg);
			$(".show-mini").hide();
                        break;

                default :
			$("#error_msg_signin").html('');
			$( ".user_login_form .form-group" ).each(function( index ) {
			   $( this ).val('');
			});

			setUsername 	= data.data['first_name']+' '+data.data['last_name'];
			setUserID 		= data.data['node_id'];

			if($.trim(data.data['common_name']) == 'VesselWise.SalesRepresentative')
				window.location.href = domainUrl+'index/subscription';
			else
				window.location.href = domainUrl+'inbox';
            break;
		}
	}
	function isValidEmail(email)
    {
        return /^[a-zA-Z0-9]+([-._][a-zA-Z0-9]+)*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,4}$/.test(email)
            && /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$).*/.test(email);
    }


/*
 * Created By: Divya Rajput
 * Date: 22-March-2017
 * @Purpose : Add below script handle user's session for idle state.
 */
function checkUserInactivity(){
    $(document).idleTimeout({
        redirectUrl: window.location.href,      // redirect to this url on logout. Set to "redirectUrl: false" to disable redirect

        // idle settings
        idleTimeLimit: idle_timeout,           // 'No activity' time limit in seconds. 1800 = 30 Minutes
        idleCheckHeartbeat: 2,       // Frequency to check for idle timeouts in seconds

        // optional custom callback to perform before logout
        customCallback: false,       // set to false for no customCallback
        // customCallback:    function () {    // define optional custom js function
            // perform custom action before logout
        // },

        // configure which activity events to detect
        // http://www.quirksmode.org/dom/events/
        // https://developer.mozilla.org/en-US/docs/Web/Reference/Events
        activityEvents: 'click keypress scroll wheel mousewheel mousemove', // separate each event with a space

        // warning dialog box configuration
//        enableDialog: true,           // set to false for logout without warning dialog
//        dialogDisplayLimit: 3,       // 20 seconds for testing. Time to display the warning dialog before logout (and optional callback) in seconds. 180 = 3 Minutes
//        dialogTitle: 'Session Expiration Warning', // also displays on browser title bar
//        dialogText: 'Because you have been inactive, your session is about to expire.',
//        dialogTimeRemaining: 'Time remaining',
//        dialogStayLoggedInButton: 'Stay Logged In',
//        dialogLogOutNowButton: 'Log Out Now',

        // error message if https://github.com/marcuswestin/store.js not enabled
        errorAlertMessage: 'Please disable "Private Mode", or upgrade to a modern browser. Or perhaps a dependent file missing. Please see: https://github.com/marcuswestin/store.js',

        // server-side session keep-alive timer
        sessionKeepAliveTimer: false,   // ping the server at this interval in seconds. 600 = 10 Minutes. Set to false to disable pings
        sessionKeepAliveUrl: window.location.href // set URL to ping - does not apply if sessionKeepAliveTimer: false
    });
}
window.puJsFileLoadCounter++;
