<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Parser
 *
 * @author amitmalakar
 */
class Parser {

    protected $dirPath;
    protected $fileType;
    protected $regxFuncPattern;
    protected $regxVarPattern;
    protected $regxCommentPattern;
    protected $showLine;
    protected $hideComments;
    protected $hideBlankLines;
    protected $trimCode;

    public function __construct($config) {        
        $this->dirPath              = $config['dir_path'];
        $this->fileType             = $config['file_type'];        
        $this->showLine             = $config['show_line'];
        $this->hideComments         = $config['hide_comments'];
        $this->hideBlankLines       = $config['hide_blank_lines'];
        $this->trimCode             = $config['trim_code'];

        // regex patterns
        $this->regxCommentPattern   = $config['regx_comment_pattern'];
        if ($this->fileType == 'js') {
            $this->regxClassPattern     = '';
            $this->regxFuncPattern      = $config['regx_js_func_pattern'];
            $this->regxVarPattern       = $config['regx_js_var_pattern'];
        } elseif ($this->fileType == 'php') {
            $this->regxClassPattern     = $config['regx_php_class_pattern'];
            $this->regxFuncPattern      = $config['regx_php_func_pattern'];
            $this->regxVarPattern       = $config['regx_php_var_pattern'];
        }        
    }

    /*
     * Get all array values recursively
     * return @array
     */

    private function arrayValuesRecursive($array) {
        $flat = array();

        foreach ($array as $value) {
            if (is_array($value))
                $flat = array_merge($flat, $this->arrayValuesRecursive($value));
            else
                $flat[] = $value;
        }

        return $flat;
    }

    /*
     * Recursively find files in directory
     * return @array
     */

    private function filesInDir($dir) {
        $cdir = scandir($dir);
        $result = array();
        foreach ($cdir as $key => $value) {
            if (!in_array($value, array(".", ".."))) {
                if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
                    $result[] = $this->filesInDir($dir . DIRECTORY_SEPARATOR . $value);
                } else {
                    // list only required file types                    
                    if (pathinfo($value, PATHINFO_EXTENSION) == $this->fileType)
                        $result[] = $dir . DIRECTORY_SEPARATOR . $value;
                }
            }
        }
        if(count($result))
            return $this->arrayValuesRecursive($result);
        else 
            return $result;
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
        $foundFunctions = $fileRelativePath = $foundVars = '';
        $resultArray = array();

        foreach ($files as $file) {            
            $fileRelativePath = str_replace($this->dirPath, "", $file);
            $className = 'no';
            $handle = fopen($file, "r");
            if ($handle) {
                $matches = array();
                $openBracket = $closeBracket = 0;
                $captureFlag = false;                
                $lineCount = $functionCount = $globalCount = 0;
                $functionNameOnly = '';
                while (($line = fgets($handle)) !== false) {
                    $lineCount++;                                                   
                    
                    // FUNCTIONS >>>
                        preg_match($this->regxFuncPattern, $line, $matches);

                        if (count($matches) && !$captureFlag) {
                            $captureFlag = true;
                            // remove function string
                            $functionNameOnly = str_replace("function ", "", htmlspecialchars($matches[0]));
                            // remove (), (params) and trim
                            $functionNameOnly = trim(preg_replace("/[(].*[)]/", "", $functionNameOnly));
                        }

                        if ($captureFlag) {
                            $openBracket += substr_count($line, '{');
                            $closeBracket += substr_count($line, '}');

                            // hide comments 
                            if ($this->hideComments)
                                $line = preg_replace($this->regxCommentPattern, "", $line);

                            // hide blank lines
                            if ($this->hideBlankLines && trim($line) == '')
                                continue;

                            // time code
                            if ($this->trimCode) 
                                $line = trim($line);

                            // show line number
                            if ($this->showLine)
                                $foundFunctions .= $lineCount . ". " . htmlspecialchars($line);
                            else
                                $foundFunctions .= htmlspecialchars($line);

                            // reset on function end and store in array each functions
                            if ($openBracket != 0 && $openBracket <= $closeBracket) {
                                $resultArray[$this->dirPath][$fileRelativePath]['class_name']['functions'][$functionCount][$functionNameOnly][0] = $foundFunctions; 
                                //$resultArray[$this->dirPath][$fileRelativePath]['class_name']['functions'][$functionCount][$functionNameOnly] = $foundFunctions;
                                $foundFunctions = $functionNameOnly = '';
                                $captureFlag = false;
                                $openBracket = $closeBracket = 0;
                                $functionCount++;
                                continue;
                            }
                        }
                    // <<< FUNCTIONS
                        
                    // GLOBAL VARIABLES >>>
                        preg_match($this->regxVarPattern, $line, $matches2);

                        // var found && not inside any function
                        if (count($matches2) && !$captureFlag) {                        

                            // hide comments 
                            if ($this->hideComments)
                                $line = preg_replace($this->regxCommentPattern, "", $line);

                            // hide blank lines
                            if ($this->hideBlankLines && trim($line) == '')
                                continue;

                            // time code
                            if ($this->trimCode) 
                                $line = trim($line);

                            // show line number
                            if ($this->showLine)
                                $foundVars .= $lineCount . ". " . htmlspecialchars($line);
                            else
                                $foundVars .= htmlspecialchars($line);
                            
                            $resultArray[$this->dirPath][$fileRelativePath]['class_name']['globals'][$globalCount] = $foundVars;
                            $globalCount++;
                            $foundVars = '';
                            continue;
                        }
                    // <<< GLOBAL VARIABLES
                    
                    // CLASS NAME >>>
                        if($this->fileType == 'php') {
                            preg_match($this->regxClassPattern, $line, $matches3);
                            if(count($matches3) && $className == 'no') {
                                $className = $matches3[1];
                            }                            
                        }
                    // <<< CLASS NAME
                }

                // to move class up, as the top key in array                
                if ($this->fileType == 'php' && isset($resultArray[$this->dirPath][$fileRelativePath]['class_name'])) {                    
                    $resultArray[$this->dirPath][$fileRelativePath]['class_name'] = array_merge(array('class' => $className), $resultArray[$this->dirPath][$fileRelativePath]['class_name']);
                } elseif ($this->fileType == 'js' && isset($resultArray[$this->dirPath][$fileRelativePath]['class_name'])) {
                    $resultArray[$this->dirPath][$fileRelativePath]['class_name'] = array_merge(array('class' => $className), $resultArray[$this->dirPath][$fileRelativePath]['class_name']);   
                }
                fclose($handle);
            } else {
                return 'error opening the file.';
            }
        }
        return $resultArray;
    }

}
