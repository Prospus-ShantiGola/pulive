<?php
$mapping_role_actor_node_id                 = $post['mapping_role_actor_node_id'];
$login_user_id                              = $post['login_user_id'];
$flag                                       = $post['flag'];
$operation_node_id                          = $post['operation_node_id'];
$deal_node_id                               = $post['deal_node_id'];
$view_node_id                               = $post['view_node_id'];
$postData                                   = $post;
$login_role_id                              = $post['login_role_id'];
$oprDocHtml                                 = '';
$document_node_id                           = $post['data_document_id'];
$_instanceid                                = '';
/*get all documents uploaded for a particular operation*/
//if($oprDocHtml=='')
//{    
//    //print_r(array($deal_instance_id, $deal_user_role_id, $login_user_id));
//    $mappingRoleActorNodeId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_node_id, $login_role_id, $login_user_id),TRUE);
//    $operationListData = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
//    $operationListData= json_decode($operationListData, true)['data'];
//    $_operationNid = '';
//    foreach ($operationListData as $key => $value) {
//        if ($value['Mapping_Role_Actor'] == $mappingRoleActorNodeId && $value['Operation'] == $operation_node_id) {
//            $_operationNid = $key;
//        }
//    }
//    $operationDocumentArray             = array();
//    $oprData                            = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_DOCUMENT_UPLOADED_CLASS_ID, 'class', 'node_id');
//    $oprData                            = json_decode($oprData, true);
//    $mappingDealOpNid = '';
//    foreach ($oprData['data'] as $key => $value) {
//        if (intval($value['Mapping_Deal_Operation']) == intval($_operationNid)) {
//            $operationDocumentArray[$key]   = $value;
//        }
//    }
//    if(count($operationDocumentArray))
//    {    
//        $oprDocHtml                         = '<div class="list-detail-section">
//                        <div class="form-horizontal">
//                <div>
//                <a class="list-title-heading class-accordian collapsed-mode " data-toggle="collapse" href="#attachment" aria-expanded="false" aria-controls="editGeneral">
//                    <i class="fa fa-angle-down"></i><span class="list-title-accordian">Attachment(s)<span>
//                                    </span></span>
//                </a>
//                <div class="collapse in" id="attachment">
//                  <div class="list-detail-section">';
//        $count                          = 1;
//        foreach ($operationDocumentArray as $key1=>$doc) {
//            $docName                        = explode('_',$doc['Document_Name']);
//            $oprDocHtml.= '<div class="form-group attachment_'.$key1.'">
//                                <label class="col-sm-4 control-label form-label">File Name </label>
//                                <div class="col-sm-8">
//                                  <span class="list-view-detail"><a href="'.UPLOAD_URL_API.$doc['Document_Name'].'">'.end($docName).'</a></span>
//                                </div>
//                              </div>
//                              ';
//            $count++;
//        }
//        $oprDocHtml.='</div>
//                </div>
//              </div>
//        </div>';
//    }
//}
/*get all attachment uploaded for a particular operation end*/

/* Save And Update Operation Form Data */
$filesArr = array();
foreach ($_FILES as $key => $file) {

    $instancePropId = str_replace('filenodeZ', '', $key);
    $index = array_search($instancePropId, $postData['instance_property_id']);
    $newFileName = mt_rand() . '_' . $file['name'];
    //$uploadPath = __DIR__ . '/../../../public/nodeZimg/';
    $return  = 0;
    if($file["tmp_name"] != '')
    {
        $return  = $sdkApi->setFileData("public/nodeZimg/".$newFileName,$file["tmp_name"],'file');
        $return  = 1;
    }
    
    //if (move_uploaded_file($file["tmp_name"], $uploadPath . $newFileName)) {
    if ($return) {
        // set instance caption to store file name with path
        //$post['instance_property_caption'][$index] = UPLOAD_URL_API . $newFileName;
        if (!isset($postData['instance_property_caption'])) {
            $postData['instance_property_caption'] = array();
        }
        array_splice($postData['instance_property_caption'], $index, 0, UPLOAD_URL_API . $newFileName);        
    } elseif (isset($postData['id_detail_instance_id'])) {
        // in case of form edit and file not uploaded
        if (isset($postData['fileZvalue' . $instancePropId])) {
            //$postData['instance_property_caption'][$index] = $postData['fileZvalue' . $instancePropId];
            if (!isset($postData['instance_property_caption'])) {
                $postData['instance_property_caption'] = array();
            }
            array_splice($postData['instance_property_caption'], $index, 0, $postData['fileZvalue' . $instancePropId]);
            unset($postData['fileZvalue' . $instancePropId]);
        } else {
            $postData['instance_property_caption'][$index] = '';
        }        
    }
}

