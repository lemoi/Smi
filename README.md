# Smi
`@v0.7.0`
###### this is a smaller and smarter framework similar to React for building front-end page 
The core apis are :
#####1.Smi.deF

it will return a factory function for producing smi-instance 

```javascript
var facFunc=Smi.deF({
	prop:{

	},
	fns:{

	},
	content:function(){
		return something;
	}
});
```
`something` can be a "computed" value such as "1","helle world"... or a smi-instance produced by factory function,and it also can be an array of them.     

the prop contains some special value:
for examples:
```javasctipt
prop:{
	_raw_:"span",//Tag it has a default value "div"
	_style_:{
		width:"100px"
	},
	_class_:["class1","class2"],
	_href_:"http:xxx.com"
	...
}
```
the attribue of Dom element is like `_attr_`

the fns has a special value:

```javasctipt
fns:{
	didmount:function(){//the function will be invoked once the component mounts;
		console.log("mount finished");
	}
}
```
the factory function returned can receive two parameters:

`dataToaddObject`

`evetHandleObject`

`facFunc({dataToAdd},{eventHandleObject})`;

```javascript
var compa=Smi.deF({
	prop:{

	},
	fns:{

	},
	content:function(){
		return this.prop.i;
	}
})
var compb=Smi.deF({
	prop:{
		val:1
	},
	fns:{
		handleClick:function(){
			this.prop.val++;
			this.update();  //this.update is used to update the real Dom 
		}
	},
	content:function(){
		return [compa({i:this.prop.val},{click:this.fns.handleClick},compa({i:this.prop.val}];
	}
})
```
if you want to make your change appear to dom,you must invoke this.update(); 
#####2.Smi.render

```javascript
Smi.render(facFunc({dataToAdd},{eventHandle}),wrapDomElement)
```
Some examples:
```javascript
var A=Smi.deF({
	prop:{},
	fns:{}
	content:function(){
		return this.prop.i;
	}
};
var B=Smi.deF({
	prop:{},
	fns:{
		handleClick:function(){
			console.log("hello world");
		}
	},
	content:function(){
		return [A({i:1}),A{{},{click:handleClick}}];
	}
});
Smi.render(B(),document.getElementById("display"));
```
the result will be:
>hello world

>undefined

if you don't offer the parameters that the childComp required,
the value of the childComp parameter will be String "undefined"

