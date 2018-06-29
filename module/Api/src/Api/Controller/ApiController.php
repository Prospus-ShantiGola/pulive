<?php

namespace Api\Controller;

use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Api\Model\ApiTable;
use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

/**
 *
 * @SWG\Resource(
 * apiVersion="1.0.0",
 * swaggerVersion="1.2",
 * basePath="http://localhost/pu",
 * resourcePath="/api",
 * description="PU API",
 * produces="['application/json']"
 * )
 */
class ApiController extends AbstractRestfulController {

    protected $apiTable;
    protected $storageType =STORAGE_NAME;

    public function getApiTable() {
        if (!$this->apiTable) {
            $sm = $this->getServiceLocator();
            $this->apiTable = $sm->get('Api\Model\ApiTable');
        }
        return $this->apiTable;
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

    public function getAdministratorTable()
    {
        if (!$this->administratorTable) {
            $sm = $this->getServiceLocator();
            $this->administratorTable = $sm->get('Administrator\Model\AdministratorTable');
        }
        return $this->administratorTable;
    }

    public function getList() {
        // Action used for GET requests without resource Id
        $requestedData = $this->params()->fromRoute();
        $requestedData['apiname'] = $this->params('apiname');
        return $this->get($requestedData);
    }

    /**
     * @SWG\Api(
     * path="/userlist",
     * @SWG\Operation(
     * method="GET",
     * summary="Find user's list",
     * notes="Returns all user's list",
     * type="UserList",
     * responseClass="\Api\Model\ApiTable",
     * authorizations={},
     * @SWG\ResponseMessage(code=400, message="Invalid ID supplied"),
     * @SWG\ResponseMessage(code=404, message="Project not found")
     * )
     * )
     */
    public function get($requestedData) {   // Action used for GET requests with resource Id
        $apiName = $requestedData['apiname'];

        switch ($apiName) {
            case 'classlist' :
                //Get Class structure and instance
                $result = $this->getApiTable()->getClassData($requestedData['classId']);
                break;
            case 'course' :
                //Get all course
                //$_data['view_type'] == 'bycourse'
                $requestedData['view_type'] = 'bycourse';
                //$requestedData['course_property_ids'] = COURSE_TITLE_ID . ", " . COURSE_TIMESTAMP_ID.", ".COURSE_CREATED_BY_ID;

                $instanceArra = $this->getApiTable()->fetchCourseApi($requestedData);
                //return new JsonModel(array('data' => $instanceArra));
                $result = $this->courseListData($instanceArra);
                break;
            case 'coursedialoguetime' :
                //Get all course and dialogue details, based on time
                $result = $instanceArra = $this->getApiTable()->fetchCourseDialogueTimeApi($requestedData);
                //return new JsonModel(array('data' => $instanceArra));
                //$result = $this->courseListData($instanceArra);
                break;
            case 'dialouge' :
                //Get all dialoguee of course
                $result = $this->getApiTable()->fetchCourseDialogueApi($requestedData);
                break;
            case 'userlist' :
                //Get all user list
                $result = $this->getApiTable()->getUserList($requestedData);
                break;
            case 'validateconnection' :
                //Check internet connection
                $result = $this->getApiTable()->verifyNetConnection();
                break;
            case 'login' :
                //Check login credentials
                $requestedData['emailaddress_property_id']  = INDIVIDUAL_EMAIL_ID;
                $requestedData['password_property_id']      = ACCOUNT_PASSWORD_ID;
                $requestedData['node_id']                   = ACCOUNT_CLASS_NODE_ID;
                if(isset($requestedData['platform']) && strtolower($requestedData['platform']) === "ios"){
                    $requestedData['individual_prop_ids']   = INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME.", ".INDIVIDUAL_DEVICE_TOKEN;
                }else{
                    $requestedData['individual_prop_ids']   = INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME;
                }
                $requestedData['role_prop_ids']             = INDIVIDUAL_EMAIL_ID.", ".ROLE_COMMON_NAME_PID.", ".ROLE_DOMAIN_PID;
                $result = $this->getApiTable()->validateUser($requestedData);
                break;
            case 'production' :
                //For send perticuler production data which are saving form jquery course builder
                $result = $this->getApiTable()->fetchPerticulerCourseBuilder($requestedData['instanceId']);
                break;
            case 'productionlist' :
                //For send all course builder production list which are saving form jquery course builder
                $result = $this->getApiTable()->fetchAllCoursesOfCourseBuilder();
                break;
            case 'logout' :
                //Empty device token value
                $result = $this->getApiTable()->logoutUser($requestedData);
                break;
            case 'productionclasslist' :
                //For send all node y type of class list form PU
                $result = $this->getApiTable()->getAllClassList();
                break;
            case 'productionclassproperty' :
                /* Start Code By Arvind Soni For Caching */
                /*$manager = $this->getServiceLocator()->get('MemorySharedManager');
                $manager->setStorage($this->storageType);
                $classCachedData = '';
                $class_file_name = "class_builder_" . $requestedData['classid'];
                $classCachedData = $manager->read($class_file_name);*/

                /* End Code By Arvind Soni For Caching */
                //For send all properties of class
                //if ($classCachedData == "") {
                    $result             = $this->getApiTable()->fetchClassPropertiesFromClass($requestedData['classid']);
                    /*$manager->write($class_file_name, $result);
                }
                else
                {
                    $result             = $classCachedData;
                }*/
                break;
            case 'rolelist' :
                //For send all node y type of class list form PU
                $result = $this->getApiTable()->getRoleList($requestedData['group']);
                break;
            case 'statements' :
                /**
                 * Function to get all statements of dialogue
                 * params dialogue instance node id
                 */
                $result = $this->getApiTable()->getDialogueStatements($requestedData);
                break;
            case 'operation' :
                //For send all properties of class
                $result = $this->getApiTable()->fetchOperationOfClass($requestedData['productionid']);
                break;
            case 'classstructure' :
                //For structure of class
                $result = $this->getApiTable()->getClassStructure($requestedData['classid']);
                break;
                /* Added by Gaurav
                 * 02 June 2017
                 */
            case 'coursedialogue' :
                //Get all course and dialogue details, based on time
                if(!isset($requestedData['view_type']) || $requestedData['view_type']==''){
                    $requestedData['view_type'] = 'bycourse';
                }

                $course_data =  $this->getApiTable()->getCourseDialogue($requestedData);
                $courseList =   $this->getApiTable()->courseData($course_data, $requestedData);
                $courseListRes['course'] = $courseList;
                $courseListRes['timestamp'] = "".time();
                $result = $courseListRes;
                break;
                /* Added by Gaurav
                 * 08 June 2017
                 */
            case 'allstatements' :
                /**
                 * Function to get all statements of dialogue
                 * params dialogue instance node id
                 */
                if(isset($requestedData['timestamp']) && $requestedData['timestamp']=="0"){/*Last three days data*/
                    $requestedData['timestamp']=  strtotime("-3 days");
                }

                $statementResTemp = $this->getApiTable()->getDialogueAllStatements($requestedData);
                $statementRes = $statementResTemp['statement'];
                //$result =  $statementRes = $statementResTemp;break;
                $dialogueRes  = $statementResTemp['dialogue'];

                $totalUnreadTemp = $this->getApiTable()->fetchUserDialogueNotificationCount($dialogueRes , $requestedData['login_userId'], 'chat');
                $totalUnreadCount = array();
                foreach($totalUnreadTemp as $key=>$val){
                    $totalUnreadCount[$val['dialogue_node_id']][] = $val['node_instance_id'];
                }
                //Remove Notification after reading.
                 $this->getApiTable()->deleteNotificationUserWise($dialogueRes, $requestedData['login_userId']);


               //$result = array($unreadCountArr);break;
                $res['timestamp'] = "".time();
                if(count($statementRes)>0){
                    /*Get actor data start*/
                    $actor_ids = array_unique(array_column($statementRes, 'actor.author'));
                    $actorProeprtyIds = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME);
                    $actorArr = $this->getApiTable()->getActorInfo($actor_ids, $actorProeprtyIds);
                    $actorProp = $this->getApiTable()->getActorFormatData($actorArr);
                    $actorCol = array_unique(array_column($actorProp, 'actor_id'));
                    $actor = array_combine($actorCol, $actorProp);


                    $paramArr['statementRes']= $statementRes;
                    $paramArr['actor'] = $actor;
                    $paramArr['totalUnreadCount'] = $totalUnreadCount;

                    $res['dialogue'] = json_decode(json_encode($this->formatStatements($paramArr),JSON_FORCE_OBJECT));;
                /*end*/
                }else{
                   $res['dialogue'] = (object) array();
                }
                $result = $res;
                break;
                /* Added by Gaurav
                 * 09 June 2017
                 */
            case 'newuserlist' :
                //Get all user list
                $result = $this->getApiTable()->getUserListNew($requestedData);
                break;
            case 'validation' :
                //Get production validation list
                $result = $this->getApiTable()->getValidationList($requestedData);
                break;
            //added by Gaurav
            //added on 17 Aug
            //for send mail
            case 'email':
                $params = isset($_REQUEST) ? $_REQUEST : array();
                $mailObj = $this->PUMailer();
                //Get guest users
                $guestsArr = array_values(array_filter($params['toUserList'], function($key) {
                      return  $key['accountStatus'] == 'guest' ? $key : '';
                }));      
                /*Send mail to guest users start*/
                $guestMailRes = '';
                $result = array();
                if(count($guestsArr)>0){
                    $paramsGuests = array();
                    $paramsGuests['from']           = ADMIN_CONFIG['email'];
                    $paramsGuests['template']       = 'guest-mail';
                    $paramsGuests['courseId']       = $params['courseId'];
                    if($params['productionTitle']!=''){
                        $paramsGuests['subject']        = "You are added in ".$params['productionTitle']." Production";
                    }else{
                        $paramsGuests['subject']        = "You are added in ".$params['dialogueTitle']." Dialogue";
                    }
                     
                    if(isset($params['productionId']) && $params['productionId']!=''){
                        $paramsGuests['productionId']   = $params['productionId'];
                    }else{
                        $paramsGuests['dialogueId']     = $params['dialogueId'];
                    }
                    
                    $paramsGuests['adminName']      = $params['adminName'];
                    $paramsGuests['toUserList']     = $guestsArr;
                    $result['guestMailRes'] = $mailObj->sendGuestMail($paramsGuests);
                }     
                /*Send mail to guest users end*/
                if(count($params)) {
                    $result['aciveUserMailRes']  = $mailObj->chatEmailing($params);
                }
                break;
            case 'getcourseworkflowproduction':
                $result = $this->getApiTable()->getCourseWorkflowProduction($requestedData);
                break;
            case 'pureports':
                // CRON JOB - PU REPORTS on Google SpreadSheet via Form Data
                $pugObj        = $this->PUGData();
                $puReportsData = $pugObj->getPuReportsData($this->getApiTable());
                $formData      = [
                    PU_REPORTS_FORM_FIELDS['year']          => date('Y'),   // to check if date field is
                    PU_REPORTS_FORM_FIELDS['month']         => date('n'),   // required or not
                    PU_REPORTS_FORM_FIELDS['day']           => date('j'),   // else remove these 3 fields
                    PU_REPORTS_FORM_FIELDS['t_reg_users']   => $puReportsData['t_reg_users'],          // Total Registered Users - ALL
                    PU_REPORTS_FORM_FIELDS['t_def_dia_crs'] => $puReportsData['t_def_dia_crs'],        // Total Default Dialogue Courses
                    PU_REPORTS_FORM_FIELDS['t_prod_crs']    => $puReportsData['t_prod_crs'],           // Total Production Courses
                    PU_REPORTS_FORM_FIELDS['t_prd_dia_crs'] => $puReportsData['t_prd_dia_crs'],        // Total Dialogues in Production Courses
                    PU_REPORTS_FORM_FIELDS['t_dia']         => $puReportsData['t_dia'],                // Total Dialogues
                    PU_REPORTS_FORM_FIELDS['t_stat']        => $puReportsData['t_stat'],               // Total Statements
                ];
                $result        = $pugObj->updateSpreadsheetForm(PU_REPORTS_FORM_URL, $formData);
                $data          = ['sheetUrl' => PU_REPORTS_SHEET_URL, 'date' => date('j-M-Y'), 'formData' => $formData];
                //echo '<pre>'; print_r($data); die();
                $mailObj = $this->PUMailer();
                $result  = $mailObj->puReportsMail($data);
                break;
            case 'downloadfile':
                // Created By: Amit Malakar, 22-Sep-2017
                // Common function to download any file in PROJECT SCOPE via AJAX
                // apiname = downloadfile, filepath = <filepath> - not domain url
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
                $userInfo = $_SESSION[PREFIX . 'user_info'];
                if ($userInfo) {
                    $filePath       = ABSO_URL. $_REQUEST['filepath'];
                    /*$imageMimeTypes = ['image/png', 'image/gif', 'image/jpeg'];
                    $finfo          = finfo_open(FILEINFO_MIME_TYPE);
                    $fileMimeType   = finfo_file($finfo, $filePath);
                    finfo_close($finfo);
                    $fileMimeType   = mime_content_type($filePath);*/
                    $fileExtTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'PNG', 'JPG', 'JPEG', 'GIF'];
                    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
                    if (!in_array($ext, $fileExtTypes)) {
                        // invalid file type, blank download file
                        $filePath = '';
                    }
                } else {
                    // User not logged in, blank download file
                    $filePath = '';
                }
                if(SOCKET_HOST_NAME != 'http://localhost/pu/') { // as on DEV ob_gzhandler is enabled
                    ob_flush();
                    ob_start();
                }
                //echo '<pre>'; print_r([ini_get('output_buffering'),  ob_get_level(), ob_get_status()]); die();
                header('Content-Description: File Transfer');
                header('Content-Type: application/force-download');
                header('Content-Disposition: attachment; filename=' . basename($filePath));
                header('Content-Transfer-Encoding: binary');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Content-Length: ' . filesize($filePath));
                //error_reporting(E_ALL);
                // Set the user
                //echo '<pre>'; print_r([$filePath,file_exists($filePath), fileperms($filePath), fileowner($filePath), filegroup($filePath), stat($filePath)]);
                //print_r([get_current_user(),getmyuid(),getmygid(),getmypid()]);
                ob_clean();
                flush();
                readfile($filePath);
                /*$handle = fopen($filePath, 'rb');
                $buffer = '';
                while (!feof($handle)) {
                    $buffer = fread($handle, 4096);
                    //echo $buffer;
                    ob_flush();
                    flush();
                }
                fclose($handle);*/
                exit;
                break;
            case 'removefolderandfiles':
                // Created By: Arvind Soni, 12-Oct-2017
                // Common function to delete all folder from data/temp
                // apiname = downloadfile, filepath = <filepath> - not domain url
                $path = ABSO_URL.'data/temp';
                $dirs = array_filter(glob($path.'/*'), 'is_dir');

                foreach($dirs as $k => $folderPath)
                {
                    $this->rrmdir($folderPath);
                }
                $result = $dirs;
                break;
            case 'putdata':
                // Created By: Arvind Soni, 23-Oct-2017
                $menuArray  = $this->getAdministratorTable()->getMainLeftMenu();
                $result     = $this->getApiTable()->insertMenuDataFromMenuTable($menuArray);
                break;
        }
        return new JsonModel(array('data' => $result));
    }

    public function create($data) {
        // Action used for POST requests
        if (empty($data)) {
            $data = json_decode(file_get_contents('php://input'), true);
        }

        $apiName = $this->params('apiname') ? $this->params('apiname') : $data['apiname'];
        unset($data['apiname']);
        switch ($apiName) {
            case 'card' :
                $result                                     = $this->getApiTable()->getClassData($data['classId']);
                break;
            case 'production' :
                $result                                     = $this->getApiTable()->createClassFromCourseBuilder($data);
                break;
            case 'addrole' :
                $result                                     = $this->getApiTable()->insertRoleInstance($data['role']);
                break;
            case 'viewinstance' :
                $result                                     = $this->getApiTable()->getFormStructure($data);
                break;
            case 'create_course_production' :
                /* Code For File Upload */
                $uploadPath         = ABSO_URL.'public/nodeZimg/';
                $downloadPath       = BASE_URL.'public/nodeZimg/';
                $folderName         = date('dmYhis');
                mkdir($uploadPath .$folderName, 0777,true);
                foreach ($_FILES as $key => $file) {
                    $instancePropId                         = str_replace('filenodeZ', '', $key);
                    $index                                  = array_search($instancePropId, $data['instance_property_id']);
                    $newFileName                            = $file['name'];

                    $return                                 = 0;
                    if($file["tmp_name"] != '')
                    {
                        $return                             = $file["tmp_name"];//$sdkApi->setFileData("public/nodeZimg/".$newFileName,$file["tmp_name"],'file');
                        $return                             = 1;
                    }
                    if (move_uploaded_file($file["tmp_name"], $uploadPath . $folderName . '/' . $newFileName)) {
                    //if ($return) {
                        // set instance caption to store file name with path
                        if(!isset($data['instance_property_caption'])) {
                            $data['instance_property_caption'] = array();
                        }
                        array_splice($data['instance_property_caption'], $index, 0, $folderName . '/' . $newFileName);
                    } elseif (isset($data['id_detail_instance_id'])) {
                        // in case of form edit and file not uploaded
                        if (isset($data['fileZvalue' . $instancePropId])) {
                            if (!isset($data['instance_property_caption'])) {
                                $data['instance_property_caption'] = array();
                            }
                            array_splice($data['instance_property_caption'], $index, 0, $data['fileZvalue' . $instancePropId]);
                            unset($data['fileZvalue' . $instancePropId]);
                        } else {
                            $data['instance_property_caption'][$index] = '';
                        }
                    }
                }

                $result                                     = $this->getApiTable()->createCourseAndProductionFromOutside($data);
                break;
            case 'iconupload' :
                /* Code For File Upload */
                $uploadPath         = ABSO_URL.'public/nodeZimg/';
                $downloadPath       = BASE_URL.'public/nodeZimg/';
                $folderName         = date('dmYhis');
                mkdir($uploadPath .$folderName, 0777,true);
                $newFileName        = '';
                foreach ($_FILES as $key => $file) {
                    $newFileName                            = $file['name'];
                    move_uploaded_file($file["tmp_name"], $uploadPath . $folderName . '/' . $newFileName);
                }
                if($data['is_signup'])
                {
                    $result = 'public/nodeZimg/'.$folderName . '/' .$newFileName;
                }
                else
                {
                    $result = $folderName . '/' .$newFileName;
                }
                break;
            case 'registration' :
                /* Code For File Upload */
                $uploadPath         = ABSO_URL.'data/temp/';
                $downloadPath       = BASE_URL.'data/temp/';
                $folderName         = date('dmYhis');
                mkdir($uploadPath .$folderName, 0777,true);
                $newFileName        = '';
                foreach ($_FILES as $key => $file) {
                    $newFileName                            = $file['name'];
                    move_uploaded_file($file["tmp_name"], $uploadPath . $folderName . '/' . $newFileName);
                }

                $result = 'data/temp/'.$folderName . '/' .$newFileName;

                break;
            case 'production_unpublish' :
                $result                                     = $this->getApiTable()->unpublishProductionCB($data['production']);
                break;
            case 'signup' :
                     /*################################ USER REGISTRATION PROCESS ###############################################*/
                    //Code added by Gaurav on 20 sept 2017
                    $registrationArr    = $data['data'];
                    $emailAddress       = $registrationArr[INDIVIDUAL_EMAIL_ID]['value'];
                    $firstName          = @$registrationArr[INDIVIDUAL_FIRST_NAME]['value'];
                    $dbAdapter          = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
                    $apiObj             = new ApiTable($dbAdapter);
                    $userInfo           = $apiObj->emailExists($emailAddress, true);
                    $accountStatus      = $userInfo['account_status'];
                    $emailExistFlag     = false;
                    //Check email exits or not
                    if(isset($userInfo['email_address'])){
                        $emailExistFlag = true;
                    }
                    //If user already exits and not a guest user.
                    
                    if($emailExistFlag && $accountStatus!="guest"){
                        
                         $resArr['data'] =  array('success' => 0, 'msg' => 'User already exists.');
                         return new JsonModel($resArr);
                         
                    }
                    elseif($emailExistFlag && $accountStatus=="guest"){
                        //if user is guest
                        //if user is guest and registration through guest dashboard registration process.
                        
                        if($data['user_type']=='guest' && $data['guest_user_id']!=''){
                            //update password,last name and account status
                            $userNodeId = $data['guest_user_id'];
                            $this->getApiTable()->regGuestUser($registrationArr, $userNodeId, 'active');
                            //send welcome mail
                            $params = array();
                            $params['email'] = $emailAddress;
                            $params['toFirstName'] = $firstName;
                            $params['template'] = 'welcome-mail';
                            $params['from'] = ADMIN_CONFIG['email'];
                            $params['subject'] = 'Welcome to Prospus';
                            $mailObj = $this->PUMailer();
                            $mailResult = $mailObj->userRegMail($params);
                            $result['email_send'] = $mailResult;
                            
                            // User Auto login
                            $res                         = $apiObj->setUserSession($userInfo);
                            unset($res['userData']['courseList']);
                            //print_R($res);
                            $result['data']              = $res['userData'];
                            $result['header_notification_count'] = $res['notificationCount'];
                            $result['success']           = 1;
                            $result['msg']               = 'success';
                            return new JsonModel(array('data'=>$result));
                        }
                        else{
                            //if guest register through normal registratio proceess.
                              $userNodeId = $userInfo['node_id'];
                              $this->getApiTable()->regGuestUser($registrationArr, $userNodeId, 'inactive');//update password, firstname, last name and account status
                              $cipherObj   = new PUCipher();
                              $hashKey     = $cipherObj->puEncrypt($emailAddress);   // email hash to send to email as link
                              $hashKeyArr  = $this->userRegistrationLink($hashKey);
                              //Store user unique key value in User Registration Table.
                              $this->getApiTable()->createUserRegistrationInstance($hashKeyArr, $userNodeId);
                              
                              $params = array();
                              $params['email'] = $emailAddress;
                              $params['toFirstName'] = $firstName;
                              $params['template'] = 'user-registration';
                              $params['from'] = ADMIN_CONFIG['email'];
                              $params['subject'] = 'Confirm your email address';
                              $params['hashKey'] = urlencode($hashKey);   // puEncrypt requires urlencode for email links
                              $mailObj = $this->PUMailer();
                              $mailResult = $mailObj->userRegMail($params);
                              $userDetails = array();
                              $userDetails['first_name']    = $firstName;
                              $userDetails['last_name']     = $registrationArr[INDIVIDUAL_LAST_NAME]['value'];
                              $userDetails['email_address'] = $emailAddress;
                              $userDetails['mail'] = $mailResult;
                              $resArr =  array('success' => 1, 'msg' => 'User registered successfully.', 'data' => $userDetails);
                              return new JsonModel(array('data'=>$resArr));
                              
                          
                        }
                    }else{
                        // Code modified: Amit Malakar
                        // Date: 8-Sep-2017
                        $cipherObj                                     = new PUCipher();
                        $hashKey                                       = $cipherObj->puEncrypt($emailAddress);   // email hash to send to email as link
                        $registrationArr[ACCOUNT_PASSWORD_ID]['value'] = $cipherObj->puPasswordHash($registrationArr[ACCOUNT_PASSWORD_ID]['value']);  // hashed password
                        // get User Registration instance data
                        $hashKeyArr = $this->userRegistrationLink($hashKey);
                        $result                                     = $this->getApiTable()->signupInPU($registrationArr, $hashKeyArr, $emailExistFlag);

                        //Send mail
                        if($result['success']=='1'){
                            $params = array();
                            $params['email'] = $emailAddress;
                            $params['toFirstName'] = $firstName;
                            $params['template'] = 'user-registration';
                            $params['from'] = ADMIN_CONFIG['email'];
                            $params['subject'] = 'Confirm your email address';
                            $params['hashKey'] = urlencode($hashKey);   // puEncrypt requires urlencode for email links
                            error_reporting(E_ALL);
                            $mailObj = $this->PUMailer();
                            $mailResult = $mailObj->userRegMail($params);
                            $result['email'] = $mailResult;
                            $resultData = $result['data'];
                        }elseif($result['success']=='0'){
                            $resultData = $result;
                        }
                }
                break;
            case 'forgotpwd':
                // verify user email if exists
                $emailAddress = $data['email_address'];
                if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
                    $result['success'] = 0;
                    $result['msg']     = 'Not a valid email address.';
                } else {
                    $userInfo                                   = $this->getApiTable()->emailExists($emailAddress, true);
                    // check if user's account_status is active
                    if ($userInfo) {
                        if(isset($userInfo['account_status']) && (strtolower($userInfo['account_status'])=='active' || strtolower($userInfo['account_status'])=='')) {
                            // if exists send verification email
                            $params['to_email']      = $userInfo['email_address'];
                            $params['to_first_name'] = $userInfo['first_name'];
                            // Generate email hash to decrypt later on user return
                            $cipherObj          = new PUCipher();
                            $params['hash_key'] = $cipherObj->puEncrypt($params['to_email']);

                            $hashKeyArr = $this->userRegistrationLink($params['hash_key']);
                            $this->getApiTable()->createUserRegistrationInstance($hashKeyArr, $userInfo['node_id']);

                            $mailObj            = $this->PUMailer();
                            $params['hash_key'] = urlencode($params['hash_key']);
                            if(0){//SOCKET_HOST_NAME == 'http://localhost/pu/') {
                                $result['token'] = $params['hash_key'];
                            } else {
                                /*$result             = */$mailObj->forgotPasswordMail($params);
                            }
                            $result['success']  = 1;
                            $result['msg']      = 'Password reset link has been sent to your email id. Please click the link to reset your password.';
                        }else if( isset($userInfo['account_status']) && (strtolower($userInfo['account_status']) == 'inactive') ) {

                            /*
                             * Added By Divya Rajput
                             * For Inactive user
                             * Date: 6 Oct 2017
                             */
                            $hashKey                = $this->getApiTable()->fetchHashKey($userInfo['email_address']);   // email hash to send to email as link

                            //Send mail
                            $params                 = array();
                            $params['email']        = $userInfo['email_address'];
                            $params['toFirstName']  = $userInfo['first_name'];
                            $params['template']     = 'user-registration';
                            $params['from']         = ADMIN_CONFIG['email'];
                            $params['subject']      = 'Confirm your email address';
                            $params['hashKey']      = urlencode($hashKey);   // puEncrypt requires urlencode for email links
                            error_reporting(E_ALL);
                            $mailObj                = $this->PUMailer();
                            $mailObj->userRegMail($params);

                            $result['success']      = 1;
                            $result['msg']          = 'We have sent you a verification link to your registered email address, please verify your email to login.';

                        } else {
                            // email id is not active
                            $result['success'] = 0;
                            $result['msg']     = 'Your account is not active yet.';
                        }
                    } else {
                        // else send validation msg, email don't exists
                        $result['success'] = 0;
                        $result['msg']     = 'Email address does not exists';
                    }
                }
                break;

                //add guest users
                //added by gaurav on 8 sept 2017
            case 'addGuestUsers':
                $emailArr = $data['guest_emails'];//array('guest100@prospus.com', 'guest200@prospus.com');
                $result   = $this->getApiTable()->addGuestUsers($emailArr);
                break;


            case 'guestsMail':
                //print_r($data['guestsMail']);
                $guestsArr = $data['guestsMail'];
                $mailObj = $this->PUMailer();
                $params = array();
                $params['from'] = ADMIN_CONFIG['email'];
                $params['template'] = 'guest-mail';
                
                if(isset($guestsArr['dialogueId']))
                {
                    $params['courseId']      = trim($guestsArr['courseId']);
                    $params['dialogueId']    = trim($guestsArr['dialogueId']);
                }
                else if(isset($guestsArr['productionId']))
                {
                    $params['courseId']      = trim($guestsArr['courseId']['course_node_id']);
                    $params['productionId']  = trim($guestsArr['productionId']);
                }

                $params['courseTitle']   = $guestsArr['courseTitle'];
                $params['adminName']     = ucwords($guestsArr['adminFirstName'].' '.$guestsArr['adminLastName']);
                $params['adminEmail']    = $guestsArr['adminEmail'];
                $params['subject']       = $params['adminName'].' has Invited You on a Prospus Course';
                $params['toUserList']    = $guestsArr['toUserList'];


                $mailResult = $mailObj->sendGuestMail($params);
                $result   = $mailResult;
                break;


            /**
             * Action to set password, after forgot password
             * Created By: Amit Malakar
             * Date: 11-Sep-2017
             */
            case 'setpassword':
                $params = isset($_REQUEST) ? $_REQUEST : array();
                $userInfo           = $_SESSION[PREFIX . 'user_info'];
                if($userInfo) {
                    // user session exists and forgot password token also
                    // so destroy user's session
                    //unset($_SESSION[PREFIX . 'user_info']);
                    unset($userInfo);

                    // logout with email hash
                    $decryptedUserEmail  = hash('sha256', $_SESSION[PREFIX . 'user_info']['email_address']);
                    $sessObj = new PUSession($decryptedUserEmail);
                    $sessObj->destroy('');

                }
                if (count($params)) {
                    $result          = array();
                    $access_token    = isset($_REQUEST['token']) ? $_REQUEST['token'] : 0;
                    $password        = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';
                    $confirmPassword = isset($_REQUEST['confirm_password']) ? $_REQUEST['confirm_password'] : '';

                    // check if token is valid and not used
                    if ($access_token) {
                        $tokenDataArray = $this->getStructureBuilderTable()->getUserIdThroughToken($access_token);
                        //$tokenDataArray[0]['ur_status'] = 0; //#######

                        if (count($tokenDataArray)) {
                            if ($tokenDataArray[0]['ur_status'] == 0) {
                                $cipherObj                              = new PUCipher();
                                $emailAddress                           = $cipherObj->puDecrypt($access_token);
                                //$userInfo                               = $this->getApiTable()->emailExists($emailAddress, true);
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
                                        $dbAdapter                              = $this->getServiceLocator()->get('Zend\Db\Adapter\Adapter');
                                        $apiObj                                 = new ApiTable($dbAdapter);
                                        $userInfo                               = $apiObj->emailExists($emailAddress, true);
                                        // $userInfo = $this->getClassesTable()->getUserProfile($user_node_id);

                                        // Update Account Class password field
                                        $newPasswordHash       = $cipherObj->puPasswordHash($password);
                                        $ncpIdArray            = array(ACCOUNT_PASSWORD_ID);
                                        $ncpValueArray         = array($newPasswordHash);
                                        $typeId                = 2;
                                        $accountNodeInstanceId = $tokenDataArray[0]['account_node_instance_id'];
                                        $res                   = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $accountNodeInstanceId, $typeId);

                                        // User Auto login - disabled now
                                        /*$res                                 = $apiObj->setUserSession($userInfo);
                                        $result['data']                      = $res['userData'];
                                        $result['header_notification_count'] = $res['notificationCount'];*/
                                        $result['success']                   = 1;
                                        $result['msg']                       = 'success'; // redirect to login
                                        return new JsonModel($result);
                                    } else {
                                        $result['success'] = 0;
                                        $result['msg']     = $pwdRes['msg'];
                                    }

                                } else {
                                    $result['success'] = 0;
                                    $result['msg']     = 'Password and confirm password do not match.';
                                }
                            } else {
                                $result['success'] = 0;
                                $result['msg']     = 'Access Token already used.';
                            }
                        } else {
                            $result['success'] = 0;
                            $result['msg']     = 'Access Token Invalid.';
                        }
                    } else {
                        $result['success'] = 0;
                        $result['msg']     = 'Access Token Invalid.';
                    }
                }
                break;


        }
        return new JsonModel(array('data'=>$result));
    }

    /**
     * Create user registration save data
     * Created By: Amit Malakar
     * Date: 8-Sep-2017
     * @param $hashKey
     * @return array
     */
    public function userRegistrationLink($hashKey)
    {
        return $hashKeyArr = array(
            'propertyId' => array(USER_REG_USERID_PID,USER_REG_HASH_KEY_PID,USER_REG_STATUS_PID,USER_REG_TIMESTAMP_PID),
            'value' => array( USER_REG_USERID_PID=>'',
                              USER_REG_HASH_KEY_PID=>$hashKey,
                              USER_REG_STATUS_PID=>'0',
                              USER_REG_TIMESTAMP_PID=>time()
            ),
        );
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

    public function update($id, $data) {   // Action used for PUT requests
        return new JsonModel(array('data' => array('id' => 3, 'name' => 'Updated Album', 'band' => 'Updated Band')));
    }

    public function delete($id) {   // Action used for DELETE requests
        return new JsonModel(array('data' => 'album id 3 deleted'));
    }

    private function courseListData($instanceArray) {
       // return $instanceArray;
        $clsInstanceData = array();

       foreach ($instanceArray['course_dialogue_data'] as $key => $insValue) {
            $clsInstanceData[$insValue['course_instance_id']]['course_instance_id'] = $insValue['course_instance_id'];
            $clsInstanceData[$insValue['course_instance_id']]['status'] = $insValue['course_status'];
            $clsInstanceData[$insValue['course_instance_id']]['domain'] = 'Prospus';
            $clsInstanceData[$insValue['course_instance_id']]['course_node_id'] = $insValue['course_node_id'];
            $propertyArr = explode("~###~", $insValue['property']);
            $clsInstanceData[$insValue['course_instance_id']]['structure'][] = array('value' => $propertyArr[2], 'data' => $propertyArr[3], 'nodeID' => $propertyArr[0], 'parentID' => $propertyArr[1]);
            }
        //return $instanceArray;
        return array_values($clsInstanceData);
    }

    /**Added by Gaurav
     * Added on 12 june
     * Format statments
     * @param type $statementRes
     * @param type $actor
     * @return array
     */
    public function formatStatements($paramArr = array()) {

       // return $statementRes;
        $statementRes = $paramArr['statementRes'];
        $actor = $paramArr['actor'];
        $toalUnreadCount = $paramArr['totalUnreadCount'];

        $statementArr = array();
        $statementTypeArr = array('Statement', 'image', 'attachment');

        $previousActorId = '';
        $previousDialogueId = '';
        $previousTimestamp = '';

        foreach($statementRes as $val){
                $loginId = $val['actor.author'];
                $date = date('Y-m-d', $val['timestamp']);
                $groupByTime = strtotime(date('Y-m-d H:i', $val['timestamp']));//Group By within one mintues message
                $tempArr = array();
                $tempArr['statement'] = $val['statement'];
                $tempArr['statement_timestamp'] =  $val['timestamp'];
                $tempArr['statement_node_id'] = $val['statement_node_id'];
                $tempArr['node_instance_propertyid'] = $val['node_instance_property_id'];
                $tempArr['statement_type'] = $val['statement_type'];
                $tempArr['updated_status'] = $val['update_status'];
                $tempArr['actor.author'] = $loginId;
                if(in_array($val['statement_type'], $statementTypeArr)){
                    $statementArr[$val['dialogue_node_id']]['chatType'] = 'Chat';
                }else{
                    $statementArr[$val['dialogue_node_id']]['chatType'] = 'Letter';
                }
                $unreadCountTotal = '0';
                $unreadStatementsId = '';
                if((int)count($toalUnreadCount[$val['dialogue_node_id']])>0){
                    $unreadCountTotal = (string)count($toalUnreadCount[$val['dialogue_node_id']]);
                    $unreadStatementsId = implode(",", $toalUnreadCount[$val['dialogue_node_id']]);
                }
                $notificationArr = array('totalUnreadCount'=>$unreadCountTotal, 'unreadChatCount'=>$unreadCountTotal, 'unreadStatements'=>$unreadStatementsId);
                $statementArr[$val['dialogue_node_id']]['notificationItem'] = $notificationArr;

                $prevArr = array(
                            'first_name'=>$actor[$loginId]['first_name'],
                            'last_name'=>$actor[$loginId]['last_name'],
                            'statement_type'=>$val['statement_type'],
                            'date'=>$date,
                            'statement'=>array($tempArr),
                );
                //If previous dialogue is same and timestamp is same
            if ($previousDialogueId == $val['dialogue_node_id'] && $previousTimestamp == $groupByTime && $previousActorId == $loginId) {


                end($statementArr[$val['dialogue_node_id']][$date]);         // move the internal pointer to the end of the array
                $key = key($statementArr[$val['dialogue_node_id']][$date]);
                $statementArr[$val['dialogue_node_id']][$date][$key]['statement'][]= $tempArr;

        //                if ($previousActorId == $loginId) {
        //                    end($statementArr[$val['dialogue_node_id']][$date][$groupByTime]);         // move the internal pointer to the end of the array
        //                    $key = key($statementArr[$val['dialogue_node_id']][$date][$groupByTime]);
        //                    array_push($statementArr[$val['dialogue_node_id']][$date][$groupByTime][$key]['statement'], array($val['statement_node_id'] => $tempArr));
        //                } else {
        //                    $statementArr[$val['dialogue_node_id']][$date][$groupByTime][] = $prevArr;
        //                }
            } else {

                  // $statementArr[$val['dialogue_node_id']][$date][$groupByTime][] = $prevArr;
                     $statementArr[$val['dialogue_node_id']][$date][] = $prevArr;
            }

            $previousDialogueId = $val['dialogue_node_id'];
            $previousActorId = $loginId;
            $previousTimestamp = $groupByTime;
        }

        return $statementArr;
    }

    public function rrmdir($src) {
        $dir = opendir($src);
        while(false !== ($file = readdir($dir)) )
        {
            if (( $file != '.' ) && ( $file != '..' )) {
                $full = $src . '/' . $file;
                if ( is_dir($full) ) {
                    $this->rrmdir($full);
                }
                else {
                    unlink($full);
                }
            }
        }
        closedir($dir);
        rmdir($src);
    }
}
