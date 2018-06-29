/*
    comment: minidialogue Plugin
    created Date: 16 March 2016
*/
var testLength = 0;
function enterParticipantField() {
  // Remove id from participant
  var bodyEle = $('body');
  bodyEle.on("click", ".close-participant-id", function(){
    $(this).closest('.form-label').remove();
  });
  bodyEle.off("keyup", "#exixtingParticipantInput").on("keyup", "#exixtingParticipantInput", function(event){
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if($keycode === 13 && !event.shiftKey) {
      $("#add_participent_existing_user i.tick").trigger("click");
      event.preventDefault();
    }
  });
}
$('body').on('click','.dialogue_area_action_icon.expand_icon', function(event) {
    var buffer = 2;
    var dialogueMessagesHeight = ( ($(".ref-min-center-dialogue").attr('style').match(/height: ([0-9]+)px;/)[1]  - $(".right-bar-tab").outerHeight(true)) - buffer );
    $(".mini-type-textarea").animate({height: dialogueMessagesHeight}, 500);
    $('.dialogue_area_action_icon').removeClass('expand_icon').addClass('collapse_icon');
    $('.dialogue_area_action_icon.collapse_icon').attr('data-original-title', 'Collpase');
});
$('body').on('click','.dialogue_area_action_icon.collapse_icon', function(event){
    $(".mini-type-textarea").animate({height: 69}, 500);
    $('.dialogue_area_action_icon').removeClass('collapse_icon').addClass('expand_icon');
    $('.dialogue_area_action_icon.expand_icon').attr('data-original-title', 'Expand');
});
$(document).ready(function() {
    enterParticipantField();
    addparticipants();
    AddMorePArticipants();
    addActors();
    MiniDialogueContextMenu();
    miniActiveCollapse(); // collapse-add-active
   //add tab functionality
    $(".tab_box .nav-tabs li a[href='#by-course']").click(function() {
      $(this).closest(".tab_box").siblings(".brdrBtm").find(".logo-title").html("<i class='icon icon_by_course'></i>by course");
    });
    $(".tab_box .nav-tabs li a[href='#by-actors']").click(function() {
      $(this).closest(".tab_box").siblings(".brdrBtm").find(".logo-title").html("<i class='icon icon_by_actor'></i>by actor");
    });
    $(".by_course_users").click(function(event) {
      $(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
      if($(".expand-collapse-box").hasClass("append-top")) {
        var innerHt = $(".mini-dialogue-flyout").height();
        var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab").outerHeight();
        var totalHght1 = innerHt - rightTabHghtM;
        $(".mini-type-textarea").css({"height": totalHght1 , "border-top":"none"});
      }
    });
// search-expand
    var bodyEle = $('body');
    bodyEle.on('click','.mini-dialogue-flyout .search-expend-mini .search-anchor-mini', function(event) {
      $(this).toggleClass('openup');
      $(".ref-min-center-dialogue .right-bar-tab.default-view-tab").show();
      if($(this).hasClass('openup')) {
        $(".mini-dialogue-flyout .sb-search").find('input').removeClass('hide');
        setTimeout(function() {
          $(".mini-dialogue-flyout .sb-search").stop().animate({right:'0%'}, 400);
          if($('.ref_add_new_title_bar').length!=0) {
            $(".ref_add_new_title_bar").remove();
            $('.online_users:first').addClass('active');
            $('.online_users:first').trigger('click');
            $('.ref_add_right_tab').hide();
          }
        }, 400);
        $(".sb-search-input-text").focus();
      } else {
        $(".mini-dialogue-flyout .sb-search").stop().animate({right:'-104%'}, 400);
        setTimeout(function() {
           $(".mini-dialogue-flyout .sb-search").find('input').addClass('hide');
           if($('.ref_add_new_title_bar').length == 0) {
            $(".ref_add_new_title_bar").show();
            $('.online_users:first').addClass('active');
            $('.online_users:first').trigger('click');
            $('.ref_add_right_tab').hide();
          }
        }, 400);
        $(".mini-dialogue-flyout .sb-search-input-text").val("");
        searchDialogDetail();
        MiniDialogueContextMenu();
      }
     event.stopPropagation();
    });
// search-expand
// using this support chat flyout on selected user
    bodyEle.on('click','.all-users > li', function(e) {
      $(this).removeClass("stickyLi courseStickyLi");
      $("#inline-dialogue-wrap .all-users li").css('padding-top','0px' );
      var targetName = $(this).find(".chat-user-name").text()
      $(this).siblings('li').removeClass("active fixedSticky stickyLi courseStickyLi");
      $(this).addClass("active")
      $(".user-name").html(targetName);
      if($('#view-courses').hasClass('hide')) {
        $('.edit-rename-title-mini i').trigger('click');
        $('#view-courses').removeClass('hide');
        $('#add-courses').addClass('hide');
      }
      if($(this).hasClass('undefined-col')) {
        $('#view-courses').addClass('hide');
        $('#add-courses').removeClass('hide');
      }
    });
    bodyEle.on('click','.fixedinlineDialogue .all-users li', function(e) {
      e.stopPropagation();
    });
    bodyEle.on('click','.choose-node-type', function(e) {
      $('.new_untitled_wrap').find('.course_req').addClass('hide');
      $(".new_untitled_wrap .course_info").removeClass('required_border');
      $('.add_nw_course_form .user-search').data('id','').val('');
      $('.new_untitled_wrap .course-new-drop').find('.course_info').val('');
      $('.new_untitled_wrap .course-new-drop').find('.dialogue_info').val('');
   });
   bodyEle.on('keypress','.Add-more-actor input', function(e) {
     if(e.which == 13) {
       $('.add-more-Users').trigger('click');
     }
     $(".nano").nanoScroller();
   });
}); //end of document ready function

var liClickedPostion= 0;
$('.mini-set-height .all-users-mini li').off('click');
$('.mini-set-height .all-users-mini li').click(function(evt) {
  var lengthHeight = 0;
  liClickedPostion = $(this).index();
  for(var i = 0; i <= liClickedPostion; i++) {
    lengthHeight += $(".mini-set-height .all-users-mini li").eq(i).height();
  }
  lengthHeight -= 60;
  testLength = lengthHeight;
  evt.stopPropagation();
});
function addparticipants() {
  var participantPanel = $(".participant-panel");
  var participantPanHig = participantPanel.outerHeight();
  participantPanel.css('top',-participantPanHig)
  $('.add-participants').click(function(event) {
    if(participantPanel.hasClass('opened')) {
      var participantPanHig = participantPanel.outerHeight();
      participantPanel.animate({
          "top":-participantPanHig
      }, 300, function(){});
      participantPanel.removeClass("opened");
    } else {
      var participantPanHig = participantPanel.outerHeight();
      $('.close-expend').trigger('click');
      participantPanel.animate({
          "top":"45"
      }, 300, function(){});
      participantPanel.addClass("opened");
    }
  });
}
function AddMorePArticipants() {
    var CloneLi = '<li class="">'
    CloneLi += '<div class="Add-more-user"><a id="dLabel" data-target="#" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"><i class="icon add-user-drp add-user-icon"></i></a><input type="text" placeholder="Add Participants here" class="form-control" required="required">' ;
    CloneLi += '<ul class="dropdown-menu filter-drp add-participant-drp" aria-labelledby="dLabel">'
    CloneLi += '<li><a><i class="icon role-icon"></i>By Role</a></li>'
    CloneLi += '<li><a><i class="icon add-user-icon"></i>By Actor</a></li>'
    CloneLi += '<li><a><i class="icon group-icon"></i>By Group</a></li></ul></div>'
    CloneLi += '<div class="right-icon"><i class="icon tick add-more-Users"></i><i class="icon close delete-Users"></i></div></li>';
    var bodyEle = $('body');
    bodyEle.on('click','button.add-Users', function(event) {
      $(this).closest('li').after(CloneLi);
      $(this).closest('li').remove();
      if( $('.group-pane-wrap').css('display') == "none") {
        $('.participant-panel').css('height',  $('.participant-panel').height());
      }
    });
    bodyEle.on('click','.add-more-Users', function(event) {
      if(!$(this).closest('li').find('input').val() == '') {
        var getValue = $(this).closest('li').find('input').val();
        var htmlValue  = '<li class=""><div class="user-pic-sm"><img src="'+domainUrlApi+'img/user.png" alt=""><div class="icon green-icon shape"></div></div>';
        htmlValue +=  '<div class="chat-user-name"><h2>'+getValue+'</h2></div>';
        htmlValue +=  '<div class="right-icon"><i class="icon close delete-profile" data-original-title="" title=""></i></div></li>';
        $(this).closest('li').before(htmlValue);
        $(this).closest('li').find('input').val('');
        var participantHeight     = $(window).height() - $('.header-stick-top').outerHeight()-145;
        var grpPaneHeight         = $('.group-pane-wrap').outerHeight()
        var participantPaneHeight = $('.participant-panel').outerHeight();

        if( participantPaneHeight >= participantHeight) {
          $('.individual-pane').css('height', $('.participant-panel').outerHeight()-35);
          $(".nano").nanoScroller();
          $('#UserChat .participant-panel').css({
            'box-shadow':'none',
            'border-bottom':'1px solid #ccc'
          });
        } else {
          $('.participant-panel').css('height',participantPaneHeight + 29.5 );
          $('.individual-pane').css('height',$('.individual-pane').outerHeight() +29.5);
        }
        var addparticipantPos = $(this).closest('.right-icon').siblings('.Add-more-user').offset().top;
        $('.add-participant-drp').css('top', addparticipantPos+28);
      }
    });
    bodyEle.on('click','.delete-Users', function(event) {
      var getButton = '<button type="Submit" class="btn btn-style add-Users btn-medium">Add Participants</button>';
      $(this).closest('li').append().html(getButton);
      $(this).closest('li').remove();
    });
    bodyEle.on('click','.delete-profile', function(event) {
      var individualPaneHeight  = $('.individual-pane .user-listing').eq(1).outerHeight();
      var participantPaneHeight = $('.participant-panel').outerHeight();
      if(participantPaneHeight <= individualPaneHeight) {

      } else {
        $('.participant-panel').css('height',$('.participant-panel').outerHeight() - 29.5);
        $('.individual-pane').css('height',$('.individual-pane').outerHeight() - 29.5);
        $('#UserChat .participant-panel').css({
          'box-shadow':'0px 2px 25px rgba(0, 0, 0, 0.59)',
          'border-bottom':'0'
        });
      }
      $(this).closest('li').remove();
    });
    bodyEle.on('keypress','.Add-more-user input', function(e) {
      if(e.which == 13) {
        $('.add-more-Users').trigger('click');
      }
    });
}

var w_popout;
//chat window Event
function MinichatWindow() {
  var chatWindow = $(".mini-dialogue-flyout").outerWidth();
  $('.mini-chat').click(function(e) {
    var FlyID = $(this).attr('id');
    if(!$("#"+ FlyID + ".modalFlyout").hasClass('opened')) {
      e.preventDefault();
      if(!w_popout || w_popout.closed) {
        $("#"+ FlyID +'.mini-dialogue-flyout').animate({
            "margin-right":"0"
        }, function() {
          var setter = $('.mini-set-height .all-users-mini li').first().offset().top;
          $('.mini-set-height .all-users-mini li').first().addClass('fixedStickymini').css('top',setter);
        }).addClass("opened");
      } else {
         w_popout.focus();
      }
    }
  });
}

function findUrl(){
  var url = window.location.pathname;
  url = url.split('/');
  $.each(url, function(i,val) {
    if(val == 'minidialog.php') {
      url = 'minidialog';
    }
  });
  return url;
}

function chatWidthHeight() {
  var currentURL = findUrl();
  var winHt = $(window).height();
  var windowWidth = $(window).width();
  var LTPane = $(".ref-lt-pane").height();
  //var tabBox = $(".tab_box").height();
  var topHdrHt = $(".header-wrapper").height();
  combineWinHT = winHt - topHdrHt;
  if(currentURL == 'minidialog') {
    $(".mini-dialogue-flyout").height(combineWinHT).width(windowWidth);
    $(".mini-overlay-wrapper").height(combineWinHT).width(windowWidth);
    $(".mini-overlay-white-wrapper").height(combineWinHT).width(windowWidth);
    $('.dialogue-wrap').css({'margin-right':'0'});
  } else {
    $(".mini-dialogue-flyout").height(combineWinHT/2.1).width(windowWidth/2.2 + 1);
    $(".mini-overlay-wrapper").height(combineWinHT/2.1).width(windowWidth/2.2 + 1);
    $(".mini-overlay-white-wrapper").height(combineWinHT/2.1).width(windowWidth/2.2 + 1);
  }
  var miniDialogueWidth = $(".mini-dialogue-flyout").width();
  var innerHt = $(".mini-dialogue-flyout").height();
  var textareaHeight = $(".ref-textarea-HT").height();
  $(".dialogue-section.ref-min-center-dialogue").height(innerHt);
  var chatTextArea = $(".ref-textarea-HT").height() + $(".ref-submit-HT").height();
  $(".mini-type-textarea").height(chatTextArea);
  var textAvilHT = $(".mini-type-textarea").height();
  $(".ref-set-height").height(innerHt - ($(".ref-min-center-dialogue .right-bar-tab:visible").height() + textAvilHT));
  var niceScrollSettings = {
    cursorcolor: "#000",
    cursorborder: "0",
    cursorborderradius: '0',
    cursorwidth: "2px",
    background: 'rgba(0,0,0,.15)'
  };

  $('#add-text').niceScroll($.extend({}, niceScrollSettings, {railoffset: {left: 90}}));
  $(".overflow_height").niceScroll(niceScrollSettings);

  var heightCollapse = $(".ref-set-height").height();
  var textAvilHTMax = $(".ref-set-height").height() + $(".ref-submit-HT").height();
  $(".mini_accordion_wrap").height($(".mini-dialogue-flyout").height() - $(".ref-lt-pane").height());
  $(".mini_accordion_wrap .nano").height($(".mini_accordion_wrap").height());
  $(".ref-user-action-HT").height(innerHt);
  $(".mini_accordion_wrap .nano").nanoScroller();
  //actors flyouts
  var miniAvailHT = $(".mini-dialogue-flyout").height();
  var miniDialogueWidth = $(".mini-dialogue-flyout").width();
  var refActorFlyWidth = miniDialogueWidth/2;

  $(".mini-participant-panel").width(refActorFlyWidth).height(miniAvailHT);
  $(".mini-participant-panel .ref-actors-LT").height(miniAvailHT);
  $(".loader-actor-box").width(miniDialogueWidth).height(miniAvailHT);
  $(".ref-min-left-dialogue").height(miniAvailHT);
  $(".ref-actors-RT").height(miniAvailHT);

  var actorsAvailWT = $(".mini-participant-panel").width();

  var actorsRT = $(".ref-actors-RT").width();
  var actAvailWTLT = actorsAvailWT - actorsRT;


  var miniDialogueWidthLtRT = $(".ref-min-left-dialogue").width() + $(".ref-min-right-dialogue").width();
  var miniAvailWth = miniDialogueWidth - miniDialogueWidthLtRT;
  if(currentURL == 'minidialog') {
      $(".ref-min-center-dialogue").width(miniAvailWth - 4);
      $(".mini-type-textarea").width(miniAvailWth - 4);
  } else if(windowWidth >= 1367) {
      $(".ref-min-center-dialogue").width(miniAvailWth - 4);
      $(".mini-type-textarea").width(miniAvailWth - 4);
  } else {
      $(".ref-min-center-dialogue").width(miniAvailWth - 4);
      $(".mini-type-textarea").width(miniAvailWth - 4);
  }
  var miniFlyModalWidthCal= $(".mini-dialogue-flyout").width();
  var miniFlyModalHeightCal= $(".mini-dialogue-flyout").height();
  $(".modalMiniDialogue").width(miniFlyModalWidthCal).height(miniFlyModalHeightCal);
  var miniFlyHght = $(".mini-dialogue-flyout").height();
  $(".mini-dialogue-flyout .reply-list-wrap").height(miniFlyHght).niceScroll(niceScrollSettings);
}

function miniDialogue() {
  var setTop = 0;
  setTimeout(function(){
    if($('.mini-set-height .all-users-mini li').length) {
      setTop = $('.mini-set-height .all-users-mini li').first().position().top;
    }
  }, 700);
  $('.mini-set-height').on("update",function(e,vals) {
    setTimeout(function() {
      $('.mini-set-height .all-users li').click(function(evt) {
        $('.mini-set-height .all-users li').removeClass('fixedStickymini active');
        $(this).addClass("active");
      });
      if($('.mini-set-height .all-users li').hasClass('active')) {
        if($(".mini-set-height .all-users li.active").position().top <= 0 ) {
            $(".mini-set-height .all-users li.active").addClass('fixedStickymini');
            $('.fixedStickymini').css('top',setTop);
            return false;
        } else {
          if ($(".mini-set-height .all-users li.active").hasClass('fixedStickymini')) {
            if(vals.direction === "up" && vals.position === 0) {
            } else {
              if(vals.position <= testLength) {
                setTimeout(function(){
                  $(".mini-set-height .all-users li.active").removeClass('fixedStickymini');
                },500);
              }
            }
          }
          $(".mini-set-height .all-users li.active").parent().css('padding-top',0);
        }
      }
    },20);
  });

  $(".mini-set-height .all-users-mini li").click(function() {
    $('.mini-set-height .all-users-mini li').removeClass('active');
    $(this).addClass("active");
    if($(".right-bar-tab.ref_add_right_tab").css("display","block")) {
        $(".mini-type-textarea").css("border-top","none");
    }
    if( $(".mini-type-textarea").css("display","block")) {
      $(".mini-type-textarea").css("border-top","1px solid #dbdbdb");
    } else {
      $(".mini-type-textarea").css("border-top","none");
    }
    $(".right-bar-tab.ref_add_right_tab").hide();

    $(".new_li_structure").click(function() {
      if($(".right-bar-tab.ref_add_right_tab").css("display","block")) {
         if($(".mini-type-textarea .expand-collapse-box").hasClass("append-top")) {
            $(".mini-type-textarea").css("border-top","none");
         }
      }
    });
  });
  if(objChatfn){
    chatWidthHeight();
  }
  //actors flyouts
  var miniAvailHT = $(".mini-dialogue-flyout").height();
  var miniDialogueWidth = $(".mini-dialogue-flyout").width();
  var refActorFlyWidth = miniDialogueWidth/2;
  var userActionDialogue   = $(".mini-dialogue-flyout .user-section-strip").width();
  $(".mini-participant-panel").width(refActorFlyWidth).height(miniAvailHT);
  $(".ref-min-left-dialogue").height(miniAvailHT);
  $(".ref-actors-RT").height(miniAvailHT);

  var actorsAvailWT = $(".mini-participant-panel").width();
  var actorsLT = $(".ref-actors-LT").width();
  var actorsRT = $(".ref-actors-RT").width();
  var actAvailWTLT = actorsAvailWT - actorsRT;

  var actorDialogueWth =  $(".ref-actorDialogue").width();
  $(".loader-actor-box").width(actorDialogueWth);
  $(".mini-dialogue-flyout .icon-reply").click(function() {
    $(".ref-actorDialogue").animate({
       "margin-right": "0"
    }, 300, function(){
      $(this).show();
    });
  });
  $(".mini-dialogue-flyout .close-actor-dialogue").click(function() {
    $(".mini-dialogue-flyout .ref-actorDialogue").animate({
        "margin-right": -(actorDialogueWth+40)
    },300,function(){$(this).hide()});
    $('.mini-overlay-white-wrapper').addClass('hide');
  });
  //end actor dialogue

  var heightCollapse = $(".ref-set-height").height();
  var textAvilHTMax = $(".ref-set-height").height() + $(".ref-submit-HT").height();
  var textareaHeight = $(".ref-textarea-HT").height();
  var innerHt = $(".mini-dialogue-flyout").height();
  $('body').on('click','.mini-dialogue-flyout .expanded-box',function() {
    var rightTabHght = $(".ref-min-center-dialogue .right-bar-tab:visible").outerHeight();
    $("#add-text").focus();
    $(this).addClass("append-top").removeClass('expanded-box');
    $(".mini-type-textarea").css("border-top","none");
    $(".mini-dialogue-flyout .ref-set-height").height(0);

    if($(".right-bar-tab.ref_add_right_tab").css("display") == "block") {
      rightTabHght =  $(".right-bar-tab.ref_add_right_tab").height();
      var marginTop = rightTabHght-$(".right-bar-tab").height();
      $(".mini-type-textarea").css("margin-top",marginTop+"px").keypress(function(){
         $(".mini-type-textarea").css("margin-top",0+"px");
      });
    } else if($(".right-bar-tab.collapsed_dialogue").css("display") == "block") {
      rightTabHght =  $(".right-bar-tab.collapsed_dialogue").height();
      var marginTop = rightTabHght-$(".right-bar-tab").height();
      $(".mini-type-textarea").css("margin-top",marginTop+"px").keypress(function(){
         $(".mini-type-textarea").css("margin-top",0+"px");
      });
    } else {
      $(".mini-type-textarea").css("margin-top",0+"px");
    }
    var innerHeight = innerHt - rightTabHght -2;
    $(".mini-type-textarea").height(innerHeight);
    $(".ref-textarea-HT").height(innerHeight - $(".ref-submit-HT").height());
    $(".expand-collapse-box").removeClass("expanded-box").addClass("close-expend").attr('data-original-title', 'Collapse');
  });
  $('body').on('click','.mini-dialogue-flyout .append-top',function() {
      $("#add-text").focus();
      $(this).removeClass("append-top").addClass('expanded-box');
      $(".mini-type-textarea").height(67+"px");
      $(".expand-collapse-box").removeClass("close-expend").addClass("expanded-box");
      $(".mini-dialogue-flyout .ref-set-height").height($(".mini-dialogue-flyout").height() - ($(".right-bar-tab").height() + $(".mini-type-textarea").height()));
      setTimeout(function() {
        $(".mini-dialogue-flyout .ref-set-height.nano").nanoScroller();
        $(".mini-dialogue-flyout .ref-set-height.nano").nanoScroller({
          scroll: 'bottom'
        });
      }, 500);
      $(".mini-type-textarea").css("border-top","1px solid #dbdbdb");
      $(".expand-collapse-box").attr('data-original-title', 'Expand');
      $(".ref-textarea-HT").height(textareaHeight);
      $(".mini-type-textarea").css("margin-top",0+"px");

      if($(".mini-type-textarea .expand-collapse-box").removeClass("append-top")) {
        $(".mini-type-textarea").css("margin-top",0+"px");
        $("body").on("click", ".angle-collapse-up", function() {
          $(".right-bar-tab.collapsed_dialogue").show();
          $(".mini-type-textarea").css("margin-top",0+"px");
          $("#add-text").focus();
       });
      } else {
         $(".mini-type-textarea").css("margin-top",0+"px");
      }
  });

  $('body').on('click','.mini-dialogue-flyout .expand-collapse-box',function() {
    if($(".mini-type-textarea .expand-collapse-box").hasClass("append-top")) {
      $(this).attr('data-original-title', 'Collapse');
      var miniTxtHght= $(".mini-type-textarea").height();
      $("#add-text").height(miniTxtHght-20);
    } else {
      $(this).attr('data-original-title', 'Expand');
      $("#add-text").height(67+"px");
    }
  });
  // unlock window
  $('body').on('click', '.windowClose', function() {
    window.close();
    $(".windowClose",window.opener.document).removeClass("windowClose").addClass('imranClose');
  });
  $('.create-sibling .close').click(function() {
     $('input.form-control').val('');
  });

  $(".ref-create-dialogue").click(function() {
    $('.part_id_block').remove();
    $(".course-new-drop .course_info").focus();
    $(".user-section-strip .save-chat-mini").removeClass('hide');
    $(".right-bar-tab.ref_add_right_tab i").removeClass('angle-rotate-down');
    $('.dropMenuCourse').html('New');
    $(".ref-min-center-dialogue .right-bar-tab.default-view-tab").hide();
    $(".right-bar-tab.ref_add_right_tab").show();
    $(".ref_top_chat_box .nano .nano-pane").css("display","none");
    $(".collapsed_dialogue.new_view_wrapper").hide();
    $('.new_untitled_wrap').find('.dropMenuCourse').html('New');
    $(".ref_top_head_box").css("display","block");
    $(".ref_top_head_box .existing_user_titlefield").css("display","none");
    $('.new_untitled_wrap').find('.new_user_titlefield').show();
    if($('.ref_add_new_title_bar').length == 0) {
       //Add new form when click on add
      $("#accordion").find('.panel-heading').removeClass('panel_active');
      $("#accordion").find('.dialog-accordion .online_users').removeClass('selected');
      var html_val = addNewForm();
      $("#accordion").prepend(html_val);
      $('.mini_accordion_wrap .panel:nth-child(2) .dialog-accordion').removeClass("in");
      if($(".mini_accordion_wrap .panel:nth-child(2) .base-container i").hasClass('fa-angle-down')) {
          $(".mini_accordion_wrap .panel:nth-child(2) .base-container i").removeClass('fa-angle-down').addClass('fa-angle-up');
      }
      $('.new_untitled_wrap .new_col_add_wrap .course-new-drop .user-name-data').html(userEmail);
      $('.add_nw_course_form .user-search').data('id','').val('');
      getUserList(setUserID);
      searchCourseByTitle();
    }
    $("input.course_info").focus();
    if($(".right-bar-tab.ref_add_right_tab").css("display","block")) {
       if($(".mini-type-textarea .expand-collapse-box").hasClass("append-top")) {
         $(".mini-type-textarea").css("border-top","none");
         if($(".right-bar-tab.ref_add_right_tab").css("display") == "block") {
            rightTabHght =  $(".right-bar-tab.ref_add_right_tab").height();
            var marginTop = rightTabHght-$(".right-bar-tab").height();
            $(".mini-type-textarea").css("margin-top",marginTop+"px").keypress(function() {
               $(".mini-type-textarea").css("margin-top",0+"px");
            });
         }
       }
    }
    var innerHt = $(".mini-dialogue-flyout").height();
    var rightTabHghtM = $(".ref-min-center-dialogue .right-bar-tab").last(':visible').outerHeight();
    var totalHghtM = innerHt - rightTabHghtM;
    if($(".expand-collapse-box").hasClass("append-top")) {
         $(".mini-type-textarea").css({"height": totalHghtM , "border-top":"none"});
    }
   // inactive textbox
   $(".mini-type-textarea .animate-div").addClass("manage-opacity");
   $(".tab-pane .ref-set-height").addClass('hide');
   //trigger clicked expand collapsed
    if($('.mini-dialogue-flyout .mini-type-textarea .append-top').length) {
      $('.mini-dialogue-flyout .expand-collapse-box:visible').trigger('click');
    }
  });
  // end filter + Add Dialogue
}//end of minidialog function


function addNewForm() {
    var html_val = '<div class="panel ref_add_new_title_bar existign_user_view_toggle ">\
                      <div class="panel-heading panel_active ">\
                          <div class="panel-title">\
                              <a role="button" class="base-container clearfix" data-toggle="collapse" data-parent="#accordion" href="#collapse-accordion-0" aria-expanded="true" aria-controls="collapse-accordion-0">\
                                  <div class="user-pic-sm">\
                                      <img src="'+domainUrlApi+'img/course-big.svg" alt="">\
                                  </div> \
                                  <div class="base-title">\
                                      <span class="mini-course-title truncate-course">Undefined</span>\
                                       <span class="mini-course-participant truncate-course" data-id="">'+setUsername+'</span>\
                                     </div> \
                                  <i class="fa fa-angle-down right"></i>\
                              </a>\
                          </div>\
                      </div>\
                      <div id="collapse-accordion-0" class="panel-collapse dialog-accordion collapse in" role="tabpanel" aria-labelledby="heading-accordion-0" aria-expanded="true">\
                          <div class="panel-body">\
                              <ul id="dialog-container">  \
                                  <li class="online_users new selected" id="" data-id="">\
                                      <div class="mini-course-dialogue-box clearfix">\
                                          <div class="user-pic-sm">\
                                              <img src="'+domainUrlApi+'img/dialogue-big.png" alt="">\
                                          </div> \
                                          <div class="mini-course-dialogue-info left">\
                                              <span class="mini-course-dialogue-title dialog-title ">Undefined</span>\
                                               <span class="mini-course-dialogue-desc truncate-desc user-node-id" data-id="">'+setUsername+'</span>\
                                             </div>\
                                          <div class="mini-course-dialogue-date right">\
                                          </div>\
                                      </div>\
                                  </li>\
                              </ul>\
                          </div>\
                      </div>\
                  </div>';

return html_val;
}
function addActors() {
  var bodyEle = $('body');
  bodyEle.on('click','.add-participants-list', function(event) {
    var getValue = $('#add_participant_new_user input').val();
    var getid = $('#add_participant_new_user input').data('id');
    $('.new_untitled_wrap').find('.course_req').addClass('hide');
    $(".new_untitled_wrap .course_info").removeClass('required_border');
    var node_type = $('.new_untitled_wrap').find('.dropMenuCourse').text();
    if(node_type =='New') {
      var course_title = $('.new_untitled_wrap .course-new-drop').find('.course_info').val().trim();
    } else {
      var course_title = $('.new_untitled_wrap .existing_user_titlefield').find('.course_info').data('id');
    }
    if((course_title) =='' || course_title == undefined) {
      $('.new_untitled_wrap').find('.course_req').removeClass('hide');
      $(".new_untitled_wrap .course_info").addClass('required_border');
      return false;
    }
    // participant not mandatory
    if( (typeof getid !='undefined' && getid !='') && getValue!='') {
      var actor_temp = getValue.split('(');
      var get_user_name = actor_temp['0'];
      var htmlValue ="<div class='form-label part_id_block new_user_list dilaog_actor_list' data-id ='"+getid+"'  ><span class='ref_span_left'><i class='icon admin-user'></i> </span><span class='user-name-data'>"+getValue+"</span><input type='hidden' class='user-name-val' value='"+get_user_name+"'><span class='ui_close_icon_block close-participant-id'><i class='icon close'></i></span></div>";
      $(this).closest('.email_input_field_ui').siblings('.participant_scroll_height_ui').append(htmlValue);
      $('#add_participant_new_user input').val('');
       $('#add_participant_new_user input').data('id','');
      var dialog_instance_node_id = $('.first-div-min-participant').data('id');
      var user_node_id = '';
      $('.participant_scroll_height_ui .new_user_list').each(function(){
        user_node_id += $(this).data('id')+',';
      });
      var user_node_name = $('.participant_scroll_height_ui .new_user_list .user-name-val').val().trim();
      var user_instance_node_id = setUserID+','+ user_node_id.replace(/,+$/,'');
      var other_user_name = setUsername+', '+ user_node_name;
      saveNewCourse(user_instance_node_id,other_user_name,user_count=0);
      actorResize();
      $(".second-div-mini-participant .nano").nanoScroller();
      $(".second-div-mini-participant .nano").nanoScroller({
        scroll: 'bottom'
      });
      $(".ref-append-user-list").find('input').data('id','');
    } else {
      var user_instance_node_id = setUserID;
      var other_user_name = setUsername;
      var user_count = '1';
      saveNewCourse(user_instance_node_id,other_user_name,user_count);
    }
    event.stopPropagation();
  });

  bodyEle.on('click','.delete-participants', function(event) {
    var dialog_instance_node_id = $('.first-div-min-participant').data('id');
    var user_instance_node_id = $(this).closest('li').data('id');
    var username  = $(this).closest('li').find('.expanded-content').text();
    if($(this).closest('li').hasClass('old_actor_list')) {
        var remove_type = 'old';
        var event_type='addInFile';
    } else {
        var remove_type = 'new';
        var event_type='addInFile';
    }
    $(this).closest('li').remove();
    if($('.dilaog_actor_list').length==0) {
      $('.no-paticipant').css('display','block').text('No participants added.');
    }
    removeUserFromFile(dialog_instance_node_id,user_instance_node_id,username,event_type,remove_type);
    var participantHig = $(".add-participant-js").height()
    var userlistingHig = $(".add-participant-js .user-listing li").height()*$(".add-participant-js .user-listing li").length;
    if(participantHig > userlistingHig) {
        var finalHig = participantHig - $(".add-participant-js .user-listing li").height();
        $(".add-participant-js").height(finalHig);
        $(".second-div-mini-participant .nano").nanoScroller({
            destroy: true
        });
        $('.add-participant-js').removeClass('siblingfixed');
        $(".add-participant-js .nano-content").css("right","-17px");
    }
  });
  bodyEle.on('keypress','.ref-append-user-list input', function(e) {
    if(e.which == 13) {
      $('.add-participants-list').trigger('click');
    }
    e.stopPropagation()
  });
  bodyEle.on('keypress','#add_participant_new_user input', function(e) {
    if(e.which == 13) {
        $('.add-participants-list').trigger('click');
    }
    e.stopPropagation()
  });
}
/*actor resize on add*/
function actorResize() {
  var totalHig = $(".mini-participant-panel").height()-($('.first-div-min-participant').height()+$(".second-div-mini-participant .partcipant-head").height()+$(".create-sibling").height());
  if(!$(".add-participant-js").hasClass("siblingfixed")) {
      var finalHig = $(".add-participant-js .user-listing li").length * $(".add-participant-js .user-listing li").height();
      $(".add-participant-js").height(totalHig-50);
  }
  var fixedHig = $(".create-sibling").height()+$(".add-participant-js .user-listing li").height();
  if(totalHig <= fixedHig) {
      $(".second-div-mini-participant .nano").nanoScroller();
      $(".second-div-mini-participant .nano").nanoScroller({
          scroll: 'bottom'
      });
      $('.add-participant-js').addClass('siblingfixed');
  }
  var participantHig = $(".add-participant-js").height();
  var userlistingHig = $(".add-participant-js .user-listing li").height()*$(".add-participant-js .user-listing li").length;
  if(participantHig >= userlistingHig) {
    $(".second-div-mini-participant .nano").nanoScroller({
        //destroy: true
    });
  }
}

//to rename title
function renameTitleMiniDialogue() {
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });
  $('.rename-title-mini .rename-edit-cover-box').click(function(event) {
    $(this).addClass('hide');
    $(".rename-title-mini .dialog-tilte-node-id, .rename-title-mini .title-icon").addClass('hide');
    $('.edit-rename-title-mini').removeClass('hide');
    $(".edit-dialogue-span-box .edit-dialog-random-title").select();
    $(".mini_arrow_up.angle-collapse-up").addClass("abc");
    event.stopPropagation();
  });
  $('.edit-rename-title-mini i').click(function(event){
    $('.rename-title-mini .rename-edit-cover-box').removeClass('hide');
    $('.edit-rename-title-mini').addClass('hide');
    $(".mini_arrow_up.angle-collapse-up").removeClass("abc");
    $(".rename-title-mini .dialog-tilte-node-id, .rename-title-mini .title-icon").removeClass('hide');
    event.stopPropagation();
  });
}

