var Item = function() {
	this.index = -1;
	this.jqEl;
	this.type = 0;
	this.id;
	this.name = "";
	this.width = 0;
	this.hegith = 0;
	this.margin = 0;
	this.colCnt = 1;
	this.rowCnt = 1;
}
Item.prototype.toJSON = function() {
	var json = {};
	json.name = this.name;
	json.id = this.id;
	return json;
}
Item.prototype.setJqEl = function(jqEl) {
	this.jqEl = jqEl;
	return this;
}
Item.prototype.getJqEl = function() {
	return this.jqEl;
}
Item.prototype.setId = function(id) {
	this.id = id;
	return this;
}
Item.prototype.getId = function() {
	return this.id;
}
Item.prototype.setIndex = function(index) {
	this.index = index;
	return this;
}
Item.prototype.getIndex = function() {
	return this.index;
}
Item.prototype.setWidth = function(width) {
	this.width = width;
	return this;
}
Item.prototype.getWidth = function() {
	return this.width;
}
Item.prototype.setHeight = function(height) {
	this.height = height;
	return this;
}
Item.prototype.getHeight = function() {
	return this.height;
}
Item.prototype.move = function(x, y, time) {
	if(time == null) {
		time = 500;
	}
	if(this.jqEl != null) {
		this.jqEl.animate({"left":x, "top":y}, time);
	}
}
Item.prototype.remove = function() {
	if(this.jqEl != null) {
		this.jqEl.fadeOut(500, function(){
			$(this).remove();
		});
		this.jqEl = null;
	}
}
Item.prototype.setName = function(name) {
	this.name = name;
	return this;
}
Item.prototype.getName = function() {
	return this.name;
}
Item.prototype.getType = function() {
	return this.type;
}
Item.prototype.setType = function(type) {
	this.type = type;
	return this;
}
Item.prototype.getMargin = function() {
	return this.margin;
}
Item.prototype.setMargin = function(margin) {
	this.margin = margin;
	return this;
}
Item.prototype.setColCnt = function(colCnt) {
	this.colCnt = colCnt;
	return this;
}
Item.prototype.getColCnt = function() {
	return this.colCnt;
}
Item.prototype.setRowCnt = function(rowCnt) {
	this.rowCnt = rowCnt;
	return this;
}
Item.prototype.getRowCnt = function() {
	return this.rowCnt;
}
Item.prototype.dragable = function() {
	if(this.jqEl != null) {
		dragdrop.setElement(this.jqEl);
	}
}
Item.prototype.tap = function(fn) {
	if(this.jqEl != null) {
		var item = this;
		this.jqEl.off("tap");
		this.jqEl.on("tap", 
				function() {
					var url=this.id;
					setTimeout(function() {
							if(!doubleTapped) {
								fn(item);
							}
					}, 200);
				});
	}
}
Item.prototype.doubletap = function(fn) {
	if(this.jqEl != null) {
		var $jqEl = this.jqEl;
		var item = this;
		this.jqEl.off("doubletap");
		this.jqEl.on("doubletap", this, function() {
			doubleTapped = true;
			fn(item);
			setTimeout(function(){doubleTapped=false;}, 300);
		})
	}
}
var LinkItem = function() {
	Item.apply(this, arguments);
	this.isLink = true;
}
LinkItem.prototype = new Item();
LinkItem.prototype.constructor = Item;
LinkItem.prototype.toJSON = function() {
	var json = {};
	json.name = this.name;
	json.id = this.id;
	json.isLink = true;
	return json;
}
var FolderItem = function() {
	Item.apply(this, arguments);
	this.isFolder = true;
	var $folder = $("<div>").attr("id", "folderBox"+Util.getKey()).css({padding:"0px"}).addClass("dialog");
	var folderGrid = new Grid();
	folderGrid.setWidth(90);
	folderGrid.setHeight(90);
	folderGrid.setParent($folder);
	
	this.folderBox = Box.getInstance(folderGrid.getId());
	
	$("body").append($folder);
	
	this.folderBox.setGrid(folderGrid);
	this.folderBox.setParentItem(this);
}
FolderItem.prototype = new Item();
FolderItem.prototype.constructor = Item;
FolderItem.prototype.getBox = function() {
	return this.folderBox;
}
FolderItem.prototype.toJSON = function() {
	var json = {};
	json.name = this.name;
	json.id = this.id;
	json.children = this.folderBox.toJSON();
	json.isFolder = true;
	return json;
}
var Box = function(id) {
	this.itemList = [];
	this.itemMap = {};
	this.grid = null;
	this.getId = function() {
		return id;
	}
	this.parentItem = null;
}
Box.getInstance = Util.INATANCE_FACTORY(Box);
Box.prototype.getGrid = function() {
	return this.grid;
}
Box.prototype.setGrid = function(grid) {
	this.grid = grid;
}
Box.prototype.getParentItem = function() {
	return this.parentItem;
}
Box.prototype.setParentItem = function(parentItem) {
	this.parentItem = parentItem;
}

