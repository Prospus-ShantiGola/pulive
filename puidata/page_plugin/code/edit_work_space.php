<?php
$login_role_id = $post['login_role_id'];
$login_user_id = $post['login_user_id'];
$mapping_role_actor_node_id = $post['mapping_role_actor_node_id'];
$operation_node_id = $post['operation_node_id'];
$view_instance_id = $post['view_instance_id'];
$deal_node_id = $post['deal_node_id'];

$formData = $builderApiObj->getFormStructure($view_instance_id);
$formData = json_decode($formData, true);


/* Start Code to get operation attachments in edit mode
 * Written By:- Kunal
 */
$mappingRoleActorNodeId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_node_id, $login_role_id/*, $login_user_id*/), TRUE);

//$operationListData = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
//$operationListData = json_decode($operationListData, true)['data'];
//$_operationNid = '';
//foreach ($operationListData as $key => $value) {
//    if ($value['Mapping_Role_Actor'] == $mappingRoleActorNodeId && $value['Operation'] == $operation_node_id) {
//        $_operationNid = $key;
//    }
//}
//$operationDocumentArray = array();
//$oprData = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_DOCUMENT_UPLOADED_CLASS_ID, 'class', 'node_id');
//$oprData = json_decode($oprData, true);
//$mappingDealOpNid = '';
//foreach ($oprData['data'] as $key => $value) {
//    if (intval($value['Mapping_Deal_Operation']) == intval($_operationNid)) {
//        $operationDocumentArray[$key] = $value;
//    }
//}
//if (count($operationDocumentArray)) {
//    $oprDocHtml = '<div class="list-detail-section">
//            <div class="form-horizontal">
//            <div>
//            <a class="list-title-heading class-accordian collapsed-mode " data-toggle="collapse" href="#attachment" aria-expanded="false" aria-controls="editGeneral">
//                <i class="fa fa-angle-down"></i><span class="list-title-accordian">Attachment(s)<span>
//                                </span></span>
//            </a>
//            <div class="collapse in" id="attachment">
//              <div class="list-detail-section">';
//    $count = 1;
//    foreach ($operationDocumentArray as $key1 => $doc) {
//        $docName = explode('_', $doc['Document_Name']);
//        $oprDocHtml.= '<div class="form-group attachment_' . $key1 . '">
//                        <label class="col-sm-4 control-label form-label">File Name </label>
//                        <div class="col-sm-8">
//                          <span class="list-view-detail"><a href="' . UPLOAD_URL_API . $doc['Document_Name'] . '">' . end($docName) . '</a>
//                              <a href="javascript:void(0);" class="right" opr_doc_ins_id="' . $key1 . '" onclick="deleteOprIns(' . $key1 . ')"><i class="prs-icon sm-close " data-original-title="" title=""></i></a></span>
//                        </div>
//                      </div>';
//        $count++;
//    }
//    $oprDocHtml.='</div>
//                        </div>
//                      </div>
//                </div>';
//}
//$formData['data'].=$oprDocHtml;
/* Start New Code For Operation Mapping With Deal Data */
$dealInstancesArray['396138']       = $deal_node_id;
$subData                            = $builderApiObj->getInstanceIdOfSubClass(OPERATION_PROPERTY_MAP_DEAL_CLASS_ID, $deal_node_id);
$subData                            = json_decode($subData, true);
if($subData['data'] != '')
{
    $instanceInfo                   = $builderApiObj->getInstanceListOfParticulerClass($subData['data'], 'instance', 'node_id');
    $instanceInfo                   = json_decode($instanceInfo, true);
    if(count($instanceInfo['data']) > 0)
    {
        foreach(current($instanceInfo['data']) as $key => $value)
        {
            $temp                   = explode('~$~',$value);
            $dealInstancesArray[$temp[0]]       = $temp[1];
        }
    }
}
$returnData = $builderApiObj->getDealOperationFormId($mapping_role_actor_node_id, $operation_node_id);
$returnArray = json_decode($returnData, true);
//print_r($returnArray);
/*funtion to pass property id array of mapped fields by kunal*/
$documentData = $builderApiObj->getDocumentData($returnArray['data']['Document'], $deal_node_id, $login_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
$documentData = json_decode($documentData, true);
//print_r(current($documentData['data'][0][0]));die;
$return_arr = getDetailDocumentMappedData(current($documentData['data'][0][0]));

$mapped_form_arr = json_decode($builderApiObj->getTableCols(array('node_class_id'), 'node-instance', array('node_id'), array($returnArray['data']['Form'])), TRUE)['node_class_id'];
$detail_form_node_id = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($mapped_form_arr)), TRUE)['node_id'];

$mapped_field_arr                   = array();
foreach($return_arr as $key=>$arr)
{
    $form_field_node_id             = explode('~$~',$key);
    if($form_field_node_id[0]==$detail_form_node_id)
    {
       //if($arr!='')
        $mapped_field_arr[$form_field_node_id[1]] = $arr;
    }
}
//print_r(array($mapped_field_arr,'fdsf'));die;
if(count($mapped_field_arr) > 0)
{
    $MDOC_Data                          = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
    $MDOC_Data                          = json_decode($MDOC_Data, true);
    $node_id_of_instanse                = '';
    $form_id                            = '';
    foreach ($MDOC_Data['data'] as $key => $value) {
        if (intval($value['Mapping_Role_Actor']) == intval($mapping_role_actor_node_id) && intval($value['Operation']) == intval($operation_node_id)) {
            $node_id_of_instanse       = $key;
            $form_id                   = $value['Form'];
        }
    }
    if(intval($form_id) > 0)
    {
        $resNew                         = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'all');
        $resNew                         = json_decode($resNew, true);
        $resNew1                        = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'propertyWithHirerchy');
        $resNew1                        = json_decode($resNew1, true);
    }

    $insId = $resNew['data']['node_instance_id'];
    $updated_prop_arr                   = array();
    foreach($mapped_field_arr as $indexKey => $indexVal)
    {
        $propAray = explode('>',$indexKey);
        if(isset($resNew1['data']['Properties'][$propAray[0]][$propAray[1]]))
            $updated_prop_arr[$resNew1['data']['Properties'][$propAray[0]][$propAray[1]]]         = $indexVal;
    }
