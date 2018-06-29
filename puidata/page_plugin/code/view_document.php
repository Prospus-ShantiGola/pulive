<?php
//include_once("field_calculate.php");
$nodeIdCssFileArr = array('496778', '495888');
//css file:- Gaurav Dutt Panchal
$cssArrRes = $builderApiObj->getFileRulesetArray($nodeIdCssFileArr);
$cssArr = json_decode($cssArrRes, true);

$node_id = "";
$fileCssToWrite = '';        
$flag = $post['flag'];
$document_node_id = $post['document_node_id'];
$deal_node_id = $deal_instance_node_id = $post['deal_instance_id']; //This is not instance id, it's node id
$deal_user_role_id = $_deal_user_role_id = $post['deal_user_role_id'];
$login_user_id = $post['login_user_id'];
$operation_node_id = $post['operation_node_id'];
$mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);
$form_node_id = '';
$ins_cnid = '';
$super_admin_role_id = $post['super_admin_role_id'];

if ($document_node_id != "") {
    $_data['deal_node_id'] = $deal_node_id;
    $_data['operation_node_id'] = $operation_node_id;
    $sharedDocumentData = json_decode($builderApiObj->getSharedDocumentForm($_data),TRUE)['data'];
    if($sharedDocumentData['deal_user_role_id'])
        $_deal_user_role_id = $sharedDocumentData['deal_user_role_id'];
   
    $mappingRoleActorInstanceId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $_deal_user_role_id/*, $login_user_id*/));
    /*echo "hi".$mappingRoleActorInstanceId; die();*/
        
    $returnData = $builderApiObj->getDealOperationFormId($mappingRoleActorInstanceId, $operation_node_id);
    $returnArray = json_decode($returnData, true);
    //print_r($returnArray);exit;
    if ($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') {

        $document_node_id = $returnArray['data']['Document'];
    } else {
        $document_node_id = $document_node_id;
    }
    if ($returnArray['data']['Form'] != "" && $returnArray['data']['Form'] != 'N/A') {
        $form_node_id = $returnArray['data']['Form'];
        $ins_cid = json_decode($builderApiObj->getTableCols(array('node_class_id'), 'node-instance', array('node_id'), array($form_node_id)), TRUE)['node_class_id'];
        $ins1_cnid = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($ins_cid)), TRUE)['node_id'];
    }

    $json = array();
    $documentData = $builderApiObj->getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
    $documentData = json_decode($documentData, true);
    $json['detail_form_node_id'] = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($post['operation_detail_node_class_id'])),TRUE)['node_id'];
    $templateType = $builderApiObj->getTemplateType($document_node_id);
    $tempArray = json_decode($templateType, true);

    if ($tempArray['value'] == "Canvas") {
        $dealInstancesArray['396138'] = $deal_instance_node_id;
        $subData = $builderApiObj->getInstanceIdOfSubClass(OPERATION_PROPERTY_MAP_DEAL_CLASS_ID, $deal_instance_node_id);
        $subData = json_decode($subData, true);
        if ($subData['data'] != '') {
            $instanceInfo = $builderApiObj->getInstanceListOfParticulerClass($subData['data'], 'instance', 'node_id');
            $instanceInfo = json_decode($instanceInfo, true);
            if (count($instanceInfo['data']) > 0) {
                foreach (current($instanceInfo['data']) as $key => $value) {
                    $temp = explode('~$~', $value);
                    $dealInstancesArray[$temp[0]] = $temp[1];
                }
            }
        }
        //print_r($dealInstancesArray);
        if (!empty($ins1_cnid) && !empty($form_node_id)) {
            $dealInstancesArray[$ins1_cnid] = $form_node_id;
        }


        $dealInstancesArray = getMappedDataInstancesWithClass($dealInstancesArray);



        /* $htmldata = getCanvasFormNew($builderApiObj, $dealInstancesArray, $documentData['data'][0], $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag);
          $htmldata = html_entity_decode($htmldata); */

        /*
         * Modified By Divya
         * Purpose: Call Same Function for Document as Called for details
         */
        //print_r($documentData['data']);
        $htmldata = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $documentData['data'][0], $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag, 'canvas');
        $htmldata = html_entity_decode($htmldata);
        /* END HERE */


        $tempArray['value'] = 1;
    } else {
        $tempArray['value'] = 0;
        $htmldata = getDocumentHtmlList($documentData['data'][0], $brokerage_node_id, $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag);
    }
    // User Notification Div Start
    $_userNotification = '<div class="notification-wrap"><div id="notification-row" class="notification-row" style="display:none"><p></p></div></div>';
    // User Notification Div End
    $json['content_detail'] = $_userNotification.$htmldata;
    $json['css_file'] = $cssArr;
} else {
    $json['content_detail'] = '<div class="no-record">Document Not Found</div>';
    $json['css_file'] = '';
}


