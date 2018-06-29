<?php
$stockNo                                            = trim($post['stockNo']);
$make                                               = trim($post['make']);
$year                                               = trim($post['year']);
$model                                              = trim($post['model']);

$condition                                      = '';
if($make != '')
{
    $condition                                  .= '&Brand='.$make;
}

if($year != '')
{
    $condition                                  .= '&Year='.$year;
}

if($model != '')
{
    $condition                                  .= '&Model='.$model;
}

$stockArray                                     = array();
if($stockNo == '' && ($make != '' || $year != '' || $model != ''))
{
    $url                                        = "https://devintegrator.marinemax.com/rest/V1/UNITS/SEARCH?X-Connection=ASTRAG2&Location=CW".$condition;
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
            if($key === 'StockNo')
            {
                $is_single                      = 'Y';
            }
            $index++;
        }
    }

    if($is_single == 'Y')
    $stockArray[]                          = $returnArray['Record'];
    else
    $stockArray                            = $returnArray['Record'];    
}
else if($stockNo != '')
{
    $data                                           = $builderApiObj->callMapApi(MAPPING_API_URL . "?API=Units&MappingInstanceId=642878&Location=MSP&&StockNo=" . $stockNo, "");
    $data                                           = explode(" ", strip_tags($data));
    if ("successfully." == end($data)) {
        $stockData                                  = $builderApiObj->getInstanceListOfParticulerClass(UNIT_CLASS_ID, 'class', 'node_id');
        $stockData                                  = json_decode($stockData, true);
        foreach ($stockData['data'] as $key => $value) {
            if ($value['StockNo'] === $stockNo) {
                $stockArray[]                         = $value;
            }
        }
    }
}

$html                                       = getUnitsHtmlList($stockArray);


$saveBtn=   '<a href="#" onclick="getStock()" data-placement="left" class="unit_search_select_button inactive">
                <i class="prs-icon select"></i>
                <br>
                <span>Select</span>
            </a>';



$_userNotification                  = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
$json['list']                       = '<div class="listing-table-head" ><div class="row"><div class="col-sm-2 ">Stock #</div><div class="col-sm-3 ">Make</div><div class="col-sm-3 ">Model</div><div class="col-sm-2">Length</div><div class="col-sm-2">Condition</div></div></div><div class="customScroll mid-section-HT"><div class="listing-table-body">' . $html . '</div></div>';
$json['heading']                    = '<div id="id_opertion_head">Search Boat: List</div>';
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