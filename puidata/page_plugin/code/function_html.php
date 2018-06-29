<?php

function showMenus($childArray, $html, $builderApiObj, $data = array(), $role_node_id, $menu_instanse_node_id, $is_operation_list) {
    foreach ($childArray as $key => $value) {
        if (strtolower($value['title']) == 'index view' && $role_node_id != ROLE_BM) {
            unset($childArray[$key]);
            continue;
        }
        $tempFilter = array();
        if (strtolower($value['status']) == 'enable') {
            $counter = 0;
            $dclass = $class = $dataopsType = $opsParent = '';
            $conditions = $li_id = $statusId = $_menuValue = '';
            $index_view_filter = '';
            if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) == 'default') {
                $conditions = 'onclick="getContentFormForAdd(this);"';
                $li_id = 'li_id_' . $key;
            } else if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) == 'printpackagedocument') {
                $conditions = 'onclick="printPackageDocument(this);"';
                $li_id = 'li_id_' . $key;
                $dclass = 'print_package_icon_show ';
            } else if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) == 'delete') {
                $conditions = '';//onclick="deleteItemFor(this);"';
                $li_id = 'li_id_' . $key;
            } else if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) != '' && strtolower($value['action (url)']) != 'default' && strtolower($value['action (url)']) != 'printpackagedocument') {
                $tempNewFilter = explode("%$#", strtolower($value['action (url)']));

                $newMenuArr = explode('_', $tempNewFilter[1]);
                
                /* code here start create new menu for RA */
                if (strtolower($newMenuArr[0]) == "ra" || strtolower($newMenuArr[0]) == "common") {
//                    will remove later after successfully working
//                    $filterCount = $builderApiObj->getFilterCounts(array_merge($tempNewFilter, $data));
//                    $filterArray = json_decode($filterCount, true);

                    $counter = explode('_', $tempNewFilter[1]);
                    $statusId = $tempNewFilter[1];
                    $li_id = 'li_id_' . $key;
                    $_menuValue = $tempNewFilter[1];
                    if (empty($_menuValue)) {
                        $_menuValue = 'All';
                    }
                    $conditions = 'onclick="getFilterList(' . this . ',\'' . $_menuValue . '\',\'' . $tempNewFilter[1] . '\',\'' . $li_id . '\',\'' . $value['title'] . '\');"';
                } else {
                    $tempFilter = explode("~$~", strtolower($value['action (url)']));                                       

                    if ($tempFilter[0] == 'flyout') {
                        if (count($tempFilter) > 3) {
                            //remove later when list will work fine as these variables are not using anywhere
                            //$subMenu = array_pop($tempFilter);
                            //$subMenuArr = explode('~|~', $tempFilter);
                            $conditions = 'data-property="' . implode('~$~', $tempFilter) . '"';
                        } else {
                            $conditions = 'data-property="' . $value['action (url)'] . '"';
                        }
//                        will remove later after successfully working
//                        $filterCount = $builderApiObj->getFilterCounts(array_merge($tempFilter, $data));
//                        $filterArray = json_decode($filterCount, true);
                        $filterArray['data'] = $value['filterChild'];

                        $counter = explode('~$~', $filterArray['data']);
                        $statusId = $counter[1];

                        $li_id = 'li_id_' . $key;
                        if ($key == '1675784')
                            $statusId = '7988';
                    } else if (strtolower($tempFilter[count($tempFilter) - 1]) == 'indexfinancing' || 
                            strtolower($tempFilter[count($tempFilter) - 1]) == 'indexcash' ||
                            strtolower($tempFilter[count($tempFilter) - 1]) == 'indexposting' ||
                            strtolower($tempFilter[count($tempFilter) - 1]) == 'indexclosing' ||
                            strtolower($tempFilter[count($tempFilter) - 1]) == 'indexcapping') {
                        
                            $conditions = '';
                            $class = ' group-li';
                            $index_view_filter = strtolower($tempFilter[count($tempFilter) - 1]);
                            $filterstr = substr($index_view_filter, 5);
                            $dataopsType = 'data-opsType = "'.$filterstr.'"';
                            $opsParent = 'opsParent';


                            unset($tempFilter[count($tempFilter) - 1]);
//                            will remove later after successfully working
//                            $filterCount = $builderApiObj->getFilterCounts($tempFilter);
//                            $filterArray = json_decode($filterCount, true);
                            $filterArray['data'] = $value['filterChild'];

                            $counter = explode('~$~', $filterArray['data']);
                            $statusId = $counter[1];
                            $li_id = 'li_id_' . $key;
                            $_menuValue = $tempFilter[2];
                    } else {
                         
                        if(!$is_operation_list){
                            $temparray = $tempFilter;
                        } else {
                            $temparray = array_merge($tempFilter, $data);
                        }
//                        will remove later after successfully working
//                        $filterCount = $builderApiObj->getFilterCounts($temparray);
//                        $filterArray = json_decode($filterCount, true);
                        $filterArray['data'] = $value['filterChild'];
                        
                        
                        $counter = explode('~$~', $filterArray['data']);
                        $statusId = $counter[1];
                        $li_id = 'li_id_' . $key;
                        $_menuValue = $tempFilter[2];

                        if (empty($_menuValue)) {
                            $_menuValue = 'All';
                        }                        
                        
                        if(!$is_operation_list && ($counter[1]=="") && ($_menuValue=="financing" || $_menuValue=="cash")){
                            $counter[1] = DEAL_PAYMENT_TYPE_PROPERTY_ID;
                            $statusId = $counter[1];
                        }
                        $conditions = 'onclick="getFilterList(' . this . ',\'' . $_menuValue . '\',' . $counter[1] . ',\'' . $li_id . '\',\'' . $value['title'] . '\');"';
                    }
                }
            } else {
                $conditions = 'href="#"';
                $li_id = 'li_id_' . $key;
            }


            $_active = '';
            if ($tempFilter[0] != 'flyout' && strtolower($value['setdefault']) == 'yes') {
                $_active = 'active';
            } else if ($tempFilter[0] == 'flyout') {
                if (strtolower($value['setdefault']) == 'yes') {
                    $_active = 'open-option-flyout active';
                } else {
                    $_active = 'open-option-flyout';
                }
            } else if ($index_view_filter == 'indexfinancing' || $index_view_filter == 'indexposting' || $index_view_filter == 'indexcapping' || $index_view_filter == 'indexclosing' || $index_view_filter == 'indexcash') {
                $_active = '';
            }
            /* if (strtolower($value['title']) === 'all') {
              $_active = 'active';
              } else if ($tempFilter[0] == 'flyout') {
              $_active = 'open-option-flyout';
              } */

            $opsclass = '';
            if ($statusId == '7794' || $statusId == '7795' || $statusId == '7796' || $statusId == '7797' || $statusId == '7798' || $statusId == '8849') {
                $opsclass = 'opsCat ';
            }
			if($li_id == 'li_id_398476'){$statusId = 3287;}
            ?>

            <?php if ($menu_instanse_node_id == '1614957' && $role_node_id != ROLE_BM && $li_id == 'li_id_1615020') {
                $_active = 'active';
            }
            // To default active the menu filter - passed as menu_property_id in Menu Lisitng
            if( $is_operation_list && $data['highlightMenuId'] != '' && $data['highlightMenuId'] == $statusId) {
                $_active = 'active';
            }
            ?>


            <li id="<?php echo $li_id; ?>" class="<?php echo $opsclass . $_active . $class; ?>" data-statusid="<?php echo $statusId; ?>">
            <?php
            $collapseWithJS = '';
            if (strtolower($value['title']) == 'index view' || strtolower($value['title']) == 'filter view' || $index_view_filter == 'indexfinancing' || $index_view_filter == 'indexposting' || $index_view_filter == 'indexcapping' || $index_view_filter == 'indexclosing' || $index_view_filter == 'indexcash') {
                $collapseWithJS = ' collapseWithJS';
            }
            ?>
                <a <?php echo $dataopsType; ?> class="<?php echo $opsParent . $dclass . $collapseWithJS; ?><?php if (isset($value['child']) && count($value['child']) > 0 && (strtolower($value['title']) != 'filter view' && strtolower($value['title']) != 'index view')) { ?>parent_list<?php } ?>" data-title="<?php echo $_menuValue; ?>" <?php echo $conditions; ?> data-indexing="<?php echo $index_view_filter;?>">
                    <span class="item-list-detail"><?php echo $value['title']; ?></span>
                    <?php if (strtolower($value['use counter']) == 'yes') { ?>
                        <span id="actives-count" class="badge "> <?php echo '0'; ?> </span>
                    <?php } ?>
                    <?php if(strtolower($value['title']) == 'filter view'){ ?>
                        <i class="fa fa-angle-down right"></i>
                    <?php }else if (strtolower($value['title']) == 'index view' || $index_view_filter == 'indexfinancing' || $index_view_filter == 'indexposting' || $index_view_filter == 'indexcapping' || $index_view_filter == 'indexclosing' || $index_view_filter == 'indexcash') { ?>
                        <i class="fa fa-angle-up right"></i>
                    <?php } ?>
                </a>
            <?php if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) == 'default') { ?>
                    <script type="text/javascript">
                        function getContentFormForAdd(obj) {
                            storePreviousListStatus();
                            if (BreadcrumbModule.getSection() == 'Operation' && $("#leftMenuBar").find('.active').hasClass('deals')) {
                                leftNavigationModule.toggleActiveSelection('make_clicked_element_active', $(obj));
                                leftNavigationModule.toggleClassOnMenuElements('add');
                                setTimeout(function () {
                                    $(".j_my_open_optional_operation_list").trigger('click');
                                }, 100);
                            } else {
                                if (searchModule.checkAddEditForm($(obj))) {
                                    searchModule.resetSearchInput();
                                    htmlModule.showBlankRow();
                                    instance_node_id_dashboard = '';
                                    node_instance_id_dashboard = '';
                                    form_container = '';
                                    renderViewDetails(obj, add_instance_id_of_content, 'add');
                                }
                            }
                        }
                    </script>
            <?php } else if (strtolower($value['use ajax']) == 'yes' && strtolower($value['action (url)']) == 'delete') { ?>
                    <script type="text/javascript">
                        function deleteItemFor(obj) {
                            var instance_id = $('#id_detail_instance_id').val();
                            deleteItemInstance(instance_id, 'delete_instance');
                        }
                    </script>
                <?php } ?>
                <?php $display = '';
                if (isset($value['child']) && count($value['child']) > 0) {
                    if (strtolower($value['title']) == 'index view') {
                        $display = 'style="display:none"';
                    }
                ?>
                    <ul class="item-list list-indent test" <?php echo $display;?> >
                <?php showMenus($value['child'], $html, $builderApiObj, $data, $role_node_id, $menu_instanse_node_id, $is_operation_list); ?>
                    </ul>
            <?php } ?>
            </li>
            <?php
        }
        if (strtolower($value['status']) == 'disable') {
            ?>
            <li class="inactive">
                <a class="" data-id="" >
                    <span class="item-list-detail"><?php echo $value['title']; ?></span>
                    <?php /*if (strtolower($value['use counter']) == 'yes') { */?><!--<span id="actives-count" class="badge ">0</span>--><?php /*}*/ ?>
                </a>
                <?php /*if (count($value['child']) > 0) { */?><!--
                    <ul class="item-list list-indent">
                <?php /*showMenus($value['child'], $html, $builderApiObj, $data, $role_node_id, $menu_instanse_node_id, $is_operation_list); */?>
                    </ul>
            --><?php /*}*/ ?>
            </li>
            <?php
        }
        //die();
    }
}

function listHeading($listHeadArray, $setting, $nodeIdArray) {
    $index = 0;
    $newListHeadArray = array();
    foreach ($listHeadArray as $propertyId => $propertyName) {
        $newListHeadArray[$propertyId]['name'] = $propertyName;
        $newListHeadArray[$propertyId]['type'] = $setting[$index]['type'];
        $newListHeadArray[$propertyId]['size'] = $setting[$index]['size'];
        $index++;
    }

    if ($nodeIdArray['isShown'] == 'true') {
        ?>
        <div class="<?php echo $nodeIdArray['size']; ?>">
            <span><?php echo $nodeIdArray['title']; ?></span>
        </div>
        <?php
    }
    foreach ($newListHeadArray as $propertyId => $headArray) {
        ?>
        <div class="<?php echo $headArray['size']; ?><?php if (strtolower($headArray['type']) == 'filter') { ?> filter-menu<?php } ?>">

        <?php if (strtolower($headArray['type']) == 'checkbox') { ?>
                <input type="checkbox" >
        <?php } else if (strtolower($headArray['type']) == 'filter') { ?>
                <span class="open-filter-menu listing-title-wrap" data-statusid="<?php echo $propertyId; ?>">
                    <span class="listing-title"><?php echo $headArray['name']; ?></span> <i class="fa fa-angle-down"></i>
                </span>
                <ul aria-labelledby="dLabel" role="menu" class="dropdown-menu multi-menu">
                    <li class="sort-by col-header-action"><span class="sortedText">Sort A - Z</span><i class="fa fa-times fa-1 resetSort" aria-hidden="true"></i></li>
                    <li class="sort-by col-header-action"><span class="sortedText">Sort Z - A</span><i class="fa fa-times fa-1 resetSort" aria-hidden="true"></i></li>
                    <li class="parent-item">Text Filters <i class="fa fa-angle-right"></i>
                        <ul class="multi-sub-menu dropdown-menu">
                            <li class="sub-filter">Equals To</li>
                            <li class="sub-filter">Not Equals To</li>
                            <li class="sub-filter">Begins With</li>
                            <li class="sub-filter">Ends With</li>
                            <li class="sub-filter">Contains</li>
                            <li class="sub-filter">Does Not Contain</li>
                        </ul>
                    </li>
                    <div class="search-item-wrap">
                        <div class="input-group">
                            <input type="text" class="form-control col-header-str" placeholder="Search" value="" data-save="entr-filter">
                            <span class="input-group-btn">
                                <button class="btn btn-default entr-filter" type="button">
                                    <img class="cross-img" src="http://sta.pu.prospus.com/puidata/page_plugin/component/img/cross-img.png" alt="cross">
                                    <!-- <i class="fa fa-times fa-1" aria-hidden="true"></i> -->
                                </button>
                            </span>
                        </div>
                    </div>
                </ul>
        <?php } else if (strtolower($headArray['type']) == '') { ?>
                <span><?php echo $headArray['name']; ?></span>
        <?php } ?>
        </div>
        <?php
    }
}

