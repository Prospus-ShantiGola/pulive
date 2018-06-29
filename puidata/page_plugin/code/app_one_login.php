<?php

/*
 * File Created By: Amit Malakar
 * Date: 14-Nov-2016
 * App One Login
 */

/**
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Field length validation
 * @param $field
 * @param $min
 * @param $max
 * @return bool
 */
function fieldLength($field, $min, $max) {
    if (strlen($field) >= $min && strlen($field) <= $max) {
        return true;
    } else {
        return false;
    }
}

/**
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Regex Pattern validation
 * @param $field
 * @param $pattern
 * @return bool
 */
function patternMatch($field, $pattern) {
    //$pattern = '[0-9]{3,3}-[0-9]{2,2}-[0-9]{4,4}';
    $res = preg_match("/$pattern/", $field, $match);
    if (isset($match[0])) {
        return true;
    } else {
        return false;
    }
}

/**
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Update phone number format
 * @param $phone
 * @return mixed
 */
function formatPhone($phone) {
    return preg_replace('/[()]/', '', str_replace(' ', '-', $phone));
}

/**
 * Function not in use
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Validate all Data
 * @param $builderApiObj
 * @param $deal
 * @return array
 */
function validateData($builderApiObj, $deal) {
    $dealInfoJson = $builderApiObj->getDealOperationInfo($deal);
    $dealInfo = json_decode($dealInfoJson, true);

    $isValid = TRUE;

    if (fieldLength($dealInfo['data']['7520'], 0, 50)) {
        $data['salesPersonName'] = $dealInfo['data']['7520'];
    } else {
        $isValid = false;
        $data['salesPersonName'] = '';
        $validationMsg .= 'SalesPersonName length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['3211'], 0, 20)) {
        $data['firstName'] = $dealInfo['data']['3211'];
    } else {
        $isValid = false;
        $data['firstName'] = '';
        $validationMsg .= 'FirstName length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['3240'], 0, 20)) {
        $data['lastName'] = $dealInfo['data']['3240'];
    } else {
        $isValid = false;
        $data['lastName'] = '';
        $validationMsg .= 'LastName length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['6519'], 11, 11)) {
        if (patternMatch($dealInfo['data']['6519'], '[0-9]{3,3}-[0-9]{2,2}-[0-9]{4,4}')) {
            $data['ssn'] = '<SSN>' . $dealInfo['data']['6519'] . '</SSN>';
        } else {
            $isValid = false;
            $data['ssn'] = '';
            $validationMsg .= 'SSN pattern is not valid.<br />';
        }
    } else {
        $ssn = '';
    }
    if (!empty($dealInfo['data']['6334'])) {
        $data['dob'] = '<DOB>' . date("Y-m-d", strtotime($dealInfo['data']['6334'])) . '</DOB>';
    } else {
        $isValid = false;
        $data['dob'] = '';
    }
    $data['homePhone'] = !empty($dealInfo['data']['3241']) ? '<HomePhone>' . formatPhone($dealInfo['data']['3241']) . '</HomePhone>' : '';
    $data['mobilePhone'] = !empty($dealInfo['data']['6332']) ? '<MobilePhone>' . formatPhone($dealInfo['data']['6332']) . '</MobilePhone>' : '';
    $data['dlno'] = !empty($dealInfo['data']['6520']) ? $dealInfo['data']['6520'] : '';
    if (fieldLength($dealInfo['data']['3213'], 3, 50)) {
        $data['city'] = '<City>' . $dealInfo['data']['3213'] . '</City>';
    } else {
        $isValid = false;
        $data['city'] = '';
    }
    if (fieldLength($dealInfo['data']['6222'], 2, 2)) {
        $data['state'] = '<State>' . $dealInfo['data']['6222'] . '</State>';
    } else {
        $isValid = false;
        $data['state'] = '';
    }
    if (fieldLength($dealInfo['data']['6223'], 5, 5)) {
        if (patternMatch($dealInfo['data']['6223'], '[0-9]{5,5}')) {
            $data['zipcode'] = '<ZipCode>' . $dealInfo['data']['6223'] . '</ZipCode>';
        } else {
            $isValid = false;
            $data['zipcode'] = '';
        }
    } else {
        $isValid = false;
        $data['zipcode'] = '';
        $validationMsg .= 'ZipCode length is not valid.<br />';
    }
    $data['address'] = trim($dealInfo['data']['6328'] . ' ' . $dealInfo['data']['6329'] . ' ' . $dealInfo['data']['6330'] . ' ' . $dealInfo['data']['6331'] . ' ' . $dealInfo['data']['6332']);
    $data['mailAddress'] = trim($dealInfo['data']['6555'] . ' ' . $dealInfo['data']['6556'] . ' ' . $dealInfo['data']['6557'] . ' ' . $dealInfo['data']['6558'] . ' ' . $dealInfo['data']['6559']);
    $data['isCurrent'] = 'false';
    $data['isMailing'] = 'false';
    if ($data['address'] === $data['mailAddress'] && $data['address'] !== '') {
        $data['isCurrent'] = 'true';
        $data['isMailing'] = 'true';
    }
    if (!empty($dealInfo['data']['6566'])) {
        $data['howLongYears'] = '<HowLongYears>' . $dealInfo['data']['6566'] . '</HowLongYears>';
    } else {
        $isValid = false;
        $data['howLongYears'] = '';
    }
    if (strlen($dealInfo['data']['6567'])) {
        $data['howLongMonths'] = '<HowLongMonths>' . $dealInfo['data']['6567'] . '</HowLongMonths>';
    } else {
        $isValid = false;
        $data['howLongMonths'] = '';
    }
    if (fieldLength($dealInfo['data']['6532'], 3, 50)) {
        $data['emEmployerName'] = $dealInfo['data']['6532'];
    } else {
        $isValid = false;
        $data['emEmployerName'] = '';
        $validationMsg .= 'Employer Name length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['6541'])) {
        $data['emGrossSalary'] = $dealInfo['data']['6541'];
    } else {
        $isValid = false;
        $data['emGrossSalary'] = '';
        $validationMsg .= 'Employer GrossSalary length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['6539'])) {
        $data['emHowLongYears'] = $dealInfo['data']['6539'];
    } else {
        $isValid = false;
        $data['emHowLongYears'] = '';
        $validationMsg .= 'Employer HowLongYears length is not valid.<br />';
    }
    if (strlen($dealInfo['data']['6540'])) {
        $data['emHowLongMonths'] = $dealInfo['data']['6540'];
    } else {
        $isValid = false;
        $data['emHowLongMonths'] = '';
        $validationMsg .= 'Employer HowLongMonths length is not valid.<br />';
    }
    $data['motNumOrder'] = '1'; //!empty($dealInfo['data']['6586'])?$dealInfo['data']['6586']:'1';
    if (fieldLength($dealInfo['data']['6612'], 0, 20)) {
        $data['motSerial'] = $dealInfo['data']['6612'];
    } else {
        $isValid = false;
        $data['motSerial'] = '';
        $validationMsg .= 'Motor Serial length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['3219'])) {
        $data['motYear'] = $dealInfo['data']['3219'];
    } else {
        $isValid = false;
        $data['motYear'] = '';
        $validationMsg .= 'Motor Year length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['3218'], 0, 30)) {
        $data['motMake'] = $dealInfo['data']['3218'];
    } else {
        $isValid = false;
        $data['motMake'] = '';
        $validationMsg .= 'Motor Make length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['3220'], 0, 30)) {
        $data['motModel'] = $dealInfo['data']['3220'];
    } else {
        $isValid = false;
        $data['motModel'] = '';
        $validationMsg .= 'Motor Model length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['6571'], 0, 30)) {
        $data['motType'] = preg_replace('/\s+/', '', $dealInfo['data']['6571']);
    } else {
        $isValid = false;
        $data['motType'] = '';
        $validationMsg .= 'Motor Type length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['6613'])) {
        $data['motHorsePower'] = $dealInfo['data']['6613'];
    } else {
        $isValid = false;
        $data['motHorsePower'] = '';
        $validationMsg .= 'Horse Power is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['6657'], 0, 20)) {
        $data['trSerial'] = $dealInfo['data']['6657'];
    } else {
        $isValid = false;
        $data['trSerial'] = '';
        $validationMsg .= 'Trailor Serial length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['6624'])) {
        $data['trYear'] = $dealInfo['data']['6624'];
    } else {
        $isValid = false;
        $data['trYear'] = '';
        $validationMsg .= 'Trailor Year is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['6623'], 0, 30)) {
        $data['trMake'] = $dealInfo['data']['6623'];
    } else {
        $isValid = false;
        $data['trMake'] = '';
        $validationMsg .= 'Trailor Make length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7431'])) {
        $data['sellingPrice'] = $dealInfo['data']['7431'];
    } else {
        $isValid = false;
        $data['sellingPrice'] = '';
        $validationMsg .= 'Selling Price is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7467'])) {
        $data['cashDown'] = $dealInfo['data']['7467'];
    } else {
        $isValid = false;
        $data['cashDown'] = '';
        $validationMsg .= 'Cash Down is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7649'])) {
        $data['totalAmountFinanced'] = $dealInfo['data']['7649'];
    } else {
        $isValid = false;
        $data['totalAmountFinanced'] = '';
        $validationMsg .= 'TotalAmount Financed is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7644'])) {
        $data['term'] = $dealInfo['data']['7644'];
    } else {
        $isValid = false;
        $data['term'] = '';
        $validationMsg .= 'Term is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7645'])) {
        $data['rate'] = $dealInfo['data']['7645'];
    } else {
        $isValid = false;
        $data['rate'] = '';
        $validationMsg .= 'Rate is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7646'])) {
        $data['daysToFirstPayment'] = $dealInfo['data']['7646'];
    } else {
        $isValid = false;
        $data['daysToFirstPayment'] = '';
        $validationMsg .= 'DaysToFirstPayment is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7469'])) {
        $data['trInNumOrder'] = $dealInfo['data']['7469'];
    } else {
        $isValid = false;
        $data['trInNumOrder'] = '';
        $validationMsg .= 'TradeInInfo NumOrder is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['7478'], 0, 20)) {
        $data['trInSerial'] = $dealInfo['data']['7478'];
    } else {
        $isValid = false;
        $data['trInSerial'] = '';
        $validationMsg .= 'TradeInInfo Serial length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['7474'], 1, 30)) {
        $trInMake = $dealInfo['data']['7474'];
    } else {
        $isValid = false;
        $trInMake = '';
        $validationMsg .= 'TradeInInfo Make length is not valid.<br />';
    }
    if (fieldLength($dealInfo['data']['7475'], 1, 30)) {
        $trInModel = $dealInfo['data']['7475'];
    } else {
        $isValid = false;
        $trInModel = '';
        $validationMsg .= 'TradeInInfo Model length is not valid.<br />';
    }
    if (!empty($dealInfo['data']['7445'])) {
        $data['trInTradeInAllowance'] = $dealInfo['data']['7445'];
    } else {
        $isValid = false;
        $data['trInTradeInAllowance'] = '';
        $validationMsg .= 'TradeInInfo Allowance is not valid.<br />';
    }
    if (strlen($dealInfo['data']['7446'])) {
        $data['trInTradeInPayoff'] = $dealInfo['data']['7446'];
    } else {
        $isValid = false;
        $data['trInTradeInPayoff'] = '';
        $validationMsg .= 'TradeInInfo Payoff is not valid.<br />';
    }
    $data['customerId'] = $dealInfo['data']['3210'];

    if (!$isValid) {
        return array('error' => $validationMsg, 'data' => $data);
    } else {
        return array('data' => $data);
    }
}

function libxml_display_error($error) {
    $return = "<br/>\n";
    switch ($error->level) {
        case LIBXML_ERR_WARNING:
            $return .= "<b>Warning $error->code</b>: ";
            break;
        case LIBXML_ERR_ERROR:
            $return .= "<b>Error $error->code</b>: ";
            break;
        case LIBXML_ERR_FATAL:
            $return .= "<b>Fatal Error $error->code</b>: ";
            break;
    }
    $return .= trim($error->message);
    // if ($error->file) {
    //     $return .= " in <b>$error->file</b>";
    // }
    $return .= " on line <b>$error->line</b>\n";

    return $return;
}

/**
 * Function not in use
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Get Default products and fees list
 * @return Exception|SoapFault
 */
function GetDefaultBackendProductsAndFees() {
    try {
        $trace = true;
        $exceptions = false;
        $wsdl = APPONE_API_URL . '/connect/dms/AppOneConnect.svc?singleWsdl';
        $client = new SoapClient($wsdl, array('trace' => $trace, 'exceptions' => $exceptions, 'cache_wsdl' => WSDL_CACHE_NONE));
        $username = 'marinemax';
        $password = 'Password123';
        $xml_array['username'] = $username;
        $xml_array['password'] = $password;
        $xml_array['SenderDealerID'] = '';
        $xml_array['AppOneDealerID'] = '1000472';
        //$client = new SoapClient($wsdl);
        $result = $client->GetDefaultBackendProductsAndFees($xml_array);
        //echo '<h2>Result</h2><pre>';
        //print_r($result);
        $GetDefaultBackendProductsAndFeesBody = $result->GetDefaultBackendProductsAndFeesResult;
        $respArray = $GetDefaultBackendProductsAndFeesBody;

        return $respArray;
    } catch (SoapFault $e) {
        return $e;
    }
}

/**
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Create Borrower XML data
 * @param $xml
 * @param $numOrder
 * @param $data
 * @param $isIndividual
 * @return mixed
 */
