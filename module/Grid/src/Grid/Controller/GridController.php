<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class GridController extends AbstractActionController 
{
    protected $gridTable;
    protected $view;

    public function __construct()
    {
        $this->container = new container('auth');
        $this->subOperation = new container('subOperation');
        $this->Eventstatus = new container('Eventstatus');
        $this->EventPost = new container('EventPost');
    }

    /**
     *  get gridTable..
     *  @param:
     *  @return:object of gridTable
    */
    public function getGridTable() {
        if (!$this->gridTable) {
            $sm = $this->getServiceLocator();
            $this->gridTable = $sm->get('Grid\Model\GridTable');
        }
        return $this->gridTable;
    }

    /**
     *  Display the grid structure for first time or display the add phase popup content.
     */
    public function indexAction() {
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
     *  set the auto number of every cells.
     *  Auto Number Algorithm Function
     */
    public function algorithmAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }

        $rulesArray = array(
            'Right',
            'Right Down',
            'Down',
            'Down Left',
            'Left',
        );
        $numberArray = array();
        $parentArray = array();
        $algoArray = array();
        $tempArray = $post['data'];
        $lastColIndex = $post['lastColIndex'];
        $startColIndex = '';
        $constructorParent = '';
        $status = '';
        $preRow = 1;
        $auto = 1;



        // UNCOMMENT 21-01-2016
        foreach ($tempArray as $key => $value) {
            $temp = explode('@', $value);
            $algoArray[$temp[0]][$temp[1]] = $temp[2];
        }

        /*  $numberArray = $this->getNumberByAlgo(2, 1, $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow);
            $json['data'] = $numberArray;
            echo '<pre>';
            print_r($numberArray);
            exit; */

        $json['data'] = $this->numberAlgorithm($algoArray);

        echo json_encode($json);
        exit;
    }

    /**
     * Created by Amit Malakar
     * Date 22 Jan, 2016
     * Algo to generate number for Grid structure
     * @param $data
     * @return array
     */
    public function numberAlgorithm($data)
    {
        $numberArray = array();
        $moveRight   = true;
        $counter     = 1;
        foreach ($data as $key => $value) {
            $isLastEvent = '';
            if ($moveRight) { // to right
                foreach ($value as $k1 => $v1) {
                    $cellArr = explode("_", $v1);
                    if ($key == $cellArr[1] && $k1 == $cellArr[2]) {
                        if($cellArr[3] !== undefined && $cellArr[3] == 'd') {
                            $numberArray[$key][$k1] = $counter;
                        } else {
                            $numberArray[$key][$k1] = $counter;
                            $counter++;
                        }
                    }
                    $isLastEvent = ($cellArr[3] !== undefined) ? $cellArr[3] : '';   // if its event
                }
                if ($isLastEvent == 'e') {
                    $moveRight = false;
                }
            } else { // to left
                $row = array_reverse($value, true);
                foreach ($row as $k1 => $v1) {
                    $cellArr = explode("_", $v1);
                    if ($key == $cellArr[1] && $k1 == $cellArr[2]) {
                        if($cellArr[3] !== undefined && $cellArr[3] == 'd') {
                            $numberArray[$key][$k1] = $counter;
                        } else {
                            $numberArray[$key][$k1] = $counter;
                            $counter++;
                        }
                    }
                    $isLastEvent = ($cellArr[3] !== undefined) ? $cellArr[3] : '';   // if its event
                }
                if ($isLastEvent == 'e') {
                    $moveRight = true;
                }
            }
        }

        return $numberArray;
    }

    public function checkCellNumber($tempRow, $tempCol, $move, $algoArray, $numberArray) {
        if ($move == 'Right') {
            $class = $algoArray[$tempRow][$tempCol];
            $rowAndCol = explode('_', $class);

            if (trim($numberArray[$rowAndCol[1]][$rowAndCol[2]]) != "") {
                return 'N';
            } else {
                return 'Y';
            }
        }

        if ($move == 'Left') {
            $class = $algoArray[$tempRow][$tempCol];
            $rowAndCol = explode('_', $class);

            if (trim($numberArray[$rowAndCol[1]][$rowAndCol[2]]) != "") {
                return 'N';
            } else {
                return 'Y';
            }
        }
    }

    public function getNewCell($row, $col, $algoArray, $rulesArray, $numberArray) {
        for ($index = 0; $index < count($rulesArray); $index++) {
            $tempRow = 0;
            $tempCol = 0;
            if ($rulesArray[$index] == 'Right') {
                $tempRow = intval($row);
                $tempCol = intval($col) + 1;
            }

            if ($rulesArray[$index] == 'Right Down') {
                $tempRow = intval($row) + 1;
                $tempCol = intval($col) + 1;
            }

            if ($rulesArray[$index] == 'Down') {
                $tempRow = intval($row) + 1;
                $tempCol = intval($col);
            }

            if ($rulesArray[$index] == 'Down Left') {
                $tempRow = intval($row) + 1;
                $tempCol = intval($col) - 1;
            }

            if ($rulesArray[$index] == 'Left') {
                $tempRow = intval($row);
                $tempCol = intval($col) - 1;
            }

            if (trim($algoArray[$tempRow][$tempCol]) != '') {
                if ($rulesArray[$index] == 'Right') {
                    
                    $flag = $this->checkCellNumber($tempRow, $tempCol, $rulesArray[$index], $algoArray, $numberArray);
                    
                    if ($flag == 'Y') {
                        return $tempRow . ":" . $tempCol;
                    }
                } 

                else if ($rulesArray[$index] == 'Right Down') {
                     

                } else if ($rulesArray[$index] == 'Down') {


                    
                    $preRow = $row;
                    $preCol = intval($col) - 1;

                    $lastRow = $tempRow;
                    $lastCol = intval($tempCol) - 1;
                    if ($algoArray[$preRow][$preCol] == $algoArray[$lastRow][$lastCol]) {

                        $class = $algoArray[$tempRow][$tempCol];
                        $rowAndCol = explode('_', $class);



                        if (trim($numberArray[$rowAndCol[1]][$rowAndCol[2]]) != "" && trim($numberArray[$tempRow][intval($tempCol)+1]) == "") 
                         {
                            $colN = intval($tempCol)+1;
                            return $tempRow . ":" .$colN;
                         }  

                        return $tempRow . ":" . $tempCol;
                    }
                } else if ($rulesArray[$index] == 'Down Left') {
                    $preRow = $row;
                    $preCol = intval($col) - 2;
                    $lastRow = $tempRow;
                    $lastCol = intval($tempCol) - 1;
                    if ($algoArray[$preRow][$preCol] == $algoArray[$lastRow][$lastCol]) {
                        return $tempRow . ":" . $tempCol;
                    }
                } else if ($rulesArray[$index] == 'Left') {
                    $flag = $this->checkCellNumber($tempRow, $tempCol, $rulesArray[$index], $algoArray, $numberArray);

                    if ($flag == 'N') {
                        $tempCol = intval($tempCol) - 1;
                        return $tempRow . ":" . $tempCol;
                    } else {
                        return $tempRow . ":" . $tempCol;
                    }
                }
            }
        }
        return 'Fail';
    }

    public function getNewCellOperation($row, $col, $algoArray, $numberArray, $rulesArray, $auto, $lastColIndex) {
        $tempRow = intval($row);
        $tempCol = intval($col) + 1;

        if (intval($tempCol) <= intval($lastColIndex)) {
            $checkSeries = explode(' ', $algoArray[$tempRow][$tempCol]);
            $temp = explode("_", $checkSeries[1]);



            if ($temp[0] == 'parent') {

                return $tempRow . ":" . $tempCol;
            } else {
                return 'Fail';
            }
        }
        return 'colEnd';
    }

    public function getRowNumberOfAlgo($curruntRow, $previousRow, $startColIndex, $lastColIndex, $numberArray) {
        $first = $numberArray[$curruntRow][intval($startColIndex) + 1];
        $last = $numberArray[$curruntRow][intval($startColIndex) + 3];
        $numberArray[$curruntRow][intval($startColIndex) + 3] = $first;
        $numberArray[$curruntRow][intval($startColIndex) + 1] = $last;
        return $numberArray;
    }

    public function getNumberByAlgo($row, $col, $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow) {
        /* echo '<br>constructorParent'.$constructorParent;
          echo 'abc=>'.$algoArray[intval($preRow)][intval($startColIndex)]; */
        if ($constructorParent != $algoArray[intval($preRow)][intval($startColIndex) - 1] && $constructorParent != "" && $status == 'colEnd') {

            $status = '';
            $col = intval($startColIndex) - 1;
            $numberArray = $this->getRowNumberOfAlgo(intval($preRow), intval($preRow) - 1, intval($startColIndex), intval($lastColIndex), $numberArray);
            $numberArray = $this->getNumberByAlgo($preRow, $col, $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status);
        }

        if ($algoArray[intval($row)][intval($startColIndex)] != $algoArray[intval($row)-1][intval($startColIndex)] && $constructorParent != "" && $status == 'colEnd' && intval($startColIndex) == $col) {
            
           $numberArray = $this->getRowNumberOfAlgo(intval($preRow), intval($preRow) - 1, intval($startColIndex), intval($lastColIndex), $numberArray);
           $numberArray = $this->getRowNumberOfAlgo(intval($preRow)-1, intval($preRow) - 1, intval($startColIndex), intval($lastColIndex), $numberArray);
           
        }

        if (trim($algoArray[$row][$col]) != '') {
            $checkOperationSeries = explode(' ', $algoArray[$row][$col]);
            if ($numberArray[$row][$col] == '' && $checkOperationSeries[0] != 'operation-series') {
                $numberArray[$row][$col] = $auto;
                $auto++;
                $constructorParent = "";

                $rowAndCol = $this->getNewCell($row, $col, $algoArray, $rulesArray, $numberArray);

                if ($rowAndCol != 'Fail') {
                    $status = $rowAndCol;
                    $rcArray = explode(":", $rowAndCol);

                    $preRow = intval($rcArray[0]) - 1;

                    $numberArray = $this->getNumberByAlgo($rcArray[0], $rcArray[1], $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow);
                }
            } else if ($numberArray[$row][$col] == '' && $checkOperationSeries[0] == 'operation-series') {
                if ($startColIndex == '') {
                    $startColIndex = $col;
                }
                if ($constructorParent == '') {
                    $constructorParent = $algoArray[$row][intval($col) - 1];
                }

                $checkSeries = explode(' ', $algoArray[$row][$col]);
                $temp = explode("_", $checkSeries[1]);
                if ($temp[0] == 'parent') {
                    $class = $checkSeries[1];
                    $class1 = explode('_', $class);

                    if (trim($numberArray[$class1[1]][$class1[2]]) == "") {
                        $numberArray[$row][$col] = $auto;
                        $auto++;
                    }
                }

                $rowAndCol = $this->getNewCellOperation($row, $col, $algoArray, $numberArray, $rulesArray, $auto, $lastColIndex);
                if ($rowAndCol != 'Fail' && $rowAndCol != 'colEnd') {
                    $status = $rowAndCol;
                    $rcArray = explode(":", $rowAndCol);
                    $preRow = intval($rcArray[0]) - 1;
                    $numberArray = $this->getNumberByAlgo($rcArray[0], $rcArray[1], $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow);
                } else {
                    if ($rowAndCol == 'colEnd') {

                        $status = $rowAndCol;
                        $preRow = $row;
                        $numberArray = $this->getNumberByAlgo(intval($row) + 1, $startColIndex, $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow);
                    } else {
                        //echo $row.':'.$lastColIndex;

                        $status = $rowAndCol;
                        $preRow = intval($row) - 1;
                        $numberArray = $this->getNumberByAlgo($row, intval($col) + 1, $algoArray, $rulesArray, $numberArray, $auto, $lastColIndex, $startColIndex, $constructorParent, $status, $preRow);
                    }
                }
            }
        }
        return $numberArray;
    }

    /**
     *  Add Segment by this Function
     */
    public function addSegmentAction() {
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
            $nonSequence = $post['nonSequence'];
            $chkoperArray = $post['chkoperArray'];
            $currentLength = $post['currentLength'];
            $suboperationCount = $post['suboperationCount'];
            $indexRow = $post['indexRow'];
            $indexCol = $post['indexCol'];
            $eventCount             = $post['eventCount'];
            $eventStatusArr         = $this->blankeventStatusCommonAction();

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $phaseArray = $this->commonPhaseAction();

        /* Start Code By Arvind Soni */
        if(intval($currentColumnIndex) == 5)
        {
            $phaseArray[0]['phase'] = '<div class="segment-node">
                <div class="node-circle node-white-circle node-white-circle">N</div>
                 <div class="col-text segment-text">
                    <span class="col-node-text">
                        <input type="text" class="custom-node undefined" placeholder="Undefined">
                    </span>
                <i class="fa fa-bars phase-segment segment"></i>
                  <div class="add-col-wrap add-segment">
                    <ul aria-labelledby="dropdownMenu4" role="menu" class="dropdown-menu show-">
                      <li role="presentation"> <a class="" tabindex="-1" role="menuitem">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Add Segment </a>
                        <ul class="sub-item">
                          <li  role="presentation" class="unstructured-add-above-segment"> 
                          <a  href="#" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Above </a> </li>
                            
                          <li role="presentation" class="unstructured-add-below-segment"> 
                          <a href="#" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Below </a> </li>
                        </ul>
                      </li>
                      <li class="" role="presentation"> <a  tabindex="-1" role="menuitem">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Move Segment </a>
                        <ul class="sub-item">
                          <li class="unstructured-add-up-segment disabled" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Up </a> </li>
                          <li class="unstructured-add-down-segment disabled" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Down </a> </li>
                        </ul>
                      </li>
                      <li data-toggle="modal" data-target="#deleteSegment" class="unstructured-del-segment">
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
            $phaseArray[1]['phase'] = '<div class="segment-node blank-div segment-node unstructure-last-div"></div>';
            $phaseArray[1]['event'] = '<div class="creation-node">
                    <div class="node-circle node-white-circle node-white-circle">N</div>
                    <div class="col-text"> <span class="destructure"></span>
                     <span class="col-node-text custom-node">Destruction</span>
                      </div>
                  </div>';
        }
        /* End Code By Arvind Soni */
       

        $lastRow = $post['noofRows'] - 1;
        $exitsOperation = $post['checkoperation'];
        $subOperationArray = $this->blanksubOperationCommonAction();

        if ($exitsOperation == 0) {
            return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'phaseArray' => $phaseArray,'subOperationArray'=>$subOperationArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'LastRow' => $lastRow, 'exitsOperation' => $exitsOperation, 'type' => $type,'currentLength'=>$currentLength,'suboperationCount'=>$suboperationCount,'indexRow'=>$indexRow,'indexCol'=>$indexCol));
        } 

        else {

            $domaincount = $post['domaincount'];
            $domainArray = $this->blankdomainCommonAction();
            $tempOpearationArray = array();
            $temproleArray = array();
            $noOfRole = $post['roleNo'];
            $roleArray = $this->commonRoleAction();
            $operationPhaseArray = $this->commonOperationAction();

            $tempOpearationArray[1] = $operationPhaseArray[0]; 
            $tempOpearationArray[2] = $operationPhaseArray[1];
            $tempOpearationArray[3] = $operationPhaseArray[2];
            $tempOpearationArray[4] = $operationPhaseArray[3];
            $tempOpearationArray[5] = $operationPhaseArray[4];
            $tempOpearationArray[6] = $operationPhaseArray[5];
          
            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
   

            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
   
            return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'phaseArray' => $phaseArray,'subOperationArray'=>$subOperationArray,'temproleArray'=>$temproleArray,'tempOpearationArray'=>$tempOpearationArray, 'operationPhaseArray' => $operationPhaseArray, 'roleArray'=>$roleArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'LastRow' => $lastRow, 'exitsOperation' => $exitsOperation, 'type' => $type,'noOfRole'=>$noOfRole,'nonSequence'=>$nonSequence,'chkoperArray'=>$chkoperArray,'currentLength'=>$currentLength,'domaincount'=>$domaincount,'domainArray'=>$domainArray,'suboperationCount'=>$suboperationCount,'indexRow'=>$indexRow,'indexCol'=>$indexCol));
        }
    }

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function createPhaseAction() 
    {
        error_reporting(0);
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');

        $request                        =   $this->getRequest();
        $post                           =   array();
        $tableDataArray                 =   array();
        $currentColumnIndex             =   0;
        $currentColumnSegments          =   0;
        $noOfSegment                    =   0;

        if ($request->isPost()) {
            $post                       = $request->getPost()->toArray();
            $tableArray                 = $post['data'];
            $currentColumnIndex         = $post['myCol'];
            $currentColumnSegments      = $post['preNoSegment'];
            $noOfSegment                = $post['noOfSegment'];


            foreach ($tableArray as $key => $value) {
                $temp                   = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data']         = $temp[4];
            }
        }

        $lastRow                        = $post['noofRows'] - 1;
        $exitsOperation                 = $post['checkoperation'];
        $phaseArray                     = $this->commonPhaseAction();

        //echo "currentColumnSegments = ".$currentColumnSegments.", currentColumnIndex = ".$currentColumnIndex.", noOfSegment = ".$noOfSegment;

        return new ViewModel(array('phaseArray' => $phaseArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment));
    }

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function subLogicOperationSegmentAction() {
       
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array(); 
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray         = $post['data'];
            
            $opIndexNo = intval($this->subOperation->subOperation['opIndexNo']);
            
                        if($opIndexNo!='' || $opIndexNo!=0 ){
                            if(intval($opIndexNo) == 2 ){
                                        $currentRowIndex = intval($opIndexNo)*intval(4);                            
                                    }
                                    else if($opIndexNo > 2){
                                     $currentRowIndex = intval(2)+intval($opIndexNo)*intval(4);   

                                    }else {
                                        
                                        $currentRowIndex    = 2;
                            }
                        }
                        else {
                            
                            $currentRowIndex    = $this->subOperation->subOperation['currentRowIndex'];
                        }


            $currentColumnIndex = $this->subOperation->subOperation['currentColumnIndex'];
            $suboperationCount  = $this->subOperation->subOperation['suboperationCount'];

            $subOpType2         = $post['Op2'];
            $domaincount        = $post['domaincount'];
            $noOfRole           = $post['rolecount'];
            

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
                 $subOperationPhaseArray = $this->commonLogicSubOperationAction();
                 $subBlankArray          = $this->blankLogicsubOperationCommonAction();
                 $type = 'Below';           
            }
            

            $logicOperationPhaseArray   = $this->commonLogicOperationAction();
            $commondomainArray          = $this->domainlogicCommonDomainAction();
            $roleArray                  = $this->commonRoleAction();
            $domainArray                = $this->domainCommonAction();

            if($subOpType2 == 'non_seq_logic_2'){ 

            $tempOpearationArray= array();
            $tempSubOpearationArray= array();
            $blamktempSubOpearationArray = array();

            $tempOpearationArray[1] = $logicOperationPhaseArray[0]; 
            $tempOpearationArray[2] = $logicOperationPhaseArray[1];
            $tempOpearationArray[3] = $logicOperationPhaseArray[2];
            

            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
            
            $logicOperationPhaseArray = $tempOpearationArray;


            $tempSubOpearationArray[1] = $subOperationPhaseArray[0]; 
            $tempSubOpearationArray[2] = $subOperationPhaseArray[1];
            $tempSubOpearationArray[3] = $subOperationPhaseArray[2];
            $tempSubOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $tempSubOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            $subOperationPhaseArray = $tempSubOpearationArray;    


            $blamktempSubOpearationArray[1] = $subBlankArray[0]; 
            $blamktempSubOpearationArray[2] = $subBlankArray[1];
            $blamktempSubOpearationArray[3] = $subBlankArray[2];
            
          
            $blamktempSubOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $blamktempSubOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            $subBlankArray = $blamktempSubOpearationArray;


            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
            
            $roleArray = $temproleArray;


            $tempdomainArray[1] = $domainArray[0];
            $tempdomainArray[2] = $domainArray[1];
            $tempdomainArray[3] = $domainArray[2];
            $tempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            
            $domainArray = $tempdomainArray;

            $commontempdomainArray[1] = $commondomainArray[0];
            $commontempdomainArray[2] = $commondomainArray[1];
            $commontempdomainArray[3] = $commondomainArray[2];
            $commontempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            
            $commondomainArray = $commontempdomainArray;
            
            }
            
        
        return new ViewModel(array('logicOperationPhaseArray' => $logicOperationPhaseArray,'subBlankArray'=>$subBlankArray,'subOperationPhaseArray' => $subOperationPhaseArray,'roleArray'=>$roleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'noOfRole'=>$noOfRole,'domainArray'=>$domainArray,'domaincount'=>$domaincount,'commondomainArray'=>$commondomainArray,'subOpType2'=>$subOpType2,'suboperationCount'=>$suboperationCount));
    }

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function subOperationSegmentAction() {
       
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array(); 
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray 		= $post['data'];
            
            $opIndexNo = intval($this->subOperation->subOperation['opIndexNo']);
        
                    if($opIndexNo!='' || $opIndexNo!=0 ){
                        if(intval($opIndexNo) == 2 ){
                                    $currentRowIndex = intval($opIndexNo)*intval(4);                            
                                }
                                else if($opIndexNo > 2){
                                 $currentRowIndex = intval(2)+intval($opIndexNo)*intval(4);   

                                }else {
                                    
                                    $currentRowIndex    = 2;
                        }
                    }
                    else {
                        
                        $currentRowIndex    = $this->subOperation->subOperation['currentRowIndex'];
                    }


            $currentColumnIndex = $this->subOperation->subOperation['currentColumnIndex'];
            $subOpType2  		= $post['Op2'];
			$domaincount 		= $post['domaincount'];
			$noOfRole    		= $post['rolecount'];
            $suboperationCount  = $this->subOperation->subOperation['suboperationCount'];

			foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
                 $subOperationPhaseArray = $this->commonSubOperationAction();
                 $subBlankArray  = $this->blanksubOperationCommonAction();
				 $type= 'Below';	       
            }
        	
            $operationPhaseArray = $this->commonOperationAction();
			$roleArray           = $this->commonRoleAction();
			$currentLength       = 6;
			$domainArray 		 = $this->blankdomainCommonAction();
			if($subOpType2 == 'non_seq_human_2'){
			$temproleArray       = array();
			$tempdomainArray     = array();
			$tempOpearationArray = array();
			$tempSubOpearationArray = array();
            $blamktempSubOpearationArray = array();
				
			$tempOpearationArray[1] = $operationPhaseArray[0]; 
            $tempOpearationArray[2] = $operationPhaseArray[1];
            $tempOpearationArray[3] = $operationPhaseArray[2];
            $tempOpearationArray[4] = $operationPhaseArray[3];
            $tempOpearationArray[5] = $operationPhaseArray[4];
            $tempOpearationArray[6] = $operationPhaseArray[5];
          
            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
			$operationPhaseArray = $tempOpearationArray;
			/*sub operation*/
			$tempSubOpearationArray[1] = $subOperationPhaseArray[0]; 
            $tempSubOpearationArray[2] = $subOperationPhaseArray[1];
            $tempSubOpearationArray[3] = $subOperationPhaseArray[2];
            $tempSubOpearationArray[4] = $subOperationPhaseArray[3];
            $tempSubOpearationArray[5] = $subOperationPhaseArray[4];
            $tempSubOpearationArray[6] = $subOperationPhaseArray[5];
          
            $tempSubOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $tempSubOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            $subOperationPhaseArray = $tempSubOpearationArray;



            $blamktempSubOpearationArray[1] = $subBlankArray[0]; 
            $blamktempSubOpearationArray[2] = $subBlankArray[1];
            $blamktempSubOpearationArray[3] = $subBlankArray[2];
            $blamktempSubOpearationArray[4] = $subBlankArray[3];
            $blamktempSubOpearationArray[5] = $subBlankArray[4];
            $blamktempSubOpearationArray[6] = $subBlankArray[5];
          
            $blamktempSubOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $blamktempSubOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            $subBlankArray = $blamktempSubOpearationArray;
            
            
			/*end sub operation*/
			
            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
            $roleArray = $temproleArray;

            $tempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[1]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[3]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[4]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[5]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[6]['domain'] = '<div class="blank-div segment-node"></div>';
            $domainArray = $tempdomainArray;
			
			}
			
        return new ViewModel(array('phaseArray' => $operationPhaseArray,'subBlankArray'=>$subBlankArray,'FirstsubOperationPhaseArray'=>$FirstsubOperationPhaseArray,'subOperationArray' => $subOperationPhaseArray,'roleArray'=>$roleArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'checksubOperation'=>$checksubOperation,'subOpType1'=>$subOpType1,'subOpType2'=>$subOpType2,'noOfRole'=>$noOfRole,'domaincount'=>$domaincount,'domainArray'=>$domainArray,'suboperationCount'=>$suboperationCount));
		
    }

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function addSubOperationAction() {
        //$this->subOperation->getManager()->getStorage()->clear('subOperation');
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        $post = $request->getPost()->toArray();
        if ($request->isPost()) {
            
           

            $tableArray 		= $post['data'];
            
            $currentRowIndex 	= $post['myRow'];


            $currentColumnIndex = $post['myCol'];
            $logicsN 			= $post['logicsN'];
            $suboperationCount  = $post['suboperationCount'];

                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        
                        $opIndexNo = intval($this->subOperation->subOperation['opIndexNo']);
            
                        if($opIndexNo!='' || $opIndexNo!=0 ){
                            if(intval($opIndexNo) == 2 ){
                                        $currentRowIndex = intval($opIndexNo)*intval(4);                            
                                    }
                                    else if($opIndexNo > 2){
                                     $currentRowIndex = intval(2)+intval($opIndexNo)*intval(4);   

                                    }else {
                                        
                                        $currentRowIndex    = 2;
                            }
                        }
                        else {
                            
                            $currentRowIndex    = $this->subOperation->subOperation['currentRowIndex'];
                        }

                        $currentColumnIndex = $this->subOperation->subOperation['myCol'];
                        $suboperationCount  = $this->subOperation->subOperation['suboperationCount'];
                        $noOfRole           = $this->subOperation->subOperation['noOfRole'];
                        $domaincount        = $this->subOperation->subOperation['domaincount'];
                       // $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                    }
                    else {
                        //echo '22';
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');    
                        $subdata['currentRowIndex']         = $currentRowIndex;
                        $subdata['currentColumnIndex']      = $currentColumnIndex;
                        $this->subOperation->subOperation   = $subdata;
                    }

            // check post column and row value. If empty then assign value from session

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
                 
				 $FirstsubOperationPhaseArray = $this->commonSubOperationAction();
				
			}
        	
        return new ViewModel(array('FirstsubOperationPhaseArray'=>$FirstsubOperationPhaseArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'logicsN'=>$logicsN,'suboperationCount'=>$suboperationCount));
    }

    /*function use here to add multiple sub operation */
    public function addSubOperationMultipleAction() {
       
       $this->subOperation->getManager()->getStorage()->clear('subOperation');
       
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        
        $temproleArray= array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            /*print_r($post['data']);
            die();*/
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $checksubOperation = $post['checksubOperation'];
            $suboperationCount = $post['suboperationCount'];
            
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }

                $operationPhaseArray = $this->commonSubOperationAction();
                    
            }
        

            $subdata1['suboperationCount']    = $suboperationCount;
            $subdata1['currentRowIndex']      = $currentRowIndex;
            $subdata1['currentColumnIndex']   = $currentColumnIndex;
            $this->subOperation->subOperation = $subdata1;

       
        return new ViewModel(array('subOperationArray' => $operationPhaseArray,'temproleArray',$operationPhaseArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'checksubOperation'=>$checksubOperation,'suboperationCount'=>$suboperationCount));
    }
    /*end code here*/

    /**
     *  Add Phase Structure on Right Side by this Function
     */
    public function createOperationAction() {
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
            // $currentColumnSegments        = $post['preNoSegment'];
            $currentColumnSegments = $post['preNoSegment'];
            $noOfSegment = $post['noOfSegment'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $operationPhaseArray = $this->commonOperationAction();

        return new ViewModel(array('phaseArray' => $operationPhaseArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment));
    }

    /**
     *  Add Logic Segment by this Function
     */
    public function addLogicOperationSegmentAction() {
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
            $currentColumnIndex     = $post['currentColumn'];
            $domaincount            = $post['domaincount'];
            $suboperationCount      = $post['suboperationCount'];
            
            $subOperationArray      = $this->blankNonLogicsubOperationCommonAction();
            $subtempOpearationArray = array();
            $eventCount             = $post['eventCount'];
            $eventStatusArr         = $this->blanklogicStatusCommonAction();

            if(!empty($post['NonSquential'])){
                
                $NonSquential = $post['NonSquential'];

            }else {

                $NonSquential = '';

            }
            
            $type = $post['type'];
            $noOfRole = $post['roleNo'];
            $currentLength = $post['currentLength'];
            $lastColumn = $post['lastColumn'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
               }
          }

        $tempOpearationArray= array();
        $logicOperationPhaseArray = $this->commonLogicOperationAction();
        $roleArray = $this->commonRoleAction();

        $commondomainArray = $this->domainlogicCommonDomainAction();
        $domainArray = $this->domainCommonAction();
        
        $temproleArray= array();
        $tempdomainArray= array();
        $commontempdomainArray= array();
        $tempeventStatusArr = array();


        if($NonSquential=='NonSquential'){


            $subtempOpearationArray[1] = $subOperationArray[0]; 
            $subtempOpearationArray[2] = $subOperationArray[1];
            $subtempOpearationArray[3] = $subOperationArray[2];
            
          
            $subtempOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $subtempOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            
            $subOperationArray = $subtempOpearationArray;



            $tempOpearationArray[1] = $logicOperationPhaseArray[0]; 
            $tempOpearationArray[2] = $logicOperationPhaseArray[1];
            $tempOpearationArray[3] = $logicOperationPhaseArray[2];
            

            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
            
            $logicOperationPhaseArray = $tempOpearationArray;

            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
            
            $roleArray = $temproleArray;


            $tempdomainArray[1] = $domainArray[0];
            $tempdomainArray[2] = $domainArray[1];
            $tempdomainArray[3] = $domainArray[2];
            $tempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            
            $domainArray = $tempdomainArray;

            $commontempdomainArray[1] = $commondomainArray[0];
            $commontempdomainArray[2] = $commondomainArray[1];
            $commontempdomainArray[3] = $commondomainArray[2];
            $commontempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            
            $commondomainArray = $commontempdomainArray;


            $tempeventStatusArr[1] = $eventStatusArr[0];
            $tempeventStatusArr[2] = $eventStatusArr[1];
            $tempeventStatusArr[3] = $eventStatusArr[2];
            $tempeventStatusArr[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            
            $eventStatusArr = $tempeventStatusArr;

        }
            return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'logicOperationPhaseArray' => $logicOperationPhaseArray,'roleArray'=>$roleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'noOfRole'=>$noOfRole,'NonSquential'=>$NonSquential,'currentLength'=>$currentLength,'domainArray'=>$domainArray,'domaincount'=>$domaincount,'lastColumn'=>$lastColumn,'commondomainArray'=>$commondomainArray,'subOperationArray'=>$subOperationArray,'suboperationCount'=>$suboperationCount));
    }

    /**
     *  Add Segment by this Function
     */
    public function addOperationSegmentAction() {
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
            $domaincount = $post['domaincount'];
            $eventCount  = $post['eventStatusCol'];

            if(!empty($post['NonSquential'])){

            $NonSquential = $post['NonSquential'];

            }else {

                $NonSquential = '';

            }
            

            $type = $post['type'];
            $noOfRole = $post['roleNo'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $tempOpearationArray = array();
        $operationPhaseArray = $this->commonOperationAction();
        $roleArray           = $this->commonRoleAction();
        $temproleArray       = array();
        $tempdomainArray     = array();
        $currentLength       = $post['currentLength'];
        $blankRow 			 = $post['blankRow'];
        $domainArray 		 = $this->blankdomainCommonAction();
        $suboperationCount   = $post['suboperationCount'];
        $subOperationArray   = $this->blanksubOperationCommonAction();
        $eventStatusArr      = $this->blankeventStatusCommonAction();
        $subtempOpearationArray = array();
        $tempeventStatus =  array();


     if($NonSquential=='NonSquential'){

            $subtempOpearationArray[1] = $subOperationArray[0]; 
            $subtempOpearationArray[2] = $subOperationArray[1];
            $subtempOpearationArray[3] = $subOperationArray[2];
            $subtempOpearationArray[4] = $subOperationArray[3];
            $subtempOpearationArray[5] = $subOperationArray[4];
            $subtempOpearationArray[6] = $subOperationArray[5];
            $subtempOpearationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $subtempOpearationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            
            $subOperationArray = $subtempOpearationArray;
            $tempOpearationArray[1] = $operationPhaseArray[0]; 
            $tempOpearationArray[2] = $operationPhaseArray[1];
            $tempOpearationArray[3] = $operationPhaseArray[2];
            $tempOpearationArray[4] = $operationPhaseArray[3];
            $tempOpearationArray[5] = $operationPhaseArray[4];
            $tempOpearationArray[6] = $operationPhaseArray[5];
          
            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
            $operationPhaseArray = $tempOpearationArray;

            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
            $roleArray = $temproleArray;
            $tempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[1]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[3]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[4]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[5]['domain'] = '<div class="blank-div segment-node"></div>';
            $tempdomainArray[6]['domain'] = '<div class="blank-div segment-node"></div>';
            $domainArray = $tempdomainArray;
            $tempeventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[3]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[4]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[5]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $tempeventStatus[6]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArr = $tempeventStatus;
        }


       /* echo '<pre>';
        print_r($post);
        die();*/

            return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'phaseArray' => $operationPhaseArray,'subOperationArray'=>$subOperationArray,'roleArray'=>$roleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'noOfRole'=>$noOfRole,'NonSquential'=>$NonSquential,'currentLength'=>$currentLength,'blankRow'=>$blankRow,'domaincount'=>$domaincount,'domainArray'=>$domainArray,'suboperationCount'=>$suboperationCount));
    }

    /**
     *  Add Segment by this Function
     */
    public function deleteOperationAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $phaseDesctructor = array();
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myassignCol'];
            $lastRowIndex = $post['lastRow'];
            $lastColumnIndex = $post['lastColumn'];
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $phaseDesctructor[0]['event'] = '<div class="creation-node">
                <div class="node-circle node-white-circle node-white-circle">N</div>
                <div class="col-text"> <span class="destructure"></span>
                 <span class="col-node-text custom-node">Destruction</span>
                  </div>
              </div>';

        return new ViewModel(array('tableDataArray' => $tableDataArray, 'lastRow' => $lastRowIndex,'currentColumnIndex'=>$currentColumnIndex,'currentRowIndex'=>$currentRowIndex,'phaseDesctructor'=>$phaseDesctructor));
    }
    
    /*function use here to add role series*/
    public function addOperationNodeAction() {

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
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $nodeArray = $this->commonNodeAction();
        return new ViewModel(array('nodeArray' => $nodeArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment));
    }
    
    
    /*function use here to add role series*/
    public function addLogicDomainAction() {
 
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $logicRowNo = $post['logicRowNo'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
               
                    $roleArrayArray = $this->commonlogicArrayAction();
                
                    $temproleArray[1]['domain_series'] = $roleArrayArray[0]['domain_series'];
                    $temproleArray[2]['domain_series'] = $roleArrayArray[1]['domain_series'];
                    $temproleArray[3]['domain_series'] = $roleArrayArray[2]['domain_series'];
                    $temproleArray[4]['domain_series'] = $roleArrayArray[3]['domain_series'];
                    $temproleArray[5]['domain_series'] = $roleArrayArray[4]['domain_series'];
                    $temproleArray[6]['domain_series'] = $roleArrayArray[5]['domain_series'];
                    $temproleArray[0]['domain_series'] = '<div class="blank-div segment-node domainclass"></div>';
                    
            }

                
                $domainArray = $this->domainlogicCommonDomainAction();

        

       
        return new ViewModel(array('roleArray' => $roleArrayArray,'temproleArray',$temproleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'logicRowNo'=>$logicRowNo,'domainArray'=>$domainArray));
    }

	public function addSingleLogicDomainAction() {
 
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $logicRowNo = $post['logicRowNo'];
			$currentCol = $post['currentCol'];
			$type = $post['type'];
            $noOfRole = $post['roleNo'];
            $currentLength = $post['currentLength'];
            $suboperationCount   = $post['suboperationCount'];
            $eventCount  = $post['eventCount'];
			
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
               
                    
                    
            }

                
            $tempOpearationArray= array();
            $logicOperationPhaseArray = $this->commonLogicOperationAction();
            $roleArray = $this->commonRoleAction();
            $eventStatusArr      = $this->blankeventStatusCommonAction();

            $commondomainArray = $this->domainlogicCommonDomainAction();
            $domainArray = $this->domainCommonAction();

            $subOperationArray   = $this->blankNonLogicsubOperationCommonAction();
            $eventStatusArr      = $this->blanklogicStatusCommonAction();

            $temproleArray= array();
            $tempdomainArray= array();
            $tempsubOperationArray = array();
            $tempeventStatusArr = array();
            $tempOpearationArray[1] = $logicOperationPhaseArray[0]; 
            $tempOpearationArray[2] = $logicOperationPhaseArray[1];
            $tempOpearationArray[3] = $logicOperationPhaseArray[2];
            
            $tempOpearationArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['operation2'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['event'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['role'] = '<div class="blank-div segment-node"></div>';
            $tempOpearationArray[0]['system'] = '<div class="blank-div segment-node"></div>';
            
            $logicOperationPhaseArray = $tempOpearationArray;


            $tempsubOperationArray[1] = $subOperationArray[0]; 
            $tempsubOperationArray[2] = $subOperationArray[1];
            $tempsubOperationArray[3] = $subOperationArray[2];
            
            $tempsubOperationArray[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
            $tempsubOperationArray[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
            
            $subOperationArray = $tempsubOperationArray;   


            $temproleArray[1]['role_series'] = $roleArray[0]['role_series'];
            $temproleArray[2]['role_series'] = $roleArray[1]['role_series'];
            $temproleArray[3]['role_series'] = $roleArray[2]['role_series'];
            $temproleArray[4]['role_series'] = $roleArray[3]['role_series'];
            $temproleArray[5]['role_series'] = $roleArray[4]['role_series'];
            $temproleArray[6]['role_series'] = $roleArray[5]['role_series'];
            $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
            $roleArray = $temproleArray;


            $tempdomainArray[1] = $domainArray[0];
            $tempdomainArray[2] = $domainArray[1];
            $tempdomainArray[3] = $domainArray[2];
            $tempdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
            
            $domainArray = $tempdomainArray;

            $tempeventStatusArr[1] = $eventStatusArr[0];
            $tempeventStatusArr[2] = $eventStatusArr[1];
            $tempeventStatusArr[3] = $eventStatusArr[2];
            $tempeventStatusArr[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            
            $eventStatusArr = $tempeventStatusArr;

       
        return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'logicOperationPhaseArray' => $logicOperationPhaseArray,'roleArray' => $roleArray,'temproleArray',$temproleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'logicRowNo'=>$logicRowNo,'domainArray'=>$domainArray,'currentCol'=>$currentCol,'noOfRole'=>$noOfRole,'currentLength'=>$currentLength,'suboperationCount'=>$suboperationCount,'subOperationArray'=>$subOperationArray));
    }

    /*add first domain for logic*/
    public function addFirstSingleLogicDomainAction() {
 
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $logicRowNo = $post['logicRowNo'];
            $currentCol = $post['currentCol'];
            $type = $post['type'];
            $noOfRole = $post['roleNo'];
            $currentLength = $post['currentLength'];
            $eventCount  = $post['eventCount'];

            $suboperationCount   = $post['suboperationCount'];
            $subOperationArray   = $this->blankLogicsubOperationCommonAction();
            
                foreach ($tableArray as $key => $value) {
                    $temp = explode('@', $value);
                    $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                    $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                    $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
               
                    
            }
                
        $tempOpearationArray= array();
        $logicOperationPhaseArray = $this->commonLogicOperationAction();
        $roleArray = $this->commonRoleAction();
        $commondomainArray = $this->domainlogicCommonDomainAction();
        $domainArray = $this->domainCommonAction();
        $eventStatusArr      = $this->blankeventStatusCommonAction();
       
        return new ViewModel(array('eventCount'=>$eventCount,'eventStatusArr'=>$eventStatusArr,'logicOperationPhaseArray' => $logicOperationPhaseArray,'roleArray' => $roleArray,'temproleArray',$temproleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'logicRowNo'=>$logicRowNo,'domainArray'=>$domainArray,'currentCol'=>$currentCol,'noOfRole'=>$noOfRole,'currentLength'=>$currentLength,'subOperationArray'=>$subOperationArray,'suboperationCount'=>$suboperationCount));
    }
    /*end code here*/
    
    /*function use here to add domain  series*/
    /*function use here to add role series*/
    public function addOperationDomainAction() {

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
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }


        $nodeArray = $this->domainlogicCommonAction();
        return new ViewModel(array('nodeArray' => $nodeArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment));
    }

    /* end code here */
    public function deleteEventStatusAction() {
            
           $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
          
            error_reporting(0);
            $layout = $this->layout();
            $layout->setTemplate('layout/simple');
            $request = $this->getRequest();
            $post = array();
            $tableDataArray = array();
            $currentRowIndex = 0;
            $currentColumnIndex = 0;
            $temproleArray = array();
            $noOFEvent = '';
            if ($request->isPost()) {
                
                $post                   = $request->getPost()->toArray();
                $tableArray             = $post['data'];
                $exitscol               = $post['exitscol'];  
                if(!empty($post['noOfEvent'])){
                    $noOFEvent = count($post['noOfEvent']);
                }else {
                    $noOFEvent = 0;
                }
                
                $tableArray         = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = intval($post['myCol'])-2;
                $currentLength      = 3;
                $eventCol           = $post['lastCol'];

                
                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                    $tableDataArray[$temp[0]][$temp[1]]['trClass']  = $temp[2];
                    $tableDataArray[$temp[0]][$temp[1]]['tdClass']  = $temp[3];
                    $tableDataArray[$temp[0]][$temp[1]]['data']     = $temp[4];
                }

                $operationPhaseArray    = $this->InteractionOperationCommon();
                $roleArray              = $this->commonRoleAction();    
                $checkBlankRows         = $post['checkBlankRows'];
                $nonSequenceRowNo       = $post['nonSequence'];
                $currentColumnSegments  = $post['preNoSegment'];
                $domainArray            = $this->blankdomainCommonAction();
                $suboperationCount      = $post['suboperationCount'];
                $subOperationArray      = $this->blanksubOperationCommonAction(); 
                $domaincount            = $post['domaincount'];
                $noOfRole               = $post['roleNo'];
                $blankRow               = $post['blankRow'];  
                $lastRow                = $post['lastRow'];  
           }   

           $eventdata['currentRowIndex']    = $currentRowIndex;
           $eventdata['currentColumnIndex'] = $post['myCol'];
           $eventdata['deleteEvent']        = 1;
           $eventdata['lastRow']            = $lastRow;
           $eventdata['eventCol']           = $eventCol;
           $eventdata['exitscol']           =  1;
           $eventdata['noOFEvent']          =  $noOFEvent;
           
           $this->Eventstatus->Eventstatus  = $eventdata;
            return new ViewModel(array('logicOperationPhaseArray' => $operationPhaseArray,'subOperationArray'=>$subOperationArray,'roleArray'=>$roleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'noOfRole'=>$noOfRole,'NonSquential'=>$NonSquential,'currentLength'=>$currentLength,'blankRow'=>$blankRow,'domaincount'=>$domaincount,'domainArray'=>$domainArray,'suboperationCount'=>$suboperationCount));
    }
    
    /*delete functionaity here for delete event and add interaction*/
    public function addOperationAction() {
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
            $currentColumnIndex = intval($this->subOperation->subOperation['myCol'])-2;
            $currentColumnSegments = $post['preNoSegment'];
            $noOfSegment = intval($this->subOperation->subOperation['noOfSegment']);

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

        $operationPhaseArray = $this->commonOperationAction();

        return new ViewModel(array('phaseArray' => $operationPhaseArray, 'tableDataArray' => $tableDataArray, 'currentColumnSegments' => $currentColumnSegments, 'currentColumnIndex' => $currentColumnIndex, 'noOfSegment' => $noOfSegment));
    }

    public function deleteEventAction() {
        $this->subOperation->getManager()->getStorage()->clear('subOperation');
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
            /*echo '<pre>';
            print_r($post);
            die();*/    

            $tableArray = $post['data'];
            $myCol = $post['myCol'];
            $myRow = $post['myRow'];
            $currentRowIndex    = $post['myRow'];
            $currentColumnIndex = $post['myCol'];

            $subOpType2         = $post['opSelect'];
            $domaincount        = $post['domaincount'];
            $noOfRole           = $post['rolecount'];
            $opIndexNo          = $post['opIndexNo'];
            


            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
        }

            $suboperationCount                  = $post['suboperationCount'];
            $subdata['myRow']                   = $myRow;
            $subdata['myCol']                   = $myCol;
            $subdata['currentRowIndex']         = $currentRowIndex;
            $subdata['currentColumnIndex']      = $currentColumnIndex;
            $subdata['Op2']                     = $subOpType2;
            $subdata['domaincount']             = $domaincount;
            $subdata['suboperationCount']       = $suboperationCount;
            $subdata['noOfRole']                = $noOfRole;
            $subdata['opIndexNo']               = $opIndexNo;
            


            $subdata['noOfSegment']             = count($post['opLength']);
            $this->subOperation->subOperation   = $subdata;

        return new ViewModel(array('phaseArray' => $phaseArray, 'tableDataArray' => $tableDataArray, 'myCol' => $myCol, 'myRow' => $myRow));
    }
    /*end code here*/


    /* function use here to add event Status */
    public function addEventStatusAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            
            $post                   = $request->getPost()->toArray();
            $tableArray             = $post['data'];
            
                    $tableArray         = $post['data'];
                    $currentRowIndex    = $post['myRow'];
                    $currentColumnIndex = $post['myCol'];
                    $exitscol           = $post['exitscol'];  

                    if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                    }
                    else {
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                    }
        
                    $currentLength      = 3;
                    foreach ($tableArray as $key => $value) {
                    $temp = explode('@', $value);
                        $tableDataArray[$temp[0]][$temp[1]]['trClass']  = $temp[2];
                        $tableDataArray[$temp[0]][$temp[1]]['tdClass']  = $temp[3];
                        $tableDataArray[$temp[0]][$temp[1]]['data']     = $temp[4];
                    }
                


            $checkBlankRows         = $post['checkBlankRows'];
            $nonSequenceRowNo       = $post['nonSequence'];
            $logicsN                = $post['logicsN'];
            $eventCount             = $post['eventCount'];
            $type                   = $post['type'];
            $currentColumnSegments  = $post['preNoSegment'];
            $eventStatusArray       = $this->eventStatusCommonAction();  

            /*echo '<pre>';
            print_r($this->Eventstatus->Eventstatus);
            print_r($post);
            die();*/

                
        }
        
        return new ViewModel(array('exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }

    /*function use here tfor add after only*/
    public function addAfterEventStatusAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $exitscol = $post['exitscol'];  
            
                $tableArray = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength = $post['currentLength'];

                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                       $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                    }
                    else {
                        //echo '22';
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                 }


                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $eventCount = $post['eventCount'];
            $type = $post['type'];
            $currentColumnSegments = $post['preNoSegment'];
            $eventStatusArray = $this->eventAfterStatusCommonAction();
                
        }
        
        return new ViewModel(array('exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }
    
    /*function use here tfor add after and completion only*/
    public function addAfterCopmletionAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $exitscol               = $post['exitscol'];             
            
                $tableArray = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength = $post['currentLength']; 

                /*echo '<pre>';
                print_r($this->Eventstatus);
                print_r($post);
                die();
                */
                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                       // $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                    }
                    else {
                        //echo '22';
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                 }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            
            
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $eventCount = $post['eventCount'];
            $type = $post['type'];
            $currentColumnSegments = $post['preNoSegment'];
            $eventStatusArray = $this->eventAfterCompletionAction();
            $interationArray = $this->eventInteractionArray();
            
        }
        
        return new ViewModel(array('interationArray'=>$interationArray,'exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }

    public function addAfterCompletionEventStatusAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
                $post = $request->getPost()->toArray();
                $exitscol               = $post['exitscol']; 
                $tableArray         = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength      = $post['currentLength'];

                 if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                    }
                    else {
                        //echo '22';
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                 }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            


            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $eventCount = $post['eventCount'];
            $type = $post['type'];
            $currentColumnSegments = $post['preNoSegment'];
            
            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }

                $eventStatusArray = $this->eventAfterStatusCommonAction();
                
        }
        
        return new ViewModel(array('exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }

    /** function here to use after and destructor*/
    public function addAfterDestructureAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();
            $exitscol               = $post['exitscol']; 

                $tableArray         = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength      = $post['currentLength'];

                 $lastRow            = 0;
                 $noOFEvent = 0;
                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $eventCol           = 1;
                        $lastRow            = $this->Eventstatus->Eventstatus['lastRow'];
                        $noOFEvent          = $this->Eventstatus->Eventstatus['noOFEvent'];
                        
                        
                }
                else{
                   
                    $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            

                $checkBlankRows= $post['checkBlankRows'];
                $nonSequenceRowNo = $post['nonSequence'];
                $logicsN = $post['logicsN'];
                $eventCount = $post['eventCount'];
                $type = $post['type'];
                $currentColumnSegments = $post['preNoSegment'];
                $eventStatusArray      = $this->eventAfterdestructiveCommonAction();
                $interationArray       = $this->eventInteractionArray();
                $staRow = $currentRowIndex;
                $destructorAr  = $this->destructorArray();
                $staRow = $currentRowIndex;
                
        }
        
        return new ViewModel(array('staRow'=>$staRow,'lastRow'=>$lastRow,'eventCol'=>$eventCol,'destructorAr'=>$destructorAr,'interationArray'=>$interationArray,'exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }

    /*function use here for add completion and destructor*/
    public function addCopmletionDestructureAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        /*echo '<pre>';
        print_r($this->Eventstatus->Eventstatus);
        die('fff');
        */

        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();
            $exitscol               = $post['exitscol']; 

                $tableArray         = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength      = 3;
                $eventCol = 0;
                $lastRow            = 0;
                $noOFEvent = 0;
                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $eventCol           = 1;
                        $lastRow            = $this->Eventstatus->Eventstatus['lastRow'];
                        $noOFEvent          = $this->Eventstatus->Eventstatus['noOFEvent'];
                        
                        
                }
                else{
                   
                    $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }

                $checkBlankRows= $post['checkBlankRows'];
                $nonSequenceRowNo = $post['nonSequence'];
                $logicsN = $post['logicsN'];
                $eventCount = $post['eventCount'];
                $type = $post['type'];
                $currentColumnSegments = $post['preNoSegment'];
                $eventStatusArray = $this->eventCompletiondestructiveCommonAction();
                $interationArray  = $this->eventInteractionArray();
                $destructorAr  = $this->destructorArray();
                $staRow = $currentRowIndex;
        }
        
        return new ViewModel(array('staRow'=>$staRow,'lastRow'=>$lastRow,'eventCol'=>$eventCol,'destructorAr'=>$destructorAr,'interationArray'=>$interationArray,'exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }
    /*end code here*/

    /*function add here to add destructor only*/
    public function addAfterDestructiveEventStatusAction() {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();
            $exitscol               = $post['exitscol']; 

                $tableArray         = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength      = $post['currentLength'];

                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                    }
                    else {
                        //echo '22';
                        $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                        
                 }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            

            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];
            $eventCount = $post['eventCount'];
            $type = $post['type'];
            $currentColumnSegments = $post['preNoSegment'];
            
            $eventStatusArray = $this->eventdestructiveAfterStatusCommonAction();
                
        }
        
        return new ViewModel(array('exitscol'=>$exitscol,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'type'=>$type,'currentColumnSegments'=>$currentColumnSegments));
    }

    /* function use here to add event Status */
    public function addMultipleEventAction() {
        
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();

            $exitscol               = $post['exitscol']; 
            /*print_r($exitscol);
            echo '<pre>';
            print_r($post['sessionVal']);
            print_r($this->Eventstatus->Eventstatu);
            die();*/

                $tableArray = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength      = $post['currentLength'];
                $lastRow            = 0;
                $noOFEvent          = 0;
                if($currentColumnIndex == 0 || $currentColumnIndex == ''){
                        
                        $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
                        $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
                        $exitscol           = $this->Eventstatus->Eventstatus['exitscol'];
                        $eventCol           = 1;
                        $lastRow            = $this->Eventstatus->Eventstatus['lastRow'];
                        $noOFEvent          = $this->Eventstatus->Eventstatus['noOFEvent'];
                        
                        
                }
                else{
                   
                    $this->Eventstatus->getManager()->getStorage()->clear('Eventstatus');
                }

                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                    $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                    $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                    $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            

            $checkBlankRows         = $post['checkBlankRows'];
            $nonSequenceRowNo       = $post['nonSequence'];
            $logicsN                = $post['logicsN'];
            
            $eventCount             = $post['eventCount'];
            $type                   = $post['type'];
            $currentColumnSegments  = $post['preNoSegment'];
            $typeCpmpletion   = 'N';
            $typedestructor   = 'N';
            $typeAfter = 'N';
            $before    = '<div class="creation-node event-before e-before">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">before</span></div></div>';
            $after      = '<div class="creation-node event-before e-after">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">after</span></div></div>';
            $completion = '<div class="creation-node event-before e-completion">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">compl</span></div></div>';
            $destructor = '<div class="creation-node event-before e-destructive">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">destruct</span></div></div>';
            $interationArray  = $this->eventInteractionArray();
            $popUpLength = intval($currentLength)-1;

            $newArr = array();

            for($i=0;$i<intval($currentLength);$i++)
            {
                $newArr[] = '';
            }
            
            foreach ($type as $key => $value) 
            {
                 if($value == 'before') 
                 {
                        $newArr [] = '';
                        $newArr[0] = $before;
                 } 
                 if($value == 'after') 
                 {
                        if(in_array('before',$type))
                        {
                            $newArr[] = '';
                            $newArr[2] = $after;
                        }
                        else
                        {
                            $newArr[1] = $after;
                        }
                        $typeAfter= 'Y';
                 }  

                 if($value == 'completion') 
                 {
                        if(count($type)==2)
                        {
                            $newArr[] = '';
                            $newArr[3] = $completion;
                        }
                        else if(count($type) == 3){

                         if(!in_array('before',$type) || !in_array('after',$type))
                            {
                                $newArr[] = '';
                                $newArr[3] = $completion;
                            }
                           
                            else {
                                
                                if(!in_array('destructor',$type) )
                                {   
                                    $newArr[] = '';
                                    $newArr[4] = $completion;
                                    $newArr[5] = '';
                                }
                                else {
                                 $newArr[] = '';
                                 $newArr[4] = $completion;
                                }

                                
                            }
                            
                        }
                        
                        else
                        {
                            $newArr[] = '';
                            $newArr[4] = $completion;
                        }

                        $typeCpmpletion = 'Y';
                 } 

                 if($value == 'destructor') 
                 {
                        if(count($type)==2)
                        {
                            
                            if(!in_array('before',$type) || !in_array('after',$type))
                            {
                                $newArr[] = '';
                                $newArr[3] = $destructor;
                            }
                           
                            else {
                                $newArr[] = '';
                                $newArr[4] = $destructor;
                            }

                        }

                        if(count($type)==3)
                        {
                            $newArr[] = '';
                            $newArr[5] = $destructor;
                        }
                        else
                        {
                            $newArr[] = '';
                            $newArr[6] = $destructor;
                        }  

                        $typedestructor = 'Y';
                 }    
            }
           
            $eventStatusArray = $newArr;

            


            if($post['sessionVal'] == 0){
            
            $eventdata['currentRowIndex']    = $currentRowIndex;
            
            $eventdata['currentColumnIndex'] = $currentColumnIndex;

            $eventdata['currentLength']      = $currentLength;
            
            $this->Eventstatus->Eventstatus  = $eventdata;
            
            $this->EventPost->EventPost      = $tableDataArray;

            }

            $countType = count($type);

              /* echo '<pre>';
              
              print_r($eventStatusArray);
              
              die();

              if($type == 'before'){
                $eventStatusArray = $this->eventStatusCommonAction();
              }
              else {
                $eventStatusArray = $this->eventAfterStatusCommonAction();  
              }*/
              
        }
        
        return new ViewModel(array('interationArray'=>$interationArray,'exitscol'=>$exitscol,'typeAfter'=>$typeAfter,'typedestructor'=>$typedestructor,'typeCpmpletion'=>$typeCpmpletion,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'currentLength'=>$currentLength,'currentColumnSegments'=>$currentColumnSegments));
    }

    public function addAnotherMultipleEventAction() {
        
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        
        if ($request->isPost()) {
            
            $post = $request->getPost()->toArray();

            $exitscol               = $post['exitscol']; 

            /*print_r($exitscol);
            echo '<pre>';
            print_r($post['sessionVal']);
            print_r($this->Eventstatus->Eventstatu);
            die();*/

            if($post['sessionVal'] == 1){

            $currentRowIndex    = $this->Eventstatus->Eventstatus['currentRowIndex'];
            $currentColumnIndex = $this->Eventstatus->Eventstatus['currentColumnIndex'];
            $currentLength      = $this->Eventstatus->Eventstatus['currentLength'];
            $tableDataArray     = $this->EventPost->EventPost;
            
            }
            else {

                $tableArray = $post['data'];
                $currentRowIndex    = $post['myRow'];
                $currentColumnIndex = $post['myCol'];
                $currentLength          = $post['currentLength'];
                foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                    $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                    $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                    $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
                }
            }

            $checkBlankRows         = $post['checkBlankRows'];
            $nonSequenceRowNo       = $post['nonSequence'];
            $logicsN                = $post['logicsN'];
            
            $eventCount             = $post['eventCount'];
            $type                   = $post['type'];
            $currentColumnSegments  = $post['preNoSegment'];
            $typeCpmpletion   = 'N';
            $typedestructor   = 'N';

            $before    = '<div class="creation-node event-before e-before">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">before</span></div></div>';
            $after      = '<div class="creation-node event-before e-after">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">after</span></div></div>';
            $completion = '<div class="creation-node event-before e-completion">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">compl</span></div></div>';
            $destructor = '<div class="creation-node event-before e-destructive">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">destruct</span></div></div>';

            $popUpLength = intval($currentLength)-1;

            $newArr = array();
            for($i=0;$i<intval($currentLength);$i++)
            {
                $newArr[] = '';
            }
            
            foreach ($type as $key => $value) 
            {
                 if($value == 'before') 
                 {
                        $newArr [] = '';
                        $newArr[0] = $before;
                 } 
                 if($value == 'after') 
                 {
                        if(in_array('before',$type))
                        {
                            $newArr[] = '';
                            $newArr[2] = $after;
                        }
                        else
                        {
                            $newArr[1] = $after;
                        }
                 }  

                 if($value == 'completion') 
                 {
                        if(count($type)==2)
                        {
                            $newArr[] = '';
                            $newArr[3] = $completion;
                        }
                        else if(count($type) == 3){

                         if(!in_array('before',$type) || !in_array('after',$type))
                            {
                                $newArr[] = '';
                                $newArr[3] = $completion;
                            }
                           
                            else {
                                $newArr[] = '';
                                $newArr[4] = $completion;
                            }
                            
                        }
                        
                        else
                        {
                            $newArr[] = '';
                            $newArr[4] = $completion;
                        }

                        $typeCpmpletion = 'Y';
                 } 

                 if($value == 'destructor') 
                 {
                        if(count($type)==2)
                        {
                            
                            if(!in_array('before',$type) || !in_array('after',$type))
                            {
                                $newArr[] = '';
                                $newArr[3] = $destructor;
                            }
                           
                            else {
                                $newArr[] = '';
                                $newArr[4] = $destructor;
                            }

                        }

                        if(count($type)==3)
                        {
                            $newArr[] = '';
                            $newArr[5] = $destructor;
                        }
                        else
                        {
                            $newArr[] = '';
                            $newArr[6] = $destructor;
                        }  

                        $typedestructor = 'Y';
                 }    
            }
           
            $eventStatusArray = $newArr;


            if($post['sessionVal'] == 0){
            
            $eventdata['currentRowIndex']    = $currentRowIndex;
            
            $eventdata['currentColumnIndex'] = $currentColumnIndex;

            $eventdata['currentLength']      = $currentLength;
            
            $this->Eventstatus->Eventstatus  = $eventdata;
            
            $this->EventPost->EventPost      = $tableDataArray;

            }


              /* echo '<pre>';
              
              print_r($eventStatusArray);
              
              die();

              if($type == 'before'){
                $eventStatusArray = $this->eventStatusCommonAction();
              }
              else {
                $eventStatusArray = $this->eventAfterStatusCommonAction();  
              }*/
              
        }
        
        return new ViewModel(array('exitscol'=>$exitscol,'typedestructor'=>$typedestructor,'typeCpmpletion'=>$typeCpmpletion,'eventStatusArray' => $eventStatusArray,'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN,'eventCount'=>$eventCount,'currentLength'=>$currentLength,'currentColumnSegments'=>$currentColumnSegments));
    }

    /*function use here to add role series*/
    public function addOperationRoleAction() {

        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        $tableDataArray = array();
        $currentRowIndex = 0;
        $currentColumnIndex = 0;
        $temproleArray= array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
            $tableArray = $post['data'];
            $currentRowIndex = $post['myRow'];
            $currentColumnIndex = $post['myCol'];
            $noOfSegment = $post['noOfSegment'];
            $checkBlankRows= $post['checkBlankRows'];
            $nonSequenceRowNo = $post['nonSequence'];
            $logicsN = $post['logicsN'];

            foreach ($tableArray as $key => $value) {
                $temp = explode('@', $value);
                $tableDataArray[$temp[0]][$temp[1]]['trClass'] = $temp[2];
                $tableDataArray[$temp[0]][$temp[1]]['tdClass'] = $temp[3];
                $tableDataArray[$temp[0]][$temp[1]]['data'] = $temp[4];
            }
               
                    $roleArrayArray = $this->commonRoleAction();
                
                    $temproleArray[1]['role_series'] = $roleArrayArray[0]['role_series'];
                    $temproleArray[2]['role_series'] = $roleArrayArray[1]['role_series'];
                    $temproleArray[3]['role_series'] = $roleArrayArray[2]['role_series'];
                    $temproleArray[4]['role_series'] = $roleArrayArray[3]['role_series'];
                    $temproleArray[5]['role_series'] = $roleArrayArray[4]['role_series'];
                    $temproleArray[6]['role_series'] = $roleArrayArray[5]['role_series'];
                    $temproleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
                    
            }
        

       
        return new ViewModel(array('roleArray' => $roleArrayArray,'temproleArray',$temproleArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex, 'type' => $type, 'currentColumnSegments' => $noOfSegment,'NonSquential'=>$checkBlankRows,'nonSequenceRowNo'=>$nonSequenceRowNo,'logicsN'=>$logicsN));
    }

    /* common function use here for operation segment to defined html value in array */
    public function commonOperationAction() {

        /* first row data here */
        $operationPhaseArray[0]['operation1'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text">
                <span class="col-node-text">
    			    <input type="text" class="custom-node operation-delete" placeholder="Undefined">
                </span>
            </div>  
        </div>
        <i class="fa fa-bars add-segment segment"></i>
        <div class="add-col-wrap add-segment ">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
			<li role="presentation" class=""> <a class="" tabindex="-1" role="menuitem">
                <div class="node-circle node-white-circle-expanded">N</div>
                Add Series </a>
                <ul class="sub-item">
                    <li role="presentation" class="add-suboperaton-segment"> <a href="#" tabindex="-1" role="menuitem">
                    <div class="node-circle node-white-circle node-white-circle">N</div>
                    Operation </a> </li>
                </ul>
             </li>
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Add Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation">
                            <a role="menuitem" tabindex="-1" href="#" class="add-above-operation-segment">
                                <div class="node-circle node-white-circle">N</div>
                                Add Above 
                            </a>
                        </li>
                        <li role="presentation" >
                            <a role="menuitem" tabindex="-1" href="#" class="add-below-operation-segment">
                                <div class="node-circle node-white-circle-expanded">N</div>
                                Add Below
                            </a>
							<ul class="sub-item">
								<li role="presentation">
									<a role="menuitem" tabindex="-1" href="#" class=" WriteYourOwnClass">
										<div class="node-circle node-white-circle">N</div>
										Sequential 
									</a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-logic-operation-segment"><div class="node-circle node-white-circle ">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
								</li>
								<li>
									<a role="menuitem" tabindex="-1" href="#" class="WriteYourOwnClass">
										<div class="node-circle node-white-circle">N</div>
										Non-Sequential 
									</a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-below-logic-non-sequence-operation-segment"><div class="node-circle node-white-circle">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-non-sequence-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
								</li>
							</ul>
                        </li>
                    </ul>
                </li>
                <li role="presentation" class="no-bg ">
                    <a role="menuitem" tabindex="-1" class="disabled">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Move Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation" class="no-bg disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Above 
                            </a>
                        </li>

						<li role="presentation" data-toggle="modal" data-target="#moveBelow" class="moveBelow disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Below 
                            </a>
                        </li>
						
						
						
                    </ul>
                </li>
                <li data-toggle="modal" data-target="#deleteOperationSegment" class="del-operation-segment">
						  <a class="" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Delete Segment
						  </a>
					  </li>
            </ul>
        </div>';

        $operationPhaseArray[0]['event_operation'] = '<div class="creation-node">
							<div class="node-circle node-white-circle node-white-circle">N</div>
							<div class="col-text"><span class="creation"></span> 
							<span class="col-node-text custom-node">Creation</span></div></div>';



        $operationPhaseArray[0]['operation2'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Manifestation" >Manifestation</span></div>
        </div>';
        $operationPhaseArray[0]['event'] = '<div class="creation-node">
							<div class="node-circle node-white-circle node-white-circle">N</div>
							<div class="col-text"><span class="creation"></span> 
							<span class="col-node-text custom-node">Creation</span></div></div>';
        $operationPhaseArray[0]['role'] = '<div class="blank-div segment-node"></div>';

        $operationPhaseArray[0]['system'] = '<div class="blank-div segment-node"></div>';



        /* second row data here */
        $operationPhaseArray[1]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['event'] = '<div class ="blank-div segment-node"></div>';
        $operationPhaseArray[1]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['system'] = '<div class="creation-node operation-tab-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">...Process</span></div>
        </div>';


        $operationPhaseArray[2]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['event'] = '<div class="creation-node">
									<div class="node-circle node-white-circle node-white-circle">N</div>
									<div class="col-text"><span class="destructure"></span><span class="col-node-text custom-node">Destruction</span></div>
									</div>';
        $operationPhaseArray[2]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['system'] = '<div class="blank-div segment-node"></div>';

        /* third row data here */
        $operationPhaseArray[3]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[3]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[3]['operation2'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Interaction" >Interaction</span></div>
        </div>
        <i class="fa fa-bars  segment check-add-status"></i>
        <div class="add-col-wrap">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                       Status capture point
                    </a>
                    <ul class="sub-item check-point ">
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-before-the-event-has-started">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="before" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                Before the event has started 
                            </a>
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-the-event-has-ended">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="after" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After the event has ended
                            </a> 
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-completion-of-role-operation">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="completion" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After completion of Role-Operation
                            </a> 
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-the-destruction-event">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="destructor" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After the destruction event
                            </a> 
                        </li>

                         
 
                    </ul>
                </li>
             </ul>
        </div>';
        $operationPhaseArray[3]['event'] = '<div class="creation-node">
							<div class="node-circle node-white-circle node-white-circle">N</div>
							<div class="col-text"><span class="creation"></span> <span class="col-node-text custom-node">Creation</span></div></div>';
        $operationPhaseArray[3]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[3]['system'] = '<div class="blank-div segment-node"></div>';

        /* fourth row data here */
        $operationPhaseArray[4]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[4]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[4]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[4]['event'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[4]['role'] = '<div class="creation-node " >
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node actionNode" placeholder="Interaction" >Interaction</span></div>
        </div>
		<i class="fa fa-bars  segment"></i>
        <div class="add-col-wrap  add-status nodeflyOut">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="nodeFlyout" data-toggle="modal" data-target="#nodeFlyout" data-direction="right">
                        <div class="node-circle node-white-circle-expanded">N</div>
                       View Class 
                    </a>
                </li>
             </ul>
        </div>';
        $operationPhaseArray[4]['system'] = '<div class="blank-div segment-node"></div>';

        /* fifth row data here */
        $operationPhaseArray[5]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[5]['event_operation'] = '<div class="creation-node">
									<div class="node-circle node-white-circle node-white-circle">N</div>
									<div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
									</div>';
        $operationPhaseArray[5]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[5]['event'] = '<div class="creation-node">
									<div class="node-circle node-white-circle node-white-circle">N</div>
									<div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
									</div>';
        $operationPhaseArray[5]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[5]['system'] = '<div class="blank-div segment-node"></div>';

        /* six row data here */
        

        return $operationPhaseArray;
    }

    /* function use here for common interation for operation in event status section*/
    public function InteractionOperationCommon(){

        $operationPhaseArray[0]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[0]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[0]['operation2'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Interaction" >Interaction</span></div>
        </div><i class="fa fa-bars  segment check-add-status"></i>
        <div class="add-col-wrap">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                       Status capture point
                    </a>
                    <ul class="sub-item check-point ">
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-before-the-event-has-started">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="before" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                Before the event has started 
                            </a>
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-the-event-has-ended">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="after" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After the event has ended
                            </a> 
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-completion-of-role-operation">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="completion" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After completion of Role-Operation
                            </a> 
                        </li>
                        <li role="presentation" class="">
                            <a role="menuitem" tabindex="-1" href="#" class="add-after-the-destruction-event">
                                <span class="node-input">
                                    <div class="icheckbox_minimal" style="position: relative;">
                                    <input type="checkbox" class="pane_1" name="nodes_1[]" value="destructor" data-nodex-id="1" data-nodex-attrid="1" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>
                                </span><div class="node-circle node-white-circle">N</div>
                                After the destruction event
                            </a> 
                        </li>

                         
 
                    </ul>
                </li>
             </ul>
        </div>';
        $operationPhaseArray[0]['event'] = '<div class="creation-node">
                            <div class="node-circle node-white-circle node-white-circle">N</div>
                            <div class="col-text"><span class="creation"></span> <span class="col-node-text custom-node">Creation</span></div></div>';
        $operationPhaseArray[0]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[0]['system'] = '<div class="blank-div segment-node"></div>';

        /* fourth row data here */
        $operationPhaseArray[1]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['event'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[1]['role'] = '<div class="creation-node " >
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node actionNode" placeholder="Interaction" >Interaction</span></div>
        </div>
        <i class="fa fa-bars  segment"></i>
        <div class="add-col-wrap  add-status nodeflyOut">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="nodeFlyout" data-toggle="modal" data-target="#nodeFlyout" data-direction="right">
                        <div class="node-circle node-white-circle-expanded">N</div>
                       View Class 
                    </a>
                </li>
             </ul>
        </div>';
        $operationPhaseArray[1]['system'] = '<div class="blank-div segment-node"></div>';

        /* fifth row data here */
        $operationPhaseArray[2]['operation1'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['event_operation'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        $operationPhaseArray[2]['operation2'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['event'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        $operationPhaseArray[2]['role'] = '<div class="blank-div segment-node"></div>';
        $operationPhaseArray[2]['system'] = '<div class="blank-div segment-node"></div>';

        /* six row data here */
        

        return $operationPhaseArray;
    }
    /* common function use here for operation segment to defined html value in array */

    public function commonSubOperationAction() {

        /* first row data here */
        $commonSubOperationAction[0]['sub_operation1'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text">
                <span class="col-node-text">
                    <input type="text" class="custom-node operation-delete" placeholder="Undefined">
                </span>
            </div>  
        </div>
       <i class="fa fa-bars add-segment segment"></i>
        <div class="add-col-wrap add-segment ">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
            <li role="presentation" class=""> <a class="" tabindex="-1" role="menuitem">
                <div class="node-circle node-white-circle-expanded">N</div>
                Add Series </a>
                <ul class="sub-item">
                    <li role="presentation" class="add-suboperaton-segment"> <a href="#" tabindex="-1" role="menuitem">
                    <div class="node-circle node-white-circle node-white-circle">N</div>
                    Operation </a> </li>
                </ul>
             </li>
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Add Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation">
                            <a role="menuitem" tabindex="-1" href="#" class="add-above-operation-segment">
                                <div class="node-circle node-white-circle">N</div>
                                Add Above 
                            </a>
                        </li>
                        <li role="presentation" >
                            <a role="menuitem" tabindex="-1" href="#" class="add-below-operation-segment">
                                <div class="node-circle node-white-circle-expanded">N</div>
                                Add Below
                            </a>
                            <ul class="sub-item">
                                <li role="presentation">
                                    <a role="menuitem" tabindex="-1" href="#" class=" WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-logic-operation-segment"><div class="node-circle node-white-circle ">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a role="menuitem" tabindex="-1" href="#" class="WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Non-Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-below-logic-non-sequence-operation-segment"><div class="node-circle node-white-circle">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-non-sequence-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li role="presentation" class="no-bg ">
                    <a role="menuitem" tabindex="-1" class="disabled">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Move Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation" class="no-bg disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Above 
                            </a>
                        </li>

                        <li role="presentation" data-toggle="modal" data-target="#moveBelow" class="moveBelow disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Below 
                            </a>
                        </li>
                        
                        
                        
                    </ul>
                </li>
                <li data-toggle="modal" data-target="#deleteOperationSegment" class="del-operation-segment">
                          <a class="" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Delete Segment
                          </a>
                      </li>
            </ul>
        </div>';

        $commonSubOperationAction[0]['sub_event_operation'] = '<div class="creation-node">
                            <div class="node-circle node-white-circle node-white-circle">N</div>
                            <div class="col-text"><span class="creation"></span> 
                            <span class="col-node-text custom-node">Creation</span></div></div>';

        /* second row data here */
        $commonSubOperationAction[1]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonSubOperationAction[1]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
       


        $commonSubOperationAction[2]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonSubOperationAction[2]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        /* third row data here */
        $commonSubOperationAction[3]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonSubOperationAction[3]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        /* fourth row data here */
        $commonSubOperationAction[4]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonSubOperationAction[4]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        /* fifth row data here */
        $commonSubOperationAction[5]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonSubOperationAction[5]['sub_event_operation'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
     
        return $commonSubOperationAction;
    }

    public function commonLogicSubOperationAction() {

        $commonLogicSubOperationAction[0]['sub_operation1'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text">
                <span class="col-node-text">
                    <input type="text" class="custom-node operation-delete" placeholder="Undefined">
                </span>
            </div>  
        </div>
       <i class="fa fa-bars add-segment segment"></i>
        <div class="add-col-wrap add-segment ">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Add Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation">
                            <a role="menuitem" tabindex="-1" href="#" class="add-above-operation-segment">
                                <div class="node-circle node-white-circle">N</div>
                                Add Above 
                            </a>
                        </li>
                        <li role="presentation" >
                            <a role="menuitem" tabindex="-1" href="#" class="add-below-operation-segment">
                                <div class="node-circle node-white-circle-expanded">N</div>
                                Add Below
                            </a>
                            <ul class="sub-item">
                                <li role="presentation">
                                    <a role="menuitem" tabindex="-1" href="#" class=" WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-logic-operation-segment"><div class="node-circle node-white-circle ">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a role="menuitem" tabindex="-1" href="#" class="WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Non-Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                       <li><a href="#" class="add-below-logic-non-sequence-operation-segment"><div class="node-circle node-white-circle">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-non-sequence-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li role="presentation" class="no-bg ">
                    <a role="menuitem" tabindex="-1" class="disabled">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Move Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation" class="no-bg disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Above 
                            </a>
                        </li>

                        <li role="presentation" data-toggle="modal" data-target="#moveBelow" class="moveBelow disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Below 
                            </a>
                        </li>
                        
                        
                        
                    </ul>
                </li>
                <li data-toggle="modal" data-target="#deleteOperationSegment" class="del-operation-segment">
                          <a class="" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Delete Segment
                          </a>
                      </li>
            </ul>
        </div>';

        $commonLogicSubOperationAction[0]['sub_event_operation'] = '<div class="creation-node">
                            <div class="node-circle node-white-circle node-white-circle">N</div>
                            <div class="col-text"><span class="creation"></span> 
                            <span class="col-node-text custom-node">Creation</span></div></div>';



        /* second row data here */
        $commonLogicSubOperationAction[1]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonLogicSubOperationAction[1]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        

        $commonLogicSubOperationAction[2]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $commonLogicSubOperationAction[2]['sub_event_operation'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        

        /* 3 row data here */
        

        return $commonLogicSubOperationAction;
    }
    /*end function here*/

    /*start code here to add logic operation segment here */
    /* common function use here for operation segment to defined html value in array */
    public function commonLogicOperationAction() {

        $logicoperationPhaseArray[0]['operation1'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text">
                <span class="col-node-text">
                    <input type="text" class="custom-node operation-delete" placeholder="Undefined">
                </span>
            </div>  
        </div>
       <i class="fa fa-bars add-segment segment"></i>
        <div class="add-col-wrap add-segment ">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Add Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation">
                            <a role="menuitem" tabindex="-1" href="#" class="add-above-operation-segment">
                                <div class="node-circle node-white-circle">N</div>
                                Add Above 
                            </a>
                        </li>
                        <li role="presentation" >
                            <a role="menuitem" tabindex="-1" href="#" class="add-below-operation-segment">
                                <div class="node-circle node-white-circle-expanded">N</div>
                                Add Below
                            </a>
                            <ul class="sub-item">
                                <li role="presentation">
                                    <a role="menuitem" tabindex="-1" href="#" class=" WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                        <li><a href="#" class="add-logic-operation-segment"><div class="node-circle node-white-circle ">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a role="menuitem" tabindex="-1" href="#" class="WriteYourOwnClass">
                                        <div class="node-circle node-white-circle">N</div>
                                        Non-Sequential 
                                    </a>
                                    <ul class="agent-drp">
                                        <li class="disabled"><a><div class="node-circle node-white-circle">N</div>Universe</a></li>
                                       <li><a href="#" class="add-below-logic-non-sequence-operation-segment"><div class="node-circle node-white-circle">N</div>Logic</a></li>
                                        <li><a href="#" class="add-below-non-sequence-operation-segment"><div class="node-circle node-white-circle ">N</div>Human</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li role="presentation" class="no-bg ">
                    <a role="menuitem" tabindex="-1" class="disabled">
                        <div class="node-circle node-white-circle-expanded">N</div>
                        Move Segment
                    </a>
                    <ul class="sub-item">
                        <li role="presentation" class="no-bg disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Above 
                            </a>
                        </li>

                        <li role="presentation" data-toggle="modal" data-target="#moveBelow" class="moveBelow disabled">
                            <a role="menuitem" tabindex="-1" href="#" class="">
                                <div class="node-circle node-white-circle">N</div>
                                Move Below 
                            </a>
                        </li>
                        
                        
                        
                    </ul>
                </li>
                <li data-toggle="modal" data-target="#deleteOperationSegment" class="del-operation-segment">
                          <a class="" tabindex="-1" role="menuitem">
                            <div class="node-circle node-white-circle">N</div>
                            Delete Segment
                          </a>
                      </li>
            </ul>
        </div>';

        $logicoperationPhaseArray[0]['event_operation'] = '<div class="creation-node">
                            <div class="node-circle node-white-circle node-white-circle">N</div>
                            <div class="col-text"><span class="creation"></span> 
                            <span class="col-node-text custom-node">Creation</span></div></div>';



        $logicoperationPhaseArray[0]['operation2'] = '<div class="segment-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Manifestation">Manifestation</span></div>
        </div>';
        $logicoperationPhaseArray[0]['event'] = '<div class="creation-node">
                            <div class="node-circle node-white-circle node-white-circle">N</div>
                            <div class="col-text"><span class="creation"></span> 
                            <span class="col-node-text custom-node">Creation</span></div></div>';
        $logicoperationPhaseArray[0]['role'] = '<div class="blank-div segment-node"></div>';

        $logicoperationPhaseArray[0]['system'] = '<div class="blank-div segment-node"></div>';



        /* second row data here */
        $logicoperationPhaseArray[1]['operation1'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[1]['event_operation'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[1]['operation2'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[1]['event'] = '<div class ="blank-div segment-node"></div>';
        $logicoperationPhaseArray[1]['role'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[1]['system'] = '<div class="creation-node operation-tab-node">
            <div class="node-circle node-white-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">...Process</span></div>
        </div>';


        $logicoperationPhaseArray[2]['operation1'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[2]['event_operation'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        $logicoperationPhaseArray[2]['operation2'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[2]['event'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        $logicoperationPhaseArray[2]['role'] = '<div class="blank-div segment-node"></div>';
        $logicoperationPhaseArray[2]['system'] = '<div class="blank-div segment-node"></div>';

        /* 3 row data here */
        

        return $logicoperationPhaseArray;
    }
    /*end code  here*/

    /* phase common function use here */
    public function commonPhaseAction() {

        $phaseArray[0]['phase'] = '<div class="segment-node">
				<div class="node-circle node-white-circle node-white-circle">N</div>
				 <div class="col-text segment-text">
				    <span class="col-node-text">
                        <input type="text" class="custom-node undefined" placeholder="Undefined">
                    </span>
				<i class="fa fa-bars phase-segment segment"></i>
				  <div class="add-col-wrap add-segment">
					<ul aria-labelledby="dropdownMenu4" role="menu" class="dropdown-menu show-">
					  <li role="presentation"> <a class="" tabindex="-1" role="menuitem">
						<div class="node-circle node-white-circle-expanded">N</div>
						Add Segment </a>
						<ul class="sub-item">
						  
						  <li  role="presentation" class="add-above-segment"> 
						  <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Above </a> </li>
							
						  <li role="presentation" class="add-below-segment"> 
						  <a href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Below </a> </li>
						</ul>
					  </li>
					  <li class="" role="presentation"> <a  tabindex="-1" role="menuitem">
						<div class="node-circle node-white-circle-expanded">N</div>
						Move Segment </a>
						<ul class="sub-item">
						  <li class=" add-up-segment" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Up </a> </li>
						  <li class=" add-down-segment" role="presentation"> <a  href="#" tabindex="-1" role="menuitem">
							<div class="node-circle node-white-circle">N</div>
							Down </a> </li>
						</ul>
					  </li>
					  <li data-toggle="modal" data-target="#deleteSegment" class="del-segment">
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

    /*function use here to create common domain array*/
    public function eventStatusCommonAction() {

        $eventStatus[0]['eventStatus'] = '<div class="creation-node event-before e-before">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">before</span></div></div>';
        $eventStatus[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        return $eventStatus;
    }

    /*html use here to add after and completion */
    public function eventInteractionArray(){

        $roleeventStatus[0]['role'] = '<div class="creation-node " >
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node actionNode" placeholder="Interaction" >Interaction</span></div>
        </div>
        <i class="fa fa-bars  segment"></i>
        <div class="add-col-wrap  add-status nodeflyOut">
            <ul class="dropdown-menu show-5" role="menu" aria-labelledby="dropdownMenu4">
                <li role="presentation" class="no-bg">
                    <a role="menuitem" tabindex="-1" class="nodeFlyout" data-toggle="modal" data-target="#nodeFlyout" data-direction="right">
                        <div class="node-circle node-white-circle-expanded">N</div>
                       View Class 
                    </a>
                </li>
             </ul>
        </div>';
        return $roleeventStatus;
    }

    public function destructorArray(){

        $destructor[0]['destructor'] = '<div class="creation-node">
                                    <div class="node-circle node-white-circle node-white-circle">N</div>
                                    <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                    </div>';
        return $destructor;
     }



     /*function use here to add after and completion both event*/

    public function eventAfterCompletionAction() {

        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';

        $eventStatus[1]['eventStatus'] = '<div class="creation-node event-before e-after">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">after</span></div></div>';
        $eventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[3]['eventStatus'] = '<div class="creation-node event-before e-completion">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">compl</span></div></div>';
                   
        return $eventStatus;
    }

    public function eventAfterStatusCommonAction() {

        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[1]['eventStatus'] = '<div class="creation-node event-before e-after">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">after</span></div></div>';
        $eventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        
        return $eventStatus;
    }

    public function eventcompletionAfterStatusCommonAction() {
        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[2]['eventStatus'] = '<div class="creation-node event-before e-completion">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">compl</span></div></div>';
        return $eventStatus;
    }

    /*code use here to add completion and desctructor both here*/
    public function eventCompletiondestructiveCommonAction() {
        
        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[1]['eventStatus'] = '<div class="creation-node event-before e-completion">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">compl</span></div></div>';
        $eventStatus[3]['eventStatus'] = '<div class="creation-node event-before e-destructive">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">destruct</span></div></div>';
        return $eventStatus;
    }

    public function eventAfterdestructiveCommonAction() {
        
        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[1]['eventStatus'] = '<div class="creation-node event-before e-after">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">after</span></div></div>';
        $eventStatus[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[3]['eventStatus'] = '<div class="creation-node event-before e-destructive">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">destruct</span></div></div>';

        return $eventStatus;
    }

    public function eventdestructiveAfterStatusCommonAction() {
        $eventStatus[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
        $eventStatus[2]['eventStatus'] = '<div class="creation-node event-before e-destructive">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">Undefined</span></div></div>';
        return $eventStatus;
    }

    public function domainCommonAction(){
        $domainArray[0]['domain'] = '<div class="blank-div segment-node domainclass"></div>';
        $domainArray[1]['domain'] = '<div class="creation-node" >
        <div class="node-circle node-white-circle node-white-circle" >N</div>
        <div class="col-text operation-text"><span class="col-node-text custom-node">Logic</span></div></div>';
        $domainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
        return $domainArray;
    }

    public function domainlogicCommonAction(){
        $domainArray[0]['domain'] = '<div class="blank-div segment-node domainclass"></div>';
        $domainArray[1]['domain'] = '<div class="creation-node " >
        <div class="node-circle node-white-circle node-white-circle" >N</div>
        <div class="col-text operation-text"><span class="col-node-text custom-node">Logic</span></div></div>';
        $domainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[3]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[4]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[5]['domain'] = '<div class="blank-div segment-node"></div>';
        return $domainArray;
    }

    public function domainlogicCommonDomainAction(){
        $domainArray[0]['domain'] = '<div class="blank-div segment-node domainclass"></div>';
        $domainArray[1]['domain'] = '<div class="new-Domain blank-role"><i class="fa fa-plus"></i></div>';
        $domainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[3]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[4]['domain'] = '<div class="blank-div segment-node"></div>';
        $domainArray[5]['domain'] = '<div class="blank-div segment-node"></div>';
        return $domainArray;
    }
    /*end code here*/

    /*function here to use add blank event status col*/

    public function blankeventStatusCommonAction(){
            
            $eventStatusArray[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[3]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[4]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[5]['eventStatus'] = '<div class="blank-div segment-node"></div>';

            return $eventStatusArray;
    }

    public function blanklogicStatusCommonAction(){
            
            $eventStatusArray[0]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[1]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            $eventStatusArray[2]['eventStatus'] = '<div class="blank-div segment-node"></div>';
            
            return $eventStatusArray;
    }
    /*end code here*/

    /*function use here to create common domain array*/
    public function blankdomainCommonAction(){
        
        $blankdomainArray[0]['domain'] = '<div class="blank-div segment-node"></div>';
        $blankdomainArray[1]['domain'] = '<div class="blank-div segment-node"></div>';
        $blankdomainArray[2]['domain'] = '<div class="blank-div segment-node"></div>';
        $blankdomainArray[3]['domain'] = '<div class="blank-div segment-node"></div>';
        $blankdomainArray[4]['domain'] = '<div class="blank-div segment-node"></div>';
        $blankdomainArray[5]['domain'] = '<div class="blank-div segment-node"></div>';

        return $blankdomainArray;
    }
    /*end code here*/

    /*function use here to create common domain array*/
    public function blanksubOperationCommonAction(){
        
        $blanksubOperation[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        $blanksubOperation[1]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[1]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[2]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[2]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[3]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[3]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[4]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[4]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[5]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[5]['sub_event_operation'] = '<div class="creation-node">
                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                </div>';

        return $blanksubOperation;
    }

    public function blankLogicsubOperationCommonAction(){
        
        $blanksubOperation[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        $blanksubOperation[1]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[1]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[2]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[2]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        return $blanksubOperation;
    }

    /*function use here to create common domain array*/
    public function blankNonLogicsubOperationCommonAction(){
        
        $blanksubOperation[0]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[0]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';
        
        $blanksubOperation[1]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[1]['sub_event_operation'] = '<div class="blank-div segment-node"></div>';

        $blanksubOperation[2]['sub_operation1'] = '<div class="blank-div segment-node"></div>';
        $blanksubOperation[2]['sub_event_operation'] = '<div class="creation-node">
                                <div class="node-circle node-white-circle node-white-circle">N</div>
                                <div class="col-text"><span class="destructure"></span> <span class="col-node-text custom-node">Destruction</span></div>
                                </div>';

        return $blanksubOperation;
    }
    /*end code here*/



    /* function use here for display role series */
    public function commonlogicArrayAction() {

        $domain_series[0]['domain_series'] = '<div class="blank-div segment-node"></div>';
        $domain_series[1]['domain_series'] = '<div class="blank-div segment-node"></div>';
        $domain_series[2]['domain_series'] = '<div class="blank-div segment-node"></div>';
        $domain_series[3]['domain_series'] = '<div class="blank-div segment-node"></div>';
        $domain_series[4]['domain_series'] = '<div class="blank-div segment-node"></div>';
        $domain_series[5]['domain_series'] = '<div class="blank-div segment-node"></div>';
        return $domain_series;
    }

    /* function use here for display role series */
    public function commonRoleAction() {

        $RoleArray[0]['role_series'] = '<div class="blank-div segment-node"></div>';
        $RoleArray[1]['role_series'] = '<div class="blank-div segment-node"></div>';
        $RoleArray[2]['role_series'] = '<div class="blank-div segment-node"></div>';
        $RoleArray[3]['role_series'] = '<div class="blank-div segment-node"></div>';
        $RoleArray[4]['role_series'] = '<div class="new-Role blank-role"><i class="fa fa-plus"></i></div>
                                        <div class="creation-node ">
            <div class="node-circle node-white-circle">N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node" placeholder="Undefined" >Undefined</span></div>
        </div>';
        $RoleArray[5]['role_series'] = '<div class="blank-div segment-node"></div>';
        return $RoleArray;
    }
    /* end function here */
    
    /*operation node code start here*/
    public function commonNodeAction() {

        $NodeArray[0]['role'] = '<div class="blank-div segment-node"></div>';
        $NodeArray[1]['role'] = '<div class="blank-div segment-node"></div>';
        $NodeArray[2]['role'] = '<div class="blank-div segment-node"></div>';
        $NodeArray[3]['role'] = '<div class="blank-div segment-node"></div>';
        $NodeArray[4]['role'] = '<div class="creation-node nodeFlyout" data-toggle="modal" data-target="#renamePopup" data-direction="right">
            <div class="node-circle node-white-circle node-white-circle" >N</div>
            <div class="col-text operation-text"><span class="col-node-text custom-node">Nodes</span></div>
        </div>';
        
        $NodeArray[5]['role'] = '<div class="blank-div segment-node"></div>';
       
        return $NodeArray;
    }
    
    /*end code here*/
    public function deletePhaseAction() {
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

    public function classAction() {
        error_reporting(0);

        return new ViewModel(array());
    }

    /**
     *  Add Segment by this Function
     */
    public function moveSegmentAction() {
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

                //echo "rowStart = $rowStart, rowEnd = $rowEnd, preRowStart = $preRowStart, preRowEnd = $preRowEnd";

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

        return new ViewModel(array('phaseArray' => $operationPhaseArray, 'tableDataArray' => $tableDataArray, 'currentRowIndex' => $currentRowIndex, 'currentColumnIndex' => $currentColumnIndex));
    }
}

