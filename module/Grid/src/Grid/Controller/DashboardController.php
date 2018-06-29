<?php
namespace Grid\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class DashboardController extends AbstractActionController {

    protected $dashboardTable;

    public function __construct()
    {
        $this->container = new container('auth');
    }

    public function getDashboardTable()
    {
        if (!$this->dashboardTable) {
            $sm = $this->getServiceLocator();
            $this->dashboardTable = $sm->get('Grid\Model\DashboardTable');
        }
        return $this->dashboardTable;
    }

    /**
     *  Display the grid structure for first time or display the add phase popup content.
     */
    public function indexAction() 
    {
        error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/popup');
        
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        return new ViewModel(array('post' => $post));
    }

    /**
        * Purpose: fetch all production_cb class instance with productionId and class_node_id
        * @param null
        * @return json array
    */
    public function getCourseBuilderClassesAction()
    {
        $layout                     =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        $tempArr                        =   array();
        if($request->isPost())
        {
            $post                       =   $request->getPost()->toArray();
            if($post['isCall'] == 'Y')
            {
                $tempArr                =   $this->getDashboardTable()->getCourseBuilderClasses($post);
            }
        }

        print json_encode(array('list' => $tempArr));
        exit;
    }

    /**
        * Purpose: fetch all production_cb class instance with productionId and class_node_id
        * @param null
        * @return json array
    */
    public function activeRolesFromProductionAction()
    {
        $layout                             =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                            =   $this->getRequest();
        $roleArray                          =   array();
        $post                               =   array();
        if($request->isPost())
        {
            $post                           =   $request->getPost()->toArray();
            if($post['productionId'] != '')
            {
                $roleArray                  =   $this->getDashboardTable()->activeRolesFromProduction($post);
            }

            $post['role_list']              = $roleArray[0];
            $post['initiator']              = $roleArray[1];
        }
        
        print json_encode($post);
        exit;
    }

    /**
     * Purpose: Function to return production listing
     * @param null
     * @return type json
     */
    public function productionListAction()
    {
        $layout                      =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                     =   $this->getRequest();
        $productionList              = array();
        if($request->isPost())
        {
            $post                    =   $request->getPost()->toArray();
            $productionList          =   $this->getDashboardTable()->getProductionListOfCourse($post);
            
            /*
             * Modified By: Divya Rajput
             * ON Date: 30-08-2017
             * Production details required when production_node_id is set
             */
            if(isset($post['nodtification_node_id']) && trim($post['nodtification_node_id']) != ''){
                $nodtification_node_id = trim($post['nodtification_node_id']);
                $nodtification_instance_id = $this->getDashboardTable()->getClassesTable()->getInstanceId('node-instance', 'node_id', $nodtification_node_id);
                $this->getDashboardTable()->getClassesTable()->updateNotificationStatus('', $nodtification_instance_id);
            }

            if(isset($post['production_node_id']) && $post['production_node_id'] != ''){
                $post['status'] = 'P';
                $productionListArr['production_list'] = (object) $productionList;
                $productionListArr['production_detail'] = $this->getProductionTemplateData($post);
                print json_encode($productionListArr);
                exit;
            }
        }
        print json_encode($productionList,JSON_FORCE_OBJECT);
        exit;
    }

    /**
     * Purpose: For Course Production Edit And View
     * @param null
     * @return type json
     */
    public function editCourseAction()
    {
        $layout                                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                        =   $this->getRequest();
        $course                                         =   array();
        if($request->isPost())
        {
            $post                                       =   $request->getPost()->toArray();
            $course                                     =   $this->getDashboardTable()->getCourse($post);
            $course['course_status']                    =   $post['status'];
        }
        print json_encode($course,JSON_FORCE_OBJECT);
        exit;
    }

    /**
     * Purpose: For Get Production Template
     * @param null
     * @return type json
     */
    public function getProductionTemplateAction()
    {
        $layout                                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                        =   $this->getRequest();
        $course                                         =   array();
        if($request->isPost())
        {
            $post                                       =   $request->getPost()->toArray();
            $course                                     =   $this->getProductionTemplateData($post);
        }
        print json_encode($course);
        exit;
    }

