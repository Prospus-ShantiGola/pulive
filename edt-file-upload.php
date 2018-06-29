<?php
error_reporting(E_ALL);
if (!isset($_SERVER['REDIRECT_BASE']) || $_SERVER['REDIRECT_BASE'] == "") {
    $slashes = '/';
} else {
    $slashes = $_SERVER['REDIRECT_BASE'];
}


if($_SERVER['HTTP_HOST'] == "localhost")
{
	$document_root 					= $_SERVER['DOCUMENT_ROOT'] . $slashes.'pu/';
}
else
{
	$document_root 					= $_SERVER['DOCUMENT_ROOT'] . $slashes;
}
//include_once 'puidata/aws/aws-autoloader.php';
//include_once "puidata/S3/AwsS3Core.php";
//$sdkApi				 		= new AwsS3Core();

if($_POST["type"]=="directUpload")
{
	$RandomAccountNumber 	= uniqid();
	$src 					= $_FILES['file']['name'];
	$path_parts 			= pathinfo($src);
	$img 					= 'files/'.$RandomAccountNumber.'.'.$path_parts['extension'];
	//$file 	                = $sdkApi->setFileData($img,$_FILES['file']['tmp_name'],'file');
	move_uploaded_file($_FILES['file']['tmp_name'], $img);
	//echo($file['object_url']);
    echo $img;
}
elseif($_POST["type"]=="pasteUpload")
{
	$url 					= $_POST["imgPath"];
	$extension 				= $path_parts['extension'];
	if($extension==""){
		if(exif_imagetype($url)==1){
		$extension 			= "gif";	
		}
		else if(exif_imagetype($url)==2){
		$extension 			= "jpg";		
		}
		else if(exif_imagetype($url)==3){
		$extension 			= "png";		
		}
	}

	$path_parts 			= pathinfo($url);
	$RandomAccountNumber 	= uniqid();

	$img 					= 'files/'.$RandomAccountNumber.'.'.$extension;
	$file_temp_name 		= $document_root.$img;
	file_put_contents($img, file_get_contents($url));
	//$file                   = $sdkApi->setFileData($img,$file_temp_name,'file');
	//unlink($file_temp_name);
	//echo($file['object_url']);
    echo $img;
}
die();
?>