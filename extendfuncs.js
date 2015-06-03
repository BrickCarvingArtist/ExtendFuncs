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