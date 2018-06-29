var gulp = require('./node_modules/gulp');
var concat = require('./node_modules/gulp-concat');
var rename = require('./node_modules/gulp-rename');
var uglify = require('./node_modules/gulp-uglify');
var order = require("./node_modules/gulp-order");
var autoprefixer = require("./node_modules/gulp-autoprefixer");
var cleanCSS = require('gulp-clean-css');

gulp.task('mj5', function() {
  return gulp.src(["./jquery-1.9.1.js",
  "./jquery-ui.js",
  "./socket.js",
  "./store.min.js",
  "./jquery.Jcrop.min.js",
  "./bootstrap.min.js",
  "./jquery.nanoscroller.js",
  "./jquery.nicescroll.min.js",
  "./../../puidata/js/dropzone.js",
  "./browser.js",
  "./nprogress.js",
  "./bootbox.min.js",
  "./rangy-core.js",
  "./rangy-cssclassapplier.js",
  "./resizesensor.js",
  "./jquery.highlight.js",
  "./editor.js",
  "./classes.js",
  "./algorithm.js",
  "./jquery.mjs.nestedSortable.js",
  "./course-dialogue-chat.js",
  "./course-dialogue.js",
  "./script_all.js",
  "./jquery.autocomplete.min.js",  
  "./moment.min.js",
  "./footer.js",
  "./../../puidata/js/dialogue.js", 
  "./../../puidata/js/circularloader.js"])
  .pipe(order(["jquery-1.9.1.js",
  "jquery-ui.js",
  "socket.js",
  "store.min.js",
  "jquery.Jcrop.min.js",
  "bootstrap.min.js",
  "jquery.nanoscroller.js",
  "jquery.nicescroll.min.js",
  "../../puidata/js/dropzone.js",
  "browser.js",
  "nprogress.js",
  "bootbox.min.js",
  "rangy-core.js",
  "rangy-cssclassapplier.js",
  "resizesensor.js",
  "jquery.highlight.js",
  "editor.js",
  "classes.js",
  "algorithm.js",
  "jquery.mjs.nestedSortable.js",
  "course-dialogue-chat.js",
  "course-dialogue.js",
  "script_all.js",
  "jquery.autocomplete.min.js",  
  "moment.min.js",
  "footer.js",
  "../../puidata/js/dialogue.js",
  "../../puidata/js/circularloader.js"
  ], { base: './' }))
    .pipe(concat('mj5.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('dj5', function() {
  return gulp.src(["autosize.js",
  "jquery.timeentry.js",
  "../../puidata/js/plugin_minidialogue.js",
  "bootstrap-filestyle.min.js",
  "timeline.js",
  "jquery.fixedTblHdrLftCol.js",
  "jquery-event-drag.js",
  "elementqueries.js",
  "get-table-data.js",
  "table.js",
  "custom-script.js",
  "account.js",
  "package.js",
  "calendar-script.js",
  "script_extended.js",  
  "../../puidata/js/chat.js"])
  .pipe(order(["autosize.js",
  "jquery.timeentry.js",
  "../../puidata/js/plugin_minidialogue.js",
  "bootstrap-filestyle.min.js",
  "timeline.js",
  "jquery.fixedTblHdrLftCol.js",
  "jquery-event-drag.js",
  "elementqueries.js",
  "get-table-data.js",
  "table.js",
  "custom-script.js",
  "account.js",
  "package.js",
  "calendar-script.js",
  "script_extended.js",  
  "../../puidata/js/chat.js"], { base: './' }))
    .pipe(concat('dj5.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('css', function() {
return gulp.src(['../css/nprogress.css',
'../css/bootstrap.min.css',
'../css/jquery-ui.css',
'../css/jquery.Jcrop.min.css',
'../css/nanoscroller.css',
'../css/dialog.css',
'../css/poms-custom.css',
'../css/table.css',
'../css/editor.css',
'../css/browser.css',
'../css/splash.css',
'../css/style.css',
'../css/new-style.css',
'../css/responsive.css',
'../../puidata/css/dropzone.css'])
  .pipe(order(['css/nprogress.css',
'css/bootstrap.min.css',
'css/jquery-ui.css',
'css/jquery.Jcrop.min.css',
'css/nanoscroller.css',
'css/dialog.css',
'css/poms-custom.css',
'css/table.css',
'css/editor.css',
'css/browser.css',
'css/splash.css',
'css/style.css',
'css/new-style.css',
'css/responsive.css',
'../puidata/css/dropzone.css'], { base: '../' }))
    .pipe(concat('mj5.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('../css/'));
});

