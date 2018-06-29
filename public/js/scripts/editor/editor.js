var currentEDTHeight;
var jcrop_api;
var imgToCrop;
var outLineArray = [];
var tempOutLineArray = [];
var tempOutLineIndex = [];
var statementCountW;
var lineCountW;
var getSelectedEDTLevel;
var edtTagArray = [];
var undoRedoLength = 25;
var tagStatus = "visible";
var statusUndoRedo = [];
var currentUndoRedoState = null;
var currentUndoRedoedtTagArrayState = [];
var editor_js = "edt-worker.js";

function setDocEntryHig(){
}
function manageDocEdtHig(){
}

$(document).ready(function(e) {
	autoEDTHeightCheck();
	var tdContext;
	var tagContext;
	var holdPaste = false;
	var tabGap = 20;

	var getHT = $(window).height();
	$('.edtDynField').height(getHT-75);




	$("body").on("contextmenu",".edt table td",function(event){
		var getTD = $(this).position();
		var getPos = $(this).position();
		$("#tableContextMenu").css({display:"block",left:"0px",left:event.pageX, top:event.pageY});
		tdContext = $(this);
		//(changes start)
		setDrpdownPos("#tableContextMenu");
		//(changes End)
		event.preventDefault();
	});

	$("body").on("contextmenu",".edt .actor, .edt .role, .edt .terms",function(event){
		var getTD = $(this).position();
		$("#tagContextMenu").css({display:"block",left:"0px",left:event.pageX-265, top:event.pageY-35}); //(changes1)
		tagContext = $(this);
		event.preventDefault();
	});


	$("body").on("click","#tagContextMenu a",function(event){
		var getAction = $(this).attr("data-action");
		$("#tagContextMenu").css("display","none");
		if(getAction=="removeTag"){
			$(edtTagArray).each(function(index, element) {
				if(tagContext.context.className.indexOf("edtInputText")!=-1){
					if(edtTagArray[index].tag.toLowerCase()==tagContext.context.getAttribute("data-name").toLowerCase()){
					edtTagArray.splice(index,1);
					return false;
					}
				}
				else{
					if(edtTagArray[index].tag.toLowerCase()==tagContext.text().toLowerCase()){
					edtTagArray.splice(index,1);
					return false;
					}
				}
            });
			highlightText(tagStatus);
		}
	});


	$("body").on("click",".doHyperLink",function(event){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(document.getSelection().isCollapsed== true){
			bootbox.alert("Select some text first to make it a hyperlink");
			return false;
		}
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var randomCssClass = "tempEDTLink";
	    var classApplier = rangy.createClassApplier(randomCssClass, true);
		classApplier.applyToSelection();

		$("#edtHyperlinkText").val("");
		var pos=$(".tempEDTLink").offset();
		var getPos = $(this).position();
		$("#edtHyperlinkPopup").css("display","block").css({top:getPos.top+22});
		setDrpdownPos("#edtHyperlinkPopup");
		//(changes start)
		setDrpdownPos("#edtHyperlinkPopup");
		//(changes End)
		$("#edtHyperlinkText").focus();
		event.preventDefault();
		}
	});

	$("body").on("keypress","#edtHyperlinkText",function(event){
			var $keycode = (event.keyCode ? event.keyCode : event.which);
			if($keycode===13){
			$("#saveedtHyperlinkText").trigger("click");
			return false;
			}
	});

	$("body").on("click",".edtHyperLink",function(event){
		var getLink = $(this).attr("data-link");
		$(".selectedHyperLink").removeClass("selectedHyperLink");
		$(this).addClass("selectedHyperLink");
		$("#edtHyperlinkPreviewText").attr("href",getLink).text(getLink).attr("data-obj",$(this));
		var getPos = $(this).position();
		$("#edtHyperlinkPreview").css("display","block").css({top:getPos.top+22});

		//(changes start)
		setDrpdownPos("#edtHyperlinkPreview");
		//(changes End)
		event.stopPropagation();
	});

	$("body").on("click","#removeedtHyperlinkPreviewText",function(event){
		if($(".selectedHyperLink")[0].classList.length>2){
		$(".selectedHyperLink").removeAttr("data-link").removeClass("edtHyperLink");
		}
		else{
		$(".selectedHyperLink").replaceWith($(".selectedHyperLink").html());
		}
	});

	$("body").on("click","#saveedtHyperlinkText",function(event){
		var getLink = $("#edtHyperlinkText").val();
		var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		if (!re.test(getLink)) {
			bootbox.alert("Enter Valid URL");
			return false;
		}
		$(".tempEDTLink").attr("data-link",getLink).addClass("edtHyperLink").removeClass("tempEDTLink");
		$("#edtHyperlinkPopup").css("display","none");
	});

	$("body").on("click","#canceledtHyperlinkText",function(event){
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
		$("#edtHyperlinkPopup").css("display","none");
	});

	$("html").on("click","*",function(){
		$("#tableContextMenu").css("display","none");
		$("#ColorPlatesSection").css("display","none");
		$("#edtformElements").css("display","none");
		$("#signatureType").css("display","none");
		$("#edtHyperlinkPreview").css("display","none");
		$("#edtTagElements").css("display","none");
		$("#tagContextMenu").css("display","none");
	});


	$("body").on("click","#edtformElements a",function(event){
		var getDataAction = $(this).attr("data-action");
		var x = document.getSelection();
		var k = x.anchorNode;

		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}

		if(k.tagName=="DIV" || k.tagName=="TD" || k.tagName=="TR"){
			if(getDataAction=="createNew"){
				var getCurrentPosition = document.getSelection().anchorNode;

				if(getCurrentPosition.nodeType==3){
					getCurrentPosition = getCurrentPosition.parentNode;
				}

				if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
				{
					while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
						getCurrentPosition = getCurrentPosition.parentNode;
					}
				}

				if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
				var getCurrentTimeStamp = Date.now();
				//var htmlInsert = "<input type='text' name='"+getCurrentTimeStamp+"' readonly='true' class='edtInputText' />";
				var htmlInsert = " <span data-name='"+getCurrentTimeStamp+"' class='edtInputText' contenteditable='false'>&nbsp;</span> ";
				pasteHtmlAtCaret(htmlInsert);
				}
			}
			else if(getDataAction=="createExisting"){
				var getContainer = $("#edtformElementsTextPropertiesReference");
				$("#edtformElementsTextProperties").css("display","none");
				getContainer.css({display:"block",left:"0px",left:event.pageX, top:event.pageY});
				setDrpdownPos("#edtformElementsTextPropertiesReference"); //(changes)
				getContainer.find("ul").empty();
				var tempArray=[];
				if($("#edt .edtInputText").length!=0){	//addede #edt by divya
				$("#edt .edtInputText").each(function(index, element) {	//addede #edt by divya
					if(tempArray.indexOf($(this).attr("data-name"))==-1){
                    getContainer.find("ul").append("<li><a href='javascript:void(0)' data-value='"+$(this).text()+"'>"+$(this).attr("data-name")+"</a></li>");
					tempArray.push($(this).attr("data-name"));
					}
                });
				}
				else{
					getContainer.find("ul").html("<li>No Reference Found!!</li>");
				}
			}
		}
		indexing();
		if($("#sNumbers").is(":checked")){
			outLineNum();
		}
		event.preventDefault();
	});

$("body").on("click","#edtformElementsTextPropertiesReference li a",function(event){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
			var getElementName = $(this).text();
			var getElementValue = $(this).attr("data-value");
			var getElementWidth = $(this).attr("data-width");
			//var htmlInsert = "<input type='text' name='"+getElementName+"' readonly='true' class='edtInputText' value='"+getElementValue+"' style='width:"+getElementWidth+"'/>";
			var htmlInsert = " <span data-name='"+getElementName+"' class='edtInputText' contenteditable='false'>"+getElementValue+"</span> ";
			pasteHtmlAtCaret(htmlInsert);
			$("#edtformElementsTextPropertiesReference").css("display","none");
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
});


$("body").on("dblclick",".edt .edtParagraph .edtInputText",function(event){
		$(this).addClass("edtInputTextSelected");
		$("#edt").attr("contenteditable",false).addClass("unselectable");
		$("#edtformElementsTextProperties #edtPropAttrName").val($(this).attr("data-name")).attr("data-oldname",$(this).attr("data-name"));
		$("#edtformElementsTextProperties #edtPropAttrValue").val($.trim($(this).text()));
		$("#edtformElementsTextProperties").css({display:"block",left:"0px",left:event.pageX, top:event.pageY});
		setDrpdownPos("#edtformElementsTextProperties"); //(changes)
});

$("body").on("click","#canceledtformElementsTextProperties, #canceledtformElementsTextPropertiesReference",function(event){
		$(".edtInputTextSelected").removeClass("edtInputTextSelected");
		$("#edt").attr("contenteditable",true).removeClass("unselectable");
		$("#edtformElementsTextProperties").css("display","none");
		$("#edtformElementsTextPropertiesReference").css("display","none");
});


$("body").on("keypress","#edtPropAttrName, #edtPropAttrValue",function(event){
		var $keycode = (event.keyCode ? event.keyCode : event.which);
		if($keycode===13){
		$("#saveedtformElementsTextProperties").trigger("click");
		return false;
		}
});

$("body").on("click","#deleteedtformElementsTextProperties",function(event){
		$(".edtInputTextSelected").remove();
		$("#edt").attr("contenteditable",true).removeClass("unselectable");
		$("#edtformElementsTextProperties").css("display","none");
		$("#edtformElementsTextPropertiesReference").css("display","none");
});

