<?php
/* Server side validation when any role save draft or publish the deal*/
$canDealSaveDraftOrPublish      = 1;
$errorMessage                   = '';
if($post['node_class_id'] == DEAL_CLASS_ID)
{
    /* For Deal Save as Draft */
    if($post['login_role_id'] != '' && $post['id_detail_save_type'] == 'D'){
        $dealPermission = $builderApiObj->getDealPermissions($post['login_role_id'],DEAL_PERMISSIONS_PROP_ID);
        $dealPermissionArr = explode(',',json_decode($dealPermission, true)['data']['value']);
        
        $canDealAdd     = 0;
        if(in_array('Can Add', $dealPermissionArr)){
            $canDealAdd = 1;
        }

        if(!$canDealAdd)
        {
            $canDealSaveDraftOrPublish = 0;
        }
        $errorMessage           = 'save as draft';
    }

    /* For Deal Publish */
    if($post['login_role_id'] != '' && $post['id_detail_save_type'] == 'P'){
        if($post['id_detail_instance_id'] == '')
        {
            $dealPermission = $builderApiObj->getDealPermissions($post['login_role_id'],DEAL_PERMISSIONS_PROP_ID);
            $dealPermissionArr = explode(',',json_decode($dealPermission, true)['data']['value']);
            
            $canDealAdd     = 0;
            if(in_array('Can Add', $dealPermissionArr)){
                $canDealAdd = 1;
            }

            if(!$canDealAdd)
            {
                $canDealSaveDraftOrPublish = 0;
            }
        }
        else
        {
            $dealInfoArray = json_decode($builderApiObj->getTableCols(array('node_id','status'), 'node-instance', array('node_instance_id'), array($post['id_detail_instance_id'])), true);
            $_permission = getOperationActionPermission($post['login_role_id'], $dealInfoArray['node_id']);

            $status_key                                  = array_search(3287, $post['instance_property_id']);
            $status_val                                  = $post['instance_property_caption'][$status_key];

            if(strtolower($status_val) == 'archive')
            {
                if(!in_array('Can Publish Archived Deal',$_permission)){
                    if($dealInfoArray['status'])
                    $canDealSaveDraftOrPublish = 0;
                }
            }
            else
            {
                if(!in_array('Can Edit Deal',$_permission)){
                    if($dealInfoArray['status'])
                    $canDealSaveDraftOrPublish = 0;
                }
            }

        }
        $errorMessage           = 'publish';
    }
}

