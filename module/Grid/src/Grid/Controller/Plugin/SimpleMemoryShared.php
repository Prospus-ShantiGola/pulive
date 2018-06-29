<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace Grid\Controller\Plugin;

use Grid\MemorySharedManager;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;

class SimpleMemoryShared extends AbstractPlugin
{
    /**
     * Memory shared manager
     * @var MemorySharedManager
     */
    protected $manager;

    public function __invoke($storage = null, $options = null)
    {
        if (null === $storage) {
            return $this->getMemorySharedManager();
        }
        return $this->getMemorySharedManager()->setStorage($storage, $options);
    }

    public function getMemorySharedManager()
    {
        if(null === $this->manager) {
            throw new \InvalidArgumentException('Memory shared manager must be injected.');
        }
        return $this->manager;
    }

    public function setMemorySharedManager(MemorySharedManager $manager)
    {
        $this->manager = $manager;
    }
}
