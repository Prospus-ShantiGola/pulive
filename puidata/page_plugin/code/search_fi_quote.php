<?php

$_roleId = $post['login_role_id'];

if (isset($post['locationCode']) && trim($post['locationCode']) != '') {
    $location = $post['locationCode'];
}

if (isset($post['fiQuoteNo']) && trim($post['fiQuoteNo']) != '') {
    $fiQuoteNo = trim($post['fiQuoteNo']);
} else {
    $fiQuoteNo = '';
}

if (isset($post['stockNo']) && trim($post['stockNo']) != '') {
    $_IsQuoteOrDeal = trim($post['IsQuoteOrDeal']);
    $stockNo = trim($post['stockNo']);
} else {
    $stockNo = '';
}

if (isset($post['customerNo']) && trim($post['customerNo']) != '') {
    $customerNo = trim($post['customerNo']);
    $_UseEntity = trim($post['UseEntity']);
} else {
    $customerNo = '';
}

if (isset($post['coBuyerNo']) && trim($post['coBuyerNo']) != '') {
    $coBuyerNo = trim($post['coBuyerNo']);
} else {
    $coBuyerNo = '';
}

$json = array();
$api_file_data = array();
$folderPath = 'puidata/page_plugin/api_files/';

$error429 = ' error occured! <br>Please try again after timeSpanFromIDS second(s).';
$error400 = ' error occured! <br>There is an issue with data in IDS. Please verify data in IDS and try again.';

