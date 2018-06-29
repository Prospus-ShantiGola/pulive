<?php

$is_save_enable = 'Y';
$is_actions_display = 'Y';
$activate_document_btn = false;

//for manage PPC CLASS
//$_allowedSectionTabArr = array(PPC_SETTING);
//$_tabFlag = (in_array(trim($post['heading']), $_allowedSectionTabArr)) ? true : false;

if (trim($instanceId) != '' && intval($instanceId) > 0) {
    
    $view_form_opt_array = json_decode($builderApiObj->getEditFormStructureData($post),true);
    //print_r($view_form_opt_array);die;
//    $formData = $builderApiObj->getFormStructure($post['add_form_instance_id']);
//    $formData = json_decode($formData, true);
//    $formData = html_entity_decode($formData['data']);
      $formData = html_entity_decode($view_form_opt_array['data']['formData']);
      
//    $instanceData = $builderApiObj->getInstanceEditStructure($instanceId);
//    $instanceData = json_decode($instanceData, true);
    $instanceData = $view_form_opt_array['data']['instanceData'];
    //print_r($view_form_opt_array['data']);die;
    //print_r($instanceData);die;
//    if ($_tabFlag) {
//        $data1['class_node_id'] = PERFORMANCE_REVIEW_CLASS_NODEID;
//        $data1['columns'] = array('TEAM MEMBER > ID');
//    } else {
//        $data1['class_node_id'] = DEAL_CLASS_NODEID;
//        $data1['columns'] = array('GENERAL>Deal ID #');
//    }

    //$propertyArray = json_decode($builderApiObj->getListHeader($data1), true)['data'];
    //$_dealPId = key($propertyArray);
    //$_dealId = current($instanceData['data'])['child'][$_dealPId]['value'];
    //$_dealId = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($instanceId, $_dealPId)),true)['value'];
    //echo $_dealId.'ss';echo $view_form_opt_array['data']['dealId']['value'];die;
    $_dealId = $view_form_opt_array['data']['dealId']['value'];
    $html = getEditHtmlPropValues($instanceData);

    //$rolesTemp = getRoleDropDown($builderApiObj);
    $json['roleDD']         =   $view_form_opt_array['data']['html'];//$rolesTemp['html'];
    $json['roleNames']      =   $view_form_opt_array['data']['name'];//$rolesTemp['name'];
    $json['content_values'] = $html;
    $json['content_detail'] = $formData;
    $json['display_type'] = 'edit';
    $json['checkVal'] = $post['checkVal'];
    $json['phase'] = $instanceData['phase'];
    $json['tree'] = $instanceData['tree'];
    $status = current($instanceData)['status'];

    if (intval($status) == 1) {
        $is_save_enable = 'N';
        $activate_document_btn = true;
    }
    $json['activate_document_btn'] = $activate_document_btn;

//    $instanceNData = $builderApiObj->getParticulerColumnValue('node-instance', 'node_instance_id', $instanceId, 'node_id');
//    $instanceNData = json_decode($instanceNData, true);
    $instanceNData = $view_form_opt_array['data']['instanceNData'];

//    $roleData = $builderApiObj->getActorWithRoleAndDeal($instanceNData);
//    $roleArray = json_decode($roleData, true);
    $roleArray = $view_form_opt_array['data']['roleArray'];
    // Get All Required role for publish
//    $requiredRoles = $builderApiObj->getVisibleNRequiredRoles($post['login_role_id'], REQUIRED_ROLES_PROP_ID);
//    $requiredRolesArray = explode(',', json_decode($requiredRoles, true)['data']['value']);
    $requiredRolesArray = explode(',',$view_form_opt_array['data']['requiredRoles']['value']);
    $is_publish_display = 0;
    // Get deal type
    //$_dealType = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($instanceId, DEAL_PAYMENT_TYPE_PROPERTY_ID)), TRUE)['value'];
    $_dealType = $view_form_opt_array['data']['dealType']['value'];
    if(strtolower($_dealType) == strtolower('cash')){
        // Remove seller role from roles and required roles array
        $requiredRolesArray = array_merge(array_diff($requiredRolesArray, array(ROLE_SELLER)));
        unset($roleArray[ROLE_SELLER]);
        //unset($instanceData['data'][ROLE_SELLER]);
    }

    foreach ($roleArray as $key => $value) {
        if (trim($value['actor']) != '' && trim($value['user_name']) != '' && trim($value['deal']) === trim($instanceNData)) {
            if (in_array($key, $requiredRolesArray /* array(ROLE_SALES_CONSULTANT, ROLE_BUSINESS_MANAGER, ROLE_BM, ROLE_TEAM_SUPPORT, ROLE_BUYER, ROLE_REVENUE_ACCOUNTANT) */)) {
                $is_publish_display++;
            }
        }
    }
} else {
    $json['content_detail'] = 'No Records Found';
    $is_actions_display = 'N';
}
$json['head'] = $heading . ' ' . $_dealId . ': Detail';