$("body").on("click","#saveedtformElementsTextProperties",function(event){
		var getOldName = $("#edtformElementsTextProperties #edtPropAttrName").attr("data-oldname");
		var getNewName = $("#edtformElementsTextProperties #edtPropAttrName").val();
		var getNewValue = $("#edtformElementsTextProperties #edtPropAttrValue").val();
		if($.trim(getNewName).length==""){
			bootbox.alert("Field Name Required");
			$("#edtformElementsTextProperties #edtPropAttrName").focus();
			return false;
		}
		var reg = /[^A-Za-z0-9_]/;
	    var test = reg.test(getNewName);
		if(test){
			bootbox.alert("Field Name can contain alphanumeric characters and underscores only and should not be blank.");
			$("#edtformElementsTextProperties #edtPropAttrName").focus();
			return false;
		}

		if($.trim(getNewValue).length==0){
			getNewValue="&nbsp;";
		}

		function replaceEdtTagArrayValue(findVal,index) {
			if(findVal.tag === getOldName){
				edtTagArray[index].tag = getNewName;
				return false;
			}
		}
		edtTagArray.find(replaceEdtTagArrayValue);

		$(".edt [data-name="+getOldName+"]").attr("data-name",getNewName).html($.trim(getNewValue));

/*
		$(".edt .edtParagraph .edtInputText").each(function(index, element) {
			if($(this).attr("data-name")==getOldName){
				$(this).attr("data-name",getNewName).text(getNewValue);
			}
        });
*/
		indexing();
		if($("#sNumbers").is(":checked")){
			outLineNum();
		}

		$("#edt").attr("contenteditable",true).removeClass("unselectable");
		$("#edtformElementsTextProperties").css("display","none");
		$("#edtformElementsTextProperties #edtPropAttrName").removeAttr("data-oldname").val("");
		$("#edtformElementsTextProperties #edtPropAttrValue").val("");
		highlightText(tagStatus);
});


	$("body").on("click","#tableContextMenu a",function(event){
		var getDataAction = $(this).attr("data-action");
		if(getDataAction=="rowAbove"){
			var getClosestRow = tdContext.closest("tr");
			var insertItem = "<tr>"+getClosestRow.html()+"</tr>";
			$(insertItem).insertBefore(getClosestRow);
			getClosestRow.prev().find("td").html("&nbsp;");
			cursorManager.setEndOfContenteditable(getClosestRow.prev().find("td:first").get(0));
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="rowBelow"){
			var getClosestRow = tdContext.closest("tr");
			var insertItem = "<tr>"+getClosestRow.html()+"</tr>";
			$(insertItem).insertAfter(getClosestRow);
			getClosestRow.next().find("td").html("&nbsp;");
			cursorManager.setEndOfContenteditable(getClosestRow.next().find("td:first").get(0));
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="columnLeft"){
			var getClosestTable = tdContext.closest("table");
			var insertItem = "<td>&nbsp;</td>";
			var index = tdContext.index();
			getClosestTable.find('tr').each(function(i){
			$(insertItem).insertBefore($(this).find("td:eq("+ index +")"));
			});
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="columnRight"){
			var getClosestTable = tdContext.closest("table");
			var insertItem = "<td>&nbsp;</td>";
			var index = tdContext.index();
			getClosestTable.find('tr').each(function(i){
			$(insertItem).insertAfter($(this).find("td:eq("+ index +")"));
			});
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="deleteRow"){
			var getClosestTable = tdContext.closest("table");
			var getClosestRow = tdContext.closest("tr");
			if(getClosestTable.find("tr").length==1){
				getClosestTable.closest(".edtParagraph").html("<br>");
			}
			else{
				getClosestRow.remove();
			}
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="deleteColumn"){
			var getClosestTable = tdContext.closest("table");
			var index = tdContext.index();
			if(getClosestTable.find('tr:first td').length==1){
				getClosestTable.closest(".edtParagraph").html("<br>");
			}
			else{
				getClosestTable.find('tr').each(function(i){
				$(this).find("td:eq("+ index +")").remove();
				});
			}
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		else if(getDataAction=="deleteTable"){
			var getClosestTable = tdContext.closest("table");
			getClosestTable.closest(".edtParagraph").html("<br>");
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
		}
		autoEDTHeightCheck();
		event.preventDefault();
	});

	$("body").on("keyup","#edt",function(event){
		var $keycode = (event.keyCode ? event.keyCode : event.which);
		countEDTWords();
//		highlightText(tagStatus);
		if($keycode===8 || $keycode===46){
				var getAfterDeleteSelection = document.getSelection();
				if($(".edtParagraph").length==0){
					$(this).empty();
					if($("#sNumbers").is(":checked")){
						var datasNumber = "1.";
					}
					else{
						var datasNumber = "";
					}
					var htmlToInsert = "<div class='edtParagraph' data-s='"+datasNumber+"' data-x='0'><br></div>";
					$(this).html(htmlToInsert);
					cursorManager.setEndOfContenteditable($("#edt .edtParagraph:eq(0)").get(0));
					autoEDTHeightCheck();
				}
				else if(getAfterDeleteSelection.anchorNode.id=="edt" && getAfterDeleteSelection.anchorNode.children.length!=0){
					var getOffset = getAfterDeleteSelection.anchorOffset-2;
					$("#edt .edtParagraph:eq("+getOffset+")").html($("#edt .edtParagraph:eq("+getOffset+")").html().replace(/(<br>\s*)+/g, ''));
			        cursorManager.setEndOfContenteditable($("#edt .edtParagraph:eq("+getOffset+")").get(0));
				}
				if($("#sNumbers").is(":checked")){
				outLineNum();
				}
				columnizer();
				indexing();
				if($(".edtTOC").is(":visible")){
				runTOC();
				}
		}
		var removed=false;
			var getAllChildren = $("#edt").children();
			for(var m=0;m<getAllChildren.length;m++){
				if(getAllChildren[m].nodeName=="BR"){
				getAllChildren[m].remove(); // To remove blank divs with no content
				removed=true;
				}
				if(getAllChildren[m].textContent=="" && !$(getAllChildren[m]).has("img"))
				{
					$(getAllChildren[m]).html("<br>");
				}
			}

		if(removed==true)
		{
			removed=false;
			if($("#sNumbers").is(":checked")){
			outLineNum();
			}
			columnizer();
			indexing();
		}

		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}
		if($(getCurrentPosition).hasClass("edt")){
			$(".edt").blur();
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")>-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
			if($keycode===13){
				if(isScrolledIntoView($(getCurrentPosition))==false){ //due to sass
				//$(".mainScroll").scrollTop($(getCurrentPosition).offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());

				}
				$(".custom-scroll").mCustomScrollbar({
			        axis:"y", // horizontal scrollbar
			        theme:"dark"
			    });
				setDocEntryHig(); //changes
			}
			if($(getCurrentPosition).text().length=="0"){
				$(getCurrentPosition).html($(getCurrentPosition).html().replace(/(<br>\s*)+/g, '<br>'));
			}
		}
	});

    $("body").on("cut",".edt",function(event){
		var $keycode = (event.keyCode ? event.keyCode : event.which);
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
				if(getCurrentPosition.tagName=="TD" || getCurrentPosition.tagName=="TR"){
				break;
				}
			}
		}

		var getCurrentSelection = document.getSelection();
			if(!getCurrentSelection.isCollapsed && event.ctrlKey){
				var h = getCurrentSelection.getRangeAt(0);
				h.deleteContents();
				event.preventDefault();
			}

			if($(getCurrentPosition).index()===0 && $(getCurrentPosition).text().length=="0"){
				//return false;
			}

			if($(getCurrentPosition).text().length=="0"){
				if($(getCurrentPosition).prev(".edtParagraph").text().length!="0"){
				$(getCurrentPosition).prev(".edtParagraph").html($(getCurrentPosition).prev(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
				}
			}

			setTimeout(function(){
				var getAllChildren = $("#edt").children();
				for(var m=0;m<getAllChildren.length;m++){
					if(getAllChildren[m].nodeName=="BR" || getAllChildren[m].textContent==""){
					getAllChildren[m].remove();
					}
				}
				var getAfterDeleteSelection = document.getSelection();
				if(getAfterDeleteSelection.anchorNode.id=="edt" && getAfterDeleteSelection.anchorNode.children.length!=0){
					var getOffset = getAfterDeleteSelection.anchorOffset-1;
					$("#edt .edtParagraph:eq("+getOffset+")").html($("#edt .edtParagraph:eq("+getOffset+")").html().replace(/(<br>\s*)+/g, ''));
			        cursorManager.setEndOfContenteditable($("#edt .edtParagraph:eq("+getOffset+")").get(0));
				}
				else if(getAfterDeleteSelection.anchorNode.id=="edt" && getAfterDeleteSelection.anchorNode.children.length==0){
				var htmlToInsert = "<div class='edtParagraph' data-s='1.' data-x='0'><br></div>";
				$("#edt").append(htmlToInsert);
				cursorManager.setEndOfContenteditable($("#edt .edtParagraph:eq(0)").get(0));
				}

				if($("#sNumbers").is(":checked")){
				outLineNum();
				}
				columnizer();
				indexing();
			});
	});

    $("body").on("paste",".edt .edtParagraph td",function(event){
		if(holdPaste == true){
			return false;
		}

		  holdPaste = true;
		  var getThis = $(this);
		 setTimeout(function() {
			var text = getThis.text();
			text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
			getThis.html(text);
			holdPaste = false;
			indexing();
			cursorManager.setEndOfContenteditable($(getThis).get(0));
		}, 10);
		event.stopPropagation();
	});

    $("body").on("paste",".edt .edtParagraph",function(e){
		if(holdPaste == true){
			return false;
		}
		var checkSelection = document.getSelection();
		var getAnchorNode = checkSelection.anchorNode;
		if(getAnchorNode.nodeType==3){
			getAnchorNode = getAnchorNode.parentNode;
		}
		if(getAnchorNode.className.indexOf("edtParagraph")==-1)
		{
			while(getAnchorNode.className.indexOf("edtParagraph")==-1){
				getAnchorNode = getAnchorNode.parentNode;
			}
		}

		var getFocusNode = checkSelection.focusNode;
		if(getFocusNode.nodeType==3){
			getFocusNode = getFocusNode.parentNode;
		}
		if(getFocusNode.className.indexOf("edtParagraph")==-1)
		{
			while(getFocusNode.className.indexOf("edtParagraph")==-1){
				getFocusNode = getFocusNode.parentNode;
			}
		}
		if(getAnchorNode!=getFocusNode){
			bootbox.alert("This action is not allowed.");
			return false;
		}

		var getThis = $(this);
		pasteHtmlAtCaret("<div class='replaceMe'>&nbsp;</div>");
		$("#pastedText").html("");
		cursorManager.setEndOfContenteditable($("#pastedText").get(0));
		setTimeout(function(){
		parsePastedHTML(getThis);
		});
	});


	$("body").on("click",".edt",function(event){
		//$(".edt img").resizable(); due to sass
		$(".edt img").css("display","inline-block");
		//$(".edt img").resizable("destroy");due to sass
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}
		if($(getCurrentPosition).find("table").length>0){
			cursorManager.setEndOfContenteditable($(getCurrentPosition).find("table tr:first td:first").get(0));
		}

		$(".edtHeader #fontStyle").val($(".edtHeader #fontStyle option:first").val());
		$(".edtHeader #fontSize").val($(".edtHeader #fontSize option:first").val());
//			if($("#sNumbers").is(":checked")){
//			outLineNum();
//			}
//			columnizer();
//			indexing();
		document.execCommand("enableObjectResizing", false, "false");
		document.execCommand("enableInlineTableEditing", false, "false");
	});

	$("body").on("click",".edt .edtParagraph",function(event){
		currentEDTHeight = $(this).height();
	});


	$("body").on("keydown","#edt",function(event){
//		$(".edt img").resizable();
//		$(".edt img").resizable("destroy");
//		$(".edt img").css("display","inline-block");

		if($("#tableContextMenu").is(":visible")){
			return false;
		}

		var $keycode = (event.keyCode ? event.keyCode : event.which);
		var inTable = false;
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){

			if(getCurrentPosition.parentElement.className=="edtInputText"){
				return false;
			}

			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
				if(getCurrentPosition.tagName=="TD" || getCurrentPosition.tagName=="TR"){
				break;
				}
			}
		}

	if(getCurrentPosition.className.indexOf("edtParagraph")!=-1 || getCurrentPosition.tagName=="TD" || getCurrentPosition.tagName=="TR"){
		if($keycode==13){
			//pushUndoRedo();
			if(getCurrentPosition.tagName=="TD" || getCurrentPosition.tagName=="TR"){
				var getClosestTR = $(getCurrentPosition).closest("TR");
				if($.trim(getClosestTR.text()).length!=0){
				var insertItem = "<tr>"+getClosestTR.html()+"</tr>";
				$(insertItem).insertAfter(getClosestTR);
				getClosestTR.next().find("td").html("&nbsp;");
		        cursorManager.setEndOfContenteditable(getClosestTR.next().find("td:first").get(0));
				if($("#sNumbers").is(":checked")){
					outLineNum($(getCurrentPosition).closest(".edtParagraph"));
				}
				indexing();
				autoEDTHeightCheck();
				return false;
				}
				else{
				while(getCurrentPosition.tagName!="DIV"){
				getCurrentPosition = getCurrentPosition.parentNode;
				inTable=true;
				}
				}
			}
			var getElementPosition = $(getCurrentPosition).attr("data-x");
			var getClassNames = $(getCurrentPosition).attr("class");

			if(getElementPosition == undefined){
				getElementPosition = 0;
			}
			if(getClassNames == undefined){
				getClassNames = "edtParagraph";
			}

			var setMargin = getElementPosition*tabGap;
			if(!inTable){
			if($.trim($(getCurrentPosition).text()).length==0 && $(getCurrentPosition).hasClass("edtList")){
				$(getCurrentPosition).removeClass("edtList").removeClass("edtListSub").attr("data-x",0);
				if($("#sNumbers").is(":checked")){
					outLineNum($(getCurrentPosition));
				}
				indexing();
				return false;
			}
			var htmlToInsert = "<br></div><div class='"+getClassNames+"' id=\"edtNewDiv\" data-x='"+getElementPosition+"' style='margin-left:"+setMargin+"px'>";
			var dummyHTML = "<div class='replaceMe'></div>";
		   	pasteHtmlAtCaret(dummyHTML);
			$(this).html($(this).html().replace('<div class="replaceMe"></div>',htmlToInsert));
			}
			else{
			var htmlToInsert = "<div class='"+getClassNames+"' id=\"edtNewDiv\" data-x='"+getElementPosition+"' style='margin-left:"+setMargin+"px'><br></div>";
			$(htmlToInsert).insertAfter($(getCurrentPosition));
			}
			var el = document.getElementById("edtNewDiv");
			var range = document.createRange();
			var sel = window.getSelection();
			range.setStart(el, 0);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			if($("#edtNewDiv").text().length!="0"){
			$("#edtNewDiv").html($("#edtNewDiv").html().replace(/(<br>\s*)+/g, ''));
			}
			else{
			$("#edtNewDiv").append("<br>");
			$("#edtNewDiv").html($("#edtNewDiv").html().replace(/(<br\ ?\/?>)+/, '<br>'));
			}
			var getPosThis = $("#edtNewDiv").prev(".edtParagraph");
			//$("#edtNewDiv").removeClass("selectedHeader");
			$(this).find("#edtNewDiv").removeClass("selectedHeader").removeAttr("id");
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum(getPosThis);
			}
			autoEDTHeightCheck();
			return false;
		}

		if(event.shiftKey && $keycode == 9) {
		var x = document.getSelection();
		var k = x.anchorNode;

		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}

		if(k.tagName=="TD" || k.tagName=="TR"){
				while(k.tagName!="DIV"){
				k = k.parentNode;
				}
		}

		if(x.isCollapsed && k.className.match("edtParagraph").length>0){
				var z = k;
					if($(z).index()===0){
					autoEDTHeightCheck();
					return false;
					}

					var getCurrentElementPosition = $(z).attr("data-x");
					var setNewPosition = parseInt(getCurrentElementPosition)-1;
					var setMargin = setNewPosition*tabGap;

					if(getCurrentElementPosition>0){
					$(z).attr("data-x",setNewPosition);
					$(z).css("margin-left",setMargin);
					var originPoint = $(z);
					}

		}
		else{
			var startSel = x.anchorNode;
			if(!$(startSel).hasClass("edtParagraph")){
				startSel = x.anchorNode.parentNode;
				if(!$(startSel).hasClass("edtParagraph")){
					startSel = x.anchorNode.parentNode.parentNode;
				}
			}
			var endSel = x.focusNode;
			if(!$(endSel).hasClass("edtParagraph")){
				endSel = x.focusNode.parentNode;
				if(!$(endSel).hasClass("edtParagraph")){
					endSel = x.focusNode.parentNode.parentNode;
				}
			}

			if($(startSel).index()>=$(endSel).index()){
				var originPoint = $(endSel);
				var endPoint = $(startSel);
			}
			else{
				var originPoint = $(startSel);
				var endPoint = $(endSel);
			}

				originPoint.nextAll().addBack().each(function(index, element) {
					var getCurrentElementPosition = $(this).attr("data-x");
					var setNewPosition = parseInt(getCurrentElementPosition)-1;
					var setMargin = setNewPosition*tabGap;
					if(getCurrentElementPosition>0){
					$(this).attr("data-x",setNewPosition);
					$(this).css("margin-left",setMargin);
					}
					if($(this).index()===endPoint.index()){
						return false;
					}
				});
		}
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum(originPoint);
			}
			columnizer();
			autoEDTHeightCheck();
		return false;
}

		if($keycode == 9) {
		//pushUndoRedo();
		var x = document.getSelection();
		var k = x.anchorNode;

		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}
		if(k.tagName=="TD" || k.tagName=="TR"){
				while(k.tagName!="DIV"){
				k = k.parentNode;
				}
		}
		if(x.isCollapsed && k.className.match("edtParagraph").length>0){
				var z = k;
					if($(z).index()===0){
					autoEDTHeightCheck();
					return false;
					}
					var getCurrentElementPosition = $(z).attr("data-x");
					var setNewPosition = parseInt(getCurrentElementPosition)+1;
					var setMargin = setNewPosition*tabGap;
					$(z).attr("data-x",setNewPosition);
					$(z).css("margin-left",setMargin);
					var originPoint = $(z);
		}
		else{
			var startSel = x.anchorNode;
			if(!$(startSel).hasClass("edtParagraph")){
				startSel = x.anchorNode.parentNode;
				if(!$(startSel).hasClass("edtParagraph")){
					startSel = x.anchorNode.parentNode.parentNode;
				}
			}
			var endSel = x.focusNode;
			if(!$(endSel).hasClass("edtParagraph")){
				endSel = x.focusNode.parentNode;
				if(!$(endSel).hasClass("edtParagraph")){
					endSel = x.focusNode.parentNode.parentNode;
				}
			}

			if($(startSel).index()>=$(endSel).index()){
				var originPoint = $(endSel);
				var endPoint = $(startSel);
			}
			else{
				var originPoint = $(startSel);
				var endPoint = $(endSel);
			}


				originPoint.nextAll().addBack().each(function(index, element) {
					var getCurrentElementPosition = $(this).attr("data-x");
					var setNewPosition = parseInt(getCurrentElementPosition)+1;
					var setMargin = setNewPosition*tabGap;
					$(this).attr("data-x",setNewPosition);
					$(this).css("margin-left",setMargin);
						if($(this).index()===endPoint.index()){
							return false;
						}
				});
		}

			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum(originPoint);
			}
			columnizer();
		autoEDTHeightCheck();
		return false;
		}

		if($keycode === 8 || $keycode === 46) {
			var getCurrentSelection = document.getSelection();
			if(!getCurrentSelection.isCollapsed && event.ctrlKey){
				var h = getCurrentSelection.getRangeAt(0);
				h.deleteContents();
				event.preventDefault();
			}

			if($(getCurrentPosition).text().length=="0"){
				if($(getCurrentPosition).prev(".edtParagraph").text().length!="0"){
				$(getCurrentPosition).prev(".edtParagraph").html($(getCurrentPosition).prev(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
				}
			}
			setDocEntryHig(); //changes
		}
		if(event.ctrlKey && $keycode == 66) {
		event.preventDefault();
		if($("#edt").hasClass("unstructured")){
		 edtBoldApplier.toggleSelection();
		}
		 return false;
		}

		if(event.ctrlKey && $keycode == 85) {
		event.preventDefault();
		if($("#edt").hasClass("unstructured")){
		 edtUnderlineApplier.toggleSelection();
		}
		 return false;
		}

		if(event.ctrlKey && $keycode == 73) {
		event.preventDefault();
		if($("#edt").hasClass("unstructured")){
		 edtItalicApplier.toggleSelection();
		}
		 return false;
		}

		if(event.ctrlKey && $keycode == 75) {
			event.preventDefault();
			$(".doHyperLink ").trigger("click");
			return false;
		}

		if(event.ctrlKey && $keycode == 90) {
			event.preventDefault();
			$(".doUndo ").trigger("click");
			return false;
		}

		if(event.ctrlKey && $keycode == 89) {
			event.preventDefault();
			$(".doRedo ").trigger("click");
			return false;
		}

		if(event.ctrlKey && ($keycode == 72 || $keycode == 70)) {
			event.preventDefault();
			$(".doFindReplace").trigger("click");
			return false;
		}

		if(event.shiftKey && event.altKey && $keycode == 38) {
			event.preventDefault();
			var x = document.getSelection();
			var k = x.anchorNode;

			if(k.className==undefined){
				k = x.anchorNode.parentNode;
				if(k.nodeName=="SPAN"){
				k = x.anchorNode.parentNode.parentNode;
				}
			}
			if(k.tagName=="TD" || k.tagName=="TR"){
					while(k.tagName!="DIV"){
					k = k.parentNode;
					}
			}
			if($(k).index()>0){
				var prevIndex = $(k).index()-1;
				var getPrevHTML = $(".edtParagraph:eq("+prevIndex+")").html();
				var currrentHTML = $(k).html();
				$(".edtParagraph:eq("+prevIndex+")").html(currrentHTML);
				$(k).html(getPrevHTML);
				cursorManager.setEndOfContenteditable($(".edtParagraph:eq("+prevIndex+")").get(0));
			}
			return false;
		}

		if(event.shiftKey && event.altKey && $keycode == 40) {
			event.preventDefault();
			var x = document.getSelection();
			var k = x.anchorNode;

			if(k.className==undefined){
				k = x.anchorNode.parentNode;
				if(k.nodeName=="SPAN"){
				k = x.anchorNode.parentNode.parentNode;
				}
			}
			if(k.tagName=="TD" || k.tagName=="TR"){
					while(k.tagName!="DIV"){
					k = k.parentNode;
					}
			}
			if($(k).index()!=$(".edtParagraph").length-1){
				var nextIndex = $(k).index()+1;
				var getPrevHTML = $(".edtParagraph:eq("+nextIndex+")").html();
				var currrentHTML = $(k).html();
				$(".edtParagraph:eq("+nextIndex+")").html(currrentHTML);
				$(k).html(getPrevHTML);
				cursorManager.setEndOfContenteditable($(".edtParagraph:eq("+nextIndex+")").get(0));
			}
			return false;
		}

		if(event.ctrlKey && $keycode == 65) {
			var countParas = $("#edt .edtParagraph").length;
			cursorManager.setEndOfContenteditable($("#edt .edtParagraph:last").get(0));
			var getAllSelection = window.getSelection();
			var range = document.createRange();
			var getLastParaLength = getAllSelection.anchorOffset;
			var nodeRange = document.getElementById("edt").getElementsByClassName("edtParagraph");
			range.setStart(nodeRange[0], 0);
			range.setEnd(nodeRange[countParas-1], nodeRange[countParas-1].childNodes.length);
			getAllSelection.removeAllRanges();
			getAllSelection.addRange(range);
			return false;
		}
	}
	else{
		return false;
	}
});

	$("body").on("click", ".edtHeader .doBold", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		edtBoldApplier.toggleSelection();
		indexing();
		}
	});

	$("body").on("click", ".edtHeader .doItalic", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		edtItalicApplier.toggleSelection();
		indexing();
		}
	});

	$("body").on("click", ".edtHeader .doUnderline", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		edtUnderlineApplier.toggleSelection();
		indexing();
		}
	});

	$("body").on("change","#edtAutoLevels", function(){
		if($("#edtAutoLevels").val()!="custom"){
		$(".edtParagraph").removeClass("selectedHeader");
		getSelectedEDTLevel = undefined;
		$("#refreshTOC").trigger("click");
		}
	});

	$("body").on("click","#refreshTOC", function(){
		runTOC();
	});


	$("body").on("click", ".edtHeader .doTableofContent", function(){
		if($(".edtContainer .edtCol1").css("display")=="none"){
			$(".edtContainer .edtCol1").css("display","block");
			$(".collapsableEDTLevelsContent").css("display","block");
			$(".edtContainer .edtCol2").addClass("edtCol2Width");
			if($("#documentMode").val()=="structured"){
			$(".edt").css("margin-left","80px");
			$(".edtColumns").css("padding-left","79px");
			}
			else{
			$(".edt").css("margin-left","40px");
			$(".edtColumns").css("padding-left","39px");
			}

			runTOC();
			indexing();
		}
		else{
			$(".edtContainer .edtCol1").css("display","none");
			$(".edtContainer .edtCol2").removeClass("edtCol2Width");
			$(".collapsableEDTLevelsContent").css("display","none");
			if($("#documentMode").val()=="structured"){
			$(".edt").css("margin-left","40px");
			$(".edtColumns").css("padding-left","39px");
			}
			else{
			$(".edt").css("margin-left","0px");
			}
			return false;
		}
	});

	$("body").on("dblclick", "#myTaggedFields .edtTaggedFields table tbody .dSignValue", function(){
		if($(".dSignValueEdit").length>0){
			$(".dSignValueEdit").focus();
			return false;
		}
		var getThisValue = $(this).text();
		if(getThisValue=="Not Defined"){
			getThisValue = "";
		}

		$(this).html("<input type='text' value='"+getThisValue+"' class='form-control input-field dSignValueEdit "+$(this).attr("class")+"'>");
		$(this).find(".dSignValueEdit").focus();
		var getFieldName = $(this).attr("data-dysign");
		$("[data-name="+getFieldName+"]").addClass("dynoHighlight");
		if(isScrolledIntoView($(".dynoHighlight:eq(0)"))==false){
			$(".mainScroll").scrollTop($(".dynoHighlight:eq(0)").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
		}
	});

	$("body").on("change", "#myTaggedFields .edtTaggedFields table tbody .selectSignBox", function(){
		var getClosestItem = $(this).closest("td");
			getClosestItem.addClass("updatedSignField");
			var getFieldName = getClosestItem.attr("data-dysign");
			$("[data-name="+getFieldName+"]").removeClass("dynoHighlight");
	});

	$("body").on("blur", "#myTaggedFields .edtTaggedFields table tbody .dSignValueEdit", function(){
		var getClosestItem = $(this).closest("td");
			getClosestItem.text($(this).val());
			getClosestItem.addClass("updatedSignField");
			var getFieldName = getClosestItem.attr("data-dysign");
			$("[data-name="+getFieldName+"]").removeClass("dynoHighlight");
	});

	$("body").on("dblclick", "#myTaggedFields .edtTaggedFields table tbody .dTextName", function(){
		if($(".dTextNameEdit").length>0){
			$(".dTextNameEdit").focus();
			return false;
		}
		var getThisValue = $(this).text();
		if(getThisValue=="Not Defined"){
			getThisValue = "";
		}

		$(this).html("<input type='text' value='"+getThisValue+"' class='form-control input-field dTextNameEdit "+$(this).attr("class")+"'>");
		$(this).find(".dTextNameEdit").focus();
		var getFieldName = $(this).attr("data-dyname");
		$("[data-name="+getFieldName+"]").addClass("dynoHighlight");
		if(isScrolledIntoView($(".dynoHighlight:eq(0)"))==false){
			$(".mainScroll").scrollTop($(".dynoHighlight:eq(0)").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
		}
	});

	$("body").on("blur", "#myTaggedFields .edtTaggedFields table tbody .dTextNameEdit", function(){
		var getClosestItem = $(this).closest("td");
		if(getClosestItem.index()==0){
			var getVal = $(this).val();
			var reg = /[^A-Za-z0-9_]/;
			var test = reg.test(getVal);
			if(test || getVal==""){
				$(this).addClass("invalidInput");
				bootbox.alert("Field Type can contain alphanumeric characters and underscores only and should not be blank.");
				return false;
			}
			else{
				getClosestItem.text($(this).val());
			}
		}
		else{
			getClosestItem.text($(this).val());
		}
		getClosestItem.addClass("updatedDynamicField");
		var getFieldName = getClosestItem.attr("data-dyname");
		$("[data-name="+getFieldName+"]").removeClass("dynoHighlight");
	});

	$("body").on("keydown", "#myTaggedFields .edtTaggedFields table tbody .dTextNameEdit", function(event){
		var $keycode = (event.keyCode ? event.keyCode : event.which);
			if($keycode===13){
				$("#myTaggedFields .edtTaggedFields table tbody .dTextNameEdit").trigger("blur");
			}
	});

	$("body").on("keydown", "#myTaggedFields .edtTaggedFields table tbody .dSignValueEdit", function(event){
		var $keycode = (event.keyCode ? event.keyCode : event.which);
			if($keycode===13){
				$("#myTaggedFields .edtTaggedFields table tbody .dSignValueEdit").trigger("blur");
			}
	});

	$("body").on("click", "#saveAllDynFields", function(){

		var getActiveItem = $("#myTaggedFields .edt-top-navigation li.active a").attr("data-action");
		if(getActiveItem=="showDynamicText"){
			saveDynamicFields();
		}
		else{
			saveSignatureFields();
		}
	});

	var saveThisSignature;
	$("body").on("dblclick", ".edt .signature", function(event){
		$("#signatureType").css({display:"block",left:"0px",left:event.pageX-10, top:event.pageY+10});
		$("#signatureType input[value='"+$(this).attr('data-signtype')+"']").prop("checked",true);
		saveThisSignature = $(this);
		//(changes start)
		setDrpdownPos("#signatureType");
	});

	$("body").on("click", "#signatureType input[type='radio']", function(event){
		saveThisSignature.attr("data-signtype",$("#signatureType input[type='radio']:checked").val());
		$("#signatureType").css("display","none");
	});

function saveSignatureFields(){
		var setGoAhead = true;
		var arrayName = [];
		var arrayValue = [];
		$(".updatedSignField").each(function(index, element) {
			var getSpan  = $(this).attr("data-dysign");
			if($(this).hasClass("signTD")){
            	var getValue  = $(this).find(".selectSignBox").val();
            	if(getValue=="select"){
            		getValue = "";
            	}
            	arrayName.push({"dataName":getSpan,"dataValue":getValue});
        	}
        	else{
        		var getValue  = $.trim($(this).text());
        		if(getValue==""){
					getValue = "&nbsp;";
				}
				arrayValue.push({"dataName":getSpan,"dataValue":getValue});
        	}
        });

		$(arrayName).each(function(index, value) {
           $("[data-name='"+arrayName[index].dataName+"']").attr("data-actor",arrayName[index].dataValue);
        });

		$(arrayValue).each(function(index, value) {
           $("[data-name='"+arrayValue[index].dataName+"']").text(arrayValue[index].dataValue);
        });

		$("#myTaggedFields").animate({right: '-100%'},'slow',function(){
			$("#myTaggedFields").hide();
			$('.edt-loader').hide();
		});
	}

	function saveDynamicFields(){

		var setGoAhead = true;
		var arrayName = [];
		var arrayValue = [];
		$(".updatedDynamicField").each(function(index, element) {
            var getValue  = $.trim($(this).text());
			var getSpan  = $(this).attr("data-dyname");
			if($(this).hasClass("dTextGetName")){
				var reg = /[^A-Za-z0-9_]/;
				var test = reg.test(getValue);
				if(test || getValue==""){
					setGoAhead = false;
					$(this).addClass("invalidInput");
				}
				else{
					$(this).removeClass("invalidInput");
					arrayName.push({"dataName":getSpan,"dataValue":getValue});
					//$("[data-name='"+getSpan+"']").attr("data-name",getValue);
				}
			}
			else{
				if(getValue==""){
					getValue = "&nbsp;";
				}
				arrayValue.push({"dataName":getSpan,"dataValue":getValue});
				//$("[data-name='"+getSpan+"']").text(getValue);
			}
        });

		if(setGoAhead==false){
			bootbox.alert("Field Type can contain alphanumeric characters and underscores only and should not be blank.");
		}
		else{

			$(arrayValue).each(function(index, value) {
	           $("[data-name='"+arrayValue[index].dataName+"']").html(arrayValue[index].dataValue);
            });

			$(arrayName).each(function(index, value) {
	            $("[data-name='"+arrayName[index].dataName+"']").attr("data-name",arrayName[index].dataValue);
            });

			$("#myTaggedFields").animate({right: '-100%'},'slow',function(){
				$("#myTaggedFields").hide();
				$('.edt-loader').hide();
			});
		}
	}

	$("body").on("click", ".tagEdtDynamicField a", function(event){
		var getAction = $(this).attr("data-action");
		var getFieldName = $("#edtPropAttrName").attr("data-oldname");
		function deleteEdtTagArrayValue(findVal,index) {
			if(findVal.tag === getFieldName){
				edtTagArray.splice(index,1);
				return false;
			}
		}
		edtTagArray.find(deleteEdtTagArrayValue);
		edtTagArray.push({"type":getAction,"tag":getFieldName, "fieldType":"Dynamic"});
		$("[data-name="+getFieldName+"]").removeClass("actor").removeClass("role").removeClass("terms").addClass(getAction.toLowerCase());
		$("#edtformElementsTextProperties").css("display","none");
		$("#edt").attr("contenteditable",true).removeClass("unselectable");
		pushUndoRedo();
		highlightText(tagStatus);
	});

	$("body").on("click", "#edtTagElements a", function(event){
		$("#edtTagElements").css("display","none");
		var getType = $(this).attr("data-action");
		var getCurrentPosition = document.getSelection().anchorNode;

		if(getType=="showtaggeditems"){
		$("#saveAllDynFields").addClass("hidden");
		$("#edtScanTags").removeClass("hidden");
		$("#myTaggedFields .edtTaggedFields table tbody").empty();
		$("#myTaggedFields .nav li").removeClass("active");
		$("#myTaggedFields .nav li:first").addClass("active");
			$(edtTagArray).each(function(index, value) {
				if(edtTagArray[index].type=="Actor"){
				$("#myTaggedFields .edtTaggedFields table tbody").append("<tr><td>"+edtTagArray[index].type+"</td><td>"+edtTagArray[index].tag+"</td><td>&nbsp;</td></tr>");
				}
			  });

		if($("#myTaggedFields .edtTaggedFields table tbody tr").length==0){
			$("#myTaggedFields .edtTaggedFields table tbody").html("<tr><td colspan='2'>No Reference Found!!</td></tr>");
		}
		$('.edt-loader').show();
		$("#myTaggedFields").show().animate({right: '0px'},'slow');
		$('.edtTaggedFields').height(getHT-130-$('.breadcrumb-wrap').outerHeight()-$('.header-stick-top').outerHeight());
		return false;
		}

		if(getType=="toggleTags"){
		var getTagValue	 = $(this).attr("data-val");
		if(getTagValue=="visible"){
			$(this).attr("data-val","hidden")
			tagStatus = "hidden";
		}
		else{
			$(this).attr("data-val","visible")
			tagStatus = "visible";
		}
		highlightText(tagStatus);
		return false;
		}

		if(document.getSelection().isCollapsed== true && getType!="showtaggeditems"){
			bootbox.alert("Please select some text first.");
			return false;
		}
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var randomCssClass = "tempEDTLink";
	    var classApplier = rangy.createClassApplier(randomCssClass, true);
		classApplier.applyToSelection();
		var getNewText = $(".tempEDTLink").text();
		if(getType=="dynamicField"){
				var getCurrentTimeStamp = Date.now();
				$(".tempEDTLink").addClass("edtInputText tempDynField");
				$('#edt').highlight(getNewText, { wordsOnly: true, className:"edtInputText dynTagField"});
				$(".tempEDTLink").removeClass("tempEDTLink");
				$(".dynTagField").each(function(index, element) {
					$(this).removeClass("tempEDTLink").removeClass("dynTagField").attr("data-name",getCurrentTimeStamp).attr("contenteditable",false);
					if($(this).parent().hasClass("edtInputText")){
						$(this).parent().contents().unwrap();
					}
                });
				$(".tempDynField").removeClass("tempDynField").attr("data-name",getCurrentTimeStamp).attr("contenteditable",false);
		}
		else if(getType=="sign"){
				var getCurrentTimeStamp = Date.now();
				$(".tempEDTLink").addClass("signature tempDynField");
				$('#edt').highlight(getNewText, { wordsOnly: true, className:"signature dynTagField"});
				$(".tempEDTLink").removeClass("tempEDTLink");
				$(".dynTagField").each(function(index, element) {
					$(this).removeClass("tempEDTLink").removeClass("dynTagField").attr("data-name",getCurrentTimeStamp).attr("data-actor","").attr("data-signtype","full").attr("contenteditable",false);
					if($(this).parent().hasClass("signature")){
						$(this).parent().contents().unwrap();
					}
                });
				$(".tempDynField").removeClass("tempDynField").attr("data-name",getCurrentTimeStamp).attr("data-actor","").attr("data-signtype","full").attr("contenteditable",false);
		}
		else{
			var setReturn = false;
			$(edtTagArray).each(function(index, element) {
				if($.trim(edtTagArray[index].tag).toLowerCase()==$.trim(getNewText).toLowerCase()){
						setReturn = true;
						return false;
				}
			});
			if(setReturn){
				$(".tempEDTLink").removeClass("tempEDTLink");
				bootbox.alert("Already tagged.");
				return false;
			}
			else{
				edtTagArray.push({"type":getType,"tag":$.trim(getNewText)});
				$(".tempEDTLink").text(getNewText).removeClass("tempEDTLink").addClass(getType.toLowerCase());
				pushUndoRedo();
				highlightText(tagStatus);
			}
		}
		event.preventDefault();
		}
	});

	$("body").on("click", "#myTaggedFields .nav a", function(event){

		$("#myTaggedFields .nav li").removeClass("active");
		$(this).closest("li").addClass("active");

		var getAction = $(this).attr("data-action");
		if(getAction=="showActors"){
			$("#saveAllDynFields").addClass("hidden");
			$("#edtScanTags").removeClass("hidden");
 			var actionType = "Actor";
		}
		else if(getAction=="showRoles"){
			$("#saveAllDynFields").addClass("hidden");
			$("#edtScanTags").removeClass("hidden");
			var actionType = "Role";
		}
		else if(getAction=="showTerms"){
			$("#saveAllDynFields").addClass("hidden");
			$("#edtScanTags").removeClass("hidden");
			var actionType = "Terms";
		}
		$("#myTaggedFields .edtTaggedFields table tbody").empty();

		if(getAction=="showDynamicText"){
			$("#saveAllDynFields").removeClass("hidden");
			$("#edtScanTags").addClass("hidden");
			var tempArray=[];
			if($("#edt .edtInputText").length!=0){	//addede #edt by divya
				$("#edt .edtInputText").each(function(index, element) {	//addede #edt by divya
					if(tempArray.indexOf($(this).attr("data-name"))==-1){
					  if($.trim($(this).text())==""){
						  var getText = "Not Defined";
					  }
					  else{
						  var getText = $(this).text();
					  }
					  $("#myTaggedFields .edtTaggedFields table tbody").append("<tr><td class='dTextName dTextGetName' data-dyname='"+$(this).attr("data-name")+"'>"+$(this).attr("data-name")+"</td><td class='dTextName dTextGetValue' data-dyname='"+$(this).attr("data-name")+"'>"+getText+"</td><td class='deleteEdtTag'></td></tr>");
					  tempArray.push($(this).attr("data-name"));
					}
				});
			}
			else{
				$("#myTaggedFields .edtTaggedFields table tbody").html("<tr><td colspan='2'>No Reference Found!!</td></tr>");
			}
		}
		else if(getAction=="showSignatures"){
			$("#saveAllDynFields").removeClass("hidden");
			$("#edtScanTags").addClass("hidden");
			var tempArray=[];
			var options = "<option value='select'>-Select Actor-</option>";
			if(edtTagArray.length>0){
				$(edtTagArray).each(function(index, value) {
					var className = edtTagArray[index].type.toLowerCase();
					if(edtTagArray[index].type=="Actor"){
						options = options + "<option value='"+edtTagArray[index].tag+"'>"+edtTagArray[index].tag+"</option>";
					}
					else{
						$('#edt').highlight(edtTagArray[index].tag, { wordsOnly: true, className:className});
					}
				});
			}
			var selectBox = "<select class='selectSignBox select-field'>"+options+"</select>";
			if($(".edt .signature").length!=0){
				$(".edt .signature").each(function(index, element) {
					if(tempArray.indexOf($(this).attr("data-name"))==-1){
					  if($.trim($(this).text())==""){
						  var getText = "Not Defined";
					  }
					  else{
						  var getText = $(this).text();
					  }

					  $("#myTaggedFields .edtTaggedFields table tbody").append("<tr><td class='dSign dSignValue' data-dysign='"+$(this).attr("data-name")+"'>"+getText+"</td><td class='signTD' data-dysign='"+$(this).attr("data-name")+"'>"+selectBox+"</td><td class='deleteEdtTag'></td></tr>");
					  if($(this).attr("data-actor")!=""){
					  	$("#myTaggedFields .edtTaggedFields table tbody tr:last .selectSignBox").val($(this).attr("data-actor"));
					  }
					  tempArray.push($(this).attr("data-name"));
					}
				});
			}
			else{
				$("#myTaggedFields .edtTaggedFields table tbody").html("<tr><td colspan='2'>No Signatures Found!!</td></tr>");
			}
		}
		else{
			$(edtTagArray).each(function(index, value) {
				if(edtTagArray[index].type==actionType){
				$("#myTaggedFields .edtTaggedFields table tbody").append("<tr><td>"+edtTagArray[index].type+"</td><td>"+edtTagArray[index].tag+"</td><td>&nbsp;</td></tr>");
				}
			 });

			if($("#myTaggedFields .edtTaggedFields table tbody tr").length==0){
				$("#myTaggedFields .edtTaggedFields table tbody").html("<tr><td colspan='2'>No Reference Found!!</td></tr>");
			}
		}
	});


$("body").on("click","#myTaggedFields .deleteEdtTag",function(){

	var getFirstTD = $(this).closest("tr").find("td:first");

	if(getFirstTD.attr("data-dyname")!=undefined){
		var getValue = getFirstTD.attr("data-dyname");
		$("[data-name="+getValue+"]").remove();
		$(this).closest("tr").remove();
	}

	if(getFirstTD.attr("data-dysign")!=undefined){
		var getValue = getFirstTD.attr("data-dysign");
		$("[data-name="+getValue+"]").remove();
		$(this).closest("tr").remove();
	}

	if($("#myTaggedFields .edtTaggedFields table tbody tr").length==0){
		$("#myTaggedFields .edtTaggedFields table tbody").html("<tr><td colspan='2'>No Reference Found!!</td></tr>");
	}

})


	var currentFindIndex = 0;

	$("body").on("keydown", "#edtFindText, #edtReplaceText", function(event){
			var $keycode = (event.keyCode ? event.keyCode : event.which);
			if($keycode===13){
				$("#edtFindBtn").trigger("click");
			}
	});

	$("body").on("click", ".edtHeader .doUndo", function(event){
		if(statusUndoRedo.length>0){
			if(currentUndoRedoState<0){
				return false;
			}
			if(currentUndoRedoState==null){
				pushUndoRedo();
				currentUndoRedoState = statusUndoRedo.length-1;
			}

			currentUndoRedoState = currentUndoRedoState-1;
			$("#edt").html(statusUndoRedo[currentUndoRedoState]);
			cursorManager.setBeginingOfContenteditable($(".edtParagraph:eq(0)").get(0));
			indexing("withoutMe");
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}

			edtTagArray = [];

			$(".actor").each(function(index, element) {
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Actor","tag":getElm});
			});

			$(".role").each(function(index, element) {
				var getElm = $.trim($(this).text());
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Role","tag":getElm});
			});

			$(".terms").each(function(index, element) {
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Terms","tag":getElm});
			});

			highlightText(tagStatus);
			autoEDTHeightCheck();
		}
	});

	$("body").on("click", ".edtHeader .doRedo", function(event){
			if(statusUndoRedo.length>0){
				if(currentUndoRedoState==null || currentUndoRedoState>=statusUndoRedo.length-1){
					return false;
				}
			currentUndoRedoState = currentUndoRedoState+1;
			$("#edt").html(statusUndoRedo[currentUndoRedoState]);
			cursorManager.setBeginingOfContenteditable($(".edtParagraph:eq(0)").get(0));
			indexing("withoutMe");
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
			edtTagArray = [];

			$(".actor").each(function(index, element) {
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Actor","tag":getElm});
			});

			$(".role").each(function(index, element) {
				var getElm = $.trim($(this).text());
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Role","tag":getElm});
			});

			$(".terms").each(function(index, element) {
				var getElm = $.trim($(this).text());
				edtTagArray.push({"type":"Terms","tag":getElm});
			});

			highlightText(tagStatus);
			autoEDTHeightCheck();
		}
	});


	$("body").on("click", ".edtHeader .doFindReplace", function(event){
		currentFindIndex = 0;
		$("#edtFindText").val("");
		$("#edtReplaceText").val("");
		$("#findReplaceMessage").text("");
		$('#findReplaceModal').modal({
		  backdrop: 'static',
		  keyboard: false
		})
		setTimeout(function(){$("#edtFindText").focus()},500);
		return false;
	});

	$("body").on("click", "#findReplaceClose", function(event){
		currentFindIndex = 0;
		$("#edt").unhighlight({className: "findReplace"});
		$("#findReplaceModal").modal("hide");
	});

	$("body").on("click", "#findReplaceModal #edtFindBtn", function(event){
		$("#edt").unhighlight({className: "findReplace"});
		var findText = $.trim($("#edtFindText").val());
		var replaceText = $.trim($("#edtReplaceText").val());
		if($("#edtReplaceCaseSensitive").is(":checked")){
			$('#edt').highlight(findText, { wordsOnly: true, className:"findReplace", caseSensitive: true});
		}
		else{
			$('#edt').highlight(findText, { wordsOnly: true, className:"findReplace", caseSensitive: false});
		}
		if($('.findReplace').length==0){
			var myMessage = "No occurences found.";
		}else{
			var myMessage = $('.findReplace').length + " occurences found.";
			$('.findReplace:eq(0)').addClass("findReplaceCurrent");
			currentFindIndex = 0;
			if(isScrolledIntoView($(".findReplace:eq(0)"))==false){
				$(".mainScroll").scrollTop($(".findReplace:eq(0)").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
			}
		}
		$("#findReplaceMessage").text(myMessage);
	});

	$("body").on("click", "#findReplaceModal #edtPrevFindBtn", function(event){
		var getTotalLength = $('.findReplace').length-1;
		var newIndex = parseInt(currentFindIndex-1);
		if(currentFindIndex>0){
			$(".findReplaceCurrent").removeClass("findReplaceCurrent");
			$(".findReplace:eq("+newIndex+")").addClass("findReplaceCurrent");
			currentFindIndex = parseInt(currentFindIndex-1);
			if(isScrolledIntoView($(".findReplace:eq("+newIndex+")"))==false){
				$(".mainScroll").scrollTop($(".findReplace:eq("+newIndex+")").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
			}
		}
	});

	$("body").on("click", "#findReplaceModal #edtNextFindBtn", function(event){
		var getTotalLength = $('.findReplace').length-1;
		var newIndex = parseInt(currentFindIndex+1);
		if(currentFindIndex<getTotalLength){
			$(".findReplaceCurrent").removeClass("findReplaceCurrent");
			$(".findReplace:eq("+newIndex+")").addClass("findReplaceCurrent");
			currentFindIndex = parseInt(currentFindIndex+1);
			if(isScrolledIntoView($(".findReplace:eq("+newIndex+")"))==false){
				$(".mainScroll").scrollTop($(".findReplace:eq("+newIndex+")").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
			}
		}
	});


	$("body").on("click", "#findReplaceModal #edtReplaceBtn", function(event){
		var findText = $.trim($("#edtFindText").val());
		var replaceText = $.trim($("#edtReplaceText").val());
		$('.findReplaceCurrent').text(replaceText);

		var getTotalLength = $('.findReplace').length-1;
		var newIndex = parseInt(currentFindIndex+1);
		if(currentFindIndex<=getTotalLength){
			$("#edt").unhighlight({className: "findReplaceCurrent"});
			$(".findReplace:eq("+currentFindIndex+")").addClass("findReplaceCurrent");
			if(isScrolledIntoView($(".findReplace:eq("+currentFindIndex+")"))==false){
				$(".mainScroll").scrollTop($(".findReplace:eq("+currentFindIndex+")").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
			}
		}
		else if(currentFindIndex>0){
			$("#edt").unhighlight({className: "findReplaceCurrent"});
			$(".findReplace:eq(0)").addClass("findReplaceCurrent");
			if(isScrolledIntoView($(".findReplace:eq(0)"))==false){
				$(".mainScroll").scrollTop($(".findReplace:eq(0)").offset().top - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
			}
			currentFindIndex = 0;
		}
		else{
			$("#edt").unhighlight({className: "findReplaceCurrent"});
			$(".findReplaceCurrent").removeClass("findReplaceCurrent");
		}

		if($('.findReplaceCurrent').length==0){
			var myMessage = "No occurences found.";
		}else{
			var myMessage = $('.findReplace').length + " occurences left.";
		}
		$("#findReplaceMessage").text(myMessage);
		highlightText();
		return false;
	});



	$("body").on("click", "#findReplaceModal #edtReplaceAllBtn", function(event){
		var findText = $.trim($("#edtFindText").val());
		var replaceText = $.trim($("#edtReplaceText").val());
		if($("#edtReplaceCaseSensitive").is(":checked")){
			$('#edt').highlight(findText, { wordsOnly: true, className:"findReplace", caseSensitive: true});
		}
		else{
			$('#edt').highlight(findText, { wordsOnly: true, className:"findReplace", caseSensitive: false});
		}
		$('.findReplace').text(replaceText);
		if($('.findReplace').length==0){
			var myMessage = "No occurences found.";
		}else{
			var myMessage = $('.findReplace').length + " occurences replaced.";
		}
		$("#findReplaceMessage").text(myMessage);
		$("#edt").unhighlight({className: "findReplace"});
		highlightText();
		return false;
	});


	$("body").on("click", ".edtHeader .doTagFields", function(event){
		var getPos = $(this).position();
		$('.edtdrp').hide();
		$("#edtTagElements").css("display","block").css({left:getPos.left,top:getPos.top+22});
		setDrpdownPos("#edtTagElements");
		return false;
	});

	$("body").on("click", "#edtScanTags", function(event){
		$("#edt").unhighlight({className: "actor"});
		$("#edt").unhighlight({className: "role"});
		$("#edt").unhighlight({className: "terms"});
		highlightText(tagStatus);
	});

	$("body").on("click", ".edtHeader .doRemoveBlankStatements", function(event){

			$(".edtParagraph").each(function(index, element) {
				if($.trim($(this).text())=="" && $(this).find("img").length==0){
					$(this).remove();
				}
            });
			indexing();
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}

	});

	$("body").on("click", ".edtTOC ul li", function(){
		var getLineNum = $(this).attr("data-num");
		$(".edt").focus();
		cursorManager.setBeginingOfContenteditable($(".edtParagraph:eq("+getLineNum+")").get(0));
		var getOffset = $(".edtParagraph:eq("+getLineNum+")").offset().top;
		$(".mainScroll").scrollTop($(".edtParagraph:eq("+getLineNum+")").offset().top - $(".edtParagraph:eq("+getLineNum+")").height() - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
	});

	$("body").on("click", ".edtHeader .doList", function(){
		var x = document.getSelection();
		var k = x.anchorNode;
		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}

		if(k.tagName=="TD" || k.tagName=="TR"){
			return false;
		}

		if(x.isCollapsed && k.className.match("edtParagraph").length>0){
				var z = k;
				if($(z).hasClass("edtList")){
					$(z).removeClass("edtList").removeClass("edtListSub");
				}
				else{
					$(z).addClass("edtList");
				}
		}
		else{
			var startSel = x.anchorNode;
			if(!$(startSel).hasClass("edtParagraph")){
				startSel = x.anchorNode.parentNode;
				if(!$(startSel).hasClass("edtParagraph")){
					startSel = x.anchorNode.parentNode.parentNode;
				}
			}
			var endSel = x.focusNode;
			if(!$(endSel).hasClass("edtParagraph")){
				endSel = x.focusNode.parentNode;
				if(!$(endSel).hasClass("edtParagraph")){
					endSel = x.focusNode.parentNode.parentNode;
				}
			}

			if($(startSel).index()>=$(endSel).index()){
				var originPoint = $(endSel);
				var endPoint = $(startSel);
			}
			else{
				var originPoint = $(startSel);
				var endPoint = $(endSel);
			}

			if(originPoint.hasClass("edtList") && endPoint.hasClass("edtList")){
				originPoint.nextAll().addBack().each(function(index, element) {
						$(this).removeClass("edtList").removeClass("edtListSub");

						if($(this).index()===endPoint.index()){
							return false;
						}
				});

			}
			else{
				originPoint.nextAll().addBack().each(function(index, element) {
						if($.trim($(this).text())!=""){
							$(this).addClass("edtList");
						}

						if($(this).index()===endPoint.index()){
							return false;
						}
				});
			}
		}
		indexing();
		return false;
	});

// Correct Statements
$("body").on("click", ".edtHeader .doSplit", function(){
		var x = document.getSelection();
		var k = x.anchorNode;
		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}
		if(k.tagName=="TD" || k.tagName=="TR"){
			return false;
		}

		if(x.isCollapsed && k.className.match("edtParagraph").length>0){
				var z = k;
				var getHTML = $(z).html();
				var splitgetHTML = getHTML.split(/[.?!]+/);
				if($.trim($(z).text()).length!=0){
					for(var x=0;x<splitgetHTML.length;x++){
					if(x==0){
						splitgetHTML[x] = splitgetHTML[x].replace(/(<br>\s*)+/g, '');
						if($.trim(splitgetHTML[x])!=""){
						$(z).html(splitgetHTML[x]+".");
						}
					}
					else{
							var getClassNames = $(z).attr("class");
							var getElementPosition = $(z).attr("data-x");
							var setMargin = getElementPosition*tabGap;
							splitgetHTML[x] = splitgetHTML[x].replace(/(<br>\s*)+/g, '');
							if($.trim(splitgetHTML[x])!=""){
							var htmlToInsert = "<div class='"+getClassNames+"' data-x='"+getElementPosition+"' style='margin-left:"+setMargin+"px'>"+splitgetHTML[x]+".</div>";
							$(htmlToInsert).insertAfter($(z));
							z = $(z).next();
							}
						}
					}
					if(x<=splitgetHTML.length){
					$("#edt").focus();
					cursorManager.setEndOfContenteditable($(z).get(0));
					}
				}
		}
		else{
			var startSel = x.anchorNode;
			if(!$(startSel).hasClass("edtParagraph")){
				startSel = x.anchorNode.parentNode;
				if(!$(startSel).hasClass("edtParagraph")){
					startSel = x.anchorNode.parentNode.parentNode;
				}
			}
			var endSel = x.focusNode;
			if(!$(endSel).hasClass("edtParagraph")){
				endSel = x.focusNode.parentNode;
				if(!$(endSel).hasClass("edtParagraph")){
					endSel = x.focusNode.parentNode.parentNode;
				}
			}
			if($(startSel).index()>=$(endSel).index()){
				var originPoint = $(endSel);
				var endPoint = $(startSel);
			}
			else{
				var originPoint = $(startSel);
				var endPoint = $(endSel);
			}
				originPoint.nextAll().addBack().each(function(index, element) {
				var z = $(this);
				if(z.has("table").length==0){
					var getHTML = $(z).html();
					var splitgetHTML = getHTML.split(/[.?!]+/);
					if($.trim($(z).text()).length!=0){
						for(var x=0;x<splitgetHTML.length;x++){
						if(x==0){
							splitgetHTML[x] = splitgetHTML[x].replace(/(<br>\s*)+/g, '');
							if($.trim(splitgetHTML[x])!=""){
							$(z).html(splitgetHTML[x]+".");
							}
						}
						else{
							var getClassNames = $(z).attr("class");
							var getElementPosition = $(z).attr("data-x");
							var setMargin = getElementPosition*tabGap;
							splitgetHTML[x] = splitgetHTML[x].replace(/(<br>\s*)+/g, '');
							if($.trim(splitgetHTML[x])!=""){
							var htmlToInsert = "<div class='"+getClassNames+"' data-x='"+getElementPosition+"' style='margin-left:"+setMargin+"px'>"+splitgetHTML[x]+".</div>";
							$(htmlToInsert).insertAfter($(z));
							z = $(z).next();
							}
						}
						if(x<splitgetHTML.length){
						$("#edt").focus();
						cursorManager.setEndOfContenteditable($(z).get(0));
						}
					}
						if($(this).index()===endPoint.index()){
							return false;
						}
					}
				}
				});
		}
		if($("#sNumbers").is(":checked")){
		outLineNum();
		}
		columnizer();
		indexing();
		return false;
	});
// Correct Statements End


	$("body").on("click", ".edtHeader .doStrike", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		edtStrikeApplier.toggleSelection();
		}
	});


	$("body").on("click", ".edtHeader .doLeftAlign, .edtHeader .doRightAlign, .edtHeader .doCenter, .edtHeader .doJustify", function(){

		var getClass = $(this).attr("data-align");
		var x = document.getSelection();
		var k = x.anchorNode;
		if(k.className==undefined){
			k = x.anchorNode.parentNode;
			if(k.nodeName=="SPAN"){
			k = x.anchorNode.parentNode.parentNode;
			}
		}
		if(x.isCollapsed && k.className.match("edtParagraph").length>0){
				var z = k;
					$(z).removeClass("edtLeftALign").removeClass("edtCenter").removeClass("edtRightAlign").removeClass("edtJustify");
					$(z).addClass(getClass);
		}
		else{
			var startSel = x.anchorNode;
			if(!$(startSel).hasClass("edtParagraph")){
				startSel = x.anchorNode.parentNode;
				if(!$(startSel).hasClass("edtParagraph")){
					startSel = x.anchorNode.parentNode.parentNode;
				}
			}
			var endSel = x.focusNode;
			if(!$(endSel).hasClass("edtParagraph")){
				endSel = x.focusNode.parentNode;
				if(!$(endSel).hasClass("edtParagraph")){
					endSel = x.focusNode.parentNode.parentNode;
				}
			}

			if($(startSel).index()>=$(endSel).index()){
				var originPoint = $(endSel);
				var endPoint = $(startSel);
			}
			else{
				var originPoint = $(startSel);
				var endPoint = $(endSel);
			}

				originPoint.nextAll().addBack().each(function(index, element) {
						if($.trim($(this).text())!=""){
							$(this).removeClass("edtLeftALign").removeClass("edtCenter").removeClass("edtRightAlign").removeClass("edtJustify");
							$(this).addClass(getClass);
						}

						if($(this).index()===endPoint.index()){
							return false;
						}
				});
		}
		return false;
	});

	$("body").on("click", ".edtHeader .doTable", function(){

		var getClass = $(this).attr("data-align");
		var x = document.getSelection();
		var k = x.anchorNode;
		if(k.nodeType==3){
			k = k.parentNode;
		}
		while(k.className.indexOf("edtParagraph")==-1){
		k = k.parentNode;
			if(k.tagName=="TD" || k.tagName=="TR"){
				bootbox.alert('Action not allowed.');
				return false;
				break;
			}
		}

		if(k.tagName!="TD"){
			var insertTable = "<table cellpadding='0' cellspacing='0'><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>"
			if($(k).text().length==0){
			$(k).html(insertTable);
			}
			else{
				var getClassNames = $(k).attr("class");
				var getElementPosition = $(k).attr("data-x");
				var setMargin = getElementPosition*tabGap;
				var htmlToInsert = "<div class='"+getClassNames+"' data-x='"+getElementPosition+"' style='margin-left:"+setMargin+"px'>"+insertTable+"</div>";
				$(htmlToInsert).insertAfter($(k));
				if($("#sNumbers").is(":checked")){
				outLineNum();
				}
				columnizer();
				indexing();
			}
		}
	});

	$("body").on("click", ".edtHeader .doDynamicText", function(){
		var getPos = $(this).position();
		$('.edtdrp').hide();
		$("#edtformElements").css("display","block").css({left:getPos.left,top:getPos.top+22});
		return false;
	});


	$("body").on("change", ".edtHeader #fontStyle", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var getFontFamily = $(this).val();
		var randomCssClass = "rangyTemp_" + (+new Date());
	    var classApplier = rangy.createClassApplier(randomCssClass, true);
		classApplier.applyToSelection();
		$("." + randomCssClass).css({"font-family": getFontFamily}).removeClass(randomCssClass);
		return false;
		}
	});

	$("body").on("change", ".edtHeader #fontSize", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var getFontSize = $(this).val();
		var randomCssClass = "rangyTemp_" + (+new Date());
	    var classApplier = rangy.createClassApplier(randomCssClass, true);
		classApplier.applyToSelection();
		$("." + randomCssClass).css({"font-size": getFontSize + "px"}).removeClass(randomCssClass);
		indexing();
		return false;
		}
	});

	$("body").on("click", ".edtHeader .doFontColor", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var getPos = $(this).position();
		$('.edtdrp').hide();
		$("#ColorPlatesSection").css("display","block").css({left:getPos.left,top:getPos.top+22});
		setDrpdownPos("#ColorPlatesSection");
		$( "#ColorPlatesSection td" ).unbind( "click");
		$("#ColorPlatesSection td").click(function(){
			var getColor = $(this).css("background-color");
			var getFontColor = getColor;
			var randomCssClass = "rangyTemp_" + (+new Date());
			var classApplier = rangy.createClassApplier(randomCssClass, true);
			classApplier.applyToSelection();
			$("." + randomCssClass).css({"color": getFontColor}).removeClass(randomCssClass);
		});
		return false;
		}
	});

	$("body").on("click", ".edtHeader .doBG", function(){
		var getCurrentPosition = document.getSelection().anchorNode;
		if(getCurrentPosition.nodeType==3){
			getCurrentPosition = getCurrentPosition.parentNode;
		}

		if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
		{
			while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
				getCurrentPosition = getCurrentPosition.parentNode;
			}
		}
		if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var getPos = $(this).position();
		$('.edtdrp').hide();
		$("#ColorPlatesSection").css("display","block").css({left:getPos.left,top:getPos.top+22});
		setDrpdownPos("#ColorPlatesSection");
		$( "#ColorPlatesSection td" ).unbind( "click");
		$("#ColorPlatesSection td").click(function(){
			var getColor = $(this).css("background-color");
			var getBGColor = getColor;
			var randomCssClass = "rangyTemp_" + (+new Date());
			var classApplier = rangy.createClassApplier(randomCssClass, true);
			classApplier.applyToSelection();
			$("." + randomCssClass).css({"background-color": getBGColor}).removeClass(randomCssClass);
		});
		return false;
		}
	});

	$("body").on("click", ".edtHeader .doPrint", function(){
		window.print();
//		var getPos = $(this).position();
//		$("#printMarginBox").css("display","block").css({left:getPos.left,top:getPos.top+22});
		return false;
	});

