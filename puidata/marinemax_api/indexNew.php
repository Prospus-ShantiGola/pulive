<?php
ini_set("display_errors", 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
if($_SERVER['HTTP_HOST'] != 'sta.pu.prospus.com' && $_SERVER['HTTP_HOST'] != 'qa.pu.prospus.com' && $_SERVER['HTTP_HOST'] != 'dev.pu.prospus.com')
{
    DEFINE('BASE_URL_API', 'http://'.$_SERVER['HTTP_HOST'].'/PUI/puidata/page_plugin/');
    DEFINE('WEB_API_URL', 'http://'.$_SERVER['HTTP_HOST'].'/PUI/pui/');
}
else
{
    DEFINE('BASE_URL_API', 'http://'.$_SERVER['HTTP_HOST'].'/puidata/page_plugin/');
    DEFINE('WEB_API_URL', 'http://'.$_SERVER['HTTP_HOST'].'/pui/');
}

DEFINE('CUSTOMER_CLASS_ID', '770');
DEFINE('UNIT_CLASS_ID', '776');
DEFINE('MOTOR_CLASS_ID', '775');
DEFINE('SALES_QUOTES_CLASS_ID', '790');
DEFINE('FINANCE_DEALS_CLASS_ID', '801');

$customerSubClassArr        = array(
                                '842'   =>'DISALLOWEDPAYFORMS'
                                );
$unitsSubClassArr           = array(
                                '775'   =>'MOTOR',
                                '843'   =>'OPTIONS',
                                '844'   =>'SPECS',
                                '845'   =>'INCLUSIONS',
                                '846'   =>'MFGREBATE'
                                );
$salesSubClassArr           = array(
                                '791'   =>'TaxBMT' ,
                                '792'   =>'DownPayments',
                                '793'   =>'Trades',
                                '794'   =>'DealerOption',
                                '795'   =>'MfgOption',
                                '796'   =>'Parts',
                                '797'   =>'Extras',
                                '798'   =>'SalesReps',
                                '799'   =>'Inclusion',
                                '800'   =>'Taxes'
                                );
$financeSubClassArr         = array(
                                '791'   =>'TaxBMT' ,
                                '792'   =>'DownPayments',
                                '793'   =>'Trades',
                                '794'   =>'DealerOption',
                                '795'   =>'MfgOption',
                                '796'   =>'Parts',
                                '797'   =>'Extras',
                                '798'   =>'SalesReps',
                                '799'   =>'Inclusion',
                                '800'   =>'Taxes',
                                '803'   =>'Insurance',
                                '804'   =>'Commissions',
                                '805'   =>'AddOnCost'
                                );

function get_headers_from_curl_response($response)
{
    $headers = array();

    $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

    foreach (explode("\r\n", $header_text) as $i => $line)
        if ($i === 0)
        {
            $new = explode(" ",$line);
            $headers['http_code'] = $new[1];
        }
        else
        {
            list ($key, $value) = explode(': ', $line);

            $headers[$key] = $value;
        }

    return $headers;
}

function callCurl($api,$restUrl)
{
    $apiUrl                 = "https://devintegrator.marinemax.com/rest/V1/".$api."?X-Connection=ASTRAG2".$restUrl;
    $ch                     = curl_init();
    curl_setopt($ch,CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch,CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
    curl_setopt($ch,CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
    curl_setopt($ch,CURLOPT_TIMEOUT, 300);
    $data                   = curl_exec($ch);
    $http_status            = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $data;
}

function callMarinemaxAPI($api,$restUrl)
{
    $errorArray             = array(
                                    '201' => 'Request was processed successfully. Resources were created or modified. POST, PUT, PATCH or DELETE methods.',
                                    '204' => 'Request was processed successfully but no data returned. GET method only.',
                                    '400' => 'There was a problem processing the request. The response body will contain additional information.',
                                    '401' => 'The request was refused because the authentication information was not provided or is not valid.',
                                    '404' => 'The requested resource could not be found.',
                                    '405' => 'The requested HTTP method is not supported by the resource.',
                                    '429' => 'Too many requests.',
                                    '500' => 'Server processing error.',
                                   );
    $myXMLData              = callCurl($api,$restUrl);
    $myXMLData              = explode("<?xml",$myXMLData);
    $myXMLData[1]           = "<?xml".$myXMLData[1];

    $headers                = get_headers_from_curl_response($myXMLData[0]);
    if(intval(trim($headers['http_code'])) != 200)
    {
        die("<span style='color:red;' >".$errorArray[trim($headers['http_code'])]."</span>");
    }

    $xml                    = simplexml_load_string($myXMLData[1]);
    $returnArray            = json_encode($xml);
    return json_decode($returnArray, true);
}

function callWebApi($api, $postvars) 
{

    $url                    = WEB_API_URL . $api;
    
    
    $ch                     = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
    curl_setopt($ch, CURLOPT_USERPWD, "marc:jf53RjhB");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    $response               = curl_exec($ch);
    $http_status            = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($http_status != 200) 
    {
        $response = "<span style='color:red;' >Error $http_status</span>";
    }
    curl_close($ch);
    
    return $response;
}

function is_assoc($array){
   $keys = array_keys($array);
   return $keys !== array_keys($keys);
}

if ($_GET) {
    $getArray   = $_GET;

    if(trim($getArray['API']) == '')
    {
        echo "<span style='color:red;' >Please set API name.</span>";
        echo "<br/>";
    }
    else
    {

        if(trim($getArray['MappingInstanceId']) == '')
        {
            echo "<span style='color:red;' >MappingInstanceId is required.</span>";
            echo "<br/>";
        }

        if(trim($getArray['MappingInstanceId']) != '')
        {
            $url                    = '';
            foreach($getArray as $key => $value)
            {
                if(strtolower($key) != 'mappinginstanceid' && strtolower($key) != 'api')
                {
                    $url .= '&'.$key.'='.$value;
                }
            }

            $customerArray          = callMarinemaxAPI(strtoupper(trim($getArray['API'])),$url);

            foreach($customerArray['Record'] as $key => $value)
            {
                if($getArray['MappingInstanceId'] == '638236')
                {
                    /* For Custome API */
                    if($key == 'DisallowedPayForms')
                    {
                        if(is_array($value) && count($value) > 0)
                        {
                            if(is_assoc($value))
                            {
                                $customerArray['Record'][$key]      = '';
                                $customerArray['Record'][$key][0]   = $value;
                            }
                        }
                    }
                }
                else if($getArray['MappingInstanceId'] == '642878')
                {
                    /* For Custome API */
                    if($key != 'Extension')
                    {
                        if(is_array($value) && count($value) > 0)
                        {
                            if(is_assoc($value))
                            {
                                $customerArray['Record'][$key]      = '';
                                $customerArray['Record'][$key][0]   = $value;
                            }
                        }
                    }
                }
                else
                {
                    if(is_array($value) && count($value) > 0)
                    {
                        if(is_assoc($value))
                        {
                            $customerArray['Record'][$key]      = '';
                            $customerArray['Record'][$key][0]   = $value;
                        }
                    }
                }
            } 

            //echo "<pre>";
            //print_r($customerArray);
            //die;

            /* Code For Calling Mapping Instance */
            $options                = http_build_query(array('instanceNodeId' => $getArray['MappingInstanceId']));
            $returnArray            = callWebApi('callMapping', $options);
            $mappingData            = json_decode($returnArray, true);
            $first_pattern          = '/^\((Sub Class -)/';
            $second_pattern         = '/^\(Sub Class - (.*)\)/';

            $insCapArray            = array();
            $insProArray            = array();
            $insProNArray           = array();
            foreach($mappingData['instanceProArray'] as $row => $subClassArray)
            {
                $sourceArray        = explode(">",html_entity_decode($subClassArray['Source']));
                $prpertyValue       = array();
                foreach($sourceArray as $index => $columnName)
                {
                    if(count($prpertyValue)) {
                        $prpertyValue = $prpertyValue[trim($columnName)];
                    } else {
                        $prpertyValue = $customerArray[trim($columnName)];
                    }
                }
                
                if(is_array($prpertyValue))
                    $prpertyValue           = '';
                
                preg_match($first_pattern, $subClassArray['Target Property Name'], $match);
                if(trim($prpertyValue) != '' && count($match) == 0)
                {
                    $insCapArray[]          = $prpertyValue;
                    $insProArray[]          = $subClassArray['Target Property Id'];
                    $insProNArray[]         = $subClassArray['Target Property Name'];
                }
            }
            
            
                //print_r($mappingData['classArray']);
                //print_r($insProNArray);
                //print_r($insProArray);
                //print_r($insCapArray);
                

            /* Create Instance Of Parent Class*/
            $createInstanceDataArray                           = array();
            if($getArray['MappingInstanceId'] == '638236')
            {
                /* For Custome API */
                $keyIndex                   = array_search('6315', $insProArray);
                $valueCheck                 = $insCapArray[$keyIndex]; 

                $data                       = array('primaryId' => CUSTOMER_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                $options                    = http_build_query($data);
                $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                $customerData               = json_decode($customerData, true);

                
                $node_instance_id           = '';
                foreach ($customerData['data'] as $key => $value) {
                    if (intval($value['CustomerNo']) == intval($valueCheck)) {
                        $node_instance_id            = $key;
                    }
                }

                $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                $options                    = http_build_query($data);
                $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                $inode_id                    = json_decode($inode_id, true);

                foreach($customerSubClassArr as $node_ids_of_subclass => $sub_class_name)
                {
                    $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                    $toptions                    = http_build_query($tdata);
                    $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                    $delData                     = json_decode($delData, true);

                    foreach($delData as $k => $v)
                    {
                        $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                        $teoptions                    = http_build_query($tedata);
                        $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                        $tenode_id                   = json_decode($tenode_id, true);
                         
                        if(trim($tenode_id['data']) != '')  
                        {
                            $data                       = array('instance_id' => $tenode_id['data']);
                            $options                    = http_build_query($data);
                            callWebApi('deleteInstance', $options);
                        }
                    }
                }

                if(trim($node_instance_id) != '')
                {
                    $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                }
            }
            else if($getArray['MappingInstanceId'] == '642878')
            {
                /* For Units API */
                $keyIndex                   = array_search('6586', $insProArray);
                $valueCheck                 = $insCapArray[$keyIndex]; 

                $data                       = array('primaryId' => UNIT_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                $options                    = http_build_query($data);
                $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                $customerData               = json_decode($customerData, true);

                
                $node_instance_id           = '';
                foreach ($customerData['data'] as $key => $value) {
                    if (intval($value['StockNo']) == intval($valueCheck)) {
                        $node_instance_id            = $key;
                    }
                }

                $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                $options                    = http_build_query($data);
                $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                $inode_id                    = json_decode($inode_id, true);

                foreach($unitsSubClassArr as $node_ids_of_subclass => $sub_class_name)
                {
                    $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                    $toptions                    = http_build_query($tdata);
                    $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                    $delData                     = json_decode($delData, true);

                    foreach($delData as $k => $v)
                    {
                        $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                        $teoptions                    = http_build_query($tedata);
                        $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                        $tenode_id                   = json_decode($tenode_id, true);
                         
                        if(trim($tenode_id['data']) != '')  
                        {
                            $data                       = array('instance_id' => $tenode_id['data']);
                            $options                    = http_build_query($data);
                            callWebApi('deleteInstance', $options);
                        }
                    }
                }

                if(trim($node_instance_id) != '') 
                {
                    $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                }
            }
            else if($getArray['MappingInstanceId'] == '798655')
            {
                /* For Sales Quote API */
                $keyIndex                   = array_search('7415', $insProArray);
                $valueCheck                 = $insCapArray[$keyIndex]; 

                $data                       = array('primaryId' => SALES_QUOTES_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                $options                    = http_build_query($data);
                $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                $customerData               = json_decode($customerData, true);

                
                $node_instance_id           = '';
                foreach ($customerData['data'] as $key => $value) {
                    if (intval($value['QuoteNo']) == intval($valueCheck)) {
                        $node_instance_id            = $key;
                    }
                }

                $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                $options                    = http_build_query($data);
                $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                $inode_id                    = json_decode($inode_id, true);

                foreach($salesSubClassArr as $node_ids_of_subclass => $sub_class_name)
                {
                    $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                    $toptions                    = http_build_query($tdata);
                    $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                    $delData                     = json_decode($delData, true);

                    foreach($delData as $k => $v)
                    {
                        $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                        $teoptions                    = http_build_query($tedata);
                        $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                        $tenode_id                   = json_decode($tenode_id, true);
                         
                        if(trim($tenode_id['data']) != '')  
                        {
                            $data                       = array('instance_id' => $tenode_id['data']);
                            $options                    = http_build_query($data);
                            callWebApi('deleteInstance', $options);
                        }
                    }
                }
                

                if(trim($node_instance_id) != '') 
                {
                    $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                }
            }
            else if($getArray['MappingInstanceId'] == '799784')
            {
                /* For FI Quote API */
                $keyIndex                   = array_search('7532', $insProArray);
                $valueCheck                 = $insCapArray[$keyIndex]; 

                $data                       = array('primaryId' => FINANCE_DEALS_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                $options                    = http_build_query($data);
                $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                $customerData               = json_decode($customerData, true);

                
                $node_instance_id           = '';
                foreach ($customerData['data'] as $key => $value) {
                    if (intval($value['QuoteNo']) == intval($valueCheck)) {
                        $node_instance_id            = $key;
                    }
                }

                $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                $options                    = http_build_query($data);
                $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                $inode_id                    = json_decode($inode_id, true);

                foreach($financeSubClassArr as $node_ids_of_subclass => $sub_class_name)
                {
                    $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                    $toptions                    = http_build_query($tdata);
                    $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                    $delData                     = json_decode($delData, true);

                    foreach($delData as $k => $v)
                    {
                        $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                        $teoptions                    = http_build_query($tedata);
                        $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                        $tenode_id                   = json_decode($tenode_id, true);
                         
                        if(trim($tenode_id['data']) != '')  
                        {
                            $data                       = array('instance_id' => $tenode_id['data']);
                            $options                    = http_build_query($data);
                            callWebApi('deleteInstance', $options);
                        }
                    }
                }

                if(trim($node_instance_id) != '') 
                {
                    $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                }
            }
            
            $createInstanceDataArray['node_class_id']          = $mappingData['classArray']['node_class_id'];
            $createInstanceDataArray['node_class_property_id'] = $insProArray;
            $createInstanceDataArray['value']                  = $insCapArray;
            $createInstanceDataArray['is_email']               = 'N';
            $createInstanceDataArray['status']                 = 'P';
            //print_r($createInstanceDataArray);
            //die;
            $data                                              = array('data' => $createInstanceDataArray, 'action_id' => '1', 'structure_id' => '6');
            $options                                           = http_build_query($data);
            $returnResponse                                    = callWebApi('setStructure', $options);
            $returnResponse                                    = json_decode($returnResponse, true);
            $node_y_id                                         = '';
            if(intval($returnResponse['result']) == 0)
            {
                $node_y_id                                     = $returnResponse['data']['node_id'];
            }
            /* Code For Calling Subclass Instances */
            $newSubClassArray                  = array();
            foreach($mappingData['instanceProArray'] as $row => $subClassArray)
            {
                preg_match($first_pattern, $subClassArray['Target Property Name'], $match1);
                if(count($match1) > 1)
                {
                    preg_match($second_pattern, $subClassArray['Target Property Name'], $match2);

                    if(count($match2) > 1)
                    $newSubClassArray[trim($match2[1])][] = $subClassArray;
                }
            }

            if(count($newSubClassArray) > 0)
            {
                $node_x_id                  = array();
                foreach($newSubClassArray as $subClassName => $subArray)
                {
                    $propertyId             = current($subArray)['Target Property Id'];
                    $options                = http_build_query(array('propertyId' => $propertyId));
                    $returnArray            = callWebApi('getClassDetailFromProperty', $options);
                    $classData              = json_decode($returnArray, true);

                    $sourceArray1           = explode(">",html_entity_decode(current($subArray)['Source']));
                    $mainArray              = array();
                    $lastIndex              = intval(count($sourceArray1)) - 2;
                    foreach($sourceArray1 as $index => $columnName)
                    {
                        if($lastIndex >= $index)
                        {
                            if(count($mainArray)) {
                                $mainArray = $mainArray[trim($columnName)];
                            } else {
                                $mainArray = $customerArray[trim($columnName)];
                            }
                        }
                    }
                    
                    if(!is_array(current($mainArray)))
                    {
                        $tempArray          = $mainArray;
                        $mainArray          = array();
                        $mainArray[]        = $tempArray;
                    }

                    $subClassMappingInstanceArray = array();
                    foreach($subArray as $key => $subClassArray)
                    {
                        $sourceArray                                                      = explode(">",html_entity_decode($subClassArray['Source']));
                        $subClassMappingInstanceArray[$key]['Source']                     = trim(end($sourceArray));
                        $subClassMappingInstanceArray[$key]['Target Property Id']         = $subClassArray['Target Property Id'];
                        $subClassMappingInstanceArray[$key]['Target Property Name']       = $subClassArray['Target Property Name'];
                    }
                    
                    foreach($mainArray as $key => $valueArray)
                    {
                        $subInsCapArray         = array();
                        $subInsProArray         = array();
                        $subInsProNArray        = array();

                        if(is_array($valueArray))
                        {
                            foreach($subClassMappingInstanceArray as $index => $indexArray)
                            {
                                
                                $insVal             = $valueArray[$indexArray['Source']];
                                if(trim($insVal) != '')
                                {
                                    $subInsCapArray[]   = trim($insVal);
                                    $subInsProArray[]   = $indexArray['Target Property Id'];
                                    $subInsProNArray[]  = $indexArray['Target Property Name'];
                                }
                            }
                        }
                        /*
                            print_r($classData);
                            print_r($subInsProNArray);
                            print_r($subInsProArray);
                            print_r($subInsCapArray);
                        */

                        if(count($subInsProArray) > 0 && count($subInsCapArray) > 0)
                        {
                            /* Create Instance Of Parent Class*/
                            $createInstanceDataArray                           = array();
                            $createInstanceDataArray['node_class_id']          = $classData['node_class_id'];
                            $createInstanceDataArray['node_class_property_id'] = $subInsProArray;
                            $createInstanceDataArray['value']                  = $subInsCapArray;
                            $createInstanceDataArray['is_email']               = 'N';
                            $createInstanceDataArray['status']                 = 'P';
                            //print_r($createInstanceDataArray);
                            $data                                              = array('data' => $createInstanceDataArray, 'action_id' => '1', 'structure_id' => '6');
                            $options                                           = http_build_query($data);
                            $returnResponse                                    = callWebApi('setStructure', $options);
                            $returnResponse                                    = json_decode($returnResponse, true);
                            if(intval($returnResponse['result']) == 0)
                            {
                                $node_x_id[]                                   = $returnResponse['data']['node_id'];
                            }
                        }
                    }
                }

                if(count($node_x_id) > 0)
                {
                    $newInsCArray                           =   array();
                    $newInsCArray['node_y_id']              =   $node_y_id; 
                    $newInsCArray['node_x_ids']             =   $node_x_id;   
                    $data                                   =   array('data' => $newInsCArray, 'action_id' => '7', 'structure_id' => '9');
                    $options                                =   http_build_query($data);
                    $returnResponse                         =   callWebApi('setStructure', $options);
                    $returnResponse                         =   json_decode($returnResponse, true);
                }
            }

            if(intval($node_y_id) > 0)
            {
                echo "<span style='color:green;' >".strtoupper(trim($getArray['API']))." Instance(".$node_y_id.") create successfully.</span>";
                echo "<br/>";
            }
            else
            {
                echo "<span style='color:red;' >Some error occur.</span>";
                echo "<br/>";
            }
            
        }
        else
        {
            exit;
        }
       

        
    }
}

?>