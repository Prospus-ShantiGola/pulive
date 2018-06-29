<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class ProcessController extends AbstractActionController
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
		error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $post = $request->getPost()->toArray();
        $post['type'] = 'mainPage';  
        return new ViewModel(array('post' => $post));
	}

	public function commonPhaseU()
    {
        $phaseArray[0]['phase'] = '<div class="segment-node">
                                        <div class="node-circle node-white-circle node-white-circle">N</div>
                                        <div class="col-text segment-text">
                                            <span class="col-node-text"><input type="text" class="custom-node undefined" placeholder="Undefined"></span>
                                            <i class="fa fa-bars phase-segment segment unstructured-phase-menu"></i>
                                            <div class="add-col-wrap add-segment">
                                                <ul aria-labelledby="dropdownMenu4" role="menu" class="dropdown-menu show-">
                                                  <li role="presentation"> <a class="" tabindex="-1" role="menuitem">
                                                    <div class="node-circle node-white-circle-expanded">N</div>
                                                    Unstructure Phase Action </a>
                                                    <ul class="sub-item">
                                                        <li role="presentation" class="disabled unstructure-phase-add-segment">
                                                        <a href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Add Phase Sequence</a></li>
                                                        <li role="presentation" class="unstructure-phase-divide-segment">
                                                        <a href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Divide Segment</a></li>
                                                    </ul>
                                                  </li>
                                                  <li class="" role="presentation">
                                                    <a  tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Move Segment </a>
                                                    <ul class="sub-item">
                                                      <li class="unstructure-phase-up-segment" role="presentation">
                                                        <a  href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Up</a>
                                                      </li>
                                                      <li class="unstructure-phase-down-segment" role="presentation">
                                                        <a  href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Down</a>
                                                      </li>
                                                    </ul>
                                                  </li>
                                                  <li data-toggle="modal" class="unstructure-phase-remove-segment">
                                                      <a class="" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Remove Segment</a>
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

    public function deleteStructuredPhaseAction()
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request        = $this->getRequest();
        $post           = array();
        $tableDataArray = array();

        if ($request->isPost()) {
            $post       = $request->getPost()->toArray();
            $tableArray = $post['data'];

            foreach ($tableArray as $key => $value) {
                $temp                                          = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data']    = $temp[4];
            }
        }

        return new ViewModel(array('tableDataArray' => $tableDataArray));
    }

    public function addStructureSegmentAction()
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request               = $this->getRequest();
        $post                  = array();
        $tableDataArray        = array();
        $currentColumnIndex    = 0;
        $currentColumnSegments = 0;
        $noOfSegment           = 0;

        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            parse_str($post['formData'], $formData);
            $tableArray         = $post['data'];
            $weekRegxPattern    = '/(#\$#Segment#\$#)+/';
            $currentColumnIndex = $post['addCol'];
            $currentRowIndex    = $post['addRow'];       // where to add
            $addCol             = $post['addCol'];       // where to add
            $status             = $post['status'];
            $below              = $post['below'];
            $cols               = $post['cols'];
            $isDayPro           = $post['isDayPro'];
            $isRPhasePro        = $post['isRPhasePro'];
            $rPhaseColNo        = $newRPhaseColNo = $post['rPhaseColNo'];
            $unstrucSegCount    = $post['unstrucSegCount'];
            $strucSegCount      = $post['strucSegCount'];
            $strucSegDayCount   = $post['strucSegDayCount'];
            $extend             = $post['extend'] != '0' ? true : false;
            $commonTime         = $formData['common_time'];
            $otherSegExists     = false;
            if(($unstrucSegCount || $strucSegCount ) && $below == 'above') {
                $otherSegExists = true;
            }
            $day                = in_array('day', $commonTime) ? 1 : 0;
            if($day) {
                if(intval($strucSegDayCount)>=1 || (intval($strucSegDayCount)==0 && intval($strucSegCount)==0)) {
                    // if day already exists
                    $noOfSegment = $formData['wk_segment'] * 7;
                    if(intval($strucSegDayCount)==0) { $status = 'First'; }
                } else {
                    // if prev. week doesn't have days
                    $noOfSegment = $formData['wk_segment'];
                    $day = 0;
                }
            } else {
                if(intval($strucSegDayCount)>=1) {
                    $noOfSegment = $formData['wk_segment'] * 7;
                    $day = 1;
                } else {
                    $noOfSegment = $formData['wk_segment'];
                }
            }
            $lastRow            = $post['rows'] - 1 + ($noOfSegment * 2);
            if(intval($strucSegCount)==0) {
                $newRPhaseColNo = $rPhaseColNo + 1;
                if($day && !$isDayPro) {
                    $newRPhaseColNo += 3;
                }
            }
            //echo '<pre>'; print_r($newRPhaseColNo); print_r($isRPhasePro); die();
            //$tableArray += array_fill(count($tableArray), 9, 'null');
            foreach ($tableArray as $key => $value) {
                $temp                                          = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data']    = $temp[4];
            }
            $lastRowData = end($tableDataArray);
            //echo '<pre>'; print_r($tableDataArray); die();
        }

        // Week added to Process Grid
        $phaseArray = $this->commonStructuredPhaseAction();
        $rPhaseArray = $this->commonPhase();

        return new ViewModel(array('phaseArray'         => $phaseArray,
                                   'rPhaseArray'        => $rPhaseArray,
                                   'tableDataArray'     => $tableDataArray,
                                   'currentColumnIndex' => $currentColumnIndex,
                                   'currentRowIndex'    => $currentRowIndex,
                                   'noOfSegment'        => $noOfSegment,
                                   'status'             => $status,
                                   'weekRegxPattern'    => $weekRegxPattern,
                                   'type'               => strtolower($below),
                                   'cols'               => $cols,
                                   'day'                => $day,
                                   'isDayPro'           => $isDayPro,
                                   'isRPhasePro'        => $isRPhasePro,
                                   'newRPhaseColNo'     => $newRPhaseColNo,
                                   'unstrucSegCount'    => $unstrucSegCount,
                                   'strucSegCount'      => $strucSegCount,
                                   'strucSegDayCount'   => $strucSegDayCount,
                                   'extend'             => $extend,
                                   'otherSegExists'     => $otherSegExists,
                                   'lastRow'            => $lastRow,
                                   'lastRowData'        => $lastRowData));
    }

    public function commonStructuredPhaseAction()
    {
        $phaseArray[0]['phase'] = '<div class="segment-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				 <div class="col-text segment-text">
				    <span class="col-node-text custom-node schedule-segment-week">#$#Segment#$#</span>
				    <i class="fa fa-bars phase-segment segment"></i>
				  <div class="add-col-wrap add-segment">
                    <ul aria-labelledby="dropdownMenu4" role="menu" class="dropdown-menu show-">
                        <li role="presentation" class="schedule-create-new">
                            <a class="" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Create new</a>
                        </li>
                        <li role="presentation" class="schedule-extend">
                            <a class="" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Extend Schedule</a>
                        </li>
                        <li role="presentation"><a tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Move Schedule</a>
                            <ul class="sub-item">
                                <li class="schedule-add-up disabled" role="presentation"><a href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Up</a></li>
                                <li class="schedule-add-down disabled" role="presentation"><a href="#" tabindex="-1" role="menuitem"><div class="node-circle node-white-circle">N</div>Down</a></li>
                            </ul>
                        </li>
                        <li role="presentation" class="schedule-delete"><a tabindex="-1" role="menuitem"><div class="node-circle node-white-circle-expanded">N</div>Delete Schedule</a></li>
                    </ul>
				  </div>
				</div>
			  </div>';
        $phaseArray[0]['day'] = '<div class="segment-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				 <div class="col-text segment-text">
				    <span class="col-node-text custom-node schedule-segment-day">#$#Segment#$#</span>
				</div>
			  </div>';
        $phaseArray[0]['event'] = '<div class="creation-node">
		<div class="node-circle node-white-circle node-white-circle">N</div>
				<div class="col-text"> <span class="creation"></span>
				<span class="col-node-text custom-node">Creation</span>
				 </div>
			  </div>';
        $phaseArray[1]['phase'] = '<div class="segment-node blank-div segment-node structured-last-div"><input type="text" class="custom-node undefined" placeholder="Undefined" ></div>';
        $phaseArray[1]['day'] = '<div class="segment-node blank-div segment-node structured-last-div"><input type="text" class="custom-node undefined" placeholder="Undefined" ></div>';
        $phaseArray[1]['event'] = '<div class="creation-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				<div class="col-text"> <span class="destructure"></span>
				 <span class="col-node-text custom-node">Destruction</span>
				  </div>
			  </div>';
        return $phaseArray;
    }

}
