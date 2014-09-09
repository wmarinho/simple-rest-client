/*
Usage:
<script type="text/javascript" language="javascript" src="bpm-init-app.js?v=0.1"></script>
*/

$( document ).ajaxStart(function() {
	$( "#loading" ).show();
});

$( document ).ajaxStop(function() {
	$( "#loading" ).hide();
});

$(document).ready(function () {

    var url = $('.navbar-brand').attr('href') !== "#" ? 
		$('.navbar-brand').attr('href') : window.location.href;
   
    $('#qrcode').ClassyQR({
        create : true,
        type : 'url',
        size: '90',
        url : encodeURIComponent(url)
    });
	
	
	
	$("a[href^='#/']").each(function () {
		var view = $(this).attr('href');
		view = view.replace("#","");
		var prefix = "endpoint";
		var endpoint = $(this).attr('data-endpoint');
		console.log(prefix + view);
		
		$(this).bpmApi({
			endpoint : endpoint,	
			templateUrl : prefix + view,
			target : "data-view",
			prefix : prefix
		 }); 	
	});
	
	url_arr = window.location.href.split('#');
	
	if ( url_arr[1] !== "" ) {
		$("a[href='#"+url_arr[1]+"']").click();
	}
	

});



