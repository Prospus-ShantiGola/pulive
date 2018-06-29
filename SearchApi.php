<?php

$_data['location_lookup'] = $_REQUEST['location'];
$_data['fi_quote_lookup'] = $_REQUEST['quote'];
$_data['customer_lookup'] = $_REQUEST['customer'];
$_data['stock_lookup'] = $_REQUEST['stock'];
$_data['last_name_lookup'] = $_REQUEST['lastname'];
$_data['phone_num_lookup'] = $_REQUEST['phone'];
$_data['email_lookup'] = $_REQUEST['email'];
//$_data['rel'] = $_REQUEST['rel'];
//$_data['perpage'] = $_REQUEST['perpage'];
$_data['page_no'] = $_REQUEST['page'];
$url = callSearchApi($_data);
print_r($url);

function callSearchApi($request)
	{
		$errorArray = array(
						'201' => 'Request was processed successfully. Resources were created or modified. POST, PUT, PATCH or DELETE methods.',
						'204' => 'Request was processed successfully but no data returned. GET method only.',
						'400' => 'There was a problem processing the request. The response body will contain additional information.',
						'401' => 'The request was refused because the authentication information was not provided or is not valid.',
						'404' => 'The requested resource could not be found.',
						'405' => 'The requested HTTP method is not supported by the resource.',
						'429' => 'Too many requests.',
						'500' => 'Server processing error.'
					   );


		$url = 'https://devintegrator.marinemax.com/rest/V1/';

		$_case = '';
		if($request['fi_quote_lookup'] != ''){	
			$_case = 'financeQuote';
                        $_fields = 'CustID,StockNo';
		} elseif ($request['customer_lookup'] != '' || $request['stock_lookup'] != ''){
			$_case = 'financeQuoteSearch';
                        $_fields = 'QuoteNo,FirstName,LastName,StockNo,StockDesc,StatusDesc';
		} else {
			$_case = 'customerSearch';
                        $_fields = 'CustomerNo,FirstName,LastName,PhoneBusiness,EmailPrimary';
		}

		switch ($_case) {
		    case 'financeQuote':                        
		    	$url .= 'FINANCE_DEALS';
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location_lookup']);
                        $url .= ifEmpty('&Fields=',$_fields);
		    	$url .= ifEmpty('&QuoteNo=',$request['fi_quote_lookup']);
                        $url .= ifEmpty('&Page=',$request['page_no']);
		        break;
                    
		    case 'financeQuoteSearch':                        
		    	$url .= 'FINANCE_DEALS';
		    	$url .= '/SEARCH';
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location_lookup']);
                        $url .= ifEmpty('&Fields=',$_fields);
		    	$url .= ifEmpty('&CustomerNo=',$request['customer_lookup']);                        
		    	$url .= ifEmpty('&StockNo=',$request['stock_lookup']);
                        $url .= ifEmpty('&Page=',$request['page_no']);
		        break;
                    
		    case 'customerSearch':                        
		    	$url .= 'CUSTOMERS';
		    	$url .= '/SEARCH';
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location_lookup']);
                        $url .= ifEmpty('&Fields=',$_fields);
		    	$url .= ifEmpty('&LastName=',$request['last_name_lookup']);
		    	$url .= ifEmpty('&Email=',$request['email_lookup']);
		    	$url .= ifEmpty('&Phone=',$request['phone_num_lookup']);
                        $url .= ifEmpty('&Page=',$request['page_no']);
		        break;
		    default:
		}
		$myXMLData			= callCurl($url);

		$myXMLData 			= explode("<?xml",$myXMLData);
		$myXMLData[1]       = "<?xml".$myXMLData[1];
                echo '<pre>';
                echo $url;
		$headers = get_headers_from_curl_response($myXMLData[0]);
		print_r($headers);
		$xml = simplexml_load_string($myXMLData[1]);
		$returnArray = json_encode($xml);
	 	$returnArray = json_decode($returnArray, true);	 	
	 	$_resultData = $returnArray['Record'];	 	
	 	$i = 0;
	 	$finalResult = array();
                $returnResult = array();
                echo 'pre';
                //print_r($_resultData);
                $returnResult['total_records'] = $headers['X-Count-Items'];
	 	if($_case == 'financeQuoteSearch') {	 		
	 		$_multipleRecord = is_array($returnArray['Record'][0]) ? 1 : 0 ;
	 		if($_multipleRecord){
	 			foreach($_resultData as $_resultArr)
	 			{
                                    if(isset($request['is_quote_lookup']) && $request['is_quote_lookup']!= ''){
                                        // If Search for quote no only one result will be shown
                                        if($request['is_quote_lookup'] == $_resultArr['QuoteNo']){
                                            $fName = is_array($_resultArr['FirstName']) ? '' : $_resultArr['FirstName'];
                                            $lName = is_array($_resultArr['LastName']) ? '' : $_resultArr['LastName'];
                                            $finalResult[$i]['QuoteNo'] = $_resultArr['QuoteNo'];
                                            $finalResult[$i]['CustomerName'] = $fName.' '.$lName;
                                            $finalResult[$i]['StockNo'] = $_resultArr['StockNo'];
                                            $finalResult[$i]['StockDesc'] = $_resultArr['StockDesc'];
                                            $finalResult[$i]['StatusDesc'] = $_resultArr['StatusDesc'];
                                            $returnResult['total_records'] = 1;
                                            $i++; 
                                        }
                                    } else {
                                        $fName = is_array($_resultArr['FirstName']) ? '' : $_resultArr['FirstName'];
                                        $lName = is_array($_resultArr['LastName']) ? '' : $_resultArr['LastName'];
	 				$finalResult[$i]['QuoteNo'] = $_resultArr['QuoteNo'];
	 				$finalResult[$i]['CustomerName'] = $fName.' '.$lName;
	 				$finalResult[$i]['StockNo'] = $_resultArr['StockNo'];
	 				$finalResult[$i]['StockDesc'] = $_resultArr['StockDesc'];
	 				$finalResult[$i]['StatusDesc'] = $_resultArr['StatusDesc'];
	 				$i++;
                                    }
	 			}
	 		} else {
                                        $fName= is_array($_resultData['FirstName']) ? '' : $_resultData['FirstName'];
                                        $lName= is_array($_resultData['LastName']) ? '' : $_resultData['LastName'];
	 				$finalResult[$i]['QuoteNo'] = $_resultData['QuoteNo'];
	 				$finalResult[$i]['CustomerName'] = $fName.' '.$lName;
	 				$finalResult[$i]['StockNo'] = $_resultData['StockNo'];
	 				$finalResult[$i]['StockDesc'] = $_resultData['StockDesc'];
	 				$finalResult[$i]['StatusDesc'] = $_resultData['StatusDesc'];
	 		}
                        $returnResult['item'] = $finalResult;
	 		$returnResult['isCustomerSearch'] = 0;	
	 		
	 	} elseif($_case == 'financeQuote') {
	 		$_data['location_lookup'] = $request['location_lookup'];
                        $_data['is_quote_lookup'] = $request['fi_quote_lookup'];
			$_data['fi_quote_lookup'] = '';
			$_data['customer_lookup'] = $_resultData['CustID'];
			$_data['stock_lookup'] = $_resultData['StockNo'];
			if($_resultData['CustID'] == '' && $_resultData['StockNo'] == '') {
				$_case = 'financeQuoteSearch';
				$finalResult[0]['QuoteNo'] = '';
			} else {
				$_finaldata = callSearchApi($_data);				
				return $_finaldata;
			}			

	 	} else {
	 		$_multipleRecord = is_array($returnArray['Record'][0]) ? 1 : 0 ;
	 		if($_multipleRecord){
	 			foreach($_resultData as $_resultArr)
	 			{
                                        $fName = is_array($_resultArr['FirstName']) ? '' : $_resultArr['FirstName'];
                                        $lName = is_array($_resultArr['LastName']) ? '' : $_resultArr['LastName'];
	 				$finalResult[$i]['CustomerNo'] = $_resultArr['CustomerNo'];
	 				$finalResult[$i]['CustomerName'] = $fName.' '.$lName;
	 				$finalResult[$i]['PhoneBusiness'] = is_array($_resultArr['PhoneBusiness']) ? $_resultArr['PhoneBusiness'][0] : $_resultArr['PhoneBusiness'] ;
	 				$finalResult[$i]['Email'] = is_array($_resultArr['EmailPrimary']) ? $_resultArr['EmailPrimary'][0] : $_resultArr['EmailPrimary']; 
	 				$i++;
	 			}
	 		} else {
                                        $fName= is_array($_resultData['FirstName']) ? '' : $_resultData['FirstName'];
                                        $lName= is_array($_resultData['LastName']) ? '' : $_resultData['LastName'];
	 				$finalResult[$i]['CustomerNo'] = $_resultData['CustomerNo'];
	 				$finalResult[$i]['CustomerName'] = $fName.' '.$lName;
	 				$finalResult[$i]['PhoneBusiness'] = is_array($_resultData['PhoneBusiness']) ? $_resultData['PhoneBusiness'][0] : $_resultData['PhoneBusiness'] ;
	 				$finalResult[$i]['Email'] = is_array($_resultData['EmailPrimary']) ? $_resultData['EmailPrimary'][0] : $_resultData['EmailPrimary'] ;
	 		}
                        $returnResult['item'] = $finalResult;
	 		$returnResult['isCustomerSearch'] = 1;		 		
	 	}
	 	// Return Empty Array
	 	if($_case == 'customerSearch' && empty($finalResult[0]['CustomerNo'])) {
                        $returnResult['total_records'] = 0;
                        $returnResult['item'] = array();
	 		$returnResult['isCustomerSearch'] = 1;
	 	} elseif($_case == 'financeQuoteSearch' && empty($finalResult[0]['QuoteNo'])) {
                        $returnResult['total_records'] = 0;
                        $returnResult['item'] = array();
	 		$returnResult['isCustomerSearch'] = 0;
	 	}	
	 	return $returnResult;
	}	


function get_headers_from_curl_response($response)
	{
	    $headers = array();

	    $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

	    foreach (explode("\r\n", $header_text) as $i => $line)
	        if ($i === 0)
	        {
	        	$new = explode(" ",$line);
	        	$headers['http_code'] = $line;//.$new[1];
	        }
	        else
	        {
	            list ($key, $value) = explode(': ', $line);

	            $headers[$key] = $value;
	        }

	    return $headers;
	}

	function callCurl($url)
	{
		$ch 					= curl_init();
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch,CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
		curl_setopt($ch,CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);

		$data 					= curl_exec($ch);  
                
        $http_status 			= curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($http_status != 200) {
            $http_status = "API Error - $http_status";
        }
        else {
            $http_status = "API Status - $http_status";
        }

		curl_close($ch);
		return $data;
	}

	function ifEmpty($string,$param){
		if ($param === '') {
			return '';
		} else {
			return $string.$param;
		}
	}

?>