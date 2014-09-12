/*
	Wellington Marinho <wpmarinho@globo.com>
*/

;(function ( $, window, document, undefined ) {

		// Create the defaults once
		
		var pluginName = "restClient",
				defaults = {
				endpoint: "",
				prefix: "",
				query: null,
				template: null,				
				templateUrl: null,				
				target: null,
				objType: null,
				dataType: "json",
				onLoad: null
		};

		// The actual plugin constructor
		function restClient ( element, options ) {
				this.element = element;

				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.data = [];
				this.settings.endpoint = this.settings.endpoint || $(this.element).attr('data-endpoint');
				if ( this.settings.endpoint !== undefined && this.settings.endpoint !== "") {
						this.init();
				}
				
		}

		$.extend(restClient.prototype, {
				init: function () {
					
					
					
					var view = $(this.element).attr('href'),
						view_template = $(this.element).attr('data-template');
					
					if ( view !== "" && view !== undefined) {
						view = view.replace("#","");
						this.settings.objType = "link";
					} else if ( view_template !== "" && view_template !== undefined ) {
						view = view_template;
					}
					
					
					this.settings.templateUrl = this.settings.templateUrl || "partials" + view;
						
					
					this.settings.field = this.settings.field || $(this.element).attr('data-get');
					this.settings.objType = this.settings.objType || $(this.element).attr('data-type');
					this.settings.query = this.settings.query || $(this.element).attr('data-query') || '?' + this.settings.field + '=%QUERY' ;
					this.settings.target = this.settings.target || $(this.element).attr('data-target') || "data-view";
				
				
					if ( this.settings.endpoint !== undefined) {
						this.connectEndpoint();
					}
						
				},
				connectEndpoint: function () {					
				 //console.log(this.settings);		
					if ( this.settings.objType === "suggestion" ) {
						this.getSuggetion();
					} else if ( this.settings.objType === "link" && this.settings.target !== null) {
						var obj = this;	
						
						$(this.element).click ( function () {
							$('#' + obj.settings.target).html("");
							obj.getData();
						});  
					} else {
						console.log("Not implemented yet");
					}
				},
				getData: function () {
					var obj = this;
					
					$.ajax({ 
						url: this.settings.prefix + this.settings.endpoint, 
						dataType: this.settings.dataType,
						type: 'GET',
						error:  function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.statusText);
								console.log(thrownError);
						},
						success: function (data) {			
								
							obj.normalizeData(data,obj);
						}
					});
				},
				normalizeData : function (data,obj) {
					
					var result = [], teste = [];
					
					if ( data.metadata !== undefined )  {
						var arrCol = [];
						for (var i in data.metadata) {
							arrCol[i] = data.metadata[i].colName;
						}									
						for (var j in data.resultset) {		
							var arr = {};
							for (var i in data.resultset[j]) {
								arr[arrCol[i]] = data.resultset[j][i];
							}
							result.push(arr);
						}
						obj.data = result;									
					} else if (data.resultset != undefined && data.resultset.length > 0 ) {
						obj.data = data.resultset;									
					} else if ( obj.data.length === undefined) {
						obj.data[0] = data;					
					} else obj.data = data;	
					
					
					if ( obj.settings.target !== null) {
						obj.dataView(obj.settings.template,obj.settings.target,obj.data, obj.settings.templateUrl);
						
						if (typeof(obj.settings.onLoad) === 'function') {
							obj.settings.onLoad();
						}
					}
					//console.log(obj.data);
					return obj.data;
				},
				
				dataView: function (tpl,target,data, templateUrl) {
					var resultset = { resultset : data };
					var source;
					//console.log(templateUrl);
					if ( templateUrl !== null ) {
						$.ajax({ 
							url: templateUrl,
							async: false,
							type: 'GET',
							dataType: 'html',
							error:  function (xhr, ajaxOptions, thrownError) {
									console.log(xhr.statusText);
									console.log(thrownError);
							},
							success: function (data) {			
									source = data;
									
							}
						});
					} else {					
						source = $("#" + tpl).html();
					}
					//console.log(html);
					//console.log(source);
					//console.log(resultset);
					
					var template = Handlebars.compile(source);
					$("#" + target).html(template(resultset)); 
					$("#" + target + ' table').dataTable( {"oLanguage" : {
						"sProcessing": "Processando...",
						"sLengthMenu": "Mostrar _MENU_", 
						"sZeroRecords": "Não foram encontrados resultados",
						"sInfo": "Mostrando de _START_ a _END_ de _TOTAL_ registros",
						"sInfoEmpty": "Mostrando de 0 a 0 de 0 registros",
						"sInfoFiltered": "",
						"sInfoPostFix": "",
						"sSearch": "Buscar:",
						"sUrl": "",
						"oPaginate": {
							"sFirst": "Primeiro",
							"sPrevious": "Anterior",
							"sNext": "Seguinte",
							"sLast": "Último" 
						}
					}}); 
					
				},
				onSelected: function (el, data, obj) {
					$.each(data, function (idx, val) {
							$("input[data-set='"+ idx +"']").val(val);
					});
						
					obj.dataView(obj.settings.template,obj.settings.target,data, obj.settings.templateUrl);
				 },
				getSuggetion: function () {	
					var key = this.settings.field;
					var name = this.settings.name;
					var template = this.settings.template || '<p><strong>{{'+key+'}}</strong></p>' ; 
					
					var onSelected = typeof(this.settings.onSelected) === 'function' ? this.settings.onSelected : this.onSelected;					
					var obj = this;
					
					var service = new Bloodhound({
						datumTokenizer: Bloodhound.tokenizers.obj.whitespace(key),
						queryTokenizer: Bloodhound.tokenizers.whitespace,
						ttl: 10000,
						prefetch: {
							url: this.settings.prefix + this.settings.endpoint,
							filter: function (data) {
								return obj.normalizeData(data,obj);
							}
						}, 
						 dataType: this.settings.dataType,
						remote: {
							url: this.settings.prefix + this.settings.endpoint + this.settings.query ,
							filter: function (data) {								
								return obj.normalizeData(data,obj);
							}
						}
					});
					
					service.initialize();
					
					$(this.element).typeahead({
						minLength: 1
					},	
					{
					  name: 'endpoint',
					  displayKey: key,
					   source: service.ttAdapter(),
						templates: {
							empty: [
							'<div class="empty-message">',
							'Item não encontrado.',
							'</div>'
							].join('\n'),
							suggestion: Handlebars.compile(template)
						}
					})
					.on('typeahead:selected', function (el, data) {
						onSelected(el, data, obj);
					})
					.on('typeahead:autocompleted', function (el, data) {
						onSelected(el, data, obj);
					})
					.on('typeahead:cursorchanged', function (el, data) {
						onSelected(el, data, obj);
					})
					.on('typeahead:opened',function(obj,data){
						/*$('.tt-dropdown-menu')
							.css('width',$(this).width()*1.1 + 'px');*/
					});
		
		
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new restClient( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
