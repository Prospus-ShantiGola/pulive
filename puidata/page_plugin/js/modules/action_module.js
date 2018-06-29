define(function() {

    return {
        ajax: function(data, settings) {
            var final_settings = {
                type: 'Post',
                dataType: 'json'
            };
            if (typeof settings !== 'undefined') {
                final_settings = $.extend({}, final_settings, settings);
            }
            return $[final_settings.type.toLowerCase()](base_plugin_url + 'code.php', data);
        },
        confirmDelete: function(params) {
            var self = this;
            var deferred = new $.Deferred();
            bootbox.confirm({
              title: "Confirm",
              message: params.msg,
              callback: function(result) {
                deferred.resolve(result);
                if(result) {
                  showFullLoader(params.loader);
                  $.when(self.ajax(params.data)).then(function(response) {
                    params.callback(response);
                  });
                }
              }
            });
            return deferred.promise();
        },
        loadPage: function() {
            var self = this;
            var loaderId = 'full_page_loader';
            var params = {
                data: '',
                callback: function() {
                    $.when(loadMenuListByAjax('', true), getListHeaders(true), getListContent(true)).then(function() {
                        var level1Arguments = arguments;
                        responseMenuList(level1Arguments[0][0]);
                        responseListHeader(level1Arguments[1][0]);
                        responseListContent(level1Arguments[2][0], '', {
                            do_not_execute: 1
                        });
                        var listId = $("#id_listing_body")
                        var activeTr = listId.find('.active-tr');
                        var instance_id = activeTr.attr('data-id');

                        $.when(paginationOfPluginList(true), renderViewDetails(activeTr, instance_id, 'view', true)).then(function() {
                            var level2Arguments = arguments;
                            responseListPagination(level2Arguments[0][0]);
                            responseContentForm($.parseJSON(level2Arguments[1][0]));
                            leftNavigationModule.init();
                            LayoutExtendedModule._init();
                            applyJs();
                            hideFullLoader(loaderId);
                        });
                    });
                }
            };
            showFullLoader(loaderId, params);
        },
        mergeGlobalVariables: function(params) {
            var data = {
                'node_id': menu_list_instance_id,
                'list_mapping_id_array': list_mapping_id_array,
                'login_user_id': login_user_id,
                'roleId': login_role_id,
                'list_head_array': list_head_array,
                'list_setting_array': list_setting_array,
                'list_node_id_array': list_node_id_array,
            };
            if (typeof params != 'undefined' && typeof params === "object") {
                data = $.extend(data, params);
            }
            return data;
        }
    }
    console.log('action_module');
});
