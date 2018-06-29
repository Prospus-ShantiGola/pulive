<?php
namespace Grid\Controller;
use Administrator\Controller\Plugin\AwsS3;
use Administrator\Controller\ClassesController;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class DocumentsController extends AbstractActionController
{ 
	protected $gridTable;
	protected $view;
	protected $classesTable;
	
	/**
	*  get gridTable..
	*  @param:
	*  @return:object of gridTable
	*/
	public function getGridTable() 
	{
		if (!$this->gridTable) 
		{
			$sm					=	$this->getServiceLocator();
			$this->gridTable 	=	$sm->get('Grid\Model\GridTable');
		}
		return $this->gridTable;
	}  

	public function getClassesTable()
    {
        if (!$this->classesTable) {        
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    } 

	/**
	*  Add Phase Structure on Right Side by this Function
	*/

    public function indexAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();

        if ($request->isPost()) {
            $post               = $request->getPost()->toArray();
            $config             = $this->getServiceLocator()->get('config');
            $dialogue_class_id  = $config['constants']['DIALOGUE_CLASS_ID'];
            $title_class_id     = $config['constants']['DIALOGUE_TITLE_ID'];
            $template_class_id  = $config['constants']['DIALOGUE_TEMPLATE_ID'].',';
            

            $TemplateType = $this->getClassesTable()->getDocType($post['node_instance_id'], $template_class_id);

            // INSTANCE STRUCTURE
            //$startTime = microtime(true);
            $instanceArray      = $this->getChildClassInstancePrint(array($post['node_id']), $dialogue_class_id, array());
            
            $stmtArray          = array();
            foreach($instanceArray as $key => $value) {
                if($key == 'childs') {
                    // get dialogue details
                    $dialogueInstance = current($value);
                } else {
                    // get statement details            
                    $individualInstance = current(array_slice($value,-1,1));
                    
                    //echo $statementInstance .= $statement;
                    foreach(current($value) as $stmt) {
                        if(count($stmt) ==1)
                            array_push($stmtArray, $stmt);
                    }                    
                }
            }
            
            return new ViewModel(array('documentTitle' => $dialogueInstance[$title_class_id], 'statements' => $stmtArray, 'post' => $post,'templateVal'=>$TemplateType));
        }
        return new ViewModel();
    }

    private function getChildClassInstancePrint($sub_class_node_id_array, $node_class_id, $temp_array)
    {
        if (count($sub_class_node_id_array) > 0) {

            $i = 0;
            foreach ($sub_class_node_id_array as $key => $node_sub_class_id) {

                $node_instance_id = $this->getClassesTable()->getinstanceDetailsByNodeId($node_sub_class_id);
                if ($node_instance_id) {
                    $sub_class_node_id_new                                      = $this->getClassesTable()->getNodeXIdFromXYTable($node_sub_class_id);
                    //$nodeClassNodeId                                           = $this->getClassesTable()->fetchNodeClassNodeId($node_instance_id);
                    //$temp_array['childs'][$nodeClassNodeId][$node_instance_id] = $this->getClassesTable()->fetchNodeInstancePropertyPrint($node_instance_id);
                    $temp_array['childs'][$node_instance_id] = $this->getClassesTable()->fetchNodeInstancePropertyPrint($node_instance_id);
                    // find parent node_instance_id
                    //$temp_array['childs'][$nodeClassNodeId][$node_instance_id]['parent'] = $this->getClassesTable()->fetchNodeYFromXY($node_sub_class_id);
                    if (count($sub_class_node_id_new) > 0) {
                        ++$i;
                        $temp_array[$i] = $this->getChildClassInstancePrint($sub_class_node_id_new, $node_class_id, array());
                    }
                }
            }
        }

        return $temp_array;
    }

    public function getAllDocsAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $config            = $this->getServiceLocator()->get('config');
            //$dialogue_class_id = $config['constants']['DIALOGUE_CLASS_ID'];
            $dialogue_template_class_id = $config['constants']['DIALOGUE_TEMPLATE_ID'];
            $dialogue_title_class_id = $config['constants']['DIALOGUE_TITLE_ID'];
            $result = $this->getGridTable()->getDocumentsList($dialogue_template_class_id,$dialogue_title_class_id);
            echo json_encode($result);
        }
        exit;
    }

    /**
     * Created by: Amit Malakar
     * Date: 03-Feb-2016
     * Save document
     */
    public function saveAction()
    {
        $layout                 =   $this->layout();
        $layout->setTemplate('layout/simple');

        $request                =   $this->getRequest();

        if($request->isPost()) 
        {
            $post               =   $request->getPost();
            $document           =   $post['document'];

            

            /*if(empty($post['document']['dialogue_title'])) {
                echo json_encode(array('error'=>'Please enter document title.'));
                exit;
            }*/

            $saveType           =   $post['saveType'];
            $instance_id        =   $post['instance_id'];
            $folder_instance_node_id   =   $post['instancenodeid'];

            $config             =   $this->getServiceLocator()->get('config');
            $dialogue_class_id  =   $config['constants']['DIALOGUE_CLASS_ID'];
            //echo htmlentities($document['statementData']);exit;
            $result             =   $this->saveDocumentsData($document, $dialogue_class_id, $saveType, $instance_id, $folder_instance_node_id);
            echo json_encode($result);
        }
        exit;
    }

    /**
     * Created by: Amit Malakar
     * Date: 03-Feb-2016
     * Save Document Data
     * @param $document
     * @param $dialogue_class_id
     * @return array
     */
    public function saveDocumentsData($document, $dialogue_class_id, $saveType, $instance_id, $folder_instance_node_id)
    {
        $session                    = new Container('base');
        $loggedUserInfo             = $session->offsetGet('user_info');
        $document['dialogue_admin'] = $node_id_user = $loggedUserInfo['node_id'];
        $individual_instance_id     = '';

        $instance_property_array    = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $document['dialogue_template'];
        $instance_property_array[3] = $document['dialogue_title'];
        $instance_property_array[4] = $document['dialogue_admin'];
        $instance_property_array[5] = $document['dialogue_timestamp'];
        $statementData              = $document['statementData'];

        $typeArray                  = $this->getClassesTable()->getClassList($dialogue_class_id);
        $node_type_id               = $typeArray['node_type_id'];
       
        // DIALOGUE CLASS
        $dialoguePropertiesArray    = $this->getClassesTable()->getProperties($dialogue_class_id); 
        foreach ($dialoguePropertiesArray as $key => $dialogueClassProperty) {
            $node_class_property_id[$key] = $dialogueClassProperty['node_class_property_id'];
        } 
        $instance_caption           = intval($instance_id)>0 ? $instance_id : 0;
        
        if (intval($instance_id) > 0) 
        {
            // fetch nod id on behalf on nstance id //
            $instance_caption           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $instance_id);
            $node_instance_id_dialogue  =   $this->getClassesTable()->createInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType, $instance_id);
            
            // update instance property //
            $this->getClassesTable()->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id_dialogue, $node_class_property_id);
            
            // ============
            $node_id                    =   $this->getClassesTable()->getinstanceDetails($instance_id);
            $node_x_id_array            =   $this->getClassesTable()->getNodeXIdFromXYTable($node_id);
            $individual_instance_id     =   count($node_x_id_array)? array_pop($node_x_id_array) : '';
            // ============
            $node_id_dialogue           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_dialogue);
        } 
        else 
        {
            $node_instance_id_dialogue  =   $this->getClassesTable()->createInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType);
            $node_type_id;
            $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_dialogue, $node_type_id);

            $node_id_dialogue           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_dialogue);

            $dialog_instance_node_id    =   ",".$node_id_dialogue;
            $this->getClassesTable()->saveNodeX($folder_instance_node_id, $dialog_instance_node_id);
        }      
        

        // STATEMENT SUBCLASS        
        $dialogue_struc                 =   $this->getClassesTable()->getClassPropertyStructure($dialogue_class_id);

        $statement_class_id             =   $dialogue_struc['sc'][0];
        $statementPropertiesArray       =   $this->getClassesTable()->getProperties($statement_class_id);
        $statement_node_x_id_array      =   $this->getClassesTable()->getInstaceIdByNodeXYAndNodeInstance($node_id, $statement_class_id);
            
        foreach($statementPropertiesArray as $key => $statementClassProperty) {
            $node_class_property_id_stmt[$key] = $statementClassProperty['node_class_property_id'];
        }
        
        
        if(strtolower($document['dialogue_template']) == "canvas"){
            $instance_property_array    =   array();
            $instance_property_array[0] =   "";
            $instance_property_array[1] =   "";
            $instance_property_array[2] =   "";
            $instance_property_array[3] =   $document['statementData'];
            $instance_property_array[4] =   "";

            if(isset($statement_node_x_id_array[0]['node_x_id']) && $statement_node_x_id_array[0]['node_x_id'] > 0 )
            {
                $node_instance_id_stmt  =   $this->getClassesTable()->getinstanceDetailsByNodeId($statement_node_x_id_array[0]['node_x_id']);
            }
            else
            {
                $node_instance_id_stmt  =   0;
            }
             
            if($node_instance_id_stmt > 0){                
                //update
                $node_instance_id           =   $this->getClassesTable()->createInstance($statement_node_x_id_array[$key]['node_x_id'], $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                $this->getClassesTable()->updateSubInstancePropertyAgain($instance_property_array,$node_type_id,$node_instance_id_stmt,$node_class_property_id_stmt);
            }else{
                //insert
                $instance_caption           =   $node_instance_id_stmt;
                $node_instance_id           =   $this->getClassesTable()->createInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                // create new instance property //
                $this->getClassesTable()->createInstanceProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
                //get node_id of node instance table for series class
                $stmt_node_id             =   $this->getClassesTable()->getInstanceDetails($node_instance_id);
                $stmt_node_ids            =   ",".$stmt_node_id;
                $this->getClassesTable()->saveNodeX($node_id_dialogue, $stmt_node_ids); 
            }
        } 
        else {
            foreach($document['statementData'] as $key => $stmt) 
            {
            $instance_property_array    =   array();
            $instance_property_array[0] =   "";
            $instance_property_array[1] =   $stmt['statement_actorauthor'];
            $instance_property_array[2] =   $stmt['statement_type'];
            $instance_property_array[3] =   $stmt['statement'];
            $instance_property_array[4] =   $stmt['statement_timestamp'];

            if(isset($statement_node_x_id_array[$key]['node_x_id']) && $statement_node_x_id_array[$key]['node_x_id'] > 0 )
            {
                $node_instance_id_stmt  =   $this->getClassesTable()->getinstanceDetailsByNodeId($statement_node_x_id_array[$key]['node_x_id']);
            }
            else
            {
                $node_instance_id_stmt  =   0;
            }

            /*
            * Modified By Divya
            * On Date 5th April 2016
            * in case of update document statement instances
            */
            // create new/update Statement Instance            
            if($node_instance_id_stmt > 0){                
                //update
                $node_instance_id           =   $this->getClassesTable()->createInstance($statement_node_x_id_array[$key]['node_x_id'], $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                $this->getClassesTable()->updateSubInstancePropertyAgain($instance_property_array,$node_type_id,$node_instance_id_stmt,$node_class_property_id_stmt);
            }else{
                //insert
                $instance_caption           =   $node_instance_id_stmt;
                $node_instance_id           =   $this->getClassesTable()->createInstance($instance_caption, $statement_class_id, $node_type_id, $saveType, $node_instance_id_stmt);
                // create new instance property //
                $this->getClassesTable()->createInstanceProperty($node_class_property_id_stmt, $instance_property_array, $node_instance_id, $node_type_id);
                //get node_id of node instance table for series class
                $stmt_node_id             =   $this->getClassesTable()->getInstanceDetails($node_instance_id);
                $stmt_node_ids            =   ",".$stmt_node_id;
                $this->getClassesTable()->saveNodeX($node_id_dialogue, $stmt_node_ids); 
            }

            
            }
        }
        // INDIVIDUAL SUBCLASS
        /*if(intval($instance_id) > 0) {
            //if($node_id_user != $individual_instance_id) {
            //}
        } else {
            $this->getClassesTable()->saveNodeX($node_id_dialogue, $node_id_user); // parent, child
        }*/

        return array("node_instance_id" => $node_instance_id_dialogue, "node_id"=> $node_id_dialogue,"templateType"=>$document['dialogue_template'],"dialogueTitle"=>$document['dialogue_title']);
    }

    /**
     * Created by: Awdhesh Ku soni
     * Date: 26-Feb-2016
     * Save Folder
     */
    public function saveFolderAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        if ($request->isPost()) {
            $post               = $request->getPost();
            
            $folder             = $post['folderName'];
            $parent_id          = $post['parent_id'];
            $saveType           = $post['saveType'];
            $instance_id        = $post['instance_id'];

            $config             = $this->getServiceLocator()->get('config');
            $folder_class_id    = $config['constants']['FOLDER_CLASS_ID'];
            /*$doc_class_id       = $config['constants']['DOC_CLASS_ID']; 
            $docPropertiesArray = $this->getClassesTable()->getProperties($doc_class_id);*/
            $result             = $this->saveFolderData($folder, $folder_class_id, $saveType, $instance_id,$parent_id);
            echo json_encode($result);
        }
        exit;
    }
    
    /**
     * Created by: Awdhesh Soni
     * Date: 03-Mar-2016
     * Save Document Data
     * @param $document
     * @param $folder_class_id
     * @return array
     */
    public function saveFolderData($folder, $folder_class_id, $saveType, $instance_id,$parent_id)
    {
        $individual_instance_id     = "";
        $instance_property_array    = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $folder;
        $instance_property_array[3] = $parent_id;
        $instance_property_array[4] = date("Y-m-d H:i:s");
        //$statementData              = $document['statementData'];
        $typeArray                  = $this->getClassesTable()->getClassList($folder_class_id);
        $node_type_id               = $typeArray['node_type_id'];
        // FOLDER CLASS
        $FolderPropertyArray        = $this->getClassesTable()->getProperties($folder_class_id);

        
        foreach ($FolderPropertyArray as $key => $folderCladdArray) {
            $node_class_property_id[$key] = $folderCladdArray['node_class_property_id'];
        }
        $instance_caption          = intval($instance_id)>0 ? $instance_id : 0;
        
        if (intval($instance_id) > 0) {
            $node_instance_id_folder = $this->getClassesTable()->createInstance($instance_caption, $folder_class_id, $node_type_id, $saveType, $instance_id);
            // update instance property //
            $this->getClassesTable()->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id_folder, $node_class_property_id);
            // ============
            $node_id = $this->getClassesTable()->getinstanceDetails($instance_id);
            $node_x_id_array                    =   $this->getClassesTable()->getNodeXIdFromXYTable($node_id);
            $individual_instance_id = count($node_x_id_array)? array_pop($node_x_id_array) : '';
            // ============
        } else {
            
            $node_instance_id_folder = $this->getClassesTable()->createFolderInstance($instance_caption, $folder_class_id, $node_type_id, $saveType);
            $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_folder, $node_type_id);
        }

        $node_id_folder = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_folder);

       

        return array("node_instance_id" => $node_instance_id_folder, "node_id"=> $node_id_folder);
    }

    /**
     * Created by: Awdhesh Ku soni
     * Date: 10-Mar-2016
     * Save Sub Folder
     */
    public function saveSubFolderAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        if ($request->isPost()) {
            $post               = $request->getPost();
            
            $folder             = $post['folderName'];
            $parent_id          = $post['parent_id'];
            $saveType           = $post['saveType'];
            $instance_id        = $post['instance_id'];

            $config             = $this->getServiceLocator()->get('config');
            $folder_class_id    = $config['constants']['FOLDER_CLASS_ID'];
            
            

            $result             = $this->saveSubFolderData($folder, $folder_class_id, $saveType, $instance_id,$parent_id);
            echo json_encode($result);
        }
        exit;
    } 
    public function saveSubFolderData($folder, $folder_class_id, $saveType, $instance_id,$parent_id)
    {
        $individual_instance_id     = "";
        $instance_property_array    = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $folder;
        $instance_property_array[3] = $parent_id;
        $instance_property_array[4] = date("Y-m-d H:i:s");
        //$statementData              = $document['statementData'];
        $typeArray                  = $this->getClassesTable()->getClassList($folder_class_id);
        $node_type_id               = $typeArray['node_type_id'];
        // FOLDER CLASS
        $FolderPropertyArray        = $this->getClassesTable()->getProperties($folder_class_id);

        
        foreach ($FolderPropertyArray as $key => $folderCladdArray) {
            $node_class_property_id[$key] = $folderCladdArray['node_class_property_id'];
        }
        $instance_caption          = intval($instance_id)>0 ? $instance_id : 0;
        
        $node_instance_id_folder = $this->getClassesTable()->createInstance($instance_caption, $folder_class_id, $node_type_id, $saveType);
        $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_folder, $node_type_id);
        $node_id_folder = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_folder);

        $this->getClassesTable()->commonDeleteMethod('node-x-y-relation','node_x_id',$node_id_folder,'equalto');               
        $this->getClassesTable()->saveNodeX($parent_id, $node_id_folder); 
        
        return array("node_instance_id" => $node_instance_id_folder, "node_id"=> $parent_id);
    }  
    /**
     * Created by: Awdhesh Soni
     * Date: 08-Mar-2016
     * Save Document Data
     * @param $document
     * @param $doc_class_id
     * @return array
     */
    public function saveFolderFileAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        $classArray                     =   array();
        $err                            =   0;
        $errorMsg                       =   '';
        $file_name                      =   '';
        $json                           =   array();
        $awsObj                         = new AwsS3();
        if ($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $file                       =   $request->getFiles()->toArray();
            //$randName                   =   $this->generateRandomStringAction(8);
            $file_name                  =   $file['file']['name'];
            $FileName = explode(".", $file_name);
            $uploaddir  = 'public/folderFile/';
            $uploadfile = $uploaddir . $FileName[0].'_'.time().'.'.$FileName[1];
            
            $title              = $FileName[0].'_'.time();
            $saveType           = "D";
            $instance_id        = $post['instance_id'];
            $config             = $this->getServiceLocator()->get('config');  

            //$uploadfile = $uploaddir . $FileName[0].'_'.$FileName[1];
            if(strtolower($FileName[1]) == "doc" || strtolower($FileName[1]) == "docx") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                    /* code here to save doctitle,folder and Doctype in DocClass parent Class Folder*/
                        $doc_class_id       = $config['constants']['DOC_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "xlsx" || strtolower($FileName[1]) == "xls") {
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['XLS_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "csv") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['CSV_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "pdf") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['PDF_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "ppt") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['PPT_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "jpeg" || strtolower($FileName[1]) == "jpg") {
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['JPEG_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }

            else if(strtolower($FileName[1]) == "png") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['PNG_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }
            else if(strtolower($FileName[1]) == "gif") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['GIF_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }

            else if(strtolower($FileName[1]) == "zip") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['ZIP_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }

            else if(strtolower($FileName[1]) == "rar") {
                
                $result             = $awsObj->setFileData($uploadfile,$file['file']['tmp_name'],'file');
                //if (move_uploaded_file($file['file']['tmp_name'], $uploadfile)) {
                if($result['status_code'] == '200') {
                        $doc_class_id       = $config['constants']['RAR_CLASS_ID']; 
                        $result             = $this->saveFolderDocData($title, $FileName[1],$post['folderId'],$doc_class_id, $saveType, $instance_id);
                }
                print json_encode($result);
            }

            else {
                print json_encode(0);
            }
            
            exit;
        }
    }

    public function saveFolderDocData($title,$docType,$folderId,$doc_class_id, $saveType, $instance_id)
    {
        
        $instance_property_array    = array();
        $instance_property_array[0] = "";
        $instance_property_array[1] = "";
        $instance_property_array[2] = $title;
        $instance_property_array[3] = $folderId;
        $instance_property_array[4] = $docType;
        $instance_property_array[5] = date("Y-m-d H:i:s");

        $typeArray                  = $this->getClassesTable()->getClassList($doc_class_id);
        $node_type_id               = $typeArray['node_type_id'];
        
        $docPropertiesArray        = $this->getClassesTable()->getProperties($doc_class_id);

        foreach ($docPropertiesArray as $key => $docProperties) {
            $node_class_property_id[$key] = $docProperties['node_class_property_id'];
        }

        $instance_caption          = intval($instance_id)>0 ? $instance_id : 0;
        $node_instance_id_doc = $this->getClassesTable()->createInstance($instance_caption, $doc_class_id, $node_type_id, $saveType);
        $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_doc, $node_type_id);
        $node_instance_id_doc             =   $this->getClassesTable()->getInstanceDetails($node_instance_id_doc);
        $node_instance_id_doc             =   ",".$node_instance_id_doc;
        $this->getClassesTable()->saveNodeX($folderId, $node_instance_id_doc); // parent, child
        $node_id_doc = $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_doc);
        return array("node_instance_id" => $node_instance_id_doc, "node_id"=> $node_id_doc);
    }

    public function fileHelperAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post  = $request->getPost();
            
        }
       return new ViewModel(array('titledata'=>$post['title']));
    }

    /* code here start to display defalut page click on resources*/
    public function folderListAction() {
        error_reporting(0);
        $layout             = $this->layout();
        if(!$this->getRequest()->isXmlHttpRequest()){
            $layout->setTemplate('layout/layout');
        }else{
            $layout->setTemplate('layout/simple');
            //$is_main_layout = 'N';
        }
        $request            = $this->getRequest();
        $post               = array();
        
        $display                        = 'Normal';
        $order_by                       = 'sequence';
        $order                          = 'DESC';
        $page                           = 1;
        $filter_operator                = '';
        $search_text                    = '';
        $filter_field                   = '';
        $mode                           = 'Normal';
        //$defaultItemsPerPage            = 1000;
        $is_auto                        = '';
        $display                        = 'no-pagination';
        if ($request->isPost()) {
            
            $post           = $request->getPost()->toArray();

            if($post['type'] == 'no-pagination' && $post['filter_operator']=="")
            {
                $display                = 'no-pagination';
                $order_by               = $post['order_by'];
                $order                  = $post['order'];
                $page                   = 1;
                $mode                   = $post['mode'];                 
            }

            if($post['filter_operator'] != '' && $post['search_text'] != '')
            {
                $filter_operator        = $post['filter_operator'];
                $search_text            = $post['search_text'];
                $filter_field           = $post['filter_field'];
                $mode                   = $post['mode']; 
            }

        }

        $config                         = $this->getServiceLocator()->get('config');
        $folder_class_id                = $config['constants']['FOLDER_CLASS_ID'];
        $folderParentId                 = $config['constants']['FOLDER_PARENT_ID'];
        $folderTimeStampId              = $config['constants']['FOLDER_TIMESTAMP_ID'];
        
       // $classArray         = $this->getClassesTable()->getClassListByPagination($order,$order_by,$display,$filter_operator,$search_text,$filter_field,$hit_by);
        
        $instanceArray                  = $this->getClassesTable()->fetchnodeInstanceFoldeName($folder_class_id,$filter_operator,$filter_field,$search_text,$order_by,$order,$folderParentId,$folderTimeStampId);

        if($display == 'no-pagination')
        {
            return new ViewModel(array(
                'order_by'      => $order_by,
                'order'         => $order,
                'instanceArray' => $instanceArray,
                'display'       => $display,
                'mode'          => $mode
                
            ));
        }  
        //return new ViewModel(array('instanceArray'=>$instanceArray));
    }

    /*
     * Function here to use to display folder details by folder active class wise // Awdhesh soni
     */
    public function folderDetailsAction() {
        
        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        
        $display                        = 'Normal';
        $order_by                       = 'node_class_property_id';
        $order                          = 'ASC';
        $page                           = 1;
        $filter_operator                = '';
        $search_text                    = '';
        $filter_field                   = '';
        $mode                           = 'Normal';
        $is_auto                        = '';
        $display                        = 'no-pagination';
        
        if ($request->isPost()) 
        {            
            $post           = $request->getPost()->toArray();
            
            if($post['type'] == 'no-pagination' && $post['filter_operator']=="" && $post['mode']=='Normal')
            {
                $display                = 'no-pagination';
                //$order_by               = $post['order_by'];
                $order_by               = 'node_class_property_id';
                //$order                  = $post['order'];
                $order                  = 'ASC';

                $page                   = 1;
                $mode                   = $post['mode'];                 
            }

            if($post['type'] == 'no-pagination' && $post['filter_operator']=="" && $post['mode']=='Ajax')
            {
                $display                = 'no-pagination';
                //$order_by               = $post['order_by'];
                $order_by               = 'node_class_property_id';
                $order                  = $post['order'];
                $page                   = 1;
                $mode                   = $post['mode'];                 
            } 

            if($post['filter_operator'] != '' && $post['search_text'] != '')
            {
                $filter_operator        = $post['filter_operator'];
                $search_text            = $post['search_text'];
                $filter_field           = $post['filter_field'];
                $mode                   = 'Ajax'; 
                $display                = 'no-pagination';
                $order                  = $post['order'];
                $order_by               = $post['order_by'];
            }
        }

        $config                         = $this->getServiceLocator()->get('config');
        $folder_class_id                = $config['constants']['FOLDER_CLASS_ID'];

        
        $folder_parent_id               = $config['constants']['FOLDER_PARENT_ID']; 
        $folder_title_id                = $config['constants']['FOLDER_TITLE_ID'];
        $folder_timestamp_id            = $config['constants']['FOLDER_TIMESTAMP_ID'];
         
        /*doc class id*/
        $doc_class_id                   = $config['constants']['DOC_CLASS_ID'];     
        $doc_title_id                   = $config['constants']['DOC_TITLE_ID'];
        $doc_timestamp_id               = $config['constants']['DOC_TIMESTAMP_ID']; 
        $doc_folder_id                  = $config['constants']['DOC_FOLDER_ID'];
        $doc_type_id                    = $config['constants']['DOC_TYPE_ID'];

        /*xlsx class id */
        $xlsx_class_id                  = $config['constants']['XLS_CLASS_ID'];     
        $xlsx_title_id                  = $config['constants']['XLS_TITLE_ID'];
        $xlsx_timestamp_id              = $config['constants']['XLS_TIMESTAMP_ID']; 
        $xlsx_folder_id                 = $config['constants']['XLS_FOLDER_ID'];
        $xlsx_type_id                   = $config['constants']['XLS_TYPE_ID'];

        $csv_class_id                   = $config['constants']['CSV_CLASS_ID'];     
        $csv_title_id                   = $config['constants']['CSV_TITLE_ID'];
        $csv_timestamp_id               = $config['constants']['CSV_TIMESTAMP_ID']; 
        $csv_folder_id                  = $config['constants']['CSV_FOLDER_ID'];
        $csv_type_id                    = $config['constants']['CSV_TYPE_ID'];

        $pdf_class_id                   = $config['constants']['PDF_CLASS_ID'];     
        $pdf_title_id                   = $config['constants']['PDF_TITLE_ID'];
        $pdf_timestamp_id               = $config['constants']['PDF_TIMESTAMP_ID']; 
        $pdf_folder_id                  = $config['constants']['PDF_FOLDER_ID'];
        $pdf_type_id                    = $config['constants']['PDF_TYPE_ID'];
        
        $ppt_class_id                   = $config['constants']['PPT_CLASS_ID'];     
        $ppt_title_id                   = $config['constants']['PPT_TITLE_ID'];
        $ppt_timestamp_id               = $config['constants']['PPT_TIMESTAMP_ID']; 
        $ppt_folder_id                  = $config['constants']['PPT_FOLDER_ID'];
        $ppt_type_id                    = $config['constants']['PPT_TYPE_ID'];

        $jpeg_class_id                  = $config['constants']['JPEG_CLASS_ID'];     
        $jpeg_title_id                  = $config['constants']['JPEG_TITLE_ID'];
        $jpeg_timestamp_id              = $config['constants']['JPEG_TIMESTAMP_ID']; 
        $jpeg_folder_id                 = $config['constants']['JPEG_FOLDER_ID'];
        $jpeg_type_id                   = $config['constants']['JPEG_TYPE_ID'];

        $png_class_id                   = $config['constants']['PNG_CLASS_ID'];       
        $png_title_id                   = $config['constants']['PNG_TITLE_ID'];
        $png_timestamp_id               = $config['constants']['PNG_TIMESTAMP_ID'];   
        $png_folder_id                  = $config['constants']['PNG_FOLDER_ID'];
        $png_type_id                    = $config['constants']['PNG_TYPE_ID'];

        $gif_class_id                   = $config['constants']['GIF_CLASS_ID'];       
        $gif_title_id                   = $config['constants']['GIF_TITLE_ID'];
        $gif_timestamp_id               = $config['constants']['GIF_TIMESTAMP_ID'];   
        $gif_folder_id                  = $config['constants']['GIF_FOLDER_ID'];
        $gif_type_id                    = $config['constants']['GIF_TYPE_ID'];

        $zip_class_id                   = $config['constants']['ZIP_CLASS_ID'];       
        $zip_title_id                   = $config['constants']['ZIP_TITLE_ID'];
        $zip_timestamp_id               = $config['constants']['ZIP_TIMESTAMP_ID'];   
        $zip_folder_id                  = $config['constants']['ZIP_FOLDER_ID'];
        $zip_type_id                    = $config['constants']['ZIP_TYPE_ID'];

        $rar_class_id                   = $config['constants']['RAR_CLASS_ID'];       
        $rar_title_id                   = $config['constants']['RAR_TITLE_ID'];
        $rar_timestamp_id               = $config['constants']['RAR_TIMESTAMP_ID'];   
        $rar_folder_id                  = $config['constants']['RAR_FOLDER_ID'];
        $rar_type_id                    = $config['constants']['RAR_TYPE_ID'];

        
        /*
         * Added by Divya Rajput
         * On Date 22nd April 2016
         * Dialogue Class Data Variable
        */
        $dialog_class_id                = $config['constants']['DIALOGUE_CLASS_ID'];       
        $dialog_template_id             = $config['constants']['DIALOGUE_TEMPLATE_ID'];
        $dialog_title_id                = $config['constants']['DIALOGUE_TITLE_ID'];
        $dialog_timestamp_id            = $config['constants']['DIALOGUE_TIMESTAMP_ID'];   
        $dialog_type_id                 = "";
        /* End Here */


        $folderId                       = $post['class_node_id']; 
        
        /*Addded dialog_class_id*/
        $commonclassId                  = $folder_class_id.','.$doc_class_id.','.$xlsx_class_id.','.$csv_class_id.','.$pdf_class_id.','.$ppt_class_id.','.$jpeg_class_id.','.$png_class_id.','.$gif_class_id.','.$zip_class_id.','.$rar_class_id.','.$dialog_class_id; 
        
        //$common_property_id             = $doc_title_id.','.$doc_timestamp_id.','.$folder_title_id.','.$folder_timestamp_id.','.$xlsx_title_id.','.$xlsx_timestamp_id.','.$csv_title_id.','.$csv_timestamp_id.','.$pdf_title_id.','.$pdf_timestamp_id.','.$ppt_title_id.','.$ppt_timestamp_id.','.$jpeg_title_id.','.$jpeg_timestamp_id.','.$png_title_id.','.$png_timestamp_id.','.$gif_title_id.','.$gif_timestamp_id;
        
        /*Addded dialog_title_id*/
        $common_property_id             = $doc_title_id.','.$folder_title_id.','.$xlsx_title_id.','.$csv_title_id.','.$pdf_title_id.','.$ppt_title_id.','.$jpeg_title_id.','.$png_title_id.','.$gif_title_id.','.$zip_title_id.','.$rar_title_id.','.$dialog_title_id;
        $instanceArray                  = $this->getClassesTable()->fetchnodeInstanceFolderDetails($commonclassId,$filter_operator,$filter_field,$search_text,$order_by,$order,$mode,$folderId,$folder_parent_id,$common_property_id);
        


        $newTempArr     = array();
        foreach ($instanceArray as $key => $value) 
        {
            if($value['node_class_id'] == $folder_class_id){
                $nodeClassPropertyId = $folder_timestamp_id;
                $nodeTypePropertyId  = '';
            }
            else if($value['node_class_id'] == $doc_class_id){
                $nodeClassPropertyId = $doc_timestamp_id;
                $nodeTypePropertyId  = $doc_type_id;
            }
            else if($value['node_class_id'] == $xlsx_class_id){
                $nodeClassPropertyId = $xlsx_timestamp_id;
                $nodeTypePropertyId  = $xlsx_type_id;
            }
            else if($value['node_class_id'] == $csv_class_id){
                $nodeClassPropertyId = $csv_timestamp_id;
                $nodeTypePropertyId  = $csv_type_id;
            }
            else if($value['node_class_id'] == $pdf_class_id){
                $nodeClassPropertyId = $pdf_timestamp_id;
                $nodeTypePropertyId  = $pdf_type_id;
            }
            else if($value['node_class_id'] == $ppt_class_id){
                $nodeClassPropertyId = $ppt_timestamp_id;
                $nodeTypePropertyId  = $ppt_type_id;
            }
            else if($value['node_class_id'] == $jpeg_class_id){
                $nodeClassPropertyId = $jpeg_timestamp_id;
                $nodeTypePropertyId  = $jpeg_type_id;
            }
            else if($value['node_class_id'] == $png_class_id){
                $nodeClassPropertyId = $png_timestamp_id;
                $nodeTypePropertyId  = $png_type_id;
            }
            else if($value['node_class_id'] == $gif_class_id){
                $nodeClassPropertyId = $gif_timestamp_id;
                $nodeTypePropertyId  = $gif_type_id;
            }

            else if($value['node_class_id'] == $zip_class_id){
                $nodeClassPropertyId = $zip_timestamp_id;
                $nodeTypePropertyId  = $zip_type_id;
            }
            else if($value['node_class_id'] == $rar_class_id){
                $nodeClassPropertyId = $rar_timestamp_id;
                $nodeTypePropertyId  = $rar_type_id;
            }
            /* Added by Divya Rajput On Date 22nd April 2016 */
            else if($value['node_class_id'] == $dialog_class_id){
                $nodeClassPropertyId = $dialog_timestamp_id;
                $nodeTypePropertyId  = "";
            }
            /*End Here*/

            $instanceArray[$key]['timeStamp'] = $this->getClassesTable()->getTimeStampOfDocument($value['node_instance_id'],$nodeClassPropertyId);
            if($nodeTypePropertyId!=""){
                $instanceArray[$key]['type']      = $this->getClassesTable()->getTypeOfDocument($value['node_instance_id'],$nodeTypePropertyId);    
            }else {
                $instanceArray[$key]['type'] = "";
            }       
        }

        /*$newTempArr     = array();
        $valueTempArr   = array();
        foreach ($instanceArray as $key => $value) {
                $new_val = $value['value'];                
                unset($value['value']);
                $value['value'][] = $new_val;
                if(array_key_exists($value['node_instance_id'], $newTempArr)) {
                  $newTempArr[$value['node_instance_id']]['value'][] = $new_val;
                }  else {
                  $newTempArr[$value['node_instance_id']]  = $value;
                }
        }*/
        
        return new ViewModel(array(
            'order_by'          => $order_by,
            'order'             => $order,
            'instanceArray'     => $instanceArray,
            'display'           => $display,
            'mode'              => $mode,
            'doc_class_id'      => $doc_class_id,
            'xlsx_class_id'     => $xlsx_class_id,
            'csv_class_id'      => $csv_class_id,
            'pdf_class_id'      => $pdf_class_id,
            'ppt_class_id'      => $ppt_class_id,
            'gif_class_id'      => $gif_class_id,
            'png_class_id'      => $png_class_id,
            'jpeg_class_id'     => $jpeg_class_id,
            'zip_class_id'      => $zip_class_id,
            'rar_class_id'      => $rar_class_id,
            'dialog_class_id'   => $dialog_class_id, //Added by Divya Rajput On Date 22nd April 2016
            'search_text'       => $search_text
            
        ));     
    }
    /* Function here to move folder list */
    public function moveFolderAction(){

        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        $json                           = array();
        if ($request->isPost()) {
            
            $post           = $request->getPost()->toArray();
        }
        
        $parent_id                  = $post['destination_id'];
        $child_node_id              = $post['source_id'][0];

        $node_instance_id           = $this->getClassesTable()->fetchnodeInstanceId($child_node_id);
        $node_type_id               = 2;

        $config                     = $this->getServiceLocator()->get('config');
        $node_class_property_id     = $config['constants']['FOLDER_PARENT_ID'];
        

        $getParentForChild          = $this->getClassesTable()->fetchXYId($child_node_id);

        if($getParentForChild!=""){

            $this->getClassesTable()->instnacePropertyDeleteMethod('node-instance-property',$getParentForChild,$node_instance_id,$node_class_property_id);    
        }        
        
        $this->getClassesTable()->instnacePropertyDeleteMethod('node-instance-property',$parent_id,$node_instance_id,$node_class_property_id);
        $this->getClassesTable()->createInstancePropertyFolder($parent_id,$node_instance_id,$node_type_id,$node_class_property_id);

        $this->getClassesTable()->commonDeleteMethod('node-x-y-relation','node_x_id',$child_node_id,'equalto');               
        $this->getClassesTable()->saveNodeX($parent_id, $child_node_id);  

        $json['destination_id']  = $post['destination_id'];
        print json_encode($json);
        exit();
    }

    public function moveFolderPosotionAction(){

        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        $json                           = array();
        if ($request->isPost()) {
            
            $post           = $request->getPost()->toArray();
        }
        
        $folderdata         = $post['move_folder'];
        $child_node_id      = $post['source_id'][0];
        $destination_id     = $post['destination_id'];
        $getParentForChild  = $this->getClassesTable()->fetchXYId($child_node_id);
        
        /* delete child class rlation from node-x-y table and remove parent id from node instance property table */
        if($getParentForChild!="")
        {
             $config                        = $this->getServiceLocator()->get('config');
             $folder_class_property_id      = $config['constants']['FOLDER_PARENT_ID'];
             $node_instance_id              = $this->getClassesTable()->fetchnodeInstanceId($child_node_id);    
             // $getParentForChild , $folderParentId, $node_instance_id
            $this->getClassesTable()->instnacePropertyDeleteMethod('node-instance-property',$getParentForChild,$node_instance_id,$folder_class_property_id);    
            $this->getClassesTable()->commonDeletePositionMethod('node-x-y-relation','node_x_id',$child_node_id,'node_y_id',$getParentForChild,'equalto');     
        }

        foreach ($folderdata as $key => $value) {

                $nodeId     = $value['id'];
                $sequence   = $value['seq'];
                $this->getClassesTable()->updateFolderSequence($nodeId,$sequence);            
        }

        $json['destination_id']  = $child_node_id;
        $json['parent_id']       = $getParentForChild;
        
        print json_encode($json);
        exit();
    }
    
    /* Function here for move document from right panel to left panel and save document in selected folder class */

    public function moveDocumentInForlderAction(){

        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        $json                           = array();
        if ($request->isPost()) {
            
            $post           = $request->getPost()->toArray();
        }
        foreach ($post['source_id'] as $key => $val) {
        
            $parent_id                  = $post['destination_id'];
            $child_node_id              = $val;
            $config                     = $this->getServiceLocator()->get('config');
            
            $doc_type_id                = $config['constants']['DOC_TYPE_ID'];
            $xls_type_id                = $config['constants']['XLS_TYPE_ID'];
            $csv_type_id                = $config['constants']['CSV_TYPE_ID'];
            $pdf_type_id                = $config['constants']['PDF_TYPE_ID'];
            $ppt_type_id                = $config['constants']['PPT_TYPE_ID'];
            $jpeg_type_id               = $config['constants']['JPEG_TYPE_ID'];
            $png_type_id                = $config['constants']['PNG_TYPE_ID'];
            $gif_type_id                = $config['constants']['GIF_TYPE_ID'];
            $zip_type_id                = $config['constants']['ZIP_TYPE_ID'];
            $rar_type_id                = $config['constants']['RAR_TYPE_ID'];
            
            $common_type_id             = $doc_type_id.','.$xls_type_id.','.$csv_type_id.','.$pdf_type_id.','.$ppt_type_id.','.$jpeg_type_id.','.$png_type_id.','.$gif_type_id.','.$zip_type_id.','.$rar_type_id;
            $node_instance_id           = $this->getClassesTable()->fetchnodeInstanceId($child_node_id);
            $DocTypeId                  = $this->getClassesTable()->getDocType($node_instance_id,$common_type_id);
            
            $node_type_id               = 2;
           
            if(!empty($DocTypeId['value'])){
                
                if($DocTypeId['value'] == "doc" || $DocTypeId['value']== "docx" ){
                    
                    $node_class_property_id     = $config['constants']['DOC_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "xlsx" || $DocTypeId['value']== "xls" ){
                    
                    $node_class_property_id     = $config['constants']['XLS_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "ppt" ){
                    
                    $node_class_property_id     = $config['constants']['PPT_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "csv" ){
                    
                    $node_class_property_id     = $config['constants']['CSV_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "pdf" ){
                    
                    $node_class_property_id     = $config['constants']['PDF_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "jpeg" || $DocTypeId['value'] == "jpg"){
                    
                    $node_class_property_id     = $config['constants']['JPEG_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "png" ){
                    
                    $node_class_property_id     = $config['constants']['PNG_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "gif" ){
                    
                    $node_class_property_id     = $config['constants']['GIF_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "zip" ){
                    
                    $node_class_property_id     = $config['constants']['ZIP_FOLDER_ID'];
                }
                else if($DocTypeId['value'] == "rar" ){
                    
                    $node_class_property_id     = $config['constants']['RAR_FOLDER_ID'];
                }
            }
            else {
                    $node_class_property_id     = $config['constants']['FOLDER_PARENT_ID'];
            }
            
            
            $this->getClassesTable()->instnacePropertyDeleteDocumentMethod('node-instance-property',$node_instance_id,$node_class_property_id);
            $this->getClassesTable()->createInstancePropertyFolder($parent_id,$node_instance_id,$node_type_id,$node_class_property_id);
            $this->getClassesTable()->commonDeleteMethod('node-x-y-relation','node_x_id',$child_node_id,'equalto');               
            $this->getClassesTable()->saveNodeX($parent_id, $child_node_id);
        }
        
        
        $json['destination_id']  = $post['destination_id'];
        print json_encode($json);
        exit();
    }

    /* end code here */

    public function childListAction() {
        error_reporting(0);
        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        $config             = $this->getServiceLocator()->get('config');
        $folder_class_id    = $config['constants']['FOLDER_CLASS_ID'];
        $folder_title_id    = $config['constants']['FOLDER_TITLE_ID'];
        $folderParentId     = $config['constants']['FOLDER_PARENT_ID'];

        $nodeXId            = $this->getClassesTable()->fetchnodeYId($post['node_id']);

        $nodeInstanceId     = $this->getClassesTable()->fetchnodeInstanceId($nodeXId);

        $instanceArray      = $this->getClassesTable()->fetchNodeInstancePropertyFolder($folder_title_id,$nodeInstanceId,$folderParentId);

        return new ViewModel(array('instanceArray'=>$instanceArray));
    }


    public function childfolderListAction() {
        
        error_reporting(0);
        $layout             = $this->layout();
        $layout->setTemplate('layout/simple');
        $request            = $this->getRequest();
        $post               = array();
        
            if ($request->isPost()) {
                $post = $request->getPost()->toArray();
            }
            $config             = $this->getServiceLocator()->get('config');
            $folder_class_id    = $config['constants']['FOLDER_CLASS_ID'];
            $folder_title_id    = $config['constants']['FOLDER_TITLE_ID'];
            $folderParentId     = $config['constants']['FOLDER_PARENT_ID'];

            $nodeXId            = $this->getClassesTable()->fetchnodeYId($post['node_id']);

            $nodeInstanceId     = $this->getClassesTable()->fetchnodeInstanceId($nodeXId);

            $instanceArray      = $this->getClassesTable()->fetchNodeInstancePropertyFolder($folder_title_id,$nodeInstanceId,$folderParentId);

            $json               =   array();

            $json['child']      = count($instanceArray);
            $json['parentId']   = $post['node_id'];
            print json_encode($json);
            exit(); 
    }

    /*
    function here to delete folder and document instance from folder Class and document class 
    **/
    public function deleteInstanceAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        $json                           =   array();
        if ($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $delete_ids                 =   $post['delete_ids'];
            $node_y_class_id            =   $this->getClassesTable()->deleteFolderDocumentInstance($delete_ids,$post['parentFolderId']);
        }

        $json['parentFolderId']         =   $post['parentFolderId'];
        print json_encode($json);
        exit();
    }

    public function generateRandomStringAction($length = 8)
    {
        $characters         = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength   = strlen($characters);
        $randomString       = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString  .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    function saveDocumentDialogFileDataAction() {

        $request                        =   $this->getRequest();
        $json                           =   array();

        if ($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();

            $config                     =   $this->getServiceLocator()->get('config');
            
            $dialogue_class_id          =   $config['constants']['DIALOGUE_CLASS_ID'];

            $node_class_property_id[]   =   $config['constants']['DIALOGUE_TITLE_ID'];
            $node_instance_id           =   '';


            $instance_property_array[0] =   "";
            $instance_property_array[1] =   "";
            $instance_property_array[2] =   $post['dialogueType'];
            $instance_property_array[3] =   trim($post['title']);
            $instance_property_array[4] =   "";
            $instance_property_array[5] =   date("Y-m-d H:i:s");


            $folder_instance_node_id    =   $post['folder_instance_node_id'];

            $save_type                  =   trim($post['save_type']);

            //$dialoguePropertiesArray    =   $this->getClassesTable()->getProperties($dialogue_class_id);
            $classArray                 =   $this->getClassesTable()->getClassStructurePrint($dialogue_class_id);
            
            $tempArray                  =   array();
            $textArray                  =   array();

            foreach ($classArray[0]['property'] as $key => $value) {
                # code...
                if(!empty($value['child'])){
                    $tempArray[$key]    =   $value['node_class_property_id'];
                    $textArray          =   $this->getChild($value['child'], $tempArray);
                }
            }
            $node_class_property_id     =   array_values($textArray);            

            /*foreach ($dialoguePropertiesArray as $key => $dialogueClassProperty) {
                $node_class_property_id[$key] = $dialogueClassProperty['node_class_property_id'];
            }*/

            $typeArray                  =   $this->getClassesTable()->getClassList($dialogue_class_id);
            $node_type_id               =   $typeArray['node_type_id'];
            
            if($save_type === 'update')
            {               
                $node_instance_id_dialogue  =   intval($post['node_instance_id']);

                $node_id_dialogue           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_dialogue);
                
                $this->getClassesTable()->updateInstancePropertyAgain($node_class_property_id, $node_instance_id_dialogue, $instance_property_array);
            }
            else
            {             
                $instance_caption           =   '';                

                $saveType                   =   'D';

                $node_instance_id_dialogue  =   $this->getClassesTable()->createInstance($instance_caption, $dialogue_class_id, $node_type_id, $saveType);

                $this->getClassesTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id_dialogue, $node_type_id);

                $node_id_dialogue           =   $this->getClassesTable()->getNodeId('node-instance', 'node_instance_id', $node_instance_id_dialogue);

                $dialog_instance_node_id    =   ",".$node_id_dialogue;

                $this->getClassesTable()->saveNodeX($folder_instance_node_id, $dialog_instance_node_id);
            }

            $json['node_instance_id']       =   $node_instance_id_dialogue;
            $json['node_id']                =   $node_id_dialogue;
            $json['title']                  =   trim($post['title']);
            $json['status']                 =   $save_type;

            print json_encode($json);
            exit();
        }
    }

    /*
    * Created By: Divya Rajput
    * Date: 9th June 2016
    * Purpose: This function gives parent and child sequence
    */
    public function getChild($childArray, $tempArray){
        foreach($childArray as $childData){

            $tempArray[]    = $childData['node_class_property_id'];

            if( !empty($childData['child']) ){
                $tempArray  = $this->getChild($childData['child'], $tempArray);
            }
        }
        return $tempArray;
    } 

    public function getRootParentAction(){
        /*Created By: Divya Rajput
        * On Date: 26th May 2016
        * Purpose: to fetch folder */
        $request            =   $this->getRequest();

        if ($request->isPost())
        {
            $post           =   $request->getPost()->toArray();
            $node_x_id      =   $post['node_x_id'];
            $parent_node_id =   $this->getClassesTable()->getMainParentFolderId($node_x_id);
            if($parent_node_id > 0){

            }else{
                $parent_node_id =   $node_x_id;
            }
        }

        echo $parent_node_id;
        exit();
        /*End Here*/        
    }

    public function canvasAction()
    {
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        if ($request->isPost()) {
            $post               = $request->getPost()->toArray();
            $config             = $this->getServiceLocator()->get('config');
            $dialogue_class_id  = $config['constants']['DIALOGUE_CLASS_ID'];
            $title_class_id     = $config['constants']['DIALOGUE_TITLE_ID'];
            $template_class_id  = $config['constants']['DIALOGUE_TEMPLATE_ID'].',';
            

            $TemplateType = $this->getClassesTable()->getDocType($post['node_instance_id'], $template_class_id);

            // INSTANCE STRUCTURE
            //$startTime = microtime(true);
            $instanceArray      = $this->getChildClassInstancePrint(array($post['node_id']), $dialogue_class_id, array());

            $stmtArray          = array();
            foreach($instanceArray as $key => $value) {
                if($key == 'childs') {
                    // get dialogue details
                    $dialogueInstance = current($value);
                } else {
                    // get statement details            
                    $individualInstance = current(array_slice($value,-1,1));
                    
                    //echo $statementInstance .= $statement;
                    foreach(current($value) as $stmt) {
                        if(count($stmt) ==1)
                            array_push($stmtArray, $stmt);
                    }                    
                }
            }

            return new ViewModel(array('documentTitle' => $dialogueInstance[$title_class_id], 'statements' => $stmtArray, 'post' => $post,'templateVal'=>$TemplateType));
        }
       return new ViewModel(array());
    }
}
