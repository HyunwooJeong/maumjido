function addItem() {
	var contents = $("#contents").val();
	var name = $("#contentsName").val();
	if (contents == '') {
		alert(getContentsTypeValue($("#contentsType").val()) + "을 입력하세요.");
		$("#contents").focus();
		return;
	}
	contents = contents.replace(/^https?:\/\//, "");
	contents = getContentsTypePrefix($("#contentsType").val()) + contents;
	if (name == '') {
		alert("이름을 입력하세요.");
		$("#contentsName").focus();
		return;
	}
	if (globalBox.getItemById(contents) != null) {
		alert("동일한 아이템이 이미 있어요.!");
	} else {
		hideAddItemMenu();
		var item = createLinkItem(contents, name);
		item.setIndex(2);
		globalBox.add(item);
	}
	save("아이템추가");
}
function modItem() {
	var id = $("#folderItemId").val();
	var boxId = $("#folderBoxId").val();
	var contents = $("#contents2").val();
	var name = $("#contentsName2").val();
	if (contents == '') {
		alert(getContentsTypeValue($("#contentsType2").val()) + "을 입력하세요.");
		$("#contents2").focus();
		return;
	}
	contents = contents.replace(/^http(s)?:\/\//, "");
	contents = getContentsTypePrefix($("#contentsType2").val()) + contents;
	if (name == '') {
		alert("이름을 입력하세요.");
		$("#contentsName2").focus();
		return;
	}
	hideModItemMenu();
	var box = Box.getInstance(boxId);
	var item = box.getItemById(id);
	item.setId(contents);
	item.setName(name);
	var $target = item.getJqEl();
	$target.attr("id", contents).children("div").text(name);
	
	box.changeId(id, contents);
	save("아이템수정");
}
function delItem() {
	var id = $("#folderItemId").val();
	var boxId = $("#folderBoxId").val();
	var box = Box.getInstance(boxId);
	hideModItemMenu();
	box.removeItem(id).remove();
	save("아이템삭제");
}
function modFolder() {
	var name = $("#modFolderName").val();
	var boxId = $("#folderBoxId").val();
	var itemId = $("#folderItemId").val();
	if (name == '') {
		alert("이름을 입력하세요.");
		$("#modFolderName").focus();
		return;
	}
	var folderBox = Box.getInstance(boxId);
	var folderItem = folderBox.getItemById(itemId);
	folderItem.setName(name);
	folderItem.getJqEl().children("div").text(name);
	hideModFolderMenu();
	save("폴더수정");
}
function delFolder() {
	var boxId = $("#folderBoxId").val();
	var itemId = $("#folderItemId").val();
	var folderBox = Box.getInstance(boxId);
	
	hideModFolderMenu();
	
	folderBox.removeItem(itemId).remove();
	save("폴더삭제");
}

function fnCreateFolder() {
	var boxId = $("#folderBoxId").val();
	var itemId = $("#folderItemId").val();
	var sourceBox = Box.getInstance(boxId);
	var folderItem = sourceBox.createFolderItem(itemId);
	sourceBox.mod(folderItem);
	hideModItemMenu();
	save("폴더화");
}
function saveInit() {
	localStorage.setItem("goni_web_home", null);
}
function save(tag) {
	var box = globalBox;
	var data = {};
	data.version = "1.0";
	data.itemList = box.toJSON();
//	console.log(tag);
//	console.log(data);
	localStorage.setItem("goni_web_home", JSON.stringify(data));
}
function load() {
	var boxList = [
	           	{isLink : true, id: "http://m.naver.com", name:"네이버"},
	           	{isLink : true, id: "https://cs.sktelecom.com", name:"SKT 보상"},
	           	{isLink : true, id: "https://www.juso.go.kr/support/AddressConvert.htm", name:"주소 변환"},
	           	{isLink : true, id: "http://m.comic.naver.com", name:"네이버 웹툰"},
	           	{isLink : true, id: "http://m.webtoon.daum.net/m", name:"다음 웹툰"},
	           	{isLink : true, id: "http://m.miznet.daum.net", name:"미즈넷"},
	           	{isLink : true, id: "http://m.todayhumor.co.kr", name:"오늘의 유머"},
	           	{isLink : true, id: "https://www.google.co.kr", name:"구글"},
	           	{isLink : true, id: "http://translate.google.co.kr", name:"구글 번역기"},
	           	{isLink : true, id: "http://ip.pe.kr", name:"당신의아이피"},
	           	{isLink : true, id: "http://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&query=%EB%82%A0%EC%94%A8", name:"날씨"},
	           	{isLink : true, id: "http://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&query=%EB%AF%B8%EC%84%B8%EB%A8%BC%EC%A7%80", name:"미세 먼지"},
	           	{isLink : true, id: "http://m.search.naver.com/search.naver?sm=mtb_sug.top&where=m&query=%EC%A0%84%EC%97%AD%EC%9D%BC%EA%B3%84%EC%82%B0%EA%B8%B0&qdt=0&acq=%EC%A0%84%EC%97%AD%EC%9D%BC&acr=1", name:"전역일 계산"},
	           	{isLink : true, id: "http://m.search.naver.com/search.naver?where=m&sm=mtb_drt&query=%EB%8B%AC%EB%A0%A5", name:"달력"},
	           ];
	
	
	var data =  JSON.parse(localStorage.getItem("goni_web_home"));
	var itemList = null;
	if(data == null) {
		itemList = boxList;
	} else {
		itemList = data.itemList;
		//console.log(itemList);
	}
	for(var i=0; i<itemList.length; i++) {
		var item = itemList[i];
		if(item.isLink) {
			// LinkItem
			globalBox.add(createLinkItem(item.id, item.name));
		} else if(item.isFolder) {
			var folderItem = createFolderItem(item.name);
			globalBox.add(folderItem);
			var folderBox = folderItem.getBox();
			var children = item.children;
			for(var j=0; j<children.length; j++) {
				var childItem = children[j];
				folderBox.add(createLinkItem(childItem.id, childItem.name));
			}
		}
	}
}