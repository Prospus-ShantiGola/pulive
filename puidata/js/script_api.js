var inprocess = 0;
var lastActivetab = "by-actor-section";
var testLength = 0;
var DefaultNeweventDate = 0;
var selectStartDate = 0;
var selectEnddate = 0;

$(document).ready(function () {

    flyoutLogin(); // function use for user login
    navigationFixed();
    // MiniTextAreaScrollManage(); // miniDialogue textarea scroll manage
    // for investible use
    var headermarTop = $(".header-stick-top").height();
    $(".advertisement-banner").css("margin-top", headermarTop - 1);
    $(".header-new").css("margin-top", headermarTop - 1);

    leftSidbarHover(); //function use for left slide in hover and icon clicking
    //function use for chat flyout
    responsiveFlyout(); // Responsive Flyout

    setTimeout(function () {
        navigationFixed();
    }, 2000); // nav fixed

    $("#main").find('.description').load("readme.html", function () {
        $(".nano").nanoScroller();
        $("#main").find("img").load(function () {
            $(".nano").nanoScroller();
        });
    });

    setFlyoutHeight('LoginHeight');
    setFlyoutHeight('AssociateHeight');

    // login, Associate - flyout
    $(".flyoutMD").click(function (e) {

        var FlyID = $(this).attr('id');
        if (typeof e.isTrigger == "undefined") {
            $(".error_msg_signup").html("");
            if (typeof $("#signInForm #emailaddress").attr('value') == undefined || $("#signInForm #emailaddress").attr('value') == "") {
                $("#signInForm #emailaddress").val('');
                $("#signInForm #password").val('');
                $("#signInForm .remember-me").prop('checked', false);
            }
        }

        if (FlyID == 'fly-Associate') {

            $("#success_msg_signup").html("");
            $('.first_name_signup').val('');
            $('.last_name_signup').val('');
            $('.date_of_birth_signup').val('');
            $('.email_address_signup').val('');
            $('[type=password]').val('');

            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" +
                    (currentdate.getMonth() + 1) + "-" +
                    currentdate.getDate() + " " +
                    currentdate.getHours() + ":" +
                    currentdate.getMinutes() + ":" +
                    currentdate.getSeconds();
            $('.common_name_signup').attr('value', userRegisterRole);
            $('.domain_signup').attr('value', userDomainName);
            $('.assigned_on_signup').attr('value', datetime);
        }
        if (!$("#" + FlyID + ".user-login-flyout").hasClass('opened')) {
            /*Code for right Modal New Event Close the modal and close modal*/
            if ($('body').find('#fly-login-events')) {
                $('.close-flyout1').click(function (e) {
                    $('.close-calendar').click();
                    $(this).closest('.modalFlyout').hide();
                    e.stopPropagation();
                });

            } else {
                flyOutclosing();
            }

            e.preventDefault();
            e.stopPropagation();
            $("#" + FlyID + ".user-login-flyout").animate({
                "margin-right": "0px"
            }, 500, function () {

                $("#" + FlyID + ".user-login-flyout").addClass("opened");
                $(".nano").nanoScroller();
                flyoutLogin();

                if (FlyID == "fly-login-events") {
                    $(".newevent-datepicker").datepicker().datepicker("setDate", DefaultNeweventDate);
                }
            });

        } else {
            e.preventDefault();
        }
    });

    // FAQs, About Us, Privacy - flyout
    $(".flyoutFH").click(function (e) {

        var FlyID = $(this).attr('id');
        if (!$("#" + FlyID + ".modalFlyout").hasClass('opened')) {
            if ($("#" + FlyID + ".modalFlyout").hasClass("Flyout-Four-Pane")) {
                flyOutclosing();
                e.preventDefault();
                $("#" + FlyID + '.Flyout-Four-Pane').animate({
                    "margin-right": "0"
                });
                $("#" + FlyID + '.Flyout-Four-Pane').addClass("opened");
                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    $(".nano").nanoScroller();
                });

            } else {
                flyOutclosing();
                e.preventDefault();
                e.stopPropagation();
                $("#" + FlyID + ".user-login-flyout").animate({
                    "margin-right": "0px"
                }, 1000, function () {
                    $('input[name="email-id"]').focus();
                    $("#" + FlyID + ".user-login-flyout").addClass("opened-Full-height opened");
                    $(".nano").nanoScroller();

                });
                flyoutLogin();
            }
        } else {
            e.preventDefault();
        }
        $('body').on('click', '.close-chat', function (e) {
            $('#add-text').val('')
            $('.user-login-flyout').hide();
            $('.slide-left-animate').click();
            e.stopPropagation();
        });
    });

    //end

    // expended textarea by click

    var headerHig = $('.header-wrapper').outerHeight();
    var windowHig = $(window).height();
    var availHeight = windowHig - headerHig;
    var setHt = $(".set-height-dialogue").outerHeight();
    var expendedBtn = $(".action-wrap").outerHeight();
    var tabHeight = $(".right-bar-tab").outerHeight();
    var textareaBox = $(".dialogue-txt-comment").outerHeight();
    var actionWrap = $(".action-wrap").outerHeight();

    var resetPasswordCode;
}); // document ready closed braket

$(window).resize(function () {

    // FlyoutleftSidebar();//function use for left slide flyout
    leftSidbarHover(); //function use for left slide in hover and icon clicking

    flyoutLogin(); // function use for user login
    //function use for chat flyout
    responsiveFlyout(); // Responsive Flyout
    // Support Chat
    // doesNtOpen();

    // calendarExpend();// For calendar
    // resizeCal(); //For calendar
    // calClosed(); //For calendar
    //MinichatWindow();// mini dialogue chat
    navigationFixed(); // nav fixed

});

