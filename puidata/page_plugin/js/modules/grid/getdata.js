//var domainGridUrl = "http://localhost/PUI/"; // Do comment.
//var class_node_id = getQuerystring("class"); // Do comment

var app = angular.module('gridStructure', []);
app.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){      
      	setTimeout(function(){	  
      	jsGrid.updateHiddenCols();
		jsGrid.hideGridFullLoader(); 
    	setGridScrollBars();
		resetGridHeaders();
    	},200)
    }
  };
});

app.controller('getGridData', function($scope, $http) {
	$scope.LoadData = function(getClassID){
	jsGrid.showGridFullLoader();	
    $http.get(domainGridUrl+"puidata/page_plugin/code.php?action=getClassInstances&nodeId="+getClassID+"")
    .then(function (response) {
		if(response.data.structure[0]==null){
			document.getElementById("gridloader").style.display="none";	
			document.getElementById("gridResult").innerHTML="Invalid Class Structure";
			return false;
		}
		$scope.reverse = true;
		var classID = response.data.structure[0].classId;
		$scope.structure = response.data.structure[0].caption;
		$scope.properties = response.data.structure[0].properties;
		$scope.propertiesKeys = Object.keys($scope.properties);
		$scope.getRecords = response.data.records[0];
		$scope.structureData = Object.keys($scope.structure);
		$scope.structureDataArr =  angular.copy($scope.structureData);
		var getKeyLength = $scope.structureData.length;
		$scope.records = [];
		$scope.instanceIds = Object.keys($scope.getRecords);
		var countINSTANCE = 0;
		for(x in $scope.getRecords){
			var tempObject={};
			for(var s=0;s<getKeyLength; s++){
				var getKey = $scope.getRecords[x][$scope.structureData[s]];
				if(getKey==undefined){
					tempObject[$scope.structureData[s]] = "";
				}
				else{
					tempObject[$scope.structureData[s]] = getKey;
				}
				
			}
			tempObject["instanceID"] = $scope.instanceIds[countINSTANCE];
			$scope.records.push(tempObject);			
			countINSTANCE = countINSTANCE + 1;			
		}	

		$scope.arrgetRecords = Object.keys($scope.records).map(function(key) {
    	return $scope.records[key];
  		});

		$scope.dataType = [];
		document.getElementById("loadGridScript").innerHTML = "";
		validationArray = [];
		nodeYArray = [];
		for(x in $scope.properties){
			var getDataType = $scope.properties[x].nodeZStructure["FORM SELECTOR"];
			var getValidation = $scope.properties[x].nodeZStructure.VALIDATION;	
			var getNodeYInstanceValue = $scope.properties[x].nodeClassYInstanceValue;
			if(getDataType!=undefined){
				var getDataTypeValue = getDataType[0].value;
				$scope.dataType.push(getDataTypeValue);
			}
			else{
				$scope.dataType.push("");
			}
			
			if(getValidation!=undefined){
				var getScriptContainer = document.getElementById("loadGridScript");
				var getValidationValue = getValidation[0].value;
				if(getValidationValue!="--"){
					var newScript = document.createElement("script");
					var regex = /function ([^(]*)/gm;					
					var functionName = getValidationValue.match(regex);
					if(functionName!=null){						
						var getFunctionName = functionName[0].replace("function","").trim();
						var tempX = x;
						tempX=tempX.replace(/'/g,"");
						var newFunctionName = "fn_"+tempX;
						getValidationValue = getValidationValue.replace(getFunctionName,newFunctionName);
						newScript.innerHTML = getValidationValue;
						getScriptContainer.appendChild(newScript);
						if(functionName!=null){
						validationArray.push(newFunctionName);
						}
					}
					else{
					validationArray.push("");
					}	
				}				
			}
			
			if(getNodeYInstanceValue.length!=0){
				nodeYArray.push(getNodeYInstanceValue);
			}
			else{
				nodeYArray.push("");
			}
						
		}

							
		var TotalRowsResult = "Result Count: " + Object.keys($scope.getRecords).length;;
		document.getElementById("gridView").style.display="block";
		document.getElementById("gridViewHead").style.display="block";
		document.getElementById("gridResult").innerHTML=TotalRowsResult;			
		document.getElementById("gridHeader").style.display="block";					

		$scope.resetFilter = function(){
			$scope.sortorder = undefined;
            $scope.reverse = true;
            $scope.filterVal = {};
            $scope.filterStrict = false;
            $(".customScroll.gridViewTable").mCustomScrollbar("scrollTo",0);
            setTimeout(function(){
				resetGridHeaders();	
			})
		}

 		$scope.sortlist = function (order,reverse) {
            $scope.sortorder = "'"+order+"'";
            $scope.reverse = reverse;
            $(".dropdown-menu.multi-menu.show").removeClass("show");
            setTimeout(function(){
				resetGridHeaders();	
			})
         };
        $scope.filterVal = {};
        $scope.filterStrict = false;
		$scope.search = function (str,from) {
			var getSearchType = $(".dropdown-menu.multi-menu.show .show-sub-child li:first").text();
			if(getSearchType=="Equals"){
			 $scope.filterVal[from] = str;
			 $scope.filterStrict = true;
			}
			else if(getSearchType=="Does not Equal"){
			 $scope.filterVal[from] = '!'+str;
			 $scope.filterStrict = true;
			}
			else if(getSearchType=="Contains"){
			 $scope.filterVal[from] = str;
			 $scope.filterStrict = false;			 
			}
			else if(getSearchType=="Does Not Contains"){
			 $scope.filterVal[from] = '!'+str;
			 $scope.filterStrict = false;
			}
			else if(getSearchType=="Begins With"){
			 $scope.filterVal[from] = str;
			 	$scope.beginsWith = function (actual, expected) {
				    var lowerStr = (actual + "").toLowerCase();
				    return lowerStr.indexOf(expected.toLowerCase()) === 0;
				}     
				$scope.filterStrict  = $scope.beginsWith;
			}
			else if(getSearchType=="Ends With"){
			 $scope.filterVal[from] = str;
			 	$scope.endsWith = function (actual, expected) {
				    var lowerStr = (actual + "").toLowerCase();
				    lowerStr = lowerStr.split("").reverse().join("");
				    expected = expected.split("").reverse().join("");
				    return lowerStr.indexOf(expected.toLowerCase()) === 0;
				}     
				$scope.filterStrict  = $scope.endsWith;
			}									
			
			$(".dropdown-menu.multi-menu.show").removeClass("show");
			setTimeout(function(){
				resetGridHeaders();	
			})		 
         };            

         $scope.hideShowColumns = function(classNum,$event){
         	$event.stopPropagation();
         	var className = "col"+classNum;  
         	if($($event.currentTarget).find(".grid-icon").hasClass("yes")){
         		$("#gridViewHead ."+className).hide();
         		$("#gridView ."+className).hide();
         		$($event.currentTarget).find(".grid-icon").addClass("no").removeClass("yes");
         	}
         	else{
         		$("#gridViewHead ."+className).show();
         		$("#gridView ."+className).show();
         		$($event.currentTarget).find(".grid-icon").addClass("yes").removeClass("no");
         	}
         	resetGridHeaders();
         	setGridScrollBars();
         }

		$scope.saveData = function(){
			if(jsGrid.saveData()){
				jsGrid.saveData();
			}
			else{
				return false;
			}
			var instanceID = $("#gridView .current").attr("data-instance");
			var propertyID = $("#gridView .current").attr("data-property");
			var newpropertyID = propertyID.split("_key");
			propertyID = newpropertyID[0];
			var propertyType = $("#gridView .current").attr("data-type");	
			var propertyValue = $("#gridView .current").text();
			var sendObj = [];
			var recordAction = "save";
			var tempRecords={};
			if(instanceID==undefined){
				$("#gridView .current").parent("tr").find("td").each(function(index){
					var propertyID = $(this).attr("data-property");
					var propertyType = $(this).attr("data-type");
					var propertyValue = $(this).text();	
					if(propertyID!=undefined){
						var newpropertyID = propertyID.split("_key");
						propertyID = newpropertyID[0];						
						recordAction = "new";
						sendObj.push({classID:classID,instanceID:instanceID,propertyType:propertyType,propertyID:propertyID,propertyValue:propertyValue,actionType:"newrecord"});
						tempRecords[propertyID] = propertyValue;
						jsGrid.showGridFullLoader();
					}
				})
			}
			else{
			sendObj.push({classID:classID,instanceID:instanceID,propertyType:propertyType,propertyID:propertyID,propertyValue:propertyValue,actionType:"save"});
			}
			sendObj = JSON.stringify(sendObj);
	        var request = {
	            method: "post",
	            url: domainGridUrl+'puidata/page_plugin/code.php?action=manageInstanceBySpreadsheet',
	            data: sendObj
        	}

        	$http(request).then(function(){
	        		if(recordAction=="new"){
	        			$scope.LoadData(class_node_id);
	        			$("#gridView tbody .gridNewRow:last").remove();	        			
	        		}
        		},
        		function(){
        		alert("Some Error Occurred");
        	});
		}

		$scope.deleteData = function($event){
			var goDelete = false;
			bootbox.confirm({ 
				title:"Confirm",
				message: "Are you sure you want to cancel?", 
				callback: function(result) {

					if(result){
						var getTable = document.getElementById("gridView");
						var instanceID = $($event.target).closest("tr").find("td:last").attr("data-instance");
						var sendObj = [];
						sendObj.push({actionType:"delete",instanceID:instanceID});
						sendObj = JSON.stringify(sendObj);
						jsGrid.showGridFullLoader();
						var request = {
				            method: "post",
				            url: domainGridUrl+'puidata/page_plugin/code.php?action=manageInstanceBySpreadsheet',
				            data: sendObj
			        	}

			        	$http(request).then(function(){
			        		jsGrid.deleteRow($event.target);
			        		$scope.LoadData(class_node_id);
			        		},
			        		function(){
			        		alert("Some Error Occurred");
			        	});
					}
				}

			});
		}
	});
}	
$scope.LoadData(class_node_id);
});

function getQuerystring(name) {
	url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
  

  
// Copy End