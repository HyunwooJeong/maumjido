var Favicon = {};
Favicon.getFaviconUrl = function(url) {
	$.ajax({
		url : url,
		crossDomain : true,
		dataType : "html"
	})
	.done(function (data) {
		alert(data);
	});
}