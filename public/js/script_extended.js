var ErrorModule = (function() {
    function getErrorElement(error_settings) {
        return '<span class="' + error_settings.error_class + '">! Required Field.</span>';
    }
    function removeError(container, error_class) {
        var errorClasses = {
            'error-msg': 'letter-error-msg',
            'letter-error-msg': 'error-msg'
        };
        container.find('.'+error_class).remove();
        container.find('.'+errorClasses[error_class]).remove();// remove other error elements as well
    }

    return {
        appendErrorAfter: function(insert_after_element, error_element_settings) {
            var defaultSettings = $.extend({error_class: 'error-msg'}, error_element_settings || {});
            removeError(insert_after_element.parent(), defaultSettings.error_class);
            insert_after_element.after(getErrorElement(defaultSettings));
        }
    }
}());
window.puJsFileLoadCounter++;