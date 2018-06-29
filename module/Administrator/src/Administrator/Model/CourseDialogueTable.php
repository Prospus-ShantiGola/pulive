<?php
namespace Administrator\Model;
use Administrator\Controller\Plugin\AwsS3;
use Zend\Db\Adapter\Adapter;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Predicate;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\AbstractTableGateway;

class CourseDialogueTable extends AbstractTableGateway
{
	protected $table = 'node';
        protected $classTableObj;

	public function __construct(Adapter $adapter)
	{
		//$classObj					= new ClassesTable();
	    $this->adapter 				= $adapter;
	    $this->resultSetPrototype 	=	new ResultSet();
	    $this->resultSetPrototype->setArrayObjectPrototype(new Administrator());
	    $this->initialize();
	}
     /** Added by Gaurav
     * Added on 04 July 2017
     * Get object of class
     * @return object of class
     */

    public function getClassesTable() {


        if (!$this->classTableObj) {
            $this->classTableObj = new ClassesTable($this->adapter);
        }
        return $this->classTableObj;
    }

    public function getNodeId($table,$column,$value)
    {
        $sql                		=	new Sql($this->adapter);
		$select						=	$sql->select();
		$select->from($table);
		$select->where->equalTo($column,intval($value));
		$statement					=	$sql->prepareStatementForSqlObject($select);
		$result						=	$statement->execute();
		$resultObj					=	new ResultSet();
		$dataArray					=	$resultObj->initialize($result)->toArray();
		return intval($dataArray[0]['node_id']);
    }
	/**
	 * Function to save the new dialogue instances
	 * Added By Awdhesh Soni 15 april 2016
	 */
	public function saveNewDialogInstances($dialog_data,$chatMessage)
	{


		if(!empty($dialog_data['courseInsId']))
		{
				$courseInsId                =   $dialog_data['courseInsId'];
		}else {
				$courseInsId = "";
		}
		$StmtType                   = "";
		$course_node_class_id  		=	COURSE_CLASS_ID;
		$dialogue_node_class_id  	=	DIALOGUE_CLASS_ID;
		$user_instance_node_id      =   $dialog_data['user_instance_node_id'];
		$dialogue_title 			=   htmlentities(trim($dialog_data['dialogue_title']));
		$receipient_user_node_id    =   $dialog_data['user_recepient_node_id'];
		$saveType    				=   $dialog_data['saveType'];
		$action    					=   $dialog_data['action'];
		$stmntTimestamp    			=   $dialog_data['timestamp'];
		$StmtType                   =   $dialog_data['Coursetype'];

		// when the new course as well as new dialogue created for the first time
		if(strtolower($dialog_data['course_dialogue_type']) == strtolower('new'))
		{
			//add course first
			$node_type_id				= '2';
			if($dialog_data['course_title']=='')
			{
				$course_value = 'Untitled';
			}
			else
			{
				$course_value = htmlentities(trim($dialog_data['course_title']));
			}

			if($saveType == "D")
			{
				//$course_field 				= array('Title','Timestamp','created By');
				$course_field 				= array('Title', 'Timestamp', 'created By', 'Updation Timestamp');
			}
			else
			{
				//$course_field 				= array('Title','Timestamp');
				$course_field 				= array('Title', 'Timestamp', 'created By', 'Updation Timestamp');
			}

			if($saveType =="D")
			{
				$couse_field[0]  			=  $course_value;
				$couse_field[1]  	  		=  date('Y-m-d H:i:s');
				$prefixTitle                =  PREFIX.'user_info';
				//$couse_field[2]  	  		=  $_SESSION[$prefixTitle]['node_id'];
				$couse_field[2]  	  		=  $user_instance_node_id;
				$couse_field[3]  	  		=  date('Y-m-d H:i:s');
			}
			else {
				$couse_field[0]  			=  $course_value;
				$couse_field[1]  	  		=  date('Y-m-d H:i:s');
				$couse_field[2]  	  		=  $user_instance_node_id;
				$couse_field[3]  	  		=  date('Y-m-d H:i:s');
			}

			if($course_value!='')
			{
				$node_instance_id  	    =    $this->createNodeInstanceCourseDialouge($course_node_class_id,$node_type_id,$saveType);

				if($node_instance_id)
				{
					foreach ($couse_field as $key => $courseVal)
					{
						$node_class_property_id 			 =  $this->getNodeClassPropertyIdCourseDialouge($course_node_class_id,$course_field[$key]);

						$course_node_instance_property_id  	 =  $this->createNodeInstanceCourseDialougeProperty($node_instance_id,$node_class_property_id,$node_type_id,$courseVal);
					}
					$course_instance_node_id  			 	 = $this->getInstanceNodeIdCourseDialogue($course_node_class_id,$node_instance_id);
					// add xy relation between user and course
					$xy_id = $this->createXYRelationCourseDialogue($course_instance_node_id,$user_instance_node_id);
					//add dialogue for course
				    $final_ary = $this->addDialogueCourse($dialogue_node_class_id,$dialogue_title,$course_instance_node_id,$user_instance_node_id,$receipient_user_node_id,$saveType,$chatMessage,$action,$stmntTimestamp,$node_instance_id,$course_value,$StmtType);
				}

				if(!empty($final_ary))
				{

					return $final_ary;
				}

			}

		}
		// an user added dialogue for existing course
		else if(strtolower($dialog_data['course_dialogue_type']) == strtolower('existing'))
		{
			//return $dialog_data;
			if($dialog_data['course_title']=='')
			{
				$course_value = 'Untitled';
			}
			else
			{
				$course_value = htmlentities(trim($dialog_data['course_title']));
			}
			//add course first
			$course_field 				= 'Title';
			$node_type_id				=  '2';

			if($dialog_data['data_save'] =='minidialogue')
			{
				$course_instance_node_id           =   $dialog_data['course_node_id'];
			}
			else
			{

				$course_instance_node_id           =   $this->getNodeId('node-instance', 'node_instance_id', $courseInsId);
			}


			if($course_instance_node_id!='')
			{
				$final_ary = $this->addDialogueCourse($dialogue_node_class_id,$dialogue_title,$course_instance_node_id,$user_instance_node_id,$receipient_user_node_id,$saveType,$chatMessage,$action,$stmntTimestamp,$courseInsId,$course_value,$StmtType);

				//update course time stamp
				$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
				$dialog  			= $structureObj->updateCourseTimestamp($course_instance_node_id);

				if(!empty($final_ary))
				{
					return $final_ary;
				}
			}
		}
	}

	/**
	 * Function to add dialogue for course
	 */
	public function addDialogueCourse($dialogue_node_class_id,$dialogue_title,$course_instance_node_id,$user_instance_node_id,$receipient_user_node_id,$saveType,$chatMessage,$action,$stmntTimestamp,$courseInsId,$course_value,$StmtType)
	{
		//$dialogue_field 						=  array('Title','Admin','Timestamp');
		$dialogue_field 						=  array('Title', 'Admin', 'Timestamp', 'Updated Timestamp');
		$node_type_id							=  '2';
		$dialog_instance_id  					=  $this->createNodeInstanceCourseDialouge($dialogue_node_class_id,$node_type_id,$saveType);
		$final_ary 								=  array();
		// get dialog instance node id
		$dialog_instance_node_id  				=  $this->getInstanceNodeIdCourseDialogue($dialogue_node_class_id,$dialog_instance_id);
		foreach($dialogue_field as $value)
		{
			if($value =='Title')
			{
				if($dialogue_title=='')
				{
					$dialogue_title = 'Untitled';
				}
				else{
					$dialogue_title = $dialogue_title;
				}

			}
			else if($value =='Admin')
			{
				$dialogue_title = $user_instance_node_id;
			}
			else
			{
				$dialogue_title = date('Y-m-d H:i:s');
			}

			$node_class_property_id 						=    $this->getNodeClassPropertyIdCourseDialouge($dialogue_node_class_id,$value);

			if($dialog_instance_id)
			{
				$dialog_node_instance_property_id  		   	=    $this->createNodeInstanceCourseDialougeProperty($dialog_instance_id,$node_class_property_id,$node_type_id,$dialogue_title);
				if($value =='Title')
				{

					$final_ary['dialog_instance_node_id'] 			= $dialog_instance_node_id;
					$final_ary['dialog_node_instance_property_id'] 	= $dialog_node_instance_property_id;
					$final_ary['course_node_id'] 			= $course_instance_node_id;
					$final_ary['course_instance_id'] 				= $courseInsId;

				}

			}
		}

		//create xy relation between course and dialogue
		$xy_id = $this->createXYRelationCourseDialogue($course_instance_node_id,$dialog_instance_node_id);

		// create xy relation between user and dialogue
		$user_xy_id = $this->createXYRelationCourseDialogue($dialog_instance_node_id,$user_instance_node_id);


		//$course 	=  $this->insertAllCourseInfoById($course_instance_node_id);	 // course_info  //**arti //no use of this file




		/* Code here to add new actor for dialogue and course class awdhesh soni*/
		if(!empty($receipient_user_node_id))
		{

			$user_instance_string = rtrim($receipient_user_node_id, ',');
			$temp = explode(',',$user_instance_string);
			$admin_id  						=   $this->fetchDialogOwnerId($dialog_instance_node_id);
			$user_node_class_id = INDIVIDUAL_CLASS_ID;
			$final_ary['receipient_user_node_id'] = $receipient_user_node_id;
			//get all the instance of user associated with an dialogue
			$sql                					=	new Sql($this->adapter);
			$select									=	$sql->select();
			$select->from(array('xy' => 'node-x-y-relation'));
			$select->columns(array('node_x_y_relation_id'));
			$select->join(array('ni' => 'node-instance'), 'xy.node_x_id = ni.node_id',array());
			$select->where->equalTo('ni.node_class_id',$user_node_class_id);
			$select->where->AND->equalTo('xy.node_y_id',$dialog_instance_node_id);
			$select->where->AND->notequalTo('xy.node_x_id',$admin_id);
			//echo $select->getSqlstring();
			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$accountInfo	    	=	$resultObj->initialize($result)->toArray();

			if(!empty($accountInfo))
			{
				foreach($accountInfo as $value)
				{
					//delete all the instance of user associated with the dialogue
					$node_x_y_relation_id = $value['node_x_y_relation_id'];
					$sql = new Sql($this->adapter);
					$delete = $sql->delete();
					$delete->from('node-x-y-relation');
					$delete->where->equalTo('node_x_y_relation_id',$node_x_y_relation_id);
					$statement = $sql->prepareStatementForSqlObject($delete);
					$result = $statement->execute();
				}

			}

			foreach($temp as $key=> $value)
			{
				$res['node_y_id']  				= $dialog_instance_node_id;
				$res['node_x_id']  				= $temp[$key] ;
				//check the xy relation already exists or not between dialogue and user
				$sql                					=	new Sql($this->adapter);
				$select									=	$sql->select();
				$select->from(array('xy' => 'node-x-y-relation'));
				$select->where->equalTo('xy.node_y_id',$dialog_instance_node_id);
				$select->where->AND->equalTo('xy.node_x_id',$temp[$key]);
				$statement				=	$sql->prepareStatementForSqlObject($select);
				$result					=	$statement->execute();
				$resultObj				=	new ResultSet();
				$exitsInfo	    		=	$resultObj->initialize($result)->toArray();
				if(empty($exitsInfo))
				{
					//insert all the actor into the database to associate with the dialogue
					$sql 						=	new Sql($this->adapter);
					$query 						=	$sql->insert('node-x-y-relation');
					$query->values($res);
					//echo '<br>insert dialogue query:'.$query->getSqlstring();
					$statement 					=	$sql->prepareStatementForSqlObject($query);
					$result 					=	$statement->execute();
					$resultObj 					=	new ResultSet();
					$resultObj->initialize($result);
				}

				// check the relation between course and user
				$res['node_y_id']  				= $course_instance_node_id;
				$res['node_x_id']  				= $temp[$key] ;
				//check the xy relation already exists or not between dialogue and user
				$sql                					=	new Sql($this->adapter);
				$select									=	$sql->select();
				$select->from(array('xy' => 'node-x-y-relation'));
				$select->where->equalTo('xy.node_y_id',$course_instance_node_id);
				$select->where->AND->equalTo('xy.node_x_id',$temp[$key]);
				$statement				=	$sql->prepareStatementForSqlObject($select);
				$result					=	$statement->execute();
				$resultObj				=	new ResultSet();
				$exitsInfo	    =	$resultObj->initialize($result)->toArray();
				if(empty($exitsInfo))
				{
					//insert all the actor into the database to associate with the course
					$sql 						=	new Sql($this->adapter);
					$query 						=	$sql->insert('node-x-y-relation');
					$query->values($res);
					//echo '<br>insert Course query:'.$query->getSqlstring();
					$statement 					=	$sql->prepareStatementForSqlObject($query);
					$result 					=	$statement->execute();
					$resultObj 					=	new ResultSet();
					$resultObj->initialize($result);
				}

			}

			//insert all the user associated with dialogue in the file
			$this->insertAllDialogActorInstances($dialog_instance_node_id);   // dialogueactor
			//insert all the user not associated with dialogue in the file

			if($chatMessage!="")
			{
				if($StmtType == "Letter" )
				{
					/* function here to save blank statement for letter in container form // now parent id use in dialogue */
						$jsonArray['statements'] 				= $chatMessage;
						$jsonArray['user_instance_node_id']  	= $user_instance_node_id;
						$jsonArray['dialogueId'] 				= $dialog_instance_node_id;
						$jsonArray['Coursetype'] 				= $StmtType;
						$jsonArray['saveType'] 				    = $saveType;
						$jsonArray['timestamp']               	= date_timestamp_get(date_create());
						$savestate = $this->addLetterStatement($jsonArray);	// add statement letter data
				}
				else
				{
					$jsonArray['message'] 					= $chatMessage;
					$jsonArray['sender']  					= $user_instance_node_id;
					$jsonArray['dialogue_node_id'] 				= $dialog_instance_node_id;
					$jsonArray['action'] 					= "Statement";
				//	$jsonArray['messageType']               = "Statement";  **arti
					$jsonArray['type']               		= "Statement";

					$jsonArray['timestamp']               	= date_timestamp_get(date_create());;
					$prefixTitle                			=  PREFIX.'user_info';
					$jsonArray['username'] 					= $_SESSION[$prefixTitle]['first_name'].' '.$_SESSION[$prefixTitle]['last_name'];
					$jsonArray['courseSection']       		= 1;


					//$savestate = $this->saveMainStatementInstance($jsonArray);	// add statement chat data    **arti

					$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal
					$savestate  		= $structureObj->saveStatementInstance($jsonArray);	// add statement chat data
				}
			}
				$success   		= $this->updateDialogTimestamp($dialog_instance_node_id);
			}
			//$courseAry 			=  $this->insertAllDialougeIdBasesOfCourseId($course_instance_node_id);      // course_dialogue_list_course_id // removed by arti
			//$allCourseUser 		=  $this->insertAllCoursesInstanceByUser($user_instance_node_id);      	// user_course_data_   // removed by arti

			//$dialogAry 			=  $this->insertAllDialogueCourseInfoById($dialog_instance_node_id);	     	// dialogue_info

			$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialogAry  		= $structureObj->insertAllDialogueInfoById($dialog_instance_node_id); // dialogue_info // call structure builder table modal change by awdhesh

			$allDialougeUser = $this->insertAllDialogueInstanceByUser($user_instance_node_id);	   // user_dialogue_data_
			$final_ary['modeType'] = $StmtType;
		/* end code here */
		return $final_ary; // combination of $dialog_instance_node_id and $dialog_node_instance_property_id of title
	}

