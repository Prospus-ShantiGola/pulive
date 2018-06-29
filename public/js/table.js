var atWhichCol=null;
var atWhichMappedNode;
var canMouseDown = 0;
var currentUndoRedoStateCanvas = null;
var statusUndoRedoCanvas = [];
var undoRedoLengthCanvas = 25;
var checkControlKeyPressed=false;
var multiatWhich = [];
var whichDynamicField;
var tempDataHolder;
var pdfImg={};
$(document).ready(function(){
//fetchClasses();
if (typeof(Storage) !== "undefined") {
	if(localStorage.tabledata!=undefined){
		$("#edtInnerCanvasView").html(localStorage.tabledata);
	}
}	

$( ".dragELM" ).draggable({
 cancel: false,
 drag: function( event, ui ) {
 	$(this).width($(this).width());
 },
 stop: function( event, ui ) {
 	$(this).width($(this).width());
 }
});

rangeInitializeCanvas();

	$("html").on("click","*",function(){
		$("#canvastableContextMenu").css("display","none");	
		$("#ColorPlatesSectionCanvas").css("display","none");
		$("#removeMappedNode").css("display","none");
		if($(".dragELM").is(".ui-resizable")){
			$(".dragELM").resizable("destroy");
			$(".dragELM").removeAttr("tabindex");
		}
	});

	$("body").on("mouseover","#edtInnerCanvasView td",function(event){
		event.stopPropagation();
		if(canMouseDown==0){
			canvasColumnResize($(this));
		}
	});


$("body").on("paste","#edtInnerCanvasView td",function(event){
  event.preventDefault();
  var plain_text = (event.originalEvent || event).clipboardData.getData('text/plain');
  if(typeof plain_text!=="undefined"){
    document.execCommand('insertText', false, plain_text);
  }
  return false;
});

$("body").on("paste","#edtInnerCanvasView .canvasDynamicField",function(event){
  event.preventDefault();
  var plain_text = (event.originalEvent || event).clipboardData.getData('text/plain');
  if(typeof plain_text!=="undefined"){
    document.execCommand('insertText', false, plain_text);
  }
  return false;
});

$("body").on("click","#edtInnerCanvasView td",function(event){
		event.stopPropagation();
		tempDataHolder="";
		$(".dragCanvasContainer").removeClass("active");
		$("#canvastableContextMenu").css("display","none");	
		$("#ColorPlatesSectionCanvas").css("display","none");
		$("#removeMappedNode").css("display","none");
		if(checkControlKeyPressed==true){
			$(this).addClass("selectedTD");
		}
		else{
			atWhichCol = $(this);
			$("#edtInnerCanvasView .selectedTD").removeClass("selectedTD");
		}
		$("#edtInnerCanvasView .highlightTable").removeClass("highlightTable");
		atWhichCol.closest("table").addClass("highlightTable");
		$(".innerCanvasContainer td img").resizable();
		$(".innerCanvasContainer td img").resizable("destroy");
		$(".innerCanvasContainer td img").css("display","inline-block");
		document.execCommand("enableObjectResizing", false, "false");
		document.execCommand("enableInlineTableEditing", false, "false");
	});

	$("body").on("contextmenu","#edtCanvasView span.mappingNode,#edtCanvasView span.canvasDynamicField, #edtCanvasView .canvasChkBox, #edtCanvasView .canvasRadioBtn, .innerCanvasContainer .canvasCalculationField",function(event){
		event.stopPropagation();
		event.preventDefault();	
		atWhichMappedNode = $(this);
		$("#removeMappedNode").css({display:"block",left:"0px",left:event.pageX, top:event.pageY});		
	});

	$("body").on("click","#removeMappedNode li a",function(event){
		event.stopPropagation();
		event.preventDefault();
		var getVal 		= 	atWhichMappedNode.attr('data-source');
		var mapnodelen 	= 	$('.canvasEDTTable td').find('span[data-source = "'+getVal+'"]').length;
		if(mapnodelen <= 1){
			$('#canvasNodeList').find('span[data-source = "'+getVal+'"]').parent('li').removeClass('usedNode');
		}
		atWhichMappedNode.remove();
		$("#removeMappedNode").css("display","none");		
	});



	$("body").on("contextmenu","#edtInnerCanvasView td",function(event){
		event.stopPropagation();
		event.preventDefault();
		atWhichCol = $(this);
		if(atWhichCol.closest("table").hasClass("canvasEDTTable")){	
			$("#canvastableContextMenu [data-action=deleteTable]").closest("li").addClass("hide");
		}
		else{
			$("#canvastableContextMenu [data-action=deleteTable]").closest("li").removeClass("hide");
		}

		if(atWhichCol.closest(".innerCanvasContainer").find("table").length==1 && atWhichCol.closest(".innerCanvasContainer").find("table tr").length==1){	
			$("#canvastableContextMenu [data-action=deleteRow]").closest("li").addClass("hide");
		}
		else{
			$("#canvastableContextMenu [data-action=deleteRow]").closest("li").removeClass("hide");
		}

		if(atWhichCol.closest("tr").find("td").length==1){	
			$("#canvastableContextMenu [data-action=deleteColumn]").closest("li").addClass("hide");
		}
		else{
			$("#canvastableContextMenu [data-action=deleteColumn]").closest("li").removeClass("hide");
		}		
		$("#canvastableContextMenu").css({display:"block",left:"0px",left:event.pageX, top:event.pageY});
		setCanvasDrpdownPos('#canvastableContextMenu'); //changes
	});


	$("body").on("click","#canvastableContextMenu a",function(){
		var getThisVal = $(this).attr("data-action");
		var getColIndex = atWhichCol.index();
		var getClosestTable = atWhichCol.closest("table");
		if(getThisVal=="rowAbove"){
			var getClosestRow = atWhichCol.closest("tr");
			var insertItem = "<tr>"+getClosestRow.html()+"</tr>";
			$(insertItem).insertBefore(getClosestRow);
			getClosestRow.prev().find("td").html("<br/>").attr("contenteditable",true);
		}
	
		else if(getThisVal=="rowBelow"){
			var getClosestRow = atWhichCol.closest("tr");
			var insertItem = "<tr>"+getClosestRow.html()+"</tr>";
			$(insertItem).insertAfter(getClosestRow);
			getClosestRow.next().find("td").html("<br/>").attr("contenteditable",true);
		}

		else if(getThisVal=="columnLeft"){
			var getActualCurrentTDOuterWidth = getClosestTable.find('tr:first > td:eq('+ getColIndex +')').outerWidth();
			var getActualCurrentTDWidth = getClosestTable.find('tr:first > td:eq('+ getColIndex +')').width();
			var getPadding = getActualCurrentTDOuterWidth - getActualCurrentTDWidth;
			getCurrentTDWidth = getActualCurrentTDOuterWidth/2;
			if(getPadding>=getCurrentTDWidth){
				bootbox.alert("Maximum width of table has been reached");
				return false;
			}
			getClosestTable.find('tr:first > td:eq('+ getColIndex +')').outerWidth(getCurrentTDWidth);
			getClosestTable.find('tr:first > td:eq('+ getColIndex +')').css("min-width",getCurrentTDWidth+"px");
			getClosestTable.find('tbody:first > tr').each(function(i){
				if(i==0){
					var insertItem = "<td contenteditable='true' style='width:"+getCurrentTDWidth+"px; min-width:"+getCurrentTDWidth+"px'><br/></td>";
					$(insertItem).insertBefore($(this).find(" > td:eq("+ getColIndex +")"));
				}
				else{
					var insertItem = "<td contenteditable='true'><br/></td>";
					$(insertItem).insertBefore($(this).find(" > td:eq("+ getColIndex +")"));
				}
			});
		}		

		else if(getThisVal=="columnRight"){			
			var getActualCurrentTDOuterWidth = getClosestTable.find('tr:first > td:eq('+ getColIndex +')').outerWidth();
			var getActualCurrentTDWidth = getClosestTable.find('tr:first > td:eq('+ getColIndex +')').width();
			var getPadding = getActualCurrentTDOuterWidth - getActualCurrentTDWidth;
			getCurrentTDWidth = getActualCurrentTDOuterWidth/2;
			if(getPadding>=getCurrentTDWidth){
				bootbox.alert("Maximum width of table has been reached");
				return false;
			}
			getClosestTable.find('tr:first > td:eq('+ getColIndex +')').outerWidth(getCurrentTDWidth);
			getClosestTable.find('tr:first > td:eq('+ getColIndex +')').css("min-width",getCurrentTDWidth+"px");
			getClosestTable.find('tbody:first > tr').each(function(i){
				if(i==0){
					var insertItem = "<td contenteditable='true' style='width:"+getCurrentTDWidth+"px; min-width:"+getCurrentTDWidth+"px'><br/></td>";
					$(insertItem).insertAfter($(this).find(" > td:eq("+ getColIndex +")"));
				}
				else{
					var insertItem = "<td contenteditable='true'><br/></td>";
					$(insertItem).insertAfter($(this).find(" > td:eq("+ getColIndex +")"));
				}
			});
		}

		else if(getThisVal=="deleteRow"){
			var getClosestRow = atWhichCol.closest("tr");
			if(getClosestTable.find("tr").length==1){
				getClosestTable.closest("td").attr("contenteditable",true).removeClass("nopadding").html("<br/>");
				getClosestTable.remove();
			}
			else{
				getClosestRow.remove();				
			}			
		}	

		else if(getThisVal=="deleteColumn"){
			if(getClosestTable.find('tr:first td').length==1){
				getClosestTable.closest("td").attr("contenteditable",true).removeClass("nopadding").html("<br/>");
				getClosestTable.remove();				
			}
			else{
				getClosestTable.find('tr').each(function(i){
				$(this).find("td:eq("+ getColIndex +")").remove();
				});	
			}			
		}

		else if(getThisVal=="emptyColumn"){
			atWhichCol.html("<br/>");	
		}		

		else if(getThisVal=="deleteTable"){
			getClosestTable.closest("td").attr("contenteditable",true).removeClass("nopadding").html("<br/>");
			getClosestTable.remove();
		}					

		else if(getThisVal=="addTable"){
			$("#setCanvasTableRows").val(1);
			$("#setCanvasTableColumns").val(1);
			$("#canvastableProperties").modal({
		 	 backdrop: 'static',
		 	 keyboard: false
			});
			checkControlKeyPressed = false;
			return false;
		}

		else if(getThisVal=="calcStart"){
			pasteCanvasHtmlAtCaret('<span calculation-start="true">');
			checkControlKeyPressed = false;
		}

		else if(getThisVal=="calcEnd"){
			pasteCanvasHtmlAtCaret('<span calculation-end="true">');
			var currentCol = atWhichCol.html();
			currentCol = currentCol.replace(/<span calculation-start="true"><\/span>/g,"<span data-calculation='calculation'>");
			currentCol = currentCol.replace(/<span calculation-end="true"><\/span>/g,"</span>");
			atWhichCol.html(currentCol);
			checkControlKeyPressed = false;
		}

		else if(getThisVal=="columnProperties"){

			var getClass = $("#edtInnerCanvasView").attr("class");
			$("#edtInnerCanvasView").removeAttr("class");

			var getBorderLeft = parseInt(atWhichCol.css("border-left-width"));
			var getBorderRight = parseInt(atWhichCol.css("border-right-width"));
			var getBorderTop = parseInt(atWhichCol.css("border-top-width"));
			var getBorderBottom = parseInt(atWhichCol.css("border-bottom-width"));
			var getVAlign = atWhichCol.css("vertical-align");
			var getBackground = atWhichCol.css("background-color");
			var getLineHeight = parseInt(atWhichCol.css("line-height"));
			$("#setColumnBorderLeft").val(getBorderLeft);
			$("#setColumnBorderRight").val(getBorderRight);
			$("#setColumnBorderTop").val(getBorderTop);
			$("#setColumnBorderBottom").val(getBorderBottom);
			$("#canvasVAlign").val(getVAlign);
			$("#canvasLineHeight").val(getLineHeight);
			if(getBackground=="transparent"){
				getBackground = "";
			}
			$("#canvasCellBackground").val(getBackground).css("background-color",getBackground).css("color",getBackground);
			$("#edtInnerCanvasView").addClass(getClass);
			$("#canvastableColumnProperties").modal({
		 	 backdrop: 'static',
		 	 keyboard: false
			});
			checkControlKeyPressed = false;
			return false;
		}

		else if(getThisVal=="rowProperties"){
			var getClass = $("#edtInnerCanvasView").attr("class");
			$("#edtInnerCanvasView").removeAttr("class");

			var getPaddingLeft = parseInt(atWhichCol.css("padding-left"));
			var getPaddingRight = parseInt(atWhichCol.css("padding-right"));
			var getPaddingTop = parseInt(atWhichCol.css("padding-top"));
			var getPaddingBottom = parseInt(atWhichCol.css("padding-bottom"));
			var getBackground = atWhichCol.closest("tr").css("background-color");
			$("#setRowPaddingLeft").val(getPaddingLeft);
			$("#setRowPaddingRight").val(getPaddingRight);
			$("#setRowPaddingTop").val(getPaddingTop);
			$("#setRowPaddingBottom").val(getPaddingBottom);
			if(getBackground=="transparent"){
				getBackground = "";
			}
			$("#canvasRowBackground").val(getBackground).css("background-color",getBackground).css("color",getBackground);
			$("#edtInnerCanvasView").addClass(getClass);
			$("#canvastableRowProperties").modal({
		 	 backdrop: 'static',
		 	 keyboard: false
			});
			checkControlKeyPressed = false;
			return false;
		}
		undoRedoCanvasMode();
	});


$("body").on("click","#canvasTablePropertiesSubmit",function(){		
		var getRows = $("#setCanvasTableRows").val();
		var getCols = $("#setCanvasTableColumns").val();
		var insertHTML="";
		for(i=0; i<getRows;i++){			
			var tdHTML = "";
			for(x=0; x<getCols;x++){				
				tdHTML = tdHTML + "<td contenteditable='true'><br/></td>";
			}
			insertHTML = insertHTML + "<tr>"+tdHTML+"</tr>";
		}

		var insertTable = "<table cellpadding='0' cellspacing='0'>"+insertHTML+"</table>";
		atWhichCol.attr("contenteditable",false).addClass("nopadding");
		atWhichCol.html(insertTable);		
		atWhichCol.find("table td").each(function(){
			$(this).outerWidth($(this).outerWidth());
			$(this).css("min-width",$(this).outerWidth()+"px");
		});
		atWhichCol.find("table").outerWidth(atWhichCol.find("table").outerWidth());
		document.execCommand("enableObjectResizing", false, "false");
		document.execCommand("enableInlineTableEditing", false, "false");
		$("#canvastableProperties").modal("hide");
		undoRedoCanvasMode();
})

$("body").on("click","#canvasColumnPropertiesSubmit",function(){		
		var getBorderLeft = $("#setColumnBorderLeft").val();
		var getBorderRight = $("#setColumnBorderRight").val();
		var getBorderTop = $("#setColumnBorderTop").val();
		var getBorderBottom = $("#setColumnBorderBottom").val();
		var getVAlign = $("#canvasVAlign").val();
		var getBackground = $("#canvasCellBackground").val();
		var getLineHeight = $("#canvasLineHeight").val();
		if(getBackground==""){
			getBackground="transparent";
		}
		var objectCSS = {};
		objectCSS["vertical-align"]=getVAlign;
		objectCSS["line-height"]=getLineHeight+"px";
		if(getBorderTop!=0){
			objectCSS["border-top"]=getBorderTop+"px solid #000";
		}
		else{
			objectCSS["border-top"]="none";
		}
		if(getBorderRight!=0){
			objectCSS["border-right"]=getBorderRight+"px solid #000";
		}
		else{
			objectCSS["border-right"]="none";
		}
		if(getBorderBottom!=0){
			objectCSS["border-bottom"]=getBorderBottom+"px solid #000";
		}
		else{
			objectCSS["border-bottom"]="none";
		}
		if(getBorderLeft!=0){
			objectCSS["border-left"]=getBorderLeft+"px solid #000";
		}
		else{
			objectCSS["border-left"]="none";
		}

		atWhichCol.css(objectCSS);
		atWhichCol.css("cssText",atWhichCol.attr('style')+";background-color:"+getBackground+ " !important");
		$("#canvastableColumnProperties").modal("hide");
		undoRedoCanvasMode();
})

$("body").on("click","#canvasRowPropertiesSubmit",function(){		
		var getPaddingLeft = $("#setRowPaddingLeft").val();
		var getPaddingRight = $("#setRowPaddingRight").val();
		var getPaddingTop = $("#setRowPaddingTop").val();
		var getPaddingBottom = $("#setRowPaddingBottom").val();
		var getBackground = $("#canvasRowBackground").val();
		if(getBackground==""){
			getBackground="transparent";
		}
		atWhichCol.closest("tr").css("cssText",atWhichCol.closest("tr").attr("style")+";background-color:"+getBackground+ " !important");
		atWhichCol.closest("tr").find(">td").each(function(){
		$(this).css({"padding-top":getPaddingTop+"px", "padding-right":getPaddingRight+"px","padding-bottom":getPaddingBottom+"px", "padding-left":getPaddingLeft+"px"});	
		})		
		$("#canvastableRowProperties").modal("hide");
		undoRedoCanvasMode();
})

$("body").on("click","#canvasCellBackground, #canvasRowBackground",function(){
		var getPos = $(this).offset();
		var getThis = $(this);
		$("#ColorPlatesSectionCanvas").css("display","block").css({left:getPos.left,top:getPos.top+22});
		$( "#ColorPlatesSectionCanvas td" ).unbind( "click");		
		$("#ColorPlatesSectionCanvas td").click(function(){
			var getColor = $(this).css("background-color");
			getThis.val(getColor).css("background-color",getColor).css("color",getColor);			
		});
		return false;	
});

$("body").on("keyup","#edtInnerCanvasView td",function(event){	
	event.stopPropagation();		
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	if($keycode==17){
		checkControlKeyPressed=false;
	}
});

$("body").on("keydown","#edtInnerCanvasView td",function(event){	
	event.stopPropagation();		
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	atWhichCol = $(this);	
	var closestTR = atWhichCol.closest("tr");	
	if($keycode==13){
		document.execCommand('insertHTML', false, '<br><br>');
		return false;
	}

	if($keycode==17){
		checkControlKeyPressed=true;
	}

	if(event.ctrlKey && $keycode == 90) {  
		event.preventDefault();
		$(".doUndoCanvas ").trigger("click");
		return false;
	}		
		
	if(event.ctrlKey && $keycode == 89) {  
		event.preventDefault();
		$(".doRedoCanvas ").trigger("click");
		return false;
	}


	if(event.ctrlKey && $keycode==38 && !event.shiftKey){		
		$("#canvastableContextMenu [data-action=rowAbove]").trigger("click");
	}

	else if(event.ctrlKey && $keycode==40 && !event.shiftKey){		
		$("#canvastableContextMenu [data-action=rowBelow]").trigger("click");
	}

	else if(event.ctrlKey && $keycode==39 && !event.shiftKey){		
		$("#canvastableContextMenu [data-action=columnRight]").trigger("click");
	}

	else if(event.ctrlKey && $keycode==37 && !event.shiftKey){		
		$("#canvastableContextMenu [data-action=columnLeft]").trigger("click");
	}

	else if(event.shiftKey && $keycode==38 && !event.ctrlKey){		
		if(closestTR.prev("tr").length!=0){
			closestTR.prev("tr").find("td:eq("+atWhichCol.index()+")").focus();
		}
	}

	else if(event.shiftKey && $keycode==40 && !event.ctrlKey){		
		if(closestTR.next("tr").length!=0){
			closestTR.next("tr").find("td:eq("+atWhichCol.index()+")").focus();
		}
	}	

	else if(event.shiftKey && $keycode==39 && !event.ctrlKey){		
		if(atWhichCol.next("td").length!=0){
			atWhichCol.next("td").focus();
		}
		else{
			if(closestTR.next("tr").length!=0){
				closestTR.next("tr").find("td:first").focus();
			}
		}
	}

	else if(event.shiftKey && $keycode==37 && !event.ctrlKey){		
		if(atWhichCol.prev("td").length!=0){
			atWhichCol.prev("td").focus();
		}
		else{
			if(closestTR.prev("tr").length!=0){
				closestTR.prev("tr").find("td:last").focus();
			}
		}
	}			
});


$("body").on("click", "#canvasToolbar .underline", function(){
		canvasUnderlineApplier.toggleSelection();
		undoRedoCanvasMode();
});

$("body").on("click", "#canvasToolbar .bold", function(){
		canvasBoldApplier.toggleSelection();
		undoRedoCanvasMode();
});

$("body").on("click", "#canvasToolbar .italic", function(){
		canvasItalicApplier.toggleSelection();
		undoRedoCanvasMode();
});

$("body").on("click", "#canvasToolbar .leftAlign, #canvasToolbar .rightAlign, #canvasToolbar .centerAlign, #canvasToolbar .justifyAlign", function(){	
		if(atWhichCol==null){
			return false;
		}
		var getClass = $(this).attr("data-align");
		atWhichCol.removeClass("canvasLeftALign").removeClass("canvasCenter").removeClass("canvasRightAlign").removeClass("canvasJustify").addClass(getClass);
		undoRedoCanvasMode();
	});

$("body").on("change", "#selOrientation", function(){
	var getVal = $(this).val();
	if(getVal=="select"){
		$("#canvasToolbar").css("width","8.3in");
		$("#edtCanvasView").width("8.3in").height("11.7in");
	}
	else if(getVal=="a1"){
		$("#canvasToolbar").css("width","23.4in");
		$("#edtCanvasView").width("23.4in").height("33.1in");
	}
	else if(getVal=="a2"){
		$("#canvasToolbar").css("width","16.5in");
		$("#edtCanvasView").width("16.5in").height("23.4in");
	}
	else if(getVal=="a3"){
		$("#canvasToolbar").css("width","11.7in");
		$("#edtCanvasView").width("11.7in").height("16.5in");
	}
	else if(getVal=="a4"){
		$("#canvasToolbar").css("width","8.3in");
		$("#edtCanvasView").width("8.3in").height("11.7in");
	}
});

$("body").on("change", "#selPrintPreview", function(){
	var getVal = $(this).val();
	if(getVal=="screen"){
		$("#edtInnerCanvasView").removeClass("printMode");
		$("#edtInnerCanvasView").addClass("screenMode");
	}
	else if(getVal=="print"){
		$("#edtInnerCanvasView").addClass("printMode");
		$("#edtInnerCanvasView").removeClass("screenMode");
	}
});

$("body").on("change", "#fontStyleCanvas", function(){
		var getFontFamily = $(this).val();
		var randomCssClass = "rangyTemp_" + (+new Date());
	    var classApplier = rangy.createClassApplier(randomCssClass, true);
		classApplier.applyToSelection();
		$("." + randomCssClass).css({"font-family": getFontFamily}).removeClass(randomCssClass);
		undoRedoCanvasMode();
		return false;
});

$("body").on("change", "#fontSizeCanvas", function(){
	var getFontSize = $(this).val();
	var randomCssClass = "rangyTemp_" + (+new Date());
    var classApplier = rangy.createClassApplier(randomCssClass, true);
	classApplier.applyToSelection();
	$("." + randomCssClass).css({"font-size": getFontSize + "px"}).removeClass(randomCssClass);
	undoRedoCanvasMode();
	return false;	
});

$("body").on("click", "#canvasToolbar .canvasColor", function(){
		var getPos = $(this).position();
		$('.edtdrp').hide();
		$("#ColorPlatesSectionCanvas").css("display","block").css({left:getPos.left+265,top:getPos.top+102}); //changes
		$( "#ColorPlatesSectionCanvas td" ).unbind( "click");		
		$("#ColorPlatesSectionCanvas td").click(function(){
			var getColor = $(this).css("background-color");
			var getFontColor = getColor;
			var randomCssClass = "rangyTemp_" + (+new Date());
			var classApplier = rangy.createClassApplier(randomCssClass, true);
			classApplier.applyToSelection();
			var getFontSize = $("." + randomCssClass).css("font-size");
			var getFontFamily = $("." + randomCssClass).css("font-family");
			$("." + randomCssClass).css("cssText","color:" + getFontColor +" !important; font-size:"+ getFontSize +"; font-family:"+ getFontFamily).removeClass(randomCssClass);			
		});
		undoRedoCanvasMode();		
		return false;
	});

$("body").on("click", "#printCanvasTable", function(){
	var getClass = $("#edtInnerCanvasView").attr("class");
	$("#edtInnerCanvasView").removeClass("screenMode");
	$("#edtInnerCanvasView").addClass("printMode");
	window.print();
	$("#edtInnerCanvasView").removeClass("printMode");
	$("#edtInnerCanvasView").addClass(getClass);
});

$("body").on("click", "#saveCanvasTable", function(){	
	if (typeof(Storage) !== "undefined") {
        localStorage.setItem("tabledata",$("#edtInnerCanvasView").html());
    }
});

$("body").on("click", "#canvasNodeList li", function(){		
	$(this).removeClass("selected");
});

$("body").on("dblclick", "#canvasNodeList li", function(){
	if(!$(this).hasClass("noMap")){
		$("#canvasNodeList li").removeClass("selected");
		$(this).addClass("selected");
		tempDataHolder = "<span class='mappingNode dragELM' contenteditable='false' data-source='"+$(this).find("span").attr("data-source")+"'>"+$(this).text()+"</span>";
		$( ".dragELM" ).draggable({
		 cancel: false,
		 drag: function( event, ui ) {
		 	$(this).width($(this).width());
		 },
		 stop: function( event, ui ) {
		 	$(this).width($(this).width());
		 }
		});
	}
});

$("body").on("dblclick", ".canvasEDTTable td", function(event){
	event.stopPropagation();
	var getEditable = $(this).attr("contenteditable");
	if(getEditable=="false"){
		return false;
	}
	else{
	var getHTML = $("#canvasNodeList li.selected").html();
	$("#canvasNodeList li.selected").addClass('usedNode').removeClass("selected");
	if(getHTML==undefined){
		return false;
	}
	pasteCanvasHtmlAtCaret(getHTML);
	}
	undoRedoCanvasMode();
});

$("body").on("click", "#addNewPageCanvasTable", function(event){
	var pageHTML = "<span class='deletePageSpan'><button class='deleteThisPage btn btn-sm btn-black'>Delete Page</button></span><div class='innerCanvasContainer'><table cellpadding='0' cellspacing='0' class='canvasEDTTable' style='height:auto'><tr><td contenteditable='true' style='height:auto'><br/></td></tr></table></div>";
	var pageHTMLDrag = "<span class='deletePageSpan'><button class='deleteThisPage btn btn-sm btn-black'>Delete Page</button></span><div class='innerCanvasContainer noPadding yes-form'><div class='dragCanvasContainer'></div></div>";
	if($("#changeCanvasMode").val()=="editor"){
		$("#edtInnerCanvasView").append(pageHTML);
	}
	else{
		$("#edtInnerCanvasView").append(pageHTMLDrag);
	}
	undoRedoCanvasMode();
});

$("body").on("click", ".dragCanvasContainer", function(event){
	$(".dragCanvasContainer").removeClass("active");
	$("#edtInnerCanvasView .highlightTable").removeClass("highlightTable");
	atWhichCol=null;
	$(this).addClass("active");

	if(tempDataHolder!=undefined && tempDataHolder!=""){
		$(this).append(tempDataHolder);
		$( ".dragELM" ).draggable({
		 cancel: false,
		 drag: function( event, ui ) {
		 	$(this).width($(this).width());
		 },
		 stop: function( event, ui ) {
		 	$(this).width($(this).width());
		 }
		});
		$(this).find(".dragELM:last").css({position:"absolute",left:+event.pageX - $(this).offset().left+"px",top:+event.pageY - $(this).offset().top+"px"});
		tempDataHolder="";
	}
	$("#canvasNodeList .selected").removeClass("selected");
});

$("body").on("click", ".deleteThisPage", function(event){
	$(this).parent().next(".innerCanvasContainer").remove();
	$(this).parent().remove();
	undoRedoCanvasMode();
});


$("body").on("keydown", ".checkOnlyNum", function(e){
	if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
});


$("body").on("click", "#canvasToolbar .doUndoCanvas", function(event){	
		if(statusUndoRedoCanvas.length>0){
			if(currentUndoRedoStateCanvas<0){
				return false;
			}
			if(currentUndoRedoStateCanvas==null){
				undoRedoCanvasMode();				
				currentUndoRedoStateCanvas = statusUndoRedoCanvas.length-1;			
			}
			
			currentUndoRedoStateCanvas = currentUndoRedoStateCanvas-1;
			$("#edtInnerCanvasView").html(statusUndoRedoCanvas[currentUndoRedoStateCanvas]);		
		}
});


$("body").on("click", "#canvasToolbar .doRedoCanvas", function(event){		
		if(statusUndoRedoCanvas.length>0){	
			if(currentUndoRedoStateCanvas==null || currentUndoRedoStateCanvas>=statusUndoRedoCanvas.length-1){
				return false;
			}
		currentUndoRedoStateCanvas = currentUndoRedoStateCanvas+1;
		$("#edtInnerCanvasView").html(statusUndoRedoCanvas[currentUndoRedoStateCanvas]);		
	}		
});


$("body").on("change", "#uploadCanvasImage", function(event){	
	$('.lodding').show(); //changes				
	var getIMG = $(this).prop('files')[0];
	var form_data = new FormData();                  
	form_data.append('file', getIMG);
	form_data.append('type',"directUpload");
	var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
	var reader = new FileReader();
	reader.onload = function(e){
	var dummyImage = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;";
	if(atWhichCol!=null && $("#edtInnerCanvasView .highlightTable").length>0){
		atWhichCol.html(dummyImage);
	}
	};
	reader.readAsDataURL(this.files[0]);	
		$.ajax({
		  type: "POST",
		  url: "edt-file-upload.php",
		  data: form_data,
		  processData: false,
		  contentType: false		  
		})
	   .success(function(msg) {
		   	if(atWhichCol!=null && $("#edtInnerCanvasView .highlightTable").length>0){
				$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
				$("#uploadCanvasImage").val("");
			}
			else if($(".dragCanvasContainer.active").length>0){
				var tempImage = new Image();
			    $(tempImage).load(function () {
			       $(".dragCanvasContainer.active").css("cssText","background-image:url('"+msg+"') !important").css({"min-height":tempImage.height+"px","list-style-image":"url("+msg+")","display": "list-item","list-style-position": "inside"});
			    });
			    tempImage.src=msg;
			    $("#uploadCanvasImage").val("");
			    $('.lodding').hide(); //changes			
			}
		});
});

$("body").on("change", "#uploadCanvasPDF", function(event){	
	$('.lodding').show(); //changes
	var getPDF = $(this).prop('files')[0];
	var form_data = new FormData();                  
	form_data.append('file', getPDF);
	form_data.append('type',"directUpload");
	var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
	var reader = new FileReader();
	reader.readAsDataURL(this.files[0]);	
		$.ajax({
		  type: "POST",
		  url: "edt-pdf-file-upload.php",
		  data: form_data,
		  processData: false,
		  contentType: false		  
		})
	   .success(function(msg) {
		   	$("#uploadCanvasPDF").val("");
	 	    //var pdfPath = window.location.origin+"/tables/ver17/"+msg; //changes
	 	    var pdfPath = msg;//window.location.origin+"/data/AppOnePdfImages/"+msg; //changes for pu replace above
		   	$.ajax({
			  type: "POST",
			  url: "http://dev.pu.prospus.com/puidata/page_plugin/code.php?action=convertpdftoimgcanvas&appOneFilePath="+encodeURIComponent(pdfPath),
			  processData: false,
			  contentType: false		  
			})
			.success(function(msg){
				var getImages = JSON.parse(msg);
				loaderCanvas(getImages, loadCImage ,function(){
					for(key in pdfImg){
						var pageHTMLDrag = "<span class='deletePageSpan'><button class='deleteThisPage btn btn-sm btn-black'>Delete Page</button></span><div class='innerCanvasContainer noPadding yes-form'><div class='dragCanvasContainer'></div></div>";
						$("#edtInnerCanvasView").append(pageHTMLDrag);	
						$("#edtInnerCanvasView .dragCanvasContainer:last").css("cssText",$("#edtInnerCanvasView .dragCanvasContainer:last").attr("style")+";min-height:"+pdfImg[key].height+"px;background-image: url('"+pdfImg[key].target+"') !important; list-style-image: url('"+pdfImg[key].target+"'); display: list-item; list-style-position: inside; ");
					}
					pdfImg={};
					$('.lodding').hide(); //changes
				});

			});
		});
});

$("body").on("click", ".innerCanvasContainer td img", function(event){
		$(".innerCanvasContainer td img").resizable({
			handles: "se"
		});		
		event.stopPropagation();
});


$("body").on("click", "#canvasToolbar .doDynamicField", function(event){	
	event.stopPropagation();	
	if($(".dragCanvasContainer.active").length>0){
		var getHTML = "<span class='canvasDynamicField dragELM' contenteditable='true'>&nbsp;</span>";
		tempDataHolder=getHTML;
		return false;
	}
	if(atWhichCol==null){
		return false;
	}
	var getEditable = atWhichCol.attr("contenteditable");
	if(getEditable=="false"){
		return false;
	}
	else{
	var getHTML = "<span class='canvasDynamicField' contenteditable='false'>&nbsp;</span>";
	pasteCanvasHtmlAtCaret(getHTML);
	$("#edtInnerCanvasView .selectedTD").each(function(){
		$(this).html(getHTML);
	});
	$("#edtInnerCanvasView .selectedTD").removeClass("selectedTD");
	}
	undoRedoCanvasMode();
});

$("body").on("click", "#canvasToolbar .doCalculationField", function(event){	
	event.stopPropagation();	
	if($(".dragCanvasContainer.active").length>0){
		var getHTML = "<span class='canvasCalculationField dragELM' contenteditable='true' data-calculation='calculation'>&nbsp;</span>";
		tempDataHolder=getHTML;
		return false;
	}
	if(atWhichCol==null){
		return false;
	}
	var getEditable = atWhichCol.attr("contenteditable");
	if(getEditable=="false"){
		return false;
	}
	else{
	var getHTML = "<span class='canvasCalculationField' contenteditable='true' data-calculation='calculation'>&nbsp;</span>";
	pasteCanvasHtmlAtCaret(getHTML);
	$("#edtInnerCanvasView .selectedTD").each(function(){
		$(this).html(getHTML);
	});
	$("#edtInnerCanvasView .selectedTD").removeClass("selectedTD");
	}
});

$("body").on("click","#canceledtCalculationCanvas",function(event){
	$(".tempEDTLink").removeClass("tempEDTLink");
	$("#edtCalculationPopup").css("display","none");
});

$("body").on("click","#saveedtCalculationCanvas",function(event){
	$(".tempEDTLink").html($("#edtCalculationCanvas").val());
	$(".tempEDTLink").width("auto");
	$(".tempEDTLink").removeClass("tempEDTLink");
	tempDataHolder="";
	$("#edtCalculationPopup").css("display","none");
});	

$("body").on("dblclick", "#edtCanvasView .canvasCalculationField", function(event){	
	event.stopPropagation();
	var pos=$(this).offset();
	$(this).addClass("tempEDTLink");
	var getHtml = $.trim($(this).html());
	if(getHtml=="&nbsp;"){
		getHtml = "";
	}
	$("#edtCalculationCanvas").val(getHtml);
	$("#edtCalculationPopup").css({display:"block",left:"0px",left:pos.left, top:pos.top+15});
});

$("body").on("dblclick", "#edtCalculationCanvas", function(event){	
	var getHTML = $("#canvasNodeList li.selected").html();
	if(getHTML!=undefined){
		insertAtCaret($(this), getHTML);
	}
});


$("body").on("click", "#canvasToolbar .doChkBoxField", function(event){	
	event.stopPropagation();
	if($(".dragCanvasContainer.active").length>0){
		var getHTML = "<input type='checkbox' class='canvasChkBox dragELM' id='newCanvasCheckBox' value=''>";
		tempDataHolder=getHTML;
		return false;
	}
	if(atWhichCol==null){
		return false;
	}
	var getEditable = atWhichCol.attr("contenteditable");
	if(getEditable=="false"){
		return false;
	}
	else{
	var getHTML = "<input type='checkbox' class='canvasChkBox' id='newCanvasCheckBox' value=''> Label";
	pasteCanvasHtmlAtCaret(getHTML);
	$("#edtInnerCanvasView .selectedTD").each(function(){
		$(this).html(getHTML);
	});
	$("#edtInnerCanvasView .selectedTD").removeClass("selectedTD");
	}
	$("#newCanvasCheckBox").trigger("dblclick").removeAttr("id");
});

$("body").on("click", "#canvasToolbar .doRadioBtnField", function(event){	
	event.stopPropagation();
	if($(".dragCanvasContainer.active").length>0){
		var getHTML = "<input type='radio' class='canvasRadioBtn dragELM' value=''>";
		tempDataHolder=getHTML;
		return false;
	}
	if(atWhichCol==null){
		return false;
	}
	var getEditable = atWhichCol.attr("contenteditable");
	if(getEditable=="false"){
		return false;
	}
	else{	
	var getHTML = "<input type='radio' class='canvasRadioBtn' id='newCanvasRadioBtn' value=''> Label";
	pasteCanvasHtmlAtCaret(getHTML);
	$("#edtInnerCanvasView .selectedTD").each(function(){
		$(this).html(getHTML);
	});
	$("#edtInnerCanvasView .selectedTD").removeClass("selectedTD");
	}
	$("#newCanvasRadioBtn").trigger("dblclick").removeAttr("id");
});

$("body").on("click", ".canvasRadioBtn,.canvasChkBox", function(event){
	event.preventDefault();

});

var whichRadioChkBox;
$("body").on("dblclick", ".canvasRadioBtn,.canvasChkBox", function(event){	
	var getSource = $("#canvasNodeList li.selected .mappingNode").attr("data-source");
	if(getSource!=undefined){
		$(this).attr("data-source",getSource);
		return false;
	}
	var getFieldName = $(this).prop("name");
	var getFieldValue = $(this).val();
	var getFieldChecked = $(this).prop("checked");
	var getFieldWidth = $(this).width();
	if(getFieldChecked==false){
		getFieldChecked = 0;
	}
	else{
		getFieldChecked = 1;
	}
	$("#setRadioChkFieldName").val(getFieldName);
	$("#setRadioChkValue").val(getFieldValue);	
	$("#canvasRadioChkSelecteDropdown").val(getFieldChecked);
	$("#setRadioChkWidth").val(getFieldWidth);
	$("#canvasRadioChkProperties").modal({
	 	 backdrop: 'static',
		 keyboard: false
	});
	checkControlKeyPressed = false;
	whichRadioChkBox = $(this);
});

$("body").on("click", "#canvasRadioChkSubmit", function(event){	
	var getFieldName = $.trim($("#setRadioChkFieldName").val());
	var getFieldValue = $.trim($("#setRadioChkValue").val());
	var getFieldChecked = $.trim($("#canvasRadioChkSelecteDropdown").val());
	var getFieldWidth = $.trim($("#setRadioChkWidth").val());
	var checkAlphaNumeric = /^[0-9a-zA-Z]+$/;  

	if(getFieldName==""){
		bootbox.alert("Field Name is required");
		return false;
	}
	else if(!(getFieldName.match(checkAlphaNumeric))){
		bootbox.alert("Field Name should have alpha-numeric characters only");
		return false;
	}
	else if(getFieldValue==""){
		bootbox.alert("Value is required");
		return false;
	}
	if(getFieldChecked==0){
		getFieldChecked = false;
	}
	else{
		getFieldChecked = true;
	}
	whichRadioChkBox.prop("name",getFieldName).val(getFieldValue).prop("checked",getFieldChecked).width(getFieldWidth).height(getFieldWidth);
	$("#canvasRadioChkProperties").modal("hide");
});



$("body").on("dblclick", ".innerCanvasContainer .canvasDynamicField, .innerCanvasContainer .mappingNode", function(event){	
	event.stopPropagation();
	var getWidth = $(this).width();
	$("#setDynamicFieldWidth").val(getWidth);
	$("#setDynamicFontSize").val(parseInt($(this).css("font-size")));
	whichDynamicField = $(this);
	$("#canvasDynamicTextProperties").modal({
	 	 backdrop: 'static',
		 keyboard: false
	});
});

$("body").on("click", "#canvasDynamicFieldSubmit", function(event){	
	var getWidth = $("#setDynamicFieldWidth").val();
	var getFontSize = $("#setDynamicFontSize").val();
	if(getWidth==""){
		bootbox.alert("Width Field is required");
		return false;
	}
	if(whichDynamicField.hasClass("dragELM")){
		whichDynamicField.css("cssText",whichDynamicField.attr("style")+";min-width:"+getWidth+"px;width:"+getWidth+"px;font-size:"+getFontSize+"px");
	}
	else{
		whichDynamicField.removeAttr("style");
		whichDynamicField.css({minWidth:getWidth+"px"});
	}
	$("#canvasDynamicTextProperties").modal("hide");
});

$("body").on("click",".doHyperLinkCanvas",function(event){
	var getCurrentPosition = document.getSelection().anchorNode;
	if(document.getSelection().isCollapsed== true){
		bootbox.alert("Select some text first to make it a hyperlink");
		return false;
	}
	if(getCurrentPosition.nodeType==3){
		getCurrentPosition = getCurrentPosition.parentNode;
	}
	
	if(getCurrentPosition.className.indexOf("canvasEDTTable")==-1)
	{
		while(getCurrentPosition.className.indexOf("canvasEDTTable")==-1){
			getCurrentPosition = getCurrentPosition.parentNode;
		}
	}
	if(getCurrentPosition.className.indexOf("canvasEDTTable")!=-1){		
	var randomCssClass = "tempEDTLink";
    var classApplier = rangy.createClassApplier(randomCssClass, true);
	classApplier.applyToSelection();

	$("#edtHyperlinkTextCanvas").val("");
	var pos=$(".tempEDTLink").offset();
	$("#edtHyperlinkPopupCanvas").css({display:"block",left:"0px",left:pos.left, top:pos.top+15});
	$("#edtHyperlinkTextCanvas").focus();
	event.preventDefault();
	}
});

$("body").on("click","#saveedtHyperlinkTextCanvas",function(event){
		var getLink = $("#edtHyperlinkTextCanvas").val();
		var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		if (!re.test(getLink)) { 
			bootbox.alert("Enter Valid URL");
			return false;
		}
		$(".tempEDTLink").attr("data-link",getLink).addClass("edtHyperLink").removeClass("tempEDTLink");
		$("#edtHyperlinkPopupCanvas").css("display","none");
});

$("body").on("click",".edtHyperLink",function(event){
		var getLink = $(this).attr("data-link");
		$(".selectedHyperLink").removeClass("selectedHyperLink");
		$(this).addClass("selectedHyperLink");
		$("#edtHyperlinkPreviewTextCanvas").attr("href",getLink).text(getLink).attr("data-obj",$(this));
		$("#edtHyperlinkPreviewCanvas").css({display:"block",left:"0px",left:event.pageX-10, top:event.pageY+10});
		event.stopPropagation();
});	

$("body").on("click","#removeedtHyperlinkPreviewTextCanvas",function(event){
		if($(".selectedHyperLink")[0].classList.length>2){
		$(".selectedHyperLink").removeAttr("data-link").removeClass("edtHyperLink");							
		}
		else{
		$(".selectedHyperLink").replaceWith($(".selectedHyperLink").html());						
		}

		$("#edtHyperlinkPreviewCanvas").css("display","none");
});

$("body").on("click","#canceledtHyperlinkTextCanvas",function(event){
		if($(".tempEDTLink").attr("data-link")==undefined){
			if($(".tempEDTLink")[0].classList.length>1){
			$(".tempEDTLink").removeClass("tempEDTLink");
			}
			else{
			$(".tempEDTLink").replaceWith($(".tempEDTLink").html());
			}
		}
		else{
			$(".tempEDTLink").removeClass("tempEDTLink");
		}
		$("#edtHyperlinkPopupCanvas").css("display","none");
});	


$("body").on("keydown",".canvasDynamicField",function(event){
	var $keycode = (event.keyCode ? event.keyCode : event.which);
	if($keycode==13){
		return false;
	}
});

$("body").on("click",".dragELM",function(event){
	$(".dragELM").removeAttr("tabindex");
	$(this).attr("tabindex",0);
	$(this).focus();
});

$("body").on("keydown",".dragELM",function(event){
		var getLeftPosition = $(this).css("left");
		var getTopPosition = $(this).css("top");
		var $keycode = (event.keyCode ? event.keyCode : event.which);		
		if($keycode==37){
			event.preventDefault();
			$(this).css("left",parseInt(getLeftPosition)-1+"px");
		}
		else if($keycode==39){
			event.preventDefault();
			$(this).css("left",parseInt(getLeftPosition)+1+"px");
		}
		else if($keycode==38){
			event.preventDefault();
			$(this).css("top",parseInt(getTopPosition)-1+"px");
		}
		else if($keycode==40){
			event.preventDefault();
			$(this).css("top",parseInt(getTopPosition)+1+"px");
		}
});


$("body").on("click",".canvasDynamicField.dragELM, .mappingNode.dragELM",function(event){
	event.stopPropagation();
	$(this).resizable();
});


});


