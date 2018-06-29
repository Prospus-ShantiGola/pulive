<?php
namespace Grid\Form;

use Zend\Form\Form;
use Zend\Form\Element;

class GridForm extends Form
{
    public function __construct($name = null)
    {
        // we want to ignore the name passed 
        parent::__construct('Study');
        $this->setAttribute('id','Study');
		$this->setAttribute('enctype','multipart/form-data');
    }
}
