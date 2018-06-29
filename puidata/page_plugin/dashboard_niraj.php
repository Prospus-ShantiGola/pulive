
<div class="dashboard-main-wrapper ref-winHT dashboard-bg">
    <div class="dashboard-pane-row">
        <a href="javascript:void(0)" class="dashboard-pane-col inactive hide" id="dashboard_add_deal_link1" >
            <div class="circle lg-quote-icon">
                <div class="arc RightArc"></div>
            </div>
            <h4>Create Sales Quote</h4>
        </a>

        <a href="javascript:void(0)" class="dashboard-pane-col j_my_createDeal_open hide" id="dashboard_add_deal_link" onclick="openAddFormFromDashboard(this);">
            <div class="circle lg-deal-icon">
                <div class="arc bottomArc"></div>
            </div>
            <h4>Create Deal</h4>
        </a>

        <a href="javascript:void(0)" class="dashboard-pane-col hide" id="existing_deal_flyout">
            <div class="circle lg-existing-deal-icon">
                <div class="arc leftArc"></div>
            </div>
            <h4>Find Existing Deal</h4>
        </a>
    </div>
</div>
</div>
<div class="jq_flyout jq_right_flyout" id="j_my_createDeal" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="content_loader_dashboard" >
            <div class="loader-bg-mm">
               <img src="http://sta.pu.prospus.com/public/img/loader.gif" alt="Marinemax">
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="topbar-title" id="id_detail_head_dashboard" ></div>
                <div class="top-rightActionbar control-btn-wrap" id="id_detail_tooltip_dashboard" ></div>
            </div>
            <div class="jq_flyout_wrap" id="id_detail_content_dashboard"></div>
        </div>
        <div class="jq_flyout_action user-action-wrap" id="id_detail_actions_dashboard" ></div>
    </div>
</div>
<div class="jq_flyout jq_right_flyout" id="jq_search" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="content_loader_search" >
            <div class="loader-bg-mm">
               <img src="http://sta.pu.prospus.com/public/img/loader.gif" alt="Marinemax">
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="topbar-title" id="id_detail_head_search" ></div>
                <div class="top-rightActionbar control-btn-wrap" id="id_detail_tooltip_search" ></div>
            </div>
            <div class="jq_flyout_wrap" id="id_detail_content_search"></div>
        </div>
        <div class="jq_flyout_action user-action-wrap" id="id_detail_actions_search" ></div> 
    </div>
</div>
<div class="jq_flyout jq_left_flyout" id="j_my_left_flyout" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="j_my_left_flyout_loader">
            <div class="loader-bg-mm">
               <img src="http://sta.pu.prospus.com/public/img/loader.gif" alt="Marinemax">
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="topbar-title detail_head" ></div>
                <div class="top-rightActionbar control-btn-wrap detail_tooltip" ></div>
            </div>
            <div class="jq_flyout_wrap detail_content"></div>
        </div>
        <div class="jq_flyout_action user-action-wrap detail_actions" >
          <a href="#" class="j_my_left_flyout_close">
              <i class="prs-icon icon_close"></i>
              <br>
              <span>Cancel</span>
          </a>
        </div>
    </div>
</div>

<script type="text/javascript">
    <?php
    if($_SERVER['HTTP_HOST'] != 'sta.pu.prospus.com' && $_SERVER['HTTP_HOST'] != 'qa.pu.prospus.com' && $_SERVER['HTTP_HOST'] != 'dev.pu.prospus.com')
    {
       $imgSrc = "http://".$_SERVER['HTTP_HOST']."/PUI/puidata/page_plugin/component/img/dashboard-bg.jpg";
    }
    else
    {
        $imgSrc = "http://".$_SERVER['HTTP_HOST']."/puidata/page_plugin/component/img/dashboard-bg.jpg";
    }
    ?>

    $("#content_wraper").removeClass('hide');

    if($('#leftMenuBar').find('a.active').find('span').data('sectionId') == 'dashboard')
    {

     $("#content_wraper").find('.tp-actn-bar').find('#id_listing_head.main-title').html($('#leftMenuBar').find('a.active').find('span').text());

     $('<img/>').attr('src', '<?php echo $imgSrc; ?>').load(function() {
        $(this).remove();
        $('.prs-plugin').find('.dashboard-bg').css('background-image', 'url(<?php echo $imgSrc; ?>)');
        if(typeof(htmlModule.properties.firstDashBoardLoad) !== 'undefined'){
            if(htmlModule.properties.firstDashBoardLoad==1){
                htmlModule.properties.firstDashBoardLoad=0;
                _init();
            }
        }
        /*
        var refreshIntervalId = setInterval(function() {
          $.keep_showing_full_page_loader = false;
          $("#menu_wraper").removeClass('hide');
          hideFullLoader('full_page_loader');

          clearInterval(refreshIntervalId);
        }, 1500);
        */
      });

    }

   if ($.trim(login_role_id) != '')
    {
        if (class_node_id == "396138" && parseInt(login_role_id) != parseInt(role_id_of_sales_consultant) && parseInt(login_role_id) != parseInt(role_id_of_business_manager))
        {
            $("#dashboard_add_deal_link").addClass('hide');
            $("#dashboard_add_deal_link1").removeClass('hide');
            $("#existing_deal_flyout").removeClass('hide');
        }
        else
        {
            $("#dashboard_add_deal_link").removeClass('hide');
            $("#dashboard_add_deal_link1").removeClass('hide');
            $("#existing_deal_flyout").removeClass('hide');
        }
    }

    if ($.trim(login_role_id) != '')
    {
        $("#addMenuListDiv").addClass('hide');
        $("#dashboard_add_deal_link").addClass('hide');
        $("#dashboard_add_deal_link1").removeClass('hide');
        $("#existing_deal_flyout").removeClass('hide');

        if (class_node_id == "396138" && canDealAdd){
            $("#addMenuListDiv").removeClass('hide');
            $("#dashboard_add_deal_link").removeClass('hide');
            $("#dashboard_add_deal_link1").removeClass('hide');
            $("#existing_deal_flyout").removeClass('hide');
        }

        if(parseInt(login_role_id) == parseInt(lookup_role_id_of_bm))
        $("#dashboard_add_deal_link1").addClass('hide');
        else
        $("#dashboard_add_deal_link1").removeClass('hide');
    }

</script>
