<?php

    /**
     * Created by Amit Malakar.
     * Date: 10-Oct-2017
     * Time: 16:50:00 PM
     */

    namespace Api\Controller\Plugin;

    use SessionHandlerInterface;
    use Zend\Mvc\Controller\Plugin\AbstractPlugin;

    /**
     * Class PUSession
     * Email is hashed for temp_session/sess_<filename>
     * Email is enc. using puEncrypt for cookie
     * @package Api\Controller\Plugin
     */
    class PUSession extends AbstractPlugin implements SessionHandlerInterface
    {
        private $sessPath;
        private $sessName;


        /**
         * PUSession constructor.
         * Initialize PUSession constructor with hashed email,
         * b4 modifying $_SESSION variables for read/write
         * $sessObj  = new PUSession(hash('sha256', $email));
         * @param $decryptedUserEmail
         */
        public function __construct($decryptedUserEmail){
            // SET SESSION PATH & NAME
            if($_SERVER['HTTP_HOST'] == 'localhost' && strpos(ABSO_URL, 'pu')===false) {
                $path = ABSO_URL . "/pu/puidata/temp_session";
            } else {
                $path = ABSO_URL . "puidata/temp_session";
            }
            $this->sessPath     = $path;
            $this->sessName     = 'sess_' . $decryptedUserEmail;

            // Set handler to overide SESSION
            session_set_save_handler(
                array($this, "open"),
                array($this, "close"),
                array($this, "read"),
                array($this, "write"),
                array($this, "destroy"),
                array($this, "gc")
            );

            // Start the session
            session_start();
        }

        public function open($savePath, $sessionName)
        {
            if (!is_dir($this->sessPath)) {
                mkdir($this->sessPath, 0777);
            }

            return true;
        }

        public function close()
        {
            return true;
        }

        public function read($id)
        {
            if(file_exists("$this->sessPath/$this->sessName")) {
                return (string)@file_get_contents("$this->sessPath/$this->sessName");
            }
            return false;
        }

        public function write($id, $data)
        {
            return file_put_contents("$this->sessPath/$this->sessName", $data) === false ? false : true;
        }

        /**
         * Destroy session code sample
         *  -> $decryptedUserEmail  = hash('sha256', $post['session_file_name']);
         *  -> $sessObj = new PUSession($decryptedUserEmail);
         *  -> $sessObj->destroy('');
         *  -> unset($_COOKIE[PREFIX . 'uniqueId1']);
         *  -> setcookie(PREFIX . 'uniqueId1', '', time() - 3600, '/');
         *
         * @param string $id
         * @return bool
         */
        public function destroy($id)
        {
            unset($_SESSION[PREFIX.'user_info']);
            unset($_SESSION[PREFIX.'session_file']);
            unset($_SESSION[PREFIX.'uniqueId1']);

            $file = "$this->sessPath/$this->sessName";
            if (file_exists($file)) {
                unlink($file);
            }
            session_destroy();

            // empty value and expiration one hour before
            unset($_COOKIE[PREFIX . 'uniqueId1']);
            setcookie(PREFIX . 'uniqueId1', '', time() - 3600, '/');

            return true;
        }

        public function gc($maxlifetime)
        {
            foreach (glob("$this->sessPath/sess_*") as $file) {
                if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
                    unlink($file);
                }
            }

            return true;
        }

        /**
         * Created By: Amit Malakar
         * Date: 13-Oct-2017
         * @param      $session_data
         * @param int  $start_index
         * @param null $dict
         * @return array|null
         */
        public function unserialize_session($session_data, $start_index=0, &$dict=null) {
            isset($dict) or $dict = array();

            $name_end = strpos($session_data, SESSION_DELIM, $start_index);

            if ($name_end !== FALSE) {
                $name = substr($session_data, $start_index, $name_end - $start_index);
                $rest = substr($session_data, $name_end + 1);

                $value = unserialize($rest);      // PHP will unserialize up to "|" delimiter.
                $dict[$name] = $value;

                return $this->unserialize_session($session_data, $name_end + 1 + strlen(serialize($value)), $dict);
            }

            return $dict;
        }
    }