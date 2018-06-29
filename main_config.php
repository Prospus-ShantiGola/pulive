<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//error_reporting(E_ERROR | E_PARSE);
if (!isset($_SERVER['REDIRECT_BASE']) && empty($_SERVER['REDIRECT_BASE'])) {
    $slashes = '/';
} else {
    $slashes = $_SERVER['REDIRECT_BASE'];
}

// ELB URL's are not in use right now, so no PROD ELB URL check is there
if (strpos($_SERVER['REQUEST_URI'], '/dev/') !== false && $_SERVER['HTTP_HOST'] == "www.prospus.com") {
    include_once 'config_dev.php';
} elseif ((strpos($_SERVER['REQUEST_URI'], '/qa/') !== false || strpos($_SERVER['REQUEST_URI'], '/qatest.pu/') !== false) && $_SERVER['HTTP_HOST'] == "www.prospus.com") {
    include_once 'config_qa.php';
} elseif (strpos($_SERVER['REQUEST_URI'], '/sta/') !== false && $_SERVER['HTTP_HOST'] == "www.prospus.com") {
    include_once 'config_sta.php';
} elseif (strpos($_SERVER['REQUEST_URI'], '/prod.pu/') !== false && $_SERVER['HTTP_HOST'] == "www.prospus.com") {
    include_once 'config_prod.php';
} else {
    include_once 'config_loc.php';
}
