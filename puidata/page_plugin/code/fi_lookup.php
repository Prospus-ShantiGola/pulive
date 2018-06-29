<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include_once 'fi_lookup_api.php';
$_mode = $_REQUEST['mode'];
$login_user_id = $_REQUEST['login_user_id'];
$login_role_id = $_REQUEST['login_role_id'];
if ($_mode == 'lookupFlyout') {

    $json['head'] = 'Deal Lookup';
    $json['tooltip'] = '';
    $json['actions'] = '<a href="#" data-placement="left" class="tooltip-item "><br></a>'
            . '<a href="#" class="inactive deal_lookup_btn" onclick="FIQuoteModule.doLookup(this)"><i class="prs-icon lookup"></i><br><span>Lookup</span></a>'
            . '<a href="#" class="" onclick="FIQuoteModule.resetSearch(this)"><i class="prs-icon reset"></i><br><span>Reset <br/> Search</span></a>'
            . '<a href="#" class="j_my_dealLookup_close" onclick="FIQuoteModule.resetFlyout(this);"><i class="prs-icon icon_close"></i><br><span>Cancel</span></a>';
    $json['content_detail'] = getLookupHtml();
     $json['status'] = '1';
      $json['message'] = '';
    
    
        //$resJsonArr = array('status' => '1', 'message' => '');
       // $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($json);
        exit;
        
    
//    print json_encode($json);
//    exit;
}else if($_mode ==  'lookup_result'){
  $_lookupResutlArr = callSearchApi($post);
//    $returnArr = array();
//    for($i = 0; $i<=99 ; $i++){
//        $returnArr['item'][$i] = array('CustomerNo' => 1009151,
//                    'CustomerName' => 'Kennenth Ebanks',
//                    'PhoneBusiness' => '123465132546',
//                    'Email' => 'freshorse@gmail.com');
//    }
//    $returnArr['isCustomerSearch'] = 0;
//    $returnArr['total_records'] = count($returnArr['item']);
  
        $_lookupResutlArr['status'] = '1';
        $_lookupResutlArr['message'] ='';
        //$resJsonArr = array('status' => '1', 'message' => '');
        //$resJsonArr['data'] = $_lookupResutlArr;
        header('Content-Type: application/json');
        print json_encode($_lookupResutlArr);
        exit;

//  print json_encode(($_lookupResutlArr));

}

function getLookupHtml() {
    global $builderApiObj;
    global $login_role_id;
    global $login_user_id;
    $_location = '';
    $_locationArr = json_decode($builderApiObj->getInstanceListOfParticulerClass(858, 'class', 'node_id'), TRUE)['data'];
    foreach($_locationArr as $key => $value){
        if($value['RoleNID'] == $login_role_id && $value['ActorNID'] == $login_user_id){
            $_location = $value['Location'];
            break;
        }
    }
    $data['class_id'] = STORE_CLASS_ID;
    $data['class_pid'] = STORE_LOCATION_PROPERTY_ID;
    $_locationArr = array_column(json_decode($builderApiObj->getSingleValueOfAllInstanceByClass($data),TRUE),'value');
    sort($_locationArr);
    $_option = '<option>Select</option>';
    foreach($_locationArr as $key => $value){
        $_selected = '';
        if($value == $_location){
            $_selected = ' selected=selected ';
        }
        $_option .= '<option "'.$_selected.'" value="'.$value.'">'.$value.'</option>';
    }
    $_html = '<div class="customScroll mid-section-HT"><div class="lookup-main-container list-detail-section form-horizontal">

								<div class="form-wrap">
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Select Deal Location</label>
										<div class="col-sm-8">
											<select name="location_lookup" data-default="'.$_location.'" class="form-control form-select dealLookupLocDrop">'.$_option.'</select>
										</div>
									</div>
									<h3 class="heading3">Please enter search criteria in one or more fields below.</h3>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">FI Quote #:</label>
										<div class="col-sm-8">
											<input name="fi_quote_lookup" type="text" class="form-control inline-input" id="fiquote_caption1000" placeholder="">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Customer #:</label>
										<div class="col-sm-8">
											<input name="customer_lookup" type="text" class="form-control inline-input" id="customer_caption1000" placeholder="">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Stock #:</label>
										<div class="col-sm-8">
											<input name="stock_lookup" type="text" class="form-control inline-input" id="stock_caption1000" placeholder="">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Customer Last Name:</label>
										<div class="col-sm-8">
											<input name="last_name_lookup" type="text" class="form-control inline-input" id="customer_name_caption1000"  placeholder="">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Customer Phone #:</label>
										<div class="col-sm-8">
											<input name="phone_num_lookup" type="text" class="form-control inline-input" id="customer_phone_caption1000"  placeholder="">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label form-label">Customer Email:</label>
										<div class="col-sm-8">
											<input name="email_lookup" type="text" class="form-control inline-input" id="customer_email_caption1000" placeholder="">
										</div>
									</div>
								</div>
								<div class="table-list table-responsive search-result-container hide">
								<h3 class="heading3">Search Results</h3>
    								<table class="table table-striped fi-search-container hide">
    									<thead><tr><th></th><th>FI Quote #</th><th>Customer Name</th><th>Stock #</th><th>Stock Description</th><th>Availability</th></tr></thead>
    									<tbody></tbody>
    								</table>
                                    <table class="table table-striped customer-search-container hide">
    									<thead><tr><th></th><th>Customer #</th><th>Customer Name</th><th>Phone</th><th>Email Address</th></tr></thead>
    									<tbody></tbody>
    								</table>
								</div>
							</div></div>';

    return $_html;
}
