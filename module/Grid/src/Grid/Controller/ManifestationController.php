<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class ManifestationController extends AbstractActionController
{ 
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
	
	/**
	*  Add Phase Structure on Right Side by this Function
	*/
	public function createManifestAction()
	{
		error_reporting(0);
		$layout					=	$this->layout();
		$layout->setTemplate('layout/simple');
		
		$request 				= $this->getRequest();
        $post 					= array();
		
		return new ViewModel(array('post' => $post));
	}

	

	
	
} 