Box.prototype.add = function(item) {
	var $jqEl = item.getJqEl();
	$jqEl.attr("boxId", this.getId());
	var grid = this.getGrid();
	var $parent = grid.getParent();
	
	$parent.append($jqEl);
	var index = item.getIndex();
	if(index == -1) {
		index = this.getTotalCnt();
		var cell = this.grid.addCell(index);
		
		item.setIndex(index);
		this.itemMap[item.getId()] = item;
		this.itemList.push(item);
	} else {
		this.itemMap[item.getId()] = item;
		this.itemList.splice(index, 0, item);
		
		for(var i=this.getTotalCnt()-1; i >= index; i--) {
			var item = this.getItemByIndex(i);
			item.setIndex(i);
			var cell = this.grid.getCell(i);
			if(cell == null) {
				cell = this.grid.addCell(i);
			}
			item.move(cell.getX(), cell.getY());
		}
	}
	
	$jqEl.css({
		"left":cell.getX(), 
		"top": cell.getY(),
		"width": item.getWidth(),
		"height": item.getHeight(),
		"margin": item.getMargin()
		});
	
	if(item.isFolder) {
		item.dragable();
		item.doubletap(function(item) {
			var $jqEl = item.getJqEl();
			showModFolderMenu($jqEl.attr("id"), $jqEl.attr("boxId"));
		});
		item.tap(function(item) {
			showFolder(item);
		});
	} else if(item.isLink) {
		item.dragable();
		item.doubletap(function(item) {
			var $jqEl = item.getJqEl();
			showModifyItemMenu($jqEl.attr("id"), $jqEl.attr("boxId"));
		});
		item.tap(function(item) {
			var $jqEl = item.getJqEl();
			window.open($jqEl.attr("id"));
		});
		$jqEl.css({
			"background-image": "url(http://www.google.com/s2/favicons?domain="+$jqEl.attr("id")+")",
			"background-repeat": "no-repeat",
			"background-position": "50% 50%",
			"background-size": "50%",
			
		});
	} else {
		// trashcan or plus
	}
	
	return item;
}

Box.prototype.getItemById = function(id) {
	return this.itemMap[id];
}
Box.prototype.getItemByIndex = function(index) {
	return this.itemList[index];
}

Box.prototype.getTotalCnt = function() {
	return this.itemList.length;
}

Box.prototype.createFolderItem = function(linkItemId) {
	var folderItem = createFolderItem("폴더");
	var folderName = folderItem.getName();
	var id = folderItem.getId();
	var $box = $("<div>").attr("id", id).addClass("folder");
	var $div = $("<div>").text(folderName);
	$box.append($div);
	var linkItem = this.getItemById(linkItemId);
	var index = linkItem.getIndex();
	var url = linkItem.getId();
	var name = linkItem.getName();
	linkItem.remove();
	
	var folderBox = folderItem.getBox();
	folderItem.setIndex(index);
	folderBox.add(createLinkItem(url, name));
	return folderItem;
}
var createLinkItem = function(url, name) {
	$("[id='"+url+"']").remove();
	var $box = $("<div>").attr("id", url).addClass("box");
	var $div = $("<div>").text(name);
	$box.append($div);
	var item = new LinkItem();
	item.setId(url);
	item.setJqEl($box);
	item.setName(name);
	item.setMargin(15);
	item.setWidth(40);
	item.setHeight(40);
	return item;
}
var createFolderItem = function(name) {
	var id = "folder" + Util.getKey();
	if(name == null) {
		name = "폴더";
	}
	var $box = $("<div>").attr("id", id).addClass("folder");
	var $div = $("<div>").text(name);
	$box.append($div);
	
	var folderItem = new FolderItem();
	var folderBox = folderItem.getBox();
	folderItem.setId(id);
	folderItem.setJqEl($box)
	folderItem.setName(name);

	folderItem.setMargin(15);
	folderItem.setWidth(40);
	folderItem.setHeight(40);
	return folderItem;
}

