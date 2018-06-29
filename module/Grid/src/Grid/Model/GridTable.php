<?php
    namespace Grid\Model;

    use Zend\Db\TableGateway\AbstractTableGateway;
    use Zend\Db\Adapter\Adapter;
    use Zend\Db\ResultSet\ResultSet;
    use Zend\Db\Sql\Sql;
    use Zend\Db\Sql\Select;

    class GridTable extends AbstractTableGateway
    {
        protected $table = 'grid';

        public function __construct(Adapter $adapter)
        {
            $this->adapter            = $adapter;
            $this->resultSetPrototype = new ResultSet();
            $this->resultSetPrototype->setArrayObjectPrototype(new Grid());
            $this->initialize();
        }

        /*
        * Created By Amit Malakar
        * On Date: 11 Feb, 2016
        * copy of classes table
        */
        public function getProperties($node_y_class_id, $is_parent = 'N')
        {
            if ($is_parent == 'Y')
                $sqlQuery = "CALL getPropertiesY($node_y_class_id, 'node_class_property_id')";
            else if ($is_parent == 'N')
                $sqlQuery = "CALL getPropertiesN($node_y_class_id, 'node_class_property_id')";

            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray;
        }

        public function updateSubInstancePropertyAgain($instance_property_id, $node_type_id, $node_instance_id, $node_class_property_id)
        {
            foreach ($instance_property_id as $key => $value) {
                $val        = $this->mc_encrypt($value, ENCRYPTION_KEY);
                $enc_status = ENCRYPTION_STATUS;
                $sqlQuery   = "CALL updateSubInstancePropertyAgain('$val',$enc_status,$node_type_id,$node_instance_id,$node_class_property_id[$key])";
                $statement  = $this->adapter->query($sqlQuery);
                $result     = $statement->execute();
            }
        }

        public function saveNodeX($parent_id, $nodexArr)
        {
            $newArray = explode(',', $nodexArr);
            $newArray = array_unique($newArray);

            foreach ($newArray as $key => $val) {
                if ($parent_id != $val) {
                    if (trim($val) != "") {
                        $sqlQuery  = "CALL saveNodeX($parent_id, $val)";
                        $statement = $this->adapter->query($sqlQuery);
                        $result    = $statement->execute();
                    }
                }
            }
        }

        public function getinstanceDetails($node_instance_id)
        {
            $sqlQuery  = "CALL getinstanceDetails($node_instance_id)";
            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray[0]['node_id'];
        }

        public function getinstanceDetailsByNodeId($node_id)
        {
            $sqlQuery  = "CALL getinstanceDetailsByNodeId($node_id)";
            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            return $dataArray[0]['node_instance_id'];
        }

        public function getNodeXIdFromXYTable($node_id)
        {
            $sqlQuery  = "CALL getNodeXIdFromXYTable($node_id)";
            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            $dataArray = $resultObj->initialize($result)->toArray();

            $impldeNX = array();
            foreach ($dataArray as $key => $value) {
                $impldeNX[] = $value['node_x_id'];
            }

            return $impldeNX;
        }

        public function getClassList($node_y_class_id = "")
        {
            if($node_y_class_id != '')
                $sqlQuery  = "CALL getClassListY($node_y_class_id)";
            else
                $sqlQuery  = "CALL getClassListO()";

            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();

            $resultObj = new ResultSet();
            $nodeArray = $resultObj->initialize($result)->toArray();

            if($node_y_class_id != '')
                return $nodeArray[0];
            else
                return $nodeArray;
        }

        public function createInstance($node_class_id, $node_type_id, $saveType, $node_instance_id)
        {
            if ($saveType == 'D')
                $status = 0;
            else
                $status = 1;


            if (intval($node_instance_id) > 0) {
                $sqlQuery  = "CALL createInstanceU($status, $node_instance_id)";
                $statement = $this->adapter->query($sqlQuery);
                $statement->execute();
            } else {
                $enc_status = ENCRYPTION_STATUS;
                $node_id    = $this->createNode();
                $cap        = $this->mc_encrypt($node_id, ENCRYPTION_KEY);
                // create new instance
                $sqlQuery  = "CALL createInstanceI($status,$enc_status,$node_type_id,$node_id,$node_class_id,$cap,@newid);";
                $statement = $this->adapter->query($sqlQuery);
                $statement->execute();
                // fetch last insert id
                $sqlQuery2  = "SELECT @newid as node_instance_id;";
                $statement2 = $this->adapter->query($sqlQuery2);
                $result2    = $statement2->execute();

                $resultObj        = new ResultSet();
                $dataArray        = $resultObj->initialize($result2)->toArray();
                $node_instance_id = $dataArray[0]['node_instance_id'];
            }

            return $node_instance_id;
        }

        public function createInstanceProperty($instance_property_id, $instance_property_caption, $node_instance_id, $node_type_id)
        {
            foreach ($instance_property_id as $key => $value) {
                if (trim($instance_property_caption[$key]) != '') {
                    $val                = trim($this->mc_encrypt($instance_property_caption[$key], ENCRYPTION_KEY));
                    $enc_status         = ENCRYPTION_STATUS;
                    $node_id            = $this->createNode();
                    $node_class_prop_id = $value;

                    $sqlQuery  = "CALL createInstanceProperty('$val',$enc_status,$node_instance_id,$node_id,$node_type_id,$node_class_prop_id)";
                    $statement = $this->adapter->query($sqlQuery);
                    $statement->execute();
                }
            }
        }

        public function fetchNodeInstanceProperty($node_instance_id)
        {
            $sqlQuery  = "CALL fetchNodeInstanceProperty($node_instance_id)";
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj        = new ResultSet();
            $dataArray        = $resultObj->initialize($result)->toArray();
            return $dataArray;
        }

        public function createInstancePropertyAgain($instance_property_id, $node_instance_id, $node_type_id, $node_class_property_id)
        {
            foreach ($instance_property_id as $key => $value) {
                $val                = $this->mc_encrypt($value, ENCRYPTION_KEY);
                $enc_status         = ENCRYPTION_STATUS;
                $node_id            = $this->createNode();
                $node_class_prop_id = $node_class_property_id[$key];

                $sqlQuery  = "CALL createInstancePropertyAgain('$val',$enc_status,$node_instance_id,$node_id,$node_type_id,$node_class_prop_id);";
                $statement = $this->adapter->query($sqlQuery);
                $statement->execute();
            }
        }

        public function createNode()
        {
            $uuid_id = bin2hex(openssl_random_pseudo_bytes(8));//$this->generate_uuid(); //get uuid value by using UUID algorithm from mySql

            $dataValues = array('node_uuid_id' => $uuid_id);

            $sql    = new Sql($this->adapter);
            $select = $sql->insert('node'); //This table name "node" will be renamed and name will be "node"
            $select->values($dataValues);
            $statement = $sql->prepareStatementForSqlObject($select);
            $result    = $statement->execute();
            $resultObj = new ResultSet();
            $resultObj->initialize($result);
            $node_id = $this->adapter->getDriver()->getLastGeneratedValue();

            return $node_id;
        }

        public function mc_encrypt($encrypt, $key)
        {
            if (ENCRYPTION_STATUS == 0) {
                return $encrypt;
            } else {
                $encrypt   = serialize($encrypt);
                $iv        = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_DEV_URANDOM);
                $key       = pack('H*', $key);
                $mac       = hash_hmac('sha256', $encrypt, substr(bin2hex($key), -32));
                $passcrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $encrypt . $mac, MCRYPT_MODE_CBC, $iv);
                $encoded   = base64_encode($passcrypt) . '|' . base64_encode($iv);

                return $encoded;
            }
        }

        public function generate_uuid()
        {
            $sqlQuery  = "SELECT UUID( ) AS uuid";
            $statement = $this->adapter->query($sqlQuery);
            $result    = $statement->execute();
            $resultObj = new ResultSet();
            $uuidArray = $resultObj->initialize($result)->toArray();
            $gen_uuid  = $uuidArray[0]['uuid'];
            if (strrpos($gen_uuid, '-')) {
                return str_replace('-', '', $gen_uuid);
            } else {
                return $gen_uuid;
            }
        }

        public function getDocumentsList($dialogue_template_class_id, $dialogue_title_class_id)
        {
            $sqlQuery  = "CALL fetchDocumentNodeInstanceIds($dialogue_template_class_id);";
            $statement = $this->adapter->query($sqlQuery);
            $result = $statement->execute();

            $resultObj        = new ResultSet();
            $nodeArray        = $resultObj->initialize($result)->toArray();
            $result->getResource()->closeCursor();
           


            $data = array();
            foreach ($nodeArray as $node) {
                $node_instance_id = $node['node_instance_id'];
                $sqlQuery  = "CALL fetchDocumentList($node_instance_id, $dialogue_title_class_id)";
                $statement = $this->adapter->query($sqlQuery);
                $result = $statement->execute();

                $resultObj        = new ResultSet();
                $docInfo        = $resultObj->initialize($result)->toArray();
            
                if (count($docInfo))
                    array_push($data, $docInfo[0]);
            }

            return $data;
        }

        /* *

        * functionality for fetch courses list for process and association type instances // awdhesh
    
        * */

        public function getCoursesList($product_type_class_id,$product_title_class_id)
        {
            $sqlQuery               = "CALL fetchCourseNodeInstanceIds($product_type_class_id)";

            $statement              = $this->adapter->query($sqlQuery);
            $result                 = $statement->execute();

            $resultObj              = new ResultSet();
            $nodeArray              = $resultObj->initialize($result)->toArray();
            $result->getResource()->closeCursor();
            
            $data = array();
            foreach ($nodeArray as $keys=>$node) {

                $node_instance_id   = $node['node_instance_id'];
                $value              = $node['value'];
                $sqlQuery           = "CALL fetchCourseList($node_instance_id, $product_title_class_id)";
                                      
                $statement          = $this->adapter->query($sqlQuery);
                $result             = $statement->execute();

                $resultObj          = new ResultSet();
                $docInfo            = $resultObj->initialize($result)->toArray();
                if (count($docInfo)) {
                    $docInfo[0]['type']= $value;
                    array_push($data, $docInfo[0]);
                }
            }
            //echo '<pre>'; print_r($data); die();
            return $data;
        }

    }


