$(document).ready(function () {
	SetScreenHig();
});


$(window).resize(function(){
	SetScreenHig();
})

function SetScreenHig(){
	var WinHig = $(window).height();
	$('.setScreenHt').height(WinHig);
}



