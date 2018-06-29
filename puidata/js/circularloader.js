/*
comment: 1. This is for the file upload using dropzone plugin.
		 2. circular loader using canvas
		 3. Can be cancel before upload
*/
var myDropzone;
var previewTemplate = document.getElementById('custom-preview-template').innerHTML;
var messageTo = '';


myDropzone = new Dropzone("#attachment_panel", {
    url: domainUrlApi + "upload.php?messageTo=" + messageTo,
    uploadMultiple: false,
    previewsContainer: "#chatWindows",
    clickable: "#attachment-wrap",
    previewTemplate: previewTemplate,
    addRemoveLinks: true,
    dictRemoveFile: '',
    dictCancelUpload: '',
    thumbnailWidth: 100,
    thumbnailHeight: 100,
    maxFilesize: 8,
    acceptedMimeTypes: ".jpeg,.jpg,.png,.gif,.zip,.psd,.pdf,.doc,.docx,.xlsx,.csv,.txt",
    success: function(file, Response) {
        if (messageTo != '') {
            var file_detail = Response.split('~');
            if (file_detail[0] != 'error') {

                // var file_detail = Response.split('~');

                if (file.type.match(/image.*/) != null) {
                    var attachment = "image";
                } else {
                    var attachment = "attachment";
                }
					var minNumber = 100;
						var maxNumber = 40
						var random_id = randomNumberFromRange(minNumber, maxNumber);
				var messageTo = $('.chat_wrapper.active .chatters').attr("data-chatter");
                var groupMessage = $('.chat_wrapper.active').attr("data-group");
                var user_node = $("#" + messageTo).find(".user-node-id").data('id');
                var course_instance_node_id = $('.panel-heading.panel_active').data('id');
                var msg = {
                    type: attachment,
                    message: file_detail[0],
                    attachmentName: file.name,
                    sender: setUserID,
                    messageto: messageTo,
                    timestamp: getTime(),
                    isGroupMessage: groupMessage,
                    username: setUsername,
                    fileTempName: file_detail[1],
                    fileSizeByte: file_detail[2],
                    user_node: user_node,
                    course_instance_node_id: course_instance_node_id,
					random_id:random_id
                };
                if (messageTo != undefined) {
                    saveNodeData(msg);
                }

                //convert and send data to server
                websocket.send(JSON.stringify(msg));
            } else {
                $(".panel .fileView").html('');
                if ($('#messagePopup').modal('show')) {
                    $("body").removeClass("modal-open");
                    $("body").find(".modal-backdrop").addClass("mini-confirm-backdrop");
                    $(".mini-overlay-white-wrapper.white-overlay").removeClass('hide').addClass('show');
                    $("#messagePopup .modal-footer .btn").click(function() {
                        $(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
                    });
                } else {
                    $(".mini-overlay-white-wrapper.white-overlay").removeClass('show').addClass('hide');
                }
                $("#messagePopup").find('.series-content').html(file_detail[1]);


            }
        }
    },
    complete: function(file) {
            if (this.files.length == 0) {
                console.log('completed');
                setTimeout(function() {
                    $("#miniDialogue .nano.ref-set-height").nanoScroller();
                    $("#miniDialogue .nano.ref-set-height").nanoScroller({
                        scrollBottom: -50
                    });
                }, 1000);
            }


            if ($('.mini-dialogue-flyout .mini-type-textarea .append-top').length) {

                $('.mini-dialogue-flyout .expand-collapse-box:visible').trigger('click');

                // $(".mini-dialogue-flyout .ref-set-height").height($(".mini-dialogue-flyout").height() - ($(".right-bar-tab:visible").height() + $(".mini-type-textarea").height()));
                // console.log($(".mini-dialogue-flyout .ref-set-height").height());
            } else {
                $('.message').height("");
                $('.message').height($('.message').prop("scrollHeight") - 20);
            }
        }
        /*,
        						accept: function(file, done) {
        								autoScrollDown();
        							}*/

});
firstTime = 1; //for white circle run only first time.

myDropzone.on("uploadprogress", function(file, progress, bytesSent) {
    var myDropzone = this;
    if (firstTime) {
        whiteCircle(file)

        var currentTimeContainer = file.previewElement.querySelector('#currentTime')
        var currentTimeStampInSec = Math.floor(Date.now() / 1000);
        $(currentTimeContainer).text(ConvertToLocalTime(currentTimeStampInSec));
        if($('.dialogue-listing-chat .dz-preview:not(":last")').length) {
            $('.dialogue-listing-chat .dz-preview:not(":last")').remove();
        }
    }
    progressSim(progress, file);
});
myDropzone.on('success', function(file) {
    if ($('#error_msg_file').length) {
        $('#error_msg_file').remove()
    }
    myDropzone.removeFile(file); //comment to show the image preview after upload for test on local
});

function autoScrollDown(selector) {
    setTimeout(function() {
        var $nanoScrollBox = $("#miniDialogue .nano.ref-set-height");
        $nanoScrollBox.nanoScroller();
        $nanoScrollBox.nanoScroller({
            scrollBottom: -50
        });
    }, 500);
}

function whiteCircle(file) {
    _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        var ctx = node.getContext('2d');
    }
    var start = 4.72; //canvas loaded position
    ctx.lineWidth = 2;
    ctx.fillStyle = '#aaa';
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.arc(20, 20, 15, 0, 2 * Math.PI);
    ctx.stroke();
}

