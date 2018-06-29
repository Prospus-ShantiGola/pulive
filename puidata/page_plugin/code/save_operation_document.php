<?php
//echo "<pre>";
//print_r($post);
$deal_instance_id = $post['deal_instance_id'];
$login_user_id = $post['login_user_id'];
$login_role_id = $post['login_role_id'];
$operation_id = $post['operation_id'];

$mappingRoleActorNodeId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_id, $login_role_id, $login_user_id), TRUE);
$operationListData = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
$operationListData = json_decode($operationListData, true)['data'];
$_operationNid = '';
foreach ($operationListData as $key => $value) {
    if ($value['Mapping_Role_Actor'] == $mappingRoleActorNodeId && $value['Operation'] == $operation_id) {
        $_operationNid = $key;
    }
}

if ($_operationNid == '') {
    $datArray = array();
    $datArray['node_instance_id'] = '';
    $datArray['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
    $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID);
    $datArray['value'] = array($mappingRoleActorNodeId, $operation_id, 'N/A');
    $datArray['is_email'] = 'N';
    $datArray['status'] = 'P';
    $returnRes = $builderApiObj->setDataAndStructure($datArray, '1', '6');
    $_operationNid = json_decode($returnRes, true)['data']['node_id'];
}


foreach ($_FILES['operation_document']['name'] as $key => $file) {
    $newFileName = mt_rand() . '_' . $file;
    //$uploadPath = __DIR__ . '/../../public/nodeZimg/';

    $return  = 0;
    if($_FILES['operation_document']['tmp_name'][$key] != '')
    {
        $return      = $sdkApi->setFileData("public/nodeZimg/".$newFileName,$_FILES['operation_document']['tmp_name'][$key],'file');
        $return  = 1;
    }
    //if (move_uploaded_file($_FILES['operation_document']['tmp_name'][$key], $uploadPath . $newFileName)) {
    if ($return) {
        $datArray = array();
        $datArray['node_instance_id'] = '';
        $datArray['node_class_id'] = OPERATION_DOCUMENT_UPLOADED_CLASS_ID;
        $datArray['node_class_property_id'] = array(8427, 8428);
        $datArray['value'] = array($_operationNid, $newFileName);
        $datArray['is_email'] = 'N';
        $datArray['status'] = 'P';
        //print_r($datArray);
        $returnRes = $builderApiObj->setDataAndStructure($datArray, '1', '6');
        $returnRes = json_decode($returnRes, true);
        //print_r($returnRes);
        //echo 'success';
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = 'success';
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        
    } else {
       // echo 'error';
        $resJsonArr = array('status' => '0', 'message' => '');
        $resJsonArr['data'] = 'error';
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
    }
}