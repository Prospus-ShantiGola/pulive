/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function setDrpdownPos(myElement){
    var getDocHig   =       $('.edtBody').outerHeight();
    var drpHig      =       $(myElement).outerHeight();
    var getTopPos   =       parseInt($(myElement).css('top'));
    var totalHig    =       getDocHig - drpHig;
    var setTopPos   =       (getTopPos-drpHig);     

    if(getTopPos>totalHig){
        //console.log('setTopPos'+setTopPos);
        $(myElement).css('top',setTopPos);
    }

}

function manageDocEdtHig(){
    if( $(".breadcrumb-wrap").hasClass('breadcrumb-up')){ //(changes)
        $breadcrumbWrap = 10;
        var windowWidthEDT = $(window).height()-$(".edtHeader").outerHeight()-$("header").outerHeight()-$breadcrumbWrap-22;
        //windowWidthEDT = Math.floor(windowWidthEDT/22) * 22;   
        if($(".mainScroll").find('#edt').hasClass('structured')){
            $("#edt").css("min-height",windowWidthEDT);
            $(".mainScroll").css("height",windowWidthEDT);
        }
        else{
            $("#edt").css("min-height",windowWidthEDT+22);
            $(".mainScroll").css("height",windowWidthEDT+22); 
        }        
        $(".edtTOC").css("height",windowWidthEDT);
    }
    else{
       
        $breadcrumbWrap = 51;
        var windowWidthEDT = $(window).height()-$(".edtHeader").outerHeight()-$("header").outerHeight()-$breadcrumbWrap-22;
        //windowWidthEDT = Math.floor(windowWidthEDT/22) * 22; 
        if($(".mainScroll").find('#edt').hasClass('structured')){
            $("#edt").css("min-height",windowWidthEDT);
            $(".mainScroll").css("height",windowWidthEDT);
        }
        else{
           $("#edt").css("min-height",windowWidthEDT+22);
            $(".mainScroll").css("height",windowWidthEDT+22);
        } 
        $(".edtTOC").css("height",windowWidthEDT);
    }
}

function toggleEditorView(toggleType){  
    if(toggleType=="untoggle"){
            $(".edt .edtDynamicTextField").each(function(index, element) {      
            var getThisDataName = $(this).attr("data-name");
            var getThisText = $(this).val();
            if($.trim(getThisText)==""){
                getThisText = "&nbsp;";
            }
            $(this)[0].outerHTML = "<span class='edtInputText' data-name='"+getThisDataName+"' contenteditable='false'>"+getThisText+"</span>";     
        });
    }
    else{
        $(".edt .edtInputText").each(function(index, element) {      
            var getThisDataName = $(this).attr("data-name");
            var getThisText = $(this).text();       
            $(this)[0].outerHTML = "<input type='text' class='edtDynamicTextField' data-name='"+getThisDataName+"' value='"+getThisText+"'>";       
        });
    }   
}

$("body").on("blur",".edtDynamicTextField",function(event) {
    var getThisDataName = $(this).attr("data-name");
    var getThisDataVal = $(this).val(); 
    $("[data-name="+getThisDataName+"]").val(getThisDataVal);   
});

