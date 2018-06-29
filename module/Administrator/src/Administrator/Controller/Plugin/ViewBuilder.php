<?php

/**
 * Created by Amit Malakar.
 * User: amitmalakar
 * Date: 05/30/16
 * Time: 4:03 PM
 */

namespace Administrator\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Administrator\Controller\Plugin\AwsS3;
use Zend\Db\Sql\Sql;

class ViewBuilder extends AbstractPlugin {
    /*
      <FORM_ID></FORM_ID>
      -   for placing unique form_id in ID & NAME
      <AUTO_CSS></AUTO_CSS>
      -   for replacing it with auto css class
      <CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>
      -   for placing form field labels
      <CLASS_PROPERTY_USER_INPUT placeholder="false" class="form-control"></CLASS_PROPERTY_USER_INPUT>
      -   for placing form fields
      <SUBMIT_FUNCTION></SUBMIT_FUNCTION>
      -   for placing unique subit function
      SID_<id>
      -   for replacing it with css class
     */

    protected $classesTable;

    public function setModal($classTable) {
        $this->classesTable = $classTable;
    }

    /*
     * Get HTML Class structure with properties
     * @return array
     */

    public function getHtmlClassStructure($node_y_id) {
        $htmlStruc = $this->classesTable->getClassStructurePrint($node_y_id); //getPropertiesCourse

        return $htmlStruc;
    }

    /*
     * Get CSS instance values
     * @return array
     */
    /* public function getCssInstances($classesTable,$node_class_id,$node_ins_id)
      {
      $cssStruc = $classesTable->getThemeCssCaptionValue($node_class_id,$node_ins_id); //getPropertiesCourse
      return $cssStruc;
      } */

    /*
     * Get NodeZ instances
     * @return array
     */

    public function getnodeZInstances($node_class_id) {
        $nodeZStruc = $this->classesTable->getInstanceClassStructureNodeZ($node_class_id); //getPropertiesCourse
        return $nodeZStruc;
    }

    /*
     * Combine HTML, CSS & Layout
     * @param data
     * @return string
     */

    public function mergeHtmlCssLayout($data) {

        if ($data['html'] == 'na') {
            $resultHtml = $data['layout'];
        } else {

            $htmlNodeZ = current($data['nodeZ'][0]['property'])['child'];

          

            $resultHtmlArr = $this->getHtmlAndNodeZ($data['html'], $htmlNodeZ, array());
            
            // echo "-----------------------------------------------------";
            //  print_r($data['subclasses']);
            //  die();
            /*  $generatedHtml= $this->olLiTree($data['html']);
              echo $generatedHtml;
              die();
              $resultHtml = $this->generateHtmlAndNodeZ($data['html'], $htmlNodeZ, array()); */

            if (strpos($data['layout'], '<!-- LOOP STARTS -->') !== false) {
                // find the looping code inside layout
                $loopCode = $this->getStringBetween($data['layout'], '<!-- LOOP STARTS -->', '<!-- LOOP ENDS -->');

                // check placeholder and class
                preg_match('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $loopCode, $match);
                $placeholder = false;
                $class = '';
                if (isset($match[0])) {
                    $xml = simplexml_load_string($match[0]);
                    foreach ($xml[0]->attributes() as $a => $b) {
                        if ($a == 'placeholder') {
                            $placeholder = $b;
                        } else if ($a == 'class') {
                            $class = $b;
                        }
                    }
                }
                // get subclass array
                $resultSCHtmlArr = $this->getSubClassHtmlAndNodeZNested($data['subclasses'], array());
                // $generatedHtml= $this->makeList($data['html']);
                // default input type
                //shanti code starts here.
                $tempSection = '';
                $tempArr = array();
                foreach ($resultHtmlArr as $key => $value) {
                    if ($tempSection != $value['section']) {
                        $tempSection = $value['section'];
                        $tempArr[$key] = $value['section'];
                    }
                }
            
                //shanti code ends here.
                foreach ($tempArr as $tempKey => $tempVal) {
                    $combineCode = "";
                    foreach ($resultHtmlArr as $key => $value) {
                        //echo $id= array_search($value['section'], $value);
                        //echo "<br>".$tempSection;
                        // print_r($value);
                        //$ncpid        = $key; //$value['node_class_property_id'];
                        //$nid     = $value['node_id'];
                        // 'Input','Text Area','Radio','Checkbox','Dropdown','File','Calendar','Remote Server'

                        if ($value['section'] == $tempVal) {
                            //To set the input fields in the same group.
                            $caption = $value['caption'];
                            $value['placeholder'] = $placeholder;
                            $value['class'] = $class;
                            $input = $this->getFormElementsArray($value, $class, $caption);
                            // echo $caption.": ".$input."</br>";
                            // add label
                            $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $loopCode);
                            $input = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $input);


                            /* // add css style to input
                              $inputWithCss = '';
                              switch ($inputData['inputType']) {
                              case 'input':           $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Input']) . '" ';           break;
                              case 'text area':       $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Text Area']) . '" ';       break;
                              case 'radio':           $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Radio']) . '" ';           break;
                              case 'checkbox':        $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Checkbox']) . '" ';        break;
                              case 'drop down':       $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Dropdown']) . '" ';        break;
                              case 'file':            $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['File']) . '" ';            break;
                              case 'calendar':        $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Calendar']) . '" ';        break;
                              case 'Remote Server':   $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Remote Server']) . '" ';   break;
                              default:                $cssData = ' style="' . str_replace(array("\n", "\r"), '', $data['css']['Input']) . '" ';           break;
                              }
                              $pos = strpos($input, ' ', strpos($input, ' ') + 1);
                              $inputWithCss .= substr_replace($input, $cssData, $pos, 0); */

                            // add input type, combined html for class
                            $combineCode .= preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
                        }

                        //$inputWithCss, $tempHtml);
                    }
                    $section_name = explode("_", $tempVal);                    // $tempVal holding the <randomstring>_<section>
                    $combinedClassHtml .= '<a class="list-title-heading class-accordian"   >
                                                <i class="fa fa-angle-down"></i>' . $section_name[1] . '
                                           </a>
                                           <div class="collapse in" >
                                             <div class="list-detail-section">' . $combineCode . '</div>
                                           </div>';
                }

//                echo "<pre>";
//                 print_r($data['html']);
                //shanti implementation for complete set of subclass generation with html code.   
                $combinedClassHtml = $this->generateMainClsHtml($data['html'], $htmlNodeZ, $loopCode, $placeholder, $class);
//                 echo "<pre>";
//                 print_r($combinedClassHtml );
//                 die();
                //$resultSCHtmlArrString = $this->generateMainClsHtml($resultSCHtmlArr, array());
                // node_class_id hidden field
                $nidHidden = '<input type="hidden" id="node_class_id" name="node_class_id" value="' . $data['node_class_id'] . '" /> ';

                // combined html for sub class
                if (count($resultSCHtmlArr)) {
                    $clsLevelCount = 0;
                    $combinedSubClassHtml = $this->generateSubClsHtml($data['subclasses'], $htmlNodeZ, $loopCode, $placeholder, $class, '_' . $data['node_class_id'], $clsLevelCount);
                    $combinedSubClassHtml = preg_replace('/\$(\d)/', '\\\$$1', $combinedSubClassHtml);
                }

                $combinedClassHtml = preg_replace('/\$(\d)/', '\\\$$1', $combinedClassHtml);
                if ($this->isValidFormTagAvailable($combinedClassHtml)) {
                    // replace html b/w loop code tags
                    $allLayoutHtml = '<div class="cls-wrapper cls-tree form-class-section" data-id="'.$data['node_class_id'].'"  id="cls_' . $data['node_class_id'] . '"><div class="collapse-wrapper"><div class="list-detail-section"> ' . $nidHidden . $combinedClassHtml . $combinedSubClassHtml . '</div></div></div>';
                    // shanti code$resultHtml = preg_replace('#(<!-- LOOP STARTS -->)(.*)(<!-- LOOP ENDS -->)#si', $nidHidden . $combinedClassHtml . $combinedSubClassHtml, $data['layout']);
                    $resultHtml = preg_replace('#(<!-- LOOP STARTS -->)(.*)(<!-- LOOP ENDS -->)#si', $allLayoutHtml, $data['layout']);
                    //'$1'.$combinedHtml.'$3'
                } else {
                    $layout = $this->getRawHtmlString();
                    // replace html b/w loop code tags
                    $resultHtml = preg_replace('#(<!-- LOOP STARTS -->)(.*)(<!-- LOOP ENDS -->)#si', $combinedClassHtml . $combinedSubClassHtml, $layout); //'$1'.$combinedHtml.'$3'
                }
            } else {
                // manual add label/input, skip looping code
                $resultHtml = $data['layout'];  // without loop code
                // get subclass array
                $resultSCHtmlArr = $this->getSubClassHtmlAndNodeZ($data['subclasses'], array());
                $resultHtmlArr += $resultSCHtmlArr;

                // default input type
                foreach ($resultHtmlArr as $key => $value) {
                    // check placeholder and class
                    preg_match('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $resultHtml, $match);
                    $placeholder = false;
                    $class = '';
                    if (isset($match[0])) {
                        $xml = simplexml_load_string($match[0]);
                        foreach ($xml[0]->attributes() as $a => $b) {
                            if ($a == 'placeholder') {
                                $placeholder = $b;
                            } else if ($a == 'class') {
                                $class = $b;
                            }
                        }
                    }

                    $inputData = array();
                    //$ncpid     = $value['node_class_property_id'];
                    //$nid     = $value['node_id'];
                    // 'Input','Text Area','Radio','Checkbox','Dropdown','File','Calendar','Remote Server'
                    $caption = $value['caption'];
                    $value['placeholder'] = $placeholder;
                    $value['class'] = $class;
                    $input = $this->getFormElementsArray($value, $class, $caption);

                    // add label
                    $pos1 = strpos($resultHtml, '<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>');
                    if ($pos1 !== false) {
                        $resultHtml = substr_replace($resultHtml, $caption, $pos1, strlen('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>'));
                    }
                    // add placeholder
                    $pos2 = strpos($input, '<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>');
                    if ($pos2 !== false) {
                        $input = substr_replace($input, $caption, $pos2, strlen('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>'));
                    }

                    // add input type
                    $resultHtml = preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $resultHtml, 1);
                }

                // node_class_id hidden field
                $nidHidden = '<input type="hidden" id="node_class_id" name="node_class_id" value="' . $data['node_class_id'] . '" /> ';
                // place hidden field before the end of Form tag
                $resultHtml = str_replace('</form>', $nidHidden . '</form>', $resultHtml);
            }

            // form id
            $formId = 'formId_' . $this->generateRandomString($length = 10);
            // replace form id in layout
            $resultHtml = str_replace('<FORM_ID></FORM_ID>', $formId, $resultHtml);

            // submit function name
            $submitFuncName = 'submitFunc_' . $this->generateRandomString($length = 10) . '()';
            // replace submit function name in layout
            $resultHtml = str_replace('<SUBMIT_FUNCTION></SUBMIT_FUNCTION>', $submitFuncName, $resultHtml);

            //if their is no input field present in the form then no need to add javascript code
            $combinedClassHtml = $resultHtml;

            if ($this->isValidFormTagAvailable($combinedClassHtml)) {
                // echo 'true';
                $resultHtml .= $this->addValidationJs($formId, $submitFuncName, $data['layoutFormType']);
            }
        }

