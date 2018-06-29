<?php
include_once("config.php");
include_once("builderApi.php");
$apiObj = new builderApi();
$postArray = $_POST;
$getArray = $postArray['data'];

$_post = array();
$_post['menuLayoutInstanceId'] = ($getArray['menu']['menuLayoutInstanceId'])?$getArray['menu']['menuLayoutInstanceId']:'';
$_post['listLayoutInstanceId'] = ($getArray['list']['listLayoutInstanceId'])?$getArray['list']['listLayoutInstanceId']:'';
$_post['detailLayoutInstanceId'] = ($getArray['detail']['detailLayoutInstanceId'])?$getArray['detail']['detailLayoutInstanceId']:'';
$_post['loginRoleId'] = ($postArray['roleId'])?$postArray['roleId']:'';
$getDashboardData = json_decode($apiObj->getDashboardData($_post), true);
//print_r($getDashboardData);die;        
$loginuserId = '';
$loginRoleId = '';

if (!empty($postArray['userId'])) {
    $loginuserId = $postArray['userId'];
}
if (!empty($postArray['roleId'])) {
    $loginRoleId = $postArray['roleId'];
}
?>

<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL_API; ?>css/editor.css">
<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL_API; ?>css/edt-style.css">
<?php if (empty($postArray['action'])) { ?>
    <script type="text/javascript"> var base_plugin_url = "<?php echo BASE_URL_API; ?>";</script>
    <script type="text/javascript" data-main="<?php echo BASE_URL_API; ?>js/main.js" src="<?php echo BASE_URL_API; ?>js/require.js" ></script>
    <script type="text/javascript" src="<?php echo BASE_URL_API; ?>js/js_modules.js" ></script>
    <script type="text/javascript" src="<?php echo BASE_URL_API; ?>js/modules/html_module.js" ></script>
    <script>
      var firstDashBoardLoad = 0;
    </script>

    <!-- <script type="text/javascript" src="<?php echo BASE_URL_API; ?>component/Flyout/jquery.flyout.js" ></script> -->
<?php } ?>
<?php
/* For Menu Layout */
$menuLayoutHtml = '';
$menuListInstanceId = '';
if (is_array($getArray['menu'])) {
    $menuArray = $getArray['menu'];
    $menuListInstanceId = $menuArray['menuListInstanceId'];
    if (intval($menuArray['menuLayoutInstanceId']) > 0) {
//        $menu = $apiObj->getFormStructure($menuArray['menuLayoutInstanceId']);
//        $menu = json_decode($menu, true);
        $menuLayoutHtml = $getDashboardData['menu'];
    }
}

/* For List Layout */
$listLayoutHtml = '';
$listLayoutHead = '';
$listHeadArray = '';
$listSettingArray = '';
$brokerageNodeId = '';

if (is_array($getArray['list'])) {
    $listArray = $getArray['list'];

    $listLayoutHead = $listArray['layoutHeading'];


    $expandDealListFlag = FALSE;
    $listHeadArray = $listArray['listHeadArray'];
    $listSettingArray = $listArray['setting'];
    // IF DEAL THEN WORK AS PER NEW ARRAY SETTINGS
    if($listArray['listHeadArray']['class_node_id'] == '396138') {
        // COLUMN HEADERS
        foreach($listArray['listHeadArray']['role_cols'] as $key => $val) {
            if(in_array($loginRoleId,$val['role_ids'])) {
                $roleColumns = $val['columns'];
            }
        }
        unset($listHeadArray['role_cols']);
        $listHeadArray['columns'] = $roleColumns;

        // COLUMN SETTINGS
        $listSettingArray = $listArray['setting'];
        foreach($listArray['setting'] as $key => $val) {
            if(in_array($loginRoleId,$val['role_ids'])) {
                $roleColSettings = $val['col_settings'];
            }
        }
        unset($listSettingArray['role_ids']);
        $listSettingArray = $roleColSettings;
        $expandDealListFlag = FALSE;
        if(count($listSettingArray) > 7) {
            $expandDealListFlag = TRUE;
        }
    }



    if ($listArray['listingPattern']['type'] == 'roleWise') {
        $listMappingArray = $listArray['mappingClass'];
    } else {
        $listMappingArray['classNodeid'] = "";
    }
    $listNodeIDArray = $listArray['NID'];
    $PaginationRecordArray = $listArray['PaginationRecord'];
    $DefalutPerPage = $PaginationRecordArray['0'];

    if (intval($listArray['listLayoutInstanceId']) > 0) {
//        $list = $apiObj->getFormStructure($listArray['listLayoutInstanceId']);
//        $list = json_decode($list, true);
        $listLayoutHtml = $getDashboardData['list'];
    }
    $brokerageNodeId = $listArray['BrokrageNodeId'];
}

