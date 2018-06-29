<?php
$url = ABS_API_URL;
$post['document']['statementData'] = str_replace('src="' . $url, 'src="', $post['document']['statementData']);
//$post['node_instance_id']           = '';
$mapping_role_actor_node_id = $post['deal_mapping_node_id'];
$operation_node_id = $post['operation_id'];
$post['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
$post['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID);
$post['value'] = array($mapping_role_actor_node_id, $operation_node_id, '#~#');
$post['is_email'] = 'N';
$post['status'] = 'P';
if ($post['docType'] == "1") {
    $post['doctype'] = "Canvas";
    $post['document']['dialogue_template'] = "Canvas";
} else {
    $post['doctype'] = "Document";
    $post['document']['dialogue_template'] = "Document";
}
$returnResponse = $builderApiObj->setDocumentDataAndStructure($post, '1', '6');
$returnResponse = json_decode($returnResponse, true);

// Code By Kunal
$updated_canvas_html                = $post['document']['statementData'];
$return_arr                         = getDetailDocumentMappedData($updated_canvas_html);

$detail_form_node_id                = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($post['operation_detail_node_class_id'])),TRUE)['node_id'];

$mapped_field_arr                   = array();
foreach($return_arr as $key=>$arr)
{
    $form_field_node_id             = explode('~$~',$key);
    if($form_field_node_id[0]==$detail_form_node_id)
    {
       if($arr!='')
        $mapped_field_arr[$form_field_node_id[1]] = $arr;
    }
}

if(count($mapped_field_arr) > 0)
{
    $MDOC_Data                          = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
    $MDOC_Data                          = json_decode($MDOC_Data, true);
    $node_id_of_instanse                = '';
    $form_id                            = '';

    $newUpdateInstance                  = array();
    foreach ($MDOC_Data['data'] as $key => $value) {
        if (intval($value['Mapping_Role_Actor']) == intval($mapping_role_actor_node_id) && intval($value['Operation']) == intval($operation_node_id)) {
            $node_id_of_instanse       = $key;
            $form_id                   = $value['Form'];
            $newUpdateInstance         = $value;
        }
    }

    if(intval($form_id) > 0)
    {
        $resNew                         = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'all');
        $resNew                         = json_decode($resNew, true);
        $resNew1                        = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'propertyWithHirerchy');
        $resNew1                        = json_decode($resNew1, true);

        $insId = $resNew['data']['node_instance_id'];
        $updated_prop_arr                   = array();

        foreach($mapped_field_arr as $indexKey => $indexVal)
        {
            $propAray = explode('>',$indexKey);
            if(isset($resNew1['data']['Properties'][$propAray[0]][$propAray[1]]))
                $updated_prop_arr[$resNew1['data']['Properties'][$propAray[0]][$propAray[1]]]         = $indexVal;
        }
    }
    else if((trim($form_id) == '' || trim($form_id) == 'N/A') && intval($node_id_of_instanse) > 0)
    {
        $cata                          = $builderApiObj->getInstanceListOfParticulerClass(638, 'class', 'node_id');
        $cata                          = json_decode($cata, true);

        $ope                          = $builderApiObj->getInstanceListOfParticulerClass(661, 'class', 'node_id');
        $ope                          = json_decode($ope, true);
        $node_id_of_class             = '';

        foreach($ope['data'] as $k => $va)
        {
            if($k == $operation_node_id)
            {
              foreach($cata['data'] as $kk => $vaa)
                {
                    if($kk == $va['View NID'])
                    {
                        $node_id_of_class = $vaa['HTML'];
                    }
                }
            }
        }
        $_classpid = json_decode($builderApiObj->getTableCols(array('node_class_id'), 'node-class', array('node_id'), array($node_id_of_class)),true);

        $classD                          = $builderApiObj->getClassStructureWithHirerchy($_classpid['node_class_id']);
        $classD                          = json_decode($classD, true);
        //print_r($classD['Properties']) ;

        $updated_prop_arr                   = array();
        $propArray = array();
        $propValArray = array();
        foreach($mapped_field_arr as $indexKey => $indexVal)
        {
            $propAray = explode('>',$indexKey);
            if(isset($classD['Properties'][$propAray[0]][$propAray[1]]))
            {
                $propArray[]            = $classD['Properties'][$propAray[0]][$propAray[1]];
                $propValArray[]         = $indexVal;
                $updated_prop_arr[$classD['Properties'][$propAray[0]][$propAray[1]]]         = $indexVal;
            }
        }

        $datArray                       = array();
        $datArray['node_class_id']      = $_classpid['node_class_id'];
        $datArray['node_class_property_id'] = $propArray;
        $datArray['value']              = $propValArray;
        $datArray['is_email']           = 'N';
        $datArray['status']             = 'P';


        $returnRes                      = $builderApiObj->setDataAndStructure($datArray, '1', '6');
        $returnRes                      = json_decode($returnRes, true);

        $tid = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($node_id_of_instanse)),true);

        $post1['node_instance_id']          = $tid['node_instance_id'];
        $post1['node_class_id']             = MAPPING_DEAL_OPERATION_CLASS_ID;
        $post1['node_class_property_id']    = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID,5029,6354);
        $post1['value']                     = array($newUpdateInstance['Mapping_Role_Actor'], $newUpdateInstance['Operation'], $newUpdateInstance['Document'],$returnRes['data']['node_id'],$newUpdateInstance['Status']);
        $post1['is_email']                  = 'N';
        $post1['status']                    = 'P';

        $returnResponse1 = $builderApiObj->setDataAndStructure($post1, '1', '6');
        $returnResponse1 = json_decode($returnResponse1, true);
    }
    if(count($updated_prop_arr))
    {
        foreach($updated_prop_arr as $property_key => $fld_property)
        {

            $resProp                    = $builderApiObj->mapOperationFormData($property_key,$fld_property,$insId);
            $resProp                    = json_decode($resProp, true);
            //print_r(array($property_key,$fld_property,$insId,$resProp));
//            print_r($resProp);
        }
    }
    //print_r($resProp);die;
    //print_r($mapped_field_arr);
    //print_r($resNew['data']['Properties']);
    //print_r($resNew1['data']['Properties']);
    //print_r($updated_prop_arr);
}

$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $returnResponse;
header('Content-Type: application/json');
print json_encode($resJsonArr, true);
exit;