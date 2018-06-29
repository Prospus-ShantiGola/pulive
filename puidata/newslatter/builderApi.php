<?php
header("Access-Control-Allow-Origin: *");

class builderApi
{
	private $web_api_url =  'http://sta.pu.prospus.com/pui/';
	public function callWebApi($api,$postvars)
	{
		$url 				= $this->web_api_url.$api;

		$ch 				= curl_init();	
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_POST,1);
		curl_setopt($ch,CURLOPT_POSTFIELDS,$postvars);
		curl_setopt($ch, CURLOPT_USERPWD, "home:Access@Outer#2015");
		//curl_setopt($ch, CURLOPT_HTTPHEADER, $hdrarray);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);
		$response = curl_exec($ch);
		//echo "<pre>";print_r($response);
		//die;

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

	public function encryptionKey() 
	{
		$user 				=	"Arvind";
		$pass 				=	"Soni";
	    $string 			= 	strtolower($user);
	    return array(hash("sha1", $string), hash("sha1", $string . $pass));
	}

	public function encrypt($data) 
	{
		return $data;
		//$key 				=	$this->encryptionKey();
	    //return trim( base64_encode( mcrypt_encrypt(MCRYPT_RIJNDAEL_256,substr($key[0],0,32),$data,MCRYPT_MODE_CBC,substr($key[1],0,32))));
	}

	public function decrypt($data) 
	{
		return $data;
		//$key 				=	$this->encryptionKey();
	    //return mcrypt_decrypt(MCRYPT_RIJNDAEL_256,substr($key[0],0,32),base64_decode($data),MCRYPT_MODE_CBC,substr($key[1],0,32));
	}

	public function dbConnection()
	{
		
		$con 			= mysql_connect('prospus1.ctf2im6lqhxh.us-west-2.rds.amazonaws.com:3306','Prospus1','QBwD2BC5XXZU7VW2'); 
		$db_selected 	= mysql_select_db('pui_universe' , $con);
		return $con;
	}

	public function getFormStructure($instance_id)
	{
		$data     =  array('node_id' => $instance_id);
		$options   = http_build_query($data);
		return $this->callWebApi('getFormStructure',$options);
	}
}

?>
