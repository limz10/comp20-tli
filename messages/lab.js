


function parse() {

	var data = new XMLHttpRequest();

	data.open("get", "data.json", true);
	data.onreadystatechange = displayMessages;
	data.send();

	function displayMessages() {
		if (data.readyState == 4 && data.status == 200) {
			messages = JSON.parse(data.responseText);
			console.log(messages);	

			var result = "";
			for (i = 0; i < messages.length; i++) {
				result += "<p>" + messages[i]['username'] + " : " + messages[i]["content"] + "</p>";
			}

			document.getElementById("messages").innerHTML = result;
		}
	}
}