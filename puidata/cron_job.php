<?php
ini_set("display_errors", 0);
ini_set("max_execution_time", 0);
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
date_default_timezone_set("Asia/Calcutta");
// Include AWS File
require 'aws/aws-autoloader.php';
if($_SERVER['HTTP_HOST'] == "localhost")
{
    $http_host                  = 'http://'.$_SERVER['HTTP_HOST'].'/pu';
}
else
{
    $http_host                  = 'http://'.$_SERVER['HTTP_HOST'];
}

// Constants of Class ID and URL
DEFINE('BASE_URL_API', $http_host.'/puidata/page_plugin/');
DEFINE('WEB_API_URL', $http_host.'/pui/');
DEFINE('CURL_API_URL', $http_host.'/puidata/cron_job.php');
DEFINE('CUSTOMER_CLASS_ID', '770');
DEFINE('UNIT_CLASS_ID', '776');
DEFINE('MOTOR_CLASS_ID', '775');
DEFINE('FINANCE_DEALS_CLASS_ID', '801');
DEFINE('COBUYER_CLASS_ID', '847');

// SubClass Id for Customer Class
$customerSubClassArr            = array(
    '842'   =>'DISALLOWEDPAYFORMS'
);
// SubClass Id for Units Class
$unitsSubClassArr               = array(
    '775'   =>'MOTOR',
    '843'   =>'OPTIONS',
    '844'   =>'SPECS',
    '845'   =>'INCLUSIONS',
    '846'   =>'MFGREBATE'
);
// SubClass Id for Finance Deal Class
$financeSubClassArr             = array(
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

/**
 * Function to make a curl call
 * @param type $api
 * @param type $postvars
 * @return type
 */
function callWebApi($api, $postvars)
{

    $url                        = WEB_API_URL . $api;
    $ch                         = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
    curl_setopt($ch, CURLOPT_USERPWD, "marc:jf53RjhB");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    $response                   = curl_exec($ch);
    $http_status                = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($http_status != 200)
    {
        $response               = "<span style='color:red;' >Error $http_status</span>";
    }
    curl_close($ch);

    return $response;
}

/**
 * To get Mapping Instance ID by file name
 * @param type $temp
 * @return int
 */
function getMappingInstanceIdFromFileName($temp)
{
    $first                      = explode('_',$temp);
    $second                     = explode('/',$first[2]);
    if($second[1] == 'finance') {
      return 799784;
    } elseif($second[1] == 'boat') {
        return 642878;
    } elseif($second[1] == 'customer') {
        return 638236;
    } elseif($second[1] == 'cobuyer') {
        return 1131077;
    }
}
/**
 * Function to run Cron job, accept all the files need to execute in an array.
 * @global type $cron_data_array
 * @global int $max_execution_limit
 * @staticvar int $execution_time
 * @param type $fileArray
 * @return type Array
 */
function runCronJob($fileArray){
    global $cron_data_array;
    global $max_execution_limit;
    static $execution_time                  = 1;  
    
    $cron_data_array['error_files']         = array();
    $cron_data_array['error_files_detail']  = array();
    
    try{
        foreach ($fileArray as $key => $aws_file_name) {
           $cron_data_array['success'][]    = runCronJobOnFile($aws_file_name);
        } 
    }
    catch (Exception $e) {
        
    }
    finally {
        // Find the difference to check all files are executed successfully
        $_filesInResult                     = array_diff($cron_data_array['success'], $fileArray);
        if(count($_filesInResult)){
            // Condition to check maximum limit to execute
            if($execution_time == $max_execution_limit){
                return $cron_data_array['success'];
            }else{
                $temp                       = array_diff($cron_data_array['success'], $cron_data_array['error_files_detail']);
                $cron_data_array['success'] = $temp;
                $execution_time++;
                // If Error in files, Again execute the error Files.
                return runCronJob($cron_data_array['error_files']);
            }
        } else {
            return $cron_data_array['success'];
        }
    }
}
/**
 * Function to run cron on a single file.*
 * @global type $cron_data_array
 * @global AwsS3Core $sdkApi
 * @param type $aws_file_name
 * @return string - Return File name if success, Error if not execute
 * @throws Exception
 */
function runCronJobOnFile($aws_file_name){
    global $cron_data_array;
    global $sdkApi;
     try {     
         $fileExist                          =  $sdkApi->isObjectExist($aws_file_name);
            if ($fileExist){
                // Get MappingInstanceId and Fetch Complete file data as $customerArray
                $MappingInstanceId              = getMappingInstanceIdFromFileName($aws_file_name);
                $customerArray                  = json_decode($sdkApi->getFileData($aws_file_name),true);

                if(count($customerArray) == 0)                
                    throw new Exception('File data not coming from AWS S3 Bucket');
                
                /* Code For Calling Mapping Instance */
                $options                        = http_build_query(array('instanceNodeId' => $MappingInstanceId));
                $returnArray                    = callWebApi('callMapping', $options);
                $mappingData                    = json_decode($returnArray, true);

                $first_pattern                  = '/^\((Sub Class -)/';
                $second_pattern                 = '/^\(Sub Class - (.*)\)/';
                
                $insCapArray                    = array(); // Array contain Instance Value
                $insProArray                    = array(); // Array contain Instance Property Name
                $insProNArray                   = array(); // Array contain Instance Property ID
                foreach($mappingData['instanceProArray'] as $row => $subClassArray)
                {
                    $sourceArray                = explode(">",html_entity_decode($subClassArray['Source']));
                    $prpertyValue               = array();
                    foreach($sourceArray as $index => $columnName)
                    {
                        if(count($prpertyValue)) {
                            $prpertyValue       = $prpertyValue[trim($columnName)];
                        } else {
                            $prpertyValue       = $customerArray[trim($columnName)];
                        }
                    }

                    if(is_array($prpertyValue))
                        $prpertyValue           = '';

                    preg_match($first_pattern, $subClassArray['Target Property Name'], $match);
                    // If Property value is not null and Not a Sub Class
                    if(trim($prpertyValue) != '' && count($match) == 0)
                    {
                        $insCapArray[]          = $prpertyValue;
                        $insProArray[]          = $subClassArray['Target Property Id'];
                        $insProNArray[]         = $subClassArray['Target Property Name'];
                    }
                }

                if(count($insProNArray) == 0 || count($insProArray) == 0 || count($insCapArray) == 0)
                    throw new Exception('Mapping data not coming from instance ('.$MappingInstanceId.')');

                /*print_r($mappingData['classArray']);
                print_r($insProNArray);
                print_r($insProArray);
                print_r($insCapArray);
                die;*/

                /* Create Instance Of Parent Class*/
                $createInstanceDataArray                            = array();
                $delList                                            = array();
                if($MappingInstanceId == '638236') // For Custome API 
                {
                    // Get value from Array
                    $keyIndex                   = array_search('6315', $insProArray);
                    $valueCheck                 = $insCapArray[$keyIndex];
                    
                    // Get All Instance ID of Customer Class
                    $data                       = array('primaryId' => CUSTOMER_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                    $options                    = http_build_query($data);
                    $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                    $customerData               = json_decode($customerData, true);

                    // Get Instance ID by checking value
                    $node_instance_id           = '';
                    foreach ($customerData['data'] as $key => $value) {
                        if (intval($value['CustomerNo']) == intval($valueCheck)) {
                            $node_instance_id            = $key;
                        }
                    }
                    
                    // Get Node ID of Calculated Instance ID
                    $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                    $options                    = http_build_query($data);
                    $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                    $inode_id                    = json_decode($inode_id, true);
                    
                    // Sub Class Array
                    foreach($customerSubClassArr as $node_ids_of_subclass => $sub_class_name)
                    {
                        // Get All Mapped Node ID From X-Y Relation
                        $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                        $toptions                    = http_build_query($tdata);
                        $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                        $delData                     = json_decode($delData, true);

                        foreach($delData as $k => $v)
                        {
                            // Get All Node Instance ID - So that we can delete these sub class instances
                            $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                            $teoptions                    = http_build_query($tedata);
                            $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                            $tenode_id                   = json_decode($tenode_id, true);

                            if(trim($tenode_id['data']) != '')
                            {
                                $delList[]               = $tenode_id['data'];
                            }
                        }
                    }

                    if(trim($node_instance_id) != '')
                    {
                        $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                    }
                }
                else if($MappingInstanceId == '642878')  // For Units API
                {
                    // Get value from Array
                    $keyIndex                   = array_search('6586', $insProArray);
                    $valueCheck                 = $insCapArray[$keyIndex];
                    
                    // Get All Instance ID of Unit Class
                    $data                       = array('primaryId' => UNIT_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                    $options                    = http_build_query($data);
                    $customerData               = callWebApi('getInstanceListOfParticulerClass', $options);
                    $customerData               = json_decode($customerData, true);

                    // Get Instance ID by checking value
                    $node_instance_id           = '';
                    foreach ($customerData['data'] as $key => $value) {
                        if (intval($value['StockNo']) == intval($valueCheck)) {
                            $node_instance_id            = $key;
                        }
                    }
                    
                    // Get Node ID of Calculated Instance ID
                    $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                    $options                    = http_build_query($data);
                    $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                    $inode_id                    = json_decode($inode_id, true);
                    
                    // Sub Class Array
                    foreach($unitsSubClassArr as $node_ids_of_subclass => $sub_class_name)
                    {
                        // Get All Mapped Node ID From X-Y Relation
                        $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                        $toptions                    = http_build_query($tdata);
                        $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                        $delData                     = json_decode($delData, true);

                        foreach($delData as $k => $v)
                        {
                            // Get All Node Instance ID - So that we can delete these sub class instances
                            $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                            $teoptions                    = http_build_query($tedata);
                            $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                            $tenode_id                   = json_decode($tenode_id, true);

                            if(trim($tenode_id['data']) != '')
                            {
                                $delList[]              = $tenode_id['data'];

                            }
                        }
                    }


                    if(trim($node_instance_id) != '')
                    {
                        $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                    }
                }
                else if($MappingInstanceId == '799784') // For FI Quote API 
                {
                    // Get value from Array
                    $keyIndex                   = array_search('7532', $insProArray);
                    $valueCheck                 = $insCapArray[$keyIndex];
                    
                    // Get All Instance ID of Finance Deal Class
                    $data                       = array('primaryId' => FINANCE_DEALS_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                    $options                    = http_build_query($data);
                    $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                    $customerData               = json_decode($customerData, true);

                    // Get Instance ID by checking value
                    $node_instance_id           = '';
                    foreach ($customerData['data'] as $key => $value) {
                        if (intval($value['QuoteNo']) == intval($valueCheck)) {
                            $node_instance_id            = $key;
                        }
                    }
                    
                    // Get Node ID of Calculated Instance ID
                    $data                       = array('table' => 'node-instance', 'primary_col' => 'node_instance_id', 'primary_val' => $node_instance_id, 'return_val' => 'node_id');
                    $options                    = http_build_query($data);
                    $inode_id                    = callWebApi('getParticulerColumnValue', $options);
                    $inode_id                    = json_decode($inode_id, true);
                    
                    // Sub Class Array
                    foreach($financeSubClassArr as $node_ids_of_subclass => $sub_class_name)
                    {
                        // Get All Mapped Node ID From X-Y Relation
                        $tdata                       = array('id' => $inode_id['data'], 'fieldEqualTo' => 'node_y_id', 'fieldSend' => 'node_x_id','node_class_id' => $node_ids_of_subclass);
                        $toptions                    = http_build_query($tdata);
                        $delData                     = callWebApi('getNodeXOfParticulerClass', $toptions);
                        $delData                     = json_decode($delData, true);

                        foreach($delData as $k => $v)
                        {
                            // Get All Node Instance ID - So that we can delete these sub class instances
                            $tedata                       = array('table' => 'node-instance', 'primary_col' => 'node_id', 'primary_val' => $v['node_x_id'], 'return_val' => 'node_instance_id');
                            $teoptions                    = http_build_query($tedata);
                            $tenode_id                   = callWebApi('getParticulerColumnValue', $teoptions);
                            $tenode_id                   = json_decode($tenode_id, true);

                            if(trim($tenode_id['data']) != '')
                            {
                                $delList[]               = $tenode_id['data'];

                            }
                        }
                    }


                    if(trim($node_instance_id) != '')
                    {
                        $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                    }
                }
                else if($MappingInstanceId == '1131077') // For Co-Buyer Quote API 
                {
                    // Get value from Array
                    $keyIndex                   = array_search('8395', $insProArray);
                    $valueCheck                 = $insCapArray[$keyIndex];
                    
                    // Get All Instance ID of Finance Deal Class
                    $data                       = array('primaryId' => FINANCE_DEALS_CLASS_ID, 'searchOn' => 'class', 'keyType' => 'node_instance_id');
                    $options                    = http_build_query($data);
                    $customerData              = callWebApi('getInstanceListOfParticulerClass', $options);
                    $customerData               = json_decode($customerData, true);

                    // Get Instance ID by checking value
                    $node_instance_id           = '';
                    foreach ($customerData['data'] as $key => $value) {
                        if (intval($value['CoBuyerID']) == intval($valueCheck)) {
                            $node_instance_id            = $key;
                        }
                    }

                    if(trim($node_instance_id) != '')
                    {
                        $createInstanceDataArray['node_instance_id']       = $node_instance_id;
                    }
                }
                
                // Set Required Structure
                $createInstanceDataArray['node_class_id']          = $mappingData['classArray']['node_class_id'];
                $createInstanceDataArray['node_class_property_id'] = $insProArray;
                $createInstanceDataArray['value']                  = $insCapArray;
                $createInstanceDataArray['is_email']               = 'N';
                $createInstanceDataArray['status']                 = 'P';
                //print_r($createInstanceDataArray);
                //die;

                // Call to Save the Instance Data
                $data                                              = array('data' => $createInstanceDataArray, 'action_id' => '1', 'structure_id' => '6');
                $options                                           = http_build_query($data);
                $returnResponse                                    = callWebApi('setStructure', $options);
                $returnResponse                                    = json_decode($returnResponse, true);

                $node_y_id                                         = '';
                if(intval($returnResponse['result']) == 0)
                {
                    $node_y_id                                     = $returnResponse['data']['node_id'];
                }

                if($node_y_id == '')
                    throw new Exception('Main instance is not create/update properly of data '.json_encode($createInstanceDataArray));
                // Code For Calling Subclass Instances 
                $newSubClassArray                                  = array();
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
                        // Loop Main Array to get Value, Property Name and Property Id Array
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
                                
                                /* Please Don't uncomment code without confirmation by Arvind Soni */
                                $data                                              = array('data' => $createInstanceDataArray, 'action_id' => '1', 'structure_id' => '6');
                                $options                                           = http_build_query($data);
                                $returnResponse                                    = callWebApi('setStructure', $options);
                                $returnResponse                                    = json_decode($returnResponse, true);
                                if(intval($returnResponse['result']) == 0)
                                {
                                    $node_x_id[]                                   = $returnResponse['data']['node_id'];
                                }

                                if($returnResponse['data']['node_id'] == '')
                                    throw new Exception('Sub instance is not create/update properly of data '.json_encode($createInstanceDataArray));
                            }
                        }
                    }
                    // Create X-Y Relation
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
                
                // Delete Old Instances
                if(count($delList) > $delList)
                {
                    /*new code added for performance issue*/
                    $data                       = array('instance_id' => $delList);
                    $options                    = http_build_query($data);
                    $returnResponse             = callWebApi('deleteInstance', $options);
                    $returnResponse             = json_decode($returnResponse, true);
                    /* end performance code */
                }
            }
            
            $_returnFileStatus     = $aws_file_name;
        }
        catch (Exception $e) {
            $cron_data_array['error_files_detail'][] = $_returnFileStatus = 'Error: '.$e->getMessage().' on file '.$e->getFile().' in line '. $e->getLine();
            $cron_data_array['error_files'][] = $aws_file_name;
        } 
        finally {
            return $_returnFileStatus;
        }
}

// Include AWS Class File
include "S3/AwsS3Core.php";
$sdkApi                         = new AwsS3Core();

$date                           = date('d-m-Y');
$time                           = date('h:i:s');
$cron_status_filename           = 'data/temp/cron_job_status_'.$date.'_'.$time.'.txt';
$cron_status_filename_array     = explode('_',basename($cron_status_filename,'.txt'));
$cron_data_array['start_time']  = date('d-m-Y h:i:s');

// Start: Code to get Updated Files from S3 Bucket For Current Date
$fileArray                      = array();
$tempFileArray                  = $sdkApi->getFolderFilesList('puidata/page_plugin/api_files/');
foreach ($tempFileArray as $key => $value) {
    if(date('Y/m/d') == date('Y/m/d',strtotime($value['date'])))
    {
        $fileArray[]            = $value['file_name'];
    }
    
}
// End
$max_execution_limit                    = 3;
$cron_data_array['all']                 = $fileArray;
$cron_data_array['success']             = array();
$cron_data_array['error_files']         = array();
$cron_data_array['error_files_detail']  = array();

// Start: Get Files from S3 Bucket, If not coming from email link. $_REQUEST['error_files'] is set when coming from link.
if(isset($_REQUEST['error_files']) && $_REQUEST['error_files'] != ''){
$fileArray                              = explode(',',$_REQUEST['error_files']);
$cron_data_array['all']                 = $fileArray;
$_finalResult                           = runCronJob($fileArray);
} else {
$_finalResult                           = runCronJob($fileArray);
}
// End

$cron_data_array['end_time']            = date('d-m-Y h:i:s');
$sdkApi->setFileData($cron_status_filename,json_encode($cron_data_array),"text");
// If Difference in Array: There is some Problem in the execution of Cron File.
$_filesInResult                         = array_diff($_finalResult, $fileArray);
// Sel Mail Header,Body and Footer.
$message                                = "";
$mailBody                               = "";
$mailHead                               = '<html>
                                            <head>
                                                <title></title>
                                            </head>
                                            <body>';
$mailFooter                             ='</body></html>';
// Check for Cron Execution, Set Messages, link, mailBody.
if(count($_filesInResult)){        
$message                                = "<h1>Cron not executed successfully.</h1>";
$_errorFiles                            = implode(",", $cron_data_array['error_files']);
$_errorFiles                            = '?error_files='.$_errorFiles;
$cronLink                               =  CURL_API_URL.$_errorFiles;                  
foreach($cron_data_array['error_files'] as $filenames) {
    $tdValue .='<tr><td>'.$filenames.'</td></tr>';
}
$mailBody = '<table cellpadding="5">
                <tr><td>Hi,</td><tr>
                <tr><td>Following files could not process: </td><tr>
                '.$tdValue.'
                <tr><a href='.$cronLink.' target="_blank">Retry</a></tr>
                </table>';
} else {
$message                                = "<h1>Cron executed successfully.</h1>";
$_success                               = array_diff($cron_data_array['success'], $cron_data_array['error_files']);
foreach($_success as $filenames) {
    $tdValue .='<tr><td>'.$filenames.'</td></tr>';
}
$mailBody = '<table cellpadding="5">
                <tr><td>Hi,</td><tr>
                <tr><td>Following files were inserted successfully: </td><tr>
                '.$tdValue.'
                </table>';
}
// Set Email Headers, to , bcc values
$mailMessage = $mailHead.$mailBody.$mailFooter;
$to      = "arvind.soni@prospus.com";
$subject = "Cron Job: Status";
$header  = "From:cron@dealclasses.com \r\n";
$header .= "Bcc: amit.bhardwaj@prospus.com";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/html; charset=iso-8859-1";
$retval = mail ($to,$subject,$mailMessage,$header);

echo $message.'<br>';
echo "<pre>";
// check Mail success.
if( $retval == true ) {
   echo "Mail sent successfully...";
}else {
   echo "Mail could not be sent...";
}
print_r(json_decode($sdkApi->getFileData($cron_status_filename),true));  

?>
