<?php

namespace Administrator\Model;

use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Predicate;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\AbstractTableGateway;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Grid\Model\DashboardTable;
class ClassesTable extends AbstractTableGateway {

    protected $table = 'user';
    protected $courseDialogueTableObj;
    protected $administratorTable;
    protected $dashboardTable;

    //protected $dupliacteClassArray = array(161736,16946);
    public function __construct(Adapter $adapter) {
        $this->adapter = $adapter;
        $this->resultSetPrototype = new ResultSet();
        $this->resultSetPrototype->setArrayObjectPrototype(new Classes());
        $this->initialize();
    }

    public function getDashboardTable()
    {
        if (!$this->dashboardTable) {
            $this->dashboardTable = new DashboardTable($this->adapter);
        }
        return $this->dashboardTable;
    }

    public function getCourseDialogueTable() {
        if (!$this->courseDialogueTableObj) {
            $this->courseDialogueTableObj = new CourseDialogueTable($this->adapter);
        }
        return $this->courseDialogueTableObj;
    }

    public function getAdministratorTable()
    {
        if (!$this->administratorTable) {
            $this->administratorTable = new AdministratorTable($this->adapter);
        }
        return $this->administratorTable;
    }

    public function setVersionOfAllClass() {
        $QUERY = "SELECT nc1.node_class_id, (SELECT  DISTINCT(nip.value) AS value FROM `node-instance` AS ni JOIN `node-instance-property` AS nip ON nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id=804 WHERE ni.node_id IN (SELECT DISTINCT(xy.node_x_id) AS node_x_id FROM `node-class` AS nc JOIN `node-x-y-relation` AS xy ON xy.node_y_id = nc.node_id WHERE xy.is_version=0 AND xy.node_y_id = nc1.node_id AND xy.node_x_id NOT IN(16525,16543,67905) AND ni.node_class_id=169)) as version FROM `node-class` AS nc1";

        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $cardArray = $resultObj->initialize($result)->toArray();

        $sql = new Sql($this->adapter);

        foreach ($cardArray as $key => $value) {
            if (trim($value['version']) != '' && trim($value['node_class_id']) != "") {
                $query = $sql->update();
                $query->table('node-class');
                $query->set(array('version' => $value['version']));
                $query->where(array('node_class_id' => $value['node_class_id']));
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
            }
        }
    }

    public function getVersionOfClass($node_y_class_id) {
        $node_id = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
        $QUERY = "SELECT  DISTINCT(nip.value) AS value FROM `node-instance` AS ni JOIN `node-instance-property` AS nip ON nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id=804
    								WHERE ni.node_id IN (SELECT DISTINCT(xy.node_x_id) AS node_x_id FROM `node-class` AS nc JOIN `node-x-y-relation` AS xy ON xy.node_y_id = nc.node_id
									WHERE xy.is_version=0 AND xy.node_y_id = " . $node_id . " AND xy.node_x_id NOT IN(16525,16543,67905) AND ni.node_class_id=169)";


        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $cardArray = $resultObj->initialize($result)->toArray();

        $this->updateVersionOfClass($node_y_class_id, $cardArray[0]['value']);
    }

    public function updateVersionOfClass($node_y_class_id, $majorVersion) {
        $sql = new Sql($this->adapter);

        if (trim($node_y_class_id) != '' && trim($majorVersion) != "") {
            $query = $sql->update();
            $query->table('node-class');
            $query->set(array('version' => $majorVersion));
            $query->where(array('node_class_id' => $node_y_class_id));
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }
    }

    public function getDesendent($node_class_id) {
        $QUERY = "SELECT nip.* FROM `node-instance-property` AS nip WHERE nip.node_instance_id IN (SELECT DISTINCT(ni.node_instance_id) AS node_instance_id FROM `node-x-y-relation` AS nxyr JOIN `node-instance` AS ni ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = 364 WHERE nxyr.node_y_id = " . $node_class_id . ")";


        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $cardArray = $resultObj->initialize($result)->toArray();

        $desendent = '';
        foreach ($cardArray as $k => $v) {
            if (intval($v['node_class_property_id']) == 1675) {
                $desendent = $v['value'];
            }
        }

        return $desendent;
    }

    /*
     * This function is used to fetch all classes
     * Created by Arvind Soni
     * ON date: 16th SEPT 2015
     */

    public function getClassListByPagination($order, $order_by, $display, $filter_operator, $search_text, $filter_field, $hit_by) {
        $autometic = '';
        if ($filter_operator == 'Autometic' && $search_text == 'Autometic') {
            $filter_operator = '';
            $search_text = '';
            $autometic = 'Y';
        }

        if ($filter_operator == 'Autometic' && $search_text == 'AutometicAll') {
            $filter_operator = '';
            $search_text = '';
            $autometic = 'N';
        }

        $temp = array();
        $temp['filter_operator'] = $filter_operator;
        $temp['search_text'] = $search_text;
        $temp['filter_field'] = $filter_field;

        if ($_SESSION['classSession']['hit_by'] == "left_section" && $hit_by == "") {
            $_SESSION['classSession']['node_type_id'] = "";
            $_SESSION['classSession']['status'] = "";
        }

        if ($filter_field == 'node_id') {
            $_SESSION['classSession']['node_id'] = $temp;
            $_SESSION['classSession']['caption'] = '';
            $_SESSION['classSession']['node_type_id'] = '';
            $_SESSION['classSession']['version'] = '';
            $_SESSION['classSession']['instance_total'] = '';
            $_SESSION['classSession']['status'] = '';
        } else if ($filter_field == 'caption') {
            $_SESSION['classSession']['caption'] = $temp;
            $_SESSION['classSession']['node_type_id'] = '';
            $_SESSION['classSession']['version'] = '';
            $_SESSION['classSession']['instance_total'] = '';
            $_SESSION['classSession']['status'] = '';
        } else if ($filter_field == 'node_type_id') {
            $_SESSION['classSession']['node_type_id'] = $temp;
            $_SESSION['classSession']['version'] = '';
            $_SESSION['classSession']['instance_total'] = '';
            if ($hit_by != "left_section")
                $_SESSION['classSession']['status'] = '';
        }
        else if ($filter_field == 'version') {
            $_SESSION['classSession']['version'] = $temp;
            $_SESSION['classSession']['instance_total'] = '';
            $_SESSION['classSession']['status'] = '';
        } else if ($filter_field == 'instance_total') {
            $_SESSION['classSession']['instance_total'] = $temp;
            $_SESSION['classSession']['status'] = '';
        } else if ($filter_field == 'status') {
            $_SESSION['classSession']['status'] = $temp;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc1' => 'node-class'));
        $select->columns(array('node_class_id', 'node_id', 'caption', 'version', 'type',
            'node_type_id' => new Expression('CASE WHEN nc1.node_type_id = 1 THEN "X" WHEN nc1.node_type_id = 2 THEN "Y" WHEN nc1.node_type_id = 3 THEN "Z" END')
        , 'encrypt_status', 'status' => new Expression('CASE WHEN nc1.status = 1 THEN "Published" WHEN nc1.status = 0 THEN "Draft" END')
        , 'instance_total' => new Expression("count(ni.node_instance_id)")
        ));
        $select->join(array('ni' => 'node-instance'), 'ni.node_class_id = nc1.node_class_id', array('node_instance_id'), 'left');

        /* $sql = new Sql($this->adapter);
          $select = $sql->select();
          $select->from(array('nc1' => 'node-class'));
          $select->columns(array('node_class_id', 'node_id', 'caption', 'version','type',
          'node_type_id' => new Expression('CASE WHEN node_type_id = 1 THEN "X" WHEN node_type_id = 2 THEN "Y" WHEN node_type_id = 3 THEN "Z" END')
          , 'encrypt_status', 'status' => new Expression('CASE WHEN status = 1 THEN "Published" WHEN status = 0 THEN "Draft" END')
          , 'instance_total' => new Expression("(select count(*) from `node-instance` where `node-instance`.node_class_id = nc1.node_class_id)")
          )); */

        $auto = 'N';
        if ($filter_field == "") {
            $filter_field = 'node_type_id';
            $filter_operator = 'equals';
            $search_text = 'Y';
            $auto = 'Y';
        }

        if ($auto == 'Y') {
            $_SESSION['classSession']['node_id'] = '';
            $_SESSION['classSession']['caption'] = '';
            $_SESSION['classSession']['node_type_id'] = '';
            $_SESSION['classSession']['version'] = '';
            $_SESSION['classSession']['instance_total'] = '';
            $_SESSION['classSession']['status'] = '';
            if ($filter_field == 'node_type_id') {
                /* Commented By Arvind For All node Type and All Status */
                /* if($filter_operator == 'equals')
                  {
                  $select->having->equalTo($filter_field,$search_text);
                  } */

                if ($autometic == 'Y') {
                    $select->having->AND->like('status', 'D%');
                }
            } else {
                if ($filter_operator == 'equals') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->equalTo($filter_field, $search_text);
                    else
                        $select->where->equalTo($filter_field, $search_text);
                }
                else if ($filter_operator == 'not_equal') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->notEqualTo($filter_field, $search_text);
                    else
                        $select->where->notEqualTo($filter_field, $search_text);
                }
                else if ($filter_operator == 'begins_with') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->like($filter_field, $search_text . '%');
                    else
                        $select->where->like($filter_field, $search_text . '%');
                }
                else if ($filter_operator == 'ends_with') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->like($filter_field, '%' . $search_text);
                    else
                        $select->where->like($filter_field, '%' . $search_text);
                }
                else if ($filter_operator == 'contains') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->like($filter_field, '%' . $search_text . '%');
                    else
                        $select->where->like($filter_field, '%' . $search_text . '%');
                }
                else if ($filter_operator == 'not_contains') {
                    if ($filter_field == 'instance_total' || $filter_field == 'status')
                        $select->having->notLike($filter_field, '%' . $search_text . '%');
                    else
                        $select->where->notLike($filter_field, '%' . $search_text . '%');
                }

                $select->where->NEST->equalTo('node_type_id', 1)->OR->equalTo('node_type_id', 2)->OR->equalTo('node_type_id', 3)->UNNEST;
            }
        }

        if ($hit_by == "") {

            $_SESSION['classSession']['hit_by'] = $hit_by;
            if ($auto == 'N') {
                if (is_array($_SESSION['classSession']['node_id'])) {
                    if ($_SESSION['classSession']['node_id']['filter_operator'] == 'equals') {
                        $select->where->equalTo('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], $_SESSION['classSession']['node_id']['search_text']);
                    } else if ($_SESSION['classSession']['node_id']['filter_operator'] == 'not_equal') {
                        $select->where->notEqualTo('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], $_SESSION['classSession']['node_id']['search_text']);
                    } else if ($_SESSION['classSession']['node_id']['filter_operator'] == 'begins_with') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], $_SESSION['classSession']['node_id']['search_text'] . '%');
                    } else if ($_SESSION['classSession']['node_id']['filter_operator'] == 'ends_with') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], '%' . $_SESSION['classSession']['node_id']['search_text']);
                    } else if ($_SESSION['classSession']['node_id']['filter_operator'] == 'contains') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], '%' . $_SESSION['classSession']['node_id']['search_text'] . '%');
                    } else if ($_SESSION['classSession']['node_id']['filter_operator'] == 'not_contains') {
                        $select->where->notLike('nc1.' . $_SESSION['classSession']['node_id']['filter_field'], '%' . $_SESSION['classSession']['node_id']['search_text'] . '%');
                    }
                }

                if (is_array($_SESSION['classSession']['version'])) {
                    if ($_SESSION['classSession']['version']['filter_operator'] == 'equals') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->equalTo($_SESSION['classSession']['version']['filter_field'], $_SESSION['classSession']['version']['search_text']);
                    }
                    else if ($_SESSION['classSession']['version']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->notEqualTo($_SESSION['classSession']['version']['filter_field'], $_SESSION['classSession']['version']['search_text']);
                    }
                    else if ($_SESSION['classSession']['version']['filter_operator'] == 'begins_with') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->like($_SESSION['classSession']['version']['filter_field'], $_SESSION['classSession']['version']['search_text'] . '%');
                    }
                    else if ($_SESSION['classSession']['version']['filter_operator'] == 'ends_with') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->like($_SESSION['classSession']['version']['filter_field'], '%' . $_SESSION['classSession']['version']['search_text']);
                    }
                    else if ($_SESSION['classSession']['version']['filter_operator'] == 'contains') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->like($_SESSION['classSession']['version']['filter_field'], '%' . $_SESSION['classSession']['version']['search_text'] . '%');
                    }
                    else if ($_SESSION['classSession']['version']['filter_operator'] == 'not_contains') {
                        if ($_SESSION['classSession']['version']['filter_field'] == 'version')
                            $select->where->notLike($_SESSION['classSession']['version']['filter_field'], '%' . $_SESSION['classSession']['version']['search_text'] . '%');
                    }
                }

                if (is_array($_SESSION['classSession']['caption'])) {
                    if ($_SESSION['classSession']['caption']['filter_operator'] == 'equals') {
                        $select->where->equalTo('nc1.' . $_SESSION['classSession']['caption']['filter_field'], $_SESSION['classSession']['caption']['search_text']);
                    } else if ($_SESSION['classSession']['caption']['filter_operator'] == 'not_equal') {
                        $select->where->notEqualTo('nc1.' . $_SESSION['classSession']['caption']['filter_field'], $_SESSION['classSession']['caption']['search_text']);
                    } else if ($_SESSION['classSession']['caption']['filter_operator'] == 'begins_with') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['caption']['filter_field'], $_SESSION['classSession']['caption']['search_text'] . '%');
                    } else if ($_SESSION['classSession']['caption']['filter_operator'] == 'ends_with') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['caption']['filter_field'], '%' . $_SESSION['classSession']['caption']['search_text']);
                    } else if ($_SESSION['classSession']['caption']['filter_operator'] == 'contains') {
                        $select->where->like('nc1.' . $_SESSION['classSession']['caption']['filter_field'], '%' . $_SESSION['classSession']['caption']['search_text'] . '%');
                    } else if ($_SESSION['classSession']['caption']['filter_operator'] == 'not_contains') {
                        $select->where->notLike('nc1.' . $_SESSION['classSession']['caption']['filter_field'], '%' . $_SESSION['classSession']['caption']['search_text'] . '%');
                    }
                }

                if (is_array($_SESSION['classSession']['node_type_id'])) {
                    if ($_SESSION['classSession']['node_type_id']['filter_operator'] == 'equals') {
                        if ($_SESSION['classSession']['node_type_id']['filter_field'] == 'node_type_id')
                            $select->having->equalTo('nc1.' . $_SESSION['classSession']['node_type_id']['filter_field'], $_SESSION['classSession']['node_type_id']['search_text']);
                    }
                    else if ($_SESSION['classSession']['node_type_id']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['node_type_id']['filter_field'] == 'node_type_id')
                            $select->having->notEqualTo('nc1.' . $_SESSION['classSession']['node_type_id']['filter_field'], $_SESSION['classSession']['node_type_id']['search_text']);
                    }
                }

                if (is_array($_SESSION['classSession']['instance_total'])) {
                    if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'equals') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->equalTo($_SESSION['classSession']['instance_total']['filter_field'], $_SESSION['classSession']['instance_total']['search_text']);
                    }
                    else if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->notEqualTo($_SESSION['classSession']['instance_total']['filter_field'], $_SESSION['classSession']['instance_total']['search_text']);
                    }
                    else if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'begins_with') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->like($_SESSION['classSession']['instance_total']['filter_field'], $_SESSION['classSession']['instance_total']['search_text'] . '%');
                    }
                    else if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'ends_with') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->like($_SESSION['classSession']['instance_total']['filter_field'], '%' . $_SESSION['classSession']['instance_total']['search_text']);
                    }
                    else if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'contains') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->like($_SESSION['classSession']['instance_total']['filter_field'], '%' . $_SESSION['classSession']['instance_total']['search_text'] . '%');
                    }
                    else if ($_SESSION['classSession']['instance_total']['filter_operator'] == 'not_contains') {
                        if ($_SESSION['classSession']['instance_total']['filter_field'] == 'instance_total')
                            $select->having->notLike($_SESSION['classSession']['instance_total']['filter_field'], '%' . $_SESSION['classSession']['instance_total']['search_text'] . '%');
                    }
                }

                if (is_array($_SESSION['classSession']['status'])) {
                    if ($_SESSION['classSession']['status']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['status']['filter_field'] == 'status')
                            $select->having->notEqualTo('nc1.' . $_SESSION['classSession']['status']['filter_field'], $_SESSION['classSession']['status']['search_text']);
                    }
                    else if ($_SESSION['classSession']['status']['filter_operator'] == 'begins_with') {
                        if ($_SESSION['classSession']['status']['filter_field'] == 'status')
                            $select->having->like('nc1.' . $_SESSION['classSession']['status']['filter_field'], $_SESSION['classSession']['status']['search_text'] . '%');
                    }
                }
            }
        }
        else if ($hit_by == "left_section") {
            $_SESSION['classSession']['node_id'] = '';
            $_SESSION['classSession']['caption'] = '';
            $_SESSION['classSession']['instance_total'] = '';
            $_SESSION['classSession']['version'] = '';
            $_SESSION['classSession']['hit_by'] = $hit_by;
            if ($auto == 'N') {
                if (is_array($_SESSION['classSession']['node_type_id'])) {
                    if ($_SESSION['classSession']['node_type_id']['filter_operator'] == 'equals') {
                        if ($_SESSION['classSession']['node_type_id']['filter_field'] == 'node_type_id')
                            $select->having->equalTo($_SESSION['classSession']['node_type_id']['filter_field'], $_SESSION['classSession']['node_type_id']['search_text']);
                    }
                    else if ($_SESSION['classSession']['node_type_id']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['node_type_id']['filter_field'] == 'node_type_id')
                            $select->having->notEqualTo($_SESSION['classSession']['node_type_id']['filter_field'], $_SESSION['classSession']['node_type_id']['search_text']);
                    }
                }

                if (is_array($_SESSION['classSession']['status'])) {
                    if ($_SESSION['classSession']['status']['filter_operator'] == 'not_equal') {
                        if ($_SESSION['classSession']['status']['filter_field'] == 'status')
                            $select->having->notEqualTo($_SESSION['classSession']['status']['filter_field'], $_SESSION['classSession']['status']['search_text']);
                    }
                    else if ($_SESSION['classSession']['status']['filter_operator'] == 'begins_with') {
                        if ($_SESSION['classSession']['status']['filter_field'] == 'status')
                            $select->having->like($_SESSION['classSession']['status']['filter_field'], $_SESSION['classSession']['status']['search_text'] . '%');
                    }
                }
            }
        }
        $select->group(array('nc1.node_class_id'));
        $select->order($order_by . ' ' . $order);

        //echo $select->getSqlstring();
        //die;

        if ($display == 'no-pagination') {
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();

            return $resultObj->initialize($result)->toArray();
        } else {
            $paginatorAdapter = new DbSelect($select, $this->adapter);
            $paginator = new Paginator($paginatorAdapter);


            return $paginator;
        }
    }

    public function fetchnodeInstanceClassId($searchFields) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id'), 'inner');
        $select->where->equalTo('nip.value', $searchFields);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeInstance = array();

        foreach ($nodeXYArr as $key => $value) {
            $impldeInstance[] = $value['node_id'];
        }

        $class_nodeId = $this->fetchXYId(implode(",", array_unique($impldeInstance)));

        return $class_nodeId;
    }

    public function fetchXYId($nodeId) {

        $node_x_id = explode(",", $nodeId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->IN('node_x_id', array_unique($node_x_id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $impldeIClassId = array();
        foreach ($dataArray as $key => $value) {
            $impldeIClassId[] = $value['node_y_id'];
        }

        return (implode(",", array_unique($impldeIClassId)));
    }

    /* function created by awdhesh getclassNode id from this function */

    public function getClassNodeId($node_y_class_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('node_id'));
        $select->where->equalTo('node_class_id', $node_y_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray[0]['node_id'];
    }

    public function getInstanceNodeId($node_instance_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_id'));
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray[0]['node_id'];
    }

    public function getclassProertyNodeId($node_class_property_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->columns(array('node_id'));
        $select->where->equalTo('node_class_property_id', $node_class_property_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray[0]['node_id'];
    }

    /* end code here */

    public function getClassList($node_y_class_id = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        if ($node_y_class_id != '')
            $select->where->equalTo('node_class_id', $node_y_class_id);
        else
            $select->order('node_class_id ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        if ($node_y_class_id != '')
            return $nodeArray[0];
        else
            return $nodeArray;
    }

    public function getClassNodeYList($node_class_id = "", $caption = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_type_id', 2);
        $select->where->equalTo('status', 1);

        if ($node_class_id != '')
            //$select->where->notEqualTo('node_class_id',$node_class_id);
            if (trim($caption) != "") {
                if (is_numeric(trim($caption))) {
                    $select->where("node_id LIKE '%" . trim($caption) . "%'");
                } else {
                    $select->where("LOWER(caption) LIKE '%" . strtolower(trim($caption)) . "%'");
                }
            }

        $select->order('node_class_id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        return $nodeArray;
    }

    public function getClassChild($node_class_id) {
        $new_class_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nsb' => 'node-sub-class'));
        $select->join(array('nc' => 'node-class'), 'nc.node_id=nsb.child_node_id', array('node_id', 'caption', 'encrypt_status', 'node_class_id'), 'inner');
        $select->where->equalTo('nsb.primary_node_id', $new_class_id);
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

    // function here to fetch instance class Structure bases of node Z
    public function getInstanceClassStructureNodeZ($node_y_class_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();
        foreach ($instanceAttributeArray as $key => $valueArray) {

            if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                $tempMainArray['node_class_id'] = $node_y_class_id;
                $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                $mainArray[] = $tempMainArray;
            }
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();
            $mainArray[$key]['property'] = $this->getAllPropertyNodeZ($mainPropArray, $subPropArray, $realPropArray);
        }

        return $mainArray;
    }

    /* end code here */

    public function getClassStructure($node_y_class_id) {
        $tempMainArray = array();
        $mainArray = array();
        $tempMainArray['instance_attribute_id'] = 2;
        $tempMainArray['node_class_id'] = $node_y_class_id;
        $tempMainArray['caption'] = $tempMainArray['value'] = 'Properties';
        $tempMainArray['node_id1'] = $this->getNodeClassId($node_y_class_id);
        $mainArray[0] = $tempMainArray;

        $realPropArray1 = array();
        //$mainArray[0]['version'] 					= $this->getAllclassversionProperty($tempMainArray['node_id1'],$subPropArray,$realPropArray1);


        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();


            $mainArray[$key]['property'] = $this->getAllProperty($mainPropArray, $subPropArray, $realPropArray);
        }

        return $mainArray;
    }

    /*
     * Created by Awdhesh Soni
     */

    public function getNodeClassId($classId) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('node_id'));
        $select->where->equalTo('node_class_id', $classId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    /*
     * Created by Amit Malakar
     * Get class structure for print
     * return @array
     */

    public function getClassStructurePrint($node_y_class_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );


        $tempMainArray = array();
        $mainArray = array();
        foreach ($instanceAttributeArray as $key => $valueArray) {

            if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                $tempMainArray['node_class_id'] = $node_y_class_id;
                $tempMainArray['caption'] = $valueArray['instance_attribute']; //= $tempMainArray['value']
                $mainArray[] = $tempMainArray;
            }
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();
            $mainArray[$key]['property'] = $this->getAllPropertyPrint($mainPropArray, $subPropArray, $realPropArray);
        }

        return $mainArray;
    }

    /*
     * Created by Amit Malakar
     * Get all property for print
     * return @array
     */

    public function getAllPropertyPrint($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            if (isset($value['instance']) && trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));

                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */

            $menuArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (isset($menu2[$value['node_class_property_id']]) && is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getAllPropertyPrint($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    public function getClassDetail($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray[0];
    }

    public function getPropertyInstanceValue($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->where->equalTo('node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray[0];
    }

    /**
     * Changes made on DBA recommendations.
     * Get the property instances values.
     * @param type $nodeIdArr
     * @return type
     *
     */
    public function getPropertyInstanceValues($nodeIdArr) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->where(array('node_id' => $nodeIdArr));
        //$select->where->equalTo('node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    /* code add here by awdhesh soni */

    public function getAllclassversionProperty($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id'],3);
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);
            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;

            /* code here for node Y class datatype awdhesh */
            $value['nodeVesionStructure'] = $this->getNodeInstaceId1($value['nodeZ'], $value['nodeClassId']);
            $temp = array();
            if (trim($value['nodeY']) != "")
                $temp = $this->getClassDetail($value['nodeY']);
            $value['nodeYClassName'] = $temp['caption'];

            if (trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);

                $instanceArray = array_filter($instanceArray, create_function('$a', 'return $a!=="";'));
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));

                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */
            $menuArray[$value['node_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_id']])) {
                $menuArray[$value['node_id']]['child'] = $this->getAllclassversionProperty($menu2[$value['node_id']], $menu2, $childArray);
            }
        }

        return $menuArray;
    }

    public function getAllclassversionPropertyOld($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id'],3);
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);
            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;

            /* code here for node Y class datatype awdhesh */
            $value['nodeVesionStructure'] = $this->getNodeInstaceId1($value['nodeZ'], $value['nodeClassId']);
            $temp = array();
            if (trim($value['nodeY']) != "")
                $temp = $this->getClassDetail($value['nodeY']);
            $value['nodeYClassName'] = $temp['caption'];

            if (trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);
                $instanceArray = array_filter($instanceArray, create_function('$a', 'return $a!=="";'));
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));
                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */
            $menuArray[$value['node_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_id']])) {
                $menuArray[$value['node_id']]['child'] = $this->getAllclassversionProperty($menu2[$value['node_id']], $menu2, $childArray);
            }
        }

        return $menuArray;
    }

    /**
     * Get all property for class.
     * @param type $menu1
     * @param type $menu2
     * @param type $menuArray
     * @return type
     *
     *
     */
    public function getAllProperty($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
            //$value['nodeX'] = $this->fetchNodeYX($value['node_id']); // actual function
            $value['nodeYClass'] = $this->fetchNodeClassY($value['node_id']);

            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";
            $nodeX = "";
            $nodeY = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                } else if ($nodeVal['node_type_id'] == 1) {
                    $nodeX.= $nodeVal['node_x_id'] . ',';
                } else {
                    $nodeY.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;
            $value['nodeX'] = $nodeX;

            $value['nodeZMain'] = $this->fetchNodeZ($value['nodeZ']);
            $value['nodeY'] = $this->fetchNodeIdOfClassY($value['node_id'], 'ids');
            $value['instance'] = $this->fetchNodeIdOfInstanceProperty($value['node_id'], 'ids');
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);

            /* code here to assign node y class node x */



            /* code here for node Y class datatype awdhesh */

            $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeYClass']);
            $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);

            /* Code here to fetch record of node Z and node X. Please no anyone remove this code and also comment */

            $value['nodeZStructure'] = $this->getNodeInstaceId1($value['nodeZ'], $value['nodeClassId']);

            $value['nodeXStructure'] = $this->getNodeInstaceId1($value['nodeX'], $value['nodeClassId']);

            $temp = array();
            if (trim($value['nodeY']) != "")
                $temp = $this->getClassDetail($value['nodeY']);
            $value['nodeYClassName'] = $temp['caption'];

            if (trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));

                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */
            $menuArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getAllProperty($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    /* function here for used copy version class for node X and Node Z for Node Y */

    public function getClassStructureForVersion($node_y_class_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();
        foreach ($instanceAttributeArray as $key => $valueArray) {

            if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                $tempMainArray['node_class_id'] = $node_y_class_id;
                $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                $tempMainArray['node_id1'] = $this->getNodeClassId($node_y_class_id);
                $mainArray[] = $tempMainArray;
            }

            $realPropArray1 = array();
            $mainArray[$key]['version'] = $this->getAllclassversionProperty($tempMainArray['node_id1'], $subPropArray, $realPropArray1);
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();
            $mainArray[$key]['property'] = $this->getVersionAllProperty($mainPropArray, $subPropArray, $realPropArray);
        }

        return $mainArray;
    }

    public function getVersionAllProperty($menu1, $menu2, $menuArray) {


        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);

            $value['nodeZMain'] = $this->fetchNodeZ($value['nodeZ']);
            $value['nodeY'] = $this->fetchNodeIdOfClassY($value['node_id'], 'ids');
            $value['instance'] = $this->fetchNodeIdOfInstanceProperty($value['node_id'], 'ids');
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);
            $value['nodeYClass'] = $this->fetchNodeClassY($value['node_id']);
            /* code here to assign node y class node x */
            //$value['nodeX'] = $this->fetchNodeYX($value['node_id']);
            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";
            $nodeX = "";
            $nodeY = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                } else if ($nodeVal['node_type_id'] == 1) {
                    $nodeX.= $nodeVal['node_x_id'] . ',';
                } else {
                    $nodeY.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;
            $value['nodeX'] = $nodeX;


            /* code here for node Y class datatype awdhesh */

            $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeYClass']);
            $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);




            $all = $value['nodeZ'] . "," . $value['nodeX'];
            $value['nodeZStructure'] = $this->getNodeInstaceId1($all, $value['nodeClassId']);

            $temp = array();
            if (trim($value['nodeY']) != "")
                $temp = $this->getClassDetail($value['nodeY']);
            $value['nodeYClassName'] = $temp['caption'];

            if (trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));

                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */

            $menuArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getVersionAllProperty($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    /* function here to fetch node instance id and make array bases of node z class structure */

    public function getNodeInstaceId1($node_id, $nodeClassId) {
        /* code here to fetch caption of nodeZ Class */
        //$classCaption = $this->fetchnodeClassCaption($nodeClassId);
        /* code here to fetch node instance id and make fetch node property with value */
        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $nodeId = array_filter(array_values($nodeId));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        $nodeProps = array();
        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption1($value);
        }

        /* if (count($nodeId) > 1) {
          $nodeProps = $this->fetchnodeInstanceProperties($nodeId); // combine the function passing the array.
          foreach ($nodeId as $key => $value) {
          //$tempArrData = $this->fetchnodeInstancePropertyVal($value);  // remove as per the suggestion.
          $tempArrData[0] = $nodeProps[$value];
          foreach ($tempCaption as $key1 => $value1) {
          if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {
          $tempArra[$value1[0]['caption']] = $tempArrData;
          }
          }
          }
          } */

        foreach ($nodeId as $key => $value) {
            $tempArrData = $this->fetchnodeInstancePropertyVal($value);
            // print_r($tempArrData);
            foreach ($tempCaption as $key1 => $value1) {
                if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {
                    $tempArra[$value1[0]['caption']] = $tempArrData;
                }
            }
        }
        return $tempArra;
    }

    public function getNodeInstaceIdDetails($node_id, $nodeClassId) {

        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $nodeId = array_filter(array_values($nodeId));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        $nodeProps = array();
        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption1($value);
        }


        foreach ($nodeId as $key => $value) {
            $tempArrData = $this->fetchnodeInstancePropertyVal($value);

            foreach ($tempCaption as $key1 => $value1) {

                if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {


                    if ($value1[0]['caption'] == "NODE RIGHTS") {
                        foreach ($tempArrData as $key2 => $tempArr) {
                            $UserData = $this->getIndividualUsersListByNodeId($tempArr['value']);
                            $propArr = $this->getPropName($tempArr['node_class_property_id']);
                            $tempArra[$value1[0]['caption']][$propArr[0]['caption']][] = $UserData[0]['first_name'] . ' ' . $UserData[0]['last_name'] . ' (' . $UserData[0]['email_address'] . ')' . ' [' . substr($tempArrData[0]['value'], 0, -1) . ']';
                        }
                    } else {
                        $tempArra[$value1[0]['caption']] = $tempArrData;
                    }
                }
            }
        }

        return $tempArra;
    }

    public function getPropName($node_class_prop_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_property_id', $node_class_prop_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /* function here to fetch node class caption */

    /**
     * Function here to fetch node class caption.
     * @param type $nodeClassId
     *
     */
    public function fetchnodeClassCaption1($nodeClassId = "") {
        static $cacheClassCaptions;
        if (!isset($cacheClassCaptions)) {
            $cacheClassCaptions = [];
        }
        if (!isset($cacheClassCaptions[$nodeClassId])) {
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
            $cacheClassCaptions[$nodeClassId] = $nodeArray;
        }
        return $cacheClassCaptions[$nodeClassId];
    }

    /* end code here */

    /* function here to fetch all node z class with structure */

    public function getAllPropertyNodeZ($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);


            /* code here for node Y class datatype */
            //$value['nodeX'] = $this->fetchNodeYX($value['node_id']);
            $value['nodeYClass'] = $this->fetchNodeClassY($value['node_id']);
            $value['nodeY'] = $this->fetchNodeClassY($value['node_id']);
            $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeY']);
            $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);
            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";
            $nodeX = "";
            $nodeY = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                } else if ($nodeVal['node_type_id'] == 1) {
                    $nodeX.= $nodeVal['node_x_id'] . ',';
                } else {
                    $nodeY.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;
            $value['nodeX'] = $nodeX;


            $all = $value['nodeZ'] . "," . $value['nodeX'];


            /* function call here to fetch node instance id bases of node id and pass node instance id to node instance table */
            $value['nodeZStructure'] = $this->getNodeInstaceId1($all, $value['nodeClassId']);

            /* end code here */

            $menuArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getAllProperty($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    /* end code here */

    public function fetchNodeClassId($nodeXY) {

        $n = explode(",", $nodeXY);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ni.node_class_id', array('i_node_id' => 'node_id'), 'inner');
        $select->where->IN('ni.node_id', $n);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = array();

        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY[] = $value['i_node_id'];
        }

        return implode(",", array_unique($impldeNXY));
    }

    public function checkIsSubClass($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-sub-class');
        $select->where->equalTo('child_node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tArray = $resultObj->initialize($result)->toArray();
        return count($tArray);
    }

    public function fetchInstnaceClassId($nodeYId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_class_id', $nodeYId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_class_id'] . ',';
        }

        return $impldeNXY;
    }

    /* function here for fetch details of node-x-y-relation table */

    public function fetchNodeXY($nodeYId) {


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_y_id', $nodeYId);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        //return $nodeXYArr;
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }

        return $impldeNXY;
    }

    public function fetchNodeYFromXY($nodeXId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance'), 'nc.node_id = nxyr.node_y_id', array('node_instance_id'), '');
        //$select->columns(array('node_y_id'));
        $select->where->equalTo('nxyr.node_x_id', $nodeXId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeYNodeInstanceId = $resultObj->initialize($result)->toArray();

        if (isset($nodeYNodeInstanceId[0]['node_instance_id']))
            return $nodeYNodeInstanceId[0]['node_instance_id'];
        else
            return '';
    }

    public function fetchNodeYZ($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 3);
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

    /* function here to fetch node X assign value in node Y and fetch from node x y table */

    //duplicate method only node_type_id is changed
    public function fetchNodeYX($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 1);
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

    public function commonFetchNodeYX($node_id) {

        $nodeTypeArr = array(1, 3);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where(array('nc.node_type_id' => $nodeTypeArr));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr;
    }

    public function commonFetchNodeYXExp($node_id) {

        $nodeTypeArr = array(1, 3);
        $nodeTypeStr = implode(",", $nodeTypeArr);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $join = new Expression("ni.node_id = nxyr.node_x_id and ni.node_type_id IN (" . $nodeTypeStr . ")");
        $join2 = new Expression("np.node_id = nxyr.node_x_id and np.node_type_id = 2");
        $join3 = new Expression("nc.node_id = nxyr.node_x_id and nc.node_type_id = 2");
        $select->join(array('nc' => 'node-class'), $join3, array('node_type_id'), 'Left');
        $select->join(array('ni' => 'node-instance'), $join, array('node_type_id'), 'Left');
        $select->join(array('np' => 'node-instance-property'), $join2, array('node_type_id'), 'Left');

        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr;
    }

    public function fetchNodeZ($node_ids) {
        $temp = explode(",", $node_ids);

        if (count($temp) > 0) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-instance');
            $select->where->IN('node_id', $temp);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $nodeXYArr = $resultObj->initialize($result)->toArray();
            $impldeNXY = "";

            foreach ($nodeXYArr as $key => $value) {
                $impldeNXY.= $value['node_class_id'] . ',';
            }

            return $impldeNXY;
        }
    }

    /* fetch nodeY value */

    public function fetchNodeClassY($node_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-class'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 2);
        $statement = $sql->prepareStatementForSqlObject($select);
        //echo $select->getSqlstring();
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }

        return $impldeNXY;
    }

    /**
     * Created by Amit Malakar
     * @param $node_instance_id
     * @return array
     */
    public function fetchNodeClassNodeId($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_class_id = nc.node_class_id', array(), '');
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassNodeId = $resultObj->initialize($result)->toArray();

        return $nodeClassNodeId[0]['node_id'];
    }

    public function nodeClassYId($node_id) {
        //echo '$ '.$node_id;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ncp' => 'node-instance-property'), 'ncp.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('ncp.node_type_id', 2);
        $statement = $sql->prepareStatementForSqlObject($select);

        //echo $select->getSqlstring();

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        $impldeNXY = "";
        foreach ($nodeXYArr as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }
        //echo '??'.$impldeNXY;
        return $impldeNXY;
    }

    /* fetch name of Y class for datatype */

    public function nodeYClassValue($nodeClassId = "") {
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

    public function nodeClassYInstanceValue($nodeClassId = "", $nodeYClassId = "") {
        $np = explode(",", $nodeClassId);
        $tempArr = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_class_property_id', 'value', 'encrypt_status'));
        if ($nodeYClassId != "") {
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('node_class_id'), '');
            $select->join(array('nc' => 'node-class'), 'nc.node_class_id = ncp.node_class_id', array('node_id'), '');
        }
        $select->where->IN('nip.node_id', $np);
        if ($nodeYClassId != "")
            $select->where->AND->equalTo('nc.node_id', $nodeYClassId);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        foreach ($nodeArray as $key => $value) {
            if (intval($value['encrypt_status']) == 1) {
                $tempArr[$key] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);
            } else {
                $tempArr[$key] = $value['value'];
            }
        }

        return $tempArr;
    }

    /* end code here */

    /* function use here to fetch node X value assign to node Y */

    public function getNodeXInstaceId($node_id, $nodeClassId) {
        /* code here to fetch caption of nodeZ Class */
        $classCaption = $this->fetchnodeClassCaption($nodeClassId);
        /* code here to fetch node instance id and make fetch node property with value */
        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $nodeId = array_filter(array_values(array_unique($nodeId)));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        $nodeProps = array();
        foreach ($classId as $key => $value) {

            $tempCaption[] = $this->fetchnodeClassCaption($value);
        }
        if (count($nodeId) > 1) {
            $nodeProps = $this->fetchnodeInstanceProperties($nodeId); // combine the function passing the array.
            foreach ($nodeId as $key => $value) {
                //$tempArrData = $this->fetchnodeInstancePropertyVal($value);  // remove as per the suggestion.
                $tempArrData = array();
                $tempArrData[0] = $nodeProps[$value];
                foreach ($tempCaption as $key1 => $value1) {
                    if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {
                        $tempArra[$value1[0]['caption']] = $tempArrData;
                    }
                }
            }
        }


//        foreach ($tempCaption as $key => $value) {
//            $tempArrData = $this->fetchnodeInstancePropertyVal($nodeId[$key]);
//            if ($tempArrData[0]['node_class_id'] == $value[0]['node_class_id']) {
//                $tempArra[$value[0]['caption']] = $this->fetchnodeInstancePropertyVal($nodeId[$key]);
//            }
//        }

        return $tempArra;
    }

    /* function here to fetch node instance id and make array bases of node z class structure */

    /**
     * Get node instance value ( changes recommended by DBA)
     * @param type $node_id
     * @param type $nodeClassId
     * @return type
     *
     */
    public function getNodeInstaceId($node_id, $nodeClassId) {
        /* code here to fetch caption of nodeZ Class */
        //$classCaption = $this->fetchnodeClassCaption($nodeClassId);
        /* code here to fetch node instance id and make fetch node property with value */
        // echo "<pre>";
        //echo "echo :".$node_id;

        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);

        $nodeId = array_filter(array_values($nodeId));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        $nodeProps = array();
        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption1($value);
        }

        if (count($nodeId) > 1) {
            $nodeProps = $this->fetchnodeInstanceProperties($nodeId); // combine the function passing the array.
            foreach ($nodeId as $key => $value) {
                //$tempArrData = $this->fetchnodeInstancePropertyVal($value);  // remove as per the suggestion.
                $tempArrData = array();
                $tempArrData[0] = $nodeProps[$value];
                foreach ($tempCaption as $key1 => $value1) {
                    if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id']) {
                        $tempArra[$value1[0]['caption']] = $tempArrData;
                    }
                }
            }
        }

        return $tempArra;
    }

    /* function here to fetch node class caption */

    public function fetchnodeClassCaption($nodeClassId = "") {
        $np = explode(",", $nodeClassId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('caption', 'node_class_id', 'node_id'));
        $select->where->IN('node_id', $np);
        $statement = $sql->prepareStatementForSqlObject($select); //echo $select->getSqlstring();
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    /* end code here */

    /* function here to fetch node instance property structure */

    public function fetchnodeInstancePropertyVal($node_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value', 'node_instance_property_encrypt' => 'encrypt_status', 'node_class_property_id'), '');

        $select->where->equalTo('ni.node_id', $node_id);
        //$select->where->AND->notEqualTo('value',"");
        //echo $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = $resultObj->initialize($result)->toArray();

        foreach ($temp as $key => $value) {
            if (intval($value['node_class_encrypt']) == 1)
                $temp[$key]['node_class_caption'] = $this->mc_decrypt($value['node_class_caption'], ENCRYPTION_KEY);


            if (intval($value['node_instance_encrypt']) == 1)
                $temp[$key]['node_instance_caption'] = $this->mc_decrypt($value['node_instance_caption'], ENCRYPTION_KEY);

            if (intval($value['node_instance_property_encrypt']) == 1)
                $temp[$key]['value'] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);


            if (intval($value['node_class_property_encrypt']) == 1)
                $temp[$key]['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
        }



        return $temp;
    }

    public function fetchnodeInstanceProperties($node_ids) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value', 'node_instance_property_encrypt' => 'encrypt_status', 'node_class_property_id'), '');

        //$select->where->equalTo('ni.node_id', $node_id);
        //$select->where->AND->notEqualTo('value',"");
        if (count($node_ids) > 0)
            $select->where(array('ni.node_id' => $node_ids));


        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = array();
        $temp = $resultObj->initialize($result)->toArray();

        foreach ($temp as $key => $value) {
            if (intval($value['node_class_encrypt']) == 1)
                $temp[$key]['node_class_caption'] = $this->mc_decrypt($value['node_class_caption'], ENCRYPTION_KEY);


            if (intval($value['node_instance_encrypt']) == 1)
                $temp[$key]['node_instance_caption'] = $this->mc_decrypt($value['node_instance_caption'], ENCRYPTION_KEY);

            if (intval($value['node_instance_property_encrypt']) == 1)
                $temp[$key]['value'] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);


            if (intval($value['node_class_property_encrypt']) == 1)
                $temp[$key]['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
        }
        foreach ($node_ids as $nodeKey => $nodeVal) {
            $nodeArr[$nodeVal] = $temp[$nodeKey];
        }

        return $nodeArr;
    }

    public function getNodeType($node_type_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-type');
        $select->where->equalTo('node_type_id', $node_type_id);
        $select->where->AND->equalTo('is_enable', 1);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodetype = $resultObj->initialize($result)->toArray();
        return $nodetype[0];
    }

    public function nodeTypes() {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-type');
        $select->where->equalTo('is_enable', 1);
        $select->order('sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodetype = $resultObj->initialize($result)->toArray();
        return $nodetype;
    }

    public function getProperties($node_y_class_id, $is_parent = 'N') {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_id', $node_y_class_id);
        if ($is_parent == 'Y')
            $select->where->equalTo('node_class_property_parent_id', 0);
        $select->order('sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /**
     * Modified By: Amit Malakar
     * Date: 16-Feb-2017
     * Added Stored procedure to get all course properties
     * @param $node_y_class_id
     * @param string $is_parent
     * @return array
     */
    public function getPropertiesCourse($node_y_class_id, $is_parent = 'N') {

        if(0) {
            if ($is_parent == 'Y')
                $sqlQuery = "CALL getPropertiesY($node_y_class_id, 'node_class_property_id')";
            else if ($is_parent == 'N')
                $sqlQuery = "CALL getPropertiesN($node_y_class_id, 'node_class_property_id')";

            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-class-property');
            $select->where->equalTo('node_class_id', $node_y_class_id);
            if ($is_parent == 'Y')
                $select->where->equalTo('node_class_property_parent_id', 0);
            $select->order('node_class_property_id ASC');
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        }
    }

    public function generate_uuid() {
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

    public function createNode() {
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

    public function getNodeId($table, $column, $value, $returnColumn = "") {
        if(0) {
            $sqlQuery  = 'CALL getNodeId("'.$table.'", "'.$column.'", "'.$value.'");';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj        = new ResultSet();
            $dataArray        = $resultObj->initialize($result)->toArray();
        } else {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from($table);
            $select->where->equalTo($column, intval($value));
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
        }

        if (trim($returnColumn) != '')
            return $dataArray[0][$returnColumn];
        else
            return intval($dataArray[0]['node_id']);
    }

    public function getinstanceDetails($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_id'];
    }

    public function getinstancesDetailsById($node_id, $node_class_id) {

        $n = explode(",", $node_id);
        $p = array_unique($n);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->IN('node_id', $p);
        $select->where->AND->equalTo('node_class_id', $node_class_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        foreach ($dataArray as $key => $value) {
            $impldeNXY[] = $value['node_instance_id'];
        }

        return implode(",", array_unique($impldeNXY));
    }

    public function getinstancesCourseById($node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id'));
        $select->where->equalTo('node_class_id', $node_class_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        foreach ($dataArray as $key => $value) {
            $impldeNXY[] = $value['node_instance_id'];
        }

        return implode(",", array_unique($impldeNXY));
    }

    /* code here for check node id bases of node class id of X */

    public function getinstancesById($node_class_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->AND->equalTo('node_class_id', $node_class_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        foreach ($dataArray as $key => $value) {
            $impldeNXY[] = $value['node_id'];
        }

        return implode(",", array_unique($impldeNXY));
    }

    public function getNodeXId($nodeId, $nodeYId) {
        $n = explode(",", $nodeId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->IN('node_x_id', array_unique($n));
        $select->where->AND->equalTo('node_y_id', $nodeYId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $impldeNXY = '';
        foreach ($dataArray as $key => $value) {
            $impldeNXY.= $value['node_x_id'] . ',';
        }
        return $impldeNXY;
    }

    /* end code here */

    public function getinstanceProperyDetails($node_instance_id) {
        if (trim($node_instance_id) != "") {
            $n = explode(",", $node_instance_id);

            if (count($n) > 0) {
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-instance-property');
                $select->where->IN('node_instance_id', array_unique($n));

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();
                foreach ($dataArray as $key => $value) {
                    $impldeNXY[] = $value['node_instance_id'];
                }

                return $impldeNXY;
            }
        }

        return array();
    }

    public function getChatProperyDetails($node_instance_id, $nodeClassProperty) {
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

    /* function here to fetch node instance is bases of node class id */

    public function getInstanceId($table, $column, $value) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from($table);
        $select->where->equalTo($column, intval($value));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        return intval($dataArray[0]['node_instance_id']);
    }

    public function createClass($class_caption, $common_name, $node_type_id, $saveType, $node_y_class_id = "", $version_type = 1) {
        $data['caption'] = $this->mc_encrypt($common_name, ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;
        $data['type'] = $version_type;

        if ($saveType == 'D') {
            $data['status'] = 0;
        } else {
            $data['status'] = 1;
            $data['created'] = date("Y-m-d H:i:s");
        }

        $sql = new Sql($this->adapter);


        if (!empty($node_y_class_id)) {
            $query = $sql->update();
            $query->table('node-class');
            $query->set($data);
            $query->where(array('node_class_id' => $node_y_class_id));
        } else {
            $data['node_id'] = $this->createNode();
            $data['sequence'] = $this->getLastNumber('node-class', 'sequence');
            $query = $sql->insert('node-class');
            $query->values($data);
        }

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);

        if (empty($node_y_class_id)) {
            $node_y_class_id = $this->adapter->getDriver()->getLastGeneratedValue();
            $this->createTexonomyInstance($node_y_class_id, 'Class');
        }

        return $node_y_class_id;
    }

    public function createTexonomyInstance($node_y_class_id, $type) {
        $data['node_id'] = $this->createNode();
        $data['node_class_id'] = TAXONOMY_CLASS_ID;
        $data['node_type_id'] = '3';
        $data['caption'] = $data['node_id'];
        $data['encrypt_status'] = 0;
        $data['status'] = 1;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();

        $data1['node_id'] = $this->createNode();
        $data1['node_instance_id'] = $node_instance_id;
        $data1['node_type_id'] = '3';
        $data1['node_class_property_id'] = TAXONOMY_TYPE_PROPERTY_ID;
        $data1['encrypt_status'] = 0;
        $data1['value'] = $type;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance-property');
        $query->values($data1);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);

        if ($type == 'Class')
            $nodeId = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
        else
            $nodeId = $this->getNodeId('node-class-property', 'node_class_property_id', $node_y_class_id);

        $this->saveNodeX($nodeId, $data['node_id'] . ",");
    }

    public function createClassChild($node_y_class_id, $child_ids_of_class) {
        $this->commonDeleteMethod('node-sub-class', 'primary_node_id', $node_y_class_id, 'equalto');

        $newArray = explode(',', $child_ids_of_class);
        $sequence = 1;
        foreach ($newArray as $key => $val) {
            if (trim($val) != "") {
                $data['primary_node_id'] = $node_y_class_id;
                $data['child_node_id'] = $val;
                $data['sequence'] = $sequence;

                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-sub-class');
                $query->values($data);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $parent_id = $this->adapter->getDriver()->getLastGeneratedValue();
                $sequence++;
            }
        }
    }

    public function getSubProp($menu1, $menu2, $propArray) {
        foreach ($menu1 as $key => $value) {
            $propArray[$value['id']]['id'] = $value['id'];
            $propArray[$value['id']]['text'] = $value['text'];
            $propArray[$value['id']]['nodex'] = $value['nodex'];
            $propArray[$value['id']]['nodey'] = $value['nodey'];
            $propArray[$value['id']]['instance'] = $value['instance'];


            $childArray = array();
            if (is_array($menu2[$value['id']])) {
                $propArray[$value['id']]['child'] = $this->getSubProp($menu2[$value['id']], $menu2, $childArray);
            }
        }
        return $propArray;
    }

    public function fetchNodeIdOfClassY($node_id, $type = "") {
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
        if ($type == "ids") {
            $impldeNXY = "";
            foreach ($nodeXYArr as $key => $value) {
                $impldeNXY = $value['node_x_id'];
            }

            return $impldeNXY;
        } else {
            return $nodeXYArr;
        }
    }

    public function fetchNodeIdOfInstanceProperty($node_id, $type = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('nc' => 'node-instance-property'), 'nc.node_id = nxyr.node_x_id', array('node_type_id'), '');
        $select->where->equalTo('nxyr.node_y_id', $node_id);
        $select->where->AND->equalTo('nc.node_type_id', 2);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        if ($type == "ids") {
            $impldeNXY = "";
            foreach ($nodeXYArr as $key => $value) {
                $impldeNXY.= $value['node_x_id'] . ',';
            }

            return $impldeNXY;
        } else {
            return $nodeXYArr;
        }
    }

    public function createClassProperty($prop_val_array, $node_y_class_id, $node_type_id) {
        $this->deleteSequenceNumberCProperty($node_y_class_id);
        $newPropArray1 = array();
        $newPropArray2 = array();
        $index = 0;
        $index1 = 0;
        foreach ($prop_val_array as $key => $val) {
            if ($val['parent'] == 'none') {
                $newPropArray1[$index]['id'] = str_replace("prop_temp_li_", "", $val['id']);
                $newPropArray1[$index]['text'] = trim($val['text']);
                $newPropArray1[$index]['nodex'] = $val['nodex'];
                $newPropArray1[$index]['nodey'] = $val['nodey'];
                $newPropArray1[$index]['instance'] = $val['instance'];
                $index++;
            } else {
                $newPropArray2[str_replace("prop_temp_li_", "", $val['parent'])][$index1]['id'] = str_replace("prop_temp_li_", "", $val['id']);
                $newPropArray2[str_replace("prop_temp_li_", "", $val['parent'])][$index1]['text'] = trim($val['text']);
                $newPropArray2[str_replace("prop_temp_li_", "", $val['parent'])][$index1]['nodex'] = $val['nodex'];
                $newPropArray2[str_replace("prop_temp_li_", "", $val['parent'])][$index1]['nodey'] = $val['nodey'];
                $newPropArray2[str_replace("prop_temp_li_", "", $val['parent'])][$index1]['instance'] = $val['instance'];
                $index1++;
            }
        }

        $propArray = array();
        $propArray = $this->getSubProp($newPropArray1, $newPropArray2, $propArray);


        foreach ($propArray as $key => $value) {
            if (trim($value['text']) != '') {
                if (strstr($key, '_', true) == 'old') {
                    $data['caption'] = trim($this->mc_encrypt($value['text'], ENCRYPTION_KEY));
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_class_property_parent_id'] = 0;
                    $data['node_type_id'] = $node_type_id;
                    $data['sequence'] = $this->getSequenceNumberCProperty($node_y_class_id, $data['node_class_property_parent_id']);
                    $sql = new Sql($this->adapter);
                    $query = $sql->update();
                    $query->table('node-class-property');
                    $query->set($data);
                    $query->where(array('node_class_property_id' => str_replace("old_", "", $value['id'])));
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $parent_id = str_replace("old_", "", $value['id']);

                    $nodeId = $this->getNodeId('node-class-property', 'node_class_property_id', $parent_id);
                    /* fetch node _x_id from node-x-y table */
                    $nodeXId = $this->getNodeXIdFromXYTable($nodeId);
                    if (trim($value['nodex']) != "") {
                        $deletedNodeId = $this->checkNodeXVal($nodeXId, $value['nodex']);

                        $this->deleteNodeInstanceAndXY($deletedNodeId);
                        /* end code here */
                        $this->deleteNodeX($nodeId);

                        $value['nodex'] = $this->checkTexonoyInstance($value['nodex']);
                        $this->saveNodeX($nodeId, $value['nodex']);
                    }

                    if (trim($value['nodey']) != "") {
                        $classYArray = $this->fetchNodeIdOfClassY($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }

                        $value['nodey'] = "," . $value['nodey'];
                        $this->saveNodeX($nodeId, $value['nodey']);
                    } else {
                        $classYArray = $this->fetchNodeIdOfClassY($nodeId);

                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }
                    }

                    if (trim($value['instance']) != "") {
                        $classYArray = $this->fetchNodeIdOfInstanceProperty($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }

                        $this->saveNodeX($nodeId, $value['instance']);
                    } else {
                        $classYArray = $this->fetchNodeIdOfInstanceProperty($nodeId);

                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }
                    }
                } else {
                    $data['caption'] = trim($this->mc_encrypt($value['text'], ENCRYPTION_KEY));
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_class_id'] = $node_y_class_id;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = $node_type_id;
                    $data['node_class_property_parent_id'] = 0;

                    $data['sequence'] = $this->getSequenceNumberCProperty($node_y_class_id, $data['node_class_property_parent_id']);

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-class-property');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $parent_id = $this->adapter->getDriver()->getLastGeneratedValue();

                    if (trim($value['nodex']) != "") {
                        $nodeId = $this->getNodeId('node-class-property', 'node_class_property_id', $parent_id);
                        $this->saveNodeX($nodeId, $value['nodex']);
                    }

                    if (trim($value['nodey']) != "") {
                        $value['nodey'] = "," . $value['nodey'];
                        $this->saveNodeX($nodeId, $value['nodey']);
                    }

                    if (trim($value['instance']) != "") {
                        $this->saveNodeX($nodeId, $value['instance']);
                    }
                }

                if (is_array($value['child'])) {
                    $this->createTexonomyInstance($parent_id, 'Grouping.Properties');
                    $this->createSubClassProperty($value['child'], $node_y_class_id, $node_type_id, $parent_id);
                } else {
                    $this->createTexonomyInstance($parent_id, 'Grouping.Label');
                }
            }
        }
    }

    /* code here to save node x data */

    public function checkTexonoyInstance($nodexArr) {
        $newArray = explode(',', $nodexArr);
        $newArray = array_unique($newArray);

        $instanceArray = array();
        foreach ($newArray as $key => $val) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-instance');
            $select->where->equalTo('node_id', $val);
            $select->where->AND->equalTo('node_class_id', TAXONOMY_CLASS_ID);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            if (count($dataArray) == 0) {
                $instanceArray[] = $val;
            }
        }
        return implode(',', $instanceArray);
    }

    /* created by awdhesh soni */

    /** function use here to save class property for version */
    public function createnodeInstancePropertyVersion($newClassArray, $node_y_class_id) {


        foreach ($newClassArray as $key => $value) {
            $data['caption'] = trim($value['caption']);
            $data['encrypt_status'] = ENCRYPTION_STATUS;
            $data['node_class_id'] = $node_y_class_id;
            $data['node_id'] = $this->createNode();
            $data['node_type_id'] = $value['node_type_id'];
            $data['node_class_property_parent_id'] = 0;
            $data['sequence'] = $value['sequence'];
            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-class-property');
            $query->values($data);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $parent_id = $this->adapter->getDriver()->getLastGeneratedValue();

            if (count($value['nodeZ']) > 0)
                $nodeXinstancesString = $this->createInstanceOfNodeZX($value['nodeZ']);

            if ($nodeXinstancesString != "")
                $this->saveNodeX($data['node_id'], $nodeXinstancesString);

            /* function here to save node instance and node instance property */

            if (is_array($value['child'])) {
                $this->createSubClassPropertyVersion($value['child'], $node_y_class_id, $parent_id);
            }

            if ($value['nodeClassYId'] != "") {
                if ($value['nodeY'] != "")
                    $this->saveNodeX($data['node_id'], $value['nodeY'] . ',' . $value['nodeClassYId']);
            }
        }
    }

    public function createInstanceOfNodeZX($nodeZArray) {
        $nodeXIdArray = array();
        foreach ($nodeZArray as $key => $value) {
            $node_class_id = $value['node_class_id'];
            $node_type_id = $value['node_type_id'];
            $node_id = $this->createNode();
            $node_class_property_id = $value['node_class_property_id'];
            $valueZ = $value['value'];

            /* For Creating Instances */
            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance');
            $query->values(array('node_class_id' => $node_class_id, 'node_type_id' => $node_type_id, 'node_id' => $node_id, 'caption' => $node_id, 'encrypt_status' => ENCRYPTION_STATUS));
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
            $nodeXIdArray[] = $this->getClassNodeId($node_class_id);
            $nodeXIdArray[] = $node_id;

            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values(array('node_instance_id' => $node_instance_id, 'node_type_id' => $node_type_id, 'node_id' => $this->createNode(), 'value' => $valueZ, 'node_class_property_id' => $node_class_property_id, 'encrypt_status' => ENCRYPTION_STATUS));
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }

        return implode(",", $nodeXIdArray);
    }

    public function createSubClassPropertyVersion($propArray, $node_y_class_id, $parent_id) {
        foreach ($propArray as $key => $value) {
            if (trim($value['caption']) != '') {
                $data['caption'] = $value['caption'];
                $data['encrypt_status'] = ENCRYPTION_STATUS;
                $data['node_class_id'] = $node_y_class_id;
                $data['node_id'] = $this->createNode();
                $data['node_type_id'] = $value['node_type_id'];
                $data['node_class_property_parent_id'] = $parent_id;
                $data['sequence'] = $value['sequence'];
                $sql = new Sql($this->adapter);
                $query = $sql->insert('node-class-property');
                $query->values($data);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $parent_id1 = $this->adapter->getDriver()->getLastGeneratedValue();

                if (count($value['nodeZ']) > 0)
                    $nodeXinstancesString = $this->createInstanceOfNodeZX($value['nodeZ']);

                if ($nodeXinstancesString != "")
                    $this->saveNodeX($data['node_id'], $nodeXinstancesString);

                if ($value['nodeClassYId'] != "") {
                    if ($value['nodeY'] != "")
                        $this->saveNodeX($data['node_id'], $value['nodeY'] . ',' . $value['nodeClassYId']);
                }
                if (is_array($value['child'])) {
                    $this->createSubClassPropertyVersion($value['child'], $node_y_class_id, $parent_id1);
                }
            }
        }
    }

    /* end code here */

    public function createSubClassProperty($propArray, $node_y_class_id, $node_type_id, $parent_id) {
        foreach ($propArray as $key => $value) {
            $data = array();
            if (trim($value['text']) != '') {

                if (strstr($key, '_', true) == 'old') {
                    $data['caption'] = $this->mc_encrypt($value['text'], ENCRYPTION_KEY);
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_class_property_parent_id'] = $parent_id;
                    $data['node_type_id'] = $node_type_id;
                    $data['sequence'] = $this->getSequenceNumberCProperty($node_y_class_id, $parent_id);
                    $sql = new Sql($this->adapter);
                    $query = $sql->update();
                    $query->table('node-class-property');
                    $query->set($data);
                    $query->where(array('node_class_property_id' => str_replace("old_", "", $value['id'])));
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $parent_id1 = str_replace("old_", "", $value['id']);
                    if (trim($value['nodex']) != "") {

                        $nodeId = $this->getNodeId('node-class-property', 'node_class_property_id', $parent_id1);
                        $nodeXId = $this->getNodeXIdFromXYTable($nodeId);
                        $deletedNodeId = $this->checkNodeXVal($nodeXId, $value['nodex']);
                        $this->deleteNodeInstanceAndXY($deletedNodeId);
                        /* end code here */
                        $this->deleteNodeX($nodeId);
                        $value['nodex'] = $this->checkTexonoyInstance($value['nodex']);
                        $this->saveNodeX($nodeId, $value['nodex']);
                    }

                    if (trim($value['nodey']) != "") {
                        $classYArray = $this->fetchNodeIdOfClassY($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }

                        $value['nodey'] = "," . $value['nodey'];
                        $this->saveNodeX($nodeId, $value['nodey']);
                    } else {
                        $classYArray = $this->fetchNodeIdOfClassY($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }
                    }

                    if (trim($value['instance']) != "") {
                        $classYArray = $this->fetchNodeIdOfInstanceProperty($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }

                        $this->saveNodeX($nodeId, $value['instance']);
                    } else {
                        $classYArray = $this->fetchNodeIdOfInstanceProperty($nodeId);
                        foreach ($classYArray as $index => $indexVal) {
                            $this->commonDeleteMethod('node-x-y-relation', 'node_x_y_relation_id', $indexVal['node_x_y_relation_id'], 'equalto');
                        }
                    }
                } else {
                    $data['caption'] = $this->mc_encrypt($value['text'], ENCRYPTION_KEY);
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_class_id'] = $node_y_class_id;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = $node_type_id;
                    $data['node_class_property_parent_id'] = $parent_id;
                    $data['sequence'] = $this->getSequenceNumberCProperty($node_y_class_id, $parent_id);
                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-class-property');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $parent_id1 = $this->adapter->getDriver()->getLastGeneratedValue();

                    if (trim($value['nodex']) != "") {
                        $nodeId = $this->getNodeId('node-class-property', 'node_class_property_id', $parent_id1);
                        $this->saveNodeX($nodeId, $value['nodex']);
                    }

                    if (trim($value['nodey']) != "") {
                        $value['nodey'] = "," . $value['nodey'];
                        $this->saveNodeX($nodeId, $value['nodey']);
                    }

                    if (trim($value['instance']) != "") {
                        $this->saveNodeX($nodeId, $value['instance']);
                    }
                }

                if (is_array($value['child'])) {
                    $this->createTexonomyInstance($parent_id1, 'Grouping.Properties');
                    $this->createSubClassProperty($value['child'], $node_y_class_id, $node_type_id, $parent_id1);
                } else {
                    $this->createTexonomyInstance($parent_id1, 'Grouping.Label');
                }
            }
        }
    }

    /* Common Delete Function Created By Arvind Soni */

    public function stringToInteger($tempArray) {
        foreach ($tempArray as $key => $value) {
            $tempArray[$key] = intval($value);
        }

        return $tempArray;
    }

    public function commonDeleteMethod($tableName, $primaryColumnName, $primaryColumnValue, $condtionType) {
        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from($tableName);
        //return $primaryColumnValue;
        if ($condtionType == 'equalto')
            $delete->where->equalTo($primaryColumnName, $primaryColumnValue);
        if ($condtionType == 'in') {
            //$primaryColumnValue = $this->stringToInteger($primaryColumnValue);
            $delete->where->IN($primaryColumnName, $primaryColumnValue);
        }
        //return $delete->getSqlstring();
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    public function commonDeletePositionMethod($tableName, $primaryColumnName, $primaryColumnValue, $secondColumnName, $secondColumnValue, $condtionType) {
        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from($tableName);
        if ($condtionType == 'equalto')
            $delete->where->equalTo($primaryColumnName, $primaryColumnValue);
        $delete->where->AND->equalTo($secondColumnName, $secondColumnValue);
        if ($condtionType == 'in') {
            //$primaryColumnValue = $this->stringToInteger($primaryColumnValue);
            $delete->where->IN($primaryColumnName, $primaryColumnValue);
        }
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    public function commonDeleteFolderDocumentMethod($tableName, $primaryColumnName, $primaryColumnValue, $secondColumnName, $secondColumnValue, $condtionType) {
        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from($tableName);
        if ($condtionType == 'equalto')
            $delete->where->equalTo($primaryColumnName, $primaryColumnValue);
        if ($condtionType == 'in') {
            //$primaryColumnValue = $this->stringToInteger($primaryColumnValue);
            $delete->where->IN($primaryColumnName, $primaryColumnValue);
        }
        $delete->where->AND->equalTo($secondColumnName, $secondColumnValue);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    /* Common Delete Function Created By Arvind Soni */

    public function deleteNodeInstanceAndXY($nodeIdArray) {
        if (count($nodeIdArray) > 0) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-instance');
            $select->columns(array('node_instance_id', 'node_id'));
            $select->where->IN('node_id', $nodeIdArray);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            foreach ($dataArray as $key => $value) {
                $nodeArray = array();
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-instance-property');
                $select->where->equalTo('node_instance_id', $value['node_instance_id']);

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray1 = $resultObj->initialize($result)->toArray();

                foreach ($dataArray1 as $k => $v) {
                    $nodeArray[] = $v['node_id'];
                }

                $this->commonDeleteMethod('node-instance-property', 'node_instance_id', $value['node_instance_id'], 'equalto');

                if (count($nodeArray) > 0) {
                    $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
                }

                if (intval($value['node_instance_id']) > 0) {
                    $this->commonDeleteMethod('node-instance', 'node_instance_id', $value['node_instance_id'], 'equalto');
                }

                if (intval($value['node_id']) > 0) {
                    $this->commonDeleteMethod('node', 'node_id', $value['node_id'], 'equalto');
                }
            }
        }
    }

    /* code here to save node x data */

    public function saveNodeX($parent_id, $nodexArr) {
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

    public function saveNodeXVersion($parent_id, $childClassId, $version) {
        $data['node_y_id'] = $parent_id;
        $data['node_x_id'] = $childClassId;
        $data['is_version'] = $version;
        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-x-y-relation');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
    }

    public function getNodeXVersion($childClassId, $version) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_x_id', $childClassId);
        $select->where->AND->equalTo('is_version', $version);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getDatetime($verId) {
        $newTempArr = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('created'));
        $select->where->equalTo('node_id', $verId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function getAllVersion($versionnodeIdY) {

        $tempArr = array();
        foreach ($versionnodeIdY as $key => $value) {
            $newId = implode(",", $versionnodeIdY);
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nc1' => 'node-class'));
            $select->columns(array('version' => new Expression("(SELECT  DISTINCT(nip.value) AS value FROM `node-instance` AS ni  JOIN `node-instance-property` AS nip ON nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id=804
					 WHERE ni.node_id IN (SELECT DISTINCT(xy.node_x_id) AS node_x_id FROM `node-class` AS nc
					 	JOIN `node-x-y-relation` AS xy ON xy.node_y_id = nc.node_id WHERE xy.is_version = 0 AND xy.node_y_id IN (" . $value . ")
					 	AND xy.node_x_id NOT IN(16525,16543,67905) AND ni.node_class_id=169))")));
            $select->where->notEqualTo('status', "");
            $select->limit(1);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
            $tempArr = $dataArray[0];
            $newTempArr = $this->getDatetime($value);
            $merge_array[] = array_merge($tempArr, $newTempArr);
        }
        sort($merge_array);
        $tempVal = $this->sortByVersionnumber($merge_array);
        return $tempVal;
    }

    public function sortByVersionnumber($tempArr) {

        foreach ($tempArr as $key => $value) {

            if (strrpos($value['version'], '.'))
                $beg = substr($value['version'], 0, strrpos($value['version'], '.'));
            else
                $beg = $value['version'];
            $end = end(explode('.', $value['version']));

            if (!strrpos($value['version'], '.'))
                $parent = 0;
            else {
                $key1 = array_search($beg, array_column($tempArr, 'version'));
                $parent = $key1 + 1;
            }

            $arr[] = array('id' => $key + 1, 'parentid' => $parent, 'version' => $value['version'], 'created' => $value['created']);
        }
        $tree = $this->buildTree($arr, 'parentid', 'id');
        return $tree;
    }

    function buildTree($flat, $pidKey, $idKey = null) {
        $grouped = array();
        foreach ($flat as $sub) {
            $grouped[$sub[$pidKey]][] = $sub;
        }

        $fnBuilder = function($siblings) use (&$fnBuilder, $grouped, $idKey) {
            foreach ($siblings as $k => $sibling) {
                $id = $sibling[$idKey];
                if (isset($grouped[$id])) {
                    $sibling['children'] = $fnBuilder($grouped[$id]);
                }
                $siblings[$k] = $sibling;
            }

            return $siblings;
        };

        $tree = $fnBuilder($grouped[0]);

        return $tree;
    }

    public function getNodeYrecursive($childClassId, $mergeArr) {

        $mergeArr[] = $childClassId;
        $tempArr = array();
        $maxVerArr = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->columns(array('node_y_id', 'is_version'));
        $select->where->equalTo('node_x_id', $childClassId);
        $select->where->AND->notEqualTo('is_version', 0);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        foreach ($dataArray as $key => $value) {

            if (!in_array($value['node_y_id'], $mergeArr)) {
                $mergeArr[] = $value['node_y_id'];
                $tempArr[] = $value['node_y_id'];
                $maxVerArr[] = $value['is_version'];
            }
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->columns(array('node_x_id', 'is_version'));
        $select->where->equalTo('node_y_id', $childClassId);
        $select->where->AND->notEqualTo('is_version', 0);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        foreach ($dataArray as $key => $value) {

            if (!in_array($value['node_x_id'], $mergeArr)) {
                $mergeArr[] = $value['node_x_id'];
                $tempArr[] = $value['node_x_id'];
                $maxVerArr[] = $value['is_version'];
            }
        }

        $mergeArr = array('my' => $mergeArr, 'version' => $maxVerArr);
        $mergeArr = $this->getNodeYrecursiveagain($tempArr, $mergeArr);



        return $mergeArr;
    }

    /* function here to fetch node X from node xy table */

    public function getNodeYrecursiveagain($arr, $myArr) {
        $tempArr = array();
        foreach ($arr as $key1 => $value1) {

            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-x-y-relation');
            $select->columns(array('node_y_id', 'is_version'));
            $select->where->equalTo('node_x_id', $value1);
            $select->where->AND->notEqualTo('is_version', 0);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            foreach ($dataArray as $key => $value) {

                if (!in_array($value['node_y_id'], $myArr['my'])) {
                    $myArr['my'][] = $value['node_y_id'];
                    $tempArr[] = $value['node_y_id'];
                    $myArr['version'][] = $value['is_version'];
                }
            }

            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-x-y-relation');
            $select->columns(array('node_x_id', 'is_version'));
            $select->where->equalTo('node_y_id', $value1);
            $select->where->AND->notEqualTo('is_version', 0);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            foreach ($dataArray as $key => $value) {

                if (!in_array($value['node_x_id'], $myArr['my'])) {
                    $myArr['my'][] = $value['node_x_id'];
                    $tempArr[] = $value['node_x_id'];
                    $myArr['version'][] = $value['is_version'];
                }
            }

            $myArr = $this->getNodeYrecursiveagain($tempArr, $myArr);
        }
        return $myArr;
    }

    public function getNodeXYMaxVersion($childClassId, $version) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->columns(array('version' => new Expression("(select MAX(is_version) from `node-x-y-relation` where node_x_id='" . $childClassId . "')")));
        $select->where->equalTo('node_x_id', $childClassId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['version'];
    }

    /* code here to update node x data */

    public function deleteNodeX($parent_id) {
        $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $parent_id, 'equalto');
    }

    public function getNodeXIdFromXYTable($node_id) {

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

    /** function here for use to fetch individual and dialoge node id for update course dialog value */
    public function getNodeXForIndividualAndDialoge($node_id, $node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();

        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('ind_instance_node_id' => 'node_x_id'));
        $select->where->equalTo('xy.node_y_id', $node_id);
        $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
        //$select->where->AND->equalTo('ni.status',1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getNodeXIdFromXYTableArray($node_id_array) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->IN('node_y_id', $node_id_array);
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

    public function checkNodeXVal($node_id, $otherNodeId) {
        $otherId = array();
        $otherId = array_unique(explode(",", $otherNodeId));

        $tmpArr = array();
        foreach ($node_id as $key => $value) {
            if (!in_array($value, $otherId)) {
                $tmpArr[] = $value;
            }
        }
        $t = array_unique($tmpArr);

        return $t;
    }

    public function deleteClassProperty($remove_prop_ids) {
        if (is_array($remove_prop_ids)) {
            $nodeArray = array();
            foreach ($remove_prop_ids as $key => $value) {
                if (trim($value) != "") {
                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from('node-class-property');
                    $select->where->equalTo('node_class_property_id', $value);
                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $nodeArray1 = $resultObj->initialize($result)->toArray();
                    $nodeArray[] = $nodeArray1[0]['node_id'];

                    $this->commonDeleteMethod('node-class-property', 'node_class_property_id', $value, 'equalto');
                }
            }

            if (count($nodeArray) > 0) {
                $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
            }
        }
    }

    public function getClassNameAndInstanceCount($class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('node_id', 'total_instance' => new Expression("(select count(*) from `node-instance` where `node-instance`.node_class_id = `node-class`.node_class_id)")));
        $select->where->equalTo('node_class_id', $class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        $class_name = $nodeArray[0]['node_id'];
        $total_instance = $nodeArray[0]['total_instance'];
        return array('class_name' => $class_name, 'total_instance' => $total_instance);
    }

    /**
     * Get Class Name
     * @param type $class_id
     * @return type
     */
    public function getClassNameByClassId($class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('caption'));
        $select->where->equalTo('node_class_id', $class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        $class_name = $nodeArray[0]['caption'];
        return array('class_name' => $class_name);
    }

    public function getSequenceNumberCProperty($node_class_id, $parent_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->columns(array('sequence'));
        $select->where->equalTo('node_class_id', $node_class_id);
        $select->where->AND->equalTo('node_class_property_parent_id', $parent_id);
        $select->order('sequence DESC');
        $select->limit(1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        if ($nodeArray[0]['sequence'] == "" || intval($nodeArray[0]['sequence']) == 0) {
            return 1;
        } else {
            return intval($nodeArray[0]['sequence']) + 1;
        }
    }

    public function deleteSequenceNumberCProperty($node_y_class_id) {
        $data['sequence'] = 0;
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-class-property');
        $query->set($data);
        $query->where(array('node_class_id' => $node_y_class_id));
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
    }

    /* ================ Start Instance ================= */

    public function getClassStructureAgain($node_class_id, $node_instance_id, $fetchType = "") {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();

        if ($fetchType == "") {
            foreach ($instanceAttributeArray as $key => $valueArray) {

                if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                    $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                    $tempMainArray['node_class_id'] = $node_class_id;
                    $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                    $mainArray[] = $tempMainArray;
                }
            }
            //($mainArray);
            foreach ($mainArray as $key => $value) {
                $propArray = $this->getProperties($value['node_class_id'], 'N');

                $mainPropArray = array();
                $subPropArray = array();
                foreach ($propArray as $propk => $propv) {
                    if (intval($propv['node_class_property_parent_id']) == 0)
                        $mainPropArray[] = $propv;
                    else
                        $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
                }

                $realPropArray = array();

                //print_r($mainPropArray);
                $mainArray[$key]['property'] = $this->getAllPropertyAgain($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $fetchType);
            }
        }
        else {
            $tempMainArray['node_class_id'] = $node_class_id;
            $mainArray[] = $tempMainArray;
            foreach ($mainArray as $key => $value) {
                $propArray = $this->getProperties($value['node_class_id'], 'N');
                $mainPropArray = array();
                $subPropArray = array();
                foreach ($propArray as $propk => $propv) {
                    if (intval($propv['node_class_property_parent_id']) == 0)
                        $mainPropArray[] = $propv;
                    else
                        $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
                }

                $realPropArray = array();

                $mainArray[$key] = $this->getAllPropertyAgain($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $fetchType);
            }
        }


        return $mainArray;
    }

    /**
     * Created by Amit Malakar
     * Get class structure again for Print
     * @param $node_class_id
     * @param $node_instance_id
     * @return array
     */
    public function getClassStructureAgainPrint($node_class_id, $node_instance_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();

        foreach ($instanceAttributeArray as $key => $valueArray) {

            if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                $tempMainArray['node_class_id'] = $node_class_id;
                $tempMainArray['caption'] = $valueArray['instance_attribute']; //$tempMainArray['value']	=
                $mainArray[] = $tempMainArray;
            }
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();
            $mainArray[$key]['property'] = $this->getAllPropertyAgainPrint($mainPropArray, $subPropArray, $realPropArray, $node_instance_id);
        }

        return $mainArray;
    }

    public function getAllPropertyAgain($menu1, $menu2, $menuArray, $node_instance_id, $fetchType = "") {
        //print_r($menu1);
        foreach ($menu1 as $key => $value) {
            if ($fetchType == "") {  // print_r($value);
                $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
                $value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
                $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);
                $value['nodeY'] = $this->fetchNodeClassY($value['node_id']);
                $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeY']);
                $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
                $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);
                //var_dump($value['nodeZ']);


                $commArr = $this->commonFetchNodeYX($value['node_id']);
                $nodeZ = "";
                $nodeX = "";
                $nodeY = "";

                foreach ($commArr as $nodeVal) {

                    if ($nodeVal['node_type_id'] == 3) {
                        $nodeZ.= $nodeVal['node_x_id'] . ',';
                    } else if ($nodeVal['node_type_id'] == 1) {
                        $nodeX.= $nodeVal['node_x_id'] . ',';
                    } else {
                        $nodeY.= $nodeVal['node_x_id'] . ',';
                    }
                }

                $value['nodeZ'] = $nodeZ;
                //echo "--------------";
                //var_dump($value['nodeZ']);

                /* function call here to fetch node instance id bases of node id and pass node instance id to node instance table */


                /* $new_node_id                             =   $dataArray[0]['node_id'];
                  $parentFolder                                 =   $this->getParentFolder($new_node_id);
                  $instancesArray['parentFolder']           =   $parentFolder; */

                $value['nodeZStructure'] = $this->getNodeInstaceId($value['nodeZ'], $value['nodeClassId']);
            }

            $fecthStyle = "";
            $isChild = "";
            if ($fetchType == "") {
                $fecthStyle = 'node_class_property_id';
                $isChild = 'child';
            } else {
                $fecthStyle = 'caption';
                $isChild = '';
            }

            $menuArray[$value[$fecthStyle]] = $value;


            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('*'));
            $select->where->equalTo('nip.node_instance_id', $node_instance_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $value['node_class_property_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            if ($isChild == 'child') {
                if (is_array($dataArray[0]) && count($dataArray) > 0) {
                    if (count($dataArray) > 1) {
                        $textN = "";
                        foreach ($dataArray as $k1 => $v1) {
                            $textN = $textN . $v1['value'] . CHECKBOX_SEPERATOR;
                        }
                        $menuArray[$value[$fecthStyle]]['node_instance_property_id'] = $dataArray[0]['node_instance_property_id'];
                        $menuArray[$value[$fecthStyle]]['value'] = $textN;
                    } else {
                        $menuArray[$value[$fecthStyle]]['node_instance_property_id'] = $dataArray[0]['node_instance_property_id'];
                        $menuArray[$value[$fecthStyle]]['value'] = $dataArray[0]['value'];
                    }
                }
            } else {
                if (is_array($dataArray[0]) && count($dataArray) > 0) {
                    if (count($dataArray) > 1) {
                        $textN = "";
                        foreach ($dataArray as $k1 => $v1) {
                            $textN = $textN . $v1['value'] . CHECKBOX_SEPERATOR;
                        }
                        $menuArray[$value[$fecthStyle]] = $textN;
                    } else {
                        $menuArray[$value[$fecthStyle]] = $dataArray[0]['value'];
                    }
                } else {
                    $menuArray[$value[$fecthStyle]] = '';
                }
            }


            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                if ($isChild == 'child')
                    $menuArray[$value[$fecthStyle]]['child'] = $this->getAllPropertyAgain($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $fetchType);
                else
                    $menuArray[$value[$fecthStyle]] = $this->getAllPropertyAgain($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $fetchType);
            }
        }


        return $menuArray;
    }

    /**
     * Created by Amit Malakar
     * Get All Property Again for Print
     * @param $menu1
     * @param $menu2
     * @param $menuArray
     * @param $node_instance_id
     * @return mixed
     */
    public function getAllPropertyAgainPrint($menu1, $menu2, $menuArray, $node_instance_id) {
        foreach ($menu1 as $key => $value) {
            $menuArray[$value['node_class_property_id']] = $value;
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('*'));
            $select->where->equalTo('nip.node_instance_id', $node_instance_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $value['node_class_property_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();
            if (is_array($dataArray[0]) && count($dataArray) > 0) {
                $menuArray[$value['node_class_property_id']]['node_instance_property_id'] = $dataArray[0]['node_instance_property_id'];
                $menuArray[$value['node_class_property_id']]['value'] = $dataArray[0]['value'];
            }


            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getAllPropertyAgainPrint($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id);
            }
        }
        return $menuArray;
    }

    public function getInstanceStructure($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgain($instancesArray['node_class_id'], $node_instance_id);
        $instancesArray['instances'] = $propArray[0];

        return $instancesArray;
    }

    public function getInstanceStructureWithHirerchy($node_instance_id, $fetchType = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $node_x_array = $this->getNodeXIdFromXYTable($instancesArray['node_id']);

        $subClassArray = array();
        foreach($node_x_array as $key => $node_id)
        {
            $temp = $this->getInstanceListOfParticulerClass($node_id,'node','node_id_subclass');
            $subClassArray[$temp['class_id']][] = $temp['data'];
        }

        $propArray = $this->getClassStructureAgain($instancesArray['node_class_id'], $node_instance_id, $fetchType);
        if ($fetchType == "")
            $instancesArray['instances'] = $propArray[0];
        else
            $instancesArray['Properties'] = $propArray[0]['Properties'];

        $instancesArray['Properties']['subClasses'] = $subClassArray;

        return $instancesArray;
    }

    /* function here to find parent folder for single level */

    public function getParentFolder($new_node_id) {


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_x_id', $new_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr[0]['node_y_id'];
    }

    /* end code here */

    /**
     * Created by Amit Malakar
     * Get Instance Structure for Print
     * @param $node_instance_id
     * @return array
     */
    public function getInstanceStructurePrint($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgainPrint($instancesArray['node_class_id'], $node_instance_id);
        $instancesArray['instances'] = $propArray[0];

        return $instancesArray;
    }

    public function getInstanceDataStructure($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgain($instancesArray['node_class_id'], $node_instance_id);
        $instancesArray['instances'] = $propArray[0];

        return $instancesArray;
    }

    public function getInstanceDataDetails($node_instance_id, $nodeClassId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgain($nodeClassId, $node_instance_id);
        $instancesArray['instances'] = $propArray[0];

        return $instancesArray;
    }

    /* code here for fetch details of multiple node x class value */

    public function getInstanceDataDetailsIns($node_instance_id, $nodeClassId) {
        $n = explode(",", $node_instance_id);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->IN('ni.node_instance_id', $n);
        $select->where->equalTo('ni.node_class_id', $nodeClassId);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgain($nodeClassId, $dataArray[0]['node_instance_id']);
        $instancesArray['instances'] = $propArray[0];
        return $instancesArray;
    }

    public function getInstanceListByPagination($order, $order_by, $display, $node_class_id, $filter_operator, $search_text, $filter_field) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id', 'node_class_id', 'node_id', 'caption', 'node_type_id', 'encrypt_status', 'status' => new Expression('CASE WHEN status = 1 THEN "Published" WHEN status = 0 THEN "Draft" END')));
        $select->where->equalTo('node_class_id', $node_class_id);

        if ($filter_field == "")
            $filter_field = 'node_id';

        if ($filter_operator == 'equals') {
            if ($filter_field == 'status')
                $select->having->equalTo($filter_field, $search_text);
            else
                $select->where->AND->equalTo($filter_field, $search_text);
        }
        else if ($filter_operator == 'not_equal') {
            if ($filter_field == 'status')
                $select->having->AND->notEqualTo($filter_field, $search_text);
            else
                $select->where->AND->notEqualTo($filter_field, $search_text);
        }
        else if ($filter_operator == 'begins_with') {
            if ($filter_field == 'status')
                $select->having->AND->like($filter_field, $search_text . '%');
            else
                $select->where->AND->like($filter_field, $search_text . '%');
        }
        else if ($filter_operator == 'ends_with') {
            if ($filter_field == 'status')
                $select->having->AND->like($filter_field, '%' . $search_text);
            else
                $select->where->AND->like($filter_field, '%' . $search_text);
        }
        else if ($filter_operator == 'contains') {
            if ($filter_field == 'status')
                $select->having->AND->like($filter_field, '%' . $search_text . '%');
            else
                $select->where->AND->like($filter_field, '%' . $search_text . '%');
        }
        else if ($filter_operator == 'not_contains') {
            if ($filter_field == 'status')
                $select->having->AND->notLike($filter_field, '%' . $search_text . '%');
            else
                $select->where->AND->notLike($filter_field, '%' . $search_text . '%');
        }

        $select->order($order_by . ' ' . $order);

        if ($display == 'no-pagination') {
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        } else {
            $paginatorAdapter = new DbSelect($select, $this->adapter);
            $paginator = new Paginator($paginatorAdapter);
            return $paginator;
        }
    }

    public function createInstanceOfInstanceClass($node_class_id, $node_type_id) {
        $data['node_id'] = $this->createNode();
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;
        $data['status'] = 0;
        $data['caption'] = $data['node_id'];
        $data['node_class_id'] = $node_class_id;

        $sql = new Sql($this->adapter);
        $query = $sql->insert('node-instance');
        $query->values($data);
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
        $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();

        return array('node_instance_id' => $node_instance_id, 'node_id' => $data['node_id']);
    }

    public function createInstancePropertyOfInstanceClass($node_instance_id, $node_class_property_id, $value, $node_type_id) {
        if (trim($value) != '') {
            $data['node_instance_id'] = $node_instance_id;
            $data['node_type_id'] = $node_type_id;
            $data['node_class_property_id'] = $node_class_property_id;
            $data['value'] = $value;
            $data['node_id'] = $this->createNode();
            $data['encrypt_status'] = ENCRYPTION_STATUS;

            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values($data);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }
    }

    public function createInstance($instance_caption = '', $node_class_id = '', $node_type_id = '', $saveType = '', $node_instance_id = '') {
        $data['caption'] = (!empty($instance_caption)) ? $this->mc_encrypt($instance_caption, ENCRYPTION_KEY) : "";
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;
        if ($saveType == 'D')
            $data['status'] = 0;
        else
            $data['status'] = 1;
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

        if (empty($node_instance_id))
            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();

        return $node_instance_id;
    }

    public function createInstanceVersion($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id) {
        $data['caption'] = $this->mc_encrypt($instance_caption, ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;
        if ($saveType == 'D')
            $data['status'] = 0;
        else
            $data['status'] = 1;
        $sql = new Sql($this->adapter);

        $data['node_id'] = $this->createNode();
        if ($data['caption'] == "") {

            $data['caption'] = $data['node_id'];
        }
        $data['node_class_id'] = $node_class_id;
        $query = $sql->insert('node-instance');
        $query->values($data);

        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);

        $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();



        return $node_instance_id;
    }

    public function createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id) {

        foreach ($instance_property_id as $key => $value) {
            if (trim($instance_property_caption[$key]) != '') {
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

                            $sql = new Sql($this->adapter);
                            $query = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement = $sql->prepareStatementForSqlObject($query);
                            $result = $statement->execute();
                        }
                    }
                } else {
                    $data = array();
                    $data['value'] = $newVal; // modified code section awdhesh soni//remove htmlspecialcharsbcoz it was giving issue while saving
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_instance_id'] = $node_instance_id;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = $node_type_id;
                    $data['node_class_property_id'] = $value;

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-instance-property');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                }
            }
        }
    }

    public function updateInstanceProperty($instance_property_id, $instance_property_caption, $class_property_id, $node_instance_id, $node_type_id) {

        foreach ($instance_property_id as $key => $value) {
            if (trim($value) != "" && intval($value) > 0 && trim($instance_property_caption[$key]) != '') {
                $newVal = trim($this->mc_encrypt($instance_property_caption[$key], ENCRYPTION_KEY));
                if (substr($newVal, -3) == CHECKBOX_SEPERATOR) {
                    $sql = new Sql($this->adapter);
                    $delete = $sql->delete();
                    $delete->from('node-instance-property');
                    $delete->where->equalTo('node_instance_id', $node_instance_id);
                    $delete->where->AND->equalTo('node_class_property_id', $class_property_id[$key]);
                    $statement = $sql->prepareStatementForSqlObject($delete);
                    $result = $statement->execute();

                    $newValArray = explode(CHECKBOX_SEPERATOR, $newVal);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data = array();
                            $data['value'] = $v;
                            $data['encrypt_status'] = ENCRYPTION_STATUS;
                            $data['node_instance_id'] = $node_instance_id;
                            $data['node_id'] = $this->createNode();
                            $data['node_type_id'] = $node_type_id;
                            $data['node_class_property_id'] = $class_property_id[$key];
                            $sql = new Sql($this->adapter);
                            $query = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement = $sql->prepareStatementForSqlObject($query);
                            $result = $statement->execute();
                        }
                    }
                } else {
                    $data = array();
                    $data['value'] = $newVal;
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_type_id'] = $node_type_id;

                    $sql = new Sql($this->adapter);
                    $query = $sql->update();
                    $query->table('node-instance-property');
                    $query->set($data);
                    $query->where(array('node_instance_property_id' => $value));
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $resultObj->initialize($result);
                }
            }
        }
        foreach ($instance_property_id as $key => $value) {
            if (trim($value) == "" && trim($instance_property_caption[$key]) != '') {
                $newVal = trim($this->mc_encrypt($instance_property_caption[$key], ENCRYPTION_KEY));

                if (substr($newVal, -3) == CHECKBOX_SEPERATOR) {
                    $newValArray = explode(CHECKBOX_SEPERATOR, $newVal);

                    foreach ($newValArray as $k => $v) {
                        if (trim($v) != "") {
                            $data = array();
                            $data['value'] = $v;
                            $data['encrypt_status'] = ENCRYPTION_STATUS;
                            $data['node_instance_id'] = $node_instance_id;
                            $data['node_id'] = $this->createNode();
                            $data['node_type_id'] = $node_type_id;
                            $data['node_class_property_id'] = $class_property_id[$key];
                            $sql = new Sql($this->adapter);
                            $query = $sql->insert('node-instance-property');
                            $query->values($data);
                            $statement = $sql->prepareStatementForSqlObject($query);
                            $result = $statement->execute();
                        }
                    }
                } else {
                    $data = array();
                    $data['value'] = $newVal;
                    $data['encrypt_status'] = ENCRYPTION_STATUS;
                    $data['node_instance_id'] = $node_instance_id;
                    $data['node_id'] = $this->createNode();
                    $data['node_type_id'] = $node_type_id;
                    $data['node_class_property_id'] = $class_property_id[$key];

                    $sql = new Sql($this->adapter);
                    $query = $sql->insert('node-instance-property');
                    $query->values($data);
                    $statement = $sql->prepareStatementForSqlObject($query);
                    $result = $statement->execute();
                }
            }
        }
    }

    /* save parent data after move folder for child or parent class */

    public function createInstancePropertyFolder($parent_id, $node_instance_id, $node_type_id, $node_class_property_id) {
        if ($parent_id != '') {
            $data['value'] = trim($this->mc_encrypt($parent_id, ENCRYPTION_KEY));
            $data['encrypt_status'] = ENCRYPTION_STATUS;
            $data['node_instance_id'] = $node_instance_id;
            $data['node_id'] = $this->createNode();
            $data['node_type_id'] = $node_type_id;
            $data['node_class_property_id'] = $node_class_property_id;

            $sql = new Sql($this->adapter);
            $query = $sql->insert('node-instance-property');
            $query->values($data);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }
    }

    /* function start here for check version "Yes" and Deal creator exits */

    public function checkVersionCreator($node_class_id, $instance_property_id, $instance_property_caption, $node_instance_id) {
        $dealCreator = $instance_property_caption[2];
        $version = explode("~#~", $instance_property_caption[3]);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip1' => 'node-instance-property'));
        $select->columns(array('value', 'node_instance_property_id', 'node_instance_id'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip1.node_instance_id = nip2.node_instance_id', array(), '');
        $select->where->equalTo('nip2.node_class_property_id', $instance_property_id[2]);
        $select->where->AND->equalTo('nip2.value', $dealCreator);
        $select->where->AND->equalTo('nip1.node_class_property_id', $instance_property_id[3]);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $nodeInstPropertyId = "";

        foreach ($tempArr as $key => $value) {
            if ($value['value'] == "Yes") {
                $data['value'] = 'No';
                $sql = new Sql($this->adapter);
                $query = $sql->update();
                $query->table('node-instance-property');
                $query->set($data);
                $query->where(array('node_instance_property_id' => $value['node_instance_property_id']));
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
            }
        }
    }

    /* end code here */

    /*
     * Created By Awdhesh Kumar Soni
     * On Date: 15 mar, 2016
     * delete folder parent classfrom node instance property table
     * to save subclasses instance
     */

    function instnacePropertyDeleteMethod($tableName, $parent_id, $node_instance_id, $node_class_property_id) {

        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from($tableName);
        $delete->where->equalTo('node_class_property_id', $node_class_property_id);
        $delete->where->AND->equalTo('value', $parent_id);
        $delete->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    /*
     * Created By Awdhesh Kumar Soni
     * On Date: 16 mar, 2016
     * delete document folder parent class from node instance property table
     * to save subclasses instance
     */

    function instnacePropertyDeleteDocumentMethod($tableName, $node_instance_id, $node_class_property_id) {

        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from($tableName);
        $delete->where->equalTo('node_class_property_id', $node_class_property_id);
        $delete->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    /* end code here */

    /*
     * Created By Divya Rajput
     * On Date: 2 Dec, 2015
     * make copy of createInstanceProperty
     * to save subclasses instance
     */

    public function createInstancePropertyAgain($instance_property_id, $node_instance_id, $node_type_id, $node_class_property_id) {
        foreach ($instance_property_id as $key => $value) {
            $newVal = trim($this->mc_encrypt($value, ENCRYPTION_KEY));
            if (substr($newVal, -3) == CHECKBOX_SEPERATOR) {
                $newValArray = explode(CHECKBOX_SEPERATOR, $newVal);

                foreach ($newValArray as $k => $v) {
                    if (trim($v) != "") {
                        $data = array();
                        /*
                         * htmlspecialchars added by Divya,
                         * ON date: 4th May 2016
                         * as it is used in other section by Awdhesh */
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
                 * htmlspecialchars added by Divya,
                 * ON date: 4th May 2016
                 * as it is used in other section by Awdhesh */
                $data['value'] = htmlspecialchars($newVal);
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
    }

    /*
     * Created By Divya Rajput
     * On Date: 8 Dec, 2015
     * to update subclasses instance
     */

    public function updateSubInstancePropertyAgain($instance_property_id, $node_type_id, $node_instance_id, $node_class_property_id) {

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
                            /*
                             * htmlspecialchars added by Divya,
                             * ON date: 4th May 2016
                             * as it is used in other section by Awdhesh */
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
                     * htmlspecialchars added by Divya,
                     * ON date: 4th May 2016
                     * as it is used in other section by Awdhesh */
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
                    /*
                     * htmlspecialchars added by Divya,
                     * ON date: 4th May 2016
                     * as it is used in other section by Awdhesh */
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

    /* END HERE */

    /**
     * Modified by: Amit Malakar
     * Date: 16-Feb-2017
     * Get next id of a column in a table
     * @param $table
     * @param $column
     * @return int
     */
    public function getLastNumber($table, $column) {
        if(0) {
            $sqlQuery  = 'CALL getLastNumber("'.$table.'", "'.$column.'");';
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj        = new ResultSet();
            $dataArray        = $resultObj->initialize($result)->toArray();
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

        if (intval($dataArray[0][$column]) == "")
            return 1;
        else
            return intval($dataArray[0][$column]) + 1;
    }

    public function deleteClass($delete_ids) {
        foreach ($delete_ids as $key => $node_class_id) {
            if (intval($node_class_id) > 0) {
                $nodeArray = array();
                $nodeArray[] = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from(array('ni' => 'node-instance'));
                $select->columns(array('node_instance_id', 'node_id'));
                $select->where->equalTo('ni.node_class_id', $node_class_id);

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();

                $returnArray = array();

                foreach ($dataArray as $key => $value) {
                    $returnArray['node_instance_id'][$value['node_instance_id']] = $value['node_instance_id'];
                    $nodeArray[] = $value['node_id'];
                }
                $returnArray['node_instance_id'] = array_values($returnArray['node_instance_id']);
                /* ------------------------------------------------------------------------------------------------------------------- */
                $select = $sql->select();
                $select->from(array('ni' => 'node-class-property'));
                $select->columns(array('node_class_property_id', 'node_id'));
                $select->where->equalTo('ni.node_class_id', $node_class_id);

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();

                foreach ($dataArray as $key => $value) {
                    $returnArray['node_class_property_id'][$value['node_class_property_id']] = $value['node_class_property_id'];
                    $nodeArray[] = $value['node_id'];
                }
                $returnArray['node_class_property_id'] = array_values($returnArray['node_class_property_id']);
                /* ------------------------------------------------------------------------------------------------------------------- */
                if (count($returnArray['node_instance_id']) > 0) {
                    $select = $sql->select();
                    $select->from(array('ni' => 'node-instance-property'));
                    $select->columns(array('node_instance_property_id', 'node_id'));
                    $select->where->IN('ni.node_instance_id', $returnArray['node_instance_id']);

                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $dataArray = $resultObj->initialize($result)->toArray();

                    foreach ($dataArray as $key => $value) {
                        $returnArray['node_instance_property_id'][$value['node_instance_property_id']] = $value['node_instance_property_id'];
                        $nodeArray[] = $value['node_id'];
                    }
                    $returnArray['node_instance_property_id'] = array_values($returnArray['node_instance_property_id']);
                } else {
                    $returnArray['node_instance_property_id'] = array();
                }
                /* ------------------------------------------------------------------------------------------------------------------- */

                if (count($returnArray['node_instance_property_id']) > 0) {
                    $this->commonDeleteMethod('node-instance-property', 'node_instance_property_id', $returnArray['node_instance_property_id'], 'in');
                }

                if (count($returnArray['node_instance_id']) > 0) {
                    $this->commonDeleteMethod('node-instance', 'node_instance_id', $returnArray['node_instance_id'], 'in');
                }

                if (count($returnArray['node_class_property_id']) > 0) {
                    $this->commonDeleteMethod('node-class-property', 'node_class_property_id', $returnArray['node_class_property_id'], 'in');
                }

                $this->commonDeleteMethod('node-class', 'node_class_id', $node_class_id, 'equalto');
                /* Delete Node Ids */
                $this->commonDeleteMethod('node-sub-class', 'primary_node_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node-sub-class', 'child_node_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
            }
        }
    }

    /* function here to remove from data node instance , node instance property and node x y table bases of node_id */

    public function deleteInstanceAll($delete_ids) {
        foreach ($delete_ids as $key => $node_id) {
            if (trim($node_id) != '') {

                $nodeId = explode(",", $node_id);

                $nodeId1 = array_values(array_unique($nodeId));

                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-instance');
                $select->columns(array('node_instance_id'));
                $select->where->IN('node_id', $nodeId1);

                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();
                $returnArray = array();

                foreach ($dataArray as $key => $value) {

                    $nodeArray = array();
                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from('node-instance-property');
                    $select->where->equalTo('node_instance_id', $value['node_instance_id']);
                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $dataArray = $resultObj->initialize($result)->toArray();
                    $nodeArray[] = $dataArray[0]['node_id'];

                    $this->commonDeleteMethod('node-instance-property', 'node_instance_id', $value['node_instance_id'], 'equalto');
                    $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
                    $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
                    $this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
                }
                /* ------------------------------------------------------------------------------------------------------------------- */
                $this->commonDeleteMethod('node-instance', 'node_instance_id', $value['node_instance_id'], 'equalto');
                $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeId1, 'in');
                $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeId1, 'in');
                $this->commonDeleteMethod('node', 'node_id', $nodeId1, 'in');
            }
        }
    }

    /* end code here */

    public function deleteInstance($delete_ids) {

        /*conditions set for deleting nodes in one query */
        if(is_array($delete_ids['instance_id'])){
            $this->deleteInstanceArr($delete_ids);
        }
        else{
            /* end conditions set for deleting nodes in one query */
            foreach ($delete_ids as $key => $node_instance_id) {

                if (trim($node_instance_id) != '') {
                    $nodeArray = array();
                    $nodeArray[] = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id);
                    $sql = new Sql($this->adapter);
                    $select = $sql->select();
                    $select->from('node-instance-property');
                    $select->columns(array('node_instance_property_id', 'node_id'));
                    $select->where->equalTo('node_instance_id', $node_instance_id);

                    $statement = $sql->prepareStatementForSqlObject($select);
                    $result = $statement->execute();
                    $resultObj = new ResultSet();
                    $dataArray = $resultObj->initialize($result)->toArray();


                    foreach ($dataArray as $key => $value) {
                        $returnArray['node_instance_property_id'][] = $value['node_instance_property_id'];
                        $nodeArray[] = $value['node_id'];
                    }

                    /* ------------------------------------------------------------------------------------------------------------------- */

                    if (count($returnArray['node_instance_property_id']) > 0) {
                        $this->commonDeleteMethod('node-instance-property', 'node_instance_property_id', $returnArray['node_instance_property_id'], 'in');
                    }
                    $this->commonDeleteMethod('node-instance', 'node_instance_id', $node_instance_id, 'equalto');
                    $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
                    $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray, 'in');
                    $this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');

                }

            }
        }

    }
    /**
     * Accepting the $delete ids array.
     * @param type $delete_ids
     *
     */

    public function deleteInstanceArr($delete_ids){

        $nodeArray = array();
        $returnArray = array();

        foreach ($delete_ids['instance_id'] as $key => $node_instance_id) {

            if (trim($node_instance_id) != '') {

                $nodeArray[] = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id);
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-instance-property');
                $select->columns(array('node_instance_property_id', 'node_id'));
                $select->where->equalTo('node_instance_id', $node_instance_id);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();
                foreach ($dataArray as $key => $value) {
                    $returnArray['node_instance_property_id'][] = $value['node_instance_property_id'];
                    $nodeArray[] = $value['node_id'];
                }
            }
        }

            if (count($returnArray['node_instance_property_id']) > 0) {
               // $this->commonDeleteMethod('node-instance-property', 'node_instance_property_id', $returnArray['node_instance_property_id'], 'in');
                }
                if(count($delete_ids['instance_id'])>0)
                   // $this->commonDeleteMethod('node-instance', 'node_instance_id', $delete_ids['instance_id'], 'in');
                if(count($nodeArray)>0)
                {

                //$status=array();
                //$status['node-x-y-relation query start']= date('l jS \of F Y h:i:s A');
                 $this->customCommonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray);
               // $status['node-x-y-relation y query end/start']= date('l jS \of F Y h:i:s A');
                 $this->customCommonDeleteMethod('node-x-y-relation', 'node_x_id', $nodeArray);
                //$status['node-x-y-relation x query end/start']= date('l jS \of F Y h:i:s A')
                 $this->customCommonDeleteMethod('node', 'node_id', $nodeArray);

                //$this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
                //$status['node query end/start']= date('l jS \of F Y h:i:s A');
                //return $status;



            }
    }
    public function customCommonDeleteMethod($tableName,$fieldName,$dataArr){
        if(count($dataArr)>0)
            {
            $queryVals = array();
            $resultString = "'" . implode("', '", $dataArr) . "'";
            $queryVals[] = $resultString;
            $sqlQuery = implode(',', $queryVals);
            $sqlQuery = "DELETE from `" . $tableName . "` where " . $fieldName . " IN (" . $sqlQuery . ")";
            //return $sqlQuery;
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();
        }
    }
    public function getClassNodeX() {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_type_id', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassXArray = $resultObj->initialize($result)->toArray();
        return $nodeClassXArray;
    }

    public function getClassNodeType($nodeTypeId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_type_id', $nodeTypeId);
        $select->where->equalTo('status', 1);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassXArray = $resultObj->initialize($result)->toArray();
        return $nodeClassXArray;
    }

    public function getSaveType($node_y_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_class_id', $node_y_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $ClassArray = $resultObj->initialize($result)->toArray();
        return $ClassArray;
    }

    public function getNodeProperty($node_y_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_id', $node_y_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassXArray = $resultObj->initialize($result)->toArray();
        return $nodeClassXArray;
    }

    /*
     * Created BY Divya
     * On Date 6th OCT 2015
     * to get All data of Class
     * on behalf of class id
     */

    public function getClassInstanceData($node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-class'));
        $select->columns(array('node_class_caption' => 'caption', 'node_class_id', 'node_class_encrypt' => 'encrypt_status'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_class_id = nc.node_class_id', array('node_id', 'node_instance_id', 'node_instance_caption' => 'caption', 'node_instance_encrypt' => 'encrypt_status'), '');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value', 'node_instance_property_encrypt' => 'encrypt_status'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption', 'node_class_property_encrypt' => 'encrypt_status', 'node_class_property_id'), '');
        $select->where(array('nc.node_class_id' => $node_class_id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = $resultObj->initialize($result)->toArray();


        foreach ($temp as $key => $value) {
            if (intval($value['node_class_encrypt']) == 1)
                $temp[$key]['node_class_caption'] = $this->mc_decrypt($value['node_class_caption'], ENCRYPTION_KEY);

            if (intval($value['node_instance_encrypt']) == 1)
                $temp[$key]['node_instance_caption'] = $this->mc_decrypt($value['node_instance_caption'], ENCRYPTION_KEY);

            if (intval($value['node_instance_property_encrypt']) == 1)
                $temp[$key]['value'] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);

            if (intval($value['node_class_property_encrypt']) == 1)
                $temp[$key]['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY);
        }
        return $temp;
    }

    /*
     * Created BY Divya
     * On Date 15th OCT 2015
     * to insert instances
     * on behalf of class id
     */

    public function saveImportInstance($node_class_id, $dataArray, $template, $propertClassIdArray, $node_type_id) {
        /* $sequence        							= 	$this->getClassStructure($node_class_id);

          $propertyArray      						= 	array();
          $propertClassIdArray						= 	$this->getImportancePropertyChild($propertyArray, $sequence[0]['property']); */

        $node_instance_id = $dataArray[0];
        $node_id = $dataArray[1];

        $existence = $this->checkInstanceExist($node_instance_id, $node_id);

        if (trim($template) != 'generateInstance') {
            unset($dataArray[0]);
            unset($dataArray[1]);
        }

        $finalDataArray = array_values($dataArray);

        if ($existence) {
            $status = $this->updateInstancePropertyAgain($propertClassIdArray, $node_instance_id, $finalDataArray);
        } else {
            $status = $this->insertInstancePropertyAgain($propertClassIdArray, $node_class_id, $finalDataArray, $node_type_id);
        }
        return $status;
    }

    /*
     * Created BY Divya
     * On Date 15th OCT 2015
     * to get node_class_property_id
     * on behalf of node class id
     */

    public function getImportancePropertyChild($propertyArray, $subChildArray) {
        $caption = "";
        foreach ($subChildArray as $key => $childArray) {
            if (!is_array($childArray['child'])) {
                $propertyArray[] = $childArray['node_class_property_id'];
            }

            if (is_array($childArray['child'])) {
                $propertyArray = $this->getImportancePropertyChild($propertyArray, $childArray['child']);
            }
        }
        return $propertyArray;
    }

    /*
     * Created BY Divya
     * On Date 15th OCT 2015
     * to update instances
     */

    public function updateInstancePropertyAgain($sequence, $node_instance_id, $instanceArray) {
        $affectedRows = 0;

        for ($j = 0; $j < count($instanceArray); $j++) {
            $node_class_property_id = $sequence[$j];
            $instancedata['value'] = $this->mc_encrypt(str_replace(chr(133), '...', $instanceArray[$j]), ENCRYPTION_KEY);
            $instancedata['encrypt_status'] = ENCRYPTION_STATUS;

            $sql = new Sql($this->adapter);
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($instancedata);
            $query->where->equalTo('node_instance_id', $node_instance_id);
            $query->where->equalTo('node_class_property_id', $node_class_property_id);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();

            $affectedRows += $result->getAffectedRows();
        }
        return $affectedRows;
    }

    /*
     * Created BY Divya
     * On Date 15th OCT 2015
     * to insert instances
     */

    public function insertInstancePropertyAgain($sequence, $node_class_id, $dataArray, $node_type_id) {
        for ($i = 0; $i < count($dataArray); $i++) {
            if ($i == 0) {
                //$node_id 										= 	$this->createNode(); // get a node id from node table

                /* $typeArray  									=   $this->getClassList($node_class_id);
                  $node_type_id 									=   $typeArray['node_type_id']; */ //get node type id from class table
                $newNodeId = $this->getLastNumber('node', 'node_id'); //get caption name from node table

                $node_instance['node_class_id'] = $node_class_id;
                $node_instance['node_id'] = $this->createNode();
                $node_instance['node_type_id'] = $node_type_id;
                $node_instance['caption'] = $this->mc_encrypt(str_replace(chr(133), '...', $newNodeId), ENCRYPTION_KEY);
                $node_instance['encrypt_status'] = ENCRYPTION_STATUS;

                $sql = new Sql($this->adapter);
                $select = $sql->insert('node-instance');
                $select->values($node_instance);
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
                $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();
            }

            $node_instance_value = $this->mc_encrypt(str_replace(chr(133), '...', $dataArray[$i]), ENCRYPTION_KEY);

            $node_class_property_id = $sequence[$i];

            //$new_node_id 										= 	$this->createNode();
            $node_instance_property['node_instance_id'] = $node_instance_id;
            $node_instance_property['node_class_property_id'] = $node_class_property_id;
            $node_instance_property['node_id'] = $this->createNode();
            $node_instance_property['node_type_id'] = $node_type_id;
            $node_instance_property['value'] = $node_instance_value;
            $node_instance_property['encrypt_status'] = ENCRYPTION_STATUS;

            $sql = new Sql($this->adapter);
            $select = $sql->insert('node-instance-property');
            $select->values($node_instance_property);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $resultObj->initialize($result);
        }
        return 'insert';
    }

    /*
     * Created BY Divya
     * On Date 21th OCT 2015
     * to check instances exist
     * check on behalf of node instyance id and node id
     */

    public function checkInstanceExist($node_instance_id, $node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->where->equalTo('node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeClassXArray = $resultObj->initialize($result)->toArray();
        return count($nodeClassXArray);
    }

    /* End Here */

    /* function here to use encrypt data */

    public function mc_encrypt($encrypt, $key) {
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

    /* Function here to check mapping instance exits or not if count > 1 then exits */

    public function checkMappingInstance($node_class_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->where->equalTo('node_class_id', $node_class_id);
        $select->where->equalTo('type', 2);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return count($dataArray);
    }

    public function mc_decrypt($decrypt, $key) {
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

    /*
     * Create by AMIT MALAKAR
     * Get Properties of a node
     *
     * return @array (node_class_property_id)
     */

    public function getNodeClassPropertyIds($node_class_id) {
        $result = array();
        $file_class_id = $node_class_id;
        // get class properties
        foreach ($this->getProperties($file_class_id) as $pro) {
            if ($pro['sequence'] != 0) {
                if ($pro['node_class_property_parent_id'] == 0) {
                    $result[$pro['node_class_property_id']] = null;
                } else {
                    $result[$pro['node_class_property_parent_id']][] = $pro['node_class_property_id'];
                }
            }
        }
        $allKeys = array_keys($result);
        foreach ($result as $key => $value) {
            for ($i = 0; $i < count($value); $i++) {
                if (in_array($value[$i], $allKeys)) {
                    $result[$key][$i] = $result[$value[$i]];
                    unset($result[$value[$i]]);
                }
            }
        }

        return $result;
    }

    /*
     * Create by AMIT MALAKAR
     * Get SubClasses of a node
     *
     * return @array (node_class_ids)
     */

    public function getNodeSubClasses($node_class_id) {

        $child_classes = $this->getClassChild($node_class_id);
        $result = array();
        if (isset($child_classes['data']) && count($child_classes['data'])) {
            foreach ($child_classes['data'] as $child) {
                if (isset($child['node_class_id']) && intval($child['node_class_id']))
                    array_push($result, $child['node_class_id']);
            }
        }

        return array('sc' => $result);
    }

    /*
     * Created by Amit Malakar
     * Get Class & Property structure hierarchy
     *
     * return @array
     */

    public function getClassPropertyStructure($root_node_class_id) {
        $class_struc = $this->getNodeClassPropertyIds($root_node_class_id);
        $class_struc += $this->getNodeSubClasses($root_node_class_id);
        return $class_struc;
    }

    /*
     * Create by Amit Malakar
     * Remove key from array & reset keys
     * return @array
     */

    public function resetArray($arr, $key, $reset) {
        // remove sc key
        if (isset($arr[$key])) {
            unset($arr[$key]);
        }
        // array all array keys
        if ($reset)
            $arr = array_values($arr);

        return $arr;
    }

    /* end code here */

    /* start code of node z class instances */

    public function getClassListNew($order, $order_by, $filter_operator, $search_text, $filter_field) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class');
        $select->columns(array('node_class_id', 'node_id', 'caption', 'node_type_id', 'status'));

        if ($filter_operator == 'equals') {
            $select->where->equalTo($filter_field, $search_text);
        } else if ($filter_operator == 'not_equal') {
            $select->where->notEqualTo($filter_field, $search_text);
        } else if ($filter_operator == 'begins_with') {
            $select->where->like($filter_field, $search_text . '%');
        } else if ($filter_operator == 'ends_with') {
            $select->where->like($filter_field, '%' . $search_text);
        } else if ($filter_operator == 'contains') {
            $select->where->like($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'not_contains') {
            $select->where->notLike($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'all') {
            $select->where->NEST->like('node_id', '%' . $search_text . '%')->OR->like('caption', '%' . $search_text . '%')->UNNEST;
        }

        $select->where->AND->equalTo('status', 1);
        $select->where->AND->equalTo('node_type_id', 2);
        $select->order($order_by . ' ' . $order);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    public function getInstanceListAgain($node_class_id, $order, $order_by, $filter_operator, $search_text, $filter_field) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id', 'node_class_id', 'status', 'node_id' => new Expression("(SELECT `node_id` FROM `node-instance-property` WHERE `node-instance-property`.`node_instance_id` = `node-instance`.node_instance_id LIMIT 0 , 1)"), 'value' => new Expression("(SELECT `value` FROM `node-instance-property` WHERE `node-instance-property`.`node_instance_id` = `node-instance`.node_instance_id LIMIT 0 , 1)")));
        $select->where->equalTo('node_class_id', $node_class_id);
        $select->where->AND->equalTo('status', 1);

        if ($filter_operator == 'equals') {
            $select->having->equalTo($filter_field, $search_text);
        } else if ($filter_operator == 'not_equal') {
            $select->having->notEqualTo($filter_field, $search_text);
        } else if ($filter_operator == 'begins_with') {
            $select->having->like($filter_field, $search_text . '%');
        } else if ($filter_operator == 'ends_with') {
            $select->having->like($filter_field, '%' . $search_text);
        } else if ($filter_operator == 'contains') {
            $select->having->like($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'not_contains') {
            $select->having->notLike($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'all') {
            $select->having->NEST->like('node_id', '%' . $search_text . '%')->OR->like('value', '%' . $search_text . '%')->UNNEST;
        }

        $select->order($order_by . ' ' . $order);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /* end code of node z class instances */

    /*
     * Created By Amit Malakar
     * Get node_class_id by node_instance_id
     * return @integer
     */

    public function getClassIdByInstance($node_instance_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_class_id'];
    }

    public function getNodeInstanceValueBy($node_instance_id) {

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
            } else
                $tempArray[$data['node_class_property_id']] = $data['value'];
        }

        return $tempArray;
    }

    public function getInstanceChild($node_y_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->equalTo('node_y_id', $node_y_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        return $dataArray;
    }

    /**/

    public function fetchSubClassInstances($node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id'));
        $select->join(array('nxyr' => 'node-x-y-relation'), 'ni.node_id = nxyr.node_y_id', array('node_x_id'), 'left');
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $select->order('ni.sequence ASC');

        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    public function deleteSubClass($primary_node_id, $child_node_id) {
        $sql = new Sql($this->adapter);
        $delete = $sql->delete();
        $delete->from('node-sub-class');

        $delete->where->equalTo('primary_node_id', $primary_node_id);
        $delete->where->equalTo('child_node_id', $child_node_id);

        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
    }

    public function getinstanceDetailsByNodeId($node_id) {

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

    public function fetchNodeInstanceProperty($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->order('node_class_property_id ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getNodeInstanceStatusBy($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_instance_id', $node_instance_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    /**
     * Created by Amit Malakar
     * Instance Property Values for Instance Print
     * @param $node_instance_id
     * @return array|\Zend\Db\Adapter\Driver\ResultInterface
     */
    public function fetchNodeInstancePropertyPrint($node_instance_id) {
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
            if ($result[$data['node_class_property_id']] == '')
                $result[$data['node_class_property_id']] = html_entity_decode($data['value']);
            else {

                $propArr = explode(CHECKBOX_SEPERATOR, $result[$data['node_class_property_id']]);
                $result[$data['node_class_property_id']] = implode(CHECKBOX_SEPERATOR, array_unique($propArr));
                if (!preg_match('/' . $data['value'] . '/', $result[$data['node_class_property_id']])) {
                    $result[$data['node_class_property_id']] = $result[$data['node_class_property_id']] . CHECKBOX_SEPERATOR . html_entity_decode($data['value']);
                }
            }
        }

        return $result;
    }

    public function getIndividualUsersListByNodeId($nodeId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
        $select->where->AND->equalTo('ni.node_id', $nodeId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();



        $userArray = array();
        foreach ($dataArray as $key => $value) {
            $temp = $this->getUserProfile($value['node_id']);
            $temp['node_id'] = $value['node_id'];
            $userArray[] = $temp;
        }

        return $userArray;
    }

    public function getIndividualUsersList($data = array()) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id', 'node_class_id'));
        $select->where->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
        //Exclude users
        if (isset($data['excludedUsers']) && $data['excludedUsers'] != '') {
            $excludesUsersArr = explode(",", $data['excludedUsers']);
            $select->where->AND->NOTIN('ni.node_id', $excludesUsersArr);

        }
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $userArray = array();
        foreach ($dataArray as $key => $value) {
             $temp = $this->getUserProfile($value['node_id']);
             $temp['node_id'] = $value['node_id'];
             //For Ajax call
             //Added by :- Gaurav
             if (isset($data['ajaxcall']) && $data['ajaxcall'] == '1') {
                 $userArray[$value['node_id']] = $temp;
             }else{
                 $userArray[] = $temp;
             }



        }

        return $userArray;
    }

    public function getUserProfile($node_id) {
        $tempArray = $this->getNodeXOrYIdNew($node_id, 'node_y_id', 'node_x_id', 'Y', INDIVIDUAL_CLASS_ID);
        $userProfileArray = $this->getUserInstanceStructure($node_id);

        foreach ($tempArray as $key => $value) {
            $userNodeIdArray = $this->getUserInstanceStructure($value['node_x_id']);
            $userProfileArray = array_merge($userNodeIdArray, $userProfileArray);
        }

        return $userProfileArray;
    }

    public function getNodeXOrYIdNew($id, $fieldEqualTo, $fieldSend, $is_all_record, $node_class_id = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-x-y-relation'));
        $select->columns(array($fieldSend));

        if ($node_class_id != "") {
            $select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.' . $fieldSend, array('node_class_id', 'node_id'), 'inner');
            $select->where->notEqualTo('ni.node_class_id', $node_class_id);
            $select->where->AND->notEqualTo('ni.node_class_id', ROLE_CLASS_ID);
            $select->where->AND->equalTo('nip.' . $fieldEqualTo, $id);
        } else {
            $select->where->equalTo('nip.' . $fieldEqualTo, $id);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        if ($is_all_record == 'N')
            return $dataArray[0][$fieldSend];
        else
            return $dataArray;
    }

    public function getNodeXOrYId($id, $fieldEqualTo, $fieldSend, $is_all_record, $node_class_id = "") {
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
        if ($is_all_record == 'N')
            return $dataArray[0][$fieldSend];
        else
            return $dataArray;
    }

    public function getNodeXOfParticulerClass($id, $fieldEqualTo, $fieldSend, $node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-x-y-relation'));
        $select->columns(array($fieldSend));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.' . $fieldSend, array('node_class_id', 'node_id'), 'inner');
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $select->where->AND->equalTo('nip.' . $fieldEqualTo, $id);
        //return $select->getSqlstring();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getUserInstanceStructure($node_id) {
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
        $propArray = $this->getClassStructureAgain1($dataArray[0]['node_class_id'], $dataArray[0]['node_instance_id']);
        return $propArray;
    }

    public function getClassStructureAgain1($node_class_id, $node_instance_id) {
        $propArray = $this->getProperties($node_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        foreach ($propArray as $propk => $propv) {
            if (intval($propv['node_class_property_parent_id']) == 0)
                $mainPropArray[] = $propv;
            else
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
        }

        $realPropArray = array();
        return $this->getAllPropertyAgain1($mainPropArray, $subPropArray, $realPropArray, $node_instance_id);
    }

    public function getAllPropertyAgain1($menu1, $menu2, $menuArray, $node_instance_id) {
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
                if (intval($value['encrypt_status']) == 1)
                    $menuArray[str_replace(' ', '_', strtolower($this->mc_decrypt($value['caption'], ENCRYPTION_KEY)))] = $this->mc_decrypt($dataArray[0]['value'], ENCRYPTION_KEY);
                else
                    $menuArray[str_replace(' ', '_', strtolower($value['caption']))] = $dataArray[0]['value'];
            }

            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray = $this->getAllPropertyAgain1($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id);
            }
        }
        return $menuArray;
    }

    public function getSubClassStructure($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            $menuArray[$value['node_class_property_id']] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getSubClassStructure($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    public function getSubClassStructureWithSequence($node_y_class_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );
        $tempMainArray = array();
        $mainArray = array();

        if (count($instanceAttributeArray) > 0) {
            foreach ($instanceAttributeArray as $key => $valueArray) {

                if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                    $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                    $tempMainArray['node_class_id'] = $node_y_class_id;
                    $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                    $tempMainArray['node_id1'] = $this->getNodeClassId($node_y_class_id);
                    $mainArray[] = $tempMainArray;
                }

                $realPropArray1 = array();
            }
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');

            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();
            $mainArray[$key]['property'] = $this->getSubClassStructure($mainPropArray, $subPropArray, $realPropArray);
        }
        return $mainArray;
    }

    public function fetchDatafromNodeClass($new_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nsb' => 'node-sub-class'));
        $select->join(array('nc' => 'node-class'), 'nc.node_id=nsb.child_node_id', array('node_id', 'caption', 'encrypt_status', 'node_class_id'), 'inner');
        $select->where->equalTo('nsb.primary_node_id', $new_class_id);
        $select->order('nsb.sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();


        return $nodeArray;
    }

    public function getClassChildStructureWithSequence($mode, $classArray, $node_class_id, $temp_class_array = array()) {
        $new_class_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $nodeArray = $this->fetchDatafromNodeClass($new_class_id);

        $ids = "";
        $count = 0;

        /* Added this code to show subclasss name PLurals/Common Name */
        $taxnomoyClassDataArray = $this->getTaxonomyData($nodeArray);  //to fetch plural, singular, common name
        $node_z_class_property = $this->getNodeProperty(NODEZ_CLASS_ID);
        $node_z_class_prop_array = array();
        $taxnomoy_data_array = array();

        foreach ($taxnomoyClassDataArray as $key => $taxnomoyvalue) {
            foreach ($node_z_class_property as $node_z_prop) {
                if ($taxnomoyvalue[$node_z_prop['node_class_property_id']]) {
                    $taxnomoy_data_array[$key][$node_z_prop['caption']] = ($taxnomoyvalue[$node_z_prop['node_class_property_id']]) ? ($taxnomoyvalue[$node_z_prop['node_class_property_id']]) : '';
                }
            }
        }

        $dataArray = $this->getProperties($classArray['node_class_id'], $is_parent = 'N');
        $checkdataArray = $this->getProperties($classArray['node_class_id'], $is_parent = 'Y');
        $countClassesProperty = count($dataArray);
        $number_array = array();

        if ($mode == 'Edit' && (count($checkdataArray) == count($dataArray)) && (count($dataArray) == 1)) {
            $countClassesProperty++;
        }

        $number_print[$count] = $countClassesProperty;

        $subChildArray = array_column($nodeArray, 'child_node_id');
        $child_node_id_array = implode(",", $subChildArray);
        $tempSubClassArray = $this->fetchnodeClassCaption($child_node_id_array);

        $subClassArray = array();

        foreach ($tempSubClassArray as $subClass) {
            $subClassArray[$subClass['node_id']] = $subClass;
        }

        foreach ($nodeArray as $k => $v) {
            $ids = $ids . ',' . $v['child_node_id'];

            //$classArrayA          = $this->fetchnodeClassCaption($v['child_node_id']);
            $classArrayA = $subClassArray[$v['child_node_id']];

            $node_y_class_id = $classArrayA['node_class_id'];
            $classIdArray[$count] = $node_y_class_id;
            $node_idArray[$count] = $classArrayA['node_id'];

            if ($mode == 'Edit') {
                $countClassesProperty++;
                $number_print[$count] = $countClassesProperty;
            }

            if ($count == 0) {
                $number_print[$count] = $countClassesProperty + 2;
                $temp_class_array = array();
                $temp_class_array[] = $v['child_node_id'];
                $number_array[$count] = $this->countSubClassesWithData(0, $classIdArray[$count], $node_idArray[$count], $temp_class_array);
            } else {

                if (in_array($v['child_node_id'], $temp_class_array)) {
                    $number_print[$count] = intval($number_print[$count]);
                } else {
                    $countClassesData = $this->countSubClassesWithData($number_print[$count - 1], $classIdArray[$count - 1], $node_idArray[$count - 1], $temp_class_array);
                    $number_print[$count] = $countClassesData;
                    $temp_class_array = array();
                    $temp_class_array[] = $v['child_node_id'];
                    $number_array[$count] = $this->countSubClassesWithData(0, $classIdArray[$count], $node_idArray[$count], $temp_class_array);
                }
            }
            $count++;
        }
        return array('ids' => $ids, 'data' => $nodeArray, 'number_print' => $number_print, 'taxonomy_data' => $taxnomoy_data_array, 'number_array' => $number_array);
    }

    public function fetchChildDataWithSequence($mode, $node_class_id, $temp_class_array) {
        $text_number_print = array();
        $new_class_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $nodeArray = $this->fetchDatafromNodeClass($new_class_id);

        $dataArrayN = $this->getProperties($node_class_id, $is_parent = 'N');

        $countClassesProperty = count($dataArrayN) + 1;
        $number_print[0] = intval($countClassesProperty);
        $countselfClass = 0;
        $count = 0;

        if (count($nodeArray) > 0) {
            $subChildArray = array_column($nodeArray, 'child_node_id');
            $child_node_id_array = implode(",", $subChildArray);
            $tempSubClassArray = $this->fetchnodeClassCaption($child_node_id_array);
            $subClassArray = array();
            foreach ($tempSubClassArray as $subClass) {
                $subClassArray[$subClass['node_id']] = $subClass;
            }

            foreach ($subChildArray as $k => $v) {
                if (in_array($v, $temp_class_array)) {
                    $number_print[$count] = $this->countSubClassesWithData($number_print[$count], $classIdArray[$count], $node_idArray[$count], $temp_class_array);
                    $countselfClass = $number_print[$count];
                    $number_array[0] = intval($countselfClass) + 1;
                } else {
                    if (count($subClassArray[$v]) > 0) {
                        $countClassesProperty--;
                        $classArrayData = $subClassArray[$v];
                        $node_y_class_id = $classArrayData['node_class_id'];
                        $classIdArray[$count] = $node_y_class_id;
                        $node_idArray[$count] = $classArrayData['node_id'];

                        $count++;
                        $countClassesData = $this->countSubClassesWithData(0, $node_y_class_id, $classArrayData['node_id'], $temp_class_array);
                        $temp_class_array[] = $classArrayData['node_id'];

                        $number_print[$count] = intval($countClassesData);
                        $countselfClass = intval($number_print[$count]);
                    }
                }
            }

            $text_number_print[] = array_sum($number_print) + 1;
        } else {
            $text_number_print[] = $number_print[$count] + 1;
            $number_array[$count] = $number_print[$count] + 1;
        }

        return array('number_print' => $number_print, 'number_array' => $text_number_print);
    }

    public function countSubClassesWithData($count, $node_y_class_id, $node_id, $temp_primary_array) {
        $dataArray = $this->getProperties($node_y_class_id, $is_parent = 'N');
        $countClasses = intval($count) + count($dataArray) + 1;

        $childArray = $this->getClassChild($node_y_class_id);

        if (count($childArray['data']) > 0) {
            $countClassesA = 0;
            $temp_count = 0;
            foreach ($childArray['data'] as $key => $value) {
                $temp_node_y_class_id = $value['node_class_id'];
                $temp_node_id = $value['node_id'];

                if (trim($value['primary_node_id']) == trim($value['child_node_id'])) {
                    $countClasses++;
                } else {

                    //if(!in_array($temp_node_id, $temp_primary_array)){
                    $temp_primary_array = array(); //added on 28th March 2016
                    $countClassesA = $this->countSubClassesWithData($countClasses, $temp_node_y_class_id, $temp_node_id, $temp_primary_array);

                    $countClasses = $countClassesA;
                    $temp_primary_array[] = $temp_node_id;
                    //}
                }
            }
        }
        return $countClasses;
    }

    public function getClassStructureWithSequence($countNumber, $node_class_id, $temp_class_array, $disable_expand) {
        $countClassesProperty = 0;

        $new_class_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nsb' => 'node-sub-class'));
        $select->join(array('nc' => 'node-class'), 'nc.node_id=nsb.child_node_id', array('node_id', 'caption', 'encrypt_status', 'node_class_id'), 'inner');
        $select->where->equalTo('nsb.primary_node_id', $new_class_id);
        $select->order('nsb.sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();

        $ids = "";
        $count = 0;
        $temp_primary_array = array();

        $dataArray = $this->getProperties($node_class_id, $is_parent = 'N');
        $countClassesPropertyA = count($dataArray) + $countNumber;
        $number_print[$count] = $countClassesPropertyA;

        if (count($nodeArray) > 0) {
            $subChildArray = array_column($nodeArray, 'child_node_id');
            $child_node_id_array = implode(",", $subChildArray);
            $tempSubClassArray = $this->fetchnodeClassCaption($child_node_id_array);
            $subClassArray = array();

            foreach ($tempSubClassArray as $subClass) {
                $subClassArray[$subClass['node_id']] = $subClass;
            }

            foreach ($nodeArray as $k => $v) {
                if (!in_array($v['child_node_id'], $temp_class_array)) {
                    $temp_class_array[] = $v['child_node_id'];
                    $ids = $ids . ',' . $v['child_node_id'];

                    //$classArrayA            = $this->fetchnodeClassCaption($v['child_node_id']);
                    $classArrayA = $subClassArray[$v['child_node_id']];
                    $node_y_class_id = $classArrayA['node_class_id'];
                    $classIdArray[$count] = $node_y_class_id;
                    $node_idArray[$count] = $classArrayA['node_id'];
                    $temp_primary_array[] = $classArrayA['node_id'];

                    if ($count == 0) {
                        $number_print[$count] = $countClassesPropertyA + 1;
                        $disable_expand[$count] = 'active';
                    } else {
                        $countClassesData = $this->countSubClassesWithData($number_print[$count - 1], $classIdArray[$count - 1], $node_idArray[$count - 1], $temp_primary_array);
                        $number_print[$count] = $countClassesData;
                        $disable_expand[$count] = 'active';
                    }
                } else {
                    if (count($nodeArray) == 1) {
                        $number_print[$count] = $countClassesPropertyA + 1;
                        $disable_expand[$count] = 'inactive';
                    } else {
                        $number_print[$count] = $this->countSubClassesWithData($number_print[$count - 1], $classIdArray[$count - 1], $node_idArray[$count - 1], $temp_primary_array);
                        //$number_print[$count]  		=	intval($number_print[$count]) + 1;
                        $disable_expand[$count] = 'inactive';
                    }
                }
                $count++;
            }
        } else {
            $number_print[$count] = $countClassesPropertyA + 1;
            $disable_expand[$count] = 'inactive';
        }
        return array('ids' => $ids, 'data' => $nodeArray, 'number_print' => $number_print, 'disable_expand_icon' => $disable_expand);
    }

    /*
     * * Created By Divya Rajput
     * On Date 30th March 2016
     * to get subclass within class
     */

    public function getSiblingSubClass($node_y_class_id, $tempSubClassArray) {

        $subClassArray = $this->getNodeSubClasses($node_y_class_id);

        $tempSubClassArray[] = $subClassArray['sc'];

        if (count($subClassArray['sc']) > 0) {

            foreach ($subClassArray['sc'] as $key => $subClassArr) {
                if ($node_y_class_id != $subClassArr)
                    $tempSubClassArray = $this->getSiblingSubClass($subClassArr, $tempSubClassArray);
            }
        }
        return $tempSubClassArray;
    }

    /*
     * * Created By Divya Rajput
     */

    public function getSiblingCount($node_x_id_array, $retArray) {
        $instance_id_arrays = explode(',', $node_x_id_array);

        $class_id_array = $this->fetchNodeZ($node_x_id_array);
        $class_id_array = explode(',', $class_id_array);
        $retArray[] = $this->getFinalData($class_id_array);
        array_pop($instance_id_arrays);

        foreach ($instance_id_arrays as $key => $instance_node_id) {

            $instancearray = $this->fetchNodeXY($instance_node_id);

            if (trim($instancearray) != '') {
                $retArray = $this->getSiblingCount($instancearray, $retArray);
            }
        }
        return $retArray;
    }

    public function getFinalData($class_id_array) {
        array_pop($class_id_array);
        return array_unique($class_id_array);
    }

    public function getInstanceChildA($mode, $classArray, $node_class_id, $node_instance_id, $section_mode) {
        //in case of edit only
        $new_class_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);

        $nodeArray = $this->fetchDatafromNodeClass($new_class_id);

        $tempArray = array();
        $temp_primary_array = array();

        $ids = "";
        $count = 0;
        /* Added this code to show subclasss name PLurals/Common Name */
        $ClassDataArray = $this->getTaxonomyData($nodeArray);  //to fetch plural, singular, common name

        $node_z_class_property = $this->getNodeProperty(NODEZ_CLASS_ID);

        $node_z_class_prop_array = array();
        $data_array = array();

        foreach ($ClassDataArray as $key => $value) {
            foreach ($node_z_class_property as $node_z_prop) {
                if ($value[$node_z_prop['node_class_property_id']]) {
                    $data_array[$key][$node_z_prop['caption']] = ($value[$node_z_prop['node_class_property_id']]) ? ($value[$node_z_prop['node_class_property_id']]) : '';
                }
            }
        }

        $dataArrayA = $this->getInstancePropertiesA($classArray['node_class_id']);

        $number_print[$count] = $dataArrayA + 2;

        $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id);

        $node_x_id_array = $this->fetchNodeXY($instance_node_id); //$this->getNodeXIdFromXYTable($instance_node_id);

        $l = 0;

        if (count($nodeArray) > 0) {
            $textcount = count($nodeArray) - 1;
            $counted = 0;

            foreach ($nodeArray as $k => $v) {
                $counted = 0;

                $ids = $ids . ',' . $v['child_node_id'];
                //$classArrayA 				= 	$this->fetchnodeClassCaption($v['child_node_id']);
                $node_y_class_id = $v['node_class_id'];  //$classArrayA[0]['node_class_id']

                $classIdArray[$count] = $node_y_class_id;
                $node_idArray[$count] = $v['node_id'];   //$classArrayA[0]['node_id'];
                $temp_primary_array = array();
                if (trim($mode) == 'Display') {
                    $temp_primary_array[] = $v['node_id'];   //$classArrayA[0]['node_id'];
                }

                $siblingCountArray = array();
                $retArray = array();


                $node_instance_id_array = $this->getinstancesDetailsById($node_x_id_array, $node_y_class_id);

                if ($l <= $textcount) {


                    if ($node_instance_id_array != '') {

                        if ($mode == 'Display') {
                            //instance_id_array
                            $node_instance_id_array = explode(",", $node_instance_id_array);
                        } else {
                            //instance_id_array
                            $node_instance_id_array = explode(",", $node_instance_id_array);

                            //node_instance_id_array
                            $node_instance_temp_array = $this->fetchNodeIdArrayByInstanceID($node_instance_id_array);

                            $countarr = array();

                            if (intval($new_class_id) == intval($v['node_id'])) {
                                $countSubClass = array();
                            } else {
                                $countSubClass = $this->getSiblingSubClass($node_y_class_id, $countarr);
                            }

                            if (count($node_instance_id_array) > 1) {
                                $counted = count($countSubClass, COUNT_RECURSIVE) - count($countSubClass);
                            } else {
                                $counted = count($countSubClass, COUNT_RECURSIVE) - count($countSubClass);
                            }
                        }
                    }

                    if ($mode == 'Edit' && $section_mode == 'yes') {
                        if (intval($new_class_id) == intval($v['node_id'])) {
                            $countClassesData = intval($number_print[$count]);
                        } else {
                            $temp_primary_array[] = $new_class_id;

                            $countClassesData = $this->countInstanceSubClassesWithData($mode, $number_print[$count], $classIdArray[$count], $node_idArray[$count], $node_instance_id_array, $tempArray, $count, $temp_primary_array, $section_mode);
                        }
                    } else if ($mode == 'Edit' && $section_mode != 'yes') {
                        $countClassesData = $this->countInstanceSubClassesWithData($mode, $number_print[$count], $classIdArray[$count], $node_idArray[$count], $node_instance_id_array, $tempArray, $count, $temp_primary_array, $section_mode);
                    } else {
                        $countClassesData = $this->countInstanceSubClassesWithData($mode, $number_print[$count], $classIdArray[$count], $node_idArray[$count], $node_instance_id_array, $tempArray, $count, $temp_primary_array, $section_mode);
                    }

                    $count++;


                    if (count($node_instance_id_array) > 0) {
                        if ($mode == 'Edit' && $section_mode != 'yes') {
                            if (intval($new_class_id) == intval($v['node_id'])) {
                                $number_print[$count] = intval($countClassesData);
                            } else {
                                $number_print[$count] = intval($countClassesData) + 1;
                            }
                        } else {
                            $number_print[$count] = intval($countClassesData) + $counted + 1;
                        }
                    } else {
                        if (trim($mode) == 'Display') {
                            $number_print[$count] = intval($countClassesData) + $counted + 1; //$countClassesData + 1;
                        } else {

                            if ($mode == 'Edit' && $section_mode == 'yes') {
                                if (intval($new_class_id) == intval($v['node_id'])) {
                                    $number_print[$count] = intval($countClassesData);
                                } else {
                                    $number_print[$count] = intval($countClassesData) + 1;
                                }
                            } else {

                                $countarr = array();

                                $countSubClass = $this->getSiblingSubClass($node_y_class_id, $countarr);

                                $counted = count($countSubClass, COUNT_RECURSIVE) - count($countSubClass);

                                $number_print[$count] = intval($countClassesData) + $counted + 1;
                            }
                        }
                    }
                }
                $l++;
            }
        }

        return array('ids' => $ids, 'data' => $nodeArray, 'number_print' => $number_print, 'class_data' => $data_array);
    }

    /* public function numberInA($mode, $instanceArray, $node_class_id, $node_instance_id, $section_mode)
      {
      if(trim($mode) === 'Edit'){

      }else{
      //Display view
      }
      } */

    public function getInstanceChildANew($mode, $classArray, $node_class_id, $node_instance_id, $section_mode) {
        $tempArray = array();
        $temp_primary_array = array();

        $ids = "";
        $count = 0;

        $class_node_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $nodeArray = $this->fetchDatafromNodeClass($class_node_id);

        /* Added this code to show subclasss name PLurals/Common Name */
        $ClassDataArray = $this->getTaxonomyData($nodeArray);  //to fetch plural, singular, common name

        $node_z_class_property = $this->getNodeProperty(NODEZ_CLASS_ID);

        $node_z_class_prop_array = array();
        $data_array = array();

        foreach ($ClassDataArray as $key => $value) {
            foreach ($node_z_class_property as $node_z_prop) {
                if ($value[$node_z_prop['node_class_property_id']]) {
                    $data_array[$key][$node_z_prop['caption']] = ($value[$node_z_prop['node_class_property_id']]) ? ($value[$node_z_prop['node_class_property_id']]) : '';
                }
            }
        }

        $dataArrayA = $this->getInstancePropertiesA($classArray['node_class_id']);

        $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id);

        $node_x_id_array = $this->fetchNodeXY($instance_node_id);

        $number_print = intval($dataArrayA) + 2;

        $mainClassIDArray = array();

        if ((trim($node_instance_id) == '') && ($mode == 'Edit')) {
            $mainClassIDArray = array($node_class_id);
        }

        if (count($nodeArray) > 0) {
            $nodeArray = $this->getAllNumbersOfSubclass($nodeArray, $node_x_id_array, $number_print, $mode, $mainClassIDArray, $section_mode);
        }

        return array('ids' => $ids, 'data' => $nodeArray, 'number_print' => $number_print, 'class_data' => $data_array);
    }

    public function getAllNumbersOfSubclass($nodeArray, $node_x_id_array, $number_print, $mode, $mainClassIDArray, $section_mode) {
        if (trim($section_mode) != 'yes') {
            $mainClassIDArray = array();
        }

        foreach ($nodeArray as $key => $value) {
            $temp = $this->getClassAllInstanceOfParticuler($value, $node_x_id_array, $number_print, $mode, $mainClassIDArray);

            if (intval($temp['number']) > 0) {
                $value['number'] = $temp['number'];
                $value['isInstance'] = $temp['isInstance'];
                $value['newNum'] = $temp['newNum'];
                $nodeArray[$key] = $value;
                $number_print = intval($temp['newNum']);
            }
        }
        return $nodeArray;
    }

    public function getClassAllInstanceOfParticuler($value, $node_x_id_array, $number_print, $mode, $mainClassIDArray) {
        $tData = $this->checkIstance11($node_x_id_array, $value['node_class_id']);
        if (count($tData) > 0) {
            $gtotal = 0;
            foreach ($tData as $key => $valueArray) {
                $dataArrayA = $this->getInstancePropertiesA($valueArray['node_class_id']);

                $total = intval($dataArrayA) + 1;

                $class_node_id = $this->getNodeId('node-class', 'node_class_id', $valueArray['node_class_id']);

                $subClassArray = $this->fetchDatafromNodeClass($class_node_id);

                $node_x_id_array_new = $this->fetchNodeXY($valueArray['node_id']);

                if (count($subClassArray) > 0) {
                    $total = $this->getAllNumbersOfSubclassNew($subClassArray, $node_x_id_array_new, $total, $mode);
                }

                $gtotal = intval($gtotal) + intval($total);
            }

            $newNum = intval($number_print) + intval($gtotal) + 1;
            return array('number' => $number_print, 'newNum' => $newNum, 'isInstance' => 1);
        } else {
            if (trim($mode) == 'Edit') {

                if (in_array(trim($value['node_class_id']), $mainClassIDArray)) {
                    $totalNew = 0;
                } else {
                    //$gtotalNew 				= 	intval($number_print);

                    $dataArrayA = $this->getInstancePropertiesA($value['node_class_id']);

                    $totalNew = intval($dataArrayA) + 1;

                    $class_node_id = $this->getNodeId('node-class', 'node_class_id', $value['node_class_id']);

                    $subClassArray = $this->fetchDatafromNodeClass($class_node_id);

                    array_push($mainClassIDArray, $value['node_class_id']);

                    if (count($subClassArray) > 0) {
                        $totalNew = $this->getAllNumberSubclassInstanceStructure($subClassArray, $totalNew, $mode, $mainClassIDArray);
                    }
                }

                $newNum = intval($number_print) + intval($totalNew) + 1;
            } else {
                $newNum = intval($number_print) + 1;
            }

            return array('number' => $number_print, 'newNum' => $newNum, 'isInstance' => 0);
        }
    }

    public function getAllNumberSubclassInstanceStructure($subClassArray, $totalNewA, $mode, $mainClassIDArray) {
        $gtotalNewA = 0;

        foreach ($subClassArray as $subClass) {
            if (in_array(trim($subClass['node_class_id']), $mainClassIDArray)) {
                $gtotalNewA = intval($gtotalNewA) + 1;
            } else {
                $dataArrayA = $this->getInstancePropertiesA($subClass['node_class_id']);

                $totalNew = intval($dataArrayA) + 1;

                $class_node_id = $this->getNodeId('node-class', 'node_class_id', $subClass['node_class_id']);

                $newSubClassArray = $this->fetchDatafromNodeClass($class_node_id);

                array_push($mainClassIDArray, $subClass['node_class_id']);

                if (count($newSubClassArray) > 0) {
                    $totalNew = $this->getAllNumberSubclassInstanceStructureNew($newSubClassArray, $totalNew, $mode, $mainClassIDArray);
                }

                $gtotalNewA = intval($totalNew) + intval($gtotalNewA) + 1;
            }
        }
        $newNum = intval($totalNewA) + intval($gtotalNewA);
        return $newNum;
    }

    public function getAllNumberSubclassInstanceStructureNew($subClassArray, $numbertext, $mode, $mainClassIDArray) {
        $total = 0;

        foreach ($subClassArray as $subClass) {
            if ($subClass['node_class_id'] == 584) {

            } else {
                $gtotalNew = 0;

                $dataArrayA = $this->getInstancePropertiesA($subClass['node_class_id']);

                $totalNewA = intval($dataArrayA) + 1;

                $class_node_id = $this->getNodeId('node-class', 'node_class_id', $subClass['node_class_id']);

                $newSubClassArray = $this->fetchDatafromNodeClass($class_node_id);

                if (count($newSubClassArray) > 0) {
                    $gtotalNew = $this->getAllNumberSubclassInstanceStructure($newSubClassArray, $totalNewA, $mode);
                }
            }

            $total += intval($gtotalNew) + intval($totalNew);
        }

        $newNum = intval($numbertext) + intval($total);
        return $newNum;
    }

    public function getAllNumbersOfSubclassNew($nodeArray, $node_x_id_array, $number_print, $mode) {
        foreach ($nodeArray as $key => $value) {
            $number_print = $this->getClassAllInstanceOfParticulerNew($value, $node_x_id_array, $number_print, $mode);
        }

        return $number_print;
    }

    public function getClassAllInstanceOfParticulerNew($value, $node_x_id_array, $number_print, $mode) {
        $tData = $this->checkIstance11($node_x_id_array, $value['node_class_id']);

        if (count($tData) > 0) {
            $gtotal = 0;
            foreach ($tData as $key => $valueArray) {
                $dataArrayA = $this->getInstancePropertiesA($valueArray['node_class_id']);

                $total = intval($dataArrayA) + 1;

                $class_node_id = $this->getNodeId('node-class', 'node_class_id', $valueArray['node_class_id']);

                $subClassArray = $this->fetchDatafromNodeClass($class_node_id);

                $node_x_id_array_new = $this->fetchNodeXY($valueArray['node_id']);

                if (count($subClassArray) > 0) {
                    $total = $this->getAllNumbersOfSubclassNew($subClassArray, $node_x_id_array_new, $total, $mode);
                }

                $gtotal = intval($gtotal) + intval($total);
            }

            $newNum = intval($number_print) + intval($gtotal) + 1;
            return $newNum;
        } else {
            if (trim($mode) == 'Edit') {
                $gtotalNew = 0;

                $dataArrayA = $this->getInstancePropertiesA($value['node_class_id']);

                $totalNew = intval($dataArrayA) + 1;

                $class_node_id = $this->getNodeId('node-class', 'node_class_id', $value['node_class_id']);

                $subClassArray = $this->fetchDatafromNodeClass($class_node_id);

                if (count($subClassArray) > 0) {
                    $totalNew = $this->getAllNumberSubclassInstanceStructureNew($subClassArray, $totalNew, $mode);
                } else {
                    $gtotalNew = intval($number_print) + 1;
                }

                $newNum = intval($gtotalNew) + intval($totalNew);
                return $newNum;
            } else {
                $newNum = intval($number_print) + 1;
            }
            return $newNum;
        }
    }

    /* Created By Divya Rajput
      On Date: 13 April 2016 */

    public function checkIstance11($node_id, $node_class_id) {
        $node_id = substr($node_id, 0, -1);
        $node_id = explode(",", $node_id);

        if (count($node_id) > 0) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from('node-instance');
            $select->where->IN('node_id', $node_id);
            $select->where->equalTo('node_class_id', $node_class_id);
            $statement = $sql->prepareStatementForSqlObject($select);

            $result = $statement->execute();
            $resultObj = new ResultSet();
            $nodeArray = $resultObj->initialize($result)->toArray();
            return $nodeArray;
        }

        return array();
    }

    public function countInstanceSubClassesWithData($mode, $count, $node_y_class_id, $node_id, $instance_id_array, $tempArray, $countnum, $temp_primary_array, $section_mode) {
        $tempArray[$countnum] = $count;

        if (count($instance_id_array) > 0) {

            if (trim($mode) == 'Display') {

                foreach ($instance_id_array as $instance_id) {

                    $temp_node_y_class_id = $this->getClassIdByInstance($instance_id);

                    $countDiff = $this->getInstancePropertiesA($temp_node_y_class_id);

                    $countClassesProperty = $countDiff + 1;
                    $tempArray[$countnum] = intval($tempArray[$countnum]) + intval($countClassesProperty);

                    $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $instance_id);
                    $node_x_id_array = $this->fetchNodeXY($instance_node_id);
                    $instance_id_arrays = explode(',', $node_x_id_array);
                    $textarray = $this->getInstaceIdByNodeID($instance_id_arrays);

                    if (count($textarray) > 0) {
                        $node_array = array();
                        foreach ($textarray as $key => $value) {
                            $class_id = $this->getClassIdByInstance($value);

                            $node_array[$key] = $class_id;
                        }
                        $node_array = array_unique($node_array);
                        //$tempArray[$countnum] 	=	$tempArray[$countnum] + count($node_array);
                        $countClassesA = $this->countInstanceSubClassesWithData($mode, $tempArray[$countnum], $node_array, '', $textarray, $tempArray, $countnum, $temp_primary_array, $section_mode);

                        $tempArray[$countnum] = $countClassesA/* + 1 */;
                    } else {
                        /* $class_id 				=	$this->getClassIdByInstance($instance_id);
                          $classtempArray 		=	$this->getClassChild($class_id);

                          if(empty($classtempArray['ids'])){
                          }else{
                          foreach($classtempArray['data'] as $keys => $dataArray){
                          $countClassesA 			= 	$this->countInstanceSubClassesWithData($mode, $tempArray[$countnum], $dataArray['node_class_id'], '', array(), $tempArray, $countnum);

                          $tempArray[$countnum] 	=	intval($countClassesA) + 1;
                          }
                          } */
                    }
                }
            } else {
                foreach ($instance_id_array as $instance_id) {
                    $temp_node_y_class_id = $this->getClassIdByInstance($instance_id);
                    $countDiff = $this->getInstancePropertiesA($temp_node_y_class_id);

                    $countClassesProperty = $countDiff + 1;
                    $tempArray[$countnum] = intval($tempArray[$countnum]) + intval($countClassesProperty);

                    $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $instance_id);
                    $node_x_id_array = $this->fetchNodeXY($instance_node_id);
                    $instance_id_arrays = explode(',', $node_x_id_array);
                    $textarray = $this->getInstaceIdByNodeID($instance_id_arrays);

                    if (count($textarray) > 0) {
                        $node_array = array();
                        foreach ($textarray as $key => $value) {
                            $class_id = $this->getClassIdByInstance($value);
                            $node_array[$key] = $class_id;
                        }
                        $node_array = array_unique($node_array);
                        $tempArray[$countnum] = $tempArray[$countnum] + count($node_array);
                        $countClassesA = $this->countInstanceSubClassesWithData($mode, $tempArray[$countnum], '', '', $textarray, $tempArray, $countnum);
                        $tempArray[$countnum] = intval($countClassesA)/* + 1 */;
                    } else {
                        $class_id = $this->getClassIdByInstance($instance_id);

                        $classtempArray = $this->getClassChild($class_id);

                        if (empty($classtempArray['ids'])) {

                        } else {
                            foreach ($classtempArray['data'] as $keys => $dataArray) {
                                $countClassesA = $this->countInstanceSubClassesWithData($mode, $tempArray[$countnum], $dataArray['node_class_id'], '', array(), $tempArray, $countnum);
                                $tempArray[$countnum] = intval($countClassesA) + 1;
                            }
                        }
                    }
                }
            }
        } else {
            if (trim($mode) == 'Display') {
                $tempArray[$countnum] = $tempArray[$countnum];
            } else {

                if (in_array($node_id, $temp_primary_array)) {
                    $tempArray[$countnum] = $tempArray[$countnum];
                } else {
                    //$temp_primary_array[] 			=	$node_id;

                    $countClassesProperty = $this->getInstancePropertiesA($node_y_class_id);
                    $countClasses = intval($tempArray[$countnum]) + intval($countClassesProperty) + 1;
                    $tempArray[$countnum] = $countClasses;
                    $childArray = $this->getClassChild($node_y_class_id);

                    if (count($childArray['data']) > 0) {
                        $countClassesA = 0;
                        $temp_count = 0;

                        foreach ($childArray['data'] as $key => $value) {
                            $temp_node_y_class_id = $value['node_class_id'];
                            $temp_node_id = $value['node_id'];


                            $countClassesA = $this->countInstanceSubClassesWithData($mode, $tempArray[$countnum], $temp_node_y_class_id, $temp_node_id, array(), $tempArray, $countnum, $temp_primary_array, $section_mode);
                            $tempArray[$countnum] = intval($countClassesA);
                        }
                    }
                }
            }
        }

        return $tempArray[$countnum];
    }

    public function countInstanceSubClassesWithDataAgain($mode, $count, $node_x_id, $tempArray, $countnum, $instanceClassArray, $node_y_class_id, $child_node_id_count, $textArrayy, $tempCount) {

        if (trim($mode) == 'Display') {

            //get node class id from node-instance table by node id
            $node_y_class_id_array = explode(',', $this->fetchNodeZ($node_x_id));
            $node_y_class_id = $node_y_class_id_array[0];


            $countClassesProperty = $this->getInstancePropertiesA($node_y_class_id);

            $tempArray[$countnum] = intval($count) + intval($countClassesProperty) + 1;

            $countInstancesArray = $this->getNodeXIdFromXYTable($node_x_id);

            if (count($countInstancesArray) > 0) {
                foreach ($countInstancesArray as $temp_node_x_id) {

                    $node_id = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                    $subClasstextArrayA = $this->fetchDatafromNodeClass($node_id);

                    if (count($subClasstextArrayA) > 0) {
                        foreach ($subClasstextArrayA as $subClassArray) {

                            $node_class_id = $subClassArray['node_class_id'];

                            $dataArrayInstanceA = $this->checkIstance($temp_node_x_id, $node_class_id);

                            if (count($dataArrayInstanceA) > 0) {
                                //++$tempCount;
                                $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, $tempArray[$countnum], $temp_node_x_id, $tempArray, $countnum, $instanceClassArray, $node_class_id, $child_node_id_count, $textArrayy, $tempCount);
                            }
                        }
                    }
                    /* $dataA 					=	$this->countInstanceSubClassesWithDataAgain($mode, $tempArray[$countnum], $temp_node_x_id, $tempArray, $countnum, $instanceClassArray, $node_y_class_id, $child_node_id_count, $textArrayy);
                      $tempArray[$countnum]  	=	intval($dataA); */

                    //$instanceClassArray 	=	$dataA['text'];
                    /* $tempArray[$countnum] 		= 	intval($tempArray[$countnum]) + 1; */
                }
                /* $tempArray[$countnum] 		= 	intval($tempArray[$countnum]) + 1; */
            }
            /* else{
              //get class node id
              $node_id           		=   $this->getNodeId('node-class','node_class_id',$node_y_class_id);

              $classArray 			=	$this->getSubClassTableChildDataBy($node_id);
              $tempArray[$countnum] 	=	count($classArray) + intval($tempArray[$countnum]);
              } */
        } else {

            if ($node_x_id > 0) {
                //incase of instances only
                $node_y_class_id_array = explode(',', $this->fetchNodeZ($node_x_id));

                $node_y_class_id = $node_y_class_id_array[0];

                $countClassesProperty = $this->getInstancePropertiesA($node_y_class_id);

                $tempArray[$tempCount] = /* intval($count) + */ intval($countClassesProperty) + 1;

                $node_x_id_array = $this->getNodeXIdFromXYTable($node_x_id);

                $node_id = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                $subClasstextArray = $this->fetchDatafromNodeClass($node_id);

                $textArrayy[][$node_y_class_id] = $node_x_id;


                if (count($subClasstextArray) > 0) {
                    foreach ($subClasstextArray as $key => $classDataArray) {
                        $pnode_id = $classDataArray['primary_node_id'];
                        $cnode_id = $classDataArray['child_node_id'];
                        $cid = $classDataArray['node_class_id'];

                        if (count($node_x_id_array) > 0) {
                            foreach ($node_x_id_array as $node_y_id) {
                                $dataArrayInstance = $this->checkIstance($node_y_id, $cid);

                                if (count($dataArrayInstance) > 0) {
                                    $textArrayy[][$node_y_class_id] = $node_x_id;
                                    ++$tempCount;
                                    $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, $node_y_id, $tempArray, $countnum, $instanceClassArray, $cid, $child_node_id_count, $textArrayy, $tempCount);
                                } else {
                                    if ($pnode_id == $cnode_id) {
                                        $textA = ++$child_node_id_count;
                                        $instanceClassArray[$cnode_id] = $textA;

                                        if (intval($instanceClassArray[$cnode_id]) <= 1) {
                                            ++$tempCount;
                                            $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $cid, $child_node_id_count, $textArrayy, $tempCount);
                                        }
                                    } else {
                                        ++$tempCount;
                                        $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $cid, $child_node_id_count, $textArrayy, $tempCount);
                                    }
                                }
                            }
                        } else {
                            if ($pnode_id == $cnode_id) {
                                $text = ++$child_node_id_count;
                                $instanceClassArray[$cnode_id] = $text;

                                if (intval($instanceClassArray[$cnode_id]) > 1) {

                                } else {
                                    ++$tempCount;
                                    $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $cnode_id, $text, $textArrayy, $tempCount);
                                }
                            } else {
                                ++$tempCount;
                                $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $cnode_id, $child_node_id_count, $textArrayy, $tempCount);
                            }
                        }
                    }
                } else {
                    if (count($node_x_id_array) > 0) {

                    } else {
                        $node_id = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                        $textArray = $this->fetchDatafromNodeClass($node_id);

                        foreach ($textArray as $classArray) {
                            $primary_node_id = $classArray['primary_node_id'];
                            $child_node_id = $classArray['child_node_id'];
                            $node_class_id = $classArray['node_class_id'];

                            if ($primary_node_id == $child_node_id) {
                                $instanceClassArray[$child_node_id] = ++$child_node_id_count;

                                if (intval($instanceClassArray[$child_node_id]) > 1) {

                                } else {
                                    ++$tempCount;
                                    $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $node_class_id, $child_node_id_count, $textArrayy, $tempCount);
                                }
                            } else {
                                ++$tempCount;
                                $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $node_class_id, $child_node_id_count, $textArrayy, $tempCount);
                            }
                        }
                    }
                }
            } else {
                $countClassesProperty = $this->getInstancePropertiesA($node_y_class_id);

                $tempArray[$tempCount] = intval($countClassesProperty) + 1;

                $node_id = $this->getNodeId('node-class', 'node_class_id', $node_y_class_id);
                $textArray = $this->fetchDatafromNodeClass($node_id);


                $textArrayy[][$node_y_class_id] = $node_y_class_id;


                foreach ($textArray as $classArray) {
                    $primary_node_id = $classArray['primary_node_id'];
                    $child_node_id = $classArray['child_node_id'];
                    $node_class_id = $classArray['node_class_id'];

                    if ($primary_node_id == $child_node_id) {
                        $text = ++$child_node_id_count;
                        $instanceClassArray[$child_node_id] = $text;

                        if ($instanceClassArray[$child_node_id] > 1) {

                        } else {
                            ++$tempCount;
                            $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $node_class_id, $text, $textArrayy, $tempCount);
                        }
                    } else {
                        ++$tempCount;
                        $tempArray = $this->countInstanceSubClassesWithDataAgain($mode, 0, '', $tempArray, $countnum, $instanceClassArray, $node_class_id, $child_node_id_count, $textArrayy, $tempCount);
                    }
                }
            }

            /*
              $node_y_class_id_array			=	explode(',', $this->fetchNodeZ($node_x_id));
              $node_y_class_id         		=	$node_y_class_id_array[0];
              $dataArrayA 					=	$this->getInstancePropertiesA($node_y_class_id);
              $countClassesProperty 			=	$dataArrayA;
              $countClasses 					=	intval($count) + intval($countClassesProperty) + 1;
              $tempArray[$countnum]			=	$countClasses;
              $countInstancesArray    			=	$this->getNodeXIdFromXYTable($node_x_id);
              if(count($countInstancesArray) > 0){
              foreach($countInstancesArray as $temp_node_x_id){
              $dataA 					=	$this->countInstanceSubClassesWithDataAgain($mode, $tempArray[$countnum], $temp_node_x_id, $tempArray, $countnum,$textArray);
              $tempArray[$countnum]  	=	intval($dataA);
              }
              $tempArray[$countnum] 		= 	intval($tempArray[$countnum]) + 1;
              }
              $tempArray[$countnum] 			= 	intval($tempArray[$countnum]);
             */
        }

        return $tempArray;
    }

    public function getPropertiesA($node_y_class_id, $is_parent = 'N') {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_id', $node_y_class_id);

        if ($is_parent == 'Y')
            $select->where->equalTo('node_class_property_parent_id', 0);
        else
            $select->where->notEqualTo('node_class_property_parent_id', 0);

        $select->order('sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    public function getInstancePropertiesA($node_y_class_id) {
        $count = 0;
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->columns(array('node_class_property_id'));
        $select->where->equalTo('node_class_id', $node_y_class_id);
        $select->order('sequence ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instance_array = $resultObj->initialize($result)->toArray();

        if (count($instance_array) > 0) {
            $count += 1;
            foreach ($instance_array as $key => $value) {
                $node_class_property_id = $value['node_class_property_id'];
                $number = $this->getSequenceNumberCPropertyAgain($count, $node_class_property_id, $node_y_class_id);
                $count = $number;
            }
        }
        return $count;
    }

    public function getSequenceNumberCPropertyAgain($count, $parent_id, $node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-class-property');
        $select->where->equalTo('node_class_id', $node_class_id);
        $select->where->AND->equalTo('node_class_property_parent_id', $parent_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        if (count($nodeArray) > 0) {
            $sum = $count + count($nodeArray);
        } else {
            $sum = $count + 1;
        }
        return $sum;
    }

    /*
     * Created By Divya Rajput
     * On Date: 9 feb 2016
     * to fetch taxonomy's class data value
     */

    public function getTaxonomyData($nodeArray) {
        $instance_property_array = array();

        if (count($nodeArray)) {
            foreach ($nodeArray as $key => $dataArray) {
                $node_y_id = $dataArray['child_node_id'];
                $node_class_id = NODEZ_CLASS_ID;
                $instance_id_arr = $this->getInstaceIdByNodeXYAndNodeInstance($node_y_id, $node_class_id);
                $node_instance_id = $instance_id_arr[0]['node_instance_id'];

                $instance_property_array[$key] = $this->getNodeInstanceValueBy($node_instance_id);
            }
        }
        return $instance_property_array;
    }

    /* Created By Divya Rajput
      On Date: 9 feb 2016 */

    public function getInstaceIdByNodeXYAndNodeInstance($node_y_id, $node_class_id) {
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

    /* Created By Divya Rajput
      On Date: 9 feb 2016 */

    public function getInstaceIdByNodeID($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id'));
        $select->where->IN('node_id', $node_id);

        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        $temp_array = array();
        if (count($nodeArray) > 0) {
            foreach ($nodeArray as $key => $value) {
                $temp_array[] = $value['node_instance_id'];
            }
        }
        return $temp_array;
    }

    /* function created by Awdhesh soni */

    public function fetchnodeYId($nodeId) {

        $node_x_id = explode(",", $nodeId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->where->IN('node_y_id', array_unique($node_x_id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $impldeIClassId = array();
        foreach ($dataArray as $key => $value) {
            $impldeIClassId[] = $value['node_x_id'];
        }

        return (implode(",", array_unique($impldeIClassId)));
    }

    public function fetchnodeInstanceFoldeName($node_class_id, $filter_operator, $filter_field, $search_text, $order_by, $order, $folderParentId, $folderTimeStampId) {

        $nodeId = $this->getinstancesById($node_class_id);
        $nodeXId = $this->fetchnodeYId($nodeId);
        $node_x_id = explode(",", $nodeXId);
        $nodeId = explode(",", $nodeId);
        $tempArr = array();

        foreach ($nodeId as $key => $value) {
            if (!in_array($value, $node_x_id)) {
                $tempArr[] = $value;
            }
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id', 'value'), 'inner');

        if (!empty($tempArr) && $filter_operator == "") {

            $select->where->IN('ni.node_id', array_unique($tempArr));
            $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
            $select->where->AND->notEqualTo('nip.node_class_property_id', $folderParentId);
            $select->where->AND->notEqualTo('nip.node_class_property_id', $folderTimeStampId);
        } else {

            if ($filter_operator != "") {
                $select->where->IN('ni.node_id', array_unique($nodeId));
            }

            $select->where->AND->equalTo('ni.node_class_id', $node_class_id);
            $select->where->AND->notEqualTo('nip.node_class_property_id', $folderParentId);
            $select->where->AND->notEqualTo('nip.node_class_property_id', $folderTimeStampId);
        }

        if ($filter_operator == 'equals') {
            $select->where->equalTo($filter_field, $search_text);
            //$select->where->equalTo($filter_field,$search_text);
        } else if ($filter_operator == 'not_equal') {
            $select->where->notEqualTo($filter_field, $search_text);
        } else if ($filter_operator == 'begins_with') {
            $select->where->like($filter_field, $search_text . '%');
        } else if ($filter_operator == 'ends_with') {

            $select->where->like($filter_field, '%' . $search_text);
        } else if ($filter_operator == 'contains') {
            $select->where->like($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'not_contains') {
            $select->where->notLike($filter_field, '%' . $search_text . '%');
        }

        if ($order_by == "sequence") {
            $select->order('ni.' . $order_by . ' ' . $order);
        } else {
            $select->order('nip.' . $order_by . ' ' . $order);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        foreach ($instanceArra as $key => $value) {
            $instanceArra[$key]['child'] = $this->fetchChildFolder($value['node_id'], $folderParentId);
        }
        return $instanceArra;
    }

    public function fetchnodeInstanceFolderDetails($node_class_id, $filter_operator, $filter_field, $search_text, $order_by, $order, $mode, $nodeId, $folder_parent_id, $common_property_id) {
        $nodeXId = $this->fetchnodeYId($nodeId);
        $node_x_id = explode(",", $nodeXId);
        $node_class_id = explode(",", $node_class_id);
        //$doc_title_id   =   explode(",",$doc_title_id);
        $common_property_id = explode(",", $common_property_id);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id', 'value', 'node_class_property_id'), 'inner');

        if ($node_x_id != "") {
            $select->where->IN('ni.node_id', array_unique($node_x_id));
            $select->where->AND->IN('ni.node_class_id', $node_class_id);
        } else {
            $select->where->AND->IN('ni.node_class_id', $node_class_id);
        }
        $select->where->AND->IN('nip.node_class_property_id', $common_property_id);

        if ($filter_operator == 'equals') {
            if ($search_text == 'p' && $filter_field == 'status') {
                $search_text = 1;
                $select->where->equalTo($filter_field, $search_text);
            } else if ($search_text == 'd' && $filter_field == 'status') {
                $search_text = 0;
                $select->where->equalTo($filter_field, $search_text);
            } else {
                $select->where->equalTo($filter_field, $search_text);
            }
            //$select->where->equalTo($filter_field,$search_text);
        } else if ($filter_operator == 'not_equal') {
            if ($search_text == 2 && $filter_field == 'status') {

                $select->where->notEqualTo($filter_field, $search_text);
            } else {

                $select->where->notEqualTo($filter_field, $search_text);
            }
        } else if ($filter_operator == 'begins_with') {

            $select->where->like($filter_field, $search_text . '%');
        } else if ($filter_operator == 'ends_with') {

            $select->where->like($filter_field, '%' . $search_text);
        } else if ($filter_operator == 'contains') {
            $select->where->like($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'not_contains') {
            $select->where->notLike($filter_field, '%' . $search_text . '%');
        }

        $select->order('nip.' . $order_by . ' ' . $order);

        //echo $select->getSqlstring();

        $select->order('nip.' . $order_by . ' ' . $order)->order('nip.node_instance_id DESC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra;
    }

    public function getTimeStampOfDocument($node_instance_id, $nodeClassPropertyId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value'));
        $select->where->equalTo('node_class_property_id', $nodeClassPropertyId);
        $select->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra[0]['value'];
    }

    public function getTypeOfDocument($node_instance_id, $nodeClassPropertyId) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value'));
        $select->where->equalTo('node_class_property_id', $nodeClassPropertyId);
        $select->where->AND->equalTo('node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra[0]['value'];
    }

    public function getCourseDetails($node_instance_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value', 'node_class_property_id'));
        $select->where->equalTo('node_instance_id', $node_instance_id);
        $select->order('node_class_property_id ASC');
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $courseArray = $resultObj->initialize($result)->toArray();
        return $courseArray;
    }

    /**
     * Created by Awdhesh Soni
     * Instance Property Values for Instance
     * @param $node_instance_id
     * @return array|\Zend\Db\Adapter\Driver\ResultInterface
     */
    public function fetchNodeInstancePropertyFolder($folder_title_id, $node_instance_id, $propertyId) {
        $node_instance_id = explode(",", $node_instance_id);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id', 'value'), 'inner');
        $select->where->IN('ni.node_instance_id', array_unique($node_instance_id));
        $select->where->AND->equalTo('nip.node_class_property_id', $folder_title_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();

        foreach ($instanceArra as $key => $value) {
            $instanceArra[$key]['child'] = $this->fetchChildFolder($value['node_id'], $propertyId);
        }

        return $instanceArra;
    }

    public function fetchChildFolder($folder_parent_id, $folder_node_property_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value'));
        $select->where->equalTo('node_class_property_id', $folder_node_property_id);
        $select->where->AND->equalTo('value', $folder_parent_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra;
    }

    public function fetchnodeInstanceId($nodeId) {

        $node_id = explode(",", $nodeId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('node_instance_id'));
        $select->where->IN('node_id', array_unique($node_id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $impldeIClassId = array();
        foreach ($dataArray as $key => $value) {
            $impldeIClassId[] = $value['node_instance_id'];
        }
        return (implode(",", array_unique($impldeIClassId)));
    }

    /* function here to delete folder and document instance */

    public function deleteFolderDocumentInstance($delete_ids, $parentFolderId) {

        foreach ($delete_ids as $key => $node_id) {
            if (trim($node_id) != '') {
                $node_instance_id = $this->fetchnodeInstanceId($node_id);

                $nodeArray = array();
                $nodeArray[] = $node_id;
                $sql = new Sql($this->adapter);
                $select = $sql->select();
                $select->from('node-instance-property');
                //$select->columns(array('node_instance_property_id','node_id'));
                $select->where->equalTo('node_instance_id', $node_instance_id);
                //$select->getSqlstring();
                $statement = $sql->prepareStatementForSqlObject($select);
                $result = $statement->execute();
                $resultObj = new ResultSet();
                $dataArray = $resultObj->initialize($result)->toArray();
                $returnArray = array();

                foreach ($dataArray as $key => $value) {

                    if ($dataArray[2]['value'] == "doc" || $dataArray[2]['value'] == "docx") {
                        $fileName = $dataArray[0]['value'] . '.' . $dataArray[2]['value'];
                        unlink(ABSO_URL . "public/folderFile/" . $fileName);
                    }
                    $returnArray['node_instance_property_id'][] = $value['node_instance_property_id'];
                    $nodeArray[] = $value['node_id'];
                }

                /* ------------------------------------------------------------------------------------------------------------------- */

                if (count($returnArray['node_instance_property_id']) > 0) {
                    $this->commonDeleteMethod('node-instance-property', 'node_instance_property_id', $returnArray['node_instance_property_id'], 'in');
                }
                $this->commonDeleteMethod('node-instance', 'node_instance_id', $node_instance_id, 'equalto');
                $this->commonDeleteMethod('node-x-y-relation', 'node_y_id', $nodeArray, 'in');
                $this->commonDeleteMethod('node', 'node_id', $nodeArray, 'in');
            }
            $this->commonDeleteFolderDocumentMethod('node-x-y-relation', 'node_x_id', $delete_ids, 'node_y_id', $parentFolderId, 'in');
        }
    }

    public function createFolderInstance($instance_caption, $node_class_id, $node_type_id, $saveType, $node_instance_id) {
        $sequence = $this->getFolderSequence();
        $data['sequence'] = $sequence;
        $data['caption'] = $this->mc_encrypt($instance_caption, ENCRYPTION_KEY);
        $data['encrypt_status'] = ENCRYPTION_STATUS;
        $data['node_type_id'] = $node_type_id;
        if ($saveType == 'D')
            $data['status'] = 0;
        else
            $data['status'] = 1;
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

        if (empty($node_instance_id))
            $node_instance_id = $this->adapter->getDriver()->getLastGeneratedValue();

        return $node_instance_id;
    }

    public function getFolderSequence($childClassId, $version) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->columns(array('sequence' => new Expression("(select MAX(sequence) from `node-instance` where node_instance_id!='' limit 1)")));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return intval($dataArray[0]['sequence']) + 1;
    }

    public function updateFolderSequence($nodeId, $sequence) {
        $data['sequence'] = $sequence;
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance');
        $query->set($data);
        $query->where(array('node_id' => $nodeId));
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
    }

    /* created by divya */

    public function getSubClassTableChildDataBy($primary_node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-sub-class');
        $select->columns(array('child_node_id'));
        $select->where->equalTo('primary_node_id', $primary_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getDocType($child_node_id, $common_type_id) {

        $common_type_id = explode(",", $common_type_id);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance-property');
        $select->columns(array('value'));
        $select->where->IN('node_class_property_id', $common_type_id);
        $select->where->AND->equalTo('node_instance_id', $child_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function updateInstancePropertyValue($node_instance_id, $node_class_property_id, $data) {
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance-property');
        $query->set(array('value' => $data));
        $query->where(array('node_instance_id' => $node_instance_id, 'node_class_property_id' => $node_class_property_id));
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
    }

    /**
     * Created by Awdhesh Soni
     * course Class Instance Property Values for Instance
     * @param $node_instance_id
     * @return array|\Zend\Db\Adapter\Driver\ResultInterface
     */
    public function fetchNodeInstanceCourse($course_class_id, $course_title_id, $order_by, $order, $filter_operator, $search_text, $filter_field, $production_title, $course_timeStamp, $adminId) {

        $nodeInstanceId = $this->getinstancesCourseById($course_class_id);
        $nodeInstanceId = explode(",", $nodeInstanceId);

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id', 'value'), 'inner');

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('node_instance_id' => 'node_instance_id', 'status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('course_node_id' => 'node_y_id'));
        $select->where->equalTo('xy.node_x_id', $adminId);
        $select->where->AND->equalTo('ni.node_class_id', $course_class_id);
        //$select->where->AND->equalTo('ni.status',1);


        if ($filter_operator == 'equals') {
            if ($search_text == 'p' && $filter_field == 'status') {
                $search_text = 1;
                $select->where->equalTo('ni.status', $search_text);
            } else if ($search_text == 'd' && $filter_field == 'status') {
                $search_text = 0;
                $select->where->equalTo('ni.status', $search_text);
            } else {
                $select->where->equalTo($filter_field, $search_text);
            }
            //$select->where->equalTo($filter_field,$search_text);
        } else if ($filter_operator == 'not_equal') {
            if ($search_text == 2 && $filter_field == 'status') {

                $select->where->notEqualTo($filter_field, $search_text);
            } else {

                $select->where->notEqualTo($filter_field, $search_text);
            }
        } else if ($filter_operator == 'begins_with') {
            $select->where->like($filter_field, $search_text . '%');
        } else if ($filter_operator == 'ends_with') {

            $select->where->like($filter_field, '%' . $search_text);
        } else if ($filter_operator == 'contains') {
            $select->where->like($filter_field, '%' . $search_text . '%');
        } else if ($filter_operator == 'not_contains') {
            $select->where->notLike($filter_field, '%' . $search_text . '%');
        }

        //$select->where->NEST->equalTo('node_class_property_id', $course_title_id)->OR->equalTo('node_class_property_id', $course_timeStamp)->UNNEST;
        /* $select->where->IN('nip.node_instance_id',$nodeInstanceId);
          $select->where->AND->equalTo('ni.node_class_id',$course_class_id);
          $select->where->AND->notEqualTo('nip.value',$production_title); */
        $select->order('nip.' . $order_by . ' ' . $order);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra;
    }

    public function fetchAllCourse($course_class_id, $course_title_id, $production_title, $course_timeStamp) {

        $nodeInstanceId = $this->getinstancesCourseById($course_class_id);
        $nodeInstanceId = explode(",", $nodeInstanceId);
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('i_node_id' => 'node_id', 'value'), 'inner');
        $select->where->NEST->equalTo('node_class_property_id', $course_title_id)->OR->equalTo('node_class_property_id', $course_timeStamp)->UNNEST;
        $select->where->IN('nip.node_instance_id', $nodeInstanceId);
        $select->where->AND->equalTo('ni.node_class_id', $course_class_id);
        $select->where->AND->notEqualTo('nip.value', $production_title);
        $select->order('nip.node_instance_id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        return $instanceArra;
    }

    public function fetchNodeIdArrayByInstanceID($instance_id_array) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->IN('node_instance_id', $instance_id_array);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $impldeIClassId = array();
        foreach ($dataArray as $key => $value) {
            $impldeIClassId[] = $value['node_id'];
        }
        return (implode(",", array_unique($impldeIClassId)));
    }

    /* Created By Divya Rajput
      On Date: 13 April 2016 */

    public function checkIstance($node_y_id, $node_class_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_id', $node_y_id);
        $select->where->equalTo('node_class_id', $node_class_id);
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeArray = $resultObj->initialize($result)->toArray();
        return $nodeArray;
    }

    /*
     * Created By Divya Rajput
     * On Date: 13 April 2016
     * Purpose: To fetch Root Parent Id of Child
     */

    public function getMainParentFolderId($node_x_id) {
        $tempArr = array();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-x-y-relation');
        $select->columns(array('node_y_id'));
        $select->where->equalTo('node_x_id', $node_x_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        if (count($dataArray) > 0) {
            foreach ($dataArray as $key => $value) {

                $node_x_id_new = $value['node_y_id'];
                $node_y_id = $this->getMainParentFolderId($node_x_id_new);
            }
        } else {
            $node_y_id = $node_x_id;
        }
        return $node_y_id;
    }

    /* function here for fetch node class id bases of node id */

    public function getNodeInstanceClassId($node_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_id', $node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $nodeXYArr = $resultObj->initialize($result)->toArray();
        return $nodeXYArr[0];
    }

    /* function here for fetch caption and value of node instance property data */

    public function getThemeCssCaptionValue($classId, $nodeInstanceId) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption'));
        $select->where->equalTo('ni.node_class_id', $classId);
        $select->where->AND->equalTo('ni.node_instance_id', $nodeInstanceId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        $tempArray = array();
        foreach ($instanceArra as $key => $value) {
            $tempArray[$value['caption']] = $value['value'];
        }
        return $tempArray;
    }

    public function checkValidSelector($sidArray) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('node-instance');
        $select->where->IN('node_instance_id', $sidArray);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $invalidArray = array();
        $validArray = array();
        foreach ($dataArray as $key => $value) {
            if (intval($value['node_class_id']) != intval(SELECTOR_CLASS_ID)) {
                $invalidArray[] = $value['node_instance_id'];
            }

            if (intval($value['node_class_id']) == intval(SELECTOR_CLASS_ID)) {
                $validArray[] = $value['node_instance_id'];
            }
        }
        return array('valid' => $validArray, 'invalid' => $invalidArray);
    }

    /*
     * Check if valid FILE - css instance id
     * Created by Amit Malakar
     * Date 20-Jun-16
     * @param int $nid
     * @return bool
     */

    public function checkValidCssFileInstance($nid, $typeClassId) {
        //node_id -> node_instance_id (node-instance) [391933 - 75260]
        //node_instance_id -> node_class_property_id (node-instance-property) [75260 - 877]

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id=nip.node_instance_id', array(), 'left');
        $select->where->equalTo('ni.node_id', $nid);
        $select->where->AND->equalTo('nip.node_class_property_id', $typeClassId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArr = $resultObj->initialize($result)->toArray();
        $data = (isset($dataArr[0])) ? $dataArr[0]['value'] : '';
        return $data;
    }

    public function fecthSelectorAndDeclarations($sidArray, $selector) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_class_id', 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
        $select->where->IN('ni.node_instance_id', $sidArray);
        $select->where->AND->equalTo('ni.node_class_id', SELECTOR_CLASS_ID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $selectorArray = $resultObj->initialize($result)->toArray();

        $ruleset_ids_array = array();
        $rSidArray = array();
        $newSelectArray = array();
        foreach ($selectorArray as $key => $value) {
            $nid = $value['node_instance_id'];
            $ruleset_ids_array[] = $value['node_id'];

            if (in_array($nid, $selector))
                $rSidArray[$nid] = $value['value'];

            $newSelectArray[$value['node_id']]['node_instance_id'] = $value['node_instance_id'];
            $newSelectArray[$value['node_id']]['value'] = $value['value'];
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('node_y_id', 'selector_id' => 'node_x_id'));
        $select->join(array('nxyrt' => 'node-x-y-relation'), 'nxyrt.node_y_id = nxyr.node_y_id', array('node_x_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxyrt.node_x_id', array('node_class_id', 'node_instance_id'));
        $select->where->IN('nxyr.node_x_id', $ruleset_ids_array);
        $select->where->equalTo('ni.node_class_id', DECLARATION_CLASS_ID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $decArray = array();
        $mainArray = array();
        foreach ($dataArray as $key => $value) {
            $decArray[] = $value['node_instance_id'];
            $mainArray[$value['node_y_id']][$newSelectArray[$value['selector_id']]['node_instance_id']]['name'] = $newSelectArray[$value['selector_id']]['value'];
            $mainArray[$value['node_y_id']][$newSelectArray[$value['selector_id']]['node_instance_id']]['declaration'][] = $value['node_x_id'];
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_class_id', 'node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
        $select->where->IN('ni.node_instance_id', $decArray);
        $select->where->AND->equalTo('ni.node_class_id', DECLARATION_CLASS_ID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $decrArray = $resultObj->initialize($result)->toArray();

        $nDecrArray = array();
        foreach ($decrArray as $key1 => $value1) {
            $nDecrArray[$value1['node_id']][] = $value1;
        }

        $declarationArray = array();
        foreach ($mainArray as $ruleset => $selector) {
            foreach ($selector as $key => $value) {
                foreach ($value['declaration'] as $k => $v) {
                    $value['declaration'][$k] = "'" . trim($nDecrArray[$v][0]['value']) . ":" . $nDecrArray[$v][1]['value'] . ";'";
                }

                $selector[$key] = $value;
            }
            $mainArray[$ruleset] = $selector;
        }

        return array('main' => $mainArray, 'sid' => $rSidArray);
    }

    /*
     * Created BY: Divya
     * This function is used to fetch Singular, Plural, Common Name from Taxonomy Class
     */

    public function getSPCommonName($node_class_id) {

        $class_node_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $nodeArray = $this->fetchDatafromNodeClass($class_node_id);

        /* Added this code to show subclasss name PLurals/Common Name */
        $ClassDataArray = $this->getTaxonomyData($nodeArray);  //to fetch plural, singular, common name

        $node_z_class_property = $this->getNodeProperty(NODEZ_CLASS_ID);

        $data_array = array();

        foreach ($ClassDataArray as $key => $value) {
            foreach ($node_z_class_property as $node_z_prop) {
                if ($value[$node_z_prop['node_class_property_id']]) {
                    $data_array[$key][$node_z_prop['caption']] = ($value[$node_z_prop['node_class_property_id']]) ? ($value[$node_z_prop['node_class_property_id']]) : '';
                }
            }
        }
        return $data_array;
    }

    /*
     * Created BY: Divya
     * This function return data array with current and next print number
     * @param:
     * 	$mode('Display', 'View', 'Add')
     * 	$is_type('class', 'instance/instancesubclass'
     * 	$instance_id
     * 	$dataArray(classArray, InstanceArray))
     */

    public function getNumberPrintStructure($mode, $is_type, $instance_id, $dataArray, $currentNumber, $check_array, $is_sub_instance = 'no') {
        if (trim($mode) == 'Display') {
            if (trim($is_type) == 'instance') {
                foreach ($dataArray as $key => $subClassArray) {
                    $node_class_id = $subClassArray['node_class_id'];
                    $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $instance_id);

                    $subClassInstance = $this->getInstaceIdByNodeXYAndNodeInstance($instance_node_id, $node_class_id);

                    if (count($subClassInstance) > 0) {
                        $tempSubClassInstanceArray = $this->D($mode, $subClassInstance, $node_class_id, $currentNumber);
                        //print_r($tempSubClassInstanceArray);

                        $full_array = array();
                        $finalArray = $this->E($tempSubClassInstanceArray, $full_array);
                        //print_r($finalArray);


                        $dataArray[$key]['currNum'] = $currentNumber;
                        $dataArray[$key]['nextNum'] = intval($currentNumber) + count($finalArray, COUNT_RECURSIVE) + 1;
                        $currentNumber = intval($currentNumber) + count($finalArray, COUNT_RECURSIVE) + 1;
                    } else {
                        $dataArray[$key]['currNum'] = $currentNumber;
                        $dataArray[$key]['nextNum'] = intval($currentNumber) + 1;
                        $currentNumber = intval($currentNumber) + 1;
                    }
                }
            } else {
                //class or instance subclass
            }
        } else {
            //Edit
            if (trim($is_type) == 'instance') {
                foreach ($dataArray as $key => $subClassArray) {
                    $node_class_id = $subClassArray['node_class_id'];
                    $instance_node_id = $this->getNodeId('node-instance', 'node_instance_id', $instance_id);

                    $subClassInstance = $this->getInstaceIdByNodeXYAndNodeInstance($instance_node_id, $node_class_id);

                    if (count($subClassInstance) > 0) {
                        if ($is_sub_instance != 'sub-instance') {
                            $check_array = array();
                        }

                        $tempSubClassInstanceArray = $this->D($mode, $subClassInstance, $node_class_id, $currentNumber, $check_array);

                        $full_array = array();
                        $finalArray = $this->E($tempSubClassInstanceArray, $full_array);
                        $dataArray[$key]['currNum'] = $currentNumber;
                        $dataArray[$key]['nextNum'] = intval($currentNumber) + count($finalArray, COUNT_RECURSIVE) + 1;
                        $currentNumber = intval($currentNumber) + count($finalArray, COUNT_RECURSIVE) + 1;
                    } else {
                        $blank_array = array();
                        $sub_class_array_data = array();
                        $blanksub_class_array_data = array();

                        if ($is_sub_instance != 'sub-instance') {
                            $check_array = array();
                        }

                        //echo ' - '.$node_class_id.' | '.$currentNumber;

                        if (!in_array($node_class_id, $check_array)) {
                            $check_array[] = $node_class_id;

                            $sub_class_array_data[] = $subClassArray['caption'];
                            $blanksub_class_array_data = $this->F($node_class_id, $blank_array, $check_array);
                            //print_r($blanksub_class_array_data);

                            $temp_full_array = array();
                            $temp_finalArray = $this->E($blanksub_class_array_data, $temp_full_array);

                            $sub_class_array_data = array_merge($sub_class_array_data, $temp_finalArray);
                            //print_r($sub_class_array_data);

                            $dataArray[$key]['currNum'] = $currentNumber;
                            $dataArray[$key]['nextNum'] = intval($currentNumber) + intval(count($sub_class_array_data));
                            $currentNumber = intval($currentNumber) + intval(count($sub_class_array_data));
                        } else {
                            $dataArray[$key]['currNum'] = $currentNumber;
                            $dataArray[$key]['nextNum'] = intval($currentNumber) + 1;
                            $currentNumber = intval($currentNumber) + 1;
                        }
                    }
                    //print_r($dataArray);
                }
            } else {
                //class or instance subclass
            }
        }
        //print_r($dataArray);
        return $dataArray;
    }

    public function F($node_class_id, $main_array, $check_array) {
        $no_instance_array = $this->getClassStructure($node_class_id);
        $GLOBALS['countP'] = 0;

        if (empty($no_instance_array[0]['property'])) {
            $main_array[] = $no_instance_array[0]['caption'];
        } else {
            $temp_array[] = $no_instance_array[0]['caption'];
            foreach ($no_instance_array[0]['property'] as $key => $no_instance) {
                $main_array[] = $no_instance['caption'];

                if (isset($no_instance['child']) && !empty($no_instance['child'])) {
                    $blanke_array = array();
                    foreach ($no_instance['child'] as $propK => $propV) {
                        $main_array[] = $propV['caption'];
                        $child_array = array();

                        if (!empty($propV['child'])) {
                            $blanke_array = $this->childLoop($propV['child'], 0, $child_array);
                            $main_array = array_merge($main_array, $blanke_array);
                        }
                        //print_r($main_array);

                        if (empty($propV['child'])) {
                            if (isset($propV['nodeClassYInstanceValue']) && !empty($propV['nodeClassYInstanceValue'])) {
                                if (strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'drop down' ||
                                    strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'input' ||
                                    strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'file' ||
                                    strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'text area' ||
                                    strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'calendar') {
                                    $main_array[] = $propV['nodeClassYInstanceValue'][0];
                                } else {
                                    $blank_array = $this->G($propV['nodeClassYInstanceValue']);
                                    $main_array = array_merge($main_array, $blank_array);
                                }
                            } else {
                                $main_array[] = '';
                            }
                        }
                    }
                }
            }

            $main_array = array_merge($temp_array, $main_array);

            $subClassArrayData = $this->getClassChild($node_class_id);

            if (!empty($subClassArrayData)) {
                foreach ($subClassArrayData['data'] as $classData) {
                    $temp = array();
                    $subclass_id = $classData['node_class_id'];

                    if (!in_array($subclass_id, $check_array)) {
                        $temp[] = $classData['caption'];
                        $temp = $this->F($subclass_id, $temp, $check_array);
                        $check_array[] = $subclass_id;
                        $main_array = array_merge($main_array, $temp);
                    } else {
                        $main_array = $classData['caption'];
                    }
                }
            }
        }
        //print_r($main_array);
        return $main_array;
    }

    public function childLoop($child_array, $no, $temp_child_array) {
        $temp_array = array();

        foreach ($child_array as $childdata) {
            $temp_child_array[] = $childdata['caption'];

            if (empty($childdata['child'])) {
                if (isset($childdata['nodeClassYInstanceValue']) && !empty($childdata['nodeClassYInstanceValue'])) {
                    if (strtolower($childdata['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'drop down' ||
                        strtolower($childdata['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'input' ||
                        strtolower($childdata['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'file' ||
                        strtolower($childdata['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'text area' ||
                        strtolower($childdata['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'calendar') {
                        $temp_child_array[] = $childdata['nodeClassYInstanceValue'][0];
                    } else {
                        $blank_array = $this->G($childdata['nodeClassYInstanceValue']);
                        $temp_child_array = array_merge($temp_child_array, $blank_array);
                    }
                } else {
                    $temp_child_array[] = '';
                }
            }

            if (!empty($childdata['child'])) {
                $temp_child_array[] = $this->childLoop($childdata['child'], $no, $temp_array);
            }
        }

        return $temp_child_array;
    }

    public function G($dataValue) {
        $temp_prop_array = array();
        foreach ($dataValue as $key => $value) {
            $temp_prop_array[] = $value;
        }
        return $temp_prop_array;
    }

    public function E($tempSubClassInstanceArray, $full_array) {
        foreach ($tempSubClassInstanceArray as $data) {
            if (is_array($data)) {
                $full_array = $this->E($data, $full_array);
            } else {
                $full_array[] = $data;
            }
        }
        return $full_array;
    }

    public function D($mode, $subClassInstance, $node_class_id, $currentNumber, $check_array = array()) {
        $mainarray = array();
        $instPropArray = array();
        //$check_array 						=	array();

        if (empty($subClassInstance)) {
            if (trim($mode) == 'Edit') {
                $temp_array = array();
                $check_array[] = $subclass_id;
                $classArray = $this->F($node_class_id, $temp_array, $check_array);
                $mainarray = array_merge($mainarray, $classArray);
            }
        } else {
            //print_r($subClassInstance);

            foreach ($subClassInstance as $subK => $subV) {
                $mainarray[] = $subV['node_x_id'];

                $instPropArray = $this->getInstancePropertyB($subV['node_x_id'], $node_class_id);
                $mainarray = array_merge($mainarray, $instPropArray);

                $instance_node_id = $subV['node_x_id'];
                $subClassArrayData = $this->getClassChild($node_class_id);

                foreach ($subClassArrayData['data'] as $classData) {
                    $subclass_id = $classData['node_class_id'];
                    $subClassInstanceD = $this->getInstaceIdByNodeXYAndNodeInstance($instance_node_id, $subclass_id);

                    $mainarray[] = $subclass_id;
                    $check_array = array();

                    if (empty($subClassInstanceD)) {
                        if (trim($mode) == 'Edit') {
                            $temp_array = array();
                            $check_array[] = $subclass_id;
                            $classArray = $this->F($subclass_id, $temp_array, $check_array);
                            $mainarray = array_merge($mainarray, $classArray);
                        }
                    }

                    if (!empty($subClassInstanceD)) {
                        $classarray = $this->D($mode, $subClassInstanceD, $subclass_id, $currentNumber);
                        $mainarray = array_merge($mainarray, $classarray);
                    }
                }
            }
        }
        return $mainarray;
    }

    public function getInstancePropertyB($node_instance_id, $node_class_id) {
        $NI = 0;
        $tempInstanceArray = array();
        $ins_node_id = $this->getInstanceId('node-instance', 'node_id', $node_instance_id);
        $propArray = $this->getInstanceStructure($ins_node_id, $node_class_id);

        $childBArray = array();
        $cp = 0;

        foreach ($propArray['instances']['property'] as $property) {
            $tempInstanceArray[$NI] = $property['caption'];
            $NI++;

            if (!empty($property['child'])) {
                $cp++;
                $childBArray = $this->getChildB($property['child'], $cp);
            }
        }

        $tempInstanceArray = array_merge($tempInstanceArray, $childBArray);
        return $tempInstanceArray;
    }

    public function getChildB($propertychild, $cp) {
        $childArray = array();

        foreach ($propertychild as $child) {
            $childArray[$cp] = $child['caption'];
            $cp++;

            if (empty($child['child'])) {
                if (isset($child['value'])) {
                    if (substr($child['value'], -3) == CHECKBOX_SEPERATOR) {
                        $currentString = substr($child['value'], 0, -3);
                        $newValArray = explode(CHECKBOX_SEPERATOR, $currentString);
                        foreach ($newValArray as $value) {
                            $childArray[$cp] = $value;
                            $cp++;
                        }
                    } else {
                        $childArray[$cp] = $child['value'];
                        $cp++;
                    }
                } else {
                    $childArray[$cp] = '';
                    $cp++;
                }
            }

            if (!empty($child['child'])) {
                $childArray[$child['node_class_property_id']] = $this->getChildB($child['child'], $cp);
            }
        }

        return $childArray;
    }

    public function getSubClassPropertyB($node_class_id) {
        $class_node_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id);
        $subclass = $this->fetchDatafromNodeClass($class_node_id);
        $NP = 0;
        $tempArray = array();
        foreach ($subclass as $class) {
            $tempArray[$NP] = $class['caption'];
            $NP++;
        }
        return $tempArray;
    }

    public function getCurrentInstanceCurrentNumber($mode, $is_type, $instanceArrayProperty) {
        if (trim($mode) == 'Display') {
            if (trim($is_type) == 'instance') {
                $count = 0;
                $GLOBALS['countP'] = 1;
                $instanceCount = 0;

                foreach ($instanceArrayProperty as $key => $propV) {
                    if (empty($propV['child'])) {
                        $GLOBALS['countP'] ++;
                    }

                    if (!empty($propV['child'])) {
                        $this->getCurrentInstanceChildCurrentNumber($mode, $propV['child']);
                    }
                }

                $number_print = intval($count) + intval($GLOBALS['countP']);
            }
        } else {
            //Edit / Add

            if (trim($is_type) == 'instance') {
                $count = 0;
                $GLOBALS['countP'] = 1;
                $instanceCount = 0;

                //print_r($instanceArrayProperty);
                foreach ($instanceArrayProperty as $key => $propV) {
                    if (empty($propV['child'])) {
                        if (!empty($propV['nodeClassYInstanceValue'])) {
                            if (strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'drop down' ||
                                strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'input' ||
                                strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'file' ||
                                strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'text area' ||
                                strtolower($propV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'calendar') {
                                $GLOBALS['countP'] ++;
                            } else {
                                $GLOBALS['countP'] = intval($GLOBALS['countP']) + intval(count($propV['nodeClassYInstanceValue']));
                            }
                        } else {
                            $GLOBALS['countP'] ++;
                        }
                    }

                    if (!empty($propV['child'])) {
                        $this->getCurrentInstanceChildCurrentNumber($mode, $propV['child']);
                    }
                }

                $number_print = intval($count) + intval($GLOBALS['countP']);
            }
        }

        return $number_print;
    }

    public function getCurrentInstanceChildCurrentNumber($mode, $childArray) {

        if (trim($mode) == 'Display') {
            foreach ($childArray as $childK => $childV) {
                $GLOBALS['countP'] ++;

                if (empty($childV['child'])) {
                    if (trim($childV['caption']) != "") {
                        if (isset($childV['value'])) {
                            if (substr($childV['value'], -3) == CHECKBOX_SEPERATOR) {
                                $currentString = substr($childV['value'], 0, -3);
                                $newValArray = explode(CHECKBOX_SEPERATOR, $currentString);
                                $GLOBALS['countP'] = count($newValArray) + intval($GLOBALS['countP']);
                            } else {
                                $GLOBALS['countP'] ++;
                            }
                        } else {
                            $GLOBALS['countP'] ++;
                        }
                    }
                }

                if (!empty($childV['child'])) {
                    $this->getCurrentInstanceChildCurrentNumber($mode, $childV['child']);
                }
            }
        } else {
            foreach ($childArray as $childK => $childV) {
                $GLOBALS['countP'] ++;

                if (empty($childV['child'])) {
                    if (trim($childV['caption']) != "") {
                        if (!empty($childV['nodeClassYInstanceValue'])) {
                            if (strtolower($childV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'drop down' ||
                                strtolower($childV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'input' ||
                                strtolower($childV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'file' ||
                                strtolower($childV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'text area' ||
                                strtolower($childV['nodeZStructure']['FORM SELECTOR'][0]['value']) == 'calendar') {
                                $GLOBALS['countP'] ++;
                            } else {
                                $GLOBALS['countP'] = intval($GLOBALS['countP']) + intval(count($childV['nodeClassYInstanceValue']));
                            }
                        } else {
                            $GLOBALS['countP'] ++;
                        }
                    }
                }

                if (!empty($childV['child'])) {
                    $this->getCurrentInstanceChildCurrentNumber($mode, $childV['child']);
                }
            }
        }

        return $GLOBALS['countP'];
    }

    public function C($mode, $subchild) {
        $count = 0;
        foreach ($subchild as $child) {
            $count++;
        }
        return $count;
    }

    public function getSubClassInstanceStructure($node_instance_id, $node_class_id) {
        $instancesArray = array();

        $propArray = $this->getSubClassInstanceStructureAgain($node_class_id, $node_instance_id);
        $instancesArray['instances'] = $propArray[0];

        return $instancesArray;
    }

    public function getSubClassInstanceStructureAgain($node_class_id, $node_instance_id) {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();


        foreach ($instanceAttributeArray as $key => $valueArray) {

            if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                $tempMainArray['node_class_id'] = $node_class_id;
                $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                $mainArray[] = $tempMainArray;
            }
        }

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');

            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();

            $mainArray[$key]['property'] = $this->fetchInstanceProperty($mainPropArray, $subPropArray, $realPropArray, $node_instance_id);
        }
        return $mainArray;
    }

    public function fetchInstanceProperty($menu1, $menu2, $menuArray, $node_instance_id) {
        foreach ($menu1 as $key => $value) {
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);
            $value['nodeY'] = $this->fetchNodeClassY($value['node_id']);
            $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeY']);
            $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);
            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";
            $nodeX = "";
            $nodeY = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                } else if ($nodeVal['node_type_id'] == 1) {
                    $nodeX.= $nodeVal['node_x_id'] . ',';
                } else {
                    $nodeY.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;

            /* function call here to fetch node instance id bases of node id and pass node instance id to node instance table */


            /* $new_node_id           					=   $dataArray[0]['node_id'];
              $parentFolder 								=   $this->getParentFolder($new_node_id);
              $instancesArray['parentFolder'] 			=   $parentFolder; */

            $value['nodeZStructure'] = $this->getNodeInstaceId($value['nodeZ'], $value['nodeClassId']);


            $menuArray[$value['node_class_property_id']] = $value;


            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('*'));
            $select->where->equalTo('nip.node_instance_id', $node_instance_id);
            $select->where->AND->equalTo('nip.node_class_property_id', $value['node_class_property_id']);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            if (is_array($dataArray[0]) && count($dataArray) > 0) {
                if (count($dataArray) > 1) {
                    $textN = "";
                    foreach ($dataArray as $k1 => $v1) {
                        $textN = $textN . $v1['value'] . CHECKBOX_SEPERATOR;
                    }
                    $menuArray[$value['node_class_property_id']]['node_instance_property_id'] = $dataArray[0]['node_instance_property_id'];
                    $menuArray[$value['node_class_property_id']]['value'] = $textN;
                } else {
                    $menuArray[$value['node_class_property_id']]['node_instance_property_id'] = $dataArray[0]['node_instance_property_id'];
                    $menuArray[$value['node_class_property_id']]['value'] = $dataArray[0]['value'];
                }
            }

            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->fetchInstanceProperty($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id);
            }
        }


        return $menuArray;
    }

    public function fetchNodeInstancePropertyData($node_instance_id, $node_class_property_id) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('*'));
        $select->where->equalTo('nip.node_instance_id', $node_instance_id);
        $select->where->AND->equalTo('nip.node_class_property_id', $node_class_property_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getClassIdByNode($nodeId = array()) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('node_class_id'));
        $select->from('node-class');
        $select->where->IN('node_id', $nodeId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray;
    }

    public function getInstanceListOfParticulerClass($primaryId, $searchOn, $keyType = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_id','node_class_id'));
        $select->join(array('nip' => 'node-instance-property'), 'ni.node_instance_id = nip.node_instance_id', array('node_class_property_id', 'value'), '');
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'), '');

        if ($searchOn == 'class')
            $select->where->equalTo('ni.node_class_id', $primaryId);
        else if ($searchOn == 'node')
            $select->where->equalTo('ni.node_id', $primaryId);
        else if ($searchOn == 'instance')
            $select->where->equalTo('ni.node_instance_id', $primaryId);

        //return $select->getSqlstring();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArray = $resultObj->initialize($result)->toArray();

        $dataArray = array();
        $node_class_id = '';
        foreach ($tempArray as $key => $value) {
            $node_class_id = $value['node_class_id'];
            if ($keyType == 'node_instance_id') {
                if (trim($dataArray[$value['node_instance_id']][$value['caption']]) == '')
                    $dataArray[$value['node_instance_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_instance_id']][$value['caption']] = $dataArray[$value['node_instance_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            } else if ($keyType == 'node_id') {
                if (trim($dataArray[$value['node_id']][$value['caption']]) == '')
                    $dataArray[$value['node_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_id']][$value['caption']] = $dataArray[$value['node_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            }
            else if ($keyType == 'node_id_subclass') {
                if (trim($dataArray[$value['node_id']][$value['caption']]) == '')
                    $dataArray[$value['node_id']][$value['caption']] = html_entity_decode($value['value']);
                else {
                    $dataArray[$value['node_id']][$value['caption']] = $dataArray[$value['node_id']][$value['caption']] . CHECKBOX_SEPERATOR . html_entity_decode($value['value']);
                }
            }

        }

        if (count($dataArray))
        {
            if($keyType == 'node_id_subclass')
            {
                $node_id = $this->getNodeId('node-class', 'node_class_id', $node_class_id, "node_id");
                return array('class_id' => $node_id,'data' => $dataArray);
            }
            else
            {
                return $dataArray;
            }
        }
        else
            return $tempArray;
    }

    public function getAllClassPropertyStructure($node_class_id) {
        $propArray = $this->getProperties($node_class_id, 'N');
        $mainPropArray = array();
        $subPropArray = array();
        $allPropArray = array();
        foreach ($propArray as $propk => $propv) {

            $allPropArray[$propv['node_class_property_id']] = $propv['caption'];
            if (intval($propv['node_class_property_parent_id']) == 0)
                $mainPropArray[] = $propv;
            else
                $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
        }

        $realPropArray = array();


        $mainArray = $this->getAllPropertyStructure($mainPropArray, $subPropArray, $realPropArray, $allPropArray);

        $newArray = array();
        $propertyArray = $this->getLeafPropertyStructure($mainArray, $newArray);

        return $propertyArray;
    }

    public function getLeafPropertyStructure($mainArray, $newArray) {

        foreach ($mainArray as $key => $value) {

            if (is_array($value['child'])) {
                $newArray = $this->getLeafPropertyStructure($value['child'], $newArray);
            } else {
                $newArray[$key] = str_replace("> Properties > ", "", $value['caption']);
            }
        }
        return $newArray;
    }

    public function getAllPropertyStructure($menu1, $menu2, $menuArray, $allPropArray) {
        foreach ($menu1 as $key => $value) {

            $menuArray[$value['node_class_property_id']]['caption'] = $allPropArray[$value['node_class_property_parent_id']] . " > " . $value['caption'];

            $allPropArray[$value['node_class_property_id']] = $allPropArray[$value['node_class_property_parent_id']] . " > " . $value['caption'];
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$value['node_class_property_id']]['child'] = $this->getAllPropertyStructure($menu2[$value['node_class_property_id']], $menu2, $childArray, $allPropArray);
            }
        }
        return $menuArray;
    }

    public function commonUpdateMethod($instanceNodeId, $propertyId, $propertValue) {

        $node_instance_id = $this->getNodeId('node-instance', 'node_id', $instanceNodeId, 'node_instance_id');
        $data = array();
        $data['value'] = trim($propertValue);
        $sql = new Sql($this->adapter);
        $query = $sql->update();
        $query->table('node-instance-property');
        $query->set($data);
        $query->where(array('node_class_property_id' => $propertyId, 'node_instance_id' => $node_instance_id));
        //echo $query->getSqlstring();
        $statement = $sql->prepareStatementForSqlObject($query);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resultObj->initialize($result);
    }

    public function getTableCols($colsArr, $table_name, $whereCols, $value) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('tbl' => $table_name));
        $select->columns($colsArr);
        $select->where->equalTo('tbl.' . $whereCols, $value);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        return $dataArray[0];
    }

    public function getViewInstanceIds($_nodeId = '') {
        //error_reporting(E_ALL);
        $_sql = "SELECT `nip`.`node_instance_id`,`ni`.`node_id` FROM `node-class` `nc` JOIN `node-class-property` `ncp` ON `ncp`.`node_class_id` = `nc`.`node_class_id` JOIN `node-instance-property` `nip` ON `nip`.`value` = $_nodeId AND `nip`.`node_class_property_id` = 2950 JOIN `node-instance` `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id` WHERE `nc`.`node_class_id` = 638 GROUP BY `nip`.`node_instance_property_id`";
        $statement = $this->adapter->query($_sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $propertyAry = $resultObj->initialize($result)->toArray();
    }

    public function getPropertyValue($_instanceId, $_classProperty) {
        //error_reporting(E_ALL);
        $_nodeId = $this->getNodeId('node-class', 'node_class_id', $classId, 'node_id');
        $_sql = "SELECT value FROM `node-instance-property` WHERE node_instance_id = $_instanceId AND node_class_property_id = $_classProperty";
        $statement = $this->adapter->query($_sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $propertyAry = $resultObj->initialize($result)->toArray();
    }

    public function getClassStructureCanvas($node_class_id, $node_instance_id, $fetchType = "") {
        $sql = new Sql($this->adapter);
        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();

        if ($fetchType == "") {
            foreach ($instanceAttributeArray as $key => $valueArray) {

                if (intval($valueArray['parent_attribute_id']) == '0') { //parent
                    $tempMainArray['instance_attribute_id'] = $valueArray['instance_attribute_id'];
                    $tempMainArray['node_class_id'] = $node_class_id;
                    $tempMainArray['caption'] = $tempMainArray['value'] = $valueArray['instance_attribute'];
                    $mainArray[] = $tempMainArray;
                }
            }
            //($mainArray);
            foreach ($mainArray as $key => $value) {
                $propArray = $this->getProperties($value['node_class_id'], 'N');

                $mainPropArray = array();
                $subPropArray = array();
                foreach ($propArray as $propk => $propv) {
                    if (intval($propv['node_class_property_parent_id']) == 0)
                        $mainPropArray[] = $propv;
                    else
                        $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
                }

                $realPropArray = array();

                //print_r($mainPropArray);
                $mainArray[$key]['property'] = $this->getAllPropertyAgainCanvas($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $fetchType);
            }
        }
        else {
            $tempMainArray['node_class_id'] = $node_class_id;
            $mainArray[] = $tempMainArray;
            foreach ($mainArray as $key => $value) {
                $propArray = $this->getProperties($value['node_class_id'], 'N');
                $mainPropArray = array();
                $subPropArray = array();
                foreach ($propArray as $propk => $propv) {
                    if (intval($propv['node_class_property_parent_id']) == 0)
                        $mainPropArray[] = $propv;
                    else
                        $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
                }

                $realPropArray = array();

                $mainArray[$key] = $this->getAllPropertyAgainCanvas($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $fetchType);
            }
        }


        return $mainArray;
    }

    public function getAllPropertyAgainCanvas($menu1, $menu2, $menuArray, $node_instance_id, $fetchType = "") {

        foreach ($menu1 as $key => $value) {
            if ($fetchType == "" && $value['caption'] != "Properties") {
                $value1['nodeXY'] = $this->fetchNodeXY($value['node_id']);
                $value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
                $value['nodeClassId'] = $this->fetchNodeClassId($value1['nodeXY']);
                $value1['nodeY'] = $this->fetchNodeClassY($value['node_id']);
                $value1['nodeYClassValue'] = $this->nodeYClassValue($value1['nodeY']);
                $value1['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
                $value1['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value1['nodeClassYId'], $value1['nodeY']);
                $commArr = $this->commonFetchNodeYX($value['node_id']);
                $nodeZ = "";
                $nodeX = "";
                $nodeY = "";

                foreach ($commArr as $nodeVal) {
                    if ($nodeVal['node_type_id'] == 3) {
                        $nodeZ.= $nodeVal['node_x_id'] . ',';
                    } else if ($nodeVal['node_type_id'] == 1) {
                        $nodeX.= $nodeVal['node_x_id'] . ',';
                    } else {
                        $nodeY.= $nodeVal['node_x_id'] . ',';
                    }
                }
                $value1['nodeZ'] = $nodeZ;
                $value['nodeZStructure'] = $this->getNodeInstaceIdCanvas($value1['nodeZ'], $value['nodeClassId']);
            }



            $fecthStyle = "";
            $isChild = "";
            if ($fetchType == "") {
                $fecthStyle = 'node_class_property_id';
                $isChild = 'child';
            } else {
                $fecthStyle = 'caption';
                $isChild = '';
            }

            $menuArray[$value[$fecthStyle] . '_key'] = $value;

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
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                if ($isChild == 'child')
                    $menuArray[$value[$fecthStyle] . '_key']['child'] = $this->getAllPropertyAgainCanvas($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $fetchType);
                else
                    $menuArray[$value[$fecthStyle] . '_key'] = $this->getAllPropertyAgainCanvas($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $fetchType);
            }
        }


        return $menuArray;
    }

    public function getNodeInstaceIdCanvas($node_id, $nodeClassId) {

        $classId = explode(",", $nodeClassId);
        $nodeId = explode(",", $node_id);
        $nodeId = array_filter(array_values($nodeId));
        $tempArra = array();
        $tempCaption = array();
        $tempArrData = array();
        $nodeProps = array();
        foreach ($classId as $key => $value) {
            $tempCaption[] = $this->fetchnodeClassCaption1($value);
        }
        if (count($nodeId) > 1) {
            $nodeProps = $this->fetchnodeInstancePropertiesCanvas($nodeId); // combine the function passing the array.
            foreach ($nodeId as $key => $value) {
                $tempArrData = array();
                $tempArrData[0] = $nodeProps[$value];

                foreach ($tempCaption as $key1 => $value1) {
                    if ($tempArrData[0]['node_class_id'] == $value1[0]['node_class_id'] && $value1[0]['caption'] == "DATA SOURCE") {
                        $tempArra = $tempArrData;
                    }
                }
            }
        }
        return $tempArra[0];
    }

    public function fetchnodeInstancePropertiesCanvas($node_ids) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value', 'node_instance_property_encrypt' => 'encrypt_status', 'node_class_property_id'), '');
        $select->where->equalTo('nip.node_class_property_id', DATA_SOURCE_PROPERTY_ID);
        //$select->where->AND->notEqualTo('value',"");
        if (count($node_ids) > 0)
            $select->where(array('ni.node_id' => $node_ids));


        $statement = $sql->prepareStatementForSqlObject($select);


        $result = $statement->execute();
        $resultObj = new ResultSet();
        $temp = array();
        $temp = $resultObj->initialize($result)->toArray();

        foreach ($temp as $key => $value) {
            /* if (intval($value['node_class_encrypt']) == 1)
              $temp[$key]['node_class_caption'] = $this->mc_decrypt($value['node_class_caption'], ENCRYPTION_KEY);
              if (intval($value['node_instance_encrypt']) == 1)
              $temp[$key]['node_instance_caption'] = $this->mc_decrypt($value['node_instance_caption'], ENCRYPTION_KEY); */
            if (intval($value['node_instance_property_encrypt']) == 1)
                $temp[$key]['value'] = $this->mc_decrypt($value['value'], ENCRYPTION_KEY);

            /* if (intval($value['node_class_property_encrypt']) == 1)
              $temp[$key]['caption'] = $this->mc_decrypt($value['caption'], ENCRYPTION_KEY); */
        }
        foreach ($node_ids as $nodeKey => $nodeVal) {
            $nodeArr[$nodeVal] = $temp[$nodeKey];
        }
        return $nodeArr;
    }

    /** By Gaurav Dutt Panchal * */
    /**
     * To get Instance value
     * @param type $node_instance_id
     * @param type $classId
     * @param type $classPropertyArr
     * @param type $str
     * @return type
     * Added comment:- 1/6/2017
     */
    public function getInstanceValueByWebService($node_instance_id, $classId, $classPropertyArr, $str) {

        $tempArray = array();

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ncp' => 'node-class-property'));
        $select->join(array('ncp2' => 'node-class-property'), 'ncp2.node_class_property_id = ncp.node_class_property_parent_id', array('parent_node_id'=>'node_id'), '');
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_class_property_id = ncp.node_class_property_id', array('data'=>'value', 'node_instance_id'=>'node_instance_id'), 'left');
        $select->where->equalTo('ncp.node_class_id', $classId);
        $select->where->equalTo('nip.node_instance_id', $node_instance_id);
        //return  $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $tempArray = array();
        foreach ($dataArray as $data) {
            $tempArray['node_instance_id'] = $node_instance_id;
            $classPropertyArr[$data['node_id']]['data']              = $data['data'];
        }
        if($str == '1'){
            $tempArray = array_values($classPropertyArr);

        }else{
            $tempArray['structure'] = array_values($classPropertyArr);

        }

        return $tempArray;
    }

    /**
     * Get Property of class
     * @param type $classId
     * @return type
     */
    public function getPropertyOfClass($classId) {

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array('caption','node_id'));
        $select->from(array('ncp' => 'node-class-property'));
        $select->join(array('ncp2' => 'node-class-property'), 'ncp2.node_class_property_id = ncp.node_class_property_parent_id', array('parent_node_id'=>'node_id'), '');
        $select->where(array('ncp.node_class_id' => $classId));
        //echo $select->getSqlString();die();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();
        $tempArray = array();
        foreach ($dataArray as $data) {

            $tempArray[$data['node_id']]['value']    = $data['caption'];
            $tempArray[$data['node_id']]['data']     = '';
            $tempArray[$data['node_id']]['nodeID']   = $data['node_id'];
            $tempArray[$data['node_id']]['parentID'] = $data['parent_node_id'];

        }

        return $tempArray;

    }



    /* ******Added by GAURAV DUTT PANCHAL**********START*********************** FOR WEB SERVICES ***********************************************/
    /**
     * function to get class structure data
     * @param type class_id
     * @return array
     * Added comment:- 1/6/2017
     */
    public function getWebServiceClassStructureData($class_id) {
        $tempMainArray = array();
        $mainArray = array();
        $tempMainArray['instance_attribute_id'] = 2;
        $tempMainArray['node_class_id'] = $class_id;
        $tempMainArray['caption'] = $tempMainArray['value'] = 'Properties';
        $mainArray[0] = $tempMainArray;

        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();


            $mainArray[$key]['property'] = $this->getWebServicesAllProperty($mainPropArray, $subPropArray, $realPropArray);
        }

        return $mainArray;
    }

    /**
     * To Get Class structure of class
     * @param type array
     * @return array
     * Added comment:- 1/6/2017
     * Added by Gaurav
     */
    public function getWebServicesClassStructure($class_id) {
        $classArray                 = $this->getClassList($class_id);
        $data                       = $this->getClassChild($class_id);
        $classArray['childs']       = $data['ids'];
        $classArray['childsArray']  = $data['data'];
        //$nodeType                   = $classObj->getNodeType($classArray['node_type_id']);
        $classArray['instances']    = $this->getWebServiceClassStructureData($class_id);
        //$classArray['childsArray']  = $this->getWebServiceClassStructureData($classArray['childsArray']);
        return $classArray;
    }

    /**
     * Function to get all class property
     * @param type $menu1
     * @param type $menu2
     * @param type $menuArray
     * @return array
     * Added by:- Gaurav
     */
    public function getWebServicesAllProperty($menu1, $menu2, $menuArray) {
        foreach ($menu1 as $key => $value) {
            /* code here for fetch node x y value */
            $value['nodeXY'] = $this->fetchNodeXY($value['node_id']);
            //$value['nodeZ'] = $this->fetchNodeYZ($value['node_id']);
            //$value['nodeX'] = $this->fetchNodeYX($value['node_id']); // actual function
            $value['nodeYClass'] = $this->fetchNodeClassY($value['node_id']);

            $commArr = $this->commonFetchNodeYX($value['node_id']);
            $nodeZ = "";
            $nodeX = "";
            $nodeY = "";

            foreach ($commArr as $nodeVal) {

                if ($nodeVal['node_type_id'] == 3) {
                    $nodeZ.= $nodeVal['node_x_id'] . ',';
                } else if ($nodeVal['node_type_id'] == 1) {
                    $nodeX.= $nodeVal['node_x_id'] . ',';
                } else {
                    $nodeY.= $nodeVal['node_x_id'] . ',';
                }
            }
            $value['nodeZ'] = $nodeZ;
            $value['nodeX'] = $nodeX;

            $value['nodeZMain'] = $this->fetchNodeZ($value['nodeZ']);
            $value['nodeY'] = $this->fetchNodeIdOfClassY($value['node_id'], 'ids');
            $value['instance'] = $this->fetchNodeIdOfInstanceProperty($value['node_id'], 'ids');
            $value['nodeClassId'] = $this->fetchNodeClassId($value['nodeXY']);

            /* code here to assign node y class node x */



            /* code here for node Y class datatype awdhesh */

            $value['nodeYClassValue'] = $this->nodeYClassValue($value['nodeYClass']);
            $value['nodeClassYId'] = $this->nodeClassYId($value['node_id']);
            $value['nodeClassYInstanceValue'] = $this->nodeClassYInstanceValue($value['nodeClassYId'], $value['nodeY']);

            /* Code here to fetch record of node Z and node X. Please no anyone remove this code and also comment */

            $value['nodeZStructure'] = $this->getNodeInstaceId1($value['nodeZ'], $value['nodeClassId']);

            $value['nodeXStructure'] = $this->getNodeInstaceId1($value['nodeX'], $value['nodeClassId']);

            $temp = array();
            if (trim($value['nodeY']) != "")
                $temp = $this->getClassDetail($value['nodeY']);
            $value['nodeYClassName'] = $temp['caption'];

            if (trim($value['instance']) != "") {
                $instanceArray = explode(",", $value['instance']);
                $temmpArr = $this->getPropertyInstanceValues(array_values($instanceArray));

                foreach ($instanceArray as $k => $v) {
                    if (trim($v) != "") {
                        $temmp = array();
                        $temmp = $temmpArr[$k];
                        $value['instanceValue'][] = $temmp['value'];
                    }
                }
            }
            /* end code here */
            $webKey = 'property_'.$value['node_class_property_id'];
            $menuArray[$webKey] = $value;
            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {
                $menuArray[$webKey]['child'] = $this->getWebServicesAllProperty($menu2[$value['node_class_property_id']], $menu2, $childArray);
            }
        }
        return $menuArray;
    }

    /**
     * Ger Mapping role actor deal data
     * $param user_id
     * For Web Service
     *
     * */
    public function getMappingRoleData($post) {


            $mappingRoleClsId   = $post['mapping_role_class_id'];
            $userId             = $post['user_id'];
            $actorPropertyId    = $post['actor_property_id'];
            $dealPropertyId     = $post['deal_property_id'];
            $dealRolePropertyId = $post['role_property_id'];

            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('actor_id' => 'value'));
            $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id',array());
            $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('mapping_role_instance_id'=> 'node_instance_id', 'deal_node_id'=> 'value'));
            $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip1.node_instance_id', array('deal_role_id'=> 'value'));
            $select->where->AND->equalTo('ni.node_class_id', $mappingRoleClsId);
            $select->where->AND->equalTo('nip.node_class_property_id', $actorPropertyId);
            $select->where->AND->equalTo('nip.value', $userId);
            $select->where->AND->equalTo('nip1.node_class_property_id', $dealPropertyId);
            $select->where->AND->equalTo('nip2.node_class_property_id', $dealRolePropertyId);
            //$select->where->AND->equalTo('nip1.value', '2063677');
            //return $select->getSqlString();
            //$select->limit(25);
            $select->order('nip1.value DESC');
            //
            //$select->group('nip2.value');
            //return $select->getSqlString();

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray;
        }
    /**
     * Get all course
     * @param array $data
     * @return array
     * Added by:- Gaurav
     * Added comment:- 1/6/2017
     */
    public function fetchCourseApi($data = array()) {
        $course_class_id = $data['courseClassId'];
        $adminId = $data['adminId'];
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('node_instance_id' => 'node_instance_id','node_id', 'status'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption' => 'caption','property_node_id' => 'node_id'));
        //INNER JOIN `node-class-property` AS `ncp1` ON `ncp1`.`node_class_property_id` = `ncp`.`node_class_property_parent_id`
        $select->join(array('ncp1' => 'node-class-property'), 'ncp1.node_class_property_id = ncp.node_class_property_parent_id', array('parent_node_id' => 'node_id'));
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id', array('course_instance_node_id' => 'node_y_id'));
        $select->where->equalTo('xy.node_x_id', $adminId);
        $select->where->AND->equalTo('ni.node_class_id', $course_class_id);
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        $clsInstanceData = array();
        foreach ($instanceArra as $key => $insValue) {
            //if ($insValue['value'] == $adminId) {
                $clsInstanceData[$insValue['node_instance_id']]['course_instance_id'] = $insValue['node_instance_id'];
                $clsInstanceData[$insValue['node_instance_id']]['status'] = $insValue['status'];
                $clsInstanceData[$insValue['node_instance_id']]['course_node_id'] = $insValue['node_id'];
                $clsInstanceData[$insValue['node_instance_id']]['structure'][] = array('value' => $insValue['caption'], 'data' => $insValue['value'], 'nodeID' => $insValue['property_node_id'], 'parentID' => $insValue['parent_node_id']);
            //}
        }
        /*$_newArray = array();
        foreach($clsInstanceData as $key => $value){
            $_createdByKey = array_search('created by',array_map('strtolower',array_column($value['structure'],'value')));
            if($value['structure'][$_createdByKey]['data'] == $adminId){
                $_newArray[] = $value;
            }
        }*/
        return array_values($clsInstanceData);
    }

    /**
     * Created By: Amit Malakar
     * Date: 16-May-2017
     * Function to return Course Dialogue details based on time
     * @param array $data
     * @return array
     */
    public function fetchCourseDialogueTimeApi($data = array())
    {
        $login_userId        = $data['login_userId'];
        $timestamp           = $data['timestamp'];

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxy' => 'node-x-y-relation'), 'nxy.node_x_id = ni.node_id', array());
        $select->join(array('nxy2' => 'node-x-y-relation'), 'nxy2.node_x_id = nxy.node_y_id', array('course_node_id' => 'node_y_id'));
        $select->join(array('nxy1' => 'node-x-y-relation'), 'nxy1.node_y_id = nxy.node_y_id', array());
        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id = nxy1.node_x_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni1.node_instance_id', array('statement_timestamp' => new Predicate\Expression('MAX(nip1.value)')));
        $select->join(array('ni2' => 'node-instance'), 'ni2.node_id = nxy2.node_y_id', array('course_instance_id' => 'node_instance_id', 'course_status' => new Predicate\Expression("CASE WHEN ni2.status = 1 THEN 'Published' ELSE 'Draft' END")));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni2.node_instance_id', array('course_title' => 'value'));
        $select->join(array('ncp2' => 'node-class-property'), 'ncp2.node_class_property_id = nip2.node_class_property_id', array('course_title_caption' => 'caption'));
        $select->join(array('nip3' => 'node-instance-property'), 'nip3.node_instance_id = ni2.node_instance_id', array('course_timestamp' => 'value'));
        $select->join(array('ncp3' => 'node-class-property'), 'ncp3.node_class_property_id = nip3.node_class_property_id', array('course_timestamp_caption' => 'caption'));
        $select->join(array('nip6' => 'node-instance-property'), 'nip6.node_instance_id = ni2.node_instance_id', array('course_created_by' => 'value'));
        $select->join(array('ncp6' => 'node-class-property'), 'ncp6.node_class_property_id = nip6.node_class_property_id', array('course_created_by_caption' => 'caption'));
        $select->join(array('ni3' => 'node-instance'), 'ni3.node_id = nxy.node_y_id', array('dialogue_status' => new Predicate\Expression("CASE WHEN ni3.status = 1 THEN 'Published' ELSE 'Draft' END"), 'dialogue_instance_id' => 'node_instance_id', 'dialogue_node_id' => 'node_id'));
        $select->join(array('nip4' => 'node-instance-property'), 'nip4.node_instance_id = ni3.node_instance_id', array('dialogue_title' => 'value'));
        $select->join(array('ncp4' => 'node-class-property'), 'ncp4.node_class_property_id = nip4.node_class_property_id', array('dialogue_title_caption' => 'caption'));
        $select->join(array('nip5' => 'node-instance-property'), 'nip5.node_instance_id = ni3.node_instance_id', array('dialogue_timestamp' => 'value'));
        $select->join(array('nxy3' => 'node-x-y-relation'), 'nxy3.node_y_id = nxy.node_y_id', array());
        $select->join(array('ni4' => 'node-instance'), new Predicate\Expression('ni4.node_id = nxy3.node_x_id AND ni4.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $select->join(array('nip7' => 'node-instance-property'), 'nip7.node_instance_id = ni4.node_instance_id', array('actor_value' => new Predicate\Expression("GROUP_CONCAT(DISTINCT(CONCAT(nip7.value,'_',nip8.value)))")));
        $select->join(array('nip8' => 'node-instance-property'), 'nip8.node_instance_id = ni4.node_instance_id', array());
        $select->where->equalto('nip.node_class_property_id', INDIVIDUAL_ACTORID_PROP_ID);
        $select->where->AND->equalto('nip.value', $login_userId);
        $select->where->AND->equalto('nip1.node_class_property_id', STATEMENT_TIMESTAMP_ID);
        $select->where->AND->equalto('nip2.node_class_property_id', COURSE_TITLE_ID);
        $select->where->AND->equalto('nip3.node_class_property_id', COURSE_UPDATE_TIME_ID);
        $select->where->AND->equalto('nip4.node_class_property_id', DIALOGUE_TITLE_ID);
        $select->where->AND->equalto('nip5.node_class_property_id', DIALOGUE_UPDATED_TIMESTAMP_ID);
        $select->where->AND->equalto('nip6.node_class_property_id', COURSE_CREATED_BY_ID);
        $select->where->AND->equalto('nip7.node_class_property_id', INDIVIDUAL_ACTORID_PROP_ID);
        $select->where->AND->equalto('nip8.node_class_property_id', INDIVIDUAL_STATUS_PROP_ID);
        if ($timestamp) {
            $select->where->AND->greaterThan('nip1.value', $timestamp);
        }
        $select->group('nxy.node_y_id');
        $select->order(new Predicate\Expression('MAX(nip1.value) DESC'));

        /*$sql = "SELECT `nxy2` . `node_y_id` AS `course_node_id`, MAX(nip1 . value) AS `statement_timestamp`, `ni2` . `node_instance_id` AS `course_instance_id`, "
               . " CASE WHEN ni2 . status = 1 THEN 'Published' ELSE 'Draft' END AS `course_status`, "
               . " `ncp2`.`caption` AS `course_title_caption`, `nip2` . `value` AS `course_title`, `ncp3`.`caption` AS `course_timestamp_caption`, `nip3` . `value` AS `course_timestamp`,"
               . " CASE WHEN ni3 . status = 1 THEN 'Published' ELSE 'Draft' END AS `dialogue_status`, `nip4` . `value` AS `dialogue_title`,"
               . " `ncp4`.`caption` AS `dialogue_title_caption`,"
               . " `nip5`.`value` AS `dialogue_timestamp`, `ni3`.`node_instance_id` AS `dialogue_instance_id`, `ni3`.`node_id` AS `dialogue_node_id`, `ncp6`.`caption` AS `course_created_by_caption`,"
               . " `nip6`.`value` AS `course_created_by`, GROUP_CONCAT(DISTINCT `nip7` . `value`) AS `actor_value`"
               . " FROM `node-instance-property` AS `nip`"
               . " INNER JOIN `node-instance` AS `ni` ON `ni` . `node_instance_id` = `nip` . `node_instance_id`"
               . " INNER JOIN `node-x-y-relation` AS `nxy` ON `nxy`.`node_x_id` = `ni`.`node_id`"
               . " INNER JOIN `node-x-y-relation` AS `nxy2` ON `nxy2`.`node_x_id` = `nxy`.`node_y_id`"
               . " INNER JOIN `node-x-y-relation` AS `nxy1` ON `nxy1`.`node_y_id` = `nxy`.`node_y_id`"
               . " INNER JOIN `node-instance` AS `ni1` ON `ni1`.`node_id` = `nxy1`.`node_x_id`"
               . " INNER JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `ni1`.`node_instance_id`"
               . " INNER JOIN `node-instance` AS `ni2` ON `ni2`.`node_id` = `nxy2`.`node_y_id`"
               . " INNER JOIN `node-instance-property` AS `nip2` ON `nip2`.`node_instance_id` = `ni2`.`node_instance_id`"
               . " INNER JOIN `node-class-property` AS `ncp2` ON `ncp2`.`node_class_property_id` = `nip2`.`node_class_property_id`"
               . " INNER JOIN `node-instance-property` AS `nip3` ON `nip3`.`node_instance_id` = `ni2`.`node_instance_id`"
               . " INNER JOIN `node-class-property` AS `ncp3` ON `ncp3`.`node_class_property_id` = `nip3`.`node_class_property_id`"
               . " INNER JOIN `node-instance-property` AS `nip6` ON `nip6`.`node_instance_id` = `ni2`.`node_instance_id`"
               . " INNER JOIN `node-class-property` AS `ncp6` ON `ncp6`.`node_class_property_id` = `nip6`.`node_class_property_id`"
               . " INNER JOIN `node-instance` AS `ni3` ON `ni3`.`node_id` = `nxy`.`node_y_id`"
               . " INNER JOIN `node-instance-property` AS `nip4` ON `nip4`.`node_instance_id` = `ni3`.`node_instance_id`"
               . " INNER JOIN `node-class-property` AS `ncp4` ON `ncp4`.`node_class_property_id` = `nip4`.`node_class_property_id`"
               . " INNER JOIN `node-instance-property` AS `nip5` ON `nip5`.`node_instance_id` = `ni3`.`node_instance_id`"
               . " INNER JOIN `node-x-y-relation` AS `nxy3` ON `nxy3`.`node_y_id` = `nxy`.`node_y_id`"
               . " INNER JOIN `node-instance` AS `ni4` ON `ni4`.`node_id` = `nxy3`.`node_x_id` AND `ni4`.`node_class_id` = '" . INDIVIDUAL_HISTORY_CLASS_ID . "' "
               . " INNER JOIN `node-instance-property` AS `nip7` ON `nip7`.`node_instance_id` = `ni4`.`node_instance_id` "
               . " WHERE `nip`.`node_class_property_id` = '" . INDIVIDUAL_ACTORID_PROP_ID . "' AND `nip`.`value` = '$login_userId' AND `nip1`.`node_class_property_id` = '" . STATEMENT_TIMESTAMP_ID . "' "
               . " AND `nip2`.`node_class_property_id` = '" . COURSE_TITLE_ID . "' AND `nip3`.`node_class_property_id` = '" . COURSE_UPDATE_TIME_ID . "' AND `nip4`.`node_class_property_id` = '" . DIALOGUE_TITLE_ID . "' "
               . " AND `nip5`.`node_class_property_id` = '" . DIALOGUE_UPDATED_TIMESTAMP_ID . "' "
               . " AND `nip6`.`node_class_property_id` = '" . COURSE_CREATED_BY_ID . "' "
               . " AND `nip7`.`node_class_property_id` = '" . INDIVIDUAL_ACTORID_PROP_ID . "' ";
        if ($timestamp) {
            $sql .= "AND `nip1`.`value` > '$timestamp' ";
        }
        $sql .= " GROUP BY `nxy`.`node_y_id` ORDER BY MAX(`nip1`.`value`) DESC ";*/

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArr = $resultObj->initialize($result)->toArray();

        $courseData   = array();
        $dialogueData = array();
        $tempCourseId = array();

        foreach ($instanceArr as $key => $value) {
            if(!in_array($value['course_node_id'], $tempCourseId)){
                $tempCourseId[] = $value['course_node_id'];
                $courseData[]   = array(
                    'course_node_id'      => $value['course_node_id'],
                    'course_instance_id'  => $value['course_instance_id'],
                    'status'              => $value['course_status'],
                    'domain'              => 'Prospus',
                    'statement_timestamp' => $value['statement_timestamp'],
                    'course_timestamp'    => $value['course_timestamp'],
                    'structure'           => array(
                        array('value'    => $value['course_title_caption'],
                            'data'     => $value['course_title'],
                            'nodeID'   => COURSE_TITLE_PROP_NID,
                            'parentID' => COURSE_PROP_PNID
                        ),
                        array('value'    => $value['course_timestamp_caption'],
                            'data'     => $value['course_timestamp'],
                            'nodeID'   => COURSE_UPDATE_TIMESTAMP_PROP_NID,
                            'parentID' => COURSE_PROP_PNID
                        ),
                        array('value'    => $value['course_created_by_caption'],
                            'data'     => $value['course_created_by'],
                            'nodeID'   => COURSE_CREATED_BY_PROP_NID,
                            'parentID' => COURSE_PROP_PNID
                        ),
                    ),
                );
            }
            // show only active user ids - added minus removed participants
            $actor_value = '';
            if (isset($value['actor_value']) && $value['actor_value'] != '') {
                //$actorWithStatus = explode(',', $value['actor_value']);
                $chunks = array_chunk(preg_split('/(_|,)/', $value['actor_value']), 2);
                $result = array_combine(array_column($chunks, 0), array_column($chunks, 1));
                while (($key = array_search(2, $result)) !== false) {
                    unset($result[$key]);
                }
                $actor_value = implode(',', array_keys($result));
            }

            $dialogueData[] = array(
                'course_node_id'       => $value['course_node_id'],
                'dialogue_instance_id' => $value['dialogue_instance_id'],
                'dialogue_node_id'     => $value['dialogue_node_id'],
                'status'               => $value['dialogue_status'],
                'domain'               => 'Prospus',
                'statement_timestamp'  => $value['statement_timestamp'],
                'dialogue_timestamp'   => $value['dialogue_timestamp'],
                'structure'            => array(
                    'value'    => $value['dialogue_title_caption'],
                    'data'     => $value['dialogue_title'],
                    'nodeID'   => DIALOGUE_TITLE_PROP_NID,
                    'parentID' => DIALOGUE_TITLE_PROP_PNID,
                    'user_ids' => $actor_value,
                ),
            );
        }
        return $result = array('course' => $courseData, 'dialogue' => $dialogueData, 'timestamp' => "".time());
    }

    /**
     * Fetch course Dialogue
     * @param array $data
     * @return array
     */
    public function fetchCourseDialogueApi($data = array()) {

        $data['dialogueClassId']  = DIALOGUE_CLASS_ID;
        $data['statementClassId'] = STATEMENT_CLASS_ID;
        $data['dialogueTitle']    = DIALOGUE_TITLE_ID;
        $individual_history_class_id = INDIVIDUAL_HISTORY_CLASS_ID;
        $individual_history_actor_id = INDIVIDUAL_ACTORID_PROP_ID;

        $nodeId = array($data['courseNodeIds']);
        $course_class_id = $data['course_instance_node_id'];
        $sql = new Sql($this->adapter);
        $subselect = $sql->select();
        $subselect->from(array('nxyr' => 'node-x-y-relation'));
        $subselect->quantifier('DISTINCT');
        $subselect->columns(array('dialouge_node_id' => 'node_x_id','node_y_id'));
        $subselect->join(array('ni' => 'node-instance'),new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.$data['dialogueClassId'].' AND ni.status = 1'), array('node_instance_id'));
        $subselect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id ='.$data['dialogueTitle']), array('value'));
        $subselect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id ='.DIALOGUE_ADMIN_ID), array('dialogue_created_by'=>'value'));
        $subselect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array());
        $subselect->join(array('ni2' => 'node-instance'),new Predicate\Expression('ni2.node_id = nxyr1.node_x_id AND ni2.node_class_id = '.$individual_history_class_id), array());
        $subselect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id ='.$individual_history_actor_id), array('individual_node_id'=>'value'));
        $subselect->join(array('ni1' => 'node-instance'),new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> '.$data['statementClassId']), array());
        $subselect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption','node_id'));
        $subselect->join(array('ncp1' => 'node-class-property'), 'ncp.node_class_property_parent_id = ncp1.node_class_property_id', array('parent_node_id'=>node_id));
        $subselect->WHERE->IN('nxyr.node_y_id', $nodeId);
        //return  $select->getSqlstring();die;
        $select = $sql->select();
        $select->from(array('temp' => $subselect));
        $select->quantifier('DISTINCT');
        $select->columns(array('course_instance_node_id'=>'node_y_id','user_ids'=>new Predicate\Expression('GROUP_CONCAT(individual_node_id)'),'dialouge_node_id','node_instance_id','value','caption','property_node_id'=>'node_id','parent_node_id','dialogue_created_by'));
        $select->group('dialouge_node_id');
        //return  $select->getSqlstring();die;
        $statement                      =   $sql->prepareStatementForSqlObject($select);
//        $QUERY = "SELECT node_y_id as course_instance_node_id,GROUP_CONCAT(individual_node_id) as user_ids,dialouge_node_id,node_instance_id,value,caption,node_id as property_node_id,parent_node_id FROM (
//                    SELECT nip2.value as individual_node_id,nxyr.node_x_id as dialouge_node_id,nxyr.node_y_id,ni.node_instance_id,nip.value,ncp.caption,ncp.node_id,ncp1.node_id as parent_node_id FROM `node-x-y-relation` nxyr
//                    JOIN `node-instance` ni ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = ".$data['dialogueClassId']." AND ni.status = 1
//                    JOIN `node-instance-property` nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".$data['dialogueTitle']."
//                    JOIN `node-x-y-relation` nxyr1 ON nxyr1.node_y_id = nxyr.node_x_id
//                    JOIN `node-instance` ni2 ON ni2.node_id = nxyr1.node_x_id AND ni2.node_class_id = ".$individual_history_class_id."
//                    JOIN `node-instance-property` nip2 ON ni2.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".$individual_history_actor_id."
//                    JOIN `node-instance` ni1 ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> ".$data['statementClassId']."
//                    JOIN `node-class-property` ncp ON ncp.node_class_property_id = nip.node_class_property_id
//                    JOIN `node-class-property` ncp1 ON ncp.node_class_property_parent_id = ncp1.node_class_property_id
//                    WHERE nxyr.`node_y_id` in ($nodeId)) temp GROUP BY dialouge_node_id";
//
//
//        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $instanceArra = $resultObj->initialize($result)->toArray();
        $clsInstanceData = array();
        foreach ($instanceArra as $key => $insValue) {
            $clsInstanceData[$insValue['node_instance_id']]['course_node_id'] = $insValue['course_instance_node_id'];
            $clsInstanceData[$insValue['node_instance_id']]['dialogue_instance_id'] = $insValue['node_instance_id'];
            $clsInstanceData[$insValue['node_instance_id']]['dialouge_node_id'] = " ".$insValue['dialouge_node_id'];
            $clsInstanceData[$insValue['node_instance_id']]['dialogue_created_by'] = $insValue['dialogue_created_by'];
            $statementVal = $this->getMaxStatementVal($insValue['dialouge_node_id']);
            /* Added by- Gaurav
             * 5 June 2017
             */
            if(isset($data['platform']) && $data['platform']=='IOS'){
                //only active user ids are added for user_ids parameter
                $user_record = array_count_values(explode(",", $insValue['user_ids']));
                $user_ids = array_filter($user_record, function($element) {
                    return (isset($element) && $element%2 != 0);
                });
                $clsInstanceData[$insValue['node_instance_id']]['dialogue_title'] = $insValue['value'];
                $clsInstanceData[$insValue['node_instance_id']]['user_ids'] = implode(",", array_keys($user_ids));
                // extra key - users added - shows all user ids active + inactive
                $clsInstanceData[$insValue['node_instance_id']]['users_all'] = implode(",",array_unique(explode(",", $insValue['user_ids'])));
                $clsInstanceData[$insValue['node_instance_id']]['statement_timestamp'] = $statementVal;
            }else{
                $clsInstanceData[$insValue['node_instance_id']][] = array('value' => $insValue['caption'], 'data' => $insValue['value'], 'nodeID' => $insValue['property_node_id'], 'parentID' => $insValue['parent_node_id'],'user_ids' => $insValue['user_ids']);
            }
        /*End
         */

        }

       return array_values($clsInstanceData);

    }
    /**
     * Added by Gaurav
     * 05 june 2017
     * @param type $dialogueNodeId
     * @return max value of statement
     */
    function getMaxStatementVal($dialogueNodeId){

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array('statement_node_id' => 'node_x_id','node_y_id'));
        $select->join(array('ni' => 'node-instance'),new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.STATEMENT_CLASS_ID.' AND ni.status = 1'), array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id ='.STATEMENT_TIMESTAMP_ID), array('statement_timestamp' => new Predicate\Expression('MAX(nip.value)')));
        $select->WHERE->equalTo('nxyr.node_y_id', $dialogueNodeId);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $timeStampArr = $resultObj->initialize($result)->toArray();
        $timestamp = '';
        foreach ($timeStampArr as $key => $insValue) {
            $timestamp = $insValue['statement_timestamp'];

        }
        return $timestamp;
    }

    /* ****************END*********************** FOR WEB SERVICES ************************************************/

    public function deleteInstanceProperty($node_id, $status) {
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

    public function getinstancesDetailsByIdUpdated($node_id)
    {

        $sql                		=	new Sql($this->adapter);
        $select						=	$sql->select();
        $select->from('node-instance');
        $select->where->equalTo('node_id',$node_id);
        $statement					=	$sql->prepareStatementForSqlObject($select);
        $result						=	$statement->execute();
        $resultObj					=	new ResultSet();
        $dataArray					=	$resultObj->initialize($result)->toArray();
        return $dataArray[0]['node_instance_id'];
    }

    // code by kunal for field maping

    public function getInstanceStructureWithHirerchyAndProperty($node_instance_id, $fetchType = "") {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('*'));
        $select->where->equalTo('ni.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $instancesArray = array();
        $instancesArray = $dataArray[0];

        $propArray = $this->getClassStructureAgainWithHirerchyAndProperty($instancesArray['node_class_id'], $node_instance_id, $fetchType);
        if ($fetchType == "")
            $instancesArray['instances'] = $propArray[0];
        else
            $instancesArray['Properties'] = $propArray[0]['Properties'];
        return $instancesArray;
    }

    public function getClassStructureAgainWithHirerchyAndProperty($node_class_id, $node_instance_id, $fetchType = "") {
        $sql = new Sql($this->adapter);

        $instanceAttributeArray = array(array(
            'instance_attribute_id' => '2',
            'instance_attribute' => 'Properties',
            'parent_attribute_id' => '0',
            'is_active' => '1'
        )
        );

        $tempMainArray = array();
        $mainArray = array();


        $tempMainArray['node_class_id'] = $node_class_id;
        $mainArray[] = $tempMainArray;
        foreach ($mainArray as $key => $value) {
            $propArray = $this->getProperties($value['node_class_id'], 'N');
            $mainPropArray = array();
            $subPropArray = array();
            foreach ($propArray as $propk => $propv) {
                if (intval($propv['node_class_property_parent_id']) == 0)
                    $mainPropArray[] = $propv;
                else
                    $subPropArray[$propv['node_class_property_parent_id']][] = $propv;
            }

            $realPropArray = array();

            $mainArray[$key] = $this->getAllPropertyAgainK($mainPropArray, $subPropArray, $realPropArray, $node_instance_id, $fetchType);
        }



        return $mainArray;
    }

    public function getAllPropertyAgainK($menu1, $menu2, $menuArray, $node_instance_id, $fetchType = "") {

        foreach ($menu1 as $key => $value) {


            $fecthStyle = 'caption';
            $isChild = '';


            $menuArray[$value['caption']] = $value['node_class_property_id'];



            $childArray = array();
            if (is_array($menu2[$value['node_class_property_id']])) {

                $menuArray[$value['caption']] = $this->getAllPropertyAgainK($menu2[$value['node_class_property_id']], $menu2, $childArray, $node_instance_id, $fetchType);
            }
        }


        return $menuArray;
    }

    /* Start Code By Arvind Soni */
    public function getNodeInstanceValueByWithProertyName($node_instance_id) {

        $tempArray = array();

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nc' => 'node-instance-property'));
        $select->columns(array('value', 'node_class_property_id'));
        $select->join(array('ncp' => 'node-class-property'), 'nc.node_class_property_id = ncp.node_class_property_id', array('caption',), 'inner');
        $select->where->equalTo('nc.node_instance_id', $node_instance_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dataArray = $resultObj->initialize($result)->toArray();

        $tempArray1 = array();
        foreach ($dataArray as $data) {
            $tempArray1[$data['caption']][] = $data['value'];
        }

        foreach ($dataArray as $data) {
            if (count($tempArray1[$data['caption']]) > 1) {
                $tempArray[$data['caption']] = implode(CHECKBOX_SEPERATOR, $tempArray1[$data['caption']]) . CHECKBOX_SEPERATOR;
            } else
                $tempArray[$data['caption']] = $data['value'];
        }

        return $tempArray;
    }

    public function getInstanceListOfPerticulerClass($node_class_id) {
        $sql                        = new Sql($this->adapter);
        $select                     = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id', 'node_class_id', 'node_id', 'status'));
        $select->where->equalTo('ni.node_class_id', $node_class_id);
        $select->where->equalTo('ni.status', 1);

        $statement                  = $sql->prepareStatementForSqlObject($select);
        $result                     = $statement->execute();
        $resultObj                  = new ResultSet();

        $insArray                   = $resultObj->initialize($result)->toArray();

        $allInsArray                = array();
        foreach($insArray as $key => $value)
        {

            $temp = $this->getNodeInstanceValueByWithProertyName($value['node_instance_id']);
            if($temp['Active'] == '1' && $value['node_id'] != ROLE_ADMINISTRATOR && $value['node_id'] != ROLE_SUPERADMIN)
                $allInsArray[$value['node_id']] = $this->getNodeInstanceValueByWithProertyName($value['node_instance_id']);
        }

        return $allInsArray;
    }

    public function createOrGetActor($actor_name, $actor_email)
    {
        $userArray                  = $this->getIndividualUsersList();

        $actor_nid                  = '';
        foreach($userArray as $index => $valueArray)
        {
            if(trim($valueArray['email_address']) != '' && trim($actor_email) != '' && trim(strtolower($valueArray['email_address'])) == trim(strtolower($actor_email)))
            {
                $actor_nid          = $valueArray['node_id'];
            }
        }

        if($actor_nid == '')
        {
            $node_instance_id       = $this->createInstance('', INDIVIDUAL_CLASS_ID, '2', 'P', 0);

            if (intval($node_instance_id) > 0) {
                $arr    =   preg_split("/\s+(?=\S*+$)/",$actor_name);
                if(count($arr) == 1)
                {
                    $this->createInstanceProperty(array('2921'), array($actor_name), $node_instance_id, '2');
                }
                else
                {
                    $this->createInstanceProperty(array('2921','2922'), $arr, $node_instance_id, '2');
                }
            }

            $node_instance_id1       = $this->createInstance('', ACCOUNT_CLASS_ID, '2', 'P', 0);

            if (intval($node_instance_id1) > 0) {

                $this->createInstanceProperty(array('2932','2933'), array($actor_email,'Password1'), $node_instance_id1, '2');
            }

            $node_instance_id2       = $this->createInstance('', ROLE_CLASS_ID, '2', 'P', 0);

            if (intval($node_instance_id2) > 0) {
                $common_name = 'Sales Consultant';
                $this->createInstanceProperty(array('2926','2927','2928','2929'), array($common_name,'www.marinemax.com',$actor_name,date('Y-m-d h:i:s')), $node_instance_id2, '2');
            }

            $actor_nid              = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id);
            $node_x_id[]            = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id1);
            $node_x_id[]            = $this->getNodeId('node-instance', 'node_instance_id', $node_instance_id2);

            $this->saveNodeX($actor_nid, implode(",",$node_x_id));


        }

        return $actor_nid;
    }

    public function hello()
    {
        return 'Hi Hello';
    }

    /*
     * Created By: Ben, Divya Rajput
     * On Date: 11-April-2017
     * Purpose: To fetch Course List Data By Course, By Dialogue
     * @param: array: login_user_id, course_property_ids, dialogue_property_ids, order_by, order, view_type, search_on_dash
     * @param: return array
     */
    public function fetchCoureListData($_data = array(), $notForCourseApi = true){

        $login_userId = $_data['login_userId'];
        $header_filter = isset($_data['header_filter']) ? $_data['header_filter'] : '';
        $search_on_dashboard = (isset($_data['search_on_dash']) && $_data['search_on_dash'] != '') ? $_data['search_on_dash'] : '';
        $view_type = $_data['view_type'];
        $course_dialogue_listing = isset($_data['listing']) ? true : false;
        $platform = isset($_data['platform']) ? strtolower($_data['platform']) : '';

        $ni1_array = $ni2_array = array();
        $nip_array = $nip1_array = $nip2_array = $nip3_array = $nip4_array = $nip5_array = $nip6_array = $nip7_array = $nip8_array = $nip9_array = array();

        //if($view_type == 'bycourse' || $view_type == 'bydialogue' || $search_on_dashboard != ""){
            $ni1_array = array('course_node_id' => 'node_id', 'course_instance_id' => 'node_instance_id', 'course_status' => new Predicate\Expression('CASE WHEN ni1.status = 1 THEN \'Published\' ELSE \'Draft\' END'));
        //}
        //if($view_type == 'bycourse' && $search_on_dashboard == ""){
            if($notForCourseApi){ //Not execute for api
                $nip1_array = array('course_title' => 'value');
                $nip2_array = array('course_creation_date' => 'value');
                $nip7_array = array('course_created_by' => 'value');
                $nip9_array = array('course_updation_timestamp' => 'value');
            }else{
                $nip_array = array('property' => new Predicate\Expression("CONCAT(ncpApi.node_id,'~###~',ncpApi2.node_id,'~###~',ncpApi.caption,'~###~',nip1.value)"));
            }
        //}
        if($view_type == 'bydialogue' || $view_type == 'byactor' || $search_on_dashboard != ""){
            //$nip1_array = array('course_title' => 'value');
            //$nip2_array = array('course_updation_timestamp' => 'value');
            $nip3_array = array('dialogue_title' => 'value');
            $nip4_array = array('dialogue_timestamp' => 'value');
            //$nip5_array = array('actor_value' => 'value');
            $nip6_array = array('has_removed' => 'value');
            $nip8_array = array('dialogue_created_by' => 'value');
            //$nip7_array = array('course_created_by' => 'value');
        }
        $nip5_array = array('actor_value' => 'value');

//        if($view_type == 'byactor' && $search_on_dashboard == ""){
//            $nip3_array = array('dialogue_title' => 'value');
//            $nip5_array = array('actor_value' => 'value');
//            $nip6_array = array('has_removed' => 'value');
//        }
        if($notForCourseApi){ //Not execute for api
            $ni2_array = array('dialogue_node_id' => 'node_id', 'dialogue_instance_id' => 'node_instance_id', 'dialogueStatus' => new Predicate\Expression('CASE WHEN ni2.status = 1 THEN \'Published\' ELSE \'Draft\' END'));
        }
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->quantifier('DISTINCT');
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns($nip_array);
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxy' => 'node-x-y-relation'), 'nxy.node_x_id = ni.node_id', array());
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxy.node_y_id AND ni1.node_class_id = '.COURSE_CLASS_ID), $ni1_array);

        if($notForCourseApi){ //Not execute for api
            $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id = '.COURSE_TITLE_ID), $nip1_array, 'inner');
            $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = ni1.node_instance_id AND nip2.node_class_property_id = '.COURSE_TIMESTAMP_ID), $nip2_array, 'inner');
            $select->join(array('nip7' => 'node-instance-property'), new Predicate\Expression('nip7.node_instance_id = ni1.node_instance_id AND nip7.node_class_property_id = '.COURSE_CREATED_BY_ID), $nip7_array, 'inner');
            $select->join(array('nip9' => 'node-instance-property'), new Predicate\Expression('nip9.node_instance_id = ni1.node_instance_id AND nip9.node_class_property_id = '.COURSE_UPDATE_TIME_ID), $nip9_array, 'inner');
        }else{
            $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id IN('.COURSE_TITLE_ID.','.COURSE_TIMESTAMP_ID.','.COURSE_CREATED_ID.','.COURSE_UPDATE_TIME_ID.')'), $nip1_array, 'inner');
        }

        /* Added for api
         * By:- Gaurav
         * 06 june 2017
         */
        $joinCond = 'left';
        if ( isset($_data['timestamp']) && $_data['timestamp'] != '' && (int)$_data['timestamp'] > 0 ){
            $joinCond = 'inner';
        }

        if( isset($header_filter['filter_key']) && $header_filter['filter_key'] == 'course_type' && $header_filter['filter_value'] == 'dialogue' ){
            $joinCond = 'inner';
        }

        if( isset($header_filter['filter_key']) && $header_filter['filter_key'] == 'course_type' && $header_filter['filter_value'] == 'production' ){
            $joinCond = 'left';
        }
        /* End */
        $select->join(array('nxy2' => 'node-x-y-relation'), 'nxy2.node_y_id = nxy.node_y_id', array(), $joinCond);
        $select->join(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxy2.node_x_id AND ni2.node_class_id = '.DIALOGUE_CLASS_ID), $ni2_array, $joinCond);

        if($view_type == 'bydialogue' || $view_type == 'byactor' || $search_on_dashboard != ""|| ($platform == 'ios')){
            $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = ni2.node_instance_id AND nip3.node_class_property_id = '.DIALOGUE_TITLE_ID), $nip3_array, 'left');
            $select->join(array('nip4' => 'node-instance-property'), new Predicate\Expression('nip4.node_instance_id = ni2.node_instance_id AND nip4.node_class_property_id = '.DIALOGUE_TIMESTAMP_ID), $nip4_array, 'left');
        }
        if($course_dialogue_listing || $view_type == 'bydialogue' || $view_type == 'byactor'){
            $select->join(array('nip8' => 'node-instance-property'), new Predicate\Expression('nip8.node_instance_id = ni2.node_instance_id AND nip8.node_class_property_id = '.DIALOGUE_ADMIN_ID), $nip8_array, 'left');
        }

        $select->join(array('nxy3' => 'node-x-y-relation'), 'nxy3.node_y_id = ni2.node_id', array(), 'left');
        $select->join(array('ni3' => 'node-instance'), new Predicate\Expression('ni3.node_id = nxy3.node_x_id AND ni3.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array(), 'left');
        $select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = ni3.node_instance_id AND nip5.node_class_property_id = '.INDIVIDUAL_ACTORID_PROP_ID), $nip5_array, 'left');
        if($view_type == 'bydialogue' || $view_type == 'byactor' || $search_on_dashboard != ""){
            //$select->join(array('nxy3' => 'node-x-y-relation'), 'nxy3.node_y_id = ni2.node_id', array(), 'left');
            //$select->join(array('ni3' => 'node-instance'), new Predicate\Expression('ni3.node_id = nxy3.node_x_id AND ni3.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array(), 'left');
            //$select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = ni3.node_instance_id AND nip5.node_class_property_id = '.INDIVIDUAL_ACTORID_PROP_ID), $nip5_array, 'left');
            $select->join(array('nip6' => 'node-instance-property'), new Predicate\Expression('nip6.node_instance_id = ni3.node_instance_id AND nip6.node_class_property_id = '.INDIVIDUAL_STATUS_PROP_ID), $nip6_array, 'left');
        }
        if(!$notForCourseApi){ //Execute for api
            $select->join(array('ncpApi' => 'node-class-property'), 'ncpApi.node_class_property_id = nip1.node_class_property_id', array());
            $select->join(array('ncpApi2' => 'node-class-property'), 'ncpApi2.node_class_property_id = ncpApi.node_class_property_parent_id', array());
        }
        $select->where->equalTo('nip.node_class_property_id', INDIVIDUAL_ACTORID_PROP_ID);
        $select->where->AND->equalTo('nip.value', $login_userId);
        if($course_dialogue_listing){
            $select->where->AND->equalTo('ni1.node_instance_id', $_data['course_instance_id']);
        }
        /* don't remove
        if($header_filter['filter_title'] == 'course' && $header_filter['filter_key'] == 'equalto'){
            $select->where->AND->equalTo('nip1.value', $header_filter['filter_value']);
        }elseif($header_filter['filter_title'] == 'course' && $header_filter['filter_key'] == 'contains'){
            $select->where->AND->LIKE('nip1.value', "%".$header_filter['filter_value']."%");
        }*/

        if($view_type == 'bydialogue' && $search_on_dashboard == ""){
            $select->where->AND->IsNotNull(array('ni2.node_id'));
        }

        /*don't remove
        if($view_type == 'bycourse' && $header_filter['filter_title'] == 'status' && $header_filter['filter_key'] == 'equalto' && $header_filter['filter_value'] != 'all'){
            $select->where->AND->equalTo('ni1.status', $header_filter['filter_value']);
        }elseif($header_filter['filter_title'] == 'dialogue' && $header_filter['filter_key'] == 'equalto'){
            $select->where->AND->equalTo('nip3.value', $header_filter['filter_value']);
        }elseif($header_filter['filter_title'] == 'dialogue' && $header_filter['filter_key'] == 'contains'){
            $select->where->AND->LIKE('nip3.value', "%".$header_filter['filter_value']."%");
        }*/

        /*don't remove
        if($header_filter['filter_title'] == 'course' && $header_filter['filter_key'] == 'order_by'){
            $select->order(array('nip1.value '.$header_filter['filter_value']));
        }elseif($view_type == 'bycourse' && $header_filter['filter_title'] == 'date' && $header_filter['filter_key'] == 'order_by'){
            $select->order(array('nip2.value '.$header_filter['filter_value']));
        }elseif($view_type == 'bydialogue' && $header_filter['filter_title'] == 'dialogue' && $header_filter['filter_key'] == 'order_by'){
            $select->order(array('nip3.value '.$header_filter['filter_value']));
        }elseif($view_type == 'bydialogue' && $header_filter['filter_title'] == 'date' && $header_filter['filter_key'] == 'order_by'){
            $select->order(array('nip4.value '.$header_filter['filter_value']));
        }else{
            if($view_type == 'bycourse' && !$course_dialogue_listing){
                $select->order(array('nip9.value DESC'));
            }else{
                if($notForCourseApi){ //Not execute for api
                    $select->order(array('ni1.node_id DESC'));
                    $select->order(array('ni2.node_id DESC'));
                }else{
                    $select->order(array('ni1.node_id DESC'));
                }
            }
        }*/

        if($view_type == 'bycourse' && $header_filter['filter_key'] == 'order_by'){
            $select->order(array('nip2.value '.$header_filter['filter_value']));
        }else{
            if($view_type == 'bycourse' && !$course_dialogue_listing){
                $select->order(array('nip9.value DESC'));
            }else{
                if($notForCourseApi){ //Not execute for api
                    $select->order(array('ni1.node_id DESC'));
                    $select->order(array('ni2.node_id DESC'));
                }else{
                    $select->order(array('ni1.node_id DESC'));
                }
            }
        }
        //return $select->getSqlString();
        $statement  = $sql->prepareStatementForSqlObject($select);
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        $course_dialogue_data = $resultObj->initialize($result)->toArray();
        $course_node_ids = array_values(array_filter(array_unique(array_column($course_dialogue_data, 'course_node_id'))));
        $dialogue_node_ids = array_values(array_filter(array_unique(array_column($course_dialogue_data, 'dialogue_node_id'))));

        $actor = array_flip(array_values(array_filter(array_unique(array_column($course_dialogue_data, 'actor_value'))))); 
        //$actor = array_flip(array_values(array_column($course_dialogue_data, 'actor_value')));
        $actor_ids = array_values(array_flip($actor));

        //To fetch all dialogue NodeIds And their latest Statement Timestamp
        $dialogue_order_data = array();
        if((($view_type != 'bycourse') || $platform == 'ios') && (count($dialogue_node_ids) > 0) /*&& (!isset($header_filter['filter_key']) || $header_filter['filter_key'] != 'order_by' || $search_on_dashboard != "")*/){
            $dialogue_order_data    = $this->getdailogueSequenceByLatestStatement($dialogue_node_ids, $_data);
        }
        $notificationDataArray = array();
        if((1 /*$view_type == 'bycourse'*/) && (count($dialogue_node_ids) > 0)){
            $notificationDataArray = $this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_node_ids, $login_userId, '', 'IN');
        }

        //To fetch all users of particular Course
        if($view_type == 'bycourse' && count($course_node_ids) > 0){
            $course_user_data = $this->formattedCourseUserData($course_node_ids);
        }
        //print_r($course_node_ids); die();
        //To fetch all Production Count of particular Course
        if($view_type == 'bycourse' && count($course_node_ids) > 0){
            $course_production_data = $this->formattedCourseProductionData($course_node_ids, $login_userId);
        }

        //To fetch all users information on behalf of users ids
        $actor_info = array();
        if(($view_type != 'bycourse' || $search_on_dashboard != "") && count($actor_ids) > 0){
            $actor_proeprty_ids = array(INDIVIDUAL_FIRST_NAME, INDIVIDUAL_LAST_NAME);
            $actor_info = $this->getActorInfo($actor_ids, $actor_proeprty_ids, $header_filter);
        }
        return array('course_dialogue_data' => $course_dialogue_data, 'dialogue_order_data' => $dialogue_order_data, 'actor_info' => $actor_info, 'course_user_data' => $course_user_data, 'course_production_data' => $course_production_data, 'notificationDataArray' => $notificationDataArray);
    }
    /*End Here*/

    /**
     * FUNCTION TO GET THE ACTOR FOR LISTING
     * UPDATE BY - AMIT B
     * UPDATE BY - Gaurav panchal(Add user profile image)(04 July 2017)
     *
     * @param type $variable_data
     * @return type
     */
    public function getDialogueActorList($variable_data){

        $user_class_node_id = INDIVIDUAL_CLASS_ID;
        //return INDIVIDUAL_LAST_NAME;
        $course_instance_node_id  = $variable_data['course_node_id'];
        $sql = new Sql($this->adapter);
        // QUERY TO FETCH USER FROM DIALOGUE INDIVIDUAL HISTORY CLASS
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'),new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array());
        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = ni.node_id', array());
        $select->join(array('ni1' => 'node-instance'),new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni1.node_instance_id AND nip.node_class_property_id IN ('.INDIVIDUAL_ACTORID_PROP_ID.')'), array('user_id'=>'value'));
        //$select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = ni1.node_instance_id AND nip5.node_class_property_id='.INDIVIDUAL_STATUS_PROP_ID.' AND nip5.value=1'), array());
        $select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = ni1.node_instance_id AND nip5.node_class_property_id='.INDIVIDUAL_STATUS_PROP_ID), array('status'=>'value'));
        $select->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = nip.value', array());
        $select->join(array('ni2' => 'node-instance'), 'ni2.node_id = nxyr2.node_y_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni2.node_instance_id', array('name'=>'value'));
        $select->join(array('ncp' => 'node-class-property'), new Predicate\Expression('ncp.node_class_property_id = nip1.node_class_property_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.','.INDIVIDUAL_PROFILE_IMAGE.')'), array('caption'));
        $select->join(array('ni3' => 'node-instance'), 'ni3.node_id = nxyr2.node_x_id', array());
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni3.node_instance_id', array('user_email'=>'value'));
        $select->join(array('ncp1' => 'node-class-property'), new Predicate\Expression('ncp1.node_class_property_id = nip2.node_class_property_id AND nip2.node_class_property_id IN ('.INDIVIDUAL_EMAIL_ID.')'), array());
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = ni3.node_instance_id AND nip3.node_class_property_id IN ('.ACCOUNT_STATUS_ID.')'), array('account_status'=>'value'), 'LEFT');
        $select->where->AND->equalTo('nxyr.node_y_id', $course_instance_node_id);
//        $sql = new Sql($this->adapter);
//        $select = $sql->select();
//        $select->from(array('nxyr' => 'node-x-y-relation'));
//        $select->columns(array());
//        $select->join(array('ni' => 'node-instance'),new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array());
//        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = ni.node_id', array());
//        $select->join(array('ni1' => 'node-instance'),new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_CLASS_ID), array('user_id'=>'node_id'));
//        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni1.node_instance_id AND nip.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('name'=>'value'));
//        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
//        $select->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = ni1.node_id', array());
//        $select->join(array('ni2' => 'node-instance'),new Predicate\Expression('ni2.node_id = nxyr2.node_x_id AND ni2.node_class_id = '.ACCOUNT_CLASS_ID), array());
//        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni2.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_EMAIL_ID.')'), array('user_email'=>'value'));
//        $select->where->AND->equalTo('nxyr.node_y_id', $course_instance_node_id);
//        return  $select->getSqlstring();die;
//        $select->from(array('nip' => 'node-instance-property'));
//        $select->columns(array('name' => 'value'));
//        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
//        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
//        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_id' => 'node_x_id'));
//        $select->join(array('xy1' => 'node-x-y-relation'), 'xy1.node_y_id = xy.node_x_id', array());
//        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id = xy1.node_x_id', array());
//        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni1.node_instance_id', array('user_email' => 'value'));
//        $select->where->equalTo('xy.node_y_id', $course_instance_node_id);
//        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
//        $select->where->AND->equalTo('ni.status', 1);
//        $select->where->AND->equalTo('ni1.node_class_id', ACCOUNT_CLASS_ID);
//        $select->where->AND->equalTo('nip1.node_class_property_id', INDIVIDUAL_EMAIL_ID);
//        $select->where(new Predicate\Expression('nip.node_class_property_id in(' . INDIVIDUAL_FIRST_NAME . ',' . INDIVIDUAL_LAST_NAME . ')'));
//        return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $_dialogueActor = $resultObj->initialize($result)->toArray();

        // QUERY TO FETCH USER FROM COURSES INDIVIDUAL HISTORY CLASS
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'),new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id IN ('.INDIVIDUAL_ACTORID_PROP_ID.')'), array('user_id'=>'value'));
        $select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = ni.node_instance_id AND nip5.node_class_property_id='.INDIVIDUAL_STATUS_PROP_ID), array('status'=>'value'));
        $select->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = nip.value', array());
        $select->join(array('ni2' => 'node-instance'), 'ni2.node_id = nxyr2.node_y_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni2.node_instance_id', array('name'=>'value'));
        $select->join(array('ncp' => 'node-class-property'), new Predicate\Expression('ncp.node_class_property_id = nip1.node_class_property_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.','.INDIVIDUAL_PROFILE_IMAGE.')'), array('caption'));
        $select->join(array('ni3' => 'node-instance'), 'ni3.node_id = nxyr2.node_x_id', array());
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = ni3.node_instance_id', array('user_email'=>'value'));
        $select->join(array('ncp1' => 'node-class-property'), new Predicate\Expression('ncp1.node_class_property_id = nip2.node_class_property_id AND nip2.node_class_property_id IN ('.INDIVIDUAL_EMAIL_ID.')'), array());
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = ni3.node_instance_id AND nip3.node_class_property_id IN ('.ACCOUNT_STATUS_ID.')'), array('account_status'=>'value'), 'LEFT');
        $select->where->AND->equalTo('nxyr.node_y_id', $course_instance_node_id);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $_courseActor = $resultObj->initialize($result)->toArray();
        // LOOP TO MAKE USER ID AS KEY DIALOGUE ACTORS
        $userListDialogue = array();
        foreach ($_dialogueActor as $key => $value) {
            $userListDialogue[$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))] = isset($value['name']) ? $value['name'] : '';
            $userListDialogue[$value['user_id']]['email'] = $value['user_email'];
            $userListDialogue[$value['user_id']]['user_id'] = $value['user_id'];
            $userListDialogue[$value['user_id']]['status'] .= $value['status'];
            $userListDialogue[$value['user_id']]['account_status'] = $value['account_status'];

            if($value['account_status']=="guest"){
                $userListDialogue[$value['user_id']]['profile_image'] = $this->getProfileUserImage('', 'guest');
            }else{
            if(trim($value['caption'])=="Profile Image"){
               $userListDialogue[$value['user_id']]['profile_image'] = $this->getProfileUserImage($value['name'], 'thumbnail');
            }else{
                if (!array_key_exists("profile_image",$userListDialogue[$value['user_id']])){
                    $userListDialogue[$value['user_id']]['profile_image'] = $this->getProfileUserImage('', 'thumbnail');
                }
            }
        }

        }

        // LOOP TO MAKE USER ID AS KEY COURSE ACTORS
        $userListCourse = array();
        foreach ($_courseActor as $key => $value) {
            $userListCourse[$value['user_id']][str_replace(' ', '_', strtolower($value['caption']))] = isset($value['name']) ? $value['name'] : '';
            $userListCourse[$value['user_id']]['email'] = $value['user_email'];
            $userListCourse[$value['user_id']]['user_id'] = $value['user_id'];
            $userListCourse[$value['user_id']]['status'] = $value['status'];
            $userListCourse[$value['user_id']]['account_status'] = $value['account_status'];

            if ($value['account_status'] == "guest") {
                $userListCourse[$value['user_id']]['profile_image'] = $this->getProfileUserImage('', 'guest');
            } else {
                if (trim($value['caption']) == "Profile Image") {
               $userListCourse[$value['user_id']]['profile_image'] = $this->getProfileUserImage($value['name'], 'thumbnail');
                } else {
                    if (!array_key_exists("profile_image", $userListCourse[$value['user_id']])) {
                    $userListCourse[$value['user_id']]['profile_image'] = $this->getProfileUserImage('', 'thumbnail');
                }
            }
        }
        }
        // FIND OUT THE COMMON USER IDS
        $_commonIds = array_intersect(array_keys($userListDialogue),array_keys($userListCourse));
        // UNSET THE COMMON USER FROM COURSE ARRAY
        foreach($_commonIds as $_key) {
            unset($userListCourse[$_key]);
        }
        // MERGE BOTH ARRAY TO GET THE FINAL ARRAY
        $_finalRes = $userListDialogue + $userListCourse;
        return $_finalRes;
    }

    /**
     * For get all instances from class roles_cb from course_builder
     * @param null
     * @return roleArray
     */
    public function getRoleListOfCB() {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id','node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('value','node_class_property_id'), '');
        $select->where->equalTo('ni.node_class_id', ROLE_CB_CLASS_ID);
        $select->where->AND->equalTo('nip.node_class_property_id', ROLE_CB_ROLE_PID);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $tempArr = $resultObj->initialize($result)->toArray();

        $roleArray = array();
        foreach($tempArr as $index => $value)
        {
            $temp['role_id']    = $value['node_id'];
            $temp['role']       = $value['value'];
            $roleArray[] = $temp;
        }
        return $roleArray;
    }
    /*
     * Created By: Kunal
     * On Date: 05-May-2017
     * Purpose: To fetch list of all users from individual class
     * @param: return array
     */
    public function getAllUserList(){
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('name'=>'value'));
        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('name_caption' => new Predicate\Expression('REPLACE(LOWER(ncp.caption)," ","_")')));
        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni.node_id', array());
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr.node_x_id AND ni1.node_class_id='.ACCOUNT_CLASS_ID), array());
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_EMAIL_ID.')'), array('email'=>'value'));
        $select->join(array('ncp1' => 'node-class-property'), 'ncp1.node_class_property_id = nip1.node_class_property_id', array('email_caption'=>new Predicate\Expression('REPLACE(LOWER(ncp1.caption)," ","_")')));
        $select->where->AND->equalTo('ni.node_class_id', INDIVIDUAL_CLASS_ID);
        $select->where->AND->equalTo('ni.status', 1);
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $resultAry               =   $resultObj->initialize($result)->toArray();
        $_userList = array();
        foreach ($resultAry AS $key => $value) {
            $_userList[$value['node_id']][$value['name_caption']] = $value['name'];
            $_userList[$value['node_id']][$value['email_caption']] = $value['email'];
            $_userList[$value['node_id']]['node_id'] = $value['node_id'];
        }
        return $_userList;
    }

    /** Added by Gaurav
     * Added on 8 june
     * For get all statements
     * @param null
     * @return statementArray
     */

    public function fetchAllStatements($data = array()) {

        $statementTypeArr = array('Statement', 'image', 'attachment', 'System Message');
        if(isset($data['dialogueNodeId']) && (int) $data['dialogueNodeId']>0){
            $dialgoueArr = array();
            array_push($dialgoueArr, trim($data['dialogueNodeId']));
            $dialgoueArr = array_unique($dialgoueArr);
            $statementArr['statement'] = $this->getfilterStatements($dialgoueArr, $data['timestamp'], $statementTypeArr, $data['login_userId']);
        }else{
            $dialgoueArr1 = $this->fetchAllDialogue($data);
            $dialgoueArr = array_unique(array_column($dialgoueArr1, 'dialogue_node_id'));

            $finalDialogueArr = array();

            foreach($dialgoueArr as $dialogueNodeId){
               // $finalDialogueArr = $finalDialogueArr + $this->getfilterStatements(array(trim($dialogueNodeId)), $data['timestamp'], $statementTypeArr, $data['login_userId']);
               $finalDialogueArr1 = $this->getfilterStatements(array(trim($dialogueNodeId)), $data['timestamp'], $statementTypeArr, $data['login_userId']);
               $finalDialogueArr =  array_merge($finalDialogueArr, $finalDialogueArr1);

            }
            $statementArr['statement'] = $finalDialogueArr;
        }

        $statementArr['dialogue']  = $dialgoueArr;
        return $statementArr;
    }

    /** Added by Gaurav
     * Added on 9 june
     * Get all dialogues of users
     * @param type $data
     * @return type
     */

    public function fetchAllDialogue($data = array()) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nxy' => 'node-x-y-relation'), 'nxy.node_x_id = ni.node_id', array('dialogue_node_id' => 'node_y_id'));
        $select->where->equalTo('nip.value', $data['login_userId']);
        $select->where->equalTo('ni.node_class_id', INDIVIDUAL_HISTORY_CLASS_ID);
        $select->where->AND->equalTo('nip.node_class_property_id', INDIVIDUAL_ACTORID_PROP_ID);

        //return $select->getSqlstring();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $dialgoueArr = $resultObj->initialize($result)->toArray();

        return $dialgoueArr;
    }

    /** Get Statements of dialogue
     * Added by Gaurav
     * Added on 8 june
     * @param type $dialgoueArr Dialogues node id array
     * @param type $timestamp
     * @return array statement array
    */
    function getfilterStatements($dialgoueArr = array(), $timestamp = '', $statementTypeArr = array(), $loggedInUser) {

        //return "200000";
        $entryExitArr = array();
        // VARIABLES FOR CONDITIONS IN QUERY
        $_addedChk = $_deleteChk = $_equalChk = 0;
        if(!empty($loggedInUser)){
            // GET ADDED/REMOVED TIME OF USER IN ARRAY FORMAT
            $entryExitArr = $this->getParticipantEntryExitTimestampNew($dialgoueArr, $loggedInUser);
            // IF USER ADDED AND REMOVED ARRAY IS NOT EQUAL
            if(count($entryExitArr['added_on']) != count($entryExitArr['deleted_on']))
            {
                $_addedChk = 1;
            } else {
                $_equalChk = 1;
            }
            // IF USER IS DELETED ATLEAST ONCE
            if(count($entryExitArr['deleted_on']) > 0){
                $_deleteChk = 1;
            }
        }


        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxy' => 'node-x-y-relation'));
        $select->quantifier('DISTINCT');
        //$select->columns(array('dialogue_node_id' => 'node_y_id', 'statement_node_id' => 'node_x_id'));
        $select->columns(array('dialogue_node_id' => 'node_y_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxy.node_x_id', array('node_statusType'=>'status'));

        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('node_instance_id'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id', array('statement_type' => 'value'));
        $select->join(array('nip3' => 'node-instance-property'), 'nip3.node_instance_id = nip.node_instance_id', array('node_instance_property_id', 'statement'=>'value', 'statement_node_id'=>'node_instance_property_id'));
        $select->join(array('nip4' => 'node-instance-property'), 'nip4.node_instance_id = nip.node_instance_id', array('timestamp'=>'value'));
        $select->join(array('nip5' => 'node-instance-property'), 'nip5.node_instance_id = nip.node_instance_id', array('update_status'=>'value'));
        $select->join(array('nip6' => 'node-instance-property'), 'nip6.node_instance_id = nip.node_instance_id', array('actor.author'=>'value'));


        $select->where->IN('nxy.node_y_id', $dialgoueArr);

        $select->where->AND->equalTo('ni.status', "1");
        if((int)$timestamp>0){

            $select->where->AND->equalTo('nip.node_class_property_id', STATEMENT_TIMESTAMP_ID);
            $select->where->AND->greaterThanOrEqualTo('nip.value', $timestamp);
        }

        // CONDITIONS ON QUERY FOR MULTIPLE ADD/REMOVE
        if(count($entryExitArr)){
            //$sql .= " AND `nip2`.`node_class_property_id`='$statement_timestamp_id'";
            // IF USER ADDED AND REMOVED SAME NO OF TIMES - THAN ONLY BETWEEN WILL BE ADDED IN QUERY

            if($_equalChk){
                $strLiteral = '';
                if (count($entryExitArr['deleted_on']) > 0) {
                    for ($i = 0; $i < count($entryExitArr['deleted_on']); $i++) {

                        $strLiteral .= " nip.value BETWEEN '".$entryExitArr['added_on'][$i]."' AND '".$entryExitArr['deleted_on'][$i]. "' OR ";
                    }
                }
                $strLiteral = substr($strLiteral, 0, -4);  //remove the final ' OR' from string
                $select->where->nest->literal($strLiteral)->unnest;


            } elseif($_addedChk && $_deleteChk) { // IF USER IS ADD/REMOVE DIFF NO OF TIMES - BOTH BETWEEN AND GEATER THAN WILL ADD IN QUERY

                $strLiteral = '';
                if (count($entryExitArr['deleted_on']) > 0) {
                    for ($i = 0; $i < count($entryExitArr['deleted_on']); $i++) {

                        $strLiteral .= " nip.value BETWEEN '" . $entryExitArr['added_on'][$i] . "' AND '" . $entryExitArr['deleted_on'][$i] . "' OR ";
                    }
                    //$strLiteral = substr($strLiteral, 0, -4);  //remove the final ' OR' from string
                    $strLiteral .= " nip.value >= '".$entryExitArr['added_on'][$i]."' ";
                    $select->where->nest->literal($strLiteral)->unnest;
                }

            } elseif(!$_deleteChk && $_addedChk) {  // IF USER IS ONLY ADDED - THAN GREATER THAN WILL BE USE IN QUERY
                $select->where->AND->greaterThanOrEqualTo('nip.value', $entryExitArr['added_on'][0]);

            } elseif(isset($entryExitArr['deleted_on'])) {
                $select->where->AND->lessThanOrEqualTo('nip.value', $entryExitArr['added_on'][0]);

            }
        }
        //return array($_addedChk, $_deleteChk);
        $select->where->AND->IN('nip2.value', $statementTypeArr);
        $select->where->AND->equalTo('nip2.node_class_property_id', STATEMENT_TYPE_ID);
        $select->where->AND->equalTo('nip3.node_class_property_id', STATEMENT_TITLE_ID);
        $select->where->AND->equalTo('nip4.node_class_property_id', STATEMENT_TIMESTAMP_ID);
        $select->where->AND->equalTo('nip5.node_class_property_id', STATEMENT_UPDATED_STATUS);
        $select->where->AND->equalTo('nip6.node_class_property_id', STATEMENT_ACTOR_AUTHOR);


        //return   array($select->getSqlstring());
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $statementArr = $resultObj->initialize($result)->toArray();
        return $statementArr;
    }

    /**Get user node id
     * Added by Gaurav
     * Added on 8 june
     */
    public function getUserInstanceNodeId($ins_id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(array());
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nip.value', array('node_instance_id'));
        $select->where->equalTo('nip.node_instance_id', $ins_id);
        $select->where->AND->equalTo('nip.node_class_property_id', STATEMENT_ACTOR_AUTHOR);
       // return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $InstanceID = $resultObj->initialize($result)->toArray();
        return $InstanceID[0]['node_instance_id'];
    }

    /**Added by Gaurav
     * Added on 12 june
     * Get Action info
     * @param type $actor_ids
     * @param type $actorProeprtyIds
     * @return type
     */
    public function getActorInfo($actor_ids, $actorProeprtyIds, $header_filter = ''){
        $actor_info = array();
        $sqlc = new Sql($this->adapter);
        $select = $sqlc->select();
        $select->quantifier('DISTINCT');
        $select->columns(array('actor_id' => 'node_y_id'));
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_y_id AND ni.node_class_id = '.INDIVIDUAL_CLASS_ID), array());
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('actor_name' => new Predicate\Expression('GROUP_CONCAT(nip.value)'), 'first_last_name_property_id' => new Predicate\Expression('GROUP_CONCAT(nip.node_class_property_id)')));
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr.node_x_id AND ni1.node_class_id = '.ACCOUNT_CLASS_ID), array());
        $select->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = ni1.node_instance_id AND nip1.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('actor_email' => 'value'));
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = nip.node_instance_id AND nip2.node_class_property_id = '.INDIVIDUAL_PROFILE_IMAGE), array('profile_image' => 'value'), 'left');
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = ni1.node_instance_id AND nip3.node_class_property_id = '.ACCOUNT_STATUS_ID), array('account_status' => 'value'), 'left');
        $select->where->IN('nxyr.node_y_id', $actor_ids);
        $select->where->IN('nip.node_class_property_id', $actorProeprtyIds);
        if($header_filter['filter_title'] == 'email' && $header_filter['filter_key'] == 'equalto'){
            $select->where->AND->equalTo('nip1.value', $header_filter['filter_value']);
        }elseif($header_filter['filter_title'] == 'email' && $header_filter['filter_key'] == 'contains'){
            $select->where->AND->LIKE('nip1.value', "%".$header_filter['filter_value']."%");
        }
        $select->group(array('nxyr.node_y_id'));
        if($header_filter['filter_title'] == 'email' && $header_filter['filter_key'] == 'order_by'){
            $select->order('nip1.value '.$header_filter['filter_value']);
        }
        $statement                  = $sqlc->prepareStatementForSqlObject($select);
        $result                     = $statement->execute();
        $resultObj                  = new ResultSet();
        $actor_info = $resultObj->initialize($result)->toArray();
        return $actor_info;
    }

    /**
     * Created By: Divya Rajput
     * Date: 14-06-2017
     * param @$dialogue_node_id array
     * return dialogue node id order on behalf of latest statement
     */
    public function getdailogueSequenceByLatestStatement($dialogue_node_ids, $_data = array()){
        $sqlt = new Sql($this->adapter);
        $select = $sqlt->select();
        $select->quantifier('DISTINCT');
        $select->columns(array('dialogue_node_id' => 'node_y_id', 'statement_timestamp' => new Predicate\Expression('MAX(nip.value)')));
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.STATEMENT_CLASS_ID), array());
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.STATEMENT_TIMESTAMP_ID), array());
        $select->where->IN('nxyr.node_y_id', $dialogue_node_ids);
        /*Added for api
         *By:- Gaurav
         * 5 june 2017
         */
        if(isset($_data['timestamp']) && $_data['timestamp']!=''){
            $select->where->AND->greaterThanOrEqualTo('nip.value', $_data['timestamp']);
        }
        /*End*/
        $select->group('nxyr.node_y_id');
        $select->order(new Predicate\Expression('MAX(nip.value) DESC'));

        //return $select->getSqlString();
        $statement              = $sqlt->prepareStatementForSqlObject($select);
        $result                 = $statement->execute();
        $resultObj              = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }


    /**Delete notification instance
     * Created By: Gaurav
     * Date: 16-06-2017
     * @param type $dialogueRes
     * @param type $login_user_id
     */
    public function deleteNotificationUserWise($dialogueRes, $login_user_id){
        if(count($dialogueRes)) {
            $sqlt   = new Sql($this->adapter);
            $select = $sqlt->select();
            $select->columns(array('node_instance_id' => 'node_instance_id'));
            $select->from(array('nip' => 'node-instance-property'));
            $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array('node_instance_id' => 'node_instance_id'));
            $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_instance_id = nip1.node_instance_id AND ni.node_class_id = ' . NOTIFICATION_CLASS_ID), array('notification_node_id' => 'node_id'));
            $select->where->equalTo('nip.node_class_property_id', NOTIFICATION_ACTOR_PID);
            $select->where->AND->equalTo('nip.value', $login_user_id);
            $select->where->AND->equalTo('nip1.node_class_property_id', NOTIFICATION_DIALOG_PID);
            $select->where->AND->IN('nip1.value', $dialogueRes);

            $select->getSqlString();
            $statement = $sqlt->prepareStatementForSqlObject($select);
            $result    = $statement->execute();
            $resultObj = new ResultSet();
            $res       = $resultObj->initialize($result)->toArray();
            if (count($res) > 0) {
                $this->deleteNotificationInst($res);
            }
        }

    }
    /**instance delete of notification instance
     * Created By: Gaurav
     * Date: 16-06-2017
     * @param type $res
     */
    public function deleteNotificationInst($res=array()){

        $notificationNodeIds     = array_unique(array_column($res, 'notification_node_id'));
        $notificationInsIds = array_unique(array_column($res, 'node_instance_id'));

        if(count($notificationInsIds)>0){
            $this->commonDeleteMethod('node-instance-property', 'node_instance_id', $notificationInsIds, 'in');//Delete instance property data
            $this->commonDeleteMethod('node-instance', 'node_instance_id', $notificationInsIds, 'in');//Delete all instance

        }
        if(count($notificationNodeIds)>0){
            $this->commonDeleteMethod('node-x-y-relation', 'node_x_id', $notificationNodeIds, 'in');//Delete x-y relation of node id
        }

    }

    /**
     * Created by: Gaurav
     * Date: 16-June-17
     * Function to get participant add and remove history timestamp, based on Individual History class
     * @param $dialogue_node_id
     * @param $actor_id
     * @return array
     */
    public function getParticipantEntryExitTimestampNew($dialogue_node_id=array(), $actor_id)
    {
        $indHistoryClassId = INDIVIDUAL_HISTORY_CLASS_ID;
        $indActorPropId    = INDIVIDUAL_ACTORID_PROP_ID;
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id',array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip2.node_instance_id', array());
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array());
        $select->where->IN('xy.node_y_id', $dialogue_node_id);
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
            if($value['node_class_property_id'] == INDIVIDUAL_ACTORID_PROP_ID) {
                $oldNid = $value['node_instance_id'];
                $mainArr[$oldNid]['actor_id'] = $oldNid;
            }
            if($value['node_class_property_id'] == INDIVIDUAL_TIMESTAMP_PROP_ID && $oldNid == $value['node_instance_id']) {
                $mainArr[$oldNid]['timestamp'] = $value['value'];
            }
            if($value['node_class_property_id'] == INDIVIDUAL_STATUS_PROP_ID && $oldNid == $value['node_instance_id']) {
                $mainArr[$oldNid]['status'] = $value['value'];
                if($value['value']==1) {
                    $entryExitArr['added_on'][] = $mainArr[$oldNid]['timestamp'];
                } else {
                    $entryExitArr['deleted_on'][] = $mainArr[$oldNid]['timestamp'];
                }
            }
        }
        return array_filter($entryExitArr); // remove blank or null key value
    }
    /**Added by Gaurav
     * Added on 04 July 2017
     * Get User profile pics
     * @param type $userImage
     * @param type $type
     * @return string
     */
    function getProfileUserImage($userImage = '', $type) {

        $profileImage = 0;//BASE_URL . "public/img/user.png";
        switch ($type) {
            case 'thumbnail':

                $filePath = BASE_URL . "public/nodeZimg/" . $userImage;;
                if (trim($userImage) != '' && file_exists("public/nodeZimg/" . $userImage)) {
                    $profileImage = $filePath;
                }
                break;
            case 'top-right-corner':

                $filePath = BASE_URL . "public/nodeZimg/" . $userImage;
                if (trim($userImage) != '' && file_exists("public/nodeZimg/" . $userImage)) {
                    $profileImage = $filePath;
                }
                break;
            case 'guest':

                $profileImage = BASE_URL . "public/img/guest-user.jpg";
                break;
        }
        return $profileImage;
    }

    /**
     * Added by Divya Rajput
     * Added on 12 July 2017
     * To fetch Course associated users
     * @param $course_node_ids
     * @return array
     */
    public function fetchCourseUserIds($course_node_ids){
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->quantifier('DISTINCT');
        $select->columns(array('course_node_id' => 'node_y_id'));
        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.node_class_property_id = '.INDIVIDUAL_ACTORID_PROP_ID),array('user_ids' => 'value'));
        $select->where->IN('nxyr.node_y_id', $course_node_ids);
        //return  $select->getSqlstring();
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $instanceAry = $resultObj->initialize($result)->toArray();
    }

    /**
     * Added by Divya Rajput
     * Added on 12 July 2017
     * Formating Array For Course User
     * @param $course_node_ids
     * @return array
     */
    public function formattedCourseUserData($course_node_ids){
        $course_user_data = $this->fetchCourseUserIds($course_node_ids);
        $returnArray = array();
        foreach($course_user_data as $data){
            $returnArray[$data['course_node_id']][] = $data['user_ids'];
        }
        return $returnArray;
    }

    /**
     * Added by Divya Rajput
     * Added on 12 July 2017
     * Formating Array For Course Production
     * @param $course_node_ids
     * @return array
     */
    public function formattedCourseProductionData($course_node_ids, $login_user_id){
        $proData = $this->fetchProductionData($course_node_ids, $login_user_id);
        $course_node_id_array = array_column($proData, 'course_node_id');
        $productionData = array_combine($course_node_id_array, $proData);
        return $productionData;
    }

    /**
     * Added by Divya Rajput
     * Added on 12 July 2017
     * To fetch Course Associated Productions
     * @param $course_node_ids
     * @return array
     */
    public function fetchProductionData($course_node_ids, $login_user_id){
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->quantifier('DISTINCT');
        $select->columns(array('course_node_id' => 'node_y_id'));
        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.PRODUCTION_DETAILS_CLASS_ID), array('total_production' => new Predicate\Expression('COUNT(ni.node_instance_id)')), 'LEFT');
        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = ni.node_id', array(), 'LEFT');
        $select->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array(), 'LEFT');
        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni1.node_instance_id AND nip.node_class_property_id = '.INDIVIDUAL_ACTORID_PROP_ID), array(), 'LEFT');
        $select->where->IN('nxyr.node_y_id', $course_node_ids);
        $select->where->AND->IsNotNull(array('nip.value'));
        $select->where('FIND_IN_SET(' . $login_user_id . ',trim(nip.value))');
        $select->group('ni.node_instance_id');
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /**
     * Added by Divya Rajput
     * Added on 12 August 2017
     * To fetch flash notification Data of particular ID
     * @param $login_user_id,
     * @param $status
     * @param $notificationId
     * @return array
     */
    public function fetchFlashNotificationData($login_user_id, $status=0, $notificationId = ''){
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->quantifier('DISTINCT');
        $select->columns(array('node_instance_id'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array('node_id'));
        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array('course_node_id' => 'node_y_id'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = nip.node_instance_id', array());
        $select->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = nip.node_instance_id AND nip2.node_class_property_id = '.FLASH_NOTIFICATION_NOTIFICATION_MESSAGE), array('notification_message' => 'value'));
        $select->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = nip.node_instance_id AND nip3.node_class_property_id = '.FLASH_NOTIFICATION_ADMIN_USER_ID), array('admin_user_id' => 'value'));
        $select->join(array('nip4' => 'node-instance-property'), new Predicate\Expression('nip4.node_instance_id = nip.node_instance_id AND nip4.node_class_property_id = '.FLASH_NOTIFICATION_NOTIFICATION_STATUS), array('unread_status' => 'value'));
        $select->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('nip5.node_instance_id = nip.node_instance_id AND nip5.node_class_property_id = '.FLASH_NOTIFICATION_DIALOGUE_NODEID), array('dialogue_node_id' => 'value'), 'left');
        $select->join(array('nip6' => 'node-instance-property'), new Predicate\Expression('nip6.node_instance_id = nip.node_instance_id AND nip6.node_class_property_id = '.FLASH_NOTIFICATION_PRODUCTION_NODEID), array('production_node_id' => 'value'), 'left');
        $select->join(array('nip7' => 'node-instance-property'), new Predicate\Expression('nip7.node_instance_id = nip.node_instance_id AND nip7.node_class_property_id = '.FLASH_NOTIFICATION_TYPE), array('notification_type' => 'value'), 'left');
        $select->where->equalTo('nip.value', $login_user_id);
        $select->where->AND->equalTo('nip.node_class_property_id', FLASH_NOTIFICATION_ACTIVE_USER_ID);
        if(!$status && $notificationId == ''){
            $select->where->equalTo('nip4.value', $status);
            $select->where->AND->equalTo('nip4.node_class_property_id', FLASH_NOTIFICATION_NOTIFICATION_STATUS);
        }
        if($status && $notificationId != ''){
            $select->where->lessThan('ni.node_id', trim($notificationId));
        }
        $select->order('nip.node_instance_id DESC');
        if($status){
            $select->limit(FLASH_NOTIFICATION_COUNT + 1);
        }

        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /**
     * Added by Divya Rajput
     * Added on 12 August 2017
     * To update flash notification Data of particular instance ID
     * @param $instance_id
     */
    public function updateNotificationStatus($login_user_id = '', $instance_id = ''){
        if(is_array($instance_id)){
            $sql = new Sql($this->adapter);
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set(array('value' => 1));
            $query->where->IN('node_instance_id', $instance_id);
            $query->where->AND->equalTo('node_class_property_id', FLASH_NOTIFICATION_NOTIFICATION_STATUS);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }elseif(trim($instance_id) != ''){
            $sql = new Sql($this->adapter);
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set(array('value' => 2));
            $query->where->equalTo('node_instance_id', $instance_id);
            $query->where->AND->equalTo('node_class_property_id', FLASH_NOTIFICATION_NOTIFICATION_STATUS);
            $statement = $sql->prepareStatementForSqlObject($query);
            $result = $statement->execute();
        }else{
            $selectSql = new Sql($this->adapter);
            $select = $selectSql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->quantifier('DISTINCT');
            $select->columns(array('node_instance_property_id'));
            $select->JOIN(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id', array());
            $select->where->equalTo('nip.node_class_property_id', FLASH_NOTIFICATION_NOTIFICATION_STATUS);
            $select->where->AND->equalTo('nip.value', 0);
            $select->where->AND->equalTo('nip2.value', $login_user_id);
            $select->where->AND->equalTo('nip2.node_class_property_id', FLASH_NOTIFICATION_ACTIVE_USER_ID);
            $statement     =   $selectSql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            $result = $resultObj->initialize($result)->toArray();
            $node_instance_property_id = array_column($result, 'node_instance_property_id');
            if(count($node_instance_property_id)){
                $sql = new Sql($this->adapter);
                $query = $sql->update();
                $query->table('node-instance-property');
                $query->set(array('value' => 1));
                $query->where->IN('node_instance_property_id', $node_instance_property_id);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result = $statement->execute();
            }
        }
    }
    
    public function checkNotificationByUserID($node_id='', $login_user_id=''){
        $sql        = new Sql($this->adapter);
        $select     = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->quantifier('DISTINCT');
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->where->equalTo('ni.node_id', $node_id);
        $select->where->AND->equalTo('nip.value', $login_user_id);
        $select->where->AND->equalTo('nip.node_class_property_id', FLASH_NOTIFICATION_ACTIVE_USER_ID);
        $statement  = $sql->prepareStatementForSqlObject($select);
        $result     = $statement->execute();
        $resultObj  = new ResultSet();
        $insArr = $resultObj->initialize($result)->toArray();
        return $insArr[0]['node_instance_id'];
    }


    /**/
    public function getRegisteredUserInfo($user_node_id, $getColumnValuePropID){
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->quantifier('DISTINCT');
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array('node_class_property_id', 'value'));
        $select->where->equalTo('nip.value', $user_node_id);
        $select->where->AND->equalTo('nip.node_class_property_id', USER_REG_USERID_PID);
        $select->where->AND->IN('nip1.node_class_property_id', $getColumnValuePropID);
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /*
     * Added by Gaurav
     * Added on 29 Aug 2017
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
   /*
    * Added by Gaurav
    * Added on 29 Aug 2017
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
    
    /* Build course data
     * Added by Gaurav
     * Added on 29 Aug 2017
     * @param type $course_data
     * @param type $dashborad_type
     * @param type $search_on_dashboard
     * @param type $header_filter
     * @param type $login_user_id
     * @return string
     */
     public function courseData($course_data, $dashborad_type, $search_on_dashboard = '', $header_filter = array(), $login_user_id = '') {
        
        $course_list = array();
        $d_search = array();
        $_loginUserId = $_SESSION[PREFIX . 'user_info']['node_id'];
        if(1){
            if(count($course_data)){
                if ($dashborad_type == 'bycourse') {
                    /*$sorted_course = $dialogue_order = array();
                    if($header_filter['filter_key'] != 'order_by'){
                        $dialogue_order = array_column($course_data['dialogue_order_data'], 'dialogue_node_id');
                    }
                    $count = count($dialogue_order);*/

                    if($search_on_dashboard != ""){
                        $actor_info = $this->getActorFormatData($course_data['actor_info']);
                        $actor_id_array = array_column($actor_info, 'actor_id');
                        $actor_array = array_combine($actor_id_array, $actor_info);
                    }

                    //getting notification Count for a dialogue
                    $dialogueNotificationArr = array();
                    if(count($course_data['notificationDataArray'])>0)
                    {
                        foreach ($course_data['notificationDataArray'] as $notification_value) {
                            $temp[$notification_value['dialogue_node_id']][] = $notification_value['dialogue_node_id'];
                            $dialogueNotificationArr[$notification_value['dialogue_node_id']] = count($temp[$notification_value['dialogue_node_id']]);
                        }
                    }


                    foreach ($course_data['course_dialogue_data'] as $course_value) {
                        $courseKey = " ".$course_value['course_node_id'];

                        if($search_on_dashboard != ""){
                            $actor_data = $actor_array[$course_value['actor_value']];
                            $fname = ($actor_data['first_name']) ? $actor_data['first_name'] : "";
                            $lname = ($actor_data['last_name']) ? $actor_data['last_name'] : "";
                            $name = $fname." ".$lname;

                            if( (stripos(html_entity_decode($course_value['course_title']), $search_on_dashboard) !== false) || (stripos(html_entity_decode($course_value['dialogue_title']), $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($actor_data['actor_email'], $search_on_dashboard) !== false)){
                                $d_search[$courseKey] = $course_value['course_node_id'];
                            }

                            if(($course_value['actor_value'] == $login_user_id) || ($course_value['course_created_by'] == $login_user_id)){
                                $arrIds[] = $courseKey;
                            }
                        }

                        $course_list[$courseKey]['course'] = html_entity_decode($course_value['course_title']);
                        // change date format Y M d H:i:s to m/d/y
                        $course_list[$courseKey]['date'] = date("m/d/y", strtotime($course_value['course_updation_timestamp']));
                        // statue and domain are not required for listing
                        $course_list[$courseKey]['status'] = $course_value['course_status'];
                        //$course_list[$courseKey]['domain'] = 'Prospus';
                        $course_list[$courseKey]['course_node_id'] = $courseKey;
                        $course_list[$courseKey]['course_instance_id'] = $course_value['course_instance_id'];
                        //$course_list[$courseKey]['dialogue_node_id'] = $course_value['dialogue_node_id'];
                        $course_list[$courseKey]['created_by'] = $course_value['course_created_by'];
                        if(trim($course_value['dialogue_node_id']) != ""){
                            $course_list[$courseKey]['dialogue_count'][$course_value['dialogue_node_id']][] = $course_value['actor_value'];
                        }else{
                            $course_list[$courseKey]['dialogue_count'] = array();
                        }

                        $course_list[$courseKey]['actors'] = array();
                        //code added by gaurav on 13 sept 2017 for guest users
                        //cid = course node id
                        //did = dialogue node id
                        if(isset($_REQUEST['cid']) && isset($_REQUEST['did']) && ($course_value['course_node_id'] == $_REQUEST['cid'])){
                            $paramsDialogue = array();
                            $paramsDialogue['user_instance_node_id'] = $_loginUserId;//user instance node id
                            $paramsDialogue['course_instance_id']    = $course_value['course_instance_id'];
                            $dialogueData = $this->getDialogueData($paramsDialogue);
                            $course_list[$courseKey]['dialogue'] =  $dialogueData;
                           
                        }else if(isset($_REQUEST['cid']) && isset($_REQUEST['pid']) && ($course_value['course_node_id'] == $_REQUEST['cid'])){
                            $paramsDialogue = array();
                            $paramsDialogue['userID']                   = $_loginUserId;//user instance node id
                            $paramsDialogue['course_instance_id']       = $course_value['course_instance_id'];
                            $paramsDialogue['status']                   = 'Published';
                            $productionData = $this->getDashboardTable()->getProductionListOfCourse($paramsDialogue);
                            $course_list[$courseKey]['production'] =  $productionData;
                        }

                        if(!isset($course_list[$courseKey]['dialogue']))
                        $course_list[$courseKey]['dialogue'] = array();
                        $course_list[$courseKey]['events'] = array();
                        $course_list[$courseKey]['resources'] = array();
                        if(!isset($course_list[$courseKey]['production']))
                        $course_list[$courseKey]['production'] = array();
                        $course_list[$courseKey]['user_ids'] = $course_data['course_user_data'][$course_value['course_node_id']];

                        /*if(count($dialogue_order)){
                            $key = array_search($course_value['dialogue_node_id'], $dialogue_order);
                            if(!isset($sorted_course[$courseKey]) && $course_value['dialogue_node_id'] == ''){
                                $sorted_course[$courseKey] = ++$count;
                            }else{
                                if(!isset($sorted_course[$courseKey])){
                                    $sorted_course[$courseKey] = $key;
                                }else{
                                    if($sorted_course[$courseKey] > $key && $key !== false){
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
                    //For get Notification, If notification, has_received_notification : 1 else 0
                    $courser_node_data_id = array_unique(array_column($course_list, 'course_node_id'));
                    $resourceData = $this->fetchCourseResource($login_user_id, $courser_node_data_id);

                    foreach($course_list as $key => $list){
                        if(trim(strtolower($list['status'])) == 'draft' && trim($list['created_by']) != trim($login_user_id)){
                            unset($course_list[$key]);
                        }else{
                            $dialogue_assoc_user = (isset($list['dialogue_count']) && count($list['dialogue_count'])) ? array_filter($list['dialogue_count']) : array();
                            $dialogue_user_list = array_filter($dialogue_assoc_user, function($dialogueKey) use($dialogue_assoc_user, $login_user_id) {
                                return in_array($login_user_id, $dialogue_assoc_user[$dialogueKey]) ? $dialogueKey : '';
                            },  ARRAY_FILTER_USE_KEY);
                            $dialogue_ids = array_keys($dialogue_user_list);


                            $resource_list = array_filter($resourceData, function($resourceKey) use($resourceData, $dialogue_ids) {
                                return in_array($resourceData[$resourceKey]['dialogue_node_id'], $dialogue_ids) ? $resourceKey : '';
                            },  ARRAY_FILTER_USE_KEY);

                            if( isset($header_filter['filter_key']) && $header_filter['filter_key'] === 'course_type' && $header_filter['filter_value'] === 'dialogue' && count($dialogue_ids) == 0 ){
                                unset($course_list[$key]);
                                continue;
                            }

                            if( isset($header_filter['filter_key']) && $header_filter['filter_key'] === 'course_type' && $header_filter['filter_value'] === 'production' && (int) $course_data['course_production_data'][trim($key)]['total_production'] === 0 ){
                                unset($course_list[$key]);
                                continue;
                            }

                            $course_list[$key]['has_received_notification'] = 0;
                            $notificationCount = 0;
                            if(count($dialogue_ids)){
                                $notificationCount = array_sum(array_intersect_key($dialogueNotificationArr, array_flip($dialogue_ids)));
                                $course_list[$key]['has_received_notification'] = $notificationCount;
                            }
                            $course_list[$key]['count'] = array(
                                                                'course' => $notificationCount,
                                                                'notification' => 0,
                                                                'actors' => count($list['user_ids']),
                                                                'dialogues' => count($dialogue_ids),
                                                                'events' => 0,
                                                                'resources' => count($resource_list),
                                                                'production' => isset($course_data['course_production_data'][trim($key)]) ? (int) $course_data['course_production_data'][trim($key)]['total_production'] : 0
                                                            );
                        }
                        unset($course_list[$key]['dialogue_count']);
                    }

                    if($search_on_dashboard != ""){
                        $course_list = array_filter($course_list, function($key) use($arrIds) {
                            return in_array($key, $arrIds) ? $key : '';
                        },  ARRAY_FILTER_USE_KEY);
                    }
                } elseif($dashborad_type == 'bydialogue'){
                    $sorted_course = $dialogue_order = array();
                    $dialogue_node_id_data = array_column($course_data['dialogue_order_data'], 'dialogue_node_id');
                    if($header_filter['filter_key'] != 'order_by'){
                        $dialogue_order = $dialogue_node_id_data;
                    }
                    $dialogue_notification_count_array = array();
                    if(count($dialogue_node_id_data)){
                        $dialogue_notification_array = $this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_node_id_data, $login_user_id, '', 'IN');
                        $dialogue_notification_count_array = array_count_values(array_column($dialogue_notification_array, 'dialogue_node_id'));
                    }

                    $actor_info = $this->getActorFormatData($course_data['actor_info']);
                    $actor_id_array = array_column($actor_info, 'actor_id');
                    $actor_array = array_combine($actor_id_array, $actor_info);
                    $arrIds = array();
                    foreach ($course_data['course_dialogue_data'] as $dialogue_value) {
                        if(trim($dialogue_value['actor_value']) !=""){
                            $dialogueKey = " ".$dialogue_value['dialogue_node_id'];
                            if($dialogue_value['actor_value'] == $login_user_id){
                                $arrIds[] = $dialogueKey;
                            }
                            $course_list[$dialogueKey]['dialogue'] = html_entity_decode($dialogue_value['dialogue_title']);
                            $course_list[$dialogueKey]['dialogue_title'] = html_entity_decode($dialogue_value['dialogue_title']); //will remove later either we will use dialogue or dialogue_title
                            $course_list[$dialogueKey]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                            $course_list[$dialogueKey]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                            $course_list[$dialogueKey]['course_node_id'] = $dialogue_value['course_node_id'];
                            $course_list[$dialogueKey]['course_instance_id'] = $dialogue_value['course_instance_id'];
                            $course_list[$dialogueKey]['course'] = html_entity_decode($dialogue_value['course_title']);
                            $course_list[$dialogueKey]['date'] = date("m/d/y", strtotime($dialogue_value['dialogue_timestamp']));
                            $course_list[$dialogueKey]['dialogue_created_by'] = $dialogue_value['dialogue_created_by'];
                            $course_list[$dialogueKey]['dialogueStatus'] = (trim(strtolower($dialogue_value['dialogueStatus'])) == 'published') ? 1 : 0;
                            $course_list[$dialogueKey]['notificationCount'] = isset($dialogue_notification_count_array[$dialogue_value['dialogue_node_id']]) ? $dialogue_notification_count_array[$dialogue_value['dialogue_node_id']] : 0;
                            $course_list[$dialogueKey]['chat_text'] = '';
                            $course_list[$dialogueKey]['letter_text'] = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
                            $course_list[$dialogueKey]['status'] = $dialogue_value['course_status'];
                            $course_list[$dialogueKey]['has_received_notification'] = isset($dialogue_notification_count_array[$dialogue_value['dialogue_node_id']]) ? $dialogue_notification_count_array[$dialogue_value['dialogue_node_id']] : 0;
                            $course_list[$dialogueKey]['course_created_by'] = $dialogue_value['course_created_by'];

                            $actor_data = $actor_array[$dialogue_value['actor_value']];
                            $fname = ($actor_data['first_name']) ? $actor_data['first_name'] : "";
                            $lname = ($actor_data['last_name']) ? $actor_data['last_name'] : "";
                            if(/*$actor_data['first_name'] != '' && $actor_data['last_name'] != "" &&*/ $actor_data['actor_email'] != ''){
                                $email_value = str_replace(' ', '_', strtolower($actor_data['actor_email']));
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['first_name'] = $fname;
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['last_name'] = $lname;
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['full_name'] = $fname." ".$lname;
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['email_address'] = $actor_data['actor_email'];
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['email'] = $actor_data['actor_email']; //will remove later either we will use email not email_address
                                $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['user_id'] = $dialogue_value['actor_value'];

                                //Added by Gaurav
                                //Added on 4 july 2017
                                //$course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['profile_image'] = $this->getProfileUserImage($actor_data['profile_image'], 'thumbnail');

                                if($actor_data['account_status']=='guest'){
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['profile_image'] = $this->getProfileUserImage('', 'guest');
                                }else{
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['profile_image'] = $this->getProfileUserImage($actor_data['profile_image'], 'thumbnail');
                                }

                                if($dialogue_value['has_removed']==1){
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['has_removed'] = 0;
                                    //Commented AS right now, we are showing removed and active user both
                                    /*$email_value = str_replace(' ', '_', strtolower($actor_data['actor_email']));
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['first_name'] = $fname;
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['last_name'] = $lname;
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['full_name'] = $fname." ".$lname;
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['email_address'] = $actor_data['actor_email'];
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['email'] = $actor_data['actor_email'];*/ //will remove later either we will use email or email_address
                                }else if($dialogue_value['has_removed']==2){
                                    //As it's not in use as we are doing unset removed users from list
                                    $course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]['has_removed'] = 1;
                                    //Right now we are showing both type of users either removed or active
                                    //unset($course_list[$dialogueKey]['actors'][$dialogue_value['actor_value']]);
                                }
                            }else{
                                $course_list[$dialogueKey]['actors'] = array();
                            }

                            if($search_on_dashboard != ""){
                                $name = strtolower($fname." ".$lname);

                                if( (stripos(html_entity_decode($dialogue_value['course_title']), $search_on_dashboard) !== false) || (stripos(html_entity_decode($dialogue_value['dialogue_title']), $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($actor_data['actor_email'], $search_on_dashboard) !== false)){
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
                }
                elseif ($dashborad_type == 'byactor') {

                    // added by awdhesh find dialogues of current logged in user, when user is inactive (add, remove, add, remove)
                    $res = array_filter($course_data['course_dialogue_data'], function($key) use($_loginUserId){
                        return  ($key['actor_value'] == $_loginUserId) ? $key['dialogue_node_id'] : '';
                    });
                    $temp = array_column($res, 'has_removed', 'dialogue_node_id');
                    $res2 = array_filter($temp, function($key) {
                        return  ($key == 2) ? $key : '';
                    });
                    $dialoguesLogUserNotActive = array_keys($res2);
                    //print_r(array($dialoguesLogUserNotActive,$temp,$res));die();



                    $actor_info = $this->getActorFormatData($course_data['actor_info']);
                    $actor_id_array = array_column($actor_info, 'actor_id');
                    $actor_array = array_combine($actor_id_array, $actor_info);
                    $sort_col = $key_rows = $dialarray = array();

                    $dialogue_notification_count_array = array();
                    $dialogue_node_id_array = array_column($course_data['course_dialogue_data'], 'dialogue_node_id');
                    $dialogue_notification_array = $this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_node_id_array, $login_user_id, '', 'IN');
                    $dialogue_notification_count_array = array_count_values(array_column($dialogue_notification_array, 'dialogue_node_id'));

                    $dialogue_users = array();

                    foreach ($course_data['course_dialogue_data'] as $dialogue_value){
                        $fname = $lname = $email = "";
                        if($dialogue_value['actor_value'] != ""){
                            $actorNodeId = " ".$dialogue_value['actor_value'];
                            if(isset($actor_array[$dialogue_value['actor_value']])){
                                $fname = ($actor_array[$dialogue_value['actor_value']]['first_name']) ? $actor_array[$dialogue_value['actor_value']]['first_name'] : "";
                                $lname = ($actor_array[$dialogue_value['actor_value']]['last_name']) ? $actor_array[$dialogue_value['actor_value']]['last_name'] : "";
                                $email = $actor_array[$dialogue_value['actor_value']]['actor_email'];
                            }

                            if($search_on_dashboard != ""){
                                $name = $fname." ".$lname;

                                if( (stripos($dialogue_value['course_title'], $search_on_dashboard) !== false) || (stripos($dialogue_value['dialogue_title'], $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($email, $search_on_dashboard) !== false)){
                                    $d_search[$actorNodeId] = $dialogue_value['actor_value'];
                                }
                            }
                            if($_loginUserId == $dialogue_value['actor_value']){
                                $dialarray[] = $dialogue_value['dialogue_node_id'];
                            }
                            if(isset($actor_array[$dialogue_value['actor_value']]))
                            {
                                $course_list[$actorNodeId]['email_address'] = $actor_array[$dialogue_value['actor_value']]['actor_email'];
                                $course_list[$actorNodeId]['first_name'] = $fname;
                                $course_list[$actorNodeId]['last_name'] = $lname;
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['course'] = html_entity_decode($dialogue_value['course_title']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['course_node_id'] = html_entity_decode($dialogue_value['course_node_id']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['course_instance_id'] = html_entity_decode($dialogue_value['course_instance_id']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['status'] = html_entity_decode($dialogue_value['course_status']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['course_created_by'] = html_entity_decode($dialogue_value['course_created_by']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['course_creation_date'] = date("Y M d H:i:s", strtotime($dialogue_value['course_updation_timestamp']));
                                //Added by Gaurav
                                //Added on 4 july 2017
                                $profileImg = $actor_array[$dialogue_value['actor_value']]['profile_image'];
                                //$course_list[$actorNodeId]['profile_image'] = $this->getProfileUserImage($profileImg, 'thumbnail');

                                if($actor_array[$dialogue_value['actor_value']]['account_status']=='guest'){
                                    $course_list[$actorNodeId]['profile_image'] = $this->getProfileUserImage('', 'guest');
                                }else{
                                    $course_list[$actorNodeId]['profile_image'] = $this->getProfileUserImage($profileImg, 'thumbnail');
                                }

                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogue'] = html_entity_decode($dialogue_value['dialogue_title']);
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['chat_text'] = '';
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['letter_text'] = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogueStatus'] = (trim(strtolower($dialogue_value['dialogueStatus'])) == 'published') ? 1 : 0;
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogue_created_by'] = $dialogue_value['dialogue_created_by'];
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['dialogue_creation_date'] = date("Y M d H:i:s", strtotime($dialogue_value['dialogue_timestamp']));
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['notificationCount'] = isset($dialogue_notification_count_array[$dialogue_value['dialogue_node_id']]) ? $dialogue_notification_count_array[$dialogue_value['dialogue_node_id']] : 0;
                                $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['has_received_notification'] = isset($dialogue_notification_count_array[$dialogue_value['dialogue_node_id']]) ? $dialogue_notification_count_array[$dialogue_value['dialogue_node_id']] : 0;
                                $course_list[$actorNodeId]['has_received_notification'] += isset($dialogue_notification_count_array[$dialogue_value['dialogue_node_id']]) ? $dialogue_notification_count_array[$dialogue_value['dialogue_node_id']] : 0;
                                $course_list[$actorNodeId]['actor_node_id'] = $actorNodeId;
                                // added by awdhesh when user is inactive (add, remove, add, remove)
                                if(in_array($dialogue_value['dialogue_node_id'],$dialoguesLogUserNotActive)){
                                    $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['has_removed'] = 1;
                                }
                                else if($dialogue_value['has_removed']==1){
                                    $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['has_removed'] = 0;
                                }
                                else if($dialogue_value['has_removed']==2){
                                    $course_list[$actorNodeId]['dialogue'][" ".$dialogue_value['dialogue_node_id']]['has_removed'] = 1;
                                }
                                 // domain and title are not required for listing
                                //$course_list[$actorNodeId]['domain'] = 'Prospus';
                                //$course_list[$actorNodeId]['title'] = 'Admin';


//                                $fname = strtolower($actor_array[$dialogue_value['actor_value']]['first_name']);
//                                $lname = strtolower($actor_array[$dialogue_value['actor_value']]['last_name']);

//                                if($_loginUserId != $dialogue_value['actor_value']){
//                                    if($header_filter['filter_title'] !== 'email'){
//                                        $sort_col[$actorNodeId] = $fname."_".$lname.$actorNodeId;
//                                        $key_rows[$fname."_".$lname.$actorNodeId] = $actorNodeId;
//                                    }elseif($header_filter['filter_title'] === 'email'){
//                                        $sort_col[$actorNodeId] = strtolower($actor_array[$dialogue_value['actor_value']]['actor_email']).$actorNodeId;
//                                        $key_rows[strtolower($actor_array[$dialogue_value['actor_value']]['actor_email']).$actorNodeId] = $actorNodeId;
//                                    }
//                                }

                                //$actor_data = $actor_array[$dialogue_value['actor_value']];
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['first_name'] = $fname;
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['last_name'] = $lname;
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['full_name'] = $fname." ".$lname;
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['email_address'] = $email;
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['email'] = $email; //will remove later either we will use email not email_address
                                $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['user_id'] = $dialogue_value['actor_value'];
                                if($dialogue_value['has_removed']==1){
                                    $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['has_removed'] = 0;
                                }else if($dialogue_value['has_removed']==2){
                                    $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['has_removed'] = 1;
                                }
                                $userProfileImg = isset($actor_array[$dialogue_value['actor_value']]['profile_image']) ? $actor_array[$dialogue_value['actor_value']]['profile_image'] : '';

                                if($actor_array[$dialogue_value['actor_value']]['account_status']=='guest'){
                                    $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['profile_image'] = $this->getProfileUserImage('', 'guest');
                                }else{
                                    $dialogue_users[" ".$dialogue_value['dialogue_node_id']]['users'][$dialogue_value['actor_value']]['profile_image'] = $this->getProfileUserImage($userProfileImg, 'thumbnail');
                                }

                            }
                        }
                    }

                    unset($course_list[" ".$_loginUserId]);

                    $dialogue_order = array_column($course_data['dialogue_order_data'], 'dialogue_node_id');
                    foreach($course_list as $actorKey => $data){
                        $sort_col = array();
                        $tempDialogue = array();
                        foreach($data['dialogue'] as $dKey => $dialogue){
                            if(in_array(trim($dialogue['dialogue_node_id']), $dialarray)){
                                $tempDialogue[] = trim($dialogue['dialogue_node_id']);
                                $course_list[$actorKey]['dialogue'][$dKey]['users'] = $dialogue_users[$dKey]['users'];
                                $key = array_search(trim($dKey), $dialogue_order);
                                if($key !== false)$sort_col[$key] = " ".$dialogue['dialogue_node_id'];
                            }
                        }
                        if(count($tempDialogue)){
                            if(count($dialogue_order)){
                                ksort($sort_col);
                                $sorted = array_map(function($v) use ($course_list, $actorKey) {
                                    return $course_list[$actorKey]['dialogue'][$v];
                                }, $sort_col);
                                $dialoguList = array_combine($sort_col, $sorted);
                                $course_list[$actorKey]['dialogue'] = $dialoguList;
                            }
                        }else{
                            unset($course_list[$actorKey]);
                        }
                    }

//                    if($header_filter['filter_key'] === 'order_by'){
//                        if(strtolower($header_filter['filter_value']) !== 'desc'){
//                            ksort($key_rows);
//                            $sort_order = SORT_ASC;
//                        }else{
//                            krsort($key_rows);
//                            $sort_order = SORT_DESC;
//                        }
//                    }else{
//                        ksort($key_rows);
//                        $sort_order = SORT_ASC;
//                    }
//                    array_multisort($sort_col, $sort_order, $course_list);
//                    $course_list = array_combine($key_rows, $course_list);
//
                    usort($course_list, function($a,$b){
                            $aname = strtolower($a['first_name'])." ".strtolower($a['last_name']);
                            $bname = strtolower($b['first_name'])." ".strtolower($b['last_name']);
                            if ($aname==$bname) return 0;
                            return ($aname<$bname)? -1 : 1;
                    });
                    $actor_node_ids = array_column($course_list, 'actor_node_id');
                    $course_list = array_combine($actor_node_ids, $course_list);
                    //print_r(array($dialarray,$course_list));
                    foreach($course_list as $key => $courseData){
                        $dialogue_data = array_intersect(array_column($courseData['dialogue'], 'dialogue_node_id'), $dialarray);
                        if(count($dialogue_data)){
                            foreach($dialogue_data as $val){
                                $course_list[$key]['dialogue'][" ".$val] = $courseData['dialogue'][" ".$val];
                            }
                        }else{
                            unset($course_list[$key]);
                        }
                    }
                }
                if($search_on_dashboard != ''){
                    $course_list = array_intersect_key($course_list, $d_search);
                }
            }
        }else{
            /* Remove code later
            if (count($course_data)) {
                $h_search = $d_search = array();
                if ($dashborad_type == 'bycourse') {
                    foreach ($course_data as $course_value) {
                        $courseKey = " ".$course_value['course_node_id'];
                        (strtolower($course_value['value']) == 'title') ? ($course_value['value'] = 'course') : $course_value['value'];
                        (strtolower($course_value['value']) == 'timestamp') ? ($course_value['value'] = 'date') : $course_value['value'];

                        $course_list[$courseKey][$course_value['value']] = ($course_value['value'] == 'date') ? date("Y M d H:i:s", strtotime($course_value['data'])) : $course_value['data'];
                        $course_list[$courseKey]['status'] = $course_value['status'];
                        $course_list[$courseKey]['domain'] = 'Prospus';
                        $course_list[$courseKey]['course_node_id'] = $courseKey;//$course_value['course_node_id'];
                        $course_list[$courseKey]['course_instance_id'] = $course_value['course_instance_id'];

                        $course_list[$courseKey]['actors'] = array();
                        $course_list[$courseKey]['dialogue'] = array();
                        $course_list[$courseKey]['events'] = array();
                        $course_list[$courseKey]['resources'] = array();
                    }
                }
                if ($dashborad_type == 'bydialogue' || $search_on_dashboard != '') {
                    foreach ($course_data as $dialogue_value) {
                        if($dashborad_type == 'bycourse'){
                            $searchKey = $dialogue_value['course_node_id'];
                        }
                        if($dashborad_type == 'bydialogue'){
                            $searchKey = $dialogue_value['dialogue_node_id'];
                            $dialogueKey = " ".$dialogue_value['dialogue_node_id'];
                            //$dialogueKey = $dialogue_value['dialogue_node_id'];
                        }
                        if($dashborad_type == 'byactor'){
                            $searchKey = $dialogue_value['actor_node_id'];
                        }

                        $actor_value = str_replace(' ', '_', strtolower($dialogue_value['actor_value']));
                        if($actor_value == 'first_name'){
                            $fullname[$dialogueKey][$dialogue_value['actor_node_id']] = $dialogue_value['actor_name']." ";
                        }else if($actor_value == 'last_name'){
                            $fullname[$dialogueKey][$dialogue_value['actor_node_id']] .= $dialogue_value['actor_name'];
                        }
                        $name = $fullname[$dialogueKey][$dialogue_value['actor_node_id']];

                        if( (stripos($dialogue_value['data'], $search_on_dashboard) !== false) || (stripos($dialogue_value['dialogue_data'], $search_on_dashboard) !== false) || (stripos($name, $search_on_dashboard) !== false) || (stripos($dialogue_value['actor_email'], $search_on_dashboard) !== false)){
                            $d_search[" ".$searchKey] = $searchKey;
                        }

                        if(isset($header_filter['filter_title']) && $header_filter['filter_title'] === 'dialogue'){
                            $search_in = $dialogue_value['dialogue_data'];
                        }else if(isset($header_filter['filter_title']) && $header_filter['filter_title'] === 'course'){
                            $search_in = $dialogue_value['data'];
                        }

                        if( isset($header_filter['filter_value']) && $header_filter['filter_key'] == 'equalto' && (strtolower($search_in) == strtolower($header_filter['filter_value'])) ){
                            $h_search[" ".$searchKey] = $searchKey;
                        }elseif( isset($header_filter['filter_value']) && $header_filter['filter_key'] == 'contains' && (stripos($search_in, strtolower($header_filter['filter_value'])) !== false) ){
                            $h_search[" ".$searchKey] = $searchKey;
                        }

                        if($dashborad_type == 'bydialogue'){
                            (strtolower($dialogue_value['dialogue_value']) == 'title') ? ($dialogue_value['dialogue_value'] = 'dialogue') : $dialogue_value['dialogue_value'];
                            (strtolower($dialogue_value['dialogue_value']) == 'timestamp') ? ($dialogue_value['dialogue_value'] = 'date') : $dialogue_value['dialogue_value'];
                            (strtolower($dialogue_value['value']) == 'title') ? ($dialogue_value['value'] = 'course') : $dialogue_value['value'];

                            $course_list[$dialogueKey][$dialogue_value['dialogue_value']] = ($dialogue_value['dialogue_value'] == 'date') ? date("Y M d H:i:s", strtotime($dialogue_value['dialogue_data'])) : $dialogue_value['dialogue_data'];
                            //$course_list[$dialogue_value['dialogue_instance_id']]['status'] = $dialogue_value['status'];
                            //$course_list[$dialogue_value['dialogue_instance_id']]['domain'] = 'Prospus';
                            $course_list[$dialogueKey]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                            $course_list[$dialogueKey]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                            $course_list[$dialogueKey]['course_node_id'] = $dialogue_value['course_node_id'];
                            $course_list[$dialogueKey]['course_instance_id'] = $dialogue_value['course_instance_id'];


                            $course_list[$dialogueKey][$dialogue_value['value']] = $dialogue_value['data'];

                            $email_value = str_replace(' ', '_', strtolower($dialogue_value['email_value']));

                            $course_list[$dialogueKey]['actors'][$dialogue_value['actor_node_id']][$actor_value] = $dialogue_value['actor_name'];
                            $course_list[$dialogueKey]['actors'][$dialogue_value['actor_node_id']][$email_value] = $dialogue_value['actor_email'];

                            //$course_list[$dialogue_value['dialogue_instance_id']]['actors'] = array();
                            $course_list[$dialogueKey]['notification'] = array();
                            $course_list[$dialogueKey]['events'] = array();
                            $course_list[$dialogueKey]['resources'] = array();
                            $course_list[$dialogueKey]['production'] = array();
                        }
                    }
                    if($dashborad_type == 'bydialogue' && !isset($header_filter['filter_title'])){
                        $sort_col = array();
                        $key_rows = array();
                        foreach($course_list as $key => $row){
                            if(strpos($row['date'], ' ') === false){
                                $date = $row['date'];
                            }else{
                                $date = strtotime($this->str_replace_limit(' ', '-', $row['date'], 2));
                            }
                            $sort_col[$key] = $date;
                            $key_rows[$date] = $key;
                        }
                        krsort($key_rows);
                        array_multisort($sort_col, SORT_DESC, $course_list);
                        $course_list = array_combine($key_rows, $course_list);
                    }
                }
                if ($dashborad_type == 'byactor') {
                    $_loginUserId = $_SESSION[PREFIX . 'user_info']['node_id'];
                    foreach ($course_data as $dialogue_value) {
                        $actor_value = str_replace(' ', '_', strtolower($dialogue_value['actor_value']));
                        $email_value = str_replace(' ', '_', strtolower($dialogue_value['email_value']));
                        $actorNodeId = " ".$dialogue_value['actor_node_id'];
                        $course_list[$actorNodeId][$actor_value] = $dialogue_value['actor_name'];
                        $course_list[$actorNodeId][$email_value] = $dialogue_value['actor_email'];
                        $course_list[$actorNodeId]['domain'] = 'Prospus';
                        $course_list[$actorNodeId]['title'] = 'Admin';
                        if(strtolower($dialogue_value['dialogue_value']) == 'title'){
                            $dialogue_value['dialogue_value'] = 'dialogue';
                            $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']][$dialogue_value['dialogue_value']] = $dialogue_value['dialogue_data'];
                            //$course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_instance_id']] = [$dialogue_value['dialogue_instance_id']];
                            //$course_list[$actorNodeId]['dialogue']['userlist'][] = $dialogue_value['actor_name'];
                            $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['dialogue_instance_id'] = $dialogue_value['dialogue_instance_id'];
                            $course_list[$actorNodeId]['dialogue'][$dialogue_value['dialogue_node_id']]['dialogue_node_id'] = $dialogue_value['dialogue_node_id'];
                        }
                    }
                    unset($course_list[" ".$_loginUserId]);
                    if($header_filter['filter_title'] != 'email'){
                        $sort_col = array();
                        $key_rows = array();
                        foreach($course_list as $key => $row){
                            $sort_col[$key] = strtolower($row['first_name'])."_".strtolower($row['last_name']).$key;
                            $key_rows[strtolower($row['first_name'])."_".strtolower($row['last_name']).$key] = $key;
                        }
                        if(strtolower($header_filter['filter_value']) == 'asc'){
                            ksort($key_rows);
                            $sort_order = SORT_ASC;
                        }else{
                            krsort($key_rows);
                            $sort_order = SORT_DESC;
                        }
                        array_multisort($sort_col, $sort_order, $course_list);
                        $course_list = array_combine($key_rows, $course_list);
                    }
                }
                if($search_on_dashboard != ''){
                    $course_list = array_intersect_key($course_list, $d_search);
                }

                if(isset($header_filter['filter_value']) && $header_filter['filter_value'] != '' && count($h_search) > 0){
                    $course_list = array_intersect_key($course_list, $h_search);
                }
            }
            */
        }
        if(count($course_list) == 0){
            $course_list['status'] = 0;
            $course_list['message'] = 'No records found.';
        }

        return $course_list;
    }
          
    /**
     * Get course data
     * Added by Gaurav
     * Added on 29 Aug 2017
     * @param type $post
     * @return array of course
     */
     public function buildCourseData($post){
                    
        $_data['order_by']      = isset($post['order_by']) ? $post['order_by'] : 'node_instance_id';
        $_data['order']         = isset($post['order']) ? $post['order'] : 'DESC';
        $_data['login_userId']  = (isset($post['setUserID']) && $post['setUserID'] != '') ? $post['setUserID'] : $_SESSION[PREFIX.'user_info']['node_id'];
        $_data['view_type']     = isset($post['view_type']) ? strtolower($post['view_type']) : 'bycourse';
        $_data['search_on_dash']= (isset($post['dashboard']) && $post['dashboard'] != '') ? trim($post['dashboard']) : '';
        
        if($_data['view_type'] === 'bycourse'){
            $header_filter = array(
                                 'filter_key' => isset($post['key']) ? strtolower($post['key']) : '',
                                 'filter_value' => isset($post['value']) ? strtolower($post['value']) : '',
                             );
        }
        $_data['header_filter'] = (isset($header_filter) && !empty($header_filter)) ? $header_filter : array();
        $course_data = $this->fetchCoureListData($_data);
        $courseList = [];
        if(count($course_data['course_dialogue_data'])) {
            $courseList =  $this->courseData($course_data,$_data['view_type'],$_data['search_on_dash'], $_data['header_filter'], $_data['login_userId']);
        }
         return $courseList;

     }

    /**
     * Function to update or create instance property values
     * Created By: Amit Malakar
     * Date: 8-Sep-2017
     * @param $ncpIdArray       - class property id array
     * @param $ncpValueArray    - class instance value array
     * @param $nodeInstanceId   - instance id
     * @param $typeId           - type id
     * @return int
     */
    public function updateOrCreateInstanceProperty($ncpIdArray, $ncpValueArray, $nodeInstanceId, $typeId)
    {
        // loop through all class properties
        foreach ($ncpIdArray as $key => $value) {
            // check if combination of node instance id and ncp id exists
            $sql        = new Sql($this->adapter);
            $select     = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->where->equalTo('nip.node_instance_id', $nodeInstanceId);
            $select->where->AND->equalTo('nip.node_class_property_id', $value);

            $statement  = $sql->prepareStatementForSqlObject($select);
            $result     = $statement->execute();
            $resultObj  = new ResultSet();
            $insArr = $resultObj->initialize($result)->toArray();


            if(isset($insArr[0]['node_instance_property_id'])) {
                // if exists, update the value
                $query = $sql->update();
                $query->table('node-instance-property');
                $query->set(array('value' => $ncpValueArray[$key]));
                $query->where(array('node_instance_property_id' => $insArr[0]['node_instance_property_id']));
                $statement = $sql->prepareStatementForSqlObject($query);
                $statement->execute();
            } else {
                // else insert the value
                $data                           = array();
                $data['node_instance_id']       = $nodeInstanceId;
                $data['node_class_property_id'] = $value;
                $data['node_id']                = $this->createNode();
                $data['node_type_id']           = $typeId;
                $data['value']                  = $ncpValueArray[$key];
                $data['encrypt_status']         = 0;

                $sql   = new Sql($this->adapter);
                $query = $sql->insert('node-instance-property');
                $query->values($data);
                $statement = $sql->prepareStatementForSqlObject($query);
                $result    = $statement->execute();
                $resultObj = new ResultSet();
                $resultObj->initialize($result);
            }
        }

        return 1;
    }

    //Get all email of users
    //Added by Gaurav on 11 sept 2017
     public function allUserEmails(){
        
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('email'=>'value'));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->where->equalTo('nip.node_class_property_id', INDIVIDUAL_EMAIL_ID);
        $select->where->AND->equalTo('ni.node_class_id', ACCOUNT_CLASS_ID);
        //echo $select->getSqlString();
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resArr =  $resultObj->initialize($result)->toArray();
        $allEails = array();
        foreach ($resArr as $key => $value) {
            if (trim($value['email'])!= '') {
                $allEails[] = $value['email'];
            }
        }
       return $allEails;
     }

    /**
     * Function to return password node_instance_id
     * Created By: Amit Malakar
     * Date: 11-Sep-2017
     * @param $user
     * @return bool
     */
    public function migrationUpdatePassword($user)
    {
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_instance_id = nip.node_instance_id', array());
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id=ni.node_id', array());
        $select->where->equalTo('xy.node_y_id', $user['node_id']);
        $select->where->AND->equalTo('ni.node_class_id', ACCOUNT_CLASS_ID);
        $select->where->AND->equalTo('nip.node_class_property_id', ACCOUNT_PASSWORD_ID);

        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resArr =  $resultObj->initialize($result)->toArray();

        if(count($resArr))
            return $resArr[0]['node_instance_id'];
        else
            return false;
    }
    
    
    /**
     * get instance id by property and value 
       Added by Gaurav on 12 sept 2017
     * @param type $propertyID
     * @param type $propertyValue
     * @return type
     */
     public function getInstanceIdBYValue($propertyID, $propertyValue){
        
        $sql                     = new Sql($this->adapter);
        $select                  = $sql->select();
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('node_instance_id'=>'node_instance_id'));
        $select->where->equalTo('nip.node_class_property_id', $propertyID);
        $select->where->AND->equalTo('nip.value', $propertyValue);
        //echo $select->getSqlString();
        $statement     =   $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $resArr =  $resultObj->initialize($result)->toArray();
        $instanceId = '';
        foreach ($resArr as $key => $value) {
            if (trim($value['node_instance_id'])!= '') {
                $instanceId = $value['node_instance_id'];
            }
        }
       return $instanceId;
     }

     /**
      * Get statmentListData
      * @param type $post
      * @return type
      */
     public function getStatementListData($post=array()){
        $dialogue_instance_node_id = trim($post['dialogue_instance_node_id']);
        $modeType = $post['chatType'];

        if (empty($modeType) && !empty($dialogue_instance_node_id)) {
            $modeType = $this->getCourseDialogueTable()->getStatementModeType($dialogue_instance_node_id);
        }

        if ($modeType == "Chat") {
            if (!empty($dialogue_instance_node_id)) {
                $DCR = $this->getCourseDialogueTable()->getStatementInstanceData($dialogue_instance_node_id, $post['setUserID']);
                /* Code for send notification count of perticuler dialog, user and modewise */
                if (isset($post['type']) && $post['type'] != '') {
                    $newArray = $DCR[0]['statement'];
                }
            } else {
                $DCR[0] = "";
            }
        } else {
            if (!empty($dialogue_instance_node_id)) {
                $stmtArray = $this->getCourseDialogueTable()->getLetterStatementInstanceData($dialogue_instance_node_id, $post['setUserID']);
                //print_r($stmtArray);die;
                /* Code for send notification count of perticuler dialog, user and modewise */
                if (isset($post['type']) && $post['type'] != '') {
                    //$newArray = array_reverse($stmtArray[0]['statement']);
                    $newArray = $stmtArray[0]['statement'];
                }
            } else {
                $stmtArray[0] = "";
            }
        }
        if (!empty($dialogue_instance_node_id)) {
            $unreadChatArray = $this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_instance_node_id, $post['setUserID'], strtolower($modeType));
            foreach ($unreadChatArray as $key => $statement_id) {
                $this->getCourseDialogueTable()->removeNotificationUserWise($statement_id['node_instance_id'], $dialogue_instance_node_id, $post['setUserID']);
            }
            $unreadChatCount = count($unreadChatArray);
            $totalUnreadCount = count($this->getCourseDialogueTable()->getUserDialogueNotificationCount($dialogue_instance_node_id, $post['setUserID']));
        }

        if (!empty($dialogue_instance_node_id)) {
            if (empty($newArray)) {
                $newArray = array(
                    'chatItems' => array(),
                    'chatType' => $modeType,
                    'notificationItem' => array('dialogue_node_id' => $dialogue_instance_node_id,
                        'unreadChatCount' => $unreadChatCount,
                        'totalUnreadCount' => $totalUnreadCount
                    )
                );
            } else {
                $newArray = array(
                    'chatItems' => $newArray,
                    'chatType' => $modeType,
                    'notificationItem' => array('dialogue_node_id' => $dialogue_instance_node_id,
                        'unreadChatCount' => $unreadChatCount,
                        'totalUnreadCount' => $totalUnreadCount
                    )
                );
            }
        } else {
            $newArray = array(
                'chatItems' => array(),
                'chatType' => $modeType,
                'notificationItem' => array('dialogue_node_id' => $dialogue_instance_node_id,
                    'unreadChatCount' => $unreadChatCount,
                    'totalUnreadCount' => $totalUnreadCount
                )
            );
        }

        return $newArray;
    }
    
    /**
     * Get dialogue data
     * @param type $post
     * @return type
     */
     public function getDialogueData($post){
        $dialogueClassId         = DIALOGUE_CLASS_ID;
        $dialogueTitleId         = DIALOGUE_TITLE_ID;
        $CourseInsId             = $post['course_instance_id'];
        $dialogueList = $removedParticipantsArr = $temp_dialogue = array();

        $fetchRecord = $this->getCourseDialogueTable()->getAllCourseDialogueData($CourseInsId, $post['user_instance_node_id'], 'course_dialogue');
        
        if(count($fetchRecord['course_dialogue_data'])) {
            $removedStatus = array_filter($fetchRecord['course_dialogue_data'], function($element) {
                return isset($element['has_removed']) && $element['has_removed'] == '2';
            });
            foreach($removedStatus as $ru) {
                if(!in_array($ru['actor_value'], $removedParticipantsArr[$ru['dialogue_node_id']]))
                    $removedParticipantsArr[$ru['dialogue_node_id']][] = $ru['actor_value'];
            }
        }
        
        $actor_info = $this->getActorFormatData($fetchRecord['actor_info']);
        $actor_id_array = array_column($actor_info, 'actor_id');
        $actor_array = array_combine($actor_id_array, $actor_info);

        $dialogue_order = array_column($fetchRecord['dialogue_order_data'], 'dialogue_node_id');

        foreach ($fetchRecord['course_dialogue_data'] as $key => $value) {
            if(trim($value['actor_value']) != ''){
                $dialogue_node_id = " ".$value['dialogue_node_id'];
                $fname = ($actor_array[$value['actor_value']]['first_name']) ? $actor_array[$value['actor_value']]['first_name'] : "";
                $lname = ($actor_array[$value['actor_value']]['last_name']) ? $actor_array[$value['actor_value']]['last_name'] : "";
                if(!in_array($value['actor_value'], $removedParticipantsArr[$value['dialogue_node_id']])) {
                    $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['first_name'] = $fname;
                    $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['last_name']  = $lname;
                    $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['user_id']    = $value['actor_value'];
                    $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['email']      = $actor_array[$value['actor_value']]['actor_email'];
                    //Added by Gaurav
                    //Added on 4 july 2017
                    if($actor_array[$value['actor_value']]['account_status']=='guest'){
                        $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['profile_image'] = $this->getProfileUserImage('', 'guest');
                    }else{
                        $dialogueList[$dialogue_node_id]['users'][$value['actor_value']]['profile_image'] = $this->getProfileUserImage($actor_array[$value['actor_value']]['profile_image'], 'thumbnail');
                    }
                    
                    $dialogueList[$dialogue_node_id]['dialogue']['dialogue_title']                 = html_entity_decode($value['dialogue_title']);
                    $dialogueList[$dialogue_node_id]['dialogue']['dialogueStatus']                 = (trim(strtolower($value['dialogueStatus'])) == 'published') ? 1 : 0;
                    $dialogueList[$dialogue_node_id]['dialogue']['created_by']                     = $value['dialogue_created_by'];
                    $dialogueList[$dialogue_node_id]['dialogue']['dialogue_node_id']               = $value['dialogue_node_id'];
                    $dialogueList[$dialogue_node_id]['dialogue']['dialogue_instance_id']           = $value['dialogue_instance_id'];
                    $dialogueList[$dialogue_node_id]['dialogue']['date']                           = $value['dialogue_timestamp'];
                    $dialogueList[$dialogue_node_id]['dialogue']['chat_text']                      = '';
                    $dialogueList[$dialogue_node_id]['dialogue']['letter_text']                    = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
                } else {
                    $dialogueList[$dialogue_node_id]['removed_users'][$value['actor_value']]['first_name'] = $fname;
                    $dialogueList[$dialogue_node_id]['removed_users'][$value['actor_value']]['last_name']  = $lname;
                    $dialogueList[$dialogue_node_id]['removed_users'][$value['actor_value']]['user_id']    = $value['actor_value'];
                    $dialogueList[$dialogue_node_id]['removed_users'][$value['actor_value']]['email']      = $actor_array[$value['actor_value']]['actor_email'];
                }
                if(!isset($dialogueList[$dialogue_node_id]['removed_users'])){
                    $dialogueList[$dialogue_node_id]['removed_users'] = array();
                }

                if(($post['user_instance_node_id'] == $value['actor_value'])){
                    $temp_dialogue[$value['dialogue_node_id']] = $value['dialogue_node_id'];
                    $key = array_search($value['dialogue_node_id'], $dialogue_order);
                    if($key !== false)$sort_col[$key] = $dialogue_node_id;
                }
            }
        }

        if(count($temp_dialogue)){
            $temp_dialogue_array = $this->getCourseDialogueTable()->getUserDialogueNotificationCount($temp_dialogue, $post['user_instance_node_id'], '', 'in');
            $temp_dialogue_nodeId_array = array_count_values(array_column($temp_dialogue_array, 'dialogue_node_id'));
        }

        foreach($dialogueList as $key => $value)
        {
            if(!in_array($key, $temp_dialogue)){
                unset($dialogueList[$key]);
            }else{
                $dialogueList[$key]['dialogue']['notificationCount'] = isset($temp_dialogue_nodeId_array[trim($key)]) ? $temp_dialogue_nodeId_array[trim($key)] : 0;
            }
        }

        if(count($dialogue_order)){
            ksort($sort_col);
            $sorted = array_map(function($v) use ($dialogueList) {
                return $dialogueList[$v];
            }, $sort_col);
            $dialogueList = array_combine($sort_col, $sorted);
        }

        /*
         * Added By: Divya Rajput
         * Date: 25 Aug 2017
         * Fetch Statement Data in Case of Notification
         */
        if(isset($post['dialogue_node_id']) && $post['dialogue_node_id'] != ''){
            $postArr['dialogue_instance_node_id'] = $post['dialogue_node_id'];
            $postArr['setUserID'] = $post['user_instance_node_id'];
            $postArr['type'] = 'json';
            $dialogueList[" ".$post['dialogue_node_id']]['statement_data'] = $this->getStatementListData($postArr);
        }

        if(isset($post['nodtification_node_id']) && trim($post['nodtification_node_id']) != ''){
            $nodtification_node_id = trim($post['nodtification_node_id']);
            $nodtification_instance_id = $this->getInstanceId('node-instance', 'node_id', $nodtification_node_id);
            $this->updateNotificationStatus('', $nodtification_instance_id);
        }
        return $dialogueList;
    }

    /**
     * Function to return user related data after login
     * Created By: Amit Malakar
     * Date: 13-Sep-2017
     * @param $userData
     * @return array
     */
    public function setUserDataOnLogin($userData) {

        // Set user profile image
        // Added by Gaurav, Added on 06 July 2017, Set user profile
        if(isset($userData['user_type']) && $userData['user_type']=='guest'){
                $userData['profile_image'] = $this->getProfileUserImage('', 'guest');
        }else{
           if(isset($userData['profile_image'])){
                $userData['profile_image'] = $this->getProfileUserImage($userData['profile_image'], 'top-right-corner');
            }else{
                $userData['profile_image'] = $this->getProfileUserImage('', 'top-right-corner');
            } 
        }
        

        // Set courseList data
        // Added by Gaurav, Added on 29 Aug 2017, Get App Data
        // Modified by Amit Malakar, 10-Oct-2017, As discussed commented courseList
        /*$paramArr = array('setUserID'=>$userData['node_id']);
        $userData['courseList'] = $this->buildCourseData($paramArr);*/

        // Set subscribed app data
        // Added by Gaurav, Added on 31 Aug 2017, Get App Data
        $subscribedApps = array_keys($this->getAdministratorTable()->fetchAllCoursesOfCourseBuilder($userData['node_id'],1));
        $userData['subscribed_apps'] = $subscribedApps;

        $notificationCount = count($this->fetchFlashNotificationData($userData['node_id']));

        return array('userData'=>$userData, 'notificationCount'=>$notificationCount);
    }

    /**
     * Created By: Divya Rajput
     * Date: 9-Oct-2017
     * @param emailaddress array
     * @return array
     */
    public function allGuestEmails($emailAddress){
        if(count($emailAddress)) {
            $sql = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('value'));
            $select->JOIN(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = nip1.node_instance_id AND nip1.value = \'guest\' AND nip1.node_class_property_id = ' . ACCOUNT_STATUS_ID), array());
            $select->JOIN(array('ni' => 'node-instance'), 'ni.node_instance_id = nip1.node_instance_id', array());
            $select->JOIN(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array('node_id' => 'node_y_id'));
            $select->JOIN(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr.node_y_id AND ni1.node_class_id = ' . INDIVIDUAL_CLASS_ID), array());
            $select->where->IN('nip.value', $emailAddress);
            $select->where->AND->equalTo('nip.node_class_property_id', INDIVIDUAL_EMAIL_ID);

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
            $resultObj = new ResultSet();
            return $resultObj->initialize($result)->toArray();
        }else{
            return array();
        }
    }

    public function fetchCourseResource($login_user_id, $course_node_id){
        $userData       = $this->getCourseDialogueTable()->fetchCourseDialogue($login_user_id, $course_node_id);
        $resourceData   = array();
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
        return $resourceData;
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
                    $resourceData[$stmt['statement_instance_id']]['statement_type']   = $stmt['statement_type'];
                    $resourceData[$stmt['statement_instance_id']]['statement']        = $stmt['attachment_name'];
                    $resourceData[$stmt['statement_instance_id']]['dialogue_node_id'] = $stmt['dialogue_node_id'];
                    $key++;
                }
            }
        }
        return $resourceData;
    }
}
