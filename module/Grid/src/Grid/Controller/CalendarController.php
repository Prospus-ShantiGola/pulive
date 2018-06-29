<?php
namespace Grid\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class CalendarController extends AbstractActionController {

    protected $gridTable;
    protected $view;

    public function __construct()
    {
        $this->container = new container('auth');
    }

    /**
     *  Display the grid structure for first time or display the add phase popup content.
     */
    public function indexAction() {
        //error_reporting(0);
        $layout = $this->layout();
        if(!$this->getRequest()->isXmlHttpRequest()){
            $layout->setTemplate('layout/layout');
        }else{
            $layout->setTemplate('layout/simple');
            //$is_main_layout = 'N';
        }

        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        return new ViewModel();
    }
}