Box.prototype.changePosition = function(destIndex, sourceId) {
	var cell = this.grid.getCell(destIndex);
	var sourceItem = this.getItemById(sourceId);
	var sourceIndex = sourceItem.getIndex();
	if(cell != null) {
		if(destIndex != sourceIndex) { // 
			if(destIndex < sourceIndex) {
				this.shiftRightItem(destIndex, sourceIndex);
			} else if(destIndex > sourceIndex) {
				this.shiftLeftItem(sourceIndex, destIndex);
			} 
		} else {
			sourceItem.move(cell.getX(), cell.getY());
		}
	} else { // 제자리
		var cell = this.grid.getCell(sourceIndex);
		sourceItem.move(cell.getX(), cell.getY(), 300);
	}
}
Box.prototype.mod = function(item) {
	var $jqEl = item.getJqEl();
	$jqEl.attr("boxId", this.getId());
	var $parent = this.getGrid().getParent();
	$parent.append($jqEl);
	var index = item.getIndex();
	
	this.itemMap[item.getId()] = item;
	this.itemList.splice(index, 1, item);
	
	var cell = this.getGrid().getCell(index);
	item.move(cell.getX(), cell.getY());
	
	
	if(item.isFolder) {
		item.dragable();
		item.doubletap(function(item) {
			var $jqEl = item.getJqEl();
			showModFolderMenu($jqEl.attr("id"), $jqEl.attr("boxId"));
		});
		item.tap(function(item) {
			showFolder(item);
		});
	} else if(item.isLink) {
		item.dragable();
		item.doubletap(function(item) {
			var $jqEl = item.getJqEl();
			showModifyItemMenu($jqEl.attr("id"), $jqEl.attr("boxId"));
		});
		item.tap(function(item) {
			var $jqEl = item.getJqEl();
			window.open($jqEl.attr("id"));
		});
	} else {
		// trashcan or plus
	}
	
	return item;
}

Box.prototype.shiftRightItem = function(fromIndex, toIndex) {
	this.itemList.splice(fromIndex, 0, this.itemList.splice(toIndex, 1)[0]);
	
	for(var i=toIndex; i >= fromIndex; i--) {
		var item = this.getItemByIndex(i);
		item.setIndex(i);
		var cell = this.grid.getCell(i);
		if(cell == null) {
			cell = this.grid.addCell(i);
		}
		item.move(cell.getX(), cell.getY());
	}
	/*
	if(thisCell.getCol() == 0) {
		$item.animate({
			  left: $(window).width(),
			}, 250, function() {
				var $local = $(this);
				$local.css({"left":-this.grid.getWidth(), "top":parseInt($local.css("top"))+this.grid.getHeight()});
				$local.animate({
				  left: this.grid.getMargin(),
				}, 250);
			});
	}
	 */
}
Box.prototype.shiftLeftItem = function(fromIndex, toIndex, isCycle) {
	if(isCycle == null) {
		isCycle = true;
	}
	if(isCycle){
		this.itemList.splice(toIndex, 0, this.itemList.splice(fromIndex, 1)[0]);
	} else {
		this.itemList.splice(fromIndex, 1);
	}
	
	for(var i=fromIndex; i <= toIndex; i++) {
		var item = this.getItemByIndex(i);
		if(item != null) {
			item.setIndex(i);
			var cell = this.grid.getCell(i);
			if(cell == null) {
				cell = this.grid.addCell(i);
			}
			item.move(cell.getX(), cell.getY());
		}
	}
	/*
	if(thisCell.getCol() == this.grid.getColCnt()-1) {
		$item.animate({
			  left: -this.grid.getWidth(),
			}, 250, function() {
				var $local = $(this);
				$local.css({"left":$(window).width(), "top":parseInt($local.css("top"))-this.grid.getHeight()});
				$local.animate({
				  left: $(window).width()-this.grid.getWidth()-this.grid.getMargin(),
				}, 250);
			});
	} 
	 */
}

Box.prototype.removeItem = function(id) {
	var item = this.getItemById(id);
	var index = item.getIndex();
	
	delete this.itemMap[id];
	item.setIndex(-1);
	var lastIndex = this.getTotalCnt()-1;
	this.getGrid().removeCell(lastIndex);
	this.shiftLeftItem(index, lastIndex, false);
	return item;
}

Box.prototype.changeId = function(sourceId, destId) {
	if(destId != sourceId) {
		this.itemMap[destId] = this.itemMap[sourceId];
		delete this.itemMap[sourceId];
	}
}

Box.prototype.remove = function() {
	var grid = this.getGrid();
	
	for(var i=0;this.getTotalCnt() > 0;i++) {
		this.removeItem(i).remove();
	}
	grid.remove();
	grid = null;
}
Box.prototype.toJSON = function() {
	var totalCnt = this.getTotalCnt();
	var itemList = [];
	for(var i=0; i<totalCnt; i++) {
		var item = this.getItemByIndex(i);
		if(item.getId() == 'trashcan' || item.getId() == 'plus') {
			continue;
		} else {
			itemList.push(item.toJSON());
		}
	}
	return itemList;
}