	/**
	 * Function to fetch all the user associated  course
	 *  Created By Arti
	 */
	public function getActorInstances($variable_data)
	{
		$user_class_node_id = INDIVIDUAL_CLASS_ID;
        //return INDIVIDUAL_LAST_NAME;
        $course_instance_node_id  = $variable_data['course_node_id'];
        // get all the user associated with the course.
        $sql = new Sql($this->adapter);
        $select = $sql->select();
//        $select->from(array('nip' => 'node-instance-property'));
//        $select->columns(array('value'));
//        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
//        $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array('caption'));
//        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_instance_node_id'=>'node_x_id'));
//        $select->where->equalTo('xy.node_y_id', $course_instance_node_id);
//        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
//        $select->where->AND->equalTo('ni.status', 1);
//        $select->where->NEST
//                ->equalTo('ncp.caption', 'First Name')
//                ->OR
//                ->equalTo('ncp.caption', 'Last Name')
//                ->UNNEST;
        $select->from(array('nip' => 'node-instance-property'));
        $select->columns(array('user_name'=>new Predicate\Expression('GROUP_CONCAT(nip.value SEPARATOR " ")')));
        $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
        $select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id', array('user_id'=>'node_x_id'));
        $select->join(array('xy1' => 'node-x-y-relation'), 'xy1.node_y_id = xy.node_x_id', array());
        $select->join(array('ni1' => 'node-instance'), 'ni1.node_id = xy1.node_x_id', array());
        $select->join(array('nip1' => 'node-instance-property'), 'nip1.node_instance_id = ni1.node_instance_id', array('user_email'=>'value'));
        $select->where->equalTo('xy.node_y_id', $course_instance_node_id);
        $select->where->AND->equalTo('ni.node_class_id', $user_class_node_id);
        $select->where->AND->equalTo('ni.status', 1);
        $select->where->AND->equalTo('ni1.node_class_id', ACCOUNT_CLASS_ID);
        $select->where->AND->equalTo('nip1.node_class_property_id', INDIVIDUAL_EMAIL_ID);
        $select->where(new Predicate\Expression('nip.node_class_property_id in('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'));
        $select->group('xy.node_x_id');
        //return $select->getSqlString();
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $userArray = $resultObj->initialize($result)->toArray();

//		$sql       = "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = '$course_instance_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' AND `ni`.`status` = '1' AND (ncp.caption ='First Name' or ncp.caption ='Last Name')";
//        $statement = $this->adapter->query($sql);
//        $result    = $statement->execute();
//        $resultObj = new ResultSet();
//        $userArray = $resultObj->initialize($result)->toArray();
//        $user_data = '';
//        $user_ids  = '';
//        $temp_ary  = array();
//        foreach ($userArray as $output) {
//            $user_instance_node_id                                     = $output['user_instance_node_id'];
//            $caption                                                   = $output['caption'];
//            $temp_ary[$user_instance_node_id][$caption]                = $output['value'];
//            $temp_ary[$user_instance_node_id]['user_instance_node_id'] = $user_instance_node_id;
//        }
        foreach ($userArray as $val) {
//            $username              = $val['First Name'] . " " . $val['Last Name'];
//            $user_instance_node_id = $val['user_instance_node_id'];
            $user_data .= $val['user_name'] . ", ";
            $user_ids .= $val['user_id'] . ",";
            $user_email .= $val['user_email'] . ",";
        }
		$mainAry              = array();
        $mainAry['user_name']                 = rtrim($user_data, ', ');
        $mainAry['user_id']                   = rtrim($user_ids, ',');
        $mainAry['user_email']                = rtrim($user_email, ',');
		return $mainAry ;
	}
	/**
	 * Function to save the statement instances
	 * Created by Awdhesh Soni
	 */
	public function saveMainStatementInstance($jsonArray1)
	{


		$node_class_id  		= STATEMENT_CLASS_ID;
		$node_type_id			= '2';
		$jsonArray['message'] 	= trim($jsonArray1['message']);
		//$br_converted 			= preg_replace('#<br />(\s*<br />)+#', '<br />',nl2br($jsonArray['message']));
		//$br_converted 			= str_replace(array("\r\n", "\n\r", "\r", "\n"), "", $jsonArray1['message']);
	    $message =  str_replace('"', '', $jsonArray['message']);
	    $temp 					= explode('\n',$message);
		$folder_path     		= ABSO_URL . "data/perspective_cache/";
        // AWS S3
        $awsObj         = new AwsS3();
		if($jsonArray1['dialogue_node_id']!='' && $jsonArray1['sender']!='')
		{
			$node_ids = '';
			for($k = 0; $k<count($temp); $k++){
			//create node id first
			$data['node_id']				=	$this->createNodeCourseDialogue();
			$data['node_class_id']			=	$node_class_id;
			$data['node_type_id']			=	$node_type_id;
			$data['caption']	    		=   $data['node_id'];
			$data['status']         		=   '1';

			$sql 							=	new Sql($this->adapter);
			$query 							=	$sql->insert('node-instance');
			$query->values($data);
			$statement 						=	$sql->prepareStatementForSqlObject($query);
			$result 						=	$statement->execute();
			$resultObj 						=	new ResultSet();
			$resultObj->initialize($result);
			$node_instance_id            	=   $this->adapter->getDriver()->getLastGeneratedValue();
			$statement_instance_node_id  	=   $data['node_id'];

			if( $jsonArray1['messageType'] == 'Statement')
			{
				$node_ids .= $node_instance_id.'~';
			}
			else {
					$node_ids .= $node_instance_id.'~';
				}
			//insert value in node instance property.
			//get the node class property id
			$sql                	=	new Sql($this->adapter);
			$select					=	$sql->select();
			$select->from('node-class-property');
			$select->where->equalTo('node_class_id',$node_class_id  );
			$select->where->notEqualTo('node_class_property_parent_id',0);

			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$classArray		    	=	$resultObj->initialize($result)->toArray();

			$valueArray = array();

			array_push($valueArray,$jsonArray1['sender']);
			array_push($valueArray,$jsonArray1['action']);
			//array_push($valueArray,$jsonArray1['message']);
			array_push($valueArray, htmlentities($temp[$k]));
			array_push($valueArray,$jsonArray1['timestamp']);


			$i = 0;
			foreach($classArray as $value)
			{
			$output['node_id']					=	$this->createNodeCourseDialogue();
			$output['node_instance_id'] 		=   $node_instance_id;
			$output['node_class_property_id'] 	=   $value['node_class_property_id'];
			$output['node_type_id']	            =	$node_type_id;
			$output['value']	    			=   trim($valueArray[$i]);

			$sql 								=	new Sql($this->adapter);
			$query 								=	$sql->insert('node-instance-property');
			$query->values($output);

			$statement 							=	$sql->prepareStatementForSqlObject($query);
			$result 							=	$statement->execute();
			$resultObj 							=	new ResultSet();
			$resultObj->initialize($result);
			$id          						=   $this->adapter->getDriver()->getLastGeneratedValue();

			$i++;

			}

			///write data into the file.
			$filename = 'dialogue_'.$jsonArray1['dialogue_node_id'];
			$txt_filename =  $filename.".txt";
			$file_path = $folder_path.$txt_filename;

			//$file_create = fopen($file_path, "a+") or die('cannot create file');

			//$date_val = '2015-12-28';// date('Y-m-d',strtotime($jsonArray1['timestamp']));
				//$timestamp = date('2015-12-28 H:i:s',strtotime($jsonArray1['timestamp']));
			$date_val 	= date('Y-m-d',strtotime($jsonArray1['timestamp']));

			$timestamp 	= date('Y-m-d H:i:s',strtotime($jsonArray1['timestamp']));
			$statement_type  	= $jsonArray1['action'];  //'text';//;
			$statement   		= htmlentities($temp[$k]);
			$username   		= htmlentities($jsonArray1["username"]);
			$sender   			= htmlentities($jsonArray1["sender"]);
			$node_instance_id  	= $node_instance_id;
            $awsFilePath   = "data/perspective_cache/$txt_filename";
			//$separation_string = array()
			//if (file_exists($file_path))
            $file_data = '';
            if ($awsObj->isObjectExist($awsFilePath)) {
				//$file_data = file_get_contents($file_path);
                $file_data_res = $awsObj->getFileData($awsFilePath);
                $file_data = $file_data_res['data'];
				$count = strlen(trim($file_data));

				/*if($count ==0)
				{
					$insert_string = $date_val.'x~x'.'timestamp='.$timestamp.'#~#'.'statement_type='.$statement_type.'#~#'.'statement='.$statement.'#~#'.'username='.$username.'#~#'.'node_instance_id='.$node_instance_id.'#~#'.'actor='.$sender ;
				}
				else
				{*/
					if (strpos($file_data,$date_val ) !== false)
					{
						$insert_string = '#~#'.'timestamp='.$timestamp.'#~#'.'statement_type='.$statement_type.'#~#'.'statement='.$statement.'#~#'.'username='.$username.'#~#'.'node_instance_id='.$node_instance_id.'#~#'.'actor='.$sender ;
					}
					else
					{
						$insert_string = 'x~x'.$date_val.'x~x'.'timestamp='.$timestamp.'#~#'.'statement_type='.$statement_type.'#~#'.'statement='.$statement.'#~#'.'username='.$username.'#~#'.'node_instance_id='.$node_instance_id.'#~#'.'actor='.$sender ;

					}
				//}
			} else {
                $insert_string = $date_val.'x~x'.'timestamp='.$timestamp.'#~#'.'statement_type='.$statement_type.'#~#'.'statement='.$statement.'#~#'.'username='.$username.'#~#'.'node_instance_id='.$node_instance_id.'#~#'.'actor='.$sender ;
            }

			//fputs($file_create, trim($insert_string));
            $awsObj->setFileData($awsFilePath, $file_data.trim($insert_string), "text");
			//maintain xy relation between dialogue instance node id and statement instance node id
			$res['node_y_id']  			= $jsonArray1['dialogue_node_id'];
			$res['node_x_id']  			= $statement_instance_node_id ;
			$sql 						=	new Sql($this->adapter);
			$query 						=	$sql->insert('node-x-y-relation');
			$query->values($res);

			$statement 					=	$sql->prepareStatementForSqlObject($query);
			$result 					=	$statement->execute();
			$resultObj 					=	new ResultSet();
			$resultObj->initialize($result);
			}

			if($jsonArray1['messageType'] == 'Statement')
			{

				$node_instance_id = rtrim($node_ids, '~');
			}
			else
			{
				$node_instance_id = $node_instance_id;
			}
			//update the dialogue on which comment has been done
			$success = $this->updateDialogTimestamp($jsonArray1['dialogue_node_id']);
			if($success)
			{
				// update dialog detail
				//$dialogAry = $this->insertAllDialogueInstanceByUser($jsonArray['sender']);
				//$dialogAry = $this->getDialogInfo($jsonArray['sender']);
			}

		}

		return $node_instance_id;
	}
	public function appendStatement($data,$chatMessage)
	{
		if($chatMessage!="")
			{
				$jsonArray['message'] 					= $data['message'];  //$chatMessage; **arti
				$jsonArray['sender']  					= $data['user_instance_node_id'];
				$jsonArray['course_node_id']  	= $data['course_node_id'];
				$jsonArray['dialogue_node_id'] 				= $data['dialogue_node_id'];
				$jsonArray['action'] 					=	'';

				if(isset($data['filetype']) && !empty($data['filetype']) && ($data['filetype']=='image')){
					$jsonArray['action'] 					= "image";
					$jsonArray['type']               = "image";
				}else if(isset($data['filetype']) && !empty($data['filetype']) && $data['filetype']=='attachment'){
					$jsonArray['action'] 					= "attachment";
					$jsonArray['type']               = "attachment";
				}else {
					if($data['node_instance_propertyid']!=""){
						$jsonArray['action'] = 'editMessage';
						$jsonArray['node_instance_propertyid'] = $data['node_instance_propertyid'];
					}else {
						$jsonArray['action'] 			    = "Statement";
					}

					$jsonArray['type']                  = "Statement";
				}

				$jsonArray['timestamp']               	= $data['timestamp'];
				$prefixTitle                            = PREFIX.'user_info';
				$jsonArray['username'] 					= $_SESSION[$prefixTitle]['first_name'].' '.$_SESSION[$prefixTitle]['last_name'];
			//	$savestate = $this->saveMainStatementInstance($jsonArray);	// add statement chat data               //comment by arti

				$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal
				$savestate  		= $structureObj->saveStatementInstance($jsonArray);	// add statement chat data


				if($data['courseStatementType'] == "Draft" && $data['diaStatusType'] == "Draft")
				{
					$this->updatecourseStatus($data['course_node_id'], $data['dialogue_node_id']);
				}
				else if($data['courseStatementType'] == "Published" && $data['diaStatusType'] == "Draft"){
					$this->updatecourseStatus($data['course_node_id'], $data['dialogue_node_id']);
				}

			}
			return $savestate;
	}
	public function updatecourseStatus($courseInsId,$dialogueId)
	{
			$instancedata['status'] 		= 	1;
			$sql 							=	new Sql($this->adapter);
			$query 							=	$sql->update();
			$query->table('node-instance');
			$query->set($instancedata);
			$query->where->equalTo('node_instance_id',$courseInsId);
			$statement 						=	$sql->prepareStatementForSqlObject($query);
			$result 						=	$statement->execute();
			$data['status'] 				= 	1;
			$sql 							=	new Sql($this->adapter);
			$query 							=	$sql->update();
			$query->table('node-instance');
			$query->set($data);
			$query->where->equalTo('node_id',$dialogueId);

			$statement 						=	$sql->prepareStatementForSqlObject($query);
			$dialogue 						=	$statement->execute();
			$success 						=   $this->updateDialogTimestamp($dialogueId);
			$structureObj 					=   new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialog  						=   $structureObj->insertAllDialogueInfoById($dialogueId); // dialogue_info // call structure builder table modal change by awdhesh
			$courseAry 						=   $this->insertAllCourseInfoById($dialogueId);
	}
	/* function here to update dialogue title here  awdhesh soni*/
	public function saveDialogTitle($node_instance_property_id,$dialog_title)
	{
		$sql                	=	new Sql($this->adapter);
		$data['value']			=	htmlentities(trim($dialog_title));
		if(intval($node_instance_property_id) > 0)
		{
			$query 					=	$sql->update();
			$query->table('node-instance-property');
			$query->set($data);
			$query->where(array('node_instance_property_id' => $node_instance_property_id));

		//return  $query->getSqlstring();die;
		$statement 					=	$sql->prepareStatementForSqlObject($query);
		$result 					=	$statement->execute();
		$resultObj 					=	new ResultSet();
		$affectedRows 		        = 	$result->getAffectedRows();
		if($affectedRows)
		{

			$sql                					=	new Sql($this->adapter);
			$select									=	$sql->select();
			$select->from(array('nip' => 'node-instance-property'));
			$select->columns(array('value'));
			$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('dialog_instance_node_id'=>'node_id'));
			$select->where->AND->equalTo('nip.node_instance_property_id',$node_instance_property_id);
			/// return $select->getSqlstring();die;
			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$userArray				=	$resultObj->initialize($result)->toArray();
			//update the dialogue timestamp
			$success 				=  $this->updateDialogTimestamp($userArray['0']['dialog_instance_node_id']);
			//$dialogAry 				=  $this->insertAllDialogueCourseInfoById($userArray['0']['dialog_instance_node_id']);
			$structureObj 			= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialogAry  			= $structureObj->insertAllDialogueInfoById($userArray['0']['dialog_instance_node_id']); // dialogue_info // call structure builder table modal change by awdhesh
		}
		/* Work here to start save statement notification for dialogue instance class awdhesh soni */
			// STATEMENT SUBCLASS
        $statement_class_id             =   STATEMENT_CLASS_ID;
        $statementPropertiesArray       =   $this->getPropertiesStatement($statement_class_id);
        foreach($statementPropertiesArray as $key => $statementClassProperty) {
            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
        }
        	$prefixTitle                            = PREFIX.'user_info';
        	$userName = $_SESSION[$prefixTitle]['first_name'].' '.$_SESSION[$prefixTitle]['last_name'];
       		$statementNotification               =  $userName.' has renamed this dialogue to'.' '.$dialog_title;
            $instance_property_array    =   array();
            $instance_property_array[0] =   "";
            $instance_property_array[1] =   'd_notification';
            $instance_property_array[2] =   $statementNotification;
            $instance_property_array[3] =   "";
            $saveType = "P";

            $instance_caption           =   "";
            $node_type_id               = 	2;
            $node_instance_id           =   $this->createNotificationInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
            // create new instance property //
            $this->createInstanceNotificationProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
            //get node_id of node instance table for series class
            $node_instance_ids          = $this->getinstanceDetails($node_instance_id);

            $this->createXYRelationCourseDialogue($userArray['0']['dialog_instance_node_id'],$node_instance_ids);
            $this->insertAllDialogueNotificationById($userArray['0']['dialog_instance_node_id']);  // dialogue_statement_notification_dialogue_id
		/* end code here */
			return $affectedRows;
		}
	}
	/* function here to update course title here awdhesh soni*/
	public function saveCourseTitle($node_instance_property_id,$course_title,$dialogue_node_id)
	{
		$sql                	=	new Sql($this->adapter);
		$data['value']			=	htmlentities(trim($course_title));
		if(intval($node_instance_property_id) > 0)
		{
			$query 					=	$sql->update();
			$query->table('node-instance-property');
			$query->set($data);
			$query->where(array('node_instance_property_id' => $node_instance_property_id));

		//return  $query->getSqlstring();die;
		$statement 					=	$sql->prepareStatementForSqlObject($query);
		$result 					=	$statement->execute();
		$resultObj 					=	new ResultSet();
		$affectedRows 		        = 	$result->getAffectedRows();
		if($affectedRows)
		{

			$sql                					=	new Sql($this->adapter);
			$select									=	$sql->select();
			$select->from(array('nip' => 'node-instance-property'));
			$select->columns(array('value'));
			$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('dialog_instance_node_id'=>'node_id'));
			$select->where->AND->equalTo('nip.node_instance_property_id',$node_instance_property_id);
			/// return $select->getSqlstring();die;
			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$userArray				=	$resultObj->initialize($result)->toArray();
			//update the dialogue timestamp
			$success 				=  $this->updateDialogTimestamp($userArray['0']['dialog_instance_node_id']);
			//$dialogAry 				=  $this->insertAllDialogueInfoById($userArray['0']['dialog_instance_node_id']);
			$structureObj 			= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialogAry  			= $structureObj->insertAllDialogueInfoById($dialogue_node_id); // dialogue_info // call structure builder table modal change by awdhesh
		}
		/* Work here to start save statement notification for dialogue instance class awdhesh soni */
			// STATEMENT SUBCLASS
        $statement_class_id             =   STATEMENT_CLASS_ID;
        $statementPropertiesArray       =   $this->getPropertiesStatement($statement_class_id);
        foreach($statementPropertiesArray as $key => $statementClassProperty) {
            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
        }
        	$prefixTitle                            = PREFIX.'user_info';
        	$userName = $_SESSION[$prefixTitle]['first_name'].' '.$_SESSION[$prefixTitle]['last_name'];
       		$statementNotification               =  $userName.' has renamed this course to'.' '.$course_title;
            $instance_property_array    =   array();
            $instance_property_array[0] =   "";
            $instance_property_array[1] =   'c_notification';
            $instance_property_array[2] =   $statementNotification;
            $instance_property_array[3] =   "";
            $saveType = "P";

            $instance_caption           =   "";
            $node_type_id               = 	2;
            $node_instance_id           =   $this->createNotificationInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
            // create new instance property //
            $this->createInstanceNotificationProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
            //get node_id of node instance table for series class
            $node_instance_ids          = $this->getinstanceDetails($node_instance_id);

            $this->createXYRelationCourseDialogue($userArray['0']['dialog_instance_node_id'],$node_instance_ids);
            $this->insertAllCourseNotificationById($userArray['0']['dialog_instance_node_id']);  // dialogue_statement_notification_dialogue_id
		/* end code here */
			return $affectedRows;
		}
	}
	/* code here to fetch the dialogue notification statement */
	/**
	 * Function to insert all the dialogue info associated with the dialogue in file
	 * Created by Awdhesh Soni
	 */
	public function insertAllDialogueNotificationById($dialogue_instance_node_id)
	{
		$statementNotAry  	= $this->getAllDialogueNotification($dialogue_instance_node_id);

		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'dialogue_statement_notification_'.$dialogue_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$notification_title 			= $statementNotAry['notificationStr'];
		$notification_instance_id 		= $statementNotAry['notificationnodeId'];
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'statement_notification='.$notification_title.'#~#'.'statement_instance_node_id='.$notification_instance_id;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'statement_notification='.$notification_title.'#~#'.'statement_instance_node_id='.$notification_instance_id;

		}
		//chmod($file_path, 511);
		fputs($file_create, trim($insert_string));

