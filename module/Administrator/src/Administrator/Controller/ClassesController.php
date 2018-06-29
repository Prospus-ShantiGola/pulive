<?php

namespace Administrator\Controller;

use Administrator\Controller\Plugin\AwsS3;
use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

use Administrator\Controller\Plugin\PUMailer;

class ClassesController extends AbstractActionController {

    protected $administratorTable;
    protected $classesTable;
    protected $storageType =STORAGE_NAME;

    /*
     * Created By: Amit Malakar
     * Date: 26-Jul-17
     * Function to redirect to Login page if user not logged in
     */
    public function onDispatch(\Zend\Mvc\MvcEvent $e)
    {
        if (isset($_COOKIE[PREFIX . 'uniqueId1']) && !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
            $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
            $cipherObj                = new PUCipher();
            $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
            $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);

            $sessObj  = new PUSession($decryptedHashedUserEmail);
            $sessData = $sessObj->read('');
            // DECODE SESSION FILE DATA
            session_decode($sessData);
        }
        if(!$_SESSION[PREFIX.'user_info']) {
            return $this->redirect()->toRoute('store');     // route to login if Guest
        }
        return parent::onDispatch($e);
    }

    public function getAdministratorTable() {
        if (!$this->administratorTable) {
            $sm = $this->getServiceLocator();
            $this->administratorTable = $sm->get('Administrator\Model\AdministratorTable');
        }
        return $this->administratorTable;
    }

    public function getClassesTable() {
        if (!$this->classesTable) {
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    }

    public function deleteCacheFile($file_name) {
        $fileArray = glob(ABSO_URL . "data/perspective_cache/*");
        $newFileArray = array();
        $flag = 0;
        foreach ($fileArray as $key => $value) {

            $fileName = str_replace(ABSO_URL . "data/perspective_cache/", "", $value);
            $newFileArray[] = $fileName;
            /* For Delete Files */
            $pos = strpos($fileName, $file_name);
            if ($pos === 0) {
                $manager = $this->getServiceLocator()->get('MemorySharedManager');
                $manager->setStorage($this->storageType);
                $manager->clear($fileName);
                $flag = 1;
            }
        }
        return $flag;
        /* For Delete All Files */
        /* $fileArray              =   glob(ABSO_URL."data/perspective_cache/*");
          foreach($fileArray as $key => $value)
          {
          $fileName           =   str_replace(ABSO_URL."data/perspective_cache/", "", $value);
          $manager->clear($fileName);
          } 
        */

        /*
        $awsObj                 = $this->AwsS3();
        $temp['path']           = 'temp_session';
        $temp['detailed']       = false;
        $returnArray            = $awsObj->getBucketFilesLists($temp);
        $fileArray              = array();
        foreach ($returnArray as $file) {
            $filename           = $file;
            $file_path_parts    = pathinfo($filename);
            $file_name          = $file_path_parts['filename'];
            array_push($fileArray, $file_name);
        }

        foreach($fileArray as $key => $value)
        {   
            $fileExist          = $awsObj->fileExist('temp_session',$value);
            $buffer             = '';
            if($fileExist)
            {
                $awsObj->deleteFileData("temp_session/".$value);
            }
        } 
        die;
        */
    }

    public function indexAction() {
        $user_info = $_SESSION[PREFIX . 'user_info'];
        $layout = $this->layout();
        $is_main_layout = 'Y';
        /*
         * Modified By: Divya Rajput
         * Date: 26-07-2017
         * Purpose: Call layout/layout for direct hit
        */
        if(!$this->getRequest()->isXmlHttpRequest()){
            $layout->setTemplate('layout/layout');
        }else{
        $layout->setTemplate('layout/simple');
            $is_main_layout = 'N';
        }

        /* Start Code By Arvind Soni For Caching */
        // echo $this->getClassesTable()->createNode(); die;
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */

        $display = 'Normal';
        $order_by = 'node_class_id';
        $order = 'DESC';
        $page = 1;
        $filter_operator = '';
        $search_text = '';
        $filter_field = '';
        $hit_by = '';
        $defaultItemsPerPage = RECORD_PER_PGE;

        $is_auto = '';
        $request = $this->getRequest();
        if($is_main_layout == 'N'){
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($post['type'] == 'pagination') {
                $display = 'Ajax';
                $order_by = $post['order_by'];
                $order = $post['order'];
                $page = $post['page'];
                $defaultItemsPerPage = $post['itemPerPage'];
                $is_auto = $post['auto'];
            }

            if ($post['type'] == 'no-pagination') {
                $display = 'no-pagination';
                $order_by = $post['order_by'];
                $order = $post['order'];
                $page = $post['page'];
            }

            if ($post['filter_operator'] != '' && $post['search_text'] != '') {
                $filter_operator = $post['filter_operator'];
                $search_text = $post['search_text'];
                $filter_field = $post['filter_field'];
            }

            if ($post['filter_operator'] != '' && $post['search_text'] != '') {
                $hit_by = $post['hit_by'];
            }
        }
        }

        /* Start Code By Arvind Soni For Caching */
        $class_list_file_name = 'class_list_' . $display . "_" . $order_by . "_" . $order . "_" . $page . "_" . $filter_field . "_" . $search_text . "_" . $filter_operator . "_" . $hit_by . "_" . $defaultItemsPerPage;
        $class_list_file_name = strtolower($class_list_file_name);
        $cachedData = $manager->read($class_list_file_name);

        if ($cachedData != "") {
            $classArray = $cachedData;
        } else {
            $classArray = $this->getClassesTable()->getClassListByPagination($order, $order_by, $display, $filter_operator, $search_text, $filter_field, $hit_by);
            $manager->write($class_list_file_name, $classArray);
        }

        /* End Code By Arvind Soni For Caching */
        $view = "";
        if ($display == 'no-pagination') {
            $view = new ViewModel(array(
                'order_by' => $order_by,
                'order' => $order,
                'classArray' => $classArray,
                //'paginateClassArray' => $paginateClassArray,
                'display' => $display,
                'totalRecord' => count($classArray),
                'is_main_layout' => $is_main_layout
            ));
        } else {
            $itemsPerPage = $defaultItemsPerPage;
            $classArray->setCurrentPageNumber($page);
            $classArray->setItemCountPerPage($itemsPerPage);
            $totalRecord = $classArray->getTotalItemCount();
            $nodeClassX = $this->getClassesTable()->getClassNodeX();

            $view = new ViewModel(array(
                'order_by' => $order_by,
                'order' => $order,
                'page' => $page,
                'classArray' => $classArray,
                'display' => $display,
                'itemsPerPage' => $itemsPerPage,
                'totalRecord' => $totalRecord,
                'nodeClassX' => $nodeClassX,
                'is_auto' => $is_auto,
                'is_main_layout' => $is_main_layout
            ));
        }
        return $view;
    }

    public function classStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';

        /* Start Code By Arvind Soni For Caching */
        $classCachedData = '';
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];

            if ($post['version'] == 1)
                $version = $post['version'];
            else
                $version = "";

            /* Start Code By Arvind Soni For Caching */
            //$class_file_name = "class_structure_" . strtolower($mode) . "_" . $post['class_id'];
            $classCachedData = "";//$manager->read($class_file_name);

            if ($classCachedData == "") {
                $classArray = $this->getClassesTable()->getClassList($post['class_id']);

                $node_class_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);
                $temp_class_array[] = $node_class_id;

                $data = $this->getClassesTable()->getClassChildStructureWithSequence($mode, $classArray, $post['class_id'], $temp_class_array);

                $classArray['childs'] = $data['ids'];
                $classArray['childsArray'] = $data['data'];
                $classArray['number_print'] = $data['number_print'];
                $classArray['taxonomy_data'] = $data['taxonomy_data'];
                $classArray['number_array'] = $data['number_array'];

                $classArray['instances'] = $this->getClassesTable()->getClassStructure($post['class_id']);

                $desendent = $this->getClassesTable()->getDesendent($node_class_id);

                /* Get Discendant Type Value OF Class */
                if (trim($desendent) != '')
                    $classArray['discendant'] = $desendent;
                else
                    $classArray['discendant'] = 'Instance';

                $node_id = $node_class_id;
                $countSubChild = $this->getClassesTable()->checkIsSubClass($node_id);
                $nodedetails = $this->getClassesTable()->nodeTypes();
                $nodeType = $this->getClassesTable()->getNodeType($classArray['node_type_id']);
                $nodeXY = $this->getClassesTable()->fetchNodeXY($node_id);
                $nodeZ = $this->getClassesTable()->fetchNodeYZ($node_id);
                $nodeZMain = $this->getClassesTable()->fetchNodeZ($nodeZ);
            }
            /* End Code By Arvind Soni For Caching */
        }

        /* Start Code By Arvind Soni For Caching */
        if ($classCachedData != "") {
            return $classCachedData;
        } else {
            $config = $this->getServiceLocator()->get('config');
            $configArr = array();
            $configArr['NODE_Z_GROUPING_CLASSES'] = $config['constants']['NODE_Z_GROUPING_CLASSES'];
            $configArr['NODE_Z_CLASSES'] = $config['constants']['NODE_Z_CLASSES'];

            $view = new ViewModel(array('classArray' => $classArray,
                'mode' => $mode,
                'nodeType' => $nodeType,
                'countSubChild' => $countSubChild,
                'nodedetails' => $nodedetails,
                'nodeXY' => $nodeXY,
                'nodeZ' => $nodeZ,
                'nodeZMain' => $nodeZMain,
                'version' => $version,
                'config' => $configArr));

            /* Start Code By Arvind Soni For Caching */
            //$manager->write($class_file_name, $view);
            /* End Code By Arvind Soni For Caching */

            return $view;
        }
        /* End Code By Arvind Soni For Caching */
    }

    /**
     * Used to save the class information.
     * @return ViewModel
     *
     */
    public function saveClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        $isMappingPopup = 'N';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            //print_r($post);die;
            //unset($_SESSION['parent_class']);
            $mode = $post['mode'];
            $saveType = $post['saveType'];
            parse_str($post['data'], $postArray);
            $new_property_array = json_decode($post['propertyJson'], true);


            //Shanti Code Starts here to set the default set of values for node z class..
            //Set the default values only when the Type of Class is Dynamic whenever user save the class.
            // if ($postArray['version_type'] == 2) { // remove this for strict also.
            $config = $this->getServiceLocator()->get('config');


            $propertyArr = array();   // Array for Grouping.Properties.
            $labelArr = array();      // Array for Grouping.Label.
            foreach ($new_property_array as $chkParent) {
                if ($chkParent['parent'] != 'none') {
                    $propertyArr[] = $chkParent['parent'];
                    $labelArr[] = $chkParent['id'];
                }
            }
            $propertyArr = array_unique($propertyArr);
            $labelArr = array_diff($labelArr, $propertyArr);
            foreach ($propertyArr as $key => $val) {
                $nodeZString = $new_property_array[$key]['nodex'];
                $nodeZArr = explode(',', $nodeZString);

                if (count($nodeZArr) == 3) {
                    unset($propertyArr[$key]);
                }
            }

            //Create default structure for the Class level.
            $classInsArr = explode(',', $postArray['class_node_x_y'][0]);
            $classInsConfigArr = $config['constants']['NODE_Z_GROUPING_CLASSES'];
            $nodeZClassArr = array_diff($classInsArr, $classInsConfigArr);
            $_SESSION['parent_class'] = $postArray['parent_class'];
            if (count($nodeZClassArr) < 2) {
                $nodeZClassArr = array_filter($nodeZClassArr, create_function('$a', 'return $a!=="";'));
                $filledClasses = array();
                
                if (count($nodeZClassArr) > 0) {
                    foreach ($nodeZClassArr as $keyVal) {
                        $classId = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $keyVal, 'node_class_id');
                        $classNodeId = $this->getClassesTable()->getNodeClassId($classId);
                        $filledClasses[] = $classNodeId[0]['node_id'];
                    }
                }

                $TBFilledClassesArray = array(); // Create Array for not filled Node Z classes.
                $classInstanceIdArr = array();  // Resultant array where key is Class Id and value as the node id.
                $TBFilledClassesArray = array_diff($classInsConfigArr, $filledClasses);  // This array to store instance data.
                
                if (count($TBFilledClassesArray) > 0) {
                    $classInstanceIdArr = $this->getNodeDefaultInstanceIdForZclassesAction($TBFilledClassesArray);
                }
                //Filling the default array values after creating the instances and the instance_property to match the original array(filled with all information).
                $postArray['class_node_y_z'][0] = $postArray['class_node_y_z'][0] . "," . implode(",", $classInstanceIdArr);
                $postArray['class_node_x_y'][0] = $postArray['class_node_x_y'][0] . "," . $postArray['class_node_y_z'][0];
                $postArray['class_z_main'][0] = $postArray['class_z_main'][0] . "," . implode(",", array_keys($classInstanceIdArr));
            }
            // End creating default structure for Class Level.
            // Start filling the default set of values to Grouping.Properties only those are not filled.
            foreach ($propertyArr as $key => $val) {
                $id = $this->searchForId($val, 'id', $new_property_array);    // search for id in multi-dimensional array.
                $nodeZstr = $new_property_array[$id]['nodex'] . "</br>";
                $nodeZArray = array();
                $classInstanceIdArr = array();
                $nodeZArray = explode(',', trim($nodeZstr));

                $nodeZArray = filter_var_array($nodeZArray, FILTER_SANITIZE_NUMBER_INT); // used to filter the array values coz we get garbage content.
                $nodeZArray = array_filter($nodeZArray, create_function('$a', 'return trim($a)!=="";')); // use to remove the blank keys.

                $nodeZArray = array_diff($nodeZArray, $config['constants']['NODE_Z_CLASSES']);

                $filledClasses = array();
                if (count($nodeZArray) == 0) {
                    $filledClasses[] = "28048";
                }
                if (count($filledClasses) > 0) {
                    // print_r($filledClasses);
                    // Used to assign the default set of values. instances and instance_property.
                    $classInstanceIdArr = $this->getNodeDefaultInstanceIdForZclassesAction($filledClasses);
                    $nodeZstr = str_replace("</br>", " ", $nodeZstr);
                    $new_property_array[$id]['nodex'] = $nodeZstr . "," . implode(",", $classInstanceIdArr);  // To create the instance array.
                }

                $postArray['node_x_y'][$id] = $new_property_array[$id]['nodex'];
                $postArray['node_y_z'][$id] = $postArray['node_y_z'][$id] . "," . implode(",", $classInstanceIdArr);
                $postArray['prop_z_main'][$id] = $postArray['prop_z_main'][$id] . "," . implode(",", array_keys($classInstanceIdArr));
            }
            // End filling the default set of values to Grouping.Properties only those are not filled.
            //Label array to iterate over to get the instance id.
            foreach ($labelArr as $key => $val) {
                $id = $this->searchForId($val, 'id', $new_property_array);    // search for id in multi-dimensional array.
                $nodeZstr = $new_property_array[$id]['nodex'];
                $nodeZArray = array();
                $nodeZArray = explode(',', rtrim($nodeZstr));
                $nodeZArray = filter_var_array($nodeZArray, FILTER_SANITIZE_NUMBER_INT);
                $nodeZArray = array_diff($nodeZArray, $config['constants']['NODE_Z_CLASSES']);
                $nodeZArray = array_filter($nodeZArray, create_function('$a', 'return $a!=="";'));
                $filledClasses = array();
                if (count($nodeZArray) > 0) {
                    foreach ($nodeZArray as $keyVal) {
                        $classId = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $keyVal, 'node_class_id');
                        $classNodeId = $this->getClassesTable()->getNodeClassId($classId);
                        $filledClasses[] = $classNodeId[0]['node_id'];
                    }
                }

                $TBFilledClassesArray = array();
                $classInstanceIdArr = array();
                $TBFilledClassesArray = array_diff($config['constants']['NODE_Z_CLASSES'], $filledClasses);  // This array to store instance data.

                if (count($TBFilledClassesArray) > 0) {
                    $classInstanceIdArr = $this->getNodeDefaultInstanceIdForZclassesAction($TBFilledClassesArray);
                }
                $new_property_array[$id]['nodex'] = $nodeZstr . "," . implode(",", $classInstanceIdArr);
                $postArray['node_x_y'][$id] = $nodeZstr . "," . implode(",", $classInstanceIdArr);
                $postArray['node_y_z'][$id] = $postArray['node_y_z'][$id] . "," . implode(",", $classInstanceIdArr);
                $postArray['prop_z_main'][$id] = $postArray['prop_z_main'][$id] . "," . implode(",", array_keys($classInstanceIdArr));
            }
            // }
            // End Shanti Code

            $node_type_id = $postArray['node_type_id'];
            $node_y_class_id = $postArray['node_y_class_id'];
            $child_ids_of_class = $postArray['child_ids_of_class'];
            $class_caption = $postArray['class_caption'];

            $common_name = $postArray['common_name'];
            $version_type = $postArray['version_type'];
            $add_new_sub_class = $postArray['add_new_sub_class'];

            $remove_prop_ids = explode(',', $postArray['remove_prop_ids']);

            // delete old property of the class //
            $this->getClassesTable()->deleteClassProperty($remove_prop_ids);
            
            $dataSavingType = 'New';
            if ($postArray['node_y_class_id'] != '') {
                $dataSavingType = 'Update';
            }
            if( $version_type=="") $version_type="2";
            // create new class //
            if (trim($class_caption) != '')
                $node_y_class_id = $this->getClassesTable()->createClass($class_caption, $common_name, $node_type_id, $saveType, $node_y_class_id, $version_type);

            if (intval($node_y_class_id) > 0) {
                if ($add_new_sub_class != '') {    // null
                    $new_class_id = $this->getClassesTable()->createClass($add_new_sub_class, $add_new_sub_class, 2);
                    $new_class_id1 = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $new_class_id);
                    $child_ids_of_class = $child_ids_of_class . "," . $new_class_id1;
                }

                // insert the record of child classes
                $node_id_of_class = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                $this->getClassesTable()->createClassChild($node_id_of_class, $child_ids_of_class);

                //$new_property_array = json_decode($post['propertyJson'], true);
                // create new class property //
                $this->getClassesTable()->createClassProperty($new_property_array, $node_y_class_id, $node_type_id);

                if (isset($postArray['class_node_x_y'])) {
                    $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                    $this->getClassesTable()->saveNodeX($node_id, current($postArray['class_node_x_y']));  // parent, child_ids
                }

                $this->getClassesTable()->getVersionOfClass($node_y_class_id);

                /* Get Class Structure */
                /* Start Code By Arvind Soni For Caching */
                $this->deleteCacheFile("class_structure_display_" . $node_y_class_id);
                $this->deleteCacheFile("class_builder_" . $node_y_class_id);
                $this->deleteCacheFile("class_structure_edit_" . $node_y_class_id);
                $this->deleteCacheFile("sub_class_structure_" . $node_y_class_id);
                $this->deleteCacheFile("class_list_no-pagination");
                /* End Code By Arvind Soni For Caching */

                if ($mode == 'normal')
                    $mode = 'Display';
                else
                    $mode = 'Edit';

                $classArray = $this->getClassesTable()->getClassList($node_y_class_id);
                $data = $this->getClassesTable()->getClassChildStructureWithSequence($mode, $classArray, $node_y_class_id);
                $classArray['childs'] = $data['ids'];
                $classArray['childsArray'] = $data['data'];
                $classArray['number_print'] = $data['number_print'];
                $classArray['taxonomy_data'] = $data['taxonomy_data'];
                $classArray['instances'] = $this->getClassesTable()->getClassStructure($node_y_class_id);

                $desendent = $this->getClassesTable()->getDesendent($node_y_class_id);

                /* Get Discendant Type Value OF Class */
                if (trim($desendent) != '')
                    $classArray['discendant'] = $desendent;
                else
                    $classArray['discendant'] = 'Instance';

                $nodeType = $this->getClassesTable()->getNodeType($classArray['node_type_id']);
                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                $countSubChild = $this->getClassesTable()->checkIsSubClass($node_id);
                $nodedetails = $this->getClassesTable()->nodeTypes();

                $nodeXY = $this->getClassesTable()->fetchNodeXY($classArray['node_id']);
                $nodeZ = $this->getClassesTable()->fetchNodeYZ($classArray['node_id']);
                $nodeZMain = $this->getClassesTable()->fetchNodeZ($nodeZ);
            }

            $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');

            /* Start Code By Arvind Soni For Mapping */
            if ($dataSavingType == 'Update') {
                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                $mappingInsArray = $this->getClassesTable()->getInstanceListOfParticulerClass(MAPPING_API_CLASS_ID, 'class', 'node_instance_id');

                $allInsIdsArray = array();
                if (count($mappingInsArray) > 0) {
                    foreach ($mappingInsArray as $node_instance_id => $instanceArray) {
                        if (intval($instanceArray['Target Class NID']) == intval($node_id)) {
                            $allInsIdsArray[] = $node_instance_id;
                        }
                    }
                }

                if (count($allInsIdsArray) > 0) {
                    //echo "<pre>";
                    $classPropArray = $this->getClassesTable()->getAllClassPropertyStructure($node_y_class_id);
                    $classValArray = array_values($classPropArray);
                    $classKeyArray = array_keys($classPropArray);

                    foreach ($allInsIdsArray as $key => $node_instance_id) {
                        $node_y_id = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id);
                        $node_x_ids = $this->getClassesTable()->getNodeXOfParticulerClass($node_y_id, 'node_y_id', 'node_x_id', SUB_MAPPING_CLASS_ID);

                        $instanceProArray = array();
                        $instanceKeyArray = array();
                        $instanceValArray = array();
                        foreach ($node_x_ids as $k => $v) {
                            $tempArray = current($this->getClassesTable()->getInstanceListOfParticulerClass($v['node_x_id'], 'node', 'node_id'));
                            $instanceProArray[$v['node_x_id']]['property_id'] = $tempArray['Target Property Id'];
                            $instanceProArray[$v['node_x_id']]['property_name'] = $tempArray['Target Property Name'];
                            $instanceKeyArray[$v['node_x_id']] = $tempArray['Target Property Id'];
                        }

                        /* For Update Property Name */
                        foreach ($classPropArray as $property_id => $property_name) {
                            $changeInstanceNodeId = '';
                            foreach ($instanceProArray as $node_id => $fieldArray) {
                                if (($fieldArray['property_id'] == $property_id) && (trim($fieldArray['property_name']) != trim($property_name))) {
                                    $changeInstanceNodeId = $node_id;
                                }
                            }

                            if ($changeInstanceNodeId != '') {
                                $this->getClassesTable()->commonUpdateMethod($changeInstanceNodeId, TARGET_PROPERTY_NAME, $property_name);
                            }
                        }

                        /* For Delete Mapping Instance */
                        foreach ($instanceProArray as $node_id => $fieldArray) {
                            $changeInstanceNodeId = '';
                            if (!in_array(intval($fieldArray['property_id']), $classKeyArray)) {
                                $changeInstanceNodeId = $node_id;
                            }

                            if ($changeInstanceNodeId != '') {
                                $this->getClassesTable()->commonUpdateMethod($changeInstanceNodeId, OBSELETE_PROPERTY_ID, 'Yes');
                            }
                        }

                        /* For Add New Mapping Instance */
                        $addNewInstanceArray = array();
                        $index = 0;
                        foreach ($classKeyArray as $key => $property_id) {
                            if (!in_array($property_id, array_values($instanceKeyArray))) {
                                $isMappingPopup = 'Y';
                                $new_node_instance_id = $this->getClassesTable()->createInstance('', SUB_MAPPING_CLASS_ID, '2', 'P');
                                if (intval($node_instance_id) > 0) {
                                    $instance_property_id = array(TARGET_PROPERTY_ID, TARGET_PROPERTY_NAME, OBSELETE_PROPERTY_ID);
                                    $instance_property_caption = array($property_id, $classPropArray[$property_id], 'No');
                                    $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $new_node_instance_id, '2');
                                    $new_node_x_id = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $new_node_instance_id);
                                    $this->getClassesTable()->saveNodeX($node_y_id, $new_node_x_id);
                                }
                            }
                        }
                    }
                }
            }
            /* End Code By Arvind Soni For Mapping */
        }
        

        // Check instance of this class in view if have then sow popup depends upon condition
        if ($post['saveType'] == 'P') {
            $_popupMsg = $this->getViewInstanceIds($node_y_class_id);
        }

        $config = $this->getServiceLocator()->get('config');
        $configArr = array();
        $configArr['NODE_Z_GROUPING_CLASSES'] = $config['constants']['NODE_Z_GROUPING_CLASSES'];
        $configArr['NODE_Z_CLASSES'] = $config['constants']['NODE_Z_CLASSES'];
        $view = new ViewModel(array('classArray' => $classArray,
            'mode' => $mode,
            'nodeType' => $nodeType,
            'countSubChild' => $countSubChild,
            'nodedetails' => $nodedetails,
            'nodeXY' => $nodeXY,
            'nodeZ' => $nodeZ,
            'nodeZMain' => $nodeZMain,
            'isMappingPopup' => $isMappingPopup,
            'config' => $configArr,
            'popupMsg' => $_popupMsg,
        ));


        return $view;
    }

    function getViewInstanceIds($classId = '') {
        $_nodeId = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $classId, 'node_id');
        $_arr = $this->getClassesTable()->getViewInstanceIds($_nodeId);
        $_count = count($_arr);
        if ($_count > 1) {
            $_nid = '<ul><li>' . implode('<li>', array_column($_arr, 'node_id')) . '</ul>';
            return array(
                'popText' => '<p>This class has more than one VIEW instance:</p>' . $_nid . '<p>We suggest you to manually publish those instances.</p>',
                'popType' => 'information',
            );
        } else if ($_count == 1) {
            $_value = $this->getClassesTable()->getPropertyValue($_arr[0]['node_instance_id'], 2949)[0]['value'];
            if (is_numeric($_value)) {
                return array(
                    'popText' => '<p>This class has an instance of VIEW class. Please confirm if you want to publish the related View class instance too?</p>',
                    'popType' => 'confirmation',
                    'view_instance_id' => $_arr[0]['node_instance_id'],
                    'view_instance_node_id' => $_arr[0]['node_id'],
                    'class_node_id' => $_nodeId,
                );
            } else {
                return array(
                    'popText' => '<p>This class has an instance of VIEW class where you have used custom HTML layout. We suggest you to manually publish the instance.</p>',
                    'popType' => 'information',
                );
            }
        } else {
            return array();
        }
    }

    /* code started for version class created by awdhesh soni */

    public function getChildOfOldClass($data) {
        $propertyArray = array();

        foreach ($data as $k => $value) {
            $tempArray = array();
            $newTempArr = array();
            $tempArray['caption'] = $value['caption'];
            $tempArray['sequence'] = $value['sequence'];
            $tempArray['encrypt_status'] = $value['encrypt_status'];
            $tempArray['node_type_id'] = $value['node_type_id'];
            $tempArray['nodeClassYId'] = $value['nodeClassYId'];
            $tempArray['nodeY'] = $value['nodeY'];

            foreach ($value['nodeZStructure'] as $zkey => $zvalue) {

                $newTempArr['node_class_id'] = $zvalue[0]['node_class_id'];
                $newTempArr['node_class_property_id'] = $zvalue[0]['node_class_property_id'];
                $newTempArr['value'] = $zvalue[0]['value'];
                $newTempArr['node_type_id'] = $zvalue[0]['node_type_id'];
                $tempArray['nodeZ'][$zkey] = $newTempArr;
            }

            if (is_array($value['child']))
                $tempArray['child'] = $this->getChildOfOldClass($value['child']);

            $propertyArray[] = $tempArray;
        }

        return $propertyArray;
    }

    public function getDataForNewVersionOfClass($oldClassArray) {
        $classArray = array();
        $classArray['saveType'] = "D";
        $classArray['class_caption'] = "";
        $classArray['node_y_class_id'] = '';
        $classArray['common_name'] = $oldClassArray['caption'];
        $classArray['node_type_id'] = $oldClassArray['node_type_id'];
        $propertyArray = array();
        $tempArray = array();
        $newTempArr = array();

        foreach ($oldClassArray['instances'][0]['property'] as $key => $value) {
            $tempArray['caption'] = $value['caption'];
            $tempArray['sequence'] = $value['sequence'];
            $tempArray['encrypt_status'] = $value['encrypt_status'];
            $tempArray['node_type_id'] = $value['node_type_id'];

            foreach ($value['nodeZStructure'] as $zkey => $zvalue) {

                $newTempArr['node_class_id'] = $zvalue[0]['node_class_id'];
                $newTempArr['node_class_property_id'] = $zvalue[0]['node_class_property_id'];
                $newTempArr['value'] = $zvalue[0]['value'];
                $newTempArr['node_type_id'] = $zvalue[0]['node_type_id'];
                $tempArray['nodeZ'][$zkey] = $newTempArr;
            }

            if (is_array($value['child']))
                $tempArray['child'] = $this->getChildOfOldClass($value['child']);

            $propertyArray[] = $tempArray;
        }

        $classArray['property'] = $propertyArray;

        return $classArray;
    }

    public function saveClassValue($oldClassArray, $parentId, $nodeZMain, $vertype, $majorVersion) {

        $node_id = $oldClassArray['node_id'];
        $nodeExId = explode(",", $oldClassArray['instances'][0]['version'][$node_id]['nodeClassId']);
        $node_class_id = $oldClassArray['node_class_id'];
        $node_type_id = $oldClassArray['instances'][0]['version'][$node_id]['nodeVesionStructure']['TAXONOMY'][0]['node_type_id'];
        $saveType = "D";
        $node_class_node_id = $oldClassArray['instances'][0]['version'][$node_id]['nodeClassId'];

        $i = 0;
        $newString = '';

        foreach ($oldClassArray['instances'][0]['version'][$node_id]['nodeVesionStructure'] as $key => $value) {

            $instance_property_id = array();
            $instance_property_caption = array();

            $node_instance_id = "";

            $node_instance_id = $this->getClassesTable()->createInstanceVersion($instance_caption, $value[$i]['node_class_id'], $node_type_id, $saveType, $node_instance_id, $value[$i]['node_class_id'], $node_class_node_id);

            $newnodeId = $this->getClassesTable()->getInstanceNodeId($node_instance_id);

            $newString.= $newnodeId . ',';



            for ($k = 0; $k < count($value); $k++) {

                $instance_property_id[$value[$k]['node_class_property_id']] = $value[$k]['node_class_property_id'];

                if ($key == "VERSION") {
                    // check here for version type minority and mazority
                    $versiontype = $vertype;
                    $explodeV = explode(".", trim($value[$k]['value']));

                    $getMaxVersion = $this->getClassesTable()->getNodeXYMaxVersion($classNodeId, $newVValue);

                    if ($versiontype == "major") {

                        $newVValue = intval($majorVersion);
                        $versionVal = intval($majorVersion);
                    } else {
                        if (empty($explodeV[0])) {

                            $newVValue = intval($value[$k]['value']);
                        } else {

                            $newVValue = intval($explodeV[0]);
                        }
                        $versionVal = trim($value[$k]['value']);
                    }

                    $checkVarsion = $this->getClassesTable()->getNodeXVersion($node_id, $newVValue);

                    $this->getClassesTable()->saveNodeXVersion($parentId, $node_id, $newVValue);

                    $decPart = '';

                    if (count($checkVarsion) > 0) {
                        if ($versiontype == "major") {
                            $Newversion = $versionVal;
                        } else {
                            $decPart = count($checkVarsion) + 1;
                            $Newversion = $versionVal . "." . $decPart;
                        }
                    } else {
                        if ($versiontype == "major") {
                            $Newversion = $versionVal;
                        } else {
                            $decPart = 1;

                            $Newversion = $versionVal . "." . $decPart;
                        }
                    }



                    $latestVersion = $Newversion;
                } else {

                    $latestVersion = $value[$k]['value'];
                }

                $instance_property_caption[$value[$k]['node_class_property_id']] = trim($latestVersion);
            }

            $node_type_id = 3;

            $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id);
        }

        $newString1 = $node_class_node_id . ',' . $newString;

        $this->getClassesTable()->saveNodeX($parentId, $newString1);
    }

    public function versionHistoryAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $getAllVersion = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $classNodeId = $this->getClassesTable()->getClassNodeId($post['class_id']);

            $currentVersion = $post['version'];

            $explodeV = explode(".", trim($currentVersion));

            $decPart = '';

            if (empty($explodeV[0])) {

                $newVValue = $currentVersion;
            } else {
                $newVValue = $explodeV[0];
            }

            $mergeArr = array();

            $versionnodeIdY = $this->getClassesTable()->getNodeYrecursive($classNodeId, $mergeArr);

            $getAllVersion = $this->getClassesTable()->getAllVersion($versionnodeIdY['my']);
        }

        return new ViewModel(array('versionArray' => $getAllVersion));
    }

    /* function here to fetch class structute bases of version */

    public function versionClassStructureAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        $json = array();
        if ($request->isPost()) {

            $post = $request->getPost()->toArray();
            $vertype = $post['vertype'];
            $majorVersion = $post['majorVersion'];

            $mode = $post['mode'];
            $allnode_id = $post['node_id'];
            $classArray = $this->getClassesTable()->getClassList($post['class_id']);
            //$data                       =   $this->getClassesTable()->getClassChild($post['class_id']);
            $data = $this->getClassesTable()->getClassChildStructureWithSequence($mode, $classArray, $post['class_id']);
            $classArray['childs'] = $data['ids'];
            $classArray['childsArray'] = $data['data'];
            $classArray['number_print'] = $data['number_print'];
            /* $nodeType                   =   $this->getClassesTable()->getNodeType($classArray['node_type_id']); */
            $classArray['instances'] = $this->getClassesTable()->getClassStructureForVersion($post['class_id']);
            $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);
        }

        $newClassArray = $this->getDataForNewVersionOfClass($classArray);

        /* use code here to save the class for version */
        $node_y_class_id = "";
        if (trim($newClassArray['common_name']) != '')
            $node_y_class_id = $this->getClassesTable()->createClass($class_caption, $newClassArray['common_name'], $newClassArray['node_type_id'], $newClassArray['saveType'], $node_y_class_id);

        $this->getClassesTable()->updateVersionOfClass($node_y_class_id, $majorVersion);

        /* use code here to save the class for version */
        $this->getClassesTable()->createnodeInstancePropertyVersion($newClassArray['property'], $node_y_class_id);

        $parentId = $this->getClassesTable()->getClassNodeId($node_y_class_id);

        $this->getClassesTable()->createClassChild($parentId, $classArray['childs']);
        /* code here to save node instance and node instance property for class */
        $saveNodeClasss = $this->saveClassValue($classArray, $parentId, $nodeZMain, $vertype, $majorVersion);

        /* end code here */
        $json['node_y_class_id'] = $node_y_class_id;
        print json_encode($json);
        exit();
    }

    public function checkVersionValAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $classNodeId = $this->getClassesTable()->getClassNodeId($post['class_id']);

            $currentVersion = $post['version'];

            $explodeV = explode(".", trim($currentVersion));

            $decPart = '';

            if (empty($explodeV[0])) {

                $newVValue = $currentVersion;
            } else {
                $newVValue = $explodeV[0];
            }

            $mergeArr = array();


            $versionnodeIdY = $this->getClassesTable()->getNodeYrecursive($classNodeId, $mergeArr);

            //$getAllVersion  =  $this->getClassesTable()->getAllVersion($versionnodeIdY['my']);

            $getMaxVersion = max($versionnodeIdY['version']);

            $checkVarsion = $this->getClassesTable()->getNodeXVersion($classNodeId, $newVValue);


            if (intval($getMaxVersion) > intval($newVValue)) {

                $getMaxVersion = $getMaxVersion;
            } else {
                $getMaxVersion = $newVValue;
            }

            if (count($checkVarsion) > 0) {
                $decPart = count($checkVarsion) + 1;
            } else {
                $decPart = 1;
            }

            $Newversion = $versionVal . "." . $decPart;
            $latestVersion = trim($currentVersion) . $Newversion;
        }

        $json['node_y_class_id'] = $node_y_class_id;
        $json['nextVersion'] = $currentVersion . '.';
        $json['nextVersion2'] = $decPart;
        $json['majorVersion'] = intval($getMaxVersion) + 1;

        print json_encode($json);
        exit();
    }

    /* end version code here */

    /* Start Code By Arvind Soni For instanceClass */

    public function getChildOfInstanceClass($data) {
        $propertyArray = array();
        foreach ($data as $key => $value) {
            $tempArray = array();
            $tempArray['caption'] = $value['caption'];
            $tempArray['sequence'] = $value['sequence'];
            $tempArray['encrypt_status'] = $value['encrypt_status'];
            $tempArray['node_type_id'] = $value['node_type_id'];

            $nodeZArray = array();
            foreach ($value['nodeZStructure'] as $zkey => $zvalue) {
                $nodeZArray1 = array();
                $nodeZArray1['node_class_id'] = $zvalue[0]['node_class_id'];
                $nodeZArray1['node_type_id'] = $zvalue[0]['node_type_id'];
                $nodeZArray1['encrypt_status'] = $zvalue[0]['encrypt_status'];
                $nodeZArray1['status'] = $zvalue[0]['status'];

                foreach ($zvalue as $k => $v) {
                    $t['node_class_property_id'] = $v['node_class_property_id'];
                    $t['value'] = $v['value'];

                    $nodeZArray1['property'][] = $t;
                }

                $nodeZArray[$zkey] = $nodeZArray1;
            }

            foreach ($value['nodeXStructure'] as $zkey => $zvalue) {
                $nodeZArray1 = array();
                $nodeZArray1['node_class_id'] = $zvalue[0]['node_class_id'];
                $nodeZArray1['node_type_id'] = $zvalue[0]['node_type_id'];
                $nodeZArray1['encrypt_status'] = $zvalue[0]['encrypt_status'];
                $nodeZArray1['status'] = $zvalue[0]['status'];

                foreach ($zvalue as $k => $v) {
                    $t['node_class_property_id'] = $v['node_class_property_id'];
                    $t['value'] = $v['value'];

                    $nodeZArray1['property'][] = $t;
                }

                $nodeZArray[$zkey] = $nodeZArray1;
            }

            $tempArray['nodeZ'] = $nodeZArray;

            if (is_array($value['child']))
                $tempArray['child'] = $this->getChildOfInstanceClass($value['child']);

            $propertyArray[] = $tempArray;
        }

        return $propertyArray;
    }

    public function getDataForInstanceClass($oldClassArray, $className) {
        $classArray = array();
        $classArray['class_caption'] = "";
        $classArray['node_y_class_id'] = '';
        $classArray['common_name'] = '.' . $oldClassArray['caption'];
        /* Replace the name from class name */
        $pattern = '/(?![.])(.+)/';
        $classArray['common_name'] = preg_replace($pattern, $className, $classArray['common_name']);
        $classArray['node_type_id'] = $oldClassArray['node_type_id'];
        $nodeZArray = array();

        /* Get Class Node Z Array */
        foreach ($oldClassArray['instances'][0]['version'] as $key => $value) {
            foreach ($value['nodeVesionStructure'] as $k => $v) {
                $tempArray = array();
                $tempArray['node_class_id'] = $v[0]['node_class_id'];
                $tempArray['node_type_id'] = $v[0]['node_type_id'];
                $tempArray['encrypt_status'] = $v[0]['encrypt_status'];
                $tempArray['status'] = $v[0]['status'];
                foreach ($v as $kk => $vv) {
                    $t['node_class_property_id'] = $vv['node_class_property_id'];

                    if (intval($vv['node_class_property_id']) == 804)
                        $t['value'] = '1';
                    else if (intval($vv['node_class_property_id']) == 1672) {
                        $t['value'] = '.' . $vv['value'];
                        $t['value'] = preg_replace($pattern, $className, $t['value']);
                    } else
                        $t['value'] = $vv['value'];

                    $tempArray['property'][] = $t;
                }

                $nodeZArray[$k] = $tempArray;
            }
        }

        $classArray['nodeZ'] = $nodeZArray;

        /* Get Class Properties And Node Z */
        $propertyArray = array();
        foreach ($oldClassArray['instances'][0]['property'] as $key => $value) {
            $tempArray = array();
            $tempArray['caption'] = $value['caption'];
            $tempArray['sequence'] = $value['sequence'];
            $tempArray['encrypt_status'] = $value['encrypt_status'];
            $tempArray['node_type_id'] = $value['node_type_id'];

            $nodeZArray = array();
            foreach ($value['nodeZStructure'] as $zkey => $zvalue) {
                $nodeZArray1 = array();
                $nodeZArray1['node_class_id'] = $zvalue[0]['node_class_id'];
                $nodeZArray1['node_type_id'] = $zvalue[0]['node_type_id'];
                $nodeZArray1['encrypt_status'] = $zvalue[0]['encrypt_status'];
                $nodeZArray1['status'] = $zvalue[0]['status'];

                foreach ($zvalue as $k => $v) {
                    $t['node_class_property_id'] = $v['node_class_property_id'];
                    $t['value'] = $v['value'];

                    $nodeZArray1['property'][] = $t;
                }

                $nodeZArray[$zkey] = $nodeZArray1;
            }

            foreach ($value['nodeXStructure'] as $zkey => $zvalue) {
                $nodeZArray1 = array();
                $nodeZArray1['node_class_id'] = $zvalue[0]['node_class_id'];
                $nodeZArray1['node_type_id'] = $zvalue[0]['node_type_id'];
                $nodeZArray1['encrypt_status'] = $zvalue[0]['encrypt_status'];
                $nodeZArray1['status'] = $zvalue[0]['status'];

                foreach ($zvalue as $k => $v) {
                    $t['node_class_property_id'] = $v['node_class_property_id'];
                    $t['value'] = $v['value'];

                    $nodeZArray1['property'][] = $t;
                }

                $nodeZArray[$zkey] = $nodeZArray1;
            }

            $tempArray['nodeZ'] = $nodeZArray;

            if (is_array($value['child']))
                $tempArray['child'] = $this->getChildOfInstanceClass($value['child']);

            $propertyArray[] = $tempArray;
        }

        $classArray['property'] = $propertyArray;

        return $classArray;
    }

    public function setDataForInstanceClassProp($childArray) {
        foreach ($childArray as $key => $value) {
            $propNodeXValues = '';
            $propNodeZValues = '';
            foreach ($value['nodeZ'] as $k_key => $v_value) {
                if (intval($v_value['node_class_id']) != 165) {
                    /* Create Instance Of Class */
                    $node_instance_id = $this->getClassesTable()->createInstanceOfInstanceClass($v_value['node_class_id'], $v_value['node_type_id']);
                    /* Set Instance Property Value */
                    foreach ($v_value['property'] as $k => $v) {
                        $this->getClassesTable()->createInstancePropertyOfInstanceClass($node_instance_id['node_instance_id'], $v['node_class_property_id'], $v['value'], $v_value['node_type_id']);
                    }

                    $propNodeZValues .= $node_instance_id['node_id'] . ",";
                    $propNodeXValues .= $node_instance_id['node_id'] . ",";
                }

                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $v_value['node_class_id']);
                $propNodeXValues .= $node_id . ",";
            }
            $childArray[$key]['nodeZ'] = $propNodeZValues;
            $childArray[$key]['nodeX'] = $propNodeXValues;

            if (is_array($value['child']))
                $childArray[$key]['child'] = $this->setDataForInstanceClassProp($value['child']);
        }

        return $childArray;
    }

    public function setDataForInstanceClass($classArray) {
        $classNodeXValues = '';
        $classNodeZValues = '';
        foreach ($classArray['nodeZ'] as $key => $value) {
            if (intval($value['node_class_id']) != 165) {
                /* Create Instance Of Class */
                $node_instance_id = $this->getClassesTable()->createInstanceOfInstanceClass($value['node_class_id'], $value['node_type_id']);
                /* Set Instance Property Value */
                foreach ($value['property'] as $k => $v) {
                    $this->getClassesTable()->createInstancePropertyOfInstanceClass($node_instance_id['node_instance_id'], $v['node_class_property_id'], $v['value'], $value['node_type_id']);
                }

                $classNodeZValues .= $node_instance_id['node_id'] . ",";
                $classNodeXValues .= $node_instance_id['node_id'] . ",";
            }

            $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $value['node_class_id']);
            $classNodeXValues .= $node_id . ",";
        }
        $classArray['nodeX'] = $classNodeXValues;
        $classArray['nodeZ'] = $classNodeZValues;

        foreach ($classArray['property'] as $key => $value) {
            $propNodeXValues = '';
            $propNodeZValues = '';
            foreach ($value['nodeZ'] as $k_key => $v_value) {
                if (intval($v_value['node_class_id']) != 165) {
                    /* Create Instance Of Class */
                    $node_instance_id = $this->getClassesTable()->createInstanceOfInstanceClass($v_value['node_class_id'], $v_value['node_type_id']);
                    /* Set Instance Property Value */
                    foreach ($v_value['property'] as $k => $v) {
                        $this->getClassesTable()->createInstancePropertyOfInstanceClass($node_instance_id['node_instance_id'], $v['node_class_property_id'], $v['value'], $v_value['node_type_id']);
                    }

                    $propNodeZValues .= $node_instance_id['node_id'] . ",";
                    $propNodeXValues .= $node_instance_id['node_id'] . ",";
                }

                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $v_value['node_class_id']);
                $propNodeXValues .= $node_id . ",";
            }

            $classArray['property'][$key]['nodeX'] = $propNodeXValues;
            $classArray['property'][$key]['nodeZ'] = $propNodeZValues;

            if (is_array($value['child']))
                $classArray['property'][$key]['child'] = $this->setDataForInstanceClassProp($value['child']);
        }

        return $classArray;
    }

    public function instanceClassNewAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $className = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $className = $post['class_name'];
            $classArray = $this->getClassesTable()->getClassList($post['class_id']);
            $data = $this->getClassesTable()->getClassChildStructureWithSequence('Display', $classArray, $post['class_id']);
            $classArray['childs'] = $data['ids'];
            $classArray['childsArray'] = $data['data'];
            $classArray['number_print'] = $data['number_print'];
            $classArray['instances'] = $this->getClassesTable()->getClassStructure($post['class_id']);
        
            
        }
        /* For Get Data From Array */
        $newClassArray = $this->getDataForInstanceClass($classArray, $className);
        
        //print_r(array($classArray,$data,$newClassArray));die;
        
        /* For Set Data From Array */
        $setClassArray = $this->setDataForInstanceClass($newClassArray);
        $setClassArray['childs'] = $classArray['childs'];
        $setClassArray['childsArray'] = $classArray['childsArray'];
        $setClassArray['number_print'] = $classArray['number_print'];
        
        //Get node id of current class
        $setClassArray['curClassNID'] = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id'], 'node_id');

        $lastNum = $this->getClassesTable()->getLastNumber('node-class', 'node_class_id');
        $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');
        
        return new ViewModel(array('classArray' => $setClassArray, 'lastNum' => $lastNum, 'newNodeId' => $newNodeId));
    }

    /* End Code By Arvind Soni For instanceClass */

    /**
     * Created By Amit Malakar
     * Recursive class property structure
     * @param $childArray
     * @return mixed
     */
    private function getPrintStructure($childArray) {
        $i = 0;
        // VIEW BUILDER PLUGIN
        $viewBuilder = $this->ViewBuilder();
        $viewBuilder->setModal($this->getClassesTable());
        foreach ($childArray as $chArr) {
            $childArray[$i]['instances'] = $viewBuilder->getHtmlClassStructure($chArr['node_class_id']);
            $childArray[$i]['nodeZ'] = $viewBuilder->getnodeZInstances($htmlNClassId['node_class_id']);
            $data = $this->getClassesTable()->getClassChild($chArr['node_class_id']);
            $childArray[$i]['childs'] = $data['ids'];

            if (count($data['data'])) {
                $childArray[$i]['childsArray'] = $this->getPrintStructure($data['data']);
            }
            $i++;
        }

        return $childArray;
    }

    /**
     * Created By Amit Malakar
     * TCPDF to generate PDF
     * @return ViewModel
     */
    public function getPdfAction() {

        $post = $request->getPost()->toArray();
        echo '<pre>';
        print_r($post);
        die();
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            //error_reporting(E_ALL);
            $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
            // set document information
            $pdf->SetCreator(PDF_CREATOR);
            $pdf->SetAuthor('Prospus Consulting Ltd.');
            $pdf->SetTitle('Prospus');
            $pdf->SetSubject('PDF Generation');
            $pdf->SetKeywords('Prospus, PDF, Report');

            $logo = BASE_URL . 'public/img/prospus-logo-100_88.jpg';
            //$pdf->SetHeaderData($logo, 100, '', '', array(0,64,255), array(0,64,128));
            //$pdf->setFooterData(array(0,64,0), array(0,64,128));
            // set margins
            $pdf->SetMargins(30, 20, 30);

            /* // set certificate file
              $certificate = 'file://data/cert/tcpdf.crt';

              // set additional information
              $info = array(
              'Name' => 'TCPDF',
              'Location' => 'Office',
              'Reason' => 'Testing TCPDF',
              'ContactInfo' => 'http://www.tcpdf.org',
              );
              // set document signature
              $pdf->setSignature($certificate, $certificate, 'tcpdfdemo', '', 2, $info); */
            $pdf->AddPage();

            // Set some content to print
            $html = $post['html'];

            // Print text using writeHTMLCell()
            $pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);


            /* // create content for signature (image and/or text)
              $pdf->Image('/opt/lampp/htdocs/PUI/public/img/digital_certificate.png', 180, 60, 15, 15, 'PNG');
              // define active area for signature appearance
              $pdf->setSignatureAppearance(180, 60, 15, 15);
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              // *** set an empty signature appearance ***
              $pdf->addEmptySignatureAppearance(180, 80, 15, 15); */

            $pdf->Output('/opt/lampp/htdocs/PUI/public/pdf/prospus.pdf', 'F');   // I - browser, F - save files
        }
    }

    /**
     * Created By Amit Malakar
     * WKHTMLTOPDF to generate PDF
     * @return ViewModel
     */
    public function getWkPdfAction() {
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            // URL TO CONVERT TO PDF
            //$url = 'http://stackoverflow.com/questions/22789618/digital-signing-of-pdf';
            // CSS LINK
            $cssLink = '<link href="' . BASE_URL . 'public/css/style.css" rel="stylesheet">';

            // HTML TO CONVERT TO PDF
            $htmlOutput = $cssLink . $post['html'];

            // PDF PATH
            $pdfFileName = 'wk_pdf.pdf';
            $pdfFilePath = ABSO_URL . 'public/pdf/' . $pdfFileName;
            $generatedPdfPath = BASE_URL . 'public/pdf/' . $pdfFileName;

            // IMAGE PATH
            /* $imgFileName = 'wk_image.jpg';
              $imgFilePath = ABSO_URL.'public/pdf/' . $imgFileName;
              $generatedImgPath = BASE_URL . 'public/pdf/' . $imgFileName; */

            // OPTIONS
            $options = array(
                'margin-top' => 25,
                'margin-bottom' => 25,
                'margin-left' => 20,
                'margin-right' => 20,
                'orientation' => 'portrait',
            );

            // GENERATE FROM HTML
            $this->serviceLocator->get('mvlabssnappy.pdf.service')->generateFromHtml($htmlOutput, $pdfFilePath, $options, true);
            //$this->serviceLocator->get('mvlabssnappy.image.service')->generateFromHtml($htmlOutput, $imgFilePath, array(), true);

            return $generatedPdfPath;
        }
    }

    /**
     * Created By Amit Malakar
     * Get Class structure for Print option
     * @return ViewModel
     */
    public function classStructurePrintAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];
            $classArray = $this->getClassesTable()->getClassList($post['class_id']);
            $data = $this->getClassesTable()->getClassChild($post['class_id']);
            $classArray['childs'] = $data['ids'];
            $classArray['childsArray'] = $data['data'];
            $nodeType = $this->getClassesTable()->getNodeType($classArray['node_type_id']);
            $classArray['instances'] = $this->getClassesTable()->getClassStructurePrint($post['class_id']);
            $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);
            $countSubChild = $this->getClassesTable()->checkIsSubClass($node_id);
            $nodedetails = $this->getClassesTable()->nodeTypes();
        }
        $nodeXY = $this->getClassesTable()->fetchNodeXY($node_id);
        $nodeZ = $this->getClassesTable()->fetchNodeYZ($node_id);
        $nodeZMain = $this->getClassesTable()->fetchNodeZ($nodeZ);

        $classArray['childsArray'] = $this->getPrintStructure($classArray['childsArray']);

        return new ViewModel(array('classArray' => $classArray,
            'mode' => $mode,
            'nodeType' => $nodeType,
            'countSubChild' => $countSubChild,
            'nodedetails' => $nodedetails,
            'nodeXY' => $nodeXY,
            'nodeZ' => $nodeZ,
            'nodeZMain' => $nodeZMain));
    }

    public function addNewClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $lastNum = $this->getClassesTable()->getLastNumber('node-class', 'node_class_id');
        $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');
        $nodeType = $this->getClassesTable()->nodeTypes();
        $config = $this->getServiceLocator()->get('config');
        $configArr = array();
        $configArr['NODE_Z_GROUPING_CLASSES'] = $config['constants']['NODE_Z_GROUPING_CLASSES'];
        $configArr['NODE_Z_CLASSES'] = $config['constants']['NODE_Z_CLASSES'];
        return new ViewModel(array('lastNum' => $lastNum, 'newNodeId' => $newNodeId, 'nodeType' => $nodeType, 'config' => $configArr));
    }

    public function deleteClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $delete_ids = explode(',', $post['delete_ids']);

            $node_y_class_id = $this->getClassesTable()->deleteClass($delete_ids);
        }
        exit;
    }

    public function getNewNodeNumberAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');
            $post = $request->getPost()->toArray();
            if ($post['class_id'] == "") {
                echo intval($newNodeId) + 1;
            } else {
                echo intval($newNodeId);
            }
        }
        exit();
    }

    /* ================ Start Instance ================= */

    public function getClassInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        /* Start Code By Arvind Soni For Caching */
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */

        $node_class_id = '';
        $order_by = '';
        $order = '';
        $page = 1;
        $filter_operator = '';
        $search_text = '';
        $defaultItemsPerPage = RECORD_PER_PGE;

        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if ($post['mode'] == 'Normal') {
                $display = 'Normal';
                $order_by = 'node_instance_id';
                $order = 'DESC';
                $page = 1;
                $node_class_id = $post['class_id'];
            }

            if ($post['mode'] == 'pagination') {
                $display = 'Ajax';
                $order_by = $post['order_by'];
                $order = $post['order'];
                $page = $post['page'];
                $node_class_id = $post['class_id'];
                if (intval($post['itemPerPage']) > 0)
                    $defaultItemsPerPage = $post['itemPerPage'];
            }

            if ($post['mode'] == 'no-pagination') {
                $display = 'no-pagination';
                $order_by = $post['order_by'];
                $order = $post['order'];
                $page = $post['page'];
                $node_class_id = $post['class_id'];
            }

            if ($post['filter_operator'] != '' && $post['search_text'] != '') {
                $filter_operator = $post['filter_operator'];
                $search_text = $post['search_text'];
                $filter_field = $post['filter_field'];
            }
        }

        /* Start Code By Arvind Soni For Caching */
        $instance_list_file_name = 'instance_list_' . $node_class_id . '_' . $display . "_" . $order_by . "_" . $order . "_" . $page . "_" . $filter_field . "_" . $search_text . "_" . $filter_operator . "_" . $defaultItemsPerPage;
        $instance_list_file_name = strtolower($instance_list_file_name);

        $cachedData = ''; //$manager->read($instance_list_file_name);
        if ($cachedData != "") {
            $instanceArray = $cachedData;
        } else {
            $instanceArray = $this->getClassesTable()->getInstanceListByPagination($order, $order_by, $display, $node_class_id, $filter_operator, $search_text, $filter_field);
            $manager->write($instance_list_file_name, $instanceArray);
        }
        /* End Code By Arvind Soni For Caching */

        if ($display == 'no-pagination') {
            return new ViewModel(array(
                'order_by' => $order_by,
                'order' => $order,
                'instanceArray' => $instanceArray,
                'display' => $display,
                'totalRecord' => count($instanceArray)
            ));
        } else {
            $itemsPerPage = $defaultItemsPerPage;
            $instanceArray->setCurrentPageNumber($page);
            $instanceArray->setItemCountPerPage($itemsPerPage);
            $instanceArray->setPageRange(3);
            $totalRecord = $instanceArray->getTotalItemCount();

            return new ViewModel(array(
                'order_by' => $order_by,
                'order' => $order,
                'page' => $page,
                'instanceArray' => $instanceArray,
                'display' => $display,
                'itemsPerPage' => $itemsPerPage,
                'totalRecord' => $totalRecord
            ));
        }
    }

    public function addNewInstanceAction() {
        
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $check_array = array();
        $isInstance = 'N';
        $mode = 'Edit';

        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();
            $is_instance = $post['is_instance'];
        }
        
        $listOfRole = array();
        if ($is_instance == 'Yes') {

            $instances = $this->getClassesTable()->getInstanceClassStructureNodeZ($post['node_class_id']);
            $config = $this->getServiceLocator()->get('config');
            $operation_role_cls_id = $config['constants']['OPERATIONS_ROLES_CLASS_ID'];

            if ($post['node_class_id'] == $operation_role_cls_id) {
                //error_reporting(E_ALL);
                $_data = $this->getClassesTable()->getInstanceListOfParticulerClass($operation_role_cls_id, 'class', 'node_instance_id');
                foreach ($_data as $key => $value) {
                    if ($value['Active'] == 1) {
                        $data[$key] = $value['Title'];
                    }
                }
                $visible_roles_pid = $config['constants']['VISIBLE_ROLES_PROP_ID'];
                $required_roles_pid = $config['constants']['REQUIRED_ROLES_PROP_ID'];
                $listOfRole['roles'] = $data;
                $listOfRole['class_pId'] = array('visible_roles_pid' => $visible_roles_pid, 'required_roles_pid' => $required_roles_pid);
                // echo '<pre>';print_r($data);
            //                echo 'hello';die;
            }
        } else {

            $instances = $this->getClassesTable()->getClassStructure($post['node_class_id']);
            $parentNodeId = $post['parentNodeId'];
        }

        $lastNum = $this->getClassesTable()->getLastNumber('node-instance', 'node_instance_id');
        $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');
        $classDetails = $this->getClassesTable()->getClassList($post['node_class_id']);


        /* $data                           =   $this->getClassesTable()->getClassChild($post['node_class_id']);
          $classArray['childs']           =   $data['ids'];
          $classArray['childsArray']      =   $data['data']; */


        /* //$data                           =   $this->getClassesTable()->getInstanceChildA('', $classDetails, $post['node_class_id']);
          $data                           =   $this->getClassesTable()->getInstanceChildANew('Edit', $classDetails, $post['node_class_id'], '');
          $classArray['childsArray']      =   $data['data'];
          $classArray['number_print']     =   $data['number_print'];
          $classArray['class_data']       =   $data['class_data'];

          $node_id                        =   $post['node_id'];
          $nodeType                       =   $post['nodeType'];
          $is_instance                    =   $post['is_instance']; */


        $data = $this->getClassesTable()->getClassChild($post['node_class_id']);
        //$data['data'] :: gives subclass structure of Parent Class

        $sPCdata = $this->getClassesTable()->getSPCommonName($post['node_class_id']);
        //$sPCdata gives Singular, Plural, Common Name of Parent Class

        $instanceArrayProp = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type = 'instance', $instances[0]['property']);
        $currentNumber = intval($instanceArrayProp) + 1 + 1;

        $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', '', $data['data'], $currentNumber, $check_array);

        $classArray['childs'] = $data['ids'];
        $classArray['childsArray'] = $numberPS;
        $classArray['number_print'] = $data['number_print'];
        $classArray['class_data'] = $sPCdata['class_data'];

        $count_temp_instance = $this->getClassesTable()->getLastNumber('node-instance', 'node_instance_id'); //print_r($count_temp_instance); die();

        /* echo "<pre>";
          print_r($classDetails);
          die; */

        $view = new ViewModel(array('temp_instance_id' => $count_temp_instance, 'instances' => $instances[0], 'class_id' => $post['node_class_id'], 'lastNum' => $lastNum, 'newNodeId' => $newNodeId, 'typeArray' => $typeArray, 'node_id' => $node_id, 'nodeType' => $nodeType, 'is_instance' => $is_instance, 'classArray' => $classArray, 'listOfRole' => $listOfRole,'parentNodeId' => $parentNodeId,));
        if (intval($classDetails['node_type_id']) == 3) {

            return $view->setTemplate('administrator/classes/nodez-instance.phtml');
        } else {
            return $view;
        }
    }

    /*
     * Create Node structure by parsing file
     *
     */

    public function createNodeFromFile($data) {

        $node_id_file = $data['node_id_file'];
        $node_type_id = $data['node_type_id'];
        $saveType = $data['save_type'];
        $file_node_class_id = $data['file_node_class_id'];
        $fileArr = array(
            'root_path' => $data['root_path'],
            'dir_path' => $data['dir_path'],
            'file_name' => $data['file_name'],
        );

        $parser = $this->FileParser();
        $result = $parser->findFuncInFiles($fileArr);
        if (is_array($result)) {

            $fileType = isset($result['type']) ? $result['type'] : '';
            $fileDescription = isset($result['description']) ? $result['description'] : '';

            $file_struc = $this->getClassesTable()->getClassPropertyStructure($file_node_class_id);

            $variable_struc_js = $this->getClassesTable()->getClassPropertyStructure($file_struc['sc'][0]);
            $method_struc_js = $this->getClassesTable()->getClassPropertyStructure($file_struc['sc'][1]);
            $argument_struc_js = $this->getClassesTable()->getClassPropertyStructure($method_struc_js['sc'][0]);
            $class_struc = $this->getClassesTable()->getClassPropertyStructure($file_struc['sc'][2]);
            $variable_struc = $this->getClassesTable()->getClassPropertyStructure($class_struc['sc'][0]);
            $method_struc = $this->getClassesTable()->getClassPropertyStructure($class_struc['sc'][1]);
            $argument_struc = $this->getClassesTable()->getClassPropertyStructure($method_struc['sc'][0]);
            $ruleset_struc = $this->getClassesTable()->getClassPropertyStructure($file_struc['sc'][3]);
            $selector_struc = $this->getClassesTable()->getClassPropertyStructure($ruleset_struc['sc'][0]);
            $declaration_struc = $this->getClassesTable()->getClassPropertyStructure($ruleset_struc['sc'][1]);

            $node_class_id_variable_js = $file_struc['sc'][0];
            $node_class_id_methods_js = $file_struc['sc'][1];
            $node_class_id_arguments_js = $method_struc_js['sc'][0];
            $node_class_id_class = $file_struc['sc'][2];
            $node_class_id_variable = $class_struc['sc'][0];
            $node_class_id_methods = $class_struc['sc'][1];
            $node_class_id_arguments = $method_struc['sc'][0];
            $node_class_id_ruleset = $file_struc['sc'][3];
            $node_class_id_selector = $ruleset_struc['sc'][0];
            $node_class_id_declaration = $ruleset_struc['sc'][1];

            $variable_struc_js = $this->getClassesTable()->resetArray($variable_struc_js, 'sc', true);
            $method_struc_js = $this->getClassesTable()->resetArray($method_struc_js, 'sc', true);
            $argument_struc_js = $this->getClassesTable()->resetArray($argument_struc_js, 'sc', true);
            $class_struc = $this->getClassesTable()->resetArray($class_struc, 'sc', true);
            $variable_struc = $this->getClassesTable()->resetArray($variable_struc, 'sc', true);
            $method_struc = $this->getClassesTable()->resetArray($method_struc, 'sc', true);
            $argument_struc = $this->getClassesTable()->resetArray($argument_struc, 'sc', true);
            $ruleset_struc = $this->getClassesTable()->resetArray($ruleset_struc, 'sc', false);
            $selector_struc = $this->getClassesTable()->resetArray($selector_struc, 'sc', false);
            $declaration_struc = $this->getClassesTable()->resetArray($declaration_struc, 'sc', false);

            // structure diff, as extra property not present
            $ruleset_struc = array_keys($ruleset_struc);
            $selector_struc = array_keys($selector_struc);
            $declaration_struc = array_keys($declaration_struc);

            $instance_caption = $node_instance_id = '';

            // js VARIABLE, METHODS
            if (count($result['variables'])) {
                foreach ($result['variables'] as $variable) {
                    $varTitle = isset($variable['title']) ? $variable['title'] : '';
                    $varValue = isset($variable['value']) ? $variable['value'] : '';
                    $varScope = isset($variable['scope']) ? $variable['scope'] : '';
                    $instance_property_id = $instance_property_caption = array();
                    $instance_property_id = $variable_struc_js[0];
                    $instance_property_caption = array($varTitle, $varValue, $varScope);

                    // create new instance
                    $node_instance_id_variable = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_variable_js, $node_type_id, $saveType, $node_instance_id);
                    if (intval($node_instance_id_variable) > 0) {
                        // create new instance property //
                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_variable, $node_type_id);
                    }
                    $node_id_variable = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_variable);
                    $this->getClassesTable()->saveNodeX($node_id_file, $node_id_variable); // parent, child
                }
            }

            if (count($result['methods'])) {
                foreach ($result['methods'] as $method) {

                    $methodTitle = isset($method['title']) ? $method['title'] : '';
                    $methodValue = isset($method['value']) ? $method['value'] : '';
                    $methodScope = isset($method['scope']) ? $method['scope'] : '';

                    $instance_property_id = $instance_property_caption = array();
                    $instance_property_id = $method_struc_js[0];
                    $instance_property_caption = array($methodTitle, $methodValue, $methodScope);

                    // create new instance
                    $node_instance_id_method = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_methods_js, $node_type_id, $saveType, $node_instance_id);
                    if (intval($node_instance_id_method) > 0) {
                        // create new instance property //
                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_method, $node_type_id);
                    }
                    $node_id_method = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_method);
                    $this->getClassesTable()->saveNodeX($node_id_file, $node_id_method); // parent, child

                    if (isset($method['arguments']) && count($method['arguments'])) {
                        foreach ($method['arguments'] as $argument) {
                            $argTitle = isset($argument['title']) ? $argument['title'] : '';
                            $argValue = isset($argument['value']) ? $argument['value'] : '';
                            $argDataType = isset($argument['data_type']) ? $argument['data_type'] : '';

                            $instance_property_id = $instance_property_caption = array();
                            $instance_property_id = $argument_struc_js[0];
                            $instance_property_caption = array($argTitle, $argValue, $argDataType);

                            // create new instance
                            $node_instance_id_argument = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_arguments_js, $node_type_id, $saveType, $node_instance_id);
                            if (intval($node_instance_id_argument) > 0) {
                                // create new instance property //
                                $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_argument, $node_type_id);
                            }
                            $node_id_argument = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_argument);
                            $this->getClassesTable()->saveNodeX($node_id_method, $node_id_argument); // parent, child
                        }
                    }
                }
            }

            // create multiple class instance
            // create multiple class instance property
            // save it in x-y relation table (y - file, x - class)
            // STORE - title
            if (count($result['classes'])) {
                foreach ($result['classes'] as $class) {
                    $instance_property_id = $instance_property_caption = array();
                    $title = isset($class['title']) ? $class['title'] : '';
                    $instance_property_id = $class_struc[0];
                    $instance_property_caption = array($title);
                    // create new instance
                    $node_instance_id_class = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_class, $node_type_id, $saveType, $node_instance_id);
                    if (intval($node_instance_id_class) > 0) {
                        // create new instance property //
                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_class, $node_type_id);
                    }
                    $node_id_class = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_class);
                    $this->getClassesTable()->saveNodeX($node_id_file, $node_id_class); // parent, child
                    // create multiple variable instance
                    // create multiple variable instance property
                    // save it in x-y relation table (y - class, x - variable)
                    // STORE - multiple variable
                    if (isset($class['variables']) && count($class['variables'])) {
                        foreach ($class['variables'] as $variable) {
                            $varTitle = isset($variable['title']) ? $variable['title'] : '';
                            $varValue = isset($variable['value']) ? $variable['value'] : '';
                            $varScope = isset($variable['scope']) ? $variable['scope'] : '';
                            $instance_property_id = $instance_property_caption = array();
                            $instance_property_id = $variable_struc[0];
                            $instance_property_caption = array($varTitle, $varValue, $varScope);


                            // create new instance
                            $node_instance_id_variable = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_variable, $node_type_id, $saveType, $node_instance_id);
                            if (intval($node_instance_id_variable) > 0) {
                                // create new instance property //
                                $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_variable, $node_type_id);
                            }
                            $node_id_variable = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_variable);
                            $this->getClassesTable()->saveNodeX($node_id_class, $node_id_variable); // parent, child
                        }
                    }

                    // create multiple methods instance
                    // create multiple methods instance property
                    // save it in x-y relation table (y - class, x - method)
                    // STORE - title, value
                    if (isset($class['methods']) && count($class['methods'])) {
                        foreach ($class['methods'] as $method) {

                            $methodTitle = isset($method['title']) ? $method['title'] : '';
                            $methodValue = isset($method['value']) ? $method['value'] : '';
                            $methodScope = isset($method['scope']) ? $method['scope'] : '';

                            $instance_property_id = $instance_property_caption = array();
                            $instance_property_id = $method_struc[0];
                            $instance_property_caption = array($methodTitle, $methodValue, $methodScope);


                            // create new instance
                            $node_instance_id_method = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_methods, $node_type_id, $saveType, $node_instance_id);
                            if (intval($node_instance_id_method) > 0) {
                                // create new instance property //
                                $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_method, $node_type_id);
                            }
                            $node_id_method = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_method);
                            $this->getClassesTable()->saveNodeX($node_id_class, $node_id_method); // parent, child
                            // create multiple argument instance
                            // create multiple argument instance property
                            // save it in x-y relation table (y - method, x - argument)
                            // STORE - title, data_type
                            if (isset($method['arguments']) && count($method['arguments'])) {
                                foreach ($method['arguments'] as $argument) {
                                    $argTitle = isset($argument['title']) ? $argument['title'] : '';
                                    $argValue = isset($argument['value']) ? $argument['value'] : '';
                                    $argDataType = isset($argument['data_type']) ? $argument['data_type'] : '';

                                    $instance_property_id = $instance_property_caption = array();
                                    $instance_property_id = $argument_struc[0];
                                    $instance_property_caption = array($argTitle, $argValue, $argDataType);

                                    // create new instance
                                    $node_instance_id_argument = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_arguments, $node_type_id, $saveType, $node_instance_id);
                                    if (intval($node_instance_id_argument) > 0) {
                                        // create new instance property //
                                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_argument, $node_type_id);
                                    }
                                    $node_id_argument = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_argument);
                                    $this->getClassesTable()->saveNodeX($node_id_method, $node_id_argument); // parent, child
                                }
                            }
                        }
                    }
                }
            }
            // RULESET for CSS
            if (count($result['ruleset'])) {
                $meCount = 0;
                foreach ($result['ruleset'] as $ruleset) {
                    $instance_property_id = $instance_property_caption = array();
                    $general = '';
                    $instance_property_id = $ruleset_struc;
                    $instance_property_caption = array($general);
                    $instance_caption = $node_instance_id = '';

                    // create new instance
                    $node_instance_id_ruleset = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_ruleset, $node_type_id, $saveType, $node_instance_id);
                    if (intval($node_instance_id_ruleset) > 0) {
                        // create new instance property //
                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_ruleset, $node_type_id);
                    }
                    $node_id_ruleset = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_ruleset);
                    $this->getClassesTable()->saveNodeX($node_id_file, $node_id_ruleset); // parent, child
                    // SELECTOR
                    if (isset($ruleset['selector']['title']) && count($ruleset['selector']['title'])) {
                        foreach ($ruleset['selector']['title'] as $selector) {
                            //if (isset($ruleset['selector']['title'])) {
                            $varTitle = !empty($selector) ? $selector : '';
                            $instance_property_id = $instance_property_caption = array();
                            $instance_property_id = $selector_struc;
                            $instance_property_caption = array($varTitle);

                            // create new instance
                            $node_instance_id_selector = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_selector, $node_type_id, $saveType, $node_instance_id);
                            if (intval($node_instance_id_selector) > 0) {
                                // create new instance property //
                                $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_selector, $node_type_id);
                            }
                            $node_id_selector = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_selector);
                            $this->getClassesTable()->saveNodeX($node_id_ruleset, $node_id_selector); // parent, child
                            //}
                        }
                    }

                    // DECLARATION
                    if (isset($ruleset['declaration']) && count($ruleset['declaration'])) {
                        foreach ($ruleset['declaration'] as $declaration) {
                            if (isset($declaration['property']) && isset($declaration['value'])) {
                                $varProperty = isset($declaration['property']) ? $declaration['property'] : '';
                                $varValue = isset($declaration['value']) ? $declaration['value'] : '';
                                $instance_property_id = $instance_property_caption = array();
                                $instance_property_id = $declaration_struc;
                                $instance_property_caption = array($varProperty, $varValue);

                                // create new instance
                                $node_instance_id_declaration = $this->getClassesTable()->createInstance($instance_caption, $node_class_id_declaration, $node_type_id, $saveType, $node_instance_id);
                                if (intval($node_instance_id_declaration) > 0) {
                                    // create new instance property //
                                    $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id_declaration, $node_type_id);
                                }
                                $node_id_declaration = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_declaration);
                                $this->getClassesTable()->saveNodeX($node_id_ruleset, $node_id_declaration); // parent, child
                            }
                        }
                    }
                }
            }
        }

        return $result;
    }

    public function getChild($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            $menuArray[$key] = $value;
            $childArray = array();
            if (is_array($menu2[$value['id']])) {
                $menuArray[$key]['child'] = $this->getChild($menu2[$value['id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    private function viewClassCombinedHtml($formData) {
        parse_str($formData['form-data'], $postArray);

        $config = $this->getServiceLocator()->get('config');
        $view_node_class_id = $config['constants']['VIEW_CLASS_ID'];
        $css_class_prop_id = $config['constants']['CSS_CLASS_PROP_ID'];
        $html_class_prop_id = $config['constants']['HTML_CLASS_PROP_ID'];
        $layout_class_prop_id = $config['constants']['LAYOUT_CLASS_PROP_ID'];
        $combined_class_prop_id = $config['constants']['COMBINED_CLASS_PROP_ID'];
        $domain_class_prop_id = $config['constants']['DOMAIN_CLASS_PROP_ID'];
        $url_class_prop_id = $config['constants']['URL_CLASS_PROP_ID'];

        $prop_id_array = isset($postArray['class_property_id']) ? $postArray['class_property_id'] : $postArray['instance_property_id'];
        $propArr = array_combine($prop_id_array, $postArray['instance_property_caption']);

        /* Start Code By Arvind Soni And Shanti Gola */
        if (is_numeric($propArr[$layout_class_prop_id])) {
            $layoutInstanceId = $propArr[$layout_class_prop_id];
            if ($layoutInstanceId != '' && intval($layoutInstanceId) > 0)
                $layoutInstanceValueArray = $this->getClassesTable()->getInstanceListOfParticulerClass($layoutInstanceId, 'node', 'node_id');
            else
                $layoutInstanceValueArray = array();

            $layoutFormType = current($layoutInstanceValueArray)['Form Type'];
            $propArr[$layout_class_prop_id] = html_entity_decode(current($layoutInstanceValueArray)['Layout']);
        }
        /* End Code By Arvind Soni And Shanti Gola */

        /* echo "<pre>";
          print_r($propArr);
          die; */
        // RESULT data
        $data = array();

        // VIEW BUILDER PLUGIN
        $viewBuilder = $this->ViewBuilder();
        $viewBuilder->setModal($this->getClassesTable());

        // GET HTML STRUCTURE
        if (strtolower($propArr[$html_class_prop_id]) == 'na' || strtolower($propArr[$html_class_prop_id]) == '') {
            $data['html'] = 'na';
        } else {
            $htmlNClassId = $this->getClassesTable()->getClassDetail($propArr[$html_class_prop_id]);

            $htmlArr = $viewBuilder->getHtmlClassStructure($htmlNClassId['node_class_id']);
            
            
            $data['html'] = current($htmlArr[0]['property'])['child'];
            /* start added by gaurav*/
        //            $propArr = current($htmlArr[0]['property']);
        //            unset($propArr['child']);
        //            $data['html'][] = $propArr;
                    /* end added by gaurav*/
            

            $classArr = $this->getClassesTable()->getClassChild($htmlNClassId['node_class_id']);
            $data['subclasses'] = $this->getPrintStructure($classArr['data']);
            $data['nodeZ'] = $viewBuilder->getnodeZInstances($htmlNClassId['node_class_id']);
        }
        $data['node_class_id'] = $htmlNClassId['node_class_id'];
       
        
        
        // GET CSS INSTANCE VALUES
        $data['css'] = trim($propArr[$css_class_prop_id]);
        //$cssClassId  = $this->getClassesTable()->getNodeInstanceClassId(trim($propArr[$css_class_prop_id]));
        //$data['css'] = $viewBuilder->getCssInstances($this->getClassesTable(), $cssClassId['node_class_id'], $cssClassId['node_instance_id']);
        // GET HTML Layout
        $data['layout'] = $propArr[$layout_class_prop_id];
        $data['layoutFormType'] = $layoutFormType;
        $data['combined_html'] = $propArr[$combined_class_prop_id];
        // GET Domain & URL
        $data['domain'] = $propArr[$domain_class_prop_id];
        $data['url'] = $propArr[$url_class_prop_id];
        // SET main & sid array
        $data['main'] = $formData['main'];
        $data['sid'] = $formData['sid'];

        // MERGE HTML + CSS + Layout
        $combinedHtml = $viewBuilder->mergeHtmlCssLayout($data);

        return $combinedHtml;
    }

    public function updateCombinedHtmlAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $classNodeId = $post['class_node_id'];          // CURRENT CLASS TO PUBLISH
            $viewClassInstanceId = $post['view_instance_id'];       // VIEW INSTANCE ID TO UPDATE
            $viewClassInstanceNodeId = $post['view_instance_node_id'];  // VIEW INSTANCE NODE ID TO UPDATE

            $config = $this->getServiceLocator()->get('config');
            $view_node_class_id = $config['constants']['VIEW_CLASS_ID'];
            $css_class_prop_id = $config['constants']['CSS_CLASS_PROP_ID'];
            $layout_class_prop_id = $config['constants']['LAYOUT_CLASS_PROP_ID'];
            $html_class_prop_id = $config['constants']['HTML_CLASS_PROP_ID'];
            $combined_class_prop_id = $config['constants']['COMBINED_CLASS_PROP_ID'];
            $domain_class_prop_id = $config['constants']['DOMAIN_CLASS_PROP_ID'];
            $url_class_prop_id = $config['constants']['URL_CLASS_PROP_ID'];

            // Find VIEW class instance details
            //$instanceDetails = $this->getClassesTable()->getInstanceStructurePrint($viewClassInstanceId); //638 //->getInstanceListOfParticulerClass($viewClassInstanceId, 'node', 'node_id');

            $instanceArray = $this->getChildClassInstancePrint(array($viewClassInstanceNodeId), $view_node_class_id, array());

            $propArr[$layout_class_prop_id] = current($instanceArray['childs'])[$viewClassInstanceId][$layout_class_prop_id]; //612178
            $propArr[$html_class_prop_id] = current($instanceArray['childs'])[$viewClassInstanceId][$html_class_prop_id];

            if ($propArr[$html_class_prop_id] == $classNodeId && is_numeric($propArr[$layout_class_prop_id])) {
                // html value equals current class & layout value is numeric
                // GET LAYOUT INSTANCE VALUE
                $layoutInstanceId = $propArr[$layout_class_prop_id];
                if ($layoutInstanceId != '' && intval($layoutInstanceId) > 0) {
                    $layoutInstanceValueArray = $this->getClassesTable()->getInstanceListOfParticulerClass($layoutInstanceId, 'node', 'node_id');
                } else {
                    $layoutInstanceValueArray = array();
                }

                $layoutFormType = current($layoutInstanceValueArray)['Form Type'];
                $propArr[$layout_class_prop_id] = html_entity_decode(current($layoutInstanceValueArray)['Layout']);

                // RESULT data
                $data = array();

                // VIEW BUILDER PLUGIN
                $viewBuilder = $this->ViewBuilder();
                $viewBuilder->setModal($this->getClassesTable());

                // GET HTML STRUCTURE
                if (strtolower($propArr[$html_class_prop_id]) == 'na' || strtolower($propArr[$html_class_prop_id]) == '') {
                    $data['html'] = 'na';
                } else {
                    $htmlNClassId = $this->getClassesTable()->getClassDetail($propArr[$html_class_prop_id]);
                    $htmlArr = $viewBuilder->getHtmlClassStructure($htmlNClassId['node_class_id']);
                    $data['html'] = current($htmlArr[0]['property'])['child'];
                    $classArr = $this->getClassesTable()->getClassChild($htmlNClassId['node_class_id']);
                    $data['subclasses'] = $this->getPrintStructure($classArr['data']);
                    $data['nodeZ'] = $viewBuilder->getnodeZInstances($htmlNClassId['node_class_id']);
                }

                $data['node_class_id'] = $htmlNClassId['node_class_id'];
                $data['css'] = trim($propArr[$css_class_prop_id]);       // GET CSS INSTANCE VALUES
                $data['layout'] = $propArr[$layout_class_prop_id];          // GET HTML Layout
                $data['layoutFormType'] = $layoutFormType;
                $data['combined_html'] = $propArr[$combined_class_prop_id];
                $data['domain'] = $propArr[$domain_class_prop_id];          // GET Domain & URL
                $data['url'] = $propArr[$url_class_prop_id];
                $data['main'] = ''; //$formData['main'];                   // SET main & sid array
                $data['sid'] = ''; //$formData['sid'];
                $combinedHtml = $viewBuilder->mergeHtmlCssLayout($data);  // MERGE HTML + CSS + Layout
                //print_r(array($viewClassInstanceId, $combined_class_prop_id, $combinedHtml));die;
                // UPDATE COMBINED HTML FOR THE INSTANCE
                // instance id + property id
                // manually value updation - so only considering UPDATE NOT INSERT
                // 177858,2952,''
                echo $this->getClassesTable()->updateInstancePropertyValue($viewClassInstanceId, $combined_class_prop_id, $combinedHtml);

                print '1';
                exit;
            }
        }
    }

    public function saveInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $saveType = $post['saveType'];
            parse_str($post['data'], $postArray);

            

            $typeArray = $this->getClassesTable()->getClassList($postArray['node_class_id']);

            $node_type_id = $typeArray['node_type_id'];
            $node_class_id = $postArray['node_class_id'];
            $node_instance_id = $postArray['node_instance_id'];
            $updateFlag = $node_instance_id > 0 ? 1 : 0;
            $instance_caption = $postArray['instance_caption'];
            $instance_property_id = $postArray['instance_property_id'];
            $instance_property_caption = $postArray['instance_property_caption'];
            $subinstance_property_array = $postArray['si_node_instance_property_value'];
            $instance_property_array = json_decode($post['myInstanceJsonString'], true);
            
            /*code start for check version 'Yes' and creator already exits */
            if($node_class_id == 806)
            {   

                $version = explode("~#~", $postArray['instance_property_caption'][3]);
                if(strtolower($version[0])=="yes")
                {
                    if(isset($node_instance_id) && $node_instance_id!="")
                    {
                        $instancePropertyArr = $postArray['class_property_id'];
                    }else {
                        $instancePropertyArr = $postArray['instance_property_id'];
                    }

                    $checkVesCreator = $this->getClassesTable()->checkVersionCreator($node_class_id,$instancePropertyArr,$postArray['instance_property_caption'],$node_instance_id);
                }
                
            }
            
            $flag = 'Y';
            if (intval($node_instance_id) > 0)
                $flag = 'N';

            // create new instance //
            if (trim($instance_caption) != "")
                $node_instance_id = $this->getClassesTable()->createInstance($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id);            
            //Use for assign same role when new role is added
            $config = $this->getServiceLocator()->get('config');
            $operation_role_cls_id = $config['constants']['OPERATIONS_ROLES_CLASS_ID'];
            if (intval($postArray['node_instance_id']) == 0 && $postArray['node_class_id'] == $operation_role_cls_id) {
                $visible_roles_pid = $config['constants']['VISIBLE_ROLES_PROP_ID'];
                $required_roles_pid = $config['constants']['REQUIRED_ROLES_PROP_ID'];
                array_push($instance_property_id, $visible_roles_pid);
                array_push($instance_property_id, $required_roles_pid);
                array_push($instance_property_caption, $node_instance_id);
                array_push($instance_property_caption, $node_instance_id);
            }
            
            $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id') - 1;

            /* Start Code By Arvind Soni For Caching */
            $this->deleteCacheFile("instance_structure_display_" . $node_instance_id);
            $this->deleteCacheFile("instance_structure_edit_" . $node_instance_id);
            $this->deleteCacheFile('instance_list_' . $node_class_id . '_no-pagination');
            /* End Code By Arvind Soni For Caching */

            if (intval($node_instance_id) > 0) {

                $config = $this->getServiceLocator()->get('config');


                // >>> AMIT MALAKAR
                $file_node_class_id = $config['constants']['FILE_NODE_CLASS_ID'];
                if ($node_class_id == $file_node_class_id) {
                    $parsedData = array();
                    /* $fileExists = $instance_property_caption[0]
                      .DIRECTORY_SEPARATOR.$instance_property_caption[1]
                      .DIRECTORY_SEPARATOR.$instance_property_caption[2];
                      $fileExistsMsg = !file_exists($fileExists) ? 'File not accessible, please check file path and/or read/write permission.' : ''; */
                    if (!$updateFlag) {
                        // call file parser in case of new instance
                        // if update dont run this, update through subInstanceArray
                        $data = array(
                            'file_node_class_id' => $file_node_class_id,
                            'save_type' => $saveType,
                            'node_type_id' => $node_type_id,
                            'node_id_file' => $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id),
                            'root_path' => $instance_property_caption[0],
                            'dir_path' => $instance_property_caption[1],
                            'file_name' => $instance_property_caption[2],
                        );
                        $parsedData = $this->createNodeFromFile($data);
                        if (is_array($parsedData)) {
                            $instance_property_caption[3] = isset($parsedData['location']['url']) ? $parsedData['location']['url'] : '';
                            $instance_property_caption[4] = isset($parsedData['type']) ? $parsedData['type'] : '';
                            $instance_property_caption[5] = (isset($parsedData['description']) && strlen($parsedData['description'])) ? $parsedData['description'] : $instance_property_caption[5];
                        }
                    }
                }
                // <<< AMIT MALAKAR
                if ($flag == 'Y') {
                    // create new instance property //
                    $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id);
                } else {
                    $class_property_id = $postArray['class_property_id'];
                    // update instance property //
                    $this->getClassesTable()->updateInstanceProperty($instance_property_id, $instance_property_caption, $class_property_id, $node_instance_id, $node_type_id);
                }
            }

            //for instance subclasses's subinstance
            $temparray = array();
            if (count($instance_property_array) > 0) {
                $parentArray = array();
                $childArray = array();
                foreach ($instance_property_array as $key => $subinstance_property) {
                    $parent = $subinstance_property['parent'];
                    $flag = 'N';
                    foreach ($instance_property_array as $indexK => $valueK) {
                        if ($parent == $valueK['id']) {
                            $flag = 'Y';
                        }
                    }

                    if ($flag == 'N')
                        $instance_property_array[$key]['parent'] = 0;
                }

                foreach ($instance_property_array as $propk => $propv) {
                    if (intval($propv['parent']) == 0)
                        $parentArray[] = $propv;
                    else
                        $childArray[$propv['parent']][] = $propv;
                }

                $realPropArray = array();
                $temparray = $this->getChild($parentArray, $childArray, $realPropArray);
            }

            if (count($temparray) > 0) {
                foreach ($temparray as $keys => $sub_instance_temparray) {
                    $sub_instance_array = $temparray[$keys]; //$sub_instance_temparray; //$temp_sub_instance_temparray[$keys];
                    $this->subInstanceArray($sub_instance_array, $saveType, $flag, $node_instance_id);
                }
            }
            
        }
        exit;
    }

    /* Created By Divya */

    public function subInstanceArray($sub_instance_array, $saveType, $flag, $node_instance_ids) {
        if (isset($sub_instance_array['subnodeclasspropertyid']) && count($sub_instance_array['subnodeclasspropertyid'])) {
            $subinstance_property_value         = $sub_instance_array['text'];
            $node_class_id                      = $sub_instance_array['subnodeclassid'];
            $node_class_property_id             = $sub_instance_array['subnodeclasspropertyid'];
            $temp_node_id                       = $sub_instance_array['temp_node_id'];

            /* Start Code By Arvind Soni */
            if(intval($node_class_id) == intval(LOCATION_ROLE_DETAILS))
            {
                $index                              = '';
                $index                              = array_search(LOCATION_ROLE_LNID, $node_class_property_id);
                $subinstance_property_value[$index] = $node_instance_ids;
               
                $index                              = '';
                $index                              = array_search(LOCATION_ROLE_A, $node_class_property_id);
                $actor_name                         = trim($subinstance_property_value[$index]);

                $index                              = '';
                $index                              = array_search(LOCATION_ROLE_E, $node_class_property_id);
                $actor_email                        = $subinstance_property_value[$index];

                if($actor_name != '' && $actor_email != '')
                {
                    $actor_nid                          = $this->getClassesTable()->createOrGetActor($actor_name, $actor_email);

                    $index                              = '';
                    $index                              = array_search(LOCATION_ROLE_ANID, $node_class_property_id);
                    $subinstance_property_value[$index] = $actor_nid;
                }
            }
            /* End Code By Arvind Soni */

            $temp_instance_id                   = $this->getClassesTable()->getinstancesDetailsById($temp_node_id, $node_class_id);

            $nodetypeArray                      = $this->getClassesTable()->getClassList($node_class_id);
            $node_type_ids                      = $nodetypeArray['node_type_id'];
            $instance_caption                   = $this->getClassesTable()->getLastNumber('node', 'node_id');

            if ($temp_instance_id > 0) {
                /* Start Code By Arvind Soni For Caching */
                $this->deleteCacheFile("instance_sub_class_structure_edit_" . $node_class_id);
                $this->deleteCacheFile("instance_sub_class_structure_display_" . $node_class_id);
                /* End Code By Arvind Soni For Caching */
            } else {
                $node_instance_id               = $this->getClassesTable()->createInstance($instance_caption, $node_class_id, $node_type_ids, $saveType, 0);
                $node_x_ids                     = $this->getClassesTable()->getLastNumber('node', 'node_id') - 1;
                $node_y_id                      = $this->getClassesTable()->getinstanceDetails($node_instance_ids); //getnode_id
                $node_x_id                      = "," . $node_x_ids;
                $this->getClassesTable()->saveNodeX($node_y_id, $node_x_id);
            }

            if (intval($node_instance_ids) > 0) {
                if ($temp_instance_id > 0) {
                    // update instance property //
                    $this->getClassesTable()->updateSubInstancePropertyAgain($subinstance_property_value, $node_type_ids, $temp_instance_id, $node_class_property_id);
                } else {
                    // create new instance property //
                    $this->getClassesTable()->createInstancePropertyAgain($subinstance_property_value, $node_instance_id, $node_type_ids, $node_class_property_id);
                }
            }
        }

        if (count($sub_instance_array['child']) > 0) {
            foreach ($sub_instance_array['child'] as $instanceChild) {
                if ($temp_instance_id > 0) {
                    $temp_sub_node_instance_id = $temp_instance_id;
                } elseif ($node_instance_id > 0) {
                    $temp_sub_node_instance_id = $node_instance_id;
                } else {
                    $temp_sub_node_instance_id = $this->getClassesTable()->getinstancesDetailsById($instanceChild['temp_node_id'], $instanceChild['subnodeclassid']);
                }
                $this->subInstanceArray($instanceChild, $saveType, $flag, $temp_sub_node_instance_id);
            }
        }
    }

    /* function here to save file for nodeZ */

    public function saveNodeZFileAction() {
        $layout                     = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    = $this->getRequest();
        $classArray                 = array();
        $err                        = 0;
        $errorMsg                   = '';
        $file_name                  = '';
        $json                       = array();
        $awsObj                     = $this->AwsS3();
        if ($request->isPost()) {
            $post                   = $request->getPost()->toArray();
            $file                   = $request->getFiles()->toArray();
            
            $newFormId              = 'filenodeZ' . '' . $post['id'];
            $preImg                 = $post['imgName'];

            if ($file[$newFormId]['name'] != '') {
                $imageExt           = explode(".", $file[$newFormId]['name']);

                $extArr             = array('jpg', 'jpeg', 'gif', 'png');

                if (!empty($imageExt)) {
                    if (!in_array(strtolower(end($imageExt)), $extArr)) {
                        $err        = 1;
                    }
                }
            }
            
//            echo " -- ".$err." -- ".$preImg;
//            die();

            if ($err == 1) {
                //$randName         = $this->generateRandomStringAction(8);
                $file_name          = mt_rand() . '_' . $file[$newFormId]['name'];

                $uploaddir          = 'public/nodeZimg/';
                
                $uploadfile         = $uploaddir . $file_name;
                $result             = $awsObj->setFileData($uploadfile,$file[$newFormId]['tmp_name'],'file');
                //if (move_uploaded_file($file[$newFormId]['tmp_name'], $uploadfile)) {
                
                if($result['status_code'] == '200') {
                    $json['fileName'] = $file_name;
                }
                
            }
            else { 
                if ($file[$newFormId]['name']) {
                    
                    $awsObj->deleteFileData("public/nodeZimg/" . $preImg);
                    //unlink(ABSO_URL . "public/nodeZimg/" . $preImg);
                    $imageUrl               = trim($file[$newFormId]['name']);
                    $file_tmpname           = $file[$newFormId]['tmp_name'];
                    $file_name              = mt_rand() . '_' . $file[$newFormId]['name'];
                    $imagename              = 'public/nodeZimg/' . $file_name;
                    $thumbPath             = 'public/nodeZimg/thumbnail/' . $file_name;
                    $result                 = $awsObj->setFileData($imagename,$file_tmpname,'file');
                    
                    //Modified by Gaurav
                    //Added on 04 July 
                    //Create new folder if not exits
                    $uploaddir = 'public/nodeZimg/';
                    if(!is_dir($uploaddir)){
                         mkdir($uploaddir, 0777, true);

                    }
                    if(move_uploaded_file($file[$newFormId]['tmp_name'], $imagename)){
                        $uploadThumbDir = 'public/nodeZimg/thumbnail/';
                        if(!is_dir($uploadThumbDir)){
                             mkdir($uploadThumbDir, 0777, true);

                        }
                        $json['thumbnail'] =  $this->resize_crop_image(100, 100, $imagename, $thumbPath);
                    };
                     //end
                    if($result['status_code'] == '200')
                    $json['fileName']       = $file_name;
                    
                    
                    
                    
                    /*//new folder for thumbnail
                    list($width_orig, $height_orig) = getimagesize($file_tmpname);

                    //ne size
                    $dst_width = 300;
                    $dst_height = 300;

                    $im = imagecreatetruecolor($dst_width, $dst_height);

                    $imageExt = explode(".", $file_name);
                    $ext = strtolower(end($imageExt));

                    switch ($ext) {
                        case 'jpg':
                            $image = imagecreatefromjpeg($file_tmpname);
                            imagecopyresampled($im, $image, 0, 0, 0, 0, $dst_width, $dst_height, $width_orig, $height_orig);
                            //modive the name as u need
                            imagejpeg($im, $imagename);
                            break;
                        case 'jpeg':
                            $image = imagecreatefromjpeg($file_tmpname);
                            imagecopyresampled($im, $image, 0, 0, 0, 0, $dst_width, $dst_height, $width_orig, $height_orig);
                            //modive the name as u need
                            imagejpeg($im, $imagename);
                            break;
                        case 'gif':
                            $image = imagecreatefromgif($file_tmpname);
                            imagecopyresampled($im, $image, 0, 0, 0, 0, $dst_width, $dst_height, $width_orig, $height_orig);
                            //modive the name as u need
                            imagegif($im, $imagename);
                            break;
                    }*/
                }
            }
        }
        print json_encode($json);
        exit;
    }

    /* end code here */

    /* function here to use save instance data and get record of instance data */

    public function saveInstanceDataAction() {
        //echo '<pre>';print_r($_POST);die;
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            parse_str($post['data'], $postArray);
            $typeArray = $this->getClassesTable()->getClassList($postArray['node_class_id']);
            $saveType = 'P';
            $node_type_id = $typeArray['node_type_id'];
            $node_class_id = $postArray['node_class_id'];
            $node_instance_id = $postArray['node_instance_id'];
            $instance_caption = $postArray['instance_caption'];
            $instance_property_id = $postArray['instance_property_id'];
            $instance_property_caption = $postArray['instance_property_caption'];
            $is_instance = 0;
            $json['node_instance_id'] = $node_instance_id;

            foreach ($instance_property_caption as $k => $v) {
                if (trim($v) != '')
                    $is_instance = 1;
            }


            if ($is_instance == 1) {
                $flag = 'Y';
                if (intval($node_instance_id) > 0)
                    $flag = 'N';

                // create new instance //
                if (trim($instance_caption) != "")
                    $node_instance_id = $this->getClassesTable()->createInstance($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id);

                if (intval($node_instance_id) > 0) {
                    if ($flag == 'Y') {
                        // create new instance property //
                        $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id);
                    } else {
                        $class_property_id = $postArray['class_property_id'];
                        // update instance property //
                        $this->getClassesTable()->updateInstanceProperty($instance_property_id, $instance_property_caption, $class_property_id, $node_instance_id, $node_type_id);
                    }
                }

                $instanceNodeId = $this->getClassesTable()->getinstanceDetails($node_instance_id);
                $json['node_class_id'] = $node_class_id;
                $json['node_id'] = $instanceNodeId;
                $json['node_type_id'] = $node_type_id;
            }
        }
        print json_encode($json);
        exit;
    }

    /**
     * Helper method to search in multidimentional array.
     * @param type $id
     * @param type $seachKey
     * @param type $array
     * @return type
     *
     */
    private function searchForId($id, $seachKey, $array) {

        foreach ($array as $key => $val) {
            if ($val[$seachKey] === $id) {
                return $key;
            }
        }

        return null;
    }

    /**
     * Creating default set classes for not filled classes.
     * @param type $post
     * @return type
     *
     */
    public function getNodeDefaultInstanceIdForZclassesAction($post) {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $config = $this->getServiceLocator()->get('config');
        if (in_array($config['constants']['TAXONOMY_CLASS_NODE_ID'], $post)) {
            unset($post[array_search($config['constants']['TAXONOMY_CLASS_NODE_ID'], $post)]); // Remove Taxonomy class
        }
        $json = array();
        if (count($post) > 0) {
            $classesTableObj = $this->getClassesTable();
            $classIds = $classesTableObj->getClassIdByNode($post);
            foreach ($classIds as $key => $value) {
                $node_class_id = $value['node_class_id'];
                $typeArray = $classesTableObj->getClassList($node_class_id);
                $saveType = 'P';
                $node_type_id = $typeArray['node_type_id'];

                $instaceNodeId = $classesTableObj->createInstance('', $node_class_id, $node_type_id, $saveType, '');
                $classPropArrs = $classesTableObj->getNodeProperty($node_class_id);
                $json[$node_class_id] = $classesTableObj->getInstanceNodeId($instaceNodeId);
                
                foreach ($classPropArrs as $classPropArr) {
                    $instance_property_id = array();
                    $instance_property_caption = array();
                    $instance_property_id[] = $classPropArr['node_class_property_id'];

                    //Inserting the view mode for node right to logged in user.
                    if ($classPropArr['caption'] == "View") {
                        $prefixTitle = PREFIX . 'user_info';
                        $instance_property_caption[] = $_SESSION[$prefixTitle]['node_id'];
                    } else if ($classPropArr['node_class_property_id'] == $config['constants']['PARENT_CLASS_PID']) {
                        $instance_property_caption[] = $_SESSION['parent_class']; //1135355';
                        unset($_SESSION['parent_class']);
                    } else {
                        $instance_property_caption[] = $config['constants']['NODE_Z_DEFAULT_VALUES'][$classPropArr['caption']];
                    }
                    $this->getClassesTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $instaceNodeId, $node_type_id);
                }
            }
        }

        return $json;
    }

    /* function here to check instance data insert or not */

    public function checkDataActionAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $json = array();
        $nodedetails = array();
        $nodePropertydetails = array();
        if ($request->isPost()) {

            $post = $request->getPost()->toArray();

            $nodedetails = $this->getClassesTable()->getinstancesDetailsById($post['node_id'], $post['node_class_id']);

            $nodePropertydetails = $this->getClassesTable()->getinstanceProperyDetails($nodedetails);
        }

        $json['checkvalue'] = count($nodePropertydetails);
        $json['node_class_id'] = $post['node_class_id'];
        $json['node_id'] = $post['node_id'];
        $json['full_class_id'] = $post['full_class_id'];
        $json['selctedliId'] = $post['selctedlName'];
        print json_encode($json);
        exit;
    }

    public function checkInstanceDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $json = array();
        $nodedetails = array();
        $nodePropertydetails = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $nodedetails = $this->getClassesTable()->getinstancesDetailsById($post['node_id'], $post['node_class_id']);

            $nodePropertydetails = $this->getClassesTable()->getinstanceProperyDetails($nodedetails);
        }

        


        $json['checkvalue'] = count($nodePropertydetails);
        $json['node_class_id'] = $post['node_class_id'];
        $json['node_id'] = $post['node_id']; //'16525, 16543, 41881, 41884';
        $json['full_class_id'] = $post['full_class_id'];
        $json['selctedliId'] = $post['selctedlName'];
        print json_encode($json);
        exit;
    }

    /* end code here */

    public function instanceNodeStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $json = array();
        $mode = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];

            /* functionality change for get nod instance id bases of node class id */

            if (!empty($post['node_class_id'])) {

                $nodedetails = $this->getClassesTable()->getinstancesDetailsById($post['node_id'], $post['node_class_id']);

                if (empty($nodedetails)) {

                    $nodeId = $this->getClassesTable()->getinstancesById($post['node_class_id']);

                    $nextNodeId = $this->getClassesTable()->getNodeXId($nodeId, $post['parentid']);

                    $nodedetails = $this->getClassesTable()->getinstancesDetailsById($nextNodeId, $post['node_class_id']);
                }

                $instanceArray = $this->getClassesTable()->getInstanceDataDetailsIns($nodedetails, $post['node_class_id']);
            }
        }

        $json['node_id'] = $instanceArray['node_id'];
        $json['selected_node_class_id'] = $post['class_node_id'];

        print json_encode($json);
        exit;
    }

    public function instanceStructureAction() {
             
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $check_array = array();
        $mode = '';
        $nodeType = '';
        $is_instance = '';
        $node_class_id = '';

        /* Start Code By Arvind Soni For Caching */
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        $instance_file_name = '';
        $instanceCachedData = '';
        /* End Code By Arvind Soni For Caching */

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];
            $is_instance = $post['is_instance'];
            $node_y_class_id = $post['node_y_class_id'];

            /* functionality change for get nod instance id bases of node class id */
            $SaveTypeArr = $this->getClassesTable()->getSaveType($node_y_class_id);
            $_classVersionType = $SaveTypeArr[0]['type'];
            if (!empty($post['node_class_id'])) {
                $node_class_id = $post['node_class_id'];
                $nodedetails = $this->getClassesTable()->getinstancesDetailsById($post['node_id'], $post['node_class_id']);
                $instanceArray = $this->getClassesTable()->getInstanceDataDetailsIns($nodedetails, $post['node_class_id']);
                $nodeType = $post['nodeType'];
            } else {
                /* Start Code By Arvind Soni For Caching */
                $instance_file_name = "instance_structure_" . strtolower($mode) . "_" . $post['node_instance_id'];
                $instanceCachedData = ''; //$manager->read($instance_file_name);

                if ($instanceCachedData == "") {
                    $instanceArray = $this->getClassesTable()->getInstanceStructure($post['node_instance_id'], $is_instance);
                    //print_r($instanceArray);
                    $listOfRole = array();
                    if (count($instanceArray) > 0) {
                        $node_class_id = $instanceArray['node_class_id'];
                        $config = $this->getServiceLocator()->get('config');
                        $operation_role_cls_id = $config['constants']['OPERATIONS_ROLES_CLASS_ID'];
                        if ($node_class_id == $operation_role_cls_id) {
                            $_data = $this->getClassesTable()->getInstanceListOfParticulerClass($operation_role_cls_id, 'class', 'node_instance_id');
                            foreach ($_data as $key => $value) {
                                if ($value['Active'] == 1) {
                                    $data[$key] = $value['Title'];
                                }
                            }
                       
                            $node_instance_id = $post['node_instance_id'];
                            if ($mode == 'Edit' && key_exists($node_instance_id, $data)) {
                                //unset($data[$node_instance_id]);
                                $listOfRole['edit'] = $node_instance_id;
                            }
                            $visible_roles_pid = $config['constants']['VISIBLE_ROLES_PROP_ID'];
                            $required_roles_pid = $config['constants']['REQUIRED_ROLES_PROP_ID'];
                            $listOfRole['roles'] = $data;
                            $listOfRole['class_pId'] = array('visible_roles_pid' => $visible_roles_pid, 'required_roles_pid' => $required_roles_pid);
                            $listOfRole['roles'] = $data;
                        }
                    }

                    if (trim($node_class_id) != '') {

                        $data = $this->getClassesTable()->getClassChild($node_class_id);
                        //$data['data'] :: gives subclass structure of Parent Class
                        //print_r($data);
                        $sPCdata = $this->getClassesTable()->getSPCommonName($node_class_id);
                        //$sPCdata gives Singular, Plural, Common Name of Parent Class

                        $instanceArrayProp = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type = 'instance', $instanceArray['instances']['property']);
                        $currentNumber = intval($instanceArrayProp) + 1 + 1;

                        $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', $post['node_instance_id'], $data['data'], $currentNumber, $check_array);
                        //print_r($numberPS);

                        $classArray['childs'] = $data['ids'];
                        $classArray['childsArray'] = $numberPS;
                        $classArray['number_print'] = $data['number_print'];
                        $classArray['class_data'] = $sPCdata['class_data'];
                        //$classArray['disable_expand']   =   $data['disable_expand'];



                        /* if(trim($mode) == 'Display'){
                          $data                           =   $this->getClassesTable()->getInstanceChildANew($mode, $instanceArray['instances'], $node_class_id, $post['node_instance_id']);

                          $classArray['childs']           =   $data['ids'];
                          $classArray['childsArray']      =   $data['data'];
                          $classArray['number_print']     =   $data['number_print'];
                          $classArray['class_data']       =   $data['class_data'];
                          //$classArray['disable_expand']   =   $data['disable_expand'];
                          }else{
                          $data                           =   $this->getClassesTable()->getClassChild($node_class_id);
                          $dataArray                      =   $this->getClassesTable()->getInstanceA($mode, $instanceArray['instances'], $node_class_id, $post['node_instance_id']);

                          $classArray['childs']           =   $data['ids'];
                          $classArray['childsArray']      =   $data['data'];
                          $classArray['number_print']     =   $dataArray['number_print'];
                          $classArray['class_data']       =   $dataArray['class_data'];
                          //$classArray['disable_expand']   =   $dataArray['disable_expand'];
                          } */
                    }
                }
                /* End Code By Arvind Soni For Caching */
            }
        }

        $classDetails = $this->getClassesTable()->getClassList($node_class_id);


        $count_temp_instance = $this->getClassesTable()->getLastNumber('node-instance', 'node_instance_id');
        //echo $end;


        /* Start Code By Arvind Soni For Caching */
        if ($instanceCachedData != "") {
            return $instanceCachedData;
        } else {

            $view = new ViewModel(array('temp_instance_id' => $count_temp_instance, 'instanceArray' => $instanceArray, 'mode' => $mode, 'nodeType' => $nodeType, 'is_instance' => $is_instance, 'classArray' => $classArray, 'classVersionType' => $_classVersionType, 'versiontype' => $SaveTypeArr[0]['status'], 'listOfRole' => $listOfRole));

            if (intval($classDetails['node_type_id']) == 3 && $mode == 'Edit') {
                $view->setTemplate('administrator/classes/nodez-instance-edit.phtml');
            }

            /* Start Code By Arvind Soni For Caching */
            if (intval($classDetails['node_type_id']) == 2) {
                $manager->write($instance_file_name, $view);
            }
            /* End Code By Arvind Soni For Caching */
            return $view;
        }
        /* End Code By Arvind Soni For Caching */
    }

    /**
     * Created by Amit Malakar
     * Get instance structure for Print
     *
     * @return ViewModel
     */
    public function instanceStructurePrintAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $class_id = $post['node_y_class_id'];
            $mode = $post['mode'];
            $classArray = $this->getClassesTable()->getClassList($class_id);
            $data = $this->getClassesTable()->getClassChild($class_id);
            $classArray['childs'] = $data['ids'];
            $classArray['childsArray'] = $data['data'];
            $nodeType = $this->getClassesTable()->getNodeType($classArray['node_type_id']);
            $classArray['instances'] = $this->getClassesTable()->getClassStructurePrint($class_id);
        }

        // CLASS STRUCTURE
        $classArray['childsArray'] = $this->getPrintStructure($classArray['childsArray']);

        // INSTANCE STRUCTURE
        $instanceArray = $this->getChildClassInstancePrint(array($post['node_instance_node_id']), $class_id, array());
        $insArrFrm = $this->formatInstanceStructure($instanceArray, array());
        $insArrFrm = $this->arrayCollectSameChilds($insArrFrm);

        $instanceArrayFormatted = array();
        foreach ($insArrFrm as $key => $res) {
            $first_key = key($res);
            $instanceArrayFormatted[$first_key] = $res[$first_key];
        }

        return new ViewModel(array('classArray' => $classArray,
            'instanceArrayFormatted' => $instanceArrayFormatted,
            'mode' => $mode,
            'nodeType' => $nodeType,
            'nodeInstanceNodeId' => $post['node_instance_node_id'],
        ));
    }

    /* function use here for display instance class using class id */

    public function deleteInstancePropertyAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            //$delete_ids                 =   explode(',',$post['classPropertyId']);
            $node_y_class_id = $this->getClassesTable()->deleteInstanceAll($post['classPropertyId']);
        }
        exit;
    }

    public function deleteInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $delete_ids = explode(',', $post['delete_ids']);
            $node_y_class_id = $this->getClassesTable()->deleteInstance($delete_ids);
        }
        exit;
    }

    public function deleteClassCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($post['is_instance'] == 'N') {
                if (intval($post['counter']) == 1) {
                    $returnArray = $this->getClassesTable()->getClassNameAndInstanceCount($post['class_id']);

                    if (intval($returnArray['total_instance']) > 0)
                        $json['msg'] = "There are currently " . $returnArray['total_instance'] . " instances of class " . $returnArray['class_name'] . ". If you delete class " . $returnArray['class_name'] . " all dependent instances will also be removed. Do you want to delete class " . $returnArray['class_name'] . "?";
                    else
                        $json['msg'] = "Do you want to delete class " . $returnArray['class_name'] . "?";
                }
                else {
                    $json['msg'] = 'If you delete these classes then all dependent instances will also be removed. Do you want to delete these classes?';
                }
            } else {
                $json['msg'] = 'Are you sure you want to delete this instance?';
            }
        }
        print json_encode($json);
        exit();
    }

    /**
     * Modified By: DIVYA RAJPUT
     * Date: Nov 24, 2015
     * This is used to show all subclasses
     * or search subclasses by node_id or caption
     */
    public function getNodeYClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $newClassArray = array();
        $class_data_array = array();
        $instance_property_array = array();


        if ($request->isXmlHttpRequest()) {
            $post = $request->getPost()->toArray();
            $classArray = $this->getClassesTable()->getClassNodeYList($post['node_class_id'], $post['search_text']);
            $childArray = array_filter(explode(',', $post['childs']));
        } else if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $classArray = $this->getClassesTable()->getClassNodeYList($post['node_class_id']);
            $childArray = array_filter(explode(',', $post['childs']));
        }

        /*
         * Modified By Divya Rajput
         * To show Plural/Common Name
         */
        foreach ($classArray as $key => $dataArray) {
            $node_y_id = $dataArray['node_id'];
            $node_class_id = NODEZ_CLASS_ID;
            $instance_id_arr = $this->getClassesTable()->getInstaceIdByNodeXYAndNodeInstance($node_y_id, $node_class_id);
            $node_instance_id = $instance_id_arr[0]['node_instance_id'];
            $instance_property_array[$key] = $this->getClassesTable()->getNodeInstanceValueBy($node_instance_id);
        }

        $node_z_class_property = $this->getClassesTable()->getNodeProperty(NODEZ_CLASS_ID);

        foreach ($instance_property_array as $key => $classValue) {
            foreach ($node_z_class_property as $node_z_prop) {
                if ($classValue[$node_z_prop['node_class_property_id']]) {
                    $class_data_array[$key][$node_z_prop['caption']] = ($classValue[$node_z_prop['node_class_property_id']]) ? ($classValue[$node_z_prop['node_class_property_id']]) : '';
                }
            }
        }
        /* End Here */

        return new ViewModel(array('newClassArray' => $classArray, 'childArray' => $childArray, 'class_data' => $class_data_array));
    }


    /**
     * Created by Amit Malakar
     * Date: 20 Jan, 2016
     * Get Course Menu list
     */
    public function getCourseMenuListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $json = $this->getAdministratorTable()->getLeftMenu();
        }
        $config = $this->getServiceLocator()->get('config');
        $course_menu_id = $config['constants']['COURSE_NEW_COURSE_MENU'];
        print json_encode($json[$course_menu_id]);
        exit;
    }

    public function createActionAction() {
        //echo '<pre>'; print_r('hi'); die();
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            //$json = $this->getAdministratorTable()->getUrl($post['id']);
            $menuArray = $this->getAdministratorTable()->getLeftMenuFromClassesForCtrlPlusAction();
            $json = $menuArray[$post['id']];
            $config = $this->getServiceLocator()->get('config');
            $process_menu_id = $config['constants']['PROCESS_MENU_ID'];
            $association_menu_id = $config['constants']['ASSOCIATION_MENU_ID'];
            $workflow_menu_id = $config['constants']['WORKFLOW_MENU_ID'];
            if ($post['id'] == $process_menu_id || $post['id'] == $association_menu_id || $post['id'] == $workflow_menu_id) {
                $newNodeId = $this->getClassesTable()->getLastNumber('node', 'node_id');
                $json['new_node_id'] = $newNodeId;
            }
        }
        print json_encode($json);
        exit;
    }

    /**
     * Created By Awdhesh Soni
     * ON Date 09th OCT 2015
     * get Node X details
     */
    public function getNodeXAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];
            $node_type_id = $post['nodeTypeId'];
            $node_id = $post['node_id'];
            $nodeType = $post['nodeType'];
            $nodeName = $post['nodeName'];
            $nodeIsChild = $post['nodeIsChild'];
            $nodeClassX = $this->getClassesTable()->getClassNodeType($node_type_id);
        }

        return new ViewModel(array('nodeClassX' => $nodeClassX, 'mode' => $mode, 'node_id' => $node_id, 'nodeType' => $nodeType, 'nodeName' => $nodeName, 'nodeIsChild' => $nodeIsChild));
    }

    /**
     * Created By Awdhesh Soni
     * ON Date 09th OCT 2015
     * get Node X details
     */
    public function getNodeXThirdPaneAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];
            $node_y_id = $post['node_y_id'];
        }

        $nodeClassX = $this->getClassesTable()->getNodeProperty($node_y_id);
        return new ViewModel(array('nodeClassX' => $nodeClassX, 'mode' => $mode));
    }

    /**
     * Created By Divya Rajput
     * ON Date 6th OCT 2015
     * To export instance Data
     */
    public function getPropertyChild($propertyArray, $subChildArray) {
        $caption = "";
        foreach ($subChildArray as $key => $childArray) {
            if (!is_array($childArray['child'])) {
                if (intval($childArray['encrypt_status']) == 1)
                    $propertyArray[] = $this->getClassesTable()->mc_decrypt($childArray['caption'], ENCRYPTION_KEY);
                else
                    $propertyArray[] = $childArray['caption'];
            }

            if (is_array($childArray['child'])) {
                $propertyArray = $this->getPropertyChild($propertyArray, $childArray['child']);
            }
        }
        return $propertyArray;
    }

    public function getExportHeader($node_class_id) {
        $headerArray = $this->getClassesTable()->getSubClassStructureWithSequence($node_class_id);
        $propertyArray = array();
        $tempexportData = $this->getPropertyChild($propertyArray, $headerArray[0]['property']);
        return $tempexportData;
    }

    public function getExportInstanceHeader($node_class_id) {
        $headerArray = $this->getClassesTable()->getSubClassStructureWithSequence($node_class_id);
        $propertyArray = array();
        $tempexportData = $this->getPropertyChildA($propertyArray, $headerArray[0]['property']);
        return $tempexportData;
    }

    public function getPropertyChildA($propertyArray, $subChildArray) {
        $caption = "";
        foreach ($subChildArray as $key => $childArray) {
            if (!is_array($childArray['child'])) {
                if (intval($childArray['encrypt_status']) == 1)
                    $propertyArray[] = $childArray['node_class_property_id'] . '@#@#@' . $this->getClassesTable()->mc_decrypt($childArray['caption'], ENCRYPTION_KEY);
                else
                    $propertyArray[] = $childArray['node_class_property_id'] . '@#@#@' . $childArray['caption'];
            }

            if (is_array($childArray['child'])) {
                $propertyArray = $this->getPropertyChildA($propertyArray, $childArray['child']);
            }
        }
        return $propertyArray;
    }

    /**
     * Created By Divya Rajput
     * ON Date 6th OCT 2015
     * To export instance Data
     */
    public function exportInstanceDataAction() {
        $request                = $this->getRequest();
        $awsObj                 = $this->AwsS3();
        if ($request->isXmlHttpRequest()) {
            if ($request->getPost('node_class_id')) {
                $filename = 'instance_' .$request->getPost('node_class_id').'_'. date('mdYhis') . '.csv';

                //array_map('unlink', glob("data/temp/*"));


                $path               = "data/temp/" . $filename;
                $handle             = fopen($path, 'w') or die('Cannot open file: ' . $filename); 
                $exportData2        = array('nodeInstanceId', 'nodeId');


                $node_class_id      = $request->getPost('node_class_id');
                $exportDataH        = $this->getExportHeader($node_class_id);
                $exportData1        = $this->getExportInstanceHeader($node_class_id);

                $exportData         = array_merge($exportData2, $exportData1);
                $exportDataA        = array_merge($exportData2, $exportDataH);
                //header end
                fputcsv($handle, $exportDataA);

                //$exportData
                $exportContent = $this->getClassesTable()->getClassInstanceData($node_class_id);
                // 0.46
                $tempArray = array();

                //Content Start
                foreach ($exportContent as $content) {

                    $className = $content['node_class_caption'];

                    $data = array();

                    if (is_array($tempArray[$content['node_instance_id']])) {
                        $key = $content['node_instance_id'];
                        $tempArray[$key][$content['node_class_property_id'] . '@#@#@' . $content['caption']] = $content['value'];
                    } else {
                        $data['node_instance_id'] = $content['node_instance_id'];
                        $data['node_id'] = $content['node_id'];
                        $data[$content['node_class_property_id'] . '@#@#@' . $content['caption']] = $content['value'];
                        $key = $content['node_instance_id'];
                        $tempArray[$key] = $data;
                    }
                }
                // 2.1
                $temp_array = array();

                foreach ($tempArray as $key => $contentArray) {
                    $arra1 = array_keys($contentArray);
                    $arra2 = array_values($exportData);
                    $diffArray = array_diff($arra2, $arra1);
                    $insArray = array_intersect($arra2, $arra1);
                    unset($diffArray[0]);
                    unset($diffArray[1]);

                    $temp_array[0] = $contentArray['node_instance_id'];
                    $temp_array[1] = $contentArray['node_id'];

                    foreach ($insArray as $key => $value) {
                        $temp_array[$key] = str_replace("&rsquo;", "'", stripslashes(mb_convert_encoding(str_replace($contentArray['node_class_property_id'] . '@#@#@', '', $contentArray[$value]), "HTML-ENTITIES", "UTF-8")));
                    }

                    foreach ($diffArray as $keys => $values) {
                        $temp_array[$keys] = '';
                    }
                    ksort($temp_array);
                    fputcsv($handle, $temp_array);
                }
                //content End


                /*
                 * remove all files from temp folder
                 * To save memory
                 */
                fclose($handle);

                $file                   = $awsObj->setFileData($path,ABSO_URL.$path,'file');
                if($file['object_url'] != '')
                unlink(ABSO_URL.$path);
                print json_encode(array('path' => $file['object_url']));
                exit;
            }
        }
    }

    /**
     * Created By Divya Rajput
     * ON Date 6th OCT 2015
     * To generate empty instance template
     */
    public function generateInstanceTemplateAction() {
        $request = $this->getRequest();
        $awsObj                 = $this->AwsS3();
        if ($request->isXmlHttpRequest()) {
            if ($request->getPost('node_class_id')) {
                //array_map('unlink', glob("data/temp/*"));
                $filename = 'generateInstanceTemplate_' . $node_class_id . '_' . date('mdY') . '.csv';
                $path = "data/temp/" . $filename;
                $handle = fopen($path, 'w') or die('Cannot open file:  ' . $filename);

                $exportData = "";
                $node_class_id = $request->getPost('node_class_id');
                $exportData = $this->getExportHeader($node_class_id);
                fputcsv($handle, $exportData);
                //header end
                /*
                 * remove all files from temp folder
                 * To save memory
                 */
                fclose($handle);

                $file                   = $awsObj->setFileData($path,ABSO_URL.$path,'file');
                if($file['object_url'] != '')
                {
                    unlink(ABSO_URL.$path);
                    header('Pragma: public');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/csv; charset=utf-8');
                    header('Content-Disposition: attachment; filename="' . $file['object_url'] . '"');
                    header('Content-Transfer-Encoding: binary');
                    header('Cache-Control: max-age=0');

                    print json_encode(array('path' => $file['object_url']));
                    exit;
                }
            }
        }
    }

    /**
     * Created By Divya Rajput
     * ON Date 15th OCT 2015
     * To implode instance Data
     */
    public function importInstanceDataAction() {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $file = $request->getFiles()->toArray();
            $node_class_id = $request->getPost('hidden-class-id');

            /* get header content to compare */
            $exportData1 = array('nodeInstanceId', 'nodeId');
            $exportData2 = $this->getExportHeader($node_class_id);
            $headerArray = array_merge($exportData1, $exportData2);

            $file_name = $file['import_instance_file']['name'];
            $fileext = substr(strstr($file_name, '.'), 1);
            $filesize = $file['import_instance_file']['size'];
            $fileName = $file['import_instance_file']['tmp_name'];

            if (($handle = fopen($fileName, "r") ) !== FALSE) {
                $i = 0;
                $template = '';
                $insert = 0;
                $update = 0;
                $disregard = 0;

                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    $counting = count($data);

                    if ($i == 0) {
                        if ((trim($data[0]) == 'nodeInstanceId') && (trim($data[1]) == 'nodeId')) {
                            for ($count = 0; $count < $counting; $count++) {
                                if (trim($data[$count]) != trim($headerArray[$count])) {
                                    print json_encode(array('error' => 'error'));
                                    exit;
                                }
                            }

                            $headerDataArray = $headerArray;
                        } else if ((trim($data[0]) != 'nodeInstanceId') && (trim($data[0]) == 'nodeId')) {
                            print json_encode(array('error' => 'error'));
                            exit;
                        } else if ((trim($data[0]) == 'nodeInstanceId') && (trim($data[0]) != 'nodeId')) {
                            print json_encode(array('error' => 'error'));
                            exit;
                        } else if ((trim($data[0]) != 'nodeInstanceId') && (trim($data[0]) != 'nodeId')) {
                            unset($headerArray[0]);
                            unset($headerArray[1]);
                            $headerDataArray = array_values($headerArray);

                            for ($count = 0; $count < $counting; $count++) {
                                if (trim($data[$count]) != trim($headerDataArray[$count])) {
                                    print json_encode(array('error' => 'error'));
                                    exit;
                                }
                            }
                            $template = 'generateInstance';
                        }
                    } else {
                        $trimmed_data = array_filter(array_map('trim', $data));

                        if (!empty($trimmed_data)) {
                            if (count($headerDataArray) == count($data)) {
                                $finalDataArray[$i] = $data;
                            } else {
                                print json_encode(array('error' => 'error'));
                                exit;
                            }
                        } else {
                            $disregard++;
                        }
                    }
                    $i++;
                }

                $sequence = $this->getClassesTable()->getSubClassStructureWithSequence($node_class_id);
                $propertyArray = array();
                $propertClassIdArray = $this->getClassesTable()->getImportancePropertyChild($propertyArray, $sequence[0]['property']);


                $typeArray = $this->getClassesTable()->getClassList($node_class_id);
                $node_type_id = $typeArray['node_type_id'];

                foreach ($finalDataArray as $finalArray) {
                    $status = $this->getClassesTable()->saveImportInstance($node_class_id, $finalArray, $template, $propertClassIdArray, $node_type_id);

                    if (trim($status) === 'insert') {
                        $insert++;
                    } else {
                        if ($status > 0) {
                            $update++;
                        }
                    }
                }
                fclose($handle);
                print json_encode(array('success', 'insert' => $insert, 'update' => $update, 'disregard' => $disregard));
                exit;
            }
        }
        return false;
    }

    /* End Here */

    /* function here to check instance data insert or not */

    public function checkMappingClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $json = array();
        $nodedetails = array();
        $nodePropertydetails = array();

        if ($request->isPost()) {

            $post = $request->getPost()->toArray();
            $countMapInstanceExits = $this->getClassesTable()->checkMappingInstance($post['mapping_class_id']);
        }

        $json['count'] = $countMapInstanceExits;
        print json_encode($json);
        exit;
    }

    /**
     * Created and Modified By: DIVYA RAJPUT
     * Date: Nov 23, 2015
     * This is used to show subclasses structure
     */
    public function subClassStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $temp_class_array = array();
        $disable_expand_icon_array = array();

        /* Start Code By Arvind Soni For Caching */
        $sub_class_file_name = '';
        $cachedData = "";
        //$manager = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            /* Start Code By Arvind Soni For Caching */
            //$sub_class_file_name        =   'sub_class_structure_'.$post['class_id'];
            //$cachedData                 =   $manager->read($sub_class_file_name);
            if ($cachedData == "") {
                $classArray = $this->getClassesTable()->getClassList($post['class_id']);

                $node_class_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);
                $temp_class_array[] = $node_class_id;


                $data = $this->getClassesTable()->getClassStructureWithSequence($post['countnumber'], $post['class_id'], $temp_class_array, $disable_expand_icon_array);
                $classArray['childs'] = $data['ids'];
                $classArray['childsArray'] = $data['data'];
                $classArray['number_print'] = $data['number_print'];
                $classArray['disable_expand'] = $data['disable_expand_icon'];

                //$nodeType                   =   $this->getClassesTable()->getNodeType($classArray['node_type_id']);

                $classArray['instances'] = $this->getClassesTable()->getSubClassStructureWithSequence($post['class_id']);
                //$node_id                    =   $this->getClassesTable()->getNodeId('node-class','node_class_id',$post['class_id']);
                //$nodedetails                =   $this->getClassesTable()->nodeTypes();
            }
            /* End Code By Arvind Soni For Caching */
        }

        if ($cachedData != "") {
            return $cachedData;
        } else {
            $view = new ViewModel(array('classArray' => $classArray, 'countnumber' => $post['countnumber'] /* 'nodeType' => $nodeType, 'nodedetails'=>$nodedetails */));
            //$manager->write($sub_class_file_name, $view);
            return $view;
        }
    }

    /* END HERE */

    /**
     * Created By: DIVYA RAJPUT
     * Date: Nov 25, 2015
     * This is used to show subclasses structure for instances
     */
    public function instanceSubClassStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $instance_status_array = array();
        $mode = '';

        /* Start Code By Arvind Soni For Caching */
        $instance_sub_class_file_name = '';
        $cachedData = "";
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $mode = $post['mode'];
            $node_y_id = $post['node_y_id'];
            $line_count_number = $post['line_count_number'] /* + 1 */;
            $resp_number_print = $post['resp_number_print'];
            $section_mode = ($post['section_mode']) ? ($post['section_mode']) : '';  //yes only for instance subclass structure

            /* Start Code By Arvind Soni For Caching */
            $instance_sub_class_file_name = 'instance_sub_class_structure_' . strtolower($mode) . "_" . $post['class_id'];
            $cachedData = ''; //$manager->read($instance_sub_class_file_name);

            if ($cachedData == "") {
                $classArray = $this->getClassesTable()->getClassList($post['class_id']);



                $dataArrayTemp = $this->getClassesTable()->getInstaceIdByNodeXYAndNodeInstance($node_y_id, $post['class_id']);


                $instance_id_array = array();
                foreach ($dataArrayTemp as $keytemp => $valueTemp) {
                    $instance_id_array[] = $this->getClassesTable()->getinstanceDetailsByNodeId($valueTemp['node_x_id']);
                }



                $tempdata = array();

                if (is_array($instance_id_array) && !empty($instance_id_array)) {
                    /* foreach($instance_id_array as $instance_id){
                      $data               =   $this->getClassesTable()->getInstanceChildANew($mode, $classArray, $post['class_id'], $instance_id, $section_mode);
                      $tempdata[]         =   $data['data'];
                      }
                      foreach($tempdata as $key => $value)
                      {
                      $classArray['childsArray'][]      =   $value;
                      } */
                    $data = $this->getClassesTable()->getClassChild($post['class_id']);

                    /* foreach($instance_id_array as $instance_id){
                      $check_array                    =   array();
                      $instanceArray                  =   $this->getClassesTable()->getInstanceStructure($instance_id, $is_instance);

                      $instanceArrayProp              =   $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type='instance', $instanceArray['instances']['property']);
                      $currentNumber                  =   intval($line_count_number) + intval($instanceArrayProp) + 1 + 1;
                      $currentNumber                  =   intval($instanceArrayProp) + 1 + 1;
                      $numberPS                       =   $this->getClassesTable()->getNumberPrintStructure($mode, $is_type='instance', $instance_id, $data['data'], $currentNumber, $check_array, 'sub-instance');
                      $classArray['childsArray'][]    =   $numberPS;
                      } */
                } else {
                    $data = $this->getClassesTable()->getClassChild($post['class_id']);
                    //$data                           =   $this->getClassesTable()->getInstanceChildANew($mode, $classArray, $post['class_id'], '', $section_mode);
                    //print_r($data);

                    /* $classArray['childsArray'][]    =   $data['data']; */
                    $check_array = array();
                    $main_array = array();
                    $check_array[] = $post['class_id'];

                    $subClassArrayData = $this->getClassesTable()->getClassStructure($post['class_id']);
                    $current_number = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, 'instance', $subClassArrayData[0]['property']);

                    $currentNumber = intval($current_number) + intval($line_count_number) + 1 + 1;
                    $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', '', $data['data'], $currentNumber, $check_array, 'sub-instance');

                    $classArray['childsArray'][] = $numberPS;

                    /* $sPCdata                        =   $this->getClassesTable()->getSPCommonName($post['class_id']);
                      $classArray['class_data']       =   $sPCdata; */
                }
                //print_r($numberPS);
                //print_r($classArray);

                $node_x_id_array = $this->getClassesTable()->getNodeXIdFromXYTable($node_y_id);
                $classArray['instances'] = $this->getClassesTable()->getClassStructure($post['class_id']);
                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);

                /* echo "<pre>";
                  print_r($classArray);
                  die; */


                //$data                       =   $this->getClassesTable()->getClassChild($post['class_id']);
                //print_r($data);

                $count_sub_instance = $post['count_instance'];
                $count = ++$count_sub_instance;
                $key = 0;
                $countnum = 0;

                foreach ($node_x_id_array as $node_x_id) {
                    $node_instance_id = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $node_x_id);
                    // 1298, 1299, 1300

                    if ($this->getClassesTable()->getClassIdByInstance($node_instance_id) == $post['class_id']) {
                        /* $dataA                                          =   $this->getClassesTable()->getInstanceChildA($mode, $classArray, $post['class_id'], 52917);
                         */

                        $classArray['subinstancesvalue'][$node_x_id] = $this->getClassesTable()->getNodeInstanceValueBy($node_instance_id);
                        //if($classArray['subinstancesvalue'][$node_x_id]['6356'] == 'Yes')
                           // $classArray['subinstancesvalue'][$node_x_id]['6356'] = 'No';

                        $instance_status_array[$node_x_id] = $this->getClassesTable()->getNodeInstanceStatusBy($node_instance_id);

                        $tempArray = array();
                        $node_x_id_new_array[$key]['node_x_id'] = $node_x_id;


                        $instanceClassArray = array();

                        $node_x_ids = $node_x_id . ",";
                        $retArray = array();
                        $textArray = array();
                        $tempCount = 0;
                        $check_array = array();


                        /* $npArray                                        =   "";
                          $node_x_id_new_arraya                           =   $this->getClassesTable()->CI($node_x_id, $post['class_id'], $npArray);
                          $node_x_id_new_array[$key]['number_print']      =   intval($node_x_id_new_arraya); */



                        $instanceArray = $this->getClassesTable()->getInstanceStructure($node_instance_id, 'Y');
                        //print_r($instanceArray);

                        $instanceArrayProp = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type = 'instance', $instanceArray['instances']['property']);
                        $currentNumber = intval($instanceArrayProp) + 1;
                        /* $data                           =   $this->getClassesTable()->getClassChild($post['class_id']); */
                        $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', $node_instance_id, $data['data'], $currentNumber, $check_array);

                        //print_r($numberPS);

                        /* echo count($numberPS);
                          print_r($numberPS[count($numberPS) - 1]['nextNum']); */

                        if (empty($numberPS)) {
                            $nextNum = intval($currentNumber) + 1;
                        } else {
                            $nextNum = intval($numberPS[count($numberPS) - 1]['nextNum']) + 1;
                        }



                        /* $node_x_id_new_arraya                           =   $this->getClassesTable()->getInstanceChildANew($mode, $classArray, $post['class_id'], $node_instance_id, $section_mode);
                          $node_x_id_new_array[$key]['number_print']      =   $node_x_id_new_arraya['number_print']; */
                        //print_r($numberPS);
                        $node_x_id_new_array[$key]['number_print'] = $nextNum;
                        $classArray['childsArray'][] = $numberPS;

                        $countnum++;
                        $key++;
                    }
                    //$key++;
                }

                //print_r($classArray);
            }
        }

        /* Start Code By Arvind Soni */
        $roleArray = array();
        $sendArray = array();
        if($classArray['node_class_id'] == '858' && $mode == 'Edit')
        {
            $roleArray              = $this->getClassesTable()->getInstanceListOfPerticulerClass(OPERATION_ROLE);
            $allRoleArray           = array_keys($roleArray);
            $existRoleArray         = array();
            foreach($classArray['subinstancesvalue'] as $key => $insArray)
            {
                $existRoleArray[$insArray['8756']]   = $insArray['8756'];
            }

            $existRoleArray         = array_keys($existRoleArray);
            $AddRoleArray           = array();
            foreach($allRoleArray as $index => $role)
            {
                if(!in_array($role, $existRoleArray))
                {
                    $AddRoleArray[] = $role;
                }
            }

            $newAddRoleArray        = array();
            foreach($AddRoleArray as $key => $roleNum)
            {
                $tempArray                          = array();
                $tempArray[LOCATION_ROLE_LNID]      = $classArray['subinstancesvalue'][current(array_keys($classArray['subinstancesvalue']))][LOCATION_ROLE_LNID];
                $tempArray[LOCATION_ROLE_RNID]      = $roleNum;
                $tempArray[LOCATION_ROLE_ANID]      = '';
                $tempArray[LOCATION_ROLE_L]         = $classArray['subinstancesvalue'][current(array_keys($classArray['subinstancesvalue']))][LOCATION_ROLE_L];
                $tempArray[LOCATION_ROLE_R]         = $roleArray[$roleNum]['Title'];
                $tempArray[LOCATION_ROLE_A]         = '';
                $tempArray[LOCATION_ROLE_E]         = '';
                $classArray['subinstancesvalue'][]  = $tempArray;

                $lastIndex = end(array_keys($node_x_id_new_array));
                $lastIndex = intval($lastIndex)+1;

                $number_print = $node_x_id_new_array[end(array_keys($node_x_id_new_array))]['number_print'];

                $node_x_id_new_array[$lastIndex]['node_x_id']       = end(array_keys($classArray['subinstancesvalue']));
                $node_x_id_new_array[$lastIndex]['number_print']    = $number_print;
            }
        }
        else if($classArray['node_class_id'] == '858' && $mode == 'Clone')
        {
            $sendArray = array('location' => $post['location'], 'role_id' => $post['role_id'], 'role_name' => $post['role_name']);
        }
        /* End Code By Arvind Soni */

        if ($cachedData != "") {
            return $cachedData;
        } else {
            // FILE PARSER
            $config = $this->getServiceLocator()->get('config');
            $view = new ViewModel(array(
                'temp_instance_id' => $post['temp_instance_id'], //
                'instance_status_array' => $instance_status_array,
                'node_x_id_array' => $node_x_id_new_array,
                'classArray' => $classArray,
                'count' => $count,
                'mode' => $mode, //
                'line_count_number' => $line_count_number,
                'resp_number_print' => $resp_number_print,
                //'nodeType'              => $nodeType,
                //'nodedetails'           => $nodedetails,
                'valueClassPropId' => $config['constants']['METHOD_VALUE_CP_ID'],
                'rootClassLabel' => base64_decode($post['sub_class_label']),
                'roleArray' => $roleArray,
                'sendArray' => $sendArray
            ));


            $manager->write($instance_sub_class_file_name, $view);
            return $view;
        }
    }

    /* start code of node z class instances */

    public function classListNewAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $order_by = 'node_class_id';
        $order = 'DESC';
        $filter_operator = '';
        $search_text = '';
        $filter_field = '';
        $mode = '';
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($post['order_by'] != "")
                $order_by = $post['order_by'];

            if ($post['order'] != "")
                $order = $post['order'];

            if ($post['mode'] != "")
                $mode = $post['mode'];


            if ($post['filter_operator'] != '' && $post['search_text'] != '') {
                $filter_operator = $post['filter_operator'];
                $search_text = $post['search_text'];
                $filter_field = $post['filter_field'];
            }
        }

        $classArray = $this->getClassesTable()->getClassListNew($order, $order_by, $filter_operator, $search_text, $filter_field);

        return new ViewModel(array(
            'order_by' => $order_by,
            'order' => $order,
            'classArray' => $classArray,
            'mode' => $mode
        ));
    }

    public function instanceListNewAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $node_class_id = '';
        $order_by = '';
        $order = '';
        $filter_operator = '';
        $search_text = '';
        $filter_field = '';
        $mode = '';

        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if ($post['mode'] == 'Normal') {
                $mode = 'Normal';
                $order_by = 'node_instance_id';
                $order = 'DESC';
                $node_class_id = $post['class_id'];
            }

            if ($post['mode'] == 'Ajax') {
                $mode = 'Ajax';
                $order_by = $post['order_by'];
                $order = $post['order'];
                $node_class_id = $post['class_id'];
            }

            if ($post['filter_operator'] != '' && $post['search_text'] != '') {
                $filter_operator = $post['filter_operator'];
                $search_text = $post['search_text'];
                $filter_field = $post['filter_field'];
            }
        }

        $instanceArray = $this->getClassesTable()->getInstanceListAgain($node_class_id, $order, $order_by, $filter_operator, $search_text, $filter_field);

        return new ViewModel(array(
            'order_by' => $order_by,
            'order' => $order,
            'instanceArray' => $instanceArray,
            'mode' => $mode,
            'node_class_id' => $node_class_id,
        ));
    }

    function generateRandomStringAction($length = 8) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    /* end code of node z class instances */

    /**
     * Created By Divya Rajput
     * Date: Dec 15, 2015
     * Purpose: To remove subclass from inside subclass
     */
    public function deleteSubClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $primary_class_id = $post['node_y_id'];
            $child_class_id = $post['node_x_id'];
            $node_class_id = $post['node_class_id'];
            $sub_class_id = $post['sub_class_id'];

            $instanceArray = $this->getClassesTable()->fetchSubClassInstances($node_class_id);
            foreach ($instanceArray as $key => $instanceData) {
                $node_id = $instanceData['node_x_id'];

                $node_instance_id = $this->getClassesTable()->getinstancesDetailsById($node_id, $sub_class_id);
                if ($node_instance_id) {
                    $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_instance_id', $node_instance_id, 'equalto');
                    $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $node_instance_id, 'equalto');
                    $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $node_id, 'equalto');
                }
                $this->getClassesTable()->deleteSubClass($primary_class_id, $child_class_id);
            }
            $json['msg'] = 'delete';
            print json_encode($json);
            exit;
        }
        exit();
    }

    /* TO delete sub instances */

    public function deleteSubClassInstancesAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $node_id = $post['instance_node_id'];
            $sub_class_id = $post['sub_class_id'];

            $this->getandRemoveSubInstance($node_id);
        }
        exit;
    }

    /* End Here */

    public function createFileOfUserAction() {
        //exit();
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        
        /* Start Code By Arvind Soni For Caching */
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        $manager->clear('individual_user_list');
        $userArray = $this->getClassesTable()->getIndividualUsersList();
        $manager->write('individual_user_list', $userArray);
        /* End Code By Arvind Soni For Caching */
        // AWS S3
        // $awsObj      = new AwsS3();
        // $awsFilePath = "data/perspective_cache/individual_user_list";
        // $userArray   = $this->getClassesTable()->getAllUserList();
        // $awsObj->setFileData($awsFilePath, json_encode($userArray), "text");

        // $awsFilePathRole = "data/perspective_cache/role_list";
        // $roleArray   = $this->getClassesTable()->getRoleListOfCB();
        // $awsObj->setFileData($awsFilePathRole, json_encode($roleArray), "text");
        exit;
    }

    public function getandRemoveSubInstance($node_id) {
        $nodeArray = array();
        $node_instance_id = $this->getClassesTable()->getinstanceDetailsByNodeId($node_id);
        $nodeArrayData = $this->getClassesTable()->fetchNodeInstanceProperty($node_instance_id);
        
        $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $node_id, 'equalto');
        $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $node_instance_id, 'equalto');
        $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_instance_id', $node_instance_id, 'equalto');
        $this->getClassesTable()->commonDeleteMethod('node', 'node_id', $node_id, 'equalto');


        if (count($nodeArrayData) > 0) {
            foreach ($nodeArrayData as $key => $node_id_data) {
                $nodeArray[] = $node_id_data['node_id'];
            }
        }

        if (count($nodeArray) > 0) {
            $this->getClassesTable()->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
        }

        $dataArray = $this->getClassesTable()->getInstanceChild($node_id);

        if (count($dataArray) > 0) {
            foreach ($dataArray as $key => $value) {
                $node_x_id = $value['node_x_id'];
                if ($node_x_id > 0) {
                    $this->getandRemoveSubInstance($node_x_id);
                }
            }
        }
    }

    /**
     * Created By Arvind Soni On Dec 17th, 2015
     * for open node rights flyout
     * And searching users and add users
     */
    public function getIndividualUsersAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $userArray = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $propertyId = $post['propertyId'];
            $propertyName = $post['propertyName'];
            $instanceValue = $post['instanceValue'];
            $rightsType = $post['rightsType'];
            $mode = $post['mode'];
            if($rightsType == 'Actor')
            {
                $tempArray = $this->getUsersFromFile();
            }
            else if($rightsType == 'Role')
            {
                $tempArray      = $this->getRolesFromFile();
            }
            $userIds = explode(",", $instanceValue);
            foreach ($tempArray as $node_id => $value) {
                if (in_array($node_id, $userIds)) {
                    $userArray[] = $value;
                }
            }
        }

        return new ViewModel(array(
            'userArray' => $userArray,  
            'propertyId' => $propertyId,
            'propertyName' => $propertyName,
            'instanceValue' => $instanceValue,
            'mode' => $mode,
            'rightsType' => $rightsType
        ));
    }

    public function getUsersFromFile() {
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);
        $newUserArray = $manager->read('individual_user_list');
        foreach ($newUserArray as $key => $value) {
            if ($value['email_address'] != "")
                $userArray[$value['node_id']] = $value;
        }

        // AWS S3
        /*$awsObj       = new AwsS3();
        $awsFilePath  = "data/perspective_cache/individual_user_list";
        $newUserResJson  = $awsObj->getFileData($awsFilePath);
        $newUserJson     = $newUserResJson['data'];
        $userArray = array();
        if(strlen($newUserJson)) {
            $newUserArray = json_decode($newUserJson, true);
            foreach ($newUserArray as $key => $value) {
                if ($value['email_address'] != "")
                    $userArray[$value['node_id']] = $value;
            }
        }*/
        return $userArray;
    }

    public function getRolesFromFile() {
        // AWS S3
        $awsObj       = new AwsS3();
        $awsFilePath  = "data/perspective_cache/role_list";
        $newUserRoleJson  = $awsObj->getFileData($awsFilePath);
        $newRoleJson     = $newUserRoleJson['data'];
        $roleArray = array();
        if(strlen($newRoleJson)) {
            $newRoleArray = json_decode($newRoleJson, true);
            foreach ($newRoleArray as $key => $value) {
                if ($value['role'] != "")
                    $roleArray[$value['role_id']] = $value;
            }
        }
        return $roleArray;
    }

    public function getAllUsersAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        $userArray = $this->getUsersFromFile();

        $items = array();
        foreach ($userArray as $key => $value) {
            $items[] = $value;
        }

        /* $items = array(
          array('nodeid' => 101,'firstname' => 'Arvind'),
          ); */
        echo json_encode($items);
        exit;
    }

    public function getAllRolesAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        $roleArray = $this->getRolesFromFile();

        $items = array();
        foreach ($roleArray as $key => $value) {
            $items[] = $value;
        }

        
        echo json_encode($items);
        exit;
    }

    public function addParticipantAction() {
        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();

        $userList           = array();
        if ($request->isPost()) {
            $post           = $request->getPost()->toArray();
            $id             = $post['id'];
            if($post['rightsType'] == 'Actor')
            {
                $userArray      = $this->getUsersFromFile();
            }
            else if($post['rightsType'] == 'Role')
            {
                $userArray      = $this->getRolesFromFile();
            }
            
            $userList       = $userArray[$id];
        }
        echo json_encode($userList);
        exit;
    }

    public function record_sort($records, $field, $reverse = false) {
        $hash = array();

        foreach ($records as $record) {
            $hash[$record[$field]] = $record;
        }

        ($reverse) ? krsort($hash) : ksort($hash);

        $records = array();

        foreach ($hash as $record) {
            $records [] = $record;
        }

        return $records;
    }

    public function filterUsersAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        $userArray = $this->getUsersFromFile();

        $userList = array();
        $newUserArray = array();
        $type = '';
        $field_name = '';
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $userIds = explode(",", $post['userIds']);
            $selUserIds = explode(",", $post['selUserIds']);
            $dselUserIds = explode(",", $post['dselUserIds']);
            $type = $post['type'];
            $field_name = $post['field_name'];
            $mode = $post['mode'];

            if ($type == "Selected" && $field_name == "node_id") {
                foreach ($selUserIds as $k => $id) {
                    if (trim($id) != "") {
                        $userArray[$id]['select'] = 'Y';
                        $newUserArray[] = $userArray[$id];
                    }
                }

                foreach ($dselUserIds as $k => $id) {
                    if (trim($id) != "")
                        $newUserArray[] = $userArray[$id];
                }
            }

            if ($type == "Unselected" && $field_name == "node_id") {
                foreach ($dselUserIds as $k => $id) {
                    if (trim($id) != "")
                        $newUserArray[] = $userArray[$id];
                }

                foreach ($selUserIds as $k => $id) {
                    if (trim($id) != "") {
                        $userArray[$id]['select'] = 'Y';
                        $newUserArray[] = $userArray[$id];
                    }
                }
            }

            if ($type == "Asending" || $type == "Desending") {
                foreach ($userIds as $k => $id) {
                    if (trim($id) != "")
                        $newUserArray[] = $userArray[$id];
                }

                if ($type == "Desending") {
                    $newUserArray = $this->record_sort($newUserArray, $field_name, true);
                } else {
                    $newUserArray = $this->record_sort($newUserArray, $field_name);
                }
            }
        }

        return new ViewModel(array(
            'userArray' => $newUserArray,
            'type' => $type,
            'field_name' => $field_name,
            'mode' => $mode,
        ));
    }

    /* function here to get class name of node Z */

    public function getClassNameNodeZAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = '';
        $json = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $nodeId = $post['nodeId'];

            $classDetail = $this->getClassesTable()->getClassDetail($nodeId);

            $json['caption_name'] = $classDetail['caption'];
        }
        print json_encode($json);
        exit;
    }

    public function getChildClassInstance($sub_class_node_id_array, $node_class_id, $temp_array) {
        if (count($sub_class_node_id_array) > 0) {

            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {

                $node_instance_id = $this->getClassesTable()->getinstanceDetailsByNodeId($node_sub_class_id);

                if ($node_instance_id) {

                    $sub_class_node_id_new = $this->getClassesTable()->getNodeXIdFromXYTable($node_sub_class_id);

                    $nodeClassNodeId = $this->getClassesTable()->fetchNodeClassNodeId($node_instance_id);

                    $temp_array[$i]['childs'] = $this->getClassesTable()->fetchNodeInstanceProperty($node_instance_id);

                    if (count($sub_class_node_id_new) > 0) {
                        $temp_array[$i]['child_array'] = $this->getChildClassInstance($sub_class_node_id_new, $node_class_id, array());
                    }
                }
                $i++;
            }
        }
        return $temp_array;
    }

    /**
     * Modified by Amit Malakar
     * Get Instance structure for Instance Print
     * @param $sub_class_node_id_array
     * @param $node_class_id
     * @param $temp_array
     * @return mixed
     */
    private function getChildClassInstancePrint($sub_class_node_id_array, $node_class_id, $temp_array) {
        if (count($sub_class_node_id_array) > 0) {

            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {

                $node_instance_id = $this->getClassesTable()->getinstanceDetailsByNodeId($node_sub_class_id);
                if ($node_instance_id) {
                    $sub_class_node_id_new = $this->getClassesTable()->getNodeXIdFromXYTable($node_sub_class_id);
                    $nodeClassNodeId = $this->getClassesTable()->fetchNodeClassNodeId($node_instance_id);
                    $temp_array['childs'][$nodeClassNodeId][$node_instance_id] = $this->getClassesTable()->fetchNodeInstancePropertyPrint($node_instance_id);
                    // find parent node_instance_id
                    $temp_array['childs'][$nodeClassNodeId][$node_instance_id]['parent'] = $this->getClassesTable()->fetchNodeYFromXY($node_sub_class_id);
                    if (count($sub_class_node_id_new) > 0) {
                        ++$i;
                        $temp_array[$i] = $this->getChildClassInstancePrint($sub_class_node_id_new, $node_class_id, array());
                    }
                }
            }
        }

        return $temp_array;
    }

    /**
     * Created by Amit Malakar
     * Format instance structure for Instance Print
     * @param $instanceArray
     * @param $resultArray
     * @return array
     */
    private function formatInstanceStructure($instanceArray, $resultArray) {
        foreach ($instanceArray as $key => $value) {
            if ($key == 'childs') {
                if (count($value)) {
                    if (count($value) > 1) {
                        foreach ($value as $key1 => $val1) {
                            array_push($resultArray, array($key1 => $val1));
                        }
                    } else {
                        array_push($resultArray, $value);
                    }
                }
            } else {
                $resultArray = $this->formatInstanceStructure($value, $resultArray);
            }
        }

        return $resultArray;
    }

    /**
     * Created by Amit Malakar
     * Array structure manipulation for Instance Print
     * @param $instanceArray
     * @return array
     */
    private function arrayCollectSameChilds($instanceArray) {
        $resultArr = array();
        for ($i = 0; $i < count($instanceArray); $i++) {
            $firstKey = key($instanceArray[$i]);
            $pushFlag = 0;
            if (count($resultArr)) {
                $j = 0;
                foreach ($resultArr as $res) {
                    if (key($res) == $firstKey) {
                        $pushFlag = 1;
                        break;
                    }
                    $j++;
                }
            }
            if ($pushFlag) {
                foreach ($instanceArray[$i] as $value) {
                    $resultArr[$j][$firstKey] += $value;
                }
            } else {
                $resultArr[$i][$firstKey] = $instanceArray[$i][$firstKey];
            }
        }

        return $resultArr;
    }

    /*
     * Created By:   Divya Rajput
     * Page:         When Adding subclasses by using Add Subclass icon
     * Purpose:      To count classes's inner structure
     */

    public function countClassesDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $mode = 'Edit';
        $json = array();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $postDataObj = json_decode($post['mypostData']);
            $index = 0;

            foreach ($postDataObj as $key => $value) {
                $temp_class_array = array();
                $node_class_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $value->class_id);
                $temp_class_array[] = $node_class_id;
                $data = $this->getClassesTable()->fetchChildDataWithSequence($mode, $value->class_id, $temp_class_array);
                $json[$index]['class_id'] = $value->class_id;
                $json[$index]['next_class_id'] = $value->next_class_id;
                $json[$index]['number_print'] = $data['number_print'];
                $json[$index]['number_array'] = $data['number_array'];
                $index++;
            }
        }
        print json_encode($json);
        exit;
    }

    /* For View Class Layout and HTML Only */

    public function checkValidSelectorAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $action = '';
        $json = array();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $action = $post['action'];
        }

        /* This Section will validate selector ids which are using in layout on view class */
        if ($action == 'validation') {
            $returnArray = array();
            $sidArray1 = array();
            $sidArray2 = array();

            /* get selector ids(except <AUTO_CSS></AUTO_CSS> from layout)  and remove the duplicate selector ids from array */
            if (count($post['selector_ids']) > 0) {
                $sidArray1 = array_unique($post['selector_ids']);
            }

            /* get selector ids from <AUTO_CSS></AUTO_CSS> on layout property and remove the duplicate selector ids from array */
            if (count($post['auto_selector_ids']) > 0) {
                $sidArray2 = array_unique($post['auto_selector_ids']);
            }

            /* create a single array of selector ids from layout property */
            $mainArray = array_unique(array_merge($sidArray1, $sidArray2));

            /* check the valid and invalid selector ids */
            if (count($mainArray) > 0)
                $returnArray = $this->getClassesTable()->checkValidSelector($mainArray);

            /* if invalid selector ids have layout then create a error message */
            $errorMsg = '';
            if (count($returnArray['invalid']) > 0) {
                $errorMsg = 'The following class SID(s) are incorrect:<br/>';
                foreach ($returnArray['invalid'] as $key => $value) {
                    $sid = "SID_" . $value;
                    $errorMsg .= $sid . ", ";
                }

                $errorMsg = substr($errorMsg, 0, -2) . ".";
            }

            // check if valid FILE - Css instance id
            $config = $this->getServiceLocator()->get('config');
            $typeClassId = $config['constants']['FILE_TYPE_PROP_ID'];
            if ($post['css_instance_id']) {
                $cssResult = $this->getClassesTable()->checkValidCssFileInstance($post['css_instance_id'], $typeClassId);
                if (strtolower($cssResult) == 'css') {
                    $cssValid = 1;
                } else {
                    $cssValid = 0;
                    if ($errorMsg != '') {
                        $errorMsg .= '<br /><br />';
                    }
                    $errorMsg .= 'The provided CSS Id (ID) doesn\'t exist in FILE class.';
                }
            } else {
                // skip css if blank
                $cssValid = 1;
            }

            /* send valid, invalid selector id array and error message */
            $json['valid'] = $returnArray['valid'];
            $json['invalid'] = $returnArray['invalid'];
            $json['css_instance'] = $cssValid;
            $json['selector'] = $sidArray1;
            $json['error_msg'] = $errorMsg;
        }

        /* This Section will fetch the ruleset's, selector's and decorator's which are using in layout on view class */
        /* When all selector ids are valid then this code will execute otherwise not execute */
        if ($action == 'fetch_data') {
            /* fetch all ruleset, selector's and decorators */
            $returnArray = array();
            if ($post['selector_ids'] != "") {
                $returnArray = $this->getClassesTable()->fecthSelectorAndDeclarations($post['selector_ids'], $post['selector']);
            }

            /* set complete array of selectors and selector array into array */
            $combineData['main'] = $returnArray['main'];
            $combineData['sid'] = $returnArray['sid'];
            $combineData['form-data'] = $post['data'];

            /* create combile html, folder, css file and replace the sids from classes in layput */
            $json = $this->viewClassCombinedHtml($combineData);
        }
        print json_encode($json);
        exit();
    }

    public function manageInstanceBySpreadsheetAction() {
        $_obj = json_decode(file_get_contents("php://input"), TRUE);
        //echo '<pre>';print_r($_obj);die;
        $method = $_SERVER['REQUEST_METHOD'];
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        /*
          [classID] => 675
          [instanceID] => 101029
          [propertyType] => Check Box
          [propertyID] => 3492
          [propertyValue] => Highschool
         */
        $classTableObj = $this->getClassesTable();
        $classPropertyID = $propertyValue = array();
        $instanceId = $classId = $actionType = '';
        $nodeType = 2;
        $saveType = 'P';
        foreach ($_obj as $key => $value) {
            if ($value['actionType'] == 'delete') {
                $instanceId = (isset($value['instanceID'])) ? $value['instanceID'] : '';
                $actionType = $value['actionType'];
            } else {
                if ($value['propertyValue'] == '' || empty($value['propertyValue'])) {
                    continue;
                }
                $instanceId = (isset($value['instanceID'])) ? $value['instanceID'] : '';
                $classId = $value['classID'];
                $classPropertyID[] = $value['propertyID'];
                $actionType = $value['actionType'];
                if ($value['propertyType'] == 'Check Box') {
                    $propertyValue[] = str_replace(',', CHECKBOX_SEPERATOR, $value['propertyValue']) . CHECKBOX_SEPERATOR;
                } else {
                    $propertyValue[] = $value['propertyValue'];
                }
            }
        }
        //        echo '<pre>';
        //        print_r(array($classId,$classPropertyID, $propertyValue,$instanceId,$nodeType));
        //        die;

        if ((empty($classId) || $classId == '') && $actionType != 'delete') {
            exit;
        }
        if ($actionType == 'delete' && $instanceId != '') {

            $classTableObj->deleteInstance(array($instanceId));
        } else if ($instanceId == '') {
            //Add
            $instanceId = $classTableObj->createInstance('', $classId, $nodeType, $saveType, '');
            $classTableObj->createInstanceProperty($classPropertyID, $propertyValue, $instanceId, $nodeType);
        } else {
            //update

            $_details = $classTableObj->fetchNodeInstancePropertyData($instanceId, $classPropertyID[0]);
            $nodeInstancePropertyId = $_details[0]['node_instance_property_id'];
            $classTableObj->updateInstanceProperty(array($nodeInstancePropertyId), $propertyValue, $classPropertyID, $instanceId, $nodeType);
        }

        exit;
    }

    public function subClassForMappingAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $node_class_id = $this->getClassesTable()->getNodeId('node-class', 'node_id', $post['class_node_id'], 'node_class_id');
            $classPropArray = $this->getClassesTable()->getAllClassPropertyStructure($node_class_id);

            /* For Sub Class */
            $subClasses = $this->getClassesTable()->getClassChild($node_class_id);
            foreach ($subClasses['data'] as $key => $value) {
                $subClassPropArray = array();
                $sub_node_class_id = $this->getClassesTable()->getNodeId('node-class', 'node_id', $value['node_id'], 'node_class_id');
                $subClassPropArray = $this->getClassesTable()->getAllClassPropertyStructure($sub_node_class_id);

                foreach ($subClassPropArray as $k => $v) {
                    $subClassPropArray[$k] = '(Sub Class - ' . $value['caption'] . ') ' . $v;
                }

                $classPropArray = $classPropArray + $subClassPropArray;
            }

            $classArray = $this->getClassesTable()->getClassList(SUB_MAPPING_CLASS_ID);
            $classArray['instances'] = $this->getClassesTable()->getClassStructure(SUB_MAPPING_CLASS_ID);

            return new ViewModel(array(
                'classArray' => $classArray,
                'newNodeId' => $post['new_node_id'],
                'current_num' => $post['current_num'],
                'classPropArray' => $classPropArray
            ));
        }
    }

    public function subClassesOfLocationRoleAction() {
        //instanceSubClassStructure
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $insArray = $this->getClassesTable()->getInstanceListOfPerticulerClass(OPERATION_ROLE);
            $classArray = $this->getClassesTable()->getClassList(LOCATION_ROLE_DETAILS);
            $classArray['instances'] = $this->getClassesTable()->getClassStructure(LOCATION_ROLE_DETAILS);

            return new ViewModel(array(
                'classArray'        => $classArray,
                'newNodeId'         => $post['new_node_id'],
                'current_num'       => $post['current_num'],
                'location'          => $post['location'],
                'classPropArray'    => $insArray
            ));
        }
    }

    public function getNewNodeIdAction() 
    {
        $layout         = $this->layout();
        $layout->setTemplate('layout/simple');
        $request        = $this->getRequest();
        $newNode        = '';

        if ($request->isPost()) {
            $post       = $request->getPost()->toArray();
            if(strtolower($post['node_id']) == 'new')
            {
                $newNode =  $this->getClassesTable()->createNode();
            }
        }
        print json_encode($newNode);
        exit();
    }
    /**Added by Gaurav
     * Added on 05 July 2017
     * For resize image
     * @param type $max_width
     * @param type $max_height
     * @param type $source_file
     * @param type $dst_dir
     * @param type $quality
     * @return boolean
     */
