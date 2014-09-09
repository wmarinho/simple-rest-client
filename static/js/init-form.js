/*
Usage:
<script type="text/javascript" language="javascript" src="api/bpm-init-form.js?v=0.1"></script>
*/

$("input[bpm-endpoint]").each( function () {
	var endpoint = $(this).attr('bpm-endpoint'),
		field = $(this).attr('bpm-get'),
		template = $(this).attr('bpm-template'),
		target = $(this).attr('bpm-get-info'),
		type = $(this).attr('type');
	
	$(this).bpmApi({
		endpoint : endpoint,
		field : field,
		objType : type,
		query : "",
		target: target,
		prefix: "",
		template : template,
		onSelected : function (obj, data) {			
			$.each(data, function (idx, val) {				
				$("input[bpm-set='"+ idx +"']").val(val);
			});
	 }
	});
});
