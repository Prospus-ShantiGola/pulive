<?php
namespace Administrator\Controller;

use Api\Controller\Plugin\PUCipher;
use Api\Controller\Plugin\PUSession;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Api\Controller\Plugin\PUMailer;

class OrganizationController extends AbstractActionController
{

    protected $administratorTable;
    protected $classesTable;
    protected $structureBuilderTable;
    protected $storageType = STORAGE_NAME;

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
        if (!$_SESSION[PREFIX . 'user_info']) {
            return $this->redirect()->toRoute('store');     // route to login if Guest
        }
        return parent::onDispatch($e);
    }

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
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $prefixTitle = PREFIX . 'user_info';
        $login_user_id = isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
        $groupArray = $this->getAdministratorTable()->getGroupsForParticulerUser($login_user_id);
        $rolesGroup = $actorList = array();

        if (count($groupArray) > 0) {
            $group_node_id = current($groupArray)['node_id'];
            $rolesGroup = $this->getAdministratorTable()->getRolesOfGroup($group_node_id);

            foreach($rolesGroup as $role_id => $value)
            {
                $perticuler_apps_list_of_role = $this->getAdministratorTable()->getGroupWiseProductionsOfRole($role_id,'Group');
                if(isset($perticuler_apps_list_of_role[$group_node_id]))
                {
                    $rolesGroup[$role_id]['app_ids'] = array_combine($perticuler_apps_list_of_role[$group_node_id],$perticuler_apps_list_of_role[$group_node_id]);
                }
                else
                {
                    $rolesGroup[$role_id]['app_ids'] = array();
                }
            }

            $groupArray[$group_node_id]['roles'] = $rolesGroup;

            //For Group Actor List (Added By: Divya Rajput)
            $group_actor_array = $this->getAdministratorTable()->fetchGroupActor($group_node_id);

            $defaultActorList = array_column($group_actor_array, 'actor');
            $actorList = array_combine($defaultActorList, $defaultActorList);

            $primeActorList = array();
            foreach($actorList as $key => $value)
            {
                $primeActorList[$key]['actor_id'] = $value;
                $perticuler_apps_list_of_actor = $this->getAdministratorTable()->getGroupWiseProductions($value,'Y','N');
                if(isset($perticuler_apps_list_of_actor[$group_node_id]))
                {
                    $primeActorList[$key]['app_ids'] = array_combine($perticuler_apps_list_of_actor[$group_node_id],$perticuler_apps_list_of_actor[$group_node_id]);
                }
                else
                {
                    $primeActorList[$key]['app_ids'] = array();
                }
            }

            $groupArray[$group_node_id]['actors']       = $primeActorList;
            $apps_list                                  = $this->getAdministratorTable()->fetchProductionOfGroup($group_node_id);
            $groupArray[$group_node_id]['app_list']     = $apps_list;
        }


        $formArray = array(
            GROUP_NAME_PID => array('class' => GROUP_CLASS_ID, 'property' => GROUP_NAME_PID, 'label' => 'Group Name', 'placeholder' => 'Group Name', 'name' => 'group', 'hidden' => false, 'type' => 'text'),
            GROUP_ACTOR_PID => array('class' => GROUP_CLASS_ID, 'property' => GROUP_ACTOR_PID, 'label' => 'Actor', 'placeholder' => 'Actor', 'name' => 'group_actor', 'hidden' => true, 'type' => 'text', 'value' => $login_user_id)
        );

        $sendArray = array('groups' => $groupArray, 'formArray' => $formArray);

        if ($this->getRequest()->isXmlHttpRequest()) {
            echo json_encode($sendArray, JSON_FORCE_OBJECT);
            exit;
        }else{//render data
                $apps_list = $this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($login_user_id);

              $this->layout()->setTemplate('layout/layout_new');
              $this->layout()->setVariable('course_list', json_encode(array(), JSON_FORCE_OBJECT));
              $this->layout()->setVariable('store_list', json_encode($apps_list, JSON_FORCE_OBJECT));
              $this->layout()->setVariable('groups', json_encode($groupArray, JSON_FORCE_OBJECT));
              $this->layout()->setVariable('formArray', json_encode($formArray, JSON_FORCE_OBJECT));
              $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
              $this->layout()->setVariable('view_type', '');
              $this->layout()->setVariable('page_name', 'group');
              $this->layout()->setVariable('expiration_msg', json_encode(array(),JSON_FORCE_OBJECT));
        }
    }

    public function getAllRolesAction()
    {
        //$st = microtime(true);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $roleArray = array();

        if (1) {
            /*
             * Modified By: Divya
             * Date: 13 SEPT 2017
             */
            $items = $this->getRoleList();
        } else {
            //below code remove later
            /*foreach ($tempArray as $key => $value) {
                if ($value['role'] != "" && intval($value['role_id']) != SYSTEM_GROUP_ADMIN)
                    $roleArray[$value['role_id']] = $value;
            }
            $items = array();
            foreach ($roleArray as $key => $value) {
                $items[$value['role_id']] = $value;
            }*/
        }
        //$et = microtime(true) - $st; echo $et;
        echo json_encode($items);
        exit;
    }

    public function saveOrganizationRoleAndGroupAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $data = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            if ($post['type'] == 'organizations')
            {
                $group_node_id                              = '';
                $group_name                                 = '';
                $user_id                                    = '';
                if (trim($post['group_class_id']) != '') {
                    if (!isset($post['group_instance_id'])) {

                        $returnInstanceArray = $this->getStructureBuilderTable()->createInstanceOfClass($post['group_class_id'], '1');
                        if (intval($returnInstanceArray['node_instance_id']) > 0) {
                            $class_id = $post['group_class_id'];
                            $propertyIdArray = array_keys($post['data']);
                            $propertyValueArray = array_values($post['data']);
                            $group_name = $propertyValueArray[0];
                            $user_id = $propertyValueArray[1];
                            $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnInstanceArray['node_instance_id'], $returnInstanceArray['node_type_id'], 'N', array(), "");

                            /* Create Instance Of Group Roles Class */
                            $returnGroupRolesArray = $this->getStructureBuilderTable()->createInstanceOfClass(GROUP_ROLE_CLASS_ID, '1');
                            if (intval($returnGroupRolesArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(GROUP_ROLE_GROUP_PID);
                                $propertyValueArray = array($returnInstanceArray['node_id']);
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnGroupRolesArray['node_instance_id'], $returnGroupRolesArray['node_type_id'], 'N', array(), "");
                            }

                            $this->getStructureBuilderTable()->createRelation($returnGroupRolesArray['node_id'], array(SYSTEM_GROUP_ADMIN));

                            $stateRoleActor = $this->getAdministratorTable()->isStateRoleActorInstanceExist($user_id);
                            if (count($stateRoleActor) == 0) {
                                /* Create Instance Of STATE_ACTOR_ROLE */
                                $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(STATE_ACTOR_ROLE_CLASS_ID, '1');
                                if (intval($returnStateArray['node_instance_id']) > 0) {
                                    $propertyIdArray = array(STATE_ACTOR_ROLE_ACTOR_PID);
                                    $propertyValueArray = array($user_id);
                                    $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                                }
                                $this->getStructureBuilderTable()->createRelation($returnStateArray['node_id'], array($returnGroupRolesArray['node_id']));
                            } else if (count($stateRoleActor) == 1) {
                                $this->getStructureBuilderTable()->createRelation($stateRoleActor[0]['node_id'], array($returnGroupRolesArray['node_id']));
                            }

                            /* Create Instance Of Event Roles Class */
                            $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(EVENT_ROLE_CLASS_ID, '1');
                            if (intval($returnStateArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(EVENT_ROLE_TIME_PID, EVENT_ROLE_ACTOR_PID, EVENT_ROLE_ROLE_PID, EVENT_ROLE_GROUP_PID, EVENT_ROLE_ACTION_PID);
                                $propertyValueArray = array(strtotime("now"), $user_id, SYSTEM_GROUP_ADMIN, $returnInstanceArray['node_id'], 'Role Assign');
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                            }
                        }
                        $group_node_id                              = $returnInstanceArray['node_id'];
                        $data = array($returnInstanceArray['node_id'] => array('group' => $group_name, 'node_id' => $returnInstanceArray['node_id'], 'node_instance_id' => $returnInstanceArray['node_instance_id'], 'user_id' => $user_id, 'actors' => array($user_id => "$user_id"), 'roles' => array()));
                    } else {
                        $class_id = $post['group_class_id'];
                        $propertyIdArray = array_keys($post['data']);
                        $propertyValueArray = array_values($post['data']);
                        $group_name = $propertyValueArray[0];
                        $user_id = $propertyValueArray[1];
                        foreach ($propertyIdArray as $key => $value) {
                            $this->getAdministratorTable()->updateInstanceProperty($propertyValueArray[$key], $value, $post['group_instance_id']);
                        }


                        /*
                         * Added By: Divya Rajput
                         * For Group And Actor List
                         */
                        $rolesGroup = $actorList = array();
                        if ($post['group_instance_node_id']) {
                            $group_node_id = $post['group_instance_node_id'];
                            $rolesGroup = $this->getAdministratorTable()->getRolesOfGroup($group_node_id);

                            //For Group Actor List (Added By: Divya Rajput)
                            $group_actor_array = $this->getAdministratorTable()->fetchGroupActor($group_node_id);
                            $defaultActorList = array_column($group_actor_array, 'actor');
                            $actorList = array_combine($defaultActorList, $defaultActorList);
                        }
                        $group_node_id                              = $post['group_instance_node_id'];
                        $data = array($post['group_instance_node_id'] => array('group' => $group_name, 'node_id' => $post['group_instance_node_id'], 'node_instance_id' => $post['group_instance_id'], 'user_id' => $user_id, 'actors' => $actorList, 'roles' => $rolesGroup));
                    }
                }

                $apps_list                                  = $this->getAdministratorTable()->fetchProductionOfGroup($group_node_id);
                $data[$group_node_id]['app_list']           = $apps_list;

                $actorList                                  = $data[$group_node_id]['actors'];
                $primeActorList = array();
                foreach($actorList as $key => $value)
                {
                    $primeActorList[$key]['actor_id'] = $value;
                    $perticuler_apps_list_of_actor = $this->getAdministratorTable()->getGroupWiseProductions($value,'Y','N');
                    if(isset($perticuler_apps_list_of_actor[$group_node_id]))
                    {
                        $primeActorList[$key]['app_ids'] = array_combine($perticuler_apps_list_of_actor[$group_node_id],$perticuler_apps_list_of_actor[$group_node_id]);
                    }
                    else
                    {
                        $primeActorList[$key]['app_ids'] = array();
                    }
                }

                $data[$group_node_id]['actors']       = $primeActorList;
            }
            else if ($post['type'] == 'roles')
            {
                /*
                 * Commented By: Divya
                 * $role_ids = explode(",",$post['role_ids']);
                 * if(intval($post['group_node_id']) > 0 && count($role_ids) > 0)
                 */
                $node_x_y_relation_id = 0;
                if (intval($post['group_node_id']) > 0) {
                    /*Added By: Divya*/
                    if (isset($post['role_ids']) && trim($post['role_ids']) != '') {
                        $role_ids = explode(",", $post['role_ids']);
                    } else {
                        //For Adding Role
                        if (trim($post['role_name']) != '' && !in_array(trim(strtolower($post['role_name'])), DEFAULT_ROLE_NAME)) {
                            /* Create Instance Of System Roles Class */
                            $returnSystemRolesArray = $this->getStructureBuilderTable()->createInstanceOfClass(SYSTEM_ROLE_CLASS_ID, '1');
                            if (intval($returnSystemRolesArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(SYSTEM_ROLE_NAME_PID);
                                $propertyValueArray = array($post['role_name']);
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSystemRolesArray['node_instance_id'], $returnSystemRolesArray['node_type_id'], 'N', array(), "");
                            }

                            $role_ids = array($returnSystemRolesArray['node_id']);
                        } elseif (trim(strtolower($post['role_name'])) == 'member' || trim(strtolower($post['role_name'])) == 'group admin') {
                            $data = array('status' => '0', 'success' => 'failed', 'msg' => 'You can\'t add a role as ' . $post['role_name'] . '.');
                            print json_encode($data, JSON_FORCE_OBJECT);
                            exit;
                        }
                    }

                    $rolesArray = $this->getAdministratorTable()->getRolesOfGroup($post['group_node_id']);//PRINT_R($rolesArray); DIE('TESTING');
                    $newRolesArray = array();
                    $newRoleIds = array();
                    foreach ($rolesArray as $key => $value) {
                        $newRolesArray[] = $value['node_x_id'];
                    }

                    foreach ($role_ids as $key => $roleId) {
                        if (!in_array($roleId, $newRolesArray)) {
                            $newRoleIds[] = $roleId;
                        }
                    }

                    if (count($newRoleIds) > 0) {
                        $this->getStructureBuilderTable()->createRelation($post['group_node_id'], $newRoleIds);
                    }

                    $node_x_y_relation = $this->getStructureBuilderTable()->getTableCols(array('node_x_y_relation_id'), 'node-x-y-relation', array('node_x_id', 'node_y_id'), array($role_ids[0], $post['group_node_id']));
                    $node_x_y_relation_id = $node_x_y_relation['node_x_y_relation_id'];
                }

                $data = array('group_id' => $post['group_instance_id'], 'group_node_id' => $post['group_node_id'], 'type' => $post['type'], 'role_id' => $role_ids[0], 'node_x_y_relation_id' => $node_x_y_relation_id);
            }
            else if ($post['type'] == 'users')
            {
                $prefixTitle = PREFIX . 'user_info';
                $login_user_id = isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
                $groupAdmin = $_SESSION[$prefixTitle]['first_name'] . " " . $_SESSION[$prefixTitle]['last_name'];
                $group_id = $post['group_id'];
                $role_id = isset($post['role_id']) ? $post['role_id'] : SYSTEM_MEMBER_NODE_ID;
                $user_ids = explode(',', $post['user_ids']);
                $user_list_old = $this->getAdministratorTable()->getUsersOfRoleAndGroup($group_id, $role_id);
                $userDiffArray = array_diff($user_ids, $user_list_old);
                $mailArray = array();

                foreach ($userDiffArray as $key => $user_id) {
                    $stateRoleActor = $this->getAdministratorTable()->isStateRoleActorInstanceExist($user_id);

                    if (count($stateRoleActor) == 1) {
                        $groupRoleArray = $this->getAdministratorTable()->getGroupRolesInstance($stateRoleActor[0]['node_id']);

                        if ($groupRoleArray[$group_id] != '') {
                            /* Create Instance Of Group Roles Class */
                            $this->getStructureBuilderTable()->createRelation($groupRoleArray[$group_id], array($role_id));

                            /* Create Instance Of Event Roles Class */
                            $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(EVENT_ROLE_CLASS_ID, '1');
                            if (intval($returnStateArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(EVENT_ROLE_TIME_PID, EVENT_ROLE_ACTOR_PID, EVENT_ROLE_ROLE_PID, EVENT_ROLE_GROUP_PID, EVENT_ROLE_ACTION_PID);
                                $propertyValueArray = array(strtotime("now"), $user_id, $role_id, $group_id, 'Role Assign');
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                            }
                        } else {
                            /* Create Instance Of Group Roles Class */
                            $returnGroupRolesArray = $this->getStructureBuilderTable()->createInstanceOfClass(GROUP_ROLE_CLASS_ID, '1');
                            if (intval($returnGroupRolesArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(GROUP_ROLE_GROUP_PID);
                                $propertyValueArray = array($group_id);
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnGroupRolesArray['node_instance_id'], $returnGroupRolesArray['node_type_id'], 'N', array(), "");
                            }

                            $this->getStructureBuilderTable()->createRelation($returnGroupRolesArray['node_id'], array($role_id));

                            /* relation Of STATE_ACTOR_ROLE */
                            $this->getStructureBuilderTable()->createRelation($stateRoleActor[0]['node_id'], array($returnGroupRolesArray['node_id']));

                            /* Create Instance Of Event Roles Class */
                            $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(EVENT_ROLE_CLASS_ID, '1');
                            if (intval($returnStateArray['node_instance_id']) > 0) {
                                $propertyIdArray = array(EVENT_ROLE_TIME_PID, EVENT_ROLE_ACTOR_PID, EVENT_ROLE_ROLE_PID, EVENT_ROLE_GROUP_PID, EVENT_ROLE_ACTION_PID);
                                $propertyValueArray = array(strtotime("now"), $user_id, $role_id, $group_id, 'Role Assign');
                                $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                            }
                        }
                    } else if (count($stateRoleActor) == 0) {
                        /* Create Instance Of Group Roles Class */
                        $returnGroupRolesArray = $this->getStructureBuilderTable()->createInstanceOfClass(GROUP_ROLE_CLASS_ID, '1');
                        if (intval($returnGroupRolesArray['node_instance_id']) > 0) {
                            $propertyIdArray = array(GROUP_ROLE_GROUP_PID);
                            $propertyValueArray = array($group_id);
                            $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnGroupRolesArray['node_instance_id'], $returnGroupRolesArray['node_type_id'], 'N', array(), "");
                        }

                        $this->getStructureBuilderTable()->createRelation($returnGroupRolesArray['node_id'], array($role_id));

                        /* Create Instance Of STATE_ACTOR_ROLE */
                        $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(STATE_ACTOR_ROLE_CLASS_ID, '1');
                        if (intval($returnStateArray['node_instance_id']) > 0) {
                            $propertyIdArray = array(STATE_ACTOR_ROLE_ACTOR_PID);
                            $propertyValueArray = array($user_id);
                            $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                        }
                        $this->getStructureBuilderTable()->createRelation($returnStateArray['node_id'], array($returnGroupRolesArray['node_id']));

                        /* Create Instance Of Event Roles Class */
                        $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(EVENT_ROLE_CLASS_ID, '1');
                        if (intval($returnStateArray['node_instance_id']) > 0) {
                            $propertyIdArray = array(EVENT_ROLE_TIME_PID, EVENT_ROLE_ACTOR_PID, EVENT_ROLE_ROLE_PID, EVENT_ROLE_GROUP_PID, EVENT_ROLE_ACTION_PID);
                            $propertyValueArray = array(strtotime("now"), $user_id, $role_id, $group_id, 'Role Assign');
                            $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
                        }
                    }

                    $userFirstName = isset($post['first_name']) ? $post['first_name'] : '';
                    $userEmailAddress = isset($post['email_address']) ? $post['email_address'] : '';
                    /*foreach($post['group_user_list'] as $key => $value)
                    {
                        if(intval($value['key']) == intval($user_id))
                        {
                            $userFirstName          = $value['first_name'];
                            $userEmailAddress       = $value['email_address'];
                        }
                    }*/

                    $groupName                  = isset($post['group_name']) ? $post['group_name'] : '';
                    $roleName                   = (isset($post['role_name']) && trim($post['role_name']) != '')  ? $post['role_name']  : 'Member';
                    $params                     = array();
                    $params['template']         = 'role-group';
                    $params['from']             = ADMIN_CONFIG['email'];
                    $params['subject']          = 'Role Assigned in '.$groupName;
                    $params['email']            = $userEmailAddress;
                    $params['toFirstName']      = $userFirstName;
                    $params['groupAdmin']       = $groupAdmin;
                    $params['roleName']         = $roleName;
                    $params['groupName']        = $groupName;

                    $mailArray[]                = $params;

                    $mailObj                    = $this->PUMailer();
                    $mailResult                 = $mailObj->roleGroupAssignMail($params);
                }
                $user_list = $this->getAdministratorTable()->getUsersOfRoleAndGroup($group_id, $role_id);


                $data = array('group_node_id' => $group_id, 'role_id' => $role_id, 'user_ids' => $user_ids, 'type' => $post['type'], 'user_list' => $user_list);
            }
        }

        print json_encode($data, JSON_FORCE_OBJECT);
        exit;
    }

    public function getRolesOfGroupAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $data = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $post['roles'] = $this->getAdministratorTable()->getRolesOfGroup($post['group_node_id']);
        }

        print json_encode($post);
        exit;
    }

    public function removeRelationAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $data = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $post['relation_id'], 'equalto');
            /* Create Instance Of Event Roles Class */
            $data = $this->eventRoleManage($post);
        }
        print json_encode($data);
        exit;
    }

    /*public function addRoleAction()
    {
        $layout                      = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                     =   $this->getRequest();
        $data                        =   array();
        if($request->isPost())
        {
            $post                    =   $request->getPost()->toArray();
            if(trim($post['role_name']) != '')
            {
                // Create Instance Of System Roles Class
                $returnSystemRolesArray                    = $this->getStructureBuilderTable()->createInstanceOfClass(SYSTEM_ROLE_CLASS_ID, '1');
                if(intval($returnSystemRolesArray['node_instance_id']) > 0)
                {
                    $propertyIdArray                        = array(SYSTEM_ROLE_NAME_PID);
                    $propertyValueArray                     = array($post['role_name']);
                    $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSystemRolesArray['node_instance_id'], $returnSystemRolesArray['node_type_id'],'N',array(),"");
                }
            }
        }

        print json_encode(array('role_id' => $returnSystemRolesArray['node_id']));
        exit;
    }*/

    public function getUsersOfRoleAndGroupAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $data = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $group_id = $post['groupId'];
            $role_id = $post['roleId'];
            $post['user_list'] = $this->getAdministratorTable()->getUsersOfRoleAndGroup($group_id, $role_id);
        }

        print json_encode($post);
        exit;
    }

    /*
     * remove actor from group
    public function removeGroupActorAction()
    {
        $layout     = $this->layout();
        $layout->setTemplate('layout/simple');

        if(!isset($_SESSION[PREFIX.'user_info']['node_id']) || !$_SESSION[PREFIX.'user_info']['node_id']){
            return $this->redirect()->toRoute('store');
        }

        $request    = $this->getRequest();
        $data       = array();
        if ($request->isPost())
        {
            $post   = $request->getPost()->toArray();

            //Remove Actor From Member Role
            $post['role_id'] = isset($post['role_id']) ? $post['role_id'] : SYSTEM_MEMBER_NODE_ID;
            $post['user_id'] = 1631794;
            $post['group_node_id'] = 2566690;

            $rolename = ($post['role_id'] == SYSTEM_MEMBER_NODE_ID) ? 'member' : strtolower($this->getRoleList()[$post['role_id']]['role']);
            $group_actor_array = $this->getAdministratorTable()->fetchRemoveUserGroupRoleInfo($post, $rolename);

            if(count($group_actor_array))
            {
                $group_node_id              = $group_actor_array[0]['group_node_id'];
                $group_node_instance_id     = $group_actor_array[0]['group_node_instance_id'];
                $system_node_id             = $group_actor_array[0]['system_node_id'];
                $system_node_instance_id    = $group_actor_array[0]['system_node_instance_id'];

                $this->getClassesTable()->commonDeleteMethod('node-instance-property', 'node_instance_id', $system_node_instance_id, 'equalto');
                $this->getClassesTable()->commonDeleteMethod('node-instance', 'node_id', $system_node_id, 'equalto');
                $this->getClassesTable()->commonDeleteMethod('node-x-y-relation', 'node_x_id', $system_node_id, 'equalto');

                // Create Instance Of Event Roles Class
                $data = $this->eventRoleManage($post);
            }
        }
        print json_encode($data);
        exit;
    }*/

    /*
     * Created By: Divya Rajput
     * Date: 14-Sept-2017
     * Common function to manage Event Role Class*/
    private function eventRoleManage($post)
    {
        $data = array();
        $returnStateArray = $this->getStructureBuilderTable()->createInstanceOfClass(EVENT_ROLE_CLASS_ID, '1');
        if (intval($returnStateArray['node_instance_id']) > 0) {
            $propertyIdArray = array(EVENT_ROLE_TIME_PID, EVENT_ROLE_ACTOR_PID, EVENT_ROLE_ROLE_PID, EVENT_ROLE_GROUP_PID, EVENT_ROLE_ACTION_PID);
            $propertyValueArray = array(strtotime("now"), $post['user_id'], $post['role_id'], $post['group_node_id'], 'Role Unassign');
            $this->getStructureBuilderTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnStateArray['node_instance_id'], $returnStateArray['node_type_id'], 'N', array(), "");
            $data['group_node_id']  = $post['group_node_id'];
            $data['role_id']        = $post['role_id'];
        }
        return $data;
    }

    /*
     * Created By: Divya Rajput
     * Date: 14-Sept-2017
     * Common function to fetch all role lists from System Role*/
    private function getRoleList()
    {
        $tempArray = $this->getAdministratorTable()->getRoleListFromSystemRoles();
        $roles_group = array_column($tempArray, 'role_id');
        $items = array_combine($roles_group, $tempArray);
        unset($items[SYSTEM_GROUP_ADMIN]);
        unset($items[SYSTEM_MEMBER_NODE_ID]);
        return $items;
    }

    /*
     * Created By: Arvind Soni
     * Date: 22-Sept-2017
     * Function to create relation between Actor And Group*/
    public function setGroupApplicationToActorAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $perticuler_apps_list = $this->getAdministratorTable()->setGroupApplicationToActor($post);
        }

        print json_encode($post['user_id'], JSON_FORCE_OBJECT);
        exit;
    }

    /*
     * Created By: Arvind Soni
     * Date: 27-Sept-2017
     * Function to create relation between Role And Group*/
    public function setGroupApplicationToRoleAction()
    {
        $layout                     = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                    = $this->getRequest();
        $post                       = array();
        if ($request->isPost()) {
            $post                   = $request->getPost()->toArray();
            $perticuler_apps_list   = $this->getAdministratorTable()->setGroupApplicationToRole($post);
        }

        print json_encode($perticuler_apps_list, JSON_FORCE_OBJECT);
        exit;
    }
}
