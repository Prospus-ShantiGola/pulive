<?php
// Bucket Name
$bucket="9lessonsDemos";
if (!class_exists('S3'))require_once('S3.php');
			
//AWS access info
if (!defined('awsAccessKey')) define('awsAccessKey', 'AKIAI3YVTGLFQNHWPJDA');
if (!defined('awsSecretKey')) define('awsSecretKey', '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');
			
//instantiate the class
$s3 = new S3(awsAccessKey, awsSecretKey);

$s3->putBucket($bucket, S3::ACL_PUBLIC_READ);

?>