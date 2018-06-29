<?php

namespace Api\Model;

use Administrator\Model\ClassesTable;
use Administrator\Model\CourseDialogueTable;
use Administrator\Model\StructureBuilderTable;
use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Grid\Model\DashboardTable;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\AbstractTableGateway;

class ApiTable extends AbstractTableGateway {
    public $adapter;
    protected $classTableObj;
    protected $structureTableObj;
    protected $courseClassTableObj;
    protected $dashboardTableObj;
    protected $table                        = 'node';

    public function __construct(Adapter $adapter) {

        $this->adapter = $adapter;
        $this->resultSetPrototype = new ResultSet();
        $this->resultSetPrototype->setArrayObjectPrototype(new Api());
        $this->initialize();
    }

    /**
     * Get object of class
     * @return object of class
     */
    public function getClassesTable() {


        if (!$this->classTableObj) {
            $this->classTableObj = new ClassesTable($this->adapter);
        }
        return $this->classTableObj;
    }

    /**Added by Gaurav
     * Added on 14 June 2017
     * Get object of course dialogoue class
     * @return object of class
     */
    public function getCourseDialoguesTable() {


        if (!$this->courseClassTableObj) {
            $this->courseClassTableObj = new CourseDialogueTable($this->adapter);
        }
        return $this->courseClassTableObj;
    }

    /**
     * Get object of structure
     * @return object of structure
     */
    public function getDashboardTable() 
    {
        if (!$this->dashboardTableObj) {
            $this->dashboardTableObj = new DashboardTable($this->adapter);
        }
        return $this->dashboardTableObj;
    }

    /**
     * Fetch all course
     * @param type $data
     * @return array
     */
    public function fetchCourseApi($data = array()) {
        return $this->getClassesTable()->fetchCoureListData($data, false);//false parameter to request for api
    }

    /**
     * Created By: Amit Malakar
     * Date: 16-May-17
     * Fetch all course dialogue details based on time
     * @param type $data
     * @return array
     */
    public function fetchCourseDialogueTimeApi($data = array()) {
        return $this->getClassesTable()->fetchCourseDialogueTimeApi($data);
    }

    /**
     * Create object of Structure builder class
     * @return object of class
     */
    public function getStructureTable() {
        if (!$this->structureTableObj) {
            $this->structureTableObj = new StructureBuilderTable($this->adapter);
        }
        return $this->structureTableObj;
    }

    /**
     * Function to get Courses
     * @param type $data
     * @return type array
     */
    public function fetchCourseDialogueApi($data = array()) {

        return $this->getClassesTable()->fetchCourseDialogueApi($data);
    }

    /**
     * Function to get class structure and data of instanaces
     * @param type $classId
     * @return type
     */
    public function getClassData($classId) {

        $json = array();
        $clsInstanceData = array();
        if ($classId != '') {

            $display = 'no-pagination';
            $order_by = 'node_instance_id';
            $order = 'DESC';
            $filter_operator = '';
            $search_text = '';
            $filter_field = '';
            //Get all Property Structure of class
            $classPropertyArr = $this->getClassesTable()->getPropertyOfClass($classId);
            //Get class Name
            $className = $this->getClassesTable()->getClassNameByClassId($classId)['class_name'];
            //Get instance data
            $instanceArray = $this->getClassesTable()->getInstanceListByPagination($order, $order_by, $display, $classId, $filter_operator, $search_text, $filter_field);
            $incrementFlag = 0;
            foreach ($instanceArray as $key => $insValue) {
                $nodeInstanceId = $insValue['node_instance_id'];
                $clsInstanceData[$incrementFlag] = $this->getClassesTable()->getInstanceValueByWebService($nodeInstanceId, $classId, $classPropertyArr);
                $clsInstanceData[$incrementFlag]['classID'] = trim($post['class_id']);
                $clsInstanceData[$incrementFlag]['class'] = $className;
                $incrementFlag++;
            }
        }
        // return class data
        return $clsInstanceData;
    }

    /**Get User list
     * Modified by Gaurav
     * Date 8 june 2017
     * Get all user list
     * @return type array of user list
     */
    public function getUserList($data = array()) {

        $userArr = $this->getStructureTable()->fetchAllUsersDetails($data);
        //        $userArr1 = array_column($userArr, 'node_id');
        //        $userArr2 = array_combine($userArr1, $userArr);
        //        $userArr3['users'] = json_decode(json_encode($userArr2,JSON_FORCE_OBJECT));
        return $userArr;
    }

    /**Get User list
     * Modified by Gaurav
     * Date 9 june 2017
     * Get all user list
     * @return type array of user list
     */
    public function getUserListNew($data = array()) {

        $userArr = $this->getStructureTable()->fetchAllUsersDetails($data);
        $userArr1 = array_column($userArr, 'node_id');
        $userArr2 = array_combine($userArr1, $userArr);
        $userArr3['users'] = json_decode(json_encode($userArr2,JSON_FORCE_OBJECT));
        return $userArr3;
    }