function resize_crop_image($max_width, $max_height, $source_file, $dst_dir, $quality = 80) {
    
    $imgsize = getimagesize($source_file);
    $width = $imgsize[0];
    $height = $imgsize[1];
    $mime = $imgsize['mime'];
	if($mime =='image/jpg')
	{
		$mime =='image/jpeg';
	}

    switch ($mime) {
        case 'image/gif':
            $image_create = "imagecreatefromgif";
            $image = "imagegif";
            break;

        case 'image/png':
            $image_create = "imagecreatefrompng";
            $image = "imagepng";
            $quality = 7;
            break;

        case 'image/jpeg':
            $image_create = "imagecreatefromjpeg";
            $image = "imagejpeg";
            $quality = 80;
        break;
		case 'image/bmp':
		$image_create = "imagecreatefrombmp";
		$image = "imagebmp";
		$quality = 80;
		break;

        default:
            return false;
            break;
    }

    $dst_img = imagecreatetruecolor($max_width, $max_height);
    ///////////////

    imagealphablending($dst_img, false);
    imagesavealpha($dst_img, true);
    $transparent = imagecolorallocatealpha($dst_img, 255, 255, 255, 127);
    imagefilledrectangle($dst_img, 0, 0, $max_width, $max_height, $transparent);


    /////////////
    $src_img = $image_create($source_file);

    $width_new = $height * $max_width / $max_height;
    $height_new = $width * $max_height / $max_width;
    //if the new width is greater than the actual width of the image, then the height is too large and the rest cut off, or vice versa
    if ($width_new > $width) {
        //cut point by height
        $h_point = (($height - $height_new) / 2);
        //copy image
        imagecopyresampled($dst_img, $src_img, 0, 0, 0, $h_point, $max_width, $max_height, $width, $height_new);
    } else {
        //cut point by width
        $w_point = (($width - $width_new) / 2);
        imagecopyresampled($dst_img, $src_img, 0, 0, $w_point, 0, $max_width, $max_height, $width_new, $height);
    }

    $image($dst_img, $dst_dir, $quality);

    if ($dst_img)
        imagedestroy($dst_img);
    if ($src_img)
        imagedestroy($src_img);
}
/*Add action for send mail
 * Created by Gaurav Dutt Panchal
 * Date : 16 Aug 2017
 * **/
