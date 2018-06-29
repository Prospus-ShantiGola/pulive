<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class WorkflowController extends AbstractActionController
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
    public function ajaxhandlerAction() {

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
}

