<?php

namespace RestfulApi\Controller;

use Administrator\Controller\Plugin\AwsS3;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container; // We need this when using sessions

class PuiApiController extends AbstractActionController {

    private $res = array();
    protected $storageType = STORAGE_NAME;
    private $errorMsg = array('1' => 'Network Error',
        '2' => 'System Error Was Occurred',
        '3' => 'Record Insertion Error',
        '4' => 'Record Retreve Error',
        '5' => 'Record Updation Error',
        '6' => 'Record Deletion Error',
    );
    private $sucessMsg = array('1' => 'Record Insert Sucessfully',
        '2' => 'Record Retrive Sucessfully',
        '3' => 'Record Update Sucessfully',
        '4' => 'Record Delete Sucessfully',
        '5' => 'Send records Sucessfully',
        '6' => 'User Logged In Sucessfully'
    );
    private $actionArray = array('1' => 'Insert',
        '2' => 'Retrive',
        '3' => 'Update',
        '4' => 'Delete',
        '5' => 'List',
        '6' => 'Structure',
        '7' => 'Create Relation',
        '8' => 'Login'
    );
    private $structureArray = array('1' => 'Classes',
        '2' => 'Class',
        '3' => 'Properties',
        '4' => 'Property',
        '5' => 'Instances',
        '6' => 'Instance',
        '7' => 'InstanceProperties',
        '8' => 'InstanceProperty',
        '9' => 'Relation',
        '10' => 'Dialogue'
    );
    private $resultCodeArray = array('Fail' => 1,
        'Success' => 0,
    );
    protected $helperObj;

    public function errorReturn() {
        $this->res['result'] = $this->resultCodeArray['Fail'];
        $this->res['msg'] = $this->errorMsg['2'];
        return $this->res;
    }

    public function getHelperObj() {
        if (!$this->helperObj) {
            $viewHelperManager = $this->getServiceLocator()->get('ViewHelperManager');
            $this->helperObj = $viewHelperManager->get('prospus');
        }
        return $this->helperObj;
    }

    public function getClassesTable() {
        if (!$this->classesTable) {
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    }

    public function getCourseDialogueTable() {
        if (!$this->coursedialogueTable) {

            $sm = $this->getServiceLocator();
            $this->coursedialogueTable = $sm->get('Administrator\Model\CourseDialogueTable');
        }
        return $this->coursedialogueTable;
    }

    public function getStructureTable() {
        if (!$this->getStructureTable) {

            $sm = $this->getServiceLocator();
            $this->getStructureTable = $sm->get('Administrator\Model\StructureBuilderTable');
        }
        return $this->getStructureTable;
    }

    public function getStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Structure') {
                $node_id = $post['node_id'];
                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Class') {
                    $this->res['data'] = $this->getHelperObj()->getStructure($node_id, $structure);
                }