$("body").on("click", "#edtPrintCommand", function(){
	$("#printMarginBox").css("display","none");
	$(".edtPrintMargins").each(function(index, element) {
        if(isNaN(parseFloat($(this).val()))){
			$(this).val(1);
		}
    });
});

$("body").on("click", "#edtPrintCommandCancel", function(){
	$("#printMarginBox").css("display","none");
});

$("body").on("click", ".edtHeader #printLandscape", function(){
		$(".edtHeader #viewOpts").trigger("change");
});

$("body").on("change", ".edtHeader #viewOpts", function(){
		var getOption = $(this).val();
		if(getOption=="responsive")	{
			$("#edt").css("width","auto");
		}
		else{
			if($("#printLandscape").is(":checked")){
			var getWidth = $(this).find("option:selected").attr("data-landscape-width");
			}
			else{
			var getWidth = $(this).find("option:selected").attr("data-width");
			}
			$("#edt").css("width",getWidth+"in");
		}
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
			indexing();
			columnizer();
			setDocEntryHig(); //changes
});

	$("body").on("change", ".edtHeader #sNumbers", function(){
		if($(this).is(":checked")){
			$(".statementNums").addClass("active");
			$(".edtContainer").addClass("statementson");
			outLineNum();
			indexing();
		}
		else{
			$(".edt .edtParagraph").removeAttr("data-s");
			$(".statementNums").removeClass("active");
			$(".edtContainer").removeClass("statementson");
			indexing();
		}
	});

	$("body").on("change", ".edtHeader #documentMode", function(){
		document.getSelection().removeAllRanges();
		if($(this).val()=="structured")
		{
			$(".unstructuredIcon").css("display","none");
			$(".statementNums").show();
			$(".edtColumns").show();
			$("#edt").addClass("structured");
			$(".edtContainer").addClass("structuredMode");
			$("#edt").removeClass("unstructured");

			if($(".edtTOC").is(":visible")){
			$(".edt").css("margin-left","80px");
			$(".edtColumns").css("padding-left","79px");
			}
			else{
			$(".edtColumns").css("padding-left","39px");
			$(".edtColumns").css("margin-left","0px");
			$("#edt").css("margin-left","40px");
			}
//			$(".edtColumns").css("padding-left","27px");
//			$("#edt").css("margin-left","27px");
			if($("#sNumbers").is(":checked")){
				outLineNum();
			}
			indexing();
			columnizer();
			autoEDTHeightCheck();
		}
		else{
			$(".edt .edtParagraph").removeAttr("data-s");
			$(".unstructuredIcon").css("display","inline-block");
			$(".edtColumns").hide();
			$("#edt").removeClass("structured");
			$(".edtContainer").removeClass("structuredMode");
			$("#edt").addClass("unstructured");
			$(".statementNums").hide();

			if($(".edtTOC").is(":visible")){
			$(".edt").css("margin-left","40px");
			$(".edtColumns").css("padding-left","39px");
			}
			else{
			$(".edtColumns").css("padding-left","0px");
			$(".edtColumns").css("margin-left","-1px");
			$("#edt").css("margin-left","0px");
			}
			$(".edtBody .numbering").empty();
			indexing();
			columnizer();
		}
		// calculate height and Width (anjali)
//		caretInsert();
//		setColumnsH();

		$('.structured').siblings('.numbering').css('display','block');
    	$('.unstructured').siblings('.numbering').css('display','none');
		return false;
	});

