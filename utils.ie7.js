//继承
 function extend(subClass, supClass){
	var F = function(){};
	F.prototype = supClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = this;
	subClass.superclass = superClass.prototype;
	if(supClass.prototype.constructor === Object.prototype.constructor){
		supClass.prototype.constructor = supClass;
	}
};
//bind方法polyfill
Function.prototype.bind = Function.prototype.bind || function(){
	var _this = this,
		args = arguments;
	return function(){
		Function.prototype.call.apply(_this, args);
		return args[0];
	};
};
//返回boolean类型值的匹配方法,isMatched(匹配类型)
String.prototype.isMatched = function(type){
	switch(type = type.toLowerCase()){
		case "mobile":
			return this.toString().match(/^1\d{10}$/) ? true : false;
		case "phone":
			return this.toString().match(/^(0|8)[1-9]{1,2}\d{7,8}$/) ? true : false;
		case "captcha":
			return this.toString().match(/^\d{6}$/) ? true : false;
		case "password":
			return this.toString().match(/^\S{6,16}$/) ? true : false;
	}
};
//手机号替换为星号手机号,toStarryMobile(星号个数)
String.prototype.toStarryMobile = function(length){
	return this.toString().replace(this.toString().substring(Math.floor((this.length - length) / 2), Math.floor((this.length + length) / 2)), function(){
		for(var i = 0, result = new Array(); i < length; i++){
			result[i] = "*";
		}
		return result.join("").toString();
	});
};
//数组排序算法
Array.prototype.Sort = function(type){
	switch(type){
		case 1:
			for(var i = 1; i < this.length; i++){
				for(var j = 0; j < i ; j++){
					if(this[j] > this[i]){
						var temp = this[j];
						this[j] = this[i];
						this[i] = temp;
					}
				}
			}
			return this;
		case 2:
			for(var i = 0; i < this.length; i++){
				for(var j = i + 1; j < this.length; j++){
					if(this[j] > this[j + 1]){
						var temp = this[i];
						this[i] = this[i + 1];
						this[i + 1] = temp;
					}
				}
			}
			return this;
		default:
			return this.sort();
	}
};
//数组去重算法
Array.prototype.derepeat = function(){
	var newArr = new Array();
	for(var i = 0; i < this.length; i++){
		var temp = this[i], isRepeat = 0;
		for(var j = i + 1; j < this.length; j++){
			if(this[j] === this[i]){
				isRepeat += 1;
			}
		}
		if(!isRepeat){
			newArr[newArr.length] = this[i];
		}
	}
	return newArr;
};
//Ajax
var ajax = function(){
	var id = 0,
		body = document.body;
	return function(options){
		id++;
		var jsonp = options.jsonp,
			url = options.url,
			data = options.data,
			dataType = options.dataType || "json",
			success = (options.success || function(){}).bind(options),
			error = (options.error || function(){}).bind(options);
		if(jsonp){
			var script = document.createElement("script"),
				data = serialize(data);
			script.src = [url, "?type=jsonp&id=", id, [["&", data].join(""), ""][+!data.length]].join("");
			window[["jsonpCallback_", id].join("")] = [
				success,
				function(data){
					success(eval("(" + data + ")"));
				}
			][+(dataType === "json")];
			return body.appendChild(script);
		}
		var xhr = new XMLHttpRequest,
			type = options.type || "get",
			headers = options.headers || {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			a;
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(xhr.status >= 200 && xhr.status < 300){
					success(dataType === "json" ? eval("("+ xhr.responseText + ")") : xhr.responseText);
				}else{
					error(xhr.responseText);
				}
			}
		};
		xhr.open(type, [url, ["", ["?", serialize(data)].join("")][+(type === "get")]].join(""), options.async || 1);
		for(a in headers){
			xhr.setRequestHeader(a, headers[a]);
		}
		xhr.send([serialize(data), null][+(type === "get")]);
	};
	function serialize(obj){
		var result = [],
			a;
		for(a in obj){
			result.push([a, "=", obj[a]].join(""));
		}
		return result.join("&");
	}
}();
//时间字符串格式化
//计算时间差并转换为固定格式,timeDiff(开始时间[,结束时间]),没有结束时间默认结束时间为当前时间
function DateFormat(){
	this.date = new Date();
	this.yearType = this.date.getYear() % 100 ? this.date.getYear() % 4 : this.date.getYear() % 400;
	this.monthDays = [0,2,4,6,7,9,11].indexOf(this.date.getMonth()) ? 31 : [3,5,8,10].indexOf(this.date.getMonth()) ? 30 : this.yearType ? 28 : 29;
}
DateFormat.prototype = {
	constructor: DateFormat,
	timeDiff : function(startTime, endTime){
		this.diff = ((endTime ? endTime : this.date.getTime()) - startTime) / 1000;
		this.absDiff = Math.abs(this.diff);
		this.diffType = this.diff < 0 ? "后" : "前";
		return this.absDiff < 60 ? "刚刚" : 
			this.absDiff < 60 * 60 ? Math.floor(this.absDiff / 60) + "分钟" + this.diffType : 
			this.absDiff < 60* 60 * 24 ? Math.floor(this.absDiff / 60 / 60) + "小时" + this.diffType : 
			this.absDiff < 60 * 60 * 24 * this.monthDays ? Math.floor(this.absDiff / 60 / 60 / 24) + "天" + this.diffType : 
			this.absDiff < 60 * 60 * 24 * (this.yearType ? 365 : 366) ? Math.floor(this.absDiff / 60 / 60 / 24 / this.monthDays) + "月" + this.diffType : Math.floor(this.absDiff / 60 / 60 / 24 / (this.yearType ? 365 : 366)) + "年" + this.diffType;
	}
};
//手机标准单位
var setRem = function(){
	function a(){
		document.documentElement.style.fontSize = [window.innerWidth / 16, "px"].join("");
	}
	onresize = a;
	return a;
}();