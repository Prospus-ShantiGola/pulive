<?php
ini_set("display_errors", 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
    curl_setopt($ch,CURLOPT_ENCODING , "");
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

if ($_GET) 
{
    $getArray   = $_GET;
    if(trim($getArray['API']) == '')
    {
        echo "<span style='color:red;' >Please set API name.</span>";
        echo "<br/>";
    }
    else
    {
    	$url                    = '';
        foreach($getArray as $key => $value)
        {
            if(strtolower($key) != 'api')
            {
                $url .= '&'.$key.'='.$value;
            }
        }

        $customerArray          = callMarinemaxAPI(strtoupper(trim($getArray['API'])),$url);
        echo "<pre>";
		print_r($customerArray);
    }
}


?>