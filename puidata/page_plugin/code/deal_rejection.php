<?php

$deal_node_id = $post['deal_node_id'];
$deal_instance_id = $post['deal_instance_id'];
$login_role_id = $post['login_role_id'];
$post['deal_rejection'] = DEAL_REJECTION;
$post['operation_role_node_id'] = OPERATIONS_ROLES_CLASS_ID;
$operationPhase = json_decode($builderApiObj->getInstanceListOfParticulerClass(OPERATION_PHASE_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
$historyList = json_decode($builderApiObj->getDealRejectionHistory($post), TRUE);
$dealPhase = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($deal_instance_id, DEAL_PHASE_PROPERTY_ID)), TRUE)['value'];


$dealPhaseVersionId = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($deal_instance_id, DEAL_PHASE_VERSION_PROPERTY_ID)), TRUE)['value'];
$phaseSeqInstanceId = json_decode($builderApiObj->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($dealPhaseVersionId)), TRUE)['node_instance_id'];
$dealPhaseSeq = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($phaseSeqInstanceId, PHASE_SEQUENCE)), TRUE)['value'];
//print_r(array($dealPhaseVersionId,$phaseSeqInstanceId,$dealPhaseSeq,PHASE_SEQUENCE));die;

$phaseSeqArr = explode(',', $dealPhaseSeq);
$_fstRole = $phaseSeqArr[0];
//echo $_fstRole;die;
$dealRejection = 1;
$curPhase = '';
if ($dealPhase == 'All Done') {
    $dealRejection = 3;
}

$dealPhaseId = '';
foreach ($operationPhase as $key => $value) {
    if ($value['Phase'] == $dealPhase) {
        $dealPhaseId = $key;
    }
    if ($value['Phase'] == $dealPhase && $value['Sequence'] == 1 && $_fstRole == $login_role_id) {
        $dealRejection = 0;
        $curPhase = $value['Phase'];
    }
}
//echo $dealPhaseId;die;
if ($dealPhaseId != '' && $dealRejection != 0) {
    $dealPhaseInstanceId = json_decode($builderApiObj->getInstanceIdByTwoValue($deal_node_id, $dealPhaseId), TRUE)['node_instance_id'];
    $dealPhaseRole = json_decode($builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($dealPhaseInstanceId, PHASE_ROLE_P_ID)), TRUE)['value'];
    if ($login_role_id != $dealPhaseRole) {
        $dealRejection = 2;
    }
}
//echo $dealRejection;die;
$json['actions'] = '<a href="#" class="tooltip-item j_my_createDeal_close"><i class="prs-icon icon_close"></i><br><span>Cancel</span></a>';
$json['head'] = 'Deal Rejection';
$json['content_detail'] = '<div class="customScroll- mid-section-HT">
            <div class="rejected-tab-section">
                          <!-- Nav tabs -->
                          <ul class="nav nav-tabs rejected-tabbing" role="tablist">
                            <li role="presentation" class="active"><a href="#rejected" aria-controls="rejected" role="tab" data-toggle="tab">Rejected</a></li>
                            <li role="presentation"><a href="#history" aria-controls="history" role="tab" data-toggle="tab">History</a></li>
                          </ul>

                          <!-- Tab panes -->
                          <div class="tab-content rejected-tab-area">
                            <div role="tabpanel" class="tab-pane active tab-rejected" id="rejected">
                                    ' . dealConfirmation($dealRejection, $deal_node_id, $deal_instance_id, $curPhase) . '
                            </div>
                            <div role="tabpanel" class="tab-pane tab-history" id="history">
                                    
                                    <div class="listing-table-head">
                                        <div class="row">
                                            <div class="col-sm-2 ">Date</div>
                                            <div class="col-sm-2 ">User Role</div>
                                            <div class="col-sm-2 ">User Email</div>
                                            <div class="col-sm-6">Rejection Comments</div>
                                       </div>
                                    </div>
                                    <div class="listing-table-body">
                                     <div class="customScroll set-tbody-HT">
                                            ' . historyRejection($historyList) . '
                                        </div>

                                    </div>


                            </div>
                          </div>

                     </div>
                </div>';

function historyRejection($historyData) {
    $html = '';
    if (!empty($historyData)) {
        foreach ($historyData as $key => $value) {
            $html.= '<div class="row">
              <div class="col-sm-2 ">' . date("Y-m-d", strtotime($value['Date Of Rejection'])) . '</div>
              <div class="col-sm-2 ">' . $value['Current Role'] . '</div>
              <div class="col-sm-2 ">' . $value['Current User'] . '</div>
              <div class="col-sm-6">' . $value['Reason Of Rejection'] . ' </div>
              </div>';
        }
    } else {
        $html.= '<div class="no-record-js"><div class="noEntry">No Records Found</div></div>';
    }
    return $html;
}

function dealConfirmation($dealRejection, $deal_node_id, $deal_instance_id, $curPhase) {

    if ($dealRejection == 0) {
        $html = '<p>You are in ' . $curPhase . '. A deal cannot be rejected in ' . $curPhase . '.</p>';
    } else if ($dealRejection == 2) {
        $html = '<p>This deal is not in your phase currently. You cannot reject this deal.</p>';
    } else if ($dealRejection == 3) {
        $html = '<p>All the phases on this deal are completed. You cannot reject this deal.</p>';
    } else if ($dealRejection == 1) {
        $html = '<h3>Confirm</h3><p>Are you sure you want to reject this deal?</p>
                                <div class="form-horizontal">
                                  <div class="form-group">
                                      <div class="col-sm-2">
                                       <label class="radio-inline">
                                          <input onclick="dealRejectionFrmEnable()" type="radio" name="reason" id="inlineRadio1" value="yes"> Yes
                                        </label>
                                    </div>
                                            <div class="col-sm-6">
                                       <label class="radio-inline">
                                          <input onclick="dealRejectionFrmDisable()" type="radio" checked name="reason" id="inlineRadio1" value="no"> No
                                        </label>
                                    </div>
                               
                                    </div>
                                    <br>
                                       <div class="form-group">
                                        <div class="col-sm-12">
                                            <span>State reason(s) for rejection:</span> <span class="text-red">*</span>
                                        </div>
                                       </div>
                                       <div class="form-group">
                                         <div class="col-sm-12">
                                            <textarea disabled class="form-control reasonBoxJs inline-input" rows="3"></textarea>
                                        </div>
                                       </div>

                                       <div class="form-group">
                                        <div class="col-sm-10">
                                        <span class="text-red">*</span>Required 
                                        </div>
                                        <div class="col-sm-2">
                                          <button onclick="saveDealRejectReason(this,' . $deal_node_id . ',' . $deal_instance_id . ');" disabled class="reasonBtnJs btn btn-black btn-sm right">Ok</button>
                                        </div>
                                      </div>
                                 
                                  </div>';
    }
    return $html;
}

print json_encode($json);
die;
