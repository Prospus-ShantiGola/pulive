<?php
$class_node_id                              = $post['class_node_id'];
$login_role_id                              = $post['login_role_id'];
if (trim($instanceId) != '' && intval($instanceId) > 0) {
    $dealData                       = $builderApiObj->getInstanceListOfParticulerClass($instanceId, 'node', 'node_instance_id');
    $dealData                       = json_decode($dealData, true);
    $dealInstanceId = array_keys($dealData['data'])[0];
    $customerNo                     = current($dealData['data'])['Customer #'];
    $customerArray                  = array();
    $fullName                       = '';
    $email                          = '';
    
    
    // Get deal type
    $_dealType = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($dealInstanceId, DEAL_PAYMENT_TYPE_PROPERTY_ID)), TRUE)['value'];
    
    
    if(intval($customerNo) > 0)
    {
        $customerData                   = $builderApiObj->getInstanceListOfParticulerClass(CUSTOMER_CLASS_ID, 'class', 'node_id');
        $customerData                   = json_decode($customerData, true);
        foreach ($customerData['data'] as $key => $value) {
            if (intval($value['CustomerNo']) == intval($customerNo)) {
                $customerArray          = $value;
            }
        }
        $fullName = $customerArray['FirstName']." ".$customerArray['LastName'];
        $email = $customerArray['EmailPrimary'];
    }

    $instanceData                           = $builderApiObj->getInstancesOfOperationRole($class_node_id,$login_role_id, $instanceId);
    $instanceData                           = json_decode($instanceData, true);
    $roleData                               = $builderApiObj->getActorWithRoleAndDeal($instanceId);
    $roleArray                              = json_decode($roleData, true);
    $edit_role_permission_arr    = explode(',',$instanceData['data'][$post['login_role_id']]['Deal Permissions']);
    if(in_array('Can Change Role',$edit_role_permission_arr))
        $edit_role_permission = 1;
    else
        $edit_role_permission = 0;
    //print_r($edit_role_permission);die;
    $requiredRoles = $builderApiObj->getVisibleNRequiredRoles($post['login_role_id'],REQUIRED_ROLES_PROP_ID);
    $requiredRolesArray = explode(',',json_decode($requiredRoles, true)['data']['value']);
    
    if(strtolower($_dealType) == strtolower('cash')){
        // Remove seller role from roles and required roles array
        $requiredRolesArray = array_merge(array_diff($requiredRolesArray, array(ROLE_SELLER)));
        unset($roleArray['data'][ROLE_SELLER]);
        unset($instanceData['data'][ROLE_SELLER]);
    }
    $showVisibleRoles = 1;
    
    
    if(count($requiredRolesArray) == 1){
        $requiredRolesArray = array();
    }
    //print_r(array($instanceData['data'], $roleArray['data'], $post['login_role_id'],$requiredRolesArray,$showVisibleRoles,$fullName,$email));
    $html                                   = getHtmlRoleLayout($instanceData['data'], $roleArray['data'], $post['login_role_id'],$requiredRolesArray,$showVisibleRoles,$fullName,$email,$edit_role_permission);
    $json['content_detail']                 = '<div id="content_scroler_div" class="customScroll mid-section-HT" > <div class="listing-content-wrap" >' . $html . '</div></div>';
} else {
    $json['content_detail']                 = '<div class="no-record">No Records Found</div>';
}

if($form_container == '')
{

    $tooltip                                    =   '<a href="#" class="tooltip-item detail-icon detailJs" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(2)">
                                                        <i class="prs-icon detail"></i>
                                                        <span>Detail</span>
                                                    </a>';

    $tooltip                                    .=  '<a href="#" class="tooltip-item detail-icon active" data-toggle="tooltip" data-placement="bottom" >
                                                        <i class="prs-icon team-member"></i>
                                                        <span>Team Members</span>
                                                    </a>';

    $tooltip                                    .=  '<a href="#" class="tooltip-item detail-icon hide inactive" data-toggle="tooltip" data-placement="bottom">
                                                        <i class="prs-icon workflow"></i>
                                                        <span>Workflow</span>
                                                    </a>';

    $json['tooltip']                            =   $tooltip;
    $workspace                                  =   '';/*'<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive">
                                                        <i class="prs-icon workspace"></i><br><span>Workspace</span>
                                                    </a>';*/
    $json['actions']                            =   '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                                                        <i class="prs-icon dialogue"></i>
                                                        <br>
                                                        <span>Dialogue</span>
                                                        </a>' . $workspace .'<a href="#" onclick="saveRolesActorAndDeals()" data-placement="left" class="inactive save-role tooltip-item action-accept-invitation">
                                                        <i class="prs-icon save"></i>
                                                        <br><span>Save</span>
                                                    </a>';
}
else if($form_container == '_dashboard')
{
    $tooltip                                    =   '<a href="#" class="tooltip-item detail-icon detailJs" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(2)">
                                                        <i class="prs-icon detail"></i>
                                                        <span>Detail</span>
                                                    </a>';

    $tooltip                                    .=  '<a href="#" class="tooltip-item detail-icon active" data-toggle="tooltip" data-placement="bottom" >
                                                        <i class="prs-icon team-member"></i>
                                                        <span>Team Members</span>
                                                    </a>';

    $json['tooltip']                            =   $tooltip;
    
    $json['actions']                            =   '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation inactive dialogueJs">
                                                        <i class="prs-icon dialogue"></i>
                                                        <br>
                                                        <span>Dialogue</span>
                                                        </a>
                                                        <a href="#" onclick="saveRolesActorAndDeals()" data-placement="left" class="inactive save-role tooltip-item action-accept-invitation">
                                                        <i class="prs-icon save"></i>
                                                        <br><span>Save</span>
                                                        </a>
                                                        <a href="#" class="tooltip-item action-accept-invitation j_my_createDeal_close">
                                                        <i class="prs-icon icon_close"></i>
                                                        <br>
                                                        <span>Cancel</span>
                                                    </a>';
}
?>