$("body").on("change","#uploadImage",function() {
	var getCurrentPosition = document.getSelection().anchorNode;
	if(getCurrentPosition.nodeType==3){
		getCurrentPosition = getCurrentPosition.parentNode;
	}

	if(getCurrentPosition.className.indexOf("edtParagraph")==-1)
	{
		while(getCurrentPosition.className.indexOf("edtParagraph")==-1){
			getCurrentPosition = getCurrentPosition.parentNode;
		}
	}
	if(getCurrentPosition.className.indexOf("edtParagraph")!=-1){
		var getIMG = $(this).prop('files')[0];
		var form_data = new FormData();
		form_data.append('file', getIMG);
		form_data.append('type',"directUpload");
		var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
		var reader = new FileReader();
		reader.onload = function(e){
		$(".edtCustomLoader").show();
		$("#edt").attr("contenteditable",false);
		var dummyImage = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;";
		pasteHtmlAtCaret(dummyImage);
		setTimeout(function(){
		indexing();
		},300);
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
		   	setTimeout(function(){
				$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
				$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
				setDocEntryHig(); //changes
				$(".edtCustomLoader").hide();
				$("#edt").attr("contenteditable",true);
				});
		   });
	}
});

$("body").on("dblclick",".edtParagraph img",function() {
	$("#imageCrop").removeAttr("id");
	$('#myImg').attr('src', $(this).attr("src"));
	$(this).attr("id","imageCrop");
	imgToCrop = $(this).attr("src");
	var getIMGWidth = $(this).width();
	$("#myEditorImg .modal-dialog").css("width","400");
	if(getIMGWidth>400){
	$("#myEditorImg .modal-dialog").width(getIMGWidth+40);
	}
	$("#myEditorImg").modal("show");
	if(typeof jcrop_api!="undefined"){
	jcrop_api.destroy();
	}
	$('#myImg').Jcrop({
      aspectRatio: 1,
      onSelect: updateCoords
    },function(){
    jcrop_api = this;
  	});
});

