<?php

/**
 * Author: Gaurav Dutt Panchal
 * Date: 24 NOV 2016
 * WEB SERVICES
 */
class WebServicesBuilderApi {

    private $web_api_url = BUILDER_API_URL;

    public function callWebApi($api, $postvars) {
        $url = $this->web_api_url . $api;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
        curl_setopt($ch, CURLOPT_USERPWD, "marc:jf53RjhB");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);

        $response = curl_exec($ch);

        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($http_status != 200) {
            $response = "Error $http_status";
        }

        curl_close($ch);

        return $response;
    }

    public function getWebServiceClassData() {
        $options = http_build_query($_REQUEST);
        return $this->callWebApi('getWebServiceClassData', $options);
    }
    
    /*public function getWebServiceClassPropertyData() {
        $options = http_build_query($_REQUEST);
        return $this->callWebApi('getWebServiceClassPropertyData', $options);
    }*/

    public function getClassPropertyStrVal() {
        $options = http_build_query($_REQUEST);
        return $this->callWebApi('getClassPropertyStrVal', $options);
    }
    
    public function getUserDeals($post) {
        $options = http_build_query($post);
        return $this->callWebApi('getUserDeals', $options);
    }
    
    public function getUserOperations($post) {
        $options = http_build_query($post);
        return $this->callWebApi('getUserOperations', $options);
    }
    public function fetchCourseApi($post) {
        $options = http_build_query($post);
        return $this->callWebApi('fetchCourseApi', $options);
    }
    public function fetchCourseDialogueApi($post) {
        $options = http_build_query($post);
        return $this->callWebApi('fetchCourseDialogueApi', $options);
    }
    

}

?>