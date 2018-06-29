
<div class="dashboard-main-wrapper ref-winHT1 dashboard-bg">
    <div class="dashboard-pane-row">
        <!--<a href="javascript:void(0)" class="dashboard-pane-col inactive hide" id="dashboard_add_deal_link1" >
            <div class="circle lg-quote-icon">
                <div class="arc RightArc"></div>
            </div>
            <h4>Create Sales Quote</h4>
        </a> -->
        <!-- openAddFormFromDashboard(this); -->
        <?php $className = ''; if($canDealAdd) { $className = ' j_my_createDeal_open'; } ?>
        <a href="javascript:void(0)" class="dashboard-pane-col hide<?php echo $className; ?>" id="dashboard_add_deal_link" onclick="openAddFormFromDashboard(this);">
            <div class="circle lg-deal-icon">
                <div class="arc bottomArc"></div>
            </div>
            <h4>Create Deal</h4>       
        </a>

        <a href="javascript:void(0)" class="dashboard-pane-col j_my_search_exsiting_deal_open hide" id="existing_deal_flyout" >
            <div class="circle lg-existing-deal-icon">
                <div class="arc leftArc"></div>
            </div>
            <h4>Find Existing Deal</h4>
        </a>
    </div>
</div>
</div>

<a href="javascript:void(0)" class="pass_the_deal_open">Click</a>
<div class="jq_flyout jq_right_flyout" id="pass_the_deal" style="margin-top:40px;" >
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT">
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="topbar-title"></div>
                <div class="top-rightActionbar control-btn-wrap"></div>
            </div>
            <div class="jq_flyout_wrap detail_content_search"></div>
        </div>


        <div class="jq_flyout_action user-action-wrap detail_actions" >
          <a href="javascript:void(0)" class="">
              <i class=""></i>
              <br>
              <span></span>
          </a>
          <a href="javascript:void(0)" class="confirm-deal-pass inactive">
              <i class="prs-icon save"></i>
              <br>
              <span>Submit</span>
          </a>
          <a href="#" class="pass_the_deal_close">
              <i class="prs-icon icon_close"></i>
              <br>
              <span>Cancel</span>
          </a>
        </div>

    </div>
</div>


<div class="jq_flyout jq_right_flyout" id="j_my_createDeal" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="content_loader_dashboard" >
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
               <div class="loaderText">
                    <div class="loader-title-text hide firstText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                    <div class="loader-title-text hide secondText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                    <div class="loader-title-text hide thirdText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                </div>
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

<div class="jq_flyout jq_cstm-left_flyout" id="j_my_search_exsiting_deal" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH" style="width:680px !important">
        <div class="loader-wrapper ref-winHT" id="j_my_search_exsiting_deal_loader" style="display:none">
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
            </div>
        </div>
        <div class="jq_flyout_body menu-items">
            <div class="main-title">
                <div class="search-item-wrap" style="padding-right:0px">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search Deal..." name="search-text-box" id="search-text-box">
                        <a href="#" class="input-group-addon search-text-box-js">
                            <img class="search-img" src="http://<?php echo FILE_DOMAIN;?>/puidata/page_plugin/component/img/arrow-select.png" alt="select arrow">
                            <img class="cross-img hide" src="http://<?php echo FILE_DOMAIN;?>/puidata/page_plugin/component/img/cross-img.png" alt="cross"></a>
                        </a>
                    </div>
                </div>
            </div>

            <div class="jq_flyout_wrap dashboardJs"></div>
        </div>
        <div class="jq_flyout_action user-action-wrap">
            <a href="#" class="">
                <i class=""></i>
                <br>
                <span></span>
            </a>
            <a href="#" class="j_my_search_exsiting_deal_close">
                <i class="prs-icon icon_close"></i>
                <br>
                <span>Cancel</span>
            </a>
        </div>
    </div>
</div>

<div class="jq_flyout jq_right_flyout" id="jq_search" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="content_loader_search_new" >
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
            </div>
           <div class="loader-title-text"><span class="progress-title">Loading </span> <span class="one">.</span><span class="two">.</span><span class="three">.</span></div>
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
<div class="jq_flyout jq_left_flyout" id="j_my_left_onhold_flyout" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT j_my_left_flyout_loader" id="j_my_left_flyout_loader">
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
          <a href="#" class="">
              <i class=""></i>
              <br>
              <span></span>
          </a>
          <a href="#" class="j_my_left_onhold_flyout_close">
              <i class="prs-icon icon_close"></i>
              <br>
              <span>Cancel</span>
          </a>
        </div>
    </div>
</div>
<div class="jq_flyout jq_left_flyout" id="j_my_left_flyout" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT j_my_left_flyout_loader" id="j_my_left_flyout_loader">
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
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
          <a href="#" class="">
              <i class=""></i>
              <br>
              <span></span>
          </a>
          <a href="#" class="j_my_left_flyout_close">
              <i class="prs-icon icon_close"></i>
              <br>
              <span>Cancel</span>
          </a>
        </div>
    </div>
</div>