$("body").on("click",".edtParagraph img",function(event) {
	if(!$(this).hasClass("ui-resizable")){
	$(this).resizable({
	stop: function(){
		$(this).resizable("destroy");
		$(".edt img").css("display","inline-block");
		setTimeout(function(){
		indexing();
		},100);
	}
	});
	event.stopPropagation();
	}
});

$("body").on("click","#cropImageEDT",function(event) {
	if (!parseInt($('#w').val())){
    bootbox.alert('Please select a crop region.');
    return false;
	}
	$.ajax({
		  method: "POST",
		  url: "crop.php",
		  data: {x:$(x).val(),y:$(y).val(),w:$(w).val(),h:$(h).val(), imgPath:imgToCrop}
			})
		  .success(function(msg) {
			$(".edt img").resizable();
			$(".edt img").resizable("destroy");
			$("#imageCrop").removeAttr("src");
			$("#imageCrop").attr("src",msg);
			$("#imageCrop").width($(w).val()).height($(h).val());
			$(".edt img").css("display","inline-block");
			$("#myEditorImg").modal("hide");
			$("#imageCrop").removeAttr("id");
			indexing();
		  });
});

$("body").on("click","#resetImageEDT",function(event) {
	$("#imageCrop").width("auto").height("auto");
	$("#myEditorImg").modal("hide");
	setTimeout(function(){
	indexing();
	},100);
});

