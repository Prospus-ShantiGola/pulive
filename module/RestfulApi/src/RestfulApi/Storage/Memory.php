<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi\Storage;

/**
 * Storage adapter using the php array
 */
class Memory implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Data cached
     * @var array
     */
    protected $data;

    /**
     * Construct storage
     */
    public function __construct()
    {
        $this->data = array();
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        return isset($this->data[$uid]);
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        if(!$this->has($uid)) {
            return false;
        }
        return $this->data[$uid];
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        $this->data[$uid] = $mixed;
        return true;
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        if($uid) {
            unset($this->data[$uid]);
            return;
        }
        $this->data[$uid] = array();
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
