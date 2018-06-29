<?php

    require 'Parser.php';
    
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    $fileType = (isset($_GET['file']) && ($_GET['file']=='js' || $_GET['file']=='php') ) ? $_GET['file'] : 'js';
    $config = array(
        'dir_path'                  => "/var/www/html/PUI/RandD",
        'file_type'                 => $fileType,    // file extensions js, php
        // js patterns
        'regx_js_func_pattern'      => '/(.*function)[\s][\w+](\(?\w.+\))/',
        'regx_js_var_pattern'       => '/(var)[\s][\w]+.*(;)/',
        // php patterns
        'regx_php_class_pattern'    => '/class ([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/',
        'regx_php_func_pattern'     => '/(.*function)[\s][\w+](\(?\w.+\))/',
        'regx_php_var_pattern'      => '/(?:(?:protected)|(?:public)|(?:private)) \$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*).*(;)/',
        // comment pattern // single line
        'regx_comment_pattern'      => '#^\s*//.+$#m',
        'show_line'                 => false,
        'hide_comments'             => false,            // single line comments //, not multi        
        'hide_blank_lines'          => true,
        'trim_code'                 => true,
    );
        
    $parserObj = new Parser($config);
    
    $files = $parserObj->getFilesInDir();
        
    //print_r($files); die();

    $functions = $parserObj->findFuncInFiles($files);
    
    echo '<pre>';
    print_r($functions);
    
/*
    (?!(class)) ([a-zA-Z0-9_]+)
    class[\s\n]+([a-zA-Z0-9_]+)[\s\na-zA-Z0-9_]+\{

    (class)\s+(\w+)(.*)?\{
    /class ([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)
	
*/

