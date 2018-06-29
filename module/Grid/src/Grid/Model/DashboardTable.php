<?php
namespace Grid\Model;

use Zend\Db\TableGateway\AbstractTableGateway;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Predicate;
use Administrator\Model\ClassesTable;
use Administrator\Model\StructureBuilderTable;
use Api\Controller\Plugin\PUCipher;
class DashboardTable extends AbstractTableGateway
{
    protected $table = 'node';
    protected $classTableObj;
    protected $structureTableObj;
    public $adapter;

    public function __construct(Adapter $adapter)
    {
        $this->adapter            = $adapter;
        $this->resultSetPrototype = new ResultSet();
        $this->resultSetPrototype->setArrayObjectPrototype(new Grid());
        $this->initialize();
    }

    /**
     * Get object of class
     * @return object of class
     */
    public function getClassesTable() 
    {
        if (!$this->classTableObj) {
            $this->classTableObj = new ClassesTable($this->adapter);
        }
        return $this->classTableObj;
    }

    /**
     * Get object of structure
     * @return object of structure
     */
    public function getStructureTable() 
    {
        if (!$this->structureTableObj) {
            $this->structureTableObj = new StructureBuilderTable($this->adapter);
        }
        return $this->structureTableObj;
    }

    /**
        * Purpose: fetch all production_cb class instance with production name, production id and class_node_id
        * @param null
        * @return array
    */
    public function getCourseBuilderClasses($post)
    {
        return $sendSubsArray;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','node_instance_id','status'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id','value'), 'inner');
        $select->join(array('nip1' => 'node-class-property'), 'nip.node_class_property_id = nip1.node_class_property_id', array('caption'), 'inner');
        $select->where->equalTo('ni.node_class_id', PRODUCTION_CB_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
       
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $instanceArray = array();
        foreach($tempArr as $key => $value)
        {
            if(strtolower($value['caption']) == 'title')
                $value['caption'] = 'title1';

            if(strtolower($value['caption']) == 'description')
                $value['caption'] = 'desc';

            if(strtolower($value['caption']) == 'publisher')
            {
                $value['caption'] = 'title2';
                $value['value']   = 'Publisher: '.$value['value'];
            }

            if(strtolower($value['caption']) == 'icon')
            {
                $value['value']   = "public/nodeZimg/" .$value['value'];
            }

            $instanceArray[$value['node_id']][preg_replace('/\s+/', '_', strtolower($value['caption']))]   = html_entity_decode($value['value']);
            $instanceArray[$value['node_id']]['rating']                        = 5;
            $instanceArray[$value['node_id']]['production_id']                 = $value['node_id'];
            $instanceArray[$value['node_id']]['instance_node_id']              = $value['node_id'];
        }

        if(trim($post['user_id']) != '')
        {
            $sql                                    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('instance_node_id' => 'node_id','class_node_id' => 'node_class_id'));
            $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('production' => 'value'), 'INNER');
            $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni.node_instance_id AND nip1.node_class_property_id = '.SUBSCRIPTION_SUBSCRIBER_PID), array('user_id' => 'value'), 'INNER');
            $select->where->equalTo('ni.node_class_id', SUBSCRIPTION_CLASS_ID);
            $select->where->equalTo('nip1.value', $post['user_id']);

            $statement                              = $sql->prepareStatementForSqlObject($select);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $subsArray                              = $resultObj->initialize($result)->toArray();

            $subcribeProduction                     = array();
            foreach($subsArray as $key => $value)
            {
                $subcribeProduction[$value['production']] = $value['production'];
            }

            $newSubsArray   = array_keys($subcribeProduction);

            $sendSubsArray  = array();
            foreach($instanceArray as $key => $value)
            {
                if(in_array($key, $newSubsArray))
                {
                    $sendSubsArray[] = $value;
                }
            }

            return $sendSubsArray;
        }
        else
        {
            $sendSubsArray  = array();
            foreach($instanceArray as $key => $value)
            {
                
                $sendSubsArray[] = $value;
                
            }
            return $sendSubsArray;
        }
    }

    /**
        * Purpose: fetch active roles of perticuler production
        * @param data
        * @return productionRoleArray
    */
    public function activeRolesFromProduction($data)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".PRODUCTION_JSON_CLASS_ID), array('node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value'), 'INNER');
        $select->where->equalTo('nxyr.node_y_id', $data['productionId']);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $productionJSON                         = $resultObj->initialize($result)->toArray();

        $production_json                        = $this->checkCustomHtml($productionJSON[0]['value']);

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

        return array($productionRoleArray,$production_json[$operationKey]['actions']['controllerID']);
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
        * Purpose: fetch production list
        * @param post
        * @return productionList
    */
    public function getProductionListOfCourse($post)
    {
        $productionList                                 =   array();
        $courseInstanceId                               =   $post['course_instance_id'];
        $courseInstanceNodeId                           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $courseInstanceId);
        $status                                         =   $post['status'];
        $fetchRecord                                    =   $this->getAllProductionDetailsInstancesOfCourseClass($courseInstanceNodeId);
        $userExist                                      =   'Y';
        if(strtolower($status) == 'published')
            $status                                     = 'P';
        else
            $status                                     = 'D';
        
        foreach ($fetchRecord as $key => $value) 
        {
            /* For Create Production List Array Of Course */
            $productionList[$value['production_details_node_id']]['production_node_id']                                                             = $value['production_details_node_id'];
            $productionList[$value['production_details_node_id']]['template_id']                                                                    = $value['production_id'];
            $productionList[$value['production_details_node_id']]['production_id']                                                                  = $value['production_id'];
            $productionList[$value['production_details_node_id']]['production_name']                                                                = $value['production_name'];
            $productionList[$value['production_details_node_id']]['status']                                                                         = $status;
            $productionList[$value['production_details_node_id']]['users'][$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))] = $value['user_name'];
            $productionList[$value['production_details_node_id']]['users'][$value['user_id']]['user_id']                                            = $value['user_id'];
            $productionList[$value['production_details_node_id']]['users'][$value['user_id']]['email']                                              = $value['email'];
            $productionList[$value['production_details_node_id']]['users'][$value['user_id']]['role_id']                                            = $value['role_id'];
        }

        foreach($productionList as $key => $valueArray)
        {
            $tempArray                                      =       $this->getClassProductionCbANndJson($valueArray['template_id']);
            $operationKey                                   =       $this->getFirstOperationKey($tempArray['production_json']);

            if(!isset($valueArray['users'][$post['userID']]))
            {
                $userExist                                      =   'N';
            }
            //$productionList[$key]['userExist']                  = $userExist;

            if(intval($tempArray['production_json'][$operationKey]['actions']['controllerID']) == intval($valueArray['users'][$post['userID']]['role_id']))
            {
                $productionList[$key]['is_primary_controller']  = $post['userID'];
            }
            else
            {
                $productionList[$key]['is_primary_controller']  = '';
            }
        }

        $temp = array_keys($productionList);

        rsort($temp);

        $newProductionList = array();
        if($userExist == 'Y')
        {
            foreach($temp as $key => $value)
            {
                $newProductionList[' '.$value] = $productionList[$value];
            }
        }

        return $newProductionList;
    }

    /**
        * Function use here to fetch all production of selected course instance id
        * @param type $courseInstanceNodeId
        * @return resultAry
    */
    public function getAllProductionDetailsInstancesOfCourseClass($courseInstanceNodeId)
    {
        $sql                             = new Sql($this->adapter);
        $subSelect                       = $sql->select();
        $subSelect->from(array('nxyr' => 'node-x-y-relation'));
        $subSelect->columns(array('production_details_node_id'=>'node_x_id'));
        $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.PRODUCTION_DETAILS_CLASS_ID), array('status'=>'status','production_details_instance_id'=>'node_instance_id','production_details_node_id'=>'node_id'));
        $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.PRODUCTION_DETAILS_NAME_PID), array('production_name_pid'=>'node_class_property_id','production_name'=>'value'));
        $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.PRODUCTION_DETAILS_ID_PID), array('production_id_pid'=>'node_class_property_id','production_id'=>'value'));
        $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array());
        $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id='.INDIVIDUAL_ACTORID_PROP_ID), array('user_id'=> 'value'));
        $subSelect->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip5.node_instance_id AND nip5.node_class_property_id='.INDIVIDUAL_ROLE_PROP_ID), array('role_id' => 'value'));
        $subSelect->join(array('ni2' => 'node-instance'),'ni2.node_id = nip1.value', array());
        $subSelect->join(array('nip4' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.','.INDIVIDUAL_PROFILE_IMAGE.')'), array('user_name'=>'value'));
        $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip4.node_class_property_id', array('caption'));
        $subSelect->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = ni2.node_id', array());
        $subSelect->join(array('ni3' => 'node-instance'),new Predicate\Expression('ni3.node_id = nxyr2.node_x_id AND ni3.node_class_id = '.ACCOUNT_CLASS_ID), array());
        $subSelect->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni3.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('email'=>'value'));
        $subSelect->where->equalTo('nxyr.node_y_id',$courseInstanceNodeId);
     
        $statement                      =   $sql->prepareStatementForSqlObject($subSelect);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        return $resultAry               =   $resultObj->initialize($result)->toArray();
    }

    /**
        * Purpose: fetch course details
        * @param post
        * @return productionList
    */
    public function getCourse($post)
    {
        $course                         =   array();
        $courseInstanceId               =   $post['course_instance_id'];
        $fetchRecord                    =   $this->getCourseInstances($courseInstanceId);

        $course_node_id                 =   '';
        $course_title                   =   '';
        foreach ($fetchRecord as $key => $value) 
        {
            $course_node_id                                                                                                                    = $value['course_node_id'];
            $course[$value['course_node_id']]['course_instance_id']                                                                            = $value['course_instance_id'];
            $course[$value['course_node_id']]['course_node_id']                                                                                = $value['course_node_id'];
            $course[$value['course_node_id']]['course_status']                                                                                 = $value['course_status'];
            $course[$value['course_node_id']]['property'][str_replace(' ', '_', strtolower($value['course_prop_name']))]['course_prop_id']     = $value['course_prop_id'];
            $course[$value['course_node_id']]['property'][str_replace(' ', '_', strtolower($value['course_prop_name']))]['course_prop_val']    = $value['course_prop_val'];

            if(str_replace(' ', '_', strtolower($value['course_prop_name'])) == 'title')
                $course_title                   =   $value['course_prop_val'];

        }

        if($post['production_node_id'] != '')
        {
            $returnList                                                                                                 = $this->getPerticulerProductionDetailsOfCourse($post['course_instance_id'],$post['production_node_id'],$post['userID']);
            $course[$course_node_id]['production']                                                                      = $returnList['productionList'];
            $course['productionDataList']                                                                               = $returnList['productionDataList'];
            $course['course_details']                                                                                   = array('course_name' => $course_title ,'production_name' => current($returnList['productionList'])['property']['production_name']['property_val'] ,'all_users' => current($returnList['productionList'])['users']);
        }

        return $course;
    }

    /**
        * Function use here to fetch selected course instance data
        * @param type $courseInstanceId
        * @return resultAry
    */
    public function getCourseInstances($courseInstanceId)
    {
        $sql                             = new Sql($this->adapter);
        $subSelect                       = $sql->select();
        $subSelect->from(array('ni' => 'node-instance'));
        $subSelect->columns(array('course_node_id'=>'node_id', 'course_instance_id'=>'node_instance_id', 'course_status'=>'status'));
        $subSelect->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('course_prop_id' => 'node_class_property_id', 'course_prop_val'=>'value'),'left');
        $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('course_prop_name'=>'caption'),'left');
        $subSelect->where->equalTo('ni.node_instance_id',$courseInstanceId);
     
        $statement                      =   $sql->prepareStatementForSqlObject($subSelect);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        return $resultAry               =   $resultObj->initialize($result)->toArray();
    }

    /**
        * Purpose: fetch particuler production details of course
        * @param post
        * @return productionList
    */
    public function getPerticulerProductionDetailsOfCourse($course_instance_id,$production_node_id,$user_id)
    {
        $courseInstanceNodeId           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $course_instance_id);
        $fetchRecord                    =   $this->getAllProductionDetailsInstancesOfCourseClass($courseInstanceNodeId);
        $roleArray                      =   $this->getRoleList();
        $productionList                 =   array();
        $productionDataList             =   array();

        $post['course_instance_id']     =   $course_instance_id;
        $post['production_node_id']     =   $production_node_id;
        $post['userID']                 =   $user_id;

        $courseProductionArray          =   $this->getCourseProductionDetails($post);
        $classProductionArray           =   $this->getClassProductionCbANndJson($courseProductionArray['production_details_nid']);
        
        foreach ($fetchRecord as $key => $value) 
        {
            if($production_node_id == $value['production_details_node_id'])
            {
                $productionList[' '.$value['production_details_node_id']]['production_instance_id']                                                         = $value['production_details_instance_id'];
                $productionList[' '.$value['production_details_node_id']]['production_node_id']                                                             = $value['production_details_node_id'];
                $productionList[' '.$value['production_details_node_id']]['template_id']                                                                    = $value['production_id'];
                $productionList[' '.$value['production_details_node_id']]['property']['production_name']['property_id']                                     = $value['production_name_pid'];
                $productionList[' '.$value['production_details_node_id']]['property']['production_name']['property_val']                                    = $value['production_name'];
                $productionList[' '.$value['production_details_node_id']]['property']['production_nid']['property_id']                                      = $value['production_id_pid'];
                $productionList[' '.$value['production_details_node_id']]['property']['production_nid']['property_val']                                     = $value['production_id'];
                $productionList[' '.$value['production_details_node_id']]['users'][$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))] = $value['user_name'];
                $productionList[' '.$value['production_details_node_id']]['users'][$value['user_id']]['user_id']                                            = $value['user_id'];
                $productionList[' '.$value['production_details_node_id']]['users'][$value['user_id']]['email']                                              = $value['email'];
                $productionList[' '.$value['production_details_node_id']]['users'][$value['user_id']]['role_id']                                            = $value['role_id'];
                $productionList[' '.$value['production_details_node_id']]['users'][$value['user_id']]['role_name']                                          = $roleArray[$value['role_id']];

                $tempDataList                                       =   $this->getProductionDataInstanceList($value['production_details_node_id']);

                foreach($tempDataList as $k => $production_data_node_id)
                {
                    $permissionProductionArray                      =   $this->getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$classProductionArray,$production_data_node_id);
                    //if(strtolower($permissionProductionArray['permission']) == 'view' || strtolower($permissionProductionArray['permission']) == 'edit' || strtolower($permissionProductionArray['permission']) == 'both')
                    $productionDataList[$production_data_node_id]                           =   $production_data_node_id;
                }
                
            }    
        }

        if(count($productionDataList) > 0)
        {
            rsort($productionDataList);
        }

        return array('productionList' => $productionList, 'productionDataList' => $productionDataList);
    }

    /**
        * Purpose: fetch perticuler production_cb class instance 
        * @param course_instance_id
        * @return array
    */
    public function getCourseBuilderProductionTemplateId($course_instance_id)
    {
        $courseInstanceId               =   $course_instance_id;
        $courseInstanceNodeId           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $courseInstanceId);
        $fetchRecord                    =   $this->getCourseInstances($courseInstanceId);

        $course_production_class_node_id                 =   '';
        foreach ($fetchRecord as $key => $value) 
        {
            if(str_replace(' ', '_', strtolower($value['course_prop_name'])) == 'course_template' && $value['course_prop_id'] == '2049')
            $course_production_class_node_id             = $value['course_prop_val'];
        }

        $tempArray = array();
        if(trim($course_production_class_node_id) != '')
        {
            $sql                                    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nxyr' => 'node-x-y-relation'));
            $select->columns(array('node_x_id'));
            $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("nxyr.node_x_id = ni.node_id and ni.node_class_id = ".PRODUCTION_CB_CLASS_ID), array('node_id','node_instance_id'), 'INNER');
            $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".PRODUCTION_CB_TITLE_PID), array('value'), 'INNER');
            $select->where->equalTo('nxyr.node_y_id', $course_production_class_node_id);
            $statement                              = $sql->prepareStatementForSqlObject($select);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $tempArray                              = $resultObj->initialize($result)->toArray();
        }

        return array('node_id' => $tempArray[0]['node_id'],'name' => $tempArray[0]['value']);
    }

    /**
        * Fetch all instances from class ROLE_CB
        * @param group name
        * @return rolesArray
    */
    public function getRoleList() 
    {
        $tempArray = $this->getStructureTable()->getInstanceListOfParticulerClass(ROLE_CB_CLASS_ID,'class','node_id');
        $rolesArray = array();
        foreach($tempArray as $roleId => $roles)
        {
            $rolesArray[$roleId] = $roles['Role'];
        }

        return $rolesArray;
    }

    /**
        * Fetch production form from course class
        * @param post array
        * @return array
    */
    public function getProductionTemplate($post)
    {
        $courseProductionArray                          =   $this->getCourseProductionDetails($post);
        $classProductionArray                           =   $this->getClassProductionCbANndJson($courseProductionArray['production_details_nid']);
        if(trim($post['production_data_node_id']) != '')
        {
            $permissionProductionArray                  =   $this->getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$classProductionArray,$post['production_data_node_id']);

            $action                                     =   $classProductionArray['production_json'][$permissionProductionArray['operationKey']]['actions'];
            if($permissionProductionArray['permission'] == 'view' || $permissionProductionArray['permission'] == '')
            {
                $classProductionArray['production_json'][$permissionProductionArray['operationKey']]['actions'] = array();
            }

            if(array_key_exists('customHTML', $classProductionArray['production_json'][$permissionProductionArray['operationKey']]))
            {
                $classProductionArray['production_json'][$permissionProductionArray['operationKey']]['actions'] = $action;
            }
        }
        else
        {
            $permissionProductionArray                   =   $this->getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$classProductionArray);
        }

        $formJson                                        =   $classProductionArray['production_json'][$permissionProductionArray['operationKey']];

        if($permissionProductionArray['instance_id'] != '' && count($permissionProductionArray['manageInstanceValue']) > 0)
        {
            $formJson['nodes']                           =   $this->setInputValueOnProductionJsonArray($formJson['nodes'],$permissionProductionArray['manageInstanceValue']);
        }
        

        if(trim($permissionProductionArray['permission']) == "")
        {
            if(intval($formJson['actions']['controllerID']) != intval($courseProductionArray['production_details_user']['role_id']))
            {
                $formJson['actions']                    = array();
            }
             
        }
        return array(
                        'post'                          => $post,
                        'courseProductionArray'         => $courseProductionArray,
                        'classProductionArray'          => $classProductionArray,
                        'permissionProductionArray'     => $permissionProductionArray,
                        'formJson'                      => $formJson
                    );
    }

    /**
        * Fetch course, production details and user details from course and production details instance
        * @param post
        * @return Array
    */
    public function getCourseProductionDetails($post)
    {
        $course                                             =   array();
        /* Fetch Information About Course And Class Which Class Instance Actually Update */
        $courseInstanceId                                   =   $post['course_instance_id'];
        $fetchRecord                                        =   $this->getCourseInstances($courseInstanceId);

        $course_node_id                                     =   '';
        $course_created_by_id                               =   '';
        foreach ($fetchRecord as $key => $value) 
        {
            $course_node_id                                 =   $value['course_node_id'];
            if(intval($value['course_prop_id']) == COURSE_CREATED_ID)
            $course_created_by_id                           =   $value['course_prop_val'];
        }

        /* Fetch Information About Production Details And Instance With Users Which Instance Actually Update */
        $fetchRecord                                        =   $this->getAllProductionDetailsInstancesOfCourseClass($course_node_id);
        $roleArray                                          =   $this->getRoleList();
        $productionDeatils                                  =   array();
        foreach ($fetchRecord as $key => $value) 
        {
            if($post['production_node_id'] == $value['production_details_node_id'])
            {
                $productionDeatils['production_details_instance_id']                                                           = $value['production_details_instance_id'];
                $productionDeatils['production_details_node_id']                                                               = $value['production_details_node_id'];
                $productionDeatils['production_name']                                                                          = $value['production_name'];
                $productionDeatils['production_nid']                                                                           = $value['production_id'];
                $productionDeatils['users'][$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))]           = $value['user_name'];
                $productionDeatils['users'][$value['user_id']]['user_id']                                                      = $value['user_id'];
                $productionDeatils['users'][$value['user_id']]['email']                                                        = $value['email'];
                $productionDeatils['users'][$value['user_id']]['role_id']                                                      = $value['role_id'];
                $productionDeatils['users'][$value['user_id']]['role_name']                                                    = $roleArray[$value['role_id']];
            }    
        }

        /* Send Course, Production, Users, Class And Instance Details */
        $course['course_instance_id']                                   =   $post['course_instance_id'];
        $course['course_node_id']                                       =   $course_node_id;
        $course['course_created_by_id']                                 =   $course_created_by_id;
        $course['production_details_instance_id']                       =   $productionDeatils['production_details_instance_id'];
        $course['production_details_node_id']                           =   $productionDeatils['production_details_node_id'];
        $course['production_details_name']                              =   $productionDeatils['production_name'];
        $course['production_details_nid']                               =   $productionDeatils['production_nid'];
        $course['production_details_user']                              =   $productionDeatils['users'][$post['userID']];

        return $course;
    }

    public function getClassProductionCbANndJson($production_cb_node_id)
    {
        $node_instance_id                       =   $this->getClassesTable()->getNodeId('node-instance', 'node_id', $production_cb_node_id,'node_instance_id');
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyr.node_x_id', array('node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value'), 'INNER');
        $select->where->equalTo('ni.node_class_id', PRODUCTION_JSON_CLASS_ID);
        $select->where->AND->equalTo('nxyr.node_y_id', $production_cb_node_id);
        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $productionJSON                         = $resultObj->initialize($result)->toArray();

        $json                                   = $this->checkCustomHtml($productionJSON[0]['value']);

        $returnArray['production_cb_instance_id']               = $node_instance_id;
        $returnArray['production_cb_instance_node_id']          = $production_cb_node_id;
        $returnArray['production_json_instance_id']             = $productionJSON[0]['node_instance_id'];
        $returnArray['production_json_node_id']                 = $productionJSON[0]['node_x_id'];
        $returnArray['production_json']                         = $json;//json_decode(html_entity_decode($productionJSON[0]['value']),true);

        return $returnArray;
    }

    /**
        * Fetch permission, operationKey, manageInstance, manageInstanceValue, instance_id, class_id, roleId from course and production details class
        * @param $courseProductionArray,$classProductionArray,$production_data_node_id
        * @return sendArray
    */
    public function getPermissionDataAndOperationKeyWithUserPermission($courseProductionArray,$classProductionArray,$production_data_node_id = "")
    {
        $sendArray                                          = array();
        $permissionWithRolesArray                           = $this->getActiveRolesFromProductionJsonArray($classProductionArray['production_json']);
        $roleId                                             = '';
        $operationKey                                       = '';
        $permission                                         = '';
        $manageInstance                                     = array();
        $manageInstanceValueArray                           = array();
        $class_id                                           = '';
        $instance_id                                        = '';
        $roleId                                             = $courseProductionArray['production_details_user']['role_id'];

        if($production_data_node_id == "")
        {
            $operationKey                                   = $this->getFirstOperationKey($classProductionArray['production_json']);
            $permission                                     = $this->getPermissionFromKey($permissionWithRolesArray,$roleId,$operationKey);
        }
        else
        {
            $production_data                                = $this->getClassesTable()->getInstanceListOfParticulerClass($production_data_node_id, 'node', 'node_instance_id');
            $production_data_instance_id                    = array_keys($production_data)[0];
            $active_production                              = $production_data[$production_data_instance_id]['Active Production'];
            $active_operation                               = $production_data[$production_data_instance_id]['Active Operation'];
            $active_variables                               = $production_data[$production_data_instance_id]['Active Variables'];

            if(intval($courseProductionArray['production_details_nid']) == intval($active_production))
            {
                $operationKey                               = $active_operation;
                $permission                                 = $this->getPermissionFromKey($permissionWithRolesArray,$roleId,$operationKey);

                $manageInstance                             = $this->getManageInstanceList($production_data_node_id);
                $instance_id_of_class                       = '';
                foreach($manageInstance as $key => $value)
                {
                    if(intval($value['Class Id']) == intval($classProductionArray['production_json'][$operationKey]['dataClass']))
                    {
                        $class_id                           = $value['Class Id'];
                        $instance_id                        = $value['Instance Id'];
                    }
                }

                if(intval($instance_id) > 0)
                {
                    $manageInstanceValueArray               = $this->getInstanceDataOfParticulerInstance($instance_id);
                }
            }
            else
            {

            }
            
        }
        
        
        $sendArray['permissionArray']                       = $permissionWithRolesArray;
        $sendArray['roleId']                                = $roleId;
        $sendArray['operationKey']                          = $operationKey;
        $sendArray['permission']                            = $permission;
        $sendArray['manageInstance']                        = $manageInstance;
        $sendArray['class_id']                              = $class_id;
        $sendArray['instance_id']                           = $instance_id;
        $sendArray['production_data_node_id']               = $production_data_node_id;
        $sendArray['manageInstanceValue']                   = $manageInstanceValueArray;
        $sendArray['variables']                              = $active_variables;
        return $sendArray;
    }

    /**
     * For get permission from key of production json
     * @param $permissionWithRolesArray, $roleId, $operationKey
     * @return permission
     */
    public function getPermissionFromKey($permissionWithRolesArray,$roleId,$operationKey)
    {
        $permission                                     = '';
        if($permissionWithRolesArray[$operationKey][$roleId]['view'] && $permissionWithRolesArray[$operationKey][$roleId]['edit'])
        {
            $permission                                     = 'both';
        }
        else
        {
            if($permissionWithRolesArray[$operationKey][$roleId]['view'])
                $permission                                     = 'view';
            else if($permissionWithRolesArray[$operationKey][$roleId]['edit'])
                $permission                                     = 'edit';
        }

        return $permission;
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
            if(array_key_exists("nodes",$production_json[$key]))
            $roleArrayWirhPermission                             = $this->getPermissionArray($production_json[$key]['nodes'],$roleArrayWirhPermission,$key);
            else
            {
                $roleArrayWirhPermission[$key][$production_json[$key]['actions']['controllerID']]['roleName']   = $production_json[$key]['actions']['controller'];
                $roleArrayWirhPermission[$key][$production_json[$key]['actions']['controllerID']]['roleID']     = $production_json[$key]['actions']['controllerID'];
                $roleArrayWirhPermission[$key][$production_json[$key]['actions']['controllerID']]['view']       = true;
            }
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
     * For saving production template form
     * @param $post
     * @return array
     */
    public function saveProductionTemplate($post)
    {
        /* For Changes Course Update Time Stamp Property Value Each Time When Any Action Occure On Production Or Course */
        if($post['production_details_node_id'] != '')
        {
            $sql                                    = new Sql($this->adapter);
            $select                                 = $sql->select();
            $select->from(array('nxyr' => 'node-x-y-relation'));
            $select->columns(array('node_y_id'));
            $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("nxyr.node_y_id = ni.node_id and ni.node_class_id = ".COURSE_CLASS_ID), array('node_id','node_instance_id'), 'INNER');
            $select->where->equalTo('nxyr.node_x_id', $post['production_details_node_id']);
            $statement                              = $sql->prepareStatementForSqlObject($select);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $courseArray                            = $resultObj->initialize($result)->toArray();

            $data                                   = array();
            $data['value']                          = date('Y-m-d H:i:s');
            $sql                                    = new Sql($this->adapter);
            $query                                  = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where->equalTo('node_instance_id' , $courseArray[0]['node_instance_id']);
            $query->where->AND->equalTo('node_class_property_id', COURSE_UPDATE_TIME_ID);
            $statement                              = $sql->prepareStatementForSqlObject($query);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $resultObj->initialize($result);
        }

        $notificationArray                          = $this->sendNotificationAndEmail($post);

        $returnArray                                = array();
        if($post['production_data_node_id'] != '')
        {
            /* Create Production Data Instance */
            $production_data_instance_id                = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $post['production_data_node_id'],'node_instance_id');
            
            if(intval($production_data_instance_id) > 0)
            {
                $propertyIdArray        = array(PRODUCTION_DATA_PRO_PID,PRODUCTION_DATA_OPE_PID,PRODUCTION_DATA_VAR_PID);
                $propertyValueArray     = array($post['targetProduction'],$post['target'],json_encode($post['variables']));

                foreach($propertyIdArray as $key => $propertyId)
                {
                    $this->updateInstanceProperty($production_data_instance_id,$propertyId,$propertyValueArray[$key],"N");
                }
            }

            if($post['instance_id'] != '' && trim($post['instance_id']) != '--')
            {
                /* Update Template Class Instance */
                $returnTemplateArray['node_id']             = $post['instance_id'];
                $node_instance_id                           = $this->getClassesTable()->getNodeId('node-instance', 'node_id', $post['instance_id'],'node_instance_id');
                $instance_property_id                       = array();
                $instance_property_caption                  = array();
                foreach($post['nodes'] as $key => $val)
                {
                    if(array_key_exists('nodeID', $val))
                    {
                        $instance_property_id[]                 = $this->getClassesTable()->getNodeId('node-class-property', 'node_id', $val['nodeID'],'node_class_property_id');
                        $val['value'] = str_replace('public/nodeZimg/', '', $val['value']);
                        $instance_property_caption[]            = $val['value'];
                    }
                }

                foreach($instance_property_id as $key => $propertyId)
                {
                    $this->updateInstanceProperty($node_instance_id,$propertyId,$instance_property_caption[$key],"Y");
                }

            }
            else
            {
                /* Create Template Class Instance */
                if(trim($post['class_id']) != '')
                {
                    $node_class_id                              = $post['class_id'];
                    $instance_property_id                       = array();
                    $instance_property_caption                  = array();
                    foreach($post['nodes'] as $key => $val)
                    {
                        if(array_key_exists('nodeID', $val))
                        {
                            $instance_property_id[]                 = $this->getClassesTable()->getNodeId('node-class-property', 'node_id', $val['nodeID'],'node_class_property_id');
                            $instance_property_caption[]            = $val['value'];
                        }
                    }

                    $returnTemplateArray                        = $this->getStructureTable()->createInstanceOfClass($node_class_id, '1');
                    if(intval($returnTemplateArray['node_instance_id']) > 0)
                    {
                        $this->getStructureTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $returnTemplateArray['node_instance_id'], $returnTemplateArray['node_type_id'],'N',array(),"");
                    }

                    $post['instance_id']                        = $returnTemplateArray['node_id'];
                }
            }

            if(trim($post['instance_id']) == '--' && trim($post['class_id']) == '')
            {
                /* Create Manage Instance Class Instance */
                $returnManageInstanceArray                  = $this->getStructureTable()->createInstanceOfClass(MANAGE_INSTANCE_CLASS_ID, '1');
                if(intval($returnManageInstanceArray['node_instance_id']) > 0)
                {
                    $propertyIdArray        = array(MANAGE_INSTANCE_CLASS_PID,MANAGE_INSTANCE_INSTANCE_PID,MANAGE_INSTANCE_OPERATION_PID);
                    $propertyValueArray     = array('--','--',$post['operationKey']);
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnManageInstanceArray['node_instance_id'], $returnManageInstanceArray['node_type_id'],'N',array(),"");
                }

                // Create XY Relation Between Production Data And Manage Instance
                $this->getStructureTable()->createXYRelation($post['production_data_node_id'], $returnManageInstanceArray['node_id']);

                $returnArray = array('production_data_id' => $post['production_data_node_id'],'manage_instance_id' => $returnManageInstanceArray['node_id'],'class_instance_id' => '--');
            }
            else
            {
                /* Create Manage Instance Class Instance */
                $returnManageInstanceArray                  = $this->getStructureTable()->createInstanceOfClass(MANAGE_INSTANCE_CLASS_ID, '1');
                if(intval($returnManageInstanceArray['node_instance_id']) > 0)
                {
                    $propertyIdArray        = array(MANAGE_INSTANCE_CLASS_PID,MANAGE_INSTANCE_INSTANCE_PID,MANAGE_INSTANCE_OPERATION_PID);
                    $propertyValueArray     = array($post['class_id'],$post['instance_id'],$post['operationKey']);
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnManageInstanceArray['node_instance_id'], $returnManageInstanceArray['node_type_id'],'N',array(),"");
                }

                // Create XY Relation Between Production Data And Manage Instance
                $this->getStructureTable()->createXYRelation($post['production_data_node_id'], $returnManageInstanceArray['node_id']);

                $returnArray = array('production_data_id' => $post['production_data_node_id'],'manage_instance_id' => $returnManageInstanceArray['node_id'],'class_instance_id' => $returnTemplateArray['node_id']);
            }
        }
        else
        {
            if($post['nodes'] == 'customHTML')
            {
                /* Create Production Data Instance */
                $returnProductionDataArray                  = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_DATA_CLASS_ID, '1');
                if(intval($returnProductionDataArray['node_instance_id']) > 0)
                {
                    $propertyIdArray        = array(PRODUCTION_DATA_PDI_PID,PRODUCTION_DATA_SERIES_PID,PRODUCTION_DATA_SEGMENT_PID,PRODUCTION_DATA_PRO_PID,PRODUCTION_DATA_OPE_PID,PRODUCTION_DATA_VAR_PID);
                    $propertyValueArray     = array($post['production_details_node_id'],'-','-',$post['targetProduction'],$post['target'],json_encode($post['variables']));
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnProductionDataArray['node_instance_id'], $returnProductionDataArray['node_type_id'],'N',array(),"");
                }

                // Create XY Relation Between Production Details And Production Data
                $this->getStructureTable()->createXYRelation($post['production_details_node_id'], $returnProductionDataArray['node_id']);

                /* Create Manage Instance Class Instance */
                $returnManageInstanceArray                  = $this->getStructureTable()->createInstanceOfClass(MANAGE_INSTANCE_CLASS_ID, '1');
                if(intval($returnManageInstanceArray['node_instance_id']) > 0)
                {
                    $propertyIdArray        = array(MANAGE_INSTANCE_CLASS_PID,MANAGE_INSTANCE_INSTANCE_PID,MANAGE_INSTANCE_OPERATION_PID);
                    $propertyValueArray     = array('--','--',$post['operationKey']);
                    $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnManageInstanceArray['node_instance_id'], $returnManageInstanceArray['node_type_id'],'N',array(),"");
                }

                // Create XY Relation Between Production Data And Manage Instance
                $this->getStructureTable()->createXYRelation($returnProductionDataArray['node_id'], $returnManageInstanceArray['node_id']);

                $returnArray = array('production_data_id' => $returnProductionDataArray['node_id'],'manage_instance_id' => $returnManageInstanceArray['node_id'],'class_instance_id' => '--');
            }
            else
            {
                $instance_property_id                       = array();
                $instance_property_caption                  = array();
                foreach($post['nodes'] as $key => $val)
                {
                    if(trim($val['value']) != '')
                    {
                        $instance_property_id[]                 = $this->getClassesTable()->getNodeId('node-class-property', 'node_id', $val['nodeID'],'node_class_property_id');

                        $val['value'] = str_replace('public/nodeZimg/', '', $val['value']);

                        $instance_property_caption[]            = $val['value'];
                    }
                }

                if(count($instance_property_id) > 0 && count($instance_property_caption) > 0 && count($instance_property_id) == count($instance_property_caption))
                {
                    /* Create Production Data Instance */
                    $returnProductionDataArray                  = $this->getStructureTable()->createInstanceOfClass(PRODUCTION_DATA_CLASS_ID, '1');
                    if(intval($returnProductionDataArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray        = array(PRODUCTION_DATA_PDI_PID,PRODUCTION_DATA_SERIES_PID,PRODUCTION_DATA_SEGMENT_PID,PRODUCTION_DATA_PRO_PID,PRODUCTION_DATA_OPE_PID,PRODUCTION_DATA_VAR_PID);
                        $propertyValueArray     = array($post['production_details_node_id'],'-','-',$post['targetProduction'],$post['target'],json_encode($post['variables']));
                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnProductionDataArray['node_instance_id'], $returnProductionDataArray['node_type_id'],'N',array(),"");
                    }

                    // Create XY Relation Between Production Details And Production Data
                    $this->getStructureTable()->createXYRelation($post['production_details_node_id'], $returnProductionDataArray['node_id']);

                    /* Create Template Class Instance */
                    $node_class_id                              = $post['class_id'];
                    

                    $returnTemplateArray                        = $this->getStructureTable()->createInstanceOfClass($node_class_id, '1');
                    if(intval($returnTemplateArray['node_instance_id']) > 0)
                    {
                        $this->getStructureTable()->createInstanceProperty($instance_property_id, $instance_property_caption, $returnTemplateArray['node_instance_id'], $returnTemplateArray['node_type_id'],'N',array(),"");
                    }

                    /* Create Manage Instance Class Instance */
                    $returnManageInstanceArray                  = $this->getStructureTable()->createInstanceOfClass(MANAGE_INSTANCE_CLASS_ID, '1');
                    if(intval($returnManageInstanceArray['node_instance_id']) > 0)
                    {
                        $propertyIdArray        = array(MANAGE_INSTANCE_CLASS_PID,MANAGE_INSTANCE_INSTANCE_PID,MANAGE_INSTANCE_OPERATION_PID);
                        $propertyValueArray     = array($post['class_id'],$returnTemplateArray['node_id'],$post['operationKey']);
                        $this->getStructureTable()->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnManageInstanceArray['node_instance_id'], $returnManageInstanceArray['node_type_id'],'N',array(),"");
                    }

                    // Create XY Relation Between Production Data And Manage Instance
                    $this->getStructureTable()->createXYRelation($returnProductionDataArray['node_id'], $returnManageInstanceArray['node_id']);

                    $returnArray = array('production_data_id' => $returnProductionDataArray['node_id'],'manage_instance_id' => $returnManageInstanceArray['node_id'],'class_instance_id' => $returnTemplateArray['node_id']);
                }
                else
                {
                    $returnArray = array('msg' => 'Data Not Saved Because Fileds Are Blanks.');
                }
            }
        }

        $returnArray['notification'] = $notificationArray;
        return $returnArray;
    }

    public function sendNotificationAndEmail($post)
    {
        $prefixTitle                                        =   PREFIX.'user_info';
        $login_user_id                                      =   isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';
        /*Code Start For Notification User, Notification All And Email */
        $sql                                                =   new Sql($this->adapter);
        $select                                             =   $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_y_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("nxyr.node_y_id = ni.node_id and ni.node_class_id = ".COURSE_CLASS_ID), array('node_id','node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".COURSE_TITLE_ID), array('course_name' => 'value'), 'INNER');
        $select->where->equalTo('nxyr.node_x_id', $post['production_details_node_id']);
        $statement                                          =   $sql->prepareStatementForSqlObject($select);
        $result                                             =   $statement->execute();
        $resultObj                                          =   new ResultSet();
        $courseArray                                        =   $resultObj->initialize($result)->toArray();

        $fetchRecord                                        =   $this->getAllProductionDetailsInstancesOfCourseClass($courseArray[0]['node_id']);
        $roleArray                                          =   $this->getRoleList();
        $productionDeatils                                  =   array();
        foreach ($fetchRecord as $key => $value) 
        {
            if($post['production_details_node_id'] == $value['production_details_node_id'])
            {
                $productionDeatils['production_details_instance_id']                                                           = $value['production_details_instance_id'];
                $productionDeatils['production_details_node_id']                                                               = $value['production_details_node_id'];
                $productionDeatils['production_name']                                                                          = $value['production_name'];
                $productionDeatils['production_nid']                                                                           = $value['production_id'];
                $productionDeatils['users'][$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))]           = $value['user_name'];
                $productionDeatils['users'][$value['user_id']]['user_id']                                                      = $value['user_id'];
                $productionDeatils['users'][$value['user_id']]['email']                                                        = $value['email'];
                $productionDeatils['users'][$value['user_id']]['role_id']                                                      = $value['role_id'];
                $productionDeatils['users'][$value['user_id']]['role_name']                                                    = $roleArray[$value['role_id']];
            }    
        }

        $productionDeatils['production_json']               =   $this->getClassProductionCbANndJson($productionDeatils['production_nid'])['production_json'];

        $notificationArray                                  =   CB_NOTIFICATION;
        $notificationContent                                =   NOTIFICATION_CONTENT;
        $courseName                                         =   $courseArray[0]['course_name'];
        $productionName                                     =   $productionDeatils['production_name'];
        $notification_user                                  =   '';
        $notification_all                                   =   '';
        $email                                              =   '';
        foreach($post['variables'] as $key => $value)
        {
            if(isset($value[$notificationArray[0]]))
            {
                $notification_user                          =   $value[$notificationArray[0]];
            }

            if(isset($value[$notificationArray[1]]))
            {
                $notification_all                           =   $value[$notificationArray[1]];
            }

            if(isset($value[$notificationArray[2]]))
            {
                $email                                      =   $value[$notificationArray[2]];
            }
        }

        $returnArray                                            =   array();
        $nextUserId                                             =   '';
        $senderUserArray                                        =   $productionDeatils['users'][$login_user_id];
        $senderUserArray['profile_image']                       =   $_SESSION[$prefixTitle]['profile_image'];
        $nextCUserArray                                         =   array();
        
        
        $roleId                                                 = $productionDeatils['production_json'][$post['target']]['actions']['controllerID'];
        foreach($productionDeatils['users'] as $userId => $userArray)
        {
            if(intval($userArray['role_id']) == intval($roleId))
            {
                $reciverUserArray                               = $userArray;
                $nextCUserArray                                 = $userArray;
                if(trim($notification_user) != '')
                {
                    $notification_user                      = str_replace("##sFirstName##", $senderUserArray['first_name'], $notification_user);
                    $notification_user                      = str_replace("##sLastName##", $senderUserArray['last_name'], $notification_user);
                    $notification_user                      = str_replace("##sEmail##", $senderUserArray['email'], $notification_user);
                    $notification_user                      = str_replace("##sRoleName##", $senderUserArray['role_name'], $notification_user);

                    $notification_user                      = str_replace("##rFirstName##", $reciverUserArray['first_name'], $notification_user);
                    $notification_user                      = str_replace("##rLastName##", $reciverUserArray['last_name'], $notification_user);
                    $notification_user                      = str_replace("##rEmail##", $reciverUserArray['email'], $notification_user);
                    $notification_user                      = str_replace("##rRoleName##", $reciverUserArray['role_name'], $notification_user);

                    $notification_user                      = str_replace("##courseName##", $courseName, $notification_user);
                    $notification_user                      = str_replace("##productionName##", $productionName, $notification_user);

                    $returnArray['next']['reciver_userId']          = $userId;    
                    $returnArray['next']['first_name']              = trim($senderUserArray['first_name']);
                    $returnArray['next']['last_name']               = trim($senderUserArray['last_name']);
                    $returnArray['next']['profile_image']           = $senderUserArray['profile_image'];
                    $returnArray['next']['notification']            = $notification_user; 
                    $returnArray['next']['course_node_id']          = $courseArray[0]['node_id']; 
                    $returnArray['next']['course_name']             = $courseName;
                    $returnArray['next']['production_node_id']      = $post['production_details_node_id'];
                    $nextUserId                                     = $userId;
                    $returnArray['course']                          = $courseArray[0]['node_id']; 
                    $returnArray['production']                      = $post['production_details_node_id']; 
                }
               
                if(trim($email) != '')
                {
                    $email                                  = str_replace("##sFirstName##", $senderUserArray['first_name'], $email);
                    $email                                  = str_replace("##sLastName##", $senderUserArray['last_name'], $email);
                    $email                                  = str_replace("##sEmail##", $senderUserArray['email'], $email);
                    $email                                  = str_replace("##sRoleName##", $senderUserArray['role_name'], $email);

                    $email                                  = str_replace("##rFirstName##", $reciverUserArray['first_name'], $email);
                    $email                                  = str_replace("##rLastName##", $reciverUserArray['last_name'], $email);
                    $email                                  = str_replace("##rEmail##", $reciverUserArray['email'], $email);
                    $email                                  = str_replace("##rRoleName##", $reciverUserArray['role_name'], $email);

                    $email                                  = str_replace("##courseName##", $courseName, $email);
                    $email                                  = str_replace("##productionName##", $productionName, $email);

                    $link                                   = explode('<##courseLink##>',$email);
                    if(count($link) > 1)
                    {
                        $linkName                           = explode('</##courseLink##>',$link[1])[0];
                        $cipherObj                          = new PUCipher();
                        $hashedUrl                          = $cipherObj->puUrlParamEncrypt(array('uid'=>trim($reciverUserArray['user_id']), '&cid'=>trim($courseArray[0]['node_id']), '&pid'=>trim($post['production_details_node_id']), '&email'=>trim($reciverUserArray['email'])));
                        //$encoded_url                        = array('uid'=>trim($reciverUserArray['user_id']), '&cid'=>trim($courseArray[0]['node_id']), '&pid'=>trim($post['production_details_node_id']), '&email'=>trim($reciverUserArray['email']));
                        //$params['encoded_url']              = urlencode($hashedUrl);

                        $realLink                           = '<a href="'.BASE_URL.'login/addParticipant?token='.urlencode($hashedUrl).'" >'.$linkName.'</a>';

                        $email                              = str_replace("<##courseLink##>".$linkName."</##courseLink##>", $realLink, $email);
                    }

                    $returnArray['email']['to']             = $reciverUserArray['email'];    
                    $returnArray['email']['userName']       = trim($reciverUserArray['first_name']." ".$reciverUserArray['last_name']);
                    $returnArray['email']['body']           = $email;
                    $returnArray['email']['subject']        = $courseName.' Course is Waiting on You';
                    $nextUserId                             = $userId;
                    $returnArray['course']                  = $courseArray[0]['node_id']; 
                    $returnArray['production']              = $post['production_details_node_id'];
                }      
            }
        }

        if(trim($notification_all) != '')
        {
            $roleId                                             = $productionDeatils['production_json'][$post['operationKey']]['actions']['controllerID'];

            if(trim($nextUserId) != '')
            $notInUserArray                                     = array($login_user_id,$nextUserId);
            else
            $notInUserArray                                     = array($login_user_id);

            $inUserArray                                        = array();
            foreach($productionDeatils['users'] as $userId => $userArray)
            {
                if(!in_array($userId, $notInUserArray))
                    $inUserArray[]                              = $userId;
            }

            if(count($inUserArray) > 0)
            {
                foreach($inUserArray as $key => $userId)
                {
                    $reciverUserArray                           = $productionDeatils['users'][$userId];

                    if(count($reciverUserArray) > 0)
                    {
                        $temp_notification                      = $notification_all;
                        $temp_notification                      = str_replace("##sFirstName##", $senderUserArray['first_name'], $temp_notification);
                        $temp_notification                      = str_replace("##sLastName##", $senderUserArray['last_name'], $temp_notification);
                        $temp_notification                      = str_replace("##sEmail##", $senderUserArray['email'], $temp_notification);
                        $temp_notification                      = str_replace("##sRoleName##", $senderUserArray['role_name'], $temp_notification);

                        $temp_notification                      = str_replace("##rFirstName##", $reciverUserArray['first_name'], $temp_notification);
                        $temp_notification                      = str_replace("##rLastName##", $reciverUserArray['last_name'], $temp_notification);
                        $temp_notification                      = str_replace("##rEmail##", $reciverUserArray['email'], $temp_notification);
                        $temp_notification                      = str_replace("##rRoleName##", $reciverUserArray['role_name'], $temp_notification);

                        if(count($nextCUserArray) > 0)
                        {
                            $temp_notification                  = str_replace("##nextCFirstName##", $nextCUserArray['first_name'], $temp_notification);
                            $temp_notification                  = str_replace("##nextCLastName##", $nextCUserArray['last_name'], $temp_notification);
                            $temp_notification                  = str_replace("##nextCEmail##", $nextCUserArray['email'], $temp_notification);
                            $temp_notification                  = str_replace("##nextCRoleName##", $nextCUserArray['role_name'], $temp_notification);
                        }

                        $temp_notification                      = str_replace("##courseName##", $courseName, $temp_notification);
                        $temp_notification                      = str_replace("##productionName##", $productionName, $temp_notification);

                        $returnArray['all'][$userId]['reciver_userId']          = $userId;    
                        $returnArray['all'][$userId]['first_name']              = trim($senderUserArray['first_name']);
                        $returnArray['all'][$userId]['last_name']               = trim($senderUserArray['last_name']);
                        $returnArray['all'][$userId]['profile_image']           = $senderUserArray['profile_image'];
                        $returnArray['all'][$userId]['notification']            = $temp_notification; 
                        $returnArray['all'][$userId]['course_node_id']          = $courseArray[0]['node_id'];
                        $returnArray['all'][$userId]['course_name']             = $courseName; 
                        $returnArray['all'][$userId]['production_node_id']      = $post['production_details_node_id'];
                        $returnArray['course']                                  = $courseArray[0]['node_id']; 
                        $returnArray['production']                              = $post['production_details_node_id'];
                    }
                }
            }
        }

        //return array($login_user_id,$post,$returnArray,$productionDeatils);
        return $returnArray;
        /*Code End For Notification User, Notification All And Email   */
    }

    /**
     * Fecth production data instance node ids
     * @param $production_details_node_id
     * @return impldeNX
     */
    public function getProductionDataInstanceList($production_details_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".PRODUCTION_DATA_CLASS_ID), array('node_instance_id'), 'INNER');
        $select->where->equalTo('nxyr.node_y_id', $production_details_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $impldeNX = array();
        foreach ($dataArray as $key => $value) {
            $impldeNX[] = $value['node_x_id'];
        }
        return $impldeNX;
    }

    /**
     * Fecth manage instance class instance array
     * @param $production_data_node_id
     * @return manageInstanceArray
     */
    public function getManageInstanceList($production_data_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".MANAGE_INSTANCE_CLASS_ID), array('node_instance_id'), 'INNER');
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id','value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('nxyr.node_y_id', $production_data_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $manageInstanceArray = array();
        foreach($dataArray as $key => $value)
        {
            $manageInstanceArray[$value['node_x_id']]['node_id'] = $value['node_x_id'];
            $manageInstanceArray[$value['node_x_id']]['node_instance_id'] = $value['node_instance_id'];
            $manageInstanceArray[$value['node_x_id']][$value['caption']] = $value['value'];
        }
        
        return $manageInstanceArray;
    }
  
    /**
     * Fecth instance data form any instance id
     * @param $node_id
     * @return dataArray
     */
    public function getInstanceDataOfParticulerInstance($node_id) 
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id','node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('property_node_id' => 'node_id','caption'), '');
        $select->where->equalTo('ni.node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray = $resultObj->initialize($result)->toArray();

        $dataArray = array();
        foreach ($tempArray as $key => $value) {
            if (trim($dataArray[$value['property_node_id']]) == '')
                $dataArray[$value['property_node_id']] = html_entity_decode($value['value']);
            else {
                $dataArray[$value['property_node_id']] = $dataArray[$value['property_node_id']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
            }
        }
        
        return $dataArray;
    }

    /**
     * For set input values on production json instance
     * @param $nodes,$manageInstanceValue
     * @return nodes
     */
    public function setInputValueOnProductionJsonArray($nodes,$manageInstanceValue)
    {
        foreach($nodes as $key => $value)
        {
            if($manageInstanceValue[$value['nodeID']] != '')
            {
                if(trim($nodes[$key]['inputType']) == 'File')
                {
                    $nodes[$key]['inputValue'] = 'public/nodeZimg/'.$manageInstanceValue[$value['nodeID']];
                }
                else
                {
                    $nodes[$key]['inputValue'] = $manageInstanceValue[$value['nodeID']];
                }
            }

            if(is_array($nodes[$key]['nodes']))
            {
                $nodes[$key]['nodes']      = $this->setInputValueOnProductionJsonArray($nodes[$key]['nodes'],$manageInstanceValue);
            }
        }

        return $nodes;
    }

    /**
     * insert and update instance
     * @param $instance_id,$property_id,$property_val,$is_checkbox
     * @return null
     */
    public function updateInstanceProperty($instance_id,$property_id,$property_val,$is_checkbox)
    {
        if($is_checkbox == 'N')
        {
            $data               = array();
            $data['value']      = $property_val;
            $sql                = new Sql($this->adapter);
            $query              = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where->equalTo('node_instance_id' , $instance_id);
            $query->where->AND->equalTo('node_class_property_id', $property_id);
            $statement          = $sql->prepareStatementForSqlObject($query);
            $result             = $statement->execute();
            $resultObj          = new ResultSet();
            $resultObj->initialize($result);
        }
        else
        {
            $sql                = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->where->equalTo('nip.node_class_property_id', $property_id);
            $select->where->AND->equalTo('nip.node_instance_id', $instance_id);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $tempArr = $resultObj->initialize($result)->toArray();

            if($tempArr[0]['node_instance_property_id'] != "")
            {
                if (substr($property_val, -3) == CHECKBOX_SEPERATOR) {
                    $sql                                    = new Sql($this->adapter);
                    $delete                                 = $sql->delete();
                    $delete->from('node-instance-property');
                    $delete->where->equalTo('node_instance_id', $instance_id);
                    $delete->where->AND->equalTo('node_class_property_id', $property_id);
                    $statement                              = $sql->prepareStatementForSqlObject($delete);
                    $result                                 = $statement->execute();

                    $newValArray = explode(CHECKBOX_SEPERATOR, $property_val);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data                           = array();
                            $data['value']                  = $v;
                            $data['encrypt_status']         = ENCRYPTION_STATUS;
                            $data['node_instance_id']       = $instance_id;
                            $data['node_id']                = $this->getClassesTable()->createNode();
                            $data['node_type_id']           = '2';
                            $data['node_class_property_id'] = $property_id;
                            $sql = new Sql($this->adapter);
                            $query = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement = $sql->prepareStatementForSqlObject($query);
                            $result = $statement->execute();
                        }
                    }
                } else {


                    $data                                   = array();
                    $data['value']                          = $property_val;
                    $sql                                    = new Sql($this->adapter);
                    $query                                  = $sql->update();
                    $query->table('node-instance-property');
                    $query->set($data);
                    $query->where(array('node_instance_property_id' => $tempArr[0]['node_instance_property_id']));
                    $statement                              = $sql->prepareStatementForSqlObject($query);
                    $result                                 = $statement->execute();
                    $resultObj                              = new ResultSet();
                    $resultObj->initialize($result);
                }
            }
            else
            {
                if (substr($property_val, -3) == CHECKBOX_SEPERATOR) {
                    $newValArray = explode(CHECKBOX_SEPERATOR, $property_val);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data                           = array();
                            $data['value']                  = htmlspecialchars($v);  
                            $data['encrypt_status']         = ENCRYPTION_STATUS;
                            $data['node_instance_id']       = $instance_id;
                            $data['node_id']                = $this->getClassesTable()->createNode();
                            $data['node_type_id']           = '2';
                            $data['node_class_property_id'] = $property_id;

                            $sql                            = new Sql($this->adapter);
                            $query                          = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement                      = $sql->prepareStatementForSqlObject($query);
                            $result                         = $statement->execute();
                        }
                    }
                } else {
                    $data                                   = array();
                    $data['value']                          = htmlspecialchars($property_val); 
                    $data['encrypt_status']                 = ENCRYPTION_STATUS;
                    $data['node_instance_id']               = $instance_id;
                    $data['node_id']                        = $this->getClassesTable()->createNode();
                    $data['node_type_id']                   = '2';
                    $data['node_class_property_id']         = $property_id;

                    $sql                                    = new Sql($this->adapter);
                    $query                                  = $sql->insert('node-instance-property');
                    $query->values($data);
                    $statement                              = $sql->prepareStatementForSqlObject($query);
                    $result                                 = $statement->execute();
                }
            }
        }
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
}