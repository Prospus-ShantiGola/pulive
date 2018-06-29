self.addEventListener('message', function(e) {
	if(e.data.type=="outline"){
	  	for(var i=e.data.start; i<=e.data.length-1;i++){
			postMessage(i);
		}
	}		
	
}, false);