/* For View/Add/Edit Layout */
$detailLayoutHtml = '';
$contentDetailArray = '';
if (is_array($getArray['detail'])) {
    $detailArray = $getArray['detail'];
    $contentDetailArray = $detailArray['contentDetails'];
    if (intval($detailArray['detailLayoutInstanceId']) > 0) {
//        $detail = $apiObj->getFormStructure($detailArray['detailLayoutInstanceId']);
//        $detail = json_decode($detail, true);
        $detailLayoutHtml = $getDashboardData['detail'];
    }
}
?>
<?php
    $canDealAdd = $canDealDel = $canDealEdit = 0;
    if($loginRoleId != ''){
//        $dealPermission = $apiObj->getDealPermissions($loginRoleId,DEAL_PERMISSIONS_PROP_ID);
//        $dealPermissionArr = explode(',',json_decode($dealPermission, true)['data']['value']);
        $dealPermissionArr = explode(',',$getDashboardData['dealPermissionArr']['value']);
        //print_r($dealPermissionArr);die;
        if(in_array('Can Delete', $dealPermissionArr)){
            $canDealDel = 1;
        }
        if(in_array('Can Add', $dealPermissionArr)){
            $canDealAdd = 1;
        }
        //        if(in_array('Can Edit', $dealPermissionArr)){
        //            $canDealEdit = 1;
        //        }
    }
