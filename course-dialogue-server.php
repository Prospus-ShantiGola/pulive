<?php
//error_reporting(0);
error_reporting(E_ALL);
if(isset($_SERVER['PHPRC']) && strpos($_SERVER['PHPRC'], 'xampp') !== false) {
    $branch = 'local';
} else {
    $branch = exec('git rev-parse --abbrev-ref HEAD');
}
echo $branch."\r\n";
//echo $branch = exec('git rev-parse --abbrev-ref HEAD');

switch (strtolower($branch)) {
    case 'dev': $filename = 'config_dev.php';
        break;
    case 'qa': $filename = 'config_qa.php';
        break;
    case 'sta': $filename = 'config_sta.php';
        break;
    case 'master': $filename = 'config_prod.php';
        break;
    default: $filename = 'config_loc.php';
        break;
}

echo $filename;
include_once "$filename";
date_default_timezone_set("Asia/Calcutta");
// DB configuration files
    $globalConfig = include 'config/autoload/global.php';
    $localConfig = include 'config/autoload/local.php';
// DB Confirguration
    $dsn = isset($globalConfig['db']['dsn']) ? $globalConfig['db']['dsn'] : '';
    $dbDetails = isset($localConfig['db']) ? $localConfig['db'] : '';
    $dbUsername = $dbDetails['username'];
    $dbPassword = $dbDetails['password'];
    $dbName = '';
    $hostName = '';
    preg_match('/dbname=([\w\s]+);/', $dsn, $match);
    if(isset($match[1])) {
        $dbName = $match[1];
    }
    preg_match('/host=([\d\s\w-.]+)/', $dsn, $match);
    if(isset($match[1])) {
        $host = $match[1];
    }
    $dbName   = $dbName;
    $host     = $host;
    $username = $dbUsername;
    $password = $dbPassword;
// MySQLi connection

   //print_r(array($host, $username, $password, $dbName));die;
    $MySQLiconn = new MySQLi($host, $username, $password, $dbName);
//    $query      = 'SELECT COUNT(*) FROM `node`';
//    $SQL        = $MySQLiconn->query($query);
//    $getROW     = $SQL->fetch_array();

