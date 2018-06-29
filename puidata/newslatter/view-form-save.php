<?php 
ini_set("display_errors",0);
header("Access-Control-Allow-Origin: *");
include "builderApi.php";
$builderApiObj					=	new builderApi();

if($_POST)
{
	$post                       =   $_POST;
	$action                     =   $post['action'];
	$json 						=	array();
	parse_str($post['data'],$postArray);

	if($action == 'single') 
	{
		$dataArray								=	array();
		$dataArray['node_class_id']				=	$postArray['node_class_id'];
		$dataArray['node_class_property_id']	=	$postArray['instance_property_id'];
		$dataArray['value']						=	$postArray['instance_property_caption'];
		$dataArray['is_email']					=	'N';
		
		$returnResponse							=	$builderApiObj->setDataAndStructure($dataArray,'1','6');

		$json    								=   json_decode($returnResponse,true);

		print json_encode($json);
		exit;
	}

	/* For Demo Purpose */
	/*if($action == 'subscribe')
	{
		$node_class_ids 		= 	explode(',',$postArray['node_class_id']);
		$node_y_id 				=	$postArray['node_y_id'];
		$node_x_id_array 		=	array();

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
	}*/
}

?>