?>
<script type="text/javascript">
        var menu_list_instance_id = "<?php echo $menuListInstanceId; ?>";
        var list_head = "<?php echo $listLayoutHead; ?>";
        var list_head_array = '<?php echo json_encode($listHeadArray); ?>';
        var class_node_id = "<?php echo $listHeadArray['class_node_id']; ?>";
        var list_setting_array = '<?php echo json_encode($listSettingArray); ?>';
        var content_head = "<?php echo $contentDetailArray['heading']; ?>";
        var add_instance_id_of_content = "<?php echo $contentDetailArray['instanceId']; ?>";
        var content_detail_array = '<?php echo json_encode($contentDetailArray); ?>';
        var page_plugin_counter = 0;
        var total_record_of_plugin_list = 0;
        var list_node_id_array = '<?php echo json_encode($listNodeIDArray); ?>';
        var list_mapping_id_array = '<?php echo json_encode($listMappingArray); ?>';
        var login_user_id = '<?php echo $loginuserId; ?>';
        var pagination_record_array = '<?php echo json_encode($PaginationRecordArray); ?>';
        var default_per_page = '<?php echo $DefalutPerPage; ?>';
        var brokerage_node_id = '<?php echo $brokerageNodeId; ?>';
        var deal_instance_id = '';
        var deal_node_id = '';
        var deal_user_role_id = '';
        var login_role_id = '<?php echo $loginRoleId; ?>';
        var form_container = '';
        var instance_node_id_dashboard = '';
        var node_instance_id_dashboard = '';
        var search_customer_location = '';
        var search_customer_id = '';
        var search_stock_id = '';
        var search_sales_id = '';
        var search_fi_id = '';
        var is_open_workspace = 'N';
        var lookup_role_id_of_sc = '<?php echo ROLE_SALES_CONSULTANT; ?>';
        var lookup_role_id_of_bc = '<?php echo ROLE_BUSINESS_MANAGER; ?>';
        var lookup_role_id_of_admin = '<?php echo ADMIN; ?>';
        var is_flyout_open = 'N';
        var current_deal_type = '';
        var li_role_ras = '<?php echo MENU_RAs; ?>';
        var li_role_rms = '<?php echo MENU_RMs; ?>';
        var li_role_mine = '<?php echo MINE; ?>';
        var li_role_rm_c_d = '<?php echo MENU_RM_C_D; ?>';
        var li_role_c_d = '<?php echo MENU_C_D; ?>';

        /* For Add Deal Menu Hide And Show */
        var canDealDel = <?php echo $canDealDel; ?>;
        var canDealAdd = <?php echo $canDealAdd; ?>;
        //var canDealEdit = <?php echo $canDealEdit; ?>;
        var add_deal_menu_instance_id = '<?php echo ADD_DEAL_MENU_LIST_ID; ?>';
        var delete_deal_menu_instance_id = '<?php echo DELETE_DEAL_MENU_LIST_ID; ?>';
        var role_id_of_sales_consultant = '<?php echo ROLE_SALES_CONSULTANT; ?>';
        var role_id_of_business_manager = '<?php echo ROLE_BUSINESS_MANAGER; ?>';
        var is_role_assoc = '0';
        var form_action_type = 'view';
        var role_phase = <?php echo $rolePhaseArray; ?>;
        var role_title = <?php echo ROLE_NAME; ?>;
        var operation_detail_node_class_id = '';
        var DEAL_NET_SALE_LIST  = "<?php echo DEAL_NET_SALE_LIST;?>";
        var DEAL_SIZE           = "<?php echo DEAL_SIZE;?>";
        var lookup_role_id_of_bm = '<?php echo ROLE_BM; ?>';
        var lookup_role_id_of_ra = "<?php echo ROLE_REVENUE_ACCOUNTANT; ?>";
        var lookup_role_id_of_rm = "<?php echo ROLE_REVENUE_MANAGER; ?>";
        var lookup_role_id_of_controller = '<?php echo ROLE_CONTROLLER; ?>';
        var lookup_role_id_of_director = '<?php echo ROLE_DIRECTOR; ?>';
        var deal_status_prop_id = '<?php echo DEAL_STATUS_PID; ?>';
        var deal_sub_status_prop_id = '<?php echo DEAL_SUB_STATUS_PID; ?>';
        var expand_deal_list_flag = '<?php echo $expandDealListFlag; ?>';
		var lookup_role_id_of_superadmin = '<?php echo ROLE_SUPERADMIN; ?>';
</script>
<?php if (empty($postArray['action'])) { ?>
    <script type="text/javascript">
        $('head').append('<link rel="stylesheet" href="<?php echo BASE_URL_API; ?>css/bootbite.css" />');
        $('head').append('<link rel="stylesheet" href="<?php echo BASE_URL_API; ?>component/CustomScroll/jquery.mCustomScrollbar.css" />');
        $('head').append('<link rel="stylesheet" href="<?php echo BASE_URL_API; ?>component/common-style.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL_API; ?>css/grid/grid.css" />');

        $('head').append('<link rel="stylesheet" type="text/css" href="http://<?php echo FILE_DOMAIN;?>/RandD/menu.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL_API; ?>css/dashboard/dashboard.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" href="http://<?php echo FILE_DOMAIN;?>/RandD/listing-details.css" />');
        $('head').append('<link rel="stylesheet" type="text/css" href="http://<?php echo FILE_DOMAIN;?>/RandD/table-listing.css" />');

        $(document).ready(function () {
            $('body').addClass('prs-plugin');
            window.sessionStorage.removeItem("lastFilter");
        });
        // function showFullLoader(id) {
        //     $('#' + id).fadeIn('fast', function () {
        //         $('#' + id).addClass('loader-fade-in'); // Animation complete.
        //     });
        // }
        //
        // function hideFullLoader(id) {
        //     $('#' + id).removeClass('loader-fade-in');
        //     $('#' + id).fadeOut('fast');
        // }


        function openAddFormFromDashboard(obj) {
            form_container = '_dashboard';
            $.do_not_hide_loader = false;
            renderViewDetails(obj, add_instance_id_of_content, 'add');
        }

    </script>
<?php } ?>

