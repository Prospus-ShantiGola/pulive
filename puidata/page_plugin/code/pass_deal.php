<?php

    if (1) {
        $data                          = array();
        $data['deal_instance_id']      = $_dealInstanceId;
        $data['login_user_id']         = $post['login_user_id'];
        $data['login_role_id']         = $post['login_role_id'];
        $data['deal_node_instance_id'] = $deal_node_instance_id;
        $data['deal_node_id']          = $deal_node_id;
        $passByDealDataRes             = $builderApiObj->getPassByDealData($data);
        $passByDealData                = json_decode($passByDealDataRes, true);
        $passDeal                      = isset($passByDealData['passDeal']) ? $passByDealData['passDeal'] : '';
        $rejectDeal                    = isset($passByDealData['rejectDeal']) ? $passByDealData['rejectDeal'] : '';
        $onHoldDeal                    = isset($passByDealData['onHoldDeal']) ? $passByDealData['onHoldDeal'] : '';
        //Manage Label for Read only Owner Operation
        //print_r($passByDealData); die();
    } else {

//GAURAV DUTT PANCHAL
//******************************START******************FOR CONTROL MANAGEMENT CLASS****************************************************************
//GET INSTANCE NODE ID


$instanceNodeId = json_decode($builderApiObj->getInstanceNodeId(DEAL_CLASS_ID, $deal_node_instance_id), true);
//echo $deal_node_instance_id.'ku';
$archivedStatusRes = $builderApiObj->checkInArchivedStatus($instanceNodeId);
$archivedStatus = json_decode($archivedStatusRes, true);
if ((int) $archivedStatus == 0) {//deal not archieved yet
    //*****************GET control_version_id deal ids***************
    $dealDeailsRes = $builderApiObj->getDealDetails($instanceNodeId);
    $dealDeails = json_decode($dealDeailsRes, true);



    //*****************GET deal_creator user ids***************
    $dealOwnerRes = $builderApiObj->getNodeXOfParticulerClass($instanceNodeId, 'node_y_id', 'node_x_id', DEAL_CREATOR_CLASS_ID);
    $dealOwner = json_decode($dealOwnerRes, true);

    //GET DEAL OWNER DETAILS
    if (is_array($dealOwner) && intval(current($dealOwner)['node_x_id']) > 0) {
        $dealOwnerResVal = $builderApiObj->getInstanceListOfParticulerClass(current($dealOwner)['node_x_id'], 'node', 'node_id');
        $dealOwnerResArr = json_decode($dealOwnerResVal, true);
        $dealOwnerRes = current($dealOwnerResArr['data']);
    }

    //*****************GET DEAL DETAILS IN PASS BY ROLE CLASS ARRAY***************
    $instanceId = $dealDeails['node_instance_id'];


    // *** OPTIMIZED - 240 ms ->  ms ***
    //Get Deal Size
    $dealSizeRes = $builderApiObj->getDealSize($instanceId);
    $dealSize = json_decode($dealSizeRes, true);

    $passByRoleArrRes = $builderApiObj->checkDealInPassedByRoles($instanceId, $instanceNodeId);
    $passByRoleArr = json_decode($passByRoleArrRes, true);


    //*****************GET control_version_id deal ids***************
    $checkInstanceNodeId = $passByRoleArr['deal'];
    $controlVersionId = $dealDeails['control_version_id'];
    $toRoleId = $passByRoleArr['from_to'];
    if ($toRoleId == '') {
        $toRoleId = $dealOwnerRes['Role NID'];
    }

    $passDealRes = $builderApiObj->checkInPassedDealsByRolesCls($controlVersionId, $toRoleId);
    $passDealArr = json_decode($passDealRes, true);

    $dealStatus = (int) $dealDeails['status'];
    $loginUserId = (int) trim($post['login_user_id']);
    $dealCreatorId = (int) trim($dealOwnerRes['User NID']);
    $loginRoleId = (int) trim($post['login_role_id']);
    $dealControllerId = (int) trim($passByRoleArr['from_to']);
    $activeManageControlNodeId = (int) trim($passDealArr['active_node_id']);
    //for published deal
    $passDealCls = 'inactive';
    $condForPassDeal = 'cond-0';

    $data['node_id'] = $activeManageControlNodeId;
    $data['deal_instance_id'] = $instanceId;
    $data['role_id'] = $loginRoleId;
    $data['permission'] = 'pass';

    $controlRoleRes = $builderApiObj->getOperationPermission($data);
    $controlRoleArr = json_decode($controlRoleRes, true);
    $controlRoleCount = count($controlRoleArr);

    $roleArr = array();
    if ($controlRoleCount > 0) {
        $i = 0;
        foreach ($controlRoleArr as $roleId) {
            $roleNameArr = json_decode($builderApiObj->getRoleName($roleId), true)['data'];
            $roleArr[$i]['role_id'] = $roleId;
            $roleArr[$i]['role_title'] = $roleNameArr[$roleId]['Title'];
            $i++;
        }
    }

    $raOnDealRes = $builderApiObj->getRAonDeal($loginRoleId, $instanceNodeId);
    $raOnDeal = json_decode($raOnDealRes, true);

    $raActorId = (int) $raOnDeal[ROLE_REVENUE_ACCOUNTANT]['actor'];
    $bmActorId = (int) $raOnDeal[ROLE_BM]['actor'];
    $rmActorId = (int) $raOnDeal[ROLE_REVENUE_MANAGER]['actor'];
    $ctrlActorId = (int) $raOnDeal[ROLE_CONTROLLER]['actor'];
    $dirActorId = (int) $raOnDeal[ROLE_DIRECTOR]['actor'];


    switch ($controlRoleCount) {
        case '0': $passRoleFlag = 'pass-to-deal-creator';
            break;
        case '1': $passRoleFlag = 'pass-to-single';
            break;
        default : $passRoleFlag = 'pass-to-multiple';
            break;
    }

    $label = 'Pass the Deal';
    $reject_label = 'Return Deal';
    $roleMsgArr = array(
        ROLE_TEAM_SUPPORT => array('role_name' => 'Team Support', 'text' => '', 'label' => 'Pass the Deal', 'reject_label' => 'Return Deal'),
        ROLE_SALES_CONSULTANT => array('role_name' => 'Sales Consultant', 'text' => '', 'label' => 'Pass the Deal', 'reject_label' => 'Return Deal'),
        ROLE_SELLER => array('role_name' => 'Seller', 'text' => '', 'label' => 'Pass the Deal', 'reject_label' => 'Return Deal'),
        ROLE_BUYER => array('role_name' => 'Buyer', 'text' => '', 'label' => 'Pass the Deal', 'reject_label' => 'Return Deal'),
        ROLE_BM => array('role_name' => 'Business Manager', 'text' => 'Are you sure you want to request deal posting?', 'label' => 'Request Deal Posting', 'reject_label' => 'Return Deal'),
        ROLE_REVENUE_ACCOUNTANT => array('role_name' => 'Revenue Accountant', 'text' => 'Are you sure you want to mark the deal as posted?', 'label' => 'Deal Posted', 'reject_label' => 'Return to Business Manager'),
        ROLE_REVENUE_MANAGER => array('role_name' => 'Revenue Manager', 'text' => 'Are you sure you want to mark the review as complete?', 'label' => 'Review Complete', 'reject_label' => 'Return to Revenue Accountant'),
        ROLE_CONTROLLER => array('role_name' => 'Controller', 'text' => 'Are you sure you want to mark the review as complete?', 'label' => 'Review Complete', 'reject_label' => 'Return to Revenue Accountant'),
        ROLE_DIRECTOR => array('role_name' => 'Director', 'text' => 'Are you sure want to mark the deal as final approved?', 'label' => 'Approved', 'reject_label' => 'Return to Revenue Accountant')
    );

    $roleArrParamArr['pass_role_flag'] = $passRoleFlag;
    $roleArrParamArr['login_role_id'] = $loginRoleId;
    $roleArrParamArr['login_user_id'] = $loginUserId;
    if ($roleMsgArr[$loginRoleId]['text'] != '') {
        $label = $roleMsgArr[$loginRoleId]['label'];
    }
    $reject_label = $roleMsgArr[$loginRoleId]['reject_label'];
    $roleArrParamArr['confirm_msg'] = $roleMsgArr[$loginRoleId]['text'];
    $roleArrParamArr['deal_instance_node_id'] = $instanceNodeId;
    $roleArrParamArr['roles'] = $roleArr; //json_encode($roleArr);
    $roleArrParamArr['deal_status'] = $dealStatus;
    $roleArrParamArr['deal_size'] = $dealSize;
    $roleArrParamArr['status'] = $archivedStatus;
    //$roleArrParamArr['active_manage_control_node_id'] = $activeManageControlNodeId;
    //$roleArrParamArr['deal_creator_id'] = $dealCreatorId;
    //$roleArrParamArr['current_deal_controller_role_id'] = $dealControllerId;
    //$roleArrParamArr['deal_instance_node_id'] = $instanceNodeId;
    $roleArrParamArr['deal_instance_id'] = $instanceId;
    //$roleArrParamArr['ra_on_deal'] = $raActorId;
    $roleArrParamArr['bm_user_id'] = $bmActorId;
    $roleArrParamArr['ra_user_id'] = $raActorId;
    $roleArrParamArr['rm_user_id'] = $rmActorId;
    $roleArrParamArr['ctrl_user_id'] = $ctrlActorId;
    $roleArrParamArr['dir_user_id'] = $dirActorId;





    $roleArrParam = htmlentities(json_encode($roleArrParamArr), ENT_QUOTES, 'UTF-8');
    //$roleArrParam = json_encode($roleArrParamArr);
    $rejectDealCls = 'inactive';
    if ($dealStatus == 1) {
        $condForPassDeal = 'cond-1';
        //if login user and deal creator are same
        if ($loginUserId == $dealCreatorId) {

            $condForPassDeal = 'cond-2';
            if ($dealControllerId > 0) {
                $condForPassDeal = 'cond-3';
                // Now login user has control to pass the deal
                if ($loginRoleId == $dealControllerId) {

                    if ($loginRoleId == ROLE_REVENUE_ACCOUNTANT && (int) $raActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-4.1';
                    } else if ($loginRoleId == ROLE_BM && (int) $bmActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-4.2';
                    } else if ($loginRoleId == ROLE_REVENUE_MANAGER && (int) $rmActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-4.3';
                    } else if ($loginRoleId == ROLE_CONTROLLER && (int) $ctrlActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-4.4';
                    } else if ($loginRoleId == ROLE_DIRECTOR && (int) $dirActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-4.5';
                    } else {
                        $passDealCls = '';
                        $rejectDealCls = '';
                        $condForPassDeal = 'cond-4.6';
                    }
                    
                    if ($loginRoleId == ROLE_BM){
                        $rejectDealCls = 'inactive';
                    }
                }
            } else {
                // Then deal is not passed to others role
                // not deal creator has access to pass the deal
                if($loginRoleId == ROLE_BM){
                    $passDealCls = '';
                    $condForPassDeal = 'cond-5.1';
                }else{
                    $passDealCls = 'inactive';
                    $condForPassDeal = 'cond-5.2';
                }

            }
        } else {




            $condForPassDeal = 'cond-6';
            //if login user and deal creator are not same
            if ($dealControllerId > 0) {
                $condForPassDeal = 'cond-7';
                // Now login user has control to pass the deal and RA assigned on this deal

                if ($loginRoleId == $dealControllerId) {
                    $passDealCls = '';
                    $rejectDealCls = '';
                    $condForPassDeal = 'cond-8';
                }
//                if (ROLE_REVENUE_ACCOUNTANT == (int) $loginRoleId) {
//                    if ((int) $raActorId != (int) $loginUserId) {
//                        $passDealCls = 'inactive';
//                        $rejectDealCls = 'inactive';
//                        $condForPassDeal = 'cond-9';
//                    }
//                }
                   if ($loginRoleId == ROLE_REVENUE_ACCOUNTANT && (int) $raActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-9.1';
                    } else if ($loginRoleId == ROLE_BM && (int) $bmActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-9.2';
                    } else if ($loginRoleId == ROLE_REVENUE_MANAGER && (int) $rmActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-9.3';
                    } else if ($loginRoleId == ROLE_CONTROLLER && (int) $ctrlActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-9.4';
                    } else if ($loginRoleId == ROLE_DIRECTOR && (int) $dirActorId != (int) $loginUserId) {
                        $passDealCls = 'inactive';
                        $rejectDealCls = 'inactive';
                        $condForPassDeal = 'cond-9.5';
                    }
                    
                    if ($loginRoleId == ROLE_BM){
                        $rejectDealCls = 'inactive';
                    }
            }
        }
    }
    if ($loginRoleId == ROLE_REVENUE_ACCOUNTANT && (int) $raActorId == (int) $loginUserId) {
        $_status = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($_dealInstanceId, DEAL_STATUS_PID)), true)['value'];
        $_subStatus = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($_dealInstanceId, DEAL_SUB_STATUS_PID)), true)['value'];

        $onHoldDeal = '<a href="#" data-placement = "left" class = "tooltip-item inactive"><i class = "prs-icon onHold"></i><br><span>On Hold</span></a>';
        if (/* $_status == 'Posting' && */ ($_subStatus == 'In Progress' /* || $_subStatus == 'Unassigned' */) && $toRoleId == ROLE_REVENUE_ACCOUNTANT) { //Posting
            $onHoldDeal = '<a href="#" onclick = "callOnholdContentAction(this);" data-placement = "left" class = "tooltip-item"><i class = "prs-icon onHold"></i><br><span>On Hold</span></a>';
        } else {
            //$_dealInstanceNodeId  = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-instance', array('node_instance_id'), array($_dealInstanceId)), true)['node_id'];
            //$_controlRole = json_decode($builderApiObj->checkDealInPassedByRoles($instanceId, $_dealInstanceNodeId),TRUE);
            if (trim($_subStatus) != '' && $_subStatus != 'In Progress' /* && $_subStatus != 'Unassigned' */ && $toRoleId == ROLE_REVENUE_ACCOUNTANT) {
                $rejectDealCls = $passDealCls = ' inactive ';
                $onHoldDeal = '<a href="#" onclick = "restoreOnholdContentAction(this);" data-placement = "left" class = "tooltip-item"><i class = "prs-icon restore"></i><br><span>Restore</span></a>';
            }
        }
    }
    // condition add for Super Admin Role
	if($post['login_role_id']==ROLE_SUPERADMIN){
		$passDeal = '<a href="#" cond-val="cond-5" data-settings="" onclick="" data-placement="left" class="tooltip-item action-accept-invitation pass-deal-action other-then-deal inactive">
        <i class="prs-icon passdeal"></i><br><span>Pass the Deal</span></a>';
	}
	else {
		$passDeal = '<a href = "#" cond-val="' . $condForPassDeal . '" data-settings = "' . $roleArrParam . '" onclick = "confirmCompleteOperation(this);" data-placement = "left" class = "tooltip-item action-accept-invitation pass-deal-action other-then-deal ' . $passDealCls . '  ">
			<i class = "prs-icon passdeal"></i><br><span>' . $label . '</span></a>';
	}

    //******************************END******************FOR CONTROL MANAGEMENT CLASS****************************************************************
    //******************************Reject Deal Start******************************
    // condition add for Super Admin Role
	if($post['login_role_id']==ROLE_SUPERADMIN){
		$rejectDeal = '<a href="#" data-placement="left" class="tooltip-item return-deal-action rejectJs other-then-deal inactive" onclick="#"><i class="prs-icon reject"></i><br><span>Return Deal</span></a>';
	}
	else {
		$rejectDeal = '<a href="#" data-placement="left" class="tooltip-item return-deal-action rejectJs other-then-deal ' . $rejectDealCls . '" onclick="confirmCompleteOperation(this,' . $deal_node_id . ',' . $deal_node_instance_id . ')"><i class="prs-icon reject"></i><br><span>' . $reject_label . '</span></a>';
	}
    //******************************Reject Deal End******************************
    //Anil Gupta Code here.
    //**********************************Start ON-Hold***********************
    /* $onHoldDealCls = 'inactive';
      $onHoldlabel = 'On Hold';
      if ($json['rolePhase'][ROLE_REVENUE_ACCOUNTANT] == PHASEII && $json['tree'][DEAL_CLASS_ID][0]['instance'][DEAL_ON_HOLD_STATUS] == 'Posting') {
      $onHoldDealCls = 'active';
      $onHoldDeal = '<a onclick = "callOnholdContentAction(this);" data-placement = "left" class = "tooltip-item" ' . $onHoldDealCls . '>
      <i class = "prs-icon passdeal"></i><br><span>' . $onHoldlabel . '</span></a>';
      } */
    //***********************************End ON-Hold***********************
}
}