//*************menu-items-active**************//
$(document).ready(function () {
    var url = window.location;
    $('ul.nav li').first().addClass('active');
    $('ul.nav a[href="' + url + '"]').parent().addClass('active');
    $('ul.nav a').filter(function () {
        return this.href == url;
    }).parent().addClass('active').siblings('li').removeClass('active');

});
//*************menu-items-active**************//


/*=============== Start Function setFlyoutHeight ====================*/

function setFlyoutHeight(selector) {
    var WinHig = $(window).height();
    $('#' + selector).css('height', WinHig);
}

// Left Sidebar Animation end

//----Slide Sidebar hover work starts
function leftSidbarHover() {

    var windowWid = $(window).outerWidth();
    var windowHig = $(window).height();
    var headerHig = $('.header-wrapper').outerHeight();
    var availHeight = windowHig - headerHig;
    var sidebar = $(".sidebar-wrapper");
    var sidebarWrap = $(".sidebar_wrap");

    var availHeightFixed = availHeight - $('.search-item-wrap-nano').outerHeight() * 2;

    //  alert(availHeightFixed + 'availHeightFixed');
    $(".sidebar_wrap").height(availHeight);
    $('.sidebar_wrap .menu-wrapper').height(availHeight);
    $('.sidebar-strip').height(availHeight);
    $('.user-action-wrap').height(availHeight);

}

//---- Sidebar hover end

// user Login Flyout
function flyoutLogin() {

    /*      var headerHig   =   $('.header-wrapper').outerHeight();
     var windowHig   =   $(window).height();
     var availHeight =   windowHig - headerHig;
     var loginWid    = $(".user-login-flyout.opened").outerWidth();
     var loginFterHt = $(".login-footer").outerHeight();
     var usersecWdt  = $(".pu_plugin_action_strip").outerWidth();
     var loginFlyHgt = $(".pu_plugin_modal_flyout").outerHeight();
     var loginHeaderHgt = $(".pu_plugin_modal_flyout .login-header").outerHeight();*/

    /*$(".pu_plugin_modal_flyout").height(windowHig);
     var headrFtr = $('.pu_plugin_modal_flyout .login-header').outerHeight() + $('.pu_plugin_modal_flyout .login-footer').outerHeight();
     var totalHTFY = windowHig - headrFtr;
     $('.pu_plugin_modal_flyout .login-body').height(totalHTFY);
     var flyHght = $('.flyout-body-area').height();
     $('.pu_plugin_modal_flyout .user-section-strip').height(flyHght);*/


    /*var totalAvaiFlyBodyHght = loginFlyHgt - (loginHeaderHgt + loginFterHt)
     $('.pu_plugin_modal_flyout .flyout-body-area').height(totalAvaiFlyBodyHght);
     console.log("totalAvaiFlyBodyHght", totalAvaiFlyBodyHght);
     $(".pu_plugin_modal_flyout.opened .flyout-body-area").width(loginWid - usersecWdt);*/


    var winHT = $(window).height();
    $('.user-login-flyout').height(winHT);
    $('.user-login-flyout .flyout-body-area').height(winHT);
    var flyWdth = $('.user-login-flyout').outerWidth() - $('.user-section-strip').outerWidth();
    $('.user-login-flyout .flyout-body-area').outerWidth(flyWdth);

    var headrFtr = $('.user-login-flyout .login-header').outerHeight() + $('.user-login-flyout .login-footer').outerHeight();
    var totalHTFY = winHT - headrFtr;
    $('.user-login-flyout .login-body').height(totalHTFY);
    var flyHght = $('.user-login-flyout .flyout-body-area').height()
    $('.user-login-flyout .user-section-strip').height(flyHght);

    if (typeof $(".user-login-flyout").nanoScroller == 'function') {
        $(".user-login-flyout .login-body .nano").nanoScroller();
    }

    $(".close-flyout").click(function (event) {
        $('.err-msg').addClass('hide');
        $('.forgot_password_flyout').find('form').find('input[name="email-id"]').val('');
        var loginWid = $(".user-login-flyout.opened");
        loginWid.animate({
            "margin-right": -100 + "%"
        }, 500, function () {
            changeForgotPasswordLayout();
        }).removeClass("opened");
        event.stopPropagation;
        event.preventDefault();
    });

}

// Login, Associate, FAQ, About, Privacy, User Details - Flyout Responsive
function responsiveFlyout() {
    var windowWid = $(window).outerWidth();
    if ($(window).width() <= 480) {
        $(".user-login-flyout").width(windowWid)
    }
}

function flyOutclosing() {
    $(".modalFlyout").each(function (i, v) {
        if ($(this).hasClass("opened")) {
            var modalwidth = $(this).outerWidth();
            if ($(this).hasClass('sidebar-wrap')) {
                $(this).animate({
                    "margin-left": -modalwidth
                }, 300).removeClass("opened");
            } else {
                $(this).animate({
                    "margin-right": -100 + "%"
                }, 300).removeClass("opened");
            }
        }
    });
}

