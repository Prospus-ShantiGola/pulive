<?php

/**
 * Created by Amit Malakar.
 * User: amitmalakar
 * Date: 29/09/16
 * Time: 4:00 PM
 */

namespace Administrator\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

class MyTcpdf extends \TCPDF
{

    //Page header
    public function Header() {
        // Logo
        //$image_file = ABSO_URL.'public/img/prospus-logo-100_88.jpg';
        //$this->Image($image_file, 0, 50, 40, '', 'JPG', '', 'T', false, 300, 'R', false, false, 0, false, false, false);

        //$this->SetFont('helvetica', 'B', 20); // Set font

        //$this->Cell(0, 15, '<< TCPDF Example 003 >>', 0, false, 'C', 0, '', 0, false, 'M', 'M'); // Title
    }

    // Page footer
    public function Footer() {
        $this->SetY(-40); // Position at 15 mm from bottom
        //$this->SetFont('helvetica', 'I', 8); // Set font
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M'); // Page number
    }

}