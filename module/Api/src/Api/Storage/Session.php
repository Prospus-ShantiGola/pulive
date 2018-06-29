<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Api\Storage;

use Zend\Session\Container as SessionContainer;

/**
 * Storage adapter using the php session shared memory store
 */
class Session implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Session object
     * @var \ArrayObject|SessionContainer
     */
    protected $session;
    
    /**
     * Session namespace
     * @var string
     */
    protected $namespace;

    /**
     * Construct storage
     */
    public function __construct($namespace = 'simple_memory_shared')
    {
        $this->namespace = $namespace;
    }

    /**
     * Memory alloc
     */
    protected function alloc()
    {
        if(null !== $this->session) {
            return;
        }
        if (php_sapi_name() === 'cli') {
            $this->session = new \ArrayObject();
            return;
        }
        $this->session = new SessionContainer($this->namespace);
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        if(null === $this->session) {
            return false;
        }
        return $this->session->offsetExists($uid);
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        $this->alloc();
        return $this->session->offsetGet($uid);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        $this->alloc();
        $this->session->offsetSet($uid, $mixed);
        return true;
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        $this->alloc();
        if($uid) {
            return $this->session->offsetUnset($uid);
        }
        return $this->session->exchangeArray(array());
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
