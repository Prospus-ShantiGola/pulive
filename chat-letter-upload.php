<?php
//include "index.php";
//	error_reporting(E_ALL);
$getChatID = $_REQUEST["dialogue_node_id"];

if($getChatID) {
    $attachmentPath = 'puidata/attachments/';
    $uploaddir = $attachmentPath . $getChatID . '/';
    $thumb = $attachmentPath . $getChatID . '/thumbs/';
//1048576
    $file_type = array('jpeg', 'jpg', 'gif', 'png');

    //Started By: Divya
    if (isset($_REQUEST['data-url']) && $_REQUEST['data-url'] != '') {

        $data = $_REQUEST['data-url'];

        $data = str_replace('data:image/png;base64,', '', $data);

        $data = str_replace(' ', '+', $data);

        $data = base64_decode($data);

        $key = bin2hex(openssl_random_pseudo_bytes(8));

        $image = $key . '-' . $_REQUEST['name'] . '.png';

        if (!is_dir('images')) {

            if (mkdir('images', 0777, true)) {

                $file = 'images/' . $image;

            }else{
                echo "Failed to open folder.";
            }
        }else{
            $file = 'images/' . $image;
        }

        $success = file_put_contents($file, $data);

        if ($success) {
            $_FILES['file']['name'] = $_REQUEST['name'] . '.png';
            $_FILES['file']['type'] = 'image/png';
            $_FILES['file']['tmp_name'] = $data;
            $_FILES['file']['error'] = 0;
            $_FILES['file']['size'] = filesize($file);

            unlink($file);
        }else{
            //  echo "Possible file upload attack!\n";
        }

    }
    /*End Here*/

    $temp_type = explode('/', $_FILES['file']['type']);

	$_FILES['file']['name'] = safename($_FILES['file']['name']); // change by awdhesh soni for special character


    if ($_FILES['file']['size'] <= (1048576 * 8) && $_FILES['file']['error'] != 1) {
        if ($temp_type[0] == 'image') {
            if (in_array($temp_type[1], $file_type)) {
                if (!is_dir($uploaddir)) {

                    if (mkdir(($uploaddir), 0777, true)) {
                        mkdir(($thumb), 0777, true);
                    } else {
                        mkdir(($thumb), 0777, true);
                    }
                }
                $uploadfile = $uploaddir . basename($_FILES['file']['name']);
                $thumb_path = $attachmentPath . $getChatID . '/thumbs/' . basename($_FILES['file']['name']);

                if (!(file_exists($uploaddir . basename($_FILES['file']['name'])))) {

                    if( isset($_REQUEST['data-url']) && $_REQUEST['data-url'] != '' ){

                        if(file_put_contents($uploadfile, $_FILES['file']['tmp_name'])){

                            copy($uploadfile, $thumb_path);

                        } else {

                            //  echo "Possible file upload attack!\n";
                        }
                        $temp = basename($_FILES['file']['name']);

                    }else {
                        if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                            //echo "File is valid, and was successfully uploaded.\n";
                            copy($uploadfile, $thumb_path);

                        } else {
                            //  echo "Possible file upload attack!\n";
                        }
                        $temp = basename($_FILES['file']['tmp_name']);
                    }
                } else {

                    $temp = explode('.', basename($_FILES['file']['name']));
                    $image_name = $temp['0'];
                    $image_type = $temp['1'];
                    $filecount = count(glob($uploaddir . $image_name . '*'));

                    $uploadfile = $uploaddir . $image_name . '(' . $filecount . ').' . $image_type;
                    $thumb_path = $attachmentPath . $getChatID . '/thumbs/' . $image_name . '(' . $filecount . ').' . $image_type;
                    if (!(file_exists($uploadfile))) {

                        if( isset($_REQUEST['data-url']) && $_REQUEST['data-url'] != '' ){

                            if(file_put_contents($uploadfile, $_FILES['file']['tmp_name'])){

                                copy($uploadfile, $thumb_path);

                            } else {

                                //  echo "Possible file upload attack!\n";
                            }
                            $temp = basename($_FILES['file']['name']);

                        }else{

                            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                                //echo "File is valid, and was successfully uploaded.\n";
                                copy($uploadfile, $thumb_path);

                            } else {
                                //  echo "Possible file upload attack!\n";
                            }
                            $temp = basename($_FILES['file']['tmp_name']);
                        }
                    }

                    $_FILES['file']['name'] = $image_name . '(' . $filecount . ').' . $image_type;

                }

                $explode_data = explode(".", $temp);

                //resize_crop_image(100, 100, $uploadfile, $thumb_path);
                resizeNewImage($uploadfile, $thumb_path);

                echo $_FILES['file']['name'] . '~' . $explode_data[0] . "~" . humanFileSize($_FILES['file']['size']);
            } else {
                echo $error = 'error' . '~' . 'File type not supported.';
            }
        } else {

            if (!is_dir($uploaddir)) {

                if (mkdir(($uploaddir), 0777, true)) {
                    mkdir(($thumb), 0777, true);
                } else {
                    mkdir(($thumb), 0777, true);
                }
            }
            $uploadfile = $uploaddir . basename($_FILES['file']['name']);
            $thumb_path = $attachmentPath . $getChatID . '/thumbs/' . basename($_FILES['file']['name']);

            if (!(file_exists($uploaddir . basename($_FILES['file']['name'])))) {

                if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                    //echo "File is valid, and was successfully uploaded.\n";
                    copy($uploadfile, $thumb_path);
                } else {
                    //  echo "Possible file upload attack!\n";
                }
            } else {

                $temp = explode('.', basename($_FILES['file']['name']));
                $image_name = $temp['0'];
                $image_type = $temp['1'];
                $filecount = count(glob($uploaddir . $image_name . '*'));

                $uploadfile = $uploaddir . $image_name . '(' . $filecount . ').' . $image_type;
                $thumb_path = $attachmentPath . $getChatID . '/thumbs/' . $image_name . '(' . $filecount . ').' . $image_type;
                if (!(file_exists($uploadfile))) {

                    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                        //echo "File is valid, and was successfully uploaded.\n";
                        copy($uploadfile, $thumb_path);
                    } else {
                        //  echo "Possible file upload attack!\n";
                    }
                }

                $_FILES['file']['name'] = $image_name . '(' . $filecount . ').' . $image_type;

            }

            $temp = basename($_FILES['file']['tmp_name']);

            $explode_data = explode(".", $temp);

            echo $_FILES['file']['name'] . '~' . $explode_data[0] . "~" . humanFileSize($_FILES['file']['size']);
        }

    }
	else{
        if($_FILES['file']['size']=='0'){
            echo $error = 'error' . '~' . 'file size is 0 MB.';
        }
        else{
            echo $error = 'error' . '~' . 'Maximum upload size is 8 MB.';
        }
    }
}