public function sendMailAction() {

        //ini_set('default_charset', 'UTF-8');
        //echo iconv("ISO-8859-1", "UTF-8", "This is a test.");die('test');
        $mailObj = $this->PUMailer();
        $mailObj->testEmail(array());

     }

    /**
     * Updation script to update user's passwords, hashing
     * Created By: Amit Malakar
     * Date: 11-Sep-2017
     */
    public function migrateUserAction() {
        //

        // get all individual user's info
        error_reporting(E_ALL);
        $url   = SOCKET_HOST_NAME . 'api/userlist';
        $ch    = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //curl_setopt($ch, CURLOPT_POST, true);
        //curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        $contents = curl_exec($ch);
        if (curl_errno($ch)) {
            // this would be your first hint that something went wrong
            $message = 'Couldn\'t send request: ' . curl_error($ch);
        } else {
            // check the HTTP status code of the request
            $resultStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($resultStatus == 200) {
                $message = 'success';
            } else {
                // request didn't complete, common errors are 4xx
                // (not found, bad request, etc.) and 5xx (usually concerning errors/exceptions in the remote script execution)
                $message = 'Request failed: HTTP status code: ' . $resultStatus;
            }
        }
        curl_close($ch);

        if(isset($_REQUEST['pwd']) && $_REQUEST['pwd'] == '1') {
            $userInfo = json_decode($contents, true)['data'];

            $cipherObj    = new PUCipher();
            foreach($userInfo as $key => $user) {
                if(isset($user['password']) && !empty($user['password'])) {
                    if(strpos($user['password'], '$2y$') !== false) {
                        //echo '<pre>'; print_r($user); die();
                    } else {
                        // password is not hashed
                        $email = $user['email_address'];
                        $password = $user['password'];
                        $indiNodeId = $user['node_id'];

                        // search in Account's class now, with email and password
                        $res = $this->getClassesTable()->migrationUpdatePassword($user);

                        // Update Account Class password field
                        $newPasswordHash       = $cipherObj->puPasswordHash($password);
                        $ncpIdArray            = array(ACCOUNT_PASSWORD_ID);
                        $ncpValueArray         = array($newPasswordHash);
                        $typeId                = 2;
                        $accountNodeInstanceId = $res;
                        //echo '<pre>'; print_r(array($user,$ncpIdArray, $ncpValueArray, $accountNodeInstanceId, $typeId)); die();
                        $res = $this->classesTable->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $accountNodeInstanceId, $typeId);
                    }
                }
            }
            //echo '<pre>'; print_r($userInfo); die();
        } else {
            header('Content-disposition: attachment; filename=userlist.json');
            header('Content-type: application/json');
            echo $contents; die();
        }
    }

}
