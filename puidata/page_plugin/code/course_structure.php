<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$_data['classId'] = 874;
$_data['instanceNId'] = 1871212;
//$ms = microtime(TRUE);
getClassStructure($_data);

//echo microtime(TRUE)- $ms;
function getClassStructure($_data = array()) {
    global $builderApiObj;
    if (empty($_data['classId']) || !isset($_data['classId'])) {
        return 'Class Id has been empty!';
    }
    //Get Data from PU
    echo '<pre>';
    $_classData = $builderApiObj->getCourseClassData($_data);
    $_classData = json_decode($_classData, TRUE);
    //echo '<pre>';
    print_r($_classData);
    exit;
}