function searchContentForDashboard($listArray) {
    unset($listArray['header'][DEAL_PAYMENT_TYPE_PROPERTY_ID]);
    $listHeadArray = $listArray['header'];
    $newListHeadArray = array();
    $propIndex = 0;
    foreach ($listHeadArray as $propertyId => $propertyName) {
        $newListHeadArray[$propertyId]['name'] = $propertyName;
        $propIndex++;
    }
    $listContentArray = $listArray['list'];
    $resArray = array();

    if (count($listContentArray) > 0) {
        $resArray['msg'] = '';
        $mainIndex = 0;
        foreach ($listContentArray as $instanceId => $contentArray) {

            $subindex = 0;
            foreach ($newListHeadArray as $propertyId => $headArray) {
                $propArr = explode(",", $propertyId);
                $propVal = array();
                $propString = '';
                $propIndex = 0;
                foreach ($propArr as $val) {
                    $propVal[$propIndex] = $contentArray[$val];
                    $propIndex++;
                }
                $propString = trim(implode(" ", $propVal));
                $resArray['data'][$mainIndex][$subindex] = $propString;
                $subindex++;
            }
            $mainIndex++;
        }
    } else {
        $resArray['msg'] = 'No Record Found.';
    }
    $resArray['header'] = array_values($newListHeadArray);

    return json_encode($resArray);
}


    function listContent($listArray, $setting, $nodeIdArray, $buildQueryArray, $return = 0, $current_node_id = 0, $pageNum = 1) {
        global $builderApiObj;

        $columnHeaders = isset($listArray['list_head_array']['columns']) ? $listArray['list_head_array']['columns'] : '';
        $index = 0;
        unset($listArray['header'][DEAL_PAYMENT_TYPE_PROPERTY_ID]);
        $listHeadArray = $listArray['header'];
        $newListHeadArray = array();
        foreach ($listHeadArray as $propertyId => $propertyName) {
            $newListHeadArray[$propertyId]['name'] = $propertyName;
            $newListHeadArray[$propertyId]['type'] = $setting[$index]['type'];
            $newListHeadArray[$propertyId]['size'] = $setting[$index]['size'];
            $index++;
        }
        $listContentArray = $listArray['list'];

    $counter = 0;
    ?>

    <?php
    $html = '';
    // This is use for add a hidden row
    if (!$return) {
        $html .= '<div class="row hide hidden-row empty-tr" >';
        foreach ($newListHeadArray as $propertyId => $headArray) {
            $html .= '<div class="' . $headArray['size'] . '" data-statusid="' . $propertyId . '" ></div>';
        }
        $html .= '</div>';
    }

    // End of hidden row
    if (count($listContentArray) > 0) {

        $newBuildQueryArray = $buildQueryArray;

        foreach ($listContentArray as $instanceId => $contentArray) {
            //print_r($headArray);
            $insArray = explode('~#~', $instanceId);
            $newBuildQueryArray['data-id'] = $insArray[0];
            $newBuildQueryArray['data-node-id'] = $insArray[1];
            $newBuildQueryArray['data-role-id'] = $insArray[2];
            $saveType = isset($listArray['save_type']) ? $listArray['save_type'] : $insArray[3];

            if (intval($current_node_id)) {

                $activeTr = ' ';
                if (intval($insArray[1]) == intval($current_node_id)) {

                    $activeTr = ' active-tr';
                }
            } else {
                $activeTr = (intval($counter) == 0) ? ' active-tr' : '';
            }
            $_dealType = $contentArray[DEAL_PAYMENT_TYPE_PROPERTY_ID];
            $_dealType = strtolower($contentArray) == 'finance' ? 'Financing' : $_dealType;
            $_oprTypepid = $builderApiObj->getTableCols(array('node_class_property_id'), 'node-class-property', array('node_class_id', 'caption'), array(OPERATION_CLASS_ID, $_dealType));
            $_oprTypepid = json_decode($_oprTypepid, true)['node_class_property_id'];
            $newBuildQueryArray['deal-type'] = $_dealType;
            $newBuildQueryArray['menu-property-id'] = $_oprTypepid;
            $newBuildQueryArray['page'] = $pageNum;
            $options = htmlentities(json_encode($newBuildQueryArray), ENT_QUOTES, 'UTF-8');

            $html .= '<div data-savetype="' . $saveType . '" data-settings="' . $options . '" data-node-id="' . $insArray[1] . '" data-role-id="' . $insArray[2] . '" data-id="' . $insArray[0] . '" class="row' . $activeTr . '" onclick="renderViewDetails(this,' . $insArray[0] . ', \'view\');" >';
            if ($nodeIdArray['isShown'] == 'true') {
                $html .= '<div class="' . $nodeIdArray['size'] . ' ellipsis">' . $insArray[1] . '</div>';
            }
            foreach ($newListHeadArray as $propertyId => $headArray) {

                $pos = strpos($contentArray[$propertyId], '~#~');

                if ($pos != false) {
                    //$contentArray[$propertyId]=  substr(trim(str_replace('~#~',', ', $contentArray[$propertyId])), 0, -1);
                    $contentArray[$propertyId] = rtrim(str_replace('~#~', ', ', $contentArray[$propertyId]), ", ");
                }
                if (strpos($propertyId, ',') && $columnHeaders != '') {
                    $separator = ', ';
                    foreach ($columnHeaders as $colHead) {
                        //$tempCol = array_pop(explode(">", $colHead));
                        $tempCol = preg_replace('/\(([^\)]+)\)/', '', $colHead);    // remove () separator from it
                        $colHeadArr = explode('=', $tempCol);                       // separate label and properties
                        //preg_match('/(.*)(?==)/', $tempCol, $match);              // check label
                        if (strpos($colHead, '+') && count($colHeadArr) > 1) {        // if concatenate is required
                            if (strtolower(trim($colHeadArr[0])) == strtolower(trim($headArray['name']))) {
                                preg_match('/\(([^\)]+)\)/', $colHead, $match2);
                                if (count($match2)) {
                                    $separator = $match2[1];
                                }
                            }
                        }
                    }
                    $propertyArr = explode(',', $propertyId);
                    $propValue = '';
                    foreach ($propertyArr as $prop) {
                        // SUB STATUS ONLY IN CASE OF - POSTING & FINAL SALE
                        if (isset($contentArray[DEAL_SUB_STATUS_PID]) && strlen($contentArray[DEAL_SUB_STATUS_PID]) && $prop == DEAL_SUB_STATUS_PID) {
                            if (isset($contentArray[DEAL_STATUS_PID]) && ($contentArray[DEAL_STATUS_PID] == 'Posting' || $contentArray[DEAL_STATUS_PID] == 'Final Sale')) {
                                $propValue .= $contentArray[$prop] . $separator;
                            }
                        } else {
                            $propValue .= $contentArray[$prop] . $separator;
                        }
                    }
                    $contentArray[$propertyId] = rtrim($propValue, $separator);
                }
                /**
                * Created by AnilGupta
                * Date: 01-Feb-2017
                * Add conditions for Time-stamp on deal-list         
                */ 
                if ($propertyId == DEAL_STATUS_PID . ',' . DEAL_SUB_STATUS_PID || $propertyId == DEAL_TIMESTAMP_PID || $propertyId == DEAL_ASSIGNED_PID) {

                    $htmlTimeCols = '<div class="' . $headArray['size'] . ' breadcrumb-heading-js" data-statusid="' . $propertyId . '" >' . $contentArray[$propertyId] . '</div>';
                    date_default_timezone_set("Asia/Calcutta");
                    $timeVal = strtotime($contentArray[$propertyId]);
                    if ($propertyId == DEAL_TIMESTAMP_PID && isset($timeVal) && trim($timeVal) != '') {
                        $timeId = rand(10, 100) . "-" . rand(10, 100) . "-" . $timeVal;
                        $htmlTimeCols = '<div class="' . $headArray['size'] . ' breadcrumb-heading-js" data-unixTime="' . $timeVal . '"  data-timeValue="' . $contentArray[$propertyId] . '" data-statusid="' . $propertyId . '" id="timestamp-' . $timeId . '"><script>ConvertToLocalTime(' . $timeVal . ', \'timestamp-' . $timeId . '\')</script></div>';
                    }
                    $html .= $htmlTimeCols;
                } else {
                    $html .= '<div class="' . $headArray['size'] . ' ellipsis breadcrumb-heading-js" data-statusid="' . $propertyId . '" >' . $contentArray[$propertyId] . '</div>';
                }
            } $counter++;
            $html .= '</div>';
        }
    } else {
        $rolesLables = array('ra_454674' => 'Team', 'ra_mine' => 'Mine', 'ra_rm/c/d' => 'Review', 'ra_c/d' => 'Review', 'common_archived' => 'Archived');
        $noSetting = array('status' => $buildQueryArray['status']);
        $noSetting = htmlentities(json_encode($noSetting), ENT_QUOTES, 'UTF-8');
        if ($buildQueryArray['status'] != "") {
            if (empty($buildQueryArray['search_string'])) {
                if (array_key_exists($buildQueryArray['status'], $rolesLables)) {
                    $displaymsg = 'for' . ' "' . $rolesLables[$buildQueryArray['status']] . '"';
                } else {
                    $displaymsg = 'for' . ' "' . $buildQueryArray['status'] . '"';
                }
            }
        }
        $html .= '<div class="no-record-js" data-settings=' . $noSetting . '><div class="noEntry">No Records Found ' . $displaymsg . '</div></div>';
        if (!empty($buildQueryArray['submenu'])) {
            $html .= '<script type="text/javascript">GoToPageModule.loadPageDealAll("' . $buildQueryArray['status'] . '");</script>';
        }
    }
    if ($return) {
        return $html;
    } else {
        echo $html;
        
    }
}

function getViewHtmlOfPage($data) {
    $html = "";
    $instanceId = current($data)['node_instance_id'];
    foreach ($data as $key => $value) {
        $html .= '<div>
            <a class="list-title-heading" data-toggle="collapse" href="#view' . $value['caption_old'] . '" aria-expanded="false" aria-controls="view' . $value['caption_old'] . '">
            <i class="fa fa-angle-down"></i>' . $value['caption_old'] . '
            </a>
            <div class="collapse in" id="view' . $value['caption_old'] . '">';
        if (isset($value['child']) && is_array($value['child'])) {
            $html .= '    <div class="list-detail-section form-horizontal">';
            foreach ($value['child'] as $key1 => $value1) {
                if (trim($value1['value']) == "") {
                    $value1['value'] = '&nbsp;';
                }
                $html .= '          <div class="form-group clearfix">
            <label class="col-sm-4 control-label form-label">' . $value1['caption_old'] . '</label>
            <div class="col-sm-8">
            <span class="list-view-detail">' . $value1['value'] . '</span>
            </div>
            </div>';
            }
            $html .= '    </div>';
        }
        $html .= '  </div>
            </div>';
    }
    $html .= '<input type="hidden" id="id_detail_instance_id" name="id_detail_instance_id" value="' . $instanceId . '" />';
    return $html;
}

function getAllChild($data, $temp) {
    foreach ($data as $key => $value) {
        if (isset($value['child']) && is_array($value['child'])) {

            $temp = getAllChild($value['child'], $temp);
        } else {
            $temp[] = array('id' => $value['node_class_property_id'], 'val' => $value['value']);
        }
    }

    return $temp;
}

function getEditHtmlPropValues($data) {


    $resArr = array();
    $instanceId = current($data)['node_instance_id'];
    $resArr['node_instance_id'] = $instanceId;

    $temp = array();
    foreach ($data as $key => $value) {

        if (isset($value['child']) && is_array($value['child'])) {
            $temp = getAllChild($value['child'], $temp);
        } else {
            $temp[] = array('id' => $value['node_class_property_id'], 'val' => $value['value']);
        }
    }
    $resArr['values'] = $temp;

    /* echo "<pre>";
      print_r($resArr);
      die; */

    return $resArr;
}

function paginationContent($paginationArray) {

    $pagination_record_array = json_decode($paginationArray['pagination_record_array']);
    $recordPerPage = 2;
    $index = 0;
    $total_records = intval($paginationArray['total_record']);

    $item_per_page = intval($paginationArray['record_per_page']) ? intval($paginationArray['record_per_page']) : $recordPerPage;

    $total_pages = ceil(intval($total_records) / intval($item_per_page));
    $current_page = intval($paginationArray['page']);
    if ($current_page == 1) {
        $from = 1;
    } else {
        $from = intval($item_per_page) * (intval($current_page) - 1) + 1;
    }
    if (intval($total_records) < intval($item_per_page)) {
        $to = $total_records;
    } else if (intval($total_records) <= intval($item_per_page) * (intval($current_page)) - 1) {
        $to = $total_records;
    } else {
        $to = intval($item_per_page) * (intval($current_page));
    }
    $right_links = $current_page + 3;
    $previous = $current_page - 1; //previous link
    $next = $current_page + 1; //next link
    $first_link = true; //boolean var to decide our first link
    //if (intval($total_records) > 0) {
    $hideFilter = (isset($paginationArray['searchString']) && $paginationArray['searchString'] != '') ? '' : 'disabled';
    $_hideResetFilter = $_hideNumOfRecords = '';
    if (isset($paginationArray['hide_rest_filter']) && $paginationArray['hide_rest_filter'] == 1) {
        $_hideResetFilter = ' hide ';
    }

    if (isset($paginationArray['hide_numof_records']) && $paginationArray['hide_numof_records'] == 1) {
        $_hideNumOfRecords = ' hide ';
    }
    ?>
    <div class="toggle-btn-box pagination_col <?php echo $_hideResetFilter; ?>">
        <div class="btn-group btn-toggle">
            <!-- <button class="btn btn-default"><i class="fa barIcon"></i></button> -->
          <!--   <button  class="btn btn-primary active powerBtn"><i class="fa powerIcon"></i></button> -->
            <span class="clear-filter clear-filter-js <?php echo $hideFilter; ?> " onclick="leftNavigationModule.resetFilter(this);" data-placement="right" data-toggle="tooltip" data-original-title="Clear Filter"><i class="prs-icon clearfilter"></i></span>
        </div>
    </div>
    <ul class="pagination pagination-sm pagination_col">

        <?php
        if ($current_page > 1) {
            $previous_link = $previous;
            ?>
            <li ><a href="#" data-page="1"><span class="move-prev"><i class="fa fa-angle-double-left"></i></span></a></li>
            <li ><a href="#" data-page="<?php echo $previous_link; ?>" ><span class="move-prev"><i class="fa fa-angle-left"></i></span></a></li>
            <?php
            for ($i = ($current_page - 2); $i < $current_page; $i++) { //Create left-hand side links
                if ($i > 0) {
                    ?>
                    <li><a href="#" data-page="<?php echo $i ?>"><span><?php echo $i; ?></span></a></li>
                    <?php
                }
            }
            $first_link = false;
        }

        if ($first_link) {  //if current active page is first link
            ?>
            <li ><a href="#" data-page="<?php echo $current_page; ?>"><span class="current"><?php echo $current_page; ?></span></a></li>
        <?php } elseif ($current_page == $total_pages) { //if it's the last active link         ?>
            <li ><a href="#" data-page="<?php echo $current_page; ?>"><span class="current"><?php echo $current_page; ?></span></a></li>
    <?php } else { //regular current link           ?>

            <li ><a href="#" data-page="<?php echo $current_page; ?>"><span class="current"><?php echo $current_page; ?></span></a></li>

            <?php
        }
        for ($i = $current_page + 1; $i < $right_links; $i++) { //create right-hand side links
            if ($i <= $total_pages) {
                ?>
                <li><a href="#" data-page="<?php echo $i; ?>"><span ><?php echo $i; ?></span></a></li>
                <?php
            }
        }

        if ($current_page < $total_pages) {
            $next_link = ($i > $total_pages) ? $total_pages : $i;
            ?>
            <li ><a href="#" data-page="<?php echo $next ?>"><span class="move-next"><i class="fa fa-angle-right"></i></span></a></li>
            <li ><a href="#" data-page="<?php echo $total_pages; ?>"><span class="move-next"><i class="fa fa-angle-double-right"></i></span></a></li>
    <?php } ?>
    </ul>
    <div class="pagination-right-col">
        <div class="pagination-select pagination_col <?php echo $_hideNumOfRecords; ?>">


            <select class="form-control form-select" id="paginateChunk" name="paginateChunk"  onchange="getRecordPageDetail(this, 1)">
                <?php for ($k = 0; $k < count($pagination_record_array); $k++) { ?>
                    <option <?php if (intval($pagination_record_array[$k]) == intval($item_per_page)) { ?> selected="selected" <?php } ?> value="<?php echo $pagination_record_array[$k]; ?>"><?php echo $pagination_record_array[$k]; ?> per page</option>
    <?php } ?>
            </select>
        </div>

        <span class="oftotal pagination_col">
            <!-- <span class="clear-filter clear-filter-js <?php echo $hideFilter; ?> " onclick="leftNavigationModule.resetFilter(this);" data-placement="right" data-toggle="tooltip" data-original-title="Clear Filter"><i class="prs-icon clearfilter"></i></span> -->
            <?php if (intval($total_records) == 0) { ?>
                0-<?php echo $to; ?> of <span id="search-total"><?php echo $total_records; ?></span>
            <?php } else { ?>
        <?php echo $from; ?>-<?php echo $to; ?> of <span id="search-total"><?php echo $total_records; ?></span>
    <?php } ?>
        </span>
    </div>
    <?php
    //}
}

function getHtmlRoleLayout($instanceArray, $mappedRoleArray, $login_role_id, $requiredRolesArray, $showVisibleRoles, $fullName = "", $email = "", $edit_role_permission = 0) {
    //$newArray = array();
    $newArray = $instanceArray;
    /* foreach ($instanceArray as $key => $value) {
      $newArray[$value['Role Type']][$key] = $value;
      } */

    $html = '<form id="role_actor_mapping" class="no-popup" name="role_actor_mapping" method="post" >';
    foreach ($newArray as $instanceId => $instanceArray) {  //print_r($instanceArray);
        //$html .= '<div class="role-section">';
        /* $html .= '<a class="role-heading" data-toggle="collapse" href="#' . $key . '" aria-expanded="true" aria-controls="' . $key . '">
          <h2><i class="fa fa-angle-down"></i>' . $key . '</h2></a>'; */
        //$html .= '<div class="collapse in" id="' . $key . '" aria-expanded="true">';
        //foreach ($value as $instanceId => $instanceArray) {
        $_required = '';
        if (in_array($instanceId, $requiredRolesArray)) {
            $_required = '<span class="astrix">*</span>';
        }

        $userName = 'Undefined';
        $userId = '';
        $node_instance_id = '';
        if (count($mappedRoleArray) > 0) {
            $tempArray = $mappedRoleArray[$instanceId];
            $userId = $tempArray['actor'];
            $userName = isset($tempArray['user_name']) ? $tempArray['user_name'] : 'Undefined';
            $node_instance_id = $tempArray['node_instance_id'];
        }

        $divClass = '';
        $hideClass = '';
        $selectClass = '';
        /* if (trim($instanceArray['Title']) == 'Revenue Manager') {
          $divClass = ' inactive';
          } */

        /* if (in_array($login_role_id, array(ROLE_SALES_CONSULTANT))) {
          if (trim($instanceId) == ROLE_BUSINESS_MANAGER) {
          $hideClass = ' hide';
          }
          } else if (in_array($login_role_id, array(ROLE_BUSINESS_MANAGER))) {
          if (trim($instanceId) == ROLE_SELLER || trim($instanceId) == ROLE_SALES_CONSULTANT) {
          $hideClass = ' hide';
          }
          } */

        //        if (trim($instanceId) == ROLE_SELLER) {
        //            if (trim($userName) && ( trim($userName) == 'Undefined' )) {
        //                $userId = '';
        //                $userName = 'MarineMax Inc.';
        //                $selectClass = ' inactive';
        //            }
        //        }

        if ($showVisibleRoles == 0 && $userName == 'Undefined') {
            $hideClass = ' hide';
        }

        $buttonClass = '';
        $icon = '';
        if ($instanceId == '454659' && $fullName != '') {
            $buttonClass = ' inactive ';
            if ($userName == 'Undefined') {
                $icon = '  <i class="fa fa-exclamation" aria-hidden="true" style="cursor:pointer;color:red;" data-toggle="modal" data-target="#exclamationPopup" ></i>';
                $userName = $fullName;
            }
        }

        //Task: 262.4.13.7: Remove required role assignments RM should be auto (Kelly), and RA should remain unassigned for Revenue Team Queue
        else if ($instanceId == ROLE_REVENUE_MANAGER) {
            //$buttonClass = ' inactive ';
            if ($userName == 'Undefined') {
                global $builderApiObj;
                $userId = $individual_instance_node_id = INDIVIDUAL_INSTANCE_NODE_ID;
                $result = $builderApiObj->getFieldDataBy($individual_instance_node_id);
                $user_info = json_decode($result, true);
                $fullname_array = array();
                foreach ($user_info as $info) {
                    if (trim($info['caption']) == 'First Name') {
                        $fullname_array[0] = $info['value'];
                    } elseif (trim($info['caption']) == 'Last Name') {
                        $fullname_array[1] = $info['value'];
                    }
                }
                $userName = implode(" ", $fullname_array);
            }
        }
        /* Task: 262.4.13.7: End Here */

        if ($login_role_id == ROLE_REVENUE_MANAGER || $login_role_id == ROLE_REVENUE_ACCOUNTANT) {
            if ($instanceId != ROLE_REVENUE_ACCOUNTANT) {
                //$buttonClass = ' hide';
            }

            /* if ($instanceId == ROLE_REVENUE_ACCOUNTANT)
              {
              $userId = '';
              $userName = 'Undefined';
              } */
        }

        if ($instanceId == ROLE_REVENUE_ACCOUNTANT && $userName == 'Undefined') {
            $userName = '';
        }

        $html .= '<div class="role-row' . $divClass . '' . $hideClass . '" id="page_role_' . $instanceId . '">
                        <div class="role-head-row">
                            <i class="prs-icon roles"></i>
                            <span>' . html_entity_decode($instanceArray['Title']) . $_required . '</span>
                        </div>
                        <div class="role-body-row">
                            <input type="hidden" id="mapping_role_instance_ids_' . $instanceId . '" name="mapping_role_instance_ids[]" value="' . $node_instance_id . '" />
                            <input type="hidden" id="mapping_role_ids_' . $instanceId . '" name="mapping_role_ids[]" value="' . $instanceId . '" />
                            <input type="hidden" id="mapping_actor_ids_' . $instanceId . '" name="mapping_actor_ids[]" value="' . $userId . '" />
                            <input type="hidden" id="mapping_document_ids_' . $instanceId . '" name="mapping_document_ids[]" value="N/A" />
                            <i class="prs-icon user"></i>
                            <span id="page_role_actor_' . $instanceId . '" >' . ucwords($userName) . '</span>' . $icon;
        //echo $edit_role_permission.'--'.$login_role_id.'--'.ROLE_REVENUE_ACCOUNTANT.'--'.$userId.'--'.ROLE_REVENUE_MANAGER.'--'.'kunal';
        if ($login_role_id == ROLE_REVENUE_ACCOUNTANT && $userId == '') {
            $html .= '<button class="btn btn-black j_my_search_open deal-role-btn' . $selectClass . '' . $buttonClass . '" type="button" onclick="assignRoleOfRA(\'--\',' . $node_instance_id . ');" >Select</button>';
        }
//        else if ($login_role_id == ROLE_REVENUE_MANAGER && $instanceId == ROLE_REVENUE_ACCOUNTANT){
//            if($edit_role_permission)
//            {
//                $html .= '<button class="btn btn-black j_my_search_open deal-role-btn' . $selectClass . '' . $buttonClass . '" type="button" onclick="searchActorForParticulerRole(\'page_role_actor_' . $instanceId . '\','.$instanceId.');" >Select</button>';
//            }
//        }
        else {
            if ($edit_role_permission && $instanceArray['role_node_id'] != $login_role_id) {
                $html .= '<button class="btn btn-black j_my_search_open deal-role-btn' . $selectClass . '' . $buttonClass . '" type="button" onclick="searchActorForParticulerRole(\'page_role_actor_' . $instanceId . '\',' . $instanceId . ');" >Select</button>';
            }
        }
        $html .= '</div></div>';
        //}
        //$html .= '</div>';
        //$html .= '</div>';
    }
    //$html .= '<span class="role-required"><span class="astrix">*</span>(Required Roles)</span></form>';

    return $html;
}

