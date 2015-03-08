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
		peers = JSON.parse(request.responseText);
		for (i = 1; i < peers.length; i++) {
			renderMap(peers[i]["login"], peers[i]["lat"], peers[i]["lng"]);
		}
	}
}

var marker;
var info_window = new google.maps.InfoWindow();

function renderMap_myLocation() {
	me = new google.maps.LatLng(myLat, myLng);
	// Update map and go there...
	map.panTo(me);
	// Create a marker
	var markerImage = "limz.jpg";
	marker = new google.maps.Marker({
		position: me,
		icon: markerImage
	});
	marker.setMap(map);
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		info_window.close();
		info_window.setContent("RobDennison");
		info_window.open(map, this);
	});
}

function renderMap(login, lat, lng) {
	me = new google.maps.LatLng(lat, lng);

	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		map: map
	});
	marker.setMap(map);

	var distance = haversine_formula(lat, myLat, lng, myLng);
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		info_window.close();
		info_window.setContent(login+" "+distance);
		info_window.open(map, this);
	});
}

function haversine_formula (lat1, lat2, lon1, lon2) {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
	var R = 3959; //in miles
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	return d;
}