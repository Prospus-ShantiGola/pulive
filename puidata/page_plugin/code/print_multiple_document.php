<?php

$status = $searchString = $propertyId                           = '';
if (isset($post['status']) && isset($post['propertyId'])) {
    $status                                                     = $post['status'];
    $propertyId                                                 = $post['propertyId'];
}
if (isset($post['search_string']) && $post['search_string'] != "") {
    $searchString                                               = $post['search_string'];
}
$is_deal_editable                                               = $post['is_deal_editable'];
$deal_node_instance_id                                          = $post['deal_node_instance_id'];
$deal_instance_node_id                                          = $post['deal_instance_node_id'];
$deal_actor_role_node_id                                        = $post['deal_actor_role_node_id'];
$deal_user_role_id                                              = $post['deal_user_role_id'];
$menu_instance_node_id                                          = '1614957'; //'439819';
$mapping_class_node_id                                          = json_decode($post['list_mapping_id_array'], true);
$document_node_ids                                              = $post['document_id_array'];
$operation_ids_array                                            = $post['operation_id_array'];
$login_user_id                                                  = $post['login_user_id'];
$fieldname                                                      = $post[' '];
$operationListArr                                               = array();

/* For Fetch All Instance Files From Subclass like (FI, Customer, Co Buyer And Others )*/
$dealInstancesArray['396138']                                   = $deal_instance_node_id;
$subData                                                        = $builderApiObj->getInstanceIdOfSubClass(OPERATION_PROPERTY_MAP_DEAL_CLASS_ID, $deal_instance_node_id);
$subData                                                        = json_decode($subData, true);
if ($subData['data'] != '') {
    $instanceInfo                                               = $builderApiObj->getInstanceListOfParticulerClass($subData['data'], 'instance', 'node_id');
    $instanceInfo                                               = json_decode($instanceInfo, true);
    if (count($instanceInfo['data']) > 0) {
        foreach (current($instanceInfo['data']) as $keys => $value) {
            $temp                                               = explode('~$~', $value);
            $dealInstancesArray[$temp[0]]                       = $temp[1];
        }
    }
}

/* Fetch All Document Data */
$postDataArray                                                  = array();
$postDataArray['deal_node_id']                                  = $deal_instance_node_id;
$postDataArray['user_role_id']                                  = $deal_user_role_id;
$postDataArray['user_login_id']                                 = $login_user_id;
$postDataArray['documents_id']                                  = $document_node_ids;
$postDataArray['operation_id']                                  = $operation_ids_array;
$postDataArray['class_nodeid']                                  = $mapping_class_node_id['classNodeid'];
$getAllArray                                                    = json_decode($builderApiObj->getAllDocumentHtml($postDataArray),TRUE);
//print_r($getAllArray);die;
$mappingRoleActorInstanceId                                     = $getAllArray['data']['mappingRoleActorInstanceId'];
if (count($document_node_ids)) {
    foreach ($document_node_ids as $key => $document_id) {
        if($document_id==COMPLETE_FUNDING_ID)
        {
            $htmldata                                           = '';
            $returnData                                         = $getAllArray['data']['doc'][$document_id];
            if(isset($returnData['FormData']) && count($returnData['FormData']))
            {
                foreach($returnData['FormData'] as $key2=>$row)
                {
                    if(isset($row['child']) && count($row['child']))
                    {
                        foreach($row['child'] as $key1=>$row1)
                        {
                            if($key1==APPONE_UNSIGNED_PROPERTY_ID)
                            {
                                $a                                              = new SimpleXMLElement($row1['value']);
                                if($a['href'])
                                {
                                    $folderName                                 = basename($a['href'],'.pdf');
                                    $data                                       = $builderApiObj->callMapApi(PRINT_API_URL . "?href=". base64_encode($a['href']),'');
                                    $fileArray                                  = json_decode($data,true);
                                    
                                     $newFileArray                              = array();
                                     foreach ($fileArray as $key3 => $value) {
                                         $newFileArray[]                        = $value;
                                     }
                                     natsort($newFileArray);
                                     foreach ($newFileArray as $key3 => $value) {
                                         $fileName                              =  $value;
                                         $htmldata[]                            =  ABS_API_URL."data/AppOnePdfImages/$folderName/".$fileName.".png";
                                     }
                                                                        
                                 }
                            }
                        }
                    }
                }
            }
            $operationListArr[$key]['document_type']                            = 'Appone';
            $operationListArr[$key]['document_id']                              = $document_id;
            $operationListArr[$key]['document_html']                            = $htmldata;
        }else{
            $tempArray                                                          = array();
            $document_node_id                                                   = $document_id;
            $operation_node_id                                                  = $operation_ids_array[$key];
            $returnArray                                                        = $getAllArray['data']['doc'][$document_id];
            
            $viewType                                                           = '';
            if ($returnArray['Document'] != "" && $returnArray['Document'] != 'N/A') {
                $viewType                                                       = 'Old';
                $document_node_id                                               = $returnArray['Document'];
            } else {
                $viewType                                                       = 'New';
                $document_node_id                                               = $document_node_id;
            }

            $documentData                                                       = $getAllArray['data']['document'][$document_id];
            $tempArray                                                          = $getAllArray['data']['template'][$document_id];
            $operationListArr[$key]['document_type']                            = $tempArray['value'];
            $operationListArr[$key]['document_id']                              = $document_node_id;

            if ($tempArray['value'] == "Canvas") {
                if($viewType == 'New')
                {
                    $htmldata                                                   = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $documentData[0], $documentData[1]['document'], $returnArray['Document'], $flag, 'canvas');
                    $htmldata                                                   = html_entity_decode($htmldata);
                }
                if($viewType == 'Old')
                {
                    $htmldata                                                   = current($documentData[0][0]);
                    $htmldata                                                   = html_entity_decode($htmldata);
                    $url                                                        = ABS_API_URL;
                    $htmldata                                                   = preg_replace('/(?<=src=")([^"]*)(?=files\/)/', $url, $htmldata);
                    $htmldata                                                   = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd"><html><body><div class="customScroll mid-section-HT"><div id="edtCanvasView"><div id="edtInnerCanvasView" class="printMode">'.$htmldata.'</div></div></div></body></html>';
                }

                /* END HERE */
                $tempArray['value']                                             = 1;
                $operationListArr[$key]['document_html']                        = $htmldata;
            } else {
                $tempArray['value']                                             = 0;
                $htmldata                                                       = getDocumentHtmlList($documentData[0], $brokerage_node_id, $documentData[1]['document'], $returnArray['Document'], $flag);
                $operationListArr[$key]['document_html']                        = $htmldata;
            }
        }   
    }
}

$resJsonArr = array('status' => '1', 'message' => '');
$resJsonArr['data'] = $operationListArr;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;
        
//print json_encode($operationListArr);
//exit;