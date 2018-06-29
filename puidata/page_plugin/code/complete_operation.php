<?php

        $dealStatusArr = json_decode($post['nipid'], true);
        $status = 'incomplete';               //complete the incomplete operation.
        $propertyId = '6354';
        $json = array();

        $deal_instance_node_id = $post['deal_instance_node_id'];
        $deal_actor_role_node_id = $post['deal_actor_role_node_id'];
        $mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);
        $login_user_id = $post['login_user_id'];




        $instanceData = $builderApiObj->getOperationListByRoleAndDealPaymentType( $dealStatusArr['deal_node_instance_id'], $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, $status, $propertyId, 'Required');

        $instanceArray = json_decode($instanceData, true);


        $res = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');
        $resData = json_decode($res, true);
        //echo "<pre>";
        //print_r($resData);
        $mappingRoleActorNodeId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_instance_node_id, $deal_actor_role_node_id, $login_user_id));

        $operationArr = array();


//follow https://docs.google.com/document/d/1bMlrmUEHPv0yGd3disRWspD9mFlJ7efCBYN_UJSHQ28/edit point no 262 code comment. 
        //[3.2.44]: Change autocheck when ring bell: We don’t want all the other operations to be auto-checked when you select complete.
        
        // foreach ($instanceArray['data'][0] as $instanceKey => $instanceVal) {

        //     // echo "instanceKey".$instanceKey.": ".print_r($instanceVal)."<br>";
        //     $operationArr[$instanceKey] = $instanceVal;
        //     $class_p_id = $propertyId;
        //     $operation_id = $instanceKey;
        //     $keyfind = '';
        //     foreach ($resData['data'] as $key => $array) {
        //         if ($array["Mapping_Role_Actor"] == $mappingRoleActorNodeId && $array["Operation"] == $instanceKey) {

        //             $keyfind = $key;
        //         }
        //     }
        //     //echo "Keyfind: ".$keyfind."<br>";
        //     if (intVal($keyfind) > 0) {

        //         $datArray = array();
        //         $datArray['node_instance_id'] = intVal($keyfind);
        //         $datArray['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
        //         $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID, FORM_PID, $class_p_id);
        //         $datArray['value'] = array($mappingRoleActorNodeId, $operation_id, $resData['data'][$keyfind]['Document'], $resData['data'][$keyfind]['Form'], 'Completed');
        //         $datArray['is_email'] = 'N';
        //         $datArray['status'] = 'P';
        //     } else {
        //         $datArray = array();
        //         $datArray['node_instance_id'] = intVal($keyfind);
        //         $datArray['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
        //         $datArray['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, $class_p_id);
        //         $datArray['value'] = array($mappingRoleActorNodeId, $operation_id, 'Completed');
        //         $datArray['is_email'] = 'N';
        //         $datArray['status'] = 'P';
        //     }


        //     $returnRes = $builderApiObj->setDataAndStructure($datArray, '1', '6');
        //     $returnRes = json_decode($returnRes, true);

        //     $_instanceid = $returnRes['data']['node_instance_id'];
        //     $_nipId = $builderApiObj->getTableCols(array('node_instance_property_id'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($_instanceid, $class_p_id));
        //     $_nipId = json_decode($_nipId, true);
        //     if (isset($_nipId['node_instance_property_id']) && !empty($_nipId['node_instance_property_id'])) {
        //         $_nipId = $_nipId['node_instance_property_id'];
        //     } else {
        //         $_nipId = '';
        //     }

        //     $returnResponse = array('instanceid' => $_instanceid, 'nipid' => $_nipId, 'status' => 'add');
        // }



       // $phaseArr = array(PHASEI => PHASEII, PHASEII => PHASEIII, PHASEIII => PHASEIII);
       // $rolePhaseArray = array(PHASEI => ROLE_BM, PHASEII => ROLE_REVENUE_ACCOUNTANT, PHASEIII => ROLE_REVENUE_MANAGER);
        /*shanti code starts */
        $instanceData = $builderApiObj->getInstanceEditStructure($dealStatusArr['deal_node_instance_id']);
        $instanceData = json_decode($instanceData, true);

        foreach ($instanceData['data'] as $instKey => $value) {
       # code...
         foreach ($value['child'] as $childkey => $childvalue) {
            # code...if
            if($childkey ==DEAL_PHASE_VERSION_PROPERTY_ID){

                $sequenceVersion= $childvalue['value'];   // deal Sequence.
            }

         }
        }

        $allSequenceInsArray = $builderApiObj->getInstanceListOfParticulerClass(MANAGE_PHASE_SEQUENCE, 'class', 'node_id');
        $allSequenceInsArray = json_decode($allSequenceInsArray, true);

        foreach($allSequenceInsArray['data'] as $seqKey=>$seqVal ){

             //if($seqVal['Current Version']=='Yes' && $seqVal['Deal Creator'] == current($dealCreatorData['data'])['Role NID']){
            if($seqKey == $sequenceVersion){
                $sequenceArr=$seqVal['Phase Sequence'];
            }

        }

        $sequenceArr=explode(",", $sequenceArr);
        $rolePhase=intVal(array_search($deal_actor_role_node_id, $sequenceArr))+2;
        $operationPhaseRes = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_PHASE_CLASS_ID, 'class', 'node_id');
        $operationPhaseData = json_decode($operationPhaseRes, true);
        foreach ($operationPhaseData['data'] as $phaseKey => $phaseArr) {
            # code...
        if(trim($phaseArr['Sequence'])==$rolePhase){
                $operationPhaseVal=$phaseKey;   //actual phase to store.
                $dealOpPhaseVal = $phaseArr['Phase'];
            }
        }
        if($rolePhase>count($sequenceArr)) {
            $dealOpPhaseVal = 'All Done';
        }

        $phaseRole= $sequenceArr[$rolePhase-1];
        /* shanti code ends */


        if (isset($dealStatusArr['instance_id']) && $dealStatusArr['instance_id'] != '') {
            $dataArray['node_instance_id'] = $dealStatusArr['instance_id'];
        } else {
            $dataArray['node_instance_id'] = '';
        }
        $dataArray['node_class_id'] = PHASE_CLASS_ID;
        $dataArray['node_class_property_id'] = array(PHASE_DEAL_P_ID, PHASE_PHASE_P_ID, PHASE_ROLE_P_ID, PHASE_STATUS_P_ID);
        //$dataArray['value'] = array($dealStatusArr['DealId'], $phaseArr[$dealStatusArr['PhaseId']], $rolePhaseArray[$phaseArr[$dealStatusArr['PhaseId']]], 'Completed');
        $dataArray['value'] = array($deal_instance_node_id, $operationPhaseVal, $phaseRole, 'Completed');
        $dataArray['is_email'] = 'N';
        $dataArray['status'] = 'P';

        // UPDATE DEAL PHASE PROPERTY
        $dbArr                              = array();
        $dpArr['node_instance_id']          = json_decode($post['nipid'],true)['deal_node_instance_id'];
        $dpArr['node_class_property_id']    = DEAL_PHASE_PROPERTY_ID;
        $dpArr['value']                     = $dealOpPhaseVal;
        $dealPhaseRes = $builderApiObj->updateDealPhase($dpArr);

        $returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');
        $returnResponse = json_decode($returnResponse, true);
        $form_node_id = $returnResponse['data']['node_id'];
       // echo $form_node_id;
        /***Start******Send Mail to user on operation**** */

        //echo $mappingRoleActorNodeId."login :".$login_user_id;
        $resMappingRoleActor = $builderApiObj->getMappingRoleActorStructure($mappingRoleActorNodeId, $login_user_id);
        $mappingRoleActorMail = json_decode($resMappingRoleActor, true);
        //        echo "<pre>test";
        //        print_r($mappingRoleActorMail);
        //        die("======+++++++++============");
        //        die("====");

        $roleTitle = $mappingRoleActorMail['data']['sender']['role_name'];
        $dealId = $mappingRoleActorMail['data']['sender']['deal'];

        $operation = $mappingRoleActorMail['data']['operation'];

        /* This Code Arrenge The Operation By Sequence */
        @uasort($operation, "cmp");
        unset($operation[max(array_keys($operation))]);
        //$operation = array_pop($operation);
        $reciever = $mappingRoleActorMail['data']['reciever'];
        $subject = 'MarineMax: Deal ' . $dealId . ' Operations Updated';
        foreach ($reciever as $key => $value) {

            $to = $value['email'];
            $tempparam = array('type' => 'sendMailAfterOpCompeleted', 'fname' => $value['first_name'], 'roleTitle' => $roleTitle, 'dealId' => $dealId, 'loginURL' => 'http://sta.marinemax.prospus.com/digitalclosing/', 'operation' => $operation, 'emailLinks' => $post['emailLinks']);
            $mailtemplate = $builderApiObj->getEmailTemplate($tempparam);
            $mailtemplate = json_decode($mailtemplate, true);
            //echo '<pre>';print_r($mailtemplate['data']);
            $body = $mailtemplate['data'];
            //                        echo $to."<br/>";
            //                        echo $subject."<br/>";


            sendMail($to, $subject, $body, $post['emailLinks']['emailFrom']);
        }

        /*         * End******Send Mail to user on operation
         * By:- Gaurav Dutt Panchal********* */
        exit;
    
?>