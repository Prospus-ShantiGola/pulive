<?php

/**
 * Created by Amit Malakar.
 * User: amitmalakar
 * Date: 11/30/15
 * Time: 2:43 PM
 */

namespace Administrator\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

class FileParser extends AbstractPlugin
{
    protected $rootPath;
    protected $dirPath;
    protected $fileName;
    protected $fileType;
    protected $showLine;
    protected $hideComments;
    protected $hideBlankLines;
    protected $trimCode;
    protected $regxClassPattern;
    protected $regxFuncPattern;
    protected $regxVarPattern;
    protected $regxCommentPattern;
    protected $regxMultiComStart;
    protected $regxMultiComEnd;
    protected $regxMultiComStartEndPattern;
    protected $regxMultiComEndStartPattern;
    protected $regxParamPattern;
    protected $regxPhpScopePattern;
    protected $regxPhpTitlePattern;
    protected $regxPhpVarPattern;
    protected $regxPhpClassPattern;
    protected $regxPhpFuncPattern;
    protected $regxJsTitlePattern;
    protected $regxJsVarPattern;
    protected $regxJsFuncPattern;
    protected $regxVarValuePattern;
    protected $regxAllFuncnameStringPattern;

    public function __construct()
    {
        //$this->rootPath            = $config['root_path'];
        //$this->fileType            = $config['file_type'];
        $this->showLine       = false;
        $this->hideComments   = true;
        $this->hideBlankLines = true;
        $this->trimCode       = true;
        // regex patterns
        $this->regxParamPattern             = '/[(].*[)]/';
        $this->regxVarValuePattern          = '/.*?=\s*(.*)(?:;)/';
        $this->regxCommentPattern           = '#^\s*//.+$#m';
        $this->regxMultiComStart            = '/[^"\';\w\d]*(\/\*)[^"\']/';
        $this->regxMultiComEnd              = '/(\*\/)/';
        $this->regxMultiComStartEndPattern  = '!/\*.*?\*/!s';
        $this->regxMultiComEndStartPattern  = '!\*/.*?/\*!s';
        $this->regxAllFuncnameStringPattern = '/function[\s\n]+(\S+)[\s\n]*\(/';

        // js patterns
        $this->regxJsFuncPattern  = '/(.*function)[\s]*[\w+](\(?\w.+\))/';
        $this->regxJsVarPattern   = '/(var)[\s][\w]+.*(;)/';
        $this->regxJsTitlePattern = '/(?<=var ).*?[a-zA-Z0-9_]+/';
        // php patterns
        $this->regxPhpClassPattern = '/class ([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/';
        $this->regxPhpFuncPattern  = '/(.*function)[\s]*[\w+](\(?\w.+\))/';
        $this->regxPhpVarPattern   = '/(?:(?:protected)|(?:public)|(?:private)) \$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*).*(;)/';
        $this->regxPhpScopePattern = '/(?:(?:protected)|(?:public)|(?:private))/';
        $this->regxPhpTitlePattern = '/[$][a-zA-Z0-9_]+/';
        // css patterns
        $this->regxCssSelectorPattern = '/.*[{,]/';
        //$this->regxCssIdPattern   = '/^[#].*[{,]/';
        //$this->regxCssClassPattern = '/^[\.].*[{,]/';

    }

    /*
     * Get all array values recursively
     * return @array
     */

