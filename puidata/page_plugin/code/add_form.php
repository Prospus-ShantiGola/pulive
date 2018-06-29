<?php
//for manage PPC CLASS
$_allowedSectionTabArr=array(PPC_SETTING);     
$_tabFlag = (in_array(trim($post['heading']),$_allowedSectionTabArr)) ? true :false;

if($_tabFlag){
    $propertyId = PROPERTYID_OF_REVIEW_ID;
}else{
    $propertyId = PROPERTYID_OF_DEAL_ID;
}
/* For Get And Set New Node Id */
$nodeArray                                      =   $builderApiObj->getNewNodeId();
$nodeData                                       =   json_decode($nodeArray, true);
$json['display_type']                           =   'add';
$resArr                                         =   array();
$resArr['node_instance_id']                     =   '';
$temp[]                                         =   array('id' => $propertyId, 'val' => intval($nodeData['data']));
$resArr['values']                               =   $temp;
$json['content_values']                         =   $resArr;
$json['activate_document_btn']                  =   false;  



/* ---------------------------- */
if (trim($instanceId) != '' && intval($instanceId) > 0) {
    $formData                                   =   $builderApiObj->getFormStructure($instanceId);
    $formData                                   =   json_decode($formData, true);
    $json['content_detail']                     =   html_entity_decode($formData['data']);
    $rolesTemp                                  = getRoleDropDown($builderApiObj);
    $json['roleDD']                             =   $rolesTemp['html'];
} else {
    $json['content_detail']                     =   'Invalid instance id';
}
$json['head']                                   =   $heading . ' ' . intval($nodeData['data']) . ': Detail';
   


$json['tooltip']                                =   '<a href="#" class="tooltip-item detail-icon detailJs active" data-toggle="tooltip" data-placement="bottom">
                                                        <i class="prs-icon detail"></i>
                                                        <span>Detail</span>
                                                        </a>';
if($_tabFlag){
    $json['tooltip'] .='<a href="#" class="tooltip-item detail-icon inactive  documentJs documentJsBtn" data-toggle="tooltip" data-placement="bottom" onclick="getReviewDocument();">
                                    <i class="prs-icon document"></i>
                                    <span>Document</span>
                                    </a>';
    /*$json['tooltip'] .='<a href="#" class="tooltip-item detail-icon documentJs j_my_esign_open inactive" data-toggle="tooltip" data-placement="bottom" onclick="showsignFlyout();" id="signBtn">
                                            <i class="prs-icon esign"></i>
                                            <span>E Sign</span>
                                        </a>';*/
}
$json['tooltip'] .='<a href="#" class="tooltip-item detail-icon other-then-deal" data-toggle="tooltip" data-placement="bottom" onclick="getRolesOfPlugin(1)" >
                                                            <i class="prs-icon team-member"></i>
                                                           <span>Team Members</span>
                                                        </a>
                                                        <a href="#" class="tooltip-item detail-icon hide inactive other-then-deal" data-toggle="tooltip" data-placement="bottom">
                                                            <i class="prs-icon workflow"></i>
                                                            <span>Workflow</span>
                                                    </a>';

if ($instanceId == DEAL_VIEW_ID) {
    //$publishButton                              =   '<a href="#" data-placement="left" class="tooltip-item action-accept-invitation disabled-icon"><i class="prs-icon publish"></i><br><span>Publish</span></a>';
    $publishActionName = "Publish";
    $publishButton                              =   '<a href="#" onclick="callDetailsContentAction(\'P\')" data-placement="left" class="tooltip-item inactive call-detail-action-bt action-accept-invitation">
                                                        <i class="prs-icon publish"></i><br><span>'.$publishActionName.'</span>
                                                    </a>';
} else {
//if($post['heading']=='Performance Review'){
//            $publishActionName = "Publish Review";
//        }else{
//            $publishActionName = "Publish";
//        }
    $publishActionName = "Publish";
    $publishButton                              =   '<a href="#" onclick="callDetailsContentAction(\'P\')" data-placement="left" class="tooltip-item action-accept-invitation">
                                                        <i class="prs-icon publish"></i><br><span>'.$publishActionName.'</span>
                                                    </a>';
}

 


if ($instanceId == DEAL_VIEW_ID) {
    $saveActionName = "Save As Draft";
    $saveButton                              =   '<a href="#" onclick="callDetailsContentAction(\'D\')" data-placement="left" class="tooltip-item inactive call-detail-action-bt action-accept-invitation">
                                                        <i class="prs-icon save"></i>
                                                        <br>
                                                        <span>' . $saveActionName . '</span>
                                                        </a>';
} else {
    $saveActionName = "Save As Draft";
    $saveButton                              =   '<a href="#" onclick="callDetailsContentAction(\'D\')" data-placement="left" class="tooltip-item action-accept-invitation">
                                                        <i class="prs-icon save"></i>
                                                        <br>
                                                        <span>' . $saveActionName . '</span>
                                                        </a>';
}

if($form_container == '')
{
//    if($post['heading']=='Performance Review'){
//            $saveActionName = "Save Review";
//        }else{
//            $saveActionName = "Save";
//        }
    
    $json['actions']                                =   '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
                                                        <i class="prs-icon dialogue"></i>
                                                        <br>
                                                        <span>Dialogue</span>
                                                        </a>' .$saveButton. $publishButton . '<a href="#" onclick="cancelFormAction();" class="tooltip-item action-accept-invitation show-confirmation j_my_createDeal_close">
                                                        <i class="prs-icon icon_close"></i>
                                                        <br>
                                                        <span>Cancel</span>
                                                    </a>';
}
else if($form_container == '_dashboard')
{
    $json['actions']                                =   '<a  href="#" data-placement="left" class="tooltip-item action-accept-invitation other-then-deal inactive dialogueJs">
                                                        <i class="prs-icon dialogue"></i>
                                                        <br>
                                                        <span>Dialogue</span>
                                                        </a>'.$saveButton . $publishButton . '<a href="#" onclick="cancelFormAction();" class="tooltip-item action-accept-invitation show-confirmation j_my_createDeal_close">
                                                        <i class="prs-icon icon_close"></i>
                                                        <br>
                                                        <span>Cancel</span>
                                                    </a>';
}


?>