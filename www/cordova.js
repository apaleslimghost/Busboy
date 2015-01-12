setTimeout(function() {
	var ev = document.createEvent("Event");
	ev.initEvent("deviceready");
	document.dispatchEvent(ev);
}, 1000);