/*function resize_crop_image($max_width, $max_height, $source_file, $dst_dir, $quality = 80) {
    $imgsize = getimagesize($source_file);
    $width = $imgsize[0];
    $height = $imgsize[1];
    $mime = $imgsize['mime'];
	if($mime =='image/jpg')
	{
		$mime =='image/jpeg';
	}

    switch ($mime) {
        case 'image/gif':
            $image_create = "imagecreatefromgif";
            $image = "imagegif";
            break;

        case 'image/png':
            $image_create = "imagecreatefrompng";
            $image = "imagepng";
            $quality = 7;
            break;

        case 'image/jpeg':
            $image_create = "imagecreatefromjpeg";
            $image = "imagejpeg";
            $quality = 80;
            break;
		case 'image/bmp':
		$image_create = "imagecreatefrombmp";
		$image = "imagebmp";
		$quality = 80;
		break;

        default:
            return false;
            break;
    }

    $dst_img = imagecreatetruecolor($max_width, $max_height);
    ///////////////

    imagealphablending($dst_img, false);
    imagesavealpha($dst_img, true);
    $transparent = imagecolorallocatealpha($dst_img, 255, 255, 2
    55, 127);
    imagefilledrectangle($dst_img, 0, 0, $max_width, $max_height, $transparent);


    /////////////
    $src_img = $image_create($source_file);

    $width_new = $height * $max_width / $max_height;
    $height_new = $width * $max_height / $max_width;
    //if the new width is greater than the actual width of the image, then the height is too large and the rest cut off, or vice versa
    if ($width_new > $width) {
        //cut point by height
        $h_point = (($height - $height_new) / 2);
        //copy image
        imagecopyresampled($dst_img, $src_img, 0, 0, 0, $h_point, $max_width, $max_height, $width, $height_new);
    } else {
        //cut point by width
        $w_point = (($width - $width_new) / 2);
        imagecopyresampled($dst_img, $src_img, 0, 0, $w_point, 0, $max_width, $max_height, $width_new, $height);
    }

    $image($dst_img, $dst_dir, $quality);

    if ($dst_img)
        imagedestroy($dst_img);
    if ($src_img)
        imagedestroy($src_img);
}*/


