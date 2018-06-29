<?php
namespace Administrator\Controller;

use Api\Controller\Plugin\PUSession;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Api\Controller\Plugin\PUCipher;

class ProductsController extends AbstractActionController
{

	protected $administratorTable;
    protected $classesTable;
	protected $structureBuilderTable;
    protected $storageType =STORAGE_NAME;

    public function onDispatch(\Zend\Mvc\MvcEvent $e)
    {
        if (isset($_COOKIE[PREFIX . 'uniqueId1']) && !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
            $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
            $cipherObj                = new PUCipher();
            $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
            $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);

            $sessObj  = new PUSession($decryptedHashedUserEmail);
            $sessData = $sessObj->read('');
            // DECODE SESSION FILE DATA
            session_decode($sessData);
        }
        if (!$_SESSION[PREFIX . 'user_info']) {
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

    /**
     * Fetch All published Course
     * @param array $userInfo
     * @return view
     */
    public function indexAction()
    {
        // check if user session exists
        if (isset($_COOKIE[PREFIX . 'uniqueId1']) && !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
            $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
            $cipherObj                = new PUCipher();
            $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
            $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);

            $sessObj  = new PUSession($decryptedHashedUserEmail);
            $sessData = $sessObj->read('');
            // DECODE SESSION FILE DATA
            session_decode($sessData);
        }

        $this->layout()->setTemplate('layout/layout_new');
        $this->layout()->setVariable('store_list', json_encode(array()));
        $this->layout()->setVariable('course_list', json_encode(array()));
        $this->layout()->setVariable('form_fields', SIGNUP_FORM_DATA);
        $this->layout()->setVariable('view_type', '');
        $this->layout()->setVariable('page_name', 'products');
        $this->layout()->setVariable('expiration_msg', json_encode(array()));
    }
}