function getHtmlActorLayout($_data = '') {
    $_html = '';

    if (count($_data)) {
        $_firstName = array_column($_data, 'First Name');
        array_multisort($_firstName, SORT_ASC, $_data);
        $count = 0;
        foreach ($_data as $key => $value) {
            $activeClass = '';
            if (intval($count) == 0) {
                $activeClass = 'active';
            }

            $_userName = ucwords($value['First Name'] . ' ' . $value['Last Name']);
            $_html .= '<li  data-userId="' . $value['user_id'] . '" class = "' . $activeClass . '"><div class="user-img-col"><img src="' . BASE_URL_API . 'component/img/user.png"></div><div class="user-detail-col"><a class="list-user-name">' . $_userName . '</a><span>' . $value['Email Address'] . '</div></li>';
            $count++;
        }
    } else {
        $_html .= '<li class="no-record-list noEntry"><div class="user-detail-col"><a class="list-user-name">No Records Found</a></div></li>';
    }


    return $_html;
}

function cmp($a, $b) {
    $p1 = $a['Sequence'];
    $p2 = $b['Sequence'];
    return (float) $p1 > (float) $p2;
}

function getOptionalOperationHtmlList($data, $deal_node_instance_id, $deal_actor_role_node_id, $deal_instance_node_id, $login_user_id) {

    global $builderApiObj;

    $html = '';
    $index = 0;
    $total = intval(count($data)) - 1;


    $mappingRoleActorInstanceId = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_node_instance_id, $deal_actor_role_node_id, $login_user_id));
    
    // $instanceData = $builderApiObj->getOperationListByRoleAndDealPaymentType($deal_node_instance_id, $deal_actor_role_node_id, $mapping_class_node_id['classNodeid'], $login_user_id, $deal_instance_node_id, 'all', 'none', 'Optional');
    // $instanceArray = json_decode($instanceData, true);
    // $optionalOperationArray = $instanceArray['data'][0];
    $res = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_instance_id');
    $resData = json_decode($res, true);
    $operationArray = array();
    foreach ($resData['data'] as $key => $array) {
        if ($array["Mapping_Role_Actor"] == $mappingRoleActorInstanceId) {
            $operationArray[] = $array["Operation"];
        }
    }
    $operationCheckCount = 0;
    foreach ($data as $key => $value) {

        $is_checked = '';
        if (in_array($key, $operationArray)) {
            $is_checked = 'checked="checked"';
            $operationCheckCount++;
        }

        $_image = '<a><i class="prs-big-icon"></i></a>';
        if (!empty($value['Icon'])) {
            $_image = '<a><img class="imageListJs" src="' . $value['Icon'] . '"></img></a>';
        }

        $html .= '<div class="flex-grid clearfix" id="opration_id_' . $key . '" onclick="checkSingleOptional(' . $key . ')" >
                    <div class="flex-col"><div class="custom-checkbox"><input name="optional_ope_ids" type="checkbox" ' . $is_checked . ' data-operation-id="' . $key . '" data-mapping-role-actor="' . $mappingRoleActorInstanceId . '"><label class=""></label></div></div>
                    <div class="flex-col workflow-icon">' . $_image . '</div>
                    <div class="flex-col workflow-body">';

        $html .= '<h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4>

                            <p>' . $value['Description'] . '</p>
                        </div>
                    </div>';

        $index++;
    }

    if ($html == '') {
        $html .= '<div class="no-record-operation-list">
                    <div class="no-record-list noEntry" >No Records Found</div>
                </div>';
    }

    $button = '';
    $class_name = 'uncheck';
    $select_text = 'Select All';

    if (intval($index) == intval($operationCheckCount)) {
        $class_name = 'check';
        $select_text = 'Unselect All';
    }
    $button = '<a id="check_all_optional_anchor" href="#" onclick="toggleChecked(this, \'input[name=optional_ope_ids]\', \'.jq_flyout\')" data-placement="left" class="tooltip-item action-accept-invitation">
                    <i class="prs-icon ' . $class_name . '"></i><br><span>' . $select_text . '</span>
                </a>';

    return $html . '#~##~#' . $button;
}

function getDocumentHtmlList($data, $brokerage_node_id, $mapping_ins_id, $documentId, $flag) {
    $html2 = '';
    $maxColumns = 0;

    if (isset($data)) {
        $statementsHtml = '';
        $numberingFlag = 0;
        foreach ($data as $stmt) {
            /*
             * htmlspecialchars_decode added
             * as Awdhesh has applied htmlspecialchars
             * and this content is not coming properly
             */
            $html = htmlspecialchars_decode(current($stmt));
            $statementsHtml .= $html;

            preg_match('/(?<=data-x=")[\d]+(?=")/', $html, $match1);
            $maxColumns = (current($match1) > $maxColumns) ? current($match1) : $maxColumns;
            preg_match('/(?<=data-s=")[\d.]+(?=")/', $html, $match2);
            if (strlen(current($match2)) > 0) {
                $numberingFlag = 1;
            }
        }
        $maxColumns++;
    }
    $_userNotification = '<div class="notification-wrap"><div id="notification-row-list" class="notification-row" style="display:none"><p></p></div></div>';
    $html2 .= $_userNotification . '<input type="hidden" id="mapping_ins_content_id" value="' . $mapping_ins_id . '" data-document-id="' . $documentId . '" data-mode-type="' . $flag . '" >
        <div class="edtContainer structuredMode" style="display:block">
            <div id="hiddenTemp"></div>
        <div id="tableContextMenu">
            <ul>
            <li><a href="javascript:void" data-action="rowAbove">Insert Row Above</a></li>
            <li><a href="javascript:void" data-action="rowBelow">Insert Row Below</a></li>
            <li><a href="javascript:void" data-action="columnLeft">Insert Column Left</a></li>
            <li><a href="javascript:void" data-action="columnRight">Insert Column Right</a></li>
            <li><a href="javascript:void" data-action="deleteRow">Delete Row</a></li>
            <li><a href="javascript:void" data-action="deleteColumn">Delete Column</a></li>
            <li><a href="javascript:void" data-action="deleteTable">Delete Table</a></li>
            </ul>
        </div>
        <div id="tagContextMenu">
            <ul>
            <li><a href="javascript:void" data-action="removeTag">Remove Tag</a></li>
            </ul>
        </div>
        <div id="printMarginBox">
             <div>Margins (inches)</div>
             <div><input type="text" size="2" class="edtPrintMargins" id="edtPrintMarginTop" value="1"> Top</div>
             <div><input type="text" size="2" class="edtPrintMargins" id="edtPrintMarginBottom" value="1"> Bottom</div>
             <div><input type="text" size="2" class="edtPrintMargins" id="edtPrintMarginLeft" value="1"> Left</div>
             <div><input type="text" size="2" class="edtPrintMargins" id="edtPrintMarginRight" value="1"> Right</div>
             <div><button id="edtPrintCommand">Print</button> <button id="edtPrintCommandCancel">Cancel</button></div>
        </div>
        <div id="edtformElements">
             <ul>
                <li><a href="javascript:void" data-action="createNew">Definitive</a></li>
                <li><a href="javascript:void" data-action="createExisting">Referential</a></li>
             </ul>
        </div>
        <div id="edtHyperlinkPopup">
            <div>Link : <input type="text" id="edtHyperlinkText" class="form-control input-field" autofocus/></div>
            <div>
              <button id="saveedtHyperlinkText" class="btn btn-default btn-sm">Ok</button>
              <button id="canceledtHyperlinkText" class="btn btn-default btn-sm">Cancel</button>
            </div>
        </div>
        <div id="edtTagElements">
            <ul>
            <li><a href="javascript:void" data-action="Actor">Actor</a></li>
            <li><a href="javascript:void" data-action="Role">Role</a></li>
            <li><a href="javascript:void" data-action="Terms">Terms</a></li>
            <li><a href="javascript:void" data-action="dynamicField">Dynamic Field</a></li>
            <li><a href="javascript:void" data-action="showtaggeditems">Show Tagged Items</a></li>
            </ul>
        </div>
        <div id="edtHyperlinkPreview">
            <div>Visit : <a href="#" id="edtHyperlinkPreviewText" target="_blank"></a></div>
            <div>
              <button id="removeedtHyperlinkPreviewText" class="btn btn-default btn-sm">Remove Link</button>
            </div>
        </div>
        <div id="edtformElementsTextProperties" class="edtPopUp">
            <div>
                <label class="label-field">Field Name:</label>
                <input type="text" id="edtPropAttrName" class="form-control input-field" placeholder="Required"/>
            </div>
            <div>
                <label class="label-field">Field Value :</label>
                <input type="text" id="edtPropAttrValue" class="form-control input-field"/>
            </div>
            <div>
                <button id="saveedtformElementsTextProperties" class="btn btn-default btn-sm">Save</button>
                <button id="deleteedtformElementsTextProperties" class="btn btn-default btn-sm">Delete</button>
                <button id="canceledtformElementsTextProperties" class="btn btn-default btn-sm">Cancel</button>
                <div class="dropdown">
                <button id="tagformElementsTextProperties" class="btn btn-default btn-sm" data-toggle="dropdown">Tag<span class="caret"></span></button>
                  <ul class="dropdown-menu tagEdtDynamicField">
                    <li><a href="javascript:void(0)" data-action="Actor">Actor</a></li>
                    <li><a href="javascript:void(0)" data-action="Role">Role</a></li>
                    <li><a href="javascript:void(0)" data-action="Terms">Terms</a></li>
                  </ul>
                </div>

            </div>
        </div>
        <div id="edtformElementsTextPropertiesReference" class="edtPopUp">
             <ul></ul>
             <div>
                <button id="canceledtformElementsTextPropertiesReference" class="btn btn-default btn-sm">Cancel</button>
             </div>
        </div>
        <div class="color-plates-wrap unselectable" id="ColorPlatesSection">
             <table cellpadding="0" cellspacing="0">
                <tr>
                   <td style="background:#000000"></td>
                   <td style="background:#434343" ></td>
                   <td style="background:#666666"></td>
                   <td style="background:#999999"></td>
                   <td style="background:#B7B7B7"></td>
                   <td style="background:#CCCCCC"></td>
                   <td style="background:#D9D9D9"></td>
                   <td style="background:#EFEFEF"></td>
                   <td style="background:#F3F3F3"></td>
                   <td style="background:#FFFFFF"></td>
                </tr>
             </table>
             <table cellpadding="0" cellspacing="0">
                <tr>
                   <td style="background:#980000"></td>
                   <td style="background:#FF0000"></td>
                   <td style="background:#FF9900"></td>
                   <td style="background:#FFFF00"></td>
                   <td style="background:#00FF00"></td>
                   <td style="background:#00FFFF"></td>
                   <td style="background:#4A86E8"></td>
                   <td style="background:#0000FF"></td>
                   <td style="background:#9900FF"></td>
                   <td style="background:#FF00FF"></td>
                </tr>
             </table>
             <table cellpadding="0" cellspacing="0">
                <tbody>
                   <tr>
                      <td style="background:#E6B8AF"></td>
                      <td style="background:#F4CCCC"></td>
                      <td style="background:#FCE5CD"></td>
                      <td style="background:#FFF2CC"></td>
                      <td style="background:#D9EAD3"></td>
                      <td style="background:#D0E0E3"></td>
                      <td style="background:#C9DAF8"></td>
                      <td style="background:#CFE2F3"></td>
                      <td style="background:#D9D2E9"></td>
                      <td style="background:#EAD1DC"></td>
                   </tr>
                   <tr>
                      <td style="background:#DD7E6B"></td>
                      <td style="background:#EA9999"></td>
                      <td style="background:#F9CB9C"></td>
                      <td style="background:#FFE599"></td>
                      <td style="background:#B6D7A8"></td>
                      <td style="background:#A2C4C9"></td>
                      <td style="background:#A4C2F4"></td>
                      <td style="background:#9FC5E8"></td>
                      <td style="background:#B4A7D6"></td>
                      <td style="background:#D5A6BD"></td>
                   </tr>
                   <tr>
                      <td style="background:#CC4125"></td>
                      <td style="background:#E06666"></td>
                      <td style="background:#F6B26B"></td>
                      <td style="background:#FFD966"></td>
                      <td style="background:#93C47D"></td>
                      <td style="background:#76A5AF"></td>
                      <td style="background:#6D9EEB"></td>
                      <td style="background:#6FA8DC"></td>
                      <td style="background:#8E7CC3"></td>
                      <td style="background:#C27BA0"></td>
                   </tr>
                   <tr>
                      <td style="background:#A61C00"></td>
                      <td style="background:#CC0000"></td>
                      <td style="background:#E69138"></td>
                      <td style="background:#F1C232"></td>
                      <td style="background:#6AA84F"></td>
                      <td style="background:#45818E"></td>
                      <td style="background:#3C78D8"></td>
                      <td style="background:#3D85C6"></td>
                      <td style="background:#674EA7"></td>
                      <td style="background:#A64D79"></td>
                   </tr>
                   <tr>
                      <td style="background:#85200C"></td>
                      <td style="background:#990000"></td>
                      <td style="background:#B45F06"></td>
                      <td style="background:#BF9000"></td>
                      <td style="background:#38761D"></td>
                      <td style="background:#134F5C"></td>
                      <td style="background:#1155CC"></td>
                      <td style="background:#0B5394"></td>
                      <td style="background:#351C75"></td>
                      <td style="background:#741B47"></td>
                   </tr>
                   <tr>
                      <td style="background:#5B0F00"></td>
                      <td style="background:#660000"></td>
                      <td style="background:#783F04"></td>
                      <td style="background:#7F6000"></td>
                      <td style="background:#274E13"></td>
                      <td style="background:#0C343D"></td>
                      <td style="background:#1C4587"></td>
                      <td style="background:#073763"></td>
                      <td style="background:#20124D"></td>
                      <td style="background:#4C1130"></td>
                   </tr>
                </tbody>
             </table>
        </div>
        <div class="edtHeader doc-wrap hide">

            <div class="tollbar-panel">
                <!-- Nav tabs -->
                <ul class="nav nav-tabs doc-tollbar" role="tablist">
                   <li role="presentation"><a href="#File" aria-controls="File" role="tab" class="open-file1" data-toggle="tab">File</a></li>
                   <li class="" role="presentation"><a href="#Edit" aria-controls="Edit" role="Edit" data-toggle="tab">Page</a></li>
                    <li class="" role="presentation"><a href="#View" aria-controls="View" role="Edit" data-toggle="tab">Options</a></li>
                   <li role="presentation" ><a href="#Insert" aria-controls="messages" role="Insert" data-toggle="tab" class="inactiveTab" >Insert</a></li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content doc-tollbar-wrap">


                  <!-- div used inside the document panel -->

                   <div role="tabpanel" class="tab-pane file1" id="File"></div>


                   <div role="tabpanel" class="tab-pane " id="Edit">
                        <div class="doc-edit-pane">
                            <div>
                                <h2>Page Setup</h2>
                                <div class="doc-edit-inner-pane">
                                    <form class="form-horizontal">
                                        <div class="form-group">
                                            <span class="col-sm-12 print-mode inactivePrintMode" id="printMode">
                                             <i class="icon tick"></i>
                                             Print Layout View
                                            </span>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-4 label-field">Page Size</label>
                                            <div class="col-sm-8">
                                                <div class="select-wrap">
                                                    <span class="viewOptions">
                                                        <select id="viewOpts" class="select-field">
                                                            <option value="responsive" data-width="100">Responsive</option>
                                                            <option value="letter" data-width="8.5" data-landscape-width="11">Letter</option>
                                                            <option value="legal" data-width="8.5" data-landscape-width="14">Legal</option>
                                                            <option value="tabloid" data-width="11" data-landscape-width="17">Tabloid</option>
                                                            <option value="a3" data-width="11.69" data-landscape-width="16.54">A3</option>
                                                            <option value="a4" data-width="8.27" data-landscape-width="11.69">A4</option>
                                                            <option value="a5" data-width="5.83" data-landscape-width="8.27">A5</option>
                                                        </select>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-4 label-field">Orentation</label>
                                            <div class="col-sm-8 radio-section">
                                              <span class="unselectable printLandscape" style="display:none">
                                                <input type="checkbox" id="printLandscape"/>Landscape
                                              </span>
                                              <select class="select-field" id="changeDocMode">
                                                  <option data-value="potrait">Potrait</option>
                                                  <option data-value="landscape">Landscape</option>
                                              </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div>
                                <h2>Margins</h2>
                                <div class="doc-edit-inner-pane">
                                    <form class="form-horizontal">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group disabledField">
                                                    <label class="col-sm-4 label-field">Top</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-field" placeholder="0.25">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group disabledField">
                                                    <label class="col-sm-4 label-field">Bottom</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-field" placeholder="0.25">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group disabledField">
                                                    <label class="col-sm-4 label-field">Left</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-field" placeholder="0.25">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group disabledField">
                                                    <label class="col-sm-4 label-field">Right</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-field" placeholder="0.25">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="user-action-wrap">
                          <a class="user-roles ref-hideTollbar">
                            <i class="icon save" data-original-title="" title=""></i>
                            <br><span>Save</span>
                          </a>
                          <a class="user-roles ref-hideTollbar">
                            <i class="icon cancel" data-original-title="" title=""></i>
                            <br><span>Close</span>
                          </a>
                        </div>

                   </div>

                   <div role="tabpanel" class="tab-pane " id="View">
                        <div class="doc-edit-pane">
                          <h2>Page Option</h2>
                          <div class="toggle-outlines">
                            <table class="table">
                              <tr>
                                <td>Table of Content </td>
                                <td>
                                  <div>
                                    <label>
                                      <input type="checkbox" id="do_Toc">
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>Toggle Tag</td>
                                <td>
                                  <div>
                                    <label>
                                      <input type="checkbox" id="do_toggle_tags" checked>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </div>

                        </div>
                        <div class="user-action-wrap">
                          <a class="user-roles ref-hideTollbar">
                            <i class="icon cancel" data-original-title="" title=""></i>
                            <br><span>Close</span>
                          </a>
                        </div>

                   </div>

                   <div role="tabpanel" class="tab-pane" id="Insert">Insert</div>
                </div>
            </div>
            <div class="alignment-type">
                <ul class="switch-on-off" id="OnOffMode">
                   <li class="active" data-value="structured">Structured</li>
                   <li data-value="unstructured">Styled</li>
                </ul>
            </div>
            <div class="alignment-section">
                 <span class="unselectable" style="display:none">
                   <select id="documentMode" class="select-field" >
                      <option value="structured">Structured</option>
                      <option value="unstructured">Styled</option>
                   </select>
                </span>
                <span  class="unselectable unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Font">
                   <select id="fontStyle" class="select-field" >
                      <option value="select">Font Family</option>
                      <option value="open sans">Open Sans</option>
                      <option value="arial">Arial</option>
                      <option value="verdana">Verdana</option>
                      <option value="times new roman">Times New Roman</option>
                   </select>
                </span>
                <span class="unselectable unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Font Size">
                   <select id="fontSize" class="select-field" style="width:50px;">
                      <option value="select">Size</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="18">18</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                   </select>
                </span>
                <span class="doFontColor icon unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Text Color">&nbsp;</span>
                <span class="doBG icon unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Text Highlight">&nbsp;</span>
                <span class="doBold icon unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Bold">&nbsp;</span>
                <span class="doItalic icon unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Italic">&nbsp;</span>
                <span class="doUnderline icon unstructuredIcon showTootip" data-toggle="tooltip" data-placement="bottom" title="Underline">&nbsp;</span>
                <span class="doList icon showTootip" data-toggle="tooltip" data-placement="bottom" title="Bulleted List">&nbsp;</span>
                <span class="doTable icon showTootip" data-toggle="tooltip" data-placement="bottom" title="Table">&nbsp;</span>
                <span class="doSplit icon showTootip" data-toggle="tooltip" data-placement="bottom" title="Line Break">&nbsp;</span>
                <span class="doDynamicText icon showTootip" data-toggle="tooltip" data-placement="bottom" title="Form fields">&nbsp;</span>
                <span class="doHyperLink icon"  data-toggle="tooltip" data-placement="bottom" title="Hyper Link">&nbsp;</span>
                <span class="doTagFields icon" data-toggle="tooltip" data-placement="bottom" title="Tag Fields">&nbsp;</span>
                <span class="doRemoveBlankStatements icon" data-align="edtJustify" data-toggle="tooltip" data-placement="bottom" title="Remove Blank Statements">&nbsp;</span>

                <span class="doFindReplace icon"  data-toggle="tooltip" data-placement="bottom" title="Find and Replace">&nbsp;</span>
                <span class="doUndo icon"  data-toggle="tooltip" data-placement="bottom" title="Undo">&nbsp;</span>
                <span class="doRedo icon"  data-toggle="tooltip" data-placement="bottom" title="Redo">&nbsp;</span>
                <span class="doImageUpload icon"  data-toggle="tooltip" data-placement="bottom" title="Upload Image"><input type="file" id="uploadImage"/></span>
                <span class="doLeftAlign icon unstructuredIcon showTootip" data-align="edtLeftALign" data-toggle="tooltip" data-placement="bottom" title="Left Align">&nbsp;</span>
                <span class="doCenter icon unstructuredIcon showTootip" data-align="edtCenter" data-toggle="tooltip" data-placement="bottom" title="Center">&nbsp;</span>
                <span class="doRightAlign icon unstructuredIcon showTootip" data-align="edtRightAlign" data-toggle="tooltip" data-placement="bottom" title="Right Align">&nbsp;</span>
                <span class="doJustify icon unstructuredIcon showTootip" data-align="edtJustify" data-toggle="tooltip" data-placement="bottom" title="Justify">&nbsp;</span>
                <span class="unselectable statementNums showTootip" data-toggle="tooltip" data-placement="bottom" title="Statement Number">
                  <input type="checkbox" id="sNumbers" />
                  <span class="icon smtNum"></span>
                </span>
                 <span class="doTotalsWords">&nbsp;</span>
                <!-- <span class="unselectable viewOptions">
                   <select id="viewOpts" class="select-field">
                      <option value="responsive" data-width="100">Responsive</option>
                      <option value="letter" data-width="8.5" data-landscape-width="11">Letter</option>
                      <option value="legal" data-width="8.5" data-landscape-width="14">Legal</option>
                      <option value="tabloid" data-width="11" data-landscape-width="17">Tabloid</option>
                      <option value="a3" data-width="11.69" data-landscape-width="16.54">A3</option>
                      <option value="a4" data-width="8.27" data-landscape-width="11.69">A4</option>
                      <option value="a5" data-width="5.83" data-landscape-width="8.27">A5</option>
                   </select>
                </span>
                <span class="unselectable printLandscape">
                <input type="checkbox" id="printLandscape"/>Landscape
                </span>
                <span class="doPrint icon">&nbsp;</span>     -->
                <!--  <span class="sepretor"></span> -->
                <span class="versionName">V34</span>
            </div>


        </div>
            <div class="edtMainCol">
              <div class="edtCol1">
            <div class="tocHeaderMain">
            <div class="tocHeader">
            <div class="heading">
              <span class="textOutline">Outline</span>
              <span><select id="edtAutoLevels" class="select-field"></select></span>
              <span id="refreshTOC">&nbsp;</span></div>
            </div>
            <div class="edtTOC niceScrollDiv">
                <ul></ul>
              </div>
              </div>
          </div><div class="edtCol2">

                <div class="edtBody">
                    <div class="niceScrollDiv DocInsideHig mainScroll">
                        <div class="edtCustomLoader"></div>
                        <div class="collapsableEDTLevelsContent"></div>';
    /* <div class="numbering"></div> */
    $html2 .= '<div contenteditable="false" spellcheck="false" class="edt structured" id="edt" style="background:#fff;">';
    if (!empty($statementsHtml)) {
        $url = ABS_API_URL;
        $html2 .= preg_replace('/(?<=src=")([^"]*)(?=files\/)/', $url, $statementsHtml);
        //$html2 .= preg_replace('/(?<=src=")([^"]+)(?=")/', $url . '$1', $statementsHtml);
        //$regex = '#<img([^>]*) src="([^"/]*/?[^".]*\.[^"]*)"([^>]*)>((?!</a>))#';
        //$replace = "<img". '$1'."src=".$url . '$2'.">".'$3';
        //$html2 .= preg_replace($regex, $replace, $statementsHtml);
        //$html2 .=$statementsHtml;
    } else {
        $html2 .= '<div class="edtParagraph" data-x="0" data-s=""><br></div>';
    }
    $html2 .= '</div>
                    </div>
                </div>
              </div>
            </div>
        </div>';
    return $html2;
}

