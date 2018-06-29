<?php
$salesQuoteNo                               = trim($post['salesQuoteNo']);
$customerNo                                 = trim($post['customerNo']);
$stockNo                                    = trim($post['stockNo']);

$condition                                      = '';
if($customerNo != '')
{
    $condition                                  .= '&CustomerNo='.$customerNo;
}

if($stockNo != '')
{
    $condition                                  .= '&StockNo='.$stockNo;
}

 $salesArray                                  = array();
if($salesQuoteNo == '' && ($customerNo != '' || $stockNo != ''))
{
    $url                                        = "https://devintegrator.marinemax.com/rest/V1/SALES_QUOTES/SEARCH?X-Connection=ASTRAG2&Location=CW".$condition;
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
            if($key === 'QuoteNo')
            {
                $is_single                      = 'Y';
            }
            $index++;
        }
    }

    if($is_single == 'Y')
    $salesArray[]                          = $returnArray['Record'];
    else
    $salesArray                            = $returnArray['Record'];    

}
else if($salesQuoteNo != '')
{
    $sales_data                             = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=SALES_QUOTES&MappingInstanceId=798655&Location=CW&SalesQuoteNo=" . $salesQuoteNo, "");
    $sales_data                             = explode(" ", strip_tags($sales_data));
    if ("successfully." == end($data)) {
        $salesData                          = $builderApiObj->getInstanceListOfParticulerClass(SALES_QUOTES_CLASS_ID, 'class', 'node_id');
        $salesData                          = json_decode($salesData, true);
        foreach ($salesData['data'] as $key => $value) {
            if (intval($value['QuoteNo']) == intval($salesQuoteNo)) {
                 $salesArray[]            = $value;
            }
        }
    }
}
$html                                           = getSalesHtmlList($salesArray);

$saveBtn=   '<a href="#" onclick="searchSelectSalesQuote()" data-placement="left" class="salesquote_search_select_button inactive">
                <i class="prs-icon select"></i>
                <br>
                <span>Select</span>
            </a>';



$_userNotification                  = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
$json['list']                       = '<div class="listing-table-head" ><div class="row"><div class="col-sm-2 ">Sales #</div><div class="col-sm-2 ">First Name</div><div class="col-sm-2 ">Last Name</div><div class="col-sm-2">StockDesc</div><div class="col-sm-2">StatusDesc</div><div class="col-sm-2">DateQuoted</div></div></div><div class="customScroll mid-section-HT"><div class="listing-table-body">' . $html . '</div></div>';
$json['heading']                    = '<div id="id_opertion_head">Search Sales Quote: List</div>';
$json['actions']                    =   '<a href="#" class=""><i class=""></i><br><span></span></a>'.$saveBtn.'
                                            <a href="#" class="tooltip-item jq_search_close">
                                            <i class="prs-icon icon_close"></i>
                                            <br>
                                            <span>Close</span>
                                        </a>';


$resJsonArr = array('status'=>'1','message'=>'');
$resJsonArr['data'] = $json;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;

?>