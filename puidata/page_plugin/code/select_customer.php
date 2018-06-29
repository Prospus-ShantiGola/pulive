<?php
$customerNo                            = trim($post['customerNo']);


$data                                   = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Customers&MappingInstanceId=638236&Location=MSP&CustomerNo=" . $customerNo, "");
$data                                   = explode(" ", strip_tags($data));
if ("successfully." == end($data)) {
    $customerData                       = $builderApiObj->getInstanceListOfParticulerClass(CUSTOMER_CLASS_ID, 'class', 'node_id');
    $customerData                       = json_decode($customerData, true);
    foreach ($customerData['data'] as $key => $value) {
        if (intval($value['CustomerNo']) == intval($customerNo)) {
            $customerArray              = $value;
        }
    }
}

if (count($customerArray) == 0) {
    $customerArray['CustomerNo'] = '';
}

//print json_encode($customerArray);
//exit;

$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $customerArray;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;

?>