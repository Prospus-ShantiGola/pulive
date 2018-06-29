<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Prsjs
 *
 * @author amitmalakar
 */
class Parse_Class_JS {

    protected $dirPath;
    protected $fileType;
    protected $showLine;
    protected $hideComments;
    protected $showFilename;
    protected $regxPattern;
    protected $hideBlankLines;

    public function __construct($config) {
        $this->dirPath            = $config['dir_path'];
        $this->fileType           = $config['file_type'];
        $this->regxPattern        = $config['regx_pattern'];
        $this->regxVarPattern     = $config['regx_var_pattern'];
        $this->regxCommentPattern = $config['regx_comment_pattern'];
        $this->showLine           = $config['show_line'];
        $this->hideComments       = $config['hide_comments'];
        $this->showFilename       = $config['show_filename'];
        $this->hideBlankLines     = $config['hide_blank_lines'];        
    }

    
    /*
     * Get all array values recursively
     * return @array
     */
    private function arrayValuesRecursive($array) {
        $flat = array();

        foreach ($array as $value) {
           if (is_array($value)) $flat = array_merge($flat, $this->arrayValuesRecursive($value));
           else $flat[] = $value;
        }
        
        return $flat;
    }
    

    /*
     * Recursively find files in directory
     * return @array
     */
    private function filesInDir($dir) {        
        $cdir = scandir($dir);         
        foreach ($cdir as $key => $value) 
        { 
            if (!in_array($value, array(".",".."))) 
            { 
                if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) { 
                    $result[] = $this->filesInDir($dir . DIRECTORY_SEPARATOR . $value);                     
                } else {
                    // list only required file types                    
                    if(pathinfo($value, PATHINFO_EXTENSION) == $this->fileType)
                        $result[] = $dir . DIRECTORY_SEPARATOR . $value; 
                } 
            } 
        } 
        return $this->arrayValuesRecursive($result);        
    }
    
    
    /*
     * Get all the files in directory
     * return @array
     */
    public function getFilesInDir() {
        return $this->filesInDir($this->dirPath);        
    }

    
    /*
     * Find functions in all listed files
     * return @string
     */
    public function findFuncInFiles($files) {        
        $foundFunctions = '';
        $foundFunctionsArr = array();
        foreach ($files as $file) {
            
            // show filename
            if ($this->showFilename)
                $foundFunctions .= "<br />//====={$file}====<br />";

            $handle = fopen($file, "r");
            if ($handle) {
                $matches = array();
                $openBracket = $closeBracket = 0;
                $captureFlag = false;
                $lineCount = 0;
                while (($line = fgets($handle)) !== false) {
                    $lineCount++;
                    // for js file match variable existence                    
                    preg_match($this->regxVarPattern, $line, $matches2);
                    // var found && not inside any function
                    if(count($matches2) && !$captureFlag) {
                        array_push($foundFunctionsArr, $line);
                    }
                    // match pattern
                    preg_match($this->regxPattern, $line, $matches);
                                        
                    if (count($matches)) {
                        $captureFlag = true;
                    }
                    if ($captureFlag) {
                        $openBracket += substr_count($line, '{');
                        $closeBracket += substr_count($line, '}');
                        
                        // hide comments 
                        if($this->hideComments)
                            $line = preg_replace($this->regxCommentPattern, "", $line);
                    
                        // hide blank lines
                        if($this->hideBlankLines && trim($line) == '')
                            continue;
                        
                        // show line number
                        if ($this->showLine)
                            $foundFunctions .= $lineCount . ". " . htmlspecialchars($line);
                        else
                            $foundFunctions .= htmlspecialchars($line);

                        // reset on function end and store in array each functions
                        if ($openBracket != 0 && $openBracket <= $closeBracket) {
                            array_push($foundFunctionsArr, $foundFunctions);
                            $foundFunctions = '';
                            $captureFlag = false;
                            $openBracket = $closeBracket = 0;
                            continue;
                        }
                    }
                }

                fclose($handle);
            } else {
                echo 'error opening the file.';
            }
        }
        return $foundFunctionsArr;
    }

}
