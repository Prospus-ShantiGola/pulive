<?php

namespace spec\SimpleMemoryShared\Storage;

use PhpSpec\ObjectBehavior;

class MemorySpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->beConstructedWith();
        $this->shouldHaveType('SimpleMemoryShared\Storage\Memory');
    }

    function it_sets_and_gets_value()
    {
        $this->beConstructedWith();
        $this->write('cutom-key', 'value')->shouldReturn(true);
        $this->read('cutom-key')->shouldReturn('value');
    }
    
    function it_clears_value()
    {
        $this->beConstructedWith();
        $this->write('cutom-key', 'value')->shouldReturn(true);
        $this->clear('cutom-key')->shouldReturn(null);
    }
}
