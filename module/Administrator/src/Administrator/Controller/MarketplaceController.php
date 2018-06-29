<?php
namespace Administrator\Controller;

use Api\Controller\Plugin\PUSession;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Api\Controller\Plugin\PUCipher;

class MarketplaceController extends AbstractActionController
{

	protected $administratorTable;
    protected $classesTable;
	protected $structureBuilderTable;
    protected $storageType =STORAGE_NAME;

    public function getAdministratorTable()
    {
		if (!$this->administratorTable) {
            $sm = $this->getServiceLocator();
			$this->administratorTable = $sm->get('Administrator\Model\AdministratorTable');
        }
        return $this->administratorTable;
    }

    public function getClassesTable()
    {
        if (!$this->classesTable) {
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    }

	public function getStructureBuilderTable()
    {
        if (!$this->structureBuilderTable) {
            $sm = $this->getServiceLocator();
            $this->structureBuilderTable = $sm->get('Administrator\Model\StructureBuilderTable');
        }
        return $this->structureBuilderTable;
    }

    /**
     * Fetch All published Course
     * @param array $userInfo
     * @return view
     */
    public function indexAction()
    {
            // code for FORGOT PASSWORD FLOW >>>
            $access_token       = $_REQUEST['token'] ?? 0;
            // check if user session exists
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
            $userInfo           = $_SESSION[PREFIX . 'user_info'];
            $expiration_msg     = array();
            if($userInfo && $access_token) {
                $cipherObj                              = new PUCipher();
                $emailAddress                           = $cipherObj->puDecrypt($access_token);

                if(strtolower($userInfo['email_address']) == strtolower($emailAddress))
                {
                    $tokenDataArray = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
                    if(intval($tokenDataArray[0]['ur_status']) == 0)
                    {
                        $expiration_msg     = array('email' => $emailAddress);
                    }
                }
                else
                {
                    $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
                }
            }
            else if($access_token)
            {
                $tokenDataArray = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
                if(intval($tokenDataArray[0]['ur_status']) == 1)
                {
                    $expiration_msg     = array('title'=> 'Link Expired' ,'msg' => 'Access Token already used.');
                }
            }

        // <<< code for FORGOT PASSWORD FLOW

        $prefixTitle                    =   PREFIX.'user_info';
        $login_user_id                  =   isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
        $apps_list                      =   $this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($login_user_id);

        /*Modified By: Divya Rajput*/
        $notificationArr = array();
        if(!empty($login_user_id)) {
            $notificationArr = $this->getClassesTable()->fetchFlashNotificationData($login_user_id);
            $courseList = $this->getClassesTable()->buildCourseData(array());
        }
        /*
          Modified by Gaurav
          On 28 Aug 2017
        */
       if($this->getRequest()->isXmlHttpRequest()){//Send data for ajax call

               $resArr = array(
                    'status'=>'Success',
                    'app_list' => $apps_list,
                    );

              $response['data'] = $resArr;
              print htmlspecialchars(json_encode($response,JSON_FORCE_OBJECT), ENT_QUOTES, 'UTF-8');
              exit;

        }else{//render data
              $this->layout()->setTemplate('layout/layout_new');
              $this->layout()->setVariable('store_list', json_encode($apps_list, JSON_FORCE_OBJECT));
              $this->layout()->setVariable('course_list', json_encode($courseList));
              $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
              $this->layout()->setVariable('view_type', '');
              $this->layout()->setVariable('page_name', 'store');
              $this->layout()->setVariable('expiration_msg', json_encode($expiration_msg, JSON_FORCE_OBJECT));
              //return $viewModel;
              //return new ViewModel(array('apps_list_array' => $apps_list, 'notificationCount' => count($notificationArr)));
        }

    }

    /**
     * Fetch All published Course
     * @param array $userInfo
     * @return view
     */
    public function marketAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $prefixTitle                    =   PREFIX.'user_info';
        $login_user_id                  =   $_SESSION[$prefixTitle]['node_id'];
        $apps_list                      =   $this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($login_user_id);

        /*Modified By: Divya Rajput*/
        $notificationArr                = $this->getClassesTable()->fetchFlashNotificationData($login_user_id);

        $viewModel                      = new ViewModel(array('apps_list_array' => $apps_list, 'notificationCount' => count($notificationArr)));
        $viewModel->setTemplate('administrator/marketplace/index.phtml');
        return $viewModel;
    }

