<?php

$stockNo = trim($post['stockNo']);

$fiQuoteNo = $post['fiQuoteNo'];
$display_type = $post['display_type'];

$id_detail_instance_id = $post['id_detail_instance_id'];

if (isset($id_detail_instance_id)) {
    $_dealStatus = json_decode($builderApiObj->getTableCols(array('status'), 'node-instance', array('node_instance_id'), array($post['id_detail_instance_id'])), TRUE)['status'];
    if ($_dealStatus == 0) {
        $display_type = 'add';
    }
}


$data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Units&MappingInstanceId=642878&Location=MSP&&StockNo=" . $stockNo, "");
$data = explode(" ", strip_tags($data));
if ("successfully." == end($data)) {
    $stockData = $builderApiObj->getInstanceListOfParticulerClass(UNIT_CLASS_ID, 'class', 'node_id');
    $stockData = json_decode($stockData, true);
    foreach ($stockData['data'] as $key => $value) {
        if ($value['StockNo'] === $stockNo) {
            $stockArray = $value;
        }
    }
}

if (count($stockArray) == 0 && $post['type'] == 'json') {
    $stockArray['StockNo'] = '';
}

if ($post['type'] == 'json') {



    if (isset($fiQuoteNo) && !empty($fiQuoteNo) && $fiQuoteNo != '') {
        $fiData = $builderApiObj->getInstanceListOfParticulerClass(FINANCE_DEALS_CLASS_ID, 'class', 'node_id');
        $fiData = json_decode($fiData, true);
        $node_y_id = '';
        $fiArray = array();
        foreach ($fiData['data'] as $key => $value) {
            if (intval($value['QuoteNo']) == intval($fiQuoteNo)) {
                $fiArray = $value;
            }
        }
        $_IsQuoteOrDeal = $fiArray['IsQuoteOrDeal'];
        $_StatusCode = $stockArray['StatusCode'];
        $_FIStatusDesc = 'None';
        if ($_IsQuoteOrDeal == 'D' && $_StatusCode == 'FS' && $display_type == 'edit') {
            $_FIStatusDesc = 'Final Sale';
        } else if ($_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO') && $display_type == 'edit') {
            $_FIStatusDesc = 'Capped';
        } else {
            if ($_IsQuoteOrDeal == 'Q' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $display_type == 'add') {
                $_FIStatusDesc = 'Sales';
            } else if ($_IsQuoteOrDeal == 'Q' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $display_type == 'edit') {
                $_FIStatusDesc = 'Cancelled';
            }
        }
        $stockArray['IsQuoteOrDeal'] = $_IsQuoteOrDeal;
        $stockArray['FIStatusDesc'] = $_FIStatusDesc;
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $stockArray;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($stockArray);
//    exit;
} else {
    $json['list'] = '<div class="customScroll ref-winHT"><ul  class="deal-user-listing">' . getHtmlStockLayout($stockArray) . '</ul></div>';

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($json);
//    exit;
}
?>