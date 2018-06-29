<?php
$deal_instance_node_id                  = $post['deal_instance_node_id'];
$status                                 = 'Incompleted';
$propertyId                             = '6354';
$deleteArray                            = array();

/* Server side validation*/
$_permission                            = getOperationActionPermission($post['deal_actor_role_node_id'], $deal_instance_node_id);
if(in_array('Can Add',$_permission)){
    if(1){
        $final_manage_array['op_list']  = array();
        $post['node_class_id']          = MAPPING_ROLE_ACTOR_CLASS_ID;
        $post['node_class_property_id'] = DEAL_PID;
        $post['value']                  = $deal_instance_node_id;
        
        $manage_opt_operation_array     = json_decode($builderApiObj->manageOptionalOperation($post), true);
        $operation_list_array           = $manage_opt_operation_array['optional_operation_list'];    
        $mappingRoleActorPersonal       = $manage_opt_operation_array['mapping_role_actor_personal'];
        $mappingRoleActorInstances      = $manage_opt_operation_array['manage_role_actor_instances'];
        $list                           = $manage_opt_operation_array['list'];
        $resData                        = $manage_opt_operation_array['operation_result_array'];
        $operationArray                 = $manage_opt_operation_array['operation_array'];

        if(count($operationArray) > 0)
        {
            foreach ($list as $k => $v) 
            {
                foreach($operationArray as $key => $array)
                {
                    if(intVal($array["Mapping_Role_Actor"]) == intVal($v["mappingRoleActor"]) && intVal($array["Operation"]) == intVal($v["operationId"]))
                    {
                        $list[$k]['node_instance_id']           = $key ? $key : '';
                        $list[$k]['Document']                   = $key ? $array["Document"] : '';
                        $list[$k]['Form']                       = $key ? $array["Form"] : '';
                        if(trim($array["Status"]) != '')
                        $list[$k]['Status']                     = $key ? $array["Status"] : '';
                        else
                        $list[$k]['Status']                     = $key ? $status : '';    
                    }
                }
            }
        }
        else
        {
            foreach($list as $k => $v)
            {
                $list[$k]['node_instance_id']           = '';
                $list[$k]['Document']                   = '';
                $list[$k]['Form']                       = '';
                $list[$k]['Status']                     = $status;    
            }
        }
        
        /* For Inserting Optional Operations If not exist in DB*/
        $insertOperation = $list;
        $op_id_array = array_column($list, 'operationId');
        foreach($operationArray as $listk => $listv){
            $deletekey = array_search($listv['Operation'], $op_id_array);
            if(trim($deletekey) != ''){
                unset($insertOperation[$deletekey]);
            }
        }

        /* For Deleting Optional Operations */
        $delOperationArray          = array();
        $settingArray               = array();
        
        $op_id_array    = array_unique(array_column($list, 'operationId'));
        $listTempArray  = is_array($op_id_array) ? $op_id_array : array();

        $mapColumn      = array_column($mappingRoleActorInstances, intval(ROLE_PID));

        foreach ($resData as $key => $array) 
        {   
            if($array['Mapping_Role_Actor'] == $mappingRoleActorPersonal && !in_array($array['Operation'], $listTempArray)) {
                $resData1   = $operation_list_array[$array["Operation"]];   
                // owned by
                $ownedBy        = explode(',',$resData1['Owned By']);            
                $matchMapColumn = array_intersect($mapColumn,$ownedBy);
                $arrKeys        = array_keys($mappingRoleActorInstances);

                foreach($matchMapColumn as $k1 => $v1) {
                    $settingArray[] = $arrKeys[$k1];
                }
                
                foreach ($resData as $key1 => $array1) 
                {
                    if(in_array($array['Mapping_Role_Actor'],$settingArray) && $array['Operation'] == $array1['Operation']) {
                        $delOperationArray[]       = $key1;
                    }
                }
            }
        }
        
        $final_manage_array['delOperation'] = $delOperationArray;
        $final_manage_array['op_list']      = $insertOperation;
        $final_manage_array['propertyId']   = $propertyId;    
        $builderApiObj->manageOptionalOperationInstance($final_manage_array);

        $json['status']                     = 1;
        $json['message']                    = "";
        header('Content-Type: application/json');
        print json_encode($json);
        exit; 
    }else{
        $deal_node_instance_id                  = $post['deal_node_instance_id'];
        $deal_actor_role_node_id                = $post['deal_actor_role_node_id'];
        $login_user_id                          = $post['login_user_id'];
        $list                                   = $post['list'];
        /*$instanceData                           = $builderApiObj->getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, 'all', 'none','Optional');
        $instanceArray                          = json_decode($instanceData, true);*/

        $dealData                           = $builderApiObj->getInstanceListOfParticulerClass($deal_node_instance_id, 'instance', 'node_instance_id');
        $dealData                           = json_decode($dealData, true); 
        $boatLength                         = explode("'",current($dealData['data'])['Length']);
        $deal_instance_id = $builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($deal_instance_node_id));
        $deal_instance_id = json_decode($deal_instance_id, true)['node_instance_id'];
        $operation_list_param_array = array(
                                        'role_node_id'          => $deal_actor_role_node_id,
                                        'node_instance_id'      => $deal_instance_id,
                                        'optional_operation'    => 'yes', );
        $instanceData   = $builderApiObj->getOperationList($operation_list_param_array);
        $temOptArr  = json_decode($instanceData, true);
        if($boatLength[0] >= 35)
        {
            unset($temOptArr[VANTAGE2K_OPERATION_NID]);
        }elseif($boatLength[0] < 35)
        {
            unset($temOptArr[VANTAGE4K_OPERATION_NID]);
        }

        /*$temOptArr=array();
        foreach($instanceArray['data'][0] as $key=>$val){

        if($val['Operation Type']=='Optional'){
                $temOptArr[$key]=$val;
        }

        }*/
        $instanceArray['data'][0]=$temOptArr;
        //$optionalOperationArray                 = $instanceArray['data'][0];


        $mappingRoleActorPersonal                       = current($list)['mappingRoleActor'];

        if(trim($mappingRoleActorPersonal) == '')
        {
            $mappingRoleActorPersonal                   = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $deal_actor_role_node_id, $login_user_id));
        }
        // Get all mapping role actor ids for a DEAL
        $data['node_class_id']          = MAPPING_ROLE_ACTOR_CLASS_ID;  // node class id
        $data['node_class_property_id'] = DEAL_PID;                     // node class property id array
        $data['value']                  = $deal_instance_node_id;       // class property values array respectively
        $mappingRoleActorInstances      = json_decode($builderApiObj->searchPropertyValueInAllClassInstances($data), true);
        $mappingRoleActor               = array_keys($mappingRoleActorInstances);

        // get owned by
        // get roles from MappingRoleActor
        // create list array to insert/update/delete Mapping Deal Operation
        $newList = array();
        foreach($list as $ky => $lt) {
            $res1                                    = $builderApiObj->getInstanceListOfParticulerClass($lt["operationId"], 'node', 'node_instance_id');
            $resData1                                = json_decode($res1, true);
            $ownedByIds                              = current($resData1['data'])['Owned By'];
            $list[$ky]['Owned By']                   = $ownedByIds;
            foreach(explode(',',$ownedByIds) as $ownBy) {
                $mapRlActor = array_search($ownBy, array_column($mappingRoleActorInstances, intval(ROLE_PID)));
                $mapKey = array_keys($mappingRoleActorInstances)[$mapRlActor];
                $newList[] = array('operationId' => $lt['operationId'], 'mappingRoleActor' => $mapKey);//, 'Owned By' => $ownBy);
            }
            unset($list[$ky]);
        }
        $list = $newList;

        $res                                    = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');
        $resData                                = json_decode($res, true);

        $operationArray                         = array();
        $delOperationArray                      = array();


        foreach ($resData['data'] as $key => $array) 
        {
            $tempMappingRoleActorInstances = $mappingRoleActorInstances;
            $res1                                    = $builderApiObj->getInstanceListOfParticulerClass($array["Operation"], 'node', 'node_instance_id');
            $resData1                                = json_decode($res1, true);

            // owned by
            $ownedBy                    = explode(',',current($resData1['data'])['Owned By']);
            $mapColumn = array_column($tempMappingRoleActorInstances, intval(ROLE_PID));
            $diffMapColumn = array_diff($mapColumn,$ownedBy);

            $arrKeys = array_keys($tempMappingRoleActorInstances);
            foreach($diffMapColumn as $k1 => $v1) {
                unset($tempMappingRoleActorInstances[$arrKeys[$k1]]);
            }

            $tempMappingRoleActorInstancesKeys = array_keys($tempMappingRoleActorInstances);
            //if ($array["Mapping_Role_Actor"] == $mappingRoleActor) {
            if (in_array($array["Mapping_Role_Actor"], $tempMappingRoleActorInstancesKeys)) {

                $operationArray[$key]       = $array;
                /*if(current($resData1['data'])['Operation Type'] != 'Required'){
                    $operationArray[$key]       = $array;
                }*/
            }
            //print_r(array($array["Mapping_Role_Actor"],$ownedBy,$tempMappingRoleActorInstancesKeys,$operationArray,$delOperationArray));
        }

        if(count($operationArray) > 0)
        {
            foreach ($list as $k => $v) 
            {
                foreach($operationArray as $key => $array)
                {
                    if(intVal($array["Mapping_Role_Actor"]) == intVal($v["mappingRoleActor"]) && intVal($array["Operation"]) == intVal($v["operationId"]))
                    {
                        $list[$k]['node_instance_id']           = $key;
                        $list[$k]['Document']                   = $array["Document"];
                        $list[$k]['Form']                       = $array["Form"];
                        if(trim($array["Status"]) != '')
                        $list[$k]['Status']                     = $array["Status"];
                        else
                        $list[$k]['Status']                     = $status;    
                    }
                }
            }
        }
        else
        {
            foreach($list as $k => $v)
            {
                $list[$k]['node_instance_id']           = '';
                $list[$k]['Document']                   = '';
                $list[$k]['Form']                       = '';
                $list[$k]['Status']                     = $status;    
            }
        }

        foreach($list as $k => $v)   
        {
            if(!isset($v['node_instance_id']))
            {
                $list[$k]['node_instance_id']           = '';
                $list[$k]['Document']                   = '';
                $list[$k]['Form']                       = '';
                $list[$k]['Status']                     = $status;
            }
        }


        /* For Deleting Optional Operations */
        $delOperationArray          = array();
        $listTempArray              = array();
        $settingArray               = array();
        foreach($list as $k => $v)
        {
            $listTempArray[] = $v['operationId'];
        }

        $listTempArray = array_unique($listTempArray);

        foreach ($resData['data'] as $key => $array) 
        {
            if($array['Mapping_Role_Actor'] == $mappingRoleActorPersonal && !in_array($array['Operation'],$listTempArray)) {

                $tempMappingRoleActorInstances           = $mappingRoleActorInstances;
                $res1                                    = $builderApiObj->getInstanceListOfParticulerClass($array["Operation"], 'node', 'node_instance_id');
                $resData1                                = json_decode($res1, true);

                if(current($resData1['data'])['Operation Type'] != 'Required')
                {
                    // owned by
                    $ownedBy                    = explode(',',current($resData1['data'])['Owned By']);
                    $mapColumn                  = array_column($tempMappingRoleActorInstances, intval(ROLE_PID));
                    $matchMapColumn              = array_intersect($mapColumn,$ownedBy);

                    $arrKeys = array_keys($tempMappingRoleActorInstances);


                    foreach($matchMapColumn as $k1 => $v1) {
                        $settingArray[] = $arrKeys[$k1];
                    }

                    foreach ($resData['data'] as $key1 => $array1) 
                    {
                        if(in_array($array['Mapping_Role_Actor'],$settingArray) && $array['Operation'] == $array1['Operation']) {
                            $delOperationArray[]       = $key1;
                        }
                    }
                
                }
            }
        }

        foreach($delOperationArray as $key => $value)
        {
            $deleteInsResponse      = $builderApiObj->deleteInstance($value);
            $deleteInsResponseArr   = json_decode($deleteInsResponse, true);
        }


        foreach($list as $key => $value)   
        {
            if(!isset($value['node_instance_id']))
            {
                $list[$k]['node_instance_id']           = '';
                $list[$k]['Document']                   = '';
                $list[$k]['Form']                       = '';
                $list[$k]['Status']                     = $status;
            }
            $datArray                           = array();
            $datArray['node_instance_id']       = $value['node_instance_id'];
            $datArray['node_class_id']          = MAPPING_DEAL_OPERATION_CLASS_ID;
            $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID,FORM_PID,$propertyId);
            $datArray['value']                  = array($value['mappingRoleActor'], $value['operationId'],$value['Document'],$value['Form'], $value['Status']);
            $datArray['is_email']               = 'N';
            $datArray['status']                 = 'P';
            $returnRes                          = $builderApiObj->setDataAndStructure($datArray, '1', '6');
            $returnRes                          = json_decode($returnRes, true);
        }            

        $json['status'] = 1;
        header('Content-Type: application/json');
        print json_encode($json);
        exit;
    }
}
else
{
    $json['status']                 = 0;
    $json['message']                = "You can't save or delete optional operation.";
    header('Content-Type: application/json');
    print json_encode($json);
    exit;
}


?>