    /**
     * This Function Use For subscribe any course
     * @param array $post
     * @return json_data
     */
    public function subscriptionAction()
    {
        $layout                      =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                     =   $this->getRequest();
        $data                        = array();
        if($request->isPost())
        {
            $post                    =   $request->getPost()->toArray();
            $groupArray              =   $this->getAdministratorTable()->getGroupsForParticulerUser($post['user_id']);
            $data['status']          =   0;
            if(count($groupArray) > 0)
            {
                foreach($groupArray as $key => $value)
                {
                    $data['production_id']  =  $post['production_id'];
                    $data['group']          =  array('_'.$value['node_id'] => array('title' => $value['group'], 'id' => $value['node_id']));
                    $data['action']         =  "store/groupSubscription";
                    $data['status']         =  1;
                }
            }
            else
            {
                $data                       =   $this->getStructureBuilderTable()->subscribeApplication($post);
                $data['status']             =   1;
            }

        }
        print json_encode($data);
        exit;
    }

    /**
     * This Function Use For subscribe any application for individual or group
     * @param array $post
     * @return json_data
     */
    public function groupSubscriptionAction()
    {
        $layout                             =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                            =   $this->getRequest();
        $data                               =   array();
        if($request->isPost())
        {
            $post                           =   $request->getPost()->toArray();
            $data                           =   $this->getStructureBuilderTable()->subscribeApplication($post);
        }
        print json_encode($data);
        exit;
    }

    /**
     * Fetch Only Subscribe Course
     * @param array $userInfo
     * @return view
     */
    public function mycourseAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $prefixTitle                    =   PREFIX.'user_info';
        $login_user_id                  =   $_SESSION[$prefixTitle]['node_id'];
        $apps_list                      =   $this->getAdministratorTable()->fetchSubscribedCourses($login_user_id);
        $notificationArr                =   $this->getClassesTable()->fetchFlashNotificationData($login_user_id);

