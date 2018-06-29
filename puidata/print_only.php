<?php
ini_set("display_errors", 1);
ini_set("max_execution_time", 0);
error_reporting(1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
date_default_timezone_set("Asia/Calcutta");

require 'aws/aws-autoloader.php';
include "S3/AwsS3Core.php";
$sdkApi                         = new AwsS3Core();

$folderName                     = basename(base64_decode($_GET['href']),'.pdf');
$fileArray                      = $sdkApi->getBucketFilesLists("data/AppOnePdfImages/$folderName/$folderName");
echo json_encode($fileArray);
exit;
?>
