<?php
$status = $searchString = $propertyId = '';
$json = array();
if (isset($post['status']) && isset($post['propertyId'])) {
    $status = $post['status'];
    $propertyId = $post['propertyId'];
}
if (isset($post['search_string']) && $post['search_string'] != "") {
    $searchString = $post['search_string'];
}
$is_deal_editable = $post['is_deal_editable'];
$deal_node_instance_id = $post['deal_node_instance_id'];
$deal_instance_node_id = $post['deal_instance_node_id'];
$deal_actor_role_node_id = $post['deal_actor_role_node_id'];
$deal_user_role_id = $post['deal_user_role_id'];
$menu_instance_node_id = '1614957'; //'439819';
$mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);
$login_user_id = $post['login_user_id'];
$fieldname = $post[' '];

if(1){
    $data['deal_node_instance_id'] = $post['deal_node_instance_id'];
    $data['role_node_id'] = $post['deal_actor_role_node_id'];
    $data['mapping_class_node_id'] = $mapping_class_node_id['classNodeid'];
    $data['deal_node_id'] = $post['deal_instance_node_id'];
    $data['propertyId'] = $propertyId;
    $data['status'] = $status;
    $data['super_admin'] = isset($post['sadmin']) ? $post['sadmin'] : '';
    $login_user_id = isset($post['login_user_id']) ? $post['login_user_id'] : '';
    $instanceData = $builderApiObj->getOperationList($data);
    //print_r(current($instanceData['data']));die;
    $instanceArray['data'][] = json_decode($instanceData, true);
}else{
    $instanceData = $builderApiObj->getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, $status, $propertyId, 'Required', $fieldname);
    $instanceArray = json_decode($instanceData, true);
}
$post['opr_list'] = current($instanceArray['data']);
$post['mapping_class_node_id'] = $mapping_class_node_id['classNodeid'];
//$postdata['deal_instance_node_id'] = $deal_instance_node_id;
$final_operation_list = json_decode($builderApiObj->finalOperationList($post), true);
$operationListArr = array();
$operation_arr = array();
$operation_arr = $final_operation_list['oprlist'];
//print_r($final_operation_list);die;

//@uasort($instanceArray['data'][0], "cmp");



