<?php

        error_reporting(E_ALL);
        try {
            $trace                       = true;
            $exceptions                  = false;
            $wsdl                        = 'https://demo.external.appone.net/connect/dms/AppOneConnect.svc?singleWsdl';
            $client                      = new SoapClient($wsdl, array('trace' => $trace, 'exceptions' => $exceptions, 'cache_wsdl' => WSDL_CACHE_NONE));
            $username                    = 'marinemax';
            $password                    = 'Password123';
            $xml_array['username']       = $username;
            $xml_array['password']       = $password;
            $xml_array['SenderDealerID'] = '';
            $xml_array['AppOneDealerID'] = '1000472';
            //$client = new SoapClient($wsdl);
            $result = $client->GetDefaultBackendProductsAndFees($xml_array);
            //echo '<h2>Result</h2><pre>';
            //print_r($result);
            $GetDefaultBackendProductsAndFeesBody = $result->GetDefaultBackendProductsAndFeesResult;
            $respArray                            = $GetDefaultBackendProductsAndFeesBody;

            $result = $respArray;
        } catch (SoapFault $e) {
            $result = $e;
        }

        echo '<pre>';print_r($result); die();

?>