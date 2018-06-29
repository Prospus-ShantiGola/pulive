<?php

/* Get Operation List Array */
$searchString = $propertyId = '';
$status = (isset($post['status']) && strlen($post['status'])) ? $post['status'] : '';
if (isset($post['status']) && isset($post['propertyId'])) {
    $propertyId = $post['propertyId'];
    if ($post['status'] == "All") {
        $status = 'all';
    }
}
if (isset($post['search_string']) && $post['search_string'] != "") {
    $searchString = $post['search_string'];
}

$menu_instance_node_id = '1614957'; //'439819';

$mapping_class_node_id 		= json_decode($post['list_mapping_id_array'], true);
$data['deal_node_instance_id'] = $post['deal_node_instance_id'];
$data['role_node_id'] = $post['deal_actor_role_node_id'];
$data['mapping_class_node_id'] = $mapping_class_node_id['classNodeid'];
$data['deal_node_id'] = $post['deal_instance_node_id'];
$data['propertyId'] = $propertyId;
$data['status'] = $status;
$data['super_admin'] = $post['sadmin'];
$login_user_id = isset($post['login_user_id']) ? $post['login_user_id'] : '';
if ($data['super_admin'] == 'true') {
    $menu_instance_node_id = SUPER_ADMIN_MENU_OPERATION_INSTANCE_ID;
}

$instanceArray = json_decode($builderApiObj->getOperationList($data), TRUE);

if ($searchString) {
    // If user search anything in operation
    $instanceArray = searchOperationList($instanceArray, $searchString);
}
@uasort($instanceArray, "cmp");

if (isset($post['indexing']) && $post['indexing'] == 'indexing') {
    $indexListData = createJsonIndexView($instanceArray, $post['fieldname'], $searchString);
    $resJsonArr = array('status'=>'1', 'message'=>'', 'data'=>$indexListData);
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
}

$html = makeHtmlForOperationList($instanceArray, $data['deal_node_id'], $data['role_node_id'], $data['deal_node_instance_id'], $propertyId, $data['super_admin'], $login_user_id);

$tempArr = explode('###', $html);

$finalHtml = $tempArr[0];

$json['record'] = $tempArr[1];

$json['menu'] = $menu_instance_node_id;

$_userNotification = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';

$json['list'] = $_userNotification . '<div class="customScroll mid-section-HT" >' . $finalHtml . '</div>';

$json['status'] = $status;

$json['dealType'] = $post['fieldname'];

$dealInfo = '<div class="dealinfo-icon"><a href="javascript:void(0);" class="j_my_createDeal_open" onclick="viewDealInfo(this,' . $data['deal_node_instance_id'] . ',' . "'view'" . ')"><i class="prs-icon list"></i><br><span class="" data-section-id="">Deal Info</span></a></div>';

$dealInfo .= '<div class="hide"><a href="javascript:void(0);" class="j_my_open_optional_operation_list j_my_left_flyout_open" onclick="viewOperationInfo()"><i class="prs-icon list"></i><br><span class="" data-section-id="">Optional Operation List</span></a><a href="javascript:void(0);" class="j_my_left_flyout_print_open"><i class="prs-icon list"></i><br><span class="" data-section-id=""></span></a></div>';

$json['heading'] = '<div id="id_opertion_head">Operation: List</div>' . $dealInfo;


$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;