//print_r($operation_arr);die;
if (count($operation_arr)) {
    $html = '<div class="print_package_opr_list">';
    $operationListArr['status'] = 1;
    foreach ($operation_arr as $key => $value) {
        if (isset($value['PDF Template NID']) && $value['PDF Template NID']) {
//                $document_node_id = $value['PDF Template NID'];
//                $operation_node_id = $value['operation_node_id'];
//                $mappingRoleActorInstanceId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $deal_user_role_id, $login_user_id));
//                $returnData = $builderApiObj->getDealOperationFormId($mappingRoleActorInstanceId, $operation_node_id);
//                $returnArray = json_decode($returnData, true);
//
//                if ($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') {
//                    $document_node_id = $returnArray['data']['Document'];
//                } else {
//                    $document_node_id = $document_node_id;
//                }
//                $documentData = $builderApiObj->getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
//                $documentData = json_decode($documentData, true);
//
//                $templateType = $builderApiObj->getTemplateType($document_node_id);
//                $tempArray = json_decode($templateType, true);
            $classOperationType = '';
            $class = '';
            if ($value['Operation Type'] == 'Optional')
                $classOperationType = ' throbHighlight';
            //$value['document_type'] = $tempArray['value'];
            $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="flex-grid' . $classOperationType . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                <div class="flex-col"><div class="custom-checkbox"><input checked="checked" value="' . $value['PDF Template NID'] . '" class="' . $is_editable . ' child-check-all" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox" onchange="toggleCheckallCheckbox(\'#j_my_left_flyout_print_wrapper\',\'.j_my_print_close\')"><label class="' . $is_editable . '"></label></div></div>';
                //<div class="flex-col workflow-icon">' . $_image . '</div>
            $html.= '<div class="flex-col workflow-body">
                <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                    //<p>' . $value['Description'] . '</p>
             $html.= '   </div>
            </div>';
            $count++;
        }
        elseif($value['operation_node_id']==COMPLETE_FUNDING_ID){
            $htmldata = '';
//            $mappingRoleActorInstanceId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $deal_user_role_id, $login_user_id));
//            $returnData = json_decode($builderApiObj->getDealOperationFormId($mappingRoleActorInstanceId, $value['operation_node_id']),TRUE);
            //print_r($returnData);die;
            if(isset($value['AppOneFormData']) && count($value['AppOneFormData']))
            {
                foreach($value['AppOneFormData'] as $key=>$row)
                {
                    if(isset($row['child']) && count($row['child']))
                    {
                        foreach($row['child'] as $key1=>$row1)
                        {
                            if($key1==APPONE_UNSIGNED_PROPERTY_ID)
                            {
                                if($row1['value'])
                                {
                                    $a = new SimpleXMLElement($row1['value']);
                                    if($a['href'])
                                    {
                                        $value['document_type'] = 'Appone';
                                        $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="flex-grid' . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                                            <div class="flex-col"><div class="custom-checkbox"><input checked="checked" value="' . $value['operation_node_id'] . '" class="' . $is_editable . ' child-check-all" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox" onchange="toggleCheckallCheckbox(\'#j_my_left_flyout_print_wrapper\',\'.j_my_print_close\')"><label class="' . $is_editable . '"></label></div></div>';
                                        $html.= '<div class="flex-col workflow-body">
                                            <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                                         $html.= '   </div>
                                        </div>'; 
                                    }else{
                                        $value['document_type'] = 'Appone';
                                        $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="printOperDisable flex-grid' . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                                            <div class="flex-col"><div class="custom-checkbox"><input class="' . $is_editable . '" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox" onchange="toggleCheckallCheckbox(\'#j_my_left_flyout_print_wrapper\',\'.j_my_print_close\')"><label class="' . $is_editable . '"></label></div></div>';
                                        $html.= '<div class="flex-col workflow-body">
                                            <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                                         $html.= '   </div>
                                        </div>'; 
                                    }
                                }else{
                                    $value['document_type'] = 'Appone';
                                    $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="printOperDisable flex-grid' . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                                        <div class="flex-col"><div class="custom-checkbox"><input class="' . $is_editable . '" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox" onchange="toggleCheckallCheckbox(\'#j_my_left_flyout_print_wrapper\',\'.j_my_print_close\')"><label class="' . $is_editable . '"></label></div></div>';
                                    $html.= '<div class="flex-col workflow-body">
                                        <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                                     $html.= '   </div>
                                    </div>'; 
                                }
                            }
                        }
                    }
                }
            }else{
                $value['document_type'] = 'Appone';
                $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="printOperDisable flex-grid' . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                    <div class="flex-col"><div class="custom-checkbox"><input class="' . $is_editable . '" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox" onchange="toggleCheckallCheckbox(\'#j_my_left_flyout_print_wrapper\',\'.j_my_print_close\')"><label class="' . $is_editable . '"></label></div></div>';
                $html.= '<div class="flex-col workflow-body">
                    <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                 $html.= '   </div>
                </div>'; 
            }
            $count++;
        }
        else{
//            $document_node_id = $value['PDF Template NID'];
//            $operation_node_id = $value['operation_node_id'];
//            $mappingRoleActorInstanceId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $deal_user_role_id, $login_user_id));
//            $returnData = $builderApiObj->getDealOperationFormId($mappingRoleActorInstanceId, $operation_node_id);
//            $returnArray = json_decode($returnData, true);
//
//            if ($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') {
//                $document_node_id = $returnArray['data']['Document'];
//            } else {
//                $document_node_id = $document_node_id;
//            }
//            $documentData = $builderApiObj->getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
//            $documentData = json_decode($documentData, true);
//
//            $templateType = $builderApiObj->getTemplateType($document_node_id);
//            $tempArray = json_decode($templateType, true);
            $classOperationType = '';
            $class = '';
            if ($value['Operation Type'] == 'Optional')
                $classOperationType = ' throbHighlight';
            $value['document_type'] = $tempArray['value'];
            $html.= '<div data-operation-type="' . $value['Operation Type'] . '" class="printOperDisable flex-grid' . $classOperationType . ' clearfix' . $_checkBoxStatusCls . '' . $last . '" id="opration_id_' . $value['operation_node_id'] . '" data-operation-id="' . $value['operation_node_id'] . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $_classpidValue . '" data-document="' . $value[$pdfTitle] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '">
                <div class="flex-col"><div class="custom-checkbox"><input value="' . $value['PDF Template NID'] . '" class="' . $is_editable . '" ' . $_dataId . ' ' . $_checkBoxStatus . ' type="checkbox"><label class="' . $is_editable . '"></label></div></div>';
                //<div class="flex-col workflow-icon">' . $_image . '</div>
                $html.= '<div class="flex-col workflow-body">
                    <h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>';
                        //<p>' . $value['Description'] . '</p>
                 $html.= '   </div>
                </div>';
            $count++;
        }

    }
    $html.= '</div>';
    $operationListArr['msg'] = $html;
}else {
    $operationListArr['status'] = 0;
    $operationListArr['msg'] = "No operation with print document found";
}

//print_r($operationListArr);die;
//echo '<pre>';print_r($operationListArr); die();
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $operationListArr;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
//print json_encode($operationListArr);
//exit;