function sendMail($to, $subject, $body, $from = '') {
    $from = ($from == '') ? "info@marinemax.com" : $from;
    $headers = '';
    $headers = 'MIME-Version: 1.0' . PHP_EOL;
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . PHP_EOL;
    $headers .= 'From: ' . @$from . '<' . @$from . '>' . PHP_EOL;
    // Mail is diabled for now
    mail($to, $subject, $body, $headers);
}

function getHtmlStockLayout($dataArray) {
    $_html = '';

    if (count($dataArray)) {
        foreach ($dataArray as $key => $value) {
            if (is_array($value) && !empty($value)) {
                foreach ($value as $k => $v) {
                    foreach ($v as $kk => $vv) {
                        $_html .= '<li><div class="user-detail-col"><b>' . $key . ',' . $kk . ':</b> ' . $vv . '</div></li>';
                    }
                }
            } else {
                $_html .= '<li><div class="user-detail-col"><b>' . $key . ':</b> ' . $value . '</div></li>';
            }
        }
    } else {
        $_html .= '<li class="no-record-list noEntry"><div class="user-detail-col"><a class="align-center">No Records Found</a></div></li>';
    }


    return $_html;
}

function getHtmlCustomerLayout($dataArray) {
    $_html = '';

    if (count($dataArray)) {
        foreach ($dataArray as $key => $value) {
            foreach ($value as $valkey => $valValue) {
                $_html .= '<li><div class="user-detail-col"><b>' . $valkey . ':</b> ' . $valValue . '</div></li>';
            }
        }
    } else {
        $_html .= '<li class="no-record-list noEntry"><div class="user-detail-col"><a class="align-center">No Records Found</a></div></li>';
    }


    return $_html;
}

function dealMailSend($node_id, $login_user_id) {
    $builderApiObj = new builderApi();
    $roleData = $builderApiObj->getActorWithRoleAndDeal($node_id);
    $roleArray = json_decode($roleData, true);
    $sendMailArray = array();
    foreach ($roleArray['data'] as $key => $value) {
        if (trim($value['actor']) != '' && trim($value['user_name']) != '' && trim($value['deal']) === trim($node_id) && intval($login_user_id) != intval($value['actor'])) {
            $newUserArray = array();
            $newUserArray['user_id'] = $value['actor'];
            $newUserArray['user_name'] = $value['user_name'];
            $newUserArray['role_id'] = $value['role'];
            $newUserArray['deal_id'] = $value['deal'];
            $userData = $builderApiObj->getUserProfile($newUserArray['user_id'], '632');
            $userData = json_decode($userData, true);
            $newUserArray['email'] = $userData['data']['email_address'];
            $newUserArray['user_name'] = $userData['data']['first_name'];
            $roleData = $builderApiObj->getRoleName($newUserArray['role_id']);
            $roleData = json_decode($roleData, true);
            $newUserArray['role'] = current($roleData['data'])['Title'];
            $sendMailArray[] = $newUserArray;
        }
    }

    foreach ($sendMailArray as $key => $mailInfo) {
        $to = $mailInfo['email'];
        if (trim($mailInfo['role']) != '') {
            $tempparam = array('type' => 'sendMailAfterRoleAssign', 'fname' => $mailInfo['user_name'], 'roleName' => $mailInfo['role'], 'dealId' => $mailInfo['deal_id'], 'loginURL' => 'http://sta.marinemax.prospus.com/digitalclosing/');
            $mailtemplate = $builderApiObj->getEmailTemplate($tempparam);
            $mailtemplate = json_decode($mailtemplate, true);
            $subject = "MarineMax: Deal Role Assignment";
            $body = $mailtemplate['data'];
            sendMail($to, $subject, $body);
        }
    }
}

function getDetailDocumentMappedData($formHtml) {
            $dom = new domDocument;
            $dom->loadHTML(html_entity_decode($formHtml));
            $dom->preserveWhiteSpace = false;
            $spanDom = $dom->getElementsByTagName('span');
            //echo $spanDom->length;
            $prpertyValue = array();
            for ($i = 0; $i < $spanDom->length; $i++) {
                if ($spanDom->item($i)->getAttribute('data-source') != '') {
                    $getValueArray = explode("~$~", $spanDom->item($i)->getAttribute('data-source'));
                    $prpertyValue[$spanDom->item($i)->getAttribute('data-source')] = $spanDom->item($i)->nodeValue;
                    $spanDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
                }
            }
            $inputDom = $dom->getElementsByTagName('input');
            for ($i = 0; $i < $inputDom->length; $i++) {
                if (($inputDom->item($i)->getAttribute('type')=="checkbox") && $inputDom->item($i)->getAttribute('data-source') != '') {
                   
                    if($inputDom->item($i)->getAttribute('checked')=="checked" || $inputDom->item($i)->hasAttribute('checked'))
                    {
                        
                        $checked_checkboxes[]  =   $inputDom->item($i)->getAttribute('value');
                        //$prpertyValue[$inputDom->item($i)->getAttribute('data-source')][] = $inputDom->item($i)->getAttribute('value');
                    }
                    $combine_checked_checkboxes = implode("~#~", $checked_checkboxes);
                    //$getValueArray = explode("~$~", $inputDom->item($i)->getAttribute('data-source'));
                    $prpertyValue[$inputDom->item($i)->getAttribute('data-source')] = $combine_checked_checkboxes."~#~";
                    //$inputDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
                } 
                if (($inputDom->item($i)->getAttribute('type')=="radio") && $inputDom->item($i)->getAttribute('data-source') != '') {
                    if($inputDom->item($i)->getAttribute('checked')=="checked")
                    {
                        $getValueArray = explode("~$~", $inputDom->item($i)->getAttribute('data-source'));
                        $prpertyValue[$inputDom->item($i)->getAttribute('data-source')] = $inputDom->item($i)->getAttribute('value');
                        //$inputDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
                    }
                } 
            }
            return $prpertyValue;
}

function getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $formHtml, $mapping_ins_id = 0, $documentId = 0, $flag = 0, $type, $docType, $updated_prop_arr = array()) {
    global $sdkApi;
    if (trim($type) == 'operation_form') {
        $output = '';
        // Show the notification/alert to user
        $_notification = '<div class="notification-wrap"><div id="notification-row" class="notification-row" style="display:none"><p></p></div></div>';
        // End of show the notification/alert to user
        $formHtml = $_notification . $formHtml;
        $html = '<html><body>' . html_entity_decode($formHtml) . '</body></html>';

        $particulerDealArray = json_decode($builderApiObj->getMappingInstanceListOfParticulerClass($dealInstancesArray), true);
        
        foreach ($dealInstancesArray as $key => $value) {
            $temp                                       = explode('.',$value);     
            
            if($temp[1] == 'txt')
            {
                $_key                                       = getKeyFromFileName($value);
                $dealData                                   = json_decode($sdkApi->getFileData($value),true);
                $particulerDealArray[$key]                  = array($_key => $dealData['Record']);
            }
            /*else
            {
               $dealData = $builderApiObj->getInstanceListOfParticulerClass($value, 'node', 'all');
               $dealData = json_decode($dealData, true);
               $particulerDealArray[$key]                  = $dealData['data']['Properties'];
            }*/
        }        
        
        // Condition for Business Name
        if ($particulerDealArray[CUSTOMER_CLASS_NID]['General']['EntityName'] != '' && $particulerDealArray[DEAL_CLASS_NODEID]['BUYER']['Business Name'] != '') {
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['FirstName'] = '';
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['MiddleInitial'] = '';
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['LastName'] = $particulerDealArray[CUSTOMER_CLASS_NID]['General']['EntityName'];
        }
        $dom = new domDocument;
        $dom->loadHTML($html);
        $dom->preserveWhiteSpace = false;

        /* For Set Value On Input Type Fields */
        $inputDom = $dom->getElementsByTagName('input');
        //print_r($updated_prop_arr);die;
        for ($i = 0; $i < $inputDom->length; $i++) {
            $output = '';
            if ($inputDom->item($i)->getAttribute('data-source-dynamic') != '') {

                /*
                 * Modified By: Divya
                 * Purpose: Set Multiple NodeZ Property Value
                 */
                $data_source = array();
                $data_source_dynamic = $inputDom->item($i)->getAttribute('data-source-dynamic');
                $data_source_dynamic_array = explode("~@~", $data_source_dynamic);

                if (strpos($data_source_dynamic, "~@~")) {
                    $propTempValue = '';
                    foreach ($data_source_dynamic_array as $key => $data_source_dynamic_value) {
                        $prpertyValue = array();
                        $getValueArray = explode("~$~", $data_source_dynamic_value);
                        $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                        //Temp code start, removed once operation mapping corrected in R2
                        if($sourceArray[0]=='' && $sourceArray[1]!='')
                            $sourceArray[0] = $sourceArray[1];
                        //Temp code end, removed once operation mapping corrected in R2
                        if($getValueArray[0]==FI_QUOTE_SALESPERSON_CLASS_NID)
                        {
                            $subClassName = array();
                            $isFileExist = checkIsFileExits($dealInstancesArray[FI_QUOTE_CLASS_NID]);
                            if($isFileExist['result']){                             
                             foreach($particulerDealArray[FI_QUOTE_CLASS_NID][$isFileExist['key']]['SalesReps'] as $sales_person)
                             {
                                if(isset($sales_person[trim($sourceArray[0])]) && $sales_person[trim($sourceArray[0])])
                                {
                                    $value = $sales_person['SalesRepType'];
                                    $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                    if (isset($match[0])) {
                                       $subClassName[] = $sales_person[trim($sourceArray[0])];
                                    } 
                                }

                             }
                            } else { 
                             foreach($particulerDealArray[FI_QUOTE_CLASS_NID]['subClasses'][FI_QUOTE_SALESPERSON_CLASS_NID] as $sales_person)
                             {
                                if(isset(current($sales_person)[trim($sourceArray[0])]) && current($sales_person)[trim($sourceArray[0])])
                                {
                                    $value = current($sales_person)['SalesRepType'];
                                    $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                    if (isset($match[0])) {
                                       $subClassName[] = current($sales_person)[trim($sourceArray[0])];
                                    } 
                                }

                             }
                            }   
                        $prpertyValue = implode(',',$subClassName);
                        }else
                        {
                            foreach ($sourceArray as $index => $columnName) {
                                if (count($prpertyValue)) {
                                    $search_array = json_decode(NODEZ_DATASOURCE_SEARCH_ARRAY, true);
                                    $replace_array = json_decode(NODEZ_DATASOURCE_REPLACE_ARRAY, true);
                                    $newcolumnName = str_replace($search_array, '', $columnName);
                                    $tempValue = $prpertyValue[trim($newcolumnName)];

                                    if (is_array($tempValue)) {

                                    } else {
                                        $newValue = $tempValue . str_replace($newcolumnName, '', str_replace($search_array, $replace_array, $columnName));
                                        $propTempValue .= $newValue;
                                    }
                                    $prpertyValue = $tempValue;
                                } else {
                                    $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                                }
                            }
                            $prpertyValue = $propTempValue;
                        }
                    }
                } else {
                    /* End Here */

                    $getValueArray = explode("~$~", $inputDom->item($i)->getAttribute('data-source-dynamic'));
                    $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                                                
                    $prpertyValue = array();
                     //Temp code start, removed once operation mapping corrected in R2
                    if($sourceArray[0]=='' && $sourceArray[1]!='')
                        $sourceArray[0] = $sourceArray[1];
                    //Temp code end, removed once operation mapping corrected in R2
                    if($getValueArray[0]==FI_QUOTE_SALESPERSON_CLASS_NID)
                    {
                        $subClassName = array();
                            $isFileExist = checkIsFileExits($dealInstancesArray[FI_QUOTE_CLASS_NID]);
                            if($isFileExist['result']){                             
                             foreach($particulerDealArray[FI_QUOTE_CLASS_NID][$isFileExist['key']]['SalesReps'] as $sales_person)
                             {
                                if(isset($sales_person[trim($sourceArray[0])]) && $sales_person[trim($sourceArray[0])])
                                {
                                    $value = $sales_person['SalesRepType'];
                                    $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                    if (isset($match[0])) {
                                       $subClassName[] = $sales_person[trim($sourceArray[0])];
                                    } 
                                }

                             }
                            } else { 
                             foreach($particulerDealArray[FI_QUOTE_CLASS_NID]['subClasses'][FI_QUOTE_SALESPERSON_CLASS_NID] as $sales_person)
                             {
                                if(isset(current($sales_person)[trim($sourceArray[0])]) && current($sales_person)[trim($sourceArray[0])])
                                {
                                    $value = current($sales_person)['SalesRepType'];
                                    $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                    if (isset($match[0])) {
                                       $subClassName[] = current($sales_person)[trim($sourceArray[0])];
                                    } 
                                }

                             }
                            }   
                        $prpertyValue = implode(',',$subClassName);
                    }else
                    {
                        foreach ($sourceArray as $index => $columnName) {
                            if (count($prpertyValue)) {
                                $prpertyValue = $prpertyValue[trim($columnName)];
                            } else {
                                $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                            }
                        }
                    }
                }

                if (is_array($prpertyValue))
                    $prpertyValue = '';
                if ($docType != "View" || $docType == "") {
                    if ($inputDom->item($i)->getAttribute('type') == 'text') {
                        if ($docType == "Add")
                            $inputDom->item($i)->setAttribute('value', html_entity_decode($prpertyValue));
                        //if (trim($prpertyValue) != '') {
                        $inputDom->item($i)->setAttribute('readonly', 'readonly');
                        $inputDom->item($i)->setAttribute('class', $inputDom->item($i)->getAttribute('class') . ' metrozone');
                        //}
                    } else if ($inputDom->item($i)->getAttribute('type') == 'hidden') {
                        if ($docType == "Add")
                            $inputDom->item($i)->setAttribute('value', html_entity_decode($prpertyValue));
                    } else if ($inputDom->item($i)->getAttribute('type') == 'checkbox') {
                        $checked_array = explode("~#~", html_entity_decode(trim($prpertyValue)));
                        $checked_array = array_map('strtolower', $checked_array);
                        $checkbox_value = strtolower(trim($inputDom->item($i)->getAttribute('value')));
                        if (in_array($checkbox_value,$checked_array)) {
                            if ($docType == "Add")
                                $inputDom->item($i)->setAttribute('checked', true);
                        }
                    } else if ($inputDom->item($i)->getAttribute('type') == 'radio') {
                        if (trim($inputDom->item($i)->getAttribute('value')) == trim($prpertyValue)) {
                            if ($docType == "Add")
                                $inputDom->item($i)->setAttribute('checked', true);
                        }
                    } else if ($inputDom->item($i)->getAttribute('type') == 'file') {
                        if (trim($prpertyValue) != '') {
                            $inputDom->item($i)->setAttribute('class', 'nodeZinput filestyle hide');
                            if ($docType == "Add")
                                $inputDom->item($i)->setAttribute('value', trim($prpertyValue));
                        }
                    }
                }else {
                    $output = array();
                    if ($inputDom->item($i + 1)->nextSibling->tagName=='span' && $inputDom->item($i + 1)->nextSibling->getAttribute('class')!='')
                        $output = $inputDom->item($i + 1)->nextSibling->getAttribute('class');
                    if (count($output) && strpos($output, 'list-view-detail') !== false) {
                        $inputDom->item($i + 1)->nextSibling->setAttribute('class', $output . ' auto-field');
                    }
                }
            } 
            elseif ($inputDom->item($i)->getAttribute('data-id')) {
                $data_source_dynamic = $inputDom->item($i)->getAttribute('data-id');
                if (($inputDom->item($i)->getAttribute('type') == "checkbox") && array_key_exists($data_source_dynamic, $updated_prop_arr)) {
                    $checked_val = $updated_prop_arr[$data_source_dynamic];
                    $checked_arr = explode("~#~", $checked_val);
                    $checked_arr = array_map('strtolower', $checked_arr);
                    $checkbox_val = strtolower(trim($inputDom->item($i)->getAttribute('value')));
                    if(in_array($checkbox_val,$checked_arr))
                    {
                        $inputDom->item($i)->setAttribute('checked',true);
                    }
                }elseif (($inputDom->item($i)->getAttribute('type') == "radio") && array_key_exists($data_source_dynamic, $updated_prop_arr)) {
                    $checkbox_val = $inputDom->item($i)->getAttribute('value');
                    if($checkbox_val==$updated_prop_arr[$data_source_dynamic])
                    {
                        $inputDom->item($i)->setAttribute('checked',true);
                    }
                }else{ 
                    if (array_key_exists($data_source_dynamic, $updated_prop_arr)) {
                        if ($docType != "View" || $docType == "") {
                            //if ($inputDom->item($i)->getAttribute('type') == 'text') {
                            $inputDom->item($i)->setAttribute('class', $inputDom->item($i)->getAttribute('class') . ' light-green auto-field');
                            //}
                        } else {
                            //print_r($inputDom->item($i + 3));die;
                            $output = array();
                            if ($inputDom->item($i + 1)->nextSibling->tagName=='span' && $inputDom->item($i + 1)->nextSibling->getAttribute('class')!='')
                                $output = $inputDom->item($i + 1)->nextSibling->getAttribute('class');
                            if (count($output) && strpos($output, 'list-view-detail') !== false) {
                                $inputDom->item($i + 1)->nextSibling->setAttribute('class', $output . ' light-green auto-field');
                            }else{
                                $inputDom->item($i)->setAttribute('class', $inputDom->item($i)->getAttribute('class') . ' light-green auto-field');
                            }
                        }
                    }
                }
            }
        }

        /* For Set Value On Textarea Type Fields */
        $textareaDom = $dom->getElementsByTagName('textarea');
        for ($i = 0; $i < $textareaDom->length; $i++) {
            $output = '';
            if ($textareaDom->item($i)->getAttribute('data-source-dynamic') != '') {

                /*
                 * Modified By: Divya
                 * Purpose: Set Multiple NodeZ Property Value
                 */
                $data_source = array();
                $data_source_dynamic = $inputDom->item($i)->getAttribute('data-source-dynamic');
                $data_source_dynamic_array = explode("~@~", $data_source_dynamic);

                if (strpos($data_source_dynamic, "~@~")) {
                    $propTempValue = '';
                    foreach ($data_source_dynamic_array as $key => $data_source_dynamic_value) {
                        $prpertyValue = array();
                        $getValueArray = explode("~$~", $data_source_dynamic_value);
                        $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                        foreach ($sourceArray as $index => $columnName) {
                            if (count($prpertyValue)) {
                                $search_array = json_decode(NODEZ_DATASOURCE_SEARCH_ARRAY, true);
                                $replace_array = json_decode(NODEZ_DATASOURCE_REPLACE_ARRAY, true);
                                $newcolumnName = str_replace($search_array, '', $columnName);
                                $tempValue = $prpertyValue[trim($newcolumnName)];

                                if (is_array($tempValue)) {

                                } else {
                                    $newValue = $tempValue . str_replace($newcolumnName, '', str_replace($search_array, $replace_array, $columnName));
                                    $propTempValue .= $newValue;
                                }
                                $prpertyValue = $tempValue;
                            } else {
                                $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                            }
                        }
                        $prpertyValue = $propTempValue;
                    }
                } else {
                    /* End Here */
                    $getValueArray = explode("~$~", $textareaDom->item($i)->getAttribute('data-source-dynamic'));
                    $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                    $prpertyValue = array();
                    foreach ($sourceArray as $index => $columnName) {
                        if (count($prpertyValue)) {
                            $prpertyValue = $prpertyValue[trim($columnName)];
                        } else {
                            $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                        }
                    }
                }

                if (is_array($prpertyValue))
                    $prpertyValue = '';
                if ($docType != "View" || $docType == "") {
                    if ($docType == "Add")
                        $textareaDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
                    //if (trim($prpertyValue) != '') {
                    $textareaDom->item($i)->setAttribute('readonly', 'readonly');
                    $textareaDom->item($i)->setAttribute('class', $textareaDom->item($i)->getAttribute('class') . ' metrozone');
                    //}
                }else {
                    $output = array();
                    if ($inputDom->item($i + 1)->nextSibling->tagName=='span' && $inputDom->item($i + 1)->nextSibling->getAttribute('class')!='')
                        $output = $inputDom->item($i + 1)->nextSibling->getAttribute('class');
                    if (count($output) && strpos($output, 'list-view-detail') !== false) {
                        $inputDom->item($i + 1)->nextSibling->setAttribute('class', $output . ' auto-field');
                    }
                }
            }
        }
        
        /* For Set Value On Select(Dropdown) Type Fields */
        $selectDom = $dom->getElementsByTagName('select');
        for ($i = 0; $i < $selectDom->length; $i++) {
            $output = '';
            if ($selectDom->item($i)->getAttribute('data-source-dynamic') != '') {
                /*
                 * Modified By: Divya
                 * Purpose: Set Multiple NodeZ Property Value
                 */
                $data_source = array();
                $data_source_dynamic = $inputDom->item($i)->getAttribute('data-source-dynamic');
                $data_source_dynamic_array = explode("~@~", $data_source_dynamic);

                if (strpos($data_source_dynamic, "~@~")) {
                    $propTempValue = '';
                    foreach ($data_source_dynamic_array as $key => $data_source_dynamic_value) {
                        $prpertyValue = array();
                        $getValueArray = explode("~$~", $data_source_dynamic_value);
                        $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                        foreach ($sourceArray as $index => $columnName) {
                            if (count($prpertyValue)) {
                                $search_array = json_decode(NODEZ_DATASOURCE_SEARCH_ARRAY, true);
                                $replace_array = json_decode(NODEZ_DATASOURCE_REPLACE_ARRAY, true);
                                $newcolumnName = str_replace($search_array, '', $columnName);
                                $tempValue = $prpertyValue[trim($newcolumnName)];

                                if (is_array($tempValue)) {

                                } else {
                                    $newValue = $tempValue . str_replace($newcolumnName, '', str_replace($search_array, $replace_array, $columnName));
                                    $propTempValue .= $newValue;
                                }
                                $prpertyValue = $tempValue;
                            } else {
                                $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                            }
                        }
                        $prpertyValue = $propTempValue;
                    }
                } else {
                    /* End Here */

                    $getValueArray = explode("~$~", $selectDom->item($i)->getAttribute('data-source-dynamic'));
                    $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                    $prpertyValue = array();
                    foreach ($sourceArray as $index => $columnName) {
                        if (count($prpertyValue)) {
                            $prpertyValue = $prpertyValue[trim($columnName)];
                        } else {
                            $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                        }
                    }
                }

                if (is_array($prpertyValue))
                    $prpertyValue = '';
                if ($docType != "View" || $docType == "") {
                    $optionTags = $selectDom->item($i)->getElementsByTagName('option');
                    for ($k = 0; $k < $optionTags->length; $k++) {
                        if (trim($optionTags->item($k)->getAttribute('value')) == trim($prpertyValue)) {
                            if ($docType == "Add")
                                $optionTags->item($k)->setAttribute('selected', 'selected');
                        }
                    }
                }else {
                    $output = array();
                    if ($inputDom->item($i + 1)->nextSibling->tagName=='span' && $inputDom->item($i + 1)->nextSibling->getAttribute('class')!='')
                        $output = $inputDom->item($i + 1)->nextSibling->getAttribute('class');
                    if (count($output) && strpos($output, 'list-view-detail') !== false) {
                        $inputDom->item($i + 1)->nextSibling->setAttribute('class', $output . ' auto-field');
                    }
                }

                //if (trim($prpertyValue) != '') {
                $selectDom->item($i)->setAttribute('readonly', 'readonly');
                $selectDom->item($i)->setAttribute('class', $selectDom->item($i)->getAttribute('class') . ' metrozone');
                //}
            }
        }

        
        $html = $dom->saveHTML();

        $html = str_replace("<html><body>", "", $html);
        $html = str_replace("</body></html>", "", $html);
        return $html;
    } elseif (trim($type) == 'canvas') {
        // Show the notification/alert to user
        $html2 = '';
        $maxColumns = 0;

        if (isset($formHtml)) {
            $statementsHtml = '';
            $numberingFlag = 0;
            foreach ($formHtml as $stmt) {

                $html = htmlspecialchars_decode(current($stmt));
                $statementsHtml .= $html;

                preg_match('/(?<=data-x=")[\d]+(?=")/', $html, $match1);
                $maxColumns = (current($match1) > $maxColumns) ? current($match1) : $maxColumns;
                preg_match('/(?<=data-s=")[\d.]+(?=")/', $html, $match2);
                if (strlen(current($match2)) > 0) {
                    $numberingFlag = 1;
                }
            }
            $maxColumns++;
        }
        // End of show the notification/alert to user
        $url = ABS_API_URL;
        //$formHtml = preg_replace('/(?<=src=")([^"]+)(?=")/', $url . '$1', $statementsHtml);
        $formHtml = preg_replace('/(?<=src=")([^"]*)(?=files\/)/', $url, $statementsHtml);
        //$formHtml = $statementsHtml;
        $html = html_entity_decode($formHtml);

        foreach ($dealInstancesArray as $key => $value) {
            $temp                                       = explode('.',$value);
            $_key                                       = getKeyFromFileName($value);
            if($temp[1] == 'txt')
            {
                $dealData                                   = json_decode($sdkApi->getFileData($value),true);
                $particulerDealArray[$key]                  = array($_key => $dealData['Record']);
            }
            else
            {
                $dealData = $builderApiObj->getInstanceListOfParticulerClass($value, 'node', 'all');
                $dealData = json_decode($dealData, true);
                $particulerDealArray[$key]                  = $dealData['data']['Properties'];
            }
        }
        // echo "<pre>";
        // print_r($particulerDealArray);
        // die;
        // Condition for Business Name
        if ($particulerDealArray[CUSTOMER_CLASS_NID]['General']['EntityName'] != '' && $particulerDealArray[DEAL_CLASS_NODEID]['BUYER']['Business Name'] != '') {
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['FirstName'] = '';
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['MiddleInitial'] = '';
            $particulerDealArray[CUSTOMER_CLASS_NID]['General']['LastName'] = $particulerDealArray[CUSTOMER_CLASS_NID]['General']['EntityName'];
        }

        $docTypeMode = "printMode";
        /* if ($docType == 'PPC') {
          $docTypeMode = "printMode";
          } */
        if ($docType == "map_doc_detail") {
            $html = $formHtml;
        } else {
            $iniHtml = '<input type="hidden" id="mapping_ins_content_id" value="' . $mapping_ins_id . '" data-document-id="' . $documentId . '" data-mode-type="' . $flag . '" ><div class="customScroll mid-section-HT"><div id="edtCanvasView"><div id="edtInnerCanvasView" class="' . $docTypeMode . '">';
            // End of show the notification/alert to user
            $formHtml = $iniHtml . $formHtml;
            $html = $formHtml . '</div></div></div>';
        }

        
        $dom = new domDocument;
        $dom->loadHTML($html);
        $dom->preserveWhiteSpace = false;

        /* For Set Value On Input Type Fields */
        $spanDom = $dom->getElementsByTagName('span');

        for ($i = 0; $i < $spanDom->length; $i++) {
            if ($spanDom->item($i)->getAttribute('data-source') != '') {
                $getValueArray = explode("~$~", $spanDom->item($i)->getAttribute('data-source'));
                $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                //Temp code start, removed once operation mapping corrected in R2
                if($sourceArray[0]=='' && $sourceArray[1]!='')
                    $sourceArray[0] = $sourceArray[1];
                //Temp code end, removed once operation mapping corrected in R2
                if($getValueArray[0]==FI_QUOTE_SALESPERSON_CLASS_NID)
                {
                    $subClassName = array();
                            $isFileExist = checkIsFileExits($dealInstancesArray[FI_QUOTE_CLASS_NID]);
                            if($isFileExist['result']){
                                foreach($particulerDealArray[FI_QUOTE_CLASS_NID][$isFileExist['key']]['SalesReps'] as $sales_person)
                                {
                                   if(isset($sales_person[trim($sourceArray[0])]) && $sales_person[trim($sourceArray[0])])
                                   {
                                       $value = $sales_person['SalesRepType'];
                                       $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                       if (isset($match[0])) {
                                          $subClassName[] = $sales_person[trim($sourceArray[0])];
                                       } 
                                   }

                                }
                            } else { 
                             foreach($particulerDealArray[FI_QUOTE_CLASS_NID]['subClasses'][FI_QUOTE_SALESPERSON_CLASS_NID] as $sales_person)
                             {
                                if(isset(current($sales_person)[trim($sourceArray[0])]) && current($sales_person)[trim($sourceArray[0])])
                                {
                                    $value = current($sales_person)['SalesRepType'];
                                    $res = preg_match("/^(Salesperson)[ \d]+/", $value, $match);    
                                    if (isset($match[0])) {
                                       $subClassName[] = current($sales_person)[trim($sourceArray[0])];
                                    } 
                                }

                             }
                            }   
                        $prpertyValue = implode(',',$subClassName);
                }elseif($getValueArray[0]==UNIT_MOTOR_CLASS_NID)
                {
                    $subClassName = '';
                            $isFileExist = checkIsFileExits($dealInstancesArray[UNIT_CLASS_NID]);
                            if($isFileExist['result']){
                                foreach($particulerDealArray[UNIT_CLASS_NID][$isFileExist['key']]['Motors'] as $motors)
                                {
                                    //$subClassName = current($motors)['MotorType'];
                                    //foreach ($motors as $key => $value) {
                                        if(isset($motors[trim($sourceArray[0])]) && $motors[trim($sourceArray[0])]!='')
                                            $subClassName.= $motors[trim($sourceArray[0])].'<br/>';
                                        else
                                            $subClassName.= '--'.'<br/>';
                                    //}

                                }
                            } else {
                                foreach($particulerDealArray[UNIT_CLASS_NID]['subClasses'][UNIT_MOTOR_CLASS_NID] as $motors)
                                {
                                    //$subClassName = current($motors)['MotorType'];
                                    //foreach ($motors as $key => $value) {
                                        if(isset(current($motors)[trim($sourceArray[0])]) && current($motors)[trim($sourceArray[0])]!='')
                                            $subClassName.= current($motors)[trim($sourceArray[0])].'<br/>';
                                        else
                                            $subClassName.= '--'.'<br/>';
                                    //}

                                }
                            }
                    
                    $prpertyValue = $subClassName;
                }elseif($getValueArray[0]==TRADES_CLASS_NID)
                {
                    $subClassName = '';
                    $isFileExist = checkIsFileExits($dealInstancesArray[FI_QUOTE_CLASS_NID]);
                            if($isFileExist['result']){
                                foreach($particulerDealArray[FI_QUOTE_CLASS_NID][$isFileExist['key']]['Trades'] as $trades)
                                {
                                    if(isset($trades[trim($sourceArray[0])]) && $trades[trim($sourceArray[0])]!='')
                                            $subClassName.= $trades[trim($sourceArray[0])].'<br/>';
                                        else
                                            $subClassName.= '--'.'<br/>';

                                }
                            } else {
                                foreach($particulerDealArray[FI_QUOTE_CLASS_NID]['subClasses'][TRADES_CLASS_NID] as $trades)
                                {
                                    if(isset(current($trades)[trim($sourceArray[0])]) && current($trades)[trim($sourceArray[0])]!='')
                                            $subClassName.= current($trades)[trim($sourceArray[0])].'<br/>';
                                        else
                                            $subClassName.= '--'.'<br/>';

                                }
                            }
                    
                    $prpertyValue = $subClassName;
                }else{
                    $prpertyValue = array();
                    foreach ($sourceArray as $index => $columnName) {
                        
                        if (count($prpertyValue)) {
                            $prpertyValue = $prpertyValue[trim($columnName)];
                        } else {
                            $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                        }
                    }
                }

                if (is_array($prpertyValue))
                    $prpertyValue = '';
                
                if (strpos($prpertyValue, '&amp;') || strpos($prpertyValue, '&'))
                {
                    $spanDom->item($i)->nodeValue = htmlentities($prpertyValue);
                }else{
                    
                    $spanDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
                }
            }
        }
        
        $inputDom = $dom->getElementsByTagName('input');
        for ($i = 0; $i < $inputDom->length; $i++) {
            if ($inputDom->item($i)->getAttribute('data-source') != '') {
                $getValueArray = explode("~$~", $inputDom->item($i)->getAttribute('data-source'));
                $sourceArray = explode(">", html_entity_decode($getValueArray[1]));
                $prpertyValue = array();
                foreach ($sourceArray as $index => $columnName) {

                    if (count($prpertyValue)) {
                        $prpertyValue = $prpertyValue[trim($columnName)];
                    } else {
                        $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
                    }
                    if($inputDom->item($i)->getAttribute('type')=="checkbox")
                    {
                        if(is_array($particulerDealArray[$getValueArray[0]][trim($columnName)]))
                        {
                            foreach($particulerDealArray[$getValueArray[0]][trim($columnName)] as $key=>$colName)
                            {
                                $checked_array = array();
                                $checked_array = explode("~#~",$particulerDealArray[$getValueArray[0]][trim($columnName)][$key]);
                                $checked_array = array_map('strtolower', $checked_array);
                                $checkbox_value = strtolower(htmlentities(trim($inputDom->item($i)->getAttribute('value'))));
                                if(is_array($checked_array) && in_array($checkbox_value,$checked_array))
                                {
                                    $inputDom->item($i)->setAttribute('checked','checked');
                                }
                            }
                        }
                    }
                    if($inputDom->item($i)->getAttribute('type')=="radio")
                    {
                        if(is_array($particulerDealArray[$getValueArray[0]][trim($columnName)]))
                        {
                            foreach($particulerDealArray[$getValueArray[0]][trim($columnName)] as $key=>$colName)
                            {
                                $checked_array = array();
                                $checked_array = explode("~#~",$particulerDealArray[$getValueArray[0]][trim($columnName)][$key]);
                                $checked_array = array_map('strtolower', $checked_array);
                                $checkbox_value = strtolower($inputDom->item($i)->getAttribute('value'));
                                if(is_array($checked_array) && in_array($checkbox_value,$checked_array))
                                {
                                    $inputDom->item($i)->setAttribute('checked','checked');
                                }
                            }
                        }
                    }
                }
            }
            //echo '<pre>';print_r($prpertyValue);
        }
        //die;
        //return $prpertyValue;die;
        //print_r($html);
        /* ----------------------Start--------Mathematical operations-----------------------
         * Added by:-Gaurav Dutt Panchal
         * Date:- 10 Jan 2017
         */
        
        if ($flag != 'save_opr_detail') {
            domCalculation($spanDom);
        }
        
        //----------------------End--------Mathematical operations-----------------------//
        $html = $dom->saveHTML();
        //echo $html;
        //die;
        return $html;
    }
}