$("body").on("click",".collapsableEDTLevelsContent span",function(event) {
	var getIndex = $(this).index();
	if($(this).hasClass("selected")){
		$(this).removeClass("selected");
		$(".edtParagraph:eq("+getIndex+")").addClass("selectedHeader");
		if(getSelectedEDTLevel==undefined){
		getSelectedEDTLevel = $("#edtAutoLevels").val();
		}
		runTOC();
	}
	else{
		$(this).addClass("selected")
		$(".edtParagraph:eq("+getIndex+")").removeClass("selectedHeader");
		runTOC();
	}
});

$("body").on("click",".close-edt-flyout",function(event) {
	$("#myTaggedFields").animate({right: '-100%'},'slow',function(){
		$("#myTaggedFields").hide();
		$('.edt-loader').hide();
	})
});

// $( window ).resize(function() {
// 	var windowWidthEDT = $(window).height()-$(".edtHeader").outerHeight()-30;
// 	windowWidthEDT = Math.floor(windowWidthEDT/22) * 22;
// 	$("#edt").css("min-height",windowWidthEDT);
// 	$(".mainScroll").css("height",windowWidthEDT);
// 	$(".edtTOC").css("height",windowWidthEDT);
// 	manageDocEdtHig();
// 	indexing();
// 	if($("#sNumbers").is(":checked")){
// 		outLineNum();
// 	}
// });

var windowWidthEDT = $(window).height()-$(".edtHeader").outerHeight()-30;
windowWidthEDT = Math.floor(windowWidthEDT/22) * 22;
$("#edt").css("min-height",windowWidthEDT);
$(".mainScroll").css("height",windowWidthEDT);
$(".edtTOC").css("height",windowWidthEDT);
if(typeof manageDocEdtHig != 'undefined') {
	manageDocEdtHig();
}

$("#sNumbers").prop("checked",false);
$("#printLandscape").prop("checked",false);
$("#documentMode").val("structured");
$("#documentMode").val("structured");
$("#viewOpts").val("responsive");
rangeInitialize();
indexing();

if(typeof Jcrop!="undefined"){
	$('#myImg').Jcrop({
	  aspectRatio: 1,
	  onSelect: updateCoords
	},function(){
	jcrop_api = this;
	});
}

$(".unstructuredIcon").hide();

$(".niceScrollDiv").niceScroll({
        cursorcolor: "#909090",
        cursorborder: "0",
        cursorborderradius: '0',
        cursorwidth: "5px",
        background: 'rgba(0,0,0,.25)'
    });

});

function updateCoords(c)
  {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
  }

function checkCoords()
  {
    if (parseInt($('#w').val())) return true;
    bootbox.alert('Please select a crop region then press submit.');
    return false;
  }

function getFirstRange() {
            var sel = rangy.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
}

function countEDTWords(){
var getTotalWords = 0;
$(".edtParagraph").each(function(index, element) {
var getTotalWordsText = $.trim($(this).text());
if(getTotalWordsText!=""){
getTotalWords = getTotalWordsText.replace(/[^\w ]/g, " ").split( /[\s]+/ ).length + getTotalWords;
}
});
$(".doTotalsWords").text(getTotalWords + " words");
}

function rangeInitialize(){
rangy.init();
	var classApplierModule = rangy.modules.ClassApplier || rangy.modules.CssClassApplier;
    if (rangy.supported && classApplierModule && classApplierModule.supported) {
         edtBoldApplier = rangy.createClassApplier("edtBold");
         edtUnderlineApplier = rangy.createClassApplier("edtUnderline");
         edtItalicApplier = rangy.createClassApplier("edtItalic");
         edtStrikeApplier = rangy.createClassApplier("edtStrike");
         edtFontFamilyApplier = rangy.createClassApplier("fontFamily", {
                            elementProperties : {
                                style : {
                                    "font-family" : "inherit",
                                }
                            }
            });
         edtFontFamilySizeApplier = rangy.createClassApplier("fontSize", {
                            elementProperties : {
                                style : {
									"font-size" : "inherit",
                                }
                            }
            });
         edtFontFamilyColorApplier = rangy.createClassApplier("fontColor", {
                            elementProperties : {
                                style : {
									"color" : "inherit",
                                }
                            }
            });
         edtFontFamilyBGColorApplier = rangy.createClassApplier("fontBGColor", {
                            elementProperties : {
                                style : {
									"background-color" : "inherit",
                                }
                            }
            });
      }
}

function columnizer(){
    $(".edtContainer .edtColumns").empty();
	var totalColumns = minMaxId(".edt .edtParagraph");
    for(i=0; i<=totalColumns;i++){
    $(".edtContainer .edtColumns").append("<div>"+(i+1)+"</div>");
	}
}

function minMaxId(selector) {
  var min=null, max=null;
  $(selector).each(function() {
    var id = parseInt($(this).attr("data-x"), 10);
    if ((min===null) || (id < min)) { min = id; }
    if ((max===null) || (id > max)) { max = id; }
  });
  return max;
}

