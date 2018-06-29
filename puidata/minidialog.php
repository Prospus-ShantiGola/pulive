
<?php
if ($_GET['type'] == 'openWindow') {
    include "config.php";

    //define('SOCKET_URL',"ws://".$_SERVER['HTTP_HOST'].":9000/PUI/puidata/server.php");
    // loading assets from CDN or filesystem based on server
    if(SOCKET_HOST_NAME === 'http://localhost/pu/' || SOCKET_HOST_NAME === 'http://www.prospus.com/dev/') {
        $assetsUrl = BASE_URL_API . '/';
    } else {
        $assetsUrl = PU_CDN_URL.'puidata/';
    }
    ?>
    <script type="text/javascript">
        var socketUrl = "<?php echo SOCKET_URL; ?>";

        var setUsername = "<?php echo $_GET['uname']; ?>";
        var setUserID = "<?php echo $_GET['uid']; ?>";
		var userEmail = "<?php echo $_GET['emailAdd']; ?>";
		//userEmail =  data.user['email_address'];
        var myDropzone;
        var chattimer = 0;
        var domainUrlApi = "<?php echo BASE_URL_API; ?>";
        //alert(setUserID+' setUserID');

    </script>
    <!DOCTYPE html>
    <html>
        <head>

        <input class="logout-class" type="hidden" id="first_name" name="first_name" value="<?php echo $user_info['first_name']; ?>" />
        <input type="hidden" class="logout-class" id="last_name" name="last_name" value="<?php echo $user_info['last_name']; ?>" />
        <input class="logout-class" type="hidden" id="date_of_birth" name="date_of_birth" value="<?php echo $user_info['date_of_birth']; ?>" />
        <input class="logout-class" type="hidden" id="email_address" name="email_address" value="<?php echo $user_info['email_address']; ?>" />
        <input class="logout-class" type="hidden" id="node_id" name="node_id" value="<?php echo $_GET['uid']; ?>" />

        <title>PU dialogue</title>

        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300,700" rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="<?php echo $assetsUrl; ?>css/bootstrap.min.css" />
        <link rel="stylesheet" href="<?php echo $assetsUrl; ?>css/nanoscroller.css" />


        <link rel="stylesheet" type="text/css" href="<?php echo $assetsUrl; ?>css/jquery-ui.css" />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />


        <link rel="stylesheet" type="text/css" href="<?php echo $assetsUrl; ?>css/pu.plugin.dialogue.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo $assetsUrl; ?>css/dropzone.css"/>

        <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/jquery-1.9.1.js" ></script>
        <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/minidialogue_lib_undock.min.js" ></script>
        <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/bootstrap.min.js" ></script>

        <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/jquery_nicescroll_min.js" ></script>


    </head>

    <style type="text/css">
        .undock-overlay-wrap{
            height: 820px;
            width: 400px;
            background: #fff;
            opacity: 0.6;
            text-align: left;
        }
        .undock-overlay-wrap .dummy-undock{
            padding-top: 100%;
        }
        .undock-overlay-wrap .img-loader-container{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            text-align:center; /* Align center inline elements */
            font: 0/0 a;
        }

        .undock-overlay-wrap .img-loader-container:before{
            content: ' ';
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }
        .undock-overlay-wrap .img-loader-container img{
            vertical-align: middle;
            display: inline-block;
        }

    </style>

    <div class="undock-overlay-wrap white-overlay show">

        <div class="dummy-undock"></div>
        <div class="img-loader-container">
            <img src="<?php echo $assetsUrl; ?>img/loader-big.gif"/>
        </div>

    </div>
<?php }
 ?>

<!-- ============================= Mini Dialogue ============================================== -->

<div id="generalContextMenubar" class="dropdown clearfix">
    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block; position: relative; margin-bottom: 5px;">
        <li><a href="javascript:void(0)" class="view-user-profile">View Profile</a></li>
        <li><a href="javascript:void(0)">Remove Contact</a></li>
        <li><a href="javascript:void(0)">Share Contact</a></li>
    </ul>
