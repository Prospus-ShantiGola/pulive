<?php

namespace Administrator\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Factory as InputFactory;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Login implements InputFilterAwareInterface
{
	protected $inputFilter;

    /**
     * Used by ResultSet to pass each database row to the entity
     */
    public function exchangeArray($data)
    {
        
    }

    public function getArrayCopy()
    {
        return get_object_vars($this);
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new \Exception("Not used");
    }
     public function getInputFilter()
    {
      if (!$this->inputFilter)
	   {
            $inputFilter = new InputFilter();
            $factory     = new InputFactory();
            
            $this->inputFilter = $inputFilter;
        }

        return $this->inputFilter;
    }
}
