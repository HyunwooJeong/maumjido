var Util = {
	getKey : function () {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		month = Util.lPad(2, month);
		var date = Util.lPad(2, now.getDate());
		var hour = Util.lPad(2, now.getHours());
		var min = Util.lPad(2, now.getMinutes());
		var second = Util.lPad(2, now.getSeconds());
		var millisec = Util.lPad(3, now.getMilliseconds());
		now = null;
		return year + month + date + hour + min + second + millisec
				+ Util.lPad(3, Math.floor(Math.random() * 1000));
	},
	lPad : function (size, str) {
		var l = "";
		str = str + "";
		for (var i = str.length; i < size; i++) {
			l = "0" + l;
		}

		return l + str;
	},
	getObjectInstance : function(id) {
	    var obj = this;
	    this.INSTANCE;
	    if (id == null) {
	        id = Util.getKey();
	    }
	    if (this.INSTANCE === undefined) {
	        this.INSTANCE = {};
	        if (this.INSTANCE[id] == null) {
	            if (id == null) {
	                alert('id is null');
	            }
	            this.INSTANCE[id] = new obj(id);
	        }
	    } else {
	        if (this.INSTANCE[id] == null) {
	            if (id == null) {
	                alert('id is null');
	            }
	            this.INSTANCE[id] = new obj(id);
	        }
	    }
	    // console.log(JSON.stringify(this.INSTANCE));
	    return this.INSTANCE[id];
	},
	INATANCE_FACTORY : function(obj) {
	    return Util.getObjectInstance.bind(obj);
	}
}

function positionCenter($target) {
	$target.css(
			{
				top:'50%',
				left:'50%',
				margin:'-'+($target.innerHeight() / 2)+'px 0 0 -'+($target.width() / 2)+'px'
			}
	);
}

Array.prototype.indexOf = function(fn) {
    for ( var i = 0; i < this.length; i++) {
        if (typeof fn == 'function' && fn(this[i]))
            return i;
    }
    return -1;
};

function log(text) {
	return;
//	$("#log").text(text);
}