//    if(count($updated_prop_arr))
//    {
//
//        foreach($updated_prop_arr as $property_key => $fld_property)
//        {
//
//            $resProp                    = $builderApiObj->mapOperationFormData($property_key,$fld_property,$insId);
//            $resProp                    = json_decode($resProp, true);
//            //print_r($resProp);
//        }
//    }
//    print_r($mapped_field_arr);
//    print_r($resNew['data']['Properties']);
//    print_r($resNew1['data']['Properties']);
//    print_r($updated_prop_arr);

}

/*funtion end to pass property id array of mapped fields by kunal*/
$dealInstancesArray = getMappedDataInstancesWithClass($dealInstancesArray);
$formData['data']   = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $formData['data'], '', '', '', 'operation_form','Edit',$updated_prop_arr);

/* End Code to get operation attachments in edit mode
 * Written By:- Kunal
 */
$json['content_detail'] = html_entity_decode($formData['data']);
$json['display_type'] = 'edit';
$buttonName = 'Save';
$apponetooltip = '';
// check if FI Quote is available >>>
if ($post['operation_node_id'] == COMPLETE_FUNDING_ID) {
    $fiData['operation_code_id'] = OPERATION_PROPERTY_MAP_DEAL_CLASS_ID;
    $fiData['fi_cpid'] = FI_QUOTE_PID;
    $fiData['deal_node_id'] = $deal_node_id;
    $fiRes = $builderApiObj->getFiQuoteValue($fiData);
    $fiValue = json_decode($fiRes, true)['data'];
    $dom = new domDocument;
    $dom->loadHTML($json['content_detail']);
    $dom->preserveWhiteSpace = false;
    $tags = $dom->getElementsByTagName('button');
    $buttonDom = '';
    foreach ($tags as $tag) {
        $buttonDom .= $tag->getAttribute('onclick');
        if ($buttonDom == 'loadAppOneLogin()') {
            if (!empty($fiValue)) {
                $tag->removeAttribute('disabled');
            } else {
                $tag->setAttribute('disabled', true);
            }
            $html = $dom->saveHTML();
        }
    }
    $json['content_detail'] = $html;

    $apponetooltip = '<a href="#" class="tooltip-item appone-icon inactive" data-toggle="tooltip" data-placement="bottom">
                    <i class="prs-icon detail"></i>
                    <span>AppOne</span>
                </a>';
}
// <<< check if FI Quote is available

$returnData = $builderApiObj->getDealOperationFormId($mapping_role_actor_node_id, $operation_node_id);
$returnArray = json_decode($returnData, true);
if (intval(current($returnArray['data']['FormData'])['node_instance_id']) > 0) {


    $html = getEditHtmlPropValues($returnArray['data']['FormData']);

    $json['content_values'] = $html;
}
$restricted_opt = array('455185', '455738', '455435');
$hidePdf = "";
if (in_array($operation_node_id, $restricted_opt)) {
    $hidePdf = " hide ";
}
$json['head'] = 'Operation : Detail';

$tooltip = '<a href="#" class="tooltip-item detail-icon detailJs active" data-toggle="tooltip" data-placement="bottom">
                            <i class="prs-icon detail"></i>
                        <span>Detail</span>
                            </a>' . $apponetooltip;


$tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs hide" data-toggle="tooltip" data-placement="bottom" onclick="getDocument(this);">

                            <i class="prs-icon document"></i>
                            <span>Document</span>
                            </a>';

/* $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs hide j_my_esign_open" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
  <i class="prs-icon esign"></i>
  <span>E Sign</span>
  </a>'; */

$tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                            <i class="prs-icon workflow"></i>
                            <span>Workflow</span>
                            </a>';

$json['tooltip'] = $tooltip;
/* Gaurav Start */
//include pass deal and reject deal button
$deal_node_instance_id = $post['deal_instance_id'];
$post['login_role_id'] = $login_role_id;
$_dealInstanceId = $post['deal_instance_id'];
include_once 'pass_deal.php';

$rightMenu = '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation saveJs" onclick="saveWorkSpaceAction(this,' . $mapping_role_actor_node_id . ')">
                    <i class="prs-icon save"></i>
                    <br><span>' . $buttonName . '</span>
                </a>' . '<a  href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls ' . $hidePdf . '" onclick="downloadPdf(this)" >
                    <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';

$rightMenu .= $passDeal;
$rightMenu .=$rejectDeal;

$rightMenu .= '<a href="#" onclick="cancelFormAction(\'operations\');" class="tooltip-item action-accept-invitation show-confirmation">
                <i class="prs-icon icon_close"></i>
                <br>
                <span>Cancel</span>
                </a>';



$json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                    <i class="prs-icon dialogue"></i>
                    <br>
                    <span>Dialogue</span>
                </a>' . $rightMenu;



$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;