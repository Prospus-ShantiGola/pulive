<?php
define('WEBAPI_URL', 'http://localhost/pu/api/');
function callWebApi($api, $postvars)
{
	$hdrarray			=	array('Content-Type: application/x-www-form-urlencoded');
	$url 				= 	WEBAPI_URL.$api;
	$ch 				= 	curl_init();	
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_POST,1);
	curl_setopt($ch,CURLOPT_POSTFIELDS,$postvars);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $hdrarray);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,3);
	curl_setopt($ch,CURLOPT_TIMEOUT, 20);
	$response 			= 	curl_exec($ch);
	
	$http_status 		= 	curl_getinfo($ch, CURLINFO_HTTP_CODE);
	
	if($http_status!=200)
	{
	  $response 		= 	"Error $http_status";
	}
	curl_close ($ch);
	
	return $response; 
}

$apiName				=	$_GET['api'];
$returnResponce			=	'';

if($apiName == 'card')
{
	$data  				=   array('classId'=>"600", 'apiname' => 'card');
	$options			=	http_build_query($data);
	$returnResponce		=	callWebApi('card',$options);
}

echo $returnResponce;

?>