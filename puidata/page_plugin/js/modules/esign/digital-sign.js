$(document).ready(function(){  
var setMouseOnDoc = false;
var documentSigned = false;
var  topWithImg    = 130; // change to 130
var  topWithoutImg = 180; // change to 180

$("body").off("mouseover touchstart","#digitalSign").on("mouseover touchstart","#digitalSign",function(){
    digitalSign.init("digitalSign");
});

$("body").off("mouseover touchstart","#initialSign").on("mouseover touchstart","#initialSign",function(){
    digitalSign.init("initialSign");
});

    $("body").off("click","#createSignature").on("click","#createSignature",function(){

       

        //changes start
        DocDualPaneAnmate();
        $('.signWrap').height($('.mid-section-HT').height()-50);
        //changes End

        $("#signDocument").removeClass('active');
        $(this).addClass('active');
        $("#signatureContainer").show();
        $("#signDocumentContainer").hide();
        $("#doActorSign").val("select");
        $("#doActorSign").trigger("change");  
        digitalSign.init("digitalSign");      
    })
   
    $("body").off("click","#signDocument").on("click","#signDocument",function(){

        $("#createSignature").removeClass('active');
        $(this).addClass('active');
        




        if(localStorage.actor1Signfull==undefined && localStorage.actor2Signfull==undefined){
            bootbox.alert({title: "Alert", message:"First you need to create a signature for Actor 1 and Actor 2."});
            $("#signDocument").removeClass('active');
            $("#createSignature").addClass('active');
            return false;
        }
        else if(localStorage.actor1Signfull==undefined){
            bootbox.alert({title: "Alert", message:"Signature for Actor 1 is required."});
            $("#signDocument").removeClass('active');
            $("#createSignature").addClass('active');
            return false;
        }
        else if(localStorage.actor2Signfull==undefined){
            bootbox.alert({title: "Alert", message:"Signature for Actor 2 is required."});
            $("#signDocument").removeClass('active');
            $("#createSignature").addClass('active');
            return false;
        }
        $("#signatureContainer").hide();
        
        //changes start
        DocSinglePaneResize();
        $('.signWrap').height($('.mid-section-HT').height()-50);
        //changes End

        $("#signDocumentContainer").show();

        documentSigned=false;
        setMouseOnDoc = false;
        $("#selectActor").val("select");
        $(".signIMG").scrollTop(0);
        $("#sign").hide();
        setTimeout(function(){
            $('.signIMG ').mCustomScrollbar('scrollTo',[null,'left']); 
        },500);
    }) 

    $("body").off("click",".signingDocThumb").on("click",".signingDocThumb",function(){
            $(".signingDocThumb").removeClass("active");
            $(this).addClass("active");
            var getIndex = $(this).index();
            var toYPos = $(".signingDoc:eq("+getIndex+")").position().top;
            $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);            
    });

    $("body").off("change","#doActorSign").on("change","#doActorSign",function(){
        var getValue = $(this).val();        
        $('#btn').val('Adopt and Save');
        if(getValue=="select"){
            $("#signRegion").css("display","none");
        }
        else{
            digitalSign.erase("digitalSign");
            digitalSign.erase("initialSign");
            $("#signRegion").css("display","block");
        }   
        var getWT = $(window).width();
        if(getWT <= '1100'){    
        $('canvas#digitalSign').attr('width','255');
        }
        else{
            $('canvas#digitalSign').attr('width','350');
        }
    });


    $("body").off("change","#selectActor").on("change","#selectActor",function(){
        var getValue = $(this).val();
        if(getValue=='actor1Sign'){    
            $('.signIMG ').mCustomScrollbar('scrollTo',[null,'left']);
        }
        //$(".signPplace").css("display","none");
        $("."+getValue).css("display","block");
        $(".signPplace").removeClass("selected").find(".signedArrow").remove();        
        $("."+getValue+":first").addClass("selected");
        var getSignIndex = $("."+getValue+".selected").index()+1;
        var totalSign = $("."+getValue).length;
        var digitalArrowHTML = "<div class='signedArrow notSigned'>Sign "+getSignIndex+"/"+totalSign+"</div>";
        var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned'>Signed</div>";
        var getIMG = $("."+getValue+".selected").find("img"); 

        $("."+getValue).each(function(index){
            var thisIMG  = $(this).find("img");
            if(thisIMG.length>0){
                $("#right-signed-wrap ul li:eq("+index+") span").addClass("signed_tick");
                $(this).html(digitalArrowHTMLSigned + "<img src="+thisIMG.attr('src')+">");
            }
            else{
                $("#right-signed-wrap ul li:eq("+index+") span").removeClass("signed_tick");
                var digitalArrowRepeatHTML = "<div class='signedArrow notSigned'>Sign "+(index+1)+"/"+totalSign+"</div>";
                $(this).html(digitalArrowRepeatHTML);
            }
        });
        $("#right-signed-wrap ul li.selected").removeClass("selected");
        $("#right-signed-wrap ul li:eq("+$("."+getValue+".selected").index()+")").addClass("selected");

        if(getIMG.length>0){            
            $("."+getValue+".selected").html(digitalArrowHTMLSigned + "<img src="+getIMG.attr('src')+">");
        }
        else{
            $("."+getValue+".selected").html(digitalArrowHTML);
        }
        //$("."+getValue+":first").html(digitalArrowHTML);
        if(isScrolledIntoView($("."+getValue+":first"))==false){
            if($("."+getValue+".selected img").length==0){
            var toYPos = $("."+getValue+":first").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
            }
            else{
            var toYPos = $("."+getValue+":first").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
            }
            $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]); 
            checkSignDocPositions($(".signPplace.selected").position().top);           
        }

        if(getValue=="actor1Sign"){
            $("."+getValue+" div").addClass("leftArrow");    
        }

    });

    $("body").off("click","#nextSign").on("click","#nextSign",function(){
        var getActor = $("#selectActor").val();
        var getNext = $("."+getActor+".selected").nextAll("."+getActor).first();
        if(isScrolledIntoView($("."+getActor+".selected"))==false){
            if($("."+getActor+".selected img").length==0){
            var toYPos = $("."+getActor+".selected").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
            }
            else{
            var toYPos = $("."+getActor+".selected").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
            }
            $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);
            checkSignDocPositions($(".signPplace.selected").position().top);
            return false;
        }

        if(getNext.length>0){
            $(".signPplace").removeClass("selected").find(".signedArrow").remove();
            getNext.addClass("selected");
            var getSignIndex = $("."+getActor+".selected").index()+1;
            var totalSign = $("."+getActor).length;
            if(getActor=="actor1Sign"){
            var digitalArrowHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
            var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned leftArrow'>Signed</div>";
            }
            else{
            var digitalArrowHTML = "<div class='signedArrow notSigned'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
            var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned'>Signed</div>";   
            }
            var getIMG = getNext.find("img");      
            $("."+getActor).each(function(index){
                var thisIMG  = $(this).find("img");
                if(thisIMG.length>0){
                    $("#right-signed-wrap ul li:eq("+index+") span").addClass("signed_tick");
                    $(this).html(digitalArrowHTMLSigned + "<img src="+thisIMG.attr('src')+">");
                }
                else{
                    $("#right-signed-wrap ul li:eq("+index+") span").removeClass("signed_tick");
                    if(getActor=="actor1Sign"){
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+(index+1)+"/"+totalSign+"</div>";
                    }else{
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned'>Sign "+(index+1)+"/"+totalSign+"</div>";    
                    }
                    $(this).html(digitalArrowRepeatHTML);
                }
            });

            $("#right-signed-wrap ul li.selected").removeClass("selected");
            $("#right-signed-wrap ul li:eq("+$("."+getActor+".selected").index()+")").addClass("selected");

            if(getIMG.length>0){                
                getNext.html(digitalArrowHTMLSigned + "<img src="+getIMG.attr('src')+">");
            }
            else{
                getNext.html(digitalArrowHTML);
            }
            if(isScrolledIntoView(getNext)==false){
                if($("."+getActor+".selected img").length==0){
                var toYPos = getNext.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
                }
                else{
                var toYPos = getNext.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
                }
                $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);
                checkSignDocPositions($(".signPplace.selected").position().top);
            }
            else{
                checkSignDocPositions($(".signPplace.selected").position().top);
            }
        }        
    }); 

    $("body").off("click","#prevSign").on("click","#prevSign",function(){
        var getActor = $("#selectActor").val();
        var getPrevious = $("."+getActor+".selected").prevAll("."+getActor).first();

        if(isScrolledIntoView($("."+getActor+".selected"))==false){
            if($("."+getActor+".selected img").length==0){
            var toYPos = $("."+getActor+".selected").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
            }
            else{
            var toYPos = $("."+getActor+".selected").offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
            }
            $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);
            checkSignDocPositions($(".signPplace.selected").position().top);          
            return false;
        }

        if(getPrevious.length>0){
            $(".signPplace").removeClass("selected").find(".signedArrow").remove();
            getPrevious.addClass("selected");
            var getSignIndex = $("."+getActor+".selected").index()+1;
            var totalSign = $("."+getActor).length;
            if(getActor=="actor1Sign"){
                var digitalArrowHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
                var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned leftArrow'>Signed</div>";
            }
            else{
                var digitalArrowHTML = "<div class='signedArrow notSigned'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
                var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned'>Signed</div>";   
            }
            var getIMG = getPrevious.find("img");   
            $("."+getActor).each(function(index){
                var thisIMG  = $(this).find("img");
                if(thisIMG.length>0){
                    $("#right-signed-wrap ul li:eq("+index+") span").addClass("signed_tick");
                    $(this).html(digitalArrowHTMLSigned + "<img src="+thisIMG.attr('src')+">");
                }
                else{
                    $("#right-signed-wrap ul li:eq("+index+") span").removeClass("signed_tick");
                    if(getActor=="actor1Sign"){
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+(index+1)+"/"+totalSign+"</div>";
                    }
                    else{
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned'>Sign "+(index+1)+"/"+totalSign+"</div>";    
                    }
                    $(this).html(digitalArrowRepeatHTML);
                }
            });

            $("#right-signed-wrap ul li.selected").removeClass("selected");
            $("#right-signed-wrap ul li:eq("+$("."+getActor+".selected").index()+")").addClass("selected");

            if(getIMG.length>0){                
                getPrevious.html(digitalArrowHTMLSigned + "<img src="+getIMG.attr('src')+">");
            }
            else{
                getPrevious.html(digitalArrowHTML);
            }
            if(isScrolledIntoView(getPrevious)==false){
                if($("."+getActor+".selected img").length==0){
                var toYPos = getPrevious.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
                }
                else{
                var toYPos = getPrevious.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
                }
                $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);  
                checkSignDocPositions($(".signPplace.selected").position().top);              
            }
            else{
                checkSignDocPositions($(".signPplace.selected").position().top);
            }
        }
    });

    $("body").off("click","#applySign").on("click","#applySign",function(){
        var getSelectedSignaturePlace = $(".signPplace.selected");
        var getActor = $("#selectActor").val();
        var getNext = $("."+getActor+".selected").nextAll("."+getActor).first();

        if(getSelectedSignaturePlace.find("img").length>0){
           bootbox.alert({title: "Alert", message:"Signature already applied here."}); 
           return false;
        }


        if(getNext.length==0){
            getNext = $("."+getActor+":first");
        }

        if (typeof(Storage) !== "undefined") {
                var getSign = localStorage[getActor+"full"];
            } else {
                return false;
            }

            if(getActor=="select"){
                bootbox.alert({title: "Alert", message:"Select an actor first."});
                return false;
            }

            //var getWidth = getSelectedSignaturePlace.width();
            var getSelectedSignaturePlaceHTML = getSelectedSignaturePlace.html();
            if(getActor=="actor1Sign"){
                var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned leftArrow'>Signed</div>";
            }
            else{
                var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned'>Signed</div>";
            }
            getSelectedSignaturePlace.html(digitalArrowHTMLSigned + "<img src='"+getSign+"' style='display:none;'/>"); 
            $("#right-signed-wrap ul li:eq("+getSelectedSignaturePlace.index()+") span").addClass("signed_tick");                       
            setTimeout(function(){
                var getTop = getSelectedSignaturePlace.position().top - getSelectedSignaturePlace.find("img").height();
                getSelectedSignaturePlace.css("top",getTop+"px");
                getSelectedSignaturePlace.find("img").css("display","inline-block");
            },100)            
            //getNext.addClass("selected");
    });