                if ($structure == 'Instance') {
                    $this->res['data'] = $this->getHelperObj()->getStructureOfInstance($node_id, $structure);
                }
            }

            if ($this->actionArray[$post['action_id']] == 'List') {
                $node_id = $post['node_id'];
                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Instances') {
                    $this->res['data'] = $this->getHelperObj()->getStructure($node_id, $structure);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function setStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];
                $is_array = (isset($post['is_array'])) ? true : false;

                if ($structure == 'Instance') {
                    $this->res['data'] = $this->getHelperObj()->setStructure($data, $structure);
                }
            }

            if ($this->actionArray[$post['action_id']] == 'Create Relation') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];
                if ($structure == 'Relation') {
                    $this->res['data'] = $this->getHelperObj()->setStructure($data, $structure);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /* code here to added chat Statement data in instance node data table with sub class */

    public function setStatementAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {
                /* $post['data']['node_class_id']  = 90;
                  $post['data']['node_id']  		= 2607; */

                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Instance') {
                    $allClassPropertyStruecture = $this->getHelperObj()->getStructure('2607', 'Class');


                    $this->res['data'] = $this->getHelperObj()->setStatement($data, $structure, $allClassPropertyStruecture);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /* end code here */

    /* code here use to get chat structure details */

    public function getStatementStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Structure') {

                $structure = $this->structureArray[$post['structure_id']];


                if ($structure == 'Instances') {
                    $this->res['data'] = $this->getHelperObj()->getNodeInstanceStructure($structure, $post['chat_room_id'], $post['startFrom'], $post['limit'], $post['dateTime']);
                }
            }


            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /* end code here */

    /**
     * Function to get the statement count associated with dialogue
     * Created by Arti Sharma for vesselwise
     */
    public function getStatementCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $data_post = $post['data'];


            $this->res['data'] = $this->getHelperObj()->getSatementCountInfo($data_post);



            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to get the all the dialogue associate with logged in user.
     * Created by Arti Sharma
     */
    public function getDialogueByUserAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Structure') {

                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Dialogue') {
                    // $this->res['data'] = $this->getHelperObj()->getAllDialogue($post['variable_data'], $structure);
                    $this->res['data'] = $this->getAllDialogueByCourseId($post['variable_data']);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function updateDialogTitleAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Update') {
                $variable_data = $post['variable_data'];

                $this->res['data'] = $this->getHelperObj()->updateDialogTitle($variable_data);
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['3'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to get all the dialogue actor list
     */
    public function getDialogueActorListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Retrive') {
                $dialog_instance_node_id = $post['dialog_instance_node_id'];

                $this->res['data'] = $this->getHelperObj()->getDialogueActor($dialog_instance_node_id);
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['3'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to add the dialogue actor list
     */
    public function getAllUserListDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $variable_data = $post['variable_data'];

                $this->res['data'] = $this->getHelperObj()->getAllUserList($variable_data);
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['3'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to add the dialogue actor list
     */
    public function removeUserFromFileTempAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $dialog_data = $post['dialog_data'];

                $this->res['data'] = $this->getHelperObj()->removeUserFromFile($dialog_data);
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['3'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to add the dialogue actor list
     */
    public function saveNewActorNodeAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $dialog_data = $post['dialog_data'];

                $this->res['data'] = $this->getHelperObj()->saveNewDialogueActor($dialog_data);
                $user_node = $post['dialog_data']['user_instance_node_id'] . $post['dialog_data']['current_user_node_id'];
                // update course user_course_data file 
                $temp = explode(',', $user_node);
                for ($i = 0; $i < count($temp); $i++) {

                    $variable_data['user_instance_node_id'] = $temp[$i];

                    $this->writeCourseInfoInFile($variable_data);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['3'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function checkUserAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $userData = array();
            if ($this->actionArray[$post['action_id']] == 'Login') {
                $userData = $this->getHelperObj()->loginUser($post['data']);
            }
            if (count($userData) > 0) {
                $this->res['data'] = $userData;
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['6'];
            } else {
                $this->res['data'] = '';
                $this->res['result'] = 1;
                $this->res['msg'] = 'Email address or password are invalid.';
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to save all the instances of the statement and associate it to the particular dialog.
     * Created by Arti Sharma
     */
    public function saveInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $data = $post['data'];

                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Instance') {
                    $jsonArray = json_decode($data, true);
                    ///$this->res['data']	= $data;
                    $this->res['data'] = $this->getHelperObj()->saveStatement($data, $structure);
                    $variable_data['course_instance_node_id'] = $jsonArray['course_instance_node_id'];

                    $temp = explode(',', $jsonArray['user_node']);
                    for ($i = 0; $i < count($temp); $i++) {

                        $variable_data['user_instance_node_id'] = $temp[$i];

                        $this->writeCourseInfoInFile($variable_data);
                    }
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to save all the instances of the statement and associate it to the particular dialog.
     * Created by Arti Sharma
     */
    public function getStatementDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Retrive') {

                $this->res['data'] = $this->getHelperObj()->getStatement($post['dialog_instance_node_id'], $post['date_obj']);
            }
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    /**
     * Function to save all the instances of the dialogue.
     * Created by Arti Sharma
     */
    public function saveNewDialogNodeAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {

                $this->res['data'] = $this->getHelperObj()->saveNewDialog($post['dialog_data']);
                // update course user_course_data file 
                $temp = explode(',', $post['dialog_data']['user_instance_node_id']);
                for ($i = 0; $i < count($temp); $i++) {

                    $variable_data['user_instance_node_id'] = $temp[$i];

                    $this->writeCourseInfoInFile($variable_data);
                }
            }
            //$this->res['data'] = $dd;
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function searchCourseAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Retrive') {

                $this->res['data'] = $this->getHelperObj()->searchCourseTitle($post['search_data']);
            }
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getRandomNodeIdAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Retrive') {

                $this->res['data'] = $this->getHelperObj()->generateRandomNodeId();
            }
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function deleteStatementDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Delete') {

                $this->res['data'] = $this->getHelperObj()->deleteStatement($post['delete_data']);
            }
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function searchDialogDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            //$this->res['data'] = $this->getHelperObj()->searchDialog($post['dialog_data']);
            $user_instance_node_id = $post['dialog_data']['user_instance_node_id'];
            $variable_data['user_instance_node_id'] = $user_instance_node_id;
            $search_string = $post['dialog_data']['search_string'];

            $cachedData = $this->readCourseDataFromFile($variable_data);

            if ($cachedData != "") {
                $required_res = $cachedData;
            } else {
                $required_res = $this->writeCourseInfoInFile($post['variable_data']);
            }

            $courseArray = array();
            $final_ary = array();
            foreach ($required_res as $return_res) {
                if ($return_res['status'] != 0) {
                    //$courseArray[$return_res['course_instance_node_id']]['course_title'] = $return_res['value'][0];
                    // $courseArray[$return_res['course_instance_node_id']]['course_instance_node_id'] = $return_res['course_instance_node_id'];
                    //	$courseArray[$return_res['course_instance_node_id']]['search_info'] = $return_res['search_info'];					

                    $course_id = $return_res['course_instance_node_id'];
                    $course_title = $return_res['value'][0];


                    $final_ary[$course_id]['course_title'] = $return_res['value'][0];
                    $final_ary[$course_id]['course_instance_node_id'] = $return_res['course_instance_node_id'];
                    $final_ary[$course_id]['user_name'] = $return_res['user_name'];
                    $final_ary[$course_id]['user_id'] = $return_res['user_id'];
                    $final_ary[$course_id]['node_instance_property_id'] = $return_res['node_instance_id'];
                    $final_ary[$course_id]['updated_timestamp'] = $return_res['value'][3];
                    $final_ary[$course_id]['status'] = $return_res['status'];

                    $final_ary[$course_id]['search_data'] = $course_title;

                    $variable_data['user_instance_node_id'] = $user_instance_node_id;
                    $variable_data['course_instance_node_id'] = $course_id;
                    $dialog_ary = $this->getStructureTable()->getCourseDilogueFromFile($variable_data);
                    if (!empty($dialog_ary)) {
                        $tempary = explode(',', $dialog_ary[0]['dialogue_instance_node_id']);

                        for ($j = 0; $j < count($tempary); $j++) {
                            if ($tempary[$j]) {
                                $dialog_info = $this->getStructureTable()->getDilogueDataFromFile($tempary[$j], $variable_data);
                                if (!empty($dialog_info)) {
                                    $final_ary[$course_id]['dialog_data'] = '1';

                                    $dialog_info[0]['search_data'] = $course_title . ',' . $dialog_info[0]['dialog_title'];

                                    $final_ary[$course_id][] = $dialog_info[0];
                                }
                            }
                        }
                    }
                }
            }

            $results = array();
            $course_ary = array();
            $data_final = array();
            // return $final_ary;
            if ($search_string != '') {
                $search_string = preg_replace('!\s+!', ' ', $search_string);
                $i = 0;
                foreach ($final_ary as $keydata => $subarray) {
                    //return $subarray['search_data'];
                    $temp_ary = array();
                    $course_ary[$keydata] = array();
                    if ($subarray['dialog_data'] == '1') {
                        foreach ($subarray as $key => $value) {

                            if (!is_array($value)) {
                                $temp_ary[$key] = $value;
                                //$course_ary[$keydata] = $temp_ary;
                            }

                            $hasValue = false; //return $course_ary;
                            if (is_array($value)) {

                                foreach ($value as $k => $data_ary) {

                                    if ($k == 'search_data') {
                                        if (!is_numeric($data_ary)) {
                                            $data_ary = strtolower($data_ary);

                                            $data_ary = preg_replace('!\s+!', ' ', $data_ary);

                                            $search_string = strtolower($search_string);

                                            if (strpos($data_ary, $search_string) !== false)
                                                $hasValue = true;
                                        }
                                    }
                                }
                                if ($hasValue) {
                                    //  return $temp_ary;
                                    if (!empty($temp_ary)) {
                                        $course_ary[$keydata] = array();
                                        $course_ary[$keydata] = $temp_ary;
                                        $temp_ary = array();
                                    }
                                    //$course_ary[$keydata] = $temp_ary;
                                    $course_ary[$keydata][] = $value;

                                    $results = $course_ary;
                                    //array_push($results,$course_ary);
                                }
                            }
                        }
                    } else {
                        $hasValue = false;

                        foreach ($subarray as $key => $value) {
                            if ($key == 'search_data') {
                                if (!is_numeric($value)) {
                                    $value = strtolower($value);

                                    $value = preg_replace('!\s+!', ' ', $value);

                                    $search_string = strtolower($search_string);

                                    if (strpos($value, $search_string) !== false)
                                        $hasValue = true;
                                }
                            }
                        }
                        if ($hasValue)
                        //$results[] = $subarray;
                            array_push($course_ary, $subarray);
                        $results = $course_ary;
                    }
                }
            }
            else {
                $results = $final_ary;
            }

            $this->res['data'] = $results;

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function deleteNotificationCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->deleteNotification($post['dialog_data']);


            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function deleteDilaogueDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->deleteDilaogue($post['dialog_data']);


            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getAllSystemActorDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->getAllSystemActor($post['dialog_data']);

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to get all the courses of logged in user
     */
    public function getAllCourseDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            //$this->res['data'] = $this->getHelperObj()->getAllCourseData($post['variable_data']); // commented by arti

            $cachedData = $this->readCourseDataFromFile($post['variable_data']);

            if ($cachedData != "") {
                $required_res = $cachedData;
            } else {
                $required_res = $this->writeCourseInfoInFile($post['variable_data']);
            }
            $this->res['data'] = $required_res;
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * Function to read course info from mamcache file by logged in user id 
     */
    public function readCourseDataFromFile($variable_data) {
        $user_instance_node_id = $variable_data['user_instance_node_id'];
        //$manager = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage('file');
        $file_name = 'user_course_data_' . $user_instance_node_id;
        $class_list_file_name = strtolower($file_name);
        $awsObj         = new AwsS3();
        return $cachedData = $awsObj->getFileData($class_list_file_name);
        //return $cachedData = $manager->read($class_list_file_name);
    }

    /**
     * Function to write all course info of user into mamcache file
     */
    public function writeCourseInfoInFile($variable_data) {


        $user_instance_node_id = $variable_data['user_instance_node_id'];
        //$manager = $this->getServiceLocator()->get('MemorySharedManager');
        //$manager->setStorage('file');

        $config = $this->getServiceLocator()->get('config');
        $course_class_id = $config['constants']['COURSE_CLASS_ID'];
        $production_title = $config['constants']['PRODUCT_TITLE'];
        $course_timeStamp = $config['constants']['COURSE_TIMESTAMP_ID'];

        $coursePropertiesArray = $this->getClassesTable()->getPropertiesCourse($course_class_id);
        $course_title_id = $coursePropertiesArray[3]['node_class_property_id'];
        $adminId = $user_instance_node_id;
        $order_by = 'node_instance_id';
        $order = 'DESC';
        $filter_operator = '';
        $search_text = '';
        $filter_field = '';

        $instanceArray = $this->getClassesTable()->fetchNodeInstanceCourse($course_class_id, $course_title_id, $order_by, $order, $filter_operator, $search_text, $filter_field, $production_title, $course_timeStamp, $adminId);
        $newTempArr = array();
        $valueTempArr = array();

        foreach ($instanceArray as $key => $value) {

            $new_val = $value['value'];
            unset($value['value']);
            $value['value'][] = $new_val;

            if (array_key_exists($value['course_instance_node_id'], $newTempArr)) {

                $newTempArr[$value['course_instance_node_id']]['value'][] = $new_val;
            } else {

                $newTempArr[$value['course_instance_node_id']] = $value;
                $variable_data['course_instance_node_id'] = $value['course_instance_node_id'];
                $user_details = $this->getCourseDialogueTable()->getActorInstances($variable_data);

                $newTempArr[$value['course_instance_node_id']]['user_name'] = $user_details['user_name'];
                $newTempArr[$value['course_instance_node_id']]['user_id'] = $user_details['user_id'];
                $newTempArr[$value['course_instance_node_id']]['search_info'] = $value['value'][0] . ' ' . $user_details['user_name'];
            }
        }
        $file_name = 'user_course_data_' . $user_instance_node_id;
        // AWS S3
        $awsObj         = new AwsS3();
        $awsObj->setFileData("data/perspective_cache/$file_name", json_encode($newTempArr), "text");
        //$manager->write($file_name, $newTempArr);
        return $newTempArr;
    }

    /**
     * Function to get all the dialogue
     *
     */
    public function getAllDialogueByCourseId($variable_data) {

        $cachedData = $this->readDialogueDataFromFile($variable_data);

        if ($cachedData != "") {
            $required_res = $cachedData;
        } else {
            $required_res = $this->writeDialoueInfoInFile($variable_data);
        }

        return $required_res;
    }

    /**
     * Function to read dialogue info from mamcache file by course id
     */
    public function readDialogueDataFromFile($variable_data) {
        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage('file');
        $file_name = 'cache_course_dialog_' . $course_instance_node_id;
        $class_list_file_name = strtolower($file_name);
        return $cachedData = $manager->read($class_list_file_name);
    }

    /**
     * Function to write all course info of user into mamcache file
     */
    public function writeDialoueInfoInFile($variable_data) {
        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage('file');


        return $this->getStructureTable()->getAllDialogueInstancesByCourse($variable_data);
        $file_name = 'cache_course_dialog_' . $course_instance_node_id;
        $manager->write($file_name, $newTempArr);
        return $newTempArr;
    }

    public function checkEmailExistDataAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->checkEmailAlreadyExist($post['email_address']);


            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getMenuStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $domain_name = $post['domain_name'];

            $this->res['data'] = $this->getHelperObj()->getStructure($domain_name, 'Instance');
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getPluginStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $domain_name = $post['domain_name'];

            $this->res['data'] = $this->getHelperObj()->getStructure($domain_name, 'PluginStructure');
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['5'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function registerVwAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $node_y_id = '';
            $node_x_id_array = array();

            /* For Individual Class */
            $dataArray = array();
            $dataArray['node_class_id'] = '7';
            $dataArray['node_class_property_id'] = array('48', '49');
            $dataArray['value'] = array($post['first_name'], $post['last_name']);
            $dataArray['is_email'] = 'N';
            $node_y_id = $this->getHelperObj()->setStructure($dataArray, 'Instance');

            /* For Role Class */
            $dataArray = array();
            $dataArray['node_class_id'] = '9';
            $dataArray['node_class_property_id'] = array('57', '56', '79', '80');
            $dataArray['value'] = array('VesselWise.SalesRepresentative', 'VesselWise', $post['first_name'] . " " . $post['last_name'], date('Y-m-d h:i:s'));
            $dataArray['is_email'] = 'N';
            $node_x_id_array[] = $this->getHelperObj()->setStructure($dataArray, 'Instance');

            /* For Account Class */
            $dataArray = array();
            $dataArray['node_class_id'] = '8';
            $dataArray['node_class_property_id'] = array('52', '53');
            $dataArray['value'] = array($post['email'], $post['password']);
            $dataArray['is_email'] = 'N';
            $node_x_id_array[] = $this->getHelperObj()->setStructure($dataArray, 'Instance');

            /* For X Y Relation Of Instances */
            $newArray['node_y_id'] = $node_y_id;
            $newArray['node_x_ids'] = $node_x_id_array;
            $this->getHelperObj()->setStructure($newArray, 'Relation');

            $this->res['data'] = array('email' => $post['email'], 'password' => $post['password'], 'pui_id' => $node_y_id, 'status' => 1);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getFormStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['node_id']) > 0 && trim($post['node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getFormStructure($post['node_id']);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getDataOfMenuInstanceAction() {
        $layout                                         = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                        = $this->getRequest();

        if ($request->isPost()) {
            $post                                       = $request->getPost()->toArray();

            if (intval($post['node_id']) > 0 && trim($post['node_id']) != "") {
                $menuArray                              = $this->getHelperObj()->getDataOfMenuInstance($post['node_id']);
                $menu                                   = current($menuArray)['menu'];
                $tempMenu                               = $this->getParentAndChildMenus($menu);
                $mainMenuArray                          = array();
                $subMenuArray                           = array();
                $realMenuArray                          = array(); 

                foreach ($tempMenu as $key => $value) 
                {
                    if (intval($value['parent']) == 0)
                        $mainMenuArray[]                = $value;
                    else
                        $subMenuArray[$value['parent']][]       = $value;
                }

                $tempmainMenu                           = $this->getAllProperty($mainMenuArray, $subMenuArray, $realMenuArray);
                $this->res['data']                      = $this->getHelperObj()->getFilterMenuCounts($tempmainMenu);
                $this->res['result']                    = $this->resultCodeArray['Success'];
                $this->res['msg']                       = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getAllProperty($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            if (strtolower($value['status']) != 'hidden') {
                $menuArray[$value['id']] = $value;
                $childArray = array();
                if (is_array($menu2[$value['id']])) {
                    $menuArray[$value['id']]['child'] = $this->getAllProperty($menu2[$value['id']], $menu2, $childArray);
                }
            }
        }
        return $menuArray;
    }

    public function getParent($highestLevel, $newMenuArray) {
        $parentId = 0;
        foreach ($newMenuArray as $key => $itemArray) {
            if (intval($itemArray['level']) == intval($highestLevel) - 1) {
                $parentId = intval($newMenuArray[$key]['id']);
            }
            if (intval($itemArray['level']) == intval($highestLevel) && intval($highestLevel) != 1) {
                $newMenuArray[$key]['parent'] = $parentId;
            }
        }

        return $newMenuArray;
    }

    public function getParentAndChildMenus($menu) {
        $newMenuArray = array();
        $index = 0;
        $highestLevel = 1;
        foreach ($menu as $intanceId => $itemArray) {
            if (intval($itemArray['level']) == 1) {
                $itemArray['id'] = $intanceId;
                $itemArray['parent'] = 0;
            } else {
                $itemArray['id'] = $intanceId;
            }

            if (intval($highestLevel) < intval($itemArray['level']))
                $highestLevel = intval($itemArray['level']);

            $newMenuArray[$index] = $itemArray;
            $index++;
        }

        for ($i = $highestLevel; $i > 1; $i--)
            $newMenuArray = $this->getParent($i, $newMenuArray);

        return $newMenuArray;
    }

    public function getListHeaderAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0 && trim($post['class_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getListHeader($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getDataOfListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0 && trim($post['class_node_id']) != "") {
                $this->res['data'] = json_decode($this->getHelperObj()->getDataOfList($post),true);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getFiQuoteValueAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (intval($post['deal_node_id']) > 0 && trim($post['deal_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getFiQuoteValue($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function updateDealPhaseAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (intval($post['node_instance_id']) > 0 && trim($post['node_instance_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->updateDealPhase($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getPropertyInstanceWithCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0 && trim($post['class_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getPropertyInstanceWithCount($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
                $this->res['status'] = '1';
                
            } else {
                $this->res['status'] = '0';
                $this->res['message'] = $this->errorReturn();
                
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getDealAppOneInfoAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (intval($post['deal_node_id']) > 0 && trim($post['deal_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getDealAppOneInfo($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getDealOperationInfoAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (intval($post['deal_node_id']) > 0 && trim($post['deal_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getDealOperationInfo($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getMenuCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0 && trim($post['class_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getMenuCount($post); //print_r($data);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getFilterCountsAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (count($post) >= 3) {
                $this->res['data'] = $this->getHelperObj()->getFilterCounts($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getInstanceViewStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['node_id']) > 0) {
                $this->res['data'] = $this->getHelperObj()->getInstanceViewStructure($post['node_id']);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getInstanceEditStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['instance_id']) > 0) {
                $this->res['data'] = $this->getHelperObj()->getInstanceViewStructure($post['instance_id']);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getInstancesOfOperationRoleAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0) {

                $this->res['data'] = $this->getHelperObj()->getInstancesOfOperationRole($post['class_node_id'], $post['login_role_id'], $post['instance_id']);

                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getActorListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (trim($post['search_string']) != '') {
                $this->res['data'] = $this->getHelperObj()->getActorList($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /**
     * 
     * 
     */
    public function deleteInstanceAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->deleteInstance($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getActorWithRoleAndDealAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (trim($post['instanceId']) != '') {
                $this->res['data'] = $this->getHelperObj()->getActorWithRoleAndDeal($post['instanceId']);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getOperationListByRoleAndDealPaymentTypeAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (trim($post['deal_actor_role_node_id']) != '') {
                $this->res['data'] = $this->getHelperObj()->getOperationListByRoleAndDealPaymentType($post); //print_r($data);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getDocumentDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (trim($post['document_node_id']) != '') {
                $this->res['data'] = $this->getHelperObj()->getDocumentData($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getFileRulesetArrayAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {

            $post = $request->getPost()->toArray();
            /*
             * Get file node id array to 
             */
            foreach ($post['css_node_id'] as $cssKey => $cssFileNodeId) {
                if (trim($cssFileNodeId) != '') {
                    $this->res[$cssFileNodeId] = $this->getHelperObj()->getFileRulesetArray($cssFileNodeId);
                    //return file name and location of parsing css file
                    //Added by:- Gaurav Dutt Panchal
                } else {
                    $this->errorReturn();
                }
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function setDocumentStructureAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Instance') {
                    $this->res['data'] = $this->getHelperObj()->setDocumentStructure($data, $structure);
                }
            }

            if ($this->actionArray[$post['action_id']] == 'Create Relation') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];
                if ($structure == 'Relation') {
                    $this->res['data'] = $this->getHelperObj()->setDocumentStructure($data, $structure);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getAllClassInstanceAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($post['nodeId'] != '') {
                $this->res['data'] = $this->getHelperObj()->getAllClassInstance($post);
                //$this->res['result'] = $this->resultCodeArray['Success'];
                //$this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res['data']);
        exit;
    }

    public function getInstanceDataByPropertyValueAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (!empty($post)) {
                $this->res['data'] = $this->getHelperObj()->getInstanceDataByPropertyValue($post);
                //$this->res['result'] = $this->resultCodeArray['Success'];
                //$this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res['data']);
        exit;
    }

    public function manageInstanceBySpreadsheetAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (!empty($post)) {
                $this->res['data'] = $this->getHelperObj()->manageInstanceBySpreadsheet($post);
                //$this->res['result'] = $this->resultCodeArray['Success'];
                //$this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res['data']);
        exit;
    }

    public function manageInstanceFileBySpreadsheetAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if (!empty($post)) {
                $this->res['data'] = $this->getHelperObj()->manageInstanceFileBySpreadsheet($post);
                //$this->res['result'] = $this->resultCodeArray['Success'];
                //$this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res['data']);
        exit;
    }

    public function getNewNodeIdAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        $this->res['data'] = $this->getHelperObj()->getNewNodeId();
        $this->res['result'] = $this->resultCodeArray['Success'];
        $this->res['msg'] = $this->sucessMsg['1'];

        if ($this->res['data'] == '') {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function checkMappingDealOperationNodeIDAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (isset($post)) {
                $this->res['data'] = $this->getHelperObj()->checkMappingDealOperationNodeID($post);
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res['data']);
        exit;
    }

    public function getDealOperationFormIdAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getDealOperationFormId($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getMappingRoleActorStructureAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->getMappingRoleActorStructure($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getParticulerColumnValueAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getParticulerColumnValue($post['table'], $post['primary_col'], $post['primary_val'], $post['return_val']);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getUserProfileAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getUserProfile($post['node_id'], $post['node_class_id']);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getRoleNameAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getRoleName($post['role_id']);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getEmailTemplateAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getEmailTemplate($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getWkPdfAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getWkPdf($post);
            $this->res['status'] = '1';
            $this->res['message'] = '';
        } else {
            
            $this->res['status'] = '0';
            $this->res['message'] = $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getReportPdfAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getReportPdf($post);
            $this->res['status'] = '1';
            $this->res['message'] = '';
        } else {
            $this->res['status'] = '0';
            $this->res['message'] = $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getInstanceListOfParticulerClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getInstanceListOfParticulerClass($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getTableColsAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getTableCols($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function updateOperationStatusAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->updateOperationStatus($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getInstanceIdByTwoValueAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getInstanceIdByTwoValue($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data'][0]);
        exit;
    }

    public function callMappingAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->callMapping($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getClassDetailFromPropertyAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getClassDetailFromProperty($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    function sort_array_of_array(&$array, $subfield, $type) {
        // calling way
        //$this->sort_array_of_array($mainAry, 'admin');
        $sortarray = array();
        foreach ($array as $key => $row) {
            $sortarray[$key] = $row[$subfield];
        }
        array_multisort($sortarray, $type, $array);
        return $array;
    }

    public function publishDealAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->publishDeal($post);
            $this->res['result'] = $this->res['data'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    /*

     * Created By: Divya
     * Purpose: Create a web service for PU App.
     */

    public function webservicesAction() {
        $layout = $this->layout();

        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            
        } else if ($request->isGet()) {
            $requestData = array();
            $json = array();
            $method = 'get';
            $post = $this->params()->fromQuery();



            /* to authenticate user login */

            if (intval($post['action_id']) == 8 && trim($post['emailaddress']) != '' && trim($post['password']) != '') {
                $requestData['data']['node_class_property_id_emailaddress'] = 2932;
                $requestData['data']['node_class_property_id_password'] = 2933;
                $requestData['data']['emailaddress'] = $post['emailaddress'];
                $requestData['data']['password'] = $post['password'];
                $requestData['data']['node_id'] = 275709;

                $returnResponse = $this->getHelperObj()->loginUser($requestData['data']);
                $returnArray['data'] = $returnResponse;



                if (count($returnArray['data']) > 0) {


                    $roleDD = array();
                    $roleDD['Prospus'][] = 'Guest';
                    $cRoleDD = '';
                    $current_role = '';
                    $_RoleName = '';



                    if (count($returnArray['data']['rolesArray']) > 0) {
                        $current_role = current($returnArray['data']['rolesArray'])['id'];
                        foreach ($returnArray['data']['rolesArray'] as $roleId => $roleName) {
                            if (trim($returnArray['data']['domain']) == 'www.marinemax.com') {
                                $_RoleName = 'MarineMax';
                            }
                            /* else if( trim($returnArray['data']['domain']) == 'VesselWise' )
                              {
                              $_RoleName = 'VesselWise';
                              } */



                            if (intval($roleName['id']) != intval($current_role) && trim($roleName['name']) != '') {
                                
                            } else {
                                $cRoleDD = $roleName['name'];
                            }

                            $roleDD[$_RoleName][] = $roleName['name'];
                        }
                    }

                    $returnArray['data']['current_role'] = $current_role;


                    unset($returnArray['data']['rolesArray']);

                    $json['roles'] = $roleDD;
                    $json['crole'] = $cRoleDD;
                    $json['user'] = $returnArray['data'];
                    //$_SESSION['user']   =   $returnArray['data'];

                    $json['result'] = 1;
                    $json['msg'] = $this->sucessMsg['6'];
                    $json['code'] = '200';
                } else {
                    $json['data'] = '';
                    $json['result'] = 0;
                    $json['msg'] = 'Email address or password are invalid.';
                    $json['code'] = '200';
                }
            } else if (isset($post['user_id']) && intval($post['user_id']) > 0) {
                /* to fetch all course and dialogue data of particular user */
                if (intval($post['action_id']) == 2 && intval($post['user_id']) > 0 && trim($post['action']) == 'course') {
                    $returnArray_data_node_id = $post['user_id'];
                    $json['courses'] = $this->getHelperObj()->fetchAllCourseData($returnArray_data_node_id);
                    $json['result'] = 1;
                    $json['msg'] = $this->sucessMsg['2'];
                    $json['code'] = '200';
                    $_SESSION['courses'] = $json['courses'];
                }
                /* to fetch all statement data of particular user */ else if (intval($post['action_id']) == 2 && intval($post['user_id']) > 0 && trim($post['action']) == 'dialogue') {
                    $returnArray_data_node_id = $post['user_id'];
                    $courseData = $_SESSION['courses'];
                    $json['dialogues'] = $this->getHelperObj()->fetchAllDialogueData($returnArray_data_node_id, $courseData);
                    $json['result'] = 1;
                    $json['msg'] = $this->sucessMsg['2'];
                    $json['code'] = '200';
                }
            }
            /* to fetch all statement data of particular user */ else if (intval($post['action_id']) == 2 && intval($post['user_id']) > 0 && trim($post['action']) == 'dialogue') {
                $returnArray_data_node_id = $post['user_id'];
                $courseData = $_SESSION['courses'];
                $json['dialogues'] = $this->getHelperObj()->fetchAllDialogueData($returnArray_data_node_id, $courseData);
                $json['result'] = 1;
                $json['msg'] = $this->sucessMsg['2'];
                $json['code'] = '200';
            }
            /* To check wheather net is connected or not */ else if (trim($post['action']) == 'verifyNetConnection') {
                $result = 0;
                $connected = 'failed';
                $response = $this->getHelperObj()->isNetConnect();

                if (intval($response) == 1) {
                    $connected = 'success';
                    $result = 1;
                }

                $json['result'] = $result;
                $json['status'] = $connected;
                $json['code'] = '200';
            }
            /* To fetch all user list and their detail */ else if (intval($post['action_id']) == 2 && trim($post['action']) == 'getUsers') {
                $userList = $this->getHelperObj()->fetchAllUsersDetails();
                $json['user_all'] = $userList;
                $json['result'] = 1;
                $json['msg'] = $this->sucessMsg['2'];
                $json['code'] = '200';
            } else {

                $json = $this->errorReturn();
            }
        } else {
            $json = $this->errorReturn();
        }

        print json_encode($json);
        exit;
    }

    /* End Here */

    /** Created By: Gaurav Dutt Panchal
     * Purpose: Create a web service for PPC App for class data.
     */
    public function getWebServiceClassDataAction() {


        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {

            $json = array();
            $post = $request->getPost()->toArray();
            $classId = intval(trim($post['class_id']));

            if ($classId != '') {

                $display = 'no-pagination';
                $order_by = 'node_instance_id';
                $order = 'DESC';
                $filter_operator = '';
                $search_text = '';
                $filter_field = '';
                $clsInstanceData = array();
                $classPropertyArr = $this->getClassesTable()->getPropertyOfClass($classId);


                $className = $this->getClassesTable()->getClassNameByClassId($classId)['class_name'];
                $instanceArray = $this->getClassesTable()->getInstanceListByPagination($order, $order_by, $display, $classId, $filter_operator, $search_text, $filter_field);
                $incrementFlag = 0;
                foreach ($instanceArray as $key => $insValue) {
                    $nodeInstanceId = $insValue['node_instance_id'];
                    $clsInstanceData[$incrementFlag] = $this->getClassesTable()->getInstanceValueByWebService($nodeInstanceId, $classId, $classPropertyArr);
                    $clsInstanceData[$incrementFlag]['classID'] = trim($post['class_id']);
                    $clsInstanceData[$incrementFlag]['class'] = $className;
                    $incrementFlag++;
                }
                //$clsInstanceData = current($clsInstanceData);
                if(count($clsInstanceData)>0){
                    $json['data'] = $clsInstanceData;
                    $json['result'] = 1;
                    $json['msg'] = $this->sucessMsg['2'];
                    $json['code'] = '200';
                }else{
                    $json['data'] = '';
                    $json['result'] = 1;
                    $json['msg'] = 'No data found.';
                    $json['code'] = '200';
                }
                
            } else {

                    $json['data'] = '';
                    $json['result'] = 0;
                    $json['msg'] = $this->errorReturn();
                    $json['code'] = '200';
               
            }
        } else {
            
            $json['data'] = '';
            $json['result'] = 0;
            $json['msg'] = $this->errorReturn();
            $json['code'] = '200';

        }
        print json_encode($json);
        exit;
    }

    /*public function getWebServiceClassPropertyDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {

            $json = array();
            $post = $request->getPost()->toArray();
            $classId = intval(trim($post['class_id']));

            if ($classId != '') {
                $classPropertyArr = $this->getClassesTable()->getWebServicesClassStructure($classId);
                $json = $classPropertyArr;
            } else {

                $json = $this->errorReturn();
            }
        } else {

            $json = $this->errorReturn();
        }

        print json_encode($json);
        exit;
    }*/

    /**
     * Ger User Deals for web services
     */
    public function getUserDealsAction() {


       $request = $this->getRequest();

        if ($request->isPost()) {

            $json = array();
            $clsInstanceData = array();
            $post = $request->getPost()->toArray();
            $dealClsId = $post['deal_class_id'];
            $roleNameArr = $post['role_arr'];
            
            if ($dealClsId != '') {

                 $classPropertyArr = $this->getClassesTable()->getPropertyOfClass($dealClsId);
                 $mappingRoleArr = $this->getClassesTable()->getMappingRoleData($post);
          
                 
                $dealNodeId ='';
                foreach ($mappingRoleArr as $key => $insValue) {
                    
                    $dealNodeId = $insValue['deal_node_id'];   
                    $dealRoleId = $insValue['deal_role_id'];   
                    if($dealNodeId>0){
                        
                        $clsInstanceData[$dealNodeId]['role'][$dealRoleId]['role_id']   = $dealRoleId;
                        $clsInstanceData[$dealNodeId]['role'][$dealRoleId]['role_name'] = $roleNameArr[$dealRoleId];
                        $clsInstanceData[$dealNodeId]['deal_node_id'] = $dealNodeId;
                       
                    }
                    
                }
                
                foreach ($clsInstanceData as $key => $insValue) {
                    
                    $dealNodeId = $insValue['deal_node_id'];   
                    $nodeInstanceId = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $dealNodeId);
                    if($nodeInstanceId>0){
                        $clsInstanceData[$dealNodeId]['structure'] = $this->getClassesTable()->getInstanceValueByWebService($nodeInstanceId, $dealClsId, $classPropertyArr,'1');
                        $clsInstanceData[$dealNodeId]['deal_instance_id'] = $nodeInstanceId;
                        $clsInstanceData[$dealNodeId]['role'] = array_values($clsInstanceData[$dealNodeId]['role']);
                    }
                    
                }
                 $clsInstanceData = array_values($clsInstanceData);
                 $json['data'] = $clsInstanceData;
                 $json['result'] = 1;
                 $json['msg'] = $this->sucessMsg['2'];
                 $json['code'] = '200';
                
                
            } else {

                    $json['data'] = '';
                    $json['result'] = 0;
                    $json['msg'] = $this->errorReturn();
                    $json['code'] = '200';
               
            }
        } else {
            
            $json['data'] = '';
            $json['result'] = 0;
            $json['msg'] = $this->errorReturn();
            $json['code'] = '200';

        }
        print json_encode($json);
        exit;
    }
    
    /**
     * Ger User Operations for web services
     */
    public function getUserOperationsAction() {


        $request = $this->getRequest();

        if ($request->isPost()) {

            $json = array();
            $clsInstanceData = array();
            $post = $request->getPost()->toArray();
            $dealClsId = $post['deal_class_id'];
            $roleNameArr = $post['role_arr'];
            
            if ($dealClsId != '') {

                 $classPropertyArr = $this->getClassesTable()->getPropertyOfClass($dealClsId);
                 $mappingRoleArr = $this->getClassesTable()->getMappingRoleData($post);            
                 $incrementFlag = 0;
                 $dealNodeId ='';
                foreach ($mappingRoleArr as $key => $insValue) {
                    
                    $dealNodeId = $insValue['deal_node_id'];   
                    $dealRoleId = $insValue['deal_role_id'];   
                    if($dealNodeId>0){                        
                        $clsInstanceData[$dealNodeId]['role'][$dealRoleId]['role_id']   = $dealRoleId;
                        $clsInstanceData[$dealNodeId]['role'][$dealRoleId]['role_name'] = $roleNameArr[$dealRoleId];
                        $clsInstanceData[$dealNodeId]['deal_node_id'] = $dealNodeId;                      
                       
//                         $clsInstanceData[$dealNodeId]['role'][] = $dealRoleId;
//                         $clsInstanceData[$dealNodeId]['deal_node_id'] = $dealNodeId;
//                         $incrementFlag++;
                    }
                    
                }
                
                foreach ($clsInstanceData as $key => $insValue) {
                    
                    $dealNodeId = $insValue['deal_node_id'];   
                    $nodeInstanceId = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $dealNodeId);
                    if($nodeInstanceId>0){
                        $clsInstanceData[$dealNodeId]['structure'] = $this->getClassesTable()->getInstanceValueByWebService($nodeInstanceId, $dealClsId, $classPropertyArr,'1');
                        $clsInstanceData[$dealNodeId]['deal_instance_id'] = $nodeInstanceId;
                       // $clsInstanceData[$dealNodeId]['role'] = array_values($clsInstanceData[$dealNodeId]['role']);
                    }
                    
                }
                 $clsInstanceData = array_values($clsInstanceData);
                 $json['data'] = $clsInstanceData;
                 $json['result'] = 1;
                 $json['msg'] = $this->sucessMsg['2'];
                 $json['code'] = '200';
                
                
            } else {

                    $json['data'] = '';
                    $json['result'] = 0;
                    $json['msg'] = $this->errorReturn();
                    $json['code'] = '200';
               
            }
        } else {
            
            $json['data'] = '';
            $json['result'] = 0;
            $json['msg'] = $this->errorReturn();
            $json['code'] = '200';

        }
        print json_encode($json);
        exit;
    }
    /* End Here */

    public function insertClassPropertyAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            //$post              = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->insertClassProperty();
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    /* End Here */

    /*     * ***************START CODE BY-"GAUARV DUTT PANCHAL"**************** */
    /*     * ***************GET CLASS PROPERTY AND SUB-CLASSES ON VIEW MODE******************* */

    public function getSubClassStrLayoutViewAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $instance_status_array = array();
        $mode = '';
        $displayMode = 'view';

        if ($request->isPost()) {

            $post = $request->getPost()->toArray();


            $node_y_id = $post['node_y_id']; // '520826';
            $displayMode = $post['mode'];
            //$post['temp_instance_id'] = $temp_instance_id = '125975';

            if (true) {
                $classArray = $this->getClassesTable()->getClassList($post['class_id']);
                $dataArrayTemp = $this->getClassesTable()->getInstaceIdByNodeXYAndNodeInstance($node_y_id, $post['class_id']);


                $instance_id_array = array();
                foreach ($dataArrayTemp as $keytemp => $valueTemp) {
                    $instance_id_array[] = $this->getClassesTable()->getinstanceDetailsByNodeId($valueTemp['node_x_id']);
                }

                $tempdata = array();

                if (is_array($instance_id_array) && !empty($instance_id_array)) {

                    $data = $this->getClassesTable()->getClassChild($post['class_id']);
                } else {
                    $data = $this->getClassesTable()->getClassChild($post['class_id']);

                    $check_array = array();
                    $main_array = array();
                    $check_array[] = $post['class_id'];

                    $subClassArrayData = $this->getClassesTable()->getClassStructure($post['class_id']);
                    $current_number = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, 'instance', $subClassArrayData[0]['property']);

                    $currentNumber = intval($current_number) + intval($line_count_number) + 1 + 1;
                    $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', '', $data['data'], $currentNumber, $check_array, 'sub-instance');

                    $classArray['childsArray'][] = $numberPS;
                }


                $node_x_id_array = $this->getClassesTable()->getNodeXIdFromXYTable($node_y_id);
                //                echo "<pre>";
                //            print_R($node_x_id_array);exit;

                $classArray['instances'] = $this->getClassesTable()->getClassStructure($post['class_id']);
                $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);


                $count_sub_instance = $post['count_instance'];
                $count = ++$count_sub_instance;
                $key = 0;
                $countnum = 0;

                foreach ($node_x_id_array as $node_x_id) {
                    $node_instance_id = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $node_x_id);


                    if ($this->getClassesTable()->getClassIdByInstance($node_instance_id) == $post['class_id']) {

                        $classArray['subinstancesvalue'][$node_x_id] = $this->getClassesTable()->getNodeInstanceValueBy($node_instance_id);
                        $instance_status_array[$node_x_id] = $this->getClassesTable()->getNodeInstanceStatusBy($node_instance_id);

                        $tempArray = array();
                        $node_x_id_new_array[$key]['node_x_id'] = $node_x_id;


                        $instanceClassArray = array();

                        $node_x_ids = $node_x_id . ",";
                        $retArray = array();
                        $textArray = array();
                        $tempCount = 0;
                        $check_array = array();

                        $instanceArray = $this->getClassesTable()->getInstanceStructure($node_instance_id, 'Y');
                        $instanceArrayProp = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type = 'instance', $instanceArray['instances']['property']);
                        $currentNumber = intval($instanceArrayProp) + 1;

                        $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', $node_instance_id, $data['data'], $currentNumber, $check_array);
                        if (empty($numberPS)) {
                            $nextNum = intval($currentNumber) + 1;
                        } else {
                            $nextNum = intval($numberPS[count($numberPS) - 1]['nextNum']) + 1;
                        }


                        $node_x_id_new_array[$key]['number_print'] = $nextNum;
                        $classArray['childsArray'][] = $numberPS;

                        $countnum++;
                        $key++;
                    }
                }
            }
            $viewArr = array(
                //'temp_instance_id' => $post['temp_instance_id'], //
                'instance_status_array' => $instance_status_array,
                'node_x_id_array' => $node_x_id_new_array,
                'classArray' => $classArray,
                'count' => $count,
                'mode' => $mode, //
                'line_count_number' => $line_count_number,
                'resp_number_print' => $resp_number_print,
                'valueClassPropId' => $config['constants']['METHOD_VALUE_CP_ID'],
                'rootClassLabel' => base64_decode($post['sub_class_label']),
            );

        //            echo "<pre>";
        //            print_r($viewArr);
        //            exit;

            print $this->getSubCLassStructureLayoutView($viewArr, $displayMode);
            exit;
        }
    }

    /*     * ***************GET CLASS PROPERTY AND SUB-CLASSES ON ADD MODE**************** */

    public function getSubClassStrLayoutAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $instance_status_array = array();
        $mode = '';

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $json = array();


            $mode = $post['mode'];
            $node_y_id = $post['node_y_id'];
            $line_count_number = $post['line_count_number'] /* + 1 */;
            $resp_number_print = $post['resp_number_print'];
            $section_mode = ($post['section_mode']) ? ($post['section_mode']) : '';  //yes only for instance subclass structure


            $classArray = $this->getClassesTable()->getClassList($post['class_id']);
            $dataArrayTemp = $this->getClassesTable()->getInstaceIdByNodeXYAndNodeInstance($node_y_id, $post['class_id']);

            $instance_id_array = array();
            foreach ($dataArrayTemp as $keytemp => $valueTemp) {
                $instance_id_array[] = $this->getClassesTable()->getinstanceDetailsByNodeId($valueTemp['node_x_id']);
            }

            $tempdata = array();
            if (is_array($instance_id_array) && !empty($instance_id_array)) {
                $data = $this->getClassesTable()->getClassChild($post['class_id']);
            } else {
                $data = $this->getClassesTable()->getClassChild($post['class_id']);

                $check_array = array();
                $main_array = array();
                $check_array[] = $post['class_id'];

                $subClassArrayData = $this->getClassesTable()->getClassStructure($post['class_id']);
                $current_number = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, 'instance', $subClassArrayData[0]['property']);
                $currentNumber = intval($current_number) + intval($line_count_number) + 1 + 1;
                $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', '', $data['data'], $currentNumber, $check_array, 'sub-instance');
                $classArray['childsArray'][] = $numberPS;
            }
            $node_x_id_array = $this->getClassesTable()->getNodeXIdFromXYTable($node_y_id);
            $classArray['instances'] = $this->getClassesTable()->getClassStructure($post['class_id']);
            $node_id = $this->getClassesTable()->getNodeId('node-class', 'node_class_id', $post['class_id']);

            $count_sub_instance = $post['count_instance'];
            $count = ++$count_sub_instance;
            $key = 0;
            $countnum = 0;

            foreach ($node_x_id_array as $node_x_id) {
                $node_instance_id = $this->getClassesTable()->getInstanceId('node-instance', 'node_id', $node_x_id);
                // 1298, 1299, 1300

                if ($this->getClassesTable()->getClassIdByInstance($node_instance_id) == $post['class_id']) {

                    $classArray['subinstancesvalue'][$node_x_id] = $this->getClassesTable()->getNodeInstanceValueBy($node_instance_id);
                    $instance_status_array[$node_x_id] = $this->getClassesTable()->getNodeInstanceStatusBy($node_instance_id);
                    $tempArray = array();
                    $node_x_id_new_array[$key]['node_x_id'] = $node_x_id;
                    $instanceClassArray = array();
                    $node_x_ids = $node_x_id . ",";
                    $retArray = array();
                    $textArray = array();
                    $tempCount = 0;
                    $check_array = array();

                    $instanceArray = $this->getClassesTable()->getInstanceStructure($node_instance_id, 'Y');
                    $instanceArrayProp = $this->getClassesTable()->getCurrentInstanceCurrentNumber($mode, $is_type = 'instance', $instanceArray['instances']['property']);
                    $currentNumber = intval($instanceArrayProp) + 1;

                    $numberPS = $this->getClassesTable()->getNumberPrintStructure($mode, $is_type = 'instance', $node_instance_id, $data['data'], $currentNumber, $check_array);

                    if (empty($numberPS)) {
                        $nextNum = intval($currentNumber) + 1;
                    } else {
                        $nextNum = intval($numberPS[count($numberPS) - 1]['nextNum']) + 1;
                    }

                    $node_x_id_new_array[$key]['number_print'] = $nextNum;
                    $classArray['childsArray'][] = $numberPS;

                    $countnum++;
                    $key++;
                }
            }


            $resArr = array(
                //'temp_instance_id' => $post['temp_instance_id'],
                'instance_status_array' => $instance_status_array,
                'node_x_id_array' => $node_x_id_new_array,
                'classArray' => $classArray,
                'count' => $count,
                'mode' => $mode,
                'line_count_number' => $line_count_number,
                'resp_number_print' => $resp_number_print,
                'valueClassPropId' => '',
                'rootClassLabel' => $post['sub_class_label']
            );

            $mod = 'add';
            print $this->getSubCLassStructureLayout($resArr, $mod);
            exit;
        }
    }

    /*     * ***************RENDER HTML PROPERTY AND SUB-PROPERTY ON ADD MODE**************** */

    public function getSubCLassStructureLayout($mainArray, $mod) {

        $caption = "";
        $classArray = $mainArray['classArray'];
        $instancesArray = $classArray['instances'];
        $valueClassPropId = $mainArray['valueClassPropId'];
        $instance_status_array = $mainArray['instance_status_array'];

        $node_x_id_array = $mainArray['node_x_id_array'];
        $subinstancesvalueArray = $classArray['subinstancesvalue'];


        if (intval($classArray['encrypt_status']) == 1) {
            $caption = ''; //$this->encryption_decryption('mc_decrypt',array('decrypt' =>$classArray['caption'],'key' =>ENCRYPTION_KEY));
        } else {
            $caption = $classArray['caption'];
        }
        $html = '';

        $count = 1;
        $editTextNum = 0;

        foreach ($classArray['instances'] as $instance => $instanceArray) {
            $html = '<div class="list-detail-section">';

            if (count($instanceArray['property']) > 0) {
                $flag = 'Y';
                $html .= $this->getPropertySubClass($instanceArray['property'], $flag, $this, $subinstancesvalueArray[$parentInstanceId['node_x_id']], $parentInstanceId['node_x_id'], $valueClassPropId, $line_count_number, $mod);
            }



            // Get sub classes structure
            /* for subclasses */
            foreach ($classArray['childsArray'][$editTextNum] as $key => $val) {


                $caption2 = '';
                if (intval($val['encrypt_status']) == 1) {
                    $caption2 = ''; //$this->encryption_decryption('mc_decrypt', array('decrypt' => $val['caption'], 'key' => ENCRYPTION_KEY));
                } else {
                    $caption2 = $val['caption'];
                }
                $subClassLabel = $caption2;
                $subClassLabelNew = strtoupper($caption2) . '(s) (' . $val['child_node_id'] . ')';
                $number_diff = intval($val['nextNum']) - intval($val['currNum']);
                $count_number_print = $val['currNum'];
                if ($number_diff != 1) {
                    $expand_function = "getSubClassStructureLayout(" . $val['node_class_id'] . ", " . $val['child_node_id'] . ", 'Edit',this,'', '" . base64_encode($subClassLabel) . "',''," . $count_number_print . ")";
                    $in_active_class = 'active';
                    $in_active_style = 'style=""';
                } else {
                    $expand_function = '';
                    $in_active_class = 'inactive';
                    $in_active_style = 'style="pointer-events:none"';
                }
                $fName = "getSubClassStructureLayout(" . $val['node_class_id'] . ", " . $val['child_node_id'] . ", 'Edit',this,'', '" . base64_encode($subClassLabel) . "',''," . $count_number_print . ")";
                $golbalNum = intval($val['nextNum']);
                $html .= '<div class="cls-wrapper nested-layout cls-tree clearfix" data-parent-instance-node-id="" data-id="' . $val['node_class_id'] . '" data-cls-id="' . $val['node_class_id'] . '" data-mode="add" onclick="' . $fName . '">'
                        . '<a class="list-title-heading class-accordian " >'
                        . '<i class="fa fa fa-angle-up"></i>' . $caption2 . '</a>
                           <div class="collapse-wrapper hide" >
                              <div class="list-detail-section"><span style="cursor:pointer;" class="right manage-right-cls-action"><i class="prs-icon add hide"></i><i class="prs-icon icon_close confirm_remove_close hide"></i></span>
                             </div>
                            </div>';
                $html .= '</div>';
            }

            $html .= '<div>';

            if (is_array($value['child'])) {


                $html .= $this->getPropertySubClass($value['child'], $this, '', $node_sub_class_id, '', $valueClassPropId, $line_count_number, $mod);
            }
            $html .= '</div>';
            $html .= '</div>';
            $editTextNum++;
        }

        return $html;
    }

    /*     * ***************RENDER HTML PROPERTY AND SUB-PROPERTY ON VIEW MODE**************** */

    public function getSubCLassStructureLayoutView($mainArray, $displayMode) {

        $caption = "";
        $classArray = $mainArray['classArray'];
        $instancesArray = $classArray['instances'];
        $valueClassPropId = $mainArray['valueClassPropId'];
        $instance_status_array = $mainArray['instance_status_array'];

        $node_x_id_array = $mainArray['node_x_id_array'];
        $subinstancesvalueArray = $classArray['subinstancesvalue'];
        $textNum = 0;
        $parentClass = $classArray['caption'];
        $instanceCount = 1;

        //        echo "<pre>";
        //        print_r($mainArray);
        //        die();

        $html = '';

        if (count($node_x_id_array)) {

            foreach ($node_x_id_array as $key => $parentInstanceId) {

                foreach ($classArray['instances'] as $instance => $instanceArray) {
                    $instanceNodeId = $parentInstanceId['node_x_id'];
                    if (count($node_x_id_array) > 1) {
                        $html .= '<div class="list-detail-section property-wrapper" data-instance-id="' . $instanceNodeId . '" ><h2 class="headingTwo">' . trim($parentClass) . ' ' . $instanceCount . '</h2>';
                    } else {
                        $html .= '<div class="list-detail-section property-wrapper" data-instance-id="' . $instanceNodeId . '" >';
                    }

                    if (count($instanceArray['property']) > 0) {
                        $flag = 'Y';
                        $html .= $this->getPropertySubClassView($instanceArray['property'], $flag, $this, $subinstancesvalueArray[$parentInstanceId['node_x_id']], $valueClassPropId, $instance_status_array[$parentInstanceId['node_x_id']]['node_instance_id'], $count, $displayMode);
                    }

                    //<!--for subclasses-->

                    foreach ($classArray['childsArray'][$textNum] as $keys => $val) {


                        $caption2 = '';
                        if (intval($val['encrypt_status']) == 1) {
                            $caption2 = ''; //$this->encryption_decryption('mc_decrypt', array('decrypt' => $val['caption'], 'key' => ENCRYPTION_KEY));
                        } else {
                            $caption2 = $val['caption'];
                        }
                        $subClassLabel = $caption2;
                        $subClassLabelNew = strtoupper($caption2) . '(s) (' . $val['child_node_id'] . ')';



                        $fName = "getSubClassStructureLayout(" . $val['node_class_id'] . ", " . $val['child_node_id'] . ", 'View',this,'','','','')";
                        $instanceId = '';
                        //$parentInstanceNodeId = json_encode($parentInstanceId['node_x_id']);
                        $parentInstanceNodeId = $parentInstanceId['node_x_id'];

                        $instanceCount = 0;
                        $hasChildren = "";
                        $instanceVal = $this->getClassesTable()->fetchNodeXY($parentInstanceNodeId);
                        if ($instanceVal != '') {
                            $instanceArr = explode(",", $instanceVal);
                            $instanceCount = count($instanceArr);
                        }
                        if (!$instanceCount > 0 && $displayMode == 'view') {
                            $hasChildren = "inactive";
                        } elseif (!$instanceCount > 0 && $displayMode == 'edit') {
                            $displayMode = "add";
                            $parentInstanceNodeId = '';
                        }


                        $html .= '<div class="cls-wrapper nested-layout cls-tree clearfix ' . $hasChildren . ' " data-id="' . $val['node_class_id'] . '" data-cls-id="' . $val['node_class_id'] . '" data-mode="' . $displayMode . '" data-parent-instance-node-id="' . $parentInstanceNodeId . '" onclick="' . $fName . '">'
                                . '<a class="list-title-heading class-accordian " >'
                                . '<i class="fa fa fa-angle-up"></i>' . $caption2 . '</a>
				   <div class="collapse-wrapper hide" >
				  <div class="list-detail-section"><span style="cursor:pointer;" class="right manage-right-cls-action"><i class="prs-icon add hide"></i><i class="prs-icon icon_close confirm_remove_close hide"></i></span>
				   </div>
				</div>';
                        $html .= '</div>';
                        $textNum++;
                    }


                    $html .= '<div>';
                    if (is_array($value['child'])) {

                        $html .= $this->getPropertySubClassView($value['child'], $flag, $this, '', '', $instance_status_array[$parentInstanceId['node_x_id']]['node_instance_id'], $count, $displayMode);
                    }
                    $html .= '</div>';
                    $html .= '</div>';
                }

                $instanceCount++;
            }
        }






        return $html;
    }

    /*     * ***************GET PROPERTY AND SUB-PROPERTY ON ADD MODE**************** */

    function getPropertySubClass($propertyArray, $flag, $obj, $node_sub_class_ids, $temp_node_instance_ids, $valueClassPropId, $tempNo, $mod) {




        $html .= ' ';
        if (current($propertyArray)['caption'] == 'Properties') {

            if (!empty(current($propertyArray)['child'])) {

                $propArr = current($propertyArray)['child'];
                $propertyArray = $propArr;
            }
        }

        foreach ($propertyArray as $key => $value) {


            $caption1 = "";
            if (intval($value['encrypt_status']) == 1) {
                $caption1 = ''; //$obj->encryption_decryption('mc_decrypt', array('decrypt' => $value['caption'], 'key' => ENCRYPTION_KEY));
            } else {
                $caption1 = $value['caption'];
            }
            $captionCls = strtolower(implode("-", explode(" ", $caption1)));

            if (count($value['child']) > 0) {
                $showCollapsed = @$value['nodeZStructure']['SHOWCOLLAPSED'][0]['value'];
                if ($showCollapsed == "Yes") {
                    $showCollapsedCls = "collapsed-mode";
                    $showCollapsedIcon = "fa-angle-up";
                    $showCollapsedStyle = "style='display:none;'";
                } else {
                    $showCollapsedCls = "uncollapsed-mode";
                    $showCollapsedIcon = "fa-angle-down";
                    $showCollapsedStyle = "";
                }


                $html .= '<div class="nested-layout clearfix">
                            <a class="list-title-heading class-accordian ' . $showCollapsedCls . ' ">
                                <i class="fa ' . $showCollapsedIcon . '"></i><span class="list-title-accordian">' . $caption1 . '<span>
                            </a>
                        <div class="" ' . $showCollapsedStyle . ' >
                          <div class="list-detail-section"> ';
                $html .= $this->getPropertySubClass($value['child'], $flag, $obj, $node_sub_class_ids, $temp_node_instance_ids, $valueClassPropId, $tempNo);
                $html .= "</div></div></div>";
            } else {

                if (trim($caption1) == 'Properties') {
                    $clsssProp .= 'hide';
                } else {
                    $clsssProp = 'form-group';
                }
                $html .= '<div class="' . $clsssProp . '">';
                $html .= '<label class="col-sm-4 control-label form-label">' . $caption1 . '</label>';
                $propId = $value['node_class_property_id'];
                $elementType = trim(strtolower($value['nodeZStructure']['FORM SELECTOR'][0]['value']));
                $html .= '<div class="col-sm-8">';
                if ($elementType == "input") {

                    $randData = ''; //generateRandomString($length = 10);
                    $string1 = $value['nodeZStructure']['VALIDATION'][0]['value'];
                    preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);

                    if (count($matches) > 0 && isset($matches[1])) {
                        $newString2 = '';
                        foreach (array_reverse($matches[1]) as $key => $val) {
                            $newString2 .= 'check' . $randData . '' . $val . "('this.value');";
                            $replaceStr = 'check' . $randData . '' . $val;
                            $string1 = str_replace($val, $replaceStr, $string1);
                        }
                        $newString2 = substr($newString2, 0, -1);
                    }

                    $fieldValue = html_entity_decode($node_sub_class_ids[$value['node_class_property_id']]);

                    $readOnly = '';

                    if ($value['node_class_property_id'] == TARGET_PROPERTY_ID || $value['node_class_property_id'] == TARGET_PROPERTY_NAME) {
                        $readOnly = 'readOnly="true"';
                    }

                    if ($mod == 'view') {
                        $html .= '<span class="list-view-detail"></span>';
                    } else {
                        $html .= '<input type="text" class="validationCheck form-control inline-input newsletter_text3 ' . $captionCls . ' " id="instance_property_caption" name="" placeholder="' . strtolower($caption1) . '"    ' . $readOnly . '  value="' . $fieldValue . '" validate-data="">';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    }


                    if (!empty($matches[1]) && $string1 != "") {
                        
                    }
                } elseif ($elementType == 'text area') {

                    $html .= '<textarea rows="1" cols="55" class="validationCheck form-control inline-input newsletter_text3 ' . $captionCls . '" name="instance_property_caption[]" data-id="' . $propId . '" id="instance_property_caption' . $propId . '" maxlength="500" validate-data="" placeholder="' . strtolower($caption4) . '" >' . $caption4 . '</textarea>';
                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'radio') {

                    $randNumberGroup = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 5)), 0, 5);
                    $html .= '<div id="radio_wrapper" class="' . $captionCls . '" >';
                    $html .= '<input type="hidden" class="instanceRunTab validationCheck" id="instance_property_caption' . $propId . '" name="instance_property_caption[]" placeholder="" validate-data="" value="">';

                    for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                        $checked = '';
                        $checkVal = $value['nodeClassYInstanceValue'][$k];
                        if ($checkVal == $caption4) {
                            $checked = 'checked="checked"';
                        }
                        $html .= '<div class="input-radio">
                                          <label><input type="radio" value="' . $checkVal . '" ' . $checked . ' name="radio_' . $randNumberGroup . '" data-id="' . $propId . '" id="radio_' . $propId . '" onclick="setValueOfNodeZ(this,' . $propId . ')" >' . $checkVal . '</label>
                                        </div>';
                    }


                    $html .= '</div>';
                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'check box') {

                    $randNumberGroup = rand(5, 15);
                    $html .= '<div id="checkbox_wrapper" "' . $captionCls . '" >';
                    $html .= '<input type="hidden" class="instanceRunTab validationCheck" data-id=' . $propId . ' id="instance_property_caption' . $propId . '" name="instance_property_caption[]" placeholder="" validate-data="" value="' . $caption4 . '">';
                    $strArr = explode("~#~", $caption4);
                    for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                        $checked = '';
                        $checkVal = $value['nodeClassYInstanceValue'][$k];
                        if (in_array($checkVal, $strArr)) {
                            $checked = 'checked="checked"';
                        }

                        $html .= '<div class="input-chk">
                                          <label><input type="checkbox" value="' . $checkVal . '" ' . $checked . ' name="check_' . $randNumberGroup . '" class="checkClass_' . $propId . '" data-id="' . $propId . '" id="check_' . $propId . '" onclick="setValueOfNodeZcheckBox(this,' . $propId . ')" >' . $checkVal . '</label>
                                        </div>';
                    }


                    $html .= '</div>';
                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'drop down') {

                    $html .= '<select name="instance_property_caption[]" class=" form-control form-select select-field nodeZselect nodeselection-dropdown instanceRunTab  ' . $captionCls . '  " data-id="' . $propId . '" id="instance_property_caption"' . $propId . '">';
                    $strArr = explode("~#~", $caption4);
                    for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                        $selected = '';
                        $checkVal = $value['nodeClassYInstanceValue'][$k];
                        if (in_array($checkVal, $strArr)) {
                            $selected = 'selected ="selected" ';
                        }

                        $html .= '<option value="' . $checkVal . '" ' . $selected . '>' . $checkVal . '</option>';
                    }


                    $html .= '</select>';
                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'file') {//add mode
                    $html .= '<input type="file" class="nodeZinput filestyle" data-id="' . $propId . '" id="filenodeZ' . $propId . '" name="filenodeZ' . $propId . '" placeholder="" data-icon="false" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);" onchange="saveFileStr(this);">';
                    $html .= '<div class="bootstrap-filestyle input-group"><input type="text" class="form-control " placeholder="" name="fileZvalue' . $propId . '" /> <span class="group-span-filestyle input-group-btn" tabindex="0"><label for="filenodeZ' . $propId . '" class="btn btn-default "><span class="icon-span-filestyle glyphicon glyphicon-folder-open"></span> <span class="buttonText">Choose file</span></label></span></div>';
                    $html .= '<span class="fileZReset hide"><i class="prs-icon icon_close"></i></span>';

                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'calendar') {
                    $html .= '<div id="calender_wrapper" class="' . $captionCls . '" ><input data-id="' . $propId . '" id="class_property_id' . $propId . '" name="class_property_id[]" type="hidden" value="' . $caption4 . '"><input type="text" readonly="" class="instanceRunTab validationCheck datepicker form-control inline-input"  value="' . $caption4 . '" name="instance_property_caption[]" placeholder="" validate-data=""></div>';

                    $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                    $html .= '<span class="list-view-detail hide"></span>';
                } elseif ($elementType == 'instruction') {
                    $html .= '<span class="list-view-detail">' . $caption4 . '</span>';
                }
                $html .= '</div>';
                $html .= '</div>';
            }
        }
        $html .= "";
        return $html;
    }

    /*     * ***************GET PROPERTY AND SUB-PROPERTY ON VIEW MODE**************** */

    function getPropertySubClassView($propertyArray, $flag, $obj, $tempinstanceArray, $valueClassPropId, $tempNo, $count, $displayMode) {
        $html .= ' ';
        if (current($propertyArray)['caption'] == 'Properties') {

            if (!empty(current($propertyArray)['child'])) {

                $propArr = current($propertyArray)['child'];
                $propertyArray = $propArr;
            }
        }

        foreach ($propertyArray as $key => $value) {

            $caption1 = "";
            if (intval($value['encrypt_status']) == 1) {
                $caption1 = ''; //$obj->encryption_decryption('mc_decrypt', array('decrypt' => $value['caption'], 'key' => ENCRYPTION_KEY));
            } else {
                $caption1 = $value['caption'];
            }

            $propId = $value['node_class_property_id'];
            if (count($value['child']) > 0) {
                $showCollapsed = @$value['nodeZStructure']['SHOWCOLLAPSED'][0]['value'];
                if ($showCollapsed == "Yes") {
                    $showCollapsedCls = "collapsed-mode";
                    $showCollapsedIcon = "fa-angle-up";
                    $showCollapsedStyle = "style='display:none;'";
                } else {
                    $showCollapsedCls = "uncollapsed-mode";
                    $showCollapsedIcon = "fa-angle-down";
                    $showCollapsedStyle = "";
                }
                $html .= '<div class="nested-layout clearfix">
                            <a class="list-title-heading class-accordian ' . $showCollapsedCls . ' ">
                                <i class="fa ' . $showCollapsedIcon . '"></i><span class="list-title-accordian">' . $caption1 . '<span>
                            </a>
                        <div class="" ' . $showCollapsedStyle . ' >
                          <div class="list-detail-section"> ';
                $html .= $this->getPropertySubClassView($value['child'], $flag, $obj, $tempinstanceArray, $valueClassPropId, $tempNo, $count, $displayMode);
                $html .= "</div></div></div>";
            } else {
                $caption4 = trim($tempinstanceArray[$value['node_class_property_id']]);

                if (intval($value['encrypt_status']) == 1) {
                    $caption4 = ''; //$this->encryption_decryption('mc_decrypt', array('decrypt' => $caption4, 'key' => ENCRYPTION_KEY));
                } else {
                    $caption4 = $caption4;
                }
                if (trim($caption1) == 'Properties') {
                    $clsssProp .= 'hide';
                } else {
                    $clsssProp = 'form-group';
                }
                $html .= '<div class="' . $clsssProp . '">';
                $html .= '<label class="col-sm-4 control-label form-label">' . $caption1 . '</label>';
                $html .= '<div class="col-sm-8">';
                $captionCls = strtolower(implode("-", explode(" ", $caption1)));
                $elementType = strtolower($value['nodeZStructure']['FORM SELECTOR'][0]['value']);
                if ($displayMode == 'view') {
                    $strValue = '';
                    $arrLength;
                    if (strpos($caption4, "~#~") > 0) {
                        $strArr = explode("~#~", $caption4);
                        $arrLength = count($strArr);
                        for ($i = 0; $i < $arrLength; $i++) {
                            $strValue .= $strArr[$i] . "</br>";
                        }
                    } else {
                        $strValue = $caption4;
                    }

                    if (filter_var($strValue, FILTER_VALIDATE_URL)) {
                        $name = basename($strValue); // to get file name
                        $html .= '<span class="list-view-detail"><a href="' . $strValue . '" class="remote_download_link" download="' . $name . '" >' . $name . '</a></span>';
                    } else {
                        $html .= '<span class="list-view-detail">' . $strValue . '</span>';
                    }
                } else if ($displayMode == 'edit') {

                    if ($elementType == 'input') {

                        $html .= '<input type="text" class="validationCheck form-control inline-input newsletter_text3 ' . $captionCls . ' " id="instance_property_caption" name="" placeholder="' . strtolower($caption4) . '"    ' . $readOnly . '  value="' . $caption4 . '" validate-data="">';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'text area') {

                        $html .= '<textarea rows="1" cols="55" class="validationCheck form-control inline-input newsletter_text3 ' . $captionCls . ' " name="instance_property_caption[]" data-id="' . $propId . '" id="instance_property_caption' . $propId . '" maxlength="500" validate-data="" placeholder="' . strtolower($caption4) . '" >' . $caption4 . '</textarea>';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'radio') {

                        $randNumberGroup = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 5)), 0, 5);
                        $html .= '<div id="radio_wrapper" class="' . $captionCls . '" >';
                        $html .= '<input type="hidden" class="instanceRunTab validationCheck" id="instance_property_caption' . $propId . '" name="instance_property_caption[]" placeholder="" validate-data="" value="">';

                        for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                            $checked = '';
                            $checkVal = $value['nodeClassYInstanceValue'][$k];
                            if ($checkVal == $caption4) {
                                $checked = 'checked="checked"';
                            }
                            $html .= '<div class="input-radio" class="' . $captionCls . '" >
                                          <label><input type="radio" value="' . $checkVal . '" ' . $checked . ' name="radio_' . $randNumberGroup . '" data-id="' . $propId . '" id="radio_' . $propId . '" onclick="setValueOfNodeZ(this,' . $propId . ')" >' . $checkVal . '</label>
                                        </div>';
                        }


                        $html .= '</div>';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'check box') {

                        $randNumberGroup = rand(5, 15);
                        $html .= '<div id="checkbox_wrapper" class="' . $captionCls . '" >';
                        $html .= '<input type="hidden" class="instanceRunTab validationCheck" data-id="' . $propId . '" id="instance_property_caption' . $propId . '" name="instance_property_caption[]" placeholder="" validate-data="" value="' . $caption4 . '">';
                        $strArr = explode("~#~", $caption4);
                        for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                            $checked = '';
                            $checkVal = $value['nodeClassYInstanceValue'][$k];
                            if (in_array($checkVal, $strArr)) {
                                $checked = 'checked="checked"';
                            }

                            $html .= '<div class="input-chk">
                                          <label><input type="checkbox" value="' . $checkVal . '" ' . $checked . ' class="checkClass_' . $propId . '" name="check_' . $randNumberGroup . '" data-id="' . $propId . '" id="check_' . $propId . '" onclick="setValueOfNodeZcheckBox(this,' . $propId . ')" >' . $checkVal . '</label>
                                        </div>';
                        }


                        $html .= '</div>';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'drop down') {

                        $html .= '<select name="instance_property_caption[]" class=" form-control form-select select-field nodeZselect nodeselection-dropdown instanceRunTab ' . $captionCls . ' " data-id="' . $propId . '" id="instance_property_caption"' . $propId . '">';
                        $strArr = explode("~#~", $caption4);
                        for ($k = 0; $k < count($value['nodeClassYInstanceValue']); $k++) {
                            $selected = '';
                            $checkVal = $value['nodeClassYInstanceValue'][$k];
                            if (in_array($checkVal, $strArr)) {
                                $selected = 'selected ="selected" ';
                            }

                            $html .= '<option value="' . $checkVal . '" ' . $selected . '>' . $checkVal . '</option>';
                        }


                        $html .= '</select>';
                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'file') {//view and edit
                        //$propId = (string)rand(10000, 100000);
                        $html .= '<input type="file" class="nodeZinput filestyle" data-id="' . $propId . '" id="filenodeZ' . $propId . '" name="filenodeZ' . $propId . '" placeholder="" data-icon="false" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);" onchange="saveFileStr(this);">';
                        $html .= '<div class="bootstrap-filestyle input-group"><input type="text" class="form-control " placeholder="" name="fileZvalue' . $propId . '" /> <span class="group-span-filestyle input-group-btn" tabindex="0"><label for="filenodeZ' . $propId . '" class="btn btn-default "><span class="icon-span-filestyle glyphicon glyphicon-folder-open"></span> <span class="buttonText">Choose file</span></label></span></div>';
                        $html .= '<span class="fileZReset hide"><i class="prs-icon icon_close"></i></span>';

                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'calendar') {
                        $html .= '<div id="calender_wrapper" class="' . $captionCls . '" ><input data-id="' . $propId . '" id="class_property_id' . $propId . '" name="class_property_id[]" type="hidden" value="' . $caption4 . '"><input type="text" readonly="" class="instanceRunTab validationCheck datepicker form-control inline-input"  value="' . $caption4 . '" name="instance_property_caption[]" placeholder="" validate-data=""></div>';

                        $html .= '<input id="instance_property_id' . $propId . '" name="instance_property_id[]" type="hidden" value="' . $propId . '">';
                        $html .= '<span class="list-view-detail hide"></span>';
                    } elseif ($elementType == 'instruction') {
                        $html .= '<span class="list-view-detail">' . $caption4 . '</span>';
                    }
                }

                $html .= '</div>';
                $html .= '</div>';
            }
        }
        return $html;
    }

    /*     * ***************SAVE SUB-CLASSES STR. PROPERTY AND SUB-PROPERTY **************** */

    public function saveSubClassStrLayoutAction() {

        $layout                             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                            = $this->getRequest();
        $classArray                         = array();
        $instance_status_array              = array();
        $mode                               = '';

        if ($request->isPost()) {
            $post                           = $request->getPost()->toArray();
            $instance_property_array        = json_decode($post['post_tree'], true);

            //for instance subclasses's subinstanc
            $node_instance_id               = $post['instance_id'];
            $saveType                       = $post['saveType'];
            $temparray                      = array();

            if (count($instance_property_array) > 0) {

                $parentArray                = array();
                $childArray                 = array();
                foreach ($instance_property_array as $key => $subinstance_property) {
                    $parent                 = $subinstance_property['parent'];
                    $flag                   = 'N';
                    foreach ($instance_property_array as $indexK => $valueK) {
                        if ($parent == $valueK['id']) {
                            $flag           = 'Y';
                        }
                    }

                    if ($flag == 'N')
                        $instance_property_array[$key]['parent'] = 0;
                }

                foreach ($instance_property_array as $propk => $propv) {
                    if (intval($propv['parent']) == 0)
                        $parentArray[]      = $propv;
                    else
                        $childArray[$propv['parent']][] = $propv;
                }

                $realPropArray              = array();

                $temparray                  = $this->getChild($parentArray, $childArray, $realPropArray);
            }


            if (count($temparray) > 0) {
                foreach ($temparray as $keys => $sub_instance_temparray) {

                    $sub_instance_array = $temparray[$keys]; //$sub_instance_temparray; //$temp_sub_instance_temparray[$keys];


                    $this->subInstanceArray($sub_instance_array, $saveType, $flag, $node_instance_id);
                }
            }
            exit;
        }
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

    public function subInstanceArray($sub_instance_array, $saveType, $flag, $node_instance_ids) {

        if (isset($sub_instance_array['subnodeclasspropertyid']) && count($sub_instance_array['subnodeclasspropertyid'])) {
            $subinstance_property_value                         = $sub_instance_array['text'];
            $node_class_id                                      = $sub_instance_array['subnodeclassid'];
            $node_class_property_id                             = $sub_instance_array['subnodeclasspropertyid'];
            $temp_node_id                                       = $sub_instance_array['temp_node_id'];

            /* Start Code By Arvind Soni */
            if(intval($node_class_id) == intval(LOCATION_ROLE_DETAILS))
            {
                $index                                          = '';
                $index                                          = array_search(LOCATION_ROLE_LNID, $node_class_property_id);
                $subinstance_property_value[$index]             = $node_instance_ids;
               
                $index                                          = '';
                $index                                          = array_search(LOCATION_ROLE_A, $node_class_property_id);
                $actor_name                                     = trim($subinstance_property_value[$index]);

                $index                                          = '';
                $index                                          = array_search(LOCATION_ROLE_E, $node_class_property_id);
                $actor_email                                    = $subinstance_property_value[$index];

                if($actor_name != '' && $actor_email != '')
                {
                    $actor_nid                                  = $this->getClassesTable()->createOrGetActor($actor_name, $actor_email);

                    $index                                      = '';
                    $index                                      = array_search(LOCATION_ROLE_ANID, $node_class_property_id);
                    $subinstance_property_value[$index]         = $actor_nid;
                }
            }
            /* End Code By Arvind Soni */

            $temp_instance_id                                   = $this->getClassesTable()->getinstancesDetailsByIdUpdated($temp_node_id, $node_class_id);

            $nodetypeArray                                      = $this->getClassesTable()->getClassList($node_class_id);
            $node_type_ids                                      = $nodetypeArray['node_type_id'];
            $instance_caption                                   = $this->getClassesTable()->getLastNumber('node', 'node_id');

            if ($temp_instance_id > 0) {
                
            } else {

                $node_instance_id                               = $this->getClassesTable()->createInstance($instance_caption, $node_class_id, $node_type_ids, $saveType, 0);
                $node_x_ids                                     = $this->getClassesTable()->getLastNumber('node', 'node_id') - 1;
                $node_y_id                                      = $this->getClassesTable()->getinstanceDetails($node_instance_ids); //getnode_id
                $node_x_id                                      = "," . $node_x_ids;
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
                    $temp_sub_node_instance_id                  = $temp_instance_id;
                } elseif ($node_instance_id > 0) {
                    $temp_sub_node_instance_id                  = $node_instance_id;
                } else {
                    $temp_sub_node_instance_id                  = $this->getClassesTable()->getinstancesDetailsByIdUpdated($instanceChild['temp_node_id'], $instanceChild['subnodeclassid']);
                }
                $this->subInstanceArray($instanceChild, $saveType, $flag, $temp_sub_node_instance_id);
            }
        }
    }

    public function deleteNodeInstanceAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            $paramArr = array('node_instance_id');
            $instanceArr = $this->getStructureTable()->getTableCols($paramArr, 'node-instance', 'node_id', $post['instance_node_id']);

            $this->res['data'] = $this->getHelperObj()->deleteInstance($instanceArr);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
            $this->res['status'] = '1';
        } else {
            
            $this->res['status'] = '0';
            $this->res['message'] = $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function saveFileAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $classArray = array();
        $err = 0;
        $errorMsg = '';
        $file_name = '';
        $json = array();
        $awsObj = new AwsS3();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $file = $post['files'];
            $uploadingPath = $post['uploded_path'];

            $newFormId = 'filenodeZ' . '' . $post['id'];
            $preImg = $post['imgName'];

            if ($file[$newFormId]['name'] != '') {
                $imageExt = explode(".", $file[$newFormId]['name']);

                $extArr = array('jpg', 'jpeg', 'gif');

                if (!empty($imageExt)) {
                    if (!in_array(strtolower(end($imageExt)), $extArr)) {
                        $err = 1;
                    }
                    /* else if( ( ($file[$newFormId]['size'])/1024) > 500000){ //larger than 500 kb, give an error
                      $err = 2;
                      } */
                }
            }
            if ($err == 1) {
                //$randName               = $this->generateRandomStringAction(8);
                $file_name = mt_rand() . '_' . $file[$newFormId]['name'];

                $uploaddir          = 'public/nodeZimg/';
                $uploadfile         = $uploaddir . $file_name;
                $result             = $awsObj->setFileData($uploadfile,$file[$newFormId]['tmp_name'],'file');
                //if (move_uploaded_file($file[$newFormId]['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                    $json['fileName'] = $file_name;
                }
            }
            /* else if($err==2){
              $errorMsg = 'Your image is larger than 500Kb.';
              $json['errorMsg']       = $errorMsg;
              } */ else {

                if ($file[$newFormId]['name']) {
                    $awsObj->deleteFileData("public/nodeZimg/" . $preImg);
                    //unlink(ABSO_URL . "public/nodeZimg/" . $preImg);
                    $imageUrl = trim($file[$newFormId]['name']);
                    $file_tmpname = $file[$newFormId]['tmp_name'];
                    $file_name = mt_rand() . '_' . $file[$newFormId]['name'];
                    $imagename = 'public/nodeZimg/' . $file_name;
                    $result                 = $awsObj->setFileData($imagename,$file_tmpname,'file');
                    if($result['status_code'] == '200')
                    $json['fileName'] = $uploadingPath . $file_name;
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
        $resJsonArr = array('status' => '1', 'message' => '');
        $resJsonArr['data'] = $json;
        header('Content-Type: application/json');
        print json_encode($resJsonArr);
        exit;
        
//        print json_encode($json);
//        exit;
    }

    /*     * ***************END CODE BY-"GAUARV DUTT PANCHAL"**************** */

    public function getInstanceIdOfSubClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->getInstanceIdOfSubClass($post);
            $this->res['result'] = $this->res['data'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getVisibleNRequiredRolesAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getVisibleNRequiredRoles($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    /*public function getAllClassListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getAllClassList($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }*/

    public function getDealPermissionsAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getDealPermissions($post);
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getClassPropertyStrValAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getClassPropertyStrVal($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getClassInstanceValuesAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getClassInstanceValues($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getNodeXOfParticulerClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getNodeXOfParticulerClass($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getCanvasDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getCanvasData($post);
        } else {
            $this->errorReturn();
        }
        print $this->res['data'];
        exit;
    }

    public function updateDealInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $this->res['data'] = $this->getHelperObj()->updateDealInstance();
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getClassPropertyListAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getClassPropertyList($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getTemplateTypeAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $this->res['data'] = $this->getHelperObj()->getTemplateType($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function checkPerformaceReviewDocIdAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->checkPerformaceReviewDocId($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function setPerformanceReviewAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($this->actionArray[$post['action_id']] == 'Insert') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];

                if ($structure == 'Instance') {
                    $this->res['data'] = $this->getHelperObj()->setPerformanceReview($data, $structure);
                }
            }

            if ($this->actionArray[$post['action_id']] == 'Create Relation') {
                $data = $post['data'];
                $structure = $this->structureArray[$post['structure_id']];
                if ($structure == 'Relation') {
                    $this->res['data'] = $this->getHelperObj()->setPerformanceReview($data, $structure);
                }
            }

            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function rejectDealAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $data = $post['data'];
            $this->res['data'] = $this->getHelperObj()->rejectDeal($data);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function setLastVisitedOperationAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->setLastVisitedOperation($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getDealRejectionHistoryAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $data = $post['data'];
            $this->res['data'] = $this->getHelperObj()->getDealRejectionHistory($data);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

//******************************START******************RESET PASSWORD CODE****************************************************************
// ADDED BY- GAURAV DUTT PANCHAL
// DATE- 30 NOV, 2016
    /*
     * CHECK USER EXIST OR NOT 
     * PARAMS: EMAIL ID
     */
    public function validateEmailAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $email = trim($post['email']);
            $redirect_url = trim($post['redirect_url']);
            $email_property_id = trim($post['email_property_id']);
            $emailArr = $this->getHelperObj()->isEmailExist($email, $email_property_id);
            $nodeInstanceId = (int) (current($emailArr)['node_instance_id']);
            if (!empty($nodeInstanceId) && $nodeInstanceId > 0) {

                $param = array();
                $param['template_class_id'] = trim($post['template_class_id']);
                $param['template_property_id'] = trim($post['template_property_id']);
                $param['template_domain_property_id'] = trim($post['template_domain_property_id']);
                $param['template_domain'] = trim($post['template_domain']);

                $template = $this->getStructureTable()->getHtmlTemplateInstanceId($param);
                $templateInstanceId = (int) $template['instanceID'];

                if ($templateInstanceId > 0) {
                    $param['node_instance_id'] = $templateInstanceId;
                    $htmlTemplate = $this->getStructureTable()->getHtmlTemplate($param);

                    $instNodeId = (int) (current($emailArr)['instanceNodeId']);
                    $xYRelationArr = $this->getStructureTable()->getNodeYIdFromXYTable($instNodeId);
                    $nodeYID = current($xYRelationArr);

                    $fname_property_id = trim($post['fname_property_id']);
                    $lname_property_id = trim($post['lname_property_id']);

                    $userDetails = $this->getStructureTable()->getUserDetails($nodeYID, $fname_property_id, $lname_property_id);
                    $fName = $userDetails['First Name'];
                    $code = $this->generatePIN();
                    $htmlTemplate = str_replace("{{fname}}", $fName, $htmlTemplate);
                    $htmlTemplate = str_replace("{{code}}", $code, $htmlTemplate);
                    $htmlTemplate = str_replace("{{redirectUrl}}", $redirect_url, $htmlTemplate);

                    $mailArr = array();
                    $mailArr['to'] = $email;
                    $mailArr['body'] = $htmlTemplate;
                    $mailArr['from'] = 'admin@investible.com';
                    $mailArr['subject'] = 'Investible - Password Reset';
                    $mailStaus = $mailStaus2 = $this->triggerMail($mailArr);

                    //$mailStaus = false;

                    if ($mailStaus) {

                        $this->res['result']['code'] = $code;
                        $this->res['result']['status'] = 'success';
                        $this->res['result']['msg'] = 'Email sent.';
                    } else {

                        $this->res['result']['mail Staus'] = $htmlTemplate;
                        $this->res['result']['status'] = 'error';
                        $this->res['result']['error'] = 'error1';
                        $this->res['result']['msg'] = 'Email delivery failed.';
                    }
                } else {
                    $this->res['result']['status'] = 'error';
                    $this->res['result']['error'] = 'error8';
                    $this->res['result']['msg'] = 'Something went wrong.';
                }
            } else {
                $this->res['result']['status'] = 'error';
                $this->res['result']['error'] = 'error2';
                $this->res['result']['msg'] = 'Email account does not exist.';
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function validateCodeAction() {


        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $email = trim($post['email']);

            $fname_property_id = trim($post['fname_property_id']);
            $lname_property_id = trim($post['lname_property_id']);
            $email_property_id = trim($post['email_property_id']);

            $emailArr = $this->getHelperObj()->isEmailExist($email, $email_property_id);
            $instanceNodeId = (int) (current($emailArr)['instanceNodeId']);
            if (!empty($instanceNodeId) && $instanceNodeId > 0) {

                $xYRelationArr = $this->getStructureTable()->getNodeYIdFromXYTable($instanceNodeId);
                $nodeYID = current($xYRelationArr);
                if ($nodeYID > 0) {
                    $userDetails = $this->getStructureTable()->getUserDetails($nodeYID, $fname_property_id, $lname_property_id);
                    $name = $userDetails['First Name'] . ' ' . $userDetails['Last Name'];
                    $this->res['result']['name'] = $name;
                    $this->res['result']['email'] = $email;
                    $this->res['result']['status'] = 'success';
                    $this->res['result']['msg'] = 'Code verified.';
                } else {
                    //if code matched as per code send in mail
                    $this->res['result']['status'] = 'error';
                    $this->res['result']['msg'] = 'Something went wrong.';
                }
            } else {
                //if code matched as per code send in mail
                $this->res['result']['status'] = 'error';
                $this->res['result']['msg'] = 'Something went wrong.';
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function resetPasswordAction() {


        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $email = trim($post['email']);
            $password = trim($post['password']);
            $email_property_id = trim($post['email_property_id']);
            $password_property_id = trim($post['password_property_id']);
            $fname = trim($post['fname']);
            $redirect_url = trim($post['redirect_url']);

            $emailArr = $this->getHelperObj()->isEmailExist($email, $email_property_id);
            $nodeInstanceId = (int) (current($emailArr)['node_instance_id']);

            if (!empty($nodeInstanceId) && $nodeInstanceId > 0) {

                $currentPassword = $this->getStructureTable()->getCurrentPassword($nodeInstanceId, $password_property_id);

                if (trim($currentPassword) == $password) {
                    //if code matched as per code send in mail
                    $this->res['result']['status'] = 'error';
                    $this->res['result']['error'] = 'error1';
                    $this->res['result']['msg'] = 'Password has been used already. Choose another.';
                } else {
                    $status = $this->getStructureTable()->resetPassword($nodeInstanceId, $password, $password_property_id);
                    if ($status) {
                        $htmlTemplate = $this->passwordChangedTemplate($fname, $password, $redirect_url);

                        $mailArr = array();
                        $mailArr['to'] = $email;
                        $mailArr['body'] = $htmlTemplate;
                        $mailArr['from'] = 'admin@investible.com';
                        $mailArr['subject'] = 'Investible - Password Updated';
                        $mailStaus = $this->triggerMail($mailArr);
                        $this->res['result']['errorstatus'] = $status;
                        $this->res['result']['status'] = 'success';
                        $this->res['result']['msg'] = 'Password has been changed.';
                    } else {
                        //if code matched as per code send in mail

                        $this->res['result']['status'] = 'error';
                        $this->res['result']['error'] = 'error2';
                        $this->res['result']['msg'] = 'Something went wrong.';
                    }
                }
            } else {
                //if code matched as per code send in mail
                $this->res['result']['status'] = 'error';
                $this->res['result']['error'] = 'error3';
                $this->res['result']['msg'] = 'Something went wrong.';
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    function triggerMail($mailParam) {

        $to = $mailParam['to'];
        $subject = $mailParam['subject'];
        $body = $mailParam['body'];
        $from = $mailParam['from'];


        $headers = '';
        $headers = 'MIME-Version: 1.0' . PHP_EOL;
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . PHP_EOL;
        $headers .= 'From: ' . @$from . '<' . @$from . '>' . PHP_EOL;


        // Mail is diabled for now
        return mail($to, $subject, $body, $headers);
    }

    function generatePIN($digits = 5) {
        $i = 0; //counter
        $pin = ""; //our default pin is blank.
        while ($i < $digits) {
            //generate a random number between 0 and 9.
            $pin .= mt_rand(0, 9);
            $i++;
        }
        return $pin;
    }

    function passwordChangedTemplate($fname, $passwordm, $redirect_url) {

        $htmlTemplate = '<div align="center">
                            <table border="0" align="center" cellpadding="0" cellspacing="0" class="container"  width="100%">
                                  <tr>
                                     <td>
                                        <table width="100%">
                                           <tr>
                                              <td class="leftcol" align="right"><a href="' . $redirect_url . '" target="_blank"><img src="http://dev.pu.prospus.com/puidata/img/investible_logo_full_white_web.png" class="img-responsive" alt=""></a></td>
                                           </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333;">&nbsp;</td>
                                           </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333;">Hello ' . $fname . ',</td>
                                           </tr>
                                           <tr>
                                              <td valign="top">&nbsp;</td>
                                           </tr>
                                           <tr>
                                                  <td style="font:13px Arial, Helvetica, sans-serif; color:#333; line-height:20px;">Your Investible account password has been updated on ' . date('m/d/Y') . '. Please find below the updated password to access your account.</td>
                                           </tr>                                      
                                                 <tr>
                                                      <td>&nbsp;</td>
                                                </tr>
                                                 <tr>
                                                     <td style="font:13px Arial, Helvetica, sans-serif; color:#333; line-height:20px;"><strong>Password - </strong>' . $password . '</td>
                                                 </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333; line-height:20px;">
                                                 If you have any questions please contact us directly at  <a href="mailto:admin@investible.com" target="_blank" style="color:#336699;">admin@investible.com</a>.
                                              </td>
                                           </tr>
                                           <tr>
                                              <td valign="top">&nbsp;</td>
                                           </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333; line-height:20px;">Thank you.</td>
                                           </tr>
                                           <tr>
                                              <td  style="font:13px Arial, Helvetica, sans-serif; color:#333; line-height:20px;">Investible Team.</td>
                                           </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333;">&nbsp;</td>
                                           </tr>
                                           <tr>
                                              <td style="font:13px Arial, Helvetica, sans-serif; color:#333;">&nbsp;</td>
                                           </tr>
                                        </table>
                                     </td>
                                     <td></td>
                                  </tr>
                               </table>
                            </div>';
        return $htmlTemplate;
    }

//******************************END******************RESET PASSWORD CODE****************************************************************

    public function getFieldDataByAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $data = $post['individual_instance_node_id'];
            $this->res['data'] = $this->getHelperObj()->getFieldDataBy($data);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getDataOfInstanceTitleAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();



            $this->res['data'] = $this->getHelperObj()->getDataOfInstanceTitle($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getOperationPermissionAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getOperationPermission($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    //******************************START******************FOR CONTROL MANAGEMENT CLASS****************************************************************
// ADDED BY- GAURAV DUTT PANCHAL
// DATE- 8 DEC, 2016

    public function setManageClassInstanceForRoleAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $instanceId = $post['instanceId'];
            $mainRoleId = $post['mainRoleId'];
            $instanceArr = $this->getStructureTable()->setManageControlRoleInstance($instanceId, $mainRoleId);

            if (count($instanceArr) > 0) {
                print $this->getStructureTable()->updateManageControlRoleInstance($instanceArr);
            } else {
                print '0';
            }
            exit;
        } else {
            $this->errorReturn();
        }
    }

    public function getDealDetailsAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $nodeInstanceId = $post['nodeInstanceId'];
            $this->res['data'] = $this->getStructureTable()->getDealDetails($nodeInstanceId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function checkDealInPassedByRolesAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $instanceId = $post['instanceId'];
            $instanceNodeId = $post['instanceNodeId'];
            $this->res['data'] = $this->getStructureTable()->checkDealInPassedByRoles($instanceId, $instanceNodeId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function checkInPassedDealsByRolesClsAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $controlVersionId = $post['controlVersionId'];
            $toRoleId = $post['toRoleId'];
            $this->res['data'] = $this->getStructureTable()->checkInPassedDealsByRolesCls($controlVersionId, $toRoleId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getInstanceNodeIdAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $instanceId = $post['instanceId'];
            $classId = $post['nodeClassId'];
            $this->res['data'] = $this->getStructureTable()->getInstanceNodeId($classId, $instanceId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function passDealAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $dealInstanceNodeId = $post['dealInstanceNodeId'];
            $fromRole = $post['fromRole'];
            $toRole = $post['toRole'];
            $loginRoleId = $post['loginRoleId'];
            $loginUserId = $post['loginUserId'];
            $dealSize = strtolower($post['dealSize']);
            $instanceDealId = $post['dealInstanceId'];
            $raArr = $this->getStructureTable()->getRaRoleDetails($loginRoleId, $loginUserId);




            $status = 1;
            //When RA pass the deal
            //When RA pass deal which is low type
            $dealTypeFlag = false;
            if (strtolower($toRole) == 'archive') {
                $dealTypeFlag = true;
            }

            if ((int) $loginRoleId == ROLE_REVENUE_ACCOUNTANT && $dealSize == 'low' && $dealTypeFlag) {
                if (count($raArr) > 0) {
                    $count = (int) $raArr[0]['count'];
                    if ($count < RA_MANAGER_COUNTER) {

                        if ($this->checkDealNo($instanceDealId)) {//Check if deal is 25th and property has been set
                            $toRole = ROLE_REVENUE_MANAGER;
                        } else {
                            $status = 3;
                            $toRole = 'archive';
                        }
                    } else {
                        $toRole = ROLE_REVENUE_MANAGER;
                    }
                }
            }
            //When RM pass the deal
            if ((int) $loginRoleId == ROLE_REVENUE_MANAGER && $dealSize == 'low') {
                $status = 3;
                $toRole = 'archive';
            }

            //When Director pass the deal
            if ($loginRoleId == ROLE_DIRECTOR) {
                $status = 3;
                $toRole = 'archive';
            }

            $instance_id = $this->createInstancePASSDEALClass($dealInstanceNodeId, $fromRole, $toRole, $status);
            $flag = 0;
            if ($instance_id > 0) {
                //When RA pass the deal
                if ($loginRoleId == ROLE_REVENUE_ACCOUNTANT && $dealSize == 'low') {
                    if (count($raArr) > 0) {
                        //Update instance of RA MANAGER COUNTER class
                        $this->updateInstanceRAClass($raArr, $instanceDealId);
                    }
                }

                $nodeInstancePropertyIdArr = $this->getStructureTable()->getInstanceofPassDealClass(PASSED_DEAL_BY_ROLES_CLASS_ID, $instance_id, $dealInstanceNodeId);
                if (count($nodeInstancePropertyIdArr) > 0) {
                    $flag = $this->getStructureTable()->updateInstanceofPassDealClass($nodeInstancePropertyIdArr);
                }
            }

            //Status and Sub-Status 
            $dealSubStatus['deal_instance_id']      = $post['dealInstanceId']; //current deal instance id
            $dealSubStatus['role_id']               = $toRole; //Deal (control) pass to this role
            $dealSubStatus['awsObj']                = $this->AwsS3();
            $statusArr = $this->getHelperObj()->updateDealStatus($dealSubStatus);

            $this->res['rows_effected'] = $flag;
            $this->res['to_role'] = $toRole;
            $this->res['from_role'] = $fromRole;
            $this->res['deal_instance_id'] = $post['dealInstanceId'];
            $this->res['deal_status'] = $statusArr;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

//******************************END******************FOR CONTROL MANAGEMENT CLASS****************************************************************
    public function getSingleClassInstanceValueAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getSingleClassInstanceValue($post['data']);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getmapOperationFormDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getmapOperationFormData($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getCurrentControlAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $dealInstanceNodeId = $post['dealInstanceNodeId'];
            $this->res['data'] = $this->getHelperObj()->getCurrentControl($dealInstanceNodeId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function assignRoleOfRaAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->assignRoleOfRa($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function createInstanceRAClass($loginRoleId, $loginUserId) {
        //Create new instance of RA MANAGER COUNTER class
        $dataArray2['node_class_id'] = RA_MANAGER_COUNTER_CLASS_ID;
        $dataArray2['node_class_property_id'] = array(RA_MANAGER_ROLE, RA_MANAGER_ACTOR, RA_MANAGER_COUNT);
        $dataArray2['value'] = array($loginRoleId, $loginUserId, 0);
        $dataArray2['is_email'] = 'N';
        $dataArray2['status'] = 'P';
        $instance_id2 = $this->getHelperObj()->setStructure($dataArray2, 'Instance')['instance_id'];
    }

    public function updateInstanceRAClass($raArr, $dealInstanceId) {


        $dealArr = $this->getStructureTable()->getDealNumber($dealInstanceId);
        $dealNumber = $dealArr['deal_number'];
        $dealNumberInsPropId = $dealArr['node_instance_property_id'];
        $dealNoFlag = false;
        if ($dealNumber == '1' && (int) $dealNumberInsPropId > 0) {//Check if deal is 25th and pass to RM and return to RA than counter for this Deal will not increase.
            $dealNoFlag = true;
        }


        $nodeInstancePropertyId = (int) $raArr[0]['node_instance_property_id'];
        $count = (int) $raArr[0]['count'];

        if ($dealNoFlag) {
            $raCounter = (int) $raArr[0]['count'];
        } else {

            $raCounter = (int) $raArr[0]['count'] + 1;
        }

        if ($count == RA_MANAGER_COUNTER) {
            $raCounter = 0;
            if ((int) $dealNumberInsPropId > 0) {
                $this->getStructureTable()->updateDealNumber($dealNumberInsPropId);
            } else {
                $this->getStructureTable()->insertDealNumber($dealInstanceId);
            }
        }

        if ($nodeInstancePropertyId > 0) {
            $instPropertyArr[0] = $nodeInstancePropertyId;
            $this->getStructureTable()->updateRaRoleDetails($instPropertyArr, $raCounter);
        }
    }

    public function createInstancePASSDEALClass($dealInstanceNodeId, $fromRole, $toRole, $status) {
        //Create new instance of PASSED_DEAL_BY_ROLES class 
        $dataArray['node_class_id'] = PASSED_DEAL_BY_ROLES_CLASS_ID;
        $timestamp = date('Y-m-d H:i:s');
        $dataArray['node_class_property_id'] = array(PASSED_DEAL_D_PID, PASSED_DEAL_FR_PID, PASSED_DEAL_TR_PID, PASSED_DEAL_A_PID, PASSED_DEAL_TIMESTAMP);
        $dataArray['value'] = array($dealInstanceNodeId, $fromRole, $toRole, $status, $timestamp);
        $dataArray['is_email'] = 'N';
        $dataArray['status'] = 'P';
        $instance_id = $this->getHelperObj()->setStructure($dataArray, 'Instance')['instance_id'];

        // Use code here to update and add deal class timestamp property while BM pass deal to RA         
        if ($fromRole == ROLE_BM && $toRole == ROLE_REVENUE_ACCOUNTANT && $status == 1) {
            $this->saveDealTimestamp($dealInstanceNodeId, $fromRole, $toRole, $status, $timestamp);
        }
        return $instance_id;
    }

    public function saveDealTimestamp($dealInstanceNodeId, $fromRole, $toRole, $status, $timestamp) {
        // get node instance id based of node id of deal
        $dealDataArr['node_class_id'] = DEAL_CLASS;
        $data['colsArr'] = array('node_instance_id');
        $data['table_name'] = 'node-instance';
        $data['whereCols'] = array('node_id');
        $data['value'] = array($dealInstanceNodeId);
        $nodeInstanceId = $this->getHelperObj()->getTableCols($data);
        // code use here for save time stamp in deal class property        
        $dealDataArr['node_instance_id'] = $nodeInstanceId['node_instance_id'];
        $dealDataArr['node_class_property_id'] = DEAL_TIMESTAMP_PID;
        $dealDataArr['value'] = $timestamp;
        $instanceId = $this->getHelperObj()->updateDealPhase($dealDataArr);
    }

    public function dealRejectionAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $data = $post['data'];
            $data['awsObj'] = $this->AwsS3();
            $this->res = $this->getHelperObj()->dealRejection($data);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getDealSizeAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {

            $post = $request->getPost()->toArray();
            $dealInstanceNodeId = $post['dealInstanceNodeId'];
            $this->res = $this->getStructureTable()->getDealSize($dealInstanceNodeId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function updateDealStatusAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();
            $post['awsObj'] = $this->AwsS3();
            $this->res['data'] = $this->getHelperObj()->updateDealStatus($post);
            $this->res['status'] = '1';
        } else {
            $this->res['status'] = '0';
            $this->res['message'] = $this->errorReturn();
            
        }
        print json_encode($this->res);
        exit;
    }

    public function updateDealAssignedRANameAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {

            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->updateDealAssignedRAName($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function updateDealSubStatusAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            //print json_encode($post);
            //exit;
            $dealInstanceId = $post['dealInstanceId'];
            $role_id = $post['role_id'];
            $dealsubStatusId = $post['dealsubStatusId'];

            $this->res['data'] = $this->getHelperObj()->updateDealSubStatus($dealInstanceId, $role_id, $dealsubStatusId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function restoreDealSubStatusAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            //print json_encode($post);
            //exit;
            $dealInstanceId = $post['dealInstanceId'];
            $dealRoleId = $post['dealRoleId'];

            $this->res['data'] = $this->getHelperObj()->updateDealSubStatus($dealInstanceId, $dealRoleId, '');
            $this->res['status'] = '1';
        } else {
            $this->res['error'] = '0';
            $this->res['message'] = $this->errorReturn();
            
        }
        print json_encode($this->res);
        exit;
    }

    public function checkInArchivedStatusAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();


            $instanceNodeId = $post['instanceNodeId'];
            $this->res['data'] = $this->getStructureTable()->checkInArchivedStatus($instanceNodeId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function getDealControlRoleAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $instanceNodeId = $post['instance_node_id'];
            //*****************GET control_version_id deal ids***************
            $dealDeails = $this->getStructureTable()->getDealDetails($instanceNodeId);

            //*****************GET deal_creator user ids***************
            $dealOwner = $this->getStructureTable()->getNodeXOfParticulerClass($instanceNodeId, 'node_y_id', 'node_x_id', DEAL_CREATOR_CLASS_ID);

            //GET DEAL OWNER DETAILS
            if (is_array($dealOwner) && intval(current($dealOwner)['node_x_id']) > 0) {
                $dealOwnerResArr = $this->getStructureTable()->getInstanceListOfParticulerClass(current($dealOwner)['node_x_id'], 'node', 'node_id');
                $dealOwnerRes = current($dealOwnerResArr);
            }

            //*****************GET DEAL DETAILS IN PASS BY ROLE CLASS ARRAY***************
            $instanceId = $dealDeails['node_instance_id'];
            $passByRoleArr = $this->getStructureTable()->checkDealInPassedByRoles($instanceId, $instanceNodeId);


            //*****************GET control_version_id deal ids***************
            $checkInstanceNodeId = $passByRoleArr['deal'];
            $controlVersionId = $dealDeails['control_version_id'];
            $toRoleId = $passByRoleArr['from_to'];
            if ($toRoleId == '') {
                $toRoleId = $dealOwnerRes['Role NID'];
            }

            $passDealArr = $this->getStructureTable()->checkInPassedDealsByRolesCls($controlVersionId, $toRoleId);
            $dealResArr = array();
            $dealResArr['deal_detials'] = $dealDeails;
            $dealResArr['deal_owner'] = $dealOwnerRes;
            $dealResArr['deal_pass_role'] = $passByRoleArr;
            $dealResArr['deal_control'] = $passDealArr;

            $this->res['data'] = $dealResArr;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res['data']);
        exit;
    }

    public function raRoleAssignAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $roleId = $post['roleId'];
            $userId = $post['userId'];

            $raArr = $this->getStructureTable()->getRaRoleDetails($roleId, $userId);
            if (count($raArr) == 0) {
                $this->res['data'] = $this->createInstanceRAClass($roleId, $userId);
            }
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getClassNidFromViewAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['node_id']) > 0 && trim($post['node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getClassNidFromView($post['node_id']);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getRAonDealAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $roleId = $post['roleId'];
            $instanceNodeId = $post['instanceNodeId'];
            $this->res = $this->getHelperObj()->getActorWithRoleAndDeal($instanceNodeId);
            //$this->res = $this->getStructureTable()->getRAonDeal($roleId, $instanceNodeId);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getSingleValueOfAllInstanceByClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getSingleValueOfAllInstanceByClass($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getClassStructureWithHirerchyAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getClassStructureWithHirerchy($post['node_y_class_id']);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getRAActorNameAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getRAActorName($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }


    public function awsS3FileAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (isset($post['mode']) > 0 && trim($post['mode']) != "") {
                $this->res['data'] = $this->getHelperObj()->awsS3File($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getInstancePropertyValueAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getInstancePropertyValue($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function checkDealNo($dealInstanceId) {

        $dealArr = $this->getStructureTable()->getDealNumber($dealInstanceId);
        $dealNumber = $dealArr['deal_number'];
        $dealNumberInsPropId = $dealArr['node_instance_property_id'];
        $dealNoFlag = false;
        if ($dealNumber == '1' && (int) $dealNumberInsPropId > 0) {//Check if deal is 25th and pass to RM and return to RA than counter for this Deal will not increase.
            $dealNoFlag = true;
        }
        return $dealNoFlag;
    }

/*
    * Created By: Divya Rajput
    * On Date: 6th Feb 2017
    * Purpose: For Super Admin - Deal's Operations
    */
    public function getOperationListAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getOperationList($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function getOperationMenuCountAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if (intval($post['class_node_id']) > 0 && trim($post['class_node_id']) != "") {
                $this->res['data'] = $this->getHelperObj()->getOperationMenuCount($post); //print_r($data);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    public function locationRoleForStoreAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->locationRoleForStore($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    public function searchPropertyValueInAllClassInstancesAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->searchPropertyValueInAllClassInstances($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    
    public function getCourseClassDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getCourseClassData($post);

        }else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    public function getPassByDealDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getPassByDealData($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    //Get operation form data
    public function getOperationFormDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getOperationFormData($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function getMappedClassInstanceValuewithArrayAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getMappedClassInstanceValuewithArray($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function getDetailDocumentDataAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getDetailDocumentData($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

    
    public function getMappingInstanceListOfParticulerClassAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getMappingInstanceListOfParticulerClass($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function manageOptionalOperationAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->manageOptionalOperation($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function manageOptionalOperationInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->manageOptionalOperationInstance($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    
    public function deleteOptionalOperationInstanceAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->deleteOptionalOperationInstance($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    
    public function getViewFormStructureDataAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getViewFormStructureData($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    
    public function getDealArchiveStatusForEditAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getDealArchiveStatusForEdit($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function getAllDocumentHtmlAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getAllDocumentHtml($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    
    public function getSharedDocumentFormAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getSharedDocumentForm($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    
    public function getFilterMenuCountsAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($request->isPost()) {
                $this->res['data'] = $this->getHelperObj()->getFilterMenuCounts($post);
                $this->res['result'] = $this->resultCodeArray['Success'];
                $this->res['msg'] = $this->sucessMsg['1'];
            } else {
                $this->errorReturn();
            }
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }
    public function finalOperationListAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->finalOperationList($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function getDashboardDataAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res = $this->getHelperObj()->getDashboardData($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function getEditFormStructureDataAction(){
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();


        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getEditFormStructureData($post);
            $this->res['result'] = $this->resultCodeArray['Success'];
            $this->res['msg'] = $this->sucessMsg['1'];
        } else {
            $this->errorReturn();
        }

        print json_encode($this->res);
        exit;
    }

    public function fetchCourseApiAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getClassesTable()->fetchCourseApi($post);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    public function fetchCourseDialogueApiAction() {

        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getClassesTable()->fetchCourseDialogueApi($post['course_node_ids']);
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    
    public function getDialogueListOfParticulerCourseAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getDialogueListOfParticulerCourse($post);
            //$this->res['data'] = $post;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    public function getBlankIndividualHistoryCoursesAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->getBlankIndividualHistoryCourses($post);
            //$this->res['data'] = $post;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }
    public function copyDialogueIndvHistoryToCourseIndvHistoryAction() {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->res['data'] = $this->getHelperObj()->copyDialogueIndvHistoryToCourseIndvHistory($post);
            //$this->res['data'] = $post;
        } else {
            $this->errorReturn();
        }
        print json_encode($this->res);
        exit;
    }

}