        $viewModel                      = new ViewModel(array('apps_list_array' => $apps_list, 'notificationCount' => count($notificationArr)));
        $viewModel->setTemplate('administrator/marketplace/index.phtml');
        return $viewModel;
    }

    /* ================= Global Functions Of PUI ================== */

    public function leftmenuAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        /* Start Code By Arvind Soni For Caching */
        //$manager = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage($this->storageType);
        /* End Code By Arvind Soni For Caching */

        $file_name = 'left_menu_list';
        $cachedData = '';//$manager->read($file_name);

        $view = '';
        if ($cachedData != "") {
            $view = $cachedData;
        } else {
            //$menuArray = $this->getAdministratorTable()->getLeftMenu();
            $menuArray = $this->getAdministratorTable()->getLeftMenuFromClasses();
            //echo "<pre>";print_r($menuArray);die;
            $config = $this->getServiceLocator()->get('config');
            $course_menu_id = $config['constants']['COURSE_NEW_COURSE_MENU'];
            // Amit Malakar - get logged in user (node) id
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
            $prefixTitle = PREFIX . 'user_info';
            $userId = isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
            // get user ids of users who can see "Classes" menu item
            $classMenuUsers = CLASS_VIEW_USER_IDS;

            // check if logged in user exists in classMenuUsers array
            $showClassMenu = 0;
            if(in_array($userId, $classMenuUsers)) {
                $showClassMenu = 1;
            }
            /*
             * Modified By: Divya Rajput
             * Date: 2-August-2017
             * Purpose: Need action name from url to show active class in case of direct url hit.
            */

            $request = $this->getRequest()->getPost()->toArray();
            $actionName = $request['actionName'];
            $actionName = '';
            //echo '<pre>'; print_r($menuArray); die();
            /*End Here*/
            $view = new ViewModel(array('menuArray' => $menuArray, 'course_menu_id' => $course_menu_id, 'show_class_menu' => $showClassMenu,
                                        'classes_menu_id' => CLASSES_MENU_ID, 'actionName' => $actionName, 'userLoggedIn' => $userId));
            //$manager->write($file_name, $view);
        }
        return $view;
    }

    /**
     * Added by Divya Rajput
     * Added on 12 August 2017
     * To formatting actor info
     * @return array
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
     * Added by Divya Rajput
     * Added on 12 August 2017
     * To fetch flash notification Data
     * @return array
     */
    public function notificationListAction(){
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    =   $this->getRequest();
        if($request->isPost())
        {
            $post           = $request->getPost()->toArray();
            $login_user_id  = $post['login_user_id'];
            $notification_id  = $post['notification_id'];
            $flashNotificationArr = $this->getClassesTable()->fetchFlashNotificationData($login_user_id, 1, $notification_id);
            if(count($flashNotificationArr)){
                $actorProeprtyIds = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME, INDIVIDUAL_PROFILE_IMAGE);

                $admin_user_id = array_unique(array_column($flashNotificationArr, 'admin_user_id'));
                asort($admin_user_id);
                $admin_user_detail = $this->getClassesTable()->getActorInfo($admin_user_id, $actorProeprtyIds);
                $userArr = $this->getActorFormatData($admin_user_detail);
                $userInfoArr = array_combine($admin_user_id, $userArr);

                $notificationData = $this->formatNotificationData($flashNotificationArr, $userInfoArr);
                $this->getClassesTable()->updateNotificationStatus($login_user_id);
            }else{
                $notificationData['user'] = array();
            }
            print json_encode(array('notification' => $notificationData['user']), JSON_FORCE_OBJECT);
        }
        exit;
    }

    /**
     * Added by Divya Rajput
     * Added on 12 August 2017
     * To format flash notification Data
     * @param array $notification_details,
     * @param array $userInfo
     * @return array
     */
    private function formatNotificationData($notification_details = array(), $userInfo = array()){
        $user = array();

        foreach($notification_details as $notification){
            $message = $notification['notification_message'];
            $message_node_id = $notification['node_id'];
            $profile_image = isset($userInfo[$notification['admin_user_id']]['profile_image']) ? $userInfo[$notification['admin_user_id']]['profile_image'] : '';
            $user[" ".$message_node_id] = array(
                    'first_name' => $userInfo[$notification['admin_user_id']]['first_name'],
                    'last_name' => $userInfo[$notification['admin_user_id']]['last_name'],
                    'profile_image' => $this->getClassesTable()->getProfileUserImage($profile_image, 'thumbnail'),
                    'notification' => stripslashes($message),
                    'unread_status' => $notification['unread_status'],
                    'dialogue_node_id' => $notification['dialogue_node_id'],
                    'production_node_id' => $notification['production_node_id'],
                    'type' => $notification['notification_type'],
                    'course_node_id' => $notification['course_node_id'],
                );
        }
        return array('user' => $user);
    }

    /**
     * Added by Divya Rajput
     * Added on 25 August 2017
     * To Update notification status
     * @param $notification_id,
     * @param $login_user_id
     * @return array
     */
    public function updateNotificationStatusAction(){
        $layout             =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request            =   $this->getRequest();
        if($request->isPost())
        {
            $post           = $request->getPost()->toArray();
            $login_user_id  = $post['login_user_id'];
            $notification_id= $post['notification_id']; //node_id of node-instance

            if(is_array($post['notification_id'])){
                $notification_instance_id = $this->getClassesTable()->getInstaceIdByNodeID($post['notification_id']);
            }else{
                $notification_instance_id = $this->getClassesTable()->checkNotificationByUserID($notification_id, $login_user_id);
            }
            $this->getClassesTable()->updateNotificationStatus($login_user_id, $notification_instance_id);
            return $notification_id;
        }
    }
    /*
    Added by Gaurav
    Added on 25 Aug 2017
    Function to send json data of market place
    */
    public function mpAction()
    {
        $response = array();
        //$ms = microtime(true);
        $prefixTitle                    =   PREFIX.'user_info';
        $login_user_id                  =   isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
        $apps_list                      =   $this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($login_user_id);
        //$me = microtime(true) - $ms;

        /*Modified By: Divya Rajput*/
        //$ms1 = microtime(true);
        $notificationArr = array();
        if(!empty($login_user_id)) {
            $notificationArr = $this->getClassesTable()->fetchFlashNotificationData($login_user_id);
        }
        //$me1 = microtime(true) - $ms1;

	$resArr = array(
            'status'=>'Success',
            'app_list' => $apps_list,
            );

        $response['data'] = $resArr;

        echo "<pre>"; print_r(json_encode($response)); die;
    }
}