    /**
     * Check if email id exists in Individual's Account class
     * Created By: Amit Malakar
     * Date: 07-Sep-17
     * @param $data - account_class_id, email_address_property_id, email_address
     * @return array
     */
    public function emailExists($emailAddress, $allInfo = false)
    {
        $sql    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value', 'node_class_property_id'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id', array(), 'left');
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array('node_id'), 'left');
        $select->where->equalTo('nip2.node_class_property_id', INDIVIDUAL_EMAIL_ID);
        $select->where->AND->equalTo('nip2.value', $emailAddress);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result    = $statement->execute();
        $resultObj = new ResultSet();
        $result    = $resultObj->initialize($result)->toArray();
        $accountInfo = array();
        foreach($result as $key => $value) {
            if($value['node_class_property_id'] == INDIVIDUAL_EMAIL_ID) {
                $accountInfo[INDIVIDUAL_EMAIL_ID] = $value['value'];
            } elseif($value['node_class_property_id'] == ACCOUNT_PASSWORD_ID) {
                $accountInfo[ACCOUNT_PASSWORD_ID] = $value['value'];
            } elseif($value['node_class_property_id'] = ACCOUNT_STATUS_ID) {
                $accountInfo[ACCOUNT_STATUS_ID] = $value['value'];
            } 
            if(!isset($accountInfo['node_id'])) {
                $accountInfo['node_id'] = $value['node_id'];
            }
        }
        /*$key = array_search(ACCOUNT_STATUS_ID, array_column($result, 'node_class_property_id'));
        if($key) {
            $accountInfo[ACCOUNT_STATUS_ID] = $result[$key]['value'];
        } else {
            $accountInfo[ACCOUNT_STATUS_ID] = '';
        }*/
        if (isset($accountInfo[INDIVIDUAL_EMAIL_ID])) {
            if ($allInfo && $accountInfo['node_id']) {
                // User's all other info required
                $sql2    = new Sql($this->adapter);
                $select2 = $sql2->select();
                $select2->from(array('nip' => 'node-instance-property'));
                $select2->columns(array('node_class_property_id', 'value'));
                $select2->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array('node_id'), 'left');
                $select2->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array(), 'left');
                $select2->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
                $select2->where->AND->equalTo('xy.node_x_id', $accountInfo['node_id']);
                //$select2->where->AND->equalTo('nip.value', $data['email_address']);
                $statement  = $sql->prepareStatementForSqlObject($select2);
                $result2    = $statement->execute();
                $resultObj2 = new ResultSet();
                $result2    = $resultObj2->initialize($result2)->toArray();
                $userInfo   = array();
                foreach ($result2 as $key => $value) {
                    if ($value['node_class_property_id'] == INDIVIDUAL_FIRST_NAME) {
                        $userInfo['first_name'] = $value['value'];
                    } elseif ($value['node_class_property_id'] == INDIVIDUAL_LAST_NAME) {
                        $userInfo['last_name'] = $value['value'];
                    }elseif ($value['node_class_property_id'] == INDIVIDUAL_PROFILE_IMAGE) {
                        $userInfo['profile_image'] = $value['value'];
                    }
                    $userInfo['node_id'] = $value['node_id'];
                }
                $userInfo['email_address']  = $accountInfo[INDIVIDUAL_EMAIL_ID];
                $userInfo['first_name']     = isset($userInfo['first_name']) ? $userInfo['first_name'] : '';
                $userInfo['last_name']      = isset($userInfo['last_name']) ? $userInfo['last_name'] : '';
                $userInfo['password']       = isset($accountInfo[ACCOUNT_PASSWORD_ID]) ? $accountInfo[ACCOUNT_PASSWORD_ID] : '';
                $userInfo['account_status'] = isset($accountInfo[ACCOUNT_STATUS_ID]) ? $accountInfo[ACCOUNT_STATUS_ID] : '';
                
                return $userInfo;
            } else {
                // User's only email is required
                return array('email_address' => $accountInfo[INDIVIDUAL_EMAIL_ID]);
            }
        }
        return 0;
    }

    /**
     * Check user is valid or not.
     * @param type $post
     * @return array with authenticate user
     *
     * Modified By: Divya Rajput
     * Date: 12 june 2017
     * Purpose: Same Parameter passed as web so that, same login function can be called for web and app
    */
    public function validateUser($post = array()) {

        $requestData = array();
        $requestData['data']['emailaddress'] = $post['emailaddress'];
        $requestData['data']['password'] = $post['password'];

        $search     = $post['emailaddress'];
        $platform   = (isset($post['platform']) && strtolower($post['platform']) === 'ios') ? strtolower($post['platform']) : '';

        $returnResponse = $this->getStructureTable()->loginUser($post);
        //$returnResponse = $this->getStructureTable()->apiLoginUser($requestData['data']);
        $returnArray['data'] = $userData = $returnResponse;
        if($platform === 'ios'){
            //for login from IOS
            //If user is valid
            if (count($returnArray['data']) > 0) {
                $roleDD = array();
                $roleDD['Prospus'][] = 'Guest';
                $cRoleDD = '';
                $current_role = '';
                $_RoleName = '';
                if (count($returnArray['data']['rolesArray']) > 0) {
                    $current_role = current($returnArray['data']['rolesArray'])['id'];
                    //Getting role array
                    foreach ($returnArray['data']['rolesArray'] as $roleId => $roleName) {
                        if (trim($returnArray['data']['domain']) == 'www.marinemax.com') {
                            $_RoleName = 'MarineMax';
                        }
                        /*if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '') {

                        } else {
                            $cRoleDD = $roleName['name'];
                        }*/
                        $roleDD[$_RoleName][] = $roleName['name'];
                    }
                }
                //$returnArray['data']['current_role'] = $current_role;
                unset($returnArray['data']['rolesArray']);

                //User is valid
                $individualInstId = $returnArray['data']['instance_id'];
                $deviceToken  = $post['devicetoken'];// = '10002';
                //Insert/Update device token
                $tokenRes = $this->getStructureTable()->updateDeviceTokenVal($individualInstId, $deviceToken);
                $json['roles'] = $roleDD;
                //$json['crole'] = $cRoleDD;
                $json['user'] = $returnArray['data'];
                $json['result'] = 1;
                $json['token_status'] = $tokenRes;
                $json['msg'] = 'User Logged In Sucessfully';
                $json['code'] = '200';
            } else {

                //Invaild login credentials
                $json['data'] = '';
                $json['result'] = 0;
                $json['msg'] = 'Email address or password are invalid.';
                $json['code'] = '200';
            }
        }else{
            $json['start request'] = date('l jS \of F Y h:i:s A');
            if ($_SESSION[PREFIX . 'uniqueId1'] == "")
                $_SESSION[PREFIX . 'uniqueId1'] = $_COOKIE['PHPSESSID']; //md5(time());

            if (count($returnResponse) > 0) {
                if(1) {
                    // login via file system
                    // delete logged in user in same tab, if any
                    if(isset($post['logged_in_user']) && $post['logged_in_user'] != '' && ($post['forceUser'] == 'Y' || $post['forceUser'] == 'true')) {
                        $deleteFile = ABSO_URL."puidata/temp_session/sess_".hash('sha256', $post['logged_in_user']);
                        unset($_SESSION[PREFIX . 'user_info']);
                        unset($_SESSION[PREFIX . 'session_file']);
                        unset($_SESSION[PREFIX . 'uniqueId1']);
                        unlink($deleteFile);
                    }

                    $fileName  = hash('sha256', $post['emailaddress']);
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
                                $json['result'] = '2';
                                $json['msg'] = 'User already logged in';
                                $json['email_address'] = $search;
                                print json_encode($json);
                                exit;
                            } else if (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] == strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                // Same user on same browser on different tab
                                $json['data'] = $userData;
                                $json['result'] = '0';
                                $json['msg'] = 'success';
                                print json_encode($json);
                                exit;
                            } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                // Different user on same browser on different tab
                                $json['data'] = $userData;
                                $json['result'] = '3';
                                $json['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                $json['session'] = '';
                                $json['logged_in_user'] = $_SESSION[PREFIX . 'user_info']['email_address'];
                                print json_encode($json);
                                exit;
                            } else {
                                unlink(ABSO_URL."puidata/temp_session/sess_" . $fileName);
                            }
                        } else {
                            // Without Logout User close their tab and After some days Again Login
                            unlink(ABSO_URL."puidata/temp_session/sess_" . $fileName);
                        }
                    } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                        // Different user on same browser on different tab
                        $json['data'] = $userData;
                        $json['result'] = '3';
                        $json['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                        $json['session'] = '';
                        $json['logged_in_user'] = $_SESSION[PREFIX . 'user_info']['email_address'];
                        print json_encode($json);
                        exit;
                    }

                    //create another file session file in temp_seesion folder
                    $handle       = fopen($file_path, "w+");
                    $userData['php_sess_id'] = $_COOKIE['PHPSESSID'];
                    fwrite($handle, json_encode($userData));
                    $session_file = $post['emailaddress'];
                    fclose($handle);
                } else {
                    // login via AWS
                    /*
                    * Modified By Divya Rajput
                    * Date: 23-March-2017
                    * Purpose: Add a parameter in file to check user's last activity
                    * @Param: active_time
                    */
                    $userData['active_time'] = strtotime(date('Y-m-d H:i:s'));
                    /* End Here */
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
                                /*
                                 * Modified By: Divya Rajput
                                 * On Date: 6-April-2017
                                 * Purpose: TO check user login session on same browser and on same tab
                                 */
                                $result = json_decode($result['data'], true);
                                if (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] == strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                    // Same user on same browser on different tab
                                    $json['data'] = $userData;
                                    $json['result'] = '0';
                                    $json['msg'] = 'success';
                                    print json_encode($json);
                                    exit;
                                } elseif (isset($_SESSION[PREFIX . 'user_info']) && $_SESSION[PREFIX . 'user_info']['email_address'] != strtolower($post['emailaddress']) && $post['forceUser'] == "N") {
                                    // Different user on same browser on different tab
                                    $json['data'] = $userData;
                                    $json['result'] = '3';
                                    $json['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                    $json['session'] = '';
                                    print json_encode($json);
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
                                $json['data'] = $userData;
                                $json['result'] = '3';
                                $json['msg'] = " " . $_SESSION[PREFIX . 'user_info']['email_address'] . " is already logged-in in this browser. Please confirm if you want to terminate that user's session and login as " . $post['emailaddress'] . "?";
                                $json['session'] = '';
                                print json_encode($json);
                                exit;
                            }
                        }
                    }
                    //create another file session file in temp_seesion folder
                    $this->open();
                    $session_file = $this->write($_SESSION[PREFIX . 'uniqueId1'], json_encode($userData));
                }

                $json['data'] = $userData;
                $json['result'] = '0';
                $json['msg'] = 'success';
                //$json['session']    =  $_SESSION[PREFIX.'uniqueId'];

                $_SESSION[PREFIX . 'user_info'] = $userData;
                $_SESSION[PREFIX . 'session_file'] = $session_file;
            } else {
                $json['data'] = '';
                $json['result'] = '1';
                $json['msg'] = 'Email address or password are invalid.';
                $json['session'] = '';
            }

            $json['end request'] = date('l jS \of F Y h:i:s A');
            header('Content-Type: application/json');
            print json_encode($json);
            exit;
        }
        return $json;
    }

    /**
     * Function to check internet connection
     * @return string
     */
    public function verifyNetConnection() {

        $result = 0;
        $connected = 'failed';
        $response = $this->getStructureTable()->isNetConnect();
        if (intval($response) == 1) {
            $connected = 'success';
            $result = 1;
        }
        $res = array();
        $res['result'] = $result;
        $res['status'] = $connected;
        return $res;
    }

    /**
     * Insert or update instance in pu db which send by course builder
     * @param array $courseData
     * @return course_instnace_node_id
     */
    public function insertAndUpdateProductionInstance($courseData,$status)
    {
        // For create production instance
        $returnProductionArray                          = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_CB_CLASS_ID, $status);
        if(intval($returnProductionArray['node_instance_id']) > 0)
        {
            $productionPropertyIdArray                  = array(PRODUCTION_CB_TITLE_PID,PRODUCTION_CB_TYPE_PID,PRODUCTION_CB_DESC_PID,PRODUCTION_CB_PERIODS_PID,PRODUCTION_CB_COL_PID,PRODUCTION_CB_CELL_PID);
            $productionPropertyValueArray               = array($courseData['title'],$courseData['type'],'course_builder',$courseData['periods'],$courseData['columns'],$courseData['cells']);
            $this->getStructureTable()->createInstanceProperty($productionPropertyIdArray, $productionPropertyValueArray, $returnProductionArray['node_instance_id'], $returnProductionArray['node_type_id'],'N',array(),"");
        }

        // For create instances of series class
        $seriesNodeIdsArray                             = array();
        if(array_key_exists("series",$courseData) && count($courseData['series']))
        {
            foreach($courseData['series'] as $index => $seriesArray)
            {
                $returnSeriesArray                     = $this->getStructureTable()->createInstanceOfClass(SERIES_CB_CLASS_ID, '1');
                if(intval($returnSeriesArray['node_instance_id']) > 0)
                {

                    $seriesPropertyIdArray             = array(SERIES_CB_TITLE_PID,SERIES_CB_TYPE_PID,SERIES_CB_SEQUENCE_PID,SERIES_CB_ACTIVE_PID,SERIES_CB_COMPLETE_PID,SERIES_CB_HEADER_PID,SERIES_CB_DATA_PID,SERIES_CB_ROLE_PID,SERIES_CB_VARNAME_PID,SERIES_CB_VARVALUE_PID,SERIES_CB_VARHIDDEN_PID);
                    $seriesPropertyValueArray          = array($seriesArray['title'],$seriesArray['type'],$seriesArray['columnSequence'],0,0,$seriesArray['headerClass'],$seriesArray['dataClass'],$seriesArray['roleID'],$seriesArray['varName'],$seriesArray['varValue'],$seriesArray['varHidden']);

                    $this->getStructureTable()->createInstanceProperty($seriesPropertyIdArray, $seriesPropertyValueArray, $returnSeriesArray['node_instance_id'], $returnSeriesArray['node_type_id'],'N',array(),"");
                    $seriesNodeIdsArray[]                  = $returnSeriesArray['node_id'];

                    // For create instances of segment class
                    $segmentsNodeIdsArray                  = array();
                    if(array_key_exists("segments",$seriesArray) && count($seriesArray['segments']))
                    {
                        foreach($seriesArray['segments'] as $key => $segmentsArray)
                        {
                            $returnSegmentsArray                    = $this->getStructureTable()->createInstanceOfClass(SEGMENT_CB_CLASS_ID, '1');
                            if(intval($returnSegmentsArray['node_instance_id']) > 0)
                            {
                                $segmentsPropertyIdArray              = array(SEGMENT_CB_TITLE_PID,SEGMENT_CB_START_PID,SEGMENT_CB_END_PID,SEGMENT_CB_ACTIVE_PID,SEGMENT_CB_COMPLETE_PID,SEGMENT_CB_SCLASS_PID,SEGMENT_CB_ECLASS_PID);
                                $segmentsPropertyValueArray           = array($segmentsArray['title'],$segmentsArray['segmentStart'],$segmentsArray['segmentEnd'],0,0,$segmentsArray['segmentStartClass'],$segmentsArray['segmentEndClass']);

                                $this->getStructureTable()->createInstanceProperty($segmentsPropertyIdArray, $segmentsPropertyValueArray, $returnSegmentsArray['node_instance_id'], $returnSegmentsArray['node_type_id'],'N',array(),"");
                                $segmentsNodeIdsArray[]                   = $returnSegmentsArray['node_id'];
                            }
                        }
                    }

                    // For create relation between series and segment instance
                    if(intval($returnSeriesArray['node_id']) > 0 && count($segmentsNodeIdsArray) > 0)
                    {
                        $this->getStructureTable()->createRelation($returnSeriesArray['node_id'], $segmentsNodeIdsArray);
                    }
                }
            }
        }

        // For create relation between production and series instance
        if(intval($returnProductionArray['node_id']) > 0 && count($seriesNodeIdsArray) > 0)
        {
            $this->getStructureTable()->createRelation($returnProductionArray['node_id'], $seriesNodeIdsArray);
        }

        return $returnProductionArray['node_id'];
    }

    /**
     * Fetch all "PRODUCTION" class instance where description =  'course_builder'
     * @param null
     * @return instanceArray
     */
    public function fetchAllCoursesOfCourseBuilder()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','status'
                        , 'title' => new Expression("(select value from `node-instance-property` where `node-instance-property`.node_instance_id = ni.node_instance_id AND `node-instance-property`.node_class_property_id = ".PRODUCTION_CB_TITLE_PID.")")));
        $select->where->equalTo('ni.node_class_id', PRODUCTION_CB_CLASS_ID);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $instanceArray = array();
        foreach($tempArr as $key => $value)
        {
            $instanceArray[$value['node_id']]['title'] = $value['title'];
            $instanceArray[$value['node_id']]['status'] = $value['status'];
        }
        return $instanceArray;
    }

    /**
     * Fetch perticuler "PRODUCTION" class instance with "series and segments" subclasses instances
     * @param instance_node_id $instanceNodeId
     * @return instanceArray
     */
    public function fetchPerticulerCourseBuilder($instanceNodeId)
    {
        $productionTempArray                                        = $this->fetchInstanceWithProperty($instanceNodeId);
        $productionInstanceNodeId                                   = $productionTempArray[0]['node_id'];
        $productionArray                                            = array();
        foreach($productionTempArray as $key1 => $value1)
        {
            if(strtolower($value1['caption']) == 'production type')
                $value1['caption']                                  = 'type';

            $productionArray[strtolower($value1['caption'])]        = html_entity_decode($value1['value']);
        }

        $seriesInstancesNodeIds                                     = $this->getClassesTable()->getNodeXIdFromXYTable($productionInstanceNodeId);
        $seriesArray                                                = array();
        foreach($seriesInstancesNodeIds as $key2 => $seriesNodeId)
        {
            $seriesTempArray                                        = $this->fetchInstanceWithProperty($seriesNodeId);
            $seriesInstanceNodeId                                   = $seriesTempArray[0]['node_id'];
            if(SERIES_CB_CLASS_ID == $seriesTempArray[0]['node_class_id'])
            {
                $tempArray                                              = array();
                foreach($seriesTempArray as $key3 => $value3)
                {
                    if(strtolower($value3['caption']) != 'active' && strtolower($value3['caption']) != 'complete')
                    {
                        if(strtolower($value3['caption']) == 'column sequence')
                        $tempArray['columnSequence']                    = $value3['value'];
                        else if(strtolower($value3['caption']) == 'header class')
                        $tempArray['headerClass']                       = $value3['value'];
                        else if(strtolower($value3['caption']) == 'data class')
                        $tempArray['dataClass']                         = $value3['value'];
                        else if(strtolower($value3['caption']) == 'role')
                        $tempArray['roleID']                            = $value3['value'];
                        else if(strtolower($value3['caption']) == 'var name')
                        $tempArray['varName']                           = $value3['value'];
                        else if(strtolower($value3['caption']) == 'var value')
                        $tempArray['varValue']                            = $value3['value'];
                        else if(strtolower($value3['caption']) == 'var hidden')
                        $tempArray['varHidden']                            = $value3['value'];
                        else
                        $tempArray[strtolower($value3['caption'])]      = $value3['value'];
                    }
                }

                if(trim($tempArray['varName']) != '' && !isset($tempArray['varValue']))
                {
                    $tempArray['varValue'] = '';
                }

                if (!array_key_exists("title",$tempArray))
                {
                    $tempArray['title']                                 = '';
                }

                $segmentsInstancesNodeIds                               = $this->getClassesTable()->getNodeXIdFromXYTable($seriesInstanceNodeId);
                foreach($segmentsInstancesNodeIds as $key4 => $segmentNodeId)
                {
                    $segmentTempArray                                   = $this->fetchInstanceWithProperty($segmentNodeId);
                    $tempNewArray                                       = array();
                    foreach($segmentTempArray as $key5 => $value4)
                    {
                        if(strtolower($value4['caption']) != 'active' && strtolower($value4['caption']) != 'complete')
                        {
                            if(strtolower($value4['caption']) == 'start')
                            $tempNewArray['segmentStart']               = $value4['value'];
                            else if(strtolower($value4['caption']) == 'end')
                            $tempNewArray['segmentEnd']                 = $value4['value'];
                            else if(strtolower($value4['caption']) == 'segment start class')
                            $tempNewArray['segmentStartClass']          = $value4['value'];
                            else if(strtolower($value4['caption']) == 'segment end class')
                            $tempNewArray['segmentEndClass']            = $value4['value'];
                            else
                            $tempNewArray[strtolower($value4['caption'])]    = $value4['value'];
                        }

                    }
                    $tempArray['segments'][]                            = $tempNewArray;
                }
                if(count($tempArray['segments']) == 0)
                    $tempArray['segments'] = array();

                $seriesArray[]                                          = $tempArray;
            }
        }
        $productionArray['series']                                  = $seriesArray;

        return array('production_cb' => $productionArray, 'production_json' => $this->getProductionJSON($instanceNodeId));
    }

    /**
     * Fetch perticuler "PRODUCTION JSON" class instance
     * @param instance_node_id $instanceNodeId
     * @return instanceArray
     */
    public function getProductionJSON($instanceNodeId)
    {
        //$class_node_id                          = $this->getClassNodeIdFromProduction($instanceNodeId);
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value'), 'INNER');
        $select->where->equalTo('ni.node_class_id', PRODUCTION_JSON_CLASS_ID);
        $select->where->AND->equalTo('nxyr.node_y_id', $instanceNodeId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        return $this->checkCustomHtml($tempArray[0]['value']);
    }

    public function checkCustomHtml($pro_json)
    {
        if(strpos('customHTML', $pro_json))
        {
            // added preg replace to replace ', ", /n, /r with necessary escape chars
            $string = $tempArray[0]['value'];
            $string = preg_replace("/[\"]+/", "\\\"", $string);
            $string = preg_replace("/[']+/", "\\'", $string);
            $string = preg_replace("/[\n]+/", "\\n", $string);
            $string = preg_replace("/[\r]+/", "\\r", $string);
            $decodedString = html_entity_decode($string);
            $json = json_decode($decodedString, true);
            // stripslashes used as on insertion we used addslashes, need it for ' (single quote)
            foreach($json as $key => $value) {
                if(isset($json[$key]['customHTML'])) {
                    $json[$key]['customHTML'] = stripslashes($json[$key]['customHTML']);
                }
            }

            return $json;
        }
        else
        {
            return json_decode(html_entity_decode($pro_json),true);
        }
    }

    /**
     * Fetch perticuler instance with property
     * @param instance_node_id $instanceNodeId
     * @return tempArray
     */
    public function fetchInstanceWithProperty($instanceNodeId)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id','node_class_id','node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value','node_class_property_id'), '');
        $select->join(array('ncp' => 'node-class-property'), 'nip.node_class_property_id = ncp.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_id', $instanceNodeId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        return $tempArray;
    }

    /**
     * Function to empty device token value
     * @param type $data
     * @return type
     */
    public function logoutUser($data = array()) {
        $data['node_id'] = $data['userNodeId'];//1628368;
        $res = array();
        $res['status'] = '1';
        $res['message'] = 'Device token has been updated.';
        $individualInstanceId = $this->getStructureTable()->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($data['node_id']))['node_instance_id'];
        if($individualInstanceId>0){
            $tokenRes = $this->getStructureTable()->updateDeviceTokenVal($individualInstanceId, '');
        }else{
            $res['status'] = '0';
            $res['meessage'] = 'Something went wrong. Device token does not exists.';
        }
        $res['node_instance_id'] = $individualInstanceId;

        return $res;
    }

    /**
     * Fetch all class with node type = y like node_type_id = 2
     * @param null
     * @return classArray
     */
    public function getAllClassList()
    {
        $data['type'] = 2;
        return $this->getStructureTable()->getAllClassList($data);
    }

    /**
     * Fetch all class with node type = y like node_type_id = 2
     * @param classId $classId
     * @return classPropertyArray
     */
    public function fetchClassPropertiesFromClass($classId)
    {
        return $this->getClassesTable()->getWebServicesClassStructure($classId);
    }

    /**
     * Fetch all instances from class ROLE_CB
     * @param group name
     * @return rolesArray
     */
    public function getRoleList($group)
    {
        $tempArray = $this->getStructureTable()->getInstanceListOfParticulerClass(ROLE_CB_CLASS_ID,'class','node_id');
        $rolesArray = array();
        foreach($tempArray as $roleId => $roles)
        {
            $cacheArray = array();
            if(trim($group) != '')
            {
                if(strtolower($group) == strtolower($roles['Group']))
                {
                    $cacheArray['role_id'] = $roleId;
                    $cacheArray['role'] = $roles['Role'];
                }
            }
            else
            {
                $cacheArray['role_id'] = $roleId;
                $cacheArray['role'] = $roles['Role'];
            }

            if(is_array($cacheArray) && !empty($cacheArray))
            $rolesArray[] = $cacheArray;
        }

        return $rolesArray;
    }

    /**
     * Create ROLE_CB class instance
     * @param role name
     * @return role_id and role
     */
    public function insertRoleInstance($role)
    {
        if(trim($role) != '')
        {
            $returnCourseArray                              = $this->getStructureTable()->createInstanceOfClass(ROLE_CB_CLASS_ID, '1');
            if(intval($returnCourseArray['node_instance_id']) > 0)
            {
                $rolePropertyIdArray                      = array(ROLE_CB_ROLE_PID);
                $rolePropertyValueArray                   = array($role);
                $this->getStructureTable()->createInstanceProperty($rolePropertyIdArray, $rolePropertyValueArray, $returnCourseArray['node_instance_id'], $returnCourseArray['node_type_id'],'N',array(),"");
            }
            return array('role_id' => $returnCourseArray['node_id'], 'role' => $role);
        }
    }

    /**
     * Function to get all statements of dialogue
     * params dialogue instance node id
     */
    function getDialogueStatements($data = array()) {
        //$data['timestamp']           = 1493027787;
        $loggedInUser = '';
        $statementsArray = $this->getStructureTable()->getAllStatement($data['dialogueNodeId'], $data['timestamp'], $loggedInUser);
        $statementsArray = array_map(function($tag) {

        return array(
            'dialogue_node_id' => $tag['dialogue_node_id'],
            'statement_node_id' => $tag['statement_node_id'],
            'statement_node_ins_prop_id' => $tag['statement_node_ins_prop_id'],
            'user_current_session_id' => $tag['actor.author'],
            'first_name' => $tag['first_name'],
            'last_name' => $tag['last_name'],
            'statement_type' => $tag['statement_type'],
            'statement' => $tag['statement'],
            'timestamp_seconds' => $tag['timestamp'],
            'updated_status' => $tag['updated_status']
        ); }, $statementsArray);

        return $statementsArray;
    }

    /**
     * Get All statements
     * @param type $data
     * @return type
     * Added by:- Gaurav
     * Added on:- 8
     */
    function getDialogueAllStatements($data = array()) {

        return $statementsArray = $this->getClassesTable()->fetchAllStatements($data);
    }

    /**
     * For creat class structure with nodez instances when class builder send all operation data
     * @param $data posted array of all fields
     * @return class id, production id
     */
    public function createClassFromCourseBuilder($data)
    {
        $courseData                     = json_decode($data['courseData'],true);
        $permissionData                 = json_decode($data['permissions'],true);
        // stripslashes will be used while fetching, need it for ' (single quote)
        foreach($permissionData as $key => $value) {
            if(isset($permissionData[$key]['customHTML'])) {
                $permissionData[$key]['customHTML'] = addslashes($permissionData[$key]['customHTML']);
            }
        }

        //return array('courseID'=> $data['courseID'],'isCourseDataChange'=> $data['isCourseDataChange'], 'courseData' => $courseData, 'permissionData' => $permissionData);

        $productionCB                   = '';
        $productionJSON                 = '';

        if(trim($data['courseID']) == 'new')
        {
            /* For Course Builder courseData saving in production_cb node x class*/
            $productionCB                           = $this->insertAndUpdateProductionInstance($courseData,$data['status']);

            /* For Production Json */
            foreach($permissionData as $key => $value)
            {
                $permissionData[$key]['isActionChange']             = 'false';
                $permissionData[$key]['isOperationNameChange']      = 'false';
                $permissionData[$key]['isNodesChange']              = 'false';
                $permissionData[$key]['isClassChange']              = 'false';
            }

            $returnJsonArray                        = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_JSON_CLASS_ID, '1');
            if(intval($returnJsonArray['node_instance_id']) > 0)
            {
                $variables      = array();
                $index          = 0;
                foreach($courseData['series'] as $key => $value)
                {
                    if($value['type'] == 'variable')
                    {
                        $variables[$index][$value['varName']] = $value['varValue'];
                        if($value['varHidden'] == 'false')
                        $variables[$index]['hidden'] = '';
                        else
                        $variables[$index]['hidden'] = 1;

                        $index++;
                    }
                }

                foreach($permissionData as $k => $v)
                {
                    $permissionData[$k]['variables'] = $variables;
                }

                $propertyIdArray                    = array(PRODUCTION_JSON_PID);
                $propertyValueArray                 = array(json_encode($permissionData));
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnJsonArray['node_instance_id'], $returnJsonArray['node_type_id'],'N',array(),"");
            }
            $productionJSON                         = $returnJsonArray['node_id'];

            // For create relation between production cb and production json instance
            if(intval($productionCB) > 0 && intval($productionJSON) > 0)
            {
                $this->getStructureTable()->createRelation($productionCB, array($productionJSON));
            }
        }
        else
        {
            $productionCB                           = $data['courseID'];
            $this->removeProductionCB($data['courseID']);
            $this->updateProductionCB($data['courseID'],$data['status'],$data['icon'],$data['price'],$data['publisher'],$data['description'],$data['highlights'],$data['workflow'],$courseData);

            /* For Production Json */
            foreach($permissionData as $key => $value)
            {
                $permissionData[$key]['isActionChange']             = 'false';
                $permissionData[$key]['isOperationNameChange']      = 'false';
                $permissionData[$key]['isNodesChange']              = 'false';
                $permissionData[$key]['isClassChange']              = 'false';
            }

            $node_instance_id                       = $this->getProductionJSONInstanceId($data['courseID']);
            if(intval($node_instance_id) > 0)
            {
                $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $node_instance_id, 'equalto');

                $variables      = array();
                $index          = 0;
                foreach($courseData['series'] as $key => $value)
                {
                    if($value['type'] == 'variable')
                    {
                        $variables[$index][$value['varName']] = $value['varValue'];
                        if($value['varHidden'] == 'false')
                        $variables[$index]['hidden'] = '';
                        else
                        $variables[$index]['hidden'] = 1;

                        $index++;
                    }
                }

                foreach($permissionData as $k => $v)
                {
                    $permissionData[$k]['variables'] = $variables;
                }

                $propertyIdArray                    = array(PRODUCTION_JSON_PID);
                $propertyValueArray                 = array(json_encode($permissionData));
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $node_instance_id, '1','N',array(),"");
            }
            $productionJSON                         = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id);
        }
        return array('productionCB' => $productionCB,'productionJSON' => $productionJSON,'permissionData' => $permissionData);
    }

    /**
     * Fetch perticuler "PRODUCTION JSON" class instance
     * @param instance_node_id $instanceNodeId
     * @return node_instance_id
     */
    public function getProductionJSONInstanceId($instanceNodeId)
    {
        /*$class_node_id                          = $this->getClassNodeIdFromProduction($instanceNodeId);
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->where->equalTo('ni.node_class_id', PRODUCTION_JSON_CLASS_ID);
        $select->where->AND->equalTo('nxyr.node_y_id', $class_node_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        return $tempArray[0]['node_instance_id'];*/

        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->where->equalTo('ni.node_class_id', PRODUCTION_JSON_CLASS_ID);
        $select->where->AND->equalTo('nxyr.node_y_id', $instanceNodeId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        return $tempArray[0]['node_instance_id'];
    }

    /**
     * For get classes properties from class id
     * @param $class_id
     * @return returnProp
     */
    public function getProperties($class_id)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-class-property'));
        $select->columns(array('node_id','caption','node_id',
        'parent_id' => new Expression("(select node_id from `node-class-property` where `node-class-property`.node_class_property_id = ni.node_class_property_parent_id)")
        ));
        $select->where->equalTo('ni.node_class_id', $class_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        $propParentId                           = $tempArray[0]['node_id'];
        $mainPropArray                          = array();
        $subPropArray                           = array();
        foreach($tempArray as $key => $value)
        {
            if(intval($key) != 0)
            {
                if($value['parent_id'] == $propParentId)
                {
                    $mainPropArray[$value['caption']]   = $value['node_id'];
                }
                else
                {
                    $subPropArray[$value['parent_id']][] = $value;
                }
            }
        }
        $returnProp                             = array();
        $returnProp                             = $this->getPropWithHirerchy($mainPropArray,$subPropArray,$returnProp);
        return $returnProp;
    }

    /**
     * For get classes all properties with hirerchy
     * @param $menu1, $menu2, $menuArray
     * @return menuArray
     */
    public function getPropWithHirerchy($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            if(is_array($value))
            {
                $menuArray[$key] = $value;
                $childArray = array();
                if (is_array($menu2[$value['node_id']])) {
                    $menuArray[$key]['nodes'] = $this->getPropWithHirerchy($menu2[$value['node_id']], $menu2, $childArray);
                }
            }
            else
            {
                $menuArray[$key]['node_id'] = $value;
                $childArray = array();
                if (is_array($menu2[$value])) {
                    $menuArray[$key]['nodes'] = $this->getPropWithHirerchy($menu2[$value], $menu2, $childArray);
                }
            }
        }
        return $menuArray;
    }

    /**
     * For update array value
     * @param $permissionData,$returnProp
     * @return permissionData
     */
    public function updatePermissionArray($permissionData,$returnProp)
    {
        foreach($permissionData as $key => $value)
        {
            if($permissionData[$key]['value']  == $returnProp[$key]['caption'])
            {
                if($returnProp[$key]['node_id'] != '')
                $permissionData[$key]['nodeID']     = $returnProp[$key]['node_id'];
                if($returnProp[$key]['parent_id'] != '')
                $permissionData[$key]['parentID']   = $returnProp[$key]['parent_id'];

                if(is_array($permissionData[$key]['nodes']))
                {
                    $permissionData[$key]['nodes']      = $this->updatePermissionArray($permissionData[$key]['nodes'],$returnProp[$key]['nodes']);
                }
            }
        }

        return $permissionData;
    }

    /**
     * For create class and nodez and nodex instances from course builder production json data
     * @param $common_name, $node_type_id, $saveType, $version_type, $node_y_class_id
     * @return node_y_class_id
     */
    public function createCBClass($common_name, $node_type_id, $saveType, $version_type, $node_y_class_id = "") {
        $data['caption']                = $common_name;
        $data['encrypt_status']         = ENCRYPTION_STATUS;
        $data['node_type_id']           = $node_type_id;
        $data['type']                   = $version_type;

        if ($saveType == 'D') {
            $data['status']             = 0;
        } else {
            $data['status']             = 1;
            $data['created']            = date("Y-m-d H:i:s");
        }

        $sql                            = new Sql($this->adapter);

        if (!empty($node_y_class_id)) {
            $query                      = $sql->update();
            $query->table('node-class');
            $query->set($data);
            $query->where(array('node_class_id' => $node_y_class_id));
        } else {
            $data['node_id']            = $this->getClassesTable()->createNode();
            $data['sequence']           = $this->getClassesTable()->getLastNumber('node-class', 'sequence');
            $query                      = $sql->insert('node-class');
            $query->values($data);
        }

        $statement                      = $sql->prepareStatementForSqlObject($query);
        $result                         = $statement->execute();
        $resultObj                      = new ResultSet();
        $resultObj->initialize($result);

        if (empty($node_y_class_id)) {
            $node_y_class_id            = $this->adapter->getDriver()->getLastGeneratedValue();

            /* For Texonomy Instance */
            $returnTexonomyArray        = $this->getStructureTable()->createInstanceOfClass(TAXONOMY_CLASS_ID, '1');
            if(intval($returnTexonomyArray['node_instance_id']) > 0)
            {
                $propertyIdArray        = array(TAXONOMY_TYPE_PROPERTY_ID);
                $propertyValueArray     = array('Class');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnTexonomyArray['node_instance_id'], $returnTexonomyArray['node_type_id'],'N',array(),"");
            }

            /* For Version Instance */
            $VERSION         = 169;
            $returnVersionArray        = $this->getStructureTable()->createInstanceOfClass($VERSION, '1');
            if(intval($returnVersionArray['node_instance_id']) > 0)
            {
                $STATUS_PID  = 803;
                $VERSION_PID = 804;
                $propertyIdArray        = array($STATUS_PID,$VERSION_PID);
                $propertyValueArray     = array('PUBLISHED',1);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnVersionArray['node_instance_id'], $returnVersionArray['node_type_id'],'N',array(),"");
            }

            /* For CLASS Instance */
            $CLASS         = 364;
            $returnClassArray        = $this->getStructureTable()->createInstanceOfClass($CLASS, '1');
            if(intval($returnClassArray['node_instance_id']) > 0)
            {
                $COMMON      = 1672;
                $SINGULAR    = 1673;
                $PLURAL      = 1674;
                $DESENDENT   = 1675;
                $propertyIdArray        = array($COMMON,$SINGULAR,$PLURAL,$DESENDENT);
                $propertyValueArray     = array($common_name,$common_name,$common_name,'Both');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnClassArray['node_instance_id'], $returnClassArray['node_type_id'],'N',array(),"");
            }
            $node_x_array               = array(TAXONOMY_Z, VERSION_Z, CLASS_Z, $returnTexonomyArray['node_id'], $returnVersionArray['node_id'], $returnClassArray['node_id']);
            $nodeId                     = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $node_y_class_id);
            $this->getClassesTable()->saveNodeX($nodeId, implode(",",$node_x_array));
        }

        return $node_y_class_id;
    }

    /**
     * For create grouping.property and grouping.label and main property from course builder production json data
     * @param $propertyArray, $node_type_id, $node_class_id
     * @return null
     */
    public function createCBProperty($propertyArray, $node_type_id, $node_class_id)
    {
        $parent_id                              = $this->createGroupingProperties(array('value' => 'Properties'),$node_type_id,$node_class_id,0);

        foreach($propertyArray as $firstProperty => $operationArray)
        {
            if(trim($operationArray['operationName']) != '')
            $propertyName                                   = $firstProperty.' {'.$operationArray['operationName'].'}';
            else
            $propertyName                                   = $firstProperty;

            $operation_pid                      = $this->createGroupingProperties(array('value' => $propertyName),$node_type_id,$node_class_id,$parent_id);
            $property_new_id                    = $this->createAllTypeOfProperties($operationArray['nodes'],$node_type_id,$node_class_id,$operation_pid);
        }
    }

    /**
     * For create grouping.property and grouping.label type property with it's nodez and nodex class instances
     * @param $subPropertyArray,$node_type_id,$node_class_id,$parent_id
     * @return null
     */
    public function createAllTypeOfProperties($subPropertyArray,$node_type_id,$node_class_id,$parent_id)
    {
        foreach($subPropertyArray as $key => $propertyArray)
        {
            if($propertyArray['inputType'] == 'Grouping.Properties')
            {
                $new_parent_id                  = $this->createGroupingProperties($propertyArray,$node_type_id,$node_class_id,$parent_id);
                if(is_array($propertyArray['nodes']) && !empty($propertyArray['nodes']))
                    $this->createAllTypeOfProperties($propertyArray['nodes'],$node_type_id,$node_class_id,$new_parent_id);
            }
            else
            {
                $this->createLabelProperties($propertyArray,$node_type_id,$node_class_id,$parent_id);
            }
        }
    }

    /**
     * For create grouping.property type property with it's nodez and nodex class instances
     * @param $property_name,$node_type_id,$node_class_id,$parent_id
     * @return property_id
     */
    public function createGroupingProperties($property_name,$node_type_id,$node_class_id,$parent_id)
    {
        $data['caption']                        = $property_name['value'];
        $data['encrypt_status']                 = ENCRYPTION_STATUS;
        $data['node_class_id']                  = $node_class_id;
        $data['node_id']                        = $this->getClassesTable()->createNode();
        $data['node_type_id']                   = $node_type_id;
        $data['node_class_property_parent_id']  = $parent_id;
        $data['sequence']                       = $this->getClassesTable()->getSequenceNumberCProperty($node_class_id, $data['node_class_property_parent_id']);

        $sql                                    = new Sql($this->adapter);
        $query                                  = $sql->insert('node-class-property');
        $query->values($data);
        $statement                              = $sql->prepareStatementForSqlObject($query);
        $result                                 = $statement->execute();
        $property_id                            = $this->adapter->getDriver()->getLastGeneratedValue();

        if (!empty($property_id)) {
            /* For Texonomy Instance */
            $returnTexonomyArray        = $this->getStructureTable()->createInstanceOfClass(TAXONOMY_CLASS_ID, '1');
            if(intval($returnTexonomyArray['node_instance_id']) > 0)
            {
                $propertyIdArray        = array(TAXONOMY_TYPE_PROPERTY_ID);
                $propertyValueArray     = array('Grouping.Properties');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnTexonomyArray['node_instance_id'], $returnTexonomyArray['node_type_id'],'N',array(),"");
            }

            /* For NODE RIGHTS Instance */
            $NODERIGHTS                 = 190;
            $returnRightsArray          = $this->getStructureTable()->createInstanceOfClass($NODERIGHTS, '1');
            if(intval($returnRightsArray['node_instance_id']) > 0)
            {
                $NODERIGHTSTYPE         = NODES_RIGHTS_TYPES;
                $VIEW                   = 882;
                $CREATE                 = 883;
                $EDIT                   = 884;
                $DESTROY                = 885;
                $SHARE                  = 886;
                $propertyIdArray[]      = $NODERIGHTSTYPE;
                $propertyValueArray[]   = 'Role';

                $viewRoles              = array();
                $editRoles              = array();
                foreach($property_name['roles'] as $roleIndex => $roleArray)
                {
                    if($roleArray['view'] == '1')
                    {
                        $viewRoles[]    = $roleArray['roleID'];
                    }

                    if($roleArray['edit'] == '1')
                    {
                        $editRoles[]    = $roleArray['roleID'];
                    }
                }

                if(count($viewRoles) > 0)
                {
                    $propertyIdArray[]      = $VIEW;
                    $propertyValueArray[]   = implode(",",$viewRoles);
                }

                if(count($editRoles) > 0)
                {
                    $propertyIdArray[]      = $EDIT;
                    $propertyValueArray[]   = implode(",",$editRoles);
                }
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnRightsArray['node_instance_id'], $returnRightsArray['node_type_id'],'N',array(),"");
            }

            /* For SHOWCOLLAPSED Instance */
            $SHOWCOLLAPSED              = 808;
            $returnCollapsedArray       = $this->getStructureTable()->createInstanceOfClass($SHOWCOLLAPSED, '1');
            if(intval($returnCollapsedArray['node_instance_id']) > 0)
            {
                $SHOWCOLL               = 7695;
                $propertyIdArray        = array($SHOWCOLL);
                $propertyValueArray     = array('No');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnCollapsedArray['node_instance_id'], $returnCollapsedArray['node_type_id'],'N',array(),"");
            }
            $node_x_array               = array(TAXONOMY_Z, NODE_RIGHTS_Z, COLLAPSE_Z, $returnTexonomyArray['node_id'], $returnRightsArray['node_id'], $returnCollapsedArray['node_id']);
            $this->getClassesTable()->saveNodeX($data['node_id'], implode(",",$node_x_array));
        }

        return $property_id;
    }

    /**
     * For create grouping.label type property with it's nodez class instances
     * @param $property_name,$node_type_id,$node_class_id,$parent_id
     * @return property_id
     */
    public function createLabelProperties($property_name,$node_type_id,$node_class_id,$parent_id)
    {
        $data['caption']                        = $property_name['value'];
        $data['encrypt_status']                 = ENCRYPTION_STATUS;
        $data['node_class_id']                  = $node_class_id;
        $data['node_id']                        = $this->getClassesTable()->createNode();
        $data['node_type_id']                   = $node_type_id;
        $data['node_class_property_parent_id']  = $parent_id;
        $data['sequence']                       = $this->getClassesTable()->getSequenceNumberCProperty($node_class_id, $data['node_class_property_parent_id']);

        $sql                                    = new Sql($this->adapter);
        $query                                  = $sql->insert('node-class-property');
        $query->values($data);
        $statement                              = $sql->prepareStatementForSqlObject($query);
        $result                                 = $statement->execute();
        $property_id                            = $this->adapter->getDriver()->getLastGeneratedValue();

        if (!empty($property_id)) {
            /* For Texonomy Instance */
            $returnTexonomyArray        = $this->getStructureTable()->createInstanceOfClass(TAXONOMY_CLASS_ID, '1');
            if(intval($returnTexonomyArray['node_instance_id']) > 0)
            {
                $propertyIdArray        = array(TAXONOMY_TYPE_PROPERTY_ID);
                $propertyValueArray     = array('Grouping.Label');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnTexonomyArray['node_instance_id'], $returnTexonomyArray['node_type_id'],'N',array(),"");
            }

            /* For DATATYPE Instance */
            $DATATYPE                   = 166;
            $returnDataTypeArray        = $this->getStructureTable()->createInstanceOfClass($DATATYPE, '1');
            if(intval($returnDataTypeArray['node_instance_id']) > 0)
            {
                if($property_name['dataType'] == '')
                {
                    $property_name['dataType'] = 'String';
                }

                $DataTypeId             = 800;
                $propertyIdArray        = array($DataTypeId);
                $propertyValueArray     = array($property_name['dataType']);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnDataTypeArray['node_instance_id'], $returnDataTypeArray['node_type_id'],'N',array(),"");
            }

            /* For FORMSELECTOR Instance */
            $FORMSELECTOR               = 167;
            $returnFormSelArray         = $this->getStructureTable()->createInstanceOfClass($FORMSELECTOR, '1');
            if(intval($returnFormSelArray['node_instance_id']) > 0)
            {
                if($property_name['inputType'] == '')
                {
                    $property_name['inputType'] = 'Input';
                }
                $FormSelId              = 801;
                $propertyIdArray        = array($FormSelId);
                $propertyValueArray     = array($property_name['inputType']);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnFormSelArray['node_instance_id'], $returnFormSelArray['node_type_id'],'N',array(),"");
            }

            /* For VALIDATION Instance */
            $VALIDATION                 = 168;
            $returnValiArray            = $this->getStructureTable()->createInstanceOfClass($VALIDATION, '1');
            if(intval($returnValiArray['node_instance_id']) > 0)
            {
                $ValidationId           = 802;
                $propertyIdArray        = array($ValidationId);
                $propertyValueArray     = array('...');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnValiArray['node_instance_id'], $returnValiArray['node_type_id'],'N',array(),"");
            }

            /* For NODE RIGHTS Instance */
            $NODERIGHTS                 = 190;
            $returnRightsArray          = $this->getStructureTable()->createInstanceOfClass($NODERIGHTS, '1');
            if(intval($returnRightsArray['node_instance_id']) > 0)
            {
                $NODERIGHTSTYPE         = NODES_RIGHTS_TYPES;
                $VIEW                   = 882;
                $CREATE                 = 883;
                $EDIT                   = 884;
                $DESTROY                = 885;
                $SHARE                  = 886;
                $propertyIdArray[]      = $NODERIGHTSTYPE;
                $propertyValueArray[]   = 'Role';

                $viewRoles              = array();
                $editRoles              = array();
                foreach($property_name['roles'] as $roleIndex => $roleArray)
                {
                    if($roleArray['view'] == '1')
                    {
                        $viewRoles[]    = $roleArray['roleID'];
                    }

                    if($roleArray['edit'] == '1')
                    {
                        $editRoles[]    = $roleArray['roleID'];
                    }
                }

                if(count($viewRoles) > 0)
                {
                    $propertyIdArray[]      = $VIEW;
                    $propertyValueArray[]   = implode(",",$viewRoles);
                }

                if(count($editRoles) > 0)
                {
                    $propertyIdArray[]      = $EDIT;
                    $propertyValueArray[]   = implode(",",$editRoles);
                }
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnRightsArray['node_instance_id'], $returnRightsArray['node_type_id'],'N',array(),"");
            }

            /* For DATASOURCE Instance */
            $DATASOURCE                 = 779;
            $returnDataArray            = $this->getStructureTable()->createInstanceOfClass($DATASOURCE, '1');
            if(intval($returnDataArray['node_instance_id']) > 0)
            {
                $DataSourceType         = 6794;
                $propertyIdArray        = array($DataSourceType);
                $propertyValueArray     = array('User Input');
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnDataArray['node_instance_id'], $returnDataArray['node_type_id'],'N',array(),"");
            }
            $node_x_array               = array(TAXONOMY_Z,DATATYPE_Z,FORM_SELECTOR_Z,VALIDATION_Z,NODE_RIGHTS_Z,DATA_SOURCE_Z, $returnTexonomyArray['node_id'], $returnDataTypeArray['node_id'], $returnFormSelArray['node_id'], $returnValiArray['node_id'], $returnRightsArray['node_id'], $returnDataArray['node_id']);
            $this->getClassesTable()->saveNodeX($data['node_id'], implode(",",$node_x_array));
        }

        return $property_id;
    }

    /**
     * For fetch course builder class node id from production_cb instance node id
     * @param $productionId
     * @return operationArray
     */
    public function getClassNodeIdFromProduction($productionId)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_y_id'));
        $select->where->equalTo('nxyr.node_x_id', $productionId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray1                              = $resultObj->initialize($result)->toArray();

        return $tempArray1[0]['node_y_id'];
    }

    /**
     * For fetch only opeartion propertry from class
     * @param $productionId
     * @return operationArray
     */
    public function fetchOperationOfClass($productionId)
    {
        /*$class_node_id                          = $this->getClassNodeIdFromProduction($productionId);
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ncp' => 'node-class-property'));
        $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ncp.node_class_id', array('node_class_id'), 'INNER');
        $select->where->AND->equalTo('nc.node_id', $class_node_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        $operationArray                         = array();
        foreach($tempArray as $key => $value)
        {
            if($tempArray[0]['node_class_property_id'] == $value['node_class_property_parent_id'])
            {
                $temp                           = array();
                $temp['node_id']                = $value['node_id'];
                $arr                            = preg_split("/[{].*[}]/",$value['caption']);
                $string                         = substr(str_replace($arr[0], '', $value['caption']), 1, -1);
                if($string == false)
                    $string                     = '';
                $temp['operation']              = $string;
                $temp['level']                  = trim(str_replace('_operation', '', $arr[0]));
                $operationArray[]               = $temp;
            }
        }*/
        $tempArray                              = $this->getProductionJSON($productionId);
        $operationArray                         = array();
        foreach($tempArray as $key => $value)
        {
                $temp                           = array();
                $temp['node_id']                = $key;
                $temp['operation']              = $value['operationName'];
                $temp['level']                  = trim(str_replace('_operation', '', $key));
                $operationArray[]               = $temp;
        }
        return $operationArray;
    }

    /**
     * For insert action rules on course builder classes opeartion propertry
     * @param $propNodeId,$actionsArray
     * @return node_id
     */
    public function insertActionRules($propNodeId,$actionsArray)
    {
        /* For Action Role Instance */
        $returnActionRoleArray        = $this->getStructureTable()->createInstanceOfClass(ACTION_ROLE_CLASS_ID, '1');
        if(intval($returnActionRoleArray['node_instance_id']) > 0)
        {
            $propertyIdArray        = array(ACTION_ROLE_CONTROLER_PID);
            $propertyValueArray     = array($actionsArray['controllerID']);
            $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnActionRoleArray['node_instance_id'], $returnActionRoleArray['node_type_id'],'N',array(),"");
        }

        $node_x_array               = array(ACTION_ROLE_CLASS_NID, $returnActionRoleArray['node_id']);
        $this->getClassesTable()->saveNodeX($propNodeId, implode(",",$node_x_array));

        foreach($actionsArray['subactions'] as $labelIndex => $subActionArray)
        {
            $buttonName                             = $subActionArray['label'];
            $isConditionInstance                    = false;
            $returnActionCBArray                    = $this->getStructureTable()->createInstanceOfClass(ACTION_CB_CLASS_ID, '1');
            if(count($subActionArray['conditions']) > 0)
            {
                $propertyIdACBArray                 = array();
                $propertyValueACBArray              = array();

                if($subActionArray['conditions'][0]['dataAttribute'] != '' && $subActionArray['conditions'][0]['dataOperator'] != '' && $subActionArray['conditions'][0]['dataComparisonValue'] != '')
                {
                    if(intval($returnActionCBArray['node_instance_id']) > 0)
                    {
                        $propertyIdACBArray         = array(ACTION_CB_NAME_PID);
                        $propertyValueACBArray      = array($buttonName);
                        $isConditionInstance        = true;
                    }
                }
                else
                {
                    if(intval($returnActionCBArray['node_instance_id']) > 0)
                    {
                        $propertyIdACBArray         = array(ACTION_CB_NAME_PID,ACTION_CB_PRODUCTION_PID,ACTION_CB_OPERATION_PID);
                        $propertyValueACBArray      = array($buttonName,$subActionArray['conditions'][0]['dataProduction'],$subActionArray['conditions'][0]['dataSourceId']);
                        $isConditionInstance        = false;
                    }
                }
                $this->getStructureTable()->createInstanceProperty($propertyIdACBArray, $propertyValueACBArray, $returnActionCBArray['node_instance_id'], $returnActionCBArray['node_type_id'],'N',array(),"");
            }

            $node_x_array1                          = array($returnActionCBArray['node_id']);
            $this->getClassesTable()->saveNodeX($returnActionRoleArray['node_id'], implode(",",$node_x_array1));

            if($isConditionInstance)
            {
                $node_x_array2                          = array();
                foreach($subActionArray['conditions'] as $key => $value)
                {
                    $returnConditionCBArray             = $this->getStructureTable()->createInstanceOfClass(CONDITION_CB_CLASS_ID, '1');
                    if(intval($returnConditionCBArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray                = array(CONDITION_CB_PROPERTY_PID,CONDITION_CB_OPERATOR_PID,CONDITION_CB_THRASHOLD_PID,CONDITION_CB_PRODUCTION_PID,CONDITION_CB_OPERATION_PID);
                        $propertyValueArray             = array($value['dataAttribute'],$value['dataOperator'],$value['dataComparisonValue'],$value['dataProduction'],$value['dataSourceId']);
                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnConditionCBArray['node_instance_id'], $returnConditionCBArray['node_type_id'],'N',array(),"");
                    }
                    $node_x_array2[]                    = $returnConditionCBArray['node_id'];
                }

                if(count($node_x_array2) > 0)
                $this->getClassesTable()->saveNodeX($returnActionCBArray['node_id'], implode(",",$node_x_array2));
            }
        }

        return $returnActionRoleArray['node_id'];
    }

    /**
     * For remove action rules on course builder classes opeartion propertry
     * @param $propNodeId,$actionsArray
     * @return firstArray
     */
    public function removeActionRules($propNodeId,$actionsArray)
    {
        $firstArray                             = $this->removeActionRulesByClass(ACTION_ROLE_CLASS_ID,$propNodeId);

        foreach($firstArray as $key => $value)
        {
            $secondArray                             = $this->removeActionRulesByClass(ACTION_CB_CLASS_ID,$value['node_x_id']);
            foreach($secondArray as $key1 => $value1)
            {
                $secondArray                             = $this->removeActionRulesByClass(CONDITION_CB_CLASS_ID,$value1['node_x_id']);
            }
        }

        return $firstArray;
    }

    /**
     * For remove any nodez class or nodex class instances when course_builder change any production
     * @param class_id, node_y_id
     * @return tempArray
     */
    public function removeActionRulesByClass($class_id,$node_y_id)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->where->equalTo('ni.node_class_id', $class_id);
        $select->where->AND->equalTo('nxyr.node_y_id', $node_y_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        foreach($tempArray as $key => $value)
        {
            $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $value['node_instance_id'], 'equalto');
            $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_instance_id', $value['node_instance_id'], 'equalto');
            $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $value['node_x_id'], 'equalto');
        }

        return $tempArray;
    }

    /**
     * For remove production_cb class instance when course_builder change any production
     * @param productionCBNodeId
     * @return tempArray
     */
    public function removeProductionCB($productionCBNodeId)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->where->equalTo('ni.node_class_id', SERIES_CB_CLASS_ID);
        $select->where->AND->equalTo('nxyr.node_y_id', $productionCBNodeId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        foreach($tempArray as $key => $value)
        {
            $secondArray                             = $this->removeActionRulesByClass(SEGMENT_CB_CLASS_ID,$value['node_x_id']);
            $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $value['node_instance_id'], 'equalto');
            $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_instance_id', $value['node_instance_id'], 'equalto');
            $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $value['node_x_id'], 'equalto');
        }

        return $tempArray;
    }

    /**
     * For update production_cb class instance when course_builder change any production
     * @param productionCBNodeId, courseData
     * @return productionCBNodeId
     */
    public function updateProductionCB($productionCBNodeId,$status,$icon,$price,$publisher,$description,$highlights,$workflow,$courseData)
    {
        // For create production instance
        $node_instance_id                               = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $productionCBNodeId,'node_instance_id');
        if(intval($node_instance_id) > 0)
        {
            $data['status']                             = $status;
            $sql                                        = new Sql($this->adapter);
            $query                                      = $sql->update();
            $query->table('node-instance');
            $query->set($data);
            $query->where(array('node_instance_id' => $node_instance_id));
            $statement                                  = $sql->prepareStatementForSqlObject($query);
            $result                                     = $statement->execute();
            $resultObj                                  = new ResultSet();
            $resultObj->initialize($result);

            $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $node_instance_id, 'equalto');
            if(intval($status) == 1)
            {
                $productionPropertyIdArray                  = array(PRODUCTION_CB_TYPE_PID,PRODUCTION_CB_PERIODS_PID,PRODUCTION_CB_COL_PID,PRODUCTION_CB_CELL_PID,PRODUCTION_CB_TITLE_PID,PRODUCTION_CB_DESC_PID,PRODUCTION_CB_ICON_PID,PRODUCTION_CB_PUBLISHER_PID,PRODUCTION_CB_PRICE_PID,PRODUCTION_CB_FEATURE_PID,PRODUCTION_CB_WORKFLOW_PID);
                $productionPropertyValueArray               = array($courseData['type'],$courseData['periods'],$courseData['columns'],$courseData['cells'],$courseData['title'],$description,$icon,$publisher,$price,$highlights,$workflow);
                $this->getStructureTable()->createInstanceProperty($productionPropertyIdArray, $productionPropertyValueArray, $node_instance_id, '2','N',array(),"");
            }
            else
            {
                $productionPropertyIdArray                  = array(PRODUCTION_CB_TITLE_PID,PRODUCTION_CB_TYPE_PID,PRODUCTION_CB_DESC_PID,PRODUCTION_CB_PERIODS_PID,PRODUCTION_CB_COL_PID,PRODUCTION_CB_CELL_PID);
                $productionPropertyValueArray               = array($courseData['title'],$courseData['type'],'course_builder',$courseData['periods'],$courseData['columns'],$courseData['cells']);
                $this->getStructureTable()->createInstanceProperty($productionPropertyIdArray, $productionPropertyValueArray, $node_instance_id, '2','N',array(),"");
            }
        }

        // For create instances of series class
        $seriesNodeIdsArray                             = array();
        if(array_key_exists("series",$courseData) && count($courseData['series']))
        {
            foreach($courseData['series'] as $index => $seriesArray)
            {
                $returnSeriesArray                     = $this->getStructureTable()->createInstanceOfClass(SERIES_CB_CLASS_ID, '1');
                if(intval($returnSeriesArray['node_instance_id']) > 0)
                {

                    $seriesPropertyIdArray             = array(SERIES_CB_TITLE_PID,SERIES_CB_TYPE_PID,SERIES_CB_SEQUENCE_PID,SERIES_CB_ACTIVE_PID,SERIES_CB_COMPLETE_PID,SERIES_CB_HEADER_PID,SERIES_CB_DATA_PID,SERIES_CB_ROLE_PID,SERIES_CB_VARNAME_PID,SERIES_CB_VARVALUE_PID,SERIES_CB_VARHIDDEN_PID);
                    $seriesPropertyValueArray          = array($seriesArray['title'],$seriesArray['type'],$seriesArray['columnSequence'],0,0,$seriesArray['headerClass'],$seriesArray['dataClass'],$seriesArray['roleID'],$seriesArray['varName'],$seriesArray['varValue'],$seriesArray['varHidden']);

                    $this->getStructureTable()->createInstanceProperty($seriesPropertyIdArray, $seriesPropertyValueArray, $returnSeriesArray['node_instance_id'], $returnSeriesArray['node_type_id'],'N',array(),"");
                    $seriesNodeIdsArray[]                  = $returnSeriesArray['node_id'];

                    // For create instances of segment class
                    $segmentsNodeIdsArray                  = array();
                    if(array_key_exists("segments",$seriesArray) && count($seriesArray['segments']))
                    {
                        foreach($seriesArray['segments'] as $key => $segmentsArray)
                        {
                            $returnSegmentsArray                    = $this->getStructureTable()->createInstanceOfClass(SEGMENT_CB_CLASS_ID, '1');
                            if(intval($returnSegmentsArray['node_instance_id']) > 0)
                            {
                                $segmentsPropertyIdArray              = array(SEGMENT_CB_TITLE_PID,SEGMENT_CB_START_PID,SEGMENT_CB_END_PID,SEGMENT_CB_ACTIVE_PID,SEGMENT_CB_COMPLETE_PID,SEGMENT_CB_SCLASS_PID,SEGMENT_CB_ECLASS_PID);
                                $segmentsPropertyValueArray           = array($segmentsArray['title'],$segmentsArray['segmentStart'],$segmentsArray['segmentEnd'],0,0,$segmentsArray['segmentStartClass'],$segmentsArray['segmentEndClass']);

                                $this->getStructureTable()->createInstanceProperty($segmentsPropertyIdArray, $segmentsPropertyValueArray, $returnSegmentsArray['node_instance_id'], $returnSegmentsArray['node_type_id'],'N',array(),"");
                                $segmentsNodeIdsArray[]                   = $returnSegmentsArray['node_id'];
                            }
                        }
                    }

                    // For create relation between series and segment instance
                    if(intval($returnSeriesArray['node_id']) > 0 && count($segmentsNodeIdsArray) > 0)
                    {
                        $this->getStructureTable()->createRelation($returnSeriesArray['node_id'], $segmentsNodeIdsArray);
                    }
                }
            }
        }

        // For create relation between production and series instance
        if(intval($productionCBNodeId) > 0 && count($seriesNodeIdsArray) > 0)
        {
            $this->getStructureTable()->createRelation($productionCBNodeId, $seriesNodeIdsArray);
        }

        return $productionCBNodeId;
    }

    /**
     * For update property name only
     * @param propertyNodeId, propertyName
     * @return propertyNodeId
     */
    public function updatePropertyName($propertyNodeId,$propertyName)
    {
        $data['caption']                = $propertyName;
        $sql                            = new Sql($this->adapter);
        $query                          = $sql->update();
        $query->table('node-class-property');
        $query->set($data);
        $query->where(array('node_id' => $propertyNodeId));
        $statement                      = $sql->prepareStatementForSqlObject($query);
        $result                         = $statement->execute();
        $resultObj                      = new ResultSet();
        $resultObj->initialize($result);
        return $propertyNodeId;
    }

    /**
     * For update node_right class z type instances of every property
     * @param nodesArray
     * @return null
     */
    public function changeNodeRightesFromProperty($nodesArray)
    {
        foreach($nodesArray as $nodeKey => $nodeValue)
        {
            $propertyNodeId             = $nodeValue['nodeID'];
            $NODERIGHTS                 = 190;
            $this->removeActionRulesByClass($NODERIGHTS,$propertyNodeId);

            /* For NODE RIGHTS Instance */
            $returnRightsArray          = $this->getStructureTable()->createInstanceOfClass($NODERIGHTS, '1');
            if(intval($returnRightsArray['node_instance_id']) > 0)
            {
                $NODERIGHTSTYPE         = NODES_RIGHTS_TYPES;
                $VIEW                   = 882;
                $CREATE                 = 883;
                $EDIT                   = 884;
                $DESTROY                = 885;
                $SHARE                  = 886;
                $propertyIdArray[]      = $NODERIGHTSTYPE;
                $propertyValueArray[]   = 'Role';

                $viewRoles              = array();
                $editRoles              = array();
                foreach($nodeValue['roles'] as $roleIndex => $roleArray)
                {
                    if($roleArray['view'] == '1')
                    {
                        $viewRoles[]    = $roleArray['roleID'];
                    }

                    if($roleArray['edit'] == '1')
                    {
                        $editRoles[]    = $roleArray['roleID'];
                    }
                }

                if(count($viewRoles) > 0)
                {
                    $propertyIdArray[]      = $VIEW;
                    $propertyValueArray[]   = implode(",",$viewRoles);
                }

                if(count($editRoles) > 0)
                {
                    $propertyIdArray[]      = $EDIT;
                    $propertyValueArray[]   = implode(",",$editRoles);
                }
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnRightsArray['node_instance_id'], $returnRightsArray['node_type_id'],'N',array(),"");
            }
            $this->getClassesTable()->saveNodeX($propertyNodeId, $returnRightsArray['node_id'].',');

            if(is_array($nodeValue['nodes']))
            {
                $this->changeNodeRightesFromProperty($nodeValue['nodes']);
            }
        }
    }

    /**
     * For delete property and child properties with nodex and nodez instances
     * @param deletePropArray, blankArray
     * @return blankArray
     */
    public function deleteOperationMainProperty($deletePropArray,$blankArray)
    {
        foreach($deletePropArray as $pName => $valueArray)
        {
            $sql                                    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nxyr' => 'node-x-y-relation'));
            $select->columns(array('node_x_id'));
            $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id','node_class_id'), 'INNER');
            $select->where->AND->equalTo('nxyr.node_y_id', $valueArray['nodeID']);
            $statement                              = $sql->prepareStatementForSqlObject($select);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $tempArray                              = $resultObj->initialize($result)->toArray();

            foreach($tempArray as $key => $value)
            {
                $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $value['node_instance_id'], 'equalto');
                $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_instance_id', $value['node_instance_id'], 'equalto');
                $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $value['node_x_id'], 'equalto');
            }
            $this->getClassesTable()->commonDeleteMethod('node-class-property', 'node_id', $valueArray['nodeID'], 'equalto');

            if(is_array($valueArray['nodes']))
            {
               $blankArray = $this->deleteOperationMainProperty($valueArray['nodes'],$blankArray);
            }
        }
        $blankArray[] = $deletePropArray;
        return $blankArray;
    }

    /**
     * For get main property(Properties) id from class id
     * @param class_id
     * @return node_class_property_id
     */
    public function getClassMainPropertyId($class_id)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ncp' => 'node-class-property'));
        $select->columns(array('node_class_property_id'));
        $select->where->equalTo('ncp.node_class_id', $class_id);
        $select->where->AND->equalTo('ncp.node_class_property_parent_id', 0);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        return $tempArray[0]['node_class_property_id'];
    }

    /**
     * Get class structure
     * @param type $class_id
     * @return array
     */
     public function getClassStructure($class_id)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('className'=>'caption', 'classID'=>'node_class_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('nodeID'=>'node_id', 'value'=>'caption'));
        $select->join(array('ncp2' => 'node-class-property'), 'ncp2.node_class_property_id = ncp.node_class_property_parent_id', array('parentID'=>'node_id'));
        $select->where->equalTo('nc.node_class_id', $class_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $tempArray                              = $resultObj->initialize($result)->toArray();

        $classPropArr =  array();
        $classPropArr['className'] = current($tempArray)['className'];
        $classPropArr['classID'] = current($tempArray)['classID'];
        $i=0;
        foreach($tempArray as $key=>$val){
            $classPropArr['structure'][$i]['caption']    = $val['value'];
            $classPropArr['structure'][$i]['nodeID']   = $val['nodeID'];
            $classPropArr['structure'][$i]['parentID'] = $val['parentID'];
            $i++;
        }
        return $classPropArr;
    }

    /**
     * Created By: Gaurav
     * Date: 02 june 2017
     * Fetch all course and dialogue details based on time
     * @param type $data
     * @return array
     */
    public function getCourseDialogue($data = array()) {
        return $this->getClassesTable()->fetchCoureListData($data);
    }

    /*
     * Created By: Gaurav
     * On Date: 02-June-2017
     * Purpose: To manage Course List Data By Course, By Dialogue
     * @param: array $course_data
     * @param: return array
     */
    public function courseData($course_data, $requestedData) {


        $dashborad_type = isset($requestedData['view_type'])? $requestedData['view_type']: '';
        $search_on_dashboard = isset($requestedData['search_on_dash'])? $requestedData['search_on_dash']: '';
        $header_filter = isset($requestedData['header_filter'])? $requestedData['header_filter']: array();
        $login_user_id = isset($requestedData['login_userId'])? $requestedData['login_userId']: '';
        $platform = isset($requestedData['platform'])? strtolower($requestedData['platform']): '';

        $course_list = array();
        if(!count($course_data['dialogue_order_data'])>0 && (int)$requestedData['timestamp']>0){
            return (object)$course_list;
        }


        $d_search = array();

            if(count($course_data)){
                if ($dashborad_type == 'bycourse') {



                            $sorted_course = $dialogue_order = array();
                            $temp = array();
                            if($header_filter['filter_key'] != 'order_by'){
                                $temp = $dialogue_order = array_column($course_data['dialogue_order_data'], 'dialogue_node_id');
                                $dialogue_order_array = array_combine($temp, $course_data['dialogue_order_data']);
                            }
                            $count = count($dialogue_order);

                            if($search_on_dashboard != ""){
                                $actor_info = $this->getActorFormatData($course_data['actor_info']);
                                $actor_id_array = array_column($actor_info, 'actor_id');
                                $actor_array = array_combine($actor_id_array, $actor_info);
                            }
                           // return $course_data['course_dialogue_data'];

                            foreach ($course_data['course_dialogue_data'] as $course_value) {


                                $courseKey = " ".$course_value['course_node_id'];

                                if($search_on_dashboard != ""){
                                    $actor_data = $actor_array[$course_value['actor_value']];
                                    $name = $actor_data['first_name']." ".$actor_data['last_name'];

                                    if( (stripos($course_value['course_title'], $search_on_dashboard) !== false) || (stripos($course_value['dialogue_title'], $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($actor_data['actor_email'], $search_on_dashboard) !== false)){
                                        $d_search[$courseKey] = $course_value['course_node_id'];
                                    }

                                    if($course_value['actor_value'] == $login_user_id || ($course_value['course_created_by'] == $login_user_id)){
                                        $arrIds[] = $courseKey;
                                    }
                                }

                                $course_list[$courseKey]['course'] = $course_value['course_title'];
                                $course_list[$courseKey]['date'] = date("Y M d H:i:s", strtotime($course_value['course_updation_timestamp']));
                                $course_list[$courseKey]['status'] = $course_value['course_status'];
                                $course_list[$courseKey]['domain'] = 'Prospus';
                                $course_list[$courseKey]['course_node_id'] = $courseKey;
                                $course_list[$courseKey]['course_instance_id'] = $course_value['course_instance_id'];

                                if($platform == 'ios'){
                                    $course_list[$courseKey]['course_created_by'] = $course_value['course_created_by'];
                                    $course_list[$courseKey]['course_updation_timestamp'] = (string)strtotime($course_value['course_updation_timestamp']);
                                }

                                if(!isset($course_list[$courseKey]['statement_timestamp']) || ($course_list[$courseKey]['statement_timestamp'] < $dialogue_order_array[$course_value['dialogue_node_id']]['statement_timestamp']) ){
                                    $course_list[$courseKey]['statement_timestamp'] = $dialogue_order_array[$course_value['dialogue_node_id']]['statement_timestamp'];
                                    $course_list[$courseKey]['dialogue_node_id'] = $dialogue_order_array[$course_value['dialogue_node_id']]['dialogue_node_id'];
                                }




                                $course_list[$courseKey]['actors'] = array();
                                if($platform == 'ios' /*&& (int)$course_list[$courseKey]['dialogue_node_id']>0*/){
                                    //get dialogues
                                    if(!isset($course_list[$courseKey]['dialogue'])){
                                        $dialogueData['courseNodeIds'] = $courseKey;
                                        $dialogueData['platform'] = 'IOS';
                                        $dialgoueArr = $this->getClassesTable()->fetchCourseDialogueApi($dialogueData);
                                        usort($dialgoueArr, function($date1, $date2){
                                            if ($date1['statement_timestamp'] == $date2['statement_timestamp']) return 0;
                                            return ($date1['statement_timestamp'] > $date2['statement_timestamp']) ? -1 : 1;
                                        });
                                        $final_dialogue_arr = array_filter($dialgoueArr, function($element) use ($login_user_id) {
                                            if(in_array(trim($login_user_id), explode(",",$element['users_all']))){     // check user in all users list, only bycourse
                                                return $element;
                                            }
                                        });
                                        if(count($final_dialogue_arr)){
                                        $dialgoueArr1 = array_column($final_dialogue_arr, 'dialouge_node_id');
                                        $dialgoueArr3 = array_combine($dialgoueArr1, $final_dialogue_arr);
                                        $course_list[$courseKey]['dialogue'] = $dialgoueArr3;
                                        }else{
                                            $course_list[$courseKey]['dialogue'] = array();
                                        }
                                    }
                                }else{
                                    $course_list[$courseKey]['dialogue'] = array();
                                }

                                $course_list[$courseKey]['events'] = array();
                                $course_list[$courseKey]['resources'] = array();
                                $course_list[$courseKey]['production'] = array();

                                /*if(count($dialogue_order)){
                                    $key = array_search($course_value['dialogue_node_id'], $dialogue_order);
                                    if($course_value['dialogue_node_id'] == ''){
                                        $sorted_course[$courseKey] = ++$count;
                                    }else{
                                        if(!isset($sorted_course[$courseKey])){
                                            $sorted_course[$courseKey] = $key;
                                        }else{
                                            if($sorted_course[$courseKey] > $key){
                                                $sorted_course[$courseKey] = $key;
                                            }
                                        }
                                    }
                                }*/
                            }
                            /*if(count($dialogue_order)){
                                asort($sorted_course);
                                $sorted_course = array_flip($sorted_course);
                                $sorted = array_map(function($v) use ($course_list) {
                                    return $course_list[$v];
                                }, $sorted_course);
                                $course_list = array_combine($sorted_course, $sorted);
                            }*/

                            if($search_on_dashboard != ""){
                                $course_list = array_filter($course_list, function($key) use($arrIds) {
                                    return in_array($key, $arrIds) ? $key : '';
                                },  ARRAY_FILTER_USE_KEY);
                            }






                } elseif($dashborad_type == 'bydialogue'){




                        $sorted_course = $dialogue_order = array();
                        if($header_filter['filter_key'] != 'order_by'){
                            $dialogue_order = array_column($course_data['dialogue_order_data'], 'dialogue_node_id');
                        }

                        $actor_info = $this->getActorFormatData($course_data['actor_info']);
                        $actor_id_array = array_column($actor_info, 'actor_id');
                        $actor_array = array_combine($actor_id_array, $actor_info);
                        $arrIds = array();
                        foreach ($course_data['course_dialogue_data'] as $dialogue_value) {
                            $dialogueKey = " ".$dialogue_value['dialogue_node_id'];
                            if($dialogue_value['actor_value'] == $login_user_id){
                                $arrIds[] = $dialogueKey;
                            }
                            $course_list[$dialogueKey]['dialogue'] = $dialogue_value['dialogue_title'];
                            $course_list[$dialogueKey]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                            $course_list[$dialogueKey]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                            $course_list[$dialogueKey]['course_node_id'] = $dialogue_value['course_node_id'];
                            $course_list[$dialogueKey]['course_instance_id'] = $dialogue_value['course_instance_id'];
                            $course_list[$dialogueKey]['course'] = $dialogue_value['course_title'];
                            $course_list[$dialogueKey]['date'] = date("Y M d H:i:s", strtotime($dialogue_value['dialogue_timestamp']));

                            $actor_data = $actor_array[$dialogue_value['actor_value']];
                            if($actor_data['first_name'] != '' && $actor_data['last_name'] != "" && $actor_data['actor_email'] != ''){
                                $email_value = str_replace(' ', '_', strtolower($actor_data['actor_email']));
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['first_name'] = $actor_data['first_name'];
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['last_name'] = $actor_data['last_name'];
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['full_name'] = $actor_data['first_name']." ".$actor_data['last_name'];
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['email_address'] = $actor_data['actor_email'];

                                if($dialogue_value['has_removed']==1){
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['has_removed'] = 0;
                                }else if($dialogue_value['has_removed']==2){
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['has_removed'] = 1;
                                }
                            }else{
                                $course_list[$dialogueKey]['actors'] = array();
                            }

                            if($search_on_dashboard != ""){
                                $name = strtolower($actor_data['first_name']." ".$actor_data['last_name']);

                                if( (stripos($dialogue_value['course_title'], $search_on_dashboard) !== false) || (stripos($dialogue_value['dialogue_title'], $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($actor_data['actor_email'], $search_on_dashboard) !== false)){
                                    $d_search[$dialogueKey] = $dialogue_value['dialogue_node_id'];
                                }
                            }

                            $course_list[$dialogueKey]['notification'] = array();
                            $course_list[$dialogueKey]['events'] = array();
                            $course_list[$dialogueKey]['resources'] = array();
                            $course_list[$dialogueKey]['production'] = array();

                            if(count($dialogue_order)){
                                $key = array_search($dialogue_value['dialogue_node_id'], $dialogue_order);
                                if($key !== false)$sort_col[$key] = $dialogueKey;
                            }
                        }
                        $course_list = array_filter($course_list, function($key) use($arrIds) {
                            return in_array($key, $arrIds) ? $key : '';
                        },  ARRAY_FILTER_USE_KEY);

                        if(count($dialogue_order)){
                            ksort($sort_col);
                            $sort_col = array_values(array_intersect($sort_col, $arrIds));
                            $sorted = array_map(function($v) use ($course_list) {
                                return $course_list[$v];
                            }, $sort_col);
                            $course_list = array_combine($sort_col, $sorted);
                        }

                } elseif ($dashborad_type == 'byactor') {
                    $_loginUserId = $_SESSION[PREFIX . 'user_info']['node_id'];


                        $actor_info = $this->getActorFormatData($course_data['actor_info']);
                        $actor_id_array = array_column($actor_info, 'actor_id');
                        $actor_array = array_combine($actor_id_array, $actor_info);
                        $sort_col = $key_rows = $dialarray = array();
                        foreach ($course_data['course_dialogue_data'] as $dialogue_value){
                            if($dialogue_value['actor_value'] != ""){
                                $actorNodeId = " ".$dialogue_value['actor_value'];

                                if($search_on_dashboard != ""){
                                    $actor_data = $actor_array[$dialogue_value['actor_value']];
                                    $name = $actor_data['first_name']." ".$actor_data['last_name'];

                                    if( (stripos($dialogue_value['course_title'], $search_on_dashboard) !== false) || (stripos($dialogue_value['dialogue_title'], $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($actor_data['actor_email'], $search_on_dashboard) !== false)){
                                        $d_search[$actorNodeId] = $dialogue_value['actor_value'];
                                    }
                                }
                                if($_loginUserId == $dialogue_value['actor_value']){
                                    $dialarray[] = $dialogue_value['dialogue_node_id'];
                                }
                                if(isset($actor_array[$dialogue_value['actor_value']]))
                                {
                                    $course_list[$actorNodeId]['email_address'] = $actor_array[$dialogue_value['actor_value']]['actor_email'];
                                    $course_list[$actorNodeId]['first_name'] = $actor_array[$dialogue_value['actor_value']]['first_name'];
                                    $course_list[$actorNodeId]['last_name'] = $actor_array[$dialogue_value['actor_value']]['last_name'];
                                    $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['dialogue'] = $dialogue_value['dialogue_title'];
                                    $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                                    $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                                    if($dialogue_value['has_removed']==1){
                                        $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['has_removed'] = 0;
                                    }
                                    else if($dialogue_value['has_removed']==2){
                                        $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['has_removed'] = 1;
                                    }

                                    $course_list[$actorNodeId]['domain'] = 'Prospus';
                                    $course_list[$actorNodeId]['title'] = 'Admin';

                                    $fname = strtolower($actor_array[$dialogue_value['actor_value']]['first_name']);
                                    $lname = strtolower($actor_array[$dialogue_value['actor_value']]['last_name']);

                                    if($_loginUserId != $dialogue_value['actor_value']){
                                        if($header_filter['filter_title'] !== 'email'){
                                            $sort_col[$actorNodeId] = $fname."_".$lname.$actorNodeId;
                                            $key_rows[$fname."_".$lname.$actorNodeId] = $actorNodeId;
                                        }elseif($header_filter['filter_title'] === 'email'){
                                            $sort_col[$actorNodeId] = strtolower($actor_array[$dialogue_value['actor_value']]['actor_email']).$actorNodeId;
                                            $key_rows[strtolower($actor_array[$dialogue_value['actor_value']]['actor_email']).$actorNodeId] = $actorNodeId;
                                        }
                                    }
                                }
                            }
                        }//print_r(array($dialarray, $course_list));die();
                        unset($course_list[" ".$_loginUserId]);

                        if($header_filter['filter_key'] === 'order_by'){
                            if(strtolower($header_filter['filter_value']) !== 'desc'){
                                ksort($key_rows);
                                $sort_order = SORT_ASC;
                            }else{
                                krsort($key_rows);
                                $sort_order = SORT_DESC;
                            }
                        }else{
                            ksort($key_rows);
                            $sort_order = SORT_ASC;
                        }
                        array_multisort($sort_col, $sort_order, $course_list);
                        $course_list = array_combine($key_rows, $course_list);
                        //print_r(array($dialarray,$course_list));
                        foreach($course_list as $key => $courseData){
                            $dialogue_data = array_intersect(array_column($courseData['dialogue'], 'dialogue_node_id'), $dialarray);
                            $course_list[$key]['dialogue'] = array();
                            if(count($dialogue_data)){
                                foreach($dialogue_data as $val){
                                    $course_list[$key]['dialogue'][$val] = $courseData['dialogue'][$val];
                                }
                            }
                        }
                        //echo $me = microtime(true) - $st;



                }
                if($search_on_dashboard != ''){
                    $course_list = array_intersect_key($course_list, $d_search);
                }
            }



        /*Changed done as per requirement of IOS team
         * Added on 7 june 2017
         * Added by Gaurav
         */
        return json_decode(json_encode($course_list,JSON_FORCE_OBJECT));
       //return $course_list;
    }

    /**
     * Created By: Gaurav
     * On Date: 02-June-2017
     * @param type $actor_info_data_array
     * @return type
     */
    public function getActorFormatData($actor_info_data_array = array()){
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
     * Get All actor info
     * Added by:- Gaurav
     * Added on:- 12 June
     * @param type $actor_ids
     * @param type $actorProeprtyIds
     * @return type
     */
    public function getActorInfo($actor_ids, $actorProeprtyIds) {

        return $propArray = $this->getClassesTable()->getActorInfo($actor_ids, $actorProeprtyIds);
    }

    public function write($id, $data)
    {
    	$awsObj 				= $this->AwsS3();
    	$result  				= $awsObj->setFileData("temp_session/sess_".$id,$data);
        //$variable = file_put_contents("$this->savePath/sess_".$id, $data) === false ? false : true;
        return $id;
    }

    /**
     * Get All unreadcount of dialogue
     * @param type $data
     * @return type
     * Added by:- Gaurav
     * Added on:- 14 June
     */
    function fetchUserDialogueNotificationCount($dialouge_node_id, $user_instance_node_id, $type="", $operator="=") {

        return $countArray = $this->getCourseDialoguesTable()->getUserDialogueNotificationCount($dialouge_node_id, $user_instance_node_id, $type);
    }

    /**
     * Remove Read Statements
     * Added by:- Gaurav
     * Added on:- 16 Jun
     * @param type $statement_id
     * @param type $dialogue_node_id
     * @param type $login_user_id
     * @return type
     */
    function deleteNotificationUserWise($dialogueRes, $login_user_id) {

        return $removeArray = $this->getClassesTable()->deleteNotificationUserWise($dialogueRes, $login_user_id);
    }

    /**
     * get class form instance structure from view class instance
     * @param type $data
     * @return html and array
     */
    public function getFormStructure($data) {
        $formHtml                           = $this->getStructureTable()->getFormStructure($data['instanceId']);
        $html                               = '';
        if($formHtml != '')
        {
            $html                           = '<html><body>' . html_entity_decode($formHtml) . '</body></html>';
            $dom                            = new \DOMDocument();
            $dom->loadHTML($html);
            $dom->preserveWhiteSpace        = false;
            /* For Set Value On Input Type Fields */
            $inputDom                       = $dom->getElementsByTagName('input');
            for ($i = 0; $i < $inputDom->length; $i++) {
                if ($inputDom->item($i)->getAttribute('type') == 'hidden' && $inputDom->item($i)->getAttribute('id') == 'production_type')
                {
                    $inputDom->item($i)->setAttribute('value', trim($data['productionType']));
                }
                else if ($inputDom->item($i)->getAttribute('type') == 'hidden' && $inputDom->item($i)->getAttribute('id') == 'production_id')
                {
                    $inputDom->item($i)->setAttribute('value', trim($data['productionId']));
                }
                else if ($inputDom->item($i)->getAttribute('type') == 'hidden' && $inputDom->item($i)->getAttribute('id') == 'apiname')
                {
                    $inputDom->item($i)->setAttribute('value', 'create_course_production');
                }
            }

            $html                           = $dom->saveHTML();
            $html                           = str_replace("<html><body>", "", $html);
            $html                           = str_replace("</body></html>", "", $html);
        }
        $returnArray['layout']              = $html;
        return $returnArray;
    }

    public function createCourseAndProductionFromOutside($data)
    {
        $dataArray['production_id']                 = $data['production_id'];
        $dataArray['production_type']               = $data['production_type'];
        $dataArray['node_instance_id']              = $data['id_detail_instance_id'];
        $dataArray['node_class_id']                 = $data['node_class_id'];
        $dataArray['node_class_property_id']        = $data['instance_property_id'];
        $dataArray['value']                         = $data['instance_property_caption'];

        $returnArray                                = array();
        $returnArray['status']                      = 'error';
        $returnArray['new_course']                  = array();

        $receiver_array                             = array();
        $sender_id                                  = '';
        $returnInstanceArray                        = $this->getStructureTable()->createInstanceOfClass($dataArray['node_class_id'], '1');
        if(intval($returnInstanceArray['node_instance_id']) > 0)
        {
            $propertyIdArray                        = $dataArray['node_class_property_id'];
            $propertyValueArray                     = $dataArray['value'];
            $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnInstanceArray['node_instance_id'], $returnInstanceArray['node_type_id'],'N',array(),"");
        }

        if(intval($returnInstanceArray['node_id']) > 0)
        {
            /* For Course Class Inatnace */
            $course_title                   = "";
            $course_description             = "";
            $course_objective               = "";
            $course_timestamp               = date('Y-m-d H:i:s');
            $course_created_by              = "";
            $course_utimestamp              = date('Y-m-d H:i:s');

            /* For Production Details Class Inatnace */
            $production_name                = "";
            $production_nid                 = "";

            /* For Individual History Array */
            $individualHistoryArray         = array();
            $roleArray                      = $this->activeRolesFromProduction($dataArray['production_id']);
            $role_list                      = $roleArray[0];
            $initiator                      = $roleArray[1];
            $production                     = $roleArray[2];
            $operation_key                  = $roleArray[3];

            if($dataArray['production_type'] == 'prospusCarrers')
            {
                /* For Insert ACCOUNT Class Inatnace */
                $first_name                     = '';
                $last_name                      = '';
                $email                          = '';
                $first_name_key                 = array_search(CAREERS_FIRST_NAME_PID, $dataArray['node_class_property_id']);
                $first_name                     = $dataArray['value'][$first_name_key];
                $last_name_key                  = array_search(CAREERS_LAST_NAME_PID, $dataArray['node_class_property_id']);
                $last_name                      = $dataArray['value'][$last_name_key];
                $email_key                      = array_search(CAREERS_EMAIL_PID, $dataArray['node_class_property_id']);
                $email                          = $dataArray['value'][$email_key];

                $individualNodeId               = $this->checkEmailExist($email);
                $returnIndividualArray          = array();
                if(trim($individualNodeId) != '')
                {
                    $returnIndividualArray['node_id'] = $individualNodeId;
                }
                else
                {
                    $returnAccountArray                  = $this->getStructureTable()->createInstanceOfClass(ACCOUNT_CLASS_ID, '1');
                    if(intval($returnAccountArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray                = array(INDIVIDUAL_EMAIL_ID);
                        $propertyValueArray             = array($email);
                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnAccountArray['node_instance_id'], $returnAccountArray['node_type_id'],'N',array(),"");
                    }

                    /* For Insert INDIVIDUAL Class Inatnace */
                    $returnIndividualArray              = $this->getStructureTable()->createInstanceOfClass(INDIVIDUAL_CLASS_ID, '1');
                    if(intval($returnIndividualArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray                = array(INDIVIDUAL_FIRST_NAME,INDIVIDUAL_LAST_NAME,INDIVIDUAL_EMAIL_PARTICIPANT_FLAG_PROPERTY_ID);
                        $propertyValueArray             = array($first_name,$last_name,'1');
                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnIndividualArray['node_instance_id'], $returnIndividualArray['node_type_id'],'N',array(),"");
                    }

                    // For create relation between INDIVIDUAL and ACCOUNT instance
                    if(intval($returnIndividualArray['node_id']) > 0 && intval($returnAccountArray['node_id']) > 0)
                    {
                        $this->getStructureTable()->createRelation($returnIndividualArray['node_id'], array($returnAccountArray['node_id']));
                    }
                }

                foreach($role_list as $role_id => $role_name)
                {
                    $tempArray                 = array();
                    if(strtolower($role_name) == 'hr')
                    {
                        $tempArray['actor']             = HR_ACTOR_ID;
                        $tempArray['role']              = $role_id;
                        $receiver_array[]               = HR_ACTOR_ID;
                    }
                    else if($role_id == $initiator)
                    {
                        $tempArray['actor']    = $returnIndividualArray['node_id'];
                        $tempArray['role']     = $initiator;
                        $sender_id             = $returnIndividualArray['node_id'];
                        $receiver_array[]      = intval($returnIndividualArray['node_id']);
                    }

                    if(count($tempArray) > 0)
                    $individualHistoryArray[]  = $tempArray;
                }

                /* For Course Class Inatnace */
                $possition_key                  = array_search(CAREERS_POSITION_PID, $dataArray['node_class_property_id']);
                $possition_apply_for            = $dataArray['value'][$possition_key];
                $course_title                   = $first_name." ".$last_name." applied for ".$possition_apply_for;
                $course_description             = "";
                $course_objective               = "";
                $course_timestamp               = date('Y-m-d H:i:s');
                $course_created_by              = $returnIndividualArray['node_id'];
                $course_utimestamp              = date('Y-m-d H:i:s');

                /* For Production Details Class Inatnace */
                $production_name                = $course_title;//"Workflow for Job Applications Via Career Page";
                $production_nid                 = $dataArray['production_id'];
            }
            else
            {}

            /* For Insert Course Class Inatnace */
            $returnCourseArray                  = $this->getStructureTable()->createInstanceOfClass(COURSE_CLASS_ID, '1');
            if(intval($returnCourseArray['node_instance_id']) > 0)
            {
                $propertyIdArray                = array(COURSE_TITLE_ID,COURSE_DESC_ID,COURSE_OBJ_ID,COURSE_TIME_ID,COURSE_CREATED_ID,COURSE_UPDATE_TIME_ID);
                $propertyValueArray             = array($course_title,$course_description,$course_objective,$course_timestamp,$course_created_by,$course_utimestamp);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnCourseArray['node_instance_id'], $returnCourseArray['node_type_id'],'N',array(),"");
            }

            /* For Insert Production Details Class Inatnace */
            $returnProductionDetailsArray       = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_DETAILS_CLASS_ID, '1');
            if(intval($returnProductionDetailsArray['node_instance_id']) > 0)
            {
                $propertyIdArray                = array(PRODUCTION_DETAILS_NAME_PID,PRODUCTION_DETAILS_ID_PID);
                $propertyValueArray             = array($production_name,$production_nid);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnProductionDetailsArray['node_instance_id'], $returnProductionDetailsArray['node_type_id'],'N',array(),"");
            }

            // For create relation between Course and Production Details instance
            if(intval($returnCourseArray['node_id']) > 0 && intval($returnProductionDetailsArray['node_id']) > 0)
            {
                $this->getStructureTable()->createRelation($returnCourseArray['node_id'], array($returnProductionDetailsArray['node_id']));
            }

            // For Individual History Class Instance
            $individual_time_val                = time();
            foreach($individualHistoryArray as $key => $value)
            {
                /* Relation Between Production Details and Individual History */
                /* For Insert Individual History Class Inatnace */
                $returnIndividualHistoryArray       = $this->getStructureTable()->createInstanceOfClass(INDIVIDUAL_HISTORY_CLASS_ID, '1');
                if(intval($returnIndividualHistoryArray['node_instance_id']) > 0)
                {
                    $propertyIdArray                = array(INDIVIDUAL_ACTORID_PROP_ID,INDIVIDUAL_TIMESTAMP_PROP_ID,INDIVIDUAL_STATUS_PROP_ID,INDIVIDUAL_ROLE_PROP_ID);
                    $propertyValueArray             = array($value['actor'],$individual_time_val,1,$value['role']);
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnIndividualHistoryArray['node_instance_id'], $returnIndividualHistoryArray['node_type_id'],'N',array(),"");
                }

                // For Insert Relation Between Production Details And Individual History Class Inatnace
                $this->getStructureTable()->createRelation($returnProductionDetailsArray['node_id'], array($returnIndividualHistoryArray['node_id']));

                /* Relation Between Course and Individual History */
                /* For Insert Individual History Class Inatnace */
                $returnIndividualHistoryArray1       = $this->getStructureTable()->createInstanceOfClass(INDIVIDUAL_HISTORY_CLASS_ID, '1');
                if(intval($returnIndividualHistoryArray1['node_instance_id']) > 0)
                {
                    $propertyIdArray                = array(INDIVIDUAL_ACTORID_PROP_ID,INDIVIDUAL_TIMESTAMP_PROP_ID,INDIVIDUAL_STATUS_PROP_ID);
                    $propertyValueArray             = array($value['actor'],$individual_time_val,1);
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnIndividualHistoryArray1['node_instance_id'], $returnIndividualHistoryArray1['node_type_id'],'N',array(),"");
                }
                // For Insert Relation Between Course And Individual History Class Inatnace
                $this->getStructureTable()->createRelation($returnCourseArray['node_id'], array($returnIndividualHistoryArray1['node_id']));
            }

            /* Create Production Data Instance */
            $returnProductionDataArray                  = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_DATA_CLASS_ID, '1');
            if(intval($returnProductionDataArray['node_instance_id']) > 0)
            {
                $targetProduction       = $production['actions']['subactions'][0]['conditions'][0]['logic'][0]['dataProduction'];
                $target                 = $production['actions']['subactions'][0]['conditions'][0]['logic'][0]['dataSource'];
                $variables              = $production['actions']['subactions'][0]['conditions'][0]['variables'];

                $propertyIdArray        = array(PRODUCTION_DATA_PDI_PID,PRODUCTION_DATA_SERIES_PID,PRODUCTION_DATA_SEGMENT_PID,PRODUCTION_DATA_PRO_PID,PRODUCTION_DATA_OPE_PID,PRODUCTION_DATA_VAR_PID);
                $propertyValueArray     = array($returnProductionDetailsArray['node_id'],'-','-',$targetProduction,$target,json_encode($variables));
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnProductionDataArray['node_instance_id'], $returnProductionDataArray['node_type_id'],'N',array(),"");
            }

            // Create XY Relation Between Production Details And Production Data
            $this->getStructureTable()->createXYRelation($returnProductionDetailsArray['node_id'], $returnProductionDataArray['node_id']);

            /* Create Manage Instance Class Instance */
            $returnManageInstanceArray                  = $this->getStructureTable()->createInstanceOfClass(MANAGE_INSTANCE_CLASS_ID, '1');
            if(intval($returnManageInstanceArray['node_instance_id']) > 0)
            {
                $propertyIdArray        = array(MANAGE_INSTANCE_CLASS_PID,MANAGE_INSTANCE_INSTANCE_PID,MANAGE_INSTANCE_OPERATION_PID);
                $propertyValueArray     = array($dataArray['node_class_id'],$returnInstanceArray['node_id'],$operation_key);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnManageInstanceArray['node_instance_id'], $returnManageInstanceArray['node_type_id'],'N',array(),"");
            }

            // Create XY Relation Between Production Data And Manage Instance
            $this->getStructureTable()->createXYRelation($returnProductionDataArray['node_id'], $returnManageInstanceArray['node_id']);

            $returnArray['new_course']                    = array(" ".trim($returnCourseArray['node_id']) => array(
                                                                        'course' => $course_title,
                                                                        'status' => 'Published',
                                                                        'domain' => 'Prospus',
                                                                        'course_node_id' => $returnCourseArray['node_id'],
                                                                        'course_instance_id' => $returnCourseArray['node_instance_id'],
                                                                        'new_production_id' => $returnProductionDetailsArray['node_id'],
                                                                        'date'=> $course_timestamp,
                                                                        'dialogue' => array(),
                                                                        'actors' => array(),
                                                                        'events' => array(),
                                                                        'resources' => array(),
                                                                        'production' => array($returnProductionDetailsArray['node_id'] => array('production_node_id' => $returnProductionDetailsArray['node_id'], 'template_id' => $production_nid, 'production_id' => $production_nid, 'production_name' => $production_name,'created_by' => $returnIndividualArray['node_id'],'status' => 'P', 'users' => '', 'is_primary_controller' => $returnIndividualArray['node_id'])),
                                                                        'user_ids' => '',
                                                                        'count' => array(
                                                                            'course' => 0,
                                                                            'notification' => 0,
                                                                            'actors' => '',
                                                                            'dialogues' => 0,
                                                                            'events' => 0,
                                                                            'resources' => 0,
                                                                            'production' => 1
                                                                        ),
                                                                    )
                                                                );

            $returnArray['receiver_array']                = $receiver_array;
            $returnArray['sender_id']                     = $sender_id;
            $returnArray['sender_name']                   = $first_name." ".$last_name;
            $returnArray['status']                        = 'success';
        }

        return $returnArray;
    }

    public function checkEmailExist($email_address) {
        $email_address = trim($email_address);
        //$account_class_node_id = '634';
        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('node_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
        $select->where->AND->equalTo('nip.value', $email_address);
        $select->where->AND->equalTo('ni.status', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $accountInfo = $resultObj->initialize($result)->toArray();

        if(isset($accountInfo[0]['node_id']))
        return $this->getNodeYIdFromXYTable($accountInfo[0]['node_id']);
        else
        return '';
    }

    public function getNodeYIdFromXYTable($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_x_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $impldeNX = array();
        foreach ($dataArray as $key => $value) {
            $impldeNX[] = $value['node_y_id'];
        }
        return $impldeNX[0];
    }

    /**
        * Purpose: fetch active roles of perticuler production
        * @param productionId
        * @return productionRoleArray
    */
    public function activeRolesFromProduction($productionId)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".PRODUCTION_JSON_CLASS_ID), array('node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value'), 'INNER');
        $select->where->equalTo('nxyr.node_y_id', $productionId);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $productionJSON                         = $resultObj->initialize($result)->toArray();


        $production_json                        = json_decode(html_entity_decode($productionJSON[0]['value']),true);
        $permissionWithRolesArray               = $this->getActiveRolesFromProductionJsonArray($production_json);

        $operationKey                           = $this->getFirstOperationKey($production_json);

        $productionRoleArray                    = array();
        foreach($permissionWithRolesArray as $key => $value)
        {
            foreach($value as $roleId => $valueArray)
            {
                if(intval($valueArray['view']) == 1)
                $productionRoleArray[$roleId]       = $valueArray['roleName'];
            }
        }

        return array($productionRoleArray,$production_json[$operationKey]['actions']['controllerID'],$production_json[$operationKey],$operationKey);
    }

    /**
     * For get actives roles from production json
     * @param $production_json
     * @return roleArrayWirhPermission
     */
    public function getActiveRolesFromProductionJsonArray($production_json)
    {
        $roleArrayWirhPermission                                 = array();
        foreach($production_json as $key => $value)
        {
            $roleArrayWirhPermission                             = $this->getPermissionArray($production_json[$key]['nodes'],$roleArrayWirhPermission,$key);
        }
        return $roleArrayWirhPermission;
    }

    /**
     * For get access list by roles
     * @param $permissionData,$roleArrayWirhPermission,$operationName
     * @return roleArrayWirhPermission
     */
    public function getPermissionArray($permissionData,$roleArrayWirhPermission,$operationName)
    {
        foreach($permissionData as $key => $value)
        {
            if(is_array($permissionData[$key]['roles']))
            {
                foreach($permissionData[$key]['roles'] as $rKey => $rVal)
                {
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['roleName']   = $rVal['roleName'];
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['roleID']     = $rVal['roleID'];
                    if($rVal['view'])
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['view']       = $rVal['view'];
                    if($rVal['edit'])
                    $roleArrayWirhPermission[$operationName][$rVal['roleID']]['edit']       = $rVal['edit'];
                }
            }

            if(is_array($permissionData[$key]['nodes']))
            {
                $roleArrayWirhPermission      = $this->getPermissionArray($permissionData[$key]['nodes'],$roleArrayWirhPermission,$operationName);
            }
        }

        return $roleArrayWirhPermission;
    }

    /**
     * fetch first key operation from production_json
     * @param $production_json
     * @return key
     */
    public function getFirstOperationKey($production_json)
    {
        $keysArray              = array_keys($production_json);
        $temp                   = array();
        $other                  = '';
        foreach($keysArray as $k => $v)
        {
            $temp[]             = explode("_",$v)[0];
            $other              = explode("_",$v)[1];
        }
        sort($temp);
        return current($temp).'_'.$other;
    }

    /**
     * fetch validation list from production validation class
     * @param $requestedData
     * @return array
     */
    public function getValidationList($requestedData)
    {
        $validationArray        = array();
        $tempArray              = $this->getClassesTable()->getInstanceListOfParticulerClass(PRO_VALIDATION_CLASS_ID, 'class', 'node_id');

        if(array_key_exists("view_type",$requestedData))
        {
            if($requestedData['view_type'] == '1' || $requestedData['view_type'] == '2')
            {
                foreach($tempArray as $key => $value)
                {
                    if($requestedData['view_type'] == $value['Type'])
                    {
                        $validationArray[$key]        = $value;
                    }
                }
            }
            else
            {
                $validationArray    = $tempArray;
            }
        }
        else
        {
            $validationArray    = $tempArray;
        }

        return $validationArray;
    }

    /**
     * For update production_cb class instance when course_builder change any production
     * @param productionCBNodeId, courseData
     * @return productionCBNodeId
     */
    public function unpublishProductionCB($productionCBNodeId)
    {
        // For create production instance
        $node_instance_id                           = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $productionCBNodeId,'node_instance_id');

        $data['status']                             = 0;
        $sql                                        = new Sql($this->adapter);
        $query                                      = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where(array('node_instance_id' => $node_instance_id));
        $statement                                  = $sql->prepareStatementForSqlObject($query);
        $result                                     = $statement->execute();
        $resultObj                                  = new ResultSet();
        $resultObj->initialize($result);

        return $productionCBNodeId;
    }

    public function signupInPU($data, $hashKeyArr, $emailExistFlag)
    {
        //email exist validation check
        $email_address = trim($data[INDIVIDUAL_EMAIL_ID]['value']);
        //$email_exist   = $this->checkEmailExist($email_address);

        if($emailExistFlag){
            return array('success' => 0, 'msg' => 'User already exists.');
        }else{
            $registerArray = array();
            foreach($data as $key => $value)
            {
                $registerArray[$value['class']]['propertyId'][] = $value['property'];
                $registerArray[$value['class']]['value'][]      = $value['value'];
            }

            $individualNodeId                                   = '';
            $roleNodeId                                         = '';
            $accountNodeId                                      = '';
            
            //Added by gaurav on 7 Sept 2017
            //Set user status inactive on registration 
            $registerArray[ACCOUNT_CLASS_ID]['propertyId'][] = ACCOUNT_STATUS_ID;
            $registerArray[ACCOUNT_CLASS_ID]['value'][]      = 'inactive';
            
            //return $registerArray;
            foreach($registerArray as $classId => $propValArray)
            {
                if(trim($classId) != "")
                {
                    
                    $returnArray                                    = array();
                    $returnArray                                    = $this->getStructureTable()->createInstanceOfClass($classId, '1');
                    if(intval($returnArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray                    = $propValArray['propertyId'];
                        $propertyValueArray                 = $propValArray['value'];
                        $indexImage                         = array_search(INDIVIDUAL_PROFILE_IMAGE,$propertyIdArray);
                        $filePath                           = '';
                        $isMove                             = 'hi';
                        if($indexImage)
                        {
                            $uploadPath                     = ABSO_URL.'public/nodeZimg/';
                            $filePath                       = $propertyValueArray[$indexImage];
                            $mainFolderName                 = dirname($filePath);
                            $mainFolderName                 = str_replace('data/temp/', '', $mainFolderName);
                            $fileName                       = basename($filePath);



                            $realFolderPath                = $uploadPath.$mainFolderName;
                            mkdir($realFolderPath, 0777,true);
                            rename(ABSO_URL.$filePath, $realFolderPath . '/' . $fileName);

                            $thumbFolderPath                = $uploadPath.$mainFolderName.'/thumb';
                            mkdir($thumbFolderPath, 0777,true);

                            $src                            = $realFolderPath . '/' . $fileName;
                            $srcFinal                       = $thumbFolderPath.'/'.$fileName;
                            $path_parts                     = pathinfo($src);

                            // max width and height of image
                            $max_upload_width               = 550;
                            $max_upload_height              = 550;
                            // target width and height of thumbnail image
                            $max_width_box                  = 50;
                            $max_height_box                 = 50;
                            // if user chosed properly then scale down the image according to user preferances
                            if(isset($max_width_box) && $max_width_box!='' && $max_width_box <= $max_upload_width){
                                $max_upload_width = $max_width_box;
                            }
                            if(isset($max_height_box) && $max_height_box !='' && $max_height_box <= $max_upload_height){
                                $max_upload_height = $max_height_box;
                            }

                            if (strtolower($path_parts['extension']) == "png") {
                                $image_source               = imagecreatefrompng($src);
                            } else if (strtolower($path_parts['extension']) == "gif") {
                                $image_source               = imagecreatefromgif($src);
                            } else {
                                $image_source               = imagecreatefromjpeg($src);
                            }
                            $remote_file                    = $srcFinal;
                            imagejpeg($image_source,$remote_file,100);
                            chmod($remote_file,0644);

                            // get width and height of original image
                            list($image_width, $image_height) = getimagesize($remote_file);

                            if($image_width>$max_upload_width || $image_height >$max_upload_height){
                                $proportions = $image_width/$image_height;

                                if($image_width>$image_height){
                                    $new_width = $max_upload_width;
                                    $new_height = round($max_upload_width/$proportions);
                                }
                                else{
                                    $new_height = $max_upload_height;
                                    $new_width = round($max_upload_height*$proportions);
                                }


                                $new_image = imagecreatetruecolor($new_width , $new_height);
                                $image_source = imagecreatefromjpeg($remote_file);

                                imagecopyresampled($new_image, $image_source, 0, 0, 0, 0, $new_width, $new_height, $image_width, $image_height);
                                imagejpeg($new_image,$remote_file,90);

                                imagedestroy($new_image);
                            }

                            $propertyValueArray[$indexImage]                 = str_replace('data/temp/', '', $propertyValueArray[$indexImage]);

                        }

                        /*if(intval($classId) == ROLE_CLASS_ID)
                        {
                            $propertyIdArray[]                  = ROLE_COMMON_PID;
                            $propertyValueArray[]               = 'Prospus.Guest';

                            $propertyIdArray[]                  = ROLE_ACTOR_PID;
                            $propertyValueArray[]               = $data[INDIVIDUAL_FIRST_NAME]['value'].' '.$data[INDIVIDUAL_LAST_NAME]['value'];

                            $propertyIdArray[]                  = ROLE_ASSIGNED_PID;
                            $propertyValueArray[]               = date('d-m-Y h:i:s');
                        }*/

                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnArray['node_instance_id'], $returnArray['node_type_id'],'N',array(),"");
                    }

                    if(intval($classId) == INDIVIDUAL_CLASS_ID)
                    {
                        $individualNodeId                   = $returnArray['node_id'];
                    }

                    /*if(intval($classId) == ROLE_CLASS_ID)
                    {
                        $roleNodeId                         = $returnArray['node_id'];
                    }*/

                    if(intval($classId) == ACCOUNT_CLASS_ID)
                    {
                        $accountNodeId                      = $returnArray['node_id'];
                    }
                }
            }

            // For create relation
            /*if(intval($individualNodeId) > 0 && intval($roleNodeId) > 0 && intval($accountNodeId) > 0)
            {
                $this->getStructureTable()->createRelation($individualNodeId, array($roleNodeId,$accountNodeId));
            }*/

            //Add code by Gaurav
            //Added on 30 Aug 2017
            //Start- store user unique key value in User Registration Table
            //Start
            $this->createUserRegistrationInstance($hashKeyArr,$individualNodeId);
            //End
            
            if(intval($individualNodeId) > 0 && intval($accountNodeId) > 0)
            {
                $this->getStructureTable()->createRelation($individualNodeId, array($accountNodeId));
            }

            //For Auto Login
            /*if (!isset($data[ROLE_DOMAIN_PID]['value']) || $data[ROLE_DOMAIN_PID]['value'] === '0') {
                if ($_SESSION[PREFIX . 'uniqueId1'] == "")
                    $_SESSION[PREFIX . 'uniqueId1'] = $_COOKIE['PHPSESSID'];

                //$this->setUserSession();
            }*/
            /*End Here*/

            //$userInfo['node_id'] = $individualNodeId;
            $userInfo['first_name'] = $data[INDIVIDUAL_FIRST_NAME]['value'];
            $userInfo['last_name'] = $data[INDIVIDUAL_LAST_NAME]['value'];
            //$userInfo['profile_image'] = $data[INDIVIDUAL_PROFILE_IMAGE]['value'] ? 'public/nodeZimg/'.$data[INDIVIDUAL_PROFILE_IMAGE]['value'] : 0;
            $userInfo['email_address'] = $email_address;
            
            $returnArray = array('success' => 1, 'msg' => 'User registered successfully.', 'data' => json_encode($userInfo));

            /* Subscription Code By Arvind Soni */
            if(array_key_exists('app_detail', $data))
            {

                $subscriptionArray                  =   array('production_id' => $data['app_detail']['production_id'],'price' => $data['app_detail']['price'],'user_id' => $userInfo['node_id']);
                $returnData                         =   $this->getStructureTable()->subscribeApplication($subscriptionArray);
                $returnArray['app_response']        =   $returnData;
            }

            return $returnArray;
        }
    }

    public function createUserRegistrationInstance($hashKeyArr,$individualNodeId)
    {
        $userRegArr     = $this->getStructureTable()->createInstanceOfClass(USER_REG_CLASS_ID, '1');

        if(intval($userRegArr['node_instance_id']) > 0)
        {
            $hashKeyArr['value'][USER_REG_USERID_PID] = $individualNodeId;
            $hashPropId                  = $hashKeyArr['propertyId'];
            $hashPropVal                 = array_values($hashKeyArr['value']);
            $this->getStructureTable()->createInstanceProperty($hashPropId, $hashPropVal, $userRegArr['node_instance_id'], $userRegArr['node_type_id'],'N',array(),"");
        }
    }

    /**
     * Created by: Amit Malakar
     * Date: 30-Aug-17
     * Function to set user data in session
     * @param email_address
     * @param password
     * @return array
     */
    public function setUserSession($data, $isGuest = false)
    {
        

        //Code modified by Gaurav on 12 Sept 2017
        if($isGuest){//for guest
               
                $userData = array();
                $userData['node_id']        = $data['user_node_id'];
                $userData['first_name']     = strtolower($data['email_address']);
                $userData['last_name']      = ' ';
                $userData['rolesArray']     = array();
                $userData['profile_image']  = '0';
                $userData['email_address']  = strtolower($data['email_address']);
                $userData['user_type']      = 'guest';
        }else{
            $dataArray                             = array();
            $dataArray['emailaddress_property_id'] = INDIVIDUAL_EMAIL_ID;
            $dataArray['password_property_id']     = ACCOUNT_PASSWORD_ID;
            $dataArray['emailaddress']             = strtolower($data['email_address']);
            $dataArray['password']                 = trim($data['password']);
            $dataArray['individual_prop_ids']      = INDIVIDUAL_FIRST_NAME . "," . INDIVIDUAL_LAST_NAME. "," . INDIVIDUAL_PROFILE_IMAGE;
            $dataArray['role_prop_ids']            = INDIVIDUAL_EMAIL_ID . ", " . ROLE_COMMON_NAME_PID . ", " . ROLE_DOMAIN_PID;
            $dataArray['domainName']               = 'www.prospus.com';
            
            $userData = $this->getStructureTable()->loginUser($dataArray);
            $userData['user_type']                 = 'active';
            //$userData['profile_image'] = isset($userData['profile_image']) ? 'public/nodeZimg/' . $userData['profile_image'] : 0;
            //$userData['profile_image'] = isset($userData['profile_image']) ? $userData['profile_image'] : 0;

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
            
        }
        
        $fileName                  = hash('sha256', $userData['email_address']);
        $file_path                 = ABSO_URL . "puidata/temp_session/sess_" . $fileName;
        $userData['last_name']     = isset($userData['last_name']) ? $userData['last_name'] : '';
        $userData['active_time']   = strtotime(date('Y-m-d H:i:s'));
        

        $handle                  = fopen($file_path, "w+");
        $userData['php_sess_id'] = $_COOKIE['PHPSESSID'];
        

        if(isset($userData['password']))
            unset($userData['password']);
        $res = $this->getClassesTable()->setUserDataOnLogin($userData);
        
        //Set profile image for session
        $userData['profile_image'] = $res['userData']['profile_image'];
         
        fwrite($handle, json_encode($userData));
        $session_file = $data['email_address'];
        fclose($handle);

        // WRITE VALUES TO SESSION DATA
        $decryptedHashedUserEmail = hash('sha256', $session_file);
        $sessObj                  = new PUSession($decryptedHashedUserEmail);

        $_SESSION[PREFIX . 'user_info']    = $userData;
        $_SESSION[PREFIX . 'session_file'] = $session_file;

        // ENCODE BEFORE SAVING DATA
        $sessEnc = session_encode();
        $sessObj->write('', $sessEnc);

        // SET COOKIE ON CLIENT MACHINE for 10 years
        $cipherObj        = new PUCipher();
        $puEncryptedEmail = $cipherObj->puEncrypt($session_file);
        setcookie(PREFIX . 'uniqueId1', $puEncryptedEmail, time() + IDLE_TIMEOUT, '/');

        return array('userData' => $res['userData'], 'notificationCount'=>$res['notificationCount']);
    }

    public function getCourseWorkflowProduction($data)
    {

        $productionList                                             =   $this->getDashboardTable()->getProductionListOfCourse($data);

        if(trim(array_keys($productionList)[0]) != '')
        {
            // Fetch production cb instance value
            $productionTempArray                                        = $this->fetchInstanceWithProperty(current($productionList)['production_id']);
            $productionArray                                            = array();
            foreach($productionTempArray as $key1 => $value1)
            {
                if(strtolower($value1['caption']) == 'production type')
                    $value1['caption']                                  = 'type';

                $productionArray[strtolower($value1['caption'])]        = $value1['value'];
            }

            $data['status']                             =   'P';
            $data['production_node_id']                 =   trim(array_keys($productionList)[0]);
            $course                                     =   $this->getDashboardTable()->getCourse($data);
            $course['course_status']                    =   $data['status'];
            $course_details                             =   $course['course_details'];

            
            foreach($course_details['all_users'] as $key => $value)
            {
                if(array_key_exists('profile_image', $value))
                {
                    $course_details['all_users'][$key]['profile_image'] = BASE_URL.'public/nodeZimg/'.$course_details['all_users'][$key]['profile_image'];
                }
                if(!array_key_exists('last_name', $value))
                {
                    $course_details['all_users'][$key]['last_name'] = '';
                }
            }

            /* New Code For Marc Feedback*/
            $productionDataList                         =   '';
            if(count($course['productionDataList']) > 0)
            $productionDataList = current($course['productionDataList']);

            if($data['status'] == 'P')
            {
                $data['production_data_node_id']            =   $productionDataList;
                $course                                     =   array();
                $sendDetailArray                            =   $this->getDashboardTable()->getProductionTemplate($data);

                $course['production_details_user']          =   $sendDetailArray['courseProductionArray']['production_details_user'];
                $course['production_details_node_id']       =   $sendDetailArray['courseProductionArray']['production_details_node_id'];
                $course['permission']                       =   $sendDetailArray['permissionProductionArray']['permission'];
                $course['operationKey']                     =   $sendDetailArray['permissionProductionArray']['operationKey'];
                $course['instance_id']                      =   $sendDetailArray['permissionProductionArray']['instance_id'];
                $course['production_data_node_id']          =   $sendDetailArray['permissionProductionArray']['production_data_node_id'];
                $course['formJson']                         =   $sendDetailArray['formJson'];
                $course['course_status']                    =   $data['status'];
                $course['course_details']                   =   $course_details;
                // set workflow from production cb instance
                $course['workflow']                         =   html_entity_decode($productionArray['workflow']);
                // set production template name from production cb instance
                $course['production_template_name']         =   html_entity_decode($productionArray['title']);
                if($data['production_data_node_id'] != '')
                {
                    $variables                              =   json_decode($sendDetailArray['permissionProductionArray']['variables'],true);
                    foreach($variables as $k => $v)
                    {
                        if($v['hidden'] == 'true')
                            $variables[$k]['hidden'] = 1;
                        else
                            $variables[$k]['hidden'] = '';
                    }
                    $course['formJson']['variables']        =   $variables;
                }
            }
            return $course;
        }
        

        return $data;
        
        
    }
    /**Added by gaurav on 8 sept 2017
     * Add guest users
     * @param type array
     */
    public function addGuestUsers($guestEmails){

        $this->adapter->getDriver()->getConnection()->beginTransaction();
        $guestEmailsArr = $this->getClassesTable()->allGuestEmails($guestEmails);

        $registerEmailsArr = $this->getClassesTable()->allUserEmails();
        $emailArr = array_diff($guestEmails, $registerEmailsArr);

        if(count($guestEmailsArr)){
            $emailArr = array_column($guestEmailsArr, 'value');
            $guestEmailArray = array_combine($emailArr, $guestEmailsArr);
            foreach($guestEmailArray as $emalKey => $email) {
                $userIds[$emalKey] = $email['node_id'];
            }
        }else if(count($emailArr)>0){
            foreach($emailArr as $email){
                $registerArray = array();
                //individual class
                $registerArray[INDIVIDUAL_CLASS_ID]['propertyId'][0] = INDIVIDUAL_FIRST_NAME;
                $registerArray[INDIVIDUAL_CLASS_ID]['value'][0]      = $email;
                $registerArray[INDIVIDUAL_CLASS_ID]['propertyId'][1] = INDIVIDUAL_LAST_NAME;
                $registerArray[INDIVIDUAL_CLASS_ID]['value'][1]      = " ";
                
                //account class
                $registerArray[ACCOUNT_CLASS_ID]['propertyId'][0] = INDIVIDUAL_EMAIL_ID;
                $registerArray[ACCOUNT_CLASS_ID]['value'][0]      = $email;
                $registerArray[ACCOUNT_CLASS_ID]['propertyId'][1] = ACCOUNT_STATUS_ID;
                $registerArray[ACCOUNT_CLASS_ID]['value'][1]      = 'guest';
                
                $individualNodeId = '';
                $accountNodeId = '';
                foreach($registerArray as $classId => $propValArray)
                {
                    if(trim($classId) != "")
                    {

                        $returnArray                                    = array();
                        $returnArray                                    = $this->getStructureTable()->createInstanceOfClass($classId, '1');
                        if(intval($returnArray['node_instance_id']) > 0)
                        {
                            $propertyIdArray                    = $propValArray['propertyId'];
                            $propertyValueArray                 = $propValArray['value'];
                            $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnArray['node_instance_id'], $returnArray['node_type_id'],'N',array(),"");
                        }

                        if(intval($classId) == INDIVIDUAL_CLASS_ID)
                        {
                            $individualNodeId                   = $returnArray['node_id'];
                        }


                        if(intval($classId) == ACCOUNT_CLASS_ID)
                        {
                            $accountNodeId                      = $returnArray['node_id'];
                        }
                    }
                }
                //Create XY relation
                if(intval($individualNodeId) > 0 && intval($accountNodeId) > 0)
                {
                    $this->getStructureTable()->createRelation($individualNodeId, array($accountNodeId));
                }
                $userIds[$email] = $individualNodeId;
            }
        }
        $this->adapter->getDriver()->getConnection()->commit();
        return $userIds;
    }
    
    /** Register guest users
     * Added by gaurav on 12 sept 2017
     * @param type $data
     */
    public function regGuestUser($data, $userNodeId, $accountStatus){
        
                
                //individual class
                $individualInsId = $this->getClassesTable()->getinstanceDetailsByNodeId($userNodeId);
                $firstName = $data[INDIVIDUAL_FIRST_NAME]['value'];
                $lastName  = $data[INDIVIDUAL_LAST_NAME]['value'];
                $password  = $data[ACCOUNT_PASSWORD_ID]['value'];
                $email  = $data[INDIVIDUAL_EMAIL_ID]['value'];
                $profileImg  = $data[INDIVIDUAL_PROFILE_IMAGE]['value'];
                $accountInsId = $this->getClassesTable()->getInstanceIdBYValue(INDIVIDUAL_EMAIL_ID, $email);

                $filePath                           = '';
                if($profileImg)
                {
                    $uploadPath                     = ABSO_URL.'public/nodeZimg/';
                    $filePath                       = $profileImg;
                    $mainFolderName                 = dirname($filePath);
                    $mainFolderName                 = str_replace('data/temp/', '', $mainFolderName);
                    $fileName                       = basename($filePath);



                    $realFolderPath                = $uploadPath.$mainFolderName;
                    mkdir($realFolderPath, 0777,true);
                    rename(ABSO_URL.$filePath, $realFolderPath . '/' . $fileName);

                    $thumbFolderPath                = $uploadPath.$mainFolderName.'/thumb';
                    mkdir($thumbFolderPath, 0777,true);

                    $src                            = $realFolderPath . '/' . $fileName;
                    $srcFinal                       = $thumbFolderPath.'/'.$fileName;
                    $path_parts                     = pathinfo($src);

                    // max width and height of image
                    $max_upload_width               = 550;
                    $max_upload_height              = 550;
                    // target width and height of thumbnail image
                    $max_width_box                  = 50;
                    $max_height_box                 = 50;
                    // if user chosed properly then scale down the image according to user preferances
                    if(isset($max_width_box) && $max_width_box!='' && $max_width_box <= $max_upload_width){
                        $max_upload_width = $max_width_box;
                    }
                    if(isset($max_height_box) && $max_height_box !='' && $max_height_box <= $max_upload_height){
                        $max_upload_height = $max_height_box;
                    }

                    if (strtolower($path_parts['extension']) == "png") {
                        $image_source               = imagecreatefrompng($src);
                    } else if (strtolower($path_parts['extension']) == "gif") {
                        $image_source               = imagecreatefromgif($src);
                    } else {
                        $image_source               = imagecreatefromjpeg($src);
                    }
                    $remote_file                    = $srcFinal;
                    imagejpeg($image_source,$remote_file,100);
                    chmod($remote_file,0644);

                    // get width and height of original image
                    list($image_width, $image_height) = getimagesize($remote_file);

                    if($image_width>$max_upload_width || $image_height >$max_upload_height){
                        $proportions = $image_width/$image_height;

                        if($image_width>$image_height){
                            $new_width = $max_upload_width;
                            $new_height = round($max_upload_width/$proportions);
                        }
                        else{
                            $new_height = $max_upload_height;
                            $new_width = round($max_upload_height*$proportions);
                        }


                        $new_image = imagecreatetruecolor($new_width , $new_height);
                        $image_source = imagecreatefromjpeg($remote_file);

                        imagecopyresampled($new_image, $image_source, 0, 0, 0, 0, $new_width, $new_height, $image_width, $image_height);
                        imagejpeg($new_image,$remote_file,90);

                        imagedestroy($new_image);
                    }

                    $profileImg                 = str_replace('data/temp/', '', $profileImg);
                }
                
                //insert last name
                if($individualInsId!=''){
                    if($profileImg!=''){
                        $ncpIdArray            = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME, INDIVIDUAL_PROFILE_IMAGE);
                        $ncpValueArray         = array($firstName, $lastName, $profileImg);
                    }else{
                        $ncpIdArray            = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME);
                        $ncpValueArray         = array($firstName, $lastName);
                    }
                    
                    $typeId                = 2;
                    $res                   = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $individualInsId, $typeId);
                }
                
                //insert password
                if($accountInsId!=''){
                    
                    $cipherObj             = new PUCipher();
                    $newPasswordHash       = $cipherObj->puPasswordHash($password);
                    $ncpIdArray            = array(ACCOUNT_PASSWORD_ID, ACCOUNT_STATUS_ID);
                    $ncpValueArray         = array($newPasswordHash, $accountStatus);
                    $typeId                = 2;
                    $res                   = $this->getClassesTable()->updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $accountInsId, $typeId);
                }   
                
                
                
    }

    /**
     * PU Reports data for Google SpreadSheet
     * Created By: Amit Malakar
     * Date: 20-Sep-2017
     * @return array $result
     */
    public function puReportsData()
    {
        // Total Registered Users - ALL (Inactive/Active/Guest/Draft/Published)
        $sql    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);

        $statement   = $sql->prepareStatementForSqlObject($select);
        $result      = $statement->execute();
        $resultObj   = new ResultSet();
        $t_reg_users = $resultObj->initialize($result)->count();

        // Total Production Courses - Productions of Courses
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('ni.node_class_id', PRODUCTION_DETAILS_CLASS_ID);

        $statement  = $sql->prepareStatementForSqlObject($select);
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        $t_prod_crs = $resultObj->initialize($result)->count();

        // Total Default Dialogue Courses - Courses w/ Dialogues that are w/o Productions = Total Courses - Courses w/ Dialogues that have Productions
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('ni.node_class_id', COURSE_CLASS_ID);

        $statement     = $sql->prepareStatementForSqlObject($select);
        $result        = $statement->execute();
        $resultObj     = new ResultSet();
        $total_courses = $resultObj->initialize($result)->count();
        $t_def_dia_crs = $total_courses - $t_prod_crs;

        // Total Dialogues in Production Courses - Dialogues of Courses that have Productions
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array(), 'left');
        $select->join(array('ni2' => 'node-instance'), 'ni2.node_id = xy.node_x_id', array(), 'left');
        $select->join(array('xy2' => 'node-x-y-relation'), 'xy2.node_y_id = ni.node_id', array(), 'left');
        $select->join(array('ni3' => 'node-instance'), 'ni3.node_id = xy2.node_x_id', array(), 'left');
        $select->where->equalTo('ni.node_class_id', COURSE_CLASS_ID);
        $select->where->AND->equalTo('ni2.node_class_id', DIALOGUE_CLASS_ID);
        $select->where->AND->equalTo('ni3.node_class_id', PRODUCTION_DETAILS_CLASS_ID);

        $statement     = $sql->prepareStatementForSqlObject($select);
        $result        = $statement->execute();
        $resultObj     = new ResultSet();
        $t_prd_dia_crs = $resultObj->initialize($result)->count();

        // Total Dialogues - ALL (Draft/Published)
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('ni.node_class_id', DIALOGUE_CLASS_ID);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result    = $statement->execute();
        $resultObj = new ResultSet();
        $t_dia     = $resultObj->initialize($result)->count();

        // Total Statements - ALL (Draft/Published)
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('ni.node_class_id', STATEMENT_CLASS_ID);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result    = $statement->execute();
        $resultObj = new ResultSet();
        $t_stat    = $resultObj->initialize($result)->count();

        $result = [
            't_reg_users'   => $t_reg_users,
            't_def_dia_crs' => $t_def_dia_crs,
            't_prod_crs'    => $t_prod_crs,
            't_prd_dia_crs' => $t_prd_dia_crs,
            't_dia'         => $t_dia,
            't_stat'        => $t_stat,
        ];

        return $result;
    }

    /**
     * Created By: Divya Rajput
     * Date: 09-Oct-2017
     * param @emailaddress
     * @return array $hashKey
     */
    public function fetchHashKey($emailaddress){
        $sql        = new Sql($this->adapter);
        $select     = $sql->select();

        $select->from(array('nip' => 'node-instance-property'));
        $select->JOIN(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->JOIN(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array());
        $select->JOIN(array('ni1' => 'node-instance'), new Expression('ni1.node_id = nxyr.node_y_id AND ni1.node_class_id = '.INDIVIDUAL_CLASS_ID), array());
        $select->JOIN(array('nip1' => 'node-instance-property'), new Expression('nip1.value = nxyr.node_y_id AND nip1.node_class_property_id = '.USER_REG_USERID_PID), array());
        $select->JOIN(array('nip2' => 'node-instance-property'), new Expression('nip2.node_instance_id = nip1.node_instance_id AND nip2.node_class_property_id = '.USER_REG_HASH_KEY_PID), array('hash_key'=>'value'));
        $select->where->equalTo('nip.value', $emailaddress);
        $select->where->AND->equalTo('nip.node_class_property_id', INDIVIDUAL_EMAIL_ID);

        $statement  = $sql->prepareStatementForSqlObject($select);
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        $dataResult = $resultObj->initialize($result)->toArray();
        return $dataResult[0]['hash_key'];
    }

    public function insertMenuDataFromMenuTable($menuArray)
    {
        foreach($menuArray as $key => $value)
        {
            $returnJsonArray                        = $this->getStructureTable()->createInstanceOfClass(main_menu_cid, '1');
            if(intval($returnJsonArray['node_instance_id']) > 0) {
                $propertyIdArray = array(main_menu_id_pid, main_parent_menu_id_pid, main_menu_pid, main_description_pid, main_icon_class_pid, main_menu_type_pid, main_order_pid, main_is_display_pid, main_is_active_pid, main_is_dual_pid, main_dual_icon_class_pid, main_data_href_pid, main_shortcut_icon_pid, main_controler_pid, main_action_pid,main_is_disabled_pid);
                $propertyValueArray = array($value['menu_id'], $value['parent_menu_id'], $value['menu'], $value['description'], $value['icon_class'], $value['menu_type'], $value['order'], $value['is_display'], $value['is_active'], $value['is_dual'], $value['dual_icon_class'], $value['data_href'], $value['shortcut_icon'], $value['controler'], $value['action'],0);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnJsonArray['node_instance_id'], $returnJsonArray['node_type_id'],'N',array(),"");
                if (is_array($value['child'])) {
                    $this->insertAgainSubMenu($returnJsonArray['node_id'], $value['child']);
                }
            }
        }
        return $menuArray;
    }

    public function insertAgainSubMenu($parentInstanceId,$menuArray)
    {
        foreach($menuArray as $key => $value)
        {
            $returnJsonArray                        = $this->getStructureTable()->createInstanceOfClass(main_menu_cid, '1');
            if(intval($returnJsonArray['node_instance_id']) > 0) {
                $propertyIdArray = array(main_menu_id_pid, main_parent_menu_id_pid, main_menu_pid, main_description_pid, main_icon_class_pid, main_menu_type_pid, main_order_pid, main_is_display_pid, main_is_active_pid, main_is_dual_pid, main_dual_icon_class_pid, main_data_href_pid, main_shortcut_icon_pid, main_controler_pid, main_action_pid,main_is_disabled_pid);
                $propertyValueArray = array($value['menu_id'], $value['parent_menu_id'], $value['menu'], $value['description'], $value['icon_class'], $value['menu_type'], $value['order'], $value['is_display'], $value['is_active'], $value['is_dual'], $value['dual_icon_class'], $value['data_href'], $value['shortcut_icon'], $value['controler'], $value['action'],0);
                $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnJsonArray['node_instance_id'], $returnJsonArray['node_type_id'],'N',array(),"");
                // For create relation between instance
                $this->getStructureTable()->createRelation($parentInstanceId, array($returnJsonArray['node_id']));
                if (is_array($value['child'])) {
                    $this->insertAgainSubMenu($returnJsonArray['node_id'], $value['child']);
                }
            }
        }
    }
}
