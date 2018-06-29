<?php
namespace Administrator\Model;
use Zend\Db\Sql\Expression;
use Zend\Db\TableGateway\AbstractTableGateway;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Db\Sql\Predicate;
use Zend\Paginator\Paginator;
use Administrator\Model\StructureBuilderTable;
use Administrator\Model\ClassesTable;

class AdministratorTable extends AbstractTableGateway
{
	protected $table = 'user';
	public function __construct(Adapter $adapter)
    {
        $this->adapter = $adapter;
        $this->resultSetPrototype = new ResultSet();
        $this->resultSetPrototype->setArrayObjectPrototype(new Administrator());
        $this->initialize();
    }

    public function getSubMenu($menu1,$menu2,$menuArray)
	{
		foreach($menu1 as $key => $value)
		{
			$menuArray[$value['menu_id']]['menu_id'] 				= $value['menu_id'];
            $menuArray[$value['menu_id']]['parent_menu_id'] 		= $value['parent_menu_id'];
			$menuArray[$value['menu_id']]['menu'] 					= $value['menu'];
            $menuArray[$value['menu_id']]['description'] 			= $value['description'];
			$menuArray[$value['menu_id']]['is_display'] 			= $value['is_display'];
            $menuArray[$value['menu_id']]['is_active'] 			    = $value['is_active'];
			$menuArray[$value['menu_id']]['menu_type'] 				= $value['menu_type'];
            $menuArray[$value['menu_id']]['order'] 			        = $value['order'];
			$menuArray[$value['menu_id']]['icon_class'] 			= $value['icon_class'];
			$menuArray[$value['menu_id']]['controler'] 				= $value['controler'];
			$menuArray[$value['menu_id']]['action'] 				= $value['action'];
			$menuArray[$value['menu_id']]['is_dual'] 				= $value['is_dual'];
			$menuArray[$value['menu_id']]['dual_icon_class'] 		= $value['dual_icon_class'];
			$menuArray[$value['menu_id']]['data_href'] 				= $value['data_href'];
            $menuArray[$value['menu_id']]['shortcut_icon'] 			= $value['shortcut_icon'];
            $menuArray[$value['menu_id']]['is_disabled'] 			= $value['is_disabled'];

			$childArray												= array();
			if(is_array($menu2[$value['menu_id']]))
			{
				$menuArray[$value['menu_id']]['child'] 				= $this->getSubMenu($menu2[$value['menu_id']],$menu2,$childArray);
			}
		}
		return $menuArray;
	}

	public function getLeftMenu()
	{
		$sql                  	= new Sql($this->adapter);
		$select               	= $sql->select();
		$select->from('menu')
				->join(array('mt' => 'menu_type'), 'mt.menu_type_id=menu.menu_type_id', array('menu_type'), 'inner')
				//->join(array('ma' => 'menu_action'), 'ma.menu_id=menu.menu_id', array('controler','action'), 'left')
				->where->equalTo('menu.is_active',1);
		$select->order('menu.order asc');
		$statement            	= $sql->prepareStatementForSqlObject($select);
		$result               	= $statement->execute();
		$resultObj            	= new ResultSet();
        $tempMenuArray			= $resultObj->initialize($result)->toArray();

		$menu1					=	array();
		$menu2					=	array();
		foreach($tempMenuArray as $key => $value)
		{
			if(intval($value['parent_menu_id']) == 0)
				$menu1[]		=	$value;

			if(intval($value['parent_menu_id']) != 0)
				$menu2[$value['parent_menu_id']][]		=	$value;
		}

		$menuArray 				= 	array();
		$menuArray  			= 	$this->getSubMenu($menu1,$menu2,$menuArray);

		return $menuArray;
	}

	public function getUrl($menu_id)
	{
		$sql                  	= new Sql($this->adapter);
		$select               	= $sql->select();
		$select->from('menu_action')
				->where->equalTo('menu_action.menu_id',$menu_id);

		$statement            	= $sql->prepareStatementForSqlObject($select);
		$result               	= $statement->execute();
		$resultObj            	= new ResultSet();
		$menuActionArray		= $resultObj->initialize($result)->toArray();

		return $menuActionArray[0];
	}

	public function getPerticulerData($tableName,$columnArray,$columnName,$columnValue,$is_all)
	{
		$sql                	=	new Sql($this->adapter);
		$select					=	$sql->select();
		$select->from($tableName);
		$select->columns($columnArray);
		$select->where->equalTo($columnName,$columnValue);
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$dataArray 				=   $resultObj->initialize($result)->toArray();
		if(intval($is_all) == 0)
			return $dataArray[0];
		else
			return $dataArray;
	}

	public function checkUserdata($data)
	{
		$temp 					=	$this->getPerticulerData('node-class',array('node_class_id'),'node_id',70,0);

		$sql                	=	new Sql($this->adapter);
		$select					=	$sql->select();
		$select->from(array('nii' => 'node-instance'));
		$select->join(array('ni' => 'node-instance-property'), 'ni.node_instance_id = nii.node_instance_id', array('node_instance_id','node_class_property_id','value'), 'inner');
		$select->where->equalTo('nii.node_class_id',$temp['node_class_id']);
		$select->where->AND->equalTo('ni.value',$data['email']);
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$classArray		    	=	$resultObj->initialize($result)->toArray();

		return $classArray[0];
	}
	/* Login End Work */

