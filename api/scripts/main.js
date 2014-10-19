$( document ).ajaxStart(function() {
	$( "#loading" ).show();
});

$( document ).ajaxStop(function() {
	$( "#loading" ).hide();
});

$( document ).ready(function () {

    var url = $('.navbar-brand').attr('href') !== "#" ? 
		$('.navbar-brand').attr('href') : window.location.href;
   
   $('#qrcode').qrcode({
        "render" : "image",
        "size": 80,
        "color": "#000",
        "text" : url
    });
	
	$(".rest-client").restClient();
	
	url_arr = window.location.href.split('#');
	
	if ( url_arr[1] !== "" ) {
		$("a[href='#"+url_arr[1]+"']").click();
	}
	

});