<?php
error_reporting(0);
set_time_limit(0);
$host =  'localhost';//$_SERVER['HTTP_HOST'];

//$host =  '52.32.152.199';//$_SERVER['HTTP_HOST'];
$port = '9000'; //port
$null = NULL; //null var

//Create TCP/IP sream socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) ;
//reuseable port
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
//bind socket to specified host
socket_bind($socket, 0, $port);

//listen to port
socket_listen($socket);

//create & add listning socket to the list
$clients = array($socket);
$userid = array(0);
//$userid = array(0);
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
		$lent = strlen($header);

		//echo "\nDATA: ".$lent."\n";
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
			//echo "<br/>";
		    $received_text = unmask($buf); //unmask data
			//echo "<pre>";print_r($received_text);
			$tst_msg = json_decode($received_text); //json decode 
			
		
			echo "<pre>";print_r($tst_msg);
			
			if(isset($tst_msg->sender)) {
			$user_name = $tst_msg->sender; //sender name
			}
			
			if(isset($tst_msg->username))
			{
				$sender_full_name = $tst_msg->username; //sender name
				$sender_full_name = htmlentities($sender_full_name);
			}
			
			if(isset($tst_msg->message)) {
			$user_message = $tst_msg->message; //message text
			
			$user_message = htmlentities($user_message);		
		//	$user_message = $user_message;			
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
			
			if(isset($tst_msg->messageto)) {
			$message_to = $tst_msg->messageto; //message text	
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
			if(isset($tst_msg->course_instance_node_id)) {
			$course_id = $tst_msg->course_instance_node_id; //message text	
			}
			else{
			$course_id = 'null'; //action perform
			}
			if(isset($tst_msg->node_instance_propertyid)) {
			$node_instance_propertyid = $tst_msg->node_instance_propertyid; //message text	
			}
			else{
			$node_instance_propertyid = 'null'; //action perform
			
			}
			if(isset($tst_msg->random_id)) {
			$random_id = $tst_msg->random_id; //message text	
			}
			else{
			$random_id = 'null'; //action perform
			
			}
			
			
						
			//prepare data to be sent to client
			if($group_message==1) {
				
				date_default_timezone_set("Asia/Calcutta");	
				$dt = new DateTime();
				$dtformat =  $dt->format('l, M d, Y - h:i A');	
				$date_time =  $dt->format('Y-m-d H:i');			
				$timestamp_seconds = $dt->getTimestamp();				
				$response_text = mask(json_encode(array('type'=>'group', 'name'=>$user_name,'sender_full_name'=>$sender_full_name,
				'messageTo'=>$message_to, 'message'=>$user_message,'user_node'=>$user_node ,'attachment'=>$attachment_type,
				'time'=>$dtformat,'timestamp_seconds'=>$timestamp_seconds,'date_time'=>$date_time,
				'action'=>$action,'attachmentName'=>$attachmentName,'fileTempName'=>$fileTempName,
				'fileSizeByte'=>$fileSizeByte,'course_id'=>$course_id,'node_instance_propertyid'=>$node_instance_propertyid,'random_id'=>$random_id)));
				//echo "<pre>";print_r($response_text);	
				send_message($response_text, "All"); //send data
			}
			
			elseif(isset($tst_msg->userid)) {
						
					$key = array_search($changed_socket, $clients);
					$userid[$key] = $tst_msg->userid;
					$username[$key] = $tst_msg->username;
					$response_text = mask(json_encode(array('type'=>'system', 'username'=>$username, 'userid'=>$userid)));
					send_message($response_text,"All");
			}
			
			/* elseif(isset($tst_msg->sender)) {
		
				if($user_name!="" && !isset($tst_msg->typing)){
				date_default_timezone_set("Asia/Calcutta");	
				$dt = new DateTime();
				$dtformat =  $dt->format('l, M d, Y - h:i A');	
				$response_text = mask(json_encode(array('type'=>'usermsg', 'name'=>$user_name,'sender_full_name'=>$sender_full_name, 'messageTo'=>$message_to, 'message'=>$user_message, 'attachment'=>$attachment_type, 'time'=>$dtformat)));
				$toSend = array();
				$toSend[] = $message_to;
				$toSend[] = $user_name;
					
				send_message($response_text, $toSend); //send data
				}
			} */
			
			elseif(isset($tst_msg->typing)){
		
			$toSend = array();	
			$toSend[] = $message_to;			
			$response_text = mask(json_encode(array('type'=>'typing', 'message'=>$user_typing, 'name'=>$user_name,'sender_full_name'=>$sender_full_name,'messageTo'=>$message_to)));
			//				$response_text = mask(json_encode(array('type'=>'group', 'name'=>$user_name,'sender_full_name'=>$sender_full_name,'messageTo'=>$message_to, 'message'=>$user_message, 'attachment'=>$attachment_type, 'time'=>$dtformat,'timestamp_seconds'=>$timestamp_seconds,'date_time'=>$date_time,'action'=>$action)));
		
//send_message($response_text, $toSend); //send data
			send_message($response_text,"All"); //send data
			
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
			//notify all users about disconnected connection			
			$response = mask(json_encode(array('type'=>'offline', 'username'=>$username, 'userid'=>$userid)));
			send_message($response,"All");
		}
		
	}
}
// close the listening socket
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
				@socket_write($clients[$myid],$msg,strlen($msg));
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
