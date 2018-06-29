<?php

error_reporting(0);

header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, X-Mashape-Authorization");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin, X-Session-ID");
//header('Access-Control-Allow-Credentials: true');
//header('Access-Control-Max-Age: 86400');    // cache for 1 day
//header("Access-Control-Allow-Methods: GET, POST, OPTIONS");   


if ($_SERVER['HTTP_HOST'] == 'sta.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'sta-lb-837517909.us-east-1.elb.amazonaws.com') {

    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9001/course-dialogue-server.php");
} else if ($_SERVER['HTTP_HOST'] == 'dev.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'dev-lb-830601176.us-east-1.elb.amazonaws.com') {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/testing_environment/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9003/course-dialogue-server.php");
} else if ($_SERVER['HTTP_HOST'] == 'qa.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'qa-lb-526760236.us-east-1.elb.amazonaws.com') {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/testing_environment/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9003/course-dialogue-server.php");
} else {
    define('BASE_URL_API', 'http://' . $_SERVER['HTTP_HOST'] . '/PUI/');
    define('ABSO_URL_API', $_SERVER['DOCUMENT_ROOT'] . '/PUI/');
    define('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/PUI/pui/');
    define('SOCKET_URL', "ws://" . $_SERVER['HTTP_HOST'] . ":9001/PUI/course-dialogue-server.php");
}


/* if($_GET['sessId'] != "")
  define('SESSID', $_GET['sessId']);

  if($_POST['sessId'] != "")
  define('SESSID', $_POST['sessId']);

  class FileSessionHandlerCourse
  {
  private $savePath;
  private $id;

  function open($savePath, $sessionName)
  {
  $this->id = SESSID;


  $savePath = ABSO_URL_API."temp_session/";

  $this->savePath = $savePath;
  if (!is_dir($this->savePath)) {
  mkdir($this->savePath, 0744);
  }

  return true;
  }

  function close()
  {
  return true;
  }

  function read($id)
  {
  return (string)@file_get_contents("$this->savePath/sess_".SESSID);
  }

  function write($id, $data)
  {


  $variable= file_put_contents("$this->savePath/sess_".SESSID, $data) === false ? false : true;

  return $variable;

  }

  function destroy($id)
  {
  $file = "$this->savePath/sess_".SESSID;
  if (file_exists($file)) {
  unlink($file);
  }

  return true;
  }

  function gc($maxlifetime)
  {
  foreach (glob("$this->savePath/sess_*") as $file) {
  if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
  unlink($file);
  }
  }

  return true;
  }
  }


  $handler = new FileSessionHandlerCourse();
  session_set_save_handler(
  array($handler, 'open'),
  array($handler, 'close'),
  array($handler, 'read'),
  array($handler, 'write'),
  array($handler, 'destroy'),
  array($handler, 'gc')
  );

  // the following prevents unexpected effects when using objects as save handlers
  register_shutdown_function('session_write_close');

  session_start(); */

//include "builderApi.php";
$version = strtotime(date('Ymdhis'));
?>