function progressSim(amountLoaded, file) {
    _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        var ctx = node.getContext('2d');
    }
    var start = 4.72;
    ctx.canvas.height = 40;
    ctx.canvas.width = 40;
    var diff;
    diff = ((amountLoaded / 100) * Math.PI * 2 * 10).toFixed(2);

    ctx.clearRect(10, 10, 10, 10);
    ctx.lineWidth = 2;
    ctx.fillStyle = '#6e6c6c';
    ctx.strokeStyle = '#6e6c6c';
    ctx.textAlign = 'center';
    ctx.beginPath();

    ctx.arc(20, 20, 15, start, diff / 10 + start, false);
    ctx.stroke();

    if (amountLoaded >= 100) {

        firstTime = 1;
    } else {
        firstTime = 0;
    }
    if (file.type.match(/image.*/)) {
        $(function() {
            ctx.canvas.height = 90;
            ctx.canvas.width = 90;
            ctx.clearRect(10, 10, 10, 10);
            ctx.lineWidth = 2;
            ctx.fillStyle = '#999';
            ctx.strokeStyle = '#999';
            ctx.textAlign = 'center';
            ctx.beginPath();
            //ctx.arc(80, 80, 15, 0, 2 * Math.PI);
            ctx.arc(45, 45, 15, start, diff / 10 + start, false);
            ctx.stroke();

        });
    }
}

var paste_printScreen_case = false;

function messageBoxImgPaste(container, textAreaElm, editableDiv, showMsgContainer) {
    var bindEventToMsgBox = document.querySelector(textAreaElm);
    FileReaderJS.setupClipboard(bindEventToMsgBox, {
        accept: {
            'image/*': 'DataURL'
        },
        on: {
            load: function(e, file) {
                var img = new Image();
                replaceTextAreaToEditableDiv(container, textAreaElm, editableDiv);
                img.height = 100;
                img.width = 100;
                img.onload = function() {
                    imgOnPast(editableDiv, img, file);
                };
                img.src = e.target.result;
            },
            loadend: function() {
                if (showMsgContainer) {
                    setTimeout(function() {
                        $(showMsgContainer).getNiceScroll(0).doScrollTop($(showMsgContainer)[0].scrollHeight, 100);
                    }, 1000)
                }
            }
        }
    });

    $('body').on('keyup', '#' + editableDiv, function() {
        var ImgTag = $('#' + editableDiv).find('img').length;
        if (!ImgTag) {
            replaceTextAreaToEditableDiv(container, textAreaElm, editableDiv);
        }
    });
}

function imgOnPast(editableDiv, img, file) {
    $('#' + editableDiv).append(img);
    $('#' + editableDiv).trigger('focus');
    paste_printScreen_case = true;
    fileObj = file;
    var pasteChatHght = $(".mini-type-textarea #chatMsgBox").height();
    $('#' + editableDiv).height(pasteChatHght);
}
var textAreaContainer;

function replaceTextAreaToEditableDiv(container, textAreaElm, editableDiv) {
    var chatMsgBox = $(container + ':first');
    if (textAreaContainer) {
        var insideText = $('#' + editableDiv).text();
        $('#' + editableDiv).remove();
        chatMsgBox.append(textAreaContainer);
        textAreaContainer = null;
        $(textAreaElm).val(insideText).focus();
    } else {
        textArea = $(textAreaElm);
        textAreaContainer = textArea.detach();
        chatMsgBox.html('<div id="' + editableDiv + '"  class="form-control message" rows="2" placeholder="Type here" contenteditable="true"></div>');
    }
}

/*code image name/size name dosn't show*/
/*var fileTypeIsImage = function(file) {
	var ImageFileTypes = ['.jpeg', '.jpg', '.gif', '.png'];
          for(var _i = 0; _i<ImageFileTypes.length; _i++){
          	GetImageFileTypes = ImageFileTypes[_i]
  			if(file.name.toLowerCase().indexOf(GetImageFileTypes.toLowerCase(), file.name.length - GetImageFileTypes.length) !== -1){
  				return true;

  			}
          }
}*/
/*end of code file name/size*/