function navigationFixed() {

    $(window).scroll(function () {
        var sticky = $('.navigation-fixed'),
                scroll = $(window).scrollTop();
        if (scroll >= 100) {
            $('.navigation-fixed').fadeIn(1000);
            $(".logo.slide-left-animate a").css("opacity", "0.1");
            $(".dropdown").find(".sub-drps").removeClass("negative-menu");
        } else {
            $('.navigation-fixed').fadeOut(100);
            $('.navigation-resp').addClass('navigation-fixed');
            $(".logo.slide-left-animate a").css("opacity", "1");
            $(".dropdown").find(".sub-drps").addClass("negative-menu");
        }
    });
}
var OperationModule = (function () {
    var options = {
        cache: []
    };

    function _init() {
        var body = $('body');
        body.off('click', '.confirm-complete-js').on('click', '.confirm-complete-js', function () {
            $('#confirm-operation-completion').modal('show');
        });
    }
    _init();

    function getActionBar() {
        return $(".action-bar-wrap").find('.user-action-wrap');
    }

    function toggleOperationActionButton(server_response) {

        if (typeof server_response == 'undefined')
            return true;

        var section_heading = BreadcrumbModule.getSection();
        if (typeof section_heading != 'undefined') {
            section_heading = section_heading.toLowerCase();

            if (section_heading == 'operation') {

            } else if (section_heading == 'deal' && server_response.phase) {
                options.cache.phase = server_response.phase;
                options.cache.phase.deal_node_instance_id = $("#id_listing_body").find('.active-tr').data('id');
            }
        }
    }

    function isDealEditable(onlyPhase) {
        var phase = role_phase[login_role_id];
        if (typeof onlyPhase == "undefined") {
            if (phase == options.cache.phase.PhaseId || options.cache.phase.PhaseId > phase) {
                return 1;
            }
        } else {
            if (typeof options.cache.phase != 'undefined' && phase == options.cache.phase.PhaseId) {
                return 1;
            }
        }
        return 0;
    }


    function getOperationPhase() {
        options.cache.phase.RoleId = login_role_id;
        return options.cache.phase;
    }
    return {
        toggleOperationActionButton: toggleOperationActionButton,
        getOperationPhase: getOperationPhase,
        options: options,
        isDealEditable: isDealEditable
    };

}());

var PassTheDeal = (function () {
    var PassTheDeal = function () {};
    PassTheDeal.prototype.showConfirmationPopup = function (clicked_element) {
        var self = this;
        var passTheDealFlyout = $('#pass_the_deal');
        var settings = clicked_element.data('settings');
        passTheDealFlyout.find('.detail_content_search').html('');
        passTheDealFlyout.find('.user-action-wrap').find('.confirm-deal-pass').addClass('inactive')
        passTheDealFlyout.flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
        passTheDealFlyout.find('.confirm-deal-pass').off('click.passdeal').on('click.passdeal', function () {
            var selected_item = passTheDealFlyout.find('.detail_content_search').find('input[name="pass-the-deal"]:checked');
            settings.to_role = selected_item.val();
            self.submit(passTheDealFlyout, settings, clicked_element);
        })

        bootbox.confirm({
            title: 'Confirm',
            message: settings.confirm_msg,
            callback: function (action) {

                if (action) {
                    UtilityModule.resetCache(); // reset cache so that formChange is not monitored
                    if (settings['pass_role_flag'] == 'pass-to-multiple') {
                        var roles = settings.roles;
                        self.createList(passTheDealFlyout, roles); // create list of all the roles and append in the flyout
                        setTimeout(function () {
                            $('.pass_the_deal_open').trigger('click'); // open the flyout
                        }, 100);
                    } else {

                        settings.to_role = settings['roles'][0]['role_id'];
                        self.submit(passTheDealFlyout, settings, clicked_element);
                    }
                }

            }
        });
    }

    PassTheDeal.prototype.toggleSaveButton = function (clicked_element) {
        $(clicked_element).closest('#pass_the_deal').find('.user-action-wrap').find('.confirm-deal-pass').removeClass('inactive');
    }

    PassTheDeal.prototype.createList = function (passTheDealFlyout, roles) {
        var self = this;
        var container = $('<div />').addClass('list-view');
        var ul = $('<ul />');
        $.each(roles, function (index, item) {

            var li = $('<li />');
            var anchor = $('<a />').attr({
                href: 'javascript:void(0);'
            });
            var customRadio = $('<div />').addClass('custom-radio');
            var radio = $('<input type="radio" />').attr({
                'value': item.role_id,
                name: 'pass-the-deal',
                onchange: 'PassTheDeal.toggleSaveButton(this)'
            });
            var label = $('<label />').text(item.role_title);

            customRadio.append(radio);
            customRadio.append(label);
            anchor.append(customRadio);
            li.append(anchor);
            ul.append(li);
        });
        container.append(ul);
        passTheDealFlyout.find('.detail_content_search').append(container);
        passTheDealFlyout.find('.loader-wrapper').addClass('hide');

    }

    PassTheDeal.prototype.submit = function (passTheDealFlyout, settings, btn) {

        showFullLoader('content_loader');

        var data = {
            action: 'pass_deal',
            from_role: login_role_id,
            to_role: settings.to_role,
            deal_instance_node_id: settings.deal_instance_node_id,
            login_role_id: login_role_id,
            login_user_id: login_user_id,
            deal_size: settings.deal_size,
            deal_instance_id: settings.deal_instance_id
        };
        passTheDealFlyout.find('.loader-wrapper').removeClass('hide');

        $.when(ActionModule.ajax(data)).done(function (d) {
            var response = $.parseJSON(d.data);
            //Update Menu Count
            updateMenuCount();
            if (response.deal_status.value == 'Archive') {
                htmlModule.triggerActiveMenu();
                passTheDealFlyout.find('.loader-wrapper').addClass('hide');
                passTheDealFlyout.find('.user-action-wrap').find('.pass_the_deal_close').trigger('click');
            } else {
                if (BreadcrumbModule.getSectionFullPath() == 'deal->operation') {
                    $('.return-deal-action').addClass('inactive');
                    $('#id_detail_content form').addClass('hide');
                    htmlModule.triggerActiveMenu();
                    //htmlModule.updateListWithSingleVal('#id_listing_operation div.active', '', '', 1);
                } else {
                    htmlModule.updateListWithSingleVal('#id_listing_body div.active-tr', response.deal_status.key, response.deal_status.value, 1);
                }
                passTheDealFlyout.find('.loader-wrapper').addClass('hide');
                passTheDealFlyout.find('.user-action-wrap').find('.pass_the_deal_close').trigger('click');
                updateDealStatusSubStatus();
            }
        });
    }

    return new PassTheDeal();
}());

