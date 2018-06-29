<?php
include "config.php";
if (isset($_GET['cookie']) && !empty($_GET['cookie'])) {
    $cookie                                         = json_decode($_GET['cookie']);
    $userCredential                                 = $cookie->userData;
    //$oldSessId                                    = $cookie->sessId;
    $emailAdd                                       = $userCredential->emailaddress;
    $password                                       = $userCredential->password;
    //$domainName                                   = $userCredential['domainName'];
}

// loading assets from CDN or filesystem based on server
if(AWS_BUCKET === 'localdevbucket' || AWS_BUCKET === 'pudevbucket') {
    $assetsUrl = BASE_URL_API . '/';
} else {
    $assetsUrl = PU_CDN_URL.'puidata/';
}
?>

<style type="text/css">
    .preload{
        opacity: 0.5;
    }
    .preload img {
        position: fixed;
        top: 50%;
        left: 50%;
        width: inherit;
        margin-top: -32px;
        margin-left: -32px;
    }
</style>

<div class="preload">
    <!-- <img src="<?php // echo BASE_URL_API;  ?>img/loader-big.gif"> -->
</div>

<?php
if ($_GET['user']) { ?>
    <?php if ($_GET['user'] != 'www.pui.com') { ?>
        <?php
        $firstObj                                   = new builderApi();
        $pluginData                                 = $firstObj->getPluginStructure($_GET['user']);
        $tempPluginArray                            = json_decode($pluginData, true);
        $pluginArray                                = $tempPluginArray['data']['comment'];
        ?>
    <?php } else { ?>
        <?php
        $pluginArray['domain'] = $_GET['user'];
        if ($_GET['isVessel'] == 'Y')
            $pluginArray['dialogue'] = 'false';
        else
            $pluginArray['dialogue'] = 'True';
        $user_info['first_name'] = $_GET['first_name'];
        $user_info['last_name'] = $_GET['last_name'];
        $user_info['date_of_birth'] = $_GET['date_of_birth'];
        $user_info['email_address'] = $_GET['email_address'];
        $user_info['node_id'] = $_GET['node_id'];
        $user_info['profile_image'] = $_GET['profile_image'];
        $user_info['initial_name'] = strtoupper($user_info['first_name'][0].$user_info['last_name'][0]);
        ?>

        <?php
    }
    //echo "<pre>"; print_r($pluginArray);die;
    ?>
    <?php if ($pluginArray['domain'] != '') { ?>

        <?php if ($pluginArray['domain'] != 'www.pui.com') { ?>
            <script type="text/javascript">
                var userDomainName = "<?php echo $pluginArray['domain']; ?>";
                var userRegisterRole = "<?php echo $pluginArray['registration_role']; ?>";
                var userComapnyName = "<?php echo $pluginArray['company_name']; ?>";
                var setUsername = '';
                var setUserID = '';
                var myDropzone;
                var chattimer = 0;
                var domainUrlApi = "<?php echo BASE_URL_API; ?>";
                var socketUrl = "<?php echo SOCKET_URL; ?>";
                var sessId = "<?php echo $_GET['sessId']; ?>";
                var is_roles = "<?php echo $pluginArray['roles']; ?>";

                // css files

                $('head').find('title').after('<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300,700" rel="stylesheet" type="text/css">');
                $('head').append('<link rel="stylesheet" href="<?php echo $assetsUrl; ?>css/bootstrap.min.css" />');
                $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />');
                $('head').append('<link rel="stylesheet" href="<?php echo $assetsUrl; ?>css/nanoscroller.css" />');
                $('head').append('<link rel="stylesheet" href="<?php echo $assetsUrl; ?>css/header-style.css" />');

                // js files
                $('head').append('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/script_api.js" />');
                $('head').append('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/jquery.nanoscroller.js" />');
                $('head').find('script').eq(0).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/bootstrap.min.js" />');
                $('head').find('script').eq(1).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/bootbox.min.js" />');
                $('head').find('script').eq(2).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/jquery_nicescroll_min.js" />');


            <?php //if ($pluginArray['association'] == 'True') { ?>
                    $('head').find('script').eq(3).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/signIn.js" />');
                    $('head').find('script').eq(4).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/signUp.js" />');
                    $('head').find('script').eq(5).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/jquery.cookie.js" />');
                    $('head').find('script').eq(6).after('<script type="text/javascript" src="<?php echo $assetsUrl; ?>js/browser-support-script.js" />');

            <?php //} ?>
            </script>

            <?php if ($pluginArray['domain'] == 'www.investible.com') { ?>
                <script type="text/javascript">
                    $('body').on('load', function () {
                        var headermarTop = $(".header-stick-top").height();
                        $(".advertisement-banner").css("margin-top", headermarTop - 1);
                        $(".header-new").css("margin-top", headermarTop - 1);
                    });
                </script>
            <?php
            }
            //For investible
            if ($pluginArray['domain'] == 'www.prospus.com') {
                ?>
                <script type="text/javascript">
                    $('head').append('<link rel="stylesheet" href="<?php echo $assetsUrl; ?>page_plugin/component/common-style.css" />');
                </script>
            <?php } ?>

        <?php } else if ($pluginArray['domain'] == 'www.pui.com') { ?>
            <script type="text/javascript">
                var userDomainName = "<?php echo $pluginArray['domain']; ?>";
                var userRegisterRole = "<?php echo $pluginArray['registration_role']; ?>";
                var userComapnyName = "<?php echo $pluginArray['company_name']; ?>";
                var setUsername = '';
                var setUserID = '';
                var myDropzone;
                var chattimer = 0;
                var domainUrlApi = "<?php echo BASE_URL_API; ?>";
                var socketUrl = "<?php echo SOCKET_URL; ?>";
                var is_roles = "<?php echo $pluginArray['roles']; ?>";
                setUsername = "<?php echo $user_info['first_name'] . " " . $user_info['last_name']; ?>";
                setUserID = "<?php echo $user_info['node_id']; ?>";
                var userEmail = "<?php echo $user_info['email_address']; ?>";
                var profileImage = "<?php echo $user_info['profile_image']; ?>";
                var firstName = "<?php echo $user_info['first_name']; ?>";
                var lastName = "<?php echo $user_info['last_name']; ?>";
                if(profileImage=="0"){
                    profileImage = 0;
                }
                var initialName = "<?php echo $user_info['initial_name']; ?>";

            </script>
        <?php } ?>

        <div id="full_page_loader" class="loader-wrapper" <?php if ($pluginArray['domain'] == 'www.pui.com'): ?>style="display: none;" <?php endif; ?> <?php if (empty($_SESSION)): ?>style="display: none;" <?php endif; ?>>
            <div class="<?php if ($pluginArray['domain'] == 'www.marinemax.com') { ?>loader-bg-mm<?php } else { ?>loader-bg<?php } ?>">
                <?php if ($pluginArray['domain'] == 'www.marinemax.com') { ?>
                    <img src="<?php echo $assetsUrl; ?>img/loader.gif" alt="Marinemax">
                <?php } else { ?>
                    <div class="loader"></div>
        <?php } ?>
            </div>
        </div>

        <!--header-starts-->
        <div id="sticky-anchor"></div>
        <div class ='load-content-render' style ="display:none;">
            <header class="header-stick-top pu_plugin_head_stick" >
                <div class="header-wrapper clearfix">
                    <!-- Left Maenu Icon -->
                    <div class="logo left <?php if ($pluginArray['left_menu'] == 'True') { ?>slide-left-animate<?php } ?>">
                        <a href="javascript:void(0);">
                            <?php if (trim($pluginArray['company_small_icon_url']) != '') { ?>
                                <img src="<?php echo trim($pluginArray['company_small_icon_url']); ?>" alt="<?php echo trim($pluginArray['company_name']); ?>">
                            <?php } else { ?>
                                <img src="<?php echo $assetsUrl; ?>img/prospus-logo-small.png" alt="<?php echo trim($pluginArray['company_name']); ?>">
        <?php } ?>
                        </a>
                    </div>
                    <!-- Roles -->
                    <div class="user-roles left">
                        <div class="user-wrap dropdown users-role">
                                    <?php if ($pluginArray['roles'] == '' || $pluginArray['roles'] == 'False') { ?>
                                <a data-toggle="dropdown" href="javascript:void(0);" class="select-user-role">
                                    <span class="changed-user-role" data-roleid="">
                                <?php if (trim($pluginArray['company_name']) != '') {
                                    echo trim($pluginArray['company_name']);
                                } else { ?>Prospus<?php } ?> . Guest
                                    </span>
                                    <span id="dd_img_pu_plugin" style="display:none;" class="caret-img"><img src="<?php echo $assetsUrl; ?>img/down_arrow.png" class="img-responsive"></span>
                                </a>
                                <ul id="user-roles-ul" class="dropdown-menu select-user-role" role="menu" aria-labelledby="dLabel"></ul>
                                    <?php } ?>
                                <?php if ($pluginArray['roles'] == 'True') { ?>
                                <a data-toggle="dropdown" href="javascript:void(0);" class="select-user-role">
                                    <span class="changed-user-role" data-roleid="">
                                <?php if (trim($pluginArray['company_name']) != '') {
                                    echo trim($pluginArray['company_name']);
                                } else { ?>Prospus<?php } ?> . Guest
                                    </span>
                                    <span id="dd_img_pu_plugin" style="display:none;" class="caret-img"><img src="<?php echo $assetsUrl; ?>img/down_arrow.png" class="img-responsive"></span>
                                </a>
                                <ul id="user-roles-ul" class="dropdown-menu select-user-role" role="menu" aria-labelledby="dLabel"></ul>
                        <?php } ?>
                        </div>
                    </div>

                    <!-- Registraion / Login/ Logout / Minidialog -->
                    <div class="right-header right pu_plugin_right_head">



                        <?php if ($pluginArray['domain'] == 'www.pui.com') { ?>
                                            <div class="login-box">
                                                <div class="links-box">

                                                    <div class="user-action dropdown ">
                                                        <a data-toggle="dropdown" href="javascript:void(0);">

                                                            <div class="user-icon"><?php if(trim($user_info['profile_image'])=="0"){
                                                                ?> <span class="initials-box"><?php echo $user_info['initial_name']; ?></span><?php
                                                            }else{
                                                                ?> <img src="<?php echo $user_info['profile_image']; ?>" alt="drop arrow"> <?php
                                                            } ?></div>
                                                        </a>
                                                        <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                                            <li class="">
                                                                <a  href="javascript:void(0)" class="logout-hidden logout-class logout-user-all">
                                                                    Logout
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <input class="logout-class" type="hidden" id="first_name" name="first_name" value="<?php echo $user_info['first_name']; ?>" />
                                                    <input type="hidden" class="logout-class" id="last_name" name="last_name" value="<?php echo $user_info['last_name']; ?>" />
                                                    <input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="<?php echo $user_info['date_of_birth']; ?>" />
                                                    <input class="logout-class" type="hidden" id="email_address" name="email_address" value="<?php echo $user_info['email_address']; ?>" />
                                                    <input class="logout-class" type="hidden" id="node_id" name="node_id" value="<?php echo $user_info['node_id']; ?>" />
                                                </div>

                                            </div>
                                                <?php } else { ?>
                                            <div class="login-box">
                                                <div class="links-box">
                                                    <?php if ($pluginArray['association'] == 'True') { ?>
                                                                                <a href="javascript:void(0);" class="flyoutMD log-class" id="fly-Associate">Register</a>
                                                    <?php } ?>
                                                    <?php if ($pluginArray['authentication'] == 'True') { ?>
                                                                                <a href="javascript:void(0);" class="flyoutMD log-class" id="fly-login">Login</a>
                                                    <?php } ?>
                                                    <div class="user-action dropdown hide">
                                                        <a data-toggle="dropdown" href="javascript:void(0);">
                                                            <span class ='login-user-name'><span class='login-user-fullname'></span><span class="downArrowIcon">
                                                                    <img src="<?php echo $assetsUrl; ?>img/down_arrow.png" alt="drop arrow">
                                                                </span>
                                                            </span>
                                                        </a>
                                                        <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                                            <li class="">
                                                                <a  href="javascript:void(0)" class="logout-hidden" onclick="logoutUser();">
                                                                    Logout
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>


                                                </div>
                                            </div>
                        <?php } ?>
                        <?php if ($pluginArray['dialogue'] == 'True') { ?>
                                            <div class="user-img mini-chat show-mini pu_plugin_mini_chat" id="miniDialogue" onclick = "getAllCourse();" <?php if ($pluginArray['domain'] != 'www.pui.com') { ?>style="display:none;"<?php } ?> ><i class="<?php if ($pluginArray['domain'] == 'www.pui.com') { ?>icon<?php } else { ?>sm-icon<?php } ?> sm-mini-chat"></i></div>

                                            <!--<div class="user-img mini-chat show-mini pu_plugin_mini_chat" id="hj" onclick = "getAllCourse();" <?php if ($pluginArray['domain'] != 'www.pui.com') { ?>style="display:none;"<?php } ?> ><i class="<?php if ($pluginArray['domain'] == 'www.pui.com') { ?>icon<?php } else { ?>sm-icon<?php } ?> sm-mini-chat"></i></div> -->
                        <?php } ?>

                    </div>
                </div>

        <?php if ($pluginArray['domain'] != 'www.pui.com') { ?>
                    <!-- Top Menu -->
                    <div class="navigation-resp navigation-fixed">
                        <div class="container-fluid pad0X">
                            <div class="row">
                                <div class="col-md-12 col-sm-12 col-xs-12 padNullMobileView">
                                    <nav class="navbar navbar-default">
                                        <div class="container-fluid customPadNone-11x">
                                            <!-- Brand and toggle get grouped for better mobile display -->
                                            <div class="navbar-header">
                                                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                                    <span class="sr-only">Toggle navigation</span>
                                                    <span class="icon-bar"></span>
                                                    <span class="icon-bar"></span>
                                                    <span class="icon-bar"></span>
                                                </button>
                                            </div>

                                            <!-- Collect the nav links, forms, and other content for toggling -->
                                                <?php if ($pluginArray['top_menu'] == 'True') { ?>
                                                <div class="collapse navbar-collapse pad0X mobile-menu left" id="bs-example-navbar-collapse-1">
                                                    <div class="logo left sec-logo">
                                                        <a href="javascript:void(0);"><img src="<?php echo $assetsUrl; ?>img/investible_logo_blue.png" alt=""></a>
                                                    </div>
                                                    <?php
                                                    $menuObj = new builderApi();
                                                    $menuData = $menuObj->getMenuStructure($pluginArray['domain']);
                                                    $menuArray = json_decode($menuData, true);
                                                    ?>
                                                        <?php

                                                        function submenu($subMenu) {
                                                            foreach ($subMenu as $key => $menu) {
                                                                ?>
                                                            <li <?php if (is_array($menu['child'])) { ?>class="dropdown sub-menu_dropdown"<?php } ?> >
                                                                <a <?php if (is_array($menu['child'])) { ?>class="trigger right-caret"<?php } else { ?>href="<?php echo $menu['Hyperlink']; ?>"<?php } ?> ><?php echo $menu['Title']; ?></a>
                                                            <?php if (is_array($menu['child'])) { ?>
                                                                    <ul class="dropdown-menu sub-menu" >
                                                                <?php submenu($menu['child']); ?>
                                                                    </ul>
                                                                <?php } ?>
                                                            </li>
                        <?php
                    }
                }
                ?>
                                                    <ul class="nav navbar-nav plugin-nav " id="primary">
                <?php foreach ($menuArray['data'] as $key => $menu) { ?>
                                                            <li>
                                                                <a href="<?php echo $menu['Hyperlink']; ?>" ><?php echo $menu['Title']; ?></a>
                                                            </li>
                                                    <?php } ?>
                                                    </ul>

                                                    <!-- <ul class="nav navbar-nav plugin-nav " id="primary">
                                                    <?php foreach ($menuArray['data'] as $key => $menu) { ?>
                                                                <li <?php if (is_array($menu['child'])) { ?>class="dropdown"<?php } ?> >
                                                                    <a <?php if (is_array($menu['child'])) { ?>class="btn drp-btn dropdown-toggle" data-toggle="dropdown"<?php } else { ?>href="<?php echo $menu['Hyperlink']; ?>"<?php } ?> ><?php echo $menu['Title']; ?><?php if (is_array($menu['child'])) { ?><span class="caret"></span><?php } ?></a>
                                                        <?php if (is_array($menu['child'])) { ?>
                                                                        <ul class="dropdown-menu sub-menu sub-drps" >
                                                        <?php submenu($menu['child']); ?>
                                                                        </ul>
                    <?php } ?>
                                                                </li>
                <?php } ?>
                                                    </ul> -->
                                                </div>
                    <?php } ?>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
        <?php } ?>
            </header>


            <!-- Footer -->
            <!-- Left Sidebar hover  calender work we have removed ... backup in __PLUGIN_OPTIMIZATION  folder-->

            <!-- Left Sidebar hover end -->

            <!--==============================Chat window Dialogue Flyout start================================-->

            <!--==============================Chat window Dialogue Flyout End==================================-->

            <!--Association modal-->

                <?php if ($pluginArray['domain'] != 'www.pui.com') { // $pluginArray['association'] == 'True' &&  ?>
                <div class="modalFlyout user-login-flyout pu_plugin_modal_flyout" id="fly-Associate">
                    <?php
                    $apiObj = new builderApi();
                    $returnData = $apiObj->getDataAndStructure('275602', '6', '2');
                    $signUpArray = json_decode($returnData, true);
                    ?>
                    <?php

                    function generateRandomString($length = 10) {
                        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        $charactersLength = strlen($characters);
                        $randomString = '';
                        for ($i = 0; $i < $length; $i++) {
                            $randomString .= $characters[rand(0, $charactersLength - 1)];
                        }
                        return $randomString;
                    }

                    function getAllProperties($childArray, $is_display) {
                        ?>
                            <?php foreach ($childArray as $key => $value) { ?>
                            <div class="form-box clearfix" <?php if ($is_display == 'N') {
                        echo "style='display:none;'";
                        } ?> >
                                <?php
                                $randData = generateRandomString(10);
                                $string1 = $value['nodeZStructure']['VALIDATION'][0]['value'];

                                preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);
                                if (count($matches) > 0 && isset($matches[1])) {
                                    $newString2 = '';
                                    foreach (array_reverse($matches[1]) as $key11 => $value11) {
                                        $newString2.= 'check' . $randData . '' . $value11 . "('this.value');";
                                        $replaceStr = 'check' . $randData . '' . $value11;
                                        $string1 = str_replace($value11, $replaceStr, $string1);
                                    }
                                    $newString2 = substr($newString2, 0, -1);
                                }
                                ?>
                                <div class="form-group col-md-12 col-sm-12 col-xs-12" <?php if (strtolower($value['caption']) == 'date of birth') { ?> style="display:none;" <?php } ?> >
                                    <!--label for="<?php echo $value['caption']; ?>"><?php echo $value['caption']; ?></label-->
                    <?php if (!is_array($value['child'])) { ?>
                                        <input id="instance_property_id<?php echo $value['node_class_property_id']; ?>" name="instance_property_id_<?php echo $value['node_class_id']; ?>[]" type="hidden" value="<?php echo $value['node_class_property_id']; ?>" />
                                        <?php if (strtolower($value['caption']) == 'password') { ?>
                                            <input type="password" placeholder= "Password" class="form-control   <?php echo str_replace(' ', '_', strtolower($value['caption'])) . '_signup'; ?>" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption_<?php echo $value['node_class_id']; ?>[]" placeholder=""/>
                                        <?php } else { ?>
                                            <input type="text" placeholder = "<?php echo $value['caption']; ?>" class="form-control signup-fields <?php echo str_replace(' ', '_', strtolower($value['caption'])) . '_signup'; ?>" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption_<?php echo $value['node_class_id']; ?>[]" placeholder="" validate-data="<?php echo $newString2; ?>">
                        <?php } ?>

                                <?php if (!empty($matches[1]) && $string1 != "") { ?>
                                            <script type="text/javascript" >
                            <?php echo $string1; ?>
                                            </script>
                        <?php } ?>
                    <?php } ?>
                                </div>
                            </div>

                            <?php if (strtolower($value['caption']) == 'password') { ?>
                                <div class="form-box clearfix" <?php if ($is_display == 'N') {
                            echo "style='display:none;'";
                        } ?> >
                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                        <!--label for="confirm password">confirm password</label-->
                                        <input type="password" class="form-control" id="confirm_password"  name="confirm_password" placeholder="Confirm Password"/>
                                    </div>
                                </div>
                                <?php } ?>
                                <?php if (is_array($value['child'])) { ?>
                                    <?php getAllProperties($value['child'], $is_display); ?>
                    <?php } ?>
                <?php } ?>
            <?php } ?>

                    <div class="login-header">
            <?php if (trim($pluginArray['company_large_icon_url']) != '') { ?>
                            <img src="<?php echo trim($pluginArray['company_large_icon_url']); ?>" class="img-responsive" />
            <?php } else { ?>
                            <img src="<?php echo $assetsUrl; ?>img/investible_logo_full_white_web.png" class="img-responsive"/>
            <?php } ?>
            <?php if (trim($pluginArray['is_large_icon_and_name_display']) == 'Yes') {
                echo trim($pluginArray['company_name']);
            } ?>
                    </div>

                    <div class="left">
                        <div class="flyout-body-area clearfix">
                            <div class="login-body">
                                <div class="nano">
                                    <div class="nano-content">
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 margin-none">
                                                <span class="err-msg hide">
                                                    <img src="<?php echo $assetsUrl; ?>img/warning-icon.svg"/>
                                                    <span class ="error_msg_signup text-danger display-msg "></span>
                                                </span>
                                            </div>
                                        </div>
                                        <span id="success_msg_signup" class="text-success display-msg hide"></span>

                                        <form class="dialog-form" id="signUpForm" name="signUpForm" >
            <?php $node_class_ids = $signUpArray['data']['node_class_id']; ?>

                                                    <?php foreach ($signUpArray['data']['Properties']['2919']['child'] as $key => $value) { ?>

                                                <div class="form-box clearfix">
                                                    <div class="form-group col-md-12 col-sm-12 col-xs-12  form-text-pd">
                                                        <p class="register-fill-info">Please fill in the fields below to create a new Prospus account.</p>
                                                    </div>
                                                </div>
                                                <div class="form-box clearfix">
                                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                        <label class="formHead" for="<?php echo $value['caption']; ?>"><?php echo $value['caption']; ?></label>
                                                <?php if (!is_array($value['child'])) { ?>
                                                            <input id="instance_property_id<?php echo $value['node_class_property_id']; ?>" name="instance_property_id_<?php echo $value['node_class_id']; ?>[]" type="hidden" value="<?php echo $value['node_class_property_id']; ?>" />
                                                            <input type="text" class="form-control" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption_<?php echo $value['node_class_id']; ?>[]" />
                                                <?php } ?>
                                                    </div>
                                                </div>
                                                <?php if (is_array($value['child'])) { ?>
                                                    <?php getAllProperties($value['child'], 'Y'); ?>
                                                <?php } ?>

            <?php } ?>

                                                    <?php $role = $signUpArray['data']['SubClass'][0];
                                                    $account = $signUpArray['data']['SubClass'][1]; ?>

                                                    <?php $node_class_ids = $node_class_ids . "," . $role['node_class_id']; ?>
            <?php
            $is_display = 'Y';
            if ($role['caption'] == 'Role') {
                $is_display = 'N';
            }
            ?>
                                            <?php foreach ($role['Properties']['2924']['child'] as $key => $value) { ?>
                                                <div class="form-box clearfix" <?php if ($is_display == 'N') {
                                                    echo "style='display:none;'";
                                                } ?> >
                                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                        <label for="<?php echo $value['caption']; ?>"><?php echo $value['caption']; ?></label>
                                                        <?php if (!is_array($value['child'])) { ?>
                                                            <input id="instance_property_id<?php echo $value['node_class_property_id']; ?>" name="instance_property_id_<?php echo $value['node_class_id']; ?>[]" type="hidden" value="<?php echo $value['node_class_property_id']; ?>" />
                                                            <input type="text" class="form-control" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption_<?php echo $value['node_class_id']; ?>[]" />
                                                        <?php } ?>
                                                    </div>
                                                </div>
                                                <?php if (is_array($value['child'])) { ?>
                                                    <?php echo getAllProperties($value['child'], $is_display); ?>
                                                <?php } ?>
                                            <?php } ?>

            <?php $node_class_ids = $node_class_ids . "," . $account['node_class_id']; ?>
            <?php $is_display = 'Y'; ?>
            <?php foreach ($account['Properties']['2930']['child'] as $key => $value) { ?>
                                                <div class="form-box clearfix" <?php if ($is_display == 'N') {
                    echo "style='display:none;'";
                } ?> >
                                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                        <label class="formHead" for="<?php echo $value['caption']; ?>"><?php echo $value['caption']; ?></label>
                <?php if (!is_array($value['child'])) { ?>
                                                            <input id="instance_property_id<?php echo $value['node_class_property_id']; ?>" name="instance_property_id_<?php echo $value['node_class_id']; ?>[]" type="hidden" value="<?php echo $value['node_class_property_id']; ?>" />
                                                            <input type="text" class="form-control" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption_<?php echo $value['node_class_id']; ?>[]" />
                <?php } ?>
                                                    </div>
                                                </div>
                <?php if (is_array($value['child'])) { ?>
                    <?php getAllProperties($value['child'], $is_display); ?>
                <?php } ?>
            <?php } ?>

                                            <input type="hidden" id="node_class_id" name="node_class_id" value="<?php echo $node_class_ids; ?>" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="login-footer">
                                <p><a href="https://www.prospus.com" target="_blank"><img src="<?php echo $assetsUrl; ?>img/powerd-by-prospus.svg" alt=""></a></p>
                            </div>
                        </div>

                    </div>
                    <div class="user-section-strip user-action-login-strip pu_plugin_action_strip">
                        <div class="user-action-wrap">
                            <a  href="javascript:void(0)" onclick="signUpUser();" class="" data-original-title="Submit">
                                <img src="<?php echo $assetsUrl; ?>img/login-submit.svg"><br>
                                <span>Submit</span>
                            </a>
                            <a  class="close-flyout"  href="javascript:void(0);">
                                <i class="icon cancel"></i><br>
                                <span>Close</span>
                            </a>
                        </div>
                    </div>
                </div>
                <?php } ?>
            <!-- end Association Modal -->

            <!-- Login Modal -->
                <?php if ($pluginArray['authentication'] == 'True' && $pluginArray['domain'] != 'www.pui.com') { ?>
                <div class="modalFlyout user-login-flyout pu_plugin_login_fly pu_plugin_modal_flyout" id="fly-login">
                    <?php
                    $loginData = $apiObj->getDataAndStructure('275709', '6', '2');
                    $loginArray = json_decode($loginData, true);
                    ?>

                            <?php

                            function generateRandomStrings($length = 10) {

                                $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                $charactersLength = strlen($characters);
                                $randomString = '';
                                for ($i = 0; $i < $length; $i++) {
                                    $randomString .= $characters[rand(0, $charactersLength - 1)];
                                }
                                return $randomString;
                            }
                            ?>

                            <?php

                            function getLoginProperties($childArray, $is_display) {

                                foreach ($childArray as $key => $value) {
                                    ?>
                            <div class="form-box clearfix">
                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                    <!--label for="email_login_add"><?php echo $value['caption']; ?></label-->

                                    <?php
                                    $randData = generateRandomStrings(10);
                                    $string1 = $value['nodeZStructure']['VALIDATION'][0]['value'];
                                    preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);

                                    if (count($matches) > 0 && isset($matches[1])) {
                                        $newString2 = '';
                                        foreach (array_reverse($matches[1]) as $key11 => $value11) {
                                            $newString2.= 'check' . $randData . '' . $value11 . "('this.value');";
                                            $replaceStr = 'check' . $randData . '' . $value11;
                                            $string1 = str_replace($value11, $replaceStr, $string1);
                                        }
                                        $newString2 = substr($newString2, 0, -1);
                                    }
                                    ?>

                                    <input type="hidden"  id="node_class_property_id_<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" name="node_class_property_id_<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" value="<?php echo $value['node_class_property_id']; ?>" />
                    <?php if (strtolower($value['caption']) == 'password') { ?>
                                        <input type="password" class="form-control login_form" id="<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" name="<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" placeholder="Password" validate-data="<?php echo $newString2; ?>" />
                    <?php } else { ?>
                                        <input type="email" class="form-control login_form" id="<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" name="<?php echo strtolower(str_replace(' ', '', $value['caption'])); ?>" placeholder = "Email Address" validate-data="<?php echo $newString2; ?>" />
                    <?php } ?>

                    <?php if (!empty($matches[1]) && $string1 != "") { ?>
                                        <script type="text/javascript" >
                        <?php echo $string1; ?>
                                        </script>
                    <?php } ?>
                                </div>
                            </div>
                <?php } ?>
            <?php } ?>

                    <div class="login-header">
            <?php if (trim($pluginArray['company_large_icon_url']) != '') { ?>
                            <img src="<?php echo trim($pluginArray['company_large_icon_url']); ?>" class="img-responsive" />
                                        <?php } else { ?>
                            <img src="<?php echo $assetsUrl; ?>img/investible_logo_full_white_web.png" class="img-responsive"/>
            <?php } ?>
            <?php if (trim($pluginArray['is_large_icon_and_name_display']) == 'Yes') {
                echo trim($pluginArray['company_name']);
            } ?>
                    </div>
                    <div class="flyout-body-area  left">



                        <div class="login-body clearfix ">
                            <div class="nano">
                                <div class="nano-content">
                                    <form class="dialog-form" id="signInForm" name="signInForm" >
                                        <div class="form-box clearfix">
                                            <div class="form-group  col-md-12 margin-none">
                                                <span class="err-msg hide">
                                                    <img src="<?php echo $assetsUrl; ?>img/warning-icon.svg"/>
                                                    <span class ="error_msg_signup text-danger display-msg"></span>
                                                </span>
                                            </div>
                                        </div>
                                        <!--<span id="success_msg_signup" class="text-success display-msg hide"></span>-->

            <?php foreach ($loginArray['data']['Properties']['2930']['child'] as $key => $value) { ?>
                                            <div class="form-box clearfix">
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12 form-text-pd">
                                                    <label class="formHead" for="email_login_add"><?php echo $value['caption']; ?></label>
                                                </div>
                                            </div>
                <?php if (is_array($value['child'])) { ?>
                    <?php getLoginProperties($value['child'], 'Y'); ?>
                <?php } ?>

            <?php } ?>
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-6 col-sm-6 col-xs-6">
                                                <div class="pu-checkbox">
            <?php $checked = '';
            if (isset($userData) && !empty($userData)) {
                $checked = 'checked';
            } ?>
                                                    <input type="checkbox" <?php echo $checked ?> name="rememberme" value="1" class="remember-me" id="checkBoxRemember">
                                                    <label for="checkBoxRemember">
                                                        Remember me
                                                    </label>
                                                </div>
                                            </div>
                                            <!--div class="form-group col-md-6 col-sm-6 col-xs-6">
                                                <div class="text-right">

                                                </div>
                                            </div-->
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div class="login-footer">
                            <p><a href="https://www.prospus.com" target="_blank"><img src="<?php echo $assetsUrl; ?>img/powerd-by-prospus.svg" alt=""></a></p>
                        </div>
                    </div>
                    <div class="user-section-strip user-action-login-strip pu_plugin_action_strip">
                        <div class="user-action-wrap">
                            <a  href="javascript:void(0)" onclick="signInUser();" class="" data-original-title="Submit">
                                <img src="<?php echo $assetsUrl; ?>img/login-new-icon.svg"/><br>
                                <span>Login</span>
                            </a>
                        <?php if ($pluginArray['forgot_password'] == 'True') { ?>
                                <a href="javascript:void(0);" class="forgotPwd flyoutFH" id="fly-password">
                                    <img src="<?php echo $assetsUrl; ?>img/forgot-password.svg"/><br>
                                    <span>Forgot Password</span>
                                </a>
            <?php } ?>
                            <a  class="close-flyout"  href="javascript:void(0);">
                                <i class="icon cancel"></i><br>
                                <span>Close</span>
                            </a>
                            <!-- <a  class="forgotPwd flyoutFH"  href="javascript:void(0);" id="fly-password">
                                <img src="<?php //echo BASE_URL_API; ?>img/forgot-password.svg"/><br>
                                <span>Forgot</span>
                            </a> -->


                        </div>
                    </div>
                </div>

        <?php } ?>
            <!-- end Login Modal -->

            <!--forgot-flyout-->
        <?php if ($pluginArray['forgot_password'] == 'True' && $pluginArray['domain'] != 'www.pui.com') { ?>
                <div class="modalFlyout user-login-flyout pu_plugin_modal_flyout forgot_password_flyout" id="fly-password">
                    <div class="login-header">
            <?php if (trim($pluginArray['company_large_icon_url']) != '') { ?>
                            <img src="<?php echo trim($pluginArray['company_large_icon_url']); ?>" class="img-responsive" />
            <?php } else { ?>
                            <img src="<?php echo $assetsUrl; ?>img/investible_logo_full_white_web.png" class="img-responsive"/>
            <?php } ?>
            <?php if (trim($pluginArray['is_large_icon_and_name_display']) == 'Yes') {
                echo trim($pluginArray['company_name']);
            } ?>
                    </div>
                    <div class="loader-wrapper ref-winHT forgot-password-loader-js" style="display:none">
                        <div class="loader-bg-mm">
            <?php
            if ($pluginArray['domain'] == 'www.prospus.com') {
                ?>
                  <img src="http://<?php echo $_SERVER['HTTP_HOST']?>/public/img/loader3.gif" alt="Investible">
                <?php
            } else {
                ?>
                   <img src="http://<?php echo $_SERVER['HTTP_HOST']?>/public/img/loader.gif" alt="Marinemax">
                <?php
                }
            ?>

                        </div>
                    </div>

                    <div class="flyout-body-area  left">
                        <div class="login-body clearfix ">
                            <div class="nano">
                                <div class="nano-content">
                                    <form class="dialog-form request-password-container" onsubmit="return requestPasswordChange(event);" novalidate data-step="1">
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 margin-none">
                                                <span class="err-msg hide">
                                                    <img src="<?php echo $assetsUrl; ?>img/warning-icon.svg"/>
                                                    <span class="error_msg_signup text-danger display-msg"></span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group form-text-pd col-md-12 col-sm-12 col-xs-12">
                                            <label>Forgot Password?</label>
                                            <p class="forgot-pass-txt">Please enter the email address used to register with Prospus and we will email you a code to reset your password.</p>

                                        </div>
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                <!--label for="email_login_add">Email address</label-->
                                                <input type="email" class="form-control" id="email_login_add" placeholder="Email Address" autocomplete="off" name="email-id"/>
                                            </div>
                                        </div>
                                    </form>

                                    <form class="dialog-form password-code-container hide" onsubmit="return submitPasswordCode(event);" novalidate data-step="2">
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 margin-none">
                                                <span class="err-msg hide">
                                                    <img src="<?php echo $assetsUrl; ?>img/warning-icon.svg"/>
                                                    <span class="error_msg_signup text-danger display-msg"></span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group form-text-pd col-md-12 col-sm-12 col-xs-12">
                                            <label>ENTER CODE</label>
                                            <p class="forgot-pass-txt">We have sent you an email with reset password code. Enter it below to continue to reset your password.</p>

                                        </div>
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                <input type="password" class="form-control" placeholder="Code" autocomplete="off" name="email-code" maxlength="5"/>
                                            </div>
                                        </div>
                                    </form>

                                    <form class="dialog-form password-confirm-container hide" onsubmit="return submitNewPassword(event);" novalidate data-step="3">
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 margin-none">
                                                <span class="err-msg hide">
                                                    <img src="<?php echo $assetsUrl; ?>img/warning-icon.svg"/>
                                                    <span class="error_msg_signup text-danger display-msg"></span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group form-text-pd col-md-12 col-sm-12 col-xs-12">
                                            <label>RESET PASSWORD</label>
                                            <div class="user-img-container" style="text-align:center">
                                                <div class="user-name">Creel Price</div>
                                                <div class="user-email">sa@pui.com</div>
                                            </div>
                                        </div>
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                <input type="password" class="form-control" placeholder="New Password" autocomplete="off" name="new-password" maxlength="15"/>
                                            </div>
                                        </div>
                                        <div class="form-box clearfix">
                                            <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                <input type="password" class="form-control" placeholder="Confirm Password" autocomplete="off" name="confirm-password" maxlength="15"//>
                                            </div>
                                        </div>
                                    </form>
                                    <form class="dialog-form password-updated-container hide" data-step="4">
                                        <div class="form-group form-text-pd col-md-12 col-sm-12 col-xs-12">
                                            <label>PASSWORD RESET</label>
                                            <p class="forgot-pass-txt">Your password has been reset. You can now use your new password to login.</p>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>

                        <div class="login-footer">
                            <p><a href="https://www.prospus.com" target="_blank"><img src="<?php echo $assetsUrl; ?>img/powerd-by-prospus.svg" alt=""></a></p>
                        </div>
                    </div>
                    <div class="user-section-strip user-action-login-strip pu_plugin_action_strip">
                        <div class="user-action-wrap">
                            <a  href="javascript:void(0);"  class="request-password-btn-js process-password-btn-step1" data-original-title="Submit" onclick="return requestPasswordChange(event);">
                                <img src="<?php echo $assetsUrl; ?>img/login-submit.svg"><br>
                                <span>Submit</span>
                            </a>
                            <a  href="javascript:void(0);"  class="password-code-btn-js hide process-password-btn-step2" data-original-title="Submit" onclick="return submitPasswordCode(event);">
                                <i class="icon arrow"></i><br>
                                <span>Next</span>
                            </a>
                            <a  href="javascript:void(0);"  class="new-password-btn-js process-password-btn-step3 hide" data-original-title="Submit" onclick="return submitNewPassword(event);">
                                <i class="icon tick"></i><br>
                                <span>Done</span>
                            </a>
                            <a  href="javascript:void(0);"  class="password-updated-btn-js process-password-btn-step4 hide" data-original-title="Submit" onclick="return showLoginScreen(event);">
                                <i class="icon tick"></i><br>
                                <span>Ok</span>
                            </a>
                            <a  class="close-flyout"  href="javascript:void(0);">
                                <i class="icon cancel"></i><br>
                                <span>Close</span>
                            </a>
                        </div>
                    </div>
                </div>
        <?php } ?>
            <!--forgot-flyout-->

        <?php if ($pluginArray['forgot_password'] == 'True' && $pluginArray['domain'] != 'www.pui.com') { ?>
                <!--change password flyout-->
                <div class="user-login-flyout" id="fly-reset" style="display:none;">
                    <div class="login-header">
            <?php if (trim($pluginArray['company_large_icon_url']) != '') { ?>
                            <img src="<?php echo trim($pluginArray['company_large_icon_url']); ?>" class="img-responsive" />
            <?php } else { ?>
                            <img src="<?php echo $assetsUrl; ?>img/investible_logo_full_white_web.png" class="img-responsive"/>
            <?php } ?>
            <?php if (trim($pluginArray['is_large_icon_and_name_display']) == 'Yes') {
                echo trim($pluginArray['company_name']);
            } ?>
                    </div>

                    <div class="flyout-body-area  left">
                        <div class="login-body clearfix ">
                            <form class="dialog-form">

                                <div class="form-box clearfix">
                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                        <label for="email_login_add">Password</label>
                                        <input type="email" class="form-control" id="email_login_add" placeholder=""/>
                                    </div>
                                </div>
                                <div class="form-box clearfix">
                                    <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                        <label for="email_login_add">Confirm Password</label>
                                        <input type="email" class="form-control" id="email_login_add" placeholder=""/>
                                    </div>
                                </div>


                            </form>
                        </div>

                        <div class="login-footer">
                            <p><a href="https://www.prospus.com" target="_blank"><img src="<?php echo $assetsUrl; ?>img/powerd-by-prospus.svg" alt=""></a></p>
                        </div>
                    </div>
                    <div class="user-section-strip user-action-login-strip pu_plugin_action_strip">
                        <div class="user-action-wrap">
                            <a  href=""  class="" data-original-title="Submit">
                                <i class="icon save"></i><br>
                                <span>Submit</span>
                            </a>
                            <a  class="close-flyout"  href="javascript:void(0);">
                                <i class="icon cancel"></i><br>
                                <span>Close</span>
                            </a>
                        </div>
                    </div>
                </div>
        <?php } ?>
            <div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="confirmation-signin-popup" data-backdrop="static">
                <div class="modal-dialog small-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">Confirm</h4>
                        </div>
                        <div class="modal-body">
                            <p><span id="loggedin-msg"></span>

                            </p>

                        </div>
                        <div class="modal-footer">
                            <button type="button" id="exit-confirmation" onclick="callforceloginAction()" class="btn btn-black" data-dismiss="modal">Yes</button>
                            <button type="button" class="btn btn-black" data-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Start Right Action menu -->

            <!-- <div id="generalContextMenubar" class="dropdown clearfix" style="display:none;" >
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block; position: relative; margin-bottom: 5px;">
                    <li><a href="javascript:void(0);" class="view-user-profile">View Profile</a></li>
                    <li><a href="javascript:void(0);">Remove Contact</a></li>
                    <li><a href="javascript:void(0);">Share Contact</a></li>
                </ul>
            </div>

            <div id="statementContextMenubar" class="dropdown ContextMenubar clearfix" style="display:none;" >
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block; position: relative; margin-bottom: 5px;">
                    <li><a href="javascript:void(0);">New Course</a></li>
                    <li><a href="javascript:void(0);">Move</a></li>
                    <li><a href="javascript:void(0);">Share</a></li>
                </ul>
            </div>

            <div id="right_aContextMenubar"  class="dropdown clearfix" style="display:none;" >
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block; position: relative; margin-bottom: 5px;">
                    <li><a href="javascript:void(0);" class="view-user-profile ref-open-cal-event-details" id="fly-login-events">Add Event</a></li>
                    <li><a href="javascript:void(0);">Add Recurring Event</a></li>
                    <li><a href="javascript:void(0);">Views Setting</a></li>
                </ul>
            </div> -->

            <!-- End Right Action menu -->



            <!-- ============================= Mini Dialogue ============================================== -->

        <?php if ($pluginArray['dialogue'] == 'True') { ?>
                <link rel="stylesheet" type="text/css" href="<?php echo $assetsUrl; ?>css/pu.plugin.dialogue.css"/>

            <?php include 'minidialog.php'; ?>
                <link rel="stylesheet" type="text/css" href="<?php echo $assetsUrl; ?>css/dropzone.css"/>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/dropzone.js"></script>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/filereader.js"></script>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/plugin_minidialogue.js"></script>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/chat.js"></script>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/dialogue.js"></script>
                <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/circularloader.js"></script>


            <?php if ($pluginArray['domain'] != 'www.pui.com') {
                ?>
                    <script type="text/javascript" src="<?php /*echo BASE_URL_API; */?>js/jquery.autocomplete.min.js"></script>

            <?php }
        } ?>
            <!-- ============================= Mini Dialogue End ============================================== -->
        </div>

        <!-- ============================= Footer Link Flyout End ============================================== -->
        <?php if ($pluginArray['authentication'] == 'True' && $pluginArray['domain'] != 'www.pui.com') { ?>
            <script type="text/javascript">

                            $(window).load(function () {
                                $.post(domainUrlApi + 'code.php', {'action': 'checklogin', 'sessId': sessId}, responsCheckLoginUser, 'JSON');
                            });

                            function responsCheckLoginUser(data, s)
                            {
                                if (parseInt(data.result) == 1)
                                {
                                    $(".show-mini").hide();
                                    $(".log-class").show();
                                    $(".logout-class").remove();
                                    hideFullLoader('full_page_loader');
                                }

                                if (parseInt(data.result) == 0)
                                {
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

                                    if ($.trim(userComapnyName) == '')
                                        userComapnyName = 'Investible';

                                    if ($.trim(data.user['common_name']) == '' && userDomainName == 'www.prospus.com')
                                        common_name = 'Administrator';
                                    else if ($.trim(data.user['common_name']) == '')
                                        common_name = 'Guest';
                                    else
                                        common_name = data.user['common_name'];

                                    //console.log(data);
                                    $(".changed-user-role").html(userComapnyName + ' . ' + common_name);

                                    if ($.trim(data.roles) != '')
                                    {
                                        $("#dd_img_pu_plugin").show();
                                        $("#user-roles-ul").html(data.roles);
                                    } else
                                    {
                                        $("#dd_img_pu_plugin").hide();
                                        $("#user-roles-ul").html('');
                                    }

                                    if ($.trim(data.crole) != '')
                                        $(".changed-user-role").html(data.crole);

                                    if (typeof loginFromPUPlugin == 'function')
                                    {
                                        $('body').removeClass('grey-bg-for-marinemax');
                                        $(".logo-centered").addClass('hide');
                                        $(".version-txt").addClass('hide');
                                        loginFromPUPlugin();
                                    }

                                    if (userDomainName == 'www.prospus.com')
                                    {
                                        loginFromPUOnInvetible('other');
                                    }
                                    if($("ul#user-roles-ul li").length==0 && $.trim(data.crole) === ''){
                                        $("span.changed-user-role").text("MarineMax");
                                        $("#section_id_deal").remove();
                                    }

                                    $.post(domainUrlApi + 'code.php', {'action': 'checkSessionFile', 'sessId': sessId}, checkSessionFileResponse, 'JSON');
                                }
                            }
            </script>
        <?php } ?>

        <?php if ($pluginArray['domain'] != 'www.pui.com') { ?>
            <script type="text/javascript">
                $(window).load(function () {
                    $.post(domainUrlApi + 'code.php', {'action': 'plugInRequest', 'domainName': userDomainName}, responsPluginRequest, 'JSON');

                    $('.load-content-render').css('display', 'block');
                    $('.preload').css('display', 'none');

                });

                function responsPluginRequest(data, s)
                {

                }
            </script>
        <?php } ?>
        <script type="text/javascript">
            $(window).load(function () {
                $('.load-content-render').css('display', 'block');
                $('.preload').css('display', 'none');
                $('.css-preloader').css('display', 'block');
            });
        </script>
    <?php } else {
        echo "Your domain is not register.";
    } ?>