	/**
     * Fetch all "PRODUCTION" class instance where description =  'course_builder'
     * @param null
     * @return instanceArray
     */
    public function fetchAllCoursesOfCourseBuilder($login_user_id = "", $subscribedFlag = 0)//modified by Gaurav, on 31 Aug 2017
    {
        $instanceArray = $this->fetchAllActiveCourse();

        foreach($instanceArray as $key => $value)
        {   
            if($instanceArray[$key]['icon'] == "" || !file_exists(ABSO_URL.'/'.$instanceArray[$key]['icon']))
            {
                $instanceArray[$key]['icon'] = 'public/img/default_production.png';
            }
        }

        if(trim($login_user_id) != '')
        {
            $sql                                    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('instance_node_id' => 'node_id','class_node_id' => 'node_class_id'));
            $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('production' => 'value'), 'INNER');
            $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni.node_instance_id AND nip1.node_class_property_id = '.SUBSCRIPTION_SUBSCRIBER_PID), array('user_id' => 'value'), 'INNER');
            $select->where->equalTo('ni.node_class_id', SUBSCRIPTION_CLASS_ID);
            $select->where->equalTo('nip1.value', $login_user_id);

            $statement                              = $sql->prepareStatementForSqlObject($select);
            $result                                 = $statement->execute();
            $resultObj                              = new ResultSet();
            $subsArray                              = $resultObj->initialize($result)->toArray();

            $subcribeProduction                     = array();
            foreach($subsArray as $key => $value)
            {
                $subcribeProduction[$value['production']] = $value['production'];
            }

            $newSubsArray                           = array_keys($subcribeProduction);

            $groupWiseSubscriptionArray             = $this->getGroupWiseProductions($login_user_id,'N','Y');