$("body").off("click","#right-signed-wrap li").on("click","#right-signed-wrap li",function(){        
        var getActor = $("#selectActor").val();
        if(getActor=="select"){
           bootbox.alert({title: "Alert", message:"Select an actor first."});
            return false;
        }
        var getThisIndex = $(this).index();
        var getNext = $("."+getActor+":eq("+getThisIndex+")");
        $(".signPplace").removeClass("selected").find(".signedArrow").remove();
        $("#right-signed-wrap ul li.selected").removeClass("selected");
        $(this).addClass("selected");
        getNext.addClass("selected");
        var getSignIndex = getNext.index()+1;
        var totalSign = $("."+getActor).length;
        if(getActor=="actor1Sign"){
            var digitalArrowHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
            var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned leftArrow'>Signed</div>";
        }
        else{
            var digitalArrowHTML = "<div class='signedArrow notSigned'>Sign "+getSignIndex+"/"+totalSign+"</div>"; 
            var digitalArrowHTMLSigned = "<div class='signedArrow alreadySigned'>Signed</div>";   
        }
        var getIMG = getNext.find("img");      
        $("."+getActor).each(function(index){
            var thisIMG  = $(this).find("img");
            if(thisIMG.length>0){
                $("#right-signed-wrap ul li:eq("+index+") span").addClass("signed_tick");
                $(this).html(digitalArrowHTMLSigned + "<img src="+thisIMG.attr('src')+">");
            }
            else{
                $("#right-signed-wrap ul li:eq("+index+") span").removeClass("signed_tick");
                if(getActor=="actor1Sign"){
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned leftArrow'>Sign "+(index+1)+"/"+totalSign+"</div>";
                }
                else{
                    var digitalArrowRepeatHTML = "<div class='signedArrow notSigned'>Sign "+(index+1)+"/"+totalSign+"</div>";
                }
                $(this).html(digitalArrowRepeatHTML);
            }
        });
        if(getIMG.length>0){                
            getNext.html(digitalArrowHTMLSigned + "<img src="+getIMG.attr('src')+">");
        }
        else{
            getNext.html(digitalArrowHTML);
        }
        if(isScrolledIntoView(getNext)==false){
            if($("."+getActor+".selected img").length==0){
            var toYPos = getNext.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithoutImg;
            }
            else{
            var toYPos = getNext.offset().top - $(".signIMG").height() +  $(".signIMG").offset().top + Math.abs($(".signIMG").find(".mCSB_container").position().top) - topWithImg;    
            }
            $('.signIMG').mCustomScrollbar("scrollTo",[toYPos]);
            checkSignDocPositions($(".signPplace.selected").position().top);
        }
        else{
            checkSignDocPositions($(".signPplace.selected").position().top);
        }
});



});

