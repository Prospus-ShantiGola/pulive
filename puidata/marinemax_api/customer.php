<?php
	function callCurl($url)
	{
		$ch 					= curl_init();
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
		curl_setopt($ch,CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);
		$data 					= curl_exec($ch);
		curl_close($ch);
		return $data;
	}

	function callApi($customerNo)
	{
		//$url 					= "https://integrator.marinemax.com/rest/V1/CUSTOMERS?X-Connection=ASTRAG2&Location=MSP&CustomerNo=".$customerNo;
		$url 					= "https://integrator.marinemax.com/rest/V1/UNITS?X-Connection=ASTRAG2&Location=MSP&StockNo=128897";

		$myXMLData				= callCurl($url);
		$xml 					= simplexml_load_string($myXMLData) or die("Error: Cannot create object");
		
		return $xml;
	}

	function callFields($node_class_property_caption_array,$value)
	{
		foreach($value as $k => $v)
		{
			if(!is_array($v))
			$node_class_property_caption_array[$k] = $v;
			else
			$node_class_property_caption_array = callFields($node_class_property_caption_array,$v);
		}

		return $node_class_property_caption_array;
	}

	function callFieldsWithParent($node_class_property_caption_array,$value,$key)
	{
		foreach($value as $k => $v)
		{
			$k = $key.' > '.$k;
			if(is_array($v))
			{
				if(!empty($v))
				$node_class_property_caption_array = callFields($node_class_property_caption_array,$v,$k);
				else
				$node_class_property_caption_array[$k] = '';
			}
			else
			$node_class_property_caption_array[$k] = $v;
		}

		return $node_class_property_caption_array;
	}

	$c_no = $_GET['c_no'];

	if(intval($c_no) > 0)
	{
		$xmlArray 					= callApi($c_no);
		$array 						= json_encode($xmlArray);
		$customerArray 				= json_decode($array, true);

		$node_class_property_id_array  = array(
			'6315' =>  'CustomerNo',
		    '6316' =>  'FirstName',
		    '6317' =>  'LastName',
		    '6318' =>  'MiddleInitial',
		    '6319' =>  'Greeting',
		    '6320' =>  'PhoneHome',
		    '6321' =>  'PhoneBusiness',
		    '6322' =>  'PhoneMobile',
		    '6323' =>  'EmailPrimary',
		    '6324' =>  'EmailSecondary',
		    '6325' =>  'TaxCode',
		    '6326' =>  'TaxExemptNo',
		    '6328' =>  'AddressLine1',
		    '6329' =>  'AddressLine2',
		    '6330' =>  'City',
		    '6331' =>  'State',
		    '6332' =>  'ZipCode',
		    '6333' =>  'Country',
		    '6334' =>  'BirthDate',
		    '6335' =>  'Age',
		    '6336' =>  'PrimaryLocn',
		    '6337' =>  'Code',
		    '6338' =>  'SpouseFirstName',
		    '6339' =>  'SpouseLastName',
		    '6340' =>  'SpousePhone',
		    '6341' =>  'SpouseAddressLine1',
		    '6342' =>  'SpouseAddressLine2',
		    '6343' =>  'SpouseCity',
		    '6344' =>  'SpouseState',
		    '6345' =>  'SpouseZipCode',
		    '6346' =>  'SpouseBirthDate',
		    '6347' =>  'SpouseAge',
		    '6349' =>  'SalesRepCode',
		    '6350' =>  'SalesRepName',
		    '6351' =>  'SalesRepPct'
		);

		/* For Normal */
		/*$node_class_property_caption_array  = array();
		foreach($customerArray['Record'] as $key => $value)
		{
			if(!is_array($value))
			$node_class_property_caption_array[$key] = $value;
			else
			$node_class_property_caption_array = callFields($node_class_property_caption_array,$value);
		}*/

		/* For With Parent */
		$node_class_property_caption_array  = array();
		foreach($customerArray['Record'] as $key => $value)
		{
			$key = 'Record'.' > '.$key;
			if(is_array($value))
			{
				if(!empty($value))
				$node_class_property_caption_array = callFieldsWithParent($node_class_property_caption_array,$value,$key);
				else
				$node_class_property_caption_array[$key] = '';	
			}
			else
			$node_class_property_caption_array[$key] = $value;
		}

		/*if(count($node_class_property_caption_array) > 0)
		{
			$newDataArray 							= array();
			$newDataArray['node_class_id'] 			= 770;
			foreach($node_class_property_id_array as $propertyId => $propertyName)
			{
				if(trim($node_class_property_caption_array[$propertyName]) != "")
				{
					$newDataArray['node_class_property_id'][] = $propertyId;
					$newDataArray['value'][] = $node_class_property_caption_array[$propertyName];
				}
			}

			$newDataArray['is_email'] = 'N';
		    $newDataArray['status'] = 'P';

		    include "config.php";
		    include "builderApi.php";
			$builderApiObj = new builderApi();
		    $returnNewResponse = $builderApiObj->setDataAndStructure($newDataArray, '1', '6');
		    $returnResponse = json_decode($returnNewResponse, true);

		    echo "<pre>";
		    print_r($returnResponse);
		}*/
		
	}

	

	echo "<pre>";
	print_r($customerArray);
	print_r($node_class_property_caption_array);
	/*print_r($newDataArray);
	
	die;*/
?>