            $sendSubsArray  = array();
            foreach($instanceArray as $key => $value)
            {           
                if(in_array($key, $newSubsArray))
                {
                    $instanceArray[$key]['is_subscribed'] = 1;
                }
                else if(in_array($key, $groupWiseSubscriptionArray))
                {
                    $instanceArray[$key]['is_subscribed'] = 1;
                }
                else
                {
                    if($subscribedFlag){
                          unset($instanceArray[$key]);
                    }else{
                         $instanceArray[$key]['is_subscribed'] = 0;
                    }
                } 
            }


        }
        return $instanceArray;

        
    }

    /**
     * Fetch all "PRODUCTION" class instance
     * @param null
     * @return instanceArray
     */
    public function fetchAllActiveCourse()
    {
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

        return $instanceArray;
    }

    public function fetchSubscribedCourses($login_user_id)
    {
        $instanceArray 								= $this->fetchAllActiveCourse();
        $subscribedArray  							= array();
        if(trim($login_user_id) != '')
        {
            $sql                                    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('instance_node_id' => 'node_id','class_node_id' => 'node_class_id'));
            $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('production' => 'value'), 'INNER');
            $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni.node_instance_id AND nip1.node_class_property_id = '.SUBSCRIPTION_SUBSCRIBER_PID), array('user_id' => 'value'), 'INNER');
            $select->where->equalTo('ni.node_class_id', SUBSCRIPTION_CLASS_ID);
            $select->where->equalTo('nip1.value', $login_user_id);

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

            
            foreach($instanceArray as $key => $value)
            {
                if(in_array($key, $newSubsArray))
                {
                    $instanceArray[$key]['is_subscribed'] = 1;
                    $subscribedArray[$key] = $instanceArray[$key];
                }
                
            }
        }
        return $subscribedArray;
    }

    /**
     * For get all instances from class roles_cb from course_builder
     * @param null
     * @return roleArray
     */
    public function getRoleListFromSystemRoles($is_inner_call = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value','node_class_property_id'), '');
        $select->where->equalTo('ni.node_class_id', SYSTEM_ROLE_CLASS_ID);
        $select->where->AND->equalTo('nip.node_class_property_id', SYSTEM_ROLE_NAME_PID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $roleArray = array();
        if($is_inner_call == "")
        {
            foreach($tempArr as $index => $value)
            {
                $temp['role_id']    = $value['node_id'];
                $temp['role']       = $value['value'];
                $roleArray[] = $temp;
            }
        }
        else
        {
            foreach($tempArr as $index => $value)
            {
                $roleArray[$value['node_id']] = $value['value'];
            }
        }
        return $roleArray;
    }

    /**
     * For get all instances from class roles_cb from course_builder
     * @param null
     * @return roleArray
     */
    public function getGroupsForParticulerUser($login_user_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".GROUP_ACTOR_PID), array('user_id' => 'value'), '');
        $select->join(array('nip1' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip1.node_instance_id = ni.node_instance_id and nip1.node_class_property_id = ".GROUP_NAME_PID), array('group' => 'value'), '');
        //$select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni.node_id', array('node_x_y_relation_id','node_x_id'), 'left');
        $select->where->equalTo('ni.node_class_id', GROUP_CLASS_ID);
        $select->where->AND->equalTo('nip.value', $login_user_id);
        //$select->order(array('ni.node_instance_id DESC'));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $newGroupArray = array();
        foreach($tempArr as $key => $value)
        {
            $newGroupArray[$value['node_id']]['node_id']             = $value['node_id'];
            $newGroupArray[$value['node_id']]['node_instance_id']    = $value['node_instance_id'];
            $newGroupArray[$value['node_id']]['user_id']             = $value['user_id'];
            $newGroupArray[$value['node_id']]['group']               = $value['group'];
            if(trim($value['node_x_y_relation_id']) != '')
            {
                $rolesArray                                          = array();
                $rolesArray['node_x_y_relation_id']                  = $value['node_x_y_relation_id'];
                $rolesArray['node_x_id']                             = $value['node_x_id'];
                $newGroupArray[$value['node_id']]['roles'][]         = $rolesArray;
            }
        }

        return $newGroupArray;
    }

    public function updateInstanceProperty($instance_property_caption, $class_property_id, $node_instance_id) 
    {
        $data                           = array();
        $data['value']                  = $instance_property_caption;

        $sql                            = new Sql($this->adapter);
        $query                          = $sql->update();
        $query->table('node-instance-property');
        $query->set($data);
        $query->where->equalTo('node_class_property_id', $class_property_id);
        $query->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement                      = $sql->prepareStatementForSqlObject($query);
        $result                         = $statement->execute();
        $resultObj                      = new ResultSet();
        $resultObj->initialize($result);
    }

    public function getRolesOfGroup($group_node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-x-y-relation'));
        $select->columns(array('node_x_y_relation_id','node_x_id'));
        $select->where->equalTo('ni.node_y_id', $group_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $rolesArray = $this->getRoleListFromSystemRoles("Y");
        $rolesPArray = array();
        foreach($tempArr as $key => $value)
        {
            if(trim($rolesArray[$value['node_x_id']]) != '')
            {
                $tempArr[$key]['role'] = $rolesArray[$value['node_x_id']];
                $rolesPArray[$value['node_x_id']] = $tempArr[$key];
            }
            
        }
        return $rolesPArray;
    }

    public function isStateRoleActorInstanceExist($user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".STATE_ACTOR_ROLE_ACTOR_PID), array('value'), '');
        $select->where->equalTo('ni.node_class_id', STATE_ACTOR_ROLE_CLASS_ID);
        $select->where->AND->equalTo('nip.value', $user_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();
        return $tempArr;
    }

    public function getGroupRolesInstance($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".GROUP_ROLE_CLASS_ID), array('node_instance_id'), '');
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".GROUP_ROLE_GROUP_PID), array('value'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();
        $groupRoleArray = array();
        
        foreach($tempArr as $key => $value)
        {
            $groupRoleArray[$value['value']] = $value['node_x_id'];
        }
        return $groupRoleArray;
    }

    public function getUsersOfRoleAndGroup($group_id,$role_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_y_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_y_id and ni.node_class_id = ".GROUP_ROLE_CLASS_ID), array('node_instance_id'), '');
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".GROUP_ROLE_GROUP_PID), array('value'), '');
        $select->where->equalTo('nxyr.node_x_id', $role_id);
        $select->where->AND->equalTo('nip.value', $group_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $groupRoleInstanceNodeId = array();
        foreach($tempArr as $key => $value)
        {
            $groupRoleInstanceNodeId[] = $value['node_y_id'];
        }

        $userArray = array();
        if(count($groupRoleInstanceNodeId) > 0)
        {
            $sql    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nxyr' => 'node-x-y-relation'));
            $select->columns(array('node_y_id'));
            $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_y_id and ni.node_class_id = ".STATE_ACTOR_ROLE_CLASS_ID), array('node_instance_id'), '');
            $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".STATE_ACTOR_ROLE_ACTOR_PID), array('value'), '');
            $select->where->IN('nxyr.node_x_id', $groupRoleInstanceNodeId);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $tempArr = $resultObj->initialize($result)->toArray();
            foreach($tempArr as $key => $value)
            {
                $userArray[] = $value['value'];
            }
        }
        
        return $userArray;
    }

    public function getGroupWiseProductions($login_user_id,$isGroupWise,$isUserWise)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('SGARInstanceId'=> 'node_instance_id','SGARInstanceNodeId'=> 'node_id','SGARClassId'=> 'node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.SUBS_GROUP_ACT_ROLE_ACTOR_PID), array('SGARActorId' => 'value'), 'INNER');
        $select->join(array('nxyr1' => 'node-x-y-relation'), new Predicate\Expression('nxyr1.node_x_id = ni.node_id'), array('GSInstanceNodeId' => 'node_y_id'), 'INNER');
        $select->join(array('ni1' => 'node-instance'), new \Zend\Db\Sql\Expression("ni1.node_id = nxyr1.node_y_id and ni1.node_class_id = ".GROUP_SUBSCRIPTION_CLASS_ID), array('GSInstanceId'=> 'node_instance_id','GSInstanceNodeId'=> 'node_id','GSClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id = '.GROUP_SUBSCRIPTION_GROUP_PID), array('GSGroupNId' => 'value'), 'INNER');
        $select->join(array('nxyr2' => 'node-x-y-relation'), new Predicate\Expression('nxyr2.node_x_id = ni1.node_id'), array('SInstanceNodeId' => 'node_y_id'), 'INNER');
        $select->join(array('ni2' => 'node-instance'), new \Zend\Db\Sql\Expression("ni2.node_id = nxyr2.node_y_id and ni2.node_class_id = ".SUBSCRIPTION_CLASS_ID), array('SInstanceId'=> 'node_instance_id','SInstanceNodeId'=> 'node_id','SClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = ni2.node_instance_id AND nip2.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('SProductionNId' => 'value'), 'INNER');
        $select->where->equalTo('ni.node_class_id', SUBS_GROUP_ACT_ROLE_CLASS_ID);
        $select->where->AND->equalTo('nip.value', $login_user_id);

        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $subsArray                              = $resultObj->initialize($result)->toArray();

        $returnArray                            = array();
        if($isGroupWise == 'Y' && $isUserWise == 'N')
        {
            foreach($subsArray as $key => $value)
            {
                $returnArray[$value['GSGroupNId']][] = $value['SProductionNId'];
            }
        }
        else if($isGroupWise == 'N' && $isUserWise == 'Y')
        {
            foreach($subsArray as $key => $value)
            {
                $returnArray[] = $value['SProductionNId'];
            }
        }
        else if($isGroupWise == 'N' && $isUserWise == 'N')
        {
            foreach($subsArray as $key => $value)
            {
                $returnArray[$value['GSGroupNId']][$value['SProductionNId']] = $value;
            }
        }

        
        return $returnArray;
    }

    /*
     * Created By: Divya Rajput
     * On Date: 12 Sept 2017
     * To fetch all actors associated from a group including login user
     */
    public function fetchGroupActor($group_node_id)
    {
        /*SELECT nip1.value
        FROM `node-instance-property` nip
        INNER JOIN `node-instance` ni ON ni.node_instance_id = nip.node_instance_id
        INNER JOIN `node-x-y-relation` nxyr ON nxyr.node_x_id = ni.node_id
        INNER JOIN `node-instance` ni1 ON ni1.node_id = nxyr.node_y_id AND ni1.node_class_id = 866
        INNER JOIN `node-instance-property` nip1 ON nip1.node_instance_id = ni1.node_instance_id
        WHERE nip.value = 2562962 AND nip.node_class_property_id = 9123*/

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->quantifier('DISTINCT');
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array());
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr.node_y_id AND ni1.node_class_id = '.STATE_ACTOR_ROLE_CLASS_ID), array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni1.node_instance_id', array('actor' => 'value'));
        $select->where->equalTo('nip.value', $group_node_id);
        $select->where->AND->equalTo('nip.node_class_property_id', GROUP_ROLE_GROUP_PID);
        $statement  = $sql->prepareStatementForSqlObject($select);
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /*Created By: Divya Rajput*/
    public function fetchRemoveUserGroupRoleInfo($post, $roleName = 'member')
    {
        /*SELECT
        ni2.node_id AS system_node_id,
        ni2.node_instance_id AS system_node_instance_id,
        ni1.node_id AS group_node_id,
        ni1.node_instance_id AS group_node_instance_id,
        FROM `node-instance-property` nip
        INNER JOIN `node-instance` ni ON ni.node_instance_id = nip.node_instance_id
        INNER JOIN `node-x-y-relation` nxyr ON nxyr.node_y_id = ni.node_id
        INNER JOIN `node-instance` ni1 ON ni1.node_id = nxyr.node_x_id AND ni1.node_class_id = 862
        INNER JOIN `node-instance-property` nip1 ON nip1.node_instance_id =  ni1.node_instance_id AND nip1.value = 2566690 AND nip1.node_class_property_id = 9123
        INNER JOIN `node-x-y-relation` nxyr1 ON nxyr1.node_y_id = ni1.node_id
        INNER JOIN `node-instance` ni2 ON ni2.node_id = nxyr1.node_x_id
        INNER JOIN `node-instance-property` nip2 ON nip2.node_instance_id = ni2.node_instance_id AND nip2.value = 'member'
        WHERE nip.value = 1631794 AND nip.node_class_property_id = 9138*/

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->quantifier('DISTINCT');
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni.node_id', array());
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr.node_x_id AND ni1.node_class_id = '. GROUP_ROLE_CLASS_ID), array('group_node_id' => 'node_id', 'group_node_instance_id' => 'node_instance_id'));
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id =  ni1.node_instance_id AND nip1.value = '.$post['group_node_id'].' AND nip1.node_class_property_id = '.GROUP_ROLE_GROUP_PID), array());
        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = ni1.node_id', array());
        $select->join(array('ni2' => 'node-instance'), 'ni2.node_id = nxyr1.node_x_id', array('system_node_id' => 'node_id', 'system_node_instance_id' => 'node_instance_id'));
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = ni2.node_instance_id AND nip2.value = "'.$roleName.'"'), array());
        $select->where->equalTo('nip.value', $post['user_id']);
        $select->where->AND->equalTo('nip.node_class_property_id', STATE_ACTOR_ROLE_ACTOR_PID);
        $statement  = $sql->prepareStatementForSqlObject($select); //die($select->getSqlString());
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /*Created By: Arvind Soni*/
    public function getActorsGroupAndRoles($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), new \Zend\Db\Sql\Expression("ni.node_id = nxyr.node_x_id and ni.node_class_id = ".GROUP_ROLE_CLASS_ID), array('node_instance_id'), '');
        $select->join(array('nip' => 'node-instance-property'), new \Zend\Db\Sql\Expression("nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = ".GROUP_ROLE_GROUP_PID), array('group_nid' => 'value'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();
        $groupArray = array();
        foreach($tempArr as $key => $value)
        {
            $groupArray[$value['group_nid']] = $value['node_x_id'];
        }

        $gNidArray = array_values($groupArray);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_y_id','node_x_id'));
        $select->where->IN('node_y_id', $gNidArray);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr1 = $resultObj->initialize($result)->toArray();

        $rolesArray = array();
        foreach($tempArr1 as $key => $value)
        {
            $rolesArray[$value['node_y_id']][] = $value['node_x_id'];
        }

        foreach($groupArray as $key => $value)
        {
            $groupArray[$key] = $rolesArray[$value];
        }


        return $groupArray;
    }

    /*
     * Created By: Arvind Soni
     * Date: 22-Sept-2017
     * Function to get group wise roles on behalf of actor
     * */
    public function getGroupWiseRolesOfParticulerActor($login_user_id)
    {
        $stateRoleActor                             =   $this->isStateRoleActorInstanceExist($login_user_id);
        $userGroupWiseRolesArray                    =   array();
        if(count($stateRoleActor) == 1)
        {
            $userGroupWiseRolesArray                = $this->getActorsGroupAndRoles($stateRoleActor[0]['node_id']);
        }
        return $userGroupWiseRolesArray;
    }

    public function fetchProductionOfGroup($group_nid,$type="")
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni1' => 'node-instance'));
        $select->columns(array('GSInstanceId'=> 'node_instance_id','GSInstanceNodeId'=> 'node_id','GSClassId'=> 'node_class_id'));
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id = '.GROUP_SUBSCRIPTION_GROUP_PID), array('GSGroupNId' => 'value'), 'INNER');
        $select->join(array('nxyr2' => 'node-x-y-relation'), new Predicate\Expression('nxyr2.node_x_id = ni1.node_id'), array('SInstanceNodeId' => 'node_y_id'), 'INNER');
        $select->join(array('ni2' => 'node-instance'), new \Zend\Db\Sql\Expression("ni2.node_id = nxyr2.node_y_id and ni2.node_class_id = ".SUBSCRIPTION_CLASS_ID), array('SInstanceId'=> 'node_instance_id','SInstanceNodeId'=> 'node_id','SClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = ni2.node_instance_id AND nip2.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('SProductionNId' => 'value'), 'INNER');
        $select->join(array('ni3' => 'node-instance'), new \Zend\Db\Sql\Expression("ni3.node_id = nip2.value"), array('PInstanceId'=> 'node_instance_id','SProductionNId'=> 'node_id','PClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = ni3.node_instance_id AND nip3.node_class_property_id = '.PRODUCTION_CB_TITLE_PID), array('ProductionName' => 'value'), 'INNER');
        $select->where->equalTo('ni1.node_class_id', GROUP_SUBSCRIPTION_CLASS_ID);
        $select->where->AND->equalTo('nip1.value', $group_nid);

        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $subsArray                              = $resultObj->initialize($result)->toArray();

        $productionArray                        = array();
        foreach($subsArray as $key => $value)
        {
            if(trim($type) == "")
            {
                $productionArray[$value['SProductionNId']]['app_id'] = $value['SProductionNId'];
                $productionArray[$value['SProductionNId']]['app_name'] = $value['ProductionName'];
            }
            else if(trim($type) == "GroupProduction")
            {
                $productionArray[$value['GSGroupNId']][$value['SProductionNId']] = $value;
            }
        }

        return $productionArray;
    }

    /*
     * Created By: Arvind Soni
     * Date: 22-Sept-2017
     * Function to create relation between Actor And Group
     * */
    public function setGroupApplicationToActor($data)
    {
        $group_id                                               = $data['group_id'];
        $user_id                                                = $data['user_id'];
        $app_ids                                                = explode(",",$data['app_ids']);

        $groupProductionArray                                   = $this->fetchProductionOfGroup($group_id,'GroupProduction');
        $perticuler_apps_list                                   = $this->getGroupWiseProductions($user_id,'Y','N');
        $perticuler_apps_list_for_delete                        = $this->getGroupWiseProductions($user_id,'N','N');
        $structureBuilderObj                                    = new StructureBuilderTable($this->adapter);
        $classObj                                               = new ClassesTable($this->adapter);
        $perticulerGroupAppDetailsArray                         = array();
        $addProductionArray                                     = array();
        $deleteProductionArray                                  = array();
        if(isset($perticuler_apps_list[$group_id]))
        {
            $addProductionArray                                 = array_diff($app_ids,$perticuler_apps_list[$group_id]);
            $addProductionArray                                 = array_values($addProductionArray);
            if(count($addProductionArray) > 0 && trim($addProductionArray[0]) != '')
            {
                foreach($addProductionArray as $index => $productionId)
                {
                    $perticulerGroupAppDetailsArray             = $groupProductionArray[$group_id][$productionId];

                    $returnSubsGroupArray                       = $structureBuilderObj->createInstanceOfClass(SUBS_GROUP_ACT_ROLE_CLASS_ID, '1');
                    if (intval($returnSubsGroupArray['node_instance_id']) > 0) {
                        $propertyIdArray                        = array(SUBS_GROUP_ACT_ROLE_ACTOR_PID);
                        $propertyValueArray                     = array($user_id);
                        $structureBuilderObj->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubsGroupArray['node_instance_id'], $returnSubsGroupArray['node_type_id'], 'N', array(), "");
                    }
                    $structureBuilderObj->createRelation($perticulerGroupAppDetailsArray['GSInstanceNodeId'], array($returnSubsGroupArray['node_id']));
                }
            }


            $deleteProductionArray                              = array_diff($perticuler_apps_list[$group_id],$app_ids);
            $deleteProductionArray                              = array_values($deleteProductionArray);
            if(count($deleteProductionArray) > 0 && trim($deleteProductionArray[0]) != '')
            {
                foreach($deleteProductionArray as $index => $productionId)
                {
                    $perticulerGroupAppDetailsArray             = $perticuler_apps_list_for_delete[$group_id][$productionId];
                    $classObj->commonDeleteMethod('node-instance-property', 'node_instance_id', $perticulerGroupAppDetailsArray['SGARInstanceId'], 'equalto');
                    $classObj->commonDeleteMethod('node-instance', 'node_instance_id', $perticulerGroupAppDetailsArray['SGARInstanceId'], 'equalto');
                    $sql = new Sql($this->adapter);
                    $delete = $sql->delete();
                    $delete->from('node-x-y-relation');
                    $delete->where->equalTo('node_x_id', $perticulerGroupAppDetailsArray['SGARInstanceNodeId']);
                    $delete->where->AND->equalTo('node_y_id', $perticulerGroupAppDetailsArray['GSInstanceNodeId']);
                    $statement = $sql->prepareStatementForSqlObject($delete);
                    $result = $statement->execute();
                }
            }
        }
        else
        {
            foreach($app_ids as $index => $productionId)
            {
                if(trim($productionId) != "")
                {
                    $perticulerGroupAppDetailsArray = $groupProductionArray[$group_id][$productionId];

                    $returnSubsGroupArray = $structureBuilderObj->createInstanceOfClass(SUBS_GROUP_ACT_ROLE_CLASS_ID, '1');
                    if (intval($returnSubsGroupArray['node_instance_id']) > 0) {
                        $propertyIdArray = array(SUBS_GROUP_ACT_ROLE_ACTOR_PID);
                        $propertyValueArray = array($user_id);
                        $structureBuilderObj->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubsGroupArray['node_instance_id'], $returnSubsGroupArray['node_type_id'], 'N', array(), "");
                    }
                    $structureBuilderObj->createRelation($perticulerGroupAppDetailsArray['GSInstanceNodeId'], array($returnSubsGroupArray['node_id']));
                }
            }
        }

        return array($data,$perticuler_apps_list,$perticuler_apps_list_for_delete,$perticulerGroupAppDetailsArray,$addProductionArray,$deleteProductionArray);
    }

    /*
     * Created By: Arvind Soni
     * Date: 22-Sept-2017
     * Function to get group wise application on behalf of role
     * */
    public function getGroupWiseProductionsOfRole($role_id,$type)
    {
        $sql                                    = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('SGARInstanceId'=> 'node_instance_id','SGARInstanceNodeId'=> 'node_id','SGARClassId'=> 'node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.SUBS_GROUP_ACT_ROLE_ROLE_PID), array('SGARRoleId' => 'value'), 'INNER');
        $select->join(array('nxyr1' => 'node-x-y-relation'), new Predicate\Expression('nxyr1.node_x_id = ni.node_id'), array('GSInstanceNodeId' => 'node_y_id'), 'INNER');
        $select->join(array('ni1' => 'node-instance'), new \Zend\Db\Sql\Expression("ni1.node_id = nxyr1.node_y_id and ni1.node_class_id = ".GROUP_SUBSCRIPTION_CLASS_ID), array('GSInstanceId'=> 'node_instance_id','GSInstanceNodeId'=> 'node_id','GSClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id = '.GROUP_SUBSCRIPTION_GROUP_PID), array('GSGroupNId' => 'value'), 'INNER');
        $select->join(array('nxyr2' => 'node-x-y-relation'), new Predicate\Expression('nxyr2.node_x_id = ni1.node_id'), array('SInstanceNodeId' => 'node_y_id'), 'INNER');
        $select->join(array('ni2' => 'node-instance'), new \Zend\Db\Sql\Expression("ni2.node_id = nxyr2.node_y_id and ni2.node_class_id = ".SUBSCRIPTION_CLASS_ID), array('SInstanceId'=> 'node_instance_id','SInstanceNodeId'=> 'node_id','SClassId'=> 'node_class_id'), 'INNER');
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = ni2.node_instance_id AND nip2.node_class_property_id = '.SUBSCRIPTION_PRODUCTION_PID), array('SProductionNId' => 'value'), 'INNER');
        $select->where->equalTo('ni.node_class_id', SUBS_GROUP_ACT_ROLE_CLASS_ID);
        $select->where->AND->equalTo('nip.value', $role_id);

        $statement                              = $sql->prepareStatementForSqlObject($select);
        $result                                 = $statement->execute();
        $resultObj                              = new ResultSet();
        $subsArray                              = $resultObj->initialize($result)->toArray();

        $returnArray                            = array();
        if($type == 'Group')
        {
            foreach($subsArray as $key => $value)
            {
                $returnArray[$value['GSGroupNId']][] = $value['SProductionNId'];
            }
        }
        else if($type == 'GroupProduction')
        {
            foreach($subsArray as $key => $value)
            {
                $returnArray[$value['GSGroupNId']][$value['SProductionNId']] = $value;
            }
        }

        return $returnArray;
    }

    /*
     * Created By: Arvind Soni
     * Date: 27-Sept-2017
     * Function to create relation between Role And Group
     * */
    public function setGroupApplicationToRole($data)
    {
        $group_id                                               = $data['group_id'];
        $role_id                                                = $data['role_id'];
        $app_ids                                                = explode(",",$data['app_ids']);

        $groupProductionArray                                   = $this->fetchProductionOfGroup($group_id,'GroupProduction');
        $perticuler_apps_list                                   = $this->getGroupWiseProductionsOfRole($role_id,'Group');
        $perticuler_apps_list_for_delete                        = $this->getGroupWiseProductionsOfRole($role_id,'GroupProduction');
        $structureBuilderObj                                    = new StructureBuilderTable($this->adapter);
        $classObj                                               = new ClassesTable($this->adapter);
        $perticulerGroupAppDetailsArray                         = array();
        $addProductionArray                                     = array();
        $deleteProductionArray                                  = array();
        if(isset($perticuler_apps_list[$group_id]))
        {
            $addProductionArray                                 = array_diff($app_ids,$perticuler_apps_list[$group_id]);
            $addProductionArray                                 = array_values($addProductionArray);
            if(count($addProductionArray) > 0 && trim($addProductionArray[0]) != '')
            {
                foreach($addProductionArray as $index => $productionId)
                {
                    $perticulerGroupAppDetailsArray             = $groupProductionArray[$group_id][$productionId];

                    $returnSubsGroupArray                       = $structureBuilderObj->createInstanceOfClass(SUBS_GROUP_ACT_ROLE_CLASS_ID, '1');
                    if (intval($returnSubsGroupArray['node_instance_id']) > 0) {
                        $propertyIdArray                        = array(SUBS_GROUP_ACT_ROLE_ROLE_PID);
                        $propertyValueArray                     = array($role_id);
                        $structureBuilderObj->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubsGroupArray['node_instance_id'], $returnSubsGroupArray['node_type_id'], 'N', array(), "");
                    }
                    $structureBuilderObj->createRelation($perticulerGroupAppDetailsArray['GSInstanceNodeId'], array($returnSubsGroupArray['node_id']));
                }
            }


            $deleteProductionArray                              = array_diff($perticuler_apps_list[$group_id],$app_ids);
            $deleteProductionArray  = array_values($deleteProductionArray);
            if(count($deleteProductionArray) > 0 && trim($deleteProductionArray[0]) != '')
            {
                foreach($deleteProductionArray as $index => $productionId)
                {
                    $perticulerGroupAppDetailsArray             = $perticuler_apps_list_for_delete[$group_id][$productionId];
                    $classObj->commonDeleteMethod('node-instance-property', 'node_instance_id', $perticulerGroupAppDetailsArray['SGARInstanceId'], 'equalto');
                    $classObj->commonDeleteMethod('node-instance', 'node_instance_id', $perticulerGroupAppDetailsArray['SGARInstanceId'], 'equalto');
                    $sql = new Sql($this->adapter);
                    $delete = $sql->delete();
                    $delete->from('node-x-y-relation');
                    $delete->where->equalTo('node_x_id', $perticulerGroupAppDetailsArray['SGARInstanceNodeId']);
                    $delete->where->AND->equalTo('node_y_id', $perticulerGroupAppDetailsArray['GSInstanceNodeId']);
                    $statement = $sql->prepareStatementForSqlObject($delete);
                    $result = $statement->execute();
                }
            }
        }
        else
        {
            foreach($app_ids as $index => $productionId)
            {
                if(trim($productionId) != "")
                {
                    $perticulerGroupAppDetailsArray = $groupProductionArray[$group_id][$productionId];

                    $returnSubsGroupArray = $structureBuilderObj->createInstanceOfClass(SUBS_GROUP_ACT_ROLE_CLASS_ID, '1');
                    if (intval($returnSubsGroupArray['node_instance_id']) > 0) {
                        $propertyIdArray = array(SUBS_GROUP_ACT_ROLE_ROLE_PID);
                        $propertyValueArray = array($role_id);
                        $structureBuilderObj->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubsGroupArray['node_instance_id'], $returnSubsGroupArray['node_type_id'], 'N', array(), "");
                    }
                    $structureBuilderObj->createRelation($perticulerGroupAppDetailsArray['GSInstanceNodeId'], array($returnSubsGroupArray['node_id']));
                }
            }
        }

        return array($data,$perticuler_apps_list,$perticuler_apps_list_for_delete,$perticulerGroupAppDetailsArray,$addProductionArray,$deleteProductionArray);
    }

    public function getMainLeftMenu()
    {
        $sql                  	= new Sql($this->adapter);
        $select               	= $sql->select();
        $select->from('menu');
        $select->join(array('mt' => 'menu_type'), 'mt.menu_type_id=menu.menu_type_id', array('menu_type'), 'inner');
        $select->join(array('ma' => 'menu_action'), 'ma.menu_id=menu.menu_id', array('controler','action'), 'left');
        //->where->equalTo('menu.is_active',1);
        $select->order('menu.order asc');
        $statement            	= $sql->prepareStatementForSqlObject($select);
        $result               	= $statement->execute();
        $resultObj            	= new ResultSet();
        $tempMenuArray			= $resultObj->initialize($result)->toArray();

        $menu1					=	array();
        $menu2					=	array();
        foreach($tempMenuArray as $key => $value)
        {
            if(intval($value['parent_menu_id']) == 0)
                $menu1[]		=	$value;

            if(intval($value['parent_menu_id']) != 0)
                $menu2[$value['parent_menu_id']][]		=	$value;
        }

        $menuArray 				= 	array();
        $menuArray  			= 	$this->getSubMenu($menu1,$menu2,$menuArray);

        return $menuArray;
    }

    public function getLeftMenuFromClasses()
    {

        $classObj                                               = new ClassesTable($this->adapter);
        $tempMenuArray			= $classObj->getInstanceListOfParticulerClass(main_menu_cid, 'class', 'node_id');
        $tempMenuArrayAgain     = array();
        foreach($tempMenuArray as $k => $value)
        {
            if(intval($value['is_active']) == 1)
            $tempMenuArrayAgain[] = $value;
        }

        $menu1					=	array();
        $menu2					=	array();
        foreach($tempMenuArrayAgain as $key => $value)
        {
            if(intval($value['parent_menu_id']) == 0)
                $menu1[]		=	$value;

            if(intval($value['parent_menu_id']) != 0)
                $menu2[$value['parent_menu_id']][]		=	$value;
        }

        $menuArray 				= 	array();
        $menuArray  			= 	$this->getSubMenu($menu1,$menu2,$menuArray);

        $orderArray  			= 	$this->sortByKeyValue($menuArray, 'order');

        $newMenuArray           =   array();
        foreach($orderArray as $k => $order)
        {
            foreach($menuArray as $index => $value)
            {
                if(intval($value['order']) == intval($order))
                {
                    $newMenuArray[$index] = $value;
                }
            }
        }

        return $newMenuArray;
    }

    public function sortByKeyValue($data, $sortKey, $sort_flags=SORT_ASC)
    {
        if (empty($data) or empty($sortKey)) return $data;

        $ordered = array();
        foreach ($data as $key => $value)
            $ordered[$value[$sortKey]] = $value[$sortKey];

        ksort($ordered, $sort_flags);

        return array_values($ordered);
    }

    public function getLeftMenuFromClassesForCtrlPlusAction()
    {

        $classObj                                               = new ClassesTable($this->adapter);
        $tempMenuArray			= $classObj->getInstanceListOfParticulerClass(main_menu_cid, 'class', 'node_id');
        $menuArray     = array();
        foreach($tempMenuArray as $k => $value)
        {
            if(intval($value['is_active']) == 1)
                $menuArray[$value['menu_id']] = $value;
        }
        return $menuArray;
    }
}
