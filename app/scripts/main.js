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
        "width" : "100",
        "height": 100,
        "color": "#3a3",
        "text" : encodeURIComponent(url)
    });

	function correiocontrolcep (data) {
		console.log(data);
	}
	
	$("a[href^='#/']").each(function () {
		var view = $(this).attr('href');
		view = view.replace("#","");
		var templateUrl = "partials" + view;	
		var prefix = "";
		var endpoint = $(this).attr('data-endpoint');
		
		
		$(this).restClient({
			endpoint : endpoint,	
			templateUrl : templateUrl,
			dataType : 'json',
			target : "data-view",
			prefix : prefix
		 }); 	
	});
	
	url_arr = window.location.href.split('#');
	
	if ( url_arr[1] !== "" ) {
		$("a[href='#"+url_arr[1]+"']").click();
	}
	
	$("input[data-endpoint]").each( function () {
			var endpoint = $(this).attr('data-endpoint'),
					field = $(this).attr('data-get'),
					template = $(this).attr('data-template'),
					target = $(this).attr('data-get-info'),
					type = $(this).attr('type');

			$(this).restClient({
					endpoint : endpoint,
					field : field,
					objType : type,
					query : "",
					target: target,
					prefix: "",
					onSelected : function (obj, data) {
							
							$.each(data, function (idx, val) {
									$("input[data-set='"+ idx +"']").val(val);
							});
			 }
			});
	});

});