$doctype = $tempArray['value'];
$tempVal = "undefined";

$json['head'] = 'Operation : Document';
$action = '';
$tooltip = '<a href="#" class="tooltip-item detail-icon detailJs " data-toggle="tooltip" data-placement="bottom">

                            <i class="prs-icon detail"></i>
                            <span>Detail</span>
                            </a>';

$tooltip .= '<a href="#" class="tooltip-item detail-icon active  documentJs hide" data-toggle="tooltip" data-placement="bottom" onclick="getDocument(this);">
                            <i class="prs-icon document"></i>
                            <span>Document</span>
                            </a>';

//only for demo to client it should be remove on confirmaion.
if ($operation_node_id == "723890" && $super_admin_role_id != ROLE_SUPERADMIN) {
    $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs hide j_my_esign_open" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
                            <i class="prs-icon esign"></i>
                            <span>E Sign</span>
                            </a>';
}


$tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                            <i class="prs-icon workflow"></i>
                            <span>Workflow</span>
                            </a>';
$json['tooltip'] = $tooltip;

$action .= '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                                <i class="prs-icon dialogue"></i>
                                <br>
                                <span>Dialogue</span>
                            </a>';

$_permission = getOperationActionPermission($deal_user_role_id, $deal_node_id);
$json['permission'] = $_permission;

/* Gaurav Start */
//include pass deal and reject deal button
$deal_node_instance_id = $post['deal_node_id'];
$post['login_role_id'] = $post['deal_user_role_id'];
$_dealInstanceId = $post['deal_node_id'];

/*
 *(Pass Deal, Reject Deal, On hold action will be shown for all opereation
 * Except OTHER ROLE OPERATION)
 */
if(!isset($post['is_other_role_operation']) || trim($post['is_other_role_operation']) != 'true') {
   include_once 'pass_deal.php';
}
/* Gaurav End */

//Anil Start :11-JAN-2017
$_readPermission = $post['read_permission'];
$mappingroleData = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_ROLE_ACTOR_CLASS_ID, 'class', 'node_id');
$mappingroleListData = json_decode($mappingroleData, true)['data'];
$_flag = 0;
foreach ($mappingroleListData as $key => $value) {
    if ((int) trim($value['Role']) == (int) trim($deal_user_role_id) && (int) trim($value['Actor']) == (int) trim($login_user_id) && (int) trim($value['Deal']) == (int) trim($deal_node_id)) {
        $_flag = 1;
        break;
    }
}
if ($super_admin_role_id == ROLE_SUPERADMIN) {
    $_flag = 0;
}