var digitalSign = {
    canvas:false, ctx:false, flag:false,prevX : 0, currX : 0, prevY : 0, currY : 0, dot_flag : false, x : "black", y : 2
}
    
    digitalSign.init = function(elmID){
        canvas = document.getElementById(elmID);
        digitalSign.ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;
    
        canvas.addEventListener("mousemove", function (e) {
            digitalSign.findxy('move', e.clientX, e.clientY)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            digitalSign.findxy('down', e.clientX, e.clientY)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            digitalSign.findxy('up', e.clientX, e.clientY)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            digitalSign.findxy('out', e.clientX, e.clientY)
        }, false);


        canvas.addEventListener("touchmove", function (e) {
            digitalSign.findxy('move', e.touches[0].clientX, e.touches[0].clientY)
        }, false);
        canvas.addEventListener("touchstart", function (e) {
            digitalSign.findxy('down', e.touches[0].clientX, e.touches[0].clientY)
        }, false);
        canvas.addEventListener("touchend", function (e) {
            digitalSign.findxy('up', e.touches[0].clientX, e.touches[0].clientY)
        }, false);

    }
    
    digitalSign.color=function(obj) {
        switch (obj.id) {
            case "green":
                x = "green";
                break;
            case "blue":
                x = "blue";
                break;
            case "red":
                x = "red";
                break;
            case "yellow":
                x = "yellow";
                break;
            case "orange":
                x = "orange";
                break;
            case "black":
                x = "black";
                break;
            case "white":
                x = "white";
                break;
        }
        if (x == "white") y = 14;
        else y = 2;
    
    }
    
    digitalSign.draw=function() {
        var getID = digitalSign.ctx.canvas.id;
        $('#'+getID).removeClass(getID);
        digitalSign.ctx.beginPath();
        digitalSign.ctx.moveTo(digitalSign.prevX, digitalSign.prevY);
        digitalSign.ctx.lineTo(digitalSign.currX, digitalSign.currY);
        digitalSign.ctx.strokeStyle = digitalSign.x;
        digitalSign.ctx.lineWidth = digitalSign.y;
        digitalSign.ctx.stroke();
        digitalSign.ctx.closePath();        
    }
    
    digitalSign.erase=function(which) {
        digitalSign.init(which);
        $('#'+which).addClass(which);
        digitalSign.ctx.clearRect(0, 0, w, h);
    }
    
