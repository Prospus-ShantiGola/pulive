$(document).ready(function(){
/*when user click first HTML Element in properties*/
    $("body").on("keydown",".tabber li:first",function(event){
          var $keycode = (event.keyCode ? event.keyCode : event.which);
          if($keycode == 13) {
           event.preventDefault();
           addChildProperty($(this));
           tabPositions();
           calculatePlusIcons();
           event.stopPropagation();
        } 
        
        if($keycode == 40) {
          var elements = $(this).parents(".tabber").find(".runTab");
          var currentIndex = elements.index($(this).find(".runTab"));
          $(elements[currentIndex + 1]).focus();
          event.stopPropagation();
        }  
		
		if($keycode == 9) {
            event.preventDefault();
		}	
		if($keycode == 8){
			var getThisText = $(this).find(".runTab:first").val().length;
           if((getThisText==0)){

			   if($(this).prev().closest("li").find(".runTab").attr("class")==undefined){
			   var k = $(this).closest("ol").closest("li").find(".runTab");
         /* Start Code By Arvind Soni */
          var property = $(this).find('textarea').prop('id');
          property = property.replace('property_', '');

          var newIds = property+',';
          $("#old_"+property).find("ol li").each(function(){
            newIds = newIds+$(this).attr("data-class")+',';
          });
          var npids = $("#remove_prop_ids").val()+newIds;
          $("#remove_prop_ids").attr('value',npids);
        /* End Code By Arvind Soni */

			   $(this).remove();
			   k.focus();
			   }
			   else{
			   $(this).prev().closest("li").find(".runTab").focus();
         /* Start Code By Arvind Soni */
          var property = $(this).find('textarea').prop('id');
          property = property.replace('property_', '');
          var newIds = property+',';
          $("#old_"+property).find("ol li").each(function(){
            newIds = newIds+$(this).attr("data-class")+',';
          });
          var npids = $("#remove_prop_ids").val()+newIds;
          $("#remove_prop_ids").attr('value',npids);
        /* End Code By Arvind Soni */
			   $(this).remove();
			   }

			   calculatePlusIcons();
			   var propLen = $('.tabber li').length;
			   if(propLen == 0){
					$(".tabber").closest('.sortable').find('.addplus').empty();
					$(".tabber").closest('.sortable').find('.addplus').hide()
				}
				setNumberPrint();
			   return false;
           }
					
				 //remove first property when add new class @niraj
		}
        
    });
	
	// Added a fix to last tabbing breaking up layout. @vimal
	 $("body").on("keydown",".instanceRunTab:last, .runTab:last",function(event){
	    var $keycode = (event.keyCode ? event.keyCode : event.which);
		if($keycode == 9) {
            event.preventDefault();
		}
	});
	
	
    
  $("body").on("keydown",".tabber li:not(:first)",function(event){ /* remove first property on press backspace */
      // $("body").on("keydown",".tabber li",function(event){
      var $keycode = (event.keyCode ? event.keyCode : event.which);
        if(event.shiftKey && $keycode == 9) {
            event.preventDefault();
            if(!$(this).closest("ol").hasClass("tabber")){
                var getParentPosition = $(this).closest("ol").closest("li");
                $(this).insertAfter(getParentPosition);
                $(this).find(".runTab").focus();
            }
            tabPositions();
            calculatePlusIcons();
            return false;
        }  
        
        if($keycode == 9) {
            event.preventDefault();
            if($(this).prev("li").attr("id")!=undefined){
                $(this).prev().find("ol:first").append($(this)).find(".runTab").focus();
                //$(this).find(".runTab").focus();
            }
            tabPositions();
            calculatePlusIcons();
      increaseWidthEdit($keycode);//increase width in edit case
            return false;
        }
        
        if($keycode == 8) {
      
           var getThisText = $(this).find(".runTab:first").val().length;
           if((getThisText==0)){
         if($(this).prev().closest("li").find(".runTab").attr("class")==undefined){
         var k = $(this).closest("ol").closest("li").find(".runTab");
         var $currentSelection = $(this);
         increaseWidthEdit ($keycode, $currentSelection)//decrease width in edit mode on press backspace
        /* Start Code By Arvind Soni */
          var property = $(this).find('textarea').prop('id');
          property = property.replace('property_', '');

          var newIds = property+',';
          $("#old_"+property).find("ol li").each(function(){
            newIds = newIds+$(this).attr("data-class")+',';
          });
          var npids = $("#remove_prop_ids").val()+newIds;
          $("#remove_prop_ids").attr('value',npids);
        /* End Code By Arvind Soni */
         $(this).remove();
         k.focus();
         }
         else{
         $(this).prev().closest("li").find(".runTab").focus();
         /* Start Code By Arvind Soni */
         var property = $(this).find('textarea').prop('id');
          property = property.replace('property_', '');

          var newIds = property+',';
          $("#old_"+property).find("ol li").each(function(){
            newIds = newIds+$(this).attr("data-class")+',';
          });
          var npids = $("#remove_prop_ids").val()+newIds;
          $("#remove_prop_ids").attr('value',npids);
        /* End Code By Arvind Soni */
         $(this).remove();
         }
         calculatePlusIcons();
         
         setNumberPrint();
         return false;
           }
           tabPositions();
           calculatePlusIcons();
       setNumberPrint();
           event.stopPropagation();
        }
        
        if($keycode == 13) {
           event.preventDefault();
           addChildProperty($(this));
           tabPositions();
           calculatePlusIcons();
       increaseWidthEdit($keycode);//increase width in edit case
           event.stopPropagation();
        } 
        
        if($keycode == 38) {
           if($(this).prev().closest("li").find(".runTab").attr("class")==undefined){
            var k = $(this).closest("ol").closest("li").attr("id");
            $("#"+k).find(".runTab").first().focus();
           }
           else{
           $(this).prev().closest("li").find(".runTab").focus();
           }
           return false;
           event.stopPropagation();
        } 
        
        if($keycode == 40) {
          var elements = $(this).parents(".tabber").find(".runTab");
          var currentIndex = elements.index($(this).find(".runTab"));
          $(elements[currentIndex + 1]).focus();
          event.stopPropagation();
        }      
  });


$("body").on("click",".addplus span",function(){
    var getPosition = $(this).index();//$(this).index()-1
    var totalPlus = $(".addplus span").not('.number_print').length;//$(".addplus span").not('.number_print').length-1
    var getULPosition;
    if(getPosition===totalPlus){
    getULPosition = $(".tabber").find("ol:last");
    }
    else{
    getULPosition = $(".tabber").find("[position="+getPosition+"]").last();
    }
    addChildProperty(getULPosition);
    tabPositions();
    
}); 

$("body").on("mouseover",".addplus span",function(){
    var getPlusIndex = $(this).index()-1;
    $("[position="+getPlusIndex+"]").find(".node-content:first").addClass("node-selected-hover");
});

$("body").on("mouseleave",".addplus span",function(){
    $(".tabber li").find(".node-content").removeClass("node-selected-hover");
});

   
$("body").on("dblclick",".tabber li .node-circle",function(event){
    
    var getThis = $(this).closest("li");
    
    if(getThis.find("ol").css("display")=="block"){
       getThis.find("ol").css("display","none");
    }
    else{
        getThis.find("ol").css("display","block");
    }
    
    
});
   
$("body").on("click",".tabber .addclass", function(){
   
    var getThis = $(this).closest("li").find("ol").first();
    addChildProperty(getThis);
    
}); 

$("body").on("keydown","#common_name",function(event){
    var $keycode = (event.keyCode ? event.keyCode : event.which);
    if($keycode == 13) {
     event.preventDefault();
    } 
});
   
   
calculatePlusIcons();    
    
});