//Anil End
if (($returnArray['data']['Document'] == "" || $returnArray['data']['Document'] == 'N/A') && $flag == 'save') {

    //die;
    //Condition check
    //Manage Ready Only Owner Property For Document
    if($_readPermission != 'readonly' && $_readPermission != 'readonlyowner'){
        $_condition = (in_array('Can Save', $_permission) && $_flag) == 1 ? 1 : 0 ;
    } else {
        $_condition = ($_readPermission == 'readonly' || $_readPermission == 'readonlyowner') ? 0 : 1 ;
    }
    $_inactiveAction = ' inactive ';
    $_onClick = '';
    if (in_array('Can Download Pdf', $_permission) && $_flag) {
        $_onClick = 'onclick="downloadReportPdf(this)"';
        $_inactiveAction = '';
    }

    $action .= '<a  href="#" data-placement="left" class="tooltip-item  hide_signing_cls '.$_inactiveAction.'"  '.$_onClick.'><i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';

    $_inactiveAction = ' inactive ';
    $_onClick = '';

    if ($_condition) {
        $_inactiveAction = '';
        $_onClick = 'onclick="callEditContentdocumentAction(this,' . $mappingRoleActorInstanceId . ',' . $operation_node_id . ',' . $tempVal . ',' . $doctype . ')"';
    }else {
        $json['disabled_wrapper'] = 1;
    }
    $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  saveDocJs '.$_inactiveAction.'" '. $_onClick .'><i class="prs-icon save"></i><br><span>Save</span></a>';
    $save_type = 'save';
}

if (($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') && $flag == 'save') {

    if ($document_node_id != "") {
        //Condition check
        //Manage Ready Only Owner Property For Document
        if($_readPermission != 'readonly' && $_readPermission != 'readonlyowner'){
            $_condition = (in_array('Can Edit', $_permission) && $_flag) == 1 ? 1 : 0 ;
        } else {
            $_condition = ($_readPermission == 'readonly' || $_readPermission == 'readonlyowner') ? 0 : 1 ;
        }
        $_inactiveAction = ' inactive ';
        $_onClick = '';
        if (in_array('Can Download Pdf', $_permission) && $_flag) {
            $_onClick = 'onclick="downloadReportPdf(this)"';
            $_inactiveAction = '';
        }

        $action .= '<a  href="#" data-placement="left" class="tooltip-item action-download-pdf hide_signing_cls '.$_inactiveAction.'" '.$_onClick.' ><i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';

        $_inactiveAction = ' inactive ';
        $_onClick = '';
        if ($_condition) {
            $_inactiveAction = '';
            $_onClick = 'onclick="viewDocumentData(this,' . $document_node_id . ')"';
        }

        $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  editDocJs '.$_inactiveAction.'" '.$_onClick.'><i class="prs-icon edit"></i><br><span>Edit</span></a>';
        $save_type = 'view';
    }
}

if (($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') && $flag == 'edit') {
    if ($document_node_id != "") {
        $action .= '<a  href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls inactive-btn" onclick="downloadReportPdf(this)" >
                        <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
        $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  editDocJs" onclick="callEditContentdocumentAction(this,' . $mappingRoleActorInstanceId . ',' . $operation_node_id . ',' . $document_node_id . ',' . $doctype . ')">
                    <i class="prs-icon save"></i>
                        <br><span>Save</span>
            </a>';
        $save_type = 'edit';
    }
}
//        $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation doPrintDocumentEditor">
//                                            <i class="prs-icon print"></i>
//                                            <br><span>Print</span>
//                                   </a>';
// For Purchase Agreement operation of Sales Consultant role.
/* if (trim($post['deal_user_role_id']) == '436104' && trim($post['operation_node_id']) == '449575') {
  $action .= '<a href="#" data-placement="left" class="tooltip-item print-document" ><i class="prs-icon print"></i><br><span>Print</span></a>';
  } */

/* Code By Arvind */

/*$_inactiveAction = ' inactive ';
$_onClick = '';
if (in_array('Can Print', $_permission)) {
    $_inactiveAction = '';
    $_onClick = 'onclick="doPrintOfDoc(\'' . $tempArray['value'] . '\')"';
}*/
$action .=$passDeal;
$action .=$rejectDeal;
$action .=$onHoldDeal;//Anil :17-01-2017

$_inactiveAction = ' inactive ';
$_onClick = '';
if ($super_admin_role_id != ROLE_SUPERADMIN) {          

    $_inactiveAction = '';
    $_onClick = 'onclick="doPrintOfDoc(\'' . $tempArray['value'] . '\')"';           
}
$action .= '<a '.$_onClick.' href="#" data-placement="left" class="tooltip-item '.$_inactiveAction.'" ><i class="prs-icon print"></i><br><span>Print</span></a>';

$json['actions'] = $action;
$json['save_type'] = $save_type;



$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;