if ($fiQuoteNo != '') {
    $fiArray = array();
    $newQuoteNo = '';
    $myXMLData = $builderApiObj->callCurl(MARINEMAX_API_URL . "FINANCE_DEALS?X-Connection=ASTRAG2&Location=" . $location . "&QuoteNo=" . $fiQuoteNo);
    $myXMLData = explode("<?xml", $myXMLData);
    $myXMLData[1] = "<?xml" . $myXMLData[1];

    $xml = simplexml_load_string($myXMLData[1]);
    $api_data = json_encode($xml);
    $api_data_array = json_decode($api_data, true);

    if (intval($api_data_array['http_code']) == 429) {
        $returnCode = 429;
        $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
        $error429 = str_replace("timeSpanFromIDS", $time, $error429);
        $errorMsg = $returnCode . $error429;
    } else if (intval($api_data_array['http_code']) == 400) {
        $returnCode = 400;
        $errorMsg = $returnCode . $error400;
    } else {
        $returnCode = 200;
        $errorMsg = '';
        $compare_type = 0;
        $filePath = $folderPath . 'fi_file_' . $location . '_' . $fiQuoteNo . '.txt';
        $fileExist = $sdkApi->isObjectExist($filePath);
        if ($fileExist) {
            $api_file_data = $sdkApi->getFileData($filePath);
            if ($api_file_data == md5($api_data)) {
                $compare_type = 0;
                $api_file_data[$fiQuoteNo] = $api_data_array;
            } else {
                $compare_type = 1;
                $api_file_data[$fiQuoteNo] = $api_data_array;
            }
        } else {
            $compare_type = 1;
            $api_file_data[$fiQuoteNo] = $api_data_array;
        }

        if ($compare_type) {
            $sdkApi->setFileData($filePath, md5($api_data), "");
            $data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=FINANCE_DEALS&MappingInstanceId=799784&Location=" . $location . "&QuoteNo=" . $fiQuoteNo, "");
            $data = explode(" ", strip_tags($data));
        } else {
            $data = "<span style='color:green;' >FINANCE_DEALS generated successfully.</span>";
            $data = explode(" ", strip_tags($data));
        }

        if ("successfully." == end($data)) {
            $fiData = $builderApiObj->getInstanceListOfParticulerClass(FINANCE_DEALS_CLASS_ID, 'class', 'node_id');
            $fiData = json_decode($fiData, true);

            $node_y_id = '';
            foreach ($fiData['data'] as $key => $value) {
                if (intval($value['QuoteNo']) == intval($fiQuoteNo)) {
                    if (trim($value['QuoteNo']) != '')
                        $newQuoteNo = intval($value['QuoteNo']);
                    if (trim($value['CustID']) != '')
                        $customerNo = intval($value['CustID']);
                    if (trim($value['StockNo']) != '')
                        $stockNo = intval($value['StockNo']);
                    if (trim($value['CoBuyerID']) != '')
                        $coBuyerNo = intval($value['CoBuyerID']);
                    $fiArray = $value;
                    $node_y_id = $key;
                }
            }
            $trade = $builderApiObj->getNodeXOfParticulerClass($node_y_id, 'node_y_id', 'node_x_id', '793');
            $trade = json_decode($trade, true);
            if (is_array($trade) && intval(current($trade)['node_x_id']) > 0) {
                $tradeRes = $builderApiObj->getInstanceListOfParticulerClass(current($trade)['node_x_id'], 'node', 'node_id');
                $tradeRes = json_decode($tradeRes, true);
                $tempRes = current($tradeRes['data']);
                if (!isset($tempRes['TradeStockNo'])) {
                    $tempRes['TradeStockNo'] = '';
                }
                $json['Trades'] = $tempRes;
            }

            if (isset($json['Trades']) && count($json['Trades']) == 0) {
                $json['Trades'] = '';
            }
        }
    }

    if ($returnCode == 429 || $returnCode == 400) {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
    } else {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
        $json['QuoteNo'] = $newQuoteNo;
        $json['CustID'] = $customerNo;
        $json['StockNo'] = $stockNo;
        $json['coBuyerNo'] = $coBuyerNo;
        $fiArray['res'] = 'No res';
        $json['fiQuote'] = $fiArray;
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($json);
//    exit;
} elseif ($stockNo != '') {
    /* For Stock Info */
    $stockArray = array();
    if (trim($stockNo) != '') {
        $myXMLData = $builderApiObj->callCurl(MARINEMAX_API_URL . "UNITS?X-Connection=ASTRAG2&Location=" . $location . "&StockNo=" . $stockNo);
        $myXMLData = explode("<?xml", $myXMLData);
        $myXMLData[1] = "<?xml" . $myXMLData[1];

        $xml = simplexml_load_string($myXMLData[1]);
        $api_data = json_encode($xml);
        $api_data_array = json_decode($api_data, true);

        if (intval($api_data_array['http_code']) == 429) {
            $returnCode = 429;
            $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
            $error429 = str_replace("timeSpanFromIDS", $time, $error429);
            $errorMsg = $returnCode . $error429;
        } else if (intval($api_data_array['http_code']) == 400) {
            $returnCode = 400;
            $errorMsg = $returnCode . $error400;
        } else {
            $returnCode = 200;
            $errorMsg = '';
            $compare_type = 0;
            $filePath = $folderPath . 'stock_file_' . $location . '_' . $stockNo . '.txt';
            $fileExist = $sdkApi->isObjectExist($filePath);
            if ($fileExist) {
                $api_file_data = $sdkApi->getFileData($filePath);
                if ($api_file_data == md5($api_data)) {
                    $compare_type = 0;
                    $api_file_data[$stockNo] = $api_data_array;
                } else {
                    $compare_type = 1;
                    $api_file_data[$stockNo] = $api_data_array;
                }
            } else {
                $compare_type = 1;
                $api_file_data[$stockNo] = $api_data_array;
            }

            if ($compare_type) {
                $sdkApi->setFileData($filePath, md5($api_data), "");
                $data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Units&MappingInstanceId=642878&Location=" . $location . "&StockNo=" . $stockNo, "");
                $data = explode(" ", strip_tags($data));
            } else {
                $data = "<span style='color:green;' >Units generated successfully.</span>";
                $data = explode(" ", strip_tags($data));
            }
        }

        if ("successfully." == end($data)) {
            $stockData = $builderApiObj->getInstanceListOfParticulerClass(UNIT_CLASS_ID, 'class', 'node_id');
            $stockData = json_decode($stockData, true);
            foreach ($stockData['data'] as $key => $value) {
                if ($value['StockNo'] == intval($stockNo)) {
                    $stockArray = $value;
                }
            }
        }

        if (count($stockArray) == 0 && $post['type'] == 'json') {
            $stockArray['StockNo'] = '';
        }
    }

    //While Deal Is "ADD" then status will update: 27-12-2016

    $_StatusCode = $stockArray['StatusCode'];
    $display_type = trim($post['display_type']);
    $id_detail_instance_id = $post['id_detail_instance_id'];
    $_dealExists = '';
    if (isset($id_detail_instance_id) && !empty($id_detail_instance_id)) {
        $_dealExists = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id'), array($post['id_detail_instance_id'], DEAL_EXISTS_PID)), TRUE)['value'];
    }
    if ($_dealExists == '' || $_dealExists == 'N') {
        if ($_IsQuoteOrDeal == 'D') {
            $_dealExists = 'Y';
        } else {
            $_dealExists = 'N';
        }
    }

    $stockArray['status'] = 'None';

    if ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO') && $_roleId == ROLE_BM) { //correct
        $stockArray['status'] = 'Capped';
    } elseif ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && $_StatusCode == 'FS' && ($_roleId == ROLE_BM || $_roleId == ROLE_REVENUE_MANAGER || $_roleId == ROLE_CONTROLLER || $_roleId == ROLE_DIRECTOR)) {
        $stockArray['status'] = 'Final Sale';
    } else if ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_REVENUE_ACCOUNTANT) {
        $stockArray['status'] = 'Posting';
    } elseif (/* $_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && $_StatusCode == 'FS' && */ strtolower($_roleId) == 'archive') {// as per discussion with animesh , shanti and arvind, we have comment thsi line(03-01-2017)
        $stockArray['status'] = 'Archive';
    } else if ($_dealExists == 'N' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_BM) {
        $stockArray['status'] = 'Sales';
    } else if ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'Q' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_BM) {
        $stockArray['status'] = 'Cancelled'; //correct  
    }

    $stockArray['StatsLogic'] = $_IsQuoteOrDeal . ' ' . $_dealExists . ' ' . $_StatusCode . ' ' . $_roleId;
    $stockArray['AllRoles'] = ROLE_BM . ' ' . ROLE_REVENUE_MANAGER . ' ' . ROLE_REVENUE_ACCOUNTANT . ' ' . ROLE_CONTROLLER . ' ' . ROLE_DIRECTOR;
    $stockArray['Deal_Exists'] = $_dealExists;
    if ($returnCode == 429 || $returnCode == 400) {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
    } else {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
        $json['boat'] = $stockArray;
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($json);
//    exit;
} elseif ($customerNo != '') {
    /* For Customer Info */
    $customerArray = array();
    if (trim($customerNo) != '') {
        $myXMLData = $builderApiObj->callCurl(MARINEMAX_API_URL . "CUSTOMERS?X-Connection=ASTRAG2&Location=" . $location . "&CustomerNo=" . $customerNo);
        $myXMLData = explode("<?xml", $myXMLData);
        $myXMLData[1] = "<?xml" . $myXMLData[1];

        $xml = simplexml_load_string($myXMLData[1]);
        $api_data = json_encode($xml);
        $api_data_array = json_decode($api_data, true);

        if (intval($api_data_array['http_code']) == 429) {
            $returnCode = 429;
            $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
            $error429 = str_replace("timeSpanFromIDS", $time, $error429);
            $errorMsg = $returnCode . $error429;
        } else if (intval($api_data_array['http_code']) == 400) {
            $returnCode = 400;
            $errorMsg = $returnCode . $error400;
        } else {
            $returnCode = 200;
            $errorMsg = '';
            $compare_type = 0;
            $filePath = $folderPath . 'customer_file_' . $location . '_' . $customerNo . '.txt';
            $fileExist = $sdkApi->isObjectExist($filePath);
            if ($fileExist) {
                $api_file_data = $sdkApi->getFileData($filePath);
                if ($api_file_data == md5($api_data)) {
                    $compare_type = 0;
                    $api_file_data[$customerNo] = $api_data_array;
                } else {
                    $compare_type = 1;
                    $api_file_data[$customerNo] = $api_data_array;
                }
            } else {
                $compare_type = 1;
                $api_file_data[$customerNo] = $api_data_array;
            }

            if ($compare_type) {
                $sdkApi->setFileData($filePath, md5($api_data), "");
                $customer_data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Customers&MappingInstanceId=638236&Location=" . $location . "&CustomerNo=" . $customerNo, "");
                $customer_data = explode(" ", strip_tags($customer_data));
            } else {
                $customer_data = "<span style='color:green;' >Customers generated successfully.</span>";
                $customer_data = explode(" ", strip_tags($customer_data));
            }
        }

        if ("successfully." == end($customer_data)) {
            $customerData = $builderApiObj->getInstanceListOfParticulerClass(CUSTOMER_CLASS_ID, 'class', 'node_id');
            $customerData = json_decode($customerData, true);
            foreach ($customerData['data'] as $key => $value) {
                if (intval($value['CustomerNo']) == intval($customerNo)) {
                    $customerArray = $value;
                }
            }
        }
    }
    if (strtolower($_UseEntity) != 'y') {
        $customerArray['EntityName'] = '';
    }
    if ($returnCode == 429 || $returnCode == 400) {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
    } else {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
        $json['customer'] = $customerArray;
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($json);
//    exit;
} elseif ($coBuyerNo != '') {
    /* For Co Buyer Info */
    $coBuyerArray = array();
    if (trim($coBuyerNo) != '') {
        $myXMLData = $builderApiObj->callCurl(MARINEMAX_API_URL . "COBUYERS?X-Connection=ASTRAG2&Location=" . $location . "&CoBuyerNo=" . $coBuyerNo);
        $myXMLData = explode("<?xml", $myXMLData);
        $myXMLData[1] = "<?xml" . $myXMLData[1];

        $xml = simplexml_load_string($myXMLData[1]);
        $api_data = json_encode($xml);
        $api_data_array = json_decode($api_data, true);

        if (intval($api_data_array['http_code']) == 429) {
            $returnCode = 429;
            $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
            $error429 = str_replace("timeSpanFromIDS", $time, $error429);
            $errorMsg = $returnCode . $error429;
        } else if (intval($api_data_array['http_code']) == 400) {
            $returnCode = 400;
            $errorMsg = $returnCode . $error400;
        } else {
            $returnCode = 200;
            $errorMsg = '';
            $compare_type = 1;
            $filePath = $folderPath . 'cobuyer_file_' . $location . '_' . $coBuyerNo . '.txt';
            $fileExist = $sdkApi->isObjectExist($filePath);
            if ($fileExist) {
                $api_file_data = $sdkApi->getFileData($filePath);
                if ($api_file_data == md5($api_data)) {
                    $compare_type = 1;
                    $api_file_data[$coBuyerNo] = $api_data_array;
                } else {
                    $compare_type = 1;
                    $api_file_data[$coBuyerNo] = $api_data_array;
                }
            } else {
                $compare_type = 1;
                $api_file_data[$coBuyerNo] = $api_data_array;
            }

            if ($compare_type) {
                $sdkApi->setFileData($filePath, md5($api_data), "");

                $cobuyer_data = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=COBUYERS&MappingInstanceId=1131077&Location=" . $location . "&CoBuyerNo=" . $coBuyerNo, "");
                $cobuyer_data = explode(" ", strip_tags($cobuyer_data));
            } else {
                $cobuyer_data = "<span style='color:green;' >COBUYERS generated successfully.</span>";
                $cobuyer_data = explode(" ", strip_tags($cobuyer_data));
            }
        }


        if ("successfully." == end($cobuyer_data)) {
            $cobuyer_data = $builderApiObj->getInstanceListOfParticulerClass(CO_BUYER_CLASS_ID, 'class', 'node_id');
            $cobuyer_data = json_decode($cobuyer_data, true);
            foreach ($cobuyer_data['data'] as $key => $value) {
                if (intval($value['CoBuyerID']) == intval($coBuyerNo)) {
                    $coBuyerArray = $value;
                }
            }
        }
    }
    if ($returnCode == 429 || $returnCode == 400) {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
    } else {
        $json['returnCode'] = $returnCode;
        $json['errorMsg'] = $errorMsg;
        $json['co_buyer'] = $coBuyerArray;
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//    print json_encode($json);
//    exit;
} else if ($coBuyerNo == '') {
    /* For Co Buyer Info */
    $coBuyerArray = array();
    $coBuyerArray['CoBuyerID'] = '';
    $json['co_buyer'] = $coBuyerArray;

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
} else {

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
}
?>