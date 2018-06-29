<div class="flex-item listing-wrap ref-winHT ">
    <div class="loader-wrapper" id="listing_loader" >
        <div class="loader-bg-mm">
           <img src="http://sta.pu.prospus.com/public/img/loader.gif" alt="Marinemax">
        </div>
    </div>
    <!-- <div class="uv-control-bar">
        <div class="row">
            <div class="col-sm-12">
                <div class="block-head">
                    <div class="main-title-wrap">
                        <div class="main-title left-side-heading" id="id_listing_head" ></div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="listing-table-head" id="id_listing_header" ></div>
    <div class="listing-table-body" id="id_listing_body"></div>
    <div class="workflow-wrap hide" id="id_listing_operation"></div>

    <div class="list-bottom" id="id_listing_pagination_container">
        <div class="paginationBottom pagination_row" id="id_listing_pagination" ></div>
    </div>
</div>

<script type="text/javascript">
    var curpage = 1;
    $(document).ready(function () {
        $('#id_listing_header').on('click', '.col-header-action', function (e) {
            if (!$(this).hasClass('entr-filter')) {
                $('#id_listing_header').find('.sort-by').removeClass('active');
            }
            if (searchModule.checkAddEditForm($(this))) {
                getColHeadFilter();
            }

        });
        $('#id_listing_header').on('keypress', '.col-header-str', function (e) {
            if (e.which == 13 && $(this).val() !== '') {
                if (searchModule.checkAddEditForm($(this))) {
                    $(this).parents('.search-item-wrap').find('.entr-filter').addClass('resetSearch').removeClass('entr-filter');
                    getColHeadFilter();
                    filterApplied($(this), 'addClass');
                }
            }
        });

        $('#id_listing_header').on('keyup', '.col-header-str', function(e) {
            var resetButtonActive = $(this).parents('.search-item-wrap').find('.resetSearch').length;
                  if(e.which !== 13 && resetButtonActive) {
                         $(this).parents('.search-item-wrap').find('.resetSearch').addClass('entr-filter').removeClass('resetSearch');    
                         filterApplied($(this), 'removeClass');                    
                  }
        });
        
        $("#id_listing_head").html(list_head);

        // $.post(base_plugin_url + 'code.php', {'action': 'list_items', 'list_head_array': list_head_array, 'list_setting_array': list_setting_array, 'list_node_id_array': list_node_id_array, 'list_mapping_id_array': list_mapping_id_array, 'login_user_id': login_user_id}, responseListHeader, 'html');

        getListHeaders();

        showFullLoader('listing_loader');
        var record_per_page = default_per_page;
        window.sessionStorage.setItem("record_per_page", record_per_page);


        // $.post(base_plugin_url + 'code.php', {'action': 'list_content', 'list_head_array': list_head_array, 'list_setting_array': list_setting_array, 'list_node_id_array': list_node_id_array, 'record_per_page': record_per_page, 'page': 1, 'list_mapping_id_array': list_mapping_id_array, 'login_user_id': login_user_id, 'pagination_record_array': pagination_record_array,'role_id': role_id}, responseListContent, 'html');
        // 
        getListContent();

        /* bind event on reset sort */
        $('#id_listing_header').on('click', '.resetSort', function(e) {
            e.stopPropagation();
            if( searchModule.checkAddEditForm($(this)) )
                {
                    var currentElm = $(this);
                        resetSortFilters(currentElm);
                }
        });

        /* bind event on search */
        $('#id_listing_header').on('click', '.entr-filter', function(e) {
            e.stopPropagation();
            var searchFieldFill = $(this).parents('.search-item-wrap').find('.col-header-str').val() !== '';
            if ( searchModule.checkAddEditForm($(this)) &&  searchFieldFill ) {
                $(this).addClass('resetSearch').removeClass('entr-filter');
                getColHeadFilter();
                filterApplied($(this), 'addClass')
            }
        });
        
        /* bind event on reset search */
        $('#id_listing_header').on('click', '.resetSearch', function(e) {
            if (searchModule.checkAddEditForm($(this))) {
                var currentElm = $(this);
                    resetListHeadSearchFilter(currentElm);
                    filterApplied($(this), 'removeClass');
            }
        });

        bindEventsSortSearch();
    });

    $('#id_listing_pagination').on('click', '.powerBtn', function (e) {
        curpage = 1;
        resetAllFilters();
    });

    /*$('#id_listing_pagination').on('click', '.powerIcon', function() {
     resetAllFilters();
     });*/

    $('.list-bottom').on('click', '.pagination li', function () {
        if (searchModule.checkAddEditForm($(this))) {
            $('.pagination a').find('span').removeClass('current');
            $(this).find('span').addClass('current');
            curpage = $(this).find('a').attr("data-page");
            getRecordPageDetail(curpage);
        }

    });
    

    
    //@ sourceURL=list_layout.js.php
</script>