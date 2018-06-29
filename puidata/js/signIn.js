/*start signIn.js*/
/*function autoLogin(userData, email, pass, domainName) {
 //sessId = oldSessId;
 $("#signInForm").find('input[name="password"]').val(pass);
 $("#signInForm").find('input[name="emailaddress"]').val(email)
 $.post(domainUrlApi + 'code.php', {'data': userData, 'action': 'signin', 'sessId': sessId, 'domainName': domainName, forceUser: 'N'}, responseSignInUser, 'JSON');

 }*/


/*document.addEventListener("click", function() {
    $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
}, true);*/

function signInUser(forceUser)
{
    var flag = true;
    var checkflag = "";
    var temp = true;
    var password = $("#signInForm #password").val();
    if (typeof forceUser == "undefined") {

        forceUser = "N";

    } else {
        "Y";
    }

    $(".login_form").each(function (i, k)
    {

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
                    $('.err-msg').removeClass('hide');
                    temp = false;
                }
            });

            if (temp == false) {
                flag = false;
            } else {
                flag = true;
            }
        }
    });



    if (flag == true)
    {
        if (password == '')
        {
            $(".error_msg_signup").html("Please enter password.");
            return false;
        }

        //$("#full_page_loader").removeAttr('style');

        setTimeout(function () {
            if (typeof showFullLoader != 'undefined' || typeof showFullLoader === 'function') {
                showFullLoader('full_page_loader');
            }

            $.post(domainUrlApi + 'code.php', {'data': $("#signInForm").serialize(), 'action': 'signin', 'sessId': sessId, 'domainName': userDomainName, forceUser: forceUser}, responseSignInUser, 'JSON');
        }, 10);
    }
}
function callforceloginAction() {
    var forceUser = true;
    signInUser(forceUser);
}
function responseSignInUser(data, source)
{


    if (parseInt(data.result) == 2)
    {

        if (typeof hideFullLoader != 'undefined' || typeof hideFullLoader === 'function') {
                hideFullLoader('full_page_loader');
            }
        var errorMsg = 'The account ' + data.email_address + ' is already logged in. If you log in here, that session will be terminated.</br></br> Would you like to continue logging in?';
        $("#confirmation-signin-popup #loggedin-msg").html(errorMsg);
        $("#confirmation-signin-popup").modal("show");

        //$("#full_page_loader").removeClass('loader-fade-in');
        //$(".error_msg_signup").html(data.msg);
        $(".show-mini").hide();
        $(".log-class").show();
        //$('.err-msg').removeClass('hide');
        $(".logout-class").remove();
    }
    if (parseInt(data.result) == 1)
    {
        if (typeof hideFullLoader != 'undefined' || typeof hideFullLoader === 'function') {
                hideFullLoader('full_page_loader');
            }

        //$("#full_page_loader").removeClass('loader-fade-in');
        $(".error_msg_signup").html(data.msg);
        $(".show-mini").hide();
        $(".log-class").show();
        $('.err-msg').removeClass('hide');
        $(".logout-class").remove();
        if (parseInt(data.cookieError) == 1) {
            $('#fly-login').trigger('click');
        }
    }

    if (parseInt(data.result) == 0)
    {
        if (data.userCookie) {
            $.cookie("CLASS_DEAL", data.userCookie, {expires: 7, path: '/'});
            var JSONObject = JSON.parse(data.userCookie);
            sessId = JSONObject["sessId"];
        } else {
            $.removeCookie('CLASS_DEAL', {path: '/'});
        }

        $('.err-msg').addClass('hide');
        $(".error_msg_signup").html('');

        $(".login_form").each(function (index) {
            $(this).val('');
        });

        //  var html = '<a href="#" class="logout-class" >'+data.user['first_name']+' '+data.user['last_name']+'</a><a class="logout-class" style="cursor:pointer" onclick="logoutUser();" >Logout</a><input class="logout-class" type="hidden" id="first_name" name="first_name" value="'+data.user['first_name']+'" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="'+data.user['last_name']+'" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="'+data.user['date_of_birth']+'" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="'+data.user['email_address']+'" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="'+data.user['node_id']+'" />';
        var html = '<input class="logout-class" type="hidden" id="first_name" name="first_name" value="' + data.user['first_name'] + '" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="' + data.user['last_name'] + '" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="' + data.user['date_of_birth'] + '" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="' + data.user['email_address'] + '" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="' + data.user['node_id'] + '" />';

        $(".log-class").hide();

        $(".user-action.dropdown").removeClass('hide');

        if ($('.links-box .logout-class').length == 0)
        {
            if( data.user['last_name'] != '' && data.user['last_name'] != undefined)
            $('.user-action.dropdown .login-user-fullname').prepend(data.user['first_name'] + ' ' + data.user['last_name']);
            else
            $('.user-action.dropdown .login-user-fullname').prepend(data.user['first_name']);
            $('.user-action.dropdown').after(html);
        }
        $(".show-mini").show();

        if( data.user['last_name'] != '' && data.user['last_name'] != undefined)
        setUsername = data.user['first_name'] + ' ' + data.user['last_name'];
        else
        setUsername = data.user['first_name'];
        setUserID = data.user['node_id'];
        newRoleId = data.user['current_role'];
        userEmail = data.user['email_address'];
        userDomain = data.user['domain'];

        $(".connect_user_id").attr('value', setUserID);
        if (parseInt(newRoleId) > 0)
        {
            $(".connect_role_id").attr('value', newRoleId);
        }

        $(".close-flyout").trigger('click');
        if ($.trim(userComapnyName) == '')
            userComapnyName = 'Investible';

        if ($.trim(data.user['common_name']) == '' && userDomainName == 'www.prospus.com')
            common_name = 'Administrator';
        else if ($.trim(data.user['common_name']) == '')
            common_name = 'Guest';
        else
            common_name = data.user['common_name'];

        if ($.trim(data.roles) != '')
        {
            $("#dd_img_pu_plugin").show();
            $("#user-roles-ul").html(data.roles);
        } else
        {
            $("#dd_img_pu_plugin").hide();
            $("#user-roles-ul").html('');
        }



        if (typeof loginFromPUPlugin == 'function')
        {
            $('body').removeClass('grey-bg-for-marinemax');
            $(".logo-centered").addClass('hide');
            $(".version-txt").addClass('hide');
            loginFromPUPlugin();
        }

        if(userDomainName == 'www.prospus.com')
        {
            loginFromPUOnInvetible('first');
        }
        //Task no 243 . https://docs.google.com/document/d/1bMlrmUEHPv0yGd3disRWspD9mFlJ7efCBYN_UJSHQ28/edit#



        if ($.trim(data.crole) != '')
        {
            $(".changed-user-role").html(data.crole);
        }
        else if($("ul#user-roles-ul li").length==0 && userDomainName == 'www.marinemax.com'){
            $("span.changed-user-role").text("MarineMax");
            $("#section_id_deal").remove();
        }
        else
            $(".changed-user-role").html(userComapnyName + ' . ' + common_name);

        $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
    }
}

