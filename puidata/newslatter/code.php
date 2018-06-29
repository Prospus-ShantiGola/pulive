<?php 
ini_set("display_errors",0);
header("Access-Control-Allow-Origin: *");
include "builderApi.php";
require('Mailchimp.php');
$builderApiObj					=	new builderApi();
if($_POST)
{
	$post                       =   $_POST;
	$action                     =   $post['action'];
	if($action == 'subscribe')
	{
		$json 					=	array();
		parse_str($post['data'],$postArray);

		$node_class_ids 		= 	explode(',',$postArray['node_class_id']);
		$node_y_id 				=	$postArray['node_y_id'];
		$node_x_id_array 		=	array();
		$Mailchimp 				= 	new Mailchimp($builderApiObj->decrypt($postArray['chimp_api_key']));
		$Mailchimp_Lists 		= 	new Mailchimp_Lists( $Mailchimp );

		// for live
		$live = 1;
		$isDatabaseInserted = 1;
		if($live ==1) {
			if(isset($postArray['use_type']) && $postArray['use_type'] == 'external')
			{
				$merge_vars = array('FNAME'=>$postArray['instance_property_caption'][0], 'LNAME'=>$postArray['instance_property_caption'][1]);				
				try {
					$subscriber = $Mailchimp_Lists->subscribe( $builderApiObj->decrypt($postArray['chimp_list_id']), array( 'email' => htmlentities($postArray['instance_property_caption'][2]) ),$merge_vars );	
				} catch(Mailchimp_Error $e) {
					$json['result']							=	1;
					$json['msg']							=	$e->getMessage();
					$isDatabaseInserted = 0;
				}
			}
			else {	
				try {
					$subsriber = $Mailchimp_Lists->subscribe( $builderApiObj->decrypt($postArray['chimp_list_id']), array( 'email' => htmlentities($postArray['instance_property_caption'][0]) ) );// for local
				} catch(Mailchimp_Error $e){
					// error message goes here	
					$json['result']							=	1;
					$json['msg']							=	$e->getMessage();
					$isDatabaseInserted = 0;
				}
			}	
		}
		
		//$subscriber['leid']		=	'111111';
		if (intval($isDatabaseInserted) == 1 ) 
		{
			foreach($node_class_ids as $index => $node_class_id)
			{
				$dataArray								=	array();
				$instance_property_id_array				=	$postArray['instance_property_id'];
				$instance_property_caption_array		=	$postArray['instance_property_caption'];
				$dataArray['node_class_id']				=	$node_class_id;
				$dataArray['node_class_property_id']	=	$instance_property_id_array;
				$dataArray['value']						=	$instance_property_caption_array;
				$dataArray['is_email']					=	'N';
				
				$returnResponse							=	$builderApiObj->setDataAndStructure($dataArray,'1','6');

				$returnArray    						=   json_decode($returnResponse,true);

				if(intval($returnArray['result']) == 0)
				{
					$node_x_id_array[]					=	$returnArray['data'];
				}

				if(!isset($json['result']) && $json['result'] != 1){
				 $json['result']							=	$returnArray['result'];
				 $json['msg']							=	$returnArray['msg'];
				}
			}

			if(count($node_x_id_array) > 0)
			{
				$newArray['node_y_id']					=	$node_y_id;	
				$newArray['node_x_ids']					=	$node_x_id_array;	

				$returnResponse							=	$builderApiObj->setDataAndStructure($newArray,'7','9');
			}
			
			print json_encode($json);
			exit;
		}
		else
		{
		    //$json['result']							=	1;
			//$json['msg']							=	'Please try again later.';
			print json_encode($json);
			exit;
		}
	}
	
	// Code for recording user subcription email coming from creeprice.com coming soon page
	if($action == 'creelprice_subcription')
	{
		$json 					=	array();
		parse_str($post['data'],$postArray);
		

		$node_class_ids 		= 	explode(',',$postArray['node_class_id']);
		$node_y_id 				=	$postArray['node_y_id'];
		$node_x_id_array 		=	array();
		$live = 1;
		$isDatabaseInserted = 1;
		
		
		$first_name = $postArray['instance_property_caption'][0];
		$last_name = $postArray['instance_property_caption'][1];
		$email = $postArray['instance_property_caption'][2];		
		
		$message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<title>Thnaks Email</title>
		</head>
		<body>
		<table width="800" border="0" align="center" cellpadding="0" cellspacing="0">
		<tr>
			<td valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="10">							
				<tr>
					<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">Dear Admin, <br/><br/> A new user has subscribed. Please see details given below. </td>
						</tr>				
							<tr>
								<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">
									First Name: '.$first_name.' <br/>
									Last Name: '.$last_name.' <br/>
									Email : '.$email.'	<br/>
								</td>
							</tr>
							
							<tr>
									<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">Regards,<br />Team Creelprice.com</td>
							</tr>				
					</table></td>
			</tr>
		</table>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		</body>
		</html> ';
		
		$subject = "Creelprice.com newsletter subscription email";
		$to = 'lydia.hascott@creelprice.com';
		$from = "info@creelprice.com";			
		$headers = '';
		$headers = 'MIME-Version: 1.0'.PHP_EOL;
		$headers .= 'Content-type: text/html; charset=iso-8859-1'.PHP_EOL;
		$headers .= 'From: '.@$from.'<'.@$from.'>'.PHP_EOL;			
		// Mail is diabled for now	
		mail($to,$subject,$message,$headers);
	
		//$subscriber['leid']		=	'111111';
		if (intval($isDatabaseInserted) == 1 ) 
		{
			foreach($node_class_ids as $index => $node_class_id)
			{
				$dataArray								=	array();
				$instance_property_id_array				=	$postArray['instance_property_id'];
				$instance_property_caption_array		=	$postArray['instance_property_caption'];
				$dataArray['node_class_id']				=	$node_class_id;
				$dataArray['node_class_property_id']	=	$instance_property_id_array;
				$dataArray['value']						=	$instance_property_caption_array;
				$dataArray['is_email']					=	'N';
				
				$returnResponse							=	$builderApiObj->setDataAndStructure($dataArray,'1','6');

				$returnArray    						=   json_decode($returnResponse,true);

				if(intval($returnArray['result']) == 0)
				{
					$node_x_id_array[]					=	$returnArray['data'];
				}

				if(!isset($json['result']) && $json['result'] != 1){
				 $json['result']							=	$returnArray['result'];
				 $json['msg']							=	$returnArray['msg'];
				}
			}
			if(count($node_x_id_array) > 0)
			{
				$newArray['node_y_id']					=	$node_y_id;	
				$newArray['node_x_ids']					=	$node_x_id_array;	
				$returnResponse							=	$builderApiObj->setDataAndStructure($newArray,'7','9');
			}
			print json_encode($json);
			exit;
		}
		else
		{
		    $json['result']							=	1;
			$json['msg']							=	'Please try again later.';
			print json_encode($json);
			exit;
		}
	}
	
	
	
	if($action == 'AngelPitchForm')
	{
		$json 					=	array();
		parse_str($post['data'],$postArray);

		$node_class_id 		= 	$postArray['node_class_id'];
		
		$Mailchimp 				= 	new Mailchimp($builderApiObj->decrypt($postArray['chimp_api_key']));
		$Mailchimp_Lists 		= 	new Mailchimp_Lists( $Mailchimp );

		// for live
		$live = 0;
		$isDatabaseInserted = 1;
		if($live ==1) {
				$name_array = explode(" ",$postArray['instance_property_caption'][0]);
				$merge_vars = array('FNAME'=>$name_array[0], 'LNAME'=>$name_array[1]);				
				try {
					$subscriber = $Mailchimp_Lists->subscribe( $builderApiObj->decrypt($postArray['chimp_list_id']), array( 'email' => htmlentities($postArray['instance_property_caption'][1]) ),$merge_vars );	
				} catch(Mailchimp_Error $e) {
					 $json['result']							=	0;
					 // Store error message returned from Mailchimp
					 $json['msg']							=	$e->getMessage();
				}
			
			$uemail = $postArray['instance_property_caption'][1];	
			$body = get_email_template($name_array[0],$uemail);
			$subject = "Registration Confirmation ";
			$to = $uemail;			
			$message = $body;			
			$from = "connect@investible.com";			
			$headers = '';
			$headers = 'MIME-Version: 1.0'.PHP_EOL;
            $headers .= 'Content-type: text/html; charset=iso-8859-1'.PHP_EOL;
            $headers .= 'From: '.@$from.'<'.@$from.'>'.PHP_EOL;			
			// Mail is diabled for now
			//mail($to,$subject,$message,$headers);
			
		}
		
		//$subscriber['leid']		=	'111111';
		if (intval($isDatabaseInserted) == 1 ) 
		{
				$dataArray								=	array();
				$instance_property_id_array				=	$postArray['instance_property_id'];
				$instance_property_caption_array		=	$postArray['instance_property_caption'];
				$dataArray['node_class_id']				=	$node_class_id;
				$dataArray['node_class_property_id']	=	$instance_property_id_array;
				$dataArray['value']						=	$instance_property_caption_array;
				$dataArray['is_email']					=	'N';				
				
				if($postArray['save'] == 1)
				 $returnResponse						=	$builderApiObj->setDataAndStructure($dataArray,'1','6');

				$returnArray    						=   json_decode($returnResponse,true);
				$json['data']							=	$dataArray;
				//if(!isset($json['result']) && @$json['result'] != 1){
				 //$json['result']							=	$returnArray['result'];
				  $json['result']							=	1;
				  $json['msg']								=	$returnArray['msg'];
				//}
				print json_encode($json);
				
				/* Saving form data into separate table for further uses */
				/*$con = $builderApiObj->dbConnection();				
				$query = "INSERT INTO angel_pitch_registration_data SET
						full_name = '".$dataArray['value'][0]."',
						email = '".$dataArray['value'][1]."',
						phone_number = '".$dataArray['value'][2]."',
						question0='".$dataArray['value'][3]."',
						question1='".$dataArray['value'][4]."',
						question2='".$dataArray['value'][5]."',
						question3='".$dataArray['value'][6]."',
						question4='".$dataArray['value'][7]."',
						question5='".$dataArray['value'][8]."',
						question6='".$dataArray['value'][9]."',
						added_date='".$dataArray['value'][10]."'";
				mysql_query($query,$con);		*/
				/* Saving form data into separate table for further uses end here*/						
				exit;
		}
		else
		{
		    $json['result']				=	1;
			$json['msg']				=	'Please try again later.';
			print json_encode($json);
			exit;
		}	
	}	
}

function get_email_template($name, $email) {

	$str = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Thnaks Email</title>
	</head>

	<body>

	<table width="800" border="0" align="center" cellpadding="0" cellspacing="0">
			<tr>
					<td valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="10">
							
							<tr>
									<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">Dear '.$name.', </td>
							</tr>
				
							<tr>
									<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">Thank you for regsitering with us.</td>
							</tr>
							<tr>
									<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">If you have any questions, please  contact our team at <a href="mailto:connect@investible.com">connect@investible.com</a> for anymore information</td>
							</tr>
							<tr>
									<td valign="top" style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">Regards,<br />Team Investible</td>
							</tr>				
					</table></td>
			</tr>
	</table>
	<p>&nbsp;</p>
	<p>&nbsp;</p>
	</body>
	</html> ';
	return $str;
}
?>