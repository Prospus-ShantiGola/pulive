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
use Zend\Db\Sql\Expression;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Imapemail\imap;

class EmailTable extends AbstractTableGateway
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
    /*
     * Created By:   Kunal Kumar
     * Date:        07-June-2017
     * Page:         When click on any email account
     * Purpose:      To fetch emails of a particular email account
     */
    public function getEmailList($login_user_setting_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxy' => 'node-x-y-relation'));
        $select->columns(array('email_node_id' => 'node_x_id','email_setting_node_id' => 'node_y_id'));
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxy.node_x_id', array('email_instance_id'=>'node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'),new Expression('nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = '.EMAIL_SUBJECT_PROPERTY_ID), array('subject'=>'value'));
        $select->join(array('nip2' => 'node-instance-property'),new Expression('nip2.node_instance_id = ni.node_instance_id and nip2.node_class_property_id = '.EMAIL_DATE_PROPERTY_ID), array('date'=>'value'));
        $select->join(array('nip3' => 'node-instance-property'),new Expression('nip3.node_instance_id = ni.node_instance_id and nip3.node_class_property_id = '.EMAIL_UID_PROPERTY_ID), array('uid'=>'value'));
        $select->where->AND->equalTo('nxy.node_y_id', EMAIL_SETTING_STATIC_ID);
        $select->where->AND->equalTo('ni.node_class_id', EMAIL_CLASS_ID);
        $select->order('ni.node_instance_id DESC');
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $emails                         =   $resultObj->initialize($result)->toArray();
        return $emails;
    }
    
    /*
     * Created By:   Kunal Kumar
     * Date:        09-June-2017
     * Page:         When click on any email 
     * Purpose:      To fetch email detail for a particular email
     */
    public function getEmailDetails($email_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_instance_id'));
        $select->join(array('nip' => 'node-instance-property'),new Expression('nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = '.EMAIL_DATE_PROPERTY_ID), array('date'=>'value'), $select::JOIN_LEFT);
        $select->join(array('nip1' => 'node-instance-property'),new Expression('nip1.node_instance_id = ni.node_instance_id and nip1.node_class_property_id = '.EMAIL_SUBJECT_PROPERTY_ID), array('subject'=>'value'), $select::JOIN_LEFT);
        $select->join(array('nip2' => 'node-instance-property'),new Expression('nip2.node_instance_id = ni.node_instance_id and nip2.node_class_property_id = '.EMAIL_HTMLMSG_PROPERTY_ID), array('htmlmsg'=>'value'), $select::JOIN_LEFT);
        $select->join(array('nip3' => 'node-instance-property'),new Expression('nip3.node_instance_id = ni.node_instance_id and nip3.node_class_property_id = '.EMAIL_UID_PROPERTY_ID), array('uid'=>'value'), $select::JOIN_LEFT);
        $select->join(array('nip4' => 'node-instance-property'),new Expression('nip4.node_instance_id = ni.node_instance_id and nip4.node_class_property_id = '.EMAIL_PLAINMSG_PROPERTY_ID), array('plainmsg'=>'value'), $select::JOIN_LEFT);
        $select->where->AND->equalTo('ni.node_id', $email_node_id);
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $emails                         =   $resultObj->initialize($result)->toArray();
        return $emails[0];
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        07-June-2017
     * Page:         When click on Email menu
     * Purpose:      To fetch all email accounts for a particular user
     */
    public function getEmailAccountsList($login_user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id', array('email'=>'value'));
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni.node_instance_id', array());
        $select->where->AND->equalTo('ni.node_class_id', EMAIL_SETTING_CLASS_ID);
        $select->where->AND->equalTo('nip.node_class_property_id', EMAIL_SETTING_ACTOR_EMAIL_PROPERTY_ID);
        $select->where->AND->equalTo('nip1.node_class_property_id', EMAIL_SETTING_ACTOR_PROPERTY_ID);
        $select->where->AND->equalTo('nip1.value', $login_user_id);
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $emails                         =   $resultObj->initialize($result)->toArray();
        return $emails;
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        13-June-2017
     * Purpose:      To create an object of imap class
     * Input:       User email setting id
     */
    public function createImapObject($email_setting_node_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'), new Expression('nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id = '.EMAIL_SETTING_TYPE_PROPERTY_ID), array('email_type'=>'value'));
        $select->join(array('nip1' => 'node-instance-property'),new Expression('nip1.node_instance_id = ni.node_instance_id and nip1.node_class_property_id = '.EMAIL_SETTING_ACTOR_EMAIL_PROPERTY_ID), array('email'=>'value'));
        $select->join(array('nip2' => 'node-instance-property'),new Expression('nip2.node_instance_id = ni.node_instance_id and nip2.node_class_property_id = '.EMAIL_SETTING_ACTOR_PASSWORD_PROPERTY_ID), array('password'=>'value'));
        $select->where->AND->equalTo('ni.node_id', $email_setting_node_id);
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $emaildetails                         =   $resultObj->initialize($result)->toArray();
        if($emaildetails[0]['email_type']=="Gmail")
            $authhost = "{imap.gmail.com:993/imap/ssl}INBOX";
        else
            $authhost = "{imap.gmail.com:993/imap/ssl}INBOX";
        $email = $emaildetails[0]['email'];
        $emailPassword = $emaildetails[0]['password'];
        return $imap = new imap($authhost, $email, $emailPassword);
    }
    
    public function connectImap()
    {
        $hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
        $username = 'kunalprospus@gmail.com';
        $password = 'zabtgazvlpuaprvo';
        $this->inbox = imap_open($hostname,$username,$password) or die('Cannot connect to Gmail: ' . imap_last_error());
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        13-June-2017
     * Purpose:      To remove duplicate/replied emails from the list
     * Input:       array
     */
    public function getLastThred($relationArr)
    {
        $finalArr = array();
        foreach($relationArr as $row)
        {
            if($row['next']==0)
                $finalArr[] = $row['num'];
        }
        return $finalArr;
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        13-June-2017
     * Purpose:      To import/Sync emails of a particular user
     * Input:       User email setting id
     */
    public function runSync($post)
    {
        //error_reporting(E_ALL);
        //echo "<pre>";
        $imap = $this->createImapObject($post['email_setting_node_id']);
        $k = $this->getEmailList($post['email_setting_node_id']);
        $stream = $imap->getMailbox();
        if(count($k)==0)
        {
            $mails = imap_thread ($stream,1);
            if (FALSE === $mails) {
                throw new Exception('Search failed: ' . imap_last_error());
            }
            foreach($mails as $key=>$thred){
                $tempArr = explode('.',$key);
                $index = $tempArr[0];
                $key = $tempArr[1];
                $relationArr[$index][$key]= $thred;
            }
            $finalArr = implode(',',$this->getLastThred($relationArr));
            $MC = imap_check($stream);
            $emailList = imap_fetch_overview($stream,"$finalArr",FT_UID);  
            foreach($emailList as $data) {
                $data->message_id = htmlspecialchars($data->message_id);
                $data->in_reply_to = htmlspecialchars($data->in_reply_to);
                $data->references = htmlspecialchars($data->references);
                //die;
            }
            foreach($emailList as $email)
            {
                $htmlmsg = '';$plainmsg = '';
                $imap->getmsg($stream,$email->uid);
                $maildetail = $imap->getMailhtml();
                $htmlmsg = imap_utf8($maildetail->htmlmsg);
                $plainmsg = imap_utf8($maildetail->plainmsg);
                $instance_property_id = array(EMAIL_FROMADDRESS_PROPERTY_ID,EMAIL_TOADDRESS_PROPERTY_ID,EMAIL_DATE_PROPERTY_ID,EMAIL_SUBJECT_PROPERTY_ID,
                    EMAIL_HTMLMSG_PROPERTY_ID,EMAIL_PLAINMSG_PROPERTY_ID,EMAIL_UID_PROPERTY_ID,EMAIL_RECENT_PROPERTY_ID,EMAIL_FLAGGED_PROPERTY_ID,EMAIL_ANSWERED_PROPERTY_ID,
                    EMAIL_DELETED_PROPERTY_ID,EMAIL_SEEN_PROPERTY_ID,EMAIL_DRAFT_PROPERTY_ID,EMAIL_MSGID_PROPERTY_ID,EMAIL_MSG_REFERENCE_PROPERTY_ID);
                $instance_property_caption = array($email->from,$email->to,$email->date,$email->subject,$htmlmsg,$plainmsg,$email->uid,$email->recent,$email->flagged,
                    $email->answered,$email->deleted,$email->seen,$email->draft,base64_encode($email->message_id),base64_encode($email->references));
                $email_node_instance_id = $this->getClassesTable()->createInstance('',EMAIL_CLASS_ID,2,'P','');
                $k = $this->getClassesTable()->createInstanceProperty($instance_property_id,$instance_property_caption,$email_node_instance_id,2);
                $email_instance_node_id = $this->getStructureTable()->getInstanceNodeId(EMAIL_CLASS_ID, $email_node_instance_id);
                $this->getStructureTable()->createXYRelation($post['email_setting_node_id'],$email_instance_node_id);
            }
        }else
        {
            $maxuid = $this->getHighestUid($post['email_setting_node_id'])+1;
            $emailList = imap_fetch_overview($stream,"$maxuid:*",FT_UID); 
            foreach($emailList as $email) {
                $email->message_id = htmlspecialchars($email->message_id);
                $email->in_reply_to = htmlspecialchars($email->in_reply_to);
                $email->references = htmlspecialchars($email->references);
            }
            //print_r($emailList);
            foreach($emailList as $key=>$email) 
            {
                //print_r($email);
                if(isset($email->in_reply_to) && $email->in_reply_to)
                {
                    $has_reference = $this->checkEmailReferenceInArray($email->message_id,$key,$emailList);
                    if($has_reference)
                    {
                        continue;
                    }else
                    {
                        $references = explode(' ',$email->references);
                        foreach($references as $ref)
                        {    
                            
                            $refs[] = base64_encode($ref);
                            $re[] = $ref;
                        }
                        $has_reference_in_db = $this->checkEmailReferenceInDB($refs);
                        if($has_reference_in_db)
                        {
                            print_r($has_reference_in_db);
                        }else{
                            
                        }
                        
                    }
                        //print_r($references);
                }else{
//                    $htmlmsg = '';$plainmsg = '';
//                    $imap->getmsg($stream,$email->uid);
//                    $maildetail = $imap->getMailhtml();
//                    $htmlmsg = imap_utf8($maildetail->htmlmsg);
//                    $plainmsg = imap_utf8($maildetail->plainmsg);
//                    $instance_property_id = array(EMAIL_FROMADDRESS_PROPERTY_ID,EMAIL_TOADDRESS_PROPERTY_ID,EMAIL_DATE_PROPERTY_ID,EMAIL_SUBJECT_PROPERTY_ID,
//                        EMAIL_HTMLMSG_PROPERTY_ID,EMAIL_PLAINMSG_PROPERTY_ID,EMAIL_UID_PROPERTY_ID,EMAIL_RECENT_PROPERTY_ID,EMAIL_FLAGGED_PROPERTY_ID,EMAIL_ANSWERED_PROPERTY_ID,
//                        EMAIL_DELETED_PROPERTY_ID,EMAIL_SEEN_PROPERTY_ID,EMAIL_DRAFT_PROPERTY_ID,EMAIL_MSGID_PROPERTY_ID,EMAIL_MSG_REFERENCE_PROPERTY_ID);
//                    $instance_property_caption = array($email->from,$email->to,$email->date,$email->subject,$htmlmsg,$plainmsg,$email->uid,$email->recent,$email->flagged,
//                        $email->answered,$email->deleted,$email->seen,$email->draft,base64_encode($email->message_id),base64_encode($email->references));
//                    $email_node_instance_id = $this->getClassesTable()->createInstance('',EMAIL_CLASS_ID,2,'P','');
//                    $k = $this->getClassesTable()->createInstanceProperty($instance_property_id,$instance_property_caption,$email_node_instance_id,2);
//                    $email_instance_node_id = $this->getStructureTable()->getInstanceNodeId(EMAIL_CLASS_ID, $email_node_instance_id);
//                    $this->getStructureTable()->createXYRelation($post['email_setting_node_id'],$email_instance_node_id);
                }
                
            }
        }
        
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To insert emails into the database
     * Input        email details
     */
    public function insertEmail($stream,$data)
    {
        $htmlmsg = '';$plainmsg = '';
        $imap->getmsg($stream,$email->uid);
        $maildetail = $imap->getMailhtml();
        $htmlmsg = imap_utf8($maildetail->htmlmsg);
        $plainmsg = imap_utf8($maildetail->plainmsg);
        $instance_property_id = array(EMAIL_FROMADDRESS_PROPERTY_ID,EMAIL_TOADDRESS_PROPERTY_ID,EMAIL_DATE_PROPERTY_ID,EMAIL_SUBJECT_PROPERTY_ID,
            EMAIL_HTMLMSG_PROPERTY_ID,EMAIL_PLAINMSG_PROPERTY_ID,EMAIL_UID_PROPERTY_ID,EMAIL_RECENT_PROPERTY_ID,EMAIL_FLAGGED_PROPERTY_ID,EMAIL_ANSWERED_PROPERTY_ID,
            EMAIL_DELETED_PROPERTY_ID,EMAIL_SEEN_PROPERTY_ID,EMAIL_DRAFT_PROPERTY_ID,EMAIL_MSGID_PROPERTY_ID,EMAIL_MSG_REFERENCE_PROPERTY_ID);
        $instance_property_caption = array($email->from,$email->to,$email->date,$email->subject,$htmlmsg,$plainmsg,$email->uid,$email->recent,$email->flagged,
            $email->answered,$email->deleted,$email->seen,$email->draft,base64_encode($email->message_id),base64_encode($email->references));
        $email_node_instance_id = $this->getClassesTable()->createInstance('',EMAIL_CLASS_ID,2,'P','');
        $k = $this->getClassesTable()->createInstanceProperty($instance_property_id,$instance_property_caption,$email_node_instance_id,2);
        $email_instance_node_id = $this->getStructureTable()->getInstanceNodeId(EMAIL_CLASS_ID, $email_node_instance_id);
        $this->getStructureTable()->createXYRelation($post['email_setting_node_id'],$email_instance_node_id);
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        13-June-2017
     * Purpose:     To get highest UID for a particular email account
     * Input        login setting id
     */
    public function getHighestUid($login_user_setting_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('nxy' => 'node-x-y-relation'));
        $select->columns(array());
        $select->join(array('ni' => 'node-instance'), 'ni.node_id = nxy.node_x_id', array(),$select::JOIN_LEFT);
        $select->join(array('nip1' => 'node-instance-property'),new Expression('nip1.node_instance_id = ni.node_instance_id and nip1.node_class_property_id = '.EMAIL_UID_PROPERTY_ID), array('uid'=>new Expression('MAX(CONVERT(SUBSTRING_INDEX(`nip1`.`value`,"-",-1),UNSIGNED INTEGER))')),$select::JOIN_LEFT);
        $select->where->AND->equalTo('nxy.node_y_id', $login_user_setting_id);
        $select->where->AND->equalTo('ni.node_class_id', EMAIL_CLASS_ID);
        //return  $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        $emails                         =   $resultObj->initialize($result)->toArray();
        return $emails[0]['uid'];
    }
    
    function checkEmailReferenceInArray($message_id,$key,$emailList)
    {
        for($i=$key;$i<count($emailList);$i++)
        {
            if(strpos($emailList[$i]->references, $message_id))
                return true;
            else
                continue;
        }
        return false;
    }
    
    function checkEmailReferenceInDB($reference)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(array('ni' => 'node-instance'));
        $select->columns(array('node_id'));
        $select->join(array('nip' => 'node-instance-property'),new Expression('nip.node_instance_id = ni.node_instance_id and nip.node_class_property_id  = '.EMAIL_MSGID_PROPERTY_ID), array('node_instance_id'));
        $select->where->IN('nip.value',$reference);
        //return $select->getSqlstring();
        $statement                      =   $sql->prepareStatementForSqlObject($select);
        $result                         =   $statement->execute();
        $resultObj                      =   new ResultSet();
        return $emails                         =   $resultObj->initialize($result)->toArray();
    }
}