digitalSign.trim=function(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i+3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);
  
      if (bound.top === null) {
        bound.top = y;
      }
      
      if (bound.left === null) {
        bound.left = x; 
      } else if (x < bound.left) {
        bound.left = x;
      }
      
      if (bound.right === null) {
        bound.right = x; 
      } else if (bound.right < x) {
        bound.right = x;
      }
      
      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }
    
  var trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
  
  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);
  
  // open new window with trimmed image:
  return copy.canvas;
}


    digitalSign.save=function() {
       // document.getElementById("renderSign").style.border = "2px solid";
        digitalSign.init("digitalSign");
        var dataURLFull = digitalSign.trim(canvas).toDataURL();
        digitalSign.init("initialSign");
        var dataURLInitial = digitalSign.trim(canvas).toDataURL();
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem($("#doActorSign").val()+"full",dataURLFull);
            localStorage.setItem($("#doActorSign").val()+"intital",dataURLInitial);
            //localStorage.setItem($("#doActorSign").val(), dataURL);
        } else {
            bootbox.alert({title: "Alert", message:"Get Latest Version."});
        }

        //bootbox.alert("Signature Saved");
        $('#btn').val('Adopted');
        //document.getElementById("renderSign").src = dataURL;
        //document.getElementById("renderSign").style.display = "inline";
    }
    
    digitalSign.findxy=function(res, x,y) {
        if (res == 'down') {
            digitalSign.prevX = digitalSign.currX;
            digitalSign.prevY = digitalSign.currY;
            digitalSign.currX = x - canvas.offsetLeft;
            digitalSign.currY = y - canvas.offsetTop;
    
            digitalSign.flag = true;
            digitalSign.dot_flag = true;
            if (digitalSign.dot_flag) {
                digitalSign.ctx.beginPath();
                digitalSign.ctx.fillStyle = digitalSign.x;
                digitalSign.ctx.fillRect(digitalSign.currX, digitalSign.currY, 2, 2);
                digitalSign.ctx.closePath();
                digitalSign.dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            digitalSign.flag = false;
        }
        if (res == 'move') {
            if (digitalSign.flag) {
                digitalSign.prevX = digitalSign.currX;
                digitalSign.prevY = digitalSign.currY;
                digitalSign.currX = x - canvas.offsetLeft;
                digitalSign.currY = y - canvas.offsetTop;
                digitalSign.draw();
            }
        }
    }

function checkSignDocPositions(signPosition){
    $(".signImgContainer .signingDoc").each(function(i){
        var getCurrHeight = $(this).position().top + $(this).outerHeight() + 20;
        if(signPosition>$(this).position().top && getCurrHeight>signPosition){           
            var getIndex = $(this).attr("index");
            $(".signingDocThumb").removeClass("active");
            $(".signingDocThumb:eq("+getIndex+")").addClass("active");
            if(isScrolledIntoViewThumbs($(".signingDocThumb.active"))==false){
                var toYPos = $(".signingDocThumb.active").offset().top - $("#signThumbnails").offset().top + Math.abs($("#signThumbnails").find(".mCSB_container").position().top) - 20;
                $('#signThumbnails').mCustomScrollbar("scrollTo",[toYPos]);                
            }
            return false;
        }
    })

}


function isScrolledIntoView(elem)
{
    var docViewTop = Math.abs($(".signIMG").find(".mCSB_container").position().top);
    var docViewBottom = docViewTop + $(".signIMG").height();

    var elemTop = $(elem).position().top+20;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function isScrolledIntoViewThumbs(elem)
{
    var docViewTop = Math.abs($("#signThumbnails").find(".mCSB_container").position().top);
    var docViewBottom = docViewTop + $("#signThumbnails").height();

    var elemTop = $(elem).position().top+20;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}