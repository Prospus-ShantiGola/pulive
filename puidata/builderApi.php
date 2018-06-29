<?php
class builderApi
{
	private $web_api_url =  BUILDER_API_URL;
	public function callWebApi($api,$postvars)
	{
		$url 				= $this->web_api_url.$api;
                
		$ch 				= curl_init();	
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_POST,1);
		curl_setopt($ch,CURLOPT_POSTFIELDS,$postvars);
		curl_setopt($ch,CURLOPT_USERPWD, "marc:jf53RjhB");
    	        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch,CURLOPT_ENCODING , "");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);

		$response = curl_exec($ch);

		$http_status 		= curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		if($http_status!=200){
		  $response = "Error $http_status";
		}
		
		curl_close ($ch);
		
		return $response; 
	}

	public function getDataAndStructure($node_id,$action_id,$structure_id)
	{
		$data 				= 	array('node_id'=>$node_id, 'action_id' => $action_id, 'structure_id' => $structure_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getStructure',$options);
	}

	public function setDataAndStructure($dataArray,$action_id,$structure_id)
	{
                
		$data 				= 	array('data'=>$dataArray, 'action_id' => $action_id, 'structure_id' => $structure_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('setStructure',$options);
	}
	
	public function getUsersDialogueData($variable_data,$action_id,$structure_id)
	{
	
		$data 				= 	array('variable_data'=>$variable_data, 'action_id' => $action_id, 'structure_id' => $structure_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getDialogueByUser',$options);
	}
	
	public function getStatementByDialogue($dialog_instance_node_id,$date_obj,$action_id)
	{
		
		$data 				= 	array('dialog_instance_node_id'=>$dialog_instance_node_id,'date_obj'=>$date_obj, 'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getStatementData',$options); 
	}
	
	public function saveStatementInstance($dataArray,$action_id,$structure_id)
	{
		$data 				= 	array('data'=>$dataArray ,'action_id' => $action_id, 'structure_id' => $structure_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('saveInstance',$options);
	}

	public function saveDialogTitle($variable_data,$action_id)
	{
		$data 				= 	array('variable_data'=>$variable_data ,'action_id' => $action_id);

		$options			=	http_build_query($data);
		return $this->callWebApi('updateDialogTitle',$options);
	}

	public function getDialogueActor($dialog_instance_node_id,$action_id)
	{
	
		$data 				= 	array('dialog_instance_node_id'=>$dialog_instance_node_id ,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getDialogueActorList',$options);
	}

	public function getAllUserList($variable_data,$action_id)
	{
	
		$data 				= 	array('variable_data'=>$variable_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getAllUserListData',$options);
	}
	
	public function removeUserFromFile($dialog_data,$action_id)
	{
	
		$data 				= 	array('dialog_data'=>$dialog_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('removeUserFromFileTemp',$options);
	}

	public function saveNewActorDetail($dialog_data,$action_id)
	{
	
		$data 				= 	array('dialog_data'=>$dialog_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('saveNewActorNode',$options);
	}

	public function saveNewDialogDetail($dialog_data,$action_id)
	{
		//echo "<pre>";print_r($dialog_data);
		$data 				= 	array('dialog_data'=>$dialog_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('saveNewDialogNode',$options);
	}

	public function searchCourseByTitle($search_data,$action_id)
	{
		//print_r($search_data);
		$data 				= 	array('search_data'=>$search_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('searchCourse',$options);
	}

	public function getRandomNodeId($action_id)
	{
	
		$data 				= 	array('action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('getRandomNodeId',$options);
	}

	public function deleteStatement($delete_data,$action_id)
	{
		//print_r($delete_data);
		$data 				= 	array('delete_data'=>$delete_data,'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('deleteStatementData',$options);
	}
	
	public function checkEmailExist($email_address)
	{
		
		$data 				= 	array('email_address'=>$email_address);
		$options			=	http_build_query($data);
		return $this->callWebApi('checkEmailExistData',$options);
	}

	public function userLogin($dataArray,$action_id)
	{
		$data 				= 	array('data'=>$dataArray, 'action_id' => $action_id);
		$options			=	http_build_query($data);
		return $this->callWebApi('checkUser',$options); 
	}
        

	public function searchDialogInfo($dialog_data)
	{
		//print_r($dialog_data);
		$data 				= 	array('dialog_data'=>$dialog_data);
		$options			=	http_build_query($data);
		return $this->callWebApi('searchDialogData',$options);
	}
	
	public function deleteNotification($dialog_data)
	{
		//print_r($dialog_data);
		$data 				= 	array('dialog_data'=>$dialog_data);
		$options			=	http_build_query($data);
		return $this->callWebApi('deleteNotificationCount',$options);
	}
	public function deleteDilaogue($dialog_data)
	{
		//print_r($dialog_data);
		$data 				= 	array('dialog_data'=>$dialog_data);
		$options			=	http_build_query($data);
		return $this->callWebApi('deleteDilaogueData',$options);
	}
	public function getAllSystemActor($dialog_data)
	{
		//print_r($dialog_data);
		$data 				= 	array('dialog_data'=>$dialog_data);
		$options			=	http_build_query($data);
		return $this->callWebApi('getAllSystemActorData',$options);
	}
	public function getAllCourse($variable_data)
	{
		//print_r($variable_data);
		$data 				= 	array('variable_data'=>$variable_data);
		$options			=	http_build_query($data);
		return $this->callWebApi('getAllCourseData',$options);
	}

	public function getMenuStructure($domain_name)
	{
		$data 				= 	array('domain_name'=>$domain_name);
		$options			=	http_build_query($data);
		return $this->callWebApi('getMenuStructure',$options);
	}

	public function getPluginStructure($domain_name)
	{
		$data 				= 	array('domain_name'=>$domain_name);
		$options			=	http_build_query($data);
		return $this->callWebApi('getPluginStructure',$options);
	}
        public function validateEmail()
	{
                
		return $this->callWebApi('validateEmail',http_build_query($_REQUEST)); 
	}
        public function validateCode()
	{
                
		return $this->callWebApi('validateCode',http_build_query($_REQUEST)); 
	}
        public function resetPassword()
	{
                
		return $this->callWebApi('resetPassword',http_build_query($_REQUEST)); 
	}
        
}
?>