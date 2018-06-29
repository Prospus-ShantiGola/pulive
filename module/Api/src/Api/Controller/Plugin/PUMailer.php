<?php

/**
 * Created by Gaurav Dutt Panchal
 * User: gaurav
 * Date: 16/08/17
 * Time: 4:04 PM
 */

namespace Api\Controller\Plugin;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\View\Model\ViewModel;

class PUMailer extends AbstractPlugin implements ServiceLocatorAwareInterface {

    /**
     * Created By: Amit Malakar
     * Date: 17-Aug-17
     * Retrieve service manager instance
     * @return ServiceLocator
     */
    public $sendToLocalMachine =  false;
    public function getServiceLocator() {
        return $this->serviceLocator->getServiceLocator();
    }
    /**
     * Created By: Amit Malakar
     * Date: 17-Aug-17
     * Set service locator
     * @param ServiceLocatorInterface $serviceLocator
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    /**
     * Created By: Amit Malakar
     * Date: 17-Aug-17
     * Get ACMailer service
     * @return mixed
     */
    public function getACMailer() {
        return $serviceManager = $this->getServiceLocator()->get('acmailer.mailservice.default');
    }

    /*Add function for send mail
     * Created by Gaurav
     * Added on 17 Aug 2017
     * **/
    public function chatEmailing($params) {
        error_reporting(E_ALL);

        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        $template      = $params['template'];
        $fromEmail     = $params['from'];
        $subject       = $params['subject'];
        $result        = 'add new guest case';

        foreach ($params['toUserList'] as $data) {
            if($data['accountStatus']!='guest'){
                if($this->sendToLocalMachine){
                    $toEmail               = 'root@localhost.com';
                }else{
                    $toEmail               = isset($data['email'])? $data['email'] : '';
                }

                $params['toFirstName'] = isset($data['firstName'])? $data['firstName'] : '';
                $params['toRoleName']  = isset($data['role'])? $data['role'] : '';
                $params['toActorID']   = isset($data['actorID'])? $data['actorID'] : '';
                $params['toEmail']     = isset($data['email'])? $data['email'] : '';
                
                $cipherObj = new PUCipher();
                if(isset($params['dialogueId'])){
                    $hashedUrl              = $cipherObj->puUrlParamEncrypt(array('uid'=>trim($params['toActorID']), '&cid'=>trim($params['courseId']), '&did'=>trim($params['dialogueId']), '&email'=>trim($params['toEmail'])));
                }elseif(isset($params['productionId'])){
                    $hashedUrl              = $cipherObj->puUrlParamEncrypt(array('uid'=>trim($params['toActorID']), '&cid'=>trim($params['courseId']), '&pid'=>trim($params['productionId']), '&email'=>trim($params['toEmail'])));
                    
                }
                
                 
                $params['encoded_url']  = urlencode($hashedUrl);

                // Main layout html
                $layout = new ViewModel($params);
                $layout->setTemplate('api/email_templates/' . $template);

                // Add header, footer to main layout
                $layout->addChild($header, 'header')->addChild($footer, 'footer');

                $mailService->setTemplate($layout);
                $message = $mailService->getMessage();
                $message->setSubject($subject)
                    ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
                    ->setTo($toEmail);

                $result = $mailService->send();
                if ($result->isValid()) {
                    $result = 'Message sent. Congratulations!';
                } else {
                    if ($result->hasException()) {
                        $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
                    } else {
                        $result = sprintf('An error occurred. Message: %s', $result->getMessage());
                    }
                }
               // $result .= "####". $params['encoded_url'];
            }

        }
        return $result;
    }


    public function testEmail($params) {
        error_reporting(E_ALL);
        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/send-mail');

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject('Test email from PU API')
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->addTo('prospus.amitmalakar@gmail.com')
            ->addTo('prospus.gauravpanchal@gmail.com')
            ->addTo('prospus.arvindsoni@gmail.com')
            ->addTo('umang.prospus@gmail.com')
            ->addTo('prospus.rahultomar@gmail.com');



        $result = $mailService->send();

        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        echo $result; exit;
    }

    /*Add function for send mail for user registration
     * Created by Gaurav
     * Added on 29 Aug 2017
     * **/
    public function userRegMail($params) {
        error_reporting(E_ALL);

        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        $template      = $params['template'];
        $fromEmail     = $params['from'];
        $subject       = $params['subject'];
        if($this->sendToLocalMachine){
            $toEmail       = 'root@localhost.com';
        }else{
            $toEmail       = isset($params['email'])? $params['email'] : ADMIN_CONFIG['email'];
        }
        

        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/' . $template);

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject($subject)
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->setTo($toEmail);

        $result = $mailService->send();


        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }

    /**
     * Function to send roles assign to a actor email
     * Created By: Arvind Soni
     * Date: 12-Sep-2017
     * @param $params
     * @return array
     */
    public function roleGroupAssignMail($params) {
        error_reporting(E_ALL);

        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        $template      = $params['template'];
        $fromEmail     = $params['from'];
        $subject       = $params['subject'];
        $toEmail       = $params['email'];

        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/' . $template);

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject($subject)
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->setTo($toEmail);

        $result = $mailService->send();


        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }

