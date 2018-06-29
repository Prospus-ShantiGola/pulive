define(function() {
    var ajax_options = {
        detail_panel_xhr: null,
        ajaxPromise_xhr: null
    };
    function AjaxModule() {
        this.defaults = {
            options: {
                url: base_plugin_url + 'code.php',
                type: 'post',
                data: {},
                success: function () {
                    console.log('success');
                },
                complete: function () {
                    // console.log('complete');
                },
                beforeSend: function() {
                    if(ajax_options.detail_panel_xhr !== null) {
                        ajax_options.detail_panel_xhr.abort();
                        ajax_options.detail_panel_xhr = null;
                    }
                }
            }
        }
    };

    AjaxModule.prototype.ajax = function ( options ) {
        var ajaxParams = $.extend({}, this.defaults.options, options);
        ajax_options.detail_panel_xhr = $.ajax(ajaxParams);
    };
    AjaxModule.prototype.ajaxPromise = function( settings, data ) {

        var deferred = new $.Deferred();
        var _this = this;
        settings.timeout = settings.timeout || 30000;

        ajax_options.ajaxPromise_xhr = $.ajax({
            url: base_plugin_url + 'code.php',
            type: settings.requestType || 'GET',
            data: data,
            dataType: settings.dataType,
            timeout: settings.timeout,
            beforeSend: function() {
              if(ajax_options.ajaxPromise_xhr !== null && settings.abort) {
                  ajax_options.ajaxPromise_xhr.abort();
                  ajax_options.ajaxPromise_xhr = null;
                  GoToPageModule.options.is_page_loading = false;
              }
            },
            success: function(response) {
                if(!response) { // if server does not return anything then show error.
                    deferred.reject(response);
                    handleAjaxError.showBootboxError({message: 'Error: Empty server response.'});
                    return true;
                }
                if(response['status'] == '0') {
                    deferred.reject(arguments);
                    handleAjaxError.showBootboxError({message: response['message']});
                } else {
                    deferred.resolve(response);
                }
            },
            error: function(jqXHR, textStatus) {
                handleAjaxError.showCustomError(jqXHR, textStatus, {timeout: settings.timeout, action: data.action});
				deferred.reject(arguments);
            }
        });
        return deferred.promise();
    }
    return AjaxModule;
});