        // Get CSS file content
        $cssData = $this->getCssFileContent($data['main']);

        // replace all the auto SID css class names and remove <AUTO_CLASS> tag
        $resultHtml = preg_replace('/<AUTO_CSS>(.*)<\/AUTO_CSS>/', '', $resultHtml);

        // replace all the SID css class names
        $cssSids = $data['sid'];
        $resultHtml = preg_replace_callback('/SID_([\d]+)/', function ($match3) use($cssSids) {
            return $cssSids[$match3[1]] ? preg_replace('/[.#]/', '', $cssSids[$match3[1]]) : $match3[0];
        }, $resultHtml);

        // FILE - css instance fetch and write to file
        $fileCssToWrite = '';
        if ($data['css']) {
            $cssArr = $this->getFileRulesetArray($data['css']);
            $fileCssToWrite = $this->getCssFileContent($cssArr);
        }

        // create a CSS file and write to it
        if (trim($cssData . $fileCssToWrite) !== '') {
            $domainUrl = $this->cleanDomainUrl($data['domain'], $data['url']);
            $ext = 'css';
            preg_match('/<link[^>]+href=([\'"])(.+?)\1[^>]*>/', $data['combined_html'], $matchFile);
            if (isset($matchFile[2])) {
                $fileName = basename($matchFile[2]);
            } else {
                $fileName = time() . ".{$ext}";
            }

            // AWS S3 - FILE UPLOAD
            $cssFilePath = '';
            $awsObj      = new AwsS3();
            $awsRes      = $awsObj->setFileData("data/view_builder/{$domainUrl}/$fileName", $cssData . $fileCssToWrite, "text");
            if ($awsRes['status_code'] == 200) {
                // AWS S3 - FILE URL LINK
                $cssFilePath = $awsRes['object_url'];
            }

            /*// OLD CODE
            $folderPath = ABSO_URL . "data/view_builder/{$domainUrl}";
            $this->writeToFile($cssData . $fileCssToWrite, $folderPath, $fileName);
            // prepend CSS file LINK to resultHtml
            $cssFilePath = BASE_URL . "data/view_builder/{$domainUrl}/{$fileName}";*/

            $cssLink = '<link href="' . $cssFilePath . '" rel="stylesheet" type="text/css">';
            $resultHtml = $cssLink . $resultHtml;
        }

