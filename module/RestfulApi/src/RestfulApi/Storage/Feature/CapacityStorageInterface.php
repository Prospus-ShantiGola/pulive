<?php

/*
 * This file is part of the SimpleMemoryShared package.
 * @copyright Copyright (c) 2012 Blanchon Vincent - France (http://developpeur-zend-framework.fr - blanchon.vincent@gmail.com)
 */

namespace RestfulApi\Storage\Feature;

interface CapacityStorageInterface
{
    /**
     * Get max bloc allow
     * @return int
     */
    public function canAllowBlocsMemory($numBloc);
}
