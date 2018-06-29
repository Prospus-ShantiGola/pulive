<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Api\Storage;

use Api\Storage\Exception\RuntimeException;

class Memcached implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Memcached instance
     * @var mixed
     */
    protected $memcached;

    /**
     * Default config
     * @var array
     */
    protected $config = array(
        'host' => 'dev-memcached01.xredgs.cfg.use1.cache.amazonaws.com',
        'port' => 11211,
    );

    /**
     * Construct memcached storge
     * @param array $config
     */
    public function __construct(array $config = null)
    {
        if (!extension_loaded('memcache')) {
            throw new RuntimeException('Memcache extension must be loaded.');
        }
        if($config) {
            $this->config = $config;
        }
    }

    /**
     * Memory alloc
     */
    protected function alloc()
    {
        if(null !== $this->memcached) {
            return;
        }
        $this->memcached = new \Memcache('fork_pool');
        $connexion = @$this->memcached->connect($this->config['host'], $this->config['port']);
        if(!$connexion) {
            throw new RuntimeException('Connexion to memcache refused.');
        }
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        if(null === $this->memcached) {
            return false;
        }
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
        $this->alloc();
        return $this->memcached->get($uid);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        $this->alloc();
        return $this->memcached->set($uid, $mixed);
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
            return $this->memcached->delete($uid);
        }
        return $this->memcached->flush();
    }

    /**
     * Close segment
     * @param int
     */
    public function close()
    {
        if(null === $this->memcached) {
            return;
        }
        $this->memcached->close();
    }

     /**
     * Get max bloc allow
     */
    public function canAllowBlocsMemory($numBloc)
    {
        return true; // no limitation
    }
}
