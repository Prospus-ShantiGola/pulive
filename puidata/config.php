<?php

error_reporting(0);
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, X-Mashape-Authorization");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin, X-Session-ID");
date_default_timezone_set("Asia/Calcutta");
//$uploadFile = dirname(__FILE__).'/temp_session/demo.txt';
//header('Access-Control-Allow-Credentials: true');
//header('Access-Control-Max-Age: 86400');    // cache for 1 day
//header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once 'aws/aws-autoloader.php';
if ($_SERVER['HTTP_HOST'] == 'sta.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'sta-lb-837517909.us-east-1.elb.amazonaws.com') {
    DEFINE('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/puidata/');
    DEFINE('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/puidata/');
    DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    DEFINE('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9000/puidata/server.php");
    DEFINE('AWS_BUCKET', 'pustacdn');
    DEFINE('AWS_CDN_URL', 'http://dhxcyyu6slkhq.cloudfront.net');
} else if ($_SERVER['HTTP_HOST'] == 'qa.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'qatest.pu.prospus.com') {
    DEFINE('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/puidata/');
    DEFINE('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/puidata/');
    DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    DEFINE('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9002/puidata/server.php");
    DEFINE('AWS_BUCKET', 'puqacdn');
    DEFINE('AWS_CDN_URL', 'http://d2p1qmy4uhnjr3.cloudfront.net');
} else if ($_SERVER['HTTP_HOST'] == 'dev.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'www.prospus.com') {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/puidata/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/puidata/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9002/puidata/server.php");
    DEFINE('AWS_BUCKET', 'pudevbucket');
    DEFINE('AWS_CDN_URL', 'http://d32hf4gnye7i2l.cloudfront.net');
} else if($_SERVER['HTTP_HOST'] == "localhost") {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/pu/puidata/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/pu/puidata/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pu/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9000/pu/puidata/server.php");
    DEFINE('AWS_BUCKET', 'localdevbucket');
    DEFINE('AWS_CDN_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pu');
} else {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/puidata/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/puidata/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9000/puidata/server.php");
    DEFINE('AWS_BUCKET', 'puprodcdn');
    DEFINE('AWS_CDN_URL', 'http://d14kbo42fexcqw.cloudfront.net');
}




DEFINE('PREFIX_CONFIG', 'local_');

if ($_GET['sessId'] != "")
    DEFINE('SESSID', $_GET['sessId']);

if ($_POST['sessId'] != "")
    DEFINE('SESSID', $_POST['sessId']);
include_once "S3/AwsS3Core.php";
$sdkApi= new AwsS3Core();
class FileSessionHandler {

    private $savePath;
    private $id;
    private $sdk;
   
    function __construct() {
         $this->sdk = new AwsS3Core();
    }
    function open($savePath, $sessionName) {
        $this->id = SESSID;
//        $savePath = ABSO_URL_API . "temp_session/";
//
//        $this->savePath = $savePath;
//        if (!is_dir($this->savePath)) {
//            mkdir($this->savePath, 0744);
//        }

        return true;
    }

    function close() {
        return true;
    }

    function read($id) {
        //// Use the us-west-2 region and latest version of each client.
        
        // var_dump($this->sdk);
        
         
         $result =  $this->sdk->isObjectExist("temp_session/sess_" . SESSID);
         $handle="";
        if ($result) {
            $handle = $this->sdk->getFileData('temp_session/sess_'.SESSID);
        }
        return $handle;
        //return (string) @file_get_contents("$this->savePath/sess_" . SESSID);
    }

    function write($data) {
        if (trim($data) != "") {
             
        $this->sdk->setFileData('temp_session/sess_'.SESSID,$data,"");
        // $variable = file_put_contents("$this->savePath/sess_" . SESSID, $data) === false ? false : true;
        }
        return $data;
    }

    function destroy($id) {
        //// Use the us-west-2 region and latest version of each client.
        $this->sdk->deleteFileData("temp_session/sess_" . SESSID);
        return true;
    }

    function gc($maxlifetime) {
        foreach (glob("$this->savePath/sess_*") as $file) {
            if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
                unlink($file);
            }
        }

        return true;
    }

}

$handler = new FileSessionHandler();
/* NOT USING $_SESSION, just AWS S3 bucket files
session_set_save_handler(
        array($handler, 'open'), array($handler, 'close'), array($handler, 'read'), array($handler, 'write'), array($handler, 'destroy'), array($handler, 'gc')
);
*/

// the following prevents unexpected effects when using objects as save handlers
register_shutdown_function('session_write_close');

session_start();
include "builderApi.php";
$version = strtotime(date('Ymdhis'));
/* * ************** RESET PASSWORD GLOBAL VARIABLE*********************************************** */
// ADDED BY- GAURAV DUTT PANCHAL
// DATE- 30 NOV 2016
DEFINE('PASSWORD_PROPERTY_ID', 2933);
DEFINE('FIRST_NAME_PROPERTY_ID', 2921);
DEFINE('LAST_NAME_PROPERTY_ID', 2922);
DEFINE('EMAIL_PROPERTY_ID', 2932);
DEFINE('EMAIL_HTML_TEMPLATE_CLASS_ID', 850);
DEFINE('EMAIL_HTML_TEMPLATE_PROPERTY_ID', 8432);
DEFINE('EMAIL_HTML_TEMPLATE_DOMAIN_PROPERTY_ID', 8431);
DEFINE('EMAIL_HTML_DOMAIN', 'www.investible.com');
DEFINE('PASSWORD_REDIRECT_URL', 'http://166.62.17.201/investibleTV_dev/index.php');
?>
