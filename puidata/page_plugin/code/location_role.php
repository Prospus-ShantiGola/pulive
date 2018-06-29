<?php
    $location       =   $post['location'];
    $json           =   array();
    $rolesData      =   $builderApiObj->locationRoleForStore($post);
    $rolesArray     =   json_decode($rolesData, true);
    $json           =   $rolesArray;
    
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
        
//    print json_encode($json);
//    exit;
?>