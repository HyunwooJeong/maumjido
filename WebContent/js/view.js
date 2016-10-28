var G_maskCnt=0;
function showMask() {
	$("#mask").show();
	G_maskCnt++;
	//console.log(G_maskCnt);
}
function hideMask() {
	G_maskCnt--;
	if(G_maskCnt==0){
		$("#mask").hide();
	}
}
function hideAddItemMenu() {
	hideMask();
	$("#addForm").hide();
	$("#contentsType").val("");
	$("#contents").val("");
	$("#contentsName").val("");
}
function hideModItemMenu() {
	hideMask();
	$("#modForm").hide();
	$("#contentsType2").val("");
	$("#contents2").val("");
	$("#contentsName2").val("");
}
// 폴더 메뉴 숨김
function hideModFolderMenu() {
	hideMask();
	$("#modFolderForm").hide();
	$("#modFolderName").val("");
}
function showAddItemMenu() {
	showMask();
	positionCenter($("#addForm"));
	$("#addForm").show();
	$("#contents").focus();
}
// 폴더 메뉴 보임
function showModFolderMenu(id, boxId) {
	showMask();
	$("#modFolderName").val($("#"+id).children("div").text());
	$("#folderItemId").val(id);
	$("#folderBoxId").val(boxId);
	positionCenter($("#modFolderForm"));
	$("#modFolderForm").show();
	$("#modFolderName").focus();
}
function showModifyItemMenu(id, boxId) {
	$("#folderItemId").val(id);
	$("#folderBoxId").val(boxId);
	showMask();
	positionCenter($("#modForm"));
	var contentsName = $("[id='" + id + "']").children("div").text();
	var contents = "";
	for (var i = 1; i < 5; i++) {
		var re = new RegExp("^" + getContentsTypePrefix(i + ""));
		if (id.match(re)) {
			contents = id.replace(re, "");
			$("#contentsType2").val(i);
			break;
		} else if (i == 4) {
			contents = id.replace(getContentsTypePrefix(i + ""), "");
			$("#contentsType2").val(i);
		}
	}
	$("#contents2").val(contents);
	$("#contentsName2").val(contentsName);
	$("#modForm").show();
	$("#contents2").focus();
}

function showFolder(folderItem) {
	showMask();
	var folderBox = folderItem.getBox();
	var folderGrid = folderBox.getGrid();
	var $folder = folderGrid.getParent();
	$folder.show();
	var totalCnt = folderBox.getTotalCnt();
	var maxColCnt = Math.floor(globalBox.getGrid().getColCnt()/2);
	var colCnt = Math.min(maxColCnt, totalCnt);
	var rowCnt = Math.ceil(totalCnt/colCnt);
	$folder.width((folderGrid.getWidth()*colCnt) + (folderGrid.getMargin()*2) );
	$folder.height((folderGrid.getHeight()*rowCnt) + (folderGrid.getMargin()*2));
	folderGrid.calc();
	for(var i=0; i<totalCnt; i++) {
		var linkItem = folderBox.getItemByIndex(i);
		folderGrid.reCell(i);
		var cell = folderGrid.getCell(i);
		linkItem.move(cell.getX(), cell.getY(), 0);
	}
	positionCenter($folder);
}

function changeContentsType() {
	$("#contents").attr("placeholder",getContentsTypeComment($("#contentsType").val()));
}
