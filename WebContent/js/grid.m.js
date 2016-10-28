var Grid = function() {
	this.parent = null;
	this.cellMap = {};
	this.totalCnt = 0;
	this.margin = 0;
	this.colCnt = 0;
}
Grid.prototype.setParent = function(parent) {
	this.parent = parent;
}
Grid.prototype.getId = function() {
	if(this.parent == null) {
		return null;
	} else {
		return this.parent.attr("id");
	}
}
Grid.prototype.getParent = function() {
	return this.parent;
}
Grid.prototype.setWidth = function(v) {
	this.width = v;
}
Grid.prototype.getWidth = function() {
	return this.width;
}
Grid.prototype.setHeight = function(v) {
	this.height = v;
}
Grid.prototype.getHeight = function() {
	return this.height;
}
Grid.prototype.calc = function() {
    this.margin = this.getParent().width()%this.width/2;
    this.colCnt = Math.floor(this.getParent().width()/this.width);
}
Grid.prototype.getColCnt = function() {
	return this.colCnt;
}
Grid.prototype.getRowCnt = function() {
	return Math.ceil(this.getTotalCnt() / this.colCnt);
}
Grid.prototype.getMargin = function() {
	return this.margin;
}

Grid.prototype.getCol = function(index) {
	return index % this.colCnt;
}
Grid.prototype.getRow = function(index) {
	return Math.floor(index/this.colCnt);
}
Grid.prototype.addCell = function(index) {
	var cell = new GridCell();
	var x = this.getX(index);
	var y = this.getY(index);
	
	var $gridCell = $("<div>")
		.css({
			"position" : "absolute", 
			"left" : x, 
			"top" : y, 
			"width" : this.width,
			"height" : this.height})
		.addClass("gridCell")
		.attr("index", index);
	cell.setIndex(index);
	cell.setX(x);
	cell.setY(y);
	cell.setCol(this.getCol(index));
	cell.setRow(this.getRow(index));
	cell.setEl($gridCell);
	dragdrop.setElement($gridCell);
	this.getParent().append($gridCell);
	this.cellMap[index] = cell;
	this.totalCnt++;
	return cell;
}
Grid.prototype.reCell = function(index) {
	var cell = this.getCell(index);
	var x = this.margin + (index % this.colCnt) * this.width;
	var y = Math.floor(index/this.colCnt) * this.height;
	cell.setIndex(index);
	cell.setX(x);
	cell.setY(y);
	cell.setCol(index % this.colCnt);
	cell.setRow(Math.floor(index/this.colCnt));
	cell.getEl().css({
		"position" : "absolute", 
		"left" : x, 
		"top" : y, 
		"width" : this.width,
		"height" : this.height});
	return cell;
}

Grid.prototype.getTotalCnt = function() {
	return this.totalCnt;
}

Grid.prototype.removeCell = function(index) {
	var cell = this.getCell(index);
	cell.getEl().remove();
	this.cellMap[index] = null;
	this.totalCnt--;
	return cell;
}

Grid.prototype.remove = function() {
	for(var i=0;this.getTotalCnt() > 0; i++) {
		this.removeCell(i);
	}
	this.getParent().remove();
}
Grid.prototype.getCell = function(index) {
	if(this.cellMap[index] != null) {
		return this.cellMap[index];
	}
	return null;
}
Grid.prototype.getX = function(index) {
	return this.getMargin() + (index % this.getColCnt()) * this.getWidth();
}
Grid.prototype.getY = function(index) {
	return Math.floor(index/this.getColCnt()) * this.getHeight();;
}
Grid.prototype.getSelectGridIndx = function(x1, y1, x2, y2) {
	var col1 = Math.floor((x1-this.margin)/this.width);
	var col1_x2 = (col1+1)*(this.width+this.margin);
	var col = 0;
	if(col1_x2 - x1 < x2 - col1_x2) {
		col = Math.floor((x2-this.margin)/this.width);
	} else {
		col = col1;
	}
	
	var row1 = Math.floor(y1/this.height);
	var row1_x2 = (row1+1)*this.height;
	var row = 0;
	if(row1_x2 - y1 < y2 - row1_x2) {
		row = Math.floor(y2/this.height);
	} else {
		row = row1;
	}
	if(row < 0) {
		return -1;
	}
	if(col < 0) {
		return -1;
	}
	if(this.colCnt <= col) {
		return -1;
	}
	return row * this.colCnt + col;
}

Grid.prototype.getIndexByPosition = function(x1, y1) {
	var col = Math.floor((x1-this.margin)/this.width);
	var row = Math.floor(y1/this.height);
	if(row < 0) {
		row = 0;
	}
	if(col < 0) {
		col = 0;
	}
	if(this.colCnt <= col) {
		col = this.colCnt-1;
	}
	return row * this.colCnt + col;
}

var GridCell = function() {
	
}
GridCell.prototype.setIndex = function(index) {
	this.index = index;
}
GridCell.prototype.getIndex = function() {
	return this.index;
}
GridCell.prototype.setX = function(x) {
	this.x = x;
}
GridCell.prototype.setY = function(y) {
	this.y = y;
}
GridCell.prototype.getX = function() {
	return this.x;
}
GridCell.prototype.getY = function() {
	return this.y;
}
GridCell.prototype.setCol = function(col) {
	this.col = col;
}
GridCell.prototype.setRow = function(row) {
	this.row = row;
}
GridCell.prototype.getCol = function() {
	return this.col;
}
GridCell.prototype.getRow = function() {
	return this.row;
}
GridCell.prototype.getEl = function() {
	return this.$el;
}
GridCell.prototype.setEl = function(el) {
	this.$el = el;
}