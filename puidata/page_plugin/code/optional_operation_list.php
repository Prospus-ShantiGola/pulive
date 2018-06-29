<?php

if (1) { 
    //Optimize Code
    $deal_node_instance_id = $post['deal_node_instance_id'];
    $deal_instance_node_id = $post['deal_instance_node_id'];
    $deal_actor_role_node_id = $post['deal_actor_role_node_id'];
    $login_user_id = $post['login_user_id'];
    $mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);

    $dealData = $builderApiObj->getInstanceListOfParticulerClass($deal_node_instance_id, 'instance', 'node_instance_id');
    $dealData = json_decode($dealData, true);
    $boatLength = explode("'", current($dealData['data'])['Length']);

    $operation_list_param_array = array(
        'role_node_id' => $deal_actor_role_node_id,
        'deal_node_id' => $deal_instance_node_id,
        'optional_operation' => 'yes',);
    $instanceData = $builderApiObj->getOperationList($operation_list_param_array);
    $instanceArray = json_decode($instanceData, true);

    if ($boatLength[0] >= 35) {
        unset($instanceArray[VANTAGE2K_OPERATION_NID]);
    } elseif ($boatLength[0] < 35) {
        unset($instanceArray[VANTAGE4K_OPERATION_NID]);
    }


    /* This Code Arrenge The Operation By Sequence */
    @uasort($instanceArray, "cmp");
    /* Get Operation List Html */
    $deal_node_id = $deal_instance_node_id;
    $deal_actor_role_node_id = $deal_actor_role_node_id;


    $html = getOptionalOperationHtmlList($instanceArray, $deal_node_id, $deal_actor_role_node_id, $deal_node_instance_id, $login_user_id);
    $tempArr = explode('#~##~#', $html);

    $finalHtml = $tempArr[0];
    $selectButton = $tempArr[1];

    if (count($instanceArray) > 0) {
        $saveBtn = ' <a href="#" onclick="setOptionalOperationWithRequired()" data-placement="left" class="tooltip-item action-accept-invitation">
                                            <i class="prs-icon save"></i>
                                            <br>
                                            <span>Save</span>
                                            </a>';
    }


    $_userNotification = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
    $json['list'] = $_userNotification . '<div class="customScroll mid-section-HT" >' . $finalHtml . '</div>';
    $json['heading'] = '<div id="id_opertion_head">Optional Operation: List</div>';
    $json['actions'] = '<a href="#" class=""><i class=""></i><br><span></span></a>' . $selectButton . $saveBtn . '
                                            <a href="#" class="tooltip-item j_my_createDeal_close">
                                            <i class="prs-icon icon_close"></i>
                                            <br>
                                            <span>Close</span>
                                        </a>';
    
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
//    print json_encode($json);
//    exit;
} else {
    //old code
    /*We will remove it later, When QA is done*/
    $deal_node_instance_id = $post['deal_node_instance_id'];
    $deal_instance_node_id = $post['deal_instance_node_id'];
    $deal_actor_role_node_id = $post['deal_actor_role_node_id'];
    $login_user_id = $post['login_user_id'];
    $mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);

    $dealData = $builderApiObj->getInstanceListOfParticulerClass($deal_node_instance_id, 'instance', 'node_instance_id');
    $dealData = json_decode($dealData, true);
    $boatLength = explode("'", current($dealData['data'])['Length']);
    $instanceData = $builderApiObj->getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, 'all', 'none', 'Optional', '', '', $boatLength[0]);
    $instanceArray = json_decode($instanceData, true);
    $temOptArr = array();
    foreach ($instanceArray['data'][0] as $key => $val) {

        if ($val['Operation Type'] == 'Optional') {
            $temOptArr[$key] = $val;
        }
    }
    $instanceArray['data'][0] = $temOptArr;

    /* This Code Arrenge The Operation By Sequence */
    @uasort($instanceArray['data'][0], "cmp");
    /* Get Operation List Html */
    $deal_node_id = $instanceArray['data'][1]['deal_node_id'];
    $deal_actor_role_node_id = $instanceArray['data'][1]['deal_actor_role_node_id']; // $instanceArray['data'][0]


    $html = getOptionalOperationHtmlList($instanceArray['data'][0], $deal_node_id, $deal_actor_role_node_id, $deal_node_instance_id, $login_user_id);
    $tempArr = explode('#~##~#', $html);

    $finalHtml = $tempArr[0];
    $selectButton = $tempArr[1];

    if (count($instanceArray['data'][0]) > 0) {
        $saveBtn = ' <a href="#" onclick="setOptionalOperationWithRequired()" data-placement="left" class="tooltip-item action-accept-invitation">
                                            <i class="prs-icon save"></i>
                                            <br>
                                            <span>Save</span>
                                            </a>';
    }


    $_userNotification = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
    $json['list'] = $_userNotification . '<div class="customScroll mid-section-HT" >' . $finalHtml . '</div>';
    $json['heading'] = '<div id="id_opertion_head">Optional Operation: List</div>';
    $json['actions'] = '<a href="#" class=""><i class=""></i><br><span></span></a>' . $selectButton . $saveBtn . '
                                            <a href="#" class="tooltip-item j_my_createDeal_close">
                                            <i class="prs-icon icon_close"></i>
                                            <br>
                                            <span>Close</span>
                                        </a>';
//    print json_encode($json);
//    exit;
         $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    /*END HERE*/
}