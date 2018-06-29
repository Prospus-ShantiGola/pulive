<?php
error_reporting(0);
if($_POST["type"]=="directUpload"){
$RandomAccountNumber = uniqid();
$src = $_FILES['file']['name'];
$path_parts=pathinfo($src);
$img = 'files/'.$RandomAccountNumber.'.'.$path_parts['extension'];
move_uploaded_file($_FILES['file']['tmp_name'], $img);	
echo($img);
}
elseif($_POST["type"]=="pasteUpload"){
$url = $_POST["imgPath"];
$extension = $path_parts['extension'];
if($extension==""){
	if(exif_imagetype($url)==1){
	$extension = "gif";	
	}
	else if(exif_imagetype($url)==2){
	$extension = "jpg";		
	}
	else if(exif_imagetype($url)==3){
	$extension = "png";		
	}
}

$path_parts=pathinfo($url);
$RandomAccountNumber = uniqid();
$img = 'files/'.$RandomAccountNumber.'.'.$extension;
file_put_contents($img, file_get_contents($url));
echo($img);
}
die();
?>