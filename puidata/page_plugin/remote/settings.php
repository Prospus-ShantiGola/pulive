<?php

/* Deal Section */
$userLink = array(
    'emailFrom' => 'info@marinemax.com',
    'privacyPolicy' => 'https://www.marinemax.com/privacy-policy.aspx',
    'socailLink' => array(
        'fb' => 'https://www.facebook.com/MarineMaxLeisure',
        'twitter' => 'https://twitter.com/marinemax',
        'instagram' => 'https://www.instagram.com/marinemaxonline',
        'youtube' => 'https://www.youtube.com/user/MarineMaxOnline',
        'logourl' => 'https://www.marinemax.com/',
        'logourl' => 'https://www.marinemax.com/',
        'privacyPolicy' => 'https://www.marinemax.com/privacy-policy.aspx',
    )
);
$dealMenuArray = array('menuLayoutInstanceId' => '434068', 'menuListInstanceId' => '398419');
$dealListArray = array('listLayoutInstanceId' => '434684',
    'layoutHeading' => 'Deals: List',
    'NID' => array('isShown' => "false", "size" => "col-sm-2", "title" => "NID"),
    'listHeadArray' => array('class_node_id' => '396138', 'columns' => array('GENERAL > Deal ID', 'GENERAL > Deal Description', 'GENERAL > Deal Start Date', 'GENERAL > Deal End Date', 'VESSEL > Vessel Name')),
    'listingPattern' => array('type' => 'roleWise'), // possible values for type = normal/roleWsie/
    'mappingClass' => array('classNodeid' => '416207'),
    'PaginationRecord' => array('25', '30', '35', '40'),
    'BrokrageNodeId' => '401537',
    'cssNodeId' => '450312',
    'setting' => array(array('type' => 'filter', 'size' => 'col-sm-2'), array('type' => 'filter', 'size' => 'col-sm-3'), array('type' => 'filter', 'size' => 'col-sm-3'), array('type' => 'filter', 'size' => 'col-sm-2'), array('type' => 'filter', 'size' => 'col-sm-2')));
$dealViewArray = array('detailLayoutInstanceId' => '434721', 'contentDetails' => array('instanceId' => '567533', 'displayType' => 'add', 'heading' => 'Deals'));
//589803 
$dealArray = array('menu' => $dealMenuArray, 'list' => $dealListArray, 'detail' => $dealViewArray,'userLink' => $userLink);

$filesMenuArray = array('menuLayoutInstanceId' => '434068', 'menuListInstanceId' => '398419');
$filesListArray = array('listLayoutInstanceId' => '434684',
    'layoutHeading' => 'Remote Files: List',
    'NID' => array('isShown' => "false", "size" => "col-sm-2", "title" => "NID"),
    'listHeadArray' => array('class_node_id' => '475509', 'columns' => array('For', 'File')),
    'listingPattern' => array('type' => 'roleWise'), // possible values for type = normal/roleWsie/
    'mappingClass' => array('classNodeid' => ''),
    'PaginationRecord' => array('5', '6', '7', '8'),
    'BrokrageNodeId' => '401537',
    'cssNodeId' => '450312',
    'setting' => array(array('type' => 'filter', 'size' => 'col-sm-6'), array('type' => 'filter', 'size' => 'col-sm-6')));
$filesViewArray = array('detailLayoutInstanceId' => '434721', 'contentDetails' => array('instanceId' => '475544', 'displayType' => 'add', 'heading' => 'Remote Files'));

$filesArray = array('menu' => $filesMenuArray, 'list' => $filesListArray, 'detail' => $filesViewArray);

/* Operation Section */
$operationMenuArray = array('menuLayoutInstanceId' => '434068', 'menuListInstanceId' => '438346');
$operationListArray = array('listLayoutInstanceId' => '434684',
    'layoutHeading' => 'Operations: List',
    'NID' => array('isShown' => "false", "size" => "col-sm-2", "title" => "NID"),
    'listHeadArray' => array('class_node_id' => '406842', 'columns' => array('GENERAL > Name', 'GENERAL > Description')),
    'listingPattern' => array('type' => 'normal'), // possible values for type = normal/roleWsie/
    'mappingClass' => array('classNodeid' => '416207'),
    'PaginationRecord' => array('25', '30', '35', '40'),
    'BrokrageNodeId' => '401537',
    'cssNodeId' => '450312',
    'setting' => array(array('type' => 'filter', 'size' => 'col-sm-5'),
        array('type' => 'filter', 'size' => 'col-sm-7')));
$operationViewArray = array('detailLayoutInstanceId' => '434721', 'contentDetails' => array('instanceId' => '438335', 'displayType' => 'add', 'heading' => 'Operations'));
$operationArray = array('menu' => $operationMenuArray, 'list' => $operationListArray, 'detail' => $operationViewArray);

/* Roles Section */
$rolesMenuArray = array('menuLayoutInstanceId' => '434068', 'menuListInstanceId' => '438843');
$rolesListArray = array('listLayoutInstanceId' => '434684',
    'layoutHeading' => 'Roles: List',
    'NID' => array('isShown' => "true", "size" => "col-sm-2", "title" => "NID"),
    'listHeadArray' => array('class_node_id' => '416174', 'columns' => array('Title', 'Active', 'Role Type')),
    'listingPattern' => array('type' => 'normal'), // possible values for type = normal/roleWsie/
    'mappingClass' => array('classNodeid' => '416207'),
    'PaginationRecord' => array('25', '30', '35', '40'),
    'BrokrageNodeId' => '401537',
    'cssNodeId' => '450312',
    'setting' => array(array('type' => 'filter', 'size' => 'col-sm-4'),
        array('type' => 'filter', 'size' => 'col-sm-3'),
        array('type' => 'filter', 'size' => 'col-sm-3')));
$rolesViewArray = array('detailLayoutInstanceId' => '434721', 'contentDetails' => array('instanceId' => '438726', 'displayType' => 'add', 'heading' => 'Roles'));
$roleArray = array('menu' => $rolesMenuArray, 'list' => $rolesListArray, 'detail' => $rolesViewArray);

/* ----------------------------------------------------------------------------------------------------------------- */
$data = array('deal' => array('class' => 'active', 'label' => 'Deals', 'settings' => $dealArray),
    'files' => array('class' => '', 'label' => 'Files', 'settings' => $filesArray),
    'operation' => array('class' => '', 'label' => 'Operations', 'settings' => $operationArray),
    'role' => array('class' => '', 'label' => 'Roles', 'settings' => $roleArray));

$fp = fopen('settings1.json', 'w');
fwrite($fp, json_encode($data));
fclose($fp);
?>