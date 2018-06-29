<?php
namespace Grid\Controller;
use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Zend\View\Model\ViewModel;

class MenudashboardController extends AbstractActionController {
    protected $gridTable;
    protected $view;
    protected $storageType =STORAGE_NAME;

    public function __construct()
    {
        $this->container = new container('auth');
    }
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

    public function getClassesTable()
    {
        if (!$this->classesTable) {
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    }

    public function getCourseDialogueTable()
    {
        if (!$this->coursedialogueTable) {
            $sm = $this->getServiceLocator();
            $this->coursedialogueTable = $sm->get('Administrator\Model\CourseDialogueTable');
        }
        return $this->coursedialogueTable;
    }

    public function getStructureBuilderTable()
    {
        if (!$this->structureBuilderTable) {
            $sm = $this->getServiceLocator();
            $this->structureBuilderTable = $sm->get('Administrator\Model\StructureBuilderTable');
        }
        return $this->structureBuilderTable;
    }

    public function getAdministratorTable()
    {
		if (!$this->administratorTable) {
            $sm = $this->getServiceLocator();
			$this->administratorTable = $sm->get('Administrator\Model\AdministratorTable');
        }
        return $this->administratorTable;
    }
    /**
     *  Display the grid structure for first time or display the add phase popup content.
     */
    public function indexAction() {
        //modified by Gaurav,On 28 Aug 2017
        //For send json data
        if(1){
            $request = $this->getRequest();
            $post = $request->getPost()->toArray();
            $courseList = $this->getClassesTable()->buildCourseData($post);
            if($request->isXmlHttpRequest()){//Send data for ajax call
                /*To render for notification list*/
                if(isset($post['dialogue_node_id']) && trim($post['dialogue_node_id']) != ''){
                    $postArr['user_instance_node_id'] = $post['setUserID'];
                    $postArr['dialogue_node_id'] = $post['dialogue_node_id'];
                    $postArr['nodtification_node_id'] = $post['nodtification_node_id'];
                    $postArr['course_instance_id'] = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $post['course_node_id']);
                    $dialogueData = $this->getClassesTable()->getDialogueData($postArr);
                    $courseList[" ".$post['course_node_id']]['dialogue'] = $dialogueData;
                    print json_encode($courseList);
                    exit;
                }
                /*End Here*/
                $resArr = array(
                    'status'=>'Success',
                    'course_list' => $courseList,
                );

                $response['data'] = $resArr;
                print json_encode($response);
                exit;

            }else{//render data
                $_data['login_userId']  = (isset($post['setUserID']) && $post['setUserID'] != '') ? $post['setUserID'] : $_SESSION[PREFIX.'user_info']['node_id'];
                $layout = $this->layout();
                $layout->setTemplate('layout/layout_new');
                $apps_list                      =   $this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($_data['login_userId']);
                $layout->setVariable('course_list', json_encode($courseList));
                $layout->setVariable('store_list', json_encode($apps_list));
                $layout->setVariable('view_type', 'bycourse');
                $layout->setVariable('form_fields', SIGNUP_FORM_DATA);
                $layout->setVariable('page_name', 'inbox');
                $layout->setVariable('expiration_msg', json_encode(array(), JSON_FORCE_OBJECT));
                //return $viewModel;
            }
        }else{
            //Optimized Code
            $layout = $this->layout();
            /*
             * Modified By: Divya Rajput
             * Date: 26-07-2017
             * Purpose: Call layout/layout for direct hit
            */
            if(!$this->getRequest()->isXmlHttpRequest()){
                $layout->setVariable('divLayout', 'menudashboard');
                $layout->setVariable('expiration_msg', json_encode(array(),JSON_FORCE_OBJECT));
                $layout->setTemplate('layout/layout_new');
            }else{
                $layout->setVariable('divLayout', 'marketplace');
                $layout->setVariable('expiration_msg', json_encode(array(),JSON_FORCE_OBJECT));
                $layout->setTemplate('layout/simple');
            }
            $request = $this->getRequest();
            if($request->isPost() || !$request->isXmlHttpRequest){
                if($request->isPost()){
                    $post = $request->getPost()->toArray();
                    $_data['order_by']      = isset($post['order_by']) ? $post['order_by'] : 'node_instance_id';
                    $_data['order']         = isset($post['order']) ? $post['order'] : 'DESC';
                    $_data['login_userId']  = (isset($post['setUserID']) && $post['setUserID'] != '') ? $post['setUserID'] : $_SESSION[PREFIX.'user_info']['node_id'];
                    $_data['view_type']     = isset($post['view_type']) ? strtolower($post['view_type']) : 'bycourse';
                    $_data['search_on_dash']= (isset($post['dashboard']) && $post['dashboard'] != '') ? trim($post['dashboard']) : '';

                    $_data['header_filter'] = array();
                    if(isset($post['title']) && $post['title'] != ''){
                        if(isset($post['value']) && strtolower($post['value']) == 'published'){
                            $filter_value = '1';
                        } elseif(isset($post['value']) && strtolower($post['value']) == 'draft'){
                            $filter_value = '0';
                        } else{
                            $filter_value = isset($post['value']) ? strtolower($post['value']) : 'ASC';
                        }
                        $_data['header_filter'] = array(
                                                    'filter_title' => isset($post['title']) ? strtolower($post['title']) : 'course',
                                                    'filter_key' => isset($post['key']) ? strtolower($post['key']) : 'order_by',
                                                    'filter_value' => $filter_value
                                                );
                    }else{
                        if($_data['view_type'] == 'byactor'){
                            $_data['header_filter'] = array(
                                                        'filter_title' => isset($post['title']) ? strtolower($post['title']) : 'name',
                                                        'filter_key' => isset($post['key']) ? strtolower($post['key']) : 'order_by',
                                                        'filter_value' => isset($post['value']) ? strtolower($post['value']) : 'ASC'
                                                    );
                        }
                    }

                    $course_data = $this->getClassesTable()->fetchCoureListData($_data);
                    //move course Data function to Classes table
                    // modified on 29 Aug 2017
                    // modified by Gaurav
                    $courseList = $this->getClassesTable()->courseData($course_data,$_data['view_type'],$_data['search_on_dash'], $_data['header_filter'], $_data['login_userId']);
                }
                $direct_request = 'N';
                if(!$request->isPost()){
                    $view = new ViewModel(array('is_direct_request' => 'Y'));
                    return $view;
                }else{
                    if(isset($post['type']) && $post['type'] == 'json'){
                        print json_encode($courseList);
                        exit;
                    }else{
                        $notificationArr    = $this->getClassesTable()->fetchFlashNotificationData($_data['login_userId']);
                        if($_data['view_type'] == 'bydialogue'){
                            $filter_array['dialogue'] = array();
                            $filter_array['course'] = array();
                            $filter_array['date']['filterKey'] = 'order_by';
                            $filter_array['date']['value'] = 'desc';
                            $filter_array['actor'] = array();
                        }else if($_data['view_type'] == 'byactor'){
                            $filter_array['actor']['filterKey'] = 'order_by';
                            $filter_array['actor']['value'] = 'asc';
                            $filter_array['domain'] = array();
                            $filter_array['title'] = array();
                            $filter_array['email'] = array();
                        }else{
                            $filter_array['course'] = array();
                            $filter_array['domain'] = array();
                            $filter_array['date']['filterKey'] = 'order_by';
                            $filter_array['date']['value'] = 'desc';
                            $filter_array['status'] = array();
                        }
                        $filter_array['search_key'] = $course_data['me']; //(isset($post['dashboard']) && $post['dashboard'] != '') ? trim($post['dashboard']) : array();
                        return array('courseList' => $courseList, 'filter' => $filter_array, 'is_direct_request' => $direct_request, 'notificationCount' => count($notificationArr));
                    }
                }
            }
        }
    }