function tabPositions(){
    var getLI = $(".tabber li");
    getLI.each(function(){
        var pos=0;
       //setNumberPrint();/*comment by niraj*/
       
       $(this).removeAttr("style");
        
        if($(this).closest("ol").closest("li").attr("id")!==undefined){
            $(this).attr("parent",$(this).closest("ol").closest("li").attr("id"));
            var getPrevPos = $(this).closest("ol").closest("li").attr("position");
            pos = parseInt(getPrevPos) + 1;
            $(this).attr("position",pos);
        }
        else{
            $(this).removeAttr("parent");
            $(this).attr("position",pos);
        }
        
        if($(this).has("ol li").length!==0){
            $(this).find(".node-left .node-circle").removeClass("node-white-circle").removeClass("node-white-circle-expanded").addClass("node-white-circle-expanded");
        }
        else{
            $(this).find(".node-left .node-circle").removeClass("node-white-circle").removeClass("node-white-circle-expanded").addClass("node-white-circle");
        }
    });
    
}



function textareaIncreaseHeight(class_name){
    var class_name = class_name ? class_name : 'runTab';
    jQuery.each(jQuery('.' + class_name), function() {
	  var offset = this.offsetHeight - this.clientHeight;     

    var resizeTextarea = function(el) {
      jQuery(el).css('height', el.scrollHeight + offset)
    };


     jQuery(this).on('paste', function() { 

	    var _self = this;

      if(jQuery(this).is("textarea")){
        setTimeout(function(){
          resizeTextarea(_self);
         // newPosition =  $(_self).outerHeight();
        //  console.log('newPosition'+ newPosition);
        //  $(_self).closest('.niceScrollDiv').getNiceScroll(0).doScrollTop(newPosition, -1)
        },100);
        
      }
  		
		});


     jQuery(this).on('keypress', function() {

      var _self = this;

      if(jQuery(this).is("textarea")){
        resizeTextarea(_self);
      }
      
    });


    jQuery(this).on('keyup', function(event) { 
      var _self = this;
      var $keycode = (event.keyCode ? event.keyCode : event.which);
      if($keycode===8 || $keycode===46){
        $(this).height(22)
        resizeTextarea(_self);    
      }
    }); 
	});
}

function calculatePlusIcons(){
    var getTotalLength = $(".tabber").find("ol:last").parents("ol:not(.tabber)").length;
    getTotalLength = parseInt(getTotalLength)-1;
    $(".addplus").children().not('.number_print').remove();
    for(i=0; i<=getTotalLength; i++){
        $(".addplus").append("<span><i class='fa fa-plus'></i></span>");
    }
}


$(document).ready(function(){
    
    tabPositions();
    
});

var classBuilder = [];
function sendClassJson(){
    classBuilder=[];
    $(".first_prop_hard li").each(function(){
       var getID =  $(this).attr("id");
       var getText = $(this).find(".runTab").val();
       var getNodeX = $(this).find(".hidden-node-x").val();
       var getNodeY = $(this).find(".hidden-node-y").val();
       var getNodeYInstanceNodeIds = $(this).find(".hidden-node-y-instance-property-node-id").val();
       var getParent = $(this).attr("parent");
       if(getParent==undefined){
           getParent = "none";
       }
       classBuilder.push({id:getID, text:getText,nodex:getNodeX,nodey:getNodeY,instance:getNodeYInstanceNodeIds,parent:getParent});
    });
}
window.puJsFileLoadCounter++;