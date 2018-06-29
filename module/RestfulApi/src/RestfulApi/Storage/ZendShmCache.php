<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi\Storage;

use RestfulApi\Storage\Exception\RuntimeException;

/**
 * Storage adapter using the Zend Data Cache shared memory store
 */
class ZendShmCache implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Construct storage
     */
    public function __construct()
    {
        if (php_sapi_name() === 'cli') {
            throw new RuntimeException('ZendShmCache is not available from the command line');
        }
        if (!function_exists('zend_shm_cache_store') || !ini_get('zend_datacache.enable')) {
            throw new RuntimeException('Zend Data Cache extension must be loaded and enabled.');
        }
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        $data = $this->read($uid);
        return false !== $data;
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        return zend_shm_cache_fetch($uid);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        return zend_shm_cache_store($uid, $mixed);
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        if($uid) {
            return zend_shm_cache_delete($uid);
        }
        return zend_shm_cache_clear();
    }

    /**
     * Close storage
     * @param int
     */
    public function close()
    {
        return;
    }

     /**
     * Get max bloc allow
     */
    public function canAllowBlocsMemory($numBloc)
    {
        return true; // no limitation
    }
}