function borrower($xml, $numOrder, $data, $isIndividual) {

    $borrower = $xml->createElement("Borrower");
    $borrower->appendChild($xml->createElement('NumOrder', $numOrder));

    if (($numOrder == '1' && $data['fiUseEntity'] == 'N') || $isIndividual == 'Y') {
        $borrower->appendChild($xml->createElement('Type', 'INDIVIDUAL'));
        if (array_key_exists('cuFirstName', $data))
            $borrower->appendChild($xml->createElement('FirstName', $data['cuFirstName']));
        if (array_key_exists('cuMiddleInitial', $data))
            $borrower->appendChild($xml->createElement('MiddleName', $data['cuMiddleInitial']));
        if (array_key_exists('cuLastName', $data))
            $borrower->appendChild($xml->createElement('LastName', $data['cuLastName']));
        //$borrower ->appendChild($xml->createElement('Suffix','2.7'));
        if (array_key_exists('cuSSN', $data)) {
            if (patternMatch($data['cuSSN'], '^[0-9]{3,3}-[0-9]{2,2}-[0-9]{4,4}$')) {
                $borrower->appendChild($xml->createElement('SSN', $data['cuSSN']));
            } else {
                // remove if '-' exists
                $ssn = str_replace('-', '', $data['cuSSN']);
                if (strlen($ssn) == 9) {
                    // convert to SSN with '-'
                    $ssn = substr_replace($ssn, '-', 3, 0);
                    $ssn = substr_replace($ssn, '-', 6, 0);
                    $borrower->appendChild($xml->createElement('SSN', $ssn));
                } else {
                    // remove SSN field
                }
            }
        }
        if (array_key_exists('cuDOB', $data) && strlen($data['cuDOB']) !== 0)
            $borrower->appendChild($xml->createElement('DOB', $data['cuDOB']));
        if (array_key_exists('cuPhoneHome', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cuPhoneHome']))) === 12) {
            $phoneHome = str_replace(') ', '-', str_replace('(', '', $data['cuPhoneHome']));
            $borrower->appendChild($xml->createElement('HomePhone', $phoneHome));
        }
        if (array_key_exists('cuPhoneMobile', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cuPhoneMobile']))) === 12) {
            $phoneMobile = str_replace(') ', '-', str_replace('(', '', $data['cuPhoneMobile']));
            $borrower->appendChild($xml->createElement('MobilePhone', $phoneMobile));
        }
        if (array_key_exists('cuDLNo', $data))
            $borrower->appendChild($xml->createElement('DLNo', str_replace('-', '', $data['cuDLNo'])));
        //$borrower ->appendChild($xml->createElement('DLState','2.7'));
        if (array_key_exists('cuEmail', $data) && !is_null($data['cuEmail']))
            $borrower->appendChild($xml->createElement('Email', $data['cuEmail']));

        //Addresses
        $addresses = $xml->createElement("Addresses");
        if ((array_key_exists('cuCity', $data) && strlen($data['cuCity']) !== 0) && (array_key_exists('cuState', $data) && strlen($data['cuState']) !== 0) && (array_key_exists('cuAddress1', $data) && strlen($data['cuAddress1']) !== 0) && (array_key_exists('cuZipCode', $data) && strlen($data['cuZipCode']) !== 0)) {
            //$r       = $k + 1;
            $address = $xml->createElement("Address");
            $addresses->appendChild($address);
            if (array_key_exists('cuAddress1', $data)) {
                // Num 1 isCurrent TRUE
                $address->appendChild($xml->createElement('IsCurrent', 'true'));
                if ($data['cuAddress1'] === $data['cuMailAddress1'])
                    $address->appendChild($xml->createElement('IsMailing', 'true'));
                else
                    $address->appendChild($xml->createElement('IsMailing', 'false'));
            } else {
                $address->appendChild($xml->createElement('IsCurrent', 'true'));
                $address->appendChild($xml->createElement('IsMailing', 'false'));
            }
            if (strpos(strtoupper($data['cuAddress1']), 'PO BOX') === false) {
                $address->appendChild($xml->createElement('StreetNo', substr($data['cuAddress1'], 0, strpos($data['cuAddress1'], ' '))));
                $address->appendChild($xml->createElement('StreetName', trim(substr($data['cuAddress1'], strpos($data['cuAddress1'], ' '), strlen($data['cuAddress1'])))));
            } else {
                $address->appendChild($xml->createElement('StreetNo', ''));
                $address->appendChild($xml->createElement('StreetName', trim($data['cuAddress1'])));
            }
            if (array_key_exists('cuAddress2', $data))
                $address->appendChild($xml->createElement('AptNo', $data['cuAddress2']));
            $address->appendChild($xml->createElement('City', $data['cuCity']));
            if (array_key_exists('cuCounty', $data))
                $address->appendChild($xml->createElement('County', $data['cuCounty']));
            $address->appendChild($xml->createElement('State', $data['cuState']));

            if (substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-')) !== '')
                $address->appendChild($xml->createElement('ZipCode', substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-'))));
            else
                $address->appendChild($xml->createElement('ZipCode', $data['cuZipCode']));
            if (array_key_exists('cuRentOwnBuy', $data)) {
                if ($data['cuRentOwnBuy'] === "Rent")
                    $address->appendChild($xml->createElement('Status', 'RENT'));
                else if ($data['cuRentOwnBuy'] === "Own")
                    $address->appendChild($xml->createElement('Status', 'OWN'));
                else
                    $address->appendChild($xml->createElement('Status', 'UNKNOWN'));
            }
            if (array_key_exists('howLongYears', $data) && strlen($data['howLongYears']) !== 0)
                $address->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
            if (array_key_exists('howLongMonths', $data) && strlen($data['howLongMonths']) !== 0)
                $address->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths']));
            //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
            //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
        }

        //Previous Address
        if ((array_key_exists('cuPrevCity', $data) && strlen($data['cuPrevCity']) !== 0) && (array_key_exists('cuPrevState', $data) && strlen($data['cuPrevState']) !== 0) && (array_key_exists('cuPrevAddress1', $data) && strlen($data['cuPrevAddress1']) !== 0) && (array_key_exists('cuPrevZipCode', $data) && strlen($data['cuPrevZipCode']) !== 0)) {
            $prevaddress = $xml->createElement("Address");
            $prevaddress->appendChild($xml->createElement('IsCurrent', 'false'));
            $prevaddress->appendChild($xml->createElement('IsMailing', 'false'));

            //$prevaddress ->appendChild($xml->createElement('StreetNo',$inArray['PrevAddressLine1']));
            if (strpos(strtoupper($data['cuPrevAddress1']), 'PO BOX') === false) {
                $prevaddress->appendChild($xml->createElement('StreetNo', substr($data['cuPrevAddress1'], 0, strpos($data['cuPrevAddress1'], ' '))));
                if (strlen($data['cuPrevAddress1']) !== 0)
                    $prevaddress->appendChild($xml->createElement('StreetName', trim(substr($data['cuPrevAddress1'], strpos($data['cuPrevAddress1'], ' '), strlen($data['cuPrevAddress1'])))));
            } else {
                $prevaddress->appendChild($xml->createElement('StreetNo', ''));
                $prevaddress->appendChild($xml->createElement('StreetName', trim($data['cuPrevAddress1'])));
            }

            //if(array_key_exists('PrevAddressLine2',$inArray))
            //$prevaddress ->appendChild($xml->createElement('StreetName',$inArray['PrevAddressLine2']));
            if (array_key_exists('cuPrevAddress2', $data))
                $prevaddress->appendChild($xml->createElement('AptNo', $data['cuPrevAddress2']));
            $prevaddress->appendChild($xml->createElement('City', $data['cuPrevCity']));
            if (array_key_exists('PrevCounty', $data))
                $prevaddress->appendChild($xml->createElement('County', $data['PrevCounty']));
            $prevaddress->appendChild($xml->createElement('State', $data['cuPrevState']));
            if (substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-')) !== '')
                $prevaddress->appendChild($xml->createElement('ZipCode', substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-'))));
            else
                $prevaddress->appendChild($xml->createElement('ZipCode', $data['cuPrevZipCode']));
            if (array_key_exists('cuRentOwnBuy', $data)) {
                if ($data['cuRentOwnBuy'] === "Rent")
                    $prevaddress->appendChild($xml->createElement('Status', 'RENT'));
                else if ($data['cuRentOwnBuy'] === "Own")
                    $prevaddress->appendChild($xml->createElement('Status', 'OWN'));
                else
                    $prevaddress->appendChild($xml->createElement('Status', 'UNKNOWN'));
            }
            if (array_key_exists('cuPrevYearsAtAddress', $data) && strlen($data['cuPrevYearsAtAddress']) !== 0)
                $prevaddress->appendChild($xml->createElement('HowLongYears', $data['cuPrevYearsAtAddress']));
            if (array_key_exists('cuPrevMonthsAtAddress', $data) && strlen($data['cuPrevMonthsAtAddress']) !== 0)
                $prevaddress->appendChild($xml->createElement('HowLongMonths', $data['cuPrevMonthsAtAddress']));
            //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
            //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
            $addresses->appendChild($prevaddress);
        }
        $borrower->appendChild($addresses);
    } else if ($numOrder == '1' && $data['fiUseEntity'] == 'Y' && $isIndividual == 'N') {

        $borrower->appendChild($xml->createElement('Type', 'BUSINESS'));
        if (array_key_exists('EntityName', $data))
            $borrower->appendChild($xml->createElement('BusinessName', $data['EntityName']));
        $borrower->appendChild($xml->createElement('BusinessType', 'CORPORATION'));
        $borrower->appendChild($xml->createElement('BusinessTaxID', '11-1178990'));
        $borrower->appendChild($xml->createElement('BusinessPhone', '234-567-7897'));
        $borrower->appendChild($xml->createElement('BusinessHowLongYears', '1'));
        $borrower->appendChild($xml->createElement('BusinessHowLongMonths', '4'));

        //Addresses
        $addresses = $xml->createElement("Addresses");
        if ((array_key_exists('cuCity', $data) && strlen($data['cuCity']) !== 0) && (array_key_exists('cuState', $data) && strlen($data['cuState']) !== 0) && (array_key_exists('cuAddress1', $data) && strlen($data['cuAddress1']) !== 0) && (array_key_exists('cuZipCode', $data) && strlen($data['cuZipCode']) !== 0)) {
            $r = $k + 1;
            $address = $xml->createElement("Address");
            $addresses->appendChild($address);
            if (array_key_exists('cuAddress1', $data)) {
                // Num 1 isCurrent TRUE
                $address->appendChild($xml->createElement('IsCurrent', 'true'));
                if ($data['cuAddress1'] === $data['cuMailAddress1'])
                    $address->appendChild($xml->createElement('IsMailing', 'true'));
                else
                    $address->appendChild($xml->createElement('IsMailing', 'false'));
            } else {
                $address->appendChild($xml->createElement('IsCurrent', 'true'));
                $address->appendChild($xml->createElement('IsMailing', 'false'));
            }
            if (strpos(strtoupper($data['cuAddress1']), 'PO BOX') === false) {
                $address->appendChild($xml->createElement('StreetNo', substr($data['cuAddress1'], 0, strpos($data['cuAddress1'], ' '))));
                $address->appendChild($xml->createElement('StreetName', trim(substr($data['cuAddress1'], strpos($data['cuAddress1'], ' '), strlen($data['cuAddress1'])))));
            } else {
                $address->appendChild($xml->createElement('StreetNo', ''));
                $address->appendChild($xml->createElement('StreetName', trim($data['cuAddress1'])));
            }
            if (array_key_exists('cuAddress2', $data))
                $address->appendChild($xml->createElement('AptNo', $data['cuAddress2']));
            $address->appendChild($xml->createElement('City', $data['cuCity']));
            if (array_key_exists('cuCounty', $data))
                $address->appendChild($xml->createElement('County', $data['cuCounty']));
            $address->appendChild($xml->createElement('State', $data['cuState']));

            if (substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-')) !== '')
                $address->appendChild($xml->createElement('ZipCode', substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-'))));
            else
                $address->appendChild($xml->createElement('ZipCode', $data['cuZipCode']));
            if (array_key_exists('cuRentOwnBuy', $data)) {
                if ($data['cuRentOwnBuy'] === "Rent")
                    $address->appendChild($xml->createElement('Status', 'RENT'));
                else if ($data['cuRentOwnBuy'] === "Own")
                    $address->appendChild($xml->createElement('Status', 'OWN'));
                else
                    $address->appendChild($xml->createElement('Status', 'UNKNOWN'));
            }
            if (array_key_exists('howLongYears', $data) && strlen($data['howLongYears']) !== 0)
                $address->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
            if (array_key_exists('howLongMonths', $data) && strlen($data['howLongMonths']) !== 0)
                $address->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths']));
            //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
            //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
        }

        //Previous Address
        if ((array_key_exists('cuPrevCity', $data) && strlen($data['cuPrevCity']) !== 0) && (array_key_exists('cuPrevState', $data) && strlen($data['cuPrevState']) !== 0) && (array_key_exists('cuPrevAddress1', $data) && strlen($data['cuPrevAddress1']) !== 0) && (array_key_exists('cuPrevZipCode', $data) && strlen($data['cuPrevZipCode']) !== 0)) {
            $prevaddress = $xml->createElement("Address");
            $prevaddress->appendChild($xml->createElement('IsCurrent', 'false'));
            $prevaddress->appendChild($xml->createElement('IsMailing', 'false'));

            //$prevaddress ->appendChild($xml->createElement('StreetNo',$inArray['PrevAddressLine1']));
            if (strpos(strtoupper($data['cuPrevAddress1']), 'PO BOX') === false) {
                $prevaddress->appendChild($xml->createElement('StreetNo', substr($data['cuPrevAddress1'], 0, strpos($data['cuPrevAddress1'], ' '))));
                if (strlen($data['cuPrevAddress1']) !== 0)
                    $prevaddress->appendChild($xml->createElement('StreetName', trim(substr($data['cuPrevAddress1'], strpos($data['cuPrevAddress1'], ' '), strlen($data['cuPrevAddress1'])))));
            } else {
                $prevaddress->appendChild($xml->createElement('StreetNo', ''));
                $prevaddress->appendChild($xml->createElement('StreetName', trim($data['cuPrevAddress1'])));
            }

            //if(array_key_exists('PrevAddressLine2',$inArray))
            //$prevaddress ->appendChild($xml->createElement('StreetName',$inArray['PrevAddressLine2']));
            if (array_key_exists('cuPrevAddress2', $data))
                $prevaddress->appendChild($xml->createElement('AptNo', $data['cuPrevAddress2']));
            $prevaddress->appendChild($xml->createElement('City', $data['cuPrevCity']));
            if (array_key_exists('PrevCounty', $data))
                $prevaddress->appendChild($xml->createElement('County', $data['PrevCounty']));
            $prevaddress->appendChild($xml->createElement('State', $data['cuPrevState']));
            if (substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-')) !== '')
                $prevaddress->appendChild($xml->createElement('ZipCode', substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-'))));
            else
                $prevaddress->appendChild($xml->createElement('ZipCode', $data['cuPrevZipCode']));
            if (array_key_exists('cuRentOwnBuy', $data)) {
                if ($data['cuRentOwnBuy'] === "Rent")
                    $prevaddress->appendChild($xml->createElement('Status', 'RENT'));
                else if ($data['cuRentOwnBuy'] === "Own")
                    $prevaddress->appendChild($xml->createElement('Status', 'OWN'));
                else
                    $prevaddress->appendChild($xml->createElement('Status', 'UNKNOWN'));
            }
            if (array_key_exists('cuPrevYearsAtAddress', $data) && strlen($data['cuPrevYearsAtAddress']) !== 0)
                $prevaddress->appendChild($xml->createElement('HowLongYears', $data['cuPrevYearsAtAddress']));
            if (array_key_exists('cuPrevMonthsAtAddress', $data) && strlen($data['cuPrevMonthsAtAddress']) !== 0)
                $prevaddress->appendChild($xml->createElement('HowLongMonths', $data['cuPrevMonthsAtAddress']));
            //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
            //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
            $addresses->appendChild($prevaddress);
        }
        $borrower->appendChild($addresses);
    } else if ($numOrder == '2') {
        $borrower->appendChild($xml->createElement('Type', 'INDIVIDUAL'));
        $borrower->appendChild($xml->createElement('FirstName', $data['cobFirstName']));
        if (array_key_exists('cobMiddleInitial', $data))
            $borrower->appendChild($xml->createElement('MiddleName', $data['cobMiddleInitial']));
        $borrower->appendChild($xml->createElement('LastName', $data['cobLastName']));
        //$borrower ->appendChild($xml->createElement('Suffix','2.7'));
        if (array_key_exists('cobSSN', $data) && strlen($data['cobSSN']) === 11)
            $borrower->appendChild($xml->createElement('SSN', $data['cobSSN']));
        if (array_key_exists('cobDOB', $data) && strlen($data['cobDOB']) !== 0)
            $borrower->appendChild($xml->createElement('DOB', $data['cobDOB']));
        if (array_key_exists('cobPhoneHome', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cobPhoneHome']))) === 12) {
            $phoneHomeCO = str_replace(') ', '-', str_replace('(', '', $data['cobPhoneHome']));
            $borrower->appendChild($xml->createElement('HomePhone', $phoneHomeCO));
        }
        if (array_key_exists('cobPhoneMobile', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cobPhoneMobile']))) === 12) {
            $phoneMobileCO = str_replace(') ', '-', str_replace('(', '', $data['cobPhoneMobile']));
            $borrower->appendChild($xml->createElement('MobilePhone', $phoneMobileCO));
        }

        if (array_key_exists('cobDLNo', $data))
            $borrower->appendChild($xml->createElement('DLNo', str_replace('-', '', $data['cobDLNo'])));
        //$borrower ->appendChild($xml->createElement('DLState','2.7'));
        if (array_key_exists('cobEmail', $data) && !is_null($data['cobEmail']))
            $borrower->appendChild($xml->createElement('Email', $data['cobEmail']));

        $addressesCO = $xml->createElement("Addresses");
        // if cityco exists
        if ((array_key_exists('cobCity', $data) && strlen($data['cobCity']) !== 0) && (array_key_exists('cobState', $data) && strlen($data['cobState']) !== 0) && (array_key_exists('cobAddress1', $data) && strlen($data['cobAddress1']) !== 0) && (array_key_exists('cobZipCode', $data) && strlen($data['cobZipCode']) !== 0)) {
            $addressCO = $xml->createElement("Address");
            $addressesCO->appendChild($addressCO);

            $addressCO->appendChild($xml->createElement('IsCurrent', 'true'));
            $addressCO->appendChild($xml->createElement('IsMailing', 'false'));

            if (strpos(strtoupper($data['cobAddress1']), 'PO BOX') === false) {
                $addressCO->appendChild($xml->createElement('StreetNo', substr($data['cobAddress1'], 0, strpos($data['cobAddress1'], ' '))));
                $addressCO->appendChild($xml->createElement('StreetName', trim(substr($data['cobAddress1'], strpos($data['cobAddress1'], ' '), strlen($data['cobAddress1'])))));
            } else {
                $addressCO->appendChild($xml->createElement('StreetNo', ''));
                $addressCO->appendChild($xml->createElement('StreetName', trim($data['cobAddress1'])));
            }
            if (array_key_exists('cobAddress2', $data))
                $addressCO->appendChild($xml->createElement('AptNo', $data['cobAddress2']));
            $addressCO->appendChild($xml->createElement('City', $data['cobCity']));
            $addressCO->appendChild($xml->createElement('State', $data['cobState']));
            if (substr($data['cobZipCode'], 0, strpos($data['cobZipCode'], '-')) !== '')
                $addressCO->appendChild($xml->createElement('ZipCode', substr($data['cobZipCode'], 0, strpos($data['cobZipCode'], '-'))));
            else
                $addressCO->appendChild($xml->createElement('ZipCode', $data['cobZipCode']));

            /* if (array_key_exists('cuRentOwnBuy', $data)) {
              if ($data['cuRentOwnBuy'] === "Rent")
              $addressCO->appendChild($xml->createElement('Status', 'RENT'));
              else if ($data['cuRentOwnBuy'] === "Own")
              $addressCO->appendChild($xml->createElement('Status', 'OWN'));
              else
              $addressCO->appendChild($xml->createElement('Status', 'UNKNOWN'));
              }
              if (array_key_exists('howLongYears', $data) && strlen($data['howLongYears']) !== 0)
              $addressCO->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
              if (array_key_exists('howLongMonths', $data) && strlen($data['howLongMonths']) !== 0)
              $addressCO->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths'])); */
            //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
            //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
        }
        //}
        /* //Previous Address
          if(array_key_exists('PrevAddressLine1CO',$inArray))
          {
          $prevaddress   = $xml->createElement("Address");
          $prevaddress ->appendChild($xml->createElement('IsCurrent','false'));
          $prevaddress ->appendChild($xml->createElement('IsMailing','false'));
          if(strpos(strtoupper($inArray['PrevAddressLine1CO']),'PO BOX') === false)
          {
          $prevaddress ->appendChild($xml->createElement('StreetNo',substr($inArray['PrevAddressLine1CO'], 0, strpos($inArray['PrevAddressLine1CO'], ' '))));
          $prevaddress ->appendChild($xml->createElement('StreetName',trim(substr($inArray['PrevAddressLine1CO'], strpos($inArray['PrevAddressLine1CO'], ' '),strlen($inArray['PrevAddressLine1CO'])))));
          }
          else
          {
          $prevaddress ->appendChild($xml->createElement('StreetNo',''));
          $prevaddress ->appendChild($xml->createElement('StreetName',trim($inArray['PrevAddressLine1CO'])));
          }
          if(array_key_exists('PrevAddressLin2CO',$inArray))
          $prevaddress ->appendChild($xml->createElement('AptNo',$inArray['PrevAddressLine2CO']));
          $prevaddress ->appendChild($xml->createElement('City',$inArray['PrevCityCO']));
          if(array_key_exists('PrevCountyCO',$inArray))
          $prevaddress ->appendChild($xml->createElement('County',$inArray['PrevCountyCO']));
          $prevaddress ->appendChild($xml->createElement('State',$inArray['PrevStateCO']));
          if(substr($inArray['PrevZipCodeCO'],0, strpos($inArray['PrevZipCodeCO'], '-')) !== '')
          $prevaddress ->appendChild($xml->createElement('ZipCode',substr($inArray['PrevZipCodeCO'],0, strpos($inArray['PrevZipCodeCO'], '-'))));
          else
          $prevaddress ->appendChild($xml->createElement('ZipCode',$inArray['PrevZipCodeCO']));

          if(array_key_exists('RentOwnBuy',$inArray)){
          if($inArray['RentOwnBuy'] === "Rent")
          $prevaddress ->appendChild($xml->createElement('Status','RENT'));
          else if ($inArray['RentOwnBuy'] === "Own")
          $prevaddress ->appendChild($xml->createElement('Status','OWN'));
          else
          $prevaddress ->appendChild($xml->createElement('Status','UNKNOWN'));
          }
          if(array_key_exists('PrevYearsAtAddressCO',$inArray) && strlen($inArray['PrevYearsAtAddressCO']) !== 0)
          $prevaddress ->appendChild($xml->createElement('HowLongYears',$inArray['PrevYearsAtAddressCO']));
          if(array_key_exists('PrevMonthsAtAddressCO',$inArray) && strlen($inArray['PrevMonthsAtAddressCO']) !== 0)
          $prevaddress ->appendChild($xml->createElement('HowLongMonths',$inArray['PrevMonthsAtAddressCO']));
          //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
          //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
          $addressesCO ->appendChild($prevaddress);
          } */

        $borrower->appendChild($addressesCO);
    }

    // old code commented
    /* if ($data['fiUseEntity'] === 'N') {
      if ($numOrder === '1') {

      $borrower->appendChild($xml->createElement('Type', 'INDIVIDUAL'));
      if (array_key_exists('cuFirstName', $data))
      $borrower->appendChild($xml->createElement('FirstName', $data['cuFirstName']));
      if (array_key_exists('cuMiddleInitial', $data))
      $borrower->appendChild($xml->createElement('MiddleName', $data['cuMiddleInitial']));
      if (array_key_exists('cuLastName', $data))
      $borrower->appendChild($xml->createElement('LastName', $data['cuLastName']));
      //$borrower ->appendChild($xml->createElement('Suffix','2.7'));
      if (array_key_exists('cuSSN', $data) && strlen($data['cuSSN']) === 11)
      $borrower->appendChild($xml->createElement('SSN', $data['cuSSN']));
      if (array_key_exists('cuDOB', $data) && strlen($data['cuDOB']) !== 0)
      $borrower->appendChild($xml->createElement('DOB', $data['cuDOB']));
      if (array_key_exists('cuPhoneHome', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cuPhoneHome']))) === 12) {
      $phoneHome = str_replace(') ', '-', str_replace('(', '', $data['cuPhoneHome']));
      $borrower->appendChild($xml->createElement('HomePhone', $phoneHome));
      }
      if (array_key_exists('cuPhoneMobile', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cuPhoneMobile']))) === 12) {
      $phoneMobile = str_replace(') ', '-', str_replace('(', '', $data['cuPhoneMobile']));
      $borrower->appendChild($xml->createElement('MobilePhone', $phoneMobile));
      }
      if (array_key_exists('cuDLNo', $data))
      $borrower->appendChild($xml->createElement('DLNo', str_replace('-', '', $data['cuDLNo'])));
      //$borrower ->appendChild($xml->createElement('DLState','2.7'));
      //$borrower ->appendChild($xml->createElement('Email','2.7'));

      //Addresses
      $addresses = $xml->createElement("Addresses");
      if ((array_key_exists('cuCity', $data) && strlen($data['cuCity']) !== 0) && (array_key_exists('cuState', $data) && strlen($data['cuState']) !== 0) && (array_key_exists('cuAddress1', $data) && strlen($data['cuAddress1']) !== 0) && (array_key_exists('cuZipCode', $data) && strlen($data['cuZipCode']) !== 0)) {
      $r       = $k + 1;
      $address = $xml->createElement("Address");
      $addresses->appendChild($address);
      if (array_key_exists('cuAddress1', $data)) {
      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $address->appendChild($xml->createElement('IsCurrent', 'true'));
      else
      $address->appendChild($xml->createElement('IsCurrent', 'false'));
      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $address->appendChild($xml->createElement('IsMailing', 'true'));
      else
      $address->appendChild($xml->createElement('IsMailing', 'false'));
      } else {
      $address->appendChild($xml->createElement('IsCurrent', 'true'));
      $address->appendChild($xml->createElement('IsMailing', 'false'));
      }
      if (strpos(strtoupper($data['cuAddress1']), 'PO BOX') === false) {
      $address->appendChild($xml->createElement('StreetNo', substr($data['cuAddress1'], 0, strpos($data['cuAddress1'], ' '))));
      $address->appendChild($xml->createElement('StreetName', trim(substr($data['cuAddress1'], strpos($data['cuAddress1'], ' '), strlen($data['cuAddress1'])))));
      } else {
      $address->appendChild($xml->createElement('StreetNo', ''));
      $address->appendChild($xml->createElement('StreetName', trim($data['cuAddress1'])));
      }
      if (array_key_exists('cuAddress2', $data))
      $address->appendChild($xml->createElement('AptNo', $data['cuAddress2']));
      $address->appendChild($xml->createElement('City', $data['cuCity']));
      if (array_key_exists('cuCounty', $data))
      $address->appendChild($xml->createElement('County', $data['cuCounty']));
      $address->appendChild($xml->createElement('State', $data['cuState']));

      if (substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-')) !== '')
      $address->appendChild($xml->createElement('ZipCode', substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-'))));
      else
      $address->appendChild($xml->createElement('ZipCode', $data['cuZipCode']));
      if (array_key_exists('cuRentOwnBuy', $data)) {
      if ($data['cuRentOwnBuy'] === "Rent")
      $address->appendChild($xml->createElement('Status', 'RENT'));
      else if ($data['cuRentOwnBuy'] === "Own")
      $address->appendChild($xml->createElement('Status', 'OWN'));
      else
      $address->appendChild($xml->createElement('Status', 'UNKNOWN'));
      }
      if (array_key_exists('howLongYears', $data) && strlen($data['howLongYears']) !== 0)
      $address->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
      if (array_key_exists('howLongMonths', $data) && strlen($data['howLongMonths']) !== 0)
      $address->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths']));
      //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
      //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
      }

      //Previous Address
      if ((array_key_exists('cuPrevCity', $data) && strlen($data['cuPrevCity']) !== 0) && (array_key_exists('cuPrevState', $data) && strlen($data['cuPrevState']) !== 0) && (array_key_exists('cuPrevAddress1', $data) && strlen($data['cuPrevAddress1']) !== 0) && (array_key_exists('cuPrevZipCode', $data) && strlen($data['cuPrevZipCode']) !== 0)) {
      $prevaddress = $xml->createElement("Address");
      $prevaddress->appendChild($xml->createElement('IsCurrent', 'false'));
      $prevaddress->appendChild($xml->createElement('IsMailing', 'false'));

      //$prevaddress ->appendChild($xml->createElement('StreetNo',$inArray['PrevAddressLine1']));
      if (strpos(strtoupper($data['cuPrevAddress1']), 'PO BOX') === false) {
      $prevaddress->appendChild($xml->createElement('StreetNo', substr($data['cuPrevAddress1'], 0, strpos($data['cuPrevAddress1'], ' '))));
      if (strlen($data['cuPrevAddress1']) !== 0)
      $prevaddress->appendChild($xml->createElement('StreetName', trim(substr($data['cuPrevAddress1'], strpos($data['cuPrevAddress1'], ' '), strlen($data['cuPrevAddress1'])))));
      } else {
      $prevaddress->appendChild($xml->createElement('StreetNo', ''));
      $prevaddress->appendChild($xml->createElement('StreetName', trim($data['cuPrevAddress1'])));
      }

      //if(array_key_exists('PrevAddressLine2',$inArray))
      //$prevaddress ->appendChild($xml->createElement('StreetName',$inArray['PrevAddressLine2']));
      if (array_key_exists('cuPrevAddress2', $data))
      $prevaddress->appendChild($xml->createElement('AptNo', $data['cuPrevAddress2']));
      $prevaddress->appendChild($xml->createElement('City', $data['cuPrevCity']));
      if (array_key_exists('PrevCounty', $data))
      $prevaddress->appendChild($xml->createElement('County', $data['PrevCounty']));
      $prevaddress->appendChild($xml->createElement('State', $data['cuPrevState']));
      if (substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-')) !== '')
      $prevaddress->appendChild($xml->createElement('ZipCode', substr($data['cuPrevZipCode'], 0, strpos($data['cuPrevZipCode'], '-'))));
      else
      $prevaddress->appendChild($xml->createElement('ZipCode', $data['cuPrevZipCode']));
      if (array_key_exists('cuRentOwnBuy', $data)) {
      if ($data['cuRentOwnBuy'] === "Rent")
      $prevaddress->appendChild($xml->createElement('Status', 'RENT'));
      else if ($data['cuRentOwnBuy'] === "Own")
      $prevaddress->appendChild($xml->createElement('Status', 'OWN'));
      else
      $prevaddress->appendChild($xml->createElement('Status', 'UNKNOWN'));
      }
      if (array_key_exists('cuPrevYearsAtAddress', $data) && strlen($data['cuPrevYearsAtAddress']) !== 0)
      $prevaddress->appendChild($xml->createElement('HowLongYears', $data['cuPrevYearsAtAddress']));
      if (array_key_exists('cuPrevMonthsAtAddress', $data) && strlen($data['cuPrevMonthsAtAddress']) !== 0)
      $prevaddress->appendChild($xml->createElement('HowLongMonths', $data['cuPrevMonthsAtAddress']));
      //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
      //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
      $addresses->appendChild($prevaddress);
      }
      $borrower->appendChild($addresses);

      } else {
      $borrower->appendChild($xml->createElement('Type', 'INDIVIDUAL'));
      $borrower->appendChild($xml->createElement('FirstName', $data['cobFirstName']));
      if (array_key_exists('cobMiddleInitial', $data))
      $borrower->appendChild($xml->createElement('MiddleName', $data['cobMiddleInitial']));
      $borrower->appendChild($xml->createElement('LastName', $data['cobLastName']));
      //$borrower ->appendChild($xml->createElement('Suffix','2.7'));
      if (array_key_exists('cobSSN', $data) && strlen($data['cobSSN']) === 11)
      $borrower->appendChild($xml->createElement('SSN', $data['cobSSN']));
      if (array_key_exists('cobDOB', $data) && strlen($data['cobDOB']) !== 0)
      $borrower->appendChild($xml->createElement('DOB', $data['cobDOB']));
      if (array_key_exists('cobPhoneHome', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cobPhoneHome']))) === 12) {
      $phoneHomeCO = str_replace(') ', '-', str_replace('(', '', $data['cobPhoneHome']));
      $borrower->appendChild($xml->createElement('HomePhone', $phoneHomeCO));
      }
      if (array_key_exists('cobPhoneMobile', $data) && strlen(str_replace(') ', '-', str_replace('(', '', $data['cobPhoneMobile']))) === 12) {
      $phoneMobileCO = str_replace(') ', '-', str_replace('(', '', $data['cobPhoneMobile']));
      $borrower->appendChild($xml->createElement('MobilePhone', $phoneMobileCO));
      }

      if (array_key_exists('cobDLNo', $data))
      $borrower->appendChild($xml->createElement('DLNo', str_replace('-', '', $data['cobDLNo'])));
      //$borrower ->appendChild($xml->createElement('DLState','2.7'));
      //$borrower ->appendChild($xml->createElement('Email','2.7'));

      $addressesCO = $xml->createElement("Addresses");
      // if cityco exists
      //for ($l = 0; $l <= $j; $l++) {
      if ((array_key_exists('cuCity', $data) && strlen($data['cuCity']) !== 0) && (array_key_exists('cuState', $data) && strlen($data['cuState']) !== 0) && (array_key_exists('cuAddress1', $data) && strlen($data['cuAddress1']) !== 0) && (array_key_exists('cuZipCode', $data) && strlen($data['cuZipCode']) !== 0)) {
      $p         = $l + 1;
      $addressCO = $xml->createElement("Address");
      $addressesCO->appendChild($addressCO);
      if (array_key_exists('cuMailAddress1', $data)) {
      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $addressCO->appendChild($xml->createElement('IsCurrent', 'true'));
      else
      $addressCO->appendChild($xml->createElement('IsCurrent', 'false'));
      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $addressCO->appendChild($xml->createElement('IsMailing', 'true'));
      else
      $addressCO->appendChild($xml->createElement('IsMailing', 'false'));
      } else {
      $addressCO->appendChild($xml->createElement('IsCurrent', 'true'));
      $addressCO->appendChild($xml->createElement('IsMailing', 'false'));
      }
      if (strpos(strtoupper($data['cuAddress1']), 'PO BOX') === false) {
      $addressCO->appendChild($xml->createElement('StreetNo', substr($data['cuAddress1'], 0, strpos($data['cuAddress1'], ' '))));
      $addressCO->appendChild($xml->createElement('StreetName', trim(substr($data['cuAddress1'], strpos($data['cuAddress1'], ' '), strlen($data['cuAddress1'])))));
      } else {
      $addressCO->appendChild($xml->createElement('StreetNo', ''));
      $addressCO->appendChild($xml->createElement('StreetName', trim($data['cuAddress1'])));
      }
      if (array_key_exists('cuAddress2', $data))
      $addressCO->appendChild($xml->createElement('AptNo', $data['cuAddress2']));
      $addressCO->appendChild($xml->createElement('City', $data['cuCity']));
      if (array_key_exists('cuCounty', $data))
      $addressCO->appendChild($xml->createElement('County', $data['cuCounty']));
      $addressCO->appendChild($xml->createElement('State', $data['cuState']));
      if (substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-')) !== '')
      $addressCO->appendChild($xml->createElement('ZipCode', substr($data['cuZipCode'], 0, strpos($data['cuZipCode'], '-'))));
      else
      $addressCO->appendChild($xml->createElement('ZipCode', $data['cuZipCode']));
      if (array_key_exists('cuRentOwnBuy', $data)) {
      if ($data['cuRentOwnBuy'] === "Rent")
      $addressCO->appendChild($xml->createElement('Status', 'RENT'));
      else if ($data['cuRentOwnBuy'] === "Own")
      $addressCO->appendChild($xml->createElement('Status', 'OWN'));
      else
      $addressCO->appendChild($xml->createElement('Status', 'UNKNOWN'));
      }
      if (array_key_exists('howLongYears', $data) && strlen($data['howLongYears']) !== 0)
      $addressCO->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
      if (array_key_exists('howLongMonths', $data) && strlen($data['howLongMonths']) !== 0)
      $addressCO->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths']));
      //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
      //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
      } */
    //}
    /* --//Previous Address
      if(array_key_exists('PrevAddressLine1CO',$inArray))
      {
      $prevaddress   = $xml->createElement("Address");
      $prevaddress ->appendChild($xml->createElement('IsCurrent','false'));
      $prevaddress ->appendChild($xml->createElement('IsMailing','false'));
      if(strpos(strtoupper($inArray['PrevAddressLine1CO']),'PO BOX') === false)
      {
      $prevaddress ->appendChild($xml->createElement('StreetNo',substr($inArray['PrevAddressLine1CO'], 0, strpos($inArray['PrevAddressLine1CO'], ' '))));
      $prevaddress ->appendChild($xml->createElement('StreetName',trim(substr($inArray['PrevAddressLine1CO'], strpos($inArray['PrevAddressLine1CO'], ' '),strlen($inArray['PrevAddressLine1CO'])))));
      }
      else
      {
      $prevaddress ->appendChild($xml->createElement('StreetNo',''));
      $prevaddress ->appendChild($xml->createElement('StreetName',trim($inArray['PrevAddressLine1CO'])));
      }
      if(array_key_exists('PrevAddressLin2CO',$inArray))
      $prevaddress ->appendChild($xml->createElement('AptNo',$inArray['PrevAddressLine2CO']));
      $prevaddress ->appendChild($xml->createElement('City',$inArray['PrevCityCO']));
      if(array_key_exists('PrevCountyCO',$inArray))
      $prevaddress ->appendChild($xml->createElement('County',$inArray['PrevCountyCO']));
      $prevaddress ->appendChild($xml->createElement('State',$inArray['PrevStateCO']));
      if(substr($inArray['PrevZipCodeCO'],0, strpos($inArray['PrevZipCodeCO'], '-')) !== '')
      $prevaddress ->appendChild($xml->createElement('ZipCode',substr($inArray['PrevZipCodeCO'],0, strpos($inArray['PrevZipCodeCO'], '-'))));
      else
      $prevaddress ->appendChild($xml->createElement('ZipCode',$inArray['PrevZipCodeCO']));

      if(array_key_exists('RentOwnBuy',$inArray)){
      if($inArray['RentOwnBuy'] === "Rent")
      $prevaddress ->appendChild($xml->createElement('Status','RENT'));
      else if ($inArray['RentOwnBuy'] === "Own")
      $prevaddress ->appendChild($xml->createElement('Status','OWN'));
      else
      $prevaddress ->appendChild($xml->createElement('Status','UNKNOWN'));
      }
      if(array_key_exists('PrevYearsAtAddressCO',$inArray) && strlen($inArray['PrevYearsAtAddressCO']) !== 0)
      $prevaddress ->appendChild($xml->createElement('HowLongYears',$inArray['PrevYearsAtAddressCO']));
      if(array_key_exists('PrevMonthsAtAddressCO',$inArray) && strlen($inArray['PrevMonthsAtAddressCO']) !== 0)
      $prevaddress ->appendChild($xml->createElement('HowLongMonths',$inArray['PrevMonthsAtAddressCO']));
      //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
      //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
      $addressesCO ->appendChild($prevaddress);
      }-- */

    /* $borrower->appendChild($addressesCO);
      }
      } else {
      $borrower->appendChild($xml->createElement('Type', 'BUSINESS'));
      if (array_key_exists('EntityName', $data))
      $borrower->appendChild($xml->createElement('BusinessName', $data['EntityName']));
      $borrower->appendChild($xml->createElement('BusinessType', 'CORPORATION'));
      $borrower->appendChild($xml->createElement('BusinessTaxID', '11-1178990'));
      $borrower->appendChild($xml->createElement('BusinessPhone', '234-567-7897'));
      $borrower->appendChild($xml->createElement('BusinessHowLongYears', '1'));
      $borrower->appendChild($xml->createElement('BusinessHowLongMonths', '4'));

      // add code
      } */

    // code commented
    /* if ($isIndividual === 'Y' || $inArray['UseEntity'] === 'Y') {
      //Addresses
      $addresses = $xml->createElement("Addresses");
      for ($k = 0; $k <= $i; $k++) {
      $r = $k + 1;
      $address = $xml->createElement("Address");
      $addresses->appendChild($address);

      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $address->appendChild($xml->createElement('IsCurrent', 'true'));
      else
      $address->appendChild($xml->createElement('IsCurrent', 'false'));
      if ($data['cuAddress1'] === $data['cuMailAddress1'])
      $address->appendChild($xml->createElement('IsMailing', 'true'));
      else
      $address->appendChild($xml->createElement('IsMailing', 'false'));

      $address->appendChild($xml->createElement('StreetNo', $data['cuAddress1']));
      $address->appendChild($xml->createElement('StreetName', $data['cuAddress1']));
      $address->appendChild($xml->createElement('AptNo', $data['cuAddress2']));
      $address->appendChild($xml->createElement('City', $data['cuCity']));
      $address->appendChild($xml->createElement('County', $data['cuCounty']));
      $address->appendChild($xml->createElement('State', $data['cuState']));
      $address->appendChild($xml->createElement('ZipCode', $data['cuZipCode']));

      if ($data['cuRentOwnBuy'] === "Rent")
      $address->appendChild($xml->createElement('Status', 'RENT'));
      else if ($data['cuRentOwnBuy'] === "Own")
      $address->appendChild($xml->createElement('Status', 'OWN'));
      else
      $address->appendChild($xml->createElement('Status', 'UNKNOWN'));

      $address->appendChild($xml->createElement('HowLongYears', $data['howLongYears']));
      $address->appendChild($xml->createElement('HowLongMonths', $data['howLongMonths']));
      //$address ->appendChild($xml->createElement('LandLordMortgageCo',$inArray['ZipCode']));
      //$address ->appendChild($xml->createElement('LandLordMortgagePhone',$inArray['ZipCode']));
      }
      $borrower->appendChild($addresses);
      } */

    // old code commented

    if ($numOrder == '1') {
        //EmploymentInfo
        $employmentInfo = $xml->createElement("EmploymentInfo");
        if ((array_key_exists('emEmployerName', $data) && strlen($data['emEmployerName']) !== 0) && (array_key_exists('cuJobTitle', $data) && strlen($data['cuJobTitle']) !== 0)) {
            $employment = $xml->createElement("Employment");
            $employmentInfo->appendChild($employment);

            $employment->appendChild($xml->createElement('IsCurrent', 'true'));
            $employment->appendChild($xml->createElement('NumOrder', '1'));
            if ($data['emEmployerName'] != null)
                $employment->appendChild($xml->createElement('Status', 'EMPLOYED'));
            else
                $employment->appendChild($xml->createElement('Status', 'UNKNOWN'));
            if ($data['cuJobTitle'] != null)
                $employment->appendChild($xml->createElement('Occupation', $data['cuJobTitle']));
            if (strlen($data['emEmployerName']) >= 3 && strlen($data['emEmployerName']) <= 50)
                $employment->appendChild($xml->createElement('EmployerName', $data['emEmployerName']));
            $employment->appendChild($xml->createElement('Address', $data['cuEmpAddress1'] . $data['cuEmpAddress2']));
            if (array_key_exists('cuEmpCity', $data) && strlen($data['cuEmpCity']) !== 0)
                $employment->appendChild($xml->createElement('City', $data['cuEmpCity']));
            if (array_key_exists('cuEmpState', $data) && strlen($data['cuEmpState']) !== 0)
                $employment->appendChild($xml->createElement('State', $data['cuEmpState']));
            if (array_key_exists('cuEmpZipCode', $data) && strlen($data['cuEmpZipCode']) !== 0)
                $employment->appendChild($xml->createElement('ZipCode', $data['cuEmpZipCode']));
            $employment->appendChild($xml->createElement('GrossSalary', intval($data['cuSalaryGross'])));
            if ($data['cuSalaryFrequency'] === 'Monthly')
                $employment->appendChild($xml->createElement('GrossSalaryType', 'MONTHLY'));
            else if ($data['cuSalaryFrequency'] === 'Annually')
                $employment->appendChild($xml->createElement('GrossSalaryType', 'ANNUALLY'));
            if (array_key_exists('cuEmpPhone', $data) && strlen($data['cuEmpPhone']) !== 0) {
                $employerPhone = str_replace(') ', '-', str_replace('(', '', $data['cuEmpPhone']));
                $employment->appendChild($xml->createElement('WorkPhone', $employerPhone));
            }
            if (array_key_exists('cuYearsAtJob', $data) && strlen($data['cuYearsAtJob']) !== 0)
                $employment->appendChild($xml->createElement('HowLongYears', $data['cuYearsAtJob']));
            if (array_key_exists('cuMonthsAtJob', $data) && strlen($data['cuMonthsAtJob']) !== 0)
                $employment->appendChild($xml->createElement('HowLongMonths', $data['cuMonthsAtJob']));

            // Prev employment
            if ((array_key_exists('cuPrevEmpName', $data) && strlen($data['cuPrevEmpName']) !== 0) && (array_key_exists('cuPrevJobTitle', $data) && strlen($data['cuPrevJobTitle']) !== 0)) {
                $employmentprev = $xml->createElement("Employment");
                $employmentInfo->appendChild($employmentprev);
                $employmentprev->appendChild($xml->createElement('IsCurrent', 'false'));
                $employmentprev->appendChild($xml->createElement('NumOrder', '2'));
                if ($data['cuPrevEmpName'] == null)
                    $employmentprev->appendChild($xml->createElement('Status', 'EMPLOYED'));
                else
                    $employmentprev->appendChild($xml->createElement('Status', 'UNKNOWN'));
                if ($data['cuPrevJobTitle'] != null)
                    $employmentprev->appendChild($xml->createElement('Occupation', $data['cuPrevJobTitle']));
                if (strlen($data['cuPrevEmpName']) >= 3 && strlen($data['cuPrevEmpName']) <= 50)
                    $employmentprev->appendChild($xml->createElement('EmployerName', $data['cuPrevEmpName']));
                //$employmentprev ->appendChild($xml->createElement('Address',$inArray['EmployerAddressLine1'].$inArray['EmployerAddressLine2']));
                //$employmentprev ->appendChild($xml->createElement('City',$inArray['EmployerCity']));
                //$employmentprev ->appendChild($xml->createElement('State',$inArray['EmployerState']));
                //$employmentprev ->appendChild($xml->createElement('ZipCode',$inArray['EmployerZipCode']));
                //$employmentprev ->appendChild($xml->createElement('GrossSalary',$inArray['SalaryGross']));
                /* if($inArray['SalaryFrequency'] === 'Monthly')
                  $employmentprev ->appendChild($xml->createElement('GrossSalaryType','MONTHLY'));
                  else if($inArray['SalaryFrequency'] === 'Annually')
                  $employmentprev ->appendChild($xml->createElement('GrossSalaryType','ANNUALLY')); */
                if (array_key_exists('cuPrevEmpPhone', $data) && strlen($data['cuPrevEmpPhone']) !== 0) {
                    $employerPhone = str_replace(') ', '-', str_replace('(', '', $data['cuPrevEmpPhone']));
                    $employmentprev->appendChild($xml->createElement('WorkPhone', $employerPhone));
                }
                if (array_key_exists('cuPrevEmpYearsAtJob', $data) && strlen($data['cuPrevEmpYearsAtJob']) !== 0)
                    $employmentprev->appendChild($xml->createElement('HowLongYears', $data['cuPrevEmpYearsAtJob']));
                if (array_key_exists('cuPrevEmpMonthsAtJob', $data) && strlen($data['cuPrevEmpMonthsAtJob']) !== 0)
                    $employmentprev->appendChild($xml->createElement('HowLongMonths', $data['cuPrevEmpMonthsAtJob']));
            }
        }
        $borrower->appendChild($employmentInfo);

        //OtherIncome
        if ((array_key_exists('cuOtherIncome', $data) && strlen($data['cuOtherIncome']) !== 0) && (array_key_exists('cuOtherIncomeFrequency', $data) && strlen($data['cuOtherIncomeFrequency']) !== 0) && (array_key_exists('cuOtherIncomeSource', $data) && strlen($data['cuOtherIncomeSource']) !== 0)) {
            $otherIncome = $xml->createElement("OtherIncome");
            if (array_key_exists('OtherIncome', $data) && trim($data['cuOtherIncome']) !== '0.00') {
                $otherIncome->appendChild($xml->createElement('Amount', $data['cuOtherIncome']));
            } else {
                $otherIncome->appendChild($xml->createElement('Amount', 100));
            }

            if ($data['cuOtherIncomeFrequency'] === 'Monthly')
                $otherIncome->appendChild($xml->createElement('AmountType', 'MONTHLY'));
            else if ($data['cuOtherIncomeFrequency'] === 'Annually')
                $otherIncome->appendChild($xml->createElement('AmountType', 'ANNUALLY'));

            if (array_key_exists('cuOtherIncomeSource', $data)) {
                $otherIncomeSource = trim(strtolower($data['cuOtherIncomeSource']));
                switch ($otherIncomeSource) {
                    case trim(strtolower("Aid for Dependent Children")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Aid for Dependent Children'));
                        break;
                    case trim(strtolower("Child Support")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Child Support'));
                        break;
                    case trim(strtolower("Cost of Living Allowance (COLA)")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Cost of Living Allowance (COLA)'));
                        break;
                    case trim(strtolower("Disability")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Disability'));
                        break;
                    case trim(strtolower("Family Subsistence Supplemental Allowance (FSSA)")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Family Subsistence Supplemental Allowance (FSSA)'));
                        break;
                    case trim(strtolower("Housing Allowances")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Housing Allowances'));
                        break;
                    case trim(strtolower("Military Basic Allowance for Subsistence (BAS)")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Military Basic Allowance for Subsistence (BAS)'));
                        break;
                    case trim(strtolower("Municipal Bond Interest")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Municipal Bond Interest'));
                        break;
                    case trim(strtolower("Other Non-Taxable Sources of Income")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Other Non-Taxable Sources of Income'));
                        break;
                    case trim(strtolower("Public Assistance")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Public Assistance'));
                        break;
                    case trim(strtolower("Social Security")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Social Security Benefits'));
                        break;
                    case trim(strtolower("Railroad Pension")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Railroad Pension'));
                        break;
                    case trim(strtolower("Workman's Compensation")):
                        $otherIncome->appendChild($xml->createElement('Source', "Workman's Compensation"));
                        break;
                    case trim(strtolower("Other")):
                        $otherIncome->appendChild($xml->createElement('Source', 'Other'));
                        break;
                    case trim(""):
                        $otherIncome->appendChild($xml->createElement('Source', 'UNKNOWN'));
                        break;
                }
            } else {
                $otherIncome->appendChild($xml->createElement('Source', 'UNKNOWN'));
            }

            $otherIncome->appendChild($xml->createElement('Description', ''));
            $borrower->appendChild($otherIncome);
        }


        //$borrower ->appendChild($creditBureaus);
        //References
        if (array_key_exists('cuReferenceName', $data) && !is_null($data['cuReferenceName'])) {
            $references = $xml->createElement("References");
            $reference = $xml->createElement("Reference");
            $references->appendChild($reference);
            if ($data['cuReferenceRelationship'] === 'Bank' || $data['cuReferenceRelationship'] === 'Banking')
                $reference->appendChild($xml->createElement('Type', 'BANK'));
            else
                $reference->appendChild($xml->createElement('Type', 'PERSONAL'));

            if ($data['cuReferenceName'] !== null)
                $reference->appendChild($xml->createElement('NumOrder', '1'));

            $reference->appendChild($xml->createElement('Name', $data['cuReferenceName']));
            if ($data['cuCheckingBankName'] !== null) {
                $reference->appendChild($xml->createElement('Checking', '1'));
                $reference->appendChild($xml->createElement('Savings', '1'));
            }
            $reference->appendChild($xml->createElement('Address', $data['cuReferenceAddressLine1'] . $data['cuReferenceAddressLine2']));
            $reference->appendChild($xml->createElement('City', $data['cuReferenceCity']));
            $reference->appendChild($xml->createElement('State', $data['cuReferenceState']));
            $reference->appendChild($xml->createElement('ZipCode', $data['cuReferenceZipCode']));
            $referencePhone = str_replace(') ', '-', str_replace('(', '', $data['cuReferencePhone']));
            $reference->appendChild($xml->createElement('Phone', $referencePhone));
            //$reference1 = $xml->createElement("Reference");
            //$references->appendChild($reference1);
            $borrower->appendChild($references);
            //$borrower->appendChild($reference1);
        }

        //CreditBureaus
        /* $creditBureaus   = $xml->createElement("CreditBureaus");
          $creditBureau   = $xml->createElement("CreditBureau");
          $creditBureaus ->appendChild($creditBureau);

          $creditBureau ->appendChild($xml->createElement('Source','2.7'));
          $creditBureau ->appendChild($xml->createElement('Score','2.7'));
          $creditBureau ->appendChild($xml->createElement('ScoreRangeLow','2.7'));
          $creditBureau ->appendChild($xml->createElement('ScoreRangeHigh','2.7'));
          $creditBureau ->appendChild($xml->createElement('ScoreRankPercent','2.7')); */
    } else if ($numOrder == '2') {
        // Borrower 2 - CoBuyer info in Employement

        if ((array_key_exists('cobEmpName', $data) && strlen($data['cobEmpName']) !== 0) && (array_key_exists('cobJobTitle', $data) && strlen($data['cobJobTitle']) !== 0)) {
            $employmentInfo = $xml->createElement("EmploymentInfo");
            $employment = $xml->createElement("Employment");
            $employmentInfo->appendChild($employment);

            $employment->appendChild($xml->createElement('IsCurrent', 'false'));
            $employment->appendChild($xml->createElement('NumOrder', '2'));
            if ($data['cobEmpName'] != null)
                $employment->appendChild($xml->createElement('Status', 'EMPLOYED'));
            else
                $employment->appendChild($xml->createElement('Status', 'UNKNOWN'));
            if ($data['cobJobTitle'] != null)
                $employment->appendChild($xml->createElement('Occupation', $data['cobJobTitle']));
            if (strlen($data['cobEmpName']) >= 3 && strlen($data['cobEmpName']) <= 50)
                $employment->appendChild($xml->createElement('EmployerName', $data['cobEmpName']));
            $employment->appendChild($xml->createElement('Address', $data['cobEmpAdd1'] . $data['cobEmpAdd2']));
            if (array_key_exists('cobEmpCity', $data) && strlen($data['cobEmpCity']) !== 0)
                $employment->appendChild($xml->createElement('City', $data['cobEmpCity']));
            if (array_key_exists('cobEmpState', $data) && strlen($data['cobEmpState']) !== 0)
                $employment->appendChild($xml->createElement('State', $data['cobEmpState']));
            if (array_key_exists('cobEmpZip', $data) && strlen($data['cobEmpZip']) !== 0)
                $employment->appendChild($xml->createElement('ZipCode', $data['cobEmpZip']));

            /* $employment->appendChild($xml->createElement('GrossSalary', intval($data['cuSalaryGross'])));
              if ($data['cuSalaryFrequency'] === 'Monthly')
              $employment->appendChild($xml->createElement('GrossSalaryType', 'MONTHLY'));
              else if ($data['cuSalaryFrequency'] === 'Annually')
              $employment->appendChild($xml->createElement('GrossSalaryType', 'ANNUALLY'));
              if(array_key_exists('cuEmpPhone', $data) && strlen($data['cuEmpPhone']) !== 0){
              $employerPhone = str_replace(') ', '-', str_replace('(', '', $data['cuEmpPhone']));
              $employment->appendChild($xml->createElement('WorkPhone', $employerPhone));
              }
              if(array_key_exists('cuYearsAtJob', $data) && strlen($data['cuYearsAtJob']) !== 0)
              $employment->appendChild($xml->createElement('HowLongYears', $data['cuYearsAtJob']));
              if(array_key_exists('cuMonthsAtJob', $data) && strlen($data['cuMonthsAtJob']) !== 0)
              $employment->appendChild($xml->createElement('HowLongMonths', $data['cuMonthsAtJob'])); */

            $borrower->appendChild($employmentInfo);
        }
    }


    return $borrower;
}

/**
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Main function that gets AppOne Data
 * @param $builderApiObj
 * @param $deal
 * @return array
 */
function phpXsdValidateData($builderApiObj, $deal) {
    // Get KORE IDS data
    $dealInfoJson = $builderApiObj->getDealOperationInfo($deal);
    $dealInfo = json_decode($dealInfoJson, true);

    // Get LocationMapping data from STORE class
    $storeData = array();
    $storeData['value'] = $dealInfo['data']['6807'];
    $storeData['node_class_id'] = STORE_CLASS_ID;
    $storeData['node_class_property_id'] = STORE_LOCATION_PROPERTY_ID;
    $storeInfoJson = $builderApiObj->getInstanceDataByPropertyValue($storeData);
    $storeInfo = json_decode($storeInfoJson, true);
    // location mapping data
    $data['lmLocation'] = $storeInfo['7988'];
    $data['lmStoreName'] = $storeInfo['7989'];
    $data['lmSalesManager'] = $storeInfo['7990'];
    $data['lmStoreManager'] = $storeInfo['7991'];
    $data['lmBusinessManager'] = $storeInfo['8458']; //$storeInfo['8453'];
    $data['lmNewcoast'] = $storeInfo['8459']; //$storeInfo['8454'];
    $data['lmRevenueAccountant'] = $storeInfo['8460']; //$storeInfo['8455'];
    $data['lmRevenueManager'] = $storeInfo['8461']; //$storeInfo['8456'];
    $data['lmController'] = $storeInfo['8462']; //$storeInfo['8457'];
    $data['lmDirector'] = $storeInfo['8463']; //$storeInfo['8458'];
    $data['lmExecutive'] = $storeInfo['8464']; //$storeInfo['8459'];
    $data['lmDisplayName'] = $storeInfo['8465']; //$storeInfo['8460'];
    $data['lmAddress1'] = $storeInfo['8466']; //$storeInfo['8461'];
    $data['lmAddress2'] = $storeInfo['8467']; //$storeInfo['8462'];
    $data['lmCity'] = $storeInfo['8468']; //$storeInfo['8463'];
    $data['lmState'] = $storeInfo['8469']; //$storeInfo['8464'];
    $data['lmZipCode'] = $storeInfo['8470']; //$storeInfo['8465'];
    $data['lmCounty'] = $storeInfo['8471']; //$storeInfo['8466'];
    if (!empty($storeInfo['8472'])) {  // $storeInfo['8467'];
        $lmPhone = formatPhone($storeInfo['8472']);
        if (patternMatch($lmPhone, '[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}')) {
            $data['lmPhone'] = $lmPhone;
        } else {
            $data['lmPhone'] = '';
        }
    } else {
        $data['lmPhone'] = '';
    }
    $data['lmFax'] = $storeInfo['8473']; //$storeInfo['8468'];
    $data['lmAppOneID'] = $storeInfo['8474']; //$storeInfo['8469'];

    $data['fiUseEntity'] = $dealInfo['data']['7653'];
    $data['fiQuoteNo'] = $dealInfo['data']['7532'];
    $data['fiStockNo'] = $dealInfo['data']['7536'];
    $data['unitDsgnCode'] = $dealInfo['data']['6588'];
    $data['unitSerialNo'] = $dealInfo['data']['6612'];
    $data['unitModelYr'] = $dealInfo['data']['6595'];
    $data['unitBrandDesc'] = $dealInfo['data']['6593'];
    $data['unitModelDesc'] = $dealInfo['data']['6594'];
    $data['unitStyle'] = $dealInfo['data']['6604'];
    $data['unitExteriorColor'] = $dealInfo['data']['6606'];
    $data['unitLength'] = $dealInfo['data']['6607'];
    $data['unitFuelType'] = $dealInfo['data']['6579'];

    $data['unitMotorModelYr'] = $dealInfo['data']['6575'];
    $data['unitMotorSerialNo'] = $dealInfo['data']['6581'];
    $data['unitMotorDsgnCode'] = $dealInfo['data']['6570'];
    $data['unitMotorMfg'] = $dealInfo['data']['6572'];
    $data['unitMotorModel'] = $dealInfo['data']['6574'];
    $data['unitMotorHorsePower'] = $dealInfo['data']['6578'];
    $data['unitMotorFuelTypeCode'] = $dealInfo['data']['6579'];    // same field, as discussed with PRASHANT

    $data['unitTrailerDsgnCode'] = $dealInfo['data']['6618'];
    $data['unitTrailerBrand'] = $dealInfo['data']['6622'];
    $data['fiSellingAmt'] = $dealInfo['data']['7557'];
    $data['fiTradeAllowance'] = $dealInfo['data']['7571'];
    $data['fiTradePayouts'] = $dealInfo['data']['7572'];
    $data['fiRebates'] = $dealInfo['data']['7634'];
    $data['fiTaxList'] = $dealInfo['data']['7565'];
    $data['fiTradeModelYr'] = $dealInfo['data']['7476'];
    $data['fiTradeAllowance'] = $dealInfo['data']['7482'];
    $data['fiTradePayout'] = $dealInfo['data']['7483'];
    $data['fiInsCompanyDesc'] = $dealInfo['data']['8241'];
    $data['fiInsCompanyAgent'] = $dealInfo['data']['8242'];
    $data['fiInsCompanyPhone'] = $dealInfo['data']['8245'];
    $data['fiInsPolicyNo'] = $dealInfo['data']['8243'];
    $data['fiInsDeductible'] = 0;
    $data['cuCounty'] = $dealInfo['data']['8160'];
    $data['cuRentOwnBuy'] = $dealInfo['data']['8204'];

    $data['cuPrevEmpName'] = $dealInfo['data']['6544'];
    $data['cuJobTitle'] = $dealInfo['data']['8183'];
    $data['cuPrevJobTitle'] = $dealInfo['data']['8187'];
    $data['cuEmpAddress1'] = $dealInfo['data']['6534'];
    $data['cuEmpAddress2'] = $dealInfo['data']['6535'];
    $data['cuEmpCity'] = $dealInfo['data']['6536'];
    $data['cuEmpState'] = $dealInfo['data']['6537'];
    $data['cuEmpZipCode'] = $dealInfo['data']['6538'];
    $data['cuSalaryGross'] = $dealInfo['data']['6541'];
    $data['cuSalaryFrequency'] = $dealInfo['data']['6543'];
    $data['cuEmpPhone'] = $dealInfo['data']['6533'];
    $data['cuPrevEmpPhone'] = $dealInfo['data']['6545'];
    $data['cuYearsAtJob'] = $dealInfo['data']['6539'];
    $data['cuPrevEmpYearsAtJob'] = $dealInfo['data']['6546'];
    $data['cuMonthsAtJob'] = $dealInfo['data']['6540'];
    $data['cuPrevEmpMonthsAtJob'] = $dealInfo['data']['6547'];
    $data['cuOtherIncome'] = $dealInfo['data']['8184'];
    $data['cuOtherIncomeFrequency'] = $dealInfo['data']['8186'];
    $data['cuOtherIncomeSource'] = $dealInfo['data']['8185'];
    $data['cuReferenceRelationship'] = $dealInfo['data']['8212'];
    $data['cuReferenceName'] = $dealInfo['data']['8210'];
    $data['cuCheckingBankName'] = $dealInfo['data']['8195'];
    $data['cuReferenceAddressLine1'] = $dealInfo['data']['8213'];
    $data['cuReferenceAddressLine2'] = $dealInfo['data']['8214'];
    $data['cuReferenceCity'] = $dealInfo['data']['8215'];
    $data['cuReferenceState'] = $dealInfo['data']['8216'];
    $data['cuReferenceZipCode'] = $dealInfo['data']['8217'];
    $data['cuReferencePhone'] = $dealInfo['data']['8211'];

    $data['cuFirstName'] = $dealInfo['data']['6316'];
    $data['cuMiddleInitial'] = $dealInfo['data']['6318'];
    $data['cuLastName'] = $dealInfo['data']['6317'];
    $data['cuSSN'] = $dealInfo['data']['6519'];
    $data['cuDOB'] = date("Y-m-d", strtotime($dealInfo['data']['6334']));
    $data['cuPhoneHome'] = $dealInfo['data']['6320'];
    $data['cuPhoneMobile'] = $dealInfo['data']['6322'];
    $data['cuDLNo'] = $dealInfo['data']['6520'];
    $data['cuEmail'] = $dealInfo['data']['6323'];
    $data['cobFirstName'] = $dealInfo['data']['8397'];
    $data['cobMiddleInitial'] = $dealInfo['data']['8398'];
    $data['cobLastName'] = $dealInfo['data']['8396'];
    $data['cobSSN'] = $dealInfo['data']['8414'];
    $data['cobDOB'] = date("Y-m-d", strtotime($dealInfo['data']['8412']));
    $data['cobPhoneHome'] = $dealInfo['data']['8388'];
    $data['cobPhoneMobile'] = $dealInfo['data']['8402'];
    $data['cobDLNo'] = $dealInfo['data']['8413'];
    $data['cobEmail'] = $dealInfo['data']['8403'];

    $data['cobAddress1'] = $dealInfo['data']['8404'];
    $data['cobAddress2'] = $dealInfo['data']['8405'];
    $data['cobCity'] = $dealInfo['data']['8406'];
    $data['cobState'] = $dealInfo['data']['8407'];
    $data['cobZipCode'] = $dealInfo['data']['8408'];
    $data['cobJobTitle'] = $dealInfo['data']['8415'];
    $data['cobEmpName'] = $dealInfo['data']['8416'];
    $data['cobEmpAdd1'] = $dealInfo['data']['8417'];
    $data['cobEmpAdd2'] = $dealInfo['data']['8418'];
    $data['cobEmpCity'] = $dealInfo['data']['8419'];
    $data['cobEmpState'] = $dealInfo['data']['8420'];
    $data['cobEmpZip'] = $dealInfo['data']['8421'];

    $data['cuPrevAddress1'] = $dealInfo['data']['6548'];
    $data['cuPrevAddress2'] = $dealInfo['data']['6549'];
    $data['cuPrevCity'] = $dealInfo['data']['6550'];
    $data['cuPrevState'] = $dealInfo['data']['6551'];
    $data['cuPrevZipCode'] = $dealInfo['data']['6552'];
    $data['cuPrevYearsAtAddress'] = $dealInfo['data']['6553'];
    $data['cuPrevMonthsAtAddress'] = $dealInfo['data']['6554'];


    $data['salesPersonName'] = !empty($dealInfo['data']['7520']) ? $dealInfo['data']['7520'] : '';
    $data['firstName'] = $dealInfo['data']['3211'];
    $data['lastName'] = $dealInfo['data']['3240'];
    $data['ssn'] = $dealInfo['data']['6519'];
    $data['dob'] = date("Y-m-d", strtotime($dealInfo['data']['6334']));
    if (!empty($dealInfo['data']['3241'])) {
        $homePhone = formatPhone($dealInfo['data']['3241']);
        if (patternMatch($homePhone, '[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}')) {
            $data['homePhone'] = $homePhone;
        } else {
            $data['homePhone'] = '';
        }
    } else {
        $data['homePhone'] = '';
    }
    if (!empty($dealInfo['data']['6332'])) {
        $mobilePhone = formatPhone($dealInfo['data']['6332']);
        if (patternMatch($mobilePhone, '[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}')) {
            $data['mobilePhone'] = $mobilePhone;
        } else {
            $data['mobilePhone'] = '';
        }
    } else {
        $data['mobilePhone'] = '';
    }
    $data['dlno'] = $dealInfo['data']['6520'];
    $data['city'] = !empty($dealInfo['data']['3213']) ? $dealInfo['data']['3213'] : 'PARROTT';
    $data['state'] = !empty($dealInfo['data']['6222']) ? $dealInfo['data']['6222'] : 'GA';
    $data['zipcode'] = !empty($dealInfo['data']['6223']) ? $dealInfo['data']['6223'] : '39877';
    $data['cuAddress1'] = $dealInfo['data']['6328'];
    $data['cuAddress2'] = $dealInfo['data']['6329'];
    $data['cuCity'] = $dealInfo['data']['6330'];
    $data['cuState'] = $dealInfo['data']['6331'];
    $data['cuZipCode'] = $dealInfo['data']['6332'];
    $data['cuMailAddress1'] = $dealInfo['data']['6555'];
    $data['address'] = trim($dealInfo['data']['6328'] . ' ' . $dealInfo['data']['6329'] . ' ' . $dealInfo['data']['6330'] . ' ' . $dealInfo['data']['6331'] . ' ' . $dealInfo['data']['6332']);
    $data['mailAddress'] = trim($dealInfo['data']['6555'] . ' ' . $dealInfo['data']['6556'] . ' ' . $dealInfo['data']['6557'] . ' ' . $dealInfo['data']['6558'] . ' ' . $dealInfo['data']['6559']);
    $data['isCurrent'] = 'false';
    $data['isMailing'] = 'false';
    if ($data['address'] === $data['mailAddress'] && $data['address'] !== '') {
        $data['isCurrent'] = 'true';
        $data['isMailing'] = 'true';
    }
    $data['howLongYears'] = $dealInfo['data']['6566'];
    $data['howLongMonths'] = $dealInfo['data']['6567'];
    $data['emEmployerName'] = $dealInfo['data']['6532'];
    $data['emGrossSalary'] = $dealInfo['data']['6541'];
    $data['emHowLongYears'] = $dealInfo['data']['6539'];
    $data['emHowLongMonths'] = $dealInfo['data']['6540'];
    $data['motNumOrder'] = '1'; //!empty($dealInfo['data']['6586'])?$dealInfo['data']['6586']:'1';
    $data['motSerial'] = $dealInfo['data']['6612'];
    $data['motYear'] = $dealInfo['data']['3219'];
    $data['motMake'] = $dealInfo['data']['3218'];
    $data['motModel'] = $dealInfo['data']['3220'];
    if (!empty($dealInfo['data']['6571'])) {
        $motorType = preg_replace('/\s+/', '', $dealInfo['data']['6571']);
        if ($motorType !== 'INBOARD' && $motorType !== 'OUTBOARD' && $motorType !== 'STERNDRIVE') {
            $data['motType'] = 'INBOARD';
        } else {
            $data['motType'] = $motorType;
        }
    } else {
        $data['motType'] = '';
    }
    $data['motHorsePower'] = $dealInfo['data']['6613'];
    $data['trSerial'] = $dealInfo['data']['6657'];
    $data['trYear'] = $dealInfo['data']['6624'];
    $data['trModel'] = $dealInfo['data']['6623'];
    $data['sellingPrice'] = $dealInfo['data']['7431'];
    $data['cashDown'] = $dealInfo['data']['7467'];
    $data['totalAmountFinanced'] = $dealInfo['data']['7649'];
    $data['term'] = $dealInfo['data']['7644'];
    $data['rate'] = $dealInfo['data']['7645'];
    $data['daysToFirstPayment'] = $dealInfo['data']['7646'];
    $data['trInNumOrder'] = !empty($dealInfo['data']['7469']) ? $dealInfo['data']['7469'] : '1';
    $data['trInSerial'] = $dealInfo['data']['7478'];
    $data['trInMake'] = $dealInfo['data']['7474'];
    $data['trInModel'] = $dealInfo['data']['7475'];
    $data['trInTradeInAllowance'] = $dealInfo['data']['7445'];
    $data['trInTradeInPayoff'] = $dealInfo['data']['7446'];
    $data['customerId'] = $dealInfo['data']['3210'];
    $data['dealer_options'] = $dealInfo['data']['dealer_options'];
    $data['insurances'] = $dealInfo['data']['insurances'];
    $data['motors'] = $dealInfo['data']['motors'];
    $data = array_filter($data);
    /*
      // temp values to bypass PHP validation
      $data['ssn'] = '<SSN>654-46-5465</SSN>';
      $data['homePhone']  = '<HomePhone>654-065-4065</HomePhone>';
      $data['mobilePhone'] = '<MobilePhone>654-065-4065</MobilePhone>';
      $data['city'] = 'PARROTT';
      $data['state'] = 'GA';
      $data['zipcode'] = '39877';
      $data['howLongYears'] = '<HowLongYears>8</HowLongYears>';
      $data['howLongMonths'] = '<HowLongMonths>0</HowLongMonths>';
      $data['motHorsePower'] = '<HorsePower>145</HorsePower>';
      $data['emEmployerName'] = 'Test company';
      $data['emGrossSalary'] = '<GrossSalary>3232</GrossSalary>';
      $data['emHowLongYears'] = '<HowLongYears>8</HowLongYears>';
      $data['emHowLongMonths'] = '<HowLongMonths>0</HowLongMonths>';
      $data['trYear'] = '<Year>2004</Year>';
      $data['sellingPrice'] = '111219';
      $data['cashDown'] = '<CashDown>20870</CashDown>';
      $data['totalAmountFinanced'] = '75211';
      $data['term'] = '<Term>240</Term>';
      $data['rate'] = '<Rate>8.00</Rate>';
      $data['daysToFirstPayment'] = '<DaysToFirstPayment>30</DaysToFirstPayment>';
      $data['trInNumOrder'] = '1';
      $data['trInMake'] = 'A &amp; L Fiberglass';
      $data['trInModel'] = 'Lagoon Classic';
      $data['trInTradeInAllowance'] = '<TradeInAllowance>25000</TradeInAllowance>';
      $data['trInTradeInPayoff'] = '<TradeInPayoff>0</TradeInPayoff>'; */

    // get sample xml
    $header = '<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <soap:Body>
                <ImportApplication xmlns="http://tempuri.org/">
                  <AppOneApplicationXML>
                    <![CDATA[';

    //Check for Individaul and Joint XMLs
    $isIndividual = 'Y';
    if (array_key_exists('cobFirstName', $data) && !is_null($data['cobFirstName']))
        $isIndividual = 'N';


    //Creating XML structure for AppOneApplication
    $individualXML = new DOMDocument();
    $individualXML->loadXML('<AppOneApplication/>');
    $individualXML->preserveWhiteSpace = false;
    $individualXML->formatOutput = true;
    $AppOneApplication = $individualXML->getElementsByTagName("AppOneApplication");

    //Sender
    $sender = $individualXML->createElement("Sender");
    $sender->appendChild($individualXML->createElement('UserName', 'marinemax'));
    $sender->appendChild($individualXML->createElement('Password', 'Password123'));
    $sender->appendChild($individualXML->createElement('RecordID', $data['fiQuoteNo']));

    //Dealer
    $dealer = $individualXML->createElement("Dealer");
    //$dealer ->appendChild($individualXML->createElement('SenderID','2.7'));
    $dealer->appendChild($individualXML->createElement('AppOneID', $data['lmAppOneID']));
    $dealer->appendChild($individualXML->createElement('Type', 'Recreational'));
    $dealer->appendChild($individualXML->createElement('Name', $data['lmDisplayName']));
    $dealer->appendChild($individualXML->createElement('Address1', $data['lmAddress1']));
    $dealer->appendChild($individualXML->createElement('Address2', $data['lmAddress2']));
    $dealer->appendChild($individualXML->createElement('City', $data['lmCity']));
    $dealer->appendChild($individualXML->createElement('State', $data['lmState']));
    $dealer->appendChild($individualXML->createElement('ZipCode', $data['lmZipCode']));
    if (array_key_exists('lmPhone', $data) && !is_null($data['lmPhone'])) { //&& strlen(str_replace(') ','-',str_replace('(','',$data['lmPhone']))) === 12) {
        $phoneNo = str_replace(') ', '-', str_replace('(', '', $data['lmPhone']));
        $dealer->appendChild($individualXML->createElement('Phone', $phoneNo));
    } else {
        $dealer->appendChild($individualXML->createElement('Phone', '000-000-0000'));
    }
    if (strlen($data['lmFax']))
        $dealer->appendChild($individualXML->createElement('Fax', $data['lmFax']));
    $dealer->appendChild($individualXML->createElement('SalesPersonName', $data['salesPersonName']));
    $dealer->appendChild($individualXML->createElement('FIPersonName', $data['lmBusinessManager']));

    //Borrowers
    $borrowers = $individualXML->createElement("Borrowers");
    $borrower1 = borrower($individualXML, '1', $data, $isIndividual);
    $borrowers->appendChild($borrower1);
    if ($isIndividual !== 'Y') {
        $borrower2 = borrower($individualXML, '2', $data, $isIndividual);
        $borrowers->appendChild($borrower2);
    }

    //Adding Nodes to Root Element
    $root = $individualXML->documentElement;
    $root->appendChild($individualXML->createElement('Version', '2.8'));
    $root->appendChild($sender);
    $root->appendChild($dealer);
    /* if ($isIndividual !== 'Y')
      $root->appendChild($individualXML->createElement('JointCreditAcknowledgment', 'true'));
      else if ($data['fiUseEntity'] === 'Y')
      $root->appendChild($individualXML->createElement('JointCreditAcknowledgment', '0')); */
    $root->appendChild($borrowers);

    //Collateral
    if ((array_key_exists('unitDsgnCode', $data) && strlen($data['unitDsgnCode']) !== 0) && (array_key_exists('unitModelYr', $data) && strlen($data['unitModelYr']) !== 0)) {
        $collateral = $individualXML->createElement("Collateral");
        $collateral->appendChild($individualXML->createElement('Type', 'MARINE'));
        $collateral->appendChild($individualXML->createElement('StockNo', substr($data['fiStockNo'], 0, 30)));
        if ($data['unitDsgnCode'] === 'C' || $data['unitDsgnCode'] === 'U' || $data['unitDsgnCode'] === 'W')
            $collateral->appendChild($individualXML->createElement('Age', 'USED'));
        if ($data['unitDsgnCode'] === 'CR' || $data['unitDsgnCode'] === 'N')
            $collateral->appendChild($individualXML->createElement('Age', 'NEW'));
        if (array_key_exists('unitSerialNo', $data))
            $collateral->appendChild($individualXML->createElement('Serial', substr($data['unitSerialNo'], 0, 20)));
        $collateral->appendChild($individualXML->createElement('Year', $data['unitModelYr']));
        $collateral->appendChild($individualXML->createElement('Make', substr($data['unitBrandDesc'], 0, 30)));
        $collateral->appendChild($individualXML->createElement('Model', substr($data['unitModelDesc'], 0, 30)));
        if (array_key_exists('unitStyle', $data))
            $collateral->appendChild($individualXML->createElement('Style', substr($data['unitStyle'], 0, 30)));
        if (array_key_exists('unitExteriorColor', $data))
            $collateral->appendChild($individualXML->createElement('Color', substr($data['unitExteriorColor'], 0, 30)));
        //$collateral ->appendChild($individualXML->createElement('Mileage',$inArray['BrandDesc']));

        if ($data['unitLength'] !== null) {
            $len = substr($data['unitLength'], 0, strrpos($data['unitLength'], '\'')) * 12 + substr($data['unitLength'], strrpos($data['unitLength'], '\''), strrpos($data['unitLength'], '\"'));
            if ($len <= 255)
                $collateral->appendChild($individualXML->createElement('Length', $len));
        }

        if ($data['unitFuelType'] === 'G')
            $collateral->appendChild($individualXML->createElement('FuelType', 'GAS'));
        else if ($data['unitFuelType'] === 'D')
            $collateral->appendChild($individualXML->createElement('FuelType', 'DIESEL'));
        else if ($data['unitFuelType'] === 'O')
            $collateral->appendChild($individualXML->createElement('FuelType', 'OTHER'));
        else
            $collateral->appendChild($individualXML->createElement('FuelType', 'UNKNOWN'));
        /* $collateral ->appendChild($individualXML->createElement('MSRP',0));
          $collateral ->appendChild($individualXML->createElement('CostPrice',0));
          $collateral ->appendChild($individualXML->createElement('SellingPrice',0)); */
        $collateral->appendChild($individualXML->createElement('IsCPO', 0)); //'FALSE'));
        //Motors
        if (count($data['motors'])) {
            $motors = $individualXML->createElement("Motors");
            $i = 1;
            foreach ($data['motors'] as $mot) {
                if ((array_key_exists('6575', $mot) && strlen($mot['6575']) !== 0) && isset($mot['6581']) && strlen($mot['6581'])) {
                    if (array_key_exists('6581', $mot)) {
                        $motor = $individualXML->createElement("Motor");
                        $motors->appendChild($motor);
                        $motor->appendChild($individualXML->createElement('NumOrder', $i));
                        if ($mot['6570'] === 'C' || $mot['6570'] === 'U' || $mot['6570'] === 'W')
                            $motor->appendChild($individualXML->createElement('Age', 'USED'));
                        else if ($mot['6570'] === 'CR' || $mot['6570'] === 'N')
                            $motor->appendChild($individualXML->createElement('Age', 'NEW'));

                        $motor->appendChild($individualXML->createElement('Serial', $mot['6581']));

                        $motor->appendChild($individualXML->createElement('Year', $mot['6575']));
                        if (array_key_exists('unitMotorMfg', $mot))
                            $motor->appendChild($individualXML->createElement('Make', $mot['6572']));
                        if (array_key_exists('unitMotorModel', $mot))
                            $motor->appendChild($individualXML->createElement('Model', $mot['6574']));
                        if (isset($mot['6571']) && strtolower($mot['6571']) === 'stern drive')
                            $motor->appendChild($individualXML->createElement('Type', 'STERNDRIVE'));
                        else if (isset($mot['6571']) && strtolower($mot['6571']) === 'outboard')
                            $motor->appendChild($individualXML->createElement('Type', 'OUTBOARD'));
                        else
                            $motor->appendChild($individualXML->createElement('Type', 'INBOARD'));
                        if (array_key_exists('6578', $mot) && strlen($mot['6578']))
                            $motor->appendChild($individualXML->createElement('HorsePower', $mot['6578']));
                        //$collateral ->appendChild($individualXML->createElement('Mileage',$inArray['BrandDesc']));
                        //$motor->appendChild($individualXML->createElement('Length', $inArray['Length']));
                        if (array_key_exists('6579', $mot)) {
                            if ($mot['6579'] === 'G')
                                $motor->appendChild($individualXML->createElement('FuelType', 'GAS'));
                            else if ($mot['6579'] === 'D')
                                $motor->appendChild($individualXML->createElement('FuelType', 'DIESEL'));
                            else if ($mot['6579'] === 'O')
                                $motor->appendChild($individualXML->createElement('FuelType', 'OTHER'));
                            else
                                $motor->appendChild($individualXML->createElement('FuelType', 'UNKNOWN'));
                        }
                        //$motor ->appendChild($individualXML->createElement('MSRP',0));
                        //$motor ->appendChild($individualXML->createElement('CostPrice',0));
                        //$motor ->appendChild($individualXML->createElement('SellingPrice',0));
                        $motors->appendChild($motor);
                        $i++;
                    }
                }
            }
            $collateral->appendChild($motors);
        }
        /* if(count($data['motors_new'])) {
          $motors = $individualXML->createElement("Motors");
          $i       = 1;
          foreach ($data['motors_new'] as $mot) {
          if ((array_key_exists('MotorModelYear', $mot) && strlen($mot['MotorModelYear']) !== 0)) {
          if (array_key_exists('MotorSerialNo', $mot)) {
          $motor = $individualXML->createElement("Motor");
          $motors->appendChild($motor);
          $motor->appendChild($individualXML->createElement('NumOrder', $i));
          if ($mot['MotorDsgn'] === 'C' || $mot['MotorDsgn'] === 'U' || $mot['MotorDsgn'] === 'W')
          $motor->appendChild($individualXML->createElement('Age', 'USED'));
          else if ($mot['MotorDsgn'] === 'CR' || $mot['MotorDsgn'] === 'N')
          $motor->appendChild($individualXML->createElement('Age', 'NEW'));

          $motor->appendChild($individualXML->createElement('Serial', $mot['MotorSerialNo']));

          $motor->appendChild($individualXML->createElement('Year', $mot['MotorModelYear']));
          if (array_key_exists('unitMotorMfg', $mot))
          $motor->appendChild($individualXML->createElement('Make', $mot['MotorMfg']));
          if (array_key_exists('unitMotorModel', $mot))
          $motor->appendChild($individualXML->createElement('Model', $mot['MotorModel']));
          if (isset($mot['MotorType']) && strtolower($mot['MotorType']) === 'stern drive')
          $motor->appendChild($individualXML->createElement('Type', 'STERNDRIVE'));
          else if (isset($mot['MotorType']) && strtolower($mot['MotorType']) === 'outboard')
          $motor->appendChild($individualXML->createElement('Type', 'OUTBOARD'));
          else
          $motor->appendChild($individualXML->createElement('Type', 'INBOARD'));
          if (array_key_exists('MotorHorsePower', $mot))
          $motor->appendChild($individualXML->createElement('HorsePower', $mot['MotorHorsePower']));
          //$collateral ->appendChild($individualXML->createElement('Mileage',$inArray['BrandDesc']));
          //$motor->appendChild($individualXML->createElement('Length', $inArray['Length']));
          if (array_key_exists('MotorFuelTypeCode', $mot)) {
          if ($mot['MotorFuelTypeCode'] === 'G')
          $motor->appendChild($individualXML->createElement('FuelType', 'GAS'));
          else if ($mot['MotorFuelTypeCode'] === 'D')
          $motor->appendChild($individualXML->createElement('FuelType', 'DIESEL'));
          else if ($mot['MotorFuelTypeCode'] === 'O')
          $motor->appendChild($individualXML->createElement('FuelType', 'OTHER'));
          else
          $motor->appendChild($individualXML->createElement('FuelType', 'UNKNOWN'));
          }
          $motors->appendChild($motor);
          $i++;
          }
          }
          }
          $collateral->appendChild($motors);
          } */

        //Trailer
        if (array_key_exists('trSerial', $data) && !is_null($data['trSerial'])) {
            $trailer = $individualXML->createElement("Trailer");
            if ($data['unitTrailerDsgnCode'] === 'C' || $data['unitTrailerDsgnCode'] === 'U' || $data['unitTrailerDsgnCode'] === 'W')
                $trailer->appendChild($individualXML->createElement('Age', 'USED'));
            else if ($data['unitTrailerDsgnCode'] === 'CR' || $data['unitTrailerDsgnCode'] === 'N')
                $trailer->appendChild($individualXML->createElement('Age', 'NEW'));
            if (strlen($data['trSerial']) >= 0 || strlen($data['trSerial']) <= 20)
                $trailer->appendChild($individualXML->createElement('Serial', substr($data['trSerial'], 0, 30)));
            if (array_key_exists('trYear', $data) && !is_null($data['trYear'])) {
                $trailer->appendChild($individualXML->createElement('Year', $data['trYear']));
            }
            if (strlen($data['unitTrailerBrand']) >= 0 || strlen($data['unitTrailerBrand']) <= 30)
                $trailer->appendChild($individualXML->createElement('Make', substr($data['unitTrailerBrand'], 0, 30)));
            if (is_numeric($data['trModel']))
                $trailer->appendChild($individualXML->createElement('Model', $data['trModel']));
            if (is_numeric($data['trModel']) && intval($data['trModel']) <= 255)
                $trailer->appendChild($individualXML->createElement('Axles', $data['trModel']));
            /* $trailer ->appendChild($individualXML->createElement('MSRP',0));
              $trailer ->appendChild($individualXML->createElement('CostPrice',0));
              $trailer ->appendChild($individualXML->createElement('SellingPrice',0)); */
            $collateral->appendChild($trailer);
        }

        // Options
        if (count($data['dealer_options'])) {
            $options = $individualXML->createElement("Options");
            $i = 1;
            foreach ($data['dealer_options'] as $opt) {
                if (intval($opt['7492']) > 0) {
                    $option = $individualXML->createElement("Option");
                    $options->appendChild($option);

                    $option->appendChild($individualXML->createElement('NumOrder', $i));
                    if (isset($opt['7490'])) {
                        $option->appendChild($individualXML->createElement('Name', $opt['7490']));
                        $option->appendChild($individualXML->createElement('Description', $opt['7490']));
                    }
                    if (isset($opt['7492']))
                        $option->appendChild($individualXML->createElement('SellingPrice', $opt['7492']));
                    if (isset($opt['7494'])) {
                        $isTaxable = ($opt['7494'] == 'N') ? 0 : 1;
                        $option->appendChild($individualXML->createElement('IsTaxable', $isTaxable));
                    }
                    $i++;
                }
            }
            $collateral->appendChild($options);
        }
        /* if(count($data['dealer_options_new'])) {
          $options = $individualXML->createElement("Options");
          $i       = 1;
          foreach ($data['dealer_options_new'] as $opt) {
          if (intval($opt['DlrOptCost']) > 0) {
          $option = $individualXML->createElement("Option");
          $options->appendChild($option);

          $option->appendChild($individualXML->createElement('NumOrder', $i));
          if (isset($opt['DlrOptDesc'])) {
          $option->appendChild($individualXML->createElement('Name', $opt['DlrOptDesc']));
          $option->appendChild($individualXML->createElement('Description', $opt['DlrOptDesc']));
          }
          if (isset($opt['DlrOptCost']))
          $option->appendChild($individualXML->createElement('SellingPrice', $opt['DlrOptCost']));
          if (isset($opt['DlrOptIsTaxed'])) {
          $isTaxable = ($opt['DlrOptIsTaxed'] == 'N') ? 0 : 1;
          $option->appendChild($individualXML->createElement('IsTaxable', $isTaxable));
          }
          $i++;
          }
          }
          $collateral->appendChild($options);
          } */

        /*
          //Valuation
          $valuation = $individualXML->createElement("Valuation");
          $valuation ->appendChild($individualXML->createElement('Source','2.7'));
          $valuation ->appendChild($individualXML->createElement('Region','2.7'));
          $valuation ->appendChild($individualXML->createElement('ValuationDate','2.7'));
          $valuation ->appendChild($individualXML->createElement('VehicleCode','2.7'));
          $valuation ->appendChild($individualXML->createElement('MSRP','2.7'));
          $valuation ->appendChild($individualXML->createElement('BaseRetailValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('BaseWholeSaleValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('MileageAdjustmentValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('RetailAdjustmentValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('WholeSaleAdjustmentValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('FinalRetailValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('FinalWholeSaleValue','2.7'));
          $valuation ->appendChild($individualXML->createElement('FinalCPOValue','2.7'));

          $optionsVals = $individualXML->createElement("Options");
          $optionVal = $individualXML->createElement("Option");
          $optionsVals ->appendChild($optionVal);

          $optionVal ->appendChild($individualXML->createElement('Code','2.7'));
          $optionVal ->appendChild($individualXML->createElement('Name','2.7'));
          $optionVal ->appendChild($individualXML->createElement('IsIncluded','2.7'));
          $optionVal ->appendChild($individualXML->createElement('IsIncludedInTrim','2.7'));
          $optionVal ->appendChild($individualXML->createElement('TradeInValue','2.7'));
          $optionVal ->appendChild($individualXML->createElement('LoanValue','2.7'));
          $optionVal ->appendChild($individualXML->createElement('RetailValue','2.7'));
          $optionVal ->appendChild($individualXML->createElement('AvgTradeInValue','2.7'));
          $optionVal ->appendChild($individualXML->createElement('RoughTradeInValue','2.7'));

          $valuation ->appendChild($optionsVals); */

        //Adding to Collateral
        //$collateral ->appendChild($options);
        $root->appendChild($collateral);
    }

    /**
     * OLD FEES and PRODUCT list
      $resBody       = GetDefaultBackendProductsAndFees();
      $feeObj        = $resBody->FeeList->Fee;
      $prodObj       = $resBody->ProductList->Product;
      $totalFees     = 0;
      $totalProducts = 0;

      foreach ($feeObj as $key => $value) {
      $totalFees += $feeObj[$key]->DefaultAmount;
      }
      foreach ($prodObj as $key => $value) {
      $totalProducts += $prodObj[$key]->DefaultSellingPriceAmount;
      } */
    //Structure
    if ((array_key_exists('fiSellingAmt', $data) && strlen($data['fiSellingAmt']) !== 0) && (array_key_exists('totalAmountFinanced', $data) && strlen($data['totalAmountFinanced']) !== 0)) {
        $structure = $individualXML->createElement("Structure");
        $structure->appendChild($individualXML->createElement('SellingPrice', $data['fiSellingAmt']));
        if (array_key_exists('fiTradeAllowance', $data) && strlen($data['fiTradeAllowance']) !== 0)
            $structure->appendChild($individualXML->createElement('TradeInAllowance', $data['fiTradeAllowance']));
        if (array_key_exists('fiTradePayouts', $data) && strlen($data['fiTradePayouts']) !== 0)
            $structure->appendChild($individualXML->createElement('TradeInPayoff', $data['fiTradePayouts']));
        if (array_key_exists('fiRebates', $data) && strlen($data['fiRebates']) !== 0)
            $structure->appendChild($individualXML->createElement('Rebate', $data['fiRebates']));
        //$cashDown = $inArray['DownPayments'] + $inArray['DownPmtAmt'];
        if ((array_key_exists('cashDown', $data) && strlen($data['cashDown']) !== 0)) {
            $structure->appendChild($individualXML->createElement('CashDown', $data['cashDown']));
        }
        if (array_key_exists('fiTaxList', $data) && strlen($data['fiTaxList']) !== 0)
            $structure->appendChild($individualXML->createElement('Taxes', $data['fiTaxList']));
        // REMOVED AS PER CLIENT
        //$structure->appendChild($individualXML->createElement('TotalFees', $totalFees));
        //$structure->appendChild($individualXML->createElement('TotalProducts', $totalProducts));
        $structure->appendChild($individualXML->createElement('TotalAmountFinanced', $data['totalAmountFinanced']));
        if (array_key_exists('term', $data) && strlen($data['term']) !== 0)
            $structure->appendChild($individualXML->createElement('Term', $data['term']));
        if (array_key_exists('rate', $data) && strlen($data['rate']) !== 0)
            $structure->appendChild($individualXML->createElement('Rate', $data['rate']));
        if (array_key_exists('daysToFirstPayment', $data) && strlen($data['daysToFirstPayment']) !== 0)
            $structure->appendChild($individualXML->createElement('DaysToFirstPayment', $data['daysToFirstPayment']));

        // NEW PRODUCT LIST
        if (count($data['insurances'])) {
            $products = $individualXML->createElement("Products");
            foreach ($data['insurances'] as $key => $value) {
                if (isset($value['7660']) && ($value['7660'] == 'EXTW' || $value['7660'] == 'VANP')) {
                    $product = $individualXML->createElement("Product");

                    if ($value['7660'] == 'EXTW')
                        $product->appendChild($individualXML->createElement('Code', 'vsc'));
                    else if ($value['7660'] == 'VANP')
                        $product->appendChild($individualXML->createElement('Code', 'paint'));

                    if (isset($value['7661']) && strlen($value['7661'])) {
                        //$name = str_replace('&', '&amp;', $value['7661']);
                        if ($value['7660'] == 'EXTW')
                            $name = 'Vehicle Service Contract/Warranty';
                        else if ($value['7660'] == 'VANP')
                            $name = 'Paint Protection';
                        $product->appendChild($individualXML->createElement('Name', $name));
                        $product->appendChild($individualXML->createElement('CompanyName', $name));
                    }
                    //if (isset($value['7663']) && strlen($value['7663'])) {
                    //    $product->appendChild($individualXML->createElement('CompanyName', $value['7663']));
                    //}
                    if (isset($value['7668']) && strlen($value['7668'])) {
                        $product->appendChild($individualXML->createElement('CostPriceAmount', $value['7668']));
                    }
                    if (isset($value['7666']) && strlen($value['7666'])) {
                        $product->appendChild($individualXML->createElement('SellingPriceAmount', $value['7666']));
                    }
                    $product->appendChild($individualXML->createElement('IsTaxed', 1));
                    if (isset($value['7665']) && strlen($value['7665'])) {
                        $product->appendChild($individualXML->createElement('CoverageTerm', $value['7665']));
                    }
                    $products->appendChild($product);
                }
            }
            //Adding to Structure
            $structure->appendChild($products);
        }
        /* if(count($data['insurances_new'])) {
          $products = $individualXML->createElement("Products");
          foreach ($data['insurances_new'] as $key => $value) {
          if(isset($value['InsCode']) && ($value['InsCode'] == 'EXTW' || $value['InsCode'] == 'VANP')) {
          $product = $individualXML->createElement("Product");

          if($value['InsCode'] == 'EXTW')
          $product->appendChild($individualXML->createElement('Code', 'vsc'));
          else if($value['InsCode'] == 'VANP')
          $product->appendChild($individualXML->createElement('Code', 'paint'));

          if(isset($value['InsDesc']) && strlen($value['InsDesc'])) {
          //$name = str_replace('&', '&amp;', $value['InsDesc']);
          if($value['InsCode'] == 'EXTW')
          $name = 'Vehicle Service Contract/Warranty';
          else if($value['InsCode'] == 'VANP')
          $name = 'Paint Protection';
          $product->appendChild($individualXML->createElement('Name', $name));
          $product->appendChild($individualXML->createElement('CompanyName', $name));
          }
          if(isset($value['InsCost']) && strlen($value['InsCost'])) {
          $product->appendChild($individualXML->createElement('CostPriceAmount', $value['InsCost']));
          }
          if(isset($value['InsPrem']) && strlen($value['InsPrem'])) {
          $product->appendChild($individualXML->createElement('SellingPriceAmount', $value['InsPrem']));
          }
          $product->appendChild($individualXML->createElement('IsTaxed', 1));
          if(isset($value['InsTerm']) && strlen($value['InsTerm'])) {
          $product->appendChild($individualXML->createElement('CoverageTerm', $value['InsTerm']));
          }
          $products->appendChild($product);
          }
          }
          //Adding to Structure
          $structure->appendChild($products);
          } */

        /**
         * OLD FEES & PRODUCTS LIST
          //Fees
          $fees = $individualXML->createElement("Fees");
          foreach ($feeObj as $key => $value) {
          $fee = $individualXML->createElement("Fee");
          $fees->appendChild($fee);
          $fee->appendChild($individualXML->createElement('Code', $feeObj[$key]->Code));
          $fee->appendChild($individualXML->createElement('Name', $feeObj[$key]->Name));
          $fee->appendChild($individualXML->createElement('Amount', $feeObj[$key]->DefaultAmount));
          $fee->appendChild($individualXML->createElement('IsTaxed', 'false'));
          }

          //Products
          $products = $individualXML->createElement("Products");
          foreach ($prodObj as $key => $value) {
          $product = $individualXML->createElement("Product");
          $product->appendChild($individualXML->createElement('Code', $prodObj[$key]->Code));
          if (strpos($prodObj[$key]->Name, '&') !== false)
          $product->appendChild($individualXML->createElement('Name', str_replace('&', '&amp;', $prodObj[$key]->Name)));
          else
          $product->appendChild($individualXML->createElement('Name', $prodObj[$key]->Name));
          if ($prodObj[$key]->CompanyName !== '')
          $product->appendChild($individualXML->createElement('CompanyName', $prodObj[$key]->CompanyName));
          else
          $product->appendChild($individualXML->createElement('CompanyName', 'A'));
          //$product ->appendChild($individualXML->createElement('CostPriceAmount',$prodObj[$key]->DefaultSellingPriceAmount));
          $product->appendChild($individualXML->createElement('SellingPriceAmount', $prodObj[$key]->DefaultSellingPriceAmount));
          $product->appendChild($individualXML->createElement('IsTaxed', 'true'));
          $product->appendChild($individualXML->createElement('TaxAmount', $prodObj[$key]->DefaultTaxRate));
          //$product ->appendChild($individualXML->createElement('DeductibleAmount',$prodObj[$key]->DefaultSellingPriceAmount));
          //$product ->appendChild($individualXML->createElement('CoverageTerm',''));
          //$product ->appendChild($individualXML->createElement('CoverageMileage',''));
          //$product ->appendChild($individualXML->createElement('CoverageDescription',''));
          //$product ->appendChild($individualXML->createElement('CoverageType',''));
          $products->appendChild($product);
          }
          //Adding to Structure
          $structure->appendChild($fees);
          $structure->appendChild($products); */
        $root->appendChild($structure);
    }

    //TradeInInfo
    if (array_key_exists('fiTradeModelYr', $data) && strlen($data['fiTradeModelYr']) !== 0) {
        $tradeInInfo = $individualXML->createElement("TradeInInfo");
        $tradeIn = $individualXML->createElement("TradeIn");
        $tradeInInfo->appendChild($tradeIn);

        $tradeIn->appendChild($individualXML->createElement('NumOrder', '1'));
        if (array_key_exists('trInSerial', $data) && strlen($data['trInSerial'] !== 0))
            $tradeIn->appendChild($individualXML->createElement('Serial', substr($data['trInSerial'], 0, 20)));
        if (array_key_exists('fiTradeModelYr', $data))
            $tradeIn->appendChild($individualXML->createElement('Year', $data['fiTradeModelYr']));
        if (array_key_exists('trInMake', $data) && strlen($data['trInMake'] !== 0))
            $tradeIn->appendChild($individualXML->createElement('Make', substr($data['trInMake'], 0, 30)));
        if (array_key_exists('trInModel', $data) && strlen($data['trInModel'] !== 0))
            $tradeIn->appendChild($individualXML->createElement('Model', substr($data['trInModel'], 0, 30)));
        //$tradeIn ->appendChild($individualXML->createElement('Style',$inArray['TradeModelYear']));
        //$tradeIn ->appendChild($individualXML->createElement('Mileage',$inArray['TradeModelYear']));
        if (array_key_exists('fiTradeAllowance', $data) && strlen($data['fiTradeAllowance'] !== 0))
            $tradeIn->appendChild($individualXML->createElement('TradeInAllowance', $data['fiTradeAllowance']));
        if (array_key_exists('fiTradePayout', $data) && strlen($data['fiTradePayout'] !== 0))
            $tradeIn->appendChild($individualXML->createElement('TradeInPayoff', $data['fiTradePayout']));
        //$tradeIn ->appendChild($individualXML->createElement('LienHolder','2.7'));
        //$tradeIn ->appendChild($individualXML->createElement('LienHolderPhone','2.7'));
        //$tradeIn ->appendChild($individualXML->createElement('LienHolderAccountNum','2.7'));
        $root->appendChild($tradeInInfo);
    }

    // InsuranceInfo
    if (array_key_exists('fiInsDeductible', $data) && strlen($data['fiInsDeductible']) !== 0) {
        $insuranceInfo = $individualXML->createElement("InsuranceInfo");
        if (array_key_exists('fiInsCompanyDesc', $data))
            $insuranceInfo->appendChild($individualXML->createElement('Company', $data['fiInsCompanyDesc']));
        if (array_key_exists('fiInsCompanyAgent', $data))
            $insuranceInfo->appendChild($individualXML->createElement('Agent', $data['fiInsCompanyAgent']));
        if (array_key_exists('fiInsCompanyPhone', $data) && !is_null($data['fiInsCompanyPhone'])) {
            $insCompanyPhone = str_replace(') ', '-', str_replace('(', '', $data['fiInsCompanyPhone']));
            $insuranceInfo->appendChild($individualXML->createElement('AgentPhone', $insCompanyPhone));
        } else {
            $insuranceInfo->appendChild($individualXML->createElement('AgentPhone', '000-000-0000'));
        }
        if (array_key_exists('fiInsPolicyNo', $data))
            $insuranceInfo->appendChild($individualXML->createElement('PolicyNumber', $data['fiInsPolicyNo']));
        $insuranceInfo->appendChild($individualXML->createElement('Deductible', $data['fiInsDeductible']));
        $root->appendChild($insuranceInfo);
    }

    $footer = ']]>
                  </AppOneApplicationXML>
                </ImportApplication>
              </soap:Body>
            </soap:Envelope>';

    // Create and store XML content
    $dealNodeId = $deal['deal_node_id'];
    $customerId = $data['customerId'];
    $fileName = 'Deal_' . $dealNodeId . '_Customer_' . $customerId . '_AppOne_ImportApplication.xml'; //uniqid(mt_rand(),true).'.xml';
    $saveFilePath = '../../public/appone_xml/' . $fileName;
    //$downloadFilePath = ABS_API_URL . 'public/appone_xml/' . $fileName;
    //$individualXML->save($saveFilePath);
    // AppOne XML file to AWS
    $xmlHTML = $individualXML->saveHTML();
    $sdkApi = new AwsS3Core();
    $xml = $sdkApi->setFileData("public/appone_xml/" . $fileName, $xmlHTML, "text");
    $downloadFilePath = $xml['object_url'];
    //$xmlAppData = createFolderNFile($xml,$fileName);
    // Enable user error handling
    libxml_use_internal_errors(true);
    $dom_xml = new DOMDocument();
    //$dom_xml->load('../../public/appone_xml/' . $fileName);
    $dom_xml->load($downloadFilePath);

    $result = array();
    $xml = file_get_contents($downloadFilePath);
    $xml = strstr($xml, '<AppOneApplication>');
    $result['xml'] = $header . $xml . $footer;
    if (!$dom_xml->schemaValidate('appone/AppOneApplication.xsd')) {
        $errors = libxml_get_errors();
        $response = '';
        foreach ($errors as $error) {
            $response .= libxml_display_error($error);
        }
        libxml_clear_errors();
        $result['error'] .= $response;
        $result['link'] = '<div class="appone_download"><a href="' . $downloadFilePath . '" download>Download XML</a></div>';
    }

    return $result;
}

/**
 * Function not in use
 * Created By: Amit Malakar
 * Date: 14-Nov-2016
 * Response XML data from AppOne
 * @param $builderApiObj
 * @param $deal
 * @return array
 */
function getRequestXMLContent($builderApiObj, $deal) {

    $res = validateData($builderApiObj, $deal);
    $data = $res['data'];

    // get sample xml
    $xml = '<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <soap:Body>
            <ImportApplication xmlns="http://tempuri.org/">
              <AppOneApplicationXML>
                <![CDATA[
        <AppOneApplication xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="AppOneApplication_v2_6.xsd">
          <Version>2.6</Version>
          <Sender>
            <UserName>marinemax</UserName>
            <Password>Password123</Password>
            <RecordID>1396479302</RecordID>
          </Sender>
          <Dealer>
            <SenderID />
            <AppOneID>1000472</AppOneID>
            <Type>Recreational</Type>
            <Name>The Big Dealer, Inc. (MR)</Name>
            <Address1>123 STREET</Address1>
            <City>STATEN ISLAND</City>
            <State>NV</State>
            <ZipCode>10308</ZipCode>
            <Phone>123-456-7890</Phone>
            <SalesPersonName>' . $data['salesPersonName'] . '</SalesPersonName>
          </Dealer>
          <Borrowers>
            <Borrower>
              <NumOrder>1</NumOrder>
              <Type>INDIVIDUAL</Type>
              <FirstName>' . $data['firstName'] . '</FirstName>
              <LastName>' . $data['lastName'] . '</LastName>
              ' . $data['ssn'] . '
              ' . $data['dob'] . '
              ' . $data['homePhone'] . '
              ' . $data['mobilePhone'] . '
              <DLNo>' . $data['dlno'] . '</DLNo>
              <Addresses>
                <Address>
                  <IsCurrent>' . $data['isCurrent'] . '</IsCurrent>
                  <IsMailing>' . $data['isMailing'] . '</IsMailing>
                  <StreetNo>516156</StreetNo>
                  <StreetName>516156 STREET</StreetName>
                  ' . $data['city'] . '
                  <County>TERRELL</County>
                  ' . $data['state'] . '
                  ' . $data['zipcode'] . '
                  ' . $data['howLongYears'] . '
                  ' . $data['howLongMonths'] . '
                  <MonthlyPayment>888</MonthlyPayment>
                </Address>
              </Addresses>
              <EmploymentInfo>
                <Employment>
                  <IsCurrent>true</IsCurrent>
                  <NumOrder>1</NumOrder>
                  <Status>EMPLOYED</Status>
                  <Occupation>aerh</Occupation>
                  <EmployerName>' . $data['emEmployerName'] . '</EmployerName>
                  <GrossSalary>' . $data['emGrossSalary'] . '</GrossSalary>
                  <HowLongYears>' . $data['emHowLongYears'] . '</HowLongYears>
                  <HowLongMonths>' . $data['emHowLongMonths'] . '</HowLongMonths>
                </Employment>
              </EmploymentInfo>
            </Borrower>
          </Borrowers>
          <Collateral>
            <Type>MARINE</Type>
            <StockNo>0Z21A</StockNo>
            <Age>USED</Age>
            <Serial>1GNDT13W1V2160941</Serial>
            <Year>2004</Year>
            <Make>Fountain Powe</Make>
            <IsCPO>false</IsCPO>
            <Motors>
              <Motor>
                <NumOrder>' . $data['motNumOrder'] . '</NumOrder>
                <Serial>' . $data['motSerial'] . '</Serial>
                <Year>' . $data['motYear'] . '</Year>
                <Make>' . $data['motMake'] . '</Make>
                <Model>' . $data['motModel'] . '</Model>
                <Type>' . $data['motType'] . '</Type>
                <HorsePower>' . $data['motHorsePower'] . '</HorsePower>
              </Motor>
            </Motors>
            <Trailer>
              <Serial>' . $data['trSerial'] . '</Serial>
              <Year>' . $data['trYear'] . '</Year>
              <Make>' . $data['trMake'] . '</Make>
            </Trailer>
          </Collateral>
          <Structure>
            <SellingPrice>' . $data['sellingPrice'] . '</SellingPrice>
            <CashDown>' . $data['cashDown'] . '</CashDown>
            <TotalAmountFinanced>' . $data['totalAmountFinanced'] . '</TotalAmountFinanced>
            <Term>' . $data['term'] . '</Term>
            <Rate>' . $data['rate'] . '</Rate>
            <DaysToFirstPayment>' . $data['daysToFirstPayment'] . '</DaysToFirstPayment>
          </Structure>
          <TradeInInfo>
            <TradeIn>
              <NumOrder>' . $data['trInNumOrder'] . '</NumOrder>
              <Serial>' . $data['trInSerial'] . '</Serial>
              <Year>1995</Year>
              <Make>' . $data['trInMake'] . '</Make>
              <Model>' . $data['trInModel'] . '</Model>
              <TradeInAllowance>' . $data['trInTradeInAllowance'] . '</TradeInAllowance>
              <TradeInPayoff>' . $data['trInTradeInPayoff'] . '</TradeInPayoff>
            </TradeIn>
          </TradeInInfo>
        </AppOneApplication>
                ]]>
              </AppOneApplicationXML>
            </ImportApplication>
          </soap:Body>
        </soap:Envelope>';
    $response = array();
    if (isset($res['error'])) {
        $response['error'] = $res['error'];
    }
    $response['xml'] = $xml;
    $response['customerId'] = $data['customerId'];

    return $response;
}

function createFolderNFile($xml, $fileName) {

    // CREATE appone_xml FOLDER IF NOT EXISTS
    $dirPath = __DIR__ . '/../../../public/appone_xml/';
    $xmlFullPath = $dirPath . $fileName;
    if (!file_exists($xmlFullPath)) {
        mkdir("$dirPath", 0777, true);
    }

    // CREATE XML FILE IF NOT EXISTS, ELSE OVERWRITE
    chmod($dirPath, 0777);
    $result = file_put_contents("$dirPath/$fileName", $xml);

    return $result;
}

/**
 * Created By: Amit Malakar
 * Date: 12-Dec-2017
 * Function that makes curl request to AppOne
 * @param $builderApiObj
 * @param $deal
 * @return array
 */
function makeCurlReq($builderApiObj, $deal) {
    //$soap_request = getRequestXMLContent($builderApiObj,$deal); //file_get_contents("appone/sample_new.xml");
    $soap_request = phpXsdValidateData($builderApiObj, $deal);

    if (isset($soap_request['error'])) {
        // create XML file
        // Deal_[id]_Customer_[#]_AppOne_ImportApplication.xml
        /* $dealNodeId = $deal['deal_node_id'];
          $customerId = $soap_request['customerId'];
          $fileName = 'Deal_'.$dealNodeId.'_Customer_'.$customerId.'_AppOne_ImportApplication.xml'; //uniqid(mt_rand(),true).'.xml';
          $downloadFilePath = ABS_API_URL . 'public/appone_xml/'.$fileName;
          $xmlAppData = createFolderNFile($soap_request['xml'], $fileName);
          $soap_request['link'] = '<div class="appone_download"><a href="'.$downloadFilePath.'">Download XML</a></div>'; */

        return $soap_request;
    } else {

        $header = array(
            'Connection: Keep-Alive',
            'Content-Length: ' . strlen($soap_request['xml']),
            'Content-Type: text/xml',
            'Expect: 100-continue',
            'User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; MS Web Services Client Protocol 2.0.50727.5477)',
            'SOAPAction: http://tempuri.org/IAppOneConnect/ImportApplication',
        );

        $soap_do = curl_init();
        curl_setopt($soap_do, CURLOPT_URL, APPONE_API_URL . "/connect/dms/AppOneConnect.svc/basic");
        curl_setopt($soap_do, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($soap_do, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($soap_do, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($soap_do, CURLOPT_POST, true);
        curl_setopt($soap_do, CURLOPT_POSTFIELDS, $soap_request['xml']);
        curl_setopt($soap_do, CURLOPT_HTTPHEADER, $header);
        $response = curl_exec($soap_do);

        $result = array();
        if ($response === false) {
            $result['error'] = curl_error($soap_do);
            curl_close($soap_do);
        } else {

            // check if error
            preg_match('/<ErrorCode>(.*)<\/ErrorCode>/', $response, $match0);


            if (isset($match0[0])) {
                preg_match_all('/\sThe(.*?)failed./', $response, $match3);
                if (isset($match3[1])) {
                    $errorStr = '';
                    foreach ($match3[1] as $er) {
                        $errorStr .= 'The' . $er . "failed.<br />";
                    }
                }

                preg_match_all('/\sThe(.*?)[^The] value./', $response, $match4);
                if (isset($match4[1])) {
                    for ($i = 0; $i < count($match4[1]); $i++) {
                        $errorStr .= $match4[1][$i] . " value.<br />";
                    }
                }
                $result['error'] = $errorStr;

                return $errorStr;
            } else {

                curl_close($soap_do);
                preg_match('/<AppOneApplicationID>(.*)<\/AppOneApplicationID>/', $response, $match);
                preg_match('/<RedirectURL>(.*)<\/RedirectURL>/', $response, $match2);
                if (isset($match[1])) {
                    $result['applicationid'] = $match[1];
                }
                if (isset($match2[1])) {
                    $result['redirecturl'] = $match2[1];
                }

                // if deal appone info don't exists, create instance to save
                if (isset($result['applicationid']) && intval($result['applicationid']) > 0) {
                    $subData = $builderApiObj->getInstanceIdOfSubClass(DEAL_APPONE_CLASS_ID, $deal['deal_node_id']);
                    $subData = json_decode($subData, true);

                    $newDataArray['node_instance_id'] = $subData['data'];
                    $newDataArray['node_class_id'] = DEAL_APPONE_CLASS_ID;
                    $newDataArray['node_class_property_id'] = array(DEAL_APPONE_APPID_PROPERTY_ID, DEAL_APPONE_REQUEST_PROPERTY_ID, DEAL_APPONE_RESPONSE_PROPERTY_ID);
                    $newDataArray['value'] = array($result['applicationid'], $soap_request, $response);
                    $newDataArray['is_email'] = 'N';
                    $newDataArray['status'] = 'P';

                    $returnOpeDealResponse = $builderApiObj->setDataAndStructure($newDataArray, '1', '6');
                    $returnOpeDealResponse = json_decode($returnOpeDealResponse, true);
                    $node_x_id[] = intval($returnOpeDealResponse['data']['node_id']);

                    if ($subData['data'] == '') {
                        $newArray['node_y_id'] = $deal['deal_node_id'];
                        $newArray['node_x_ids'] = $node_x_id;
                        $returnRResponse = $builderApiObj->setDataAndStructure($newArray, '7', '9');
                    }
                }
            }

            return $result;
        }
    }
}

$result = array();
// get DEAL OPERATION PROPERTIES
$deal['deal_node_id'] = $post['deal_node_id'];
$deal['deal_instance_id'] = $post['deal_instance_id'];

//    $dealInfoJson = $builderApiObj->getDealOperationInfo($deal);
//    $dealInfo = json_decode($dealInfoJson,true);
//    print json_encode($dealInfo);exit;
//        $result = phpXsdValidateData($builderApiObj,$deal);
//        print json_encode($result);
//        exit;
//    $data = validateData($builderApiObj,$deal);
//    print json_encode($data); exit;
//    $result = makeCurlReq($builderApiObj,$deal);
//    print json_encode($result); exit;
// NOTE: UPDATE - only works in case of new applicationid

if (!isset($post['selected_application'])) {
    // get DEAL APPONE subclass properties
    $appOneData = $builderApiObj->getDealAppOneInfo($deal);
    $appOneData = json_decode($appOneData, true);

    // if it exists
    if (isset($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) && intval($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) > 0) {
        // App ID exists, give user a choice to choose
        $result['app_exists'] = $appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID];

        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
//            print json_encode($result);
//            exit;
    } else {
        // NEW APPLICATION - App ID don't exists
        // UPDATE - Deal AppOne properties (request & response)
        $result = makeCurlReq($builderApiObj, $deal);
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
//            print json_encode($result);
//            exit;
    }
} else if ($post['selected_application'] == 'new') {
    // NEW APPLICATION - App ID don't exists
    // UPDATE - Deal AppOne properties (request & response)
    $result = makeCurlReq($builderApiObj, $deal);
    $resJsonArr = array('status' => '1', 'message' => '');
    $resJsonArr['data'] = $result;
    header('Content-Type: application/json');
    print json_encode($resJsonArr);
    exit;
//        print json_encode($result);
//        exit;
} else if ($post['selected_application'] == 'existing') {
    // AppOne existing application
    $appOneData = $builderApiObj->getDealAppOneInfo($deal);
    $appOneData = json_decode($appOneData, true);
    // if it exists
    if (isset($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) && intval($appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID]) > 0) {
        $result['applicationid'] = $appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID];
        $result['redirecturl'] = APPONE_API_URL . '/dealer/dealer/app_redirect.aspx?applicationid=' . $appOneData['data'][DEAL_APPONE_APPID_PROPERTY_ID];
//            print json_encode($result);
//            exit;
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $result;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
    }
}

// hardcoding the values, as per requirement
$result['applicationid'] = '1033872';
$result['redirecturl'] = APPONE_API_URL . '/dealer/dealer/app_redirect.aspx?applicationid=1033872';
$resJsonArr = array('status' => '1', 'message' => '');
$resJsonArr['data'] = $result;
header('Content-Type: application/json');
print json_encode($resJsonArr);
exit;
//    print json_encode($result);
//    exit;
?>