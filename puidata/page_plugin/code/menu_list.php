<?php
$data['mappingClassNodeid']                     = json_decode($post['list_mapping_id_array'], true)['classNodeid'];
$data['login_user_id']                          = $post['login_user_id'];
$data['roleId']                                 = json_decode($post['roleId']);
$data['highlightMenuId']                        = isset($post['highlightMenuId']) ? $post['highlightMenuId'] : '';
$data['admin_role_id']                          = ADMIN;
$is_operation_list                              = isset($post['is_operation_list']) ? trim($post['is_operation_list']) : 0;
$deal_actor_role_node_id                        = $data['login_role_id'] = isset($post['deal_actor_role_node_id']) ? $post['deal_actor_role_node_id'] : '';

$menuData                                       = $builderApiObj->getDataOfMenuInstance($post['node_id']);
$mainMenu                                       = json_decode($menuData, true)['data'];
$html                                           = '';
foreach ($mainMenu as $index => $itemArray) {
    $icon                                       = explode('~$~', html_entity_decode(strtolower($itemArray['icon class'])) );
    $icon_class                                 = '';
    $is_setting_icon                            = 'N';
    if (is_array($icon) && count($icon) > 1) {
        $icon_class                             = $icon[0];
        if (trim($icon[1]) == 'setting')
            $is_setting_icon                    = 'Y';
    }
    else {
        $icon_class                             = $icon[0];
    }
    ?>
    <div class="panel panel-default" id="sidebar-accordion-<?php echo $index; ?>">
        <h4 class="item-title" data-toggle="collapse" href="#collapse<?php echo $index; ?>" aria-expanded="true" aria-controls="collapse<?php echo $index; ?>">
            <span class="prs-icon <?php echo $icon_class; ?> left"></span><?php echo $itemArray['title']; ?>
            <i class="fa fa-angle-down right"></i>
        </h4>
        <?php if ($is_setting_icon == 'Y') { ?> <i class="prs-icon setting j_my_setting_open disabled"></i> <?php } ?>
        <div id="collapse<?php echo $index; ?>" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading<?php echo $index; ?>">
            <div class="panel-body">
                <ul class="item-list panel-group" id="accordion1">
                    <?php if (count($itemArray['child']) > 0) { showMenus($itemArray['child'], $html, $builderApiObj, $data, $deal_actor_role_node_id, $post['node_id'], $is_operation_list); } ?>
                </ul>
            </div>
        </div>
    </div> 
<?php } ?>