$dataArray = $checkbox_data = array();
$dataArray['node_instance_id'] = $postData['id_detail_instance_id'];
$dataArray['node_class_id'] = $postData['node_class_id'];
$dataArray['node_class_property_id'] = $postData['instance_property_id'];
$dataArray['value'] = $postData['instance_property_caption'];
$dataArray['is_email'] = 'N';
$dataArray['status'] = 'P';

$returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');
$returnResponse = json_decode($returnResponse, true);
$form_node_id = $returnResponse['data']['node_id'];
//echo $form_node_id;



if (trim($dataArray['node_instance_id']) == '') {
    /* Inserting Mapping Deal Operation Class Instance */
    $result                             = json_decode($builderApiObj->getInstanceIdByTwoValue($mapping_role_actor_node_id, $operation_node_id), TRUE);
    $_node_instance_id                  = $result['node_instance_id'];
    if (isset($_node_instance_id) && !empty($_node_instance_id)) {
        $_instanceid                    = $_node_instance_id;
        $postData['mode']               = 'insert';
        $postData['instance_id']        = $_instanceid;
        $postData['class_p_id']         = FORM_PID;
        $postData['value']              = $form_node_id;
        //                echo "<pre>";
        //                print_r($postData);
        //                die();
        $builderApiObj->updateOperationStatus($postData);
    } else {
        $datArray                       = array();
        $datArray['node_instance_id']   = '';
        $datArray['node_class_id']      = MAPPING_DEAL_OPERATION_CLASS_ID;
        $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID, FORM_PID);
        $datArray['value']              = array($mapping_role_actor_node_id, $operation_node_id, 'N/A', $form_node_id);
        $datArray['is_email']           = 'N';
        $datArray['status']             = 'P';


        $returnRes                      = $builderApiObj->setDataAndStructure($datArray, '1', '6');
        //print_r($returnRes);
        $returnRes                      = json_decode($returnRes, true);

        $_instanceid                    = $returnRes['data']['node_instance_id'];

        //$builderApiObj->setLastVisitedOperation($_instanceid);
    }

    $_classpid = $builderApiObj->getTableCols(array('node_class_property_id'), 'node-class-property', array('node_class_id', 'caption'), array(MAPPING_DEAL_OPERATION_CLASS_ID, 'Status'));
    $_classpid = json_decode($_classpid, true);
    $checkbox_data = array('instanceid' => $_instanceid, 'classpid' => $_classpid['node_class_property_id'], 'status' => 'edit');
    if ($flag == 'true') {
        /*                     * *Start******Send Mail to user on operation**** */
        $resMappingRoleActor = $builderApiObj->getMappingRoleActorStructure($mapping_role_actor_node_id, $login_user_id);

        $mappingRoleActorMail = json_decode($resMappingRoleActor, true);

        $roleTitle = $mappingRoleActorMail['data']['sender']['role_name'];
        $dealId = $mappingRoleActorMail['data']['sender']['deal'];

        $operation = $mappingRoleActorMail['data']['operation'];
        /* This Code Arrenge The Operation By Sequence */
        @uasort($operation, "cmp");

        $reciever = $mappingRoleActorMail['data']['reciever'];
        //                $operationCount = 1;
        //                $operationName = '<table width="100%" border="0" cellspacing="3" cellpadding="0" >';
        //                foreach ($operation as $key => $value) {
        //
    //                 $operationName.= '<tr><td width="1%"></td><td style="font-size:13px; font-family:Arial, Helvetica, sans-serif;">' . $operationCount . '. ' . trim($value['Name']) . '</td></tr>';
        //                    $operationCount++;
        //                }
        //                $operationName .= '</table>';
        //
    //                $operationNewString = wordwrap($operationName, 75, "\n");
        $subject = 'MarineMax: Deal ' . $dealId . ' Operations Updated';
        foreach ($reciever as $key => $value) {

            $to = $value['email'];
            $tempparam = array('type' => 'sendMailAfterOpCompeleted', 'fname' => $value['first_name'], 'roleTitle' => $roleTitle, 'dealId' => $dealId, 'loginURL' => 'http://sta.marinemax.prospus.com/digitalclosing/', 'operation' => $operation);
            $mailtemplate = $builderApiObj->getEmailTemplate($tempparam);
            $mailtemplate = json_decode($mailtemplate, true);
            $body = $mailtemplate['data'];
            sendMail($to, $subject, $body);
        }

        /*                     * End******Send Mail to user on operation
         * By:- Gaurav Dutt Panchal********* */
    }
}

