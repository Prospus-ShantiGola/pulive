<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Administrator\Model\ClassesTable;

class AssociationsController extends AbstractActionController
{ 
	protected $classesTable;
    protected $gridTable;
	protected $view;
    
	
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
		error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            if(empty($post)){
                $post['type'] = 'mainPage';    
            }
            else {
                $post = $post;
            }
        }
        return new ViewModel(array('post' => $post));
	}

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function addPhaseAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentColumnIndex = 0;
        $currentColumnSegments = 0;
        $noOfSegment = 0;       

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentColumnIndex = $post['myCol'];
            $currentColumnSegments = $post['preNoSegment'];
            $noOfSegment = $post['noOfSegment'];
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }
        $phaseArray = $this->commonPhaseAction();
        return new ViewModel(array('phaseArray' => $phaseArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment));
    }

    

    /* function use here for display role series */
    public function addActorAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentColumnIndex = 0;
        $currentColumnSegments = 0;
        $noOfSegment = 0;

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            

            $tableArray = $post['data'];
            $currentColumnIndex = $post['myCol'];
            $currentColumnSegments = $post['preNoSegment'];
            $noOfSegment = intval($post['preNoSegment'])/3;
            $ActorCheck  = $post['ActorCheck'];
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data']    = $temp[4];
            }
        }

        $roleArray = $this->commonActorAction();

        return new ViewModel(array('roleArray' =>$roleArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment,'ActorCheck'=>$ActorCheck));
    }

	/* function use here for display role series */
    public function addRoleAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentColumnIndex = 0;
        $currentColumnSegments = 0;
        $noOfSegment = 0;

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentColumnIndex = $post['myCol'];
            $currentColumnSegments = $post['preNoSegment'];
            $noOfSegment = $post['noOfSegment'];           

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data']    = $temp[4];
            }
        }

        $roleArray = $this->commonActorAction();
        return new ViewModel(array('roleArray' =>$roleArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment));
    }

    /**
     *  Add Segment by this Function
     */
    public function addSegmentAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['currentRow'];
            $currentColumnIndex = $post['currentColumn'];
            $lastRow = $post['noofRows'] - 1;
            $checkrole = $post['checkrole'];
            $type = $post['type'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }
            $phaseArray = $this->commonPhaseAction();
            $lastRow    = $post['noofRows'] - 1;
            $checkrole  = $post['checkrole'];

        if ($checkrole == 0) {
            return new ViewModel(array('phaseArray' => $phaseArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'LastRow' => $lastRow, 'checkrole' => $checkrole, 'type' => $type));
        } 
    	else {
            $noOfProcess                = $post['roleNo'];
            $roleArray                  = $this->commonActorAction();
            $tempPhase[0]               = $phaseArray[0];
            $tempPhase[1]['phase']      = $phaseArray[1]['phase'];
            $tempPhase[1]['event']      = '<div class="blank-div segment-node"></div>';
            $tempPhase[2]               = $phaseArray[1];
            $phaseArray                 = $tempPhase;
            return new ViewModel(array('phaseArray' => $phaseArray, 'roleArray'=>$roleArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'LastRow' => $lastRow, 'checkrole' => $checkrole, 'type' => $type,'noOfProcess'=>$noOfProcess,'segmentActor'=>$segmentActor));
    	}
    }

    /*end code here*/
    public function deletePhaseAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $myCol = 0;
        $myRow = 0;
        $lastRow = 0;
        $lastColumn = 0;

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $myCol = $post['myCol'];
            $myRow = $post['myRow'];
            $lastRow = $post['lastRow'];
            $lastColumn = $post['lastColumn'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }
        return new ViewModel(array('phaseArray' => $phaseArray, 'tableDataArray' => $tableDataArray, 'myCol' => $myCol, 'myRow' => $myRow, 'lastRow' => $lastRow, 'lastColumn' => $lastColumn));
    }

    /* phase common function use here */
    public function commonPhaseAction() 
    {
        $phaseArray[0]['phase'] = '<div class="segment-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				 <div class="col-text segment-text">
    				<span class="col-node-text">
                        <input type="text" class="custom-node undefined" placeholder="Undefined" alt="" value="">
                    </span>
				<i class="fa fa-bars phase-segment segment"></i>
				  <div class="add-col-wrap add-segment">
					<ul aria-labelledby="dropdownMenu4" role="menu" class="dropdown-menu show-">
					  <li role="presentation"> <a class="" tabindex="-1" role="menuitem">
						<div class="node-circle node-white-circle-expanded">N</div>
						Add Segment </a>
						<ul class="sub-item">
						  
						  <li  role="presentation" class="add-association-above-segment"> 
						  <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Above </a> </li>
							
						  <li role="presentation" class="add-association-below-segment"> 
						  <a href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Below </a> </li>
						</ul>
					  </li>
					  <li class="" role="presentation"> <a  tabindex="-1" role="menuitem">
						<div class="node-circle node-white-circle-expanded">N</div>
						Move Segment </a>
						<ul class="sub-item">
						  <li class=" add-asso-up-segment" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Up </a> </li>
						  <li class=" add-asso-down-segment" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Down </a> </li>
						</ul>
					  </li>
					  <li data-toggle="modal" data-target="#deleteSegment" class="association-del-segment">
						  <a class="" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Delete Segment
						  </a>
					  </li>
					</ul>
				  </div>
				</div>
			  </div>';
        $phaseArray[0]['event'] = '<div class="creation-node">
		<div class="node-circle node-white-circle node-white-circle">N</div>
				<div class="col-text"> <span class="creation"></span> 
				<span class="col-node-text custom-node">Creation</span>
				 </div>
			  </div>';
        $phaseArray[1]['phase'] = '<div class="segment-node blank-div segment-node"></div>';
        $phaseArray[1]['event'] = '<div class="creation-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				<div class="col-text"> <span class="destructure"></span>
				 <span class="col-node-text custom-node">Destruction</span>
				  </div>
			  </div>';
        return $phaseArray;
    }

   
    /*code stary here to add actor in association section*/
    public function commonActorAction() 
    {        
        $roleArray[0]['group']          =   '<div class="segment-node">
                                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                                <div class="col-text segment-text operation-text">
                                                    <span class="col-node-text">
                                                        <input type="text" class="custom-node undefined" placeholder="Undefined" alt="" value="">
                                                    </span>
                                                </div>
                                            </div>';

        $roleArray[0]['actor-event']    =   '<div class="creation-node">
                                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                                <div class="col-text">
                                                    <span class="creation"></span> 
                                                    <span class="col-node-text custom-node">Creation</span>
                                                </div>
                                            </div>';



        $roleArray[0]['phase']          =   '<div class="segment-node">
                                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                                <div class="col-text segment-text operation-text">
                                                    <span class="col-node-text">
                                                        <input type="text" class="custom-node undefined" placeholder="Undefined" alt="" value="">
                                                    </span>
                                                </div>
                                            </div>';

        $roleArray[0]['event']          =   '<div class="creation-node">
                                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                                <div class="col-text">
                                                    <span class="creation"></span> 
                                                    <span class="col-node-text custom-node">Creation</span>
                                                </div>
                                            </div>';

        $roleArray[0]['process']        =   '<div class="segment-node blank-div segment-node"></div>';

        
        $roleArray[1]['group']          =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[1]['actor-event']    =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[1]['phase']          =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[1]['event']          =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[1]['process']        =   '<div class="creation-node">
                                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                                <div class="col-text segment-text process-text clearfix">
                                                    <span class="col-node-text custom-node" placeholder="...">...</span>
                                                </div>
                                            </div>';  



        $roleArray[2]['group']          =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[2]['actor-event']    =   '<div class="creation-node">
                                                <div class="node-circle node-white-circle">N</div>
                                                <div class="col-text"> 
                                                    <span class="destructure"></span>
                                                    <span class="col-node-text custom-node">Destruction</span>
                                                  </div>
                                            </div>';
        $roleArray[2]['phase']          =   '<div class="segment-node blank-div segment-node"></div>';
        $roleArray[2]['event']          =   '<div class="creation-node">
                                                <div class="node-circle node-white-circle">N</div>
                                                <div class="col-text"> 
                                                    <span class="destructure"></span>
                                                    <span class="col-node-text custom-node">Destruction</span>
                                                </div>
                                            </div>';
        $roleArray[2]['process']        =   '<div class="segment-node blank-div segment-node"></div>';

        return $roleArray;
    }
    /*end code here*/

   
    /**
     *  Move Segment by this Function
     */
    public function moveSegmentAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;        

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $tableArray = $post['data'];
            $currentRowIndex = $post['currentRow'];
            $currentColumnIndex = $post['currentColumn'];
            $lastRow = $post['noofRows'] - 1;
            $exitsOperation = $post['checkoperation'];
            $type = $post['type'];
            $currentSegmentLength = $post['parentLength'];
            $moveSegmantLength = $post['PreMoveRow'];
            $NoOfProcess = $post['NoOfProcess'];
            $pushactorCol= $post['pushactorCol'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }

            if ($type == "UP") {
                $currentDataArray = array();
                $rowStart = $currentRowIndex;
                $rowEnd = intval($currentRowIndex) + intval($currentSegmentLength) - 1;
                $counterR = 0;

                $preDataArray = array();
                $preRowStart = intval($currentRowIndex) - intval($moveSegmantLength);
                $preRowEnd = intval($preRowStart) + intval($moveSegmantLength) - 1;
                $preCounterR = 0;

                for ($row = 0; $row <= count($tableDataArray); $row++) {
                    $counterC = 0;
                    $preCounterC = 0;
                    for ($col = 0; $col <= count($tableDataArray[$row]); $col++) {
                        if (intval($row) >= intval($rowStart) && intval($row) <= intval($rowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex) ) {
                                $currentDataArray[$counterR][$counterC]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $currentDataArray[$counterR][$counterC]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $currentDataArray[$counterR][$counterC]['data']    = $tableDataArray[$row][$col]['data'];
                                $counterC++;
                            }
                        }

                        if (intval($row) >= intval($preRowStart) && intval($row) <= intval($preRowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex)) {
                                $preDataArray[$preCounterR][$preCounterC]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $preDataArray[$preCounterR][$preCounterC]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $preDataArray[$preCounterR][$preCounterC]['data'] = $tableDataArray[$row][$col]['data'];
                                $preCounterC++;
                            }
                        }
                    }

                    if (intval($row) >= intval($rowStart) && intval($row) <= intval($rowEnd)) {
                        $counterR++;
                    }

                    if (intval($row) >= intval($preRowStart) && intval($row) <= intval($preRowEnd)) {
                        $preCounterR++;
                    }
                }

                $resultArray = array_merge($currentDataArray, $preDataArray);

                $mainCounterR = 0;
                $mainArray = array();

                for ($row = 0; $row <= count($tableDataArray); $row++) {
                    $mainCounterC = 0;

                    for ($col = 0; $col < count($tableDataArray[$row]); $col++) {
                        if (intval($row) >= intval($preRowStart) && intval($row) <= intval($rowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex)) {
                                $mainArray[$row][$col]['trClass'] = $resultArray[$mainCounterR][$mainCounterC]['trClass'];
                                $mainArray[$row][$col]['tdClass'] = $resultArray[$mainCounterR][$mainCounterC]['tdClass'];
                                $mainArray[$row][$col]['data'] = $resultArray[$mainCounterR][$mainCounterC]['data'];
                                $mainCounterC++;
                            } else {
                                $mainArray[$row][$col]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $mainArray[$row][$col]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $mainArray[$row][$col]['data'] = $tableDataArray[$row][$col]['data'];
                            }
                        } else {
                            $mainArray[$row][$col]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                            $mainArray[$row][$col]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                            $mainArray[$row][$col]['data'] = $tableDataArray[$row][$col]['data'];
                        }
                    }
                    if (intval($row) >= intval($preRowStart) && intval($row) <= intval($rowEnd)) {
                        $mainCounterR++;
                    }
                }

                $tableDataArray = $mainArray;

                //file_put_contents($_SERVER['DOCUMENT_ROOT'].'/POMS-IV/trunk/public/currentDataArray.txt', var_export($currentDataArray, true));
                //file_put_contents($_SERVER['DOCUMENT_ROOT'].'/POMS-IV/trunk/public/preDataArray.txt', var_export($preDataArray, true));
                //file_put_contents($_SERVER['DOCUMENT_ROOT'].'/POMS-IV/trunk/public/resultArray.txt', var_export($resultArray, true));
                //file_put_contents($_SERVER['DOCUMENT_ROOT'].'/POMS-IV/trunk/public/mainArray.txt', var_export($mainArray, true));
            } else {

                $currentDataArray = array();
                $rowStart = $currentRowIndex;
                $rowEnd = intval($currentRowIndex) + intval($currentSegmentLength) - 1;
                $counterR = 0;

                $preDataArray = array();
                $preRowStart = intval($rowEnd) + 1;
                $preRowEnd = intval($preRowStart) + intval($moveSegmantLength) - 1;
                $preCounterR = 0;
                for ($row = 0; $row <= count($tableDataArray); $row++) {
                    $counterC = 0;
                    $preCounterC = 0;
                    for ($col = 0; $col <= count($tableDataArray[$row]); $col++) {
                        if (intval($row) >= intval($rowStart) && intval($row) <= intval($rowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex)) {
                                $currentDataArray[$counterR][$counterC]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $currentDataArray[$counterR][$counterC]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $currentDataArray[$counterR][$counterC]['data'] = $tableDataArray[$row][$col]['data'];
                                $counterC++;
                            }
                        }

                        if (intval($row) >= intval($preRowStart) && intval($row) <= intval($preRowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex)) {
                                $preDataArray[$preCounterR][$preCounterC]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $preDataArray[$preCounterR][$preCounterC]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $preDataArray[$preCounterR][$preCounterC]['data'] = $tableDataArray[$row][$col]['data'];
                                $preCounterC++;
                            }
                        }
                    }

                    if (intval($row) >= intval($rowStart) && intval($row) <= intval($rowEnd)) {
                        $counterR++;
                    }

                    if (intval($row) >= intval($preRowStart) && intval($row) <= intval($preRowEnd)) {
                        $preCounterR++;
                    }
                }

                $resultArray = array_merge($preDataArray, $currentDataArray);

                $mainCounterR = 0;
                $mainArray = array();

                for ($row = 0; $row <= count($tableDataArray); $row++) {
                    $mainCounterC = 0;
                    for ($col = 0; $col < count($tableDataArray[$row]); $col++) {
                        if (intval($row) >= intval($rowStart) && intval($row) <= intval($preRowEnd)) {
                            if (intval($col) >= intval($currentColumnIndex)) {
                                $mainArray[$row][$col]['trClass'] = $resultArray[$mainCounterR][$mainCounterC]['trClass'];
                                $mainArray[$row][$col]['tdClass'] = $resultArray[$mainCounterR][$mainCounterC]['tdClass'];
                                $mainArray[$row][$col]['data'] = $resultArray[$mainCounterR][$mainCounterC]['data'];
                                $mainCounterC++;
                            } else {
                                $mainArray[$row][$col]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                                $mainArray[$row][$col]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                                $mainArray[$row][$col]['data'] = $tableDataArray[$row][$col]['data'];
                            }
                        } else {
                            $mainArray[$row][$col]['trClass'] = $tableDataArray[$row][$col]['trClass'];
                            $mainArray[$row][$col]['tdClass'] = $tableDataArray[$row][$col]['tdClass'];
                            $mainArray[$row][$col]['data'] = $tableDataArray[$row][$col]['data'];
                        }
                    }
                    if (intval($row) >= intval($rowStart) && intval($row) <= intval($preRowEnd)) {
                        $mainCounterR++;
                    }
                }
                $tableDataArray = $mainArray;
            }
        }

        $roleArray[0]['group'] = '<div class="segment-node">
                <div class="node-circle node-white-circle node-white-circle">N</div>
                 <div class="col-text segment-text operation-text">
                    <span class="col-node-text">
                        <input type="text" class="custom-node undefined" placeholder="Undefined">
                    </span>                
                </div>
              </div>';
        $blankArray[0]['blank'] = '<div class="segment-node blank-div segment-node"></div>';

        return new ViewModel(array('phaseArray' => $operationPhaseArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex,'roleArray'=>$roleArray,'blankArray'=>$blankArray,'NoOfProcess'=>$NoOfProcess,'pushactorCol'=>$pushactorCol));
    }

    /**
    * Created By Divya Rajput
    * On Date: Dec 30, 2015
    * to save instance for association
    */
    public function saveAssociationInstanceDataAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if ($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            $saveType                   =   $post['saveType'];
            $course_class_id            =   $post['course_class_id'];
            $production_class_id        =   $post['production_class_id'];
            $series_class_id            =   $post['series_class_id'];
            $segment_class_id           =   $post['segment_class_id'];
            $node_instance_id           =   $post['node_instance_id'];  // production node_instance_id

            $instance_property_array    =   json_decode($post['propertyJson'],true);
            
            $courseDataArray            =   $instance_property_array[0];

            /* Start Code By Arvind Soni For Caching */
            $manager                        = $this->getServiceLocator()->get('MemorySharedManager');
            $manager->setStorage('file');
            $manager->clear('instance_structure_display_'.$node_instance_id);
            $manager->clear('instance_sub_class_structure_display_'.$series_class_id);
            $manager->clear('instance_sub_class_structure_display_'.$segment_class_id);
            /* End Code By Arvind Soni For Caching */

            $startTime = microtime(true);
            $result = $this->callCourseData($course_class_id,$production_class_id,$series_class_id,$segment_class_id,$saveType,$courseDataArray,$node_instance_id);
            $loadTime = microtime(true) - $startTime;
            $result['load_time'] = $loadTime;
            echo json_encode($result);
        }
        exit;
    }

    public function callCourseData($node_class_id, $production_class_id, $series_class_id, $segment_class_id, $saveType, $courseData, $node_instance_id)
    {
        //error_reporting(E_ALL);
        $instance_property_array[0] = '';// general
        $instance_property_array[1] = $courseData['course_template'];
        $instance_property_array[2] = $courseData['course_title'];
        $instance_property_array[3] = $courseData['course_description'];
        $instance_property_array[4] = $courseData['course_objectives'];
        $segment_temp_update        = $node_instance_id;
        $productionDataArray        = $courseData['productionData'];
        $typeArray                  = $this->getGridTable()->getClassList($node_class_id);
        $node_type_id               = $typeArray['node_type_id'];

        $coursePropertiesArray = $this->getGridTable()->getProperties($node_class_id);
        foreach ($coursePropertiesArray as $key => $courseClassProperty) {
            $node_class_property_id[$key] = $courseClassProperty['node_class_property_id'];
        }

        if (intval($node_instance_id) > 0) {
            // instance id is of production, direct to it
            /*$node_instance_id = $this->getGridTable()->createInstance($node_class_id, $node_type_id, $saveType, $instance_id);
            $this->getGridTable()->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id, $node_class_property_id);*/
        } else {
            //insert
            $node_instance_id = $this->getGridTable()->createInstance($node_class_id, $node_type_id, $saveType);
            $this->getGridTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id, $node_type_id);
        }

        //get node_id of node instance table for course class
        $node_id = $this->getGridTable()->getinstanceDetails($node_instance_id);
        $productionIds = $this->callProductionData($node_id, $productionDataArray, $production_class_id, $series_class_id, $segment_class_id, $saveType,$node_type_id);
        return $productionIds;
    }

    public function callProductionData($node_id, $productionDataArray, $production_class_id, $series_class_id, $segment_class_id, $saveType,$node_type_id)
    {
        $instance_property_array[0]  = ''; //general
        $instance_property_array[1]  = $productionDataArray['production_title'];
        $instance_property_array[2]  = $productionDataArray['production_type'];
        $instance_property_array[3]  = $productionDataArray['production_descripton'];
        $instance_property_array[4]  = ''; //grid
        $instance_property_array[5]  = $productionDataArray['production_rows'];
        $instance_property_array[6]  = $productionDataArray['production_columns'];
        $instance_property_array[7]  = $productionDataArray['production_cells'];
        $instance_property_array[8]  = ''; //state
        $instance_property_array[9]  = $productionDataArray['production_series'];
        $instance_property_array[10] = $productionDataArray['production_segment'];
        $instance_property_array[11] = $productionDataArray['production_event'];
        $instance_property_array[12] = $productionDataArray['production_period'];

        $seriesDataArray = $productionDataArray['seriesData'];

        $property_node_instance_id = $this->getGridTable()->getNodeXIdFromXYTable($node_id);


        $propertiesPropertiesArray      = $this->getGridTable()->getProperties($production_class_id);
        foreach ($propertiesPropertiesArray as $key => $propertyClassProperty) {
            $node_class_property_id[$key] = $propertyClassProperty['node_class_property_id'];
        }

        if (intval($property_node_instance_id) > 0) { //update
            //$node_instance_id = $this->getGridTable()->createInstance($production_class_id, $node_type_id, $saveType, $property_node_instance_id);
            $product_ins_id             = $this->getGridTable()->getinstanceDetailsByNodeId($node_id);
            $node_instance_id           = $this->getGridTable()->createInstance($production_class_id, $node_type_id, $saveType,$product_ins_id);
            $this->getGridTable()->updateSubInstancePropertyAgain($instance_property_array, $node_type_id, $node_instance_id, $node_class_property_id);
        } else { //insert
            $node_instance_id           = $this->getGridTable()->createInstance($production_class_id, $node_type_id, $saveType);
            $this->getGridTable()->createInstanceProperty($node_class_property_id, $instance_property_array, $node_instance_id, $node_type_id);
        }

        //get node_id of node instance table for property class
        $node_id_prod = $this->getGridTable()->getinstanceDetails($node_instance_id);
        $this->getGridTable()->saveNodeX($node_id, $node_id_prod); // parent, child
        $this->callSeriesData($node_id_prod, $seriesDataArray, $series_class_id, $segment_class_id, $saveType, $node_type_id);

        return array('node_id' => $node_id_prod, 'node_instance_id' => $node_instance_id, 'savetypestatus' => $saveType, 'columns' => $productionDataArray['production_columns'], 'trrows' => $productionDataArray['production_cells'],'prodTitle'=>$productionDataArray['production_title']);
    }

    public function callSeriesData($node_id, $seriesDataArray, $series_class_id, $segment_class_id, $saveType,$node_type_id)
    {   
        $node_id_array                      =   array();
        $node_x_id_array                    =   $this->getGridTable()->getNodeXIdFromXYTable($node_id);

        if(count($node_x_id_array) > 0){
            foreach ($node_x_id_array as $key => $value) {
                $node_id_array[$key]        =   $value;
            }
        }

        $seriesPropertiesArray          =   $this->getGridTable()->getProperties($series_class_id);
        foreach($seriesPropertiesArray as $key => $seriesClassProperty) {
            $node_class_property_id[$key]=   $seriesClassProperty['node_class_property_id'];
        }

        foreach($seriesDataArray as $key => $seriesData)
        {
            $instance_property_array[0]     =   ''; //general
            $instance_property_array[1]     =   $seriesData['title'];
            $instance_property_array[2]     =   $seriesData['type'];
            $instance_property_array[3]     =   $seriesData['column_sequence'];
            $instance_property_array[4]     =   ''; //state
            $instance_property_array[5]     =   $seriesData['series_active'];
            $instance_property_array[6]     =   $seriesData['series_complete'];
            $segmentDataArray               =   $seriesData['segmentData'];

            if($node_id_array[$key] > 0 ){
                $series_node_instance_id    =   $this->getGridTable()->getinstanceDetailsByNodeId($node_id_array[$key]);
            }else{
                $series_node_instance_id    =   0;
            }

            if(intval($series_node_instance_id) > 0) {
                //$node_instance_id           =   $series_node_instance_id;
                $node_instance_id           =   $this->getGridTable()->createInstance($series_class_id,$node_type_id,$saveType,$series_node_instance_id);
                $this->getGridTable()->updateSubInstancePropertyAgain($instance_property_array,$node_type_id,$node_instance_id,$node_class_property_id);
                $series_node_id             =   $this->getGridTable()->getInstanceDetails($node_instance_id);
            } else {
                $node_instance_id           =   $this->getGridTable()->createInstance($series_class_id,$node_type_id,$saveType);
                $this->getGridTable()->createInstanceProperty($node_class_property_id,$instance_property_array,$node_instance_id,$node_type_id);

                //get node_id of node instance table for series class
                $series_node_id             =   $this->getGridTable()->getInstanceDetails($node_instance_id);
                $series_node_ids            =   ",".$series_node_id;
                $this->getGridTable()->saveNodeX($node_id, $series_node_ids);
            }

            $this->callSegmentData($series_node_id, $segmentDataArray, $segment_class_id, $saveType,$node_type_id);
        }
    }

    public function callSegmentData($series_node_id, $segmentDataArray, $segment_class_id, $saveType,$node_type_id)
    {        
        $node_id_array                      =   array();
        $instance_property_id               =   array();

        $node_x_id_array                    =   $this->getGridTable()->getNodeXIdFromXYTable($series_node_id);

        if(count($node_x_id_array) > 0){
            foreach ($node_x_id_array as $key => $value) {
                $node_id_array[$key]        =   $value;
            }
        }

        $segmentPropertiesArray         =   $this->getGridTable()->getProperties($segment_class_id);
        foreach($segmentPropertiesArray as $key => $segmentClassProperty) {
            $node_class_property_id[$key]   =   $segmentClassProperty['node_class_property_id'];
        }

        foreach($segmentDataArray as $key => $segmentData)
        {
            $instance_property_array[0]     =   ''; //general
            if($segmentData['segment_temp_update']=="..."){
                $segmentData['seg_title'] = $segmentData['segment_temp_update'];
            }else {
                $segmentData['seg_title'] = $segmentData['seg_title'];
            }
            $instance_property_array[1]     =   ($segmentData['seg_title']) ? $segmentData['seg_title'] : '';
            $instance_property_array[2]     =   $segmentData['seg_type'];
            $instance_property_array[3]     =   ''; //period
            $instance_property_array[4]     =   $segmentData['seg_start'];
            $instance_property_array[5]     =   $segmentData['seg_end'];
            $instance_property_array[6]     =   ''; //state
            $instance_property_array[7]     =   $segmentData['seg_active'];
            $instance_property_array[8]     =   $segmentData['seg_complete'];
            $segment_temp_update            =   $segmentData['segment_temp_update'];

            if($node_id_array[$key] > 0){
                $segment_node_instance_id   =   $this->getGridTable()->getinstanceDetailsByNodeId($node_id_array[$key]);
            }else{
                $segment_node_instance_id   =   0;
            }

            if(trim($segment_node_instance_id) > 0){
                //$node_instance_id           =   $segment_node_instance_id;
                $node_instance_id           =   $this->getGridTable()->createInstance($segment_class_id,$node_type_id,$saveType,$segment_node_instance_id);
                $this->getGridTable()->updateSubInstancePropertyAgain($instance_property_array,$node_type_id,$node_instance_id,$node_class_property_id);
            } else {
                $node_instance_id           =   $this->getGridTable()->createInstance($segment_class_id,$node_type_id,$saveType);
                $this->getGridTable()->createInstancePropertyAgain($instance_property_array,$node_instance_id,$node_type_id,$node_class_property_id);
                //get node_id of node instance table for segment class
                $segment_node_id                =   $this->getGridTable()->getInstanceDetails($node_instance_id);
                $segment_node_ids               =   ",".$segment_node_id;
                $this->getGridTable()->saveNodeX($series_node_id, $segment_node_ids);
            }
        }
    }

    public function composeClassStructureAction()
    {
        $layout                                 =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                =   $this->getRequest();

        $temp_array                             =   array();

        if ($request->isPost())
        {
            $post                               =   $request->getPost()->toArray();
            $node_class_id                      =   $post['node_class_id'];
            $node_instance_id                   =   $post['node_instance_id'];
            
            $node_id                            =   $this->getGridTable()->getinstanceDetails($node_instance_id);
            
            $sub_class_node_id_array            =   array($node_id);

            $data_array                         =   $this->getAssociationChildClassInstance($sub_class_node_id_array, $node_class_id, $temp_array);
        }
        
        /*echo '<pre>';
        print_r($node_instance_id);
        print_r($data_array);
        die('hhh');*/


        return new ViewModel(array('node_instance_id'=>$node_instance_id, 'main_array' => $data_array));
    }

    public function getAssociationChildClassInstance($sub_class_node_id_array, $node_class_id, $temp_array)
    {
        if(count($sub_class_node_id_array) > 0){

            $i=0;
            foreach($sub_class_node_id_array as $key => $node_sub_class_id){

                $node_instance_id               =   $this->getGridTable()->getinstanceDetailsByNodeId($node_sub_class_id);
                    
                if($node_instance_id){
                    
                    $sub_class_node_id_new      =   $this->getGridTable()->getNodeXIdFromXYTable($node_sub_class_id);

                    $temp_array[$i]['parent']      =   $this->getGridTable()->fetchNodeInstanceProperty($node_instance_id);
                    
                    if(count($sub_class_node_id_new) > 0){
                        //++$i;
                        $temp_array[$i]['childs']      = $this->getAssociationChildClassInstance($sub_class_node_id_new, $node_class_id, array());
                    }
                }
                $i++;                
            } 
        } 

        return $temp_array;          
    }
} 
