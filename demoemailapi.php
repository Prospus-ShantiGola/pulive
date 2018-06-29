<?php
function get_headers_from_curl_response($response)
{
    $headers 						= array();
    $header_text 					= substr($response, 0, strpos($response, "\r\n\r\n"));

    foreach (explode("\r\n", $header_text) as $i => $line)
    {
    	if ($i === 0)
        {
        	$new 					= explode(" ",$line);
        	$headers['http_code'] 	= $line;
        }
        else
        {
            list($key,$value) 		= explode(': ', $line);

            $headers[$key] 			= $value;
        }
    }
    return $headers;
}

function callCurl($url, $xml)
{
	$hdrarray=array('Authorization-Token: ucYu+iyTC36IoFwaO7CX7c8HAVg=');

	$ch 				= curl_init();	
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_HEADER, 1);
	curl_setopt($ch,CURLOPT_POST,1);
	curl_setopt($ch,CURLOPT_POSTFIELDS,$xml);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $hdrarray);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch,CURLOPT_TIMEOUT, 500);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
	$response = curl_exec($ch);
	
	$http_status 		= curl_getinfo($ch, CURLINFO_HTTP_CODE);

	if(curl_errno($ch)){   
	    echo 'Curl error: ' . curl_error($ch);
	}
	
	if($http_status!=200){
	  $response = "Error $http_status";
	}
	
	curl_close ($ch);

	return $response; 
}

function callApi()
{
	
	$url 				= "http://qa.api.marinemax.com/v1/email/send/plain-text";

	$xml 				= "<EmailParameters>
                            <ToEmailAddress>arvind.jp7@gmail.com</ToEmailAddress>
                            <ToFirstName>Arvind</ToFirstName>
                            <ToLastName>JP7</ToLastName>
                            <FromEmailAddress>info@marinemax.com</FromEmailAddress>
                            <FromDisplayName>MarineMax Digital Closing</FromDisplayName>
                            <Subject>MarineMax: Deal 85891 is Ready for Review</Subject>
                            <Body>Hi, Arvind JP7. Deal 85891 has been returned to you by Business Manager (arvind.soni46@gmail.com) and is ready for your review.</Body>
                        </EmailParameters>";

	$myXMLData			= callCurl($url, $xml);
	
	echo "<pre>";
	print_r($myXMLData);

}

echo callApi();
?>