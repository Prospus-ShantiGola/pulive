<?php include 'includes/layout/header.php';?>
  <section>
    <div class="flex-container">

      <div class="flex-item left-action-bar" id="navigationPane">
        <?php include 'includes/layout/navigation.php';?>
      </div>
      
      <div class="flex-item control-panel">
        <?php include 'includes/layout/theme.php';?>          
      </div>
      
      <div class="flex-item half-pane" id="leftPane"> 
        <?php include 'includes/new-course/new-course.php';?>
      </div>

      <div class="flex-item half-pane" id="rightPane">   
        <?php include 'includes/new-course/new-course-detail.php';?>     
      </div>

      <div class="flex-item right-action-bar">
        <?php include 'includes/layout/right-panel.php';?>
      </div>   

    </div>
  </section>
  <footer class="footer">
    <?php include 'includes/layout/footer.php';?>
  </footer>
  </body>
</html>