function runTOC(){
	outLineArray = [];
	tempOutLineArray = [];
	tempOutLineIndex = [];
	var custom = 0;
	var getSelectedVal = $("#edtAutoLevels").val();
	if(getSelectedVal=="custom" || getSelectedEDTLevel!=undefined){
		getSelectedVal=getSelectedEDTLevel;
	}
	$(".collapsableEDTLevelsContent").empty();
	var getParaEDT = $(".edtParagraph");
	var colapsabelContent = $(".collapsableEDTLevelsContent");
	var temHTML = "";
	getParaEDT.each(function(y) {
		var getAttrParaDataX = $(this).attr("data-x");
		outLineArray.push(parseInt(getAttrParaDataX));
		var getParaHeight = $(this).outerHeight();
		var getThis = $(this);
		var getParaDataX = getParaEDT.eq(y).attr("data-x");
		if($(this).hasClass("selectedHeader")){
			custom = 1;
			temHTML = temHTML + "<span style='height:"+getParaHeight+"px' data-index='"+y+"' class='disabled'>&nbsp;</span>";
		}
		else{
			temHTML = temHTML + "<span style='height:"+getParaHeight+"px' data-index='"+y+"'>&nbsp;</span>";
		}
	});
	colapsabelContent.append(temHTML);
	tempOutLineArray = outLineArray.slice();
	var c=0;
	for(var p=0; p<tempOutLineArray.length;p++){
		if(tempOutLineArray[p]!=0){
			var getPrebOLA = tempOutLineArray[p-1];
			var getCurrentOLA = tempOutLineArray[p];
			if(getCurrentOLA!=getPrebOLA && getCurrentOLA!=parseInt(getPrebOLA)+1 && getCurrentOLA>getPrebOLA){
				tempOutLineArray.splice(p,1);
				tempOutLineIndex.push(c);
				p=p-1;
			}
		}
		c=c+1;
	}

	var getMaxValue = Math.max.apply(Math,tempOutLineArray);
	$("#edtAutoLevels").empty();

	if(getMaxValue==0 && custom==0){
			$("#edtAutoLevels").css("display","none");
	}

		for (var s=0; s<getMaxValue; s++){
				$("#edtAutoLevels").css("display","inline");
				if(s==getSelectedVal){
				$("#edtAutoLevels").append("<option value="+s+" selected>Level "+(parseInt(s)+1)+"</option");
				}
				else{
				$("#edtAutoLevels").append("<option value="+s+">Level "+(parseInt(s)+1)+"</option");
				}
		}
		if(custom==1){
		$("#edtAutoLevels").prepend("<option value='custom' selected>Custom</option");
		}

		var setMarginGap = 10;
		$(".edtTOC ul").empty();
		if(getMaxValue==0 && custom==0){
			return false;
		}
		//var getMaxValue = Math.max.apply(Math,outLineArray);
			if($("#edtAutoLevels").val()=="custom"){
				getMaxValue = parseInt(getSelectedEDTLevel)+1;
			}
			else{
				getMaxValue = parseInt($("#edtAutoLevels").val())+1;
			}
			 var insertHTML = "";
			for(var x=0; x<outLineArray.length;x++){
					if(getParaEDT.eq(x).attr("data-x")<getMaxValue && tempOutLineIndex.indexOf(x)==-1){
						if($.trim(getParaEDT.eq(x).text())!=""){
						   var getContent = $.trim(getParaEDT.eq(x).text());
							  if(getContent.length>40){
							   getContent = getContent.substring(0, 40);
							   getContent = $.trim(getContent) + "...";
							  }
						   var setMargin = getParaEDT.eq(x).attr("data-x") * setMarginGap;
						   if(!getParaEDT.eq(x).hasClass("selectedHeader")){
						   insertHTML = insertHTML+"<li style='margin-left:"+setMargin+"px' data-num="+x+">"+getContent+"</li>";
						   $(".collapsableEDTLevelsContent span:eq("+x+")").addClass("selected");
						   }
						   else{
						   $(".collapsableEDTLevelsContent span:eq("+x+")").addClass("disabled");
						   }
						}
					}
			}
			$(".edtTOC ul").append(insertHTML);
}

function indexing(checkDoable){
	var start = new Date().getTime();
	var tabGap=20;
	var outerHeight = 0;
	var  arrayHeight = [];
	$(".edt .edtList").each(function(p) {
		var getAttrDataX = $(this).attr("data-x");
		var setMargin = getAttrDataX*tabGap;
		$(this).css("margin-left",setMargin+"px");
		$(this).removeClass("edtListSub");
		var getThis = $(this);
		if($(this).hasClass("edtList") && $(this).prev(".edtParagraph").hasClass("edtList") && $(this).attr("data-x")>$(this).prev(".edtParagraph").attr("data-x")){
			$(this).addClass("edtListSub");
		}
		if($(this).hasClass("edtList")){
			$(this).prevAll().each(function(index, element) {
				if($(this).hasClass("edtList")){
					if(getThis.attr("data-x")==$(this).attr("data-x")){
						var getListClass = $(this).attr("class");
						getListClass = getListClass.replace(/edtCenter|edtLeftALign|edtRightAlign/gi,"");
						if(getThis.hasClass("selectedHeader"))
						{
							getThis.addClass(getListClass);
						}
						else{
						getThis.addClass(getListClass);
						getThis.removeClass("selectedHeader");
						}
						return false;
					}

					if(getThis.attr("data-x")>$(this).attr("data-x")){
						var getListClass = $(this).attr("class");
						if(getThis.hasClass("selectedHeader"))
						{
							getThis.addClass(getListClass);
						}
						else{
							getThis.addClass(getListClass);
							getThis.removeClass("selectedHeader");
						}
						if($(this).hasClass("edtList")){
						getThis.addClass("edtListSub");
						}
						return false;
					}
				}
				else{
					return false;
				}

			});
		}
});

if($("#edt").hasClass("unstructured")){
	$(".edtParagraph").outerHeight("auto");
}
else{
	if(!$("#sNumbers").is(":checked")){
	$(".edtParagraph").outerHeight("auto");
	}
/*
	$("#edt img").each(function(p) {
		var getThis = $(this).closest(".edtParagraph");
		getThis.outerHeight("auto");
		getOuterHeight = getThis.outerHeight();
		getThis.outerHeight(Math.ceil(getOuterHeight/22) * 22);
	});
*/
}
//    var line_height = $(".edt .edtParagraph").css('line-height');
	//$(".edtBody .numbering").empty();
	countEDTWords();
	if(checkDoable!="withoutMe"){
		pushUndoRedo();
	}
}

function outLineNum(hasElement){
	if($("#edt").hasClass("unstructured")){
		return false;
	}

	if(hasElement!=undefined){
		var startPoint = hasElement.index();
	}
	else{
		var startPoint = 0;
	}


	var getParasLength = $(".edt .edtParagraph").length;

	if($(".edtContainer .edtParagraph:eq("+startPoint+")").attr("data-s")==undefined){
		$($(".edtContainer .edtParagraph:eq("+startPoint+")")).prevAll().each(function(index, element) {
            if($(this).attr("data-s")!=undefined || $(this).attr("data-s")!=""){
				startPoint = $(this).index();
			}
        });
	}

   	var getDivPara = $(".edtContainer .edtParagraph");
		var myStatementDataS = [];
		var myStatementDataX = []
		var getmYPos = $(".edtParagraph");
		for(var y=0; y<=getParasLength-1; y++){
			var mynewPos = getmYPos.eq(y).attr("data-x");
			myStatementDataX.push(mynewPos);
			mynewPos = Number(mynewPos);
			getmYPos.eq(y).attr("data-s","");
			if(mynewPos==0){
				if(y==0){
				   var statementNum = getmYPos.eq(y).index();
				}
				else{
				   var newtempDataXArray = myStatementDataX.slice(0,y);
				   var statementNum = newtempDataXArray.lastIndexOf("0");
				}
				var getSpanValue = myStatementDataS[statementNum];
				if(getSpanValue==undefined){
					getSpanValue = 0;
				}
				statementNum = Number(getSpanValue)+1;
				myStatementDataS.push(statementNum+".");
			}
			else{
				   var s;
				   var k = getmYPos.eq(y).prev(".edtParagraph").attr("data-x");
				   var getkIndex = getmYPos.eq(y).prev(".edtParagraph").index();
				   var j = myStatementDataS[getkIndex];
				   if(k==mynewPos){
					  var p = j.split(".");
					  var q = parseInt(p[p.length-2])+1;
					  var d = p[p.length-2].length+1;
					  var z = j.substring(0, j.length - d);
					  s = z+q+".";
				   }
				   else if(k<mynewPos){
					   var n = mynewPos-k;
					   var l="";
						for(var i=1;i<n;i++){
							l=l+"-.";
						}
					   s = j+l+"1.";
				   }
				   else{
					   var asset = 0;
					   var prevPos;
					   var newtempDataXArray = myStatementDataX.slice(0,y);
					   newtempDataXArray.reverse();
					   var tempLength = newtempDataXArray.length-1;
					   $(newtempDataXArray).each(function(r,v){
								if(myStatementDataX[tempLength-r]<=mynewPos){
									if(myStatementDataX[tempLength-r]==mynewPos){
										asset=1;
									}
									prevPos = tempLength-r;
									k = myStatementDataX[tempLength-r];
									return false;
								}
						});

						j = myStatementDataS[prevPos];
						if(asset==0){
							var n = mynewPos-k;
							var l="";
							for(i=1;i<n;i++){
								l=l+"-.";
							}
							s = j+l+1+".";
						}
						else{
							var p = j.slice(-2);
							p = parseInt(p)+1;
							var z = j.substring(0, j.length - 2);
							s = z+p+".";
						}

				   }
				myStatementDataS.push(s);

			}
		}

		$(myStatementDataS).each(function(index, element) {
        getmYPos.eq(index).attr("data-s",element);
		if(getmYPos.eq(index).text()==""){
			getmYPos.eq(index).html("<br>");
		}
        });

}