$json['tooltip'] = '<a href="#" class="tooltip-item detail-icon detailJs  active" data-toggle="tooltip" data-placement="bottom">
                                                                <i class="prs-icon detail"></i><span>Detail</span>
                                                                </a>';
if ($_tabFlag) {
    $json['tooltip'] .='<a href="#" class="tooltip-item detail-icon   documentJs documentJsBtn" data-toggle="tooltip" data-placement="bottom" onclick="getReviewDocument();">
                                    <i class="prs-icon document"></i>
                                    <span>Document</span>
                                    </a>';
    /*$json['tooltip'] .='<a href="#" class="tooltip-item detail-icon documentJs j_my_esign_open inactive" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
                                            <i class="prs-icon esign"></i>
                                            <span>E Sign</span>
                                        </a>';*/
}
$json['tooltip'] .='<a href="#" class="tooltip-item detail-icon other-then-deal" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(1)" >
                                                                <i class="prs-icon team-member"></i><span>Team Members</span>
                                                                </a>
                                                                <a href="#" class="tooltip-item detail-icon hide inactive other-then-deal" data-toggle="tooltip" data-placement="bottom">
                                                                <i class="prs-icon workflow"></i><span>Workflow</span>
                                                            </a>';

// if instance is already published, disable Save button
if ($is_actions_display == 'Y') {

//       if($post['heading']=='Performance Review'){
//            $saveActionName = "Save Review";
//            $publishActionName = "Publish Review";
//        }else{
//            $saveActionName = "Save";
//            $publishActionName = "Publish";
//
//        }
    $saveActionName = "Save As Draft";
    $publishActionName = "Publish";
    if ($is_save_enable == 'Y') {
        $saveDraft = '<a id="save_as_draft" href="#" onclick="callDetailsContentAction(\'D\')" data-placement="left" class="tooltip-item action-accept-invitation">
                                                                <i class="prs-icon save"></i><br><span>' . $saveActionName . '</span>
                                                            </a>';
    } else {
        $saveDraft = '<a id="save_as_draft" href="#" data-placement="left" class="tooltip-item action-accept-invitation disabled-icon">
                                                                <i class="prs-icon save"></i><br><span>' . $saveActionName . '</span>
                                                            </a>';
    }

    if ($post['add_form_instance_id'] == DEAL_VIEW_ID) {

        if (intval($is_publish_display) == count($requiredRolesArray)) {
            $publishButton = '<a href="#" onclick="callDetailsContentAction(\'P\')" data-placement="left" class="tooltip-item action-accept-invitation">
                                                                <i class="prs-icon publish"></i><br><span>Publish</span>
                                                            </a>';
        } else {
            $publishButton = '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation disabled-icon">
                                                                <i class="prs-icon publish"></i><br><span>Publish</span>
                                                            </a>';
        }
    } else {



        $publishButton = '<a href="#" onclick="callDetailsContentAction(\'P\')" data-placement="left" class="tooltip-item action-accept-invitation">
                                                                <i class="prs-icon publish"></i><br><span>' . $publishActionName . '</span>
                                                            </a>';
    }


    $json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
                                                                <i class="prs-icon dialogue"></i>
                                                                <br>
                                                                <span>Dialogue</span>
                                                                </a>' . $saveDraft . $publishButton .
            '<a href="#" onclick="cancelFormAction();" class="tooltip-item action-accept-invitation show-confirmation j_my_createDeal_close">
                                                                <i class="prs-icon icon_close"></i><br><span>Cancel</span>
                                                            </a>';
} else {
    $json['actions'] = '';
}
?>