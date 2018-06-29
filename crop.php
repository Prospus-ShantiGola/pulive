<?php
error_reporting(0);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $targ_w                         = $_POST['w'];
  $targ_h                         = $_POST['h'];
  $jpeg_quality                   = 90;
  $src                            = $_POST['imgPath'];
  $RandomAccountNumber            = uniqid();
  $path_parts                     = pathinfo($src);

  if($_POST['is_registration'])
  {
    $srcFinal                       = $path_parts['dirname'].'/'.$path_parts['filename'].'_crop.jpg';
  }
  else
  {
    $srcFinal                       = 'files/'.$RandomAccountNumber.'.jpg';
  }

  $dst_r                          = ImageCreateTrueColor( $targ_w, $targ_h );

  if (strtolower($path_parts['extension']) == "png") {
    $img_r                        = imagecreatefrompng($src);
    $white                        = imagecolorallocate($dst_r, 255, 255, 255);
    imagefill($dst_r, 0, 0, $white);
  } else if (strtolower($path_parts['extension']) == "gif") {
    $img_r                        = imagecreatefromgif($src);
  } else {
    $img_r                        = imagecreatefromjpeg($src);

  }

  imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'],$targ_w,$targ_h,$_POST['w'],$_POST['h']);
  imagejpeg($dst_r,$srcFinal,$jpeg_quality);
  unlink($src);
  if($_POST['is_registration'])
  {
    $srcFinal = $srcFinal;
    echo($srcFinal);
  }
  else
  {
    echo($srcFinal);
  }
  exit;
}
?>
