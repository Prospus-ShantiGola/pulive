 if(typeof jQuery!="function"){
		    var myjQueryElement = document.createElement("script");
		    myjQueryElement.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js";
		    document.body.appendChild(myjQueryElement);
		    var setjQueryInterval = setInterval(function(){
		      if(typeof jQuery=="function"){
		          clearInterval(setjQueryInterval);
		          loadBootstrapManual();
		      }
		    },100)
		  }
		  else{
		    loadBootstrapManual();
		  }

		  function loadBootstrapManual(){
		  	
		  


		  if(!(typeof $().modal == 'function')){
		    var myElement = document.createElement("script");
		    var myCSSElement = document.createElement("link");
		    var myFONTElement = document.createElement("link");
		    var myCSSElementanimation = document.createElement("link");
		    
		    myCSSElement.rel = "stylesheet";  
		    myCSSElement.type = "text/css";

		    myFONTElement.rel = "stylesheet";  
		    myFONTElement.type = "text/css";    
		    
		    myCSSElementanimation.rel = "stylesheet";  
		    myCSSElementanimation.type = "text/css";  
		    
		    myCSSElement.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";
			myFONTElement.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css";
			myCSSElementanimation.href = "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.4.0/animate.min.css";
		    myElement.src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js";
		    
		    document.getElementsByTagName("head")[0].appendChild(myCSSElement);
		    document.getElementsByTagName("head")[0].appendChild(myFONTElement);
		    document.getElementsByTagName("head")[0].appendChild(myCSSElementanimation);
		    document.body.appendChild(myElement);
		  }
		  var myTutorialElement = document.createElement("script");
		  myTutorialElement.src = base_plugin_url+"js/bootbite.js";
		  document.body.appendChild(myTutorialElement);

          var myFileElement = document.createElement("script");
          myFileElement.src = base_plugin_url+"js/bootstrap-filestyle.min.js";
          document.body.appendChild(myFileElement);


		  // var customeScroll = document.createElement("script");
		  // customeScroll.src = base_plugin_url+"component/CustomScroll/jquery.mCustomScrollbar.min.js";
		  // document.body.appendChild(customeScroll);

		  // var ellipsesJS = document.createElement("script");
		  // ellipsesJS.src = base_plugin_url+"component/Ellipses/jquery.dotdotdot.js";
		  // document.body.appendChild(ellipsesJS);

		  /*var commonScript = document.createElement("script");
		  commonScript.src = base_plugin_url+"component/common-script.js";
		  document.body.appendChild(commonScript);*/

		  var sidebarJS = document.createElement("script");
		  sidebarJS.src = base_plugin_url+"js/sidebar-menu.js";
		  document.body.appendChild(sidebarJS);
// var flyoutJS = document.createElement("script");
		  // flyoutJS.src = base_plugin_url+"component/Flyout/jquery.flyout.js";
		  // document.body.appendChild(flyoutJS);

		  
		}