<!-- For Menu -->
<?php if (trim($menuLayoutHtml) != "") {
        ?> <div id="menu_wraper" class="aside-wrap ref-winHT hide"> <?php
        echo html_entity_decode($menuLayoutHtml);
        ?> </div> <?php
    }
    ?>
<!-- For List And Form -->
<div id="content_wraper" class="universe-wrap hide listViewWrapper <?php echo ABS_API_URL ;?>" >
    <div class="tp-actn-bar hide">
        <div class="main-title col-list" id="id_listing_head" ></div>
        <div class="main-title col-content" id="detail-col-title">
            <div  id="id_detail_head" ></div>
            <div class="control-btn-wrap col-content-tooltip">
                <div class="dropdown listDrp hide">
                    <a href="#" id="dLabel" class="tooltip-item dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="prs-icon view"></i>
                        <span>View Mode</span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dLabel">
                        <li>
                            <a href="#" class="tooltip-item active show-list-view">
                                <i class="prs-icon list-view"></i>
                                <span>List</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="tooltip-item show-grid-view">
                                <i class="prs-icon grid"></i>
                                <span>Spread sheet</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="tooltip-item show-doc-view inactive">
                                <i class="prs-icon document"></i>
                                <span>Document</span>
                            </a>
                        </li>

                    </ul>
                </div>
                <div id="id_detail_tooltip" ></div>
            </div>
        </div>
    </div>
    <!-- Grid View -->
    <div class="flex-container listViewPane hide" id="">
        <?php
        if (trim($listLayoutHtml) != "") {
            echo html_entity_decode($listLayoutHtml);
        }
        ?>
        <?php
        if (trim($detailLayoutHtml) != "") {
            echo html_entity_decode($detailLayoutHtml);
        }
        ?>
    </div>

    <!-- List View -->
    <div class="flex-container gridViewPane hide" >
        <?php include("spreadsheet.php"); ?>
    </div>


    <!-- dashboard View -->
    <div class="flex-container hide dashboardViewPane" id="dashboardViewPane">
        <?php include("dashboard.php"); ?>
    </div>

</div>
<div class="action-bar-wrap right-action-bar">
    <div class="user-action-wrap right ref-winHT" id="id_detail_actions" ></div>
</div>

<footer class="footer-temp">
    <div class="breadcrumb-wrap breadcrumb_open" style="z-index: 990">
        <ol class="breadcrumb left"></ol>
        <a href="javascript:void(0);" class="breadcrumb-down">
            <i class="prs-icon icon_close" data-original-title="" title=""></i>
        </a>
    </div>
</footer>

<?php
include_once("modal.php");
include_once("flyout.php");
?>

