<?php

include "config.php";

class builderApi {

    private $web_api_url = WEB_API_URL;

    public function callWebApi($api, $postvars) {
        $url = $this->web_api_url . $api;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
        curl_setopt($ch, CURLOPT_USERPWD, "marc:jf53RjhB");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch,CURLOPT_ENCODING , "");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
        $response = curl_exec($ch);

        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($http_status != 200) {
            $response = "Error $http_status";
        }

        curl_close($ch);

        return $response;
    }

    public function callMapApi($api, $postvars) {
        $start_time = microtime(true);
        $url = $api;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERPWD, "marc:jf53RjhB");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch,CURLOPT_ENCODING , "");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
        $response = curl_exec($ch);

        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($http_status != 200) {
            $response = "Error $http_status";
        }

        curl_close($ch);
        $end = microtime(true) - $start_time;
        return $response;
    }

    public function callCurl($apiUrl) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch,CURLOPT_ENCODING , "");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
        $data = curl_exec($ch);
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $data;
    }

    public function getDataAndStructure($node_id, $action_id, $structure_id) {
        $data = array('node_id' => $node_id, 'action_id' => $action_id, 'structure_id' => $structure_id);
        $options = http_build_query($data);
        return $this->callWebApi('getStructure', $options);
    }

    public function setDataAndStructure($dataArray, $action_id, $structure_id) {
        $data = array('data' => $dataArray, 'action_id' => $action_id, 'structure_id' => $structure_id);
        $options = http_build_query($data);
        return $this->callWebApi('setStructure', $options);
    }

    public function getFormStructure($instance_id) {
        $data = array('node_id' => $instance_id);
        $options = http_build_query($data);
        return $this->callWebApi('getFormStructure', $options);
    }

    public function updateDealPhase($data) {
        $options = http_build_query($data);
        return $this->callWebApi('updateDealPhase', $options);
    }

    public function getDataOfMenuInstance($node_id) {
        $data = array('node_id' => $node_id);
        $options = http_build_query($data);
        return $this->callWebApi('getDataOfMenuInstance', $options);
    }

    public function getPropertyInstanceWithCount($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getPropertyInstanceWithCount', $options);
    }

    public function getDealAppOneInfo($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getDealAppOneInfo', $options);
    }

    public function getDealOperationInfo($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getDealOperationInfo', $options);
    }

    public function getFiQuoteValue($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getFiQuoteValue', $options);
    }

    public function getMenuCount($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getMenuCount', $options);
    }

    public function getListHeader($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getListHeader', $options);
    }

    public function getDataOfList($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getDataOfList', $options);
    }

    public function getFilterCounts($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getFilterCounts', $options);
    }

    public function getClassInstanceValues($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getClassInstanceValues', $options);
    }

    public function getInstanceViewStructure($nodeId) {
        $data = array('node_id' => $nodeId);
        $options = http_build_query($data);
        return $this->callWebApi('getInstanceViewStructure', $options);
    }

    public function getInstanceEditStructure($instanceId) {
        $data = array('instance_id' => $instanceId);
        $options = http_build_query($data);
        return $this->callWebApi('getInstanceEditStructure', $options);
    }

    public function getInstancesOfOperationRole($class_node_id, $login_role_id, $instance_id = '') {
        $data = array('class_node_id' => $class_node_id, 'login_role_id' => $login_role_id, 'instance_id' => $instance_id);
        $options = http_build_query($data);

        return $this->callWebApi('getInstancesOfOperationRole', $options);
    }

    public function getActorList($search_string, $domain_name,$search_role_id) {
        $data = array('search_string' => $search_string, 'domain_name' => $domain_name,'search_role_id' => $search_role_id);
        $options = http_build_query($data);

        return $this->callWebApi('getActorList', $options);
    }

    public function getActorWithRoleAndDeal($instanceId) {
        $data = array('instanceId' => $instanceId);
        $options = http_build_query($data);

        return $this->callWebApi('getActorWithRoleAndDeal', $options);
    }

    public function getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id, $login_user_id, $deal_instance_node_id,$status,$propertyId,$operation_type,$field_name,$menu_list=false,$boatLength) {
        
        if(trim($operation_type) == '')
        {
            $operation_type = "Required";
        }

        $data    = array('deal_node_instance_id' => $deal_node_instance_id, 'deal_actor_role_node_id' => $deal_actor_role_node_id,
                        'mapping_class_node_id' => $mapping_class_node_id, 'login_user_id' => $login_user_id, 'deal_node_id' => $deal_instance_node_id,
                        'status'=>$status, 'propertyId'=>$propertyId,'operation_type' => $operation_type,'fieldname' => $field_name,'menu_list'=>$menu_list, 'roleId' => $deal_actor_role_node_id, 'boatLength' => $boatLength);
        $options = http_build_query($data);

        return $this->callWebApi('getOperationListByRoleAndDealPaymentType', $options);
    }

    public function getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id, $operation_node_id) {
        $data = array('document_node_id' => $document_node_id, 'deal_instance_node_id' => $deal_instance_node_id, 'deal_user_role_id' => $deal_user_role_id, 'login_user_id' => $login_user_id, 'mapping_class_node_id' => $mapping_class_node_id, 'operation_node_id' => $operation_node_id);
        $options = http_build_query($data);

        return $this->callWebApi('getDocumentData', $options);
    }

    public function getFileRulesetArray($css_node_id) {
        $data = array('css_node_id' => $css_node_id);
        $options = http_build_query($data);
        return $this->callWebApi('getFileRulesetArray', $options);
    }

    public function setDocumentDataAndStructure($dataArray, $action_id, $structure_id) {
        $data = array('data' => $dataArray, 'action_id' => $action_id, 'structure_id' => $structure_id);
        $options = http_build_query($data);
        return $this->callWebApi('setDocumentStructure', $options);
    }

    public function getAllClassInstance($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getAllClassInstance', $options);
    }

    public function getInstanceDataByPropertyValue($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getInstanceDataByPropertyValue', $options);
    }

    public function manageInstanceBySpreadsheet($data) {
        $options = http_build_query($data);
        return $this->callWebApi('manageInstanceBySpreadsheet', $options);
    }

    public function manageInstanceFileBySpreadsheet($data) {
        $options = http_build_query($data);
        return $this->callWebApi('manageInstanceFileBySpreadsheet', $options);
    }

    public function getNewNodeId() {
        $options = '';
        return $this->callWebApi('getNewNodeId', $options);
    }

    /* Divya Rajput */

    public function checkMappingDealOperationNodeID($deal_node_instance_id, $deal_user_role_node_id, $login_user_id) {
        $data = array('deal_node_instance_id' => $deal_node_instance_id, 'deal_user_role_node_id' => $deal_user_role_node_id, 'login_user_id' => $login_user_id);
        $options = http_build_query($data);

        return $this->callWebApi('checkMappingDealOperationNodeID', $options);
    }

    /* End Here */

    public function getDealOperationFormId($mappingRoleActorInstanceId, $operation_id, $nodeInstance = '') {
        $data = array('mappingRoleActorInstanceId' => $mappingRoleActorInstanceId, 'operation_id' => $operation_id, 'nodeInstance' => $nodeInstance);
        $options = http_build_query($data);
        return $this->callWebApi('getDealOperationFormId', $options);
    }

    public function getMappingRoleActorStructure($mapping_role_actor_node_id, $login_user_id) {
        $data = array('mappingRoleActorNodeId' => $mapping_role_actor_node_id, 'loginUserId' => $login_user_id);
        $options = http_build_query($data);
        return $this->callWebApi('getMappingRoleActorStructure', $options);
    }

    public function getParticulerColumnValue($table, $primary_col, $primary_val, $return_val) {
        $data = array('table' => $table, 'primary_col' => $primary_col, 'primary_val' => $primary_val, 'return_val' => $return_val);
        $options = http_build_query($data);
        return $this->callWebApi('getParticulerColumnValue', $options);
    }

    public function getUserProfile($node_id, $node_class_id) {
        $data = array('node_id' => $node_id, 'node_class_id' => $node_class_id);
        $options = http_build_query($data);
        return $this->callWebApi('getUserProfile', $options);
    }

    public function getRoleName($role_id) {
        $data = array('role_id' => $role_id);
        $options = http_build_query($data);
        return $this->callWebApi('getRoleName', $options);
    }

    public function getEmailTemplate($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('getEmailTemplate', $options);
    }

    public function getWkPdf($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getWkPdf', $options);
    }

    public function getReportPdf($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getReportPdf', $options);
    }

    public function getInstanceListOfParticulerClass($primaryId, $searchOn, $keyType) {
        $options = http_build_query(array('primaryId' => $primaryId, 'searchOn' => $searchOn, 'keyType' => $keyType));
        return $this->callWebApi('getInstanceListOfParticulerClass', $options);
    }

    public function deleteInstance($instance_id) {

        $data = array('instance_id' => $instance_id);
        $options = http_build_query($data);
        return $this->callWebApi('deleteInstance', $options);
    }

    public function getTableCols($colsArr, $table_name, $whereCols, $value) {
        $options = http_build_query(array('colsArr' => $colsArr, 'table_name' => $table_name, 'whereCols' => $whereCols, 'value' => $value));
        return $this->callWebApi('getTableCols', $options);
    }

    public function updateOperationStatus($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('updateOperationStatus', $options);
    }

    public function getInstanceIdByTwoValue($value1, $value2) {
        $options = http_build_query(array('value1' => $value1, 'value2' => $value2));
        return $this->callWebApi('getInstanceIdByTwoValue', $options);
    }

    public function publishDeal($dataArray, $action_id, $structure_id) {
        $data = array('data' => $dataArray, 'action_id' => $action_id, 'structure_id' => $structure_id);
        $options = http_build_query($data);
        return $this->callWebApi('publishDeal', $options);
    }

    public function insertClassProperty() {
        return $this->callWebApi('insertClassProperty', '');
    }

    public function getInstanceIdOfSubClass($class_id, $y_instance_node_id) {
        $data = array('class_id' => $class_id, 'y_instance_node_id' => $y_instance_node_id);
        $options = http_build_query($data);
        return $this->callWebApi('getInstanceIdOfSubClass', $options);
    }

    public function getVisibleNRequiredRoles($roleId = '', $classPId = '') {
        $data = array('roleId' => $roleId, 'classPId' => $classPId);
        $options = http_build_query($data);
        return $this->callWebApi('getVisibleNRequiredRoles', $options);
    }

    public function getDealPermissions($roleId = '', $classPId = '') {
        $data = array('roleId' => $roleId, 'classPId' => $classPId);
        $options = http_build_query($data);
        return $this->callWebApi('getDealPermissions', $options);
    }

    /*public function getAllClassList($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getAllClassList', $options);
    }*/

    public function getClassPropertyStrVal($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getClassPropertyStrVal', $options);
    }

    public function getNodeXOfParticulerClass($id, $fieldEqualTo, $fieldSend, $node_class_id) {
        $data = array('id' => $id, 'fieldEqualTo' => $fieldEqualTo, 'fieldSend' => $fieldSend, 'node_class_id' => $node_class_id);
        $options = http_build_query($data);
        return $this->callWebApi('getNodeXOfParticulerClass', $options);
    }

    public function getSubClassStrLayout($post) {

        $options = http_build_query($post);
        return $this->callWebApi('getSubClassStrLayout', $options);
    }

    public function getSubClassStrLayoutView($post) {

        $options = http_build_query($post);
        return $this->callWebApi('getSubClassStrLayoutView', $options);
    }

    public function saveSubClassStrLayout($post) {


        $options = http_build_query($post);
        return $this->callWebApi('saveSubClassStrLayout', $options);
    }

    public function deleteNodeInstance($instance_node_id) {

        $data = array('instance_node_id' => $instance_node_id);
        $options = http_build_query($data);
        return $this->callWebApi('deleteNodeInstance', $options);
    }

    public function saveFile($post) {


        $options = http_build_query($post);
        return $this->callWebApi('saveFile', $options);
    }

    public function getCanvasData($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getCanvasData', $options);
    }

    public function updateDealInstance($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('updateDealInstance', $options);
    }

    public function getClassPropertyList($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getClassPropertyList', $options);
    }

    public function getTemplateType($node_instance_id) {
        $data = array('node_instance_id' => $node_instance_id);
        $options = http_build_query($data);
        return $this->callWebApi('getTemplateType', $options);
    }

    public function checkPerformaceReviewDocId($data) {
        $options = http_build_query($data);
        return $this->callWebApi('checkPerformaceReviewDocId', $options);
    }

    public function setPerformanceReview($dataArray, $action_id, $structure_id) {
        $data = array('data' => $dataArray, 'action_id' => $action_id, 'structure_id' => $structure_id);
        $options = http_build_query($data);
        return $this->callWebApi('setPerformanceReview', $options);
    }

    public function rejectDeal($data = array()) {
        $options = http_build_query(array('data' => $data));
        return $this->callWebApi('rejectDeal', $options);
    }

    public function dealRejection($data = array()) {
        $options = http_build_query(array('data' => $data));
        return $this->callWebApi('dealRejection', $options);
    }

    public function setLastVisitedOperation($instance_id) {
        $options = http_build_query(array('instance_id' => $instance_id));
        return $this->callWebApi('setLastVisitedOperation', $options);
    }

    public function getDealRejectionHistory($data = array()) {
        $options = http_build_query(array('data' => $data));
        return $this->callWebApi('getDealRejectionHistory', $options);
    }

    public function getFieldDataBy($individual_instance_node_id) {
        $data = array('individual_instance_node_id' => $individual_instance_node_id);
        $options = http_build_query($data);
        return $this->callWebApi('getFieldDataBy', $options);
    }

    public function getDataOfInstanceTitle($node_id) {
        $data = array('node_id' => $node_id);
        $options = http_build_query($data);
        return $this->callWebApi('getDataOfInstanceTitle', $options);
    }

    public function getOperationPermission($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getOperationPermission', $options);
    }

    public function setManageClassInstanceForRole($instanceId, $mainRoleId) {
        $data = array('instanceId' => $instanceId, 'mainRoleId' => $mainRoleId);
        $options = http_build_query($data);
        return $this->callWebApi('setManageClassInstanceForRole', $options);
    }

    public function getDealDetails($instanceId) {
        $data = array('nodeInstanceId' => $instanceId);
        $options = http_build_query($data);
        return $this->callWebApi('getDealDetails', $options);
    }

    public function checkDealInPassedByRoles($instanceId, $instanceNodeId) {
        $data = array('instanceId' => $instanceId, 'instanceNodeId' => $instanceNodeId);
        $options = http_build_query($data);
        return $this->callWebApi('checkDealInPassedByRoles', $options);
    }

    public function getSingleClassInstanceValue($data = array()) {
        $options = http_build_query(array('data' => $data));
        return $this->callWebApi('getSingleClassInstanceValue', $options);
    }

    public function checkInPassedDealsByRolesCls($controlVersionId, $toRoleId) {
        $data = array('controlVersionId' => $controlVersionId, 'toRoleId' => $toRoleId);
        $options = http_build_query($data);
        return $this->callWebApi('checkInPassedDealsByRolesCls', $options);
    }

    public function getInstanceNodeId($nodeClassId, $instanceId) {
        $data = array('nodeClassId' => $nodeClassId, 'instanceId' => $instanceId);
        $options = http_build_query($data);
        return $this->callWebApi('getInstanceNodeId', $options);
    }

    public function mapOperationFormData($property_key, $fld_property, $insId) {
        $options = http_build_query(array('property_key' => $property_key, 'fld_property' => $fld_property, 'insId' => $insId));
        return $this->callWebApi('getmapOperationFormData', $options);
    }

    public function passDeal($param) {
        $options = http_build_query($param);
        return $this->callWebApi('passDeal', $options);
    }

    public function getCurrentControl($dealInstanceNodeId) {
        $data = array('dealInstanceNodeId' => $dealInstanceNodeId);
        $options = http_build_query($data);
        return $this->callWebApi('getCurrentControl', $options);
    }


