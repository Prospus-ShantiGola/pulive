<?php
namespace Grid\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;
use Imapemail\imap;

class EmailController extends AbstractActionController {

    protected $emailTable;
    public $imap; 
    public function __construct()
    {
        $this->container = new container('auth');
    }
    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To include email model into our controller
    */
    public function getEmailTable()
    {
        if (!$this->emailTable) {
            $sm = $this->getServiceLocator();
            $this->emailTable = $sm->get('Grid\Model\EmailTable');
        }
        return $this->emailTable;
    }
    
//    public function createImapObject()
//    {
//        $authhost = "{imap.gmail.com:993/imap/ssl}INBOX";
//        $email = "kunalprospus@gmail.com";
//        $emailPassword = "Prospus1";
//        return $imap = new imap($authhost, $email, $emailPassword);
//    }
    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To get list of all emails
    */
    public function indexAction() {
        //error_reporting(E_ALL);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $user_info = $_SESSION[PREFIX . 'user_info'];
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        $post['email_setting_node_id'] = EMAIL_SETTING_STATIC_ID;
        $emailList = $this->getEmailTable()->getEmailList($post['email_setting_node_id']);
        if(count($emailList)==0)
        {
            $this->getEmailTable()->runSync($post);
            //$this->sync($post['email_setting_node_id']);
            $emailList = $this->getEmailTable()->getEmailList($post['email_setting_node_id']);
        }
            //print_r($emailList);die;
            $htmlmsg = $this->getEmailTable()->getEmailDetails($emailList[0]['email_node_id']);
        return new ViewModel(array('post' => $emailList, 'htmlmsg' => html_entity_decode($htmlmsg['htmlmsg']),'plainmsg' => html_entity_decode($htmlmsg['plainmsg'])));
    }
    
    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To sync with email account
    */
    public function syncAction($email_setting_node_id) {
        //error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $user_info = $_SESSION[PREFIX . 'user_info'];
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        if($email_setting_node_id)
            $post['email_setting_node_id'] = $email_setting_node_id;
        else
            $post['email_setting_node_id'] = EMAIL_SETTING_STATIC_ID;
        $k = $this->getEmailTable()->runSync($post);
        return $k;die;
        
        //print_r($htmlmsg);die;
        //return new ViewModel(array('post' => $emailList,'htmlmsg'=>$htmlmsg));
    }

    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To get email detail
    */
    public function detailAction() {
        //error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');
        $user_info = $_SESSION[PREFIX . 'user_info'];
        $request = $this->getRequest();
        $post = array();
        if ($request->isPost()) {
            $post = $request->getPost()->toArray();
        }
        $htmlmsg = $this->getEmailTable()->getEmailDetails($_REQUEST['email_node_id']);
        //print_r($htmlmsg);die;
        if($htmlmsg['htmlmsg'])
        {
            print_r(html_entity_decode($htmlmsg['htmlmsg']));die;
        }else{
            print_r(html_entity_decode($htmlmsg['plainmsg']));die;
        }
        exit;
    }
    
    /*
     * Created By:   Kunal Kumar
     * Date:        16-June-2017
     * Purpose:     To get all email in left submenu 
    */
    public function submenuAction() {
        //error_reporting(0);
        $layout = $this->layout();
        $layout->setTemplate('layout/simple');

        $request = $this->getRequest();
        $post = array();
        if($request->isPost())
        {
            $post                    =   $request->getPost()->toArray();
            
        }
        //print_r($_REQUEST);die;
        $emailAccountList          =   $this->getEmailTable()->getEmailAccountsList($_REQUEST['setUserID']);
        return new ViewModel(array('emailAccountList' => $emailAccountList));
        //print_r($emailAccountList);die;
//        print json_encode($emailList,JSON_FORCE_OBJECT);
//        exit;
    }
}

