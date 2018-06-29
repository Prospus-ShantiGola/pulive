<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Administrator\Storage;

use Zend\Stdlib\Glob;

class File implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Directory storage
     * @var string
     */
    protected $dir;

    /**
     *
     * @param string $dir
     */
    public function __construct($dir = null)
    {
        if(null === $dir) {
            $dir = __DIR__ . '/../../../data/';
        }
        if(is_array($dir)) {
            if(!isset($dir['dir'])) {
                throw new Exception\RuntimeException(
                    'File storage options must be a directory '
                    . 'name or array with a "dir" key'
                );
            }
            $dir = $dir['dir'];
        }
        if(!file_exists($dir)) {
            throw new Exception\RuntimeException(
                'Directory "' . $dir . '" for the file storage do not exists'
            );
        }
        $this->dir = $dir;
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        return file_exists($this->dir. '/'. $uid);
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
        $contents = file_get_contents($this->dir. '/'. $uid);
        return unserialize($contents);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        $fp = @fopen($this->dir. '/'. $uid, 'w+');
        if(!$fp) {
            return false;
        }
        $r = fwrite($fp, serialize($mixed));
        fclose($fp);
        return $r;
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        if($uid) {
            if(!$this->has($uid)) {
                return false;
            }
            return @unlink($this->dir. '/'. $uid);
        }
        array_map('unlink', Glob::glob($this->dir. '/*', 0));
        return true;
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
     * @return int
     */
    public function canAllowBlocsMemory($numBloc)
    {
        return true; // no limitation
    }
}