function confirmCompleteOperation(clicked_element, param1, param2) {
    var container_selector = "#id_detail_content";
    var element_selector = 'input';
    var clicked_element_obj = $(clicked_element);
    // "'Are you sure you want to cancel?' popup should only display for 'deal->operation' page and mode must be 'edit'".
    var isEditMode = $(container_selector).find('form').length;
    var section = BreadcrumbModule.getSectionFullPath();
    var hasFormStateChanged = UtilityModule.hasFormStateChanged(container_selector, element_selector);
    if (hasFormStateChanged && isEditMode && section == 'deal->operation') {
        bootbox.confirm({
            title: 'Confirm',
            message: 'Are you sure you want to cancel?',
            callback: function (state) {
                if (state) {
                    if (clicked_element_obj.hasClass('action-accept-invitation')) {
                        PassTheDeal.showConfirmationPopup(clicked_element_obj);
                    } else {
                        dealRejectPopup(clicked_element_obj[0], param1, param2);
                    }
                }
            }
        });
    } else {
        if (clicked_element_obj.hasClass('action-accept-invitation')) {
            PassTheDeal.showConfirmationPopup(clicked_element_obj);
        } else {
            dealRejectPopup(clicked_element_obj[0], param1, param2);
        }
    }
}

function confirmCompleteOperation_bkp() {
    var confirmationPopup = $("#confirm-operation-completion");
    confirmationPopup.modal('show');
}


function requestPasswordChange(e) {
    e.preventDefault();
    var form = $('.forgot_password_flyout');
    var error_container = form.find('.err-msg').find('.display-msg');
    var emailEle = form.find('input[name="email-id"]');
    var emailId = $.trim(emailEle.val());
    if (!emailId.length) {
        error_container.html('Please enter email address.').closest('.err-msg').removeClass('hide');
        emailEle.focus();
        return true;
    }
    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailId.match(pattern)) {
        error_container.html('Please enter valid email address.').closest('.err-msg').removeClass('hide');
        emailEle.focus();
        return true;
    }
    error_container.html('').closest('.err-msg').addClass('hide');
    form.find('.forgot-password-loader-js').show();
    var data = {
        action: 'validateEmail',
        email: emailId
    };
    $.post(domainUrlApi + 'code.php', data, function (response) {
        response = response.result;
        form.find('.forgot-password-loader-js').hide();
        if (response.status == 'success') {
            resetPasswordCode = response.code;
            changeForgotPasswordLayout(form);
        } else {
            error_container.html(response.msg).closest('.err-msg').removeClass('hide');
        }

    }, 'JSON');
}

function submitPasswordCode(e) {
    e.preventDefault();
    var form = $('.forgot_password_flyout');
    var error_container = form.find('.err-msg').find('.display-msg');
    var email_code = $.trim(form.find('input[name="email-code"]').val());
    if (!email_code.length) {
        error_container.html('Please enter code.').closest('.err-msg').removeClass('hide');
        return true;
    }
    var pattern = /^[0-9]{5}$/;
    if (!email_code.match(pattern)) {
        error_container.html('Please enter valid code.').closest('.err-msg').removeClass('hide');
        return true;
    }
    if (resetPasswordCode != email_code) {
        error_container.html('Please enter valid code.').closest('.err-msg').removeClass('hide');
        return true;
    }
    error_container.html('').closest('.err-msg').addClass('hide');
    form.find('.forgot-password-loader-js').show();

    var data = {
        code: email_code,
        email: $('input[name="email-id"]').val(),
        action: 'validateCode'
    };
    $.post(domainUrlApi + 'code.php', data, function (response) {
        response = response.result;
        form.find('.forgot-password-loader-js').hide();
        if (response.status == 'success') {
            var passwordConfirmContainer = $('.password-confirm-container');
            passwordConfirmContainer.find('.user-name').text(response.name);
            passwordConfirmContainer.find('.user-email').text(response.email);
            changeForgotPasswordLayout(form);
        } else {
            error_container.html(response.msg).closest('.err-msg').removeClass('hide');
        }
    }, 'json');

}

function submitNewPassword(e) {
    e.preventDefault();
    var form = $('.forgot_password_flyout');
    var error_container = form.find('.err-msg').find('.display-msg');
    var pass = $.trim(form.find('input[name="new-password"]').val());
    var cpass = $.trim(form.find('input[name="confirm-password"]').val());
    if (!pass.length) {
        error_container.html('Please enter Password.').closest('.err-msg').removeClass('hide');
        return true;
    }
    if (pass.length < 6) {
        error_container.html('Password must be of minimum 6 characters.').closest('.err-msg').removeClass('hide');
        return false;
    }
    if (pass.length >= 6 && pass.length > 15) {
        error_container.html('Password must be of maximum 15 characters.').closest('.err-msg').removeClass('hide');
        return false;
    }
    if (!pass.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/)) {
        error_container.html('Password must be alphanumeric.').closest('.err-msg').removeClass('hide');
        return false;
    }
    if (pass != cpass) {
        error_container.html('Password and confirm password does not match.').closest('.err-msg').removeClass('hide');
        return true;
    }
    error_container.html('').closest('.err-msg').addClass('hide');

    form.find('.forgot-password-loader-js').show();

    var data = {
        code: $.trim($('input[name="email-code"]').val()),
        email: $.trim($('input[name="email-id"]').val()),
        fname: $('.user-name').text().split(" ")[0],
        password: pass,
        action: 'resetPassword'
    };
    $.post(domainUrlApi + 'code.php', data, function (response) {
        response = response.result;
        form.find('.forgot-password-loader-js').hide();
        if (response.status == 'success') {
            changeForgotPasswordLayout(form);
        } else {
            error_container.html(response.msg).closest('.err-msg').removeClass('hide');
        }
    }, 'json');
}

