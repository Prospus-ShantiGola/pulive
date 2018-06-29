<?php

//echo "<pre>";print_r($post);
/* Get Operation List Array */
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
$menu_instance_node_id = '1614957'; //'439819';
$mapping_class_node_id = json_decode($post['list_mapping_id_array'], true);
$login_user_id = $post['login_user_id'];
$fieldname = $post['fieldname'];

/* 17 Nov, 2016 Code By Arvind */
$dealData = $builderApiObj->getInstanceListOfParticulerClass($deal_node_instance_id, 'instance', 'node_instance_id');
$dealData = json_decode($dealData, true);
$dealType = current($dealData['data'])['Deal Type'];
$json['dealType'] = $dealType;


$instanceData = $builderApiObj->getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, $status, $propertyId, 'Required', $fieldname);

$instanceArray = json_decode($instanceData, true);
//echo '<pre>'; print_r($instanceArray['data'][0]);die();
/* This Code Arrenge The Operation By Sequence */
@uasort($instanceArray['data'][0], "cmp");

$json['data'] = $temArr;
$html = '<div class="customScroll mid-section-HT"><div class="upload-doc-section" id="id_detail_content"> 
                    <form method="POST" enctype="multipart/form-data" name="uploadOPerationDocument" id="uploadOperationDocument" action="#">
                        <div class="upload-wrap">
                           <div class="prs_row_append">
                                <input type="file" class="filestyle operation_documentarr" name="operation_document[]"/>
                               <div class="upload-right-pane">
                                    <span class="add-more-file prs_add_new_list"><i class="prs-icon add"></i></span>
                                </div>
                           </div>
                        </div>
                        <input type="hidden" readonly name="operation_id" id="operation_id">
                     </form>      
                        <div class="list-view" >
                            <ul>';
foreach ($instanceArray['data'][0] as $key => $val) {
    $class  = '';
    if($val['Operation Type']=="Optional"){
        $class  = 'optional-operation';
    }
    $html.='<li class="'.$class.'"><a href="javascript:void(0)">
                        <div class="custom-radio"><input type="radio" name="seleced_operation" class="seleced_operation" value="' . $key . '"><label>' . $val['Name'] . '</label></div> 
                     </a></li>';
}

$html.=' </ul>
                        </div>
                   
                </div></div>
                <script>$(document).ready(function(){
                            $(".seleced_operation").click(function(){
                                var operation_id = $("input:radio[name=seleced_operation]:checked" ).val();
                                $("#operation_id").val(operation_id);
                            });
                        });</script>';
$json['content_detail'] = $html;
$json['actions'] = '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
                    <i class="prs-icon dialogue"></i>
                    <br>
                    <span>Dialogue</span>
                    </a><a href="#" class="operation_save_document_btn" onclick="saveOperationalDocuments()">
                <i class="prs-icon save"></i>
                <br>
                <span>Save</span>
            </a>
            <a href="#" class="tooltip-item j_my_createDeal_close">
                <i class="prs-icon icon_close"></i>
                <br>
                <span>Cancel</span>
            </a>';


//echo "<pre>";print_r($json);die;

$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;

?>
