<?php
$customerNo                                     = trim($post['customerNo']);
$lastName                                       = trim($post['lastName']);
$emailPrimary                                   = trim($post['emailPrimary']);
$phoneHome                                      = trim($post['phoneHome']);
$phoneBusiness                                  = trim($post['phoneBusiness']);

$condition                                      = '';
if($lastName != '')
{
    $condition                                  .= '&LastName='.$lastName;
}

if($emailPrimary != '')
{
    $condition                                  .= '&Email='.$emailPrimary;
}

if($phoneHome != '' && $phoneBusiness != '')
{
    $condition                                  .= '&Phone='.$phoneHome;
}
else if($phoneHome != '' && $phoneBusiness == '')
{
    $condition                                  .= '&Phone='.$phoneHome;
}
else if($phoneHome == '' && $phoneBusiness != '')
{
    $condition                                  .= '&Phone='.$phoneBusiness;
}

$customerArray                                  = array();
if($customerNo == '' && ($lastName != '' || $emailPrimary != '' || $phoneHome != '' || $phoneBusiness != ''))
{
    $url                                        = "https://devintegrator.marinemax.com/rest/V1/CUSTOMERS/SEARCH?X-Connection=ASTRAG2&Location=CW".$condition;
    $myXMLData                                  = callCurl($url);
    $myXMLData                                  = explode("<?xml",$myXMLData);
    $myXMLData[1]                               = "<?xml".$myXMLData[1];
    $headers                                    = get_headers_from_curl_response($myXMLData[0]);
    $xml                                        = simplexml_load_string($myXMLData[1]);
    $returnArray                                = json_encode($xml);
    $returnArray                                = json_decode($returnArray, true);

    $is_single                                  = 'N';
    $index                                      = 0;
    foreach($returnArray['Record'] as $key => $value)
    {
        if(intval($index) == 0)
        {
            if($key === 'CustomerNo')
            {
                $is_single                      = 'Y';
            }
            $index++;
        }
    }

    if($is_single == 'Y')
    $customerArray[]                          = $returnArray['Record'];
    else
    $customerArray                            = $returnArray['Record'];    

}
else if($customerNo != '')
{
    $data                                   = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Customers&MappingInstanceId=638236&Location=MSP&CustomerNo=" . $customerNo, "");
    $data                                   = explode(" ", strip_tags($data));
    if ("successfully." == end($data)) {
        $customerData                       = $builderApiObj->getInstanceListOfParticulerClass(CUSTOMER_CLASS_ID, 'class', 'node_id');
        $customerData                       = json_decode($customerData, true);
        foreach ($customerData['data'] as $key => $value) {
            if (intval($value['CustomerNo']) == intval($customerNo)) {
                $customerArray[]            = $value;
            }
        }
    }
}

$html                                           = getCustomerHtmlList($customerArray);


$saveBtn=   '<a href="#" onclick="getCustomer()" data-placement="left" class="customer_search_select_button inactive">
                <i class="prs-icon select"></i>
                <br>
                <span>Select</span>
            </a>';



$_userNotification                  = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
$json['list']                       = '<div class="listing-table-head" ><div class="row"><div class="col-sm-2 ">Last Name</div><div class="col-sm-2 ">First Name</div><div class="col-sm-2 ">Email</div><div class="col-sm-2">Business Phone</div><div class="col-sm-2">Mobile Phone</div><div class="col-sm-2">Home Phone</div></div></div><div class="customScroll mid-section-HT"><div class="listing-table-body">' . $html . '</div></div>';
$json['heading']                    = '<div id="id_opertion_head">Search Customer: List</div>';
$json['actions']                    =   '<a href="#" class=""><i class=""></i><br><span></span></a>'.$saveBtn.'
                                            <a href="#" class="tooltip-item jq_search_close">
                                            <i class="prs-icon icon_close"></i>
                                            <br>
                                            <span>Close</span>
                                        </a>';
//print json_encode($json);
//exit;
$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;
?>