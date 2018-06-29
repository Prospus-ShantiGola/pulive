<?php
$is_no_record = 'Y';
$activate_document_btn = false;
//for manage PPC CLASS CLASS
$_allowedSectionTabArr = array(PPC_SETTING);
$_tabFlag = (in_array(trim($post['heading']), $_allowedSectionTabArr)) ? true : false;
if (trim($instanceId) != '' && intval($instanceId) > 0) {
    // *** OPTIMIZED - 500 ms -> 270 ms ***
    $view_form_opt_array = json_decode($builderApiObj->getViewFormStructureData($post),true);
    
    $formData            = html_entity_decode($view_form_opt_array['data']['formData']);
    
    //    $formData = $builderApiObj->getFormStructure($post['add_form_instance_id']);
    //    $formData = json_decode($formData, true);
    //    $formData = html_entity_decode($formData['data']);
    // *** OPTIMIZED - 700 ms -> 280 ms ***
    //echo $instanceId;
    //print_r($view_form_opt_array);die;
//    $instanceData = $builderApiObj->getInstanceEditStructure($instanceId);
//    $instanceData = json_decode($instanceData, true);
    $instanceData = $view_form_opt_array['data']['instanceData'];
    //print_r($instanceData);
    if ($_tabFlag) {
        $data1['class_node_id'] = PERFORMANCE_REVIEW_CLASS_NODEID;
        $data1['columns'] = array('TEAM MEMBER>ID');
    } else {
        $data1['class_node_id'] = DEAL_CLASS_NODEID;
        $data1['columns'] = array('GENERAL>Deal ID #');
    }
    // *** OPTIMIZED - 320 ms -> 250ms ***
    //$propertyArray = json_decode($builderApiObj->getListHeader($data1), true)['data'];
    //$_dealPId = key($propertyArray);

    //$_dealId = current($instanceData['data'])['child'][$_dealPId]['value'];
    $_dealId = $view_form_opt_array['data']['dealId']['node_id'];


    $html = getEditHtmlPropValues($instanceData);
    //provide default phase for old values.
        //    $instanceDataTemp = $instanceData;
        //    foreach ($instanceDataTemp['data'] as $instKey => $value) {
        //        # code...
        //        foreach ($value['child'] as $childkey => $childvalue) {
        //            # code...if
        //            if ($childkey == DEAL_PHASE_VERSION_PROPERTY_ID) {
        //
        //                $sequenceVersion = $childvalue['value'];   // deal Sequence.
        //            }
        //        }
        //    }
        //
        //    $_dealpCreator = $builderApiObj->getNodeXOfParticulerClass($_dealId, 'node_y_id', 'node_x_id', '778');
        //    // var_dump($_dealpCreator);
        //    $_classVal = json_decode($_dealpCreator, true);
        //
        //
        //
        //    if (is_array($_classVal) && intval(current($_classVal)['node_x_id']) > 0) {
        //        $dealCreatorRes = $builderApiObj->getInstanceListOfParticulerClass(current($_classVal)['node_x_id'], 'node', 'node_id');
        //        $dealCreatorData = json_decode($dealCreatorRes, true);
        //    }
        //
        //    $allSequenceInsArray = $builderApiObj->getInstanceListOfParticulerClass(MANAGE_PHASE_SEQUENCE, 'class', 'node_id');
        //    $allSequenceInsArray = json_decode($allSequenceInsArray, true);
        //
        //    foreach ($allSequenceInsArray['data'] as $seqKey => $seqVal) {
        //
        //        //if($seqVal['Current Version']=='Yes' && $seqVal['Deal Creator'] == current($dealCreatorData['data'])['Role NID']){
        //        if ($seqKey == $sequenceVersion) {
        //            $sequenceArr = $seqVal['Phase Sequence'];
        //        }
        //    }
        //
        //    $sequenceArr = explode(",", $sequenceArr);
        //    $operationPhaseRes = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_PHASE_CLASS_ID, 'class', 'node_id');
        //    $operationPhaseData = json_decode($operationPhaseRes, true);
        //    $role_array = array();
        //    foreach ($operationPhaseData['data'] as $key => $value) {
        //        # code...
        //        foreach ($sequenceArr as $seqkey => $seqvalue) {
        //            # code...
        //            if (trim($value['Sequence']) == ($seqkey + 1)) {
        //                $role_array[] = $key;   //actual phase to store.
        //            }
        //        }
        //    }
        //
        //
        //    $role_phase = array_combine($sequenceArr, $role_array);
        //    if ($instanceDataTemp['data']['phase']['instance_id'] == NULL) {
        //        /* shanti code starts */
        //
        //
        //        $rolePhase = intVal(array_search($deal_actor_role_node_id, $sequenceArr)) + 1;
        //        $operationPhaseData = json_decode($operationPhaseRes, true);
        //        foreach ($operationPhaseData['data'] as $phaseKey => $phaseArr) {
        //            # code...
        //            if (trim($phaseArr['Sequence']) == $rolePhase) {
        //                $operationPhaseVal = $phaseKey;   //actual phase to store.
        //            }
        //        }
        //        $phaseRole = $sequenceArr[$rolePhase - 1];
        //        //die();
        //        /* shanti code ends here */
        //        $instanceData['data']['phase'] = array(
        //            'DealId' => $_dealId,
        //            'PhaseId' => $operationPhaseVal,
        //            'RoleId' => $phaseRole,
        //            'Status' => '0'
        //        );
        //    }
        //    $json['rolePhase'] = $role_phase;
    if ($form_container == '_flyout') {
        $json['head'] = 'Deal ' . $_dealId . ': Details';
    } else {
        if ($heading == 'Deals') {
            $json['head'] = 'Deal ' . $_dealId . ': Details';
        } else {
            $json['head'] = $heading . ' ' . $_dealId . ': Details';
        }
    }


    if($post['login_role_id']==ADMIN) {
        $json['tree'] = $instanceData['tree'];
    }
    
    $json['content_values'] = $html;
    $json['content_detail'] = $formData;
    $json['display_type'] = 'view';

    $status = current($instanceData)['status'];
    if (intval($status) == 1) {
        $activate_document_btn = true;
    }
    $json['activate_document_btn'] = $activate_document_btn;


    //if ($post['heading'] == 'Deals')
        //$json['phase'] = $instanceData['data']['phase'];   //phase information for deal.
        /* code start for fetch details of roles for selected deals */

    // *** OPTIMIZED - 250 ms -> 250 ms ***
    $instanceNData = $view_form_opt_array['data']['instanceNData'];
    //$instanceNData = json_decode($instanceNData, true);
    $roleArray = $view_form_opt_array['data']['roleArray'];
    //$roleArray = json_decode($roleData, true);
    // Get All Required role for publish
    // *** OPTIMIZED - 260 ms -> 220 ms ***
    $requiredRolesArray = explode(',',$view_form_opt_array['data']['requiredRoles']['value']);
    //$requiredRoles = $builderApiObj->getVisibleNRequiredRoles($post['login_role_id'], REQUIRED_ROLES_PROP_ID);
    //$requiredRolesArray = explode(',', json_decode($requiredRoles, true)['data']['value']);
    //print_r($requiredRoles);die;
    $is_publish_display = 0;
    foreach ($roleArray as $key => $value) {
        if (trim($value['actor']) != '' && trim($value['user_name']) != '' && trim($value['deal']) === trim($instanceNData)) {
            if (in_array($key, $requiredRolesArray /* array(ROLE_SALES_CONSULTANT, ROLE_BUSINESS_MANAGER, ROLE_BM, ROLE_TEAM_SUPPORT, ROLE_BUYER, ROLE_REVENUE_ACCOUNTANT) */)) {
                $is_publish_display++;
            }
        }
    }

    /* end code here */
} else {
    $is_no_record = 'N';
    $json['content_detail'] = '<div class="noEntry">No Records Found</div>';
    // If no record is listed than heading change
    $json['head'] = 'N/A: Detail';
}
// *** OPTIMIZED - 750 ms ->  ms ***
$_permission = getOperationActionPermission($roleId, $_dealId);
$json['permission'] = $_permission;
//print_r($_permission);die;

