<?php

// Role ID of Login User
$_roleId = $post['login_role_id'];

// Get Location and Fi Quote from Post Data
if (isset($post['locationCode']) && trim($post['locationCode']) != '') {
    $location = $post['locationCode'];
}
if (isset($post['fiQuoteNo']) && trim($post['fiQuoteNo']) != '') {
    $fiQuoteNo = trim($post['fiQuoteNo']);
} else {
    $fiQuoteNo = '';
}

//if (isset($post['customerNo']) && trim($post['customerNo']) != '') {
//    $customerNo                 = trim($post['customerNo']);
//    $_UseEntity                 = trim($post['UseEntity']);
//} else {
//    $customerNo                 = '';
//}

$json = array();
$api_file_data = array();
$folderPath = 'puidata/page_plugin/api_files/';

// Strings for 400 and 429 Error
$error429 = ' error occured! <br>Please try again after timeSpanFromIDS second(s).';
$error400 = ' error occured! <br>There is an issue with data in IDS. Please verify data in IDS and try again.';

if ($fiQuoteNo != '') {
    $fiArray = array();
    $newXMLArray = array();
    $newQuoteNo = '';
    // IDS API Call
    $myXMLData = $builderApiObj->callCurl(MARINEMAX_API_URL . "FINANCE_DEALS?X-Connection=ASTRAG2&Location=" . $location . "&QuoteNo=" . $fiQuoteNo);
    $myXMLData = explode("<?xml", $myXMLData);
    $myXMLData[1] = "<?xml" . $myXMLData[1];

    $xml = simplexml_load_string($myXMLData[1]);
    $api_data = json_encode($xml);
    $api_data_array = json_decode($api_data, true);
    // Check API Responce - 200 (Success), 400 (Bad Request), 429 (Time Out)
    if (intval($api_data_array['http_code']) == 429) {
        $returnCode = 429;
        $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
        $error429 = str_replace("timeSpanFromIDS", $time, $error429);
        $errorMsg = $returnCode . $error429;
    } else if (intval($api_data_array['http_code']) == 400) {
        $returnCode = 400;
        $errorMsg = $returnCode . $error400;
    } else {
        $api_data_array = changeBlankArrayIntoValue($api_data_array, 'fi');

        $returnCode = 200;
        $errorMsg = '';

        //Save IDS API Data into S3 Bucket as a file
        $filePath = $folderPath . 'finance_' . $fiQuoteNo . "_" . $location . '.txt';
        $sdkApi->setFileData($filePath, json_encode($api_data_array), "text");

        $fiData['data'] = $api_data_array['Record'];
        // Conditons to Fetch/Check Quote No, StockNo, Customer ID, Co-Buyer ID
        $newQuoteNo = $customerNo = $stockNo = $coBuyerNo = '';
        if (trim($fiData['data']['QuoteNo']) != '')
            $newQuoteNo = intval($fiData['data']['QuoteNo']);
        if (trim($fiData['data']['CustID']) != '')
            $customerNo = intval($fiData['data']['CustID']);
        if (trim($fiData['data']['StockNo']) != '')
            $stockNo = $fiData['data']['StockNo'];
        if (trim($fiData['data']['CoBuyerID']) != '')
            $coBuyerNo = intval($fiData['data']['CoBuyerID']);

        $fiArray = $fiData['data'];
        $fiArray['res'] = 'No res';
        // Make IDS API Call URLs, If Required Value Available
        if (trim($stockNo) != '') {
            $newXMLData['boat']['apiUrl'] = MARINEMAX_API_URL . "UNITS?X-Connection=ASTRAG2&Location=" . $location . "&StockNo=" . $stockNo;
            $newXMLData['boat']['fileName'] = $folderPath . 'boat_' . $stockNo . "_" . $location . '.txt';
        }

        if (trim($customerNo) != '') {
            $newXMLData['customer']['apiUrl'] = MARINEMAX_API_URL . "CUSTOMERS?X-Connection=ASTRAG2&Location=" . $location . "&CustomerNo=" . $customerNo;
            $newXMLData['customer']['fileName'] = $folderPath . 'customer_' . $customerNo . "_" . $location . '.txt';
        }

        if (trim($coBuyerNo) != '') {
            $newXMLData['cobuyer']['apiUrl'] = MARINEMAX_API_URL . "COBUYERS?X-Connection=ASTRAG2&Location=" . $location . "&CoBuyerNo=" . $coBuyerNo;
            $newXMLData['cobuyer']['fileName'] = $folderPath . 'cobuyer_' . $coBuyerNo . "_" . $location . '.txt';
        }

        // Loop to make Api Calls
        foreach ($newXMLData as $api => $apiUrl) {
            $api_data_array = array();
            $myXMLData = $builderApiObj->callCurl($apiUrl['apiUrl']);
            $myXMLData = explode("<?xml", $myXMLData);
            $myXMLData[1] = "<?xml" . $myXMLData[1];

            $xml = simplexml_load_string($myXMLData[1]);
            $api_data = json_encode($xml);
            $api_data_array = json_decode($api_data, true);
            // Check API Responce - 200 (Success), 400 (Bad Request), 429 (Time Out)
            if (intval($api_data_array['http_code']) == 429) {
                $returnCode = 429;
                $time = intval(preg_replace('/[^0-9]+/', '', $api_data_array['message']), 10);
                $error429 = str_replace("timeSpanFromIDS", $time, $error429);
                $errorMsg = $returnCode . $error429;
                break;
            } else if (intval($api_data_array['http_code']) == 400) {
                $returnCode = 400;
                $errorMsg = $returnCode . $error400;
                break;
            } else {
                $returnCode = 200;
                $errorMsg = '';
                $api_data_array = changeBlankArrayIntoValue($api_data_array, $api);
                $newXMLArray[$api] = $api_data_array['Record'];
                //Save IDS API Data into S3 Bucket as a file
                $sdkApi->setFileData($apiUrl['fileName'], json_encode($api_data_array), "text");
                //Conditions for Status If API call is Boat
                if ($api == 'boat') {
                    $_IsQuoteOrDeal = trim($fiArray['IsQuoteOrDeal']);
                    $_StatusCode = $newXMLArray[$api]['StatusCode'];
                    $display_type = trim($post['display_type']);
                    $id_detail_instance_id = $post['id_detail_instance_id'];
                    $_dealExists = '';

                    if (isset($id_detail_instance_id) && !empty($id_detail_instance_id)) {
                        $_dealExists = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id'), array($id_detail_instance_id, DEAL_EXISTS_PID)), TRUE)['value'];
                        $_dealPublish = json_decode($builderApiObj->getTableCols(array('status'), 'node-instance', array('node_instance_id'), array($id_detail_instance_id)), TRUE)['status'];
                    }

                    if ($_dealExists == '' || $_dealExists == 'N') {
                        if ($_IsQuoteOrDeal == 'D') {
                            $_dealExists = 'Y';
                        } else {
                            $_dealExists = 'N';
                        }
                    }

                    $newXMLArray[$api]['status'] = 'None';
                    if (strtolower($display_type) == 'edit' && $_dealPublish == 1) {
                        $_dealNodeId = trim($post['deal_node_id']);
                        //Get current control role id on deal 
                        $_roleId = json_decode($builderApiObj->getCurrentControl($_dealNodeId), TRUE)['data']['active_role_id'];
                        $newXMLArray[$api]['Current Role ID'] = 'Current ' . $_roleId;
                        // Checking deal is archieved or not
                        $archivedStatus = json_decode($builderApiObj->checkInArchivedStatus($_dealNodeId), true);
                        if ((int) $archivedStatus == 1) {//deal archieved
                            $_roleId = 'archive';
                        }
                        $newXMLArray[$api]['Deal Archived'] = $archivedStatus;
                    }
                    if (/* $_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && $_StatusCode == 'FS' && */ strtolower($_roleId) == 'archive') {// as per discussion with animesh , shanti and arvind, we have comment thsi line(03-01-2017)
                        $newXMLArray[$api]['status'] = 'Archive';
                    } elseif ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO') && $_roleId == ROLE_BM) { //correct
                        $newXMLArray[$api]['status'] = 'Capped';
                    } elseif ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && $_StatusCode == 'FS' && ($_roleId == ROLE_BM || $_roleId == ROLE_REVENUE_MANAGER || $_roleId == ROLE_CONTROLLER || $_roleId == ROLE_DIRECTOR)) {
                        $newXMLArray[$api]['status'] = 'Final Sale';
                    } elseif ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_REVENUE_ACCOUNTANT) {
                        $newXMLArray[$api]['status'] = 'Posting';
                    } elseif ($_dealExists == 'N' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_BM) {
                        $newXMLArray[$api]['status'] = 'Sales';
                    } elseif ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'Q' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS') && $_roleId == ROLE_BM) {
                        $newXMLArray[$api]['status'] = 'Cancelled'; //correct  
                    }

                    $newXMLArray[$api]['StatsLogic'] = $_IsQuoteOrDeal . ' ' . $_dealExists . ' ' . $_StatusCode . ' ' . $_roleId . ' ' . $_dealPublish;
                    //$newXMLArray[$api]['AllRoles']     = ROLE_BM . ' ' . ROLE_REVENUE_MANAGER . ' ' . ROLE_REVENUE_ACCOUNTANT . ' ' . ROLE_CONTROLLER . ' ' . ROLE_DIRECTOR;
                    //$newXMLArray[$api]['Deal_Exists']  = $_dealExists;
                }
                // Condition to check EntityName for Business Name For Customer API
                if ($api == 'customer') {
                    $_UseEntity = trim($fiArray['UseEntity']);
                    if (strtolower($_UseEntity) != 'y') {
                        $newXMLArray[$api]['EntityName'] = '';
                    }
                }
            }
        }        
        // Blank Co-Buyer Data If ID not Available from IDS
        if (trim($coBuyerNo) == '') {
            $coBuyerArray['CoBuyerID'] = '';
            $newXMLArray['cobuyer'] = $coBuyerArray;
        }
    }
    //Return Array Conditons
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
        $json['fiQuote'] = $fiArray;
        $json['Trades'] = $fiArray['Trades'][0];
        $json['boat'] = $newXMLArray['boat'];
        $json['customer'] = $newXMLArray['customer'];
        $json['co_buyer'] = $newXMLArray['cobuyer'];
    }

    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;

//    print json_encode($json);
//    exit;
} else {
    // Return blank if FI Quote not available
//    print json_encode($json);
//    exit;
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $json;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
}
?>