<?php

namespace Administrator\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Factory as InputFactory;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Classes implements InputFilterAwareInterface
{
    public $node_class_id;
    public $node_instance_id;
    public $node_id;
    public $caption;
    public $node_type_id;
	public $encrypt_status;
    public $instance_total;
    public $status;
    public $type;
	protected $inputFilter;

    /**
     * Used by ResultSet to pass each database row to the entity
     */
    public function exchangeArray($data)
    {
        $this->node_class_id            =       (isset($data['node_class_id'])) ? $data['node_class_id'] : null;
        $this->node_instance_id         =       (isset($data['node_instance_id'])) ? $data['node_instance_id'] : null;
        $this->caption                  =       (isset($data['caption'])) ? $data['caption'] : null;
        $this->node_type_id             =       (isset($data['node_type_id'])) ? $data['node_type_id'] : null;
        $this->node_id                  =       (isset($data['node_id'])) ? $data['node_id'] : null;
		$this->encrypt_status           =       (isset($data['encrypt_status'])) ? $data['encrypt_status'] : null;
        $this->instance_total           =       (isset($data['instance_total'])) ? $data['instance_total'] : null;
        $this->status                   =       (isset($data['status'])) ? $data['status'] : null;
        $this->type                   =       (isset($data['type'])) ? $data['type'] : null;
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
