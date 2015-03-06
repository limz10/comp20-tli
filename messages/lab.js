


function parse() {

	var data = new XMLHttpRequest();

	data.open("get", data.json, true);
	data.onreadystatechange = displayMessages;
	data.send();

	function displayMessages() {
		messages = JSON.parse(data.responseText)
		console.log(messages);	
		document.getElementById("messages").innerHTML = data.responseText;
	}
}