		fclose($file_create);*/
	}
	/* code here to fetch the course notification statement */
	/**
	 * Function to insert all the course info associated with the course in file
	 * Created by Awdhesh Soni
	 */
	public function insertAllCourseNotificationById($dialogue_instance_node_id)
	{
		$statementNotAry  	= $this->getAllDialogueNotification($dialogue_instance_node_id);

		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'course_statement_notification_'.$dialogue_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$notification_title 			= $statementNotAry['notificationStr'];
		$notification_instance_id 		= $statementNotAry['notificationnodeId'];
		if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'statement_notification='.$notification_title.'#~#'.'statement_instance_node_id='.$notification_instance_id;

		}
		//chmod($file_path, 511);
		fputs($file_create, trim($insert_string));

		fclose($file_create);
	}
	/* get All dialogue Statement Notification*/
	public function getAllDialogueNotification($dialogue_instance_node_id){
		$statement_node_class_id = STATEMENT_CLASS_ID;
		$sql                	=	new Sql($this->adapter);
		$select					 =	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('statement_instance_node_id'=>'node_id','node_instance_id'=>'node_instance_id'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array());
		$select->where->equalTo('xy.node_y_id',$dialogue_instance_node_id);
		$select->where->AND->equalTo('ni.node_class_id',$statement_node_class_id);
		$select->where->AND->equalTo('ni.status',1);
		/*echo $select->getSqlstring();
		die;*/
		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$instanceAry					=	$resultObj->initialize($result)->toArray();

		$main_ary = array();
		$i = 0;
		foreach( $instanceAry as $value )
		{

			$node_instance_id = $value['node_instance_id'];
			$sql                	=	new Sql($this->adapter);
			$select					 =	$sql->select();
			$select->from(array('nip' => 'node-instance-property'));
			$select->columns(array('value'=>'value'));
			$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
			$select->where->equalTo('nip.node_instance_id',$node_instance_id);
			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$propertyAry			=	$resultObj->initialize($result)->toArray();

			$inner_ary = array();
			$notificationStr = "";
			$notificationnodeId = "";
			$tempArr = array();
			foreach($propertyAry as $output)
			{
				$value =  $output['value'];
				$caption = $output['caption'];
				$inner_ary[$caption] = $value;

			}
			$inner_ary['node_instance_id'] = $node_instance_id;
			$main_ary[$i] = $inner_ary;
			//return $main_ary;
			$i++;
		}
		foreach ($main_ary as $key => $val) {
			$notificationStr.= $val['Statement'].',';
			$notificationnodeId.= $val['node_instance_id'].',';
			$tempArr['notificationStr'] = rtrim($notificationStr, ', ');
			$tempArr['notificationnodeId'] = rtrim($notificationnodeId, ', ');
		}
		return $tempArr;
	}
	/* end code here */
	public function getPropertiesStatement($node_y_class_id,$is_parent='N')
	{
		$sql                	=	new Sql($this->adapter);
		$select					=	$sql->select();
		$select->from('node-class-property');
		$select->where->equalTo('node_class_id',$node_y_class_id);

		if($is_parent == 'Y')
			$select->where->equalTo('node_class_property_parent_id',0);
		else
			$select->where->notEqualTo('node_class_property_parent_id',0);
		$select->order('sequence ASC');
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		return $resultObj->initialize($result)->toArray();
	}
	public function createNotificationInstance($instance_caption,$node_class_id,$node_type_id,$saveType,$node_instance_id)
	{
		$data['caption']			=	$this->mc_encrypt($instance_caption, ENCRYPTION_KEY);
		$data['encrypt_status']		=	ENCRYPTION_STATUS;
		$data['node_type_id']		=	$node_type_id;
		if($saveType == 'D')
			$data['status']			=	0;
		else
			$data['status']			=	1;
		$sql 						=	new Sql($this->adapter);
		if(intval($node_instance_id) > 0)
		{
			$query 					=	$sql->update();
			$query->table('node-instance');
			$query->set($data);
			$query->where(array('node_instance_id' => $node_instance_id));
		}
		else
		{
			$data['node_id']		=	$this->createNodeCourseDialogue();
			if($data['caption']==""){
				$data['caption']		=	$data['node_id'];
			}
			$data['node_class_id']	=	$node_class_id;
			$query 					=	$sql->insert('node-instance');
			$query->values($data);
		}
		$statement 					=	$sql->prepareStatementForSqlObject($query);
		$result 					=	$statement->execute();
		$resultObj 					=	new ResultSet();
		$resultObj->initialize($result);

		if(empty($node_instance_id))
			$node_instance_id 		=	$this->adapter->getDriver()->getLastGeneratedValue();

		return $node_instance_id;
	}
	public function createInstanceNotificationProperty($instance_property_id,$instance_property_caption,$node_instance_id,$node_type_id)
	{
		foreach($instance_property_id as $key => $value)
		{
			if(trim($instance_property_caption[$key]) != '')
			{
				$newVal 									=	trim($this->mc_encrypt($instance_property_caption[$key], ENCRYPTION_KEY));
				if(substr($newVal, -3) == CHECKBOX_SEPERATOR)
				{
					$newValArray = explode(CHECKBOX_SEPERATOR, $newVal);
					foreach($newValArray as $k => $v)
					{
						if(trim($v) != "")
						{
							$data 										=	array();
							$data['value']								=	htmlspecialchars($v);  // modified code section awdhesh soni
							$data['encrypt_status']						=	ENCRYPTION_STATUS;
							$data['node_instance_id']					=	$node_instance_id;
							$data['node_id']							=	$this->createNodeCourseDialogue();
							$data['node_type_id']						=	$node_type_id;
							$data['node_class_property_id']				=	$value;

							$sql 										=	new Sql($this->adapter);
							$query 										=	$sql->insert('node-instance-property');
							$query->values($data);
							$statement 									=	$sql->prepareStatementForSqlObject($query);
							$result 									=	$statement->execute();
						}
					}
				}
				else
				{
					$data 										=	array();
					$data['value']								=	htmlspecialchars($newVal); // modified code section awdhesh soni
					$data['encrypt_status']						=	ENCRYPTION_STATUS;
					$data['node_instance_id']					=	$node_instance_id;
					$data['node_id']							=	$this->createNodeCourseDialogue();
					$data['node_type_id']						=	$node_type_id;
					$data['node_class_property_id']				=	$value;

					$sql 										=	new Sql($this->adapter);
					$query 										=	$sql->insert('node-instance-property');
					$query->values($data);
					$statement 									=	$sql->prepareStatementForSqlObject($query);
					$result 									=	$statement->execute();
				}
			}
		}
	}
	/*end code here */
	/**
	 * Function to insert all the dialogue associated with the user in file
	 * Created by Awdhesh soni
	 */
	public function insertAllDialogueInstanceByUser($user_instance_node_id)
	{
		$dialogAry  	= $this->getAllDialogueInstancesByUser($user_instance_node_id);

		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'user_dialogue_data_'.$user_instance_node_id;

		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		//$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$dialogue_instance_node_id = $dialogAry['dialogue_instance_node_id'];
		$node_instance_id = $dialogAry['node_instance_id'];
        // AWS S3 code
        $awsObj       = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'node_instance_id='.$node_instance_id ;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'node_instance_id='.$node_instance_id ;

		}*/
			//chmod($file_path, 511);
		//fputs($file_create, trim($insert_string));
		//fclose($file_create);
                // Update Permission for double instance
                //chmod($file_path, 0777);
	}
	/**
	 * Function to fetch all the dialogue associated with the user from database
	 * Created by Awdhesh Soni
	 */
 	public function getAllDialogueInstancesByUser($user_instance_node_id)
 	{
		$dialogue_node_class_id = DIALOGUE_CLASS_ID;
		//get all dialogue instance associated with an user	 according to time stamp as well as not equal to Document
		$sql 		        =   "SELECT `ni`.`node_id` AS `dialogue_instance_node_id`,ni.node_instance_id
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id`
		WHERE ni.node_instance_id NOT IN
		(SELECT ni.node_instance_id
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id`
		WHERE `xy`.`node_x_id` = $user_instance_node_id
		AND `ni`.`node_class_id` = $dialogue_node_class_id
		AND nip.value ='Document')
		AND  `xy`.`node_x_id` = $user_instance_node_id
		AND `ni`.`node_class_id` = $dialogue_node_class_id
		AND `ncp`.`caption` = 'Timestamp' AND `ni`.`status` = '1'
		ORDER BY `nip`.`value` DESC";

		/*
		echo $sql->getSqlstring();
		die('fff');
		*/
		$statement 			=   $this->adapter->query($sql);
    	$result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$x_yArray		    =	$resultObj->initialize($result)->toArray();

		$dialog_array = '';
		$dialog_instance_ary ='';
		$mainAry = array();
		foreach( $x_yArray as $value )
		{
		    $dialogue_instance_node_id  =  $value['dialogue_instance_node_id'] ;//22292
			$node_instance_id  		    =  $value['node_instance_id'];
			$dialog_array .= $dialogue_instance_node_id.",";
			$dialog_instance_ary.= $node_instance_id.",";
		}
		$mainAry['dialogue_instance_node_id'] = $dialog_array;
		$mainAry['node_instance_id'] 		  = $dialog_instance_ary;
		return $mainAry;
	}
	/**
	 * Function to insert all the courses associated with the user in file
	 * Created by Awdhesh soni
	 */
	public function insertAllCoursesInstanceByUser($user_instance_node_id)
	{
		$courseAry  	=  $this->getAllCoursesInstancesByUser($user_instance_node_id);
		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'user_course_data_'.$user_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		//$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$course_instance_node_id = $courseAry['course_node_id'];
		$node_instance_id = $courseAry['node_instance_id'];
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'course_instance_node_id='.$course_instance_node_id.'#~#'.'node_instance_id='.$node_instance_id ;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'course_instance_node_id='.$course_instance_node_id.'#~#'.'node_instance_id='.$node_instance_id ;

		}*/
		//chmod($file_path, 511);
		//fputs($file_create, trim($insert_string));

		//fclose($file_create);
                // Update Permission for double instance
                //chmod($file_path, 0777);
	}
	/**
	 * Function to fetch all the dialogue associated with the user from database
	 * Created by Awdhesh Soni
	 */
 	public function getAllCoursesInstancesByUser($user_instance_node_id)
 	{
		$course_node_class_id = COURSE_CLASS_ID;
		//get all dialogue instance associated with an user	 according to time stamp as well as not equal to Document
		$sql 		        =   "SELECT `ni`.`node_id` AS `course_node_id`,ni.node_instance_id
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id`
		WHERE ni.node_instance_id NOT IN
		(SELECT ni.node_instance_id
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_y_id` = `ni`.`node_id`
		WHERE `xy`.`node_x_id` = $user_instance_node_id
		AND `ni`.`node_class_id` = $course_node_class_id
		AND nip.value ='Document')
		AND  `xy`.`node_x_id` = $user_instance_node_id
		AND `ni`.`node_class_id` = $course_node_class_id
		AND `ncp`.`caption` = 'Timestamp' AND `ni`.`status` = '1'
		ORDER BY `nip`.`value` DESC";

		/*
		echo $sql->getSqlstring();
		die('fff');
		*/
		$statement 			=   $this->adapter->query($sql);
    	$result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$x_yArray		    =	$resultObj->initialize($result)->toArray();

		$course_array = '';
		$course_instance_ary ='';
		$mainAry = array();
		foreach( $x_yArray as $value )
		{
		    $course_instance_node_id  =  $value['course_node_id'] ;//22292
			$node_instance_id  		    =  $value['node_instance_id'];
			$course_array .= $course_instance_node_id.",";
			$course_instance_ary.= $node_instance_id.",";
		}
		$mainAry['course_node_id'] = $course_array;
		$mainAry['node_instance_id'] 		= $course_instance_ary;
		return $mainAry;
	}
	/**
	 * Function to insert all the dialogue's actor into the file
	 */
	public function insertAllDialogActorInstances($dialog_instance_node_id)
	{
		$folder_path     		=  ABSO_URL . "data/perspective_cache/";
		$filename 				= 'dialogueactor'.$dialog_instance_node_id;

		$txt_filename =  $filename.".txt";
		$file_path = $folder_path.$txt_filename;
		//$file_create = fopen($file_path, "w+") or die('cannot create file');
        // AWS S3
        $awsObj        = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = '';
		$userAry  = $this->getAllActorInstances($dialog_instance_node_id);
		/*echo '<pre>';
		print_r($userAry);
		*/
		foreach($userAry as $value)
		{

			$first_name = $value['first name'];
			$last_name = $value['last name'];
			$user_instance_node_id = $value['id'];
			$admin = $value['admin'];
			$email_address = $value['email address'];
			$user_name = $value['first name'].$value['last name'];
			//if (file_exists($file_path))
            if ($awsObj->isObjectExist($awsFilePath)) {
				//$file_data = file_get_contents($file_path);
                $file_data_res = $awsObj->getFileData($awsFilePath);
                $file_data = $file_data_res['data'];
				$count = strlen(trim($file_data));

				/*if(!$count)
				{
					$insert_string = 'user_instance_node_id='.$user_instance_node_id.'#~#'.'first_name='.$first_name.'#~#'.'last_name='.$last_name.'#~#'.'admin='.$admin.'#~#'.'email_address='.$email_address.'#~#'.'user_name='.$user_name  ;
				}
				else
				{*/
					$insert_string = 'x~x'.'user_instance_node_id='.$user_instance_node_id.'#~#'.'first_name='.$first_name.'#~#'.'last_name='.$last_name.'#~#'.'admin='.$admin.'#~#'.'email_address='.$email_address.'#~#'.'user_name='.$user_name  ;
				//}
			} else {
                $insert_string = 'user_instance_node_id='.$user_instance_node_id.'#~#'.'first_name='.$first_name.'#~#'.'last_name='.$last_name.'#~#'.'admin='.$admin.'#~#'.'email_address='.$email_address.'#~#'.'user_name='.$user_name  ;
            }
				//chmod($file_path, 511);
				//fputs($file_create, trim($insert_string));
            $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		}
	}
	/*
	 * Function to update the timestamp property
	 */
	public function updateDialogTimestamp($dialog_instance_node_id)
	{
		 $sql           = new Sql($this->adapter);
        $data['value'] = date("Y-m-d H:i:s");
        if (intval($dialog_instance_node_id) > 0) {
            //get the node-instance-property id
            $sql    = new Sql($this->adapter);
            $select = $sql->select();
            $select->from(array('nip' => 'node-instance-property'));
            $select->columns(array('node_instance_property_id'));
            $select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id', array());
            $select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id', array());
            $select->where->AND->equalTo('ni.node_id', $dialog_instance_node_id);
            $select->where->AND->equalTo('ncp.caption', 'Updated Timestamp');
            $statement                 = $sql->prepareStatementForSqlObject($select);
            $result                    = $statement->execute();
            $resultObj                 = new ResultSet();
            $AdminArray                = $resultObj->initialize($result)->toArray();
            $node_instance_property_id = $AdminArray['0']['node_instance_property_id'];
            $query = $sql->update();
            $query->table('node-instance-property');
            $query->set($data);
            $query->where(array('node_instance_property_id' => $node_instance_property_id));
            $statement    = $sql->prepareStatementForSqlObject($query);
            $result       = $statement->execute();
            $resultObj    = new ResultSet();
            return $affectedRows = $result->getAffectedRows();
        }
	}
	/**
	 * Function to insert all the dialogue info associated with the dialogue in file
	 * Created by Awdhesh Soni
	 */
	public function insertAllDialogueCourseInfoById($dialogue_instance_node_id)
	{
		//$dialogAry  	= $this->getAllDialogueByDilaogCourseId($dialogue_instance_node_id);
		$structureObj 	= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        $dialogAry  	= $structureObj->getAllDialogueInstancesInfo($dialogue_instance_node_id);

		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'dialogue_info_'.$dialogue_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		//$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$dialogue_instance_node_id = $dialogAry['dialogue_instance_node_id'];
		$dialog_title 	= $dialogAry['dialog_title'];
		$course_title 	= $dialogAry['course_title'];
		$user_name 		= $dialogAry['user_name'];
		$user_id 		= $dialogAry['user_id'];
		$createdBy      = $dialogAry['dialog_admin'];
		$dialogueStatus = $dialogAry['dialog_status'];

		$node_instance_property_id 	= $dialogAry['node_instance_property_id'];
		$course_instance_node_id 	= $dialogAry['course_node_id'];
		$search_info 	= $dialogAry['search_info'];
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'dialog_title='.$dialog_title.'#~#'.'course_title='.$course_title.'#~#'.'course_instance_node_id='.$course_instance_node_id.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id."#~#".'search_info='.$search_info.'#~#'.'createdBy='.$createdBy.'#~#'.'dialogueStatus='.$dialogueStatus;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));

			$insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'dialog_title='.$dialog_title.'#~#'.'course_title='.$course_title.'#~#'.'course_instance_node_id='.$course_instance_node_id.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id."#~#".'search_info='.$search_info.'#~#'.'createdBy='.$createdBy.'#~#'.'dialogueStatus='.$dialogueStatus;

		}*/
		//chmod($file_path, 511);
		//fputs($file_create, trim($insert_string));

		//fclose($file_create);
                // Update Permission for double instance
                //chmod($file_path, 0777);
	}
	public function insertAllDialogueStatementNotificationById($dialogue_instance_node_id)
	{
		$dialogAry  	=  $this->getStatementNotificationId($dialogue_instance_node_id);
		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'dialogue_statement_notification_'.$dialogue_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$dialogue_instance_node_id = $dialogAry['dialogue_instance_node_id'];

		$user_name 		= $dialogAry['user_name'];
		$user_id 		= $dialogAry['user_id'];
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id."#~#".'search_info='.$search_info;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'dialogue_instance_node_id='.$dialogue_instance_node_id.'#~#'.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id."#~#".'search_info='.$search_info;

		}
		//chmod($file_path, 511);
		fputs($file_create, trim($insert_string));

		fclose($file_create);*/
	}
	/* Function here to get dislogue statement notification */
	public function getStatementNotificationId($dialogue_instance_node_id)
 	{
		$dialogue_node_class_id 	= DIALOGUE_CLASS_ID;
		$statement_class_node_id 	= STATEMENT_CLASS_ID;
		$mainAry = array();
		$dialogue_instance_id  		= $this->getInstanceIdByNodeId($dialogue_instance_node_id);
                $dialogue_instance_id = $dialogue_instance_id['node_instance_id'];
		//get with which course the dialogue associated
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('course_node_id'=>'node_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->where->AND->equalTo('ni.node_class_id',$statement_class_node_id);
		$select->where->AND->equalTo('ni.node_instance_id',$dialogue_instance_id);
		$select->where->AND->equalTo('ni.status',1);
		$select->where->AND->equalTo('ncp.caption','Statement');
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$course_array			=	$resultObj->initialize($result)->toArray();
		//get title of dialogue


		$mainAry['statement']   		= rtrim($user_data, ', ');
		$mainAry['user_id']   			= rtrim($user_ids, ',');
		$mainAry['course_title'] 			= $course_array[0]['value'];
		$mainAry['course_node_id'] = $course_array[0]['course_node_id'];
		$mainAry['dialog_title']   			 = @$dailogtitle_array[0]['value'] ;
		$mainAry['node_instance_property_id']   = @$dailogtitle_array[0]['node_instance_property_id'] ;
		$mainAry['node_instance_id']   	= @$dailogtitle_array[0]['node_instance_id'] ;
		$mainAry['dialogue_instance_node_id']   	= $dialogue_instance_node_id ;
		$mainAry['search_info']   	= @$dailogtitle_array[0]['value']." ".rtrim($user_data, ', ') ;
		return $mainAry;
	}
	/* end code here */
	/**
	 *  Function to fetch the dialogue info from database
	 *  Created by Awdhesh Soni
	 */
	public function getAllDialogueByDilaogCourseId($dialogue_instance_node_id)
 	{
		$dialogue_node_class_id = DIALOGUE_CLASS_ID;
		$course_class_node_id   = COURSE_CLASS_ID;
		$user_class_node_id     = INDIVIDUAL_CLASS_ID ;
		$mainAry = array();
		//get with which course the dialogue associated

		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('course_node_id'=>'node_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_y_id = ni.node_id',array('dialogue_instance_node_id'=>'node_x_id'));
		$select->where->equalTo('xy.node_x_id',$dialogue_instance_node_id);
		$select->where->AND->equalTo('ni.node_class_id',$course_class_node_id);
		//$select->where->AND->equalTo('ni.status',1);
		$select->where->AND->equalTo('ncp.caption','Title');
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$course_array			=	$resultObj->initialize($result)->toArray();
		//get title of dialogue
		$sql                				=	new Sql($this->adapter);
		$select								=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value','node_instance_property_id'=>'node_instance_property_id','node_instance_id'=>'node_instance_id'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('status'=>'status'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->where->equalTo('ni.node_id',$dialogue_instance_node_id);
		//$select->where->AND->equalTo('ni.status',1);
		$select->where->AND->equalTo('ncp.caption','Title');
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$dailogtitle_array		=	$resultObj->initialize($result)->toArray();

		//get Created By (Admin) dialogue
		$sql                				=	new Sql($this->adapter);
		$select								=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value','node_instance_property_id'=>'node_instance_property_id','node_instance_id'=>'node_instance_id'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array());
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->where->equalTo('ni.node_id',$dialogue_instance_node_id);
		//$select->where->AND->equalTo('ni.status',1);
		$select->where->AND->equalTo('ncp.caption','Admin');
		//echo $select->getSqlstring();
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$dailogadmin_array		=	$resultObj->initialize($result)->toArray();
		$sql 		        =   "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = '$dialogue_instance_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' AND `ni`.`status` = '1' AND (ncp.caption ='First Name' or ncp.caption ='Last Name')";
		$statement 			=   $this->adapter->query($sql);
    	$result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$userArray		    =	$resultObj->initialize($result)->toArray();
		$user_data = '';
		$user_ids = '';
		$temp_ary =  array();
		foreach($userArray as $output)
		{
			$user_instance_node_id 							= $output['user_instance_node_id'];
			$caption = $output['caption'];
			$temp_ary[$user_instance_node_id][$caption] 	= $output['value'];
			$temp_ary[$user_instance_node_id]['user_instance_node_id'] 	= $user_instance_node_id ;

		}
		foreach($temp_ary as $val)
		{
			$username = $val['First Name']." ".$val['Last Name'];
			$user_instance_node_id = $val['user_instance_node_id'];
			$user_data .= $username.", ";
			$user_ids  .= $user_instance_node_id.",";
		}

		/*modified by awdhesh soni*/
		$mainAry['user_name']                 = rtrim($user_data, ', ');
        $mainAry['user_id']                   = rtrim($user_ids, ',');
        $mainAry['course_title']              = $course_array[0]['value'];
        $mainAry['course_node_id']   = $course_array[0]['course_node_id'];
        $mainAry['dialog_title']              = @$dailogtitle_array[0]['value'];
        $mainAry['dialog_status']             = @$dailogtitle_array[0]['status'];
        $mainAry['dialog_admin']              = @$dailogadmin_array[0]['value'];
        $mainAry['node_instance_property_id'] = @$dailogtitle_array[0]['node_instance_property_id'];
        $mainAry['node_instance_id']          = @$dailogtitle_array[0]['node_instance_id'];
        $mainAry['dialogue_instance_node_id'] = $dialogue_instance_node_id;
        $mainAry['search_info']               = @$dailogtitle_array[0]['value'] . " " . rtrim($user_data, ', ');
        $mainAry['dialogue_timestamp']        = @$detailarray[1]['value'];
        $mainAry['admin_email']               = $accountInfo['0']['value'];

		return $mainAry;
	}
	/**
	 * Function to insert all the dialogue info associated with the dialogue in file
	 * Created by Awdhesh Soni
	 */
	public function insertAllCourseInfoById($course_instance_node_id)
	{
		$courseAry  				= $this->getAllCoursesByCourseId($course_instance_node_id);
		$folder_path    			=  ABSO_URL . "data/perspective_cache/";
		$filename 					= 'course_info_'.$course_instance_node_id;
		$txt_filename 				=  $filename.".txt";
		$file_path 					=  $folder_path.$txt_filename;
		//$file_create 				=  fopen($file_path, "w+") or die('cannot create file');
		$course_instance_node_id 	= $courseAry['course_node_id'];
		$course_title 			 	= $courseAry['course_title'];
		$user_name 					= $courseAry['user_name'];
		$user_id 					= $courseAry['user_id'];
		$node_instance_property_id 	= $courseAry['node_instance_property_id'];
		$course_instance_node_id 	= $courseAry['course_node_id'];
		$search_info 	= $courseAry['search_info'];
        // AWS S3
        $awsObj        = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        $insert_string = 'course_title='.$course_title.'#~#'.'course_instance_node_id='.$course_instance_node_id.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id;
        $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		/*if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));
			$insert_string = 'course_title='.$course_title.'#~#'.'course_instance_node_id='.$course_instance_node_id.'#~#'.'user_name='.$user_name.'#~#'.'user_id='.$user_id.'#~#'.'node_instance_property_id='.$node_instance_property_id;

		}
		//chmod($file_path, 511);
		fputs($file_create, trim($insert_string));

		fclose($file_create);*/
	}
	/**
	 *  Function to fetch the courses info from database
	 *  Created by Awdhesh Soni
	 */
	public function getAllCoursesByCourseId($course_instance_node_id)
 	{
		$dialogue_node_class_id = DIALOGUE_CLASS_ID;
		$course_class_node_id   = COURSE_CLASS_ID;
		$user_class_node_id     = INDIVIDUAL_CLASS_ID ;
		$mainAry = array();
		$prefixTitle                            = PREFIX.'user_info';
		$adminId                = $_SESSION[$prefixTitle]['node_id'];
		$course_instance_id     = $this->getInstanceIdByNodeId($course_instance_node_id);
                $course_instance_id     = $course_instance_id['node_instance_id'];
		//get with which course the dialogue associated
		$sql                     	= new Sql($this->adapter);
		$select         			= $sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value','node_instance_property_id'=>'node_instance_property_id'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('node_instance_id'=>'node_instance_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->where->equalTo('nip.node_instance_id',$course_instance_id);
		$select->where->AND->equalTo('ni.node_class_id',$course_class_node_id);
		$select->where->AND->equalTo('ncp.caption','Title');

		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$course_array			=	$resultObj->initialize($result)->toArray();
		$course_title 			= '';
		foreach ($course_array as $key => $course)
		{
				$course_title  .= $course['value'].',';
				$course_node_property_id  .= $course['node_instance_property_id'].',';
		}

		$sql 		       		=   "SELECT `nip`.`value` AS `value`, `ncp`.`caption` AS `caption`, `xy`.`node_x_id` AS `user_instance_node_id` FROM `node-instance-property` AS `nip` INNER JOIN `node-instance` AS `ni` ON `nip`.`node_instance_id` = `ni`.`node_instance_id` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id` WHERE `xy`.`node_y_id` = '$course_instance_node_id' AND `ni`.`node_class_id` = '$user_class_node_id' AND `ni`.`status` = '1' AND (ncp.caption ='First Name' or ncp.caption ='Last Name')";
		$statement 				=   $this->adapter->query($sql);
    	$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$userArray		    	=	$resultObj->initialize($result)->toArray();
		$user_data 				= '';
		$user_ids 				= '';
		$temp_ary 				=  array();
		foreach($userArray as $output)
		{
			$user_instance_node_id 							= $output['user_instance_node_id'];
			$caption = $output['caption'];
			$temp_ary[$user_instance_node_id][$caption] 	= $output['value'];
			$temp_ary[$user_instance_node_id]['user_instance_node_id'] 	= $user_instance_node_id ;

		}
		foreach($temp_ary as $val)
		{
			$username = $val['First Name']." ".$val['Last Name'];
			$user_instance_node_id = $val['user_instance_node_id'];
			$user_data .= $username.", ";
			$user_ids  .= $user_instance_node_id.",";
		}

		$mainAry['user_name']   					= rtrim($user_data, ', ');
		$mainAry['user_id']   						= rtrim($user_ids, ',');
		$mainAry['course_title'] 					= rtrim($course_title,',');
		$mainAry['course_node_id'] 		= $course_instance_node_id;
		$mainAry['node_instance_property_id'] 		= rtrim($course_node_property_id,',');
		//$mainAry['course_node_id']   		= $course_instance_node_id ;

		return $mainAry;
	}
	/**
	 * Function to insert all the dialogue info associated with the course class node id in file
	 * Created by Awdhesh Soni
	 */
	public function insertAllDialougeIdBasesOfCourseId($course_instance_node_id)
	{
		$dialogueArry  	= $this->getAllDialogueIdBasesOfCourseId($course_instance_node_id);
		$folder_path    =  ABSO_URL . "data/perspective_cache/";
		$filename 		= 'course_dialouge_list_'.$course_instance_node_id;
		$txt_filename 	=  $filename.".txt";
		$file_path 		=  $folder_path.$txt_filename;
		$file_create 	=  fopen($file_path, "w+") or die('cannot create file');
		$node_id 		=  $courseAry['node_id'];

		if (file_exists($file_path))
		{
			$file_data = file_get_contents($file_path);
			$count = strlen(trim($file_data));

			$insert_string = 'dialogue_node_id='.$dialogueArry['dialogueId'].'#~#'.'dialogue_instance_id='.$dialogueArry['dialogueInstId'];

		}
		//chmod($file_path, 511);
		fputs($file_create, trim($insert_string));

		fclose($file_create);
	}
	public function getAllDialogueIdBasesOfCourseId($course_instance_node_id){
		$dialogueClassId        =   DIALOGUE_CLASS_ID;
        $dialogueTitleId        =   DIALOGUE_TITLE_ID;
        $mainAry 				=   array();
		$sql                     		= new Sql($this->adapter);
		$select         				= $sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('node_instance_id'=>'node_instance_id','node_id'=>'node_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array('course_node_id'=>'node_y_id'));
		$select->where->equalTo('xy.node_y_id',$course_instance_node_id);
		$select->where->AND->equalTo('ni.node_class_id',$dialogueClassId);
		$select->where->AND->equalTo('ncp.node_class_property_id',$dialogueTitleId);
		$select->order('nip.node_instance_id DESC');
		/*echo $select->getSqlstring();
		die('ddd');*/
		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$resultAry						=	$resultObj->initialize($result)->toArray();
		$dialogueId = '';
		$dialogueInstId = '';
		foreach($resultAry as $val)
		{
			$dialogueId 	.= $val['node_id'].',';
			$dialogueInstId .= $val['node_instance_id'].',';

		}
		$mainAry['dialogueId']   			= rtrim($dialogueId, ', ');
		$mainAry['dialogueInstId']   		= rtrim($dialogueInstId, ',');
		return $mainAry;
	}
	/**
	 * Function to read all the dialogue info associated with the dialogue from file
	 * Created by Awdhesh Soni
	 */
	public function getDilogueDataFromFile($dialogue_instance_node_id)
	{

		$folder_path        =  ABSO_URL."data/perspective_cache/";
		$filename 			= 'dialogue_info_'.$dialogue_instance_node_id;
		$txt_filename       =  $filename.".txt";
		$file_path          =  $folder_path.$txt_filename;
		$dialogAry = array();
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
		//if(file_exists($file_path))
        if ($awsObj->isObjectExist($awsFilePath)) {

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		= strlen(trim($file_data));
			if($count){
				$data = $this->readDialogFileCourse($file_data);
			}
		}
		else{

			// function to enter all the dialogue info into the file
			//$this->insertAllDialogueCourseInfoById($dialogue_instance_node_id);
			$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialog  			= $structureObj->insertAllDialogueInfoById($dialogue_instance_node_id); // dialogue_info // call structure builder table modal change by awdhesh

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		= strlen(trim($file_data));
			if($count==0){
				$data  = $this->readDialogFileCourse($file_data);
			}

		}
		return $data ;

	}
	public function getCourseDataFromFile($course_instance_node_id)
	{

		$folder_path        =  ABSO_URL."data/perspective_cache/";
		$filename 			= 'course_info_'.$course_instance_node_id;
		$txt_filename       =  $filename.".txt";
		$file_path          =  $folder_path.$txt_filename;
		$dialogAry = array();
        // AWS S3
        $awsObj        = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
		if(file_exists($file_path))
		{

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		= strlen(trim($file_data));
			if($count){
				$data = $this->readDialogFileCourse($file_data);
			}

		}
		else{



			// function to enter all the dialogue info into the file
			//$this->insertAllDialogueCourseInfoById($course_instance_node_id);
			$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by awdhesh
        	$dialog  			= $structureObj->insertAllDialogueInfoById($course_instance_node_id); // dialogue_info // call structure builder table modal change by awdhesh

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		= strlen(trim($file_data));

			if($count==0){
				$data  = $this->readDialogFileCourse($file_data);
			}

		}
		return $data ;

	}

	public function readDialogFileCourse($file_data)
	{
		$dialog_data  = explode('#~#',$file_data);

		$dialogAry = array();
		if(!empty($dialog_data[0]))
		{
			for($i=0; $i<count($dialog_data);)
			{
				//$content_data =  explode('=',$dialog_data[$i]);//
					$temp = explode('=',$dialog_data[$i]);
					$dialogAry[0][$temp['0']] = $temp['1'];

				$i++;

			}
			return $dialogAry;
		}
		else
		{
		 return 'no record found.';
		}
	}
	/**
	 * Function to get all the instances from the file
	 */
	public function getAllStatementInstance($dialog_instance_node_id,$date_obj,$loggedInUser)
	{

		$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
		$statementArray  	= $structureObj->getAllStatementInstance($dialog_instance_node_id,$date_obj,$loggedInUser);
		return $statementArray;
	}

	/**
	 * Public Function to get all the statement from the database and then insert into file
	 */
	function insertStatementInstance($dialog_instance_node_id)
	{

		$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
		$dialog  			= $structureObj->insertStatementInstance($dialog_instance_node_id);
	}
	/**
	 * Public Function to get all the statement from the database and then insert into file
	 */
	function insertStatementLetterInstance($dialog_instance_node_id)
	{
		$folder_path     =  ABSO_URL . "data/perspective_cache/";
		$filename 		 = 'dialogue_letter_'.$dialog_instance_node_id;
		$txt_filename 	 =  $filename.".txt";
		$file_path 		 =  $folder_path.$txt_filename;

		//$file_create 	 = fopen($file_path, "w+") or die('cannot create file');
		$statementAry  	 = $this->getAllLetterStatement($dialog_instance_node_id);
        // AWS S3
        $awsObj         = new AwsS3();
		foreach($statementAry as $value)
		{
			$sender 			= $value['Actor.Author'];
			$statement_type 	= $value['Statement Type'];
			$statement 			= $value['Statement'];
			$node_instance_id 	= $value['node_instance_id'];
			$timestamp 			= $value['Timestamp'];
			$status 			= $value['status'];
			$individual_node_class_id = INDIVIDUAL_CLASS_ID;
			$res = $this->getUserProfile($sender,$individual_node_class_id);

			$username  = $res['first_name']." ".$res['last_name'];

			$temp = explode(' ',$timestamp);
		 	$date_val = $temp[0] ;
            $awsFilePath   = "data/perspective_cache/$txt_filename";
            //if (file_exists($file_path))
            if ($awsObj->isObjectExist($awsFilePath)) {
				//$file_data = file_get_contents($file_path);
                $file_data_res = $awsObj->getFileData($awsFilePath);
                $file_data = $file_data_res['data'];
				$count = strlen(trim($file_data));
				/*if($count ==0)
						{
							$insert_string = $date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender ;
						}
						else
						{*/
							if (strpos($file_data,$date_val ) !== false)
							{
								$insert_string = '#~#'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender;
							}
							else
							{
								$insert_string = 'x~x'.$date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender;
							}
						//}
			} else {
                $insert_string = $date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender ;
            }
				//chmod($file_path, 511);
				//fputs($file_create, trim($insert_string));
                $awsObj->setFileData($awsFilePath, trim($insert_string), "text");
		}
		//fclose($file_create);
                // Update Permission for double instance
                //chmod($file_path, 0777);
	}
	/**
	 * Public Function to get all the statement from the database
	 */
	public function getAllStatement($dialog_instance_node_id)
	{
		// get all the statement associated with the dialogue
		$statement_node_class_id = STATEMENT_CLASS_ID;

		/*$sql                	=	new Sql($this->adapter);
		$select					 =	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('statement_instance_node_id'=>'node_id','node_instance_id'=>'node_instance_id'));
		//$select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id',array('value'=>'value'));
		//$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array());
		$select->where->equalTo('xy.node_y_id',$dialog_instance_node_id);
		$select->where->AND->equalTo('ni.node_class_id',$statement_node_class_id);
		$select->where->AND->equalTo('ni.status',1);*/
		//$select->where->AND->notEqualTo('nip.value',"Letter");

		//echo $select->getSqlstring();


		/*$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$instanceAry			=	$resultObj->initialize($result)->toArray();
		$sql = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`, `ncp`.`caption` AS `caption`
		FROM `node-instance-property` AS `nip`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		WHERE `nip`.`node_instance_id` = $node_instance_id AND ( `ncp`.`caption` = 'Statement' OR `ncp`.`caption` = 'Statement Type' )";		*/

		$sql = "SELECT DISTINCT(`nip`.`node_instance_id`,`nip`.`node_id` as `statement_instance_node_id`) FROM `node-instance-property` AS `nip`
				LEFT JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`
				LEFT JOIN `node-x-y-relation` AS `nxy` ON `nxy`.`node_x_id`=`ni`.`node_id`
				WHERE `nxy`.`node_y_id`= $dialog_instance_node_id and `ni`.`node_class_id`=$statement_node_class_id and `ni`.`status`=1
				AND `ni`.`node_instance_id` IN (
				SELECT DISTINCT(`node_instance_id`) FROM `node-instance-property` AS `nip2`
				WHERE `nip2`.`value` = 'Statement' OR `nip2`.`value` = 'image' OR `nip2`.`value` = 'attachment' OR `nip2`.`value` = 'System Message' GROUP BY `nip2`.`node_instance_id`
				)";

		$statement = $this->adapter->query($sql);
    	$result									=	$statement->execute();
		$resultObj								=	new ResultSet();
		$instanceAry		    				=	$resultObj->initialize($result)->toArray();

		$main_ary = array();

		$i = 0;

		foreach( $instanceAry as $value )
		{

				$node_instance_id 			= $value['node_instance_id'];
				$sql                		=	new Sql($this->adapter);
				$select					 	=	$sql->select();
				$select->from(array('nip' => 'node-instance-property'));
				$select->columns(array('value'=>'value'));
				$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
				$select->where->equalTo('nip.node_instance_id',$node_instance_id);
				$select->where->AND->notEqualTo('nip.value',"Letter");

				$statement				=	$sql->prepareStatementForSqlObject($select);
				$result					=	$statement->execute();
				$resultObj				=	new ResultSet();
				$propertyAry			=	$resultObj->initialize($result)->toArray();

				$inner_ary = array();
				foreach($propertyAry as $output)
				{

						$value   =  $output['value'];
						$caption =  $output['caption'];
						$inner_ary[$caption] = $value;
						$individual_node_class_id =  INDIVIDUAL_CLASS_ID;

				}

			$inner_ary['node_instance_id'] = $node_instance_id;

			$main_ary[$i] = $inner_ary;
			//return $main_ary;
			$i++;

		}
		return $main_ary;

	}
	public function getAllLetterStatement($dialog_instance_node_id)
	{
		// get all the statement associated with the dialogue
		$statement_node_class_id = STATEMENT_CLASS_ID;

		$sql = "SELECT DISTINCT(`nip`.`node_instance_id`),`ni`.`status` FROM `node-instance-property` AS `nip`
				LEFT JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id`=`nip`.`node_instance_id`
				LEFT JOIN `node-x-y-relation` AS `nxy` ON `nxy`.`node_x_id`=`ni`.`node_id`
				WHERE `nxy`.`node_y_id`= $dialog_instance_node_id and `ni`.`node_class_id`=$statement_node_class_id
				AND `ni`.`node_instance_id` IN (
				SELECT DISTINCT(`node_instance_id`) FROM `node-instance-property` AS `nip2`
				WHERE `nip2`.`value` = 'Letter'  GROUP BY `nip2`.`node_instance_id`
				)";

		$statement = $this->adapter->query($sql);
    	$result									=	$statement->execute();
		$resultObj								=	new ResultSet();
		$instanceAry		    				=	$resultObj->initialize($result)->toArray();

		$main_ary = array();

		$i = 0;

		foreach( $instanceAry as $value )
		{

			$node_instance_id 			= $value['node_instance_id'];
			$status 					= $value['status'];
			$sql                		=	new Sql($this->adapter);
			$select					 	=	$sql->select();
			$select->from(array('nip' => 'node-instance-property'));
			$select->columns(array('value'=>'value'));
			$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
			$select->where->equalTo('nip.node_instance_id',$node_instance_id);
			$select->where->AND->notEqualTo('nip.value',"Statement");

			$statement				=	$sql->prepareStatementForSqlObject($select);
			$result					=	$statement->execute();
			$resultObj				=	new ResultSet();
			$propertyAry			=	$resultObj->initialize($result)->toArray();

			$inner_ary = array();
			foreach($propertyAry as $output)
			{
				$value   =  $output['value'];
				$caption =  $output['caption'];
				$inner_ary[$caption] = $value;
				$individual_node_class_id =  INDIVIDUAL_CLASS_ID;
			}

			$inner_ary['node_instance_id'] 	= $node_instance_id;
			$inner_ary['status'] 			= $status;

			$main_ary[$i] = $inner_ary;
			//return $main_ary;
			$i++;

		}
		return $main_ary;

	}
	/*code here to fetch statement mode type*/
	public function getStatementModeType($ins_node_id)
        {
                $sql = "SELECT `ni`.`node_instance_id` AS `node_instance_id`
                FROM `node-instance` AS `ni`
                INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
                INNER JOIN `node-x-y-relation` AS `xy` ON `xy`.`node_x_id` = `ni`.`node_id`
                WHERE `xy`.`node_y_id` = '".$ins_node_id."'
                AND `nip`.`node_class_property_id` = '".STATEMENT_TYPE_ID."'
                ORDER BY `nip`.`node_instance_id` DESC limit 0,1";
		$statement 			=   $this->adapter->query($sql);
                $result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$StatementArr		    =	$resultObj->initialize($result)->toArray();
		$modeType = $this->fetchModeType($StatementArr[0]['node_instance_id']);
		return $modeType;
      }
    public function fetchModeType($ins_id){
                $sql= "SELECT `nip`.`value` AS `value`
                        FROM `node-instance` AS `ni`
                        INNER JOIN `node-instance-property` AS `nip` ON `nip`.`node_instance_id` = `ni`.`node_instance_id`
                        WHERE `nip`.`node_class_property_id` = '".STATEMENT_TYPE_ID."' and `nip`.`node_instance_id`='".$ins_id."'
                        ORDER BY `nip`.`node_instance_id` DESC limit 0,1";

		$statement 			=   $this->adapter->query($sql);
		$result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$typeData		    	=	$resultObj->initialize($result)->toArray();
		if($typeData[0]['value'] == "Letter Container"){
			$type = "Letter";
		}else {
			$type = "Chat";
		}
		return $type;
    }
    /*end code here*/
	public function getUserProfile($node_id,$node_class_id)
	{
		$userNodeIdArray[]							=	$node_id;

		$tempArray 									=	$this->getNodeXOrYId($node_id,'node_y_id','node_x_id','Y',$node_class_id);
		foreach($tempArray as $key => $value)
		{
			$userNodeIdArray[]						=	$value['node_x_id'];
		}
		$userProfileArray							=	array();
		foreach($userNodeIdArray as $key => $node_id)
		{
			$temp 									= $this->getUserInstanceStructure($node_id);
			$userProfileArray 						= array_merge($userProfileArray,$temp);
		}
		return $userProfileArray;
	}
	public function getNodeXOrYId($id,$fieldEqualTo,$fieldSend,$is_all_record,$node_class_id = "")
	{
		$sql                		=	new Sql($this->adapter);
		$select						=	$sql->select();
		$select->from(array('nip' => 'node-x-y-relation'));
		$select->columns(array($fieldSend));
		if($node_class_id != "")
		{
			$select->join(array('ni' => 'node-instance'), 'ni.node_id=nip.'.$fieldSend, array('node_class_id','node_id'), 'inner');
			$select->where->notEqualTo('ni.node_class_id',$node_class_id);
			$select->where->AND->equalTo('nip.'.$fieldEqualTo,$id);
		}
		else
		{
			$select->where->equalTo('nip.'.$fieldEqualTo,$id);
		}

		$statement					=	$sql->prepareStatementForSqlObject($select);
		$result						=	$statement->execute();
		$resultObj					=	new ResultSet();
		$dataArray					=	$resultObj->initialize($result)->toArray();
		if($is_all_record == 'N')
			return $dataArray[0][$fieldSend];
		else
			return $dataArray;
	}
	public function getUserInstanceStructure($node_id)
	{
		$sql                						=	new Sql($this->adapter);
		$select										=	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('node_instance_id','node_id','node_class_id'));
		$select->where->equalTo('ni.node_id',$node_id);
		$statement									=	$sql->prepareStatementForSqlObject($select);
		$result										=	$statement->execute();
		$resultObj									=	new ResultSet();
		$dataArray									=	$resultObj->initialize($result)->toArray();
		$instancesArray 							=	array();
		$propArray 									=	$this->getClassStructureAgain($dataArray[0]['node_class_id'],$dataArray[0]['node_instance_id']);

		return $propArray;
	}
	public function getClassStructureAgain($node_class_id,$node_instance_id)
	{
		$propArray										= 	$this->getPropertiesStatement($node_class_id,'N');
		$mainPropArray									= 	array();
		$subPropArray									= 	array();
		foreach($propArray as $propk => $propv)
		{
			if(intval($propv['node_class_property_parent_id']) != 0)
				$mainPropArray[]						=	$propv;
			else
				$subPropArray[$propv['node_class_property_parent_id']][] =	$propv;
		}
		$realPropArray									= 	array();
		return $this->getAllPropertyAgain($mainPropArray,$subPropArray,$realPropArray,$node_instance_id);
	}
	public function getAllPropertyAgain($menu1,$menu2,$menuArray,$node_instance_id)
	{
		foreach($menu1 as $key => $value)
		{
			$sql                		=	new Sql($this->adapter);
			$select						=	$sql->select();
			$select->from(array('nip' => 'node-instance-property'));
			$select->columns(array('node_instance_property_id','value'));
			$select->where->equalTo('nip.node_instance_id',$node_instance_id);
			$select->where->AND->equalTo('nip.node_class_property_id',$value['node_class_property_id']);
			$statement					=	$sql->prepareStatementForSqlObject($select);
			$result						=	$statement->execute();
			$resultObj					=	new ResultSet();
			$dataArray					=	$resultObj->initialize($result)->toArray();
			if(is_array($dataArray[0]) && count($dataArray) > 0)
			{
				if(intval($value['encrypt_status']) == 1)
				$menuArray[str_replace(' ', '_', strtolower($this->mc_decrypt($value['caption'], ENCRYPTION_KEY)))]				=	$this->mc_decrypt($dataArray[0]['value'], ENCRYPTION_KEY);
				else
				$menuArray[str_replace(' ', '_', strtolower($value['caption']))]				=	$dataArray[0]['value'];
			}

			$childArray												= array();
			if(is_array($menu2[$value['node_class_property_id']]))
			{
				$menuArray 				= $this->getAllPropertyAgain($menu2[$value['node_class_property_id']],$menu2,$childArray,$node_instance_id);
			}
		}
		return $menuArray;
	}
	/**
	 * Function to get the dialogue admin
	 */
	public function fetchDialogOwnerId($dialog_instance_node_id)
	{
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array());
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->where->AND->equalTo('ni.node_id',$dialog_instance_node_id);
		$select->where->AND->equalTo('ncp.caption','Admin');

		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$AdminArray						=	$resultObj->initialize($result)->toArray();
		return $admin_id  				=   $AdminArray['0']['value'];
	}
	/**
	 * Function to get the array of all the user associated with an dialogue from database
	 */
	public function getAllActorInstances($dialog_instance_node_id)
	{
		$user_class_node_id = INDIVIDUAL_CLASS_ID;
		//get the owner of the dialogue
		$admin_id  						=   $this->fetchDialogOwnerId($dialog_instance_node_id);

		$mainAry = array();

		//get all the user associated with dialogue user
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array());
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array('user_instance_node_id'=>'node_x_id'));
		$select->where->equalTo('xy.node_y_id',$dialog_instance_node_id);
		$select->where->AND->equalTo('ni.node_class_id',$user_class_node_id);
		//$select->where->AND->notequalTo('xy.node_x_id',$admin_id);
		//$select->where->AND->equalTo('ni.status',1);
		//echo '<br>dialogue user:'.$select->getSqlstring();
		//echo $admin_id;

		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$userArray	=	$resultObj->initialize($result)->toArray();

		$mainAry = array();
		$temp_ary = array();

		//print_r($userArray);
		foreach($userArray as $value)
		{
			$caption 				= $value['caption'];
			$id = $value['user_instance_node_id'];

			$temp_ary[$id][strtolower($caption)]		= $value['value'];
			$temp_ary[$id]['id']     = $id;
			$user_ins_array .= $id.",";


		}
		$user_ins_array = explode(',',$user_ins_array);

		$account_class_node_id = ACCOUNT_CLASS_ID;
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array());
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array('caption'=>'caption'));
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array('user_instance_node_id'=>'node_y_id'));
		$select->where->IN('xy.node_y_id',$user_ins_array);
		$select->where->AND->equalTo('ni.node_class_id',$account_class_node_id);
		//$select->where->AND->equalTo('ni.status',1);
		$select->where->AND->equalTo('ncp.caption','Email Address');
		//echo 'account->'.$select->getSqlstring();die;
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$accountInfo	            =	$resultObj->initialize($result)->toArray();
		$acount_ary = array();
		foreach($accountInfo as $accountDeatil)
		{
			$id  = $accountDeatil['user_instance_node_id'];
			$caption = $accountDeatil['caption'];
			$acount_ary[$id][strtolower($caption)] = $accountDeatil['value'];
		}

		foreach($temp_ary as $value)
		{
			$id = $value['id'];

			$mainAry[$id]['first name']		= $value['first name'];
			$mainAry[$id]['last name']		= $value['last name'];
			$mainAry[$id]['id']     = $id;
			$mainAry[$id]['email address']     =  $acount_ary[$id]['email address'];
			if($admin_id == $id )
			{
				$mainAry[$id]['admin'] = '1';
			}
			else
			{
				$mainAry[$id]['admin'] = '0';
			}
		}


		foreach ($mainAry as $key => $row) {
			$finalAry[$key] = $row['admin'];
		}
		array_multisort($finalAry, SORT_DESC, $mainAry);
		return $mainAry;
	}
	public function getNodeClassPropertyIdCourseDialouge($node_class_id,$field)
	{
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('ncp' => 'node-class-property'));
		$select->columns(array('node_class_property_id'));
		$select->where->AND->equalTo('ncp.node_class_id',$node_class_id);
		$select->where->AND->equalTo('ncp.caption',$field);
		$statement						=	$sql->prepareStatementForSqlObject($select);

		//echo $select->getSqlstring();
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$resultAry						=	$resultObj->initialize($result)->toArray();

		return $node_class_property_id = $resultAry['0']['node_class_property_id'];
	}
	/**
	 * Function to create node instance
	 *
	 */
	public function createNodeInstanceCourseDialouge($node_class_id,$node_type_id,$saveType)
	{
		$output['node_class_id']			=	$node_class_id;
		$output['node_id']					=	$this->createNodeCourseDialogue();
		$output['node_type_id']				=	$node_type_id;
		$output['caption']					=	$output['node_id'];
		if($saveType == "D")
		{
			$output['status']			    =	0;
		}
		else
		{
			$output['status']			    =	1;
		}

		$sql 								=	new Sql($this->adapter);
		$query 								=	$sql->insert('node-instance');
		$query->values($output);
		$statement 							=	$sql->prepareStatementForSqlObject($query);
		$result 							=	$statement->execute();
		$resultObj 							=	new ResultSet();
		$resultObj->initialize($result);
		//return $output['node_id'];
		return $id          				=   $this->adapter->getDriver()->getLastGeneratedValue();
	}
	public function createNodeCourseDialogue()
    {
        $uuid_id            =   bin2hex(openssl_random_pseudo_bytes(8));//$this->generate_uuidCourseDialogue(); //get uuid value by using UUID algorithm from mySql
        $dataValues         =   array('node_uuid_id' => $uuid_id);
        $sql                =   new Sql($this->adapter);
        $select             =   $sql->insert('node'); //This table name "node" will be renamed and name will be "node"
        $select->values($dataValues);
        $statement          =   $sql->prepareStatementForSqlObject($select);
        $result             =   $statement->execute();
        $resultObj          =   new ResultSet();
        $resultObj->initialize($result);
        $node_id            =   $this->adapter->getDriver()->getLastGeneratedValue();
        return $node_id;
    }
    public function generate_uuidCourseDialogue()
    {
        $sqlQuery           = "SELECT UUID( ) AS uuid";
        $statement          = $this->adapter->query($sqlQuery);
        $result             = $statement->execute();
        $resultObj          = new ResultSet();
        $uuidArray          = $resultObj->initialize($result)->toArray();
        $gen_uuid           = $uuidArray[0]['uuid'];
        if(strrpos($gen_uuid, '-'))
        {
            return str_replace('-', '', $gen_uuid);
        }
        else
        {
            return $gen_uuid;
        }
    }
    /**
	 * Function to insert the value for the instances
	 */
	public function createNodeInstanceCourseDialougeProperty($node_instance_id,$node_class_property_id,$node_type_id,$value)
	{
		$output['node_instance_id']				=	$node_instance_id;
		$output['node_class_property_id']		=	$node_class_property_id;
		$output['node_id']						=	$this->createNodeCourseDialogue();
		$output['node_type_id']					=	$node_type_id;
		$output['value']						=	$value;
		$sql 									=	new Sql($this->adapter);
		$query 									=	$sql->insert('node-instance-property');
		$query->values($output);
		$statement 								=	$sql->prepareStatementForSqlObject($query);
		$result 								=	$statement->execute();
		$resultObj 								=	new ResultSet();
		$resultObj->initialize($result);
		return $id          					=   $this->adapter->getDriver()->getLastGeneratedValue();
	}
	public function getInstanceNodeIdCourseDialogue($node_class_id,$node_instance_id)
	{
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('node_id'));
		$select->where->AND->equalTo('ni.node_class_id',$node_class_id);
		$select->where->AND->equalTo('ni.node_instance_id',$node_instance_id);
		$statement								=	$sql->prepareStatementForSqlObject($select);
		$result									=	$statement->execute();
		$resultObj								=	new ResultSet();
		$resultAry								=	$resultObj->initialize($result)->toArray();
		return $instance_node_id = $resultAry['0']['node_id'];
	}
	/**
	 * Function to create xy relation
	 */
	public function createXYRelationCourseDialogue($node_y_id,$node_x_id)
	{
		$output['node_y_id']				=	$node_y_id;
		$output['node_x_id']				=	$node_x_id;
		$sql 									=	new Sql($this->adapter);
		$query 									=	$sql->insert('node-x-y-relation');
		$query->values($output);
		$statement 								=	$sql->prepareStatementForSqlObject($query);
		$result 								=	$statement->execute();
		$resultObj 								=	new ResultSet();
		$resultObj->initialize($result);
		return $id          					=   $this->adapter->getDriver()->getLastGeneratedValue();
	}
	/**
         * Function use here to fetch all dialogue bases of selected course instance id
         * @param type $course_instance_node_id
         * @param type $dialogueClassId
         * @param type $dialogueTitleId
         * @return type
         */
	public function getAllDialogueInstancesOfCourseClass($course_instance_node_id,$dialogueClassId,$dialogueTitleId)
	{

        $sql    = new Sql($this->adapter);
        $subSelect	= $sql->select();
        $subSelect->from(array('nxyr' => 'node-x-y-relation'));
        $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
        $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('status'=>'status','dialogue_instance_id'=>'node_instance_id'));
        $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.DIALOGUE_TITLE_ID), array('dialogue_title'=>'value'));
        $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_ADMIN_ID), array('createdBy'=>'value'));
        $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array());
        $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id='.INDIVIDUAL_ACTORID_PROP_ID), array('individual_node_id'=> 'value'));
        $subSelect->join(array('nip5' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip5.node_instance_id AND nip5.node_class_property_id='.INDIVIDUAL_STATUS_PROP_ID), array('individual_history_status' => 'value'));
        $subSelect->join(array('ni2' => 'node-instance'),'ni2.node_id = nip1.value', array());
        $subSelect->join(array('nip4' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('user_name'=>'value'));
        $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip4.node_class_property_id', array('caption'));
        $subSelect->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = ni2.node_id', array());
        $subSelect->join(array('ni3' => 'node-instance'),new Predicate\Expression('ni3.node_id = nxyr2.node_x_id AND ni3.node_class_id = '.ACCOUNT_CLASS_ID), array());
        $subSelect->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni3.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('email'=>'value'));
        $subSelect->where->equalTo('nxyr.node_y_id',$course_instance_node_id);
        //return $subSelect->getSqlstring();
	    // Converted Amit B.'s SQL query to Zend Query
        // Amit Malakar - Removed Participants join added nip4
//        $sql    = new Sql($this->adapter);
//        $subSelect  = $sql->select();
//        $subSelect->from(array('nxyr' => 'node-x-y-relation'));
//        $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
//        $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('status'=>'status','dialogue_instance_id'=>'node_instance_id'));
//        $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.DIALOGUE_TITLE_ID), array('dialogue_title'=>'value'));
//        $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_ADMIN_ID), array('createdBy'=>'value'));
//        //$subSelect->join(array('nip4' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id = '.DIALOGUE_REMOVED_PARTICIPANTS), array('removed_participants'=>'value'));
//        $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array('individual_node_id'=>'node_x_id'));
//        $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> '.STATEMENT_CLASS_ID), array());
//        $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('user_name'=> 'value'));
//        $subSelect->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip1.node_class_property_id', array('caption'));
//        $subSelect->join(array('nxyr2' => 'node-x-y-relation'), 'nxyr2.node_y_id = nxyr1.node_x_id', array());
//        $subSelect->join(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxyr2.node_x_id AND ni2.node_class_id = '.ACCOUNT_CLASS_ID), array());
//        $subSelect->join(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni2.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_EMAIL_ID), array('email'=>'value'));
//        $subSelect->where->equalTo('nxyr.node_y_id',$course_instance_node_id);
        //return $subSelect->getSqlstring();
//        $subSelect->group('nxyr.node_x_id');
//        $subSelect->group('nxyr1.node_x_id');
        /*$mainSelect = $sql->select();
        $mainSelect->columns(array('dialogue_node_id','dialogueTitle','createdBy','status',
            'userName' => new Predicate\Expression('GROUP_CONCAT(user_name)'),
            'user_id' => new Predicate\Expression('GROUP_CONCAT(individual_node_id)') ));
        $mainSelect->from(array('*' => $subSelect));
        $mainSelect->group('dialogue_node_id');*/
		//return $subSelect->getSqlstring();
        $statement						=	$sql->prepareStatementForSqlObject($subSelect);
        $result							=	$statement->execute();
        $resultObj						=	new ResultSet();
        return $resultAry				=	$resultObj->initialize($result)->toArray();

                /*$sql = "SELECT GROUP_CONCAT(user_name) as userName,GROUP_CONCAT(individual_node_id) as user_id,dialogue_node_id,dialogueTitle,createdBy,status FROM (
                        SELECT nxyr1.node_x_id as individual_node_id,GROUP_CONCAT(nip1.value separator  ' ') as user_name,nxyr.node_x_id as dialogue_node_id,
                        nip.value as `dialogueTitle`, `ni`.`status` as `status`, `nip2`.`value` as `createdBy` FROM `node-x-y-relation` nxyr
                        JOIN `node-instance` ni ON ni.node_id = nxyr.node_x_id AND ni.node_class_id = ".DIALOGUE_CLASS_ID."
                        JOIN `node-instance-property` nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".DIALOGUE_TITLE_ID."
                        JOIN `node-instance-property` nip2 ON ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".DIALOGUE_ADMIN_ID."
                        JOIN `node-x-y-relation` nxyr1 ON nxyr1.node_y_id = nxyr.node_x_id
                        JOIN `node-instance` ni1 ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> ".STATEMENT_CLASS_ID."
                        JOIN `node-instance-property` nip1 ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id in(".INDIVIDUAL_FIRST_NAME.",".INDIVIDUAL_LAST_NAME.") WHERE nxyr.`node_y_id` = $course_instance_node_id
                        GROUP BY nxyr.node_x_id,nxyr1.node_x_id) temp GROUP BY dialogue_node_id";
                        $statement = $this->adapter->query($sql);
			$result							=	$statement->execute();
			$resultObj						=	new ResultSet();
			$resultAry						=	$resultObj->initialize($result)->toArray();
                        return $resultAry;*/
                        // Comment to stop the file execution
			/*$sql                     		= new Sql($this->adapter);
			$select         				= $sql->select();
			$select->from(array('ni' => 'node-instance'));
			$select->columns(array('node_instance_id'=>'node_instance_id','node_id'=>'node_id'));
			$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array('course_node_id'=>'node_y_id'));
			$select->where->equalTo('xy.node_y_id',$course_instance_node_id);
			$select->where->AND->equalTo('ni.node_class_id',$dialogueClassId);
			$select->order('ni.node_instance_id DESC');
			$statement						=	$sql->prepareStatementForSqlObject($select);
			$result							=	$statement->execute();
			$resultObj						=	new ResultSet();
			$resultAry						=	$resultObj->initialize($result)->toArray();
			$newArr = array();
			$DialogueInfoArr = array();
			foreach ($resultAry as $key => $value)
			{
               	$DialogueInfoArr[] 					=  $this->getDilogueDataFromFile($value['node_id']);
			}
			foreach ($DialogueInfoArr as $key => $val)
			{
           		$newArr[$key]['dialogue_node_id'] 	=  $val[0]['dialogue_instance_node_id'];
           		$newArr[$key]['dialogueTitle'] 		=  $val[0]['dialog_title'];
           		$newArr[$key]['userName'] 			=  $val[0]['user_name'];
           		$newArr[$key]['user_id'] 			=  $val[0]['user_id'];
           		$newArr[$key]['createdBy'] 			=  $val[0]['createdBy'];
           		$newArr[$key]['status'] 			=  $val[0]['dialogueStatus'];
			}
			return $newArr;	*/
	}
	/**
	 * Function to read all the dialogue info associated with the dialogue from file
	 * Created by Arti Sharma
	 */
	public function getCourseDilogueDataFromFile($course_instance_node_id)
	{

		$folder_path        =  ABSO_URL."data/perspective_cache/";
		$filename 			= 'course_dialouge_list_'.$course_instance_node_id;

		$txt_filename       =  $filename.".txt";
		$file_path          = $folder_path.$txt_filename;
		$dialogAry = array();
        // AWS S3
        $awsObj        = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
		//if(file_exists($file_path)){
        if ($awsObj->isObjectExist($awsFilePath)) {

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		= strlen(trim($file_data));
			if($count){
				$data = $this->readDialogFileCourse($file_data);
			}
		}
		else{
			// function to enter all the dialogue info into the file
			$this->insertAllDialougeIdBasesOfCourseId($course_instance_node_id);

			//$file_create = fopen($file_path, "r");
			//$file_data   = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];
			$count 		 = strlen(trim($file_data));

			if($count==0){
				$data  = $this->readDialogFileCourse($file_data);
			}

		}
		return $data ;

	}
    public function getDialogueCourseInstanceData($dialogue_instance_node_id,$modeType)
    {

        $QUERY = "SELECT '" . $modeType . "' AS modeType, " . $_SESSION[PREFIX.'user_info']['node_id'] . " AS user_instance_node_id, dialogue_instance_node_id,GROUP_CONCAT(user_id) AS user_id , dialogueStatus,GROUP_CONCAT(user_name) AS user_name,GROUP_CONCAT(email_address) AS email_address,dialog_title,node_instance_property_id,createdBy,course_title,course_node_id,course_property_id, (case when (courseStatementType = 1) THEN 'Published' ELSE 'Draft' END) AS courseStatementType FROM
                    (SELECT nxyr.node_y_id AS dialogue_instance_node_id,ni.node_id AS user_id,ni2.status AS dialogueStatus,GROUP_CONCAT(nip.value separator  ' ') AS user_name,nip1.value AS email_address, nip2.value AS dialog_title,nip2.node_instance_property_id AS node_instance_property_id,nip3.value AS createdBy,nip4.value AS course_title,ni4.node_instance_id AS course_node_id,nip4.node_instance_property_id AS course_property_id,ni4.status AS courseStatementType FROM `node-x-y-relation` nxyr
                    JOIN `node-instance` ni ON ni.node_id = nxyr.node_x_id AND ni.node_class_id <> " . STATEMENT_CLASS_ID . "
                    JOIN `node-instance-property` nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id in(" . INDIVIDUAL_FIRST_NAME . "," . INDIVIDUAL_LAST_NAME . ")
                    JOIN `node-x-y-relation` nxyr1 ON nxyr1.node_y_id = nxyr.node_x_id
                    JOIN `node-instance` ni1 ON ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = " . ACCOUNT_CLASS_ID . "
                    JOIN `node-instance-property` nip1 ON ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id = " . INDIVIDUAL_EMAIL_ID . "
                    JOIN `node-instance` ni2 ON ni2.node_id = nxyr.node_y_id
                    JOIN `node-instance-property` nip2 ON ni2.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = " . DIALOGUE_TITLE_ID . "
                    JOIN `node-instance` ni3 ON ni3.node_id = nxyr.node_y_id
                    JOIN `node-instance-property` nip3 ON ni3.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = " . DIALOGUE_ADMIN_ID . "
                    JOIN `node-x-y-relation` nxyr2 ON nxyr2.node_x_id = nxyr.node_y_id
                    JOIN `node-instance` ni4 ON ni4.node_id = nxyr2.node_y_id AND ni4.node_class_id = " . COURSE_CLASS_ID . "
                    JOIN `node-instance-property` nip4 ON ni4.node_instance_id = nip4.node_instance_id AND nip4.node_class_property_id = " . COURSE_TITLE_ID . "
                    WHERE nxyr.node_y_id = $dialogue_instance_node_id GROUP BY ni.node_instance_id) temp";
        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        return $resultObj->initialize($result)->toArray();

        /*$sql                     		= new Sql($this->adapter);
        $subSelect         				= $sql->select();
        $subSelect->from(array('nxyr' => 'node-x-y-relation'));
        $subSelect->columns(array('dialogue_node_id'=>'node_x_id'));
        $subSelect->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('status'=>'status'));
        $subSelect->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.DIALOGUE_TITLE_ID), array('dialogueTitle'=>'value'));
        $subSelect->join(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.DIALOGUE_ADMIN_ID), array('createdBy'=>'value'));
        $subSelect->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = nxyr.node_x_id', array('individual_node_id'=>'node_x_id'));
        $subSelect->join(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id <> '.STATEMENT_CLASS_ID), array());
        $subSelect->join(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id IN ('.INDIVIDUAL_FIRST_NAME.','.INDIVIDUAL_LAST_NAME.')'), array('user_name'=> new Predicate\Expression('GROUP_CONCAT(nip1.value separator  \' \')')));
        $subSelect->where->equalTo('nxyr.node_y_id',$course_instance_node_id);
        $subSelect->group('nxyr.node_x_id');
        $subSelect->group('nxyr1.node_x_id');
        $mainSelect = $sql->select();
        $mainSelect->columns(array('dialogue_node_id','dialogueTitle','createdBy','status',
            'userName' => new Predicate\Expression('GROUP_CONCAT(user_name)'),
            'user_id' => new Predicate\Expression('GROUP_CONCAT(individual_node_id)') ));
        $mainSelect->from(array('*' => $subSelect));
        $mainSelect->group('dialogue_node_id');
        $statement						=	$sql->prepareStatementForSqlObject($mainSelect);
        $result							=	$statement->execute();
        $resultObj						=	new ResultSet();
        return $resultAry				=	$resultObj->initialize($result)->toArray();
        */


        /*
    	$courseDialogueData 			= $this->getDilogueDataFromFile($dialogue_instance_node_id);
    	$statementPropertiesArray       = $this->getPropertiesStatement(COURSE_CLASS_ID);
    	$class_property_id 				= $statementPropertiesArray[2]['node_class_property_id'];
    	$CourseNodeInsId 				= $this->getInstanceIdByNodeId($courseDialogueData[0]['course_node_id']);
        $courseStatus    = ($CourseNodeInsId['status'] == '1') ? 'Published' : 'Draft';
        $CourseNodeInsId = $CourseNodeInsId['node_instance_id'];
    	$fetchPropertyIdAry             = $this->getNodePropertyId($CourseNodeInsId,$class_property_id);

    	$courseDialogueData[0]['course_node_id'] 	= $CourseNodeInsId;
    	$courseDialogueData[0]['course_property_id'] 		= $fetchPropertyIdAry['0']['node_instance_property_id'];
    	$courseDialogueData[0]['course_title'] 				= $courseDialogueData['0']['course_title'];
    	$courseDialogueData[0]['modeType'] 					= $modeType;
        $courseDialogueData[0]['courseStatementType'] 					= $courseStatus;


    	$structureObj 			= new StructureBuilderTable($this->adapter);
		$getParticipantEmail  	= $structureObj->getDialogueActorData($dialogue_instance_node_id);
		$emailStr= '';
    	$userInsNodeIdStr = '';
    	for($k=1;$k<count($getParticipantEmail);$k++)
    	{
    		$emailStr.= $getParticipantEmail[$k]['email_address'].',';
    		$userInsNodeIdStr.= $getParticipantEmail[$k]['user_instance_node_id'].',';
    		$nameStr.= $getParticipantEmail[$k]['user_name'].',';
    	}
    	$courseDialogueData[0]['email_address'] 					= substr($emailStr, 0, -1);
    	$courseDialogueData[0]['user_instance_node_id'] 			= $_SESSION['local_user_info']['node_id'];//substr($userInsNodeIdStr, 0, -1);
    	$courseDialogueData[0]['nameStr'] 							= substr($nameStr, 0, -1);
        * /
    	/*echo '<pre>';
    	print_r($courseDialogueData);
    	die('hhh');*/
    	//return $courseDialogueData;
    }
    public function getNodePropertyId($CourseNodeInsId,$class_property_id){
    	$sql                     		= new Sql($this->adapter);
		$select         				= $sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('node_instance_property_id'=>'node_instance_property_id'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('node_instance_id'=>'node_instance_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array());
		$select->where->AND->equalTo('ni.node_class_id',COURSE_CLASS_ID);
		$select->where->AND->equalTo('ni.node_instance_id',$CourseNodeInsId);
		$select->where->AND->equalTo('nip.node_class_property_id',$class_property_id);

		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$node_property_id				=	$resultObj->initialize($result)->toArray();
		return $node_property_id;
    }
    public function getStatementInstanceData($dialogue_instance_node_id,$loggedInUser){

    	$StatementData 		= $this->getAllStatementInstance($dialogue_instance_node_id,"",$loggedInUser);
    	$courseDialogueData[0]['statement'] = $StatementData;
    	// $courseDialogueData[0]['statement']['dialog_instance_node_id'] = $dialogue_instance_node_id;
	return $courseDialogueData;
    }
    public function getInstanceIdByNodeId($node_id)
	{
		$sql                		=	new Sql($this->adapter);
		$select						=	$sql->select();
		$select->from('node-instance');
		$select->columns(array('node_instance_id'=>'node_instance_id','status'=>'status'));
		$select->where->equalTo('node_id',$node_id);
		$statement					=	$sql->prepareStatementForSqlObject($select);
		$result						=	$statement->execute();
		$resultObj					=	new ResultSet();
		$dataArray					=	$resultObj->initialize($result)->toArray();
		return $dataArray[0];
	}


	public function fetchIndividualUserJoinDialgue($dialogueNodeId)
	{

		$sql                     		= new Sql($this->adapter);
		$select         				= $sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value'));
		$select->join(array('ni' => 'node-instance'), 'nip.node_instance_id = ni.node_instance_id',array('node_instance_id'=>'node_instance_id'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array());
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array());
		$select->where->equalTo('xy.node_y_id',$dialogueNodeId);
		$select->where->AND->equalTo('ni.node_class_id',INDIVIDUAL_CLASS_ID);
		$select->where->AND->notEqualTo('ncp.node_class_property_id',2923);

		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$indiAry						=	$resultObj->initialize($result)->toArray();
		$newTempArr     = array();
        $valueTempArr   = array();
        foreach ($indiAry as $key => $value) {
                $new_val = $value['value'];
                unset($value['value']);
                $value['value'][] = $new_val;
                if(array_key_exists($value['node_instance_id'], $newTempArr)) {
                  $newTempArr[$value['node_instance_id']]['value'][] = $new_val;
                }  else {
                  $newTempArr[$value['node_instance_id']]  = $value;
                }
        }
		return $newTempArr;
	}
	/* function here to use encrypt data */
	public function mc_encrypt($encrypt, $key)
	{
		if(ENCRYPTION_STATUS == 0){
	    	return $encrypt;
	    }else {
		    $encrypt = serialize($encrypt);
		    $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_DEV_URANDOM);
		    $key = pack('H*', $key);
		    $mac = hash_hmac('sha256', $encrypt, substr(bin2hex($key), -32));
		    $passcrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $encrypt.$mac, MCRYPT_MODE_CBC, $iv);
		    $encoded = base64_encode($passcrypt).'|'.base64_encode($iv);
		    return $encoded;
	    }
	}
	public function getinstanceDetails($node_instance_id)
    {
        $sql                		=	new Sql($this->adapter);
		$select						=	$sql->select();
		$select->from('node-instance');
		$select->where->equalTo('node_instance_id',$node_instance_id);
		$statement					=	$sql->prepareStatementForSqlObject($select);
		$result						=	$statement->execute();
		$resultObj					=	new ResultSet();
		$dataArray					=	$resultObj->initialize($result)->toArray();
		return $dataArray[0]['node_id'];
    }
	/*end code here */
	/**
	 * Function to delete the statement instances
	 */
	public function deleteStatementInstance($delete_data)
	{


		$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
		$deleteStatement  			= $structureObj->deleteStatementInstance($delete_data);

		/*$node_instance_id 		 = $delete_data['node_instance_id'];
		$dialog_instance_node_id = $delete_data['dialog_instance_node_id'];

		//get all the user in the system except not associated with dialogue
		$sql = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`, `ncp`.`caption` AS `caption` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = $node_instance_id AND ( `ncp`.`caption` = 'Statement' OR `ncp`.`caption` = 'Statement Type' )";
		$statement = $this->adapter->query($sql);
    	$result									=	$statement->execute();
		$resultObj								=	new ResultSet();
		$propertyAry		    			=	$resultObj->initialize($result)->toArray();
		$node_instance_property_id = $propertyAry['0']['node_instance_property_id'];
		foreach($propertyAry as $value)
		{
			if($value['caption']=='Statement Type')
			{
				$data['value']			=	'Statement';
			}
			else
			{
				$data['value']			=	'This message has been removed.';
			}
			$node_instance_property_id = $value['node_instance_property_id'];
			//update delete message
			$sql                	=	new Sql($this->adapter);

			$query 							=	$sql->update();
			$query->table('node-instance-property');
			$query->set($data);
			$query->where(array('node_instance_property_id' => $node_instance_property_id));
			$statement 					=	$sql->prepareStatementForSqlObject($query);
			$result 					=	$statement->execute();
			$resultObj 					=	new ResultSet();
			$affectedRows 				= 	$result->getAffectedRows();
		}

		//if($affectedRows){

		//insert all the statements again in the file from database
		$this->insertStatementInstance($dialog_instance_node_id) ;*/
		return $deleteStatement;
		//}
		/*else{
		return '0';
		}*/

	}
	/**
	 * Function to delete the statement instances
	 */

	public function deleteStatementLetterInstance($delete_data)
	{
		//$fileName = ABSO_URL."data/perspective_cache/dialogue_letter_".$delete_data['node_instance_id'].".txt";
        $fileName = "data/perspective_cache/dialogue_letter_".$delete_data['node_instance_id'].".txt";
        // AWS S3
        $awsObj         = new AwsS3();
        //if(file_exists($fileName)) {
        if ($awsObj->isObjectExist($fileName)) {
			$awsObj->deleteFileData($fileName);
		} else {
			echo 'dont exists - '.$fileName;
		}

		//$node_instance_id 		 = $delete_data['node_instance_id'];
		$node_instance_id 		 				= $this->getInstanceIdByNodeId($delete_data['node_instance_id']);
                $node_instance_id                                       = $node_instance_id['node_instance_id'];
		$dialog_instance_node_id 				= $delete_data['dialog_instance_node_id'];
		//get all the user in the system except not associated with dialogue

        $sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from('node-instance-property');
		$select->columns(array('node_id'));
		$select->where->equalTo('node_instance_id',$node_instance_id);
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$blankStatementArr	    =	$resultObj->initialize($result)->toArray();
		if(count($blankStatementArr) < 2)
		{
	        // --------------------------
			/* Work here to start save statement notification for dialogue instance class awdhesh soni */
			// STATEMENT
	        $statement_class_id             =   STATEMENT_CLASS_ID;
	        $statementPropertiesArray       =   $this->getPropertiesStatement($statement_class_id);
	        $node_class_property_id 		=   $statementPropertiesArray['2']['node_class_property_id'];

	        foreach($statementPropertiesArray as $key => $statementClassProperty)
	        {
	            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
	        }
	        $prefixTitle                            = PREFIX.'user_info';
        	$instance_property_array    =   array();
            $instance_property_array[0] =   $_SESSION[$prefixTitle]['node_id'];
            $instance_property_array[1] =   "";
            $instance_property_array[2] =   'This message has been removed';
            $instance_property_array[3] =   $delete_data['timestamp'];
          	// create new instance property //
            $this->createInstanceNotificationProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, 2);
			// --------------------------
	        /*
	        $output['node_instance_id']				=	$node_instance_id;
			$output['node_class_property_id']		=	$node_class_property_id;
			$output['node_id']						=	$this->createNodeCourseDialogue();
			$output['node_type_id']					=	2;
			$output['value']						=	'This message has been removed.';
			$sql 									=	new Sql($this->adapter);
			$query 									=	$sql->insert('node-instance-property');
			$query->values($output);
			$statement 								=	$sql->prepareStatementForSqlObject($query);
			$result 								=	$statement->execute();
			$resultObj 								=	new ResultSet();
			$resultObj->initialize($result);
			*/
			//$fileName = ABSO_URL."puidata/attachments/".$delete_data['node_instance_id']."";
            $awsFilePath = "puidata/attachments/".$delete_data['node_instance_id'];
			//if(file_exists($fileName)) {
            if ($awsObj->isObjectExist($awsFilePath)) {
				//unlink($fileName);
                $awsObj->deleteFileData($awsFilePath);
			} else {
				echo 'dont exists - '.$fileName;
			}
			return $id          					=   $this->adapter->getDriver()->getLastGeneratedValue();
		}
		else {
			//return null;
		}
		 $sql = "SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`, `ncp`.`caption` AS `caption` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = $node_instance_id AND ( `ncp`.`caption` = 'Statement' OR `ncp`.`caption` = 'Statement Type' )";
		$statement = $this->adapter->query($sql);
    	$result									=	$statement->execute();
		$resultObj								=	new ResultSet();
		$propertyAry		    				=	$resultObj->initialize($result)->toArray();
		$node_instance_property_id = $propertyAry['0']['node_instance_property_id'];
		foreach($propertyAry as $value)
		{
			if($value['caption']=='Statement Type')
			{
				$data['value']			=	'Letter';
			}
			else
			{
				$data['value']			=	'This message has been removed.';
			}
			$node_instance_property_id  =  $value['node_instance_property_id'];
			//update delete message
			$sql                		=	new Sql($this->adapter);
			$query 						=	$sql->update();
			$query->table('node-instance-property');
			$query->set($data);
			$query->where(array('node_instance_property_id' => $node_instance_property_id));
			$statement 					=	$sql->prepareStatementForSqlObject($query);
			$result 					=	$statement->execute();
			$resultObj 					=	new ResultSet();
			$affectedRows 				= 	$result->getAffectedRows();
		}

		//insert all the statements again in the file from database
		$this->insertStatementLetterInstance($dialog_instance_node_id) ;

	}
	public function getStatementLetterInstance($statementId)
	{

		$sql                	=	new Sql($this->adapter);
		$select					=	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('node_instance_id','node_id'));
		$select->join(array('xy' => 'node-x-y-relation'), 'ni.node_id = xy.node_x_id', array(), 'left');
		//$select->where->equalTo('ni.node_class_id',$node_class_id);
		$select->where->equalTo('xy.node_y_id',$statementId);
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$stmtXNodeId	    	=	$resultObj->initialize($result)->toArray();
		/*foreach ($stmtXNodeId as $key => $value)
		{
			 $impldeNXY[$key]['node_instance_id'] = $value['node_instance_id'];
			 $impldeNXY[$key]['node_id'] = $value['node_id'];
		}*/
		return $stmtXNodeId;
		//return implode(",", array_unique($impldeNXY));
	}
	/* function here to add Letter for statement class based of parent dialogue id*/
	public function addLetterStatement($data)
	{

		if($data['statements']!="")
		{
			$jsonArray['message'] 				= $data['statements'];
		}

		$jsonArray['sender']  					= $data['user_instance_node_id'];

		/*else {
					$jsonArray['action'] 					= "Statement";
					$jsonArray['messageType']               = "Statement";
				}*/
		if(isset($data['filetype']) && !empty($data['filetype']) && ($data['filetype']=='image')){

			$jsonArray['action'] 					= "image";
			$jsonArray['messageType']               = "image";
			$jsonArray['dialogue_node_id'] 				= $data['dialogue_node_id'];
			$jsonArray['dialogu_node_id'] 			= $data['dialogue_node_id'];
		}
		else if(isset($data['filetype']) && !empty($data['filetype']) && $data['filetype']=='attachment'){

			$jsonArray['action'] 					= "attachment";
			$jsonArray['messageType']               = "attachment";
			$jsonArray['dialogue_node_id'] 				= $data['dialogue_node_id'];
			$jsonArray['dialogu_node_id'] 			= $data['dialogue_node_id'];
		}
		else if($data['saveType']== 'P' && $data['type'] == 'appendStatementForDialogueLetterClass' && empty($data['filetype']))
         {
            $jsonArray['dialogue_node_id'] 			= $data['dialogue_node_id'];
            $jsonArray['action'] 				= $data['action'];
			$jsonArray['messageType']           = $data['action'];
			$jsonArray['dialogu_node_id'] 		= $data['dialogue_node_id'];
         }
        else
        {
        	$jsonArray['dialogue_node_id'] 			= $data['dialogueId'];
        	$jsonArray['action'] 				= $data['Coursetype'];
			$jsonArray['messageType']           = $data['Coursetype'];
			$jsonArray['dialogu_node_id'] 		= $data['dialogueId'];
        }

		$jsonArray['timestamp']               	= $data['timestamp'];
		$jsonArray['saveType']               	= $data['saveType'];
		$prefixTitle                            = PREFIX.'user_info';
		$jsonArray['username'] 					= $_SESSION[$prefixTitle]['first_name'].' '.$_SESSION[$prefixTitle]['last_name'];
		/*$jsonArray2['dialogueId'] 				= $dialog_instance_node_id;
		$jsonArray2['saveType'] 				= $saveType;*/
		if($data['blank_instance_node_id']!="")
		{
			//$fileName = ABSO_URL."data/perspective_cache/dialogue_letter_".$data['blank_instance_node_id'].".txt";
            $fileName = "data/perspective_cache/dialogue_letter_".$data['blank_instance_node_id'].".txt";
            // AWS S3
            $awsObj         = new AwsS3();
			//if(file_exists($fileName))
            if ($awsObj->isObjectExist($fileName)) {
				//unlink($fileName);
                $awsObj->deleteFileData($fileName);
			}
			else {
				echo 'dont exists - '.$fileName;
			}
			$blank_stmt_node_ins_id 				= $data['blank_instance_node_id'];
			$node_instance_id 		 				= $this->getStatementLetterInstance($blank_stmt_node_ins_id);
			$strindNodeId = array();
			$strNodeId = array();
			foreach ($node_instance_id as $key => $value)
			{
			 $strindNodeId[] = $value['node_instance_id'];
			 $strNodeId[] = $value['node_id'];
			}
			//$strindNodeId 							= implode(",", array_unique($impldeNXY));
			if($strindNodeId!=""){
		    	$this->commonDeleteMethodAll('node-instance-property','node_instance_id',$strindNodeId,'in');
			}
	        if($strindNodeId!=""){
	        	$this->commonDeleteMethodAll('node-instance','node_instance_id',$strindNodeId,'in');
	    	}

	        if($blank_stmt_node_ins_id!="")
	        {
	        	$this->commonDeleteMethodAll('node-x-y-relation','node_y_id',$blank_stmt_node_ins_id,'equalto');
	    	}
	    	if($strNodeId!=""){
	        	$this->commonDeleteMethodAll('node','node_id',$strNodeId,'in');
	    	}
	    	/* code here to update status of letter container */
	    	$this->updateLetterContainer($blank_stmt_node_ins_id);
	        $jsonArray['dialogue_node_id'] = $blank_stmt_node_ins_id;
			$savestate 				= $this->saveLetterStatementInstance($jsonArray);	// update statement letter data
		}
		else
		{
			preg_match('/>(<br>)<\/div>/', $jsonArray['message'][0]['statement'], $match);

			// if($match[1]!="<br>")
			// {

				$blank_stmt_node_ins_id 				= $this->saveBlankStatement($jsonArray);

				if(!empty($blank_stmt_node_ins_id))
				{
					$jsonArray['dialogue_node_id'] = $blank_stmt_node_ins_id;

				}
				else
				{
					$jsonArray['dialogue_node_id'] = $jsonArray['dialogue_node_id'];

				}
				$savestate = $this->saveLetterStatementInstance($jsonArray);	// add statement letter data
			//}
		}
		if($data['courseStatementType'] == "Draft" && $data['diaStatusType'] == "Draft")
		{
			$this->updatecourseStatus($data['course_node_id'], $jsonArray['dialogu_node_id']);
		}
		else if($data['courseStatementType'] == "Published" && $data['diaStatusType'] == "Draft"){
			$this->updatecourseStatus($data['course_node_id'], $jsonArray['dialogu_node_id']);
		}
		return $blank_stmt_node_ins_id.'-'.$savestate;
	}
	public function updateLetterContainer($blank_stmt_node_ins_id)
	{
		$structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
		$instanceId  			= $structureObj->getNodeinstanceIDDetails($blank_stmt_node_ins_id);
		$instancedata['value'] 			= 	1;
		$sql 							=	new Sql($this->adapter);
		$query 							=	$sql->update();
		$query->table('node-instance-property');
		$query->set($instancedata);
		$query->where->equalTo('node_instance_id',$instanceId);
		$query->where->equalTo('node_class_property_id','6790');
		$statement 						=	$sql->prepareStatementForSqlObject($query);
		$result 						=	$statement->execute();
		return $result;
	}
	/**
	 * Function to save the letter statement instances
	 * Created by Awdhesh Soni
	 */
	public function saveLetterStatementInstance($jsonArray1)
	{
		//return $jsonArray;
		$node_class_id  		= STATEMENT_CLASS_ID;
		$node_type_id			= '2';
		$jsonArray['message'] 	= trim($jsonArray1['message']);
		$message 				=  $jsonArray1['message'];
	    $temp 					=  $jsonArray1['message'];
		$folder_path     		= ABSO_URL . "data/perspective_cache/";
        // AWS S3
        $awsObj         = new AwsS3();

		if($jsonArray1['dialogue_node_id']!='' && $jsonArray1['sender']!='')
		{
			$node_ids = '';
			for($k = 0; $k<count($temp); $k++)
			{
				preg_match('/>(<br>)<\/div>/', $temp[$k]['statement'], $match);
				// if($match[1]!="<br>")
				// {
					//create node id first
					$data['node_id']				=	$this->createNodeCourseDialogue();
					$data['node_class_id']			=	$node_class_id;
					$data['node_type_id']			=	$node_type_id;
					$data['caption']	    		=   $data['node_id'];

					if($jsonArray1['saveType']!="P")
					{
						$data['status']         		=   0;
					}
					else
					{
						$data['status']         		=   1;
					}

					$sql 							=	new Sql($this->adapter);
					$query 							=	$sql->insert('node-instance');
					$query->values($data);
					$statement 						=	$sql->prepareStatementForSqlObject($query);
					$result 						=	$statement->execute();
					$resultObj 						=	new ResultSet();
					$resultObj->initialize($result);
					$node_instance_id            	=   $this->adapter->getDriver()->getLastGeneratedValue();
					$statement_instance_node_id  	=   $data['node_id'];

					if( $jsonArray1['messageType'] == 'Letter')
					{
						$node_ids .= $node_instance_id.'~';
					}
					else {
						$node_ids .= $node_instance_id.'~';
					}
					//insert value in node instance property.
					//get the node class property id
					$sql                	=	new Sql($this->adapter);
					$select					=	$sql->select();
					$select->from('node-class-property');
					$select->where->equalTo('node_class_id',$node_class_id  );
					$select->where->notEqualTo('node_class_property_parent_id',0);

					$statement				=	$sql->prepareStatementForSqlObject($select);
					$result					=	$statement->execute();
					$resultObj				=	new ResultSet();
					$classArray		    	=	$resultObj->initialize($result)->toArray();

					$valueArray = array();

					array_push($valueArray,$jsonArray1['sender']);
					array_push($valueArray,$jsonArray1['action']);
					//array_push($valueArray,$jsonArray1['message']);
					// modified code here for saving image/file condition add here 29th august 2016
				 	if($jsonArray1['action']=="image" || $jsonArray1['action']=="attachment"){
				 		array_push($valueArray, $jsonArray['message']);
				 	}else {
				 		array_push($valueArray, $temp[$k]['statement']);
				 	}
				 	array_push($valueArray,$jsonArray1['timestamp']);
				 	$i = 0;
					foreach($classArray as $value)
					{
						$output['node_id']					=	$this->createNodeCourseDialogue();
						$output['node_instance_id'] 		=   $node_instance_id;
						$output['node_class_property_id'] 	=   $value['node_class_property_id'];
						$output['node_type_id']	            =	$node_type_id;
						$output['value']	    			=   trim($valueArray[$i]);

						$sql 								=	new Sql($this->adapter);
						$query 								=	$sql->insert('node-instance-property');
						$query->values($output);
						//echo $query->getSqlstring();
						$statement 							=	$sql->prepareStatementForSqlObject($query);
						$result 							=	$statement->execute();
						$resultObj 							=	new ResultSet();
						$resultObj->initialize($result);
						$id          						=   $this->adapter->getDriver()->getLastGeneratedValue();

						$i++;

					}

					///write data into the file.
					$filename = 'dialogue_letter_'.$jsonArray1['dialogue_node_id'];
					$txt_filename =  $filename.".txt";
					$file_path = $folder_path.$txt_filename;

					$file_create = fopen($file_path, "a+") or die('cannot create file');
					$date_val 	= date('Y-m-d',strtotime($jsonArray1['timestamp']));
					$timestamp 	= date('Y-m-d H:i:s',strtotime($jsonArray1['timestamp']));
					$statement_type  	= $jsonArray1['action'];  //'text';//;
					if($jsonArray1['action']=="image" || $jsonArray1['action']=="attachment"){
						$statement   		= $jsonArray['message'];
					}else {
						$statement   		= $temp[$k]['statement'];
					}
					$username   		= htmlentities($jsonArray1["username"]);
					$sender   			= htmlentities($jsonArray1["sender"]);
					$node_instance_id  	= $node_instance_id;
					$saveType   		= $data['status'];
					//$separation_string = array()
					//if (file_exists($file_path))
                    $awsFilePath   = "data/perspective_cache/$txt_filename";
                    $file_data = '';
                    if ($awsObj->isObjectExist($awsFilePath)) {
						//$file_data = file_get_contents($file_path);
                        $file_data_res = $awsObj->getFileData($awsFilePath);
                        $file_data = $file_data_res['data'];
						$count = strlen(trim($file_data));

						/*if($count ==0)
						{
							$insert_string = $date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender ;
						}
						else
						{*/
							if (strpos($file_data,$date_val ) !== false)
							{
								$insert_string = '#~#'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender;
							}
							else
							{
								$insert_string = 'x~x'.$date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender;
							}
						//}
					} else {
                        $insert_string = $date_val.'x~x'.'timestamp=:'.$timestamp.'#~#'.'statement_type=:'.$statement_type.'#~#'.'statement=:'.$statement.'#~#'.'username=:'.$username.'#~#'.'node_instance_id=:'.$node_instance_id.'#~#'.'saveType=:'.$saveType.'#~#'.'actor=:'.$sender ;
                    }

					//fputs($file_create, trim($insert_string));
                    $awsObj->setFileData($awsFilePath, $file_data.trim($insert_string), "text");
					//maintain xy relation between dialogue instance node id and statement instance node id
					$res['node_y_id']  			= $jsonArray1['dialogue_node_id'];
					$res['node_x_id']  			= $statement_instance_node_id;
					$sql 						=	new Sql($this->adapter);
					$query 						=	$sql->insert('node-x-y-relation');
					$query->values($res);

					$statement 					=	$sql->prepareStatementForSqlObject($query);
					$result 					=	$statement->execute();
					$resultObj 					=	new ResultSet();
					$resultObj->initialize($result);

			}

			if($jsonArray1['messageType'] == 'Letter')
			{

				$node_instance_id = rtrim($node_ids, '~');
			}
			else
			{
				$node_instance_id = $node_instance_id;
			}
			//update the dialogue on which comment has been done
			$success = $this->updateDialogTimestamp($jsonArray1['dialogue_node_id']);
			if($success)
			{
				// update dialog detail
				//$dialogAry = $this->insertAllDialogueInstanceByUser($jsonArray['sender']);
				//$dialogAry = $this->getDialogInfo($jsonArray['sender']);
			}

		}

		return $node_instance_id;
	}
	/**
	 * Function to save the blank letter statement instances
	 * Created by Awdhesh Soni
	 */
	function saveBlankStatement($jsonArray)
	{

		$node_class_id  				= STATEMENT_CLASS_ID;
		$node_type_id					= '2';
		$message 						=  "";
		$data['node_id']				=	$this->createNodeCourseDialogue();
		$data['node_class_id']			=	$node_class_id;
		$data['node_type_id']			=	$node_type_id;
		$data['caption']	    		=   $data['node_id'];

		if($jsonArray['saveType']!="P")
		{
			$data['status']         	=   0;
		}
		else
		{
			$data['status']         	=   1;
		}
		/* save node instance functionality here*/
		$sql 							=	new Sql($this->adapter);
		$query 							=	$sql->insert('node-instance');
		$query->values($data);
		$statement 						=	$sql->prepareStatementForSqlObject($query);
		$result 						=	$statement->execute();
		$resultObj 						=	new ResultSet();
		$resultObj->initialize($result);
		$node_instance_id            	=   $this->adapter->getDriver()->getLastGeneratedValue();
		$statement_instance_node_id  	=   $data['node_id'];
		/* save node instance property functionality here */
		$sql        					=	new Sql($this->adapter);
		$select							=	$sql->select();
		$select->from('node-class-property');
		$select->where->equalTo('node_class_id',$node_class_id  );
		$select->where->notEqualTo('node_class_property_parent_id',0);
		$select->where->equalTo('caption','Statement Type');
		$select->where->OR->equalTo('caption','Updated Status');

		$statement						=	$sql->prepareStatementForSqlObject($select);
		$result							=	$statement->execute();
		$resultObj						=	new ResultSet();
		$classArray		    			=	$resultObj->initialize($result)->toArray();
		$valueArray = array();
		array_push($valueArray,'Letter Container');
		array_push($valueArray,0);
		$i = 0;

		foreach($classArray as $value)
		{
				$output['node_id']					=	$this->createNodeCourseDialogue();
				$output['node_instance_id'] 		=   $node_instance_id;
				$output['node_class_property_id'] 	=   $value['node_class_property_id'];
				$output['node_type_id']	            =	$node_type_id;
				$output['value']	    			=   $valueArray[$i];
				$sql 								=	new Sql($this->adapter);
				$query 								=	$sql->insert('node-instance-property');
				$query->values($output);
				$statement 							=	$sql->prepareStatementForSqlObject($query);
				$result 							=	$statement->execute();
				$resultObj 							=	new ResultSet();
				$resultObj->initialize($result);

			$i++;
		}
			if($jsonArray['dialogueId']!=""){
				$dia_node_id = $jsonArray['dialogueId'];
			}else {
				$dia_node_id = $jsonArray['dialogue_node_id'];
			}
			$res['node_y_id']  						= $dia_node_id;
			$res['node_x_id']  						= $statement_instance_node_id;
			$sql 									= new Sql($this->adapter);
			$query 									= $sql->insert('node-x-y-relation');
			$query->values($res);
			$statement 								=	$sql->prepareStatementForSqlObject($query);
			$result 								=	$statement->execute();
			$resultObj 								=	new ResultSet();
			$resultObj->initialize($result);
			return $statement_instance_node_id;
	}
	public function fetchLetterContainerStatus($node_instance_id){
		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('nip' => 'node-instance-property'));
		$select->columns(array('value'=>'value'));
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array());
		$select->where->AND->equalTo('ncp.caption','Updated Status');
		$select->where->AND->equalTo('nip.node_instance_id',$node_instance_id);
		$select->order('nip.node_instance_id DESC');
		//echo $select->getSqlstring();
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$statusArr	    		=	$resultObj->initialize($result)->toArray();
		return $statusArr[0]['value'];
	}
	/**
         * Update Code - Amit B
         * function here to fetch all letter statement
         * @param type $dialogue_instance_node_id
         * @return type Array
         */
	public function getLetterStatementInstanceData($dialogue_instance_node_id, $loggedInUser='')
	{
        $entryExitArr = array();
        if (!empty($loggedInUser)) {
            $structureObj = new StructureBuilderTable($this->adapter);            // call structure builder table modal
            $entryExitArr = $structureObj->getParticipantEntryExitTimestamp($dialogue_instance_node_id, $loggedInUser);
        }

		$sql                					=	new Sql($this->adapter);
		$select									=	$sql->select();
		$select->from(array('ni' => 'node-instance'));
		$select->columns(array('node_id'=>'node_id','node_instance_id'=>'node_instance_id'));
		$select->join(array('nip' => 'node-instance-property'), 'nip.node_instance_id = ni.node_instance_id',array('statement_type'=>'value'));
        if(count($entryExitArr)) {
            $select->join(array('nip2' => 'node-instance-property'), 'nip2.node_instance_id = nip.node_instance_id',array('timestamp'=>'value'));
        }
		$select->join(array('ncp' => 'node-class-property'), 'ncp.node_class_property_id = nip.node_class_property_id',array());
		$select->join(array('xy' => 'node-x-y-relation'), 'xy.node_x_id = ni.node_id',array());
		$select->where->equalTo('xy.node_y_id',$dialogue_instance_node_id);
		$select->where->AND->equalTo('ncp.caption','Statement Type');
		$select->where->NEST
                ->equalTo('nip.value','Letter Container')
//                ->OR
//                ->equalTo('nip.value','System Message')
                ->UNNEST;
        //$select->where->AND->equalTo('nip.value','Letter Container');
        if(count($entryExitArr)) {
	        $select->where->AND->equalTo('nip2.node_class_property_id',STATEMENT_TIMESTAMP_ID);
		}
        if(count($entryExitArr)) {
            if(isset($entryExitArr['added_on']) && isset($entryExitArr['deleted_on'])) {
                $select->where->AND->between('nip2.value', $entryExitArr['added_on'], $entryExitArr['deleted_on']);
            } elseif(isset($entryExitArr['added_on'])) {
                $select->where->AND->greaterThanOrEqualTo('nip2.value',$entryExitArr['added_on']);
            } elseif(isset($entryExitArr['deleted_on'])) {
                $select->where->AND->lessThanOrEqualTo('nip2.value',$entryExitArr['deleted_on']);
            }
        }
		$select->order('nip.value DESC');

		//echo $select->getSqlstring();die;
		$statement				=	$sql->prepareStatementForSqlObject($select);
		$result					=	$statement->execute();
		$resultObj				=	new ResultSet();
		$blankStatementArr	    =	$resultObj->initialize($result)->toArray();

		$StatementArr = array();
		$individual_node_class_id = INDIVIDUAL_CLASS_ID;
                $resultArr = array();
		foreach ($blankStatementArr as $key => $value)
		{
            if($value['statement_type']=="System Message")
            {
                $StatementArr[$key]['instance']['statement'][0]['statement'] = "lorme ipsum";
                $StatementArr[$key]['instance']['date'] = date('Y-m-d', $value['timestamp']);
                $StatementArr[$key]['instance']['timestamp'] = $value['timestamp'];
            }else{
                $AllData          = $this->getProValue($value['node_instance_id']);

                $StatementArrTemp = $this->getAllLetterStatementInstance($value['node_id'],$AllData[0]['value']);

                // No Letter Container data append if its instance is blank.
                if (count($StatementArrTemp['instance'])) {
                    $StatementArr[$key]                  = $StatementArrTemp;
                    $StatementArr[$key]['update_status'] = $this->fetchLetterContainerStatus($value['node_instance_id']);
                    $StatementArr[$key]['stmtData']      = $AllData[1]['value'];
                    $res                                 = $this->getUserProfile($AllData[0]['value'], $individual_node_class_id);
                } else if (intval($AllData[1]['value']) == 2) { // deleted statement
                    $res                                                        = $this->getUserProfile(end($AllData)['value'], $individual_node_class_id);
                    $StatementArr[$key]['instance']['first_name']               = $res['first_name'];
                    $StatementArr[$key]['instance']['last_name']                = $res['last_name'];
                    $StatementArr[$key]['instance']['date_of_birth']            = $res['date_of_birth'];

                    //Profile image added by Gaurav
                    //Added on 04 July 2017
                    $profileImage = $this->getClassesTable()->getProfileUserImage($res['profile_image'], 'thumbnail');

//                    $profileImage = BASE_URL."public/user.png";
//                    if(trim($res['profile_image'])!='' && file_exists(BASE_URL."public/nodeZimg/".$value)){
//                        $profileImage = BASE_URL."public/nodeZimg/".$value;
//                    }
                    $StatementArr[$key]['instance']['profile_image']            = $profileImage;
                    $StatementArr[$key]['instance']['actor.author']             = end($AllData)['value'];
                    $StatementArr[$key]['instance']['statement_type']           = 'Letter';
                    $StatementArr[$key]['instance']['statement'][]['statement'] = "This message has been removed.";
                    $StatementArr[$key]['instance']['timestamp']                = $AllData[0]['value'];
                    $StatementArr[$key]['instance']['statement_updated_timestamp']                = $AllData[2]['value'];
                    $StatementArr[$key]['instance']['date']                     = date('Y-m-d', $AllData[0]['value']);
                    $StatementArr[$key]['stmtData']                             = "This message has been removed.";
                    $StatementArr[$key]['update_status'] = 2;
                }
                $StatementArr[$key]['timestamp']          = $AllData[0]['value'];
                $StatementArr[$key]['username']           = $res['first_name'] . " " . $res['last_name'];
                $StatementArr[$key]['actor']              = $AllData[2]['value'];
                $StatementArr[$key]['blank_stmt_node_id'] = $value['node_id'];
                $StatementArr[$key]['node_instance_id']   = $value['node_instance_id'];
            }


            // Grouping of data with date
            if(!empty($StatementArr[$key]['instance']['date']) && isset($StatementArr[$key]['instance']['date'])){
                $resultArr[$StatementArr[$key]['instance']['date']][] = $StatementArr[$key];
            }

        }
    	//$StatementData 		= $StatementArr;
        // Modified code by suggestion Amit remove array_reverse
        //array_walk($resultArr, function(&$arr, $key) { $arr = array_reverse($arr); });
        array_walk($resultArr, function(&$arr, $key) { $arr = $arr; });

    	$courseDialogueData[0]['statement'] = $resultArr;
    	//$courseDialogueData[0]['statement']['dialog_instance_node_id'] = $dialogue_instance_node_id;
		return $courseDialogueData;
    }
    public function getProValue($ins_id)
    {

		$sql 		        =   "SELECT `nip`.`value` AS `value` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = $ins_id AND `ncp`.`caption` = ('Statement' AND 'timestamp' AND 'Actor.Author') AND `ncp`.`caption`!='Statement Type'";
		$statement 			=   $this->adapter->query($sql);
    	$result				=	$statement->execute();
		$resultObj			=	new ResultSet();
		$StatementArr		    =	$resultObj->initialize($result)->toArray();
		return $StatementArr;
    }
        /**
         * Update Code - Amit B
	 * Function to get all the instances from the DB
	 */
	public function getAllLetterStatementInstance($dialog_instance_node_id,$date_obj)
	{
                $loggedInUserNodeId     = $_SESSION['local_user_info']['node_id'];
                $structureObj 		= new StructureBuilderTable($this->adapter);          // call structure builder table modal change by Arti
		$chatData  			= $structureObj->getAllStatement($dialog_instance_node_id);

                // Add extra key for grouping in array from timestamp
                $chatData = array_map(function($arr){
                $date = date('Y-m-d', $arr['timestamp']);
                return $arr + ['date' => $date];
                }, $chatData);
                $groupChatData = array();
                $i = 0;

                foreach($chatData as $key => $val) {
                    $val['statement'] = stripslashes($val['statement']);
                    $val['timestamp'] = $date_obj;

                    if($i == 0){
                        // Draft Messgae will be shown to created user only and Grouping of instance with letter container instance.
                        if($val['node_statusType'] == '1' || ($val['node_statusType'] == '0' && $val['actor.author'] == $loggedInUserNodeId )) {
                            $groupChatData['instance'] = $val;
                            $groupChatData['instance']['statement_updated_timestamp'] = $val['updated_timestamp'];
                            $groupChatData['instance']['statement'] = array($val['statement_node_id'] => array("statement"=>$val['statement'], "statement_node_id"=>$val['statement_node_id'], "node_instance_propertyid"=>$val['node_instance_propertyid'], "statement_timestamp"=>$val['statement_timestamp']));
                        }
                    } else {
                        if($val['node_statusType'] == '1' || ($val['node_statusType'] == '0' && $val['actor.author'] == $loggedInUserNodeId ))
                        $groupChatData['instance']['statement_updated_timestamp'] = $val['updated_timestamp'];
                        $groupChatData['instance']['statement'][$val['statement_node_id']] = array("statement"=>$val['statement'], "statement_node_id"=>$val['statement_node_id'], "node_instance_propertyid"=>$val['node_instance_propertyid'], "statement_timestamp"=>$val['statement_timestamp']);
                    }
                    $i++;
                }

                return $groupChatData;
                // COmmment File system code
		//insert all the statements again in the file from database
		//$this->insertStatementInstance($dialog_instance_node_id);
		/*$folder_path     =  ABSO_URL . "data/perspective_cache/";
		$filename 		 = 'dialogue_letter_'.$dialog_instance_node_id;
		$txt_filename 	 =  $filename.".txt";
		$file_path 		 =  $folder_path.$txt_filename;
		/*if (file_exists($file_path))
		{
			$file_create     = fopen($file_path, "r+") or die('cannot  file');
		}
		else
		{
			$file_create     = fopen($file_path, "w+") or die('cannot  file');

		}
		$dialogAry       = array();
		$newArray        = array();
		$statementArray  = array();
		//if (file_exists($file_path))
        // AWS S3
        $awsObj         = new AwsS3();
        $awsFilePath   = "data/perspective_cache/$txt_filename";
        if ($awsObj->isObjectExist($awsFilePath)) {
			//$file_data = file_get_contents($file_path);
            $file_data_res = $awsObj->getFileData($awsFilePath);
            $file_data = $file_data_res['data'];

		 	if($date_obj)
			{
				$split_date = 'x~x'.$date_obj;
				$data_res  = explode($split_date,$file_data);
				$file_data  = $data_res['0'];

			}
			else {
				$date_data  = explode('x~x',$file_data);
			}

			$dialogAry = array();
			for($i=0; $i<count($date_data);)
			{
				if (strpos($date_data[$i],'#~#' ) !== false)
				{
					$content_data = explode('#~#',$date_data[$i]);

					$dialogAry = array();
					for($j=0;$j<count($content_data);$j++)
					{
						$statementAry = explode('=:',$content_data[$j]);

						if(strtolower($statementAry[0]) == strtolower('timestamp')){

							$newArray[$statementAry[0]] = $statementAry[1] ;
						}
						else{

							$newArray[$statementAry[0]] = $statementAry[1] ;

						 }
						if(strtolower($statementAry[0]) == strtolower('actor'))
						{
							array_push($dialogAry, $newArray);
							$statementArray[$pre]= $dialogAry;
							//array_push($abc[$pre],$dialogAry);

						}

					}

				}
				else
				{

					$pre = $date_data[$i];

				}
				$i = $i+1;
			}
		}
		//fclose($file_create);
                // Update Permission for double instance
                chmod($file_path, 0777);
		return $statementArray;*/
	}
	/* Common Delete Function Created By awdhesh Soni */
	public function commonDeleteMethodAll($tableName,$primaryColumnName,$primaryColumnValue,$condtionType)
	{
		$sql = new Sql($this->adapter);
		$delete = $sql->delete();
        $delete->from($tableName);
        if($condtionType == 'equalto')
        	$delete->where->equalTo($primaryColumnName,$primaryColumnValue);
    	if($condtionType == 'in')
    		$delete->where->IN($primaryColumnName,$primaryColumnValue);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();
	}
	/**
         * getInstancePropertyDetail - To handle the delete letter functionality
         * @param type $ins_id
         * @param type $node_ins_id
         * @return array
         */
        function getInstancePropertyDetail($ins_id, $node_ins_id) {
        $sql = "SELECT `ncp`.`caption` AS `caption`, `nip`.`node_class_property_id` AS `node_class_property_id`, `nip`.`value` AS `value` FROM `node-instance-property` AS `nip` INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` WHERE `nip`.`node_instance_id` = $ins_id ";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $StatementArr = $resultObj->initialize($result)->toArray();
        foreach ($StatementArr as $data) {
            if ($data['node_class_property_id'] == '6790') {
                $data['value'] = 2;
            } else if ($data['node_class_property_id'] == '843') {
                $data['value'] = 'This message has been removed.';
            }
            $p_id[] = $data['node_class_property_id'];
            $value[] = $data['value'];
        }
        $sql = "SELECT `node_y_id` FROM `node-x-y-relation` WHERE `node_x_id` = $node_ins_id ";
        $statement = $this->adapter->query($sql);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $StatementArr1 = $resultObj->initialize($result)->toArray();
        $StatementArr = array();
        $StatementArr['y_node_id'] = $StatementArr1[0]['node_y_id'];
        $StatementArr['node_class_property_id'] = $p_id;
        $StatementArr['value'] = $value;
        $StatementArr['node_class_id'] = STATEMENT_CLASS_ID;
        return $StatementArr;
    }

    function setNewInstancePropertyDetail($InstanceVal) {
        $dataArray['node_instance_id'] = '';
        $dataArray['node_class_id'] = $InstanceVal['node_class_id'];
        $dataArray['node_class_property_id'] = $InstanceVal['node_class_property_id'];
        $dataArray['value'] = $InstanceVal['value'];
        $dataArray['is_email'] = 'N';
        $dataArray['status'] = 1;
        $structureObj = new StructureBuilderTable($this->adapter);
        $instanceArray = $structureObj->createInstanceOfClass($dataArray['node_class_id'], $dataArray['status']);

        if (intval($instanceArray['node_instance_id']) > 0) {
            $structureObj->createInstanceProperty($dataArray['node_class_property_id'], $dataArray['value'], $instanceArray['node_instance_id'], $instanceArray['node_type_id'], $dataArray['is_email'], '', '');
            $node_x_ids[] = intval($instanceArray['node_id']);
            $data = $structureObj->createRelation($InstanceVal['y_node_id'], $node_x_ids);
        }
        return intval($instanceArray['node_instance_id']);
    }
    public function getUserDialogueNotificationCount($dialouge_node_id,$user_instance_node_id,$type="",$operator="=")
	{
            //echo strtolower($type);

                /*modified static id to dynamic id by awdhesh soni*/

                if(strtolower($type) == 'chat')
		{
			/*
                         * Commented and Modified BY: Divya Rajput
                         * On Date: 5th June 2017
                         * Purpose: It is taking time and using multiple IN inside query
                         * Before Optimization, 4 records: 0.0145 sec
                         * After Optimization, 4 records: 0.0081 sec
                         *
                        $sql = "SELECT ni1.node_instance_id FROM `node-instance` AS ni1
					INNER JOIN `node-instance-property` AS nip2 ON ni1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".STATEMENT_TYPE_ID." AND nip2.value IN ('Statement','image','attachment','System Message')
					WHERE ni1.node_id IN (SELECT nxy.node_y_id FROM `node-x-y-relation` AS nxy WHERE nxy.node_x_id IN (SELECT ni.node_id FROM `node-instance` AS ni
					INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".NOTIFICATION_ACTOR_PID." AND nip.value = ".$user_instance_node_id."
					WHERE ni.node_class_id = ".NOTIFICATION_CLASS_ID." AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = ".NOTIFICATION_DIALOG_PID." AND nip.value = ".$dialouge_node_id.")))";
                        */
			        if(count($dialouge_node_id)) {
                        $sql    = new Sql($this->adapter);
                        $select = $sql->select();
                        $select->columns(array('node_instance_id'));
                        $select->from(array('ni1' => 'node-instance'));
                        $select->join(array('nip2' => 'node-instance-property'), 'ni1.node_instance_id = nip2.node_instance_id', array());
                        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni1.node_id', array());
                        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = ' . NOTIFICATION_CLASS_ID), array());
                        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ' . NOTIFICATION_ACTOR_PID), array());
                        $select->join(array('nip1' => 'node-instance-property'), 'ni.node_instance_id = nip1.node_instance_id', array('dialogue_node_id' => 'value'));
                        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_x_id = ni.node_id', array());

                        $select->where->equalTo('nip2.node_class_property_id', STATEMENT_TYPE_ID);
                        $select->where->IN('nip2.value', array('Statement', 'image', 'attachment', 'System Message'));
                        $select->where->AND->equalTo('nip.value', $user_instance_node_id);
                        //Modified by Gaurav
                        //14 June 2017
                        if (is_array($dialouge_node_id)) {
                            $select->where->IN('nip1.value', $dialouge_node_id);
                        } else {
                            $select->where->AND->equalTo('nip1.value', $dialouge_node_id);
                        }

                        $select->where->AND->equalTo('nip1.node_class_property_id', NOTIFICATION_DIALOG_PID);
                        //return $select->getSqlString();
                    } else {
                        return array();
                    }
		}
		else if(strtolower($type) == 'letter')
		{
			/*
                         * Commented and Modified BY: Divya Rajput
                         * On Date: 5th June 2017
                         * Purpose: It is taking time and using multiple IN inside query
                         * Before Optimization, no records: 0.1138 sec
                         * After Optimization, no records: 0.0412 sec
                         *
                        $sql = "SELECT ni1.node_instance_id FROM `node-instance` AS ni1
					INNER JOIN `node-instance-property` AS nip2 ON ni1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = ".STATEMENT_TYPE_ID." AND nip2.value IN( 'Letter Container','System Message')
					WHERE ni1.node_id IN (SELECT nxy.node_y_id FROM `node-x-y-relation` AS nxy WHERE nxy.node_x_id IN (SELECT ni.node_id FROM `node-instance` AS ni
					INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".NOTIFICATION_ACTOR_PID." AND nip.value = ".$user_instance_node_id."
					WHERE ni.node_class_id = ".NOTIFICATION_CLASS_ID." AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = ".NOTIFICATION_DIALOG_PID." AND nip.value = ".$dialouge_node_id.")))";
                        */
                        $sql            = new Sql($this->adapter);
                        $select         = $sql->select();
                        $select->columns(array('node_instance_id'));
                        $select->from(array('ni1' => 'node-instance'));
                        $select->join(array('nip2' => 'node-instance-property'), 'ni1.node_instance_id = nip2.node_instance_id', array());
                        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_y_id = ni1.node_id', array());
                        $select->join(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.NOTIFICATION_CLASS_ID), array());
                        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.NOTIFICATION_ACTOR_PID), array());
                        $select->join(array('nip1' => 'node-instance-property'), 'ni.node_instance_id = nip1.node_instance_id', array());
                        $select->join(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_x_id = ni.node_id', array());
                        $select->where->equalTo('nip2.node_class_property_id', STATEMENT_TYPE_ID);
                        $select->where->IN('nip2.value', array('Letter Container','System Message'));
                        $select->where->AND->equalTo('nip.value', $user_instance_node_id);
                        $select->where->AND->equalTo('nip1.value', $dialouge_node_id);
                        $select->where->AND->equalTo('nip1.node_class_property_id', NOTIFICATION_DIALOG_PID);
		}
		else
		{
			/*
                         * Commented and Modified BY: Divya Rajput
                         * On Date: 5th June 2017
                         * Purpose: Notification Count is not working properly
                         *
                        $sql = "SELECT ni.node_instance_id FROM `node-instance` AS ni
				INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = ".NOTIFICATION_ACTOR_PID." AND nip.value = ".$user_instance_node_id."
				WHERE ni.node_class_id = ".NOTIFICATION_CLASS_ID." AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = ".NOTIFICATION_DIALOG_PID." AND nip.value ". $operator." ".$dialouge_node_id.")";
                        */
                    if($dialouge_node_id){
						$sql            = new Sql($this->adapter);
                        $select         = $sql->select();
                        $select->columns(array('node_instance_id'));
                        $select->from(array('ni' => 'node-instance'));
                        $select->join(array('nip' => 'node-instance-property'), new Predicate\Expression('ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = '.NOTIFICATION_ACTOR_PID), array());
                        $select->join(array('nip1' => 'node-instance-property'), 'ni.node_instance_id = nip1.node_instance_id', array('dialogue_node_id'=>'value'));
                        $select->join(array('nxyr' => 'node-x-y-relation'), 'nxyr.node_x_id = ni.node_id', array());
                        $select->where->equalTo('ni.node_class_id', NOTIFICATION_CLASS_ID);
                        $select->where->AND->equalTo('nip.value', $user_instance_node_id);
                        if(strtolower($operator) == 'in'){
                            $select->where->IN('nip1.value', $dialouge_node_id);
                        }else{
                            $select->where->AND->equalTo('nip1.value', $dialouge_node_id);
                        }
                        $select->where->AND->equalTo('nip1.node_class_property_id', NOTIFICATION_DIALOG_PID);
					}else{
						return array();
					}
		}


		/* Arvind Soni
                if(strtolower($type) == 'chat')
		{
			$sql = "SELECT ni1.node_instance_id FROM `node-instance` AS ni1
					INNER JOIN `node-instance-property` AS nip2 ON ni1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = 842 AND nip2.value IN ('Statement','image','attachment','System Message')
					WHERE ni1.node_id IN (SELECT nxy.node_y_id FROM `node-x-y-relation` AS nxy WHERE nxy.node_x_id IN (SELECT ni.node_id FROM `node-instance` AS ni
					INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = 3475 AND nip.value = ".$user_instance_node_id."
					WHERE ni.node_class_id = 671 AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = 3477 AND nip.value = ".$dialouge_node_id.")))";
		}
		else if(strtolower($type) == 'letter')
		{
			$sql = "SELECT ni1.node_instance_id FROM `node-instance` AS ni1
					INNER JOIN `node-instance-property` AS nip2 ON ni1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = 842 AND nip2.value IN( 'Letter Container' ,'System Message')
					WHERE ni1.node_id IN (SELECT nxy.node_y_id FROM `node-x-y-relation` AS nxy WHERE nxy.node_x_id IN (SELECT ni.node_id FROM `node-instance` AS ni
					INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = 3475 AND nip.value = ".$user_instance_node_id."
					WHERE ni.node_class_id = 671 AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = 3477 AND nip.value = ".$dialouge_node_id.")))";
		}
		else
		{
			$sql = "SELECT ni.node_instance_id FROM `node-instance` AS ni
				INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = 3475 AND nip.value = ".$user_instance_node_id."
				WHERE ni.node_class_id = 671 AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = 3477 AND nip.value = ".$dialouge_node_id.")";
		} */

                $statement      = $sql->prepareStatementForSqlObject($select);
                $result         = $statement->execute();
                $resultObj      = new ResultSet();
                return $resultObj->initialize($result)->toArray();
	}
	public function removeNotificationUserWise($statement_id,$dialouge_node_id,$user_instance_node_id)
	{
		// SELECT noi.node_instance_id,noi.node_id, nxy.node_x_id, noi1.node_instance_id, noi1.node_class_id FROM `node-instance` AS noi
		 $sql = "SELECT noi1.node_instance_id FROM `node-instance` AS noi
				LEFT JOIN `node-x-y-relation` AS nxy ON noi.node_id = nxy.node_y_id
				INNER JOIN `node-instance` AS noi1 ON noi1.node_id = nxy.node_x_id AND noi1.node_class_id = 671
				WHERE noi.node_instance_id = ".$statement_id." AND noi1.node_instance_id IN (SELECT ni.node_instance_id FROM `node-instance` AS ni
				INNER JOIN `node-instance-property` AS nip ON ni.node_instance_id = nip.node_instance_id AND nip.node_class_property_id = 3475 AND nip.value = ".$user_instance_node_id."
				WHERE ni.node_class_id = 671 AND ni.node_instance_id in (SELECT nip.node_instance_id FROM `node-instance-property` AS nip WHERE nip.node_class_property_id = 3477 AND nip.value = ".$dialouge_node_id."))";


        $statement 		= $this->adapter->query($sql);
        $result 		= $statement->execute();
        $resultObj 		= new ResultSet();
        $returnArr 		= $resultObj->initialize($result)->toArray();

        $sql 			= "DELETE FROM `node-instance-property` WHERE `node_instance_id` = ".$returnArr[0]['node_instance_id'];
        $statement 		= $this->adapter->query($sql);
        $result 		= $statement->execute();
        $sql 			= "DELETE FROM `node-instance` WHERE `node_instance_id` = ".$returnArr[0]['node_instance_id'];
        $statement 		= $this->adapter->query($sql);
        $result 		= $statement->execute();

        return $returnArr[0]['node_instance_id'];
	}

        /**
     * Use for get all user list with node id key
     * @return type : array
     */
    public function getUserList() {
        //query modified by gaurav on 8 sept 2017
        //get account status and REPLACE(LOWER(ncp.caption),' ','_') AS name_caption move to php function
        //query time reduce to 1/10th 
        
         $QUERY = "SELECT ni.node_id,nip.value AS name, ncp.caption AS name_caption,nip1.value AS email, nip2.value AS profile_image, nip3.value AS account_status
                        FROM `node-instance` ni
                        JOIN `node-instance-property` nip ON nip.node_instance_id =  ni.node_instance_id AND nip.node_class_property_id in (" . INDIVIDUAL_FIRST_NAME . "," . INDIVIDUAL_LAST_NAME . ")
                        JOIN `node-class-property` ncp ON ncp.node_class_property_id = nip.node_class_property_id
                        JOIN `node-x-y-relation` nxyr ON nxyr.node_y_id = ni.node_id
                        JOIN `node-instance`  ni1 ON ni1.node_id = nxyr.node_x_id AND ni1.node_class_id = " . ACCOUNT_CLASS_ID . "
                        JOIN `node-instance-property` nip1 ON nip1.node_instance_id =  ni1.node_instance_id AND nip1.node_class_property_id in (" . INDIVIDUAL_EMAIL_ID . ")
                        LEFT JOIN `node-instance-property` nip2 ON nip2.node_instance_id =  ni.node_instance_id AND nip2.node_class_property_id in (" . INDIVIDUAL_PROFILE_IMAGE . ")
                        LEFT JOIN `node-instance-property` nip3 ON nip3.node_instance_id =  ni1.node_instance_id AND nip3.node_class_property_id in (" . ACCOUNT_STATUS_ID . ")
                       
                        WHERE ni.node_class_id = " . INDIVIDUAL_CLASS_ID . " AND ni.status = 1";
        //print_r($QUERY);

        $statement = $this->adapter->query($QUERY);
        $result = $statement->execute();
        $resultObj = new ResultSet();
        $_userListArr = $resultObj->initialize($result)->toArray();
        $_userList = array();
        //print_r($_userListArr);
        foreach ($_userListArr AS $key => $value) {
            $name_caption = strtolower(str_replace(' ', '_', $value['name_caption']));
            $_userList[$value['node_id']][$name_caption] = trim($value['name']);
            $_userList[$value['node_id']]['email_address'] = trim($value['email']);
            $accStatus = trim($value['account_status']);
            $_userList[$value['node_id']]['account_status'] = $accStatus!=''? $accStatus:'active';
            $_userList[$value['node_id']]['node_id'] = $value['node_id'];
            $_userList[$value['node_id']]['profile_image'] = $this->getClassesTable()->getProfileUserImage(trim($value['profile_image']), 'thumbnail');
            if ($name_caption == 'first_name') {
                $_userList[$value['node_id']]['first_name'] = $_userList[$value['node_id']]['first_name'] ?? $value['name'] ?? '';
                $_userList[$value['node_id']]['last_name']  = $_userList[$value['node_id']]['last_name'] ?? '';
            } elseif ($name_caption == 'last_name') {
                $_userList[$value['node_id']]['first_name'] = $_userList[$value['node_id']]['first_name'] ?? '';
                $_userList[$value['node_id']]['last_name']  = $_userList[$value['node_id']]['last_name'] ?? $value['name'] ?? '';
            }
            //For set guest image
            if(isset($_userList[$value['node_id']]['account_status']) && $_userList[$value['node_id']]['account_status']=='guest'){
                $_userList[$value['node_id']]['profile_image'] = $this->getClassesTable()->getProfileUserImage('', 'guest');
            }
        }
        //print_R($_userList);
        return $_userList;
    }

    /*
     * Created By: Divya Rajput
     * Fetch All data on behalf of user id and course instance id
     * Dialogue + Course + Dialogue Order on behalf of latest statement
     */
    public function getAllCourseDialogueData($course_instance_id, $login_userId){
        $_data['login_userId']      = $login_userId;
        $_data['view_type']         = 'bydialogue';
        $_data['course_instance_id']    = $course_instance_id;
        $_data['listing']           = true;

        $classObj   = new ClassesTable($this->adapter);
        return $classObj->fetchCoureListData($_data);
    }

    /*
     * Created By: Divya Rajput
     * Date: 5th Oct 2017
     * Fetch All Dialogue of a course of a particular user on behalf of course_node_id and login_user_id
     * param $login_user_id
     * param $course_node_id
     * return login user info array for a course related dialogue array
     */
    public function fetchCourseDialogue($login_user_id, $course_node_id){
        $sql            = new Sql($this->adapter);
        $select         = $sql->select();
        $select->quantifier('DISTINCT');
        $select->columns(array());
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->JOIN(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.DIALOGUE_CLASS_ID), array('dialogue_node_id' => 'node_id'));
        $select->JOIN(array('nxyr1' => 'node-x-y-relation'), 'nxyr1.node_y_id = ni.node_id', array());
        $select->JOIN(array('ni1' => 'node-instance'), new Predicate\Expression('ni1.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        $select->JOIN(array('nip1' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip1.node_instance_id AND nip1.node_class_property_id = '.INDIVIDUAL_ACTORID_PROP_ID.' AND FIND_IN_SET('.$login_user_id.', nip1.value)'), array('actor_id' => 'value'));
        $select->JOIN(array('nip2' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip2.node_instance_id AND nip2.node_class_property_id = '.INDIVIDUAL_STATUS_PROP_ID), array('actor_status' => 'value'));
        $select->JOIN(array('nip3' => 'node-instance-property'), new Predicate\Expression('ni1.node_instance_id = nip3.node_instance_id AND nip3.node_class_property_id = '.INDIVIDUAL_TIMESTAMP_PROP_ID), array('actor_time' => 'value'));
        $select->JOIN(array('ni2' => 'node-instance'), new Predicate\Expression('ni2.node_id = nxyr1.node_x_id AND ni1.node_class_id = '.INDIVIDUAL_HISTORY_CLASS_ID), array());
        if(is_array($course_node_id)) {
            $select->WHERE->IN('nxyr.node_y_id', $course_node_id);
        }else{
            $select->WHERE->equalTo('nxyr.node_y_id', trim($course_node_id));
        }

        $statement      = $sql->prepareStatementForSqlObject($select);
        $result         = $statement->execute();
        $resultObj      = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }

    /*
     * Created By: Divya Rajput
     * Date: 5th Oct 2017
     * Fetch All Statement's attachment/images for different Dialogue of a course of a particular user on behalf of course_node_id and login_user_id
     * param array $dialogue_node_id
     * return statement array attachment and images which has not been removed from dialogue.
     */
    public function fetchDataForResource($dialogue_node_id_arr){
        $sql            = new Sql($this->adapter);
        $select         = $sql->select();
        $select->quantifier('DISTINCT');
        $select->columns(array('dialogue_node_id' => 'node_y_id'));
        $select->from(array('nxyr' => 'node-x-y-relation'));
        $select->JOIN(array('ni' => 'node-instance'), new Predicate\Expression('ni.node_id = nxyr.node_x_id AND ni.node_class_id = '.STATEMENT_CLASS_ID), array('statement_instance_id' => 'node_instance_id'));
        $select->JOIN(array('nip' => 'node-instance-property'), new Predicate\Expression('nip.node_instance_id = ni.node_instance_id AND nip.value IN (\'image\', \'attachment\')'), array('statement_type' => 'value'));
        $select->JOIN(array('nip1' => 'node-instance-property'), new Predicate\Expression('nip1.node_instance_id = nip.node_instance_id AND nip1.node_class_property_id = '.STATEMENT_TIMESTAMP_ID), array('node_class_property_id', 'timestamp' => 'value'));
        $select->JOIN(array('nip3' => 'node-instance-property'), new Predicate\Expression('nip3.node_instance_id = nip.node_instance_id AND nip3.node_class_property_id = '.STATEMENT_UPDATED_STATUS.' AND nip3.value != 2'), array());
        $select->JOIN(array('nip2' => 'node-instance-property'), new Predicate\Expression('nip2.node_instance_id = nip.node_instance_id AND nip2.node_class_property_id = '.STATEMENT_TITLE_ID), array('attachment_name' => 'value'));
        $select->WHERE->IN('nxyr.node_y_id', $dialogue_node_id_arr);
        $statement      = $sql->prepareStatementForSqlObject($select);
        $result         = $statement->execute();
        $resultObj      = new ResultSet();
        return $resultObj->initialize($result)->toArray();
    }
}