<?php } ?>

<!-- popup-add-registration -->

<div class="modal fade register-sucess-popup" id="registrationSucessPopUp" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" style="display:none">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="registration-section">
                    <div class="modal-head clearfix">
                        <div class="pull-left">
                            <h2>Welcome to Prospus Universe</h2>
                        </div>
                        <div class="pull-right">
                            <a href="javascript:void(0);" class="right"> <img src="<?php echo $assetsUrl; ?>img/powerd-by-prospus.svg" class="" alt=""> </a>
                        </div>
                    </div>

                    <div class="modal-info">
                        <p>
                            An email has been sent to your registered email with a link to validate your account. Please open that email and click on the
                            link provided to activate and login to your account. If you did not receive the email please check your junk box and add our
                            domain to your whitelist.
                        </p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="pull-right">
                    <button type="button" class="btn btn-default-pop">Resend Account Invitation</button>
                    <button type="button" class="btn btn-default-pop" data-dismiss="modal">Ok</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- popup-add-registration -->
<?php /* if (isset($userData) && !empty($userData)) { ?>
  <script>
  console.log('inside');
  $(document).ready(function () {
  showFullLoader('full_page_loader');
  setTimeout(function () {
  autoLogin(<?php echo "'" . $userData . "'" ?>,<?php echo "'".$emailAdd."'" ?>,<?php echo "'".$password."'" ?>,<?php echo "'".$domainName."'" ?>);
  }, 2000);
  });
  </script>
  <?php } */
if (trim($emailAdd) != '' && trim($password) != '') {
    ?>
    <script type="text/javascript">
        $(document).ready(function () {
            setTimeout(function () {
                $('#signInForm #emailaddress').attr('value', "<?php echo $emailAdd; ?>");
                $('#signInForm #emailaddress').val("<?php echo $emailAdd; ?>");
                $('#signInForm #password').attr('value', "<?php echo $password; ?>");
                $('#signInForm #password').val("<?php echo $password; ?>");
                $('#signInForm #checkBoxRemember').prop("checked", true);
            }, 2000);
        });
    </script>
<?php } ?>