var assignTransversingThis;
var assignTransversingThisAttrDataX;
var innerListMode=false;
var setFirstTime=0;
var imgLoaderTime;
function transverseNodes(newElem){
var tabGap = 20;
var getClassNames = assignTransversingThis.attr("class");
var getElementPosition = assignTransversingThis.attr("data-x");
var setMargin = getElementPosition*tabGap;
var getChildren  = $(newElem).children();
//console.log(getChildren[0].nodeName);
for(var i=0;i<getChildren.length;i++){
			if(i==0){
				var spanTurn = false;
				if(getElementDefaultDisplay(newElem.children[i].nodeName)!=="block" && getChildren.length==1){
					spanTurn = true;
				}
				if(getElementDefaultDisplay(newElem.children[i].nodeName)!=="block" && newElem.children[i].nodeName!=="TABLE" && !spanTurn){
					if(newElem.children[i].nodeName=="IMG"){
					var getIMGPath = newElem.children[i].getAttribute("src");
					var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
					clearTimeout(imgLoaderTime);
					$(".edtCustomLoader").show();
					var dummyImage = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;";
					pasteHtmlAtCaret(dummyImage);
					$.ajax({
						  method: "POST",
						  url: "edt-file-upload.php",
						  data: {imgPath: getIMGPath,type:"pasteUpload"}
							})
						  .success(function(msg) {
							$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
							$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
							imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
						  });
					}
					else{
						pasteHtmlAtCaret($.trim(newElem.textContent));
					}
					assignTransversingThis.html(assignTransversingThis.html().replace(/(<br>\s*)+/g, ''));
					cursorManager.setEndOfContenteditable(assignTransversingThis.get(0));
					setTimeout(function(){
						$(".mainScroll").scrollTop(Math.abs($(assignTransversingThis).offset().top - $(assignTransversingThis).height() - $(".mainScroll").offset().top + $(".mainScroll").scrollTop()));
					});
					if($("#sNumbers").is(":checked")){
						outLineNum();
					}
					indexing();
					setDocEntryHig(); //changes
					holdPaste = false;
					return false;
				}
			}
			var getElementPosition = assignTransversingThis.attr("data-x");
			var getClassNames = "edtParagraph";
			if(innerListMode==true){
				var getElementPositionNew = parseInt(getElementPosition) + 1;
				var setMarginNew = getElementPositionNew*tabGap;
			}
			else{
				var getElementPositionNew = getElementPosition;
				var setMarginNew = getElementPositionNew*tabGap;
			}
			innerListMode=false;
			var getStyle=$(getChildren[i]).attr("style");
			if(getStyle==undefined){
				getStyle = "";
			}

			if(newElem.children[i].nodeName=="TABLE" || newElem.children[i].nodeName=="TBODY" || newElem.children[i].nodeName=="TR"){
					var creatElem = document.createElement("DIV");
					creatElem.innerHTML = newElem.children[i].innerHTML;
					innerListMode=true;
					transverseNodes(creatElem);
			}
			else if(($(getChildren[i]).hasClass("MsoListParagraphCxSpFirst") || $(getChildren[i]).hasClass("MsoListParagraphCxSpMiddle") || $(getChildren[i]).hasClass("MsoListParagraphCxSpLast") || $(getChildren[i]).hasClass("MsoListParagraph") || $(getChildren[i]).hasClass("MsoNormal")) && getStyle.indexOf(" level1 ")!="-1"){
					getElementPositionNew = 0;
					setMarginNew = getElementPositionNew*tabGap;
					var htmlToInsert = "<div class='"+getClassNames+ " edtList' data-x='"+getElementPositionNew+"' style='margin-left:"+setMarginNew+"px'>"+$.trim(getChildren[i].textContent)+"</div>";
					if($.trim($(assignTransversingThis).text()).length==0){
					$(assignTransversingThis).html($.trim(getChildren[i].textContent));
					$(assignTransversingThis).attr("data-x",getElementPositionNew).addClass(getClassNames + " edtList").css("margin-left",setMarginNew);
					}
					else{
					$(htmlToInsert).insertAfter(assignTransversingThis);
					assignTransversingThis = assignTransversingThis.next();
					}
				}
			else if(($(getChildren[i]).hasClass("MsoListParagraphCxSpFirst") || $(getChildren[i]).hasClass("MsoListParagraphCxSpMiddle") || $(getChildren[i]).hasClass("MsoListParagraphCxSpLast") || $(getChildren[i]).hasClass("MsoListParagraph") || $(getChildren[i]).hasClass("MsoNormal")) && getStyle.indexOf(" level")!="-1"){
					if(getStyle.indexOf(" level2 ")!="-1"){
					getElementPositionNew = 1;
					}
					else if(getStyle.indexOf(" level3 ")!="-1"){
					getElementPositionNew = 2;
					}
					else if(getStyle.indexOf(" level4 ")!="-1"){
					getElementPositionNew = 3;
					}
					else if(getStyle.indexOf(" level5 ")!="-1"){
					getElementPositionNew = 4;
					}
					else if(getStyle.indexOf(" level6 ")!="-1"){
					getElementPositionNew = 5;
					}
					else if(getStyle.indexOf(" level7 ")!="-1"){
					getElementPositionNew = 6;
					}
					else if(getStyle.indexOf(" level8 ")!="-1"){
					getElementPositionNew = 7;
					}
					else if(getStyle.indexOf(" level9 ")!="-1"){
					getElementPositionNew = 8;
					}
					else{
					getElementPositionNew = 0;
					}
					setMarginNew = getElementPositionNew*tabGap;
					var htmlToInsert = "<div class='"+getClassNames+ " edtList edtListSub' data-x='"+getElementPositionNew+"' style='margin-left:"+setMarginNew+"px'>"+$.trim(getChildren[i].textContent)+"</div>";
					if($.trim($(assignTransversingThis).text()).length==0){
					$(assignTransversingThis).html($.trim(getChildren[i].textContent));
					$(assignTransversingThis).attr("data-x",getElementPositionNew).addClass(getClassNames + " edtList").css("margin-left",setMarginNew);
					}
					else{
					$(htmlToInsert).insertAfter(assignTransversingThis);
					assignTransversingThis = assignTransversingThis.next();
					}
				}
			else if (getChildren[i].nodeName=="UL" || getChildren[i].nodeName=="OL" || getChildren[i].nodeName=="LI"){
					$(getChildren[i].children).each(function(index, element) {
					if(getChildren[i].children[index].tagName=="OL" || getChildren[i].children[index].tagName=="UL"){
						var creatElem = document.createElement("DIV");
						creatElem.innerHTML = getChildren[i].children[index].outerHTML;
						innerListMode=true;
						setFirstTime=1;
						transverseNodes(creatElem);
					}
					else{
					if(getChildren[i].children[index].children.length>1){
						var getLengthCurrent = getChildren[i].children[index].children.length;
							for(var k=0;k<getLengthCurrent;k++){
								if($(getChildren[i].children[index].children).has("li").length==0){
									if($(getChildren[i].children[index]).find("img").length>0){
										var getIMAGELink = $(getChildren[i].children[index]).find("img").attr("src");
										var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
										clearTimeout(imgLoaderTime);
										$(".edtCustomLoader").show();
										var elementToInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].children[index].textContent.trim();
										}
										else{
										var elementToInsert = getChildren[i].children[index].textContent.trim();
										}
										if(elementToInsert.trim().length!=0 || $(getChildren[i].children[index]).find("img").length>0){
										var htmlToInsert = "<div class='"+getClassNames+ " edtList' data-x='"+getElementPositionNew+"' style='margin-left:"+setMarginNew+"px'>"+elementToInsert+"</div>";
										$(htmlToInsert).insertAfter(assignTransversingThis);
										assignTransversingThis = assignTransversingThis.next();
										if($(getChildren[i].children[index]).find("img").length>0){
											$.ajax({
											  method: "POST",
											  url: "edt-file-upload.php",
											  data: {imgPath: getIMAGELink,type:"pasteUpload"}
												})
											  .success(function(msg) {
												$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
												$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
												imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
											  });
											}
										break;
										}
								}
								else if(getChildren[i].children[index].children[k].tagName=="UL" || getChildren[i].children[index].children[k].tagName == "OL")
									{
									var creatElem = document.createElement("DIV");
									creatElem.innerHTML = getChildren[i].children[index].children[k].outerHTML;
									innerListMode=true;
									setFirstTime=1;
									transverseNodes(creatElem);
									}
								else{
									if(setFirstTime==0){
										if($(getChildren[i].children[index].children[k]).find("img").length>0){
										var getIMAGELink = $(getChildren[i].children[index].children[k]).find("img").attr("src");
										var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
										clearTimeout(imgLoaderTime);
										$(".edtCustomLoader").show();
										var elementToInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].children[index].children[k].textContent.trim();
										}
										else{
										var elementToInsert = getChildren[i].children[index].children[k].textContent.trim();
										}
										if(elementToInsert.trim().length!=0 || $(getChildren[i].children[index].children[k]).find("img").length>0){
										assignTransversingThis.addClass("edtList");
										pasteHtmlAtCaret(elementToInsert);
											if($(getChildren[i].children[index].children[k]).find("img").length>0){
											$.ajax({
											  method: "POST",
											  url: "edt-file-upload.php",
											  data: {imgPath: getIMAGELink,type:"pasteUpload"}
												})
											  .success(function(msg) {
												$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
												$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
												imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
											  });
											}
										}
										setFirstTime=1;
									}
									else{
										if($(getChildren[i].children[index].children[k]).find("img").length>0){
										var getIMAGELink = $(getChildren[i].children[index].children[k]).find("img").attr("src");
										var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
										clearTimeout(imgLoaderTime);
										$(".edtCustomLoader").show();
										var elementToInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].children[index].children[k].textContent.trim();
										}
										else{
										var elementToInsert = getChildren[i].children[index].children[k].textContent.trim();
										}
										if(elementToInsert.trim().length!=0 || $(getChildren[i].children[index].children[k]).find("img").length>0){
										var htmlToInsert = "<div class='"+getClassNames+ " edtList' data-x='"+getElementPositionNew+"' style='margin-left:"+setMarginNew+"px'>"+elementToInsert+"</div>";
										$(htmlToInsert).insertAfter(assignTransversingThis);
										assignTransversingThis = assignTransversingThis.next();
										if($(getChildren[i].children[index].children[k]).find("img").length>0){
											$.ajax({
											  method: "POST",
											  url: "edt-file-upload.php",
											  data: {imgPath: getIMAGELink,type:"pasteUpload"}
												})
											  .success(function(msg) {
												$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
												$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
												imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
											  });
											}
										}
									}
								}
							}
					}
					else{
						if(setFirstTime==0){
							if($(getChildren[i].children[index]).find("img").length>0){
							var getIMAGELink = $(getChildren[i].children[index]).find("img").attr("src");
							var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
							clearTimeout(imgLoaderTime);
							$(".edtCustomLoader").show();
							var elementToInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].children[index].textContent.trim();
							}
							else{
							var elementToInsert = getChildren[i].children[index].textContent.trim();
							}
							if(elementToInsert.trim().length!=0 || $(getChildren[i].children[index]).find("img").length>0){
							assignTransversingThis.addClass("edtList");
							pasteHtmlAtCaret(elementToInsert);
								if($(getChildren[i].children[index]).find("img").length>0){
								$.ajax({
								  method: "POST",
								  url: "edt-file-upload.php",
								  data: {imgPath: getIMAGELink,type:"pasteUpload"}
									})
								  .success(function(msg) {
									$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
									$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
									imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
								  });
								}
							}
							setFirstTime=1;
						}
						else{
							if($(getChildren[i].children[index]).find("img").length>0){
							var getIMAGELink = $(getChildren[i].children[index]).find("img").attr("src");
							var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
							clearTimeout(imgLoaderTime);
							$(".edtCustomLoader").show();
							var elementToInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].children[index].textContent.trim();
							}
							else{
							var elementToInsert = getChildren[i].children[index].textContent.trim();
							}
							if(elementToInsert.trim().length!=0 || $(getChildren[i].children[index]).find("img").length>0){
							var htmlToInsert = "<div class='"+getClassNames+ " edtList' data-x='"+getElementPositionNew+"' style='margin-left:"+setMarginNew+"px'>"+elementToInsert+"</div>";
							$(htmlToInsert).insertAfter(assignTransversingThis);
							assignTransversingThis = assignTransversingThis.next();
									if($(getChildren[i].children[index]).find("img").length>0){
									$.ajax({
									  method: "POST",
									  url: "edt-file-upload.php",
									  data: {imgPath: getIMAGELink,type:"pasteUpload"}
										})
									  .success(function(msg) {
										$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
										$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
										imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
									  });
									}
							}
						}
					}
					}
					});
			}
			else{
				if(getChildren[i].children.length!=0 && getElementDefaultDisplay(getChildren[i].children[0].tagName)=="block"){
					transverseNodes(getChildren[i]);
				}
				else{
						if(getChildren[i].tagName=="H1" || getChildren[i].tagName=="H2" || getChildren[i].tagName=="H3" || getChildren[i].tagName=="H4"){
						var elemInsert = "<span class=\"edtBold\">"+getChildren[i].textContent.trim()+"</span>";
						}
						else{
						if($(getChildren[i]).find("img").length>0){
						var getIMAGELink = $(getChildren[i]).find("img").attr("src");
						var setID = Date.now() + "_" + Math.floor((Math.random() * 1000000000000) + 1);
						clearTimeout(imgLoaderTime);
						$(".edtCustomLoader").show();
						var elemInsert = "<div class='dummyIMG' id='"+setID+"'></div> &nbsp;" + getChildren[i].textContent.trim();
						}
						else{
						var elemInsert = getChildren[i].textContent.trim();
						}
						}

						if(setFirstTime==0){
								pasteHtmlAtCaret(elemInsert);
								setFirstTime=1;
						}
						else{
						var htmlToInsert = "<div class='edtParagraph' data-x='"+assignTransversingThisAttrDataX+"' style='margin-left:"+setMargin+"px'>"+elemInsert+"</div>";
						$(htmlToInsert).insertAfter(assignTransversingThis);
						assignTransversingThis = assignTransversingThis.next();

						if($(getChildren[i]).find("img").length>0){
						$.ajax({
						  method: "POST",
						  url: "edt-file-upload.php",
						  data: {imgPath: getIMAGELink,type:"pasteUpload"}
							})
						  .success(function(msg) {
							$("#"+setID).parent(".edtParagraph").html($("#"+setID).parent(".edtParagraph").html().replace(/(<br>\s*)+/g, ''));
							$("#"+setID).html("<img src='"+msg+"'>").find("img").unwrap();
							imgLoaderTime = setTimeout(function(){$(".edtCustomLoader").hide();},500);
						  });
						}
					}
				}
			}
		}
cursorManager.setEndOfContenteditable(assignTransversingThis.get(0));
setTimeout(function(){$(".mainScroll").scrollTop($(assignTransversingThis).offset().top - $(assignTransversingThis).height() - $(".mainScroll").offset().top + $(".mainScroll").scrollTop());
});
autoEDTHeightCheck();
if($("#sNumbers").is(":checked")){
	outLineNum();
}
indexing();
columnizer();
setDocEntryHig(); //changes
holdPaste = false;
}


function parsePastedHTML(newElemChildren){
	    var getThis = newElemChildren.closest(".edtParagraph");
		cursorManager.setEndOfContenteditable(getThis.find(".replaceMe").get(0));
		getThis.find(".replaceMe").remove();
		var newElem = document.createElement("DIV");
		newElem.innerHTML = $("#pastedText").html();
		$("#pastedText").html("");
		if(newElem.children.length==0){
			var getText = $.trim(newElem.textContent);
			pasteHtmlAtCaret(getText);
			autoEDTHeightCheck();
			return false;
		}
		assignTransversingThis = getThis;
		assignTransversingThisAttrDataX = getThis.attr("data-x");
		setFirstTime=0;
		transverseNodes(newElem);
}

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
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

function getElementDefaultDisplay(tag) {
    var cStyle,
        t = document.createElement(tag),
        gcs = "getComputedStyle" in window;

    document.body.appendChild(t);
    cStyle = (gcs ? window.getComputedStyle(t, "") : t.currentStyle).display;
    document.body.removeChild(t);

    return cStyle;
}

(function( cursorManager ) {

    var voidNodeTags = ['AREA','A', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    function canContainText(node) {
        if(node.nodeType == 1) { //is an element node
            return !voidNodeTags.contains(node.nodeName);
        } else { //is not an element node
            return false;
        }
    };

    function getLastChildElement(el){
        var lc = el.lastChild;
        while(lc && lc.nodeType != 1) {
            if(lc.previousSibling)
                lc = lc.previousSibling;
            else
                break;
        }
        return lc;
    }

    function getFirstChildElement(el){
        var lc = el.firstChild;
		while(lc && lc.nodeType != 1) {
            if(lc.nextSibling)
                lc = lc.nextSibling;
            else
                break;
        }
        return lc;
    }
    //Based on Nico Burns's answer
    cursorManager.setEndOfContenteditable = function(contentEditableElement)
    {

        while(getLastChildElement(contentEditableElement) &&
              canContainText(getLastChildElement(contentEditableElement))) {
            contentEditableElement = getLastChildElement(contentEditableElement);
        }

        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

    cursorManager.setBeginingOfContenteditable = function(contentEditableElement)
    {
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(true);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(true);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

}( window.cursorManager = window.cursorManager || {}));

function autoEDTHeightCheck(){
	var element = document.getElementById('edt');
	ResizeSensor.detach(element);
	new ResizeSensor(element, function() {
		if($("#documentMode").val()=="structured"){
			var line_height = 22;
			line_height = parseFloat(line_height);
			var outerHeight = element.clientHeight;
			var rows = outerHeight / line_height;
			var totalNumLines = $(".edtBody .numbering span").length;
			rows = Math.round(rows);
			var k="1";
			var lineHTML = "";
			var getLines = $(".edtBody .numbering");
			if(rows>totalNumLines){
				var rowLength = rows-totalNumLines;
				for(var i=1; i<=rowLength;i++){
					lineHTML = lineHTML+"<span>"+parseInt(totalNumLines+i)+"</span>";
				}
				getLines.append(lineHTML);
			}
			else if(rows<totalNumLines){
				var rowLength = totalNumLines-rows;
				for(var i=1; i<=rowLength;i++){
					getLines.find("span:last").remove();
				}
			}

		}
		if($(".edtTOC").is(":visible")){
		runTOC();
		}

});

}

function highlightText(highlightProperty) {
	//pushUndoRedo("noArray");
	$("#edt").unhighlight({className: "actor"});
	$("#edt").unhighlight({className: "role"});
	$("#edt").unhighlight({className: "terms"});
	if(highlightProperty=="hidden"){
		return false;
	}
		if(edtTagArray.length>0){
			$(edtTagArray).each(function(index, value) {
				var className = edtTagArray[index].type.toLowerCase();
				if(edtTagArray[index].fieldType=="Dynamic"){
					$('[data-name='+edtTagArray[index].tag+']').addClass(className);
				}
				else{
					$('#edt').highlight(edtTagArray[index].tag, { wordsOnly: true, className:className});
				}
			});
		}
}

function isScrolledIntoView(elem)
{
	var getFirstParaOffset = $(".edtParagraph:eq(0)").offset().top;
    var docViewTop = $(".mainScroll").scrollTop();
    var docViewBottom = docViewTop + $(".mainScroll").height();

    var elemTop = $(elem).offset().top-getFirstParaOffset;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function pushUndoRedo(checkArray){
		currentUndoRedoState = null;
		var getLatestHTML = $("#edt");
		var getHTMLRemove = getLatestHTML.find(".resize-sensor").remove();
		if($.trim(getLatestHTML.html())!=statusUndoRedo[statusUndoRedo.length-1]){
		statusUndoRedo.push($.trim(getLatestHTML.html()));
		if(statusUndoRedo.length>undoRedoLength){
			statusUndoRedo.shift();
		}
		highlightText(tagStatus);
		autoEDTHeightCheck();
	}
}
window.puJsFileLoadCounter++;
