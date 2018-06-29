<?php
namespace Grid\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class CourseboardController extends AbstractActionController {

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
}

