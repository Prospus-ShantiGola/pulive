define(function () {
    var selectors = {};
    var checkboxSep = "~#~";
    var assessmentViewInsId = '901154';
    var fi_ErrorPopupVisible = 0;
    var fiApiObject = {
        fiPostReq: '',
        boatPostReq: '',
        customerPostReq: '',
        coBuyerPostReq: '',
        displayType: '',
        loaderId: '',
        locationCode: '',
        data: {}
    };
    var cache = {};
    //function to alert before delete an optional operation for a deal
    function deleteOptionalOperation(event, operation_id) {
        event.stopPropagation();
        var callback = function (response) {

            var isActive = false;
            var isIndexView = $("#operation_list").length;
            var removeItemElement = '', removeItemElement2;
            var operation_list_pane;
            if(isIndexView) {
                removeItemElement = $("#operation_list").find("#opration_id_" + operation_id);
                operation_list_pane = removeItemElement.closest('.operation-list-pane');
            } else {
                removeItemElement = $("#opration_id_" + operation_id);
                operation_list_pane = removeItemElement.closest('#id_listing_operation');
            }

            if(removeItemElement.hasClass('active')) {
                isActive = true;
            }
            removeItemElement.remove();
            if(isIndexView) { // in this case, same item is hidden on the page so remove it as well
                $('div[id="opration_id_' + operation_id+'"]').remove();
            }
            $('#menu_'+operation_id).parent().remove(); // remove menu from 'Index View' section
            hideFullLoader('listing_loader');
            if(isActive) {
                var firstElement = operation_list_pane.find('.flex-grid:first');
                if(firstElement.length) {
                    firstElement.trigger('click');
                } else {
                    var noOperation = leftNavigationModule.getNotFoundTemplate();
                    operation_list_pane.append(noOperation);
                    leftNavigationModule.showEmptyDetail();
                }

            }
            // try{
            //     // if($('li[data-operation-id="'+operation_id+'"]').length > 0) {
            //     //     $('li[data-operation-id="'+operation_id+'"]').remove();
            //     //
            //     // }
            //
            //
            //     // $('a.opsParent').each(function(index,anchor) {
            //     //     if($(anchor).siblings('ul.collapse').length===0 || ($(anchor).siblings('ul.collapse').length>0 && $(anchor).siblings('ul.collapse').html().trim() === '')){
            //     //         $(anchor).siblings('ul').remove();$(anchor).find('i.fa').remove();
            //     //     }
            //     // });
            //     // if ($("#id_listing_operation").find('#operation_list.list-accordion').length > 0) {
            //     //     $("#id_listing_operation").find('#operation_list .panel-heading').siblings('.panel-collapse').each(function(index,collapse){
            //     //         if($(collapse).find('.operation-list-pane').html().trim()===''){
            //     //             var noRecord = '<div class="flex-grid noEntry clearfix no-record-list no-record-operation-list">There are no operations in this grouping.</div>';
            //     //             $(collapse).find('.operation-list-pane').html(noRecord);
            //     //         }
            //     //     });
            //     //     if(localStorage.getItem('operationHtml') !== null && $('#id_listing_operation .mCSB_container').html().trim() !== ''){
            //     //         localStorage.setItem('operationHtml',$('#id_listing_operation .mCSB_container').html());
            //     //     }
            //     // }
            //
            // } catch(err){console.log('Removed operation, check error: ' +err)}

            // var listObj = $("#id_listing_operation");
            // var listCount = listObj.find('[id^=opration_id_]').length;
            // if (listCount == 0) {
            //     var searchStr = searchModule.properties.cache.searchString;
            //     if (searchStr) {
            //         searchModule.searchString(searchStr);
            //     } else {
            //         hideFullLoader('listing_loader');
            //         htmlModule.triggerActiveMenu();
            //     }
            // } else {
            //     hideFullLoader('listing_loader');
            //     var activeLi = listObj.find('div.active:visible').length;
            //     if (activeLi == 0) {
            //         if(listObj.find('#operation_list .panel-heading.Active').siblings('.panel-collapse').find('.flex-grid:not(.noEntry)').length > 0){
            //             var firstOpActive = $('.panel-heading.Active').siblings('.panel-collapse').find('.flex-grid')[0];
            //             $(firstOpActive).trigger('click');
            //         } else {
            //             listObj.find('[id^=opration_id_]').first().trigger('click');
            //         }
            //     }
            // }
            updateMenuCount();
        }
        var data = {
            'action': 'delete_optional_operation',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'operation_id': operation_id
        };
        ActionModule.confirmDelete({
            msg: 'If you remove this operation, you will loose any data you saved. Please confirm.',
            data: data,
            loader: 'listing_loader',
            callback: callback
        });
    }

    //function to delete operation document
    function deleteOprIns(doc_ins_id) {
        ActionModule.confirmDelete({
            msg: 'Do you want to delete this operation attachment? Please confirm.',
            data: {
                action: 'delete_operation_attachment',
                doc_ins_id: doc_ins_id,
            },
            loader: 'content_loader',
            callback: function () {
                hideFullLoader('content_loader');
                $(".attachment_" + doc_ins_id).remove();
            }
        });
    }
    function appendImagesToBody(images) {
        if(typeof images == 'undefined' || !images.length) {
            return false;
        }
        var printFlyout = $("#j_my_left_flyout_print");
        var loaded_images = 0;

        var body = $('body');
        body.find('#imgContainer').remove();
        var imgContainer = $('<div />').attr('id', 'imgContainer').css({
            "position": "absolute",
            "top": "-1100000px"
        });
        body.append(imgContainer);
        var imgInnerContainer = $('<div />').attr('id', 'imgInnerContainer');

        var totalImages = images.length;
        var seconds = new Date().getTime() / 1000;
        for(var i = 0; i < totalImages; i++) {
            var imgTag = $('<img />').attr('src', images[i]+'?t='+seconds).load(function() {
                loaded_images++;
                //printFlyout.find('.progress-title').text('Loading document '+loaded_images+ ' of ' +totalImages).parent().removeClass('hide');
                if(totalImages == loaded_images) {
                    setTimeout(function() {
                        createFrame((totalImages * 100));
                    }, 500);
                }
            }).error(function() {
                bootbox.alert("Documents failed to print please try again.");
            });
            imgInnerContainer.append(imgTag);
            imgInnerContainer.append('<div style="page-break-after: always;"></div>');
        }
        imgContainer.append(imgInnerContainer);
    }
    function createFrame(timeout) {
        var timeout_time = (timeout) ? timeout : 500;
        var document_title = document.title;
        var imgListContainer = $("#imgInnerContainer");
        var iframeHtml = documentHtml.replace('{image_placeholder}', imgListContainer.html());

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({
            "position": "absolute",
            "top": "-1000000px"
        });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        frameDoc.document.write(iframeHtml);
        frameDoc.document.close();
        document.title = document_title;

        setTimeout(function() {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();

            var printFlyout = $("#j_my_left_flyout_print");
            var loaderEle = printFlyout.find('.j_my_left_flyout_loader');
            setTimeout(function () {
                frame1.remove();
                loaderEle.hide();
                var printFlyout = $("#j_my_left_flyout_print");

            }, 500);
        }, timeout_time);
    }

    var documentHtml = '';
    //function to return multiple operation document for a deal
    function printPackageDocumentHtml() {
        var printFlyout = $("#j_my_left_flyout_print");
        var checkedCheckboxes = printFlyout.find('.child-check-all:checked');
        if (!checkedCheckboxes.length) {
            return true;
        }
        var loaderEle = printFlyout.find('.j_my_left_flyout_loader');
        loaderEle.show();

        var document_id_array = [];
        var operation_id_array = [];
        checkedCheckboxes.map(function () {
            document_id_array.push($(this).val());
            operation_id_array.push($(this).closest('.flex-grid').attr('data-operation-id'));
        });
        var data = {
            'action': 'printMultipleDocument',

            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'deal_user_role_id': deal_user_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'document_id_array[]': document_id_array,
            'operation_id_array[]':operation_id_array
        };

        /*
         * Modified By:Divya
         * Purpose: Based on Anthony’s comment, we will use following naming convention:
         * Operation Name_Customer #_Deal ID # _Stock #
         */
        var fileParam = '';
        var document_title = document.title;
        if (!$('#id_listing_operation').hasClass('hide')) {
            var dealId = $('#id_listing_body div.active-tr').data('node-id');
            var stock_Number = $('#hiddenstockNum').val();
            var customer_Number = $('#hiddencustNum').val();
            fileParam = customer_Number + '_' + dealId + '_' + stock_Number;
            document.title = fileParam;
        }
        /*End Here*/

        $.ajax({
            type: "POST",
            url: base_plugin_url + 'code.php',
            data: data,
            dataType: "json",
            async: true,
            success: function (data) {
                data = data.data;
                if (data.length > 0) {
                    //Create a new HTML document.
                    documentHtml = "<html><head><title></title>";
                    documentHtml += "</head><body>";
                    //Append the external CSS file.
                    //documentHtml += "<style>#edtCanvasView .canvasDynamicField,.mappingNode{min-height:16px;line-height:16px;vertical-align:bottom}@page{size:auto;margin:25px 35px}body{font-family:'Open Sans',sans-serif}table{border-collapse:collapse}#canvasNodeList,#canvasToolbar,#canvastableContextMenu,#gridLine,#gthorresizer,#gtresizer,#selClassDropdown,.deletePageSpan{display:none}#edtCanvasView{width:auto}#edtCanvasView table{width:100%;table-layout:fixed;border-collapse:separate;height:auto}/ anjali code / #edtCanvasView td{padding:5px;outline:0;word-break:break-word;vertical-align:top;margin:0;font-size:11px;box-sizing:border-box}#edtCanvasView td{-webkit-print-color-adjust:exact}#edtInnerCanvasView .innerCanvasContainer{page-break-after:always;display:block;padding:0;margin:0}.canvasUnderline{text-decoration:underline}.canvasBold{font-weight:700}.canvasItalic{font-style:italic}.canvasLeftALign{text-align:left}.canvasRightAlign{text-align:right}.canvasCenter{text-align:center}.canvasJustify{text-align:justify}.mappingNode{font-size:10px}#edtCanvasView .canvasDynamicField{min-width:100px;display:inline-block}.canvasEDTTable td input[type=checkbox],.canvasEDTTable td input[type=radio]{margin:0;vertical-align:bottom;cursor:default}</style>";
                    var hasImage = false;
                    $.each(data, function (index, value) {
                        if (value.document_type === 'Canvas') {
                            documentHtml += "<div id='edtCanvasView' class='niceScrollDiv DocInsideHig' style='overflow: hidden; outline: none;'><div id='edtInnerCanvasView' class='screenMode'><div class='innerCanvasContainer'>";
                            documentHtml += $(value.document_html).find('#edtCanvasView').html();
                            //documentHtml += "<div style=\"page-break-after: always;\"></div>";
                            documentHtml += "</div></div></div>";
                        } else if (value.document_type === 'Appone'){
                            hasImage = true;
                            appendImagesToBody(value.document_html);
                            documentHtml += "{image_placeholder}";
                        }else {
                            documentHtml += $(value.document_html).find("#edt").parent().html();
                            //documentHtml += "<div style=\"page-break-after: always;\"></div>";
                        }
                    });
                    documentHtml += "</body></html>";

                    if(hasImage) {

                    } else {
                        var frame1 = $('<iframe />');
                        frame1[0].name = "frame1";
                        frame1[0].id = "printDocIframe";
                        frame1.css({
                            "position": "absolute",
                            "top": "-1000000px"
                        });
                        $("body").append(frame1);
                        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
                        frameDoc.document.open();
                        frameDoc.document.write('<link rel="stylesheet" type="text/css" href="' + base_plugin_url + 'css/table-print-package.css" media="print"/>');
                        frameDoc.document.write(documentHtml);
                        frameDoc.document.close();
                        document.title = document_title;
                        //setTimeout(function() {
                        document.getElementById('printDocIframe').onload = function() {
                            window.frames["frame1"].focus();
                            window.frames["frame1"].print();

                            setTimeout(function () {
                                frame1.remove();
                                loaderEle.hide();
                            }, 1500);
                        }    
                        //}, 1500);
                    }
                }
            },
            error: function (data) {
                hideFullLoader('j_my_left_flyout_loader_print');
                bootbox.alert("Documents failed to print please try again.");
            }
        });
    }

    //function to sort list based on search
    function searchOpsToPrint(searchInput, targetListElement, listTextElement, searchBtn, highlight) {
        $(searchInput).keyup(function () {
            filterListOnSearch(this, targetListElement, listTextElement, highlight);
        });
        if ($(searchBtn).length) {
            $(searchBtn).click(function () {
                filterListOnSearch(searchInput, targetListElement, listTextElement, highlight);
            });
        }
    }

    function filterListOnSearch(searchInput, targetListElement, listTextElement, highlight) {
        // make all checkboxes unchecked.
        $(targetListElement).find('input').prop('checked',false);
        $('.check-all-js').removeClass('inactive').find('.prs-icon').removeClass('check').addClass('uncheck').parent().find('span').text('Select All');
        $('.j_my_print_close').addClass('inactive');

        var searchText = $(searchInput).val().trim().toLowerCase();
        $(targetListElement).each(function () {
            var currentLiText = $(this).find(listTextElement).text().toLowerCase(),
                showCurrentLi = currentLiText.indexOf(searchText) !== -1;
            $(this).toggle(showCurrentLi);
        });
        if (highlight) {
            if (searchText !== '') {
                $(targetListElement + ' ' + listTextElement).removeHighlight();
                $(targetListElement + ' ' + listTextElement).highlight(searchText);
            } else {
                $(targetListElement + ' ' + listTextElement).removeHighlight();
            }
        }
    }
    //function to sort list based on search

    //function to return all selected document html
    function printPackageDocument(clicked_element) {
        leftNavigationModule.toggleActiveSelection('make_clicked_element_active', $(clicked_element));
        leftNavigationModule.toggleClassOnMenuElements('add');
        var printFlyout = $("#j_my_left_flyout_print");
        var docListWrapper = printFlyout.find('.document-list');
        docListWrapper.html('');
        printFlyout.find('.input-group').find('.form-control').val('');
        // make "check-all" checkbox unchecked when flyout opens
        var data = {
            'action': 'viewOperationList',
            'deal_node_instance_id': deal_instance_id,
            'deal_instance_node_id': deal_node_id,
            'deal_actor_role_node_id': deal_user_role_id,
            'deal_user_role_id': deal_user_role_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
        };
        $.ajax({
            type: "POST",
            url: base_plugin_url + 'code.php',
            data: data,
            dataType: "json",
            async: true,
            success: function (data) {
                data = data.data;
                docListWrapper.html(data.msg);
                if($('.print_package_opr_list').children().length === $('.printOperDisable').length) {
                    $('#j_my_left_flyout_print_wrapper .user-action-wrap  .prs-icon.check').removeClass('check').addClass('uncheck').parent().addClass('inactive')
                } else {
                    toggleCheckallCheckbox('#j_my_left_flyout_print_wrapper','.j_my_print_close')
                }
            },
            complete: function (data) {
                hideFullLoader('j_my_left_flyout_loader_print');
            },
            error: function (data) {
                bootbox.alert("Documents list failed to load please try again.");
                $(".j_my_left_flyout_print_close").trigger('click'); // close flyout on api error
            }
        });
        setTimeout(function () {
            $(".j_my_left_flyout_print_open").trigger('click'); // show flyout
            $('#j_my_left_flyout_print .search-item-wrap input[type="text"]').val('');
            searchOpsToPrint('#j_my_left_flyout_print .search-item-wrap input[type="text"]', '#j_my_left_flyout_print .document-list div.flex-grid', 'h4', '#j_my_left_flyout_print .search-item-wrap a.input-group-addon', true);
        }, 100);
    }

    /**
     * [toggleChecked description: When checkall checkbox is checked/unchecked then all children checkboxes should get checked/unchecked ]
     * @param  {DomElement} clicked_element         [ check all element ]
     * @param  {String} child_checkbox_selector [ selector of children checkboxes ]
     * @param  {String} wrapper_selector        [ selector of a wrapper where children checkboxes to be found ]
     * @return undefined
     */
    function toggleChecked(clicked_element, child_checkbox_selector, wrapper_selector) {

        var checkall_checkbox = $(clicked_element).find('.prs-icon');
        var children_checkboxes = checkall_checkbox.closest(wrapper_selector).find(child_checkbox_selector+':visible');
        var parent_wrapper = $(clicked_element).closest(wrapper_selector);
        if (checkall_checkbox.hasClass('uncheck')) {
            checkall_checkbox.removeClass('uncheck').addClass('check');
            children_checkboxes.prop('checked', true);
            parent_wrapper.find('.j_my_print_close').removeClass('inactive');
            checkall_checkbox.closest('a').find('span').text('Unselect All');
        } else {
            checkall_checkbox.removeClass('check').addClass('uncheck');
            children_checkboxes.removeAttr('checked');
            parent_wrapper.find('.j_my_print_close').addClass('inactive');
            checkall_checkbox.closest('a').find('span').text('Select All');
        }
    }

    function toggleCheckallCheckbox(wrapper_selector, makeBtnActive) {
        var wrapper = $(wrapper_selector);
        var childChekckboxes = wrapper.find('.child-check-all:visible');
        var checkAllCheckbox = wrapper.find('.check-all-js');
        checkAllCheckbox.find('.prs-icon').removeClass('check').addClass('uncheck').closest('a').find('span').text('Select All');
        if (childChekckboxes.length == childChekckboxes.filter(':checked').length) {
            checkAllCheckbox.find('.prs-icon').removeClass('uncheck').addClass('check').closest('a').find('span').text('Unselect All');
        }
        if (childChekckboxes.filter(':checked').length > 0 && $(makeBtnActive).length) {
            $(makeBtnActive).removeClass('inactive');
        } else {
            $(makeBtnActive).addClass('inactive');
        }
    }
    //function to return all selected document html end

    function updateMenuCount() {
        var menu_arr = [];
        $('#page_plugin_menu_item_list ul.item-list li').each(function () {
            var menu_status_id = $(this).attr('data-statusid');
            if (menu_status_id !== '' && menu_status_id !== undefined) {
                if ($.inArray(menu_status_id, menu_arr) == -1) {
                    menu_arr.push(menu_status_id);
                }
            }
        });
        if (menu_arr.length) {
            var is_operation_list = false;
            var deal_node_instance_id = '';
            if ($('#id_listing_operation').html().length > 0) {
                is_operation_list = true;
                deal_node_instance_id = $('#id_listing_body').find('div.active-tr').data('id')
            }
            deal_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
            var dataParams = getAjaxParams({
                'action': 'menu_count',
                'node_class_property_id': menu_arr,
                'class_node_id': class_node_id,
                is_operation_list: is_operation_list,
                'deal_node_instance_id': deal_node_instance_id,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'roleId': login_role_id,
                'data-node-id': deal_node_id
            });
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'JSON'}, dataParams).then(responseMenuCount);
            });
            // $.post(base_plugin_url + 'code.php', dataParams, responseMenuCount, 'JSON');
        }
    }

    function responseMenuCount(d) {
        if(d == 'Error 500') {
            return false;
        }
         var data = $.parseJSON(d).data;
        //var data = $.parseJSON(d.data);
        //Reset all menu filter set zero
        $('#page_plugin_menu_item_list ul.item-list [data-statusid]').find('[data-title]').find('span.badge').text(0);
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var menuItems = data[key];
                for (var menu in menuItems) {
                    if (menuItems.hasOwnProperty(menu)) {
                        if(key=='rolesMenuCount') {
                            $('#page_plugin_menu_item_list ul.item-list [data-statusid="' + menu + '"]').find('[data-title="' + menu.toLowerCase() + '"]').find('span.badge').text(menuItems[menu]);
                        } else {
                            $('#page_plugin_menu_item_list ul.item-list [data-statusid=' + key + ']').find('[data-title="' + menu.toLowerCase() + '"]').find('span.badge').text(menuItems[menu]);
                        }
                    }
                }
            }
        }
    }
    function responseMenuList(d, s) {
        var menuListContainer = $('#page_plugin_menu_item_list');
        menuListContainer.html(d);
        updateMenuCount();
        // if loader element is there in menu container then remove it.
        var menuContainer = $('.menu-items').find('.selectlist:last').find('.scroll-wrap');
        menuContainer.find('.loader-wrapper').remove();

        roleWiseAddDeal();
        // Amit Malakar >>>
        var addFlag = false;
        menuListContainer.find('span.item-list-detail').each(function () {
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
        } else {
            $("div#menu_wraper").removeClass('hide');
        }
        $(".j_my_left_flyout_print_open").addClass("hide");
        // <<< Amit Malakar
        if(globalVar.dealFilterCheck) {
            var current_list_status_temp = current_list_status;
            current_list_status = current_list_status.replace('ra_','');
            filterActiveOnStatus(current_list_status_temp);
            if(current_list_status!=='' && current_list_status === 'Capped') {
                menuListContainer.find('li').removeClass('active');
                $('#li_id_398476').addClass('active').find('a').attr('data-title','Capped');
                $('#li_id_398476').addClass('active').attr('data-statusid','3287');
            }
            $.keep_showing_full_page_loader = false;
            globalVar.cantHide = false;

            if(!$('#id_detail_content:empty').length) {
                hideFullLoader('full_page_loader');
                $.keep_showing_full_page_loader = true;
                $.loaded_panels_count = 0;
                $.increment_panel_count = false;
            }
            globalVar.dealFilterCheck = false;
            globalVar.cantHide = true;
        }
    }

    function getFilterList(curObj, status, propertyId, id, fieldName) {
        curObj = $(curObj);
        leftNavigationModule.cache.action_flyout_active_menu = undefined;// reset stored value
        if (form_container == '') {
            // if flyout menu clicked
            $('.sidebar_wrap .menu-items li.open-option-flyout.active').find('a').attr('data-title', status).data('title', status);
            if ($('#id_listing_body:visible').length) {
                if (searchModule.checkAddEditForm(curObj) == false) {
                    return false;
                }
            } else {
                status = (status == '') ? 'all' : status;
                var detailWrapper = $("#id_detail_content");
                // if (htmlModule.checkFormState(detailWrapper.find('form:visible'))) {
                //     var msg = 'Are you sure you want to continue?  Any unsaved data will be lost.';
                //     searchModule.showPopup(curObj, msg);
                //     return false;
                // }
                var detail_content_wrapper = $("#id_detail_content");
                var element_selector = getFormElementSelector(detail_content_wrapper);
                if(UtilityModule.hasFormStateChanged("#id_detail_content", element_selector)) {
                    var message = UtilityModule.getFormStateChangedMessage("#id_detail_content", element_selector);
                    bootbox.confirm({
                        title: 'Confirm',
                        message: message,
                        callback: function(state) {
                            if(state) {
                                UtilityModule.resetCache("#id_detail_content", element_selector);
                                getFilterList(curObj, status, propertyId, id, fieldName);
                            }
                        }
                    });
                    return false;
                }
            }

            if (curObj.hasClass('submenu')) {
                if(curObj.attr('data-placement')) { // if short-cut icon was clicked
                    leftNavigationModule.cache.last_selected_submenu = $.trim(curObj.attr('data-original-title')).toLowerCase();
                } else {
                    leftNavigationModule.cache.last_selected_submenu = $.trim(curObj.find('.item-list-detail').text()).toLowerCase();
                }
            } else {
                if(curObj.attr('data-placement')) { // if short-cut icon was clicked
                    leftNavigationModule.cache.selected_main_menu_text = $.trim(curObj.attr('data-original-title')).toLowerCase();
                } else {
                    leftNavigationModule.cache.selected_main_menu_text = $.trim(curObj.find('.item-list-detail').text()).toLowerCase();
                }
            }
            leftNavigationModule.highlightMenu(curObj);
            searchModule.resetSearchInput();
            searchModule.removeSearchFilter();
            if (typeof resetHeadFilters === "function") {
                resetHeadFilters();
            }
            //======= store clicked filer reference =============
            var search_string = searchModule.getSearchString();
            if (search_string !== '') {
                searchModule.searchString(search_string);
            } else {
                var record_per_page = getRecordPerPageValue();
                curpage = 1;
                require(['page_module'], function (PageModule) {
                    if ($('#id_listing_operation').html().length > 0) {
                        deal_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
                        deal_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
                        if(GoToPageModule.getSelectedRole(true) == 'super_admin'){
                            deal_user_role_id = status;
                            var super_admin_confirmation = true;
                        }else{
                            deal_user_role_id = login_role_id;
                            var super_admin_confirmation = false;
                        }
                        $.keep_showing_full_page_loader = true;
                        showFullLoader('full_page_loader');
                        fieldname = fieldName;

                        var data = {
                            'action': 'opreratinList',
                            'status': status,
                            'propertyId': propertyId,
                            'deal_node_instance_id': deal_instance_id,
                            'deal_instance_node_id': deal_node_id,
                            'deal_actor_role_node_id': deal_user_role_id,
                            'list_mapping_id_array': list_mapping_id_array,
                            'login_user_id': login_user_id,
                            'fieldname': fieldname,
                            'sadmin': super_admin_confirmation,
                        };
                        var settings = {
                            dataType: 'json'
                        };

                        if (typeof OperationModule != 'undefined' && typeof OperationModule.options.cache.phase != 'undefined') {
                            data['is_deal_editable'] = OperationModule.isDealEditable();
                        }
                        dataSettings = $('#id_listing_body').find('.row.active-tr').data('settings');
                        require(['page_module'], function (PageModule) {
                            PageModule.ajaxPromise({requestType: 'POST', dataType: 'JSON'}, data).then(responseGetWorkSpacePage);
                        });
                        // $.post(base_plugin_url + 'code.php', data, responseGetWorkSpacePage, 'json');
                        /**
                        * Created by Anil Gupta
                        * Date: 17-Feb-2017
                        * Through Add this function we can remove the dublicate menu_count
                        */
                        updateMenuCount();
                        /*End*/
                    } else {
                        var save_deal               = localStorage.getItem('save_deal') ? localStorage.getItem('save_deal') : '';
                        var save_status             = localStorage.getItem('save_status') ? localStorage.getItem('save_status') : '';
                        //for selecting saved new deal
                        var new_deal_id             = localStorage.getItem('new_deal_id') ? localStorage.getItem('new_deal_id') : (dataSettings['data-node-id'] ? dataSettings['data-node-id'] : '');
                        var new_deal_instance_id    = localStorage.getItem('new_deal_instance_id') ? localStorage.getItem('new_deal_instance_id') : (dataSettings['data-id'] ? dataSettings['data-id'] : '');

                        var options = {
                            data: getAjaxParams({
                                'action': 'list_content',
                                'list_head_array': list_head_array,
                                'list_setting_array': list_setting_array,
                                'list_node_id_array': list_node_id_array,
                                'status': status,
                                'propertyId': propertyId,
                                'record_per_page': record_per_page,
                                'page': curpage,
                                'list_mapping_id_array': list_mapping_id_array,
                                'login_user_id': login_user_id,
                                'roleId': login_role_id,
                                'new_deal_id': new_deal_id,
                                'new_deal_instance_id': new_deal_instance_id,
                                'save_status': save_status,
                                'save_deal': save_deal,
                            }),
                            success: function (d, s) {
                                responseListContent(d, s);
                            },
                            dataType: 'html'
                        };
                        PageModule.loadMiddlePanel(options);
                    }
                });
            }
            if (fieldName && fieldName.toLowerCase() == 'all') {
                leftNavigationModule.cache.show_sidebar_flyout = false;
            }
            if(!curObj.attr('data-placement')) {
                // blank cache of filter options
                leftNavigationModule.cache.last_selected_submenu = '';
            }
        }
        resetSortedClass();
    }

    function resetHeadFilters() {
        $('#id_listing_header .filter-menu').each(function () {
            var _this = $(this);
            _this.find('li').removeClass('active');
            _this.find('ul.show-sub-child').remove();
            _this.find('.col-header-str').val('');
            _this.find('div.search-item-wrap').hide();
        });
    }

    function resetAllFilters() {
        // search clear
        searchModule.removeSearchFilter();
        // filter reset & sort reset
        resetHeadFilters();
        // pagination reset
        var filter_text = searchModule.getActiveMenuValue();
        var last_filter_id = $('.item-list').find('li.active').attr('id');
        var filter_prop_id = searchModule.getActiveMenuDataId();
        getFilterList('', filter_text, filter_prop_id, last_filter_id);
        leftNavigationModule.cache.last_selected_submenu = '';
    }

    function resetSortFilters(currentElm) {
        $(currentElm).parents('.sort-by').removeClass('active');
        $(currentElm).parents('.filter-menu').removeClass('sortFilterApllied');
        getColHeadFilter()
    }

    function resetListHeadSearchFilter(currentElm) {
        $(currentElm).parents('.search-item-wrap').find('.col-header-str').val('');
        $(currentElm).removeClass('resetSearch').addClass('entr-filter');
        getColHeadFilter()
    }

    function filterApplied(elem, method) {
            $(elem).parents('.filter-menu')[method]('sortFilterApllied');
    }

    function resetSortedClass() {
        $('#id_listing_header').find('.sortFilterApllied').each(function() {
            var headingWithActiveSort = !($(this).find('li.sort-by.active').length);;
            var textFieldActive = !($(this).find('.parent-item.active').length);
            var activeSort = $(this).hasClass('sortFilterApllied')
            if( headingWithActiveSort && textFieldActive && activeSort) {
                    $(this).removeClass('sortFilterApllied')            
            }
        });
    }

    function getHeadFilterArr() {
        var head_filter_arr = [];
        $('#id_listing_header div.row div.filter-menu').each(function () {
            var head = $(this).find('.listing-title').text().trim();

            var sel_item = $(this).find('.dropdown-menu li.active');
            var searchBox = sel_item.siblings('div.search-item-wrap').find(':input[type=text]');
            var filter = '',
                sort = '',
                search = '';
            if (sel_item.hasClass('parent-item') && searchBox.val() !== '') {
                filter = sel_item.find('li.sub-filter.active').html();
                search = sel_item.siblings('div.search-item-wrap').find(':input').val();
            } else if (sel_item.hasClass('sort-by')) {
                sort = sel_item.find('span.sortedText').html();
            }
            if (sort != '' || filter != '') {
                head_filter_arr.push({
                    col: head,
                    sort: sort,
                    filter: filter,
                    search: search
                });
            }
        });
        return head_filter_arr;
    }

    function getColHeadFilter() {
        setTimeout(function(){
            var callback_params = {
                data: '',
                callback: function () {
                    head_filter_arr = getHeadFilterArr();
                    var ajaxParams = getAjaxParams({
                        'action': 'list_content',
                        'list_head_array': list_head_array,
                        'list_setting_array': list_setting_array,
                        'list_node_id_array': list_node_id_array,
                        'record_per_page': getRecordPerPageValue(),
                        'page': curpage,
                        'head_filter': head_filter_arr,
                        'status': searchModule.getActiveMenuValue(),
                        'propertyId': searchModule.getActiveMenuDataId(),
                        'search_string': searchModule.getSearchString(),
                        'list_mapping_id_array': list_mapping_id_array,
                        'login_user_id': login_user_id,
                        'roleId': login_role_id,
                    });
                    require(['page_module'], function (PageModule) {
                        PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxParams).then(responseListContent);
                    });
                    // $.post(base_plugin_url + 'code.php', ajaxParams, responseListContent, 'html');
                }
            };
            showFullLoader('listing_loader', callback_params);
        }, 0);
    }

    function getColHeadPropertyId() {
        var menuPropIds = [];
        $('#id_listing_header div.row').children('div').each(function () {
            var status = $(this).find('span').attr('data-statusid');
            if (status === undefined || status === '') {
                menuPropIds.push('');
            } else {
                menuPropIds.push(status);
            }
        });
        return menuPropIds;
    }

    function routeAfterAddDeal() {
        var activeItem = leftNavigationModule.cache.action_flyout_active_menu;
        var isShortcutMenu = (activeItem.data('placement') == 'right') ? true : false;
        var menu_wraper = $("#menu_wraper").find('.sidebar_wrap');
        if(isShortcutMenu) {
            if (activeItem.hasClass('open-option-flyout')) {
                activeItem = menu_wraper.find('a[data-property="'+activeItem.find('a').attr('data-property')+'"]').parent();
            } else {
                activeItem = menu_wraper.find('a[onclick="'+activeItem.attr('onclick')+'"]');
            }
        }
        return activeItem
    }
    function updateActiveList(col_data, save_type, node_id, changeStatus) {

        UtilityModule.localStorageRemoveItems(['save_deal', 'save_status', 'new_deal_id', 'new_deal_instance_id']);
        var detailWwrapper = $("#id_detail_content");
        if (detailWwrapper.find('form:visible').length) {
            detailWwrapper.find('form:visible').remove();
        }
        var listId = $("#id_listing_body");
        if (save_type == 'edit') {
            var search_string = searchModule.getSearchString();
            if (search_string !== '') {
                searchModule.searchString(search_string);
            } else {
                var activeRow = listId.find('div[data-node-id=' + node_id + ']');
                if (changeStatus == 1) {
                    if (activeRow.length) {
                        activeRow.remove();
                    } else {
                        listId.find('div.active-tr').remove();
                    }

                    var activeItem = $('#page_plugin_menu_item_list ul.item-list [data-statusid].active');
                    // var activeItem = routeAfterAddDeal();
                    if (activeItem.hasClass('open-option-flyout')) {
                        // if flyout action menu
                        getFilterList(this, activeItem.find('a').data('title'), activeItem.data('statusid'), "");
                    } else {
                        // if normal action menu
                        activeItem.find('[data-title]').trigger('click');
                    }

                } else {
                    if (activeRow.length) {
                        activeRow.replaceWith(col_data);
                    } else {
                        listId.find('div.active-tr').replaceWith(col_data);
                    }
                    listId.find('div.active-tr').trigger('click');
                }

                UtilityModule.localStorageSetItems([
                    {'save_deal':'yes'},
                    {'save_status':$(col_data).data('savetype')},
                    {'new_deal_id':node_id},
                    {'new_deal_instance_id': $(col_data).data('id')}
                ]);
                applyJs();
                searchModule.addHighlight(listId);
            }
        } else if (save_type == 'add') {
            var activeMenu = $("#li_id_398467");
            if (login_role_id === lookup_role_id_of_bm ) {
                getFilterList('', 'All', activeMenu.data('statusid'), 'li_id_398467');
            } else {
                callGetFilterList();
            }
            UtilityModule.localStorageSetItems([
                {'save_deal':'yes'},
                {'save_status':$(col_data).data('savetype')},
                {'new_deal_id':node_id},
                {'new_deal_instance_id': $(col_data).data('id')}
            ]);
        }
    }

    function callGetFilterList() {
        getFilterList('', searchModule.getActiveMenuValue(), searchModule.getActiveMenuDataId(), searchModule.getActiveManuId());
    }

    function responseListHeader(d, s) {
        $("#id_listing_header").html(d);
    }

    function setTbodyHtLayout() {
        // Listing table set height
        var winHT = $(window).height();
        var listingMPHT = $('.tp-actn-bar').outerHeight() + $('.listing-table-head').outerHeight() + $('.list-bottom').outerHeight()
        var availHT = winHT - listingMPHT;
        $('.set-tbody-HT').height(availHT);
    }
    function getText(textString,character1,character2){
        var start_pos = textString.indexOf(character1) + 1;
        var end_pos = textString.indexOf(character2,start_pos);
        return textString.substring(start_pos,end_pos)
    }
    function responseListContent(response, s, extra_params) {
        var d = response;
        UtilityModule.localStorageRemoveItems(['save_deal', 'save_status', 'new_deal_id', 'new_deal_instance_id']);
        var listId = $("#id_listing_operation:visible").length ? $("#id_listing_operation") : $("#id_listing_body");
        listId.html(d);
        filterActiveOnStatus(current_list_status);
        if (listId.find('.noEntry').length > 0) {
            var tempText = getText(listId.find('.noEntry').text(),'"','"');
            if (tempText === 'Capped') {
                GoToPageModule.loadPageDealAll(tempText);
            }
        }
        searchModule.addHighlight(listId);
        searchModule.properties.cache.searchCount = total_record_of_plugin_list || 0;
        if (searchModule.properties.cache.searchString) {
            searchModule.appendSearchFilter(searchModule.properties.activeItemListLi);
        }
        //Update Menu Count
        updateMenuCount();

        /**
         * [customScroll description] scroll the scrollbar to active row.
         */
        setTimeout(function () {
            $('#id_listing_body').find('.customScroll:first').mCustomScrollbar("scrollTo", $("#id_listing_body").find('.active-tr'));
        }, 500);

        if(typeof extra_params == 'undefined' || typeof extra_params == 'object') {
            //When "Create Deal" is clicked from inboxMenuName.toLowerCase() page then do not execute below functions.
           if($("#leftMenuBar").find('.active').find('.section-id').attr('data-section-id') == inboxMenuName.toLowerCase()) {
                return true;
            }
            /* Start Pagination */
            paginationOfPluginList();
            /* End Pagination */
            hideFullLoader('listing_loader');
            var activeTr = listId.find('.active-tr');
            var instance_id = activeTr.attr('data-id');

            renderViewDetails(activeTr, instance_id, 'view');
            applyJs();
        }
    }

    function listPage(value) {
        var record_per_page = getRecordPerPageValue();
        window.sessionStorage.setItem("record_per_page", record_per_page);
        var ajaxParams = getAjaxParams({
            'action': 'list_content',
            'list_head_array': list_head_array,
            'list_setting_array': list_setting_array,
            'list_node_id_array': list_node_id_array,
            'record_per_page': record_per_page,
            'page': curpage,
        });
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxParams).then(responseListContent);
        });
        // $.post(base_plugin_url + 'code.php', ajaxParams, responseListContent, 'html');
    }

    function getRecordPageDetail(curObj, page) {
        if (searchModule.checkAddEditForm($(curObj)) == false) {
            $('.item-list li.active a').trigger('click');
            return false;
        }
        var record_per_page = getRecordPerPageValue();
        window.sessionStorage.setItem("record_per_page", record_per_page);
        if (page == 1) {
            curpage = 1;
            $('.pagination.pagination-sm li a span').removeClass('current').not('.move-prev,.not-next,.move-next').first().addClass('current');
        } else {
            curpage = curObj;
        }
        var callback_params = {
            data: '',
            callback: function () {
                var ajaxParams = getAjaxParams({
                    'action': 'list_content',
                    'list_head_array': list_head_array,
                    'list_setting_array': list_setting_array,
                    'list_node_id_array': list_node_id_array,
                    'record_per_page': record_per_page,
                    'head_filter': getHeadFilterArr(),
                    'page': curpage,
                    'status': searchModule.getActiveMenuValue(),
                    'propertyId': searchModule.getActiveMenuDataId(),
                    'search_string': searchModule.getSearchString(),
                    'list_mapping_id_array': list_mapping_id_array,
                    'login_user_id': login_user_id,
                    'pagination_record_array': pagination_record_array,
                    'roleId': login_role_id,
                });
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxParams).then(responseListContent);
                });
                // $.post(base_plugin_url + 'code.php', ajaxParams, responseListContent, 'html');
            }
        };
        showFullLoader('listing_loader', callback_params);
    }

    function getRecordPerPageValue() {
        var record_per_page = $('#content_wraper .pagination-select').find('option:selected').val();
        return (record_per_page == undefined || record_per_page == "") ? default_per_page : record_per_page;
    }

    function paginationOfPluginList(return_promise, settings) {
        var searchString = $.trim($("#search-text-box,.search-item-wrap input[type='text']").val());
        var ajaxParams = getAjaxParams({
            'action': 'list_pagination',
            'total_record': total_record_of_plugin_list,
            'record_per_page': getRecordPerPageValue(),
            'page': curpage,
            'searchString': searchString,
            'pagination_record_array': pagination_record_array
        });
        if (leftNavigationModule.hasFilterApplied()) {
            ajaxParams.searchString = '_'; // it is passed just to show 'Clear filter icon' in pagination section. It has no other purpose.
        } else {
            //on page load, now filtered records display. Find out which filter has been applied. If applied then update below variable accordinly.
            var activeRow = $("#id_listing_body").find('.active-tr');
            var rowSettings = {};
            if(activeRow.length) {
                rowSettings = activeRow.data('settings');
            } else {
                activeRow = $("#id_listing_body").find('.no-record-js');
                if(activeRow.length) {
                    rowSettings = activeRow.data('settings');
                }
            }
            if (typeof rowSettings != 'undefined' && typeof rowSettings.status != 'undefined' && rowSettings.status.toLowerCase() != 'all') {
                ajaxParams.searchString = '_'; // it is passed just to show 'Clear filter icon' in pagination section. It has no other purpose.
            }
        }
        if (typeof dataSettings != 'undefined' && jQuery.isPlainObject(dataSettings)) {
            if (dataSettings.recordPerPage) {
                ajaxParams.record_per_page = dataSettings.recordPerPage;
            }
        }
        if(return_promise === true) {
            if(typeof settings != 'undefined') {
                ajaxParams = $.extend(ajaxParams, settings);
            }
            return ActionModule.ajax(ajaxParams, {dataType: 'html'});
        }
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, ajaxParams).then(responseListPagination);
        });
        // $.post(base_plugin_url + 'code.php', ajaxParams, responseListPagination, 'html');
    }

    function responseListPagination(d, s) {
        var tempPaginationContainer = $("#temp_pagination");
        if (!(tempPaginationContainer.length)) {
            tempPaginationContainer = $('<div />').attr('id', 'temp_pagination').css('display', 'none');
            $('body').append(tempPaginationContainer);
        }
        tempPaginationContainer.html(d);
        setTimeout(function () {
            UtilityModule.shortifyPagination(d);
        }, 100);
        setTimeout(function () {
            applyJs();
            $('[data-toggle="tooltip"]').tooltip({
                trigger: "hover"
            });
        }, 4000);
    }

    function adjustWindowHeight() {
        paneMidHt();
        resizeHT();
        threePane();
        setTbodyHt();
    }

    function renderViewDetails(curObj, instance_id, display_type, return_promise) {
        if (display_type == 'view' && form_container !== '_flyout') {
            if (searchModule.checkAddEditForm($(curObj)) == false) {
                return false;
            } else {

                $(curObj).siblings('.row').removeClass('active-tr')
                $(curObj).addClass('active-tr')
                htmlModule.resetBlankRow();
            }
        }
        form_action_type = display_type;
        var options = {
            data: {
                'action': 'content_form',
                'display_type': display_type,
                'add_form_instance_id': add_instance_id_of_content,
                'instance_id': instance_id,
                'heading': content_head,
                'login_role_id': login_role_id,
                //'canDealEdit': canDealEdit,
                'form_container': form_container,
                'login_user_id': login_user_id,
            },
            callback: responseContentForm,
            dataType: 'json'
        };

        if (typeof dataSettings != 'undefined' && dataSettings['data-id']) {
            if (form_container == '_dashboard' && display_type == 'add')
                options.data.instance_id = add_instance_id_of_content;
            else
                options.data.instance_id = dataSettings['data-id'];
        }

        var loaderId = '';
        if (parseInt(page_plugin_counter) == 0 && form_container == '') {
            page_plugin_counter = 1;
            loaderId = 'full_page_loader';
        }
        if (is_role_assoc != '1') {
            loaderId = 'content_loader';
            if (form_container == '_flyout' || form_container == '_dashboard') {
                loaderId = 'content_loader_dashboard';
            }
            if (display_type == "add") {
                $("#li_id_" + delete_deal_menu_instance_id).addClass('inactive');
            } else {
                roleWiseAddDeal();
            }
        }
        if (!($(curObj).hasClass('j_my_createDeal_open'))) {
            DocDualPaneAnmate();
        }

        if(return_promise === true) {
            return ActionModule.ajax(options.data, {dataType: options.dataType});
        }

        if (loaderId.length) { // means one of the above conditions has matched
            var callback_params = {
                data: options,
                callback: PageModule.loadDetailPanel.bind(PageModule)
            };
            showFullLoader(loaderId, callback_params);
        } else {
            PageModule.loadDetailPanel(options);
        }
    }

    function hideShowDialougeIcon() {
        $(".other-then-deal").addClass('hide');
        var eleAdd = $(".dialogueJs,.detailJs,.documentJs,.operation-btn,.j_my_esign_open");
        if (checkPPCurl()) {
            eleAdd.removeClass('hide');
            $(".workspace-action").addClass('inactive');
        }
    }

    function responseContentForm(d, s) {

        setTimeout(function() {
            if(d.message != '')
            {
                if (form_container == '_flyout') {
                    form_container = '_dashboard'
                }
                var loaderId = $('#full_page_loader').is(":visible") ? 'full_page_loader' : 'content_loader';
                if (form_container == '_dashboard') {
                    loaderId = 'content_loader_dashboard';
                }

                $.keep_showing_full_page_loader = false;
                globalVar.dealFilterCheck = false; // delete deals loader issue fixed
                hideFullLoader(loaderId);

                bootbox.alert(d.message);
                goAhead=false;
                htmlModule.resetBlankRow();
                return false;
            }
            else
            {
                // Use for check form is in add/edit/view mode
                var addMenuListDiv = $('#addMenuListDiv');
                handleControlLayout();
                window.control_response = d;
                localStorage.setItem('display_type', d.display_type);
                if (form_container == '_flyout') {
                    form_container = '_dashboard'
                }
                var detailWrapper = $("#id_detail_content" + form_container);
                $("#id_detail_head" + form_container).html(d.head);
                $("#id_detail_tooltip" + form_container).html(d.tooltip);
                if (form_action_type == "edit") {
                    $("#li_id_" + delete_deal_menu_instance_id).addClass('inactive');
                }
                detailWrapper.html(d.content_detail);
                var actionHtml = d.actions;
                if (d.display_type == 'view' && login_role_id == '454674' && typeof d.RAactions != 'undefined' && parseInt(detailWrapper.find("#node_class_id").val()) == 655) {
                    actionHtml = actionHtml + d.RAactions;
                }

                $("#id_detail_actions" + form_container).html(actionHtml);

                //For Control Management
                if (parseInt(detailWrapper.find("#node_class_id").val()) == 853 && d.display_type != 'view') {
                    $("#instance_property_caption8444").addClass("controlMainDropdownClass");
                    $("#instance_property_caption8448").addClass("controlOperationDropdownClass commonControlRoleClass");
                    $("#instance_property_caption8440").addClass("controlPassDealDropdownClass commonControlRoleClass");
                    $("#instance_property_caption8444,#instance_property_caption8448,#instance_property_caption8440").html(d.roleDD);
                    $('#instance_property_caption8448,#instance_property_caption8440').find('option').removeAttr('data-settings');
                }
                //For Control Management
                if (d.hasOwnProperty('content_values')) {
                    var display_type = d.display_type;
                    editFormSetValues2(d.content_values, display_type, d.tree);
                } else {
                    detailWrapper.find(":file").filestyle();
                }
                htmlModule.fillBlankRow();
                applyJs();
                searchModule.addHighlight(detailWrapper.find('.col-sm-8'));
                var loaderId = $('#full_page_loader').is(":visible") ? 'full_page_loader' : 'content_loader';
                if (form_container == '_dashboard') {
                    loaderId = 'content_loader_dashboard';
                }
                if (typeof d.rolePhase != 'undefined' && d.rolePhase != "") {
                    role_phase = d.rolePhase;
                }
                adjustWindowHeight();

                setTimeout(function () {
                    fileValidation();
                    // code for disabled calender in readonly mode
                    $( ".datepicker.metrozone[readonly]").off();
                }, 2000);

                setTimeout(function () {
                    $('.show-confirmation').off('click').on('click', function () {
                        var clicked_element = $(this);
                        if (clicked_element.attr('data-href')) {
                            $(clicked_element.attr('data-href')).modal('show');
                        }
                    });
                    bindClick();
                    if (form_action_type == "view") {
                        var container = detailWrapper;
                        if (!detailWrapper.find("#instance_property_caption3224").length)
                            container = $('#j_my_createDeal_wrapper');
                        var spans = [
                            3208,3228,3229,3230,3231,3287,6805,6802,6803,3210,3211,3212,3240,9099,6800,3241,3242,3243,3213,
                            3216,6222,6223,3218,3219,3220,3221,3224,8383,8384,8385,8386,8387,8388,8389,8390,8391,8392,8393
                        ];
                        UtilityModule.updateAutoFieldElements(container, spans, {m: 'addClass', v: 'auto-field'});
                    }
                    checkEmpty('.business-name');
                }, 100);

                if (typeof dataSettings != 'undefined' && dataSettings['data-id']) {
                    var container = $('#id_listing_body');
                    container.find('.active-tr').removeClass('active-tr');
                    container.find('div[data-id="' + dataSettings['data-id'] + '"]').addClass('active-tr');
                    $.propertyId = dataSettings['propertyId'];
                    $.status = dataSettings['status'];
                    $('#id_listing_body').find('.customScroll:first').mCustomScrollbar("scrollTo", $("#id_listing_body").find('.active-tr'));
                }
                if (is_role_assoc == '1') {
                    form_action_type = 'view';
                    getRolesOfPlugin('1');
                }

                //If 'Deal Info' flyout is hidden then only clear dataSettings, otherwise when user goes to 'Deals' page using breadcrumb link then applied filters are gone.
                var dealInfoFlyoutVisibility = $('[id="j_my_createDeal"]').css('visibility').toLowerCase();
                if(dealInfoFlyoutVisibility == 'hidden') {
                    dataSettings = {};
                }

                if (parseInt(detailWrapper.find("#node_class_id").val()) == 655) {
                    /* Buyer Section */
                    var addClass = {m: 'addClass', v: 'metrozone'};
                    var addAttr = {m: 'attr', v: {readonly: true}};
                    var methods = [addClass, addAttr];
                    var elements = {
                        3208: methods,3210: methods,3211: methods,3212: methods,
                        3240: methods,9099: methods,6800: methods,3241: methods,3242: methods,
                        3243: methods,3213: methods,6222: methods,6223: methods,
                        3216: methods,3218: methods,3219: methods,3220: methods,
                        3221: methods,3224: methods,3229: methods,3230: methods,
                        3231: methods,3287: methods,6805: methods,6802: methods,
                        6803: methods,8383: methods,8384: methods,8385: methods,
                        8386: methods,8387: methods,8388: methods,8389: methods,
                        8390: methods,8391: methods,8392: methods,8393: methods
                    };
                    var elementContainer = detailWrapper;
                    UtilityModule.updateCaptionElement(elementContainer, elements);

                    if (login_role_id === lookup_role_id_of_bm || login_role_id === lookup_role_id_of_admin) {
                        checkAndMakeActive(['#instance_property_caption3228 ~ .list-view-detail'],'.j_my_search_open[data-params="FI"]',true);
                        checkAndMakeActive(['#instance_property_caption3210 ~ .list-view-detail'],'.j_my_search_open[data-params="CUSTOMER"]',true);
                        checkAndMakeActive(['#instance_property_caption8383 ~ .list-view-detail'],'.j_my_search_open[data-params="COBUYER"]',true);
                        checkAndMakeActive(['#instance_property_caption3216 ~ .list-view-detail'],'.j_my_search_open[data-params="STOCK"]',true);
                    }
                    if (display_type === 'add' || display_type === 'edit') {
                        checkForBMandAdmin();
                        onEnterKeyPress(['#instance_property_caption3228','#instance_property_caption6807'], '#fi_quote_button'); //Fi Quote Input Enter
                        onEnterKeyPress(['#instance_property_caption3210'], '#customer_info_button'); //Customer Input Enter
                        onEnterKeyPress(['#instance_property_caption3216'], '#unit_info_button'); //Boat Input Enter

                        if (login_role_id === lookup_role_id_of_sc || login_role_id === lookup_role_id_of_bc) {
                            detailWrapper.find("#instance_property_caption3228").attr('readonly', true).addClass('disabled-input');
                        } else if (login_role_id === lookup_role_id_of_bm) {
                            detailWrapper.find("#instance_property_caption3228").attr('readonly', false).removeClass('disabled-input');
                        }
                        checkAllEmptyInputs();
                        $('input[readonly]').on('focus', function(){
                            $(this).blur();
                        });
                        // code for disabled calender in readonly mode
                        $( ".datepicker.metrozone[readonly]").off();
                    } else { // Showing eye-ball on view mode
                        $('.list-view-detail').not('.hide').not('.auto-field').each(function () {
                            if ($(this).text().trim() !== '') {
                                $(this).siblings('.validationCheck').val($(this).text().trim()); //Putting value in hidden inputs for ajax request
                            }
                        });
                        if (detailWrapper.find("#instance_property_caption8383").val() === '') {
                            $('#editCoBuyer').siblings('a[href="#editCoBuyer"]').trigger('click');
                        }
                    }
                    commonCollapseExpand('.form-horizontal', '.validationCheck');

                    /* FI Quote Field and FI Quote Lookup button, on Deal Detail Screen will be greyed out for all users except Business Manager.*/
                    if (parseInt(login_role_id) != parseInt(lookup_role_id_of_bm)) {
                        $('#fi_quote_button').siblings('span.list-view-detail').addClass('auto-field');
                    }
                    /*End Here*/
                    autosize($('textarea'));
                }
                if (parseInt(detailWrapper.find("#node_class_id").val()) != 655) {
                    hideShowDialougeIcon();
                }
                if (parseInt(detailWrapper.find("#node_class_id").val()) == 819) {
                    detailWrapper.find("#instance_property_caption7986").addClass('metrozone').attr('readonly', true);
                }
                addLocation();

                if (is_flyout_open == 'Y') {
                    is_flyout_open = 'N';
                    form_container = '';
                }
                /* Code By Arvind Soni And Suggest By Anjali Sharma*/

                if ((d.display_type === 'add' || d.display_type === 'edit')) {
                    if ($('#jq_search_wrapper').length === 1) {
                        $('#jq_search_wrapper').appendTo('body');
                    } else {
                        $('#jq_search').flyout({
                            type: 'overlay',
                            horizontal: 'right',
                            slideDirection: 'right'
                        });
                    }
                }
                if (parseInt(detailWrapper.find("#node_class_id").val()) == 655) {
                    if ((d.display_type === 'add' || d.display_type === 'edit')) {
                        $('#fi_quote_button').closest('.input-btn-group').removeClass('input-icon');
                    }
                    else{
                        $('#fi_quote_button').closest('.input-btn-group').addClass('input-icon');
                    }
                }
                // store form's current state.
                if (checkPPCurl()) {
                    var documentBtn = $("#id_detail_tooltip").find('.documentJsBtn');
                    (d.activate_document_btn === true) ? documentBtn.removeClass('inactive') : documentBtn.addClass('inactive');
                    htmlModule.properties.cache.operatioForm = htmlModule.getFormData();
                }

                if (parseInt(detailWrapper.find("#node_class_id").val()) == 853 && d.display_type != 'view') {
                    var getMainClassID = $(".controlMainDropdownClass").val();
                    $(".commonControlRoleClass option[value='"+getMainClassID+"']").attr("disabled",true);
                    if(d.display_type=="add") {
                        $(".commonControlRoleClass").find("option:eq(1)").attr("selected",true);
                        $(".commonControlRoleClass").closest(".list-detail-section").addClass("roleCloneContainer");
                    } else {
                        $(".commonControlRoleClass").closest(".modified").addClass("roleCloneContainer");
                        $(".roleCloneContainer").each(function() {
                            var getFieldVal = $(this).find(".commonControlRoleClass").val();
                            $(this).nextAll().find(".commonControlRoleClass option[value='"+getFieldVal+"']").attr("disabled",true);
                        });
                    }
                }

                // Code here add sub class  status for role RA, RM ,COntroller and Director in status Field // view/edit action
                if(parseInt(login_role_id) == parseInt(lookup_role_id_of_ra) || parseInt(login_role_id) == parseInt(lookup_role_id_of_rm) || parseInt(login_role_id) == parseInt(lookup_role_id_of_controller) || parseInt(login_role_id) == parseInt(lookup_role_id_of_director) || parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){
                    if($("#instance_property_caption"+deal_status_prop_id).val() == 'Posting' || $("#instance_property_caption"+deal_status_prop_id).val() == 'Final Sale') {
                        var main_status = $("#instance_property_caption"+deal_status_prop_id).val();
                        if($("#instance_property_caption"+deal_sub_status_prop_id).val().length) {
                            main_status += ' - '+$("#instance_property_caption"+deal_sub_status_prop_id).val()
                        }
                        if(d.display_type == 'view'){
                            $("#instance_property_caption"+deal_status_prop_id).siblings('span').html(main_status);
                        }
                        if(d.display_type == 'edit'){
                            $("#instance_property_caption"+deal_status_prop_id).val(main_status);
                        }
                    }
                    if(parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){
                        $(".j_my_search_open").removeClass('inactive');
                    }
                    updateDealStatusSubStatus();
                }
                FIQuoteModule.toggleRefreshDealButton(d.display_type,detailWrapper);

                if (d.checkVal == 1) {
                    setTimeout(function () {
                        callDetailsContentAction('P');
                    }, 1000);
                } else {
                    var listingBodyEle = $('#id_listing_body');
                    $.keep_showing_full_page_loader = false;
                    if($("#dashboardViewPane:visible").length) {
                        globalVar.dealFilterCheck = false; // delete deals loader issue fixed
                    }
                    if(!listingBodyEle.find('.no-record-js').length) {
                        globalVar.dealFilterCheck = false; // delete deals loader issue fixed
                    }
                    hideFullLoader(loaderId);
                }
                if(d.display_type === 'add') {
                    callMethod('#cls_822_858, #cls_822_858 .list-detail-section:first', 'addClass', 'hide');
                }
                var $locationSearchField = $("#instance_property_caption7988");

                if(d.display_type === 'edit' && $locationSearchField.length) {
                    setSearchAttr($locationSearchField)
                    cloneRoleButton();
                    setReadOnly();
                }
                return d;

            }
        }, 1500);
    }


    function onEnterKeyPress(targetInputArr, targetSubmit) {
        $.each(targetInputArr,function(i,targetInput){
            $(targetInput).on('keypress', function (e) {
                if (e.which === 13 ) {// the enter key code & input not blank
                    triggerClick(targetInputArr, targetSubmit);
                }
            });
        });
    }

    function triggerClick(targetInputArr, targetSubmit){
        var tempTextVal = {};
        $.each(targetInputArr,function(i,targetInput){
            tempTextVal[targetInput] = $(targetInput).val();
        });
        if(checkObject(tempTextVal)){
            $(targetSubmit).trigger('click');
            return false;
        } else {
            return false;
        }
    }

    function onInputChange(selector, func, onlyKeyUp) {
        if (onlyKeyUp)
            $(selector).on('keyup', func)
        else
            $(selector).on('keyup blur', func)
    }

    function remInputsOnEmptyFiQuoute() {
        if ($(this).val().trim().length === 0 && !$(this)[0].readOnly) {
            $('#instance_property_caption3229').val('');
            $('#instance_property_caption3231').val('');
            $('#instance_property_caption3287').val('');
            $('#instance_property_caption6805').val('');
            $('#instance_property_caption6803').val('');
            $('#instance_property_caption6802').val('');
        }
    }

    function checkAllEmptyInputs() {
        checkForBMandAdmin();
    }
    function checkForBMandAdmin(){
        if (login_role_id === lookup_role_id_of_bm || login_role_id === lookup_role_id_of_admin) {
            makeActiveOnInputChange(['#instance_property_caption3228','#instance_property_caption6807'],'#fi_quote_button');
            makeActiveOnInputChange(['#instance_property_caption3228','#instance_property_caption6807'],'.j_my_search_open[data-params="FI"]');
            checkAndMakeActive(['#instance_property_caption3228','#instance_property_caption6807'],'#fi_quote_button',false);
            checkAndMakeActive(['#instance_property_caption3228','#instance_property_caption6807'],'.j_my_search_open[data-params="FI"]',false);
            checkAndMakeActive(['#instance_property_caption3210'],'.j_my_search_open[data-params="CUSTOMER"]',false);
            checkAndMakeActive(['#instance_property_caption8383'],'.j_my_search_open[data-params="COBUYER"]',false);
            checkAndMakeActive(['#instance_property_caption3216'],'.j_my_search_open[data-params="STOCK"]',false);
        }
    }
    function makeActiveOnInputChange(inputSelectorArr,targetSelector){
        $.each(inputSelectorArr,function(i,inputSelector){
            $(inputSelector).on('keyup blur', function(){
                checkAndMakeActive(inputSelectorArr,targetSelector,false);
            });
        });
    }

    function checkAndMakeActive(inputSelectorArr,targetSelector,span){
        var tempTextVal  = {};
        if(!span){
            $.each(inputSelectorArr,function(i,inputSelector){
                tempTextVal[inputSelector] = $(inputSelector).val().trim();
            });
        } else {
            $.each(inputSelectorArr,function(i,inputSelector){
                tempTextVal[inputSelector] = $(inputSelector).text().trim();
            });
        }
        if(checkObject(tempTextVal)){
            remInActive(targetSelector);
        } else {
            addInActive(targetSelector);
        }
    }

    function checkObject(obj){
        var my_arr = Object.keys(obj);
        for(var i=0;i<my_arr.length;i++){
            if(obj[my_arr[i]] === "")
                return false;
        }
        return true;
    }

    function addInActive(selector, both) {
        $(selector).addClass('inactive');
        if (both) {
            $(selector).removeClass('active');
        }
    }

    function remInActive(selector, both) {
        $(selector).removeClass('inactive');
        if (both) {
            $(selector).addClass('active');
        }
    }

    function addLocation() {
    }

    //Shanti code starts here
    /**
     * Delete instance Global function
     * @type String
     *
     */
    function modifySettings() {
        var container = $('#id_listing_body');
        var activeRow = container.find('.active-tr');
        var totalRows = container.find('.row:visible');
        var activeRowSettings = activeRow.data('settings');
        var activeRowIndex;
        var newRowSettings;

        if (totalRows.length == 1) { // if there is only one record then take user to the first page
            activeRowSettings = $.extend(activeRowSettings, {'page': 1, 'data-id': '', 'data-node-id': ''});
        } else {
            activeRowIndex = totalRows.index(activeRow);
            if (activeRowIndex === 0) { // if deleted row is the first item in the list then make immediate next item Highlighted
                newRowSettings = activeRow.next().data('settings');
            } else {
                newRowSettings = totalRows.filter(':first').data('settings');
            }
            activeRowSettings = $.extend(activeRowSettings, {
                'data-id': newRowSettings['data-id'],
                'data-node-id': newRowSettings['data-node-id']
            });
        }
        return activeRowSettings;
    }

    function deleteItemInstance(instance_id, action) {
        var txt;
        bootbox.confirm({
            title: 'Confirm',
            message: "Are you sure you want to delete ?",
            callback: function (result) {
                if (result) {
                    dataSettings = modifySettings();
                    var callback = function (response) {
                        getListHeaders(); // get list header using ajax and then call "responseListHeader()" function"
                        getListContent(); // get list content using ajax and then call "responseListContent()" function"
                    };
                    var ajaxModule = new AjaxModule();
                    var data = {
                        'action': action,
                        'instance_id': instance_id
                    };
                    showFullLoader('full_page_loader');
                    var settings = {
                        dataType: 'json'
                    };
                    ajaxModule.ajaxPromise(settings, data).then(callback);
                }
            }
        });
    }

    function responseDeleteItem(data) {
        resetAllFilters();
    }

    function editFormSetValues(data, display_type) {
        var nid = data.node_instance_id;
        var detailContentContainer = $("#id_detail_content" + form_container);
        var checkBoxWrapper = detailContentContainer.find("div[id='checkbox_wrapper']");
        var radioWrapper = detailContentContainer.find("div.input-radio").parent('#radio_wrapper');
        var calenderWrapper = detailContentContainer.find('#calender_wrapper');
        detailContentContainer.find('#id_detail_instance_id').val(nid);
        var res = data.values;
        if (display_type === 'edit' || display_type == 'add') {
            applyDatePicker();
            detailContentContainer.find(":file").filestyle();
        }
        for (var key in res) {
            if (display_type === 'view') {
                detailContentContainer.find('button.j_my_search_open').addClass('hide');
                detailContentContainer.find('a.j_my_search_open').addClass('hide');
                detailContentContainer.find('button.search_not_open').addClass('hide');
                if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                    if(detailContentContainer.find('#instance_property_caption' + res[key].id).parent('#calender_wrapper').length>0){
                        detailContentContainer.find('#instance_property_caption' + res[key].id).parent('#calender_wrapper').siblings('span.list-view-detail').html(res[key].val);
                        detailContentContainer.find('#instance_property_caption' + res[key].id).parent('#calender_wrapper').siblings('span.list-view-detail').removeClass('hide');
                    }else{
                        detailContentContainer.find('#instance_property_caption' + res[key].id).siblings('span.list-view-detail').html(res[key].val);
                        detailContentContainer.find('#instance_property_caption' + res[key].id).siblings('span.list-view-detail').removeClass('hide');
                    }
                    detailContentContainer.find('#instance_property_caption' + res[key].id).addClass('hide');
                } else if (detailContentContainer.find('#filenodeZ' + res[key].id).length) {
                    var link = '';
                    if (res[key].val !== null && res[key].val !== '') {
                        var fileName = res[key].val.split(/_(.+)?/)[1];
                        link = '<a href="' + res[key].val + '" class="remote_download_link" download="' + fileName + '">' + fileName + '</a>';
                    }
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').html(link);
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').removeClass('hide');
                    detailContentContainer.find('#filenodeZ' + res[key].id).addClass('hide');
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('div.bootstrap-filestyle').addClass('hide');
                }
                //Shanti code starts here

                radioWrapper.addClass('hide');
                checkBoxWrapper.addClass('hide');
                calenderWrapper.addClass('hide');
                if (res[key].val != null) {
                    var colonStr = res[key].val.indexOf(":");
                    if (res[key].val.split('/').length > 1 && colonStr == -1) {
                        $("input[id='instance_property_id" + res[key].id + "']").siblings('span.list-view-detail').html(res[key].val).removeClass('hide');
                    }
                    if (radioWrapper.length > 0 || checkBoxWrapper.length > 0) {
                        radioWrapper.addClass('hide');
                        checkBoxWrapper.addClass('hide');
                        calenderWrapper.addClass('hide');
                        if (res[key].val.split('~#~').length > 1) {
                            var chkVal = res[key].val.split('~#~');
                            for (var i = 0; i <= chkVal.length; i++) {
                                detailContentContainer.find("input[type='checkbox'][value='" + chkVal[i] + "']").attr('checked', 'checked')
                            }
                            var res_array = res[key].val.split("~#~");
                            var tempwrapper = '';
                            $.each(res_array, function(key, value){
                                var clsvalue = value.replace(new RegExp(' ', 'g'), '_');
                                tempwrapper += '<div class="'+clsvalue+'">'+value;
                                tempwrapper += '</div>';
                            });
                            detailContentContainer.find("input[id*='check_" + res[key].id + "']").parents('div#checkbox_wrapper').siblings('span.list-view-detail').html(tempwrapper).removeClass('hide');

                        } else {
                            detailContentContainer.find("input[type='checkbox'][value='" + res[key].val + "']").attr('checked', 'checked');

                            var res_array = res[key].val.split("~#~");
                            var tempwrapper = '';
                            $.each(res_array, function(key, value){
                                var clsvalue = value.replace(new RegExp(' ', 'g'), '_');
                                tempwrapper += '<div class="'+clsvalue+'">'+value;
                                tempwrapper += '</div>';
                            });

                            if (!(res[key].val === "Yes") && $("div.no-hull").length == 0) {
                                $("input[id='instance_property_id" + res[key].id + "']").siblings('div').siblings('span.list-view-detail').html(tempwrapper).removeClass('hide');
                            }
                            detailContentContainer.find("input[type='checkbox'][value='" + res[key].val + "']").parents('div#checkbox_wrapper').siblings('span.list-view-detail').html(tempwrapper).removeClass('hide');
                            detailContentContainer.find("#radioVal_" + key).attr('checked', 'checked');
                        }
                    }
                }
                //shanti code ends here.
                var form = detailContentContainer.find('form');
                form.replaceWith('<div class="' + form.attr('class') + '">' + form.html() + '</div>');

            } else {
                detailContentContainer.find('button.j_my_search_open').removeClass('hide');
                detailContentContainer.find('a.j_my_search_open').removeClass('hide');
                detailContentContainer.find('button.search_not_open').removeClass('hide');

                if (display_type === 'edit') {
                    if (res[key].val != null) {
                        if (radioWrapper.length > 0 || checkBoxWrapper.length > 0) {
                            if (res[key].val == "Yes" && $("div.no-hull").length > 0) {
                                $('#j_my_privacydocument,#j_my_instruction').flyout({type: 'overlay', horizontal: 'right', slideDirection: 'right'});
                            }
                            if (res[key].val.split('~#~').length > 1) {
                                var chkVal = res[key].val.split('~#~');
                                for (var i = 0; i <= chkVal.length; i++) {
                                    detailContentContainer.find("input[type='checkbox'][value='" + chkVal[i] + "']").attr('checked', 'checked');
                                }
                                detailContentContainer.find("#check_" + res[key].id + "_" + key).parent('div#checkbox_wrapper').siblings('span.list-view-detail').addClass('hide');
                                checkBoxWrapper.removeClass('hide');
                            } else {
                                detailContentContainer.find("input[type='checkbox'][value='" + res[key].val + "']").attr('checked', 'checked');
                                $("input[name=instance_property_caption" + res[key].id + "]").parent('div').removeClass('hide');
                                $("input[name='instance_property_caption" + res[key].id + "[]'][value='" + res[key].val + "']").attr('checked', 'checked')
                                $("#id_detail_conten" + form_container + "t input[type='radio'][value='" + res[key].val + "']").attr('checked', 'checked')
                                $('div#radio_wrapper').siblings('span.list-view-detail').html(res[key].val).addClass('hide');
                            }
                        }
                    }
                    // Shanti code ends here
                    if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                        detailContentContainer.find('#instance_property_caption' + res[key].id).val(res[key].val);
                    } else if (detailContentContainer.find('#filenodeZ' + res[key].id).length) {
                        detailContentContainer.find('#filenodeZ' + res[key].id).siblings('div.bootstrap-filestyle').find('.form-control').prop("disabled", false).val(res[key].val).attr('name', 'fileZvalue' + res[key].id);
                        detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').html(res[key].val);
                        detailContentContainer.find('#filenodeZ' + res[key].id).addClass('hide');
                        detailContentContainer.find('.fileZReset').removeClass('hide');
                        $("#id_detail_content").on('click', '.fileZReset', function () {
                            $(this).removeClass('hide');
                            $(this).siblings('.bootstrap-filestyle').find('.form-control').val('');
                            $(this).parents('div.col-sm-8').find('input.nodeZinput').val('');
                        });
                    }
                } else {
                    if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                        detailContentContainer.find('#instance_property_caption' + res[key].id).val(res[key].val);
                        detailContentContainer.find('#instance_property_caption' + res[key].id).attr('readonly', true);
                    }
                }
            }
        }
        $(".checkboxdiv div").each(function(key,val){
            var isExist=$('input[value="'+$(this).text()+'"]').parent().siblings('div.ids-map-textfield').find('span.list-view-detail').html();
            if(typeof isExist !='undefined'){
                $(this).append('<span class="view-ids-map">'+ $('input[value="'+$(this).text()+'"]').parent().siblings('div.ids-map-textfield').find('span.list-view-detail').html() + '</span>');
            }
        });
        toggleHinDetails(display_type);
        /* Code For Operation File Tag Only*/
        if (display_type == 'add') {
            detailContentContainer.find('input[type="file"]').each(function (index) {
                if ($(this).attr('value') != '' && $(this).attr('value') != undefined) {
                    $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                    $(this).next().find('input[type="text"]:first').attr('value', $(this).attr('value'));
                } else {
                    $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                }
            });
        }
        /* Code By Arvind Soni */
        if (display_type === 'add') {
            search_customer_location = '';
            search_customer_id = '';
            search_stock_id = '';
        } else if (display_type === 'edit') {
            search_customer_location = detailContentContainer.find('#instance_property_caption6807').val();
            search_customer_id = detailContentContainer.find('#instance_property_caption3210').val();
            search_stock_id = detailContentContainer.find('#instance_property_caption3216').val();
        }
    }

    function editFormSetValues2(data, display_type, tree) {
        var nid = data.node_instance_id;

        var detailContentContainer = $("#id_detail_content" + form_container);

        var checkBoxWrapper = detailContentContainer.find('div#checkbox_wrapper');
        var radioWrapper = detailContentContainer.find('#radio_wrapper');
        var calenderWrapper = detailContentContainer.find('#calender_wrapper');
        detailContentContainer.find('#id_detail_instance_id').val(nid);
        var res = data.values;
        if (display_type === 'edit' || display_type == 'add') {
            applyDatePicker();
            detailContentContainer.find(":file").filestyle();
        }
        for (var key in res) {
            if (display_type === 'view') {
                detailContentContainer.find('button.j_my_search_open').addClass('hide');
                detailContentContainer.find('button.search_not_open').addClass('hide');
                if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                    var dropDownVal = res[key].val;
                    if (typeof control_response.roleNames != 'undefined' && typeof control_response.roleNames[dropDownVal] != 'undefined') {
                        res[key].val = control_response.roleNames[dropDownVal];
                    }

                    detailContentContainer.find('#instance_property_caption' + res[key].id).siblings('span.list-view-detail').html(res[key].val);
                    detailContentContainer.find('#instance_property_caption' + res[key].id).siblings('span.list-view-detail').removeClass('hide');
                    detailContentContainer.find('#instance_property_caption' + res[key].id).addClass('hide');
                } else if (detailContentContainer.find('#filenodeZ' + res[key].id).length) {
                    var link = '';
                    if (res[key].val !== null && res[key].val !== '') {
                        var fileName = res[key].val.split(/_(.+)?/)[1];
                        link = '<a href="' + res[key].val + '" class="remote_download_link" download="' + fileName + '">' + fileName + '</a>';
                    }
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').html(link);
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').removeClass('hide');
                    detailContentContainer.find('#filenodeZ' + res[key].id).addClass('hide');
                    detailContentContainer.find('#filenodeZ' + res[key].id).siblings('div.bootstrap-filestyle').addClass('hide');
                }
                //Shanti code starts here
                radioWrapper.addClass('hide');
                checkBoxWrapper.addClass('hide');
                calenderWrapper.addClass('hide');
                if (res[key].val != null) {
                    var colonStr = res[key].val.indexOf(":");
                    if (res[key].val.split('/').length > 1 && colonStr == -1) {
                        $("input[id='instance_property_id" + res[key].id + "']").siblings('span.list-view-detail').html(res[key].val).removeClass('hide');
                    }

                    if (radioWrapper.length > 0 || checkBoxWrapper.length > 0) {
                        radioWrapper.addClass('hide');
                        checkBoxWrapper.addClass('hide');
                        calenderWrapper.addClass('hide');
                        if (res[key].val.split('~#~').length > 1) {
                            var chkVal = res[key].val.split('~#~');
                            for (var i = 0; i <= chkVal.length; i++) {
                                detailContentContainer.find("input[type='checkbox'][value='" + chkVal[i] + "']").attr('checked', 'checked')
                            }
                            detailContentContainer.find("input[id*='check_" + res[key].id + "']").parents('div#checkbox_wrapper').siblings('span.list-view-detail').html(res[key].val.replace(new RegExp('~#~', 'g'), '<br/>')).removeClass('hide');
                        } else {
                            $("input[id='instance_property_id" + res[key].id + "']").siblings('div').siblings('span.list-view-detail').html(res[key].val).removeClass('hide');
                            detailContentContainer.find("#radioVal_" + key).attr('checked', 'checked');
                        }
                    }
                }
                //shanti code ends here.
                var form = detailContentContainer.find('form');
                form.replaceWith('<div class="' + form.attr('class') + '">' + form.html() + '</div>');
            } else {
                detailContentContainer.find('button.j_my_search_open').removeClass('hide');
                detailContentContainer.find('a.j_my_search_open').removeClass('hide');
                detailContentContainer.find('button.search_not_open').removeClass('hide');

                if (display_type === 'edit') {
                    if (res[key].val != null) {
                        if (radioWrapper.length > 0 || checkBoxWrapper.length > 0) {
                            if (res[key].val.split('~#~').length > 1) {
                                var chkVal = res[key].val.split('~#~');
                                for (var i = 0; i <= chkVal.length; i++) {
                                    detailContentContainer.find("input[type='checkbox'][value='" + chkVal[i] + "']").attr('checked', 'checked');
                                }
                                detailContentContainer.find("#check_" + res[key].id + "_" + key).parent('div#checkbox_wrapper').siblings('span.list-view-detail').addClass('hide');
                                checkBoxWrapper.removeClass('hide');
                            } else {
                                detailContentContainer.find("input[type='checkbox'][value='" + res[key].val + "']").attr('checked', 'checked');
                                $("input[name=instance_property_caption" + res[key].id + "]").parent('div').removeClass('hide');
                                $("input[name='instance_property_caption" + res[key].id + "[]'][value='" + res[key].val + "']").attr('checked', 'checked')
                                $("#id_detail_content" + form_container + " input[type='radio'][value='" + res[key].val + "']").attr('checked', 'checked')
                                $('div#radio_wrapper').siblings('span.list-view-detail').html(res[key].val).addClass('hide');
                            }
                        }
                    }
                    // Shanti code ends here
                    if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                        detailContentContainer.find('#instance_property_caption' + res[key].id).val(res[key].val);
                        detailContentContainer.find('#instance_property_caption' + res[key].id).trigger('change');
                    } else if (detailContentContainer.find('#filenodeZ' + res[key].id).length) {
                        detailContentContainer.find('#filenodeZ' + res[key].id).siblings('div.bootstrap-filestyle').find('.form-control').prop("disabled", false).val(res[key].val).attr('name', 'fileZvalue' + res[key].id);
                        detailContentContainer.find('#filenodeZ' + res[key].id).siblings('span.list-view-detail').html(res[key].val);
                        detailContentContainer.find('#filenodeZ' + res[key].id).addClass('hide');
                        detailContentContainer.find('.fileZReset').removeClass('hide');
                    }
                } else {
                    if (detailContentContainer.find('#instance_property_caption' + res[key].id).length) {
                        detailContentContainer.find('#instance_property_caption' + res[key].id).val(res[key].val);
                        detailContentContainer.find('#instance_property_caption' + res[key].id).attr('readonly', true);
                    }
                }
            }
        }
        /* Code For Operation File Tag Only*/
        if (display_type == 'add') {
            detailContentContainer.find('.prs-icon.add').removeClass('hide');
            detailContentContainer.find('input[type="file"]').each(function (index) {
                if ($(this).attr('value') != '' && $(this).attr('value') != undefined) {
                    $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                    $(this).next().find('input[type="text"]:first').attr('value', $(this).attr('value'));
                } else {
                    $(this).next().find('input[type="text"]:first').removeAttr('disabled').attr('name', 'fileZvalue' + $(this).attr('data-id'));
                }
            });
        }
        /* Code By Arvind Soni */
        if (display_type === 'add') {
            search_customer_location = '';
            search_customer_id = '';
            search_stock_id = '';
            search_sales_id = '';
            search_fi_id = '';
        }
        else if (display_type === 'edit') {
            search_customer_location = detailContentContainer.find('#instance_property_caption6807').val();
            search_customer_id = detailContentContainer.find('#instance_property_caption3210').val();
            search_stock_id = detailContentContainer.find('#instance_property_caption3216').val();
            search_sales_id = detailContentContainer.find('#instance_property_caption3227').val();
            search_fi_id = detailContentContainer.find('#instance_property_caption3228').val();
        }
        bindClick();
        if (typeof tree != 'undefined') {
            traverse(tree, display_type);
            if (display_type === 'edit') {
                manageActionAddRemove();
            }
        }
        setTreeId();
    }

    function setValueOfNodeZ(obj, id) {
        $("#instance_property_caption" + id).val(obj.value);
        if ($(".thirdPaneActive").find(".node-input").attr("data-name") == "DATATYPE") {
            if (obj.value != "Class") {
                if ($(".radio_class_check_plus").is(":checked") == true) {
                    $(".show-edit-node-cust i").css("visibility", "visible");
                }
                $("#second-class-div .node-selected .hidden-node-y").val("")
                $("#second-class-div .node-selected .hidden-node-y-instance-property-node-id").val("")

                $(".add-fly-radio-checked i").removeClass("plus-small").removeClass("edit-class-select");
                $(".show-edit-node-cust i").css("visibility", "hidden");
                $(".sub_class_list_view1").hide();
            } else {
                if ($("#second-class-div .node-selected .hidden-node-y").val() != "") {
                    $(".add-fly-radio-checked i").removeClass("plus-small").addClass("edit-class-select");
                    $(".sub_class_list_view1").show();
                } else {
                    $(".add-fly-radio-checked i").addClass("plus-small").removeClass("edit-class-select");
                    $(".show-edit-node-cust i").css("visibility", "visible");
                    $(".sub_class_list_view1").hide();
                }
            }
        }
    }

    function setValueOfNodeZcheckBox(obj, id) {
        var textval = "";
        $(obj).closest('#checkbox_wrapper').find(".checkClass_" + id).each(function (index) {
            if ($(this).prop("checked") == true) {
                textval = textval + $(this).val() + checkboxSep;
            }
        });

        if ($.trim(textval) == "")
            textval = checkboxSep;
        $(obj).closest('#checkbox_wrapper').find("#instance_property_caption" + id).val(textval);
    }

    function showhideVal(obj, id) {
        var textval = "";
        $(".checkClass_" + id).each(function (index) {
            if ($(this).prop("checked") == true) {
                textval = textval + $(this).val() + checkboxSep;
                $('div.no-hull').removeClass('hide');
            } else {
                $('div.no-hull').addClass('hide');
                $("div.no-hull input[name*='instance_property_caption']").val('');
            }
        });

        if ($.trim(textval) == "")
            textval = checkboxSep;
        $('#j_my_privacydocument,#j_my_instruction').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
        $("#instance_property_caption" + id).val(textval);
    }

    /**
     * toggle the hin details visibility.
     * @returns {undefined}
     *
     */
    function toggleHinDetails(view) {
        var methodName = 'addClass';
        if ($(".toggleCheckbox").length > 0 && $(".toggleCheckbox").is(':checked')) {
            methodName = 'removeClass';
        }
        $('div.no-hull')[methodName]('hide');

        if (view == 'view') {
            $("span.pct").each(function () {
                var perSym = $(this).text();
                $(this).addClass('hide');
                if ($.trim($(this).siblings('span').text()) != "") {
                    $(this).siblings('span').html($(this).siblings('span').text() + '<span class="pct">%</span>');
                }
            });
        } else {
            $("span.pct.hide").removeClass('hide');
        }
    }

    function callDetailsContentAction(saveType) {
        //store deal status
        var statusInput = $('#instance_property_caption3287');
        if(statusInput.length) {
            GoToPageModule.cache.deal_status = statusInput.val();
        }

        var goAhead = true;
        if (saveType == 'D' || saveType == 'P') {
            var sub = $("#instance_property_caption3287").val();
            if(parseInt(login_role_id) != parseInt(lookup_role_id_of_bm) && parseInt(login_role_id) != parseInt(lookup_role_id_of_admin)){
                var sunsta = sub.split("-");
                if(sunsta!=""){
                    $("#instance_property_caption3287").val(sunsta[0]);
                }
            }

            if(saveType == 'P') {
                $(".cls_853_852_851 .list-detail-section").each(function(){
                    var getPropertyName = $.trim($(this).find(".property-name").val());
                    var getPropertyValue = $.trim($(this).find(".value").val());
                    if(getPropertyName!="" && getPropertyValue==""){
                        bootbox.alert("Value is required for condition with Property Name");
                        goAhead=false;
                        return false;
                    }
                    else if(getPropertyName=="" && getPropertyValue!=""){
                        bootbox.alert("Property Name is required for condition with Value");
                        goAhead=false;
                        return false;
                    }
                });
            }

            if(!goAhead){
                return false;
            }

            $("#id_detail_content" + form_container + " #id_detail_save_type").val(saveType);
            var funName = $("#id_detail_content" + form_container + " #id_detail_submit").val();
            eval(funName);
        } else if (saveType == 'C') {
            htmlModule.actionAfterCofirmationPopup();
        }
    }

    function callEditContentAction(checkVal) {
        var instance_id = $("#id_detail_content" + form_container + " #id_detail_instance_id").val();
        var display_type = 'edit';
        showFullLoader('content_loader');
        form_action_type = display_type;

        // $.post(base_plugin_url + 'code.php', {
        //     'action': 'content_form',
        //     'display_type': display_type,
        //     'checkVal': checkVal,
        //     'add_form_instance_id': add_instance_id_of_content,
        //     'instance_id': instance_id,
        //     'login_role_id': login_role_id,
        //     'heading': content_head
        // }, responseContentForm, 'json');
        var ajaxParams = {
            'action': 'content_form',
            'display_type': display_type,
            'checkVal': checkVal,
            'add_form_instance_id': add_instance_id_of_content,
            'instance_id': instance_id,
            'login_role_id': login_role_id,
            'heading': content_head
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, ajaxParams).then(responseContentForm);
        });
    }
         /**
         * Created by Anil Gupta
         * Date: 23-Dec-2016
         * This function is create for on hold reasons
         */
    function callOnholdContentAction() {
        var instance_id = $("#id_detail_content" + form_container + " #id_detail_instance_id").val();
        var display_type = 'add';
        form_action_type = display_type;
        // $.post(base_plugin_url + 'code.php', , callOnholdRes, 'json');
        var ajaxParams = {
            'action': 'onhold_form',
            'display_type': display_type,
            'add_form_instance_id': add_instance_id_of_content,
            'instance_id': instance_id,
            'login_role_id': login_role_id,
            'heading': content_head
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, ajaxParams).then(callOnholdRes);
        });
        showFullLoader('content_loader');

    }
         /**
         * Created by Anil Gupta
         * Date: 23-Dec-2016
         * This function give response for on hold reasons
         */
    function callOnholdRes(d,s) {
        d = d.data;
        $("#onhold-open-popup .onholdres").html(d.content_detail);
        $('#onhold-open-popup').modal('show');
        $('#onhold-open-popup button.btn').addClass('inactive');
        setTimeout(function() {
            modifyDropDown({selectorClass:'#onhold-open-popup .onholdres #onholdsection',searchAny:true,placeholder:'Search Reason'});
        },0);
        hideFullLoader('content_loader');
        //Added dropDown on change event
        $('#onhold-open-popup #onholdsection').on('change', function(){
            if($(this).children('option:selected').val() === 'Please select a reason:'){
                $('#onhold-open-popup button.btn').addClass('inactive');
            } else {
                $('#onhold-open-popup button.btn').removeClass('inactive');
            }
        });
    }
         /**
         * Created by Anil Gupta
         * Date: 24-Dec-2016
         * Through This function save data for on hold reasons
         */
    function saveOnholdReason(){
        var data = {
            'action': 'save_onhold_form_data',
            'onholdsection': $("#onholdsection").val(),
            'deal_instance_id': $('#id_listing_body').find('.row.active-tr').data('id'),
        };
        showFullLoader('content_loader');
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(resSaveOnholdReason);
        });
        // $.post(base_plugin_url + 'code.php',data,resSaveOnholdReason, 'json');
    }
         /**
         * Created by Anil Gupta
         * Date: 23-Dec-2016
         * This function give response after save the data for hold reasons
         */
    function resSaveOnholdReason(d,s){

        if(BreadcrumbModule.getSectionFullPath() == 'deal->operation') {
            $("#id_listing_operation").find('.active').click();
        } else {
            if($('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").find('.dotdotdot').length) {
                var status = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").find('.dotdotdot').text();
                status = status.substring(0, status.indexOf('-')) + '- ' + d.value;
                $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").find('.dotdotdot').text(status);
            } else {
                var status = $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").text();
                status = status.substring(0, status.indexOf('-')) + '- ' + d.value;
                $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.prop_id+"']").text(status);
            }
            $('.row.active-tr').trigger('click');
        }

    }
    function restoreOnholdContentAction() {
        var loaderId = 'content_loader',operationObj='',instance_id='';
        if(BreadcrumbModule.getSectionFullPath() == 'deal->operation') {
            loaderId = 'full_page_loader';
            operationObj = $('.workspace-operation-list.active');
            instance_id = operationObj.data('dealinsid');
        }else{
            instance_id = $("#id_detail_content" + form_container + " #id_detail_instance_id").val();
        }

        bootbox.confirm({
            title:'Restore',
            message:'Are you sure you want to restore this deal?',
            callback:function(result){
                if(result){
                    showFullLoader(loaderId);
                    var data = {
                        'action': 'restore_deal',
                        'instance_id': instance_id,
                        'login_role_id': login_role_id,
                    };
                    // $.post(base_plugin_url + 'code.php', , resRestoreOnholdContentAction, 'json');
                    require(['page_module'], function (PageModule) {
                        PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(resSaveOnholdReason);
                    });
                }
            }
        });
    }
    function resRestoreOnholdContentAction(){
        var activeEle = $('.row.active-tr');
        if(activeEle.is(':visible')) {
            activeEle.trigger('click');
            return true;
        }
        if(BreadcrumbModule.getSectionFullPath() == 'deal->operation') {
            $("#id_listing_operation").find('.active').click();
            return true;
        }
    }
    function getRolesOfPlugin(viewType) {
        var loaderId = 'content_loader';
        var params = {};
        var instance_node_id;
        var node_instance_id;
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
            instance_node_id = params.instance_node_id = instance_node_id_dashboard;
            node_instance_id = params.node_instance_id = node_instance_id_dashboard;
        } else {
            instance_node_id = params.instance_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
            node_instance_id = params.node_instance_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-id');
        }
        if ($("#role_actor_mapping .newUserRole").length > 0) {
            var msg = "Are you sure you want to continue?  Any unsaved data will be lost."
            searchModule.showPopup($(".detailJs"), msg);
            return false;
        }
        if (viewType != 2 && viewType != 1) {
            hideFullLoader(loaderId); // in case of "2", do not call hidefullloader function
        }
        if (viewType == '1') {
            if (form_action_type == "add") {
                is_role_assoc = '1';
                $.keep_showing_full_page_loader = true;
                showFullLoader(loaderId);
                callDetailsContentAction('D');
            } else if (form_action_type == "edit") {
                is_role_assoc = '1';
                $.keep_showing_full_page_loader = true;
                showFullLoader(loaderId);
                if ($("#save_as_draft").hasClass('disabled-icon'))
                    callDetailsContentAction('P');
                else
                    callDetailsContentAction('D');
            } else {

                params.display_type = 'roles';
                params.loaderId = loaderId;
                ajaxRolesOfPlugin(params);
            }
        } else if (viewType == '2') {//view Type ==2 (for view mode)
            if ($.trim(node_instance_id) != '') {
                // if deal is not published and role >= 2 assigned to deal
                if (form_container == '_dashboard') {
                    var save_type = 'D';
                } else {
                    var save_type = $('#id_listing_body div.active-tr').data('savetype');
                }
                var userRoleCount = 0;
                $("#id_detail_content" + form_container).find('input[name="mapping_actor_ids[]"]').each(function () {
                    if ($(this).val()) {
                        userRoleCount++;
                    }
                });
                if (userRoleCount >= 2 && save_type == 'D') {
                    renderViewDetails('', node_instance_id, 'edit');
                } else {
                    renderViewDetails('', node_instance_id, 'view');
                }
            } else {
                hideFullLoader(loaderId); // this line has been placed here intentionally.
            }
        } else if (viewType == 'assessment') {
            if (form_action_type == "add") {
                is_role_assoc = '';
                $.keep_showing_full_page_loader = true;
                showFullLoader('full_page_loader');
                callDetailsContentAction('D');
            } else if (form_action_type == "edit") {
                is_role_assoc = '1';
                $.keep_showing_full_page_loader = true;
                showFullLoader('full_page_loader');
                if ($("#save_as_draft").hasClass('disabled-icon'))
                    callDetailsContentAction('P');
                else
                    callDetailsContentAction('D');
            } else if (form_action_type == "view") {
                var activeRow = $("#content_wraper div.active-tr");
                var params = {
                    instance_node_id: activeRow.attr('data-node-id'),
                    node_instance_id: activeRow.attr('data-id'),
                    loaderId: loaderId,
                    display_type: 'view'
                };
                ajaxRolesOfPlugin(params);
            }
        }
    }
    function ajaxRolesOfPlugin(params) {
        if ($.trim(params.node_instance_id) != '') {
            showFullLoader(params.loaderId);
            // $.post(base_plugin_url + 'code.php', , responseRolesOfPlugin, 'json');
            var data = {
                'action': 'content_form',
                'display_type': params.display_type,
                'instance_id': params.instance_node_id,
                'class_node_id': class_node_id,
                'login_role_id': login_role_id,
                'form_container': form_container
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseRolesOfPlugin);
            });
        }
    }

    function responseRolesOfPlugin(d, s) {
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        var detailWrapper = $("#id_detail_content" + form_container);
        var content_html = $(d.content_detail);
        $("#id_detail_tooltip" + form_container).html(d.tooltip);

        detailWrapper.html(content_html);
        $("#id_detail_actions" + form_container).html(d.actions);
        hideFullLoader(loaderId);
        applyJs();
        if (is_role_assoc == '1') {
            is_role_assoc = '0';
            $.keep_showing_full_page_loader = false;
            hideFullLoader('full_page_loader');
        }
    }

    function searchActorForParticulerRole(placeId,search_role_id) {
        flyoutModule._init();
        flyoutModule.makeFlyoutVisible();
        flyoutModule.resetFlyout();
        flyoutModule.toggleActionButton('add');
        flyoutModule.manageFlyoutHtmlContent('show');
        $('#j_my_search').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
        flyoutModule.setClickLocation(placeId,search_role_id);
    }

    function searchDealsFormSelect($_this) {
        flyoutModule.makeFlyoutVisible();
        flyoutModule.resetFlyout();
        flyoutModule.toggleActionButton('add');
        flyoutModule.manageFlyoutHtmlContent('show');
        $('#j_my_search').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
        var id = $($_this).siblings('.form-control').attr('id');
        flyoutModule.setClickLocation(id);
    }

    function openStockFlyout($_this) {
        var clicked_element = $($_this);
        stockNo = clicked_element.closest('.input-btn-icon').find('.validationCheck').val();
        flyoutModule._init();
        flyoutModule.makeFlyoutVisible();
        flyoutModule.resetFlyout();
        flyoutModule.toggleActionButton('add');
        flyoutModule.manageFlyoutHtmlContent('hide');
        // Variable to get the location in Add/Edit and View Mode.
        var location = ($("#instance_property_caption6807").parents('form').length) ? $("#instance_property_caption6807").val() : $("#instance_property_caption6807").closest('div').find('span').text();
        $('#j_my_search').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });

        var ajaxParams = {
            'action': 'searchStockEye',
            'stockNo': stockNo,
            'location': location,
            'type': 'html',
            'deal_type': clicked_element.data('params')
        };
        var successCallback = function(result) {
            //var result = JSON.parse(result);
            var result = result.data;
            var wrapper = flyoutModule.properties.listUl;
            $(wrapper).html(result.list);
            setTimeout(function () {
                applyJs();
            });
            hideFullLoader('flyout_loader');
        }
        var callback_params = {
            data: '',
            callback: function() {
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'JSON'}, ajaxParams).then(successCallback);
                });
            }
        };
        showFullLoader('flyout_loader', callback_params);
    }

    function searchCustomer($_this) {
        var detailContentContainer = $("#id_detail_content" + form_container);
        customerNo = $.trim(detailContentContainer.find("#instance_property_caption3210").val());
        lastName = $.trim(detailContentContainer.find("#instance_property_caption3240").val());
        emailPrimary = $.trim(detailContentContainer.find("#instance_property_caption6800").val());
        phoneHome = $.trim(detailContentContainer.find("#instance_property_caption3241").val());
        phoneBusiness = $.trim(detailContentContainer.find("#instance_property_caption3242").val());

        if (customerNo != '' || lastName != '' || emailPrimary != '' || phoneHome != '' || phoneBusiness != '') {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            showFullLoader(loaderId);
            $(".loader-title-text").removeClass('hide');
            $(".progress-title").html('Fetching Customer Data');
            // $.post(base_plugin_url + 'code.php', , responseSearchCustomer, 'json');
            var data = {
                'action': 'searchCustomer',
                'customerNo': customerNo,
                'lastName': lastName,
                'emailPrimary': emailPrimary,
                'phoneHome': phoneHome,
                'phoneBusiness': phoneBusiness
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSearchCustomer);
            });
        } else {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            hideFullLoader(loaderId);
        }
    }

    function responseSearchCustomer(d, s) {
        var detailWrapper = $('#jq_search_wrapper #id_detail_content_search');
        $("#jq_search_wrapper #id_detail_head_search").html(d.heading);
        $("#jq_search_wrapper #id_detail_tooltip_search").html('');
        detailWrapper.html(d.list);
        $("#jq_search_wrapper #id_detail_actions_search").html(d.actions);
        applyJs();
        detailWrapper.find('div.listing-table-body div:first').trigger('click');
        loaderId = 'jq_search_wrapper #content_loader_search_new';
        $(".loader-title-text").addClass('hide');
        hideFullLoader(loaderId);
    }

    function selectCustomerSearch(CustomerNo) {
        $('#id_detail_content_search .active-tr').removeClass('active-tr');
        $("#id_detail_content_search #customer_" + CustomerNo).addClass('active-tr');
        $(".customer_search_select_button").removeClass('inactive');
    }

    function getCustomer() {
        var id = $("#jq_search_wrapper #id_detail_content_search").find('div.listing-table-body div.active-tr').data('customer-id');
        if (id != '' && id != undefined) {
            $("#id_detail_actions_search .jq_search_close").trigger('click');
            $("#id_detail_content" + form_container + " #instance_property_caption3210:eq(0)").prop('value', id);
            selectCustomer();
        }
    }

    function getSalesQuote() {
        var id = $("#id_detail_content_dashboard").find('div.listing-table-body div.active-tr').data('customer-id');
        if (id != '' && id != undefined) {
            $("#id_detail_actions_dashboard .j_my_createDeal_close").trigger('click');
            $("#id_detail_content" + form_container + " #instance_property_caption3210:eq(0)").prop('value', id);
            selectCustomer();
        }
    }

    function selectCustomer() {
        customerNo = $("#id_detail_content" + form_container + " #instance_property_caption3210:eq(0)").prop('value');
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        if (parseInt($.trim(customerNo)) > 0) {
            showFullLoader(loaderId);
            // $.post(base_plugin_url + 'code.php', , responseSelectCustomer, 'json');
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, {
                    'action': 'selectCustomer',
                    'customerNo': $.trim(customerNo)
                }).then(responseSelectCustomer);
            });
        }
    }

    function responseSelectCustomer(d, s) {
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        if ($.trim(d.CustomerNo) == '') {
            hideFullLoader(loaderId);
            $("#alert-deal-popup").modal('show');
            $("#id_detail_content" + form_container + " #instance_property_caption3210").val(search_customer_id);
            checkAllEmptyInputs();
            return false;
        }
        var address = '';
        if ($.trim(d.Addresses.AddressLine1) != '') {
            address = d.Addresses.AddressLine1;
        }
        if ($.trim(d.Addresses.AddressLine2) != '') {
            address = address + ' ' + d.Addresses.AddressLine2;
        }
        d.City = d.Addresses.City;
        d.State = d.Addresses.State;
        d.ZipCode = d.Addresses.ZipCode;
        var detailContentContainer = $("#id_detail_content" + form_container);
        var newObj = {
            FirstName: detailContentContainer.find("#instance_property_caption3211").val(),
            MiddleInitial: detailContentContainer.find("#instance_property_caption3212").val(),
            LastName: detailContentContainer.find("#instance_property_caption3240").val(),
            EntityName: detailContentContainer.find("#instance_property_caption9099").val(),
            EmailPrimary: detailContentContainer.find("#instance_property_caption6800").val(),
            PhoneHome: detailContentContainer.find("#instance_property_caption3241").val(),
            PhoneBusiness: detailContentContainer.find("#instance_property_caption3242").val(),
            address: detailContentContainer.find("#instance_property_caption3243").val(),
            City: detailContentContainer.find("#instance_property_caption3213").val(),
            State: detailContentContainer.find("#instance_property_caption6222").val(),
            ZipCode: detailContentContainer.find("#instance_property_caption6223").val()
        };
        var flagChanges = UtilityModule.compareObjects(newObj, d);
        d.address = address;
        if (flagChanges == 1 && $.trim(newObj.FirstName) != '') {
            hideFullLoader(loaderId);
            bootbox.confirm({
                title: 'Confirm',
                message: "Are you sure you want to overwrite BUYER information?",
                callback: function (result) {
                    if (result) {
                        search_customer_id = d.CustomerNo;
                        modifyCaptionElements(d);
                    } else {
                        detailContentContainer.find("#instance_property_caption3210").val(search_customer_id);
                    }
                    checkAllEmptyInputs();
                }
            });
        } else {
            search_customer_id = d.CustomerNo;
            modifyCaptionElements(d);
        }
        checkAllEmptyInputs();
        hideFullLoader(loaderId);
    }

    function modifyCaptionElements(d) {
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr  = {m: 'attr', v: {readonly: true}};
        var elements = {
            3240: [addClass, {m: 'val', v: d.LastName}],
            6800: [addClass, {m: 'val', v: d.EmailPrimary}],
            3241: [addClass, {m: 'val', v: d.PhoneHome}],
            3242: [addClass, {m: 'val', v: d.PhoneBusiness}],
            3211: [addClass, addAttr, {m: 'val', v: d.FirstName}],
            3212: [addClass, addAttr, {m: 'val', v: d.MiddleInitial}],
            9099: [addClass, addAttr, {m: 'val', v: d.EntityName}],
            3243: [addClass, addAttr, {m: 'val', v: d.address}],
            3213: [addClass, addAttr, {m: 'val', v: d.City}],
            6222: [addClass, addAttr, {m: 'val', v: d.State}],
            6223: [addClass, addAttr, {m: 'val', v: d.ZipCode}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }

    function searchStock($_this) {
        var detailContentContainer = $("#id_detail_content" + form_container);
        stockNo = $.trim(detailContentContainer.find("#instance_property_caption3216").val());
        make = $.trim(detailContentContainer.find("#instance_property_caption3218").val());
        year = $.trim(detailContentContainer.find("#instance_property_caption3219").val());
        model = $.trim(detailContentContainer.find("#instance_property_caption3220").val());

        if (stockNo != '' || make != '' || year != '' || model != '') {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            showFullLoader(loaderId);
            $(".loader-title-text").removeClass('hide');
            $(".progress-title").html('Fetching Stock Data');
            // $.post(base_plugin_url + 'code.php', , responseSearchCustomer, 'json');
            var data = {
                'action': 'searchStock',
                'stockNo': stockNo,
                'make': make,
                'year': year,
                'model': model,
                'type': 'json',
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSearchCustomer);
            });
        } else {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            hideFullLoader(loaderId);
        }
    }

    function selectUnitSearch(StockNo) {
        $('#id_detail_content_search div.active-tr').removeClass('active-tr');
        $("#id_detail_content_search #stock_" + StockNo).addClass('active-tr');
        $(".unit_search_select_button").removeClass('inactive');
    }

    function getStock() {
        var id = $("#jq_search_wrapper #id_detail_content_search").find('div.listing-table-body div.active-tr').data('stock-id');
        if (id != '' && id != undefined) {
            $("#id_detail_actions_search .jq_search_close").trigger('click');
            $("#id_detail_content" + form_container + " #instance_property_caption3216:eq(0)").prop('value', id);
            selectStock();
        }
    }

    function selectStock() {
        var fiQuoteNo = $("#id_detail_content" + form_container + " #instance_property_caption3228").val();
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        stockNo = $("#id_detail_content" + form_container + " #instance_property_caption3216:eq(0)").prop('value');
        if ($.trim(stockNo) != '') {
            showFullLoader(loaderId);
            // $.post(base_plugin_url + 'code.php', , responseSelectStock, 'json');
            var data = {
                'action': 'selectStock',
                'stockNo': $.trim(stockNo),
                'fiQuoteNo': $.trim(fiQuoteNo),
                'display_type': localStorage.getItem('display_type'),
                'id_detail_instance_id': $("#id_detail_content" + form_container + " #id_detail_instance_id").val(),
                'type': 'json',
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSelectStock);
            });
        }
    }

    function responseSelectStock(d, s) {
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        if ($.trim(d.StockNo) == '') {
            hideFullLoader(loaderId);
            $("#alert-stock-popup").modal('show');
            $("#id_detail_content" + form_container + " #instance_property_caption3216").val(search_stock_id);
            checkAllEmptyInputs();
            return false;
        }

        var lengthD = d.Length;
        lengthD = lengthD.replace('&quot;', '"');

        var newObj = {
            DsgnDesc: $("#id_detail_content" + form_container + " #instance_property_caption3230").val(),
            BrandDesc: $("#id_detail_content" + form_container + " #instance_property_caption3218").val(),
            ModelYear: $("#id_detail_content" + form_container + " #instance_property_caption3219").val(),
            ModelDesc: $("#id_detail_content" + form_container + " #instance_property_caption3220").val(),
            HullNo: $("#id_detail_content" + form_container + " #instance_property_caption3224").val()
        };
        var flagChanges1 = UtilityModule.compareObjects(newObj, d);
        if ($.trim(d.StockNo) != '') {
            if (flagChanges1 == 1 && $.trim(newObj.BrandDesc) != '') {
                hideFullLoader(loaderId);
                bootbox.confirm({
                    title: 'Confirm',
                    message: "Are you sure you want to overwrite BOAT information?",
                    callback: function (result) {
                        if (result) {
                            var fiQuoteNo = $("#id_detail_content" + form_container + " #instance_property_caption3228").val();
                            if (fiQuoteNo) {
                                $("#id_detail_content" + form_container + " #instance_property_caption3287").addClass('metrozone').attr('readonly', true).val(d.FIStatusDesc);
                            }
                            search_stock_id = d.StockNo;
                            d.lengthD = lengthD;
                            updateCaptionElement6(d);
                        } else {
                            $("#id_detail_content" + form_container + " #instance_property_caption3216").val(search_stock_id);
                            updateStatus();
                        }
                        checkAllEmptyInputs();
                    }
                });
            } else {
                search_stock_id = d.StockNo;
                d.lengthD = lengthD;
                updateCaptionElement6(d);
                updateStatus();
            }
        }
        checkAllEmptyInputs();
        hideFullLoader(loaderId);
    }
    function updateCaptionElement6(d) {
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var elements = {
            3230: [addClass, addAttr, {m: 'val', v: d.DsgnDesc}],
            3218: [addClass, {m: 'val', v: d.BrandDesc}],
            3219: [addClass, {m: 'val', v: d.ModelYear}],
            3220: [addClass, {m: 'val', v: d.ModelDesc}],
            3221: [addClass, addAttr, {m: 'val', v: d.lengthD}],
            3224: [addClass, addAttr, {m: 'val', v: d.HullNo}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }

    function selectSalesQuote($_this) {
        var elementContainer = $("#id_detail_content" + form_container);
        salesQuoteNo = elementContainer.find("#instance_property_caption3227").val();
        customerNo = elementContainer.find("#instance_property_caption3210").val();
        stockNo = elementContainer.find("#instance_property_caption3216").val();
        if ($.trim(salesQuoteNo) != '' || $.trim(customerNo) != '' || $.trim(stockNo) != '') {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            showFullLoader(loaderId);
            // $.post(base_plugin_url + 'code.php', , responseSelectSalesQuote, 'json');
            var data = {
                'action': 'selectSalesQuote',
                'salesQuoteNo': $.trim(salesQuoteNo),
                'customerNo': $.trim(customerNo),
                'stockNo': $.trim(stockNo),
                'type': 'json'
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSelectSalesQuote);
            });
        } else {
            loaderId = 'jq_search_wrapper #content_loader_search_new';
            hideFullLoader(loaderId);
        }
    }

    function responseSelectSalesQuote(d, s) {
        var detailWrapper = $("#jq_search_wrapper #id_detail_content_search");
        $("#jq_search_wrapper #id_detail_head_search").html(d.heading);
        $("#jq_search_wrapper #id_detail_tooltip_search").html('');
        detailWrapper.html(d.list);
        $("#jq_search_wrapper #id_detail_actions_search").html(d.actions);
        applyJs();
        $("#jq_search_wrapper #id_detail_content_search").find('div.listing-table-body div:first').trigger('click');
        loaderId = 'jq_search_wrapper #content_loader_search_new';
        hideFullLoader(loaderId);
    }

    function selectSalesSearch(salesQuoteNo) {
        $("#id_detail_content_search div.active-tr").removeClass('active-tr');
        $("#id_detail_content_search #salesquote_" + salesQuoteNo).addClass('active-tr');
        $(".salesquote_search_select_button").removeClass('inactive');
    }

    function searchSelectSalesQuote($_this) {
        var salesQuoteNo = $("#jq_search_wrapper #id_detail_content_search").find('div.listing-table-body div.active-tr').data('salesquote-id');
        if (salesQuoteNo != '' && salesQuoteNo != undefined) {
            $("#id_detail_actions_search .jq_search_close").trigger('click');
            $("#id_detail_content" + form_container + " #instance_property_caption3227:eq(0)").prop('value', salesQuoteNo);
            $("#sales_quote_button.jq_search_open").removeClass('jq_search_open');
            searchSalesQuote($_this, salesQuoteNo);
        }
    }

    function searchSalesQuote($_this, SearchSalesQuoteNo) {
        if (typeof SearchSalesQuoteNo == 'undefined') {
            SearchSalesQuoteNo = $("#id_detail_content" + form_container + " #instance_property_caption3227").val();
        }
        if ($.trim(SearchSalesQuoteNo) != "") {
            var loaderId = 'content_loader';
            if (form_container == '_dashboard') {
                loaderId = 'content_loader_dashboard';
            }
            if (parseInt(SearchSalesQuoteNo) > 0 && $.trim(SearchSalesQuoteNo) != '') {
                showFullLoader(loaderId);
                // $.post(base_plugin_url + 'code.php', , responseSearchSalesQuote, 'json');
                var data = {
                    'action': 'searchSalesQuote',
                    'salesQuoteNo': $.trim(SearchSalesQuoteNo),
                    'type': 'json'
                };
                require(['page_module'], function (PageModule) {
                    PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responseSearchSalesQuote);
                });
            } else {
                if ($.trim(SearchSalesQuoteNo) != '')
                    $("#alert-sales-popup").modal('show');

                $("#id_detail_content" + form_container + ' #instance_property_caption3227').val(search_sales_id);
                checkAllEmptyInputs();
            }
        } else {
            selectSalesQuote($_this);
        }
    }

    function updateCaptionElement2(d) {
        var customer = d.customer;
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var elements = {
            3210: [{m: 'val', v: customer.CustomerNo}],
            3211: [addClass, addAttr, {m: 'val', v: customer.FirstName}],
            3212: [addClass, addAttr, {m: 'val', v: customer.MiddleInitial}],
            3240: [addClass, addAttr, {m: 'val', v: customer.LastName}],
            9099: [addClass, addAttr, {m: 'val', v: customer.EntityName}],
            6800: [addClass, addAttr, {m: 'val', v: customer.EmailPrimary}],
            3241: [addClass, addAttr, {m: 'val', v: customer.PhoneHome}],
            3242: [addClass, addAttr, {m: 'val', v: customer.PhoneBusiness}],
            3243: [addClass, addAttr, {m: 'val', v: customer.address}],
            3213: [addClass, addAttr, {m: 'val', v: customer.City}],
            6222: [addClass, addAttr, {m: 'val', v: customer.State}],
            6223: [addClass, addAttr, {m: 'val', v: customer.ZipCode}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }

    function responseSearchSalesQuote(d, s) {
        var detailContentContainer = $("#id_detail_content" + form_container);
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        if ($.trim(d.QuoteNo) == '') {
            hideFullLoader(loaderId);
            $("#alert-sales-popup").modal('show');
            detailContentContainer.find('#instance_property_caption3227').val(search_sales_id);
            checkAllEmptyInputs();
            return false;
        } else {
            search_sales_id = $.trim(d.QuoteNo);
        }
        var fi_trade_in = detailContentContainer.find("#instance_property_caption3229").val();
        var trade_in = 'No';
        if (d.Trades.TradeStockNo != '' && d.Trades.TradeStockNo != undefined) {
            trade_in = 'Yes';
        }
        detailContentContainer.find("#instance_property_caption3229").addClass('metrozone').attr('readonly', true).val(trade_in);
        if ($.trim(d.customer.CustomerNo) != '') {
            var address = '';
            if ($.trim(d.customer.Addresses.AddressLine1) != '') {
                address = d.customer.Addresses.AddressLine1;
            }
            if ($.trim(d.customer.Addresses.AddressLine2) != '') {
                address = address + ' ' + d.customer.Addresses.AddressLine2;
            }
            d.customer.City = d.customer.Addresses.City;
            d.customer.State = d.customer.Addresses.State;
            d.customer.ZipCode = d.customer.Addresses.ZipCode;
            var newObj = {
                FirstName: detailContentContainer.find("#instance_property_caption3211").val(),
                MiddleInitial: detailContentContainer.find("#instance_property_caption3212").val(),
                LastName: detailContentContainer.find("#instance_property_caption3240").val(),
                EntityName: detailContentContainer.find("#instance_property_caption9099").val(),
                EmailPrimary: detailContentContainer.find("#instance_property_caption6800").val(),
                PhoneHome: detailContentContainer.find("#instance_property_caption3241").val(),
                PhoneBusiness: detailContentContainer.find("#instance_property_caption3242").val(),
                address: detailContentContainer.find("#instance_property_caption3243").val(),
                City: detailContentContainer.find("#instance_property_caption3213").val(),
                State: detailContentContainer.find("#instance_property_caption6222").val(),
                ZipCode: detailContentContainer.find("#instance_property_caption6223").val()
            };
            d.customer.address = address;
            var flagChanges = UtilityModule.compareObjects(newObj, d.customer);
            if (flagChanges == 1 && $.trim(newObj.FirstName) != '') {
                hideFullLoader(loaderId);
                bootbox.confirm({
                    title: 'Confirm',
                    message: "Are you sure you want to overwrite BUYER information?",
                    callback: function (result) {
                        if (result) {
                            search_customer_id = d.customer.CustomerNo;
                            updateCaptionElement2(d);
                        } else {
                            detailContentContainer.find("#instance_property_caption3210").val(search_customer_id);
                        }
                        checkAllEmptyInputs();
                    }
                });
            } else {
                search_customer_id = d.customer.CustomerNo;
                updateCaptionElement2(d);
            }
        }
        if ($.trim(d.boat.StockNo) != '') {
            var lengthD = d.boat.Length;
            lengthD = lengthD.replace('&quot;', '"');
            var newObj = {
                DsgnDesc: detailContentContainer.find("#instance_property_caption3230").val(),
                BrandDesc: detailContentContainer.find("#instance_property_caption3218").val(),
                ModelYear: detailContentContainer.find("#instance_property_caption3219").val(),
                ModelDesc: detailContentContainer.find("#instance_property_caption3220").val(),
                HullNo: detailContentContainer.find("#instance_property_caption3224").val()
            };
            var flagChanges1 = UtilityModule.compareObjects(newObj, d.boat);
            if ($.trim(d.boat.StockNo) != '') {
                if (flagChanges1 == 1 && $.trim(newObj.BrandDesc) != '') {
                    hideFullLoader(loaderId);
                    bootbox.confirm({
                        title: 'Confirm',
                        message: "Are you sure you want to overwrite BOAT information?",
                        callback: function (result) {
                            if (result) {
                                search_stock_id = d.boat.StockNo;
                                d.boat.lengthD = lengthD;
                                updateCaptionElement7(d);
                                updateStatus();
                            } else {
                                detailContentContainer.find("#instance_property_caption3216").val(search_stock_id);
                                updateStatus();
                            }
                            checkAllEmptyInputs();
                        }
                    });
                } else {
                    search_stock_id = d.boat.StockNo;
                    d.boat.lengthD = lengthD;
                    updateCaptionElement7(d);
                    updateStatus();
                }
            }
        }
        checkAllEmptyInputs();
        hideFullLoader(loaderId);
    }
    function updateCaptionElement7(d) {
        var boat = d.boat;
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var elements = {
            3216: [{m: 'val', v: boat.StockNo}],
            3230: [addClass, addAttr, {m: 'val', v: boat.DsgnDesc}],
            3218: [addClass, {m: 'val', v: boat.BrandDesc}],
            3219: [addClass, {m: 'val', v: boat.ModelYear}],
            3220: [addClass, {m: 'val', v: boat.ModelDesc}],
            3221: [addClass, addAttr, {m: 'val', v: boat.lengthD}],
            3224: [addClass, addAttr, {m: 'val', v: boat.HullNo}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }
    function searchFi(element) {
        cache.fi_lookup_request_count = 4;
        var detailContentContainer = $("#id_detail_content" + form_container);
        fiQuoteNo = detailContentContainer.find("#instance_property_caption3228").val();
        fiApiObject.locationCode = detailContentContainer.find("#instance_property_caption6807").val();
        fiApiObject.loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            fiApiObject.loaderId = 'content_loader_dashboard';
        }
        if (parseInt(fiQuoteNo) > 0 && $.trim(fiQuoteNo) != '') {
            showFullLoader(fiApiObject.loaderId);
            fiApiObject.displayType = localStorage.getItem('display_type');
            var deal_node_id = $('#id_listing_body div.active-tr').data('node-id');
            fiApiObject.fiPostReq = createFiPostReq(base_plugin_url + 'code.php', 'searchFiQuoteNew', ['fiQuoteNo','locationCode','login_role_id','deal_node_id'], [$.trim(fiQuoteNo),fiApiObject.locationCode,login_role_id,deal_node_id], fiApiObject.displayType, $("#id_detail_content" + form_container + " #id_detail_instance_id").val(), 'json');

            fiApiObject.fiPostReq.done(function (d) {
                d = d.data;
                if(d.returnCode == 400 || d.returnCode == 429) {
                    onSearchFiErrorCode(d);
                } else {
                    hasFilookupCompleted();
                    processViewAfterFiApis(d);
                }
            }).fail(onSearchFiFail); //FI Request
        }
    }

    function processFiRequest(data, success) {
        data = dataToJson(data);
        // Condition to Handle API Errors
        if(data.returnCode == 400 || data.returnCode == 429){
            onSearchFiErrorCode(data);
            return false;
        }
        cache.fi_lookup_request_count--;
        var detailContentContainer = $("#id_detail_content" + form_container);
        fiApiObject.data = mergeObjects(fiApiObject.data, data);


        fiApiObject.boatPostReq = createFiPostReq(base_plugin_url + 'code.php', 'searchFiQuote', ['stockNo','locationCode','IsQuoteOrDeal','login_role_id'], [data.fiQuote.StockNo,fiApiObject.locationCode,data.fiQuote.IsQuoteOrDeal,login_role_id], fiApiObject.displayType, $("#id_detail_content" + form_container + " #id_detail_instance_id").val(), 'json');
        fiLoaderTextShow('Fetching Boat Data', 'firstText');
        //fiApiObject.customerPostReq = createFiPostReq(base_plugin_url + 'code.php', 'searchFiQuote', ['customerNo','locationCode'], [data.CustID,fiApiObject.locationCode], fiApiObject.displayType, detailContentContainer.find("#id_detail_instance_id").val(), 'json');



        fiApiObject.customerPostReq = createFiPostReq(base_plugin_url + 'code.php', 'searchFiQuote', ['customerNo','locationCode','UseEntity','login_role_id'], [data.CustID,fiApiObject.locationCode,data.fiQuote.UseEntity,login_role_id], fiApiObject.displayType, detailContentContainer.find("#id_detail_instance_id").val(), 'json');
        fiLoaderTextShow('Fetching Customer Data', 'secondText');



        fiApiObject.coBuyerPostReq = createFiPostReq(base_plugin_url + 'code.php', 'searchFiQuote', ['coBuyerNo','locationCode','login_role_id'], [data.coBuyerNo,fiApiObject.locationCode,login_role_id], fiApiObject.displayType, detailContentContainer.find("#id_detail_instance_id").val(), 'json');
        fiLoaderTextShow('Fetching Co-Buyer Data', 'thirdText');

        fiApiObject.boatPostReq.done(function () {
            fiLoaderTextHide('firstText')
        }).then(processBoatRequest).fail(onSearchFiFail); //On Boat Request Complete
        fiApiObject.customerPostReq.done(function () {
            fiLoaderTextHide('secondText')
        }) //Hide Loader On Customer Request Complete
        fiApiObject.coBuyerPostReq.done(function () {
            fiLoaderTextHide('thirdText')
        }) //Hide Loader On CoBuyer Request Complete
    }

    function processBoatRequest(data, success) {
        data = dataToJson(data);
        // Condition to Handle API Errors
        if(data.returnCode == 400 || data.returnCode == 429){
            onSearchFiErrorCode(data);
            return false;
        }
        cache.fi_lookup_request_count--;
        fiApiObject.data = mergeObjects(fiApiObject.data, data);
        fiApiObject.customerPostReq.then(processCustomerRequest).fail(onSearchFiFail); //On Customer Request Request Complete
        hasFilookupCompleted();
    }

    function processCustomerRequest(data, success) {
        data = dataToJson(data);
        // Condition to Handle API Errors
        if(data.returnCode == 400 || data.returnCode == 429){
            onSearchFiErrorCode(data);
            return false;
        }
        cache.fi_lookup_request_count--;
        fiApiObject.data = mergeObjects(fiApiObject.data, data);
        fiApiObject.coBuyerPostReq.then(processCoBuyerRequest).fail(onSearchFiFail); //On CoBuyer Request Request Complete
        hasFilookupCompleted();
    }

    function processCoBuyerRequest(data, success) {
        data = dataToJson(data);
        // Condition to Handle API Errors
        if(data.returnCode == 400 || data.returnCode == 429){
            onSearchFiErrorCode(data);
            return false;
        }
        cache.fi_lookup_request_count--;
        fiApiObject.data = mergeObjects(fiApiObject.data, data);
        processViewAfterFiApis(fiApiObject.data); // Finally show the view after all api's
        fiLoaderTextHide('firstText'); //Hide all loader texts
        fiLoaderTextHide('secondText');
        fiLoaderTextHide('thirdText');
        fiApiObject = {// Empty fiApiObject after completing all requests
            fiPostReq: '',
            boatPostReq: '',
            customerPostReq: '',
            coBuyerPostReq: '',
            displayType: '',
            loaderId: '',
            locationCode: '',
            data: {}
        };
        hasFilookupCompleted();
    }

    function hasFilookupCompleted() {
        if(cache.fi_lookup_request_count === 0) {
            // if all requests are done then store Fi value and location
            FIQuoteModule.storeOldFiNumber();
        }
    }

    function onSearchFiFail(data, success) {
        bootbox.alert('Sorry, Something went wrong. Please try again!');
        data = dataToJson(data);
        fiLoaderTextHide('firstText');
        fiLoaderTextHide('secondText');
        fiLoaderTextHide('thirdText');
        $.do_not_hide_loader = false;
        hideFullLoader(fiApiObject.loaderId);
    }

    function fiLoaderTextShow(textString, className) {
        $('.loaderText .' + className).removeClass('hide');
        $('.loaderText .' + className).css('display', 'block');
        $('.loaderText .' + className + ' span.progress-title').text(textString);
    }

    function fiLoaderTextHide(className) {
        $('.loaderText .' + className).css('display', 'none');
        $('.loaderText .' + className).addClass('hide');
    }

    function createFiPostReq(URL, action, fields, values, display_type, detailIns, type) {
        var tempObj = {};
        tempObj.action = action;
        $.each(fields,function(index,field){
            tempObj[field] = values[index];
        });
        tempObj.display_type = display_type;
        tempObj.id_detail_instance_id = detailIns;
        tempObj.type = type;
        return $.post(URL, tempObj);
    }

    function dataToJson(data) {
        if(data !== '') {
            if (typeof data === 'string') {
                return JSON.parse(data);
            } else {
                return data;
            }
        }
    }

    function mergeObjects(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    function updateFiStatusDesc(fiApiData) {
        try {
            var StatusCode = fiApiData.boat.StatusCode;
            var IsQuoteOrDeal = fiApiData.fiQuote.IsQuoteOrDeal;
            var Rolesid = login_role_id;
            var ArchiveRole = '12345';
        } catch (e) {
            console.log('Error in fiQuote! (fiApiData.fiQuote.FIStatusDesc):' + e);
        }
    }

    function getFormInstanceVal(formSelectorId) {
        return $("#id_detail_content" + form_container + " " + formSelectorId).val()
    }

    function setFormInstanceVal(formSelectorId, value) {
        $("#id_detail_content" + form_container + " " + formSelectorId).addClass('metrozone').attr('readonly', true).val(value);
    }

    function createFiDate(dateRef) {
        var date = new Date(dateRef);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        return (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + date.getFullYear();
    }

    function updateCaptionElement3(d) {
        var customer = d.customer;
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var methods = [addClass, addAttr];
        var elements = {
            3210: [{m: 'val', v: customer.CustomerNo}],
            3211: [addClass, addAttr, {m: 'val', v: customer.FirstName}],
            3212: [addClass, addAttr, {m: 'val', v: customer.MiddleInitial}],
            3240: [addClass, addAttr, {m: 'val', v: customer.LastName}],
            9099: [addClass, addAttr, {m: 'val', v: customer.EntityName}],
            6800: [addClass, addAttr, {m: 'val', v: customer.EmailPrimary}],
            3241: [addClass, addAttr, {m: 'val', v: customer.PhoneHome}],
            3242: [addClass, addAttr, {m: 'val', v: customer.PhoneBusiness}],
            3243: [addClass, addAttr, {m: 'val', v: customer.address}],
            3213: [addClass, addAttr, {m: 'val', v: customer.City}],
            6222: [addClass, addAttr, {m: 'val', v: customer.State}],
            6223: [addClass, addAttr, {m: 'val', v: customer.ZipCode}]
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
        checkEmpty('.business-name');
    }

    function updateCaptionElement4(d) {
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var methods = [addClass, addAttr];
        var elements = {
            3287: [addClass, addAttr, {m: 'val', v: d.boat.status}],
            3216: [{m: 'val', v: d.boat.StockNo}],
            3230: [addClass, addAttr, {m: 'val', v: d.boat.DsgnDesc}],
            3218: [addClass, addAttr, {m: 'val', v: d.boat.BrandDesc}],
            3219: [addClass, addAttr, {m: 'val', v: d.boat.ModelYear}],
            3220: [addClass, addAttr, {m: 'val', v: d.boat.ModelDesc}],
            3221: [addClass, addAttr, {m: 'val', v: d.boat.Length}],
            3224: [addClass, addAttr, {m: 'val', v: d.boat.HullNo}],
            9097: [addClass, addAttr, {m: 'val', v: d.boat.Deal_Exists}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }

    function processViewAfterFiApis(d) {
        var loaderId = 'content_loader';
        if (form_container == '_dashboard') {
            loaderId = 'content_loader_dashboard';
        }
        if ($.trim(d.QuoteNo) == '') {
            hideFullLoader(loaderId);
            $("#alert-fi-popup").modal('show');
            $("#id_detail_content" + form_container + ' #instance_property_caption3228').val('');
            $("#id_detail_content" + form_container + ' #instance_property_caption6807').val('');
            checkAllEmptyInputs();
            return false;
        }
        updateFiStatusDesc(d);
        var fi_trade_in = getFormInstanceVal('#instance_property_caption3229');
        var fi_deal_type = getFormInstanceVal('#instance_property_caption3231');
        var fi_deal_status = getFormInstanceVal('#instance_property_caption3287');
        var fi_delivary_location = getFormInstanceVal('#instance_property_caption6805');
        var fi_estimate_d_date = getFormInstanceVal('#instance_property_caption6803');

        var api_deal_type = 'Cash';
        if (parseInt(d.fiQuote.LoanAmortization) > 0 && d.fiQuote.LoanAmortization != undefined) {
            api_deal_type = 'Financing';
        }
        if (d.fiQuote.DeliveryDate != '' && d.fiQuote.DeliveryDate != undefined)
            var deli_date = createFiDate(d.fiQuote.DeliveryDate);
        if (d.fiQuote.EstClosingDate != '' && d.fiQuote.EstClosingDate != undefined)
            var EstClosingDate = createFiDate(d.fiQuote.EstClosingDate);

        var trade_in = 'No';
        if (d.Trades.TradeStockNo != '' && d.Trades.TradeStockNo != undefined)
            trade_in = 'Yes';

        search_fi_id = d.QuoteNo;
        setFormInstanceVal('#instance_property_caption3229', trade_in);
        setFormInstanceVal('#instance_property_caption3231', api_deal_type);
        // setFormInstanceVal('#instance_property_caption3287',d.fiQuote.FIStatusDesc);
        setFormInstanceVal('#instance_property_caption6805', d.fiQuote.DeliveryLocn);
        setFormInstanceVal('#instance_property_caption6803', deli_date);
        setFormInstanceVal('#instance_property_caption6802', EstClosingDate);

        setFormInstanceVal('#instance_property_caption'+DEAL_NET_SALE_LIST, d.fiQuote.NetSaleList);

        if(parseInt(d.fiQuote.NetSaleList) > 0 && parseInt(d.fiQuote.NetSaleList) < 100000)
        {
            setFormInstanceVal('#instance_property_caption'+DEAL_SIZE, 'LOW');
        }
        else if(parseInt(d.fiQuote.NetSaleList) >= 100000 && parseInt(d.fiQuote.NetSaleList) <= 1000000)
        {
            setFormInstanceVal('#instance_property_caption'+DEAL_SIZE, 'MEDIUM');
        }
        else
        {
            setFormInstanceVal('#instance_property_caption'+DEAL_SIZE, 'HIGH');
        }

        if (d.customer && $.trim(d.customer.CustomerNo) != '') {
            var address = '';
            if ($.trim(d.customer.Addresses.AddressLine1) != '') {
                address = d.customer.Addresses.AddressLine1;
            }
            if ($.trim(d.customer.Addresses.AddressLine2) != '') {
                address = address + ' ' + d.customer.Addresses.AddressLine2;
            }
            d.customer.City = d.customer.Addresses.City;
            d.customer.State = d.customer.Addresses.State;
            d.customer.ZipCode = d.customer.Addresses.ZipCode;
            var newObj = {
                FirstName: getFormInstanceVal('#instance_property_caption3211'),
                MiddleInitial: getFormInstanceVal('#instance_property_caption3212'),
                LastName: getFormInstanceVal('#instance_property_caption3240'),
                EntityName: getFormInstanceVal('#instance_property_caption9099'),
                EmailPrimary: getFormInstanceVal('#instance_property_caption6800'),
                PhoneHome: getFormInstanceVal('#instance_property_caption3241'),
                PhoneBusiness: getFormInstanceVal('#instance_property_caption3242'),
                address: getFormInstanceVal('#instance_property_caption3243'),
                City: getFormInstanceVal('#instance_property_caption3213'),
                State: getFormInstanceVal('#instance_property_caption6222'),
                ZipCode: getFormInstanceVal('#instance_property_caption6223')
            };
            d.customer.address = address;
            var flagChanges = UtilityModule.compareObjects(newObj, d.customer);
            if (flagChanges == 1 && $.trim(newObj.FirstName) != '') {
                hideFullLoader(loaderId);
                bootbox.confirm({
                    title: 'Confirm',
                    message: "Are you sure you want to overwrite BUYER information?",
                    callback: function (result) {
                        if (result) {
                            search_customer_id = d.customer.CustomerNo;
                            updateCaptionElement3(d);
                        } else {
                            $("#id_detail_content" + form_container + " #instance_property_caption3210").val(search_customer_id);
                        }
                        checkAllEmptyInputs();
                    }
                });
            } else {
                search_customer_id = d.customer.CustomerNo;
                updateCaptionElement3(d);
            }
        }

        if (d.boat && $.trim(d.boat.StockNo) != '') {
            var lengthD = d.boat.Length;
            lengthD = lengthD.replace('&quot;', '"');
            var newObj = {
                DsgnDesc: getFormInstanceVal('#instance_property_caption3230'),
                BrandDesc: getFormInstanceVal('#instance_property_caption3218'),
                ModelYear: getFormInstanceVal('#instance_property_caption3219'),
                ModelDesc: getFormInstanceVal('#instance_property_caption3220'),
                HullNo: getFormInstanceVal('#instance_property_caption3224')
            };
            d.boat.Length = lengthD;
            var flagChanges1 = UtilityModule.compareObjects(newObj, d.boat);
            if (d.boat && $.trim(d.boat.StockNo) != '') {
                if (flagChanges1 == 1 && $.trim(newObj.BrandDesc) != '') {
                    hideFullLoader(loaderId);
                    bootbox.confirm({
                        title: 'Confirm',
                        message: "Are you sure you want to overwrite BOAT information?",
                        callback: function (result) {
                            if (result) {
                                search_stock_id = d.boat.StockNo;
                                updateCaptionElement4(d);
                            } else {
                                $("#id_detail_content" + form_container + " #instance_property_caption9097").val(d.boat.Deal_Exists);
                                //updateStatus();
                                $("#id_detail_content" + form_container + " #instance_property_caption3216").val(search_stock_id);
                            }
                            checkAllEmptyInputs();
                        }
                    });
                } else {
                    search_stock_id = d.boat.StockNo;
                    updateCaptionElement4(d);
                }

            }
        } else {
            $("#id_detail_content" + form_container + " #instance_property_caption3287").addClass('metrozone').attr('readonly', true).val(d.fiQuote.FIStatusDesc);
        }

        if (d.co_buyer && $.trim(d.co_buyer.CoBuyerID) != '' && $.trim(d.co_buyer.CoBuyerID) != undefined) {
            var address = '';
            if ($.trim(d.co_buyer.AddressLine1) != '')
                address = d.co_buyer.AddressLine1;

            if ($.trim(d.co_buyer.AddressLine2) != '')
                address = address + ' ' + d.co_buyer.AddressLine2;
            /* Co Buyer Section */
            d.co_buyer.address = address;
            updateCaptionElement5(d);
        }
        checkAllEmptyInputs();
        hideFullLoader(loaderId);
        commonCollapseExpand('.form-horizontal', '.validationCheck');
    }

    function updateCaptionElement5(d) {
        var co_buyer = d.co_buyer;
        var addClass = {m: 'addClass', v: 'metrozone'};
        var addAttr = {m: 'attr', v: {readonly: true}};
        var elements = {
            8383: [addClass, addAttr, {m: 'val', v: co_buyer.CoBuyerID}],
            8384: [addClass, addAttr, {m: 'val', v: co_buyer.FirstName}],
            8385: [addClass, addAttr, {m: 'val', v: co_buyer.MiddleInitial}],
            8386: [addClass, addAttr, {m: 'val', v: co_buyer.LastName}],
            8387: [addClass, addAttr, {m: 'val', v: co_buyer.EmailPrimary}],
            8388: [addClass, addAttr, {m: 'val', v: co_buyer.PhoneHome}],
            8389: [addClass, addAttr, {m: 'val', v: co_buyer.PhoneBusiness}],
            8390: [addClass, addAttr, {m: 'val', v: co_buyer.address}],
            8391: [addClass, addAttr, {m: 'val', v: co_buyer.City}],
            8392: [addClass, addAttr, {m: 'val', v: co_buyer.State}],
            8393: [addClass, addAttr, {m: 'val', v: co_buyer.ZipCode}],
        };
        var elementContainer = $("#id_detail_content" + form_container);
        UtilityModule.updateCaptionElement(elementContainer, elements);
    }

    function updateStatus() {
        var StockNo = $("#id_detail_content" + form_container + " #instance_property_caption3216").val();
        var search_fi_id = $("#id_detail_content" + form_container + ' #instance_property_caption3228').val();
        if (StockNo && search_fi_id) {
            // $.post(base_plugin_url + 'code.php', , responseupdateStatus, '');
            var data = {
                'action': 'getFiStatus',
                'display_type': localStorage.getItem('display_type'),
                'StockNo': StockNo,
                'search_fi_id': search_fi_id,
                'id_detail_instance_id': $("#id_detail_content" + form_container + " #id_detail_instance_id").val(),
            };
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: ''}, data).then(responseupdateStatus);
            });
        }
    }
    function responseupdateStatus(d, s) {
        $("#id_detail_content" + form_container + " #instance_property_caption3287").addClass('metrozone').attr('readonly', true).val(d);
    }
    function saveRolesActorAndDeals() {
        if (form_container == '_dashboard') {
            var instance_node_id = instance_node_id_dashboard;
        } else {
            var instance_node_id = $("#content_wraper #id_listing_body .customScroll div.active-tr").attr('data-node-id');
        }
        showFullLoader('content_loader');
        // $.post(base_plugin_url + 'code.php', , responsesaveRolesActorAndDeals, 'json');
        var data = {
            'action': 'addRoles',
            'instance_node_id': instance_node_id,
            'class_node_id': class_node_id,
            'data': $("#role_actor_mapping").serialize()
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(responsesaveRolesActorAndDeals);
        });
    }

    function responsesaveRolesActorAndDeals(d, s) {
        var detailWrapper = $("#id_detail_content" + form_container);
        $("#id_detail_tooltip" + form_container).html(d.tooltip);
        detailWrapper.html(d.content_detail);
        $("#id_detail_actions" + form_container).html(d.actions);
        applyJs();
        getRolesOfPlugin(2);
        // TO UPDATE RA NAME IN LISTING
        if($('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.role_asgn_arr.prop_id+"']").find('.dotdotdot').length) {
            $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.role_asgn_arr.prop_id+"']").find('.dotdotdot').text(d.role_asgn_arr.actor_name);
        } else {
            $('#id_listing_body div.active-tr').find(".breadcrumb-heading-js[data-statusid='"+d.role_asgn_arr.prop_id+"']").text(d.role_asgn_arr.actor_name);
        }
        // UPDATE STATUS
        var subStatusVal = d.role_asgn_arr.sub_status_value;
        if(typeof subStatusVal !== 'undefined' && subStatusVal!= null) {
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

    function loadMenuListByAjax(action, return_promise) {
        var data = {
            'action': 'menu_list',
            'node_id': menu_list_instance_id,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'roleId': login_role_id
        };
        var settings = {
            dataType: 'html',
            requestType:'POST'
        };
        if(return_promise === true) {
            return ActionModule.ajax(data, settings);
        }
        require(['page_module', 'utility'], function (PageModule, Utility) {
            var composedFun = Utility.compose(PageModule.menuAfterLoad, responseMenuList);
            PageModule.ajaxPromise(settings, data).then(composedFun);
        });
    }

    function getListHeaders(return_promise) {
        var data = {
            'action': 'list_items',
            'list_head_array': list_head_array,
            'list_setting_array': list_setting_array,
            'list_node_id_array': list_node_id_array,
            'list_mapping_id_array': list_mapping_id_array,
            'login_user_id': login_user_id,
            'roleId': login_role_id
        };
        if(return_promise === true) {
            return ActionModule.ajax(data, {dataType: 'html'});
        }
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, data).then(responseListHeader);
        });
        // $.post(base_plugin_url + 'code.php', data, responseListHeader, 'html');
    }

    function getListContent(return_promise) {
        var activeMenu = $("#leftMenuBar").find('.active').find('.section-id');
        var status = '';
        // If BM adds new deal from inboxMenuName.toLowerCase() page and deal's status is "Capped" then apply Capped filter
        if(GoToPageModule.cache.deal_added_from_dashboard === true) {
            if(GoToPageModule.cache.deal_status.toLowerCase() == 'capped') {
                status = 'Capped';
            }
        } else  if(login_role_id === lookup_role_id_of_bm) {
            status = 'Capped';
        }

        //if active menu is not deal then no need to apply any filter
        if(activeMenu.data('sectionId') != 'deal') {
            status = '';
        }
        if (status == 'Capped') {
            globalVar.dealFilterCheck = true;
            getFilterList(window,"Capped", 3287,""); //capping
        } else if(login_role_id === lookup_role_id_of_rm || login_role_id === lookup_role_id_of_controller || login_role_id === lookup_role_id_of_director){
            // globalVar.dealFilterCheck = true;
            getFilterList(window,'ra_mine','ra_mine','li_id_1457938','Mine');
        } else {
            var currentSectionHeading = BreadcrumbModule.getCurrentSectionHeading().toLowerCase();
            if (typeof dataSettings != 'undefined' && dataSettings.search_string && currentSectionHeading == 'deal') {
                return true;
            }
            GoToPageModule.cache.deal_added_from_dashboard = false;
            $.do_not_hide_loader = false;
            GoToPageModule.cache.deal_status = '';
            var data = getAjaxParams({
                'action': 'list_content',
                'list_head_array': list_head_array,
                'list_setting_array': list_setting_array,
                'list_node_id_array': list_node_id_array,
                'record_per_page': default_per_page,
                'page': curpage,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'pagination_record_array': pagination_record_array,
                'roleId': login_role_id,
            });

            if (typeof dataSettings != 'undefined' && jQuery.isPlainObject(dataSettings)) {
                if (dataSettings.recordPerPage) {
                    data.record_per_page = dataSettings.recordPerPage;
                }
            }
            var settings = {dataType: 'html',requestType:'POST'};
            if(return_promise === true) {
                return ActionModule.ajax(data, settings);
            }
            require(['page_module', 'utility'], function (PageModule, Utility) {
                var composedFun = Utility.compose(PageModule.middlePanelLoaded, responseListContent);
                PageModule.ajaxPromise(settings, data).then(composedFun);
            });
        }
    }

    function fileValidation() {
        $('#id_detail_content form').find('INPUT[type="file"]').on('change', function () {
            // FILE NAME
            var popupWrapper = $('#edit-opinfo-popup');
            var fullFilename = $(this).val().split('\\').pop();
            var filename = fullFilename.split('.').shift();
            var oldFile = $(this).parent().find('.list-view-detail').html();
            if (/^[a-zA-Z0-9- ]*$/.test(filename) == false) {
                $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                $(this).val(null);
                var oldFile = $(this).parent().find('.list-view-detail').html();
                popupWrapper.find('p').text('File name contains special characters. Please choose a file with alphanumeric characters only.');
                popupWrapper.modal('show');
            } else {
                var fileSize = this.files[0].size;
                var fileExt = $(this).val().split('.').pop().toLowerCase();
                if ($.inArray(fileExt, ['gif', 'png', 'jpg', 'jpeg', 'svg']) > -1) {
                    if (fileSize > 2097152) { // validate 2 MB
                        $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                        $(this).val(null);
                        popupWrapper.find('p').text('Allowed file size exceeded (Max 2 MB).');
                        popupWrapper.modal('show');
                    }
                } else if ($.inArray(fileExt, ['doc', 'docx', 'xls', 'xlsx', 'csv', 'pdf', 'txt', 'ppt', 'pptx']) > -1) {
                    if (fileSize > 10485760) { // validate 10 MB
                        $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                        $(this).val(null);
                        popupWrapper.find('p').text('Allowed file size exceeded (Max 10 MB).');
                        popupWrapper.modal('show');
                    }
                } else if ($.inArray(fileExt, ['mp3', 'wma', 'wav']) > -1) {
                    if (fileSize > 10485760) { // validate 10 MB
                        $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                        $(this).val(null);
                        popupWrapper.find('p').text('Allowed file size exceeded (Max 10 MB).');
                        popupWrapper.modal('show');
                    }
                } else if ($.inArray(fileExt, ['zip', 'rar']) > -1) {
                    if (fileSize > 20971520) { // validate 20 MB
                        $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                        $(this).val(null);
                        popupWrapper.find('p').text('Allowed file size exceeded (Max 20 MB).');
                        popupWrapper.modal('show');
                    }
                } else if ($.inArray(fileExt, ['avi', 'mpeg', 'flv', 'mov', 'wmv', 'mp4', 'mkv', 'mpg']) > -1) {
                    if (fileSize > 52428800) { // validate 50 MB
                        $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                        $(this).val(null);
                        popupWrapper.find('p').text('Allowed file size exceeded (Max 50 MB).');
                        popupWrapper.modal('show');
                    }
                } else {
                    $(this).siblings('.bootstrap-filestyle').find('.form-control').val(oldFile);
                    $(this).val(null);
                    popupWrapper.find('p').text('Please choose a valid file type.');
                    popupWrapper.modal('show');
                }
            }
        });
    }

    function hideShowAddBtn() {
        if (BreadcrumbModule.getSection() != 'Operation' && $("#leftMenuBar").find('.active').hasClass('deals'))
        {
            var eleAdd = $("#addMenuListDiv");
            if (checkPPCurl()) {
                eleAdd.removeClass('hide');
            } else {
                eleAdd.addClass('hide');
            }
        }
    }
    /* For Add Deal Menu Hide And Show */
    function roleWiseAddDeal() {
        if ($.trim(login_role_id) != '') {
            $("#li_id_" + add_deal_menu_instance_id + " , #li_id_" + delete_deal_menu_instance_id).addClass('hide');
            hideShowAddBtn();
            $("#dashboard_add_deal_link").addClass('hide');
            $("#dashboard_add_deal_link1").removeClass('hide');
            $("#existing_deal_flyout").removeClass('hide');

            if (class_node_id == "396138" && canDealAdd) {
                $("#li_id_" + add_deal_menu_instance_id).removeClass('hide');
                $("#addMenuListDiv").removeClass('hide');
                $("#dashboard_add_deal_link").removeClass('hide');
                $("#dashboard_add_deal_link1").removeClass('hide');
                $("#existing_deal_flyout").removeClass('hide');
            }
            if (class_node_id == "396138" && canDealDel && !$("#id_listing_body").find('.no-record-js').length) {
                $("#li_id_" + delete_deal_menu_instance_id).removeClass('hide inactive');
            }
            if (parseInt(login_role_id) == parseInt(lookup_role_id_of_bm))
                $("#dashboard_add_deal_link1").addClass('hide');
            else
                $("#dashboard_add_deal_link1").removeClass('hide');

            if(parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){
                $("#dashboard_add_deal_link").addClass('hide');
                $("#dashboard_add_deal_link1").addClass('hide');
                $("#existing_deal_flyout").addClass('hide');
            }

            //if (parseInt(login_role_id) == parseInt(lookup_role_id_of_bm) || parseInt(login_role_id) == parseInt(lookup_role_id_of_controller) || parseInt(login_role_id) == parseInt(lookup_role_id_of_director)){
            if (parseInt(login_role_id) == parseInt(lookup_role_id_of_bm) || parseInt(login_role_id) == parseInt(lookup_role_id_of_superadmin)){
                $("#li_id_"+li_role_ras).addClass('hide');
                $("#li_id_"+li_role_rms).addClass('hide');
                $("#li_id_"+li_role_mine).addClass('hide');
                $("#li_id_"+li_role_rm_c_d).addClass('hide');
                $("#li_id_"+li_role_c_d).addClass('hide');
            }
            else if(parseInt(login_role_id) == parseInt(lookup_role_id_of_ra)){
                $("#li_id_"+li_role_ras).addClass('hide');
                $("#li_id_"+li_role_c_d).addClass('hide');
                $("#li_id_398467").find('span').html('Team');
            }
            else if(parseInt(login_role_id) == parseInt(lookup_role_id_of_rm)|| parseInt(login_role_id) == parseInt(lookup_role_id_of_controller) || parseInt(login_role_id) == parseInt(lookup_role_id_of_director)){

                $("#li_id_"+li_role_rm_c_d).addClass('hide');
                $("#li_id_398467").addClass('hide');
            }
            is_open_workspace = 'N';
        }
    }

    function _init() {
        /* below section is to implement "Add More" functionality in Report section */
        var bodyEle = $('body');
        var addMoreEle = '#id_detail_content .form-horizontal .prs-icon.add';
        bodyEle.off('click.add_more', addMoreEle).on('click.add_more', addMoreEle, function (evt) {
            evt.preventDefault();
            addMoreClassStructure($(this));
        });
        var removeCloned = '#id_detail_content .form-horizontal .prs-icon.confirm_remove_close';
        bodyEle.off('click.add_more', removeCloned).on('click.add_more', removeCloned, function (evt, params) {

            evt.preventDefault();
            var newFun = UtilityModule.compose(ajaxOnRemoveStructure, removeClonedStructure);
            if(typeof params != 'undefined' && params.do_not_show_confirmation) {
                newFun = UtilityModule.compose(ajaxOnRemoveStructure, removeClonedStructure.bind($(this), $(this)));
                newFun();
                return true;
            }
            var params = {
                msg: 'Are you sure you want to remove?',
                callback: newFun
            };
            confirmDelete($(this), params);
        });
        /* "Add More" ends here */
    }

    function ajaxOnRemoveStructure(listDetailSectionParams) {
        if (listDetailSectionParams.instanceId > 0) {
            var data = {
                'action': 'deleteNodeInstance',
                'instance_node_id': listDetailSectionParams.instanceId,
            };
            showFullLoader('content_loader');
            // $.post(base_plugin_url + 'code.php',
            //     data,
            //     function (d) {
            //         hideFullLoader('content_loader');
            //     }, 'html');

            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, data).then(function (d) {
                    hideFullLoader('content_loader');
                });
            });
        }
    }

    function confirmDelete(clicked_element, params) {
        var defaultParams = {
            msg: 'Are you sure you want to remove?',
            callback: function () {
                console.log('No callback provided!!');
            }
        };
        var final_params = $.extend(defaultParams, params);

        if (clicked_element.attr('data-has-clicked')) {
            clicked_element.removeAttr('data-has-clicked');
            final_params.callback(clicked_element);
        } else {
            var modal = $("#commonConfirmPopup");
            modal.find('.series-content').text(final_params.msg);
            modal.find('.confirm-yes').off('click').on('click', function () {
                clicked_element.trigger('click');
            });
            modal.on('hidden.bs.modal', function () {
                clicked_element.removeAttr('data-has-clicked');
            });
            clicked_element.attr('data-has-clicked', 1);
            modal.modal('show');
        }
    }

    function applyDatePicker() {
        $(".datepicker").each(function () {
            if($(this).hasClass("metrozone")){
                $(this).datepicker("destroy");
                return true;
            }
            $(this).datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "-5:+5"
            });
        })
    }

    function applyJs(params) {

        setTimeout(function () {
            resizeHT(); // This function is working only resize window height.
            threePane(); //This function is working for display three pane.
            menuHT(); // This function is working for left menu bar
            filterMenu();
            setTbodyHt();
            paneMidHt();
            asideMenu = $('.aside-wrap').width();
            leftMenuPane = $('.prs-left-action-pane').width();
            var getframeHT = $('.mid-section-HT').outerHeight();
            $('#role_actor_mapping').css('min-height', getframeHT - 40);
            manageScrollBar();
            applyDatePicker();
            autosize($('textarea'));
            $(".ellipsis").dotdotdot({
                watch: "window"
            });
            $(".aside-wrap").tooltip({
                selector: '[data-toggle="tooltip"]'
            });
        }, 100);
    }

    function getAjaxParams(existing_data) {

        var activeMenu = all_settings[leftNavigationModule.getActiveMenu()]['settings']['menu'];
        existing_data.menuListInstanceId = activeMenu.menuListInstanceId;
        if (typeof dataSettings != 'undefined' && jQuery.isPlainObject(dataSettings)) {
            return $.extend(existing_data, dataSettings);
        }
        return existing_data;
    }

    function cancelFormAction(menutype) {
        //When "Create Deal" is clicked from inboxMenuName.toLowerCase() page then do not execute below functions.
        if($("#leftMenuBar").find('.active').find('.section-id').attr('data-section-id') == inboxMenuName.toLowerCase()) {
            return true;
        }
        var menutype = menutype || '';
        htmlModule.actionAfterCofirmationPopup(menutype);
    }

    function downloadPdf() {
        showFullLoader('full_page_loader');
        /*
         * Modified By:Divya
         * Purpose: Based on Anthony’s comment, we will use following naming convention:
         * Operation Name_Customer #_Deal ID # _Stock #
         * Task #266
         */
        var dealId      = parseInt($('#id_listing_body div.active-tr').data('node-id'));
        var fileParam   = '';
        if (!$('#id_listing_operation').hasClass('hide')) {
            var operation_Name  = $.trim($('#id_listing_operation div.active .workflow-body .operation-title').text());
            var stock_Number    = $('#hiddenstockNum').val();
            var customer_Number = $('#hiddencustNum').val();
            fileParam           = operation_Name + '@#@' + customer_Number + '@#@' + dealId + '@#@' + stock_Number;
        } else {
            var stock_Number    = parseInt($('#instance_property_caption3216').siblings('span.list-view-detail').text());
            var customer_Number = parseInt($('#instance_property_caption3210').siblings('span.list-view-detail').text());
            fileParam           = 'DEAL' + '@#@' + dealId + '@#@' + customer_Number + '@#@' + stock_Number;
        }
        /*End Here*/

        setTimeout(function () {
            $('#id_detail_content .list-title-heading.collapsed').trigger('click'); // open all collapsed info
            var html = $("#id_detail_content").find('.listing-content-wrap').clone();
            html.find('.collapse').show();
            ajaxProcessPDF({
                action: 'getWkPdf',
                docid: $('#id_listing_body div.active-tr').data('node-id'),
                html: html.html(),
                fileParam: fileParam,
                dealId: dealId,
                roleId: login_role_id
            });
        }, 1000);
    }

    function downloadReportPdf(curObj) {
        if ($(curObj).hasClass('action-show-popup')) {
            var msg = 'Please <b>Save</b> the document to generate PDF file.';
            var popupWrapper = $('#edit-opinfo-popup');
            popupWrapper.find('p').html(msg);
            popupWrapper.modal('show');
            return false;
        } else {
            showFullLoader('full_page_loader');
            // REPLACE ALL INPUT FIELDS FOR TCPDF
            // AS DISCUSSED WITH SARVJIT, ONLY INPUT FIELDS PRESENT IN DOC EDITOR FORMS
            var printHtml = $('#id_detail_content .edtCol2').html();
            var docHtml = document.createElement("div");
            $(docHtml).html(printHtml);
            $(docHtml).find('input.edtDynamicTextField').each(function () {
                $(this).replaceWith('<span>' + $(this).val() + '</span>');
            });

            docHtml = ($('#edtInnerCanvasView').length === 0) ? docHtml : $('#edtInnerCanvasView');

            //For Page Break- Need to add a <p> tag.
            var divCount = docHtml.find('.innerCanvasContainer').length - 1;
            for(var i=0; i<= divCount -1 ; i ++){
                var div_obj = docHtml.find('.innerCanvasContainer')[i];
                $(div_obj).append('<p style="page-break-before: always"></p>');
            }
            // Since download pdf for "agreement to provide insurance" is not properly formatted so we use below quickfix as discussed by animesh sir.
            var action = 'getWkPdf'; // 'getReportPdf';
            var docId = $('#id_listing_operation div.active').data('document');

            /*
             * Modified By:Divya
             * Purpose: Based on Anthony’s comment, we will use following naming convention:
             * Operation Name_Customer #_Deal ID # _Stock #
             */
            var dealId = $('#id_listing_body div.active-tr').data('node-id');
            var fileParam = '';
            if (!$('#id_listing_operation').hasClass('hide')) {
                var operation_Name = $.trim($('#id_listing_operation div.active .workflow-body .operation-title').text());
                var stock_Number = $('#hiddenstockNum').val();
                var customer_Number = $('#hiddencustNum').val();
                fileParam = operation_Name + '@#@' + customer_Number + '@#@' + dealId + '@#@' + stock_Number;
            }
            /*End Here*/
            ajaxProcessPDF({action: action,docid: docId,type: 'report',html: $(docHtml).html(),fileParam: fileParam,dealId: dealId,roleId: login_role_id});
        }
    }

    function downloadReportPdfReview(curObj) {
        showFullLoader('full_page_loader');
        // REPLACE ALL INPUT FIELDS FOR TCPDF
        // AS DISCUSSED WITH SARVJIT, ONLY INPUT FIELDS PRESENT IN DOC EDITOR FORMS
        var printHtml = $('#edtInnerCanvasView').html();
        var docHtml = document.createElement("div");
        $(docHtml).html(printHtml);
        $(docHtml).find('input.edtDynamicTextField').each(function () {
            $(this).replaceWith('<span>' + $(this).val() + '</span>');
        });
        ajaxProcessPDF({action: 'getWkPdf',fileDocType: 'review',docid: Math.floor((Math.random() * 10000) + 1),html: $(docHtml).html()});
    }
    function ajaxProcessPDF(data) {

        var callback = function(result) {

            hideFullLoader('full_page_loader');
            if(result.data!='') {
                //var res = JSON.parse(result);
                var a = document.createElement("a");
                a.href = result.data;
                a.download = result.data.split('/').pop();
                document.body.appendChild(a);
                a.click();
            } else {
                console.log('Invalid JSON response');
            }
        }
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'json'}, data).then(callback);
        });
    }

    function showsignFlyout() {
        $('#j_my_esign').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
    }
         /**
         * Created by Anil Gupta
         * Date: 29-Dec-2016
         * Display flyout for hold reasons
         */
    function showsignonHoldFlyout() {
        $('#j_my_left_onhold_flyout').flyout({
            type: 'overlay',
            horizontal: 'right',
            slideDirection: 'right'
        });
    }

    function setSigning() {
        // $.post(base_plugin_url + 'code.php', , responseDocumentSignature, 'html');
        var data = {
            'action': 'document_signature',
            'login_user_id': login_user_id
        };
        require(['page_module'], function (PageModule) {
            PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, data).then(responseDocumentSignature);
        });
    }

    function responseDocumentSignature(d, s) {

        var titleLoc = $("#id_detail_head");
        var activeDiv = $('#id_listing_operation').find('div.active');
        setOperationDetailHeading(activeDiv, titleLoc);
        d = JSON.parse(d);
        d = d.data;
        $("#id_detail_content").html(d.content_detail);
        $("#id_detail_actions").html(d.actions);
        $("#id_detail_tooltip").html(d.tooltip);
        DocDualPaneAnmate();
        $('.listing-details-wrap').addClass('esign-mode');
        setDigitalScroll();
        $('#id_detail_tooltip').find('.detail').closest('a').off('click').on('click', function () {
            $('.workflow-wrap .active').trigger('click');
        });
        $('#startSigning').off('click').on('click', function () {
            $('#signDocument').trigger('click');
        });
    }

    /*function use here to publish the deal class*/
    function publishDeal() {
        $.when(ActionModule.ajax({
            action: 'publishDeal',
            node_ins_id: $('#id_listing_body').find('div.active-tr').data('id'),
            node_id: $('#id_listing_body').find('div.active-tr').data('node-id'),
            'login_user_id': login_user_id,
        })).then(function (response) {
            var dealSpaceRole = $('.action-accept-invitation.deals-space-roles');
            if ($(dealSpaceRole)) {
                $(dealSpaceRole).removeClass('deals-space-roles inactive-btn');
            }
            hideFullLoader('full_page_loader');
        });
    }

    function manageActionAddRemove() {
        $('.cls-tree').each(function () {
            var instanceWrapper = $(this).find('> .collapse-wrapper > .modified');
            var instanceWrapperLen = $(instanceWrapper).length;
            if (instanceWrapperLen > 1) {
                $(instanceWrapper).each(function () {
                    $(this).find('>.list-detail-section > .manage-right-cls-action .icon_close').removeClass('hide');
                    $(this).find('>.list-detail-section > .manage-right-cls-action .add').addClass('hide');
                });
                $(this).find('> .collapse-wrapper >.modified:last >.list-detail-section > .manage-right-cls-action .add').removeClass('hide');
            } else {
                $(instanceWrapper).find('>.list-detail-section > .manage-right-cls-action .add').removeClass('hide');
                $(instanceWrapper).find('>.list-detail-section > .manage-right-cls-action .icon_close').addClass('hide');
            }
        });
    }

    function setTreeId() {
        var i = 10;
        $('.cls-tree').each(function () {
            var parent_id = '0';
            var temp_parent_id = $(this).parent().closest('div').closest('.cls-tree').attr('data-node-id');
            if (temp_parent_id > 0) {
                parent_id = temp_parent_id;
            }
            $(this).attr('data-node-id', i);
            $(this).addClass('treeClassContainerDiv');
            $(this).attr('data-parent-node-id', parent_id);
            i++;
        });
        setTreeChildId();
    }

    function setTreeChildId() {
        var i = 1000;
        $('.list-detail-section').each(function () {
            var parent_id = '0';
            if ($(this).parent().hasClass('collapse-wrapper') || $(this).parent().hasClass('modified')) {
                $(this).addClass('property-wrapper');
                var temp_parent_id = $(this).parent().closest('div').closest('.list-detail-section').attr('data-node-id');
                var clsId = $(this).parent().closest('div').closest('.cls-tree').attr('data-id');
                if (temp_parent_id > 0) {
                    parent_id = temp_parent_id;
                }
                $(this).attr('data-node-id', i);
                $(this).attr('data-parent-node-id', parent_id);
                $(this).attr('data-cls-id', clsId);
                i++;
            }
        });
    }

    function manageCloneWrapperId() {
        $('.list-detail-section.property-wrapper:visible').each(function () {
            var id = $(this).attr('data-node-id');
            $(this).find('.form-group').attr('data-id', 'form-group-' + id);
        });
    }

    function manageCheckboxValue() {
        $('.form-group #checkbox_wrapper > input').each(function () {
            var eleValue = $(this).val();
            if (typeof eleValue != 'undefined') {
                if (eleValue.split('~#~').length > 1) {
                    var chkVal = eleValue.split('~#~');
                    var uniqueNames = [];
                    $.each(chkVal, function (i, el) {
                        if ($.inArray(el, uniqueNames) === -1)
                            uniqueNames.push(el);
                    });
                    chkVal = uniqueNames;
                    $(this).val(chkVal.join('~#~'));
                }
            }
        });
    }

    function makePostTree() {
        manageCheckboxValue();
        manageCloneWrapperId();

        var listDetailSections = $("#id_detail_content").find('.list-detail-section.property-wrapper').not(':first');
        var treeArr = [];
        listDetailSections.each(function () {
            var parent_id = $(this).attr('data-parent-node-id');
            var instance_id = $(this).attr('data-instance-id');
            var cls_id = $(this).attr('data-cls-id');
            var node_id = $(this).attr('data-node-id');
            var textArr = [];
            var propIdArr = [];

            $(this).find('.form-group[data-id=form-group-' + node_id + ']').each(function (i) {
                var inlineInput = $(this).find('.inline-input');
                if ($(this).find('.input-radio').length > 0) {
                    var currentRadioEle = $(this).find('.input-radio').find('input:checked');
                    var currentRadioPropEle = $(this).find('.input-radio').find('input[type="radio"]');
                    selectedEleValue = currentRadioEle.attr('value');
                    selectedElePropertyValue = currentRadioPropEle.attr('data-id');
                } else if ($(this).find('#checkbox_wrapper').length > 0) {
                    var currentCheckboxEle = $(this).find('#checkbox_wrapper').children(':first');
                    var currentPropEle = $(this).find('#checkbox_wrapper .input-chk:first').find('input');
                    selectedEleValue = currentCheckboxEle.attr('value');
                    selectedElePropertyValue = currentPropEle.attr('data-id');
                } else if ($(this).find('#calender_wrapper').length > 0) {
                    var currentCalanderEle = $(this).find('#calender_wrapper').find('.datepicker');
                    var currentCalanderPropEle = $(this).find('#calender_wrapper').children(':first');
                    selectedEleValue = currentCalanderEle.val();
                    selectedElePropertyValue = currentCalanderPropEle.attr('data-id');
                } else if ($(this).find('select').length > 0) {
                    var currentSelectEle = $(this).find('select option:selected');
                    var currentSelectPropEle = $(this).find('select');
                    selectedEleValue = currentSelectEle.attr('value');
                    selectedElePropertyValue = currentSelectPropEle.attr('data-id');
                } else if ($(this).find('input[type="file"]').length > 0) {
                    selectedEleValue = $(this).find('input[type="file"]').attr('value');
                    selectedElePropertyValue = $(this).find('input[type="file"]').attr('data-id');
                } else {
                    selectedEleValue = inlineInput.val();
                    selectedElePropertyValue = inlineInput.next().attr('value');
                }
                if (typeof selectedEleValue == 'undefined') {
                    selectedEleValue = '';
                }
                if (typeof selectedElePropertyValue == 'undefined') {
                    selectedElePropertyValue = '';
                }
                if (selectedElePropertyValue > 0) {
                    textArr[i] = selectedEleValue;
                    propIdArr[i] = selectedElePropertyValue;
                }
            });
            treeArr.push({
                parent: parent_id,
                text: textArr,
                id: node_id,
                temp_node_id: instance_id,
                subnodeclasspropertyid: propIdArr,
                subnodeclassid: cls_id
            });
        });
        return treeArr;
    }

    function getRandomString() {
        return Math.random().toString(36).substring(7);
    }

    function addMoreClassStructure(add_btn) {

        var list_detail_section = add_btn.closest('.list-detail-section');
        var closestRoleSelectorDiv = add_btn.closest('.roleCloneContainer');
        var list_detail_container = $('#cls_822_858 .collapse-wrapper');
        var activeMenu = $.trim($('#leftMenuBar .active').attr('id'));
        var modified = list_detail_container.find('.modified').length ? true : false;
        list_detail_section.find('.icon_close').removeClass('hide');
            var cloned_html = list_detail_section.clone(true);
        if( ~activeMenu.indexOf('store') ) {
            if(modified) {
                list_detail_container.find('.icon_close').eq(0).addClass('hide');
            } else {
                list_detail_container.find('.icon_close').eq(1).addClass('hide');
            }

        }
        cloned_html.find('.loaded-by-ajax').remove();
        cloned_html.find('.cls-tree').find('.class-accordian:first i').removeClass('fa-angle-down').addClass('fa-angle-up');
        cloned_html.find('.cls-tree').each(function () {
            $(this).attr('data-mode', 'add');
        });
        cloned_html.find('.validationCheck').attr('value', '');
        cloned_html.attr('data-instance-id', '');
        cloned_html.find('.list-detail-section.property-wrapper').attr('data-instance-id', '');
        list_detail_section.find('.add').addClass('hide');
        // make all input filds empty before cloning it
        if(~activeMenu.indexOf('control')) {
            cloned_html.find('input[type="text"]').val('');
        }
        if(~activeMenu.indexOf('store')) {
            cloned_html.find('[data-id="8760"], [data-id="8761"], [data-id="8757"]').val('');
        }
        var uniqueName = getRandomString();
        cloned_html.find('input[type="radio"]').closest('#radio_wrapper').each(function () {
            $(this).find('input[type="radio"]').attr('name', 'radio_' + uniqueName);
        });
        cloned_html.find('input[name="radio_' + uniqueName + '"]').removeAttr('checked');
        cloned_html.find('input[type="checkbox"]').removeAttr('checked');
        cloned_html.find('input[type="file"]').attr('value', '');
        cloned_html.find('input[type="file"]').parent().find('.bootstrap-filestyle.input-group input').attr('value', '');

        cloned_html.find('textarea').val('');
        cloned_html.find('.hasDatepicker').removeClass('hasDatepicker').removeData('datepicker').removeAttr('id');

        var getlastElementDisabledOptions = closestRoleSelectorDiv.parent().find(".roleCloneContainer:last .commonControlRoleClass");
        cloned_html.find(".commonControlRoleClass").html(getlastElementDisabledOptions.html());
        cloned_html.find(".commonControlRoleClass option:selected").removeAttr("selected");
        cloned_html.find(".commonControlRoleClass option[value='"+getlastElementDisabledOptions.val()+"']").attr("disabled",true);
        var getNotDisabled = false;
        cloned_html.find(".commonControlRoleClass option").each(function(){
            var getElm = $(this).attr("disabled");
            if(!getElm){
                getNotDisabled = true;
                $(this).attr("selected",true);
                return false;
            }
        });

        if(!list_detail_section.hasClass("roleCloneContainer")){
            getNotDisabled=true;
        }

        if(getNotDisabled){
            if (list_detail_section.parent().hasClass('modified')) {
                var collapseWrapper = list_detail_section.closest('.collapse-wrapper');
                var total = (collapseWrapper.find('.modified').length + 1);
                var headingEle = cloned_html.find('>.headingTwo');
                //var title = headingEle.text().replace(/[0-9]/g, total);
                var title = headingEle.text().replace(/\d+/, total);
                headingEle.text(title);
                var newHtml = $('<div />').addClass('roleCloneContainer modified container-' + total).html(cloned_html);
                collapseWrapper.append(newHtml);
                scrollToBottom('#id_detail_content');
            } else {
                if( ~activeMenu.indexOf('store') ){
                    cloned_html.appendTo(list_detail_container);
                     scrollToBottom('#id_detail_content');
                } else {
                    cloned_html.insertAfter(list_detail_section);
                }

                var list_detail_section_parent = add_btn.closest('.list-detail-section').parent();
                addUpdateHeading(list_detail_section_parent);
            }
        }
        else{
            bootbox.alert("All roles are already added.");
        }

        applyDatePicker();
        setTreeId();
        setTreeChildId();
    }

    function addUpdateHeading(list_detail_section_parent) {
        var heading = getHeading(list_detail_section_parent.closest('.nested-layout'));
        var cloned_elements = getClonedElements(list_detail_section_parent);
        $.each(cloned_elements, function (ind) {
            appendHeading($(this), heading + ' ' + (ind + 1))
        });
    }

    function removeClonedStructure(remove_btn) {
        var getClosestModifiedDiv = remove_btn.closest(".modified").prev();
         var activeMenu = $.trim($('#leftMenuBar .active').attr('id'));
        if(getClosestModifiedDiv.length==0){
            getClosestModifiedDiv = remove_btn.closest(".modified").next();
        }
        var getSelectedIptionID = remove_btn.closest(".modified").find(".commonControlRoleClass").val();
        var list_detail_section = remove_btn.closest('.list-detail-section');
        var parent = list_detail_section.parent();
        var listDetailSectionParams = list_detail_section.data();
        var countCloned = false;
        if (parent.hasClass('modified')) {
            parent = parent.parent();
            list_detail_section = list_detail_section.parent();
            countCloned = true;
        }
        var list_detail_section_parent = remove_btn.closest('.list-detail-section').parent();
        if (list_detail_section_parent.hasClass('modified')) {
            list_detail_section_parent = list_detail_section_parent.parent();
        }

        list_detail_section.remove();
        var cloned_elements = getClonedElements(parent, countCloned);
        if (cloned_elements.length == 1) {
            parent.find('.list-detail-section').find('.prs-icon.icon_close').addClass('hide')
                .closest('.list-detail-section').find('.prs-icon.add').removeClass('hide');
            parent.find('.list-detail-section').find('.headingTwo').remove();
        } else {
                if( ~activeMenu.indexOf('control') ) {
                    parent.find('.list-detail-section:last').find('.prs-icon.add').removeClass('hide');
                }

            if (countCloned) {
                var heading = getHeading(list_detail_section_parent.closest('.nested-layout'));
                var headings = list_detail_section_parent.find('> .modified').find('.headingTwo');
                headings.each(function (ind) {
                    $(this).text($(this).text().replace(/\d+/g, (ind + 1)));
                });
            } else {
                addUpdateHeading(list_detail_section_parent);
            }
        }
        setTreeId();
        setTreeChildId();

        if(getClosestModifiedDiv.length>0){
            getClosestModifiedDiv.nextAll().addBack().each(function(){
                $(this).find(".commonControlRoleClass").each(function(){
                    $(this).find("option").each(function(){
                        if($(this).val()==getSelectedIptionID){
                            $(this).attr("disabled",false);
                        }
                    });
                });
            });
        }
        if( ~activeMenu.indexOf('store') ) {
            if(parent.find('.list-detail-section .confirm_remove_close:visible').length){
                parent.find('.list-detail-section .confirm_remove_close:visible').last().prev().removeClass('hide')
            } else {
                 $('#cls_822_858 .collapse-wrapper .list-detail-section:visible').eq(0).find('.prs-icon.add').removeClass('hide')
            }
        }

        return listDetailSectionParams;
    }

    function getClonedElements(list_detail_section_parent, countCloned) {
        if (countCloned === true) {
            return list_detail_section_parent.find('> .modified');
        }
        return list_detail_section_parent.find('> .list-detail-section:visible');
    }

    function traverse(obj, display_type) {
        for (var key in obj) {
            if (obj[key][0]['children']) {
                travelChildren(obj[key][0]['children'], display_type);
            }
        }
    }

    function travelChildren(children, display_type) {
        $.each(children, function (ind, item) {
            fillValues(item, display_type);
        });
    }

    function fillValues(sub_childs, display_type) {
        var html_cache = '',
            heading = '';
        var has_multiple = (sub_childs.length > 1) ? true : false;

        $.each(sub_childs, function (ind, item) {
            var counter = (ind + 1);
            var wrapper = $("#" + item.class_tree).find('.collapse-wrapper');

            if (!html_cache.length) {
                heading = getHeading($("#" + item.class_tree));
                html_cache = wrapper.html();
                if (typeof html_cache == 'undefined') {
                    html_cache = '';
                }
            }
            var new_html = '<div class="modified container-' + counter + '">' + html_cache + '</div>';
            var modifiedEle = wrapper.find('.modified');
            if (modifiedEle.length) {
                $(new_html).insertAfter(modifiedEle.filter(':last'));
            } else {
                wrapper.html(new_html);
            }
            var container = wrapper.find('.container-' + counter);
            var uniqueName = getRandomString();
            container.find('input[type="radio"]').closest('#radio_wrapper').each(function () {
                $(this).find('input[type="radio"]').attr('name', 'radio_' + uniqueName);
            });
            container.find('.hasDatepicker').removeClass('hasDatepicker').removeData('datepicker').removeAttr('id');
            $(container).find('> .list-detail-section').addClass('property-wrapper').attr('data-instance-id', item.instance_node_id);
            if (has_multiple && heading) {
                appendHeading(wrapper.find('.container-' + counter), heading + ' ' + counter);
            }
            setValues(container, item, display_type);
        });
    }

    function setValues(container, item, display_type) {
        var elements = container.find('.form-group');
        if (!elements.length) {
            return true;
        }
        container.find('.cls-wrapper.nested-layout').attr('data-parent-instance-node-id', item.parent_instance_node_id).attr('data-mode', display_type);
        if (!item.hasChildren && display_type == 'view') {
            container.find('.cls-wrapper.nested-layout').addClass('inactive');
        }
        if (!item.hasChildren && display_type == 'edit') {
            container.find('.cls-wrapper.nested-layout').attr('data-parent-instance-node-id', '');
            container.find('.cls-wrapper.nested-layout').attr('data-mode', 'add');
        }
        var instance = item.instance;
        elements.each(function () {
            var input = $(this).find('input[data-id], textarea[data-id], select[data-id]');
            fillValueByInputType(input, display_type, instance, $(this));
        });
    }

    function fillValueByInputType(input, display_type, instance, objWrapper) {

        if (display_type == 'view') {
            if (input.is("input")) {
                if (input.is(":file")) {
                    // <file> element.
                    var link = '';
                    var fileNameVal = instance[input.data('id')];
                    if (fileNameVal !== null && fileNameVal !== '') {
                        var fileName = fileNameVal.split(/_(.+)?/)[1];
                        link = '<a href="' + fileNameVal + '" class="remote_download_link" download="' + fileName + '">' + fileName + '</a>';
                    }
                    input.closest('div').find('input[type="file"]').addClass('hide');
                    input.closest('div').find('.list-view-detail').removeClass('hide').html(link);

                } else if (input.is(":checkbox")) {
                    // <checkbox> element.
                    var eleValue = instance[input.data('id')];
                    var setVal = '';
                    if (typeof eleValue != 'undefined') {
                        // do something
                        if (eleValue.split('~#~').length > 1) {
                            var chkVal = eleValue.split('~#~');
                            for (var i = 0; i <= chkVal.length; i++) {
                                if (typeof chkVal[i] != 'undefined') {
                                    setVal += chkVal[i] + '</br>';
                                }
                            }
                        } else {
                            setVal = eleValue;
                        }
                    }
                    input.closest('#checkbox_wrapper').parent().find('.list-view-detail').removeClass('hide').html(setVal);
                } else if (input.is(":radio")) {
                    // <radio> element.
                    input.closest('#radio_wrapper').parent().find('.list-view-detail').removeClass('hide').text(instance[input.data('id')]);
                } else {
                    if (input.closest('#calender_wrapper').length) {
                        input.closest('#calender_wrapper').parent().find('.list-view-detail').removeClass('hide').text(instance[input.data('id')]);
                    } else {
                        input.closest('div').find('input[type="text"]').addClass('hide');
                        input.closest('div').find('.list-view-detail').removeClass('hide').text(instance[input.data('id')]);
                    }
                }
            } else if (input.is("select")) {
                // <select> element.
                input.closest('div').find('select').addClass('hide');
                var dropDownVal = instance[input.data('id')];
                if (typeof control_response.roleNames != 'undefined' && typeof control_response.roleNames[dropDownVal] != 'undefined') {
                    dropDownVal = control_response.roleNames[dropDownVal];
                }
                input.closest('div').find('.list-view-detail').removeClass('hide').text(dropDownVal);

            } else if (input.is("textarea")) {
                // <textarea> element.
                input.closest('div').find('textarea').addClass('hide');
                input.closest('div').find('.list-view-detail').removeClass('hide').text(instance[input.data('id')]);
            }

        } else if (display_type == 'edit') {
            if (input.is("input")) {
                if (input.is(":file")) {
                    // <file> element.
                    var fileWrapper = input.parent();
                    fileWrapper.find('.fileZReset').removeClass('hide');
                    fileWrapper.find('> .list-view-detail').html(instance[input.data('id')]);
                    fileWrapper.find('.bootstrap-filestyle.input-group > input').attr('value', instance[input.data('id')]);
                    input.attr('value', instance[input.data('id')]);

                } else if (input.is(":checkbox")) {
                    // <checkbox> element.
                    var eleValue = instance[input.data('id')];
                    $(objWrapper).find('#checkbox_wrapper').children(':first').attr('value', eleValue);
                    $(objWrapper).find('#checkbox_wrapper').find('input').removeAttr('checked');

                    if (typeof eleValue != 'undefined') {
                        // do something
                        var chkVal = eleValue.split('~#~');
                        for (var i = 0; i <= chkVal.length; i++) {
                            $(objWrapper).find('#checkbox_wrapper').find("input[type='checkbox'][value='" + chkVal[i] + "']").attr('checked', 'checked').prop('checked', true);
                        }
                    }
                } else if (input.is(":radio")) {
                    // <radio> element.
                    var eleValue = instance[input.data('id')];
                    var setVal = '';
                    if (typeof eleValue != 'undefined') {
                        // do something
                        $(objWrapper).find('input[type="radio"][value="' + eleValue + '"]').attr('checked', 'checked');
                    }
                } else if (input.closest('#calender_wrapper').length) {
                    input.closest('#calender_wrapper').find('input:visible').attr('value', instance[input.data('id')]);
                } else {
                    input.val(instance[input.data('id')]);
                }
            } else if (input.is("select")) {
                // <select> element.
                var eleValue = instance[input.data('id')];
                $(objWrapper).find('select option[value=' + eleValue + ']').attr('selected', 'selected');
            } else if (input.is("textarea")) {
                // <textarea> element.
                input.closest('div').find('textarea').html(instance[input.data('id')]);
            }
        }
    }

    function getHeading(wrapper, counter) {
        var heading = wrapper.find('> .list-title-heading').find('.fa');
        if (heading.length) {
            return heading[0].nextSibling.nodeValue;
        }
    }

    function appendHeading(wrapper, heading, remove_heading) {
        var heading = $('<h2 />').text(heading).addClass('headingTwo');
        var final_ele = '';

        if (wrapper.hasClass('list-detail-section')) {
            final_ele = wrapper;
        } else {
            final_ele = wrapper.find('.list-detail-section:first');
        }
        final_ele.find('> .headingTwo').remove();
        final_ele.prepend(heading);
        $('.headingTwo').parent('.list-detail-section').addClass('sub-close-cln');
    }

    function getSubClassStructureLayout(node_class_id, subchildid, fieldtype, thisobj, node_y_id, sub_class_label, count, line_count_number) {

        var eveNodeName = event.target.nodeName.toLowerCase();
        var eleFindLen = $(thisobj).find('.collapse-wrapper .list-detail-section .form-group').length;
        if ((eveNodeName == "div" || eveNodeName == "i" || eveNodeName == "a") && eleFindLen == 0) {

            var actionName;
            var displayMode = $(thisobj).attr('data-mode');
            var parentInstanceNodeId = $(thisobj).attr('data-parent-instance-node-id');
            if (displayMode == 'add') {
                actionName = 'getSubClassStr';
            } else if (displayMode == 'view') {
                actionName = 'getSubClassStrView';
            } else if (displayMode == 'edit') {
                actionName = 'getSubClassStrView';
            }
            var data = {
                'action': actionName,
                'section_mode': 'yes',
                'temp_instance_id': '',
                'class_id': node_class_id,
                'line_count_number': '',
                'count_instance': '',
                'mode': displayMode,
                'node_y_id': parentInstanceNodeId,
                'sub_class_label': ''
            };

            showFullLoader('content_loader');
            // $.post(base_plugin_url + 'code.php',
            //     data,
            //     function (d) {
            //         getSubClassStructureResponse(thisobj, d, displayMode);
            //     }, 'html');
            require(['page_module'], function (PageModule) {
                PageModule.ajaxPromise({requestType: 'POST', dataType: 'html'}, data).then(function (d) {
                        //d = JSON.parse(d);
                       // d = d.data;
                        getSubClassStructureResponse(thisobj, d, displayMode);
                    });
            });
        }
    }

    function getSubClassStructureResponse(thisobj, res, displayMode) {

        var wrapper = $(thisobj).find(".collapse-wrapper");
        wrapper.removeAttr('style');
        if (res != '') {
            if (!wrapper.length > 0) {
                $(thisobj).append('<div class="collapse-wrapper"></div>');
                wrapper = $(thisobj).find(".collapse-wrapper");
            }
            wrapper.removeClass('hide').find(".list-detail-section").remove();
            wrapper.html(res);
            wrapper.children('.list-detail-section').addClass('loaded-by-ajax');
            if (displayMode == 'add' || displayMode == 'edit') {
                var getAddNextCondition = wrapper.children('.list-detail-section').find(".add-next-condition").val();
                var hideAddBtnClass = "";
                if(getAddNextCondition=="None"){
                    hideAddBtnClass = "hide";
                }
                wrapper.children('.list-detail-section').prepend('<span style="cursor:pointer;" class="right manage-right-cls-action"><i class="prs-icon add '+hideAddBtnClass+'"></i><i class="j_my_createDeal_closeclose confirm_remove_close hide"></i></span>');
            }
        }
        setTimeout(function () {
            hideFullLoader('content_loader');
        }, 200);

        bindClick();
        setTreeId();
        setTreeChildId();
        applyDatePicker();
    }

    function bindClick() {
        //Bind collapse functionality.
        $('.listing-content-wrap .class-accordian').off('click.getSubClassStructureResponse').on('click.getSubClassStructureResponse', function () {
            if ($(this).find('.fa').hasClass('fa-angle-down')) {
                $(this).find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $(this).find('.fa').addClass('fa-angle-down').removeClass('fa-angle-up');
            }
            var nexEle = $(this).next();
            if (!$(nexEle).hasClass('right')) {
                $(this).next().slideToggle();
            } else {
                $(this).next().next().slideToggle();
            }
        });
    }

    function showActiveFilterSelection() {

        var msg = 'Please check the selected filters.';
        var popupWrapper = $('#edit-opinfo-popup');
        popupWrapper.find('p').html(msg);
        popupWrapper.modal('show');
        $('#edit-opinfo-popup .modal-footer button').on('click', function () {
            // CLOSE FILTER SIDEBAR
            $('div#menu_wraper div.sidebar_wrap a.slideToLeftNav').trigger('click');
        });
    }

    function saveFileStr(obj) {
        $(obj).parent().parent().parent();
        var formId = $('.listing-content-wrap >form').attr('id');
        var fData = new FormData(document.getElementById(formId));
        var checkVal = "";
        if (checkVal != "") {
            fData.append('imgName', checkVal);
        }
        fData.append('fileName', obj.value);
        fData.append('id', $(obj).attr('data-id'));
    }

    function toggleRevenueManagerOption(drop_down, newSelectedIptionID) {
        var selectedOptionText = drop_down.find('option:selected').text();
        var controlOperationDropdowns = $("#id_detail_content").find('.cls_853_852').find('.commonControlRoleClass');
        var optionData = {value:'archive', text:'Archive'};
        var hasAlreadySelected = controlOperationDropdowns.find('option[value="'+optionData.value+'"]:selected');
        if(hasAlreadySelected.length) {
            bootbox.confirm({
                title: 'Confirm',
                message: '"Archive" Role already exist in sub class below. If you change Role then some of the section below will be removed. Please confirm.',
                callback: function(status) {
                    if(status) {
                        drop_down.val(newSelectedIptionID);
                        hasAlreadySelected.closest('.commonControlRoleClass').closest('.list-detail-section').find('.manage-right-cls-action:first').find('.confirm_remove_close').trigger('click', {do_not_show_confirmation: 1});
                        controlOperationDropdowns.find('option[value="'+optionData.value+'"]').remove();
                    }
                }
            });
            return true;
        }
        if( (selectedOptionText.toLowerCase() == 'revenue accountant' || selectedOptionText.toLowerCase() == 'director') ) {
            if (controlOperationDropdowns.eq(0).find('option').text().toLowerCase().indexOf('archive') === -1) {
                var option = $('<option>', optionData);
                controlOperationDropdowns.append(option);
            }
        } else {
            $('option', controlOperationDropdowns).each(function(p1, p2) {
                if ($(this).text() === 'Archive') {
                    $(this).remove()
                }
            });
        }
    }

    function handleControlLayout() {
        var prevSelectedMainClassValue;
        $("body").off("focus",".controlMainDropdownClass, .commonControlRoleClass, .add-next-condition").on("focus",".controlMainDropdownClass, .commonControlRoleClass, .add-next-condition",function(){
            prevSelectedMainClassValue = $(this).val();
        });
        $("body").off("change",".controlMainDropdownClass").on("change",".controlMainDropdownClass",function() {
            var getSelectedIptionID = $(this).val();
            var selectedOptionText = $(this);
            var checkAlreadyExist = $(".controlOperationDropdownClass option[value='"+getSelectedIptionID+"']").is(":selected");
            if(!checkAlreadyExist) {
                var hasArchiveAlreadySelected = toggleRevenueManagerOption($(this), getSelectedIptionID);
                if(hasArchiveAlreadySelected) {
                    $(this).val(prevSelectedMainClassValue);
                    return false;
                }
                $(".commonControlRoleClass").each(function(){
                    $(this).find("option").each(function(){
                        if($(this).val()==getSelectedIptionID){
                            $(this).attr("disabled",true);
                        } else if($(this).val()==prevSelectedMainClassValue) {
                            $(this).attr("disabled",false);
                        }
                    })
                });
            } else {
                bootbox.alert("This Role already exist in sub class below.");
                $(".controlMainDropdownClass").val(prevSelectedMainClassValue);
            }
        });

        $("body").off("change",".commonControlRoleClass").on("change",".commonControlRoleClass",function(){
            var getSelectedIptionID = $(this).val();
            var checkAlreadyExist = $(this).closest(".roleCloneContainer").nextAll().find(".commonControlRoleClass option[value='"+getSelectedIptionID+"']").is(":selected");
            if(!checkAlreadyExist){
                $(this).closest(".roleCloneContainer").nextAll().each(function() {
                    var prevValue = $(this).prev(".roleCloneContainer").find(".commonControlRoleClass");
                    $(this).find(".commonControlRoleClass").each(function() {
                        $(this).find("option").each(function() {
                            var getPrevID =  prevValue.find("option[value='"+$(this).val()+"']").attr("disabled");
                            if($(this).val()==getSelectedIptionID || getPrevID) {
                                $(this).attr("disabled",true);
                            } else {
                                $(this).attr("disabled",false);
                            }
                        });
                    });
                });
                if($(this).hasClass("controlPassDealDropdownClass")) {
                    var getDataSettings = $(".controlMainDropdownClass :selected").data().hasOwnProperty('settings') ? JSON.parse($(".controlMainDropdownClass :selected").attr("data-settings")) : {};
                    var getValue = $(this).val();
                    var searchValue = getDataSettings[getValue];
                    if(searchValue!=undefined) {
                        $(this).closest(".form-group").next(".form-group").find(".common-operation").val(searchValue.toString());
                    } else {
                        $(this).closest(".form-group").next(".form-group").find(".common-operation").val("");
                    }
                }
            }
            else{
                bootbox.alert("This Role already exist in sub class below.");
                $(this).val(prevSelectedMainClassValue);
            }
        });

        $("body").off("change",".add-next-condition").on("change",".add-next-condition",function(){
            var getVal = $(this).val();
            if(getVal=="None"){
                if($(this).closest(".list-detail-section").next(".list-detail-section").length==0){
                    $(this).closest(".list-detail-section").find(".prs-icon.add").addClass("hide");
                } else {
                    $(this).val(prevSelectedMainClassValue);
                    bootbox.alert("You cannot choose this option as you have more conditions below");
                }
            } else {
                if($(this).closest(".list-detail-section").next(".list-detail-section").length==0){
                    $(this).closest(".list-detail-section").find(".prs-icon.add").removeClass("hide");
                }
            }
        });

    }

    function commonCollapseExpand(container, fieldSelector) {
        var arrayCollapsiblePanels = collapsiblePanels(container);
        var ObjFillUnfill = createObjFillUnfill(arrayCollapsiblePanels, fieldSelector)
        collapsedExpand(ObjFillUnfill);
    }

    function collapsiblePanels(container) {
        var collapsiblePanels = [];
        $(container).find('[data-toggle=collapse]').each(function() {
            collapsiblePanels.push($(this).attr('href'))
        });
        return collapsiblePanels;
    }


    function createObjFillUnfill(arrayCollapsiblePanels, filledSelector) {
        var panelsObj = {
            'filled': [],
            'unfilled': []
        }
        var count = 0;

        $.each(arrayCollapsiblePanels, function(collapseDataIndex, collapseDataId) {
            $(collapseDataId).find( filledSelector ).each(function(index, value) {
                count++
                if($(this).val() !== '') {
                    panelsObj['filled'].push(collapseDataId);
                    return false;
                }
                else if ($(collapseDataId).find( filledSelector ).length == count) {
                    panelsObj['unfilled'].push(collapseDataId);
                    count = 0;
                }
            });
        });
        return panelsObj;
    }
    function collapsedExpand(filledUnfillObj) {
        for (key in filledUnfillObj) {
            if(key === 'filled' && filledUnfillObj[key].length) {
                expanded(filledUnfillObj[key]);
            } else if (key === 'unfilled' && filledUnfillObj[key].length){
                collapsed(filledUnfillObj[key]);
            }
        }
    }
    function collapsed(collapsedId) {
        $.each(collapsedId, function(i, idName) {
            $('[href=' + idName + ']').addClass('collapsed')
            $(idName).collapse('hide');
        })
    }

    function expanded(expandedId) {
        $.each(expandedId, function(i, idName) {
            $('[href=' + idName + ']').removeClass('collapsed');
            $(idName).collapse('show');
        });
    }

    function onSearchFiErrorCode(data) {
        if(!fi_ErrorPopupVisible) {
            bootbox.alert({title: 'Alert', message: data.errorMsg, callback: function() {
                fi_ErrorPopupVisible = 0;
                FIQuoteModule.revertOldFiNumber();
            }});
            fiLoaderTextHide('firstText');
            fiLoaderTextHide('secondText');
            fiLoaderTextHide('thirdText');
            $.do_not_hide_loader = false;
            hideFullLoader(fiApiObject.loaderId);
            fi_ErrorPopupVisible = 1;
        }
    }

    function checkEmpty(className) {
        var $className = $(className);
        if( $className.val() === '') {
            toggleField(className, 'addClass', 'hide')
        } else{
            toggleField(className, 'removeClass', 'hide')
        }
    }

    function toggleField(slector, method, className) {
         var selectorExist = $(slector).length;
            if(selectorExist) {
                $(slector).closest('.form-group')[method](className)
            }
    }

    function ConvertToLocalTime(utcTime, divID) {
        d = new Date(1000 * utcTime);
        divID = divID || "timestamp-" + utcTime;
        var ante_post_meridian,
            date = [d.getMonth()+1, d.getDate(), d.getFullYear()],
            time = [d.getHours(), d.getMinutes()];
            if(time[0] > 12) {
                time[0] -= 12;
                ante_post_meridian = ' pm ';
            } else {
                ante_post_meridian = ' am ';
            }
            var i = 3;
            while(i) {
                --i;
                if(date[i] < 10) date[i] = '0'+date[i];
                if(time[i] < 10) time[i] = '0'+time[i];
            }
            $('#'+divID).html(date.join('/')+ '<br /> ' + time.join(':') + ante_post_meridian);
    }

    function getAllActiveRoleHTML(propertyId) {
        var $locationSearchField = $("#instance_property_caption" + propertyId);
        var location = $.trim($locationSearchField.val());
        var searched = $locationSearchField.data().hasOwnProperty('search');
        var matchSearchData = location === (searched ? $locationSearchField.data('search') : '');
        var $mainContainer = $('#cls_822_858');
        var $container = $mainContainer.find('.list-detail-section');
        var data = {
            'action': 'locationRole',
            'location': location
        };
        if ( location !== '' && !searched ) {
            $locationSearchField.data('search', location);
            ajaxForStoreClass(data);
        } else if(!matchSearchData){
            $locationSearchField.data('search', location);
            $container.find('#instance_property_caption8758').val(location);
        }
    }

