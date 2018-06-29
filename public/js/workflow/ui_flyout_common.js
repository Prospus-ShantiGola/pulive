$(function () {

    var body = body || $('body');
    var documentEle = $(document);
    var action_menu = body.data('ui-action_menu');

    body.on('click', '.open-flyoutv2', function (evt) {
        var clicked_element = $(evt.target);
        var node_type = clicked_element.prop('nodeName').toLowerCase();
        if ((node_type == 'i' || node_type == 'span')) {
            if (clicked_element.parent().hasClass('open-flyoutv2')) {
                clicked_element = clicked_element.parent();
            }
        }

        // below section is for "Share Access" and "Share Report"
        var dataParams = clicked_element.data('params');
        if (dataParams.currentShareAction) {
            $currentShareAction = dataParams.currentShareAction;
        }
        action_menu.flyoutV2(clicked_element);
    });


    // bind event listener when model popup is shown
    var confirmationPopup = $('#exit-confirmation-temp');
    confirmationPopup.on('shown.bs.modal', function (evt) {
        var targetElement = $(this).find('.modal-btn-wrapper').data('target');
        $(this).find('.accept-action-js').off('click').on('click', function () {

            if ($('.search-blocks:visible').length > 1) {
                var orgnameTmp = $('.organization-list-wrapper.active-tr').find('.show-organizatoin-name').text();
                var selUserForOa = $('.ui-item-active:visible').attr('data-item-title');
                var otherselUserForOa = $('.search-blocks:visible').not('.ui-item-active').attr('data-item-title');
                var oaText = 'You have selected '+selUserForOa +' to be the organization administrator of '+orgnameTmp+'. '+otherselUserForOa +' does not have any other role on this organization. Please choose from the following options for User:';
                $('#merge-oa-role-popup .popup-heading').html(oaText);
                $('#merge-oa-role-popup').removeClass('hide').modal('show');
            } else {
                targetElement.trigger('click');
            }


        });
        $(this).find('.deny-action-js').off('click').on('click', function () {
            targetElement.removeAttr('data-show-confirmation');
        });
    });


    confirmationPopup.on('hidden.bs.modal', function () {
        var targetElement = $(this).find('.modal-btn-wrapper').data('target');
        targetElement.removeAttr('data-show-confirmation');
        if (!action_menu.options.isflyoutv2Open) {
            action_menu.options.hasUsersListCreated = false;
        }
    });

    // attach event listeners on custom events
    documentEle.on('beforeOrgSearch', function (e) {
        //when search starts, disable "Merge" button if isMergeMode is true              
        if (action_menu.options.isMergeMode) {
            var mergeBtn = $(action_menu.options.actionMenuWrapper).find('.merge-organization-detail');
            mergeBtn.addClass('inactive');
        }
    });
    documentEle.on('editItemOnAjaxSuccess', function (e) {

        var elementContainer = e.params.element_to_update;
        elementContainer.find('.cancel-selection').off('click').on('click', function () {
            var _this = $(this), selectionType = _this.data('selectionType'), funName = '';
            if (_this.attr('data-show-confirmation')) {
                _this.removeAttr('data-show-confirmation');
                funName = selectionType + 'Remove';
                window[funName](_this);
            } else {
                _this.attr('data-show-confirmation', 1);
                var confirmationPopup = $('#exit-confirmation-temp');
                confirmationPopup.find('.modal-btn-wrapper').data('target', _this);
                var message = action_menu.options.messages['remove_' + selectionType];
                confirmationPopup.find('.popup-text-temp').text(message);
                confirmationPopup.modal({
                    show: true
                });
            }
        })
    });
});
function locationRemove(element) {
    var container = element.closest('.deiail-fields');
    container.find('.cloud-wrap').find('.item-cloud, .cloud-arrow').not('.cloud-chart-select').remove();
    container.find('.cloud-chart-select').removeClass('hide');
    $('.areamenuitem').val(0);
    element.addClass('hide');
}
function categoryRemove(element) {
    var container = element.closest('.deiail-fields');
    container.find('.category-selector').find('.item-cloud, .cloud-arrow').not('.cloud-chart-select').remove();
    container.find('.cloud-chart-select').removeClass('hide active');
    $('.categorymenuitem').val(0);
    element.addClass('hide');
}
function priorityRemove(element) {
    var container = element.closest('.deiail-fields');
    var items_to_remove = container.find('.priority-slide').not('.cloud-chart-select').removeClass('orange red yellow').addClass('hide').text('Select');
    container.find('input[name="item_priority"]').val('');
    container.find('input[name="item_priority_value_id"]').val('');
    // items_to_remove.remove();    

    container.find('.cloud-chart-select').removeClass('hide');
    container.find('.selected-priority-items').text('');
    $('.priority-item-slide .priority-list').find('.active').removeClass('active');
    $(".priority-item-slide .priority-chkbox:checked").attr('checked', false);
    element.addClass('hide');
}
function mediaRemove(element) {
    element.closest('.media').fadeOut(300).remove();
}

