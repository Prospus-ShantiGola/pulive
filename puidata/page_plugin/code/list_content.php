<?php
if (empty($post['status'])) {
    $menuData                     = $builderApiObj->getDataOfInstanceTitle($post['menuListInstanceId']);
    $menuData                     = json_decode($menuData, true);
    $valArr                       = explode('~#~', $menuData);
    $propertyId                   = intval($valArr[0]); //'6807';
    $status                       = trim(strtolower($valArr[1])); //'CT1';
    $subMenuVal                   = $valArr[2];
} else {
    $propertyId                   = $post['propertyId'];
    $status                       = $post['status'];
    $subMenuVal                   = "";
}

$recordPerPage                    = $post['record_per_page'];
$page                             = isset($post['page']) ? intval($post['page']) : 1;
$data                             = json_decode($post['list_head_array'], true);
array_push($data['columns'], 'DEAL > Deal Type');

$setting                          = json_decode($post['list_setting_array'], true);
$nodeIdArray                      = json_decode($post['list_node_id_array'], true);
/* $status = $post['status'];
  $propertyId = $post['propertyId']; */
$headFilter                       = $post['head_filter'];
$login_user_id                    = $post['login_user_id'];
$loginRoleId                      = $post['roleId']; //Get the current user role id of login user. By:- Gaurav Dutt Panchal

$search                           = isset($post['search_string']) ? $post['search_string'] : '';
if (trim($status) == '') {
    $status                       = 'All';
    $propertyId                   = '';
}

if (isset($post['isDashboard'])) {//if data is searched from dashboard
    $recordPerPage                = 500;
    switch (trim($post['roleId'])) {
        case ROLE_BM:
            $status               = 'All';
            break;
        case ROLE_REVENUE_ACCOUNTANT:
            $status               = 'All';
            break;
        case ROLE_REVENUE_MANAGER:
            $status               = 'ra_mine';
            $propertyId           = 'ra_mine';
            break;
        case ROLE_CONTROLLER:
            $status               = 'ra_mine';
            $propertyId           = 'ra_mine';
            break;
        case ROLE_DIRECTOR:
            $status               = 'ra_mine';
            $propertyId           = 'ra_mine';
            break;
        default: $status          = 'All';
            $propertyId           = '';
            break;
    }
}

$data['mappingClassNodeid']       = json_decode($post['list_mapping_id_array'], true);
$data['login_user_id']            = json_decode($login_user_id, true);
$data['roleId']                   = json_decode($loginRoleId, true);
$data['status']                   = $status;
$data['propertyId']               = $propertyId;
$data['searchString']             = $search;
$data['recordPerPage']            = $recordPerPage;
$data['page']                     = $page;
$data['head_filter']              = $headFilter;
$data['admin_role_id']            = ADMIN;
$data['save_deal']                = isset($post['save_deal']) ? $post['save_deal'] : '';
$data['save_status']              = isset($post['save_status']) ? $post['save_status'] : '';
$data['new_deal_id']              = isset($post['new_deal_id']) ? $post['new_deal_id'] : '';
$data['new_deal_instance_id']     = isset($post['new_deal_instance_id']) ? $post['new_deal_instance_id'] : '';
$listData                         = $builderApiObj->getDataOfList($data);
$listArray                        = json_decode($listData, true);
//echo "<pre>"; print_r($listArray); die();
$listArray['data']['list_head_array']     = json_decode($post['list_head_array'], true);
if (isset($post['isDashboard'])) {
    echo searchContentForDashboard($listArray['data']);
    exit;
}

$buildQueryArray                          = array();
$buildQueryArray['submenu']               = $subMenuVal;
$buildQueryArray['status']                = $status;
$buildQueryArray['propertyId']            = $propertyId;
$buildQueryArray['search_string']         = $search;
$buildQueryArray['recordPerPage']         = $recordPerPage;
$buildQueryArray['page']                  = $page;
$buildQueryArray['head_filter']           = $headFilter;
$pageNum                                  = $listArray['data']['pageCount'] ? $listArray['data']['pageCount'] : $page;
//echo "<pre>"; print_r($listArray); die();
?>
<div class="customScroll set-tbody-HT">
<?php listContent($listArray['data'], $setting, $nodeIdArray, $buildQueryArray, 0, $data['new_deal_id'], $pageNum); //echo '<pre>'; print_r($abc); die();?>
</div>
<script type="text/javascript"> total_record_of_plugin_list = "<?php echo $listArray['data']['totalRecord']; ?>"; curpage = "<?php echo $pageNum; ?>"; current_list_status = "<?php echo $status; ?>"; </script>
