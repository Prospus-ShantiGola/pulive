<?php
namespace Grid\Controller;
use Administrator\Controller\ClassesController;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class CoursesController extends AbstractActionController
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
		$layout->setTemplate('layout/popup');

		$request = $this->getRequest();
		$post = array();
		if ($request->isPost()) {
		$post = $request->getPost()->toArray();
		}
		return new ViewModel(array('post' => $post));
	}

	public function getAllCourseAction()
    {
        $layout                         =   $this->layout();
        $layout->setTemplate('layout/simple');
        $request                        =   $this->getRequest();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();

            $config                     = $this->getServiceLocator()->get('config');
            $product_type_class_id 		= $config['constants']['PRODUCT_TYPE_ID'];
            $product_title_class_id     = $config['constants']['PRODUCT_TITLE_ID'];

            $result = $this->getGridTable()->getCoursesList($product_type_class_id,$product_title_class_id);

            echo json_encode($result);
        }
        exit;
    }

	 

	
} 
