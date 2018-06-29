app.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ]);

app.controller('fupController', function ($scope, $http) {

            var formdata = new FormData();
            $scope.getTheFiles = function ($files) {
                angular.forEach($files, function (value, key) {
                    formdata.append(key, value);
                });
            };

            // NOW UPLOAD THE FILES.
            $scope.uploadFiles = function () {
                jsGrid.showGridFullLoader();
                var instanceID = $("#gridView .current").attr("data-instance");

                if(instanceID==undefined){
                   instanceID = "" ;
                }

                var propertyID = $("#gridView .current").attr("data-property");
                var newpropertyID = propertyID.split("_key");
                propertyID = newpropertyID[0];
                var request = {
                    method: 'POST',
                    url: domainGridUrl+"puidata/page_plugin/code.php?action=uploadfile&classID="+class_node_id+"&instanceID="+instanceID+"&propertyID="+propertyID,
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };

                // SEND THE FILES.
                $http(request)
                    .success(function (d) {
                        $("#editGridDataModalUpload").modal("hide");
                        $scope.LoadData(class_node_id);
                    })
                    .error(function () {
                    });
            }
        });