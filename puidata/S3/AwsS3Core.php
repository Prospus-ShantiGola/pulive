<?php
/**
 * Created by Shanti Prakash Gola
 * Updated by Shanti Prakash Gola,Arvind Soni, Amit Malakar
 * Date: 24-Jan-17
 */
//include_once '../aws/aws-autoloader.php';
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;

class AwsS3Core
{
    public $key;
    public $secret;
    public $s3Client;
    public $s3ClientFactory;
    public $bucketName;
    
   
    public function __construct()
    {
        $this->key              = 'AKIAIH7HFQTSPVCH5QPA';
        $this->secret           = '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';
        
        // Instantiate the client.
        $this->s3Client = new S3Client([
            'credentials' => [
                'key'    => $this->key,
                'secret' => $this->secret
            ],
            'region'  => 'us-east-1',
            'version' => 'latest'
        ]);
        
        $this->s3ClientFactory = S3Client::factory([
            'credentials' => [
                'key'    => $this->key,
                'secret' => $this->secret
            ],
            'region'  => 'us-east-1',
            'version' => 'latest'
        ]);
        
    }

    public function getBucketName()
    {
        if ($_SERVER['HTTP_HOST'] == 'sta.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'sta-lb-837517909.us-east-1.elb.amazonaws.com') {
            return 'pustacdn';
        } else if ($_SERVER['HTTP_HOST'] == 'qa.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'qa-lb-526760236.us-east-1.elb.amazonaws.com') {
            return 'puqacdn';
        } else if ($_SERVER['HTTP_HOST'] == 'dev.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'dev-lb-830601176.us-east-1.elb.amazonaws.com') {
            return 'pudevbucket';
        } else if ($_SERVER['HTTP_HOST'] == 'localhost') {
            return 'localdevbucket';
        } else {
            return 'puprodcdn';
        }
    }
   
    /* This function use for creat or update any file or data */
    public function setFileData($fileNameWithPath,$data,$fileType="")
    {
        if($fileType == 'text')
        {
           try 
            {
                $result = $this->s3Client->putObject(array('Bucket' => $this->getBucketName(),'Key'    => $fileNameWithPath, 'Body' => $data));
                return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success','object_url' => $result['ObjectURL']);
            } catch (S3Exception $e) {
                return array('status_code' => 0, 'msg' => $e->getMessage());
            }
        }
        else if($fileType == 'file')
        {
            try 
            {
                // Create a new multipart upload and get the upload ID.
                $response       = $this->s3ClientFactory->createMultipartUpload(array('Bucket' => $this->getBucketName(), 'Key'    => $fileNameWithPath));
                $uploadId       = $response['UploadId'];

                // Upload the file in parts.
                $file           = fopen($data, 'r');
                $parts          = array();
                $partNumber     = 1;
                while (!feof($file)) {
                    $result     = $this->s3ClientFactory->uploadPart( array(
                                                                                'Bucket'     => $this->getBucketName(),
                                                                                'Key'        => $fileNameWithPath,
                                                                                'UploadId'   => $uploadId,
                                                                                'PartNumber' => $partNumber,
                                                                                'Body'       => fread($file, 5 * 1024 * 1024),
                                                                            ));
                    $parts[]    = array('PartNumber' => $partNumber++, 'ETag'       => $result['ETag']);
                }
                // Complete multipart upload.
                $result         = $this->s3ClientFactory->completeMultipartUpload(array(
                                                                                            'Bucket'            => $this->getBucketName(),
                                                                                            'Key'               => $fileNameWithPath,
                                                                                            'UploadId'          => $uploadId,
                                                                                            'MultipartUpload'   => array('Parts'=>$parts),
                                                                                        ));
                fclose($file);

                return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success', 'object_url' => $result['Location']);
            } catch (S3Exception $e) {
                return array('status_code' => 0, 'msg' => $e->getMessage());
            }   
        }
        else
        {
            try 
            {
                $result = $this->s3Client->putObject(array('Bucket' => $this->getBucketName(),'Key'    => $fileNameWithPath, 'Body' => $data));
                return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success','object_url' => $result['ObjectURL']);
            } catch (S3Exception $e) {
                return array('status_code' => 0, 'msg' => $e->getMessage());
            }
        }
    }

    /* This function use for get file data */
    public function getFileData($fileNameWithPath)
    {
        try 
        {
            $result = $this->s3Client->getObject(array('Bucket' => $this->getBucketName(),'Key'    => $fileNameWithPath));
            return $result['Body']->__toString();
        } catch (S3Exception $e) {
            return array('status_code' => 0, 'msg' => $e->getMessage());
        }
    }

    /* This function use for delete files or data */
    public function deleteFileData($fileNameWithPath)
    {
        try 
        {
            $result = $this->s3Client->deleteObject(array('Bucket' => $this->getBucketName(),'Key'    => $fileNameWithPath));
            return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success');
        } catch (S3Exception $e) {
            return array('status_code' => 0, 'msg' => $e->getMessage());
        }
    }

    /**
     * Returns All Buckets with Creation date
     * And search a bucket
     * @param $data
     * @return array
     */
    public function getBucketLists($bucketName)
    {
        $result   = $this->s3Client->listBuckets();
        if(!empty($bucketName)) {
            $bucketFound = false;
            foreach ($result['Buckets'] as $bucket) {
                // Each Bucket value will contain a Name and CreationDate
                if(strtolower($bucketName) == strtolower($bucket['Name'])){
                    $bucketFound = true;
                    $response = $bucket;
                }
            }
            if(!$bucketFound) {
                return array();
            }
        } else {
            $response = $result['Buckets']; //array();
        }

        return $response;
    }

    /**
     * Get All/Particular Bucket & File lists
     * @param $data
     * @return array
     */
    public function getBucketFilesLists($prefix)
    {
        $response = $this->s3Client->listObjects(array('Bucket' => $this->getBucketName(),'Prefix' => $prefix));

        $files = $response->getPath('Contents');
        $fileArray = array();
        foreach ($files as $file) {
            $filename = $file['Key']; 
            $file_path_parts = pathinfo($filename);
            $file_name = $file_path_parts['filename'];
            array_push($fileArray, $file_name);
        }
        return $fileArray;
    }

    /**
     * Get All/Particular Bucket & File lists
     * @param $data
     * @return array
     */
    public function getFolderFilesList($prefix)
    {
        $response               = $this->s3Client->listObjects(array('Bucket' => $this->getBucketName(),'Prefix' => $prefix));

        $files                  = $response->getPath('Contents');
        $fileArray              = array();
        
        foreach ($files as $file) {
            $temp                           = (array)$file['LastModified'];
            $dataArray                      = array();
            $dataArray['file_name']         = $file['Key'];
            $dataArray['date']              = $temp['date'];
            array_push($fileArray, $dataArray);
        }
        return $fileArray;
    }
    /*
     * Check if file exist passing the object name.
     * e.g "temp_session/sess_<name>"
     * return boolean true/false
     */
    public function isObjectExist($obj){
         
         $fileExist = $this->s3Client->doesObjectExist( $this->getBucketName(),$obj );
        return $fileExist;
    }

    

}