function setSearchAttr(locationSearchField) {
        var searched = locationSearchField.data().hasOwnProperty('search');
        if(!searched) {
            locationSearchField.data('search', location);
        }
    }
function ajaxForStoreClass(data) {
    $.post(base_plugin_url + 'code.php', data, function(response) {
        addStore(response);
    }, 'json');
}

function addStore(response) {
    var stores = response.classPropArray;
    var $mainContainer = $('#cls_822_858');
    $mainContainer.removeClass('hide');
    var k = 0;
    var $wrapper = $('#cls_822_858 .collapse-wrapper .list-detail-section:not(".hide")');
    var wrapperLen = $wrapper;
    if (wrapperLen) {
        $wrapper.remove();
    }

    for (var i in stores) {
        k++;

        $mainContainer.find('.list-detail-section:first').addClass('sub-close-cln').clone().appendTo('#cls_822_858 .collapse-wrapper').removeClass('hide');
        var $container = $mainContainer.find('.list-detail-section');
        if (i === '436104') {
            $container.find('.manage-right-cls-action').eq(k).removeClass('hide')
        } else {
            $container.find('.manage-right-cls-action').eq(k).addClass('hide');
        }
        $container.eq(k).prepend('<h2 class="headingTwo">Location Role Details ' + k + '</h2>');
        $container.eq(k).find('#instance_property_caption8756').val(i);
        $container.eq(k).find('#instance_property_caption8758').val(response['location']);
        $container.eq(k).find('input.validationCheck:not(".actor, .email-address")').attr('readonly', 'readonly');
        for (var j in stores[i]) {
            if (j === 'Title') {
                $container.eq(k).find('#instance_property_caption8759').val(stores[i][j]);
            }
        }
    }
}

