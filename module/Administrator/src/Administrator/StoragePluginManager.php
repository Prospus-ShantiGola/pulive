<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Administrator;

use Zend\ServiceManager\AbstractPluginManager;

class StoragePluginManager extends AbstractPluginManager
{
    /**
     * Default set of storage
     *
     * @var array
     */
    protected $invokableClasses = array(
        'apc'           => 'Administrator\Storage\Apc',
        'db'            => 'Administrator\Storage\Db',
        'file'          => 'Administrator\Storage\File',
        //'file_ftp'    => 'Administrator\Storage\FileFtp',
        'memcached'     => 'Administrator\Storage\Memcached',
        //'redis'       => 'Administrator\Storage\Redis',
        'segment'       => 'Administrator\Storage\Segment',
        'bloc'          => 'Administrator\Storage\Bloc',
        'session'       => 'Administrator\Storage\Session',
        'zendshmcache'  => 'Administrator\Storage\ZendShmCache',
        'zendshm'       => 'Administrator\Storage\ZendShmCache',
        'zenddiskcache' => 'Administrator\Storage\ZendDiskCache',
        'zenddisk'      => 'Administrator\Storage\ZendDiskCache',
    );

    /**
     * Validate the plugin
     *
     * Checks that the adapter loaded is an instance
     * of Storage\StorageInterfaceInterface.
     *
     * @param  mixed $plugin
     * @return void
     * @throws Exception\RuntimeException if invalid
     */
    public function validatePlugin($plugin)
    {
        if ($plugin instanceof Storage\StorageInterface) {
            // we're okay
            return;
        }

        throw new Storage\Exception\RuntimeException(sprintf(
            'Plugin of type %s is invalid; must implement %s\Storage\StorageInterfaceInterface',
            (is_object($plugin) ? get_class($plugin) : gettype($plugin)),
            __NAMESPACE__
        ));
    }
}
