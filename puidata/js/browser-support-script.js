var HTML5download =  {
  init: function () {
    config = {
      el: {
        overlay: $('#overlay'),
        issue: $('#issue'),
        modalcontent: $('#issue .modal-content'),
        hiddenClassName: 'hidden',
        overlaidClassName: 'overlaid'
      },
      message: {
        unsupported: "<h3 class='strong'>Bummer...</h3><p>Your browser doesn't support the HTML5 <code>download</code> attribute.</p> <p>Read this <a href='http://sixrevisions.com/html5/download-attribute/'>tutorial about HTML5 download attribute</a> to learn why you're seeing this message.</p> <span class='button close'>Close Message</span>"
      }
    }
    // Invoke feature detection
    HTML5download.detect();
    // Bind a click event listener on the 'close message' button
    $('.close').click(function () {
       HTML5download.hideModal();
    });
  },
  // Feature detection of download attribute
  detect: function () {
    var hyperlink = document.createElement("a");
    if (hyperlink.download === undefined) {
      HTML5download.showModal(config.message.unsupported);
    }
  },
  // Show unsupported message in modal window
  showModal: function (a) {
    $(config.el.overlay).removeClass(config.el.hiddenClassName);
    $(config.el.issue).removeClass(config.el.hiddenClassName);
    
    $('body').addClass(config.el.overlaidClassName);
    
    $(config.el.modalcontent).html(a);
  },
  // Hide modal window
  hideModal: function () {
    $(config.el.overlay).addClass(config.el.hiddenClassName);
    $(config.el.issue).addClass(config.el.hiddenClassName);
    
    $('body').removeClass(config.el.overlaidClassName);
  }
};

// Invoke HTML5download only when DOM is available
$(document).ready(HTML5download.init);
