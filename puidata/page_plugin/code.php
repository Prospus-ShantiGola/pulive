<?php
include_once("config.php");
include_once("code/function_html.php");
include_once "builderApi.php";
$builderApiObj = new builderApi();

if ($_REQUEST) {
    $post = $_REQUEST;
    $action = $post['action'];

    if ($action == 'restore_deal') {
        //echo '<pre>'; print_r($post);die;
        $restoreInstanceid = $post['instance_id'];
        $restoreRoleid = $post['login_role_id'];
        $arrRes = $builderApiObj->restoreDealSubStatus($restoreInstanceid, $restoreRoleid, 'In Progress');
        header('Content-Type: application/json');
        print $arrRes;
        //print_r($arr);//die;
    } else if ($action == 'mailByApi') {

        // returning / passing
        $resJsonArr = array('status' => '1', 'message' => '');
        $resVal = sendMailFromMailApi('454674', '450187', '320084', 'return', $builderApiObj);
        $resJsonArr['data'] = $resVal;
        if ($resVal == 'error') {
            $resJsonArr['status'] = '0';
            $resJsonArr['message'] = 'Data not found.';
        }
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
        //sendMailFromMailApi($from, $to, $deal, $type, $builderApiObj);
        /**
         * Created by AnilGupta
         * Date: 05-Dec-2017
         * Add conditions for save data for on-hold reasons         
         */
    } else if ($action == 'save_onhold_form_data') {
        $lookup_role_id_of_ra = $post['lookup_role_id_of_ra'];
        $dealsubStatus = $post['onholdsection'];
        $dealInstanceId = $post['deal_instance_id'];
        $statusSubStatusPropId = DEAL_STATUS_PID . ',' . DEAL_SUB_STATUS_PID;
        header('Content-Type: application/json');
        print json_encode(array('prop_id' => $statusSubStatusPropId,
            'value' => json_decode($builderApiObj->updateDealSubStatus($dealInstanceId, $lookup_role_id_of_ra, $dealsubStatus), TRUE)['data'], 'status' => '1',
        ));
        exit;
    } else if ($action == 'updateStatus') {
        $post['role_id'] = 450187;
        $post['deal_instance_id'] = 353579;
        //$arr = $builderApiObj->updateDealStatus($post);
        //$arr = json_decode($arr, true);
        header('Content-Type: application/json');
        print $builderApiObj->updateDealStatus($post);
        exit;
    } elseif ($action == 'group') {
        $groupBy = $post['group_by'];
        $_group = json_decode($builderApiObj->getInstanceListOfParticulerClass(914, 'class', 'node_id'), TRUE)['data'];
        $resJsonArr = array('status' => '1', 'message' => '');
        $actor = array();
        foreach ($_group as $key => $value) {
            if ($groupBy == 'actor') {
                $actor[trim($value['Actor'])][trim($value['Name'])][] = trim($value['Role']);
            } elseif ($groupBy == 'role') {
                $actor[trim($value['Role'])][trim($value['Actor'])][] = trim($value['Name']);
            } elseif ($groupBy == 'group') {
                $actor[trim($value['Name'])][trim($value['Actor'])][] = trim($value['Role']);
            }
        }
        $resJsonArr['data'] = $actor;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
        //print_r($actor);
    } elseif ($action == 'commonRoles') {

        //        $_arr = json_decode($builderApiObj->getCurrentControl(1407346),TRUE)['data'];
        //        print_r($_arr['active_node_id']);
        //        die;;
        $resJsonArr = array('status' => '1', 'message' => '');
        $_roleId = $post['role_id'];
        $_commonOperation = json_decode($builderApiObj->getInstanceListOfParticulerClass(OPERATION_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
        $_roles = array();
        foreach ($_commonOperation as $key => $value) {
            $_commonRole = explode(',', $value['Role']);
            if (count($_commonRole) > 1 && in_array($_roleId, $_commonRole)) {
                foreach ($_commonRole as $_key => $_value) {
                    if ($_value != $_roleId) {
                        $_roles[$_value][] = $key;
                    }
                }
            }
        }

        $resJsonArr['data'] = $_roles;
        echo json_encode($resJsonArr);
        exit;
    } elseif ($action == 'permission') {
        $resJsonArr = array('status' => '1', 'message' => '');
        $arr = $builderApiObj->getOperationPermission($post);
        $arr = json_decode($arr, true);
        $resJsonArr['data'] = $arr;
        if (!count($arr) > 0) {
            $resJsonArr['status'] = '0';
            $resJsonArr['message'] = 'Data not found.';
        }
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } elseif ($action == 'rejectDeal') {
        include_once("code/reject_deal.php");
        exit;
        /* $arr = $builderApiObj->rejectDeal($post);
          $arr = json_decode($arr, true);
          print_r($arr); */
    } else if ($action == 'saveReason') {

        $arr = $builderApiObj->rejectDeal($post);
        //$arr = json_decode($arr, true);
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $arr;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'reasonSave') {
        $arr = $builderApiObj->dealRejection($post);
        $resArr = json_decode($arr, true);
        if ($resArr['to_role'] == ROLE_BM) {
            sendMailFromMailApi($resArr['from_role'], $resArr['to_role'], $resArr['deal_instance_id'], 'return', $builderApiObj);
        }

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $resArr;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'getAllInstance') {

        $arr = $builderApiObj->updateDealInstance();
        $arr = json_decode($arr, true);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $arr;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'record') {
        $result = json_decode($builderApiObj->getInstanceIdByTwoValue(619241, 449541), TRUE);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result['node_instance_id'];
        if ($result['node_instance_id'] == '') {
            $resJsonArr['status'] = '0';
            $resJsonArr['message'] = 'Data not found.';
        }
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'getClassInstances') {
        $data['nodeId'] = $_REQUEST['nodeId'];
        $data['searchOn'] = 'class';
        $data['keyType'] = 'node_instance_id';
        $result = $builderApiObj->getAllClassInstance($data);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'manageInstanceBySpreadsheet') {
        $data = json_decode(file_get_contents("php://input"), TRUE);

        $result = $builderApiObj->manageInstanceBySpreadsheet($data);
        $result = json_decode($result, true);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        echo json_encode($resJsonArr);
        exit;
    } else if ($action == 'uploadfile') {

        $resJsonArr = array('status' => '1', 'message' => '');
        header('Content-Type: application/json');

        foreach ($_FILES as $key => $file) {
            $newFileName = mt_rand() . '_' . $file['name'];
            //$uploadPath = __DIR__ . '/../../public/nodeZimg/';
            $return = 0;
            if ($file["tmp_name"] != '') {
                $return = $sdkApi->setFileData("public/nodeZimg/" . $newFileName, $file["tmp_name"], 'file');
                $return = 1;
            }
            //if (move_uploaded_file($file["tmp_name"], $uploadPath . $newFileName)) {
            if ($return) {
                $data['propertyValue'] = $newFileName;
                $data['nodeID'] = $post['classID'];
                $data['instanceID'] = $post['instanceID'];
                $data['propertyID'] = $post['propertyID'];
                $result = $builderApiObj->manageInstanceFileBySpreadsheet($data);
                $result = json_decode($result, true);

                $resJsonArr['data'] = $result;
                echo json_encode($resJsonArr);
            } else {
                $resJsonArr['status'] = '0';
                $resJsonArr['message'] = 'Error found.';
                echo json_encode($resJsonArr);
            }
        }
    } else if ($action == 'menu_list') {
        include_once("code/menu_list.php");
    } else if ($action == 'menu_count') {
        include_once("code/menu_count.php");
    } else if ($action == 'list_items') {
        $data = json_decode($post['list_head_array'], true);
        $setting = json_decode($post['list_setting_array'], true);

        $listData = $builderApiObj->getListHeader($data);
        $listArray = json_decode($listData, true);
        $nodeIdArray = json_decode($post['list_node_id_array'], true);
        ?>
        <div class="row">
        <?php listHeading($listArray['data'], $setting, $nodeIdArray); ?>
        </div>
        <?php
    } else if ($action == 'list_content') {
        include_once("code/list_content.php");
    } else if ($action == 'content_form') {
        $displayType = $post['display_type'];
        $instanceId = $post['instance_id'];
        $roleId = isset($post['roleId']) ? $post['roleId'] : $post['login_role_id'];
        $heading = $post['heading'];
        $add_form_instance_id = $post['add_form_instance_id'];

        $form_container = $post['form_container'];
        $json = array();
        $json['status'] = '1';
        $json['message'] = '';

        if (trim($displayType) == 'add') {
            /* Server side validation when any role add deal */
            if (intval($add_form_instance_id) != 660336) {
                include_once("code/add_form.php");
            } else if (intval($add_form_instance_id) == 660336) {
                $canDealAdd = 0;
                if ($roleId != '') {
                    $dealPermission = $builderApiObj->getDealPermissions($roleId, DEAL_PERMISSIONS_PROP_ID);
                    $dealPermissionArr = explode(',', json_decode($dealPermission, true)['data']['value']);

                    if (in_array('Can Add', $dealPermissionArr)) {
                        $canDealAdd = 1;
                    }
                }
                if ($canDealAdd) {
                    include_once("code/add_form.php");
                } else {
                    $json['status'] = 0;
                    $json['message'] = "You can't create deal.";
                }
            }
        } else if (trim($displayType) == 'view') {
            include_once("code/view_form.php");
        } else if (trim($displayType) == 'edit') {
            /* Server side validation when any role edit deal */
            if (intval($add_form_instance_id) != 660336) {
                include_once("code/edit_form.php");
            } else if (intval($add_form_instance_id) == 660336) {
                $data['instanceId'] = $instanceId;
                $dealInfoArray = json_decode($builderApiObj->getDealArchiveStatusForEdit($data), true);
                $_permission = getOperationActionPermission($roleId, $dealInfoArray['node_id']);
                if (in_array('Can Edit Deal', $_permission) || $dealInfoArray['status'] == 0 || $dealInfoArray['archiveStatus'] == 1) {
                    include_once("code/edit_form.php");
                } else {
                    $json['status'] = 0;
                    $json['message'] = "You can't edit deal.";
                }
            }
        } else if (trim($displayType) == 'roles') {
            include_once("code/add_role.php");
        }

        header('Content-Type: application/json');
        print json_encode($json);
        exit;
    } else if ($action == 'delete_instance') {
        $instanceId = $post['instance_id'];

        $deleteInsResponse = $builderApiObj->deleteInstance($instanceId);
        $deleteInsResponseArr = json_decode($deleteInsResponse, true);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $deleteInsResponseArr;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'delete_optional_operation') {

        if (1) {
            $builderApiObj->deleteOptionalOperationInstance($post);
            //print json_encode('true');
        } else {


            $ownedByArr = json_decode($builderApiObj->getInstanceListOfParticulerClass($post['operation_id'], 'node', 'node_id'), TRUE)['data'];
            $owned_by_users = current($ownedByArr)['Owned By'];
            $owned_by_users_arr = explode(',', $owned_by_users);

            $mappingRoleActorNid = array();
            $mappingRoleActor = json_decode($builderApiObj->getInstanceListOfParticulerClass(MAPPING_ROLE_ACTOR_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
            foreach ($mappingRoleActor as $key => $value) {
                if (in_array($value['Role'], $owned_by_users_arr) && $value['Deal'] == $post['deal_instance_node_id']) {
                    $mappingRoleActorNid[] = $key;
                }
            }
            $customerData = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
            $customerData = json_decode($customerData, true);
            $insIds = array();
            foreach ($customerData['data'] as $key => $value) {
                if (in_array(intval($value['Mapping_Role_Actor']), $mappingRoleActorNid) && intval($value['Operation']) == intval($post['operation_id'])) {
                    $insIds[] = $key;
                }
            }
            foreach ($insIds as $insId) {
                $instance_id = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($insId)), TRUE)['node_instance_id'];
                $result = json_decode($builderApiObj->deleteInstance($instance_id), TRUE);
            }
            //print json_encode('true');
        }

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = 'true';
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'delete_operation_attachment') {
        $insId = $post['doc_ins_id'];
        $instance_id = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($insId)), TRUE)['node_instance_id'];
        $result = json_decode($builderApiObj->deleteInstance($instance_id), TRUE);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = 'true';
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        //print json_encode('true');
    } else if ($action == 'list_pagination') {
        $dataArray = $post;
        paginationContent($dataArray);
    } else if ($action == 'searchActor') {
        $search_string = $post['search_string'];
        $domain_name = $post['domain_name'];
        $search_role_id = $post['search_role_id'];
        $json = array();

        if (trim($search_string) != '') {
            $searchData = $builderApiObj->getActorList($search_string, $domain_name, $search_role_id);
            $searchArray = json_decode($searchData, true);
            //            echo "<pre>";
            //            print_r($searchArray);
            //            die;
            $json['list'] = '<div class="customScroll mid-section-HT"><ul  class="deal-user-listing">' . getHtmlActorLayout($searchArray['data']) . '</ul></div>';
        }


        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'addRoles') {
        $instance_node_id = $post['instance_node_id'];
        $class_node_id = $post['class_node_id'];
        parse_str($post['data'], $data);
        $json = array();

        foreach ($data['mapping_role_ids'] as $key => $role_instance_node_id) {
            $dataArray = array();
            $dataArray['node_instance_id'] = $data['mapping_role_instance_ids'][$key];
            $dataArray['node_class_id'] = MAPPING_ROLE_ACTOR_CLASS_ID;
            $dataArray['node_class_property_id'] = array(ROLE_PID, ACTOR_PID, DEAL_PID);
            $dataArray['value'] = array($role_instance_node_id, $data['mapping_actor_ids'][$key], $instance_node_id);
            $dataArray['is_email'] = 'N';
            $dataArray['status'] = 'P';
            $returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');

            if($role_instance_node_id == ROLE_REVENUE_ACCOUNTANT && $data['mapping_actor_ids'][$key] != '')
            {
                $_dealRoleActor = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_ROLE_ACTOR_CLASS_ID , 'class', 'node_id');
                $_dealRoleActor = json_decode($_dealRoleActor, true);
                $_raAssign = 1;
                foreach ($_dealRoleActor['data'] as $_key => $_value) {
                    if ($_value['Role'] == $role_instance_node_id && $_value['Deal'] == $instance_node_id && $_value['Actor'] != '') {
                        $_raAssign = 0;
                        break;
                    }
                }
                if($_raAssign)
                {
                    $builderApiObj->raRoleAssign($data['mapping_actor_ids'][$key], ROLE_REVENUE_ACCOUNTANT);
                    $instance_id = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($instance_node_id)), TRUE)['node_instance_id'];
                    $subStatusValue = json_decode($builderApiObj->updateDealSubStatus($instance_id, ROLE_REVENUE_ACCOUNTANT, ''), TRUE)['data'];
                }

                // RA Actor Name to Deal Property Assigned
                $dataRA['node_instance_id'] = '';
                $dataRA['node_id'] = $instance_node_id;
                $dataRA['actor_id'] = $data['mapping_actor_ids'][$key];

                $result = json_decode($builderApiObj->updateDealAssignedRAName($dataRA), true);
            }
        }

        $class_node_id = $post['class_node_id'];
        if (trim($instance_node_id) != '' && intval($instance_node_id) > 0) {
            $instanceData = $builderApiObj->getInstancesOfOperationRole($class_node_id);
            $instanceData = json_decode($instanceData, true);
            $roleData = $builderApiObj->getActorWithRoleAndDeal($instance_node_id);
            $roleArray = json_decode($roleData, true);

            $html = getHtmlRoleLayout($instanceData['data'], $roleArray['data'], $post['login_role_id']);
            $json['content_detail'] = '<div id="content_scroler_div" class="customScroll mid-section-HT" > <div class="listing-content-wrap" >' . $html . '</div></div>';
        } else {
            $json['content_detail'] = '<div class="no-record">No Records Found</div>';
        }

        $tooltip = '<a href="#" class="tooltip-item detail-icon detailJs" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(2)">
                        <i class="prs-icon detail"></i>
                    <span>Detail</span>
                        </a>';

        $tooltip .= '<a href="#" class="tooltip-item detail-icon active" data-toggle="tooltip" data-placement="bottom" >
                        <i class="prs-icon team-member"></i>
                       <span>Team Members</span>
                        </a>';

        $tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                        <i class="prs-icon workflow"></i>
                        <span>Workflow</span>
                        </a>';

        $json['tooltip'] = $tooltip;
        $json['actions'] = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                        <i class="prs-icon dialogue"></i>
                        <br>
                        <span>Dialogue</span>
                        </a>
                        <a href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive">
                            <i class="prs-icon workspace"></i><br><span>Workspace</span>
                        </a>
                        <a href="#" onclick="saveRolesActorAndDeals()" data-placement="left" class="inactive save-role tooltip-item action-accept-invitation">
                        <i class="prs-icon save"></i>
                        <br><span>Save</span>
                        </a>';
        // TO UPDATE RA NAME IN LISTING
        $json['role_asgn_arr'] = array(
            'actor_name' => $result['data']['value'],
            'prop_id' => $result['data']['node_class_property_id'],
            'sub_status_value' => $subStatusValue,
        );

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($json);
        exit;
    } else if ($action == 'completeOperationStatus') {
        include_once("code/complete_operation.php");
    } else if ($action == 'opreratinList') {
        include_once ('code/operation_list.php');
    } else if ($action == 'getOpreratinForm') {
        include_once("code/operation_form.php");
    } else if ($action == 'operationStatus') {
        include_once("code/operation_status.php");
    } else if ($action == 'editDocument') {
        include_once("code/edit_document.php");
    } else if ($action == 'editReviewDocument') {

        //$post['node_instance_id']           = '';
        $deal_node_id = $post['deal_node_id'];
        $post['docPropertyId'] = '7830';
        $post['classId'] = '819';
        //$operation_node_id = $post['operation_id'];
        //            $post['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
        //            $post['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID);
        //            $post['value'] = array($mapping_role_actor_node_id, $operation_node_id, '#~#');
        //            $post['is_email'] = 'N';
        //            $post['status'] = 'P';

        $post['doctype'] = "Canvas";
        $post['document']['dialogue_template'] = "Canvas";


        $returnResponse = $builderApiObj->setPerformanceReview($post, '1', '6');
        $returnResponse = json_decode($returnResponse, true);


        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $returnResponse;
        header('Content-Type: application/json');
        print json_encode($resJsonArr, true);
        exit;
        //print json_encode($returnResponse, true);
        //exit;
    } else if ($action == 'viewDocument') {
        include_once("code/view_document.php");
    } elseif ($action == 'viewReviewDocument') {
        $nodeIdCssFileArr = array('496778', '495888');
        //css file:- Gaurav Dutt Panchal

        $cssArrRes = $builderApiObj->getFileRulesetArray($nodeIdCssFileArr);
        $cssArr = json_decode($cssArrRes, true);

        $node_id = "";
        $fileCssToWrite = '';

        $flag = $post['flag'];
        $document_node_id = $post['document_node_id'];
        $deal_node_id = $post['deal_instance_id'];
        $post['docPropertyId'] = '7830';
        $post['classId'] = '819';
        $docType = 'PPC';
        $mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);
        $docNodeId = json_decode($builderApiObj->checkPerformaceReviewDocId($post));



        if ($document_node_id != "") {
            // For PPC Class
            if ($docNodeId != "") {
                $document_node_id = $docNodeId;
            } else {
                $document_node_id = $document_node_id;
            }
            $json = array();
            $documentData = $builderApiObj->getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
            $documentData = json_decode($documentData, true);


            $dealInstancesArray['839021'] = $deal_node_id;

            /* $htmldata = getCanvasFormNew($builderApiObj, $dealInstancesArray, $documentData['data'][0], $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag);
              $htmldata = html_entity_decode($htmldata); */

            /*
             * Modified By Divya
             * Purpose: Call Same Function for Document as Called for details
             */
            $htmldata = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $documentData['data'][0], $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag, 'canvas', $docType);
            $htmldata = html_entity_decode($htmldata);
            /* END HERE */


            //$htmldata = getcanvasPreHtmlList($documentData['data'][0], $brokerage_node_id, $documentData['data'][1]['document'], $returnArray['data']['Document'], $flag);

            $json['content_detail'] = $htmldata;
            $json['css_file'] = $cssArr;
        } else {
            $json['content_detail'] = '<div class="no-record">Document Not Found</div>';
            $json['css_file'] = '';
        }


        $doctype = $tempArray['value'];
        $tempVal = "undefined";

        $json['head'] = 'Employee Review: Document';
        $action = '';
        $tooltip = '<a href="#" class="tooltip-item detail-icon detailJs " data-toggle="tooltip" data-placement="bottom">

                                    <i class="prs-icon detail"></i>
                                    <span>Detail</span>
                                    </a>';

        $tooltip .= '<a href="#" class="tooltip-item detail-icon active  documentJs hide " data-toggle="tooltip" data-placement="bottom" onclick="getReviewDocument();">
                                    <i class="prs-icon document"></i>
                                    <span>Document</span>
                                    </a>';

        /* $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs hide j_my_esign_open inactive" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
          <i class="prs-icon esign"></i>
          <span>E Sign</span>
          </a>'; */

        $tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                                    <i class="prs-icon workflow"></i>
                                    <span>Workflow</span>
                                    </a>';

        $json['tooltip'] = $tooltip;

        $action .= '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                                        <i class="prs-icon dialogue"></i>
                                        <br>
                                        <span>Dialogue</span>
                                    </a>';



        if (($docNodeId == "" || $docNodeId == 'N/A') && $flag == 'save') {

            $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  saveDocJs" onclick="callEditContentdocumentActionReview(this,' . $deal_node_id . ')">

                            <i class="prs-icon save"></i>
                            <br><span>Save</span>
                   </a>';
            $action .= '<a  href="#" data-placement="left" class="tooltip-item  hide_signing_cls" onclick="downloadReportPdfReview(this)" >
                                <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
            $save_type = 'save';
        }

        if (($docNodeId != "" && $docNodeId != 'N/A') && $flag == 'save') {
            if ($document_node_id != "") {

                $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  editDocJs editDocJs-view" onclick="viewDocumentDataReview(this,' . $document_node_id . ')">
        <i class="prs-icon edit"></i>
                                <br><span>Edit</span>
                    </a>';
                $action .= '<a  href="#" data-placement="left" class="tooltip-item action-download-pdf hide_signing_cls" onclick="downloadReportPdfReview(this)" >
                                <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
                $save_type = 'view';
            }
        }

        if (($docNodeId != "" && $docNodeId != 'N/A') && $flag == 'edit') {
            if ($document_node_id != "") {

                $action .= '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation  editDocJs" onclick="callEditContentdocumentActionReview(this,' . $deal_node_id . ',' . $document_node_id . ')">
                            <i class="prs-icon save"></i>
                                <br><span>Save</span>
                    </a>';
                $action .= '<a href="#" onclick="cancelFormAction();" class="tooltip-item action-accept-invitation show-confirmation">
                        <i class="prs-icon icon_close"></i>
                        <br>
                        <span>Cancel</span>
                        </a>';

                $action .= '<a  href="#" data-placement="left" class="tooltip-item action-show-popup hide_signing_cls inactive-btn" onclick="downloadReportPdfReview(this)" >
                                <i class="prs-icon pdf"></i><br><span>Download PDF</span></a>';
                $save_type = 'edit';
            }
        }

        // For Purchase Agreement operation of Sales Consultant role.
        if (trim($post['deal_user_role_id']) == '436104' && trim($post['operation_node_id']) == '449575') {
            $action .= '<a href="#" data-placement="left" class="tooltip-item print-document" ><i class="prs-icon print"></i><br><span>Print</span></a>';
        }



        $json['actions'] = $action;
        $json['save_type'] = $save_type;


        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'sendmail') {
        $tempparam = array('type' => 'sendMailAfterOpCompeleted', 'fname' => 'Ben', 'roleTitle' => 'Sales Consultant', 'dealId' => 32015, 'loginURL' => 'abc.com', 'operation' => array('name' => 'abc'), 'emailLinks' => array('emailFrom' => 'info@marinemax.com', 'privacyPolicy' => 'https://www.marinemax.com/privacy-policy.aspx', 'socailLink' => array('fb' => 'https://www.acebook.com/MarineMaxLeisure', 'twitter' => 'https://twitter.com/marinemax', 'instagram' => 'https://www.instagram.com/marinemaxonline', 'youtube' => 'https://www.youtube.com/user/MarineMaxOnline', 'logourl' => 'https://www.marinemax.com/')));
        $data = $builderApiObj->getEmailTemplate($tempparam);
        $data = json_decode($data, true);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $data['data'];
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'insertProperty') {
        //$tempparam = array('type' => 'sendMailAfterOpCompeleted', 'fname' => 'Ben', 'roleTitle' => 'Sales Consultant', 'dealId' => 32015, 'loginURL' => 'abc.com', 'operation' => array('name' => 'abc'), 'emailLinks' => array('emailFrom' => 'info@marinemax.com', 'privacyPolicy' => 'https://www.marinemax.com/privacy-policy.aspx', 'socailLink' => array('fb' => 'https://www.acebook.com/MarineMaxLeisure', 'twitter' => 'https://twitter.com/marinemax', 'instagram' => 'https://www.instagram.com/marinemaxonline', 'youtube' => 'https://www.youtube.com/user/MarineMaxOnline', 'logourl' => 'https://www.marinemax.com/')));
        $data = $builderApiObj->insertClassProperty();
        $data = json_decode($data, true);

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $data;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'document_signature') {
        $login_user_id = $post['login_user_id'];
        $res = $builderApiObj->getInstanceListOfParticulerClass($login_user_id, 'node', 'node_id');
        $resData = json_decode($res, true);
        $firstName = $resData['data'][$login_user_id]['First Name'];
        $lastName = $resData['data'][$login_user_id]['Last Name'];
        $fullName = ucwords($firstName . ' ' . $lastName);
        $initials = ucfirst($firstName[0]) . ucfirst($lastName[0]);
        //echo '<pre>';print_r($resData);die;
        ob_start();
        include('esignature.php');
        $json['content_detail'] = ob_get_contents();
        $heading = 'E sign';
        $json['head'] = $heading . ': Detail';
        $tooltip = '<a href="#" class="tooltip-item detail-icon detailJs " data-toggle="tooltip" data-placement="bottom"><i class="prs-icon detail"></i><span>Detail</span></a>';

        $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs" data-toggle="tooltip" data-placement="bottom" onclick="getDocument(this);">
                    <i class="prs-icon document"></i>
                    <span>Document</span>
                </a>';

        /* $tooltip .= '<a href="#" class="tooltip-item detail-icon documentJs active j_my_esign_open" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
          <i class="prs-icon esign"></i>
          <span>E Sign</span>
          </a>'; */

        $tooltip .= '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                    <i class="prs-icon workflow"></i>
                    <span>Workflow</span>
                </a>';

        $json['tooltip'] = $tooltip;
        $actions = '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                            <i class="prs-icon dialogue"></i>
                            <br>
                            <span>Dialogue</span>
                        </a>';
        $actions .= '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation show_signing_cls" id="startSigning">
                                <i class="prs-icon general"></i><br><span>Start Signing</span></a>';
        $actions .= '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation show_signing_cls">
                                <i class="prs-icon general"></i><br><span>Cancel Signing</span></a>';

        $json['actions'] = $actions;


        ob_end_clean();

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'getWkPdf') {
        if($post['roleId'] != '' && $post['dealId'] != '')
        {
            $_permission = getOperationActionPermission($post['roleId'], $post['dealId']);
            if(in_array('Can Download Pdf',$_permission)){
                header('Content-Type: application/json');
                $data = $builderApiObj->getWkPdf($post);
                echo $data;
                exit;
            }
            else
            {
                header('Content-Type: application/json');
                $res = array();
                $res['status'] = '0';
                $res['message'] = "You have not permission for download PDF.";
                echo json_encode($res);
                exit;
            }
        }
        else
        {
            header('Content-Type: application/json');
            $data = $builderApiObj->getWkPdf($post);
            echo $data;
            exit;
        }
    } else if ($action == 'getReportPdf') {
        header('Content-Type: application/json');
        $data = $builderApiObj->getReportPdf($post);
        echo $data;
        exit;
    } else if ($action == 'single') {
        include_once("code/create_instance.php");
    } else if ($action == 'saveWorkSpace') {
        // VALIDATION
        $canOpSave = 0;
        $control['node_id'] = json_decode($builderApiObj->getCurrentControl($post['deal_node_id']), TRUE)['data']['active_node_id'];
        $control['role_id'] = $post['login_role_id'];
        $control['permission'] = 'condition';
        $controlData = json_decode($builderApiObj->getOperationPermission($control), true);
        if (in_array('Can Save', $controlData)) {
            $canOpSave = 1;
        }
        if ($canOpSave) {
            // validation success
            include_once("code/save_work_space.php");
        } else {
            // validation failed
            header('Content-Type: application/json');
            $result = array('status' => 0, 'message' => 'You do not have privilege to perform this action.');
            print json_encode($result);
            exit;
        }
    } else if ($action == 'uploadOperationDocument') {
        include_once("code/operation_document.php");
    } else if ($action == 'editWorkSpace') {
        // VALIDATION
        $canOpEdit = 0;
        $control['node_id'] = json_decode($builderApiObj->getCurrentControl($post['deal_node_id']), TRUE)['data']['active_node_id'];
        $control['role_id'] = $post['login_role_id'];
        $control['permission'] = 'condition';
        $controlData = json_decode($builderApiObj->getOperationPermission($control), true);
        if (in_array('Can Edit', $controlData)) {
            $canOpEdit = 1;
        }
        if ($canOpEdit) {
            // validation success
            include_once("code/edit_work_space.php");
        } else {
            // validation failed
            header('Content-Type: application/json');
            $result = array('status' => 0, 'message' => 'You do not have privilege to perform this action.');
            print json_encode($result);
            exit;
        }
    } else if ($action == 'getFiStatus') {
        include_once("code/get_fi_status.php");
    } else if ($action == 'searchSalesQuote') {
        include_once("code/search_sales_quote.php");
    } else if ($action == 'selectSalesQuote') {
        include_once("code/select_sales_quote.php");
    } else if ($action == 'searchFiQuote') {
        include_once("code/search_fi_quote.php");
    } else if ($action == 'searchFiQuoteNew') {
        include_once("code/search_fi_quote_new.php");
    } else if ($action == 'searchCustomer') {
        include_once("code/search_customer.php");
    } else if ($action == 'selectCustomer') {
        include_once("code/select_customer.php");
    } else if ($action == 'searchStock') {
        include_once("code/search_stock.php");
    } else if ($action == 'selectStock') {
        include_once("code/select_stock.php");
    } else if ($action == 'searchStockEye') {
        include_once("code/search_stock_eye.php");
    } else if ($action == 'publishDeal') {
        $node_instance_id = $post['node_ins_id'];
        $node_id = $post['node_id'];
        $login_user_id = $post['login_user_id'];
        $returnResponse = $builderApiObj->publishDeal($post, '1', '6');
        $returnResponse = json_decode($returnResponse, true);
        dealMailSend($node_id, $login_user_id);


        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $returnResponse;
        header('Content-Type: application/json');
        print json_encode($resJsonArr, true);
        exit;

        //        print json_encode($returnResponse, true);
        //        exit;
    } else if ($action == 'open_flyout') {

        $data = array();
        $dataproperty = $post['dataproperty'];
        $roleId = $post['roleId'];
        $login_user_id = $post['login_user_id'];
        $tempFilter = explode("~$~", $dataproperty);
        $data['class_node_id'] = $tempFilter[1];
        $data['columns'] = array($tempFilter[2]);
        $data['node_id'] = $post['menuListInstanceId'];
        $filterArray = json_decode($filterCount, true);
        $counter = explode('~$~', $filterArray['data']);
        $statusId = $counter[1];
        $propertyArray = json_decode($builderApiObj->getListHeader($data), true)['data'];

        // find all instances of a property

        $data['property_id'] = key($propertyArray);

        $data['login_user_id'] = $login_user_id;
        $data['login_role_id'] = $roleId;
        $data['list_mapping_id_arr'] = json_decode($post['list_mapping_id_arr'], true);
        $data['admin_role_id'] = ADMIN;
        $data['node_id'] = $post['menuListInstanceId'];


        $allInstanceWithCount = $builderApiObj->getPropertyInstanceWithCount($data);
        
        //        $resJsonArr = array('status' => '1', 'message' => '');
        //        $resJsonArr['data'] = $allInstanceWithCount;
        header('Content-Type: application/json');
        print $allInstanceWithCount;
        exit;

        //        print $allInstanceWithCount;
        //        exit;
    } else if ($action == 'getSubClassStr') {
        print $builderApiObj->getSubClassStrLayout($post);

//        $resJsonArr = array('status' => '1', 'message' => '');
//        $resJsonArr['data'] = $builderApiObj->getSubClassStrLayout($post);;
//        header('Content-Type: application/json');
//        print json_encode($resJsonArr);
        exit;
    } else if ($action == 'appOneLoginIframe') {
        include_once("code/app_one_login.php");
    } else if ($action == 'appOneFilePathSave') {

        if ($post['type'] == 'on_view_time') {
            $instanceData = $builderApiObj->getInstanceListOfParticulerClass($post['id_detail_instance_id'], 'instance', 'node_instance_id');
            $instanceData = json_decode($instanceData, true);
            $tempArray = current($instanceData['data']);

            $propertyArray = array();
            $valueArray = array();
            if (trim($tempArray['Application ID']) != '') {
                $valueArray[] = $post['applicationId'];
                $propertyArray[] = $post['applicationpId'];
            }

            if (trim($tempArray['Status']) != '') {
                $valueArray[] = $post['status'];
                $propertyArray[] = $post['statuspId'];
            }

            if (trim($tempArray['Unsigned']) != '') {
                $valueArray[] = $tempArray['Unsigned'];
                $propertyArray[] = APPONE_UNSIGNED_PROPERTY_ID;
            }

            if (trim($tempArray['Signed']) != '') {
                $valueArray[] = $tempArray['Signed'];
                $propertyArray[] = 7828;
            }

            $dataArray['node_instance_id'] = $post['id_detail_instance_id'];
            $dataArray['node_class_id'] = APPONE_OPERATION_CLASS_ID;
            $dataArray['node_class_property_id'] = $propertyArray;
            $dataArray['value'] = $valueArray;
            $dataArray['is_email'] = 'N';
            $dataArray['status'] = 'P';
        } else {
            $dataArray['node_instance_id'] = $post['id_detail_instance_id'];
            $dataArray['node_class_id'] = APPONE_OPERATION_CLASS_ID;
            $dataArray['node_class_property_id'] = array(APPONE_UNSIGNED_PROPERTY_ID);
            $dataArray['value'] = array($post['fileName']);
            $dataArray['is_email'] = 'N';
            $dataArray['status'] = 'P';
        }

        $returnResponse = $builderApiObj->setDataAndStructure($dataArray, '1', '6');
        $returnResponse = json_decode($returnResponse, true);
        $instanceId = $returnResponse['data']['instance_id'];


        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $returnResponse;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;

        //print_r($returnResponse); exit;
    } else if ($action == 'checkAOApplicationStatus') {
        include_once('code/app_one_status.php');
    } /*else if ($action == 'getClassList') {
        $data['type'] = 2;
        $result = $builderApiObj->getAllClassList($data);
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        print $result;
        exit;
    }*/ else if ($action == 'getSubClassStrView') {

        print $builderApiObj->getSubClassStrLayoutView($post);
//        $resJsonArr = array('status' => '1', 'message' => '');
//        $resJsonArr['data'] = $builderApiObj->getSubClassStrLayoutView($post);
//        header('Content-Type: application/json');
//        print json_encode($resJsonArr);
        exit;
        
        //        print $builderApiObj->getSubClassStrLayoutView($post);
        //        exit;
    } else if ($action == 'getClassPropertyStrVal') {
        $data['classId'] = $_REQUEST['classId'];
        $result = $builderApiObj->getClassPropertyStrVal($data);
        
//        $resJsonArr = array('status' => '1', 'message' => '');
//        $resJsonArr['data'] = $result;
//        header('Content-Type: application/json');
//        print json_encode($resJsonArr);
//        exit;
        
        print $result;
        exit;
    } else if ($action == 'optionalOperationList') {
        
        include_once("code/optional_operation_list.php");
    } else if ($action == 'setOptOperation') {
        include_once("code/optional_operation_manage.php");
    } else if ($action == 'multiple') {
        include_once("code/create_main_plus_sub_class_instance.php");
    } else if ($action == 'deleteNodeInstance') {
        $instanceId = $post['instance_node_id'];
        $deleteInsResponse = $builderApiObj->deleteNodeInstance($instanceId);
        header('Content-Type: application/json');
        print $deleteInsResponse;
        //        $deleteInsResponseArr = json_decode($deleteInsResponse, true);
        //        print json_encode($json);
        exit;
    } else if ($action == 'saveOperationDocument') {
        include_once("code/save_operation_document.php");
    } else if ($action == 'saveFile') {

        //        echo "<pre>";
        //        print_r($_FILES);
        $post['files'] = $_FILES;
        $post['uploded_path'] = UPLOAD_URL_API;
        $res = $builderApiObj->saveFile($post);
        print $res;
        exit;
    } else if ($action == 'getCanvasData') {
        $data['nodeId'] = $_REQUEST['nodeId'];
        $result = $builderApiObj->getCanvasData($data);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        print $result;
        //        exit;
    } else if ($action == 'getClassPropertyList') {
        $data['nodeId'] = $_REQUEST['nodeId'];
        $result = $builderApiObj->getClassPropertyList($data);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        //        print $result;
        //        exit;
    } else if ($action == 'viewOperationList') {
        include_once("code/view_operation_list.php");
    } else if ($action == 'printMultipleDocument') {
        include_once("code/print_multiple_document.php");
    } else if ($action == 'getDealDetails') {
        $instanceNodeId = $post['instance_node_id'];
        $resArrRes = $builderApiObj->getDealControlRole($instanceNodeId);
        $resArr = json_decode($resArrRes, true);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $resArr;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        
        //        echo "<pre>";
        //        print_r($resArr);
    } else if ($action == 'pass_deal') {
        $param = array();
        $param['dealInstanceNodeId'] = $post['deal_instance_node_id'];
        $param['fromRole'] = $post['from_role'];
        $param['toRole'] = $post['to_role'];
        $param['loginRoleId'] = $post['login_role_id'];
        $param['loginUserId'] = $post['login_user_id'];
        $param['dealSize'] = $post['deal_size'];
        $param['dealInstanceId'] = $post['deal_instance_id'];

        $passDealContrl = $builderApiObj->passDeal($param);
        $resArr = json_decode($passDealContrl, true);
        //print_r($resArr);
        if ($resArr['to_role'] == ROLE_BM || $resArr['to_role'] == ROLE_REVENUE_MANAGER || $resArr['to_role'] == ROLE_CONTROLLER || $resArr['to_role'] == ROLE_DIRECTOR) {
            //sendMailFromMailApi($resArr['from_role'], $resArr['to_role'], $resArr['deal_instance_id'], 'pass', $builderApiObj);
        }
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $passDealContrl;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        print $passDealContrl;
        //        exit;
    } else if ($action == 'assign_role_of_RA') {
        $actor_node_id = $post['actor_node_id'];
        $map_role_actor_node_instance_id = $post['map_role_actor_node_instance_id'];
        $assignRole = $builderApiObj->assignRoleOfRA($actor_node_id, $map_role_actor_node_instance_id, ACTOR_PID);
        $assignRole = json_decode($assignRole, true);
        $builderApiObj->raRoleAssign($actor_node_id, ROLE_REVENUE_ACCOUNTANT);
        $subStatusValue = json_decode($builderApiObj->updateDealSubStatus($post['node_instance_id'], ROLE_REVENUE_ACCOUNTANT, ''), TRUE)['data'];
        // RA Actor Name to Deal Property Assigned
        $dataRA['node_instance_id'] = $post['node_instance_id'];
        $dataRA['node_id'] = '';
        $dataRA['actor_id'] = $actor_node_id;
        $result = json_decode($builderApiObj->updateDealAssignedRAName($dataRA), true);
        // TO UPDATE RA NAME IN LISTING
        $roleAsgnArr = array(
            'status' => $assignRole['data'][1],
            'actor_name' => $result['data']['value'],
            'prop_id' => $result['data']['node_class_property_id'],
            'sub_status_value' => $subStatusValue,
        );

        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $roleAsgnArr;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        print json_encode($roleAsgnArr);
        //        exit;
        /**
         * Created by AnilGupta
         * Date: 05-Dec-2017
         * Add conditions for on-hold reasons         
         */
    } else if ($action == 'onhold_form') {
        include_once("code/onhold_form.php");
    } else if ($action == 'convertpdftoimg') {

        $img = convertPdfToImg($post['appOneFilePath']);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $img;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        print json_encode($img);
        //        exit;
    } else if ($action == 'convertpdftoimgcanvas') {

        $img = convertPdfToImgCanvas($post['appOneFilePath']);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $img;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        print json_encode($img);
        //        exit;
    } else if ($action == 'find') {
        $a['href'] = "http://sta.marinemax.prospus.com/digitalclosing/appone/1033872/11.18.2016_LenderPackage_DjAdelman_UNSIGNED.pdf";
        if ($a['href']) {
            $uploadPath = __DIR__ . '/../../data/AppOnePdfImages/';
            $folderName = basename($a['href'], '.pdf');
            $fileArray = glob("$uploadPath" . $folderName . "/*");
            $newFileArray = array();
            foreach ($fileArray as $key => $value) {
                $newFileArray[] = basename($value);
            }
            natsort($newFileArray);
            foreach ($newFileArray as $key => $value) {
                $fileName = basename($value);
                echo ABS_API_URL . "data/AppOnePdfImages/$folderName/" . $fileName;
                echo "<br/>";
            }
        }
    } else if ($action == 'marinemax') {
        $data = $builderApiObj->marinemaxIndiDelete($post['type']);
        $data = json_decode($data, true);
        
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $data;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
        //        echo "<pre>";
        //        print_r($data);
        //        die;
    } else if ($action == 's3file') {
        header('Content-Type: application/json');
        $result = $builderApiObj->awsS3File($post);
        print $result;
        exit;
    } else if ($action == 'remove_old_operation_document_instances') {
        //echo $_REQUEST['operation_id'];die;
        $mappingRoleActorNid = '';
        $mappingRoleActor = json_decode($builderApiObj->getInstanceListOfParticulerClass(MAPPING_ROLE_ACTOR_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
        foreach ($mappingRoleActor as $key => $value) {
            if ($value['Role'] == $_REQUEST['role_id'] && $value['Actor'] == $_REQUEST['login_id'] && $value['Deal'] == $_REQUEST['deal_id']) {
                $mappingRoleActorNid = $key;
                break;
            }
        }
        $old_ins_arr = array();
        $mappingDealOperation = json_decode($builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
        foreach ($mappingDealOperation as $key1 => $value1) {
            if ($value1['Mapping_Role_Actor'] == $mappingRoleActorNid && $value1['Operation'] == $_REQUEST['operation_id']) {
                $tid = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($key1)), true);
                $value1['node_instance_id'] = $tid['node_instance_id'];
                $value1['node_id'] = $key1;
                $old_ins_arr[] = $value1;
            }
        }
        foreach ($old_ins_arr as $ins_id) {
            $deleteInsResponse = $builderApiObj->deleteInstance($ins_id['node_instance_id']);
            $deleteInsResponseArr = json_decode($deleteInsResponse, true);
        }

        echo '<pre>';
        print_r($old_ins_arr);
        die;
    } else if ($action == 'fiLookup') {
        // VALIDATION
        $canDealAdd = 0;
        if ($_REQUEST['mode'] == 'lookupFlyout') {
            $roleId = isset($_REQUEST['login_role_id']) ? $_REQUEST['login_role_id'] : '';
            $dealPermission = $builderApiObj->getDealPermissions($roleId, DEAL_PERMISSIONS_PROP_ID);
            $dealPermissionArr = explode(',', json_decode($dealPermission, true)['data']['value']);
            if (in_array('Can Add', $dealPermissionArr)) {
                $canDealAdd = 1;
            }
        } else {
            $canDealAdd = 1;
        }
        if ($canDealAdd) {
            include_once("code/fi_lookup.php");
        } else {
            header('Content-Type: application/json');
            $result = array('status' => 0, 'message' => 'You do not have privilege to perform this action.');
            print json_encode($result);
            exit;
        }
    } else if ($action == 'locationRole') {
        include_once("code/location_role.php");

    } else if($action == 'courseStructure'){
        include_once("code/course_structure.php");
    } else if ($action == 'migrate_course_individual_to_individual_history') {
        //$courses = json_decode($builderApiObj->getInstanceListOfParticulerClass(COURSE_CLASS_ID, 'class', 'node_id'), TRUE)['data']; 
        //echo '<pre>';print_r($courses);die;
        //foreach ($courses as $key => $course) {
            //$dialogues = json_decode($builderApiObj->getDialogueListOfParticulerCourse(array('nodeId'=> 2107378)), TRUE)['data'];
            $dialogues = json_decode($builderApiObj->getDialogueListOfParticulerCourse(), TRUE)['data'];
            echo '<pre>';
            print_r($dialogues);
        //}
        die;

        
    }else if ($action == 'find_blank_individual_history_courses') {
            $dialogues = json_decode($builderApiObj->getBlankIndividualHistoryCourses(), TRUE)['data'];
            echo '<pre>';
            print_r($dialogues);
    }else if ($action == 'copy_dialogue_indvhistory_to_course_indvhistory') {
            $dialogues = json_decode($builderApiObj->copyDialogueIndvHistoryToCourseIndvHistory(), TRUE)['data'];
            echo '<pre>';
            print_r($dialogues);
    }elseif($action=='check_email') {
        error_reporting(E_ALL);
        $envelope["from"] = "prospus.amitbhardwaj@gmail.com";
        $envelope["to"]   = "kunalprospus@gmail.com";

        //$part1["type"]              = TYPETEXT;
        //$part1["subtype"]           = "plain";

        $part2["type"]          = TYPEAPPLICATION;
        $part2["encoding"]      = ENCBINARY;
        $part2["subtype"]       = "octet-stream";
        $part2["description"]   = '';
        $part2["contents.data"] = '';

        $part3["type"]          = TYPETEXT;
        $part3["subtype"]       = "plain";
        $part3["description"]   = "description3";
        $part3["contents.data"] = "This is sample text for email.";

        $body[1] = $part3;
        $body[2] = $part2;
        $body[3] = $part3;

        echo '<pre>';
        print_r($part3);
        var_dump(imap_last_error());
        $message = imap_mail_compose($envelope, $body);
        var_dump(imap_last_error());
        var_dump($message);

        list($msgheader, $msgbody) = preg_split("#\n\s*\n#Uis", $message);
        print_r(array($msgheader, $msgbody));
        $subject = "test subject using imap";
        $to      = "kunalprospus@gmail.com";

        print_r(imap_mail($to, $subject, $msgbody, $msgheader));
        print_r(imap_last_error());
        die;
    }else {
        $data = array('status' => '0', 'message' => 'Requested action does not exits.');
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}?>
