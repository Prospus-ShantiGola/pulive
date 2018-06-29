<?php
header("Access-Control-Allow-Origin: *");

if ($_GET['instance_id']) 
{
    if ($_GET['instance_id'] != '') 
    {
        include "builderApi.php"; 
        $apiObj                 = new builderApi();
        $domainData             = $apiObj->getFormStructure($_GET['instance_id']);
        $domainArray            = json_decode($domainData, true);
        echo html_entity_decode($domainArray['data']);
    } 
}
?>