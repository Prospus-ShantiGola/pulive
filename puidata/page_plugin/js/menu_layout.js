var searchModule = (function () {
        var properties = {
            searchItemWrap: '.search-item-wrap',
            searchTextboxJS: '.search-text-box-js',
            searchTextbox: '#search-text-box',
            itemListLi: '.item-list li',
            activeItemListLi: '.item-list li.active',
            cache: {},
            elementRef: {}
        }


        function searchString() {
            searchWrapper = $(properties.searchItemWrap);
            var searchString = $.trim(searchWrapper.find(properties.searchTextbox).val());
            var activeLi = $(properties.activeItemListLi);
            var propertyId = activeLi.data('statusid');
            if (!searchString) {
                properties.cache = {};
                return false;
            }
            properties.cache.searchString = searchString;
            var searchFilter = $.trim(activeLi.find('a').html().replace(/<span (.*)<\/span>/g, "")).toLowerCase();
            searchFilter = (searchFilter == 'all') ? '' : searchFilter;
            //Ajax Call
            var url = base_plugin_url + 'code.php';
            var reqData = {'action': 'list_content', 'list_head_array': list_head_array, 'list_setting_array': list_setting_array, 'status': searchFilter, 'propertyId': propertyId, 'search_string': searchString};
            var callback = {success: responseListContent};
            makeAjaxCall(url, reqData, callback);
        }
        function clearCache() {
            if (!(key in properties.cache.searchString)) {
                properties.cache = {};
            }
        }
        function resetSearchInput() {
            properties.cache = {};
            $(properties.searchItemWrap + properties.searchTextbox).val('');
        }
        function checkAddEditForm(obj) {
            if ($('#id_detail_content').find('form:visible').length) {
                $('#confirmation-popup #exit-confirmation').data('clickclass', obj);
                $('#confirmation-popup').modal('show');
                return false;
            }


        }
        function addHighlight(obj){
        	if (properties.cache.searchString) {
                obj.highlight(properties.cache.searchString);
            }
        }
        function makeAjaxCall(url, data, callback) {
            var callback = callback || {
                beforeSend: function () {

                },
                success: function () {

                },
                complete: function () {

                }
            }

            $.ajax({
                url: url || base_plugin_url + 'code.php',
                type: 'post',
                data: data,
                beforeSend: function () {
                    if ($.isFunction(callback.beforeSend)) {
                        callback.beforeSend();
                    }
                },
                success: function (response) {
                    if ($.isFunction(callback.success)) {
                        callback.success(response);
                    }
                },
                complete: function (response) {
                    if ($.isFunction(callback.complete)) {
                        callback.complete(response);
                    }
                }
            });

            /*$.post(base_plugin_url + 'code.php',
             {'action': 'list_content', 'list_head_array': list_head_array, 'list_setting_array': list_setting_array, 'status': searchFilter, 'propertyId': propertyId, 'search_string': searchString},
             responseListContent,
             'html'
             );*/
        }

        /*function getReferences(element) {
         var key = makeKey(element);
         if (!(key in properties.elementRef)) {
         properties.elementRef[key] = $(element);
         }

         return properties.elementRef.key;
         }
         function makeKey(element) {

         }*/

        return{
            properties: properties,
            searchString: searchString,
            resetSearchInput: resetSearchInput,
            clearCache: clearCache,
            checkAddEditForm: checkAddEditForm,
            addHighlight:addHighlight
        }
    })();



    $(document).ready(function () {
        //$("#full_page_loader").show();
        //showFullLoader('full_page_loader');
        $.post(base_plugin_url + 'code.php', {'action': 'menu_list', 'node_id': menu_list_instance_id}, responseMenuList, 'html');


        var clickIcon = $(searchModule.properties.searchTextboxJS);
        $(searchModule.properties.searchItemWrap + ' ' + searchModule.properties.searchTextbox).keyup(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                searchModule.checkAddEditForm(clickIcon);
                clickIcon.trigger('click');
            }
        });
        clickIcon.on('click', function () {
            searchModule.checkAddEditForm(clickIcon);
            searchModule.searchString();
        });
    });
    function responseMenuList(d, s)
    {
        $("#page_plugin_menu_item_list").html(d);
        if (window.sessionStorage.getItem("lastFilter") != null && window.sessionStorage.getItem("lastFilter") != '') {
            $('#page_plugin_menu_item_list ul.item-list li').each(function () {
                $(this).removeClass('active');
            });
            $('#' + window.sessionStorage.getItem("lastFilter")).addClass('active');
        } else {

        }
    }


// Highliht function

    jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
          middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 });
};

jQuery.fn.removeHighlight = function() {
 function newNormalize(node) {
    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
        var child = children[i];
        if (child.nodeType == 1) {
            newNormalize(child);
            continue;
        }
        if (child.nodeType != 3) { continue; }
        var next = child.nextSibling;
        if (next == null || next.nodeType != 3) { continue; }
        var combined_text = child.nodeValue + next.nodeValue;
        new_node = node.ownerDocument.createTextNode(combined_text);
        node.insertBefore(new_node, child);
        node.removeChild(child);
        node.removeChild(next);
        i--;
        nodeCount--;
    }
 }

 return this.find("span.highlight-text-search").each(function() {
    var thisParent = this.parentNode;
    thisParent.replaceChild(this.firstChild, this);
    newNormalize(thisParent);
 }).end();
};