function callMethod(selectors, method, className) {
    var selectorExist = $(selectors).length;
    if (selectorExist) {
        $(selectors)[method](className)
    }
}

function cloneRoleButton() {
    var $rolenid = $('.rolenid');
        $rolenid.each(function(index, val) {
            if ( $(this).val() === '436104' ) { // sales consultant
                $(this).closest('.list-detail-section').find('.confirm_remove_close').addClass('hide');
                $(this).closest('.list-detail-section').find('.add').removeClass('hide');
            } else {
                $(this).closest('.list-detail-section').find('.confirm_remove_close, .add').addClass('hide');
            }
        })
}

function scrollToBottom(selector) {
    setTimeout(function () {
        $(selector).find('.customScroll:first').mCustomScrollbar("scrollTo", "bottom")
    }, 500)
}

function setReadOnly() {
     var $mainContainer = $('#cls_822_858'),
         $container = $mainContainer.find('.list-detail-section');
         $container.find('input.validationCheck:not(".actor, .email-address")').attr('readonly', 'readonly');
}


   return {
        selectCustomer: selectCustomer,
        responseSelectCustomer: responseSelectCustomer,
        selectStock: selectStock,
        responseSelectStock: responseSelectStock,
        selectCustomerSearch: selectCustomerSearch,
        selectSalesSearch: selectSalesSearch,
        getCustomer: getCustomer,
        selectUnitSearch: selectUnitSearch,
        getStock: getStock,
        loadMenuListByAjax: loadMenuListByAjax,
        responseMenuList: responseMenuList,
        responseListHeader: responseListHeader,
        getListHeaders: getListHeaders,
        responseListContent: responseListContent,
        getListContent: getListContent,
        renderViewDetails: renderViewDetails,
        getRolesOfPlugin: getRolesOfPlugin, // function to handle "Roles" click on Deals page.
        searchActorForParticulerRole: searchActorForParticulerRole,
        searchDealsFormSelect: searchDealsFormSelect,
        searchCustomer: searchCustomer,
        responseSearchCustomer: responseSearchCustomer,
        getRecordPageDetail: getRecordPageDetail,
        resetAllFilters: resetAllFilters,
        callEditContentAction: callEditContentAction,
        callOnholdContentAction:callOnholdContentAction,
        saveOnholdReason :saveOnholdReason,
        restoreOnholdContentAction : restoreOnholdContentAction,
        saveRolesActorAndDeals: saveRolesActorAndDeals,
        responsesaveRolesActorAndDeals: responsesaveRolesActorAndDeals,
        fileValidation: fileValidation,
        _init: _init,
        applyJs: applyJs,
        getFilterList: getFilterList,
        updateMenuCount: updateMenuCount,
        responseMenuCount: responseMenuCount,
        resetHeadFilters: resetHeadFilters,
        getHeadFilterArr: getHeadFilterArr,
        getColHeadFilter: getColHeadFilter,
        getColHeadPropertyId: getColHeadPropertyId,
        updateActiveList: updateActiveList,
        callGetFilterList: callGetFilterList,
        setTbodyHtLayout: setTbodyHtLayout,
        listPage: listPage,
        paginationOfPluginList: paginationOfPluginList,
        responseListPagination: responseListPagination,
        adjustWindowHeight: adjustWindowHeight,
        responseContentForm: responseContentForm,
        editFormSetValues: editFormSetValues,
        callDetailsContentAction: callDetailsContentAction,
        responseRolesOfPlugin: responseRolesOfPlugin,
        getRecordPerPageValue: getRecordPerPageValue,
        getAjaxParams: getAjaxParams,
        applyDatePicker: applyDatePicker,
        setValueOfNodeZ: setValueOfNodeZ,
        setValueOfNodeZcheckBox: setValueOfNodeZcheckBox,
        cancelFormAction: cancelFormAction,
        downloadPdf: downloadPdf,
        downloadReportPdf: downloadReportPdf,
        showsignFlyout: showsignFlyout,
        showsignonHoldFlyout : showsignonHoldFlyout,
        setSigning: setSigning,
        responseDocumentSignature: responseDocumentSignature,
        deleteItemInstance: deleteItemInstance,
        searchStock: searchStock,
        openStockFlyout: openStockFlyout,
        publishDeal: publishDeal,
        getSubClassStructureLayout: getSubClassStructureLayout,
        showhideVal: showhideVal,
        toggleHinDetails: toggleHinDetails,
        makePostTree: makePostTree,
        setTreeChildId: setTreeChildId,
        setTreeId: setTreeId,
        manageCloneWrapperId: manageCloneWrapperId,
        saveFileStr: saveFileStr,
        addLocation: addLocation,
        bindClick: bindClick,
        showActiveFilterSelection: showActiveFilterSelection,
        searchSalesQuote: searchSalesQuote,
        responseSearchSalesQuote: responseSearchSalesQuote,
        selectSalesQuote: selectSalesQuote,
        responseSelectSalesQuote: responseSelectSalesQuote,
        searchFi: searchFi,
        hideShowDialougeIcon: hideShowDialougeIcon,
        hideShowAddBtn: hideShowAddBtn,
        downloadReportPdfReview: downloadReportPdfReview,
        searchSelectSalesQuote: searchSelectSalesQuote,
        deleteOptionalOperation: deleteOptionalOperation,
        printPackageDocument: printPackageDocument,
        printPackageDocumentHtml: printPackageDocumentHtml,
        toggleChecked: toggleChecked,
        toggleCheckallCheckbox: toggleCheckallCheckbox,
        deleteOprIns: deleteOprIns,
        handleControlLayout: handleControlLayout,
        roleWiseAddDeal: roleWiseAddDeal,
        commonCollapseExpand: commonCollapseExpand,
        routeAfterAddDeal: routeAfterAddDeal,
        getAllActiveRoleHTML: getAllActiveRoleHTML,
        onSearchFiErrorCode: onSearchFiErrorCode,
        ConvertToLocalTime:ConvertToLocalTime,
        checkEmpty:checkEmpty,
        toggleField:toggleField,
        resetSortFilters: resetSortFilters,
        resetListHeadSearchFilter: resetListHeadSearchFilter,
        filterApplied: filterApplied,
        resetSortedClass: resetSortedClass
    };
});
