<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Grid;

use Zend\ServiceManager\AbstractPluginManager;

class StoragePluginManager extends AbstractPluginManager
{
    /**
     * Default set of storage
     *
     * @var array
     */
    protected $invokableClasses = array(
        'apc'           => 'Grid\Storage\Apc',
        'db'            => 'Grid\Storage\Db',
        'file'          => 'Grid\Storage\File',
        //'file_ftp'    => 'Grid\Storage\FileFtp',
        'memcached'     => 'Grid\Storage\Memcached',
        //'redis'       => 'Grid\Storage\Redis',
        'segment'       => 'Grid\Storage\Segment',
        'bloc'          => 'Grid\Storage\Bloc',
        'session'       => 'Grid\Storage\Session',
        'zendshmcache'  => 'Grid\Storage\ZendShmCache',
        'zendshm'       => 'Grid\Storage\ZendShmCache',
        'zenddiskcache' => 'Grid\Storage\ZendDiskCache',
        'zenddisk'      => 'Grid\Storage\ZendDiskCache',
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
