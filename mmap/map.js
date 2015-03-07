
var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 15, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var info_window = new google.maps.InfoWindow();
var places;

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	console.log("Call before getMyLocation()");
	getMyLocation();
	console.log("Call after getMyLocation()");
}

function getMyLocation() {
	console.log("In getMyLocation()");
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser. What a shame!");
	}
	console.log("Leaving getMyLocation()");
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	// Update map and go there...
	console.log("update map and go there...");
	map.panTo(me);
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "mli04",
		icon: "limz.jpg"
	});

	marker.setMap(map);
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		info_window.setContent(marker.title);
		info_window.open(map, marker);
	});
	
}