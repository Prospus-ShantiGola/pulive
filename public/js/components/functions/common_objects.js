let connectionError = (function() {
    var is_popup_visible = false, error_modal, dot_counter = 1, interval;
    return {
        showNotification: function() {
            if(is_popup_visible) {
                return false;
            }
            is_popup_visible = 1;
            let notificationWrapper = $('<div />').addClass('toppy').attr({id: 'connection-notification'});
            let txtElement = $('<h5 />').html('Connection lost. <span id="error-progress">Reconnecting</span>');
            notificationWrapper.append($('<div />').addClass('ct-text').append(txtElement));
            $('body').prepend(notificationWrapper);
            this.showProgressText(notificationWrapper.find('#error-progress'));
        },
        showProgressText: function(element_ref) {
            interval = setInterval(function() {
                if(dot_counter > 3) {
                    dot_counter = 0;
                }
                let dots = (new Array(dot_counter + 1)).join('.');
                element_ref.text('Reconnecting'+dots);
                dot_counter++;
            }, 500);
        },
        showPopup: function(error_obj) {
            let _this = this;
            if(is_popup_visible) {
                return false;
            }
            is_popup_visible = true;
            var msg = 'We are experiencing some problem in connectivity with server.<br />Please bear with us while we are trying to resume.';
            msg +=' <span id="error-progress">Reconnecting</span>';
            error_modal = bootbox.alert({
                title: 'Sorry!',
                message: msg,
                closeButton: false,
                callback: function() {
                    _this.hidePopup();
                    _this.showNotification();
                }
            });
            error_modal.on('shown.bs.modal', function() {
                let __this = $(this)
                _this.showProgressText(__this.find('#error-progress'));
            });
        },
        hidePopup: function() {
            is_popup_visible = false;
            dot_counter = 1;
            if(error_modal) {
                error_modal.modal('hide');
                error_modal = undefined;
            }
            clearInterval(interval);
            $('#connection-notification').remove();
        },
        isErrorPopupVisible() {
            return is_popup_visible;
        },
        isServerResponding() {
            var dfd = jQuery.Deferred();
            var xhr = new XMLHttpRequest();
            var file = "https://jsonplaceholder.typicode.com/users";
            var randomNum = Math.round(Math.random() * 10000);

            xhr.open('HEAD', file + "?rand=" + randomNum, true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);

            function processRequest(e) {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 304) {
                        dfd.resolve( 1 ); // "connection exists!"
                    } else {
                        dfd.reject( 0 ); // "connection doesn't exist!"
                    }
                }
            }
            return dfd.promise();
        }
    }
}());
module.exports = {
    ConnectionError: connectionError
};
