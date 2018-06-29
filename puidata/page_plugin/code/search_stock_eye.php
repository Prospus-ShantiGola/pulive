<?php

$stockNo = trim($post['stockNo']);
$deal_type = trim($post['deal_type']);
$location = trim($post['location']);
$folderPath = 'puidata/page_plugin/api_files/';
$customerSubClassArr = array(
    '842' => 'DISALLOWEDPAYFORMS'
);
$unitsSubClassArr = array(
    '775' => 'MOTOR',
    '843' => 'OPTIONS',
    '844' => 'SPECS',
    '845' => 'INCLUSIONS',
    '846' => 'MFGREBATE'
);
$financeSubClassArr = array(
    '791' => 'TaxBMT',
    '792' => 'DownPayments',
    '793' => 'Trades',
    '794' => 'DealerOption',
    '795' => 'MfgOption',
    '796' => 'Parts',
    '797' => 'Extras',
    '798' => 'SalesReps',
    '799' => 'Inclusion',
    '800' => 'Taxes',
    '803' => 'Insurance',
    '804' => 'Commissions',
    '805' => 'AddOnCost'
);


if ($deal_type == 'STOCK') {
    $filePath = $folderPath . 'boat_' . $stockNo . "_" . $location . '.txt';
    // Check File is exits in bucket
    $fileExist = $sdkApi->isObjectExist($filePath);
    $stockArray = array();
    if ($fileExist) {
        $dealData = json_decode($sdkApi->getFileData($filePath), true);
        $dealData = $dealData['Record'];
        foreach ($dealData as $key => $_value) {
            if ($_value != '' && !is_array($_value)) {
                $stockArray[$key] = $_value;
            } else if (is_array($_value)) {
                $stockArray[$key] = manipulateArray($_value);
            }
            // Manipulation for sub Array Conditionally
            if ($key == 'Extension') {
                $stockArray[$key][0] = $stockArray[$key];
            }
        }
    } else {
        // For Old Deals, get data from DB
        $inode_id = '';
        $stockData = $builderApiObj->getInstanceListOfParticulerClass(UNIT_CLASS_ID, 'class', 'node_id');
        $stockData = json_decode($stockData, true);
        foreach ($stockData['data'] as $key => $value) {
            if ($value['StockNo'] === $stockNo) {
                $stockArray = $value;
                $inode_id = $key;
            }
        }
        if ($inode_id != '') {
            foreach ($unitsSubClassArr as $salkey => $salvalue) {
                $tdata = array('id' => $inode_id, 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id', 'node_class_id' => $salkey);
                $toptions = http_build_query($tdata);
                $delData = $builderApiObj->callWebApi('getNodeXOfParticulerClass', $toptions);
                $delData = json_decode($delData, true);
                $uniqueArray = array();
                foreach ($delData as $k => $v) {
                    $uniqueArray[] = $v['node_x_id'];
                }

                $moterData = $builderApiObj->getInstanceListOfParticulerClass($salkey, 'class', 'node_id');
                $moterData = json_decode($moterData, true);

                foreach ($moterData['data'] as $key => $value) {
                    if (in_array($key, $uniqueArray)) {
                        $stockArray[$salvalue][] = $value;
                    }
                }
            }
        }
    }


    $json['list'] = '<div class="customScroll ref-winHT"><ul  class="deal-user-listing">' . getHtmlStockLayout($stockArray) . '</ul></div>';
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
} else if ($deal_type == 'FI') {
    $filePath = $folderPath . 'finance_' . $stockNo . "_" . $location . '.txt';
    // Check File is exits in bucket
    $fileExist = $sdkApi->isObjectExist($filePath);
    $fiArray = array();
    if ($fileExist) {
        $dealData = json_decode($sdkApi->getFileData($filePath), true);
        $dealData = $dealData['Record'];
        foreach ($dealData as $key => $_value) {
            if ($_value != '' && !is_array($_value)) {
                $fiArray[$key] = $_value;
            } else if (is_array($_value)) {
                $fiArray[$key] = manipulateArray($_value);
            }
        }
    } else {
        // For Old Deals, get data from DB
        $inode_id = '';
        $fiData = $builderApiObj->getInstanceListOfParticulerClass(FINANCE_DEALS_CLASS_ID, 'class', 'node_id');
        $fiData = json_decode($fiData, true);
        foreach ($fiData['data'] as $key => $value) {
            if (intval($value['QuoteNo']) == intval($stockNo)) {
                $fiArray = $value;
                $inode_id = $key;
            }
        }
        if ($inode_id != '') {
            foreach ($financeSubClassArr as $salkey => $salvalue) {
                $tdata = array('id' => $inode_id, 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id', 'node_class_id' => $salkey);
                $toptions = http_build_query($tdata);
                $delData = $builderApiObj->callWebApi('getNodeXOfParticulerClass', $toptions);
                $delData = json_decode($delData, true);
                $uniqueArray = array();
                foreach ($delData as $k => $v) {
                    $uniqueArray[] = $v['node_x_id'];
                }

                $moterData = $builderApiObj->getInstanceListOfParticulerClass($salkey, 'class', 'node_id');
                $moterData = json_decode($moterData, true);

                foreach ($moterData['data'] as $key => $value) {
                    if (in_array($key, $uniqueArray)) {
                        $fiArray[$salvalue][] = $value;
                    }
                }
            }
        }
    }
    $json['list'] = '<div class="customScroll ref-winHT"><ul  class="deal-user-listing">' . getHtmlStockLayout($fiArray) . '</ul></div>';
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
} else if ($deal_type == 'CUSTOMER') {

    $filePath = $folderPath . 'customer_' . $stockNo . "_" . $location . '.txt';
    // Check File is exits in bucket
    $fileExist = $sdkApi->isObjectExist($filePath);
    $customerArray = array();
    if ($fileExist) {
        $dealData = json_decode($sdkApi->getFileData($filePath), true);
        $dealData = $dealData['Record'];
        foreach ($dealData as $key => $_value) {
            if ($_value != '' && !is_array($_value)) {
                $customerArray[$key] = $_value;
            } else if (is_array($_value)) {
                $customerArray[$key] = manipulateArray($_value);
            }
            // Manipulation for sub Array Conditionally
            if ($key == 'Addresses' || $key == 'SalesReps') {
                $customerArray[$key][0] = $customerArray[$key];
            }
        }
    } else {
        // For Old Deals, get data from DB
        $inode_id = '';
        if (count($customerArray) == 0 && empty($customerArray)) {
            $data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Customers&MappingInstanceId=638236&Location=MSP&CustomerNo=" . $stockNo, "");
            $data = explode(" ", strip_tags($data));
            if ("successfully." == end($data)) {
                $customerData = $builderApiObj->getInstanceListOfParticulerClass(CUSTOMER_CLASS_ID, 'class', 'node_id');
                $customerData = json_decode($customerData, true);
                foreach ($customerData['data'] as $key => $value) {
                    if (intval($value['CustomerNo']) == intval($stockNo)) {
                        $customerArray = $value;
                        $inode_id = $key;
                    }
                }
            }
        }

        if ($inode_id != '') {
            foreach ($customerSubClassArr as $salkey => $salvalue) {
                $tdata = array('id' => $inode_id, 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id', 'node_class_id' => $salkey);
                $toptions = http_build_query($tdata);
                $delData = $builderApiObj->callWebApi('getNodeXOfParticulerClass', $toptions);
                $delData = json_decode($delData, true);
                $uniqueArray = array();
                foreach ($delData as $k => $v) {
                    $uniqueArray[] = $v['node_x_id'];
                }

                $moterData = $builderApiObj->getInstanceListOfParticulerClass($salkey, 'class', 'node_id');
                $moterData = json_decode($moterData, true);

                foreach ($moterData['data'] as $key => $value) {
                    if (in_array($key, $uniqueArray)) {
                        $customerArray[$salvalue][] = $value;
                    }
                }
            }
        }
    }

    $json['list'] = '<div class="customScroll ref-winHT"><ul  class="deal-user-listing">' . getHtmlStockLayout($customerArray) . '</ul></div>';
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
} else if ($deal_type == 'COBUYER') {
    $coBuyerArray = array();
    $filePath = $folderPath . 'customer_' . $stockNo . "_" . $location . '.txt';
    // Check File is exits in bucket
    $fileExist = $sdkApi->isObjectExist($filePath);
    $customerArray = array();
    if ($fileExist) {
        $dealData = json_decode($sdkApi->getFileData($filePath), true);
        $dealData = $dealData['Record'];
        foreach ($dealData as $key => $_value) {
            if ($_value != '' && !is_array($_value)) {
                $coBuyerArray[$key] = $_value;
            } else if (is_array($_value)) {
                $coBuyerArray[$key] = manipulateArray($_value);
            }
        }
    } else {
        // For Old Deals, get data from DB
        $inode_id = '';
        $cobuyer_data = $builderApiObj->getInstanceListOfParticulerClass(CO_BUYER_CLASS_ID, 'class', 'node_id');
        $cobuyer_data = json_decode($cobuyer_data, true);
        foreach ($cobuyer_data['data'] as $key => $value) {
            if (intval($value['CoBuyerID']) == intval($stockNo)) {
                $coBuyerArray = $value;
            }
        }
    }
    $json['list'] = '<div class="customScroll ref-winHT"><ul  class="deal-user-listing">' . getHtmlStockLayout($coBuyerArray) . '</ul></div>';
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
}

/**
 * Function to return Manipulated Array for Blank Values
 * @param type $_array
 * @return type
 */
function manipulateArray($_array) {
    $fiArray = array();
    foreach ($_array as $key => $_value) {
        if ($_value != '' && !is_array($_value)) {
            $fiArray[$key] = $_value;
        } elseif (is_array($_value) && count($_value)) {
            $fiArray[$key] = manipulateArray($_value);
        }
    }
    return $fiArray;
}

?>