</div>

<!--loader-box-->
<div class="loader-box pu_plugin_loader_box" style='display:none;'>
    <img src="<?php echo $assetsUrl; ?>img/lazy-loader.gif"/>
    <span class="load-content">Loading Dialogue...</span>
</div>
<!--loader-box-->

<div class="dialogue-wrap dialogue-mini clearfix mini-dialogue-flyout mini-d pu_plugin_mini_dialogue" id="miniDialogue"  style="width:50%">
    <!--mini-overlay-wrapper-->
    <div class="mini-overlay-wrapper black-overlay hide">
        <div class="dummy"></div>
        <div class="img-loader-container">
            <img src="<?php echo $assetsUrl; ?>img/loader-big.gif"/>
        </div>

    </div>

    <div class="mini-overlay-white-wrapper white-overlay hide">

        <div class="dummy"></div>
        <div class="img-loader-container">
            <img src="<?php echo $assetsUrl; ?>img/loader-big.gif"/>
        </div>
    </div>
    <div class="loader-actor-box hide">
        <div class="dummy"></div>
        <div class="img-loader-container">
            <img src="<?php echo $assetsUrl; ?>img/loader-add-actor.gif"/>
        </div>
    </div>

    <!--mini-overlay-wrapper-->
    <div class="people-section tabing-section">
        <div class="user-tab-node right-dialogue-panel clearfix ref-min-left-dialogue">
            <div class="brdrBtm clearfix">
                <div class="right-tab right-bar-tab ref-lt-pane clearfix left">
                    <ul class="clearfix">
                        <li class="new-mini-dia-drop">
                            <!-- <span class="logo-title"><i class="icon icon_by_actor"></i>by actor</span> -->
                            <div class="logo-title">
                                <span class="left_icon_box"><i class="icon sm-filter"></i></span>
                                <div class="dropdown dropdown_inactive">
                                    <a class="dropdown-toggle dropMenuFilter" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">By Course</a>
                                    <!-- <ul class="dropdown-menu select-filter-drop" aria-labelledby="dropdownMenu2">
                                        <li><a href="javascript:void(0);" value="" class ='add_new_node' data-value="By Course1">By Course1</a></li>
                                        <li><a href="javascript:void(0);" value="" class ='add_existing_node' data-value="By Course2">By Course2</a></li>
                                    </ul> -->
                                </div>
                            </div>
                        </li>
                        <li>
                            <a  class="ref-create-dialogue"  href="javascript:void(0);">
                                <i class="icon new-course" data-toggle="tooltip" data-placement="left" title="New"></i><br>

                            </a>
                        </li>

                    </ul>


                </div>
                <span class="search-icon-sm search-expend-mini"> <a href="javascript:void(0);" class="search-anchor-mini"><i class="icon search-change-mini" data-toggle="tooltip" data-placement="left" title="Search"></i></a></span>
                <div class="sb-search right">
                    <!--  <form> -->
                    <input  class="sb-search-input-text hide form-control" placeholder="Search" type="text" value="" name="search" id="search" onkeyup ="searchDialogDetail();" autocomplete="off">
                    <!-- <input class="sb-search-submit" type="submit" value="">  -->

                    <!-- </form> -->
                </div>
            </div>

            <div class="mini_accordion_wrap">
                <div class="nano">
                    <div class="nano-content">
                        <div class="panel-group mini-accordion-wrap" id="accordion" role="tablist" aria-multiselectable="true">

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- end people section -->
    <!--  chat section -->
    <div class="dialogue-section tabing-section ref-min-center-dialogue" >
        <div class="right-bar-tab clearfix default-view-tab">
            <div class="tab-head left dialogue-head-title">
                <!--arrow-top-->
                <div class="ref_mini_arrow_box angle-collapsed-view">
                    <div class="ref_mini_icon">
                        <a class="">
                            <i class="icon mini_arrow_up angle-collapse-up"></i>
                        </a>
                    </div>

                </div>

                <!--arroe-top-->
                <div class="rename-title-mini">
                    <span class="title-id dialog-tilte-node-id "></span>
                    <span class="title-icon"><i class="icon dialogue_title"></i></span>
                    <span class="rename-edit-cover-box">
                        <span class="dialogue-Title dialog-random-title truncate" ></span>
                        <i class="icon edit-icon edit-title" data-toggle="tooltip" data-placement="left" title="Edit"></i>
                    </span>

                </div>
                <div class="edit-rename-title-mini hide show-edit-course">
                    <span class="title-id dialog-tilte-node-id"></span>
                    <span class="title-icon"><i class="icon dialogue_title"></i></span>
                    <span class="edit-dialogue-span-box"><input type="text" value="" class="form-control edit-dialog-random-title" maxlength = '20'></span>
                    <i class="icon close cancel_dialogue_title" data-toggle="tooltip" data-placement="left" title="Cancel"></i>
                    <i class="icon tick save_dialogue_title" data-toggle="tooltip" data-placement="left" title="Save" onclick ='updateDialogTitle($(this));'></i>
                </div>


            </div>
        </div>

        <!--show-right-pane-->
        <div class="right-bar-tab clearfix ref_add_right_tab right_bar_tab_new_ui">
            <div class="ref_top_head_box clearfix">
                <!--arrow-top-->
                <div class="ref_mini_arrow_box">
                    <div class="ref_mini_icon ">
                        <i class="icon mini_arrow_up"></i>
                    </div>
                </div>
                <!--arroe-top-->
                <div class="mini_right_box new_untitled_wrap clearfix new_user_newform">
                    <!--first-box-->
                    <div class="new_add_wrap clearfix add_nw_course_form">
                        <div class="ref_mini_drop_box">
                            <span class="left_icon_box"></span>
                            <div class="dropdown">
                                <a class="dropdown-toggle dropMenuCourse" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">New
                                </a>
                                <ul class="dropdown-menu select-end-user-role" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0);" value="" class ='add_new_node choose-node-type' data-value="Default">New</a></li>
                                    <li><a href="javascript:void(0);" value="" class ='add_existing_node choose-node-type' data-value="Defaul2">Existing</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="ref_mini_input_box course-new-drop new_user_titlefield">
                           <span class="ref_span_left"><i class="icon course_add"></i> </span>
                            <input type="text" class="form-control ref-add-input-field course_info save_enter_course" maxlength="20" placeholder="New Course Title" name="course_title" autofocus/>
                            <span class= 'required-str hide course_req'>Required field </span>
                        </div>

                        <div class="ref_mini_input_box course-new-drop new_user_titlefield">
                           <span class="ref_span_left"><i class="icon dialogue_add"></i> </span>
                            <input type="text" class="form-control ref-add-input-field dialogue_info save_enter_course"  maxlength="20" placeholder="Dialogue Title" name="" autofocus/>

                        </div>

                        <!-- Existing user title field start here -->
                        <div class="ref_mini_input_box course-new-drop existing_user_titlefield addAutoCompleteBox">
                           <span class="ref_span_left"><i class="icon course_add"></i> </span>
                            <input type="text" class="form-control ref-add-input-field course_info search-existing-course save_enter_course"  maxlength="20" placeholder="Search Existing Course Title" name="course_title" autofocus/>
                            <span class= 'required-str hide course_req'>Required field </span>

                        </div>
                        <div class="ref_mini_input_box course-new-drop existing_user_titlefield">
                           <span class="ref_span_left"><i class="icon dialogue_add"></i> </span>
                            <input type="text" class="form-control ref-add-input-field dialogue_info  save_enter_course" maxlength="20" placeholder="Dialogue Title" name="" autofocus/>

                        </div>
                        <!-- Existing user title field end here -->
                    </div>
                    <!--first-box-->


                    <!--Third-boc-->
                    <div class="new_add_wrap clearfix new_col_add_wrap add_nw_course_form">
                          <div class="ref_mini_drop_box ">
                            <span>Admin</span>
                        </div>

                        <div class="ref_mini_input_box course-new-drop">
                            <div class="form-label">
                               <span class="ref_span_left"><i class="icon admin-user"></i></span>
                                <span class="user-name-data"></span>
                            </div>
                        </div>
                    </div>
                    <!--Third-box-->

                    <!--fourth-box-->
                    <div class="new_add_wrap clearfix add_nw_course_form">
                        <div class="ref_mini_drop_box">
                            <span class="left_icon_box"></span>
                            <div class="dropdown">
                                <a class="dropdown-toggle participant" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Participant(s)
                                </a>
                                <ul class="dropdown-menu participant-user-role" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0);" value="" class ='add_new_node' data-value="Default">Participant1</a></li>
                                    <li><a href="javascript:void(0);" value="" class ='add_existing_node' data-value="Defaul2">Participant2</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="ref_mini_input_box course-new-drop">
                            <div class="email_input_field_ui " id= "add_participant_new_user" >
                                <input type="text" class="form-control ref-add-input-field save_enter_course  user-search autosuggest_dropdown_width" placeholder="Type name here" name="" id="participantInput" autocomplete="on" autofocus/>
                                <i class="icon add-participants-list tick"></i>
                            </div>
                            <div class="overflow_height participant_scroll_height_ui">

                            </div>
                        </div>
                    </div>
                    <!--fourth-box-->
                </div>
            </div>
        </div>

        <!--collapsed-->
        <div class="right-bar-tab clearfix collapsed_dialogue  new_view_wrapper">
            <div class="ref_top_head_box1 clearfix">
                <!--arrow-top-->
                <div class="ref_mini_arrow_box">
                    <div class="ref_mini_icon ref_hide_top_arrow">
                        <i class="icon mini_arrow_up"></i>
                    </div>
                </div>
                <!--arroe-top-->
                <!--mini_right_box-starts-->
                <div class="mini_right_box clearfix ">
                    <!--first-box-->
                    <div class="new_add_wrap clearfix add_nw_course_form existing_viewform_field">
                        <div class="ref_mini_drop_box">
                            <span class="left_icon_box"></span>
                            <div class="dropdown existing_viewform_title">
                                <a type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Existing
                                </a>

                            </div>
                        </div>

                        <div class="ref_mini_input_box course-new-drop">
                           <span class="ref_span_left"><i class="icon course_add"></i> </span>
                            <span class="existing_view_title course-detail-title">Undefined</span>
                        </div>
                        <div class="ref_mini_input_box course-new-drop">
                           <span class="ref_span_left"><i class="icon dialogue_add"></i> </span>
                            <span class="existing_view_title dialogue-detail-title">Undefined</span>
                        </div>
                    </div>
                    <!--first-box-->

                    <!--second-boc-->
                    <div class="new_add_wrap clearfix new_col_add_wrap add_nw_course_form">
                          <div class="ref_mini_drop_box ">
                            <span>Admin</span>
                        </div>

                        <div class="ref_mini_input_box course-new-drop">
                            <div class="form-label">
                               <span class="ref_span_left"><i class="icon admin-user"></i> </span>
                                <span class="user-name-data">aa</span>
                            </div>
                        </div>
                    </div>
                    <!--second-box-->
                    <!--third-box-->
                    <div class="new_add_wrap clearfix add_nw_course_form">
                        <div class="ref_mini_drop_box">
                            <span class="left_icon_box"></span>
                            <div class="dropdown">
                                <a class="dropdown-toggle participant" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Participant(s)
                                </a>
                                <ul class="dropdown-menu participant-user-role" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0);" value="" class ='add_new_node' data-value="Default">Participant1</a></li>
                                    <li><a href="javascript:void(0);" value="" class ='add_existing_node' data-value="Defaul2">Participant2</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="ref_mini_input_box course-new-drop">
                            <div class="email_input_field_ui add_participant_user" id="">
                                <input type="text" class="form-control ref-add-input-field add-new-participant existing-user-search" placeholder="Type name here" name="" id="exixtingParticipantInput" autofocus/>
                                <i class="icon tick" onclick ="saveNewActor();"></i>
                            </div>
                            <div class="overflow_height participant_scroll_height_ui">

                            </div>
                        </div>
                    </div>
                    <!--third-box-->
                </div>
                <!--mini_right_box-starts-->

            </div>
        </div>

        <!--collapsed-->


        <!--show-right-panel-->

        <div class="tab-content ref_top_chat_box" id= 'attachment_panel'>
            <!-- start preview template-->

            <!--comment-for-file-type-attached-->
            <div id="custom-preview-template" style="display:none">
                <div class="dz-preview dz-file-preview logoFrame">
                    <div class="dz-image"><img data-dz-thumbnail /></div>
                    <div class="dz-progress">
                        <a href="javascript:void(0)" target="_blank" class="canvas_view_mode"><canvas id="my_canvas" data-dz-uploadprogress height="40" width="40"></canvas></a>
                    </div>
                    <div class="dz-details right_margin">
                        <div class="dz-filename"><span data-dz-name></span></div>
                        <div class="dz-size"><span data-dz-size></span></div>
                    </div>
                    <span class="dialogue-date right"><ul><li><span id="currentTime">3:32 PM</span></li></ul></span>
                    <div class="dz-error-message connection_notif">

                        <span class="connect_wrap">
                            <i class="icon connection_error"></i>
                            <span data-dz-errormessage class="errMsg notif_title"> </span>
                        </span>

                    </div>
                    <div class="dz-success-mark"></div>
                    <div class="dz-error-mark">
                        <title>Error</title>
                    </div>
                </div>
            </div>
            <!--comment-for-file-type-attached-->


            <div class="tab-pane active dialogue_message_pane">
                <div class="nano ref-set-height" style="position:relative">
                    <div class="nano-content ref_hide_tab_content">
                        <div class="dialogue-area ">
                            <div class="dialogue-listing-chat" id= "chatWindows">

                            </div>

                        </div>
                    </div>
                </div>
                <div class="mini-type-textarea">
                    <div class="dialogue-txt-comment-mini ref-textarea-HT">
                        <form class="clearfix">
                            <div class="animate-div resizable clearfix">
                                <div class="textarea-icon-wrap clearfix">
                                    <!-- <div class="expanded-box right expand-collapse-box icon" data-toggle="tooltip" data-placement="left" title="Expand"></div> -->
                                    <div class="expand-collapse-box icon dialogue_area_action_icon expand_icon expanded-box" data-toggle="tooltip" data-placement="left" title="Expand"></div>

                                    <i class="icon-attachment-wrap" id="attachment-wrap"><img src="<?php echo $assetsUrl; ?>img/attachment.png" width="17" height="15" id="attachment" class ="" data-toggle="tooltip" data-placement="left" title="Attach Files"/ ></i>
                                    <i class="icon icon-reply inactive hide" data-toggle="tooltip" data-placement="left" title="Reply"></i>

                                </div>
                                <div id="chatMsgBox" class="textarea clearfix ">
                                    <textarea id="add-text"  class="form-control message" rows="2" placeholder="Type here"></textarea>
                                    <!--<div id="divEditable"  class="form-control message" rows="2" placeholder="Type here" contenteditable="true"></div>-->

                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="action-btn right">
                        <button type="button" class="btn btn-style send-btn" style="display:none;">Submit</button>
                    </div>

                </div>

            </div>
        </div>

        <div class="chatNotifications">
        </div>
    </div>
    <!-- end chat section -->

    <!-- Add Actor for Participants -->
    <div class="mini-participant-panel ref-actorDialogue" >
        <div class="mini-participant-left-pane ref-actors-LT ">
            <div class="reply-list-wrap">
                <div class="reply-listing">
                    <?php for($i=0;$i<20;$i++) { ?>

                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="" value="option1">
                         Lorem Ipsum Dolor Set
                      </label>
                    </div>

                     <?php } ?>
                </div>
            </div>
        </div>
        <div class="mini-participant-right-action-pane user-action-strip ref-actors-RT">

            <a class="javascript:void(0)" href="javascript:void(0)" onclick ='saveNewActor();'>
                <i class="icon mini-save"></i><br>
                <span>Save</span>
            </a>
            <a class="close-actor-dialogue" href="javascript:void(0)">
                <i class="icon close-big"></i><br>
                <span>Close</span>
            </a>

        </div>
    </div>
    <!-- End -->

    <div class="user-section-strip tabing-section ref-min-right-dialogue">
        <div class="user-action-wrap ref-user-action-HT">
          <!---  <a  class="save-chat-mini save_course_detail hide" id=""  href="javascript:void(0);" data-id ="" onclick = saveNewCourse();> <i class="icon save-mini"></i><br>
                <span>Save</span>
            </a>

		    <a  class="close-chat1 open-mini-dialogue" id="actorDialogue"  href="javascript:void(0);" data-id ="">
                <i class="icon actors"></i><br>
                <span>Actors</span>
            </a> -->
            <?php
              $params = htmlspecialchars(json_encode(array('type'=>'minidialogue')), ENT_QUOTES, 'UTF-8');
            ?>
            <a class="user-roles publish-minidialogue" href="javascript:void(0)" data-params="<?php echo $params?>">
              <i class="icon publish" data-original-title="" title=""></i><br>
              <span>Send</span>
            </a>

            <a  class="pop-out pop-up-window"  href="javascript:void(0)">
                <i class="icon unlock-window"></i><br>
                <span>Undock</span>
            </a>
            <!--    <a  class="close-chat1"  href="javascript:void(0)">
                   <i class="icon maximize-dialogue"></i><br>
                    <span>Maximinze Dialogue</span>
               </a> -->
            <a  class="close-chat close-mini-dialogue mini-dialog imranClose"  href="javascript:void(0)">
                <i class="icon dialogue-close"></i><br>
                <span>Close</span>
            </a>
            <a class="close-chat hide windowClose" href="javascript:void(0)">
                <i class="icon dialogue-close"></i><br>
                <span>Close</span>
            </a>

        </div>

    </div>