function showLoginScreen() {
    $('.close-flyout').trigger('click');
    setTimeout(function () {
        $("#fly-login").trigger('click');
    });
}

function changeForgotPasswordLayout(form) {
    var userActionWrap = $('.user-action-wrap:eq(2)');
    userActionWrap.find('a').not('.close-flyout').addClass('hide');

    if (typeof form == 'undefined') {
        var nanoContent = $(".request-password-container").closest('.nano-content');
        nanoContent.find('form').addClass('hide');
        nanoContent.find('form').find('input').val('');
        nanoContent.find(".request-password-container").removeClass('hide');
        userActionWrap.find('.process-password-btn-step1').removeClass('hide');
        return true;
    }

    form.closest('.nano-content').find('input').val('');
    var activeForm = form.find('form:visible');
    var step = parseInt(activeForm.data('step'));
    activeForm.addClass('hide');
    var nextActiveForm = form.find('form[data-step="' + (step + 1) + '"]');
    nextActiveForm.removeClass('hide');
    nextActiveForm.find('input:first').focus(); // focus first input
    userActionWrap.find('.process-password-btn-step' + (step + 1)).removeClass('hide');
    nextActiveForm.find('input[name="new-password"],input[name="confirm-password"]').off('keyup').on('keyup', function (e) {
        if (e.which == 13) {
            $(this).closest('form').submit();
        }
    });
}

var GoToPageModule = (function () {
    var options = {
        is_page_loading: false,
        load_which_row: 'AppOne',
        section: ''
    };
    var cache = {
        show_capped_alert: true,
        deal_added_from_dashboard: false,
        deal_status: ''
    };

    function loadDealPage() {
        $('#leftMenuBar').find("#section_id_deal").trigger('click');
    }

    function loadWorkspace() {
        options.nodeId = null;
        var workspaceAnchor = $('.action-bar-wrap').find('a[onclick="getWorkSpacePage(this)"]');
        workspaceAnchor.trigger('click');
    }

    function showDealDetail() {
        var dealRecord = $("#id_listing_body").find('div[data-node-id="' + options.nodeId + '"]');
        if (dealRecord.hasClass('active-tr')) { // if that deal is already selected then load workspace page
            loadWorkspace(); // if user published deal from dashboard then take user to workspace page.
        } else {
            dealRecord.trigger('click');
        }
    }

    function setDealId(deal_id) {
        options.nodeId = deal_id;
        cache.deal_added_from_dashboard = true;
        $.do_not_hide_loader = true;
        setTimeout(function () { // wait half second
            loadDealPage();
        }, 500);
    }
    /**
     * [getSelectedRole: Returns currently selected role text]
     * @param  {[Boolean]} replace_space_with_underscore [It can be 'True/false/undefined'. If 'True' then space will be replaced with underscore(_).]
     * @return {[String]}  roleText                      [Selected role from roles dropdown.]
     */
    function getSelectedRole(replace_space_with_underscore) {
        var roleText = $.trim($(".users-role").find('.select-user-role').find('.changed-user-role').text()).toLowerCase();
        if(replace_space_with_underscore) {
            return roleText.replace(/[\s]+/g, '_');
        }
        return roleText;
    }

    function isPageLoading() {
        return (typeof options.nodeId == 'undefined' || options.nodeId == null) ? false : true;
    }

    function isPageLoadingForBM() {
        return options.is_page_loading;
    }

    function revertState() {
        options.is_page_loading = false;
        options.section = '';
    }

    function showAppOneDetail() {
        $.do_not_hide_loader = false;
        hideFullLoader('full_page_loader');
        options.is_page_loading = false;
    }

    /* If there is no record for sub-menu then show a popup. Once user clicks on it then load 'All' page */
    function loadPageDealAll(msg) {
        if(!cache.show_capped_alert) {
            return true;
        }
        cache.show_capped_alert = false;
        bootbox.alert({
            closeButton: false,
            message: 'No records are found for "' + msg + '".<br>Please click Ok to go to see the complete list (All).',
            title: 'Alert',
            callback: function () {
                var AllEle = $("#menu_wraper").find('.item-list-detail:contains("All"):first');
                AllEle.trigger('click');
            }
        });
    }
    return {
        loadDealPage: loadDealPage,
        isPageLoading: isPageLoading,
        showDealDetail: showDealDetail,
        setDealId: setDealId,
        options: options,
        getSelectedRole: getSelectedRole,
        revertState: revertState,
        showAppOneDetail: showAppOneDetail,
        isPageLoadingForBM: isPageLoadingForBM,
        loadPageDealAll: loadPageDealAll,
        cache: cache
    }
}());

