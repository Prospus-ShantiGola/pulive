$(window).load(function(){
  if($('.list-detail .tab .arrow:visible')){
    setArrowPos();
  }
});

$(window).resize(function() {
    letterHT();
    var sectionRef = $('.course-alignment-section');
    if(sectionRef.length) {
        var getOffset = sectionRef.offset().top
        if (getOffset > 500) {
            $('.course-alignment-section').find('.StatementType').addClass('drpBottom');
        } else {
            $('.course-alignment-section').find('.StatementType').removeClass('drpBottom');
        }
    }
    if($('.list-detail .tab .arrow:visible')){
        setArrowPos();
    }
});


$(document).ready(function(){

    $(".custom-scroll").mCustomScrollbar({
        axis:"y", // horizontal scrollbar
        theme:"dark",
        autoHideScrollbar: true
    });

    $('[data-toggle="tooltip"]').tooltip();

     $("body").on("click", ".course-alignment-section #dropLetterExists", function () {3
        var getOffset = $('.course-alignment-section').offset().top
    if (getOffset > 500){
        $('.course-alignment-section').find('.StatementType').addClass('drpBottom');
    }
    else{
        $('.course-alignment-section').find('.StatementType').removeClass('drpBottom');
    }
     });



    $('[data-toggle="tab"]').on('show.bs.tab', function (e) {
      $('.tab-pane').removeClass('active');
    });

    $(".tab [data-toggle='tab']").click(function(){
      var getElmHT = $(this).closest('.flex-row').outerHeight();

      $(".tab .flex-col").removeClass('active');
      $('.tab .arrow').remove();
      $(".rt-course-list").removeClass("active");

      $(this).addClass('active');
      $(this).children('.arrow').css('top', getElmHT+10)

      if($(this).hasClass("rt-course-list")){
        $(this).siblings(".flex-row").find(".notification").append('<span class="arrow arrow_down"></span>');
        $(this).closest(".flex-row").siblings(".flex-row").find(".notification").append('<span class="arrow arrow_down"></span>');
      }
      else{
        $(this).append('<span class="arrow arrow_down"></span>');
      }
      setArrowPos();
    });

    $(".rt-course-list").click(function(e){
      var courseDetailTab = $(this).closest(".tab").siblings(".tab-content").find(".rt-course-detail");

      if($(courseDetailTab).hasClass('active')){
        $('.tab .arrow').remove();
        $(".tab-pane, .rt-course-list").removeClass("active");
      }
      else{
        $(".tab-pane, .rt-course-list").removeClass("active");
        courseDetailTab.siblings(".tab-pane").removeClass("active");
        $(this).addClass("active");
        courseDetailTab.addClass("active");
      }
      e.stopPropagation();
    });

    $(".rt-show-chat-pane").click(function(){
      $('.rightDetailPane').addClass('hide');
      $('#chatSection').removeClass('hide');
    });

    $(".rt-show-letter-pane").click(function(){
      $('.rightDetailPane').addClass('hide');
      $('#letterSection').removeClass('hide');
      letterHT();
    });


    $(".rt-add-dialogue").click(function(){
      $('.rightDetailPane').addClass('hide');
      $('#letterSection').removeClass('hide');
      $('.chat-letter-icon').removeClass('hide');
      letterHT();
    });

    $(".rt-expand-collapse-chat").click(function(){
      $('.message-txt-area').toggleClass('chat-collapse');
      $('.message-txt-area .dropdown').toggleClass('dropup');

      if($('.message-txt-area').hasClass('chat-collapse')){
        $('.message-txt-area').css('height','100px');
        $('.chat-list').removeClass('hide');
        $('.rt-expand-collapse-chat .Icon').addClass('expand').removeClass('collapse-icon');

      }
      else{
        $('.message-txt-area').css('height','100%');
        $('.chat-list').addClass('hide');
        $('.rt-expand-collapse-chat .Icon').addClass('collapse-icon').removeClass('expand');
      }
    });

    $(".rt-expand-collapse-letter").click(function(){
      $('.total-width-pane').toggleClass('letter-collapse');
      $('.alignment-section .dropdown').toggleClass('dropup');
      letterHT();
    });

    $("#ShowMoreIcon").click(function(){
      $('.more-icons').toggleClass('show');
    });

    $('.menu-flyout-open').click(function(){
      var getFlyoutID = $(this).data('flyout');
      $("#"+getFlyoutID).toggleClass("in");
      $("#courseTemplateFlyout").removeClass("in");
     });

    $('.menu-flyout-close').click(function(){
      var getFlyoutID = $(this).data('flyout');
      $("#"+getFlyoutID).removeClass("in");
      if($(".left-action-bar").hasClass("fixed-menu")){
        $(".left-action-bar").removeClass("fixed-menu");
      }
    });

    

    $('.pin-slide').click(function(){
      $(".left-action-bar").toggleClass("fixed-menu");
    });


    $('.hide-modal').click(function(){
      var getID = $(this).closest('.modal.in').attr('id');
      console.log(getID);
      $("#"+getID).find('.close').trigger('click')
    });

    $(".showGroupList").click(function(){
      alert(1)
      $(".flex-template-list").hide();
      $(this).siblings(".flex-template-list").shoow();
    }); 

});




function setDrpdownPos(myElement) {
  var getDocHig = $('.edtBody').outerHeight();
  var getDocWT = $('.edtContainer').outerWidth();
  var drpHig = $(myElement).outerHeight();
  var drpWT = $(myElement).outerWidth();
  var getTopPos = parseInt($(myElement).css('top'));
  var getLeftPos = parseInt($(myElement).css('left'));
  var totalHig = getDocHig - drpHig;
  var totalWT = getDocWT - drpWT;
  var setTopPos = (getTopPos - drpHig);

  if (getTopPos > totalHig) {
    $(myElement).css('top', setTopPos);
  }
  $('.drpRightPos').removeClass('drpRightPos');
  if (getLeftPos > totalWT) {
    $(myElement).addClass('drpRightPos')
  }

}

function letterHT(){
  var getHalfPaneHT = $('.detail-pane').outerHeight();
  if($('.total-width-pane').hasClass('letter-collapse')){
    $('.total-width-pane').height(100);
    $('.total-width-pane .HT').height(65)
    $('.letter-list').removeClass('hide');
  }
  else{
    $('.total-width-pane').height(getHalfPaneHT - 145);
    $('.total-width-pane .HT').height(getHalfPaneHT - 180);
    $('.letter-list').addClass('hide');
  }
}

function setArrowPos(){
  var getElmHT = $(".tab .flex-col[data-toggle='tab']").closest('.flex-row').outerHeight();
  $(".tab .flex-col[data-toggle='tab']").children('.arrow').css('top', getElmHT+10);
}