function canvasColumnResize(t){	
		var e = t[0];
		var getTableHead = document.getElementById("gridViewHead");	
		var resizer = document.createElement("div");		
	    resizer.id = 'gtresizer';
	    var horResizer = document.createElement("div");
	    horResizer.id = 'gthorresizer';
		var gridLine = document.createElement("div");
	    gridLine.id = 'gridLine';
		var getElementExist = document.getElementById("gtresizer");
		if(getElementExist==null){
			document.getElementById("edtInnerCanvasView").appendChild(resizer);
			document.getElementById("edtInnerCanvasView").appendChild(horResizer);
			document.getElementById("edtInnerCanvasView").appendChild(gridLine);			
		}
		else{
			resizer = getElementExist;
			horResizer = document.getElementById("gthorresizer");
			gridLine = document.getElementById("gridLine");
		}
		resizer.removeEventListener('mousedown', initDrag, false);
		horResizer.removeEventListener('mousedown', initHorDrag, false);	
		var leftPosition=0;
		var topPosition=0;
		var whichElm = e;
		var getTableWidth = 0;
		resizer.style.left = ($(e).offset().left + e.offsetWidth -5) + "px";
		resizer.style.top = $(e).offset().top + "px";
		resizer.style.height = e.offsetHeight + "px";
		horResizer.style.left = ($(e).offset().left) + "px";
		horResizer.style.top = ($(e).offset().top + e.offsetHeight - 5) + "px";
		horResizer.style.width = e.offsetWidth + "px";
		gridLine.style.top = ($(e).offset().top+e.offsetHeight) + "px";
		var getOriginalHtml = $.trim($("#edtInnerCanvasView").html());
		resizer.onmousedown = initDrag;
		horResizer.onmousedown = initHorDrag;		
		function initHorDrag(k) {
		   whichElm = e;		   
		   startX = k.clientX;
		   startY = k.clientY;
		   startWidth = parseInt(document.defaultView.getComputedStyle(whichElm).width, 10);
		   startHeight = parseInt(document.defaultView.getComputedStyle(whichElm).height, 10);
		   leftPosition = k.clientX;
		   topPosition = k.clientY;
		   $("#gthorresizer").addClass("activeMode");
		   document.documentElement.addEventListener('mousemove', doHorDrag, false);
		   document.documentElement.addEventListener('mouseup', stopHorDrag, false);	   
		}


		function initDrag(k) {
		   whichElm = e;
		   getTableWidth = $(whichElm).closest("table").outerWidth();
		   startX = k.clientX;
		   startY = k.clientY;
		   startWidth = parseInt(document.defaultView.getComputedStyle(whichElm).width, 10);
		   startHeight = parseInt(document.defaultView.getComputedStyle(whichElm).height, 10);
		   leftPosition = k.clientX;
		   topPosition = k.clientY;
		   $("#gtresizer").addClass("activeMode");
		   document.documentElement.addEventListener('mousemove', doDrag, false);
		   document.documentElement.addEventListener('mouseup', stopDrag, false);	   
		}


		function doHorDrag(s) {			
		   $(".canvasEDTTable").addClass("unselectable");	
		   canMouseDown = 1;		   		   
		   horResizer.style.top = s.clientY + "px";
		   gridLine.style.left = s.clientX + "px";
		   s.preventDefault();
		}

		
		function doDrag(s) {		   
		   $(".canvasEDTTable").addClass("unselectable");	
		   //gridLine.style.display = "block";
		   canMouseDown = 1;		   
		   resizer.style.left = s.clientX + "px";
		   gridLine.style.left = s.clientX + "px";
		   s.preventDefault();
		}

		function stopHorDrag(m) {
			topPosition = (m.clientY+startHeight)-topPosition;
			//whichElm.style.height = topPosition + 'px';
			var getCellIndex = whichElm.cellIndex;
			var getFirstTd =  $(whichElm).closest("tr").find("td:first");
			getFirstTd.css("height",topPosition + "px");
			canMouseDown   = 0;
			$("#gthorresizer").removeClass("activeMode");
			$("#gtresizer").removeClass("activeMode");
			$(".canvasEDTTable").removeClass("unselectable");
			gridLine.style.display = "none";
			document.documentElement.removeEventListener('mousemove', doHorDrag, false);    document.documentElement.removeEventListener('mouseup', stopHorDrag, false);
			undoRedoCanvasMode();
		}

		
		function stopDrag(m) {			
			leftPosition = (m.clientX+startWidth)-leftPosition;
			topPosition = (m.clientY+startWidth)-topPosition;
			if(leftPosition<0){
				leftPosition = 50;
			}
			var getCellIndex = whichElm.cellIndex;
			var getFirstTd =  $(whichElm).closest("table").find("tr:first > td:eq("+getCellIndex+")");
			var getPreviousElmWidth = getFirstTd.outerWidth();
			var getNextTDWidth = getFirstTd.next("td").outerWidth();
			getFirstTd.css("min-width",leftPosition + "px");
			getFirstTd.css("width",leftPosition + "px");										
			if(getFirstTd.next("td").length==0){
				var newTableWidth = getTableWidth-(startWidth - leftPosition);
				getFirstTd.closest("table").outerWidth(newTableWidth);
			}
			else{											
				if(startWidth>leftPosition){								
					var newCalculatedWidth = leftPosition-startWidth;						
					getNextTDWidth = getNextTDWidth+Math.abs(newCalculatedWidth);
				}
				else{
					var newCalculatedWidth = leftPosition - startWidth;					
					getNextTDWidth = getNextTDWidth-Math.abs(newCalculatedWidth);
				}
				getFirstTd.next("td").css("min-width",getNextTDWidth+"px");
				getFirstTd.next("td").css("width",getNextTDWidth+"px");
			}

			resizer.style.left = (whichElm.offsetLeft + whichElm.offsetWidth - 5) + "px";
			canMouseDown   = 0;
			$("#gtresizer").removeClass("activeMode");
			$("#gthorresizer").removeClass("activeMode");
			$(".canvasEDTTable").removeClass("unselectable");
			gridLine.style.display = "none";
			document.documentElement.removeEventListener('mousemove', doDrag, false);    document.documentElement.removeEventListener('mouseup', stopDrag, false);
			var getClosestTDWidth = $(whichElm).closest("table").closest("td").outerWidth();
			var getInsideNextClosestTDWidth = $(whichElm).next("td").width();
			var getInsideNextClosestTableWidth = $(whichElm).next("td").find("table").outerWidth();
			var getInsidePrevClosestTDWidth = $(whichElm).width();
			var getInsidePrevClosestTableWidth = $(whichElm).find("table").outerWidth();
			if(getClosestTDWidth==null){
				getClosestTDWidth = "756";
			}						
			if($(whichElm).closest("table").outerWidth()>getClosestTDWidth){				
				$("#edtInnerCanvasView").html(getOriginalHtml);
				bootbox.alert("Invalid Resizing");								
			}
			else if(getInsideNextClosestTDWidth<getInsideNextClosestTableWidth){
				$("#edtInnerCanvasView").html(getOriginalHtml);	
				bootbox.alert("Invalid Resizing");							
			}
			else if(getInsidePrevClosestTDWidth<getInsidePrevClosestTableWidth){
				$("#edtInnerCanvasView").html(getOriginalHtml);
				bootbox.alert("Invalid Resizing");								
			}
			else{
				undoRedoCanvasMode();
			}			
		}			
	};

	function rangeInitializeCanvas(){
	rangy.init();	
	var classApplierModule = rangy.modules.ClassApplier || rangy.modules.CssClassApplier;
    if (rangy.supported && classApplierModule && classApplierModule.supported) {
         canvasBoldApplier = rangy.createClassApplier("canvasBold");
         canvasUnderlineApplier = rangy.createClassApplier("canvasUnderline");
         canvasItalicApplier = rangy.createClassApplier("canvasItalic");
         canvasFontFamilyApplier = rangy.createClassApplier("fontFamily", {
                            elementProperties : {
                                style : {
                                    "font-family" : "inherit",
                                }
                            }
            });
         canvasFontFamilySizeApplier = rangy.createClassApplier("fontSize", {
                            elementProperties : {
                                style : {
									"font-size" : "inherit",
                                }
                            }
            });
         canvasFontFamilyColorApplier = rangy.createClassApplier("fontColor", {
                            elementProperties : {
                                style : {
									"color" : "inherit",
                                }
                            }
            });			
         canvasFontFamilyBGColorApplier = rangy.createClassApplier("fontBGColor", {
                            elementProperties : {
                                style : {
									"background-color" : "inherit",
                                }
                            }
            });									
      }
}


