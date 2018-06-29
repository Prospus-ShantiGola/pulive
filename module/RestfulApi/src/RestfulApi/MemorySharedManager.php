<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi;

class MemorySharedManager implements Storage\StorageInterface
{
    /**
     *
     * @var Storage\StorageInterface
     */
    protected $storage;

    /**
     *
     * @var StoragePluginManager
     */
    protected $storagePluginManager;

    /**
     * Construt manager with storage
     * @param type $storage
     */
    public function __construct($storage = null)
    {
        if($storage) {
            $this->setStorage($storage);
        }
    }

    /**
     * Proxy storage interface
     */
    public function has($uid)
    {
        return $this->getStorage()->has($uid);
    }

    /**
     * Proxy storage interface
     */
    public function read($uid)
    {
        return $this->getStorage()->read($uid);
    }

    /**
     * Proxy storage interface
     */
    public function write($uid, $mixed)
    {
        return $this->getStorage()->write($uid, $mixed);
    }

    /**
     * Proxy storage interface
     */
    public function clear($uid = null)
    {
        return $this->getStorage()->clear($uid);
    }

    /**
     * Proxy storage interface
     */
    public function close()
    {
        return $this->getStorage()->close();
    }

    /**
     * Get the current storage
     * @return Storage\StorageInterface
     */
    public function getStorage()
    {
        if(null === $this->storage) {
            $this->setStorage(new Storage\File(array('dir' => __DIR__ . '/../../data/')));
        }
        return $this->storage;
    }

    /**
     * Set the current storage
     * @param Storage\StorageInterface/string $storage
     * @return SimpleMemoryShared
     */
    public function setStorage($storage, $options = null)
    {
        if(!$storage instanceof Storage\StorageInterface) {
            $storage = $this->getStoragePluginManager()->get($storage, $options);
        }
        $this->storage = $storage;
        return $this;
    }

    /**
     * Get the storage plugin manager
     * @return StoragePluginManager
     */
    public function getStoragePluginManager()
    {
        if(null === $this->storagePluginManager) {
            $this->setStoragePluginManager(new StoragePluginManager());
        }
        return $this->storagePluginManager;
    }

    /**
     * Set the storage plugin manager
     * @param StoragePluginManager $storagePluginManager
     * @return SimpleMemoryShared
     */
    public function setStoragePluginManager(StoragePluginManager $storagePluginManager)
    {
        $this->storagePluginManager = $storagePluginManager;
        return $this;
    }
}
