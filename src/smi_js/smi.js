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
	instanceList.getHigherIDs=function(id){
		var ID=id;
		var rtValue=[];
		rtValue.push(ID);
		while(!!(ID=ID.slice(0,-2))){
			rtValue.push(ID);
		}
		return rtValue;
	};
	instanceList.setIns=function(id,content){
		instanceList.data[id]=content;			
	};
	var Attr={};
	Attr. __attr__=["class","data","style","id","src","name","value","href"];
	Attr.each=function(callback){
		this.__attr__.forEach(function(value){
			callback(value);
		});
	};
	Attr.testRegExp=new RegExp("_([a-z]+)_$");
	var fns={};
	fns.deepCopy=function(copyTo,obj){
		Object.keys(obj).forEach(function(i){
			if(obj[i]===undefined) return;
			else if(obj[i]===null){
				copyTo[i]=null;
				return;
			}
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
	fns.deepDiff=function(Obj1,Obj2){
		for(var i in Obj1){
			if(Obj2[i]===undefined) return false;
			if(Obj1[i]===null){
				if(Obj2[i]===null) continue;
				else return false;				
			}
			if(typeof Obj1[i]==="object"&&typeof Obj2[i]==="object"){
				if(Object.getPrototypeOf(Obj1[i])===Object.getPrototypeOf(Obj2[i])){
					if(fns.deepDiff(Obj1[i], Obj2[i])===false){
						return false;
					}
				}else{
					return false;
				}
			}else{
				if(Obj1[i]!==Obj2[i]) return false;
			}
		}
		for(i in Obj2){
			if(Obj1[i]===undefined) return false;
		}
		return true;		
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
			if(this.__isSpecial__) return;
			var _arr1=this.content();
			var _arr2=instanceList.getIns(this.__currentState__.content);
			if(_arr1 instanceof Array){
				_arr1.forEach(function(c,i){
					if (c instanceof Initinfo&&c.__compT==_arr2[i].initInfo.__compT){
						if(fns.deepDiff(c.__dataAdd,_arr2[i].initInfo.__dataAdd)===true) return;
						_arr2[i].value.setPropData(c.__dataAdd);
						_arr2[i].initInfo.__dataAdd=c.__dataAdd;
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
					if(fns.deepDiff(_arr1.__dataAdd,_arr2[0].initInfo.__dataAdd)===true) return;
						_arr2[0].value.setPropData(_arr1.__dataAdd);
						_arr2[0].initInfo.__dataAdd=_arr1.__dataAdd;
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
	//事件代理对象
	var EventProxy=function(evt){
		this.nativeEvent=evt;
		this.bubbles=true;
		this.immdeiateBubbles=true;
		this.cancelable=evt.cancelable;
		this.defaultPrevented=false;
		this.preventDefault=evt.preventDefault.bind(evt);
		this.type=evt.type;
		this.isTrusted=evt.isTrusted;
		this.target=evt.target;
		this.timeStamp=evt.timeStamp;
		this.currentTarget=null;
		this.init();
	};
	EventProxy.Type={
		Clipboard:["clipboardData"],
		Composition:["data"],
		Keyboard:["altKey","charCode","ctrlKey","key","keyCode","locale","location","metaKey","repeat","shiftKey","which"],
		Focus:["relatedTarget"],
		UI:["detail","view"],
		Wheel:["deltaMode","deltaX","deltaY","deltaZ"],
		Touch:["altKey","changedTouches","ctrlKey","metaKey","shiftKey","targetTouches","touches"],
		Mouse:["altKey","button","buttons","clientX","clientY","ctrlKey","metaKey","pageX","pageY","relatedTarget","screenX","screenY","shiftKey","offsetX","offsetY","getModifierState"],
		Form:[]
	};
	EventProxy.Event={
		copy:"Clipboard",
		cut:"Clipboard",
		paste:"Clipboard",
		compositionend:"Composition",
		compositionstart:"Composition",
		compositionupdate:"Composition",
		keydown:"Keyboard",
		keypress:"Keyboard",
		keyup:"Keyboard",
		focus:"Focus",
		blur:"Focus",
		scroll:"UI",
		wheel:"Wheel",
		mousedown:"Mouse",
		mouseup:"Mouse",
		mousemove:"Mouse",
		click:"Mouse",
		dblclick:"Mouse",
		mouseover:"Mouse",
		mouseout:"Mouse",
		mouseenter:"Mouse",
		mouseleave:"Mouse",
		contextmenu:"Mouse",
		touchstart:"Touch",
		touchend:"Touch",
		touchmove:"Touch",
		touchcancel:"Touch",
		change:"Form",
		submit:"Form",
		input:"Form",
		select:"Form"
	};
	EventProxy.prototype.init=function(){
		EventProxy.Type[EventProxy.Event[this.type]].forEach((val)=>{
			this[val]=this.nativeEvent[val];
		});
	};
	EventProxy.prototype.stopPropagation=function(){
		this.bubbles=false;
		this.nativeEvent.stopPropagation();
	};
	EventProxy.prototype.preventDefault=function(){
		this.defaultPrevented=true;
		this.nativeEvent.preventDefault();
	};
	EventProxy.prototype.stopImmediatePropagation=function(){
		this.immdeiateBubbles=false;
		this.bubbles=false;
		this.nativeEvent.stopImmediatePropagation();
	};
	var EventModel=function(){
		this.rawEvents={};
		this.compEvents={};
	};
	EventModel.instanceList=[];
	EventModel.CompEvent=["init"];
	EventModel.prototype.hasAdd=function(evtType){
		return this.rawEvents.hasOwnProperty(evtType);
	};
	EventModel.prototype.evtFunc=function(evtType){
		var self=this;
		return function(evt){
			var length=Object.keys(self.rawEvents[evtType]).length-1;
			if (length===0) return;
			var targetId=evt.target.dataset.smiid;
			var eventsLine=instanceList.getHigherIDs(targetId);
			var event=new EventProxy(evt),val,j=0;
			for(var i=0;i<eventsLine.length;i++){
				val=eventsLine[i];
				if(self.rawEvents[evtType].hasOwnProperty(val)){
					event.currentTarget=instanceList.getIns(val).value;
					if(self.rawEvents[evtType][val] instanceof Array){
						for(var h in self.rawEvents[evtType][val]){
							self.rawEvents[evtType][val][h](event);
							if(!event.immdeiateBubbles) return;
						}
					}else{
						self.rawEvents[evtType][val](event);
					}
					if(!event.bubbles) return;
					j++;
					if(j===length) return;
				}
			}
		};	
	};
	EventModel.prototype.push=function(ins_id){
		var ins=instanceList.getIns(ins_id).value;
		for(var i in ins.__eventHandle__){
			if(!this.hasAdd(i)) this.rawEvents[i]={};
			this.rawEvents[i][ins_id]=ins.__eventHandle__[i];
		}
		EventModel.CompEvent.forEach((val)=>{
			if(ins.fns.hasOwnProperty(val)){
				if(!this.compEvents.hasOwnProperty(val)) this.compEvents[val]={};
				this.compEvents[val][ins_id]=ins.fns[val].bind(ins);
			}			
		});
	};
	EventModel.prototype.on=function(type,call,insId){
		if(!this.hasAdd(type)) { 
			this.rawEvents[type]={};
			this.rawEvents[type][insId]=call;
			this.rawEvents[type].handleFunc=this.evtFunc(type);
			this.root.addEventListener(type,this.rawEvents[type].handleFunc,false);
			return;		
		}
		if(this.rawEvents[type][insId]!==undefined){
			var arr=[];
			arr.push(this.rawEvents[type][insId]);
			arr.push(call);
			this.rawEvents[type][insId]=arr;
		}else{
			this.rawEvents[type][insId]=call;		
		}
	};
	EventModel.prototype.off=function(type,insId){
		try{
			delete this.rawEvents[type][insId];
			if(Object.keys(this.rawEvents[type]).length===1){
				this.root.removeEventListener(type,this.rawEvents[type].handleFunc);
				delete this.rawEvents[type];
			} 
		}catch(err){
			console.warn("smiid-"+insId+" : the "+type+" event has not been attached");
		}
	};
	EventModel.prototype.hasOn=function(type,insId){
		try{
			if(this.rawEvents[type].hasOwnProperty(insId)) return true;
			else return false;
		}catch(err){
			return false;
		}
	};
	EventModel.prototype.remove=function(ins_id,eveType){
		if(this.rawEvents[eveType][ins_id])
			delete this.rawEvents[eveType][ins_id];
	};
	EventModel.prototype.start=function(topComp_id){
		this.push(topComp_id);
		this.root=instanceList.getIns(topComp_id).value.__raw__;
		var i;
		for(i in this.rawEvents){
			this.rawEvents[i].handleFunc=this.evtFunc(i);
			this.root.addEventListener(i,this.rawEvents[i].handleFunc,false);
		}
		EventModel.instanceList.push(this);
		for(i in this.compEvents.init){
			this.compEvents.init[i]();
		}
	};
	var	Component=function(compT,dataObj,eveLisObj){
			compT.prop=compT.prop||{};
			this.__prop__=compT.prop;
			this.fnsCopy(compT.fns);
			this.content=compT.content||(function(){return undefined;});
			this.setPropData(dataObj);
			this.prop._raw_=this.prop._raw_||"div";
			this.__isSpecial__=false;	
			this.__raw__=document.createElement(this.prop._raw_);	
			this.__eventHandle__=eveLisObj;
			this.__currentState__={};
			this.__opNum__=[];//冻结对象
	};
	Component.prototype.fnsCopy=function(fns){
		this.fns={};
		if(fns===undefined) return;
		for(var i in fns){
			this.fns[i]=fns[i].bind(this);
		}
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
	Component.prototype.off=function(type){
		EventModel.instanceList[this.__id__[0]].off(type,this.__id__);
	};
	Component.prototype.on=function(type,call){
		EventModel.instanceList[this.__id__[0]].on(type,call,this.__id__);
	};
	Component.prototype.hasOn=function(type){
		return EventModel.instanceList[this.__id__[0]].hasOn(type,this.__id__);
	};
	Component.prototype.share=function(key,value){
		if(Component.ShareParaList.hasOwnProperty(key)){
			if(Component.ShareParaList[key].sharer_id!==this.__id__)
				console.warn("some shared parameter has been covered");
		}
		Component.ShareParaList[key]={sharer_id:this.__id__,value:value===undefined?null:value};
	};
	Component.prototype.getShared=function(key){
		if(!Component.ShareParaList.hasOwnProperty(key)){
			console.warn("the shared value does't exit");
			return null;
		}else{
			if(new RegExp("^"+Component.ShareParaList[key].sharer_id).test(this.__id__)){
				return Component.ShareParaList[key].value;
			}else{
				console.warn("have no access to get the value");
				return null;
			}
		}
	};
	Component.ShareParaList={};
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
			var buildContent=function(c){
				var ID=id+"."+(_id++);
				if(c instanceof Initinfo){
					var rc=build(c,ID);
					instance.__currentState__.content.push(ID);	
					eventModel.push(ID);
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
			};
			var _id=0;
			var instance=new Component(init.__compT,init.__dataAdd,init.__eventHandle);
			instanceList.setIns(id,new fns.Content(init,instance));
			instance.__id__=id;
			instance.__op__("data","+")({smiid:id});
			Object.keys(instance.prop).forEach(function(value){
				var result=Attr.testRegExp.exec(value);
				if(result!==null){
					switch(result[1]){
						case "style":	
						case "data":
							instance.__currentState__[result[1]]={};
							fns.deepCopy(instance.__currentState__[result[1]],instance.prop[value]);
							break;
						case "class":
							instance.__currentState__[result[1]]=instance.prop[value].slice();							
							break;
						default:
							instance.__currentState__[result[1]]=instance.prop[value];
					}
					instance.__op__(result[1],"+")(instance.prop[value]);
				}
			});
			var _arr=instance.content();
			if(_arr===false){
				instance.__isSpecial__=true;
			}else{
				instance.__currentState__.content=[];
				if(_arr===undefined){
					console.warn("lack of any required parameter");
					_arr="undefined";
				}else if(_arr===null){
					_arr="null";
				}
				if(_arr instanceof Array){
					_arr.forEach(function(c){
						if(c===undefined){
							console.warn("lack of any required parameter");
							c="undefined";
						}else if(_arr===null){
							c="null";
						}
						buildContent(c);
					});
				}else{
					buildContent(_arr);					
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