function humanFileSize($size)
{
    if ($size >= 1073741824) {
      $fileSize = round($size / 1024 / 1024 / 1024,2) . ' GB';
    } elseif ($size >= 1048576) {
        $fileSize = round($size / 1024 / 1024,2) . ' MB';
    } elseif($size >= 1024) {
       $fileSize = round($size / 1024,2) . 'KB';
    } else {
        $fileSize = $size . ' bytes';
    }
    return $fileSize;
}


/**
     * Created By: Awdhesh Soni
     * Date: 07-june-2017
     * function use her for convert spacial character
     * @param $theValue
     * @return string
     */

function safename($theValue)
{
    $_trSpec = array(
        'Ç' => 'C',
        'Ğ' => 'G',
        'İ' => 'I',
        'Ö' => 'O',
        'Ş' => 'S',
        'Ü' => 'U',
        'ç' => 'c',
        'ğ' => 'g',
        'ı' => 'i',
        'i' => 'i',
        'ö' => 'o',
        'ş' => 's',
        'ü' => 'u',
    );
    $enChars = array_values($_trSpec);
    $trChars = array_keys($_trSpec);
    $theValue = str_replace($trChars, $enChars, $theValue);
    $theValue=preg_replace("@[^A-Za-z0-9\-_.\/]+@i","-",$theValue);
    //$theValue=strtolower($theValue);
    return $theValue;
}

function resizeNewImage($uploadedfile, $path)
{
    $imgsize = getimagesize($uploadedfile);
    $mime = $imgsize['mime'];
    if($mime =='image/jpg')
    {
        $mime =='image/jpeg';
    }
    $quality = 80;

    //$width = $imgsize[0];
    //$height = $imgsize[1];

    // Create an Image from it so we can do the resize
    $src = '';
    switch($mime){
        case 'image/png':
            $src = imagecreatefrompng($uploadedfile);
            $func=  'imagepng';
            $quality = 8;
            break;
        case 'image/jpeg':
            $src = imagecreatefromjpeg($uploadedfile);
            $func ='imagejpeg';
            break;
        case 'image/gif':
            $src = imageCreateFromGif($uploadedfile);
            $func ='imagegif';
            break;
        case 'bmp':
            $src = imageCreateFromBmp($uploadedfile);
            $func ='imagejpeg';
            break;
    }

    // dimensions (just to be safe, should always be 185x127 though)
    $src_wide = imagesx($src);
    $src_high = imagesy($src);

    $dst_wide = $src_wide;
    $dst_high = $src_high;

    if($src_wide < 100 && $src_high < 100){
        $fill_y = (100 - $dst_high) / 2;
        $fill_x = (100 - $dst_wide) / 2;
    }else {
        // new image dimensions with right padding
        $newWidth = $newHeight = 100;
        $fill_x = $fill_y = 0;

        if ($src_wide > $src_high) {
            $dst_wide = $newWidth;
            $dst_high = $src_high / $src_wide * $newWidth;

            //$dividefactor=$newHeight/$height;
            //$x=intval((($width*$dividefactor)-$newWidth)/2);
            //$y=0;

            $fill_y = (100 - $dst_high) / 2;
        }

        if ($src_wide < $src_high) {
            $dst_wide = $src_wide / $src_high * $newHeight;
            $dst_high = $newHeight;

            //$dividefactor = $newWidth/$width;
            //$y=intval((($height*$dividefactor)-$newHeight)/2);
            //$x=0;

            $fill_x = (100 - $dst_wide) / 2;
        }

        if ($src_wide == $src_high) {
            $dst_wide = $newWidth;
            $dst_high = $newHeight;

            //$x=0;
            //$y=0;
        }
    }

    // CREATE THUMBNAIL
    $dst = imagecreatetruecolor($dst_wide, $dst_high);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $dst_wide, $dst_high, $src_wide, $src_high);

    imagejpeg($dst, $path, 100);

    // CANVAS
    $dst = imagecreatetruecolor(100,100);

    // fill the image with the white padding color
    $clear = imagecolorallocate( $dst, 255, 255, 255);
    imagefill($dst, 0, 0, $clear);

    $srcThumb = imagecreatefromjpeg($path);

    // copy the original image on top of the new one
    imagecopymerge($dst, $srcThumb, $fill_x, $fill_y,0,0, $dst_wide, $dst_high, 100);

    // store the new image in tmp directory
    $func($dst, $path, $quality);

    // free resources
    imagedestroy($src);
    imagedestroy($dst);
}
?>
