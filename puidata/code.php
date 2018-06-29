<?php
include "config.php";

$builderApiObj = new builderApi();
//$sharedConfig = [
//    'region'  => 'us-east-1',
//    'version' => 'latest',
//    'credentials' => [
//        'key'    => 'AKIAIH7HFQTSPVCH5QPA',
//        'secret' => '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',
//    ]
//];
 
        
//$sdk = new Aws\Sdk($sharedConfig); 
//$s3Client = $sdk->createS3();

//$oCache = new CacheMemcache();
//$memFileName="sess_".SESSID;
if ($_POST) {
    $post = $_POST;
    $action = $post['action'];

    if ($action == 'signup') {
        $json = array();
        parse_str($post['data'], $postArray);
        $node_class_ids = explode(',', $postArray['node_class_id']);
        $node_y_id = '';
        $node_x_id_array = array();
        echo '<pre>';
        print_r($postArray);die;



        foreach ($node_class_ids as $index => $node_class_id) {
            $dataArray = array();
            $instance_property_id_array = $postArray['instance_property_id_' . $node_class_id];
            $instance_property_caption_array = $postArray['instance_property_caption_' . $node_class_id];
            $dataArray['node_class_id'] = $node_class_id;
            $dataArray['node_class_property_id'] = $instance_property_id_array;
            $dataArray['value'] = $instance_property_caption_array;

            $returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');

            $returnArray = json_decode($returnResponse, true);

            if (intval($returnArray['result']) == 0) {
                if ($index == 0) {
                    $node_y_id = $returnArray['data']['node_id'];
                } else {
                    $node_x_id_array[] = $returnArray['data']['node_id'];
                }
            }

            $json['result'] = $returnArray['result'];
            $json['msg'] = $returnArray['msg'];
        }

        if (count($node_x_id_array) > 0) {
            $newArray['node_y_id'] = $node_y_id;
            $newArray['node_x_ids'] = $node_x_id_array;

            $returnResponse = $builderApiObj->setDataAndStructure($newArray, '7', '9');
        }

        print json_encode($json);
        exit;
    }

    if ($action == 'checkEmailExist') {
        $email_address = $post['email_address'];
        $returnResponse = $builderApiObj->checkEmailExist($email_address);
        $returnArray = json_decode($returnResponse, true);
        //	echo "<pre>";print_r($returnArray); 
        if (!empty($returnArray['data'])) {
            echo '1';
        } else {
            echo '0';
        }
    }


    if ($action == 'chat') {
        if ($post['type'] == 'getDialog') {

            //$user_instance_node_id  				=   $post['variable_data'];
            $returnResponse = $builderApiObj->getUsersDialogueData($post['variable_data'], '6', '10');
            $dialogArray = json_decode($returnResponse, true);
            //echo str_word_count('48529,76966');
            //	echo "<pre>";print_r($dialogArray); 
            //echo str_word_count('48529,76966,27414,48519');
            //die;
            $acc_count = $post['variable_data']['acc_count'];
            ?>			

            <?php
            if (!empty($dialogArray['data'])) {

                foreach ($dialogArray['data'] as $key => $dialogDetail) {

                    $user_name = $dialogDetail['user_name'];



                    if ($dialogDetail['dialog_title'] == '') {
                        $dialog_title = 'Untitled';
                    } else {
                        $dialog_title = $dialogDetail['dialog_title'];
                    }

                    $user_temp = explode(',', $dialogDetail['user_id']);
                    if (count($user_temp) == '1') {
                        //$user_img = "img/user.svg";
                    } else {
                        //$user_img = "img/default-group.svg";
                    }
                    $user_temp_name = explode(', ', $dialogDetail['user_name']);
                    ;
                    $user_img = 'dialogue-big.png';
                    //maintain delete icon
                    if ($user_temp[0] != $user_instance_node_id) {
                        $delete_class = 'hide';
                    } else {
                        $delete_class = '';
                    }

                    if (!@$dialogDetail['notification_count']) {
                        $notification_class = 'hide';
                    } else {
                        $notification_class = '';
                    }
                    ?>	
                    <li class="online_users old  " id = '<?php echo $dialogDetail['dialogue_instance_node_id']; ?>' data-id ='<?php echo $dialogDetail['node_instance_property_id']; ?>'>
                        <div class="mini-course-dialogue-box clearfix">
                            <div class="user-pic-sm">
                                <img src="<?php echo BASE_URL_API; ?>img/dialogue-big.png" alt=""/>
                            </div>
                            <div class="mini-course-dialogue-info left">
                                <span class="mini-course-dialogue-title dialog-title truncate-desc"><?php echo $dialog_title; ?></span>
                                <span class="mini-course-dialogue-desc truncate-desc user-node-id" data-id ="<?php echo $dialogDetail['user_id']; ?>"><?php echo $user_name; ?></span>
                                <input type = 'hidden' class= "dialog-admin-email" value="<?php echo $dialogDetail['admin_email'] ?>">
                            </div>
                            <div class="mini-course-dialogue-date right">
                                <span class="mini-course-date"><?php echo date('m/d/Y', strtotime($dialogDetail['dialogue_timestamp'])) ?></span>
                            </div>
                        </div>
                    </li>

                    <?php
                }
            } else {
                echo '0';
            }
            ?>

            <?php
        }
        if ($post['type'] == 'saveDialogTitle') {
            $returnResponse = $builderApiObj->saveDialogTitle($post['variable_data'], '3');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray); die;
            echo $returnArray['data'];
        }
        if ($post['type'] == 'saveStatement') {

            $jsonArray = json_decode($post['data'], true);
            //echo "<pre>";print_r($jsonArray);
            $returnResponse = $builderApiObj->saveStatementInstance($post['data'], '1', '6');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);
            if ($jsonArray['action'] != 'editMessage') {
                if ($jsonArray['type'] != 'Statement') {
                    echo $returnArray['data'] . "~" . $jsonArray['fileTempName'];
                } else {
                    echo $returnArray['data'];
                }
            } else {
                echo $returnArray['data'];
                //echo "<pre>";print_r($returnArray);
            }
        } else if ($post['type'] == 'getStatement') {

            $returnResponse = $builderApiObj->getStatementByDialogue($post['dialog_instance_node_id'], $post['date_obj'], '2');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);
            //die;
            $newArray = array_reverse($returnArray[data]);
            $ary_slice = array_slice($newArray, 0, 7);

            $returnArray = array_reverse($ary_slice);
            //
            //	echo "<pre>";print_r($returnArray);
            //die;
            ?>

            <div class="chat_wrapper active" data-id="<?php echo $post['dialog_instance_node_id']; ?>" data-group="1"><?php // echo $post['dialog_instance_node_id'];        ?>
                <div class="chatters" data-chatter="<?php echo $post['dialog_instance_node_id']; ?>"></div>			

                <ul>
                    <div class="message_box">

                        <?php
                        $week_array = array();
                        $user_time_array = array();


                        if (!empty($returnArray)) {
                            foreach ($returnArray as $valueAry) {
                                //	echo "<pre>";print_r($valueAry);
                                $total_val_count = count($valueAry);

                                $i = 0;
                                $last_time = '';
                                $last_user_id = '';
                                foreach ($valueAry as $value) {

                                    //$timestamp = $value['timestamp'];

                                    $timestampseconds = $value['timestamp'];
                                    //$dbDate=date_create('2016-09-01 14:30:00.000000');
                                    //echo date_timestamp_get($date);

                                    $date_val = date('Y-m-d', $timestampseconds);
                                    $nn = date("F j, Y H:i:s", $timestampseconds);

                                    $today_date = date('Y-m-d');
                                    $today = '';
                                    $strtotime = date("Y-m-d H:i", $timestampseconds);
                                    /* 	echo 'strtotime'. $strtotime;	
                                      echo"<br/>";
                                      echo "lll".$last_time;
                                      echo"<br/>";
                                      echo "uuu".$last_user_id;
                                      echo"<br/>";
                                     */
                                    $user_node_id = $value['actor'];


                                    $user_time = $strtotime . '#' . $user_node_id;

                                    $username = $value['username'];

                                    $week_day = date('l', $timestampseconds);
                                    $week_day_present = date('D', $timestampseconds);
                                    $week_days_ago = date('Y-m-d', strtotime('-6 days', strtotime($today_date)));
                                    if ($date_val == $today_date) {
                                        $week_day = 'Today';
                                        $today = 'present-day';
                                    } else if ($date_val < $week_days_ago) {
                                        $week_day = date('D, M j, Y', $timestampseconds);
                                    }
                                    if ($value['statement_type'] == 'Statement') {

                                        /* //$cls = 'desc_drop ';
                                          if($value['statement'] == 'This message has been removed.' && $value['updated_status'] =='0')
                                          {
                                          $cls = 'clearfix rmv-disabled ';
                                          }
                                          else if($value['statement'] != 'This message has been removed.' && $value['updated_status'] =='1'){
                                          $cls = 'desc_drop clearfix  edited-icon ';
                                          }
                                          else{
                                          $cls = 'desc_drop clearfix ';
                                          } */

                                        if ($value['updated_status'] == '2') {
                                            $cls = 'clearfix rmv-disabled ';
                                            $value['statement'] = 'This message has been removed.';
                                        } else if ($value['updated_status'] == '1') {
                                            $cls = 'desc_drop clearfix  edited-icon ';
                                        } else {
                                            $cls = 'desc_drop clearfix ';
                                        }
                                    } else if ($value['statement_type'] == 'image') {
                                        if ($value['updated_status'] == '2') {
                                            $cls = 'atch-overlay-img common-class rmv-disabled ';
                                            $value['statement'] = 'This message has been removed.';
                                        } else {
                                            $cls = 'atch-overlay-img common-class ';
                                        }
                                    } else {


                                        $image_full_path = ABSO_URL_API . "attachments/" . $post['dialog_instance_node_id'] . "/" . $value['statement'];
                                        $file_size = filesize($image_full_path);
                                        $readable_size = humanFileSize($file_size);

                                        if ($value['updated_status'] == '2') {
                                            $cls = 'atch-overlay common-class rmv-disabled ';
                                            $value['statement'] = 'This message has been removed.';
                                        } else {
                                            $cls = 'atch-overlay common-class';
                                        }
                                    }


                                    $temp_format = explode('.', $value['statement']);
                                    if ($temp_format[1] == 'docx') {
                                        $format_icon = 'doc.png';
                                    } else if ($temp_format[1] == 'zip') {
                                        $format_icon = 'zip.png';
                                    } else if ($temp_format[1] == 'pdf') {
                                        $format_icon = 'pdf.png';
                                    } else if ($temp_format[1] == 'xlsx') {
                                        $format_icon = 'xls.png';
                                    } else if ($temp_format[1] == 'csv') {
                                        $format_icon = 'csv.png';
                                    } else if ($temp_format[1] == 'exe') {
                                        $format_icon = 'exe.png';
                                    } else if ($temp_format[1] == 'psd') {
                                        $format_icon = 'psd.png';
                                    } else {
                                        $format_icon = 'default.png';
                                    }
                                    if (!(in_array($date_val, $week_array))) {
                                        ?>
                                        <div class="weekly <?php echo $today; ?>" id = '<?php echo $date_val; ?>'> <span><?php echo $week_day; ?></span> </div>   
                                    <?php }
                                    ?>			

                                    <?php
                                    if ($last_time == '' && $last_user_id == '') {
                                        //echo 'IST';
                                        ?>							

                                        <li class = 'statement-detail ist' data-id ="<?php echo $user_node_id; ?>" data-time="<?php echo $strtotime; ?>">
                                            <div class="dialogue-heading-wrap">
                                                <div class="dialogue-detail">
                                                    <div class="dialogue-left-pane">
                                                        <input type="checkbox">
                                                    </div>
                                                    <div class="dialogue-right-pane">
                                                        <span class="dialogue-title"> <?php echo $username; ?></span>  <span class="dialogue-date right"><ul><li id = "<?php echo $value['node_instance_property_id']; ?>">	<script> ConvertToLocalTimeZone(<?php echo $timestampseconds . ',' . $value['node_instance_property_id']; ?>);</script>  </li></ul></span>
                                                        <p class="<?php echo $cls . $value['node_instance_property_id']; ?>  ddd " data-instance_id = '<?php echo $value['node_instance_property_id']; ?>' >
                                                            <?php
                                                            if ($value['statement_type'] == 'Statement') {
                                                                echo trim($value['statement']);
                                                            } else if ($value['statement_type'] == 'image') {
                                                                if ($value['updated_status'] == '2') {
                                                                    echo trim($value['statement']);
                                                                } else {
                                                                    ?>
                                                                    <a href= "<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank"><img src="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/thumbs/" . $value['statement']; ?>"  class='atch-img-border' ></img></a>
                                                                    <?php
                                                                }
                                                            } else {
                                                                if ($value['updated_status'] == '2') {
                                                                    echo trim($value['statement']);
                                                                } else {
                                                                    ?>

                                                                    <a href="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank" class="downloadFile  truncate-attachments atch-img-border" ><img src="<?php echo BASE_URL_API ?>img/icons/<?php echo $format_icon; ?>" class='atch-img-border'><?php echo $value['statement']; ?><span class="fileSized"><?php echo @$readable_size; ?></span></a>
                                                                    <?php
                                                                }
                                                            }
                                                            ?>

                                                        </p>
                                                        <?php
                                                    } else if ($last_time == $strtotime && $last_user_id == $user_node_id) {
                                                        // echo '2ND';
                                                        ?>

                                                        <p class="<?php echo $cls . $value['node_instance_property_id']; ?>  sd"  data-instance_id = '<?php echo $value['node_instance_property_id']; ?>' >								

                                                            <?php
                                                            if ($value['statement_type'] == 'Statement') {
                                                                echo trim($value['statement']);
                                                            } else if ($value['statement_type'] == 'image') {
                                                                if ($value['updated_status'] == '2') {
                                                                    echo trim($value['statement']);
                                                                } else {
                                                                    ?>
                                                                    <a href= "<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank"><img src="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/thumbs/" . $value['statement']; ?>"  class='atch-img-border' ></img></a>
                                                                    <?php
                                                                }
                                                            } else {
                                                                if ($value['updated_status'] == '2') {
                                                                    echo trim($value['statement']);
                                                                } else {
                                                                    ?>
                                                                    <a href="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank" class="downloadFile truncate-attachments atch-img-border" ><img src="<?php echo BASE_URL_API ?>img/icons/<?php echo $format_icon; ?>" class='atch-img-border'><?php echo $value['statement']; ?><span class="fileSized"><?php echo @$readable_size; ?></span></a>
                                                                    <?php
                                                                }
                                                            }
                                                            ?>

                                                        </p>

                                                        <?php if ($total_val_count == $i + 1) {
                                                            ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        <?php } ?>

                                        <?php
                                    } else {   //echo '3ND';
                                        ?>

                                    </div>
                            </div>
                            </div>
                            </li>

                            <li class = 'statement-detail 2nd' data-id ="<?php echo $user_node_id; ?>" data-time="<?php echo $strtotime; ?>">
                                <div class="dialogue-heading-wrap">
                                    <div class="dialogue-detail">
                                        <div class="dialogue-left-pane">
                                            <input type="checkbox">
                                        </div>
                                        <div class="dialogue-right-pane">
                                            <span class="dialogue-title"> <?php echo $username; ?></span>  <span class="dialogue-date right"><ul><li id = "<?php echo $value['node_instance_property_id']; ?>">	<script> ConvertToLocalTimeZone(<?php echo $timestampseconds . ',' . $value['node_instance_property_id']; ?>);</script>  </li></ul></span>
                                            <p class="<?php echo $cls . $value['node_instance_property_id']; ?>  ll" data-instance_id = '<?php echo $value['node_instance_property_id']; ?>'  ><?php
                                                if ($value['statement_type'] == 'Statement') {
                                                    echo trim($value['statement']);
                                                } else if ($value['statement_type'] == 'image') {
                                                    if ($value['updated_status'] == '2') {
                                                        echo trim($value['statement']);
                                                    } else {
                                                        ?>
                                                        <a href= "<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank"><img src="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/thumbs/" . $value['statement']; ?>"  class='atch-img-border' ></img></a>
                                                        <?php
                                                    }
                                                } else {
                                                    if ($value['updated_status'] == '2') {
                                                        echo trim($value['statement']);
                                                    } else {
                                                        ?>
                                                        <a href="<?php echo BASE_URL_API ?>attachments/<?php echo $post['dialog_instance_node_id'] . "/" . $value['statement']; ?>" target="_blank" class="downloadFile  truncate-attachments atch-img-border" ><img src="<?php echo BASE_URL_API ?>img/icons/<?php echo $format_icon; ?>" class='atch-img-border'><?php echo $value['statement']; ?><span class="fileSized"><?php echo @$readable_size; ?></span></a>
                                                        <?php
                                                    }
                                                }
                                                ?>

                                            </p>
                                            <?php if ($total_val_count == $i + 1) {
                                                ?>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <?php
                            }
                        }
                        ?>

                        <?php
                        // echo "<pre>";print_r($week_array);
                        if (!in_array($date_val, $week_array)) {
                            array_push($week_array, $date_val);
                        }

                        $last_time = $strtotime;
                        $last_user_id = $user_node_id;

                        $i++;
                    }
                }
            } else {
                //echo 'array empty';
            }
            ?>  

            </div>


            </ul>

            <div class="panel"><div class="istyping" data-array=""></div><div class="fileView"></div></div>





            <?php
        } else if ($post['type'] == 'getDialogActor') {
            $returnResponse = $builderApiObj->getDialogueActor($post['dialog_instance_node_id'], '2');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray  );
            //die;
            if (!empty($returnArray['data'])) {
                ?>
                <input type ='hidden'  class ="admin-user-id" data-id = "<?php echo $returnArray['data'][0]['user_instance_node_id'] ?>">
                <?php
                foreach ($returnArray['data'] as $value) {
                    if ($value['admin'] != '1') {
                        $uname = $value['first_name'] . " " . $value['last_name'];
                        ?>
                        <div class='form-label part_id_block old_user_list dilaog_actor_list' data-id ="<?php echo $value['user_instance_node_id'] ?>"  >
                            <span class='ref_span_left'><i class='icon admin-user'></i> </span>
                            <span class='user-name-data'><?php echo $value['first_name'] . " " . $value['last_name'] . "(" . $value['email_address'] . ")"; ?></span>
                            <input type='hidden' class='user-name-val' value='<?php echo $uname ?>'>
                            <span class='ui_close_icon_block '><i class='icon close' onclick ="removeUserFromFile(<?php echo $post['dialog_instance_node_id'] . ',' . $value['user_instance_node_id'] ?>, this);"></i></span>


                        </div>

                        <?php
                    }
                }
            }
        } else if ($post['type'] == 'getAllUserList') {
            $returnResponse = $builderApiObj->getAllUserList($post['variable_data'], '1');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);die;
            if (!empty($returnArray)) {
                $newAry = array();
                $i = 0;
                foreach ($returnArray['data'] as $value) {
                    $newAry[$i]['user_name'] = $value['first_name'] . " " . $value['last_name'] . " (" . $value['email_address'] . ")";
                    $newAry[$i]['user_instance_node_id'] = $value['user_instance_node_id'];
                    $i++;
                    ?>

                    <?php
                }
                echo json_encode($newAry, true);
                //echo "<pre>";print_r($newAry);
            }
        } else if ($post['type'] == 'removeUserFromFile') {
            $returnResponse = $builderApiObj->removeUserFromFile($post['dialog_data'], '1');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);die;
        } else if ($post['type'] == 'saveNewActor') {
            $returnResponse = $builderApiObj->saveNewActorDetail($post['dialog_data'], '1');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);die;
        }
        // save new dialogue 
        else if ($post['type'] == 'saveNewDialog') {

            $returnResponse = $builderApiObj->saveNewDialogDetail($post['dialog_data'], '1');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);
            //die;
            if (!empty($returnArray['data'])) {

                $dialogDetail = $post['dialog_data'];
                $dialog_instance_node_id = $returnArray['data']['dialog_instance_node_id'];
                $course_instance_node_id = $returnArray['data']['course_instance_node_id'];
                $dialog_node_instance_property_id = $returnArray['data']['dialog_node_instance_property_id'];
                $user_name = $dialogDetail['other_user_name'];

                /* if( strlen( $user_name ) > 30 ) {
                  $user_name = substr( $user_name, 0, 30 ). '...';
                  }
                  else{
                  $user_name = $user_name;
                  } */
                if ($dialogDetail['dialogue_title'] == '') {
                    $dialogue_title = 'Untitled';
                } else {
                    $dialogue_title = htmlentities(trim($dialogDetail['dialogue_title']));
                }
                $i = 0;
                ?>	                                          

                <div class="panel">

                    <div class="panel-heading panel_active" onclick ='getAllDialogue(this);' role="tab" id="heading-accordion-<?php echo $i; ?>" data-id ="<?php echo $course_instance_node_id; ?>" data-count = "<?php echo $i; ?>">
                        <div class="panel-title">
                            <a role="button" class="base-container clearfix " data-toggle="collapse" data-parent="#accordion" href="#collapse-accordion-<?php echo $i; ?>" aria-expanded="true" aria-controls="collapse-accordion-<?php echo $i; ?>">
                                <div class="user-pic-sm">
                                    <img src="<?php echo BASE_URL_API; ?>img/course-big.svg" alt=""/>
                                </div> 
                                <div class="base-title">
                                    <span class="mini-course-title truncate-course"><?php echo htmlentities(trim($dialogDetail['course_title'])); ?></span>
                                    <span class="mini-course-participant truncate-course" data-id ="<?php echo $dialogDetail['user_instance_node_id']; ?>" ><?php echo $user_name; ?></span>

                                </div> 
                                <i class="fa fa-angle-down right"></i>
                            </a>
                        </div>
                    </div>
                    <div id="collapse-accordion-<?php echo $i; ?>" class="panel-collapse dialog-accordion collapse in" role="tabpanel" aria-labelledby="heading-accordion-<?php echo $i; ?>">
                        <div class="panel-body">
                            <ul id = "dialog-container">
                                <li class="online_users new selected " id = '<?php echo $dialog_instance_node_id; ?>' data-id ='<?php echo $dialog_node_instance_property_id; ?>'>
                                    <div class="mini-course-dialogue-box clearfix">
                                        <div class="user-pic-sm">
                                            <img src="<?php echo BASE_URL_API; ?>img/dialogue-big.png" alt=""/>
                                        </div>
                                        <div class="mini-course-dialogue-info left">
                                            <span class="mini-course-dialogue-title dialog-title "><?php echo $dialogue_title; ?></span>
                                            <span class="mini-course-dialogue-desc truncate-desc user-node-id" data-id ="<?php echo $dialogDetail['user_instance_node_id']; ?>"><?php echo $user_name; ?></span>
                                            <input type = 'hidden' class= "dialog-admin-email" value="<?php echo $dialogDetail['user_name'] ?>">
                                        </div>
                                        <div class="mini-course-dialogue-date right">
                                            <span class="mini-course-date"><?php echo date('m/d/Y') ?></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>



                    <!-- -->
                </div> 

                <?php
            }
        }
        // get all the course related to user
        else if ($post['type'] == 'searchCourseByTitle') {

            $returnResponse = $builderApiObj->searchCourseByTitle($post['search_data'], '2');
            $returnArray = json_decode($returnResponse, true);


            if (!empty($returnArray)) {
                $newAry = array();
                $i = 0;
                foreach ($returnArray['data'] as $value) {
                    $newAry[$i]['course_title'] = $value['course_title'];
                    $newAry[$i]['course_instance_node_id'] = $value['course_instance_node_id'];
                    $i++;
                    ?>

                    <?php
                }
                echo json_encode($newAry, true);
                //echo "<pre>";print_r($newAry);
            }
        } else if ($post['type'] == 'getRandomNodeId') {

            $returnResponse = $builderApiObj->getRandomNodeId('2');
            $returnArray = json_decode($returnResponse, true);
            echo $returnArray['data'];
        } else if ($post['type'] == 'deleteStatement') {

            $returnResponse = $builderApiObj->deleteStatement($post['delete_data'], '4');
            $returnArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($returnArray);
            //	echo "<pre>";print_r($returnArray);
            ?>

                                                                                                <!-- <p class="rmv-disabled clearfix" data-instance_id = '<?php echo $post['delete_data']['node_instance_id']; ?>'  >
                                                                                                                        This message has been removed.		
                                                                                                                </p>
            -->

            <?php
        } else if ($post['type'] == 'searchDialogDetail') {

            $returnResponse = $builderApiObj->searchDialogInfo($post['dialog_data']);
            $dialogArray = json_decode($returnResponse, true);
            //echo "<pre>";print_r($dialogArray);
            //die;
            if (!empty($dialogArray['data'])) {
                $i = 1;
                foreach ($dialogArray['data'] as $key => $dialogDetail) {
                    if (!empty($dialogDetail)) {
                        $user_name = $dialogDetail['user_name'];
                        $course_title = $dialogDetail['course_title'];
                        if ($i == 1) {
                            $angle = 'fa-angle-down';
                            $active_class = 'panel_active';
                            $expand_class = 'in';
                        } else {
                            $angle = 'fa-angle-up';
                            $active_class = '';
                            $expand_class = '';
                        }
                        ?>	

                        <div class="panel">

                            <div class="panel-heading  <?php echo $active_class; ?> search-course-dialog " onclick ='' role="tab" id="heading-accordion-<?php echo $i; ?>" data-id ="<?php echo $dialogDetail['course_instance_node_id']; ?>" data-count = "<?php echo $i; ?>">
                                <div class="panel-title">
                                    <a role="button" class="base-container clearfix" data-toggle="collapse" data-parent="#accordion" href="#collapse-accordion-<?php echo $i; ?>" aria-expanded="false" aria-controls="collapse-accordion-<?php echo $i; ?>">
                                        <div class="user-pic-sm">
                                            <img src="<?php echo BASE_URL_API; ?>img/course-big.svg" alt=""/>
                                        </div> 
                                        <div class="base-title">
                                            <span class="mini-course-title truncate-course highlight_class "><?php echo $course_title; ?></span>
                                            <span class="mini-course-participant truncate-course" data-id ="<?php echo $dialogDetail['user_id']; ?>" ><?php echo $user_name; ?></span>

                                        </div> 
                                        <i class="fa <?php echo $angle; ?> right"></i>
                                    </a>
                                </div>
                            </div>
                            <div id="collapse-accordion-<?php echo $i; ?>" class="panel-collapse dialog-accordion collapse <?php echo $expand_class; ?>" role="tabpanel" aria-labelledby="heading-accordion-<?php echo $i; ?>">
                                <div class="panel-body">
                                    <ul id = "dialog-container">
                                        <?php
                                        if ($dialogDetail['dialog_data'] == '1') {
                                            foreach ($dialogDetail as $k => $output) {

                                                if (is_array($output)) {

                                                    $user_name = $output['user_name'];
                                                    if ($output['dialog_title'] == '') {
                                                        $dialog_title = 'Untitled';
                                                    } else {
                                                        $dialog_title = $output['dialog_title'];
                                                    }

                                                    $user_temp = explode(',', $output['user_id']);
                                                    if (count($user_temp) == '1') {
                                                        //$user_img = "img/user.svg";
                                                    } else {
                                                        //$user_img = "img/default-group.svg";
                                                    }
                                                    $user_temp_name = explode(', ', $output['user_name']);
                                                    ;
                                                    $user_img = 'dialogue-big.png';
                                                    //maintain delete icon
                                                    if ($user_temp[0] != $user_instance_node_id) {
                                                        $delete_class = 'hide';
                                                    } else {
                                                        $delete_class = '';
                                                    }

                                                    if (!@$output['notification_count']) {
                                                        $notification_class = 'hide';
                                                    } else {
                                                        $notification_class = '';
                                                    }
                                                    /* if($j==0)
                                                      {
                                                      $selected_cls = 'selected';
                                                      }
                                                      else
                                                      {
                                                      $selected_cls = '';
                                                      } */
                                                    ?>	
                                                    <li class="online_users  " id = '<?php echo $output['dialogue_instance_node_id']; ?>' data-id ='<?php echo $output['node_instance_property_id']; ?>'>
                                                        <div class="mini-course-dialogue-box clearfix">
                                                            <div class="user-pic-sm">
                                                                <img src="<?php echo BASE_URL_API; ?>img/dialogue-big.png" alt=""/>
                                                            </div>
                                                            <div class="mini-course-dialogue-info left">
                                                                <span class="mini-course-dialogue-title dialog-title truncate-desc highlight_class "><?php echo $dialog_title; ?></span>
                                                                <span class="mini-course-dialogue-desc truncate-desc user-node-id" data-id ="<?php echo $output['user_id']; ?>"><?php echo $user_name; ?></span>
                                                                <input type = 'hidden' class= "dialog-admin-email" value="<?php echo $output['admin_email'] ?>">
                                                            </div>
                                                            <div class="mini-course-dialogue-date right">
                                                                <span class="mini-course-date"><?php echo date('m/d/Y', strtotime($output['dialogue_timestamp'])) ?></span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <?php
                                                }
                                                //$j++ ;
                                            }
                                        }
                                        ?>		
                                    </ul>
                                </div>
                            </div>
                        </div> 
                        <?php
                        $i++;
                    } //foreach
                }
            }
        } else if ($post['type'] == 'deleteNotification') {
            $returnResponse = $builderApiObj->deleteNotification($post['dialog_data']);
            $dialogArray = json_decode($returnResponse, true);
            //echo "<pre>"; print_r($dialogArray);
        } else if ($post['type'] == 'deleteDilaogue') {
            $returnResponse = $builderApiObj->deleteDilaogue($post['dialog_data']);
            $dialogArray = json_decode($returnResponse, true);
            //echo "<pre>"; print_r($dialogArray);
        } else if ($post['type'] == 'getAllSystemActor') {
            $returnResponse = $builderApiObj->getAllSystemActor($post['dialog_data']);
            $dialogArray = json_decode($returnResponse, true);
            echo "<pre>";
            print_r($dialogArray);
        } else if ($post['type'] == 'getAllCourse') {
            $returnResponse = $builderApiObj->getAllCourse($post['variable_data']);
            $dialogArray = json_decode($returnResponse, true);
            //echo "<pre>"; print_r($dialogArray);
            //die;
            ?>
            <?php
            if (!empty($dialogArray['data'])) {
                $i = 1;
                foreach ($dialogArray['data'] as $key => $dialogDetail) {

                    $user_name = $dialogDetail['user_name'];
                    $course_title = $dialogDetail['value'][0];
                    if ($i == 1) {
                        $angle = 'fa-angle-down';
                    } else {
                        $angle = 'fa-angle-up';
                    }
                    ?>	
                    <div class="panel">

                        <div class="panel-heading " onclick ='getAllDialogue(this);' role="tab" id="heading-accordion-<?php echo $i; ?>" data-id ="<?php echo $dialogDetail['course_instance_node_id']; ?>" data-count = "<?php echo $i; ?>">
                            <div class="panel-title">
                                <a role="button" class="base-container clearfix" data-toggle="collapse" data-parent="#accordion" href="#collapse-accordion-<?php echo $i; ?>" aria-expanded="false" aria-controls="collapse-accordion-<?php echo $i; ?>">
                                    <div class="user-pic-sm">
                                        <img src="<?php echo BASE_URL_API; ?>img/course-big.svg" alt=""/>
                                    </div> 
                                    <div class="base-title">
                                        <span class="mini-course-title truncate-course"><?php echo $course_title; ?></span>
                                        <span class="mini-course-participant truncate-course" data-id ="<?php echo $dialogDetail['user_id']; ?>" ><?php echo $user_name; ?></span>

                                    </div> 
                                    <i class="fa <?php echo $angle; ?> right"></i>
                                </a>
                            </div>
                        </div>
                        <div id="collapse-accordion-<?php echo $i; ?>" class="panel-collapse dialog-accordion collapse" role="tabpanel" aria-labelledby="heading-accordion-<?php echo $i; ?>">
                            <div class="panel-body">
                                <ul id = "dialog-container">
                                    <!-- <li>
                    <div class="mini-course-dialogue-box clearfix">
                    <div class="mini-course-dialogue-info left">
                    <span class="mini-course-dialogue-title">Dialogue Title</span>
                    <span class="mini-course-dialogue-desc truncate-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                    </div>
                    <div class="mini-course-dialogue-date right">
                    <span class="mini-course-date">08/03/2016</span>
                    </div>
                    </div>
                    </li>
                    <li>
                    <div class="mini-course-dialogue-box clearfix">
                    <div class="mini-course-dialogue-info left">
                    <span class="mini-course-dialogue-title ">Dialogue Title</span>
                    <span class="mini-course-dialogue-desc truncate-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                    </div>
                    <div class="mini-course-dialogue-date right">
                    <span class="mini-course-date">08/03/2016</span>
                    </div>
                    </div>
                    </li>
                    <li>
                    <div class="mini-course-dialogue-box clearfix">
                    <div class="mini-course-dialogue-info left">
                    <span class="mini-course-dialogue-title">Dialogue Title</span>
                    <span class="mini-course-dialogue-desc truncate-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                    </div>
                    <div class="mini-course-dialogue-date right">
                    <span class="mini-course-date">08/03/2016</span>
                    </div>
                    </div>
                    </li>
                    <li>
                    <div class="mini-course-dialogue-box clearfix">
                    <div class="mini-course-dialogue-info left">
                    <span class="mini-course-dialogue-title">Dialogue Title</span>
                    <span class="mini-course-dialogue-desc truncate-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                    </div>
                    <div class="mini-course-dialogue-date right">
                    <span class="mini-course-date">08/03/2016</span>
                    </div>
                    </div>
                    </li> -->
                                </ul>
                            </div>
                        </div>
                    </div> 

                    <?php
                    $i++;
                } //foreach
            }
        }
    } // chat action end

    /**
     * Modified by: Amit Malakar
     * Date: 03-Mar-2017
     * @param array $_POST
     * @return array
     */
    if ($action == 'signin') {
        
        $json = array();
        parse_str($post['data'], $postArray);

        $postArray['domainName'] = $post['domainName'];
        $postArray['node_id'] = 275709;
        $returnResponse = $builderApiObj->userLogin($postArray, '8');
        $returnArray = json_decode($returnResponse, true);

        $is_domain_user = 'N';
        if (strtolower($post['domainName']) != 'www.pui.com' && strtolower($post['domainName']) != 'www.prospus.com' && strtolower($post['domainName']) != 'www.investible.com') {
            if (strtolower($returnArray['data']['domain']) == strtolower($post['domainName'])) {
                $is_domain_user = 'Y';
            }
        } else {
            $is_domain_user = 'Y';
        }
        

        if ($is_domain_user == 'Y') {
            //$_userFileName = ABSO_URL_API . "temp_session/sess_" . $post['sessId'];
            if (count($returnArray['data']) > 0) {
                // get all the files saved in desired folder
                //$fileArray = glob(ABSO_URL_API . "temp_session/*");
                $fileArray=$sdkApi->getBucketFilesLists('temp_session/sess_');
        
                foreach ($fileArray as $key => $value) {
                    //$handle = fopen($value, "r") or die('cannot create file');
                   $fileExist =  $sdkApi->isObjectExist('temp_session/'.$value);
                   if ($fileExist){
                        //if string exists
                      $buffer = $sdkApi->getFileData('temp_session/'.$value);
                   // echo $buffer;
                        if (stripos($buffer, $returnArray['data']['email_address']) !== false) {
                            if ($post['forceUser'] == "N" /* && $_userFileName != $value */) {
                                $json['result'] = '2';
                                $json['msg'] = 'User already logged in';
                                $json['email_address'] = $returnArray['data']['email_address'];
                                print json_encode($json);
                                die;
                                /* } else if ($_userFileName == $value) {
                                  break 2; */
                            } else {
                                $sdkApi->deleteFileData('temp_session/'.$value);
                                
                                //fclose($handle);
                                //unlink($value);
                            }
                        }
                    }
                }

                $roleDD = '';
                $cRoleDD = '';
                $current_role = '';

                

                if (count($returnArray['data']['rolesArray']) > 0) {
                    $newRoleArray = array();
                    foreach ($returnArray['data']['rolesArray'] as $roleId => $roleName) {
                        if(trim($roleName['name']) != '' && trim($roleName['id']) != '')
                        {
                            $newRoleArray[] = $roleName;
                        }
                    }
                    $returnArray['data']['rolesArray'] = $newRoleArray;

                    $current_role = current($returnArray['data']['rolesArray'])['id'];
                    foreach ($returnArray['data']['rolesArray'] as $roleId => $roleName) {
                        if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '')
                            $roleDD .= '<li class="active-list" onclick="changeUserRole(' . $roleName['id'] . ')" ><a data-role-id="' . $roleName['id'] . '" class="roles"><span class="icon dot"></span>' . $roleName['name'] . '</a></li>';
                        else
                            $cRoleDD = $roleName['name'];
                    }
                }

                $returnArray['data']['current_role'] = $current_role;

                $json['roles'] = $roleDD;
                $json['crole'] = $cRoleDD;
                $json['user'] = $returnArray['data'];
                //$_SESSION['user'] = $returnArray['data'];
                $handler->write(json_encode($returnArray['data']));
                
                if (isset($postArray['rememberme']) && $postArray['rememberme'] == 1) {
                    $_userCookie['userData'] = array(
                        'emailaddress' => $postArray['emailaddress'],
                        'password' => $postArray['password']
                    );
                    $_userCookie['sessId'] = $post['sessId'];
                    //$_userCookie['domainName'] = $post['domainName'];
                    $json['userCookie'] = json_encode($_userCookie);
                    //$cookie_name = '_ALEAESSCSLD';
                    //setcookie($cookie_name, base64_encode(serialize($_userCookie)), time() + (86400 * 30), '/');
                    //            if (!isset($_COOKIE[$cookie_name])) {
                    //                setcookie($cookie_name, base64_encode(serialize($postArray)), time() + (86400 * 30));
                    //            }
                }
            }

            $json['result'] = $returnArray['result'];
            $json['msg'] = $returnArray['msg'];
        } else {
            if (isset($postArray['rememberme']) && $postArray['rememberme'] == 1) {
                $json['cookieError'] = '1';
            }
            $json['result'] = '1';
            $json['msg'] = 'Email address or password is invalid.';
        }

        print json_encode($json);
        exit;
    }

    /**
     * Modified by: Amit Malakar
     * Date: 03-Mar-2017
     * @param action
     * @param sessId
     * @return array
     */
    if ($action == 'checklogin') {
        // NEW CODE
        $json = array();
        if(isset($_POST['sessId'])) {
            $fileExist =  $sdkApi->isObjectExist('temp_session/sess_'.$_POST['sessId']);
            if ($fileExist) {
                $userDataJson = $sdkApi->getFileData('temp_session/sess_'.$_POST['sessId']);
                if(!empty($userDataJson)) {
                    $userData       = json_decode($userDataJson,true);
                    if (count($userData['rolesArray']) > 0) {
                        $current_role = $userData['current_role'];
                        foreach ($userData['rolesArray'] as $roleId => $roleName) {
                            if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '')
                                $roleDD .= '<li class="active-list" onclick="changeUserRole(' . $roleName['id'] . ')" ><a data-role-id="' . $roleName['id'] . '" class="roles"><span class="icon dot"></span>' . $roleName['name'] . '</a></li>';
                            else
                                $cRoleDD = $roleName['name'];
                        }
                    }
                    $json['roles']  = $roleDD;
                    $json['crole']  = $cRoleDD;
                    $json['user']   = $userData;
                    $json['result'] = 0;
                } else {
                    $json['result'] = 1;
                }
            } else {
                $json['result'] = 1;
            }
        } else {
            $json['result'] = 1;
        }
        print json_encode($json); exit;

        /* //OLD CODE
        if ($_SESSION['user']['node_id'] != "") {
            $roleDD = '';
            $cRoleDD = '';
            $current_role = '';
            if (count($_SESSION['user']['rolesArray']) > 0) {
                $current_role = $_SESSION['user']['current_role'];
                foreach ($_SESSION['user']['rolesArray'] as $roleId => $roleName) {
                    if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '')
                        $roleDD .= '<li class="active-list" onclick="changeUserRole(' . $roleName['id'] . ')" ><a data-role-id="' . $roleName['id'] . '" class="roles"><span class="icon dot"></span>' . $roleName['name'] . '</a></li>';
                    else
                        $cRoleDD = $roleName['name'];
                }
            }


            $json['roles'] = $roleDD;
            $json['crole'] = $cRoleDD;
            $json['user'] = $_SESSION['user'];
            $json['result'] = 0;
        }
        else {
            $json['result'] = 1;
        }

        print json_encode($json);
        exit;
        */
    }

    /**
     * Modified by: Amit Malakar
     * Date: 03-Mar-2017
     * @param array $_POST
     * @return array
     */
    if ($action == 'changeRole') {

        // NEW CODE
        $json = array();
        if(isset($_POST['sessId'])) {
            $fileExist =  $sdkApi->isObjectExist('temp_session/sess_'.$_POST['sessId']);
            if ($fileExist) {
                $userDataJson = $sdkApi->getFileData('temp_session/sess_'.$_POST['sessId']);
                if(!empty($userDataJson)) {
                    $userData       = json_decode($userDataJson,true);
                    $roleDD         = '';
                    $cRoleDD        = '';
                    $current_role   = '';
                    if (count($userData['rolesArray']) > 0) {
                        $current_role = $userData['current_role'] = $_POST['role_id'];
                        foreach ($userData['rolesArray'] as $roleId => $roleName) {
                            if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '')
                                $roleDD .= '<li class="active-list" onclick="changeUserRole(' . $roleName['id'] . ')" ><a data-role-id="' . $roleName['id'] . '" class="roles"><span class="icon dot"></span>' . $roleName['name'] . '</a></li>';
                            else
                                $cRoleDD = $roleName['name'];
                        }
                    }
                    $handler->write(json_encode($userData));    // update session with current role selection
                    $json['roles']  = $roleDD;
                    $json['crole']  = $cRoleDD;
                    $json['user']   = $userData;
                    $json['result'] = 0;
                } else {
                    $json['result'] = 1;
                }
            } else {
                $json['result'] = 1;
            }
        } else {
            $json['result'] = 1;
        }

        print json_encode($json);
        exit;

        /* OLD CODE
        if ($_SESSION['user']['node_id'] != "") {
            $_SESSION['user']['current_role'] = $post['role_id'];
            $roleDD = '';
            $cRoleDD = '';
            $current_role = '';
            if (count($_SESSION['user']['rolesArray']) > 0) {
                $current_role = $_SESSION['user']['current_role'];
                foreach ($_SESSION['user']['rolesArray'] as $roleId => $roleName) {
                    if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '')
                        $roleDD .= '<li class="active-list" onclick="changeUserRole(' . $roleName['id'] . ')" ><a data-role-id="' . $roleName['id'] . '" class="roles"><span class="icon dot"></span>' . $roleName['name'] . '</a></li>';
                    else
                        $cRoleDD = $roleName['name'];
                }
            }


            $json['roles'] = $roleDD;
            $json['crole'] = $cRoleDD;
            $json['user'] = $_SESSION['user'];
            $json['result'] = 0;
        }
        else {
            $json['result'] = 1;
        }
        print json_encode($json);
        exit;
        */
    }

    if ($action == 'checkSessionFile') {
        if ($post['sessId'] != "") {
            $result =  $sdkApi->isObjectExist("temp_session/sess_" . $post['sessId']);
            //            var_dump($post);
            //            var_dump($result);
            //            die;
        if ($result) {
                //$file_data = file_get_contents($file_path);
            $file_data = $sdkApi->getFileData("temp_session/sess_" . $post['sessId']);
             $count = strlen(trim($file_data));
                // $json['data'] = $count ;

                if ($count) {
                    $json['result'] = 0;
                } else {
                    // if file empty
                    $json['result'] = 2;
                }
            } else {
                // if file doesn't exists
                $json['result'] = 1;
            }
        }


        print json_encode($json);
        exit;
   }

    if ($action == 'logout') {
        $cookieemailAdd = '';
        $cookiepassword = '';
        if (isset($post['cookiedata'])) {
            $cookie = json_decode($post['cookiedata']);
            $cookieCredentials = $cookie->userData;
            $cookieemailAdd = $cookieCredentials->emailaddress;
            $cookiepassword = $cookieCredentials->password;
        }

        $post = $_POST;
        $handler = new FileSessionHandler();
        $handler->destroy($post['sessId']);
        //unlink(ABSO_URL_API . "temp_session/sess_" . $post['sessId']);
        unset($_SESSION['user']);
        unset($_SESSION['uniqueId']);
        $json['result'] = 0;
        $json['cookieemailAdd'] = $cookieemailAdd;
        $json['cookiepassword'] = $cookiepassword;
        print json_encode($json);
        exit;
    }

    if ($action == 'plugInRequest') {
        $posted = $_POST;
        $node_class_id = 481;
        $dataArray = array();
        if ($posted['domainName'] == 'www.prospus.com')
            $posted['domainName'] = '166.62.17.201';
        $instance_property_id_array = array('2317', '2318', '2319', '2320'); // Domain, Time, File Count, Package Size
        $instance_property_caption_array = array($posted['domainName'], date('Y-m-d h:i:s'), '21', '10066329.6 bytes');
        $dataArray['node_class_id'] = $node_class_id;
        $dataArray['node_class_property_id'] = $instance_property_id_array;
        $dataArray['value'] = $instance_property_caption_array;

        $returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');

        $returnArray = json_decode($returnResponse, true);

        $json['result'] = $returnArray['result'];
        $json['msg'] = $returnArray['msg'];
        print json_encode($json);
        exit;
    }