public function assignRoleOfRA($actor_node_id,$map_role_actor_node_instance_id,$pid) {
        $data = array('actor_node_id'=>$actor_node_id,'map_role_actor_node_instance_id'=>$map_role_actor_node_instance_id,'pid' => $pid);
        $options = http_build_query($data);
        return $this->callWebApi('assignRoleOfRa', $options);
    }    public function getDealSize($dealInstanceNodeId) {
        $data = array('dealInstanceNodeId' => $dealInstanceNodeId);
        $options = http_build_query($data);
        return $this->callWebApi('getDealSize', $options);
    }

    public function checkInArchivedStatus($instanceNodeId) {
        $data = array('instanceNodeId' => $instanceNodeId);
        $options = http_build_query($data);
        return $this->callWebApi('checkInArchivedStatus', $options);
    }

    public function updateDealStatus($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('updateDealStatus', $options);
    }
    public function updateDealAssignedRAName($data) {
        $options = http_build_query($data);
        return $this->callWebApi('updateDealAssignedRAName', $options);
    }
    public function updateDealSubStatus($dealInstanceId,$role_id,$dealsubStatus) {        
        $data    = array('dealInstanceId' => $dealInstanceId,'role_id' => $role_id, 'dealsubStatusId'=>$dealsubStatus);
        //print_r($data);
        $options = http_build_query($data);       
        return $this->callWebApi('updateDealSubStatus', $options);
    }
    /**
    * Created by Anil-Gupta
    * Date: 04-Dec-2016
    * Through this function restore the sub-status      
    */  
    public function restoreDealSubStatus($dealInstanceId,$dealRoleId) {
        //echo $dealInstanceId."-".$dealRoleId; die;
        $data    = array('dealInstanceId' => $dealInstanceId,'dealRoleId'=>$dealRoleId);
        
        $options = http_build_query($data);       
        return $this->callWebApi('restoreDealSubStatus', $options);
    }
    public function getDealControlRole($instanceNodeId) {
        $data = array('instance_node_id' => $instanceNodeId);
        $options = http_build_query($data);
        return $this->callWebApi('getDealControlRole', $options);
    }

    public function raRoleAssign($userId, $roleId) {
        
        $data    = array('userId' => $userId,'roleId'=>$roleId);
        $options = http_build_query($data);       
        return $this->callWebApi('raRoleAssign', $options);
    }
    public function getClassNidFromView($instance_id) {
        $data    = array('node_id' => $instance_id);
        $options = http_build_query($data);
        return $this->callWebApi('getClassNidFromView', $options);



    }
    public function getRAonDeal($roleId, $instanceNodeId) {
        
        $data    = array('roleId' => $roleId, 'instanceNodeId'=>$instanceNodeId);
        $options = http_build_query($data);       
        return $this->callWebApi('getRAonDeal', $options);
    }

    public function marinemaxIndiDelete($status) {
        
        $data    = array('status' => $status);
        $options = http_build_query($data);       
        return $this->callWebApi('marinemaxIndiDelete', $options);
    }

    public function awsS3File($data) {
        $options = http_build_query($data);

        return $this->callWebApi('awsS3File', $options);
    }
    public function getSingleValueOfAllInstanceByClass($data = array()) {
        
        $options = http_build_query($data);       
        return $this->callWebApi('getSingleValueOfAllInstanceByClass', $options);
    }

    public function getClassStructureWithHirerchy($node_y_class_id) {
        $data    = array('node_y_class_id' => $node_y_class_id);
        $options = http_build_query($data);       
        return $this->callWebApi('getClassStructureWithHirerchy', $options);
    }
    public function getRAActorName($data = array()) {

        $options = http_build_query($data);
        return $this->callWebApi('getRAActorName', $options);
    }
    public function getInstancePropertyValue($data = array()) {

        $options = http_build_query($data);
        return $this->callWebApi('getInstancePropertyValue', $options);
    }


    /*
    * Created By: Divya Rajput
    * On Date: 6th Feb 2017
    * Purpose: For Super Admin Deal's Operations
    */
    public function getOperationList($data) {
        
        $options = http_build_query($data);

        return $this->callWebApi('getOperationList', $options);
    }

    public function getOperationMenuCount($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getOperationMenuCount', $options);
    }
   
    public function locationRoleForStore($data = array()) {

        $options = http_build_query($data);
        return $this->callWebApi('locationRoleForStore', $options);

    }

    public function searchPropertyValueInAllClassInstances($data) {
        $options = http_build_query($data);

        return $this->callWebApi('searchPropertyValueInAllClassInstances', $options);
    }
    public function getCourseClassData($data = array()) {
        return $this->callWebApi('getCourseClassData', http_build_query($data));
}

    public function getPassByDealData($data) {
        $options = http_build_query($data);
        return $this->callWebApi('getPassByDealData', $options);
    }
    //Get Operation form data from backend
    public function getOperationFormData($data = array()){
        return $this->callWebApi('getOperationFormData', http_build_query($data));
    }
    
    public function getMappedClassInstanceValuewithArray($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getMappedClassInstanceValuewithArray', $options);
    }
    
    public function getDetailDocumentData($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getDetailDocumentData', $options);
    }
    
    public function getMappingInstanceListOfParticulerClass($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getMappingInstanceListOfParticulerClass', $options);
    }
    
    public function manageOptionalOperation($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('manageOptionalOperation', $options);
    }
    
    public function manageOptionalOperationInstance($data = array()){
        $data = array('deleteOperation' => $data['delOperation'], 'insertOperation' => $data['op_list'], 'propertyId' => $data['propertyId']);
        $options = http_build_query($data);
        return $this->callWebApi('manageOptionalOperationInstance', $options);
    }
    
    public function deleteOptionalOperationInstance($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('deleteOptionalOperationInstance', $options);
    }
    
    public function getViewFormStructureData($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getViewFormStructureData', $options);
    }
    
    public function getDealArchiveStatusForEdit($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getDealArchiveStatusForEdit', $options);
    }

    public function getAllDocumentHtml($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getAllDocumentHtml', $options);
    }
    
    public function getSharedDocumentForm($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getSharedDocumentForm', $options);
    }
    
    public function getFilterMenuCounts($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('getFilterMenuCounts', $options);
    }
    
    public function finalOperationList($data) {
        
        $options = http_build_query($data);

        return $this->callWebApi('finalOperationList', $options);
    }
    
    public function getDashboardData($data) {
        
        $options = http_build_query($data);

        return $this->callWebApi('getDashboardData', $options);
    }
    
    public function getEditFormStructureData($data = array()){
        $options = http_build_query($data);
        return $this->callWebApi('getEditFormStructureData', $options);
    }
    
    public function getDialogueListOfParticulerCourse($data = array()) {
        $options = http_build_query($data);
        return $this->callWebApi('getDialogueListOfParticulerCourse', $options);
    }
    public function getBlankIndividualHistoryCourses($data = array()) {
       $options = http_build_query($data);
       return $this->callWebApi('getBlankIndividualHistoryCourses', $options);
    }
    public function copyDialogueIndvHistoryToCourseIndvHistory($data = array()) {
       $options = http_build_query($data);
       return $this->callWebApi('copyDialogueIndvHistoryToCourseIndvHistory', $options);
    }
    
}

?>