ignore_user_abort(true);
set_time_limit(0);
//$host =  $_SERVER['HTTP_HOST']; // previous
$host = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : "";
// $host =  'dev.pu.prospus.com';//$_SERVER['HTTP_HOST'];
//$host =  $_SERVER['HTTP_HOST'];
//$port = '9003'; //port
$port = SOCKET_PORT; //port
$null = NULL; //null var
//Create TCP/IP sream socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
/* code here for check socket create */
if ($socket === false) {
    socketErrorMail();
}
try{
    //reuseable port
    socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
    //bind socket to specified host
    socket_bind($socket, 0, $port);
    //listen to port
    socket_listen($socket);
} catch(Exception $e){
    socketExceptionMail($e);
}
/*end code socket exception here */
//create & add listning socket to the list
//$clients = array($socket);
//$userid = array(0);
include 'courseDialogueServerClass.php';
$coursedialogueobj = new courseDialogueServerClass($MySQLiconn);
$clients = array($socket);
$userid = array(0);
$username = array(0);
//start endless loop, so that our script doesn't stop
while (true) {
	//manage multipal connections
	$changed = $clients;
	//returns the socket resources in $changed array
	// change code here for Exception handling
    try{
        socket_select($changed, $null, $null, 0, 10);
    }catch(Exception $e){
        socketExceptionMail($e);
    }
	//check for new socket modified by awdhesh for error exception
	if (in_array($socket, $changed)) {
        try{
            $socket_new = socket_accept($socket); //accpet new socket
            $clients[] = $socket_new; //add socket to client array
            $header = socket_read($socket_new, 1024000); //read data sent by the socket
        }catch(Exception $e){
            socketExceptionMail($e);
        }
		perform_handshaking($header, $socket_new, $host, $port); //perform websocket handshake
		//socket_getpeername($socket_new, $ip); //get ip address of connected socket
		//$response = mask(json_encode(array('type'=>'system', 'message'=>$ip.' connected'))); //prepare json data
		//send_message($response); //notify all users about new connection
		//make room for new socket
		$found_socket = array_search($socket, $changed);
		unset($changed[$found_socket]);
	}

    $responseArr = array();
	//loop through all connected sockets
	foreach ($changed as $changed_socket) {
		//check for any incomming data
		try{
            $_socketRecive = socket_recv($changed_socket, $buf, 1024000, 0);
        }catch (Exception $e) {
            socketExceptionMail($e);
        }
        while($_socketRecive >= 1)
		{
            $received_text = unmask($buf); //unmask data
            $tst_msg = json_decode($received_text); //json decode
            if(isset($tst_msg->message) && ($tst_msg->message === '#$#$DIE$#$#')) { die('#$#$DIE$#$#'); }
            $user_message = '';
            $default_params = array();
            print_r($tst_msg);
            $courseDialoguetype = "";$user_recepient_node_id = "";$user_instance_node_id = "";$action = "";
            $selectType = "";$course_node_id = "";$sender_full_name = "";$dialogue_node_id = "";$user_message = "";
            $dialogue_title = "";$nodeInstancePropertyId = "";$user_typing="";$user_node="";$newMessageCountArr = array();
            $received_text = unmask($buf); //unmask data
            $tst_msg = json_decode($received_text); //json decode
            $user_message = '';
            $default_params = array();
            $dtformat = "";$timestamp_seconds = "";$date_time = "";$statement_node_id = "";$courseStatementType = "";
            $course_title = "";$diaStatusType = "";$getAttachment = "";$attachmentName = "";
            $fileTempName = "";$fileSizeByte = "";$saveType = "";$blank_instance_node_id = "";$default_params = "";$chat_type="";
            $statement_type = "Statement";$responseArr =array();
            $receiver_array                  = array();
            $sender_id                       = '';
            $statement_updated_timestamp = '';
            $first_name = $last_name = '';
            $default_array = array();

            //Task#964: Maxmimum Limit set for course title and dialogue Title
            if(isset($tst_msg->course_title) && trim($tst_msg->course_title) != '') {
                $tst_msg->course_title = substr($tst_msg->course_title, 0, COURSE_DIALOGUE_TITLE_LENGTH);
            }

            if(isset($tst_msg->dialogue_title) && trim($tst_msg->dialogue_title) != '') {
                $tst_msg->dialogue_title = substr($tst_msg->dialogue_title, 0, COURSE_DIALOGUE_TITLE_LENGTH);
            }

            //$tst_msg->timestamp = time();
            if(isset($tst_msg->type) && $tst_msg->type == 'appendStatementForDialogueClass') {

                //$returnData   = $coursedialogueobj->insertTimestamp();

                $statementIds = $coursedialogueobj->appendStatement($tst_msg);
                if(isset($tst_msg->reply) && trim($tst_msg->reply) === 'yes' && count($statementIds[2]['reply_on_message'])) {
                    $tst_msg->reply = json_decode(html_entity_decode(json_encode($statementIds[2]['reply_on_message'])), true);
                }
                //Push Notification
                $msgSendFlag = true;
                // added by awdhesh soni change $tst_msg->default_params->chat_action_type to $tst_msg->node_instance_propertyid
                if(isset($tst_msg->node_instance_propertyid) && $tst_msg->node_instance_propertyid!= ''){
                    $msgSendFlag = false;
                }
               /* if(isset($tst_msg->default_params->chat_action_type) && $tst_msg->default_params->chat_action_type == 'edit'){
                    $msgSendFlag = false;
                }*/
                if($msgSendFlag){
                    //For image uploading
                    if(isset($tst_msg->filetype)&& trim($tst_msg->filetype) == 'image'){
                        $tst_msg->notification = trim($tst_msg->username)." @ ".trim($tst_msg->dialogue_title)."  \r\nsent you a photo.";
                    }elseif(isset($tst_msg->filetype) && trim($tst_msg->filetype) == 'attachment'){
                        $tst_msg->notification = trim($tst_msg->username)." @ ".trim($tst_msg->dialogue_title)."  \r\nsent you an attachment.";

                    }else{
                        $tst_msg->notification = $tst_msg->message;
                    }
                    $coursedialogueobj->pushNotification($tst_msg);
                }

                if(!isset($tst_msg->statement_type)) {
                    $tst_msg->statement_type = '';
                }
                //print_r($statementIds);
                // for multiline chats
                $res = explode('~', $statementIds[0]);
                $newMessageCountArr = $res;
                $res = count($res) == 1 ? $res[0] : $res;
                $tst_msg->statement_node_id = $res;
                if($statementIds[1]!=""){
                    $tst_msg->statement_updated_timestamp = $statementIds[1]; // added by awdhesh soni for update timestamp value
                }else {
                    $tst_msg->statement_updated_timestamp = '';
                }
                $coursedialogueobj->updateCourseTimestamp($tst_msg->course_node_id); // added by awdhesh soni for update timestamp value
                //print_r($tst_msg->statement_updated_timestamp);

                //Added By: Divya on Date 19-july-2017
                $first_name = isset($tst_msg->firstName) ? $tst_msg->firstName : '';
                $last_name = isset($tst_msg->lastName) ? $tst_msg->lastName : '';

                //Desktop Notification
                $responseArr['header_notification'] = array(
                                                            'notification_msg' => array(
                                                                'course_node_id'    => trim($tst_msg->course_node_id),
                                                                'dialogue_node_id'  => trim($tst_msg->dialogue_node_id),
                                                                'first_name'        => trim($first_name),
                                                                'last_name'         => trim($last_name),
                                                                'notification'      => trim($tst_msg->message),
                                                                'type'              => 'Dialogue'
                                                            )
                                                        );
                /*End Here*/
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'appendStatementForDialogueLetterClass') {
                if(empty($tst_msg->courseStatementType)){
                    $tst_msg->courseStatementType = "Draft";
                }
                $statementIds = "";
                $statementIds = $coursedialogueobj->appendLetterStatement($tst_msg);
                //print_r($statementIds);
                //$explodeStatement_id = explode("-",$statementIds);
                $tst_msg->statement_node_id = $statementIds[0];
                if($tst_msg->diaStatusType == "Draft" && $tst_msg->saveType=="P"){
                   $courseStatus = $coursedialogueobj->fetchStatus($tst_msg->course_node_id);
                    if($courseStatus==1){
                        $tst_msg->courseStatementType = "Published";
                        $tst_msg->diaStatusType = "Published";
                    }
               }
               //print_r($statementIds);
                $newMessageCountArr = $statementIds[0];
                $tst_msg->statement_updated_timestamp = $statementIds[1]; // added by awdhesh soni for update timestamp value
                //$tst_msg->blank_instance_node_id = $explodeStatement_id[0];
                //$tst_msg->type = "appendStatementForDialogueLetterClassModified";
                $coursedialogueobj->updateCourseTimestamp($tst_msg->course_node_id); // added by awdhesh soni for update timestamp value

                //Added By: Divya on Date 19-july-2017
                $first_name = isset($tst_msg->firstName) ? $tst_msg->firstName : '';
                $last_name = isset($tst_msg->lastName) ? $tst_msg->lastName : '';
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'deleteStatementMsg') {
                $delete_data['node_instance_id']        = $tst_msg->node_instance_id;
                $delete_data['dialog_instance_node_id'] = $tst_msg->dialog_instance_node_id;
                if(isset($tst_msg->course_node_id)){
                    $delete_data['course_node_id']          = $tst_msg->course_node_id;
                }

                $deleteRowCount                         = $coursedialogueobj->deleteStatement($delete_data);
                $tst_msg->message = 'This message has been removed.';
                $tst_msg->statement_node_id = (string)$tst_msg->node_instance_id;
                $tst_msg->statement_updated_timestamp = $deleteRowCount[1];
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'deleteLetterStatementMsg') {
                $delete_data['node_instance_id']        = $tst_msg->node_instance_id;
                $delete_data['dialog_instance_node_id'] = $tst_msg->dialog_instance_node_id;
                $delete_data['user_current_session_id'] = $tst_msg->user_instance_node_id;
                //$tst_msg->message = array(array('statement' => '<span class="more statement_drop clearfix rmv-disabled">This message has been removed.</span>'));
                $tst_msg->message = array(array('statement' => 'This message has been removed.')); // change by awdhesh suggetion by prem
                if(isset($tst_msg->course_node_id)){
                    $delete_data['course_node_id']          = $tst_msg->course_node_id;
                }
                $statement_update_timestamp                         = $coursedialogueobj->deleteLetterStatement($delete_data);
                $tst_msg->statement_node_id                         = (string)$tst_msg->node_instance_id;
                $tst_msg->statement_updated_timestamp               = $statement_update_timestamp;
                //print_r($deleteRowCount);
            }
            elseif(isset($tst_msg->type) && ($tst_msg->type=="addCourse" || $tst_msg->type=="addDialogue" || $tst_msg->type=="addCourseDialogueActorAndStatement" || $tst_msg->type=="addProductionCourse" || $tst_msg->type=="editProductionCourse" || $tst_msg->type=="outsideAPI")) {

                if($tst_msg->type == "addProductionCourse" || $tst_msg->type == "editProductionCourse")
                {
                    /* Code By Arvind Soni For Production Course Instance Insert */
                    if($tst_msg->course_instance_id != '')
                    {
                        $saveCourseRes                          = $coursedialogueobj->updateCourseProduction($tst_msg);
                    }
                    else
                    {
                        $saveCourseRes                          = $coursedialogueobj->saveCourseProduction($tst_msg);
                    }

                    $tst_msg->dialogue_node_id              = isset($saveCourseRes['dialogue_node_id']) ? $saveCourseRes['dialogue_node_id'] : '';
                    $tst_msg->course_node_id                = isset($saveCourseRes['course_node_id']) ? $saveCourseRes['course_node_id'] : '';
                    $tst_msg->course_instance_id            = isset($saveCourseRes['course_instance_id']) ? $saveCourseRes['course_instance_id'] : '';
                    $tst_msg->statement_node_id             = isset($saveCourseRes['statement_node_id']) ? $saveCourseRes['statement_node_id'] : '';
                    $tst_msg->production_node_id            = isset($saveCourseRes['production_details_node_id']) ? $saveCourseRes['production_details_node_id'] : '';
                    
                    

                    $receiver_array                         = $saveCourseRes['receiver_ids'];
                    $sender_id                              = $saveCourseRes['sender_id'];
                    $actorList                              = $coursedialogueobj->fetchUserDetailsByDialogue($saveCourseRes['production_details_node_id'], implode(',',$receiver_array));
                    $is_controller                          = $coursedialogueobj->getControllerOfProductionJson($tst_msg);
                    $roleArray                              = $coursedialogueobj->getRoleList();

                    /*
                     * Created By: Divya Rajput
                     * Date: 11-Aug-2017
                     * Purpose: For Flash Notification
                    */
                    $header_notification = array();
                    if($tst_msg->course_instance_id != ''){
                        $recipientArr = array_diff($receiver_array, array(trim($sender_id)));
                        //$recipient = implode(",", $recipientArr);
                        $userName = $coursedialogueobj->getActorFullNames($sender_id, 1);
                        $adminFirstName = isset($userName[$sender_id]['first_name']) ? $userName[$sender_id]['first_name'] : '';
                        $adminLastName = isset($userName[$sender_id]['last_name']) ? $userName[$sender_id]['last_name'] : '';
                        //$adminName = trim($adminFirstName.' '.$adminLastName);
                        $adminProfileImage = isset($userName[$sender_id]['profile_image']) ? $userName[$sender_id]['profile_image'] : '';

                        $default_array['admin_user_id']     = $sender_id;
                        $default_array['admin_fname']       = $adminFirstName;
                        $default_array['admin_lname']       = $adminLastName;
                        $default_array['recipients']        = $recipientArr;
                        $default_array['admin_profile_img'] = $adminProfileImage;
                        $default_array['production_node_id']= $saveCourseRes['production_details_node_id'];
                        $default_array['notification_type'] = 'Production';

                        $header_notification = $coursedialogueobj->setNotificationData($tst_msg, $default_array);
                    }
                    /*End Here*/

                    if(!isset($tst_msg->production_instance_id) && $tst_msg->type == "addProductionCourse" && $tst_msg->course_instance_id != '' && !isset($tst_msg->course_title))
                    {
                        $tst_msg->saveType = "P";
                        $responseArr['new_course']              = array(" ".trim($tst_msg->course_node_id) => array(
                                                                        'status' => 'Published',
                                                                        'domain' => 'Prospus',
                                                                        'course_node_id' => $tst_msg->course_node_id,
                                                                        'course_instance_id' => $tst_msg->course_instance_id,
                                                                        'created_by' => $sender_id,
                                                                        'new_production_id' => $saveCourseRes['production_details_node_id'],
                                                                        'date'=> $saveCourseRes['course_timestamp_value'],
                                                                        'dialogue' => array(),
                                                                        'actors' => array(),
                                                                        'events' => array(),
                                                                        'resources' => array(),
                                                                        'production' => array($saveCourseRes['production_details_node_id'] => array('production_node_id' => $saveCourseRes['production_details_node_id'], 'template_id' => $tst_msg->template_id, 'production_id' => $saveCourseRes['production_id'], 'production_name' => $saveCourseRes['production_name'],'created_by' => $tst_msg->created_by,'status' => 'P', 'users' => $actorList['actor_list'], 'is_primary_controller' => $is_controller)),
                                                                        'user_ids' => array_keys($actorList['actor_list']),
                                                                        'count' => array(
                                                                            'course' => 0,
                                                                            'notification' => 0,
                                                                            'actors' => count($actorList['actor_list']),
                                                                            'dialogues' => 0,
                                                                            'events' => 0,
                                                                            'resources' => 0,
                                                                            'production' => 1
                                                                        ),
                                                                        'header_notification' => $header_notification,
                                                                    )
                                                                );
                    }
                    else
                    {
                        if($tst_msg->saveType == "P"){
                            $saveType                           = 'Published';
                        }else{
                            $saveType                           = 'Draft';
                        }

                        $responseArr['new_course']              = array(" ".trim($tst_msg->course_node_id) => array(
                                                                        'course' => $tst_msg->course_title,
                                                                        'status' => $saveType,
                                                                        'domain' => 'Prospus',
                                                                        'course_node_id' => $tst_msg->course_node_id,
                                                                        'course_instance_id' => $tst_msg->course_instance_id,
                                                                        'created_by' => $sender_id,
                                                                        'new_production_id' => $saveCourseRes['production_details_node_id'],
                                                                        'date'=> $saveCourseRes['course_timestamp_value'],
                                                                        'dialogue' => array(),
                                                                        'actors' => array(),
                                                                        'events' => array(),
                                                                        'resources' => array(),
                                                                        'production' => array($saveCourseRes['production_details_node_id'] => array('production_node_id' => $saveCourseRes['production_details_node_id'], 'template_id' => $tst_msg->template_id, 'production_id' => $saveCourseRes['production_id'], 'production_name' => $saveCourseRes['production_name'],'created_by' => $tst_msg->created_by,'status' => $tst_msg->saveType, 'users' => $actorList['actor_list'], 'is_primary_controller' => $is_controller)),
                                                                        'user_ids' => array_keys($actorList['actor_list']),
                                                                        'count' => array(
                                                                            'course' => 0,
                                                                            'notification' => 0,
                                                                            'actors' => count($actorList['actor_list']),
                                                                            'dialogues' => 0,
                                                                            'events' => 0,
                                                                            'resources' => 0,
                                                                            'production' => 1
                                                                        ),
                                                                        'header_notification' => $header_notification,
                                                                    )
                                                                );
                    }

                    //print_r($responseArr);
                }
                else if($tst_msg->type == "outsideAPI")
                {
                    /* Code By Arvind Soni For Production Course Instance Insert */
                    $tempArray                              = json_decode(json_encode($tst_msg->msg), true);
                    $receiver_array                         = $tempArray['receiver_array'];
                    $sender_id                              = $tempArray['sender_id'];
                    $responseArr['new_course']              = $tempArray['new_course'];
                    $new_production_id                      = current($tempArray['new_course'])['new_production_id'];
                    $course_node_id                         = current($tempArray['new_course'])['course_node_id'];
                    $course_title                           = current($tempArray['new_course'])['course'];
                    $actorList                              = $coursedialogueobj->fetchUserDetailsByDialogue($new_production_id, implode(',',$receiver_array));

                    $tst_msg->saveType                      = "P";
                    $tst_msg->course_node_id                = $course_node_id;
                    $tst_msg->course_title                  = $course_title;
                    $tst_msg->type                          = "addProductionCourse";
                    $tst_msg->default_params->added_by_name = $tempArray['sender_name'];

                    /*
                     * Created By: Divya Rajput
                     * Date: 11-Aug-2017
                     * Purpose: For Flash Notification
                    */
                    $recipientArr = array_diff($receiver_array, array(trim($sender_id)));
                    //$recipient = implode(",", $recipientArr);
                    $userName = $coursedialogueobj->getActorFullNames($sender_id, 1);
                    $adminFirstName = isset($userName[$sender_id]['first_name']) ? $userName[$sender_id]['first_name'] : '';
                    $adminLastName = isset($userName[$sender_id]['last_name']) ? $userName[$sender_id]['last_name'] : '';
                    //$adminName = trim($adminFirstName.' '.$adminLastName);
                    $adminProfileImage = isset($userName[$sender_id]['profile_image']) ? $userName[$sender_id]['profile_image'] : '';

                    $default_array['admin_user_id']     = $sender_id;
                    $default_array['admin_fname']       = $adminFirstName;
                    $default_array['admin_lname']       = $adminLastName;
                    $default_array['recipients']        = $recipientArr;
                    $default_array['admin_profile_img'] = $adminProfileImage;
                    $default_array['production_node_id']= $new_production_id;
                    $default_array['notification_type'] = 'Production';

                    $header_notification = $coursedialogueobj->setNotificationData($tst_msg, $default_array);

                    $responseArr['new_course'][" ".$course_node_id]['production'][$new_production_id]['users'] = $actorList['actor_list'];
                    $responseArr['new_course'][" ".$course_node_id]['user_ids'] = array_keys($actorList['actor_list']);
                    $responseArr['new_course'][" ".$course_node_id]['count']['actors'] = count($actorList['actor_list']);
                    //print_r($actorList);
                    //print_r($responseArr);
                }
                else
                {
                    $saveCourseRes                          = $coursedialogueobj->saveCourseDialouge($tst_msg);

                    //print_r($saveCourseRes);
                   
                    $tst_msg->dialogue_node_id              = isset($saveCourseRes['dialogue_node_id']) ? $saveCourseRes['dialogue_node_id'] : '';
                    $tst_msg->course_node_id                = isset($saveCourseRes['course_node_id']) ? $saveCourseRes['course_node_id'] : '';
                    $tst_msg->course_instance_id            = isset($saveCourseRes['course_instance_id']) ? $saveCourseRes['course_instance_id'] : '';
                    $tst_msg->statement_node_id             = isset($saveCourseRes['statement_node_id']) ? $saveCourseRes['statement_node_id'] : '';

                    /* * Send notification on adding course and dialogue
                     * By:- Gaurav
                     * Date:- 04 may 2017
                     */
                    //$adminName = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id); // change by awdhesh soni $tst_msg->default_params->added_by_name to $tst_msg->user_instance_node_id
                    $adminNameArr = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id, 1);
                    $fname = isset($adminNameArr[$tst_msg->user_instance_node_id]['first_name']) ? $adminNameArr[$tst_msg->user_instance_node_id]['first_name'] : '';
                    $lname = isset($adminNameArr[$tst_msg->user_instance_node_id]['last_name']) ? $adminNameArr[$tst_msg->user_instance_node_id]['last_name'] : '';
                    $adminName = trim($fname.' '.$lname);
                    $adminProfileImage = isset($adminNameArr[$tst_msg->user_instance_node_id]['profile_image']) ? $adminNameArr[$tst_msg->user_instance_node_id]['profile_image'] : '';
                    //$adminName                              = trim($tst_msg->default_params->added_by_name);
                    $courseTitle                            = trim($tst_msg->course_title);
                    $dialogueTitle                          = trim($tst_msg->dialogue_title);
                    $notifyMsg                              = trim($adminName)." added you in " . $dialogueTitle . " dialogue under " . $courseTitle . " course.";
                    $tst_msg->notification                  = $notifyMsg;


                    if(empty($tst_msg->statement_node_id)){
                        $tst_msg->statement_node_id         = isset($saveCourseRes['savestate']) ? $saveCourseRes['savestate'] : '';
                    }

                    $tst_msg->timestamp                     = isset($saveCourseRes['timestamp']) ? $saveCourseRes['timestamp'] : '';

                    $users_node_id                          = $tst_msg->user_instance_node_id.','.$tst_msg->user_recepient_node_id;
                    $newMessageCountArr                     = explode('~', $tst_msg->statement_node_id);
                    if(!empty($tst_msg->dialogue_node_id)){
                        $statement_date                     = $saveCourseRes['date'];
                        $createdDate                        = isset($saveCourseRes['created']) ? $saveCourseRes['created'] : ""; // $saveCourseRes['created'];
                        $actorList                          = $coursedialogueobj->fetchUserDetailsByDialogue($tst_msg->dialogue_node_id, $users_node_id);
                        //$actorList = $actorList['actor_list'];
                        if($tst_msg->saveType=="P"){
                            $saveType                       = 'Published';
                            $updateStatus                   = '1';
                        }else {
                            $saveType                       = 'Draft';
                            $updateStatus                   = '0';
                        }

                        if($tst_msg->action=="Letter"){
                         $statementType                     = 'Letter';
                          $statement_instance_id            = explode("~",$tst_msg->statement_node_id);
                          $statement_instance_id            = $coursedialogueobj->fetchNodeId($statement_instance_id[0]);
                        }else {
                         $statementType                     = 'Statement';
                         $statement_instance_id             = "";
                         //$stamentInsId = 'blank_stmt_node_id';
                        }

                        $adminUser                          = $coursedialogueobj->fetchAdminDetailsByDialogue($tst_msg->dialogue_node_id, $tst_msg->user_instance_node_id);
                        //print_r($adminUser);
                        $totalUsersArray = array();
                        $user_receipient = explode(",", $tst_msg->user_recepient_node_id);
                        if(isset($tst_msg->user_ids)){
                            $totalUsersArray = $tst_msg->user_ids;
                        }else{
                            $totalUsersArray = array_unique(array_merge($user_receipient, array($tst_msg->user_instance_node_id)));
                        }

                        /*
                         * Created By: Divya Rajput
                         * Date: 11-Aug-2017
                         * Purpose: For Flash Notification
                        */
                        $default_array['admin_user_id']     = $tst_msg->user_instance_node_id;
                        $default_array['admin_fname']       = trim($fname);
                        $default_array['admin_lname']       = trim($lname);
                        $default_array['recipients']        = $user_receipient;
                        $default_array['admin_profile_img'] = $adminProfileImage;
                        $default_array['production_node_id']= '';
                        $default_array['dialogue_node_id']  = $tst_msg->dialogue_node_id;
                        $default_array['notification_type'] = 'Dialogue';
                        $default_array['dialogue_title']    = $tst_msg->dialogue_title;
                        $default_array['dialogue_node_id']  = $tst_msg->dialogue_node_id;

                        $header_notification  = $coursedialogueobj->setNotificationData($tst_msg, $default_array);

                        $letter_text = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
                        $dialogueStatus                     = $tst_msg->saveType == 'P' ? 1 : 0;
                        $responseArr['new_course']          = array(" ".trim($tst_msg->course_node_id) => array(
                                                                            'course' => $tst_msg->course_title,
                                                                            'status' => $saveType,
                                                                            'domain' => 'Prospus',
                                                                            'course_node_id' => $tst_msg->course_node_id,
                                                                            'course_instance_id' => $tst_msg->course_instance_id,
                                                                            'dialogue' => array(" ".$tst_msg->dialogue_node_id => array('users' => $actorList['actor_list'], 'removed_users' => array(), 'dialogue' => array('dialogue_title' => $tst_msg->dialogue_title, 'created_by' => $tst_msg->user_instance_node_id, 'notificationCount' => 0, 'dialogue_node_id' => $tst_msg->dialogue_node_id,'dialogueStatus'=>$dialogueStatus, 'date'=> $saveCourseRes['date'],'chat_text'=>'','letter_text'=>$letter_text))),
                                                                            'actors' => array(),
                                                                            'events' => array(),
                                                                            'user_ids' => $totalUsersArray,
                                                                            'count' => array(
                                                                                'course' => count($newMessageCountArr),
                                                                                'notification' => 0,
                                                                                'actors' => count($totalUsersArray),
                                                                                'dialogues' => 1,
                                                                                'events' => 0,
                                                                                'resources' => 0,
                                                                                'production' => 0
                                                                            ),
                                                                            'has_received_notification' => 0,
                                                                            'created_by' => $tst_msg->user_instance_node_id,
                                                                            'resources' => array(),
                                                                            'date'=> isset($tst_msg->course_date) ? $tst_msg->course_date : $saveCourseRes['date'],
                                                                            $statement_date => array('0'=>array(
                                                                                'first_name'=>(isset($adminUser['first_name'])) ? $adminUser['first_name'] : "",
                                                                                'last_name'=>(isset($adminUser['last_name'])) ? $adminUser['last_name'] : "",
                                                                                'actor.author'=>$tst_msg->user_instance_node_id,
                                                                                'statement'=>array('0'=>array('statement'=>$tst_msg->message,'statement_type'=>$statementType,'updated_status'=>$updateStatus)),
                                                                                'updated_status'=>$updateStatus,
                                                                                'node_instance_id'=>$tst_msg->course_instance_id,
                                                                                'timestamp'=>$tst_msg->timestamp,
                                                                                'blank_stmt_node_id'=>$statement_instance_id,
                                                                                'date'=>$statement_date
                                                                                )
                                                                            ),
                                                                            'header_notification' => $header_notification,
                                                                        )
                                                                    );
                    }
                    //print_r($responseArr);
                    // push notification after adding new course/dialogue
                    $coursedialogueobj->pushNotification($tst_msg);
                    sleep(1);
                    /*Added on 6 June 2017
                     * By- Gaurav
                     * For push notification
                     */
                    if($tst_msg->type=="addCourseDialogueActorAndStatement"){

                        $tst_msg->notification = $adminName." @ ".$dialogueTitle."  \r\n".trim($tst_msg->message);
                    }else{
                        $tst_msg->notification = $tst_msg->message;
                    }
                    if($tst_msg->selectType == "Chat" || $tst_msg->Coursetype == "Chat" || $tst_msg->modeType == "Chat"){ // codition for IOS in Letter Case

                        

                        $coursedialogueobj->pushNotification($tst_msg);
                    }

                    //$newMessageCountArr = explode('~', $tst_msg->statement_node_id);
                }
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'addUpdateParticipant') {
                $dataArr['dialogue_node_id']               = $tst_msg->dialogue_node_id;
                $dataArr['user_instance_node_id']          = $tst_msg->new_user_recepient_node_id;
                $dataArr['user_recepient_node_id']          = $tst_msg->user_recepient_node_id;
                $dataArr['current_user_node_id']           = $tst_msg->user_instance_node_id;
                $dataArr['saveType']                       = $tst_msg->saveType;
                //As discussed with web and IOS team, we are sending date as course date
                $date = $tst_msg->course_date; //date("Y F d h:i:s");
                if($dataArr['saveType']=="P"){
                    $status = 1;
                    $saveType = "Published";
                }else {
                    $status = 0;
                    $saveType = "Draft";
                }
                $dataArr['status']    = $status;
                $courseNodeId = $tst_msg->course_node_id;//$coursedialogueobj->fetchNodeId($tst_msg->course_instance_node_id);
                $dataArr['course_node_id']        = $courseNodeId;
                $responseArr = $coursedialogueobj->addUpdateParticipant($dataArr);
                $users_added = $push_notifiction_user = ''; //$push_notifiction_user variable added by Divya Rajput as Strong is not added for message
                foreach($tst_msg->new_user_recepient_node_id as $user_node_id)
                {
                    $name = $coursedialogueobj->getActorFullNames($user_node_id);
                    $users_added .= '<strong>' . $name."</strong>, ";
                    $push_notifiction_user .= $name.", ";
                }
                $users_added = rtrim($users_added,', ');
                $push_notifiction_user = rtrim($push_notifiction_user,', ');

                //$added_by_name = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id); // added by awdhesh soni for fetch user first name and last name
                $adminNameArr = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id, 1);
                $fname = isset($adminNameArr[$tst_msg->user_instance_node_id]['first_name']) ? $adminNameArr[$tst_msg->user_instance_node_id]['first_name'] : '';
                $lname = isset($adminNameArr[$tst_msg->user_instance_node_id]['last_name']) ? $adminNameArr[$tst_msg->user_instance_node_id]['last_name'] : '';
                $added_by_name = trim($fname.' '.$lname);
                $adminProfileImage = isset($adminNameArr[$tst_msg->user_instance_node_id]['profile_image']) ? $adminNameArr[$tst_msg->user_instance_node_id]['profile_image'] : '';

                $message = '<strong>'.$added_by_name.'</strong> added '.$users_added.' in this dialogue.'; // modified by awdhesh soni from $tst_msg->default_params->added_by_name to $added_by_name
                //Added By Divya Rajput
                $plain_text_message = $added_by_name.' added '.$push_notifiction_user.' in this dialogue.';
                $dt = new DateTime();
                $dtformat =  $dt->format('l, M d, Y - h:i A');
                $date_time =  $dt->format('Y-m-d H:i');
                $timestamp_seconds = $dt->getTimestamp();
                $systemResponse = $coursedialogueobj->addSystemMessage($tst_msg->dialogue_node_id,$tst_msg->user_instance_node_id,$message,$timestamp_seconds); //change from $tst_msg->default_params->added_by_id to
                $recipient_ids_arr = $tst_msg->user_recepient_node_id = array_values(array_intersect($tst_msg->user_recepient_node_id, array_keys($responseArr['actor_list'])));
                $tst_msg->user_recepient_node_id = implode(",", $tst_msg->user_recepient_node_id);
                $dialogue_instance_id = $coursedialogueobj->fetchInstanceId($tst_msg->dialogue_node_id);
                //print_r($tst_msg);
                // function call here for notification count by awdhesh soni
                $coursedialogueobj->addNotificationOfChat($tst_msg,$systemResponse[0],1,0,'System Message');
                $letter_text = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";

                /*
                 * Created By: Divya Rajput
                 * Date: 11-Aug-2017
                 * Purpose: For Flash Notification
                */
                $participants = array_diff($recipient_ids_arr, array(trim($tst_msg->user_instance_node_id)));
                $totalUsersArray = array();
                $user_receipient = $tst_msg->new_user_recepient_node_id;
                $totalUsersArray = array_unique(array_merge($user_receipient, array($tst_msg->user_instance_node_id)));

                $userName = $coursedialogueobj->getActorFullNames(implode(",", $totalUsersArray), 1);
                $allUserName = $coursedialogueobj->getUserDetail($userName);
                $dialogue_associated_user = $coursedialogueobj->getAllUserDetail($allUserName, $user_receipient);

                $default_array['admin_user_id']     = trim($tst_msg->user_instance_node_id);
                $default_array['admin_fname']       = trim($fname);
                $default_array['admin_lname']       = trim($lname);
                $default_array['recipients']        = $participants;
                $default_array['user_participants'] = $tst_msg->new_user_recepient_node_id;
                $default_array['admin_profile_img'] = $adminProfileImage;
                $default_array['production_node_id']= '';
                $default_array['dialogue_node_id']  = $tst_msg->dialogue_node_id;
                $default_array['notification_type'] = 'Dialogue';
                $default_array['dialogue_title']    = $tst_msg->dialogue_title;
                $default_array['dialogue_node_id']  = $tst_msg->dialogue_node_id;
                $default_array['notification_message']= "<strong>" . trim($added_by_name) . "</strong> added <strong>" . $dialogue_associated_user . "</strong> on <strong>" . $tst_msg->dialogue_title . "</strong> Dialogue under <strong>" . $tst_msg->course_title . "</strong> Course";

                $header_notification  = $coursedialogueobj->setNotificationData($tst_msg, $default_array);
                /*End Here*/

                $responseArr['new_course'] = array(
                        " ".trim($tst_msg->course_node_id) => array('course' => $tst_msg->course_title,
                            'status' => $saveType,
                            'domain' => 'Prospus',
                            'course_node_id' => $tst_msg->course_node_id,
                            'dialogue' => array(" ".$tst_msg->dialogue_node_id => array('users' => $responseArr['actor_list'], 'dialogue' => array('dialogue_title' => $tst_msg->dialogue_title, 'created_by' => $tst_msg->user_instance_node_id, 'dialogue_node_id' => $tst_msg->dialogue_node_id,'dialogue_instance_id'=>$dialogue_instance_id,'dialogueStatus'=>$status, 'notificationCount' => 0, 'date' => $tst_msg->dialogue_date,'chat_text'=>'','letter_text'=>$letter_text))),
                            'actors' => array(),
                            'events' => array(),
                            'resources' => array(),
                            'user_ids' => $tst_msg->user_ids,
                            'count' => array(
                                'course' => 1,
                                'notification' => 0,
                                'actors' => count($tst_msg->user_ids),
                                'dialogues' => 1,
                                'events' => 0,
                                'resources' => 0,
                                'production' => 0
                            ),
                            'date'=>$date,
                            'header_notification' => $header_notification,
                        )
                    );
                $responseArr['system_message'] = $message;
                $responseArr['timestamp_seconds'] = $timestamp_seconds;
                $responseArr['statement_node_id'] = (string)$systemResponse[1];
                $responseArr['statement_type'] = "System Message";  // added by awdhesh suggested by prem
                $responseArr['sender_full_name'] = $added_by_name;  // added by awdhesh suggested by prem
                $tst_msg->notification = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id)." @ ".trim($tst_msg->dialogue_title)."  \r\n".trim($plain_text_message);
                $coursedialogueobj->pushNotification($tst_msg);
                $newMessageCountArr = $systemResponse[1];
                $tst_msg->statement_node_id = (string)$systemResponse[1];
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'removeParticipant') {
                $dataArr['dialogue_node_id']     = $tst_msg->dialogue_node_id;
                $dataArr['removeUser']           = $tst_msg->removeUser;
                $dataArr['user_actor_node_id']   = $tst_msg->user_instance_node_id;
                $dataArr['course_node_id']   = $tst_msg->course_node_id;
                $deletestatus = $coursedialogueobj->removeParticipantData($dataArr);
                // Awdhesh soni fetch record of user first name and last name
                $removed_user_name = $coursedialogueobj->getActorFullNames($tst_msg->removeUser);
                $removed_by_name = $coursedialogueobj->getActorFullNames($tst_msg->user_instance_node_id);
                $message = '<strong>'.$removed_by_name.'</strong> removed <strong>'.$removed_user_name.'</strong> from this dialogue.'; // change by awdhesh soni
                $plain_text_message = $removed_by_name.' removed '.$removed_user_name.' from this dialogue.'; //Added By Divya Rajput for push notificatio only
                //$message = $tst_msg->default_params->removed_by_name.' removed '.$tst_msg->default_params->removed_user_name.' from this dialogue.'; // previous code


                date_default_timezone_set("Asia/Calcutta");
                $dt = new DateTime();
                $dtformat =  $dt->format('l, M d, Y - h:i A');
                $date_time =  $dt->format('Y-m-d H:i');
                $timestamp_seconds = $dt->getTimestamp();
                //echo '-----------------------------------------------------------------------';
                //print_r($dataArr);
                //print_r($tst_msg);
                //                echo '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||';
                $responseArr = array();
                // modified by awdhesh soni chnage $tst_msg->default_params->dialogue_node_id,$tst_msg->default_params->removed_by_id
                //$statementNodeId = $coursedialogueobj->addSystemMessage($tst_msg->default_params->dialogue_node_id,$tst_msg->default_params->removed_by_id,$message,$timestamp_seconds);
                $statementNodeId = $coursedialogueobj->addSystemMessage($tst_msg->dialogue_node_id,$tst_msg->user_instance_node_id,$message,$timestamp_seconds);
                $has_removed = $coursedialogueobj->getActorHasRemovedStatus(trim($tst_msg->course_node_id),trim($tst_msg->removeUser));
                $tst_msg->user_recepient_node_id = implode(",",$tst_msg->user_recepient_node_id);
                // function call here for notification count by awdhesh soni
                $coursedialogueobj->addNotificationOfChat($tst_msg,$statementNodeId[0],1,0,'System Message');
                $tst_msg->notification = $plain_text_message;
                $coursedialogueobj->pushNotification($tst_msg);
                echo '-----------------------------------------------------------------------';
                $responseArr['has_removed'] = $has_removed;
                $responseArr['system_message'] = $message;
                $responseArr['timestamp_seconds'] = $timestamp_seconds;
                $responseArr['statement_node_id'] = (string)$statementNodeId[1];
                $newMessageCountArr = $statementNodeId[1];
                $responseArr['statement_type'] = "System Message";  // added by awdhesh suggested by prem
                $responseArr['sender_full_name'] = $removed_by_name;  // added by awdhesh suggested by prem
                $tst_msg->statement_node_id = (string)$statementNodeId[1];
            }
            elseif(isset($tst_msg->type) && ($tst_msg->type == 'updateCourseTitle' || $tst_msg->type == 'updateDialogTitle')) {
                $responseArr = array();
                if($tst_msg->type == 'updateCourseTitle')
                {
                    //$node_instance_id           = $tst_msg->instance_id;
                    $new_title                  = $tst_msg->new_title;
                    $property_id                = COURSE_TITLE_ID;
                    $node_id                    = $tst_msg->node_id;
                    $iscourse                   = 1;
                    $tst_msg->course_node_id    = $tst_msg->node_id;
                    $tst_msg->course_title      = $new_title;

                    //Get old course name
                    $propArr = array(COURSE_TITLE_ID);
                    $getPropArr = $coursedialogueobj->getInstanceProperty($node_id, $propArr);
                    $oldCourseName = $getPropArr[COURSE_TITLE_ID];

                    $responseArr['call_status'] = $coursedialogueobj->updateCourseDialogueTitle($new_title,$property_id,$node_id,$iscourse);
                    //Get properties of instance
                    $updatedByUserID = $tst_msg->updated_by_id;
                    if(trim($updatedByUserID)>0){
                        $propArr = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME);
                        $getPropArr = $coursedialogueobj->getInstanceProperty($updatedByUserID, $propArr);
                        $userFullName = trim($getPropArr[INDIVIDUAL_FIRST_NAME])." ".trim($getPropArr[INDIVIDUAL_LAST_NAME]);
                        $message = $userFullName . " renamed course " . trim($oldCourseName) . " to " . trim($new_title) . ".";
                        $responseArr['system_message'] = $message;
                        $participantList = $coursedialogueobj->getAllDialogueInstancesOfCourseClass($tst_msg->node_id);
                        $tst_msg->user_recepient_node_id = $participantList;
                    }

                }else{
                    //$node_instance_id            = $tst_msg->instance_id;
                    $new_title          = $tst_msg->new_title;
                    $property_id        = DIALOGUE_TITLE_ID;
                    $node_id            = $tst_msg->node_id;
                    $course_node_id     = $tst_msg->course_node_id;
                    $iscourse           = 0;
                    $tst_msg->dialogue_node_id    = $tst_msg->node_id;
                    $tst_msg->dialogue_title          = $new_title;
                    $tst_msg->course_title = isset($tst_msg->old_course_title) ? $tst_msg->old_course_title : '';

                    //Get old course name
                    $propArr = array(DIALOGUE_TITLE_ID);
                    $getPropArr = $coursedialogueobj->getInstanceProperty($node_id, $propArr);
                    $oldDialogueName = $getPropArr[DIALOGUE_TITLE_ID];

                    $responseArr['call_status'] = $coursedialogueobj->updateCourseDialogueTitle($new_title,$property_id,$node_id,$iscourse,$course_node_id);


                    //Get properties of instance
                    $updatedByUserID = $tst_msg->updated_by_id;
                    if(trim($updatedByUserID)>0){
                        //Get course name
                        $courseTitle = $coursedialogueobj->getCourseName($tst_msg->node_id);
                        $propArr = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME);
                        $getPropArr = $coursedialogueobj->getInstanceProperty($updatedByUserID, $propArr);
                        //$userFullName = trim($getPropArr[INDIVIDUAL_FIRST_NAME])." ".trim($getPropArr[INDIVIDUAL_LAST_NAME]);
                        $adminNameArr = $coursedialogueobj->getActorFullNames($tst_msg->updated_by_id, 1);
                        $fname = isset($adminNameArr[$tst_msg->updated_by_id]['first_name']) ? $adminNameArr[$tst_msg->updated_by_id]['first_name'] : '';
                        $lname = isset($adminNameArr[$tst_msg->updated_by_id]['last_name']) ? $adminNameArr[$tst_msg->updated_by_id]['last_name'] : '';
                        $userFullName = trim($fname.' '.$lname);
                        $adminProfileImage = isset($adminNameArr[$tst_msg->updated_by_id]['profile_image']) ? $adminNameArr[$tst_msg->updated_by_id]['profile_image'] : '';

                        $message = $userFullName.' renamed dialogue '.trim($oldDialogueName).' to '.trim($new_title).' under '.trim($courseTitle).' course.';
                        $systemMessage = '<strong>'.$userFullName.'</strong> renamed dialogue <strong>'.trim($oldDialogueName).'</strong> to <strong>'.trim($new_title).'</strong>.';

                    }
                    date_default_timezone_set("Asia/Calcutta");
                    $dt = new DateTime();
                    $dtformat =  $dt->format('l, M d, Y - h:i A');
                    $date_time =  $dt->format('Y-m-d H:i');
                    $timestamp_seconds = $dt->getTimestamp();

                    $systemResponse = $coursedialogueobj->addSystemMessage($tst_msg->node_id,$updatedByUserID,$systemMessage,$timestamp_seconds); //change by awdhesh soni  //$tst_msg->default_params->updated_by_id
                    $tst_msg->user_instance_node_id                  =  $updatedByUserID;  //change by awdhesh soni  //$tst_msg->default_params->updated_by_id;
                    $tst_msg->user_recepient_node_id                 = preg_replace('/[\s,]+/', ',', $tst_msg->user_recepient_node_id);
                    // function call here for notification count by awdhesh soni
                    $coursedialogueobj->addNotificationOfChat($tst_msg,$systemResponse[0],1,0,'System Message');
                    $responseArr['system_message'] = $systemMessage;
                    $responseArr['timestamp_seconds'] = $timestamp_seconds;
                    $responseArr['statement_node_id'] = (string)$systemResponse[1];
                    $newMessageCountArr = $systemResponse[1];
                    $responseArr['statement_type'] = "System Message";  // added by awdhesh suggested by prem
                    $responseArr['sender_full_name'] = $userFullName;  // added by awdhesh suggested by prem

                    /*
                    * Created By: Divya Rajput
                    * Date: 11-Aug-2017
                    * Purpose: For Flash Notification
                    */
                    $recipient = array_diff(explode(",", $tst_msg->user_recepient_node_id), array(trim($tst_msg->user_instance_node_id)));
                    $default_array['admin_user_id']     = $updatedByUserID;
                    $default_array['admin_fname']       = trim($fname);
                    $default_array['admin_lname']       = trim($lname);
                    $default_array['recipients']        = $recipient;
                    $default_array['admin_profile_img'] = $adminProfileImage;
                    $default_array['production_node_id']= '';
                    $default_array['dialogue_node_id']  = $tst_msg->dialogue_node_id;
                    $default_array['notification_type'] = 'Dialogue';
                    $default_array['dialogue_title']    = $tst_msg->dialogue_title;
                    $default_array['notification_message'] = '<strong>'. $userFullName . '</strong> renamed Dialogue <strong>' . trim($oldDialogueName) . '</strong> to <strong>' . trim($new_title) . '</strong> under <strong>' . trim($tst_msg->old_course_title) . '</strong> Course';

                    $responseArr['header_notification'] = $coursedialogueobj->setNotificationData($tst_msg, $default_array);
                }

                /* For update dialogue title or course title */
                if(trim($message)!=''){
                    $tst_msg->notification = $message;
                    $tst_msg->user_instance_node_id =  $tst_msg->updated_by_id;
                    $tst_msg->dialogue_node_id      = $tst_msg->node_id;
                    $coursedialogueobj->pushNotification($tst_msg);
                }


                //echo $responseArr;
                //$tst_msg->user_recepient_node_id = implode(",",$tst_msg->user_recepient_node_id);
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'updateProductionList') {

                $reurntArray                                =   array();
                if($tst_msg->type == 'updateProductionList')
                {
                    if($tst_msg->production_node_id != '')
                    $reurntArray                            = $coursedialogueobj->getProductionDataList($tst_msg);

                    foreach($reurntArray as $userIds => $dArray)
                    {
                        if(intval($userIds) != intval($tst_msg->userID))
                        $receiver_array[] = $userIds;
                    }

                }

                $responseArr                                = array($tst_msg->production_node_id => $reurntArray);
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'sendProductionNotification') {

                $header_notification                = array();

                if(isset($tst_msg->notification_all))
                {
                    $notification_all                   = json_encode($tst_msg->notification_all);
                    $notification_all                   = json_decode($notification_all,true);
                    if(count($notification_all) > 0)
                    {
                        $recipientArr                       = array_keys($notification_all);
                        $receiver_array                     = $recipientArr;
                        $sender_id                          = $tst_msg->userID;
                        $userArray                          = current($notification_all);
                        $tst_msg->course_node_id            = $userArray['course_node_id'];
                        $tst_msg->course_title              = $userArray['course_name'];
                        $adminFirstName                     = isset($userArray['first_name']) ? $userArray['first_name'] : '';
                        $adminLastName                      = isset($userArray['last_name']) ? $userArray['last_name'] : '';
                        $adminProfileImage                  = isset($userArray['profile_image']) ? $userArray['profile_image'] : '';

                        $default_array['admin_user_id']     = $sender_id;
                        $default_array['admin_fname']       = $adminFirstName;
                        $default_array['admin_lname']       = $adminLastName;
                        $default_array['recipients']        = $recipientArr;
                        $default_array['admin_profile_img'] = $adminProfileImage;
                        $default_array['production_node_id']= $userArray['production_node_id'];
                        $default_array['notification_type'] = 'Production';
                        $default_array['action']            = 'production_all';

                        $header_notification                = $coursedialogueobj->setNotificationData($tst_msg, $default_array);
                    }
                }

                $header_notification_next           = array();
                if(isset($tst_msg->notification_next))
                {
                    $notification_next                  = json_encode($tst_msg->notification_next);
                    $notification_next                  = json_decode($notification_next,true);
                    if(count($notification_next) > 0)
                    {
                        $recipientArr                       = array($notification_next['reciver_userId']);
                        $receiver_array[]                   = $notification_next['reciver_userId'];
                        $sender_id                          = $tst_msg->userID;
                        $userArray                          = $notification_next;
                        $tst_msg->course_node_id            = $userArray['course_node_id'];
                        $tst_msg->course_title              = $userArray['course_name'];
                        $adminFirstName                     = isset($userArray['first_name']) ? $userArray['first_name'] : '';
                        $adminLastName                      = isset($userArray['last_name']) ? $userArray['last_name'] : '';
                        $adminProfileImage                  = isset($userArray['profile_image']) ? $userArray['profile_image'] : '';

                        $default_array['admin_user_id']     = $sender_id;
                        $default_array['admin_fname']       = $adminFirstName;
                        $default_array['admin_lname']       = $adminLastName;
                        $default_array['recipients']        = $recipientArr;
                        $default_array['admin_profile_img'] = $adminProfileImage;
                        $default_array['production_node_id']= $userArray['production_node_id'];
                        $default_array['notification_type'] = 'Production';
                        $default_array['action']            = 'production_next';

                        $header_notification_next           = $coursedialogueobj->setNotificationData($tst_msg, $default_array);
                    }
                }

                $tst_msg->saveType = "P";
                $responseArr['new_course']          = array(" ".trim($tst_msg->course_node_id) => array(
                                                            'status' => 'Published',
                                                            'domain' => 'Prospus',
                                                            'course_node_id' => $tst_msg->course_node_id,
                                                            'course_instance_id' => '',
                                                            'created_by' => $sender_id,
                                                            'new_production_id' => $userArray['production_node_id'],
                                                            'date'=> '',
                                                            'dialogue' => array(),
                                                            'actors' => array(),
                                                            'events' => array(),
                                                            'resources' => array(),
                                                            'production' => array(),
                                                            'user_ids' => array(),
                                                            'count' => array(
                                                                'course' => 0,
                                                                'notification' => 0,
                                                                'actors' => 0,
                                                                'dialogues' => 0,
                                                                'events' => 0,
                                                                'resources' => 0,
                                                                'production' => 0
                                                            ),
                                                            'header_notification' => $header_notification,
                                                            'header_notification_next' => $header_notification_next
                                                        )
                                                    );
            }

            $user_name = "";
            //Added  by Gaurav
            //Added on 05 July 2017
            $profileImg =  $coursedialogueobj->getProfileUserImage('', 'thumbnail');
            if(isset($tst_msg->user_instance_node_id) && (int) $tst_msg->user_instance_node_id>0){
                    //Get user profile
                    $userInstanceNodeId = (int)trim($tst_msg->user_instance_node_id);
                    
                    $accountStatus = $coursedialogueobj->getUserAccountStatus($userInstanceNodeId);
                    if($accountStatus=='guest'){
                        $profileImg = $coursedialogueobj->getProfileUserImage('', 'guest');
                    }else{
                        $propArr = array(INDIVIDUAL_PROFILE_IMAGE);
                        $getPropArr = $coursedialogueobj->getInstanceProperty($userInstanceNodeId, $propArr);
                        $profile_image = isset($getPropArr[INDIVIDUAL_PROFILE_IMAGE]) ? $getPropArr[INDIVIDUAL_PROFILE_IMAGE] : '';
                        $profileImg = $coursedialogueobj->getProfileUserImage($profile_image, 'thumbnail');
                    }
                    


            }
            //end
			if(isset($tst_msg->sender))
			{
				$user_name = $tst_msg->sender; //sender name
			}
			if(isset($tst_msg->username))
			{
				$sender_full_name = $tst_msg->username; //sender name
				$sender_full_name = htmlentities($sender_full_name);
			}
			if(isset($tst_msg->message)) {
			$user_message = $tst_msg->message; //message text

			}
			if(isset($tst_msg->lettermessage))
			{
				$user_message = $tst_msg->lettermessage; //message text
				$user_message = $user_message;
			}
			if(isset($tst_msg->attachmentName)) {
			$attachmentName = $tst_msg->attachmentName; //message text
			$attachmentName = htmlentities($attachmentName);
		//	$user_message = $user_message;
			}
			else
			{
                            $attachmentName = "null"; //message text
			}
			if(isset($tst_msg->fileTempName)) {
			$fileTempName = $tst_msg->fileTempName; //message text
			$fileTempName = htmlentities($fileTempName);
		//	$user_message = $user_message;
			}
			else
			{
				$fileTempName = "null"; //message text
			}
			if(isset($tst_msg->fileSizeByte)) {
			$fileSizeByte = $tst_msg->fileSizeByte; //message text
			$fileSizeByte = htmlentities($fileSizeByte);
		//	$user_message = $user_message;
			}
			else
			{
				$fileSizeByte = "null"; //message text
			}
			if(isset($tst_msg->dialogue_node_id)) {
				$dialogue_node_id = $tst_msg->dialogue_node_id; //message text
			}

                    if(isset($tst_msg->statement_type)){
                        $statement_type = $tst_msg->statement_type;
                    }

			if(isset($tst_msg->type)) {
			$attachment_type = $tst_msg->type; //message text
			}
			else{
			$attachment_type = "null"; //message text
			}
			if(isset($tst_msg->typing)) {
			$user_typing = $tst_msg->typing; //message text
			}
			if(isset($tst_msg->isGroupMessage)) {
			$group_message = $tst_msg->isGroupMessage; //message text
			}
			else{
			$group_message = 0;
			}
			if(isset($tst_msg->user_node)) {
			$user_node = $tst_msg->user_node; //message text
			}
			else{
				$user_node = 'null';
			}
			if(isset($tst_msg->action)) {
				$action = $tst_msg->action; //action perform
			}
			else{
				$action = 'null'; //action perform
			}

                        if(isset($tst_msg->chat_type)){
                            $chat_type = $tst_msg->chat_type;
                        }else {
                            $chat_type = '';
                        }


			/* varible define by awdhesh soni*/
			if(isset($tst_msg->user_recepient_node_id)){
			$user_recepient_node_id = $tst_msg->user_recepient_node_id; //actor name
			}else {
				$user_recepient_node_id = '';
			}
			if(isset($tst_msg->user_instance_node_id)){
				$user_instance_node_id = $tst_msg->user_instance_node_id; //sender name
				$user_instance_node_id = $user_instance_node_id;
			}else {
				$user_instance_node_id = '';
			}
			if(isset($tst_msg->type)){
			     $courseDialoguetype = $tst_msg->type; // courseDialoguetype}
			}else {
				$courseDialoguetype = '';
			}
			if(isset($tst_msg->course_node_id)){$course_node_id = trim($tst_msg->course_node_id);}
			else {$course_node_id = '';}
			if(isset($tst_msg->dialogue_title)){$dialogue_title = $tst_msg->dialogue_title;}else {$dialogue_title = '';}
			if(isset($tst_msg->course_title)){$course_title = $tst_msg->course_title;}else {$course_title = '';}
                        if(isset($tst_msg->statement_updated_timestamp)){$statement_updated_timestamp = $tst_msg->statement_updated_timestamp;}else {$statement_updated_timestamp = '';}

			if(isset($tst_msg->statement_node_id))
			{

				if(empty($tst_msg->statement_node_id)){
					$statement_node_id = '0000~0000';
				}else {
					$statement_node_id = $tst_msg->statement_node_id;
				}
			}

			//For reply Message
			if(isset($tst_msg->reply) && is_array($tst_msg->reply) && count($tst_msg->reply)){
                $reply = $tst_msg->reply;
            }else{
			    $reply = array();
            }
			if(isset($tst_msg->courseStatementType)){$courseStatementType = $tst_msg->courseStatementType;}else {$courseStatementType = '';}
			if(isset($tst_msg->diaStatusType)){$diaStatusType = $tst_msg->diaStatusType;}else {$diaStatusType = '';}
			if(isset($tst_msg->saveType)){$saveType = $tst_msg->saveType;}else {$saveType = '';}
			if(isset($tst_msg->blank_instance_node_id)){$blank_instance_node_id = $tst_msg->blank_instance_node_id;}
			else {$blank_instance_node_id = '';}
			if(isset($tst_msg->selectType)){$selectType = $tst_msg->selectType;}
			else {$selectType = '';}
			if(isset($tst_msg->getAttachment)){$getAttachment = $tst_msg->getAttachment;}else {$getAttachment = 'null';}
			if(isset($tst_msg->node_instance_propertyid)){$nodeInstancePropertyId = $tst_msg->node_instance_propertyid;}else {$nodeInstancePropertyId = 'null';}
            $arrayName      = array('addCourse','addDialogue','updateDialogTitle','updateCourseTitle','addCourseDialogueActorAndStatement','appendStatementForDialogueClass','appendStatementForDialogueLetterClass','appendStatementForDialogueLetterClassModified','deleteStatementMsg','deleteLetterStatementMsg','addUpdateParticipant','removeParticipant');
            $arrayName2     = array('appendStatementForDialogueClass','appendStatementForDialogueLetterClass','appendStatementForDialogueLetterClassModified','deleteStatementMsg','deleteLetterStatementMsg');
            $newArray1      = array('addProductionCourse','editProductionCourse','updateProductionList','sendProductionNotification');

			//prepare data to be sent to client
			if (in_array($courseDialoguetype, $arrayName))
			{
			  	if (in_array($courseDialoguetype, $arrayName2))
			  		{
			  			$action = $courseDialoguetype;
			  		}else {
			  			$action = $action;
			  		}
				date_default_timezone_set("Asia/Calcutta");
				$dt = new DateTime();
				$dtformat =  $dt->format('l, M d, Y - h:i A');
				$date_time =  $dt->format('Y-m-d H:i');
				$timestamp_seconds = $dt->getTimestamp();
                $default_params = isset($tst_msg->default_params) ? $tst_msg->default_params : '';


                // for multiline chats
                if(is_array($statement_node_id)) {
                    $br_converted = preg_replace('#<br />(\s*<br />)+#', '<br />', nl2br($user_message));
                    $temp         = explode('<br />', $br_converted);

                    $multiChats = array();
                    $i = 0;
                    foreach($statement_node_id as $stateId) {
                        $multiChats[] = array('node_instance_propertyid' => $stateId, 'statement' => $temp[$i], 'statement_type' => 'Statement', 'updated_status' => '0');
                        $i++;
                    }
                    $user_message = $multiChats;
                    $statement_node_id = implode("~", $statement_node_id);
                }
                $newMessageCountArr = is_array($newMessageCountArr) ? $newMessageCountArr : array($newMessageCountArr);
                //Added by Gaurav
                //Added on 18 Aug 2017
                //For send mail
                //send mail
                if($tst_msg->type=="addCourseDialogueActorAndStatement"){

                        $adminUserId = $tst_msg->user_instance_node_id;
                        $actorArr = $actorList['actor_list'];
                        $adminFirstName = $actorArr[$tst_msg->user_instance_node_id]['first_name'];
                        $adminLastName = $actorArr[$tst_msg->user_instance_node_id]['last_name'];
                        $fromEmail = ADMIN_CONFIG['email'];//$actorArr[$tst_msg->user_instance_node_id]['email'];
                        unset($actorArr[$tst_msg->user_instance_node_id]);
                        $toUserList = array();
                        foreach($actorArr as $key=>$val){
                            $toUserList[] = array('actorID'=>$val['user_id'], 'email'=>$val['email'],'firstName'=>$val['first_name'],'accountStatus'=>$val['account_status']);
                        }
                        //echo "********************";
                        //print_r($toUserList);
                        //echo "********************";
                        $toEmailArr = array_column($actorArr,'email');
                        $adminFullName = $adminFirstName." ".$adminLastName;
                        $params = array();
                        $params['dialogueTitle'] =  $dialogue_title;
                        $params['courseTitle'] =  $course_title;

                        $params['from'] = $fromEmail;
                        $params['toUserList'] = $toUserList;
                        if($tst_msg->course_dialogue_type=="new"){
                            $params['subject'] = "New Course Created - ".$course_title;
                            $params['template'] = "add-course-dialogue";
                            
                        }else{
                            $params['subject'] = "New Dialogue Created - ".$dialogue_title;
                            $params['template'] = "add-dialogue";
                           
                        }
                        $params['adminName'] = $adminFullName;
                        $params['courseId'] = $tst_msg->course_node_id;
                        $params['dialogueId'] = $tst_msg->dialogue_node_id;
                        $params['type'] = $tst_msg->type;
                        
                        

                        $mailRes = $coursedialogueobj->callPUMailer($params);//send mail
                        print_r($mailRes);

                }elseif ($tst_msg->type == "addUpdateParticipant") {
                        $actorArr = $responseArr['actor_list'];
                        $fromEmail = ADMIN_CONFIG['email'];//$actorArr[$tst_msg->user_instance_node_id]['email'];
                        $adminFirstName = $actorArr[$tst_msg->user_instance_node_id]['first_name'];
                        $adminLastName = $actorArr[$tst_msg->user_instance_node_id]['last_name'];
                        $adminFullName = $adminFirstName." ".$adminLastName;
                        $toUserList = array();
                        foreach($tst_msg->new_user_recepient_node_id as $val){
                            $toUserList[] = array('actorID'=>$actorArr[$val]['user_id'], 'email'=>$actorArr[$val]['email'],'firstName'=>$actorArr[$val]['first_name'], 'accountStatus'=>$actorArr[$val]['account_status']);
                        }
                        //echo "********************";
                        //print_r($toUserList);
                        //echo "********************";
                        $params = array();
                        $params['adminName'] =  $adminFullName;
                        $params['dialogueTitle'] =  $dialogue_title;
                        $params['courseTitle'] =  $course_title;
                        $params['template'] = "add-participant";
                        $params['from'] = $fromEmail;
                        $params['toUserList'] = $toUserList;
                        $params['courseId'] = $tst_msg->course_node_id;
                        $params['dialogueId'] = $tst_msg->dialogue_node_id;
                        $params['subject'] = "You are added in ".$dialogue_title." Dialogue";
                        $params['type'] = $tst_msg->type;
                        print_r($params);
                        $mailRes = $coursedialogueobj->callPUMailer($params);//send mail
                        print_r($mailRes);
                }

                $resPonseArr = array('type'=>$courseDialoguetype, 'user_actor_node_id'=>$user_recepient_node_id, 'user_current_session_id'=>$user_instance_node_id,'action'=>$action,
                    'selectType'=>$selectType,'course_node_id'=>(string)$course_node_id,'sender_full_name'=>$sender_full_name,'dialogue_node_id'=>(string)$dialogue_node_id, 'message'=>$user_message,
                    'dialogue_title'=>$dialogue_title,'nodeInstancePropertyId'=>$nodeInstancePropertyId, 'chat_type' => $chat_type,
                    'time'=>$dtformat,'timestamp_seconds'=>$timestamp_seconds,'date_time'=>$date_time,'statement_node_id'=>(string)$statement_node_id,'courseStatementType'=>$courseStatementType,
                    'course_title'=>$course_title,'diaStatusType'=>$diaStatusType,'getAttachment'=>$getAttachment,'attachmentName'=>$attachmentName,
                    'fileTempName'=>$fileTempName,'fileSizeByte'=>$fileSizeByte,'saveType'=>$saveType,'blank_instance_node_id'=>$blank_instance_node_id,'default_params'=>$default_params,

                     'statement_type'=>$statement_type,'responseArr'=>$responseArr, 'newMessageCountArr'=>$newMessageCountArr,'statement_updated_timestamp'=>$statement_updated_timestamp,'profile_image'=>$profileImg,
                    'first_name'=>$first_name, 'last_name'=>$last_name
                );

                if(count($reply)){
                    $resPonseArr['reply'] = $reply;
                }

			  	$response_text = mask(json_encode($resPonseArr));

                //Added by Gaurav
                // Modified by: Amit Malakar
                //Send data to recipients
                if(isset($tst_msg->saveType) && $tst_msg->saveType == 'P') {
                    if(isset($user_instance_node_id) && isset($user_recepient_node_id)){
                        if(strpos($user_recepient_node_id,$user_instance_node_id) !== false) {
                            $recepient_ids = $user_recepient_node_id;   // user id already exists
                        } else {                                        // user id don't exists
                            $recepient_ids = $user_recepient_node_id . ',' . $user_instance_node_id;
                        }
                    }else {
                        $recepient_ids = $user_recepient_node_id . ',' . $user_instance_node_id;
                    }

                } else {    // in case of draft
                    $recepient_ids = $user_instance_node_id;
                }
				send_message($response_text, $recepient_ids); //send data
			}
            else if(in_array($courseDialoguetype, $newArray1)){
                //added by Gaurav
                //added on 18 Aug 2017
                //for mail
                if ($tst_msg->type == "addProductionCourse"){

                        $adminUserId = $tst_msg->created_by;
                        $actorArr = $actorList['actor_list'];
                        $adminFirstName = $actorArr[$tst_msg->created_by]['first_name'];
                        $adminLastName = $actorArr[$tst_msg->created_by]['last_name'];
                        $fromEmail = ADMIN_CONFIG['email'];//$actorArr[$tst_msg->created_by]['email'];
                        $assignRoleArr = array();
                        foreach($tst_msg->roles as $key=>$val){
                            $actorName = $actorArr[$val->user_id]['first_name']." ".$actorArr[$val->user_id]['last_name'];
                            $assignRoleArr[$val->user_id]['actorID'] = $val->user_id;
                            $assignRoleArr[$val->user_id]['actorName'] = $actorName;
                            $assignRoleArr[$val->user_id]['role'] = $roleArray[$val->role_id];
                        }
                        unset($actorArr[$tst_msg->created_by]);
                        $toUserList = array();
                        foreach($actorArr as $key=>$val){
                            $toUserList[] = array('actorID'=>$val['actor_id'], 'role'=>$assignRoleArr[$val['actor_id']]['role'], 'email'=>$val['email'],'firstName'=>$val['first_name'], 'accountStatus'=>$val['account_status']);
                        }
                        $toEmailArr = array_column($actorArr,'email');
                        $adminFullName = $adminFirstName." ".$adminLastName;
                        $params = array();
                        $params['adminName'] =  $adminFullName;
                        $params['courseTitle'] =  $course_title;
                        $params['template'] = "add-production-course";
                        $params['from'] = $fromEmail;
                        $params['toUserList'] = $toUserList;
                        $params['roles'] = $assignRoleArr;
                        $params['subject'] = "New Course Created - ".$course_title;
                        $params['courseId'] = $tst_msg->course_node_id;
                        $params['productionId'] = $tst_msg->production_node_id;
                        $params['productionTitle'] = $tst_msg->production_title;
                        print_r($params);
                        $mailRes = $coursedialogueobj->callPUMailer($params);//send mail
                        print_r($mailRes);

                }
                /* Add By Arvind */
                $action         =   $courseDialoguetype;
                date_default_timezone_set("Asia/Calcutta");
                $dt = new DateTime();
                $dtformat =  $dt->format('l, M d, Y - h:i A');
                $date_time =  $dt->format('Y-m-d H:i');
                $timestamp_seconds = $dt->getTimestamp();
                $default_params = isset($tst_msg->default_params) ? $tst_msg->default_params : '';

                if($courseDialoguetype == 'updateProductionList')
                {
                    $response_text  =   mask(json_encode(
                                        array(
                                            'type'                              => $courseDialoguetype,
                                            'action'                            => $action,
                                            'production_node_id'                => $tst_msg->production_node_id,
                                            'default_params'                    => $default_params,
                                            'responseArr'                       => $responseArr
                                        ))
                                    );

                    //Send data to recipients
                    $recepient_ids                          = implode(',',$receiver_array);
                    send_message($response_text, $recepient_ids); //send data
                }
                else
                {
                    $response_text  =   mask(json_encode(
                                        array(
                                            'type'                              => $courseDialoguetype,
                                            'action'                            => $action,
                                            'course_node_id'                    => $course_node_id,
                                            'user_actor_node_id'                => '',
                                            'user_current_session_id'           => '',
                                            'selectType'                        => '',
                                            'sender_full_name'                  => '',
                                            'dialogue_node_id'                  => '',
                                            'message'                           => '',
                                            'dialogue_title'                    => '',
                                            'nodeInstancePropertyId'            => '',
                                            'chat_type'                         => '',
                                            'time'                              => $dtformat,
                                            'timestamp_seconds'                 => $timestamp_seconds,
                                            'date_time'                         => $date_time,
                                            'statement_node_id'                 => '',
                                            'courseStatementType'               => '',
                                            'course_title'                      => $course_title,
                                            'diaStatusType'                     => '',
                                            'getAttachment'                     => '',
                                            'attachmentName'                    => '',
                                            'fileTempName'                      => '',
                                            'fileSizeByte'                      => '',
                                            'saveType'                          => $saveType,
                                            'blank_instance_node_id'            => '',
                                            'default_params'                    => $default_params,
                                            'statement_type'                    => '',
                                            'responseArr'                       => $responseArr
                                        ))
                                    );

                    //Send data to recipients
                    if(isset($tst_msg->saveType) &&  $tst_msg->saveType == 'P') {
                        $recepient_ids                          = implode(',',$receiver_array);
                    } else {    // in case of draft
                        $recepient_ids                          = $sender_id;
                    }
                    send_message($response_text, $recepient_ids); //send data
                }


            }
            elseif(isset($tst_msg->userid))
            {
				$key = array_search($changed_socket, $clients);
				$userid[$key] = $tst_msg->userid;
				$username[$key] = $tst_msg->username;
                $default_params = isset($tst_msg->default_params) ? $tst_msg->default_params : '';
				$response_text = mask(json_encode(array('type'=>'system', 'username'=>$username, 'userid'=>$userid,'default_params'=>$default_params)));
				send_message($response_text,"All");
			}
			break 2; //exist this loop
		}

                //$buf = @socket_read($changed_socket, 1024000, PHP_NORMAL_READ);
                // modified by awdhesh soni
                try{
                    $buf = @socket_read($changed_socket, 1024000, PHP_NORMAL_READ);
                }catch(Exception $e){
                    socketExceptionMail($e);
                }

    	if ($buf === false) { // check disconnected client
			// remove client for $clients array
			$found_socket = array_search($changed_socket, $clients);
			//socket_getpeername($changed_socket, $ip);
                        try{
                            socket_getpeername($changed_socket, $ip);
                        }catch(Exception $e){
                            socketExceptionMail($e);
                        }

			unset($userid[$found_socket]);
			unset($username[$found_socket]);
			unset($clients[$found_socket]);
            $default_params = isset($tst_msg->default_params) ? $tst_msg->default_params : '';
			//notify all users about disconnected connection
			$response = mask(json_encode(array('type'=>'offline', 'username'=>$username, 'userid'=>$userid, 'default_params'=>$default_params)));
			send_message($response,"All");
		}
	}
}
// close the listening socket
print_r(array('socket_closed', $sock));
//socket_close($sock);
// modified by awdhesh soni
try{
    socket_close($sock);
}catch(Exception $e){
        socketExceptionMail($e);
 }

