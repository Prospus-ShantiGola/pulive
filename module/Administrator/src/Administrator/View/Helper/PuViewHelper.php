<?php
    /**
     * Created by Amit Malakar.
     * Date: 17-Aug-2017
     * Time: 16:36:49 PM
     */

    namespace Administrator\View\Helper;

    use Api\Controller\Plugin\PUCipher;
    use Api\Controller\Plugin\PUSession;
    use Zend\ServiceManager\ServiceLocatorAwareInterface;
    use Zend\ServiceManager\ServiceLocatorInterface;
    use Zend\View\Helper\AbstractHelper;

    class PuViewHelper extends AbstractHelper implements ServiceLocatorAwareInterface
    {
        protected $serLoc;

        /**
         * Created By: Amit Malakar
         * Date: 17-Aug-17
         * Set service locator
         * @param ServiceLocatorInterface $serviceLocator
         */
        public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
        {
            $this->serviceLocator = $serviceLocator;
            return $this;
        }

        /**
         * Created By: Amit Malakar
         * Date: 17-Aug-17
         * Retrieve service manager instance
         * @return ServiceLocator
         */
        public function getServiceLocator()
        {
            return $this->serviceLocator;
        }

        /*public function __invoke()
        {
            $this->serLoc = $this->getServiceLocator();
            // use it at will ...
        }*/

        public function getNotificationCount($login_user_id)
        {
            $this->serLoc = $this->getServiceLocator()->getServiceLocator();
            $classesObj = $this->serLoc->get('Administrator\Model\ClassesTable');
            return count($classesObj->fetchFlashNotificationData($login_user_id));
        }

        /**
         * Created By: Amit Malakar
         * Date: 28-Aug-17
         * View Helper function to provide left menu Data
         * @return JSON
         */
        public function getMenuData()
        {
            // menu ids to disable
            $disableMenuIdArr = array(61, 62);

            // get left menu data
            $this->serLoc  = $this->getServiceLocator()->getServiceLocator();
            $adminTableObj = $this->serLoc->get('Administrator\Model\AdministratorTable');
            //$menuArray     = $adminTableObj->getLeftMenu();
            $menuArray     = $adminTableObj->getLeftMenuFromClasses();

            // get logged in user id
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
            $prefixTitle = PREFIX . 'user_info';
            $userId      = isset($_SESSION[$prefixTitle]['node_id']) ? $_SESSION[$prefixTitle]['node_id'] : '';

            // get user ids of users who can see "Classes" menu item
            /*$classMenuUsers = array(
                '421934', '1466512', '393390', '391049', '1475072', '1466887', '1476187', '1631794', '2286164',
                '1628444', '1628368', '1475118', '2263848', '2289930', '1466890',
            );*/
           
            $firstHit  = 0;
            $menuIndex = 0;
            // get course menu id
            $config         = $this->getServiceLocator()->getServiceLocator()->get('config');
            $course_menu_id = $config['constants']['COURSE_NEW_COURSE_MENU'];
            // check if logged in user exists in classMenuUsers array, show classes menu
            if (!in_array($userId, CLASS_VIEW_USER_IDS)) {
                $menuArrayTemp = $menuArray;
                unset($menuArrayTemp[CLASSES_MENU_ID]);
                unset($menuArrayTemp[ORGANIZATION_MENU_ID]);
                $menuArray = $menuArrayTemp;
            }
            $hideMenuIdArr = array(BY_PROMT_MENU_ID);
            $leftMenuResult = array();

            foreach ($menuArray as $key => $menuItem) {
                $keyWS = " " . (string)$key;
                if ($menuItem['menu_id'] == $course_menu_id) {
                    continue;
                }
                $con = "";
                if (strtolower($menuItem['menu']) == 'process') {
                    $con = 'grid';
                } else {
                    $con = strtolower($menuItem['menu']);
                }

                if ($menuItem['menu_id'] == MENU_ID) {
                    $aIclass = ' inactive';
                } elseif (empty($userId) && ($menuItem['menu_id'] == INBOX_MENU_ID  )) {
                    $aIclass = ' inactive inactive_allow_click';
                } else {
                    $aIclass = '';
                }

                if (empty($userId) && ($menuItem['menu_id'] == PRODUCT_MENU_ID || $menuItem['menu_id'] == DATA_MENU_ID || $menuItem['menu_id'] == REPORT_MENU_ID || $menuItem['menu_id'] == ACCOUNT_MENU_ID || $menuItem['menu_id'] == ACTOR_MENU_ID)) {
                    $aIclass = ' inactive';
                }
                if(   (!isset($_SESSION[$prefixTitle]['node_id']) || (isset($_SESSION[$prefixTitle]['node_id']) && $_SESSION[$prefixTitle]['user_type']=="guest") ) && ($menuItem['menu_id'] == RESOURSE_MENU_ID || $menuItem['menu_id'] == CALANDER_MENU_ID)){
                    $aIclass = ' inactive';
                } 

                if(isset($_SESSION[$prefixTitle]['node_id']))
                {
                    if ($menuItem['menu_id'] == MENU_ID || $menuItem['menu_id'] == PRODUCT_MENU_ID || $menuItem['menu_id'] == DATA_MENU_ID)
                    {
                        $aIclass = '';
                    }
                    if(intval($menuItem['is_disabled']))
                    {
                        $aIclass = ' inactive';
                    }
                    if (($menuItem['menu_id'] == MENU_ID || $menuItem['menu_id'] == PRODUCT_MENU_ID || $menuItem['menu_id'] == DATA_MENU_ID) && $_SESSION[$prefixTitle]['user_type'] == 'guest')
                    {
                        $aIclass = ' inactive';
                    }
                }
                // for enable left menu 

                //added by Gaurav
                //added on 4 Sept 2017
                switch($menuItem['menu_id']){
                     case RESOURSE_MENU_ID: $aIclass.= ' fixed-menu resources-fixed';
                         break;
                     case CALANDER_MENU_ID: $aIclass.= ' fixed-menu calendar-fixed';
                         break;
                     case ACTOR_MENU_ID:    $aIclass.= ' fixed-menu actor-fixed';
                         break;
                }

                $leftMenuResult[$keyWS]['menu_id']     = $menuItem['menu_id'];
                $leftMenuResult[$keyWS]['menu_title']  = $menuItem['menu'];
                $leftMenuResult[$keyWS]['is_display']  = $menuItem['is_display'];
                $leftMenuResult[$keyWS]['icon_class']  = $menuItem['icon_class'];
                $leftMenuResult[$keyWS]['menu_type']   = $menuItem['menu_type'];
                $leftMenuResult[$keyWS]['is_dual']     = $menuItem['is_dual'];
                $leftMenuResult[$keyWS]['ai_class']    = $aIclass;
                $leftMenuResult[$keyWS]['parent_menu'] = $menuItem['menu'];
                $leftMenuResult[$keyWS]['src']         = "/" . strtolower($menuItem['menu']);
                $leftMenuResult[$keyWS]['is_disable']  = in_array($menuItem['menu_id'], $disableMenuIdArr) ? 1 : 0;
                $parentMenu                            = $menuItem['menu'];
                if (count($menuItem['child']) > 0) {
                    $slideIndex = 1;
                    foreach ($menuItem['child'] as $key1 => $menuItem1) {
                        $key1WS        = " " . (string)$key1;
                        $menuItem1hide = '';
                        if ($parentMenu == 'Course' && strtolower($menuItem1['menu']) == 'filter') {
                            $menuItem1hide = " hide";
                        } else if ($parentMenu == 'Course' && strtolower($menuItem1['menu']) == 'view') {
                            $menuItem1hide = " hide";
                        }
                        $leftMenuResult[$keyWS]['child'][$key1WS]['menu_id']    = $menuItem1['menu_id'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['menu_title'] = $menuItem1['menu'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['is_display'] = $menuItem1['is_display'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['icon_class'] = $menuItem1['icon_class'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['menu_type']  = $menuItem1['menu_type'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['is_dual']    = $menuItem1['is_dual'];
                        $leftMenuResult[$keyWS]['child'][$key1WS]['hide']       = $menuItem1hide;
                        $leftMenuResult[$keyWS]['child'][$key1WS]['is_disable'] = in_array($menuItem1['menu_id'], $disableMenuIdArr) ? 1 : 0;
                        if (count($menuItem1['child']) > 0) {
                            foreach ($menuItem1['child'] as $key2 => $menuItem2) {
                                $key2WS = " " . (string)$key2;
                                if (count($menuItem2['child']) > 0) {
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_id']       = $menuItem2['menu_id'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_title']    = $menuItem2['menu'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_display']    = $menuItem2['is_display'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['icon_class']    = $menuItem2['icon_class'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_type']     = $menuItem2['menu_type'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_dual']       = $menuItem2['is_dual'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_disable']    = in_array($menuItem2['menu_id'], $disableMenuIdArr) ? 1 : 0;
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['shortcut_icon'] = !empty($menuItem2['shortcut_icon']) ? $menuItem2['shortcut_icon'] : '';
                                    foreach ($menuItem2['child'] as $key3 => $menuItem3) {
                                        $key3WS                                                                                        = " " . (string)$key3;
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['menu_id']       = $menuItem3['menu_id'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['menu_title']    = $menuItem3['menu'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['is_display']    = $menuItem3['is_display'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['icon_class']    = $menuItem3['icon_class'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['menu_type']     = $menuItem3['menu_type'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['is_dual']       = $menuItem3['is_dual'];
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['is_disable']    = in_array($menuItem3['menu_id'], $disableMenuIdArr) ? 1 : 0;
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['child'][$key3WS]['shortcut_icon'] = !empty($menuItem3['shortcut_icon']) ? $menuItem3['shortcut_icon'] : '';
                                    }
                                } else {
                                    if ($parentMenu == 'Course' && strtolower($menuItem2['menu']) == 'new course') {
                                        $menuItem2Id = "new-course-flyout";
                                    } else if ($parentMenu == 'Course' && strtolower($menuItem2['menu']) == 'open course') {
                                        $menuItem2Id = "open-course-flyout";
                                    } else if ($parentMenu == 'Course' && strtolower($menuItem2['menu']) == 'course path number') {
                                        $menuItem2Id = "course-path-number";
                                    } else if ($parentMenu == 'Resources' && strtolower($menuItem2['menu']) == 'open document') {
                                        $menuItem2Id = "open-course-flyout";
                                    } else {
                                        $menuItem2Id = '';
                                    }
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_id']       = $menuItem2['menu_id'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_title']    = $menuItem2['menu'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_display']    = in_array($menuItem2['menu_id'], $hideMenuIdArr) ? "0" : $menuItem2['is_display'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['icon_class']    = $menuItem2['icon_class'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['menu_type']     = $menuItem2['menu_type'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_dual']       = $menuItem2['is_dual'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_disable']    = in_array($menuItem2['menu_id'], $disableMenuIdArr) ? 1 : 0;
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['id']            = $menuItem2Id;
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['shortcut_icon'] = !empty($menuItem2['shortcut_icon']) ? $menuItem2['shortcut_icon'] : '';
                                    if ($menuItem2Id == 'course-path-number') {
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['class'] = 'icon-sm view right';
                                    } else if ($menuItem2Id != '') {
                                        $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['class'] = 'fa fa-angle-right right';
                                    }
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['is_dual']         = $menuItem2['is_dual'];
                                    $leftMenuResult[$keyWS]['child'][$key1WS]['child'][$key2WS]['dual_icon_class'] = $menuItem2['dual_icon_class'];
                                    $firstHit                                                                      = intval($firstHit) + 1;
                                    $menuItem2Id                                                                   = '';
                                }
                            }
                        }
                        $slideIndex    = intval($slideIndex) + 1;
                        $menuItem1hide = '';
                    }
                }
                $menuIndex = intval($menuIndex) + 1;
            }

            return json_encode($leftMenuResult);
        }


        /**
         * Created By: Amit Malakar
         * Date: 28-Aug-17
         * Function to get logged in User information
         * @return array
         */
        public function getLoggedInUserInfo()
        {
            $data = array();

            // Check for USER COOKIE exists
            // if exists resume SESSION
            // error_reporting(E_ALL);
            if(isset($_COOKIE[PREFIX . 'uniqueId1']) &&  !empty($_COOKIE[PREFIX . 'uniqueId1'])) {
                $cookie                   = $_COOKIE[PREFIX . 'uniqueId1'];
                $cipherObj                = new PUCipher();
                $encryptedUserEmail       = $cipherObj->puDecrypt($cookie);
                $decryptedHashedUserEmail = hash('sha256', $encryptedUserEmail);
                //echo '<pre>'; print_r([$cookie, $decryptedSessId, $decryptedUserEmail]);

                $sessObj = new PUSession($decryptedHashedUserEmail);
                // READ SESSION FILE
                /*if($_SERVER['HTTP_HOST'] == 'localhost' && strpos(ABSO_URL, 'pu')===false) {
                    $file_path = ABSO_URL . "/pu/puidata/temp_session/sess_" . $decryptedHashedUserEmail;
                } else {
                    $file_path = ABSO_URL . "puidata/temp_session/sess_" . $decryptedHashedUserEmail;
                }
                $sessionFileRaw = file_get_contents($file_path);
                $sessData = $sessObj->unserialize_session($sessionFileRaw);*/
                $sessData = $sessObj->read('');
                // DECODE SESSION FILE DATA
                session_decode($sessData);
                // delete cookie if different browser/PHPSESSID diff
                if($_COOKIE['PHPSESSID'] !== $_SESSION[PREFIX.'user_info']['php_sess_id'] && $encryptedUserEmail == $_SESSION[PREFIX.'user_info']['email_address']) {
                    // empty value and expiration one hour before
                    unset($_COOKIE[PREFIX . 'uniqueId1']);
                    setcookie(PREFIX . 'uniqueId1', '', time() - 3600, '/');
                }
            } else {
                unset($_SESSION[PREFIX.'user_info']);
                unset($_SESSION[PREFIX.'session_file']);
                unset($_SESSION[PREFIX.'uniqueId1']);
            }
            //return [$cookie,$encryptedUserEmail,$decryptedHashedUserEmail,$sessObj,$sessData,$_SESSION];

            if (isset($_SESSION[PREFIX . 'user_info']) && !empty($_SESSION[PREFIX . 'user_info'])) {
                // user information from SESSION
                $userInfo          = $_SESSION[PREFIX . 'user_info'];
                $session_file_name = $_SESSION[PREFIX . 'session_file'];
                // profile image
                $profileImage = 0;
                if (isset($userInfo['profile_image']) && !empty($userInfo['profile_image'])) {
                    $profileImage = $userInfo['profile_image'];
                }
                // user data
                $data['user_name']         = $userInfo['user_name'] ?? '';
                $data['user_id']           = $userInfo['node_id'];
                $data['session_file_name'] = $session_file_name ?? $userInfo['email_address'];
                $data['first_name']        = $userInfo['first_name'];
                $data['last_name']         = $userInfo['last_name'];
                $data['initial_name']      = strtoupper(substr($userInfo['first_name'], 0, 1) . substr($userInfo['last_name'], 0, 1));
                $data['profile_image']     = $profileImage;
                $data['user_type']         = $userInfo['user_type'];
            }/* else {
                // user data
                $data['user_name']          = '';
                $data['user_id']            = '';
                $data['session_file_name']  = '';
                $data['first_name']         = '';
                $data['last_name']          = '';
                $data['initial_name']       = '';
                $data['profile_image']      = '';
            }*/

            return $data;
        }

    }