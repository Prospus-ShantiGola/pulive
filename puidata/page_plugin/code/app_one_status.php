<?php

function exec_curl($url, $data, $action) {
    $ch = curl_init($url);
    $headers = array(
        "Content-type: text/xml;charset=\"utf-8\"",
        "Accept: text/xml",
        "Cache-Control: no-cache",
        "Pragma: no-cache",
        "SOAPAction: http://tempuri.org/IAppOneConnect/" . $action,
        "Content-length: " . strlen($data),
    ); //SOAPAction: your op URL

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // the SOAP request
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    $error = curl_error($ch);
    if ($error) {
        die(print_r($error, 1));
    }
    curl_close($ch);

    return $response;
}

function cleanXML($xml) {
    // A REGULAR EXPRESSION TO MUNG THE XML
    $rgx = '#'           // REGEX DELIMITER
            . '('           // GROUP PATTERN 1
            . '\<'          // LOCATE A LEFT WICKET
            . '/{0,1}'      // MAYBE FOLLOWED BY A SLASH
            . '.*?'         // ANYTHING OR NOTHING
            . ')'           // END GROUP PATTERN
            . '('           // GROUP PATTERN 2
            . ':{1}'        // A COLON (EXACTLY ONE)
            . ')'           // END GROUP PATTERN
            . '#'           // REGEX DELIMITER
    ;
    // INSERT THE UNDERSCORE INTO THE TAG NAME
    $rep = '$1'          // BACKREFERENCE TO GROUP 1
            . '_'           // LITERAL UNDERSCORE IN PLACE OF GROUP 2
    ;
    // PERFORM THE REPLACEMENT
    $xml = preg_replace($rgx, $rep, $xml);

    // FIX THE URLS
    $xml = str_replace('https_//', 'https://', $xml);

    return $xml;
}

$appOneData = $builderApiObj->getDealAppOneInfo($post);
$appOneData = json_decode($appOneData, true);

// APPLICATION ID exists
if (isset($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) && intval($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) > 0) {
    // approved - 1033872,1036933,1040610
    // incomplete - 1037180
    $applicationId = intval($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]);

    $data = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <soap:Body>
            <GetApplicationData xmlns="http://tempuri.org/">
              <username>marinemax</username>
              <password>Password123</password>
              <SenderDealerID></SenderDealerID>
              <AppOneDealerID>1000472</AppOneDealerID>
              <applicationID>' . $applicationId . '</applicationID>
              <responseSchemaVersion>2.7</responseSchemaVersion>
            </GetApplicationData>
          </soap:Body>
        </soap:Envelope>';

    // CURL REQUEST
    $action = 'GetApplicationData';
    $xmlRes1 = exec_curl('https://demo.external.appone.net/connect/dms/AppOneConnect.svc/basic', $data, $action);
    $xml = simplexml_load_string(cleanXML($xmlRes1));

    $appStatus = '';
    $error = '';
    if (is_object($xml)) {
        if (count($xml->s_Body->GetApplicationDataResponse->GetApplicationDataResult->ErrorList->Error)) {
            $error = "GetApplicationData error - " . $xml->s_Body->GetApplicationDataResponse->GetApplicationDataResult->ErrorList->Error->ErrorMessage;
        } else {
            $newxml = $xml->s_Body->GetApplicationDataResponse->GetApplicationDataResult->ApplicationList->string;
            // GET STATUS
            $parsedXml = simplexml_load_string(cleanXML($newxml));
            $status = (array) $parsedXml->Status;
            $appStatus = $status[0];
        }
    } else {
        $error = "GetApplicationData service failed.";
    }
    $response = array('application_id' => $applicationId, 'status' => $appStatus, 'error' => $error);
} else {
    $response = array('application_id' => 'N/A', 'status' => 'N/A', 'error' => '');
    //GetApplicationData error - Error while validating AppOneApplicationResponseXML against the AppOneApplicationResponse schema while doing schema validation The element is invalid - The value is invalid according to its datatype
}

$resJsonArr = array('status' => '1', 'message' => '');
$resJsonArr['data'] = $response;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;

//    print json_encode($response);
//    exit;
?>