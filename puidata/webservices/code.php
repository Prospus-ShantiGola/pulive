<?php
/**
 * Author: Gaurav Dutt Panchal
 * Date: 23 NOV 2016
 * WEB SERVICES
 */
header("Access-Control-Allow-Origin: *");
$a = 0;
if($a)
{
    if ($_SERVER['HTTP_HOST'] == 'sta.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'sta-lb-837517909.us-east-1.elb.amazonaws.com') {

        DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
        DEFINE('WS_MAPPING_ROLE_ACTOR_ID', '3298');
        DEFINE('WS_MAPPING_ROLE_DEAL_ID', '3299');
        DEFINE('WS_MAPPING_ROLE_ID', '3297');
        DEFINE('WS_MAPPING_CLASS_ID', '663');
        DEFINE('WS_DEAL_CLASS_ID', '655');
        /*
         * ROLE SETTINGS FOR WEB SERVICES
         */
        DEFINE('WS_ADMIN', '603696');
        DEFINE('WS_ROLE_SALES_CONSULTANT', '436104');
        DEFINE('WS_ROLE_BUSINESS_MANAGER', '436099');  /* ========>This is for Brokerage Consultant<================================= */
        DEFINE('WS_ROLE_BM', '450187');
        DEFINE('WS_ROLE_TEAM_SUPPORT', '454669');
        DEFINE('WS_ROLE_SELLER', '454664');
        DEFINE('WS_ROLE_BUYER', '454659');
        DEFINE('WS_ROLE_REVENUE_ACCOUNTANT', '454674');
        DEFINE('WS_ROLE_REVENUE_MANAGER', '454679');
        DEFINE('WS_ROLE_CONTROLLER', '1462795');
        DEFINE('WS_ROLE_DIRECTOR', '1462785');
        DEFINE('WS_ROLE_SUPERADMIN', '1746983');
    } else if ($_SERVER['HTTP_HOST'] == 'qa.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'qa-lb-526760236.us-east-1.elb.amazonaws.com') {

        DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
        DEFINE('WS_MAPPING_ROLE_ACTOR_ID', '3298');
        DEFINE('WS_MAPPING_ROLE_DEAL_ID', '3299');
        DEFINE('WS_MAPPING_ROLE_ID', '3297');
        DEFINE('WS_MAPPING_CLASS_ID', '663');
        DEFINE('WS_DEAL_CLASS_ID', '655');
        /*
         * ROLE SETTINGS FOR WEB SERVICES
         */
        DEFINE('WS_ADMIN', '603696');
        DEFINE('WS_ROLE_SALES_CONSULTANT', '436104');
        DEFINE('WS_ROLE_BUSINESS_MANAGER', '436099');  /* ========>This is for Brokerage Consultant<================================= */
        DEFINE('WS_ROLE_BM', '450187');
        DEFINE('WS_ROLE_TEAM_SUPPORT', '454669');
        DEFINE('WS_ROLE_SELLER', '454664');
        DEFINE('WS_ROLE_BUYER', '454659');
        DEFINE('WS_ROLE_REVENUE_ACCOUNTANT', '454674');
        DEFINE('WS_ROLE_REVENUE_MANAGER', '454679');
        DEFINE('WS_ROLE_CONTROLLER', '1462795');
        DEFINE('WS_ROLE_DIRECTOR', '1462785');
        DEFINE('WS_ROLE_SUPERADMIN', '1746983');
    } else if ($_SERVER['HTTP_HOST'] == 'dev.pu.prospus.com' || $_SERVER['HTTP_HOST'] == 'dev-lb-830601176.us-east-1.elb.amazonaws.com') {

        DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
        DEFINE('WS_MAPPING_ROLE_ACTOR_ID', '3298');
        DEFINE('WS_MAPPING_ROLE_DEAL_ID', '3299');
        DEFINE('WS_MAPPING_ROLE_ID', '3297');
        DEFINE('WS_MAPPING_CLASS_ID', '663');
        DEFINE('WS_DEAL_CLASS_ID', '655');
        /*
         * ROLE SETTINGS FOR WEB SERVICES
         */
        DEFINE('WS_ADMIN', '603696');
        DEFINE('WS_ROLE_SALES_CONSULTANT', '436104');
        DEFINE('WS_ROLE_BUSINESS_MANAGER', '436099');  /* ========>This is for Brokerage Consultant<================================= */
        DEFINE('WS_ROLE_BM', '450187');
        DEFINE('WS_ROLE_TEAM_SUPPORT', '454669');
        DEFINE('WS_ROLE_SELLER', '454664');
        DEFINE('WS_ROLE_BUYER', '454659');
        DEFINE('WS_ROLE_REVENUE_ACCOUNTANT', '454674');
        DEFINE('WS_ROLE_REVENUE_MANAGER', '454679');
        DEFINE('WS_ROLE_CONTROLLER', '1462795');
        DEFINE('WS_ROLE_DIRECTOR', '1462785');
        DEFINE('WS_ROLE_SUPERADMIN', '1746983');
    } else if ($_SERVER['HTTP_HOST'] == "localhost" && $_SERVER['HTTP_HOST'] != "pro.pu.prospus.com") {

        DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pu/pui/');
        DEFINE('WS_MAPPING_ROLE_ACTOR_ID', '3298');
        DEFINE('WS_MAPPING_ROLE_DEAL_ID', '3299');
        DEFINE('WS_MAPPING_ROLE_ID', '3297');
        DEFINE('WS_MAPPING_CLASS_ID', '663');
        DEFINE('WS_DEAL_CLASS_ID', '655');
        /*
         * ROLE SETTINGS FOR WEB SERVICES
         */
        DEFINE('WS_ADMIN', '603696');
        DEFINE('WS_ROLE_SALES_CONSULTANT', '436104');
        DEFINE('WS_ROLE_BUSINESS_MANAGER', '436099');  /* ========>This is for Brokerage Consultant<================================= */
        DEFINE('WS_ROLE_BM', '450187');
        DEFINE('WS_ROLE_TEAM_SUPPORT', '454669');
        DEFINE('WS_ROLE_SELLER', '454664');
        DEFINE('WS_ROLE_BUYER', '454659');
        DEFINE('WS_ROLE_REVENUE_ACCOUNTANT', '454674');
        DEFINE('WS_ROLE_REVENUE_MANAGER', '454679');
        DEFINE('WS_ROLE_CONTROLLER', '1462795');
        DEFINE('WS_ROLE_DIRECTOR', '1462785');
        DEFINE('WS_ROLE_SUPERADMIN', '1746983');
    } else {


        DEFINE('BUILDER_API_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/pui/');
        DEFINE('WS_MAPPING_ROLE_ACTOR_ID', '3298');
        DEFINE('WS_MAPPING_ROLE_DEAL_ID', '3299');
        DEFINE('WS_MAPPING_ROLE_ID', '3297');
        DEFINE('WS_MAPPING_CLASS_ID', '663');
        DEFINE('WS_DEAL_CLASS_ID', '655');
        /*
         * ROLE SETTINGS FOR WEB SERVICES
         */
        DEFINE('WS_ADMIN', '603696');
        DEFINE('WS_ROLE_SALES_CONSULTANT', '436104');
        DEFINE('WS_ROLE_BUSINESS_MANAGER', '436099');  /* ========>This is for Brokerage Consultant<================================= */
        DEFINE('WS_ROLE_BM', '450187');
        DEFINE('WS_ROLE_TEAM_SUPPORT', '454669');
        DEFINE('WS_ROLE_SELLER', '454664');
        DEFINE('WS_ROLE_BUYER', '454659');
        DEFINE('WS_ROLE_REVENUE_ACCOUNTANT', '454674');
        DEFINE('WS_ROLE_REVENUE_MANAGER', '454679');
        DEFINE('WS_ROLE_CONTROLLER', '1462795');
        DEFINE('WS_ROLE_DIRECTOR', '1462785');
        DEFINE('WS_ROLE_SUPERADMIN', '1746983');
    }

    $roleNameArr = array(WS_ADMIN => 'Admin',
        WS_ROLE_SALES_CONSULTANT => 'Sales consultant',
        WS_ROLE_BUSINESS_MANAGER => 'Brokerage Consultant',
        WS_ROLE_BM => 'Business Manager',
        WS_ROLE_TEAM_SUPPORT => 'Team Support',
        WS_ROLE_SELLER => 'Seller',
        WS_ROLE_BUYER => 'Buyer',
        WS_ROLE_REVENUE_ACCOUNTANT => 'Revenue Accountant',
        WS_ROLE_REVENUE_MANAGER => 'Revenue Manager',
        WS_ROLE_CONTROLLER => 'Controller',
        WS_ROLE_DIRECTOR => 'Director',
        WS_ROLE_SUPERADMIN => 'Super Admin',
    );

    include_once("WebServicesBuilderApi.php");

    $webServiceBuilderApiObj = new WebServicesBuilderApi();
    $action = $_REQUEST['action'];
    switch ($action) {

        //GET CLASS DATA
        case 'getClassData' :

            $arr = $webServiceBuilderApiObj->getWebServiceClassData();
            print $arr;
            break;

        //GET CLASS DATA WITH NODE-Z PROPERTY
        /*case 'getClassPropertyData' :

            $arr = $webServiceBuilderApiObj->getWebServiceClassPropertyData();
            print $arr;
            break;*/

        case 'getClassPropertyStrVal' :

            $arr = $webServiceBuilderApiObj->getClassPropertyStrVal();
            print $arr;
            break;

        case 'getUserDeals' :
            $post = $_REQUEST;
            $post['actor_property_id'] = WS_MAPPING_ROLE_ACTOR_ID;
            $post['deal_property_id'] = WS_MAPPING_ROLE_DEAL_ID;
            $post['role_property_id'] = WS_MAPPING_ROLE_ID;
            $post['mapping_role_class_id'] = WS_MAPPING_CLASS_ID;
            $post['deal_class_id'] = WS_DEAL_CLASS_ID;
            $post['role_arr'] = $roleNameArr;

            $arr = $webServiceBuilderApiObj->getUserDeals($post);
            print $arr;
            break;

        case 'getUserOperations' :

            $post = $_REQUEST;
            $post['actor_property_id'] = WS_MAPPING_ROLE_ACTOR_ID;
            $post['deal_property_id'] = WS_MAPPING_ROLE_DEAL_ID;
            $post['role_property_id'] = WS_MAPPING_ROLE_ID;
            $post['mapping_role_class_id'] = WS_MAPPING_CLASS_ID;
            $post['deal_class_id'] = WS_DEAL_CLASS_ID;
            $post['role_arr'] = $roleNameArr;

            $arr = $webServiceBuilderApiObj->getUserOperations($post);
            print $arr;
            break;
        
        case 'fetchCourseApi':
            $post['course_class_id'] = isset($_REQUEST['course_class_id']) ? $_REQUEST['course_class_id'] : 435;
            $post['adminId'] = isset($_REQUEST['admin_id']) ? $_REQUEST['admin_id'] : 1631794;
            $arr = $webServiceBuilderApiObj->fetchCourseApi($post);
            print $arr;
            break;
        case 'fetchCourseDialogueApi':
            //$ms = microtime(TRUE);
            $post['course_node_ids'] = isset($_REQUEST['course_node_ids']) ? $_REQUEST['course_node_ids'] : '';
            $arr = $webServiceBuilderApiObj->fetchCourseDialogueApi($post);
            //print_r(json_decode($arr,TRUE));die;
            //echo (microtime(TRUE)-$ms);
            print $arr;
            break;
        default: echo 'Invaild Request';
            break;
    }
}
?>
