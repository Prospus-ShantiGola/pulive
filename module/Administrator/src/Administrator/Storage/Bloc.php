<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Administrator\Storage;

class Bloc implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * identifier
     * @var resource
     */
    protected $identifier;

    /**
     *
     * @var mixed
     */
    protected $memory;

    /**
     * Bloc size
     * @var int
     */
    protected $segmentSize = 256;

    /**
     * Construct segment memory
     * @param type $identifier
     */
    public function __construct($identifier = 'Z')
    {
        if(is_array($identifier)) {
            if(!isset($identifier['identifier'])) {
                throw new Exception\RuntimeException(
                    'Segment storage options must be an identifier '
                    . 'name or array with a "identifier" key'
                );
            }
            $identifier = $identifier['identifier'];
        }
        $this->identifier = $identifier;
    }

    public function realloc($segmentSize)
    {
        $this->close();
        $this->setSegmentSize($segmentSize);
    }

    /**
     * Memory alloc
     */
    protected function alloc()
    {
        if(null !== $this->memory) {
            return;
        }
        $this->memory = shm_attach(ftok(__FILE__, $this->identifier), $this->segmentSize, 0644);
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        if(null === $this->memory) {
            return false;
        }
        return shm_has_var($this->memory, $uid);
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        if(!is_int($uid) && !is_numeric($uid)) {
            throw new Exception\RuntimeException('Segment type key must integer or numeric.');
        }
        $this->alloc();
        $str = shm_get_var($this->memory, $uid);
        $str = trim($str);
        if(!$str) {
            return false;
        }
        return $str;
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        if(!is_int($uid) && !is_numeric($uid)) {
            throw new Exception\RuntimeException('Segment type key must integer or numeric.');
        }
        $this->alloc();
        return shm_put_var($this->memory, $uid, $mixed);
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        if(null === $uid) {
            $this->alloc();
            return shm_remove($this->memory);
        }
        if(!is_int($uid) && !is_numeric($uid)) {
            throw new Exception\RuntimeException('Segment type key must integer or numeric.');
        }
        $this->alloc();
        if(!$this->has($uid)) {
            return false;
        }
        return shm_remove_var($this->memory, $uid);

    }

    /**
     * Close segment
     * @param int
     */
    public function close()
    {
        if(null === $this->memory) {
            return;
        }
        shm_detach($this->memory);
        $this->memory = null;
    }

    /**
     * Get segment memory
     * @return type
     */
    public function getSegment()
    {
        return $this->memory;
    }

    /**
     * Get segment size
     * @return int
     */
    public function getSegmentSize()
    {
        return $this->segmentSize;
    }

    /**
     * Set segment size
     * @param int
     */
    public function setSegmentSize($size)
    {
        if(null !== $this->memory) {
            throw new Exception\RuntimeException(
                'You can not change the segment size because memory is already allocated.'
                . ' Use realloc() function to create new memory segment.'
            );
        }
        $this->segmentSize = (integer)$size;
        return $this;
    }

    /**
     * Get max bloc allow
     */
    public function canAllowBlocsMemory($numBloc)
    {
        return $this->segmentSize >= $numBloc;
    }
}