</div>
<div id="descCourseContextMenu"  class="dropdown clearfix descContextMenubar">
    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block">
        <li><a href="javascript:void(0)">Assign to Course</a></li>
		 <li><a href="javascript:void(0)" class = "edit-statement" data-id ="" onclick = "editStatement(this);" >Edit</a></li>
        <li><a href="javascript:void(0)">Share</a></li>
        <li><a href="javascript:void(0)" class = "delete-statement" data-id ="" onclick = "deleteStatement(this);" >Remove</a></li>
    </ul>
</div>
<div id="imgContextMenu"  class="dropdown clearfix imgContextMenubar">
    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block">
        <li><a href="javascript:void(0)" class = "delete-statement" data-id ="" onclick = "deleteStatement(this);">Remove</a></li>
    </ul>
</div>
    <!--right-click-->
<!-- Confirm Popup -->

<!--right-click-->
<div id="viewCourseContextMenu"  class="dropdown clearfix viewContextMenubar">
	<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block">
		<li><a href="javascript:void(0)">View Course</a></li>
	</ul>
</div>

<div class="modal fade confirmPopup modalMiniDialogue pu_plugin_modal_mini" id="confirmPopup" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="series-content"> Are you sure you want to remove this message?
                  <!--button type="button" class="close right" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="icon close"></i></span></button-->
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default-pop confirm-delete" data-dismiss="modal" onclick="deleteStatementConfirm(this);" >Yes</button>
                <button type="button" class="btn btn-default-pop" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bootbox bootbox-confirm" id="messagePopup" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="bootbox-close-button close" data-dismiss="modal" aria-hidden="true">
                    <span aria-hidden="true"><i class="icon close"></i></span>
                </button>
                <h4 class="modal-title">Alert</h4>
            </div>
            <div class="modal-body">
                <div class="series-content">
            
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default-pop" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<?php
if ($_GET['type'] == 'openWindow') {
    ?>
    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/dropzone.js"></script>
    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/filereader.js"></script>
    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/plugin_minidialogue.js"></script>
    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/chat.js"></script>
    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/dialogue.js"></script>


    <script type="text/javascript" src="<?php echo $assetsUrl; ?>js/circularloader.js"></script>
    <script>
                    $(document).ready(function () {
                        $(".mini-dialogue-flyout").addClass("windowChat");
                        $(".windowChat.mini-dialogue-flyout .nano").nanoScroller();


                        var resize_time;
                        var resize_timeout = false;
                        var resize_delta = 1;
                        $(window).resize(function () {
                            resize_time = new Date();
                            if (resize_timeout === false) {
                                resize_timeout = true;
                                setTimeout(resizePopupCode, resize_delta);
                            }
                        });
                        function resizePopupCode() {
                            if (new Date() - resize_time < resize_delta) {
                                setTimeout(resizePopupCode, resize_delta);
                            } else {
                                resize_timeout = false;
                                resizePopupWindow();
                            }
                        }

                        function resizePopupWindow() {


                            var windowResizeTotalHeight = $(window).height();
                            var windowResizeTotalWidth = $(window).width();
                            var getResizeDialogueTotalWidth = $(".mini-dialogue-flyout").width();
                            var getResizePeopleSectionWidth = $(".mini-dialogue-flyout .tabing-section").width();
                            var getResizeUserActionWidth = $(".ref-min-right-dialogue").width();
                            var totalResizeDialogueWidth = getResizeDialogueTotalWidth - (getResizePeopleSectionWidth + getResizeUserActionWidth);
                            var getResizeMiniTextHeight = $(".mini-type-textarea").height();
                            var getResizeTopBarHeight = $(".right-bar-tab").height();
                            var getResizeFirstDivHeight = $(".first-div-min-participant").height();
                            var getResizeDialogueTotalHeight = $(".mini-dialogue-flyout").height();
                            var searchExistingWidth = $(".pu_plugin_mini_dialogue .search-existing-course").width();
                            var refActorWidth = $(".ref-actorDialogue").width();
                            var resizeMiniFlyModalWidthCal = $(".mini-dialogue-flyout").width();
                            var resizeMiniFlyModalHeightCal = $(".mini-dialogue-flyout").height();
                            var refMinRightTabHght = $(".ref-min-center-dialogue .right-bar-tab").height();
                            var leftBtmPaneHght = $(".people-section .ref-lt-pane").height();
                            var tabPanelHght = $(".people-section .tab_box").height();

                            var totalRemMinSetHght = resizeMiniFlyModalHeightCal - (leftBtmPaneHght + tabPanelHght);
                            //$(".mini-dialogue-flyout .tabing-section .mini-set-height").height(totalRemMinSetHght);
                            $(".mini_accordion_wrap").height($(".mini-dialogue-flyout").height() - $(".ref-lt-pane").height());
                            $(".mini_accordion_wrap .nano").height($(".mini_accordion_wrap").height());

                            $(".modalMiniDialogue").width(resizeMiniFlyModalWidthCal);
                            $(".modalMiniDialogue").height(resizeMiniFlyModalHeightCal);

                            $(".ref-min-center-dialogue, .mini-type-textarea").width(totalResizeDialogueWidth - 3);

                            $(".mini-dialogue-flyout .tabing-section , .mini-dialogue-flyout .ref-min-left-dialogue, .mini-dialogue-flyout .ref-actorDialogue, .mini-dialogue-flyout .ref-actors-RT, .mini-dialogue-flyout .ref-actors-LT, .pu_plugin_mini_dialogue .loader-actor-box").height(getResizeDialogueTotalHeight);
                            $(".mini-dialogue-flyout .reply-list-wrap").height(getResizeDialogueTotalHeight);
                            $(".mini-dialogue-flyout .ref-set-height").height(getResizeDialogueTotalHeight - (getResizeMiniTextHeight + getResizeTopBarHeight));
                            $(".mini-dialogue-flyout .second-div-mini-participant .add-participant-js").height(getResizeDialogueTotalHeight - getResizeFirstDivHeight);
                            $(".mini-overlay-wrapper, .mini-overlay-white-wrapper").width(getResizeDialogueTotalWidth);
                            $(".pu_plugin_mini_dialogue .loader-actor-box").width(refActorWidth);
                            $(".mini-overlay-wrapper, .mini-overlay-white-wrapper").height(getResizeDialogueTotalHeight);

                            if ($(".expand-collapse-box").hasClass("append-top")) {

                                totalMiniTextHght = resizeMiniFlyModalHeightCal - refMinRightTabHght;
                                $(".mini-type-textarea, .ref-textarea-HT").height(totalMiniTextHght - 1);
                                $("#add-text").height(100 + "%");

                            }

                            $("body").on("click", ".expanded-box", function () {
                                refMinRightTabHght1 = $(".ref-min-center-dialogue .right-bar-tab:visible").height();
                                totalMiniTextHght = resizeMiniFlyModalHeightCal - refMinRightTabHght1;

                                $(".mini-type-textarea, .ref-textarea-HT").height(totalMiniTextHght - 1);
                                $("#add-text").height(100 + "%");
                            });


                            $(".pu_plugin_mini_dialogue.opened").resizable("option", "maxWidth", windowResizeTotalWidth - 5);
                            $(".pu_plugin_mini_dialogue.opened").resizable("option", "maxHeight", windowResizeTotalHeight - 5);
                            $(".pu_plugin_mini_dialogue.opened").resizable("option", "minWidth", 640);
                            $(".pu_plugin_mini_dialogue.opened").resizable("option", "minHeight", 300);
                            $(".pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions").width(searchExistingWidth);
                            $(".pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions, .pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions, .pu_plugin_mini_dialogue .add_participant_user .autocomplete-suggestions").hide();


                            var autoCompleteInputWdt = $(".create-sibling").width();
                            $(".pu_plugin_mini_dialogue.mini-dialogue-flyout .create-sibling .Add-more-participants .autocomplete-suggestions").width(autoCompleteInputWdt - 10);

                            if ($('.pu_plugin_mini_dialogue.opened').width() >= 100010) {
                                $(".tabing-section, .right-dialogue-panel").width(getResizeDialogueTotalWidth / 4);
                                $(".ref-min-center-dialogue, .mini-type-textarea").width(getResizeDialogueTotalWidth * 3 / 4 - 62);
                                $(".ref-min-right-dialogue").css("width", 60 + "px");

                            }

                            else {
                                $(".tabing-section, .right-dialogue-panel").css("width", 230 + "px");
                                if ($(".tabing-section, .right-dialogue-panel").width("width" == 230)) {
                                    $(".ref-min-right-dialogue").css("width", 60 + "px");
                                    //$(".ref-min-center-dialogue, .mini-type-textarea").width(getResizeDialogueTotalWidth- 291);

                                }

                            }

                            // actors-flyout width
                            var refActorFlyResizeWidth = getResizeDialogueTotalWidth/2;
                            var userActionDialogue = $(".mini-dialogue-flyout .user-section-strip").width();
                            $(".mini-participant-panel.ref-actorDialogue").width(refActorFlyResizeWidth);



                        }

                    })

                    $('.undock-overlay-wrap').remove();

                    // getAllDialogue();
                     getAllCourse();

    </script>

    <!-- ============================= Mini Dialogue End ============================================== -->

    </html>
<?php } ?>