/* function getCanvasFormNew($builderApiObj, $dealInstancesArray, $formHtml,$mapping_ins_id, $documentId, $flag) {
  // Show the notification/alert to user


  $html2 = '';
  $maxColumns = 0;

  if (isset($formHtml)) {
  $statementsHtml = '';
  $numberingFlag = 0;
  foreach ($formHtml as $stmt) {
  $html = htmlspecialchars_decode(current($stmt));
  $statementsHtml .= $html;

  preg_match('/(?<=data-x=")[\d]+(?=")/', $html, $match1);
  $maxColumns = (current($match1) > $maxColumns) ? current($match1) : $maxColumns;
  preg_match('/(?<=data-s=")[\d.]+(?=")/', $html, $match2);
  if (strlen(current($match2)) > 0) {
  $numberingFlag = 1;
  }
  }
  $maxColumns++;
  }
  // End of show the notification/alert to user
  $formHtml = $statementsHtml;
  $html = html_entity_decode($formHtml);


  foreach($dealInstancesArray as $key => $value)
  {
  $dealData                       = $builderApiObj->getInstanceListOfParticulerClass($value, 'node', 'all');
  $dealData                       = json_decode($dealData, true);
  $particulerDealArray[$key]      = $dealData['data']['Properties'];

  }

  $iniHtml = '<input type="hidden" id="mapping_ins_content_id" value="' . $mapping_ins_id . '" data-document-id="' . $documentId . '" data-mode-type="' . $flag . '" ><div class="customScroll mid-section-HT"><div id="edtCanvasView"><div id="edtInnerCanvasView" class="printMode">';
  // End of show the notification/alert to user
  $formHtml = $iniHtml . $formHtml;
  $html =  $formHtml . '</div></div></div>';

  $dom = new domDocument;
  $dom->loadHTML($html);
  $dom->preserveWhiteSpace = false;

  //For Set Value On Input Type Fields
  $spanDom = $dom->getElementsByTagName('span');

  for ($i = 0; $i < $spanDom->length; $i++) {
  if ($spanDom->item($i)->getAttribute('data-source') != '') {
  $getValueArray = explode("~$~", $spanDom->item($i)->getAttribute('data-source'));
  $sourceArray = explode(">", html_entity_decode($getValueArray[1]));

  $prpertyValue = array();
  foreach ($sourceArray as $index => $columnName) {
  if (count($prpertyValue)) {
  $prpertyValue = $prpertyValue[trim($columnName)];
  } else {
  $prpertyValue = $particulerDealArray[$getValueArray[0]][trim($columnName)];
  }
  }



  if (is_array($prpertyValue))
  $prpertyValue = '';
  // $spanDom->item($i)->setAttribute('class', '');
  $spanDom->item($i)->nodeValue = html_entity_decode($prpertyValue);
  }
  }

  $html = $dom->saveHTML();

  return $html;
  } */

function get_headers_from_curl_response($response) {
    $headers = array();

    $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

    foreach (explode("\r\n", $header_text) as $i => $line)
        if ($i === 0) {
            $new = explode(" ", $line);
            $headers['http_code'] = $line; //.$new[1];
        } else {
            list ($key, $value) = explode(': ', $line);

            $headers[$key] = $value;
        }

    return $headers;
}

function callCurl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);

    $data = curl_exec($ch);

    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($http_status != 200) {
        $http_status = "API Error - $http_status";
    } else {
        $http_status = "API Status - $http_status";
    }

    curl_close($ch);
    return $data;
}

function getCustomerHtmlList($data) {

    $_html = '';

    if (count($data)) {

        foreach ($data as $key => $value) {

            $lastName = '';
            if (!is_array($value['LastName'])) {
                $lastName = $value['LastName'];
            }

            $firstName = '';
            if (!is_array($value['FirstName'])) {
                $firstName = $value['FirstName'];
            }

            $email = '';
            if (!is_array($value['EmailPrimary']) && $value['EmailPrimary'] != '') {
                $email = $value['EmailPrimary'];
            } else {
                if (!is_array($value['EmailPrimary'][0]) && $value['EmailPrimary'][0] != '')
                    $email = $value['EmailPrimary'][0];
            }

            $PhoneBusiness = '';
            if (!is_array($value['PhoneBusiness'])) {
                $PhoneBusiness = $value['PhoneBusiness'];
            }

            $PhoneMobile = '';
            if (!is_array($value['PhoneMobile'])) {
                $PhoneMobile = $value['PhoneMobile'];
            }

            $PhoneHome = '';
            if (!is_array($value['PhoneHome'])) {
                $PhoneHome = $value['PhoneHome'];
            }

            $_html .= '<div class="row" data-customer-id="' . $value['CustomerNo'] . '" onclick="selectCustomerSearch(' . $value['CustomerNo'] . ')" id="customer_' . $value['CustomerNo'] . '" >
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $lastName . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $firstName . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $email . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $PhoneBusiness . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $PhoneMobile . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $PhoneHome . '</div>
                        </div>';
        }
    } else {
        $_html .= '<div class="no-record-js"><div class="noEntry">No Records Found</div></div>';
    }


    return $_html;
}

function getSalesHtmlList($data) {

    $_html = '';

    if (count($data)) {

        foreach ($data as $key => $value) {

            $StockNo = '';
            if (!is_array($value['QuoteNo'])) {
                $StockNo = $value['QuoteNo'];
            }

            $firstName = '';
            if (!is_array($value['FirstName'])) {
                $firstName = $value['FirstName'];
            }

            $lastName = '';
            if (!is_array($value['LastName'])) {
                $lastName = $value['LastName'];
            }

            $StockDesc = '';
            if (!is_array($value['StockDesc'])) {
                $StockDesc = $value['StockDesc'];
            }
            $StatusDesc = '';
            if (!is_array($value['StatusDesc'])) {
                $StatusDesc = $value['StatusDesc'];
            }
            $DateQuoted = '';
            if (!is_array($value['DateQuoted'])) {
                $DateQuoted = $value['DateQuoted'];
            }


            $_html .= '<div class="row" data-salesquote-id="' . $StockNo . '" onclick="selectSalesSearch(' . $StockNo . ')"  id="salesquote_' . $StockNo . '" >
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $StockNo . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $firstName . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $lastName . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $StockDesc . '</div>
                             <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $StatusDesc . '</div>
                              <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $DateQuoted . '</div>
                        </div>';
        }
    } else {
        $_html .= '<div class="no-record-js"><div class="noEntry">No Records Found</div></div>';
    }


    return $_html;
}

function is_assoc($array) {
    $keys = array_keys($array);
    return $keys !== array_keys($keys);
}

function getUnitsHtmlList($data) {

    $_html = '';

    if (count($data)) {

        foreach ($data as $key => $value) {

            $StockNo = '';
            if (!is_array($value['StockNo'])) {
                $StockNo = $value['StockNo'];
            }

            $BrandDesc = '';
            if (!is_array($value['BrandDesc'])) {
                $BrandDesc = $value['BrandDesc'];
            }

            $ModelDesc = '';
            if (!is_array($value['ModelDesc'])) {
                $ModelDesc = $value['ModelDesc'];
            }

            $ModelYear = '';
            if (!is_array($value['ModelYear'])) {
                $ModelYear = $value['ModelYear'];
            }

            $Length = '';
            if (!is_array($value['Length'])) {
                $Length = $value['Length'];
            }

            $DsgnDesc = '';
            if (!is_array($value['DsgnDesc'])) {
                $DsgnDesc = $value['DsgnDesc'];
            }

            $_html .= '<div class="row" data-stock-id="' . $StockNo . '" onclick="selectUnitSearch(\'' . str_replace('.', '_', trim($StockNo)) . '\')" id="stock_' . str_replace('.', '_', trim($StockNo)) . '" >
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $StockNo . '</div>
                            <div class="col-sm-3"  style="overflow-wrap: break-word;">' . $BrandDesc . '</div>
                            <div class="col-sm-3"  style="overflow-wrap: break-word;">' . $ModelDesc . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $Length . '</div>
                            <div class="col-sm-2"  style="overflow-wrap: break-word;">' . $DsgnDesc . '</div>
                        </div>';
        }
    } else {
        $_html .= '<div class="no-record-js"><div class="noEntry">No Records Found</div></div>';
    }

    return $_html;
}

function getcanvasPreHtmlList($data, $brokerage_node_id, $mapping_ins_id, $documentId, $flag) {
    $html2 = '';
    $maxColumns = 0;

    if (isset($data)) {
        $statementsHtml = '';
        $numberingFlag = 0;
        foreach ($data as $stmt) {
            /*
             * htmlspecialchars_decode added
             * as Awdhesh has applied htmlspecialchars
             * and this content is not coming properly
             */
            $html = htmlspecialchars_decode(current($stmt));
            $statementsHtml .= $html;

            preg_match('/(?<=data-x=")[\d]+(?=")/', $html, $match1);
            $maxColumns = (current($match1) > $maxColumns) ? current($match1) : $maxColumns;
            preg_match('/(?<=data-s=")[\d.]+(?=")/', $html, $match2);
            if (strlen(current($match2)) > 0) {
                $numberingFlag = 1;
            }
        }
        $maxColumns++;
    }


    $html2 .= '<input type="hidden" id="mapping_ins_content_id" value="' . $mapping_ins_id . '" data-document-id="' . $documentId . '" data-mode-type="' . $flag . '" ><div class="customScroll mid-section-HT"><div id="edtCanvasView"><div id="edtInnerCanvasView" class="printMode">';
    /* <div class="numbering"></div> */
    $html2 .= '';
    if (!empty($statementsHtml)) {
        // $url = ABS_API_URL;
        //$html2 .= preg_replace('/(?<=src=")([^"]+)(?=")/', $url . '$1', $statementsHtml);
        $html2 .= $statementsHtml;
        //$regex = '#<img([^>]*) src="([^"/]*/?[^".]*\.[^"]*)"([^>]*)>((?!</a>))#';
        //$replace = "<img". '$1'."src=".$url . '$2'.">".'$3';
        //$html2 .= preg_replace($regex, $replace, $statementsHtml);
        //$html2 .=$statementsHtml;
    }
    $html2 .= '</div></div></div>';
    return $html2;
}

