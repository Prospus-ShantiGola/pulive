<?php $filename = str_replace('.php','',basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING'])); ?>
<ul>
   <li><a href="javascript:void(0);"  class="active"><i class="Icon dashboard-green"></i></a></li>
   <li><a href="javascript:void(0);"><i class="Icon chanel-green"></i></a></li>
   <li><a href="javascript:void(0);"><i class="Icon user-green"></i></a></li>
   <li><a href="javascript:void(0);"><i class="Icon resources-green"></i></a></li>
   <li class="fixed-Icon">
     <a href="javascript:void(0);"><i class="Icon calendar-green"></i></a>
     <a href="javascript:void(0);"><i class="Icon setting-green"></i></a>
   </li>
</ul>
<div class="main-menu-wrap">
  <div class="shortcut-icon-wrap menu-flyout-open" data-flyout='nav'>
    <ul>
       <li><a href="javascript:void(0);"><i class="Icon action-green"></i></a></li>
       <li><a href="javascript:void(0);"><i class="Icon view-green"></i></a></li>
       <li><a href="javascript:void(0);"><i class="Icon filter-green"></i></a></li>
    </ul>
  </div>
  <!-- <div class="menu-flyout-overlay"></div> -->
  <div class="menu-flyout" id="nav">

    <ul class="left-action-detail-pane custom-scroll">
          <li>
              <div class="input-group">
                <input type="text" class="form-control input-box-field form-box-green-style" placeholder="Search for...">
                <span class="input-group-btn">
                  <button class="btn btn-light-green" type="button"><i class="Icon search-green"></i></button>
                </span>
              </div>
          </li>
          <li>
              <div class="panel-group" id="nav-accordion" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                  <div class="panel-heading" role="tab" id="headingOne">
                    <h4 class="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion1" href="#Actions" aria-expanded="true" aria-controls="Actions">
                        <i class="Icon action-green"></i><span>Actions</span>
                      </a>
                    </h4>
                  </div>
                  <div id="Actions" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingActions">
                    <div class="panel-body">
                        <ul>

                          <li><a href="new-course.php" class="<?php if(trim($filename) == 'new-course') echo 'active';?>">New Course</a></li>
                          <li><a href="#">Archieve Course</a></li>
                          <li><a href="#">Close Course</a></li>
                        </ul>
                    </div>
                  </div>
                </div>
                <div class="panel panel-default">
                  <div class="panel-heading" role="tab" id="headingTwo">
                    <h4 class="panel-title">
                      <a class="" role="button" data-toggle="collapse" data-parent="#accordion1" href="#Views" aria-expanded="true" aria-controls="Views">
                        <i class="Icon view-green"></i><span>Views</span>
                      </a>
                    </h4>
                  </div>
                  <div id="Views" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingViews">
                    <div class="panel-body">
                      <ul>
                          <li><a href="index.php" class="<?php if(trim($filename) == 'index') echo 'active';?>">By Course</a></li>
                          <li><a href="by-dialogue.php" class="<?php if(trim($filename) == 'by-dialogue') echo 'active';?>">By Dialogue</a></li>
                          <li><a href="by-actor.php" class="<?php if(trim($filename) == 'by-actor') echo 'active';?>">By Actor</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="panel panel-default">
                  <div class="panel-heading" role="tab" id="headingThree">
                    <h4 class="panel-title">
                      <a class="" role="button" data-toggle="collapse" data-parent="#accordion1" href="#Filters" aria-expanded="true" aria-controls="Filters">
                        <i class="Icon filter-green"></i><span>Filters</span>
                      </a>
                    </h4>
                  </div>
                  <div id="Filters" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingFilters">
                    <div class="panel-body">
                      <ul>
                          <li><a href="#">Waiting on someone else</a></li>
                          <li><a href="#">Tags</a></li>
                          <li><a href="#">Archeived Course</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
          </li>
    </ul>
    <div class="menu-actionbar">
      <ul>
        <li class="menu-flyout-close" data-flyout='nav'><a href="javascript:void(0);"><i class="Icon close-white"></i></a></li>
        <li class="pin-slide fixed-Icon" data-flyout='nav'><a href="javascript:void(0);"><i class="Icon pin"></i></a></li>        
      </ul>
    </div>    
  </div>
</div>