var FIQuoteModule = (function () {
    var options = {
        fi_quote_input: '#instance_property_caption3228',
        location_input: '#instance_property_caption6807',
        detail_content: '#id_detail_content',
        lookup_btn_container: '.lookup-btn-wrap',
        display_type: '',
        deal_lookup_drop: '.dealLookupLocDrop',
        deal_lookup_btn: '.deal_lookup_btn',
        current_page: 1,
        record_per_page: 100,
        old_fi_number: {}
    };
    var inputSelectors = "#fiquote_caption1000, #customer_caption1000, #stock_caption1000, #customer_name_caption1000, #customer_phone_caption1000, #customer_email_caption1000";

    function _init() {
        var allowedKeys = [8, 9, 37, 38, 39, 40, 46, 86];
        var body = $('body');
        body.off('keyup.fi_quote_input', options.fi_quote_input).on('keyup.fi_quote_input', options.fi_quote_input, function () {
            toggleRefreshDealButton(options.display_type);
        });
        body.off('paste.fi_quote_input', "#fiquote_caption1000").on('paste.fi_quote_input', "#fiquote_caption1000", function (evt) {
            var _this = $(this);
            setTimeout(function () {
                _this.val(_this.val().replace(/\D/g, ''));
            }, 0);
        });
        body.off('keydown.fi_quote_input', "#fiquote_caption1000").on('keydown.fi_quote_input', "#fiquote_caption1000", function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;

            //if button is up, down, left, right, del, tab then allow it
            if (allowedKeys.indexOf(charCode) > -1) {
                return true;
            }
            if ((charCode > 47 && charCode < 58) || (charCode > 95 && charCode < 106)) {
                return true;
            }
            return false;
        });
        body.off('keyup.fi_quote_input', inputSelectors).on('keyup.fi_quote_input', inputSelectors, function (evt) {
            var _this = $(this);
            var container = _this.closest('#j_my_dealLookup');

            if (_this.attr('id') == 'fiquote_caption1000') {
                var inputs = container.find('#customer_caption1000, #stock_caption1000, #customer_name_caption1000, #customer_phone_caption1000, #customer_email_caption1000');
                inputs.removeClass('inactive').removeAttr('readonly disabled');
                if ($.trim(_this.val())) {
                    inputs.addClass('inactive').attr({'readonly': true, 'disabled': 'disabled'});
                }
            }
            checkInputHasValue(container, inputSelectors);
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if(charCode == 13) { // search on enter press
                $(this).closest('#j_my_dealLookup').find('.user-action-wrap').find('.deal_lookup_btn').click();
            }
        });
        body.off('change.deal_lookup_drop', options.deal_lookup_drop).on('change.deal_lookup_drop', options.deal_lookup_drop, function () {
            toggleFiQuoteFields($(this));
        });
    }
    ;
    function checkInputHasValue(container, inputSelectors) {
        var inputs = container.find(inputSelectors);
        var hasValue = inputs.filter(function () {
            return $.trim($(this).val());
        });
        var method = 'addClass';
        if (hasValue.length) {
            method = 'removeClass';
        }
        toggleLookupButton(container, method);
    }
    function toggleLookupButton(container, method) {
        container.find(options.deal_lookup_btn)[method]('inactive');
    }

    _init();
    function toggleRefreshDealButton(display_type, detailWrapper) {
        options.display_type = display_type;
        var container = $(options.detail_content);
        if (typeof detailWrapper != 'undefined') {
            container = detailWrapper;
        }
        var button_container = container.find(options.lookup_btn_container);
        if (display_type === 'view') {
            button_container.addClass('hide').find('button:last').addClass('disabled');
            container.find('.list-view-detail').addClass('auto-field');
        } else { // display_type == 'add'
            button_container.removeClass('hide');
            button_container.find('button:last').addClass('disabled');
            // if fiQuote input is not empty then enable the button and make "fi-quote-input" and "location" input disabled
            var fiQuoteInput = container.find(options.fi_quote_input);
            var locationinput = container.find(options.location_input);
            if ($.trim(fiQuoteInput.val()) && $.trim(locationinput.val())) {
                button_container.find('button:last').removeClass('disabled');
            }
            var inputs = $.merge(fiQuoteInput, button_container.closest('form').find(options.location_input));
            inputs.addClass('metrozone').attr({readonly: 'readonly'});
        }
        toggleDealLookupButton(container, display_type);
    }

    function toggleDealLookupButton(container, display_type) {
        var dealLookupBtn = container.find('form').find('.lookup-btn-wrap').find('.j_my_dealLookup_open');
        if(!dealLookupBtn.length) {
            return true;
        }
        dealLookupBtn.addClass('disabled');

        var activeFilter = leftNavigationModule.cache.action_flyout_active_menu; //
        var activeFilterText = '';
        if(typeof activeFilter != 'undefined') {
            activeFilterText = activeFilter.attr('data-original-title');
        } else {
            activeFilter = $("#menu_wraper").find('.menu-items').find('.panel-body').not(':first').find('li.active');
            activeFilterText = activeFilter.find('.item-list-detail').text();
        }

        if(canDealAdd) {
            if(display_type.toLowerCase() == 'add') {
                dealLookupBtn.removeClass('disabled');
                return true;
            }
            if(display_type.toLowerCase() == "edit" && activeFilterText.toLowerCase() != 'archived') {
                dealLookupBtn.removeClass('disabled');
            }
        }
    }

    function toggleFiQuoteFields(selected_drop, fi_quote_input) {
        var container = selected_drop.closest('#id_detail_content_dealLookup');
        if ($.trim(container.find('#fiquote_caption1000').val())) { // fiInput has value then do not modify input fields
            return true;
        }
        var inputs = container.find(inputSelectors);
        inputs.attr({readonly: true, disabled: 'disabled'});
        if ($.trim(selected_drop.val())) { // if dropdown is not empty then only allow user to type into the inputs.
            inputs.removeAttr('readonly disabled').removeClass('inactive');
        }
    }
    function showResult(response, container, pagination_response) {

        var searchContainer = container.find('.search-result-container');
        searchContainer.removeClass('hide');

        var fiSearchContainer = searchContainer.find('.fi-search-container');
        var customerSearchContainer = searchContainer.find('.customer-search-container');

        fiSearchContainer.addClass('hide');
        customerSearchContainer.addClass('hide');

        var resultContainer = fiSearchContainer;
        if (response.isCustomerSearch == 1) {
            resultContainer = customerSearchContainer;
        }
        var table_body = resultContainer.removeClass('hide').find('tbody');
        var items = response.item || [];
        table_body.html('');
        table_body.closest('#j_my_dealLookup').find('.flyout-pagination-box').remove();
        var list = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var tr = $('<tr />');
            var radio_added = false;
            for (var key in item) {
                var value = item[key];
                if (value == 'null' || value == null) {
                    value = '';
                }
                var td = $('<td />').text(value);
                if (!radio_added) {
                    radio_added = true;
                    tr.append($('<td />').append($('<input type="radio" value="' + item[key] + '" name="fi-quote-radio" class="pull-left"/>')));
                }
                tr.append(td);
            }
            table_body.append(tr);
        }

        if (!items.length) {
            var column_length = resultContainer.find('thead:first').find('th').length;
            table_body.append($('<tr class="no-data"><td colspan="' + column_length + '" style="text-align:center">'+ response.errorMsg +'</td></tr>'));
        }
        var pagination = '<div class="list-bottom flyout-pagination-box"><div class="paginationBottom pagination_row">' + pagination_response + '</div></div>';

        var parent = table_body.closest('.jq_flyout_body');
        parent.append(pagination);
        parent.find('.pagination_row').find('a').off('click.fi_lookup').on('click.fi_lookup', function () {
            handlePaginationClick($(this));
        });
        parent.find('input[name="fi-quote-radio"]').off('click.fi-quote-radio').on('click.fi-quote-radio', function (evt) {
            evt.preventDefault();
            var radio_btn = $(this);
            var containerTable = radio_btn.closest('.table');
            var fiFlyout = containerTable.closest('#j_my_dealLookup');
            var callbackSettings = {};
            if (containerTable.hasClass('customer-search-container')) {
                callbackSettings = {
                    message: 'Please confirm if you want to search for Customer #' + radio_btn.val() + '?',
                    callback: function () {
                        doLookup('', {customer_lookup: radio_btn.val(), location: fiFlyout.find('select[name="location_lookup"]').val()});
                    }
                };
            } else if (containerTable.hasClass('fi-search-container')) {
                callbackSettings = {
                    message: 'Please confirm if you want to search for FI Quote #' + radio_btn.val() + '?',
                    callback: function () {

                        var editDealElement = $("#editDeal");
                        var fiInput = editDealElement.find(options.fi_quote_input);
                        var dealLocationInput = editDealElement.find(options.location_input);

                        var showOverrideConfirmation = false;
                        fiInput.val($.trim(fiInput.val()));
                        dealLocationInput.val($.trim(dealLocationInput.val()));

                        if (fiInput.val() != '' && fiInput.val() != radio_btn.val()) {
                            showOverrideConfirmation = true;
                        }
                        if (dealLocationInput.val() != '' && dealLocationInput.val() != fiFlyout.find('select[name="location_lookup"]').val()) {
                            showOverrideConfirmation = true;
                        }
                        var callbackFun = function () {
                            // if fi-input has value then store it so that it can be put back when ajax fails
                            if(fiInput.val()) {
                                options.old_fi_number = {
                                    fi: fiInput.val(),
                                    location: dealLocationInput.val()
                                };
                            }
                            fiInput.val(radio_btn.val());
                            dealLocationInput.val(fiFlyout.find('select[name="location_lookup"]').val());
                            editDealElement.closest('form').find('.lookup-btn-wrap').find('button:last').removeClass('disabled');
                            // as per new modification, "Save as draft" and "Publish" buttons will be inactive.
                            // When user comes from "Deal Lookup" flyout and have "fi-quote number" and "location" available then only enable both buttons.
                            // On "Dashboard" page, "Save As Draft" and "Publish" buttons are inside ".user-action-wrap" wrapper instead of ".action-bar-wrap"
                            var buttonWrapper = $('.action-bar-wrap:visible');
                            if(!buttonWrapper.length) {
                                buttonWrapper = $('#j_my_createDeal').find('.user-action-wrap:visible');
                            }
                            buttonWrapper.find('.call-detail-action-bt').removeClass('inactive');
                            searchFi();
                        };
                        if (showOverrideConfirmation) {
                            var params = {
                                callback: callbackFun
                            };
                            fiQuoteOverrideConfirmation(params);
                        } else {
                            callbackFun();
                        }
                        var collection = $.merge(fiInput, dealLocationInput);
                        collection.attr('readonly', 'readonly');

                        // open clopased pane if it is not open
                        if (!editDealElement.hasClass('in')) {
                            editDealElement.prev().click();
                        }
                        fiFlyout.find('.user-action-wrap').find('.j_my_dealLookup_close').click(); // close the flyout
                    }
                };
            }
            processLookup(radio_btn, callbackSettings);
        });
    }
    function fiQuoteOverrideConfirmation(params) {
        bootbox.confirm({
            title: 'Confirm',
            message: 'Are you sure you want to overwrite existing deal with new deal number?',
            callback: function (state) {
                if (state) {
                    params.callback();
                }
            }
        });
    }
    function processLookup(radio_btn, callbackSettings) {
        bootbox.confirm({
            title: 'Confirm',
            message: callbackSettings.message,
            callback: function (state) {
                if (state) {
                    var activeRow = radio_btn.closest('tbody').find('.active-row');
                    activeRow.find('input[name="fi-quote-radio"]').removeAttr('checked');
                    activeRow.removeClass('active-row');
                    radio_btn.closest('tr').addClass('active-row');
                    radio_btn.prop("checked", true);
                    callbackSettings.callback();
                }
            }
        });
    }
    function handlePaginationClick(pagination_anchor) {
        var extra_params = {
            page: pagination_anchor.data('page')
        };
        doLookup('', extra_params);
    }
    function doLookup(clicked_element, extra_params) {

        if ($(clicked_element).hasClass('inactive')) {
            return true;
        }
        var container = $('#id_detail_content_dealLookup');
        var loader = container.closest("#j_my_dealLookup").find("#content_loader_dealLookup");

        var values = '';
        var paginationSettings = {
            record_per_page: options.record_per_page,
            page: options.current_page,
            pagination_record_array: [],
            hide_rest_filter: 1,
            hide_numof_records: 1
        };
        if (typeof extra_params != 'undefined') {
            paginationSettings = $.extend(paginationSettings, extra_params);
        }
        if (typeof extra_params != 'undefined' && 'customer_lookup' in extra_params) {
            values = 'customer_lookup=' + extra_params.customer_lookup + '&location_lookup=' + extra_params.location;
        } else {
            values = container.find('input, select').not('input[name="fi-quote-radio"]').serialize();
        }
        values += '&action=fiLookup&mode=lookup_result&page=' + paginationSettings.page;
        loader.show();

        $.when(ActionModule.ajax(values)).done(function (response) {
            //var level1Response = $.parseJSON(response);
            var level1Response = response;
            paginationSettings.total_record = level1Response.total_records;
            $.when(paginationOfPluginList(true, paginationSettings)).done(function (pagination_response) {
                showResult(level1Response, container, pagination_response);
                applyJs();
                // pagination section takes some time to show properly, so allow it first then hide the loader
                setTimeout(function () {
                    loader.hide();
                }, 500);
            });
        });
    }
    return {
        toggleRefreshDealButton: toggleRefreshDealButton,
        toggleFiQuoteFields: toggleFiQuoteFields,
        doLookup: doLookup,
        resetSearch: function (reset_btn) {
            var container = $(reset_btn).closest('#j_my_dealLookup');
            var defaultSelected = container.find('select[name="location_lookup"]').data('default');
            $(reset_btn).closest('.user-action-wrap').find('.deal_lookup_btn').addClass('inactive'); // make lookup button inactive
            if (container.find('select[name="location_lookup"]').val() != 'Select') {
                container.find(inputSelectors).removeAttr('disabled readonly').removeClass('inactive').val('');
            }
            container.find('select[name="location_lookup"]').val(defaultSelected);
            container.find('.newDropDown').text(defaultSelected);
            container.find('.search-result-container').addClass('hide');
            container.find('.flyout-pagination-box').remove();//remove pagination section
        },
        handlePaginationClick: handlePaginationClick,
        resetFlyout: function (cancel_btn) {
            $(cancel_btn).closest('#j_my_dealLookup').find('.flyout-pagination-box').remove();
        },
        revertOldFiNumber: function () {
            var editDealElement = $("#editDeal");
            if('fi' in FIQuoteModule.options.old_fi_number) { // if old value exists then only apply this
                editDealElement.find(options.fi_quote_input).val(options.old_fi_number.fi);
                editDealElement.find(options.location_input).val(options.old_fi_number.location);
                FIQuoteModule.options.old_fi_number = {};
            }
        },
        options: options,
        storeOldFiNumber: function() {
            var editDealElement = $("#editDeal");
            options.old_fi_number = {
                fi: editDealElement.find(options.fi_quote_input).val(),
                location: editDealElement.find(options.location_input).val()
            };
        }
    };
}());

