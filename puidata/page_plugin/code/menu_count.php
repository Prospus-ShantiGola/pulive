<?php
    $data['node_class_property_id']                     = $post['node_class_property_id'];
    $data['login_user_id']                              = $post['login_user_id'];
    $data['list_mapping_id_array']                      = json_decode($post['list_mapping_id_array'], true);
    $data['class_node_id']                              = json_decode($post['class_node_id']);
    $data['roleId']                                     = json_decode($post['roleId']);
    $data['is_operation_list']                          = $post['is_operation_list'];
    $data['deal_node_instance_id']                      = $post['deal_node_instance_id'];
    $data['data-node-id']                               = isset($post['data-node-id']) ? $post['data-node-id'] : '';
    $data['admin_role_id']                              = ADMIN;

    if (isset($data['is_operation_list']) && $data['is_operation_list'] == 'true') {
        $menuData                                       = $builderApiObj->getOperationMenuCount($data);
    } else {
        $menuData                                       = $builderApiObj->getMenuCount($data);
    }
    //print_r(json_decode($menuData,true));die;
    /*$resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $menuData;*/
    header('Content-Type: application/json');
    print json_encode($menuData);
    exit;
?>