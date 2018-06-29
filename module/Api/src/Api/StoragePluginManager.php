<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Api;

use Zend\ServiceManager\AbstractPluginManager;

class StoragePluginManager extends AbstractPluginManager
{
    /**
     * Default set of storage
     *
     * @var array
     */
    protected $invokableClasses = array(
        'apc'           => 'Api\Storage\Apc',
        'db'            => 'Api\Storage\Db',
        'file'          => 'Api\Storage\File',
        //'file_ftp'    => 'Api\Storage\FileFtp',
        'memcached'     => 'Api\Storage\Memcached',
        //'redis'       => 'Api\Storage\Redis',
        'segment'       => 'Api\Storage\Segment',
        'bloc'          => 'Api\Storage\Bloc',
        'session'       => 'Api\Storage\Session',
        'zendshmcache'  => 'Api\Storage\ZendShmCache',
        'zendshm'       => 'Api\Storage\ZendShmCache',
        'zenddiskcache' => 'Api\Storage\ZendDiskCache',
        'zenddisk'      => 'Api\Storage\ZendDiskCache',
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