function logoutUser()
{
    if(userDomainName != 'www.prospus.com')
    {
        leftNavigationModule.clearCache();
        $('.j_my_search_close').trigger('click');
        var cookiedata = $.cookie("CLASS_DEAL");
    }
    firstDashBoardLoad = 0;
    $.post(domainUrlApi + 'code.php', {'action': 'logout', 'sessId': sessId, 'cookiedata': cookiedata}, responsLogoutUser, 'JSON');
    bootbox.hideAll();
}

function responsLogoutUser(d, s)
{
    /**
     * [bodyEle description: Put back backgruond image on body element when user logs out]
     * @type {[type]}
     */
    var bodyEle = $('body');
    bodyEle.css({
        background: 'url('+bodyEle.attr('data-background-url')+')',
        'background-position': 'top right',
        'background-size': 'cover'
    });
    var emailAttr = $('#signInForm #emailaddress').attr('value');
    var emailVal =  $('#signInForm #emailaddress').val();
    if ($.trim(d.cookieemailAdd) != '' && $.trim(d.cookiepassword) != '' && (emailAttr =='' || emailVal == '')) {
        $('#signInForm #emailaddress').attr('value', d.cookieemailAdd);
        $('#signInForm #emailaddress').val(d.cookieemailAdd);
        $('#signInForm #password').attr('value', d.cookiepassword);
        $('#signInForm #password').val(d.cookiepassword);
        $('#signInForm #checkBoxRemember').prop("checked", true);
    }


    if (w_popout != undefined) {
        w_popout.close();
    }
    //$.removeCookie('CLASS_DEAL', { path: '/' });
    $(".logout-class").remove();
    $('.user-action.dropdown').addClass('hide');
    $('.user-action.dropdown .login-user-fullname').text('');
    $(".ref_add_new_title_bar").remove();
    $('.ref-min-right-dialogue .save_course_detail').hide();
    $('.ref_add_right_tab').hide();
    $('.imranClose').trigger('click');
    $(".show-mini").hide();
    $(".log-class").show();
    setUsername = '';
    setUserID = '';
    $(".connect_user_id").attr('value', setUserID);
    $(".connect_role_id").attr('value', '');
    $("#user-roles-ul").html('');
    $('body').addClass('grey-bg-for-marinemax');
    $(".logo-centered").removeClass('hide');
    $(".version-txt").removeClass('hide');
    if (is_roles == 'True')
    {
        $("#dd_img_pu_plugin").hide();
    }

    if ($.trim(userComapnyName) == '')
        userComapnyName = 'Investible';
    $(".changed-user-role").html(userComapnyName + ' . Guest');

    if (typeof loginFromPUPlugin == 'function')
    {
        var section = $('.breadcrumb-wrap li a:eq(0)').text();
        if (section == inboxMenuName) {
            $('.j_my_createDeal_close').trigger('click');
        }
        loginFromPUPlugin();
    }

    if(userDomainName == 'www.prospus.com')
    {
        loginFromPUOnInvetible('logout');
    }
    $('.user-action-wrap').removeClass('inactive');
}

