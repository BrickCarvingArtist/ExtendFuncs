//数据寄存器
function ObjectCache(){}
//对象方法拓展
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
//根据类名查找树节点
function getElementsByClassName(parentNode, elementType, className){
	var elements = parentNode.getElementsByTagName(elementType), returnElement = new Array();
	for(var i = 0; i < elements.length; i++){
		if(elements[i].className.indexOf(className) + 1){
			returnElement[returnElement.length] = elements[i];
		}
	}
	return returnElement;
};
//字符串方法拓展
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
//JSON类

//Ajax类
function ajax(option){
	var jsonp = option.jsonp,
		success = option.success,
		xhr = new XMLHttpRequest(),
		type = option.type,
		url = option.url,
		dataType = option.dataType,
		strQuery = queryString(option.data),
		readyState = [],
		loadingFunction = option.loading,
		successFunction = option.success,
		errorFunction = option.error,
		body = document.body;
	function queryString(object){
		var arrQuery = [];
		for(var i in object){
			arrQuery.push("&" + i + "=" + object[i]);
		}
		return arrQuery.join("").slice(1);
	}
	function loading(readyState){
		typeof loadingFunction === "function" && loadingFunction(readyState);
	}
	function success(responseText){
		typeof successFunction === "function" && successFunction(responseText);
	}
	function error(responseText){
		typeof errorFunction === "function" && errorFunction(responseText);
	}
	function afterOpen(){}
	function afterSend(){}
	function beforeGet(){}
	function alreadyGet(){
		var responseText = dataType && dataType === "text" ? xhr.responseText : JSON.parse(xhr.responseText);
		if(xhr.status === 200){
			success(responseText);
		}else{
			error(responseText);
		}
	}
	if(jsonp){
		jsonpCallback = function(data){
			jsonpData = data;
		};
		var script = document.createElement("script");
		script.src = url;
		script.onload = function(){
			option.success(jsonpData);
			body.removeChild(this);
			delete jsonpCallback;
			delete jsonpData;
		};
		body.appendChild(script);
		return;
	}
	xhr.onreadystatechange = function(){
		loading(xhr.readyState);
		[, afterOpen, afterSend, beforeGet, alreadyGet][xhr.readyState]();
	};
	xhr.open(type || "get", url + (type === "post" ? "" : strQuery ? "?" + strQuery : ""), option.asnyc || 1);
	strQuery && type === "post" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(strQuery && type === "post" ? strQuery : null);
}
//时间字符串格式化
//计算时间差并转换为固定格式,timeDiff(开始时间[,结束时间]),没有结束时间默认结束时间为当前时间
function DateFormat(){
	this.date = new Date();
	this.yearType = this.date.getYear() % 100 ? this.date.getYear() % 4 : this.date.getYear() % 400;
	this.monthDays = [0,2,4,6,7,9,11].indexOf(this.date.getMonth()) ? 31 : [3,5,8,10].indexOf(this.date.getMonth()) ? 30 : this.yearType ? 28 : 29;
}
DateFormat.prototype = {
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
//倒计时
//CutDown(DOM对象, 毫秒时间戳, 回调函数)
function CutDown(position, epoch, callback){
	var t = setInterval(function(){
		if(epoch > 0){
			epoch -= 1000;
			position.innerHTML = Math.floor(epoch / 1000) + "秒";
		}else{
			clearInterval(t);
			if(callback){
				callback();
			}
		}
	}, 1000);
};
//加载体验
function CheckTime(epoch){
	this.epoch = epoch;
	this.start();
}
CheckTime.prototype = {
	start : function(){
		var t = setTimeout(function(){
			document.documentElement.style.cursor = "wait";
		}, this.epoch);
	},
	end : function(){
		clearTimeout(t);
	}
};
//性能监控
//timeCost(方法名如果带参数将参数一起传入)
function Performance(){
	try{
		console.time && console.timeEnd;
	}catch(e){
		console.log(e.name + " : " + e.message + ".\nThis browser don't support Performance Object Functions.");
	}
}
Performance.prototype = {
	timeCost : function(funcName){
		console.time(funcName);
		eval("(" + funcName + ")");
		console.timeEnd(funcName);
	}
};
//本地储存
function Storage(){
	try{
		localStorage && sessionStorage;
	}catch(e){
		console.log(e.name + " : " + e.message + ".\nThis browser don't support Storage Object Functions.");
	}
}
Storage.prototype = {
	get : function(item){
		return localStorage.getItem(item);
	},
	set : function(items){
		for(var i in items){
			if(!localStorage.getItem(i)){
				localStorage.setItem(i, items[i]);
			}
		}	
	},
	remove : function(item){
		localStorage.removeItem(item);
	},
	clear : function(){
		localStorage.clear();
	}
};
//手机标准单位
function Mobile(){
	this.setRem();
}
Mobile.prototype = {
	constructor : Mobile,
	setRem : function(){
		document.documentElement.style.fontSize = window.innerWidth/16 + "px";
	}
}