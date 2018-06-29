<?php
error_reporting(E_ALL);
include 'main_config.php';
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
    $MySQLiconn = new MySQLi($host, $username, $password, $dbName);
    /*$query      = 'SELECT COUNT(*) FROM `node`';
    $SQL        = $MySQLiconn->query($query);
    $getROW     = $SQL->fetch_array();*/
    
set_time_limit(0);
$host =  $_SERVER['HTTP_HOST'];
// $host =  'dev.pu.prospus.com';//$_SERVER['HTTP_HOST'];
//$host =  $_SERVER['HTTP_HOST'];
//$port = '9003'; //port
$port = 9002;//SOCKET_PORT; //port
$null = NULL; //null var
//Create TCP/IP sream socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
//reuseable port
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
//bind socket to specified host
socket_bind($socket, 0, $port);
//listen to port
socket_listen($socket);
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
	socket_select($changed, $null, $null, 0, 10);
	//check for new socket
	if (in_array($socket, $changed)) {
		$socket_new = socket_accept($socket); //accpet new socket
		$clients[] = $socket_new; //add socket to client array
		$header = socket_read($socket_new, 1024000); //read data sent by the socket
		perform_handshaking($header, $socket_new, $host, $port); //perform websocket handshake
		//socket_getpeername($socket_new, $ip); //get ip address of connected socket
		//$response = mask(json_encode(array('type'=>'system', 'message'=>$ip.' connected'))); //prepare json data
		//send_message($response); //notify all users about new connection
		//make room for new socket
		$found_socket = array_search($socket, $changed);
		unset($changed[$found_socket]);
	}
	//loop through all connected sockets
	foreach ($changed as $changed_socket) {
		//check for any incomming data
		while(socket_recv($changed_socket, $buf, 1024000, 0) >= 1)
		{
			$received_text = unmask($buf); //unmask data
			$tst_msg = json_decode($received_text); //json decode
            print_r($tst_msg);

            if(isset($tst_msg->type) && $tst_msg->type == 'appendStatementForDialogueClass') {
                $statementIds = $coursedialogueobj->appendStatement($tst_msg);

                if(!isset($tst_msg->statement_type)) {
                    $tst_msg->statement_type = '';
                }
                print_r($statementIds);
                // for multiline chats
                $res = explode('~', $statementIds);
                $res = count($res) == 1 ? $res[0] : $res;
                $tst_msg->statement_node_id = $res;
            } elseif(isset($tst_msg->type) && $tst_msg->type == 'appendStatementForDialogueLetterClass') {
                $statementIds = "";
                $statementIds = $coursedialogueobj->appendLetterStatement($tst_msg);
                //$explodeStatement_id = explode("-",$statementIds);
               echo $tst_msg->statement_node_id = $statementIds;

                //$tst_msg->blank_instance_node_id = $explodeStatement_id[0];
                //$tst_msg->type = "appendStatementForDialogueLetterClassModified";
            } elseif(isset($tst_msg->type) && $tst_msg->type == 'deleteStatementMsg') {
                $delete_data['node_instance_id']        = $tst_msg->node_instance_id;
                $delete_data['dialog_instance_node_id'] = $tst_msg->dialog_instance_node_id;
                $deleteRowCount                         = $coursedialogueobj->deleteStatement($delete_data);
                $tst_msg->message = 'This message has been removed.';
                print_r($deleteRowCount);
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'deleteLetterStatementMsg') {
                $delete_data['node_instance_id']        = $tst_msg->node_instance_id;
                $delete_data['dialog_instance_node_id'] = $tst_msg->dialog_instance_node_id;
                $delete_data['user_current_session_id'] = $tst_msg->user_instance_node_id;
                $tst_msg->message = array(array('statement' => '<span class="more statement_drop clearfix rmv-disabled">This message has been removed.</span>'));
                $deleteRowCount                         = $coursedialogueobj->deleteLetterStatement($delete_data);
                print_r($deleteRowCount);
            } elseif(isset($tst_msg->type) && ($tst_msg->type=="addCourse" || $tst_msg->type=="addDialogue" || $tst_msg->type=="addCourseDialogueActorAndStatement")) {
                $saveCourseRes = $coursedialogueobj->saveCourseDialouge($tst_msg);
                print_r(array('0',$saveCourseRes));
                $tst_msg->dialogue_node_id = isset($saveCourseRes['dialogue_node_id']) ? $saveCourseRes['dialogue_node_id'] : '';
                $tst_msg->course_node_id = isset($saveCourseRes['course_node_id']) ? $saveCourseRes['course_node_id'] : '';
                $tst_msg->statement_node_id = isset($saveCourseRes['statement_node_id']) ? $saveCourseRes['statement_node_id'] : '';
            }elseif(isset($tst_msg->type) && $tst_msg->type == 'addUpdateParticipant') {
                $dataArr['dialog_node_id']                 = $tst_msg->messageto;
                $dataArr['user_instance_node_id']          = $tst_msg->user_recepient_node_id;
                $dataArr['current_user_node_id']           = $tst_msg->user_instance_node_id;
                $dataArr['saveType']                       = $tst_msg->saveType;
                if($dataArr['saveType']=="P"){
                    $status = 1;
                }else {
                    $status = 0;
                }
                $dataArr['status']    = $status;
                $courseNodeId = $coursedialogueobj->fetchNodeId($tst_msg->course_instance_node_id);
                $dataArr['course_node_id']        = $courseNodeId;
                $statementIds = $coursedialogueobj->addUpdateParticipant($dataArr);
                print_r($statementIds);
                echo '3333';
            }
            elseif(isset($tst_msg->type) && $tst_msg->type == 'removeParticipant') {
                $dataArr['dialog_node_id']                 = $tst_msg->messageto;
                $dataArr['removeUser']           = $tst_msg->removeUser;
                $dataArr['user_actor_node_id']              = $tst_msg->user_instance_node_id;
                $dataArr = $coursedialogueobj->removeParticipantData($dataArr);
                print_r($dataArr);
            }
            print_r($tst_msg);
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
			/* varible define by awdhesh soni*/
			if(isset($tst_msg->user_recepient_node_id)){
			$user_recepient_node_id = $tst_msg->user_recepient_node_id; //actor name
				$user_recepient_node_id = $user_recepient_node_id;
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
			if(isset($tst_msg->course_node_id)){$course_node_id = $tst_msg->course_node_id;}
			else {$course_node_id = '';}
			if(isset($tst_msg->dialogue_title)){$dialogue_title = $tst_msg->dialogue_title;}else {$dialogue_title = '';}
			if(isset($tst_msg->course_title)){$course_title = $tst_msg->course_title;}else {$course_title = '';}
			if(isset($tst_msg->statement_node_id))
			{
				if(empty($tst_msg->statement_node_id)){
					$statement_node_id = '0000~0000';
				}else {
					$statement_node_id = $tst_msg->statement_node_id;
				}
			}
			if(isset($tst_msg->courseStatementType)){$courseStatementType = $tst_msg->courseStatementType;}else {$courseStatementType = '';}
			if(isset($tst_msg->diaStatusType)){$diaStatusType = $tst_msg->diaStatusType;}else {$diaStatusType = '';}
			if(isset($tst_msg->dialogueTitle)){$dialogueTitle = $tst_msg->dialogueTitle;}else {$dialogueTitle = "";}
			if(isset($tst_msg->saveType)){$saveType = $tst_msg->saveType;}else {$saveType = '';}
			if(isset($tst_msg->blank_instance_node_id)){$blank_instance_node_id = $tst_msg->blank_instance_node_id;}
			else {$blank_instance_node_id = '';}
			if(isset($tst_msg->selectType)){$selectType = $tst_msg->selectType;}
			else {$selectType = '';}
			if(isset($tst_msg->getAttachment)){$getAttachment = $tst_msg->getAttachment;}else {$getAttachment = 'null';}
			if(isset($tst_msg->node_instance_propertyid)){$nodeInstancePropertyId = $tst_msg->node_instance_propertyid;}else {$nodeInstancePropertyId = 'null';}
			$arrayName = array('addCourse','addDialogue','updateDialogTitle','updateCourseTitle','addCourseDialogueActorAndStatement','appendStatementForDialogueClass','appendStatementForDialogueLetterClass','appendStatementForDialogueLetterClassModified','deleteStatementMsg','deleteLetterStatementMsg','addUpdateParticipant','removeParticipant');$arrayName2 = array('appendStatementForDialogueClass','appendStatementForDialogueLetterClass','appendStatementForDialogueLetterClassModified','deleteStatementMsg','deleteLetterStatementMsg');
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
				  	$response_text = mask(json_encode(
				  		array('type'=>$courseDialoguetype, 'user_actor_node_id'=>$user_recepient_node_id, 'user_current_session_id'=>$user_instance_node_id,'action'=>$action,
				  			'selectType'=>$selectType,'course_node_id'=>$course_node_id,'sender_full_name'=>$sender_full_name,'dialogue_node_id'=>$dialogue_node_id, 'message'=>$user_message,
				  			'dialogue_title'=>$dialogue_title,'selectType'=>$selectType,'nodeInstancePropertyId'=>$nodeInstancePropertyId, 'chat_type' => $tst_msg->chat_type,
				  			'time'=>$dtformat,'timestamp_seconds'=>$timestamp_seconds,'date_time'=>$date_time,'statement_node_id'=>$statement_node_id,'courseStatementType'=>$courseStatementType,
				  			'course_title'=>$course_title,'diaStatusType'=>$diaStatusType,'dialogueTitle'=>$dialogueTitle,'getAttachment'=>$getAttachment,'attachmentName'=>$attachmentName,
				  			'fileTempName'=>$fileTempName,'fileSizeByte'=>$fileSizeByte,'saveType'=>$saveType,'blank_instance_node_id'=>$blank_instance_node_id,'default_params'=>$default_params,'statement_type'=>$statement_type
				  			)));
					send_message($response_text, "All"); //send data
				  }
				elseif(isset($tst_msg->userid)) {
					$key = array_search($changed_socket, $clients);
					$userid[$key] = $tst_msg->userid;
					$username[$key] = $tst_msg->username;
                    $default_params = isset($tst_msg->default_params) ? $tst_msg->default_params : '';
					$response_text = mask(json_encode(array('type'=>'system', 'username'=>$username, 'userid'=>$userid,'default_params'=>$default_params)));
					send_message($response_text,"All");
				}
				break 2; //exist this loop
			}
		$buf = @socket_read($changed_socket, 1024000, PHP_NORMAL_READ);
		if ($buf === false) { // check disconnected client
			// remove client for $clients array
			$found_socket = array_search($changed_socket, $clients);
			socket_getpeername($changed_socket, $ip);
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
socket_close($sock);



function send_message($msg, $msgTo)
{
    global $clients;
    global $userid;
    if($msgTo!="All"){
        foreach($msgTo as $id)
        {
            $getKeys = array_keys($userid, $id);
            foreach($getKeys as $myid)
            {
//				if(($key = array_search($myid, $userid)) !== false) {
                @socket_write($this->clients[$myid],$msg,strlen($msg));
//				}
            }
        }
    }
    else{
        foreach($clients as $changed_socket)
        {
            @socket_write($changed_socket,$msg,strlen($msg));
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
    $secKey = $headers['Sec-WebSocket-Key'];
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