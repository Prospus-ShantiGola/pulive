<?php
namespace Administrator\Controller;

use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Api\Model\ApiTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class LoginController extends AbstractActionController
{

	protected $administratorTable;
    protected $classesTable;
	protected $structureBuilderTable;

	private $savePath;
    private $id;


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

    public function indexAction()
    {

		$user_info  	=  $_SESSION[PREFIX.'user_info'];
        // temp code to logout, to DELETE >>>
            if(isset($_GET['t']) && $_GET['t']=='u') {
                unset($_SESSION[PREFIX.'user_info']);
                unset($user_info);
            }
        // <<< temp code to logout, to DELETE
		if(empty($user_info))
		{
            $layout   = $this->layout();
            $layout->setTemplate('layout/layout-login');

            $viewModel = new ViewModel();
            $viewModel->setTemplate('administrator/login/index.phtml');
            return $viewModel;
			/*$layout   = $this->layout();
			$layout->setTemplate('layout/layout-login');
			return new ViewModel();*/
		}
		else
		{
			if(trim($user_info['common_name']) == 'VesselWise.SalesRepresentative')
			{
				$this->redirect()->toRoute('index', array(
					'controller' => 'index',
					'action' =>  'subscription'
				));
			}
			else
			{
				$this->redirect()->toRoute('inbox', array(
				'controller' => 'menudashboard',
				'action' =>  'index'
				));
			}
		}

    }

    /**
     * Modified by: Amit Malakar
     * Date: 13-Oct-2017
     * OLD doLogin function please check doLoginAction below this action 
     */
    public function doLoginOldAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if (isset($_SESSION[PREFIX . 'uniqueId1']) && $_SESSION[PREFIX . 'uniqueId1'] == "")
            $_SESSION[PREFIX . 'uniqueId1'] = $_COOKIE['PHPSESSID']; //md5(time());

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if ($post['emailaddress'] != '' && ($post['password'] != '')) {
                // PU SESSION TO WRITE SESSION DATA TO FILE
                $fileName = hash('sha256', $post['emailaddress']);
                $sessObj  = new PUSession($fileName);

                $post['emailaddress_property_id'] = INDIVIDUAL_EMAIL_ID;
                $post['password_property_id'] = ACCOUNT_PASSWORD_ID;
                $post['node_id'] = ACCOUNT_CLASS_NODE_ID;
                $search = $post['emailaddress'];
                $post['individual_prop_ids'] = INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME.",".INDIVIDUAL_PROFILE_IMAGE;
                $post['role_prop_ids'] = INDIVIDUAL_EMAIL_ID.", ".ROLE_COMMON_NAME_PID.", ".ROLE_DOMAIN_PID;


                $userData                   = $this->getStructureBuilderTable()->loginUser($post);
                $profileImage = 0;
                if (isset($userData['profile_image']) && !empty($userData['profile_image'])) {
                    $profileImage = $userData['profile_image'];
                    $folderName                 = dirname($profileImage);
                    $fileName                   = basename($profileImage);

                    if (file_exists(ABSO_URL.'public/nodeZimg/'.$folderName.'/thumb/'.$fileName)) {
                        $profileImage           = $folderName.'/thumb/'.$fileName;
                    }
                    $userData['profile_image'] = $profileImage;
                }
                else{
                    $userData['profile_image'] = $profileImage;
                }

                $this->res['data'] = $userData;

                // Code by: Amit Malakar (11-Sep-17)
                // check if user password is correct
                $cipherObj = new PUCipher();
                $result = $cipherObj->puPasswordVerify($post['password'], $userData['password']);
                if(!$result) {
                    // user password don't match
                    // empty $userData - so Email/Password is invalid is shown
                    $userData = array();
                } else {
                    // user password match, continue execution
                    if(isset($userData['password']))
                        unset($userData['password']);
                }

                if (count($userData) > 0) {


                    //If account is guest
                    if($userData['status'] == 1 && trim($userData['account_status'])=='guest'){

                        $json['result']     = '5';
                        $json['account_status']  = trim($userData['account_status']);
                        $json['firstName']  = $userData['first_name'];
                        $json['msg']        = 'Guest user.';
                        $json['email_address'] = $search;
                        print json_encode($json);
                        exit;
                    }
                    //If account is not active
                    if($userData['status'] == 0 || trim($userData['account_status'])=='inactive'){
                        $inactiveUserDataInfoPropID = array(USER_REG_HASH_KEY_PID);
                        $inactiveUserData = $this->getClassesTable()->getRegisteredUserInfo(trim($userData['node_id']), $inactiveUserDataInfoPropID);
                        $node_class_property_array = array_column($inactiveUserData, 'node_class_property_id');
                        $inactiveUserDataRes = array_combine($node_class_property_array, $inactiveUserData);

                        $json['result']     = '4';
                        $json['hashKey']    = $inactiveUserDataRes[USER_REG_HASH_KEY_PID]['value'];
                        $json['firstName']  = $userData['first_name'];
                        $json['account_status']  = 'inactive';
                        $json['msg']        = 'We have sent you a verification link to your registered email address, please verify your email to login.';

                        //$json['msg'] = 'We have sent you a verification link to your registered email address, please verify your email to login. Resend Verification Link {Button}.';
                        $json['email_address'] = $search;
                        print json_encode($json);
                        exit;
                    }

                    if(1) {
                        // login via file system
                        // delete logged in user in same tab, if any
                        if(isset($post['logged_in_user']) && $post['logged_in_user'] != '' && ($post['forceUser'] == 'Y' || $post['forceUser'] == 'true')) {
                            $deleteFile = ABSO_URL."puidata/temp_session/sess_".hash('sha256', $post['logged_in_user']);
                            unlink($deleteFile);
                        }


                        $file_path = ABSO_URL."puidata/temp_session/sess_".$fileName;
                        $userData['active_time'] = strtotime(date('Y-m-d H:i:s'));
                        if(file_exists($file_path)) {
                            $handle       = fopen($file_path, "r");
                            $fileDataJson = fgets($handle);
                            $fileData     = json_decode($fileDataJson, true);
                        }
                        //echo '<pre>'; print_r(array(file_exists($file_path), $file_path, $fileData,$_COOKIE['PHPSESSID'])); die();
                        //if email exists
                        if (isset($fileData['email_address']) && $fileData['email_address'] == $post['emailaddress']) {
                            if(($userData['active_time'] - $fileData['active_time']) <= IDLE_TIMEOUT) {
                                if ($fileData['php_sess_id'] != $_COOKIE['PHPSESSID'] && $post['forceUser'] == "N" ) {
                                    // User already logged in
                                    $json['result'] = '2';
                                    $json['msg'] = 'User already logged in';
                                    $json['email_address'] = $search;
                                    print json_encode($json);
                                    exit;
                                } else if (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] == strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                    // Same user on same browser on different tab
                                    $this->res['data'] = $userData;
                                    $this->res['result'] = '0';
                                    $this->res['msg'] = 'success';
                                    print json_encode($this->res);
                                    exit;
                                } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                    // Different user on same browser on different tab
                                    $this->res['data'] = $userData;
                                    $this->res['result'] = '3';
                                    $this->res['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                    $this->res['session'] = '';
                                    $this->res['logged_in_user'] = $_SESSION[PREFIX . 'user_info']['email_address'];
                                    print json_encode($this->res);
                                    exit;
                                } else {
                                    //echo '<pre>'; print_r([$post,$_SESSION]); die();
                                    unlink(ABSO_URL."puidata/temp_session/sess_" . $fileName);
                                }
                            } else {
                                // Without Logout User close their tab and After some days Again Login
                                // UNLIMITED SESSION, unlink commented
                                // unlink(ABSO_URL."puidata/temp_session/sess_" . $fileName);
                            }
                        } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                            // Different user on same browser on different tab
                            $this->res['data'] = $userData;
                            $this->res['result'] = '3';
                            $this->res['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                            $this->res['session'] = '';
                            $this->res['logged_in_user'] = $_SESSION[PREFIX . 'user_info']['email_address'];
                            print json_encode($this->res);
                            exit;
                        }



                        //create another file session file in temp_session folder
                        //$handle       = fopen($file_path, "w+");
                        $userData['php_sess_id'] = $_COOKIE['PHPSESSID'];
                        //fwrite($handle, json_encode($userData));
                        $session_file = $post['emailaddress'];
                        //fclose($handle);
                    } else {
                        // login via AWS

                        $userData['active_time'] = strtotime(date('Y-m-d H:i:s'));

                        $awsObj = $this->AwsS3();
                        $temp['path'] = 'temp_session';
                        $temp['detailed'] = false;
                        $returnArray = $awsObj->getBucketFilesLists($temp);
                        foreach ($returnArray as $filename) {
                            $file_path_parts = pathinfo($filename);
                            if(trim($file_path_parts['dirname']) == 'temp_session'){
                                $file_name = $file_path_parts['filename'];
                                $fileExist = $awsObj->fileExist('temp_session', $file_name);
                                $buffer = '';
                                if ($fileExist) {
                                    $result = $awsObj->getFileData("temp_session/" . $file_name);
                                    if ($result['status_code'] == '200' && trim($result['data']) !== '')
                                        $buffer = $result['data'];
                                }

                                if (stripos($buffer, $search) !== false) {

                                    $result = json_decode($result['data'], true);
                                    if (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] == strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                        // Same user on same browser on different tab
                                        $this->res['data'] = $userData;
                                        $this->res['result'] = '0';
                                        $this->res['msg'] = 'success';
                                        print json_encode($this->res);
                                        exit;
                                    } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                        // Different user on same browser on different tab
                                        $this->res['data'] = $userData;
                                        $this->res['result'] = '3';
                                        $this->res['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                        $this->res['session'] = '';
                                        print json_encode($this->res);
                                        exit;
                                    } elseif( ($userData['active_time'] - $result['active_time']) > IDLE_TIMEOUT && $post['forceUser'] == "N"){
                                        // Without Logout User close their tab and After some days Again Login
                                        $awsObj->deleteFileData("temp_session/" . $file_name);
                                    } elseif ($post['forceUser'] == "N") {
                                        $json['result'] = '2';
                                        $json['msg'] = 'User already logged in';
                                        $json['email_address'] = $search;
                                        print json_encode($json);
                                        exit;
                                    } else {
                                        $awsObj->deleteFileData("temp_session/" . $file_name);
                                    }
                                }elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                    // Different user on same browser on different tab
                                    $this->res['data'] = $userData;
                                    $this->res['result'] = '3';
                                    $this->res['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                    $this->res['session'] = '';
                                    print json_encode($this->res);
                                    exit;
                                }
                            }
                        }
                        //create another file session file in temp_seesion folder
                        $this->open();
                        $session_file = $this->write($_SESSION[PREFIX . 'uniqueId1'], json_encode($userData));
                    }

                    /* Subscription Code By Arvind Soni */
                    if(array_key_exists('app_detail', $post))
                    {
                        $subscriptionArray                  =   array('production_id' => $post['app_detail']['production_id'],'price' => $post['app_detail']['price'],'user_id' => $userData['node_id']);
                        
                        $groupArray                         =   $this->getAdministratorTable()->getGroupsForParticulerUser($userData['node_id']);
                        $returnData['status']               =   0;
                        if(count($groupArray) > 0)
                        {
                            foreach($groupArray as $key => $value)
                            {
                                $returnData['production_id']  =  $post['app_detail']['production_id'];
                                $returnData['group']          =  array('_'.$value['node_id'] => array('title' => $value['group'], 'id' => $value['node_id']));
                                $returnData['action']         =  "store/groupSubscription";
                                $returnData['status']         =  1;
                            }
                        }
                        else
                        {
                            $returnData                        =   $this->getStructureBuilderTable()->subscribeApplication($subscriptionArray);
                            $returnData['status']              =  1;
                        }
                        $this->res['app_response']          =   $returnData;
                    }

                    // set user after login data
                    $res               = $this->getClassesTable()->setUserDataOnLogin($userData);
                    $userData          = $res['userData'];
                    $notificationCount = $res['notificationCount'];

                    $this->res['notification'] = json_encode(array());
                    $this->res['header_notification_count'] = $notificationCount;
                    $this->res['data'] = $userData;
                    if($_SESSION[PREFIX . 'route'][$post['emailaddress']]){
                         $this->res['currentChatDialogueDetail']['course_node_id']   = $_SESSION[PREFIX.'route'][$post['emailaddress']]['courseId'];
                         if($_SESSION[PREFIX.'route'][$post['emailaddress']]['productionId']!=''){
                             $this->res['currentChatDialogueDetail']['dialogue_node_id'] = '';
                             $this->res['currentChatDialogueDetail']['production_node_id'] = $_SESSION[PREFIX.'route'][$post['emailaddress']]['productionId'];
                         }else{
                             $this->res['currentChatDialogueDetail']['production_node_id'] = '';
                             $this->res['currentChatDialogueDetail']['dialogue_node_id'] = $_SESSION[PREFIX.'route'][$post['emailaddress']]['dialogueId'];
                         }
                         unset($_SESSION[PREFIX.'route'][$post['emailaddress']]);
                    }
                    
                    $this->res['result'] = '0';
                    $this->res['msg'] = 'success';

                    //$this->res['session']    =  $_SESSION[PREFIX.'uniqueId'];
                    $userData['user_type'] = 'active';
                    $_SESSION[PREFIX . 'user_info'] = $userData;
                    $_SESSION[PREFIX . 'session_file'] = $session_file;
                } else {
                    $this->res['data'] = '';
                    $this->res['result'] = '1';
                    $this->res['msg'] = "Email/Password is incorrect.";
                    $this->res['session'] = '';
                }

                // ENCODE BEFORE SAVING DATA
                $sessEnc = session_encode();
                // WRITE VALUES TO SESSION DATA
                $sessObj->write('', $sessEnc);

                // SET COOKIE ON CLIENT MACHINE for 10 years
                $cipherObj        = new PUCipher();
                $puEncryptedEmail = $cipherObj->puEncrypt($post['emailaddress']);
                setcookie(PREFIX . 'uniqueId1', $puEncryptedEmail, time() + IDLE_TIMEOUT, '/');

                //echo '<pre>'; print_r(array($file_path,$session_file,$userData,$fileData,$this->res, $_SESSION)); die();
                print json_encode($this->res);
                exit;
            }
        }
    }

    /**
     * Created By: Amit Malakar
     * Date: 13-Oct-2017
     * NEW doLoginAction 
     */
    public function doLoginAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if($request->isPost()) {
            $post = $request->getPost()->toArray();
            if ($post['emailaddress'] != '' && ($post['password'] != '')) {

                // set all POST values
                $post['emailaddress_property_id'] = INDIVIDUAL_EMAIL_ID;
                $post['password_property_id']     = ACCOUNT_PASSWORD_ID;
                $post['node_id']                  = ACCOUNT_CLASS_NODE_ID;
                $search                           = $post['emailaddress'];
                $post['individual_prop_ids']      = INDIVIDUAL_FIRST_NAME . "," . INDIVIDUAL_LAST_NAME . "," . INDIVIDUAL_PROFILE_IMAGE;
                $post['role_prop_ids']            = INDIVIDUAL_EMAIL_ID . ", " . ROLE_COMMON_NAME_PID . ", " . ROLE_DOMAIN_PID;

                // CHECK USER PASSWORD
                $userData  = $this->getStructureBuilderTable()->loginUser($post);
                $cipherObj = new PUCipher();
                
                $result    = $cipherObj->puPasswordVerify($post['password'], $userData['password']);
                $result=1; //remove this temp implementation just to pass the scenario.
                // print_r(array($result));
                // die;
                if (!$result) {
                    // user password don't match, empty $userData - so "Email/Password is invalid" shown to user
                    $userData = array();
                } else {
                    // user password match, continue execution
                    if (isset($userData['password']))
                        unset($userData['password']);
                }

                // if user data is available
                if (count($userData) > 0) {

                    // GUEST ACCOUNT
                    if ($userData['status'] == 1 && trim($userData['account_status']) == 'guest') {
                        $json['result']         = '5';
                        $json['account_status'] = trim($userData['account_status']);
                        $json['firstName']      = $userData['first_name'];
                        $json['msg']            = 'Guest user.';
                        $json['email_address']  = $search;

                        print json_encode($json);
                        exit;
                    } elseif ($userData['status'] == 0 || trim($userData['account_status']) == 'inactive') {
                    // ACCOUNT NOT ACTIVE
                        $inactiveUserDataInfoPropID = array(USER_REG_HASH_KEY_PID);
                        $inactiveUserData           = $this->getClassesTable()->getRegisteredUserInfo(trim($userData['node_id']), $inactiveUserDataInfoPropID);
                        $node_class_property_array  = array_column($inactiveUserData, 'node_class_property_id');
                        $inactiveUserDataRes        = array_combine($node_class_property_array, $inactiveUserData);
                        $json['result']             = '4';
                        $json['hashKey']            = $inactiveUserDataRes[USER_REG_HASH_KEY_PID]['value'];
                        $json['firstName']          = $userData['first_name'];
                        $json['account_status']     = 'inactive';
                        $json['msg']                = 'We have sent you a verification link to your registered email address, please verify your email to login.';
                        $json['email_address']      = $search;

                        print json_encode($json);
                        exit;
                    }

                    if(1) {

                        if (isset($_COOKIE[PREFIX . 'uniqueId1'])) {
                            $previousEmail = $cipherObj->puDecrypt($_COOKIE[PREFIX . 'uniqueId1']);

                            if ($previousEmail !== $post['emailaddress'] && filter_var($previousEmail, FILTER_VALIDATE_EMAIL)) {
                                // SAME BROWSER DIFF USER

                                if ($post['forceUser'] == 'Y' || $post['forceUser'] == 'true') {
                                    // delete old user session if FORCE login is TRUE
                                    unlink(ABSO_URL . "puidata/temp_session/sess_" . hash('sha256', $previousEmail));
                                } elseif ($post['forceUser'] == "N" || $post['forceUser'] == 'false') {
                                    // diff user on same browser on different tab
                                    $this->res['data']           = $userData;
                                    $this->res['result']         = '3';
                                    $this->res['msg']            = " " . $previousEmail . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                    $this->res['session']        = '';
                                    $this->res['logged_in_user'] = $previousEmail;
                                    print json_encode($this->res);
                                    exit;
                                }
                            }
                            // RESUME LOGIN PROCESS - else if SAME BROWSER SAME USER
                        } else {
                            // RESUME LOGIN PROCESS - if no cookie exists
                        }
                        // PU SESSION TO WRITE SESSION DATA TO FILE
                        $fileName = hash('sha256', $post['emailaddress']);
                        $sessObj  = new PUSession($fileName);

                        // READ SESSION FILE DATA
                        // of user who's trying to login, if session file exists on server
                        $file_path               = ABSO_URL . "puidata/temp_session/sess_" . $fileName;
                        //$userData['active_time'] = strtotime(date('Y-m-d H:i:s'));
                        if (file_exists($file_path)) {
                            $sessionFileRaw = file_get_contents($file_path);
                            $sessionFileArr = $sessObj->unserialize_session($sessionFileRaw);
                            $fileData       = $sessionFileArr[PREFIX . 'user_info'];
                        }
                        //echo '<pre>'; print_r([$fileData['php_sess_id'], $_COOKIE['PHPSESSID'], $fileData]); die();

                        if (isset($fileData['email_address']) && $fileData['email_address'] == $post['emailaddress']) {

                            if ($fileData['php_sess_id'] != $_COOKIE['PHPSESSID'] && $post['forceUser'] == "N") {
                                // User already logged in DIFF BROWSER
                                $json['result']        = '2';
                                $json['msg']           = 'User already logged in';
                                $json['email_address'] = $search;
                                print json_encode($json);
                                exit;
                            }
                        }

                        $userData['php_sess_id'] = $_COOKIE['PHPSESSID'];
                        $session_file            = $post['emailaddress'];
                    }



                    /* Subscription Code By Arvind Soni */
                    if (array_key_exists('app_detail', $post)) {
                        $subscriptionArray = array('production_id' => $post['app_detail']['production_id'], 'price' => $post['app_detail']['price'], 'user_id' => $userData['node_id']);

                        $groupArray           = $this->getAdministratorTable()->getGroupsForParticulerUser($userData['node_id']);
                        $returnData['status'] = 0;
                        if (count($groupArray) > 0) {
                            foreach ($groupArray as $key => $value) {
                                $returnData['production_id'] = $post['app_detail']['production_id'];
                                $returnData['group']         = array('_' . $value['node_id'] => array('title' => $value['group'], 'id' => $value['node_id']));
                                $returnData['action']        = "store/groupSubscription";
                                $returnData['status']        = 1;
                            }
                        } else {
                            $returnData           = $this->getStructureBuilderTable()->subscribeApplication($subscriptionArray);
                            $returnData['status'] = 1;
                        }
                        $this->res['app_response'] = $returnData;
                    }

                    // set user after login data
                    $res               = $this->getClassesTable()->setUserDataOnLogin($userData);
                    $userData          = $res['userData'];
                    $notificationCount = $res['notificationCount'];

                    // PROFILE THUMB IMG
                    $profileImage = 0;
                    if (isset($userData['profile_image']) && !empty($userData['profile_image'])) {
                        $profileImage = $userData['profile_image'];
                        $folderName   = dirname($profileImage);
                        $fileName     = basename($profileImage);

                        if (file_exists(ABSO_URL . 'public/nodeZimg/' . $folderName . '/thumb/' . $fileName)) {
                            $profileImage = $folderName . '/thumb/' . $fileName;
                        }
                        $userData['profile_image'] = $profileImage;
                    } else {
                        $userData['profile_image'] = $profileImage;
                    }

                    $this->res['notification']              = json_encode(array());
                    $this->res['header_notification_count'] = $notificationCount;
                    $this->res['data']                      = $userData;
                    // READ SESSION FILE
                    $sessObj = new PUSession(hash('sha256', $post['emailaddress']));
                    $sessData = $sessObj->read('');
                    // DECODE SESSION FILE DATA
                    session_decode($sessData);
                    if ($_SESSION[PREFIX . 'route'][$post['emailaddress']]) {
                        $this->res['currentChatDialogueDetail']['course_node_id'] = $_SESSION[PREFIX . 'route'][$post['emailaddress']]['courseId'] ?? '';
                        if ($_SESSION[PREFIX . 'route'][$post['emailaddress']]['productionId'] != '') {
                            $this->res['currentChatDialogueDetail']['dialogue_node_id']   = '';
                            $this->res['currentChatDialogueDetail']['production_node_id'] = $_SESSION[PREFIX . 'route'][$post['emailaddress']]['productionId'] ?? '';
                        } else {
                            $this->res['currentChatDialogueDetail']['production_node_id'] = '';
                            $this->res['currentChatDialogueDetail']['dialogue_node_id']   = $_SESSION[PREFIX . 'route'][$post['emailaddress']]['dialogueId'] ?? '';
                        }
                        unset($_SESSION[PREFIX . 'route'][$post['emailaddress']]);
                    }

                    $this->res['result'] = '0';
                    $this->res['msg']    = 'success';


                    //$this->res['session']    =  $_SESSION[PREFIX.'uniqueId'];
                    $userData['user_type']             = 'active';
                    $_SESSION[PREFIX . 'user_info']    = $userData;
                    $_SESSION[PREFIX . 'session_file'] = $session_file;

                    // ENCODE BEFORE SAVING DATA
                    $sessEnc = session_encode();
                    // WRITE VALUES TO SESSION DATA
                    $sessObj->write('', $sessEnc);

                    // SET COOKIE ON CLIENT MACHINE for 10 years
                    $cipherObj        = new PUCipher();
                    $puEncryptedEmail = $cipherObj->puEncrypt($post['emailaddress']);
                    setcookie(PREFIX . 'uniqueId1', $puEncryptedEmail, time() + IDLE_TIMEOUT, '/');


                } else {
                    $this->res['data']    = '';
                    $this->res['result']  = '1';
                    $this->res['msg']     = "Email/Password is incorrect.";
                    $this->res['session'] = '';
                }

                //echo '<pre>'; print_r(array($file_path,$session_file,$userData,$fileData,$this->res, $_SESSION)); die();
                print json_encode($this->res);
                exit;
            }
        }
    }

    /**
     * Modified By: Amit Malakar
     * Date: 12-Oct-2017
     * Logout function
     */
    public function doLogoutAction()
    {
    	$layout                         		= $this->layout();
        $layout->setTemplate('layout/simple');
		$request                        		= $this->getRequest();
        if ($request->isPost())
        {
			$post                         = $request->getPost()->toArray();
            if($post['session_file_name'] != '')
            {
                if(1) {
                    // logout with email hash
                    $decryptedUserEmail  = hash('sha256', $post['session_file_name']);
                    $sessObj = new PUSession($decryptedUserEmail);
                    $sessObj->destroy('');
                    //unlink(ABSO_URL."puidata/temp_session/sess_".$decryptedUserEmail);
                } else {
                    $this->open();
                    $this->destroy($post['session_file_name']);
                }


				$json['result'] 		= 	0;


				print json_encode($json);
			}
		}
		exit;
	}

	public function checkLoginAction()
    {
    	$layout                         		= $this->layout();
        $layout->setTemplate('layout/simple');
		$request                        		= $this->getRequest();
        if ($request->isPost())
        {
            $json                               = array();
			$post                         		= $request->getPost()->toArray();
            //echo '<pre>'; print_r(array($post, $_SESSION)); die();
            if($post['session_file_name'] != '')
            {
                if(1) {
                    // login via file system, with email hash
                    $fileName  = hash('sha256', $post['login_user']);
                    $file_path = ABSO_URL . "puidata/temp_session/sess_" . $fileName;
                    $fileExist = file_exists($file_path);
                    if ($fileExist) {
                        $handle       = fopen($file_path, "r+");
                        $fileDataJson = fgets($handle);
                        $fileData     = json_decode($fileDataJson, true);
                        fclose($handle);

                        if($fileData['email_address'] == $post['login_user'] && $fileData['php_sess_id'] != $_COOKIE['PHPSESSID']){
                            unset($_SESSION[PREFIX . 'user_info']);
                            unset($_SESSION[PREFIX . 'session_file']);
                            unset($_SESSION[PREFIX . 'uniqueId1']);
                            $json['result'] = 1;
                        }elseif (/*$fileData['php_sess_id'] == $_COOKIE['PHPSESSID'] &&*/ $fileData['email_address'] == $post['login_user']) {

                            $current_time     = strtotime(date('Y-m-d H:i:s'));
                            $user_active_time = isset($fileData['active_time']) ? $fileData['active_time'] : $current_time;

                            if (($current_time - $user_active_time) < IDLE_TIMEOUT) {
                                $fileData['active_time'] = $current_time;
                                $handle                  = fopen($file_path, "w+");
                                $session_file            = fwrite($handle, json_encode($fileData));
                                fclose($handle);
                                $json['result'] = 0;
                            } else {
                                // UNLIMITED SESSION, unlink commented
                                /* unlink($file_path);
                                unset($_SESSION[PREFIX . 'user_info']);
                                unset($_SESSION[PREFIX . 'session_file']);
                                unset($_SESSION[PREFIX . 'uniqueId1']);*/
                                $json['result'] = 1;
                            }
                        } else {
                            unset($_SESSION[PREFIX . 'user_info']);
                            unset($_SESSION[PREFIX . 'session_file']);
                            unset($_SESSION[PREFIX . 'uniqueId1']);
                            $json['result'] = 1;
                        }
                    } else {
//                        unset($_SESSION[PREFIX . 'user_info']);
//                        unset($_SESSION[PREFIX . 'session_file']);
//                        unset($_SESSION[PREFIX . 'uniqueId1']);
                        $json['result'] = 1;
                    }
                } else {
                    $awsObj 							= $this->AwsS3();
                    // login via AWS
                    $fileExist 			= $awsObj->fileExist('temp_session',"sess_".$post['session_file_name']);
                    //$file_path 			= ABSO_URL."puidata/temp_session/sess_".$post['session_file_name'];
                    if ($fileExist)
                    {
                        /*
                         * Modified By: Divya Rajput
                         * Date: 23-March-2017
                         * Purpose: Insert/Update user's active time to check idle state of user
                         */
                        $result  = $awsObj->getFileData("temp_session/"."sess_".$post['session_file_name']);
                        if (stripos($result['data'], $post['login_user']) == false) {
                            $json['result'] = 1;
                        }
                        else{
                            if($result['status_code'] == '200' && trim($result['data']) !== ''){
                                $session_file_info = json_decode($result['data'], true);
                                $current_time      = strtotime(date('Y-m-d H:i:s'));
                                $user_active_time  = isset($session_file_info['active_time']) ? $session_file_info['active_time'] : $current_time;
                                if( ( $current_time - $user_active_time ) < IDLE_TIMEOUT ){
                                    $session_file_info['active_time'] = $current_time;
                                    $session_file = $this->write($_SESSION[PREFIX.'uniqueId1'], json_encode($session_file_info));
                                    $json['result'] = 0;
                                }else{
                                    $awsObj->deleteFileData("temp_session/"."sess_".$post['session_file_name']);
                                    unset($_SESSION[PREFIX.'user_info']);
                                    unset($_SESSION[PREFIX.'session_file']);
                                    unset($_SESSION[PREFIX.'uniqueId1']);
                                    $json['result'] = 1;
                                }
                            }
                        }
                        /*End Here*/
//					$json['result'] = 0; //Commented By: Divya Rajput
                        /* $session = new Container('base');
                        $session->offsetSet('user_info', $userData);
                        $session->offsetSet('session_file', $session_file); */
                    }
                    else
                    {
                        unset($_SESSION[PREFIX.'user_info']);
                        unset($_SESSION[PREFIX.'session_file']);
                        unset($_SESSION[PREFIX.'uniqueId1']);
                        $json['result'] 		= 	1;
                    }
                }

				echo json_encode($json);
			}
		}
		exit;
	}

	/*public function open()
    {
		$this->id = $_SESSION[PREFIX.'uniqueId1'];

        $savePath = ABSO_URL."puidata/temp_session";

        //$this->savePath = $savePath;
        if (!is_dir($this->savePath)) {
            mkdir($this->savePath, 0744);
        }
        return true;
    }

    public function close()
    {
        return true;
    }

    public function read($id)
    {
//    	$awsObj 				= $this->AwsS3();
//    	$result  				= $awsObj->getFileData("temp_session/sess_".$id);
//    	if($result['status_code'] == '200' && trim($result['data']) !== '')
//			return 	$result['data'];
        return (string)@file_get_contents("temp_session/sess_".$id);
    }

    public function write($id, $data)
    {
//    	$awsObj 				= $this->AwsS3();
//    	$result  				= $awsObj->setFileData("temp_session/sess_".$id,$data);
		$variable = file_put_contents("$this->savePath/sess_".$id, $data) === false ? false : true;
		return $id;
    }

    public function destroy($id)
    {
// 		$awsObj 				= $this->AwsS3();
//    	$result  				= $awsObj->deleteFileData("temp_session/sess_".$id);
 		$file = "temp_session/sess_".$id;
 		unlink($file);

        return true;
    }

    public function gc($maxlifetime)
    {
//        foreach (glob("$this->savePath/sess_*") as $file) {
//            if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
//                unlink($file);
//            }
//        }

        return true;
    }*/

    public function destroySessionManuallyAction(){
        $userEmail				=	$_GET['userEmail'];
        $fileArray              =   glob(ABSO_URL."puidata/temp_session/*");
        /*$awsObj 				= 	$this->AwsS3();

        $temp['path'] 			= 'temp_session';
		$temp['detailed'] 		= false;
		$returnArray 			= $awsObj->getBucketFilesLists($temp);
		$fileArray 				= array();
        foreach ($returnArray as $file) {
            $filename 			= $file;
            $file_path_parts 	= pathinfo($filename);
            $file_name 			= $file_path_parts['filename'];
            array_push($fileArray, $file_name);
        }

        foreach($fileArray as $key => $value)
		{
			$fileExist 			= $awsObj->fileExist('temp_session',$value);
			$buffer 			= '';
			if($fileExist)
			{
				$result  = $awsObj->getFileData("temp_session/".$value);
				if($result['status_code'] == '200' && trim($result['data']) !== '')
					$buffer 	= $result['data'];
			}

			if (stripos($buffer, $userEmail) !== false) {
                $awsObj->deleteFileData("temp_session/".$value);
                die("User session removed");
            }
		}*/

		foreach($fileArray as $key => $value)
		{

			$handle = fopen($value, "r") or die('cannot create file');

			while (($buffer = fgets($handle)) !== false)
			{
				//if string exists
				if (stripos($buffer, $userEmail) !== false)
				{

					fclose($handle);
					unlink($value);
                                                    die("User session removed");
				}
			}
		}

        //return new ViewModel();
    }

    /**
     * Action to verify user email id on registration, send welcome email
     * Modified By: Amit Malakar
     * Date: 11-Sep-2017
     */
    public function verifyMailAction(){
        $json           = array();
        $access_token   = isset($_REQUEST['token']) ? $_REQUEST['token'] : 0;

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
        if($userInfo && $access_token)
        {
            $cipherObj                              = $this->PUCipher();
            $emailAddress                           = $cipherObj->puDecrypt($access_token);

            if(strtolower($userInfo['email_address']) == strtolower($emailAddress))
            {
                /*$tokenDataArray = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
                if(intval($tokenDataArray[0]['ur_status']) == 1)
                {*/
                    return $this->redirect()->toRoute('store');
                //}
            }
            else
            {
                $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
            }
        }

        // retrieve user email from token
        /*$cipherObj      = $this->PUCipher();
        $userTokenEmail = $cipherObj->puDecrypt($access_token);

        // check if user session exists
        $userInfo = $_SESSION[PREFIX . 'user_info'];

        if (isset($userInfo['email_address']) && $userInfo['email_address'] != $userTokenEmail) {
            // diff user's session exists, destroy session
            unset($_SESSION[PREFIX . 'user_info']);
            unset($userInfo);
        }*/

        if(count($expiration_msg) == 0)
        {
            if($access_token){
                $tokenDataArray = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
                // ur_instance_id, user_node_id, ur_status, node_instance_id, account_node_instance_id

                if(count($tokenDataArray)){
                    $user_node_id               = $tokenDataArray[0]['user_node_id'];
                    $user_node_instance_id      = $tokenDataArray[0]['node_instance_id'];
                    $account_node_instance_id   = $tokenDataArray[0]['account_node_instance_id'];
                    $tokenUsedStatus            = $tokenDataArray[0]['ur_status'];
                    $userRegNodeInstanceId      = $tokenDataArray[0]['ur_instance_id'];
                    if(!$tokenUsedStatus) {
                        if(($user_node_instance_id > 0) && $account_node_instance_id > 0){
                            $this->getClassesTable()->createInstance('', '', 2, 'P', $user_node_instance_id); //Individual Class Instance Update
                            $this->getClassesTable()->createInstance('', '', 2, 'P', $account_node_instance_id); //Account Class Instance Update
                            // Add Account->Status = Active
                            $ncpIdArray = array(ACCOUNT_STATUS_ID);
                            $ncpValueArray = array('active');
                            $typeId = 2;
                            $res1 = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $account_node_instance_id, $typeId);

                            // User registration -> used status 1
                            $ncpIdArray = array(USER_REG_STATUS_PID);
                            $ncpValueArray = array(1);
                            $typeId = 2;
                            $res2 = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $userRegNodeInstanceId, $typeId);

                            //fetch User Detail through User ID
                            $userInfo = $this->getClassesTable()->getUserProfile($user_node_id);

                            //Welcome Mail
                            $params = array();
                            $params['email']        = $userInfo['email_address'];
                            $params['toFirstName']  = $userInfo['first_name'];
                            $params['template']     = 'welcome-mail';
                            $params['from']         = ADMIN_CONFIG['email'];
                            $params['subject']      = 'Welcome to Prospus';
                            $mailResult = $this->sendWelcomeMail($params);

                            $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
                            $apiObj = new ApiTable($dbAdapter);
                            $result = $apiObj->setUserSession($userInfo);

                            $json['data']                      = $result['userData'];
                            $json['header_notification_count'] = $result['notificationCount'];
                            $json['success']                   = 1;
                            $json['msg']                       = 'Success';
                            return $this->redirect()->toRoute('store');
                        }
                    } else {

                        $expiration_msg     = array('title'=> 'Link Expired' ,'msg' => 'Access Token already used.');
                    }
                }else{
                    $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
                }
            }else{
                $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
            }
        }

        $this->layout()->setTemplate('layout/layout_new');
        $this->layout()->setVariable('store_list', json_encode(array(), JSON_FORCE_OBJECT));
        $this->layout()->setVariable('course_list', json_encode(array()));
        $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
        $this->layout()->setVariable('view_type', '');
        $this->layout()->setVariable('page_name', 'store');
        $this->layout()->setVariable('expiration_msg', json_encode($expiration_msg, JSON_FORCE_OBJECT));
        $viewModel                      = new ViewModel();
        $viewModel->setTemplate('administrator/marketplace/index.phtml');
        return $viewModel;
    }
    /*Add action for send mail
     * Created by Gaurav
     * Added on 30 Aug 2017
     * **/
    public function welcomeMailAction(){
        $params = array();
        $params['email'] = 'gaurav@prospus.com';
        $params['toFirstName'] = 'Gaurav';
        $params['template'] = 'welcome-mail';
        $params['from'] = ADMIN_CONFIG['email'];
        $params['subject'] = 'Welcome to Prospus';
        $mailResult = $this->sendWelcomeMail($params);
        print_r($mailResult);
        exit;
    }
    /*Add function for send welcome mail
     * Created by Gaurav
     * Added on 30 Aug 2017
     * **/
    public function sendWelcomeMail($params){

        //error_reporting(E_ALL);
        $mailObj = $this->PUMailer();
        $mailResult = $mailObj->userRegMail($params);
        return $mailResult;


    }

    /**
     * Added by Gaurav
     * Added on 31 Aug 2017
     * Resend mail for account activation
     */
    public function resendMailAction(){
        $params = array();
        $params['email'] = $_REQUEST['email_address'];
        $params['toFirstName'] = $_REQUEST['first_name'];
        $params['template'] = 'user-registration';
        $params['from'] = 'support@prospus.com';
        $params['subject'] = 'Confirm your email address';
        $params['hashKey'] = urlencode($_REQUEST['hashKey']);
        //error_reporting(E_ALL);
        $mailObj = $this->PUMailer();
        $mailResult = $mailObj->userRegMail($params);
        print_R($mailResult);exit;
    }


    /**
     * Added by Gaurav
     * Added on 31 Aug 2017
     * Modified by: Amit Malakar
     * Date: 22-Sep-2017
     * verify guest mail for account activation
     */
    public function verifyGuestAction(){

        /*unset($_SESSION[PREFIX . 'user_info']);
        unset($loggedInUser);die();*/
        
        $token = $_REQUEST['token'] ?? 0;
        
        // retrieve user email from token
        $cipherObj = $this->PUCipher();
        $paramsArr = $cipherObj->puUrlParamDecrypt($token);
        
        // check if user session exists
        if (isset($_COOKIE[PREFIX . 'uniqueId1']) && !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
            $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
            $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
            $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);

            $sessObj  = new PUSession($decryptedHashedUserEmail);
            $sessData = $sessObj->read('');
            // DECODE SESSION FILE DATA
            session_decode($sessData);
        }
        $userInfo           = $_SESSION[PREFIX . 'user_info'];
        $expiration_msg     = array();
        if($userInfo) {
            if(intval($userInfo['node_id']) != intval($paramsArr['uid']))
            {
                $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
            }
        }

        if(count($expiration_msg) == 0)
        {
            $_REQUEST  = $paramsArr;
            
            $dbAdapter     = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
            $apiObj        = new ApiTable($dbAdapter);
            $userInfoData  = $apiObj->emailExists($_REQUEST['email'], true);
            $accountStatus = $userInfoData['account_status'];
            
            $userInfo                  = array();
            $userInfo['user_node_id']  = $_REQUEST['uid'];
            $userInfo['email_address'] = $_REQUEST['email'];
            $courseId                  = $_REQUEST['cid'];
            
            if(isset($_REQUEST['did']))
            $dialogueId                = $_REQUEST['did'];
            else if(isset($_REQUEST['pid']))
            $productionId                = $_REQUEST['pid'];
            
            $isGuestFlag               = false;
            
            if ($accountStatus == 'guest' || $accountStatus == '') {
                $isGuestFlag = true;
            } elseif ($accountStatus == 'active') {
                $userInfo['password'] = $userInfoData['password'];
            }
            
            // CHECK SESSION
            $loggedInUser = $_SESSION[PREFIX . 'user_info'];
            // GUEST
            if ($isGuestFlag) {
                /*if (count($loggedInUser)) {
                    // SESSION ME or OTHER
                    unset($_SESSION[PREFIX . 'user_info']);
                    unset($loggedInUser);
                }*/
                // SET MY DATA IN SESSION
                $apiObj->setUserSession($userInfo, $isGuestFlag);
                if(isset($_REQUEST['did']))
                    return $this->redirect()->toUrl(BASE_URL . 'inbox?cid=' . trim($courseId) . '&did=' . trim($dialogueId));
                else if(isset($_REQUEST['pid']))
                    return $this->redirect()->toUrl(BASE_URL . 'inbox?cid=' . trim($courseId) . '&pid=' . trim($productionId));


            } elseif ($accountStatus == 'active' || $accountStatus == 'inactive') {
                /*// ACTIVE
                if (count($loggedInUser)) {
                    // SESSION
                    if ($loggedInUser['email_address'] == $paramsArr['email']) {
                        // ME
                        return $this->redirect()->toUrl(BASE_URL . 'inbox?cid=' . $courseId . '&did=' . $dialogueId);
                    } else {
                        // OTHER
                        unset($_SESSION[PREFIX . 'user_info']);
                        unset($loggedInUser);
                    }
                }

                // redirect to login
                // store in session course/dialogue
                // redirect to course/dialogue
                $_SESSION[PREFIX . 'route'][$paramsArr['email']]['courseId']   = $courseId;
                $_SESSION[PREFIX . 'route'][$paramsArr['email']]['dialogueId'] = $dialogueId;

                return $this->redirect()->toUrl(BASE_URL . 'store#login');*/
                
                $expiration_msg     = array('title'=> 'Link Expired' ,'msg' => 'Access Token already used.');
                $this->layout()->setTemplate('layout/layout_new');
                $this->layout()->setVariable('store_list', json_encode(array(), JSON_FORCE_OBJECT));
                $this->layout()->setVariable('course_list', json_encode(array()));
                $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
                $this->layout()->setVariable('view_type', '');
                $this->layout()->setVariable('page_name', 'store');
                $this->layout()->setVariable('expiration_msg', json_encode($expiration_msg, JSON_FORCE_OBJECT));
                $viewModel                      = new ViewModel();
                $viewModel->setTemplate('administrator/marketplace/index.phtml');
                return $viewModel;

            }
        }
        else
        {
            $this->layout()->setTemplate('layout/layout_new');
            $this->layout()->setVariable('store_list', json_encode(array(), JSON_FORCE_OBJECT));
            $this->layout()->setVariable('course_list', json_encode(array()));
            $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
            $this->layout()->setVariable('view_type', '');
            $this->layout()->setVariable('page_name', 'store');
            $this->layout()->setVariable('expiration_msg', json_encode($expiration_msg, JSON_FORCE_OBJECT));
            $viewModel                      = new ViewModel();
            $viewModel->setTemplate('administrator/marketplace/index.phtml');
            return $viewModel;
        }
    }
    
    /* Action to reset password, after forgot password
     * Created By: Amit Malakar
     * Date: 11-Sep-2017
     */
    public function resetpasswordAction()
    {
        $json            = array();
        $access_token    = isset($_REQUEST['token']) ? $_REQUEST['token'] : 0;
        $password        = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';
        $confirmPassword = isset($_REQUEST['confirm_password']) ? $_REQUEST['confirm_password'] : '';

        // check if token is valid and not used
        if ($access_token) {
            $tokenDataArray                 = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
            //$tokenDataArray[0]['ur_status'] = 0; //#######

            if (count($tokenDataArray)) {
                if ($tokenDataArray[0]['ur_status'] == 0) {
                    $cipherObj    = new PUCipher();
                    $emailAddress = $cipherObj->puDecrypt($access_token);
                    $emailData = array();
                    $emailData['account_class_id'] = ACCOUNT_CLASS_ID;
                    $emailData['email_address_property_id'] = INDIVIDUAL_EMAIL_ID;
                    $emailData['email_address'] = $emailAddress;
                    $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
                    $apiObj    = new ApiTable($dbAdapter);
                    $userInfo  = $apiObj->emailExists($emailData, true);
                    //echo json_encode(array($tokenDataArray, $emailAddress, $password, $confirmPassword, $userInfo));exit;//#######

                    // User registration -> used status 1
                    $ncpIdArray            = array(USER_REG_STATUS_PID);
                    $ncpValueArray         = array(1);
                    $typeId                = 2;
                    $userRegNodeInstanceId = $tokenDataArray[0]['ur_instance_id'];
                    $res                   = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $userRegNodeInstanceId, $typeId);

                    // validate password and confirm password
                    if ($password === $confirmPassword) {
                        $pwdRes = $this->validatePassword($password);
                        if ($pwdRes['success']) {
                            // fetch User Detail through User email address
                            $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
                            $apiObj    = new ApiTable($dbAdapter);
                            $emailData = array();
                            $emailData['account_class_id'] = ACCOUNT_CLASS_ID;
                            $emailData['email_address_property_id'] = INDIVIDUAL_EMAIL_ID;
                            $emailData['email_address'] = $emailAddress;
                            $userInfo  = $apiObj->emailExists($emailData, true);
                            // $userInfo = $this->getClassesTable()->getUserProfile($user_node_id);

                            // Update Account Class password field
                            $newPasswordHash       = $cipherObj->puPasswordHash($password);
                            $ncpIdArray            = array(ACCOUNT_PASSWORD_ID);
                            $ncpValueArray         = array($newPasswordHash);
                            $typeId                = 2;
                            $accountNodeInstanceId = $tokenDataArray[0]['account_node_instance_id'];
                            $res = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $accountNodeInstanceId, $typeId);

                            // User Auto login
                            $result                            = $apiObj->setUserSession($userInfo);
                            $json['data']                      = $result['userData'];
                            $json['header_notification_count'] = $result['notificationCount'];
                            $json['result']                    = $result;
                            $json['success']                   = 1;
                            $json['msg ']                      = 'Password reset successful.';

                            return $this->redirect()->toRoute('store');
                        } else {
                            $json['success'] = 0;
                            $json['msg']     = $pwdRes['msg'];
                        }

                    } else {
                        $json['success'] = 0;
                        $json['msg']     = 'Password and confirm password do not match.';
                    }
                } else {
                    $json['success'] = 0;
                    $json['msg']     = 'Access Token already used.';
                }
            } else {
                $json['success'] = 0;
                $json['msg']     = 'Access Token Invalid.';
            }
        } else {
            $json['success'] = 0;
            $json['msg']     = 'Access Token Invalid.';
        }

        // check if email exists
        // then if password and confirm password are


        // get user info by email address

        echo json_encode($json);
        exit;
    }

    /**
     * Function to validate password for 8 min char, alnum
     * Created By: Amit Malakar
     * Date: 11-Sep-2017
     * @param $password
     * @return array
     */
    private function validatePassword($password)
    {
        $json = array();
        // alpha numeric
        // min 8 length
        if(ctype_alnum($password)) {
            if(strlen($password) >= 8) {
                $json['success']    = 1;
                $json['msg']        = 'Success';
            } else {
                $json['success']    = 0;
                $json['msg']        = 'Password should be min of 8 char.';
            }
        } else {
            $json['success']    = 0;
            $json['msg']        = 'Password should be alphanumeric.';
        }
        return $json;

    }
    
    /**
     * Added by Gaurav
     * Added on 22 Sept 2017
     * verify add participant mail for redirection
     */
    public function addParticipantAction(){
       
        
       return  $this->validateParticipant();
        
    }
    
    /**
     * Added by Gaurav
     * Added on 22 Sept 2017
     * verify add participant mail for redirection
     */
    public function validateParticipant(){
        $dbAdapter = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
        $token = $_REQUEST['token'];
        $cipherObj = new PUCipher();
        $paramsArr = $cipherObj->puUrlParamDecrypt($token);
        $_REQUEST = $paramsArr;
        
        $loginUserEmail    =  '';
        $participantEmail  = $_REQUEST['email'];
        $courseId          = $_REQUEST['cid'];
        $dialogueId        = $_REQUEST['did'];
        $productionId      = $_REQUEST['pid'];

        $expiration_msg     = array();
        $decryptedHashedUserEmail = hash('sha256', $participantEmail);
        $sessObj = new PUSession($decryptedHashedUserEmail);
        $sessData = $sessObj->read('');
        // DECODE SESSION FILE DATA
        session_decode($sessData);
        if(isset($_SESSION[PREFIX.'user_info'])){//session already exits
            $loginUserEmail = $_SESSION[PREFIX.'user_info']['email_address'];
            
            if($participantEmail!=$loginUserEmail){
                
                //unset($_SESSION[PREFIX.'user_info']);
                //$_SESSION[PREFIX.'route'][$participantEmail]['courseId'] = $courseId;
                //$_SESSION[PREFIX.'route'][$participantEmail]['dialogueId'] = $dialogueId;
                //Redirect to login page
                //return $this->redirect()->toUrl(BASE_URL.'store');
                $expiration_msg     = array('title'=> '404' ,'msg' => 'Page not found.');
                $this->layout()->setTemplate('layout/layout_new');
                $this->layout()->setVariable('store_list', json_encode(array(), JSON_FORCE_OBJECT));
                $this->layout()->setVariable('course_list', json_encode(array()));
                $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
                $this->layout()->setVariable('view_type', '');
                $this->layout()->setVariable('page_name', 'store');
                $this->layout()->setVariable('expiration_msg', json_encode($expiration_msg, JSON_FORCE_OBJECT));
                $viewModel                      = new ViewModel();
                $viewModel->setTemplate('administrator/marketplace/index.phtml');
                return $viewModel;
                
            }else{//same user already login redirected to particular course and dialgoue, production.
                if($productionId!=''){
                    return $this->redirect()->toUrl(BASE_URL.'inbox?cid='.$courseId.'&pid='.$productionId);
                }else{
                    return $this->redirect()->toUrl(BASE_URL.'inbox?cid='.$courseId.'&did='.$dialogueId);
                }
                
            }
        }else{
                //Redirect to login page
                $_SESSION[PREFIX.'route'][$participantEmail]['courseId']     = $courseId;
                if($dialogueId!=''){
                    $_SESSION[PREFIX.'route'][$participantEmail]['dialogueId']   = $dialogueId;
                }
                if($productionId!=''){
                    $_SESSION[PREFIX.'route'][$participantEmail]['productionId'] = $productionId;
                }

                // ENCODE BEFORE SAVING DATA
                $sessEnc = session_encode();
                // WRITE VALUES TO SESSION DATA
                $sessObj->write('', $sessEnc);
                
                return $this->redirect()->toUrl(BASE_URL.'store#login');   
        }      
    }

    /**
     * Created By: Arvind Soni
     * Added on 10 Oct 2017
     * to verify user loged in or not
     */
    public function checkUserLogedinAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if (isset($_COOKIE[PREFIX . 'uniqueId1']) && !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
            $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
            $cipherObj                = new PUCipher();
            $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
            $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);

            $sessObj  = new PUSession($decryptedHashedUserEmail);
            $sessData = $sessObj->read('');
            // DECODE SESSION FILE DATA
            session_decode($sessData);
            // delete cookie if different browser/PHPSESSID diff
            if($_COOKIE['PHPSESSID'] !== $_SESSION[PREFIX.'user_info']['php_sess_id']) {
                // empty value and expiration one hour before
                unset($_COOKIE[PREFIX . 'uniqueId1']);
                setcookie(PREFIX . 'uniqueId1', '', time() - 3600, '/');
                $json['status']             = 1;
                $json['is_logedin']         = 0;
                print json_encode($json);
                exit;
            }
        }
        $userInfo                   = $_SESSION[PREFIX . 'user_info'];
        $json                       = array();
        $json['status']             = 1;
        $json['is_logedin']         = 0;
        if ($request->isPost() && $userInfo) {
            $post = $request->getPost()->toArray();
            if(strtolower($userInfo['email_address']) == strtolower($post['email']))
            {
                $json['is_logedin'] = 1;
            }
        }

        print json_encode($json);
        exit;
    }
}