//******************************START******************RESET PASSWORD CODE****************************************************************
// ADDED BY- GAURAV DUTT PANCHAL
// DATE- 30 NOV, 2016
    /*
     * CHECK USER EXIST OR NOT 
     * PARAMS: EMAIL ID
     */
    if ($action == 'validateEmail') {

        if (!empty($_REQUEST["email"])) {
            $_REQUEST['email_property_id'] = EMAIL_PROPERTY_ID;
            $_REQUEST['template_class_id'] = EMAIL_HTML_TEMPLATE_CLASS_ID;
            $_REQUEST['template_property_id'] = EMAIL_HTML_TEMPLATE_PROPERTY_ID;
            $_REQUEST['template_domain_property_id'] = EMAIL_HTML_TEMPLATE_DOMAIN_PROPERTY_ID;
            $_REQUEST['template_domain'] = EMAIL_HTML_DOMAIN;
            $_REQUEST['fname_property_id'] = FIRST_NAME_PROPERTY_ID;
            $_REQUEST['lname_property_id'] = LAST_NAME_PROPERTY_ID;
            $_REQUEST['redirect_url']    = PASSWORD_REDIRECT_URL;
            
            
            $returnResponse = $builderApiObj->validateEmail();
            $json = json_decode($returnResponse, true);
        } else {
            // handle the issue invalid email address
            $json['result']['status'] = 'error';
            $json['result']['msg'] = 'Your email address is invalid.';
        }

        print json_encode($json);
        exit;
    }
    /*
     * CHECK RESET PASSWORD CODE 
     * PARAMS: CODE AND EMAIL ID
     */
    if ($action == 'validateCode') {

        if (!empty($_REQUEST["code"]) && !empty($_REQUEST["email"])) {
            $_REQUEST['fname_property_id'] = FIRST_NAME_PROPERTY_ID;
            $_REQUEST['lname_property_id'] = LAST_NAME_PROPERTY_ID;
            $_REQUEST['email_property_id'] = EMAIL_PROPERTY_ID;
            $_REQUEST['redirect_url']    = PASSWORD_REDIRECT_URL;
            $returnResponse = $builderApiObj->validateCode();
            $json = json_decode($returnResponse, true);
        } else if (empty($_REQUEST["code"])) {
            $json['result']['status'] = 'error';
            $json['result']['msg'] = 'Enter code.';
        } else if (empty($_REQUEST["email"])) {
            $json['result']['status'] = 'error';
            $json['result']['msg'] = 'Enter email.';
        }
        print json_encode($json);
        exit;
    }
    /*
     * RESET USER PASSWORD
     * PARAMS: INSTANCE ID OF ACCOUNT CLASS AND NEW PASSWORD
     */
    if ($action == 'resetPassword') {

        if (!empty($_REQUEST["email"])) {
            $_REQUEST['password_property_id'] = PASSWORD_PROPERTY_ID;
            $_REQUEST['email_property_id']    = EMAIL_PROPERTY_ID;
            $_REQUEST['redirect_url']    = PASSWORD_REDIRECT_URL;
            $returnResponse = $builderApiObj->resetPassword();
            $json = json_decode($returnResponse, true);
            
        } else{
            $json['result']['status'] = 'error';
            $json['result']['msg'] = 'Something went wrong.';
        }
        print json_encode($json);
        exit;

    }

    if ($action == 's3_bucket') {

        $fileArray = $sdkApi->getBucketFilesLists($post['path']);
        print_r($fileArray);
    }
}
//******************************END******************RESET PASSWORD CODE****************************************************************
function humanFileSize($size) {
    if ($size >= 1073741824) {
        $fileSize = round($size / 1024 / 1024 / 1024, 2) . 'GB';
    } elseif ($size >= 1048576) {
        $fileSize = round($size / 1024 / 1024, 2) . 'MB';
    } elseif ($size >= 1024) {
        $fileSize = round($size / 1024, 2) . 'KB';
    } else {
        $fileSize = $size . ' bytes';
    }
    return $fileSize;
}
?>