function  ipadContextMenu() {
}

function resizeToMinimum(w,h) {
  var w = w > w_popout.outerWidth ? w : w_popout.outerWidth;
  var h = h > w_popout.outerHeight ? h : w_popout.outerHeight;
  if(w_popout.outerWidth < screen.width) {
    w_popout.resizeTo(w,h);
  }
};

$(window).resize(function() {
  enterParticipantField();
});
function miniDialogueResizeShrink(){
    $( ".pu_plugin_mini_dialogue.opened" ).resizable({
      handles: "n, w, nw",
       resize: function( event, ui ) {
        var windowResizeTotalHeight = $(window).height();
        var windowResizeTotalWidth  = $(window).width();
        var getResizeDialogueTotalWidth = $(".mini-dialogue-flyout").width();
        var getResizePeopleSectionWidth = $(".mini-dialogue-flyout .tabing-section").width();
        var getResizeUserActionWidth    = $(".ref-min-right-dialogue").width();
        var totalResizeDialogueWidth    = getResizeDialogueTotalWidth - (getResizePeopleSectionWidth + getResizeUserActionWidth);
        var getResizeMiniTextHeight     = $(".mini-type-textarea").height();
        var getResizeTopBarHeight       = $(".right-bar-tab").height();
        var getResizeFirstDivHeight     = $(".first-div-min-participant").height();
        var getResizeDialogueTotalHeight = $(".mini-dialogue-flyout").height();
        var searchExistingWidth          = $(".pu_plugin_mini_dialogue .search-existing-course").width();
        var autoSuggestDropdownWidth     = $(".pu_plugin_mini_dialogue .autosuggest_dropdown_width").width();
        var refActorWidth               = $(".ref-actorDialogue").width();
        var resizeMiniFlyModalWidthCal   = $(".mini-dialogue-flyout").width();
        var resizeMiniFlyModalHeightCal  = $(".mini-dialogue-flyout").height();
        var refMinRightTabHght           = $(".ref-min-center-dialogue .right-bar-tab").height();
        var leftBtmPaneHght              = $(".people-section .ref-lt-pane").height();
        var tabPanelHght                 = $(".people-section .tab_box").height();
        var totalRemMinSetHght           = resizeMiniFlyModalHeightCal - (leftBtmPaneHght + tabPanelHght);
        $(".mini_accordion_wrap").height($(".mini-dialogue-flyout").height() - $(".ref-lt-pane").height());
        $(".mini_accordion_wrap .nano").height($(".mini_accordion_wrap").height());
        $(".modalMiniDialogue").width(resizeMiniFlyModalWidthCal).height(resizeMiniFlyModalHeightCal);
        $(".ref-min-center-dialogue, .mini-type-textarea").width(totalResizeDialogueWidth- 3);
        $(".mini-dialogue-flyout .tabing-section , .mini-dialogue-flyout .ref-min-left-dialogue, .mini-dialogue-flyout .ref-actorDialogue, .mini-dialogue-flyout .ref-actors-RT, .mini-dialogue-flyout .ref-actors-LT, .pu_plugin_mini_dialogue .loader-actor-box").height(getResizeDialogueTotalHeight);
        $(".mini-dialogue-flyout .reply-list-wrap").height(getResizeDialogueTotalHeight);
        $(".mini-dialogue-flyout .ref-set-height").height(getResizeDialogueTotalHeight - (getResizeMiniTextHeight + getResizeTopBarHeight));
        $(".mini-dialogue-flyout .second-div-mini-participant .add-participant-js").height(getResizeDialogueTotalHeight - getResizeFirstDivHeight);
        $(".mini-overlay-wrapper, .mini-overlay-white-wrapper").width(getResizeDialogueTotalWidth);
        $(".pu_plugin_mini_dialogue .loader-actor-box").width(refActorWidth);
        $(".mini-overlay-wrapper, .mini-overlay-white-wrapper").height(getResizeDialogueTotalHeight);
        if($(".expand-collapse-box").hasClass("append-top")) {
          refMinRightTabHghtAppend = $(".ref-min-center-dialogue .right-bar-tab:visible").height();
          totalMiniTextHghtAppend = resizeMiniFlyModalHeightCal - refMinRightTabHghtAppend;
          $(".mini-type-textarea, .ref-textarea-HT").height(totalMiniTextHghtAppend -1);
          $("#add-text").height(100 +"%");
        }
        $("body").on("click", ".expanded-box", function() {
          refMinRightTabHght1 = $(".ref-min-center-dialogue .right-bar-tab:visible").height();
          totalMiniTextHght   = resizeMiniFlyModalHeightCal - refMinRightTabHght1;
          $(".mini-type-textarea, .ref-textarea-HT").height(totalMiniTextHght -1);
          $("#add-text").height(100 +"%");
        });
        $( ".pu_plugin_mini_dialogue.opened" )
          .resizable( "option", "maxWidth", windowResizeTotalWidth - 5)
          .resizable( "option", "maxHeight", windowResizeTotalHeight - 5)
          .resizable( "option", "minWidth", 640)
          .resizable( "option", "minHeight", 300);
        $(".pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions").width(searchExistingWidth);
        $(".pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions").width(autoSuggestDropdownWidth);
        $(".pu_plugin_mini_dialogue .addAutoCompleteBox .autocomplete-suggestions, .pu_plugin_mini_dialogue .email_input_field_ui .autocomplete-suggestions, .pu_plugin_mini_dialogue .add_participant_user .autocomplete-suggestions").hide();
        var autoCompleteInputWdt = $(".create-sibling").width();
        $(".pu_plugin_mini_dialogue.mini-dialogue-flyout .create-sibling .Add-more-participants .autocomplete-suggestions").width(autoCompleteInputWdt - 10);
        if($('.pu_plugin_mini_dialogue.opened').width() >= 1010) {
           $(".tabing-section, .right-dialogue-panel").width(getResizeDialogueTotalWidth/4);
           $(".ref-min-center-dialogue, .mini-type-textarea").width(getResizeDialogueTotalWidth*3/4 - 62);
           $(".ref-min-right-dialogue").css("width", 60+"px");
        } else {
           $(".tabing-section, .right-dialogue-panel").css("width", 230+"px");
           if($(".tabing-section, .right-dialogue-panel").width("width" == 230)) { // this is a strange condition. I am not able to understand it.
              $(".ref-min-right-dialogue").css("width", 60+"px");
              $(".ref-min-center-dialogue, .mini-type-textarea").width(getResizeDialogueTotalWidth- 291);
           }
        }
        // actors-flyout width
        var refActorFlyResizeWidth = getResizeDialogueTotalWidth/2;
        var userActionDialogue = $(".mini-dialogue-flyout .user-section-strip").width();
        $(".mini-participant-panel.ref-actorDialogue").width(refActorFlyResizeWidth);
      }
    });
}