    public function newCourseAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        /* Start Code By Arvind Soni For Caching */
        $manager                        = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage('file');
        $instanceArray = array();
        $order_by                       = 'node_instance_id';
        $order                          = 'DESC';
        $filter_operator                = '';
        $search_text                    = '';
        $filter_field                   = '';
        $mode                           = 0;
        $request                        = $this->getRequest();
        if ($request->isPost())
        {
            $post                       = $request->getPost()->toArray();
            $mode                       = $post['mode'];
        }
        if($mode == 0 || $mode == "")
        {
            $order_by                   = 'node_instance_id';
            $order                      = 'DESC';
        }
        else
        {
            $order_by                   = $post['order_by'];
            $order                      = $post['order'];
            $mode                       = $post['mode'];
            /*$page                       = 1;
            $filter_operator            = $post['filter_operator'];
            $search_text                = $post['search_text'];
            $filter_field               = $post['filter_field'];*/
        }
        $file_name                      = 'course_instance_list_'.$mode.'_'.$order_by.'_'.$order.'_'.$filter_operator.'_'.$search_text;
        $class_list_file_name           = strtolower($class_list_file_name);
        $cachedData                     = $manager->read($class_list_file_name);
       if($cachedData != "")
        {
            $instanceArray =  $cachedData;
        }
        else
        {
            $config                         = $this->getServiceLocator()->get('config');
            $course_class_id                = $config['constants']['COURSE_CLASS_ID'];
            $production_title               = $config['constants']['PRODUCT_TITLE'];
            $course_timeStamp               = $config['constants']['COURSE_TIMESTAMP_ID'];
            $coursePropertiesArray          = $this->getClassesTable()->getPropertiesCourse($course_class_id);
            $course_title_id                = $coursePropertiesArray[3]['node_class_property_id'];
            $prefixTitle                    = PREFIX.'user_info';
            $adminId                        = $_SESSION[$prefixTitle]['node_id'];
            $instanceArray                  = $this->getClassesTable()->fetchNodeInstanceCourse($course_class_id,$course_title_id,$order_by,$order,$filter_operator,$search_text,$filter_field,$production_title,$course_timeStamp,$adminId);
            $newTempArr     = array();
            $valueTempArr   = array();
            foreach ($instanceArray as $key => $value)
            {
                    $new_val = $value['value'];
                    unset($value['value']);
                    $value['value'][] = $new_val;
                    if(array_key_exists($value['node_instance_id'], $newTempArr)) {
                      $newTempArr[$value['node_instance_id']]['value'][] = $new_val;
                    }
                    else {
                      $newTempArr[$value['node_instance_id']]  = $value;
                    }
            }
            $manager->write($file_name, $newTempArr);
        }
        return array("instanceArray" => $newTempArr,'mode'=>$mode,'search_text'=>$search_text,'filter_operator'=>$filter_operator);
    }

    /**
     * Created by: Awdhesh Ku soni
     * Date: 05-March-2016
     * Save Course Class Data
     */
    public function saveCourseAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost())
        {
            $post               = $request->getPost();
            $courseTitle        = $post['courseTitle'];
            $courseDescription  = $post['courseDescription'];
            $courseObjective    = $post['courseObjective'];
            $saveType           = $post['saveType'];
            $instance_id        = $post['instance_id'];
            $parent_id          = $post['parent_id'];
            $config             = $this->getServiceLocator()->get('config');
            $course_class_id    = $config['constants']['COURSE_CLASS_ID'];
            $result             = $this->saveCourseData($courseTitle, $courseDescription, $courseObjective, $course_class_id, $saveType, $instance_id,$parent_id);
            echo json_encode($result);
        }
        exit;
    }

    public function saveCourseData($courseTitle, $courseDescription, $courseObjective, $course_class_id, $saveType, $instance_id,$parent_id){
        $instance_property_array    = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = "Standard";
        $instance_property_array[3] = $courseTitle;
        $instance_property_array[4] = $courseDescription;
        $instance_property_array[5] = $courseObjective;
        $instance_property_array[6] = date("Y-m-d H:i:s");
        $typeArray                  = $this->getClassesTable()->getClassList($course_class_id);
        $node_type_id               = $typeArray['node_type_id'];
        $coursePropertiesArray      = $this->getClassesTable()->getPropertiesCourse($course_class_id);
        foreach ($coursePropertiesArray as $key => $courseProperty)
        {
            $node_class_property_id[$key] = $courseProperty['node_class_property_id'];
        }
        $instance_caption           = intval($instance_id)>0 ? $instance_id : 0;
        if (intval($instance_id) > 0)
        {
            // fetch nod id on behalf on nstance id //
            $instance_caption           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $instance_id);
            $node_instance_id_course    =   $this->getClassesTable()->createInstance($instance_caption, $course_class_id, $node_type_id, $saveType, $instance_id);
            // update instance property //
            $this->getClassesTable()->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id_course, $node_class_property_id);
            /* code here start to remove cashe file for course individual class */
            $config                     = $this->getServiceLocator()->get('config');
            $individual_class_id        = $config['constants']['INDIVIDUAL_CLASS_ID'];
            $nodeXIndividualId          = $this->getClassesTable()->getNodeXForIndividualAndDialoge($instance_caption,$individual_class_id);
            foreach (array_unique($nodeXIndividualId) as $key => $value)
            {
                        array_map('unlink', glob(ABSO_URL ."data/perspective_cache/courselist".$value['ind_instance_node_id']));
            }
            $dialogue_class_id          = $config['constants']['DIALOGUE_CLASS_ID'];
            $nodeXDialogId          = $this->getClassesTable()->getNodeXForIndividualAndDialoge($instance_caption,$dialogue_class_id);
            foreach (array_unique($nodeXDialogId) as $key => $value) {
                        //$fileArray              =   glob("C:/xampp/htdocs/PUI/data/perspective_cache/"."courselist".$48529);
                        array_map('unlink', glob(ABSO_URL ."data/perspective_cache/dialogue_info_".$value['ind_instance_node_id']));
            }
            /* code here start to remove cashe file for course dialogue class */
        }
        else
        {
            $node_instance_id_course    =   $this->getClassesTable()->createInstance($instance_caption, $course_class_id, $node_type_id, $saveType);
            $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_course, $node_type_id);
            $node_instance_id_course    =   $this->getClassesTable()->getInstanceDetails($node_instance_id_course);
            $node_instance_id_course1   =   ",".$node_instance_id_course;
            $node_id_course = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_course1);
        }
        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage('file');
        $file_name                  =   "course_instance_list";
        $manager->clear($fileName);
        $config                     = $this->getServiceLocator()->get('config');
        $production_title               = $config['constants']['PRODUCT_TITLE'];
        $course_timeStamp               = $config['constants']['COURSE_TIMESTAMP_ID'];
        $coursePropertiesArray          = $this->getClassesTable()->getPropertiesCourse($course_class_id);
        $course_title_id                = $coursePropertiesArray[3]['node_class_property_id'];
        $instanceArray                  = $this->getClassesTable()->fetchAllCourse($course_class_id,$course_title_id,$production_title,$course_timeStamp);
        $newTempArr     = array();
        $valueTempArr   = array();
        foreach ($instanceArray as $key => $value) {
                $new_val = $value['value'];
                unset($value['value']);
                $value['value'][] = $new_val;
                if(array_key_exists($value['node_instance_id'], $newTempArr)) {
                  $newTempArr[$value['node_instance_id']]['value'][] = $new_val;
                }  else {
                  $newTempArr[$value['node_instance_id']]  = $value;
                }
        }
        $manager->write($file_name, $newTempArr);
        return array("node_instance_id" => $node_instance_id_course, "node_id"=> $node_id_course);
    }

    /**
     * Created by: Awdhesh Ku soni
     * Date: 05-March-2016
     * function use here to fetch current course details by active course class
     */
    public function courseViewAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost())
        {
            $post = $request->getPost()->toArray();
            $node_instance_id = $post['node_instance_id'];
        }
        $courseArray                = $this->getClassesTable()->getCourseDetails($node_instance_id);
        $config                     = $this->getServiceLocator()->get('config');
        $course_class_id            = $config['constants']['COURSE_CLASS_ID'];
        $coursePropertiesArray      = $this->getClassesTable()->getPropertiesCourse($course_class_id);
        $dashboard_view = new ViewModel(
            array(
                'courseArray'           => $courseArray,
                'node_instance_id'      => $node_instance_id,
                'coursePropertiesArray' => $coursePropertiesArray,
            )
        );
        $stmtArray      =   array();
        $resource_view = new ViewModel(array('statements' => $stmtArray));
        $resource_view->setTemplate('grid/documents/index.phtml');
        $dashboard_view->addChild($resource_view, 'index');
        return $dashboard_view;
    }

    /*function use here for save dialogue, course and individual recepient here*/
    public function saveCourseDialougeAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $message = "";
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            if($post['data']['type'] == "addCourse" || $post['data']['type'] == "addDialogue" || $post['data']['type'] == "addCourseDialogueActorAndStatement")
            {
                if($post['chatMessage']!="")
                {
                        $message = $post['chatMessage'];
                }
                else
                {
                    if($post['data']['Coursetype']=="Letter"){
                        if($post['data']['message']!="")
                        {
                            $message = $post['data']['message'];
                        }
                    }
                    else if($post['data']['Coursetype']=="Chat"){
                            if($post['chatMessage']!="")
                            {
                               // $message = $post['chatMessage'];  **arti
                                  $message = $post['message'];
                            }
                    }
                    else {
                        if($post['message']!="")
                        {
                            $message = $post['message'];
                        }
                    }
                }
                $this->res['result']    =   $this->getCourseDialogueTable()->saveNewDialogInstances($post['data'],$message);
                /*$uids = $post['data']['user_instance_node_id'].','.rtrim($post['data']['user_recepient_node_id'], ',');
                $temp = explode(',',$uids);
                for($i = 0; $i< count($temp); $i++ )
                {
                    $variable_data['user_instance_node_id'] = $temp[$i];
                    $this->writeCourseInfoInFile($variable_data);
                }*/
            }
            else
            {
                if($post['statements']!="")
                {
                    $message = $post['statements'];
                }
               $this->res['result']    =   $this->getCourseDialogueTable()->saveNewDialogInstances($post,$message);
            }
        }
        //$this->res = $post['data']['user_recepient_node_id'];
        //echo "<pre>"; print_r($this->res);
         print json_encode($this->res);
        ///print json_decode($returnResponse,true);
        exit;
    }

    /**
     * Function to write all course info of user into mamcache file
     */
    public function writeCourseInfoInFile($variable_data)
    {
        //return 'fsdf';
        $user_instance_node_id  = $variable_data['user_instance_node_id'];
        //$manager   = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage('file');
        $config                         = $this->getServiceLocator()->get('config');
        $course_class_id                = $config['constants']['COURSE_CLASS_ID'];
        $production_title               = $config['constants']['PRODUCT_TITLE'];
        $course_timeStamp               = $config['constants']['COURSE_TIMESTAMP_ID'];
        $coursePropertiesArray          = $this->getClassesTable()->getPropertiesCourse($course_class_id);
        $course_title_id                = $coursePropertiesArray[3]['node_class_property_id'];
        $adminId                        = $user_instance_node_id;
        $order_by                       = 'node_instance_id';
        $order                          = 'DESC';
        $filter_operator ='';
        $search_text ='';
        $filter_field ='';
        $instanceArray                  = $this->getClassesTable()->fetchNodeInstanceCourse($course_class_id,$course_title_id,$order_by,$order,$filter_operator,$search_text,$filter_field,$production_title,$course_timeStamp,$adminId);
        $newTempArr     = array();
        $valueTempArr   = array();
        foreach ($instanceArray as $key => $value)
        {
            $new_val = $value['value'];
            unset($value['value']);
            $value['value'][] = $new_val;
            if(array_key_exists($value['course_node_id'], $newTempArr))
            {
            $newTempArr[$value['course_node_id']]['value'][] = $new_val;
            }
            else {
            $newTempArr[$value['course_node_id']]  = $value;
            $variable_data['course_node_id'] = $value['course_node_id'];
            $user_details = $this->getCourseDialogueTable()->getActorInstances($variable_data);
            $newTempArr[$value['course_node_id'] ]['user_name'] = $user_details['user_name'];
            $newTempArr[$value['course_node_id'] ]['user_id'] = $user_details['user_id'];
            $newTempArr[$value['course_node_id'] ]['search_info'] = $value['value'][0].' '.$user_details['user_name'];
            }
        }
        $file_name    = 'user_course_data_' . $user_instance_node_id;
        //$manager->write($file_name, $newTempArr);
        return $newTempArr;
    }

    /* function here to update dialogue title for selected course class*/
    public function editDialougeTitleAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $tempArr                    =   array();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $this->getCourseDialogueTable()->saveDialogTitle($post['data']['dialogue_property_node_id'],$post['data']['dialogue_title']);
        }
        $tempArr['result']    =  $post['data'];
        print json_encode($tempArr);
        exit;
    }

    /* function here to update course title for selected course class*/
    public function editCourseTitleAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $tempArr                    =   array();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $this->getCourseDialogueTable()->saveCourseTitle($post['data']['course_property_node_id'],$post['data']['course_title'],$post['data']['dialogue_node_id']);
        }
        $tempArr['result']    =  $post['data'];
        print json_encode($tempArr);
        exit;
    }

    /* end code here */
    public function appendStatementDialogueAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $tempArr                    =   array();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $message = $post['chatMessage'];
            $this->res['result']    =   $this->getCourseDialogueTable()->appendStatement($post['data'],$post['chatMessage']);
            $uids = $post['data']['user_recepient_node_id'];
            $temp = explode(',',$uids);
            for($i = 0; $i< count($temp); $i++ )
            {
                $variable_data['user_instance_node_id'] = $temp[$i];
                $this->writeCourseInfoInFile($variable_data);
            }
        }
        $tempArr['result']          =  $this->res;
        print json_encode($tempArr);
        exit;
    }

    /* function here to save letter for statement class based on dialogue id */
    public function saveDialogueLetterAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $tempArr                    =   array();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            if($post['data']['saveType']== 'P' && $post['data']['type']== 'appendStatementForDialogueLetterClass')
            {
                $post['data']['statements']  =   $post['data']['message'];
                $this->res['result']         =   $this->getCourseDialogueTable()->addLetterStatement($post['data']);
            }
            else {
                $this->res['result']         =   $this->getCourseDialogueTable()->addLetterStatement($post);
            }
        }
        $tempArr['result']                   =  $this->res;
        print json_encode($tempArr);
        exit;
    }

    /**
     * Update Code For json - Amit B
     * display list of letter statement by dialogue id
     * @return ViewModel
     */
    public function statementLetterListAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $dialogue_instance_node_id  =   trim($post['dialogue_instance_node_id']);
            if(!empty($dialogue_instance_node_id)) {
            $stmtArray                  =   $this->getCourseDialogueTable()->getLetterStatementInstanceData($dialogue_instance_node_id);
            /* Code for send notification count of perticuler dialog, user and modewise */
            $unreadLetterArray          =   $this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_instance_node_id,$post['setUserID'],'letter');
            foreach($unreadLetterArray as $key => $statement_id)
            {
                $this->getCourseDialogueTable()->removeNotificationUserWise($statement_id['node_instance_id'],$dialogue_instance_node_id,$post['setUserID']);
            }
            $unreadLetterCount          =   count($unreadLetterArray);
            $totalUnreadCount           =   count($this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_instance_node_id,$post['setUserID']));
            // this block will execute when chat mode changes from dropdown.
            if(isset($post['type']) && $post['type'] != '')
            {
                $newArray = array_reverse($stmtArray[0]['statement']);
                if(empty($newArray)) {
                    $newArray = array(
                                        'chatItems'=> array(),
                                        'notificationItem' => array('dialogue_instance_node_id'     => $dialogue_instance_node_id,
                                                                    'unreadLetterCount'             => $unreadLetterCount,
                                                                    'totalUnreadCount'              => $totalUnreadCount,
                                                                    'statementType'                 => 'letter'
                                                                   )
                                      );
                } else {
                    $newArray = array(
                                        'chatItems'=> $newArray,
                                        'notificationItem' => array('dialogue_instance_node_id'     => $dialogue_instance_node_id,
                                                                    'unreadLetterCount'             => $unreadLetterCount,
                                                                    'totalUnreadCount'              => $totalUnreadCount,
                                                                    'statementType'                 => 'letter'
                                                                   )
                                      );
                }
                header('Content-Type: application/json');
                echo json_encode($newArray);
                // No need to go to view
                die;
                }
            }else {
                $stmtArray[0] = "";
            }
        }
        // Retutn to View if request is from listing
        return new ViewModel(
                array(  'statementList'                 => $stmtArray[0],
                        'post'                          => $post,
                        'dialogue_instance_node_id'     => $dialogue_instance_node_id,
                        'unreadLetterCount'             => $unreadLetterCount,
                        'totalUnreadCount'              => $totalUnreadCount
                        ));
    }

    public function fetchModeTypeAction(){
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
         $tempArr                    =   array();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $dialogue_instance_node_id  =   $post['data'];
            $stmtArray                  =   $this->getCourseDialogueTable()->getStatementModeType($dialogue_instance_node_id);
        }
        $tempArr['result']                   = $stmtArray;
        print json_encode($tempArr);
        exit;
    }

    /**
     * Function to return dialog listing
     * return type json
     */
    public function dialogueListAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        if($request->isPost())
        {
            $post                    =   $request->getPost()->toArray();

            if(1){
                $dialogueList = $this->getClassesTable()->getDialogueData($post);
            }else{
                /*below code will remove later*/
                $dialogueClassId         =   DIALOGUE_CLASS_ID;
                $dialogueTitleId         =   DIALOGUE_TITLE_ID;
                $CourseInsId             =   $post['course_instance_id'];
                $course_instance_node_id =   $this->getCourseDialogueTable()->getNodeId('node-instance', 'node_instance_id', $CourseInsId);
                $fetchRecord             =   $this->getCourseDialogueTable()->getAllDialogueInstancesOfCourseClass($course_instance_node_id,$dialogueClassId,$dialogueTitleId);
                //print_r($fetchRecord);die;
                $dialogueList = array();
                $removedParticipantsArr = array();
                if(count($fetchRecord)) {
                    //$removedParticipantsArr = explode(',', $fetchRecord[0]['removed_participants']);
                    $removedStatus = array_filter($fetchRecord, function($element) {
                        return isset($element['individual_history_status']) && $element['individual_history_status'] == '2';
                    });
                    foreach($removedStatus as $ru) {
                        if(!in_array($ru['individual_node_id'], $removedParticipantsArr[$ru['dialogue_node_id']]))
                            $removedParticipantsArr[$ru['dialogue_node_id']][] = $ru['individual_node_id'];
                    }
                    //$removedParticipantsArr = array_unique(array_column($removedStatus, 'individual_node_id'));
                }
                foreach ($fetchRecord as $key => $value) {
                    if(!in_array($value['individual_node_id'], $removedParticipantsArr[$value['dialogue_node_id']])) {
                        $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']][str_replace(' ', '_', strtolower($value['caption']))] = $value['user_name'];
                        $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['user_id']                                            = $value['individual_node_id'];
                        $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['email']                                              = $value['email'];
                        $dialogueList[$value['dialogue_node_id']]['dialogue']['dialogue_title']                                                                = html_entity_decode($value['dialogue_title']);
                        $dialogueList[$value['dialogue_node_id']]['dialogue']['dialogueStatus']                                                                = $value['status'];
                        $dialogueList[$value['dialogue_node_id']]['dialogue']['created_by']                                                                    = $value['createdBy'];
                        $dialogueList[$value['dialogue_node_id']]['dialogue']['dialogue_node_id']                                                              = $value['dialogue_node_id'];
                        $dialogueList[$value['dialogue_node_id']]['dialogue']['dialogue_instance_id']                                                          = $value['dialogue_instance_id'];
                        //$dialogueList[$value['dialogue_node_id']]['notificationCount'] = count($this->getCourseDialogueTable()->getUserDialogueNotificationCount($value['dialogue_node_id'],$post['user_instance_node_id']));

                    } else {
                        $dialogueList[$value['dialogue_node_id']]['removed_users'][$value['individual_node_id']][str_replace(' ', '_', strtolower($value['caption']))] = $value['user_name'];
                        $dialogueList[$value['dialogue_node_id']]['removed_users'][$value['individual_node_id']]['user_id']                                            = $value['individual_node_id'];
                        $dialogueList[$value['dialogue_node_id']]['removed_users'][$value['individual_node_id']]['email']                                              = $value['email'];
                    }
                    if(!isset($dialogueList[$value['dialogue_node_id']]['removed_users'])){
                        $dialogueList[$value['dialogue_node_id']]['removed_users'] = array();
                    }
                }
                //print_r($dialogueList);
                //$this->res['course_instance_id'] = $post['course_instance_id'];
                /* Code For send notification count per dialog and user */
                foreach($dialogueList as $key => $value)
                {
                    /*
                     * Modified By: Divya Rajput
                     * On Date: 5th June 2017
                     * Below code is used when removed users can't see their dialogue
                     *
                    if(array_key_exists($post['user_instance_node_id'],$value['users']))
                        $dialogueList[$key]['dialogue']['notificationCount'] = count($this->getCourseDialogueTable()->getUserDialogueNotificationCount($value['dialogue']['dialogue_node_id'], $post['user_instance_node_id']));
                    elseif(!array_key_exists($post['user_instance_node_id'],$value['removed_users']))
                        unset($dialogueList[$key]);
                     */
                    if(!array_key_exists($post['user_instance_node_id'],$value['removed_users']) && (!array_key_exists($post['user_instance_node_id'],$value['users'])))
                        unset($dialogueList[$key]);
                    else
                        $dialogueList[$key]['dialogue']['notificationCount'] = count($this->getCourseDialogueTable()->getUserDialogueNotificationCount($value['dialogue']['dialogue_node_id'], $post['user_instance_node_id']));
                }
            }
        }
        //print_r($dialogueList);die;
        /*echo '<pre>';
        print_r($fetchRecord);
        die('ghhh');*/
        /*$newArr = array();
        foreach ($fetchRecord as $keys => $val)
        {
               $newArr[$keys]['dialogueTitle'] =  $val['value'];
               $newArr[$keys]['dialogue_node_id'] =  $val['node_id'];
               foreach($val['user_name'] as $key => $value)
               {
                   $newArr[$keys][]['userName'] =  $value['value'][0].' '.$value['value'][1];
               }
        }*/
        //$dialogueList['course_instance_id'] =  $CourseInsId;
        if(!count($dialogueList)) {
            $dialogueList['status'] = 0;
            $dialogueList['message'] = 'No records found.';
        }
        print json_encode($dialogueList,JSON_FORCE_OBJECT);
        exit;
    }

    /* code here to fetch course dialogue data bases of dialogue id*/
    public function viewCourseDataAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $dialogue_instance_node_id  =   $post['dialogue_instance_node_id'];
            if($post['modeType']!=""){

                $modeType               =   $post['modeType'];
            }
            else
            {
                $modeType = 'Letter';
            }
            $DCR                        =   $this->getCourseDialogueTable()->getDialogueCourseInstanceData($dialogue_instance_node_id,$modeType);
            /* Code for send user id */
            $DCR[0]['setUserID']        = $post['setUserID'];
        }
        print json_encode($DCR[0]);
        exit;
    }

    /**
     * Update Code For json - Amit B
     * display list of statement by dialogue id
     * @return ViewModel
     */
    public function statementListAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();

            $newArray = $this->getClassesTable()->getStatementListData($post);
            header('Content-Type: application/json');
            echo json_encode($newArray);
            die();
        }

        // Retutn to View if request is from listing

    }

    public function courseEditorAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
        }
        return new ViewModel(array());
    }

    /*Not in use
    public function getUsersFromFile()
    {
        //$manager = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage($this->storageType);
        //$newUserArray                           =   $manager->read('individual_user_ist');
        // AWS S3
        $awsObj       = new AwsS3();
        $awsFilePath  = "data/perspective_cache/individual_user_list";
        $newUserResJson  = $awsObj->getFileData($awsFilePath);
        $newUserJson     = $newUserResJson['data'];
        $userArray                              =   array();
        $prefixTitle                            = PREFIX.'user_info';
        $adminId                                =   $_SESSION[$prefixTitle]['node_id'];
        if(strlen($newUserJson)) {
            $newUserArray = json_decode($newUserJson, true);
            foreach ($newUserArray as $key => $value) {
                if (!in_array($adminId, $value)) {
                    if ($value['email_address'] != "")
                        $userArray[$value['node_id']] = $value;
                }
            }
        }
        return $userArray;
    }
    */

    public function getAllUsersAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post                       =   $request->getPost()->toArray();
            $prefixTitle = PREFIX . 'user_info';
            $adminId = $_SESSION[$prefixTitle]['node_id'];
            $_userList = $this->getCourseDialogueTable()->getUserList();
            /*
             * Added By Divya Rajput
             * $post['is_group'] == 'Y'
             * For All User List in Group
            */
            if( $post['is_production'] == 'Y' || (isset($post['is_group']) && $post['is_group'] == 'Y') )
            {

            }
            else
            {
                unset($_userList[$adminId]);
            }

            $this->res['data'] = $_userList;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
        /* Old Code, fetching data from file
        $userArray                              =   $this->getUsersFromFile();
        $items                                  =   array();
        foreach($userArray as $key => $value)
        {
            $items[] = $value;
        }
        /*$items = array(
            array('nodeid' => 101,'firstname' => 'Arvind'),
        );*/

        /*echo json_encode($items);
        exit;
        */
    }

    public function deleteStatementDataAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $this->res['data']      =   $this->getCourseDialogueTable()->deleteStatementInstance($post['data']);
        }
        else
        {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function deleteLetterStatementAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $StmtIdArr              =   $this->getCourseDialogueTable()->getStatementLetterInstance($post['data']['node_instance_id']);
            if(!empty($StmtIdArr))
            {
                $InstanceVal = $this->getCourseDialogueTable()->getInstancePropertyDetail($StmtIdArr[0]['node_instance_id'], $StmtIdArr[0]['node_id']);
                foreach ($StmtIdArr as $key => $value)
                {
                     $this->getCourseDialogueTable()->commonDeleteMethodAll('node-instance-property','node_instance_id', $value['node_instance_id'],'equalto');
                     $this->getCourseDialogueTable()->commonDeleteMethodAll('node-x-y-relation','node_x_id',$value['node_id'],'equalto');
                     $this->getCourseDialogueTable()->commonDeleteMethodAll('node-instance','node_instance_id',$value['node_instance_id'],'equalto');
                     $this->getCourseDialogueTable()->commonDeleteMethodAll('node','node_id',$value['node_id'],'equalto');
                }
            }
            $newInstanceVal = $this->getCourseDialogueTable()->setNewInstancePropertyDetail($InstanceVal);
            $this->getCourseDialogueTable()->deleteStatementLetterInstance($post['data']);
            $this->res['data']      =  1;
        }
        else
        {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function addUpdateParticipantAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        $tempArr                    =   array();
        if($request->isPost())
        {
            $post                   =   $request->getPost()->toArray();
            $dialog_data['dialog_instance_node_id'] = $post['data']['messageto'];
            $dialog_data['user_instance_node_id']   = $userData = implode(",", $post['data']['user_recepient_node_id']);
            $courseInsNodeId = $this->getStructureBuilderTable()->getInstanceNodeId(COURSE_CLASS_ID, $post['data']['course_node_id']);
            $dialog_data['course_node_id'] = $courseInsNodeId;
            $dialog_data['current_user_node_id']    = $post['data']['user_instance_node_id'];
            if($post['data']['saveType']=="P"){
                $status = 1;
            }else {
                $status = 0;
            }
            $dialog_data['status']    = $status;
            $dial_details = $this->getStructureBuilderTable()->saveNewDialogueActorInstances($dialog_data);
            $this->res['data']      =  1;
        }
        else
        {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    /*Function here for remove the participant from dialogue*/
    public function removeParticipantDataAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        $tempArr                        =   array();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $dialog_data['dialog_instance_node_id'] = $post['data']['dialogue_node_id'];
            $dialog_data['user_instance_node_id']   = $post['data']['removeUser'];
            $dialog_data['total_users'] = $post['data']['user_recepient_node_id'];
            $dial_details = $this->getStructureBuilderTable()->removeDialogActor($dialog_data);
            $this->res['data']      =  1;
        }
        else
        {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    /*
    SELECT `nip`.`value`,`ni`.`node_id` AS `node_id`, `ni`.`node_instance_id` AS `node_instance_id`, `ncp`.`caption` AS `caption`, `xy`.`node_y_id` AS `course_node_id`
    FROM `node-instance-property` AS `nip`
    INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
    INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
    INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id`
    WHERE `xy`.`node_y_id` = '290459' AND `ni`.`node_class_id` = '179' AND `ncp`.`node_class_property_id` = '839'
    */
    public function dialogueResourceListAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
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
        if(1){
            $resourceData = array();
            if ($request->isPost()) {
                $post = $request->getPost()->toArray();
                $login_user_id  = $_SESSION[PREFIX . 'user_info']['node_id'];
                $course_node_id = $post['course_node_id'];

                $userData       = $this->getCourseDialogueTable()->fetchCourseDialogue($login_user_id, $course_node_id);

                if(count($userData)) {
                    $dialogue_node_ids = array_unique(array_column($userData, 'dialogue_node_id'));

                    $dialogueArr = array();
                    foreach ($userData as $user) {
                        if ($user['actor_status'] == 1) {
                            $date_value = new \DateTime();
                            $dialogueArr[$user['dialogue_node_id']]['start_time']   = $user['actor_time'];
                            $dialogueArr[$user['dialogue_node_id']]['end_time']     = $date_value->getTimestamp();
                        }
                        if ($user['actor_status'] == 2) {
                            $dialogueArr[$user['dialogue_node_id']]['end_time']     = $user['actor_time'];
                        }
                    }

                    $statementArr = $this->getCourseDialogueTable()->fetchDataForResource($dialogue_node_ids);

                    $resourceData = $this->filterResource($statementArr, $dialogueArr);
                }
            }
            print json_encode($resourceData);
            exit;
        }else {
            if ($request->isPost()) {
                $post = $request->getPost()->toArray();
                $dialogueClassId = DIALOGUE_CLASS_ID;
                $dialogueTitleId = DIALOGUE_TITLE_ID;
                //$CourseInsId             =   $post['course_instance_id'];
                $login_user_id = $_SESSION[PREFIX . 'user_info']['node_id']; //$post['user_instance_node_id'];

                //$dialog_resource_data =   $this->getCourseDialogueTable()->getCourseDialogueResourceData($CourseInsId,$dialogueClassId,$dialogueTitleId);

                $course_instance_node_id = $this->getCourseDialogueTable()->getNodeId('node-instance', 'node_instance_id', $CourseInsId);
                $fetchRecord = $this->getCourseDialogueTable()->getAllDialogueInstancesOfCourseClass($course_instance_node_id, $dialogueClassId, $dialogueTitleId);
            }

            $user_ids = array_column($fetchRecord, 'individual_node_id');

            $new_array = array();

            foreach ($user_ids as $key => $user_id) {
                if ($login_user_id == $user_id) {
                    $new_array[] = $fetchRecord[$key];
                }
            }

            foreach ($new_array as $arr) {
                $dialogue_instance_node_id = $arr['dialogue_node_id'];
                $DCR = $this->getStructureBuilderTable()->getAllStatement($dialogue_instance_node_id);
                $DCR['dialogue_node_id'] = $dialogue_instance_node_id;
                $resouce_arrays[] = $DCR;
            }
            $res = array();
            foreach ($resouce_arrays as $resouce_array) {
                foreach ($resouce_array as $arr) {
                    if ($arr['statement_type'] == "image" || $arr['statement_type'] == "attachment") {
                        //$arr['resource'] = 'puidata/'."attachments/". $resouce_array['dialogue_node_id']."/thumbs/".$arr['Statement'];
                        $arr['dialogue_node_id'] = $resouce_array['dialogue_node_id'];
                        $res[$arr['node_instance_id']] = $arr;
                    }
                }
            }

            if (count($res))
                $res['course_instance_id'] = $CourseInsId;
        }
        print json_encode($res);
        exit;
    }

    /**
    * Modified By: Kunal Kumar
    * Date: 12-Apr-2017
    * List Dialogue Actors
    * @param array
    * @return json
    */
    public function dialogueActorListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $userList = $this->formatActorList($this->getClassesTable()->getDialogueActorList($request->getPost()->toArray()));
        }
        print json_encode($userList);
        exit;
    }
    /**
     * FUNCTION TO MAINTAIN THE ACTOR STATUS
     * @param type $_data
     * @return array
     */
    private function formatActorList($_data = array()) {
        foreach($_data as $key=>$user)
        {
            $x = substr_count($user['status'],1);
            $y = substr_count($user['status'],2);
            if($x==$y)
                $_data[$key]['has_removed'] = 1;
            else
                $_data[$key]['has_removed'] = 0;
            if(!isset($user['last_name'])){
                $_data[$key]['last_name'] = '';
            }
        }
        return $_data;
    }

    /**
    * Modified By: Divya Rajput
    * Date: 27-Apr-2017
    * Purpose: like str_replace function at a specific limit(Replace string after a specific limit)
    * @param $search, $replace, $string, $limit
    * @return $string
    */
    private function str_replace_limit($search, $replace, $string, $limit = 1) {
        $pos = strpos($string, $search);
        if ($pos === false) {
            return $string;
        }
        $searchLen = strlen($search);
        for ($i = 0; $i < $limit; $i++) {
            $string = substr_replace($string, $replace, $pos, $searchLen);
            $pos = strpos($string, $search);
            if ($pos === false) {
                break;
            }
        }
        return $string;
    }

    /**
    * Modified By: Divya Rajput
    * Date: 15-May-2017
    * Purpose: get User first name, last name, fullname, email address from string thats contains actor id
    * @param array $actor_ids, $name_arr, $req_array, $email_arr
    * @return $string
    */
    private function getCourseUserInfo($actor_ids=array(), $name_arr=array(), $req_array=array(), $email_arr=array()){
        $resArr = array();
        $fname = $lname = '';
        $req_array = array_flip($req_array);

        foreach($actor_ids as $key) {
            if(isset($req_array['first_name'])){
                $fnameInfo = preg_grep('/(^'.$key.'-'.INDIVIDUAL_FIRST_NAME."_".')(.*)/', $name_arr);
                $fname = str_replace("$key-".INDIVIDUAL_FIRST_NAME."_", '', current($fnameInfo));
                $resArr[$key]['first_name'] = $fname;
            }

            if(isset($req_array['last_name'])){
                $lnameInfo = preg_grep('/(^'.$key.'-'.INDIVIDUAL_LAST_NAME.')(.*)/', $name_arr);
                $lname = str_replace("$key-".INDIVIDUAL_LAST_NAME."_", '', current($lnameInfo));
                $resArr[$key]['last_name'] = $lname;
            }

            if(isset($req_array['full_name'])){
                $resArr[$key]['full_name'] = $fname." ".$lname;
            }

            if(isset($req_array['email_address'])){
                $emailInfo = preg_grep('/(^'.$key.'-)(.*)/', $email_arr);
                $email = str_replace("$key-", '', current($emailInfo));
                $resArr[$key]['email_address'] = $email;
            }
        }
        return $resArr;
    }

    /*
     * Modified By: Divya Rajput
     * For Formatting Actor List Data
     */
    private function getActorFormatData($actor_info_data_array = array()){
        $actor_array = array();
        if(count($actor_info_data_array) > 0){
            foreach($actor_info_data_array as $key => $actor_info_array){
                $prop_array = explode(",", $actor_info_array['first_last_name_property_id']);
                $name_array = explode(",", $actor_info_array['actor_name']);
                if(count($prop_array) > 1){
                    if($prop_array[0] = INDIVIDUAL_FIRST_NAME){
                        $actor_info_data_array[$key]['first_name'] = $name_array[0];
                    }
                    if($prop_array[1] = INDIVIDUAL_LAST_NAME){
                        $actor_info_data_array[$key]['last_name'] = $name_array[1];
                    }
                }else{
                    if($prop_array[0] = INDIVIDUAL_FIRST_NAME){
                        $actor_info_data_array[$key]['first_name'] = $name_array[0];
                    }elseif($prop_array[0] = INDIVIDUAL_LAST_NAME){
                        $actor_info_data_array[$key]['last_name'] = $name_array[0];
                    }
                }
                unset($actor_info_data_array[$key]['actor_name']);
                unset($actor_info_data_array[$key]['first_last_name_property_id']);
            }
        }
        return $actor_info_data_array;
    }

    /**
     * Created By: Divya Rajput
     * Date: 6-Oct-2017
     * Purpose: Filter Resources on behalf of Timestamp
     * @param array $statementArr, $dialogueArr
     * @return array
     */
    private function filterResource($statementArr, $dialogueArr){
        $resourceData = array();
        if(count($statementArr) && count($dialogueArr)){
            $key = 0;
            foreach($statementArr as $stmt){
                $dialogue_node_id = $stmt['dialogue_node_id'];
                if( (($dialogueArr[$dialogue_node_id]['start_time']) < ($stmt['timestamp'])) && (($stmt['timestamp']) < ($dialogueArr[$dialogue_node_id]['end_time'])) ){
                    $resourceData[$key]['statement_type']   = $stmt['statement_type'];
                    $resourceData[$key]['statement']        = $stmt['attachment_name'];
                    $resourceData[$key]['dialogue_node_id'] = $dialogue_node_id;
                    $key++;
                }
            }
        }
        return $resourceData;
    }
}
