/*start signUp.js*/
function signUpUser()
{
    var password            = $.trim($('#signUpForm [type=password]:first').val());
    var cpassword           = $.trim($('#confirm_password').val());
    var email_address       = $.trim($('#signUpForm .email_address_signup').val());

    $(".error_msg_signup").html("");
    $("#success_msg_signup").html("");
    $("#success_msg_signup").addClass('hide');

    var flag                = true;
    var checkflag           = "";
    var temp                = true;

    $(".signup-fields").each(function (i, k)
    {
        //alert("Hii");
        var data = $(this).val();
        var data = data.replace(/\'/, "\"");
        if (flag == true)
        {
            var fn = "";
            fn = $(this).attr('validate-data').split(";");
            var aa = [];

            for (i = 0; i < fn.length; i++)
            {
                aa.push(fn[i]);
            }

            aa.toString();
            $(aa).each(function (i, v)
            {
                var newStr = v;
                var valdata = data;
                if (valdata == "")
                {
                    var aaa = newStr.replace("this.value", "");
                } else
                {
                    var aaa = newStr.replace("this.value", data);
                }

                checkflag = eval(aaa);
                if (checkflag == false) {
                    temp = false;
                    $('.err-msg').removeClass('hide');
                }
            });

            if (temp == false) {
                flag = false;
            } else {
                flag = true;
            }
        }
    });

    if (flag == true) {
        var output = emailAddressExist(email_address, password, cpassword);
    }
}



function responseSignUpUser(data, source)
{
    $(".error_msg_signup").html("");
    $('.err-msg').addClass('hide');

    $("#success_msg_signup").html("");
    if (parseInt(data.result) == 0)
    {
        $("#success_msg_signup").removeClass('hide');
       // $("#success_msg_signup").html(data.msg);
        $("#success_msg_signup").html('Register successfully with DC');
    }

    $('.first_name_signup').val('');
    $('.last_name_signup').val('');
    $('.date_of_birth_signup').val('');
    $('.email_address_signup').val('');
    $('[type=password]').val('');

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    $('.common_name_signup').attr('value', userRegisterRole);
    $('.domain_signup').attr('value', userDomainName);
    $('.assigned_on_signup').attr('value', datetime);
}

$('body').on('keydown', '#signInForm #password, #emailaddress', function (event) {
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if ($keycode === 13) {
        signInUser();
        event.preventDefault();
    }
});
/* $('body').on('keydown','#signInForm #emailaddress',function(event){
 var $keycode = (event.keyCode ? event.keyCode : event.which);
 if($keycode===13 ){
 
 signInUser();
 event.preventDefault();
 }
 
 }); */

$('body').on('keydown', '#signUpForm .first_name_signup, .last_name_signup, .email_address_signup, .password_signup, #confirm_password', function (event) {
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if ($keycode === 13) {

        signUpUser();
        event.preventDefault();
    }

});



function emailAddressExist(email_address, password, cpassword)
{

    if ($.trim(email_address) != '')
    {
        $.ajax
                ({
                    url: domainUrlApi + 'code.php',
                    type: 'post',
                    data: {'action': 'checkEmailExist', 'email_address': email_address},
                    success: function (data) {
                        if (data == 1)
                        {
                            $('.err-msg').removeClass('hide');
                            $(".error_msg_signup").html("Email address already exist.");
                            //variable_type = 0 ;
                            return false;
                        } else {
                            var result = passwordValidation(password);
                            if (result)
                            {
                                if (password != '')
                                {
                                    if (password != cpassword)
                                    {
                                        $('.err-msg').removeClass('hide');
                                        $(".error_msg_signup").html("Password and confirm password are not matching.");
                                        return false;
                                    } else {
                                        $('.err-msg').addClass('hide');
                                        $.post(domainUrlApi + 'code.php', {'data': $("#signUpForm").serialize(), 'action': 'signup'}, responseSignUpUser, 'JSON');
                                    }
                                }
                            }
                        }
                    }
                });
    }

}
function passwordValidation(password)
{
    /*
     /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i
     */
    if (password == '')
    {
        $('.err-msg').removeClass('hide');
        $(".error_msg_signup").html("Please enter password.");
        return false;
    } else
    {

        if (password.length < 6)
        {
            $('.err-msg').removeClass('hide');
            $(".error_msg_signup").html("Password must be of minimum 6 characters.");
            return false;
        }
        if (password.length >= 6 && password.length > 15)
        {
            $('.err-msg').removeClass('hide');
            $(".error_msg_signup").html("Password must be of maximum 15 characters.");
            return false;

        }
        if (!password.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/))
        {
            //^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/
            $('.err-msg').removeClass('hide');
            $(".error_msg_signup").html("Password must be alphanumeric.");
            return false;
        }
        /* if(password.match(/[0-9]/)){
         $(".error_msg_signup").html("Password must contain at least one letter.");
         return false;
         }
         
         if (password.match(/[a-zA-Z]/))
         {
         $(".error_msg_signup").html("Password must contain at least one digit.");
         return false;
         }  */
        return true;
    }
}
/*End signUp.js*/