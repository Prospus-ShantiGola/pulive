<?php

namespace spec\SimpleMemoryShared\Storage;

use PhpSpec\ObjectBehavior;

class FileSpec extends ObjectBehavior
{
    function let()
    {
        $this->beConstructedWith(array('dir' => __DIR__ . '/../../../tests/tmp'));
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('SimpleMemoryShared\Storage\File');
    }

    function it_sets_value()
    {
        $len = strlen(serialize('value'));
        $this->write('cutom-key', 'value')->shouldReturn($len);
    }
    
    function it_gets_value()
    {
        $this->read('cutom-key')->shouldReturn('value');
    }
    
    function it_clears_value()
    {
        $this->clear('cutom-key')->shouldReturn(true);
    }
}
