<?php

$view_instance_id                           = $post['view_instance_id'];
$deal_instance_id                           = $post['deal_instance_id'];
$deal_node_id                               = $post['deal_node_id'];
$deal_user_role_id                          = $_permissionRoleId = $post['deal_user_role_id'];
$login_user_id                              = $post['login_user_id'];
$operation_node_id                          = $post['operation_node_id'];
$document_node_id                           = $post['data_document_id'];
$readstatus                                 = $post['readstatus'];
$super_admin_role_id                        = $post['super_admin_role_id'];

if (1) {
    $data['view_instance_id']               = $post['view_instance_id'];
    $data['deal_instance_id']               = $post['deal_instance_id'];
    $data['deal_node_id']                   = $post['deal_node_id'];
    $data['deal_user_role_id']              = $post['deal_user_role_id'];
    $data['login_user_id']                  = $post['login_user_id'];
    $data['operation_node_id']              = $post['operation_node_id'];
    $data['document_node_id']               = $post['data_document_id'];
    $data['readstatus']                     = $post['readstatus'];
    $data['super_admin_role_id']            = $post['super_admin_role_id'];

    $_operationDetailsArr                   = json_decode($builderApiObj->getOperationFormData($data), TRUE);
    $formData                               = $_operationDetailsArr['formData'];
    $dealInstancesArray                     = $_operationDetailsArr['dealInstancesArray'];
    $dealInstancesArray['396138']           = $deal_node_id;
    $mappingRoleActorInstanceId             = $_operationDetailsArr['mappingRoleActorInstanceId'];
    $returnArray                            = $_operationDetailsArr['returnArray'];
    $_permission                            = $_operationDetailsArr['archivedStatus'];
    $flag                                   = $_operationDetailsArr['flag'];

    $updated_prop_arr                       = array();
    if ($document_node_id) {
        $dealInstancesArray                 = getMappedDataInstancesWithClass($dealInstancesArray);
        $documentData                       = current($_operationDetailsArr['documentData'][0][0]);
        $return_arr                         = getDetailDocumentMappedData($documentData);
        
        if ($returnArray['Document'] != "" && $returnArray['Document'] != 'N/A') {
            $updated_prop_arr               = getDetailDocumentMappedFieldsPropertyArr($mappingRoleActorInstanceId, $operation_node_id, $deal_node_id, $return_arr, $returnArray['Form']);
        } else {
            $classNodeId                    = $_operationDetailsArr['classNodeId'];
            $updated_prop_arr               = getDetailDocumentMappedFieldsPropertyArrForSave($document_node_id, $deal_node_id, $classNodeId, $return_arr);
        }
    }

    $var                                    = intval(current($returnArray['FormData'])['node_instance_id']); 
    $formTypeForDom                         = '';
    if ($var > 0) {
        $json['content_values']             = getEditHtmlPropValues($returnArray['FormData']);
        $json['display_type']               = 'view';
        $buttonName                         = 'Edit';
        $buttonClass                        = 'edit';
        $formTypeForDom                     = 'View';
    } else {
        $json['display_type']               = 'add';
        $buttonName                         = 'Save';
        $buttonClass                        = 'save';
        $formTypeForDom                     = 'Add';
    }

    $_formData                              = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $formData, '', '', '', 'operation_form', $formTypeForDom, $updated_prop_arr);
    $json['content_detail']                 = html_entity_decode($_formData);
   
    $tooltip                                = '<a href="#" class="tooltip-item detail-icon detailJs active" data-toggle="tooltip" data-placement="bottom"><i class="prs-icon detail"></i><span>Detail</span></a>';

    if ($post['operation_node_id'] == COMPLETE_FUNDING_ID) {
        // AMIT MALAKAR
        // check if FI Quote is available >>>
        $fiData['operation_code_id']        = OPERATION_PROPERTY_MAP_DEAL_CLASS_ID;
        $fiData['fi_cpid']                  = FI_QUOTE_PID;
        $fiData['deal_node_id']             = $deal_node_id;
        $fiRes                              = $builderApiObj->getFiQuoteValue($fiData);
        $fiValue                            = json_decode($fiRes, true)['data'];

        $dom                                = new domDocument;
        $dom->loadHTML($json['content_detail']);
        $dom->preserveWhiteSpace = false;
        $tags                               = $dom->getElementsByTagName('button');
        $buttonDom                          = '';
        foreach ($tags as $tag) {
            $buttonDom                      .= $tag->getAttribute('onclick');
            if ($buttonDom == 'loadAppOneLogin()') {
                if (!empty($fiValue)) {
                    $tag->removeAttribute('disabled');
                } else {
                    $tag->setAttribute('disabled', true);
                }
                $html                       = $dom->saveHTML();
            }
        }
        $json['content_detail']             = $html;
        // <<< check if FI Quote is available

        $tooltip                            .= '<a href="#" class="tooltip-item appone-icon inactive" data-toggle="tooltip" data-placement="bottom"><i class="prs-icon detail"></i><span>AppOne</span></a>';
    }

    $tooltip                                .= '<a href="#" class="tooltip-item detail-icon documentJs hide" data-toggle="tooltip" data-placement="bottom" onclick="getDocument(this);"><i class="prs-icon document"></i><span>Document</span></a>';
    //only for demo to client it should be remove on confirmaion.
    if ($operation_node_id == "723890" && $super_admin_role_id != ROLE_SUPERADMIN) {
        $tooltip                            .= '<a href="#" class="tooltip-item detail-icon documentJs hide j_my_esign_open" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn"><i class="prs-icon esign"></i><span>E Sign</span></a>';
    }
    $tooltip                                .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom"><i class="prs-icon workflow"></i><span>Workflow</span></a>';

    $json['tooltip']                        = $tooltip;

    /* Gaurav Start */
    //include pass deal and reject deal button
    $deal_node_instance_id                  = $deal_instance_id;
    $post['login_role_id']                  = $_permissionRoleId;
    $_dealInstanceId                        = $post['deal_instance_id'];
    
    /*
    * Modified By: Divya Rajput
    * On Date: 8th March 2017
    * Purpose: include pass_deal.php file when is_other_role_operation is not set or not true.
    */
    if(!isset($post['is_other_role_operation']) || trim($post['is_other_role_operation']) != 'true') {
        include_once 'pass_deal.php';
    }
    /* Gaurav End */

    $restricted_opt                         = array('455185', '455738', '455435');
    $hidePdf                                = "";
    if (in_array($post['operation_node_id'], $restricted_opt)) {
        $hidePdf                            = " hide ";
    }

    $_inactiveAction                        = '';

    $json['permission']                     = $_permission;

    if (trim($readstatus) == '' || empty($readstatus)) {
        if ($json['display_type'] == 'add') {

            $_inactiveAction                = ' inactive ';
            $_onClick                       = '';
            $condition                      = 'condition1';
            if (in_array('Can Save', $_permission) && $flag == 1) {
                $_inactiveAction            = '';
                $_onClick                   = 'onclick="saveWorkSpaceAction(this,' . $mappingRoleActorInstanceId . ')"';
            } else {
                $json['disabled_wrapper']   = 1;
            }

            $rightMenu                      = '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation saveJs' . $_inactiveAction . ' " ' . $_onClick . '><i class="prs-icon ' . $buttonClass . '"></i><br><span>' . $buttonName . '</span></a>';
            $rightMenu                      .= $passDeal;
            $rightMenu                      .= $rejectDeal;
            $rightMenu                      .= $onHoldDeal; //Anil :17-01-2017
            $_inactiveAction                = ' inactive ';
            $_onClick                       = '';
            if (in_array('Can Download Pdf', $_permission) && $flag == 1) {
                $_onClick                   = 'onclick="downloadPdf(this)"';
                $_inactiveAction            = '';
            }
            $rightMenu                      .= '<a data-flag=' . $flag . $condition . ' href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls ' . $hidePdf . ' ' . $_inactiveAction . '" ' . $_onClick . ' ><i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
        } else {
            $condition                      = 'condition2';
            $_inactiveAction                = ' inactive ';
            $_onClick                       = '';
            if (in_array('Can Edit', $_permission) && $flag == 1) {
                $_inactiveAction            = '';
                $_onClick                   = 'onclick="editWorkSpaceAction(this,' . $mappingRoleActorInstanceId . ',' . $view_instance_id . ')"';
            }

            $rightMenu                      = '<a href="#" data-placement="left" class="tooltip-item editJs action-accept-invitation  ' . $_inactiveAction . '" ' . $_onClick . '><i class="prs-icon ' . $buttonClass . '"></i><br><span>' . $buttonName . '</span></a>';

            $rightMenu                      .= $passDeal;
            $rightMenu                      .= $rejectDeal;
            $rightMenu                      .= $onHoldDeal; //Anil :17-01-2017
            $_inactiveAction                = ' inactive ';
            $_onClick                       = '';
            if (in_array('Can Download Pdf', $_permission) && $flag == 1) {
                $_onClick                   = 'onclick="downloadPdf(this)"';
                $_inactiveAction            = '';
            }
            $rightMenu                      .= '<a  data-flag=' . $flag . $condition . ' href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls ' . $hidePdf . ' ' . $_inactiveAction . ' " ' . $_onClick . ' ><i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
        }
    } else {
        /*
        * Modified By: Divya Rajput
        * On Date: 8th March 2017
        * Purpose: Manage icon for Read only Owner Operation: Add "$readonlyownerMenu" variable to manage pass deal icon
        * Sprint 6-Task 141: Update operation class to add read-only owner for an operation.
        */
        $readonlyownerMenu                  = '';
        if ($readstatus == 'readonly') {
            $_onClick                       = 'onclick=""';
            $json['disabled_wrapper']       = 1; //Anil: 16-JAN-2017 Show Message For Other Case
            $_inactiveAction                = ' inactive ';
        } else if ($readstatus == 'editable') {
            $_inactiveAction                = '';
            if ($json['display_type'] == 'add') {
                $_onClick                   = 'onclick="saveWorkSpaceAction(this,' . $mappingRoleActorInstanceId . ')"';
            } else {
                $_onClick                   = 'onclick="editWorkSpaceAction(this,' . $mappingRoleActorInstanceId . ',' . $view_instance_id . ')"';
            }
        }
        else if($readstatus == 'readonlyowner'){
            /*
            * Modified By: Divya Rajput
            * On Date: 8th March 2017
            * Purpose: Manage icon for Read only Owner Operation
            * Sprint 6-Task 141: Update operation class to add read-only owner for an operation.
            */
            $_onClick                       = '';
            $json['disabled_wrapper']       = 1;
            $_inactiveAction                = ' inactive ';
            $readonlyownerMenu              .= $passDeal;
            $readonlyownerMenu              .= $rejectDeal;
            $readonlyownerMenu              .= $onHoldDeal;
        }
        $rightMenu                          = '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation saveJs ' . $_inactiveAction . ' " ' . $_onClick . '><i class="prs-icon ' . $buttonClass . '"></i><br><span>' . $buttonName . '</span></a>';
        $rightMenu                          .= $readonlyownerMenu;
        $_onClick                           = 'onclick="downloadPdf(this)"';
        $rightMenu                          .= '<a  href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls " ' . $_onClick . ' ><i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
    }

    if ($post['i_am_done'] && !$post['is_checked'] && $post['is_completed'] && $is_complete) {
        $_inactiveAction                    = ' inactive ';
        $_onClick                           = '';
        if (in_array('Can Complete', $_permission)) {
            $_onClick                       = 'onclick="confirmCompleteOperation();"';
            $_inactiveAction                = '';
        }
        $rightMenu                          = '<a  href="#" data-placement="left" class="tooltip-item completeJs ' . $_inactiveAction . '" ' . $_onClick . '><i class="prs-icon select"></i><br><span>Complete</span></a>' . $rightMenu;
    }

    $json['actions']                        =   '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                                                    <i class="prs-icon dialogue"></i>
                                                    <br>
                                                    <span>Dialogue</span>
                                                </a>' . $rightMenu;

    // Script Append to hold the current status of form.
    if ($json['display_type'] == 'add') {
        $json['content_detail']             .= '<script>setTimeout(function(){ var container_selector = "#id_detail_content";var element_selector = "input";UtilityModule.setFormState(container_selector, element_selector); }, 2000)</script>';
    }
    
    
$resJsonArr                                 = array('status'=>'1','message'=>'');
$resJsonArr['data']                         = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;
}