    /*Add function for send guest mail
     * Created by Gaurav
     * Added on 11 Sept 2017
     * **/
    public function sendGuestMail($params) {
        error_reporting(E_ALL);

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        $template      = $params['template'];
        $fromEmail     = $params['from'];
        $subject       = $params['subject'];

        foreach ($params['toUserList'] as $data) {
            if($this->sendToLocalMachine){
                $toEmail               =  'root@localhost.com';
            }else{
                $toEmail               =  isset($data['email'])? $data['email'] : '';
            }
            
            $params['toEmail']     =  isset($data['email'])? $data['email'] : '';
            $params['toActorID']   = isset($data['actorID'])? $data['actorID'] : '';

            $cipherObj = new PUCipher();

            if(isset($params['dialogueId']))
            $hashedUrl              = $cipherObj->puUrlParamEncrypt(array('uid'=>$params['toActorID'], '&cid'=>$params['courseId'], '&did'=>$params['dialogueId'], '&email'=>$params['toEmail']));
            else if(isset($params['productionId']))
            $hashedUrl              = $cipherObj->puUrlParamEncrypt(array('uid'=>$params['toActorID'], '&cid'=>$params['courseId'], '&pid'=>$params['productionId'], '&email'=>$params['toEmail']));


            $params['encoded_url']  = urlencode($hashedUrl);

            // Main layout html
            $layout = new ViewModel($params);
            $layout->setTemplate('api/email_templates/' . $template);

            // Add header, footer to main layout
            $layout->addChild($header, 'header')->addChild($footer, 'footer');

            $mailService->setTemplate($layout);
            $message = $mailService->getMessage();
            $message->setSubject($subject)
                ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
                ->setTo($toEmail);

            $result = $mailService->send();
        }

        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }
    
    /**
     * Function to send forgot password link via email
     * Created By: Amit Malakar
     * Date: 7-Sep-2017
     * @param $params
     * @return array
     */
    public function forgotPasswordMail($params)
    {
        // login url sent via email
        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu/';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        $template  = 'forgot-password';
        $fromEmail = ADMIN_EMAIL_ID;
        $subject   = 'Password reset request';
        if($this->sendToLocalMachine){
            $toEmail   = 'root@localhost.com';
        }else{
        $toEmail   = $params['to_email'];
        }


        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/' . $template);

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject($subject)
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->setTo($toEmail);

        $result = $mailService->send();

        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }

    /**
     * Function to send notification email to a actor
     * Created By: Arvind Soni
     * Date: 12-Sep-2017
     * @param $params
     * @return array
     */
    public function notificatonMail($params) {
        error_reporting(E_ALL);

        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer-notification');

        $template      = $params['template'];
        $fromEmail     = $params['from'];
        $subject       = $params['subject'];
        $toEmail       = $params['email'];

        if($this->sendToLocalMachine){
            $toEmail   = 'root@localhost.com';
        }else{
            $toEmail   = $params['email'];
        }

        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/' . $template);

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject($subject)
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->setTo($toEmail);

        $result = $mailService->send();

        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }

    /**
     * Function to send PU Reports via email
     * Created By: Amit Malakar
     * Date: 20-Sep-2017
     * @param array $params
     * @return string $result
     */
    public function puReportsMail($params)
    {
        error_reporting(E_ALL);
        // login url sent via email
        $loginURL = SOCKET_HOST_NAME;
        if ($_SERVER['HTTP_HOST'] == 'localhost') {
            $loginURL = "http://" . $_SERVER['HTTP_HOST'] . '/pu/';
        }
        $params['loginURL'] = $loginURL;

        // Get ACmailer service
        $mailService = $this->getACMailer();

        // Header html
        $header = new ViewModel();
        $header->setTemplate('api/email_templates/header');

        // Footer html
        $footer = new ViewModel();
        $footer->setTemplate('api/email_templates/footer');

        // Main layout html
        $layout = new ViewModel($params);
        $layout->setTemplate('api/email_templates/pu-reports');

        // Add header, footer to main layout
        $layout->addChild($header, 'header')->addChild($footer, 'footer');

        $mailService->setTemplate($layout);
        $message = $mailService->getMessage();
        $message->setSubject('PU Usage Progress Report on '.$params['date'])
            ->addFrom(ADMIN_CONFIG['email'], ADMIN_CONFIG['name'])
            ->addTo('mragsdale@prospus.com', 'Marc Ragsdale')
            ->addTo('animesh.sharma@prospus.com', 'Animesh Sharma')
            ->addTo('prashant.singh@prospus.com', 'Prashant Singh')
            ->addTo('kuldeep.chauhan@prospus.com', 'Kuldeep Chauhan');

        $result = $mailService->send();

        if ($result->isValid()) {
            $result = 'Message sent. Congratulations!';
        } else {
            if ($result->hasException()) {
                $result = sprintf('An error occurred. Exception: \n %s', $result->getException()->getTraceAsString());
            } else {
                $result = sprintf('An error occurred. Message: %s', $result->getMessage());
            }
        }

        return $result;
    }

}