if ($is_no_record == 'N') {

    $tooltip = '<a href="#" class="tooltip-item detail-icon detailJs inactive" data-toggle="tooltip" data-placement="bottom">
                <i class="prs-icon detail"></i>
                <span>Detail</span>
                </a>';

    $tooltip .= '<a href="#" class="tooltip-item detail-icon inactive other-then-deal" data-toggle="tooltip" data-placement="bottom">
                <i class="prs-icon team-member"></i>
                <span>Team Members</span>
                </a>';


    $tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive other-then-deal" data-toggle="tooltip" data-placement="bottom">
                <i class="prs-icon workflow"></i>
                <span>Workflow</span>
                </a>';

    $json['tooltip'] = $tooltip;

    $json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs other-then-deal">
                    <i class="prs-icon dialogue"></i>
                    <br>
                    <span>Dialogue</span>
                </a>
                <a href="#" data-placement="left" class="tooltip-item action-accept-invitation editJs inactive">
                    <i class="prs-icon edit"></i>
                    <br><span>Edit</span>
                </a>';
} else {
    $_allowedSectionArr         = json_decode(ALLOW_SECTION_ARRAY,TRUE);  // allowed section where edit condition implemented avoid these section for edit checks.
    $_canDealEditClick          = (in_array($post['heading'], $_allowedSectionArr)) ? 'callEditContentAction(0)' : '';
    $_canDealEditCls            = (in_array($post['heading'], $_allowedSectionArr)) ? '' : 'inactive';
    //$canDealEdit = $post['canDealEdit'];
    //if ($canDealEdit == 1) {
    //echo archiveStatus
    if(in_array('Can Edit Deal',$_permission) || current($instanceData)['status'] == 0 || (in_array("Can Publish Archived Deal",$_permission) && in_array("Is Archived Deal",$_permission))){
        $_canDealEditCls = '';
        $_canDealEditClick = 'callEditContentAction(0)';
    }
    
    $tooltip = '<a href="#" class="tooltip-item detail-icon detailJs active" data-toggle="tooltip" data-placement="bottom">
                <i class="prs-icon detail"></i>
                <span>Detail</span>
                </a>';
    if ($_tabFlag) {
        $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs documentJsBtn" data-toggle="tooltip" data-placement="bottom" onclick="getReviewDocument();">
                                    <i class="prs-icon document"></i>
                                    <span>Document</span>
                                    </a>';
        /* $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs j_my_esign_open inactive" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
          <i class="prs-icon esign"></i>
          <span>E Sign</span>
          </a>'; */
    }


    if ($form_container == '_flyout') {
        $json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
                                <i class="prs-icon dialogue"></i>
                                <br><span>Dialogue</span>
                            </a>
                            <a href="#" class="j_my_createDeal_close">
                                <i class="prs-icon icon_close"></i>
                                <br><span>Close</span>
                            </a>';
    } else {
        if (intval($is_publish_display) == count($requiredRolesArray) && current($instanceData)['status'] == 0) {

            $workSpDiabled = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal deals-space-roles workspace-action" onclick="getWorkSpacePage(this)" >
                    <i class="prs-icon publish"></i><br><span>Publish</span>
                    </a>';
        } else {
            $workSpDiabled = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal deals-space-withroles workspace-action" onclick="getWorkSpacePage(this)" >
                    <i class="prs-icon publish"></i><br><span>Publish</span>
                    </a>';
        }




        $tooltip .= (current($instanceData)['status'] == 1) ? '<a href="#" class="tooltip-item detail-icon other-then-deal" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(1)">
                    <i class="prs-icon team-member"></i>
                    <span>Team Members</span>
                    </a>' : '<a href="#" class="tooltip-item detail-icon other-then-deal" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(1)" >
                    <i class="prs-icon team-member"></i>
                    <span>Team Members</span>
                    </a>';


        $tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive other-then-deal" data-toggle="tooltip" data-placement="bottom">
                    <i class="prs-icon workflow"></i>
                    <span>Workflow</span>
                    </a>';

        $json['tooltip'] = $tooltip;


        $workspace = (current($instanceData)['status'] == 1) ? '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal workspace-action" onclick="getWorkSpacePage(this)" >
                    <i class="prs-icon workspace"></i><br><span>Workspace</span>
                    </a>' : $workSpDiabled;

        $downloadPdf = '<a  href="#" onclick="downloadPdf()" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal download-pdf hide">
                        <i class="prs-icon pdf"></i>
                        <br>
                        <span>Download PDF</span>
                    </a>';
        $uploaddocument = '';
        if (current($instanceData)['status'] == 1) {
            $uploaddocument = '<a href="#" onclick="uploadoperationdocument(this)" data-placement="left" class="j_my_createDeal_open hide">
                        <i class="prs-icon pdf"></i>
                        <br>
                        <span>Upload Document</span>
                    </a>';
        }
        // pass deal flag
        $deal_actor_role_node_id = $post['login_role_id'];
        $deal_node_instance_id = $post['instance_id'];

        //GAURAV DUTT PANCHAL
        //******************************START******************FOR CONTROL MANAGEMENT CLASS****************************************************************
//        $dealInfo = $builderApiObj->getParticulerColumnValue('node-instance', 'node_instance_id', $deal_node_instance_id, 'node_id');
//        $deal_node_id = json_decode($dealInfo, true)['data'];
//        print_r(array($deal_node_instance_id,$deal_node_id,$view_form_opt_array['data']['instanceNData']));die;
        $deal_node_id = $view_form_opt_array['data']['instanceNData'];
        /* Start Gaurav */
        //include hold and restore, pass deal and reject deal button
        $_dealInstanceId = $instanceId;
        // *** OPTIMIZED - 2600 ms -> 280 ms ***
        include_once 'pass_deal.php';
        /* End Gaurav */
        //******************************END******************FOR CONTROL MANAGEMENT CLASS****************************************************************

        //        // TO CHECK WITH SHANTI
        //        $is_deal_editable_role = isDealEditableRole($deal_actor_role_node_id, $deal_node_id, $deal_node_instance_id, "deal");
        //        //print_r($is_deal_editable_role); die();
        //        if (!$is_deal_editable_role) {
        //            $_canDealEditCls = 'hide';
        //        }

        //print_r($json['tree'][655][0]['instance'][3287]);
        
		
		
		$editActionName = "Edit";
        if($post['login_role_id']==ADMIN){
            // *** OPTIMIZED - 4080 ms ->  520 ms ***
            //$rolesTemp = getRoleDropDown($builderApiObj);
            //print_r($view_form_opt_array['data']);die;
            $json['roleDD'] = $view_form_opt_array['data']['html'];
            $json['roleNames'] = $view_form_opt_array['data']['name'];
        }
        if($post['login_role_id']==ROLE_SUPERADMIN){
			$editActionAnchor ='<a href="#" onclick="" data-placement="left" class="tooltip-item  editJs action-accept-invitation inactive"><i class="prs-icon edit"></i><br><span>Edit</span><br></a>'; 
		}else {
		$editActionAnchor = '<a href = "#" onclick = "' . $_canDealEditClick . '" data-placement = "left" class = "tooltip-item  editJs action-accept-invitation ' . $_canDealEditCls . '">
        <i class = "prs-icon edit"></i>
        <br>
        <span>' . $editActionName . '</span><br>       
        </a>';
		}
		
        $dialogueActionAnchor = '<a href = "#" data-placement = "left" class = "tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
        <i class = "prs-icon dialogue"></i>
        <br>
        <span>Dialogue</span>
        </a>';
       
        $json['actions'] = $dialogueActionAnchor . $workspace . $downloadPdf . $uploaddocument . $passDeal . $rejectDeal . $onHoldDeal . $editActionAnchor;


        /*$json['RAactions'] = '<a href = "#" data-placement = "left" class = "tooltip-item action-accept-invitation inactive">
        <i class = "prs-icon draft"></i>
        <br>
        <span>Archive</span>
        </a>
        <a href = "#" data-placement = "left" class = "tooltip-item action-accept-invitation inactive">
        <i class = "prs-icon icon_close"></i>
        <br><span>Cancel</span>
        </a>
        <a href = "#" data-placement = "left" class = "tooltip-item action-accept-invitation inactive">
        <i class = "prs-icon restore"></i>
        <br><span>Restore</span>
        </a>';*/
        
        $json['RAactions'] = '';

    }
}
?>