function isDealEditableRole($deal_actor_role_node_id, $deal_node_instance_id, $deal_instance_node_id, $section) {
    global $builderApiObj;
    //Get instance of phases.
    $key = 'not found';

    $instanceData = $builderApiObj->getInstanceEditStructure($deal_instance_node_id);
    $instanceData = json_decode($instanceData, true);
    foreach ($instanceData['data'] as $instKey => $value) {
        # code...
        foreach ($value['child'] as $childkey => $childvalue) {
            # code...if
            if ($childkey == DEAL_PHASE_VERSION_PROPERTY_ID) {

                $sequenceVersion = $childvalue['value'];   // deal Sequence.
            }
        }
    }
    $operationPhaseRes = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_PHASE_CLASS_ID, 'class', 'node_id');
    $operationPhaseData = json_decode($operationPhaseRes, true);
    $res = $builderApiObj->getInstanceListOfParticulerClass(PHASE_CLASS_ID, 'class', 'node_id');
    $resData = json_decode($res, true);

    //get instance of phase sequence class and get the current version of phase sequence.
    $allSequenceInsArray = $builderApiObj->getInstanceListOfParticulerClass(MANAGE_PHASE_SEQUENCE, 'class', 'node_id');
    $allSequenceInsArray = json_decode($allSequenceInsArray, true);
    foreach ($allSequenceInsArray['data'] as $seqKey => $seqVal) {
        //if($seqVal['Current Version']=='Yes' && $seqVal['Deal Creator'] == current($dealCreatorData['data'])['Role NID']){
        if ($seqKey == $sequenceVersion) {
            $sequenceArr = $seqVal['Phase Sequence'];
        }
    }
    //return array($resData['data'],$deal_node_instance_id);
    foreach ($resData['data'] as $dealPhaseKey => $dealPhaseVal) {
        if ($dealPhaseVal['DealId'] == $deal_node_instance_id) {
            $key = $dealPhaseKey;
            break;
        }
    }
    foreach ($operationPhaseData['data'] as $dealPhaseArrKey => $dealPhaseArrVal) {
        if ($dealPhaseArrVal['RoleId'] == $deal_actor_role_node_id) {
            $rolekey = $dealPhaseArrKey;
            break;
        }
    }

    //$rolePhase=$operationPhaseData['data'][$rolekey]['Sequence'];   // Role Sequence
    $sequenceArr = explode(",", $sequenceArr);


    $rolePhase = intVal(array_search($deal_actor_role_node_id, $sequenceArr)) + 1;
    $dealPhase = $operationPhaseData['data'][$resData['data'][$key]['PhaseId']]['Sequence'];  // Deal Sequence
    if ($key == 'not found') {
        $dealPhase = 1;
    }
    // print_r($sequenceArr); die();
    $is_deal_editable_role = 0;
    if ($rolePhase == $dealPhase && $section == "deal")
        $is_deal_editable_role = 1;
    elseif (($rolePhase == $dealPhase || $dealPhase > $rolePhase) && $section == "operation")
        $is_deal_editable_role = 1;
    //return $operationPhaseData['data'];
    return $is_deal_editable_role;
}

    function getRoleDropDown($builderApiObj) {
        $customerData = $builderApiObj->getInstanceListOfParticulerClass(OPERATION_ROLE_CLASS_ID, 'class', 'node_id');
        $customerData = json_decode($customerData, true);
        $roleArray = array();
        foreach ($customerData['data'] as $key => $value) {
            if (intval($value['Mapped For']) == '396138') {
                $roleArray[$key] = $value;
            }
        }

        $roleHtml = '';
        $roleViewArray = array();

        $roleCount = 0;

        $_commonOperation = json_decode($builderApiObj->getInstanceListOfParticulerClass(OPERATION_CLASS_ID, 'class', 'node_id'), TRUE)['data'];
        foreach ($roleArray as $roleId => $roleName) {
            $role = $roleName['Title'];

            $_roles = array();
            $_roleId = $roleId;

            foreach ($_commonOperation as $key2 => $value1) {
                $_commonRole = explode(',', $value1['Role']);
                if (count($_commonRole) > 1 && in_array($_roleId, $_commonRole)) {
                    foreach ($_commonRole as $_key => $_value1) {
                        if ($_value1 != $_roleId) {
                            $_roles[trim($_value1)][] = trim($key2);
                        }
                    }
                }
            }

            if (count($_roles) > 0) {
                $data_settings = "data-settings = '" . json_encode($_roles) . "'";
                //return $_roles;//as per discussion with Gaurav this code is not required. Initialy this code was not here. 
            }

            $roleHtml .= '<option data-id=' . $roleId . ' ' . $data_settings . ' value="' . $roleId . '" >' . $role . '</option>';
            $roleViewArray[$roleId] = $role;
            $roleCount++;
        }


        return array('html' => $roleHtml, 'name' => $roleViewArray);
    }

/* Comment By Arvind Soni because he created new function /
        /*function setSubClassMappingOld($builderApiObj, $post, $data) {
            $prop_key = array_search($data['propertyId'], $post['instance_property_id']);
            $prop_val = $post['instance_property_caption'][$prop_key];
            $send_val = '';
            if (isset($prop_val) && trim($prop_val) != '' && intval($prop_val) > 0) {
                $resData = $builderApiObj->getInstanceListOfParticulerClass($data['classId'], 'class', 'node_id');
                $resData = json_decode($resData, true);
                $insId = '';
                foreach ($resData['data'] as $key => $value) {
                    if (intval($value[$data['keyName']]) == intval($prop_val)) {
                        $insId = $key;
                    }
                }

                if ($insId != '')
                    $send_val = $data['classNId'] . '~$~' . $insId;
            }

            return $send_val;
        }*/

        function setSubClassMapping($post, $fileStartName, $data, $location) {
            $folderPath                     = 'puidata/page_plugin/api_files/';
            $prop_key                       = array_search($data['propertyId'], $post['instance_property_id']);
            $prop_val                       = $post['instance_property_caption'][$prop_key];
            $send_val                       = '';
            if (isset($prop_val) && trim($prop_val) != '' && intval($prop_val) > 0) {
                $insId                      = $folderPath . $fileStartName.'_'.$prop_val . "_" . $location.'.txt';;
                if ($insId != '')
                    $send_val               = $data['classNId'] . '~$~' . $insId;
            }
            
            return $send_val;
        }
        
function docSaveByDetails($builderApiObj, $mapping_role_actor_node_id, $operation_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $document_node_id) {
    $returnData = $builderApiObj->getDealOperationFormId($mapping_role_actor_node_id, $operation_node_id);
    $returnArray = json_decode($returnData, true);
    if ($returnArray['data']['Document'] != "" && $returnArray['data']['Document'] != 'N/A') {

        $document_node_id = $returnArray['data']['Document'];
        $edit_document_node_id = $document_node_id;
    } else {
        $document_node_id = $document_node_id;
        $edit_document_node_id = '';
    }
    if ($returnArray['data']['Form'] != "" && $returnArray['data']['Form'] != 'N/A') {
        $form_node_id = $returnArray['data']['Form'];
        $ins_cid = json_decode($builderApiObj->getTableCols(array('node_class_id'), 'node-instance', array('node_id'), array($form_node_id)), TRUE)['node_class_id'];
        $ins1_cnid = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($ins_cid)), TRUE)['node_id'];
    }

    $json = array();
    $documentData = $builderApiObj->getDocumentData($document_node_id, $deal_instance_node_id, $deal_user_role_id, $login_user_id, $mapping_class_node_id['classNodeid'], $operation_node_id);
    $documentData = json_decode($documentData, true);
    $templateType = $builderApiObj->getTemplateType($document_node_id);
    $tempArray = json_decode($templateType, true);
    if ($tempArray['value'] == "Canvas") {
        $dealInstancesArray['396138'] = $deal_instance_node_id;
        $subData = $builderApiObj->getInstanceIdOfSubClass(OPERATION_PROPERTY_MAP_DEAL_CLASS_ID, $deal_instance_node_id);
        $subData = json_decode($subData, true);
        if ($subData['data'] != '') {
            $instanceInfo = $builderApiObj->getInstanceListOfParticulerClass($subData['data'], 'instance', 'node_id');
            $instanceInfo = json_decode($instanceInfo, true);
            if (count($instanceInfo['data']) > 0) {
                foreach (current($instanceInfo['data']) as $key => $value) {
                    $temp = explode('~$~', $value);
                    $dealInstancesArray[$temp[0]] = $temp[1];
                }
            }
        }
        $dealInstancesArray[$ins1_cnid] = $form_node_id;
        $dealInstancesArray = getMappedDataInstancesWithClass($dealInstancesArray);
        /*
         * Modified By Divya
         * Purpose: Call Same Function for Document as Called for details
         */
        //print_r($documentData['data'][0]);
        $arr_key = key($documentData['data'][0][0]);
        $documentData['data'][0][0][$arr_key] = resetDocumentCBData($documentData['data'][0]);
        //print_r(array($documentData['data'][0],'ss'));
        $htmldata = getInstanceDataAndPutOnFormNew($builderApiObj, $dealInstancesArray, $documentData['data'][0], $documentData['data'][1]['document'], $returnArray['data']['Document'], 'save_opr_detail', 'canvas', 'map_doc_detail');
        //  echo "again success";
        //  die;
        // $htmldata = html_entity_decode($htmldata);
        /* END HERE */
//        print_r($htmldata);
//        die;
        $data = array();
        $post = array();
        $tempArray['value'] = 1;
        //$mapping_role_actor_node_id = $post['deal_mapping_node_id'];
        $operation_node_id = $operation_node_id;
        $post['document']['statementData'] = $htmldata;
        $post['saveType'] = 1;
        $post['document']['dialogue_admin'] = $login_user_id;
        $post['edit_document_node_id'] = $edit_document_node_id;
        $post['document']['dialogue_template'] = 'Canvas';
        $post['node_class_id'] = MAPPING_DEAL_OPERATION_CLASS_ID;
        $post['deal_mapping_node_id'] = $mapping_role_actor_node_id;
        $post['operation_id'] = $operation_node_id;

        $post['node_class_property_id'] = array(MAPPING_ROLE_ACTOR_PID, OPERATION_PID, DOCUMENT_PID);
        $post['value'] = array($mapping_role_actor_node_id, $operation_node_id, '#~#');
        $post['is_email'] = 'N';
        $post['status'] = 'P';


        $returnResponse = $builderApiObj->setDocumentDataAndStructure($post, '1', '6');
        $returnResponse = json_decode($returnResponse, true);
        return;
    }
}

function getOperationActionPermission($role_id = '', $deal_node_id) {
    global $builderApiObj;
    $arr = array();
    $arr1 = array();
    $archivedStatusRes = $builderApiObj->checkInArchivedStatus($deal_node_id);
    $archivedStatus = json_decode($archivedStatusRes, true);
    $data['node_id'] = json_decode($builderApiObj->getCurrentControl($deal_node_id), TRUE)['data']['active_node_id'];
    $data['role_id'] = $role_id;
    $data['permission'] = 'condition';
    $arr = $builderApiObj->getOperationPermission($data);
    if ((int) $archivedStatus == 1) {//deal archieved
        if(strpos($arr,'Can Publish Archived Deal'))
        {
            $arr1[0] = "Can Publish Archived Deal";
            $arr1[1] = "Is Archived Deal";
            return $arr1;
        }else{
            return $arr1;
        }
    }else{
        return $arr = json_decode($arr, true);
    }
    /* $_dealControlId = $builderApiObj->getTableCols(array('value'), 'node-instance-property', array('node_instance_id', 'node_class_property_id'), array($deal_instance_id, DEAL_CONTROL_VERSION_IDS));
      $_dealControlId = array_flip(array_filter(explode(',', json_decode($_dealControlId, true)['value'])));
      $_control = $builderApiObj->getInstanceListOfParticulerClass(853, 'class', 'node_id');
      $_controlData = json_decode($_control, true); */
}

/**
 * Modified By: Divya Rajput
 * Date: 24-Feb-2017
 * @Purpose : get Mapped Class Instance Value
 * @param array $dealInstances 
 * @return return Array
*/
function getMappedDataInstancesWithClass($dealInstancesArray) {
    global $builderApiObj;
    if(1){
        $tempArr = json_decode($builderApiObj->getMappedClassInstanceValuewithArray($dealInstancesArray), true);
        foreach ($tempArr as $key2 => $val2) {
            $dealInstancesArray[$key2] = $val2;
        }
    }else{
        $tempArr = array();
        foreach ($dealInstancesArray as $key => $value) {
            //$resData[] = $builderApiObj->getSingleClassInstanceValue($value);
            $d = $builderApiObj->getSingleClassInstanceValue($value);
            $d = json_decode($d, true);

            foreach ($d['data'] as $key1 => $val1) {
                $tempArr[$key1] = $val1;
            }
        }
        foreach ($tempArr as $key2 => $val2) {
            $dealInstancesArray[$key2] = $val2;
        }
    }
    return $dealInstancesArray;
}

function getDetailDocumentMappedFieldsPropertyArr($mapping_role_actor_node_id, $operation_node_id, $deal_node_id, $_documentMappedData = array(), $mapped_form = '') {
    global $builderApiObj;
    
    //print_r(current($documentData['data'][0][0]));die;
    $mapped_form_arr = json_decode($builderApiObj->getTableCols(array('node_class_id'), 'node-instance', array('node_id'), array($mapped_form)), TRUE)['node_class_id'];
    $detail_form_node_id = json_decode($builderApiObj->getTableCols(array('node_id'), 'node-class', array('node_class_id'), array($mapped_form_arr)), TRUE)['node_id'];
    $mapped_field_arr = array();
    foreach ($_documentMappedData as $key => $arr) {
        $form_field_node_id = explode('~$~', $key);
        if ($form_field_node_id[0] == $detail_form_node_id) {
            //if($arr!='')
            $mapped_field_arr[$form_field_node_id[1]] = $arr;
        }
    }
    if (count($mapped_field_arr) > 0) {
        $MDOC_Data = $builderApiObj->getInstanceListOfParticulerClass(MAPPING_DEAL_OPERATION_CLASS_ID, 'class', 'node_id');
        $MDOC_Data = json_decode($MDOC_Data, true);
        $node_id_of_instanse = '';
        $form_id = '';
        foreach ($MDOC_Data['data'] as $key => $value) {
            if (intval($value['Mapping_Role_Actor']) == intval($mapping_role_actor_node_id) && intval($value['Operation']) == intval($operation_node_id)) {
                $node_id_of_instanse = $key;
                $form_id = $value['Form'];
            }
        }
        if (intval($form_id) > 0) {
            $resNew = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'all');
            $resNew = json_decode($resNew, true);
            $resNew1 = $builderApiObj->getInstanceListOfParticulerClass($form_id, 'node', 'propertyWithHirerchy');
            $resNew1 = json_decode($resNew1, true);
        }

        $insId = $resNew['data']['node_instance_id'];
        $updated_prop_arr = array();
        foreach ($mapped_field_arr as $indexKey => $indexVal) {
            $propAray = explode('>', $indexKey);
            if (isset($resNew1['data']['Properties'][$propAray[0]][$propAray[1]]))
                $updated_prop_arr[$resNew1['data']['Properties'][$propAray[0]][$propAray[1]]] = $indexVal;
        }
    }
    return $updated_prop_arr;
}

function getDetailDocumentMappedFieldsPropertyArrForSave($document_node_id, $deal_node_id, $documentClassNodeId, $documentData = array()) {
    global $builderApiObj;    
    if(1){
        $post['document_node_id'] = $document_node_id; 
        $post['deal_node_id'] = $deal_node_id; 
        $post['documentClassNodeId'] = $documentClassNodeId; 
        $post['documentData'] = $documentData;
        
        $return_arr = $documentData;
        if(count($documentData) == 0){
            $documentData = json_decode($builderApiObj->getDocumentData($document_node_id, $deal_node_id),TRUE);
            $return_arr = getDetailDocumentMappedData(current($documentData['data'][0][0]));            
        }
        $post['return_arr'] = $return_arr;        
        
        $updated_prop_arr = json_decode($builderApiObj->getDetailDocumentData($post), true);
    }else{
        $return_arr = $documentData;
        if(count($documentData) == 0){
            $documentData = json_decode($builderApiObj->getDocumentData($document_node_id, $deal_node_id),TRUE);
            $return_arr = getDetailDocumentMappedData(current($documentData['data'][0][0]));
        }

        $mapped_field_arr = array();
        foreach ($return_arr as $key => $arr) {
            $form_field_node_id = explode('~$~', $key);
            if ($form_field_node_id[0] == $documentClassNodeId) {
                //if($arr!='')
                $mapped_field_arr[$form_field_node_id[1]] = $arr;
            }
        }
        //print_r($mapped_field_arr);die;
        if (count($mapped_field_arr) > 0) {
            //        $data['nodeId'] = $documentClassNodeId;
            //        $data['searchOn'] = 'class';
            //        $data['keyType'] = 'node_instance_id';
            $node_class_id = $builderApiObj->getTableCols(array('node_class_id'), 'node-class', 'node_id', $documentClassNodeId);
            $node_class_id = json_decode($node_class_id, true)['node_class_id'];
            $result = json_decode($builderApiObj->getClassStructureWithHirerchy($node_class_id), TRUE);
            //$result = $result['Properties'];
            //print_r($result);die;
            //$result = json_decode($builderApiObj->getAllClassInstance($data), TRUE);
            //print_r($result);die;
            //$result = $result['structure'][0]['caption'];
            //($result);die;
            $updated_prop_arr = array();
            foreach ($mapped_field_arr as $indexKey => $indexVal) {
                $propAray = explode('>', $indexKey);
                if (isset($result['Properties'][$propAray[0]][$propAray[1]])) {
                    $propArray[] = $result['Properties'][$propAray[0]][$propAray[1]];
                    $propValArray[] = $indexVal;
                    $updated_prop_arr[$result['Properties'][$propAray[0]][$propAray[1]]] = $indexVal;
                }
                //            if (array_search($indexVal, $result)) {
                //                $propAray = explode('_', array_search($indexVal, $result));
                //                $updated_prop_arr[$propAray[0]] = '';
                //            }
            }
        }
    }
    return $updated_prop_arr;
}

function getPropChild($data, $temp) {
    foreach ($data as $key => $value) {
        if (isset($value['child']) && is_array($value['child'])) {
            $temp = getPropChild($value['child'], $temp);
        } else {
            $temp[$value['node_class_property_id']] = array('name' => $value['caption_old'], 'val' => $value['value']);
        }
    }

    return $temp;
}

function getPropValues($data) {


    $resArr = array();
    $instanceId = current($data)['node_instance_id'];
    $node_id = current($data)['node_id'];
    $resArr['node_instance_id'] = $instanceId;
    $resArr['node_id'] = $node_id;

    $temp = array();
    foreach ($data as $key => $value) {

        if (isset($value['child']) && is_array($value['child'])) {
            $temp = getPropChild($value['child'], $temp);
        } else {
            $temp[$value['node_class_property_id']] = array('name' => $value['caption_old'], 'val' => $value['value']);
        }
    }
    $resArr['values'] = $temp;
    return $resArr;
}

