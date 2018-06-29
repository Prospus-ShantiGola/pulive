<?php
session_start();
//include_once "config.php";
DEFINE('PREFIX_CONFIG', 'local_');
?>
<div class="control-bar new-course-control-wrap hide" id="newCourseControl">
      <div class="row">
          <div class="col-md-12 left-head">
              <?php /* ?>
              <!-- collapsed-up-course -->
              <!-- <div class="block-head collapsed-block-head">
                  <div class="course-top-panel clearfix">
                      <div class="RightFlyoutOpen courseBoard" id="courseBoardFlyout">Default</div>
                          <div class="collapsedBlockWrap">
                              <span class="active course-action"><i class="icon course-title"></i></span>
                              <input type="text" class="form-control input-field  margin-left-five course-title-input" id="course-title-defalut-value" value="" placeholder="Course Title" autofocus="">
                               <div class="expanArrowBox">
                                  <span class="active course-action individual-get-list"><i class="icon collapse-up"></i></span>
                              </div>
                          </div>
                  </div>
              </div> -->
              <!-- collapsed-up-course-->
              <?php */ ?>
              <!-- expand-down-course -->
              <div class="block-head expand-block-head">
                  <input type="hidden" id="course-dialogue-type" value="new" name="course-dialogue-type">
                  <div class="course-top-panel clearfix">
                      <div class="RightFlyoutOpen courseBoard" id="courseBoardFlyout">Default</div>
                      <div class="expandBlockWrap">
                          <div class="expandInputWrap clearfix">
                            <div class="course-title-expand clearfix">
                                <span class="active course-action"><i class="icon course-title"></i></span>
                                <input type="text" class="form-control input-field  margin-left-two course-title-input" id="course-title-value" onkeyup="checkChatMode();"  value="" placeholder="Course Title" autofocus>
                                <input type="hidden" id="courseInsId" value="">
                                <span class="courseTitleAddView">Course Lorem Ipsum</span>
                            </div>
                            <div class="dialogue-title-expand clearfix chat-toggle">
                                <span class="active dialogue-action"><i class="icon dialogue-title"></i></span>
                                <input type="text" class="form-control input-field  margin-left-two dialogue-title-input" id="dialogue-title-value"  onkeyup="checkChatMode();" value="" placeholder="Dialogue Title">
                            </div>
                           </div>
                          <div class="expanArrowBox">
                              <span class="active course-action"><i class="icon collapse-down toggle-section-btn"></i></span>
                          </div>
                        </div>
                  </div>
                  <!-- course-listed-user-starts-->
                  <div class="courseListedUser clearfix chat-toggle">
                      <div class="newCourseDetailed initialCourseUserWrap clearfix">
                          <div class="left dropListBox">
                              <div class="select-wrap">
                                  <span>Admin</span>
                              </div>
                          </div>
                          <div class="right receivedListBox">
                              <div class="receiver-label-box">
                                  <span>
                                     <i class="icon admin-user"></i>
                                      <?php $from = PREFIX_CONFIG.'user_info';
									  echo $_SESSION[$from]['email_address'];?>
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div class="newCourseDetailed multiCourseUserWrap clearfix selectCourseRowAdd">
                          <div class="left dropListBox">
                              <div class="select-wrap">
                                  <select class="select-field">
                                      <option>Participant(s)</option>
                                  </select>
                              </div>
                          </div>
                          <div class="right receivedListBox">
                              <div class="">
                                 <input type="hidden" id="individual_user_id" name="individual_user_id" value="">
                                 <input type="text" id="individual_user_list" name="individual_user_list" class="form-control input-field email_info auto-suggest"
                                  placeholder="Email"
                                  data-validation-rules="empty"
                                  data-is-multiple="1" data-multiple-selector="input[name='recipient_id[]']">
                                  <span><i class="icon tick addCourseDialogueList"></i></span>
                              </div>
                              <div class="addNiceScrollWrapper clearfix"></div>
                          </div>
                           <div id="individualAutoCompleteBox" class="clearfix"></div>
                      </div><!-- add-scroll -->

                      <!-- add-scroll -->
                  </div><!-- course-listed-user-starts-->
              </div><!-- expand-down-course -->
          </div>
      </div>
  </div>
  <!-- new-course-dialogue-control-ends -->
