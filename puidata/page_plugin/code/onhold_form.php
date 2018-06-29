<?php
 /**
    * Created by AnilGupta
    * Date: 17-Jan-2017
    * Create select box for on hold reasons         
    */ 
$_onholdReason = json_decode($builderApiObj->getInstanceListOfParticulerClass(ON_HOLD_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
function sortByOrder($a, $b) {
    return $a['hold_id'] - $b['hold_id'];
    
}
usort($_onholdReason, 'sortByOrder');
$_reasonMsg = '';
foreach($_onholdReason as $key => $value){
    $_reasonMsg .= '<option value="'.$value['hold_reason'].'">'.$value['hold_id'].'.' .' '.$value['hold_reason'].'</option>';
}                                
$json['content_detail'] = '<select id="onholdsection" class="form-control form-select"><option>Please select a reason:</option>'.$_reasonMsg.'</select>';

$resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
//print json_encode($json);
			