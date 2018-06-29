<?php
include "config.php";
$getChatID = $_GET["messageTo"];
if($getChatID){
$uploaddir = 'attachments/'.$getChatID.'/';
$thumb = 'attachments/'.$getChatID.'/thumbs/';
//1048576
$file_type = array('jpeg','jpg','gif','png');
$temp_type = explode('/',$_FILES['file']['type']);
//echo "<pre>";print_r($_FILES);
//die;
if($_FILES['file']['size'] <= (1048576*8) && $_FILES['file']['error'] != 1)
{
	if($temp_type[0] =='image')
	{
		if( in_array($temp_type[1],$file_type))
		{
			if(!is_dir($uploaddir)) {

		   if(mkdir(($uploaddir),0777,true))
		   {
				mkdir(($thumb),0777,true);
		   }
		   else
		   {
			mkdir(($thumb),0777,true);
		   }
		}
		$uploadfile = $uploaddir . basename($_FILES['file']['name']);
		$thumb_path = 'attachments/'.$getChatID.'/thumbs/'. basename($_FILES['file']['name']);

		if(!(file_exists($uploaddir . basename($_FILES['file']['name']))))
		{

			if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
				//echo "File is valid, and was successfully uploaded.\n";
				   copy($uploadfile, $thumb_path);
			} else {
			  //  echo "Possible file upload attack!\n";
			}
		}
		else{

		$temp = explode('.',basename($_FILES['file']['name']));
		$image_name = $temp['0'];
		$image_type = $temp['1'];
		$filecount = count(glob($uploaddir.$image_name . '*'));

		$uploadfile = $uploaddir.$image_name.'('.$filecount.').'.$image_type;
		$thumb_path = 'attachments/'.$getChatID.'/thumbs/'.$image_name.'('.$filecount.').'.$image_type;
		if(!(file_exists($uploadfile)))
		{

			if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
				//echo "File is valid, and was successfully uploaded.\n";
				   copy($uploadfile, $thumb_path);
			} else {
			  //  echo "Possible file upload attack!\n";
			}
		}

		$_FILES['file']['name'] = $image_name.'('.$filecount.').'.$image_type;

		}



		$temp  =  basename($_FILES['file']['tmp_name']);

		resize_crop_image(100, 100, $uploadfile, $thumb_path);

		$explode_data = explode(".", $temp);
		
		echo $_FILES['file']['name'].'~'. $explode_data[0]."~".humanFileSize($_FILES['file']['size']);
		}
		else{
		echo $error = 'error'.'~'.'File type not supported.';
		}
	}
	else{
		
		if(!is_dir($uploaddir)) {

		   if(mkdir(($uploaddir),0777,true))
		   {
				mkdir(($thumb),0777,true);
		   }
		   else
		   {
			mkdir(($thumb),0777,true);
		   }
		}
		$uploadfile = $uploaddir . basename($_FILES['file']['name']);
		$thumb_path = 'attachments/'.$getChatID.'/thumbs/'. basename($_FILES['file']['name']);

		if(!(file_exists($uploaddir . basename($_FILES['file']['name']))))
		{

			if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
				//echo "File is valid, and was successfully uploaded.\n";
				   copy($uploadfile, $thumb_path);
			} else {
			  //  echo "Possible file upload attack!\n";
			}
		}
		else{

		$temp = explode('.',basename($_FILES['file']['name']));
		$image_name = $temp['0'];
		$image_type = $temp['1'];
		$filecount = count(glob($uploaddir.$image_name . '*'));

		$uploadfile = $uploaddir.$image_name.'('.$filecount.').'.$image_type;
		$thumb_path = 'attachments/'.$getChatID.'/thumbs/'.$image_name.'('.$filecount.').'.$image_type;
		if(!(file_exists($uploadfile)))
		{

			if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
				//echo "File is valid, and was successfully uploaded.\n";
				   copy($uploadfile, $thumb_path);
			} else {
			  //  echo "Possible file upload attack!\n";
			}
		}

		$_FILES['file']['name'] = $image_name.'('.$filecount.').'.$image_type;

		}



		$temp  =  basename($_FILES['file']['tmp_name']);

		$explode_data = explode(".", $temp);
		
		echo $_FILES['file']['name'].'~'. $explode_data[0]."~".humanFileSize($_FILES['file']['size']);
	
	}
	
}

else
{

	if($_FILES['file']['error'])
	{
	echo $error = 'error'.'~'.'Maximum upload size is 8 MB.';

	}
	
}

}
function resize_crop_image($max_width, $max_height, $source_file, $dst_dir, $quality = 80) {
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
    $transparent = imagecolorallocatealpha($dst_img, 255, 255, 255, 127);
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
}


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
	
	


?>
