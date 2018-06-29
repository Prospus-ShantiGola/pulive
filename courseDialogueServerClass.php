<?php
    /**
    * Added By: Kunal Kumar
    * Date: 18-Apr-2017
    * Class for chat server functions
    *
    */
include("notification/PushNotification.php");
//require_once 'module/Api/src/Api/Model/Response.php';

class courseDialogueServerClass{


   private $MySQLiconn;
    public function __construct($MySQLiconn) {
        $this->MySQLiconn = $MySQLiconn;
        date_default_timezone_set("Asia/Calcutta");
    }


    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to create node id
     * @return mixed
     */
    public function createNode()
    {
        //global $this->MySQLiconn;
        $uuid_id = bin2hex(openssl_random_pseudo_bytes(8)); //get uuid value by using UUID algorithm from mySql
        $sql     = "INSERT INTO `node` (`node_uuid_id`) VALUES ('$uuid_id')";
        $res     = $this->MySQLiconn->query($sql);
        return $this->MySQLiconn->insert_id;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to update course status
     * @param $courseInsId
     * @param $dialogueId
     */
    public function updatecourseStatus($courseInsId, $dialogueId)
    {
        //global $this->MySQLiconn;
        $sql = "UPDATE `node-instance` SET `status` = '1' WHERE `node_instance_id` = '$courseInsId'";
        $res = $this->MySQLiconn->query($sql);
        $sql = "UPDATE `node-instance` SET `status` = '1' WHERE `node_id` = '$dialogueId'";
        $res = $this->MySQLiconn->query($sql);
        $success = $this->updateDialogTimestamp($dialogueId);
    }
    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to update Dialogue timestamp
     * @param $dialogue_node_id
     * @return int
     */
    public function updateDialogTimestamp($dialogue_node_id)
    {
        //global $this->MySQLiconn;
        $date = date("Y-m-d H:i:s");
        if (intval($dialogue_node_id) > 0) {
            //get the node-instance-property id
             $sql                       = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`
                FROM `node-instance-property` AS `nip`
                INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
                INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
                WHERE `ni`.`node_id` = '$dialogue_node_id' AND `ncp`.`caption` = 'Updated Timestamp'";
            $res                       = $this->MySQLiconn->query($sql);
            $res                       = $res->fetch_assoc();
            $node_instance_property_id = $res['node_instance_property_id'];
            $sql = "UPDATE `node-instance-property` SET `value` = '$date' WHERE `node_instance_property_id` = '$node_instance_property_id'";
            $res = $this->MySQLiconn->query($sql);
            return $affectedRows = $this->MySQLiconn->affected_rows;
        }
    }
    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to update Course timestamp
     * @param $course_node_id
     * @return int
     */
    public function updateCourseTimestamp($course_node_id)
    {
        //global $this->MySQLiconn;
        $date = date("Y-m-d H:i:s");
        if (intval($course_node_id) > 0) {
            //get the node-instance-property id
             $sql                       = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`
                FROM `node-instance-property` AS `nip`
                INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
                INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
                WHERE `ni`.`node_id` = '$course_node_id' AND `ncp`.`caption` = 'Updation Timestamp'";
            $res                       = $this->MySQLiconn->query($sql);
            $res                       = $res->fetch_assoc();
            $node_instance_property_id = $res['node_instance_property_id'];
            $sql = "UPDATE `node-instance-property` SET `value` = '$date' WHERE `node_instance_property_id` = '$node_instance_property_id'";
            $res = $this->MySQLiconn->query($sql);
            return $affectedRows = $this->MySQLiconn->affected_rows;
        }
    }

    /**
     * Created By: Amit Malakar
     * Date: 17-Aug-17
     * Curl function will be used to send Email from PU
     * This function will be used in Course, Dialogue and Participant add
     * @return array
     */
    public function callPUMailer($data)
    {
        error_reporting(E_ALL);
        $query = http_build_query($data);
         $url   = SOCKET_HOST_NAME . 'api/email?' . $query;
        $ch    = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //curl_setopt($ch, CURLOPT_POST, true);
        //curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        $contents = curl_exec($ch);
        if (curl_errno($ch)) {
            // this would be your first hint that something went wrong
            $message = 'Couldn\'t send request: ' . curl_error($ch);
        } else {
            // check the HTTP status code of the request
            $resultStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($resultStatus == 200) {
                $message = 'success';
            } else {
                // request didn't complete, common errors are 4xx
                // (not found, bad request, etc.) and 5xx (usually concerning errors/exceptions in the remote script execution)
                $message = 'Request failed: HTTP status code: ' . $resultStatus;
            }
        }
        curl_close($ch);

        return array($message, $contents);
    }

    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to get last node id number
     * @param $table
     * @param $column
     * @return int
     */
    public function getLastNumber($table, $column)
    {
    //global $this->MySQLiconn;
     $sql       = "SELECT `$column` FROM `$table` ORDER BY `$column` DESC LIMIT 1";
    $res       = $this->MySQLiconn->query($sql);
    $dataArray = $res->fetch_assoc();
    print_r(array('hi', $dataArray));
    if (intval($dataArray[0][$column]) == "")
        return 1;
    else
        return intval($dataArray[0][$column]) + 1;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Function to encrypt any value if it's enabled
     * @param $encrypt
     * @param $key
     * @return string
     */
    public function mc_encrypt($encrypt, $key)
    {
    if (ENCRYPTION_STATUS == 0) {
        return $encrypt;
    } else {
        $encrypt   = serialize($encrypt);
        $iv        = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_DEV_URANDOM);
        $key       = pack('H*', $key);
        $mac       = hash_hmac('sha256', $encrypt, substr(bin2hex($key), -32));
        $passcrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $encrypt . $mac, MCRYPT_MODE_CBC, $iv);
        $encoded   = base64_encode($passcrypt) . '|' . base64_encode($iv);
        return $encoded;
    }
    }
    /**
     * Modified By: Amit Malakar
     * Date: 23-Mar-2017
     * Append chat message
     * @param $tst_msg
     * @return mixed|string
     */
    public function appendStatement($tst_msg)
    {
        //global $this->MySQLiconn;
        $reply_array = array();
        if (isset($tst_msg->message) && $tst_msg->message != "") {
            $updateTimestampDate = '';
            $jsonArray['message']                 = $tst_msg->message;
            $jsonArray['sender']                  = isset($tst_msg->user_instance_node_id) ? $tst_msg->user_instance_node_id : "";
            $jsonArray['course_node_id']          = isset($tst_msg->course_node_id) ? $tst_msg->course_node_id : "";
            $jsonArray['dialogue_node_id']        = isset($tst_msg->dialogue_node_id) ? $tst_msg->dialogue_node_id : "";
            $jsonArray['action']                  = '';
            if (isset($tst_msg->filetype) && !empty($tst_msg->filetype) && ($tst_msg->filetype == 'image')) {
                $jsonArray['action'] = "image";
                $jsonArray['type']   = "image";
            } else if (isset($tst_msg->filetype) && !empty($tst_msg->filetype) && $tst_msg->filetype == 'attachment') {
                $jsonArray['action'] = "attachment";
                $jsonArray['type']   = "attachment";
            } else {
                if( (isset($tst_msg->reply) && trim($tst_msg->reply) === 'no') || (!isset($tst_msg->reply)) ){
                    if (isset($tst_msg->node_instance_propertyid) && $tst_msg->node_instance_propertyid != "") {
                        $jsonArray['action'] = 'editMessage';
                        $jsonArray['node_instance_propertyid'] = $tst_msg->node_instance_propertyid;
                    } else {
                        $jsonArray['action'] = "Statement";
                    }
                }
                $jsonArray['type'] = "Statement";
            }
            $jsonArray['timestamp'] = $tst_msg->timestamp;
            //$prefixTitle            = PREFIX . 'user_info';
            //$jsonArray['username']  = $_SESSION[$prefixTitle]['first_name'] . ' ' . $_SESSION[$prefixTitle]['last_name'];
            // $savestate = $this->saveMainStatementInstance($jsonArray);
            // add statement chat data
            // comment by arti
            if ($jsonArray['action'] != 'editMessage') {

                //For Reply Message
                if(isset($tst_msg->reply) && trim($tst_msg->reply) === 'yes'){
                    $statement_reply_node_instance_prop_id = $tst_msg->node_instance_propertyid;
                    $jsonArray['reply'] = $reply_array = $this->getMessageReply($statement_reply_node_instance_prop_id);
                }
                /*End Here*/

                // add new statements - $this->saveStatement
                //$resultArray = $this->saveStatement($jsonArray);
                $resultArray = $this->saveStatement($jsonArray, $tst_msg, 'chat');
                $savestate = $resultArray['savestate'];
                $statement_instance_node_id = $resultArray['statement_instance_node_id'];
                /* Code For Add or Edit Notification Count */
                //$this->addNotificationOfChat($tst_msg,$statement_instance_node_id,1,0,'chat');
            } else {
                ##### edit existing statement - $this->saveEditedStatement($jsonArray); ####
                $node_instance_property_id = $jsonArray['node_instance_propertyid'];
                $jsonArray['message'] = trim($jsonArray['message']);
                $br_converted = preg_replace('#<br />(\s*<br />)+#', '<br />', nl2br($jsonArray['message']));
                 $sql = "UPDATE `node-instance-property` SET `value` = '$br_converted' WHERE `node_instance_property_id` = '$node_instance_property_id'";
                $this->MySQLiconn->query($sql);
                // get the node instance property id
                 $sql                       = "SELECT `nip`.`node_instance_property_id`"
                                            ." FROM `node-instance-property` AS `nip`"
                                            ." LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id`"
                                            ." INNER JOIN `node-class-property` AS `ncp`ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`"
                                            ." WHERE `ncp`.`caption` = 'Updated Status' AND `nip1`.`node_instance_property_id` = '$node_instance_property_id'";
                $res                       = $this->MySQLiconn->query($sql);
                $resArr                    = $res->fetch_assoc();
                $node_instance_property_id = $resArr['node_instance_property_id'];
                //get the node class property id
                $sql = "UPDATE `node-instance-property` SET `value` = '1' WHERE `node_instance_property_id` = '$node_instance_property_id'";
                $this->MySQLiconn->query($sql);
                $savestate = $jsonArray['node_instance_propertyid'];

                // code here for update timestamp for statement awdhesh soni
                $updateTimestamp = STATEMENT_UPDATED_TIMESTAMP;
                $updateTimestampSql                       ="SELECT `nip`.`node_instance_id` "
                 . "FROM `node-instance-property` AS `nip`"
                 ."LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                 . "INNER JOIN `node-class-property` AS `ncp`ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                 . "WHERE `nip`.`node_class_property_id` = '$updateTimestamp' AND `nip1`.`node_instance_property_id` = '$node_instance_property_id'";
                $resUpdateTimestamp                       = $this->MySQLiconn->query($updateTimestampSql);
                $resArr                    = $resUpdateTimestamp->fetch_assoc();
                $node_instance_id = $resArr['node_instance_id'];
                $sqlPropertyId                       = "SELECT `nip1`.`node_instance_property_id` "
                . "FROM `node-instance-property` AS `nip` "
                . "LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                . "INNER JOIN `node-class-property` AS `ncp`ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                . "WHERE `nip1`.`node_class_property_id` = '$updateTimestamp' AND `nip1`.`node_instance_id` = '$node_instance_id' limit 0,1";
                $resPropertyId                       = $this->MySQLiconn->query($sqlPropertyId);
                $resArr                    = $resPropertyId->fetch_assoc();
                $timestamp_instance_property_id = $resArr['node_instance_property_id'];
                $date_value = new DateTime();
                $updateTimestampDate = $date_value->getTimestamp();
                $sql = "UPDATE `node-instance-property` SET `value` = '$updateTimestampDate' WHERE `node_instance_property_id` = '$timestamp_instance_property_id'";
                $this->MySQLiconn->query($sql);

            }
            if (isset($tst_msg->courseStatementType) && $tst_msg->courseStatementType == "Draft" && isset($tst_msg->diaStatusType) && $tst_msg->diaStatusType == "Draft") {
                $this->updatecourseStatus($tst_msg->course_node_id, $tst_msg->dialogue_node_id);
                //print_r(array('dd', $tst_msg->course_node_id, $tst_msg->dialogue_node_id));
            } else if (isset($tst_msg->courseStatementType) && $tst_msg->courseStatementType == "Published" && isset($tst_msg->diaStatusType) && $tst_msg->diaStatusType == "Draft") {
                $this->updatecourseStatus($tst_msg->course_node_id, $tst_msg->dialogue_node_id);
                //print_r(array('pd', $tst_msg->course_node_id, $tst_msg->dialogue_node_id));
            }
            return array($savestate,$updateTimestampDate, array('reply_on_message'=>$reply_array));
        }
    }
    public function saveStatement($jsonArray, $jsonArrayTemp, $type) {
        //global $this->MySQLiconn;
        $node_property_id= ""; // define variable
        $node_class_id        = 180;//STATEMENT_CLASS_ID; // for testing socket errors used 180
        $node_type_id         = '2';
        $jsonArray['message'] = trim($jsonArray['message']);
        if (isset($jsonArray['courseSection']) && $jsonArray['courseSection'] == 1) {
            $message = str_replace('"', '', $jsonArray['message']);
            $temp    = explode('\n', $message);
        } else {
            $br_converted = preg_replace('#<br />(\s*<br />)+#', '<br />', nl2br($jsonArray['message']));
            if(!isset($jsonArray['reply'])) {
                $temp = explode('<br />', $br_converted);
            }else{
                $temp = array($br_converted);
            }
        }
       // print_r($temp);
       /// echo count($temp);
        //insert value in node instance property.
        //get the node class property id
        $classArray = array();
        $sql = "SELECT `caption`, `node_class_property_id` FROM `node-class-property` WHERE `node_class_id`='$node_class_id' AND `node_class_property_parent_id`!=0";
        $res = $this->MySQLiconn->query($sql);
        while ($crArr = $res->fetch_assoc()) {
            $classArray[] = $crArr;
        }
        if ($jsonArray['dialogue_node_id'] != '' && $jsonArray['sender'] != '') {
            $node_ids = '';
            //$date_value = date_create(); // comment by awdhesh
            $date_value = new DateTime(); // change by awdhesh for notice
            for ($k = 0; $k < count($temp); $k++) {
                //create node id first
                $node_id = $this->createNode();
                $sql                        = "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '1')";
                $res                        = $this->MySQLiconn->query($sql);
                $node_instance_id           = $this->MySQLiconn->insert_id;
                $statement_instance_node_id = $node_id;
                $valueArray = array();
                array_push($valueArray, $jsonArray['sender']);
                array_push($valueArray, $jsonArray['type']);
                //array_push($valueArray,$jsonArray['message']);
                array_push($valueArray, htmlentities(addslashes($temp[$k])));
                // array_push($valueArray, $jsonArray['timestamp']);
                //  array_push($valueArray, strtotime(date('Y-m-d h:i:s')));
                //return  date_timestamp_get($date_value);
                //return $date_value['timezone_type'];
                //array_push($valueArray, date_timestamp_get($date_value)); //
                array_push($valueArray, $date_value->getTimestamp()); // change by awdhesh soni for notice

                // array_push($valueArray, date('Y-m-d h:i:s'));
                array_push($valueArray, '0');
                array_push($valueArray, $date_value->getTimestamp()); // added code for updated timestamp

                //For reply on message
                if(isset($jsonArray['reply']) && count($jsonArray['reply']))
                {
                    $reply = json_encode($jsonArray['reply'], JSON_FORCE_OBJECT);
                }else{
                    $reply = '';
                }
                array_push($valueArray, $reply);

                $i = 0;
                foreach ($classArray as $value) {
                    $val_node_id                = $this->createNode();
                    $val_node_instance_id       = $node_instance_id;
                    $val_node_class_property_id = $value['node_class_property_id'];
                    $val_node_type_id           = $node_type_id;
                    $val_value                  = addslashes(trim($valueArray[$i]));
                    $sql              = "INSERT INTO `node-instance-property` (`node_id`, `node_instance_id`, `node_class_property_id`, `node_type_id`, `value`) VALUES ('$val_node_id', '$val_node_instance_id', '$val_node_class_property_id', '$val_node_type_id', '$val_value')";
                    $res              = $this->MySQLiconn->query($sql);
                    $node_property_id = $this->MySQLiconn->insert_id;
                    if ($value['caption'] == 'Statement') {
                        $statement_node_property_id = $node_property_id;
                        $statement_node_instance_id = $node_instance_id;
                        if ($jsonArray['type'] == 'Statement') {
                            $node_ids .= $statement_node_property_id . '~';
                        }
                    }
                    $i++;
                }
                $node_property_id = $statement_node_property_id;
                //maintain xy relation between dialogue instance node id and statement instance node id
                $node_y_id = $jsonArray['dialogue_node_id'];
                $node_x_id = $statement_instance_node_id;
                $this->createXYRelation($node_y_id,$node_x_id);
                $this->addNotificationOfChat($jsonArrayTemp, $statement_instance_node_id, 1, 0, $type);
            }
            if ($jsonArray['type'] == 'Statement') {
                $node_property_id = rtrim($node_ids, '~');
            }
            //update the dialogue on which comment has been done
            /*if(update || edit) {
            }
            #######$success = $this->updateDialogTimestamp($jsonArray['dialogue_node_id']);########
            $success = $this->updateDialogTimestamp($jsonArray['dialogue_node_id']);
            #####$this->updateCourseTimestamp($jsonArray['course_node_id']);######
            $this->updateCourseTimestamp($jsonArray['course_node_id']);*/
            /*if ($success) {
                // get all the user associated with the dilaogue
                #####$user_ary = $this->getAllDilaogueUser($jsonArray['dialogue_node_id'], $jsonArray['sender']);#####
                $dialogue_instance_node_id = $jsonArray['dialogue_node_id'];
                $user_instance_node_id = $jsonArray['sender'];
                $user_class_node_id = INDIVIDUAL_CLASS_ID;
                $sql = "SELECT `ni`.`node_id` AS `user_instance_node_id`
                        FROM `node-instance` AS `ni`
                        INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id`
                        WHERE `xy`.`node_y_id` = '$dialogue_instance_node_id' AND `ni`.`node_class_id` = 'user_class_node_id' AND `xy`.`node_x_id` != '$user_instance_node_id' AND `ni`.`status` = '1'";
                $res = $this->MySQLiconn->query($sql);
                $user_ary = $res->fetch_assoc();
                foreach ($user_ary as $output) {
                    $user_instance_node_id = $output['user_instance_node_id'];
                    // insert notification detail on statement
                    $dialogue_node_id = $jsonArray['dialogue_node_id'];
                    $notification_node_class_id = NOTIFICATION_CLASS_ID;
                    $caption = $this->mc_encrypt($this->getLastNumber('node', 'node_id'), ENCRYPTION_KEY);
                    $encrypt_status = ENCRYPTION_STATUS;
                    $node_type_id = 2;
                    $node_id = $this->createNode();
                    $node_class_id = $notification_node_class_id;
                    $status = '1';
                    $sql = "INSERT INTO `node-instance` (`caption`, `encrypt_status`, `node_type_id`, `node_id`, `node_class_id`, `status`) VALUES ('$caption', '$encrypt_status', '$node_type_id', '$node_id', '$node_class_id', '$status')";
                    $res = $this->MySQLiconn->query($sql);
                    $node_instance_id = $this->MySQLiconn->insert_id;
                    if ($node_instance_id) {
                        // create xy relation between statement and notification
                        $sql = "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ($statement_instance_node_id, $node_id)";
                        $res = $this->MySQLiconn->query($sql);
                        $user_xy_id = $this->MySQLiconn->insert_id;
                        //get node class property ids
                        $sql = "SELECT `ncp`.`node_class_property_id` AS `node_class_property_id` FROM `node-class-property` AS `ncp` WHERE `ncp`.`node_class_id` = '$notification_node_class_id' AND `ncp`.`node_class_property_parent_id` != '0'";
                        $res = $this->MySQLiconn->query($sql);
                        $property_array = $res->fetch_assoc();
                        $ary = array('0' => $user_instance_node_id, '1' => 0, '2' => $dialogue_node_id);
                        $i = 0;
                        foreach ($property_array as $value) {
                            $data_node_instance_id = $node_instance_id;
                            $data_node_class_property_id = $value['node_class_property_id'];
                            $data_node_id = $this->createNode();
                            $data_node_type_id = 2;
                            $data_value = $ary[$i];
                            $sql = "INSERT INTO `node-instance-property` (`node_instance_id`, `node_class_property_id`, `node_id`, `node_type_id`, `value`) VALUES ('$data_node_instance_id', '$data_node_class_property_id', '$data_node_id', '$data_node_type_id', '$data_value')";
                            $res = $this->MySQLiconn->query($sql);
                            $i++;
                        }
                    }
                    // $this->insertAllDialogueInfoById($jsonArray['dialogue_node_id'],$jsonArray['sender']);
                }
            }*/
        }
        return array('savestate' => $node_property_id, 'statement_instance_node_id' => $statement_instance_node_id);
    }
    /**
     * Modified By: Amit Malakar
     * Date: 27-Mar-2017
     * Delete chat message
     * @param $delete_data
     * @return string
     */
    public function deleteStatement($delete_data) {
        //global $this->MySQLiconn;
        $node_instance_property_id = isset($delete_data['node_instance_id']) ? $delete_data['node_instance_id'] : '';
        $dialogue_node_id   = isset($delete_data['dialogue_node_id']) ? $delete_data['dialogue_node_id'] : '';
        $course_node_id = isset($delete_data['node_instance_id']) ? $delete_data['course_node_id'] : '';
        /*// get the node instance id
        $sql              = "SELECT `node-instance-property`.`node_instance_id` AS `node_instance_id` FROM `node-instance-property` WHERE `node_instance_property_id` = '$node_instance_property_id' LIMIT 1";
        $res              = $this->MySQLiconn->query($sql);
        $resArr           = $res->fetch_assoc();
        $node_instance_id = $resArr['node_instance_id'];
        // get the node class property id
        $sql                       = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`
                                    FROM `node-instance-property` AS `nip`
                                    INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
                                    WHERE `nip`.`node_instance_id` = '$node_instance_id' AND `ncp`.`caption` = 'Updated Status' LIMIT 1";
        $res                       = $this->MySQLiconn->query($sql);
        $node_classArray           = $res->fetch_assoc();*/
        // get the node class property id
         $sql                       = "SELECT `nip`.`node_instance_property_id` "
                                    . " FROM `node-instance-property` AS `nip` "
                                    . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                    . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                    . " WHERE `ncp`.`caption` = 'Updated Status' AND `nip1`.`node_instance_property_id` = '$node_instance_property_id'";
        $res                       = $this->MySQLiconn->query($sql);
        $resArr                    = $res->fetch_assoc();
        $node_instance_property_id = $resArr['node_instance_property_id'];
        // update node instance property id
        $sql          = "UPDATE `node-instance-property` SET `value` = '2' WHERE `node_instance_property_id` = '$node_instance_property_id'";
        $this->MySQLiconn->query($sql);
        $affectedRows = $this->MySQLiconn->affected_rows;
        /* Code For delete Notification */
        $this->deleteNotificationFromStatement('node_instance_property_id',$node_instance_property_id);

            // code here for update timestamp for statement awdhesh soni 28th june 2017
                $updateTimestamp = STATEMENT_UPDATED_TIMESTAMP;
                $updateTimestampSql                       ="SELECT `nip`.`node_instance_id` "
                 . "FROM `node-instance-property` AS `nip`"
                 ."LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                 . "INNER JOIN `node-class-property` AS `ncp`ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                 . "WHERE `nip`.`node_class_property_id` = '$updateTimestamp' AND `nip1`.`node_instance_property_id` = '$node_instance_property_id'";
                $resUpdateTimestamp                       = $this->MySQLiconn->query($updateTimestampSql);
                $resArr                    = $resUpdateTimestamp->fetch_assoc();
                $node_instance_id = $resArr['node_instance_id'];
                $sqlPropertyId                       = "SELECT `nip1`.`node_instance_property_id` "
                . "FROM `node-instance-property` AS `nip` "
                . "LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                . "INNER JOIN `node-class-property` AS `ncp`ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                . "WHERE `nip1`.`node_class_property_id` = '$updateTimestamp' AND `nip1`.`node_instance_id` = '$node_instance_id' limit 0,1";
                $resPropertyId                       = $this->MySQLiconn->query($sqlPropertyId);
                $resArr                    = $resPropertyId->fetch_assoc();
                $timestamp_instance_property_id = $resArr['node_instance_property_id'];
                $date_value = new DateTime();
                $updateTimestamp = $date_value->getTimestamp();
                $sql = "UPDATE `node-instance-property` SET `value` = '$updateTimestamp' WHERE `node_instance_property_id` = '$timestamp_instance_property_id'";
                $this->MySQLiconn->query($sql);
                $this->updateCourseTimestamp($course_node_id);  // added by awdhesh for update timestamp

        return array($affectedRows,$updateTimestamp);
    }
    /**
     * Created By: Awdhesh Soni
     * Date: 24-Mar-2017
     * Append letter message
     * @param $tst_msg
     * @return mixed|string
     */
    public function appendLetterStatement($tst_msg)
    {

        //global $this->MySQLiconn;
        $node_class_id  		= STATEMENT_CLASS_ID;
        $node_type_id			= '2';
        if(isset($tst_msg->statements) && $tst_msg->statements!="")
            {
                $jsonArray['message'] 				= $tst_msg->statements;
            }
            else {
                $jsonArray['message'] 				= $tst_msg->message;
            }
            $jsonArray['sender']  					= $tst_msg->user_instance_node_id;
            if($tst_msg->saveType== 'P')
                {
                        $jsonArray['dialogue_node_id']                      = $tst_msg->dialogue_node_id;
                        $jsonArray['action']                                = $tst_msg->action;
                        $jsonArray['messageType']                           = $tst_msg->action;
                        //$jsonArray['dialogue_node_id']                      = $jsonArray['dialogue_node_id'];
                }
                else
                    {
                    if(empty($tst_msg->Coursetype)){
                        $jsonArray['action']                                = $tst_msg->action;
                        $jsonArray['messageType']                           = $tst_msg->action;
                    }else {
                        $jsonArray['action']                                = $tst_msg->Coursetype;
                        $jsonArray['messageType']                           = $tst_msg->Coursetype;
                    }
                        $jsonArray['dialogue_node_id']                      = $tst_msg->dialogue_node_id;
                        //$jsonArray['dialogue_node_id']                      = $tst_msg->dialogueId;
                    }
                    $jsonArray['timestamp']               	= $tst_msg->timestamp;
                    $jsonArray['saveType']               	= $tst_msg->saveType;
        if (isset($tst_msg->message) && $tst_msg->message != "") {
            $jsonArray['message']                 = $jsonArray['message'];
            $jsonArray['sender']                  = $tst_msg->user_instance_node_id;
            $jsonArray['course_node_id'] = $tst_msg->course_node_id;
            $jsonArray['dialogue_node_id']               = $tst_msg->dialogue_node_id;
            $jsonArray['action']                  = '';
            if (isset($tst_msg->filetype) && !empty($tst_msg->filetype) && ($tst_msg->filetype == 'image')) {
                $jsonArray['action'] = "image";
                $jsonArray['type']   = "image";
            } else if (isset($tst_msg->filetype) && !empty($tst_msg->filetype) && $tst_msg->filetype == 'attachment') {
                $jsonArray['action'] = "attachment";
                $jsonArray['type']   = "attachment";
            } else {
                /*if (isset($tst_msg->node_instance_propertyid) && $tst_msg->node_instance_propertyid != "") {
                    $jsonArray['action']                   = 'editMessage';
                    $jsonArray['node_instance_propertyid'] = $tst_msg->node_instance_propertyid;
                } else {*/
                    $jsonArray['action'] = "Letter";
                //}
                $jsonArray['type'] = "Letter";
            }
            if(isset($tst_msg->blank_instance_node_id) && $tst_msg->blank_instance_node_id!="")
            {
                // code here for update letter statement
                $blank_stmt_node_ins_id                                     = $tst_msg->blank_instance_node_id;
                $classArray = array();
                 $sql = "SELECT `ni`.`node_instance_id` AS `node_instance_id`, `ni`.`node_id` AS `node_id` FROM `node-instance` AS `ni` LEFT JOIN `node-x-y-relation` AS `xy` ON `ni`.`node_id` = `xy`.`node_x_id` WHERE `xy`.`node_y_id` = '$blank_stmt_node_ins_id'";
                $res = $this->MySQLiconn->query($sql);
                while ($crArr = $res->fetch_assoc()) {
                   $classArray[] = $crArr;
                }
                foreach ($classArray as $value) {
                    $node_instance_id = $value['node_instance_id'];
                    $node_id = $value['node_id'];
                    if($node_instance_id!=""){
		    	$sql              = "DELETE FROM `node-instance-property` WHERE `node_instance_id` = '$node_instance_id'";
                        $res              = $this->MySQLiconn->query($sql);
                        $sql              = "DELETE FROM `node-instance` WHERE `node_instance_id` = '$node_instance_id'";
                        $res              = $this->MySQLiconn->query($sql);
                    }
//                    if($blank_stmt_node_ins_id!="")
//                    {
//                            $sql              = "DELETE FROM `node-x-y-relation` WHERE `node_y_id` = '$blank_stmt_node_ins_id'";
//                            $res              = $this->MySQLiconn->query($sql);
//                    }
                    if($node_id!=""){
                            $sql              = "DELETE FROM `node` WHERE `node_id` = '$node_instance_id'";
                            $res              = $this->MySQLiconn->query($sql);
                    }
                }
                $updateTimestamp = $this->updateLetterContainer($blank_stmt_node_ins_id,$tst_msg->saveType);
                $jsonArray['dialogue_node_id'] = $blank_stmt_node_ins_id;
		        $savestate 		= $this->saveLetterStatementInstance($jsonArray);	// update statement letter data
                $courseInsId = '';
               if($tst_msg->diaStatusType == "Draft"){
                     $sql = "SELECT `node_instance_id` FROM `node-instance` WHERE `node_id`='$tst_msg->course_node_id'";
                    $res    = $this->MySQLiconn->query($sql);
                    $resArr = $res->fetch_assoc();
                    $course_instance_id = intval($resArr['node_instance_id']);
               }

		if($tst_msg->courseStatementType == "Draft" && $tst_msg->diaStatusType == "Draft" && $tst_msg->saveType=="P")
                {
                    $this->updatecourseStatus($course_instance_id, $tst_msg->dialogue_node_id);
                }
                else if($tst_msg->courseStatementType == "Published" && $tst_msg->diaStatusType == "Draft" && $tst_msg->saveType=="P"){
                    $this->updatecourseStatus($course_instance_id, $tst_msg->dialogue_node_id);
                }
                return array($blank_stmt_node_ins_id.'-'.$savestate,$updateTimestamp);
            }
            else
            {
                //preg_match('/>(<br>)<\/div>/', $jsonArray['message'], $match);
                $blank_stmt_node_ins_id 				= $this->saveBlankStatement($jsonArray);
                /* Code For Add or Edit Notification Count */
				if($jsonArray['saveType']!="P") { $status = 0; } else { $status = 1; }
                    $this->addNotificationOfChat($tst_msg,$blank_stmt_node_ins_id,$status,0,'letter');
                if(!empty($blank_stmt_node_ins_id))
                {
                    $jsonArray['dialogue_node_id'] = $blank_stmt_node_ins_id;
                }
                else
                {
                    $jsonArray['dialogue_node_id'] = $jsonArray['dialogue_node_id'];
                }
               $savestate 		= $this->saveLetterStatementInstance($jsonArray);
                if($tst_msg->courseStatementType == "Draft" && $tst_msg->diaStatusType == "Draft" && $tst_msg->saveType=="P")
                {
                    $this->updatecourseStatus($tst_msg->course_node_id, $jsonArray['dialogue_node_id']);
                }
                else if($tst_msg->courseStatementType == "Published" && $tst_msg->diaStatusType == "Draft" && $tst_msg->saveType=="P"){
                    $this->updatecourseStatus($tst_msg->course_node_id, $jsonArray['dialogue_node_id']);
                }
                return array($blank_stmt_node_ins_id.'-'.$savestate);
            }

                //$savestate = $this->saveLetterStatementInstance($jsonArray);
            }
    }
    public function saveLetterStatementInstance($jsonArray){
         $node_class_id  		= STATEMENT_CLASS_ID;
         $node_type_id			= '2';
        //global $this->MySQLiconn;
        $temp 					=  $jsonArray['message'];
        if($jsonArray['dialogue_node_id']!='' && $jsonArray['sender']!='')
        {
            $classArray = array();
                $sql = "SELECT `caption`, `node_class_property_id` FROM `node-class-property` WHERE `node_class_id`=$node_class_id AND `node_class_property_parent_id`!=0";
                $res = $this->MySQLiconn->query($sql);
                while ($crArr = $res->fetch_assoc()) {
                    $classArray[] = $crArr;
                }
                $node_ids = '';
                //$date_value = date_create(); // comment by awdhesh
                $date_value = new DateTime(); // change by awdhesh for notice
                for($k = 0; $k<count($temp); $k++)
                {
                    $node_id = $this->createNode();
                    if($jsonArray['saveType']!="P"){
                        $status         		=   0;
                    } else {
                        $status         		=   1;
                    }
                    $sql                        = "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '$status')";
                    $res                        = $this->MySQLiconn->query($sql);
                    $node_instance_id           = $this->MySQLiconn->insert_id;
                    $statement_instance_node_id = $node_id;
                    $valueArray = array();
                    array_push($valueArray, $jsonArray['sender']);
                    array_push($valueArray, $jsonArray['type']);
                    array_push($valueArray, $temp[$k]->statement);
                    //array_push($valueArray, date_timestamp_get($date_value)); // commented by awdhesh
                    array_push($valueArray, $date_value->getTimestamp()); // change awdhesh soni

                    //array_push($valueArray, $jsonArray['timestamp']);
                    array_push($valueArray, '0');
                    array_push($valueArray, $date_value->getTimestamp()); // change by awdhesh soni for update timestamp
                    $i = 0;
                    foreach ($classArray as $value) {
                        $val_node_id                = $this->createNode();
                        $val_node_instance_id       = $node_instance_id;
                        $val_node_class_property_id = $value['node_class_property_id'];
                        $val_node_type_id           = $node_type_id;
                        $val_value                  = addslashes(trim($valueArray[$i]));
                        $sql              = "INSERT INTO `node-instance-property` (`node_id`, `node_instance_id`, `node_class_property_id`, `node_type_id`, `value`) VALUES ('$val_node_id', '$val_node_instance_id', '$val_node_class_property_id', '$val_node_type_id', '$val_value')";
                        $res              = $this->MySQLiconn->query($sql);
                        $node_property_id = $this->MySQLiconn->insert_id;
                        if ($value['caption'] == 'Statement') {
                            $statement_node_property_id = $node_property_id;
                            $statement_node_instance_id = $node_instance_id;
                            $node_ids .= $statement_node_instance_id . '~';
                        }
                        $i++;
                    }
                    $node_property_id = $statement_node_property_id;
                    //maintain xy relation between dialogue instance node id and statement instance node id
                    $node_y_id = $jsonArray['dialogue_node_id'];
                    $node_x_id = $statement_instance_node_id;
                    $this->createXYRelation($node_y_id, $node_x_id);
                }
                    $node_property_id = rtrim($node_ids, '~');
                    /*if($jsonArray['courseStatementType'] == "Draft" && $jsonArray['diaStatusType'] == "Draft")
                      {
                        $this->updatecourseStatus($jsonArray['course_node_id'], $jsonArray['dialogue_node_id']);
                      }
                    else if($jsonArray['courseStatementType'] == "Published" && $jsonArray['diaStatusType'] == "Draft"){
                        $this->updatecourseStatus($jsonArray['course_node_id'], $jsonArray['dialogue_node_id']);
                      }*/
        }
                return $node_property_id;
         //return $blank_stmt_node_ins_id.'-'.$node_property_id;
    }
    public function updateLetterContainer($blank_stmt_node_ins_id,$saveType){
        //global $this->MySQLiconn;
          $sql                 = "SELECT `nip`.`node_instance_property_id` "
                                . " FROM `node-instance-property` AS `nip` "
                                . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                . " LEFT JOIN `node-instance` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`"
                                . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                . " WHERE `ncp`.`caption` = 'Updated Status' AND `nip2`.`node_id` = '$blank_stmt_node_ins_id' limit 1";
        $res                       = $this->MySQLiconn->query($sql);
        $resArr                    = $res->fetch_assoc();
        $node_instance_property_id = $resArr['node_instance_property_id'];
        // update node instance property id
              $sql                 = "SELECT `nip`.`node_instance_property_id` "
                                    . " FROM `node-instance-property` AS `nip` "
                                    . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                    . " LEFT JOIN `node-instance` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`"
                                    . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                    . " WHERE `ncp`.`caption` = 'Timestamp' AND `nip2`.`node_id` = '$blank_stmt_node_ins_id' limit 1";
            $res                       = $this->MySQLiconn->query($sql);
            $resArr                    = $res->fetch_assoc();
            $node_instance_property_id1 = $resArr['node_instance_property_id'];
             $sql                        = "select `value` from `node-instance-property` WHERE `node_instance_property_id` = '$node_instance_property_id'";
            $res                        = $this->MySQLiconn->query($sql);
            $resArr1                    = $res->fetch_assoc();
            $statusType                 = $resArr1['value'];
            // update node instance property id
            $date_value   = date_create();
            $valueArray   = date_timestamp_get($date_value);
            $sql          = "SELECT `status` from `node-instance` WHERE `node_id` = '$blank_stmt_node_ins_id'";
            $res          = $this->MySQLiconn->query($sql);
            $resArr       = $res->fetch_assoc();
            $letterStatus = $resArr['status'];

            // work for fetch updated timestamp node instance property id and updated timestamp

            $sql2                 = "SELECT `nip`.`node_instance_property_id` "
                                    . " FROM `node-instance-property` AS `nip` "
                                    . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                    . " LEFT JOIN `node-instance` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`"
                                    . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                    . " WHERE `ncp`.`caption` = 'Updated Timestamp' AND `nip2`.`node_id` = '$blank_stmt_node_ins_id' limit 1";
            $res2                       = $this->MySQLiconn->query($sql2);
            $resArr2                    = $res2->fetch_assoc();
            $node_instance_property_id2 = $resArr2['node_instance_property_id'];

            // end code here

            $sql1 = "UPDATE `node-instance-property` SET `value` = '$valueArray' WHERE `node_instance_property_id` = '$node_instance_property_id2'";
            $this->MySQLiconn->query($sql1);
            //echo $saveType.'=>'.$letterStatus.'=>'.$statusType;
            if ($saveType == "P" && $letterStatus == 1) {
                $sql = "UPDATE `node-instance-property` SET `value` = '1' WHERE `node_instance_property_id` = '$node_instance_property_id'";
                $this->MySQLiconn->query($sql);

            } else if ($saveType == "P" && ($statusType == 0 && $letterStatus == 0)) {
                $sql1 = "UPDATE `node-instance-property` SET `value` = '$valueArray' WHERE `node_instance_property_id` = '$node_instance_property_id1'";
                $this->MySQLiconn->query($sql1);
                $sql2 = "UPDATE `node-instance` SET `status` = '1' WHERE `node_id` = '$blank_stmt_node_ins_id'";
                $this->MySQLiconn->query($sql2);
            } else if ($saveType == "D") {
                $sql3 = "UPDATE `node-instance-property` SET `value` = '1' WHERE `node_instance_property_id` = '$node_instance_property_id'";
                $this->MySQLiconn->query($sql3);
                $sql4 = "UPDATE `node-instance-property` SET `value` = '$valueArray' WHERE `node_instance_property_id` = '$node_instance_property_id1'";
                $this->MySQLiconn->query($sql4);
            }
            return $valueArray;


    }
    /**
     * Function to save the blank letter statement instances
     * Created by Awdhesh Soni
     */
    public function saveBlankStatement($jsonArray)
    {
            //global $this->MySQLiconn;
            $node_class_id  				= STATEMENT_CLASS_ID;
            $node_type_id					= '2';
            $message                        =  "";
            $node_id                        =	$this->createNode();
            $node_class_id                  =	$node_class_id;
            $node_type_id                   =	$node_type_id;
            $caption                        =   $node_id;
            if($jsonArray['saveType']!="P")
            {
                    $status         	=   0;
            }
            else
            {
                    $status         	=   1;
            }
                 $sql                        = "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '$status')";
                $res                        = $this->MySQLiconn->query($sql);
                $node_instance_id           = $this->MySQLiconn->insert_id;
                $statement_instance_node_id = $node_id;
                 $sql                            = "SELECT `node-class-property`.* FROM `node-class-property` WHERE `node_class_id` = $node_class_id AND `node_class_property_parent_id` != '0' AND (`caption` = 'Statement Type' OR `caption` = 'Updated Status' OR `caption` = 'Timestamp' OR `caption` = 'Updated Timestamp') ";
                $res                            = $this->MySQLiconn->query($sql);
            while ($crArr = $res->fetch_assoc()) {
                    $classArray[] = $crArr;
                }
            $valueArray = array();
            //$date_value = date_create(); // comment by awdhesh
            $date_value = new DateTime(); // change by awdhesh for notice
            array_push($valueArray,'Letter Container');
            //array_push($valueArray, date_timestamp_get($date_value)); //
            array_push($valueArray, $date_value->getTimestamp()); // change by awdhesh soni for notice

            array_push($valueArray,0);
            array_push($valueArray, $date_value->getTimestamp()); // added code for updated timestamp

            $i = 0;
            foreach ($classArray as $value) {
                    $val_node_id                = $this->createNode();
                    $val_node_instance_id       = $node_instance_id;
                    $val_node_class_property_id = $value['node_class_property_id'];
                    $val_node_type_id           = $node_type_id;
                    $val_value                  = addslashes(trim($valueArray[$i]));
                    $sql              = "INSERT INTO `node-instance-property` (`node_id`, `node_instance_id`, `node_class_property_id`, `node_type_id`, `value`) VALUES ('$val_node_id', '$val_node_instance_id', '$val_node_class_property_id', '$val_node_type_id', '$val_value')";
                    $res              = $this->MySQLiconn->query($sql);
                    $node_property_id = $this->MySQLiconn->insert_id;
                    $i++;
            }
            if(isset($jsonArray['dialogueId']) && $jsonArray['dialogueId']!=""){
                $dia_node_id = $jsonArray['dialogueId'];
            }else {
                $dia_node_id = $jsonArray['dialogue_node_id'];
            }
                $node_y_id = $dia_node_id;
                $node_x_id = $statement_instance_node_id;
                $this->createXYRelation($node_y_id,$node_x_id);
            return $statement_instance_node_id;
    }
    /* Function here to delete letter statement
     * Modified by Awdhesh Soni
     * Delete letter message
     * @param $delete_data
     * @return string
     */
    public function deleteLetterStatement($delete_data){
        $node_instance_propertyid = $delete_data['node_instance_id'];
        //$dialogue_node_id   = $delete_data['dialogue_node_id']; //Commented By Divya as it is not in use.
        $user_current_session_id   = $delete_data['user_current_session_id'];
        $course_node_id   = $delete_data['course_node_id'];
        //global $this->MySQLiconn;
          $sql = "SELECT `ni`.`node_instance_id` AS `node_instance_id`, `ni`.`node_id` AS `node_id` FROM `node-instance` AS `ni` LEFT JOIN `node-x-y-relation` AS `xy` ON `ni`.`node_id` = `xy`.`node_x_id` WHERE `xy`.`node_y_id` = '$node_instance_propertyid'";
         $res = $this->MySQLiconn->query($sql);
         while ($crArr = $res->fetch_assoc()) {
            $classArray[] = $crArr;
         }
        foreach ($classArray as $value) {
                $node_instance_id = $value['node_instance_id'];
                $node_id = $value['node_id'];
                $sql              = "DELETE FROM `node-instance-property` WHERE `node_instance_id` = '$node_instance_id'";
                $res              = $this->MySQLiconn->query($sql);
                $sql              = "DELETE FROM `node-x-y-relation` WHERE `node_x_id` = '$node_id'";
                $res              = $this->MySQLiconn->query($sql);
                $sql              = "DELETE FROM `node-instance` WHERE `node_instance_id` = '$node_instance_id'";
                $res              = $this->MySQLiconn->query($sql);
                $sql              = "DELETE FROM `node` WHERE `node_id` = '$node_id'";
                $res              = $this->MySQLiconn->query($sql);
        }
        $sql                 = "SELECT `nip2`.`node_instance_id`, `nip`.`node_instance_property_id` "
                                . " FROM `node-instance-property` AS `nip` "
                                . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                . " LEFT JOIN `node-instance` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`"
                                . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                . " WHERE `ncp`.`caption` = 'Updated Status' AND `nip2`.`node_id` = '$node_instance_propertyid' limit 1";
        $res                       = $this->MySQLiconn->query($sql);
        $resArr                    = $res->fetch_assoc();
        $node_instance_property_id = $resArr['node_instance_property_id'];
        $node_instance_id = $resArr['node_instance_id'];

        // update node instance property id
        $sql          = "UPDATE `node-instance-property` SET `value` = '2' WHERE `node_instance_property_id` = '$node_instance_property_id'";
        $this->MySQLiconn->query($sql);

        // update timestamp while delete

         $sql2                 = "SELECT `nip2`.`node_instance_id`, `nip`.`node_instance_property_id` "
                                . " FROM `node-instance-property` AS `nip` "
                                . " LEFT JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id` "
                                . " LEFT JOIN `node-instance` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`"
                                . " INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                                . " WHERE `ncp`.`caption` = 'Updated Timestamp' AND `nip2`.`node_id` = '$node_instance_propertyid' limit 1";
        $res2                       = $this->MySQLiconn->query($sql2);
        $resArr2                    = $res2->fetch_assoc();

        $node_instance_property_id2 = $resArr2['node_instance_property_id'];
        $date_value   = date_create();
        $valueArray   = date_timestamp_get($date_value);
         $sql3          = "UPDATE `node-instance-property` SET `value` = '$valueArray' WHERE `node_instance_property_id` = '$node_instance_property_id2'";
        $this->MySQLiconn->query($sql3);

        $node_id = $this->createNode();
        $node_class_property_id = STATEMENT_ACTOR_AUTHOR;
        $sql     = "INSERT INTO `node-instance-property` (`node_instance_id`, `node_class_property_id`, `node_id`, `node_type_id`, `value`) VALUES ('$node_instance_id', '$node_class_property_id', '$node_id', '2', '$user_current_session_id')";
        $this->MySQLiconn->query($sql);

        $this->deleteNotificationFromStatement('node_instance_property_id',$node_instance_property_id);
        $affectedRows = $this->MySQLiconn->affected_rows;
        $this->updateCourseTimestamp($course_node_id);  // added by awdhesh for update timestamp

        return $valueArray;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 27-Mar-2017
     * Delete chat message
     * @param $delete_data
     * @return string
     */
    public function saveCourseDialouge($tst_msg) {
        if (isset($tst_msg->chatMessage) && $tst_msg->chatMessage != "") {
            $message = $tst_msg->chatMessage;
        } else {
            if ($tst_msg->Coursetype == "Letter") {
                if ($tst_msg->message != "") {
                    $message = $tst_msg->message;
                }
            } else if ($tst_msg->Coursetype == "Chat") {
                if (isset($tst_msg->chatMessage) && $tst_msg->chatMessage != "") {
                    // $message = $tst_msg->chatMessage;  **arti
                    $message = $tst_msg->chatMessage;
                } elseif ($tst_msg->message != "") {
                    $message = $tst_msg->message;
                }
            } else {
                if ($tst_msg->message != "") {
                    $message = $tst_msg->message;
                }
            }
        }
        return $res = $this->saveNewDialogInstances($tst_msg, $message);
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Save Dialogue & related instances
     * @param $dialog_data
     * @param $chatMessage
     * @return array
     */
    public function saveNewDialogInstances($dialog_data, $chatMessage) {
        //global $this->MySQLiconn;
        if (isset($dialog_data->course_node_id) && !empty($dialog_data->course_node_id)) {
            $course_node_id = $dialog_data->course_node_id;
        } else {
            $course_node_id = "";
        }
        $StmtType                = "";
        $course_node_class_id    = COURSE_CLASS_ID;
        $dialogue_node_class_id  = DIALOGUE_CLASS_ID;
        $user_instance_node_id   = $dialog_data->user_instance_node_id;
        $dialogue_title          = htmlentities(trim($dialog_data->dialogue_title));
        $receipient_user_node_id = $dialog_data->user_recepient_node_id;
        $saveType                = $dialog_data->saveType;
        $action                  = $dialog_data->action;
        $stmntTimestamp          = isset($dialog_data->timestamp) ? $dialog_data->timestamp : '';;
        $StmtType                = $dialog_data->Coursetype;
        // when the new course as well as new dialogue created for the first time
        if (strtolower($dialog_data->course_dialogue_type) == strtolower('new')) {
            //add course first
            $node_type_id = '2';
            if ($dialog_data->course_title == '') {
                $course_value = 'Untitled';
            } else {
                $course_value = htmlentities(trim($dialog_data->course_title));
            }
            if ($saveType == "D") {
                //$course_field 				= array('Title','Timestamp','created By');
                $course_field = array('Title', 'Timestamp', 'created By', 'Updation Timestamp');
            } else {
                //$course_field 				= array('Title','Timestamp');
                $course_field = array('Title', 'Timestamp', 'created By', 'Updation Timestamp');
            }
            if ($saveType == "D") {
                $couse_field[0] = $course_value;
                $couse_field[1] = date('Y-m-d H:i:s');
                //$prefixTitle    = PREFIX . 'user_info';
                //$couse_field[2]  	  		=  $_SESSION[$prefixTitle]['node_id'];
                $couse_field[2] = $user_instance_node_id;
                $couse_field[3] = date('Y-m-d H:i:s');
            } else {
                $couse_field[0] = $course_value;
                $couse_field[1] = date('Y-m-d H:i:s');
                $couse_field[2] = $user_instance_node_id;
                $couse_field[3] = date('Y-m-d H:i:s');
            }
            if ($course_value != '') {
                $node_instance_id = $this->createNodeInstanceCourseDialouge($course_node_class_id, $node_type_id, $saveType);
                if ($node_instance_id) {
                    foreach ($couse_field as $key => $courseVal) {
                        $node_class_property_id = $this->getNodeClassPropertyIdCourseDialouge($course_node_class_id, $course_field[$key]);
                        $course_node_instance_property_id = $this->createNodeInstanceCourseDialougeProperty($node_instance_id, $node_class_property_id, $node_type_id, $courseVal);
                    }
                     $course_node_id = $this->getInstanceNodeIdCourseDialogue($course_node_class_id, $node_instance_id);
                    // add xy relation between user and course
                    $xy_id = $this->createXYRelation($course_node_id, $user_instance_node_id);
                    //add dialogue for course
                    $final_ary = $this->addDialogueCourse($dialogue_node_class_id, $dialogue_title, $course_node_id, $user_instance_node_id, $receipient_user_node_id, $saveType, $chatMessage, $action, $stmntTimestamp, $node_instance_id, $course_value, $StmtType);
                }
                if (!empty($final_ary)) {
                    return $final_ary;
                }
            }
        } // an user added dialogue for existing course
        else if (strtolower($dialog_data->course_dialogue_type) == strtolower('existing')) {
            //return $dialog_data;
            if (!isset($dialog_data->course_title) || $dialog_data->course_title == '') {
                $course_value = 'Untitled';
            } else {
                $course_value = htmlentities(trim($dialog_data->course_title));
            }
            //add course first
            $course_field = 'Title';
            $node_type_id = '2';
            //$course_node_id = $dialog_data->course_node_id;
            if (isset($dialog_data->data_save) && $dialog_data->data_save == 'minidialogue') {
                $course_node_id = $dialog_data->course_node_id;
            } else {
                 $sql = "SELECT `node_instance_id` FROM `node-instance` WHERE `node_id`='$course_node_id'";
                $res    = $this->MySQLiconn->query($sql);
                $resArr = $res->fetch_assoc();
                $courseInsId = intval($resArr['node_instance_id']);
            }
            if ($course_node_id != '') {
                $final_ary = $this->addDialogueCourse($dialogue_node_class_id, $dialogue_title, $course_node_id, $user_instance_node_id, $receipient_user_node_id, $saveType, $chatMessage, $action, $stmntTimestamp, $courseInsId, $course_value, $StmtType);
                //update course time stamp
                $dialog       = $this->updateCourseTimestamp($course_node_id);
                if($saveType=="P"){
                    $this->updatecourseStatus($dialog_data->course_node_id, "");
                }
                if (!empty($final_ary)) {
                    return $final_ary;
                }
            }
        }
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Create Node instance Course Dialogue
     * NOTE - we need to use this function in few other places in this file
     * @param $node_class_id
     * @param $node_type_id
     * @param $saveType
     * @return mixed
     */
    public function createNodeInstanceCourseDialouge($node_class_id,$node_type_id,$saveType)
    {
        //global $this->MySQLiconn;
        $node_class_id = $node_class_id;
        $node_id       = $this->createNode();
        $node_type_id  = $node_type_id;
        if ($saveType == "D") {
            $status = 0;
        } else {
            $status = 1;
        }
        $sql = "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '$status')";
        $this->MySQLiconn->query($sql);
        return $id = $this->MySQLiconn->insert_id;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Create Node instance Course Dialogue
     * @param $node_class_id
     * @param $field
     * @return mixed
     */
    public function getNodeClassPropertyIdCourseDialouge($node_class_id, $field)
    {
        //global $this->MySQLiconn;
         $sql    = "SELECT `node_class_property_id` FROM `node-class-property` WHERE `node_class_id`='$node_class_id' AND `caption`='$field'";
        $res    = $this->MySQLiconn->query($sql);
        $resArr = $res->fetch_assoc();
        return $node_instance_property_id = $resArr['node_class_property_id'];
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Create Node instance Course Dialogue Property
     * @param $node_instance_id
     * @param $node_class_property_id
     * @param $node_type_id
     * @param $value
     * @return mixed
     */
    public function createNodeInstanceCourseDialougeProperty($node_instance_id, $node_class_property_id, $node_type_id, $value)
    {
        //global $this->MySQLiconn;
        $node_id = $this->createNode();
        $value   = addslashes($value);
         $sql     = "INSERT INTO `node-instance-property` (`node_instance_id`, `node_class_property_id`, `node_id`, `node_type_id`, `value`) VALUES ('$node_instance_id', '$node_class_property_id', '$node_id', '$node_type_id', '$value')";
        $this->MySQLiconn->query($sql);
        return $id = $this->MySQLiconn->insert_id;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Get node id of course dialogue
     * @param $node_class_id
     * @param $node_instance_id
     * @return mixed
     */
    public function getInstanceNodeIdCourseDialogue($node_class_id, $node_instance_id)
    {
        //global $this->MySQLiconn;
         $sql    = "SELECT `node_id` FROM `node-instance` WHERE `node_class_id`='$node_class_id' AND `node_instance_id`='$node_instance_id' LIMIT 1";
        $res    = $this->MySQLiconn->query($sql);
        $resArr = $res->fetch_assoc();
        return $instance_node_id = $resArr['node_id'];
    }

    /**
     * Created By: Amit Malakar
     * Date: 5-May-2017
     * Add participants to dialogue
     * @param $node_y_id
     * @param $user_ids
     * @param $timestamp
     * @return mixed
     */
    public function addParticipantsToDialogue($node_y_id, $user_ids, $timestamp)
    {
        //$sql = "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ('$node_y_id', '$node_x_id')";

        // loop through each user, create instance and instance-property
        $result = array();
        foreach ($user_ids as $userId) {
            // create node-instance
            $node_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
            $node_x_id     = $this->createNode();
            $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
            $this->MySQLiconn->query($sql);
            $node_instance_id = $this->MySQLiconn->insert_id;

            // create node-instance-property
            $actor_ncpid       = INDIVIDUAL_ACTORID_PROP_ID;
            $timestamp_ncpid   = INDIVIDUAL_TIMESTAMP_PROP_ID;
            $status_ncpid      = INDIVIDUAL_STATUS_PROP_ID;
            $actor_node_id     = $this->createNode();
            $timestamp_node_id = $this->createNode();
            $status_node_id    = $this->createNode();
            $sql               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                 . " ('$node_instance_id','$actor_ncpid','$actor_node_id','2','$userId','0','0'), "
                                 . " ('$node_instance_id','$timestamp_ncpid','$timestamp_node_id','2','$timestamp','0','0'), "
                                 . " ('$node_instance_id','$status_ncpid','$status_node_id','2','1','0','0') ";
            $this->MySQLiconn->query($sql);

            // create x-y-relation
            $this->createXYRelation($node_y_id, $node_x_id);
            $result[$userId]      = $node_x_id;
        }

        return $result;
    }
    /**
     * Created By: Amit Malakar
     * Date: 8-May-2017
     * Remove participant from dialogue
     * @param $node_y_id
     * @param $userId
     * @param $timestamp
     * @return mixed
     */
    public function removeParticipantFromDialogue($node_y_id, $userId, $timestamp)
    {
        // create instance and instance-property
        $result = array();

        // create node-instance
        $node_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
        $node_x_id     = $this->createNode();
        $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $node_instance_id = $this->MySQLiconn->insert_id;

        // create node-instance-property
        $actor_ncpid       = INDIVIDUAL_ACTORID_PROP_ID;
        $timestamp_ncpid   = INDIVIDUAL_TIMESTAMP_PROP_ID;
        $status_ncpid      = INDIVIDUAL_STATUS_PROP_ID;
        $actor_node_id     = $this->createNode();
        $timestamp_node_id = $this->createNode();
        $status_node_id    = $this->createNode();
        $sql               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                  . " ('$node_instance_id','$actor_ncpid','$actor_node_id','2','$userId','0','0'), "
                                  . " ('$node_instance_id','$timestamp_ncpid','$timestamp_node_id','2','$timestamp','0','0'), "
                                  . " ('$node_instance_id','$status_ncpid','$status_node_id','2','2','0','0') ";
        $this->MySQLiconn->query($sql);

        // create x-y-relation
        $this->createXYRelation($node_y_id, $node_x_id);
        $result[$userId]      = $node_x_id;

        return $result;
    }


    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Create X Y Relation
     * @param $node_y_id
     * @param $node_x_id
     * @return mixed
     */
    public function createXYRelation($node_y_id, $node_x_id)
    {
        //global $this->MySQLiconn;
        $sql = "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ('$node_y_id', '$node_x_id')";
        $this->MySQLiconn->query($sql);
        return $this->MySQLiconn->insert_id;
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * Add Course and Dialogue
     * @param $dialogue_node_class_id
     * @param $dialogue_title
     * @param $course_node_id
     * @param $user_instance_node_id
     * @param $receipient_user_node_id
     * @param $saveType
     * @param $chatMessage
     * @param $action
     * @param $stmntTimestamp
     * @param $courseInsId
     * @param $course_value
     * @param $StmtType
     * @return array
     */
    public function addDialogueCourse($dialogue_node_class_id, $dialogue_title, $course_node_id, $user_instance_node_id, $receipient_user_node_id, $saveType, $chatMessage, $action, $stmntTimestamp, $courseInsId, $course_value, $StmtType)
    {
        //global $this->MySQLiconn;
        //$dialogue_field 						=  array('Title','Admin','Timestamp');
        $dialogue_field     = array('Title', 'Admin', 'Timestamp', 'Updated Timestamp');
        $node_type_id       = '2';
        $dialog_instance_id = $this->createNodeInstanceCourseDialouge($dialogue_node_class_id, $node_type_id, $saveType);
        $final_ary          = array();
        // get dialog instance node id
        $dialogue_node_id = $this->getInstanceNodeIdCourseDialogue($dialogue_node_class_id, $dialog_instance_id);
        foreach ($dialogue_field as $value) {
            if ($value == 'Title') {
                if ($dialogue_title == '') {
                    $dialogue_title = 'Untitled';
                } else {
                    $dialogue_title = $dialogue_title;
                }
            } else if ($value == 'Admin') {
                $dialogue_title = $user_instance_node_id;
            } else {
                $dialogue_title = date('Y-m-d H:i:s');
            }
            $node_class_property_id = $this->getNodeClassPropertyIdCourseDialouge($dialogue_node_class_id, $value);
            if ($dialog_instance_id) {
                $dialog_node_instance_property_id = $this->createNodeInstanceCourseDialougeProperty($dialog_instance_id, $node_class_property_id, $node_type_id, $dialogue_title);
                if ($value == 'Title') {
                    $final_ary['dialogue_node_id']          = $dialogue_node_id;
                    $final_ary['dialog_node_instance_property_id'] = $dialog_node_instance_property_id;
                    $final_ary['course_node_id']          = $course_node_id;
                    $final_ary['course_instance_id']               = $courseInsId;
                }
            }
        }
        //create xy relation between course and dialogue
        $xy_id = $this->createXYRelation($course_node_id, $dialogue_node_id);
        // create xy relation between user and dialogue
        $dialogueTimestamp = time();
        //$user_xy_id = $this->createXYRelation($dialogue_node_id, $user_instance_node_id);
        /* Code here to add new actor for dialogue and course class */
        if (!empty($receipient_user_node_id)) {
            $recipientArr = array_filter(explode(',', $receipient_user_node_id));
            $user_instance_string = implode(',', $recipientArr);
            $ownerIndex = array_search($user_instance_node_id, $recipientArr);
            if ($ownerIndex !== false && $ownerIndex >= 0) {

            } else { // owner not in the list
                array_push($recipientArr,$user_instance_node_id);
            }
            $recipientInfo = $this->addParticipantsToDialogue($dialogue_node_id, $recipientArr, $dialogueTimestamp); // add participant for dialogue
                             $this->addParticipantsToDialogue($course_node_id, $recipientArr, $dialogueTimestamp);  // add participant for course

            /*$temp                                 = explode(',', $user_instance_string);
            $admin_id                             = $this->fetchDialogOwnerId($dialogue_node_id);
            $user_node_class_id                   = INDIVIDUAL_CLASS_ID;
            $final_ary['receipient_user_node_id'] = $receipient_user_node_id;
            //get all the instance of user associated with an dialogue
            $sql         = "SELECT `xy`.`node_x_y_relation_id`
                    FROM `node-x-y-relation` AS `xy`
                    INNER JOIN `node-instance` AS `ni` ON `xy`.`node_x_id` = `ni`.`node_id`
                    WHERE `ni`.`node_class_id` = '$user_node_class_id' AND `xy`.`node_y_id` = '$dialogue_node_id' AND `xy`.`node_x_id` != '$admin_id' ";
            $res         = $this->MySQLiconn->query($sql);
            $accountInfo = $res->fetch_assoc();
            if (!empty($accountInfo)) {
                foreach ($accountInfo as $value) {
                    //delete all the instance of user associated with the dialogue
                    $node_x_y_relation_id = $value;
                    $sql                  = "DELETE FROM `node-x-y-relation` WHERE `node_x_y_relation_id` = '$node_x_y_relation_id'";
                    $res                  = $this->MySQLiconn->query($sql);
                }
            }
            foreach ($temp as $key => $value) {
                //check the xy relation already exists or not between dialogue and user
                $sql       = "SELECT * FROM `node-x-y-relation` WHERE `node_y_id` = '$dialogue_node_id' AND `node_x_id` = '" . $value . "' ";
                $res       = $this->MySQLiconn->query($sql);
                $exitsInfo = $res->fetch_assoc();
                if (empty($exitsInfo)) {
                    //insert all the actor into the database to associate with the dialogue
                    $this->createXYRelation($dialogue_node_id, $value);
                }
                // check the relation between course and user
                //check the xy relation already exists or not between dialogue and user
                $sql       = "SELECT * FROM `node-x-y-relation` WHERE `node_y_id` = '$course_node_id' AND `node_x_id` = '" . $value . "' ";
                $res       = $this->MySQLiconn->query($sql);
                $exitsInfo = $res->fetch_assoc();
                if (empty($exitsInfo)) {
                    //insert all the actor into the database to associate with the course
                    $this->createXYRelation($course_node_id, $value);
                }
            }*/
            if ($chatMessage != "") {
                if ($StmtType == "Letter") {
                    /* function here to save blank statement for letter in container form // now parent id use in dialogue */
                    $jsonArray['message']               = $chatMessage;
                    $jsonArray['user_instance_node_id'] = $user_instance_node_id;
                    $jsonArray['dialogueId']            = $dialogue_node_id;
                    $jsonArray['Coursetype']            = $StmtType;
                    $jsonArray['saveType']              = $saveType;
                    $jsonArray['timestamp']             = $stmntTimestamp;
                    $jsonArray['sender']                = $user_instance_node_id;
                    $jsonArray['dialogue_node_id']             = $dialogue_node_id;
                    $jsonArray['type']                  = $StmtType;
                    $blank_stmt_node_ins_id 			= $this->saveBlankStatement($jsonArray);
                    /* Code For Add or Edit Notification Count */
                    if($jsonArray['saveType']!="P") { $status = 0; } else { $status = 1; }
                    $jsonArrayTemp = $jsonArray;
                    $jsonArrayTemp['user_recepient_node_id'] = $user_instance_string;
                    $jsonArrayTemp = json_decode(json_encode($jsonArrayTemp));
                    $this->addNotificationOfChat($jsonArrayTemp,$blank_stmt_node_ins_id,$status,0,'Dialogueletter');
                    if(!empty($blank_stmt_node_ins_id)) {
                        $jsonArray['dialogue_node_id'] = $blank_stmt_node_ins_id;
                    } else {
                        $jsonArray['dialogue_node_id'] = $jsonArray['dialogue_node_id'];
                    }
                    $savestate                  = $this->saveLetterStatementInstance($jsonArray);    // add statement letter data
                } else {
                    $jsonArray['message']   = $chatMessage;
                    $jsonArray['sender']    = $user_instance_node_id;
                    $jsonArray['dialogue_node_id'] = $dialogue_node_id;
                    $jsonArray['action']    = "Statement";
                    //	$jsonArray['messageType']               = "Statement";  **arti
                    $jsonArray['type']      = "Statement";
                    $jsonArray['timestamp'] = $stmntTimestamp;
                    //$prefixTitle            = PREFIX . 'user_info';
                    //$jsonArray['username']      = $_SESSION[$prefixTitle]['first_name'] . ' ' . $_SESSION[$prefixTitle]['last_name'];
                    //$jsonArray['courseSection'] = 1;
                    //$savestate = $this->saveMainStatementInstance($jsonArray);	// add statement chat data    **arti
                    // ####### TO UPDATE appendStatement()
                    /*Code Modified By: Divya Rajput*/
                    $jsonArrayTemp = $jsonArray;
                    $jsonArrayTemp['user_recepient_node_id'] = $user_instance_string;
                    $jsonArrayTemp = json_decode(json_encode($jsonArrayTemp));
                    $resultArray = $this->saveStatement($jsonArray, $jsonArrayTemp, 'Dialogueletter');
                    $jsonArray['user_instance_node_id'] = $user_instance_node_id;
                    /*End Here*/
                    //$resultArray = $this->saveStatement($jsonArray);    // add statement chat data
                    $savestate = $resultArray['savestate'];
                    $statement_instance_node_id = $resultArray['statement_instance_node_id'];
                    /* Code For Add or Edit Notification Count */
                    /*Code Commented By: Divya Rajput
                    $jsonArrayTemp = $jsonArray;
                    $jsonArrayTemp['user_recepient_node_id'] = $user_instance_string;
                    $jsonArray['user_instance_node_id'] = $user_instance_node_id;
                    $jsonArrayTemp = json_decode(json_encode($jsonArrayTemp));
                    $this->addNotificationOfChat($jsonArrayTemp,$statement_instance_node_id,1,0,'Dialogueletter');*/
                }
            }
            $success = $this->updateDialogTimestamp($dialogue_node_id);
        }
        $final_ary['modeType'] = $StmtType;
        $final_ary['savestate'] = isset($savestate) ? $savestate : '';
        $final_ary['date'] = date("m/d/y");// change date format date("Y F d h:i:s") to  date("m/d/y")
        //$final_ary['created'] = date("Y m d H:i:s");
        $final_ary['timestamp']= strtotime($stmntTimestamp);
        return $final_ary; // combination of $dialogue_node_id and $dialog_node_instance_property_id of title
    }
    /**
     * Modified By: Amit Malakar
     * Date: 31-Mar-2017
     * To get Dialogue Owner Id
     * @param $dialogue_node_id
     * @return mixed
     */
    public function fetchDialogOwnerId($dialogue_node_id)
    {
        //global $this->MySQLiconn;
         $sql        = "SELECT `nip`.`value`, `ncp`.`caption` FROM `node-instance-property` AS `nip`
                    INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id`
                    INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
                    WHERE `ni`.`node_id` = '$dialogue_node_id' AND `ncp`.`caption` = 'Admin' ";
        $res        = $this->MySQLiconn->query($sql);
        $AdminArray = $res->fetch_assoc();
        return $admin_id = $AdminArray['value'];
    }
    /**
     * Created By: Arvind Soni
     * Date: 03-April-2017
     * Add Notification Count On Perticular Dialog or Course
     * @param $postObj,$statementInstanceNodeId,$status,$updateStatus,$type
     * @return null
     */
    public function addNotificationOfChat($postObj,$statementInstanceNodeId,$status,$updateStatus,$type)
    {
        $recepintUserList = (isset($postObj->user_recepient_node_id)) ? $postObj->user_recepient_node_id : "";
        $loginUser        = (isset($postObj->user_instance_node_id)) ? $postObj->user_instance_node_id : "";
        $dialogueNodeId   = (isset($postObj->dialogue_node_id)) ? trim($postObj->dialogue_node_id) : "";
        //global $this->MySQLiconn;
        if(strtolower($type) == 'chat' || strtolower($type) == 'letter' || strtolower($type) == 'dialogueletter' || strtolower($type) == 'system message')
        {
            if(intval($status) == 1 && intval($updateStatus) == 0 )
            {
                if(1){
                    if(strtolower($type) == 'chat' || strtolower($type) == 'letter' ||  strtolower($type) == 'system message' || strtolower($type) == 'dialogueletter')
                    {
                        $recepientArray             = array_diff(explode(',',$recepintUserList),explode(',',$loginUser));
                    }

                    //for 45 users, before:15.717 s :: after :9.116 s
                    $notification_actor_ncpid       = NOTIFICATION_ACTOR_PID;
                    $notification_view_ncpid        = NOTIFICATION_VIEW_PID;
                    $notification_dialogue_ncpid    = NOTIFICATION_DIALOG_PID;
                    $node_class_id                  = NOTIFICATION_CLASS_ID;
                    $node_type_id                   = '2';
                    $count                          = 0;
                    $viewStatus                     = '0';

                    $sqlA = "INSERT INTO `node-instance-property` (`node_instance_id`, `node_class_property_id`, `node_id`, `node_type_id`, `value`, `sequence`, `encrypt_status`) VALUES";

                    foreach($recepientArray as $index => $recepientId)
                    {
                        $node_id                        = $this->createNode();
                        $sql                            = "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '1')";
                        $res                            = $this->MySQLiconn->query($sql);
                        $node_instance_id               = $this->MySQLiconn->insert_id;

                        // create node-instance-property
                        $notification_actor_node_id     = $this->createNode();
                        $notification_view_node_id      = $this->createNode();
                        $notification_dialogue_node_id  = $this->createNode();

                        if($count != 0){
                            $sqlA .=", ";
                        }
                        $sqlA .= " ('$node_instance_id', '$notification_actor_ncpid', '$notification_actor_node_id', $node_type_id, '$recepientId', '0', '0'), "
                                . " ('$node_instance_id', '$notification_view_ncpid', '$notification_view_node_id', $node_type_id, '$viewStatus', '0', '0'), "
                                . " ('$node_instance_id', '$notification_dialogue_ncpid', '$notification_dialogue_node_id', $node_type_id, '$dialogueNodeId', '0', '0') ";

                        $nodeXArray[]                   = $node_id;
                        ++$count;
                    }
                    //echo $sqlA;
                    $this->MySQLiconn->query($sqlA);

                    if(count($nodeXArray) > 0 && intval($statementInstanceNodeId) > 0)
                    {
                        //before: 0.752 ms :: after : 0.036 ms
                        $xCount = 0;
                        $sql    = "INSERT INTO `node-x-y-relation` (`node_x_id`, `node_y_id`) VALUES ";
                        foreach($nodeXArray as $nodeXId)
                        {
                            if($xCount != 0){
                                $sql .=", ";
                            }
                            $sql .= "('$nodeXId', '$statementInstanceNodeId')";
                            ++$xCount;
                        }
                        //echo '<br>'.$sql;
                        $res    = $this->MySQLiconn->query($sql);
                    }
                }else{
                if(strtolower($type) == 'chat' || strtolower($type) == 'letter' ||  strtolower($type) == 'system message')
                {
                    $recepientArray 						= array_diff(explode(',',$recepintUserList),explode(',',$loginUser));
                    $dialogueId 						= $dialogueNodeId;
                }
                else if(strtolower($type) == 'dialogueletter' ||  strtolower($type) == 'system message')
                {
                    $recepientArray 						= array_diff(explode(',',$recepintUserList),explode(',',$loginUser));
                    $dialogueId 						= $dialogueNodeId;
//                    $recepientArray 						= array_diff(explode(',',$postObj['user_recepient_node_id']),explode(',',$postObj->user_instance_node_id));
//                    $dialogueId                                                 = $postObj['dialogue_node_id'];
                }
                $viewStatus 							= '0';
                if(count($recepientArray) > 0)
                {
                    $nodeXArray 						= array();
                    foreach($recepientArray as $index => $recepientId)
                    {
                        $node_id 						= $this->createNode();
                        $node_class_id        			= NOTIFICATION_CLASS_ID;
                        $node_type_id         			= '2';
                         $sql                        	= "INSERT INTO `node-instance` (`node_id`, `node_class_id`, `node_type_id`, `caption`, `status`) VALUES ('$node_id', '$node_class_id', '$node_type_id', '$node_id', '1')";
                        $res                        	= $this->MySQLiconn->query($sql);
                        $node_instance_id           	= $this->MySQLiconn->insert_id;
                        $notification_node_id 			= $node_id;
                        $propertyIdArray 				= array(NOTIFICATION_ACTOR_PID,NOTIFICATION_VIEW_PID,NOTIFICATION_DIALOG_PID);
                        $propertyValArray 				= array($recepientId,$viewStatus,$dialogueId);
                        foreach($propertyIdArray as $key => $value)
                        {
                            $val_node_id                = $this->createNode();
                            $val_node_instance_id       = $node_instance_id;
                            $val_node_class_property_id = $value;
                            $val_node_type_id           = $node_type_id;
                            $val_value                  = addslashes(trim($propertyValArray[$key]));
                            $sql              			= "INSERT INTO `node-instance-property` (`node_id`, `node_instance_id`, `node_class_property_id`, `node_type_id`, `value`) VALUES ('$val_node_id', '$val_node_instance_id', '$val_node_class_property_id', '$val_node_type_id', '$val_value')";
                            $res              			= $this->MySQLiconn->query($sql);
                            $node_property_id 			= $this->MySQLiconn->insert_id;
                        }
                        $nodeXArray[] 					= $notification_node_id;
                    }
                    if(count($nodeXArray) > 0 && intval($statementInstanceNodeId) > 0)
                    {
                        foreach($nodeXArray as $counter => $nodeXId)
                        {
                            $sql 						= "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ('$statementInstanceNodeId', '$nodeXId')";
                            $res 						= $this->MySQLiconn->query($sql);
                        }
                    }
                }
                }
            }
        }
    }
    public function deleteNotificationFromStatement($type,$id)
    {
//        global $this->MySQLiconn;
        if($type == 'node_instance_property_id' && $id != '')
        {
             $sql    = "SELECT ni1.`node_instance_id` FROM `node-instance` AS ni1 WHERE ni1.`node_id` in (SELECT `node_x_id` FROM `node-x-y-relation` WHERE `node_y_id` in (SELECT ni.node_id FROM `node-instance` AS ni INNER JOIN `node-instance-property` As nip ON nip.`node_instance_id` = ni.`node_instance_id` AND nip.node_instance_property_id = ".$id."))";
            $res         = $this->MySQLiconn->query($sql);
            $tempArray	 = array();
            while ($crArr = $res->fetch_assoc()) {
                $tempArray[] = $crArr;
            }
           foreach($tempArray as $key => $value)
           {
                $sql    = "DELETE FROM `node-instance-property` WHERE `node_instance_id` = ".$value['node_instance_id'];
                $res         = $this->MySQLiconn->query($sql);
                $sql    = "DELETE FROM `node-instance` WHERE `node_instance_id` = ".$value['node_instance_id'];
                $res         = $this->MySQLiconn->query($sql);
           }
        }
    }

    /**
     * Modified By: Awdhesh Soni
     * Date: 13-April-2017
     * Function to fetch Node Id based of Instance Id
     * @param $courseInsId
     * @param $dialogueId
     */
    public function fetchNodeId($course_node_id){
        //global $this->MySQLiconn;
         $sql = "SELECT `ni`.`node_id` AS `node_id` FROM `node-instance` AS `ni` WHERE `ni`.`node_instance_id` = '$course_node_id'";
        $res                       = $this->MySQLiconn->query($sql);
        $res                       = $res->fetch_assoc();
        $node_id = $res['node_id'];
        return $node_id;
    }

     /**
     * Modified By: Awdhesh Soni
     * Date: 12-May-2017
     * Function to fetch nstance Id based of node Id
     * @param $courseInsId
     * @param $dialogueId
     */
    public function fetchInstanceId($node_id){
        //global $this->MySQLiconn;
         $sql = "SELECT `ni`.`node_instance_id` FROM `node-instance` AS `ni` WHERE `ni`.`node_id` = '$node_id'";
        $res                       = $this->MySQLiconn->query($sql);
        $res                       = $res->fetch_assoc();
        $node_instance_id = $res['node_instance_id'];
        return $node_instance_id;
    }

    /**
     * Modified By: Awdhesh Soni
     * Date: 13-April-2017
     * Function to add Participant for dialogue
     * Modified by Amit Malakar
     * Date: 08-May-2017
     * Add participant from Individual history class
     * @param $courseInsId
     * @param $dialogueId
     */
    public function addUpdateParticipant($dialog_data){
        //print_r($dialog_data);
        $dialogueTimestamp = time();
        $user_instance_node_id   = $dialog_data['user_instance_node_id'];
        $user_recepient_node_id   = $dialog_data['user_recepient_node_id'];
        $dialog_node_id = $dialog_data['dialogue_node_id'];
        $course_node_id = $dialog_data['course_node_id'];

        // Modified by: Amit Malakar
        // Date: 03-May-17
        // Add user if user was not present already, added/deleted

        // get all users, to check already in INDIVIDUAL HISTORY

        // Awdhesh soni convert code make new function for check participant exits in dialogue and course individual history class
        $prtToAddArr = $this->checkUserExitsIndividualHistory($dialog_node_id,$user_instance_node_id);
        // add new participants to dialogue
        $this->addParticipantsToDialogue($dialog_node_id, $prtToAddArr, $dialogueTimestamp);
        // add new participants to course
        $prtToCourseAddArr = $this->checkUserExitsIndividualHistory($course_node_id,$user_instance_node_id);
        $this->addParticipantsToDialogue($course_node_id, $prtToCourseAddArr, $dialogueTimestamp);
        //print_r(array($prtListArr, $prevParticipants, $prtToAddArr,$user_recepient_node_id));

        /*// fetch dialogue's removed participants
        $removedParticipantsPropId = DIALOGUE_REMOVED_PARTICIPANTS;
        $sql = "SELECT `nip`.`value` FROM `node-instance-property` AS `nip`"
               . " INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`"
               . " WHERE `ni`.`node_id`='$dialog_node_id' AND `nip`.`node_class_property_id`= '$removedParticipantsPropId'";
        $resultObj    = $this->MySQLiconn->query($sql);
        $removedParticipantsRes = $resultObj->fetch_assoc();
        $removedParticipantsArr = explode(',', $removedParticipantsRes['value']);
        print_r($removedParticipantsArr);

        // filter already removed participants
        $participantToAdd = array_diff($user_instance_node_id, $removedParticipantsArr);
        print_r($participantToAdd);

        //select relation between user and dialougue if exits
        $userInstanceNodeIds = implode(",", $participantToAdd);
        echo $sql                 = "SELECT `xy`.`node_x_id` FROM `node-x-y-relation` AS `xy` WHERE `xy`.`node_y_id` = '$dialog_node_id' AND `xy`.`node_x_id` IN ($userInstanceNodeIds) ";
        $resultObj        = $this->MySQLiconn->query($sql);
        $participantArr      = array();
        while ($participantsRows = $resultObj->fetch_assoc()) {
            $participantArr[] = $participantsRows['node_x_id'];
        }

        // filter existing participants
        $finalParticipantToAdd = array_diff($participantToAdd, $participantArr);
        print_r($finalParticipantToAdd);

        $sql = "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ";
        foreach ($finalParticipantToAdd as $key => $value) {
            //insert all the actor into the database to associate with the dialogue
             $sql .= "('$dialog_node_id', '$user_instance_node_id[$key]'),";

            // As discussed with Awdhesh, commenting code - Add/Remove participants only from Dialogue
            //check the xy relation already exists or not between course and user
            //$sql = "SELECT `xy`.* FROM `node-x-y-relation` AS `xy` WHERE `xy`.`node_y_id` = '$course_node_id' AND `xy`.`node_x_id` = '$user_instance_node_id[$key]'";
            //$courseRes                       = $this->MySQLiconn->query($sql);
            //$courseRes                       = $courseRes->fetch_assoc();
            //if(empty($courseRes['node_x_y_relation_id'])){
                //insert all the actor into the database to associate with the dialogue
                 //$sql = "INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`) VALUES ('$course_node_id', '$user_instance_node_id[$key]')";
                 //$res                       = $this->MySQLiconn->query($sql);
            //}
        }
        if(count($finalParticipantToAdd)) {
            echo $sql = rtrim($sql, ',');
            $res = $this->MySQLiconn->query($sql);
        }*/

        if (!empty($dialog_data['status']) && $dialog_data['status'] == 1) {
            // update status based of dialogue nodeid and class id
            $this->updateInsStatus($dialog_node_id, $dialog_data['status'], DIALOGUE_CLASS_ID);
            // update status based of course nodeid and class id
            $this->updateInsStatus($course_node_id, $dialog_data['status'], COURSE_CLASS_ID);
        }
        // update timestamp of dialogue class property update timestamp
        $this->updateDialogTimestamp($dialog_node_id);
        // update timestamp of course class property update timestamp
        $this->updateCourseTimestamp($course_node_id); // Added by awdhesh soni
        //saveNewDialogueActorInstances($dialog_data);
        //echo $newParti;

        $userArr = $this->fetchUserDetailsByDialogue($dialog_node_id,implode(',', $user_recepient_node_id));
        //$userArr = $this->fetchUserDetailsByDialogue($dialog_node_id,implode(',', $prtToAddArr));


        return $userArr;
    }
    /* Modified by Awdhesh Soni
     * Date: 17-April-2017
     * Check participant exits in dialogue and course individual history class
     *
     */
    public function checkUserExitsIndividualHistory($node_id,$user_instance_node_id){
         $sql = "SELECT `nip`.`node_instance_id`, `nip`.`node_class_property_id`, `nip`.`value` FROM `node-instance-property` AS `nip`"
                . " INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id`"
                . " INNER JOIN `node-x-y-relation` AS `nxyr` ON `nxyr`.`node_x_id` = `ni`.`node_id`"
                . " WHERE `ni`.`node_class_id` = '".INDIVIDUAL_HISTORY_CLASS_ID."' AND `nxyr`.`node_y_id`='$node_id' ";
        $resultObj        = $this->MySQLiconn->query($sql);
        $prtListArr      = array();
        while ($prtList = $resultObj->fetch_assoc()) {
            $prtListArr[$prtList['node_instance_id']][$prtList['node_class_property_id']] = $prtList['value'];
        }


        $prevParticipants = array_column($prtListArr, INDIVIDUAL_ACTORID_PROP_ID);
        $prtToAddArr = array();
        foreach($user_instance_node_id as $userId) {
            $userExists = array_search($userId, $prevParticipants);
            if ($userExists !== false && $userExists >= 0) { // new participant cann't be added, if user already added and/or removed

            } else {    // new participant can be added
                $prtToAddArr[] = $userId;
            }
        }
        return $prtToAddArr;
    }

    /* Modified by Awdhesh Soni
     * Date: 17-April-2017
     * Function here use to fetch details user details by dialogue node id
     * Modified by Amit Malakar
     * Date: 08-May-2017
     * User info from Individual history class
     */
    public function fetchUserDetailsByDialogue($dialog_node_id,$user_instance_node_id){
        // get dialogue related user information
        $indHistoryClassId = INDIVIDUAL_HISTORY_CLASS_ID;
        $actorNcpid        = INDIVIDUAL_ACTORID_PROP_ID;
        if(1){
            //Modified by:Divya Rajput
            //to get all users status either users are added or removed
             $sql               = "SELECT `nip2`.`value` AS `value`, `nip2`.`node_class_property_id`, `xy`.`node_x_id` AS `user_node_id`"
                             . " FROM `node-instance-property` AS `nip`"
                             . " INNER JOIN `node-instance-property` AS `nip2` ON `nip2` . `node_instance_id` = `nip` . `node_instance_id`"
                             . " INNER JOIN `node-instance` AS `ni` ON `nip` . `node_instance_id` = `ni` . `node_instance_id`"
                             . " INNER JOIN `node-x-y-relation` AS `xy` ON `xy` . `node_x_id` = `ni` . `node_id`"
                             . " WHERE `xy` . `node_y_id` = '$dialog_node_id' AND `ni` . `node_class_id` = '$indHistoryClassId'"
                             . " AND `nip` . `node_class_property_id` = '$actorNcpid'";
        }else{
         $sql               = "SELECT `nip2`.`value` AS `value`, `nip2`.`node_class_property_id`, `xy`.`node_x_id` AS `user_node_id`"
                             . " FROM `node-instance-property` AS `nip`"
                             . " INNER JOIN `node-instance-property` AS `nip2` ON `nip2` . `node_instance_id` = `nip` . `node_instance_id`"
                             . " INNER JOIN `node-instance` AS `ni` ON `nip` . `node_instance_id` = `ni` . `node_instance_id`"
                             . " INNER JOIN `node-x-y-relation` AS `xy` ON `xy` . `node_x_id` = `ni` . `node_id`"
                             . " WHERE `xy` . `node_y_id` = '$dialog_node_id' AND `ni` . `node_class_id` = '$indHistoryClassId'"
                             . " AND `nip` . `node_class_property_id` = '$actorNcpid' AND `nip` . `value` IN(" . $user_instance_node_id . ")";
        }
        $userArray         = array();
        $oldUserNodeId     = '';
        $actorNodeIds      = array();
        if($userList = $this->MySQLiconn->query($sql)) {
            while ($userArr = $userList->fetch_assoc()) {
                if ($userArr['node_class_property_id'] == INDIVIDUAL_ACTORID_PROP_ID && $oldUserNodeId != $userArr['user_node_id']) {
                    $oldUserNodeId                       = $userArr['user_node_id'];
                    $actorId                             = $userArr['value'];
                    $userArray[$actorId]['actor_id']     = $actorId;
                    $userArray[$actorId]['user_node_id'] = $oldUserNodeId;
                    $actorNodeIds[]                      = $actorId;
                } elseif ($userArr['node_class_property_id'] == INDIVIDUAL_TIMESTAMP_PROP_ID) {
                    $userArray[$actorId]['timestamp'] = $userArr['value'];
                } elseif ($userArr['node_class_property_id'] == INDIVIDUAL_STATUS_PROP_ID) {
                    $userArray[$actorId]['status'] = $userArr['value'];
                    $userArray[$actorId]['has_removed'] = ($userArr['value'] == 2) ? 1: 0;
                }
            }
        }
        if(count($actorNodeIds)) {
            $accountClassId = ACCOUNT_CLASS_ID;
            $emailNcpid     = INDIVIDUAL_EMAIL_ID;
            $accountStatus  = ACCOUNT_STATUS_ID;
            //$passwordNcpid  = ACCOUNT_PASSWORD_ID;
            //Modified by Gaurav on 11 Sept 2017 get user status
             $sql = "SELECT `ni`.`node_id` AS `actor_id`, `nip`.*, `nip2`.`value` AS `email`,`nip3`.`value` AS `password` ,`nip4`.`value` AS `account_status` FROM `node-instance-property` AS `nip`"
                   . " INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id`"
                   . " INNER JOIN `node-x-y-relation` AS `nxyr` ON `nxyr`.`node_y_id` = `ni`.`node_id`"
                   . " INNER JOIN `node-instance` AS `ni2` ON `ni2`.`node_id` = `nxyr`.`node_x_id`"
                   . " INNER JOIN `node-instance-property` AS `nip2` ON `nip2`.`node_instance_id` = `ni2`.`node_instance_id`"
                   . " INNER JOIN `node-instance-property` AS `nip3` ON `nip3`.`node_instance_id` = `ni2`.`node_instance_id`"
                   . " LEFT JOIN `node-instance-property` AS `nip4` ON `nip4`.`node_instance_id` = `ni2`.`node_instance_id` AND `nip4`.`node_class_property_id` = '$accountStatus' "
                   . " WHERE `ni`.`node_id` IN (" . implode(',', $actorNodeIds) . ") AND `ni2`.`node_class_id` = '$accountClassId' "
                   . " AND `nip2`.`node_class_property_id` = '$emailNcpid'  ";
            //. " AND `nip2`.`node_class_property_id` = '$emailNcpid' AND `nip3`.`node_class_property_id` = '$passwordNcpid' ";
            if($userRes = $this->MySQLiconn->query($sql)) {
                while ($userInfo = $userRes->fetch_assoc()) {
                    $actorId                         = $userInfo['actor_id'];
                    $userArray[$actorId]['user_id']  = $actorId;
                    $userArray[$actorId]['email']    = $userInfo['email'];
                    $userArray[$actorId]['account_status']    = !isset($userInfo['account_status'])?'active': $userInfo['account_status'];
                    //$userArray[$actorId]['password'] = $userInfo['password'];



                    if ($userInfo['node_class_property_id'] == INDIVIDUAL_FIRST_NAME) {
                        $userArray[$actorId]['first_name'] = $userInfo['value'];
                    } elseif ($userInfo['node_class_property_id'] == INDIVIDUAL_LAST_NAME) {
                        $userArray[$actorId]['last_name'] = $userInfo['value'];
                    } elseif ($userInfo['node_class_property_id'] == INDIVIDUAL_DOB) {
                        $userArray[$actorId]['dob'] = $userInfo['value'];
                    }elseif ($userInfo['node_class_property_id'] == INDIVIDUAL_PROFILE_IMAGE) {//Added by Gaurav, Added on 06 July
                        $userArray[$actorId]['profile_image'] = $this->getProfileUserImage($userInfo['value'], 'thumbnail');
                    }
                    if(!isset($userArray[$actorId]['profile_image'])){
                        if($userArray[$actorId]['account_status']=='guest'){
                            $userArray[$actorId]['profile_image'] = $this->getProfileUserImage('', 'guest');
                        }else{
                            $userArray[$actorId]['profile_image'] = $this->getProfileUserImage('', 'thumbnail');
                        }
                    }
                    if(!isset($userArray[$actorId]['last_name'])){
                        $userArray[$actorId]['last_name'] = ' ';
                    }
                }
            }
        }


        /*$dialogueclassId = DIALOGUE_CLASS_ID;
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        //$user_instance_node_id = substr(trim($user_instance_node_id), 0, -1);
        //global $this->MySQLiconn;
        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_node_id`
        FROM `node-instance-property` AS `nip`
        INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
        INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
        INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id`
        WHERE `xy`.`node_y_id` = '$dialog_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' and `xy`.`node_x_id` IN ($user_instance_node_id)";
        $userList                       = $this->MySQLiconn->query($sql);
        $userArray = array();
        while ($userArr = $userList->fetch_assoc()) {
            $userArray[] = $userArr;
        }

        $mainAry = array();
        $temp_ary = array();
        $user_ins_array= '';

        foreach ($userArray as $value) {
            $caption 				= $value['caption'];
            $id                                 = $value['user_node_id'];
            $temp_ary[$id][strtolower($caption)]= $value['value'];
            $temp_ary[$id]['id']                = $id;
            $user_ins_array .= $id.",";

        }
        $user_ins_array = substr(trim($user_ins_array), 0, -1);
        //$user_ins_array = explode(',',$user_ins_array);
        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_y_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` IN ($user_ins_array) AND `ni`.`node_class_id` = '$account_class_node_id' AND `ncp`.`caption` = 'Email Address'";
        $resultObj                      = $this->MySQLiconn->query($sql);
        $userArray = array();
        while ($accountArr = $resultObj->fetch_assoc()) {
            $accountInfo[] = $accountArr;
        }
        $acount_ary = array();
        foreach($accountInfo as $accountDeatil)
        {
            $id  = $accountDeatil['user_instance_node_id'];
            $caption = $accountDeatil['caption'];
            $acount_ary[$id][strtolower($caption)] = $accountDeatil['value'];
        }

        foreach($temp_ary as $value)
        {

            $id = $value['id'];
            $mainAry[$id]['first_name']		= $value['first name'];
            $mainAry[$id]['last_name']		= $value['last name'];

            $mainAry[$id]['user_id']            = $id;
            $mainAry[$id]['email']              = $acount_ary[$id]['email address'];
            $mainAry[$id]['domain']		= 'Prospus';
            $mainAry[$id]['title']		= 'Admin';
        }*/


        // foreach ($mainAry as $key => $row) {
        //     $finalAry[$key] = $row['admin'];
        // }

        // $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`
        //     FROM `node-instance-property` AS `nip`
        //     INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
        //     INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
        //     WHERE `ni`.`node_id` = '$dialog_node_id' AND `ni`.`node_class_id` = '$dialogueclassId' AND `nip`.`node_class_property_id`=1979";
        // $resultObj                      = $this->MySQLiconn->query($sql);
        //
        // $adminArr = $resultObj->fetch_assoc();
        // $adminArr = $adminArr['caption']= $adminArr['value'];

        //usort($finalAry, $mainAry);
        return array('actor_list' =>$userArray );
    }

    /**
     * Function here to DELETE PARTICIPANT FROM dialogue
     * Modified By: Awdhesh Soni
     * Date: 17-April-2017
     * Modified by Amit Malakar
     * Date: 08-May-2017
     * Delete participant from Individual history class
     */
    public function removeParticipantData($dataArr) {

        $dialog_node_id = $dataArr['dialogue_node_id'];
        $remove_user_node_id = $dataArr['removeUser'];
        $course_node_id = $dataArr['course_node_id'];

        $dialogueTimestamp = time();
        // get all users, to check already in INDIVIDUAL HISTORY
         $sql = "SELECT `nip`.`node_instance_id`, `nip`.`node_class_property_id`, `nip`.`value` FROM `node-instance-property` AS `nip`"
               . " INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id`"
               . " INNER JOIN `node-x-y-relation` AS `nxyr` ON `nxyr`.`node_x_id` = `ni`.`node_id`"
               . " WHERE `ni`.`node_class_id` = '".INDIVIDUAL_HISTORY_CLASS_ID."' AND `nxyr`.`node_y_id`='$dialog_node_id' ";
        $resultObj        = $this->MySQLiconn->query($sql);
        $prtListArr      = array();
        while ($prtList = $resultObj->fetch_assoc()) {
            $prtListArr[$prtList['node_instance_id']][$prtList['node_class_property_id']] = $prtList['value'];
        }
        //print_r($prtListArr);

        // only status 1 participants (added), not status 2 (deleted) can be removed
        $addedFlag = false;
        $deletedFlag = false;
        foreach($prtListArr as $prtInfo) {
            if($prtInfo[INDIVIDUAL_ACTORID_PROP_ID] == $remove_user_node_id) {
                if($prtInfo[INDIVIDUAL_STATUS_PROP_ID] == 2) {
                    $deletedFlag = true;
                } else {
                    $addedFlag = true;
                }
            }
        }
        if($addedFlag && !$deletedFlag) {
            // remove participant
            $result = $this->removeParticipantFromDialogue($dialog_node_id, $remove_user_node_id, $dialogueTimestamp);
            // update timestamp of course class property update timestamp
            $this->updateCourseTimestamp($course_node_id); // added by awdhesh soni
            return array('status'=> true);
        }
        //print_r(array($prtListArr, $remove_user_node_id,$addedFlag,$deletedFlag));

        return array('status'=>false);

        /*// Modified by: Amit Malakar
        // Date: 03-May-17
        // fetch all individuals in dialogue
        $individualClassId = INDIVIDUAL_CLASS_ID;
        echo $sql = "SELECT `ni`.`caption` FROM `node-instance` AS `ni`"
                    . " INNER JOIN `node-x-y-relation` AS `nxyr` ON `nxyr`.`node_x_id` = `ni`.`node_id`"
                    . " WHERE `nxyr`.`node_y_id` = '$dialog_node_id' AND `ni`.`node_class_id`='$individualClassId' ";
        $resultObj        = $this->MySQLiconn->query($sql);
        $participantIdArr = array();
        while ($participant = $resultObj->fetch_assoc()) {
            $participantIdArr[] = $participant['caption'];
        }

        // fetch dialogue's removed participants
        $removedParticipantsPropId = DIALOGUE_REMOVED_PARTICIPANTS;
        echo $sql = "SELECT `nip`.* FROM `node-instance-property` AS `nip`"
                    . " INNER JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`"
                    . " WHERE `ni`.`node_id`='$dialog_node_id' ";
        $resultObj    = $this->MySQLiconn->query($sql);
        $dialogueInfo = array();
        while ($dialogue = $resultObj->fetch_assoc()) {
            $dialogueInfo[] = $dialogue;
        }

        $sql = '';
        if (in_array($remove_user_node_id, $participantIdArr)) { // remove user needs to be in participants list
            if (count($dialogueInfo)) {
                $dialogueStatusIndex = array_search($removedParticipantsPropId, array_column($dialogueInfo, 'node_class_property_id'));
                if ($dialogueStatusIndex !== false && $dialogueStatusIndex >= 0) { // update removed participant
                    // if user is already in removed list
                    $prevRemovedParticipantsArr = in_array($remove_user_node_id, explode(',', $dialogueInfo[$dialogueStatusIndex]['value']));
                    if ($prevRemovedParticipantsArr !== false && $prevRemovedParticipantsArr >= 0) {
                        $participantIds = $dialogueInfo[$dialogueStatusIndex]['value'];
                    } else {
                        $participantIds = $dialogueInfo[$dialogueStatusIndex]['value'] . ',' . $remove_user_node_id;
                    }
                    $participants_nip_id = $dialogueInfo[$dialogueStatusIndex]['node_instance_property_id'];
                    $sql = "UPDATE `node-instance-property` SET `value`='$participantIds' WHERE `node_instance_property_id`='$participants_nip_id'";
                } else { // insert removed participant
                    $node_instance_id = $dialogueInfo[0]['node_instance_id'];
                    $node_id          = $this->createNode();
                    $node_type_id     = $dialogueInfo[0]['node_type_id'];
                    $sql = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`)"
                                . " VALUE ('$node_instance_id', '$removedParticipantsPropId', '$node_id', '$node_type_id', '$remove_user_node_id', '0', '0')";
                }
            }
        }

        if (!empty($sql)) {
            // $sql = "DELETE FROM `node-x-y-relation` WHERE `node_x_id` = '$remove_user_node_id' AND `node_y_id` = '$dialog_node_id'"; return true;
            $res     = $this->MySQLiconn->query($sql);
            $this->updateDialogTimestamp($dialog_node_id);

            //$dataArr = fetchUserDetailsByDialogue($dialog_node_id,$current_user_node_id);
            return array('status' => $res);
        }

        return array('status'=>false);*/
    }

    /**
     * Function here to update instance status for dialogue and courses class
     * Modified By: Awdhesh Soni
     * Date: 13-April-2017
     * updateInsStatus by $nodeId, $status, $classNId
     */
    public function updateInsStatus($nodeId, $status, $classNId){
        //global $this->MySQLiconn;
        $sql = "UPDATE `node-instance` SET `status` = '$status' WHERE `node_id` = '$nodeId' AND `node_class_id` = '$classNId'";
        $res = $this->MySQLiconn->query($sql);
    }

    /**
     * Function to send push notification to iphone
     * @param type $dataArr
     */
    public function pushNotification($dataObj) {

        $push = new PushNotification("sandbox", __DIR__ . '/notification/iphone/'.IOS_PEM_FILE);

        if (isset($dataObj->user_recepient_node_id) && trim($dataObj->notification) != '') {


            $recipientArr = array_unique(explode(",", $dataObj->user_recepient_node_id));

            // Search
            foreach($recipientArr as $key=>$val){
                if(trim($dataObj->user_instance_node_id)==$val){
                    unset($recipientArr[$key]);
                }
            }
            //$pos = array_search(trim($dataObj->user_instance_node_id), $recipientArr);
            // Remove from array
            //unset($recipientArr[$pos]);
            if(count($recipientArr)>0) {
                $notificationRecepient = implode(",", $recipientArr);

                // Set pass phrase if any
                $push->setPassPhrase("prospus1");
                // Set badge
                $push->setBadge(2);
                // Set message body
                /* added on 6 june 2017
                 * by gaurav
                 */
                if(isset($dataObj->action) && trim($dataObj->action)=="Chat"){
                    $push->setMessageBody(trim($dataObj->username)." @ ".trim($dataObj->dialogue_title)."  \r\n".trim($dataObj->notification));
                }else{
                    $push->setMessageBody(trim($dataObj->notification));
                }
                /*End*/

                $push->setContextId(trim($dataObj->dialogue_node_id));
                $push->setSenderId(trim($dataObj->user_instance_node_id));
                $push->setActionType(trim($dataObj->type));
                /* Added by Kunal
                 */
                if(isset($dataObj->type) && trim($dataObj->type)=="updateDialogTitle"){
                  $push->setAcme4(trim($dataObj->dialogue_title));
                }elseif(isset($dataObj->type) && trim($dataObj->type)=="removeParticipant"){
                  $push->setAcme4(trim($dataObj->user_instance_node_id));
                }
                $deviceTokensArr = $this->getDeviceToken($dataObj, $notificationRecepient);
                //print_r("Token Values:-----");
                //print_r($deviceTokensArr);

                $deviceTokensArr = array_values(array_unique($deviceTokensArr));
                //$push->setDeviceToken("94AD53F9AA56C5F3497EABFD2FED3CF910941FBBEE5F3AD163857C515E39198C");
                //var_dump($push->sendNotification());
                foreach ($deviceTokensArr as $token) {
                    if (trim($token) != '') {
                        var_dump(trim($token));
                        //$push->setDeviceToken("CA8D0DC243D1162D75EBCFAC4CEB95DCCAE8F923B7896712D01BA04648E30532");
                        $push->setDeviceToken(trim($token));
                        var_dump($push->sendNotification());
                    }
                }
            }
        }
    }

    public function getDeviceToken($dataObj, $notificationRecepient) {

         $sql = "SELECT `nip`.`value` AS `device_token`, `ni`.`node_instance_id` AS `node_instance_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` WHERE `ni`.`node_id`  IN(" . trim($notificationRecepient) . ") AND `nip`.`node_class_property_id`=".INDIVIDUAL_DEVICE_TOKEN."";
        //print_r($sql);
        $userArray = array();
        if($userList = $this->MySQLiconn->query($sql)){
            if (trim($notificationRecepient) != '') {
                while ($userArr = $userList->fetch_assoc()) {
                    $userArray[] = $userArr['device_token'];
                }
            }
        }

        return $userArray;
    }

    /* Modified by Awdhesh Soni
     * Date: 17-April-2017
     * Function here use to fetch details user details by dialogue node id
     * Modified by Amit Malakar
     * Date: 08-May-2017
     * Individual history class used to fetch admin details, Dialogue -> Admin
     */
    public function fetchAdminDetailsByDialogue($dialog_node_id,$user_instance_node_id){

        $dialAdminId = DIALOGUE_ADMIN_ID;
         $sql = "SELECT `ni2`.`node_id`,`nip2`.`node_class_property_id`,`nip2`.`value`"
               . " FROM `node-instance-property` AS `nip`"
               . " INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`"
               . " INNER JOIN `node-instance` AS `ni2` ON `ni2`.`node_id` = `nip`.`value`"
               . " INNER JOIN `node-instance-property` AS `nip2` ON `nip2`.`node_instance_id` = `ni2`.`node_instance_id`"
               . " WHERE `ni`.`node_id`='$dialog_node_id' AND `nip`.`node_class_property_id`='$dialAdminId' ";
        $userList                       = $this->MySQLiconn->query($sql);

        $userArray = array();
        while ($userArr = $userList->fetch_assoc()) {
            $actorId = $userArr['node_id'];
            if($userArr['node_class_property_id'] == INDIVIDUAL_FIRST_NAME) {
                $userArray[$actorId]['first_name'] = $userArr['value'];
            } elseif($userArr['node_class_property_id'] == INDIVIDUAL_LAST_NAME) {
                $userArray[$actorId]['last_name'] = $userArr['value'];
            } elseif($userArr['node_class_property_id'] == INDIVIDUAL_DOB) {
                $userArray[$actorId]['dob'] = $userArr['value'];
            }
        }

        /*$dialogueclassId = DIALOGUE_CLASS_ID;
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        //$user_instance_node_id = substr(trim($user_instance_node_id), 0, -1);
        //global $this->MySQLiconn;
        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_node_id`
        FROM `node-instance-property` AS `nip`
        INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
        INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
        INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id`
        WHERE `xy`.`node_y_id` = '$dialog_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' and `xy`.`node_x_id` IN ($user_instance_node_id)";
        $userList                       = $this->MySQLiconn->query($sql);
        $userArray = array();
        while ($userArr = $userList->fetch_assoc()) {
            $userArray[] = $userArr;
        }

        $mainAry = array();
        $temp_ary = array();
        $user_ins_array= '';

        foreach ($userArray as $value) {
            $caption 				= $value['caption'];
            $id                                 = $value['user_node_id'];
            $temp_ary[$id][strtolower($caption)]= $value['value'];
            $temp_ary[$id]['id']                = $id;
            $user_ins_array .= $id.",";

        }
        foreach($temp_ary as $value)
        {

            $id = $value['id'];
            $mainAry[$id]['first_name']		= $value['first name'];
            $mainAry[$id]['last_name']		= $value['last name'];
            $mainAry[$id]['domain']		= 'Prospus';
            $mainAry[$id]['title']		= 'Admin';
        }*/
        return $userArray;
    }

    /* Modified by awdhesh soni
     * Function use here to fetch mode type*/
    public function fetchStatus($nodeId){
          $sql = "SELECT `status` FROM `node-instance` WHERE `node_id`='$nodeId'";
         $res    = $this->MySQLiconn->query($sql);
         $resArr = $res->fetch_assoc();
         $courseStatus = intval($resArr['status']);
         return $courseStatus;
    }
    /* Added by Kunal Kumar
     * Date: 16-May-2017
     * Function here use to update course/dialogue title
     ** @param $new_title,$property_id,$node_id,$iscourse
     * @return $affectedRows
     */
    function updateCourseDialogueTitle($new_title,$property_id,$node_id,$iscourse,$course_node_id) {
         $sql = "SELECT `node_instance_id` FROM `node-instance` WHERE `node_id`='$node_id'";
        $res    = $this->MySQLiconn->query($sql);
        $resArr = $res->fetch_assoc();
        $node_instance_id = intval($resArr['node_instance_id']);

         $sql = "UPDATE `node-instance-property` SET `value` = '".mysqli_escape_string($this->MySQLiconn,$new_title)."' WHERE `node_instance_id` = '$node_instance_id' and `node_class_property_id`=".$property_id;
        $res = $this->MySQLiconn->query($sql);
        //if($iscourse==1) // commented by awdhesh soni for update timestamp
            $this->updateCourseTimestamp($course_node_id);
        //else
            $this->updateDialogTimestamp($node_id);
        return $affectedRows = $this->MySQLiconn->affected_rows;
    }

    /**
     * Created By: Kunal
     * Date: 15-May-2017
     * Function to add System Generated Messages in Statement class
     * @param $dialogueNodeId
     * @param $actorId
     * @param $message
     * @param $timestamp
     * @return string
     */
    public function addSystemMessage($dialogueNodeId, $actorId, $message, $timestamp)
    {
        // <b>Amit Malakar</b> removed <b>Awdhesh Soni</b> from this conversation
        // <b>Amit Malakar</b> added <b>Awdhesh Soni</b>
        // <b>Amit Malakar</b> has renamed this conversation to "Test Course"

        // loop through each user, create instance and instance-property
        // create node-instance
        $node_class_id = STATEMENT_CLASS_ID;
        $node_x_id     = $this->createNode();
        $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $node_instance_id = $this->MySQLiconn->insert_id;

        // create node-instance-property
        $actor_author        = STATEMENT_ACTOR_AUTHOR;
        $statement_title     = STATEMENT_TITLE_ID;
        $statement_type      = STATEMENT_TYPE_ID;
        $statement_timestamp = STATEMENT_TIMESTAMP_ID;
        $statement_updated_status = STATEMENT_UPDATED_STATUS;
        $actor_node_id      = $this->createNode();
        $statement_node_id  = $this->createNode();
        $statement_type_node_id = $this->createNode();
        $timestamp_node_id  = $this->createNode();
        $statement_updated_status_node_id  = $this->createNode();
        $sql            = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                  . " ('$node_instance_id','$actor_author','$actor_node_id','2','$actorId','0','0'), "
                                  . " ('$node_instance_id','$statement_title','$statement_node_id','2','$message','0','0'), "
                                  . " ('$node_instance_id','$statement_type','$statement_type_node_id','2','System Message','0','0'), "
                                  . " ('$node_instance_id','$statement_timestamp','$timestamp_node_id','2','$timestamp','0','0'), "
                                  . " ('$node_instance_id','$statement_updated_status','$statement_updated_status_node_id','2','0','0','0') ";
        $this->MySQLiconn->query($sql);

        // create x-y-relation
        $this->createXYRelation($dialogueNodeId, $node_x_id);
        //$result[$userId]      = $node_x_id;

        $sql = "SELECT `node_instance_property_id` FROM `node-instance-property` WHERE `node_id`='$statement_node_id' AND `node_class_property_id`= '$statement_title'";
        $res    = $this->MySQLiconn->query($sql);
        $resArr = $res->fetch_assoc();
        $statement_id = intval($resArr['node_instance_property_id']);

        return array($node_x_id,$statement_id);
    }

    /**
     * Created By: Kunal
     * Date: 15-May-2017
     * Function to add System Generated Messages in Statement class
     * @param $dialogueNodeId
     * @param $actorId
     * @param $message
     * @param $timestamp
     * @return string
     */
    public function getActorHasRemovedStatus($course_node_id,$removed_user_id)
    {

//        $sql = "SELECT `node_instance_id` FROM `node-instance` WHERE `node_id`='$course_node_id'";
//        $res    = $this->MySQLiconn->query($sql);
//        $resArr = $res->fetch_assoc();
//        $course_instance_id = intval($resArr['node_instance_id']);
//            $dialogue_sql = "SELECT `nxyr`.`node_x_id` AS `dialogue_node_id`, `ni`.`status` AS `status`, `ni`.`node_instance_id` AS `dialogue_instance_id`,
//            `nip`.`value` AS `dialogue_title`, `nip2`.`value` AS `createdBy`, `nip1`.`value` AS `individual_node_id`, `nip5`.`value` AS `individual_history_status`,
//            `nip4`.`value` AS `user_name`, `ncp`.`caption` AS `caption`, `nip3`.`value` AS `email` FROM `node-x-y-relation` AS `nxyr`
//            INNER JOIN `node-instance` AS `ni` ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = ".DIALOGUE_CLASS_ID."
//            INNER JOIN `node-instance-property` AS `nip` ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".DIALOGUE_TITLE_ID."
//            INNER JOIN `node-instance-property` AS `nip2` ON ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".DIALOGUE_ADMIN_ID."
//            INNER JOIN `node-x-y-relation` AS `nxyr1` ON `nxyr1`.`node_y_id` = `nxyr`.`node_x_id`
//            INNER JOIN `node-instance` AS `ni1` ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = ".INDIVIDUAL_HISTORY_CLASS_ID."
//            INNER JOIN `node-instance-property` AS `nip1` ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id=".INDIVIDUAL_ACTORID_PROP_ID."
//            INNER JOIN `node-instance-property` AS `nip5` ON ni1.node_instance_id = nip5.node_instance_id AND nip5.node_class_property_id=".INDIVIDUAL_STATUS_PROP_ID."
//            INNER JOIN `node-instance` AS `ni2` ON `ni2`.`node_id` = `nip1`.`value`
//            INNER JOIN `node-instance-property` AS `nip4` ON ni2.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id IN (".INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME.")
//            INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip4`.`node_class_property_id`
//            INNER JOIN `node-x-y-relation` AS `nxyr2` ON `nxyr2`.`node_y_id` = `ni2`.`node_id`
//            INNER JOIN `node-instance` AS `ni3` ON ni3.node_id = nxyr2.node_x_id AND ni3.node_class_id = ".ACCOUNT_CLASS_ID."
//            INNER JOIN `node-instance-property` AS `nip3` ON ni3.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = ".INDIVIDUAL_EMAIL_ID."
//            WHERE `nxyr`.`node_y_id` = '".$course_node_id."'";

             $dialogue_sql = "SELECT `nxyr`.`node_x_id` AS `dialogue_node_id`,`nip1`.`value` AS `individual_node_id`,`nip5`.`value` AS `individual_history_status` FROM `node-x-y-relation` AS `nxyr`
                INNER JOIN `node-x-y-relation` AS `nxyr1` ON `nxyr1`.`node_y_id` = `nxyr`.`node_x_id`
                INNER JOIN `node-instance` AS `ni1` ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = ".INDIVIDUAL_HISTORY_CLASS_ID."
                INNER JOIN `node-instance-property` AS `nip1` ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id = ".INDIVIDUAL_ACTORID_PROP_ID."
                INNER JOIN `node-instance-property` AS `nip5` ON ni1.node_instance_id = nip5.node_instance_id AND nip5.node_class_property_id = ".INDIVIDUAL_STATUS_PROP_ID."
                WHERE `nxyr`.`node_y_id` = '".trim($course_node_id)."' AND nip1.value='".$removed_user_id."'";
                $dialogue_res    = $this->MySQLiconn->query($dialogue_sql);
                while ($crArr = $dialogue_res->fetch_assoc()) {
                    $fetchRecord[] = $crArr;
                }

            $dialogueList = array(); $individual_history_status= "";
            foreach ($fetchRecord as $key => $value) {

                    $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['user_id']                                            = $value['individual_node_id'];
                    // modified by awdhesh for notice undefined individual_history_status
                    if(isset($value['individual_history_status']) && !empty($value['individual_history_status'])){
                        if(!isset($dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['individual_history_status']))
                            $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['individual_history_status']=$value['individual_history_status'];
                        else
                            $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['individual_history_status'].= $value['individual_history_status'];
                    }
            }
           $has_removed = 0;
           $x=$y=0;

            foreach($dialogueList as $key2=>$dialogues)
            {
                //print_r($dialogues['users']);
                if(isset($dialogues['users'][$removed_user_id]))
                {
                    $x += substr_count($dialogues['users'][$removed_user_id]['individual_history_status'],1);
                    $y += substr_count($dialogues['users'][$removed_user_id]['individual_history_status'],2);

                }
            }
            if($x==$y)
            {
                $has_removed = 1;
            }else{
                $has_removed = 0;
                //return $has_removed;
            }
            return $has_removed;
    }
    //Get instance property
    public function getInstanceProperty($instanceNodeId, $propArr) {

        $propIds = implode(",", $propArr);
         $sql = "SELECT GROUP_CONCAT(CONCAT(nip.node_class_property_id,'~#~',nip.value)) as property_value FROM `node-instance` as ni LEFT JOIN `node-instance-property` as nip on ni.node_instance_id=nip.node_instance_id WHERE `ni`.`node_id` = '" . $instanceNodeId . "' AND nip.node_class_property_id IN(" . $propIds . ")";
        $res = $this->MySQLiconn->query($sql);
        $crArr = $res->fetch_assoc();
        $propertyArr = explode(",", $crArr['property_value']);

        $propArr = array();
        foreach($propertyArr as $key=>$val){
            $temp = explode("~#~", $val, 2);
            $propArr[$temp[0]] = $temp[1];
        }
        return $propArr;
    }

    /**
     * For save course production instance data
     * @param $tst_msg
     * @return string
     */
    public function saveCourseProduction_old($tst_msg) {

        /* For Course Class Inatnace */
        if($tst_msg->saveType == 'D')
            $status                 = 0;
        else
            $status                 = 1;

        /* For Insert Course Class Inatnace */
        $course_node_class_id       = COURSE_CLASS_ID;
        $course_node_id             = $this->createNode();
        $sql                        = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$course_node_class_id','$course_node_id','2','$course_node_id','0','0','$status') ";
        $this->MySQLiconn->query($sql);
        $course_instance_id         = $this->MySQLiconn->insert_id;

        /* For Insert Course Class Inatnace Property */
        $course_template_node_id    = $this->createNode();
        $course_title_node_id       = $this->createNode();
        $course_description_node_id = $this->createNode();
        $course_objective_node_id   = $this->createNode();
        $course_timestamp_node_id   = $this->createNode();
        $course_created_by_node_id  = $this->createNode();
        $course_utimestamp_node_id  = $this->createNode();

        $course_template_value      = $tst_msg->class_nid;
        $course_title_value         = $tst_msg->course_title;
        $course_description_value   = $tst_msg->course_description;
        $course_objective_value     = $tst_msg->course_objective;
        $course_timestamp_value     = date('Y-m-d h:i:s');
        $course_created_by_value    = $tst_msg->created_by;
        $course_utimestamp_value    = date('Y-m-d h:i:s');

        $sql                        = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                        . " ('$course_instance_id','".COURSE_TEMP_ID."','$course_template_node_id','2','$course_template_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_TITLE_ID."','$course_title_node_id','2','$course_title_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_DESC_ID."','$course_description_node_id','2','$course_description_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_OBJ_ID."','$course_objective_node_id','2','$course_objective_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_TIME_ID."','$course_timestamp_node_id','2','$course_timestamp_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_CREATED_ID."','$course_created_by_node_id','2','$course_created_by_value','0','0'), "
                                        . " ('$course_instance_id','".COURSE_UPDATE_TIME_ID."','$course_utimestamp_node_id','2','$course_utimestamp_value','0','0');";
        $this->MySQLiconn->query($sql);

        /* For Create Production Class Blank Inatnace Without Instance Property */
         $sql                        = "SELECT `node_class_id` FROM `node-class` WHERE `node_id`= ".$tst_msg->class_nid;
        $res                        = $this->MySQLiconn->query($sql);
        $resArr                     = $res->fetch_assoc();
        $node_class_id              = intval($resArr['node_class_id']);
        $production_nid_val         = $this->createNode();
        $sql                        = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$production_nid_val','2','$production_nid_val','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $production_id              = $this->MySQLiconn->insert_id;

        /* Temporary Code Remove AFter Some time */
        /* Start */
        $d_class_id        = DIALOGUE_CLASS_ID;
        $d_node_id         = $this->createNode();
        $sql = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$d_class_id','$d_node_id','2','$d_node_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $d_instance_id     = $this->MySQLiconn->insert_id;

        $sql                        = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                        . " ('$d_instance_id','".DIALOGUE_TITLE_ID."','".$this->createNode()."','2','".$tst_msg->production_title."','0','0'), "
                                        . " ('$d_instance_id','".DIALOGUE_ADMIN_ID."','".$this->createNode()."','2','$course_created_by_value','0','0'), "
                                        . " ('$d_instance_id','".DIALOGUE_TIMESTAMP_ID."','".$this->createNode()."','2','$course_timestamp_value','0','0'), "
                                        . " ('$d_instance_id','".DIALOGUE_UPDATED_TIMESTAMP_ID."','".$this->createNode()."','2','$course_timestamp_value','0','0')";
        $this->createXYRelation($course_node_id, $d_node_id);
        $this->MySQLiconn->query($sql);

        $s_class_id        = STATEMENT_CLASS_ID;
        $s_node_id         = $this->createNode();
        $sql               = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$s_class_id','$s_node_id','2','$s_node_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $s_instance_id     = $this->MySQLiconn->insert_id;

        $sql                        = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                        . " ('$s_instance_id','841','".$this->createNode()."','2','$course_created_by_value','0','0'), "
                                        . " ('$s_instance_id','842','".$this->createNode()."','2','statement','0','0'), "
                                        . " ('$s_instance_id','843','".$this->createNode()."','2','hi arvind','0','0'), "
                                        . " ('$s_instance_id','844','".$this->createNode()."','2','".time()."','0','0'), "
                                        . " ('$s_instance_id','6790','".$this->createNode()."','2','0','0','0')";
        $this->MySQLiconn->query($sql);
        $this->createXYRelation($d_node_id, $s_node_id);
        /* End */

        /* For Production Details Class Inatnace */
        /* For Insert Production Details Class Inatnace */
        $production_details_class_id        = PRODUCTION_DETAILS_CLASS_ID;
        $production_details_node_id         = $this->createNode();
        $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$production_details_class_id','$production_details_node_id','2','$production_details_node_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $production_details_instance_id     = $this->MySQLiconn->insert_id;

        /* For Insert Production Details Class Inatnace Property */
        $production_name_node_id            = $this->createNode();
        $production_nid_node_id             = $this->createNode();
        $production_active_series_node_id   = $this->createNode();
        $production_active_segment_node_id  = $this->createNode();

        $production_name_val                = $tst_msg->production_title;

        $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_NAME_PID."','$production_name_node_id','2','$production_name_val','0','0'), "
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_ID_PID."','$production_nid_node_id','2','$production_nid_val','0','0'), "
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_SERIES_PID."','$production_active_series_node_id','2','-','0','0'), "
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_SEGMENT_PID."','$production_active_segment_node_id','2','-','0','0');";
        $this->MySQLiconn->query($sql);
        // For Insert Relation Between Course And Production Details Class Inatnace
        $this->createXYRelation($course_node_id, $production_details_node_id);

        // For Individual History Class Instance
        $individual_class_id                = INDIVIDUAL_HISTORY_CLASS_ID;

        $individual_actor_array             = array();
        $individual_time_val                = time();
        $individual_h_nid                   = array();
        foreach($tst_msg->roles as $key => $value)
        {
            /* For Insert Individual History Class Inatnace */
            $individual_node_id                 = $this->createNode();
            $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$individual_class_id','$individual_node_id','2','$individual_node_id','0','0','1') ";
            $this->MySQLiconn->query($sql);
            $individual_history_instance_id     = $this->MySQLiconn->insert_id;

            /* For Insert Individual History Class Inatnace Property */
            $individual_actor_array[]           = $value->user_id;
            $individual_actor_val               = $value->user_id;
            $individual_status_val              = 1;
            $individual_role_val                = $value->role_id;

            $individual_actor_nid               = $this->createNode();
            $individual_time_nid                = $this->createNode();
            $individual_status_nid              = $this->createNode();
            $individual_role_nid                = $this->createNode();

            $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ACTORID_PROP_ID."','$individual_actor_nid','2','$individual_actor_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_TIMESTAMP_PROP_ID."','$individual_time_nid','2','$individual_time_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_STATUS_PROP_ID."','$individual_status_nid','2','$individual_status_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ROLE_PROP_ID."','$individual_role_nid','2','$individual_role_val','0','0')";
            $this->MySQLiconn->query($sql);
            // For Insert Relation Between Production Details And Individual History Class Inatnace
            $this->createXYRelation($production_details_node_id, $individual_node_id);
            $individual_h_nid[]                 = $individual_node_id;
        }

        $this->addParticipantsToDialogue($course_node_id, $individual_actor_array, $individual_time_val);

        /* Temporary Code Remove AFter Some time */
        foreach($individual_h_nid as $k => $v)
        {
            $this->createXYRelation($d_node_id, $v);
        }


        return array('course_node_id' => $course_node_id, 'course_instance_id' => $course_instance_id, 'course_timestamp_value' => $course_timestamp_value, 'production_details_node_id' => $production_details_node_id, 'production_id' => $production_id, 'production_name' => $production_name_val, 'receiver_ids' => $individual_actor_array, 'sender_id' => $course_created_by_value, 'dialogue_node_id' => '', 'statement_node_id' => '');
    }

    /**
     * For save course production instance data
     * @param $tst_msg
     * @return string
     */
    public function saveCourseProduction($tst_msg) {

        /* For Course Class Inatnace */
        if($tst_msg->saveType == 'D')
            $status                 = 0;
        else
            $status                 = 1;

        /* For Insert Course Class Inatnace */
        $course_node_class_id       = COURSE_CLASS_ID;
        $course_node_id             = $this->createNode();
        $sql                        = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$course_node_class_id','$course_node_id','2','$course_node_id','0','0','$status') ";
        $this->MySQLiconn->query($sql);
        $course_instance_id         = $this->MySQLiconn->insert_id;

        /* For Insert Course Class Inatnace Property */
        //$course_template_node_id    = $this->createNode();
        $course_title_node_id       = $this->createNode();
        $course_timestamp_node_id   = $this->createNode();
        $course_created_by_node_id  = $this->createNode();
        $course_utimestamp_node_id  = $this->createNode();

        //$course_template_value      = $tst_msg->class_nid;
        $course_title_value         = addslashes($tst_msg->course_title);
        $course_description_value   = addslashes($tst_msg->course_description);
        $course_objective_value     = addslashes($tst_msg->course_objective);
        $course_timestamp_value     = date('Y-m-d H:i:s');
        $course_created_by_value    = $tst_msg->created_by;
        $course_utimestamp_value    = date('Y-m-d H:i:s');

        $sql                        = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES";
                                        //. " ('$course_instance_id','".COURSE_TEMP_ID."','$course_template_node_id','2','$course_template_value','0','0'), "
        $sql                        .= " ('$course_instance_id','".COURSE_TITLE_ID."','$course_title_node_id','2','$course_title_value','0','0'), ";
        if(trim($course_description_value) != '')
        {
            $course_description_node_id = $this->createNode();
            $sql                        .= " ('$course_instance_id','".COURSE_DESC_ID."','$course_description_node_id','2','$course_description_value','0','0'), ";
        }

        if(trim($course_objective_value) != '')
        {
            $course_objective_node_id   = $this->createNode();
            $sql                        .= " ('$course_instance_id','".COURSE_OBJ_ID."','$course_objective_node_id','2','$course_objective_value','0','0'), ";
        }


        $sql                        .= " ('$course_instance_id','".COURSE_TIME_ID."','$course_timestamp_node_id','2','$course_timestamp_value','0','0'), ";
        $sql                        .= " ('$course_instance_id','".COURSE_CREATED_ID."','$course_created_by_node_id','2','$course_created_by_value','0','0'), ";
        $sql                        .= " ('$course_instance_id','".COURSE_UPDATE_TIME_ID."','$course_utimestamp_node_id','2','$course_utimestamp_value','0','0');";
        $this->MySQLiconn->query($sql);

        /* For Production Details Class Inatnace */
        /* For Insert Production Details Class Inatnace */
        $production_details_class_id        = PRODUCTION_DETAILS_CLASS_ID;
        $production_details_node_id         = $this->createNode();
        $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$production_details_class_id','$production_details_node_id','2','$production_details_node_id','0','0','1') ";
        $this->MySQLiconn->query($sql);
        $production_details_instance_id     = $this->MySQLiconn->insert_id;

        /* For Insert Production Details Class Inatnace Property */
        $production_name_node_id            = $this->createNode();
        $production_nid_node_id             = $this->createNode();
        $production_active_series_node_id   = $this->createNode();
        $production_active_segment_node_id  = $this->createNode();

        $production_name_val                = $tst_msg->production_title;
        $production_nid_val                 = $tst_msg->production_nid;
        $production_name_val1                = addslashes($production_name_val);

        $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_NAME_PID."','$production_name_node_id','2','$production_name_val1','0','0'), "
                                            . " ('$production_details_instance_id','".PRODUCTION_DETAILS_ID_PID."','$production_nid_node_id','2','$production_nid_val','0','0') ";
        $this->MySQLiconn->query($sql);
        // For Insert Relation Between Course And Production Details Class Inatnace
        $this->createXYRelation($course_node_id, $production_details_node_id);

        // For Individual History Class Instance
        $individual_class_id                = INDIVIDUAL_HISTORY_CLASS_ID;

        $individual_actor_array             = array();
        $individual_time_val                = time();
        $individual_h_nid                   = array();
        foreach($tst_msg->roles as $key => $value)
        {
            /* For Insert Individual History Class Inatnace */
            $individual_node_id                 = $this->createNode();
            $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$individual_class_id','$individual_node_id','2','$individual_node_id','0','0','1') ";
            $this->MySQLiconn->query($sql);
            $individual_history_instance_id     = $this->MySQLiconn->insert_id;

            /* For Insert Individual History Class Inatnace Property */
            $individual_actor_array[]           = $value->user_id;
            $individual_actor_val               = $value->user_id;
            $individual_status_val              = 1;
            $individual_role_val                = $value->role_id;

            $individual_actor_nid               = $this->createNode();
            $individual_time_nid                = $this->createNode();
            $individual_status_nid              = $this->createNode();
            $individual_role_nid                = $this->createNode();

            $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ACTORID_PROP_ID."','$individual_actor_nid','2','$individual_actor_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_TIMESTAMP_PROP_ID."','$individual_time_nid','2','$individual_time_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_STATUS_PROP_ID."','$individual_status_nid','2','$individual_status_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ROLE_PROP_ID."','$individual_role_nid','2','$individual_role_val','0','0')";
            $this->MySQLiconn->query($sql);
            // For Insert Relation Between Production Details And Individual History Class Inatnace
            $this->createXYRelation($production_details_node_id, $individual_node_id);
            $individual_h_nid[]                 = $individual_node_id;
        }

        $this->addParticipantsToDialogue($course_node_id, $individual_actor_array, $individual_time_val);

        return array('course_node_id' => $course_node_id,
            'course_instance_id' => $course_instance_id,
            'course_timestamp_value' => $course_timestamp_value,
            'production_details_node_id' => $production_details_node_id,
            'production_id' => $production_nid_val,
            'production_name' => $production_name_val,
            'receiver_ids' => $individual_actor_array,
            'sender_id' => $course_created_by_value,
            'dialogue_node_id' => '',
            'statement_node_id' => '');
    }

    /**
     * Created By: Kunal
     * Date: 15-May-2017
     * Function to add System Generated Messages in Statement class
     * @param $dialogueNodeId
     * @param $actorId
     * @param $message
     * @param $timestamp
     * @return string
     */
    public function getActorFullNames($user_node_id, $flag=0)
    {
        if($flag == 0){
             $sql = "SELECT ni.node_id,GROUP_CONCAT(nip.value SEPARATOR ' ') as fullname FROM `node-instance` as ni LEFT JOIN `node-instance-property` as nip on ni.node_instance_id = nip.node_instance_id WHERE `ni`.`node_id` = '".$user_node_id."' AND nip.node_class_property_id in('".INDIVIDUAL_FIRST_NAME."','".INDIVIDUAL_LAST_NAME."')";
            $res = $this->MySQLiconn->query($sql);
            $crArr = $res->fetch_assoc();
            return $crArr['fullname'];
        }else{
//            echo $sql = "SELECT ni.node_id, nip.value as fullname, nip.node_class_property_id
//                FROM `node-instance` as ni
//                LEFT JOIN `node-instance-property` as nip on ni.node_instance_id = nip.node_instance_id
//                WHERE `ni`.`node_id` IN (".$user_node_id.") AND nip.node_class_property_id IN
//                ('".INDIVIDUAL_FIRST_NAME."','".INDIVIDUAL_LAST_NAME."','".INDIVIDUAL_PROFILE_IMAGE."')";
             $sql = "SELECT ni.node_id, nip.value as fullname, nip.node_class_property_id, nip1.value as profile_image
                FROM `node-instance` as ni
                LEFT JOIN `node-instance-property` as nip on ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id IN ('".INDIVIDUAL_FIRST_NAME."','".INDIVIDUAL_LAST_NAME."')
                LEFT JOIN `node-instance-property` as nip1 on ni.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id = ('".INDIVIDUAL_PROFILE_IMAGE."')
                WHERE `ni`.`node_id` IN (".$user_node_id.")";
            $res = $this->MySQLiconn->query($sql);
            $property_name = '';
            $urArr = array();
            while($crArr = $res->fetch_assoc()){
                if($crArr['node_class_property_id'] == INDIVIDUAL_FIRST_NAME){
                    $property_name = 'first_name';
                }elseif($crArr['node_class_property_id'] == INDIVIDUAL_LAST_NAME){
                    $property_name = 'last_name';
                }elseif($crArr['node_class_property_id'] == INDIVIDUAL_PROFILE_IMAGE){
                    $property_name = 'profile_image';
                }
                $urArr[$crArr['node_id']][$property_name] = $crArr['fullname'];
                $urArr[$crArr['node_id']]['profile_image'] = $crArr['profile_image'];
            }
            return $urArr;
        }
    }

    /**
     * Addedy by : Gaurav
     * @param type $dialogueNodeId
     * @return type
     */
    public function getCourseName($dialogueNodeId) {

         $sql = "SELECT `nip`.`value` AS `course_title` FROM `node-x-y-relation` AS `nxy` INNER JOIN `node-instance` AS `ni` ON ni.node_id = nxy.node_y_id INNER JOIN `node-instance-property` AS `nip` ON ni.node_instance_id = nip.node_instance_id
                WHERE `nxy`.`node_x_id` = '" . trim($dialogueNodeId) . "'
                AND ni.node_class_id = " . COURSE_CLASS_ID . "
                AND nip.node_class_property_id = '" . COURSE_TITLE_ID . "'";
        $courseTitle = '';
        if ($res = $this->MySQLiconn->query($sql)) {
              $crArr = $res->fetch_assoc();
              $courseTitle = $crArr['course_title'];
        }
        return $courseTitle;
    }

    /**
     * For update course production instance data
     * @param $tst_msg
     * @return string
     */
    public function updateCourseProduction($tst_msg) {

        $course_node_id                         = $this->getNodeId('node-instance', 'node_instance_id', $tst_msg->course_instance_id);
        $course_instance_id                     = $tst_msg->course_instance_id;
        $course_timestamp_value                 = date('Y-m-d H:i:s');
        if(isset($tst_msg->production_instance_id))
        {
            /* For Course Class Inatnace */
            if($tst_msg->saveType == 'D')
                $status                         = 0;
            else
                $status                         = 1;

            /* For Update Course Class Inatnace Property */
            $sql                                = "UPDATE `node-instance` SET status = '".$status."' WHERE node_instance_id = ".$course_instance_id;
            $this->MySQLiconn->query($sql);

            $updatePropertiesId                 = array($tst_msg->course_title_id,$tst_msg->course_description_id,$tst_msg->course_objective_id,COURSE_UPDATE_TIME_ID);
            $updatePropertiesVal                = array($tst_msg->course_title,$tst_msg->course_description,$tst_msg->course_objective,$course_timestamp_value);

            foreach($updatePropertiesId as $propertyKey => $propertyId)
            {
                if(trim($updatePropertiesVal[$propertyKey]) != '')
                {
                    $sql                        = "UPDATE `node-instance-property` SET value = '".$updatePropertiesVal[$propertyKey]."' WHERE node_instance_id = ".$course_instance_id." AND node_class_property_id = ".$propertyId;
                    $this->MySQLiconn->query($sql);
                }
            }

            /* For Update Production Details Class Inatnace */
            $production_details_node_id         = $this->getNodeId('node-instance', 'node_instance_id', $tst_msg->production_instance_id);
            $production_id                      = $this->getProductionNID($tst_msg->production_instance_id);
            $production_details_instance_id     = $tst_msg->production_instance_id;
            $production_name_id                 = $tst_msg->production_title_id;
            $production_name_val                = $tst_msg->production_title;
            $sql                                = "UPDATE `node-instance-property` SET value = '".$production_name_val."' WHERE node_instance_id = ".$production_details_instance_id." AND node_class_property_id = ".$production_name_id;
            $this->MySQLiconn->query($sql);

            // For Individual History Class Instance
            $this->removeIndividualRelation($production_details_node_id);
        }
        else
        {
            /* For Insert Production Details Class Inatnace */
            $production_details_class_id        = PRODUCTION_DETAILS_CLASS_ID;
            $production_details_node_id         = $this->createNode();
            $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$production_details_class_id','$production_details_node_id','2','$production_details_node_id','0','0','1') ";
            $this->MySQLiconn->query($sql);
            $production_details_instance_id     = $this->MySQLiconn->insert_id;

            /* For Insert Production Details Class Inatnace Property */
            $production_name_node_id            = $this->createNode();
            $production_nid_node_id             = $this->createNode();
            $production_active_series_node_id   = $this->createNode();
            $production_active_segment_node_id  = $this->createNode();

            $production_name_val                = $tst_msg->production_title;
            $production_nid_val                 = $tst_msg->production_nid;
            $production_id                      = $production_nid_val;

            $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                . " ('$production_details_instance_id','".PRODUCTION_DETAILS_NAME_PID."','$production_name_node_id','2','$production_name_val','0','0'), "
                                                . " ('$production_details_instance_id','".PRODUCTION_DETAILS_ID_PID."','$production_nid_node_id','2','$production_nid_val','0','0') ";
            $this->MySQLiconn->query($sql);
            // For Insert Relation Between Course And Production Details Class Inatnace
            $this->createXYRelation($course_node_id, $production_details_node_id);
        }

        $individual_class_id                = INDIVIDUAL_HISTORY_CLASS_ID;

        $individual_actor_array             = array();
        $individual_time_val                = time();
        $individual_h_nid                   = array();
        foreach($tst_msg->roles as $key => $value)
        {
            /* For Insert Individual History Class Inatnace */
            $individual_node_id                 = $this->createNode();
            $sql                                = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$individual_class_id','$individual_node_id','2','$individual_node_id','0','0','1') ";
            $this->MySQLiconn->query($sql);
            $individual_history_instance_id     = $this->MySQLiconn->insert_id;

            /* For Insert Individual History Class Inatnace Property */
            $individual_actor_array[]           = $value->user_id;
            $individual_actor_val               = $value->user_id;
            $individual_status_val              = 1;
            $individual_role_val                = $value->role_id;

            $individual_actor_nid               = $this->createNode();
            $individual_time_nid                = $this->createNode();
            $individual_status_nid              = $this->createNode();
            $individual_role_nid                = $this->createNode();

            $sql                                = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ACTORID_PROP_ID."','$individual_actor_nid','2','$individual_actor_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_TIMESTAMP_PROP_ID."','$individual_time_nid','2','$individual_time_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_STATUS_PROP_ID."','$individual_status_nid','2','$individual_status_val','0','0'), "
                                                . " ('$individual_history_instance_id','".INDIVIDUAL_ROLE_PROP_ID."','$individual_role_nid','2','$individual_role_val','0','0')";
            $this->MySQLiconn->query($sql);
            // For Insert Relation Between Production Details And Individual History Class Inatnace
            $this->createXYRelation($production_details_node_id, $individual_node_id);
            $individual_h_nid[]                 = $individual_node_id;
        }

        if(!isset($tst_msg->production_instance_id))
        {
          $this->addParticipantsToDialogue($course_node_id, $individual_actor_array, $individual_time_val);
        }

        return array(
                        'course_node_id'                => $course_node_id,
                        'course_instance_id'            => $course_instance_id,
                        'course_timestamp_value'        => $course_timestamp_value,
                        'production_details_node_id'    => $production_details_node_id,
                        'production_id'                 => $production_id,
                        'production_name'               => $production_name_val,
                        'receiver_ids'                  => $individual_actor_array,
                        'sender_id'                     => $tst_msg->created_by,
                        'dialogue_node_id' =>           '',
                        'statement_node_id' =>          ''
                    );
    }

    public function getNodeId($table, $column, $value, $returnColumn = "") {

         $sql                        = "SELECT * FROM `".$table."` WHERE ".$column." = '".$value."'";
        $res                        = $this->MySQLiconn->query($sql);
        $dataArray                  = $res->fetch_assoc();
        if (trim($returnColumn) != '')
            return $dataArray[$returnColumn];
        else
            return intval($dataArray['node_id']);
    }

    public function getProductionNID($production_instance_id) {

         $sql                   = "SELECT value FROM `node-instance-property` WHERE node_instance_id = ".$production_instance_id." AND node_class_property_id = ".PRODUCTION_DETAILS_ID_PID;
        $res                   = $this->MySQLiconn->query($sql);
        $dataArray             = $res->fetch_assoc();
        return $dataArray['value'];
    }

    public function removeIndividualRelation($production_details_node_id)
    {
         $sql = "SELECT nxyr.`node_x_y_relation_id` FROM `node-x-y-relation` AS nxyr INNER JOIN `node-instance` AS ni ON nxyr.`node_x_id` = ni.`node_id` and ni.`node_class_id` = ".INDIVIDUAL_HISTORY_CLASS_ID." WHERE nxyr.`node_y_id` = ".$production_details_node_id;
        $res                   = $this->MySQLiconn->query($sql);
        while ($crArr = $res->fetch_assoc()) {
            $sql = "DELETE FROM `node-x-y-relation` WHERE node_x_y_relation_id = ".$crArr['node_x_y_relation_id'];
            $this->MySQLiconn->query($sql);
        }
    }

    /*
     * Awdhesh Soni
     * function here to get list of participant in all the dialogue with single course
     *
     *      */

    public function getAllDialogueInstancesOfCourseClass($node_id){
         $sql = "SELECT `ni`.`status` AS `status`, `nip1`.`value` AS `individual_node_id`, `nip3`.`value` AS `individual_history_status`  "
                . "FROM `node-x-y-relation` AS `nxyr` INNER JOIN `node-instance` AS `ni` ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = ".DIALOGUE_CLASS_ID."
                    INNER JOIN `node-x-y-relation` AS `nxyr1` ON `nxyr1`.`node_y_id` = `nxyr`.`node_x_id`
                    INNER JOIN `node-instance` AS `ni1` ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = ".INDIVIDUAL_HISTORY_CLASS_ID."
        INNER JOIN `node-instance-property` AS `nip1` ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id=".INDIVIDUAL_ACTORID_PROP_ID."
        INNER JOIN `node-instance-property` AS `nip3` ON ni1.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id=".INDIVIDUAL_STATUS_PROP_ID." AND nip3.value=1
        INNER JOIN `node-instance` AS `ni2` ON `ni2`.`node_id` = `nip1`.`value`
        WHERE `nxyr`.`node_y_id` = ".$node_id." ";

        $dialogue_res    = $this->MySQLiconn->query($sql);
        while ($crArr = $dialogue_res->fetch_assoc()) {
            $fetchRecord[] = $crArr;
        }
        foreach ($fetchRecord as $value) {
                $node_instance_id[] = $value['individual_node_id'];
        }
        return implode(",",array_unique($node_instance_id));
    }

    /**
     * Fetch current controller from production json
     * @param $tst_msg
     * @return is_controller
     */
    public function getControllerOfProductionJson($tst_msg)
    {
        $sql = "SELECT nxyr.`node_x_id`, ni.`node_instance_id`, nip.`value` FROM `node-x-y-relation` AS `nxyr`
                INNER JOIN `node-instance` AS `ni` ON ni.`node_id` = nxyr.`node_x_id` AND ni.`node_class_id` = ".PRODUCTION_JSON_CLASS_ID."
                INNER JOIN `node-instance-property` AS `nip` ON ni.node_instance_id = nip.node_instance_id
                WHERE `nxyr`.`node_y_id` = ".$tst_msg->production_nid;

        $res                                                = $this->MySQLiconn->query($sql);
        $productionJSON                                     = $res->fetch_assoc();
        $production_json                                    = json_decode(html_entity_decode($productionJSON['value']),true);
        $permissionWithRolesArray                           = $this->getActiveRolesFromProductionJsonArray($production_json);
        $operationKey                                       = $this->getFirstOperationKey($production_json);

        $controllerID                                       = $production_json[$operationKey]['actions']['controllerID'];

        $is_controller                                      = '';
        foreach($tst_msg->roles as $key => $value)
        {
            $individual_actor_array[]           = $value->user_id;
            $individual_actor_val               = $value->user_id;
            $individual_status_val              = 1;
            $individual_role_val                = $value->role_id;
            if(intval($controllerID) == intval($value->role_id))
            {
                $is_controller                              = $value->user_id;
            }
        }

        return $is_controller;
    }

    /**
     * For get actives roles from production json
     * @param $production_json
     * @return roleArrayWirhPermission
     */
    public function getActiveRolesFromProductionJsonArray($production_json)
    {
        $roleArrayWirhPermission                                 = array();
        foreach($production_json as $key => $value)
        {
            @$roleArrayWirhPermission                             = $this->getPermissionArray($production_json[$key]['nodes'],$roleArrayWirhPermission,$key);
        }
        return @$roleArrayWirhPermission;
    }

    /**
     * For get access list by roles
     * @param $permissionData,$roleArrayWirhPermission,$operationName
     * @return roleArrayWirhPermission
     */
    public function getPermissionArray($permissionData,$roleArrayWirhPermission,$operationName)
    {
        foreach($permissionData as $key => $value)
        {
            if(isset($permissionData[$key]['roles']) && is_array($permissionData[$key]['roles']))
            {
                foreach($permissionData[$key]['roles'] as $rKey => $rVal)
                {
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['roleName']   = $rVal['roleName'];
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['roleID']     = $rVal['roleID'];
                    if($rVal['view'])
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['view']       = $rVal['view'];
                    if($rVal['edit'])
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['edit']       = $rVal['edit'];
                }
            }

            if(isset($permissionData[$key]['nodes']) && is_array($permissionData[$key]['nodes']))
            {
                $roleArrayWirhPermission      = $this->getPermissionArray($permissionData[$key]['nodes'],$roleArrayWirhPermission,$operationName);
            }
        }

        return $roleArrayWirhPermission;
    }

    /**
     * fetch first key operation from production_json
     * @param $production_json
     * @return key
     */
    public function getFirstOperationKey($production_json)
    {
        $keysArray              = array_keys($production_json);
        $temp                   = array();
        $other                  = '';
        foreach($keysArray as $k => $v)
        {
            $temp[]             = explode("_",$v)[0];
            $other              = explode("_",$v)[1];
        }
        sort($temp);
        return current($temp).'_'.$other;
    }

    /**
     * fetch production data list user wise
     * @param $tst_msg
     * @return array
     */
    public function getProductionDataList($tst_msg)
    {

        $sql = "SELECT nxyr.`node_y_id`, ni.`node_instance_id` FROM `node-x-y-relation` AS `nxyr`
                INNER JOIN `node-instance` AS `ni` ON ni.`node_id` = nxyr.`node_y_id` AND ni.`node_class_id` = ".COURSE_CLASS_ID."
                WHERE `nxyr`.`node_x_id` = ".$tst_msg->production_node_id;

        $res                                                = $this->MySQLiconn->query($sql);
        $course                                             = $res->fetch_assoc();
        $course_node_id                                     = $course['node_y_id'];
        $course_instance_id                                 = $course['node_instance_id'];

        $courseProductionArray                              =   $this->getCourseProductionDetails($course_instance_id,$course_node_id,$tst_msg->production_node_id);

        $sql = "SELECT nxyr.`node_x_id`, ni.`node_instance_id`, nip.`value` FROM `node-x-y-relation` AS `nxyr`
                INNER JOIN `node-instance` AS `ni` ON ni.`node_id` = nxyr.`node_x_id` AND ni.`node_class_id` = ".PRODUCTION_JSON_CLASS_ID."
                INNER JOIN `node-instance-property` AS `nip` ON ni.node_instance_id = nip.node_instance_id
                WHERE `nxyr`.`node_y_id` = ".$courseProductionArray['production_details_nid'];

        $res                                                = $this->MySQLiconn->query($sql);
        $productionJSON                                     = $res->fetch_assoc();
        $production_json                                    = json_decode(html_entity_decode($productionJSON['value']),true);
        $permissionWithRolesArray                           = $this->getActiveRolesFromProductionJsonArray($production_json);

        $sql = "SELECT nxyr.`node_x_id`, ni.`node_instance_id` FROM `node-x-y-relation` AS `nxyr`
                INNER JOIN `node-instance` AS `ni` ON ni.`node_id` = nxyr.`node_x_id` AND ni.`node_class_id` = ".PRODUCTION_DATA_CLASS_ID."
                WHERE `nxyr`.`node_y_id` = ".$tst_msg->production_node_id;

        $res                                                = $this->MySQLiconn->query($sql);
        $tempDataList = array();
        while ($crArr = $res->fetch_assoc()) {
            $tempDataList[] =  $crArr['node_x_id'];
        }

        $permissionProductionArray                          = $this->getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$production_json,$permissionWithRolesArray,$tempDataList);

        $newProdDataArry = array();
        foreach($permissionProductionArray as $userId => $dataArray)
        {
            rsort($dataArray);
            if(intval($userId) != intval($tst_msg->userID))
            $newProdDataArry[$userId] = $dataArray;
        }
        return $newProdDataArry;

    }

    /**
        * Fetch course, production details and user details from course and production details instance
        * @param post
        * @return Array
    */
    public function getCourseProductionDetails($course_instance_id,$course_node_id,$production_node_id)
    {
        $course                                             =   array();
        /* Fetch Information About Production Details And Instance With Users Which Instance Actually Update */
        $fetchRecord                                        =   $this->getAllProductionDetailsInstancesOfCourseClass($course_node_id);
        $productionDeatils                                  =   array();
        foreach ($fetchRecord as $key => $value)
        {
            if($production_node_id == $value['production_details_node_id'])
            {
                $productionDeatils['production_details_instance_id']                                                           = $value['production_details_instance_id'];
                $productionDeatils['production_details_node_id']                                                               = $value['production_details_node_id'];
                $productionDeatils['production_name']                                                                          = $value['production_name'];
                $productionDeatils['production_nid']                                                                           = $value['production_id'];
                $productionDeatils['users'][$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))]           = $value['user_name'];
                $productionDeatils['users'][$value['user_id']]['user_id']                                                      = $value['user_id'];
                $productionDeatils['users'][$value['user_id']]['email']                                                        = $value['email'];
                $productionDeatils['users'][$value['user_id']]['role_id']                                                      = $value['role_id'];
            }
        }

        /* Send Course, Production, Users, Class And Instance Details */
        $course['course_instance_id']                                   =   $course_instance_id;
        $course['course_node_id']                                       =   $course_node_id;
        $course['production_details_instance_id']                       =   $productionDeatils['production_details_instance_id'];
        $course['production_details_node_id']                           =   $productionDeatils['production_details_node_id'];
        $course['production_details_name']                              =   $productionDeatils['production_name'];
        $course['production_details_nid']                               =   $productionDeatils['production_nid'];
        $course['production_details_user']                              =   $productionDeatils['users'];

        return $course;
    }

    /**
        * Function use here to fetch all production of selected course instance id
        * @param type $courseInstanceNodeId
        * @return resultAry
    */
    public function getAllProductionDetailsInstancesOfCourseClass($courseInstanceNodeId)
    {

        $sql    = "SELECT `nxyr`.`node_x_id` AS production_details_node_id, `ni`.`status` AS status, `ni`.`node_instance_id` AS production_details_instance_id,
        `ni`.`node_id` AS production_details_node_id, `nip`.`node_class_property_id` AS production_name_pid, `nip`.`value` AS production_name,
        `nip2`.`node_class_property_id` AS production_id_pid, `nip2`.`value` AS production_id, `nip1`.`value` AS user_id, `nip5`.`value` AS role_id,
        `nip4`.`value` AS user_name, `ncp`.`caption` AS caption, `nip3`.`value` AS email
        FROM `node-x-y-relation` AS `nxyr`
        INNER JOIN `node-instance` AS `ni` ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = ".PRODUCTION_DETAILS_CLASS_ID."
        INNER JOIN `node-instance-property` AS `nip` ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".PRODUCTION_DETAILS_NAME_PID."
        INNER JOIN `node-instance-property` AS `nip2` ON ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".PRODUCTION_DETAILS_ID_PID."
        INNER JOIN `node-x-y-relation` AS `nxyr1` ON nxyr1.node_y_id = nxyr.node_x_id
        INNER JOIN `node-instance` AS `ni1` ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = ".INDIVIDUAL_HISTORY_CLASS_ID."
        INNER JOIN `node-instance-property` AS `nip1` ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id=".INDIVIDUAL_ACTORID_PROP_ID."
        INNER JOIN `node-instance-property` AS `nip5` ON ni1.node_instance_id = nip5.node_instance_id AND nip5.node_class_property_id=".INDIVIDUAL_ROLE_PROP_ID."
        INNER JOIN `node-instance` AS `ni2` ON ni2.node_id = nip1.value
        INNER JOIN `node-instance-property` AS `nip4` ON ni2.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id IN (".INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME.")
        INNER JOIN `node-class-property` AS `ncp` ON ncp.node_class_property_id = nip4.node_class_property_id
        INNER JOIN `node-x-y-relation` AS `nxyr2` ON nxyr2.node_y_id = ni2.node_id
        INNER JOIN `node-instance` AS `ni3` ON ni3.node_id = nxyr2.node_x_id AND ni3.node_class_id = ".ACCOUNT_CLASS_ID."
        INNER JOIN `node-instance-property` AS `nip3` ON ni3.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = ".INDIVIDUAL_EMAIL_ID."
        WHERE `nxyr`.node_y_id = $courseInstanceNodeId";

        $res   = $this->MySQLiconn->query($sql);

        $temp = array();
        while ($value = $res->fetch_assoc())
        {
            $temp[] = $value;
        }

        return $temp;
    }

    /**
        * Fetch permission, operationKey, manageInstance, manageInstanceValue, instance_id, class_id, roleId from course and production details class
        * @param $courseProductionArray,$classProductionArray,$production_data_node_id
        * @return sendArray
    */
    public function getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$production_json,$permissionWithRolesArray,$productionDataList)
    {
        $userArray                                          = array();
        foreach($productionDataList as $k => $production_data_node_id)
        {
            $production_data                                = $this->getInstanceListOfParticulerClass($production_data_node_id, 'node', 'node_instance_id');
            $production_data_instance_id                    = array_keys($production_data)[0];
            $active_production                              = $production_data[$production_data_instance_id]['Active Production'];
            $active_operation                               = $production_data[$production_data_instance_id]['Active Operation'];

            foreach($courseProductionArray['production_details_user'] as $userId => $userData)
            {
                $roleId                                             = $userData['role_id'];
                if(intval($courseProductionArray['production_details_nid']) == intval($active_production))
                {
                    $permission                                 = $this->getPermissionFromKey($permissionWithRolesArray,$roleId,$active_operation);

                    if(strtolower($permission) == 'view' || strtolower($permission) == 'edit' || strtolower($permission) == 'both')
                    {
                        $userArray[$userId][$production_data_node_id] = $production_data_node_id;
                    }
                }
                else
                {

                }

            }

        }

        return $userArray;
    }

    /**
        * Fetch perticuler instance
        * @param $primaryId, $searchOn, $keyType
        * @return Array
    */
    public function getInstanceListOfParticulerClass($primaryId, $searchOn, $keyType = "") {

        $sql    = "SELECT `ni`.`node_instance_id`,`ni`.`node_id`,`ni`.`node_class_id`,`nip`.`node_class_property_id`,`nip`.`value`,`ncp`.`caption` FROM `node-instance` AS `ni`
        INNER JOIN `node-instance-property` AS `nip` ON `ni`.`node_instance_id` = `nip`.`node_instance_id`
        INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`";

        if ($searchOn == 'class')
            $sql .= " WHERE `ni`.`node_class_id` = ".$primaryId;
        else if ($searchOn == 'node')
            $sql .= " WHERE `ni`.`node_id` = ".$primaryId;
        else if ($searchOn == 'instance')
            $sql .= " WHERE `ni`.`node_instance_id` = ".$primaryId;

        $res   = $this->MySQLiconn->query($sql);

        $tempArray = array();
        while ($value = $res->fetch_assoc())
        {
            $tempArray[] = $value;
        }

        $dataArray = array();
        $node_class_id = '';
        foreach ($tempArray as $key => $value) {
            $node_class_id = $value['node_class_id'];
            if ($keyType == 'node_instance_id') {
                if(!isset($dataArray[$value['node_instance_id']][$value['caption']]))
                    $dataArray[$value['node_instance_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_instance_id']][$value['caption']] = $dataArray[$value['node_instance_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            } else if ($keyType == 'node_id') {
                if (trim($dataArray[$value['node_id']][$value['caption']]) == '')
                    $dataArray[$value['node_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_id']][$value['caption']] = $dataArray[$value['node_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            }
            else if ($keyType == 'node_id_subclass') {
                if (trim($dataArray[$value['node_id']][$value['caption']]) == '')
                    $dataArray[$value['node_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_id']][$value['caption']] = $dataArray[$value['node_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            }

        }

        if (count($dataArray))
        {
            if($keyType == 'node_id_subclass')
            {
                $node_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id, "node_id");
                return array('class_id' => $node_id,'data' => $dataArray);
            }
            else
            {
                return $dataArray;
            }
        }
        else
            return $tempArray;
    }

    /**
     * For get permission from key of production json
     * @param $permissionWithRolesArray, $roleId, $operationKey
     * @return permission
     */
    public function getPermissionFromKey($permissionWithRolesArray,$roleId,$operationKey)
    {
        $permission                                     = '';
        if(isset($permissionWithRolesArray[$operationKey][$roleId]['view']) && isset($permissionWithRolesArray[$operationKey][$roleId]['edit']))
        {
            if($permissionWithRolesArray[$operationKey][$roleId]['view'] && $permissionWithRolesArray[$operationKey][$roleId]['edit'])
            $permission                                     = 'both';
        }
        else
        {
            if(isset($permissionWithRolesArray[$operationKey][$roleId]['view']))
            {
                if($permissionWithRolesArray[$operationKey][$roleId]['view'])
                $permission                                     = 'view';
            }
            else if(isset($permissionWithRolesArray[$operationKey][$roleId]['edit']))
            {
                if($permissionWithRolesArray[$operationKey][$roleId]['edit'])
                $permission                                     = 'edit';
            }
        }

        return $permission;
    }

    /**Added by Gaurav
     * Added on 05 July 2017
     * Get User profile pics
     * @param type $userImage
     * @param type $type
     * @return string
     */
    function getProfileUserImage($userImage = '', $type) {
        $profileImage = 0;//SOCKET_HOST_NAME . "public/img/user.png";
        switch ($type) {
            case 'thumbnail':
                $filePath = SOCKET_HOST_NAME . "public/nodeZimg/" . $userImage;
                if (trim($userImage) != '' && file_exists("public/nodeZimg/" . $userImage)) {

                    $profileImage = $filePath;
                }
                break;
            case 'guest':
                $filePath = SOCKET_HOST_NAME . "public/img/guest-user.jpg";
                $profileImage = $filePath;
                break;
        }
        return $profileImage;
    }

    // insert TimeStamp
    public function insertTimestamp()
    {
        $sql    = "SELECT `ni`.`node_instance_id` AS `node_instance_id` FROM `node-instance` as `ni`WHERE `ni`.`node_class_id` = '180'";
        $res   = $this->MySQLiconn->query($sql);
        $temp = array();$restemp = array();
        $date_value = new DateTime();
        $updateTimestampDate = $date_value->getTimestamp();
        while ($value = $res->fetch_assoc())
        {
            $node_instance_id = $value['node_instance_id'];
            $temp[] = $node_instance_id;

            /*$sql2 = "SELECT `ni`.`node_instance_id` AS `node_instance_id`,`nip`.`value` ,`nip`.`node_class_property_id`,`nip`.`node_instance_property_id` "
            . "FROM `node-instance` as `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` "
                    . "INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                    . "WHERE `ni`.`node_class_id` = '180' AND `nip`.`node_class_property_id` = '13219'  ";*/ // update query fetch data

            //$res2   = $this->MySQLiconn->query($sql2);
            //if($res2){
                /*while($value2 = $res2->fetch_assoc()){
                    $node_instance_property_id = $value2['node_instance_property_id'];
                    echo $sqlUpdate = "UPDATE `node-instance-property` SET `value` = '$updateTimestampDate' WHERE  `node_instance_property_id`='$node_instance_property_id'";
                    $res   = $this->MySQLiconn->query($sqlUpdate);
                }*/
           // }
            //else {

                //$node_id            = $this->createNode();
                //echo $sqlInsert               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                         //. " ('$node_instance_id','13219','777788','2','$updateTimestampDate','0','0')";
                //die('hhh');
            //}


        }
        $sql2 = "SELECT `ni`.`node_instance_id` AS `node_instance_id`,`nip`.`value` ,`nip`.`node_class_property_id`,`nip`.`node_instance_property_id` "
            . "FROM `node-instance` as `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` "
                    . "INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                    . "WHERE `ni`.`node_class_id` = '180' AND `nip`.`node_class_property_id` = '13219'";
        $res2   = $this->MySQLiconn->query($sql2);
        while($value2 = $res2->fetch_assoc()){
            $restemp[] = $value2['node_instance_id'];
        }
        $newInstanceList = array_diff($temp, $restemp);
        foreach($newInstanceList as $valuedata){
            $valuedata = $valuedata;
            $node_id                 = $this->createNode();
            $sqlInsert               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                         . " ('$valuedata','13219','$node_id','2','$updateTimestampDate','0','0')";
            $res   = $this->MySQLiconn->query($sqlInsert);
        }

        return count($newInstanceList);

    }
    // Update TimeStamp
    public function updatetimestamp()
    {
            $sql2 = "SELECT `ni`.`node_instance_id` AS `node_instance_id`,`nip`.`value` ,`nip`.`node_class_property_id`,`nip`.`node_instance_property_id` "
            . "FROM `node-instance` as `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` "
                    . "INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` "
                    . "WHERE `ni`.`node_class_id` = '180' AND `nip`.`node_class_property_id` = '13219'  ";  // update query fetch data
            $res2   = $this->MySQLiconn->query($sql2);
                while($value2 = $res2->fetch_assoc()){
                    $node_instance_property_id = $value2['node_instance_property_id'];
                    $sqlUpdate = "UPDATE `node-instance-property` SET `value` = '$updateTimestampDate' WHERE  `node_instance_property_id`='$node_instance_property_id'";
                    $res   = $this->MySQLiconn->query($sqlUpdate);
                }

    }

    /*
     * Created By: Divya Rajput
     * Date: 10-Aug-2017
     * Purpose: Insert data in Flash Notification Class For each user
     * param $array
     * return
     */
    public function saveNotificationData($course_node_id, $notificationArray = array(), $temp_notification_message = ''){

        $flash_timestamp_val        = $notificationArray['notification_timestamp'];
        $dialogue                   = $notificationArray['dialogue'];
        $dialogue_nodeID            = $notificationArray['dialogue_node_id'];
        $production_nodeID          = $notificationArray['production_node_id'];
        $adminNodeId                = $notificationArray['admin_user_id'];
        $participants               = $notificationArray['participants'];
        $flash_notification_status  = $notificationArray['notification_status'];
        $admin_name                 = $notificationArray['admin_name'];
        $course                     = $notificationArray['course_title'];
        $notification_type          = $notificationArray['notification_type'];
        $userArray                  = explode(",", $participants);
        $userParticipant            = isset($notificationArray['user_participants']) ? $notificationArray['user_participants'] : $participants;

        $userDetailSql = "SELECT ni.node_id, LOWER(ncp.caption) as caption, nip.value as fullname
                        FROM `node-instance` as ni
                        LEFT JOIN `node-instance-property` as nip on ni.node_instance_id = nip.node_instance_id
                        LEFT JOIN `node-class-property` as ncp on ncp.node_class_property_id = nip.node_class_property_id
                        WHERE `ni`.`node_id` IN ($userParticipant)
                        AND nip.node_class_property_id IN ('".INDIVIDUAL_FIRST_NAME."','".INDIVIDUAL_LAST_NAME."')";
        $userDetailRes = $this->MySQLiconn->query($userDetailSql);

        while ($userDetailArr = $userDetailRes->fetch_assoc()) {//print_r($userDetailArr);
            $userDetailArray[$userDetailArr['node_id']][$userDetailArr['caption']] = $userDetailArr['fullname'];
        }
        $uers_name = $this->getUserName($userDetailArray);
        $user_notification_id_array = array();
        foreach($userArray as $key => $userNodeId)
        {
            if($temp_notification_message == ''){
                $tmpmessage = $notification_message = addslashes('<strong>' . $admin_name . '</strong> added <strong>' . $uers_name . '</strong> on <strong>' . $dialogue . '</strong> Dialogue under <strong>' . $course. '</strong> Course');
            }else{
                $tmpmessage = $notification_message = addslashes($temp_notification_message);
            }
            $flash_notification_instance_id = $this->createNodeInstanceCourseDialouge(FLASH_NOTIFICATION_CLASS_ID, 2, 'P');
            $flash_notification_node_id     = $this->getInstanceNodeIdCourseDialogue(FLASH_NOTIFICATION_CLASS_ID, $flash_notification_instance_id);
            $user_notification_id_array[$userNodeId]   = " ".$flash_notification_node_id;

            $sqlInsert  = "INSERT INTO `node-instance-property` (`node_instance_id`, `node_class_property_id`, `node_id`, `node_type_id`, `value`, `sequence`, `encrypt_status`) VALUES";

            $admin_user_nid             = $this->createNode();
            $active_user_nid            = $this->createNode();
            $participants_nid           = $this->createNode();
            $notification_message_nid   = $this->createNode();
            $timestamp_nid              = $this->createNode();
            $status_nid                 = $this->createNode();
            $notification_type_nid      = $this->createNode();

            $sqlInsert  .= " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_ADMIN_USER_ID."','$admin_user_nid','2','$adminNodeId','0','0'), "
                        . " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_ACTIVE_USER_ID."','$active_user_nid','2','$userNodeId','0','0'), "
                        . " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_PARTICIPANTS."','$participants_nid','2','$participants','0','0'), "
                        . " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_NOTIFICATION_MESSAGE."','$notification_message_nid','2','$notification_message','0','0'), "
                        . " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_NOTIFICATION_TIMESTAMP."','$timestamp_nid','2','$flash_timestamp_val','0','0'), "
                        . " ('$flash_notification_instance_id','".FLASH_NOTIFICATION_NOTIFICATION_STATUS."','$status_nid','2','$flash_notification_status','0','0') ";
            if($dialogue_nodeID != ''){
                $dialogue_nid               = $this->createNode();
                $sqlInsert  .= ", ('$flash_notification_instance_id','".FLASH_NOTIFICATION_DIALOGUE_NODEID."','$dialogue_nid','2','$dialogue_nodeID','0','0') ";
            }
            if($production_nodeID != ''){
                $production_nid             = $this->createNode();
                $sqlInsert  .= ", ('$flash_notification_instance_id','".FLASH_NOTIFICATION_PRODUCTION_NODEID."','$production_nid','2','$production_nodeID','0','0')";
            }
            $sqlInsert  .= ", ('$flash_notification_instance_id','".FLASH_NOTIFICATION_TYPE."','$notification_type_nid','2','$notification_type','0','0')";
            //echo " >>>>> ".$sqlInsert;
            $this->MySQLiconn->query($sqlInsert);
            $notification_message = '';
            // For Insert Relation Between Production Details And Individual History Class Inatnace
            $this->createXYRelation(trim($course_node_id), $flash_notification_node_id);
        }
        return array('notification_id' => $user_notification_id_array, 'notification_msg' => $tmpmessage);
    }

    private function getUserName($arr, $adminId=''){
        //$usersName = array('You');
        $usersName = array();
        if(count($arr)){
            foreach ($arr as $key => $value) {
                //if($key != $adminId){

                    //Added code by gaurav on 11 sept 2017
                    if(isset($value['last name'])){
                        $lastName = $value['last name'];
                    }else{
                        $lastName = ' ';
                    }
                    array_push($usersName, $value['first name'].' '.$lastName);
                //}
            }
        }
        return implode(", ", $usersName);
    }

    public function getUserDetail($userArray = array(), $user_node_id=''){
        $userData = array();
        if(count($userArray)){
            if($user_node_id != ''){
                $userData = $userArray[$user_node_id];
            }else{
                $userData = $userArray;
            }
        }
        return $userData;
    }

    public function getAllUserDetail($allUserName=array(), $totalUsersArray=array()){
        $userDetail = '';
        if(count($totalUsersArray) && count($allUserName)){
            foreach ($totalUsersArray as $user_node_id){

                    //Added code by gaurav on 11 sept 2017
                    if(isset($allUserName[$user_node_id]['last_name'])){
                        $lastName = $allUserName[$user_node_id]['last_name'];
                    }else{
                        $lastName = ' ';
                    }

                $userDetail .= $allUserName[$user_node_id]['first_name'] . ' ' . $lastName. ", ";
            }
        }
        return rtrim($userDetail, ", ");
    }

    /**
        * Fetch all instances from class ROLE_CB
        * @param group name
        * @return rolesArray
    */
    public function getRoleList()
    {
        $tempArray = $this->getInstanceListOfParticulerClass(ROLE_CB_CLASS_ID,'class','node_id');
        $rolesArray = array();
        foreach($tempArray as $roleId => $roles)
        {
            $rolesArray[$roleId] = $roles['Role'];
        }

        return $rolesArray;
    }

    /*
     * Created By: Divya Rajput
     * For Flash Notification
     * param object $tst_msg
     * param $default_array
     * return array
     */
    public function setNotificationData($tst_msg, $default_array=array()){
        $notificationArray  = array();
        $adminName          = trim($default_array['admin_fname'].' '.$default_array['admin_lname']);
        $adminProfileImage  = $default_array['admin_profile_img'];
        $recipientArr       = $default_array['recipients'];
        $recipient          = implode(",", $recipientArr);

        $dialogue_node_id   = isset($default_array['dialogue_node_id']) ? $default_array['dialogue_node_id'] : '';
        $production_node_id = isset($default_array['production_node_id']) ? $default_array['production_node_id'] : '';

        $notificationArray['admin_user_id']           = $default_array['admin_user_id'];
        $notificationArray['admin_name']              = $adminName;
        $notificationArray['participants']            = $recipient;
        $notificationArray['user_participants']       = isset($default_array['user_participants']) ? implode(",", $default_array['user_participants']) : $recipient;
        $notificationArray['notification_timestamp']  = date('Y-m-d H:i:s');
        $notificationArray['notification_status']     = '0';
        $notificationArray['dialogue']                = isset($default_array['dialogue_title']) ? $default_array['dialogue_title'] : '';
        $notificationArray['dialogue_node_id']        = $dialogue_node_id;
        $notificationArray['course_title']            = isset($tst_msg->course_title) ? $tst_msg->course_title : '';
        $notificationArray['production_node_id']      = $production_node_id;
        $notificationArray['notification_type']       = $default_array['notification_type'];

        if( trim($default_array['notification_type']) === 'Production' ){
            if(isset($default_array['action']) && $default_array['action'] == 'production_all')
            {
                $notification_all                       = json_encode($tst_msg->notification_all);
                $notification_all                       = json_decode($notification_all,true);
                $notification_message                   = current($notification_all)['notification'];
            }
            else if(isset($default_array['action']) && $default_array['action'] == 'production_next')
            {
                $notification_next                       = json_encode($tst_msg->notification_next);
                $notification_next                       = json_decode($notification_next,true);
                $notification_message                    = $notification_next['notification'];
            }
            else
            {
                $allUserName             = $this->getActorFullNames($recipient, 1);
                $dialogue_assciated_user = $this->getAllUserDetail($allUserName, $recipientArr);
                $notification_message    = "<strong>" . trim($adminName) . "</strong> added <strong>" . $dialogue_assciated_user . "</strong> on <strong>" . $tst_msg->course_title . "</strong> Course";
            }

        }else if(isset($default_array['notification_message']) && ($default_array['notification_message'] != '')){
            $notification_message = $default_array['notification_message'];
        }else{
            $notification_message = "";
        }

        $flashNotificationIdArr = $this->saveNotificationData($tst_msg->course_node_id, $notificationArray, $notification_message);
        $profileImage           = $this->getProfileUserImage($adminProfileImage, 'thumbnail');

        return array(
                    'notification_msg' => array(
                        'course_node_id'    => trim($tst_msg->course_node_id),
                        'dialogue_node_id'  => trim($dialogue_node_id),
                        'production_node_id'=> trim($production_node_id),
                        'first_name'        => trim($default_array['admin_fname']),
                        'last_name'         => trim($default_array['admin_lname']),
                        'profile_image'     => $profileImage,
                        'notification'      => stripslashes($flashNotificationIdArr['notification_msg']),
                        'type'              => trim($default_array['notification_type']),
                        'unread_status'     => 0
                    ),
                    'user_notification_id' => $flashNotificationIdArr['notification_id'],
                );
    }

    /*For fetching Reply Data of Particular Statement*/
    private function getMessageReply($node_instance_prop_id)
    {
        $sql = "SELECT ncp.caption, nip1.value FROM `node-instance-property` nip
                INNER JOIN `node-instance-property` nip1 ON nip1.node_instance_id = nip.node_instance_id AND nip1.node_class_property_id IN ('".STATEMENT_ACTOR_AUTHOR."', '".STATEMENT_TITLE_ID."', '".STATEMENT_TYPE_ID."', '".STATEMENT_TIMESTAMP_ID."')
                INNER JOIN `node-class-property` ncp ON ncp.node_class_property_id = nip1.node_class_property_id WHERE nip.node_instance_property_id = ".$node_instance_prop_id;
        $res = $this->MySQLiconn->query($sql);

        $replyArray = array();
        while($value = $res->fetch_assoc()){
            $caption = trim(strtolower($value['caption']));
            if($caption == 'actor.author'){
                $caption = 'user_id';
            }
            $replyArray[str_replace(" ", "_",$caption)] = html_entity_decode(stripslashes($value['value']));
        }
        return $replyArray;
    }

    public function getUserAccountStatus($userInstanceNodeId){
        $accountStatus = '';
        $sql = "SELECT nip.value as account_status
                FROM `node-instance` as ni
                LEFT JOIN `node-x-y-relation` as xy on xy.node_y_id = ni.node_id
                LEFT JOIN `node-instance` as ni1 on ni1.node_id = xy.node_x_id AND ni1.node_class_id = '".ACCOUNT_CLASS_ID."' 
                LEFT JOIN `node-instance-property` as nip on nip.node_instance_id = ni1.node_instance_id AND nip.node_class_property_id = '".ACCOUNT_STATUS_ID."'
                where ni.node_id = '".$userInstanceNodeId."' ";
        $res    = $this->MySQLiconn->query($sql);
        $resArr = $res->fetch_assoc();
        $accountStatus = $resArr['account_status'];
        return $accountStatus;
    }
}
