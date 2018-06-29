<?php 
namespace Administrator\View\Helper;
use Zend\View\Helper\AbstractHelper;


class EncryptionDecryption extends AbstractHelper
{
	
	public function __invoke($funtionName, $dataArr)
    {
    	
        if ($funtionName == 'mc_decrypt'){
            return $this->mc_decrypt($dataArr['decrypt'], $dataArr['key']);        }
    }

	public function mc_decrypt($decrypt, $key){

	    $decrypt = explode('|', $decrypt.'|');
	    $decoded = base64_decode($decrypt[0]);
	    $iv = base64_decode($decrypt[1]);
	    if(strlen($iv)!==mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC)){ return false; }
	    $key = pack('H*', $key);
	    $decrypted = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $decoded, MCRYPT_MODE_CBC, $iv));
	    $mac = substr($decrypted, -64);
	    $decrypted = substr($decrypted, 0, -64);
	    $calcmac = hash_hmac('sha256', $decrypted, substr(bin2hex($key), -32));
	    if($calcmac!==$mac){ return false; }
	    $decrypted = unserialize($decrypted);
	    return $decrypted;
		
	}
	
}

?>