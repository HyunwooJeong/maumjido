function getContentsTypeValue(contentsType) {
	switch (contentsType) {
	case '1':
		return "URL";
	case '2':
		return "전화번호";
	case '3':
		return "전화번호";
	case '4':
		return "내용";
	}
}
function getContentsTypePrefix(contentsType) {
	switch (contentsType) {
	case '1':
		return "http://";
	case '2':
		return "tel://";
	case '3':
		return "sms://";
	case '4':
		return "kakaolink://sendurl?msg=";
	}
}

function getContentsTypeComment(contentsType) {
	switch(contentsType) {
	case '1': return "URL을 입력하세요.";
	case '2': return "전화 번호를 입력하세요.";
	case '3': return "문자 번호를 입력하세요.";
	case '4': return "카톡 메세지를 입력하세요.";
	}
}