<?php

/**
 * Created by Amit Malakar.
 * Date: 8-Sep-2017
 * Time: 15:02:00 PM
 */

namespace Api\Controller\Plugin;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;

class PUCipher extends AbstractPlugin {

    /**
     * Function to encrypt a string, urlencode is required for email
     * Created By: Amit Malakar
     * Date: 7-Sep-2017
     * @param $token
     * @return string
     */
    public function puEncrypt($token)
    {
        $enc_method    = 'AES-128-CTR';
        $enc_key       = openssl_digest(gethostname() . "|" . ip2long($_SERVER['SERVER_ADDR']), 'SHA256', true);
        $enc_iv        = openssl_random_pseudo_bytes(openssl_cipher_iv_length($enc_method));
        $crypted_token = openssl_encrypt($token, $enc_method, $enc_key, 0, $enc_iv) . "::" . bin2hex($enc_iv);
        unset($token, $enc_method, $enc_key, $enc_iv);

        // urlencode is required in case if a link is generated to be sent via email
        // but while storing in DB urlencode is not required
        // so Store -> urlencode -> Email
        return $crypted_token;
    }

    /**
     * Function to encrypt Array, use puEncrypt for string
     * Created By: Amit Malakar
     * Date: 10-Oct-2017
     * @param array
     * @return string
     */
    public function puEncryptArr($tokenArr)
    {
        $token         = serialize($tokenArr);
        $enc_method    = 'AES-128-CTR';
        $enc_key       = openssl_digest(gethostname() . "|" . ip2long($_SERVER['SERVER_ADDR']), 'SHA256', true);
        $enc_iv        = openssl_random_pseudo_bytes(openssl_cipher_iv_length($enc_method));
        $crypted_token = openssl_encrypt($token, $enc_method, $enc_key, 0, $enc_iv) . "::" . bin2hex($enc_iv);
        unset($token, $enc_method, $enc_key, $enc_iv);

        return $crypted_token;
    }

    /**
     * Function to decrypt a string
     * Created By: Amit Malakar
     * Date: 7-Sep-2017
     * @param $token
     * @return string
     */
    public function puDecrypt($crypted_token)
    {
        if (preg_match("/^(.*)::(.*)$/", $crypted_token, $regs)) {
            // decrypt encrypted string
            list(, $crypted_token, $enc_iv) = $regs;
            $enc_method      = 'AES-128-CTR';
            $enc_key         = openssl_digest(gethostname() . "|" . ip2long($_SERVER['SERVER_ADDR']), 'SHA256', true);
            $decrypted_token = openssl_decrypt($crypted_token, $enc_method, $enc_key, 0, hex2bin($enc_iv));
            unset($crypted_token, $enc_method, $enc_key, $enc_iv, $regs);

            return $decrypted_token;
        }
    }

    /**
     * Function to decrypt Array, use puEncrypt for string
     * Created By: Amit Malakar
     * Date: 10-Oct-2017
     * @param $token
     * @return array
     */
    public function puDecryptArr($crypted_token)
    {
        if (preg_match("/^(.*)::(.*)$/", $crypted_token, $regs)) {
            // decrypt encrypted string
            list(, $crypted_token, $enc_iv) = $regs;
            $enc_method      = 'AES-128-CTR';
            $enc_key         = openssl_digest(gethostname() . "|" . ip2long($_SERVER['SERVER_ADDR']), 'SHA256', true);
            $decrypted_token = openssl_decrypt($crypted_token, $enc_method, $enc_key, 0, hex2bin($enc_iv));
            unset($crypted_token, $enc_method, $enc_key, $enc_iv, $regs);

            return unserialize($decrypted_token);
        }
    }

    /**
     * Function to generate hash with CRYPT_BLOWFISH algo
     * password need rehash needs to be checked
     * Created By: Amit Malakar
     * Date: 8-Sep-2017
     * @param $password
     * @return bool|string
     */
    public function puPasswordHash($password)
    {
        $options = [
            'cost' => 13,
            //'salt' => bin2hex(openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-128-CTR')))
        ];
        return password_hash($password, PASSWORD_BCRYPT, $options);
    }

    /**
     * Function to match hash generated with CRYPT_BLOWFISH algo and
     * user entered password
     * Created By: Amit Malakar
     * Date: 8-Sep-2017
     * @param $password
     * @return bool|string
     */
    public function puPasswordVerify($password,$hash)
    {
        return password_verify($password, $hash) ? 1 : 0;
    }

    /**
     * Encrypt url params, urlencode is required for email
     * Created By: Amit Malakar
     * Date: 14-Sep-2017
     * @param array $paramsArr
     * @return string
     */
    public function puUrlParamEncrypt($paramsArr = array())
    {
        $urlStr = '';
        foreach ($paramsArr as $key => $value) {
            $urlStr .= $key . '=' . $value . '&';
        }
        rtrim($urlStr, '&');
        $hash = $this->puEncrypt($urlStr);

        // urlencode is required in case if a link is generated to be sent via email
        // but while storing in DB urlencode is not required
        // so Store -> urlencode -> Email

        return $hash;
    }


    /**
     * Decrypt url params, into array
     * Created By: Amit Malakar
     * Date: 14-Sep-2017
     * @param string $paramsHash
     * @param int $explodeParamBy
     * @return array $newRes
     */
    public function puUrlParamDecrypt($paramsHash, $explodeParamBy=0)
    {
        // decrypt hash received
        $decryptedUrl = $this->puDecrypt($paramsHash);

        // get url params separated by &
        if($explodeParamBy)
            $urlArr = explode('&', $decryptedUrl, $explodeParamBy);
        else
            $urlArr = explode('&', $decryptedUrl);

        // get params array in key value
        $newRes = array();
        foreach($urlArr as $val) {
            $temp = explode('=', $val);
            $newRes[$temp[0]] = $temp[1];
        }

        return array_filter($newRes);
    }
}
