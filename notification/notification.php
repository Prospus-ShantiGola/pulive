<?php
include("PushNotification.php");

$push = new PushNotification("sandbox","iphone/pushcert.pem");
$push->setDeviceToken("94AD53F9AA56C5F3497EABFD2FED3CF910941FBBEE5F3AD163857C515E39198C");
// Set pass phrase if any
$push->setPassPhrase("prospus1");
// Set badge
$push->setBadge(2);

$push->setContextId("test1000");
$push->setSenderId("test2000");
            
// Set message body
$push->setMessageBody("Test message 30000");
$res = $push->sendNotification();
var_dump($res);
