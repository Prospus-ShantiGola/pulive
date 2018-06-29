<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi\Storage;

use RestfulApi\Storage\Exception\RuntimeException;

class Apc implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Construct apc storge
     */
    public function __construct()
    {
        if (!extension_loaded('apc') || !ini_get('apc.enabled')) {
            throw new RuntimeException('APC extension must be loaded.');
        }
    }
    
    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        return apc_exists($uid);
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        return apc_fetch($uid);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        return apc_store($uid, $mixed);
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        if($uid) {
            return apc_delete($uid);
        }
        return apc_clear_cache();
    }

    /**
     * Close apc
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
