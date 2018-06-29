<?php
error_reporting(0);
if($_SERVER['HTTP_HOST'] == "localhost")
{
	$document_root 					= $_SERVER['DOCUMENT_ROOT'] . $slashes.'pu/';
}
else
{
	$document_root 					= $_SERVER['DOCUMENT_ROOT'] . $slashes;
}
if($_POST["type"] == "directUpload"){
	$RandomAccountNumber 		= uniqid();
	
	$src 						= $_FILES['file']['name'];
	$path_parts					= pathinfo($src);
	$pdf 						= $document_root.'/data/AppOnePdfImages/'.$RandomAccountNumber.'.'.$path_parts['extension'];
	
	if(move_uploaded_file($_FILES["file"]["tmp_name"], $pdf))
	{
		echo($pdf);
	}
	else
	{
		echo "Invalid File";
	}
}
?>