        return $resultHtml;
    }

    /*
     * Clean Domain & URL
     * Allow alphanumeric, convert '_' otherwise
     * @param string
     * @return string
     */

    private function cleanDomainUrl($domain, $url) {
        $newDomain = preg_replace('#^https?://#', '', $domain);
        $newDomain = preg_replace('/[^a-zA-Z0-9]/', '_', $newDomain);

        $newUrl = str_replace($domain, '', $url);
        $newUrl = preg_replace('#^https?://#', '', $newUrl);
        if (strpos($url, $domain) !== false) {
            $newUrl = trim($newUrl, "/");
        }
        $newUrl = preg_replace('/[^a-zA-Z0-9]/', '_', $newUrl);
        $newUrl = preg_replace('!_+!', '_', $newUrl);

        if (trim($newUrl) != '') {
            $domainUrl = "{$newDomain}/{$newUrl}";
        } else {
            $domainUrl = "{$newDomain}";
        }

        return $domainUrl;
    }

    /*
     * Get HTML elements
     * @param array
     * @return string
     */

    private function getFormElementsArray($inputData, $classId, $caption) {

        
        // FORM ELEMENT'S VALIDATION
        $placeholder = '';
        $class = '';
        if ($inputData['placeholder'] == 'true') {
            $placeholder = '<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>';
        }
        $class = $inputData['class'];
        $randData = $this->generateRandomString($length = 10);
        $validFuncBody = $inputData['validation'];
        preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $validFuncBody, $matches);
        if (count($matches) > 0 && isset($matches[1]) && $inputData['inputType'] != 'instruction') {
            $validFuncName = '';
            foreach (array_reverse($matches[1]) as $key => $val) {
                $validFuncName .= 'check' . $randData . '' . $val . "();";
                $replaceStr = 'check' . $randData . '' . $val;
                $validFuncBody = str_replace($val, $replaceStr, $validFuncBody);
            }
            $validFuncName = substr($validFuncName, 0, -1);
        }

        /* Start Code By Arvind Soni For Data Source Node Z */
        $dataSourceDynamic = '';
        if (strtolower(preg_replace('/\s+/', '_', $inputData['dataSourceType'])) == 'class_property') {
            $dataSourceDynamic = 'data-source-dynamic="' . $inputData['dataSourceDetails'] . '"';
        }
        /* End Code By Arvind Soni For Data Source Node Z */
        $inputEleType = strtolower(implode("-", explode(" ",$caption)));
        // FORM ELEMENTS
        $formElements = array();
        $formElement['hidden'] = '<input id="instance_property_id' . $inputData['ncpid'] . '" name="instance_property_id[]" type="hidden" value="' . $inputData['ncpid'] . '" />';
        $formElement['input'] = '<input type="text" class="validationCheck ' . $class . ' newsletter_text3 '.$inputEleType.' " data-id="' . $inputData['ncpid'] . '" id="instance_property_caption' . $inputData['ncpid'] . '" '
                . ' name="instance_property_caption[]" maxLength="50" validate-data="' . $validFuncName . '" placeholder="' . $placeholder . '" ' . $dataSourceDynamic . ' >';

       
        $formElement['file'] = '<input type="file" class="nodeZinput filestyle" data-id="' . $inputData['ncpid'] . '" ' . $dataSourceDynamic . ' id="filenodeZ' . $inputData['ncpid'] . '" name="filenodeZ' . $inputData['ncpid'] . '" onchange="saveFileStr(this);" placeholder="" data-icon="false" /><span class="fileZReset hide"><i class="prs-icon icon_close"></i></span>'; //setValueOfNodeZForFile(this,'.$inputData['ncpid'].')">';
        $formElement['text area'] = '<textarea ' . $dataSourceDynamic . ' rows="1" cols="55" class="validationCheck ' . $class . ' newsletter_text3 '.$inputEleType.' " name="instance_property_caption[]" '
                . ' data-id="' . $inputData['ncpid'] . '" id="instance_property_caption' . $inputData['ncpid'] . '" maxLength="500" validate-data="' . $validFuncName . '" placeholder="' . $placeholder . '" ></textarea>';


        //For Select input type
        if ($inputData['inputType'] == 'drop down' && $inputData['instanceValues'] != '') {
            $formElement['drop down'] = '<select name="instance_property_caption[]" class=" ' . $class . ' select-field nodeZselect nodeselection-dropdown instanceRunTab '.$inputEleType.' " '
                    . ' data-id="' . $inputData['ncpid'] . '" id="instance_property_caption' . $inputData['ncpid'] . '" ' . $dataSourceDynamic . '> ';
            for ($k = 0; $k < count($inputData['instanceValues']); $k++) {
                $formElement['drop down'] .= '<option value="' . $inputData['instanceValues'][$k] . '">' . $inputData['instanceValues'][$k] . '</option>';
            }
            $formElement['drop down'] .= '</select>';
        } else {
            $formElement['drop down'] = '<select class="' . $class . ' select-field nodeZselect nodeselection-dropdown instanceRunTab '.$inputEleType.' " name="instance_property_caption[]" '
                    . ' data-id="' . $inputData['ncpid'] . '" id="instance_property_caption' . $inputData['ncpid'] . '" ' . $dataSourceDynamic . '><option></option></select>';
        }

        //End for Select Input Type
        //Shanti Code Starts here
        //For Input Type Checkbox
        if ($inputData['inputType'] == 'check box' && $inputData['instanceValues'] != '') {
            $formElement['check box'] = "<div id='checkbox_wrapper' class='".$inputEleType."' >";
            $formElement['check box'] .='<input type="hidden" '.$dataSourceDynamic.' class="instanceRunTab validationCheck" id="instance_property_caption' . $inputData['ncpid'] . '" name="instance_property_caption[]" placeholder="" validate-data="" value="">';
            
            for ($k = 0; $k < count($inputData['instanceValues']); $k++) {
                
                $formElement['check box'] .= "<div class='input-chk'><label><input type='checkbox' " . $dataSourceDynamic . " class='checkClass_" . $inputData['ncpid'] . "' name='check_" . $inputData['ncpid'] . "[]' data-id='" . $inputData['ncpid'] . "' id='check_" . $inputData['ncpid'] . "_" . $k . "' onchange='setValueOfNodeZcheckBox(this," . $inputData['ncpid'] . ")'  value='" . $inputData['instanceValues'][$k] . "'>" . $inputData['instanceValues'][$k] . "</label></div>";
            }
            $formElement['check box'] .="</div>";
        }
        //End For Input Type Checkbox
        //
            ////For Input Type radio
        if ($inputData['inputType'] == 'radio' && $inputData['instanceValues'] != '') {
            $formElement['radio'] = "<div id='radio_wrapper' class='".$inputEleType."' >";
            $randChkNum = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 5)), 0, 5);
            $formElement['radio'] .='<input type="hidden" '.$dataSourceDynamic.' class="instanceRunTab validationCheck" id="instance_property_caption' . $inputData['ncpid'] . '" name="instance_property_caption[]" placeholder="" validate-data="" value="">';
            for ($k = 0; $k < count($inputData['instanceValues']); $k++) {
                $formElement['radio'] .= "<div class='input-radio'><label><input type='radio' " . $dataSourceDynamic." value='" . $inputData['instanceValues'][$k] . "' name='radio_" . $inputData['ncpid'] .$randChkNum. "' data-id='" . $inputData['ncpid'] . "' id='radio_" . $inputData['ncpid'] . "_" . $k . "' onclick='setValueOfNodeZ(this," . $inputData['ncpid'] . ")'>" . $inputData['instanceValues'][$k] . "</label></div>";
            }
            $formElement['radio'] .="</div>";
        }
        //
        //End For Input Type Radio
        ////For Input Type Calender
        if ($inputData['inputType'] == 'calendar' && $inputData['instanceValues'] != '') {
            $formElement['calendar'] = "<div id='calender_wrapper' class='".$inputEleType."' >";

            $formElement['calendar'] .= "<input data-id='" . $inputData['ncpid'] . "' id='class_property_id" . $inputData['ncpid'] . "' name='class_property_id[]' type='hidden' value='" . $inputData['ncpid'] . "'><input type='text' " . $dataSourceDynamic . " readonly='' class='instanceRunTab validationCheck datepicker form-control inline-input' id='instance_property_caption" . $inputData['ncpid'] . "' name='instance_property_caption[]' placeholder='' validate-data=''>";
            $formElement['calendar'] .="</div>";
        }
        //
        //End For Input Type Calender
        //
            //////For Input Label Calender

        if ($inputData['inputType'] == 'instruction' && $inputData['instanceValues'] != '') {
            $formElement['instruction'] = "<div id='label_wrapper'>" . $inputData['caption'] . "</div>";
        }

        //
        //End For Input Type Calender
        //Shanti Code End Here
        // FORM ELEMENT SCRIPT

        $formElement['script'] = '';
        if (!empty($matches[1]) && $validFuncBody != "" && $inputData['inputType'] != 'instruction') {
            $formElement['script'] .= '<script type="text/javascript">' . $validFuncBody . '</script>';
        }

        return $formElement[$inputData['inputType']] . ' ' . $formElement['hidden'] . ' ' . $formElement['script'];
    }

    /*
     * Create random string of length 10 default
     * @return string
     */

    private function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    /*
     * Get string between start and end string
     * @return string
     */

    private function getStringBetween($string, $start, $end) {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0)
            return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;

        return substr($string, $ini, $len);
    }

    /*
     * Default validation JS required to run NodeZ JS
     * @return string
     */

    private function addValidationJs($formId, $submitFuncName, $layoutFormType = "") {
        $validationJS = '<script type="text/javascript">
                
                            function ' . $submitFuncName . ' {
                            var flag1=true; var checkflag1=""; var temp1=true;
                            var formId = "' . $formId . '";
                            var formElem = $("#' . $formId . ':visible");
                            $(formElem).find(".validationCheck:visible").each(function(i,k){
                                var data1 = $.trim($(this).val());
                                var element1 = $(this);
                                if (data1.indexOf("\'") >= 0 || data1.indexOf(\'"\') >= 0) { data1 = "~$~"; }
                                if(flag1 == true){
                                    var fn1="";
                                    fn1 = $(this).attr("validate-data").split(";");
                                    var aa1=[];
                                    for(i=0;i<fn1.length;i++){
                                      aa1.push(fn1[i]);
                                    }
                                    aa1.toString();
                                    $(aa1).each(function(i,v){                                             
                                        var newStr1 = v;
                                        var valdata1 = data1;
                                        if(newStr1.indexOf("pui_fun")>=0) {
                                            var elementId = element1.attr("id");
                                            var aaa1 = newStr1.replace("()","(\'"+elementId+"\')");
                                        } else {
                                            if(valdata1 == ""){
                                                var aaa1 = newStr1.replace("()","(\'\')");
                                            }else {
                                                var aaa1 = newStr1.replace("()","(\'"+data1+"\')");
                                            }
                                        }
                                        checkflag1 = eval(aaa1);
                                        if(checkflag1 == false){
                                            temp1 = false;
                                        }
                                    });
                                    if(temp1 == false){
                                        flag1 = false;
                                    } else {
                                        flag1 = true;
                                    }
                                }
                            });';

        if ($layoutFormType == "" || $layoutFormType == "Simple Form") {
            $validationJS .= 'if(flag1 == true){  
                                    $.ajax({
                                        type: "POST",
                                        url : "' . BASE_URL . 'puidata/newslatter/view-form-save.php",
                                        data : {
                                            data: $(formElem).serialize(),
                                            action: "single",
                                        },
                                        dataType: "json",
                                        async: true,
                                        enctype: "multipart/form-data",
                                        success:function(data){
                                            if(data.result == 0) {

                                            } else {
                                                alert("failed");
                                            }
                                        },
                                        complete: function(data) {
                                            $(".validationCheck").val("");
                                            $("#clubInvestible-popup").modal("hide");
                                            $("#error-modal-3 P").html("Thank you for registration. Please click on OK button to complete your details on eventbrite website.");
                                            $("#error-modal-3").modal({"show":true});
                                        },
                                        error: function(data) {

                                        }
                                    });
                                }';
        } else if ($layoutFormType == "Plugin Form") {
            $validationJS .= "if(flag1 == true){  
                                    if(is_role_assoc != '1') { showFullLoader('content_loader'); }
                                    var filter_text = searchModule.getActiveMenuValue();
                                    var last_filter_id = $('.item-list').find('li.active').attr('id');
                                    var filter_prop_id = $('.item-list').find('li.active').attr('data-statusid');
                                    var col_head_prop_id = getColHeadPropertyId();
                                    var activeMenu = [searchModule.getActiveMenuValue(),searchModule.getActiveMenuDataId()];

                                    var form_data = new FormData(document.getElementById('" . $formId . "'));
                                    form_data.append('action', 'single');
                                    form_data.append('col_head_prop_id', col_head_prop_id);
                                    form_data.append('list_setting_array', list_setting_array);
                                    form_data.append('list_node_id_array', list_node_id_array);
                                    form_data.append('list_head_array', list_head_array);
                                    form_data.append('activeMenu', activeMenu);
                                    form_data.append('login_user_id', login_user_id);
                                    form_data.append('login_role_id', login_role_id);
                                    $.ajax({
                                        type: 'POST',
                                        url : '" . BASE_URL . "puidata/page_plugin/code.php',
                                        data: form_data,
                                        dataType: 'json',
                                        async: true,
                                        enctype: 'multipart/form-data',
                                        cache: false,
                                        contentType: false,
                                        processData: false,
                                        success:function(data){
                                            if(data.result == 0) {
                                                if(typeof updateMenuCount === 'function') {
                                                    updateMenuCount();
                                                }
                                                if(typeof updateActiveList === 'function') {
                                                    updateActiveList(data.data.col_data, data.data.save_type,data.data.node_id,data.data.statusChange);
                                                }
                                            } else {
                                                alert('failed');
                                            }
                                        },
                                        complete: function(data) {
                                            $('.validationCheck').val('');
                                            hideFullLoader('content_loader');
                                        },
                                        error: function(data) {

                                        }
                                    });
                                }";
        } else if ($layoutFormType == "Operation Form") {
            $validationJS .= "if(flag1 == true){  
                                    
                                                    return formId;
                                                }";
        }

        $validationJS .= '}</script>';

        return $validationJS;
    }

    /*
     * Write data to file
     * @param  content of file
     * @param  folderPath, absolute path
     * @param  fileName with extension
     */

    public function writeToFile($content, $folderPath, $fileName) {
        $absoFilePath = "$folderPath/$fileName";

        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
        if (is_file($absoFilePath)) {
            $handle = fopen($absoFilePath, "w+"); // exists - read write
        } else {
            $handle = fopen($absoFilePath, "w");  // create it - write
        }
        fwrite($handle, $content);
        fclose($handle);
    }

    /*
     * Get CSS file content
     * @param array
     * @return string
     */

    private function getCssFileContent($mainArr) {
        $cssFileData = '';
        foreach ($mainArr as $rulId => $rulValue) {
            $selectorNames = '';
            foreach ($rulValue as $selId => $selValue) {
                $selectorNames .= $selValue['name'] . ", ";
            }
            $selectorNames = rtrim($selectorNames, ', ');
            $declarations = '';
            foreach ($selValue['declaration'] as $dec) {
                $declarations .= "\t" . trim($dec, "'") . "\n";
            }
            $declarations = rtrim($declarations, "\n"); // remove the trailing new line char
            $cssFileData .= $selectorNames . " {\r" . $declarations . "\r}\r";
        }
        // ( [a-zA-Z]+\.) - .firefox tr.row-3 td.ExcelTablerow.col-1.fTHLC-left-col.blank
        // in case of removing auto-css code

        return $cssFileData;
    }

    /*
     * Recursive function to generate & merge HTML
     * & NodeZ data of only form selectors of Class Properties
     * @param array $html
     * @param array $htmlNodeZ
     * @param array $data
     * @return array $data
     */

    private function getHtmlAndNodeZ($html, $htmlNodeZ, $data, $section = "", $parent = '') {
        foreach ($html as $key => $value) {
            $ncpid = $value['node_class_property_id'];
            if (isset($value['child'])) {
                $section = $this->generateRandomString(5) . "_" . $value['caption'];
                $parent_chain = $value['node_class_property_id'] . "_" . $value['caption'];
                $parent .= $parent_chain . "#######";
                $result = $this->getHtmlAndNodeZ($value['child'], $htmlNodeZ[$ncpid]['child'], $data, $section, $parent);
                $parent = "";
                $data = $result;
            } else {
                $prefix = $this->generateRandomString(5) . '_';
                $data[$prefix . $ncpid]['inputType'] = strtolower($htmlNodeZ[$ncpid]['nodeZStructure']['FORM SELECTOR'][0]['value']);
                $data[$prefix . $ncpid]['validation'] = $htmlNodeZ[$ncpid]['nodeZStructure']['VALIDATION'][0]['value'];
                $data[$prefix . $ncpid]['instanceValues'] = isset($htmlNodeZ[$ncpid]['nodeClassYInstanceValue']) ? $htmlNodeZ[$ncpid]['nodeClassYInstanceValue'] : '';
                $data[$prefix . $ncpid]['ncpid'] = $ncpid;
                $data[$prefix . $ncpid]['caption'] = $value['caption'];
                $data[$prefix . $ncpid]['section'] = $section;
                $data[$prefix . $ncpid]['parent'] = $parent;
            }
        }

        return $data;
    }

    /*
     * Recursive function to generate & merge HTML
     * & NodeZ data of only form selectors of Sub-Class Properties
     * @param array $subClasses
     * @param array $data
     * @return array $data
     */

    private function getSubClassHtmlAndNodeZ($subClasses, $data) {
        foreach ($subClasses as $scKey => $scValue) {
            $ncid = $scValue['node_class_id'];
            $nodeZ = $this->getnodeZInstances($ncid);
            $htmlNodeZ = current($nodeZ[0]['property'])['child'] ?
                    current($nodeZ[0]['property'])['child'] :
                    $nodeZ[0]['property'];
            $properties = current($scValue['instances'][0]['property'])['child'] ?
                    current($scValue['instances'][0]['property'])['child'] :
                    $scValue['instances'][0]['property'];

            foreach ($properties as $pKey => $pValue) {
                $ncpid = $pValue['node_class_property_id'];
                $prefix = $this->generateRandomString(5) . '_';
                $data[$prefix . $ncpid]['inputType'] = strtolower($htmlNodeZ[$ncpid]['nodeZStructure']['FORM SELECTOR'][0]['value']);
                $data[$prefix . $ncpid]['validation'] = $htmlNodeZ[$ncpid]['nodeZStructure']['VALIDATION'][0]['value'];
                $data[$prefix . $ncpid]['instanceValues'] = isset($htmlNodeZ[$ncpid]['nodeClassYInstanceValue']) ? $htmlNodeZ[$ncpid]['nodeClassYInstanceValue'] : '';
                $data[$prefix . $ncpid]['ncpid'] = $ncpid;
                $data[$prefix . $ncpid]['caption'] = $pValue['caption'];
            }
            if (isset($scValue['childsArray'])) {
                $result = $this->getSubClassHtmlAndNodeZ($scValue['childsArray'], $data);
                $data = $result;
            }
        }

        return $data;
    }

    /*
     * Recursive function to generate & merge HTML
     * & NodeZ data of only form selectors of Sub-Class Properties
     * @param array $subClasses
     * @param array $data
     * @return array $data
     */

    private function getSubClassHtmlAndNodeZNested($subClasses, $data) {
        foreach ($subClasses as $scKey => $scValue) {
            //echo $scValue['caption'].' - ';
            $ncid = $scValue['node_class_id'];
            $nodeZ = $this->getnodeZInstances($ncid);
            $htmlNodeZ = current($nodeZ[0]['property'])['child'] ?
                    current($nodeZ[0]['property'])['child'] :
                    $nodeZ[0]['property'];

            $properties = current($scValue['instances'][0]['property'])['child'] ?
                    current($scValue['instances'][0]['property'])['child'] :
                    $scValue['instances'][0]['property'];
            $i = 0;
            foreach ($properties as $pKey => $pValue) {
                //echo $pValue['caption'].' | ';
                $ncpid = $pValue['node_class_property_id'];
                $data[$ncid][$i]['inputType'] = strtolower($htmlNodeZ[$ncpid]['nodeZStructure']['FORM SELECTOR'][0]['value']);
                $data[$ncid][$i]['validation'] = $htmlNodeZ[$ncpid]['nodeZStructure']['VALIDATION'][0]['value'];
                $data[$ncid][$i]['instanceValues'] = isset($htmlNodeZ[$ncpid]['nodeClassYInstanceValue']) ? $htmlNodeZ[$ncpid]['nodeClassYInstanceValue'] : '';
                $data[$ncid][$i]['ncpid'] = $ncpid;
                $data[$ncid][$i]['caption'] = $pValue['caption'];
                $i++;
            }
            $blankArray = array();
            if (is_array($scValue['childsArray'])) {
                $data[$ncid]['child'] = $this->getSubClassHtmlAndNodeZNested($scValue['childsArray'], $blankArray);
            }
        }

        return $data;
    }

    /*
     * Recursive function to generate Nested
     * form selectors for sub classes
     * @param array $resultSCHtmlArr
     * @param string $loopCode
     * @return bool $placeholder
     * @param string $class
     * @param string $combinedSubClassHtml
     * @return string
     */

    private function generateSubClassFormSelectorsNested($resultSCHtmlArr, $loopCode, $placeholder, $class, $combinedSubClassHtml) {
        // loop through subclasses
        foreach ($resultSCHtmlArr as $scKey => $scValue) {
            // echo '<br />'.$scKey . ' {} ';
            // loop through properties
            $combinedSubClassHtml .= '<div class="SUBCLASS_START_' . $scKey . '" id="">';
            foreach ($scValue as $pKey => $pValue) {
                // add label
                if ($pKey === 'child') {
                    $child = $pValue;
                    $combinedSubClassHtml .= $this->generateSubClassFormSelectorsNested($child, $loopCode, $placeholder, $class, '');
                } else {
                    // echo "#".$pValue['caption'].' | ';
                    $pValue['placeholder'] = $placeholder;
                    $pValue['class'] = $class;
                    
                    $input = $this->getFormElementsArray($pValue, $class, $pValue['caption']);
                    $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $pValue['caption'], $loopCode);
                    $input = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $pValue['caption'], $input);
                    $combinedSubClassHtml .= preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
                }
            }
            $combinedSubClassHtml .= '</div>'; // "SUBCLASS_END_' . $scKey . '"
        }

        return $combinedSubClassHtml;
    }

    /**
     *
     * @param type $resultSCHtmlArr
     * @param type $loopCode
     * @param type $placeholder
     * @param type $class
     * @param type $combinedSubClassHtml
     * @return string
     * 
     */
    public function generateSubClassFormSelectorsNestedNew($resultSCHtmlArr, $loopCode, $placeholder, $class, $combinedSubClassHtml) {

        // loop through subclasses


        foreach ($resultSCHtmlArr as $scKey => $scValue) {
            // echo '<br />'.$scKey . ' {} ';
            // loop through properties

            $returnArray = $this->classesTable->getClassNameByClassId($scKey);
//               echo "<pre>";
//               print_r($returnArray);
//               die();
            $section_key = $this->generateRandomString(10);
            $combinedSubClassHtml .= '<div class="SUBCLASS_START_' . $scKey . '" id="">';
            $combinedSubClassHtml .= '<div class="nested-layout clearfix"><a class="list-title-heading class-accordian"  >
            <i class="fa fa-angle-down"></i><span class="list-title-accordian">' . $scValue['caption'] . '<span>
        </a>
        <div class="collapse in" >
          <div class="list-detail-section"> ';
            foreach ($scValue as $pKey => $pValue) {
                // add label
                $section_key = $this->generateRandomString(10);
                if ($pKey === 'childsArray') {
                    $child = $pValue;
                    $combinedSubClassHtml .= '<div class="nested-layout clearfix"><a class="list-title-heading class-accordian"  >
            <i class="fa fa-angle-down"></i><span class="list-title-accordian">' . $val['caption'] . '<span>
        </a>
        <div class="collapse in" >
          <div class="list-detail-section"> ';
                    $combinedSubClassHtml .= $this->generateSubClassFormSelectorsNestedNew($child, $loopCode, $placeholder, $class, '');
                    $combinedSubClassHtml .= "</div></div></div>";
                } else {
                    // echo "#".$pValue['caption'].' | ';
                    $pValue['placeholder'] = $placeholder;
                    $pValue['class'] = $class;
                    if ($pValue['inputType'] == "drop down") {

                        $pValue['class'] = str_replace("inline-input", "form-select", $class);
                    }
                    $input = $this->getFormElementsArray($pValue, $class, $pValue['caption']);
                    $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $pValue['caption'], $loopCode);
                    $input = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $pValue['caption'], $input);
                    $combinedSubClassHtml .= preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
                }
            }
            $combinedSubClassHtml .= '</div></div></div></div>'; // "SUBCLASS_END_' . $scKey . '"
        }

        return $combinedSubClassHtml;
    }

    /*
     * Fetch ruleset css array
     * @param int $cssFileInsId
     * @return array
     */

    private function getFileRulesetArray($cssFileInsId) {
        $fileInsArr = $this->classesTable->getInstaceIdByNodeXYAndNodeInstance($cssFileInsId, RULESET_CLASS_ID);
        $rulesetInsArr = array();
        foreach ($fileInsArr as $xyIds) {
            $rulesetId = $xyIds['node_x_id'];
            $temp = array();

            // DECLARATIONS
            $decArr = $this->classesTable->getInstaceIdByNodeXYAndNodeInstance($rulesetId, DECLARATION_CLASS_ID);
            $dec = array();
            foreach ($decArr as $declaration) {
                $decrArray = array_values($this->classesTable->getNodeInstanceValueBy($declaration['node_instance_id']));
                if (is_array($decrArray)) {
                    $decLine = "'" . htmlspecialchars_decode(trim($decrArray[0])) . ":" . htmlspecialchars_decode($decrArray[1]) . ";'";
                    $dec[] = $decLine;
                }
            }

            // SELECTORS
            $selArr = $this->classesTable->getInstaceIdByNodeXYAndNodeInstance($rulesetId, SELECTOR_CLASS_ID);
            foreach ($selArr as $selector) {
                $selectorArr = array_values($this->classesTable->getNodeInstanceValueBy($selector['node_instance_id']));
                if (is_array($selectorArr)) {
                    $temp[$selector['node_instance_id']]['name'] = htmlspecialchars_decode($selectorArr[0]);
                    $temp[$selector['node_instance_id']]['declaration'] = $dec;
                }
            }
            if (!empty($temp)) {
                $rulesetInsArr[$rulesetId] = $temp;
            }
        }

        return array_filter($rulesetInsArr);
    }

    /**
     * Generate tree structure for the Array pass with node Z properties.
     * @param type $arr
     * @param type $htmlNodeZ
     * @param type $loopCode
     * @param type $placeholder
     * @param type $class
     * @return string
     * 
     */
    function generateMainClsHtml($arr, $htmlNodeZ, $loopCode, $placeholder, $class) {
        
       
        $out .=' ';
        foreach ($arr as $val) {
            $section_key = $this->generateRandomString(10);
            if (!empty($val['child'])) {
                $ncpid = $val['node_class_property_id'];
                $showCollapsed = @$htmlNodeZ[$ncpid]['nodeZStructure']['SHOWCOLLAPSED'][0]['value'];
                if($showCollapsed=="Yes"){
                    $showCollapsedCls = "collapsed-mode";
                    $showCollapsedIcon = "fa-angle-up";
                    $showCollapsedIn = "";
                }else{
                    $showCollapsedCls = "uncollapsed-mode";
                    $showCollapsedIcon = "fa-angle-down";
                    $showCollapsedIn = "in";
                }
                $out .= '<div class="nested-layout clearfix">
                            <a class="list-title-heading class-accordian '.$showCollapsedCls.' "   >
                                <i class="fa '.$showCollapsedIcon.'"></i><span class="list-title-accordian">' . $val['caption'] . '<span>
                            </a>
                        <div class="collapse '.$showCollapsedIn.'" >
                          <div class="list-detail-section"> ';
                $out .= $this->generateMainClsHtml($val['child'], $htmlNodeZ[$ncpid]['child'], $loopCode, $placeholder, $class);
                $out .= "</div></div></div>";
            } else {

                
                $ncpid                          = $val['node_class_property_id'];
                $val['inputType']               = strtolower($htmlNodeZ[$ncpid]['nodeZStructure']['FORM SELECTOR'][0]['value']);
                $val['validation']              = $htmlNodeZ[$ncpid]['nodeZStructure']['VALIDATION'][0]['value'];
                
                
                if(strpos("~$~", $htmlNodeZ[$ncpid]['nodeZStructure']['DATA SOURCE'][0]['value']))
                {
                    $val['dataSourceDetails']       = $htmlNodeZ[$ncpid]['nodeZStructure']['DATA SOURCE'][0]['value'];
                    $val['dataSourceType']          = $htmlNodeZ[$ncpid]['nodeZStructure']['DATA SOURCE'][1]['value'];
                }
                else
                {
                    $val['dataSourceDetails']       = $htmlNodeZ[$ncpid]['nodeZStructure']['DATA SOURCE'][1]['value'];
                    $val['dataSourceType']          = $htmlNodeZ[$ncpid]['nodeZStructure']['DATA SOURCE'][0]['value'];
                }
                

                $val['instanceValues']          = isset($htmlNodeZ[$ncpid]['nodeClassYInstanceValue']) ? $htmlNodeZ[$ncpid]['nodeClassYInstanceValue'] : '';
                $val['instanceValues'] = preg_replace('/\$(\d)/', '\\\$$1', $val['instanceValues']);
                $val['ncpid']                   = $ncpid;
                $caption                        = $val['caption'];
                $val['placeholder']             = $placeholder;

                $val['class'] = $class;
                if ($val['inputType'] == "drop down") {

                    $class2 = str_replace("inline-input", "form-select", $class);
                    $val['class'] = $class2;
                }

                $input = $this->getFormElementsArray($val, $class, $caption);
               

                if ($val['inputType'] != "instruction") {
                    $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $loopCode);
                    $input = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $input);
                    $combineCode = preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
                } else {

                    $loopCode2='<div class="form-group nested-layout">
          <label class="col-sm-12 control-label form-label"><CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL></label>
         </div>
         ';
                    $caption                    = "<div class='labeldiv'>" . $caption . "</div>";
                    $tempHtml                   = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $loopCode2);

                    $loopCode2 = str_replace('<div class="col-sm-8"><CLASS_PROPERTY_USER_INPUT placeholder="false" class="form-control inline-input"></CLASS_PROPERTY_USER_INPUT><span class="list-view-detail hide"></span></div>', '', $loopCode2);
                    $caption = "<div class='labeldiv'>" . $caption . "</div>";
                    $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $loopCode2);

                    $input = "";
                    $combineCode = preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
                
                }
                // add input type, combined html for class
                $out .= $combineCode;
            }
        }
        $out .= "";

        return $out;
    }

    function generateSubClsHtml($arr, $htmlNodeZ, $loopCode, $placeholder, $class, $parentCId, $clsLevelCount) {
        $out .=' ';
        
        foreach ($arr as $scKey => $val) {
            $currentClsId = $val['instances'][0]['node_class_id'];
            $clsNodeId = $this->classesTable->getClassNodeId($currentClsId);
            $parentCId .= '_' . $currentClsId;
            $section_key = $this->generateRandomString(10);
            if(intval($clsLevelCount)<1){
                $iconClass = 'fa-angle-down';
                $fnCall = '';
                $wrapperCls = '';
                $actionHtml = '<span style="cursor:pointer;" class="right manage-right-cls-action"><i class="prs-icon add hide"></i><i class="prs-icon icon_close confirm_remove_close hide"></i></span>';
            }else{
                $iconClass = 'fa-angle-up';
                $type = "'Edit'";
                $wrapperCls = 'hide';
                $actionHtml = '';
                $fnCall = 'onclick="getSubClassStructureLayout('.$currentClsId.', '.$clsNodeId.', '.$type.', this)" ';
                
            }
            $out .= '<div  id="cls' . $parentCId . '" data-parent-instance-node-id="" data-mode="add"  data-id='.$val['instances'][0]['node_class_id'].' class="cls-wrapper nested-layout cls-tree clearfix cls' . $parentCId . ' " '.$fnCall.'  ><a class="list-title-heading class-accordian " ><i class="fa '.$iconClass.'"></i>' . ucwords($val['caption']) . '</a><div class="collapse-wrapper '.$wrapperCls.' " >
          <div class="list-detail-section">'.$actionHtml.'';

            //echo $val['instances'][0]['node_class_id'];
            $data = $this->getnodeZInstances($val['instances'][0]['node_class_id']);
//              echo "<pre>";
//              print_r($data);
//              die();
            
            $htmlNodeZ = current($data[0]['property'])['child'];
            if(intval($clsLevelCount)<1){
                 $out .= $this->generateMainClsHtml(current($val['instances'][0]['property'])['child'], $htmlNodeZ, $loopCode, $placeholder, $class);
            }
           
            if (!empty($val['childsArray']  && intval($clsLevelCount)<1) ) {
                $clsLevelCount2 = intval($clsLevelCount)+1;
                $out .= $this->generateSubClsHtml($val['childsArray'], $htmlNodeZ, $loopCode, $placeholder, $class, $parentCId, $clsLevelCount2);
                $out .= "</div></div></div>";
            } else {
                
                $out .= "</div></div></div>";
            }
            
            $parentCIdArr = explode("_", $parentCId);
            array_pop($parentCIdArr);

            $parentCId = implode("_", $parentCIdArr);
        }
        $out .= "";

        return $out;
    }

    private function getRawHtmlString() {
        $layout = '<div id="content_scroler_div" class="customScroll mid-section-HT" > 
   <div class="listing-content-wrap" >
      <!-- LOOP STARTS -->
        <div class="form-group">
          <label class="col-sm-4 control-label form-label"><CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL></label>
            <div class="col-sm-8">
                <CLASS_PROPERTY_USER_INPUT placeholder="true" class="form-control inline-input"></CLASS_PROPERTY_USER_INPUT>           
                <span class="list-view-detail hide"></span>
            </div>      
        </div>
      <!-- LOOP ENDS -->
      
        
 </div>
</div>';
        return $layout;
    }

    /**
     * Function is used to verify the string containing or not form input
     * available input form tags : text,radio,checkbox,dropdown,file,password.
     * @param type $combinedClassHtml
     * @return boolean
     * 
     */
    private function isValidFormTagAvailable($combinedClassHtml) {

        $return = false;
        if (strpos($combinedClassHtml, '<input type="text"') !== false || strpos($combinedClassHtml, '<input type="checkbox"') !== false || strpos($combinedClassHtml, '<input type="radio"') !== false || strpos($combinedClassHtml, '<input type="password"') !== false || strpos($combinedClassHtml, '<select') !== false || strpos($combinedClassHtml, '<input type="file"') !== false || strpos($combinedClassHtml, '<textarea') !== false) {
            $result = true;
        }

        return $result;
    }

    /* Get Property of Property
     * @param Propery Array
     */

    private function getPropertyOFProperty($propArr, $returnArray) {


        foreach ($propArr as $key => $value) {

            if (is_array($value['child'])) {

                $returnArray = $this->getPropertyOFProperty($value['child'], $returnArray);
            } else {
                $returnArray[$key] = $value;
                $nodeY = $this->classesTable->fetchNodeClassY($value['node_id']);
                $nodeZ = $this->classesTable->fetchNodeYZ($value['node_id']);
                $nodeZStructure = $this->classesTable->getNodeInstaceId1($nodeZ, $nodeClassYId);
                $nodeClassYInstanceValue = $this->classesTable->nodeClassYInstanceValue($nodeClassYId, $nodeY);


                $returnArray[$key]['ncpid'] = $pValue['node_class_property_id'];
                $returnArray[$key]['inputType'] = strtolower($nodeZStructure['FORM SELECTOR'][0]['value']);
                $returnArray[$key]['validation'] = $nodeZStructure['VALIDATION'][0]['value'];
                $returnArray[$key]['instanceValues'] = $nodeClassYInstanceValue;
                $returnArray[$key]['caption'] = $value['caption'];
            }
        }

        return $returnArray;
    }

    private function getParentOfParentProperty($node_id) {
        $propertyArr = array();
        $paramArr = array('node_class_property_id');
        $clsPropertyIdArr = $this->classesTable->getTableCols($paramArr, 'node-class-property', 'node_id', $node_id);
        $clsPropertyId = $clsPropertyIdArr['node_class_property_id'];
        if ($clsPropertyId > 0) {
            $nodeClsPropParentId = 0;
            $index = 0;
            do {
                $paramArr = array('node_class_property_parent_id', 'caption');
                $nodeClsPropParentIdArr = $this->classesTable->getTableCols($paramArr, 'node-class-property', 'node_class_property_id', $clsPropertyId);
                $nodeClsPropParentId = $nodeClsPropParentIdArr['node_class_property_parent_id'];
                $propertyArr[$index]['caption'] = $nodeClsPropParentIdArr['caption'];
                $propertyArr[$index]['parent_id'] = $nodeClsPropParentId;
                $clsPropertyId = $nodeClsPropParentId;
                $index++;
            } while ($nodeClsPropParentId != 0);
        }
        return array_reverse($propertyArr);
    }

    private function getParentOfParentPropertyByPropertyId($clsPropertyId) {
        $propertyArr = array();
        if ($clsPropertyId > 0) {
            $nodeClsPropParentId = 0;
            $index = 0;
            do {
                $paramArr = array('node_class_property_parent_id', 'node_class_property_id', 'caption');
                $nodeClsPropParentIdArr = $this->classesTable->getTableCols($paramArr, 'node-class-property', 'node_class_property_id', $clsPropertyId);
                $nodeClsPropParentId = $nodeClsPropParentIdArr['node_class_property_parent_id'];
                $nodeClsPropertyId = $nodeClsPropParentIdArr['node_class_property_id'];
                $propertyArr[$index]['caption'] = $nodeClsPropParentIdArr['caption'];
                $propertyArr[$index]['node_class_property_id'] = $nodeClsPropertyId;
                $propertyArr[$index]['parent_id'] = $nodeClsPropParentId;

                $clsPropertyId = $nodeClsPropParentId;
                $index++;
            } while ($nodeClsPropParentId != 0);
        }
        return array_reverse($propertyArr);
    }

    //************ GET PROPERTY OF THEIR PROPERTY TREE**********************
    private function setHtmlLayout($propertyArr, $i, $input) {


        $combinedSubClassHtml = '';
        $arrCount = count($propertyArr);
        $caption = trim($propertyArr[$i]['caption']);
        if ($i < $arrCount) {
            $i++;
            $uniqueNum = uniqid();
            $key = uniqid();
            $combinedSubClassHtml .= '<div  id="subclass-start-' . $key . '" class="nested-layout clearfix">';
            $combinedSubClassHtml .= '<div><a class="list-title-heading class-accordian"  ><i class="fa fa-angle-down"></i>Sub Title</a></div>';
            $combinedSubClassHtml .= '<div class="collapse in" >
             <div class="list-detail-section"><span style="cursor:pointer;"  class="right manage-right-cls-action"><i class="prs-icon add hide"></i><i class="prs-icon icon_close confirm_remove_close hide"></i></span>';
            if ($i == $arrCount) {

                $labelVal = '<div class="form-group">
			          <label class="col-sm-4 control-label form-label">' . $caption . '</label>
			          <div class="col-sm-8">' . $input . '
			             <span class="list-view-detail hide"></span>
			         </div>      
			         </div>';
                $combinedSubClassHtml .= $labelVal;
            } else {
                $combinedSubClassHtml .= '<span class="sub-property">' . $caption . '</span>' . $this->setHtmlLayout($propertyArr, $i, $input);
            }

            $combinedSubClassHtml .= '</div>';
            $combinedSubClassHtml .= '</div>';
            $combinedSubClassHtml .= '</div>'; // "SUBCLASS_END_' . $scKey . '" 
        }
        return $combinedSubClassHtml;
    }

    private function setHtmlLayoutArr($propertyArr) {

        $propArr = array();
        $i = 0;
        foreach ($propertyArr as $mainKey => $mainVal) {
            foreach ($mainVal as $subKey => $subVal) {
                $propArr[$subVal['node_class_property_id']]['caption'] = $subVal['caption'];
                $propArr[$subVal['node_class_property_id']]['node_class_property_id'] = $subVal['node_class_property_id'];
                $propArr[$subVal['node_class_property_id']]['parent_id'] = $subVal['parent_id'];
                $i++;
            }
        }
        //reset array and maintani root node parent id makes zero
        foreach ($propArr as $key => $val) {
            if (!array_key_exists($val['parent_id'], $propArr)) {
                $propArr[$key]['root_nod'] = 'yes';
                $propArr[$key]['parent_id'] = '0';
            } else {
                $propArr[$key]['root_nod'] = 'no';
            }
        }
        return $this->buildTree($propArr, 0);
    }

    private function buildTree(array $elements, $parentId = 0) {
        $branch = array();
        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $children = $this->buildTree($elements, $element['node_class_property_id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    function traversePropertiesTree($arr, $loopCode, $placeholder, $class) {



        $out = '<div  class="nested-layout clearfix">';
        $out .= '<a class="list-title-heading class-accordian" ><i class="fa fa-angle-down"></i>Sub Title</a>';
        $out .= '<div class="collapse-wrapper"  >
                     <div class="list-detail-section"><span style="cursor:pointer;" class="right manage-right-cls-action"><i class="prs-icon add hide"></i><i class="prs-icon icon_close confirm_remove_close hide"></i></span>';

        foreach ($arr as $arrKey => $val) {


            if (!empty($val['child'])) {
                $out .= '<span class="sub-property">' . $val['caption'] . '</span>' . $this->traversePropertiesTree($val['child'], $loopCode, $placeholder, $class);
            } else {
                $nodeZStructure = array();
                $nid = $val['node_id'];

                $nodeY = $this->classesTable->fetchNodeClassY($nid);
                $nodeZ = $this->classesTable->fetchNodeYZ($nid);
                $nodeClassYId = $this->classesTable->nodeClassYIdOnProperty($nid);
                $nodeZStructure = $this->classesTable->getNodeInstaceId1($nodeZ, $nodeClassYId);
                $nodeClassYInstanceValue = $this->classesTable->nodeClassYInstanceValue($nodeClassYId, $nodeY);

                $ncpid = $val['node_class_property_id'];
                $caption = $val['caption'];

                $inputArr = array();
                $inputArr['inputType'] = strtolower($nodeZStructure['FORM SELECTOR'][0]['value']);
                $inputArr['validation'] = $nodeZStructure['VALIDATION'][0]['value'];
                $inputArr['instanceValues'] = $nodeClassYInstanceValue;
                $inputArr['ncpid'] = $ncpid;
                $inputArr['caption'] = $caption;
                $inputArr['class'] = $class;
                $inputArr['placeholder'] = $placeholder;

                $input = trim($this->getFormElementsArray($inputArr, $class, $caption));
                $tempHtml = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $loopCode);
                $input = str_replace('<CLASS_PROPERTY_LABEL></CLASS_PROPERTY_LABEL>', $caption, $input);
                $out .= preg_replace('/(<CLASS_PROPERTY_USER_INPUT).*(<\/CLASS_PROPERTY_USER_INPUT>)/', $input, $tempHtml);
            }
        }
        $out .= "</div></div></div>";

        return $out;
    }

}