function checkSessionFileResponse(data, s) {
    //if file not exists
    if (data && parseInt(data.result) == 1)
    {
       /* $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();*/
        logoutUser();
    }
    // if file exists and
    if (data && parseInt(data.result) == 0)
    {
        var clearTimeOut = setTimeout(function () {
            $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
        }, 10000);
        if (location.host == "localhost" || location.host == 'dev.marinemax.prospus.com') {
            clearTimeout(clearTimeOut);
        }

    }
    if (data && parseInt(data.result) == 2)
    {
       /* $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();*/
        logoutUser();
    }
}

function changeUserRole(role_id)
{
    dataSettings = {};
    leftNavigationModule.cache.selected_main_menu_text = '';
    $.post(domainUrlApi + 'code.php', {'action': 'changeRole', 'sessId': sessId, 'role_id': role_id}, responsChangeUserRole, 'JSON');
}

function responsChangeUserRole(data, source)
{
    if (parseInt(data.result) == 1)
    {
        // $("#full_page_loader").removeClass('loader-fade-in');
        $(".error_msg_signup").html(data.msg);
        $(".show-mini").hide();
        $(".log-class").show();
        $(".logout-class").remove();
    }

    if (parseInt(data.result) == 0)
    {
        $(".error_msg_signup").html('');
        $(".login_form").each(function (index) {
            $(this).val('');
        });

        //  var html = '<a href="#" class="logout-class" >'+data.user['first_name']+' '+data.user['last_name']+'</a><a class="logout-class" style="cursor:pointer" onclick="logoutUser();" >Logout</a><input class="logout-class" type="hidden" id="first_name" name="first_name" value="'+data.user['first_name']+'" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="'+data.user['last_name']+'" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="'+data.user['date_of_birth']+'" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="'+data.user['email_address']+'" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="'+data.user['node_id']+'" />';
        var html = '<input class="logout-class" type="hidden" id="first_name" name="first_name" value="' + data.user['first_name'] + '" /><input type="hidden" class="logout-class" id="last_name" name="last_name" value="' + data.user['last_name'] + '" /><input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="' + data.user['date_of_birth'] + '" /><input class="logout-class" type="hidden" id="email_address" name="email_address" value="' + data.user['email_address'] + '" /><input class="logout-class" type="hidden" id="node_id" name="node_id" value="' + data.user['node_id'] + '" />';

        $(".log-class").hide();

        $(".user-action.dropdown").removeClass('hide');

        if ($('.links-box .logout-class').length == 0)
        {
            if( data.user['last_name'] != '' && data.user['last_name'] != undefined)
            $('.user-action.dropdown .login-user-fullname').prepend(data.user['first_name'] + ' ' + data.user['last_name']);
            else
            $('.user-action.dropdown .login-user-fullname').prepend(data.user['first_name']);
            $('.user-action.dropdown').after(html);
        }
        $(".show-mini").show();

        if( data.user['last_name'] != '' && data.user['last_name'] != undefined)
        setUsername = data.user['first_name'] + ' ' + data.user['last_name'];
        else
        setUsername = data.user['first_name'];

        setUserID = data.user['node_id'];
        newRoleId = data.user['current_role'];

        $(".connect_user_id").attr('value', setUserID);
        if (parseInt(newRoleId) > 0)
        {
            $(".connect_role_id").attr('value', newRoleId);
        }

        $(".close-flyout").trigger('click');
        if ($.trim(userComapnyName) == '')
            userComapnyName = 'Investible';

        if ($.trim(data.user['common_name']) == '')
            common_name = 'Guest';
        else
            common_name = data.user['common_name'];

        $(".changed-user-role").html(userComapnyName + ' . ' + common_name);

        if ($.trim(data.roles) != '')
        {
            $("#dd_img_pu_plugin").show();
            $("#user-roles-ul").html(data.roles);
        } else
        {
            $("#dd_img_pu_plugin").hide();
            //$("#user-roles-ul").remove();
        }

        if ($.trim(data.crole) != '')
            $(".changed-user-role").html(data.crole);

        if (typeof loginFromPUPlugin == 'function')
        {
            $("#leftMenuBar a").removeClass("active");
            $("#leftMenuBar a:first").addClass("active");
            loginFromPUPlugin();
        }

        $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
    }
}
