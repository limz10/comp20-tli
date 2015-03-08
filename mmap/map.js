var map;
var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 16, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

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
			renderMap_myLocation();
			datastore("RobDennison", myLat, myLng);
		});
	}
	else {
		alert("Geolocation is not supported by your web browser. What a shame!");
	}
	console.log("Leaving getMyLocation()");
}

function datastore(login, lat, lng) {
	request.open("POST", "https://secret-about-box.herokuapp.com/sendLocation", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var to_send = "login="+login+"&lat="+lat+"&lng="+lng;

	request.onreadystatechange = renderPeers;

	request.send(to_send);
}

function renderPeers() {
	if(request.readyState == 4 && request.status == 200) {
		alert(request.responseText);
		console.log(request.responseText);
		peers = JSON.parse(request.responseText);
		for (i = 1; i < peers.length; i++) {
			rederMap(peers[i]["login"], peers[i]["lat"], peers[i]["lng"]);
		}
	}
}

var marker;
var info_window = new google.maps.InfoWindow();

function renderMap_myLocation()
{
	me = new google.maps.LatLng(myLat, myLng);
	// Update map and go there...
	map.panTo(me);
	// Create a marker
	var markerImage = "limz.jpg";
	marker = new google.maps.Marker({
		position: me,
		title: "RobDennison",
		icon: markerImage
	});
	marker.setMap(map);
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		info_window.setContent(marker.title);
		info_window.open(map, marker);
	});
}

function renderMap(login, lat, lng)
{
	me = new google.maps.LatLng(lat, lng);
	// Update map and go there...
	map.panTo(me);
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: login
	});
	marker.setMap(map);
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		info_window.setContent(marker.title);
		info_window.open(map, marker);
	});
}