<script>

    $(document).ready(function () {
        if(expand_deal_list_flag) {
            $('#id_listing_head').addClass('managePaneWT');
            $('#content_wraper div.listViewPane').find('div.listing-wrap').addClass('managePaneWT');
        } else {
            $('#id_listing_head').removeClass('managePaneWT');
            $('#content_wraper div.listViewPane').find('div.listing-wrap').removeClass('managePaneWT');
        }
        $('.op-complete-cnfrn').click(function () {
        });

        $('.op-complete-cancel').click(function () {
            var obj = $(this).closest('#op-complete-popup').data('clickclass');
            obj.closest('[id^=opration_id_]').removeClass('checked-div');
            obj.prop('checked', false);
            var editBtn = $('#id_detail_actions').find('.editJs');
            if (editBtn.length) {
                editBtn.removeClass('inactive-btn');
            }
        });

        $('.op-incomplete-cnfrn').click(function () {
        });

        $('.op-incomplete-cancel').click(function () {
            var obj = $(this).closest('#op-incomplete-popup').data('clickclass');
            obj.closest('[id^=opration_id_]').addClass('checked-div');
            obj.prop('checked', true);
            var editBtn = $('#id_detail_actions').find('.editJs');
            if (editBtn.length) {
                editBtn.addClass('inactive-btn');
            }
        });

        $('body').off('click.doc').on('click.doc', '.print-document', function () {

            var windownToOpen = window.open("printDocument/", "_blank", "width=800,height=600", "true");

            windownToOpen.onload = function () {
                var getClass = windownToOpen.document.getElementById("edtInnerCanvasView");
                $(getClass).removeClass("screenMode");
                windownToOpen.print();

            };
        });
    });

    $('.jq_flyout_action .flyuot_select').on('click', function () {
        flyoutModule.selectListItem();
    });

    $('#add-edit-popup .modal-footer button').on('click', function (e) {
            var getButtonValue = $(this).text();
            if(getButtonValue=="No"){
                var getRecordPerPage = $("#id_listing_body .row.active-tr").data("settings").recordPerPage;
                if(getRecordPerPage!=undefined){
                    $("#paginateChunk").val(getRecordPerPage);
                }
            }
    });

    $('#add-edit-popup #add-edit-btn').off('click.popup').on('click.popup', function () {
        var detailWwrapper = $('#id_detail_content');
        if (detailWwrapper.find('form:visible').length) {
            detailWwrapper.find('form:visible').remove();
        }
        $(".newUserRole").remove();
        $(this).data('clickclass').trigger('click');
        $(this).data('clickclass').find("a").trigger('click');
        // When "Optional Operation" is added with "Optional" menu selected, it keeps showing as selected even operation loaded for "All" menu.
        // To fix it, below line is commented
        // filterActiveOnStatus(previous_list_status);
    });

    // Work On Print Document Editor and add CSS manually and change when complete all css Awdhesh Soni
    $("body").on("click", '.doPrintDocumentEditor', function ()
    {
        var contentHeight = $('#edt').height();
        var contents = $("#edt").html();
        var dynContentClass = $.trim($('#OnOffMode').find('li.active').attr('data-value'));
        var dynParentClass = $.trim($('#OnOffMode').closest('div.edtContainer').attr('class'));
        var documentHtml = "<div class='" + dynParentClass + "'><div class='edtBody'><div class=''><div contenteditable='true' spellcheck='false' class='edt " + dynContentClass + "' id='edt' style='height:" + contentHeight + "px'>" + contents + "</div></div></div></div>";
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({"position": "absolute", "top": "-1000000px"});
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>DIV Contents</title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/editor.css">');
        frameDoc.document.write('<link rel="stylesheet" type="text/css" media="print" href="' + base_plugin_url + 'css/editor-print.css" >');
        //Append the DIV contents.
        frameDoc.document.write(documentHtml);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 1000);
    });

    //For confirmation of operation form
    $('#operation-confirm').off('click.popup').on('click.popup', function () {
        $('#id_listing_operation .active').trigger('click');
    });
    //Show a notification when an operation is marked as Complete and user tries to click on the form.
</script>

<?php if (empty($postArray['action'])) { ?>
    <script type="text/javascript" src="<?php echo BASE_URL_API; ?>component/common-script.js" ></script>
    <script type="text/javascript" src="<?php echo BASE_URL_API; ?>js/libaray.js" ></script>
<?php } ?>
