/*
	MediaCenterJS - A NodeJS based mediacenter solution
	
    Copyright (C) 2013 - Jan Smolders

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($){

	var ns = 'mcjsw'
	,methods = {}

	function _init(options) {

		var opts = $.extend(true, {}, $.fn.mcjsw.defaults, options);
    
    
		return this.each(function() {
			var $that = $(this)
				,o = $.extend(true, {}, opts, $that.data(opts.datasetKey));
				
			// add data to the defaults (e.g. $node caches etc)	
			o = $.extend(true, o, { 
				$that: $that,
				language : '',
				LANG : '',
				location : '',
				unit : '',
				cloudy : '',
				mist : '',
				clear : '',
				sunny : '',
				rain : '',
				snow : '',
				storm : '',
				feelsLike : '',
				tempIndicator  : '&#8451;',
				error  : '' 
			});
			o.unit = o.language === 'nl'?'celsius':'fahrenheit';
      
			// use extend(), so no o is used by value, not by reference
			$.data(this, ns, $.extend(true, {}, o));
			_currentweather(o, $(this));
      
			$('.current').click( function(){
				o.unit = o.unit==='celsius'?'fahrenheit':'celsius';
				_currentweather(o, $that);
			});
			
		});
	}
	
	/**** Start of custom functions ***/
	
	
	// Get Current weather
	function _currentweather(o, $that){
		$.ajax({
			url: '/configuration/', 
			type: 'get'
		}).done(function(data){
		
			o.location = data.location
			o.language = data.language
			o.LANG = o.language.toUpperCase()
		
			//Set up i18n translation
			$.i18n.properties({
				name: 'frontend-translation', 
				path:'/translations/', 
				mode:'map',
				language: data.language,
				extension: 'js',
				loadBaseFile: false ,
				callback: function() {
					o.cloudy = new RegExp($.i18n.prop('weather_cloudy'),"gi");
					o.mist = new RegExp($.i18n.prop('weather_mist'),"gi");
					o.clear = new RegExp($.i18n.prop('weather_clear'),"gi");
					o.sunny = new RegExp($.i18n.prop('weather_sunny'),"gi");
					o.rain = new RegExp($.i18n.prop('weather_rain'),"gi");
					o.snow = new RegExp($.i18n.prop('weather_snow'),"gi");
					o.storm = new RegExp($.i18n.prop('weather_storm'),"gi");
					o.feelsLike = $.i18n.prop('feelsLike');
					o.error = $.i18n.prop('error_weather');

					$.ajax({
						url : "http://api.wunderground.com/api/68a6ea8f6013979c/geolookup/conditions/lang:"+o.LANG+"/q/"+ o.language +"/"+ o.location+".json",
						dataType : "jsonp",
						success : function(parsed_json) {
							if (parsed_json['response']['error']){
								var errorMessage = parsed_json['response']['error']['description']
								$("body").find("h1").html(errorMessage);
							}else {
								var locations = parsed_json['location']['city'];
								var country = parsed_json['location']['country'];
								var weathertype = parsed_json['current_observation']['weather'];
								var weathericon = parsed_json['current_observation']['icon_url'];
								
								if (o.unit == 'celsius'){
									var feelslike_c = parsed_json['current_observation']['feelslike_c'];
									var temp_c = parsed_json['current_observation']['temp_c'];
									o.tempIndicator  = 'C' 
								}else /*if (o.unit === 'fahrenheit')*/{
									var feelslike_c = parsed_json['current_observation']['feelslike_f'];
									var temp_c = parsed_json['current_observation']['temp_f'];
									o.tempIndicator  = '&#8457;' 
								}
			
								$("body").find("h1").html( locations +", "+ country);
								$("body").find(".weathertype").html(weathertype);
								$("body").find(".degrees").html( temp_c + " <sup>"+o.tempIndicator+"</sup>");
								$("body").find(".feelslike").html( o.feelsLike +" "+ feelslike_c + " <sup>"+o.tempIndicator+"</sup>");
			
								var weathertypeset = $('.weathertype').text()
						
								if ( weathertypeset.match(o.cloudy) ){
									$(".backdropimg").attr('src', "/weather/img/clouds.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.mist) ){
									$(".backdropimg").attr('src', "/weather/img/misty.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.clear) ){
									$(".backdropimg").attr('src', "/weather/img/clear.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.sunny) ){
									$(".backdropimg").attr('src', "/weather/img/sunny.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.rain) ){
									$(".backdropimg").attr('src', "/weather/img/rainy.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.snow) ){
									$(".backdropimg").attr('src', "/weather/img/snowy.jpg").addClass("fadein");
								}else if( weathertypeset.match(o.storm) ){
									$(".backdropimg").attr('src', "/weather/img/stormy.jpg").addClass("fadein");
								}else {
									$(".backdropimg").attr('src', "/weather/img/default.jpg").addClass("fadein");
								}
							}
						},
						error : function() {
							$("body").find("h1").html( 'Error: ' + o.location + '<br/>' + o.error);
						}
					});
					
					$(".forecast").find("ul").remove()
					$.ajax({
						url : "http://api.wunderground.com/api/68a6ea8f6013979c/forecast/lang:"+o.LANG+"/q/"+o.language+"/"+o.location+".json",
						dataType : "jsonp",
						success : function(forecast_data) {
							var forecastday = forecast_data['forecast']['simpleforecast']['forecastday'];
							$.each(forecastday, function (index, value) {	
								var day = value;
								// for each day in the week (which is 4 )
								var daycount = 1;
								for(var i = 0; i < daycount; i++) {
									var weekday = day.date.weekday							
									var conditions = day.conditions
									
									if (o.unit === 'celsius'){
										var mintemp = day.low.celsius	
										var maxtemp = day.high.celsius
									}else if (o.unit === 'fahrenheit'){
										var mintemp = day.low.fahrenheit	
										var maxtemp = day.high.fahrenheit
									}

									$("body").find(".forecast").append('<ul> <li class="weekday">'+ weekday +'</li> <li class="conditions">'+ conditions +'</li>  <li class="mintemp"> Min: '+ mintemp +'</li>  <li class="maxtemp"> Max:'+ maxtemp +'</li> </ul>');	
								}
							})
						}
					});
				}
			});	
		}); 
	}


	/**** End of custom functions ***/
	
	$.fn.mcjsw = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || !method ) {
			return _init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.fn.mcjsw' );
		};
	};
	
	/* default values for this plugin */
	$.fn.mcjsw.defaults = {}

})(jQuery);
