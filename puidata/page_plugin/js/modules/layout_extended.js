define(['ajax'], function(AjaxModule) {
    var AjaxModuleObj = new AjaxModule();
    var cache = {};

    function saveOperationalDocuments() {
        var valid = true;
        $("#j_my_createDeal").find("input[name='operation_document[]']").each(function() {
            if ($(this).val() == '') {
                valid = false;
            }
        });
        var operation_id = $("#operation_id").val();
        if (operation_id && valid) {

            var form_data = new FormData(document.getElementById("uploadOperationDocument"));
            var form_dataOptions = {
                'login_user_id': login_user_id,
                'login_role_id': deal_user_role_id,
                'deal_instance_id': $('#id_listing_body .row.active-tr').data('node-id')
            }
            setMultipleAttr(form_data, "append", form_dataOptions);

            var ajaxOptions = {
                url: base_plugin_url + 'code.php?action=saveOperationDocument',
                data: form_data,
                /*dataType: 'json',*/
                async: true,
                enctype: 'multipart/form-data',
                processData: false, // tell jQuery not to process the data
                contentType: false,
                beforeSend: function() {
                    showFullLoader('content_loader_dashboard');
                },
                success: saveOperationalDocAjaxSuccess,
                complete: saveOperationlaDocAjaxComplete
            }
            AjaxModuleObj.ajax(ajaxOptions);

        } else if (operation_id == "") {
            bootbox.alert({
                title: "Alert",
                message: "Operation not selected. Please select operation.",
            });
            return false;
        } else {
            bootbox.alert({
                title: "Alert",
                message: "Please upload operation document file.",
            });
            return false;
        }

        function saveOperationalDocAjaxSuccess(msg) {
            msg = msg.data;
            if (msg !== 'success') {
                if (typeof msg.errorMsg != undefined && typeof msg.fileName == undefined) {
                    bootbox.alert(msg.errorMsg);
                    return false;
                } else {
                    var fileWrapper = $(obj).parent();
                    fileWrapper.find('> .list-view-detail').html(msg.fileName);
                    fileWrapper.find('.bootstrap-filestyle.input-group > input').attr('value', msg.fileName);
                    $(obj).attr('value', msg.fileName);
                }
            }
        }

        function saveOperationlaDocAjaxComplete() {
            $(".j_my_createDeal_close").trigger('click');
            hideFullLoader('content_loader_dashboard');
        }
    }

    /*function to upload document for a particular operation*/

    function uploadoperationdocument(curObj) {
        $('#j_my_createDeal').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right',
            beforeopen: function() {
                makeFlyoutBlankBeforeOpen(this);
            }
        });

        operation_node_id = $("#id_listing_operation div.active").attr('data-operation-id');
        view_node_id = $("#id_listing_operation div.active").attr('data-vnid-id');
        deal_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
        deal_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
        deal_user_role_id = login_role_id;
        var data = {
            'action': 'uploadOperationDocument',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'deal_user_role_id': deal_user_role_id,
            'login_user_id': login_user_id,
        };
        var ajaxOptions = {
            data: data,
            dataType: "json",
            async: true,
            beforeSend: function() {
                showFullLoader('content_loader_dashboard');
            },
            success: uploadOperationDocSuccess,
            complete: uploadOperationDocComplete
        }

        AjaxModuleObj.ajax(ajaxOptions);

        function uploadOperationDocSuccess(d) {
            d = d.data;
            var detailWrapper = $("#id_detail_content_dashboard");
            var titleLoc = $("#id_detail_head_dashboard");
            detailWrapper.html(d.content_detail);
            $("#id_detail_actions_dashboard").html(d.actions);
            fileValidation();
        }

        function uploadOperationDocComplete() {
            hideFullLoader('content_loader_dashboard');
            $(".upload-wrap :file").filestyle({
                icon: false
            });
            paneMidHt()
            manageScrollBar();
        }
    }

    /*For Deal Rejection*/

    function dealRejectPopup(curObj, dealNodeId, deal_instance_id) {
        bootbox.confirm({
            title: 'Confirmation',
            message: 'Are you sure you want to return this deal and route back to previous user?',
            callback: function(status) {
                if (status) {
                    dealRejectReasonSave(curObj, dealNodeId, deal_instance_id);
                }
            }
        });
    }

    function resdealRejectPopup(response, s) {
        var d = response.data;
        if (BreadcrumbModule.getSectionFullPath() == 'deal->operation') {
            $('#id_detail_content form').addClass('hide');
            htmlModule.updateListWithSingleVal('#id_listing_operation div.active', '', '', 1);
        } else {
            //Update Menu Count
            updateMenuCount();
            htmlModule.updateListWithSingleVal('#id_listing_body div.active-tr', d.deal_status.key, d.deal_status.value, 1);
        }
        updateDealStatusSubStatus();
    }

    function updateDealStatusSubStatus() {
        var statusPropId = deal_status_prop_id+','+deal_sub_status_prop_id;
        var statusVal = $("#instance_property_caption"+deal_status_prop_id).val();
        var subStatusVal = $("#instance_property_caption"+deal_sub_status_prop_id).val();
        if(typeof subStatusVal !== 'undefined') {
            if ($('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').length) {
                if (subStatusVal.trim().length && ($("#instance_property_caption" + deal_status_prop_id).val() == 'Posting' || $("#instance_property_caption" + deal_status_prop_id).val() == 'Final Sale')) {
                    var status = statusVal + ' - ' + $("#instance_property_caption" + deal_sub_status_prop_id).val();
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text(status);
                } else if(statusVal.trim().length) {
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text(statusVal);
                }
            } else {
                if (subStatusVal.trim().length && ($("#instance_property_caption" + deal_status_prop_id).val() == 'Posting' || $("#instance_property_caption" + deal_status_prop_id).val() == 'Final Sale')) {
                    var status = statusVal + ' - ' + $("#instance_property_caption" + deal_sub_status_prop_id).val();
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").text(status);
                } else if(statusVal.trim().length) {
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").text(statusVal);
                }
            }
        }
    }

    function dealRejectionFrmEnable() {
        $('.reasonBoxJs, .reasonBtnJs').removeAttr('disabled');
    }

    function dealRejectionFrmDisable() {
        $('.reasonBoxJs, .reasonBtnJs').attr('disabled', 'disabled');
    }

    function saveDealRejectReason(curObj, dealNodeId, deal_instance_id) {
        var loaderId = 'content_loader_dashboard';
        showFullLoader(loaderId);
        var reasonBoxJs = $('.reasonBoxJs');
        var reason = $.trim(reasonBoxJs.val());
        if (reason.length == 0) {
            alert('Please enter reason');
            return false;
        }
        var data = {
            'action': 'saveReason',
            'deal_node_id': dealNodeId,
            'deal_instance_id': deal_instance_id,
            'login_user_id': login_user_id,
            'login_role_id': login_role_id,
            'reason': reason,
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(resSaveDealRejectReason);
        });
        // $.post(base_plugin_url + 'code.php', data, resSaveDealRejectReason, 'json');
    }

    function dealRejectReasonSave(curObj, dealNodeId, deal_instance_id) {
        var loaderId = 'content_loader_dashboard';
        showFullLoader('content_loader');
        var reasonBoxJs = $('.reasonBoxJs');
        var reason = "";
        var data = {
            'action': 'reasonSave',
            'deal_node_id': dealNodeId,
            'deal_instance_id': deal_instance_id,
            'login_user_id': login_user_id,
            'login_role_id': login_role_id,
            'reason': reason,
        };
        // $.post(base_plugin_url + 'code.php', data, resdealRejectPopup, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(resdealRejectPopup);
        });
        //Inactive Buttons
        $('.user-action-wrap .pass-deal-action,.return-deal-action').addClass('inactive');
    }

    function resSaveDealRejectReason(d, s) {
        var loaderId = 'content_loader_dashboard';
        hideFullLoader(loaderId);
        if (d == 1) {
            bootbox.alert("Deal Rejected Successfully.", function() {
                $('.j_my_createDeal_close').trigger('click');
                setTimeout(function() {
                    var activeMenu = $("#leftMenuBar").find('.active').find('span');
                    loginFromPUPlugin({
                        section_index: activeMenu.data('sectionId')
                    });
                }, 100);
            });
        }
    }

    /* For Display Workspace */
    function getWorkSpacePage(curObj) {
        searchModule.resetSearchInput();
        if ($(curObj).hasClass('deals-space-withroles')) {
            var popupWrapper = $('#workspace-open-popup');
            popupWrapper.modal('show');
            return false;
        }
        if ($(curObj).hasClass('deals-space-roles')) {
            callEditContentAction(1);
            return false;
        }
        // below section is needed to check which section is loaded
        // if ($(curObj).hasClass('workspace-action')) {
        //     GoToPageModule.options.section = 'Workspace';
        // }

        leftNavigationModule.hasFilterApplied();
        /*
         * Modified By: Divya Rajput
         * Purpose: For Task #165: Based on Anthonyâ€™s comment, we will use following naming convention:
         * Operation Name_Customer #_Deal ID # _Stock #
         */
        var globalStockNum = $.trim($('#editVessel div.list-detail-section div.form-group:eq(0) span.list-view-detail').text());
        var globalCustomerNum = $.trim($('#id_detail_content #editBuyer .list-detail-section .form-group:eq(0) span.list-view-detail').text());

        if (parseInt($('#hiddenstockNum').length) == 0) {
            var hiddenStockNumber = document.createElement("input");
            setMultipleAttr(hiddenStockNumber, "setAttribute", {
                "type": "hidden",
                "value": globalStockNum,
                "id": "hiddenstockNum"
            });
            document.body.appendChild(hiddenStockNumber);

            var hiddenCustomerNumber = document.createElement("input");
            setMultipleAttr(hiddenCustomerNumber, "setAttribute", {
                "type": "hidden",
                "value": globalCustomerNum,
                "id": "hiddencustNum"
            })
            document.body.appendChild(hiddenCustomerNumber);
        } else {
            $('#hiddenstockNum').val(globalStockNum);
            $('#hiddencustNum').val(globalCustomerNum);
        }
        /*End Here*/


        deal_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
        deal_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
        if(GoToPageModule.getSelectedRole(true) == 'super_admin'){
            deal_user_role_id = lookup_role_id_of_bm;
            var super_admin_confirmation = true;
        }else{
            deal_user_role_id = login_role_id;
            var super_admin_confirmation = false;
        }

        require(['page_module', 'utility'], function(PageModule, Utility) {
            var data = {
                'action': 'opreratinList',
                'deal_node_instance_id': deal_instance_id,
                'deal_instance_node_id': deal_node_id,
                'deal_actor_role_node_id': deal_user_role_id,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'sadmin': super_admin_confirmation,
                //'boat_length':parseInt($('#instance_property_caption3221').val()),
            };
            var settings = {
                dataType: 'json'
            };
            if (typeof OperationModule != 'undefined' && typeof OperationModule.options.cache.phase != 'undefined') {
                data['is_deal_editable'] = OperationModule.isDealEditable();
            }
            BreadcrumbModule.breadcrumb.currentLevel++;
            dataSettings = $('#id_listing_body').find('.row.active-tr').data('settings');

            // For Business Manager, load 'Cash' or 'Financing' records directly.

            var role = GoToPageModule.getSelectedRole(true);
            if(role == 'business_manager') {
                GoToPageModule.options.is_page_loading = true;
                data['status'] = 'true';
                data['propertyId'] = dataSettings['menu-property-id'];
            }
            data['fieldname'] = dataSettings['deal-type'];
            var composedFun = Utility.compose(PageModule.detailPanelLoaded, responseGetWorkSpacePage);
            var callback_params = {
                data: '',
                callback: function() {
                    PageModule.ajaxPromise(settings, data).then(composedFun);
                }
            };
            $.keep_showing_full_page_loader = true;
            showFullLoader('full_page_loader', callback_params);
        });
    }

    function createCollapsingList(indexText,response) { //add elements for accordion to left side menu if the grouping object is present
        if (response[indexText] !== undefined && response[indexText] !== 'none' && $('a[data-indexing="'+indexText+'"]').length > 0) {
            if($('a[data-indexing="'+indexText+'"]').siblings('ul').length >0){
                $('a[data-indexing="'+indexText+'"]').siblings('ul').remove();
            }
            $('a[data-indexing="'+indexText+'"]').after(response[indexText]);
            $('a[data-indexing="'+indexText+'"]').siblings('ul').addClass('panel-collapse collapse');
            $('a[data-indexing="'+indexText+'"]').addClass('collapsed');
        }
    }

    function localToUi(){ //restore html from localstorage to the UI
        if(localStorage.getItem('operationHtml') !== null){
            $('#id_listing_operation .mCSB_container').html(localStorage.getItem('operationHtml'));
            $('#id_listing_operation #operation_list.list-accordion .flex-grid').on('click',function(){
                var opId = $(this).attr('data-operation-id');
                $('li.index-view-op').removeClass('active');
                $('#page_plugin_menu_item_list').find('li').removeClass('active');
                $('li.index-view-op[data-operation-id="'+opId+'"]').addClass('active');
                $('li.index-view-op[data-operation-id="'+opId+'"]').parent().parent().addClass('active');
                $('#id_listing_operation #operation_list.list-accordion .panel-heading').removeClass('Active');
                $(this).parents('.panel-collapse').siblings('.panel-heading').addClass('Active');
                $('li.index-view-op[data-operation-id]').parent().removeClass('in');
                $('li.index-view-op[data-operation-id]').parent().siblings('a.opsParent').addClass('collapsed');
                $('li.index-view-op[data-operation-id="'+opId+'"]').parent().css('height', 'auto');
                $('li.index-view-op[data-operation-id="'+opId+'"]').parent().addClass('in');
                $('li.index-view-op[data-operation-id="'+opId+'"]').parent().siblings('a.opsParent').removeClass('collapsed');
            });
        } else {
            $('#id_listing_operation .mCSB_container').html('');
            rightFormBlank();
            bootbox.alert("Operation groups failed to load, please refresh your page.");
        }
    }

    function rightFormBlank(){ //make right side blank, no message just blank [s3/task91]
        var detailWrapper = $("#id_detail_content");
        $("#id_detail_head").html('Deal '+deal_node_id+' (Blank): Detail');
        $("#id_detail_tooltip").html('');
        $("#id_detail_actions").html('');
        var activeDiv = $("#id_listing_operation").find('div.active');
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }



        detailWrapper.html('');

        if($('#id_listing_operation').html().length<1){
            var htmlStructure = '<div class="no-record-operation-list">\
                                <div class="no-record-list noEntry">Form Not Found</div>\
                            </div>';
            var detailText = $('#operation_list').length ? '' : htmlStructure;

            detailWrapper.html(detailText);
        }
        var anchors = $('.breadcrumb-wrap').find('.active').find('a');
        if (anchors.length > 1) {
            anchors.filter(':last').remove();
        }
    }

    function leftFormBlank(){ //make left side blank message "No records found"
        var detailWrapper = $("#id_listing_operation");
        $("#id_opertion_head").html('N/A: Operation');

        var activeDiv = $("#id_listing_operation").find('div.active');
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        detailWrapper.html('<div class="noEntry no-record-operation-list">There are no operations in this grouping.</div>');
        var anchors = $('.breadcrumb-wrap').find('.active').find('a');
        if (anchors.length > 1) {
            anchors.filter(':last').remove();
        }
    }

    // function runCollapseWithJS(){ //create accordion for anchor tags with class 'collapseWithJS'
    //     $('.collapseWithJS').each(function(index,value){
    //         var anchor = $(value);
    //         var collapseIcon = '<i class="fa fa-angle-down right"></i>';
    //         anchor.siblings('ul').addClass('panel-collapse collapse in');
    //         if(anchor.hasClass('opsParent')){
    //             anchor.find('i.fa').remove();
    //             if(anchor.siblings('ul').length > 0){
    //                 anchor.append(collapseIcon);
    //                 anchor.addClass('collapsed');
    //                 anchor.siblings('ul').removeClass('in');
    //                 anchor.siblings('ul').find('li').removeClass('active');
    //             }
    //             anchor.off().on('click',function(){
    //                 showFullLoader('full_page_loader');
    //                 searchModule.resetSearchInput();
    //                 localToUi();
    //                 $('#page_plugin_menu_item_list').find('li').removeClass('active');
    //                 $(this).parent().addClass('active');
    //                 if($(this).siblings('ul').length>0 && $(this).siblings('ul').html().trim() !== ''){
    //                     var firstLi = $(this).siblings('ul').children('li.index-view-op')[0];
    //                     $(firstLi).trigger('click');
    //                 } else {
    //                     if($('#id_listing_operation #operation_list').length > 0){
    //                         var accordionText = $(this).find('.item-list-detail').text().toLowerCase();
    //                         $('#id_listing_operation #operation_list a[data-toggle="collapse"]').each(function(index,value){
    //                             resAccordionText = $(value).find('span').text().toLowerCase();
    //                             if(accordionText === resAccordionText || (accordionText === 'cash' && resAccordionText === 'cashing/financing') || (accordionText === 'financing' && resAccordionText === 'cashing/financing')){
    //                                 if($(value).hasClass('collapsed')){
    //                                     $(value).trigger('click');
    //                                 }
    //                                 divId = $(value).attr('href');
    //                                 if($(divId).find('.noEntry').length>0){
    //                                     $('#id_listing_operation #operation_list.list-accordion .panel-heading').removeClass('Active');
    //                                     $(divId).siblings('.panel-heading').addClass('Active');
    //                                     rightFormBlank();
    //                                     hideFullLoader('full_page_loader');
    //                                 } else {
    //                                     var firstOp = $(divId).find('.operation-list-pane .flex-grid')[0];
    //                                     $(firstOp).trigger('click');
    //                                 }
    //                             }
    //                         });
    //                     } else {
    //                         $('#id_listing_operation .mCSB_container').html('');
    //                         rightFormBlank();
    //                         hideFullLoader('full_page_loader');
    //                         bootbox.alert("Operation groups failed to load, please refresh your page.");
    //                     }
    //                 }
    //             });
    //         }
    //         anchor.find('i.fa').off().on('click',function(e){
    //             e.stopPropagation();
    //             if ($(this).parent().hasClass('collapsed')) {
    //                 $(this).parent().removeClass('collapsed');
    //                 $(this).parent().siblings('ul.panel-collapse').collapse('show');
    //             } else {
    //                 $(this).parent().addClass('collapsed');
    //                 $(this).parent().siblings('ul.panel-collapse').collapse('hide');
    //             }
    //         });
    //     });
    // }

    function responseGetWorkSpacePage(d, s) {
        var d = d.data;
        //modified for convert string to array
        if(searchModule.IsJsonString(d)){
            d = jQuery.parseJSON(d);
        }
        var updateBreadcrumbLevel = false;


        var elementsToHide = $("#id_listing_pagination_container,#id_listing_header,#id_listing_body,#dLabel");
        elementsToHide.addClass('hide');
        $("#id_listing_head").html(d.heading);
        $("#id_listing_operation").html(d.list).removeClass('hide');

        var status = '';
        if(GoToPageModule.options.is_page_loading) {
            GoToPageModule.options.is_page_loading = false;
            status = 'true';
        }

        if ($.trim(d.menu) != '' && d.status == status) {
            updateBreadcrumbLevel = true;
            current_deal_type = d.dealType;
            /*
             * Code Started By: Divya Rajput
             * On Date: 26th Dec 2016
             * Purpose: Show Other Role operations with sub menu
             * If operations are view Only: All
             * If operations are edit Only: All
             * If operations are both type (edit and read Only): All/Read Only/Editable
             */
            var is_operation_list = true;
            if (is_operation_list || $('#id_listing_operation').html().length > 0) {

                var menu_arr = [];
                $('#page_plugin_menu_item_list ul.item-list li').each(function() {
                    var menu_status_id = $(this).attr('data-statusid');
                    if (menu_status_id !== '' && menu_status_id !== undefined) {
                        if ($.inArray(menu_status_id, menu_arr) == -1) {
                            menu_arr.push(menu_status_id);
                        }
                    }
                });

                var ajaxData = {
                    'action': 'menu_list',
                    'node_id': d.menu,
                    'is_operation_list': is_operation_list,
                    'class_node_id': class_node_id,
                    'node_class_property_id': menu_arr,
                    'deal_node_instance_id': deal_instance_id,
                    'deal_instance_node_id': deal_node_id,
                    'deal_actor_role_node_id': deal_user_role_id,
                    'list_mapping_id_array': list_mapping_id_array,
                    'login_user_id': login_user_id,
                };
                var role = GoToPageModule.getSelectedRole(true);
                if(dataSettings && 'menu-property-id' in dataSettings && role == 'business_manager') {
                    ajaxData['highlightMenuId'] = dataSettings['menu-property-id'];
                }

                // $.post(base_plugin_url + 'code.php', ajaxData , responseMenuListAgain, 'html');
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxData).then(responseMenuListAgain);
                });
            } else {
                is_operation_list = false;
                var ajaxData = {
                    'action': 'menu_list',
                    'node_id': d.menu
                };
                // $.post(base_plugin_url + 'code.php', , responseMenuListAgain, 'html');
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxData).then(responseMenuListAgain);
                });
            }
            /*Code End By: Divya Rajput*/
        }
        if(d.indexing == 'indexing') {
            leftNavigationModule.appendSearchResult(d);
        }

        // if (d.grouping !== undefined && typeof d.grouping === 'object') {
        //     if(d.grouping.html !== undefined && d.grouping.html !== ''){
        //         localStorage.setItem('operationHtml',d.grouping.html);
        //     }
        //     createCollapsingList('indexcapping',d.grouping);
        //     createCollapsingList('indexclosing',d.grouping);
        //     createCollapsingList('indexcash',d.grouping);
        //     createCollapsingList('indexposting',d.grouping);
        //     createCollapsingList('indexfinancing',d.grouping);
        // }

        // $('li.index-view-op').off().on('click',function () {
        //     showFullLoader('full_page_loader');
        //     searchModule.resetSearchInput();
        //     localToUi();
        //     $('li[data-operation-id]').removeClass('active');
        //     $(this).addClass('active');
        //     var idVar = $(this).attr('data-operation-id');
        //     $('.flex-grid[data-operation-id]').removeClass('active');
        //     $('div[data-operation-id="'+idVar+'"]').addClass('active');
        //     $('div[data-operation-id="'+idVar+'"]').trigger('click');
        //     var accordionText = $(this).parent().siblings('a').find('.item-list-detail').text().toLowerCase();
        //     var resAccordionText = $('div[data-operation-id="'+idVar+'"]').parents('div.panel-collapse.in').siblings('.panel-heading').find('a[data-toggle="collapse"]').find('span').text().toLowerCase();
        //     $('.opsParent').parent().removeClass('active');
        //     $(this).parent().parent().addClass('active');
        //     $('.opsParent').addClass('collapsed');
        //     $('.opsParent').siblings('ul').removeClass('in');
        //     $(this).parent().siblings('.opsParent').removeClass('collapsed');
        //     $(this).parent().addClass('in');
        //     if(accordionText === resAccordionText || (accordionText === 'cash' && resAccordionText === 'cashing/financing') || (accordionText === 'financing' && resAccordionText === 'cashing/financing')){
        //         console.log("don't click!");
        //     } else {
        //         $('div[data-operation-id="'+idVar+'"]').parents('div.panel-collapse').siblings('.panel-heading').find('a[data-toggle="collapse"]').trigger('click');
        //     }
        // });

        //runCollapseWithJS(); //Initailize js based accordions in left side menu on workspace

        var detailWrapper = $("#id_detail_content");

        var listId = $("#id_listing_operation");
        searchModule.addHighlight(listId);
        searchModule.properties.cache.searchCount = d.record;
        if (searchModule.properties.cache.searchString) {
            searchModule.appendSearchFilter(searchModule.properties.activeItemListLi);
        }

        try{
            if($('.search-before.active').length > 0){
                $('.search-before.active').siblings('.active').find('a.opsParent').removeClass('collapsed');
                $('.search-before.active').siblings('.active').find('ul.panel-collapse').addClass('in');
                $('#id_listing_operation #operation_list.list-accordion .panel-heading').removeClass('Active');
                var divId = $('.search-before.active').siblings('.active').find('a.opsParent').attr('data-opstype');
                $('#'+divId).siblings('.panel-heading ').addClass('Active');
                if($('.flex-grid.active').length > 0){
                    var opId = $('.flex-grid.active').attr('data-operation-id');
                    $('.index-view-op[data-operation-id="'+opId+'"]').addClass('active');
                }
            }
        } catch(err){
            console.log('search thing: '+err);
        }

        var activeDiv = listId.find('div.active');
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        htmlModule.resetCache();
        if (d.display_type == 'add') {
            htmlModule.properties.cache.operatioForm = htmlModule.getFormData();
        }

        var i = 0;
        $('.imageListJs').each(function() {
            var img = new Image();
            img.onload = function() {
                i++;
                if (i == $('.imageListJs').length) {
                    applyJs();
                    $.keep_showing_full_page_loader = false;
                    hideFullLoader('full_page_loader');
                }
            }
            img.src = $(this).attr('src');
        });
        applyJs();
        if (d.record == 0) { // if there is no record then hide full page loader manually
            $.keep_showing_full_page_loader = false;
        }
        hideFullLoader('full_page_loader');

        if (updateBreadcrumbLevel) {
            BreadcrumbModule.breadcrumb.currentLevel += 1;
        }
        if(listId.find('div.flex-grid:visible').hasClass('active')) {
            listId.find('div.flex-grid.active:visible').trigger('click');
        } else { //when listId.find('div').hasClass('no-record-operation-list')
            rightFormBlank();
        }

        $('#j_my_createDeal').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right',
            beforeopen: function() {
                makeFlyoutBlankBeforeOpen(this);
            }
        });

        var settings = {
            type: 'overlay',
            horizontal: 'left',
            slideDirection: 'left',
            beforeopen: function() {
                leftflyoutBeforeopen(this);
            },
            onclose: function(ele, elementclicked) {
                leftflyoutOnclose();
            }
        };

        $('#j_my_left_flyout, #j_my_left_flyout_print').flyout(settings);
        /*
         * Added By: Divya Rajput
         * On Date: 24th November 2016
         * Purpose: Task#253 - Remove Chat Dialog option. This option should only be available inside a deal.*/
        $('#miniDialogue').css('display', "none");
        /*End Here*/

        is_open_workspace = 'Y';
        $("#addMenuListDiv").removeClass('hide');

        $('#id_listing_head').removeClass('managePaneWT');
        $('#content_wraper div.listViewPane').find('div.listing-wrap').removeClass('managePaneWT');

        return ['Operation'];
    }

    function checkForBM() {
    var selectedWorkspace = GoToPageModule.options.section.toLowerCase() == 'workspace',
        selectedRoleBM = GoToPageModule.getSelectedRole(true) == 'business_manager';
        return selectedWorkspace && selectedRoleBM;
   }

    function leftflyoutBeforeopen(flyout_ref) {
        $(flyout_ref).css('left', leftNavigationModule.getVisibleMenusWidth('add') + 'px').find('.j_my_left_flyout_loader').show();
    }

    function leftflyoutOnclose() {
        leftNavigationModule.toggleActiveSelection();
        form_container = "";
        checkMenuHighlight();
        setTimeout(function() {
            leftNavigationModule.toggleClassOnMenuElements();
            leftNavigationModule.getVisibleMenusWidth();
        }, 500);
    }

    function responseMenuListAgain(d, s) {
        leftNavigationModule.removeDealShortcutMenus();
        var menuContainer = $("#page_plugin_menu_item_list");
        menuContainer.html(d);
        updateMenuCount();
        // if loader element is there in menu container then remove it.
        var menuContainer = $('.menu-items .selectlist:last .scroll-wrap');
        menuContainer.find('.loader-wrapper').remove();

        // Amit Malakar >>>
        var addFlag = false;
        menuContainer.find('span.item-list-detail').each(function() {
            var html = $(this).html().toLowerCase();
            if (html.indexOf('add') >= 0)
                addFlag = true;
        });
        if (addFlag == false) {
            hideShowAddBtn();
            is_open_workspace = 'N';
        }
        var youAreOnDashboard = $("a#section_id_dashboard.active").length;
        if (youAreOnDashboard > 0) {
            $("div#menu_wraper").addClass('hide');
        }
        is_open_workspace = 'Y';
        $("#addMenuListDiv").removeClass('hide');
        // <<< Amit Malakar
        var $icons = $(".print_package_icon_show, .capping_filter, .finance_filter, .closing_filter, .posting_filter, .divider-separator, .otherroleoperation_filter");
        $icons.removeClass("hide");

        if (current_deal_type == 'Cash') {
            $('#menu_wraper li.finance_filter, #li_id_1615140, #li_id_1615270').addClass('hide');
            $('#menu_wraper li.cash_filter, #li_id_1615150, #li_id_1615280').removeClass('hide');
        }
        if (current_deal_type == 'Financing') {
            $('#menu_wraper li.finance_filter, #li_id_1615140, #li_id_1615270').removeClass('hide');
            $('#menu_wraper li.cash_filter, #li_id_1615150, #li_id_1615280').addClass('hide');
        }
        current_deal_type = '';

        iconBlue();
        checkMenuHighlight();
        var pre_selected_main_manu;
        if(dataSettings && 'deal-type' in dataSettings) {
            pre_selected_main_manu = dataSettings['deal-type'];
        }
        leftNavigationModule.createShortcutMenus(pre_selected_main_manu);
    }

    function closeNotification(popupWrapper, params) {
        popupWrapper.find('.close_notification').remove();
        var closeBtn = '<span class="close_notification"><i class="prs-icon icon_close_white"></i></span>';
        popupWrapper.prepend(closeBtn);
        popupWrapper.find('.close_notification').on('click', function() {
            params.callback();
        });
    }

    function getFormElementSelector(wrapper) {
        if(wrapper.find('span[contenteditable="true"],.canvasChkBox,.canvasRadioBtn').length) {
            return 'span[contenteditable="true"],.canvasChkBox,.canvasRadioBtn';
        }
    }

    function getOperationInstanceForm(curObj, div_id, view_instance_id, e, readstatus) {
        var id = div_id;
        var obj_ref = $(curObj);
        var onclikAttr = obj_ref.attr('onclick');
        obj_ref.attr('onclick', 'return false;');
        var detailWrapper = $("#id_detail_content");
        // if (htmlModule.checkFormState(detailWrapper.find('form:visible'))) {
        //     var msg = 'Are you sure you want to continue?  Any unsaved data will be lost.';
        //     searchModule.showPopup(obj_ref, msg);
        //     obj_ref.attr('onclick', onclikAttr);
        //     return false;
        // }
        if (htmlModule.properties.cache.displayType == 'Edit') {
            searchModule.showPopup(obj_ref);
            obj_ref.attr('onclick', onclikAttr);
            return false;
        }

        var target = e.target || e.srcElement;
        target = $(target);
        if (target.is(':checkbox') && $('#id_detail_tooltip .detailJs.active').length) {
            if (target.hasClass('checkbox_inactive')) {
                var phseRoleId = OperationModule.options.cache.phase.RoleId;
                if (phseRoleId != login_role_id) {
                    return false;
                }
            }
            obj_ref.attr('onclick', onclikAttr);
            return true;
        }
        obj_ref.attr('onclick', onclikAttr);
        /*if (obj_ref.hasClass('active') && $('#id_detail_tooltip .detailJs.active').length) {
            if (typeof e.isTrigger == "undefined") {
                return false;
            }
        } else if (obj_ref.hasClass('active') && $('#id_detail_tooltip .detailJs.active').length == 0) {
            if (typeof e.isTrigger == "undefined") {
                searchModule.showPopup(obj_ref);
                return false;
            }
        }*/

        var detail_content_wrapper = $("#id_detail_content");
        var element_selector = getFormElementSelector(detail_content_wrapper);
        if(element_selector) {
            if(UtilityModule.hasFormStateChanged("#id_detail_content", element_selector)) {
                var message = UtilityModule.getFormStateChangedMessage("#id_detail_content", element_selector);
                bootbox.confirm({
                    title: 'Confirm',
                    message: message,
                    callback: function(state) {
                        if(state) {
                            UtilityModule.resetCache("#id_detail_content", element_selector);
                            getOperationInstanceForm(curObj, div_id, view_instance_id, e, readstatus);
                        }
                    }
                });
                return false;
            }
        }

        if(UtilityModule.hasFormStateChanged("#id_detail_content", 'input:visible:not([readonly])')) {
            var message = UtilityModule.getFormStateChangedMessage("#id_detail_content", 'input:visible:not([readonly])');
            bootbox.confirm({
                title: 'Confirm',
                message: message,
                callback: function(state) {
                    if(state) {
                        UtilityModule.resetCache("#id_detail_content", 'input:visible:not([readonly])');
                        getOperationInstanceForm(curObj, div_id, view_instance_id, e, readstatus);
                    }
                }
            });
            return false;
        }

        if(!obj_ref.hasClass('mode-index-view')) {
            leftNavigationModule.removeIndexViewSubMenus();
        }
        if (view_instance_id == '') {
            $("#id_listing_operation .flex-grid").removeClass('active');
            $("#id_listing_operation #opration_id_" + id).addClass('active');
            var html = '<div class="noEntry">Form Not Available</div>';
            $('#id_detail_content').html(html);

            var activeTr = $("#id_listing_operation .active");
            var titleLoc = $("#id_detail_head");
            setOperationDetailHeading(activeTr, titleLoc);
            // right bar actions
            $('#id_detail_actions a').each(function() {
                if ($(this).find('i').hasClass('dialogue')) {
                    $(this).removeClass('hide');
                } else {
                    $(this).addClass('hide');
                }
            });
            $('#id_detail_tooltip a').removeClass('active');
            $('#id_detail_tooltip a:first:visible').addClass('active');
            if ($('#id_listing_operation').find('div.active').data('document') == "") {
                $('.documentJs').addClass('hide');
            }
        } else {
            var id_listing_operation = $("#id_listing_operation");
            var activeItem;
            if(obj_ref.hasClass('mode-index-view')) {
                id_listing_operation = id_listing_operation.find("#operation_list");
                id_listing_operation.find('.Active').removeClass('Active');
            }
            var alreadyActiveItem = id_listing_operation.find(".flex-grid.active");
            alreadyActiveItem.removeClass('active');

            activeItem = id_listing_operation.find("#opration_id_" + id);
            activeItem.addClass('active');
            activeItem.closest('.panel-item-list').prev().addClass('Active');

            var operation_node_id = activeItem.attr('data-operation-id');
            var data_document_id = '';
            if (activeItem.attr('data-document'))
                data_document_id = activeItem.attr('data-document');

            require(['page_module', 'utility'], function(PageModule, Utility) {
                var data = {
                    'action': 'getOpreratinForm',
                    'view_instance_id': view_instance_id,
                    'deal_instance_id': deal_instance_id,
                    'deal_node_id': deal_node_id,
                    'deal_user_role_id': deal_user_role_id,
                    'login_user_id': login_user_id,
                    'operation_node_id': operation_node_id,
                    'data_document_id': data_document_id,
                    'readstatus': readstatus,
                    'super_admin_role_id':login_role_id,
                };
                if (obj_ref.hasClass('last_operation')) {
                    data['i_am_done'] = 1;
                    data['is_checked'] = (obj_ref.hasClass('checked-div')) ? 1 : 0;
                    data['is_completed'] = ($(obj_ref).find('input[type="checkbox"].checkbox_inactive').length == 0) ? 1 : 0;
                }

                var composedFun = Utility.compose(PageModule.detailPanelLoaded, responseGetOperationInstanceForm);
                var callback_params = {
                    data: '',
                    callback: function() {
                        PageModule.ajaxPromise({
                            dataType: 'json',
                            // abort: 1,
                            loader_id: 'full_page_loader'
                        }, data).then(composedFun);
                    }
                };

                if (htmlModule.properties.temporaryOperationChecked.length > 0) {
                    for (var x = 0; x < htmlModule.properties.temporaryOperationChecked.length; x++) {
                        id_listing_operation.find("#" + htmlModule.properties.temporaryOperationChecked[x]).addClass("throbHighlight");
                    }
                }
                htmlModule.properties.temporaryOperationChecked = [];
                showFullLoader('content_loader', callback_params);
            });
        }
        leftNavigationModule.synchronizeHighlight(obj_ref, id);
        setTimeout(function() {
            bindClick();
        }, 3000);
        DocDualPaneAnmate();
        $('.listing-details-wrap').removeClass('esign-mode');
    }

    function responseGetOperationInstanceForm(d, s) {
        // hideFullLoader
        var d = d.data;
        var id_detail_actions = $("#id_detail_actions");
        var id_detail_tooltip = $("#id_detail_tooltip");
        var id_listing_operation = $("#id_listing_operation");
        if($("#operation_list:visible").length) {
            id_listing_operation = id_listing_operation.find('#operation_list');
        }
        is_open_workspace = 'Y';
        var selectedRole = GoToPageModule.getSelectedRole(true);
        if(selectedRole != 'super_admin') {
            $("#addMenuListDiv").removeClass('hide');
        }
        var detailWrapper = $("#id_detail_content");
        var titleLoc = $("#id_detail_head");
        id_detail_tooltip.html(d.tooltip);
        var activeDiv = id_listing_operation.find('div.active');
        var is_completed = ($(activeDiv).find('input[type="checkbox"].checkbox_inactive').length == 0) ? 1 : 0;
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        setOperationDetailHeading(activeDiv, titleLoc);
        detailWrapper.html(d.content_detail);
        operation_detail_node_class_id = $("#id_detail_content").find("#node_class_id").val();
        applyDatePicker();
        $('.hasDatepicker').each(function(i,val) {
            if($(this).prev().length && $(this).prev().hasClass('light-green') ){
                $(this).addClass('light-green auto-field');
                $(this).closest('.col-sm-8').find('.list-view-detail').addClass('light-green auto-field');
            }
        });
        id_detail_actions.html(d.actions);
        var getMainWid = $('.tp-actn-bar').width();
        $('.listing-details-wrap').css('width', getMainWid / 2);
        if (d.hasOwnProperty('content_values')) {
            var display_type = d.display_type;
            editFormSetValues(d.content_values, display_type);
        } else {
            detailWrapper.find(":file").filestyle();
        }
        if (d.disabled_wrapper == 1) {
            var wrapper = $('<div />').css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                zIndex: 1
            }).addClass('disabled-wrapper');
            setTimeout(function() {
                detailWrapper.find('form').closest('.mCSB_container').append(wrapper);
            }, 500);
        }
        $("#id_detail_content").find('input[type="file"]').parent().find('.bootstrap-filestyle').find('input[type="text"]').attr('readonly', true);
        /*Hide all action buttons from right bar for instructions-only operation forms.*/
        if (id_listing_operation.find('div.active').data('document') == "") {
            if (d.display_type == 'add') {
                if (($('.listing-content-wrap').find("input:visible").length == 0) && ($('.listing-content-wrap').find("textarea:visible").length == 0) && ($('.listing-content-wrap').find("select:visible").length == 0)) {
                    id_detail_actions.find('a.saveJs').addClass('hide temphide');
                    id_detail_tooltip.find('a.tooltip-item').addClass('hide temphide');
                    id_detail_tooltip.find('a.tooltip-item.detailJs').removeClass('hide');
                    /* Code For Operation File Tag Only*/
                    $('#id_detail_content input[type="file"]').each(function(index) {
                        $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                        if ($(this).attr('value') != '') {
                            $(this).next().find('input[type="text"]:first').attr('value', $(this).attr('value'));
                        }
                    });
                }
            } else if (d.display_type == 'view') {
                if (($('.listing-content-wrap').find("input[type!='hidden']").length == 0) && ($('.listing-content-wrap').find("textarea:not('.hide')").length) && ($('.listing-content-wrap').find("select:not('.hide')").length == 0)) {
                    id_detail_actions.find('a.editJs').addClass('hide temphide');
                    id_detail_tooltip.find('a.tooltip-item').addClass('hide temphide');
                    id_detail_tooltip.find('a.tooltip-item.detailJs').removeClass('hide');
                } else {
                    id_detail_actions.find('a.temphide').removeClass('hide temphide');
                    id_detail_tooltip.find('a.temphide').removeClass('hide temphide');
                }
            } else if (d.display_type == 'edit') {
                id_detail_actions.find('a.temphide').removeClass('hide temphide');
                id_detail_tooltip.find('a.temphide').removeClass('hide temphide');
            }
        } else {
            if (d.display_type == 'add') {
                if (($('.listing-content-wrap').find("input:visible").length == 0) && ($('.listing-content-wrap').find("textarea:visible").length == 0) && ($('.listing-content-wrap').find("select:visible").length == 0)) {
                    id_detail_actions.find('a.saveJs').addClass('hide temphide');
                }
            } else if (d.display_type == 'view') {
                if (($('.listing-content-wrap').find("input[type!='hidden']").length == 0) && ($('.listing-content-wrap').find("textarea:not('.hide')").length == 0) && ($('.listing-content-wrap').find("select:not('.hide')").length == 0)) {
                    id_detail_actions.find('a.editJs').addClass('hide temphide');
                } else {
                    id_detail_actions.find('a.temphide').removeClass('hide temphide');
                }
            } else if (d.display_type == 'edit') {
                id_detail_actions.find('a.temphide').removeClass('hide temphide');
            }
        }

        if (d.display_type == 'add') {
            $('#id_detail_content input[type="file"]').each(function(index) {
                $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                if ($(this).attr('value') != '') {
                    $(this).next().find('input[type="text"]:first').attr('value', $(this).attr('value'));
                }
            });
        }

        /*End Here*/

        htmlModule.resetCache();
        if (d.display_type == 'add') {
            htmlModule.properties.cache.operatioForm = htmlModule.getFormData();
        }
        applyJs();
        searchModule.addHighlight(detailWrapper.find('.col-sm-8'));
        autosize($('textarea'));

        // UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');

        /* Code For Operation File Tag Only*/
        if (d.display_type == 'add') {
            $('#id_detail_content input[type="file"]').each(function(index) {
                if ($(this).attr('value') != '' && $(this).attr('value') != undefined) {
                    $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                    $(this).next().find('input[type="text"]:first').attr('value', $(this).attr('value'));
                } else {
                    //$(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name','fileZvalue'+$(this).attr('data-id'));
                }
            });
        }
        if (!is_completed) {
            //$(".control-btn-wrap a").not('.active').addClass('inactive'); // Commented because Document tab was inactive for RM
        }
        fileValidation();

        var activeRow       = id_listing_operation.find('.active');
        var actionOperation = activeRow.find('.breadcrumb-heading-js').text().toLowerCase();
        if (localStorage.appOneFilePath != undefined) {
            var getName = localStorage.appOneFilePath;
            var newName = getName.split("/");
            var fileNamePath = "<a href='" + localStorage.appOneFilePath + "' target='_blank'>" + newName[newName.length - 1] + "</a>";
            var id_detail_instance_id = $('#id_detail_instance_id').val();
            if (id_detail_instance_id) {
                // make ajax call to save instance value
                $.ajax({
                    url: base_plugin_url + 'code.php',
                    method: "POST",
                    data: {
                        action: 'appOneFilePathSave',
                        fileName: fileNamePath,
                        id_detail_instance_id: id_detail_instance_id,
                        type: 'on_first_time',
                    },
                    success: function(result) {
                        if (activeRow.length && actionOperation != 'appone' ) //&& !pageLoadedAppOne) {
                        {
                            UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
                            hideFullLoader('content_loader');
                        }

                        id_listing_operation.find('div.active').trigger('click');
                    }
                });
            } else {
                $("#instance_property_caption7211").val(fileNamePath);
                setTimeout(function() {
                    $(".right-action-bar .saveJs").trigger("click");
                }, 600);
                if (activeRow.length && actionOperation != 'appone' ) //&& !pageLoadedAppOne) {
                {
                    UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
                    hideFullLoader('content_loader');
                }
            }
            var appFilePath = localStorage.appOneFilePath;
            localStorage.removeItem("appOneFilePath");
            /* Start Code By Arvind Soni */
            createPdfImages(appFilePath);
            /* End Code By Arvind Soni */
        } else {
            if (activeRow.length && actionOperation != 'appone' ) //&& !pageLoadedAppOne) {
            {
                hideFullLoader('content_loader');
                $.do_not_hide_loader = false;
                $.keep_showing_full_page_loader = false;
                hideFullLoader('full_page_loader'); // this should work only when BM goes to workspace page.
                UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
            }
        }

        var section = BreadcrumbModule.getSectionFullPath();
        if(section == 'deal->operation') {
            htmlModule.collapseSectionIfEmpty('#content_scroler_div', '.list-title-heading', d.display_type);
        }

        operation_detail_node_class_id = $("#id_detail_content").find("#node_class_id").val();
        setTimeout(function() {
            // APPONE STATUS FETCH FUNCTION
            //var activeRow = id_listing_operation.find('.active');
            if (activeRow.length && actionOperation == 'appone' ) //&& !pageLoadedAppOne) {
            {
                appOneApplicationStatus();
            }
            bindClick();
        }, 3000);
        viewEditTextBox('view', '.hasHiddenTextBox');
        PermissionModule.checkPermissionForOperation(d.permission);
        checkUploadedDocView('.remote_download_link');
        $('[addnewtextbox]').addNewTextbox()
    }

    function appOneApplicationStatus() {
        $.ajax({
            url: base_plugin_url + 'code.php',
            method: "POST",
            data: {
                action: 'checkAOApplicationStatus',
                deal_instance_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id'),
                deal_node_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id'),
                deal_user_role_id: deal_user_role_id,
                login_user_id: login_user_id,
                operation_node_id: $("#id_listing_operation div.active").attr('data-operation-id')
            },
            success: function(result) {

                var res = result.data;
                /* set the application id and status value when first time comes from deal on APPONE Operation */
                if($("#id_detail_instance_id").val() == '')
                {
                    $('.appone_application_id').val(res.application_id);
                    var status = '';
                    if (res.error.length) {
                        //status = '<a class="err-msg" data-toggle="tooltip" data-placement="right" title="" data-original-title="'+res.error+'">Error</a>';
                        status = res.error;
                        $('.appone_status').val(status).addClass('appone_error');
                    } else {
                        status = res.status;
                        $('.appone_status').val(status);
                    }
                    var saveJsBtn = $('.right-action-bar .saveJs');
                    // if save button is not incative then trigger it
                    if(!saveJsBtn.closest('.user-action-wrap').hasClass('inactive')) {
                        saveJsBtn.trigger('click');
                    } else {
                        //otherwise hide the loader
                        hideFullLoader('content_loader');
                        $.do_not_hide_loader = false;
                        $.keep_showing_full_page_loader = false;
                        hideFullLoader('full_page_loader');
                        UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
                    }
                }

                /* set the application id and status value every time except first time comes from deal on APPONE Operation */
                if($("#id_detail_instance_id").val() != '')
                {
                    $('.appone_application_id').closest('div').find('span').html(res.application_id);
                    var status = '';
                    if (res.error.length) {
                        //status = '<a class="err-msg" data-toggle="tooltip" data-placement="right" title="" data-original-title="'+res.error+'">Error</a>';
                        status = res.error;
                        $('.appone_status').closest('div').find('span').html(status).addClass('appone_error');
                    } else {
                        status = res.status;
                        $('.appone_status').closest('div').find('span').html(status);
                    }

                    $.ajax({
                        url: base_plugin_url + 'code.php',
                        method: "POST",
                        data: {
                            action: 'appOneFilePathSave',
                            applicationpId: $('.appone_application_id').closest('div').find('input[type=hidden]').val(),
                            applicationId: res.application_id,
                            statuspId: $('.appone_status').closest('div').find('input[type=hidden]').val(),
                            status: status,
                            id_detail_instance_id: $("#id_detail_instance_id").val(),
                            type: 'on_view_time',
                        },
                        success: function(result) {
                            hideFullLoader('content_loader');
                            $.do_not_hide_loader = false;
                            $.keep_showing_full_page_loader = false;
                            hideFullLoader('full_page_loader');
                            UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
                        }
                    });
                }

                $('[data-toggle="tooltip"]').tooltip({
                    trigger: "hover"
                });
            }
        });
    }

    /**
     * [makeFlyoutBlankBeforeOpen description: Remove pre-existing html before flyout opens ]
     * @param  {Object} flyout_element [ flyout object ]
     */
    function makeFlyoutBlankBeforeOpen(flyout_element) {
        var menuTitleEle = $(flyout_element).find('.jq_flyout_body').find('.main-title');
        menuTitleEle.find('.topbar-title').text('');
        menuTitleEle.find('.control-btn-wrap').text('');

        menuTitleEle.parent().find('.jq_flyout_wrap').text('');
    }

    function manageMenuDashboard() {
        if ($.trim(menu_list_instance_id) == '' || menu_list_instance_id == undefined) {
            $(".tp-actn-bar, .listViewPane, .right-action-bar").addClass('hide');
            $('#dashboardViewPane').removeClass('hide');
            $('#content_wraper').removeClass('listViewWrapper').addClass('dashboardViewWrapper').removeClass('hide');
            $('#j_my_createDeal').flyout({
                type: 'overlay',
                horizontal: 'right',
                slideDirection: 'right',
                beforeopen: function() {
                    makeFlyoutBlankBeforeOpen(this);
                }
            });
            $('#j_my_search_exsiting_deal').flyout({
                type: 'overlay',
                horizontal: 'left',
                slideDirection: 'left'
            });
            resizeHT();
        } else {
            $(".tp-actn-bar, .listViewPane, .right-action-bar").removeClass('hide');
            $('#dashboardViewPane').addClass('hide');
            $('#content_wraper').addClass('listViewWrapper').removeClass('dashboardViewWrapper');
        }
    }

    function dashboardViewPane() {
        $('body').off('click', '#existing_deal_flyout').on('click', '#existing_deal_flyout', function(event) {
            $("div#menu_wraper.hide").removeClass('hide');
            //$('.slideToRightNav').trigger('click');
            searchModule.resetMenuAction();
        });
    }

    /* Code By Ben */
    function responseSearchActor(d, s) {
        d = d.data;
        var wrapper = flyoutModule.properties.listUl;
        $(wrapper).html(d.list);
        $(wrapper).find('li:first').trigger('click');
        flyoutModule.addHighlight($(wrapper));
        setTimeout(function() {
            applyJs();
        });
    }

    /* Start Code By Awdhesh Soni On 18 July 2016 */
    /* For Display Document Data */
    function getDocument(curObj) {
        var obj_ref = $(curObj);
        var detailWrapper = $("#id_detail_content");
        var active_row = $('.workflow-wrap div.active');
        var is_other_role_operation = active_row.data('is-other-role-operation');
        var read_permission = active_row.data('read-permission');
        // if (htmlModule.checkFormState(detailWrapper.find('form:visible'))) {
        //     var onclikAttr = obj_ref.attr('onclick');
        //     var msg = 'Are you sure you want to continue?  Any unsaved data will be lost.';
        //     searchModule.showPopup(obj_ref, msg);
        //     obj_ref.attr('onclick', onclikAttr);
        //     return false;
        // }
        if(UtilityModule.hasFormStateChanged("#id_detail_content", 'span[contenteditable=true]')) {
            var message = UtilityModule.getFormStateChangedMessage("#id_detail_content", 'span[contenteditable=true]');
            bootbox.confirm({
                title: 'Confirm',
                message: message,
                callback: function(state) {
                    if(state) {
                        UtilityModule.resetCache("#id_detail_content", 'span[contenteditable=true]');
                        getDocument(curObj);
                    }
                }
            });
            return false;
        }
        if (htmlModule.properties.cache.displayType == 'Edit') {
            var onclikAttr = obj_ref.attr('onclick');
            searchModule.showPopup(obj_ref);
            obj_ref.attr('onclick', onclikAttr);
            return false;
        }
        var callback_params = {
            data: '',
            callback: function() {
                var flexGridActive = $("#id_listing_operation").find('.flex-grid.active');
                var data = {
                    'login_user_id': login_user_id,
                    'list_mapping_id_array': list_mapping_id_array,
                    'flag': 'save',
                    'action': 'viewDocument',
                    'document_node_id': flexGridActive.data('document'),
                    'deal_instance_id': flexGridActive.data('dealnodeinsid'),
                    'deal_node_id': deal_instance_id,
                    'deal_user_role_id': flexGridActive.data('rolenodeid'),
                    'operation_node_id': flexGridActive.data('operation-id'),
                    'view_instance_id': flexGridActive.data('data-vnid-id'),
                    'operation_detail_node_class_id': operation_detail_node_class_id,
                    'is_other_role_operation': is_other_role_operation,
                    'read_permission':read_permission,
                    'super_admin_role_id':login_role_id,
                };
                DocDualPaneAnmate();
                $('.listing-details-wrap').removeClass('esign-mode');
                // $.post(base_plugin_url + 'code.php', data, responseDocument, 'json');
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseDocument);
                });
            }
        };

        showFullLoader('content_loader', callback_params);
        // code for canvas start here
        $("body").off("paste","#edtInnerCanvasView td").on("paste","#edtInnerCanvasView td",function(event){
            //showFullLoader('content_loader', callback_params);
            // code for canvas start here
            event.preventDefault();
            var plain_text = (event.originalEvent || event).clipboardData.getData('text/plain');
            if (typeof plain_text !== "undefined") {
                document.execCommand('insertText', false, plain_text);
            }
            return false;
        });
        $("body").off("click", ".canvasChkBox").on("click", ".canvasChkBox", function() {
            var checkStatus = $(this).is(":checked");
            if (!checkStatus) {
                $(this).attr("checked", false)
            } else {
                $(this).attr("checked", true)
            }
        });

        $("body").off("click", ".canvasRadioBtn").on("click", ".canvasRadioBtn", function(e) {
            var getName = $(this).attr("name");
            $("[name="+getName+"]").attr("checked", false).prop("checked", false);
            $(this).attr("checked", true).prop("checked", true);
        });
        // end
    }

    function showConfirmationPopup(params) {
        var defaultParams = {
            msg: 'Are you sure you want to cancel?',
            callback: function() {
                console.log('No callback provided!!');
            }
        };
        var final_params = $.extend(defaultParams, params);
        var modal = $("#commonConfirmPopup");
        modal.find('.series-content').text(final_params.msg);
        modal.find('.confirm-yes').off('click').on('click', function() {
            final_params.callback();
        });
        modal.modal('show');
    }

    function getReviewDocument(skip) {

        // skip === true means do not show confirmation popup.
        if (skip !== true) {
            var formObj = $("#id_detail_content").find('form.form-horizontal');
            if (htmlModule.checkFormState(formObj) === true) {
                var confirmationParams = {
                    msg: 'Click Yes to save the changes?',
                    callback: function() {
                        htmlModule.properties.load_document_view = true;
                        callDetailsContentAction('D');
                    }
                };
                showConfirmationPopup(confirmationParams);
                return true;
            }
        }
        htmlModule.properties.load_document_view = false;
        var callback_params = {
            data: '',
            callback: function() {
                var documentNodeId = $("#id_listing_operation").find('.flex-grid.active').data('document');
                var dealNodeInsId = $(".listing-table-body .active-tr").attr('data-node-id')
                var roleNodeId = $("#id_listing_operation").find('.flex-grid.active').data('rolenodeid');
                var operationId = $("#id_listing_operation").find('.flex-grid.active').data('operation-id');
                var dealViewId = $("#id_listing_operation").find('.flex-grid.active').data('data-vnid-id');
                documentNodeId = '902585';
                //Check for PPC class
                var actionType = 'viewRequirementDocument';
                DocDualPaneAnmate();
                $('.listing-details-wrap').removeClass('esign-mode');
                // $.post(base_plugin_url + 'code.php', , responseDocument, 'json');
                var data = {
                    'action': 'viewReviewDocument',
                    'document_node_id': documentNodeId,
                    'deal_instance_id': dealNodeInsId,
                    'deal_user_role_id': roleNodeId,
                    'login_user_id': login_user_id,
                    'operation_node_id': operationId,
                    'list_mapping_id_array': list_mapping_id_array,
                    'flag': 'save',
                    'view_instance_id': dealViewId,
                    'actionType': actionType
                };
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseDocument);
                });

            }
        };
        showFullLoader('content_loader', callback_params);
    }

    function checkPPCurl() {
        var str = window.location.href.toLowerCase();
        if ($('#section_id_performance').hasClass('active') || (str.indexOf("/mmppc") > -1 || str.indexOf("/ppc") > -1)) { // (str.indexOf("/mmppc") > -1 || str.indexOf("/ppc") > -1)
            return true;
        } else {
            return false;
        }
    }

    function getUrlFromString(str) {
        var re = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
        var m = re.exec(str);
        return m[0]
    }

    function responseDocument(d, s) {
        d = d.data;
        appendResponse(d, s);
        loadCanvasPaneAnmate();
    }

    function appendResponse(d, s) {
        var detailWrapper = $("#id_detail_content");
        $(detailWrapper).addClass('edt-main-wrapper');
        var titleLoc = $("#id_detail_head");
        $("#id_detail_tooltip").html(d.tooltip);
        detailWrapper.html(d.content_detail);
        var activeDiv = $('#id_listing_operation').find('div.active');
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        if (checkPPCurl()) {
            titleLoc.html('Employee Review: Document');
        } else {
            setOperationDetailHeading(activeDiv, titleLoc);
        }
        $("#id_detail_actions").html(d.actions);
        if (checkPPCurl() && $('.editDocJs-view:visible').length > 0 && !$('.editDocJs-view').hasClass('inactive')) {
            $(".edt .edtDynamicTextField").each(function(index, element) {
                $(this).attr('readonly', true);
                $(this).addClass('edt-elm-readmode');
            });
            $("#edtCanvasView td").each(function() {
                $(this).attr('contenteditable', false);
            });
        }
        try {
            $(".deletePageSpan").remove(); // Fixing the delete page button issue for user in canvas documents
            $("#edtCanvasView td").attr('contenteditable', false);
            if (d.save_type === 'save' || d.save_type === 'edit') {
                $("#edtCanvasView td").find('.canvasDynamicField').attr('contenteditable', true);
                $("#edtCanvasView td").find('.canvasDynamicField').on('keypress', function(event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();
                    }
                });
                $("#edtInnerCanvasView").find('span[data-source]').each(function() {
                    if ($(this).data('source').indexOf(d.detail_form_node_id) > -1) {
                        $(this).attr('contenteditable', true);
                        $(this).addClass('light-green');
                    }
                });
                UtilityModule.setFormState("#id_detail_content", 'span[contenteditable=true]');
            } else {
                $("#edtCanvasView td").find('.canvasDynamicField').attr('contenteditable', false);
                UtilityModule.resetCache();
                $("#edtInnerCanvasView").find('span[data-source]').each(function() {
                    if ($(this).data('source').indexOf(d.detail_form_node_id) > -1) {
                        $(this).attr('contenteditable', false);
                        $(this).addClass('light-green');
                    }
                });
                detailWrapper.find('input[type="radio"],input[type="checkbox"]').attr('disabled', true);
            }
        } catch (err) {
            console.log('Error due to canvas document form: ' + err);
        }
        if (d.disabled_wrapper == 1) {
            var wrapper = $('<div />').css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                zIndex: 1,
            }).addClass('disabled-wrapper');
            setTimeout(function() {
                detailWrapper.find('#edtCanvasView').closest('.mCSB_container').append(wrapper);
                $("body").on('click.disabled-wrapper', '.disabled-wrapper', manageDetailNotification);
            }, 500);
        }
        if (typeof toggleEditorView == 'function') {
            EditorPaneHT();
            mangeNiceScroller();
            toggleEditorView();
            hideFullLoader('content_loader');
        } else {
            /*
             * check if file is not exits
             * then add new file
             */
            var scriptArr = {
                'edt-script-editor': 'edt-script.js'
            };
            addScriptFileAppend(scriptArr);
        }

        $('#id_detail_tooltip').find('.detail').closest('a').off('click').on('click', function() {
            if (checkPPCurl()) {
                $('.listing-wrap .active-tr').trigger('click');
            } else {
                var obj_ref = $('.workflow-wrap .active');
                var hasFormStateChanged = UtilityModule.hasFormStateChanged("#id_detail_content", 'span[contenteditable=true]');
                if (obj_ref.hasClass('active') && $('#id_detail_tooltip .detailJs.active').length == 0 && hasFormStateChanged) {
                    searchModule.showPopup(obj_ref, "Are you sure you want to continue? Any unsaved data will be lost.");
                    return false;
                }
                obj_ref.trigger('click');
            }
        });

        setTimeout(function() {
            if ($("#mapping_ins_content_id").data('document-id') == $("#mapping_ins_content_id").val() && $("#mapping_ins_content_id").data('mode-type') == "save") {
                $(".edt .edtDynamicTextField").each(function(index, element) {
                    $(this).attr('readonly', true);
                    $(this).addClass('edt-elm-readmode');
                });
            }
        }, 1000);
        paneMidHt();
        manageScrollBar();
        UtilityModule.setFormState(
            "#id_detail_content",
            'span[contenteditable="true"],.canvasChkBox,.canvasRadioBtn',
            'Are you sure you want to continue? Any unsaved data will be lost.'
        );
    }

    function responseDocument_bkp(d, s) {
        /*
         * add csss file
         * -------------------------------------
         * added by:- Gaurav Dutt Panchal
         * date:- 21 July 2016
         */

        $.each(d.css_file, function(key, value) {
            /*
             * value is file intanceid
             * add append in head section
             */
            addCssFileAppend('#css_node_id_' + key, value);
        });
        setTimeout(function() {
            var detailWrapper = $("#id_detail_content");
            $(detailWrapper).addClass('edt-main-wrapper');
            $("#id_detail_head").html(d.head);
            $("#id_detail_tooltip").html(d.tooltip);
            detailWrapper.html(d.content_detail);
            $("#id_detail_actions").html(d.actions);
            /*
             * check if file is not exits
             * then add new file
             */
            var scriptArr = {
                'edt-script-editor': 'edt-script.js'
            };
            addScriptFileAppend(scriptArr);
        }, 100);
    }

    function mangeNiceScroller() {
        $(".niceScrollDiv").niceScroll({
            cursorcolor: "#000",
            cursorborder: "0",
            cursorborderradius: '0',
            cursorwidth: "4px",
            background: 'rgba(0,0,0,0.15)'
        });
    }

    function EditorPaneHT() {
        // two pane mid section height
        var winHT = $(window).height() - $('.header-stick-top').outerHeight();
        var listingTopBar = $('.tp-actn-bar').outerHeight(true);
        var TotalHT = winHT - listingTopBar - BreadcrumbModule.getBreadcrumbHeight();
        var edtPaneWH = $('#content_wraper .flex-container').outerWidth() / 2;
        $('.DocInsideHig').height(TotalHT);
        $('.edt-main-wrapper .edtContainer').width(edtPaneWH - 1);
    }

    /*
     * add css file in head section
     * By:- Gaurav Dutt panchal
     */
    function addCssFileAppend(cssFileId, cssFileName) {
        var documentHead = $('head');
        documentHead.find(cssFileId).remove();
        documentHead.append(cssFileName);
    }

    /*
     * add css file in body section
     * By:- Gaurav Dutt panchal
     */
    function addScriptFileAppend(scriptArr) {
        var oHead = document.getElementsByTagName('head')[0];
        var myScripts = "";
        var scriptEditorEle = document.createElement("script");
        for (var fileId in scriptArr) {
            var fileElement = $('head #' + fileId);
            if (!$(fileElement).length) {
                scriptEditorEle.src = base_plugin_url + "js/" + scriptArr[fileId];
                setMultipleAttr(scriptEditorEle, "setAttribute", {
                    'type': 'text/javascript',
                    'id': fileId,
                    'class': fileId
                })
                oHead.appendChild(scriptEditorEle);
            }
        }
        scriptEditorEle.onload = function() {
            EditorPaneHT();
            mangeNiceScroller();
            toggleEditorView();
        }
        hideFullLoader('content_loader');
    }

    // Function here for add and update editor document
    function callEditContentdocumentAction(curObj, deal_mapping_node_id, operation_id, deal_mapp_instance_property_id, docType) {
        var msg = "This operation has been checked as Complete. To add, uncheck the operation.";
        if (deal_mapp_instance_property_id == "" || deal_mapp_instance_property_id == undefined) {
            deal_mapp_instance_property_id = "";
        } else {
            msg = "This operation has been checked as Complete. To edit, uncheck the operation.";
            deal_mapp_instance_property_id = deal_mapp_instance_property_id;
        }
        if ($(curObj).hasClass('inactive-btn')) {
            var popupWrapper = $('#edit-opinfo-popup');
            popupWrapper.find('p').text(msg);
            popupWrapper.modal('show');
            return false;
        }
        showFullLoader('content_loader');
        var statements = [];
        var dtm = getCurrentDateTime();
        toggleEditorView("untoggle");

        if (docType == 1) {
            var targetElement = $('#id_detail_content #edtInnerCanvasView');
            targetElement.find('span[contenteditable="true"]').each(function() {
                var text = $(this).text().replace(/&nbsp;/g,'');
                $(this).text($.trim(text));
            })
            statements = targetElement.html();
            var documentType = "Canvas";
        } else {
            $('#id_detail_content  #edt div.edtParagraph').each(function() {
                statements.push({
                    statement: $(this)[0].outerHTML,
                });
            });
            var documentType = "Document";
        }
        dialogue = {
            dialogue_template: documentType,
            dialogue_title: $("#id_listing_operation .flex-grid.active").find('.operation-title').text(),
            dialogue_admin: login_user_id,
            dialogue_timestamp: dtm,
            "statementData": statements
        };
        // $.post(base_plugin_url + 'code.php', , responseEditDocument, 'json');
        var data = {
            'action': 'editDocument',
            'document': dialogue,
            'saveType': 1,
            'deal_mapping_node_id': deal_mapping_node_id,
            'operation_id': operation_id,
            'edit_document_node_id': deal_mapp_instance_property_id,
            'docType': docType,
            'operation_detail_node_class_id': operation_detail_node_class_id
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseEditDocument);
        });
    }
    // Function here for add and update editor document
    function callEditContentdocumentActionReview(curObj, deal_node_id, deal_mapp_instance_property_id, docType) {
        var msg = "This operation has been checked as Complete. To add, uncheck the operation.";
        //        if (deal_mapp_instance_property_id == "" || deal_mapp_instance_property_id == undefined) {
        //            deal_mapp_instance_property_id = "";
        //        } else {
        //            msg = "This operation has been checked as Complete. To edit, uncheck the operation.";
        //            deal_mapp_instance_property_id = deal_mapp_instance_property_id;
        //        }
        //        if ($(curObj).hasClass('inactive-btn')) {
        //
        //            var popupWrapper = $('#edit-opinfo-popup');
        //            popupWrapper.find('p').text(msg);
        //            popupWrapper.modal('show');
        //            return false;
        //        }
        showFullLoader('content_loader');
        var statements = [];
        var dtm = getCurrentDateTime();

        toggleEditorView("untoggle");

        statements = $('#id_detail_content #edtInnerCanvasView').html();
        var documentType = "Canvas";
        dialogue = {
            dialogue_template: 'Canvas',
            dialogue_title: $("#id_listing_operation .flex-grid.active").find('.operation-title').text(),
            dialogue_admin: login_user_id,
            dialogue_timestamp: dtm,
            "statementData": statements
        };

        // $.post(base_plugin_url + 'code.php', , responseEditDocumentReview, 'json');
        var data = {
            'action': 'editReviewDocument',
            'document': dialogue,
            'saveType': 1,
            'edit_document_node_id': deal_mapp_instance_property_id,
            'deal_node_id': deal_node_id,
            'docType': docType
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseEditDocumentReview);
        });
    }

    function responseEditDocumentReview(d, s) {
        var documentNodeId = d.data;
        var dealNodeInsId = $(".listing-table-body .active-tr").attr('data-node-id');
        var roleNodeId = $("#id_listing_operation").find('.flex-grid.active').data('rolenodeid');
        var operationId = $("#id_listing_operation").find('.flex-grid.active').data('operation-id');
        // $.post(base_plugin_url + 'code.php', , responseDocument, 'json');
        var data = {
            'action': 'viewReviewDocument',
            'document_node_id': documentNodeId,
            'deal_instance_id': dealNodeInsId,
            'deal_user_role_id': roleNodeId,
            'login_user_id': login_user_id,
            'list_mapping_id_array': list_mapping_id_array,
            'operation_node_id': operationId,
            'flag': 'save'
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseDocument);
        });
    }

    function responseEditDocument(d, s) {
        var documentNodeId = d.data;
        var dealNodeInsId = $("#id_listing_operation .flex-grid.active").data('dealnodeinsid');
        var roleNodeId = $("#id_listing_operation .flex-grid.active").data('rolenodeid');
        var operationId = $("#id_listing_operation .flex-grid.active").data('operation-id');
        // $.post(base_plugin_url + 'code.php', , responseDocument, 'json');
        var data = {
            'action': 'viewDocument',
            'document_node_id': documentNodeId,
            'deal_instance_id': dealNodeInsId,
            'deal_node_id': deal_instance_id,
            'deal_user_role_id': roleNodeId,
            'login_user_id': login_user_id,
            'list_mapping_id_array': list_mapping_id_array,
            'operation_node_id': operationId,
            'flag': 'save',
            'operation_detail_node_class_id': operation_detail_node_class_id,
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseDocument);
        });
    }

    function getCurrentDateTime() {
        var d = new Date();
        var date = d.getFullYear() + '-' +
            ("00" + (d.getMonth() + 1)).slice(-2) + '-' +
            ("00" + d.getDate()).slice(-2) + ' ' +
            ("00" + d.getHours()).slice(-2) + ':' +
            ("00" + d.getMinutes()).slice(-2) + ':' +
            ("00" + d.getSeconds()).slice(-2);
        return date;
    }

    function viewDocumentData(curObj, document_node_id) {
        if ($(curObj).hasClass('inactive-btn')) {
            var msg = "This operation has been checked as Complete. To edit, uncheck the operation.";
            var popupWrapper = $('#edit-opinfo-popup');
            popupWrapper.find('p').text(msg);
            popupWrapper.modal('show');
            return false;
        }
        showFullLoader('content_loader');
        var flexGridActive = $("#id_listing_operation").find('.flex-grid.active');
        var postData = {
            'action': 'viewDocument',
            'document_node_id': document_node_id,
            'deal_instance_id': flexGridActive.data('dealnodeinsid'),
            'deal_node_id': deal_instance_id,
            'deal_user_role_id': flexGridActive.data('rolenodeid'),
            'login_user_id': login_user_id,
            'operation_detail_node_class_id': operation_detail_node_class_id,
            'list_mapping_id_array': list_mapping_id_array,
            'operation_node_id': flexGridActive.data('operation-id'),
            'flag': 'edit'
        };
        // $.post(base_plugin_url + 'code.php', postData, responseDocument, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, postData).then(responseDocument);
        });
    }

    function viewDocumentDataReview(curObj, document_node_id) {

        showFullLoader('content_loader');
        var documentNodeId = document_node_id;
        var dealNodeInsId = $(".listing-table-body .active-tr").attr('data-node-id');
        var roleNodeId = $("#id_listing_operation .flex-grid.active").data('rolenodeid');
        var operationId = $("#id_listing_operation .flex-grid.active").data('operation-id');
        // $.post(base_plugin_url + 'code.php', , responseDocument, 'json');
        var data = {
            'action': 'viewReviewDocument',
            'document_node_id': documentNodeId,
            'deal_instance_id': dealNodeInsId,
            'deal_user_role_id': roleNodeId,
            'login_user_id': login_user_id,
            'list_mapping_id_array': list_mapping_id_array,
            'operation_node_id': operationId,
            'flag': 'edit'
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseDocument);
        });
    }
    // End code by awdhesh soni

    /*Created By Divya Rajput*/
    function showInstanceByDisplayType(display_type) {
        if ($.trim(display_type) == 'add') {
            $('span.list-view-detail').addClass('hide');
            $('input.inline-input, textarea.inline-input').removeClass('hide');
        } else if ($.trim(display_type) == 'edit') {
            $('span.list-view-detail').addClass('hide');
            $('input.inline-input, textarea.inline-input').removeClass('hide');
        } else if ($.trim(display_type) == 'view') {
            $('span.list-view-detail').removeClass('hide');
            $('input.inline-input, textarea.inline-input').addClass('hide');
        }
    }

    function saveWorkSpaceAction(curObj, mapping_role_actor_node_id) {

        // check form is empty or not.
        var msg = 'You haven\'t provided any data to save.'; // provided by Animesh sir
        if(FormValidationModule.isFormEmpty('#id_detail_content form', ':input:not(:button,:hidden)', msg)) {
            return true;
        }

        var onclickAttr = $(curObj).attr('onclick');
        $(curObj).removeAttr('onclick');
        if ($(curObj).hasClass('inactive-btn')) {
            var popupWrapper = $('#notification-row');
            popupWrapper.find('p').text("This operation has been checked as Complete. To add, uncheck the operation.");
            popupWrapper.slideDown('slow');
            setTimeout(function() {
                callback();
            }, 5000);
            var callback = function() {
                popupWrapper.slideUp('slow');
                $(curObj).attr('onclick', onclickAttr);
            }
            var params = {
                callback: callback
            };
            closeNotification(popupWrapper, params);
            return false;
        } else if ($(curObj).hasClass('inactive-btn1')) {
            var phseRoleId = OperationModule.options.cache.phase.RoleId;
            if (phseRoleId != login_role_id) {
                var msg = '';
                if(login_role_id == lookup_role_id_of_superadmin)
                {
                    msg = 'You have read-only rights.';
                }
                else
                {
                    msg = 'You don\'t have control on this deal. You cannot perform any operations until you have control on this deal.';
                }
                var popupWrapper = $('#notification-row');
                popupWrapper.find('p').html(msg);
                popupWrapper.slideDown('fast');
                var notificationTimeout = setTimeout(function() {
                    callback();
                }, 8000);

                var callback = function() {
                    clearTimeout(notificationTimeout);
                    popupWrapper.slideUp('fast');
                    $(curObj).attr('onclick', onclickAttr);
                }
                var params = {
                    callback: callback
                };
                closeNotification(popupWrapper, params);
                return false;
            }
        }
        $(curObj).attr('onclick', onclickAttr);
        $("#id_detail_content #id_detail_save_type").val('P');
        var funName = $("#id_detail_content #id_detail_submit").val();
        var form_id = eval(funName);

        var formData = new FormData(document.getElementById(form_id));
        if (formData) {
            operation_node_id = $("#id_listing_operation div.active").attr('data-operation-id');
            view_node_id = $("#id_listing_operation div.active").attr('data-vnid-id');
            var data_document_id = '';
            if ($("#id_listing_operation").find("div.active").attr('data-document'))
                data_document_id = $("#id_listing_operation").find("div.active").attr('data-document');
            var flag = 'false';
            if ($("#id_listing_operation div.active").hasClass('last_operation'))
                flag = 'true';
            var formDataObject = {
                'action': 'saveWorkSpace',
                'mapping_role_actor_node_id': mapping_role_actor_node_id,
                'deal_node_id': deal_node_id,
                'deal_instance_id': deal_instance_id,
                'operation_node_id': operation_node_id,
                'view_node_id': view_node_id,
                'login_user_id': login_user_id,
                'login_role_id': login_role_id,
                'flag': flag,
                'data_document_id': data_document_id
            }
            setMultipleAttr(formData, "append", formDataObject);

            var options = {
                type: "POST",
                async: true,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                data: formData,
                success: saveWorkSpaceActionSuccess,
                complete: function() {
                    hideFullLoader('content_loader');
                    $.do_not_hide_loader = false;
                    $.keep_showing_full_page_loader = false;
                    hideFullLoader('full_page_loader');
                }
            };

            require(['page_module'], function(PageModule) {
                var callback_params = {
                    data: '',
                    callback: function() {
                        PageModule.ajax(options);
                    }
                };
                showFullLoader('content_loader', callback_params);
            });
        }
    }

    function saveWorkSpaceActionSuccess(response) {
        var d = response.data;
        if(typeof d == 'undefined') {
            d = response;
        }
        if (typeof d.status != undefined && d.status == 0 && typeof d.message != undefined) {
            bootbox.alert(d.message);
            hideFullLoader('content_loader');
            return false;
        } else {
        // d = d.data;
        var detailWrapper = $("#id_detail_content");
        var titleLoc = $("#id_detail_head");
        $("#id_detail_tooltip").html(d.tooltip);
        detailWrapper.html(d.content_detail);
        $("#id_detail_actions").html(d.actions);
        var activeDiv = $('#id_listing_operation').find('div.active');
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        setOperationDetailHeading(activeDiv, titleLoc);
        if (typeof d.checkbox_data != "undefined") {
            var checkbox = activeDiv.find('input[type="checkbox"]');
            checkbox.removeAttr('disabled');
            checkbox.data('classpid', d.checkbox_data.classpid);
            checkbox.data('instanceid', d.checkbox_data.instanceid);
            checkbox.data('status', d.checkbox_data.status);
        }
        if (d.hasOwnProperty('content_values')) {
            var display_type = d.display_type;
            editFormSetValues(d.content_values, display_type);
        } else {
            $("#id_detail_content").find(":file").filestyle();
        }
        htmlModule.properties.cache.displayType = d.display_type;
        applyJs();
        searchModule.addHighlight(detailWrapper.find('.col-sm-8'));
        bindClick();
        // collapse sections that are empty only for operation page
        var section = BreadcrumbModule.getSectionFullPath();
        if(section == 'deal->operation') {
            htmlModule.collapseSectionIfEmpty('#content_scroler_div', '.list-title-heading', d.display_type);
        }

        viewEditTextBox('view', '.hasHiddenTextBox');
        checkUploadedDocView('.remote_download_link');
        $('.datepicker').each(function(i,val) {
            if($(this).prev().length && $(this).prev().hasClass('light-green') ){
                $(this).addClass('light-green auto-field');
                $(this).closest('.col-sm-8').find('.list-view-detail').addClass('light-green auto-field');
            }
        });
        }
    }

    function editWorkSpaceAction(curObj, mapping_role_actor_node_id, view_instance_id) {
        var onclickAttr = $(curObj).attr('onclick');
        $(curObj).removeAttr('onclick');
        if ($(curObj).hasClass('inactive-btn')) {
            var popupWrapper = $('#notification-row');
            popupWrapper.find('p').text('This operation has been checked as Complete. To edit, uncheck the operation.');
            popupWrapper.slideDown('slow');
            setTimeout(function() {
                callback();
            }, 5000);
            var callback = function() {
                popupWrapper.slideUp('slow');
                $(curObj).attr('onclick', onclickAttr);
            }
            var params = {
                callback: callback
            };
            closeNotification(popupWrapper, params);
            return false;
        } else if ($(curObj).hasClass('inactive-btn1')) {
            var phseRoleId = OperationModule.options.cache.phase.RoleId;
            if (phseRoleId != login_role_id) {
                var msg = '';
                if(login_role_id == lookup_role_id_of_superadmin)
                {
                    msg = 'You have read-only rights.';
                }
                else
                {
                    msg = 'You don\'t have control on this deal. You cannot perform any operations until you have control on this deal.';
                }
                var popupWrapper = $('#notification-row');
                popupWrapper.find('p').html(msg);
                popupWrapper.slideDown('fast');
                var notificationTimeout = setTimeout(function() {
                    callback();
                }, 8000);
                var callback = function() {
                    clearTimeout(notificationTimeout);
                    popupWrapper.slideUp('fast');
                    $(curObj).attr('onclick', onclickAttr);
                }
                var params = {
                    callback: callback
                };
                closeNotification(popupWrapper, params);
                return false;
            }
        }
        $(curObj).attr('onclick', onclickAttr);
        showFullLoader('content_loader');
        operation_node_id = $("#id_listing_operation div.active").attr('data-operation-id');
        // $.post(base_plugin_url + 'code.php', , responseEditWorkSpace, 'json');
        var data = {
            'action': 'editWorkSpace',
            'deal_node_id': deal_node_id,
            'deal_instance_id': deal_instance_id,
            'mapping_role_actor_node_id': mapping_role_actor_node_id,
            'operation_node_id': operation_node_id,
            'view_instance_id': view_instance_id,
            'login_role_id': login_role_id,
            'login_user_id': login_user_id
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseEditWorkSpace);
        });
    }

    function responseEditWorkSpace(d, s) {
        if (typeof d.status != undefined && d.status == 0 && typeof d.message != undefined) {
            bootbox.alert(d.message);
            hideFullLoader('content_loader');
            return false;
        } else {
            d = d.data;
        var detailWrapper = $("#id_detail_content");
        var titleLoc = $("#id_detail_head");
        $("#id_detail_tooltip").html(d.tooltip);
        detailWrapper.html(d.content_detail);
        UtilityModule.resetCache();
        $("#id_detail_actions").html(d.actions);
        var activeDiv = $('#id_listing_operation').find('div.active')
        if (activeDiv.data('document') != "") {
            $('.documentJs').removeClass('hide');
        }
        setOperationDetailHeading(activeDiv, titleLoc);
        if (d.hasOwnProperty('content_values')) {
            var display_type = d.display_type;
            editFormSetValues(d.content_values, display_type);
        } else {
            $("#id_detail_content").find(":file").filestyle();
        }
        htmlModule.properties.cache.displayType = d.display_type;

        applyJs();
        searchModule.addHighlight(detailWrapper.find('.col-sm-8'));
        // set form state to check validation
        UtilityModule.setFormState("#id_detail_content", 'input:visible:not([readonly])', 'Are you sure you want to continue?  Any unsaved data will be lost.');
        // collapse sections that are empty only for operation page
        var section = BreadcrumbModule.getSectionFullPath();
        if(section == 'deal->operation') {
            htmlModule.collapseSectionIfEmpty('#content_scroler_div', '.list-title-heading', d.display_type);
        }
        hideFullLoader('content_loader');
        fileValidation();
        bindClick();
        viewEditTextBox('edit', '.hasHiddenTextBox');
        checkUploadedDocEdit('.bootstrap-filestyle input');
        $("#id_detail_content").find('input[type="file"]').parent().find('.bootstrap-filestyle').find('input[type="text"]').attr('readonly', true);
        $('[addnewtextbox]').addNewTextbox();
        $('.hasDatepicker').each(function(i,val) {
            if($(this).prev().length && $(this).prev().hasClass('light-green') ){
                $(this).addClass('light-green auto-field');
                $(this).closest('.col-sm-8').find('.list-view-detail').addClass('light-green auto-field');
            }
        });
        }
    }

    function completeAllOperation() {
        var activeRow = $("#content_wraper #id_listing_body .customScroll div.active-tr");
        deal_instance_id = activeRow.attr('data-id');
        deal_node_id = activeRow.attr('data-node-id');

        dataSettings = activeRow.data('settings');

        deal_user_role_id = login_role_id;
        var data = {
            'action': 'completeOperationStatus',
            'mode': 'update',
            'nipid': JSON.stringify(OperationModule.getOperationPhase()),
            'value': 'Completed',
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': login_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'emailLinks': all_settings['deal']['settings']['emailLinks']
        };
        showFullLoader('full_page_loader');
        // $.post(base_plugin_url + 'code.php', data, completeAllOpt);
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: ''}, data).then(completeAllOpt);
        });
    }

    /**
     * trigger all filter.
     * @returns {undefined}
     *
     */
    function completeAllOpt() {
        console.log(dataSettings);
        $("ul.item-list li:contains(All)").find('a').trigger('click');
        updateMenuCount();
    }

    function completeOperation(target) {
        var obj = target;
        var is_last_operation = $(obj).parents('div.last_operation').length;
        if (is_last_operation) {
            obj.closest('[id^=opration_id_]').trigger('click');
            return false;
        }
        obj.closest('[id^=opration_id_]').addClass('checked-div');
        var dataNipid = obj.data('nipid');
        if (typeof dataNipid == "undefined" || dataNipid == "") {
            var instance_id = obj.data('instanceid');
            var class_p_id = obj.data('classpid');
            if (typeof instance_id == "undefined" || instance_id == "") {
                var activeTr = obj.closest('[id^=opration_id_]');
                var dealnodeinsid = activeTr.data('dealnodeinsid');
                var operation_id = activeTr.data('operation-id');
                var data = {
                    'action': 'operationStatus',
                    'mode': 'instance',
                    'class_p_id': class_p_id,
                    'dealnodeinsid': dealnodeinsid,
                    'operation_id': operation_id,
                    'login_user_id': login_user_id,
                    'login_role_id': login_role_id,
                    'class_p_id': class_p_id,
                    'value': 'Instance'
                };
            } else {
                var data = {
                    'action': 'operationStatus',
                    'mode': 'insert',
                    'instance_id': instance_id,
                    'class_p_id': class_p_id,
                    'value': 'Completed'
                };
            }

        } else {
            var nipid = obj.data('nipid');
            var data = {
                'action': 'operationStatus',
                'mode': 'update',
                'nipid': nipid,
                'value': 'Completed'
            };
        }
        obj.closest('[id^=opration_id_]').trigger('click');
        // $.post(base_plugin_url + 'code.php', data, completeOp, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(completeOp);
        });
    }

    function incompleteOperation(target) {
        var obj = target;
        obj.closest('[id^=opration_id_]').removeClass('checked-div');
        var dataNipid = obj.data('nipid');
        if (typeof dataNipid != "undefined" && dataNipid != "") {
            var nipid = obj.data('nipid');
            var data = {
                'action': 'operationStatus',
                'mode': 'update',
                'nipid': nipid,
                'value': 'Incompleted'
            };
        } else {
            return false;
        }

        if (searchModule.getActiveMenu() !== "complete" || searchModule.getActiveMenu() !== "incomplete")
            obj.closest('[id^=opration_id_]').trigger('click');
        // $.post(base_plugin_url + 'code.php', data, incompleteOp, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(incompleteOp);
        });
    }

    function incompleteOp() {
        if (searchModule.getActiveMenu() == "complete") {
            var searchString = searchModule.properties.cache.searchString;
            if (searchString) {
                searchModule.searchString(searchString);
            } else {
                htmlModule.manageActiveList($('#id_listing_operation'));
            }
        } else {
            var activeDiv = $('#id_listing_operation').find('div.active');
            if (!activeDiv.find('input[type="checkbox"]').is(':checked')) {
                var actionBtn = '.editJs';
                var btn = $('#id_detail_actions').find(actionBtn);
                if (btn.length) {
                    btn.removeClass('inactive-btn');
                }
            }
        }
        updateMenuCount();
    }

    function completeOp(res) {
        if (searchModule.getActiveMenu() == "incomplete") {

            var searchString = searchModule.properties.cache.searchString;
            if (searchString) {
                searchModule.searchString(searchString);
            } else {
                htmlModule.manageActiveList($('#id_listing_operation'));
            }
        } else {
            var activeDiv = $('#id_listing_operation').find('div.active');
            if (activeDiv.find('input[type="checkbox"]').is(':checked')) {
                var nipid = activeDiv.find('input[type="checkbox"]').data('nipid');
                if (typeof nipid == "undefined" || nipid == "") {
                    activeDiv.find('input[type="checkbox"]').data('nipid', res['nipid']);
                }
                var actionBtn = '.editJs';
                if (res['status'] == 'add') {
                    actionBtn = '.saveJs';
                    activeDiv.find('input[type="checkbox"]').data('instanceid', res['instanceid']);
                    activeDiv.find('input[type="checkbox"]').data('status', res['status']);
                    var wrapper = $('<div />').css({
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: '0px',
                        zIndex: 1,
                    }).addClass('disabled-wrapper');

                    setTimeout(function() {
                        $('#id_detail_content').find('form').closest('.mCSB_container').append(wrapper);
                    }, 500);
                    $("#id_detail_content form:visible").find('.group-span-filestyle').find('label').addClass('disabled-btn disabled');
                }
                var btn = $('#id_detail_actions').find(actionBtn);
                if (btn.length) {
                    btn.addClass('inactive-btn');
                }
            }
        }
        updateMenuCount();
    }

    function setOperationDetailHeading(activeTr, setLocation) {
        var operationTitle = activeTr.find('.operation-title').text();
        var dealId = activeTr.data('dealid');
        setLocation.html('Deal ' + dealId + ' (' + operationTitle + '): Detail');
    }

    function manageNotification() {
        if ($('#id_listing_operation').find('div.active').find('input[type="checkbox"]').is(':checked')) {
            if (($('.listing-content-wrap').find("input:visible").length) || ($('.listing-content-wrap').find("textarea:visible").length) || ($('.listing-content-wrap').find("select:visible").length)) {

                var popupWrapper = $('#notification-row');
                popupWrapper.find('p').text("This operation has been checked as Complete. To add, uncheck the operation.");
                popupWrapper.slideDown('slow');
                $("body").off('click.id_detail_content', '#id_detail_content', manageNotification);
                var timeoutInterval = setTimeout(function() {
                    callback();
                }, 5000);
                var callback = function() {
                    clearTimeout(timeoutInterval);
                    popupWrapper.slideUp('slow', function() {
                        $("body").on('click.id_detail_content', '#id_detail_content', manageNotification);
                    });
                }
                var params = {
                    callback: callback
                };
                closeNotification(popupWrapper, params);
                return false;
            }
        }
    }

    function manageDetailNotification() {
        var operationObj = $('.workspace-operation-list.active');

        var msg = 'You don\'t have control on this deal. You cannot perform any operations until you have control on this deal.';
        if(operationObj.data('is-other-role-operation')== true){
            msg = 'You cannot edit this operation because it\'s not your operation.';
        }

        /*
        * Modified By: Divya Rajput
        * On Date: 8th March 2017
        * Purpose: Showing Message, when an operation has Read only Owner
        * Sprint 6-Task 141: Update operation class to add read-only owner for an operation.
        */
        if(login_role_id == lookup_role_id_of_superadmin || operationObj.data('read-permission') == 'readonlyowner')
        {
            msg = 'You have read-only rights.';
        }


        var popupWrapper = $('#notification-row');
        popupWrapper.find('p').html(msg);
        popupWrapper.slideDown('fast');
        $("body").off('click.disabled-wrapper', '.disabled-wrapper', manageDetailNotification);;
        var notificationTimeout = setTimeout(function() { // message is big so wait for 8 seconds and then hide the message
            callback();
        }, 8000);
        var callback = function() {
            clearTimeout(notificationTimeout);
            popupWrapper.slideUp('fast', function() {
                $("body").on('click.disabled-wrapper', '.disabled-wrapper', manageDetailNotification);
            });
        }
        var params = {
            callback: callback
        };
        closeNotification(popupWrapper, params);
        return false;
    }

    var appOneInterval;

    function checkForFile() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.appOneFilePath != undefined) {
                clearInterval(appOneInterval);
                var getName = localStorage.appOneFilePath;
                if (getName === 'failed') {
                    var msg = 'We cannot process your application further because it\'s not approved yet.';
                    var popupWrapper = $('#edit-opinfo-popup');
                    popupWrapper.find('p').text(msg);
                    popupWrapper.modal('show');
                    localStorage.removeItem("appOneFilePath");
                } else {
                    $("#id_detail_tooltip .detailJs").trigger("click");
                }
            }
        }
    }


    function loadAppOneLogin() {
        showFullLoader('content_loader');
        //DocSinglePaneResize();
        localStorage.removeItem("appOneFilePath");
        appOneInterval = setInterval(checkForFile, 3000);

        setTimeout(function() {
            // LOAD IFRAME
            $.ajax({
                url: base_plugin_url + 'code.php',
                method: "POST",
                data: {
                    action: 'appOneLoginIframe',
                    deal_instance_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id'),
                    deal_node_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id'),
                    deal_user_role_id: deal_user_role_id,
                    login_user_id: login_user_id,
                    operation_node_id: $("#id_listing_operation div.active").attr('data-operation-id')
                },
                success: function(result) {
                    var res = result.data;
                    if (res.hasOwnProperty('error')) {
                        var msg = res.error; //'<b>Error: </b> '
                        var popupWrapper = $('#edit-opinfo-popup').addClass('appone_error_popup');
                        popupWrapper.find('h4.modal-title').html('Errors');
                        popupWrapper.find('p').html(msg);
                        if (res.hasOwnProperty('link')) {
                            popupWrapper.find('.appone_download').remove();
                            popupWrapper.find('p').after(res.link);
                        }
                        popupWrapper.modal('show');
                        hideFullLoader('content_loader');
                    } else {
                        if (res.hasOwnProperty('app_exists')) {
                            // AppOne Application id already exists, show popup to start fresh/continue existing
                            bootbox.confirm({
                                title: 'Confirm',
                                message: "You already have an application in AppOne.<br/>Press 'Yes' to continue with existing application and 'No' to create a new application.",
                                callback: function(result) {
                                    var selected_application = '';
                                    if (result) {
                                        selected_application = 'existing';
                                    } else {
                                        selected_application = 'new';
                                    }
                                    $.ajax({
                                        url: base_plugin_url + 'code.php',
                                        method: "POST",
                                        data: {
                                            action: 'appOneLoginIframe',
                                            selected_application: selected_application,
                                            deal_instance_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id'),
                                            deal_node_id: $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id'),
                                            deal_user_role_id: deal_user_role_id,
                                            login_user_id: login_user_id,
                                            operation_node_id: $("#id_listing_operation div.active").attr('data-operation-id')
                                        },
                                        success: function(result) {
                                            var res = result.data;
                                            if (res.hasOwnProperty('error')) {
                                                var msg = res.error; //'<b>Error: </b> '
                                                var popupWrapper = $('#edit-opinfo-popup').addClass('appone_error_popup');
                                                popupWrapper.find('h4.modal-title').html('Errors');
                                                popupWrapper.find('p').html(msg);
                                                if (res.hasOwnProperty('link')) {
                                                    popupWrapper.find('.appone_download').remove();
                                                    popupWrapper.find('p').after(res.link);
                                                }
                                                popupWrapper.modal('show');
                                                hideFullLoader('content_loader');
                                            } else {
                                                loadAppOneIframeWithUrl(res);
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            loadAppOneIframeWithUrl(res);
                        }
                    }
                },
                complete: function() {
                    //hideFullLoader('content_loader');
                }
            });
        }, 500);
    }

    function loadAppOneIframeWithUrl(res) {
        // AppOne tooltip icon activate
        $('#id_detail_tooltip .detailJs').removeClass('active');
        $('#id_detail_tooltip .appone-icon').removeClass('inactive').addClass('active');

        var getframeHT = $('.mid-section-HT').outerHeight();
        var html = '<div id="content_scroler_div" class="mid-section-HT">';
        html += '<iframe id="iframe-content" name="iframe-content" frameborder="0" width="100%" height="' + getframeHT + '" scrolling="yes" class="iframe-wrap temptest" src="' + res.redirecturl + '"></iframe>';
        html += '</div>';
        $('#content_scroler_div').replaceWith(html);
        $('#iframe-content').load(function() {
            hideFullLoader('content_loader');
            DocSinglePaneResize();
        });
        // hide detail action save & pdf
        $('#id_detail_actions a:gt(0)').addClass('hide');
        // bind details tab
        $('#id_detail_tooltip').find('.detail').closest('a').off('click').on('click', function() {
            $('.workflow-wrap .active').trigger('click');
        });
    }

    //$("body").off('click.id_detail_content').on('click.id_detail_content', '.disabled-form-wrapper', manageNotification);
    $("body").off('click.disabled-wrapper', '.disabled-wrapper', manageDetailNotification).on('click.disabled-wrapper', '.disabled-wrapper', manageDetailNotification);

    function viewDealInfo(obj, instanceId, displayType) {
        form_container = '_flyout';
        is_flyout_open = 'Y';
        renderViewDetails(obj, instanceId, displayType);
    }

    function viewOperationInfo() {
        form_container = '_flyout';
        getOptionalOperationList();
    }

    function getOptionalOperationList() {
        if (form_container == '_flyout' || form_container == '_dashboard') {
            loaderId = 'j_my_left_flyout_wrapper #j_my_left_flyout_loader';
        }
        showFullLoader(loaderId);
        var data = {
            'action': 'optionalOperationList',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'login_user_id': login_user_id,
            'list_mapping_id_array': list_mapping_id_array
        };
        var callback;
        if (form_container == '_flyout') {
            // $.post(base_plugin_url + 'code.php', data, responseGetOperationListForFlyout, 'json');
            callback = responseGetOperationListForFlyout;
        } else {
            // $.post(base_plugin_url + 'code.php', data, responseGetOperationList, 'json');
            callback = responseGetOperationList;
        }
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(callback);
        });
    }

    function responseGetOperationListForFlyout(response, s) {
        var d = response.data;
        var detailWrapper = $("#j_my_left_flyout");
        detailWrapper.find('.detail_head').html(d.heading);
        detailWrapper.find('.detail_tooltip').html('');
        detailWrapper.find('.detail_content').html(d.list);
        var actionMenuContainer = detailWrapper.find('.detail_actions');
        actionMenuContainer.find('a').not('.j_my_left_flyout_close').remove();
        detailWrapper.find('.detail_actions').prepend(d.actions);
        detailWrapper.find('.detail_actions').find('.j_my_createDeal_close').remove();
        applyJs();
        htmlModule.properties.temporaryOperationChecked = [];
        $("#j_my_left_flyout_wrapper .jq_flyout_wrap .flex-grid").each(function() {
            if ($(this).find("input[name='optional_ope_ids']").is(":checked") == false) {
                $(this).addClass("defaultNotSelected");
            }
        });
        hideFullLoader('j_my_left_flyout #j_my_left_flyout_loader');
    }

    function responseGetOperationList(d, s) {
        d = d.data;
        if (form_container == '_flyout') {
            form_container = '_dashboard'
        }

        var detailWrapper = $("#id_detail_content" + form_container);
        $("#id_detail_head" + form_container).html(d.heading);
        $("#id_detail_tooltip" + form_container).html('');
        detailWrapper.html(d.list);
        $("#id_detail_actions" + form_container).html(d.actions);

        if (form_container == '_flyout' || form_container == '_dashboard') {
            loaderId = 'j_my_left_flyout_loader';
        }
        applyJs();
        hideFullLoader(loaderId);
    }

    function setOptionalOperationWithRequired() {
         var loaderId = 'j_my_left_flyout_wrapper #j_my_left_flyout_loader';
        showFullLoader(loaderId);
        var favorite = [];
        $.each($("input[name='optional_ope_ids']:checked"), function() {
            temp = {
                'operationId': $(this).data('operationId'),
                'mappingRoleActor': $(this).data('mappingRoleActor')
            };
            favorite.push(temp);
        });

        $(".defaultNotSelected").each(function() {
            if ($(this).find("input[name='optional_ope_ids']").is(":checked")) {
                htmlModule.properties.temporaryOperationChecked.push($(this).attr("id"));
            }
        });

        var data = {
            'action': 'setOptOperation',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'login_user_id': login_user_id,
            'list_mapping_id_array': list_mapping_id_array,
            'list': favorite
        };
        // $.post(base_plugin_url + 'code.php', data, responseSetOptionalOperationWithRequired, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSetOptionalOperationWithRequired);
        });
    }

    function responseSetOptionalOperationWithRequired(d, s) {
        if (d.status == 1) {
            /*
             * Modified By: Divya Rajput
             * Date: 6th March 2017
             * updateMenuCount(): both function commented
             * As there is no use of it on adding or removing optional operation
             * Because when we add optional operation list, operation list ajax calls which also calls menu count functionality
             */
            //updateMenuCount();
            if (form_container == '_flyout' || form_container == '_dashboard') {
                loaderId = 'j_my_left_flyout_wrapper #j_my_left_flyout_loader';
            }
            if (form_container == '_flyout') {
                $('.j_my_left_flyout_close').trigger('click');
            } else {
                $('.j_my_createDeal_close').trigger('click');
            }
            
            hideFullLoader(loaderId);
            form_container = '';
            var targetMenu = $("ul.item-list a span:contains('All'):first").parent();
            if($("#operation_list").length) {
                targetMenu.closest('.item-list').prev().click();
            }
            targetMenu.trigger('click');
            //updateMenuCount();
        }
        else if (d.status == 0) {
            /*
             * Modified By: Arvind Soni
             * Date: 8th March 2017
             * For server side validation check and give the responce error message
             */
            if (form_container == '_flyout' || form_container == '_dashboard') {
                loaderId = 'j_my_left_flyout_wrapper #j_my_left_flyout_loader';
            }
            hideFullLoader(loaderId);
            form_container = '';
            bootbox.alert(d.message);
            return false;
        }

    }

    function checkAllOptional(flag) {
        if (flag == 1) {
            if (form_container == '_flyout') {
                $("#j_my_left_flyout input[name='optional_ope_ids']").prop('checked', true);
            } else {
                $("#id_detail_content" + form_container + " input[name='optional_ope_ids']").prop('checked', true);
            }
            $("#check_all_optional_anchor").attr('onclick', 'checkAllOptional(0)').html('<i class="prs-icon check"></i><br><span>Unselect All</span>');
        } else if (flag == 0) {
            if (form_container == '_flyout') {
                $("#j_my_left_flyout input[name='optional_ope_ids']").prop('checked', false);
            } else {
                $("#id_detail_content" + form_container + " input[name='optional_ope_ids']").prop('checked', true);
            }
            $("#check_all_optional_anchor").attr('onclick', 'checkAllOptional(1)');
            $("#check_all_optional_anchor").html('<i class="prs-icon uncheck"></i><br><span>Select All</span>');
        }

    }

    function checkSingleOptional(elm) {
        if ($("#opration_id_" + elm + " input[name='optional_ope_ids']").is(":checked")) {
            $("#opration_id_" + elm + " input[name='optional_ope_ids']").prop('checked', false);
        } else {
            $("#opration_id_" + elm + " input[name='optional_ope_ids']").prop('checked', true);
        }
    }

    $("body").off(".jq_flyout_wrap input[name='optional_ope_ids']").on("click", ".jq_flyout_wrap input[name='optional_ope_ids']", function(event) {
        if ($(this).is(":checked")) {
            $(this).prop('checked', false);
        } else {
            $(this).prop('checked', true);
        }
    });

    function _init() {
        dashboardViewPane();
        applyJs();
        manageMenuDashboard();
        if (getActiveSectionId() == inboxMenuName.toLowerCase() && firstDashBoardLoad == 1 && has_banner_img_loaded == 1) {
            var refreshIntervalId = setInterval(function() {
                $.keep_showing_full_page_loader = false;
                $("#menu_wraper").removeClass('hide');
                hideFullLoader('full_page_loader');
                clearInterval(refreshIntervalId);
            }, 1500);
        }
    }

    function doPrintOfDoc(no) {
        var printHtml = '';
        if (no == '1') {
            /*
             * Modified By:Divya
             * Purpose: Based on Anthony’s comment, we will use following naming convention:
             * Operation Name_Customer #_Deal ID # _Stock #
             */
            var fileParam = '';
            var document_title = document.title;
            if (!$('#id_listing_operation').hasClass('hide')) {
                var dealId = $('#id_listing_body div.active-tr').data('node-id');
                var operation_Name = $.trim($('#id_listing_operation div.active .workflow-body .operation-title').text());
                var stock_Number = $('#hiddenstockNum').val();
                var customer_Number = $('#hiddencustNum').val();
                fileParam = operation_Name + '_' + customer_Number + '_' + dealId + '_' + stock_Number;
            }
            /*End Here*/

            var contentHeight = $('#edtCanvasView').height();
            var contents = $("#edtCanvasView").html();
            var documentHtml = "<div id='edtCanvasView' class='niceScrollDiv DocInsideHig' style='height:" + contentHeight + "px overflow: hidden; outline: none;'><div id='edtInnerCanvasView' class='screenMode'><div class='innerCanvasContainer'>" + contents + "</div></div></div>";
            var frame1 = $('<iframe />');
            frame1[0].name = "frame1";
            frame1.css({
                "position": "absolute",
                "top": "-1000000px"
            });
            $("body").append(frame1);
            var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
            frameDoc.document.open();
            //Create a new HTML document.
            frameDoc.document.write('<html><head><title></title>');
            frameDoc.document.write('</head><body>');
            //Append the external CSS file.
            frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/table-print.css" media="print"/>');

            //Append the DIV contents.
            frameDoc.document.write(documentHtml);
            frameDoc.document.write('</body></html>');
            frameDoc.document.close();
            setTimeout(function() {
                document.title = fileParam;
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                document.title = document_title;
                frame1.remove();
            }, 1000);
        } else {
            var contents = $("#edt").parent().html();
            var documentHtml = contents;
            var frame1 = $('<iframe />');
            frame1[0].name = "frame1";
            frame1.css({
                "position": "absolute",
                "top": "-1000000px"
            });
            $("body").append(frame1);
            var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
            frameDoc.document.open();
            //Create a new HTML document.
            frameDoc.document.write('<html><head><title></title>');
            //Append the external CSS file.
            frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/editor.css" />');
            frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/edt-style.css" />');
            frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/editor-print.css" media="print"/>');
            frameDoc.document.write('</head><body>');
            //Append the DIV contents.
            frameDoc.document.write(documentHtml);
            frameDoc.document.write('</body></html>');
            frameDoc.document.close();
            setTimeout(function() {
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                frame1.remove();
            }, 1000);
        }
    }

    function setMultipleAttr(el, method, data) {
        for (var key in data) {
            el[method](key, data[key]);
        }
    }

    function assignRoleOfRA(actor_node_id, map_role_actor_node_instance_id) {
        if (actor_node_id == '--' || actor_node_id == '')
            actor_node_id = login_user_id;

        node_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
        var data = {
            'action': 'assign_role_of_RA',
            'actor_node_id': actor_node_id,
            'map_role_actor_node_instance_id': map_role_actor_node_instance_id,
            'node_instance_id': node_instance_id
        };

        // $.post(base_plugin_url + 'code.php', data, reasponseAssignRoleOfRA, 'json');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(reasponseAssignRoleOfRA);
        });
    }

    function reasponseAssignRoleOfRA(d, s) {
        updateMenuCount();
        if (parseInt(d.status) == 0 || parseInt(d.status) > 0)
            getRolesOfPlugin(1);

        // TO UPDATE RA NAME IN LISTING
        d = d.data;
        if($('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").find('.dotdotdot').length) {
            $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").find('.dotdotdot').text(d.actor_name);
        } else {
            $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").text(d.actor_name);
        }
        // UPDATE STATUS
        var subStatusVal = d.sub_status_value;
        if(typeof subStatusVal !== 'undefined') {
            var statusPropId = deal_status_prop_id+','+deal_sub_status_prop_id;
            if ($('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').length) {
                var mainStatus = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text();
                if (subStatusVal.trim().length) {
                    var mainStatus = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text();
                    var status = mainStatus.split('-')[0] + ' - ' + subStatusVal;
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text(status);
                } else if(mainStatus.trim().length) {
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").find('.dotdotdot').text(mainStatus);
                }
            } else {
                var mainStatus = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+statusPropId+"']").text();
                if (subStatusVal.trim().length) {
                    var mainStatus = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+statusPropId+"']").text();
                    var status = mainStatus.split('-')[0] + ' - ' + subStatusVal;
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").text(status);
                } else if(mainStatus.trim().length) {
                    $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='" + statusPropId + "']").text(mainStatus);
                }
            }
        }
    }

    function createPdfImages(appOneFilePath) {
        if ($.trim(appOneFilePath) != '') {
            var data = {
                'action': 'convertpdftoimg',
                'appOneFilePath': appOneFilePath
            };
            // $.post(base_plugin_url + 'code.php', data, function(d, s) {
            //     console.log(d);
            // }, 'json');
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(function() { console.log('no callback provided...'); });
            });
        }
    }
    function fiLookup(curObj) {
        var flyoutEle = $('#j_my_dealLookup');
        if(flyoutEle.data('popupInitialized') !== true) {
            flyoutEle.flyout({type: 'overlay', horizontal: 'right', slideDirection: 'right'});
        }
        var data = {
            'action': 'fiLookup',
            'mode': 'lookupFlyout',
            'login_role_id': login_role_id,
            'login_user_id': login_user_id
        };
        var loaderId = 'content_loader_dealLookup';
        showFullLoader(loaderId);
        $.when(ActionModule.ajax(data)).then(function() {
            var level2Arguments = arguments;
            responseFiLookup(level2Arguments[0]);
        });
    }
    function responseFiLookup(d){
        if (typeof d.status != undefined && d.status == 0 && typeof d.message != undefined) {
            bootbox.alert(d.message);
            return false;
        } else {
        var detailWrapper = $("#id_detail_content_dealLookup");
        $("#id_detail_head_dealLookup").html(d.head);
        $("#id_detail_tooltip_dealLookup").html(d.tooltip);
        detailWrapper.html(d.content_detail);
        $("#id_detail_actions_dealLookup").html(d.actions);
        var loaderId = 'content_loader_dealLookup';
        modifyDropDown({selectorClass:'.dealLookupLocDrop',inputSize:3,searchAny:false,placeholder:'Search Location'});
        $.do_not_hide_loader = false;
        hideFullLoader(loaderId);
        }
    }

    function modifyDropDown(settingObj){
        var modifyDropDown = {};
        modifyDropDown.string = {};
        modifyDropDown.string.li = '<li data-value=""></li>';
        settingObj.placeholder = settingObj.placeholder?settingObj.placeholder:'Search';
        settingObj.inputSize = settingObj.inputSize?settingObj.inputSize:100;
        modifyDropDown.string.inner = '<input class="searchList" type="text" maxlength="'+settingObj.inputSize+'" placeholder="'+settingObj.placeholder+'"><ul class="dropList"></ul>';
        modifyDropDown.filterList = function(searchInput, targetListElement) {
            var searchText = $(searchInput).val().trim().toLowerCase();
            $(targetListElement).each(function () {
                if (settingObj.searchAny) {
                    var currentLiText = $(this).text().toLowerCase(),
                        showCurrentLi = currentLiText.indexOf(searchText) !== -1;
                }else{
                    var currentLiText =  $(this).text().toLowerCase().substring(0,searchText.length),
                        showCurrentLi = currentLiText === searchText;
                }
                $(this).toggle(showCurrentLi);
            });
        }
        var selectDrop = $(settingObj.selectorClass);
        selectDrop.hide();
        selectDrop.parent().append('<div class="newDropDown"></div><div class="newDropList"></div>');
        var newDropDown = selectDrop.siblings('.newDropDown');
        var newDropList = selectDrop.siblings('.newDropList');
        newDropDown.text(selectDrop.children('option:selected').text());
        newDropList.html(modifyDropDown.string.inner);
        var newList = [];
        selectDrop.children().each(function(index,value){
            var li = $(modifyDropDown.string.li);
            var val = $(value);
            if(val.attr('value') !== undefined){
                li.attr('data-value',val.attr('value'));
                li.text(val.text());
                newList.push(li);
            }
        });
        newDropList.children('.dropList').html(newList);
        newDropList.on('click',function(event){
            event.stopPropagation();
        });
        newDropDown.on('click',function(event){
            event.stopPropagation();
            newDropList.toggle();
            newDropList.children('.searchList').val('');
            newDropList.children('.searchList').siblings('ul').children().show();
            newDropList.children('.searchList').focus();
        });
        newDropList.children('.searchList').on('keyup blur',function(){
            modifyDropDown.filterList(this,$(this).siblings('ul').children());
        });
        newDropList.children('.dropList').children().on('click',function(){
            $(this).parent().parent().siblings('select').children('option[value="'+$(this).attr('data-value')+'"]').prop('selected',true).trigger("change");
            $(this).parent().parent().siblings('.newDropDown').text(selectDrop.children('option:selected').text());
            $(this).parent().siblings('.searchList').val('');
            $(this).parent().siblings('.searchList').siblings('ul').children().show();
            $(this).parent().parent().hide();
        });
        $('.newDropList').hide();
        $(document).on('click',function(){
            $('.newDropList').hide();
        });
    }


    function viewEditTextBox(mode, selector) {
        bindEventToRadioButtons(selector);
        if(mode === 'view') {
            var selectedText =  $(selector).find(' ~ .list-view-detail').text();
        } else { // edit
            var showTextBoxAttrVal = $(selector).find('input[type=radio]:checked').attr('showtextbox');
        }
        if(selectedText === 'Internet Site'  || selectedText === 'Other: Specify' || showTextBoxAttrVal === "true") {
            $('#externallink').removeClass('hide');
        }
    }

    function showTextbox(selector) {
        var showTextBoxAttrVal = $(selector).find('input[type=radio]:checked').attr('showtextbox');
        if( showTextBoxAttrVal === 'true'){
            $('#externallink').removeClass('hide');
            $('#externallink .validationCheck').val('');
        } else {
            $('#externallink').addClass('hide');
        }
    }

    function bindEventToRadioButtons(selector) {
        $(selector).on('change', ' [type=radio]', function() {
            showTextbox(selector);
        });
    }

    $.fn.addNewTextbox = function(options) {
        var defaults = {
            selector: 'addnewtextbox',
            autoCheck: false
        }


        function addBox(options) {
            var settings = $.extend({}, defaults, options)
            var checkStatus;
            if (settings.autoCheck) {
                $('[addnewtextbox]').each(function() {
                    checkStatus = $(this).is(':checked');
                    addTextbox(checkStatus, $(this))
                })

            } else {
                checkStatus = ('[addnewtextbox]', $(this)).is(":checked");
                addTextbox(checkStatus, $(this))
            }
        }

        function addTextbox(checkStatus, $this) {
            if (checkStatus) {
                //$this.siblings('.newTextBox').removeClass('hide');
                $this.parent('label').siblings('.newTextBox').removeClass('hide');
            } else {
                //$this.siblings('.newTextBox').val('').addClass('hide');
                $this.parent('label').siblings('.newTextBox').addClass('hide');
            }
        }

        function bindEvents() {
            $('body').on('change', '[addnewtextbox]', addBox);
        }
        addBox({
            autoCheck: true
        });
        bindEvents();

    };

    $('[addnewtextbox]').addNewTextbox();

     /*file upload toggle check*/
    function checkUploadedDocView(selector) {
         if($('.remote_download_link').attr('download') && $('.remote_download_link').parents('.collapse').css('display') == 'none')
         {
            showTab(selector);
         }
    }

   function checkUploadedDocEdit(selector) {
        if( $(selector).val() ) {
            showTab(selector);
        }
    }

   function showTab(selector) {
        $(selector).parents('.collapse:not(".in")').siblings('a').find('.fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down');
        $(selector).parents('.collapse:not(".in")').show();
   }


    return {
        _init: _init,
        assignRoleOfRA: assignRoleOfRA,
        createPdfImages: createPdfImages,
        reasponseAssignRoleOfRA: reasponseAssignRoleOfRA,
        doPrintOfDoc: doPrintOfDoc,
        viewOperationInfo: viewOperationInfo,
        checkAllOptional: checkAllOptional,
        responseMenuListAgain: responseMenuListAgain,
        setOptionalOperationWithRequired: setOptionalOperationWithRequired,
        responseSetOptionalOperationWithRequired: responseSetOptionalOperationWithRequired,
        getOptionalOperationList: getOptionalOperationList,
        manageMenuDashboard: manageMenuDashboard,
        dashboardViewPane: dashboardViewPane,
        getWorkSpacePage: getWorkSpacePage,
        responseGetWorkSpacePage: responseGetWorkSpacePage,
        getOperationInstanceForm: getOperationInstanceForm,
        responseGetOperationInstanceForm: responseGetOperationInstanceForm,
        responseSearchActor: responseSearchActor,
        getDocument: getDocument,
        getUrlFromString: getUrlFromString,
        responseDocument: responseDocument,
        appendResponse: appendResponse,
        responseDocument_bkp: responseDocument_bkp,
        mangeNiceScroller: mangeNiceScroller,
        EditorPaneHT: EditorPaneHT,
        addCssFileAppend: addCssFileAppend,
        addScriptFileAppend: addScriptFileAppend,
        callEditContentdocumentAction: callEditContentdocumentAction,
        responseEditDocument: responseEditDocument,
        getCurrentDateTime: getCurrentDateTime,
        viewDocumentData: viewDocumentData,
        showInstanceByDisplayType: showInstanceByDisplayType,
        saveWorkSpaceAction: saveWorkSpaceAction,
        editWorkSpaceAction: editWorkSpaceAction,
        responseEditWorkSpace: responseEditWorkSpace,
        completeAllOperation: completeAllOperation,
        completeAllOpt: completeAllOpt,
        completeOperation: completeOperation,
        incompleteOperation: incompleteOperation,
        incompleteOp: incompleteOp,
        completeOp: completeOp,
        setOperationDetailHeading: setOperationDetailHeading,
        manageNotification: manageNotification,
        manageDetailNotification: manageDetailNotification,
        viewDealInfo: viewDealInfo,
        loadAppOneLogin: loadAppOneLogin,
        loadAppOneIframeWithUrl: loadAppOneIframeWithUrl,
        checkPPCurl: checkPPCurl,
        checkSingleOptional: checkSingleOptional,
        getReviewDocument: getReviewDocument,
        viewDocumentDataReview: viewDocumentDataReview,
        callEditContentdocumentActionReview: callEditContentdocumentActionReview,
        dealRejectPopup: dealRejectPopup,
        dealRejectionFrmEnable: dealRejectionFrmEnable,
        dealRejectionFrmDisable: dealRejectionFrmDisable,
        saveDealRejectReason: saveDealRejectReason,
        uploadoperationdocument: uploadoperationdocument,
        saveOperationalDocuments: saveOperationalDocuments,
        setMultipleAttr: setMultipleAttr,
        dealRejectReasonSave: dealRejectReasonSave,
        appOneApplicationStatus: appOneApplicationStatus,
        cache: cache,
        fiLookup:fiLookup,
        modifyDropDown:modifyDropDown,
        bindEventToRadioButtons: bindEventToRadioButtons,
        updateDealStatusSubStatus: updateDealStatusSubStatus,
        rightFormBlank:rightFormBlank,
        leftFormBlank:leftFormBlank,
        getFormElementSelector: getFormElementSelector
    };
});
