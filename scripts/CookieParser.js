function getCookie(name) {
	var value = "; " + document.cookie;
	console.log(value);
	var parts = value.split("; " + name + "=");
	if(parts.length == 2) {
		return parts.pop().split(";").shift().replace("+"," ");
	}
}