    /**
     * Purpose: For Production Instance Save
     * @param null
     * @return type json
     */
    public function saveProductionTemplateAction()
    {
        $layout                                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                        =   $this->getRequest();
        $returnArray                                    =   array();
        if($request->isPost())
        {
            $post                                       =   $request->getPost()->toArray();
            $returnArray                                =   $this->getDashboardTable()->saveProductionTemplate($post);

            if(isset($returnArray['notification']['email']))
            {
                $params                     = array();
                $params['template']         = 'notification';
                $params['from']             = ADMIN_CONFIG['email'];//'root@localhost.com';
                $params['subject']          = $returnArray['notification']['email']['subject'];
                $params['email']            = $returnArray['notification']['email']['to'];//'root@localhost.com';
                $params['userName']         = $returnArray['notification']['email']['userName'];
                $params['body']             = $returnArray['notification']['email']['body'];
               
                $mailObj                    = $this->PUMailer();
                $mailResult                 = $mailObj->notificatonMail($params);

                //unset($returnArray['notification']['email']);
            }
        }
        print json_encode($returnArray);
        exit;
    }
    
    /*
     * Modified By: Divya Rajput
     * Date: 30-Aug-2017
     * make common function to call production Details from other function
     */
    private function getProductionTemplateData($post){
        $course                                     =   $this->getDashboardTable()->getCourse($post);
        $course['course_status']                    =   $post['status'];
        $course_details                             =   $course['course_details'];

        foreach($course_details['all_users'] as $key => $value)
        {
            if(array_key_exists('profile_image', $value))
            {
                $course_details['all_users'][$key]['profile_image'] = BASE_URL.'public/nodeZimg/'.$course_details['all_users'][$key]['profile_image'];
            }
        }

        // Fetch production cb instance value
        $productionTempArray                                        = $this->getDashboardTable()->fetchInstanceWithProperty(current(current($course)['production'])['template_id']);
        $productionArray                                            = array();
        foreach($productionTempArray as $key1 => $value1)
        {
            if(strtolower($value1['caption']) == 'production type')
                $value1['caption']                                  = 'type';

            $productionArray[strtolower($value1['caption'])]        = $value1['value'];
        }

        /* New Code For Marc Feedback*/
        $productionDataList                         =   '';
        if(count($course['productionDataList']) > 0)
        $productionDataList = current($course['productionDataList']);

        if($post['status'] == 'P')
        {
            $post['production_data_node_id']            =   $productionDataList;
            $course                                     =   array();
            $sendDetailArray                            =   $this->getDashboardTable()->getProductionTemplate($post);

            $course['production_details_user']          =   $sendDetailArray['courseProductionArray']['production_details_user'];
            $course['production_details_node_id']       =   $sendDetailArray['courseProductionArray']['production_details_node_id'];
            $course['permission']                       =   $sendDetailArray['permissionProductionArray']['permission'];
            $course['operationKey']                     =   $sendDetailArray['permissionProductionArray']['operationKey'];
            $course['instance_id']                      =   $sendDetailArray['permissionProductionArray']['instance_id'];
            $course['production_data_node_id']          =   $sendDetailArray['permissionProductionArray']['production_data_node_id'];
            $course['formJson']                         =   $sendDetailArray['formJson'];
            $course['course_status']                    =   $post['status'];
            $course['course_details']                   =   $course_details;
            // set workflow from production cb instance
            $course['workflow']                         =   html_entity_decode($productionArray['workflow']);
            // set production template name from production cb instance
            $course['production_template_name']         =   html_entity_decode($productionArray['title']);
            if($post['production_data_node_id'] != '')
            {
                $variables                              =   json_decode($sendDetailArray['permissionProductionArray']['variables'],true);
                foreach($variables as $k => $v)
                {
                    if($v['hidden'] == 'true')
                        $variables[$k]['hidden'] = 1;
                    else
                        $variables[$k]['hidden'] = '';
                }
                $course['formJson']['variables']        =   $variables;
            }
        }
        return $course;
    }
}


