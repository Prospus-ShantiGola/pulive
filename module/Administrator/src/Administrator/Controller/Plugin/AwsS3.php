<?php
/**
 * Created by Amit Malakar
 * Updated by Arvind Soni, Amit Malakar
 * Date: 06-Jan-17
 * Time: 3:00 PM
 */

namespace Administrator\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

class AwsS3 extends AbstractPlugin
{
    public $key;
    public $secret;
    public $s3Client;
    public $s3ClientFactory;

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

        // Instantiate the client factory.
        $this->s3ClientFactory = S3Client::factory([
            'credentials' => [
                'key'    => $this->key,
                'secret' => $this->secret
            ],
            'region'  => 'us-east-1',
            'version' => 'latest'
        ]);
    }

    private function getBucketName()
    {
        return AWS_BUCKET;
    }

    /* This function use for creat or update any file or data */
    public function setFileData($fileNameWithPath,$data,$fileType="")
    {
        if($fileType == 'text')
        {
            try 
            {
                $result = $this->s3Client->putObject(array('Bucket' => $this->getBucketName(),'Key'    => $fileNameWithPath, 'Body' => $data));
                return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success', 'object_url' => $result['ObjectURL']);
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
            return array('status_code' => $result['@metadata']['statusCode'], 'msg' => 'success', 'data' => $result['Body']->__toString());
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
     * @param $data - path, detailed (boolean)
     * @return array
     */
    public function getBucketFilesLists($data)
    {
        $options           = array();
        $options['Bucket'] = $this->getBucketName();
        if (isset($data['path']) && strlen(trim($data['path']))) {
            $options['Prefix'] = $data['path']."/";
        }

        $iterator = $this->s3Client->getIterator('ListObjects', $options);

        $response = array();
        foreach ($iterator as $object) {
            if(isset($data['detailed']) && $data['detailed']==true)
                $response[] = $object;
            else
                $response[] = $object['Key'];
        }
        return $response;
    }

    public function fileExist($folderPath,$fileName)
    {
        return $this->s3Client->doesObjectExist( $this->getBucketName() , $folderPath.'/'.$fileName);
    }

    public function isObjectExist($obj){
        $fileExist = $this->s3Client->doesObjectExist($this->getBucketName(),$obj);
        return $fileExist;
    }
}