var w_popout;

//chat window Event
function MinichatWindow() {
  var chatWindow = $(".mini-dialogue-flyout").outerWidth();
  $('.mini-chat').click(function(e) {
    var FlyID = $(this).attr('id');
    if(!$("#"+ FlyID + ".modalFlyout").hasClass('opened')) {
      e.preventDefault();
      if(!w_popout || w_popout.closed) {
        $("#"+ FlyID +'.mini-dialogue-flyout').animate({
            "margin-right":"0"
        },function() {
            var setter = $('.mini-set-height .all-users-mini li').first().offset().top;
            $('.mini-set-height .all-users-mini li').first().addClass('fixedStickymini').css('top',setter);
        }).addClass("opened");
      } else {
         w_popout.focus();
      }
    }
  });
}

$( window ).load(function() {
    // user chat window
    $(".expended-height").css("background","#fff");
    //mini dialogue onload change class
    var currentURL = findUrl();
    if(currentURL=='minidialog') {
      $(".icon.unlock-window").removeClass("unlock-window").addClass("lock-window");
      $(".pop-out").removeClass("pop-out").addClass("pop-in");
      $(".windowClose").removeClass('hide');
      $(".close-mini-dialogue").addClass('hide');
      $(".ref-create-dialogue").click(function(){
          $(".close-mini-dialogue").removeClass('hide');
          $(".windowClose").addClass('hide');
      });
      $(".imranClose, .add-participants-list").click(function() {
        $(".windowClose").removeClass('hide');
        $(".close-mini-dialogue").addClass('hide');
      });
      var element = $(".pop-up-window");
      if(element.hasClass("pop-in")) {
        element.find("span").text("Dock");
      } else {
        element.find("span").text("Undock");
      }
    }
});
function miniActiveCollapse() {
  $("body").on("click", ".mini-accordion-wrap .panel", function() {
    var element = $(".mini-accordion-wrap .base-container i");
    if(element.hasClass('fa-angle-up')) {
      element.removeClass('fa-angle-up').addClass('fa-angle-down');
    }
  });
}