if($canDealSaveDraftOrPublish)
{
    $post['emailLinks']                         = json_decode($post['emailLinks'], TRUE);
    $filesArr                                   = array();
    foreach ($_FILES as $key => $file) {
        $instancePropId                         = str_replace('filenodeZ', '', $key);
        $index                                  = array_search($instancePropId, $post['instance_property_id']);
        $newFileName                            = mt_rand() . '_' . $file['name'];

        $return                                 = 0;
        if($file["tmp_name"] != '')
        {
            $return                             = $sdkApi->setFileData("public/nodeZimg/".$newFileName,$file["tmp_name"],'file');
            $return                             = 1;
        }
        //if (move_uploaded_file($file["tmp_name"], $uploadPath . $newFileName)) {
        if ($return) {
            // set instance caption to store file name with path
            if(!isset($post['instance_property_caption'])) {
                $post['instance_property_caption'] = array();
            }
            array_splice($post['instance_property_caption'], $index, 0, UPLOAD_URL_API . $newFileName);
        } elseif (isset($post['id_detail_instance_id'])) {
            // in case of form edit and file not uploaded
            if (isset($post['fileZvalue' . $instancePropId])) {
                if (!isset($postData['instance_property_caption'])) {
                    $postData['instance_property_caption'] = array();
                }
                array_splice($post['instance_property_caption'], $index, 0, $post['fileZvalue' . $instancePropId]);
                unset($post['fileZvalue' . $instancePropId]);
            } else {
                $post['instance_property_caption'][$index] = '';
            }
        }
    }

    $dataArray                                  = array();
    if (isset($post['autogenerated']) && !empty($post['autogenerated'])) {
        $dataArray['autogenerated']             = explode(",", $post['autogenerated']);
    }

    $dataArray['col_head_prop_id']              = explode(",", $post['col_head_prop_id']);
    $dataArray['node_instance_id']              = $post['id_detail_instance_id'];
    $dataArray['node_class_id']                 = $post['node_class_id'];
    $dataArray['node_class_property_id']        = $post['instance_property_id'];
    $dataArray['value']                         = $post['instance_property_caption'];
    $dataArray['is_email']                      = 'N';
    $dataArray['status']                        = $post['id_detail_save_type'];
    $dataArray['activeMenu']                    = explode(",", $post['activeMenu']);
    $dataArray['login_user_id']                 = $post['login_user_id'];    //login_user_id
    $dataArray['login_role_id']                 = $post['login_role_id'];    //login_role_id
    $setting                                    = json_decode($post['list_setting_array'], true);
    $nodeIdArray                                = json_decode($post['list_node_id_array'], true);
    $data                                       = json_decode($post['list_head_array'], true);

    /* get Location Property Value For Use in Creating Name of IDS Files */
    $locationDealIndex                          = array_search('6807', $post['instance_property_id']);
    $locationDealValue                          = $post['instance_property_caption'][$locationDealIndex];

    /* This Code For Getting All Files Name Of Using Current Deals */
    $customerTempArray                          = array('propertyId' => DEAL_CUSTOMER_PID, 'keyName' => 'CustomerNo', 'classId' => CUSTOMER_CLASS_ID, 'classNId' => CUSTOMER_CLASS_NID);
    $stockTempArray                             = array('propertyId' => DEAL_STOCK_PID, 'keyName' => 'StockNo', 'classId' => UNIT_CLASS_ID, 'classNId' => UNIT_CLASS_NID);
    $salesTempArray                             = array('propertyId' => DEAL_SALES_QUOTE_PID, 'keyName' => 'QuoteNo', 'classId' => SALES_QUOTES_CLASS_ID, 'classNId' => SALES_QUOTE_CLASS_NID);
    $fiTempArray                                = array('propertyId' => DEAL_FI_QUOTE_PID, 'keyName' => 'QuoteNo', 'classId' => FINANCE_DEALS_CLASS_ID, 'classNId' => FI_QUOTE_CLASS_NID);
    $cobuyerTempArray                           = array('propertyId' => DEAL_COBUYER_PID, 'keyName' => 'CoBuyerID', 'classId' => CO_BUYER_CLASS_ID, 'classNId' => COBUYER_CLASS_NID);

    $allTempArray                               = array('customer' => $customerTempArray,'boat' => $stockTempArray,'sales' => $salesTempArray,'finance' => $fiTempArray,'cobuyer' => $cobuyerTempArray);
    $setArrayOfValue                            = array();

    foreach($allTempArray as $index => $value)
    {
        $setArrayOfValue[$index]                = setSubClassMapping($post,$index,$value,$locationDealValue);
    }

    //Code to validate API data with their rest data match before publish
    $valid_publish                              = 1;
    if ($dataArray['status'] == 'P' && $dataArray['node_class_id'] == DEAL_CLASS_ID) {

        $error  =   array();
        /* Check Stock Values From Instance */
        $temp                                       = explode('~$~',$setArrayOfValue['boat']);
        $stockArray                                 = json_decode($sdkApi->getFileData($temp[1]),true);
        $stockArray                                 = $stockArray['Record'];

        //echo "<pre>";
        //print_r($stockArray);   
        $error['Stock']                             = 'true';
        $stock_key                                  = array_search(DEAL_STOCK_PID, $post['instance_property_id']);
        $stock_num                                  = $post['instance_property_caption'][$stock_key];
        if(count($stockArray) == 0)
        {
            $error['Stock']                         = 'false';
            $valid_publish                          = 0;
            $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
        }

        if($valid_publish == 1)
        {
            $condition                                  = array_search('3230', $post['instance_property_id']);
            $condition_val                              = $post['instance_property_caption'][$condition];

            $brandDesc                                  = array_search('3218', $post['instance_property_id']);
            $brandDesc_val                              = $post['instance_property_caption'][$brandDesc];

            $modelYear                                  = array_search('3219', $post['instance_property_id']);
            $modelYear_val                              = $post['instance_property_caption'][$modelYear];

            $modelDesc                                  = array_search('3220', $post['instance_property_id']);
            $modelDesc_val                              = $post['instance_property_caption'][$modelDesc];

            $lengthDOld                                 = array_search('3221', $post['instance_property_id']);
            $lengthDOld_val                             = $post['instance_property_caption'][$lengthDOld];

            $hullNo                                     = array_search('3224', $post['instance_property_id']);
            $hullNo_val                                 = $post['instance_property_caption'][$hullNo];

            if(isset($stockArray['StockNo']) && $stockArray['StockNo'] != $stock_num)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['DsgnDesc']) && $stockArray['DsgnDesc'] != $condition_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['BrandDesc']) && $stockArray['BrandDesc'] != $brandDesc_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['ModelYear']) && $stockArray['ModelYear'] != $modelYear_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['ModelDesc']) && $stockArray['ModelDesc'] != $modelDesc_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['Length']) && $stockArray['Length'] != $lengthDOld_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
            if (isset($stockArray['HullNo']) && $stockArray['HullNo'] != $hullNo_val)
            {
                $error['Stock']                         = 'false';
                $valid_publish                          = 0;
                $error['Stockmsg']                      = 'The Stock # '.$stock_num.' you entered doesn\'t match the rest of Boat values. Please provide correct data.';
            }
        }
        /* ----------------------------- */

        /* Check FI Values From Instance */
        $temp                                       = explode('~$~',$setArrayOfValue['finance']);
        $fiArray                                    = json_decode($sdkApi->getFileData($temp[1]),true);
        $fiArray                                    = $fiArray['Record'];
        //print_r($fiArray);
        $error['FiQuote']                           = 'true';
        $fi_key                                     = array_search(DEAL_FI_QUOTE_PID, $post['instance_property_id']);
        $fi_num                                     = $post['instance_property_caption'][$fi_key];
        if(count($fiArray) == 0)
        {
            $error['FiQuote']                       = 'false';
            $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            $valid_publish                          = 0;
        }

        if($valid_publish == 1)
        {
            $fi_trade_in                                = array_search('3229', $post['instance_property_id']);
            $fi_trade_in_val                            = $post['instance_property_caption'][$fi_trade_in];

            $fi_deal_type                               = array_search('3231', $post['instance_property_id']);
            $fi_deal_type_val                           = $post['instance_property_caption'][$fi_deal_type];

            $fi_deal_status                             = array_search('3287', $post['instance_property_id']);
            $fi_deal_status_val                         = $post['instance_property_caption'][$fi_deal_status];

            $fi_delivary_location                       = array_search('6805', $post['instance_property_id']);
            $fi_delivary_location_val                   = $post['instance_property_caption'][$fi_delivary_location];

            $fi_estimate_d_date                         = array_search('6803', $post['instance_property_id']);
            $fi_estimate_d_date_val                     = $post['instance_property_caption'][$fi_estimate_d_date];

            if(isset($fiArray['QuoteNo']) && $fiArray['QuoteNo'] != $fi_num)
            {
                $error['FiQuote']                       = 'false';
                $valid_publish                          = 0;
                $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            }
            if (isset($fiArray['TradeStockNo']) && $fiArray['TradeStockNo'] && $fi_trade_in_val == "No")
            {
                $error['FiQuote']                       = 'false';
                $valid_publish                          = 0;
                $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            }
            if(isset($fiArray['LoanAmortization']) && $fiArray['LoanAmortization'])
                $new_fi_deal_type_val                   = "Financing";
            else
                $new_fi_deal_type_val                   = "Cash";
            if ($new_fi_deal_type_val!= $fi_deal_type_val)
            {
                $error['FiQuote']                       = 'false';
                $valid_publish                          = 0;
                $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            }

            //deal status value updated by ben
            $display_type                               = 'add';
            if(isset($post['id_detail_instance_id']) && $post['id_detail_instance_id']){
                $_dealStatus                            = json_decode($builderApiObj->getTableCols(array('status'), 'node-instance', array('node_instance_id'), array($post['id_detail_instance_id'])), TRUE)['status'];
                if($_dealStatus){
                    $display_type                       = 'edit';
                }
            }

            $_IsQuoteOrDeal                             = $fiArray['IsQuoteOrDeal'];
            $_StatusCode                                = $stockArray['StatusCode'];
            
            if ($display_type == 'add') {
                $_dealExists                            = 'N';
            } elseif ($display_type == 'edit') {
                $_dealExists                            = 'Y';
            }
            $fiArray['FIStatusDesc'] = 'None';
            if ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'D' && ($_StatusCode == 'SA' || $_StatusCode == 'SO')) { //correct
                $fiArray['FIStatusDesc']                = 'Capped';
            } else {
                if ($_dealExists == 'N' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS')) {
                    $fiArray['FIStatusDesc']            = 'Sales';
                } else if ($_dealExists == 'Y' && $_IsQuoteOrDeal == 'Q' && ($_StatusCode == 'A' || $_StatusCode == 'SA' || $_StatusCode == 'O' || $_StatusCode == 'SO' || $_StatusCode == 'FS')) {
                    $fiArray['FIStatusDesc']            = 'Cancelled'; //correct  
                }
            }

            //deal status value updated by ben
            if(isset($fiArray['FIStatusDesc']))
                $new_fi_deal_status_val                 = $fiArray['FIStatusDesc'];
            else
                $new_fi_deal_status_val                 = '';

            $fi_deal_status_val = $new_fi_deal_status_val;

            if ($fiArray['DeliveryLocn'] != $fi_delivary_location_val)
            {
                $error['FiQuote']                       = 'false';
                $valid_publish                          = 0;
                $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            }
            $fi_estimate_d_date_val                     = strtotime($fi_estimate_d_date_val);
            if(isset($fiArray['DeliveryDate']))
                $ins_del_Date                           = strtotime($fiArray['DeliveryDate']);
            else
                $ins_del_Date                           = '';
            if ($fi_estimate_d_date_val != $ins_del_Date)
            {
                $error['FiQuote']                       = 'false';
                $valid_publish                          = 0;
                $error['FiQuotemsg']                    = 'The FIQuote # '.$fi_num.' you entered doesn\'t match the rest of Deal values. Please provide correct data.';
            }
        }

        /* ----------------------------- */

        /* Check Customer Values From Instance */
        $temp                                       = explode('~$~',$setArrayOfValue['customer']);
        $customerArray                              = json_decode($sdkApi->getFileData($temp[1]),true);
        $customerArray                              = $customerArray['Record'];
        //print_r($customerArray);
        $error['Customer']                          = 'true';
        $customer_key                           = array_search(DEAL_CUSTOMER_PID, $post['instance_property_id']);
        $customer_num                           = $post['instance_property_caption'][$customer_key];
        if(count($customerArray) == 0)
        {
            $error['Customer']                      = 'false';
            $valid_publish                          = 0;
            $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
        }

        if($valid_publish == 1)
        {
            $firstName                                  = array_search('3211', $post['instance_property_id']);
            $firstName_val                              = $post['instance_property_caption'][$firstName];

            $middleName                                 = array_search('3212', $post['instance_property_id']);
            $middleName_val                             = $post['instance_property_caption'][$middleName];

            $lastName                                   = array_search('3240', $post['instance_property_id']);
            $lastName_val                               = $post['instance_property_caption'][$lastName];

            $emailPrimary                               = array_search('6800', $post['instance_property_id']);
            $emailPrimary_val                           = $post['instance_property_caption'][$emailPrimary];

            $phoneHome                                  = array_search('3241', $post['instance_property_id']);
            $phoneHome_val                              = $post['instance_property_caption'][$phoneHome];

            $phoneBusiness                              = array_search('3242', $post['instance_property_id']);
            $phoneBusiness_val                          = $post['instance_property_caption'][$phoneBusiness];

            $addressNew                                 = array_search('3243', $post['instance_property_id']);
            $addressNew_val                             = $post['instance_property_caption'][$addressNew];

            $city                                       = array_search('3213', $post['instance_property_id']);
            $city_val                                   = $post['instance_property_caption'][$city];

            $state                                      = array_search('6222', $post['instance_property_id']);
            $state_val                                  = $post['instance_property_caption'][$state];

            $zipCode                                    = array_search('6223', $post['instance_property_id']);
            $zipCode_val                                = $post['instance_property_caption'][$zipCode];

            if(isset($customerArray['CustomerNo']) && $customerArray['CustomerNo'] != $customer_num)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            
            if (isset($customerArray['FirstName']) && $customerArray['FirstName'] != $firstName_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['MiddleInitial']) && $customerArray['MiddleInitial'] != $middleName_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['LastName']) && $customerArray['LastName'] != $lastName_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['EmailPrimary']) && $customerArray['EmailPrimary'] != $emailPrimary_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['PhoneHome']) && $customerArray['PhoneHome'] != $phoneHome_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['PhoneBusiness']) && $customerArray['PhoneBusiness'] != $phoneBusiness_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['address']) && $customerArray['address'] != $addressNew_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['City']) && $customerArray['City'] != $city_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['State']) && $customerArray['State'] != $state_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
            if (isset($customerArray['ZipCode']) && $customerArray['ZipCode'] != $zipCode_val)
            {
                $error['Customer']                      = 'false';
                $valid_publish                          = 0;
                $error['Customermsg']                   = 'The Customer # '.$customer_num.' you entered doesn\'t match the rest of Buyer values. Please provide correct data.';
            }
        }
        /* ----------------------------- */

        if($valid_publish == 0)
        {
            header('Content-Type: application/json');
            $error['result']                        = 1;
            print json_encode($error);
            exit;
        }

        // For Saving Controle Version Ids in Deal Instance
        if($display_type   == 'add')
        {
            // CONTROL_VERSION_IDS
            $controlRes             = $builderApiObj->getInstanceListOfParticulerClass(MANAGE_CONTROL_CLASS_ID, 'class', 'node_id');
            $controlResData         = json_decode($controlRes, true);
            $setControlVersionIds   = '';
            foreach ($controlResData['data'] as $control_instance_node_id => $controlArr) {
                $status = json_decode($builderApiObj->getTableCols(array('status'), 'node-instance', array('node_id'), array($control_instance_node_id)), TRUE)['status'];
                if(trim($controlArr['Is Current Version'])=="True" && intval($status) == 1){
                    $setControlVersionIds   .= $control_instance_node_id.',';
                }
            }
            $dealControlVersionIdsIndex = array_search(DEAL_CONTROL_VERSION_IDS, $dataArray['node_class_property_id']);
            $dataArray['value'][$dealControlVersionIdsIndex] = $setControlVersionIds;
        }
    }
    //Code to validate API data with their rest data match end

    // Coded By: Amit Malakar
    // Date: 11-Jan-17
    // RA Unassign to DEAL ASSIGNED PROPERTY >>>
    if($dataArray['node_class_id'] == DEAL_CLASS_ID) {
        // TIMESTAMP
        if ($display_type != 'add') {
            $tmArr['node_instance_id']             = $post['id_detail_instance_id'];
            $tmArr['node_class_property_id']       = DEAL_TIMESTAMP_PID;
            $dataArray['node_class_property_id'][] = DEAL_TIMESTAMP_PID;
            $timestampIndex                        = array_search(DEAL_TIMESTAMP_PID, $dataArray['node_class_property_id']);
            $dataArray['value'][$timestampIndex]   = json_decode($builderApiObj->getInstancePropertyValue($tmArr));
        }
        // GET RA ACTOR NAME
        if ($post['id_detail_instance_id']) {
            $dealNodeId = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-instance', array('node_instance_id'), array($post['id_detail_instance_id'])), TRUE)['node_id'];
            $raArr      = array(
                'role_id'       => ROLE_REVENUE_ACCOUNTANT,
                'node_id'       => $dealNodeId,
                'node_class_id' => MAPPING_ROLE_ACTOR_CLASS_ID,
            );

            $assignedIndex = array_search(DEAL_ASSIGNED_PID, $dataArray['node_class_property_id']);
            if (!$assignedIndex) {
                $dataArray['node_class_property_id'][] = DEAL_ASSIGNED_PID;
            }
            $dataArray['value'][$assignedIndex] = json_decode($builderApiObj->getRAActorName($raArr));

        } else {
            $dataArray['node_class_property_id'][] = DEAL_ASSIGNED_PID;
            $unassignedIndex                       = array_search(DEAL_ASSIGNED_PID, $dataArray['node_class_property_id']);
            $dataArray['value'][$unassignedIndex]  = 'Unassigned';
        }
    }
    // <<< RA Unassign to DEAL ASSIGNED PROPERTY

    if($valid_publish==1)
    {
        $returnResponse                             = $builderApiObj->setDataAndStructure($dataArray, '1', '6');
        $returnResponse                             = json_decode($returnResponse, true);

        if($dataArray['node_class_id'] == DEAL_CLASS_ID && intval($returnResponse['data']['node_id']) > 0)
        {
            $node_y_id                              = intval($returnResponse['data']['node_id']);
            $newDataArray                           = array();
            /* For Subclass Instance Id */
            $subData                                = $builderApiObj->getInstanceIdOfSubClass(OPERATION_PROPERTY_MAP_DEAL_CLASS_ID, $returnResponse['data']['node_id']);
            $subData                                = json_decode($subData, true);
            $newDataArray['node_instance_id']       = $subData['data'];
            $newDataArray['node_class_id']          = OPERATION_PROPERTY_MAP_DEAL_CLASS_ID;
            $newDataArray['node_class_property_id'] = array(CUSTOMER_PID, STOCK_PID, SALES_QUOTE_PID,FI_QUOTE_PID,COBUYER_PID);
            $newDataArray['value']                  = array_values($setArrayOfValue);
            $newDataArray['is_email']               = 'N';
            $newDataArray['status']                 = 'P';

            $returnOpeDealResponse                  = $builderApiObj->setDataAndStructure($newDataArray, '1', '6');
            $returnOpeDealResponse                  = json_decode($returnOpeDealResponse, true);
            $node_x_id[]                            = intval($returnOpeDealResponse['data']['node_id']);

            if($subData['data'] == '')
            {
                $newArray['node_y_id']                  = $node_y_id;
                $newArray['node_x_ids']                 = $node_x_id;
                $returnRResponse                        = $builderApiObj->setDataAndStructure($newArray, '7', '9');
            }
        }

        if ($dataArray['node_class_id'] == DEAL_CLASS_ID && $post['id_detail_instance_id'] == '' && $post['login_role_id'] != '')
        {
            $locationIndex                          = array_search(DEAL_LOCATION_PID, $dataArray['node_class_property_id']);
            $dealLocation                           = $dataArray['value'][$locationIndex];

            $LR_Details                             = $builderApiObj->getInstanceListOfParticulerClass(LOCATION_ROLE_DETAILS, 'class', 'node_id');
            $LR_Details                             = json_decode($LR_Details, true);

            $mapping_role_actor_array               = array();
            $tempArray                              = array($post['login_role_id'], $post['login_user_id'], $returnResponse['data']['node_id']);
            $mapping_role_actor_array[]             = $tempArray;
            $locationArray                          = array();
            foreach ($LR_Details['data'] as $key => $value)
            {
                if (strtolower($value['Location']) == strtolower($dealLocation))
                {
                    if(intval($post['login_role_id']) != intval($value['RoleNID']))
                    {
                        $locationArray[]            = $value;

                        if(intval($value['RoleNID']) == intval(ROLE_REVENUE_ACCOUNTANT))
                            $value['ActorNID'] = '';

                        $tempArray                  = array($value['RoleNID'], $value['ActorNID'], $returnResponse['data']['node_id']);
                        $mapping_role_actor_array[] = $tempArray;
                    }
                }
            }

            foreach($mapping_role_actor_array as $key => $valueArray)
            {
                $newDataArray                           = array();
                $newDataArray['node_class_id']          = MAPPING_ROLE_ACTOR_CLASS_ID;
                $newDataArray['node_class_property_id'] = array(ROLE_PID, ACTOR_PID, DEAL_PID);
                $newDataArray['value']                  = $valueArray;
                $newDataArray['is_email']               = 'N';
                $newDataArray['status']                 = 'P';
                $returnNewResponse                      = $builderApiObj->setDataAndStructure($newDataArray, '1', '6');
            }
        }

        $listArray['header']                        = json_decode($builderApiObj->getListHeader($data), true)['data'];
        $listArray['list']                          = $returnResponse['data']['list'];
        $listArray['save_type']                     = $post['id_detail_save_type'];
        $listArray['list_head_array']               = $data; // required for concating header fields
        $return                                     = 1;
        $buildQueryArray                            = array();
        $listHtml                                   = listContent($listArray, $setting, $nodeIdArray, $buildQueryArray, $return, $returnResponse['data']['node_id']);
        $returnResponse['data']['status']           = $dataArray['status'];
        unset($returnResponse['data']['list']);
        $returnResponse['data']['col_data']         = $listHtml;
        $returnResponse['status']                   = 1;
        $returnResponse['message']                  = '';
        header('Content-Type: application/json');
        print json_encode($returnResponse);
        exit;
    }
}
else
{
    $returnResponse['result']                       = 2;
    $returnResponse['status']                       = 0;
    $returnResponse['message']                      = "You can't ".$errorMessage." deal.";
    header('Content-Type: application/json');
    print json_encode($returnResponse);
    exit;
}
?>