$formData = $builderApiObj->getFormStructure($view_node_id);
$formData = json_decode($formData, true);
$formData['data'].=$oprDocHtml;

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
$dealInstancesArray = getMappedDataInstancesWithClass($dealInstancesArray);
$updated_prop_arr=array();
//print_r($updated_prop_arr);
//print_r($updated_prop_arr);die;
//$updated_prop_arr = getDetailDocumentMappedFieldsPropertyArr($builderApiObj,$mapping_role_actor_node_id,$operation_node_id,$_instanceid,$login_role_id,$login_user_id,$document_node_id,$deal_node_id);
$classNodeId = $builderApiObj->getClassNidFromView($post['view_node_id']);
$documentClassNodeId = json_decode($classNodeId, true);
$updated_prop_arr = getDetailDocumentMappedFieldsPropertyArrForSave($document_node_id, $deal_node_id, $documentClassNodeId['data']);
//print_r($updated_prop_arr);die;
$formData['data']   = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $formData['data'], '', '', '', 'operation_form','View',$updated_prop_arr);

$json['content_detail'] = html_entity_decode($formData['data']);
$json['display_type'] = 'view';
$buttonName = 'Edit';
$apponetooltip = '';

if ($post['operation_node_id'] == COMPLETE_FUNDING_ID) {
    // check if FI Quote is available >>>        
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

/* Start Code By Kunal */
//echo $_instanceid;die;
docSaveByDetails($builderApiObj,$mapping_role_actor_node_id,$operation_node_id,$deal_node_id,$login_role_id,$login_user_id,$document_node_id);
/* End Code By Kunal   */

$restricted_opt = array('455185','455738','455435');
$hidePdf ="";
if(in_array($operation_node_id, $restricted_opt)){
    $hidePdf=" hide ";
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

/*$tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs hide j_my_esign_open" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
                        <i class="prs-icon esign"></i>
                        <span>E Sign</span>
                        </a>';*/

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
/* Gaurav End */

$rightMenu = '<a href="#" data-placement="left" class="tooltip-item editJs action-accept-invitation" onclick="editWorkSpaceAction(this,' . $mapping_role_actor_node_id . ',' . $view_node_id . ')">
                <i class="prs-icon edit"></i>
                <br><span>' . $buttonName . '</span>
            </a>' .
        '<a  href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls '.$hidePdf.'" onclick="downloadPdf(this)" >
                <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
;

 $rightMenu .= $passDeal;
 $rightMenu .=$rejectDeal;

$json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                <i class="prs-icon dialogue"></i>
                <br>
                <span>Dialogue</span>
            </a>' . $rightMenu;
if (count($checkbox_data)) {
    $json['checkbox_data'] = $checkbox_data;
}



$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;
?>