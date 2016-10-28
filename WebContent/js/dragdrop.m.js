doubleTapped = false;
var Dragdrop = function() {
}
Dragdrop.prototype.setDragCallback = function (dragCallback) {
	this.dragCallback = dragCallback;
}
Dragdrop.prototype.setReleaseCallback = function (releaseCallback) {
	this.releaseCallback = releaseCallback;
}
Dragdrop.prototype.setTriggerEvent = function (eventName) {
	this.triggerEvent = eventName;
}
Dragdrop.prototype.setElement = function ($target) {
	return;
	this.$target = $target;
	this.$target.off(this.triggerEvent);
	this.$target
		.hammer({
			hold_timeout: 100,
			prevent_default : true,
			no_mouseevents : true
		})
		.on(this.triggerEvent, this, Dragdrop.draggable);
}


Dragdrop.draggable = function (event) {
	log("hold:"+event.gesture.target.tagName);
	var $target = $(event.gesture.target);
	var $parent = $target.parent();
	if($parent.hasClass("box") || $parent.hasClass("folder")) {
		$target = $parent;
	}
	if($target.hasClass("gridCell")) {
		var boxId = $target.parent().attr("id");
		var index = $target.attr("index");
		var box = Box.getInstance(boxId);
		var item = box.getItemByIndex(index);
		$target = item.getJqEl();
	} else if($target.hasClass("box") || $target.hasClass("folder")) {
		
	} else {
		return;
	}
	
	event.data.currentTarget = $target;
	var pX = event.gesture.center.pageX;
	var pY = event.gesture.center.pageY;
	$target.attr("gapX", pX - $target.position().left);
	$target.attr("gapY", pY - $target.position().top);
	$(document).on("drag", event.data, Dragdrop.dragging).on("release", event.data, Dragdrop.stopdragging);
	$target.addClass("shadow");
	var marginTop = parseInt($target.css("margin"))-20;
	$target.css({"margin-top":marginTop});
}

Dragdrop.dragging = function(event) {
	event.gesture.preventDefault();
	log("dragging:" + event.type);
	var $target = event.data.currentTarget;
	var touchX = event.gesture.center.pageX;
	var touchY = event.gesture.center.pageY;
	var objX = touchX - $target.attr("gapX");
	var objY = touchY - $target.attr("gapY");
	$target.css({
		left : objX,
		top : objY
	});
	if(event.data.dragCallback){
		event.data.dragCallback(objX, objY, touchX, touchY, $target);
	}
}

Dragdrop.stopdragging = function(event) {
	log("stopdragging:" + event.type);
	var $target = event.data.currentTarget;
	$target.removeClass("shadow");
	var marginTop = parseInt($target.css("margin"))+20;
	$target.css({"margin-top":marginTop});
	var touchX = event.gesture.center.pageX;
	var touchY = event.gesture.center.pageY;
	var objX = touchX - $target.attr("gapX");
	var objY = touchY - $target.attr("gapY");
	$(document).off("drag", Dragdrop.dragging).off("release", Dragdrop.stopdragging);
	if(event.data.releaseCallback){
		event.data.releaseCallback(objX, objY, touchX, touchY, $target);
	}
}