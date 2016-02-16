"use strict";
var Smi=(function(){
	var instanceList={renderNum:0,data:{}};
	instanceList.getIns=function(id){
		if(id instanceof Array){
			return id.map(function(val){
				return instanceList.data[val];
			});
		}else{
			return instanceList.data[id];
		}
	};
	instanceList.getParentsID=function(id){
		var ID=id;
		var rtValue=[];
		while(!!(ID=ID.slice(0,-2))){
			rtValue.push(ID);
		}
		return rtValue;
	};
	instanceList.setIns=function(id,content){
		instanceList.data[id]=content;			
	};
	var Attr={};
	Attr. __attr__=["class","data","style","id"];
	Attr.each=function(callback){
		this.__attr__.forEach(function(value){
			callback(value);
		});
	};
	var fns={};
	fns.deepCopy=function(copyTo,obj){
		Object.keys(obj).forEach(function(i){
			if(Object.getPrototypeOf(obj[i])===Object.prototype){
				if(i==="_style_"&&copyTo[i]&&Object.getPrototypeOf(copyTo[i])===Object.prototype){
				}else{
					copyTo[i]={};
				}
				this.deepCopy(copyTo[i],obj[i]);
			}else{
				try{
					copyTo[i]=obj[i];
				}catch(e){
					copyTo={};
					copyTo[i]=obj[i];
					console.warn("the object copyTo may not be a object");
				}
			}
		}.bind(this));
		return copyTo;
	};
	fns.Content=function(initInfo,val){
		this.value=val;
		this.initInfo=initInfo!==undefined?initInfo:"computed";
	};
	fns.diff=function(obj1,obj2){//以obj1为参考 
		var plus,minus;
		if(obj1===undefined){
			if(obj2 instanceof Array) {
				obj1=[];
			}else if((Object.getPrototypeOf(obj2)===Object.prototype)) {
				obj1={};
			}else{
				obj1=" ";
			}
		}
		if((obj1 instanceof Array)&&(obj2 instanceof Array)){
			plus=[];
			minus=[];
			obj1.forEach(function(value){
				if(!(obj2.some((val)=>(value==val)))){
					minus.push(value);
				}
			});
			obj2.forEach(function(value){
				if(!(obj1.some((val)=>(value==val)))){
					plus.push(value);
				}
			});
			if(plus.length===0&&minus.length===0){
				return  true;
			}else{
				return {
					"+":plus,
					"-":minus
				};
			}
		}else if((Object.getPrototypeOf(obj1)===Object.prototype)&&(Object.getPrototypeOf(obj2)===Object.prototype)){
			plus={};
			minus=[];
			Object.keys(obj1).forEach(function(i){
				if(obj2[i]===undefined){
					minus.push(i);
				}else if(obj2[i]===obj1[i]){
					return;
				}else{
					plus[i]=obj2[i];
				}
			});
			Object.keys(obj2).forEach(function(i){
				if(obj1[i]===undefined){
					plus[i]=obj2[i];
				}else if(obj2[i]===obj1[i]){
					return;
				}
			});
			if((Object.keys(plus).length===0)&&(minus.length===0)){
				return true;
			}else{
				return{
					"+":plus,
					"-":minus
				};
			}			
		}else if((typeof obj1==="string")&&(typeof obj2==="string")){
			if (obj1===obj2) {
				return true;
			}else{
				return{
					"+":obj2
				};
			}
		}else{
			return false;
		}
	};
	fns.update=function(instance){
		(function A(){
			Attr.each(function(value){
				var i,diffs;
				if((i=this.prop["_"+value+"_"])!==undefined){
					diffs=fns.diff(this.__currentState__[value],i);
					if(diffs!==true){
						var a={};
						a[value]=diffs;
						this.__opNum__.push(a);
						if(diffs["+"] instanceof Array){
							this.__currentState__[value]=i.slice();
						}else if(typeof diffs["+"]==="string"){
							this.__currentState__[value]=i;
						}else{
							var plus=Object.keys(diffs["+"]);
							var minus=diffs["-"];
							plus.forEach((p)=>{
								this.__currentState__[value][p]=i[p];
							});
							minus.forEach((m)=>{
								delete this.__currentState__[value][m];
							});
						}
					}
				}
			}.bind(this));
			if(this.__opNum__.length!==0){
				this.__opNum__.forEach(function(value){
				var i=Object.keys(value)[0];
				this.__op__(i,"+")(value[i]["+"]);	
				this.__op__(i,"-")(value[i]["-"]);				
				}.bind(this));
				this.__opNum__=[];			
			}
			var _arr1=this.content();
			var _arr2=instanceList.getIns(this.__currentState__.content);
			if(_arr1 instanceof Array){
				_arr1.forEach(function(c,i){
					if (c instanceof Initinfo&&c.__compT==_arr2[i].initInfo.__compT){
						if(c.__dataAdd!==undefined){
							_arr2[i].value.setPropData(c.__dataAdd);
						}
						A.call(_arr2[i].value);
					}else{
						if(_arr2[i].initInfo!=c){
							_arr2[i].initInfo=c;
							_arr2[i].value.nodeValue=c;
						}
					}
				});
			}else{
				if(_arr1 instanceof Initinfo){
					if(_arr1.__dataAdd!==undefined){
						_arr2[0].value.setPropData(_arr1.__dataAdd);
					}
					 A.call(_arr2[0].value);
				}else{
					if(_arr2[0].initInfo!=_arr1){
						_arr2[0].initInfo=_arr1;
						_arr2[0].value.nodeValue=_arr1;
					}
				}
			}
		}).call(instance);
	};
	var EventModel=function(){
		this.rawEvents={};
		this.compEvents={};
	};
	EventModel.__event__={
		MouseEvent:["click","dblClick","mouseup","mousedown","mousemove","contextmenu","mouseover","mouseout",
									"mouseenter","mouseleave"],
		KeyboardEvent:["keydown","keypress","keyup"],
		WheelEvent:["wheel"],
		TouchEvent:["touchstart","touchend","touchmove","touchcancle"],
		CompEvent:["didmount"]
	};
	EventModel.prototype.hasAdd=function(evtType){
		return this.rawEvents.hasOwnProperty(evtType);
	};
	EventModel.prototype.push=function(ins_id,ins_bind_id){
		var ins=instanceList.getIns(ins_id).value;
		var ins_bind=ins_bind_id===undefined?false:instanceList.getIns(ins_bind_id).value;
		for(let i in ins.__eventHandle__){
			if(!this.hasAdd(i)){
				this.rawEvents[i]={};
				this.rawEvents[i].func=(evt)=>{
					var targetId=evt.target.dataset.smiid;
					var eventsLine=[targetId].concat(instanceList.getParentsID(targetId));
					eventsLine.forEach((val)=>{
						if(this.rawEvents[i].hasOwnProperty(val)){
							this.rawEvents[i][val](evt);//待修改的evt 对象
						}
					});					
				};
			}
			if(ins_bind===false){
				this.rawEvents[i][ins_id]=ins.__eventHandle__[i];
			}else{
				this.rawEvents[i][ins_id]=ins.__eventHandle__[i].bind(ins_bind);
			}
		}
		EventModel.__event__.CompEvent.forEach((val)=>{
			if(ins.fns.hasOwnProperty(val)){
				if(!this.compEvents.hasOwnProperty(val)) this.compEvents[val]={};
				this.compEvents[val][ins_id]=ins.fns[val].bind(ins);
			}			
		});
	};
	EventModel.prototype.remove=function(ins_id,eveType,func){
		if(func===undefined){
			delete this.rawEvents[eveType][ins_id];
		}else{
			// this.rawEvents[eveType][ins_id];
		}
	};
	EventModel.prototype.start=function(topComp_id){
		this.push(topComp_id);
		this.root=instanceList.getIns(topComp_id).value.__raw__;
		for(let i in this.rawEvents){
			this.root.addEventListener(i,this.rawEvents[i].func,false);
		}
		for(let i in this.compEvents.didmount){
			this.compEvents.didmount[i]();	
		}
	};
	var	Component=function(compT,dataObj,eveLisObj){
			compT.prop=compT.prop||{};
			this.__prop__=compT.prop;
			this.fns=compT.fns||{};
			this.content=compT.content||(function(){return undefined;});
			this.setPropData(dataObj);
			this.prop._raw_=this.prop._raw_||"div";	
			this.__raw__=document.createElement(this.prop._raw_);	
			this.__eventHandle__=eveLisObj;
			this.__currentState__={};
			this.__opNum__=[];//冻结对象 
	};
	Component.prototype.__op__=function (attr,which){
			var instance=this;
			function opDef(a,d){
				switch(which){
					case "+":
					return function(para){
						if(para!==undefined)a.call(instance,para);
					};
					case "-":
					return function(para){
						if(para!==undefined)d.call(instance,para);
					};				
				}
			}
			switch(attr){
				case "class":
					return opDef(
						function(para){
							if( para instanceof Array){
								para.forEach(function(item){
									this.__raw__.classList.add(item);
								}.bind(this));
							}else{
								this.__raw__.classList.add(para);
							}		
						},
						function(para){
							if( para instanceof Array){
								para.forEach(function(item){
									this.__raw__.classList.remove(item);
								}.bind(this));
							}else{
								this.__raw__.classList.remove(para);
							}										
						}
					);
				case "data":
					return opDef(
						function(para){
							Object.keys(para).forEach(function(item){
								this.__raw__.dataset[item]=para[item];
							}.bind(this));									
						},
						function(para){
							if(para instanceof Array){
								para.forEach(function(item){
									this.__raw__.dataset[item]="";
									delete this.__raw__.dataset[item];
								}.bind(this));
							}else{
								this.__raw__.dataset[item]="";
								delete this.__raw__.dataset[para];
							}	
						}
					);
				case "style":
					return opDef(
						function(para){
							Object.keys(para).forEach(function(item){
								this.__raw__.style[item]=para[item];
							}.bind(this));									
						},
						function(para){
							if( para instanceof Array){
								para.forEach(function(item){
									this.__raw__.style[item]="";
								}.bind(this));
							}else{	
								this.__raw__.style[para]="";
							}
						}
					);
				default:
					return opDef(
						function(para){
							this.__raw__[attr]=para;
						},
						function(para){
							this.__raw__[attr]="";
						}
					);
			}
	};
	Component.prototype.update=function(){
		fns.update(this);
	};
	Component.prototype.setPropData=function(dataObj){
		this.prop=fns.deepCopy(fns.deepCopy({},this.__prop__),dataObj);
	};
	var Initinfo=function(obj,dataObj,eveLisObj){
		this.__compT=obj;
		this.__dataAdd=dataObj;
		this.__eventHandle=eveLisObj;
	};
	var deF=function(obj){
		return function(dataObj,eveLisObj){
			dataObj=dataObj||{};
			eveLisObj=eveLisObj||{};
			return	new	Initinfo(obj,dataObj,eveLisObj);
		};
	};
	var render=function(topCompInfo,ele){
		var build=function(init,id){
			var _id=0;
			var instance=new Component(init.__compT,init.__dataAdd,init.__eventHandle);
			instanceList.setIns(id,new fns.Content(init,instance));
			instance.__id__=id;
			instance.__op__("data","+")({smiid:id});
			Attr.each(function(value){
				var i;
				if((i=instance.prop["_"+value+"_"])!==undefined){
					switch(value){
						case "style":	
						case "data":
							instance.__currentState__[value]={};
							fns.deepCopy(instance.__currentState__[value],i);
							break;
						case "class":
							instance.__currentState__[value]=i.slice();							
							break;
						default:
							instance.__currentState__[value]=i;
					}
					instance.__op__(value,"+")(i);
				}
			});
			var _arr=instance.content();
			instance.__currentState__.content=[];
			if(_arr===undefined){
				console.warn("lack of any required parameter");
				_arr="undefined";
			}
			if(_arr instanceof Array){
				_arr.forEach(function(c){
					var ID=id+"."+(_id++);
					if(c===undefined){
						console.warn("lack of any required parameter");
						c="undefined";
					}
					if(c instanceof Initinfo){
						var rc=build(c,ID);
						instance.__currentState__.content.push(ID);	
						eventModel.push(ID,id);
						instance.__raw__.appendChild(rc.__raw__);					
					}else{
						try{
							var	textNode=document.createTextNode(c);
							instanceList.setIns(ID,new fns.Content(c,textNode));
							instance.__currentState__.content.push(ID);
							instance.__raw__.appendChild(textNode);
						}catch(err){
							console.warn(err);
						}
					}
				});
			}else{
				try{
					var	textNode=document.createTextNode(_arr);
					var i=id+"."+0;
					instanceList.setIns(i,new fns.Content(_arr,textNode));
					instance.__currentState__.content.push(i);
					instance.__raw__.appendChild(textNode);
				}catch(err){
					console.warn(err);
				}
			}
			return instance;
		};
		var eventModel=new EventModel();
		var id=instanceList.renderNum++;
		var rt=build(topCompInfo,id+"");
		eventModel.start(id);
		ele.appendChild(rt.__raw__);
	};
	return {
		deF:deF,
		render:render
	};
})();


