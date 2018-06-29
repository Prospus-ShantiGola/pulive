<?php

include_once("../config.php");
include_once("../code/function_html.php");
include_once "../builderApi.php";
$builderApiObj = new builderApi();

error_reporting(1);
$dealNodeId = $_GET['deal_id'];
//$dealInstanceId = $builderApiObj->getNodeinstanceIDDetails($dealNodeId);
$instanceRes = $builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($dealNodeId));
$dealInstanceId = json_decode($instanceRes,true)['node_instance_id'];



$deal['deal_node_id']       = $dealNodeId;
$deal['deal_instance_id']   = $dealInstanceId;
$deal['label']              = 'true';
$deal['all']                = 'true';

//$appOneData = $builderApiObj->getDealAppOneInfo($deal);
//$appOneData = json_decode($appOneData,true);

$dealInfoJson = $builderApiObj->getDealOperationInfo($deal);
//$dealInfo = json_decode($dealInfoJson,true);

print ($dealInfoJson); die();