function send_message($msg, $msgTo)
{
    global $clients;
    global $userid;
    if ($msgTo != "All") {
        $msgTo = array_unique(explode(',', $msgTo));
        //print_r(array($clients,$userid,$msgTo));
        foreach ($msgTo as $id) {

            $getKeys = array_keys($userid, $id);
            foreach ($getKeys as $myid) {
                //@socket_write($clients[$myid], $msg, strlen($msg));
                // modified by awdhesh soni
                try{
                @socket_write($clients[$myid], $msg, strlen($msg));
                }catch(Exception $e){
                    socketExceptionMail($e);
                }
            }
        }
    }
    else{
        foreach($clients as $changed_socket)
        {
            //@socket_write($changed_socket,$msg,strlen($msg));
            // modified by awdhesh soni
            try{
            @socket_write($changed_socket,$msg,strlen($msg));
            }catch(Exception $e){
                socketExceptionMail($e);
            }
        }
    }
    return true;
}
    //Unmask incoming framed message
function unmask($text) {
    $length = ord($text[1]) & 127;
    if($length == 126) {
        $masks = substr($text, 4, 4);
        $data = substr($text, 8);
    }
    elseif($length == 127) {
        $masks = substr($text, 10, 4);
        $data = substr($text, 14);
    }
    else {
        $masks = substr($text, 2, 4);
        $data = substr($text, 6);
    }
    $text = "";
    for ($i = 0; $i < strlen($data); ++$i) {
        $text .= $data[$i] ^ $masks[$i%4];
    }
    return $text;
}
//Encode message for transfer to client.
function mask($text)
{
    $b1 = 0x80 | (0x1 & 0x0f);
    $length = strlen($text);
    if($length <= 125)
        $header = pack('CC', $b1, $length);
    elseif($length > 125 && $length < 65536)
        $header = pack('CCn', $b1, 126, $length);
    elseif($length >= 65536)
        $header = pack('CCNN', $b1, 127, $length);
    return $header.$text;
}
//handshake new client.
function perform_handshaking($receved_header,$client_conn, $host, $port)
{
    $headers = array();
    $lines = preg_split("/\r\n/", $receved_header);
    foreach($lines as $line)
    {
        $line = chop($line);
        if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
        {
            $headers[$matches[1]] = $matches[2];
        }
    }
    $socketKey = (isset($headers['Sec-WebSocket-Key'])) ? $headers['Sec-WebSocket-Key'] : "";
    $secKey = $socketKey;
    $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    //hand shaking header
    $upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
    "Upgrade: websocket\r\n" .
    "Connection: Upgrade\r\n" .
    "WebSocket-Origin: $host\r\n" .
    "WebSocket-Location: ws://$host:$port/demo/shout.php\r\n".
    "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
    socket_write($client_conn,$upgrade,strlen($upgrade));
}

/**
 * Function to send Mail on Socket Error
 */
function socketErrorMail(){
    mail("prospus.awedheshsoni@gmail.com", "Error Mail!", socket_strerror(socket_last_error()));
}

function socketExceptionMail($e){
    mail("prospus.awedheshsoni@gmail.com", "Exception Mail!", $e->getMessage());
    //mail("prospus.amitmalakar@gmail.com", "Exception Mail!", $e->getMessage());
    socketErrorMail();
}