function sendMailFromMailApi($from, $to, $deal, $type, $builderApiObj) {
    $roleTArray = array(ROLE_BM => 'Business Manager',
        ROLE_REVENUE_ACCOUNTANT => 'Revenue Accountant',
        ROLE_REVENUE_MANAGER => 'Revenue Manager',
        ROLE_CONTROLLER => 'Controller',
        ROLE_DIRECTOR => 'Director',
        '603696' => 'Administrator');

    $instanceData = $builderApiObj->getInstanceEditStructure($deal);
    $instanceData = json_decode($instanceData, true);
    $instanceData = getPropValues($instanceData['data']);

    $roleData = $builderApiObj->getActorWithRoleAndDeal($instanceData['node_id']);
    $roleArray = json_decode($roleData, true);
    $roleArray = $roleArray['data'];

    /* Type Manage */
    if (strtolower($type) == 'pass' || strtolower($type) == 'passing' || strtolower($type) == 'passed') {
        $type = 'passed';
    } else if (strtolower($type) == 'return' || strtolower($type) == 'returning' || strtolower($type) == 'returned') {
        $type = 'returned';
    }

    /* To Data From Deal */
    $toUserData = $builderApiObj->getUserProfile($roleArray[$to]['actor'], '632');
    $toUserData = json_decode($toUserData, true);
    $toMailId = $toUserData['data']['email_address'];
    if ($toUserData['data']['last_name'] != '')
        $toFullName = $toUserData['data']['first_name'] . " " . $toUserData['data']['last_name'];
    else
        $toFullName = $toUserData['data']['first_name'];

    /* From Data From Deal */
    $fromRoleName = $roleTArray[$from];
    $fromUserData = $builderApiObj->getUserProfile($roleArray[$from]['actor'], '632');
    $fromUserData = json_decode($fromUserData, true);
    $fromMailId = $fromUserData['data']['email_address'];
    /* Subject Of Pass And Return Deal Mail */
    $subject = "MarineMax: Deal " . $instanceData['values']['3228']['val'] . " is Ready for Review";

    /* Body Of Pass And Return Deal Mail */
    $body = "Hi, " . $toFullName . ". Deal " . $instanceData['values']['3228']['val'] . " has been " . $type . " to you by " . $fromRoleName . " (" . $fromMailId . ") and is ready for your review.";



    $url = "http://qa.api.marinemax.com/v1/email/send/plain-text";

    $xml = "<EmailParameters>
                            <ToEmailAddress>" . $toMailId . "</ToEmailAddress>
                            <ToFirstName>" . $toUserData['data']['first_name'] . "</ToFirstName>
                            <ToLastName>" . $toUserData['data']['last_name'] . "</ToLastName>
                            <FromEmailAddress>info@marinemax.com</FromEmailAddress>
                            <FromDisplayName>MarineMax Digital Closing</FromDisplayName>
                            <Subject>" . $subject . "</Subject>
                            <Body>" . $body . "</Body>
                        </EmailParameters>";

    if ($to != '' && $subject != '' && $body != '') {
        $hdrarray = array('Authorization-Token: ucYu+iyTC36IoFwaO7CX7c8HAVg=');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $hdrarray);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 500);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
        $response = curl_exec($ch);

        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            echo 'Curl error: ' . curl_error($ch);
        }

        if ($http_status != 200) {
            $response = "Error $http_status";
        }

        curl_close($ch);

        return $response;
    } else {
        return 'error';
    }
}

function convertPdfToImg($pdf) {
    global $sdkApi;
    $uploadPath = __DIR__ . '/../../../data/AppOnePdfImages/';
    $filename = basename($pdf, '.pdf');

    /* Create Folder Of Particuler PDF When Folder Does Not Exist */
    $absoFolderPath = "$uploadPath/$filename";


    if (!is_dir($absoFolderPath)) {
        mkdir($absoFolderPath, 0777, true);
    }
    /* Code For PDF Download And Creating Images */
    file_put_contents("$uploadPath/" . "$filename.pdf", fopen($pdf, 'r'));
    $file     = $sdkApi->setFileData('data/AppOnePdfImages/'."$filename.pdf","$uploadPath/" . "$filename.pdf",'file');
    $im = new imagick("$uploadPath/" . "$filename.pdf");
    $im->setResolution(100, 100);
    $count = $im->getNumberImages();
    $im->setImageFormat('png');
    $im->setImageCompressionQuality(70);
    $htmldata = array();
    for ($i = 0; $i < $count; $i++) {
        $im->readimage("$uploadPath/" . "$filename.pdf" . '[' . $i . ']');
        $im->writeImage("$absoFolderPath/$filename" . '_' . $i . '.png');
        $file     = $sdkApi->setFileData("data/AppOnePdfImages/$filename/$filename" . '_' . $i . '.png',"$absoFolderPath/$filename" . '_' . $i . '.png','file');
        //unlink("$absoFolderPath/$filename" . '_' . $i . '.png');
    }
    //unlink("$uploadPath/" . "$filename.pdf");
    $im->clear();
    $im->destroy();

    return $absoFolderPath;
}

function convertPdfToImgCanvas($pdf) {
    global $sdkApi;
    $uploadPath = __DIR__ . '/../../../data/AppOnePdfImages/';
    $filename = basename($pdf, '.pdf');

    /* Create Folder Of Particuler PDF When Folder Does Not Exist */
    $absoFolderPath = "$uploadPath/$filename";

    if (!is_dir($absoFolderPath)) {
        mkdir($absoFolderPath, 0777, true);
    }
    /* Code For PDF Download And Creating Images */
    //file_put_contents("$uploadPath/" . "$filename.pdf", fopen($pdf, 'r'));
    $file     = $sdkApi->setFileData('data/AppOnePdfImages/'."$filename.pdf","$uploadPath/" . "$filename.pdf",'file');
    $im = new imagick("$uploadPath/" . "$filename.pdf");
    $im->setResolution(100, 100);
    $count = $im->getNumberImages();
    $im->setImageFormat('png');
    $im->setImageCompressionQuality(0);
    $htmldata = array();
    for ($i = 0; $i < $count; $i++) {
        $im->readimage("$uploadPath/" . "$filename.pdf" . '[' . $i . ']');
        $im->writeImage("$absoFolderPath/$filename" . '_' . $i . '.png');
        $file     = $sdkApi->setFileData("data/AppOnePdfImages/$filename/$filename" . '_' . $i . '.png',"$absoFolderPath/$filename" . '_' . $i . '.png','file');
        $htmldata[] = $file['object_url'];
    }
    $im->clear();
    $im->destroy();
    natsort($htmldata);
    return $htmldata;
}

/* ----------------------Start--------Mathematical operations-----------------------
 * Added by:-Gaurav Dutt Panchal
 * Date:- 10 Jan 2017
 */

function DOMinnerHTML($element) {
    $innerHTML = "";
    $children = $element->childNodes;
    foreach ($children as $child) {
        $tmp_dom = new DOMDocument();
        $tmp_dom->appendChild($tmp_dom->importNode($child, true));
        $innerHTML .= trim($tmp_dom->saveHTML());
    }
    return $innerHTML;
}

function domCalculation($spanDom) {
    include_once("field_calculate.php");
    for ($i = 0; $i < $spanDom->length; $i++) {
        if ($spanDom->item($i)->getAttribute('data-calculation')) {
            $node = $spanDom->item($i);
            $innerHtml = DOMinnerHTML($node);
            $cal = new field_calculate();
            $calValue = str_replace(' ', '', strip_tags($innerHtml));
            // $calValue1 = str_replace(' ', '', '37.052 - (5.02 + (28 - (19 - 7))) ');
            $resCal = $cal->calculate($calValue);
            if ((int) $resCal == 0) {//If Calculate return zero value
                $resCal = eval('return ' . $calValue . ';');
            }
            $resCal = number_format((float) $resCal, 2, '.', '');

            $spanDom->item($i)->nodeValue = '<span class="mappingNode" contenteditable="false" data-source="">' . $resCal . '</span>';
        }
    }
}

//----------------------End--------Mathematical operations-----------------------//

/**
 * Created By: Ben
 * Date: 20-Feb-2017
 * @Purpose : Make HTML for Operations
 * @param array $data, 
 * @param $deal_node_instance_id, 
 * @param $deal_actor_role_node_id, 
 * @param $deal_instance_node_id, 
 * @param $propertyId
 * @return html and count
*/
function makeHtmlForOperationList($data, $deal_node_instance_id, $deal_actor_role_node_id, $deal_instance_node_id, $propertyId, $super_admin='false', $login_user_id) {
    $index = 0;$html = '';
    
    global $builderApiObj;
    
    $mappingRoleActor = json_decode($builderApiObj->checkMappingDealOperationNodeID($deal_node_instance_id, $deal_actor_role_node_id, $login_user_id));
    $flag = 0;
    if($mappingRoleActor != ''){
        $_permission = getOperationActionPermission($deal_actor_role_node_id, $deal_node_instance_id);
        if(in_array('Can Edit', $_permission)){
            $flag = 1;
        }
    }
    
    foreach ($data as $key => $value) {
        $class = $classOperationType = $optional_operation_button = '';
        
        if (intval($index++) == 0) {
            $class = ' active';
        }
        $_image = (!empty($value['Icon'])) ? '<a><img class="imageListJs" src="' . $value['Icon'] . '"></img></a>' : '<a><i class="prs-big-icon"></i></a>';
        if ($value['Operation Type'] == 'Optional') {
            $classOperationType = ' throbHighlight';
            if($flag == 1 && $super_admin != 'true' && !in_array($propertyId, array(OPERATION_OTHER_ROLE_PERMISSION_PROPERTY_ID, OPERATION_READ_BY_PROPERTY_ID, OPERATION_EDITED_BY_PROPERTY_ID))){
                $optional_operation_button = '<i class="prs-icon sm-close ' . $_hideAction . '" onclick="deleteOptionalOperation(event,' . $key . ')"></i>';
            }
        }
        
        $readClass = '';
        $is_readonly_operation = 'false';
        $read_array = explode(",", $value['Read By']);
        $edit_array = explode(",", $value['Edited By']);
        $owner_read_only_array = isset($value['Read-Only Owner']) ? explode(",", $value['Read-Only Owner']) : array();
        if($propertyId == OPERATION_READ_BY_PROPERTY_ID){ $readClass = 'readonly'; $is_readonly_operation = 'true'; }
        else if($propertyId == OPERATION_OTHER_ROLE_PERMISSION_PROPERTY_ID && in_array($deal_actor_role_node_id, $read_array) && !in_array($deal_actor_role_node_id, $edit_array)){ $readClass = 'readonly'; $is_readonly_operation = 'true'; }
        else if($flag == 1 && in_array($deal_actor_role_node_id, $owner_read_only_array) && !in_array($propertyId, array(OPERATION_OTHER_ROLE_PERMISSION_PROPERTY_ID, OPERATION_READ_BY_PROPERTY_ID, OPERATION_EDITED_BY_PROPERTY_ID))){ $readClass = 'readonlyowner'; }

        $html .= '<div data-read-permission ="' . $readClass . '"  data-is-other-role-operation="' . $is_readonly_operation . '" data-operation-type="' . $value['Operation Type'] . '" class="flex-grid' . $classOperationType . ' clearfix' . $class . ' workspace-operation-list" id="opration_id_' . $key . '" data-operation-id="' . $key . '" data-vnid-id="' . $value['View NID'] . ' " data-dealid="' . $deal_node_instance_id . '"  data-document="' . $value[PDF_TITLE] . '" data-dealnodeinsid="' . $deal_node_instance_id . '" data-rolenodeid="' . $deal_actor_role_node_id . '"  data-dealinsid="' . $deal_instance_node_id . '" onclick="return getOperationInstanceForm(this, ' . $key . ',\'' . $value['View NID'] . '\',event,\'' . $readClass . '\')" ><div class="flex-col workflow-icon">' . $_image . '</div><div class="flex-col workflow-body">' . $optional_operation_button;
        $html .= '<h4 class="text-upper  operation-title breadcrumb-heading-js">' . $value['Name'] . '</h4><p>' . $value['Description'] . '</p></div></div>';
    }
    if ($html == '') {
        $html .= '<div class="no-record-operation-list"><div class="no-record-list noEntry" >There are no operations in this grouping.</div></div>';
    }
    return $html . '###' . count($data);
}

/**
 * Use to Change Blank Array into null string of IDS Data
 * @param type $api_data_array
 * @param type $apiName
 * @return string
 */
function changeBlankArrayIntoValue($api_data_array, $apiName) {
    foreach ($api_data_array['Record'] as $key => $value) {
        if (is_array($value) && count($value) > 0) {
            if ($apiName == 'customer') {
                if ($key == 'DisallowedPayForms') {
                    if (is_assoc($value)) {
                        $api_data_array['Record'][$key] = '';
                        $api_data_array['Record'][$key][0] = $value;
                    }
                }
            } else if ($apiName == 'boat') {
                if ($key != 'Extension') {
                    if (is_assoc($value)) {
                        $api_data_array['Record'][$key] = '';
                        $api_data_array['Record'][$key][0] = $value;
                    }
                }
            } else {
                if (is_assoc($value)) {
                    $api_data_array['Record'][$key] = '';
                    $api_data_array['Record'][$key][0] = $value;
                }
            }
        } else {
            if (trim($value) != '')
                $api_data_array['Record'][$key] = $value;
            else
                $api_data_array['Record'][$key] = '';
        }
    }

    foreach ($api_data_array['Record'] as $key => $value) {
        if (is_array($value)) {
            foreach ($value as $index => $data) {
                foreach ($data as $k => $v) {
                    if (trim($v) != '')
                        $api_data_array['Record'][$key][$index][$k] = $v;
                    else
                        $api_data_array['Record'][$key][$index][$k] = '';
                }
            }
        }
    }

    return $api_data_array;
}
/**
 * 16/Feb/2017
 * Get Sub Array key on the basis of file path
 * @param type $temp
 * @return string
 */
function getKeyFromFileName($temp){
            $first = explode('_',$temp);
            $second = explode('/',$first[2]);
            if($second[1] == 'boat' || $second[1] == 'cobuyer') {
              $final = 'Gernal';  
            } elseif($second[1] == 'finance' || $second[1] == 'customer') {
                $final = 'General';
            } else {
                $final = 'General';
            }
            return $final;
        }

/**
 * 17 Feb 2017
 * Function to check File is exist or not
 * @param type $value
 * @return boolean
 */
function checkIsFileExits($value) {
            $result = array();
            $temp   = explode('.',$value);
            $_key   = getKeyFromFileName($value);
            $result['key'] = $_key;
            if($temp[1] == 'txt')
            {
               $result['result'] = True;
            }
            else
            {
                $result['result'] = False;
            }
            return $result;
}

/**
* Created By: Ben, Divya
* Date: 20-Feb-2017
* @Purpose : Get JSON data of all operations
* @param $allOperationData : Array
* @return json encoded operation list data array
*/
function createJsonIndexView($allOperationData = array(), $fieldname='', $searchString='')
{
    if($searchString == ''){
        $grouping['capping'] = $grouping['closing'] = $grouping['posting'] = array();    
        if(strtolower($fieldname) == 'financing'){
            $grouping['financing'] = array();
        }else if(strtolower($fieldname) == 'cash'){
            $grouping['cash'] = array();
        }
    }
    
    foreach ($allOperationData as $key => $instanceValue) {
        $instanceValue['Operation id'] = $key;
        if(strtolower($instanceValue['Capping']) == 'true'){            
            $grouping['capping'][] = $instanceValue;
        }
        if(strtolower($fieldname) == 'financing' && strtolower($instanceValue['Financing']) == 'true'){
            $grouping['financing'][] = $instanceValue;
        }
        if(strtolower($fieldname) == 'cash' && strtolower($instanceValue['Cash']) == 'true'){
            $grouping['cash'][] = $instanceValue;
        }
        if(strtolower($instanceValue['Closing']) == 'true'){
            $grouping['closing'][] = $instanceValue;
        }
        if(strtolower($instanceValue['Posting']) == 'true'){
            $grouping['posting'][] = $instanceValue;
        }
    }
    
    if($searchString != ''){
        $searchData = $grouping[strtolower($fieldname)];
        $grouping = array();
        $grouping[strtolower($fieldname)] = (count($searchData) > 0) ? $searchData : array();
        $grouping['record'] = count($grouping[strtolower($fieldname)]);
    }
    $grouping['indexing'] = 'indexing';
    return json_encode($grouping);
}



function searchOperationList($data = array(), $searchString = '') {
    if ($searchString != '') {
        $searchString = strtolower($searchString);
        $finalArray = array();
        foreach ($data as $searchKey => $searchData) {
            $_name = strtolower($searchData['Name']);
            $_description = strtolower($searchData['Description']);
            if ((strpos($_name, $searchString) !== false) || (strpos($_description, $searchString) !== false)) {
                $finalArray[$searchKey] = $searchData;
            }
        }
        $data = $finalArray;
    }
    return $data;
}
/**
* Created by: Kunal
* Date: 06-Mar-2017
* Reset all checkbox of Document on update of operation detail form.
* @param $html
* @return $html
*/
function resetDocumentCBData($formHtml){
     // Show the notification/alert to user
        $html2 = '';
        $maxColumns = 0;

        if (isset($formHtml)) {
            $statementsHtml = '';
            $numberingFlag = 0;
            foreach ($formHtml as $stmt) {

                $html = htmlspecialchars_decode(current($stmt));
                $statementsHtml .= $html;

                preg_match('/(?<=data-x=")[\d]+(?=")/', $html, $match1);
                $maxColumns = (current($match1) > $maxColumns) ? current($match1) : $maxColumns;
                preg_match('/(?<=data-s=")[\d.]+(?=")/', $html, $match2);
                if (strlen(current($match2)) > 0) {
                    $numberingFlag = 1;
                }
            }
            $maxColumns++;
        }
        // End of show the notification/alert to user
        $url = ABS_API_URL;
        //$formHtml = preg_replace('/(?<=src=")([^"]+)(?=")/', $url . '$1', $statementsHtml);
        $formHtml = preg_replace('/(?<=src=")([^"]*)(?=files\/)/', $url, $statementsHtml);
        //$formHtml = $statementsHtml;
        $html = $formHtml;
   
        $dom = new domDocument;
        $dom->loadHTML($html);
        $dom->preserveWhiteSpace = false;
        $inputDom = $dom->getElementsByTagName('input');
        //print_r(array($formhtml,$inputDom,'aa'));die;
        for ($i = 0; $i < $inputDom->length; $i++) {
            if ($inputDom->item($i)->getAttribute('data-source') != '' && ($inputDom->item($i)->getAttribute('type')=="checkbox" || $inputDom->item($i)->getAttribute('type')=="radio")) {
                $inputDom->item($i)->removeAttribute('checked');
            }
        }
        $html = $dom->saveHTML();
        return $html;
}