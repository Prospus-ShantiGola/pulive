$(document).ready(function(){
  $("#changeTheme").click(function(){
    $('.control-panel').toggle();
  });

  /* ===========change theme of full website============= */
  $("select#changeFont").change(function(){
    var getFont = $(this).val();
    $("body").removeClass().addClass(getFont);
    $("body").addClass('sass-lang');

  });
  $("select#changesize").change(function(){
    var getSize = $(this).val();
    $("body").removeAttr().css('font-size', getSize+'px');
    $("body").addClass('sass-lang');
  });
  $("select#changeheadingsize").change(function(){
    var getSize = $(this).val();
    $("h3, h4").removeAttr().css('font-size', getSize+'px');
    $("body").addClass('sass-lang');
  });


  /* ===========change Background============= */

  $("#changeBgColor li").click(function(){

    var getId = $(this).closest('.theme-box').attr("data-id");
    var getColor = $(this).data('value');

    if(getColor == "default"){
      $('#'+getId).removeClass('greyBG brownBG blueBG greenBG');
    }

    if(getColor == "grey"){
      $('#'+getId).removeClass('greyBG brownBG blueBG greenBG');
      $('#'+getId).addClass('greyBG');
    }
    if(getColor == "brown"){
      $('#'+getId).removeClass('greyBG brownBG blueBG greenBG');
      $('#'+getId).addClass('brownBG');
    }
    if(getColor == "blue"){
      $('#'+getId).removeClass('greyBG brownBG blueBG greenBG');
      $('#'+getId).addClass('blueBG');
    }
    if(getColor == "green"){
      $('#'+getId).removeClass('greyBG brownBG blueBG greenBG');
      $('#'+getId).addClass('greenBG');
    }

  });


})