<?php
namespace Grid\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class AccountsController extends AbstractActionController
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
			$sm			=	$this->getServiceLocator();
			$this->gridTable 	=	$sm->get('Grid\Model\GridTable');
		}
		return $this->gridTable;
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
        }
        return new ViewModel(array('post' => $post));
	}
        
    /**
     * Add Seller/Buyer
     */
	public function addSellerAction()
    {
        error_reporting(0);
        ini_set('max_input_vars', 10000);
        $layout                                                     = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                                    = $this->getRequest();
        $post                                                       = array();
        $tableArraybody1                                            = array();
        $tableArrayhead1                                            = array();
        $tableArrayhead                                             = array();
        $tableArraybody                                             = array();
        
        if ($request->isPost()) {
            $post                                                   = $request->getPost()->toArray();
            $tableArrayhead                                         = $post['datathead'];
            $tableArraybody                                         = $post['datatbody'];
            $myRow                                                  = $post['myRow'];
            $myCol                                                  = $post['myCol'];
            $nodeType                                               = $post['nodeType'];
            
            foreach ($tableArrayhead as $key => $value) {
                $temp                                                = explode('@', $value);
                $tableArrayhead1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArrayhead1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArrayhead1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArrayhead1[$temp[0]][$temp[1]]['data-section'] = $temp[5];                    
            }

            foreach ($tableArraybody as $key => $value) {
                $temp                                                = explode('@', $value);
                $tableArraybody1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArraybody1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArraybody1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArraybody1[$temp[0]][$temp[1]]['chkDebit']     = $temp[5];               
            }            
        }
        return new ViewModel(array('tableArraybody' => $tableArraybody1, 'tableArrayhead' => $tableArrayhead1, 'myRow' => $myRow, 'myCol' => $myCol,'nodeType' => $nodeType ));
    }
        
    /**
     * Add Seller/Buyer
     */
	public function addSellerBuyerAction()
    {
        error_reporting(0);
        ini_set('max_input_vars', 10000);
        $layout                                                     = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                                    = $this->getRequest();
        $post                                                       = array();
        $tableArraybody1                                            = array();
        $tableArrayhead1                                            = array();
        
        if ($request->isPost()) {
            $post                                                   = $request->getPost()->toArray();
            $tableArrayhead                                         = $post['datathead'];
            $tableArraybody                                         = $post['datatbody'];
            $myRow                                                  = $post['myRow'];
            $myCol                                                  = $post['myCol'];
            
            foreach ($tableArrayhead as $key => $value) {
                $temp                                               = explode('@', $value);
                $tableArrayhead1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArrayhead1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArrayhead1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArrayhead1[$temp[0]][$temp[1]]['data-section'] = $temp[5];                    
            }

            foreach ($tableArraybody as $key => $value) {
                $temp                                               = explode('@', $value);
                $tableArraybody1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArraybody1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArraybody1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArraybody1[$temp[0]][$temp[1]]['chkDebit']     = $temp[5];               
            }            
        }
        return new ViewModel(array('tableArraybody' => $tableArraybody1, 'tableArrayhead' => $tableArrayhead1, 'myRow' => $myRow, 'myCol' => $myCol ));
    }
    
    /**
     * Add authority/seller/buyer Node
     */
	public function addNodeAction()
    {
        error_reporting(0);
        ini_set('max_input_vars', 10000);
        $layout                                                     = $this->layout();
        $layout->setTemplate('layout/simple');
        $request                                                    = $this->getRequest();
        $post                                                       = array();
        $tableArraybody1                                            = array();
        $tableArrayhead1                                            = array();
        
        if ($request->isPost()) {
            $post                                                   = $request->getPost()->toArray();
            $tableArrayhead                                         = $post['datathead'];
            $tableArraybody                                         = $post['datatbody'];
            $myRow                                                  = $post['myRow'];
            $myCol                                                  = $post['myCol'];
            $nodeType                                               = $post['nodeType'];
            
            foreach ($tableArrayhead as $key => $value) {
                $temp                                                = explode('@', $value);
                $tableArrayhead1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArrayhead1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArrayhead1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArrayhead1[$temp[0]][$temp[1]]['data-section'] = $temp[5];                    
            }

            foreach ($tableArraybody as $key => $value) {
                $temp                                                = explode('@', $value);
                $tableArraybody1[$temp[0]][$temp[1]]['trClass']      = $temp[2];
                $tableArraybody1[$temp[0]][$temp[1]]['tdClass']      = $temp[3];
                $tableArraybody1[$temp[0]][$temp[1]]['data']         = $temp[4];
                $tableArraybody1[$temp[0]][$temp[1]]['chkDebit']     = $temp[5];               
            }            
        }
        return new ViewModel(array('tableArraybody' => $tableArraybody1, 'tableArrayhead' => $tableArrayhead1, 'myRow' => $myRow, 'myCol' => $myCol, 'nodeType' => $nodeType ));
    }
}