var ObserverModule = (function () {
    var showAddObserverForm = function (action_menu) {
        $('.menu-wrapper .share-users-menu').removeClass('hide');

        //    $('.menu-wrapper .share-users-menu').addClass('hide');
        //    userActionWrap.find('.open-flyoutv2').removeClass('hide');
        // setTimeout function is being used so that flyout displays properly before doing anything else
        setTimeout(function () {
            $('#all-share-users').trigger('click');
            $('.add-new-share-users').trigger('click');
        }, 500);

    }
    return {
        showAddObserverForm: showAddObserverForm
    };
}());


//below function used to be in 'dashboard_vessel_ajaxhandler.php' file
function searchByTerm() {

    var dashboardElement = $('.dashboard');

    //handle "Remove" and "Transfer" button click
    var removeItemBtn = dashboardElement.find('.diaplay-wrapper').find('.js-remove-item');
    removeItemBtn.off('click.remove-item').on('click.remove-item', function () {
        var vesselItemType = $(this).closest('.role-body').find('.search-by-term').data('vesselItemType');
        showRemoveConfirmation($(this), element_ref[vesselItemType].message);
    });
    //handle enter press on input
    var searchInputEle = dashboardElement.find('.diaplay-wrapper').find('.search-term');
    searchInputEle.off('keyup.search_term').on('keyup.search_term', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            $(this).parent().find('.search-by-term').trigger('click');
        }
    });
    //handle '.search-by-term' click
    var searchBtn = dashboardElement.find('.diaplay-wrapper').find('.search-by-term');
    var action_menu = $('body').data('ui-action_menu');
    searchBtn.off('click.search_by_term').on('click.search_by_term', function () {
        var inputEle = $(this).closest('.vessel-roles-email-field').find('.search-term');
        var search_term = $.trim(inputEle.val());
        if (search_term) {
            action_menu.flyoutV2($(this), search_term);
        }
    });
    var documentEle = $(document);
    documentEle.off('flyoutv2_before_open.search_by_term').on('flyoutv2_before_open.search_by_term', function (params) {

        var dashboardEle = documentEle.find('.dashboards').parent();
        if (
                documentEle.find('.main-vessels-menu:visible').hasClass('_active') ||
                dashboardEle.hasClass('_active') ||
                documentEle.find('.organizatin-menu:visible').hasClass('_active')
                ) {// if vessels menu is active

            var vesselItemType = action_menu.flyoutV2OpenedByElement.data('vesselItemType');
            if(typeof vesselItemType == 'undefined') {
                return params;
            }
            //create addItem anchor dynamically based on 'vesselItemType'

            var addItemClassName = 'add-' + vesselItemType + '-js';
            var addItemTitle = 'Add ' + vesselItemType.charAt(0).toUpperCase() + vesselItemType.slice(1);

            var addItemAnchor = '<a href="javascript:void(0);" class="' + addItemClassName + '"><i class="icon add-user-black"></i><span>' + addItemTitle + '</span></a>';

            params.buttons.unshift(addItemAnchor);

            params.buttons.unshift('<a href="javascript:void(0);" class="inactive select-item-js select-item-default"><i class="icon accept"></i><span>Select</span></a>');
            //params.buttons.unshift('<a href="javascript:void(0);" class="inactive search-user-js"><i class="icon search"></i><span>Search</span></a>');

            params.callback = function (action_menu, flyoutv2_menu_wrapper) {

                var list_container = action_menu.element.find(action_menu.options.flyoutv2Selector);
                var searchInput = list_container.find('.list-items-js');

                if ($.trim(searchInput.val())) {
                    var params = $.parseJSON(action_menu.flyoutV2OpenedByElement.attr('data-params'));
                    params.userType = action_menu.getRoleId();
                    action_menu.flyoutV2OpenedByElement.attr('data-params', JSON.stringify(params));
                    action_menu.searchItems(list_container, searchInput, action_menu.flyoutV2OpenedByElement);
                }

                flyoutv2_menu_wrapper.find('.' + addItemClassName).off('click.add-new-item').on('click.add-new-item', function () {
                    var funName = 'addNew' + vesselItemType.charAt(0).toUpperCase() + vesselItemType.slice(1);

                    window[funName](action_menu.element, flyoutv2_menu_wrapper);
                    action_menu.removeFlyoutv2();
                });

                // bind event on '.select-item-js'
                flyoutv2_menu_wrapper.find('.select-item-js').off('click.flyoutv2_select_item').on('click.flyoutv2_select_item', function () {
                    var selectedItem = list_container.find('.ui-item-active');
                    if (selectedItem.length) {

                        if (action_menu.flyoutV2OpenedByElement) {
                            var elementSelector = action_menu.flyoutV2OpenedByElement.data('elementSelector');

                            if (elementSelector) {
                                var vesselTypes = {
                                    guest: {
                                        id: '#add-vessel-manager-submit',
                                        vessel_type_conatiner: '.vessel-manager-member',
                                        snippet_element: '.add-new-vessel-manager-wrapper'
                                    },
                                    crew: {
                                        id: '#add-vessel-crew-submit',
                                        vessel_type_conatiner: '.vessel-crew-member',
                                        snippet_element: '.add-new-vessel-crew-wrapper'
                                    },
                                    admin: {
                                        id: '#add-vessel-administrator-submit',
                                        vessel_type_conatiner: '.vessel-administrator-member',
                                        snippet_element: '.add-new-vessel-administrator-wrapper.snippet'
                                    },
                                    owner: {
                                        id: '#add-vessel-owner-submit',
                                        vessel_type_conatiner: '.vessel-owner-member',
                                        snippet_element: '.add-new-vessel-owner-wrapper'
                                    }
                                }


                                var anchorEle = $('<a></a>').attr({
                                    href: 'javascript:void(0)',
                                    id: vesselTypes[vesselItemType]['id'].replace('#', '')
                                }).addClass('custom_trigger');

                                var idArr, nameArr = [], textArr = [];

                                if (vesselItemType == 'guest') {
                                    vesselmanagerId = [];
                                    vesselmanagerName = [];

                                    idArr = vesselmanagerId;
                                    nameArr = vesselmanagerName;

                                } else if (vesselItemType == 'crew') {
                                    vesselcrewId = [];
                                    vesselcrewName = [];
                                    textArr = [];

                                    idArr = vesselcrewId;
                                    nameArr = vesselcrewName;
                                    //textArr = roleText;
                                } else if (vesselItemType == 'admin') {
                                    vesseladministratorId = [];
                                    vesseladministratorName = [];

                                    idArr = vesseladministratorId;
                                    nameArr = vesseladministratorName;
                                } else if (vesselItemType == 'owner') {
                                    vesselownerId = [];
                                    vesselownerName = [];
                                    idArr = vesselownerId;
                                    nameArr = vesselownerName;
                                }

                                appendSelectedUsersList(selectedItem, vesselItemType, vesselTypes, idArr, nameArr, textArr);
                                var ownerType = selectedItem.data('item-type');
                                var body = $('body');
                                body.append(anchorEle);
                                body.find(vesselTypes[vesselItemType]['id']).trigger('click', ownerType);

                                //do not remove below commented line
                                // selectOwnerAdminCrewGuest(selectedItem, vesselItemType);
                            }
                        }
                        action_menu.removeFlyoutv2();
                    }
                });
            };
            return params;
        }
        return params;
    });
}

// var documentEle = $(document);
// documentEle.off('flyoutv2_before_open.move_survey').on('flyoutv2_before_open.move_survey', function (params) {

//     var actionMenu = $('body').data('ui-action_menu');

//     if(actionMenu.flyoutV2OpenedByElement.hasClass('move-item')) {

//         params.callback = function (action_menu, flyoutv2_menu_wrapper) {

//                 var list_container = action_menu.element.find(action_menu.options.flyoutv2Selector);
//                 var searchInput = list_container.find('.list-items-js');

//                 var params = $.parseJSON(action_menu.flyoutV2OpenedByElement.attr('data-params'));

//                 action_menu.flyoutV2OpenedByElement.attr('data-params', JSON.stringify(params));

//                 action_menu.searchItems(list_container, searchInput, action_menu.flyoutV2OpenedByElement);

//         };
//         return params;
//     }
//     return params;
// });