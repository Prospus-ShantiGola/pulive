<div id="gridContainer" ng-app="gridStructure" ng-controller="getGridData">
    <div id="gridHeader">
        <div id="gridResult" class="gridHeadCol hide"></div>
        <div id="showHideGridHeads" class="gridHeadCol">
            <div class="row">
                <div class="col-lg-12">
                    <div class="button-group">
                        <a class="dropdown-toggle" data-toggle="dropdown"> <span class="grid-icon view"  data-toggle="tooltip" data-placement="top" title="Show/Hide Columns"></span>
                        </a>
                        <div class="customScroll dropdown-menu">
                            <ul class="drp-menu">
                                <li ng-repeat="x in structure">
                                    <a href="javascript:void(0)" class="small" data-value="{{x}}" tabIndex="-1" ng-click="hideShowColumns($index,$event)">
                                        <span class="grid-icon yes"></span>
                                        <span class="class-title">{{x}}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="clearGridFilter" class="gridHeadCol"><span class="grid-icon reset"  data-toggle="tooltip" data-placement="top" title="Reset Filter" ng-click="resetFilter()"></span></div>
        
    </div>
    <div class="gridViewTable">
        <table cellpadding="0" cellspacing="0" id="gridViewHead" class="unselectable gridViewSt" tabindex=0>
            <thead class="filter-plugin">
                <tr>
                    <td><span id="addNewRow" class="grid-icon add"></span></td>
                    <td>#</td>
                    <td class="resizable filter-menu col{{$index}}" ng-repeat="x in structure" id="{{'st_' + structureDataArr[$index]}}" data-type="{{dataType[$index]}}" data-name="{{x}}">
                        {{x}} &nbsp; <span class="open-filter-menu"><i class="fa fa-angle-down"></i></span>
                        <ul aria-labelledby="dLabel" role="menu" class="dropdown-menu multi-menu">
                            <li class="sort-by" ng-click="sortlist(structureDataArr[$index],false)">Sort A - Z</li>
                            <li class="sort-by" ng-click="sortlist(structureDataArr[$index],true)">Sort Z - A</li>
                            <li class="parent-item">
                                Text Filters <i class="fa fa-angle-right"></i>
                                <ul class="multi-sub-menu dropdown-menu">
                                    <li class="sub-filter">Equals To</li>
                                    <li class="sub-filter">Not Equals To</li>
                                    <li class="sub-filter">Begins With</li>
                                    <li class="sub-filter">Ends With</li>
                                    <li class="sub-filter">Contains</li>
                                    <li class="sub-filter">Does Not Contain</li>
                                </ul>
                            </li>
                            <div class="search-item-wrap">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Search" value="" ng-model="filters.structureData[$index]">
                                    <span class="input-group-btn">
                                    <button class="btn btn-default entr-filter" type="button" ng-click="search(filters.structureData[$index],structureDataArr[$index])"></button>
                                    </span>
                                </div>
                                <!-- /input-group -->
                            </div>
                        </ul>
                    </td>
                </tr>
            </thead>
        </table>
    </div>
    <div class="customScroll gridViewTable gridViewTable-HT">
        <table cellpadding="0" cellspacing="0" id="gridView" class="unselectable gridViewSt" tabindex=0>
            <tbody>
                <tr ng-repeat="x in arrgetRecords | orderBy:sortorder:reverse | filter:filterVal:filterStrict as result" my-repeat-directive>
                    <td class="index"><span ng-click="deleteData($event)" class="grid-icon delete"></span></td>
                    <td class="index">{{ $index+1 }}</td>
                    <td class="tdContainer col{{$index}}" ng-repeat="z in result[$index]" data-property="{{ structureDataArr[$index] }}" data-type="{{dataType[$index]}}" data-instance="{{result[$parent.$parent.$index].instanceID}}" ng-if="!$last">{{z}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
       // jsGrid.start();
    </script>
    <div id="editGridDataModal" class="modal fade plugin-custom-modal" role="dialog">
        <div class="modal-dialog small-modal">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title" id="editGridLabel"></h4>
                </div>
                <div class="modal-body">
                    <div class="">
                        <div class="form-group">
                            <div id="editGridValue">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-black" id="gridSave" ng-click="saveData()">Save</button>
                    <button type="button" class="btn btn-black" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <div id="editGridDataModalUpload" class="modal fade plugin-custom-modal" role="dialog" ng-controller="fupController">
        <div class="modal-dialog small-modal">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title" id="editGridLabelUpload"></h4>
                </div>
                <div class="modal-body">
                    <div class="">
                        <div class="form-group">                                    
                            <div>
                                <input type="file" id="file1" class="filestyle" name="file" ng-files="getTheFiles($files)"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-black" ng-click="uploadFiles()">Upload</button>
                    <button type="button" class="btn btn-black" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>            
    <div id="grid_full_page_loader" class="loader-wrapper" >
        <div class="loader-bg">
            <div class="loader"></div>
        </div>
    </div>
    <div id="loadGridScript"></div>
</div>