<div class="menu-bg-overlay"></div>
<div class="sidebar_leftcol leftMenuWrap">
    <ul>
        <li class="slideToRightNav" data-toggle="tooltip" data-placement="right" title="Toggle Menu"><a><i class="prs-icon list"></i></a></li>
        <li class="slideToRightNav" data-toggle="tooltip" data-placement="right" title="Search"><a><i class="prs-icon search"></i></a></li>
        <li class="" data-toggle="tooltip" data-placement="right" title="Add" id="addMenuListDiv" onclick="getContentFormForAdd(this);" ><a><i class="prs-icon add"></i></a></li>
        <li class="slideToRightNav" data-toggle="tooltip" data-placement="right" title="Filter"><a><i class="prs-icon filter"></i></a></li>
        <li class="hide print_package_icon_show" data-toggle="tooltip" data-placement="right" title="" id="printPackageDiv" onclick="printPackageDocument(this);" data-original-title="Print Package"><a><i class="prs-icon print"></i></a></li>
        <!-- new-icon -->
        <li class="divider-separator hide"></li>
        <!-- <li class="hide capping_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Capping" onclick="getFilterList(this,'true',7794,'li_id_847457','Capping');"><a><i class="prs-icon capping"></i></a></li>
        <li class="hide finance_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Financing" onclick="getFilterList(this,'true',7795,'li_id_847466','Financing');"><a><i class="prs-icon finances"></i></a></li>
        <li class="hide cash_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Cash" onclick="getFilterList(this,'true',7796,'li_id_847475','Cash');"><a><i class="prs-icon cash"></i></a></li>
        <li class="hide closing_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Closing" onclick="getFilterList(this,'true',7797,'li_id_847484','Closing');"><a><i class="prs-icon closing"></i></a></li>
        <li class="hide posting_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Posting" onclick="getFilterList(this,'true',7798,'li_id_942302','Posting');"><a><i class="prs-icon posting"></i></a></li>
        <li class="hide otherroleoperation_filter" data-toggle="tooltip" data-placement="right" title="" data-original-title="Other Role Operations" onclick="getFilterList(this,'read-edit',8849,'li_id_1459330','All');"><a><i class="prs-icon otherroleoperation"></i></a></li> -->

        <li class="hide capping_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Capping" onclick="getFilterList(this,'true',7794,'li_id_1615130','Capping');"><a><i class="prs-icon capping"></i></a></li>
        <li class="hide finance_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Financing" onclick="getFilterList(this,'true',7795,'li_id_1615140','Financing');"><a><i class="prs-icon finances"></i></a></li>
        <li class="hide cash_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Cash" onclick="getFilterList(this,'true',7796,'li_id_1615150','Cash');"><a><i class="prs-icon cash"></i></a></li>
        <li class="hide closing_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Closing" onclick="getFilterList(this,'true',7797,'li_id_1615160','Closing');"><a><i class="prs-icon closing"></i></a></li>
        <li class="hide posting_filter opsCat" data-toggle="tooltip" data-placement="right" title="" data-original-title="Posting" onclick="getFilterList(this,'true',7798,'li_id_1615170','Posting');"><a><i class="prs-icon posting"></i></a></li>
        <li class="hide otherroleoperation_filter" data-toggle="tooltip" data-placement="right" title="" data-original-title="Other Role Operations" onclick="getFilterList(this,'read-edit',8849,'li_id_1615220','All');"><a><i class="prs-icon otherroleoperation"></i></a></li>
        <!-- new-icon -->
    </ul>
</div>
<div class="sidebar_wrap ref-winHT slideNavigationWrap">    
    <div class="menu-wrapper ref-winHT">
        <div class=""> 
            <div class="">
                <ul class="menu-items">
                    <li class="selectlist">
                        <div class="search-item-wrap">
                            <div class="input-group">
                                <input type="text" id="search-text-box" class="form-control" placeholder="Search" name="search-text-box">
                                <a href="#" data-toggle="tooltip" data-placement="right" data-original-title="Search" class="input-group-addon search-text-box-js"><img class="search-img" src="http://sta.pu.prospus.com/puidata/page_plugin/component/img/arrow-select.png" alt="select arrow"><img class="cross-img hide" src="http://sta.pu.prospus.com/puidata/page_plugin/component/img/cross-img.png" alt="cross"></a>
                            </div>                                     
                        </div>
                    </li>
                    <li class="selectlist dashboardJs">
                        <div class="scroll-wrap menu-WinHT customScroll">
                            <div id="page_plugin_menu_item_list" class="panel-group accordion-wrap"  role="tablist" aria-multiselectable="true">

                            </div> 
                        </div>
                    </li>
                </ul>
            </div>
        </div>    
    </div>
    <div class="sidebar_actioncol">
        <a class="slideToLeftNav"><i class="prs-icon icon_close"></i><span>Close</span></a>
        <a class="pin-slide"><i class="prs-icon pin"></i><span>Pin</span></a>
    </div>
</div>

<script type="text/javascript">

    $(document).ready(function () {
        showFullLoader('full_page_loader');
        loadMenuListByAjax();
        //Below commented lines has been moved to "js/modules/search_module.js"
    });
    
</script>