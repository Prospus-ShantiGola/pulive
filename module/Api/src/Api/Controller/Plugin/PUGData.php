<?php
    /**
     * Google SpreadSheet Form update data
     * User: Amit Malakar
     * Date: 15-Sep-2017
     * Time: 11:49:50 AM
     */

    namespace Api\Controller\Plugin;

    use Api\Model\ApiTable;
    use Zend\Mvc\Controller\Plugin\AbstractPlugin;

    class PUGData extends AbstractPlugin {


        /**
         * Function to update SpreadSheet by CRON
         * PU REPORTS SHEET
         * Created By: Amit Malakar
         * Date: 18-Sep-2017
         * @param string $formUrl
         * @param array $formData
         * @return array
         */
        public function updateSpreadsheetForm($formUrl, $formData)
        {
            $success = 0;
            while($success == 0){
                error_reporting(E_ALL);
                $ch    = curl_init($formUrl);
                curl_setopt($ch, CURLOPT_HEADER, false);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
                $contents = curl_exec($ch);
                if (curl_errno($ch)) {
                    // this would be your first hint that something went wrong
                    $message = 'Couldn\'t send request: ' . curl_error($ch);
                } else {
                    // check the HTTP status code of the request
                    $resultStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    if ($resultStatus == 200) {
                        $message = 'success';
                        $success = 1;
                    } else {
                        // request didn't complete, common errors are 4xx
                        // (not found, bad request, etc.) and 5xx (usually concerning errors/exceptions in the remote script execution)
                        $message = 'Request failed: HTTP status code: ' . $resultStatus;
                    }
                }
                curl_close($ch);
            }

            return $message;
        }

        /**
         * PU Reports data for Google SpreadSheet
         * Created By: Amit Malakar
         * Date: 20-Sep-2017
         * @param object $apiTableObj
         * @return int|void $res
         */
        public function getPuReportsData($apiTableObj)
        {
            // Total Registered Users - ALL
            // Total Default Dialogue Courses
            // Total Production Courses
            // Total Dialogues in Production Courses
            // Total Dialogues
            // Total Statements
            $res = $apiTableObj->puReportsData();

            return $res;
        }
    }