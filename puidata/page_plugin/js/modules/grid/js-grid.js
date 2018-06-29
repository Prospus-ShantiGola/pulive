var jsGrid = {mouseDown : 0};
var validationArray = [];
var nodeYArray = [];

define(function() {
	jsGrid.start = function(){
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");
		var getAddButton = document.getElementById("addNewRow");
		getTableHead.addEventListener("click",jsGrid.tableClick,false);	
		getTable.addEventListener("click",jsGrid.tableClick,false);	
		getTable.addEventListener("dblclick",jsGrid.tableDblClick,false);
		getTable.addEventListener("keydown",jsGrid.checkKeyEvents,false);
		getTableHead.addEventListener("keydown",jsGrid.checkKeyEvents,false);
		getAddButton.addEventListener("click",jsGrid.addRow,false);
		getTableHead.addEventListener("mouseover",jsGrid.mouseOver,false);
	};

	jsGrid.addRow = function(e){
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");
		var newRow = getTable.getElementsByTagName("tbody")[0].insertRow(0);
		var rowHTML = getTableHead.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].innerHTML;
		newRow.innerHTML=rowHTML;
		var getNewlyCreatedItem = getTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0];
		getNewlyCreatedItem.className = "gridNewRow";
		for(var j=0; j<getNewlyCreatedItem.getElementsByTagName("td").length;j++){
			if(j==0){
				getNewlyCreatedItem.getElementsByTagName("td")[j].className = "index";
				getNewlyCreatedItem.getElementsByTagName("td")[j].innerHTML = "<span onclick='jsGrid.deleteRow(this)' class='grid-icon delete'></span>";
			}
			else if(j==1){
				getNewlyCreatedItem.getElementsByTagName("td")[j].className = "index";
				getNewlyCreatedItem.getElementsByTagName("td")[j].innerHTML = "&nbsp;";
			}		
			else{
				var getPropertyID = getTableHead.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[j].id;
				var getPropertyType = getTableHead.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[j].getAttribute("data-type");
				getPropertyID = getPropertyID.split("st_");
				getNewlyCreatedItem.getElementsByTagName("td")[j].removeAttribute("data-name");
				getNewlyCreatedItem.getElementsByTagName("td")[j].setAttribute("data-property",getPropertyID[1]);
				getNewlyCreatedItem.getElementsByTagName("td")[j].setAttribute("data-type",getPropertyType);
				getNewlyCreatedItem.getElementsByTagName("td")[j].className = "tdContainer col"+(j-2);
				getNewlyCreatedItem.getElementsByTagName("td")[j].innerHTML = "";			
			}
		}	
		var getInstanceID = $("#gridView tbody tr:eq("+($(getNewlyCreatedItem).index())+")");
		if(getInstanceID.find("td:last").attr("data-instance")==undefined){
			getInstanceID.find("td").each(function(){		
				var getText = $.trim($(this).text());
				var getPropID = $(this).attr("data-property");
				if(getPropID!=undefined){
					var fnName = "fn_"+getPropID;
					if(validationArray.indexOf(fnName)!=-1 && getText==""){
					 	$(this).css("background-color","#f2dede");
					}
					else{
						$(this).css("background-color","");
					}
				}
			})
		}	
	}

	jsGrid.deleteRow = function(e){
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");
		var getRowIndex = e.parentNode.parentNode;
		getRowIndex.remove();
	}

	jsGrid.checkKeyEvents = function(e){	
		var $keycode = (e.keyCode ? e.keyCode : e.which);
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");
		var getCurrentElement = document.getElementById("gridView").getElementsByClassName("current");
		if(getCurrentElement.length>0){
		var getCurrentRowElement = getCurrentElement.parentNode;
		var getRowIndex = getCurrentElement[0].parentNode.rowIndex;
		var getCellIndex = getCurrentElement[0].cellIndex;
		var getCurrentItems = getTable.getElementsByClassName("current");
		}
		else{
			return false;
		}
		
		if($keycode==13){
			e.preventDefault();
				var getNewElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex].getElementsByTagName("td")[getCellIndex];		
				if(getNewElement!=undefined){
					jsGrid.tableDblClick(getNewElement);			
				}	
		}
		
		if($keycode==37){
				if(getCurrentItems[0].getAttribute("contenteditable")=="true"){
					return false;
				}
				e.preventDefault();		
				var getNewCellIndex = getCellIndex-1;
				var getPreviousRowElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex-1];
				var getNewElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex].getElementsByTagName("td")[getNewCellIndex];
				
				if(getCurrentItems.length>1){				
					if(getNewCellIndex!=0 && getNewElement.cellIndex!=1){
						jsGrid.tableClick(document.getElementById("gridViewHead").getElementsByTagName("tr")[0].getElementsByTagName("td")[getNewCellIndex]);
					}				
					return false;
				}			
						
				if(getNewElement.cellIndex!=0 && getNewElement.cellIndex!=1){
					jsGrid.tableClick(getNewElement);
				}
				else if(getPreviousRowElement.rowIndex!=0){
					var getTDLength = getPreviousRowElement.getElementsByTagName("td").length
					getNewElement = getPreviousRowElement.getElementsByTagName("td")[getTDLength-1];		
					jsGrid.tableClick(getNewElement);
				}
		}
		if($keycode==39){	
				if(getCurrentItems[0].getAttribute("contenteditable")=="true"){
					return false;
				}	
				getCurrentItems[0].blur();
				e.preventDefault();			
				var getNewCellIndex = getCellIndex+1;
				var getNextRowElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex+1];
				var getNewElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex].getElementsByTagName("td")[getNewCellIndex];		
				
				if(getCurrentItems.length>1){				
					if(getNewElement!=undefined){
						jsGrid.tableClick(document.getElementById("gridViewHead").getElementsByTagName("tr")[0].getElementsByTagName("td")[getNewCellIndex]);
					}				
					return false;
				}		
				
				if(getNewElement!=undefined){
					jsGrid.tableClick(getNewElement);
				}
				else if(getNextRowElement!=undefined){
					getNewElement = getNextRowElement.getElementsByTagName("td")[2];		
					jsGrid.tableClick(getNewElement);
				}
		}
		if($keycode==38){
				if(getCurrentItems[0].getAttribute("contenteditable")=="true"){
					return false;
				}		
				getCurrentItems[0].blur();
				e.preventDefault();		
				var getPreviousRowElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex-1];
				var newRowIndex = getRowIndex-1;
				if(getCurrentItems.length>1){				
					jsGrid.tableClick(getPreviousRowElement.getElementsByTagName("td")[0]);
					return false;
				}		
		
				if(getPreviousRowElement!=undefined){
					getNewElement = getPreviousRowElement.getElementsByTagName("td")[getCellIndex];		
					jsGrid.tableClick(getNewElement);
				}
		}
		if($keycode==40){
				if(getCurrentItems[0].getAttribute("contenteditable")=="true"){
					return false;
				}		
				getCurrentItems[0].blur();
				e.preventDefault();
				var getNextRowElement = document.getElementById("gridView").getElementsByTagName("tr")[getRowIndex+1];		
				if(getCurrentItems.length>1){				
					if(getNextRowElement!=undefined){
						jsGrid.tableClick(getNextRowElement.getElementsByTagName("td")[0]);
					}				
					return false;
				}
				
				if(getNextRowElement!=undefined){
					var getNewElement = getNextRowElement.getElementsByTagName("td")[getCellIndex];					
					jsGrid.tableClick(getNewElement);			
				}
		}
	}

	jsGrid.mouseOver = function(e){
		if(e.target.className.indexOf("resizable")!=-1){
			if(jsGrid.mouseDown==0){
			jsGrid.columnResize(e.target);
			}
		}
	}

	jsGrid.tableClick = function(e){
		if(e.target==undefined){
			var target = e;
		}
		else{
			var target = e.target;
		}
		
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");	
		var getCellIndex = target.cellIndex;
		var getRowIndex = target.parentNode.rowIndex;
		var getAllRows = getTable.getElementsByTagName("tr");
		var getAllColumns = getTableHead.getElementsByTagName("tr");
		var getAllCurrentElements = getTable.getElementsByClassName("current");
		for(var i=0; i<getAllCurrentElements.length; i++){
			jsGrid.removeClass(getAllCurrentElements[i],"current");
			i=i-1;
		}	
		
		if(target.className.indexOf("tdContainer")!=-1){
			if(target.className.indexOf("current")!=-1){
				return false;
			}
			var getWidth = target.offsetWidth;
			var getHeight = target.offsetHeight;
			var getTopPosition = target.offsetTop-1;
			var getLeftPosition = target.offsetLeft-1;
			var getRightPosition = Math.abs(getWidth + getLeftPosition -1);		
			var getBottomPosition = Math.abs(getHeight + getTopPosition -1);	
			var getPreviousCurrentElement = document.getElementById("gridView").getElementsByClassName("current");
			if(getPreviousCurrentElement[0]!=undefined){
				getPreviousCurrentElement[0].removeAttribute("contenteditable");
				jsGrid.removeClass(getPreviousCurrentElement[0],"current");			
			}
			target.className += " current";
		}
		
		if(target.className.indexOf("resizable")!=-1){
			for(var i = 0; i<getAllRows.length; i++){
				getAllRows[i].getElementsByTagName("td")[getCellIndex].className += " current";
			}
		}
		
		if(target.className.indexOf("index")!=-1){
			var getAllColumns = getTable.getElementsByTagName("tr")[getRowIndex].getElementsByTagName("td");	
			for(var i = 1; i<getAllColumns.length; i++){
				getAllRows[getRowIndex].getElementsByTagName("td")[i].className += " current";
			}
			//alert('Row')
		}	
		
	}

	jsGrid.tableDblClick = function(e){	
		if(e.target==undefined){
			var target = e;
		}
		else{
			var target = e.target;
		}
		
		if(target.className.indexOf("tdContainer")!=-1){	
			var getCellIndex = target.cellIndex;
			var getRowIndex = target.parentNode.rowIndex;
			var getFormSelector = document.getElementById("gridView").getElementsByTagName("tr")[0].getElementsByTagName("td")[getCellIndex].getAttribute("data-type");
			var columnHead = document.getElementById("gridViewHead").getElementsByTagName("tr")[0].getElementsByTagName("td")[getCellIndex].getAttribute("data-name");		
			if(getFormSelector=="Check Box"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();
				var getOldValue = target.textContent.split(",");
				for(var k=0; k<nodeYArray[getCellIndex-2].length;k++){
					var label = document.createElement('label');
	                var br = document.createElement('br');
					var newELM = document.createElement("input");
					newELM.className = "input-check";
					newELM.type = "checkbox";
					if(getOldValue.indexOf(nodeYArray[getCellIndex-2][k])!=-1){
						newELM.checked = true;
					}
					newELM.value = nodeYArray[getCellIndex-2][k];	
					$("#editGridValue").append(newELM);
	                $("#editGridValue").append(document.createTextNode( " " + nodeYArray[getCellIndex-2][k]));
	                $("#editGridValue").append(br);
					$("#editGridLabel").text(columnHead);
				}
				var newHiddenGridNumber = document.createElement("input");
				newHiddenGridNumber.type = "hidden";
				newHiddenGridNumber.id = "myHiddenGridNumber";
				newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
				newHiddenGridNumber.setAttribute("data-col",getCellIndex);	
				newHiddenGridNumber.setAttribute("data-selector",getFormSelector);										
				$("#editGridValue").append(newHiddenGridNumber);
			}
			else if(getFormSelector=="Drop Down"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();			
				var getOldValue = target.textContent;
				var newELM = document.createElement("select");
				newELM.className = "form-select";
				for(var k=0; k<nodeYArray[getCellIndex-2].length;k++){
					var option = document.createElement("option");
					option.text = nodeYArray[getCellIndex-2][k];
					if(getOldValue==nodeYArray[getCellIndex-2][k]){
						option.selected = true;
					}
					newELM.appendChild(option);
				}
				$("#editGridValue").append(newELM);
				$("#editGridLabel").text(columnHead);
				var newHiddenGridNumber = document.createElement("input");
				newHiddenGridNumber.type = "hidden";
				newHiddenGridNumber.id = "myHiddenGridNumber";
				newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
				newHiddenGridNumber.setAttribute("data-col",getCellIndex);	
				newHiddenGridNumber.setAttribute("data-selector",getFormSelector);																			
				$("#editGridValue").append(newHiddenGridNumber);			
			}
			else if(getFormSelector=="Radio"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();
				var getOldValue = target.textContent.split(",");
				for(var k=0; k<nodeYArray[getCellIndex-2].length;k++){
					var label = document.createElement('label');
	                var br = document.createElement('br');
					var newELM = document.createElement("input");
					newELM.className = "input-check";				
					newELM.setAttribute('type', 'radio');
					newELM.setAttribute('value', nodeYArray[getCellIndex-2][k])				
					newELM.setAttribute('name', 'radio_'+getRowIndex+getCellIndex);
					if(getOldValue.indexOf(nodeYArray[getCellIndex-2][k])!=-1){
						newELM.checked = true;
					}				
					$("#editGridValue").append(newELM);
	                $("#editGridValue").append(document.createTextNode( " " + nodeYArray[getCellIndex-2][k]));
	                $("#editGridValue").append(br);
					$("#editGridLabel").text(columnHead);
					var newHiddenGridNumber = document.createElement("input");
					newHiddenGridNumber.type = "hidden";
					newHiddenGridNumber.id = "myHiddenGridNumber";
					newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
					newHiddenGridNumber.setAttribute("data-col",getCellIndex);	
					newHiddenGridNumber.setAttribute("data-selector",getFormSelector);																				
					$("#editGridValue").append(newHiddenGridNumber);				
				}
			}
			else if(getFormSelector=="Input"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();			
				var newELM = document.createElement("input");	
				newELM.setAttribute('type', 'text');
				newELM.className = "inline-input";
				newELM.value = target.textContent;
				newELM.style.width = "100%";			
				$("#editGridValue").append(newELM);	
				$("#editGridLabel").text(columnHead);
				var newHiddenGridNumber = document.createElement("input");
				newHiddenGridNumber.type = "hidden";
				newHiddenGridNumber.id = "myHiddenGridNumber";
				newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
				newHiddenGridNumber.setAttribute("data-col",getCellIndex);
				newHiddenGridNumber.setAttribute("data-selector",getFormSelector);									
				$("#editGridValue").append(newHiddenGridNumber);			
			}	
			else if(getFormSelector=="Text Area"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();			
				var newELM = document.createElement("textarea");	
				newELM.value = target.textContent;
				newELM.className = "inline-textarea";
				newELM.setAttribute("rows",5);
				newELM.style.width = "100%";			
				$("#editGridValue").append(newELM);	
				$("#editGridLabel").text(columnHead);
				var newHiddenGridNumber = document.createElement("input");
				newHiddenGridNumber.type = "hidden";
				newHiddenGridNumber.id = "myHiddenGridNumber";
				newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
				newHiddenGridNumber.setAttribute("data-col",getCellIndex);
				newHiddenGridNumber.setAttribute("data-selector",getFormSelector);									
				$("#editGridValue").append(newHiddenGridNumber);			
			}
			else if(getFormSelector=="Calendar"){
				$("#editGridDataModal").modal("show");
				$("#editGridValue").empty();			
				var newELM = document.createElement("input");	
				newELM.setAttribute('type', 'text');
				newELM.className = "inline-input datepicker";
				newELM.value = target.textContent;
				newELM.style.width = "100%";			
				$("#editGridValue").append(newELM);	
				$("#editGridLabel").text(columnHead);
				var newHiddenGridNumber = document.createElement("input");
				newHiddenGridNumber.type = "hidden";
				newHiddenGridNumber.id = "myHiddenGridNumber";
				newHiddenGridNumber.setAttribute("data-row",getRowIndex);	
				newHiddenGridNumber.setAttribute("data-col",getCellIndex);
				newHiddenGridNumber.setAttribute("data-selector",getFormSelector);									
				$("#editGridValue").append(newHiddenGridNumber);
				$("#editGridValue .datepicker").datepicker( "destroy" );
				$("#editGridValue .datepicker").datepicker();			
			}
			else if(getFormSelector=="File"){
				$("#file1").val("");
				$("#editGridDataModalUpload").modal("show");
				$("#editGridLabelUpload").text(columnHead);				
			}			
		}
	}

	jsGrid.saveData = function(){
		var getColumnNum = $("#myHiddenGridNumber").attr("data-col");
		var getRowNum = $("#myHiddenGridNumber").attr("data-row");	
		//var getFieldValidation = validationArray[getColumnNum-2];		
		var getSelectorType = $("#myHiddenGridNumber").attr("data-selector");		
		var getGridCell = document.getElementById("gridView").getElementsByTagName("tr")[getRowNum].getElementsByTagName("td")[getColumnNum];
		getFieldValidationFn = "fn_"+ getGridCell.getAttribute("data-property");
		getFieldValidation = validationArray.indexOf(getFieldValidationFn);
		var getInstanceID = $("#gridView tbody tr:eq("+(getRowNum-1)+")");
		var saveDATA = true;
		if(getSelectorType=="Check Box"){
			var selectedValues = $('#editGridValue input[type="checkbox"]:checked').map(function() {return this.value;}).get().join(',');
			if(getFieldValidation!=-1){
				if(selectedValues==undefined){
					selectedValues="";
				}
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}
		else if(getSelectorType=="Radio"){
			var selectedValues = $('#editGridValue input[type="radio"]:checked').val();
			if(getFieldValidation!=-1){			
				if(selectedValues==undefined){
					selectedValues="";
				}			
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}
		else if(getSelectorType=="Drop Down"){
			var selectedValues = $('#editGridValue select').val();
			if(getFieldValidation!=-1){
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}
		else if(getSelectorType=="Input"){
			var selectedValues = $('#editGridValue input[type="text"]').val();
			if(getFieldValidation!=-1){
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}
		else if(getSelectorType=="Text Area"){
			var selectedValues = $('#editGridValue textarea').val();
			if(getFieldValidation!=-1){
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}
		else if(getSelectorType=="Calendar"){
			var selectedValues = $('#editGridValue input[type="text"]').val();
			if(getFieldValidation!=-1){
				if(window[getFieldValidationFn](selectedValues)==false){
					return false;
				}
				else{
					getGridCell.textContent = selectedValues;
				}
			}
			else{
				getGridCell.textContent = selectedValues;
			}
		}

		$("#editGridDataModal").modal("hide");
		document.getElementById("gridView").focus();
		getGridCell.focus();

		if(getInstanceID.find("td:last").attr("data-instance")==undefined){

			getInstanceID.find("td").each(function(){
				var getText = $.trim($(this).text());
				var getPropID = $(this).attr("data-property");
				if(getPropID!=undefined){
					var fnName = "fn_"+getPropID;
					if(validationArray.indexOf(fnName)!=-1 && getText==""){
					 	$(this).css("background-color","#f2dede");
					 	saveDATA = false;
					}
					else{
						$(this).css("background-color","");
					}
				}
			})
		}
		resetGridHeaders();
		return saveDATA;
	}

	jsGrid.removeClass =function(node, cls){
		   if(node && node.className && node.className.indexOf(cls) >= 0) {
			var pattern = new RegExp('\\s*' + cls + '\\s*');
			node.className = node.className.replace(pattern, '');
		}
	}

	jsGrid.columnResize = function(e){	
		var getTable = document.getElementById("gridView");
		var getTableHead = document.getElementById("gridViewHead");	
		var resizer = document.createElement("div");
	    resizer.id = 'gtresizer';
		var gridLine = document.createElement("div");
	    gridLine.id = 'gridLine';
		var getElementExist = document.getElementById("gtresizer");
		if(getElementExist==null){
			document.getElementsByClassName("gridViewTable")[0].appendChild(resizer);
			document.getElementsByClassName("gridViewTable")[0].appendChild(gridLine);			
		}
		else{
			resizer = getElementExist;
			gridLine = document.getElementById("gridLine");
		}
		resizer.removeEventListener('mousedown', initDrag, false);	
		var leftPosition=0;
		var whichElm = e;
		var getHeaderLeft = Math.abs(parseInt(getTableHead.style.left));
		if(isNaN(getHeaderLeft)){
			getHeaderLeft = 0;
		}
		var getLeftOffset = $('#gridHeader').offset().left;
		var getTopOffset = $('#gridHeader').offset().top;
		getHeaderLeft = getHeaderLeft+5;		
		resizer.style.left = (e.offsetLeft + e.offsetWidth + getLeftOffset - getHeaderLeft) + "px";
//		resizer.style.top = e.offsetTop + "px";
		resizer.style.height = e.offsetHeight + "px";
		gridLine.style.top = (e.offsetTop+e.offsetHeight+getTopOffset+40) + "px";		
		resizer.onmousedown = initDrag;
		function initDrag(k) {
		   whichElm = e;
		   startX = k.clientX;
		   startY = k.clientY;
		   startWidth = parseInt(document.defaultView.getComputedStyle(whichElm).width, 10);
		   leftPosition = k.clientX;
		   document.documentElement.addEventListener('mousemove', doDrag, false);
		   document.documentElement.addEventListener('mouseup', stopDrag, false);	   
		}
		
		function doDrag(s) {
		   gridLine.style.display = "block";
		   jsGrid.mouseDown=1;
		   resizer.style.left = s.clientX + "px";
		   gridLine.style.left = s.clientX + "px";
		   s.preventDefault();
		}
		
		function stopDrag(m) {
			leftPosition = (m.clientX+startWidth)-leftPosition;
			if(leftPosition<0){
				leftPosition = 50;
			}
			whichElm.style.minWidth = leftPosition + 'px';
			var getCellIndex = whichElm.cellIndex;
			var getFirstTd =  getTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[getCellIndex];
			getFirstTd.style.minWidth = leftPosition + 'px';
			getFirstTd.style.width = leftPosition + 'px';
			whichElm.style.width = leftPosition + 'px';
			resizer.style.left = (whichElm.offsetLeft + whichElm.offsetWidth - 5) + "px";
			jsGrid.mouseDown = 0;
			gridLine.style.display = "none";
			document.documentElement.removeEventListener('mousemove', doDrag, false);    document.documentElement.removeEventListener('mouseup', stopDrag, false);
			resetGridHeaders();
		}			
	};

jsGrid.showGridFullLoader = function(){
  $('#grid_full_page_loader').fadeIn('fast', function () {
    $('#grid_full_page_loader').addClass('loader-fade-in'); // Animation complete. 
  });
}
            
jsGrid.hideGridFullLoader = function(){
  $('#grid_full_page_loader').removeClass('loader-fade-in');
  $('#grid_full_page_loader').fadeOut('fast');
} 	


jsGrid.updateHiddenCols = function(){

	setTimeout(function(){
	$("#showHideGridHeads ul.drp-menu li").each(function(){

		if($(this).find(".grid-icon").hasClass("no")){
			var getColNum = $(this).index();
			var className = "col"+getColNum;
			$("#gridView tbody ."+className).hide();
		}

	});
	})

}


	return jsGrid;
});

function resetGridHeaders(){
$("#gridView tbody tr:first td").each(function(i){
			if($(this).outerWidth()>=$("#gridViewHead thead tr:first td:eq("+i+")").outerWidth()){
				var getWidth = $(this).outerWidth();
				if(i==0 || i==1){
					getWidth = 35;
				}
				$(this).css("min-width",getWidth+"px").css("width",getWidth);
				$("#gridViewHead thead tr:first td:eq("+i+")").css("min-width",getWidth+"px").css("width",getWidth);
			}
			else{
				var getWidth = $("#gridViewHead thead tr:first td:eq("+i+")").outerWidth();	
				if(i==0 || i==1){
					getWidth = 35;
				}					
				$(this).css("min-width",getWidth+"px").css("width",getWidth);
				$("#gridViewHead thead tr:first td:eq("+i+")").css("min-width",getWidth+"px").css("width",getWidth);
			}
		});
		//setGridScrollBars();
}
