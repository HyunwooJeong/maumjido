var MEMBER_URL = "http://goni4svn.cafe24.com:10003/goni_member/member/";

$(window).bind("beforeunload", loadingStart);
$(document).ajaxStart(loadingStart).ajaxStop(loadingStop);
$(document).ready(function() {

});
function loadingStart() {
	if ($("#loadingLayer").size() == 0) {
		$("body").append("<div class='modal'></div>");
	}
	$("body").addClass("loading");
}
function loadingStop() {
	$("body").removeClass("loading");
}

$.jsonp = function(url, data, jsonpCallback) {
	$.ajax({
		beforeSend : function(xhr) {
			loadingStart();
		},
		url : url,
		dataType : "jsonp",
		data : data,
		jsonpCallback : jsonpCallback,
		complete : function() {
			loadingStop();
		}
	});
	return null;
};

function GoniLogin(fnLoginFail, fnLoginDone, fnLogoutDone, fnLogoutFail) {
	this.fnLoginFail = fnLoginFail;
	this.fnLoginDone = fnLoginDone;
	this.fnLogoutDone = fnLogoutDone;
	this.fnLogoutFail = fnLogoutFail;
	this.goVerify();
}

GoniLogin.prototype.goVerify = function() {
	var url = MEMBER_URL + "verify";
	var data = {
			fnLoginFail : this.fnLoginFail,
			fnLoginDone : this.fnLoginDone
	};
	$.jsonp(url, data, "GoniLogin_verify");
}

GoniLogin.prototype.logout = function() {
	$.removeCookie("goni-user", { expires: -1, path:'/' });

	var url = MEMBER_URL + "logout";
	var data = {
			fnLogoutDone : this.fnLogoutDone,
			fnLogoutFail : this.fnLogoutFail,
	};
	var callbackFunctin = "GoniLogin_cbLogout";

	$.jsonp(url, data, callbackFunctin);
}

function GoniLogin_cbLogout(data) {
	if (data.resultCode != 0) {
		//alert(data.errMsg);
		eval(data.fnLogoutFail+"()");
	} else {
		eval(data.fnLogoutDone+"()");
	}
}

function GoniLogin_verify(data) {
	if (data.resultCode != 0) {
		eval(data.fnLoginFail+"()");
	} else {
		// 인증 성공
		eval(data.fnLoginDone+"()");
	}
}