<div class="jq_flyout jq_left_flyout" id="j_my_left_flyout_print" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT j_my_left_flyout_loader" id="j_my_left_flyout_loader_print" style="display: none">
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">

               <div class="loaderText">
                    <div class="loader-title-text firstText">
                      <span class="progress-title">Loading </span>
                      <span class="one">.</span>
                      <span class="two">.</span>
                      <span class="three">.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="search-item-wrap">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search Operation By Name">
                        <a href="#" class="input-group-addon">
                            <img class="search-img" src="http://<?php echo FILE_DOMAIN;?>/puidata/page_plugin/component/img/arrow-select.png" alt="select arrow">
                        </a>
                    </div>
                </div>
            </div>
            <div class="jq_flyout_wrap detail_content">
               <div class="customScroll mid-section-HT">
                    <div class="print-doc-wrap">
                        <div class="list-view">
                            <div class="document-list">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="jq_flyout_action user-action-wrap">
            <a href="#" class=""><i class=""></i><br><span></span></a>
            <a href="#" class="check-all-js" onclick="toggleChecked(this, '.child-check-all', '.jq_flyout')">
                <i class="prs-icon prs-icon check"></i>
                <br>
                <span>Unselect All</span>
            </a>
            <a href="#" class="j_my_print_close" onclick="printPackageDocumentHtml()">
                <i class="prs-icon print"></i>
                <br>
                <span>Print</span>
            </a>
             <a href="#" class="j_my_left_flyout_print_close">
                <i class="prs-icon icon_close"></i>
                <br>
                <span>Cancel</span>
            </a>
        </div>
    </div>
</div>


<!-- Deal Lookup flyout -->

<div class="jq_flyout jq_right_flyout" id="j_my_dealLookup" style="margin-top:40px;">
    <div class="jq_flyout_content jq_flyout-WH">
        <div class="loader-wrapper ref-winHT" id="content_loader_dealLookup" >
            <div class="loader-bg-mm">
               <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
               <div class="loaderText">
                    <div class="loader-title-text hide firstText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                    <div class="loader-title-text hide secondText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                    <div class="loader-title-text hide thirdText">
                        <span class="progress-title">Loading </span>
                        <span class="one">.</span>
                        <span class="two">.</span>
                        <span class="three">.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="jq_flyout_body">
            <div class="main-title">
                <div class="topbar-title" id="id_detail_head_dealLookup" ></div>
                <div class="top-rightActionbar control-btn-wrap" id="id_detail_tooltip_dealLookup" ></div>
            </div>
            <div class="jq_flyout_wrap" id="id_detail_content_dealLookup"></div>
        </div>
        <div class="jq_flyout_action user-action-wrap" id="id_detail_actions_dealLookup" ></div>
    </div>
</div>

<div id="loader-template" style="display:none">
    <div class="loader-wrapper ref-winHT">
        <div class="loader-bg-mm">
           <img src="http://<?php echo FILE_DOMAIN;?>/public/img/loader.gif" alt="Marinemax">
        </div>
    </div>
</div>

<!-- End Deal Lookup flyout -->
<script type="text/javascript">
    var has_banner_img_loaded = 0;

    <?php
    if($_SERVER['HTTP_HOST'] == "localhost")
    {
       $imgSrc = "http://".$_SERVER['HTTP_HOST']."/pu/puidata/page_plugin/component/img/dashboard-bg.jpg";
    }
    else
    {
        $imgSrc = "http://".$_SERVER['HTTP_HOST']."/puidata/page_plugin/component/img/dashboard-bg.jpg";
    }
    ?>

    $("#content_wraper").removeClass('hide');

    if($('#leftMenuBar').find('a.active').find('span').data('sectionId') == inboxMenuName.toLowerCase())
    {
        firstDashBoardLoad = 1;
     $("#content_wraper").find('.tp-actn-bar').find('#id_listing_head.main-title').html($('#leftMenuBar').find('a.active').find('span').text());

     $('<img/>').attr('src', '<?php echo $imgSrc; ?>').load(function() {
        $(this).remove();
        $('.prs-plugin').find('.dashboard-bg').css('background-image', 'url(<?php echo $imgSrc; ?>)');
        has_banner_img_loaded = 1;
        if(typeof LayoutExtendedModule != 'undefined') {
            LayoutExtendedModule._init();
        }
      });
  } else {
      firstDashBoardLoad = 0;
  }

   if ($.trim(login_role_id) != '')
    {
        if (class_node_id == "396138" && parseInt(login_role_id) != parseInt(role_id_of_sales_consultant) && parseInt(login_role_id) != parseInt(role_id_of_business_manager))
        {

            $("#dashboard_add_deal_link").addClass('hide');
            $("#dashboard_add_deal_link1").removeClass('hide');
            $("#existing_deal_flyout").removeClass('hide');

            if(parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){

                $("#dashboard_add_deal_link").addClass('hide');
                $("#dashboard_add_deal_link1").addClass('hide');
                $("#existing_deal_flyout").addClass('hide');
            }
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

        if(parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){
            $("#dashboard_add_deal_link").addClass('hide');
            $("#dashboard_add_deal_link1").addClass('hide');
            $("#existing_deal_flyout").addClass('hide');
        }

    }

</script>
