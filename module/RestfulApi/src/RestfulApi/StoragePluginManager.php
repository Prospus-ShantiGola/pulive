<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi;

use Zend\ServiceManager\AbstractPluginManager;

class StoragePluginManager extends AbstractPluginManager
{
    /**
     * Default set of storage
     *
     * @var array
     */
    protected $invokableClasses = array(
        'apc'           => 'RestfulApi\Storage\Apc',
        'db'            => 'RestfulApi\Storage\Db',
        'file'          => 'RestfulApi\Storage\File',
        //'file_ftp'    => 'RestfulApi\Storage\FileFtp',
        'memcached'     => 'RestfulApi\Storage\Memcached',
        //'redis'       => 'RestfulApi\Storage\Redis',
        'segment'       => 'RestfulApi\Storage\Segment',
        'bloc'          => 'RestfulApi\Storage\Bloc',
        'session'       => 'RestfulApi\Storage\Session',
        'zendshmcache'  => 'RestfulApi\Storage\ZendShmCache',
        'zendshm'       => 'RestfulApi\Storage\ZendShmCache',
        'zenddiskcache' => 'RestfulApi\Storage\ZendDiskCache',
        'zenddisk'      => 'RestfulApi\Storage\ZendDiskCache',
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
