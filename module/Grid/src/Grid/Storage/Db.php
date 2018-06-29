<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Grid\Storage;

use Zend\Db\Adapter\Adapter;
use Zend\Stdlib\Exception;

class Db implements StorageInterface, Feature\CapacityStorageInterface
{
    /**
     * Db adapater
     * @var Adapter
     */
    protected $adapter;

    /**
     * Db storage options
     * @var array
     */
    protected $options;

    /**
     * Db storage constructor, need db adapter and db options
     * @param array $options
     */
    public function __construct(array $options = array())
    {
        if($options) {
            $this->setOptions($options);
        }
    }

    /**
     * Test if has datas with $uid key
     * @param mixed $uid
     * @return boolean
     */
    public function has($uid)
    {
        $options = $this->getOptions();
        $stmt = $this->adapter->query(
            sprintf('SELECT %s FROM %s WHERE %s = "%s"',
                $options['column_value'],
                $options['table'],
                $options['column_key'],
                $uid
            ), Adapter::QUERY_MODE_EXECUTE
        );
        return $stmt->count() > 0;
    }

    /**
     * Read datas with $uid key
     * @param mixed $uid
     * @return mixed
     */
    public function read($uid)
    {
        $options = $this->getOptions();
        $stmt = $this->adapter->query(
            sprintf('SELECT %s FROM %s WHERE %s = "%s"',
                $options['column_value'],
                $options['table'],
                $options['column_key'],
                $uid
            ), Adapter::QUERY_MODE_EXECUTE
        );
        if($stmt->count() == 0) {
            return false;
        }
        $current = $stmt->current();
        $datas = $current->getArrayCopy();
        $contents = array_shift($datas);
        return unserialize($contents);
    }

    /**
     * Write datas on $uid key
     * @param mixed $uid
     * @param mixed $mixed
     */
    public function write($uid, $mixed)
    {
        $options = $this->getOptions();
        $this->adapter->query(
            sprintf('INSERT INTO %s (%s, %s) VALUES ("%s", %s)',
                $options['table'],
                $options['column_key'],
                $options['column_value'],
                $uid,
                $this->adapter->getPlatform()->quoteValue(serialize($mixed))
            ), Adapter::QUERY_MODE_EXECUTE
        );
        return true;
    }

    /**
     * Clear datas with $uid key
     * @param mixed $uid
     * @return void
     */
    public function clear($uid = null)
    {
        $options = $this->getOptions();
        if($uid) {
            if(!$this->has($uid)) {
                return false;
            }
            $stmt = $this->adapter->query(
                sprintf('DELETE FROM %s WHERE %s = "%s"',
                    $options['table'],
                    $options['column_key'],
                    $uid
                ), Adapter::QUERY_MODE_EXECUTE
            );
            return true;
        }
        $stmt = $this->adapter->query(
            sprintf('TRUNCATE TABLE %s', $options['table']),
            Adapter::QUERY_MODE_EXECUTE
        );
        return true;
    }

    /**
     * Close storage
     * @param int
     */
    public function close()
    {
        return; // do not close db connection
    }

    /**
     * Get max bloc allow
     * @return int
     */
    public function canAllowBlocsMemory($numBloc)
    {
        return true; // no limitation
    }

    /**
     * Get the adapter options
     * @return array
     */
    protected function getOptions()
    {
        if(null === $this->options) {
            throw new Exception\InvalidArgumentException('Db adapter options must be defined.');
        }
        return $this->options;
    }

    /**
     * Set the db adapter options
     * @param array $options
     */
    protected function setOptions(array $options)
    {
        if(
            !array_key_exists('adapter', $options) ||
            !array_key_exists('table', $options) ||
            !array_key_exists('column_key', $options) ||
            !array_key_exists('column_value', $options)
        ) {
            throw new Exception\InvalidArgumentException(
                'Db adapter options must be defined "adapter", "table", "column_key" and "column_value" keys.'
            );
        }
        if(!$options['adapter'] instanceof Adapter) {
            throw new Exception\InvalidArgumentException(
                'Db adapter must be an instance of Zend\Db\Adapter\Adapter.'
            );
        }
        $this->adapter = $options['adapter'];
        $options['table'] = $this->adapter->getPlatform()->quoteIdentifier($options['table']);
        $options['column_key'] = $this->adapter->getPlatform()->quoteIdentifier($options['column_key']);
        $options['column_value'] = $this->adapter->getPlatform()->quoteIdentifier($options['column_value']);
        $this->options = $options;

        return $this;
    }
}
