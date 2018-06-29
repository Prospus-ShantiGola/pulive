<?php

namespace Administrator\Model;

use Administrator\Controller\Plugin\AwsS3;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Predicate;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\AbstractTableGateway;
use Administrator\Model\ClassesTable;

class StructureBuilderTable extends AbstractTableGateway
{

    protected $table = 'node';
    protected $adapter;
    protected $classTableObj;

    public function __construct(Adapter $adapter)
    {
        //$classObj                 = new ClassesTable();
        $this->adapter = $adapter;
        $this->resultSetPrototype = new ResultSet();
        $this->resultSetPrototype->setArrayObjectPrototype(new Administrator());
        $this->initialize();
    }
   /**Added by Gaurav
     * Added on 04 July 2017
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
    /* subscribe section */

    public function getInstanceNodeIdByPropertyValue($propertyValue, $class_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value'), '');
        $select->where->equalTo('ni.node_class_id', $class_id);
        $select->where->AND->equalTo('ncp.value', $propertyValue);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    /* Login Start Work */

    public function fetchNodeXY($nodeYId)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('node_x_id' => new Predicate\Expression('GROUP_CONCAT( node_x_id )')));
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_y_id', $nodeYId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr[0]['node_x_id'];
    }

    public function fetchNodeYZ($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('node_x_id' => new Predicate\Expression('GROUP_CONCAT( node_x_id )')));
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 3);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr[0]['node_x_id'];
    }

    public function fetchNodeClassId($nodeXY)
    {

        $n = explode(",", $nodeXY);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('i_node_id' => new Predicate\Expression('GROUP_CONCAT(nc.node_id)')));
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ni.node_class_id', array());
        $select->where->IN('ni.node_id', $n);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr[0]['i_node_id'];
    }

    public function fetchNodeClassY($node_id)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-class'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 2);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }

        return $impldeNXY;
    }

    public function nodeClassYId($node_id)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('ncp.node_type_id', 2);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }

        return $impldeNXY;
    }

    public function nodeYClassValue($nodeClassId = "")
    {
        $np = explode(",", $nodeClassId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('caption', 'encrypt_status'));
        $select->where->IN('node_id', $np);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        if (intval($nodeArray[0]['encrypt_status']) == 1) {
            $classValue = $this->mc_decrypt($nodeArray[0]['caption'], ENCRYPTION_KEY);
        } else {
            $classValue = $nodeArray[0]['caption'];
        }
        return $classValue;
    }

    public function nodeClassYInstanceValue($nodeClassId = "")
    {
        $np = explode(",", $nodeClassId);
        $tempArr = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value', 'encrypt_status'));
        $select->where->IN('node_id', $np);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        /* if(intval($nodeArray[0]['encrypt_status']) == 1)
          $classValue = $this->mc_decrypt($nodeArray[0]['value'], ENCRYPTION_KEY); */

        foreach ($nodeArray as $key => $value) {
            if (intval($value['encrypt_status']) == 1) {
                $tempArr[$key] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);
            } else {
                $tempArr[$key] = $value['value'];
            }
        }

        return $tempArr;
    }

    public function getNodeInstaceId($node_id, $nodeClassId)
    {
        $classCaption = $this->fetchnodeClassCaption($nodeClassId);

        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $tempArra = array();
        $tempCaption = array();

        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption($value);
        }

        foreach ($tempCaption as $key => $value) {
            $tempArra[$value[0]['caption']] = $this->fetchnodeInstancePropertyVal($nodeId[$key]);
        }

        return $tempArra;
    }

    public function fetchnodeClassCaption($nodeClassId = "")
    {
        $np = explode(",", $nodeClassId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('caption', 'node_class_id'));
        $select->where->IN('node_id', $np);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    public function getClassInstanceValues($nodeInstanceId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('node_class_property_id', 'value'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->where->equalTo('nip.node_instance_id', $nodeInstanceId['deal_instance_id']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = $resultObj->initialize($result)->toArray();
        $resArr = array();
        foreach ($temp as $value) {
            $resArr[$value['node_class_property_id']] = $value['value'];
        }
        return $resArr;
    }

    public function fetchnodeInstancePropertyVal($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value', 'node_instance_property_encrypt' => 'encrypt_status'), '');
//$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption','node_class_property_encrypt'=>'encrypt_status'), '');
//$select->where(array('nc.node_class_id' => $node_class_id));
        $select->where->equalTo('ni.node_id', $node_id);
        $select->where->AND->notEqualTo('value', "");

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = $resultObj->initialize($result)->toArray();

        foreach ($temp as $key => $value) {
            if (intval($value['node_class_encrypt']) == 1) {
                $temp[$key]['node_class_caption'] = $this->mc_decrypt($value['node_class_caption'], ENCRYPTION_KEY);
            }


            if (intval($value['node_instance_encrypt']) == 1) {
                $temp[$key]['node_instance_caption'] = $this->mc_decrypt($value['node_instance_caption'], ENCRYPTION_KEY);
            }

            if (intval($value['node_instance_property_encrypt']) == 1) {
                $temp[$key]['value'] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);
            }


            if (intval($value['node_class_property_encrypt']) == 1) {
                $temp[$key]['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
            }
        }
        return $temp;
    }

    public function getPerticulerData($tableName, $columnArray, $columnName, $columnValue, $is_all)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from($tableName);
        $select->columns($columnArray);
        $select->where->equalTo($columnName, $columnValue);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        if (intval($is_all) == 0) {
            return $dataArray[0];
        } else {
            return $dataArray;
        }
    }

    public function loginUser($data)
    {

        if ($data['domainName'] != 'www.marinemax.com') {
            //Optimize Code
            $userArray = array();
            $userData = $this->fetchLoginUserData($data);
            
            if (count($userData)) {
                foreach ($userData as $userInfo) {
                    $userArray[$userInfo['caption1']] = $userInfo['value1'];
                    $userArray[$userInfo['caption2']] = $userInfo['value2'];
                    $userArray['node_id'] = $userInfo['node_id'];
                    $userArray['instance_id'] = $userInfo['node_instance_id'];
                    $userArray['status'] = $userInfo['status'];
                    if (!isset($userArray['password'])) {
                        $userArray['password'] = $userInfo['password'];
                    }
                    //added code by gaurav on 8 sept 2017
                    //for account status
                    $userArray['account_status'] = $userInfo['account_status'];
                }
                $userArray['domain'] = 'Prospus';   // new scenario, domain check is required, need to change
            }
            // print_r($userData);
            // die();
            //This rolesArray key will not come in case of PU
            //Below Query is not Optimized
            if (strtolower($userArray['domain']) != 'investible' && $userData[0]['node_id']) {
                $userRoleData = $this->fetchLoginUserRoleData($userData[0]['node_id']);
                $rolesArray = array();
                foreach ($userRoleData as $key => $roleValue) {
                    $rolesArray[$key]['id'] = $roleValue['id'];
                    $rolesArray[$key]['name'] = $roleValue['name'];
                }
                $userArray['rolesArray'] = $rolesArray;
            }
            return $userArray;
        } else {
            /*Below Code will remove when everything work fine*/
            /*Start From Here*/
            $temp = $this->getPerticulerData('node-class', array('node_class_id'), 'node_id', $data['node_id'], 0);

            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nii' => 'node-instance'));
            $select->join(array('ni' => 'node-instance-property'), 'ni.node_instance_id = nii.node_instance_id', array('node_instance_id', 'node_class_property_id', 'value'), 'inner');
            $select->where->equalTo('nii.node_class_id', $temp['node_class_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $classArray = $resultObj->initialize($result)->toArray();

            $node_class_property_id_emailaddress = $data['node_class_property_id_emailaddress'];
            $emailaddress = strtolower($data['emailaddress']);
            $node_class_property_id_password = $data['node_class_property_id_password'];
            $password = $data['password'];
            $node_instance_id = '';
            foreach ($classArray as $key => $value) {
                if ($emailaddress == strtolower($value['value']) && intval($node_class_property_id_emailaddress) == intval($value['node_class_property_id'])) {
                    $node_instance_id = $value['node_instance_id'];
                }
            }

            $userArray = array();
            if (trim($node_instance_id) != '') {
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('nii' => 'node-instance-property'));
                $select->where->equalTo('nii.node_instance_id', $node_instance_id);
                $select->where->And->equalTo('nii.node_class_property_id', $node_class_property_id_password);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $passArray = $resultObj->initialize($result)->toArray();

                if (trim($passArray[0]['value']) == trim($password)) {
                    $temp = $this->getPerticulerData('node-instance', array('node_id'), 'node_instance_id', $node_instance_id, 0);

                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from(array('nip' => 'node-x-y-relation'));
                    $select->where->equalTo('nip.node_x_id', $temp['node_id']);
                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $newArray = $resultObj->initialize($result)->toArray();

                    if ($newArray[0]['node_y_id'] != '') {
                        $userArray = $this->getUserProfile($newArray[0]['node_y_id'], INDIVIDUAL_CLASS_ID);
                        $userArray['node_id'] = $newArray[0]['node_y_id'];
                    }
                }
            }



            $rolesArray = array();
            if (intval($userArray['node_id']) > 0) {
                $allRolesArray = $this->getInstanceListOfParticulerClass(LOCATION_ROLE_DETAILS, 'class', 'node_instance_id');

                foreach ($allRolesArray as $key => $value) {
                    if (intval($value['ActorNID']) == intval($userArray['node_id'])) {
                        if (trim($value['RoleNID']) != '') {
                            $rolesArray[$value['RoleNID']] = $value['RoleNID'];
                        }
                    }
                }

                $allRolesArray = $this->getInstanceListOfParticulerClass(OPERATION_ROLE_CLASS_ID, 'class', 'node_id');
                $index = 0;
                $newRoleArray = array();
                foreach ($rolesArray as $key => $value) {
                    $newRoleArray[$index]['id'] = $key;
                    $newRoleArray[$index]['name'] = $allRolesArray[$key]['Title'];
                    $index++;
                }

                $userArray['rolesArray'] = $newRoleArray;
            }
            /*Remove Till Here*/
        }
        return $userArray;
    }

    /* Login End Work */

    /* Start fetch all structure of particuler class */

    public function getAllDataOfClass($node_id, $is_sub_class)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $classArray = $resultObj->initialize($result)->toArray();

        if (intval($classArray[0]['encrypt_status']) == 1) {
            $classArray[0]['caption'] = $this->mc_decrypt($classArray[0]['caption'], ENCRYPTION_KEY);
        }

        $classArray[0]['Properties'] = $this->getClassAllProperties($classArray[0]['node_class_id']);

        if ($is_sub_class == 'Y') {
            $subClassArray = $this->getClassChild($node_id);

            foreach ($subClassArray['data'] as $key => $value) {
                $classArray[0]['SubClass'][] = $this->getAllDataOfClass($value['child_node_id'], 'N');
            }
        }


        return $classArray[0];
    }

    public function getClassAllProperties($node_class_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_id', $node_class_id);
        $select->order('sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $propArray = $resultObj->initialize($result)->toArray();

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if (intval($propv['node_class_property_parent_id']) == 0) {
                if (intval($classArray[0]['encrypt_status']) == 1) {
                    $propv['caption'] = $this->mc_decrypt($propv['caption'], ENCRYPTION_KEY);
                }
                $mainPropArray[] = $propv;
            } else {
                if (intval($classArray[0]['encrypt_status']) == 1) {
                    $propv['caption'] = $this->mc_decrypt($propv['caption'], ENCRYPTION_KEY);
                }
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }
        }

        $realPropArray = array();
        return $this->getAllProperty($mainPropArray, $subPropArray, $realPropArray);
    }

    public function getAllProperty($main, $sub, $realArray)
    {
        foreach ($main as $key => $value) {
            $classObj = $this;
            $value['nodeXY'] = $classObj->fetchNodeXY($value['node_id']);
            $value['nodeZ'] = $classObj->fetchNodeYZ($value['node_id']);
            $value['nodeClassId'] = $classObj->fetchNodeClassId($value['nodeXY']);
            $value['nodeY'] = $classObj->fetchNodeClassY($value['node_id']);
            $value['nodeYClassValue'] = $classObj->nodeYClassValue($value['nodeY']);
            $value['nodeClassYId'] = $classObj->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $classObj->nodeClassYInstanceValue($value['nodeClassYId']);
            $value['nodeZStructure'] = $classObj->getNodeInstaceId($value['nodeZ'], $value['nodeClassId']);

            $realArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (is_array($sub[$value['node_class_property_id']])) {
                $realArray[$value['node_class_property_id']]['child'] = $this->getAllProperty($sub[$value['node_class_property_id']], $sub, $childArray);
            }
        }
        return $realArray;
    }

    public function getClassChild($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nsb' => 'node-sub-class'));
        $select->where->equalTo('nsb.primary_node_id', $node_id);
        $select->order('nsb.sequence ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        $ids = "";
        foreach ($nodeArray as $k => $v) {
            $ids = $ids . ',' . $v['child_node_id'];
        }
        return array('ids' => $ids, 'data' => $nodeArray);
    }

    /* End fetch all structure of particuler class */

    /* function use here to fetch node class id and node type id , make array of class and save node instance data in table */

    /* Create instance of the particuler class */

    //Comment by Ben
    /* public function createInstanceByParentandChildClass($node_class_id) {
      $tempArray = array();
      $tempArray = $this->getClassPropertyStructure($node_class_id);
      return $tempArray;
      } */

    public function getsubClassData($primary_node_id)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-sub-class');
        $select->columns(array('child_node_id'));
        $select->where->equalTo('primary_node_id', $primary_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $implodeNodeArray = array();

        foreach ($dataArray as $key => $value) {
            $implodeNodeArray[] = $value['child_node_id'];
        }

        return $implodeNodeArray;
    }

    /* get node class property id bases of node class id */

    public function getClassPropertyStructure($node_class_id)
    {
        $propArray = $this->getChildDataProperties($node_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if ($propv['encrypt_status'] == 1) {
                $mainPropArray[$propk]['caption'] = $this->mc_decrypt($propv['caption'], ENCRYPTION_KEY);
            } else {
                $mainPropArray[$propk]['caption'] = $propv['caption'];
            }
            $mainPropArray[$propk]['node_class_property_id'] = $propv['node_class_property_id'];
            $mainPropArray[$propk]['node_type_id'] = $propv['node_type_id'];
            $mainPropArray[$propk]['node_id'] = $propv['node_id'];
        }
        return $mainPropArray;
    }

    /*  Fetch List of Comment Instance List of particuler subject */

    public function getChildDataProperties($node_y_class_id, $is_parent = 'N')
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ncp1' => 'node-class-property'));
        $select->join(array('ncp2' => 'node-class-property'), 'ncp1.node_class_property_id = ncp2.node_class_property_parent_id', array(), 'left');
        $select->where->equalTo('ncp1.node_class_id', $node_y_class_id);
        $select->where->notEqualTo('ncp1.node_class_property_parent_id', 0);
        $select->where->isNull('ncp2.node_class_property_id');
        $select->order(array('ncp1.node_class_property_parent_id', 'ncp1.sequence'));
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /* Craete instance of the particuler class */

    public function createInstanceOfClass($node_class_id, $status)
    {
        $typeArray = $this->getClassList($node_class_id);
        $data['caption'] = $this->mc_encrypt($this->getLastNumber('node', 'node_id'), ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $typeArray['node_type_id'];
        $data['node_id'] = $this->createNode();
        $data['node_class_id'] = $node_class_id;
        $data['status'] = $status;
        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        return array('node_instance_id' => $this->adapter->getDriver()->getLastGeneratedValue(), 'node_type_id' => $typeArray['node_type_id'], 'node_id' => $data['node_id']);
    }

    public function createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id, $is_email = "", $autogenerated = array(), $instance_node_id = '')
    {
        $queryVals = array();
        $sqlQuery = "INSERT INTO `node-instance-property` (`value`, `encrypt_status`, `node_instance_id`, `node_id`, `node_type_id`, `node_class_property_id`) VALUES ";
        foreach ($instance_property_id as $key => $value) {
            if (trim($instance_property_caption[$key]) != "") {
                $newVal = trim($this->mc_encrypt($instance_property_caption[$key], ENCRYPTION_KEY));

                if (substr($newVal, -3) == CHECKBOX_SEPERATOR) {
                    $newValArray = explode(CHECKBOX_SEPERATOR, $newVal);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data = array();
                            $data['value'] = htmlspecialchars($v);  // modified code section awdhesh soni
                            $data['encrypt_status'] = ENCRYPTION_STATUS;
                            $data['node_instance_id'] = $node_instance_id;
                            $data['node_id'] = $this->createNode();
                            $data['node_type_id'] = $node_type_id;
                            $data['node_class_property_id'] = $value;
                            $resultString = '"' . implode('", "', $data) . '"';
                            $queryVals[] = '(' . $resultString . ')';
                            /* $sql = new Sql($this->adapter);
                              $query = $sql->insert('node-instance-property');
                              $query->values($data);
                              $statement = $sql->prepareStatementForSqlObject($query);
                              $result = $statement->execute(); */
                        }
                    }
                } else {
                    $data = array();
                    if (count($autogenerated) && in_array($value, $autogenerated)) {
                        $data['value'] = htmlspecialchars($instance_node_id);
                    } else {
                        $data['value'] = htmlentities($newVal);
                    }
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_instance_id'] = $node_instance_id;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = $node_type_id;
                    $data['node_class_property_id'] = $value;
                    $resultString = '"' . implode('", "', $data) . '"';
                    $queryVals[] = '(' . $resultString . ')';
                    /* $sql = new Sql($this->adapter);
                      $query = $sql->insert('node-instance-property');
                      $query->values($data);
                      $statement = $sql->prepareStatementForSqlObject($query);
                      $result = $statement->execute(); */
                }

                if (filter_var($newVal, FILTER_VALIDATE_EMAIL) && $is_email == "") {
                    // multiple recipients
                    $to = $newVal; // note the comma
                    // subject
                    $subject = 'Investible Signup Successfully';

                    // message
                    $message = '
                                    <html>
                                    <head>
                                    <title>Investible Registration</title>
                                    </head>
                                    <body>
                                    <p>You are registered successfully on Investible.</p><br/>
                                    Please go to <a href="http://166.62.17.201/investible/" >Login</a>
                                    </body>
                                    </html>
                                    ';

                    // To send HTML mail, the Content-type header must be set
                    $headers = 'MIME-Version: 1.0' . "\r\n";
                    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

                    // Additional headers
                    $headers .= 'From: Arvind Soni <arvind.soni@prospus.com>' . "\r\n";
                    // Mail it
                    mail($to, $subject, $message, $headers);
                }

                //delete all the user list file associated with minidailogue .Please don't delete this functionality
                array_map('unlink', glob(ABSO_URL . "data/perspective_cache/userlist*"));
            }
        }

        $sqlQuery = $sqlQuery . implode(',', $queryVals);
        /// return $sqlQuery;
        $statement = $this->adapter->query($sqlQuery);
        $result = $statement->execute();
        /* lines to check the query and the result */
        /* $resultObj = new ResultSet();
          $resultObj->initialize($result);
          $node_id = $this->adapter->getDriver()->getLastGeneratedValue();
          $returnArr['query']=$sqlQuery;
          $returnArr['node_id']=$node_id;
          return $returnArr; */
        /* end lines to check the query and the result */
    }

    public function getClassList($node_class_id = "")
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        if ($node_class_id != '') {
            $select->where->equalTo('node_class_id', $node_class_id);
        } else {
            $select->order('node_class_id ASC');
        }
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        if ($node_class_id != '') {
            return $nodeArray[0];
        } else {
            return $nodeArray;
        }
    }

    public function generate_uuid()
    {
        $sqlQuery = "SELECT UUID( ) AS uuid";
        $statement = $this->adapter->query($sqlQuery);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $uuidArray = $resultObj->initialize($result)->toArray();
        $gen_uuid = $uuidArray[0]['uuid'];
        if (strrpos($gen_uuid, '-')) {
            return str_replace('-', '', $gen_uuid);
        } else {
            return $gen_uuid;
        }
    }

    public function createNode()
    {
        $uuid_id = bin2hex(openssl_random_pseudo_bytes(8)); //$this->generate_uuid(); //get uuid value by using UUID algorithm from mySql

        $dataValues = array('node_uuid_id' => $uuid_id);

        $sql = new Sql($this->adapter);
        $select = $sql->insert('node'); //This table name "node" will be renamed and name will be "node"
        $select->values($dataValues);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        $node_id = $this->adapter->getDriver()->getLastGeneratedValue();
        return $node_id;
    }

    public function getLastNumber($table, $column)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL getLastNumber("' . $table . '", "' . $column . '");';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from($table);
            $select->order($column . ' ' . 'DESC');
            $select->limit(1);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }

        if (intval($dataArray[0][$column]) == "") {
            return 1;
        } else {
            return intval($dataArray[0][$column]) + 1;
        }
    }

    public function createRelation($node_y_id, $node_x_ids)
    {
        $returnArray = array();
        foreach ($node_x_ids as $index => $node_x_id) {
            $data['node_y_id'] = $node_y_id;
            $data['node_x_id'] = $node_x_id;

            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-x-y-relation');
            $query->values($data);

            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $resultObj->initialize($result);
            $returnArray[] = $this->adapter->getDriver()->getLastGeneratedValue();
        }

        return $returnArray;
    }

    /*  Stop instance of the particuler class */

    /*  Fetch List of Comment Instance List of particuler subject */

    /**
     * Modified by: Amit Malakar
     * Date: 16-Feb-2017
     * Stored Procedure added for get Properties of a class function
     * @param $node_y_class_id
     * @param string $is_parent
     * @return array
     */
    public function getProperties($node_y_class_id, $is_parent = 'N')
    {
        if (0) {
            if ($is_parent == 'Y') {
                $sqlQuery = "CALL getPropertiesY($node_y_class_id, 'sequence')";
            } elseif ($is_parent == 'N') {
                $sqlQuery = "CALL getPropertiesN($node_y_class_id, 'sequence')";
            }

            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-class-property');
            $select->where->equalTo('node_class_id', $node_y_class_id);
            if ($is_parent == 'Y') {
                $select->where->equalTo('node_class_property_parent_id', 0);
            }
            $select->order('sequence ASC');
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        }
    }

    public function getAllPropertyAgain($menu1, $menu2, $menuArray, $node_instance_id)
    {
        foreach ($menu1 as $key => $value) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id', 'value'));
            $select->where->equalTo('nip.node_instance_id', $node_instance_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $value['node_class_property_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            if (is_array($dataArray[0]) && count($dataArray) > 0) {
                if (intval($value['encrypt_status']) == 1) {
                    $menuArray[str_replace(' ', '_', strtolower($this->mc_decrypt($value['caption'], ENCRYPTION_KEY)))] = $this->mc_decrypt($dataArray[0]['value'], ENCRYPTION_KEY);
                } else {
                    $menuArray[str_replace(' ', '_', strtolower($value['caption']))] = $dataArray[0]['value'];
                }
            }

            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray = $this->getAllPropertyAgain($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id);
            }
        }
        return $menuArray;
    }

    public function getClassStructureAgain($node_class_id, $node_instance_id)
    {
        $propArray = $this->getProperties($node_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if (intval($propv['node_class_property_parent_id']) == 0) {
                $mainPropArray[] = $propv;
            } else {
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }
        }

        $realPropArray = array();
        return $this->getAllPropertyAgain($mainPropArray, $subPropArray, $realPropArray, $node_instance_id);
    }

    public function getNodeXOrYId($id, $fieldEqualTo, $fieldSend, $is_all_record, $node_class_id = "")
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-x-y-relation'));
        $select->columns(array($fieldSend));

        if ($node_class_id != "") {
            $select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.' . $fieldSend, array('node_class_id', 'node_id'), 'inner');
            $select->where->notEqualTo('ni.node_class_id', $node_class_id);
            $select->where->AND->equalTo('nip.' . $fieldEqualTo, $id);
        } else {
            $select->where->equalTo('nip.' . $fieldEqualTo, $id);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        if ($is_all_record == 'N') {
            return $dataArray[0][$fieldSend];
        } else {
            return $dataArray;
        }
    }

    public function getInstanceStructure($node_instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgain($instancesArray['node_class_id'], $node_instance_id);
        $instancesArray['user'] = $this->getNodeXOrYId($instancesArray['node_id'], 'node_x_id', 'node_y_id', 'N');
        $instancesArray['comment'] = $propArray;

        return $instancesArray;
    }

    /* function here to get class Structure for survey and item chat chat */

    public function getAllChatPropertyAgain($menu1, $menu2, $menuArray, $node_instance_id, $node_id)
    {



        foreach ($menu1 as $key => $value) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id', 'value'));
            $select->where->equalTo('nip.node_instance_id', $node_instance_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $value['node_class_property_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            $menuArray['node_id'] = $node_id;

            if (is_array($dataArray[0]) && count($dataArray) > 0) {
                if (intval($value['encrypt_status']) == 1) {
                    $menuArray[str_replace(' ', '_', strtolower($this->mc_decrypt($value['caption'], ENCRYPTION_KEY)))] = $this->mc_decrypt($dataArray[0]['value'], ENCRYPTION_KEY);
                } else {
                    $menuArray[str_replace(' ', '_', strtolower($value['caption']))] = $dataArray[0]['value'];
                }
            }

            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray = $this->getAllChatPropertyAgain($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $node_id);
            }
        }
        return $menuArray;
    }

    public function getChatClassStructureAgain($node_class_id, $node_instance_id, $node_id)
    {
        $propArray = $this->getProperties($node_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if (intval($propv['node_class_property_parent_id']) == 0) {
                $mainPropArray[] = $propv;
            } else {
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }
        }
        $realPropArray = array();
        return $this->getAllChatPropertyAgain($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $node_id);
    }

    /* function here to fetch */

    public function getSurveyChatInstanceStructure($node_instance_id)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $instancesArray = array();
        $instancesArray = $dataArray[0];
//$instancesArray['user']                       =   $this->getNodeXOrYId($instancesArray['node_id'],'node_x_id','node_y_id','N');
        $propArray = $this->getChatClassStructureAgain($instancesArray['node_class_id'], $node_instance_id, $instancesArray['node_id']);

        return $propArray;
    }

    /* end code here */

    public function getUserInstanceStructure($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->where->equalTo('ni.node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $propArray = $this->getClassStructureAgain($dataArray[0]['node_class_id'], $dataArray[0]['node_instance_id']);
        return $propArray;
    }

    public function getUserProfile($node_id, $node_class_id)
    {
        $userNodeIdArray[] = $node_id;
        $tempArray = $this->getNodeXOrYId($node_id, 'node_y_id', 'node_x_id', 'Y', $node_class_id);

        foreach ($tempArray as $key => $value) {
            $userNodeIdArray[] = $value['node_x_id'];
        }

        $userProfileArray = array();
        foreach ($userNodeIdArray as $key => $node_id) {
            $temp = $this->getUserInstanceStructure($node_id);
            $userProfileArray = array_merge($userProfileArray, $temp);
        }

        return $userProfileArray;
    }

    public function getInstanceListOfComments($subject)
    {
        $subject = $this->mc_encrypt($subject, ENCRYPTION_KEY);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->where->equalTo('value', $subject);
        $select->order('node_instance_property_id ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceTempArray = $resultObj->initialize($result)->toArray();

        $instanceIdArray = array();
        foreach ($instanceTempArray as $index => $value) {
            $instanceIdArray[$value['node_instance_id']] = $value['node_instance_id'];
        }

        $insArray = array_keys($instanceIdArray);

        $instanceList = array();
        foreach ($insArray as $key => $instanceId) {
            $instanceList[] = $this->getInstanceStructure($instanceId);
        }

        $userProfileArray = array();
        foreach ($instanceList as $key => $value) {
            if (!is_array($userProfileArray[$value['user']])) {
                $userProfileArray[$value['user']] = $this->getUserProfile($value['user'], $value['node_class_id']);
            }
        }

        foreach ($instanceList as $key => $value) {
            if (intval($value['user']) == 0 || $value['user'] == "") {
                $instanceList[$key]['comment']['userName'] = "Anonymous";
            } else {
                $instanceList[$key]['comment']['userName'] = $userProfileArray[$value['user']]['first_name'] . " " . $userProfileArray[$value['user']]['last_name'];
            }
        }

        $removeInstanceList = array();
        foreach ($instanceList as $key => $value) {
            $node_instance_id = $value['node_instance_id'];
            $childArray = array();
            foreach ($instanceList as $key1 => $value1) {
                if ($node_instance_id == $value1['comment']['parent_comment']) {
                    $value1['comment']['node_instance_id'] = $value1['node_instance_id'];
                    $childArray[] = $value1['comment'];
                    $removeInstanceList[] = $value1['node_instance_id'];
                }
            }

            $instanceList[$key]['child'] = $childArray;
        }

        $newListArray = array();
        foreach ($instanceList as $key => $value) {
            $node_instance_id = $value['node_instance_id'];
            if (!in_array($node_instance_id, $removeInstanceList)) {
                $newListArray[] = $value;
            }
        }

        return $newListArray;
    }

    /* get node instance structure bases of chat room id */

    public function getNodeInstanceStructure($chat_room_id)
    {
        $chat_room_id = $this->mc_encrypt($chat_room_id, ENCRYPTION_KEY);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('node_instance_id', 'node_id'));
        $select->where->equalTo('value', $chat_room_id);
        $select->order('node_instance_property_id ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceTempArray = $resultObj->initialize($result)->toArray();


        $instanceIdArray = array();
        $nodeIdArray = array();
        foreach ($instanceTempArray as $index => $value) {
            $instanceIdArray[$value['node_instance_id']] = $value['node_instance_id'];
            $nodeIdArray[$value['node_id']] = $value['node_id'];
        }

        $insArray = array_keys($instanceIdArray);


        $instanceList = array();
        foreach ($insArray as $key => $instanceId) {
            $instanceList[] = $this->getSurveyChatInstanceStructure($instanceId);
        }

        return $instanceList;
    }

    /* end code here */

    public function mc_decrypt($decrypt, $key)
    {
        $decrypt = explode('|', $decrypt . '|');
        $decoded = base64_decode($decrypt[0]);
        $iv = base64_decode($decrypt[1]);
        if (strlen($iv) !== mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC)) {
            return false;
        }
        $key = pack('H*', $key);
        $decrypted = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $decoded, MCRYPT_MODE_CBC, $iv));
        $mac = substr($decrypted, -64);
        $decrypted = substr($decrypted, 0, -64);
        $calcmac = hash_hmac('sha256', $decrypted, substr(bin2hex($key), -32));
        if ($calcmac !== $mac) {
            return false;
        }
        $decrypted = unserialize($decrypted);
        return $decrypted;
    }

    public function mc_encrypt($encrypt, $key)
    {
        if (ENCRYPTION_STATUS == 0) {
            return $encrypt;
        } else {
            $encrypt = serialize($encrypt);
            $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_DEV_URANDOM);
            $key = pack('H*', $key);
            $mac = hash_hmac('sha256', $encrypt, substr(bin2hex($key), -32));
            $passcrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $encrypt . $mac, MCRYPT_MODE_CBC, $iv);
            $encoded = base64_encode($passcrypt) . '|' . base64_encode($iv);
            return $encoded;
        }
    }

    /**
     * Function to get the statement count associated with dialogue
     * Created by Arti Sharma for vessel wise
     */
    public function getSatementCount($data_post)
    {


        $start_date = $data_post['start_date'];
        $end_date = $data_post['end_date'];
        $conversion_node_class_id = '89';
        $node_class_property_id_addeddate = '499'; //caption - addeddate
        $node_class_property_id_sender_id = '494'; //caption - sender_id

        $sql = "SELECT nip.`node_instance_id`, DATE_FORMAT(nip.value,'%Y-%m-%d') as date_val,
(SELECT nip1.value FROM `node-instance-property` nip1
WHERE nip1.`node_class_property_id`='$node_class_property_id_sender_id'
AND nip1.node_instance_id = nip.`node_instance_id`) as sender_id
FROM `node-instance-property` nip
LEFT JOIN `node-instance` ni ON nip.`node_instance_id` = ni.`node_instance_id`
WHERE nip.`node_class_property_id`='$node_class_property_id_addeddate' AND ni.node_class_id ='$conversion_node_class_id'
AND DATE(nip.value) BETWEEN '$end_date' AND '$start_date'";

        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $x_yArray = $resultObj->initialize($result)->toArray();
        $main_ary = array();
        $inner_ary = array();
        foreach ($x_yArray as $output) {
            $node_instance_id = $output['node_instance_id'];
            $date_val = $output['date_val'];
            $sender_id = $output['sender_id'];
            if ($sender_id != '' && $date_val != '') {
//$main_ary[$date_val][$sender_id][] = $node_instance_id;
                $main_ary[$sender_id][$date_val][] = $node_instance_id;
            }
        }

        return $main_ary;
    }

    /**
     * Chat Functionality starts from here
     * Function to fetch all the dialogue associated with the user from file
     * Created by Arti Sharma
     * Absolute path - /var/www/html/testing_environment/
     */
    public function getAllDialogueInstances($variable_data, $is_sub_class)
    {

        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        //return $this->getAllDialogueInstancesByCourse($variable_data);
        $final_ary = array();
        // get all the instances of dialogue by course
        $dialog_ary = $this->getCourseDilogueFromFile($variable_data);
        if (!empty($dialog_ary)) {
            $temp = explode(',', $dialog_ary[0]['dialogue_instance_node_id']);

            for ($i = 0; $i < count($temp); $i++) {
                if ($temp[$i]) {
                    //sreturn $this->getAllDialogueByDilaogId($temp[$i], $user_instance_node_id);
                    $dialog_info = $this->getDilogueDataFromFile($temp[$i], $variable_data);
                    if (!empty($dialog_info)) {
                        $final_ary[$temp[$i]] = $dialog_info[0];
                    }
                }
            }
        }
        return $final_ary;
    }

    public function getDialogInfo($user_instance_node_id)
    {
        $dialogAry = $this->getAllDialogueInstancesInfo($user_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'userdialogue_' . $user_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $file_create = fopen($file_path, "w+") or die('cannot create file');

        foreach ($dialogAry as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id'];
            $dialog_title = $value['dialog_title'];
            $course_title = $value['course_title'];
            $user_name = $value['user_name'];
            $user_id = $value['user_id'];
            $node_instance_property_id = $value['node_instance_property_id'];
            $course_instance_node_id = $value['course_instance_node_id'];
            $search_info = $value['search_info'];

            if (file_exists($file_path)) {
                $file_data = file_get_contents($file_path);
                $count = strlen(trim($file_data));

                if ($count == 0) {
                    $insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'course_title=' . $course_title . '#~#' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . '#~#' . 'search_info=' . $search_info;
                } else {
                    $insert_string = 'x~x' . 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'course_title=' . $course_title . '#~#' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . '#~#' . 'search_info=' . $search_info;
                }
            }
//chmod($file_path, 511);
            fputs($file_create, trim($insert_string));
        }
        fclose($file_create);
    }

    /**
     * Function to fetch all the dialogue associated with the user
     * Created by Arti Sharma
     */
    public function getAllDialogueInstancesInfo($user_instance_node_id)
    {
        $dialogue_node_class_id = DIALOGUE_CLASS_ID;
        $course_class_node_id = COURSE_CLASS_ID;
        $user_class_node_id = INDIVIDUAL_CLASS_ID;

        //get all dialogue instance associated with an user
        $sql = "SELECT `ni`.`node_id` AS `dialogue_instance_node_id`,ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id` WHERE ni.node_instance_id NOT IN (SELECT ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id` WHERE `xy`.`node_x_id` = $user_instance_node_id AND `ni`.`node_class_id` = $dialogue_node_class_id AND nip.value ='Document') AND  `xy`.`node_x_id` = $user_instance_node_id AND `ni`.`node_class_id` = $dialogue_node_class_id AND `ncp`.`caption` = 'Timestamp' AND `ni`.`status` = '1' ORDER BY `nip`.`value` DESC";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $x_yArray = $resultObj->initialize($result)->toArray();

        $temp_user_array = array();
        $dialog_array = '';
        $i = 0;
        $mainAry = array();

        foreach ($x_yArray as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id']; //22292
            $node_instance_id = $value['node_instance_id'];
            $dialog_array .= $dialogue_instance_node_id . ",";
            $dialog_instance_ary.= $node_instance_id . ",";
        }
        $dialog_array = explode(',', $dialog_array);
        $dialog_instance_ary = explode(',', $dialog_instance_ary);
        //get with which course the dialogue associated
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('course_instance_node_id' => 'node_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('dialogue_instance_node_id' => 'node_x_id'));
        $select->where->IN('xy.node_x_id', $dialog_array);
        $select->where->AND->equalTo('ni.node_class_id', $course_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Title');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $course_array = $resultObj->initialize($result)->toArray();
        $new_course = array_reverse($course_array);
        $courseAry = array();
        foreach ($new_course as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id'];
            $course_title = $value['value'];
            $course_instance_node_id = $value['course_instance_node_id'];
            $courseAry[$dialogue_instance_node_id]['course_title'] = $course_title;
            $courseAry[$dialogue_instance_node_id]['course_instance_node_id'] = $course_instance_node_id;
        }

        //get title of dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => 'value', 'node_instance_property_id' => 'node_instance_property_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('dialogue_instance_node_id' => 'node_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->IN('nip.node_instance_id', $dialog_instance_ary);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Title');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dailogtitle_array = $resultObj->initialize($result)->toArray();
        $dailogtitleAry = array();
        foreach ($dailogtitle_array as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id'];
            $dialog_title = $value['value'];
            $node_instance_property_id = $value['node_instance_property_id'];
            $dailogtitleAry[$dialogue_instance_node_id]['dialog_title'] = $dialog_title;
            $dailogtitleAry[$dialogue_instance_node_id]['node_instance_property_id'] = $node_instance_property_id;
        }

        foreach ($x_yArray as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id']; //22292
            $node_instance_id = $value['node_instance_id'];
            $mainAry[$i]['dialogue_instance_node_id'] = $value['dialogue_instance_node_id'];
            $mainAry[$i]['node_instance_id'] = @$value['node_instance_id'];

//get all the user associated with the dialogue
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array());
            $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_x_id'));
            $select->where->equalTo('xy.node_y_id', $dialogue_instance_node_id);
            $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
            $select->where->AND->equalTo('ni.status', 1);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $userArray = $resultObj->initialize($result)->toArray();
            $user_data = '';
            $user_ids = '';
            foreach ($userArray as $output) {
                $user_instance_node_id = $output['user_instance_node_id'];

                if (!array_key_exists($user_instance_node_id, $temp_user_array)) {
                    $res = $this->getUserProfile($user_instance_node_id, $user_class_node_id);
                    $username = $res['first_name'] . " " . $res['last_name'];
                    $temp_user_array[$user_instance_node_id] = $username;
                }

                $username = $temp_user_array[$user_instance_node_id];

                $user_data .= $username . ", ";
                $user_ids .= $user_instance_node_id . ",";
            }

            $mainAry[$i]['user_name'] = rtrim($user_data, ', ');
            $mainAry[$i]['user_id'] = rtrim($user_ids, ',');
            $mainAry[$i]['course_title'] = $courseAry[$dialogue_instance_node_id]['course_title'];
            $mainAry[$i]['course_instance_node_id'] = $courseAry[$dialogue_instance_node_id]['course_instance_node_id'];
            $mainAry[$i]['dialog_title'] = @$dailogtitleAry[$dialogue_instance_node_id]['dialog_title'];
            $mainAry[$i]['node_instance_property_id'] = @$dailogtitleAry[$dialogue_instance_node_id]['node_instance_property_id'];
            $mainAry[$i]['search_info'] = @$dailogtitleAry[$dialogue_instance_node_id]['dialog_title'] . " " . rtrim($user_data, ', ');
            $i++;
        }
        return $mainAry;
    }

    /**
     * INSERT DIALOGUE INSTANCE IN  --------------- FILE
     * Function to insert all the dialogue associated with the course in file
     * Created by Arti Sharma
     */
    public function insertAllDialogueInstanceByCourse($variable_data)
    {

        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $dialogAry = $this->getAllDialogueInstancesByCourse($variable_data);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'course_dialogue_data_' . $course_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $file_create = fopen($file_path, "w+") or die('cannot create file');

        $dialogue_instance_node_id = $dialogAry['dialogue_instance_node_id'];
        $node_instance_id = $dialogAry['node_instance_id'];

        if (file_exists($file_path)) {
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            $insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'node_instance_id=' . $node_instance_id;
        }
        //chmod($file_path, 511);
        fputs($file_create, trim($insert_string));

        fclose($file_create);
    }

    /**
     * GET DIALOGUE INSTANCE FROM --------------- DATABASE
     * Function to fetch all the dialogue associated with the course from database
     * Created by Arti Sharma
     */
    public function getAllDialogueInstancesByCourse($variable_data)
    {

        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $dialogue_node_class_id = DIALOGUE_CLASS_ID;
        //get all dialogue instance associated with an course according to time stamp as well as not equal to Document
        $sql = "SELECT `ni`.`node_id` AS `dialogue_instance_node_id`,ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE ni.node_instance_id NOT IN (SELECT ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = $course_instance_node_id AND `ni`.`node_class_id` = $dialogue_node_class_id AND nip.value ='Document') AND  `xy`.`node_y_id` = $course_instance_node_id AND `ni`.`node_class_id` = $dialogue_node_class_id AND `ncp`.`caption` = 'Updated Timestamp' AND `ni`.`status` = '1' ORDER BY `nip`.`value` DESC";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $x_yArray = $resultObj->initialize($result)->toArray();



        $dialog_array = '';
        $dialog_instance_ary = '';
        $mainAry = array();
        foreach ($x_yArray as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id']; //22292
            $node_instance_id = $value['node_instance_id'];
            $dialog_array .= $dialogue_instance_node_id . ",";
            $dialog_instance_ary.= $node_instance_id . ",";
        }
        $dialog_array = rtrim($dialog_array, ', ');
        // get all the dialogue associated with the logged in user
        $sql = "SELECT `ni`.`node_id` AS `dialogue_instance_node_id`,ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id` WHERE ni.node_id IN (" . $dialog_array . ")  AND  `xy`.`node_x_id` = $user_instance_node_id AND `ni`.`node_class_id` = $dialogue_node_class_id AND `ncp`.`caption` = 'Updated Timestamp' AND `ni`.`status` = '1' ORDER BY `nip`.`value` DESC";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $x_yArray = $resultObj->initialize($result)->toArray();
        $dialog_array = '';
        foreach ($x_yArray as $value) {
            $dialogue_instance_node_id = $value['dialogue_instance_node_id']; //22292
            $node_instance_id = $value['node_instance_id'];
            $dialog_array .= $dialogue_instance_node_id . ",";
            $dialog_instance_ary.= $node_instance_id . ",";
        }
        $mainAry['dialogue_instance_node_id'] = $dialog_array;
        $mainAry['node_instance_id'] = $dialog_instance_ary;
        return $mainAry;
    }

    /**
     * GET DIALOGUE INSTANCE FROM --------------- FILE
     * Function to read all the dialogue info associated with the course from file
     * Created by Arti Sharma
     */
    public function getCourseDilogueFromFile($variable_data)
    {

        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $this->insertAllDialogueInstanceByCourse($variable_data);
        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'course_dialogue_data_' . $course_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $dialogAry = array();

        if (file_exists($file_path)) {
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->readUserDialogFile($file_data);
            }
        } else {
            // function to enter all the dialogue info into the file
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));

            if ($count == 0) {
                $data = $this->readUserDialogFile($file_data);
            }
        }
        return $data;
    }

    public function readUserDialogFile($file_data)
    {
        $dialog_data = explode('#~#', $file_data);

        $dialogAry = array();
        if (!empty($dialog_data[0])) {
            for ($i = 0; $i < count($dialog_data);) {
//$content_data =  explode('=',$dialog_data[$i]);//
                $temp = explode('=', $dialog_data[$i]);
                $dialogAry[0][$temp['0']] = $temp['1'];

                $i++;
            }
            return $dialogAry;
        } else {
            return 'no record found.';
        }
    }

    /**
     *  Function to fetch the dialogue info from database
     *  Created by Arti Sharma
     */
    public function getAllDialogueByDilaogId($dialogue_instance_node_id, $user_instance_node_id)
    {
        $dialogue_node_class_id = DIALOGUE_CLASS_ID;
        $course_class_node_id = COURSE_CLASS_ID;
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        $mainAry = array();
        // added code by awdhesh for fetch course
        //get with which course the dialogue associated
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('course_instance_node_id' => 'node_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('dialogue_instance_node_id' => 'node_x_id'));
        $select->where->equalTo('xy.node_x_id', $dialogue_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $course_class_node_id);
        //$select->where->AND->equalTo('ni.status',1);  // modified by awdhesh
        $select->where->AND->equalTo('ncp.caption', 'Title');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $course_array = $resultObj->initialize($result)->toArray();

        // end code here
        //get title of dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => 'value', 'node_instance_property_id' => 'node_instance_property_id', 'node_instance_id' => 'node_instance_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('status' => 'status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->equalTo('ni.node_id', $dialogue_instance_node_id);
        //$select->where->AND->equalTo('ni.status',1);
        $select->where->AND->equalTo('ncp.caption', 'Title');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dailogtitle_array = $resultObj->initialize($result)->toArray();


        // added code by awdhesh for fetch course get Created By (Admin) dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => 'value', 'node_instance_property_id' => 'node_instance_property_id', 'node_instance_id' => 'node_instance_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->equalTo('ni.node_id', $dialogue_instance_node_id);
        //$select->where->AND->equalTo('ni.status',1);
        $select->where->AND->equalTo('ncp.caption', 'Admin');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dailogadmin_array = $resultObj->initialize($result)->toArray();

        // end code here
        // get timestamp

        $node_instance_id = $dailogtitle_array[0]['node_instance_id'];
        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = '$node_instance_id' AND ( `ncp`.`caption` = 'Timestamp' OR `ncp`.`caption` = 'Admin' )";

        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $detailarray = $resultObj->initialize($result)->toArray();


        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_x_id'));
        $select->where->equalTo('xy.node_y_id', $detailarray['0']['value']);
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        //$select->where->AND->equalTo('ni.status', 1);
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $accountInfo = $resultObj->initialize($result)->toArray();

        //get all the user associated with the dialogue


        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = '$dialogue_instance_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' AND `ni`.`status` = '1' AND (ncp.caption ='First Name' or ncp.caption ='Last Name')";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        $user_data = '';
        $user_ids = '';
        $temp_ary = array();

        foreach ($userArray as $output) {
            $user_instance_node_id = $output['user_instance_node_id'];
            $caption = $output['caption'];
            $temp_ary[$user_instance_node_id][$caption] = $output['value'];
            $temp_ary[$user_instance_node_id]['user_instance_node_id'] = $user_instance_node_id;
        }
        foreach ($temp_ary as $val) {
            $username = $val['First Name'] . " " . $val['Last Name'];
            $user_instance_node_id = $val['user_instance_node_id'];
            $user_data .= $username . ", ";
            $user_ids .= $user_instance_node_id . ",";
        }


        $mainAry['user_name'] = rtrim($user_data, ', ');
        $mainAry['user_id'] = rtrim($user_ids, ',');
        $mainAry['course_title'] = $course_array[0]['value']; // added by awdhesh soni
        $mainAry['course_instance_node_id'] = $course_array[0]['course_instance_node_id'];
        $mainAry['dialog_title'] = @$dailogtitle_array[0]['value'];
        $mainAry['dialog_status'] = @$dailogtitle_array[0]['status']; //added by awdhesh soni
        $mainAry['dialog_admin'] = @$dailogadmin_array[0]['value'];  // added by awdhesh soni

        $mainAry['node_instance_property_id'] = @$dailogtitle_array[0]['node_instance_property_id'];
        $mainAry['node_instance_id'] = @$dailogtitle_array[0]['node_instance_id'];
        $mainAry['dialogue_instance_node_id'] = $dialogue_instance_node_id;
        $mainAry['search_info'] = @$dailogtitle_array[0]['value'] . " " . rtrim($user_data, ', ');
        $mainAry['dialogue_timestamp'] = @$detailarray[1]['value'];
        $mainAry['admin_email'] = $accountInfo['0']['value'];
        //$mainAry['notification_count'] = $this->getNotificationCount($dialogue_instance_node_id, $user_instance_node_id);

        return $mainAry;
    }

    /**
     * Function to insert all the dialogue info associated with the dialogue in file
     * Created by Arti Sharma
     */
    public function insertAllDialogueInfoById($dialogue_instance_node_id, $user_instance_node_id)
    {
        $dialogAry = $this->getAllDialogueByDilaogId($dialogue_instance_node_id, $user_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'dialogue_info_' . $dialogue_instance_node_id;
        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        //$file_create = fopen($file_path, "w+") or die('cannot create file');
        // Update Permission for double instance
        //chmod($file_path, 0777);

        $dialogue_instance_node_id = $dialogAry['dialogue_instance_node_id'];
        $dialog_title = $dialogAry['dialog_title'];
        $course_title = $dialogAry['course_title']; //modified by awdhesh
        $user_name = $dialogAry['user_name'];
        $user_id = $dialogAry['user_id'];

        $createdBy = $dialogAry['dialog_admin'];  // added by awdhesh
        $dialogueStatus = $dialogAry['dialog_status']; // added by awdhesh

        $node_instance_property_id = $dialogAry['node_instance_property_id'];
        $course_instance_node_id = $dialogAry['course_instance_node_id'];
        $search_info = $dialogAry['search_info'];
        $dialogue_timestamp = $dialogAry['dialogue_timestamp'];
        $admin_email = $dialogAry['admin_email'];

        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        $insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'course_title=' . $course_title . '#~#' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info . '#~#' . 'createdBy=' . $createdBy . '#~#' . 'dialogueStatus=' . $dialogueStatus;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
        /* if (file_exists($file_path)) {
          $file_data = file_get_contents($file_path);
          $count = strlen(trim($file_data));
          //  $insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'course_title=' . $course_title . '#~#' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info;
          // code modified by awdhesh add some more parameter in string
          //$insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info . "#~#" . 'dialogue_timestamp=' . $dialogue_timestamp . "#~#" . 'admin_email=' . $admin_email. "#~#" . 'dialogueStatus=1'. "#~#" .'createdBy='.$createdBy[0];

          $insert_string = 'dialogue_instance_node_id=' . $dialogue_instance_node_id . '#~#' . 'dialog_title=' . $dialog_title . '#~#' . 'course_title=' . $course_title . '#~#' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info . '#~#' . 'createdBy=' . $createdBy . '#~#' . 'dialogueStatus=' . $dialogueStatus;
          } */

        //chmod($file_path, 511);
        //fputs($file_create, trim($insert_string));
        //fclose($file_create);
        // Update Permission for double instance
        //chmod($file_path, 0777);
    }

    /**
     * Function to read all the dialogue info associated with the dialogue from file
     * Created by Arti Sharma
     */
    public function getDilogueDataFromFile($dialogue_instance_node_id, $variable_data)
    {


        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'dialogue_info_' . $dialogue_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $dialogAry = array();
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        //if (file_exists($file_path)) {
        if ($awsObj->isObjectExist($awsFilePath)) {
            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->readDialogFile($file_data, $dialogue_instance_node_id, $user_instance_node_id);
            }
        } else {
            // function to enter all the dialogue info into the file
            $this->insertAllDialogueInfoById($dialogue_instance_node_id, $user_instance_node_id);

            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));

            if ($count == 0) {
                $data = $this->readDialogFile($file_data, $dialogue_instance_node_id, $user_instance_node_id);
            }
        }
        return $data;
    }

    public function readDialogFile($file_data, $dialogue_instance_node_id, $user_instance_node_id)
    {
        $dialog_data = explode('#~#', $file_data);

        $dialogAry = array();
        if (!empty($dialog_data[0])) {
            for ($i = 0; $i < count($dialog_data);) {
                //$content_data =  explode('=',$dialog_data[$i]);//
                $temp = explode('=', $dialog_data[$i]);
                $dialogAry[0][$temp['0']] = $temp['1'];

                $i++;
            }
            $dialogAry[0]['notification_count'] = $this->getNotificationCount($dialogue_instance_node_id, $user_instance_node_id);

            return $dialogAry;
        } else {
            return 'no record found.';
        }
    }

    /**
     * Function to search course and dialogue of logged in user.
     * Called from dialogue.js  function ---- searchDialogDetail
     */
    public function searchDialogDetail_old($dialog_data)
    {
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $search_string = $dialog_data['search_string'];

        $data = array();
        $dialog_ary = $this->getUserDilogueFromFile($user_instance_node_id);
        //$dialog_ary = $this->getCourseDilogueFromFile($user_instance_node_id);
        if (!empty($dialog_ary)) {
            $temp = explode(',', $dialog_ary[0]['dialogue_instance_node_id']);

            for ($i = 0; $i < count($temp); $i++) {
                if ($temp[$i]) {
                    $dialog_info = $this->getDilogueDataFromFile($temp[$i], $user_instance_node_id);
                    if (!empty($dialog_info)) {
                        $data[$i] = $dialog_info[0];
                    }
                }
            }
        }


        $results = array();

        if ($search_string != '') {
            $search_string = preg_replace('!\s+!', ' ', $search_string);
            foreach ($data as $subarray) {
                $hasValue = false;

                foreach ($subarray as $key => $value) {
                    if ($key == 'search_info') {
                        if (!is_numeric($value)) {
                            $value = strtolower($value);
//$value = str_replace(" ","",$value);
                            $value = preg_replace('!\s+!', ' ', $value);

                            $search_string = strtolower($search_string);

                            if (strpos($value, $search_string) !== false) {
                                $hasValue = true;
                            }
                        }
                    }
                }
                if ($hasValue) {
                    $results[] = $subarray;
                }
            }
        } else {
            $results = $data;
        }

        return $results;
    }

    /**
     * Function to search course and dialogue of logged in user.
     * Called from dialogue.js  function ---- searchDialogDetail
     */
    public function searchDialogDetail($dialog_data)
    {
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $search_string = $dialog_data['search_string'];
        $final_ary = array(); //
        $data_ary = array();
        // get all the instances of dialogue by user
        $user_course_ary = $this->getUserCourseFromFile($user_instance_node_id);
        if (!empty($user_course_ary)) {
            $temp = explode(',', $user_course_ary[0]['course_instance_node_id']);
            for ($i = 0; $i < count($temp); $i++) {
                if ($temp[$i]) {
                    $course_info = $this->getCourseInfoFromFile($temp[$i], $user_instance_node_id);
                    if (!empty($course_info)) {
                        $final_ary[$temp[$i]] = $course_info[0];
                        $final_ary[$temp[$i]]['search_data'] = $final_ary[$temp[$i]]['course_title'];
                        //$final_ary[$temp[$i]]['dialog_data'] = '0';

                        $variable_data['user_instance_node_id'] = $user_instance_node_id;
                        $variable_data['course_instance_node_id'] = $temp[$i];
                        $dialog_ary = $this->getCourseDilogueFromFile($variable_data);
                        if (!empty($dialog_ary)) {
                            $tempary = explode(',', $dialog_ary[0]['dialogue_instance_node_id']);

                            for ($j = 0; $j < count($tempary); $j++) {
                                if ($tempary[$j]) {
                                    $dialog_info = $this->getDilogueDataFromFile($tempary[$j], $variable_data);
                                    if (!empty($dialog_info)) {
                                        $final_ary[$temp[$i]]['dialog_data'] = '1';
                                        $dialog_info[0]['search_data'] = $final_ary[$temp[$i]]['course_title'] . ',' . $dialog_info[0]['dialog_title'];
                                        //  $final_ary[$temp[$i]]['search_data'] .= ','.$dialog_info[0]['dialog_title'];
                                        $final_ary[$temp[$i]][] = $dialog_info[0];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $results = array();
        $course_ary = array();
        $data_final = array();
        //return $final_ary;
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

                                        if (strpos($data_ary, $search_string) !== false) {
                                            $hasValue = true;
                                        }
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

                                if (strpos($value, $search_string) !== false) {
                                    $hasValue = true;
                                }
                            }
                        }
                    }
                    if ($hasValue) {
                    //$results[] = $subarray;
                        array_push($course_ary, $subarray);
                    }
                    $results = $course_ary;
                }
            }
        } else {
            $results = $final_ary;
        }

        return $results;
    }

    public function dialogData($file_data)
    {
        $dialog_data = explode('x~x', $file_data);

        $dialogAry = array();
        if (!empty($dialog_data[0])) {
            for ($i = 0; $i < count($dialog_data);) {
                $content_data = explode('#~#', $dialog_data[$i]);

                for ($j = 0; $j < count($content_data); $j++) {
                    $temp = explode('=', $content_data[$j]);
                    $dialogAry[$i][$temp['0']] = $temp['1'];
                }
                $i++;
            }
            return $dialogAry;
        } else {
            return 'no record found.';
        }
    }

    /**
     * Function to read all the dialogue info associated with the user from file
     * Created by Arti Sharma
     */
    public function getUserDilogueFromFile($user_instance_node_id)
    {
        $this->insertAllDialogueInstanceByUser($user_instance_node_id);
        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'user_dialogue_data_' . $user_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $dialogAry = array();
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        // NOT SURE WHY SAME CODE IS WRITTEN IN IF ELSE, so adding AWS code in IF only
        //if (file_exists($file_path)) {
        if ($awsObj->isObjectExist($awsFilePath)) {
            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->readUserDialogFile($file_data);
            }
        } else {
            // function to enter all the dialogue info into the file


            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));

            if ($count == 0) {
                $data = $this->readUserDialogFile($file_data);
            }
        }
        return $data;
    }

    /**
     * Function to maintain notification count by user

      public function mantainNotification($dialogue_instance_node_id,$user_instance_node_id)
      {
      $folder_path = ABSO_URL . "data/perspective_cache/";
      $filename = 'notification_count_' . $dialogue_instance_node_id.'_'.$user_instance_node_id;
      $txt_filename = $filename . ".txt";
      $file_path = $folder_path . $txt_filename;
      $file_create = fopen($file_path, "w+") or die('cannot create file');
      if (file_exists($file_path)) {
      $file_data = file_get_contents($file_path);
      $count = strlen(trim($file_data));
      $insert_string = $this->getNotificationCount($dialogue_instance_node_id,$user_instance_node_id);

      }
      //chmod($file_path, 511);
      fputs($file_create, trim($insert_string));

      fclose($file_create);
      } */
    /**
     * Return Notifciation count from file

      public function getNotificationCountFromFile($dialogue_instance_node_id,$user_instance_node_id)
      {
      $this->mantainNotification($dialogue_instance_node_id,$user_instance_node_id);
      $folder_path = ABSO_URL . "data/perspective_cache/";
      $filename = 'notification_count_' . $dialogue_instance_node_id.'_'.$user_instance_node_id;

      $txt_filename = $filename . ".txt";
      $file_path = $folder_path . $txt_filename;
      $dialogAry = array();

      if (file_exists($file_path)) {

      $file_create = fopen($file_path, "r");
      $file_data = file_get_contents($file_path);
      $count = strlen(trim($file_data));
      if ($count) {
      $data = $this->readUserDialogFile($file_data);
      }
      }
      } */

    /**
     * Function to save the statement instances
     * Created by Arti Sharma
     */
    public function saveStatementInstance($jsonArray)
    {
        //return $jsonArray;
        if ($jsonArray['action'] != 'editMessage') {
            // add new statements
            return $this->saveStatement($jsonArray);
        } else {
            // edit existing statement
            return $this->saveEditedStatement($jsonArray);
        }
    }

    /**
     * Function to save the  statement
     */
    public function saveStatement($jsonArray)
    {

        $node_class_id = STATEMENT_CLASS_ID;
        $node_type_id = '2';
        $jsonArray['message'] = trim($jsonArray['message']);
        if ($jsonArray['courseSection'] == 1) {
            $message = str_replace('"', '', $jsonArray['message']);
            $temp = explode('\n', $message);
        } else {
            $br_converted = preg_replace('#<br />(\s*<br />)+#', '<br />', nl2br($jsonArray['message']));
            $temp = explode('<br />', $br_converted);
        }
        // AWS S3
        $awsObj = new AwsS3();
        $folder_path = ABSO_URL . "data/perspective_cache/";
        //return date('Y-m-d h:i:s');
        if ($jsonArray['messageto'] != '' && $jsonArray['sender'] != '') {
            $node_ids = '';
            for ($k = 0; $k < count($temp); $k++) {
                //create node id first
                $data['node_id'] = $this->createNode();

                $data['node_class_id'] = $node_class_id;
                $data['node_type_id'] = $node_type_id;
                $data['caption'] = $data['node_id'];
                $data['status'] = '1';

                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-instance');
                $query->values($data);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
                $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
                $statement_instance_node_id = $data['node_id'];


                //insert value in node instance property.
                //get the node class property id
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-class-property');
                $select->columns(array('caption', 'node_class_property_id'));
                $select->where->equalTo('node_class_id', $node_class_id);
                $select->where->notEqualTo('node_class_property_parent_id', 0);

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $classArray = $resultObj->initialize($result)->toArray();

                $valueArray = array();

                array_push($valueArray, $jsonArray['sender']);
                array_push($valueArray, $jsonArray['type']);
                //array_push($valueArray,$jsonArray['message']);
                array_push($valueArray, htmlentities($temp[$k]));
                // array_push($valueArray, $jsonArray['timestamp']);
                //  array_push($valueArray, strtotime(date('Y-m-d h:i:s')));

                $date_value = date_create();
                //return  date_timestamp_get($date_value);
                //return $date_value['timezone_type'];
                array_push($valueArray, date_timestamp_get($date_value));
                // array_push($valueArray, date('Y-m-d h:i:s'));

                array_push($valueArray, '0');


                $i = 0;
                foreach ($classArray as $value) {
                    $output['node_id'] = $this->createNode();
                    $output['node_instance_id'] = $node_instance_id;
                    $output['node_class_property_id'] = $value['node_class_property_id'];

                    $output['node_type_id'] = $node_type_id;
                    $output['value'] = trim($valueArray[$i]);

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-instance-property');
                    $query->values($output);

                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $resultObj->initialize($result);
                    $node_property_id = $this->adapter->getDriver()->getLastGeneratedValue();
                    if ($value['caption'] == 'Statement') {
                        $statement_node_property_id = $node_property_id;
                        $statement_node_instance_id = $node_instance_id;
                        if ($jsonArray['type'] == 'Statement') {
                            $node_ids .= $statement_node_property_id . '~';
                        }
                    }

                    $i++;
                }

                ///write data into the file.
                $filename = 'dialogue_' . $jsonArray['messageto'];

                $txt_filename = $filename . ".txt";
                $file_path = $folder_path . $txt_filename;


                //$file_create = fopen($file_path, "a+") or die('cannot create file');


                $date_val = date('Y-m-d', strtotime(date('Y-m-d h:i:s')));


                $timestamp = date_timestamp_get($date_value); //strtotime(date('Y-m-d h:i:s'));   //date('Y-m-d H:i:s', strtotime(date('Y-m-d h:i:s')));
                $statement_type = $jsonArray["type"];  //'text';//;
                $statement = htmlentities($temp[$k]);
                $username = htmlentities($jsonArray["username"]);
                $sender = htmlentities($jsonArray["sender"]);
                $updated_status = '0';

                $node_property_id = $statement_node_property_id;
                $awsFilePath = "data/perspective_cache/$txt_filename";
                //if (file_exists($file_path)) {
                if ($awsObj->isObjectExist($awsFilePath)) {
                    //$file_data = file_get_contents($file_path);
                    $file_data_res = $awsObj->getFileData($awsFilePath);
                    $file_data = $file_data_res['data'];
                    $count = strlen(trim($file_data));

                    if ($count == 0) {
                        $insert_string = $date_val . 'x~x' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $statement_node_instance_id;
                    } else {
                        if (strpos($file_data, $date_val) !== false) {
                            $insert_string = '#~#' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $statement_node_instance_id;
                        } else {
                            $insert_string = 'x~x' . $date_val . 'x~x' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $statement_node_instance_id;
                        }
                    }
                }
                //fputs($file_create, trim($insert_string));
                $awsObj->setFileData($awsFilePath, $file_data . trim($insert_string), "text");

                //maintain xy relation between dialogue instance node id and statement instance node id
                $res['node_y_id'] = $jsonArray['messageto'];
                $res['node_x_id'] = $statement_instance_node_id;
                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-x-y-relation');
                $query->values($res);

                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
            }

            if ($jsonArray['type'] == 'Statement') {
                $node_property_id = rtrim($node_ids, '~');
            } else {
                $node_property_id = $node_property_id;
            }
            //update the dialogue on which comment has been done
            $success = $this->updateDialogTimestamp($jsonArray['messageto']);
            $this->updateCourseTimestamp($jsonArray['course_instance_node_id']);
            if ($success) {
// get all the user associated with the dilaogue
                $user_ary = $this->getAllDilaogueUser($jsonArray['messageto'], $jsonArray['sender']);
                foreach ($user_ary as $output) {
                    $user_instance_node_id = $output['user_instance_node_id'];
// insert notification detail on statement
                    $this->saveStatementNotification($statement_instance_node_id, $user_instance_node_id, $jsonArray['messageto']);
// $this->insertAllDialogueInfoById($jsonArray['messageto'],$jsonArray['sender']);
                }
            }
        }

        return $node_property_id;
    }

    /**
     * Function to save the edited statement
     */
    public function saveEditedStatement($jsonArray)
    {

        $node_instance_property_id = $jsonArray['node_instance_propertyid'];

        $jsonArray['message'] = trim($jsonArray['message']);
        $br_converted = preg_replace('#<br />(\s*<br />)+#', '<br />', nl2br($jsonArray['message']));


        $sql = new Sql($this->adapter);
        $data['value'] = $br_converted;

        $query = $sql->update();
        $query->table('node-instance-property');
        $query->set($data);
        $query->where(array('node_instance_property_id' => $node_instance_property_id));
        //return  $query->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $affectedRows = $result->getAffectedRows();


        //get the node instance id
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('node_instance_property_id', $node_instance_property_id);
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $classArray = $resultObj->initialize($result)->toArray();
        $node_instance_id = $classArray['0']['node_instance_id'];

        //get the node class property id
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_instance_property_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->equalTo('nip.node_instance_id', $classArray['0']['node_instance_id']);
        $select->where->equalTo('ncp.caption', 'Updated Status');
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $node_classArray = $resultObj->initialize($result)->toArray();
        //return $node_classArray[0]['node_instance_property_id'];
        $sql = new Sql($this->adapter);
        $data['value'] = '1';

        $query = $sql->update();
        $query->table('node-instance-property');
        $query->set($data);
        $query->where(array('node_instance_property_id' => $node_classArray[0]['node_instance_property_id']));

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $affectedRowsDone = $result->getAffectedRows();

        if ($affectedRows) {
            // insert all the statements again in the file from database
            $this->insertStatementInstance($jsonArray['messageto']);
        }
        return $jsonArray['node_instance_propertyid'];
    }

    /**
     * Function to get all the instances from the file
     * Function Update to get data from DB instead of Files - Amit B
     * Called from dialogue.js function - getStatement
     */
    public function getAllStatementInstance($dialog_instance_node_id, $date_obj, $loggedInUser)
    {
        $statementArray = array();
        $chatData = $this->getAllStatement($dialog_instance_node_id, '', $loggedInUser);
        // Create a new key from timestamp for date.
        $chatData = array_map(function ($arr) {
            $date = date('Y-m-d', $arr['timestamp']);
            return $arr + ['date' => $date];
        }, $chatData);
        $groupChatData = array();

        //Grouping of Message with date.
        foreach ($chatData as $key => $val) {
            // First instance entry to date grouping
            if (!is_array($groupChatData[$val['date']])) {
                $val['statement'] = array($val['node_instance_property_id'] => array("statement" => stripslashes(html_entity_decode($val['statement'])), "node_instance_propertyid" => $val['node_instance_property_id'], "statement_type" => $val['statement_type'], "updated_status" => $val['updated_status'], "statement_timestamp" => $val['timestamp'],"statement_updated_timestamp" => $val['updated_timestamp']));
                if (trim($val['reply']) != '') {
                    $val['statement'][$val['node_instance_property_id']]['reply'] = html_entity_decode($val['reply']);
                }
                $groupChatData[$val['date']][$key] = $val;
            } else {
                $previous_entry = end($groupChatData[$val['date']]);
                $last_key = key($groupChatData[$val['date']]);
                // Condition to check last messages is send by Same user at saem time
                $previous_time = date('Y-m-d', $previous_entry['timestamp']);
                $current_time = date('Y-m-d', $val['timestamp']);
                if ($previous_time == $current_time && $previous_entry['actor.author'] == $val['actor.author']) {
                    $groupChatData[$val['date']][$last_key]['statement'][$val['node_instance_property_id']] = array("statement" => stripslashes(html_entity_decode($val['statement'])), "node_instance_propertyid" => $val['node_instance_property_id'], "statement_type" => $val['statement_type'], "updated_status" => $val['updated_status'], "statement_timestamp" => $val['timestamp'],"statement_updated_timestamp" => $val['updated_timestamp']);
                    if (trim($val['reply']) != '') {
                        $groupChatData[$val['date']][$last_key]['statement'][$val['node_instance_property_id']]['reply'] = html_entity_decode($val['reply']);
                    }
                } else {
                    $val['statement'] = array($val['node_instance_property_id'] => array("statement" => stripslashes(html_entity_decode($val['statement'])), "node_instance_propertyid" => $val['node_instance_property_id'], "statement_type" => $val['statement_type'], "updated_status" => $val['updated_status'], "statement_timestamp" => $val['timestamp'],"statement_updated_timestamp" => $val['updated_timestamp']));
                    if (trim($val['reply']) != '') {
                        $val['statement'][$val['node_instance_property_id']]['reply'] = html_entity_decode($val['reply']);
                    }
                    $groupChatData[$val['date']][$key] = $val;
                }
            }
            if (isset($groupChatData[$val['date']][$key]['reply'])) {
                unset($groupChatData[$val['date']][$key]['reply']);
            }
        }
        // Reset Array Index
        $groupChatData = array_map('array_values', $groupChatData);
        return $groupChatData;
        // File System Code is Commented.
        //insert all the statements again in the file from database
        // $this->insertStatementInstance($dialog_instance_node_id) ;
        //return $this->getAllStatement($dialog_instance_node_id);

        /*
          $folder_path = ABSO_URL . "data/perspective_cache/";
          $filename = 'dialogue_' . $dialog_instance_node_id;
          $txt_filename = $filename . ".txt";
          $file_path = $folder_path . $txt_filename;
          // AWS S3
          $awsObj         = new AwsS3();
          $awsFilePath   = "data/perspective_cache/$txt_filename";
          if (file_exists($file_path)) {
          $file_create = fopen($file_path, "r+") or die('cannot  file');
          } else {
          $file_create = fopen($file_path, "w+") or die('cannot  file');
          }
          $dialogAry = array();
          $newArray = array();
          $statementArray = array();
          //if (file_exists($file_path)) {
          if ($awsObj->isObjectExist($awsFilePath)) {
          //$file_data = file_get_contents($file_path);
          $file_data_res = $awsObj->getFileData($awsFilePath);
          $file_data = $file_data_res['data'];



          if ($date_obj) {
          $split_date = 'x~x' . $date_obj;
          $data_res = explode($split_date, $file_data);
          $file_data = $data_res['0'];
          }



          $date_data = explode('x~x', $file_data);

          $dialogAry = array();
          for ($i = 0; $i < count($date_data);) {

          if (strpos($date_data[$i], '#~#') !== false) {
          $content_data = explode('#~#', $date_data[$i]);

          $dialogAry = array();
          for ($j = 0; $j < count($content_data); $j++) {
          $statementAry = explode('=', $content_data[$j]);

          if (strtolower($statementAry[0]) == strtolower('timestamp')) {

          $newArray[$statementAry[0]] = $statementAry[1];
          } else {

          $newArray[$statementAry[0]] = $statementAry[1];
          }
          if (strtolower($statementAry[0]) == strtolower('node_instance_id')) {
          array_push($dialogAry, $newArray);
          $statementArray[$pre] = $dialogAry;
          }
          //return $statementArray;
          }
          //return $statementArray;
          } else {

          $pre = $date_data[$i];
          }
          $i = $i + 1;
          }
          }
          //fclose($file_create);
          return $statementArray; */
    }

    public function saveDialogTitle($variable_data)
    {
        $node_instance_property_id = $variable_data['node_instance_property_id'];
        $dialog_title = $variable_data['dialog_title'];
        $course_instance_node_id = $variable_data['course_instance_node_id'];
        $dialog_instance_node_id = $variable_data['dialog_instance_node_id'];
        $sql = new Sql($this->adapter);
        $data['value'] = htmlentities(trim($dialog_title));
        if (intval($node_instance_property_id) > 0) {
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where(array('node_instance_property_id' => PASSED_DEAL_A_PID));

//return  $query->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $affectedRows = $result->getAffectedRows();
            if ($affectedRows) {
                /* $sql = new Sql($this->adapter);
                  $select = $sql->select();
                  $select->from(array('nip' => 'node-instance-property'));
                  $select->columns(array('value'));
                  $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('dialog_instance_node_id' => 'node_id'));
                  $select->where->AND->equalTo('nip.node_instance_property_id', $node_instance_property_id);
                  /// return $select->getSqlstring();die;
                  $statement = $sql->prepareStatementForSqlObject($select);
                  $result = $statement->execute();
                  $resultObj = new ResultSet();
                  $userArray = $resultObj->initialize($result)->toArray(); */
//update the dialogue timestamp
                $success = $this->updateDialogTimestamp($dialog_instance_node_id);
                $dialogAry = $this->insertAllDialogueInfoById($dialog_instance_node_id);
                $success = $this->updateCourseTimestamp($course_instance_node_id);
                // $dialogAry = $this->insertAllCourseInfoById($course_instance_node_id);
            }

            return $affectedRows;
        }
    }

    /**
     * Function to get all the actor associated with the dialog from file
     * Ajax function:
     */
    public function getDialogueActorData($dialog_instance_node_id)
    {
//insert all the user not associated with dialogue in the file
        $this->getAllUserListData($dialog_instance_node_id);
//$this->insertAllUserInstances($dialog_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'dialogueactor' . $dialog_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        if (file_exists($file_path)) {
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->getDilaogueActorFormFile($file_data);
            }
        } else { // add all the user associated with dialogue in the file
            $this->insertAllDialogActorInstances($dialog_instance_node_id);
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->getDilaogueActorFormFile($file_data);
            }
        }
        return $data;
    }

    /**
     * Function to read file consisting dialog's actor
     */
    function getDilaogueActorFormFile($file_data)
    {
        $userAry = array();
        $file_data = ltrim($file_data, 'x~x');
        $user_data = explode('x~x', $file_data);

        $k = 0;
        for ($i = 0; $i < count($user_data);) {
            $content_data = explode('#~#', $user_data[$i]);
            for ($j = 0; $j < count($content_data);) {
                $user_content = explode('=', $content_data[$j]);
                $userAry[$i][$user_content[0]] = $user_content[1];
                $j++;
            }

            $i++;
        }
        return $userAry;
    }

    /**
     * Function to insert all the dialogue's actor into the file
     */
    public function insertAllDialogActorInstances($dialog_instance_node_id)
    {
        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'dialogueactor' . $dialog_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        //$file_create = fopen($file_path, "w+") or die('cannot create file');
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        $insert_string = '';
        $userAry = $this->getAllActorInstances($dialog_instance_node_id);

        foreach ($userAry as $value) {
            $first_name = $value['first name'];
            $last_name = $value['last name'];
            $user_instance_node_id = $value['id'];
            $admin = $value['admin'];
            $email_address = $value['email address'];
            $user_name = $value['first name'] . $value['last name'];
            //if (file_exists($file_path)) {
            if ($awsObj->isObjectExist($awsFilePath)) {
                //$file_data = file_get_contents($file_path);
                $file_data_res = $awsObj->getFileData($awsFilePath);
                $file_data = $file_data_res['data'];
                $count = strlen(trim($file_data));

                if (!$count) {
                    $insert_string = 'user_instance_node_id=' . $user_instance_node_id . '#~#' . 'first_name=' . $first_name . '#~#' . 'last_name=' . $last_name . '#~#' . 'admin=' . $admin . '#~#' . 'email_address=' . $email_address . '#~#' . 'user_name=' . $user_name;
                } else {
                    $insert_string = 'x~x' . 'user_instance_node_id=' . $user_instance_node_id . '#~#' . 'first_name=' . $first_name . '#~#' . 'last_name=' . $last_name . '#~#' . 'admin=' . $admin . '#~#' . 'email_address=' . $email_address . '#~#' . 'user_name=' . $user_name;
                }
            }
            //chmod($file_path, 511);
            //fputs($file_create, trim($insert_string));
            $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
        }
    }

    /**
     * Function to get the array of all the user associated with an dialogue from database
     */
    public function getAllActorInstances($dialog_instance_node_id)
    {
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
//get the owner of the dialogue
        $admin_id = $this->getDialogOwnerId($dialog_instance_node_id);

        $mainAry = array();


//get all the user associated with dialogue user
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_x_id'));
        $select->where->equalTo('xy.node_y_id', $dialog_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
//$select->where->AND->notequalTo('xy.node_x_id',$admin_id);
        $select->where->AND->equalTo('ni.status', 1);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        /* foreach($userArray as $value)
          {
          $caption              = $value['caption'];
          if(strtolower($value['caption'])  != strtolower('Date of Birth'))
          {
          $mainAry[$i][strtolower($caption)]  = $value['value'];

          }
          else{
          $id = $value['user_instance_node_id'];
          $mainAry[$i]['id']  = $value['user_instance_node_id'];
          if($admin_id == $value['user_instance_node_id'] )
          {
          $mainAry[$i]['admin'] = '1';
          }
          else
          {
          $mainAry[$i]['admin'] = '0';
          }


          $account_class_node_id = ACCOUNT_CLASS_ID;
          $sql                                  =   new Sql($this->adapter);
          $select                                   =   $sql->select();
          $select->from(array('nip' => 'node-instance-property'));
          $select->columns(array('value'));
          $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array());
          $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
          $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array('user_instance_node_id'=>'node_x_id'));
          $select->where->equalTo('xy.node_y_id',$id);
          $select->where->AND->equalTo('ni.node_class_id',$account_class_node_id);
          $select->where->AND->equalTo('ni.status',1);
          //return  $select->getSqlstring();die;
          $statement                =   $sql->prepareStatementForSqlObject($select);
          $result                   =   $statement->execute();
          $resultObj                =   new ResultSet();
          $accountInfo              =   $resultObj->initialize($result)->toArray();


          $mainAry[$i][strtolower($accountInfo['0']['caption'])]  = $accountInfo['0']['value'];


          $i++;
          }
          } */
        $mainAry = array();
        $temp_ary = array();

        foreach ($userArray as $value) {
            $caption = $value['caption'];
            $id = $value['user_instance_node_id'];

            $temp_ary[$id][strtolower($caption)] = $value['value'];
            $temp_ary[$id]['id'] = $id;
            $user_ins_array .= $id . ",";
        }
        $user_ins_array = explode(',', $user_ins_array);

        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_y_id'));
        $select->where->IN('xy.node_y_id', $user_ins_array);
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
//return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $accountInfo = $resultObj->initialize($result)->toArray();
        $acount_ary = array();
        foreach ($accountInfo as $accountDeatil) {
            $id = $accountDeatil['user_instance_node_id'];
            $caption = $accountDeatil['caption'];
            $acount_ary[$id][strtolower($caption)] = $accountDeatil['value'];
        }


        foreach ($temp_ary as $value) {
            $id = $value['id'];

            $mainAry[$id]['first name'] = $value['first name'];
            $mainAry[$id]['last name'] = $value['last name'];
            $mainAry[$id]['id'] = $id;
            $mainAry[$id]['email address'] = $acount_ary[$id]['email address'];
            if ($admin_id == $id) {
                $mainAry[$id]['admin'] = '1';
            } else {
                $mainAry[$id]['admin'] = '0';
            }
        }


        foreach ($mainAry as $key => $row) {
            $finalAry[$key] = $row['admin'];
        }

        array_multisort($finalAry, SORT_DESC, $mainAry);
        return $mainAry;
    }

    /**
     * Function to insert all the employee list except dialogue's actor into the file list
     * Search file
     */
    public function insertAllUserInstances($variable_data)
    {

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'userlist';
        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $file_create = fopen($file_path, "w+") or die('cannot create file');

        $userAry = $this->getAllSystemUser($variable_data);

        foreach ($userAry as $value) {
            $first_name = $value['first name'];
            $last_name = $value['last name'];
            $user_instance_node_id = $value['id'];
            $email_address = $value['email address'];
            $user_name = $value['first name'] . $value['last name'];

            if (file_exists($file_path)) {
                $file_data = file_get_contents($file_path);
                $count = strlen(trim($file_data));
                if ($count == '0') {
                    $insert_string = 'user_instance_node_id=' . $user_instance_node_id . '#~#' . 'first_name=' . $first_name . '#~#' . 'last_name=' . $last_name . '#~#' . 'email_address=' . $email_address . '#~#' . 'user_name=' . $user_name;
                } else {
                    $insert_string = 'x~x' . 'user_instance_node_id=' . $user_instance_node_id . '#~#' . 'first_name=' . $first_name . '#~#' . 'last_name=' . $last_name . '#~#' . 'email_address=' . $email_address . '#~#' . 'user_name=' . $user_name;
                }
            }

            fputs($file_create, trim($insert_string));
        }


        /* if ($event_type == 'addInFile') {
          $this->insertAllDialogActorInstances($dialog_instance_node_id);
          //add all the user associated with dialogue in the file
          $dialogAry = $this->insertAllDialogueInfoById($dialog_instance_node_id, $user_instance_node_id);
          } */
        return $userAry;
    }

    /**
     * Function to get all the employee list except dialogue's actor
     */
    public function getAllUser($dialog_instance_node_id, $user_instance_node_id = null, $event_type = null)
    {

        if ($event_type == 'addInFile') {
//delete the user from dialogue
            $sql = new Sql($this->adapter);
            $delete = $sql->delete();
            $delete->from('node-x-y-relation');
            $delete->where->equalTo('node_x_id', $user_instance_node_id);
            $delete->where->equalTo('node_y_id', $dialog_instance_node_id);
//return  $delete->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($delete);
            $result = $statement->execute();

//update the dialogue on which comment has been done
            $success = $this->updateDialogTimestamp($dialog_instance_node_id);
        }
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
//get all the user associated with dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
//$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array());
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_x_id'));
        $select->where->equalTo('xy.node_y_id', $dialog_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        $mainAry = array();
        foreach ($userArray as $value) {
            if (!in_array($value['user_instance_node_id'], $mainAry)) {
                array_push($mainAry, $value['user_instance_node_id']);
            }
        }

        if ($event_type != 'addInFile') {
            if ($user_instance_node_id != '') {
                array_push($mainAry, $user_instance_node_id);
            }

            $temp = implode(",", $mainAry);
        } else {
            $temp = implode(",", $mainAry);
        }
// AND  (ncp.caption ='First Name' or ncp.caption ='Last Name')
//get all the user in the system except not associated with dialogue
        $sql = "SELECT  `nip`.`value` AS  `value` ,  `ni`.`node_id` AS  `user_instance_node_id` ,  `ncp`.`caption` AS  `caption`
FROM  `node-instance-property` AS  `nip`
INNER JOIN  `node-instance` AS  `ni` ON  `nip`.`node_instance_id` =  `ni`.`node_instance_id`
INNER JOIN  `node-class-property` AS  `ncp` ON  `ncp`.`node_class_property_id` =  `nip`.`node_class_property_id`
WHERE  `ni`.`node_class_id` =  '632'
AND  `ni`.`status` =  '1'
AND ni.node_id NOT
IN ($temp) ";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        $mainAry = array();
        $temp_ary = array();
        $i = 0;
        foreach ($userArray as $value) {
            $caption = $value['caption'];
            $id = $value['user_instance_node_id'];

            $temp_ary[$id][strtolower($caption)] = $value['value'];
            $temp_ary[$id]['id'] = $id;
            $user_ins_array .= $id . ",";
        }
        $user_ins_array = explode(',', $user_ins_array);

        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_y_id'));
        $select->where->IN('xy.node_y_id', $user_ins_array);
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
//return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $accountInfo = $resultObj->initialize($result)->toArray();
        $acount_ary = array();
        foreach ($accountInfo as $accountDeatil) {
            $id = $accountDeatil['user_instance_node_id'];
            $caption = $accountDeatil['caption'];
            $acount_ary[$id][strtolower($caption)] = $accountDeatil['value'];
        }


        foreach ($temp_ary as $value) {
            $id = $value['id'];

            $mainAry[$id]['first name'] = $value['first name'];
            $mainAry[$id]['last name'] = $value['last name'];
            $mainAry[$id]['id'] = $id;
            $mainAry[$id]['email address'] = $acount_ary[$id]['email address'];
        }

        return $mainAry;
    }

    /**
     * Function to get the list of all the user from file who are associated with dialogue
     */
    public function getAllUserListData___old($dialog_instance_node_id, $search_string)
    {
//  $this->insertAllUserInstances($dialog_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'userlist' . $dialog_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;


        if (file_exists($file_path)) {
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->getActorFormFile($file_data);
            }
        } else { // add all the user associated with dialogue in the file
            $this->insertAllUserInstances($dialog_instance_node_id);

            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));

            if ($count) {
                $data = $this->getActorFormFile($file_data);
            }
        }
        return $data;
    }

    /**
     * Function to get the list of all the user available in the system
     * Ajax Function - getUserList defined in dialogue.js
     */
    public function getAllUserListData($variable_data)
    {

        $this->insertAllUserInstances($variable_data);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'userlist';
        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;

        if (file_exists($file_path)) {
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->getActorFormFile($file_data);
            }
        } else { // add all the user associated with dialogue in the file
            // $this->insertAllUserInstances($variable_data);
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));

            if ($count) {
                $data = $this->getActorFormFile($file_data);
            }
        }
        return $data;
    }

    /**
     * Function to get the list of all the user available in the system except dialogue's actor
     * FETCH FROM--------------DATABASE
     */
    public function getAllSystemUser($variable_data)
    {
        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $temp = $user_instance_node_id;

        //query to fetch all the user list from database except dialog's actors
        $sql = "SELECT  `nip`.`value` AS  `value` ,  `ni`.`node_id` AS  `user_instance_node_id` ,  `ncp`.`caption` AS  `caption`
         FROM  `node-instance-property` AS  `nip`
         INNER JOIN  `node-instance` AS  `ni` ON  `nip`.`node_instance_id` =  `ni`.`node_instance_id`
         INNER JOIN  `node-class-property` AS  `ncp` ON  `ncp`.`node_class_property_id` =  `nip`.`node_class_property_id`
         WHERE  `ni`.`node_class_id` =  '632'
         AND  `ni`.`status` =  '1'
         AND ni.node_id NOT
         IN ($temp) ";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        $mainAry = array();
        $temp_ary = array();
        $i = 0;
        foreach ($userArray as $value) {
            $caption = $value['caption'];
            $id = $value['user_instance_node_id'];

            $temp_ary[$id][strtolower($caption)] = $value['value'];
            $temp_ary[$id]['id'] = $id;
            $user_ins_array .= $id . ",";
        }
        $user_ins_array = explode(',', $user_ins_array);

        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id' => 'node_y_id'));
        $select->where->IN('xy.node_y_id', $user_ins_array);
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $accountInfo = $resultObj->initialize($result)->toArray();
        $acount_ary = array();
        foreach ($accountInfo as $accountDeatil) {
            $id = $accountDeatil['user_instance_node_id'];
            $caption = $accountDeatil['caption'];
            $acount_ary[$id][strtolower($caption)] = $accountDeatil['value'];
        }


        foreach ($temp_ary as $value) {
            $id = $value['id'];

            $mainAry[$id]['first name'] = $value['first name'];
            $mainAry[$id]['last name'] = $value['last name'];
            $mainAry[$id]['id'] = $id;
            $mainAry[$id]['email address'] = $acount_ary[$id]['email address'];
        }

        return $mainAry;
    }

    /**
     * Function to read file consisting all the user
     */
    function getActorFormFile($file_data)
    {
        $user_data = explode('x~x', $file_data);

        $userAry = array();
        for ($i = 0; $i < count($user_data);) {
            $content_data = explode('#~#', $user_data[$i]);
            for ($j = 0; $j < count($content_data);) {
                $user_content = explode('=', $content_data[$j]);
                $userAry[$i][$user_content[0]] = $user_content[1];
                $j++;
            }
            $i++;
        }

        return $userAry;
    }

    public function saveNewDialogueActorInstances($dialog_data)
    {
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $dialog_instance_node_id = $dialog_data['dialog_instance_node_id'];
        $course_instance_node_id = $dialog_data['course_instance_node_id'];
        $user_instance_string = rtrim($user_instance_node_id, ',');
        $temp = explode(',', $user_instance_string);
        $admin_id = $this->getDialogOwnerId($dialog_instance_node_id);

        /* $user_node_class_id = INDIVIDUAL_CLASS_ID;
          //get all the instance of user associated with an dialogue
          $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->from(array('xy' => 'node-x-y-relation'));
          $select->columns(array('node_x_y_relation_id'));
          $select->join(array('ni' => 'node-instance'), 'xy.node_x_id = ni.node_id', array());
          $select->where->equalTo('ni.node_class_id', $user_node_class_id);
          $select->where->AND->equalTo('xy.node_y_id', $dialog_instance_node_id);
          $select->where->AND->notequalTo('xy.node_x_id', $admin_id);
          $statement = $sql->prepareStatementForSqlObject($select);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $accountInfo = $resultObj->initialize($result)->toArray();
          if (!empty($accountInfo)) {
          foreach ($accountInfo as $value) {
          //delete all the instance of user associated with the dialogue
          $node_x_y_relation_id = $value['node_x_y_relation_id'];
          $sql = new Sql($this->adapter);
          $delete = $sql->delete();
          $delete->from('node-x-y-relation');
          $delete->where->equalTo('node_x_y_relation_id', $node_x_y_relation_id);
          $statement = $sql->prepareStatementForSqlObject($delete);
          $result = $statement->execute();
          }
          } */

        foreach ($temp as $key => $value) {
            $res['node_y_id'] = $dialog_instance_node_id;
            $res['node_x_id'] = $temp[$key];
            //check the xy relation already exists or not between dialogue and user
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('xy' => 'node-x-y-relation'));
            $select->where->equalTo('xy.node_y_id', $dialog_instance_node_id);
            $select->where->AND->equalTo('xy.node_x_id', $temp[$key]);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $exitsInfo = $resultObj->initialize($result)->toArray();
            if (empty($exitsInfo)) {
                //insert all the actor into the database to associate with the dialogue
                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-x-y-relation');
                $query->values($res);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
            }

            // check the relation between course and user
            $res['node_y_id'] = $course_instance_node_id;
            $res['node_x_id'] = $temp[$key];
            //check the xy relation already exists or not between course and user
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('xy' => 'node-x-y-relation'));
            $select->where->equalTo('xy.node_y_id', $course_instance_node_id);
            $select->where->AND->equalTo('xy.node_x_id', $temp[$key]);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $exitsInfo = $resultObj->initialize($result)->toArray();
            if (empty($exitsInfo)) {
                //insert all the actor into the database to associate with the course
                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-x-y-relation');
                $query->values($res);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
            }
        }
        if (!empty($dialog_data['status']) && $dialog_data['status'] == 1) {
            $this->updateInsStatus($dialog_instance_node_id, $dialog_data['status'], DIALOGUE_CLASS_ID);
            $this->updateInsStatus($course_instance_node_id, $dialog_data['status'], COURSE_CLASS_ID);
        }

        //insert all the user associated with dialogue in the file
        $this->insertAllDialogActorInstances($dialog_instance_node_id);
        //insert all the user not associated with dialogue in the file
        $this->insertAllUserInstances($dialog_instance_node_id);

        //update the dialogue on which comment has been done
        $success = $this->updateDialogTimestamp($dialog_instance_node_id);
        $dialogAry = $this->insertAllDialogueInfoById($dialog_instance_node_id, $user_instance_node_id);

        $this->updateCourseTimestamp($course_instance_node_id);
        $courseAry = $this->insertAllCourseInfoById($course_instance_node_id, $creator_instance_node_id);
    }

    /**
     * Function here to update instance status for dialogue and courses class
     */
    public function updateInsStatus($insNodeId, $status, $classNId)
    {
        $data = array();
        $data['status'] = $status;
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where->equalTo('node_id', $insNodeId);
        $query->where->AND->equalTo('node_class_id', $classNId);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
    }

    /**
     * Function to get the dialogue admin
     */
    public function getDialogOwnerId($dialog_instance_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->AND->equalTo('ni.node_id', $dialog_instance_node_id);
        $select->where->AND->equalTo('ncp.caption', 'Admin');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $AdminArray = $resultObj->initialize($result)->toArray();
        return $admin_id = $AdminArray['0']['value'];
    }

    /*
     * Function to update the timestamp property
     */

    public function updateDialogTimestamp($dialog_instance_node_id)
    {
        $sql = new Sql($this->adapter);
        $data['value'] = date("Y-m-d H:i:s");
        if (intval($dialog_instance_node_id) > 0) {
            //get the node-instance-property id
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
            $select->where->AND->equalTo('ni.node_id', $dialog_instance_node_id);
            $select->where->AND->equalTo('ncp.caption', 'Updated Timestamp');

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $AdminArray = $resultObj->initialize($result)->toArray();
            $node_instance_property_id = $AdminArray['0']['node_instance_property_id'];

            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where(array('node_instance_property_id' => $node_instance_property_id));


            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $affectedRows = $result->getAffectedRows();
        }
    }

    /**
     * Function to save the new dialogue,new course  instances
     * Ajax Function - saveNewCourse defined in dialogue.js
     */
    public function saveNewDialogInstances($dialog_data)
    {
        $course_node_class_id = COURSE_CLASS_ID;
        $dialogue_node_class_id = DIALOGUE_CLASS_ID;
        $temp = $dialog_data['user_instance_node_id'];
        $user_nodes = $temp;
        $creator_instance_node_id = $dialog_data['creator_instance_node_id'];
        $dialogue_title = htmlentities(trim($dialog_data['dialogue_title']));
        $dialogue_instance_node_id = $dialog_data['dialogue_instance_node_id'];
        $courseinstance_node_id = $dialog_data['course_instance_node_id'];

        // when the new course as well as new dialogue created for the first time
        if (strtolower($dialog_data['save_type']) == strtolower('new')) {
            //add course first
            $course_field = 'Title';
            $node_type_id = '2';
            $course_value = htmlentities(trim($dialog_data['course_value']));
            if ($course_value != '') {
                // $node_class_property_id = $this->getNodeClassPropertyId($course_node_class_id, $course_field);
                $node_instance_id = $this->createNodeInstance($course_node_class_id, $node_type_id);

                if ($node_instance_id) {
                    // $course_node_instance_property_id = $this->createNodeInstanceProperty($node_instance_id, $node_class_property_id, $node_type_id, $course_value);

                    $dialogue_field = array('Title', 'Timestamp', 'created By', 'Updation Timestamp');
                    foreach ($dialogue_field as $value) {
                        if ($value == 'Title') {
                            $course_value = $course_value;
                        } elseif ($value == 'created By') {
                            $course_value = $creator_instance_node_id;
                        } else {
                            $course_value = date('Y-m-d H:i:s');
                        }

                        $node_class_property_id = $this->getNodeClassPropertyId($course_node_class_id, $value);

                        $course_node_instance_property_id = $this->createNodeInstanceProperty($node_instance_id, $node_class_property_id, $node_type_id, $course_value);
                    }

                    $course_instance_node_id = $this->getInstanceNodeId($course_node_class_id, $node_instance_id);
                    if (strpos($temp, ',') !== false) {
                        $val = explode(',', $temp);
                        //return ($val);
                        for ($i = 0; $i < count($val); $i++) {
                            $xy_id = $this->createXYRelation($course_instance_node_id, $val[$i]);
                        }
                    } else {
                        $user_instance_node_id = $temp;
                        //add xy relation between user and course
                        $xy_id = $this->createXYRelation($course_instance_node_id, $user_instance_node_id);
                    }


                    //add dialogue for course
                    $final_ary = $this->addDialogue($dialogue_node_class_id, $dialogue_title, $course_instance_node_id, $user_nodes, $creator_instance_node_id);

                    $courseAry = $this->insertAllCourseInfoById($course_instance_node_id, $creator_instance_node_id);
                }
                if (!empty($final_ary)) {
                    return $final_ary;
                }
            }
        } // an user added dialogue for existing course
        elseif (strtolower($dialog_data['save_type']) == strtolower('existing')) {
            $course_field = 'Title';
            $node_type_id = '2';
            if ($courseinstance_node_id != '') {
                $course_instance_node_id = $courseinstance_node_id;
            } else {
                $course_instance_node_id = $dialog_data['course_value'];
            }
            //  return $course_instance_node_id;

            if (strpos($temp, ',') !== false) {
                $val = explode(',', $temp);
                //return ($val);
                for ($i = 0; $i < count($val); $i++) {
                    $existing_count = $this->checkXYRelation($course_instance_node_id, $val[$i]);
                    if (!$existing_count) {
                        $xy_id = $this->createXYRelation($course_instance_node_id, $val[$i]);
                    }
                }
            } else {
                $user_instance_node_id = $temp;
                //add xy relation between user and course
                $existing_count = $this->checkXYRelation($course_instance_node_id, $user_instance_node_id);
                if (!$existing_count) {
                    $xy_id = $this->createXYRelation($course_instance_node_id, $user_instance_node_id);
                }
            }

            if ($course_instance_node_id != '') {
                $final_ary = $this->addDialogue($dialogue_node_class_id, $dialogue_title, $course_instance_node_id, $user_nodes, $creator_instance_node_id, $dialogue_instance_node_id);

                $this->updateCourseTimestamp($course_instance_node_id);
                $courseAry = $this->insertAllCourseInfoById($course_instance_node_id, $creator_instance_node_id);

                if (!empty($final_ary)) {
                    return $final_ary;
                }
            }
        }
    }

    /**
     * Function to add dialogue for course
     */
    public function addDialogue($dialogue_node_class_id, $dialogue_title, $course_instance_node_id, $user_nodes, $creator_instance_node_id, $dialogue_instance_node_id)
    {


        $dialogue_field = array('Title', 'Admin', 'Timestamp', 'Updated Timestamp');
        $node_type_id = '2';
        $dialog_instance_id = $this->createNodeInstance($dialogue_node_class_id, $node_type_id);
        $final_ary = array();
        if ($dialogue_instance_node_id != '') {
            $dialog_instance_node_id = $dialogue_instance_node_id;
        }
        // get dialog instance node id
        if ($dialogue_instance_node_id == '') {
            $dialog_instance_node_id = $this->getInstanceNodeId($dialogue_node_class_id, $dialog_instance_id);
            foreach ($dialogue_field as $value) {
                if ($value == 'Title') {
                    if ($dialogue_title == '') {
                        $dialogue_title = 'Untitled';
                    } else {
                        $dialogue_title = $dialogue_title;
                    }
                } elseif ($value == 'Admin') {
                    $dialogue_title = $creator_instance_node_id;
                } else {
                    $dialogue_title = date('Y-m-d H:i:s');
                }

                $node_class_property_id = $this->getNodeClassPropertyId($dialogue_node_class_id, $value);
                if ($dialog_instance_id) {
                    $dialog_node_instance_property_id = $this->createNodeInstanceProperty($dialog_instance_id, $node_class_property_id, $node_type_id, $dialogue_title);
                    if ($value == 'Title') {
                        $final_ary['dialog_instance_node_id'] = $dialog_instance_node_id;
                        $final_ary['dialog_node_instance_property_id'] = $dialog_node_instance_property_id;
                        $final_ary['course_instance_node_id'] = $course_instance_node_id;
                    }
                }
            }
            //create xy relation between course and dialogue
            $xy_id = $this->createXYRelation($course_instance_node_id, $dialog_instance_node_id);
            //return 'fdsf';
        }



        if (strpos($user_nodes, ',') !== false) {
            $val = explode(',', $user_nodes);
            for ($i = 0; $i < count($val); $i++) {
                $user_xy_id = $this->createXYRelation($dialog_instance_node_id, $val[$i]);
            }
        } else {
            $user_instance_node_id = $user_nodes;
            // create xy relation between user and dialogue
            $user_xy_id = $this->createXYRelation($dialog_instance_node_id, $user_instance_node_id);
        }

        $this->updateDialogTimestamp($dialog_instance_node_id);
        // mainatain changes into the dialogue file
        $dialogAry = $this->insertAllDialogueInfoById($dialog_instance_node_id, $creator_instance_node_id);


        return $final_ary; // combination of $dialog_instance_node_id and $dialog_node_instance_property_id of title
    }

    /**
     * Function to get the node class property id of field to be pass
     */
    public function getNodeClassPropertyId($node_class_id, $field)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ncp' => 'node-class-property'));
        $select->columns(array('node_class_property_id'));
        $select->where->AND->equalTo('ncp.node_class_id', $node_class_id);
        $select->where->AND->equalTo('ncp.caption', $field);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultAry = $resultObj->initialize($result)->toArray();

        return $node_class_property_id = $resultAry['0']['node_class_property_id'];
    }

    /**
     * Function to create node instance
     *
     */
    public function createNodeInstance($node_class_id, $node_type_id)
    {

        $output['node_class_id'] = $node_class_id;
        $output['node_id'] = $this->createNode();
        $output['node_type_id'] = $node_type_id;
        $output['caption'] = $output['node_id'];
        $output['status'] = '1';

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance');
        $query->values($output);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
//return $output['node_id'];

        return $id = $this->adapter->getDriver()->getLastGeneratedValue();
    }

    /**
     * Function to insert the value for the instances
     */
    public function createNodeInstanceProperty($node_instance_id, $node_class_property_id, $node_type_id, $value)
    {
        $output['node_instance_id'] = $node_instance_id;
        $output['node_class_property_id'] = $node_class_property_id;
        $output['node_id'] = $this->createNode();
        $output['node_type_id'] = $node_type_id;
        $output['value'] = $value;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance-property');
        $query->values($output);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        return $id = $this->adapter->getDriver()->getLastGeneratedValue();
    }

    /**
     * Function to create xy relation
     */
    public function createXYRelation($node_y_id, $node_x_id)
    {
        $output['node_y_id'] = $node_y_id;
        $output['node_x_id'] = $node_x_id;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-x-y-relation');
        $query->values($output);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        return $id = $this->adapter->getDriver()->getLastGeneratedValue();
    }

    public function getInstanceNodeId($node_class_id, $node_instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
        $select->where->AND->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultAry = $resultObj->initialize($result)->toArray();
        return $instance_node_id = $resultAry['0']['node_id'];
    }

    public function checkXYRelation($node_y_id, $node_x_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('xy' => 'node-x-y-relation'));
        $select->columns(array('node_x_y_relation_id'));
        $select->where->equalTo('xy.node_y_id', $node_y_id);
        $select->where->AND->equalTo('xy.node_x_id', $node_x_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultAry = $resultObj->initialize($result)->toArray();
        return count($resultAry);
    }

    public function searchCourseByTitle($search_data)
    {

        $this->createCourseFile($search_data['user_instance_node_id']);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'courselist' . $search_data['user_instance_node_id'];

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $file_create = fopen($file_path, "r+") or die('cannot create file');

        if (file_exists($file_path)) {
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));
            if ($count) {
                $user_data = explode('x~x', $file_data);

                $userAry = array();
                for ($i = 0; $i < count($user_data);) {
                    $content_data = explode('#~#', $user_data[$i]);
                    for ($j = 0; $j < count($content_data);) {
                        $user_content = explode('=', $content_data[$j]);
                        $userAry[$i][$user_content[0]] = $user_content[1];
                        $j++;
                    }
                    $i++;
                }
            }
        }

//return $userAry;
        $results = array();

        /* $search_string = str_replace(" ","",strtolower($search_data['search_string']));
          foreach ($userAry as $subarray) {
          $hasValue = false;

          foreach($subarray as $key => $value){

          if(!is_numeric($value))
          {

          if(strpos(strtolower($value),$search_string) !== false)
          $hasValue = true;
          }

          }
          if($hasValue)
          $results[] = $subarray;
          } */

        return $res = $this->sort_array_of_array($userAry, 'course_title', SORT_ASC);
    }

    /**
     * Function to create course file.
     * To insert into the file
     */
    public function createCourseFile($user_instance_node_id)
    {

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'courselist' . $user_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $file_create = fopen($file_path, "w+") or die('cannot create file');

        $courseAry = $this->getAllCourse($user_instance_node_id);

        foreach ($courseAry as $value) {
            $course_title = $value['value'];
            $course_instance_node_id = $value['course_instance_node_id'];

            if (file_exists($file_path)) {
                $file_data = file_get_contents($file_path);
                $count = strlen(trim($file_data));
                if ($count == '0') {
                    $insert_string = 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'course_title=' . $course_title;
                } else {
                    $insert_string = 'x~x' . 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'course_title=' . $course_title;
                }
            }
//chmod($file_path, 511);
            fputs($file_create, trim($insert_string));
        }
        return '1';
    }

    public function getAllCourse($user_instance_node_id)
    {
        $course_class_node_id = COURSE_CLASS_ID;
        $field = 'Title';

        $node_class_property_id = $this->getNodeClassPropertyId($course_class_node_id, $field);
        if ($node_class_property_id) {
            $courseAry = $this->getChildData($course_class_node_id, $user_instance_node_id, $node_class_property_id, $field);
        }
        return $courseAry;
    }

    /**
     * Function to get all the child of the current node
     * Common Function
     */
    public function getChildData($node_class_id, $child_instance_node_id, $node_class_property_id, $field)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('course_instance_node_id' => 'node_y_id'));
        $select->where->equalTo('xy.node_x_id', $child_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
        $select->where->AND->equalTo('ni.status', 1);

        if ($field != '') {
            $select->where->AND->equalTo('ncp.node_class_property_id', $node_class_property_id);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $course_array = $resultObj->initialize($result)->toArray();
    }

    /**
     * Function to sort an array by its value
     */
    function sort_array_of_array(&$array, $subfield, $type)
    {
// calling way
//$this->sort_array_of_array($mainAry, 'admin');
        $sortarray = array();
        foreach ($array as $key => $row) {
            $sortarray[$key] = $row[$subfield];
        }
        array_multisort($sortarray, $type, $array);
        return $array;
    }

    /**
     * Function to delete the statement instances
     */
    public function deleteStatementInstance($delete_data)
    {

        $node_instance_property_id = $delete_data['node_instance_id'];
        $dialog_instance_node_id = $delete_data['dialog_instance_node_id'];

        //get node-class-property id
        //get all the user in the system except not associated with dialogue
        /* $sql = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`, `ncp`.`caption` AS `caption` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = $node_instance_id AND ( `ncp`.`caption` = 'Statement' OR `ncp`.`caption` = 'Statement Type' )";
          $statement = $this->adapter->query($sql);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $propertyAry = $resultObj->initialize($result)->toArray();
          $node_instance_property_id = $propertyAry['0']['node_instance_property_id'];
          foreach ($propertyAry as $value) {
          if ($value['caption'] == 'Statement Type') {
          $data['value'] = 'Statement';
          } else {
          $data['value'] = 'This message has been removed.';
          }
          $node_instance_property_id = $value['node_instance_property_id'];
          //update delete message
          $sql = new Sql($this->adapter);

          $query = $sql->update();
          $query->table('node-instance-property');
          $query->set($data);
          $query->where(array('node_instance_property_id' => $node_instance_property_id));
          $statement = $sql->prepareStatementForSqlObject($query);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $affectedRows = $result->getAffectedRows();
          } */


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('node_instance_property_id', $node_instance_property_id);
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $classArray = $resultObj->initialize($result)->toArray();
        $node_instance_id = $classArray['0']['node_instance_id'];

        //get the node class property id
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_instance_property_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->equalTo('nip.node_instance_id', $classArray['0']['node_instance_id']);
        $select->where->equalTo('ncp.caption', 'Updated Status');
        //return  $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $node_classArray = $resultObj->initialize($result)->toArray();
        //return $node_classArray[0]['node_instance_property_id'];
        $sql = new Sql($this->adapter);
        $data['value'] = '2';

        $query = $sql->update();



        $query->table('node-instance-property');
        $query->set($data);
        $query->where(array('node_instance_property_id' => $node_classArray[0]['node_instance_property_id']));

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $affectedRowsDone = $result->getAffectedRows();
        $this->insertStatementInstance($dialog_instance_node_id);
        if ($affectedRowsDone) {
            //insert all the statements again in the file from database

            $this->insertStatementInstance($dialog_instance_node_id);
            //  return $affectedRows;
        } else {
            return '0';
        }
    }

    /**
     * Public Function to get all the statement from the database and then insert into file
     */
    function insertStatementInstance($dialog_instance_node_id)
    {
        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'dialogue_' . $dialog_instance_node_id;
        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;

        //$file_create = fopen($file_path, "w+") or die('cannot create file');
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        $statementAry = $this->getAllStatement($dialog_instance_node_id);
        foreach ($statementAry as $value) {
            $sender = $value['Actor.Author'];
            $statement_type = $value['Statement Type'];
            $statement = $value['Statement'];
            $node_instance_property_id = $value['node_instance_property_id'];
            $node_instance_id = $value['node_instance_id'];
            $timestamp = $value['Timestamp'];
            $updated_status = $value['Updated Status'];
            $individual_node_class_id = INDIVIDUAL_CLASS_ID;

            $res = $this->getUserProfile($sender, $individual_node_class_id);
            $username = $res['first_name'] . " " . $res['last_name'];
            $strtotime = date("Y-m-d H:i", $timestamp);
            $temp = explode(' ', $strtotime);

            $date_val = $temp[0];

            //if (file_exists($file_path)) {
            if ($awsObj->isObjectExist($awsFilePath)) {
                //$file_data = file_get_contents($file_path);
                $file_data_res = $awsObj->getFileData($awsFilePath);
                $file_data = $file_data_res['data'];
                $count = strlen(trim($file_data));

                if ($count == 0) {
                    $insert_string = $date_val . 'x~x' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $node_instance_id;
                } else {
                    if (strpos($file_data, $date_val) !== false) {
                        $insert_string = '#~#' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $node_instance_id;
                    } else {
                        $insert_string = 'x~x' . $date_val . 'x~x' . 'timestamp=' . $timestamp . '#~#' . 'statement_type=' . $statement_type . '#~#' . 'statement=' . $statement . '#~#' . 'username=' . $username . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . '#~#' . 'actor=' . $sender . '#~#' . 'updated_status=' . $updated_status . '#~#' . 'node_instance_id=' . $node_instance_id;
                    }
                }
            }
//chmod($file_path, 511);
            //fputs($file_create, trim($insert_string));
            $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
        }
        //fclose($file_create);
    }

    /**
     * Created by: Amit Malakar
     * Date: 09-May-17
     * Function to get participant add and remove history timestamp, based on Individual History class
     * @param $dialogue_node_id
     * @param $actor_id
     * @return array
     */
    public function getParticipantEntryExitTimestamp($dialogue_node_id, $actor_id)
    {
        $indHistoryClassId = INDIVIDUAL_HISTORY_CLASS_ID;
        $indActorPropId    = INDIVIDUAL_ACTORID_PROP_ID;
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id', array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip2.node_instance_id', array());
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array());
        $select->where->equalTo('xy.node_y_id', $dialogue_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $indHistoryClassId);
        $select->where->AND->equalTo('nip2.node_class_property_id', $indActorPropId);
        $select->where->AND->equalTo('nip2.value', $actor_id);
        //return  $select->getSqlstring();
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceAry = $resultObj->initialize($result)->toArray();
        $mainArr = array();
        $entryExitArr = array();
        $oldNid = '';
        foreach ($instanceAry as $value) {
            if ($value['node_class_property_id'] == INDIVIDUAL_ACTORID_PROP_ID) {
                $oldNid = $value['node_instance_id'];
                $mainArr[$oldNid]['actor_id'] = $oldNid;
            }
            if ($value['node_class_property_id'] == INDIVIDUAL_TIMESTAMP_PROP_ID && $oldNid == $value['node_instance_id']) {
                $mainArr[$oldNid]['timestamp'] = $value['value'];
            }
            if ($value['node_class_property_id'] == INDIVIDUAL_STATUS_PROP_ID && $oldNid == $value['node_instance_id']) {
                $mainArr[$oldNid]['status'] = $value['value'];
                if ($value['value']==1) {
                    $entryExitArr['added_on'] = $mainArr[$oldNid]['timestamp'];
                } else {
                    $entryExitArr['deleted_on'] = $mainArr[$oldNid]['timestamp'];
                }
            }
        }
        return array_filter($entryExitArr); // remove blank or null key value
    }

    /**
     * Code Updated - Amit B
     * Public Function to get all the statement from the database
     */
    public function getAllStatement($dialog_instance_node_id, $timestamp = '', $loggedInUser = '')
    {
        // get all the statement associated with the dialogue
        $statement_node_class_id = STATEMENT_CLASS_ID;
        $entryExitArr = array();
        if (!empty($loggedInUser)) {
            $entryExitArr = $this->getParticipantEntryExitTimestamp($dialog_instance_node_id, $loggedInUser);
        }
        /* $sql                     = new Sql($this->adapter);
          $select                  = $sql->select();
          $select->from(array('ni' => 'node-instance'));
          $select->columns(array('statement_instance_node_id' => 'node_id', 'node_instance_id' => 'node_instance_id'));
          //$select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id',array('value'=>'value'));
          //$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
          $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array());
          $select->where->equalTo('xy.node_y_id', $dialog_instance_node_id);
          $select->where->AND->equalTo('ni.node_class_id', $statement_node_class_id);
          $select->where->AND->equalTo('ni.status', 1);
          //return  $select->getSqlstring();die;
          $statement               = $sql->prepareStatementForSqlObject($select);
          $result                  = $statement->execute();
          $resultObj               = new ResultSet();
          $instanceAry             = $resultObj->initialize($result)->toArray(); */

        //Data filter on timestamp




        if (trim($timestamp) != '') {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('xy' => 'node-x-y-relation'));
            $select->columns(array('dialogue_y_node_id'=> 'node_y_id'));
            $select->join(array('ni' => 'node-instance'), 'ni.node_id = xy.node_x_id', array('statement_x_node_id'=>'node_id', 'status'=>'status', 'node_id'=>'node_id' , 'node_instance_id'=>'node_instance_id', 'statement_node_id'=>'node_id' ,));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array());
            $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('timestamp_prop_id'=>'node_class_property_id', 'timestamp_instance_id'=>'node_instance_id',  'timestamp_value'=>'value'));
            $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id', array('statement_node_ins_prop_id'=>'node_instance_property_id'));
            $select->join(array('nip3' => 'node-instance-property'), 'nip3.node_instance_id = nip.node_instance_id', array('updated_timestamp'=>'value'));
            $select->join(array('nip4' => 'node-instance-property'), 'nip4.node_instance_id = nip.node_instance_id', array('reply'=>'value'));//reply
            $select->where->AND->equalTo('xy.node_y_id', $dialog_instance_node_id);
            $select->where->AND->equalTo('ni.status', 1);
            $select->where->AND->equalTo('nip.node_class_property_id', STATEMENT_TYPE_ID);// For statement type data
            $select->where->AND->equalTo('nip.value', STATEMENT_TYPE_TEXT);// For statement type data
            $select->where->AND->equalTo('nip1.node_class_property_id', STATEMENT_TIMESTAMP_ID);// For time stamp data
            $select->where->AND->greaterThan('nip1.value', $timestamp);// For statement type data
            $select->where->AND->equalTo('nip2.node_class_property_id', STATEMENT_TITLE_ID);// For time stamp data
            $select->where->AND->equalTo('nip3.node_class_property_id', STATEMENT_UPDATED_TIMESTAMP);// For update stamp data
            $select->where->AND->equalTo('nip4.node_class_property_id', STATEMENT_REPLY);// For update stamp data

              //return  $select->getSqlstring();die;
            $statement     =   $sql->prepareStatementForSqlObject($select);
        } else {
            /* FOLLOWING QUERY NEEDS TO BE OPTIMIZED, INNER QUERY EXHAUSTING MEMORY
             $sql = "SELECT DISTINCT(`nip`.`node_instance_id`),`ni`.`status`,`ni`.`node_id` FROM `node-instance-property` AS `nip`
                LEFT JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`
                LEFT JOIN `node-x-y-relation` AS `nxy` ON `nxy`.`node_x_id`=`ni`.`node_id`
                WHERE `nxy`.`node_y_id`= $dialog_instance_node_id and `ni`.`node_class_id`=$statement_node_class_id
                AND `ni`.`node_instance_id` IN (
                SELECT DISTINCT(`node_instance_id`) FROM `node-instance-property` AS `nip2`
                WHERE `nip2`.`value` = 'Statement' OR `nip2`.`value` = 'image' OR `nip2`.`value` = 'attachment' OR `nip2`.`value` = 'Letter' GROUP BY `nip2`.`node_instance_id`
                )";*/
            $statement_timestamp_id = STATEMENT_TIMESTAMP_ID;
            $sql = "SELECT DISTINCT(`nip`.`node_instance_id`),`ni`.`status`,`ni`.`node_id`,`ni`.`node_id` as statement_node_id"
                   . " FROM `node-instance-property` AS `nip`";
            if (count($entryExitArr)) {
                $sql .= " LEFT JOIN `node-instance-property` AS `nip2` ON `nip`.`node_instance_id`=`nip2`.`node_instance_id`";
            }
            $sql .= " LEFT JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`"
                   . " LEFT JOIN `node-x-y-relation` AS `nxy` ON `nxy`.`node_x_id`=`ni`.`node_id`"
                   . " WHERE `nxy`.`node_y_id`='$dialog_instance_node_id' AND `ni`.`node_class_id`='$statement_node_class_id' "
                   . " AND (`nip`.`value`='Statement' OR `nip`.`value`='image' OR `nip`.`value`='attachment' OR `nip`.`value`='Letter' OR `nip`.`value`='System Message') ";
            if (count($entryExitArr)) {
                if (isset($entryExitArr['added_on']) && isset($entryExitArr['deleted_on'])) {
                    $sql .= " AND `nip2`.`node_class_property_id`='$statement_timestamp_id' AND (`nip2`.`value` BETWEEN '".$entryExitArr['added_on']."' AND '".$entryExitArr['deleted_on']."' )";
                } elseif (isset($entryExitArr['added_on'])) {
                    $sql .= " AND `nip2`.`node_class_property_id`='$statement_timestamp_id' AND (`nip2`.`value` >= '".$entryExitArr['added_on']."' )";
                } elseif (isset($entryExitArr['deleted_on'])) {
                    $sql .= " AND `nip2`.`node_class_property_id`='$statement_timestamp_id' AND (`nip2`.`value` <= '".$entryExitArr['deleted_on']."' )";
                }
            }
           // echo $sql;
            $statement = $this->adapter->query($sql);
        }




        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceAry = $resultObj->initialize($result)->toArray();
        $main_ary = array();

        //Code added on 4 Oct 2017
        //Get user account status
        //Start
        $statementInstIds = array_column($instanceAry, 'node_instance_id');
        $userInstanceIds = $this->fetchStatementUserInstanceId($statementInstIds);
          
        $userAccoutStatusArr = $this->fetchUserAccountStatus(array_unique($userInstanceIds));
        //End
    
        $i = 0;
        foreach ($instanceAry as $value) {
            $nodeStatusType = $value['status'];
            $statementnodeId = $value['node_id'];
            $node_instance_id = $value['node_instance_id'];


            // To fetch UserInstanceID
            //$node_instance_id_user = $this->getUserNodeInstanceId($node_instance_id);
            $node_instance_id_user = $userInstanceIds[$node_instance_id];
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('value' => 'value', 'node_instance_property_id'));
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
            $select->where->IN('nip.node_instance_id', array($node_instance_id, $node_instance_id_user));

            //return  $select->getSqlstring();
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $propertyAry = $resultObj->initialize($result)->toArray();
            $inner_ary = array();

            if (trim($timestamp) != '') {
                //$inner_ary['statement_node_id'] = $value['statement_node_id'];
                $inner_ary['timestamp_seconds'] = $value['timestamp_value'];
                $inner_ary['dialogue_node_id']  = $dialog_instance_node_id;
                $inner_ary['statement_node_ins_prop_id']  = $value['statement_node_ins_prop_id'];
                $inner_ary['statement_timestamp'] = $value['timestamp_value'];
            }
            $inner_ary['statement_node_id']  = $value['statement_node_id'];
            //print_r($propertyAry);
            foreach ($propertyAry as $output) {
                $value = $output['value'];
                $caption = strtolower(preg_replace('/ /', '_', $output['caption']));
                $inner_ary[$caption] = $value;
                $individual_node_class_id = INDIVIDUAL_CLASS_ID;
                if ($caption == 'statement') {
                    $inner_ary['node_instance_property_id'] = $output['node_instance_property_id'];
                    $inner_ary['node_instance_id'] = $node_instance_id;
                } elseif ($caption == "timestamp") {
                    $inner_ary['timestamp'] = $output['value'];
                    $inner_ary['statement_timestamp'] = $output['value'];
                } elseif ($caption == "profile_image") {//Added on 4 July
                    $inner_ary['profile_image'] = $this->getClassesTable()->getProfileUserImage($value, 'thumbnail');
                }
            }
            //Set profile pic for guest
            if ($userAccoutStatusArr[$node_instance_id_user]=='guest') {
                $inner_ary['profile_image'] = $this->getClassesTable()->getProfileUserImage('', 'guest');
            }
            
            if (!isset($inner_ary['profile_image'])) {
                $inner_ary['profile_image'] = $this->getClassesTable()->getProfileUserImage('', 'thumbnail');
            }
            
            if (!isset($inner_ary['last_name'])) {
                $inner_ary['last_name'] = ' ';
            }
            $inner_ary['node_statusType'] = $nodeStatusType;
            $inner_ary['node_instance_propertyid'] = $statementnodeId;

            $main_ary[$i] = $inner_ary;

            $i++;
        }
        //return $propertyAry;
        return $main_ary;
    }

    public function removeDialogActor($dialog_data)
    {
        $dialog_instance_node_id = $dialog_data['dialog_instance_node_id'];
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $total_users = $dialog_data['total_users'];
        //$dialog_instance_node_id = $dialog_data['dialog_instance_node_id'];
        //delete the user from dialogue
        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from('node-x-y-relation');
        $delete->where->equalTo('node_x_id', $user_instance_node_id);
        $delete->where->equalTo('node_y_id', $dialog_instance_node_id);
        //return  $delete->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();

        //update the dialogue on which comment has been done
        $success = $this->updateDialogTimestamp($dialog_instance_node_id);

        $this->insertAllDialogActorInstances($dialog_instance_node_id);
        //add all the user associated with dialogue in the file
        $dialogAry = $this->insertAllDialogueInfoById($dialog_instance_node_id, $user_instance_node_id);
    }

    public function checkEmailExist($email_address)
    {
        $email_address = trim($email_address);
        //$account_class_node_id = '634';
        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
        $select->where->AND->equalTo('nip.value', $email_address);
        $select->where->AND->equalTo('ni.status', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $accountInfo = $resultObj->initialize($result)->toArray();
    }

    public function getMenuStructure($node_id)
    {
        $class_id = 172;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value'), '');
        $select->where->equalTo('ni.node_class_id', $class_id);
        $select->where->AND->equalTo('ncp.value', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $mainInstanceNodeId = $dataArray[0]['node_id'];

        $all_x_ids = $this->getNodeXOrYId($mainInstanceNodeId, 'node_y_id', 'node_x_id', 'Y');

        return $this->getMenu($all_x_ids);
    }

    public function getMenu($all_x_ids)
    {
        $menuArray = array();
        foreach ($all_x_ids as $key => $node_id) {
            $tempArray = $this->getAllMenu($node_id['node_x_id']);
            $subArray = array();
            foreach ($tempArray as $k => $v) {
                $subArray[$v['caption']] = $v['value'];
            }

            $x_ids = $this->getNodeXOrYId($node_id['node_x_id'], 'node_y_id', 'node_x_id', 'Y');
            if (count($x_ids) > 0) {
                $subArray['child'] = $this->getMenu($x_ids);
            }

            $menuArray[] = $subArray;
        }
        return $menuArray;
    }

    public function getAllMenu($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value', 'node_class_property_id'), '');
        $select->join(array('nip' => 'node-class-property'), 'nip.node_class_property_id = ncp.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        return $dataArray;
    }

    public function getPluginStructure($node_id)
    {
        $class_id = 459;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value'), '');
        $select->where->equalTo('ni.node_class_id', $class_id);
        $select->where->AND->equalTo('ncp.value', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $mainInstanceNodeId = $dataArray[0]['node_id'];
        $allGroupRolesArray = $this->getInstanceListOfParticulerClass(906, 'class', 'node_instance_id');
        $fileterRoles = array();
        foreach ($allGroupRolesArray as $groupVal) {
            if ($groupVal['Group'] == $mainInstanceNodeId) {
                $fileterRoles[] = $groupVal['Role'];
            }
        }

        $returnArr = $this->getInstanceStructure($dataArray[0]['node_instance_id']);
        $returnArr['grouprole'] = $fileterRoles;
        return $returnArr;
    }

    /**
     * Modified By: Amit Malakar
     * Date: 16-Feb-2017
     * Added Procedure to get form structure
     * @param $node_id
     * @return mixed
     */
    public function getFormStructure($node_id)
    {
        $class_property_id = 2952;
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = "CALL getFormStructure('" . $node_id . "', '" . $class_property_id . "')";
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray[0]['value'];
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
            $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value'), '');
            $select->where->equalTo('ni.node_id', $node_id);
            $select->where->AND->equalTo('ncp.node_class_property_id', $class_property_id);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray[0]['value'];
        }
    }

    public function getDataOfMenuInstance($node_id)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->where->equalTo('ni.node_y_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $relationArray = $resultObj->initialize($result)->toArray();

        $subInstanceArray = array();
        foreach ($relationArray as $key => $value) {
            $subInstanceArray[] = $value['node_x_id'];
        }

        $subDataArray = array();
        if (count($subInstanceArray) > 0) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
            $select->where->IN('ni.node_id', $subInstanceArray);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $tempArray = $resultObj->initialize($result)->toArray();

            foreach ($tempArray as $key => $value) {
                $subDataArray[$value['node_id']][strtolower($value['caption'])] = $value['value'];
            }
        }


        /* Create Proper Array For Menu */
        $mainArray = array();
        foreach ($dataArray as $key => $value) {
            $mainArray[$node_id][strtolower($value['caption'])] = $value['value'];
        }

        if (count($subDataArray) > 0) {
            $mainArray[$node_id]['menu'] = $subDataArray;
        }

        return $mainArray;
    }

    public function getDataOfInstanceTitle($data)
    {
  // function here to fetch second instance property value using first value
        $node_id = $data['node_id'];

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-x-y-relation'));
        $select->columns(array('node_x_id'));
        $select->where->equalTo('ni.node_y_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $relationArray = $resultObj->initialize($result)->toArray();

        $subInstanceArray = array();
        $subInstanceArray1 = '';
        foreach ($relationArray as $key => $value) {
            $subInstanceArray[] = $value['node_x_id'];
            $subInstanceArray1.= $value['node_x_id'] . ',';
        }
        $subInstanceArray1 = rtrim($subInstanceArray1, ',');
        $subDataArray = array();

        if (count($subInstanceArray) > 0) {
            $menuProId = MENU_SETDEFAULT_PROPERTY_ID;
            $sql1 = "SELECT `nip`.`node_class_property_id` AS `node_class_property_id`, `nip`.`value` AS `value` FROM `node-instance-property` AS `nip` WHERE `nip`.`node_class_property_id` = '3252' AND `nip`.`node_instance_id` = (SELECT `ni`.`node_instance_id` AS `node_instance_id` FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` WHERE `ni`.`node_id` IN (" . $subInstanceArray1 . ") AND `nip`.`node_class_property_id` = " . $menuProId . " AND `nip`.`value` = 'Yes')";
            $statement = $this->adapter->query($sql1);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $propertyAry = $resultObj->initialize($result)->toArray();

            $tempFilter = explode("~|~", $propertyAry[0]['value']);

            if (count($tempFilter) > 1) {
                $newTempFilter = explode("~$~", $tempFilter[0]);
            } else {
                $newTempFilter = explode("~$~", $propertyAry[0]['value']);
            }

            if ($newTempFilter[0] == 'flyout') {
                $columns = html_entity_decode($newTempFilter[2]);
                $propertyId = '';
                if (preg_match("/>/i", $columns)) {
                    $newTempFilter2 = array_map('strtolower', array_map("trim", explode(">", $columns)));
                } else {
                    $newTempFilter2 = array_map('strtolower', array_map("trim", explode(">", $columns)));
                }
            } else {
                $columns = html_entity_decode($newTempFilter[1]);
                $propertyId = '';
                if (preg_match("/>/i", $columns)) {
                    $newTempFilter2 = array_map('strtolower', array_map("trim", explode(">", $columns)));
                } else {
                    $newTempFilter2 = array_map('strtolower', array_map("trim", explode(">", $columns)));
                }
            }
            $propertyAry1 = $this->getTableCols(array('node_class_property_id'), 'node-class-property', array('caption', 'node_class_id'), array($newTempFilter2[1], '655'))['node_class_property_id'];
        }
        if (count($tempFilter) > 1) {
            return $propertyAry1 . '~#~' . $newTempFilter[3] . '~#~' . $newTempFilter[3];
        } else {
            return $propertyAry1 . '~#~' . $newTempFilter[2] . '~#~';
        }
    }

    /**
     * Created by Amit Malakar
     * Date: 27-Oct-2016
     * Update Deal Phase value
     * @param $data
     * @return array
     */
    public function updateDealPhase($data)
    {

        $dealNid = $data['node_instance_id'];
        $phasePropId = $data['node_class_property_id'];
        $phasePropVal = $data['value'];

        // check deal phase property value
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->where->equalTo('node_instance_id', $data['node_instance_id']);
        $select->where->AND->equalTo('node_class_property_id', $data['node_class_property_id']);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dealPhaseRow = $resultObj->initialize($result)->toArray();

        if (count($dealPhaseRow)) {
            // if the property value exists - update it
            $upQuery = $sql->update();
            $upQuery->table('node-instance-property');
            $upQuery->set(array('value' => $data['value']));
            $upQuery->where(array('node_instance_id' => $data['node_instance_id'], 'node_class_property_id' => $data['node_class_property_id']));
            $statement = $sql->prepareStatementForSqlObject($upQuery);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $resultObj->initialize($result);
        } else {
            $newRow = array();
            $newRow['node_instance_id'] = $data['node_instance_id'];
            $newRow['node_class_property_id'] = $data['node_class_property_id'];
            $newRow['node_id'] = $this->createNode();
            $newRow['node_type_id'] = 2;    // deal will be type 2
            $newRow['value'] = $data['value'];

            $inQuery = $sql->insert('node-instance-property');
            $inQuery->values($newRow);
            $statement = $sql->prepareStatementForSqlObject($inQuery);
            $result = $statement->execute();
        }
        return $data;
    }

    /**
     * Function to get Deal Role Menu Counts
     * Created By: Amit Malakar
     * Date: 29-Dec-2016
     * @param $data
     * @return array
     */
    public function getDealRoleMenuCount($data)
    {
        $roleId = $data['roleId'];
        $roleCountArr = array();
        $data['mappingClassNodeid']['classNodeid'] = $data['list_mapping_id_array']['classNodeid'];
        $newRealArrayResult = $this->getArchiveDeal($data);
        $newRealArchive = $newRealArrayResult['realArrayNew'];

        foreach ($data['roles_menu_arr'] as $key => $value) {
            $getStatus = explode("_", $value);
            if (strtolower($getStatus[0]) == "common") {
                //$data['roleId'] = $roleId;
                //$realArrayNew   = $this->getArchiveDeal($data);
                //$realAssignArrayNew  = $this->fetchAssignDeal($data);
                //$getDealArr     = json_decode($this->getDealByMapping($data),true);
                //return $realAssignArrayNew;
                //$realArrayNew   = array_intersect($realAssignArrayNew, $realArrayNew['realArrayNew']);
                if ($newRealArrayResult != "") {
                    $roleCountArr[$value] = count($newRealArchive);
                } else {
                    $roleCountArr[$value] = 0;
                }
            } elseif (strtolower($getStatus[1]) == ROLE_RA && $roleId != ROLE_SUPERADMIN) {
                if ($roleId != ROLE_SUPERADMIN && ($data['roleId'] == ROLE_RM || $data['roleId'] == ROLE_C || $data['roleId'] == ROLE_D) && strtolower($getStatus[1]) == ROLE_RA) { // add sprint 3
                    $data['roleId'] = ROLE_RA;
                }

                $getUnAssignDealRes = $this->getRADeal($data);
                $getUnAssignDealArr = $getUnAssignDealRes['realArrayNew'];
                $getAssignDealRes = json_decode($this->getDealByMapping($data), true);
                $getAssignDealArr = $getAssignDealRes['realArrayNew'];
                $RAsArray = array_diff($getUnAssignDealArr, $getAssignDealArr);
                $realArrayNew = $RAsArray;
                $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                $roleCountArr[$value] = count($realArrayNew);
            } elseif ($roleId != ROLE_SUPERADMIN && strtolower($getStatus[1]) == "mine" && ($roleId == ROLE_RM || $roleId == ROLE_C || $roleId == ROLE_D)) {
                // add condition sprint 3
                $classArr = $this->fetchnodeClassCaption($data['mappingClassNodeid']['classNodeid']);
                $classId = $classArr[0]['node_class_id'];
                $mappingArrayNew = json_decode($this->getMappingRoleActorDeal($classId), true);

                $realArray1 = array();
                // Make new $realArray according key value pair of [ node intance id ]
                foreach ($mappingArrayNew as $key => $valu) {
                    $realArray1[$valu['node_instance_id']][strtolower($valu['caption'])] = $valu['value'];
                }

                $roleArray = array();
                $realArrayNew = array();
                $tempArray = array();

                foreach ($realArray1 as $key => $val) {
                    /*
                     * Get Users deal according to their login id and role id
                     * Check condition for user login id and role id we
                     * get from post data
                     */
                    $userRoleFlag = true; //set default value of user role flag exists or not.
                    if (isset($roleId)) {
                        //if user login instance id exits in node-intanse property
                        if (intval($roleId) != intval($val['role'])) {
                            $userRoleFlag = false;
                        }
                    }
                    if (intval($roleId) == intval($data['admin_role_id']) || intval($roleId) == 0) {
                        //                            $nodeInstanceId          = $this->getNodeinstanceIDDetails($val['deal']);
                        //                            $realArrayNew[]          = $nodeInstanceId;
                        $nodeInsIdArr[] = $val['deal'];
                        $roleArray[$val['deal']] = $val['role'];
                    } else {
                        if (intval($data['login_user_id']) == intval($val['actor']) && $userRoleFlag) {
                            //                                $nodeInstanceId = $this->getNodeinstanceIDDetails($val['deal']);
                            //                                if ($nodeInstanceId != "")
                            //                                    $realArrayNew[] = $nodeInstanceId;
                            if ($val['deal'] != "") {
                                $nodeInsIdArr[] = $val['deal'];
                            }
                            $roleArray[$val['deal']] = $val['role'];
                        }
                    }
                }


                if (!empty($nodeInsIdArr) && count($nodeInsIdArr) > 0) {
                    $tempArrayNew = $this->getNodeinstanceMultipleNodeId($nodeInsIdArr, $roleId);
                    $realArrayNew = array_column($tempArrayNew, 'node_instance_id');
                }
                $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                $roleCountArr[$value] = count($realArrayNew);
            } elseif ($roleId != ROLE_SUPERADMIN && strtolower($getStatus[1]) == "mine" && $roleId != ROLE_RM) {  // previous code sprint 2
                //else if(strtolower($getStatus[1]) == "mine" && ($roleId != ROLE_RM || $roleId != ROLE_C || $roleId != ROLE_D)) {
                $data['roleId'] = $roleId;
                $getAssignDealRes = json_decode($this->getDealByMapping($data), true);
                $getAssignDealArr = $getAssignDealRes['realArrayNew'];
                $realArrayNew = $getAssignDealArr;
                $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                $roleCountArr[$value] = count($realArrayNew);
            } elseif ($roleId != ROLE_SUPERADMIN && strtolower($getStatus[1]) == "rm/c/d" || strtolower($getStatus[1]) == "c/d") {
                $data['roleId'] = $roleId;
                $getUnAssignRMCDDealRes = $this->getRMCDDeal($data);
                $getUnAssignRMCDDealArr = $getUnAssignRMCDDealRes['realArrayNew'];
                /* $getAssignRADealRes     = json_decode($this->getDealByMapping($data),true);
                  $getAssignRADealArr     = $getAssignRADealRes['realArrayNew'];
                  $RMCDsArray             = array_intersect($getUnAssignRMCDDealArr, $getAssignRADealArr);
                  $realArrayNew           = $RMCDsArray;  // change sprint 3 for new modification */
                $realArrayNew = array_diff($getUnAssignRMCDDealArr, $newRealArchive);
                $roleCountArr[$value] = count($realArrayNew);
            }
        }

        return $roleCountArr;
    }

    public function fetchAssignDeal($data)
    {
        $roleId = $data['roleId'];
        $classArr = $this->fetchnodeClassCaption($data['mappingClassNodeid']['classNodeid']);
        $classId = $classArr[0]['node_class_id'];
        $mappingArrayNew = json_decode($this->getMappingRoleActorDeal($classId), true);
        $realArray1 = array();
        // Make new $realArray according key value pair of [ node intance id ]
        foreach ($mappingArrayNew as $key => $valu) {
            $realArray1[$valu['node_instance_id']][strtolower($valu['caption'])] = $valu['value'];
        }

        $roleArray = array();
        $realArrayNew1 = array();
        $tempArray = array();

        foreach ($realArray1 as $key => $val) {
            /*
             * Get Users deal according to their login id and role id
             * Check condition for user login id and role id we
             * get from post data
             */
            $userRoleFlag = true; //set default value of user role flag exists or not.
            if (isset($roleId)) {
                //if user login instance id exits in node-intanse property
                if (intval($roleId) != intval($val['role'])) {
                    $userRoleFlag = false;
                }
            }
            if (intval($roleId) == intval($data['admin_role_id']) || intval($roleId) == 0) {
                //$nodeInstanceId          = $this->getNodeinstanceIDDetails($val['deal']);
                //$realArrayNew1[]          = $nodeInstanceId;
                $nodeInsIdArr[] = $val['deal'];
                $roleArray[$val['deal']] = $val['role'];
            } else {
                if (intval($data['login_user_id']) == intval($val['actor']) && $userRoleFlag) {
                    //$nodeInstanceId = $this->getNodeinstanceIDDetails($val['deal']);
                    //if ($nodeInstanceId != "")
                    //$realArrayNew1[] = $nodeInstanceId;
                    if ($val['deal'] != "") {
                        $nodeInsIdArr[] = $val['deal'];
                    }
                    $roleArray[$val['deal']] = $val['role'];
                }
            }
        }
        if (!empty($nodeInsIdArr)) {
            $tempArrayNew = $this->getNodeinstanceMultipleNodeId($nodeInsIdArr, $roleId);
            $realArrayNew1 = array_column($tempArrayNew, 'node_instance_id');
        }

        return $realArrayNew1;
    }

    //Get Menu Count
    public function getMenuCount($data = array())
    {
        $mappingFlag = false;

        if ($data['list_mapping_id_array']['classNodeid'] != "" && $data['login_user_id'] != "") {
            $mappingFlag = true;
        }

        $realArrayNew = array();
        $classArr = $this->fetchnodeClassCaption($data['class_node_id']);
        /* Start Code For Optimization */
        if ($data['class_node_id'] == '396138') {
            if ($data['roleId'] == ROLE_BM) {
                $data['node_class_property_id'] = array('3231', 'common_archived');
            } elseif ($data['roleId'] == ROLE_RA) {
                $data['node_class_property_id'] = array('3231', 'common_archived', 'ra_mine', 'ra_rm/c/d');
            } elseif ($data['roleId'] == ROLE_RM || $data['roleId'] == ROLE_C || $data['roleId'] == ROLE_D) {
                $data['node_class_property_id'] = array('3231', 'common_archived', 'ra_454674', 'ra_mine', 'ra_c/d');
            }
        }
        /* End Code Of Optimization */
        $ncpIds = $data['node_class_property_id'];
        $node_class_id = $classArr[0]['node_class_id'];
        $login_user_id = isset($data['login_user_id']) ? $data['login_user_id'] : '';

        /* code here start to fetch maping class instance list bases of class node id */
        $roleId = $data['roleId'];
        $data['mappingClassNodeid']['classNodeid'] = $data['list_mapping_id_array']['classNodeid'];

        switch ($roleId) {
            case ROLE_BM:  // code here for BM Role
                $getDealArr = json_decode($this->getDealByMapping($data), true);
                break;
            case ROLE_RA:  // code here for RA Role
                $getStatus = explode("_", $data['status']);
                if (empty($getStatus[1]) && trim($getStatus[0]) != "All") {
                    $getDealRes = json_decode($this->getDealByMapping($data), true);
                } else {
                    $getDealRes = $this->getRADeal($data);
                }
                //$getDealRes = $this->getRADeal($data);
                //$getAssignDealRes = json_decode($this->getDealByMapping($data),true);
                //$mergeRM = array_merge($getAssignDealRes['realArrayNew'], $getDealRes['realArrayNew']);
                //$uniquDealArr = array_values(array_unique($mergeRM));
                //$mergeRoleRm = array_merge($getAssignDealRes['roleArray'], $getDealRes['roleArray']);
                //$uniquRoleRm = array_values(array_unique($mergeRoleRm));
                //$getDealArr = array('realArrayNew' => $uniquDealArr, 'roleArray' => $uniquRoleRm); // previuos code sprint 2
                $getDealArr = array('realArrayNew' => $getDealRes['realArrayNew'], 'roleArray' => $getDealRes['roleArray']); // current code for RAs role Team (all)

                break;
            case ROLE_RM: // code here for RM Role
                $getDealArr = json_decode($this->getDealByMapping($data), true);
                break;
            case ROLE_C:  // code here for Controller Role
                $getDealArr = json_decode($this->getDealByMapping($data), true);
                break;
            case ROLE_D:  // code here for Director Role
                $getDealArr = json_decode($this->getDealByMapping($data), true);
                break;
            case ROLE_SUPERADMIN:  // Super Admin code here with for BM Role only assign count in all system deal in publish
                //$getDealArr = json_decode($this->getDealByMapping($data),true);
                $getDealArr = $this->getInstanceListBasedOfClass(DEAL_CLASS);
                break;
            default:  // Administrator
                $getDealArr = json_decode($this->getDealByMapping($data), true);
        }



        if (!empty($getDealArr['realArrayNew']) && count($getDealArr['realArrayNew'])) {
            $getDealArr = array_values(array_unique($getDealArr['realArrayNew']));
            $newRealArrayResult = $this->getArchiveDeal($data);
            $newRealArchive = $newRealArrayResult['realArrayNew'];
            $realArrayNew = array_diff($getDealArr, $newRealArchive);
        }

        //$realArrayNew = array_values(array_unique($getDealArr['realArrayNew']));
        /* End Here */

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_class_property_id', 'value', 'count_value' => new Predicate\Expression('COUNT(nip.value)')));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array(), 'left');
        $select->where->IN('nip.node_class_property_id', $ncpIds);
        $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
        if ($mappingFlag && count($realArrayNew) > 0 && !empty($realArrayNew)) {
            $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
        } else {
            if ($mappingFlag && $data['list_mapping_id_array']['classNodeid'] != "") {
                $select->where->AND->IN('ni.node_instance_id', array(''));
            }
        }
        $select->group('nip.node_class_property_id');
        $select->group('nip.value');
        //return $select->getSqlstring();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $menuArray = $resultObj->initialize($result)->toArray();
        //return $menuArray;
        $resultArray = array();

        foreach ($menuArray as $key => $value) {
            $resultArray[$value['node_class_property_id']][$value['value']] = $value['count_value'];
        }

        // ROLES MENU COUNT >>>
        $roleMenuAll = $data['node_class_property_id'];
        $roleMenuArr = array();
        foreach ($roleMenuAll as $rm) {
            if (strpos($rm, '_') !== false) {
                $roleMenuArr[] = $rm;
            }
        }

        $data['roles_menu_arr'] = $roleMenuArr;
        $result = $this->getDealRoleMenuCount($data);
        $resultArray['rolesMenuCount'] = $result;
        // <<< ROLES MENU COUNT

        return $resultArray;
    }

    /**
     * Modififed by: Amit malakar
     * Date: 16-Feb-2017
     * Added stored procedure to get list header array
     * @param $data
     * @return array
     */
    public function getListHeader($data)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL getListHeader("' . $data['class_node_id'] . '");';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nc' => 'node-class'));
            $select->columns(array('node_class_id'));
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
            $select->where->equalTo('nc.node_id', $data['class_node_id']);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }

        $mainPropId = '';
        $node_class_id = '';
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);

        $columns = $data['columns'];
        $headerArray = array();
        foreach ($columns as $key => $value) {
            if (strpos($value, '=')) { // different label '='
                $allFieldsArr = array();
                // remove separtor if exists
                preg_match('/\(([^\)]+)\)/', $value, $match);
                if (count($match) > 1) {
                    $value = ltrim($value, $match[0]);
                }
                // explode with '='
                $lblFieldArr = explode("=", $value);
                $caption = trim($lblFieldArr[0]);
                if (strpos($lblFieldArr[1], '+')) {
                    $allFieldsArr = explode("+", $lblFieldArr[1]); //"BUYER > First Name "," BUYER > Last Name"
                } else {
                    $allFieldsArr[] = $lblFieldArr[1];
                }
                // group ncpid with comma
                $ncpId = '';
                foreach ($allFieldsArr as $key => $field) {
                    // explode with last '>'
                    $parts = preg_split('~>(?=[^>]*$)~', $field);
                    $splitField = trim($parts[0]) . ' > ' . trim($parts[1]);
                    $resArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $splitField))), $propertyArray, 0, 'multiple');
                    $ncpId .= $resArray['node_class_property_id'] . ',';
                }
                $tArray['node_class_property_id'] = rtrim($ncpId, ',');
                $tArray['caption'] = $caption;
            } elseif (preg_match("/>/i", $value)) {
                $tArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $value))), $propertyArray, 0, 'multiple');
            } else {
                $tArray = $this->getPropertyIdWithName(array(trim(strtolower($value))), $propertyArray, 0, 'multiple');
            }

            $headerArray[$tArray['node_class_property_id']] = $tArray['caption'];
        }

        return $headerArray;
    }

    /**
     * Deal Searching
     * Created by: Amit Malakar
     * Date: 26-Dec-2016
     * @param $realArrayNew
     * @param $nodeClassId
     * @param $post
     * @return array
     */
    public function getSearchData($realArrayNew, $nodeClassId, $post)
    {
        $searchFlag = 0;
        $searchFlag = 1;
        $instanceIdSearchArray = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->where->equalTo('ni.node_class_id', $nodeClassId);
        $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
        $select->where->AND->like('nip.value', '%' . $post['searchString'] . '%');
        if (ROLE_BM != $post['roleId']) {
            $select->where->AND->equalTo('ni.status', 1);
        }
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArrayNew = $resultObj->initialize($result)->toArray();

        //foreach ($tempArrayNew as $key => $value) {
        //$instanceIdSearchArray[] = $value['node_instance_id'];
        //}
        $instanceIdSearchArray = array_unique(array_column($tempArrayNew, 'node_instance_id'));
        //return $instanceIdSearchArray;

        if (count($instanceIdSearchArray) < 1) {
            $instanceIdArray = array('');
        } else {
            if ($post['status'] != '' && $post['status'] != 'All') {
                $instanceIdArray = array_intersect($realArrayNew, $instanceIdSearchArray);
            } else {
                $instanceIdArray = $instanceIdSearchArray;
            }
        }

        return $instanceIdArray;
    }

    /**
     * Deal Head Filters and Sorting
     * Created by: Amit Malakar
     * Date: 26-Dec-2016
     * @param $realArrayNew
     * @param $headerArray
     * @param $nodeClassId
     * @param $post
     * @return array
     */
    public function getHeaderColFilterSort($realArrayNew, $headerArray, $nodeClassId, $post)
    {
        $filterFlag = 0;
        $sortFlag = 0;
        if (isset($post['head_filter'])) {
            $tempHeaderArray = $headerArray;
            $tempHeaderArray = array_flip(array_map('strtolower', $tempHeaderArray));
            $headFilterArr = $post['head_filter'];
            for ($i = 0; $i < count($headFilterArr); $i++) {
                if (isset($tempHeaderArray[strtolower($headFilterArr[$i]['col'])])) {
                    $col = strtolower($headFilterArr[$i]['col']);
                    $headFilterArr[$i]['ncpid'] = $tempHeaderArray[$col];
                }
            }

            $chInsIdArr = array();
            $i = 0;
            $test = array();
            foreach ($headFilterArr as $headFilter) {
                $ncpid = explode(",", $headFilter['ncpid']);
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->columns(array('node_instance_id'));
                $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
                $select->where->equalTo('ni.node_class_id', $nodeClassId);

                if (isset($headFilter['filter']) && $headFilter['filter'] != '') {
                    $filterFlag = 1;
                    $filterType = $headFilter['filter'];
                    $searchString = trim($headFilter['search']);
                    $select->where->IN('nip.node_class_property_id', $ncpid);

                    if ($filterType == 'Equals To') {
                        $select->where->AND->equalTo('nip.value', $searchString);
                    } elseif ($filterType == 'Not Equals To') {
                        $select->where->AND->notEqualTo('nip.value', $searchString);
                    } elseif ($filterType == 'Begins With') {
                        $select->where->AND->like('nip.value', $searchString . '%');
                    } elseif ($filterType == 'Ends With') {
                        $select->where->AND->like('nip.value', '%' . $searchString);
                    } elseif ($filterType == 'Does Not Contain') {
                        $select->where->AND->notLike('nip.value', '%' . $searchString . '%');
                    } else { // contains
                        $select->where->AND->like('nip.value', '%' . $searchString . '%');
                    }
                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $tempArrayNew = $resultObj->initialize($result)->toArray();
                    $tempChInsIdArr = array_column($tempArrayNew, 'node_instance_id');
                    array_push($test, array_unique($tempChInsIdArr));
                    if ($i == 0) {
                        $chInsIdArr = $tempChInsIdArr;
                    } else {
                        $chInsIdArr = array_intersect($tempChInsIdArr, $chInsIdArr);
                    }
                    $i++;
                }

                // COLUMN HEADER SORT >>>
                if (isset($headFilter['sort']) && $headFilter['sort'] != '') {
                    $sortFlag = 1;
                    $ncpid = $headFilter['ncpid'];
                    if (strpos($ncpid, ',')) {
                        $ncpid = preg_replace('/^([^,]*).*$/', '$1', $ncpid);
                    }
                    $sql2 = new Sql($this->adapter);
                    $select2 = $sql2->select();
                    $select2->from(array('ni' => 'node-instance'));
                    $select2->columns(array('node_instance_id'));
                    $select2->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
                    $select2->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), 'left');
                    $select2->where->equalTo('ni.node_class_id', $nodeClassId);
                    $select2->where->AND->equalTo('nip.node_class_property_id', $ncpid);
                    if (strtolower($headFilter['sort']) == 'sort z - a') {
                        $select2->order(new Expression('CASE WHEN nip.node_class_property_id="' . $ncpid . '" THEN -1 ELSE nip.value end DESC, nip.value DESC'));
                    } else {
                        $select2->order(new Expression('CASE WHEN nip.node_class_property_id="' . $ncpid . '" THEN -1 ELSE nip.value end ASC, nip.value ASC'));
                    }

                    $statement2 = $sql->prepareStatementForSqlObject($select2);
                    $result2 = $statement2->execute();
                    $resultObj2 = new ResultSet();
                    $sortedArr = $resultObj2->initialize($result2)->toArray();
                    $sortedInstanceIds = array_column($sortedArr, 'node_instance_id');
                }
                // <<< COLUMN HEADER SORT
            }

            if ($filterFlag && count($chInsIdArr) < 1) {
                $realArrayNew = array('');
            } elseif ($filterFlag && count($chInsIdArr)) {
                $realArrayNew = array_intersect($chInsIdArr, $realArrayNew);
            }
        }

        // SORT INSTANCE IDs
        if (count($sortedInstanceIds)) {
            $arr_difference = array_diff(array_unique($realArrayNew), $sortedInstanceIds);
            $arr_intersect = array_intersect($sortedInstanceIds, $realArrayNew);
            $realArrayNew = array_merge($arr_difference, $arr_intersect);
        }

        return array('realArrayNew' => $realArrayNew, 'sortedInstanceIds' => $sortedInstanceIds);
    }

    /**
     * Function to get Header Cols and
     * Required Property Ids
     * Created by: Amit Malakar
     * Date: 26-Dec-2016
     * @param $post
     * @return array
     */
    public function getHeaderColsPropertyIds($post)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_class_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
        $select->where->equalTo('nc.node_id', $post['class_node_id']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        //return $dataArray;

        $mainPropId = '';
        $node_class_id = '';
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);
        $columns = $post['columns'];
        // $headerArray - all header columns
        $headerArray = array();
        foreach ($columns as $key => $value) {
            if (strpos($value, '=')) { // different label '='
                $allFieldsArr = array();
                // remove separtor if exists
                preg_match('/\(([^\)]+)\)/', $value, $match);
                if (count($match) > 1) {
                    $value = ltrim($value, $match[0]);
                }
                // explode with '='
                $lblFieldArr = explode("=", $value);
                $caption = trim($lblFieldArr[0]);
                if (strpos($lblFieldArr[1], '+')) {
                    $allFieldsArr = explode("+", $lblFieldArr[1]); //"BUYER > First Name "," BUYER > Last Name"
                } else {
                    $allFieldsArr[] = $lblFieldArr[1];
                }
                // group ncpid with comma
                $ncpId = '';
                foreach ($allFieldsArr as $key => $field) {
                    // explode with last '>'
                    $parts = preg_split('~>(?=[^>]*$)~', $field);
                    $splitField = trim($parts[0]) . ' > ' . trim($parts[1]);
                    $resArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $splitField))), $propertyArray, 0, 'multiple');
                    $ncpId .= $resArray['node_class_property_id'] . ',';
                }
                $tArray['node_class_property_id'] = rtrim($ncpId, ',');
                $tArray['caption'] = $caption;
            } elseif (preg_match("/>/i", $value)) {
                $tArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $value))), $propertyArray, 0, 'multiple');
            } else {
                $tArray = $this->getPropertyIdWithName(array(trim(strtolower($value))), $propertyArray, 0, 'multiple');
            }

            $headerArray[$tArray['node_class_property_id']] = $tArray['caption'];
        }

        // $mainPropertyArray - all required header property ids
        $mainPropertyArray = array();
        foreach ($headerArray as $key => $value) {
            $newKey = explode(',', $key);    // handle concat menu
            if (count($newKey) > 1) {
                foreach ($newKey as $nk) {
                    $mainPropertyArray[] = $nk;
                }
            } else {
                $mainPropertyArray[] = $key;
            }
        }
        return array('header' => $headerArray, 'mainProp' => $mainPropertyArray, 'nodeClassId' => $node_class_id);
    }

    /**
     * Fetch all deals
     * Created By: Amit Malakar
     * Date: 26-Dec-2016
     * @param $realArrayNew
     * @param $sortedInstanceIds
     * @param $nodeClassId
     * @param $mainPropertyArray
     * @param $roleArray
     * @return array
     */
    public function getFinalDeals($realArrayNew, $sortedInstanceIds, $nodeClassId, $mainPropertyArray, $roleArray)
    {
        $realArrayNew = array_filter($realArrayNew);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id', 'node_id', 'status'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', $nodeClassId);
        $select->where->IN('nip.node_class_property_id', $mainPropertyArray);
        //$select->where->AND->like('nip.value','%'.$post['searchString'].'%');
        if (count($realArrayNew) > 0) {
            $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
        } else {
            $select->where->AND->IN('ni.node_instance_id', array(''));
        }
        $select->group('ni.node_instance_id');
        $select->group('nip.node_class_property_id');

        if (count($sortedInstanceIds)) {
            if (count($realArrayNew) > 0) {
                $select->order(new Predicate\Expression('FIELD(ni.node_instance_id, ' . implode(',', $realArrayNew) . ')'));
            }
        } else {
            $select->order('ni.node_instance_id DESC');
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $listTempArray = $resultObj->initialize($result)->toArray();

        $listArray = array();
        $temp_instance_id = 0;
        $temp_instance_class_id = 0;
        foreach ($listTempArray as $key => $value) {
            $saveType = $value['status'] == 1 ? 'P' : 'D';
            $index = $value['node_instance_id'] . '~#~' . $value['node_id'] . '~#~' . $roleArray[$value['node_id']] . '~#~' . $saveType;
            $listArray[$index][$value['node_class_property_id']] = $value['value'];
        }
        return $listArray;
    }

    /**
     * Function to get list of Deals
     * Instance Id array, based on role
     * Modified By: Amit Malakar
     * Date: 26-Dec-2016
     * @param array
     * @return array
     */
    public function getDataOfList($post)
    {
        // INTIALIZE VARIABLES
        // function here to get details role based
        $dealDataRes = json_decode($this->getDealDataByRole($post), true);
        $realArrayNew = $dealDataRes['realArrayNew'];
        $temproleArray = $roleArray = $dealDataRes['roleArray'];
        $recordPerPage = $post['recordPerPage'];
        $page = isset($post['page']) ? intval($post['page']) : 1;
        $offset = (intval($recordPerPage) * (intval($page) - 1));
        $realArray = array();

        $instanceTempArray = array();
        $tempArray = array();
        $tempRoleId = $post['roleId'];
        // HEADER COLS & HEADER PROP IDs
        $headerDetailArr = $this->getHeaderColsPropertyIds($post);
        $headerArray = $headerDetailArr['header'];
        $mainPropertyArray = $headerDetailArr['mainProp'];
        $nodeClassId = $headerDetailArr['nodeClassId'];
        $newRealArrayResult = $this->getArchiveDeal($post);
        $newRealArchive = $newRealArrayResult['realArrayNew'];
        $newRoleArchive = $newRealArrayResult['roleArray'];
        $realArrayNew = array_diff($realArrayNew, $newRealArchive);
        $roleArray = array_diff($roleArray, $newRoleArchive);


        // MENU FILTERS
        if ($post['status'] != '' && $post['status'] != 'All') {
            $getStatus = explode("_", $post['status']);
            if (strtolower($getStatus[0]) == "ra") {
                if (strtolower($getStatus[1]) == ROLE_RA) {
                    if (($post['roleId'] == ROLE_RM || $post['roleId'] == ROLE_C || $post['roleId'] == ROLE_D) && strtolower($getStatus[1]) == ROLE_RA) {
                        $post['roleId'] = ROLE_RA;
                    }
                    $getUnAssignDealRes = $this->getRADeal($post);
                    $getUnAssignDealArr = $getUnAssignDealRes['realArrayNew'];
                    $getUnAssignDealRoleArr = $getUnAssignDealRes['roleArray'];
                    $getAssignDealRes = json_decode($this->getDealByMapping($post), true);
                    $getAssignDealArr = $getAssignDealRes['realArrayNew'];
                    $getAssignDealRoleArr = $getAssignDealRes['roleArray'];
                    $RAsArray = array_diff($getUnAssignDealArr, $getAssignDealArr);
                    $roleArray = array_diff($getUnAssignDealRoleArr, $getAssignDealRoleArr);
                    $realArrayNew = $RAsArray;
                    $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                    $roleArray = array_diff($roleArray, $newRoleArchive);
                    //return array($realArrayNew, $newRealArchive);
                } elseif (strtolower($getStatus[1]) == "mine") {
                    $post['roleId'] = $tempRoleId;
                    $getAssignDealRes = json_decode($this->getDealByMapping($post), true);
                    $getAssignDealArr = $getAssignDealRes['realArrayNew'];
                    $getAssignDealRoleArr = $getAssignDealRes['roleArray'];
                    $realArrayNew = $getAssignDealArr;
                    $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                    $roleArray = array_diff($roleArray, $newRoleArchive);
                } elseif (strtolower($getStatus[1]) == "rm/c/d" || strtolower($getStatus[1]) == "c/d") {
                    $post['roleId'] = $tempRoleId;
                    $getUnAssignRMCDDealRes = $this->getRMCDDeal($post);
                    $getUnAssignRMCDDealArr = $getUnAssignRMCDDealRes['realArrayNew'];
                    $getUnAssignRMCDDealRoleArr = $getUnAssignRMCDDealRes['roleArray'];
                    /* $getAssignRADealRes = json_decode($this->getDealByMapping($post),true);
                      $getAssignRADealArr = $getAssignRADealRes['realArrayNew'];
                      $getAssignRADealRoleArr = $getAssignRADealRes['roleArray'];
                      $RMCDsArray = array_intersect($getUnAssignRMCDDealArr, $getAssignRADealArr);
                      $roleArray = array_intersect($getUnAssignRMCDDealRoleArr, $getAssignRADealRoleArr);
                      $realArrayNew = $RMCDsArray; */
                    $realArrayNew = array_diff($getUnAssignRMCDDealArr, $newRealArchive);
                    $roleArray = array_diff($roleArray, $newRoleArchive);
                }
            } elseif (strtolower($getStatus[0]) == "common" || $post['status'] == "Archive") {
                $post['roleId'] = $tempRoleId;
                $realArrayNew = $this->getArchiveDeal($post);
                $roleArray = $realArrayNew['roleArray'];
                $realArrayNew = $realArrayNew['realArrayNew'];
                //$getDealArr = json_decode($this->getDealByMapping($post),true); // Previous sprint 2 code
                //$realAssignArrayNew  = $this->fetchAssignDeal($post); // New code added Sprint 3
                //$realArrayNew = array_intersect($realAssignArrayNew, $realArrayNew);
            } else {
                $post['roleId'] = $tempRoleId;
                $realArrayNew = $this->getDealIdMenuOption($post, $realArrayNew);
                $roleArray = $realArrayNew['roleArray'];
                $realArrayNew = $realArrayNew['realArrayNew'];
                $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                $roleArray = array_diff($roleArray, $newRoleArchive);
            }
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nc' => 'node-class'));
            $select->columns(array('node_class_id'));
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
            $select->where->equalTo('nc.node_id', $post['class_node_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();


            $mainPropId = '';
            $node_class_id = '';
            foreach ($dataArray as $key => $value) {
                if (intval($value['node_class_property_parent_id']) == 0) {
                    $mainPropId = $value['node_class_property_id'];
                    $node_class_id = $value['node_class_id'];
                }
            }
            if ($post['mappingClassNodeid']['classNodeid'] == "") {
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->columns(array('node_class_id', 'node_instance_id'));
                $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
                $select->where->equalTo('ni.node_class_id', $node_class_id);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $tempArrayNew = $resultObj->initialize($result)->toArray();
                /* foreach ($tempArrayNew as $key => $value) {
                  $instanceIdArray[] = $value['node_instance_id'];
                  } */
                $instanceIdArray = array_column($tempArrayNew, 'node_instance_id'); //return $instanceIdArray;
                $realArrayNew = count($instanceIdArray) ? $instanceIdArray : array('');
            }
        }



        //array($getUnAssignRMCDDealRes,$getAssignRADealRes);
        // SEARCH STRING
        if (count(array_filter($realArrayNew)) && isset($post['searchString']) && $post['searchString'] != '') {
            $realArrayNew = $this->getSearchData($realArrayNew, $nodeClassId, $post);
        }

        // HEADER COLUMN FILTERS & SORT
        if (count(array_filter($realArrayNew))) {
            $resHeaderColFilterSort = $this->getHeaderColFilterSort($realArrayNew, $headerArray, $nodeClassId, $post);
            $realArrayNew = $resHeaderColFilterSort['realArrayNew'];
            $sortedInstanceIds = $resHeaderColFilterSort['sortedInstanceIds'];
        }

        // FETCH DEAL QUERY

        $listArray = $this->getFinalDeals($realArrayNew, $sortedInstanceIds, $nodeClassId, $mainPropertyArray, $temproleArray);
        $totalRecord = count($listArray);

        /* For BM ROLE */
        /* Task #274: 3.2.31: Display "Estimated Closing" Date column on deals list screen. Default sorted to nearest close date to furthest close date. */
        if (!isset($post['head_filter']) || empty($post['head_filter'])) {
            //FOR BM ROLE
            if (intval($tempRoleId) == ROLE_BM || intval($tempRoleId) == ROLE_SUPERADMIN) {
                $sort_col = array();
                foreach ($listArray as $key => $row) {
                    $time = strtotime($row[DEAL_EST_CLOSING_DATE_PROPERTY_ID]);
                    $date = getDate($time);
                    $sort_col[$key] = date('Y-m-d', strtotime($date['mon'] . '/' . $date['mday'] . '/' . $date['year']));
                }
                array_multisort($sort_col, SORT_DESC, $listArray);
                if (trim($post['save_deal']) == 'yes') {
                    $pageCount = 0;
                    $chunk_array = array_chunk($listArray, $recordPerPage, true);
                    $search_key = trim($post['new_deal_instance_id']) . '~#~' . trim($post['new_deal_id']) . '~#~' . trim($post['roleId']) . '~#~' . trim($post['save_status']);
                    foreach ($chunk_array as $key => $value) {
                        $pageCount++;
                        if (in_array($search_key, array_keys($value))) {
                            $listArray = $value;
                            break;
                        }
                    }
                }
            }
            //End Here
            //EXCEPT BM ROLE
            //Assigned ones at top and unassigned ones at bottom with Estimated Closing date sorting (latest to oldest).
            if (intval($tempRoleId) != ROLE_BM && intval($tempRoleId) != ROLE_SUPERADMIN) {
                $with_name_assignment_array = array();
                $unassigned_assignment_array = array();
                $blank_name_assignment_array = array();

                //Split a main list array in three categories on behalf of Assignment Column: With Name, Unassigned, Without Name or without unassigned
                foreach ($listArray as $key => $row) {
                    $assignment_column = trim($row['8914']);

                    if (strtolower($assignment_column) == '') {
                        $blank_name_assignment_array[$key] = $listArray[$key];
                    } elseif (strtolower($assignment_column) == 'unassigned') {
                        $unassigned_assignment_array[$key] = $listArray[$key];
                    } elseif (strtolower($assignment_column) != 'unassigned' && strtolower($assignment_column) != '') {
                        $with_name_assignment_array[$key] = $listArray[$key];
                    }
                }

                //Sort Named Assignment Array with Estimated Closing date sorting (latest to oldest)
                if (count($with_name_assignment_array)) {
                    $with_sort_col = array();
                    foreach ($with_name_assignment_array as $withkey => $withvalue) {
                        $with_time = strtotime($withvalue[DEAL_EST_CLOSING_DATE_PROPERTY_ID]);
                        $with_date = getDate($with_time);
                        $with_sort_col[$withkey] = date('Y-m-d', strtotime($with_date['mon'] . '/' . $with_date['mday'] . '/' . $with_date['year']));
                    }
                    array_multisort($with_sort_col, SORT_DESC, $with_name_assignment_array);
                }

                //Sort Unassigned assignment Array with Estimated Closing date sorting (latest to oldest)
                if (count($unassigned_assignment_array)) {
                    $un_sort_col = array();
                    foreach ($unassigned_assignment_array as $unkey => $unvalue) {
                        $un_time = strtotime($unvalue[DEAL_EST_CLOSING_DATE_PROPERTY_ID]);
                        $un_date = getDate($un_time);
                        $un_sort_col[$unkey] = date('Y-m-d', strtotime($un_date['mon'] . '/' . $un_date['mday'] . '/' . $un_date['year']));
                    }
                    array_multisort($un_sort_col, SORT_DESC, $unassigned_assignment_array);
                }

                //Sort blank assignment Array with Estimated Closing date sorting (latest to oldest)
                if (count($blank_name_assignment_array)) {
                    $blank_sort_col = array();
                    foreach ($blank_name_assignment_array as $blankkey => $blankvalue) {
                        $blank_time = strtotime($blankvalue[DEAL_EST_CLOSING_DATE_PROPERTY_ID]);
                        $blank_date = getDate($blank_time);
                        $blank_sort_col[$blankkey] = date('Y-m-d', strtotime($blank_date['mon'] . '/' . $blank_date['mday'] . '/' . $blank_date['year']));
                    }
                    array_multisort($blank_sort_col, SORT_DESC, $blank_name_assignment_array);
                }
                $listArray = array_merge($with_name_assignment_array, $unassigned_assignment_array, $blank_name_assignment_array);
            }
            //End Here
        }
        /* End Here */

        // PAGINATION
        $listArray = array_slice($listArray, $offset, $recordPerPage, true);

        $returnArray = array('header' => $headerArray, 'list' => $listArray, 'totalRecord' => $totalRecord, 'pagination_record_array' => $post['pagination_record_array'], 'pageCount' => $pageCount);

        return json_encode($returnArray);
    }

    public function getRAActorName($dataArr)
    {
        $data = array(
            'role_id' => ROLE_REVENUE_ACCOUNTANT,
            'deal_node_id' => $dataArr['node_id'],
            'node_class_id' => MAPPING_ROLE_ACTOR_CLASS_ID,
        );

        // RA ACTOR AND DEAL ID
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array());
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), '');
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array('actor' => 'value'), 'left');
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni.node_instance_id', array('deal_node_id' => 'value'), 'left');
        //$select->join(array('ni2' => 'node-instance'), 'ni2.node_id = nip2.value', array(), 'left');
        //$select->join(array('nip3' => 'node-instance-property'), 'ni2.node_instance_id = nip3.value', array('name'=>'value'), 'left');
        $select->where->equalTo('ni.node_class_id', $data['node_class_id']);
        $select->where->AND->equalTo('nip.node_class_property_id', ROLE_PID);
        $select->where->AND->equalTo('nip.value', $data['role_id']);
        $select->where->AND->equalTo('nip1.node_class_property_id', ACTOR_PID);
        $select->where->AND->equalTo('nip2.node_class_property_id', DEAL_PID);
        $select->where->AND->equalTo('nip2.value', $data['deal_node_id']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dealActorArr = $resultObj->initialize($result)->toArray();
        // RA ACTOR FIRST & LAST NAME
        if (count($dealActorArr)) {
            // find unique ACTOR ids
            $actorIds = array_unique(array_column($dealActorArr, 'actor'));

            $sql2 = new Sql($this->adapter);
            $select2 = $sql2->select();
            $select2->from(array('ni' => 'node-instance'));
            $select2->columns(array('actor' => 'node_id'));
            $select2->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('full_name' => new Predicate\Expression('GROUP_CONCAT( nip.value SEPARATOR " ")')), '');
            $select2->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
            $select2->where->AND->IN('ni.node_id', $actorIds);
            $select2->where->AND->IN('nip.node_class_property_id', array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME));
            $select2->group('nip.node_instance_id');

            $statement2 = $sql->prepareStatementForSqlObject($select2);
            $result2 = $statement2->execute();
            $resultObj2 = new ResultSet();
            $actorFullNameArr = $resultObj2->initialize($result2)->toArray();

            return $actorFullNameArr[0]['full_name'];
        }

        return 'Unassigned';
    }

    /**
     * Created By: Amit Malakar
     * Date: 13-Fri-17
     * Function to get property value by Instance id
     * @param $data
     * @return string
     */
    public function getInstancePropertyValue($data)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('value'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->where->equalTo('nip.node_instance_id', $data['node_instance_id']);
        $select->where->AND->equalTo('nip.node_class_property_id', $data['node_class_property_id']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resArr = $resultObj->initialize($result)->toArray();
        if ($resArr) {
            return $resArr[0]['value'];
        }

        return '';
    }

    public function updateDealAssignedRAName($data)
    {
        if ($data['node_id'] == '') {
            $data['node_id'] = $this->getTableCols(array('node_id'), 'node-instance', array('node_instance_id'), array($data['node_instance_id']), true)['node_id'];
        } elseif ($data['node_instance_id'] == '') {
            $data['node_instance_id'] = $this->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($data['node_id']), true)['node_instance_id'];
        }
        $actorName = $this->getRAActorName($data);
        $dealDataArr['node_instance_id'] = $data['node_instance_id'];
        $dealDataArr['node_class_property_id'] = DEAL_ASSIGNED_PID;
        $dealDataArr['value'] = $actorName;

        return $this->updateDealPhase($dealDataArr);
    }

    // function here to get details of deals by using Mapping Actor Role Id
    public function getDealDataByRole($post)
    {
        $roleId = $post['roleId'];
//            $roleId = 1399846;
//            $post['roleId'] = 1399846;
        $newArchiveArr = array();
        switch ($roleId) {
            case ROLE_BM:  // code here for BM Role
                $getDealArr = json_decode($this->getDealByMapping($post), true);
                break;
            case ROLE_RA:  // code here for RA Role
                $getStatus = explode("_", $post['status']);
                if (empty($getStatus[1]) && trim($getStatus[0]) != "All") {
                    $getDealRes = json_decode($this->getDealByMapping($post), true);
                } else {
                    $getDealRes = $this->getRADeal($post);
                }

                /* $getStatus = explode("_", $post['status']);
                  if (intval($post['roleId']) == ROLE_RA && ($getStatus[0] != "ra")) {
                  $getAssignDealRes = json_decode($this->getDealByMapping($post),true);
                  $mergeRM = array_merge($getAssignDealRes['realArrayNew'], $getDealRes['realArrayNew']);
                  $uniquDealArr = array_values(array_unique($mergeRM));
                  $mergeRoleRm = array_merge($getAssignDealRes['roleArray'], $getDealRes['roleArray']);
                  $uniquRoleRm = array_values(array_unique($mergeRoleRm));
                  $getDealArr = array('realArrayNew' => $getDealRes['realArrayNew'], 'roleArray' => $getDealRes['roleArray']); // previuos code sprint 2
                  } */
                $getDealArr = array('realArrayNew' => $getDealRes['realArrayNew'], 'roleArray' => $getDealRes['roleArray']); // new code for sprint 3 due to change schenerio
                break;
            case ROLE_RM: // code here for RM Role
                $getDealArr = json_decode($this->getDealByMapping($post), true);
                break;
            case ROLE_C:  // code here for Controller Role
                $getDealArr = json_decode($this->getDealByMapping($post), true);
                break;
            case ROLE_D:  // code here for Director Role
                $getDealArr = json_decode($this->getDealByMapping($post), true);
                break;
            case ROLE_SUPERADMIN:  // Super Admin code here with for BM Role only assign count in all system deal in publish
                $getDealArr = $this->getInstanceListBasedOfClass(DEAL_CLASS);
                break;
            default:  // Administrator
                $getDealArr = json_decode($this->getDealByMapping($post), true);
        }

        //$newArchiveArr = $this->getArchiveDeal($post);

        return json_encode($getDealArr);
    }

    // Work on super admin only display Public deal created by anyone
    public function getInstanceListBasedOfClass($classId)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id'), '');
        $select->where->equalTo('ni.node_class_id', $classId);
        $select->where->equalTo('ni.status', 1);
        $select->group('nip.node_instance_id');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $insArray = $resultObj->initialize($result)->toArray();
        $realArrayNew = array_column($insArray, 'node_instance_id');
        return array('realArrayNew' => $realArrayNew);
    }

    public function getDealByMapping($post)
    {

        // Query use here to fetch record according to role from "Mapping Role Actor" Class
        $classArr = $this->fetchnodeClassCaption($post['mappingClassNodeid']['classNodeid']);
        $classId = $classArr[0]['node_class_id'];
        $mappingArrayNew = json_decode($this->getMappingRoleActorDeal($classId), true);
        $realArray = array();
        // Make new $realArray according key value pair of [ node intance id ]
        foreach ($mappingArrayNew as $key => $value) {
            $realArray[$value['node_instance_id']][strtolower($value['caption'])] = $value['value'];
        }

        $usersDealByRole = json_decode($this->DealByUserRole($realArray, $post), true);
        return json_encode($usersDealByRole);
    }

    // function use here to fetch record according to role from "Mapping Role Actor" Class
    public function getMappingRoleActorDeal($classId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id', 'node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', $classId);
        $select->where->AND->equalTo('ni.status', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $mappingArrayNew = $resultObj->initialize($result)->toArray();
        return json_encode($mappingArrayNew);
    }

    public function DealByUserRole($realArray, $post)
    {


        $roleArray = array();
        $realArrayNew = array();
        $tempArray = array();
        $getStatus = explode("_", $post['status']);

        foreach ($realArray as $key => $value) {
            /*
             * Get Users deal according to their login id and role id
             * Check condition for user login id and role id we
             * get from post data
             */
            $userRoleFlag = true; //set default value of user role flag exists or not.
            if (isset($post['roleId'])) {
                //if user login instance id exits in node-intanse property
                if (intval($post['roleId']) != intval($value['role'])) {
                    $userRoleFlag = false;
                }
            }
            if (intval($post['roleId']) == intval($post['admin_role_id']) || intval($post['roleId']) == 0) {
                //                    $nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                //                    $realArrayNew[] = $nodeInstanceId;
                $roleArray[$value['deal']] = $value['role'];
                $nodeInsIdArr[] = $value['deal'];
            } else {
                if (intval($post['login_user_id']) == intval($value['actor']) && $userRoleFlag) {
                    // $nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                    //  $realArrayNew[] = $nodeInstanceId;
                    $roleArray[$value['deal']] = $value['role'];
                    $nodeInsIdArr[] = $value['deal'];
                }
            }
        }

        //return json_encode($roleArray);
        if (!empty($nodeInsIdArr) && count($nodeInsIdArr) > 0) {
            $tempArrayNew = $this->getNodeinstanceMultipleNodeId($nodeInsIdArr, $post['roleId']);
            $realArrayNew = array_column($tempArrayNew, 'node_instance_id');
        } else {
            $realArrayNew = '';
        }




        /*
         * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
         * No one else should be able to see that Deal.
         */

        if ($post['mappingClassNodeid']['classNodeid'] != "") {
            // This function use to fetch the record from "Deal Creator" Class
            if ($post['roleId'] == ROLE_C || $post['roleId'] == ROLE_D || $post['roleId'] == ROLE_RM) {
                if (($post['roleId'] == ROLE_RM || $post['roleId'] == ROLE_D || $post['roleId'] == ROLE_C) && $post['status'] != 'ra_mine') { // add in sprint3
                    //if(intval($post['roleId']) == ROLE_RM && $post['status']!='ra_mine') { // previous add in sprint 2
                    if (empty($getStatus[1]) && $post['action'] != "open_flyout") {
                        $realArrayNew = $realArrayNew;
                        $roleArray = $roleArray;
                    } elseif ($post['action'] == "open_flyout") {
                        $realArrayNew = $realArrayNew;
                        $roleArray = $roleArray;
                    } else {
                        $newRealArrayResult = $this->getArchiveDeal($post);
                        $newRealArchive = $newRealArrayResult['realArrayNew'];
                        $newRoleArchive = $newRealArrayResult['roleArray'];
                        $realArrayNew = array_diff($realArrayNew, $newRealArchive);
                        $roleArray = array_diff($roleArray, $newRoleArchive);
                        //if ($post['roleId'] == ROLE_RM && strtolower($getStatus[1]) == ROLE_RA) { // previous add in sprint 2
                        if (($post['roleId'] == ROLE_RM || $post['roleId'] == ROLE_D || $post['roleId'] == ROLE_C) && strtolower($getStatus[1]) == ROLE_RA) {  // add in sprint 3
                            $post['roleId'] = ROLE_RA;
                        }
                        $getUnAssignDealRes = $this->getRADeal($post);
                        $getUnAssignDealArr = $getUnAssignDealRes['realArrayNew'];
                        $getUnAssignDealRoleArr = $getUnAssignDealRes['roleArray'];
                        //                    $getAssignDealRes = json_decode($this->getDealByMapping($post),true);
                        //                    $getAssignDealArr = $getAssignDealRes['realArrayNew'];
                        //                    $getAssignDealRoleArr = $getAssignDealRes['roleArray'];
                        //                    $RAsArray = array_diff($getUnAssignDealArr, $getAssignDealArr);
                        //                    $roleArray = array_diff($getUnAssignDealRoleArr, $getAssignDealRoleArr);
                        //                    $realArrayNew = $RAsArray;

                        $realArrayNew = $getUnAssignDealArr;
                        $roleArray = $getUnAssignDealRoleArr;
                    }
                }
                //return $nodeInstanceId = $this->getNodeinstanceIDDetails($realArrayNew);
                $realArrayNew = $realArrayNew;
            } elseif (intval($post['roleId']) == ROLE_BM) {
                $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
                $realArrayNew = $tempArray;
            } elseif (intval($post['roleId']) == ROLE_RA && ($getStatus[0] == "ra")) {
                $realArrayNew = $realArrayNew;
            } else {
                if (intval($post['roleId']) == ROLE_RA && count($realArrayNew) > 0) {
                    $realArrayNew = $realArrayNew;
                } else {
                    $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
                    $realArrayNew = $tempArray;
                    $realArrayNew = array_unique(array_filter(array_values($realArrayNew)));
                }
            }
            if (empty($realArrayNew)) {
                $realArrayNew = array();
                $roleArray = array();
            }
        }



        $returnArray = array('realArrayNew' => $realArrayNew, 'roleArray' => $roleArray);
        return json_encode($returnArray);
    }

    // function use here to fetch the records of RA ROLE
    public function getRADeal($post)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), 'left');
        $select->where->equalTo('ni.node_class_id', PASSED_DEAL_BY_ROLES_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('nip.node_class_property_id', PASSED_DEAL_TR_PID);
        $select->where->AND->equalTo('nip.value', $post['roleId']);
        $select->where->AND->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
        $select->where->AND->equalTo('nip1.value', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $RArrayNew = $resultObj->initialize($result)->toArray();
        $RAArray = array();
        $roleArray = array();
        if (!empty($RArrayNew)) {
            $nodeInsId = $this->getDealRAByInstanceId(array_column($RArrayNew, 'node_instance_id'));
            $instance_id = $this->getNodeinstanceMultipleNodeId($nodeInsId, $post['roleId']);
            $RAArray = array_column($instance_id, 'node_instance_id');
            // Make new $RAArray based on node id
            foreach ($nodeInsId as $key => $value) {
                $roleArray[$value] = ROLE_RA;
            }
        } else {
            $RAArray = array();
            $roleArray = array();
        }
        return array('realArrayNew' => $RAArray, 'roleArray' => $roleArray);
    }

    public function getDealRAByInstanceId($instanceId)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id', 'node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
        $select->where->IN('ni.node_instance_id', $instanceId);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('nip.node_class_property_id', PASSED_DEAL_D_PID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $RADeal = $resultObj->initialize($result)->toArray();
        return array_column($RADeal, 'value');
    }

    public function getNodeinstanceMultipleNodeId($node_id, $roleId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id'));
        $select->where->IN('node_id', $node_id);
        if (!empty($roleId) && $roleId != ROLE_BM) {
            $select->where->AND->equalTo('status', 1);
        }
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getNodeIDMultipleNodeId($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_id'));
        $select->where->IN('node_instance_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /* function here to fetch RM/C/D role based of Deal when RA forward the deal in between RM/C/D */

    public function getRMCDDeal($post)
    {

        $roleAssign = ROLE_RA;
        if ($post['roleId'] == ROLE_RA) {
            $roleAssign = ROLE_RM;
        }
        $roleArr = array(ROLE_RM, ROLE_C, ROLE_D);
        // COMMENT CODE IN sprint 3 new condition

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), 'left');
        $select->where->equalTo('ni.node_class_id', PASSED_DEAL_BY_ROLES_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('nip.node_class_property_id', PASSED_DEAL_TR_PID);
        $select->where->AND->IN('nip.value', $roleArr);
        $select->where->AND->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
        $select->where->AND->equalTo('nip1.value', 1);
        $select->where->AND->equalTo('nip2.node_class_property_id', PASSED_DEAL_FR_PID);
        $select->where->AND->NotequalTo('nip2.value', ROLE_BM); // change for sprint 3
//            if ($post['roleId'] == ROLE_RA) {
//                $select->where->AND->NotequalTo('nip2.value', ROLE_BM);
//            }
//            else if ($post['roleId'] == ROLE_RM) {
//                $select->where->AND->NotequalTo('nip2.value', ROLE_RA);
//            } else if ($post['roleId'] == ROLE_C) {
//                $select->where->AND->NotequalTo('nip2.value', ROLE_RM);
//            } else if ($post['roleId'] == ROLE_D) {
//                $select->where->AND->NotequalTo('nip2.value', ROLE_RA);
//            } else {
//                $select->where->AND->equalTo('nip2.value', $post['roleId']);
//            }  // commment code in sprint 3 new change
//
        //return $select->getSqlString();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $RArrayNew = $resultObj->initialize($result)->toArray();


        if (!empty($RArrayNew)) {
            $RAArray = array();
            $roleArray = array();
            $nodeInsId = $this->getDealRAByInstanceId(array_column($RArrayNew, 'node_instance_id'));
            $instance_id = $this->getNodeinstanceMultipleNodeId($nodeInsId);
            $RAArray = array_column($instance_id, 'node_instance_id');
            // Make new $RAArray based on node id

            foreach ($nodeInsId as $key => $value) {
                $roleArray[$value] = $roleAssign;
            }
        } else {
            $RAArray = "";
            $roleArray = "";
        }

        return array('realArrayNew' => $RAArray, 'roleArray' => $roleArray);
    }

    /* function use here to get deal instance id list beses of option selected */

    public function getDealIdMenuOption($post, $realArrayNew)
    {
        $classArr = $this->fetchnodeClassCaption($post['class_node_id']);
        $classId = $classArr[0]['node_class_id'];
        $instanceIdArray = array();

        // FILTER OTHER
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->where->equalTo('ni.node_class_id', $classId);
        $select->where->AND->equalTo('nip.node_class_property_id', $post['propertyId']);


        if (count($realArrayNew) > 0) {
            $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
        } else {
            if ($post['mappingClassNodeid']['classNodeid'] != "") {
                $select->where->AND->IN('ni.node_instance_id', array(''));
            }
        }
        if (is_numeric($post['status'])) {
            $select->where('FIND_IN_SET(' . $post['status'] . ',rtrim(nip.value))');
        } else {
            $select->where->addPredicate(new Predicate\Expression('LOWER(nip.value) = ?', $post['status']));
        }
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArrayNew = $resultObj->initialize($result)->toArray();

        $instanceIdArray = array_column($tempArrayNew, 'node_instance_id');
        $instance_id = $this->getNodeIDMultipleNodeId($instanceIdArray);
        $instanceIdArray = count($instanceIdArray) ? $instanceIdArray : array('');
        $roleArray = array();
        foreach ($instance_id as $key => $value) {
            $roleArray[$value['node_id']] = $post['roleId'];
        }
        return array('realArrayNew' => $instanceIdArray, 'roleArray' => $roleArray);
    }

    public function getArchiveDeal($post)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array(), 'left');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), 'left');
        $select->where->equalTo('ni.node_class_id', PASSED_DEAL_BY_ROLES_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
        $select->where->AND->equalTo('nip1.value', 3);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $RArrayNew = $resultObj->initialize($result)->toArray();

        $RAArray = array();
        $roleArray = array();
        if (!empty($RArrayNew)) {
            $nodeInsId = $this->getDealRAByInstanceId(array_column($RArrayNew, 'node_instance_id'));
            $instance_id = $this->getNodeinstanceMultipleNodeId($nodeInsId);

            $RAArray = array_column($instance_id, 'node_instance_id');
            // Make new $RAArray based on node id
            foreach ($nodeInsId as $key => $value) {
                $roleArray[$value] = $post['roleId'];
            }
        } else {
            $RAArray = array();
            $roleArray = array();
        }

        return array('realArrayNew' => $RAArray, 'roleArray' => $roleArray);
    }

    public function getDataOfList_old($post)
    {

        $recordPerPage = $post['recordPerPage'];
        $page = isset($post['page']) ? intval($post['page']) : 1;
        $offset = (intval($recordPerPage) * (intval($page) - 1));
        /* code here start to fetch maping class instance list bases of class node id */
        $mappingFlag = false;

        if ($post['mappingClassNodeid']['classNodeid'] != "" && $post['login_user_id'] != "") {
            $mappingFlag = true;
        }

        $roleArray = array();
        $realArray = array();
        $realArrayNew = array();
        $instanceTempArray = array();
        $tempArray = array();
        //return "======================================".$mappingFlag;
        if ($mappingFlag) {
            $classArr = $this->fetchnodeClassCaption($post['mappingClassNodeid']['classNodeid']);
            $classId = $classArr[0]['node_class_id'];
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_id', 'node_instance_id'));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
            $select->where->equalTo('ni.node_class_id', $classId);
            $select->where->AND->equalTo('ni.status', 1);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $mappingArrayNew = $resultObj->initialize($result)->toArray();
            //return $mappingArrayNew;
            /*             * Make new $realArray according key value pair of [ node intance id ]
             * By:- Gaurav Dutt Panchal
             */

            foreach ($mappingArrayNew as $key => $value) {
                $realArray[$value['node_instance_id']][strtolower($value['caption'])] = $value['value'];
            }

            foreach ($realArray as $key => $value) {
                /*
                 * Get Users deal according to their login id and role id
                 * Check condition for user login id and role id we
                 * get from post data
                 * By:- Gaurav Dutt Panchal
                 */
                $userRoleFlag = true; //set default value of user role flag exists or not.
                if (isset($post['roleId'])) {
                    //if user login instance id exits in node-intanse property
                    if (intval($post['roleId']) != intval($value['role'])) {
                        $userRoleFlag = false;
                    }
                }

                if (intval($post['roleId']) == intval($post['admin_role_id']) || intval($post['roleId']) == 0) {
                    $nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                    $realArrayNew[] = $nodeInstanceId;
                    $roleArray[$value['deal']] = $value['role'];
                } else {
                    if (intval($post['login_user_id']) == intval($value['actor']) && $userRoleFlag) {
                        $nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                        $realArrayNew[] = $nodeInstanceId;
                        $roleArray[$value['deal']] = $value['role'];
                    }
                }
            }



            /*
             * Modified By: Divya Rajput
             * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
             * No one else should be able to see that Deal.
             */
            if ($post['mappingClassNodeid']['classNodeid'] != "") {
                $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
                $realArrayNew = $tempArray;
            }
            // return $realArrayNew;
            /* End Here */
        }


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_class_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
        $select->where->equalTo('nc.node_id', $post['class_node_id']);


        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        //return $dataArray;

        $mainPropId = '';
        $node_class_id = '';
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);
        //return $propertyArray;
        $columns = $post['columns'];
        $headerArray = array();
        foreach ($columns as $key => $value) {
            if (strpos($value, '=')) { // different label '='
                // remove separtor if exists
                $separator = '';
                preg_match('/\(([^\)]+)\)/', $value, $match);
                if (count($match) > 1) {
                    $value = ltrim($value, $match[0]);
                    $separator = $match[1];
                }
                // explode with last '>'
                $parts = preg_split('~>(?=[^>]*$)~', $value);
                $parentLabel = $parts[0];
                // explode with '='
                $lblFieldArr = explode("=", $parts[1]);
                $caption = trim($lblFieldArr[0]);
                $allFieldsArr = explode("+", $lblFieldArr[1]);
                // group ncpid with comma
                $ncpId = '';
                foreach ($allFieldsArr as $key => $field) {
                    $splitField = $parentLabel . '> ' . $field;
                    $resArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $splitField))), $propertyArray, 0, 'multiple');
                    $ncpId .= $resArray['node_class_property_id'] . ',';
                }
                $tArray['node_class_property_id'] = rtrim($ncpId, ',');
                $tArray['caption'] = $caption;
            } elseif (preg_match("/>/i", $value)) {
                $tArray = $this->getPropertyIdWithName(array_map('strtolower', array_map("trim", explode(">", $value))), $propertyArray, 0, 'multiple');
            } else {
                $tArray = $this->getPropertyIdWithName(array(trim(strtolower($value))), $propertyArray, 0, 'multiple');
            }

            $headerArray[$tArray['node_class_property_id']] = $tArray['caption'];
        }

        $mainPropertyArray = array();
        foreach ($headerArray as $key => $value) {
            $newKey = explode(',', $key);    // handle concat menu
            if (count($newKey) > 1) {
                foreach ($newKey as $nk) {
                    $mainPropertyArray[] = $nk;
                }
            } else {
                $mainPropertyArray[] = $key;
            }
        }

        // MENU FILTERS
        $instanceIdArray = array();

        if ($post['status'] != '' && $post['status'] != 'All') {
            // FILTER OTHER
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_class_id', 'node_instance_id'));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
            $select->where->equalTo('ni.node_class_id', $node_class_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $post['propertyId']);
            if ($mappingFlag && count($realArrayNew) > 0) {
                $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
            } else {
                if ($mappingFlag && $post['mappingClassNodeid']['classNodeid'] != "") {
                    $select->where->AND->IN('ni.node_instance_id', array(''));
                }
            }
            //$select->where->addPredicate(new Predicate\Expression('LOWER(nip.value) = ?', $post['status']));
            //$select->where->like('nip.value', ''.$post['status'].'');

            if (is_numeric($post['status'])) {
                $select->where('FIND_IN_SET(' . $post['status'] . ',rtrim(nip.value))');
            } else {
                $select->where->addPredicate(new Predicate\Expression('LOWER(nip.value) = ?', $post['status']));
            }
            //$select->where('FIND_IN_SET($post["status"],(?))','LOWER(nip.value)');
            // $select->where->like('RTRIM(nip.value)',''.$post['status'].'');
            //return $select->getSqlstring();
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $tempArrayNew = $resultObj->initialize($result)->toArray();
            //return $tempArrayNew;
            /* foreach ($tempArrayNew as $key => $value) {
              $instanceIdArray[] = $value['node_instance_id'];
              } */
            $instanceIdArray = array_column($tempArrayNew, 'node_instance_id');
            if ($mappingFlag) {
                $realArrayNew = count($instanceIdArray) ? $instanceIdArray : array('');
            } else {
                $instanceIdArray = count($instanceIdArray) ? $instanceIdArray : array('');
            }
        } else {
            if (!count($realArrayNew)) {
                // in case of all
                if ($post['mappingClassNodeid']['classNodeid'] == "") {
                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from(array('ni' => 'node-instance'));
                    $select->columns(array('node_class_id', 'node_instance_id'));
                    $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
                    $select->where->equalTo('ni.node_class_id', $node_class_id);

                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $tempArrayNew = $resultObj->initialize($result)->toArray();

                    /* foreach ($tempArrayNew as $key => $value) {
                      $instanceIdArray[] = $value['node_instance_id'];
                      } */
                    $instanceIdArray = array_column($tempArrayNew, 'node_instance_id'); //return $instanceIdArray;
                    $realArrayNew = count($instanceIdArray) ? $instanceIdArray : array('');
                }
            }
        }

        /*
         * Modified By: Divya Rajput
         * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
         * No one else should be able to see that Deal.
         */
        if ($post['mappingClassNodeid']['classNodeid'] != "") {
            $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $realArrayNew = $tempArray;

            $instanceTempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $instanceIdArray = $instanceTempArray;
        }
        /* End Here */


        if (count(array_filter($realArrayNew)) || count(array_filter($instanceIdArray))) {
            // SEARCH STRING
            $searchFlag = 0;
            if (isset($post['searchString']) && $post['searchString'] != '') {
                $searchFlag = 1;
                $instanceIdSearchArray = array();
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->columns(array('node_class_id', 'node_instance_id'));
                $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
                $select->where->equalTo('ni.node_class_id', $node_class_id);
                if ($mappingFlag && count($realArrayNew) > 0) {
                    $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
                } else {
                    if ($mappingFlag && $post['mappingClassNodeid']['classNodeid'] != "") {
                        $select->where->AND->IN('ni.node_instance_id', array(''));
                    }
                }

                $select->where->AND->like('nip.value', '%' . $post['searchString'] . '%');

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $tempArrayNew = $resultObj->initialize($result)->toArray();

                /* foreach ($tempArrayNew as $key => $value) {
                  $instanceIdSearchArray[] = $value['node_instance_id'];
                  } */
                $instanceIdSearchArray = array_unique(array_column($tempArrayNew, 'node_instance_id'));
                //return $instanceIdSearchArray;

                if (count($instanceIdSearchArray) < 1) {
                    $instanceIdArray = array('');
                } else {
                    if ($post['status'] != '' && $post['status'] != 'All') {
                        $instanceIdArray = array_intersect($instanceIdArray, $instanceIdSearchArray);
                    } else {
                        $instanceIdArray = $instanceIdSearchArray;
                    }
                }

                if ($mappingFlag) {
                    $realArrayNew = $instanceIdArray;
                } else {
                    $instanceIdArray = count($instanceIdArray) ? $instanceIdArray : array('');
                }
            }
        }

        /*
         * Modified By: Divya Rajput
         * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
         * No one else should be able to see that Deal.
         */
        if ($post['mappingClassNodeid']['classNodeid'] != "") {
            $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $realArrayNew = $tempArray;

            $instanceTempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $instanceIdArray = $instanceTempArray;
        }
        /* End Here */



        // COLUMN HEAD FILTERS >>>
        if (count(array_filter($realArrayNew)) || count(array_filter($instanceIdArray))) {
            $filterFlag = 0;
            $sortFlag = 0;
            if (isset($post['head_filter'])) {
                $tempHeaderArray = $headerArray;
                $tempHeaderArray = array_flip(array_map('strtolower', $tempHeaderArray));
                $headFilterArr = $post['head_filter'];
                for ($i = 0; $i < count($headFilterArr); $i++) {
                    if (isset($tempHeaderArray[strtolower($headFilterArr[$i]['col'])])) {
                        $col = strtolower($headFilterArr[$i]['col']);
                        $headFilterArr[$i]['ncpid'] = $tempHeaderArray[$col];
                    }
                }

                $chInsIdArr = array();
                $i = 0;
                $test = array();
                foreach ($headFilterArr as $headFilter) {
                    $ncpid = explode(",", $headFilter['ncpid']);  //3218,3220
                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from(array('ni' => 'node-instance'));
                    $select->columns(array('node_instance_id'));
                    $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
                    $select->where->equalTo('ni.node_class_id', $node_class_id);

                    if (isset($headFilter['filter']) && $headFilter['filter'] != '') {
                        $filterFlag = 1;
                        $filterType = strtolower($headFilter['filter']);
                        $searchString = trim($headFilter['search']);
                        $select->where->IN('nip.node_class_property_id', $ncpid);

                        if ($filterType == 'equals') {
                            $select->where->AND->equalTo('nip.value', $searchString);
                        } elseif ($filterType == 'doest not equal') {
                            $select->where->AND->notEqualTo('nip.value', '%' . $searchString . '%');
                        } elseif ($filterType == 'begins with') {
                            $select->where->AND->like('nip.value', $searchString . '%');
                        } elseif ($filterType == 'ends with') {
                            $select->where->AND->like('nip.value', '%' . $searchString);
                        } elseif ($filterType == 'does not contains') {
                            $select->where->AND->notLike('nip.value', '%' . $searchString . '%');
                        } else {    // contains
                            $select->where->AND->like('nip.value', '%' . $searchString . '%');
                        }
                        $statement = $sql->prepareStatementForSqlObject($select);
                        $result = $statement->execute();
                        $resultObj = new ResultSet();
                        $tempArrayNew = $resultObj->initialize($result)->toArray();
                        $tempChInsIdArr = array_column($tempArrayNew, 'node_instance_id');
                        array_push($test, array_unique($tempChInsIdArr));
                        if ($i == 0) {
                            $chInsIdArr = $tempChInsIdArr;
                        } else {
                            $chInsIdArr = array_intersect($tempChInsIdArr, $chInsIdArr);
                        }
                        $i++;
                    }

                    // COLUMN HEADER SORT >>>
                    if (isset($headFilter['sort']) && $headFilter['sort'] != '') {
                        $sortFlag = 1;
                        $ncpid = $headFilter['ncpid'];
                        if (strpos($ncpid, ',')) {
                            $ncpid = preg_replace('/^([^,]*).*$/', '$1', $ncpid);
                        }
                        $sql2 = new Sql($this->adapter);
                        $select2 = $sql2->select();
                        $select2->from(array('ni' => 'node-instance'));
                        $select2->columns(array('node_instance_id'));
                        $select2->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array(), 'left');
                        $select2->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), 'left');
                        $select2->where->equalTo('ni.node_class_id', $node_class_id);
                        $select2->where->AND->equalTo('nip.node_class_property_id', $ncpid);
                        if (strtolower($headFilter['sort']) == 'sort z - a') {
                            $select2->order(new Expression('CASE WHEN nip.node_class_property_id="' . $ncpid . '" THEN -1 ELSE nip.value end DESC, nip.value DESC'));
                        } else {
                            $select2->order(new Expression('CASE WHEN nip.node_class_property_id="' . $ncpid . '" THEN -1 ELSE nip.value end ASC, nip.value ASC'));
                        }

                        $statement2 = $sql->prepareStatementForSqlObject($select2);
                        $result2 = $statement2->execute();
                        $resultObj2 = new ResultSet();
                        $sortedArr = $resultObj2->initialize($result2)->toArray();
                        $sortedInstanceIds = array_column($sortedArr, 'node_instance_id');
                    }
                    // <<< COLUMN HEADER SORT
                }

                if ($filterFlag && count($chInsIdArr) < 1) {
                    $instanceIdArray = array('');
                    $realArrayNew = array('');
                } elseif ($filterFlag && count($chInsIdArr)) {
                    $realArrayNew = array_intersect($chInsIdArr, $realArrayNew);
                    if ($post['status'] != '' && strtolower($post['status']) != 'all') {
                        $instanceIdArray = array_intersect($chInsIdArr, $instanceIdArray);
                    } else {
                        $instanceIdArray = $chInsIdArr;
                    }
                }
                if ($mappingFlag && $filterFlag && !count($realArrayNew)) {
                    if (count($instanceIdArray)) {
                        $realArrayNew = $instanceIdArray;
                    } else {
                        $realArrayNew = array('');
                        $instanceIdArray = array('');
                    }
                }
            }

            // SORT INSTANCE IDs
            if (count($sortedInstanceIds)) {
                $arr_difference = array_diff($instanceIdArray, $sortedInstanceIds);
                $arr_intersect = array_intersect($sortedInstanceIds, $instanceIdArray);
                $instanceIdArray = array_merge($arr_difference, $arr_intersect);

                $arr_difference = array_diff(array_unique($realArrayNew), $sortedInstanceIds);
                $arr_intersect = array_intersect($sortedInstanceIds, $realArrayNew);
                $realArrayNew = array_merge($arr_difference, $arr_intersect);
            }
            // <<< COLUMN HEAD FILTERS
        }//print_r($instanceIdArray);


        /*
         * Modified By: Divya Rajput
         * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
         * No one else should be able to see that Deal.
         */
        if ($post['mappingClassNodeid']['classNodeid'] != "") {
            $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $realArrayNew = $tempArray;

            $instanceTempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id'], $post['roleId']);
            $instanceIdArray = $instanceTempArray;
        }
        /* End Here */

        //return array(count($realArrayNew),count($instanceIdArray));
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id', 'node_id', 'status'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $select->where->IN('nip.node_class_property_id', $mainPropertyArray);
        //$select->where->AND->like('nip.value','%'.$post['searchString'].'%');

        if ($mappingFlag && count($realArrayNew) > 0) {
            $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
        } elseif (count($instanceIdArray) > 0) {
            $select->where->AND->IN('ni.node_instance_id', $instanceIdArray);
        } else {
            $select->where->AND->IN('ni.node_instance_id', array(''));
        }


        $select->group('ni.node_instance_id');
        $select->group('nip.node_class_property_id');

        if (count($sortedInstanceIds)) {
            if ($mappingFlag && count($realArrayNew) > 0) {
                $select->order(new Predicate\Expression('FIELD(ni.node_instance_id, ' . implode(',', $realArrayNew) . ')'));
            } elseif (count($instanceIdArray) > 0) {
                $select->order(new Predicate\Expression('FIELD(ni.node_instance_id, ' . implode(',', $instanceIdArray) . ')'));
            }
        } else {
            $select->order('ni.node_instance_id DESC');
        }

        //return $sqlStatement= $select->getSqlString();
        //return $sqlStatement;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $listTempArray = $resultObj->initialize($result)->toArray();

        $listArray = array();
        $temp_instance_id = 0;
        $temp_instance_class_id = 0;
        //shanti code starts here.
        foreach ($listTempArray as $key => $value) {
            $saveType = $value['status'] == 1 ? 'P' : 'D';
            $index = $value['node_instance_id'] . '~#~' . $value['node_id'] . '~#~' . $roleArray[$value['node_id']] . '~#~' . $saveType;
            $listArray[$index][$value['node_class_property_id']] = $value['value'];
        }


        //return array($listArray, $post['new_deal_id']);

        $totalRecord = count($listArray);

        /* Task #274: 3.2.31: Display "Estimated Closing" Date column on deals list screen. Default sorted to nearest close date to furthest close date. */
        if ($mappingFlag && isset($post['status']) && trim($post['status']) == 'All' && isset($post['searchString']) && trim($post['searchString']) == '' && !isset($post['head_filter'])) {
            $sort_col = array();
            foreach ($listArray as $key => $row) {
                $time = strtotime($row['6802']);
                $date = getDate($time);
                $sort_col[$key] = date('Y-m-d', strtotime($date['mon'] . '/' . $date['mday'] . '/' . $date['year']));
            }

            array_multisort($sort_col, SORT_DESC, $listArray);

            if (trim($post['save_deal']) == 'yes') {
                $pageCount = 0;
                $chunk_array = array_chunk($listArray, $recordPerPage, true);

                $search_key = trim($post['new_deal_instance_id']) . '~#~' . trim($post['new_deal_id']) . '~#~' . trim($post['roleId']) . '~#~' . trim($post['save_status']); //269288~#~1244569~#~450187~#~D';

                foreach ($chunk_array as $key => $value) {
                    $pageCount++;
                    if (in_array($search_key, array_keys($value))) {
                        $listArray = $value;
                        break;
                    }
                }
            }
        }
        /* End Here */


        /* // AMIT MALAKAR
          // concat listing based on values
          if ($separator != '') {
          $keys = array_keys($headerArray);
          $concatHeaderArr = [];
          foreach ($keys as $ky) {
          if (strpos($ky, ','))
          $concatHeaderArr[] = explode(",", $ky);
          }
          $tempListArray = array();
          foreach ($listArray as $key => $value) {
          $tempListArray[$key] = $value;
          foreach ($concatHeaderArr as $propIds) {
          $concatValue = '';
          $concatKey = '';
          foreach ($propIds as $propId) {
          $concatKey .= $propId . ',';
          $concatValue .= $listArray[$key][$propId] . $separator;
          unset($tempListArray[$key][$propId]);
          }
          $tempListArray[$key][rtrim($concatKey, ',')] = rtrim($concatValue, $separator);
          }
          }
          $listArray = $tempListArray;
          } */
        //return "-->".$valueString;
        //shanti code ends here.
        //return $listArray;
        //$totalRecord = count($listArray);
        $listArray = array_slice($listArray, $offset, $recordPerPage, true);
        return array('header' => $headerArray, 'list' => $listArray, 'totalRecord' => $totalRecord, 'pagination_record_array' => $post['pagination_record_array'], 'pageCount' => $pageCount);
    }

    public function getFullProperty($main, $sub, $realArray)
    {
        foreach ($main as $key => $value) {
            $realArray[$value['node_class_property_id']] = $value;
            $changeArray = array();
            if (is_array($sub[$value['node_class_property_id']])) {
                $realArray[$value['node_class_property_id']]['child'] = $this->getFullProperty($sub[$value['node_class_property_id']], $sub, $changeArray);
            }
        }
        return $realArray;
    }

    public function getPropertyIdWithName($caption, $propertyArray, $counter, $type)
    {
        if ($type == 'multiple') {
            $propName = $caption[$counter];
            $tempArray = array();
            foreach ($propertyArray as $key => $value) {
                if ($propName == $value['caption']) {
                    $index = intval($counter) + 1;
                    if ($caption[$index] != '') {
                        $tempArray = $this->getPropertyIdWithName($caption, $value['child'], $index, $type);
                    } else {
                        $tempArray['node_class_property_id'] = $value['node_class_property_id'];
                        $tempArray['caption'] = $value['caption_old'];
                    }
                }
            }
            return $tempArray;
        }
    }

    public function getFilterCounts($post)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_class_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = nc.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
        $select->where->equalTo('nc.node_id', $post[0]);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $mainPropId = '';
        $node_class_id = '';
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();

        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);

        $columns = html_entity_decode($post[1]);
        $propertyId = '';
        //return array_map('strtolower', array_map("trim", explode(">", $columns)));
        if (preg_match("/>/i", $columns)) {
            $propertyId = $this->getPropertyIdWithNameAgain(array_map('strtolower', array_map("trim", explode(">", $columns))), $propertyArray, 0);
        } else {
            $propertyId = $this->getPropertyIdWithNameAgain(array(trim(strtolower($columns))), $propertyArray, 0);
        }
        //return $propertyId;
        // code start here for check mapping role and actor

        $mappingFlag = false;

        if ($post['mappingClassNodeid'] != "" && $post['login_user_id'] != "") {
            $mappingFlag = true;
        }

        $realArray = array();
        $realArrayNew = array();
        $tempArray = array();

        if ($post['roleId'] == ROLE_SUPERADMIN) {
            $getDealArr = $this->getInstanceListBasedOfClass(DEAL_CLASS);
            $realArrayNew = $getDealArr['realArrayNew'];
        } else {
            if ($mappingFlag) {
                $classArr = $this->fetchnodeClassCaption($post['mappingClassNodeid']);
                $classId = $classArr[0]['node_class_id'];
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->columns(array('node_id', 'node_instance_id'));
                $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
                $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
                $select->where->equalTo('ni.node_class_id', $classId);
                $select->where->AND->equalTo('ni.status', 1);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $mappingArrayNew = $resultObj->initialize($result)->toArray();
                foreach ($mappingArrayNew as $key => $value) {
                    $realArray[$value['node_instance_id']][strtolower($value['caption'])] = $value['value'];
                }
                foreach ($realArray as $key => $value) {
                    /*
                     * Get Users deal according to their login id and role id
                     * Check condition for user login id and role id we
                     * get from post data
                     * By:- Gaurav Dutt Panchal
                     */
                    $userRoleFlag = true; //set default value of user role flag exists or not.
                    if (isset($post['roleId'])) {
                        //if user login instance id exits in node-intanse property
                        if (intval($post['roleId']) != intval($value['role'])) {
                            $userRoleFlag = false;
                        }
                    }

                    if (intval($post['roleId']) == intval($post['admin_role_id']) || intval($post['roleId']) == 0) {
                        //$nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                        /* if($nodeInstanceId > 0){ */
                        //$realArrayNew[] = $nodeInstanceId;
                        $nodeInsIdArr[] = $value['deal'];
                        $roleArray[$value['deal']] = $value['role'];
                        /* } */
                    } else {
                        if (intval($post['login_user_id']) == intval($value['actor']) && $userRoleFlag) {
                            //$nodeInstanceId = $this->getNodeinstanceIDDetails($value['deal']);
                            //$realArrayNew[] = $nodeInstanceId;
                            $nodeInsIdArr[] = $value['deal'];
                            $roleArray[$value['deal']] = $value['role'];
                        }
                    }
                }
                if (!empty($nodeInsIdArr) && count($nodeInsIdArr) > 0) {
                    $tempArrayNew = $this->getNodeinstanceMultipleNodeId($nodeInsIdArr);
                    $realArrayNew = array_column($tempArrayNew, 'node_instance_id');
                }

                /*
                 * Modified By: Divya Rajput
                 * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
                 * No one else should be able to see that Deal.
                 */
                if ($post['mappingClassNodeid']['classNodeid'] != "" && $post['roleId'] == ROLE_BM) {
                    $tempArray = $this->dealShowByRole($realArrayNew, $post['login_user_id']);
                    $realArrayNew = $tempArray;
                }
                /* End Here */
            }
        }

        $listTempArray = array();
        if (trim($post[2]) != '') {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_class_id', 'node_instance_id'));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'), '');
            $select->where->equalTo('ni.node_class_id', $node_class_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $propertyId);
            if ($mappingFlag && count($realArrayNew) > 0 && !empty($realArrayNew)) {
                $select->where->AND->IN('ni.node_instance_id', $realArrayNew);
            }


            //return $select->getSqlstring();
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $listTempArray = $resultObj->initialize($result)->toArray();
        }
        //return $listTempArray;
        return count($listTempArray) . '~$~' . $propertyId;
    }

    public function getPropertyIdWithNameAgain($caption, $propertyArray, $counter)
    {
        $propName = $caption[$counter];
        $propertyId = '';

        foreach ($propertyArray as $key => $value) {
            if ($propName == $value['caption']) {
                $index = intval($counter) + 1;
                if ($caption[$index] != '') {
                    $propertyId = $this->getPropertyIdWithNameAgain($caption, $value['child'], $index);
                } else {
                    $propertyId = $value['node_class_property_id'];
                }
            }
        }
        return $propertyId;
    }

    public function getInstanceViewStructure($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id', 'node_id', 'status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = ni.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
        $select->where->equalTo('ni.node_instance_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray1 = $resultObj->initialize($result)->toArray();

        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_class_property_id', 'value'));
        $select->where->equalTo('nip.node_instance_id', $node_id);
        //return $select->getSqlstring();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray2 = $resultObj->initialize($result)->toArray();

        //shanti code starts here to retrieve the phase of the deal
        //$getlistofInstance = $allRolesArray = $this->getInstanceListOfParticulerClass(782, 'class', 'node_instance_id');
        //$filterKey = $this->searchForId($tempArray1[0]['node_id'], 'DealId', $getlistofInstance); // find the key for the deal in the array.
        //return $select->getSqlstring();
        //working code starts.
        $realtempArray2 = array();
        $new_values = array();
        //return  $tempArray2;
        foreach ($tempArray2 as $value) {
            if (isset($new_values[$value['node_class_property_id']])) {
                $temp = $new_values[$value['node_class_property_id']];
                $value['value'] = html_entity_decode($value['value']);
                $temp['value'] .= CHECKBOX_SEPERATOR . $value['value'];
                $new_values[$value['node_class_property_id']] = $temp;
            } else {
                $value['value'] = html_entity_decode($value['value']);
                $new_values[$value['node_class_property_id']] = $value;
            }
        }

        $tempArray2 = array_values($new_values); // reindex keys
        //return  $new_values;
        foreach ($tempArray2 as $key => $value) {
            $value['value'] = html_entity_decode($value['value']);
            $realtempArray2[$value['node_class_property_id']] = $value['value'];
        }

        foreach ($tempArray1 as $key => $value) {
            $value['value'] = $realtempArray2[$value['node_class_property_id']];
            $tempArray1[$key] = $value;
        }

        //working code ends.//        $realtempArray2 = array();
        //        foreach ($tempArray2 as $key => $value) {
        //            $realtempArray2[$key][$value['node_class_property_id']] = $value['value'];
        //        }
        //        //return  $realtempArray2;
        //        $arrayKeyValues = array_count_values(
        //        array_reduce($realtempArray2, function($result, $inner_array)
        //        {
        //        return array_merge($result, array_keys($inner_array)); // merge arrays one by one
        //        }, []));
        //        //return $tempArray1;
        //        foreach ($tempArray1 as $key => $value) {
        //            // shanti code starts here
        //            //return $value;
        //             //return "helo";
        //
            //            if(trim($realtempArray2[$key][$value['node_class_property_id']])!=""){
        //            if (array_key_exists($value['node_class_property_id'], $arrayKeyValues)) {
        //                $instanceValArr = array();
        //               // return $value['node_class_property_id'].$arrayKeyValues[$value['node_class_property_id']];
        //                if ($arrayKeyValues[$value['node_class_property_id']] > 1) {
        //                    for ($keyArr = 0; $keyArr < $arrayKeyValues[$value['node_class_property_id']]; $keyArr++) {
        //                        $instanceValArr[] = $realtempArray2[$keyArr][$value['node_class_property_id']];
        //                    }
        //                    $instanceVal = implode(CHECKBOX_SEPERATOR, $instanceValArr);
        //                } else {
        //                    foreach($realtempArray2 as $realTemVal){
        //                        foreach($realTemVal as $arrKey => $arrVal){
        //                            if($arrKey==$value['node_class_property_id']){
        //                                $instanceVal=$arrVal;
        //                            }
        //                        }
        //
            //                    }
        //                    //return "shaan".$instanceVal;
        //                   //return "sfsdf".$instanceVal = $realtempArray2[$key][$value['node_class_property_id']];
        //                }
        //            } else {
        //                foreach($realtempArray2 as $realTemVal){
        //                        foreach($realTemVal as $arrKey => $arrVal){
        //                            if($arrKey==$value['node_class_property_id']){
        //                                $instanceVal=$arrVal;
        //                            }
        //                        }
        //
            //                    }
        //            }
        //            }
        //            else{
        //                 $value['value'] = $realtempArray2[$key][$value['node_class_property_id']];
        //
            //            }
        //            //return "helo";
        //            // shanti code ends here here
        //            $value['value'] = $instanceVal;
        //            $tempArray1[$key] = $value;
        //        }
        //return $tempArray1;



        $mainPropId = '';
        $node_class_id = '';
        foreach ($tempArray1 as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($tempArray1 as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);
        //$getlistofInstance[$filterKey]['instance_id'] = $filterKey;
        //$propertyArray['phase'] = $getlistofInstance[$filterKey];
        //return $propertyArray------shanti code;


        $classNodeId = $this->getclassNodeId($node_id); //pass node instance id
        $class_id = $this->getclassId($classNodeId);
        $paramArr = array('node_id');

        $nodeInstanceIdArr = $this->getTableCols($paramArr, 'node-instance', 'node_instance_id', $node_id);
        $instanceArray = $this->getChildClassInstanceView(array($nodeInstanceIdArr['node_id']), $class_id, array());

        $insArrFrm = $this->formatInstanceStructure($instanceArray, array());

        $insArrFrm = $this->arrayCollectSameChilds($insArrFrm);

        $instanceArrayFormatted = array();

        $insIncrement = 0;
        $classTree = '';
        $clsArr = $this->getClassArr($insArrFrm);

        foreach ($insArrFrm as $key => $res) {
            $first_key = key($res);
            $instanceArr = $res[$first_key];

            foreach ($instanceArr as $insKey => $insValue) {
                $parentIns = $insValue['parent'];
                $classTree = '';
                if ($parentIns == '') {
                    $parentIns = '0';
                } else {
                    $classTree = $this->getParentClassIds($clsArr, $parentIns, '');
                }

                $instanceArrayFormatted[$insIncrement]['class'] = $first_key;
                $instanceArrayFormatted[$insIncrement]['class_tree'] = "cls_" . $classTree . $first_key;
                $instanceArrayFormatted[$insIncrement]['id'] = $insKey;
                $instanceArrayFormatted[$insIncrement]['parent_id'] = $parentIns;
                $instanceArrayFormatted[$insIncrement]['instance'] = $insValue;
                $paramArr = array('node_id');
                $nodeInstanceIdArr = $this->getTableCols($paramArr, 'node-instance', 'node_instance_id', $insKey);
                $parentNodeId = $nodeInstanceIdArr['node_id'];
                $hasChildren = false;
                $instanceCount = 0;
                $instanceVal = $this->fetchNodeXY($parentNodeId);
                if ($instanceVal != '') {
                    $instanceArr = explode(",", $instanceVal);
                    $instanceCount = count($instanceArr);
                    if ($instanceCount > 0) {
                        $hasChildren = true;
                    }
                }
                $instanceArrayFormatted[$insIncrement]['hasChildren'] = $hasChildren;
                $instanceArrayFormatted[$insIncrement]['parent_instance_node_id'] = $parentNodeId;
                $instanceArrayFormatted[$insIncrement]['instance_node_id'] = $parentNodeId;


                $insIncrement++;
            }
        }

        $instanceArrayFormatted = $this->buildTree($instanceArrayFormatted, 0);

        $propertyArray['tree'] = $this->traveseTree($instanceArrayFormatted);
        //print_r($instanceArrayFormatted);
        return $propertyArray;
    }

    public function getInstanceEditStructure($instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id', 'status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_id = ni.node_class_id', array('node_class_property_id', 'node_class_property_parent_id', 'caption', 'encrypt_status'), '');
        $select->where->equalTo('ni.node_instance_id', $instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray1 = $resultObj->initialize($result)->toArray();

        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_class_property_id', 'value'));
        $select->where->equalTo('nip.node_instance_id', $instance_id);
        //        $sqlStatement = $select->__toString();
        //        return $sqlStatement;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray2 = $resultObj->initialize($result)->toArray();

        $realtempArray2 = array();
        $new_values = array();
        foreach ($tempArray2 as $value) {
            if (isset($new_values[$value['node_class_property_id']])) {
                $temp = $new_values[$value['node_class_property_id']];
                $value['value'] = html_entity_decode($value['value']);
                $temp['value'] .= CHECKBOX_SEPERATOR . $value['value'];
                $new_values[$value['node_class_property_id']] = $temp;
            } else {
                $value['value'] = html_entity_decode($value['value']);
                $new_values[$value['node_class_property_id']] = $value;
            }
        }

        $tempArray2 = array_values($new_values);
        foreach ($tempArray2 as $key => $value) {
            $realtempArray2[$value['node_class_property_id']] = $value['value'];
        }

        foreach ($tempArray1 as $key => $value) {
            $value['value'] = $realtempArray2[$value['node_class_property_id']];
            $tempArray1[$key] = $value;
        }

        $mainPropId = '';
        $node_class_id = '';
        foreach ($tempArray1 as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == 0) {
                $mainPropId = $value['node_class_property_id'];
                $node_class_id = $value['node_class_id'];
            }
        }

        $mainPropArray = array();
        $subPropArray = array();
        foreach ($tempArray1 as $key => $value) {
            if (intval($value['node_class_property_parent_id']) == intval($mainPropId)) {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $mainPropArray[] = $value;
            } else {
                if (intval($value['encrypt_status']) == 1) {
                    $value['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
                }
                $value['caption_old'] = trim($value['caption']);
                $value['caption'] = trim(strtolower($value['caption']));
                $subPropArray[$value['node_class_property_parent_id']][] = $value;
            }
        }

        $realPropArray = array();
        $propertyArray = $this->getFullProperty($mainPropArray, $subPropArray, $realPropArray);

        return $propertyArray;
    }

    public function deleteInstanceProperty($node_id, $status)
    {
        $data = array();
        $data['status'] = $status;

        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where(array('node_instance_id' => $node_id));
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_instance_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray = $resultObj->initialize($result)->toArray();

        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from('node-instance-property');
        $delete->where->AND->equalTo('node_instance_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
        return array('node_instance_id' => $tempArray[0]['node_instance_id'], 'node_type_id' => $tempArray[0]['node_type_id'], 'node_id' => $tempArray[0]['node_id']);
    }

    public function getInstancesOfOperationRole($class_node_id, $login_role_id = '', $node_instance_id = '')
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_class_id', 'node_instance_id', 'status', 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value' => new Predicate\Expression('GROUP_CONCAT( nip.value )')), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', OPERATION_ROLE_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
        $select->group(array('ni.node_id', 'nip.node_class_property_id'));
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray1 = $resultObj->initialize($result)->toArray();

        /* $realArray = array();
          foreach ($tempArray1 as $key => $value) {
          $realArray[$value['node_id']][$value['caption']] = $value['value'];
          }

          $realArrayNew = array();
          foreach ($realArray as $key => $value) {
          if (intval($value['Mapped For']) == intval($class_node_id))
          $realArrayNew[$key] = $value;
          }
          return $realArrayNew; */
        //return $tempArray1;

        $dealCreatorRoleId = $this->fetchDealCreator($this->getNodeinstanceIDDetails($node_instance_id))[1]['value'];

        foreach ($tempArray1 as $key => $value) {
            $realArray[$value['node_id']][$value['caption']] = $value['value'];
            $realArray[$value['node_id']]['role_node_id'] = $value['node_id'];
            $tempArrBen[$value['node_id']] = $value['node_instance_id'];
        }
        $visibleRoles = explode(',', $realArray[$login_role_id]['Visible Roles']);
        if (intval($dealCreatorRoleId) != intval($login_role_id)) {
            $visibleRoles = explode(',', $realArray[$dealCreatorRoleId]['Visible Roles']);
        }

        if (count($visibleRoles) > 1) {
            $_visibleRoles = array_intersect($tempArrBen, $visibleRoles);
            $_visibleRolesNodeIds = array_keys($_visibleRoles);
            $realArray = array_intersect_key($realArray, array_flip($_visibleRolesNodeIds)); //($_visibleRolesNodeIds,$realArray);
        }
        $tempArray = array();
        foreach ($realArray as $key => $value) {
            $tempArray[$value['Sequence']] = $value;
        }
        ksort($tempArray);


        $newArray = array();
        foreach ($tempArray as $key => $value) {
            if ($key != '') {
                $newArray[$value['role_node_id']] = $value;
            }
        }

        $realArrayNew = array();
        foreach ($newArray as $key => $value) {
            if (intval($value['Mapped For']) == intval($class_node_id)) {
                $realArrayNew[$key] = $value;
            }
        }

        return $realArrayNew;
    }

    public function getActorList($data)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $individualArray = $resultObj->initialize($result)->toArray();

        $userArray = array();
        foreach ($individualArray as $key => $value) {
            $userArray[$value['node_id']][] = $value;
        }



        foreach ($userArray as $node_id => $value) {
            $select = $sql->select();
            $select->from(array('nip' => 'node-x-y-relation'));
            $select->where->equalTo('nip.node_y_id', $node_id);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $newArray = $resultObj->initialize($result)->toArray();

            $tempArray = array();
            foreach ($newArray as $index => $nodes) {
                $tempArray[] = $nodes['node_x_id'];
            }

            $value['sub'] = $tempArray;
            $userArray[$node_id] = $value;
        }



        foreach ($userArray as $node_id => $value) {
            if (count($value['sub']) > 0) {
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
                $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
                $select->where->IN('ni.node_id', $value['sub']);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $subArray = $resultObj->initialize($result)->toArray();

                $subClassArray = array();
                foreach ($subArray as $key => $valueArray) {
                    if (trim(strtolower($valueArray['caption'])) != 'password') {
                        $subClassArray[$valueArray['caption']] = $valueArray['value'];
                    }
                }

                $value['sub'] = $subClassArray;
            }
            $userArray[$node_id] = $value;
        }

        $newUserArray = array();
        foreach ($userArray as $node_id => $valueArray) {
            $tempUserArray = array();
            foreach ($valueArray as $key => $value) {
                if (intval($key) > -1 && trim($value['caption']) != '') {
                    $tempUserArray[$value['caption']] = strtolower($value['value']);
                }
            }

            array_merge($tempUserArray, $valueArray['sub']);
            $newUserArray[$node_id] = array_merge($tempUserArray, $valueArray['sub']);
        }


        $realUserArray = array();
        /* if (strtolower($data['domain_name']) != 'www.pui.com' && strtolower($data['domain_name']) != 'www.prospus.com' && strtolower($data['domain_name']) != 'www.investible.com') {
          foreach ($newUserArray as $key => $value) {
          if (trim(strtolower($data['domain_name'])) == strtolower(trim($value['Domain']))) {
          $value['user_id'] = $key;
          $realUserArray[] = $value;
          }
          }
          } else { */
        foreach ($newUserArray as $key => $value) {
            $value['user_id'] = $key;
            $realUserArray[] = $value;
        }
        //}
        $_serachString = trim(strtolower($data['search_string']));
        $finalUserArray = array();
        foreach ($realUserArray as $key => $value) {
            $_firstName = trim(strtolower($value['First Name']));
            $_emailId = trim(strtolower($value['Email Address']));
            $_lastName = trim(strtolower($value['Last Name']));
            $_userName = $_firstName . ' ' . $_lastName;
            if ((strpos($_userName, $_serachString) !== false) || (strpos($_lastName, $_serachString) !== false) || (strpos($_firstName, $_serachString) !== false) || (strpos($_emailId, $_serachString) !== false)) {
                $finalUserArray[] = $value;
            }
        }

        /* Code By Arvind Soni */
        $userArray = $this->getInstanceListOfParticulerClass(LOCATION_ROLE_DETAILS, 'class', 'node_id');
        $userNewArray = array();
        foreach ($userArray as $key => $value) {
            if ($value['RoleNID'] == $data['search_role_id'] && $value['ActorNID'] != '') {
                $userNewArray[$value['ActorNID']] = $value['ActorNID'];
            }
        }

        $userNewArray = array_keys($userNewArray);

        $userRealArray = array();
        foreach ($finalUserArray as $key => $value) {
            if (in_array($value['user_id'], $userNewArray)) {
                $userRealArray[] = $value;
            }
        }

        return $userRealArray;
    }

    /**
     * Created by Amit Malakar
     * Date: 21-Sep-2016
     * Get all Instance values of a property and it's group count
     * @param $data
     * @return array
     */
    public function getPropertyInstanceWithCount($data)
    {

        $login_user_id = $data['login_user_id'];
        $login_role_id = $data['login_role_id'];
        $mappingArr = $data['list_mapping_id_arr'];

        $realArrayNew = array();
        $data['roleId'] = $login_role_id;
        $roleId = $data['roleId'];
        $data['mappingClassNodeid']['classNodeid'] = $data['list_mapping_id_arr']['classNodeid'];
//            $roleId = 1399846;
//            $post['roleId'] = 1399846;
        /* switch ($roleId) {
          case ROLE_BM:  // code here for BM Role
          $getDealArr = json_decode($this->getDealByMapping($data),true);
          break;
          case ROLE_RA:  // code here for RA Role

          $getDealArr = json_decode($this->getDealByMapping($data),true);

          break;
          case ROLE_RM: // code here for RM Role
          $getDealArr = json_decode($this->getDealByMapping($data),true);
          break;
          case ROLE_C:  // code here for Controller Role
          $getDealArr = json_decode($this->getDealByMapping($data),true);
          break;
          case ROLE_D:  // code here for Director Role
          $getDealArr = json_decode($this->getDealByMapping($data),true);
          break;
          default:  // Administrator
          $getDealArr = json_decode($this->getDealByMapping($data),true);
          } */
        /* End Here */

        if ($data['roleId'] == ROLE_SUPERADMIN) {
            $getDealArr = $this->getInstanceListBasedOfClass(DEAL_CLASS);
        } elseif ($roleId == ROLE_ADMINISTRATOR) {
            $classNodeId = $data['class_node_id'];
            $classIdArr = $this->getTableCols(array('node_class_id'), 'node-class', 'node_id', $classNodeId);
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id'));
            $select->where->equalTo('ni.node_class_id', $classIdArr['node_class_id']);
            $select->where->equalTo('ni.status', 1);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $insArray = $resultObj->initialize($result)->toArray();
            $realArrayNew = array_column($insArray, 'node_instance_id');
            $getDealArr = array('realArrayNew' => $realArrayNew);
        } else {
            $getDealArr = json_decode($this->getDealByMapping($data), true);
        }

        $realArrayNew = array_values(array_unique($getDealArr['realArrayNew']));

        $newRealArrayResult = $this->getArchiveDeal($data);
        $newRealArchive = $newRealArrayResult['realArrayNew'];
        $realArrayNew = array_diff($realArrayNew, $newRealArchive);

        $instanceValuesArr = array();
        if (count($realArrayNew)) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->columns(array('value', 'count' => new Expression('COUNT(*)')));
            $select->from(array('nip' => 'node-instance-property'));
            $select->where->equalTo('nip.node_class_property_id', $data['property_id']);
            $select->where->IN('node_instance_id', $realArrayNew);
            $select->group('value');
            $select->order('value ASC');
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $instanceValuesArr = $resultObj->initialize($result)->toArray();
        }
        $resInstanceValuesArr = array();
        foreach ($instanceValuesArr as $key => $value) {
            if (trim($value['value']) && strtolower($value['value']) != 'archive') {
                $resInstanceValuesArr[] = $value;
            }
        }

        $submenu = $this->getDataOfInstanceTitle($data);
        $valArr = explode('~#~', $submenu);
        $sub_menu = trim($valArr[1]);
        $data = array(
            'class_node_id' => $data['class_node_id'],
            'property_id' => $data['property_id'],
            'list' => $resInstanceValuesArr,
            'selectedClass' => $sub_menu,
        );
        return $data;
    }

    /**
     * Get Actor with role and deal
     * @param type $instanceId
     * @return type
     *
     */
    public function getActorWithRoleAndDeal($instanceId)
    {
        // $sql    = new Sql($this->adapter);
        // $select = $sql->select();
        // $select->from(array('ni' => 'node-instance'));
        // $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
        // $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        // $select->where->equalTo('ni.node_class_id', MAPPING_ROLE_ACTOR_CLASS_ID);
        // //return $select->getSqlString();
        // $statement   = $sql->prepareStatementForSqlObject($select);
        // $result      = $statement->execute();
        // $resultObj   = new ResultSet();
        // $mappedArray = $resultObj->initialize($result)->toArray();
        // $newMappedArray = array();
        // foreach ($mappedArray as $key => $value) {
        //     $newMappedArray[$value['node_instance_id']][strtolower($value['caption'])] = $value['value'];
        //     $userArray = array();
        //     if (trim(strtolower($value['caption'])) == 'actor' && intval($value['value']) > 0) {
        //         $select    = $sql->select();
        //         $select->from(array('ni' => 'node-instance'));
        //         $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
        //         $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        //         $select->where->equalTo('ni.node_id', intval($value['value']));
        //         $statement = $sql->prepareStatementForSqlObject($select);
        //         $result    = $statement->execute();
        //         $resultObj = new ResultSet();
        //         $indiArray = $resultObj->initialize($result)->toArray();
        //         foreach ($indiArray as $key1 => $value1) {
        //             $userArray[str_replace(' ', '_', strtolower($value1['caption']))] = $value1['value'];
        //         }
        //         $newMappedArray[$value['node_instance_id']]['user_name'] = $userArray['first_name'] . " " . $userArray['last_name'];
        //     }
        // }
        // $realMappedArray = array();
        // foreach ($newMappedArray as $key => $value) {
        //     if (intval($instanceId) == intval($value['deal'])) {
        //         $value['node_instance_id']       = $key;
        //         $realMappedArray[$value['role']] = $value;
        //     }
        // }
        //return $realMappedArray;
        //join($name, $on, $columns = self::SQL_STAR, $type = self::JOIN_INNER)
//        $sql    = new Sql($this->adapter);
//        $select = $sql->select();
//        $select->from(array('nip_actor' => 'node-instance-property'));
//        $select->join(array('ncp_actor' => 'node-class-property'), 'ncp_actor.node_class_property_id = nip_actor.node_class_property_id and ncp_actor.caption = "Actor"', array('node_class_property_id', 'value'), '');
//        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
//        $select->where->equalTo('ni.node_class_id', MAPPING_ROLE_ACTOR_CLASS_ID);
//        //return $select->getSqlString();
//
        $sqlQuery = "SELECT `ni`.*,
                        nip_role.value AS role,
                        nip_deal.value AS deal,
                        (SELECT
                            nip_actor.value AS actor
                        FROM
                            `node-instance-property` AS `nip_actor`
                                JOIN
                            `node-class-property` AS `ncp_actor` ON `ncp_actor`.`node_class_property_id` = `nip_actor`.`node_class_property_id`
                                AND ncp_actor.caption = 'Actor'
                        WHERE
                            `nip_actor`.`node_instance_id` = `ni`.`node_instance_id`) AS actor,
                        (SELECT
                            TRIM(CONCAT(nip_first_name.value,
                                            ' ',
                                            nip_last_name.value))
                        FROM
                            `node-instance-property` AS `nip_actor`
                                JOIN
                            `node-class-property` AS `ncp_actor` ON `ncp_actor`.`node_class_property_id` = `nip_actor`.`node_class_property_id`
                                AND ncp_actor.caption = 'Actor'
                                INNER JOIN
                            `node-instance` AS `ni_actor` ON ni_actor.node_id = nip_actor.value
                                INNER JOIN
                            `node-instance-property` AS `nip_first_name` ON `ni_actor`.`node_instance_id` = `nip_first_name`.`node_instance_id`
                                INNER JOIN
                            `node-class-property` AS `ncp_first_name` ON `ncp_first_name`.`node_class_property_id` = `nip_first_name`.`node_class_property_id`
                                AND ncp_first_name.caption = 'First Name'
                                INNER JOIN
                            `node-instance-property` AS `nip_last_name` ON `ni_actor`.`node_instance_id` = `nip_last_name`.`node_instance_id`
                                INNER JOIN
                            `node-class-property` AS `ncp_last_name` ON `ncp_last_name`.`node_class_property_id` = `nip_last_name`.`node_class_property_id`
                                AND ncp_last_name.caption = 'Last Name'
                        WHERE
                            `nip_actor`.`node_instance_id` = `ni`.`node_instance_id`) AS user_name
                    FROM
                        `node-instance` AS `ni`
                        INNER JOIN
                        `node-instance-property` AS `nip_role` ON `nip_role`.`node_instance_id` = `ni`.`node_instance_id`
                        INNER JOIN
                        `node-class-property` AS `ncp_role` ON `ncp_role`.`node_class_property_id` = `nip_role`.`node_class_property_id`
                        AND ncp_role.caption = 'Role'
                        INNER JOIN
                        `node-instance-property` AS `nip_deal` ON `nip_deal`.`node_instance_id` = `ni`.`node_instance_id`
                        INNER JOIN
                        `node-class-property` AS `ncp_deal` ON `ncp_deal`.`node_class_property_id` = `nip_deal`.`node_class_property_id`
                        AND ncp_deal.caption = 'Deal'
                    WHERE
                        `ni`.`node_class_id` = " . MAPPING_ROLE_ACTOR_CLASS_ID . " AND nip_deal.value = " . $instanceId . "";

        $statement = $this->adapter->query($sqlQuery);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $shantiArray = $resultObj->initialize($result)->toArray();
        $realMappedArray = array();

        $userArray = $this->getInstanceListOfParticulerClass(INDIVIDUAL_CLASS_ID, 'class', 'node_id');

        foreach ($shantiArray as $key => $value) {
            if (intval($instanceId) == intval($value['deal'])) {
                $value['node_instance_id'] = $value['node_instance_id'];

                if ($value['actor'] != '') {
                    $userName = $userArray[$value['actor']]['First Name'] . " " . $userArray[$value['actor']]['Last Name'];
                    $value['user_name'] = $userName;
                }

                $realMappedArray[$value['role']] = $value;
            }
        }
        return $realMappedArray;
    }

    /* fetch here node instance id bases of node id */

    public function getNodeinstanceIDDetails($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_instance_id'];
    }

    public function getOperationListByRoleAndDealPaymentType($post, $isOperation = false, $permission = 'true')
    {
        /* If it is counting for showing listing for other role operations */
        if (trim($post['menu_list'])) {
            $isOperation = true;
        }
        /* End Here */

        $operationType = $post['operation_type'];

        $status = $post['status'];
        if ($status == 'all' || $status == 'required') {
            $status = '';
        }
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
        $select->where->equalTo('ni.node_instance_id', $post['deal_node_instance_id']);
        //$select->where->AND->equalTo('nip.node_class_property_id', DEAL_PAYMENT_TYPE_PROPERTY_ID);
        $data = array(DEAL_PAYMENT_TYPE_PROPERTY_ID, DEAL_DESIGNATION_PROPERTY_ID, DEAL_TRADE_IN_PROPERTY_ID); //3229,3230,3231
        $select->where(array('nip.node_class_property_id' => $data));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $typeArray = $resultObj->initialize($result)->toArray();
        //return $typeArray;


        $tradeInType = strtolower($typeArray[0]['value']);
        $designationType = strtolower($typeArray[1]['value']);
        $paymentType = strtolower($typeArray[2]['value']);


        if ($paymentType == 'financing') {
            $paymentType = 'finance';
        }


        $allOpeArray = $_allOpeArray = $this->getInstanceListOfParticulerClass(OPERATION_CLASS_ID, 'class', 'node_id');

        //return $allOpeArray;


        $operationArray = array();


        /* function to get the assuming operation of ids using the class MANAGE_PHASE_SEQUENCE */

        $_dealpCreator = $this->getNodeXOfParticulerClass($post['deal_node_id'], 'node_y_id', 'node_x_id', '778');
        //return $_dealpCreator;

        if (is_array($_dealpCreator) && intval(current($_dealpCreator)['node_x_id']) > 0) {
            $dealCreatorRes = $this->getInstanceListOfParticulerClass(current($_dealpCreator)['node_x_id'], 'node', 'node_id');
        }

        if (current($dealCreatorRes)['Role NID'] == $post['deal_actor_role_node_id']) {
            $allSequenceInsArray = $this->getInstanceListOfParticulerClass(MANAGE_PHASE_SEQUENCE, 'class', 'node_id');
            //return array($dealCreatorRes, $allSequenceInsArray);
            foreach ($allSequenceInsArray as $seqVal) {
                if ($seqVal['Current Version'] == 'Yes' && $seqVal['Deal Creator'] == current($dealCreatorRes)['Role NID']) {
                    $sequenceArr = $seqVal['Assume Operation Of'];
                }
            }
        }
        $sequenceArr = explode(',', $sequenceArr);
        //$sequenceArr = array();
        //return $sequenceArr;
        /* End for geting the assuming operation of code */



        /* end code here */
        //return $post['deal_actor_role_node_id'];
        if ($isOperation) {
            $paymentTypeCounter = 0;
            $generalCounter = 0;
            $completeCounter = 0;
            $incompleteCounter = 0;
            $operationCounter = 0;
            $optionalCounter = 0;
            $requiredCounter = 0;

            /* Start Code By Arvind Soni */
            $cappingCounter = 0;
            $financingCounter = 0;
            $cashCounter = 0;
            $closingCounter = 0;
            $postingCounter = 0;
            /* End Code By Arvind Soni */

            /* For other Role Operations */
            $ownedBy = $viewedBy = $editedBy = 0;
            /**/

            $post['deal_actor_role_node_id'] = isset($post['deal_actor_role_node_id']) ? $post['deal_actor_role_node_id'] : $post['roleId'];
            if ($permission == 'false') {
                return array($post['node_class_property_id'][0] => array($paymentType => $paymentTypeCounter, 'general' => $generalCounter,),
                    MAPPING_DEAL_OP_STATUS => array('complete' => $completeCounter, 'incomplete' => $paymentTypeCounter + $generalCounter - $completeCounter),
                    '7397' => array('Optional' => $optionalCounter, 'Required' => $requiredCounter),
                    '7794' => array('True' => $cappingCounter),
                    '7795' => array('True' => $financingCounter),
                    '7796' => array('True' => $cashCounter),
                    '7797' => array('True' => $closingCounter),
                    '7798' => array('True' => $postingCounter),
                    '8849' => array('read-edit' => $viewedBy + $editedBy),
                    '8850' => array('Owned By' => $ownedBy),
                    '8851' => array('Read By' => $viewedBy),
                    '8852' => array('Edited By' => $editedBy),
                    '1615260' => array('True' => $cappingCounter),
                    '1615270' => array('True' => $financingCounter),
                    '1615280' => array('True' => $cashCounter),
                    '1615290' => array('True' => $closingCounter),
                    '1615300' => array('True' => $postingCounter),
                );
            }
        }
        $completeArr = array();
        $incompleteArr = array();

        $data = array();


        $data['deal_user_role_node_id'] = isset($post['deal_actor_role_node_id']) ? $post['deal_actor_role_node_id'] : $post['roleId'];
        $data['deal_node_instance_id'] = isset($post['deal_node_id']) ? $post['deal_node_id'] : $post['data-node-id'];
        $data['login_user_id'] = $post['login_user_id'];
        if (isset($post['is_mail'])) {
            $data['deal_node_instance_id'] = $post['deal_node_instance_id'];
        }
        /*
         * Start code for getting optional operation for other roles.
         * $roleData = $builderApiObj->getActorWithRoleAndDeal($deal_node_id);
          $roleArray = json_decode($roleData, true); taking reference for getting role,user information on deal
         */
        $deal_node_id = $data['deal_node_instance_id'];
        $roleArray = $this->getActorWithRoleAndDeal($deal_node_id);

        $mappingRoleActorInstanceId = $this->checkMappingDealOperationNodeID($data); //668332
        $mappingRoleActorNodeIdArr = array();

        if ($post['status'] == 'read-edit') {
            foreach ($roleArray as $rolekey => $rolevalue) {
                $data1 = array();
                $data1['deal_user_role_node_id'] = $rolevalue['role'];
                $data1['deal_node_instance_id'] = $deal_node_id;
                $data1['login_user_id'] = $rolevalue['actor'];
                if ($data1['deal_user_role_node_id'] != '' && $data1['deal_node_instance_id'] != '' && $data1['login_user_id'] != '') {
                    $mapping_instance_id = $this->checkMappingDealOperationNodeID($data1);
                    //if($mapping_instance_id!=$mappingRoleActorInstanceId){
                    $mappingRoleActorNodeIdArr[] = $mapping_instance_id;
                    // }
                }
            }
        }



        $userOptData = $this->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');


        $userOptArr = array();
        $role_permission_array = array();
        foreach ($userOptData as $mapDealVal) {
            if ($post['status'] == 'read-edit') {
                if (in_array($mapDealVal['Mapping_Role_Actor'], $mappingRoleActorNodeIdArr)) {
                    $userOptArr[] = $mapDealVal['Operation'];
                }
            } else {
                if ($mapDealVal['Mapping_Role_Actor'] == $mappingRoleActorInstanceId) {
                    $userOptArr[] = $mapDealVal['Operation'];
                }
            }
        }
        // return $mapDealVal;
        // return $mappingRoleActorNodeIdArr;
        ////return $post;
        //TEMP CONDITION TO SHARE SAME INSTANCE OF OPERATION
        // if($data['deal_user_role_node_id']== '454674' || $data['deal_user_role_node_id']== '454679'){
        //     $userOptArr[]=1055112;
        // }
        //return $userOptArr;
        //return $userOptArr;
        // FOR COMPLETE & INCOMPLETE filter or if count is required
        if ($post['propertyId'] == MAPPING_DEAL_OP_STATUS || $isOperation) {
            // OPERATION ACTION MENU - Complete & Incomplete
            $data = array();
            $data['deal_user_role_node_id'] = isset($post['deal_actor_role_node_id']) ? $post['deal_actor_role_node_id'] : $post['roleId'];
            $data['deal_node_instance_id'] = isset($post['deal_node_id']) ? $post['deal_node_id'] : $post['data-node-id'];
            $data['login_user_id'] = $post['login_user_id'];
            //return $data;
            $mappingRoleActorInstanceId = $this->checkMappingDealOperationNodeID($data); //668332
            $delOpData = $this->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');
        }
        //return $allOpeArray;//array(MAPPING_DEAL_OPERATION_CLASS_ID,$delOpData,$mappingRoleActorInstanceId);;
        $sequenceArr[] = $post['deal_actor_role_node_id'];
        if (count($sequenceArr) > 1) {
            foreach ($allOpeArray as $key => $value) {
                if (isset($value['Final Operation']) && $value['Final Operation'] == 'Yes' && $value['Role'] == $sequenceArr[0]) {
                    unset($allOpeArray[$key]);
                }
            }
        }

        $indexCounter = 1;
        //return $sequenceArr;
        //return $allOpeArray;
        $filterArr = array('');

        foreach ($allOpeArray as $key => $value) {
            if ($post['boatLength'] >= 35 && $key == VANTAGE2K_OPERATION_NID) {
                continue;
            } elseif ($post['boatLength'] < 35 && $key == VANTAGE4K_OPERATION_NID) {
                continue;
            }
            $designationArr = explode(CHECKBOX_SEPERATOR, $value['Designation Type']);
            $designationArr = array_map('strtolower', $designationArr);
            $tradeArr = explode(CHECKBOX_SEPERATOR, $value['Trade-in Type']);
            $tradeArr = array_map('strtolower', $tradeArr);

            //$roleArr = explode(",", $value['Role']);

            /* Start Code By Divya Rajput */
            $roleArr = $owned_by = isset($value['Owned By']) ? explode(",", $value['Owned By']) : array();
            $read_by = isset($value['Read By']) ? explode(",", $value['Read By']) : array();
            $edited_by = isset($value['Edited By']) ? explode(",", $value['Edited By']) : array();
            $role_permission_array = array_unique(array_merge($owned_by, $read_by, $edited_by));

            /* End Code By Divya Rajput */

            if ((isset($value['Owned By']) || isset($value['Read By']) || isset($value['Edited By'])) && $value['Icon'] != '450187_dropped') {
                if ($operationType == 'Optional') {
                    $condition = ( ( in_array($tradeInType, $tradeArr, false) || !isset($value['Trade-in Type']) || strtolower($value['Trade-in Type']) == strtolower('unknown') ) && ( in_array($designationType, $designationArr, false) || !isset($value['Designation Type']) || trim($value['Designation Type']) == "" ) && ( trim($value['Operation Type']) == $operationType ) ) ? true : false;
                } else {
                    $operationType = 'Required';
                    $condition = ( ( in_array($tradeInType, $tradeArr, false) || !isset($value['Trade-in Type']) || strtolower($value['Trade-in Type']) == strtolower('unknown') ) && ( in_array($designationType, $designationArr, false) || !isset($value['Designation Type']) || trim($value['Designation Type']) == "" ) && ( trim($value['Operation Type']) == $operationType || !isset($value['Operation Type']) ) ) ? true : false;
                }
                //$_conditionArr[] = $condition;
                //$condition = 1;
                // COMPLETE & INCOMPLETE FILTER
                if ($post['propertyId'] == MAPPING_DEAL_OP_STATUS && in_array($post['roleId'], $owned_by)) {
                    if (count($delOpData)) {
                        foreach ($delOpData as $key1 => $value1) {
                            // not in mapping role actor is incomplete
                            if (($mappingRoleActorInstanceId == $value1['Mapping_Role_Actor'] && $key == $value1['Operation'] && $value1['Status'] == 'Completed' && $condition)) {
                                $completeArr[$key] = $value;
                            } elseif (( ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general') && (!empty(array_intersect($sequenceArr, $roleArr))) && $condition) || in_array($key, $userOptArr)) {
                                $operationArray[$key] = $value;
                            }
                        }
                    } elseif ((($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general') && (!empty(array_intersect($sequenceArr, $roleArr))) && $condition) || in_array($key, $userOptArr)) {
                        $operationArray[$key] = $value;
                    }
                } else {
                    if (!empty($status) && ($status != 'read-edit')/* && in_array($post['roleId'], $owned_by) */) {
                        if ((strtolower($status) == 'general' && strtolower($value['Type']) == strtolower($status) && (!empty(array_intersect($sequenceArr, $roleArr))) && $condition) || (strtolower($status) == 'general' && strtolower($value['Type']) == strtolower($status) && /* $post['deal_actor_role_node_id'] === $value['Role'] */ in_array($post['deal_actor_role_node_id'], $owned_by) && $condition && in_array($key, $userOptArr) )) {
                            $operationArray[$key] = $value;
                        } elseif (($paymentType == strtolower($value['Type']) && strtolower($value['Type']) == strtolower($status) && /* && ($post['deal_actor_role_node_id'] === $value['Role'] || !empty(array_intersect($sequenceArr, $roleArr))) */ ( in_array($post['deal_actor_role_node_id'], $owned_by) || !empty(array_intersect($sequenceArr, $roleArr)) ) && $condition ) || (strtolower($status) == 'general' && strtolower($value['Type']) == strtolower($status) && /* $post['deal_actor_role_node_id'] === $value['Role'] */ in_array($post['deal_actor_role_node_id'], $owned_by) && $condition ) || in_array($key, $userOptArr)) {
                            $operationArray[$key] = $value;
                        } else {
                            if (( (strtolower($status) == "true" && strtolower($value['Type']) == 'general') && (!empty(array_intersect($sequenceArr, $roleArr))) ) && $condition || in_array($key, $userOptArr)) {
                                $operationArray[$key] = $value;
                            } elseif ($paymentType == strtolower($value['Type']) && (strtolower($status) == "true" && strtolower($value['Type']) != 'general') && $condition) {
                                $operationArray[$key] = $value;
                            }
                        }
                    } else {
                        // OPERATION TYPE COUNTS
                        if (( ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general') || (!empty(array_intersect($sequenceArr, $role_permission_array))) /* || (!empty(array_intersect($sequenceArr, $roleArr))) */) && $condition || in_array($key, $userOptArr)) {
                            if (strtolower($status) == 'read-edit' && in_array($post['roleId'], $role_permission_array)) {
                                $operationArray[$key] = $value;
                            } elseif (strtolower($status) != 'read-edit' && in_array($post['roleId'], $owned_by)) {
                                $operationArray[$key] = $value;
                            }
                            if ($isOperation) {
                                /* Start Code By Arvind Soni */
                                if ($value['Capping'] == 'True' && in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    $cappingCounter++;
                                }
                                if ($value['Financing'] == 'True' && in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    $financingCounter++;
                                }
                                if ($value['Cash'] == 'True' && in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    $cashCounter++;
                                }
                                if ($value['Closing'] == 'True' && in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    $closingCounter++;
                                }
                                if ($value['Posting'] == 'True' && in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    $postingCounter++;
                                }

                                /* Start Code By Divya Rajput */
                                if (isset($value['Owned By']) && in_array($post['roleId'], $owned_by)) {
                                    $ownedBy++;
                                }
                                if (isset($value['Read By']) && in_array($post['roleId'], $read_by) && !in_array($post['roleId'], $owned_by)) {
                                    $viewedBy++;
                                }
                                if (isset($value['Edited By']) && in_array($post['roleId'], $edited_by) && !in_array($post['roleId'], $owned_by)) {
                                    $editedBy++;
                                }
                                /* End Code By Divya Rajput */


                                //$indexCounter++;
                                /* End Code By Arvind Soni */
                                if (in_array($post['roleId'], $owned_by) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                                    if ($paymentType == strtolower($value['Type'])) {
                                        $paymentTypeCounter++;
                                    } else {
                                        $generalCounter++;
                                    }
                                }
                            }
                        }
                    }
                }


                // COMPLETE & INCOMPLETE COUNTS
                if ($isOperation && in_array($post['roleId'], $owned_by)) {
                    foreach ($delOpData as $key1 => $value1) {
                        if (($mappingRoleActorInstanceId == $value1['Mapping_Role_Actor'] && $key == $value1['Operation'] && $value1['Status'] == 'Completed') && $condition || ($mappingRoleActorInstanceId == $value1['Mapping_Role_Actor'] && $key == $value1['Operation'] && $value1['Status'] == 'Completed' && in_array($key, $userOptArr) )) {
                            $completeCounter++;
                        }
                    }
                }
            }
        }
        //return $operationArray;
        if ($isOperation || $post['status'] == "required") {
            $tempOperationArray = $operationArray;
            $operationArray = array();
            foreach ($tempOperationArray as $key => $value) {
                if (strtolower($value['Operation Type']) == "required" && in_array($post['roleId'], explode(",", $value['Owned By'])) && ($paymentType == strtolower($value['Type']) || strtolower($value['Type']) == 'general')) {
                    $operationArray[$key] = $value;
                    $requiredCounter++;
                }
            }
        }


        if ($isOperation || $status == "optional") {
            if ($status == "optional") {
                $data = array();
                $data['deal_user_role_node_id'] = isset($post['deal_actor_role_node_id']) ? $post['deal_actor_role_node_id'] : $post['roleId'];
                $data['deal_node_instance_id'] = isset($post['deal_node_id']) ? $post['deal_node_id'] : $post['data-node-id'];
                $data['login_user_id'] = $post['login_user_id'];
                //return $data;
                $mappingRoleActorInstanceId = $this->checkMappingDealOperationNodeID($data); //668332
                $delOpData = $this->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');
            }
            //$delOpData = $userOptData;
            $opetionArray = $operationArray = array();
            foreach ($delOpData as $key => $array) {
                if ($array["Mapping_Role_Actor"] == $mappingRoleActorInstanceId) {
                    $opetionArray[] = $array["Operation"];
                }
            }
            foreach ($allOpeArray as $key => $value) {
                if (in_array($key, $opetionArray) && $value['Operation Type'] == "Optional" && in_array($post['roleId'], explode(",", $value['Owned By']))) {
                    if ($status == "optional") {
                        $operationArray[$key] = $value;
                    }
                    $optionalCounter++;
                }
            }
        }


        // FOR COUNTS
        if ($isOperation) {
            //echo $cappingCounter." - ".$financingCounter." - ".$cashCounter." - ".$closingCounter." - ".$postingCounter;
            return array($post['node_class_property_id'][0] => array($paymentType => $paymentTypeCounter, 'general' => $generalCounter,),
                MAPPING_DEAL_OP_STATUS => array('complete' => $completeCounter, 'incomplete' => $paymentTypeCounter + $generalCounter - $completeCounter,),
                '7397' => array('Optional' => $optionalCounter, 'Required' => $requiredCounter),
                '7794' => array('True' => $cappingCounter),
                '7795' => array('True' => $financingCounter),
                '7796' => array('True' => $cashCounter),
                '7797' => array('True' => $closingCounter),
                '7798' => array('True' => $postingCounter),
                '8849' => array('read-edit' => $viewedBy + $editedBy),
                '8850' => array('Owned By' => $ownedBy),
                '8851' => array('Read By' => $viewedBy), //'read-edit' => $viewedBy + $editedBy,
                '8852' => array('Edited By' => $editedBy),
                '1615260' => array('indexcapping' => $cappingCounter),
                '1615270' => array('indexfinancing' => $financingCounter),
                '1615280' => array('indexcash' => $cashCounter),
                '1615290' => array('indexclosing' => $closingCounter),
                '1615300' => array('indexposting' => $postingCounter),
            );
        }


        // GET INCOMPLETE OPERTATION ARRAY
        foreach ($operationArray as $key => $value) {
            if (!array_key_exists($key, $completeArr) && in_array($post['roleId'], explode(",", $value['Owned By']))) {
                $incompleteArr[$key] = $value;
            }
        }

        if ($post['propertyId'] == MAPPING_DEAL_OP_STATUS) {
            if (strtolower($status) == 'incomplete') {
                $operationArray = $incompleteArr;
            } elseif (strtolower($status) == 'complete') {
                $operationArray = $completeArr;
            }
        }

        //return $operationArray;
        if ($status == "true" && isset($post['fieldname'])) {
            if ($post['fieldname'] == "Cashing") {
                $post['fieldname'] = "Cash";
            }
            foreach ($operationArray as $optKey => $optValue) {
                # code...

                if ($optValue[$post['fieldname']] == "True" && in_array($post['roleId'], explode(",", $optValue['Owned By']))) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        } elseif ($post['fieldname'] == "Mandatory") {
            foreach ($operationArray as $optKey => $optValue) {
                # code...

                if ($optValue['Operation Type'] == "Required" && in_array($post['roleId'], explode(",", $optValue['Owned By']))) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        } elseif (strtolower($post['fieldname']) == 'all' && $post['status'] == "read-edit") {
            foreach ($operationArray as $optKey => $optValue) {
                if (!in_array($post['roleId'], explode(",", $optValue['Owned By'])) && (in_array($post['roleId'], explode(",", $optValue['Read By'])) || in_array($post['roleId'], explode(",", $optValue['Edited By'])))) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        } elseif (strtolower($post['fieldname']) == 'read only' && $post['status'] == "read by") {
            foreach ($operationArray as $optKey => $optValue) {
                if (!in_array($post['roleId'], explode(",", $optValue['Owned By'])) && in_array($post['roleId'], explode(",", $optValue['Read By']))) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        } elseif (strtolower($post['fieldname']) == 'editable' && $post['status'] == "edited by") {
            foreach ($operationArray as $optKey => $optValue) {
                if (!in_array($post['roleId'], explode(",", $optValue['Owned By'])) && in_array($post['roleId'], explode(",", $optValue['Edited By']))) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        } elseif ((empty($post['status']) && empty($post['fieldname'])) || isset($post['fieldname']) && isset($post['status']) && strtolower(trim($post['fieldname'])) == 'all' && strtolower(trim($post['status'])) == "all") {
            foreach ($operationArray as $optKey => $optValue) {
                if (in_array($post['roleId'], explode(",", $optValue['Owned By'])) && ($paymentType == strtolower($optValue['Type']) || strtolower($optValue['Type']) == 'general')) {
                    $operationMain[$optKey] = $optValue;
                }
            }
            $operationArray = $operationMain;
        }

        return array($operationArray, $post);
    }

    public function getInstanceListOfParticulerClass($primaryId, $searchOn, $keyType = "")
    {

        if ($keyType != 'all' && $keyType != 'propertyWithHirerchy') {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id', 'node_id'));
            if ($keyType == 'optional_operation') {
                $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('nip_node_id' => 'node_id', 'node_instance_property_id'));
            } else {
                $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), 'Left');
                $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
            }

            if ($searchOn == 'class') {
                $select->where->equalTo('ni.node_class_id', $primaryId);
            } elseif ($searchOn == 'node') {
                $select->where->equalTo('ni.node_id', $primaryId);
            } elseif ($searchOn == 'instance') {
                $select->where->equalTo('ni.node_instance_id', $primaryId);
            } elseif ($keyType == 'optional_operation') {
                $select->where->IN('ni.' . $searchOn, $primaryId);
            }

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $tempArray = $resultObj->initialize($result)->toArray();
            if ($keyType == 'optional_operation') {
                return $tempArray;
            }
            $dataArray = array();
            foreach ($tempArray as $key => $value) {
                if ($keyType == 'node_instance_id') {
                    if (trim($dataArray[$value['node_instance_id']][$value['caption']]) == '') {
                        $dataArray[$value['node_instance_id']][$value['caption']] = html_entity_decode($value['value']);
                    } else {
                        $dataArray[$value['node_instance_id']][$value['caption']] = $dataArray[$value['node_instance_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                    }
                } elseif ($keyType == 'node_id') {
                    if (trim($dataArray[$value['node_id']][$value['caption']]) == '') {
                        $dataArray[$value['node_id']][$value['caption']] = html_entity_decode($value['value']);
                    } else {
                        $dataArray[$value['node_id']][$value['caption']] = $dataArray[$value['node_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                    }
                }
            }

            if (count($dataArray)) {
                return $dataArray;
            } else {
                return $tempArray;
            }
        } else {
            $classObj = new ClassesTable($this->adapter);
            $node_instance_id = $classObj->getNodeId('node-instance', 'node_id', $primaryId, 'node_instance_id');
            if ($keyType == 'all') {
                $instanceArray = $classObj->getInstanceStructureWithHirerchy($node_instance_id, "fetch_all_prperty_with_parent");
            } elseif ($keyType == 'propertyWithHirerchy') {
                $instanceArray = $classObj->getInstanceStructureWithHirerchyAndProperty($node_instance_id, "fetch_all_prperty_with_parent");
            }

            return $instanceArray;
        }
    }

    /* function here to fetch document data record */

    public function getDocumentData($post)
    {

        $dialogue_class_id = DIALOGUE_CLASS_ID;
        $document_node_id = $post['document_node_id'];
        //$deal_instance_id = $post['deal_instance_node_id'];
        //$deal_user_role_id = $post['deal_user_role_id'];      // role node id
        //$login_user_id = intval($post['login_user_id']);  // login user node id

        /* code start here for check mapping class document instance node id */
        $roleArray = array();
        $realArray = array();
        $realArrayNew = array();
        /* if (isset($post['mapping_class_node_id']) && !empty($post['mapping_class_node_id'])) {
          $mapping_role_actor_node_id = $post['mapping_class_node_id'];
          $classArr                   = $this->fetchnodeClassCaption($mapping_role_actor_node_id);
          $classId                    = $classArr[0]['node_class_id'];
          $sql                        = new Sql($this->adapter);
          $select                     = $sql->select();
          $select->from(array('ni' => 'node-instance'));
          $select->columns(array('node_id', 'node_instance_id'));
          $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'));
          $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
          $select->where->equalTo('ni.node_class_id', $classId);
          $select->where->AND->equalTo('ni.status', 1);

          $statement       = $sql->prepareStatementForSqlObject($select);
          $result          = $statement->execute();
          $resultObj       = new ResultSet();
          $mappingArrayNew = $resultObj->initialize($result)->toArray();

          foreach ($mappingArrayNew as $key => $value) {
          $realArray[$value['node_instance_id']][strtolower($value['caption'])] = $value['value'];
          }
          $documentTitle   = strtolower(DOCUMENT_TITLE);
          $operationArray1 = array();

          foreach ($realArray as $key => $value) {
          if ($value['actor'] != "") {
          if (intval($login_user_id) == intval($value['actor']) && intval($value['role']) == intval($deal_user_role_id) && intval($value['deal']) == intval($deal_instance_id)) {
          if (trim($value[$documentTitle]) == 'N/A') {
          $dataArr['document']      = $document_node_id;
          $dataArr['mapinstanceId'] = $key;
          } else {
          $dataArr['document']      = trim($value[$documentTitle]);
          $dataArr['mapinstanceId'] = '';
          }
          }
          }
          }
          }
         */
        $documentTitle = strtolower(DOCUMENT_TITLE);
        $dataArr['document'] = $document_node_id;

        $instanceArray = $this->getChildClassInstances(array($dataArr['document']), $dialogue_class_id, array());
        $stmtArray = array();

        foreach ($instanceArray as $key => $value) {
            if ($key == 'childs') {
// get dialogue details
                $dialogueInstance = current($value);
            } else {
// get statement details
                $individualInstance = current(array_slice($value, -1, 1));
                foreach (current($value) as $stmt) {
                    if (count($stmt) == 1) {
                        array_push($stmtArray, $stmt);
                    }
                }
            }
        }
        return array($stmtArray, $dataArr);
    }

    private function getChildClassInstances($sub_class_node_id_array, $node_class_id, $temp_array)
    {

        if (count($sub_class_node_id_array) > 0) {
            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {
                $node_instance_id = $this->getNodeinstanceIDDetails($node_sub_class_id);
                if ($node_instance_id) {
                    $sub_class_node_id_new = $this->getNodeXIdFromXYTable($node_sub_class_id);

                    $temp_array['childs'][$node_instance_id] = $this->fetchNodeInstancesProperty($node_instance_id);

                    if (count($sub_class_node_id_new) > 0) {
                        ++$i;
                        $temp_array[$i] = $this->getChildClassInstances($sub_class_node_id_new, $node_class_id, array());
                    }
                }
            }
        }

        return $temp_array;
    }

    /**
     * Created by Awdhesh Soni
     * fetch parent child relation from NODE X Y Table
     * @param $node_id
     * @return array|\Zend\Db\Adapter\Driver\ResultInterface
     */
    public function getNodeXIdFromXYTable($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_y_id', $node_id);
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

    public function getFileRulesetArrayData($css_node_id)
    {

        $fileInsArr = $this->getInstaceIdByNodeXYAndNodeInstan($css_node_id, RULESET_CLASS_ID);
        $rulesetInsArr = array();
        foreach ($fileInsArr as $xyIds) {
            $rulesetId = $xyIds['node_x_id'];
            $temp = array();

// DECLARATIONS
            $decArr = $this->getInstaceIdByNodeXYAndNodeInstan($rulesetId, DECLARATION_CLASS_ID);
            $dec = array();
            foreach ($decArr as $declaration) {
                $decrArray = array_values($this->getNodeInstanceValue($declaration['node_instance_id']));
                if (is_array($decrArray)) {
                    $decLine = "'" . htmlspecialchars_decode(trim($decrArray[0])) . ":" . htmlspecialchars_decode($decrArray[1]) . ";'";
                    $dec[] = $decLine;
                }
            }

// SELECTORS
            $selArr = $this->getInstaceIdByNodeXYAndNodeInstan($rulesetId, SELECTOR_CLASS_ID);
            foreach ($selArr as $selector) {
                $selectorArr = array_values($this->getNodeInstanceValue($selector['node_instance_id']));
                if (is_array($selectorArr)) {
                    $temp[$selector['node_instance_id']]['name'] = htmlspecialchars_decode($selectorArr[0]);
                    $temp[$selector['node_instance_id']]['declaration'] = $dec;
                }
            }
            if (!empty($temp)) {
                $rulesetInsArr[$rulesetId] = $temp;
            }
        }
        return array_filter($rulesetInsArr);
    }

    public function getFileRulesetArray($cssFileNodeId)
    {

        $resultHtml = '';
        $cssArr = $this->getFileRulesetArrayData($cssFileNodeId);
        $fileCssToWrite = $this->getCssFileContent($cssArr);
        if (trim($fileCssToWrite) !== '') {
            $domainUrl = $this->cleanDomainUrlPath($data['domain'], $data['url']);
            $ext = 'css';
            $fileName = "css_node_id_" . $cssFileNodeId . ".{$ext}";
            $fileNameId = "css_node_id_" . $cssFileNodeId;
            $folderPath = ABSO_URL . "data/view_builder/{$domainUrl}";
            $fileLoc = $folderPath . $fileName;
            if (file_exists($fileLoc)) {
                unlink($fileLoc);
            }
            $this->writeToFile($fileCssToWrite, $folderPath, $fileName);

// prepend CSS file LINK to resultHtml
            $cssFilePath = BASE_URL . "data/view_builder{$domainUrl}/{$fileName}";
            $cssLink = '<link rel="stylesheet" href="' . $cssFilePath . '" id="' . $fileNameId . '" type="text/css">';
            $resultHtml = $cssLink . $resultHtml;
        }
        return $resultHtml;
    }

    /*
     * Clean Domain & URL
     * Allow alphanumeric, convert '_' otherwise
     * @param string
     * @return string
     */

    private function cleanDomainUrlPath($domain, $url)
    {
        $newDomain = preg_replace('#^https?://#', '', $domain);
        $newDomain = preg_replace('/[^a-zA-Z0-9]/', '_', $newDomain);

        $newUrl = str_replace($domain, '', $url);
        $newUrl = preg_replace('#^https?://#', '', $newUrl);
        if (strpos($url, $domain) !== false) {
            $newUrl = trim($newUrl, "/");
        }
        $newUrl = preg_replace('/[^a-zA-Z0-9]/', '_', $newUrl);
        $newUrl = preg_replace('!_+!', '_', $newUrl);

        if (trim($newUrl) != '') {
            $domainUrl = "{$newDomain}/{$newUrl}";
        } else {
            $domainUrl = "{$newDomain}";
        }

        return $domainUrl;
    }

    /*
     * Write data to file
     * @param  content of file
     * @param  folderPath, absolute path
     * @param  fileName with extension
     */

    public function writeToFile($content, $folderPath, $fileName)
    {
        $absoFilePath = "$folderPath/$fileName";

        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
        if (is_file($absoFilePath)) {
            $handle = fopen($absoFilePath, "w+"); // exists - read write
        } else {
            $handle = fopen($absoFilePath, "w");  // create it - write
        }
        fwrite($handle, $content);
        fclose($handle);
    }

    /*
     * Get CSS file content
     * @param array
     * @return string
     */

    private function getCssFileContent($mainArr)
    {
        $cssFileData = '';
        foreach ($mainArr as $rulId => $rulValue) {
            $selectorNames = '';
            foreach ($rulValue as $selId => $selValue) {
                $selectorNames .= $selValue['name'] . ", ";
            }
            $selectorNames = rtrim($selectorNames, ', ');
            $declarations = '';
            foreach ($selValue['declaration'] as $dec) {
                $declarations .= "\t" . trim($dec, "'") . "\n";
            }
            $declarations = rtrim($declarations, "\n"); // remove the trailing new line char
            $cssFileData .= $selectorNames . " {\r" . $declarations . "\r}\r";
        }
// ( [a-zA-Z]+\.) - .firefox tr.row-3 td.ExcelTablerow.col-1.fTHLC-left-col.blank
// in case of removing auto-css code

        return $cssFileData;
    }

    public function getNodeInstanceValue($node_instance_id)
    {

        $tempArray = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('value', 'node_class_property_id'));
        $select->from('node-instance-property');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $tempArray1 = array();
        foreach ($dataArray as $data) {
            $tempArray1[$data['node_class_property_id']][] = $data['value'];
        }

        foreach ($dataArray as $data) {
            if (count($tempArray1[$data['node_class_property_id']]) > 1) {
                $tempArray[$data['node_class_property_id']] = implode(CHECKBOX_SEPERATOR, $tempArray1[$data['node_class_property_id']]) . CHECKBOX_SEPERATOR;
            } else {
                $tempArray[$data['node_class_property_id']] = $data['value'];
            }
        }

        return $tempArray;
    }

    public function getNodeInstanceLabelValue($node_instance_id)
    {

        $tempArray = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('value', 'node_class_property_id'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id=nip.node_class_property_id', array('caption'), 'left');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $tempArray1 = array();
        foreach ($dataArray as $data) {
            $tempArray1[$data['node_class_property_id']][] = $data['value'];
        }

        foreach ($dataArray as $data) {
            if (count($tempArray1[$data['node_class_property_id']]) > 1) {
                $tempArray[$data['node_class_property_id']] = implode(CHECKBOX_SEPERATOR, $tempArray1[$data['node_class_property_id']]) . CHECKBOX_SEPERATOR;
            } else {
                $tempArray[$data['node_class_property_id']] = $data['caption'] . '___' . $data['value'];
            }
        }

        return $tempArray;
    }

    public function getInstaceIdByNodeXYAndNodeInstan($node_y_id, $node_class_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id=nxyr.node_x_id', array('node_instance_id'), 'left');
        $select->where->equalTo('nxyr.node_y_id', $node_y_id);
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    /**
     * Created by Awdhesh Soni
     * Instance Property Values for Instance
     * @param $node_instance_id
     * @return array|\Zend\Db\Adapter\Driver\ResultInterface
     */
    public function fetchNodeInstancesProperty($node_instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('node_class_property_id', 'value'));
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->order('node_class_property_id ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $result = array();
        foreach ($dataArray as $data) {
            $result[$data['node_class_property_id']] = $data['value'];
        }

        return $result;
    }

    public function setDocumentStructure($data, $structure)
    {

        $statementData = $data['document']['statementData'];
        $status = $data['saveType'];
        $dialogue_class_id = DIALOGUE_CLASS_ID;
        $document['dialogue_admin'] = json_decode($data['document']['dialogue_admin']);
        $typeArray = $this->getClassList($dialogue_class_id);
        $node_type_id = $typeArray['node_type_id'];
        $node_id = $data['edit_document_node_id'];
        $mapping_ins_id = intval($data['deam_mapping_node_id']);
        $operation_id = intval($data['operation_id']);
        if ($node_id == "") {
            $instance_id = 0;
        } else {
            $instance_id = $this->getNodeinstanceIDDetails($node_id);
        }
        if ($status == 0) {
            $saveType = 'D';
        } else {
            $saveType = 'P';
        }

        $instance_property_array = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $data['document']['dialogue_template'];
        $instance_property_array[3] = $data['document']['dialogue_title'];
        $instance_property_array[4] = $document['dialogue_admin'];
        $instance_property_array[5] = $data['document']['dialogue_timestamp'];


        // DIALOGUE CLASS
        $dialoguePropertiesArray = $this->getProperties($dialogue_class_id);
        foreach ($dialoguePropertiesArray as $key => $dialogueClassProperty) {
            $node_class_property_id[$key] = $dialogueClassProperty['node_class_property_id'];
        }

        $instance_caption = intval($instance_id) > 0 ? $instance_id : 0;



        if (intval($instance_id) > 0) {
            // fetch nod id on behalf on nstance id //
            $instance_caption = $this->getNodeIdDetails('node-instance', 'node_instance_id', $instance_id);
            $node_instance_id_dialogue = $this->createDataInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType, $instance_id);
            // update instance property //
            $this->updateSubInstancePropertyDataAgain($instance_property_array, $node_type_id, $node_instance_id_dialogue, $node_class_property_id);
            // ============
            $node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $instance_id);
            $node_x_id_array = $this->getNodeXIdFromXYTable($node_id);
            $individual_instance_id = count($node_x_id_array) ? array_pop($node_x_id_array) : '';
            // ============
            $node_id_dialogue = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);
        } else {
            $node_instance_id_dialogue = $this->createDataInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType);
            $this->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_dialogue, $node_type_id);
            $node_instance_id_dialogue_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);

            $data['value'][2] = $node_instance_id_dialogue_node_id;

            // Amit/Awdhesh for issue
            // Date: 02-Dec-2016
            // Op. detail instance overwritten on Doc save
            $allOpeArray = $this->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
            $formId = '';
            $documentId = '';
            foreach ($allOpeArray as $key => $value) {
                if (intval($value['Mapping_Role_Actor']) == intval($data['deal_mapping_node_id']) && intval($value['Operation']) == intval($data['operation_id'])) {
                    $formId = $value['Form'];
                    $documentId = $value['Document'];
                    $nodeInstanceNodeId = $key;
                }
            }
            $nodeInstanceRes = $this->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($nodeInstanceNodeId));
            $nodeInstanceId = $nodeInstanceRes['node_instance_id'];

            if (intval($nodeInstanceId) > 0) {   // FormID exist so update
                //return array(array($node_instance_id_dialogue_node_id), $node_type_id, $nodeInstanceId, array(PDF_PROPERTY_ID));
                $this->updateSubInstancePropertyDataAgain(array($node_instance_id_dialogue_node_id), $node_type_id, $nodeInstanceId, array(PDF_PROPERTY_ID));
            } else {    // FormId don't exist so create
                /* insert code add here add data in Mapping Deal Operation */
                $instanceArray = $this->createInstanceOfClass($data['node_class_id'], $status);
                $this->createInstanceProperty($data['node_class_property_id'], $data['value'], $instanceArray['node_instance_id'], $instanceArray['node_type_id'], $data['is_email'], "", "");
                /* end code here */
            }
        }


        // STATEMENT SUBCLASS
        //$dialogue_struc = $this->getClassPropertyStructure($dialogue_class_id);
        $statement_class_id = STATEMENT_CLASS_ID;
        $statementPropertiesArray = $this->getProperties($statement_class_id);
        $statement_node_x_id_array = $this->getInstaceIdByNodeXYAndNodeInstance($node_id, $statement_class_id);

        foreach ($statementPropertiesArray as $key => $statementClassProperty) {
            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
        }


        if (strtolower($data['document']['dialogue_template']) == "canvas") {
            $classObj = new ClassesTable($this->adapter);
            $instance_property_array = array();
            $instance_property_array[0] = "";
            $instance_property_array[1] = "";
            $instance_property_array[2] = "";
            $instance_property_array[3] = $statementData;
            $instance_property_array[4] = "";
            if (isset($statement_node_x_id_array[0]['node_x_id']) && $statement_node_x_id_array[0]['node_x_id'] > 0) {
                $node_instance_id_stmt = $classObj->getinstanceDetailsByNodeId($statement_node_x_id_array[0]['node_x_id']);
            } else {
                $node_instance_id_stmt = 0;
            }

            if ($node_instance_id_stmt > 0) {
                //update
                $node_instance_id = $classObj->createInstance($statement_node_x_id_array[$key]['node_x_id'], $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                $classObj->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id_stmt, $node_class_property_id_stmt);
            } else {
                //insert
                $instance_caption = $node_instance_id_stmt;
                $node_instance_id = $classObj->createInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                // create new instance property //
                $classObj->createInstanceProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
                //get node_id of node instance table for series class
                $node_id_dialogue = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);
                $stmt_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id);
                $stmt_node_ids = "," . $stmt_node_id;
                $this->saveNodeXRelation($node_id_dialogue, $stmt_node_ids);
            }
        } else {
            foreach ($statementData as $key => $stmt) {
                $instance_property_array = array();
                $instance_property_array[0] = "";
                $instance_property_array[1] = $stmt['statement_actorauthor'];
                $instance_property_array[2] = $stmt['statement_type'];

                preg_match('/(?<=src=")([^"]+)(?=")/', $stmt['statement'], $match);
                if (isset($match[0])) {
                    $newUrl = strstr($match[0], 'files/');
                    $updatedPara = preg_replace('/(?<=src=")([^"]+)(?=")/', $newUrl, $stmt['statement']);
                } else {
                    $updatedPara = $stmt['statement'];
                }
                $instance_property_array[3] = $updatedPara;
                $instance_property_array[4] = $stmt['statement_timestamp'];

                if (isset($statement_node_x_id_array[$key]['node_x_id']) && $statement_node_x_id_array[$key]['node_x_id'] > 0) {
                    $node_instance_id_stmt = $this->getNodeinstanceIDDetails($statement_node_x_id_array[$key]['node_x_id']);
                } else {
                    $node_instance_id_stmt = 0;
                }
                /*
                 * Added by awdhesh Soni
                 * On Date 20th July 2016
                 * in case of update document statement instances
                 */

                // create new/update Statement Instance
                if ($node_instance_id_stmt > 0) {
                    //update
                    $node_instance_id = $this->createDataInstance($statement_node_x_id_array[$key]['node_x_id'], $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                    $this->updateSubInstancePropertyDataAgain($instance_property_array, $node_type_id, $node_instance_id_stmt, $node_class_property_id_stmt);
                    $stmt_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id);
                } else {
                    //insert
                    $instance_caption = $node_instance_id_stmt;
                    $node_instance_id = $this->createDataInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                    // create new instance property //
                    $this->createInstanceProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
                    //get node_id of node instance table for series class
                    $node_id_dialogue = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);
                    $stmt_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id);
                    $stmt_node_ids = "," . $stmt_node_id;
                    $this->saveNodeXRelation($node_id_dialogue, $stmt_node_ids);
                    //$data['value'][2] = $stmt_node_id;
                }
            }
        }
        return $node_id_dialogue;
    }

    public function createDataInstance($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id)
    {

        $data['caption'] = $this->mc_encrypt($instance_caption, ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;

        if ($saveType == 'D') {
            $data['status'] = 0;
        } else {
            $data['status'] = 1;
        }
        $sql = new Sql($this->adapter);
        if (intval($node_instance_id) > 0) {
            $query = $sql->update();
            $query->table('node-instance');
            $query->set($data);
            $query->where(array('node_instance_id' => $node_instance_id));
        } else {
            $data['node_id'] = $this->createNode();
            if ($data['caption'] == "") {
                $data['caption'] = $data['node_id'];
            }
            $data['node_class_id'] = $node_class_id;
            $query = $sql->insert('node-instance');
            $query->values($data);
        }

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);

        if (empty($node_instance_id)) {
            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
        }

        return $node_instance_id;
    }

    public function getInstaceIdByNodeXYAndNodeInstance($node_y_id, $node_class_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id=nxyr.node_x_id', array('node_instance_id'), 'left');
        $select->where->equalTo('nxyr.node_y_id', $node_y_id);
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    public function updateSubInstancePropertyDataAgain($instance_property_id, $node_type_id, $node_instance_id, $node_class_property_id)
    {
        foreach ($instance_property_id as $key => $value) {
            $checkInstanceFromChat = $this->getChatProperyDetails($node_instance_id, $node_class_property_id[$key]);

            if (!empty($checkInstanceFromChat)) {
                $newValue = trim($this->mc_encrypt($value, ENCRYPTION_KEY));
                if (substr($newValue, -3) == CHECKBOX_SEPERATOR) {
                    $sql = new Sql($this->adapter);
                    $delete = $sql->delete();
                    $delete->from('node-instance-property');
                    $delete->where->equalTo('node_instance_id', $node_instance_id);
                    $delete->where->AND->equalTo('node_class_property_id', $node_class_property_id[$key]);
                    $statement = $sql->prepareStatementForSqlObject($delete);
                    $result = $statement->execute();


                    $newValArray = explode(CHECKBOX_SEPERATOR, $newValue);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data = array();

                            $data['value'] = htmlspecialchars($v);
                            $data['encrypt_status'] = ENCRYPTION_STATUS;
                            $data['node_instance_id'] = $node_instance_id;
                            $data['node_id'] = $this->createNode();
                            $data['node_type_id'] = $node_type_id;
                            $data['node_class_property_id'] = $node_class_property_id[$key];

                            $sql = new Sql($this->adapter);
                            $query = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement = $sql->prepareStatementForSqlObject($query);
                            $result = $statement->execute();
                        }
                    }
                } else {
                    $data = array();
                    /*
                     * htmlspecialchars added by Awdhesh,
                     * ON date: 20th July 2016
                     */
                    $data['value'] = htmlspecialchars($newValue);
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_type_id'] = $node_type_id;
                    $sql = new Sql($this->adapter);
                    $query = $sql->update();
                    $query->table('node-instance-property');
                    $query->set($data);
                    $query->where(array('node_instance_id' => $node_instance_id));
                    $query->where(array('node_class_property_id' => $node_class_property_id[$key]));
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $resultObj->initialize($result);
                }
            } else {
                if (trim($value) != "") {
                    $data = array();
                    $data1['value'] = trim($this->mc_encrypt(htmlspecialchars($value), ENCRYPTION_KEY));
                    $data1['encrypt_status'] = ENCRYPTION_STATUS;
                    $data1['node_instance_id'] = $node_instance_id;
                    $data1['node_id'] = $this->createNode();
                    $data1['node_type_id'] = $node_type_id;
                    $data1['node_class_property_id'] = $node_class_property_id[$key];
                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-instance-property');

                    $query->values($data1);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $resultObj->initialize($result);
                }
            }
        }
    }

    public function getChatProperyDetails($node_instance_id, $nodeClassProperty)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('node_id', 'node_class_property_id'));
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->where->AND->equalTo('node_class_property_id', $nodeClassProperty);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /* code here to save node x data */

    public function saveNodeXRelation($parent_id, $nodexArr)
    {
        $newArray = explode(',', $nodexArr);
        $newArray = array_unique($newArray);

        foreach ($newArray as $key => $val) {
            if ($parent_id != $val) {
                if (trim($val) != "") {
                    $data['node_y_id'] = $parent_id;
                    $data['node_x_id'] = $val;

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-x-y-relation');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                }
            }
        }
    }

    public function getNodeIdDetails($table, $column, $value)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from($table);
        $select->where->equalTo($column, intval($value));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        return intval($dataArray[0]['node_id']);
    }

    /**
     *  Function to store notification in database
     *  Created By Arti Sharma
     */
    public function saveStatementNotification($statement_instance_node_id, $user_instance_node_id, $dialog_instance_node_id)
    {
        $notification_node_class_id = NOTIFICATION_CLASS_ID;
        $data['caption'] = $this->mc_encrypt($this->getLastNumber('node', 'node_id'), ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = 2;
        $data['node_id'] = $this->createNode();
        $data['node_class_id'] = $notification_node_class_id;
        $data['status'] = '1';

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
        if ($node_instance_id) {
// create xy relation between statement and notification
            $user_xy_id = $this->createXYRelation($statement_instance_node_id, $data['node_id']);

//get node class property ids
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ncp' => 'node-class-property'));
            $select->columns(array('node_class_property_id'));
            $select->where->AND->equalTo('ncp.node_class_id', $notification_node_class_id);
            $select->where->AND->NotequalTo('ncp.node_class_property_parent_id', '0');

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $property_array = $resultObj->initialize($result)->toArray();


            $ary = array('0' => $user_instance_node_id, '1' => 0, '2' => $dialog_instance_node_id);
            $i = 0;
            foreach ($property_array as $value) {
                $dataval['node_instance_id'] = $node_instance_id;
                $dataval['node_class_property_id'] = $value['node_class_property_id'];
                $dataval['node_id'] = $this->createNode();
                $dataval['node_type_id'] = 2;
                $dataval['value'] = $ary[$i];
                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-instance-property');
                $query->values($dataval);
//return $query->getSqlstring();die;
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
                $i++;
            }
        }
    }

    /**
     * Function to get all the user associated with the dialogue except logged in user
     * Arti Sharma
     */
    public function getAllDilaogueUser($dialogue_instance_node_id, $user_instance_node_id)
    {
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        //get all the user associated with dialogue user
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('user_instance_node_id' => 'node_id'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array());
        $select->where->equalTo('xy.node_y_id', $dialogue_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
        $select->where->AND->notequalTo('xy.node_x_id', $user_instance_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        //return $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $userArray = $resultObj->initialize($result)->toArray();
    }

    /**
     * Function to get all the notifcation count
     * Arti Sharma
     */
    public function getNotificationCount($dialog_instance_node_id, $user_instance_node_id)
    {
        $notification_node_class_id = NOTIFICATION_CLASS_ID;

        // get all notification count
        // get all notification count

        /*  $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->from(array('ni' => 'node-instance'));
          $select->columns(array('notification_instance_node_id' => 'node_id','node_instance_id'));
          $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'));
          $select->where->equalTo('ni.node_class_id', $notification_node_class_id);
          $select->where->AND->equalTo('nip.value', $dialog_instance_node_id);
          $select->where->AND->equalTo('ni.status', 1);
          $statement = $sql->prepareStatementForSqlObject($select);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $notificationArray = $resultObj->initialize($result)->toArray(); */


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->where->equalTo('ni.node_class_id', $notification_node_class_id);
        $select->where->AND->equalTo('nip.value', $dialog_instance_node_id);
        $select->where->AND->equalTo('ni.status', 1);

        //  return $select->getSqlstring();die;

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $notificationArray = $resultObj->initialize($result)->toArray();
        $node_array = '';
        foreach ($notificationArray as $vals) {
            $node_id = $vals['node_id'];

            $node_array .= $node_id . ",";
        }

        $node_array = rtrim($node_array, ', ');
        $np = explode(",", $node_array);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('notification_instance_node_id' => "node_id"));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->where->equalTo('ni.node_class_id', $notification_node_class_id);
        $select->where->AND->equalTo('nip.value', $user_instance_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->IN('ni.node_id', $np);

        //return $select->getSqlstring();die;
        //return $select->getSqlstring();die;

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $tot_results = count($result);


        //return $countAry = $resultObj->initialize($result)->toArray();
    }

    /**
     * Function to delete all the notification count of user once he reads
     * Arti Sharma
     */
    public function deleteNotificationCount($dialog_data)
    {
        $notification_node_class_id = NOTIFICATION_CLASS_ID;
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $dialog_instance_node_id = $dialog_data['dialog_instance_node_id'];


        // where value associated with dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->where->equalTo('ni.node_class_id', $notification_node_class_id);
        $select->where->AND->equalTo('nip.value', $dialog_instance_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        //  return $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $notificationArray = $resultObj->initialize($result)->toArray();
        $node_array = '';
        foreach ($notificationArray as $vals) {
            $node_id = $vals['node_id'];

            $node_array .= $node_id . ",";
        }
        $node_array = rtrim($node_array, ', ');
        $np = explode(",", $node_array);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id' => "node_instance_id", 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('value' => 'value'));
        $select->where->equalTo('ni.node_class_id', $notification_node_class_id);
        $select->where->AND->equalTo('nip.value', $user_instance_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->IN('ni.node_id', $np);
        //return $select->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $Array = $resultObj->initialize($result)->toArray();

        foreach ($Array as $value) {
            $sql = new Sql($this->adapter);
            $delete = $sql->delete();
            $delete->from('node-x-y-relation');
            $delete->where->equalTo('node_x_id', $value['node_id']);
            //  return  $delete->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($delete);
            $result = $statement->execute();


            $sql = new Sql($this->adapter);
            $delete = $sql->delete();
            $delete->from('node-instance-property');
            $delete->where->equalTo('node_instance_id', $value['node_instance_id']);
            //return  $delete->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($delete);
            $result = $statement->execute();

            $sql = new Sql($this->adapter);
            $delete = $sql->delete();
            $delete->from('node-instance');
            $delete->where->equalTo('node_instance_id', $value['node_instance_id']);
            //  return  $delete->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($delete);
            $result = $statement->execute();
        }
    }

    public function deleteDilaogueData($dialog_data)
    {

        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $dialog_instance_node_id = $dialog_data['dialog_instance_node_id'];
        $data['status'] = 2;
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where(array('node_id' => $dialog_instance_node_id));
        // return  $query->getSqlstring();die;
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $affectedRows = $result->getAffectedRows();
    }

    /**
     * Function to get all the user present in the system
     * Created By Arti Sharma
     */
    public function getAllSystemActorDetail($dialog_data)
    {
        $user_instance_node_id = $dialog_data['user_instance_node_id'];
        $user_class_node_id = INDIVIDUAL_CLASS_ID;

        //get all the user
        $sql = "SELECT ni.node_instance_id, ni.node_id, nip.value, nip.node_class_property_id FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `ni`.`node_class_id` = '632' AND (`nip`.`node_class_property_id` = '2921' OR `nip`.`node_class_property_id` = '2922' ) AND `ni`.`status` = '1'";

        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $userArray = $resultObj->initialize($result)->toArray();
    }

    /**
     * Function to get all the courses of logged in user
     * Called from dialogue.js  function--- getAllCourse();
     */
    public function getAllCourseByUser($variable_data)
    {
        $user_instance_node_id = $variable_data['user_instance_node_id'];
        $final_ary = array();

        //return $this->getAllCoursesInstanceDb($user_instance_node_id);
        // get all the instances of dialogue by user
        $dialog_ary = $this->getUserCourseFromFile($user_instance_node_id);
        if (!empty($dialog_ary)) {
            $temp = explode(',', $dialog_ary[0]['course_instance_node_id']);
            for ($i = 0; $i < count($temp); $i++) {
                if ($temp[$i]) {
                    $dialog_info = $this->getCourseInfoFromFile($temp[$i], $user_instance_node_id);
                    if (!empty($dialog_info)) {
                        $final_ary[$temp[$i]] = $dialog_info[0];
                    }
                }
            }
        }
        return $final_ary;
    }

    /**
     * COURSE INSTANCE GET FROM DATABASE
     * Function to get all the courses associated with the user from database
     */
    public function getAllCoursesInstanceDb($user_instance_node_id)
    {
        $course_node_class_id = COURSE_CLASS_ID;

        // get all the course associated with user
        /*  $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->from(array('ni' => 'node-instance'));
          $select->columns(array('node_instance_id'));
          $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('course_instance_node_id' => 'node_y_id'));
          $select->where->equalTo('xy.node_x_id', $user_instance_node_id);
          $select->where->AND->equalTo('ni.node_class_id', $course_node_class_id);
          $select->where->AND->equalTo('ni.status', 1);
          $statement = $sql->prepareStatementForSqlObject($select);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $courseArray = $resultObj->initialize($result)->toArray(); */

        $sql = "SELECT `ni`.`node_id` AS `course_instance_node_id`,ni.node_instance_id FROM `node-instance` AS `ni` INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id` WHERE  `xy`.`node_x_id` = $user_instance_node_id AND `ni`.`node_class_id` = $course_node_class_id AND `ncp`.`caption` = 'Updation Timestamp' AND `ni`.`status` = '1' ORDER BY `nip`.`value` DESC";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $courseArray = $resultObj->initialize($result)->toArray();

        $course_array = '';
        $course_instance_ary = '';
        $mainAry = array();
        foreach ($courseArray as $value) {
            $course_instance_node_id = $value['course_instance_node_id']; //22292
            $node_instance_id = $value['node_instance_id'];
            $course_array .= $course_instance_node_id . ",";
            $course_instance_ary.= $node_instance_id . ",";
        }
        $mainAry['course_instance_node_id'] = $course_array;
        $mainAry['node_instance_id'] = $course_instance_ary;
        return $mainAry;
    }

    /**
     * COURSE INSTANCE INSERT IN FILE
     * Function to insert all the course associated with the user in
     * Created by Arti Sharma
     */
    public function insertAllCourseInstanceByUser($user_instance_node_id)
    {

        $courseAry = $this->getAllCoursesInstanceDb($user_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'user_course_data_' . $user_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        //$file_create = fopen($file_path, "w+") or die('cannot create file');
        $course_instance_node_id = $courseAry['course_instance_node_id'];
        $node_instance_id = $courseAry['node_instance_id'];

        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        $insert_string = 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'node_instance_id=' . $node_instance_id;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
        /* if (file_exists($file_path)) {
          $file_data = file_get_contents($file_path);
          $count = strlen(trim($file_data));
          $insert_string = 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'node_instance_id=' . $node_instance_id;
          } */
        //chmod($file_path, 511);
        //fputs($file_create, trim($insert_string));
        //fclose($file_create);
        // Update Permission for double instance
        //chmod($file_path, 0777);
    }

    /**
     * COURSE INSTANCE READ FROM FILE
     * Function to read all the course associated with the user from file
     * Created by Arti Sharma
     */
    public function getUserCourseFromFile($user_instance_node_id)
    {

        $this->insertAllCourseInstanceByUser($user_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'user_course_data_' . $user_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $dialogAry = array();
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        // NOT SURE WHY SAME CODE IS WRITTEN IN IF ELSE, so adding AWS code in IF only
        //if (file_exists($file_path)) {
        if ($awsObj->isObjectExist($awsFilePath)) {
            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->readUserDialogFile($file_data);
            }
        } else {
            // function to enter all the dialogue info into the file
            $file_create = fopen($file_path, "r");
            $file_data = file_get_contents($file_path);
            $count = strlen(trim($file_data));

            if ($count == 0) {
                $data = $this->readUserDialogFile($file_data);
            }
        }
        return $data;
    }

    /**
     * COURSE INFO *********************************READ FROM FILE
     * Function to read all the course info associated with the course from file
     * Created by Arti Sharma
     */
    public function getCourseInfoFromFile($course_instance_node_id, $user_instance_node_id)
    {

        //return $this->getAllCourseByCourseId($course_instance_node_id, $user_instance_node_id);
        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'course_info_' . $course_instance_node_id;

        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        $dialogAry = array();
        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        //if (file_exists($file_path)) {
        if ($awsObj->isObjectExist($awsFilePath)) {
            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));
            if ($count) {
                $data = $this->readCourseFile($file_data, $course_instance_node_id, $user_instance_node_id);
            }
        } else {
            // function to enter all the dialogue info into the file
            $this->insertAllCourseInfoById($course_instance_node_id, $user_instance_node_id);

            //$file_create = fopen($file_path, "r");
            //$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
            $count = strlen(trim($file_data));

            if ($count == 0) {
                $data = $this->readCourseFile($file_data, $course_instance_node_id, $user_instance_node_id);
            }
        }
        return $data;
    }

    /**
     * COURSE INFO *********************************INSERT INTO FILE
     * Function to insert all the course info associated with the dialogue in file
     * Created by Arti Sharma
     */
    public function insertAllCourseInfoById($course_instance_node_id, $user_instance_node_id)
    {
        $dialogAry = $this->getAllCourseByCourseId($course_instance_node_id, $user_instance_node_id);

        $folder_path = ABSO_URL . "data/perspective_cache/";
        $filename = 'course_info_' . $course_instance_node_id;
        $txt_filename = $filename . ".txt";
        $file_path = $folder_path . $txt_filename;
        //$file_create = fopen($file_path, "w+") or die('cannot create file');


        $course_instance_node_id = $dialogAry['course_instance_node_id'];
        $course_title = $dialogAry['course_title'];
        $user_name = $dialogAry['user_name'];
        $user_id = $dialogAry['user_id'];
        $node_instance_property_id = $dialogAry['node_instance_property_id'];
        $search_info = $dialogAry['search_info'];

        // AWS S3
        $awsObj = new AwsS3();
        $awsFilePath = "data/perspective_cache/$txt_filename";
        $insert_string = 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'course_title=' . $course_title . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
        /* if (file_exists($file_path)) {
          $file_data = file_get_contents($file_path);
          $count = strlen(trim($file_data));
          $insert_string = 'course_instance_node_id=' . $course_instance_node_id . '#~#' . 'course_title=' . $course_title . '#~#' . 'user_name=' . $user_name . '#~#' . 'user_id=' . $user_id . '#~#' . 'node_instance_property_id=' . $node_instance_property_id . "#~#" . 'search_info=' . $search_info;
          }
          //chmod($file_path, 511);
          fputs($file_create, trim($insert_string));

          fclose($file_create); */
    }

    /**
     *  COURSE INFO *********************************GET FROM DATABASE
     *  Function to fetch the course info from database
     *  Created by Arti Sharma
     */
    public function getAllCourseByCourseId($course_instance_node_id, $user_instance_node_id)
    {

        $course_class_node_id = COURSE_CLASS_ID;
        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        $mainAry = array();

        //get title of dialogue
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => 'value', 'node_instance_property_id' => 'node_instance_property_id', 'node_instance_id' => 'node_instance_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->equalTo('ni.node_id', $course_instance_node_id);
        //$select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ncp.caption', 'Title');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dailogtitle_array = $resultObj->initialize($result)->toArray();


        //get all the user associated with the dialogue

        $sql = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = '$course_instance_node_id' AND `ni`.`node_class_id` = '$user_class_node_id'  AND (ncp.caption ='First Name' or ncp.caption ='Last Name')";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();
        $user_data = '';
        $user_ids = '';
        $temp_ary = array();
        foreach ($userArray as $output) {
            $user_instance_node_id = $output['user_instance_node_id'];
            $caption = $output['caption'];
            $temp_ary[$user_instance_node_id][$caption] = $output['value'];
            $temp_ary[$user_instance_node_id]['user_instance_node_id'] = $user_instance_node_id;
        }
        foreach ($temp_ary as $val) {
            $username = $val['First Name'] . " " . $val['Last Name'];
            $user_instance_node_id = $val['user_instance_node_id'];
            $user_data .= $username . ", ";
            $user_ids .= $user_instance_node_id . ",";
        }


        $mainAry['user_name'] = rtrim($user_data, ', ');
        $mainAry['user_id'] = rtrim($user_ids, ',');
        $mainAry['course_title'] = @$dailogtitle_array[0]['value'];
        $mainAry['node_instance_property_id'] = @$dailogtitle_array[0]['node_instance_property_id'];
        $mainAry['node_instance_id'] = @$dailogtitle_array[0]['node_instance_id'];
        $mainAry['course_instance_node_id'] = $course_instance_node_id;
        $mainAry['search_info'] = @$dailogtitle_array[0]['value'] . " " . rtrim($user_data, ', ');

        return $mainAry;
    }

    public function readCourseFile($file_data, $course_instance_node_id, $user_instance_node_id)
    {
        $dialog_data = explode('#~#', $file_data);

        $dialogAry = array();
        if (!empty($dialog_data[0])) {
            for ($i = 0; $i < count($dialog_data);) {
                //$content_data =  explode('=',$dialog_data[$i]);//
                $temp = explode('=', $dialog_data[$i]);
                $dialogAry[0][$temp['0']] = $temp['1'];

                $i++;
            }
            //  $dialogAry[0]['notification_count'] = $this->getNotificationCount($course_instance_node_id, $user_instance_node_id);

            return $dialogAry;
        } else {
            return 'no record found.';
        }
    }

    /*
     * Function to update the timestamp property
     */

    public function updateCourseTimestamp($course_instance_node_id)
    {
        $sql = new Sql($this->adapter);
        $data['value'] = date("Y-m-d H:i:s");
        if (intval($course_instance_node_id) > 0) {
            //get the node-instance-property id
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
            $select->where->AND->equalTo('ni.node_id', $course_instance_node_id);
            $select->where->AND->equalTo('ncp.caption', 'Updation Timestamp');

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $AdminArray = $resultObj->initialize($result)->toArray();
            $node_instance_property_id = $AdminArray['0']['node_instance_property_id'];

            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where(array('node_instance_property_id' => $node_instance_property_id));


            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $affectedRows = $result->getAffectedRows();
        }
    }

    public function getPropertyChild($classObj, $propertyArray, $subChildArray)
    {
        $caption = "";
        foreach ($subChildArray as $key => $childArray) {
            if (!is_array($childArray['child'])) {
                if (intval($childArray['encrypt_status']) == 1) {
                    $propertyArray[] = $classObj->mc_decrypt($childArray['caption'], ENCRYPTION_KEY);
                } else {
                    $propertyArray[] = $childArray['caption'];
                }
            }

            if (is_array($childArray['child'])) {
                $propertyArray = $this->getPropertyChild($classObj, $propertyArray, $childArray['child']);
            }
        }
        return $propertyArray;
    }

    public function getAllClassInstance($data)
    {
        $classObj = new ClassesTable($this->adapter);
        $primaryId = $keyType = $searchOn = '';
        if (count($data)) {
            $primaryId = $classObj->getNodeId('node-class', 'node_id', $data['nodeId'], 'node_class_id'); //$data['classId'];
            $searchOn = $data['searchOn'];
            $keyType = $data['keyType'];
        }

        /* $classObj = new ClassesTable($this->adapter);
          $headerArray        = $classObj->getClassStructurePrint(179);
          $propertyArray      = array();
          $tempexportData     = $this->getPropertyChild($classObj, $propertyArray, $headerArray[0]['property']); */

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value' => new Predicate\Expression('GROUP_CONCAT( nip.value )')), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), '');

        if ($searchOn == 'class') {
            $select->where->equalTo('ni.node_class_id', $primaryId);
        } elseif ($searchOn == 'node') {
            $select->where->equalTo('ni.node_id', $primaryId);
        } elseif ($searchOn == 'instance') {
            $select->where->equalTo('ni.node_instance_id', $primaryId);
        }
        $select->group(array('ncp.node_class_property_id', 'ni.node_instance_id'));
        $select->order('ni.node_instance_id DESC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray = $resultObj->initialize($result)->toArray();

        $dataArray = array();

        if (isset($data['isDeal'])) {
            foreach ($tempArray as $key => $value) {
                if ($keyType == 'node_instance_id') {
                    $dataArray[$value['node_instance_id']][$value['node_class_property_id']] = $value['value'];
                } elseif ($keyType == 'node_id') {
                    $dataArray[$value['node_id']][$value['node_class_property_id']] = $value['value'];
                }
            }
            return $dataArray;
        } else {
            foreach ($tempArray as $key => $value) {
                if ($keyType == 'node_instance_id') {
                    $dataArray[$value['node_instance_id']][$value['node_class_property_id'] . "_key"] = $value['value'];
                } elseif ($keyType == 'node_id') {
                    $dataArray[$value['node_id']][$value['node_class_property_id'] . "_key"] = $value['value'];
                }
            }
        }

        $_structure = $this->getClassPropertyStructure($primaryId);
        //return $_structure;
        $structure = array();
        foreach ($_structure as $key => $value) {
            $_value = array();

            $tempStructure['caption'][$value['node_class_property_id'] . "_key"] = $value['caption'];
            $tempStructure['classId'] = $primaryId;
            $classObj = $this;
            $_value['nodeXY'] = $classObj->fetchNodeXY($value['node_id']);
            $_value['nodeZ'] = $classObj->fetchNodeYZ($value['node_id']);
            $_value['nodeClassId'] = $classObj->fetchNodeClassId($_value['nodeXY']);
            $_value['nodeY'] = $classObj->fetchNodeClassY($value['node_id']);
            $_value['nodeYClassValue'] = $classObj->nodeYClassValue($_value['nodeY']);
            $_value['nodeClassYId'] = $classObj->nodeClassYId($value['node_id']);
            $_value['nodeClassYInstanceValue'] = $classObj->nodeClassYInstanceValue($_value['nodeClassYId']);
            $_value['nodeZStructure'] = $classObj->getNodeInstaceId1($_value['nodeZ'], $_value['nodeClassId']);
            $tempStructure['properties'][$value['node_class_property_id'] . "_key"] = $_value;
        }
        //return $tempStructure;
        array_push($structure, $tempStructure);
        $_dataArray = array();
        $_dataArray['structure'] = $structure;
        if (count($dataArray)) {
            $_dataArray['records'][] = array_reverse($dataArray, true);
        } else {
            $_dataArray['records'][] = array_reverse($tempArray, true);
        }
        return $_dataArray;
    }

    public function getNodeInstaceId1($node_id, $nodeClassId)
    {
        /* code here to fetch caption of nodeZ Class */
        //$classCaption = $this->fetchnodeClassCaption($nodeClassId);
        /* code here to fetch node instance id and make fetch node property with value */
        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $nodeId = array_filter(array_values($nodeId));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption1($value);
        }

        foreach ($nodeId as $key => $value) {
            $tempArrData = $this->fetchnodeInstancePropertyVal($value);
            foreach ($tempCaption as $key1 => $value1) {
                if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {
                    //$tempArra[$value1[0]['caption']] = $this->fetchnodeInstancePropertyVal($value); //remove intentionally due to same call.
                    $tempArra[$value1[0]['caption']] = $tempArrData;
                }
            }
        }

        return $tempArra;
    }

    public function fetchnodeClassCaption1($nodeClassId = "")
    {
        $np = explode(",", $nodeClassId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('caption', 'node_class_id', 'node_id'));
        $select->where->IN('node_id', $np);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    public function checkMappingDealOperationNodeID($post)
    {
        $deal_node_id = $post['deal_node_instance_id'];
        $deal_user_role_id = $post['deal_user_role_node_id'];
        $loginuserId = !empty($post['login_user_id']) ? $post['login_user_id'] : '';

        $selectQuery = "SELECT node_id from `node-instance` WHERE node_instance_id = (SELECT DISTINCT a.node_instance_id
            FROM `node-instance-property` a, `node-instance-property` b,`node-instance-property` c
            WHERE a.value = $deal_node_id AND a.node_class_property_id = " . DEAL_PID . " AND b.value = $deal_user_role_id AND b.node_class_property_id = " . ROLE_PID;
        if ($loginuserId != '') {
            $selectQuery .= " AND c.value = $loginuserId AND c.node_class_property_id = " . ACTOR_PID;
        }
        $selectQuery .= " AND a.node_instance_id = b.node_instance_id AND b.node_instance_id = c.node_instance_id)";

        $result = $this->adapter->query($selectQuery, Adapter::QUERY_MODE_EXECUTE);
        $res = $result->toArray();
        return $res[0]['node_id'];
    }

    public function getDealOperationFormId($post)
    {

        if (count($post['allOpeArray']) > 0) {
            $allOpeArray = $post['allOpeArray'];
        } else {
            $allOpeArray = $this->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
        }

        $formId = '';
        $documentId = '';
        foreach ($allOpeArray as $key => $value) {
            if (intval($value['Mapping_Role_Actor']) == intval($post['mappingRoleActorInstanceId']) && intval($value['Operation']) == intval($post['operation_id'])) {
                $formId = $value['Form'];
                $documentId = $value['Document'];
            }
        }

        $formData = array();
        if (trim($formId) != '' && intval($formId) > 0) {
            $classObj = new ClassesTable($this->adapter);
            $primaryId = $classObj->getNodeId('node-instance', 'node_id', $formId, 'node_instance_id');
            $formData = $this->getInstanceEditStructure($primaryId);
        }

        return array('Form' => $formId, 'Document' => $documentId, 'FormData' => $formData);
    }

    public function getMappingRoleActorStructure($post)
    {

        $nodeId = $post['mappingRoleActorNodeId'];
        $loginUserId = $post['loginUserId'];

        $mappingRoleActorArr = $this->getInstanceListOfParticulerClass($nodeId, 'node', 'node_id');
        $dealNodeId = $mappingRoleActorArr[$nodeId]['Deal'];

        $roleData = $this->getActorWithRoleAndDeal($dealNodeId);
        $senderkeyNodeId = $this->searchForIdInArray($loginUserId, 'actor', $roleData);    // search for id in multi-dimensional array.
        $mailArr = array();



        if ($senderkeyNodeId > 0) {
            foreach ($roleData as $key => $value) {
                if ($roleData[$key]['actor'] > 0) {
                    if (intval($roleData[$key]['actor']) == intval($loginUserId)) {
                        $userData = $this->getUserProfile($value['actor'], '632');

                        $value['email'] = $userData['email_address'];
                        $value['first_name'] = $userData['first_name'];
                        $roleData1 = $this->getRoleName($value['role']);

                        $value['role_name'] = current($roleData1)['Title'];
                        $mailArr['sender'] = $value;
                    } else {
                        $userData = $this->getUserProfile($value['actor'], '632');

                        $value['email'] = $userData['email_address'];
                        $value['first_name'] = $userData['first_name'];
                        $roleData1 = $this->getRoleName($value['role']);

                        $value['role_name'] = current($roleData1)['Title'];
                        $mailArr['reciever'][] = $value;
                    }
                }
            }

            $deal_instance_id = $this->getParticulerColumnValue('node-instance', 'node_id', $mailArr['sender']['deal'], 'node_instance_id');
            //$post1['deal_node_instance_id'] = $deal_instance_id;
            $post1['deal_node_instance_id'] = $dealNodeId;
            $post1['deal_actor_role_node_id'] = $mailArr['sender']['role'];
            $post1['is_mail'] = true;
            $post1['login_user_id'] = $loginUserId;

            $mailArr['operation'] = current($this->getOperationListByRoleAndDealPaymentType($post1));

            //return $mailArr['operation'];
            return $mailArr;
        }
    }

    public function searchForIdInArray($id, $seachKey, $array)
    {

        foreach ($array as $key => $val) {
            if ($val[$seachKey] === $id) {
                return $key;
            }
        }
        return null;
    }

    public function getParticulerColumnValue($tableName, $primaryColumnName, $primaryColumnValue, $returnColumnValue)
    {
        $classObj = new ClassesTable($this->adapter);
        $primaryId = $classObj->getNodeId($tableName, $primaryColumnName, $primaryColumnValue, $returnColumnValue);
        return $primaryId;
    }

    public function getRoleName($role_id)
    {
        return $allOpeArray = $this->getInstanceListOfParticulerClass($role_id, 'node', 'node_id');
    }

    public function updateInstanceProperty($instance_property_id, $instance_property_caption, $class_property_id, $node_instance_id, $node_type_id)
    {
        $classObj = new ClassesTable($this->adapter);
        $classObj->updateInstanceProperty($instance_property_id, $instance_property_caption, $class_property_id, $node_instance_id, $node_type_id);
    }

    public function fetchNodeInstancePropertyData($node_instance_id, $node_class_property_id)
    {
        $classObj = new ClassesTable($this->adapter);
        return $classObj->fetchNodeInstancePropertyData($node_instance_id, $node_class_property_id);
    }

    public function createInstancePropertySpreadSheet($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id)
    {
        $classObj = new ClassesTable($this->adapter);
        $classObj->createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id);
    }

    public function createInstance($instance_caption = '', $node_class_id = '', $node_type_id = '', $saveType = '', $node_instance_id = '')
    {
        $classObj = new ClassesTable($this->adapter);
        return $classObj->createInstance($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id);
    }

    public function deleteInstance($delete_ids)
    {
        //echo "sss";exit;
        $classObj = new ClassesTable($this->adapter);
        return $classObj->deleteInstance($delete_ids);
    }

    public function getTableCols($colsArr, $table_name, $whereCols, $value)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('tbl' => $table_name));
        $select->columns($colsArr);
        if (is_array($whereCols) && is_array($value) && count($whereCols) == count($value)) {
            for ($i = 0; $i < count($value); $i++) {
                $select->where->equalTo('tbl.' . $whereCols[$i], $value[$i]);
            }
        } else {
            $select->where->equalTo('tbl.' . $whereCols, $value);
        }
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function updateOperationStatus($post = array())
    {
        if ($post['mode'] == 'update') {
            $data['value'] = $post['value'];
            $sql = new Sql($this->adapter);
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where(array('node_instance_property_id' => $post['nipid']));
            //return  $query->getSqlstring();die;
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $affectedRows = $result->getAffectedRows();
            return $affectedRows;
        }
        if ($post['mode'] == 'insert') {
            return $this->createNodeInstanceProperty($post['instance_id'], $post['class_p_id'], 2, $post['value']);
        }
        return $post;
    }

    public function getInstanceIdByTwoValue($data = array())
    {
        $sql = "SELECT `nip1`.`node_instance_id`  FROM `node-instance-property` `nip1`,`node-instance-property` `nip2` WHERE `nip1`.`value` = $data[value1] AND `nip2`.`value` = $data[value2] AND `nip1`.`node_instance_id` = `nip2`.`node_instance_id`";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $propertyAry = $resultObj->initialize($result)->toArray();
        return $propertyAry;
    }

    public function getNodeXOfParticulerClass($id, $fieldEqualTo, $fieldSend, $node_class_id)
    {
        /* $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->from(array('nip' => 'node-x-y-relation'));
          $select->columns(array($fieldSend));
          $select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.' . $fieldSend, array('node_class_id', 'node_id'), 'inner');
          $select->where->equalTo('ni.node_class_id', $node_class_id);
          $select->where->AND->equalTo('nip.' . $fieldEqualTo, $id); */
        //return $select->getSqlstring();
        $sql = "SELECT `nip`.`" . $fieldSend . "` AS `node_x_id`, `ni`.`node_class_id` AS `node_class_id`, `ni`.`node_id` AS `node_id`
                    FROM `node-x-y-relation` AS `nip` INNER JOIN `node-instance` AS `ni` ON `ni`.`node_id`=`nip`.`" . $fieldSend . "` WHERE `ni`.`node_class_id` = " . $node_class_id . " AND `nip`.`" . $fieldEqualTo . "` = " . $id;
        $statement = $this->adapter->query($sql);

        //$statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getNodeXOfParticulerClassWithoutClass($id, $fieldEqualTo, $fieldSend)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-x-y-relation'));
        $select->columns(array($fieldSend));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.' . $fieldSend, array('node_class_id', 'node_id'), 'inner');

        $select->where->AND->equalTo('nip.' . $fieldEqualTo, $id);
        //return $select->getSqlstring();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function callMapping($post)
    {
        $classObj = new ClassesTable($this->adapter);
        $instanceArray = $this->getInstanceListOfParticulerClass($post['instanceNodeId'], 'node', 'node_id');
        $class_node_id = current($instanceArray)['Target Class NID'];

        $node_class_id = $classObj->getNodeId('node-class', 'node_id', $class_node_id, 'node_class_id');
        $classArray = $this->getClassList($node_class_id);

        $node_x_ids = $this->getNodeXOfParticulerClass($post['instanceNodeId'], 'node_y_id', 'node_x_id', SUB_MAPPING_CLASS_ID);
        $instanceProArray = array();
        foreach ($node_x_ids as $k => $v) {
            $tempArray = current($this->getInstanceListOfParticulerClass($v['node_x_id'], 'node', 'node_id'));
            if ($tempArray['Obsolete'] == 'No') {
                $instanceProArray[] = $tempArray;
            }
        }
        return array('instnaceArray' => $instanceArray, 'classArray' => $classArray, 'instanceProArray' => $instanceProArray);
    }

    /*
     * Created By: Divya
     * Purpose: to fetch Child Structure of a class
     */

    public function getClassStructureProperty($class_id)
    {
        $classArray = $this->getClassStructure($class_id);

        $childKeyPropertyID = array();
        foreach ($classArray[0]['property'] as $key => $property) {
            if (trim($property['caption']) == 'Properties') {
            }

            if (!empty($property['child'])) {
                $childProperty = $property['child'];
                foreach ($childProperty as $childkey => $childValue) {
                    $childKeyPropertyID[] = $childkey;
                }
            }
        }
        return $childKeyPropertyID;
    }

    /* End Here */

    /*
     * Created By: Divya
     * Purpose: to fetch Class Structure of a class without nodeZ, nodeX or nodeY
     */

    public function getClassStructure($class_id)
    {
        $classObj = new ClassesTable($this->adapter);
        return $classObj->getClassStructurePrint($class_id);
    }

    /* End Here */

    public function getClassDetailFromProperty($post)
    {
        $classObj = new ClassesTable($this->adapter);
        $node_class_id = $classObj->getNodeId('node-class-property', 'node_class_property_id', $post['propertyId'], 'node_class_id');
        $classArray = $this->getClassList($node_class_id);
        return $classArray;
    }

    public function publishDeal($variable_data)
    {

        $node_instance_id = $variable_data['data']['node_ins_id'];
        $sql = new Sql($this->adapter);
        $data['status'] = 1;
        $query = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where(array('node_instance_id' => $node_instance_id));
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $affectedRows = $result->getAffectedRows();
        return $affectedRows;
    }

    /*
     * Modified By: Divya Rajput
     * Purpose: When a deal is saved (NOT PUBLISHED), that Deal should be visible to only its creator under his respective role.
     * No one else should be able to see that Deal.
     */

    public function dealShowByRole($realArrayNew, $login_user_id, $current_role)
    {
        $tempArray = array();
        if (!empty($realArrayNew) && count($realArrayNew) > 0) {
            $sql = new Sql($this->adapter);
            $realArrayNew = array_unique(array_filter(array_values($realArrayNew)));

            $instance_status_sql = $sql->select();
            $instance_status_sql->columns(array('status', 'node_instance_id'));
            $instance_status_sql->from(array('ni' => 'node-instance'));
            $instance_status_sql->where->IN('ni.node_instance_id', $realArrayNew);
            $instance_status_res = $sql->prepareStatementForSqlObject($instance_status_sql);
            $instance_status_result = $instance_status_res->execute();
            $instance_status_resultObj = new ResultSet();
            $instance_status_array = $instance_status_resultObj->initialize($instance_status_result)->toArray();
            // Calling new optimized function - removed foreach
            $res = $this->fetchDealCreatorArray($realArrayNew);

            $instanceStatusArray = array_column($instance_status_array, 'status', 'node_instance_id');

            $tempArray = array();
            foreach ($res as $key => $val) {
                if (array_key_exists($val['node_instance_id'], $instanceStatusArray)) {
                    $status = $instanceStatusArray[$val['node_instance_id']];
                    if (intval($status) == 1) {
                        $tempArray[] = $val['node_instance_id'];
                    } elseif (intval($val['node_class_property_id']) == DEAL_ROLE_USER_NODE_PROPERTY_ID && intval($val['value']) == intval($login_user_id)) {
                        $tempArray[] = $val['node_instance_id'];
                    } elseif (intval($val['node_class_property_id']) == DEAL_ROLE_NODE_PROPERTY_ID && intval($val['value']) == intval($current_role)) {
                        $tempArray[] = $val['node_instance_id'];
                    }
                }
            }
            return array_unique($tempArray);
        } else {
            return "";
        }
        /** OLD CODE
          $tempArray = array();
          $sql = new Sql($this->adapter);
          $realArrayNew = array_unique(array_filter(array_values($realArrayNew)));

          foreach ($realArrayNew as $key => $instance_id) {

          $instance_status_sql = $sql->select();
          $instance_status_sql->columns(array('status'));
          $instance_status_sql->from(array('ni' => 'node-instance'));
          $instance_status_sql->where->equalTo('ni.node_instance_id', $instance_id);

          $instance_status_res = $sql->prepareStatementForSqlObject($instance_status_sql);
          $instance_status_result = $instance_status_res->execute();
          $instance_status_resultObj = new ResultSet();
          $instance_status_array = $instance_status_resultObj->initialize($instance_status_result)->toArray();
          $instance_publish_status = $instance_status_array[0]['status'];
          $res = $this->fetchDealCreator($instance_id);
          foreach ($res as $result) {
          if (intval($result['node_class_property_id']) == DEAL_ROLE_USER_NODE_PROPERTY_ID) {
          $deal_created_by_user = $result['value'];
          }
          if (intval($result['node_class_property_id']) == DEAL_ROLE_NODE_PROPERTY_ID) {
          $deal_created_by_role = $result['value'];
          }
          }
          if (intval($instance_publish_status) == 1) {
          $tempArray[] = $instance_id;
          } else {
          if (intval($deal_created_by_user) == intval($login_user_id) && intval($deal_created_by_role) == intval($current_role)) {
          $tempArray[] = $instance_id;
          }
          }
          }
          return $tempArray; */
    }

    /**
     * Created By: Amit Malakar
     * Date: 31-Jan-17
     * Code Optimization - query optimized
     * @param $instance_id
     * @return array
     */
    public function fetchDealCreatorArray($instanceIdArr)
    {
        $sql = new Sql($this->adapter);

        $_subselect = $sql->select();
        $_subselect->columns(array('node_instance_id'));
        $_subselect->from(array('ni' => 'node-instance'));
        $_subselect->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni.node_id', array(), 'right');
        $_subselect->join(array('ni1' => 'node-instance'), 'ni1.node_id = nxyr.node_x_id', array(), 'right');
        $_subselect->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni1.node_instance_id', array('value', 'node_class_property_id'), 'left');
        $_subselect->where->IN('ni.node_instance_id', $instanceIdArr);
        $_subselect->where->AND->NEST->equalTo('nip.node_class_property_id', DEAL_ROLE_USER_NODE_PROPERTY_ID)->OR->equalTo('nip.node_class_property_id', DEAL_ROLE_NODE_PROPERTY_ID)->UNNEST;

        $instance_res = $sql->prepareStatementForSqlObject($_subselect);
        $instance_result = $instance_res->execute();
        $instance_resultObj = new ResultSet();
        $res = $instance_resultObj->initialize($instance_result)->toArray();

        return $res;
    }

    public function fetchDealCreator($instance_id)
    {
        $sql = new Sql($this->adapter);

        $_subselect = $sql->select();
        $_subselect->columns(array());
        $_subselect->from(array('ni' => 'node-instance'));
        $_subselect->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni.node_id', array(), 'right');
        $_subselect->join(array('ni1' => 'node-instance'), 'ni1.node_id = nxyr.node_x_id', array('node_instance_id'), 'right');
        $_subselect->where->equalTo('ni.node_instance_id', $instance_id);


        $instance_sql = $sql->select();
        $instance_sql->columns(array('*'));
        $instance_sql->from(array('nip' => 'node-instance-property'));
        $instance_sql->where->IN('nip.node_instance_id', $_subselect);
        $instance_sql->where(
            new \Zend\Db\Sql\Predicate\PredicateSet(
                array(
                    new \Zend\Db\Sql\Predicate\Operator('nip.node_class_property_id', '=', DEAL_ROLE_USER_NODE_PROPERTY_ID),
                    new \Zend\Db\Sql\Predicate\Operator('nip.node_class_property_id', '=', DEAL_ROLE_NODE_PROPERTY_ID)
                    ),
                \Zend\Db\Sql\Predicate\PredicateSet::OP_OR
            ),
            \Zend\Db\Sql\Predicate\PredicateSet::OP_AND
        );
        $instance_res = $sql->prepareStatementForSqlObject($instance_sql);
        $instance_result = $instance_res->execute();
        $instance_resultObj = new ResultSet();
        $res = $instance_resultObj->initialize($instance_result)->toArray();
        return $res;
    }

    /* End Here */

    private function searchForId($id, $seachKey, $array)
    {

        foreach ($array as $key => $val) {
            if ($val[$seachKey] === $id) {
                return $key;
            }
        }

        return null;
    }

    /*
     * Created By: Divya Rajput
     * Purpose: To fetch course data and their dialogue of particular user
     */

    public function fetchAllCourseData($config, $user_id)
    {
        $classObj = new ClassesTable($this->adapter);
        $courseDialogueTable = new CourseDialogueTable($this->adapter);
        $instanceArray = array();

        $order_by = 'node_instance_id';
        $order = 'DESC';
        $filter_operator = '';
        $search_text = '';
        $filter_field = '';
        $mode = 0;

        $course_class_id = $config['constants']['COURSE_CLASS_ID'];
        $production_title = $config['constants']['PRODUCT_TITLE'];
        $course_timeStamp = $config['constants']['COURSE_TIMESTAMP_ID'];

        $coursePropertiesArray = $classObj->getPropertiesCourse($course_class_id);
        $course_title_id = $coursePropertiesArray[3]['node_class_property_id'];
        $adminId = $user_id;
        $instanceArray = $classObj->fetchNodeInstanceCourse($course_class_id, $course_title_id, $order_by, $order, $filter_operator, $search_text, $filter_field, $production_title, $course_timeStamp, $adminId);
        $courseDataArray = array();
        $dialogueDataArray = array();

        /* Course Data of Particular User */
        foreach ($instanceArray as $key => $value) {
            $new_val = $value['value'];
            unset($value['value']);
            $value['value'][strtolower($value['caption'])] = $new_val;

            if (array_key_exists($value['course_instance_node_id'], $courseDataArray)) {
                $courseDataArray[$value['course_instance_node_id']]['value'][strtolower($value['caption'])] = $new_val;
            } else {
                $courseDataArray[$value['course_instance_node_id']] = $value;
            }
        }
        $courseDataArray = array_values($courseDataArray);

        foreach ($courseDataArray as $key => $val) {
            $node_instance_id = $val['node_instance_id'];
            $dialogueClassId = DIALOGUE_CLASS_ID;
            $dialogueTitleId = DIALOGUE_TITLE_ID;
            $CourseInsId = $val['node_instance_id'];
            $course_instance_node_id = $courseDialogueTable->getNodeId('node-instance', 'node_instance_id', $CourseInsId);
            $fetchdialogueRecord = $courseDialogueTable->getAllDialogueInstancesOfCourseClass($course_instance_node_id, $dialogueClassId, $dialogueTitleId);
            foreach ($fetchdialogueRecord as $keys => $dialog) {
                /* Course's Dialogue Data of Particular User of particular Course */
                if (in_array($user_id, explode(",", $dialog['user_id']))) {
                    $courseDataArray[$key]['dialogues'][] = $dialog;
                }
            }
        }

        return $courseDataArray;
    }

    /*
     * Created By: Divya Rajput
     * Purpose: To fetch Statement data of particular user's Courses
     */

    public function fetchAllDialogueData($user_id, $courseData)
    {
        $courseDialogueTable = new CourseDialogueTable($this->adapter);
        $dialogueDataArray = array();

        foreach ($courseData as $key => $val) {
            $dialogueData = $val['dialogues'];
            $statementArray = array();

            foreach ($dialogueData as $keys => $dialog) {
                if (in_array($user_id, explode(",", $dialog['user_id']))) {
                    /* Get Particular Dialog's statement data */
                    $dialogue_node_id = $dialog['dialogue_node_id'];
                    $stmtArray = $courseDialogueTable->getLetterStatementInstanceData($dialogue_node_id);
                    $statementArray['dialogue_node_id'] = $dialogue_node_id;
                    $statementArray['statements'] = $stmtArray[0]['statement'];
                    $dialogueDataArray[] = $statementArray;
                }
            }
        }
        return $dialogueDataArray;
    }

    /* End Here */


    /* This is not in Use as suggested By Ben. Only for testing Purpose, used by Ben */
    /* public function insertClassProperty() {
      error_reporting(E_ALL);
      $sql = "SELECT *  FROM `node-class` WHERE `node_id` in (SELECT nip1.value  FROM `node-instance` as ni1
      JOIN  `node-instance-property` nip1 on nip1.node_instance_id = ni1.node_instance_id
      where ni1.`node_class_id` = 638 AND nip1.node_class_property_id = 2950 AND  ni1.node_id in(SELECT nip.value  FROM `node-instance` as ni
      JOIN `node-instance-property` nip on nip.node_instance_id = ni.node_instance_id
      WHERE `node_class_id` = 661 AND nip.node_class_property_id = 3284 AND concat('',nip.value * 1) = nip.value))";
      $statement = $this->adapter->query($sql);
      $result = $statement->execute();
      $resultObj = new ResultSet();
      $propertyAry = $resultObj->initialize($result)->toArray();
      // $sql = new Sql($this->adapter);
      // $select = $sql->select();
      // $select->from(array('tbl' => 'node-class-property'));
      // $select->columns(array('node_class_property_parent_id' => new Expression('MAX(node_class_property_parent_id)')));
      // $select->where->equalTo('node_class_id', 634);
      // $statement = $sql->prepareStatementForSqlObject($select);
      // $result = $statement->execute();
      // $resultObj = new ResultSet();
      // //return $select->getSqlString();
      // $dataArray = $resultObj->initialize($result)->toArray();
      // return array_column($dataArray,'node_class_property_parent_id')[0];
      foreach ($propertyAry as $key => $value) {
      //return $value['node_class_id'];
      //return $this->getTableCols('node_class_property_parent_id', 'node-class-property', 'node_class_id', $value['node_class_id']);
      $sql = new Sql($this->adapter);
      $select = $sql->select();
      $select->from(array('tbl' => 'node-class-property'));
      $select->columns(array('node_class_property_parent_id' => new Expression('MAX(node_class_property_parent_id)')));
      $select->where->equalTo('node_class_id', $value['node_class_id']);
      $statement = $sql->prepareStatementForSqlObject($select);
      $result = $statement->execute();
      $resultObj = new ResultSet();
      //return $select->getSqlString();
      $dataArray = $resultObj->initialize($result)->toArray();
      $ncppid = array_column($dataArray, 'node_class_property_parent_id')[0];

      $data = array();
      $data['node_class_property_parent_id'] = $ncppid;
      $data['encrypt_status'] = ENCRYPTION_STATUS;
      $data['node_class_id'] = $value['node_class_id'];
      $data['node_id'] = $this->createNode();
      $data['node_type_id'] = 2;
      $data['caption'] = 'Dummy Text By Ben';

      $sql = new Sql($this->adapter);
      $query = $sql->insert('node-class-property');
      $query->values($data);
      $statement = $sql->prepareStatementForSqlObject($query);
      $result = $statement->execute();
      }
      //return $ncppid;
      } */

    public function getclassNodeId($instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_id'));
        $select->join(array('ni' => 'node-instance'), 'nc.node_class_id = ni.node_class_id', array(), 'left');
        $select->where->equalTo('ni.node_instance_id', $instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_id'];
    }

    public function getclassId($node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_class_id'));
        $select->where->equalTo('nc.node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_class_id'];
    }

    private function getChildStructure($childArray)
    {

        $i = 0;
        $classObj = new ClassesTable($this->adapter);
        foreach ($childArray as $chArr) {
            $childArray[$i]['instances'] = $classObj->getClassStructurePrint($chArr['node_class_id']);
            $data = $classObj->getClassChild($chArr['node_class_id']);
            $childArray[$i]['childs'] = $data['ids'];

            if (count($data['data'])) {
                $childArray[$i]['childsArray'] = $this->getChildStructure($data['data']);
            }
            $i++;
        }

        return $childArray;
    }

    private function getChildClassInstanceView($sub_class_node_id_array, $node_class_id, $temp_array)
    {
        $classObj = new ClassesTable($this->adapter);
        if (count($sub_class_node_id_array) > 0) {
            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {
                $node_instance_id = $classObj->getinstanceDetailsByNodeId($node_sub_class_id);
                if ($node_instance_id) {
                    $sub_class_node_id_new = $classObj->getNodeXIdFromXYTable($node_sub_class_id);
                    $nodeClassNodeId = $classObj->fetchNodeClassNodeId($node_instance_id);
                    $paramArr = array('node_class_id');
                    $nodeInstanceIdArr = $this->getTableCols($paramArr, 'node-class', 'node_id', $nodeClassNodeId);
                    $nodeClassId = $nodeInstanceIdArr['node_class_id'];
                    $temp_array['childs'][$nodeClassId][$node_instance_id] = $classObj->fetchNodeInstancePropertyPrint($node_instance_id);
                    // find parent node_instance_id
                    $temp_array['childs'][$nodeClassId][$node_instance_id]['parent'] = $classObj->fetchNodeYFromXY($node_sub_class_id);
                    if (count($sub_class_node_id_new) > 0) {
                        ++$i;
                        $temp_array[$i] = $this->getChildClassInstanceView($sub_class_node_id_new, $node_class_id, array());
                    }
                }
            }
        }

        return $temp_array;
    }

    private function formatInstanceStructure($instanceArray, $resultArray)
    {
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

    private function arrayCollectSameChilds($instanceArray)
    {
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

    private function buildTree(array $elements, $parentId = 0)
    {
        $branch = array();

        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $children = $this->buildTree($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    private function traveseTree($data)
    {
        $classArray = array();

        foreach ($data as $k => $value) {
            $tempArray = array();
            $classId = $value['class'];
            $tempArray['class'] = $value['class'];
            $tempArray['class_tree'] = $value['class_tree'];
            $tempArray['id'] = $value['id'];
            $tempArray['parent_id'] = $value['parent_id'];
            $tempArray['class'] = $value['class'];
            $tempArray['instance'] = $value['instance'];
            $tempArray['parent_instance_node_id'] = $value['parent_instance_node_id'];
            $tempArray['instance_node_id'] = $value['parent_instance_node_id'];
            $tempArray['hasChildren'] = $value['hasChildren'];


            if (is_array($value['children'])) {
                $tempArray['children'] = $this->traveseTree($value['children']);
            }

            $classArray[$classId][] = $tempArray;
        }

        return $classArray;
    }

    private function getClassArr($instanceArr)
    {

        $classArr = array();
        foreach ($instanceArr as $classId => $instances) {
            $classArr[key($instances)] = current($instances);
        }
        return $classArr;
    }

    private function getParentClassIds($instanceArr, $parentId, $prevCIds)
    {


        foreach ($instanceArr as $classId => $instances) {
            foreach ($instances as $instanceId => $properties) {
                if ($instanceId == $parentId) {
                    if (is_numeric($properties['parent'])) {
                        $prevCIds = $classId . "_" . $prevCIds;
                        return $this->getParentClassIds($instanceArr, $properties['parent'], $prevCIds);
                    } else {
                        $prevCIds = $classId . "_" . $prevCIds;
                    }
                }
            }
        }
        return $prevCIds;
    }

    public function getInstanceIdOfSubClass($post)
    {
        $getData = $this->getNodeXOfParticulerClass($post['y_instance_node_id'], 'node_y_id', 'node_x_id', $post['class_id']);
        $classObj = new ClassesTable($this->adapter);

        if (trim($getData[0]['node_id']) != '') {
            return $classObj->getNodeId('node-instance', 'node_id', $getData[0]['node_id'], 'node_instance_id');
        } else {
            return '';
        }
    }

    /*
     * Created By: Divya Rajput
     * Purpose: To check net is connected or not
     */

    public function isNetConnect()
    {

        $ip = gethostbyname('www.google.com');
        if ($ip != 'www.google.com') {
            return 1;
        } else {
            return 0;
        }
    }

    function getVisibleNRequiredRoles($post)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL getVisibleNRequiredRoles(' . $post['roleId'] . ', ' . $post['classPId'] . ');';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('value' => new Predicate\Expression('GROUP_CONCAT( nin.node_id )')));
            $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array(), 'inner');
            $select->join(array('nin' => 'node-instance'), 'nin.node_instance_id = nip.value', array(), 'inner');
            $select->where->equalTo('ni.node_id', $post['roleId']);
            $select->where->AND->equalTo('nip.node_class_property_id', $post['classPId']);
            //return $select->getSqlstring();

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }


        return $dataArray[0];
    }

    public function getAllClassList($type)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('node_class_id', 'caption'));
        $select->where->equalTo('node_type_id', $type['type']);
        $select->where->AND->equalTo('status', 1);
        $select->where->AND->notIN('node_class_id', array(7, 8, 9));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    function getDealPermissions($post)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => new Predicate\Expression('GROUP_CONCAT( nip.value )')));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array(), 'inner');
        $select->where->equalTo('ni.node_id', $post['roleId']);
        $select->where->AND->equalTo('nip.node_class_property_id', $post['classPId']);
        //return $select->getSqlstring();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function getClassPropertyStrVal($classId)
    {
        $classObj = new ClassesTable($this->adapter);
        $classArray = $classObj->getClassList($classId['classId']);
        $data = $classObj->getClassChild($classId['classId']);
        $classArray['childs'] = $data['ids'];
        $classArray['childsArray'] = $data['data'];
        $nodeType = $classObj->getNodeType($classArray['node_type_id']);
        $classArray['instances'] = $classObj->getClassStructurePrint($classId['classId']);
        $classArray['childsArray'] = $this->getPrintStructure($classArray['childsArray']);
        return $classArray;
    }

    private function getPrintStructure($childArray)
    {
        $i = 0;
        $classObj = new ClassesTable($this->adapter);
        foreach ($childArray as $chArr) {
            $childArray[$i]['instances'] = $classObj->getClassStructurePrint($chArr['node_class_id']);
            $data = $classObj->getClassChild($chArr['node_class_id']);
            $childArray[$i]['childs'] = $data['ids'];
            if (count($data['data'])) {
                $childArray[$i]['childsArray'] = $this->getPrintStructure($data['data']);
            }
            $i++;
        }
        return $childArray;
    }

    /* End Here */




    /*
     * Created By: Divya Rajput
     * Purpose: To fetch all user details and their appropriate roles
     */

    public function fetchAllUsersDetails($data = array())
    {
        $classObj = new ClassesTable($this->adapter);
        $userArray = $classObj->getIndividualUsersList($data);

        //For Api call
        //Added by :- Gaurav
        //Added on 8 june 2017

        if (isset($data['excludeRole']) && $data['excludeRole'] == '1') {
            return $userArray;
        } else {
            $userNodeIdArray = array_column($userArray, 'node_id');
            if (count($userArray) > 0) {
                $allRolesArray = $this->getInstanceListOfParticulerClass(MAPPING_ROLE_ACTOR_CLASS_ID, 'class', 'node_instance_id');
                $allOperationRolesArray = $this->getInstanceListOfParticulerClass(OPERATION_ROLE_CLASS_ID, 'class', 'node_id');


                foreach ($userNodeIdArray as $userKey => $userNodeId) {
                    if (trim($userArray[$userKey]['domain']) == 'www.marinemax.com') {
                        $_RoleName = 'MarineMax';
                    } elseif (trim($userArray[$userKey]['domain']) == 'VesselWise') {
                        $_RoleName = 'VesselWise';
                    } else {
                        $_RoleName = 'Prospus';
                    }


                    $rolesArray = array();
                    foreach ($allRolesArray as $key => $value) {
                        if (intval($value['Actor']) == intval($userNodeId)) {
                            if (trim($value['Role']) != '' && !in_array($value['Role'], $rolesArray[$_RoleName])) {
                                $rolesArray[$_RoleName][] = $value['Role'];
                            }
                        }
                    }

                    $userArray[$userKey]['rolesArray'] = $rolesArray;
                }
            }
            return $userArray;
        }
    }

    /* End Here */

    public function getCanvasData($nodeId)
    {

        $dialogue_class_id = DIALOGUE_CLASS_ID;
        $instanceArray = $this->getChildClassInstancePrint($nodeId, $dialogue_class_id, array());

        $stmtArray = array();
        foreach ($instanceArray as $key => $value) {
            if ($key == 'childs') {
                // get dialogue details
                $dialogueInstance = current($value);
            } else {
                // get statement details
                $individualInstance = current(array_slice($value, -1, 1));

                //echo $statementInstance .= $statement;
                foreach (current($value) as $stmt) {
                    if (count($stmt) == 1) {
                        array_push($stmtArray, $stmt);
                    }
                }
            }
        }


        return $stmtArray = html_entity_decode(current($stmtArray[0]));
    }

    public function getFiQuoteValue($data)
    {

        $xidsArr = $this->getNodeXIdFromXYTable($data['deal_node_id']);
        $fiValue = '';
        foreach ($xidsArr as $xid) {
            $resArr = $this->getNodeInstaceId($xid, $data['operation_code_id']);
            $node_instance_id = current($resArr)[0]['node_instance_id'];
            // check if value exists for node_instance for FI quote field
            $fiRes = $this->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($node_instance_id, $data['fi_cpid']));
            if (!empty($fiRes)) {
                $fiValue = $fiRes['value'];
                break;
            }
        }
        return $fiValue;
    }

    /*
     * Created By: Amit Malakar
     * Date: 08-Dec-16
     * Search a property value, and return all property value for the same instance
     * @param array
     * @return array
     */

    public function getInstanceDataByPropertyValue($data)
    {
        // search for a property value, get the instance id
        // find all property value for the instance id
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id=nip.node_instance_id', array('*'), 'left');
        $select->where->equalTo('nip.node_class_property_id', $data['node_class_property_id']);
        $select->where->AND->equalTo('nip.value', $data['value']);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArray = $resultObj->initialize($result)->toArray();

        $resultArr = array();
        foreach ($instanceArray as $instance) {
            $resultArr[$instance['node_class_property_id']] = $instance['value'];
        }

        return $resultArr;
    }

    /*
     * Created By: Amit Malakar
     * Date: 16-Nov-16
     * Get Deal AppOne subclass Instance values
     * @param array
     * @return array
     */

    public function getDealAppOneInfo($data)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'ni.node_id = nxyr.node_y_id', array(), 'left');
        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id=nxyr.node_x_id', array('node_instance_id', 'node_class_id'), 'left');
        $select->where->AND->equalTo('ni.node_instance_id', $data['deal_instance_id']);
        $select->where->AND->equalTo('ni1.node_class_id', DEAL_APPONE_CLASS_ID);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        if (count($nodeArray)) {
            $subClassInstanceIdArr = array_column($nodeArray, 'node_instance_id');
            $temp = $this->getNodeInstanceValue($subClassInstanceIdArr);
        }

        return $temp;
    }

    /*
     * Created By: Amit Malakar
     * Date: 14-Nov-16
     * Return all property values Deal & KORE Apis
     */

    public function getDealOperationInfo($data)
    {

        $xidsArr = $this->getNodeXIdFromXYTable($data['deal_node_id']);
        foreach ($xidsArr as $xid) {
            // check if value exists for node_instance for FI quote field
            $dealOpInsId = $this->getTableCols(array('node_instance_id'), 'node-instance', array('node_id', 'node_class_id'), array($xid, OPERATION_PROPERTY_MAP_DEAL_CLASS_ID));
            if (!is_null($dealOpInsId)) {
                break;
            }
        }
        // find instance values
        if (isset($dealOpInsId['node_instance_id'])) {
            $res = $this->getNodeInstanceValue($dealOpInsId['node_instance_id']);
        }

        // find property for Customers, Units, Stock, FIQuote
        $dealOpResArr = array();
        $awsObj = new AwsS3();
        $motorsArr = $dealerOptionArr = $insuranceArr = array();
        $motorsArrNew = $dealerOptionArrNew = $insuranceArrNew = $cobAwsRes = $cusAwsRes = array();
        foreach ($res as $key => $value) {
            $mapData = end(explode('~$~', $value));
            $useAwsflag = 0;
            if (strpos($mapData, '/') && strpos($mapData, 'txt')) {
                $useAwsflag = 1;
            } else {
                $useAwsflag = 0;
                $dealOpResArr[] = $mapData;
            }
            if ($key == FI_QUOTE_PID) {
                if ($useAwsflag) {
                    // DEALEROPTIONS array via S3 Bucket
                    if (strlen($mapData)) {
                        $fiAwsJsonRes = $awsObj->getFileData($mapData);
                        $fiAwsRes = json_decode($fiAwsJsonRes['data'], true);
                        if (count($fiAwsRes['Record']['DealerOptions'])) {
                            $doMapArr = array('DlrOptDesc' => 7490, 'DlrOptCost' => 7492, 'DlrOptIsTaxed' => 7494);
                            foreach ($fiAwsRes['Record']['DealerOptions'] as $do) {
                                $newDo = array_intersect_key($do, $doMapArr);
                                $dealerOptionArrNew[] = array_combine(array_merge($newDo, $doMapArr), $newDo);
                            }
                        }
                    }
                } else {
                    // DEALEROPTIONS array via DB
                    $sqlFI = new Sql($this->adapter);

                    // FI subclass DEALEROPTIONS
                    $selectDO = $sqlFI->select();
                    $selectDO->columns(array());
                    $selectDO->from(array('xy' => 'node-x-y-relation'));
                    $selectDO->join(array('ni' => 'node-instance'), 'ni.node_id = xy.node_x_id', array(), 'left');
                    $selectDO->join(array('ni2' => 'node-instance'), 'ni2.node_id = xy.node_x_id', array(), 'left');
                    $selectDO->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni2.node_instance_id', array('node_instance_id', 'node_class_property_id', 'value'), 'left');
                    $selectDO->where->equalTo('xy.node_y_id', $mapData);
                    $selectDO->where->AND->equalTo('ni.node_class_id', DEALEROPTIONS_CLASS_ID);

                    $statementDO = $sqlFI->prepareStatementForSqlObject($selectDO);
                    $resultDO = $statementDO->execute();
                    $resultDOObj = new ResultSet();
                    $dealerOptionsResArr = $resultDOObj->initialize($resultDO)->toArray();

                    if (count($dealerOptionsResArr)) {
                        foreach ($dealerOptionsResArr as $val) {
                            $dealerOptionArr[$val['node_instance_id']][$val['node_class_property_id']] = $val['value'];
                        }
                    }
                }

                if ($useAwsflag) {
                    // INSURANCES array via S3 Bucket
                    if (strlen($mapData) && count($fiAwsRes['Record']['Insurances'])) {
                        $insMapArr = array('InsCode' => 7660, 'InsDesc' => 7661, 'InsCost' => 7668, 'InsPrem' => 7666, 'InsTerm' => 7665);
                        foreach ($fiAwsRes['Record']['Insurances'] as $ins) {
                            $newIns = array_intersect_key($ins, $insMapArr);
                            $insuranceArrNew[] = array_combine(array_merge($newIns, $insMapArr), $newIns);
                        }
                    }
                } else {
                    $sqlFI = new Sql($this->adapter);
                    // FI subclass INSURANCES
                    $selectIN = $sqlFI->select();
                    $selectIN->columns(array());
                    $selectIN->from(array('xy' => 'node-x-y-relation'));
                    $selectIN->join(array('ni' => 'node-instance'), 'ni.node_id = xy.node_x_id', array(), 'left');
                    $selectIN->join(array('ni2' => 'node-instance'), 'ni2.node_id = xy.node_x_id', array(), 'left');
                    $selectIN->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni2.node_instance_id', array('node_instance_id', 'node_class_property_id', 'value'), 'left');
                    $selectIN->where->equalTo('xy.node_y_id', $mapData);
                    $selectIN->where->AND->equalTo('ni.node_class_id', INSURANCES_CLASS_ID);

                    $statementIN = $sqlFI->prepareStatementForSqlObject($selectIN);
                    $resultIN = $statementIN->execute();
                    $resultINObj = new ResultSet();
                    $insuranceResArr = $resultINObj->initialize($resultIN)->toArray();

                    if (count($insuranceResArr)) {
                        foreach ($insuranceResArr as $val) {
                            $insuranceArr[$val['node_instance_id']][$val['node_class_property_id']] = $val['value'];
                        }
                    }
                }
            } elseif ($key == STOCK_PID) {
                if ($useAwsflag) {
                    // MOTORS array via S3 Bucket
                    if (strlen($mapData)) {
                        $motorAwsJsonRes = $awsObj->getFileData($mapData);
                        $unitAwsRes = json_decode($motorAwsJsonRes['data'], true);
                        if (count($unitAwsRes['Record']['Motors'])) {
                            $motMapArr = array('MotorModelYear' => 6575, 'MotorSerialNo' => 6581, 'MotorDsgnCode' => 6570, 'MotorMfg' => 6572, 'MotorModel' => 6574, 'MotorType' => 6571, 'MotorHorsePower' => 6578, 'MotorFuelTypeCode' => 6579);
                            foreach ($unitAwsRes['Record']['Motors'] as $mot) {
                                $newMot = array_intersect_key($mot, $motMapArr);
                                $motorsArrNew[] = array_combine(array_merge($newMot, $motMapArr), $newMot);
                            }
                        }
                    }
                } else {
                    // MOTORS array via DB
                    $sqlMO = new Sql($this->adapter);
                    // STOCK subclass MOTORS
                    $selectMO = $sqlMO->select();
                    $selectMO->columns(array());
                    $selectMO->from(array('xy' => 'node-x-y-relation'));
                    $selectMO->join(array('ni' => 'node-instance'), 'ni.node_id = xy.node_x_id', array(), 'left');
                    $selectMO->join(array('ni2' => 'node-instance'), 'ni2.node_id = xy.node_x_id', array(), 'left');
                    $selectMO->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni2.node_instance_id', array('node_instance_id', 'node_class_property_id', 'value'), 'left');
                    $selectMO->where->equalTo('xy.node_y_id', $mapData);
                    $selectMO->where->AND->equalTo('ni.node_class_id', MOTORS_CLASS_ID);

                    $statementMO = $sqlMO->prepareStatementForSqlObject($selectMO);
                    $resultMO = $statementMO->execute();
                    $resultMOObj = new ResultSet();
                    $motorsResArr = $resultMOObj->initialize($resultMO)->toArray();

                    if (count($motorsResArr)) {
                        foreach ($motorsResArr as $val) {
                            $motorsArr[$val['node_instance_id']][$val['node_class_property_id']] = $val['value'];
                        }
                    }
                }
            } elseif ($key == COBUYER_PID) {
                $cobAwsFile = end(explode('~$~', $value));
                // COBUYER array via S3 Bucket
                if (strlen($cobAwsFile)) {
                    $cobAwsJsonRes = $awsObj->getFileData($cobAwsFile);
                    $cobAwsRes = json_decode($cobAwsJsonRes['data'], true);
                }
            } elseif ($key == CUSTOMER_PID) {
                $cusAwsFile = end(explode('~$~', $value));
                // CUSTOMER array via S3 Bucket
                if (strlen($cusAwsFile)) {
                    $cusAwsJsonRes = $awsObj->getFileData($cusAwsFile);
                    $cusAwsRes = json_decode($cusAwsJsonRes['data'], true);
                }
            }
        }

        $result = array();
        if (count($dealOpResArr)) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id'));
            $select->where->IN('ni.node_id', $dealOpResArr);

            $statement = $sql->prepareStatementForSqlObject($select);
            $resultData = $statement->execute();
            $resultObj = new ResultSet();
            $dealOpResArr = $resultObj->initialize($resultData)->toArray();

            // FI DEALEROPTIONS & FINANCES
            $result['dealer_options'] = $dealerOptionArr;
            $result['insurances'] = $insuranceArr;
            $result['motors'] = $motorsArr;
        } else {
            // FI DATA
            if (count($fiAwsRes)) {
                $result['7634'] = $fiAwsRes['Record']['Rebates'];
                $result['7565'] = $fiAwsRes['Record']['TaxList'];
                $result['7653'] = $fiAwsRes['Record']['UseEntity'];
                $result['7649'] = $fiAwsRes['Record']['FinanceChargeTotal'];
                $result['7646'] = $fiAwsRes['Record']['DaysToFirst'];
                $result['7645'] = $fiAwsRes['Record']['InterestRate'];
                $result['7644'] = $fiAwsRes['Record']['LoanTerm'];
                $result['7588'] = $fiAwsRes['Record']['TaxIsFinanced'];
                $result['7572'] = $fiAwsRes['Record']['TradePayouts'];
                $result['7571'] = $fiAwsRes['Record']['TradeAllowances'];
                $result['7557'] = $fiAwsRes['Record']['SellingAmt'];
                $result['7536'] = $fiAwsRes['Record']['StockNo'];
                $result['7532'] = $fiAwsRes['Record']['QuoteNo'];
                $result['7483'] = isset($fiAwsRes['Record']['Trades'][0]['TradePayout']) ? $fiAwsRes['Record']['Trades'][0]['TradePayout'] : '';
                $result['7482'] = isset($fiAwsRes['Record']['Trades'][0]['TradeAllowance']) ? $fiAwsRes['Record']['Trades'][0]['TradeAllowance'] : '';
                $result['7478'] = isset($fiAwsRes['Record']['Trades'][0]['TradeSerialNo']) ? $fiAwsRes['Record']['Trades'][0]['TradeSerialNo'] : '';
                $result['7474'] = isset($fiAwsRes['Record']['Trades'][0]['TradeBrandDesc']) ? $fiAwsRes['Record']['Trades'][0]['TradeBrandDesc'] : '';
                $result['7476'] = isset($fiAwsRes['Record']['Trades'][0]['TradeModelYear']) ? $fiAwsRes['Record']['Trades'][0]['TradeModelYear'] : '';
                $result['7475'] = isset($fiAwsRes['Record']['Trades'][0]['TradeBrandDesc']) ? $fiAwsRes['Record']['Trades'][0]['TradeBrandDesc'] : '';
                $result['7469'] = isset($fiAwsRes['Record']['Trades'][0]['TradeStockNo']) ? $fiAwsRes['Record']['Trades'][0]['TradeStockNo'] : '';
                $result['7431'] = isset($fiAwsRes['Record']['DownPayments'][0]['DownPmtAmt']) ? $fiAwsRes['Record']['DownPayments'][0]['DownPmtAmt'] : '';
            }

            // UNIT DATA
            if (count($unitAwsRes)) {
                $result['6657'] = $unitAwsRes['Record']['TrailerSerialNo'];
                $result['6624'] = $unitAwsRes['Record']['TrailerModelYear'];
                $result['6623'] = $unitAwsRes['Record']['TrailerModel'];
                $result['6622'] = $unitAwsRes['Record']['TrailerBrand'];
                $result['6618'] = $unitAwsRes['Record']['TrailerDsgnCode'];
                $result['6613'] = $unitAwsRes['Record']['Horsepower'];
                $result['6612'] = $unitAwsRes['Record']['SerialNo'];
                $result['6607'] = $unitAwsRes['Record']['Length'];
                $result['6606'] = $unitAwsRes['Record']['ExteriorColor'];
                $result['6604'] = $unitAwsRes['Record']['Style'];
                $result['6595'] = $unitAwsRes['Record']['ModelYear'];
                $result['6594'] = $unitAwsRes['Record']['ModelDesc'];
                $result['6593'] = $unitAwsRes['Record']['BrandDesc'];
                $result['6588'] = $unitAwsRes['Record']['DsgnCode'];
                $result['6586'] = $unitAwsRes['Record']['StockNo'];
                $result['6581'] = isset($unitAwsRes['Record']['Motors'][0]['MotorSerialNo']) ? $unitAwsRes['Record']['Motors'][0]['MotorSerialNo'] : '';
                $result['6579'] = isset($unitAwsRes['Record']['Motors'][0]['MotorFuelTypeCode']) ? $unitAwsRes['Record']['Motors'][0]['MotorFuelTypeCode'] : '';
                $result['6578'] = isset($unitAwsRes['Record']['Motors'][0]['MotorHorsePower']) ? $unitAwsRes['Record']['Motors'][0]['MotorHorsePower'] : '';
                $result['6575'] = isset($unitAwsRes['Record']['Motors'][0]['MotorModelYear']) ? $unitAwsRes['Record']['Motors'][0]['MotorModelYear'] : '';
                $result['6574'] = isset($unitAwsRes['Record']['Motors'][0]['MotorModel']) ? $unitAwsRes['Record']['Motors'][0]['MotorModel'] : '';
                $result['6572'] = isset($unitAwsRes['Record']['Motors'][0]['MotorMfg']) ? $unitAwsRes['Record']['Motors'][0]['MotorMfg'] : '';
                $result['6571'] = isset($unitAwsRes['Record']['Motors'][0]['MotorType']) ? $unitAwsRes['Record']['Motors'][0]['MotorType'] : '';
                $result['6570'] = isset($unitAwsRes['Record']['Motors'][0]['MotorDsgnCode']) ? $unitAwsRes['Record']['Motors'][0]['MotorDsgnCode'] : '';
            }

            // CUSTOMER DATA
            if (count($cusAwsRes)) {
                $result['8245'] = $cusAwsRes['Record']['InsCompanyPhone'];
                $result['8243'] = $cusAwsRes['Record']['InsPolicyNo'];
                $result['8242'] = $cusAwsRes['Record']['InsCompanyAgent'];
                $result['8241'] = $cusAwsRes['Record']['InsCompanyDesc'];
                $result['8217'] = $cusAwsRes['Record']['ReferenceZipCode'];
                $result['8216'] = $cusAwsRes['Record']['ReferenceState'];
                $result['8215'] = $cusAwsRes['Record']['ReferenceCity'];
                $result['8214'] = $cusAwsRes['Record']['ReferenceAddressLine2'];
                $result['8213'] = $cusAwsRes['Record']['ReferenceAddressLine1'];
                $result['8212'] = $cusAwsRes['Record']['ReferenceRelationship'];
                $result['8211'] = $cusAwsRes['Record']['ReferencePhone'];
                $result['8210'] = $cusAwsRes['Record']['ReferenceName'];
                $result['8204'] = $cusAwsRes['Record']['RentOwnBuy'];
                $result['8195'] = $cusAwsRes['Record']['CheckingBankName'];
                $result['8187'] = $cusAwsRes['Record']['PrevJobTitle'];
                $result['8186'] = $cusAwsRes['Record']['OtherIncomeFrequency'];
                $result['8185'] = $cusAwsRes['Record']['OtherIncomeSource'];
                $result['8184'] = $cusAwsRes['Record']['OtherIncome'];
                $result['8183'] = $cusAwsRes['Record']['JobTitle'];
                $result['8160'] = $cusAwsRes['Record']['County'];
                $result['6567'] = $cusAwsRes['Record']['Addresses']['MonthsAtAddress'];
                $result['6566'] = $cusAwsRes['Record']['Addresses']['YearsAtAddress'];
                $result['6559'] = $cusAwsRes['Record']['MailingAddressZipCode'];
                $result['6558'] = $cusAwsRes['Record']['MailingAddressState'];
                $result['6557'] = $cusAwsRes['Record']['MailingAddressCity'];
                $result['6556'] = $cusAwsRes['Record']['MailingAddressLine2'];
                $result['6555'] = $cusAwsRes['Record']['MailingAddressLine1'];
                $result['6554'] = $cusAwsRes['Record']['PrevMonthsAtAddress'];
                $result['6553'] = $cusAwsRes['Record']['PrevYearsAtAddress'];
                $result['6552'] = $cusAwsRes['Record']['PrevZipCode'];
                $result['6551'] = $cusAwsRes['Record']['PrevState'];
                $result['6550'] = $cusAwsRes['Record']['PrevCity'];
                $result['6549'] = $cusAwsRes['Record']['PrevAddressLine2'];
                $result['6548'] = $cusAwsRes['Record']['PrevAddressLine1'];
                $result['6547'] = $cusAwsRes['Record']['PrevEmployerMonthsAtJob'];
                $result['6546'] = $cusAwsRes['Record']['PrevEmployerYearsAtJob'];
                $result['6545'] = $cusAwsRes['Record']['PrevEmployerPhone'];
                $result['6544'] = $cusAwsRes['Record']['PrevEmployerName'];
                $result['6543'] = $cusAwsRes['Record']['SalaryFrequency'];
                $result['6541'] = $cusAwsRes['Record']['SalaryGross'];
                $result['6540'] = $cusAwsRes['Record']['MonthsAtJob'];
                $result['6539'] = $cusAwsRes['Record']['YearsAtJob'];
                $result['6538'] = $cusAwsRes['Record']['EmployerZipCode'];
                $result['6537'] = $cusAwsRes['Record']['EmployerState'];
                $result['6536'] = $cusAwsRes['Record']['EmployerCity'];
                $result['6535'] = $cusAwsRes['Record']['EmployerAddressLine2'];
                $result['6534'] = $cusAwsRes['Record']['EmployerAddressLine1'];
                $result['6533'] = $cusAwsRes['Record']['EmployerPhone'];
                $result['6532'] = $cusAwsRes['Record']['EmployerName'];
                $result['6531'] = $cusAwsRes['Record']['SpouseMonthsAtJob'];
                $result['6520'] = $cusAwsRes['Record']['DriversLicenseNo'];
                $result['6519'] = $cusAwsRes['Record']['SocialSecurityNo'];
                $result['6334'] = $cusAwsRes['Record']['BirthDate'];
                $result['6332'] = $cusAwsRes['Record']['Addresses']['ZipCode'];
                $result['6331'] = $cusAwsRes['Record']['Addresses']['State'];
                $result['6330'] = $cusAwsRes['Record']['Addresses']['City'];
                $result['6329'] = $cusAwsRes['Record']['Addresses']['AddressLine2'];
                $result['6328'] = $cusAwsRes['Record']['Addresses']['AddressLine1'];
                $result['6323'] = $cusAwsRes['Record']['EmailPrimary'];
                $result['6322'] = $cusAwsRes['Record']['PhoneMobile'];
                $result['6320'] = $cusAwsRes['Record']['PhoneHome'];
                $result['6318'] = $cusAwsRes['Record']['MiddleInitial'];
                $result['6317'] = $cusAwsRes['Record']['LastName'];
                $result['6316'] = $cusAwsRes['Record']['FirstName'];
            }

            // CO BUYER DATA
            if (count($cobAwsRes)) {
                $result['8421'] = $cobAwsRes['Record']['EmployerZipCode'];
                $result['8420'] = $cobAwsRes['Record']['EmployerState'];
                $result['8419'] = $cobAwsRes['Record']['EmployerCity'];
                $result['8418'] = $cobAwsRes['Record']['EmployerAddressLine2'];
                $result['8417'] = $cobAwsRes['Record']['EmployerAddressLine1'];
                $result['8416'] = $cobAwsRes['Record']['EmployerName'];
                $result['8415'] = $cobAwsRes['Record']['JobTitle'];
                $result['8414'] = $cobAwsRes['Record']['SocialSecurityNo'];
                $result['8413'] = $cobAwsRes['Record']['DriversLicenseNo'];
                $result['8412'] = $cobAwsRes['Record']['BirthDate'];
                $result['8408'] = $cobAwsRes['Record']['ZipCode'];
                $result['8407'] = $cobAwsRes['Record']['State'];
                $result['8406'] = $cobAwsRes['Record']['City'];
                $result['8405'] = $cobAwsRes['Record']['AddressLine2'];
                $result['8404'] = $cobAwsRes['Record']['AddressLine1'];
                $result['8403'] = $cobAwsRes['Record']['EmailPrimary'];
                $result['8402'] = $cobAwsRes['Record']['PhoneMobile'];
                $result['8398'] = $cobAwsRes['Record']['MiddleInitial'];
                $result['8397'] = $cobAwsRes['Record']['FirstName'];
                $result['8396'] = $cobAwsRes['Record']['LastName'];
            }

            // using AWS S3 Bucket
            $result['dealer_options'] = $dealerOptionArrNew;
            $result['insurances'] = $insuranceArrNew;
            $result['motors'] = $motorsArrNew;
        }


        // USING HARDCODED PROPERTY IDS - CONFIRMED WITH ANIMESH
        // find property value for each instance of the corresponding class
        $requiredArr = array(7520, 3211, 3240, 6519, 6334, 3241, 6332, 6520, 3213, 6222, 6223, 6566, 6567, 6532, 6541, 6539, 6540, 6586,
            6612, 3219, 3218, 3220, 6613, 6657, 6624, 6623, 7431, 7467, 7649, 7644, 7645, 7646, 7469, 7478, 7476, 7474, 7475, 7445, 7446,
            6328, 6329, 6330, 6331, 6555, 6556, 6557, 6558, 6559, 6807, 3210, 7653, 7532, 7536, 7588, 6595, 6593, 6594, 6604, 6606, 6607,
            6618, 6622, 7557, 7571, 7572, 7634, 7565, 7482, 7483, 8241, 8242, 8245, 8243, 8160, 8204, 6544, 8183, 8187, 6534, 6535, 6536,
            6537, 6538, 6543, 6533, 6545, 6546, 6531, 6547, 8184, 8186, 8185, 8212, 8210, 8195, 8215, 8213, 8214, 8216, 8217, 8211, 8397,
            8398, 8396, 8414, 8412, 8388, 8402, 8413, 6316, 6318, 6317, 6320, 6322, 6548, 6549, 6550, 6551, 6552, 6553, 6554, 7988, 7989,
            7990, 7991, 8458, 8453, 8459, 8454, 8460, 8455, 8461, 8456, 8462, 8457, 8463, 8464, 8465, 8466, 8467, 8468, 8469, 8470, 8471,
            8472, 8473, 8474, 6588, 6323, 8403, 8415, 8416, 8417, 8418, 8419, 8420, 8421, 8404, 8405, 8406, 8407, 8408,
            6575, 6570, 6581, 6572, 6574, 6571, 6578, 6579);
        $dealOpResArr[] = array('node_instance_id' => $data['deal_instance_id']);
        foreach ($dealOpResArr as $opNid) {
            $temp = $this->getAllPropertyWithInstanceValues($opNid['node_instance_id'], array(), $data['label']);
            foreach ($temp as $k => $v) {
                if ($data['all'] == 'true') {
                    $result[$k] = $v;
                } else {
                    if (in_array($k, $requiredArr)) {
                        $result[$k] = $v;
                    }
                }
            }
        }

        return $result;
    }

    /*
     * Created By: Amit Malakar
     * Date: 16-Nov-16
     * Function to get Instance values of class subclass by properties
     * @param int
     * @param array
     * @return array
     */

    public function getAllPropertyWithInstanceValues($node_instance_id, $temp, $label)
    {
        if ($label == 'true') {
            $temp += $this->getNodeInstanceLabelValue($node_instance_id);
        } else {
            $temp += $this->getNodeInstanceValue($node_instance_id);
        }

        // if any subclasses, find instance node ids
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'ni.node_id = nxyr.node_y_id', array(), 'left');
        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id=nxyr.node_x_id', array('node_instance_id'), 'left');
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        if (count($nodeArray)) {
            $subClassInstanceIdArr = array_column($nodeArray, 'node_instance_id');
            foreach ($subClassInstanceIdArr as $subInsId) {
                $temp += $this->getAllPropertyWithInstanceValues($subInsId, $temp, $label);
            }
        }

        return $temp;
    }

    public function getChildClassInstancePrint($sub_class_node_id_array, $node_class_id, $temp_array)
    {
        $classObj = new ClassesTable($this->adapter);

        if (count($sub_class_node_id_array) > 0) {
            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {
                $node_instance_id = $classObj->getinstanceDetailsByNodeId($node_sub_class_id);
                if ($node_instance_id) {
                    $sub_class_node_id_new = $classObj->getNodeXIdFromXYTable($node_sub_class_id);
                    $temp_array['childs'][$node_instance_id] = $classObj->fetchNodeInstancePropertyPrint($node_instance_id);
                    if (count($sub_class_node_id_new) > 0) {
                        ++$i;
                        $temp_array[$i] = $this->getChildClassInstancePrint($sub_class_node_id_new, $node_class_id, array());
                    }
                }
            }
        }

        return $temp_array;
    }

    public function getClassPropertyList($nodeId)
    {
        $classObj = new ClassesTable($this->adapter);
        $value['nodeXY'] = $classObj->fetchNodeXY($nodeId['nodeId']);
        $value['nodeClassId'] = $classObj->fetchNodeClassId($value['nodeXY']);
        $commArr = $classObj->commonFetchNodeYX($nodeId['nodeId']);
        $nodeZ = "";
        foreach ($commArr as $nodeVal) {
            if ($nodeVal['node_type_id'] == 3) {
                $nodeZ.= $nodeVal['node_x_id'] . ',';
            }
        }
        $value['nodeZ'] = $nodeZ;
        $all = $value['nodeZ'];
        $value['nodeZStructure'] = $classObj->getNodeInstaceIdDetails($all, $value['nodeClassId']);
        return $value;
    }

    public function getTemplateType($nodeId)
    {
        $dialogue_class_id = DIALOGUE_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->AND->equalTo('ni.node_class_id', $dialogue_class_id);
        $select->where->AND->equalTo('ni.node_id', $nodeId['node_instance_id']);
        $select->where->AND->equalTo('ncp.caption', 'Dilaogue Template');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function checkPerformaceReviewDocId($post)
    {

        $deal_node_id = $post['deal_instance_id'];
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->AND->equalTo('ni.node_class_id', $post['classId']);
        $select->where->AND->equalTo('ni.node_id', $deal_node_id);
        $select->where->AND->equalTo('ncp.node_class_property_id', $post['docPropertyId']);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['value'];
    }

    public function setPerformanceReview($data, $structure)
    {

        $statementData = $data['document']['statementData'];
        $status = $data['saveType'];
        $dialogue_class_id = DIALOGUE_CLASS_ID;
        $document['dialogue_admin'] = json_decode($data['document']['dialogue_admin']);
        $typeArray = $this->getClassList($dialogue_class_id);
        $node_type_id = $typeArray['node_type_id'];
        $node_id = $data['edit_document_node_id'];
        $mapping_ins_id = intval($data['deam_mapping_node_id']);
        $operation_id = intval($data['operation_id']);
        if ($node_id == "") {
            $instance_id = 0;
        } else {
            $instance_id = $this->getNodeinstanceIDDetails($node_id);
        }
        if ($status == 0) {
            $saveType = 'D';
        } else {
            $saveType = 'P';
        }

        $instance_property_array = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $data['document']['dialogue_template'];
        $instance_property_array[3] = $data['document']['dialogue_title'];
        $instance_property_array[4] = $document['dialogue_admin'];
        $instance_property_array[5] = $data['document']['dialogue_timestamp'];


        // DIALOGUE CLASS
        $dialoguePropertiesArray = $this->getProperties($dialogue_class_id);
        foreach ($dialoguePropertiesArray as $key => $dialogueClassProperty) {
            $node_class_property_id[$key] = $dialogueClassProperty['node_class_property_id'];
        }

        $instance_caption = intval($instance_id) > 0 ? $instance_id : 0;



        if (intval($instance_id) > 0) {
            // fetch nod id on behalf on nstance id //
            $instance_caption = $this->getNodeIdDetails('node-instance', 'node_instance_id', $instance_id);
            $node_instance_id_dialogue = $this->createDataInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType, $instance_id);
            // update instance property //
            $this->updateSubInstancePropertyDataAgain($instance_property_array, $node_type_id, $node_instance_id_dialogue, $node_class_property_id);
            // ============
            $node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $instance_id);
            $node_x_id_array = $this->getNodeXIdFromXYTable($node_id);
            $individual_instance_id = count($node_x_id_array) ? array_pop($node_x_id_array) : '';
            // ============
            $node_id_dialogue = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);
        } else {
            $node_instance_id_dialogue = $this->createDataInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType);
            $this->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_dialogue, $node_type_id);
            $node_instance_id_dialogue_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);

            $data['value'] = $node_instance_id_dialogue_node_id;
            /* insert code add here add data in Mapping Deal Operation */
            $insId = $this->getNodeinstanceIDDetails($data['deal_node_id']);
            // insert code here for document id
            $data1['value'] = $node_instance_id_dialogue_node_id;
            $data1['node_class_property_id'] = $data['docPropertyId'];
            $data1['node_instance_id'] = $insId;
            $data1['node_id'] = $this->createNode();
            $data1['node_type_id'] = 2;
            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values($data1);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $resultObj->initialize($result);

            //$instanceArray = $this->createInstanceOfClass($data['node_class_id'], $status);
            //$this->createInstanceProperty($data['node_class_property_id'], $data['value'], $instanceArray['node_instance_id'], $instanceArray['node_type_id'], $data['is_email'], "", "");
            /* end code here */
        }


        // STATEMENT SUBCLASS
        //$dialogue_struc = $this->getClassPropertyStructure($dialogue_class_id);
        $statement_class_id = STATEMENT_CLASS_ID;
        $statementPropertiesArray = $this->getProperties($statement_class_id);
        $statement_node_x_id_array = $this->getInstaceIdByNodeXYAndNodeInstance($node_id, $statement_class_id);

        foreach ($statementPropertiesArray as $key => $statementClassProperty) {
            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
        }



        $classObj = new ClassesTable($this->adapter);
        $instance_property_array = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = "";
        $instance_property_array[3] = $statementData;
        $instance_property_array[4] = "";
        if (isset($statement_node_x_id_array[0]['node_x_id']) && $statement_node_x_id_array[0]['node_x_id'] > 0) {
            $node_instance_id_stmt = $classObj->getinstanceDetailsByNodeId($statement_node_x_id_array[0]['node_x_id']);
        } else {
            $node_instance_id_stmt = 0;
        }

        if ($node_instance_id_stmt > 0) {
            //update
            $node_instance_id = $classObj->createInstance($statement_node_x_id_array[$key]['node_x_id'], $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
            $classObj->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id_stmt, $node_class_property_id_stmt);
        } else {
            //insert
            $instance_caption = $node_instance_id_stmt;
            $node_instance_id = $classObj->createInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
            // create new instance property //
            $classObj->createInstanceProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
            //get node_id of node instance table for series class
            $node_id_dialogue = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id_dialogue);
            $stmt_node_id = $this->getNodeIdDetails('node-instance', 'node_instance_id', $node_instance_id);
            $stmt_node_ids = "," . $stmt_node_id;
            $this->saveNodeXRelation($node_id_dialogue, $stmt_node_ids);
        }



        return $node_id_dialogue;
    }

    public function getDealRejectionHistory($data)
    {
        $deal_rejection_class_id = $data['deal_rejection'];
        $deal_node_id = $data['deal_node_id'];
        $operation_role_node_id = $data['operation_role_node_id'];
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'ni.node_id = nxyr.node_y_id', array(), 'left');
        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id=nxyr.node_x_id', array('node_instance_id', 'node_class_id'), 'left');
        $select->where->AND->equalTo('ni.node_id', $deal_node_id);
        $select->where->AND->equalTo('ni1.node_class_id', $deal_rejection_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        $tempArr = array();
        $tempNewArr = array();
        foreach ($nodeArray as $key => $value) {
            $tempArr[$key] = $this->getNodeInstanceCaptionValue($value['node_instance_id']);
        }

        foreach ($tempArr as $keyV => $tmp) {
            if ($tmp['Current Role'] != "") {
                $tempRoleArr = $this->getRoleType($operation_role_node_id, $tmp['Current Role']);
                $tempUserArr = $userData = $this->getUserProfile($tmp['Current User'], INDIVIDUAL_CLASS_ID);

                $tempArr[$keyV]['Current Role'] = $tempRoleArr;
                $tempArr[$keyV]['Current User'] = $tempUserArr['email_address'];
            }
        }
        return $tempArr;
    }

    public function getRoleType($operation_role_node_id, $nodeId)
    {
        $instance_id = $this->getNodeinstanceIDDetails($nodeId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('value'), 'Left');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('ni.node_class_id', $operation_role_node_id);
        $select->where->equalTo('ni.node_instance_id', $instance_id);
        $select->where->equalTo('ncp.caption', 'Title');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray = $resultObj->initialize($result)->toArray();
        return $tempArray[0]['value'];
    }

    public function getNodeInstanceCaptionValue($node_instance_id)
    {
        $tempArray = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value', 'node_class_property_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $tempArray1 = array();
        foreach ($dataArray as $data) {
            $tempArray1[$data['node_class_property_id']][] = $data['value'];
        }
        foreach ($dataArray as $data) {
            if (count($tempArray1[$data['node_class_property_id']]) > 1) {
                $tempArray[$data['caption']] = implode(CHECKBOX_SEPERATOR, $tempArray1[$data['node_class_property_id']]) . CHECKBOX_SEPERATOR;
            } else {
                $tempArray[$data['caption']] = $data['value'];
            }
        }

        return $tempArray;
    }

    public function setLastVisitedOperation($post)
    {
        //$customerData                       = $builderApiObj->getInstanceListOfParticulerClass($post['instance_id'], 'class', 'node_id');
        //$customerData                       = json_decode($customerData, true);
    }

    public function isEmailExist($email_address)
    {
        $email_address = trim($email_address);
        $account_class_node_id = ACCOUNT_CLASS_ID;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value', 'node_instance_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('instanceNodeId' => 'node_id'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->AND->equalTo('ni.node_class_id', $account_class_node_id);
        $select->where->AND->equalTo('ncp.caption', 'Email Address');
        $select->where->AND->equalTo('nip.value', $email_address);
        $select->where->AND->equalTo('ni.status', 1);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $accountInfo = $resultObj->initialize($result)->toArray();
    }

    public function getPropertyByInstanceId($node_instance_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->where->equalTo('nip.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getNodeYIdFromXYTable($node_id)
    {
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
        return $impldeNX;
    }

    public function getSingleClassInstanceValue($data)
    {
        $nodeXId = $this->fetchNodeXY($data);
        if ($nodeXId != "" && !empty($nodeXId)) {
            $getClassId = $this->fetchAllNodeClassId($nodeXId);
        }
        return $getClassId;
    }

    public function fetchAllNodeClassId($nodeXY)
    {
        $sql = "SELECT GROUP_CONCAT(nc.node_id) AS `i_node_id`,`ni`.`node_id` AS `s_node_id`FROM `node-instance` AS `ni` INNER JOIN `node-class` AS `nc` ON `nc`.`node_class_id` = `ni`.`node_class_id` WHERE `ni`.`node_id` IN (" . $nodeXY . ") group by `ni`.`node_class_id`";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $classIdArray = $resultObj->initialize($result)->toArray();
        $tempArr = array();
        foreach ($classIdArray as $key => $value) {
            $checkExp = explode(",", $value['i_node_id']);
            if (count($checkExp) < 2) {
                $tempArr[$value['i_node_id']] = $value['s_node_id'];
            }
        }
        return $tempArr;
    }

    //******************************START******************FOR CONTROL MANAGEMENT CLASS****************************************************************
// ADDED BY- GAURAV DUTT PANCHAL
// DATE- 8 DEC, 2016
    /**
     *
     * @param type $instanceId
     * @param type $mainRoleId
     * @return array
     */
    public function setManageControlRoleInstance($instanceId, $mainRoleId)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value' => 'value'));
        $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ni.node_class_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->AND->equalTo('ni.node_class_id', MANAGE_CONTROL_CLASS_ID);
        $select->where->AND->equalTo('ncp.node_class_property_id', MANAGE_CONTROL_ROLE_PROPERTY_ID);
        $select->where->AND->equalTo('nip.value', $mainRoleId);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->notequalTo('ni.node_instance_id', $instanceId);


        //echo $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $impldeNX = array();
        foreach ($dataArray as $key => $value) {
            $impldeNX[] = $value['node_instance_id'];
        }
        return $impldeNX;
    }
    /**
     * * Added by Gaurav
     * Added comment:- 1/6/2017
     * @param type $instanceArr
     * @return type
     */
    public function updateManageControlRoleInstance($instanceArr)
    {

        $affectedRows = 0;
        if (count($instanceArr) > 0) {
            $sql = new Sql($this->adapter);
            $data['value'] = 'False';
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where->equalTo('node_class_property_id', IS_CURRENT_VERSION_PROPERTY_ID);
            $query->where->AND->IN('node_instance_id', $instanceArr);
            //return $query->getSqlString();
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $affectedRows = $result->getAffectedRows();
        }
        return $affectedRows;
    }
/**
 *
 * @param type $nodeInstanceId
 * @return type
 */
    public function getDealDetails($nodeInstanceId)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL getDealDetails(' . DEAL_CLASS . ', ' . DEAL_CURRENT_VERSION_PROPERTY_ID . ', ' . $nodeInstanceId . ');';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('ni' => 'node-instance'));
            $select->columns(array('node_instance_id', 'status', 'node_id'));
            $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value' => 'value'));
            $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ni.node_class_id', array());
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
            $select->where->AND->equalTo('ni.node_class_id', DEAL_CLASS);
            $select->where->AND->equalTo('ncp.node_class_property_id', DEAL_CURRENT_VERSION_PROPERTY_ID);
            $select->where->AND->equalTo('ni.node_id', $nodeInstanceId);


            //return $select->getSqlString();

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }
        $impldeNX = array();

        foreach ($dataArray as $key => $value) {
            $impldeNX['node_instance_id'] = $value['node_instance_id'];
            $impldeNX['control_version_id'] = $value['value'];
            $impldeNX['status'] = $value['status'];
        }

        return $impldeNX;
    }

    /**
     * Modified by: Amit Malakar
     * Date: 22-Feb-2017
     * Get Deal passed by role array (from, to)
     * @param $instanceId
     * @param $instanceNodeId
     * @return array
     */
    public function checkDealInPassedByRoles($instanceId, $instanceNodeId)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL checkDealInPassedByRoles(' . PASSED_DEAL_BY_ROLES_CLASS_ID . ', ' . PASSED_DEAL_D_PID . ', ' . PASSED_DEAL_A_PID . ', ' . PASSED_DEAL_FR_PID . ', ' . PASSED_DEAL_TR_PID . ', ' . $instanceNodeId . ');';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('deal' => 'value', 'node_instance_id'));
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
            $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array());
            $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip1.node_instance_id', array('from_role' => 'value'));
            $select->join(array('nip3' => 'node-instance-property'), 'nip3.node_instance_id = nip2.node_instance_id', array('from_to' => 'value'));
            $select->where->equalTo('ncp.node_class_id', PASSED_DEAL_BY_ROLES_CLASS_ID);
            $select->where->AND->equalTo('nip.node_class_property_id', PASSED_DEAL_D_PID);
            $select->where->AND->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
            $select->where->AND->equalTo('nip2.node_class_property_id', PASSED_DEAL_FR_PID);
            $select->where->AND->equalTo('nip3.node_class_property_id', PASSED_DEAL_TR_PID);
            $select->where->AND->equalTo('nip.value', $instanceNodeId);
            $select->where->AND->equalTo('nip1.value', 1);

            //return $select->getSqlString();

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }

        return current($dataArray);
    }
/**
 * * Added by Gaurav
 * Added on comment:- 1/6/2017
 * @param type $controlVersionId
 * @param type $toRoleId
 * @return type
 */
    public function checkInPassedDealsByRolesCls($controlVersionId, $toRoleId)
    {


        $controlArray = array_filter(explode(',', $controlVersionId));
        $sql = "SELECT `ni`.`node_id` AS `active_node_id`, `ni`.`node_instance_id` AS `active_instance_id`, `nip1`.`value` AS `active_role_id`
                    FROM `node-instance-property` AS `nip`
                    INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
                    INNER JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id`
                    WHERE `nip1`.`node_class_property_id` = " . MANAGE_CONTROL_ROLE_PROPERTY_ID . " AND `nip1`.`value` = " . $toRoleId . "
                        AND `ni`.`node_id` IN (" . rtrim($controlVersionId, ',') . ")
                    GROUP BY `nip1`.`node_instance_id`";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return current($dataArray);
        /* $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->columns(array());
          $select->from(array('nip' => 'node-instance-property'));
          $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('active_node_id' => 'node_id', 'active_instance_id' => 'node_instance_id'));
          $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('active_role_id' => 'value'));
          $select->where->AND->equalTo('nip1.node_class_property_id', MANAGE_CONTROL_ROLE_PROPERTY_ID);
          $select->group('nip1.node_instance_id');
          $select->where->AND->equalTo('nip1.value', $toRoleId);
          $select->where->IN('ni.node_id', $controlArray);
          //return $select->getSqlString();

          $statement = $sql->prepareStatementForSqlObject($select);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $dataArray = $resultObj->initialize($result)->toArray();

          return current($dataArray); */
    }

//******************************END******************FOR CONTROL MANAGEMENT CLASS****************************************************************
    /**
     * Modified by: Kunal
     * Date: 06-Mar-2017
     * Update operation form data on document save,remove old code which was not working properly
     * @param $property_key
     * @param $fld_property
     * @param $insId
     * @return $instanceNodeId
     */
    public function getmapOperationFormData($property_key, $fld_property, $insId)
    {


        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from('node-instance-property');
        $delete->where->equalTo('node_instance_id', $insId);
        $delete->where->AND->equalTo('node_class_property_id', $property_key);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();

        if (substr($fld_property, -3) == CHECKBOX_SEPERATOR) {
            $newValArray = explode(CHECKBOX_SEPERATOR, $fld_property);
            $return_arr = array();
            foreach ($newValArray as $k => $v) {
                if (trim($v) != "") {
                    $data = array();
                    $data['value'] = htmlspecialchars($v);  // modified code section awdhesh soni
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_instance_id'] = $insId;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = 2;
                    $data['node_class_property_id'] = $property_key;

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-instance-property');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $return_arr[] = $this->adapter->getDriver()->getLastGeneratedValue();
                }
            }
            return $return_arr;
        } else {
            $data = array();
            $data['value'] = $fld_property;
            $data['encrypt_status'] = ENCRYPTION_STATUS;
            $data['node_instance_id'] = $insId;
            $data['node_id'] = $this->createNode();
            $data['node_type_id'] = 2;
            $data['node_class_property_id'] = $property_key;
            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values($data);
            //return $query->getSqlString();
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();

            return $this->adapter->getDriver()->getLastGeneratedValue();
        }
    }
/**
 *
 * @param type $class_id
 * @param type $instance_id
 * @param type $deal_instance_node_id
 * @return type
 */
    public function getInstanceofPassDealClass($class_id, $instance_id, $deal_instance_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('deal_value' => 'value'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('node_instance_property_id' => 'node_instance_property_id', 'value' => 'value', 'value' => 'value', 'node_class_property_id' => 'node_class_property_id'));
        $select->where->equalTo('ni.node_class_id', $class_id);
        $select->where->equalTo('nip.node_class_property_id', PASSED_DEAL_D_PID);
        $select->where->equalTo('nip.value', $deal_instance_node_id);
        $select->where->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
        $select->where->equalTo('nip1.value', 1);
        $select->where->AND->notequalTo('ni.node_instance_id', $instance_id);
        $select->order(array('nip.node_instance_property_id DESC'));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $impldeNX = array();
        foreach ($dataArray as $key => $value) {
            $impldeNX[] = $value['node_instance_property_id'];
        }

        return $impldeNX;
    }

    public function updateInstanceofPassDealClass($nodeInstancePropertyIdArr, $condition, $value)
    {
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        if ($value != '') {
            $data['value'] = $value;
        } else {
            $data['value'] = 0;
        }
        $query->table('node-instance-property');
        $query->set($data);
        $query->where->IN('node_instance_property_id', $nodeInstancePropertyIdArr);
        if ($condition != '') {
            $query->where->AND->notequalTo('value', $condition);
        }
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $affectedRows = $result->getAffectedRows();
        return $affectedRows;
    }

    public function getRaRoleDetails($loginRoleId, $loginUserId)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_instance_id' => 'node_instance_id', 'role_id' => 'value'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('actor_id' => 'value'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip1.node_instance_id', array('node_instance_property_id' => 'node_instance_property_id', 'count' => 'value'));
        $select->where->AND->equalTo('nip.node_class_property_id', RA_MANAGER_ROLE);
        $select->where->AND->equalTo('nip.value', $loginRoleId);
        $select->where->AND->equalTo('nip1.node_class_property_id', RA_MANAGER_ACTOR);
        $select->where->AND->equalTo('nip1.value', $loginUserId);
        $select->where->AND->equalTo('nip2.node_class_property_id', RA_MANAGER_COUNT);

        // return $select->getSqlString();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $impldeNX = array();
        $i = 0;
        foreach ($dataArray as $key => $value) {
            $impldeNX[$i]['node_instance_property_id'] = $value['node_instance_property_id'];
            $impldeNX[$i]['node_instance_id'] = $value['node_instance_id'];
            $impldeNX[$i]['role_id'] = $value['role_id'];
            $impldeNX[$i]['actor_id'] = $value['actor_id'];
            $impldeNX[$i]['count'] = $value['count'];
            $i++;
        }

        return $impldeNX;
    }

    public function updateRaRoleDetails($instPropertyArr, $count)
    {
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $data['value'] = $count;
        $query->table('node-instance-property');
        $query->set($data);
        $query->where->IN('node_instance_property_id', $instPropertyArr);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $affectedRows = $result->getAffectedRows();
        return $affectedRows;
    }

    public function getDealSize($instanceId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->where->AND->equalTo('nip.node_instance_id', $instanceId);
        $select->where->AND->equalTo('nip.node_class_property_id', DEAL_SIZE);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $dealSize = '';
        foreach ($dataArray as $key => $value) {
            $dealSize = $value['value'];
        }
        return $dealSize;
    }

    public function checkInArchivedStatus($instanceNodeId)
    {
        if (USE_STORED_PROCEDURE) {
            $sqlQuery = 'CALL checkInArchivedStatus("' . PASSED_DEAL_BY_ROLES_CLASS_ID . '", "' . PASSED_DEAL_D_PID . '", "' . PASSED_DEAL_A_PID . '", "' . $instanceNodeId . '",3);';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
            $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array());
            $select->where->equalTo('ncp.node_class_id', PASSED_DEAL_BY_ROLES_CLASS_ID);
            $select->where->AND->equalTo('nip.node_class_property_id', PASSED_DEAL_D_PID);
            $select->where->AND->equalTo('nip1.node_class_property_id', PASSED_DEAL_A_PID);
            $select->where->AND->equalTo('nip.value', $instanceNodeId);
            $select->where->AND->equalTo('nip1.value', 3);
            //return $select->getSqlString();

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }

        return count($dataArray);
    }

    public function assignRoleOfRa($post)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->where->equalTo('nip.node_instance_id', $post['map_role_actor_node_instance_id']);
        $select->where->AND->equalTo('nip.node_class_property_id', $post['pid']);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        if (count($dataArray) == 0) {
            $data = array();
            $data['encrypt_status'] = ENCRYPTION_STATUS;
            $data['node_instance_id'] = $post['map_role_actor_node_instance_id'];
            $data['node_id'] = $this->createNode();
            $data['node_type_id'] = 2;
            $data['node_class_property_id'] = $post['pid'];
            $data['value'] = $post['actor_node_id'];

            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values($data);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $affectedRows = $result->getAffectedRows();
        } else {
            $data = array();
            $data['value'] = $post['actor_node_id'];
            $sql = new Sql($this->adapter);
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where->equalTo('node_instance_id', $post['map_role_actor_node_instance_id']);
            $query->where->AND->equalTo('node_class_property_id', $post['pid']);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $affectedRows = $result->getAffectedRows();
        }
        return array($post, $affectedRows);
    }

    public function getClassNidFromView($node_id)
    {
        $class_property_id = 2950;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_instance_id = ni.node_instance_id', array('node_instance_id', 'value'), '');
        $select->where->equalTo('ni.node_id', $node_id);
        $select->where->AND->equalTo('ncp.node_class_property_id', $class_property_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        return $dataArray[0]['value'];
    }

    public function marinemaxIndiDelete($post)
    {
        if ($post['status'] == 'delete') {
            $forIndiQuery = "SELECT nit.node_instance_id FROM `node-instance` as nit WHERE nit.`node_id` IN (SELECT node_y_id FROM `node-x-y-relation` WHERE node_x_id IN (SELECT ni1.node_id FROM `node-instance` as ni1 INNER JOIN `node-instance-property` as ni2 ON ni2.node_instance_id = ni1.node_instance_id AND ni2.node_class_property_id = 2927 AND ni2.value = 'www.marinemax.com' WHERE ni1.`node_class_id` = 633))";
            $statement = $this->adapter->query($forIndiQuery);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $indiArray = $resultObj->initialize($result)->toArray();

            $forAccountQuery = "SELECT nit.node_instance_id FROM `node-instance` as nit WHERE nit.`node_id` IN (SELECT nxy.node_x_id FROM `node-x-y-relation` as nxy INNER JOIN `node-instance` as ni ON ni.node_id = nxy.node_x_id AND ni.node_class_id = 634 WHERE node_y_id IN (SELECT node_y_id FROM `node-x-y-relation` WHERE node_x_id IN (SELECT ni1.node_id FROM `node-instance` as ni1 INNER JOIN `node-instance-property` as ni2 ON ni2.node_instance_id = ni1.node_instance_id AND ni2.node_class_property_id = 2927 AND ni2.value = 'www.marinemax.com' WHERE ni1.`node_class_id` = 633)))";
            $statement = $this->adapter->query($forAccountQuery);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $accountArray = $resultObj->initialize($result)->toArray();

            $forRoleQuery = "SELECT nit.node_instance_id FROM `node-instance` as nit WHERE nit.`node_id` IN (SELECT ni1.node_id FROM `node-instance` as ni1 INNER JOIN `node-instance-property` as ni2 ON ni2.node_instance_id = ni1.node_instance_id AND ni2.node_class_property_id = 2927 AND ni2.value = 'www.marinemax.com' WHERE ni1.`node_class_id` = 633)";
            $statement = $this->adapter->query($forRoleQuery);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $roleArray = $resultObj->initialize($result)->toArray();

            $account = array();
            foreach ($accountArray as $key => $value) {
                if ($value['node_instance_id'] != '') {
                    $account[] = $value['node_instance_id'];
                }
            }

            if (count($account) > 0) {
                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance-property');
                $delete->where->IN('node_instance_id', $account);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();

                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance');
                $delete->where->IN('node_instance_id', $account);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();
            }

            $indi = array();
            foreach ($indiArray as $key => $value) {
                if ($value['node_instance_id'] != '') {
                    $indi[] = $value['node_instance_id'];
                }
            }

            if (count($indi) > 0) {
                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance-property');
                $delete->where->IN('node_instance_id', $indi);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();

                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance');
                $delete->where->IN('node_instance_id', $indi);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();
            }

            $role = array();
            foreach ($roleArray as $key => $value) {
                if ($value['node_instance_id'] != '') {
                    $role[] = $value['node_instance_id'];
                }
            }

            if (count($role) > 0) {
                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance-property');
                $delete->where->IN('node_instance_id', $role);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();

                $sql = new Sql($this->adapter);
                $delete = $sql->delete();
                $delete->from('node-instance');
                $delete->where->IN('node_instance_id', $role);
                $statement = $sql->prepareStatementForSqlObject($delete);
                $result = $statement->execute();
            }

            return array('individual' => $indi, 'account' => $account, 'role' => $role);
        } else {
            return 'you are execute wrong function.';
        }
    }

    public function getSingleValueOfAllInstanceByClass($data = array())
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array('status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
        $select->where->equalTo('ncp.node_class_id', 822);
        $select->where->equalTo('ni.status', 1);
        $select->where->AND->equalTo('nip.node_class_property_id', 7988);

        //return $select->getSqlString();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    public function getClassStructureWithHirerchy($node_y_class_id)
    {
        $sql = new Sql($this->adapter);


        $mainArray = array();
        $propArray = $this->getProperties($node_y_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if (intval($propv['node_class_property_parent_id']) == 0) {
                $mainPropArray[] = $propv;
            } else {
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }
        }

        $realPropArray = array();
        $mainArray = $this->getAllPropertyAgainKK($mainPropArray, $subPropArray, $realPropArray);


        return $mainArray;
    }

    public function getAllPropertyAgainKK($menu1, $menu2, $menuArray)
    {
        foreach ($menu1 as $key => $value) {
            $menuArray[$value['caption']] = $value['node_class_property_id'];
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['caption']] = $this->getAllPropertyAgainKK($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    public function getDealNumber($instanceId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value' => 'value', 'node_instance_property_id' => 'node_instance_property_id'));
        $select->where->AND->equalTo('nip.node_instance_id', $instanceId);
        $select->where->AND->equalTo('nip.node_class_property_id', DEAL_NUMBER);


        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $dealArr = array();
        foreach ($dataArray as $key => $value) {
            $dealArr['node_instance_property_id'] = $value['node_instance_property_id'];
            $dealArr['deal_number'] = $value['value'];
        }
        return $dealArr;
    }

    public function updateDealNumber($node_instance_property_id)
    {

        $sql = new Sql($this->adapter);
        $data['value'] = '1';
        $query = $sql->update();
        $query->table('node-instance-property');
        $query->set($data);
        $query->where(array('node_instance_property_id' => $node_instance_property_id));

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        return $result->getAffectedRows();
    }

    public function insertDealNumber($node_instance_id)
    {

        $data = array();
        $data['value'] = '1';  // modified code section awdhesh soni
        $data['node_instance_id'] = $node_instance_id;
        $data['node_id'] = $this->createNode();
        $data['node_type_id'] = 2;
        $data['node_class_property_id'] = DEAL_NUMBER;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance-property');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * Handle all POST request
     * @Purpose : Fetch all operation lists
     * @param $post
     * @return array of all properties values
     */
    public function getOperationList($post)
    {
        $role_n_id = $post['role_node_id'];
        $deal_n_id = $post['deal_node_id'];
        $node_instance_id = $this->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($deal_n_id))['node_instance_id'];
        $phase_type_property_id = (strtolower($post['status']) != 'all') ? $post['propertyId'] : '';
        $phase_type_property_value = (strtolower($post['status']) != 'all') ? strtolower($post['status']) : '';
        $super_admin = $post['super_admin'];

        $optional_operation = $post['optional_operation'];
        if ($post['propertyId'] == OPERATION_OTHER_ROLE_PERMISSION_PROPERTY_ID || $post['propertyId'] == OPERATION_READ_BY_PROPERTY_ID || $post['propertyId'] == OPERATION_EDITED_BY_PROPERTY_ID) {
            $operation_list = $this->getOtherRoleOperationList($role_n_id, $deal_n_id, $node_instance_id, $post['propertyId']);
        } elseif ($optional_operation == 'yes') {
            $operation_list = $this->getOptionalOperationListData($role_n_id, $node_instance_id);
        } else {
            $operation_list = $this->getOperationListData($role_n_id, $deal_n_id, $node_instance_id, $phase_type_property_id, $phase_type_property_value, $super_admin);
        }
        return $operation_list;
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * @Purpose : Get all optional and required operation node id and get all operation
     * @param $role_n_id : Login Role Id
     * @param $deal_n_id : Deal Instance Node Id
     * @param $node_instance_id : Deal Instance Id
     * @param $phase_type_property_id : Operation Phase Property Id (Cash,Finance,Posting etc.)
     * @param $phase_type_property_value : Operation Phase Property Value (Cash,Finance,Posting etc.)
     * @param $super_admin : Super Admin Role Noide Id
     * @return operation list array
     */
    public function getOperationListData($role_n_id, $deal_n_id, $node_instance_id, $phase_type_property_id, $phase_type_property_value, $super_admin)
    {
        $main_operation_list = array();

        //get Mapping Role Actor Instance Node Id
        $mapping_role_actor_id = $this->getInstanceNodeIdByTwoPropertyValue($role_n_id, $deal_n_id, ROLE_PID, DEAL_PID);
        $mapping_role_actor_ni_id = $mapping_role_actor_id[0]['node_id'];

        //fetch OPtional Operation instance Node ID
        $optional_operation_ni_id_array = array_column($this->getOperationMappingNodeID(array($mapping_role_actor_ni_id), MAPPING_ROLE_ACTOR_PID, OPERATION_PID), 'value');

        // Execute only for operation phases (Capping,posing,cashong etc.) to fetch optional operation instance node id
        if ($super_admin != 'true' && trim($phase_type_property_id) != '' && count($optional_operation_ni_id_array) > 0) {
            //fetch OPtional Operation instance Node ID
            $optional_operation_ni_id_array = array_column($this->getOperationMappingNodeIDByOperationPhase($optional_operation_ni_id_array, $phase_type_property_id, $phase_type_property_value), 'node_id');
        }

        //get Required Operation Instance Node ID
        $required_operation_nid_array = array_column($this->getInstanceNodeIdByTwoPropertyValue('Required', $role_n_id, OPERATION_TYPE_PROPERTY_ID, OPERATION_OWNED_BY_PROPERTY_ID), 'node_id');

        // Execute only for operation phases (Capping,posing,cashong etc.) to fetch required operation instance node id
        if ($super_admin != 'true' && trim($phase_type_property_id) != '' && count($required_operation_nid_array) > 0) {
            $required_operation_nid_array = array_column($this->getOperationMappingNodeIDByOperationPhase($required_operation_nid_array, $phase_type_property_id, $phase_type_property_value), 'node_id');
        }

        $operation_node_id_array = array_merge($optional_operation_ni_id_array, $required_operation_nid_array);

        if (count($operation_node_id_array)) {
            $propId1 = OPERATION_TRADE_IN_PROPERTY_ID;
            $propId2 = OPERATION_CONDITION_PROPERTY_ID;
            $propId3 = OPERATION_DEAL_TYPE_PROPERTY_ID;
            // Get operation list with deal condition
            $operation_list = $this->getOperationListByNodeIDAndDealCondition($propId1, $propId2, $propId3, $operation_node_id_array, $node_instance_id);
            // Make indexing of array
            $main_operation_list = $this->arrayIndexing($operation_list, 'nodeID');
        }
        return $main_operation_list;
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * @Purpose : This is common function, just pass two property id and it's values and return instance node id
     * @param $value1
     * @param $value2
     * @param $pid_for_value1
     * @param $pid_for_value2
     * @return Instance node id (node id of instance from node_instance table)
     */
    public function getInstanceNodeIdByTwoPropertyValue($value1, $value2, $pid_for_value1, $pid_for_value2)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array());
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip1.node_instance_id', array());
        $select->where->equalTo('nip1.value', $value1);
        $select->where->AND->equalTo('nip1.node_class_property_id', $pid_for_value1);
        $select->where('FIND_IN_SET(' . $value2 . ', nip2.value)');
        $select->where->AND->equalTo('nip2.node_class_property_id', $pid_for_value2);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * @Purpose : This is common function, just pass two property id and one's value and return another value
     * @param value1: $mapping_role_actor_ni_id
     * @param $mapping_role_actor_pid
     * @param $operation_pid
     * @return Instance node id
     */
    public function getOperationMappingNodeID($mapping_role_actor_ni_id, $mapping_role_actor_pid, $operation_pid)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip1' => 'node-instance-property'));
        $select->columns(array());
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = nip1.node_instance_id AND nip2.node_class_property_id = "' . $operation_pid . '"'), array('value'));
        $select->where->IN('nip1.value', $mapping_role_actor_ni_id);
        $select->where->AND->equalTo('nip1.node_class_property_id', $mapping_role_actor_pid);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * @Purpose : Get operation list with deal condition
     * @param $propId1,$propId2,$propId3 : Deal property id (Condition,Deal Type,Trade In)
     * @param $nodeIdArr : Operation instance node id
     * @param $node_instance_id : Deal INstance Node Id
     * @param $operation_property_string
     * @return array (Final Operation list)
     */
    public function getOperationListByNodeIDAndDealCondition($propId1, $propId2, $propId3, $nodeIdArr, $node_instance_id = '', $operation_property_string = '')
    {

        $class_property_ids = array(DEAL_TRADE_IN_PROPERTY_ID, DEAL_DESIGNATION_PROPERTY_ID, DEAL_PAYMENT_TYPE_PROPERTY_ID);
        $class_property_ids_array = $this->getPropertyValueByPropertyIDS($node_instance_id, $class_property_ids);
        $operation_property_string = ($operation_property_string == '') ? implode(",", json_decode(OPERATION_NODE_CLASS_PROPERTY_ID)) : $operation_property_string;

        $deal_condtition = $deal_trade_in_type = $deal_type = '';
        foreach ($class_property_ids_array as $key => $value) {
            if ($value['node_class_property_id'] == DEAL_TRADE_IN_PROPERTY_ID) {
                $deal_trade_in_type = strtolower($value['value']);
            } elseif ($value['node_class_property_id'] == DEAL_DESIGNATION_PROPERTY_ID) {
                $deal_condtition = strtolower($value['value']);
            } elseif ($value['node_class_property_id'] == DEAL_PAYMENT_TYPE_PROPERTY_ID) {
                $deal_type = (strtolower($value['value']) == 'financing') ? 'finance' : strtolower($value['value']);
            }
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('nodeID' => 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = nip1.node_instance_id AND nip.value LIKE "%' . $deal_trade_in_type . '%" AND nip.node_class_property_id=' . $propId1 . ' AND LOWER(nip1.value) LIKE "%' . $deal_condtition . '%" AND nip1.node_class_property_id=' . $propId2), array());
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = nip3.node_instance_id AND nip3.value IN ("' . $deal_type . '", "General") AND nip3.node_class_property_id=' . $propId3), array());
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id IN (' . $operation_property_string . ')'), array('*'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip2.node_class_property_id', array('caption'), '');
        $select->where->IN('ni.node_id', $nodeIdArr);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 20-Feb-2017
     * @Purpose : Manage Array on behalf of property id
     * @param array $operation_list_array
     * @param $indexkey
     * @return array of $operation_list_array according to key
     */
    public function arrayIndexing($operation_list_array, $indexkey)
    {
        $listarray = array();
        foreach ($operation_list_array as $key => $value) {
            $listarray[$value[$indexkey]][$value['caption']] = $value['value'];
        }
        return $listarray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 16-Feb-2017
     * @Purpose : Manage Array on behalf of property id for Operation Counting
     * @param array $operation_list_array
     * @param $indexkey
     * @return array of $operation_list_array according to key
     */
    public function arrayMenuCountIndexing($operation_list_array, $indexkey = '', $indexpropkey = '', $_role = '')
    {

        $listarray = array();
        $count = 0;
        foreach ($operation_list_array as $key => $value) {
            if ($_role == ROLE_SUPERADMIN) {
                $listarray[$value[$indexkey]][$indexpropkey] = $value[$indexpropkey];
                $listarray[$value[$indexkey]]['value'] = $value['value'];
            } else {
                $listarray[$value[$indexkey]][$count][$indexpropkey] = $value[$indexpropkey];
                $listarray[$value[$indexkey]][$count]['value'] = $value['value'];
                $count++;
            }
        }
        return $listarray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 15-Feb-2017
     * @Purpose : This is common function, just pass instance id and properties ids
     * @param $node_instance_id
     * @param $class_property_ids
     * @return array of all properties values
     */
    public function getPropertyValueByPropertyIDS($node_instance_id = '', $class_property_ids = array())
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('value', 'node_class_property_id'));
        $select->from('node-instance-property');
        $select->where->IN('node_class_property_id', $class_property_ids);
        $select->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 16-Feb-2017
     * @Purpose : get operation counting for operations
     * @param array $post
     * @return array of all node ids
     */
    public function getOperationMenuCount($post)
    {
        $deal_n_id = $post['data-node-id'];
        $node_instance_id = $post['deal_node_instance_id'];
        $role_id = $post['roleId'];

        if ($role_id == ROLE_SUPERADMIN) {
            $_roleId = $role_id;
            //get Mapping Role Actor Instance Node Id
            $mapping_role_actor_ni_ids = array_column($this->getMappingRoleActorForOperationCount($deal_n_id, DEAL_PID), 'node_id');

            $node_class_property_id = OPERATION_OWNED_BY_PROPERTY_ID;


            $required_operation_array = array_column($this->getMappingRoleActorForOperationCount('Required', OPERATION_TYPE_PROPERTY_ID), 'node_id');
        } else {
            $_roleId = '';
            //get Mapping Role Actor Instance Node Id
            $mapping_role_actor_id = $this->getInstanceNodeIdByTwoPropertyValue($role_id, $deal_n_id, ROLE_PID, DEAL_PID);
            $mapping_role_actor_ni_ids = array($mapping_role_actor_id[0]['node_id']);

            $node_class_property_id = implode(",", $post['node_class_property_id']);

            //get Required Operation Instance Node ID
            $required_operation_array = array_column($this->getInstanceNodeIdByTwoPropertyValue('Required', $role_id, OPERATION_TYPE_PROPERTY_ID, OPERATION_OWNED_BY_PROPERTY_ID), 'node_id');
        }

        //get Optional Operation Instance Node ID
        $optional_operation_array = array_column($this->getOperationMappingNodeID($mapping_role_actor_ni_ids, MAPPING_ROLE_ACTOR_PID, OPERATION_PID), 'value');

        //Total Optional and Required Operation Instance Node ID
        $operation_node_id_array = array_merge($optional_operation_array, $required_operation_array);

        if (count($operation_node_id_array)) {
            $propId1 = OPERATION_TRADE_IN_PROPERTY_ID;
            $propId2 = OPERATION_CONDITION_PROPERTY_ID;
            $propId3 = OPERATION_DEAL_TYPE_PROPERTY_ID;
            $operation_list = $this->getOperationListByNodeIDAndDealCondition($propId1, $propId2, $propId3, $operation_node_id_array, $node_instance_id, $node_class_property_id);
            $main_operation_list = $this->arrayMenuCountIndexing($operation_list, 'nodeID', 'node_class_property_id', $_roleId);
        }


        $final_operation_list = array();
        foreach ($main_operation_list as $key => $value) {
            if ($role_id == ROLE_SUPERADMIN) {
                if (strpos($value['value'], ',')) {
                    foreach (array_unique(explode(',', $value['value'])) as $key1 => $value1) {
                        $final_operation_list[$value['node_class_property_id']][$value1] = isset($final_operation_list[$value['node_class_property_id']][$value1]) ? $final_operation_list[$value['node_class_property_id']][$value1] + 1 : 1;
                    }
                } else {
                    $final_operation_list[$value['node_class_property_id']][$value['value']] = isset($final_operation_list[$value['node_class_property_id']][$value['value']]) ? $final_operation_list[$value['node_class_property_id']][$value['value']] + 1 : 1;
                }
            } else {
                foreach ($value as $key1 => $value1) {
                    $final_operation_list[$value1['node_class_property_id']][$value1['value']] = isset($final_operation_list[$value1['node_class_property_id']][$value1['value']]) ? $final_operation_list[$value1['node_class_property_id']][$value1['value']] + 1 : 1;
                }
            }
        }
        return $final_operation_list;
    }

    /**
     * Created By: Ben, Divya
     * Date: 17-Feb-2017
     * @Purpose : Fetch Mapping Role Actor
     * @param $value
     * @param $pid_for_value
     * @return array of all node ids
     */
    public function getMappingRoleActorForOperationCount($value, $pid_for_value)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array());
        $select->where->equalTo('nip1.value', $value);
        $select->where->AND->equalTo('nip1.node_class_property_id', $pid_for_value);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function locationRoleForStore($post)
    {

        $classObj = new ClassesTable($this->adapter);
        $insArray = $classObj->getInstanceListOfPerticulerClass(OPERATION_ROLE);
        $classArray = $classObj->getClassList(LOCATION_ROLE_DETAILS);
        $classArray['instances'] = $classObj->getClassStructure(LOCATION_ROLE_DETAILS);

        return array(
            'classArray' => $classArray,
            'classPropArray' => $insArray,
            'location' => $post['location']
        );
    }

    public function searchPropertyValueInAllClassInstances($data)
    {
        // node class id
        $nodeClassId = $data['node_class_id'];
        // node class property id
        $classPropertyId = $data['node_class_property_id'];
        // class property value
        $classPropertyValue = $data['value'];

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('instance_node_id' => 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('*'), 'left');
        $select->where->equalTo('ni.node_class_id', $nodeClassId);
        $select->where->AND->equalTo('nip.node_class_property_id', $classPropertyId);
        $select->where->AND->equalTo('nip.value', $classPropertyValue);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $resultArray = array();
        foreach ($dataArray as $key => $value) {
            $instanceNodeId = $value['instance_node_id'];
            if (isset($resultArray[$instanceNodeId])) {
                $resultArray[$instanceNodeId] += array($value['node_class_property_id'] => $value['value']);
            } else {
                $resultArray[$instanceNodeId] = array($value['node_class_property_id'] => $value['value']);
            }
        }

        return $resultArray;
    }

    /**
     * Created By: Ben, Divya
     * Date: 22-Feb-2017
     * @Purpose : Fetch all operations(optional)
     * @param $role_n_id
     * @param $node_instance_id
     * @return array of all properties values
     */
    public function getOptionalOperationListData($role_n_id, $node_instance_id)
    {
        $operation_node_id_array = array_column($this->getInstanceNodeIdByTwoPropertyValue('Optional', $role_n_id, OPERATION_TYPE_PROPERTY_ID, OPERATION_OWNED_BY_PROPERTY_ID), 'node_id');

        $main_operation_list = array();
        if (count($operation_node_id_array)) {
            $propId1 = OPERATION_TRADE_IN_PROPERTY_ID;
            $propId2 = OPERATION_CONDITION_PROPERTY_ID;
            $propId3 = OPERATION_DEAL_TYPE_PROPERTY_ID;
            // Get operation list with deal condition
            $operation_list = $this->getOperationListByNodeIDAndDealCondition($propId1, $propId2, $propId3, $operation_node_id_array, $node_instance_id);
            // Make indexing of array
            $main_operation_list = $this->arrayIndexing($operation_list, 'nodeID');
        }
        return $main_operation_list;
    }

    /**
     * Date: 2-Mar-2017
     * @Purpose : Get data of a particular instance
     * @param $data : Array
     * @return all values of a instance with nth level
     */
    public function getCourseClassData($data = array())
    {
        //return $this->childOfInstanceClasses();
        return $this->getCourseData($data['instanceNId']);
    }

    private function getCourseData($_instanceNId)
    {
        $_data = $this->getInstanceValues($_instanceNId);
        $_className = strtolower($_data['className']);
        $_childs = $this->getAllChilds($_instanceNId);
        if (count($_childs)) {
            foreach ($_childs as $key => $value) {
                $_tempArray = $this->getCourseData($value);
                if (array_key_exists(array_keys($_tempArray)[0], $_data)) {
                    $_data[array_keys($_tempArray)[0]][] = current(array_values($_tempArray));
                } else {
                    $_data[array_keys($_tempArray)[0]] = array_values($_tempArray);
                }
            }
        }
        return array($_className => $_data);
    }

    private function getInstanceValues($_instanceNId = '')
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_instance_id', 'value'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
        $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ni.node_class_id', array('class_name' => 'caption'));
        $select->where->equalTo('ni.node_id', $_instanceNId);
        $select->where->AND->notEqualTo('ni.node_class_id', '165');
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $this->courseArrayIndexing($resultObj->initialize($result)->toArray());
    }

    private function getAllChilds($_instanceNId = '')
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->columns(array('node_x_id'));
        $select->where->equalTo('node_y_id', $_instanceNId);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return array_column($resultObj->initialize($result)->toArray(), 'node_x_id');
    }

    private function courseArrayIndexing($_data = array())
    {
        $_indexedArray = array();
        foreach ($_data as $key => $value) {
            $_indexedArray['nodeInstanceId'] = $value['node_instance_id'];
            $_indexedArray['className'] = $value['class_name'];
            /* if($value['caption'] == 'Coursedata'){
              $value['value'] = base64_decode($value['value']);
              } */
            $_indexedArray[$value['caption']] = $value['value'];
        }
        return $_indexedArray;
    }

    /**
     * Created By: Divya Rajput
     * Date: 6-March-2017
     * @Purpose : For deleting Instance Value For Optional Operation
     * @param $node_instance_id
     */
    public function deleteOptionalOperationInstanceDataValue($dataArray)
    {
        $classObj = new ClassesTable($this->adapter);

        $node_instance_property_id_array = array_column($dataArray, 'node_instance_property_id');
        $node_id_array = array_unique(array_column($dataArray, 'node_id'));
        $nip_node_id_array = array_unique(array_column($dataArray, 'nip_node_id'));
        $nodeArray = array_unique(array_merge($node_id_array, $nip_node_id_array));
        $node_instance_ids = array_unique(array_column($dataArray, 'node_instance_id'));

        if (count($node_instance_property_id_array) > 0) {
            $classObj->commonDeleteMethod('node-instance-property', 'node_instance_property_id', $node_instance_property_id_array, 'in');
        }
        $classObj->commonDeleteMethod('node-instance', 'node_instance_id', $node_instance_ids, 'in');
        $classObj->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
        $classObj->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
        $classObj->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
    }

    /**
     * Parent Of SubInstanceClasses
     * @param type $_classNID
     * @return type
     */
    public function parentOfSubInstanceClasses($_classNID = '')
    {
        return $this->adapter;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->quantifier('DISTINCT');
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = 364'), array());
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = 9148'), array());
        $select->join(array('nc' => 'node-class'), 'nc.node_id = nip.value', array('class_name' => 'caption', 'class_id' => 'node_class_id'));
        $select->where->equalTo('nxyr.node_y_id', 1871361);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /**
     * Child Of InstanceClasses
     * @param type $_classNID
     * @return type
     */
    public function childOfInstanceClasses($_classNID = '')
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->quantifier('DISTINCT');
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array());
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array());
        $select->join(array('nc' => 'node-class'), 'nc.node_id = nxyr.node_y_id', array('class_name' => 'caption', 'class_id' => 'node_class_id'));
        $select->where->equalTo('ni.node_class_id', 364);
        $select->where->AND->equalTo('nip.value', 1871279);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /**
     * Function to return UserNodeID
     * @param type $ins_id
     * @return type Integer
     */
    public function getUserNodeInstanceId($ins_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array());
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nip.value', array('node_instance_id'));
        $select->where->equalTo('nip.node_instance_id', $ins_id);
        $select->where->AND->equalTo('nip.node_class_property_id', STATEMENT_ACTOR_AUTHOR);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $InstanceID = $resultObj->initialize($result)->toArray();
        return $InstanceID[0]['node_instance_id'];
    }

    /*
     * End of Get data of a particular instance
     */

    /**
     * Validate user from api
     * @param type $array of post data
     * @return type
     */
    /* Comment code BY: Divya Rajput
     * Date: 13-june-2017
     * Purpose: As we are using same service for web and app, so we are using same function loginUser() for web and app instead of apiLoginUser()
     *
     * public function apiLoginUser($data) {

        $data['node_class_property_id_emailaddress'] = INDIVIDUAL_EMAIL_ID;
        $data['node_class_property_id_password'] = ACCOUNT_PASSWORD_ID;
        $data['node_id'] = ACCOUNT_CLASS_NODE_ID;


        $temp = $this->getPerticulerData('node-class', array('node_class_id'), 'node_id', $data['node_id'], 0);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nii' => 'node-instance'));
        $select->join(array('ni' => 'node-instance-property'), 'ni.node_instance_id = nii.node_instance_id', array('node_instance_id', 'node_class_property_id', 'value'), 'inner');
        $select->where->equalTo('nii.node_class_id', $temp['node_class_id']);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $classArray = $resultObj->initialize($result)->toArray();
        //return $select->getSqlString()

        $node_class_property_id_emailaddress = $data['node_class_property_id_emailaddress'];
        $emailaddress = strtolower($data['emailaddress']);
        $node_class_property_id_password = $data['node_class_property_id_password'];
        $password = $data['password'];
        $node_instance_id = '';
        foreach ($classArray as $key => $value) {
            if ($emailaddress == strtolower($value['value']) && intval($node_class_property_id_emailaddress) == intval($value['node_class_property_id'])) {
                $node_instance_id = $value['node_instance_id'];
            }
        }

        $userArray = array();
        if (trim($node_instance_id) != '') {

            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nii' => 'node-instance-property'));
            $select->where->equalTo('nii.node_instance_id', $node_instance_id);
            $select->where->And->equalTo('nii.node_class_property_id', $node_class_property_id_password);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $passArray = $resultObj->initialize($result)->toArray();

            if (trim($passArray[0]['value']) == trim($password)) {
                $temp = $this->getPerticulerData('node-instance', array('node_id'), 'node_instance_id', $node_instance_id, 0);

                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('nip' => 'node-x-y-relation'));
                $select->where->equalTo('nip.node_x_id', $temp['node_id']);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $newArray = $resultObj->initialize($result)->toArray();

                if ($newArray[0]['node_y_id'] != '') {
                    $userArray = $this->getUserProfile($newArray[0]['node_y_id'], INDIVIDUAL_CLASS_ID);
                    $userArray['node_id'] = $newArray[0]['node_y_id'];
                    $individualInstanceId = $this->getTableCols(array('node_instance_id'), 'node-instance', array('node_id'), array($userArray['node_id']))['node_instance_id'];
                    $userArray['instance_id'] = $individualInstanceId;
                }
            }
        }



        $rolesArray = array();
        if (intval($userArray['node_id']) > 0) {
            $allRolesArray = $this->getInstanceListOfParticulerClass(LOCATION_ROLE_DETAILS, 'class', 'node_instance_id');

            foreach ($allRolesArray as $key => $value) {
                if (intval($value['ActorNID']) == intval($userArray['node_id'])) {
                    if (trim($value['RoleNID']) != '')
                        $rolesArray[$value['RoleNID']] = $value['RoleNID'];
                }
            }

            $allRolesArray = $this->getInstanceListOfParticulerClass(OPERATION_ROLE_CLASS_ID, 'class', 'node_id');
            $index = 0;
            $newRoleArray = array();
            foreach ($rolesArray as $key => $value) {
                $newRoleArray[$index]['id'] = $key;
                $newRoleArray[$index]['name'] = $allRolesArray[$key]['Title'];
                $index++;
            }

            $userArray['rolesArray'] = $newRoleArray;
        }

        return $userArray;
    }*/

    /**
     *
     * @param type $table Pass table name for
     * @param type $condArr make an array of condition of columns and with key value pair
     * @return type interger to number of rows
     */
    public function checkInstancePropValExist($table, $condArr)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from($table);
        $i = 0;
        // Make all condition
        foreach ($condArr as $key => $val) {
            if ($i == 0) {
                $select->where->equalTo($key, $val);
            } else {
                $select->where->AND->equalTo($key, $val);
            }

            $i++;
        }
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassXArray = $resultObj->initialize($result)->toArray();
        return count($nodeClassXArray); //return no. of rows
    }

    /**
     *
     * @param type $table Table name for fetch data
     * @param type $propVal key/value pair data to insert
     */
    public function insertInstPropVal($table, $propVal)
    {

        $sql = new Sql($this->adapter);
        $select = $sql->insert($table);
        $select->values($propVal);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $statement->execute();
    }

    /**
     *
     * @param type $table Table name for update data
     * @param type $propVal key/value pair data to update
     * @param type $condArr condition array for key/value pair data to update
     */
    public function updateInstPropVal($table, $propVal, $condArr)
    {

        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table($table);
        $query->set($propVal);
        $i = 0;
        foreach ($condArr as $key => $val) {
            if ($i == 0) {
                $query->where->equalTo($key, $val);
            } else {
                $query->where->AND->equalTo($key, $val);
            }

            $i++;
        }
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        return $result->getAffectedRows();
    }

    /**
     *
     * @param type $instanceId pass instance id
     * @param type $tokenValue token value of device for api
     * @return type
     */
    public function updateDeviceTokenVal($instanceId, $tokenValue)
    {

        $condArr = array();
        $res = array();
        $res['status'] = '1';

        $condArr['node_instance_id'] = $instanceId;
        $condArr['node_class_property_id'] = INDIVIDUAL_DEVICE_TOKEN;
        //Delete multiple device
        $this->deleteDeviceTokens($tokenValue);
        //Check if data is alreay in database
        $existence = $this->checkInstancePropValExist('node-instance-property', $condArr);
        //return $existence;
        //If data is already present
        if ($existence) {
            $propVal = array();
            $propVal['value'] = $tokenValue;

            $updateCondArr = array();
            $updateCondArr['node_instance_id'] = $instanceId;
            $updateCondArr['node_class_property_id'] = INDIVIDUAL_DEVICE_TOKEN;
            //update row
            $rowEffected = $this->updateInstPropVal('node-instance-property', $propVal, $updateCondArr);
            if ($rowEffected > 0) {
                $res['message'] = 'Device token has been updated.';
            } else {
                $res['message'] = 'Device token has not been updated.';
                $res['status'] = '0';
            }
        } else {
            $propVal = array();
            $propVal['node_instance_id'] = $instanceId;
            $propVal['node_class_property_id'] = INDIVIDUAL_DEVICE_TOKEN;
            $propVal['node_id'] = $this->createNode();
            $propVal['node_type_id'] = 2;
            $propVal['value'] = $tokenValue;
            $propVal['encrypt_status'] = 0;
            //insert data
            $this->insertInstPropVal('node-instance-property', $propVal);
            $res['message'] = 'Device token has been inserted.';
        }
        return $res;
    }

    /*
     * Created By: Divya Rajput
     * On Date: 3-May-2017
     * Purpose: Fetch User Details From Individual/Role/Account Class on specific property ids by using email address and password
     * @param: array $data
     * @param: return array
     */
    private function fetchLoginUserData($data)
    {
        $emailaddress_property_id = $data['emailaddress_property_id'];
        $password_property_id = $data['password_property_id'];
        $emailaddress = strtolower($data['emailaddress']);
        $password = $data['password'];
        $individual_prop_ids = $data['individual_prop_ids'];
        $role_prop_ids = $data['role_prop_ids'];

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni1' => 'node-instance'));
        $select->columns(array('status'));
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_class_property_id='.$password_property_id), array('password'=>'value'), '');
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id=nip1.node_instance_id AND (nip2.node_class_property_id='.$emailaddress_property_id.' AND nip2.value="'.$emailaddress.'")'), array(), '');
        $select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id=nip1.node_instance_id AND nip5.node_class_property_id="'.ACCOUNT_STATUS_ID.'"'), array('account_status'=>'value'), 'LEFT');
        $select->join(array('nxyr1' => 'node-x-y-relation'), "nxyr1.node_x_id = ni1.node_id", array('node_id' => 'node_y_id'), '');
        $select->join(array('ni2' => 'node-instance'), "ni2.node_id = nxyr1.node_y_id", array('node_instance_id'), '');
        $select->join(array('nip3' => 'node-instance-property'), "nip3.node_instance_id=ni2.node_instance_id", array('value1'=>'value'), '');
        $select->join(array('ncp3' => 'node-class-property'), new Predicate\Expression('ncp3.node_class_property_id = nip3.node_class_property_id AND ncp3.node_class_property_id IN ('.$individual_prop_ids.')'), array('caption1' => new Predicate\Expression('LOWER(REPLACE(ncp3.caption, " ", "_"))')), '');
        $select->join(array('nxyr2' => 'node-x-y-relation'), "nxyr2.node_y_id = nxyr1.node_y_id", array('node_x_id'), '');
        $select->join(array('ni3' => 'node-instance'), "ni3.node_id =  nxyr2.node_x_id", array(), '');
        $select->join(array('nip4' => 'node-instance-property'), "nip4.node_instance_id = ni3.node_instance_id", array('value2'=>'value'), '');
        $select->join(array('ncp4' => 'node-class-property'), new Predicate\Expression('ncp4.node_class_property_id = nip4.node_class_property_id AND ncp4.node_class_property_id IN ('.$role_prop_ids.')'), array( 'caption2' => new Predicate\Expression('LOWER(REPLACE(ncp4.caption, " ", "_"))') ), '');
        $select->where->equalTo('ni1.node_instance_id', new Predicate\Expression('nip1.node_instance_id'));
        //echo $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /*
     * Created By: Divya Rajput
     * On Date: 3-May-2017
     * Purpose: Fetch roles array From joining of Operation and Location Class on behalf of Individual Node ID
     * @param: $node_id
     * @param: return array
     */
    private function fetchLoginUserRoleData($node_id)
    {
        $sql = new Sql($this->adapter);

        $subQuery = $sql->select();
        $subQuery->from(array('ni' => 'node-instance'));
        $subQuery->columns(array());
        $subQuery->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array(), '');
        $subQuery->join(array('ncp' => 'node-class-property'), new Predicate\Expression('ncp.node_class_property_id = nip.node_class_property_id AND ncp.node_class_property_id IN ('.LOCATION_ROLE_RNID.', '.LOCATION_ROLE_ANID.')'), array(), '');
        $subQuery->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id = '.LOCATION_ROLE_RNID), array('value'), '');
        $subQuery->where->equalTo('ni.node_class_id', LOCATION_ROLE_DETAILS);
        $subQuery->where->equalTo('nip.value', $node_id);
        $subQuery->where->equalTo('nip.node_class_property_id', LOCATION_ROLE_ANID);
        $subQuery->order('ni.node_instance_id ASC');

        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('id' => 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('name' => 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array(), '');
        $select->where->equalTo('ni.node_class_id', OPERATION_ROLE_CLASS_ID);
        $select->where->equalTo('nip.node_class_property_id', '3293');
        $select->where->in('ni.node_id', $subQuery);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    public function getDialogueListOfParticulerCourse($data)
    {
        $courses = $this->getInstanceListOfParticulerClass(COURSE_CLASS_ID, 'class', 'node_id');
        foreach ($courses as $courseNodeId => $course) {
            $sql                            = new Sql($this->adapter);
            $subSelect                      = $sql->select();
            $subSelect->from(array('nxyr' => 'node-x-y-relation'));
            $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
            $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('status'=>'status','dialogue_instance_id'=>'node_instance_id'));
            $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.DIALOGUE_TITLE_ID), array('dialogue_title'=>'value'));
            $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_TIMESTAMP_ID), array('created_on'=>'value'));
            $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array('individual_node_id'=>'node_x_id'));
            $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> '.STATEMENT_CLASS_ID), array());
            $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('user_name'=> 'value'));
            $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip1.node_class_property_id', array('caption'));
            $subSelect->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = nxyr1.node_x_id', array());
            $subSelect->join(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxyr2.node_x_id AND ni2.node_class_id = '.ACCOUNT_CLASS_ID), array());
            $subSelect->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('email'=>'value'));
            $subSelect->where->equalTo('nxyr.node_y_id', $courseNodeId);
            $statement = $sql->prepareStatementForSqlObject($subSelect);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $fetchRecord =  $resultObj->initialize($result)->toArray();
            //return $subSelect->getSqlString();
            $dialogueList = array();

            if (count($fetchRecord)) {
                $k[] = $fetchRecord;
                foreach ($fetchRecord as $key => $value) {
                        //$dialogueList['users'][$value['individual_node_id']][str_replace(' ', '_', strtolower($value['caption']))] = $value['user_name'];
                        $dialogueList['users'][$value['individual_node_id']]['user_id']                                            = $value['individual_node_id'];
                        //$dialogueList['users'][$value['individual_node_id']]['email']                                              = $value['email'];
                        //$dialogueList['dialogue']['dialogue_title']                                                                = $value['dialogue_title'];
                        //$dialogueList['dialogue']['dialogueStatus']                                                                = $value['status'];
                        $dialogueList['dialogue']['created_on']                                                                    = $value['created_on'];
                        $dialogueList['dialogue']['dialogue_node_id']                                                              = $value['dialogue_node_id'];
                        //$dialogueList['dialogue']['dialogue_instance_id']                                                          = $value['dialogue_instance_id'];
                }
                $timestamp = strtotime($dialogueList['dialogue']['created_on']);
                $user_ids = array_column($dialogueList['users'], 'user_id');
                $result = array();
                foreach ($user_ids as $userId) {
                    $node_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
                    $node_x_id     = $this->createNode();
                    $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
                    $statement = $this->adapter->query($sql);
                    $result = $statement->execute();
                    $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
                    $actor_ncpid       = INDIVIDUAL_ACTORID_PROP_ID;
                    $timestamp_ncpid   = INDIVIDUAL_TIMESTAMP_PROP_ID;
                    $status_ncpid      = INDIVIDUAL_STATUS_PROP_ID;
                    $actor_node_id     = $this->createNode();
                    $timestamp_node_id = $this->createNode();
                    $status_node_id    = $this->createNode();
                    $sql1               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                         . " ('$node_instance_id','$actor_ncpid','$actor_node_id','2','$userId','0','0'), "
                                         . " ('$node_instance_id','$timestamp_ncpid','$timestamp_node_id','2','$timestamp','0','0'), "
                                         . " ('$node_instance_id','$status_ncpid','$status_node_id','2','1','0','0') ";
                    $statement1 = $this->adapter->query($sql1);
                    $result1 = $statement1->execute();
                    $this->createXYRelation($dialogueList['dialogue']['dialogue_node_id'], $node_x_id);
                    $k[$userId] = $sql.'<br>'.$sql1.'<br>';
                }
            }
        }

        return $k;
    }

    public function getBlankIndividualHistoryCourses($data)
    {
        $courses = $this->getInstanceListOfParticulerClass(COURSE_CLASS_ID, 'class', 'node_id');
        foreach ($courses as $courseNodeId => $course) {
            $sql                            = new Sql($this->adapter);
            $subSelect                      = $sql->select();
            $subSelect->from(array('nxyr' => 'node-x-y-relation'));
            $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
            $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('status'=>'status','dialogue_instance_id'=>'node_instance_id'));
            $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.DIALOGUE_TITLE_ID), array('dialogue_title'=>'value'));
            $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_TIMESTAMP_ID), array('created_on'=>'value'));
            $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array('individual_node_id'=>'node_x_id'));
            $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_CLASS_ID), array());
            $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('user_name'=> 'value'));
            $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip1.node_class_property_id', array('caption'));
            $subSelect->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = nxyr1.node_x_id', array());
            $subSelect->join(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxyr2.node_x_id AND ni2.node_class_id = '.ACCOUNT_CLASS_ID), array());
            $subSelect->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('email'=>'value'));
            $subSelect->where->equalTo('nxyr.node_y_id', $courseNodeId);
            $statement = $sql->prepareStatementForSqlObject($subSelect);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $fetchRecord =  $resultObj->initialize($result)->toArray();

            $dialogueList = array();
            foreach ($fetchRecord as $key => $value) {
                    $dialogueList[$value['dialogue_node_id']]['users'][$value['individual_node_id']]['user_id']                = $value['individual_node_id'];
                    $dialogueList[$value['dialogue_node_id']]['dialogue']['created_on']                                        = $value['created_on'];
                    $dialogueList[$value['dialogue_node_id']]['dialogue']['dialogue_node_id']                                  = $value['dialogue_node_id'];
            }
            //$k[$courseNodeId]['dialogcount'] = $dialogueList;
            if (count($dialogueList)) {
                //$k[$courseNodeId]['fetchRecord'] = $fetchRecord;
                //$k[$courseNodeId]['dialogcount'] = $dialogueList;
                //$k[$courseNodeId]['dialogi_Detail'] = $dialogueList;
                foreach ($dialogueList as $key1 => $value1) {
                      $sql11 = "SELECT `nxyr1`.`node_x_id` AS `individual_history_node_id`, `nip1`.`value` AS `actor_id`, `nip2`.`value` AS `timestamp`, `nip1`.`value` AS `individual_node_id`
                                FROM `node-x-y-relation` AS `nxyr1`
                                INNER JOIN `node-instance` AS `ni1` ON `ni1`.`node_id` = `nxyr1`.`node_x_id` AND `ni1`.node_class_id = '".INDIVIDUAL_HISTORY_CLASS_ID."'
                                INNER JOIN `node-instance-property` AS `nip1` ON `ni1`.node_instance_id = `nip1`.node_instance_id AND `nip1`.`node_class_property_id`='".INDIVIDUAL_ACTORID_PROP_ID."'
                                INNER JOIN `node-instance-property` AS `nip2` ON `ni1`.node_instance_id = `nip2`.node_instance_id AND `nip2`.`node_class_property_id`='".INDIVIDUAL_TIMESTAMP_PROP_ID."'
                                WHERE `nxyr1`.`node_y_id` = '".$key1."'";
                        $statement1 = $this->adapter->query($sql11);
                        $result1 = $statement1->execute();
                        $resultObj = new ResultSet();
                        $resultset =  $resultObj->initialize($result1)->toArray();
                        //$k[$courseNodeId][$value['dialogue_node_id']][] = $sql11;
                    if (count($resultset)==0) {
                        //$k[$value['dialogue_node_id']][] = $subSelect->getSqlString();
                        $timestamp = strtotime($value1['dialogue']['created_on']);
                        $user_ids = array_column($value1['users'], 'user_id');
                        $result = array();
                        foreach ($user_ids as $userId) {
                            $node_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
                            $node_x_id     = $this->createNode();
                            $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
                            $statement = $this->adapter->query($sql);
                            $result = $statement->execute();
                            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
                            $actor_ncpid       = INDIVIDUAL_ACTORID_PROP_ID;
                            $timestamp_ncpid   = INDIVIDUAL_TIMESTAMP_PROP_ID;
                            $status_ncpid      = INDIVIDUAL_STATUS_PROP_ID;
                            $actor_node_id     = $this->createNode();
                            $timestamp_node_id = $this->createNode();
                            $status_node_id    = $this->createNode();
                            $sql1               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                 . " ('$node_instance_id','$actor_ncpid','$actor_node_id','2','$userId','0','0'), "
                                                 . " ('$node_instance_id','$timestamp_ncpid','$timestamp_node_id','2','$timestamp','0','0'), "
                                                 . " ('$node_instance_id','$status_ncpid','$status_node_id','2','1','0','0') ";
                            $statement1 = $this->adapter->query($sql1);
                            $result1 = $statement1->execute();
                            $this->createXYRelation($key1, $node_x_id);

                            $k[$courseNodeId][$key1][] = $sql.'<br>'.$sql1;

                            //$k[$courseNodeId][$value['dialogue_node_id']]['users'] =  $user_ids;
                            //$k[$courseNodeId][$value['dialogue_node_id']]['counter'] =  count($resultset);
                                //$k[$value['dialogue_node_id']]['query'] = $sql11;
                        }
                    }
                }

                //return $dialogueList;
            }
        }

        return $k;
    }
    /*
     * Created By: Kunal
     * On Date: 22-May-2017
     * Purpose: Copy dialogue individual history and paste into course individual history
     * @param: $data
     * @param: return array
     */
    public function copyDialogueIndvHistoryToCourseIndvHistory($data)
    {
        $courses = $this->getInstanceListOfParticulerClass(COURSE_CLASS_ID, 'class', 'node_id');
        foreach ($courses as $courseNodeId => $course) {
            $sql                            = new Sql($this->adapter);
            $subSelect                      = $sql->select();
            $subSelect->from(array('nxyr' => 'node-x-y-relation'));
            $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
            $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array(/*'status'=>'status','dialogue_instance_id'=>'node_instance_id'*/));
            $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_TIMESTAMP_ID), array('created_on'=>'value'));
            $subSelect->where->equalTo('nxyr.node_y_id', $courseNodeId);
            $subSelect->group('nxyr.node_x_id');
            $statement = $sql->prepareStatementForSqlObject($subSelect);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dialogueList =  $resultObj->initialize($result)->toArray();
            if (count($dialogueList)) {
                foreach ($dialogueList as $key1 => $value1) {
                      $sql11 = "SELECT `nip1`.`value` AS `actor_id`
                                FROM `node-x-y-relation` AS `nxyr1`
                                INNER JOIN `node-instance` AS `ni1` ON `ni1`.`node_id` = `nxyr1`.`node_x_id` AND `ni1`.node_class_id = '".INDIVIDUAL_HISTORY_CLASS_ID."'
                                INNER JOIN `node-instance-property` AS `nip1` ON `ni1`.node_instance_id = `nip1`.node_instance_id AND `nip1`.`node_class_property_id`='".INDIVIDUAL_ACTORID_PROP_ID."'
                                WHERE `nxyr1`.`node_y_id` = '".$value1['dialogue_node_id']."' group by `nip1`.`value`";
                        $statement1 = $this->adapter->query($sql11);
                        $result1 = $statement1->execute();
                        $resultObj = new ResultSet();
                        $resultset =  $resultObj->initialize($result1)->toArray();
                        $coursesql = "SELECT `nip1`.`value` AS `actor_id`
                                FROM `node-x-y-relation` AS `nxyr1`
                                INNER JOIN `node-instance` AS `ni1` ON `ni1`.`node_id` = `nxyr1`.`node_x_id` AND `ni1`.node_class_id = '".INDIVIDUAL_HISTORY_CLASS_ID."'
                                INNER JOIN `node-instance-property` AS `nip1` ON `ni1`.node_instance_id = `nip1`.node_instance_id AND `nip1`.`node_class_property_id`='".INDIVIDUAL_ACTORID_PROP_ID."'
                                WHERE `nxyr1`.`node_y_id` = '".$courseNodeId."' group by `nip1`.`value`";
                        $coursestatement = $this->adapter->query($coursesql);
                        $courseindvresult = $coursestatement->execute();
                        $resultObj = new ResultSet();
                        $courseindvresultset =  $resultObj->initialize($courseindvresult)->toArray();
                        $users = array_diff($resultset, $courseindvresultset);
                    if (count($users)) {
                        $timestamp = strtotime($value1['created_on']);
                        $result = array();
                        foreach ($users as $userId) {
                            $node_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
                            $node_x_id     = $this->createNode();
                            $sql           = "INSERT INTO `node-instance` (`node_class_id`,`node_id`,`node_type_id`,`caption`,`sequence`,`encrypt_status`,`status`) VALUES ('$node_class_id','$node_x_id','2','$node_x_id','0','0','1') ";
                            $statement = $this->adapter->query($sql);
                            $result = $statement->execute();
                            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
                            $actor_ncpid       = INDIVIDUAL_ACTORID_PROP_ID;
                            $timestamp_ncpid   = INDIVIDUAL_TIMESTAMP_PROP_ID;
                            $status_ncpid      = INDIVIDUAL_STATUS_PROP_ID;
                            $actor_node_id     = $this->createNode();
                            $timestamp_node_id = $this->createNode();
                            $status_node_id    = $this->createNode();
                            $sql1               = "INSERT INTO `node-instance-property` (`node_instance_id`,`node_class_property_id`,`node_id`,`node_type_id`,`value`,`sequence`,`encrypt_status`) VALUES"
                                                 . " ('$node_instance_id','$actor_ncpid','$actor_node_id','2','".$userId['actor_id']."','0','0'), "
                                                 . " ('$node_instance_id','$timestamp_ncpid','$timestamp_node_id','2','$timestamp','0','0'), "
                                                 . " ('$node_instance_id','$status_ncpid','$status_node_id','2','1','0','0') ";
                            $statement1 = $this->adapter->query($sql1);
                            $result1 = $statement1->execute();
                            $this->createXYRelation($courseNodeId, $node_x_id);
                        }
                    }
                }
            }
        }
        return $k;
    }

    //For delete token values
    /**
     * Pass device token value
     * @param type $tokenValue
     */
    public function deleteDeviceTokens($tokenValue)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('node_instance_id'=>'node_instance_id'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->where->equalTo('nip.value', $tokenValue);
        $select->where->AND->equalTo('nip.node_class_property_id', INDIVIDUAL_DEVICE_TOKEN);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceIDArr = $resultObj->initialize($result)->toArray();


        if (count($instanceIDArr)>0) {
            $sqlDel = new Sql($this->adapter);
            $delete = $sqlDel->delete();
            $delete->from('node-instance-property');
            $delete->where->IN('node_instance_id', array_column($instanceIDArr, 'node_instance_id'));
            $delete->where->AND->equalTo('node_class_property_id', INDIVIDUAL_DEVICE_TOKEN);
            $delete->where->AND->equalTo('value', $tokenValue);
            //return $select->getSqlString();
            $statement = $sql->prepareStatementForSqlObject($delete);
            $statement->execute();
        }
    }

    public function subscribeApplication($data)
    {
        $returnSubscriptionArray = array();
        if (trim($data['user_id']) != '' && !isset($data['group_id'])) {
            $returnSubscriptionArray = $this->createInstanceOfClass(SUBSCRIPTION_CLASS_ID, '1');
            if (intval($returnSubscriptionArray['node_instance_id']) > 0) {
                $propertyIdArray = array(SUBSCRIPTION_PRODUCTION_PID, SUBSCRIPTION_SUBSCRIBER_PID, SUBSCRIPTION_SDATE_PID);
                $propertyValueArray = array($data['production_id'], $data['user_id'], date('Y-m-d h:i:s'));
                $this->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubscriptionArray['node_instance_id'], $returnSubscriptionArray['node_type_id'], 'N', array(), "");
            }
        } elseif (trim($data['user_id']) != '' && trim($data['group_id']) != '') {
            $returnSubscriptionArray = $this->createInstanceOfClass(SUBSCRIPTION_CLASS_ID, '1');
            if (intval($returnSubscriptionArray['node_instance_id']) > 0) {
                $propertyIdArray = array(SUBSCRIPTION_PRODUCTION_PID, SUBSCRIPTION_SDATE_PID);
                $propertyValueArray = array($data['production_id'], date('Y-m-d h:i:s'));
                $this->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubscriptionArray['node_instance_id'], $returnSubscriptionArray['node_type_id'], 'N', array(), "");
            }

            $returnGroupArray = $this->createInstanceOfClass(GROUP_SUBSCRIPTION_CLASS_ID, '1');
            if (intval($returnGroupArray['node_instance_id']) > 0) {
                $propertyIdArray = array(GROUP_SUBSCRIPTION_GROUP_PID);
                $propertyValueArray = array($data['group_id']);
                $this->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnGroupArray['node_instance_id'], $returnGroupArray['node_type_id'], 'N', array(), "");
            }

            $this->createRelation($returnSubscriptionArray['node_id'], array($returnGroupArray['node_id']));
            $returnSubsGroupArray = $this->createInstanceOfClass(SUBS_GROUP_ACT_ROLE_CLASS_ID, '1');
            if (intval($returnSubsGroupArray['node_instance_id']) > 0) {
                $propertyIdArray = array(SUBS_GROUP_ACT_ROLE_ACTOR_PID);
                $propertyValueArray = array($data['user_id']);
                $this->createInstanceProperty($propertyIdArray, $propertyValueArray, $returnSubsGroupArray['node_instance_id'], $returnSubsGroupArray['node_type_id'], 'N', array(), "");
            }
            $this->createRelation($returnGroupArray['node_id'], array($returnSubsGroupArray['node_id']));
        }

        if (intval($returnSubscriptionArray['node_id']) > 0) {
            return array('status' => 1, 'msg' => 'User subscribed successfully.', 'subscription_id' => $returnSubscriptionArray['node_id']);
        } else {
             return array('status' => 0, 'msg' => 'Unable to process your request. Please try again.');
        }
    }

    /**/
    public function getUserIdThroughToken($tokenValue)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('ur_instance_id'=>'node_instance_id'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->JOIN(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->JOIN(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array('user_node_id' => 'value'));
        $select->JOIN(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni.node_instance_id', array('ur_status' => 'value'));
        $select->JOIN(array('ni1' => 'node-instance'), 'ni1.node_id = nip1.value', array('node_instance_id'));
        $select->JOIN(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = nip1.value', array());
        $select->JOIN(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxyr.node_x_id AND ni2.node_class_id = '.ACCOUNT_CLASS_ID), array('account_node_instance_id' => 'node_instance_id'));
        $select->where->equalTo('nip.value', $tokenValue);
        $select->where->AND->equalTo('nip1.node_class_property_id', USER_REG_USERID_PID);
        $select->where->AND->equalTo('nip2.node_class_property_id', USER_REG_STATUS_PID);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }
    
    /**Added on 5 Oct by Gaurav
     * Function to return UserNodeIDArr
     * @param type $nodeInstanceIdArr
     * @return type Arr
     */
    
    public function fetchStatementUserInstanceId($statementInstanceArr)
    {
        
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('statement_instance_id'=>'node_instance_id'));
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nip.value', array('user_instance_id'=>'node_instance_id'));
        $select->where->IN('nip.node_instance_id', $statementInstanceArr);
        $select->where->AND->equalTo('nip.node_class_property_id', STATEMENT_ACTOR_AUTHOR);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $fetchRecord =  $resultObj->initialize($result)->toArray();
        $userArr = array();
        foreach ($fetchRecord as $key => $value) {
                $userArr[$value['statement_instance_id']]   = $value['user_instance_id'];
        }
        return $userArr;
    }
    
    /**Added on 5 Oct by Gaurav
     * Function to return UserNodeIDArr
     * @param type $nodeInstanceIdArr
     * @return type Arr
     */
    
    public function fetchUserAccountStatus($userInstNodeIds)
    {
        
          $sql                     = new Sql($this->adapter);
          $select                  = $sql->select();
          $select->from(array('ni' => 'node-instance'));
          $select->columns(array('node_instance_id'));
          $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array(), 'left');
          $select->join(array('ni1' => 'node-instance'), 'ni1.node_id = xy.node_x_id', array(), 'left');
          $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni1.node_instance_id', array('account_status'=>'value'), 'left');
          $select->where->IN('ni.node_instance_id', $userInstNodeIds);
          $select->where->AND->equalTo('ni1.node_class_id', ACCOUNT_CLASS_ID);
          $select->where->AND->equalTo('nip.node_class_property_id', ACCOUNT_STATUS_ID);
          //return   $select->getSqlstring();
          $statement = $sql->prepareStatementForSqlObject($select);
          $result = $statement->execute();
          $resultObj = new ResultSet();
          $fetchRecord =  $resultObj->initialize($result)->toArray();
          $userArr = array();
        foreach ($fetchRecord as $key => $value) {
                  $userArr[$value['node_instance_id']]   = $value['account_status'];
        }
         return $userArr;
    }
}