    private function arrayValuesRecursive($array) {
        $flat = array();

        foreach ($array as $value) {
            if (is_array($value))
                $flat   = array_merge($flat, $this->arrayValuesRecursive($value));
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
        $cdir   = scandir($dir);
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
        if (count($result))
            return $this->arrayValuesRecursive($result);
        else
            return $result;
    }

    /*
     * Get all the files in directory
     * return @array
     */

    public function getFilesInDir() {
        return $this->filesInDir($this->rootPath);
    }


    /**
     * Return Css declaration property and value
     * @param $line
     * @return array
     */
    private function getDeclarationValue($line) {
        $declaration = explode(":", $line, 2);
        $result = array();
        // PROPERTY & VALUE
        if (count($declaration)) {
            $result['property'] = isset($declaration[0]) ? $declaration[0] : '';
            $result['value']    = isset($declaration[1]) ? rtrim($declaration[1], ';') : '';
        }
        return $result;
    }

    /**
     * Parse Css file
     * @param $file
     * @return array|string
     */
    public function parseCssFile($file) {

        // skip the minified files, filename - min
        $fileName = basename($file);
        $fileRelativePath = str_replace($this->rootPath, "", $file);
        $data             = array();

        $handle    = fopen($file, "r");
        if ($handle) {
            $lineCount = 0;
            $openBracket = $closeBracket = 0;
            $startMultiComment = false;
            $cleanLineStart = $cleanLineEnd = $propertyValueArr = array();
            $arraySelector = $arrayProperty = $arrayValue = array();
            $cssLine = $selector = '';
            $lineCaptureFlag = $cssCaptureFlag = false;
            $selectorCaptureFlag = false;
            $rulesetCount = $propertyCount = 0;
            while (($rawLine = fgets($handle)) !== false) {
                $lineCount++;
                $multiLineFlag = $lineCaptureFlag = false;
                // remove comments
                // clean single line comments
                $line = preg_replace($this->regxCommentPattern, "", $rawLine);

                // clean multi line comments
                /*if(!$startMultiComment) {
                    // check start
                    preg_match($this->regxMultiComStart, $line, $cleanLineStart);
                    preg_match($this->regxMultiComEnd, $line, $cleanLineEnd);
                } else {
                    // check end
                    preg_match($this->regxMultiComEnd, $line, $cleanLineEnd);
                }
                if(isset($cleanLineStart) && count($cleanLineStart)) {
                    $startMultiComment = true;
                }
                if(isset($cleanLineEnd) && count($cleanLineEnd)) {
                    $endMultiComment = true;
                }*/

                if(preg_match($this->regxMultiComStartEndPattern, $line)) {
                    $line = preg_replace($this->regxMultiComStartEndPattern, '', $line);
                    $startMultiComment = false;
                    $multiLineFlag = true;
                    if(strlen(trim($line)))
                        $lineCaptureFlag = true;
                }
                if(preg_match($this->regxMultiComEndStartPattern, $line)) {
                    $line = substr(strstr($line, '*/'), strlen('*/'));
                    $line = substr($line, 0, strpos($line, "/*"));
                    $multiLineFlag = true;
                    if(strlen(trim($line)))
                        $lineCaptureFlag = true;
                }
                if(preg_match($this->regxMultiComStart, $line)) {
                    $line = substr($line, 0, strpos($line, "/*"));
                    $startMultiComment = true;
                    $multiLineFlag = true;
                    if(strlen(trim($line)))
                        $lineCaptureFlag = true;
                }
                if(preg_match($this->regxMultiComEnd, $line) && $startMultiComment) {
                    $line = substr(strstr($line, '*/'), strlen('*/'));
                    $startMultiComment = false;
                    $multiLineFlag = true;
                    if(strlen(trim($line))) {
                        $lineCaptureFlag = true;
                    }
                }

                if(!$multiLineFlag && !$startMultiComment) {
                    $lineCaptureFlag = true;
                }

                // if both false then proceed
                if($lineCaptureFlag && strlen(trim($line))) {

                    // SELECTORs
                    preg_match($this->regxCssSelectorPattern, $line, $matchSelector);

                    if(count($matchSelector)) {
                        $selector .= $matchSelector[0];
                        $selectorCaptureFlag = true;
                        $cssCaptureFlag = true;
                    }

                    if($cssCaptureFlag) {
                        $openBracket += substr_count($line, "{");
                        $closeBracket += substr_count($line, "}");

                        // hide blank lines
                        if ($this->hideBlankLines && trim($line) == '')
                            continue;

                        // time code
                        if ($this->trimCode)
                            $line = trim($line);

                        // store selector
                        if($openBracket == 1 && $selectorCaptureFlag) { // { exists so class started
                            $cleanSelector = substr($selector, 0, strrpos($selector, '{'));
                            $selectorCaptureFlag = false;
                        }

                        // DECLARATIONs
                        /*if ($openBracket > $closeBracket && substr_count($line, "{") == 0) {
                            // PROPERTY & VALUE
                            array_push($propertyValueArr, $this->getDeclarationValue($line));
                        }*/
                        // if declaration on same line
                        if($openBracket >= $closeBracket && !$selectorCaptureFlag) {
                            if(substr_count($line, "{")) {
                                // get code after starting "{"
                                $afterStBracket = substr($line, strpos($line, "{") + 1);
                                if(rtrim($line, "}") != '' && trim($afterStBracket) != '') {
                                    $bwBracket = rtrim($afterStBracket, "}");
                                    foreach(array_filter(explode(";", $bwBracket), 'trim') as $propValue) {
                                        array_push($propertyValueArr, $this->getDeclarationValue($propValue));
                                    }
                                }
                            } else {
                                // if declaration on same line after first line
                                if(rtrim($line, "}") != '') {
                                    $bwBracket = rtrim($line, "}");
                                    foreach(array_filter(explode(";", $bwBracket), 'trim') as $propValue) {
                                        array_push($propertyValueArr, $this->getDeclarationValue($propValue));
                                    }
                                }
                            }
                        }

                        // reset on class end and store in array
                        if ($openBracket != 0 && $openBracket <= $closeBracket) {
                            $selectorCount = 0;
                            $cleanSelector = array_filter(explode(",", $cleanSelector));
                            foreach($cleanSelector as $clnSelector) {
                                $data[$rulesetCount]['selector']['title'][$selectorCount] = trim($clnSelector);
                                $selectorCount++;
                            }
                            foreach($propertyValueArr as $pva) {
                                $data[$rulesetCount]['declaration'][$propertyCount]['property'] = $pva['property'];
                                $data[$rulesetCount]['declaration'][$propertyCount]['value'] = $pva['value'];
                                $propertyCount++;
                            }
                            $selector = '';
                            $rulesetCount++;
                            $propertyCount = $openBracket = $closeBracket = 0;
                            $cssCaptureFlag = $selectorCaptureFlag = false;
                            $propertyValueArr = array();
                        }
                    }

                } // comments cleaned lines
                // reset comment flags
                /*if($startMultiComment && $endMultiComment) {
                    $startMultiComment = $endMultiComment = false;
                    $cleanLineStart = $cleanLineEnd = array();
                }*/
            }

            fclose($handle);
        } else {
            return 'error opening the file.';
        }
        return $data;
    }


    /*
     * Find functions in all listed files
     * return @string
     */

    public function findFuncInFiles($fileArr) {
        //error_reporting(E_ALL);
        //ini_set('display_errors', 1);
        $this->rootPath = $fileArr['root_path'];
        $this->dirPath = $fileArr['dir_path'];
        $this->fileName = $fileArr['file_name'];
        $file = $this->rootPath.DIRECTORY_SEPARATOR.$this->dirPath.DIRECTORY_SEPARATOR.$this->fileName;
        $foundFunctions   = $fileRelativePath = $foundVars = '';
        $resultArray      = array();

        // file extension
        $this->fileType = pathinfo($file, PATHINFO_EXTENSION);
        // regular expression to be used based on filetype
        if ($this->fileType == 'js') {
            $this->regxClassPattern    = '';
            $this->regxFuncPattern     = $this->regxJsFuncPattern;
            $this->regxVarPattern      = $this->regxJsVarPattern;
            $this->regxJsTitlePattern  = $this->regxJsTitlePattern;
        } elseif ($this->fileType == 'php') {
            $this->regxClassPattern    = $this->regxPhpClassPattern;
            $this->regxFuncPattern     = $this->regxPhpFuncPattern;
            $this->regxVarPattern      = $this->regxPhpVarPattern;
            $this->regxPhpScopePattern = $this->regxPhpScopePattern;
            $this->regxPhpTitlePattern = $this->regxPhpTitlePattern;
        }



        // skip the minified files, filename - min
        $fileName = basename($file);
        $fileRelativePath = str_replace($this->rootPath, "", $file);
        if($this->fileType == 'js')
            $fileType = 'JavaScript';
        elseif($this->fileType == 'css')
            $fileType = 'CSS';
        else
            $fileType = 'PHP';
        $data = array(
            'location'    => array(
                'root_path' => $this->rootPath,
                'dir_path'  => dirname($file),
                'filename'  => $fileName,
                'url'       => $file,
            ),
            'type'        => $fileType,
            'description' => '',
            'classes'     => array(),
            'ruleset'     => array(),
        );
        if ($this->fileType == 'css') {
            $data['ruleset'] =  $this->parseCssFile($file);
        } else {
            $className = 'no';
            $handle    = fopen($file, "r");
            if ($handle) {
                $matches          = array();
                $openBracket = $closeBracket = 0;
                $funcOpenBracket  = $funcCloseBracket = 0;
                $classOpenBracket = $classCloseBracket = 0;
                $funcCaptureFlag  = $classCaptureFlag = false;
                $lineCount        = $classCount = $functionCount = $globalCount = 0;
                $functionNameOnly = $functionScope = '';
                $startMultiComment = false;
                while (($line = fgets($handle)) !== false) {
                    $lineCount++;
                    $multiLineFlag = $lineCaptureFlag = false;
                    $openBracket += substr_count($line, '{');
                    $closeBracket += substr_count($line, '}');
                    // remove comments
                    // clean single line comments
                    $line = preg_replace($this->regxCommentPattern, "", $line);
                    if(substr($line, 0, strpos($line, "//")))
                        $line = substr($line, 0, strpos($line, "//"));

                    // clean multi line comments
                    if(preg_match($this->regxMultiComStartEndPattern, $line)) {
                        $line = preg_replace($this->regxMultiComStartEndPattern, '', $line);
                        $startMultiComment = false;
                        $multiLineFlag = true;
                        if(strlen(trim($line)))
                            $lineCaptureFlag = true;
                    }
                    if(preg_match($this->regxMultiComEndStartPattern, $line)) {
                        $line = substr(strstr($line, '*/'), strlen('*/'));
                        $line = substr($line, 0, strpos($line, "/*"));
                        $multiLineFlag = true;
                        if(strlen(trim($line)))
                            $lineCaptureFlag = true;
                    }
                    if(preg_match($this->regxMultiComStart, $line)) {
                        $line = substr($line, 0, strpos($line, "/*"));
                        $startMultiComment = true;
                        $multiLineFlag = true;
                        if(strlen(trim($line)))
                            $lineCaptureFlag = true;
                    }
                    if(preg_match($this->regxMultiComEnd, $line) && $startMultiComment) {
                        $line = substr(strstr($line, '*/'), strlen('*/'));
                        $startMultiComment = false;
                        $multiLineFlag = true;
                        if(strlen(trim($line))) {
                            $lineCaptureFlag = true;
                        }
                    }

                    if(!$multiLineFlag && !$startMultiComment) {
                        $lineCaptureFlag = true;
                    }

                    // if both false then proceed
                    if($lineCaptureFlag && strlen(trim($line))) {
                        // CLASS NAME >>>
                        if ($this->fileType == 'php') {
                            // clean class names in comments
                            $classLine = preg_replace($this->regxCommentPattern, "", $line);
                            preg_match($this->regxClassPattern, $classLine, $matches3);
                            if (count($matches3)) {
                                $className = $matches3[1];
                                $data['classes'][$classCount]['title'] = $matches3[1];
                                $classCaptureFlag = true;
                            }
                        }
                        if ($classCaptureFlag) {
                            $classOpenBracket += substr_count($line, '{');
                            $classCloseBracket += substr_count($line, '}');
                        }
                        // <<< CLASS NAME

                        // FUNCTIONS & ARGUMENTS >>>
                        preg_match($this->regxFuncPattern, trim($line), $matches);

                        if (count($matches) && !$funcCaptureFlag) {
                            $funcCaptureFlag = true;
                            // remove function string
                            $functionNameOnly = str_replace("function ", "", htmlspecialchars($matches[0]));
                            // parse params
                            $arguments = $this->parseArguments($functionNameOnly);
                            // remove (), (params) and trim
                            $functionNameOnly = trim(preg_replace($this->regxParamPattern, "", $functionNameOnly));
                            // SPLIT using space
                            // get function scope
                            if(isset($this->regxPhpScopePattern)) {
                                preg_match($this->regxPhpScopePattern, $functionNameOnly, $matches4);
                                $functionScope = $matches4[0];
                                $functionNameOnly = trim(str_replace($functionScope, '', $functionNameOnly));
                            }
                        }

                        if ($funcCaptureFlag) {
                            $funcOpenBracket += substr_count($line, '{');
                            $funcCloseBracket += substr_count($line, '}');

                            // hide comments
                            if ($this->hideComments)
                                $line = preg_replace($this->regxCommentPattern, "", $line);

                            // hide blank lines
                            if ($this->hideBlankLines && trim($line) == '')
                                continue;

                            // time code
                            if ($this->trimCode)
                                $line = trim($line);

                            if($funcOpenBracket == 1) {
                                // anything after start bracket
                                $part = explode("{", $line);
                                $line = isset($part[1]) ? $part[1] : $line;
                            }
                            if($funcOpenBracket == $funcCloseBracket) {
                                // anything before end bracket
                                $part = explode("}", $line);
                                $line = isset($part[0]) ? $part[0] : $line;
                            }

                            // show line number
                            if ($this->showLine)
                                $foundFunctions .= $lineCount . ". " . htmlspecialchars($line);
                            else
                                $foundFunctions .= htmlspecialchars($line);

                            // reset on function end and store in array each functions
                            if ($funcOpenBracket != 0 && $funcOpenBracket <= $funcCloseBracket) {
                                if ($this->fileType == 'php') {
                                    $data['classes'][$classCount]['methods'][$functionCount] = array('title' => $functionNameOnly, 'value' => $foundFunctions, 'scope' => $functionScope);
                                    $data['classes'][$classCount]['methods'][$functionCount]['arguments'] = $arguments;
                                } elseif($this->fileType == 'js') {
                                    $data['methods'][$functionCount] = array('title' => $functionNameOnly, 'value' => $foundFunctions, 'scope' => $functionScope);
                                    $data['methods'][$functionCount]['arguments'] = $arguments;
                                }
                                $foundFunctions = $functionNameOnly = $functionScope = '';
                                $funcCaptureFlag = false;
                                $funcOpenBracket = $funcCloseBracket = 0;
                                $functionCount++;
                                continue;
                            }
                        }
                        // <<< FUNCTIONS

                        // reset on class end
                        if ($classCaptureFlag && $classOpenBracket != 0 && ($classOpenBracket <= $classCloseBracket)) {
                            $classOpenBracket = $classCloseBracket = 0;
                            $globalCount      = $functionCount = 0;
                            $classCaptureFlag = false;
                            $classCount++;
                        }

                        // GLOBAL VARIABLES >>>
                        preg_match($this->regxVarPattern, $line, $matches2);

                        // var found && not inside any function
                        if (count($matches2) && !$funcCaptureFlag) {
                            if($this->fileType == 'js'  && $openBracket != $closeBracket) {
                                continue;
                            }
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

                            // $resultArray[$this->rootPath][$fileRelativePath]['class_name']['globals'][$globalCount] = $foundVars;
                            // var title value scope
                            $parsedVar = $this->parseVariable($foundVars);
                            if($this->fileType == 'php') {
                                $data['classes'][$classCount]['variables'][$globalCount] = $parsedVar;
                            } elseif($this->fileType == 'js') {
                                $data['variables'][$globalCount] = $parsedVar;
                            }
                            $globalCount++;
                            $foundVars = '';
                            continue;
                        }
                        // <<< GLOBAL VARIABLES
                    }// comments cleaned lines
                    // reset comment flags
                    /*if($startMultiComment && $endMultiComment) {
                        $startMultiComment = $endMultiComment = false;
                        $cleanLineStart = $cleanLineEnd = array();
                    }*/
                }

                //array_push($resultArray, $data);
                fclose($handle);
            } else {
                return 'error opening the file.';
            }
        }
        return $data;//$resultArray;
    }

    private function parseVariable($varLine) {

        if($this->fileType == 'php') {
            preg_match($this->regxPhpTitlePattern, $varLine, $matches1);
            preg_match($this->regxPhpScopePattern, $varLine, $matches3);
        } elseif($this->fileType == 'js') {
            preg_match($this->regxJsTitlePattern, $varLine, $matches1);
            $matches3[0] = 'Global';
        }
        preg_match($this->regxVarValuePattern, $varLine, $matches2);
        if(isset($matches2[1])) {
            $value = stripslashes($matches2[1]);
        } else {
            $value = '';
        }
        $parsedVar = array(
            'title' => isset($matches1[0]) ? $matches1[0] : '',
            'value' => $value,
            'scope' => ucfirst(isset($matches3[0]) ? $matches3[0] : ''),
        );

        return $parsedVar;
    }

    private function parseArguments($argLine) {
        $result = array();
        preg_match($this->regxParamPattern, $argLine, $matches);
        if(isset($matches[0])) {
            // removed paranthesis
            $params = rtrim(ltrim($matches[0], '('), ')');
            // check if muliple arguments comma separated
            $paramsArr = explode(",", $params);

            if(count($paramsArr) && !empty($paramsArr[0])) {
                foreach($paramsArr as $param) {
                    $param = trim($param);
                    $title = explode("=", $param);
                    $dataType = 'string';
                    if(isset($title[1])) {
                        if(strpos($title[1],'array(') !== false)
                            $title[1] = $title[1].')';
                        $dataType = $this->checkDataType(trim($title[1]));
                    } else {
                        $title[1] = '';
                    }
                    $data = array(
                        'title'     => $title[0],
                        'value'     => trim($title[1]),
                        'data_type' => $dataType
                    );

                    array_push($result, $data);
                }
            }
        }

        return $result;
    }

    private function checkDataType($data) {
        if(substr_count($data, "array(")) {
            return 'array';
        } else {
            return gettype($this->getCorrectVariable($data));
        }
    }

    private function getCorrectVariable($string){

        // 1. Remove unused spaces
        // 2. Check if it is empty, if yes, return blank string
        // 3. Check if it is numeric
        // 4. If numeric, this may be a integer or double, must compare this values.
        // 5. If string, try parse to bool.
        // 6. If not, this is string.

        $string=trim($string);
        if(empty($string)) return "";
        if(!preg_match("/[^0-9.]+/",$string)){
            if(preg_match("/[.]+/",$string)){
                return (double)$string;
            }else{
                return (int)$string;
            }
        }
        if($string=="true" || $string=="TRUE") return true;
        if($string=="false" || $string=="FALSE") return false;
        return (string)$string;
    }

    /*
     * Extract all function names from string
     * Multiple functions in same string
     * return @array
     */
    private function getAllFuncNameFromString($string) {
        // $string = 'function abc($a=10) { // your code here } function two() { } function three(abc=10){}';
        preg_match_all($this->regxAllFuncnameStringPattern, $string, $matches);
        return $matches[1];
    }
}