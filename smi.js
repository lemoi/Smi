var Smi=(function(){
	var __attr__=["class","style","_raw_","data"];
	var fns={};
	fns.deepCopy=function(copyTo,obj){
		Object.getOwnPropertyNames(obj).forEach(function(i){
			if(obj[i]==undefined)return;
			if(Object.getPrototypeOf(obj[i])===Object.getPrototypeOf({})){
				copyTo[i]={};	
				this.deepCopy(copyTo[i],obj[i]);
			}else{
				copyTo[i]=obj[i];
			}
		}.bind(this));
	};
	var deF=function(comp){
		return function(dataObj,eveLisObj){
			var Component=function(){};
			var instance={};
			fns.deepCopy(instance,comp);
			dataObj!==undefined&&fns.deepCopy(instance.prop,dataObj);
			instance.__raw__=document.createElement(instance.prop._raw_);
			instance.__eventHandle__=eveLisObj||{};
			return instance;
		}
	};

	var render=function(topComp,ele){
		var build=function(instance){
			var _arr=instance.content();
			if(_arr==undefined){
				console.warn("lack of any required parameter");
				_arr="undefined";
			}
			if(_arr instanceof Array){
				_arr.forEach(function(c){
					if(c==undefined){
						console.warn("lack of any required parameter");
						c="undefined";
					}
					if(c.hasOwnProperty("__raw__")){
						instance.__raw__.appendChild(c.__raw__);
						build(c);
					}else{
						try{
							instance.__raw__.appendChild(document.createTextNode(c));
						}catch(error){
							console.warn(error);
						}
					}
				});
			}else{
				try{
					instance.__raw__.appendChild(document.createTextNode(_arr));
				}catch(error){
					console.warn(error);
				}
			}
			/*初步实现待整改，消息代理等等*/
			for(var i in instance.__eventHandle__){
				instance.__raw__.addEventListener(i,instance.__eventHandle__[i]);
			};
		};
		build(topComp);
		ele.appendChild(topComp.__raw__);
	}

	return{
		deF:deF,
		render:render
	}
})();

