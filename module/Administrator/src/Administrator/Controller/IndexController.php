<?php
namespace Administrator\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;
use Zend\Session\SessionManager;

class IndexController extends AbstractActionController
{
	protected $administratorTable;
    protected $classesTable;
	protected $structureBuilderTable;
    protected $storageType =STORAGE_NAME;

    /*
     * Created By: Amit Malakar
     * Date: 26-Jul-17
     * Function to redirect to Login page if user not logged in
     */
    public function onDispatch(\Zend\Mvc\MvcEvent $e)
    {
        if(!$_SESSION[PREFIX.'user_info']) {
            return $this->redirect()->toRoute('store');     // route to login if Guest
        }
        return parent::onDispatch($e);
    }

    public function getAdministratorTable()
    {
		if (!$this->administratorTable) {
            $sm = $this->getServiceLocator();
			$this->administratorTable = $sm->get('Administrator\Model\AdministratorTable');
        }
        return $this->administratorTable;
    }

    public function getClassesTable()
    {
        if (!$this->classesTable) {
            $sm = $this->getServiceLocator();
            $this->classesTable = $sm->get('Administrator\Model\ClassesTable');
        }
        return $this->classesTable;
    }

	public function getStructureBuilderTable()
    {
        if (!$this->structureBuilderTable) {
            $sm = $this->getServiceLocator();
            $this->structureBuilderTable = $sm->get('Administrator\Model\StructureBuilderTable');
        }
        return $this->structureBuilderTable;
    }

    public function indexAction()
    {	
		$user_info  = $_SESSION[PREFIX.'user_info'];
		if(empty($user_info))
		{
			$this->redirect()->toRoute('home', array(
				'controller' => 'login',
				'action' =>  'index'		   
			));
		}
		else
		{
			if(trim($user_info['common_name']) == 'VesselWise.SalesRepresentative')
			{
				$this->redirect()->toRoute('index', array(
					'controller' => 'index',
					'action' =>  'subscription'		   
				));

				return new ViewModel();
			}
			else
			{
				return new ViewModel();
			}
		}
    }

    public function loaderAction()
    {
    	$layout                         = $this->layout();
        $layout->setTemplate('layout/layout-loader');
        
        return new ViewModel();
    }

    public function subscriptionAction()
    {
    	$layout                                    =	$this->layout();
        $layout->setTemplate('layout/layout-login-vw');

        $manager = $this->getServiceLocator()->get('MemorySharedManager');
        $manager->setStorage($this->storageType);

        $user_info                                  =   $_SESSION[PREFIX.'user_info'];

        $request                                    =   $this->getRequest();
        $userArray                                  =   array();
        $msg                                        =   '';
        if ($request->isPost())
        { 
            $postArray                              =   $request->getPost()->toArray();
            $node_class_id                          =   $postArray['node_class_id'];
            $instance_property_id_array             =   $postArray['instance_property_id'];
            $instance_property_name_array           =   $postArray['instance_property_name'];
            $instance_property_caption_array        =   $postArray['instance_property_caption'];

            $senddataArray                          =   array();
            foreach($instance_property_name_array as $index => $key)
            {
                $senddataArray[$key]                =   $instance_property_caption_array[$index];
            }
                
            $senddataArray['pui_id']                =   $user_info['node_id'];
            $options                                =   http_build_query($senddataArray);
            $return                                 =   $this->callWebApiPost($options);
            $returnVessel                           =   json_decode($return);

            if($returnVessel == 'success')
            {
                $instanceArray                      =   $this->getStructureBuilderTable()->createInstanceOfClass($node_class_id,1);

                if(intval($instanceArray['node_instance_id']) > 0)
                {
                $this->getStructureBuilderTable()->createInstanceProperty($instance_property_id_array,$instance_property_caption_array,$instanceArray['node_instance_id'],$instanceArray['node_type_id'],'N');
                }

                $node_y_id                          =   $instanceArray['node_id'];
                $msg                                =   'A mail has been sent to the registered email with a link to validate the account. Please follow the steps provided in the email to login and complete the industry profile to activate the account. If the email is not received please check the junk box and add our domain to the whitelist.';
            }
            else
            {
                $msg                                =   'Unable to connect to VesselWise server. Please try again after sometime. If the problem persists, contact us at support@vesselwise.com.';
            }

        }

        $file_name                                  =   'subscription_vessel';
        $cachedData                                 =   $manager->read($file_name); 
        if($cachedData != "")
        {
            $classArray                             =   $cachedData;
        }
        else
        {
            $classArray                             =   $this->getStructureBuilderTable()->getAllDataOfClass(212087,'Y');
            $manager->write($file_name, $classArray);
        }
        return new ViewModel(array('classArray' => $classArray, 'msg' => $msg));
    }

    public function subscriptionEmailAction()
    {
        $layout                                 = $this->layout();
        $layout->setTemplate('layout/simple');  
        $request                                = $this->getRequest(); 
        $return                                 = ''; 
        if ($request->isPost())
        { 
            $post                               = $request->getPost()->toArray();
            $return                             = $this->callWebApi($post);
        }  
        $json['result']                         = json_decode($return);
        print json_encode($json);     
        exit;   
    }

    public function callWebApi($postvars)
    {
        $url                = 'https://vesselwise.com/pui/data-get.php?task=check-email&email='.$postvars['email'];
        ini_set('safe_mode', 'off');
        $ch                 = curl_init(); 
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_POST,0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
        curl_setopt($ch,CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        $http_status        = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if($http_status!=200){
          $response = "Error -- -- $http_status";
        }
        curl_close ($ch);

        return $response;
    }

    public function callWebApiPost($postvars)
    {
        $url                = 'https://vesselwise.com/pui/data-get.php?task=subscription-form-data&'.$postvars;
        ini_set('safe_mode', 'off');
        $ch                 = curl_init(); 
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_POST,0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
        curl_setopt($ch,CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        $http_status        = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if($http_status!=200){
          $response = "Error -- -- $http_status";
        }
        curl_close ($ch);

        return $response;
    }
}


