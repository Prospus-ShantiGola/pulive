<?php
if ($post['mode'] == 'instance') {
    $dealnodeinsid = $post['dealnodeinsid'];
    $login_user_id = $post['login_user_id'];
    $login_role_id = $post['login_role_id'];
    $class_p_id = $post['class_p_id'];
    $operation_id = $post['operation_id'];

    $mappingRoleActorNodeId = json_decode($builderApiObj->checkMappingDealOperationNodeID($dealnodeinsid, $login_role_id, $login_user_id));
    $datArray = array();

    $datArray['node_instance_id'] = '';
    $datArray['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
    $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID, $class_p_id);
    $datArray['value'] = array($mappingRoleActorNodeId, $operation_id, 'N/A', 'Completed');
    $datArray['is_email'] = 'N';
    $datArray['status'] = 'P';
    $returnRes = $builderApiObj->setDataAndStructure($datArray, '1', '6');
    $returnRes = json_decode($returnRes, true);

    $_instanceid = $returnRes['data']['node_instance_id'];
    $_nipId = $builderApiObj->getTableCols(array('node_instance_property_id'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($_instanceid, $class_p_id));
    $_nipId = json_decode($_nipId, true);
    if (isset($_nipId['node_instance_property_id']) && !empty($_nipId['node_instance_property_id'])) {
        $_nipId = $_nipId['node_instance_property_id'];
    } else {
        $_nipId = '';
    }

    $returnResponse = array('instanceid' => $_instanceid, 'nipid' => $_nipId, 'status' => 'add');
} else {

    $returnResponse = array('nipid' => $builderApiObj->updateOperationStatus($post));
}


$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $returnResponse;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;


?>