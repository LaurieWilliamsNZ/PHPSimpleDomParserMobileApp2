var APP = {};
APP.data = [];
APP.URL = 'php/data.php';

APP.init = function () {
	APP.fetchData();
}

APP.get = function () {
	var data = localStorage.getItem('events');
	
	if (!data || data == 'null') {
		return []; // return an empty array if we have no data
	} else {
		return JSON.parse(data);
	}
}

APP.set = function (data) {
	localStorage.setItem('events', JSON.stringify(data));
}

APP.fetchData = function () {

	var existing_data = APP.get();
	
	if (existing_data.length > 0) {
	
		console.log('Existing data found, loading from cache');
		APP.data = existing_data;
		APP.displayData();
		
	} else {
	
		console.log('Cache is empty, loading from server.');
		
		$('body').addClass('loading');
		
		$.get(APP.URL, function (data) {
		
			$('body').removeClass('loading');
			console.log(data);
			APP.data = data.results;
			APP.set(APP.data);
			APP.displayData();
		});	
	}
}

APP.displayData = function () {

	// container element
	var $target = $( $('#mySwipe .swipe-wrap')[0] );
	
	// compile our handlebars template
	var source = $('#event-item').html();
	var template = Handlebars.compile(source);

	$(APP.data).each(function (ix, ele) {
	
		console.log('ix: ' + ix, ele);
		
		// populate the template with our data
		var html = template(ele);
		
		// add to the DOM
		$target.append(html);
	});
	
	// init our swipe plugin
	window.mySwipe = $('#mySwipe').Swipe().data('Swipe');	
}