/**
 * [FormValidationModule description: Js Module to validate forms ]
 * @type {[type]} (Object)
 */
var FormValidationModule = (function() {

    return {
        /**
         * [isFormEmpty description: Check whether form has at least one input with value ]
         * @param  {[String]}  form            [ Selector of the form ]
         * @param  {[String]}  input_selector  [ Selector of form input ]
         * @param  {[String]}  msg             [ Message to display in bootbox alert if form is empty ]
         * @return {Boolean}                   [ true if form is empty otherwise false ]
         */
        isFormEmpty: function( form, input_selector, msg ) {

            var formValue = UtilityModule.getFormState(form, input_selector);
            if(formValue && formValue.length) {
                return false;
            }
            //if error message is provided then show alert
            if(msg) {
                this.showAlert(msg);
            }
            return true;
        },
        /**
         * [showAlert description: Function to show bootbox alert ]
         * @param  {[String]} msg [ Error message to show in alert ]
         * @return {[undefined]}  [ undefined ]
         */
        showAlert: function(msg) {
            bootbox.alert({
                title: 'Alert',
                message: msg
            });
        },
        
       isInputEmpty:function(input_selector){
            
            if(input_selector.is("[type=text]")){
                 return this.isTextBoxEmpty(input_selector);
               
            }
            return true;
        },
        tBoxEmpty:function(input_selector){
            
            if(input_selector.is('input:text') && input_selector.hasClass('auto-suggest')){
                var eleLength = input_selector.closest('.receivedListBox').find('.global_participant_box_wrap').length;
                if(eleLength>0){
                    return false;
                }
            }
            var eleValue = input_selector.val();
            if($.trim(eleValue)===''){
                return false;
            }
            return true;
          
        },
    }
}());