function undoRedoCanvasMode(){
		currentUndoRedoStateCanvas = null;		
		var getLatestHTML = $("#edtInnerCanvasView");		
		if($.trim(getLatestHTML.html())!=statusUndoRedoCanvas[statusUndoRedoCanvas.length-1]){
		statusUndoRedoCanvas.push($.trim(getLatestHTML.html()));
		if(statusUndoRedoCanvas.length>undoRedoLengthCanvas){
			statusUndoRedoCanvas.shift();
		}
	}
}

function pasteCanvasHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        var checkForValidLocation = $(sel.anchorNode).closest(".canvasEDTTable");
        if(checkForValidLocation.length==0){
        	bootbox.alert("Please place your cursor at valid location");
        	return false;
        }
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function insertAtCaret(areaId, text) {
		var txtarea = areaId[0];
		if (!txtarea) { return; }

		var scrollPos = txtarea.scrollTop;
		var strPos = 0;
		var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
			"ff" : (document.selection ? "ie" : false ) );
		if (br == "ie") {
			txtarea.focus();
			var range = document.selection.createRange();
			range.moveStart ('character', -txtarea.value.length);
			strPos = range.text.length;
		} else if (br == "ff") {
			strPos = txtarea.selectionStart;
		}

		var front = (txtarea.value).substring(0, strPos);
		var back = (txtarea.value).substring(strPos, txtarea.value.length);
		txtarea.value = front + text + back;
		strPos = strPos + text.length;
		if (br == "ie") {
			txtarea.focus();
			var ieRange = document.selection.createRange();
			ieRange.moveStart ('character', -txtarea.value.length);
			ieRange.moveStart ('character', strPos);
			ieRange.moveEnd ('character', 0);
			ieRange.select();
		} else if (br == "ff") {
			txtarea.selectionStart = strPos;
			txtarea.selectionEnd = strPos;
			txtarea.focus();
		}

		txtarea.scrollTop = scrollPos;
	}

	function loaderCanvas(items, thingToDo, allDone) {
    if (!items) {
        return;
    }

    if ("undefined" === items.length) {
        items = [items];
    }

    var count = items.length;

    var thingToDoCompleted = function (items, i) {
        count--;
        if (0 == count) {
            allDone(items);
        }
    };

    for (var i = 0; i < items.length; i++) {
        thingToDo(items, i, thingToDoCompleted);
    }
}

function loadCImage(items, i, onComplete) {
	var getLastIndex = $("#edtInnerCanvasView .dragCanvasContainer:last").index();
	pdfImg = {};
    var onLoad = function (e) {
        e.target.removeEventListener("load", onLoad);
        pdfImg[i] = {target:e.target.src,height:e.target.height};        
        onComplete(items, i);
    }
    var img = new Image();
    img.addEventListener("load", onLoad, false);
    img.src = items[i];
}
window.puJsFileLoadCounter++;